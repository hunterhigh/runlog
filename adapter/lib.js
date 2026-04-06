import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const REQUIRED_FIELDS = ["id", "kind", "display_name", "source_root"];

export async function loadManifest(manifestPath) {
  const absoluteManifestPath = path.resolve(manifestPath);
  const manifest = JSON.parse(await fs.readFile(absoluteManifestPath, "utf8"));

  for (const field of REQUIRED_FIELDS) {
    if (!manifest[field]) {
      throw new Error(`Manifest ${absoluteManifestPath} is missing required field "${field}"`);
    }
  }

  const sourceRoot = path.resolve(manifest.source_root);
  const versionHash = await computeVersionHash(sourceRoot);

  return {
    manifestPath: absoluteManifestPath,
    manifest,
    sourceRoot,
    versionHash: `sha256:${versionHash}`,
  };
}

export async function syncRegistry({ manifestPaths, registryPath }) {
  const records = [];

  for (const manifestPath of manifestPaths) {
    const { manifest } = await loadManifest(manifestPath);
    records.push(manifest);
  }

  await fs.mkdir(path.dirname(path.resolve(registryPath)), { recursive: true });
  await fs.writeFile(path.resolve(registryPath), `${JSON.stringify(records, null, 2)}\n`);
}

export async function appendEvent({ ledgerPath, event }) {
  await fs.mkdir(path.dirname(path.resolve(ledgerPath)), { recursive: true });
  await fs.appendFile(path.resolve(ledgerPath), `${JSON.stringify(event)}\n`);
}

export async function runWrappedCommand({
  command,
  args = [],
  cwd,
  env = process.env,
}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("close", (code, signal) => {
      resolve({
        code: code ?? 1,
        signal: signal ?? null,
      });
    });
  });
}

export async function buildSkillStartEvent({
  manifestPath,
  invocationId,
  triggerType,
  sessionId,
  inputSummary,
  taskId,
  projectId,
  actorId,
}) {
  const { manifest, versionHash } = await loadManifest(manifestPath);
  return {
    event_type: "skill_invocation_started",
    occurred_at: new Date().toISOString(),
    skill_invocation_id: invocationId,
    skill_id: manifest.id,
    skill_version_hash: versionHash,
    trigger_type: triggerType,
    session_id: sessionId,
    task_id: taskId,
    project_id: projectId,
    actor_id: actorId,
    input_summary: inputSummary,
  };
}

export async function buildSkillCompleteEvent({
  manifestPath,
  invocationId,
  outcome,
  errorSummary,
  evidence,
}) {
  const { manifest, versionHash } = await loadManifest(manifestPath);
  return {
    event_type: "skill_invocation_completed",
    occurred_at: new Date().toISOString(),
    skill_invocation_id: invocationId,
    skill_id: manifest.id,
    skill_version_hash: versionHash,
    outcome,
    ...(errorSummary ? { error_summary: errorSummary } : {}),
    ...(evidence.length ? { evidence } : {}),
  };
}

export async function buildPluginStartEvent({
  manifestPath,
  skillInvocationId,
  pluginInvocationId,
  actionName,
}) {
  const { manifest, versionHash } = await loadManifest(manifestPath);
  return {
    event_type: "plugin_invocation_started",
    occurred_at: new Date().toISOString(),
    plugin_invocation_id: pluginInvocationId,
    skill_invocation_id: skillInvocationId,
    plugin_id: manifest.id,
    plugin_version_hash: versionHash,
    action_name: actionName,
  };
}

export async function buildPluginCompleteEvent({
  manifestPath,
  skillInvocationId,
  pluginInvocationId,
  actionName,
  outcome,
  errorSummary,
}) {
  const { manifest, versionHash } = await loadManifest(manifestPath);
  return {
    event_type: "plugin_invocation_completed",
    occurred_at: new Date().toISOString(),
    plugin_invocation_id: pluginInvocationId,
    skill_invocation_id: skillInvocationId,
    plugin_id: manifest.id,
    plugin_version_hash: versionHash,
    action_name: actionName,
    outcome,
    ...(errorSummary ? { error_summary: errorSummary } : {}),
  };
}

async function computeVersionHash(sourceRoot) {
  const files = await listFiles(sourceRoot);
  const hash = crypto.createHash("sha256");

  for (const filePath of files) {
    const relativePath = path.relative(sourceRoot, filePath).split(path.sep).join("/");
    hash.update(`${relativePath}\n`);
    hash.update(await fs.readFile(filePath));
    hash.update("\n");
  }

  return hash.digest("hex");
}

async function listFiles(directoryPath) {
  const absoluteDirectoryPath = path.resolve(directoryPath);
  const entries = await fs.readdir(absoluteDirectoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const entryPath = path.join(absoluteDirectoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(entryPath)));
      continue;
    }
    if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}
