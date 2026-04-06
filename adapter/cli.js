#!/usr/bin/env node
import {
  appendEvent,
  buildPluginCompleteEvent,
  buildPluginStartEvent,
  buildSkillCompleteEvent,
  buildSkillStartEvent,
  runWrappedCommand,
  syncRegistry,
} from "./lib.js";

const DEFAULT_LEDGER_PATH = "data/runtime-events.jsonl";
const DEFAULT_REGISTRY_PATH = "data/governed-objects.json";

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const args = parseArgs(extractOptionArgs(rest));

  switch (command) {
    case "sync-registry":
      await handleSyncRegistry(args);
      return;
    case "skill-start":
      await handleEvent(buildSkillStartEvent, args, [
        "manifest",
        "invocation-id",
        "trigger",
        "session",
        "input",
      ]);
      return;
    case "skill-complete":
      await handleEvent(buildSkillCompleteEvent, args, [
        "manifest",
        "invocation-id",
        "outcome",
      ]);
      return;
    case "plugin-start":
      await handleEvent(buildPluginStartEvent, args, [
        "manifest",
        "skill-invocation-id",
        "plugin-invocation-id",
        "action",
      ]);
      return;
    case "plugin-complete":
      await handleEvent(buildPluginCompleteEvent, args, [
        "manifest",
        "skill-invocation-id",
        "plugin-invocation-id",
        "action",
        "outcome",
      ]);
      return;
    case "run-skill":
      await handleRunSkill(args, rest);
      return;
    case "run-plugin":
      await handleRunPlugin(args, rest);
      return;
    default:
      printUsage();
  }
}

async function handleSyncRegistry(args) {
  const manifests = collectValues(args.manifest);
  if (!manifests.length) {
    throw new Error("sync-registry requires at least one --manifest");
  }

  await syncRegistry({
    manifestPaths: manifests,
    registryPath: args.registry ?? DEFAULT_REGISTRY_PATH,
  });

  console.log(`synced ${manifests.length} governed objects`);
}

async function handleEvent(builder, args, requiredFields) {
  for (const field of requiredFields) {
    if (!args[field]) {
      throw new Error(`Missing required argument --${field}`);
    }
  }

  const evidence = collectValues(args.evidence).map((value) => {
    const [kind, ...rest] = value.split(":");
    return {
      kind,
      value: rest.join(":"),
    };
  });

  const event = await builder({
    manifestPath: args.manifest,
    invocationId: args["invocation-id"],
    triggerType: args.trigger,
    sessionId: args.session,
    inputSummary: args.input,
    taskId: args.task,
    projectId: args.project,
    actorId: args.actor,
    outcome: args.outcome,
    errorSummary: args.error,
    evidence,
    skillInvocationId: args["skill-invocation-id"],
    pluginInvocationId: args["plugin-invocation-id"],
    actionName: args.action,
  });

  await appendEvent({
    ledgerPath: args.ledger ?? DEFAULT_LEDGER_PATH,
    event,
  });

  console.log(`${event.event_type} -> ${args.ledger ?? DEFAULT_LEDGER_PATH}`);
}

async function handleRunSkill(args, rawArgs) {
  for (const field of ["manifest", "trigger", "session", "input"]) {
    if (!args[field]) {
      throw new Error(`Missing required argument --${field}`);
    }
  }

  const delimiterIndex = rawArgs.indexOf("--");
  if (delimiterIndex === -1 || delimiterIndex === rawArgs.length - 1) {
    throw new Error("run-skill requires a wrapped command after --");
  }

  const wrappedCommand = rawArgs.slice(delimiterIndex + 1);
  const [command, ...commandArgs] = wrappedCommand;
  const invocationId = args["invocation-id"] ?? `skill-inv-${Date.now()}`;
  const ledgerPath = args.ledger ?? DEFAULT_LEDGER_PATH;

  const startEvent = await buildSkillStartEvent({
    manifestPath: args.manifest,
    invocationId,
    triggerType: args.trigger,
    sessionId: args.session,
    inputSummary: args.input,
    taskId: args.task,
    projectId: args.project,
    actorId: args.actor,
  });

  await appendEvent({
    ledgerPath,
    event: startEvent,
  });

  const result = await runWrappedCommand({
    command,
    args: commandArgs,
    cwd: args.cwd,
    env: {
      ...process.env,
      CODEX_GOVERNANCE_SKILL_INVOCATION_ID: invocationId,
      CODEX_GOVERNANCE_LEDGER_PATH: ledgerPath,
    },
  });

  const outcome = result.code === 0 ? "success" : "failure";
  const evidence = [
    {
      kind: "command",
      value: [command, ...commandArgs].join(" "),
    },
  ];

  if (result.signal) {
    evidence.push({
      kind: "note",
      value: `signal:${result.signal}`,
    });
  }

  const completeEvent = await buildSkillCompleteEvent({
    manifestPath: args.manifest,
    invocationId,
    outcome,
    errorSummary: result.code === 0 ? undefined : `wrapped command exited with code ${result.code}`,
    evidence,
  });

  await appendEvent({
    ledgerPath,
    event: completeEvent,
  });

  console.log(`run-skill completed with ${outcome} -> ${ledgerPath}`);
  process.exitCode = result.code;
}

async function handleRunPlugin(args, rawArgs) {
  const inheritedSkillInvocationId =
    args["skill-invocation-id"] ?? process.env.CODEX_GOVERNANCE_SKILL_INVOCATION_ID;

  for (const field of ["manifest", "action"]) {
    if (!args[field]) {
      throw new Error(`Missing required argument --${field}`);
    }
  }
  if (!inheritedSkillInvocationId) {
    throw new Error("Missing required argument --skill-invocation-id or CODEX_GOVERNANCE_SKILL_INVOCATION_ID");
  }

  const delimiterIndex = rawArgs.indexOf("--");
  if (delimiterIndex === -1 || delimiterIndex === rawArgs.length - 1) {
    throw new Error("run-plugin requires a wrapped command after --");
  }

  const wrappedCommand = rawArgs.slice(delimiterIndex + 1);
  const [command, ...commandArgs] = wrappedCommand;
  const pluginInvocationId = args["plugin-invocation-id"] ?? `plugin-inv-${Date.now()}`;
  const ledgerPath =
    args.ledger ?? process.env.CODEX_GOVERNANCE_LEDGER_PATH ?? DEFAULT_LEDGER_PATH;

  const startEvent = await buildPluginStartEvent({
    manifestPath: args.manifest,
    skillInvocationId: inheritedSkillInvocationId,
    pluginInvocationId,
    actionName: args.action,
  });

  await appendEvent({
    ledgerPath,
    event: startEvent,
  });

  const result = await runWrappedCommand({
    command,
    args: commandArgs,
    cwd: args.cwd,
    env: {
      ...process.env,
      CODEX_GOVERNANCE_SKILL_INVOCATION_ID: inheritedSkillInvocationId,
      CODEX_GOVERNANCE_LEDGER_PATH: ledgerPath,
    },
  });

  const outcome = result.code === 0 ? "success" : "failure";
  const completeEvent = await buildPluginCompleteEvent({
    manifestPath: args.manifest,
    skillInvocationId: inheritedSkillInvocationId,
    pluginInvocationId,
    actionName: args.action,
    outcome,
    errorSummary: result.code === 0 ? undefined : `wrapped command exited with code ${result.code}`,
  });

  await appendEvent({
    ledgerPath,
    event: completeEvent,
  });

  console.log(`run-plugin completed with ${outcome} -> ${ledgerPath}`);
  process.exitCode = result.code;
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;

    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }

    if (args[key]) {
      args[key] = [args[key], next].flat();
    } else {
      args[key] = next;
    }
    index += 1;
  }

  return args;
}

function extractOptionArgs(argv) {
  const delimiterIndex = argv.indexOf("--");
  if (delimiterIndex === -1) {
    return argv;
  }
  return argv.slice(0, delimiterIndex);
}

function collectValues(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function printUsage() {
  console.log(`Usage:
  node adapter/cli.js sync-registry --manifest examples/skill.manifest.json --manifest examples/plugin.manifest.json [--registry data/governed-objects.json]
  node adapter/cli.js skill-start --manifest examples/skill.manifest.json --invocation-id skill-inv-001 --trigger explicit --session session-123 --input "Review latest diff"
  node adapter/cli.js skill-complete --manifest examples/skill.manifest.json --invocation-id skill-inv-001 --outcome success [--evidence note:2-findings]
  node adapter/cli.js plugin-start --manifest examples/plugin.manifest.json --skill-invocation-id skill-inv-001 --plugin-invocation-id plugin-inv-001 --action fetch_pr_patch
  node adapter/cli.js plugin-complete --manifest examples/plugin.manifest.json --skill-invocation-id skill-inv-001 --plugin-invocation-id plugin-inv-001 --action fetch_pr_patch --outcome success
  node adapter/cli.js run-skill --manifest examples/skill.manifest.json --trigger explicit --session session-123 --input "Review latest diff" -- node -e "console.log('wrapped')"
  node adapter/cli.js run-plugin --manifest examples/plugin.manifest.json --skill-invocation-id skill-inv-001 --action fetch_pr_patch -- node -e "console.log('wrapped plugin')"`); 
}
