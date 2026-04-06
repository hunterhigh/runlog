const objectSources = [
  "../data/governed-objects.json",
  "../examples/skill.manifest.json",
  "../examples/plugin.manifest.json",
];

const runtimeSources = [
  "../data/runtime-events.jsonl",
  "../examples/runtime-events.jsonl",
];

const defaultRuntimeSource = "../data/runtime-events.jsonl";
const nestedRuntimeSource = "../data/nested-runtime-events.jsonl";

const params = new URLSearchParams(window.location.search);
const runtimeSourceOverride = params.get("ledger");
const languageOverride = params.get("lang");

const translations = {
  en: {
    appTitle: "Codex Governance Console",
    appSubtitle: "Versioned skill and plugin runtime ledger",
    languageLabel: "Language",
    ledgerPresetLabel: "Ledger",
    customLedgerLabel: "Custom ledger path",
    loadButton: "Load",
    presetDefault: "Default",
    presetNested: "Nested demo",
    presetCustom: "Custom",
    statusLabel: "Status",
    sourceLabel: "Source",
    updatedLabel: "Latest event",
    summaryTitle: "Summary",
    overviewTitle: "Overview",
    topSkillsTitle: "Top skills",
    topPluginsTitle: "Top plugins",
    recentFailuresTitle: "Recent failures",
    observedVersionsTitle: "Observed versions",
    invocationTitle: "Invocation ledger",
    objectsTitle: "Governed objects",
    compareTitle: "Version compare",
    skillFilterLabel: "Skill",
    outcomeFilterLabel: "Outcome",
    triggerFilterLabel: "Trigger",
    objectKindLabel: "Kind",
    compareObjectLabel: "Object",
    compareLeftLabel: "Base",
    compareRightLabel: "Target",
    all: "All",
    select: "Select",
    success: "Success",
    failure: "Failure",
    cancelled: "Cancelled",
    degraded: "Degraded",
    explicit: "Explicit",
    keyword: "Keyword",
    autonomous: "Autonomous",
    skill: "Skill",
    plugin: "Plugin",
    loading: "Loading",
    resolving: "Resolving",
    waiting: "Waiting for data",
    loadFailed: "Load failed",
    skillInvocations: "Skill invocations",
    pluginCalls: "Plugin calls",
    failureRecords: "Failure records",
    versionFingerprints: "Version fingerprints",
    skillsObserved: "skills observed",
    pluginsObserved: "plugins observed",
    failureCombined: "Skill and plugin failures combined",
    fingerprintObserved: "Unique content-hash observations",
    invocations: "invocations",
    pluginCallUnit: "plugin calls",
    observations: "observations",
    versions: "versions",
    failed: "failed",
    noData: "No data yet.",
    noFailures: "No failures recorded.",
    noMatchingInvocations: "No invocations match the current filters.",
    noMatchingObjects: "No governed objects match the current filter.",
    noInvocationSelected: "No invocation is selected for the current filters.",
    noObjectSelected: "No governed object is selected for the current filter.",
    noPluginCalls: "No plugin calls were linked to this invocation.",
    noEvidence: "No evidence pointers were recorded.",
    noActivity: "No activity recorded for this object.",
    noVersions: "No observed versions yet.",
    compareEmpty: "Select one governed object and two observed versions to compare their runtime behavior.",
    detailInvocation: "Invocation detail",
    inputSummary: "Input summary",
    pluginLineage: "Plugin lineage",
    evidence: "Evidence",
    objectPage: "Object page",
    recentActivity: "Recent activity",
    sourceRoot: "Source root",
    latestObserved: "Latest observed",
    latestVersion: "Latest version",
    kind: "Kind",
    started: "Started",
    completed: "Completed",
    actor: "Actor",
    session: "Session",
    task: "Task",
    project: "Project",
    version: "Version",
    outcome: "Outcome",
    command: "Command",
    latestEventPrefix: "Latest event",
    loadedSuffix: "invocations loaded",
    currentSkillContext: "current skill context",
    linkedCalls: "linked calls",
    items: "items",
    selectInvocationHint: "Select an invocation to inspect its skill context, linked plugins, and evidence.",
    selectObjectHint: "Select a skill or plugin to inspect versions, usage, and recent failures.",
    sourceUnknown: "unknown",
    inProgress: "In progress",
    completeWithoutError: "Completed without recorded error.",
    noTimestamp: "No timestamp",
    observationDelta: "Observation delta",
    failureDelta: "Failure delta",
    failureRate: "Failure rate",
    base: "Base",
    target: "Target",
    sourceLoadHelp: "Unable to load local data. Serve the repository root over HTTP, for example: python3 -m http.server 4173",
  },
  "zh-CN": {
    appTitle: "Codex 治理控制台",
    appSubtitle: "带版本的 skill / plugin 运行账本",
    languageLabel: "语言",
    ledgerPresetLabel: "账本",
    customLedgerLabel: "自定义账本路径",
    loadButton: "加载",
    presetDefault: "默认账本",
    presetNested: "嵌套演示",
    presetCustom: "自定义",
    statusLabel: "状态",
    sourceLabel: "来源",
    updatedLabel: "最新事件",
    summaryTitle: "概览统计",
    overviewTitle: "总体看板",
    topSkillsTitle: "高频技能",
    topPluginsTitle: "高频插件",
    recentFailuresTitle: "最近失败",
    observedVersionsTitle: "观测版本",
    invocationTitle: "调用账本",
    objectsTitle: "治理对象",
    compareTitle: "版本对比",
    skillFilterLabel: "技能",
    outcomeFilterLabel: "结果",
    triggerFilterLabel: "触发方式",
    objectKindLabel: "类型",
    compareObjectLabel: "对象",
    compareLeftLabel: "基线版本",
    compareRightLabel: "目标版本",
    all: "全部",
    select: "选择",
    success: "成功",
    failure: "失败",
    cancelled: "取消",
    degraded: "降级",
    explicit: "显式",
    keyword: "关键词",
    autonomous: "自主",
    skill: "技能",
    plugin: "插件",
    loading: "加载中",
    resolving: "解析中",
    waiting: "等待数据",
    loadFailed: "加载失败",
    skillInvocations: "技能调用",
    pluginCalls: "插件调用",
    failureRecords: "失败记录",
    versionFingerprints: "版本指纹",
    skillsObserved: "个技能",
    pluginsObserved: "个插件",
    failureCombined: "技能与插件失败合计",
    fingerprintObserved: "唯一内容哈希数量",
    invocations: "次调用",
    pluginCallUnit: "次插件调用",
    observations: "次观测",
    versions: "个版本",
    failed: "条失败",
    noData: "暂无数据。",
    noFailures: "暂无失败记录。",
    noMatchingInvocations: "当前筛选条件下没有调用记录。",
    noMatchingObjects: "当前筛选条件下没有治理对象。",
    noInvocationSelected: "当前筛选条件下没有选中的调用记录。",
    noObjectSelected: "当前筛选条件下没有选中的治理对象。",
    noPluginCalls: "该调用没有关联的插件记录。",
    noEvidence: "该调用没有记录证据项。",
    noActivity: "该对象暂无活动记录。",
    noVersions: "该对象暂无观测版本。",
    compareEmpty: "请选择一个治理对象和两个已观测版本进行对比。",
    detailInvocation: "调用详情",
    inputSummary: "输入摘要",
    pluginLineage: "插件链路",
    evidence: "证据",
    objectPage: "对象页",
    recentActivity: "最近活动",
    sourceRoot: "源路径",
    latestObserved: "最近观测",
    latestVersion: "最近版本",
    kind: "类型",
    started: "开始时间",
    completed: "结束时间",
    actor: "执行者",
    session: "会话",
    task: "任务",
    project: "项目",
    version: "版本",
    outcome: "结果",
    command: "命令",
    latestEventPrefix: "最新事件",
    loadedSuffix: "条调用已加载",
    currentSkillContext: "当前 skill 上下文",
    linkedCalls: "个关联调用",
    items: "项",
    selectInvocationHint: "选择一条调用记录，查看 skill 上下文、插件链路和证据。",
    selectObjectHint: "选择一个 skill 或 plugin，查看版本、使用情况和失败记录。",
    sourceUnknown: "未知",
    inProgress: "执行中",
    completeWithoutError: "执行完成，未记录错误。",
    noTimestamp: "无时间",
    observationDelta: "观测差值",
    failureDelta: "失败差值",
    failureRate: "失败率",
    base: "基线",
    target: "目标",
    sourceLoadHelp: "无法加载本地数据。请先以 HTTP 方式启动仓库目录，例如：python3 -m http.server 4173",
  },
};

const state = {
  locale: translations[languageOverride] ? languageOverride : "en",
  objects: new Map(),
  invocations: [],
  objectSummaries: [],
  selectedInvocationId: null,
  selectedObjectId: null,
  activeRuntimeSource: "",
  filters: {
    skill: "",
    outcome: "",
    trigger: "",
    objectKind: "",
    compareObjectId: "",
    compareLeftVersion: "",
    compareRightVersion: "",
  },
};

const elements = {
  appTitle: document.querySelector("#app-title"),
  appSubtitle: document.querySelector("#app-subtitle"),
  languageLabel: document.querySelector("#language-label"),
  languageSelect: document.querySelector("#language-select"),
  ledgerPresetLabel: document.querySelector("#ledger-preset-label"),
  customLedgerLabel: document.querySelector("#custom-ledger-label"),
  ledgerPreset: document.querySelector("#ledger-preset"),
  customLedgerWrap: document.querySelector("#custom-ledger-wrap"),
  customLedgerInput: document.querySelector("#custom-ledger-input"),
  applyLedger: document.querySelector("#apply-ledger"),
  statusLabel: document.querySelector("#status-label"),
  loadingSpinner: document.querySelector("#loading-spinner"),
  sourceLabel: document.querySelector("#source-label"),
  updatedLabel: document.querySelector("#updated-label"),
  ledgerStatus: document.querySelector("#ledger-status"),
  ledgerSource: document.querySelector("#ledger-source"),
  lastUpdated: document.querySelector("#last-updated"),
  summaryTitle: document.querySelector("#summary-title"),
  overviewTitle: document.querySelector("#overview-title"),
  topSkillsTitle: document.querySelector("#top-skills-title"),
  topPluginsTitle: document.querySelector("#top-plugins-title"),
  recentFailuresTitle: document.querySelector("#recent-failures-title"),
  observedVersionsTitle: document.querySelector("#observed-versions-title"),
  invocationTitle: document.querySelector("#invocation-title"),
  objectsTitle: document.querySelector("#objects-title"),
  compareTitle: document.querySelector("#compare-title"),
  skillFilterLabel: document.querySelector("#skill-filter-label"),
  outcomeFilterLabel: document.querySelector("#outcome-filter-label"),
  triggerFilterLabel: document.querySelector("#trigger-filter-label"),
  objectKindLabel: document.querySelector("#object-kind-label"),
  compareObjectLabel: document.querySelector("#compare-object-label"),
  compareLeftLabel: document.querySelector("#compare-left-label"),
  compareRightLabel: document.querySelector("#compare-right-label"),
  metrics: document.querySelector("#metrics"),
  skillCount: document.querySelector("#skill-count"),
  pluginCount: document.querySelector("#plugin-count"),
  failureCount: document.querySelector("#failure-count"),
  versionCount: document.querySelector("#version-count"),
  skillsList: document.querySelector("#skills-list"),
  pluginsList: document.querySelector("#plugins-list"),
  failuresList: document.querySelector("#failures-list"),
  versionsList: document.querySelector("#versions-list"),
  invocationList: document.querySelector("#invocation-list"),
  invocationDetail: document.querySelector("#invocation-detail"),
  objectList: document.querySelector("#object-list"),
  objectDetail: document.querySelector("#object-detail"),
  skillFilter: document.querySelector("#skill-filter"),
  outcomeFilter: document.querySelector("#outcome-filter"),
  triggerFilter: document.querySelector("#trigger-filter"),
  objectKindFilter: document.querySelector("#object-kind-filter"),
  compareObjectFilter: document.querySelector("#compare-object-filter"),
  compareLeftFilter: document.querySelector("#compare-left-filter"),
  compareRightFilter: document.querySelector("#compare-right-filter"),
  comparePanel: document.querySelector("#compare-panel"),
  stackTemplate: document.querySelector("#stack-item-template"),
};

bootstrap();

async function bootstrap() {
  bindControls();
  applyStaticText();

  try {
    const [objects, rawEvents] = await Promise.all([loadObjects(), loadRuntimeEvents()]);
    state.objects = objects;
    state.invocations = projectInvocations(rawEvents, objects);
    state.objectSummaries = buildObjectSummaries(state.invocations, objects);
    state.selectedInvocationId = state.invocations[0]?.id ?? null;
    state.selectedObjectId = state.objectSummaries[0]?.id ?? null;
    state.filters.compareObjectId = state.selectedObjectId ?? "";

    hydrateFilterOptions();
    hydrateCompareObjectOptions();
    hydrateCompareVersionOptions();
    render();
    elements.loadingSpinner.hidden = true;
  } catch (error) {
    elements.ledgerStatus.textContent = t("loadFailed");
    elements.loadingSpinner.hidden = true;
    elements.invocationDetail.innerHTML = renderEmpty(t("sourceLoadHelp"));
    elements.objectDetail.innerHTML = renderEmpty(t("sourceLoadHelp"));
    elements.comparePanel.innerHTML = renderEmpty(t("sourceLoadHelp"));
    console.error(error);
  }
}

function bindControls() {
  initializeLedgerControls();

  elements.languageSelect.value = state.locale;
  elements.languageSelect.addEventListener("change", () => {
    const url = new URL(window.location.href);
    const locale = elements.languageSelect.value;
    if (locale === "en") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", locale);
    }
    window.location.href = url.toString();
  });

  elements.skillFilter.addEventListener("change", (event) => {
    state.filters.skill = event.target.value;
    ensureSelectedInvocationVisible();
    render();
  });
  elements.outcomeFilter.addEventListener("change", (event) => {
    state.filters.outcome = event.target.value;
    ensureSelectedInvocationVisible();
    render();
  });
  elements.triggerFilter.addEventListener("change", (event) => {
    state.filters.trigger = event.target.value;
    ensureSelectedInvocationVisible();
    render();
  });
  elements.objectKindFilter.addEventListener("change", (event) => {
    state.filters.objectKind = event.target.value;
    ensureSelectedObjectVisible();
    render();
  });
  elements.compareObjectFilter.addEventListener("change", (event) => {
    state.filters.compareObjectId = event.target.value;
    hydrateCompareVersionOptions();
    render();
  });
  elements.compareLeftFilter.addEventListener("change", (event) => {
    state.filters.compareLeftVersion = event.target.value;
    render();
  });
  elements.compareRightFilter.addEventListener("change", (event) => {
    state.filters.compareRightVersion = event.target.value;
    render();
  });
}

function initializeLedgerControls() {
  if (runtimeSourceOverride === nestedRuntimeSource) {
    elements.ledgerPreset.value = "nested";
  } else if (runtimeSourceOverride) {
    elements.ledgerPreset.value = "custom";
    elements.customLedgerWrap.hidden = false;
    elements.customLedgerInput.value = runtimeSourceOverride;
  } else {
    elements.ledgerPreset.value = "default";
  }

  elements.ledgerPreset.addEventListener("change", () => {
    const preset = elements.ledgerPreset.value;
    elements.customLedgerWrap.hidden = preset !== "custom";
    if (preset === "nested") elements.customLedgerInput.value = nestedRuntimeSource;
    if (preset === "default") elements.customLedgerInput.value = "";
  });

  elements.applyLedger.addEventListener("click", () => {
    const url = new URL(window.location.href);
    const preset = elements.ledgerPreset.value;
    if (preset === "default") {
      url.searchParams.delete("ledger");
    } else if (preset === "nested") {
      url.searchParams.set("ledger", nestedRuntimeSource);
    } else {
      const customValue = elements.customLedgerInput.value.trim();
      if (!customValue) return elements.customLedgerInput.focus();
      url.searchParams.set("ledger", customValue);
    }
    window.location.href = url.toString();
  });
}

function applyStaticText() {
  elements.appTitle.textContent = t("appTitle");
  elements.appSubtitle.textContent = t("appSubtitle");
  elements.languageLabel.textContent = t("languageLabel");
  elements.ledgerPresetLabel.textContent = t("ledgerPresetLabel");
  elements.customLedgerLabel.textContent = t("customLedgerLabel");
  elements.applyLedger.textContent = t("loadButton");
  elements.statusLabel.textContent = t("statusLabel");
  elements.sourceLabel.textContent = t("sourceLabel");
  elements.updatedLabel.textContent = t("updatedLabel");
  elements.summaryTitle.textContent = t("summaryTitle");
  elements.overviewTitle.textContent = t("overviewTitle");
  elements.topSkillsTitle.textContent = t("topSkillsTitle");
  elements.topPluginsTitle.textContent = t("topPluginsTitle");
  elements.recentFailuresTitle.textContent = t("recentFailuresTitle");
  elements.observedVersionsTitle.textContent = t("observedVersionsTitle");
  elements.invocationTitle.textContent = t("invocationTitle");
  elements.objectsTitle.textContent = t("objectsTitle");
  elements.compareTitle.textContent = t("compareTitle");
  elements.skillFilterLabel.textContent = t("skillFilterLabel");
  elements.outcomeFilterLabel.textContent = t("outcomeFilterLabel");
  elements.triggerFilterLabel.textContent = t("triggerFilterLabel");
  elements.objectKindLabel.textContent = t("objectKindLabel");
  elements.compareObjectLabel.textContent = t("compareObjectLabel");
  elements.compareLeftLabel.textContent = t("compareLeftLabel");
  elements.compareRightLabel.textContent = t("compareRightLabel");

  replaceSelectOptions(elements.ledgerPreset, [
    ["default", t("presetDefault")],
    ["nested", t("presetNested")],
    ["custom", t("presetCustom")],
  ]);
  replaceSelectOptions(elements.outcomeFilter, [
    ["", t("all")],
    ["success", t("success")],
    ["failure", t("failure")],
    ["cancelled", t("cancelled")],
    ["degraded", t("degraded")],
  ]);
  replaceSelectOptions(elements.triggerFilter, [
    ["", t("all")],
    ["explicit", t("explicit")],
    ["keyword", t("keyword")],
    ["autonomous", t("autonomous")],
  ]);
  replaceSelectOptions(elements.objectKindFilter, [
    ["", t("all")],
    ["skill", t("skill")],
    ["plugin", t("plugin")],
  ]);
  replaceSelectOptions(elements.compareObjectFilter, [["", t("select")]]);
  replaceSelectOptions(elements.compareLeftFilter, [["", t("select")]]);
  replaceSelectOptions(elements.compareRightFilter, [["", t("select")]]);
  elements.customLedgerInput.placeholder = nestedRuntimeSource;
}

async function loadObjects() {
  const registryResponse = await fetch(objectSources[0]);
  let items;
  if (registryResponse.ok) {
    const payload = await parseJsonResponse(registryResponse);
    items = Array.isArray(payload) ? payload : [payload];
  } else {
    const fallbackResponses = await Promise.all(objectSources.slice(1).map((source) => fetch(source)));
    items = await Promise.all(
      fallbackResponses.filter((response) => response.ok).map((response) => parseJsonResponse(response)),
    );
  }
  return new Map(items.map((item) => [item.id, item]));
}

async function loadRuntimeEvents() {
  const sources = runtimeSourceOverride
    ? [runtimeSourceOverride, ...runtimeSources]
    : [defaultRuntimeSource, ...runtimeSources.filter((item) => item !== defaultRuntimeSource)];
  const { response, source } = await firstSuccessfulFetch(sources);
  state.activeRuntimeSource = source;
  const text = await response.text();
  return text.trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
}

function projectInvocations(events, objects) {
  const invocations = new Map();
  for (const event of events) {
    if (event.event_type === "skill_invocation_started") {
      invocations.set(event.skill_invocation_id, {
        id: event.skill_invocation_id,
        skillId: event.skill_id,
        skillVersionHash: event.skill_version_hash,
        triggerType: event.trigger_type,
        sessionId: event.session_id ?? "n/a",
        taskId: event.task_id ?? "n/a",
        projectId: event.project_id ?? "n/a",
        actorId: event.actor_id ?? "n/a",
        inputSummary: event.input_summary,
        startedAt: event.occurred_at,
        completedAt: null,
        outcome: "in_progress",
        errorSummary: "",
        evidence: [],
        plugins: [],
        skill: objects.get(event.skill_id) ?? fallbackObject(event.skill_id, "skill"),
      });
    }
    if (event.event_type === "skill_invocation_completed") {
      const invocation = invocations.get(event.skill_invocation_id);
      if (!invocation) continue;
      invocation.completedAt = event.occurred_at;
      invocation.outcome = event.outcome;
      invocation.errorSummary = event.error_summary ?? "";
      invocation.evidence = event.evidence ?? [];
    }
    if (event.event_type === "plugin_invocation_started") {
      const invocation = invocations.get(event.skill_invocation_id);
      if (!invocation) continue;
      invocation.plugins.push({
        id: event.plugin_invocation_id,
        pluginId: event.plugin_id,
        pluginVersionHash: event.plugin_version_hash,
        actionName: event.action_name,
        startedAt: event.occurred_at,
        completedAt: null,
        outcome: "in_progress",
        errorSummary: "",
        plugin: objects.get(event.plugin_id) ?? fallbackObject(event.plugin_id, "plugin"),
      });
    }
    if (event.event_type === "plugin_invocation_completed") {
      const invocation = invocations.get(event.skill_invocation_id);
      if (!invocation) continue;
      const pluginInvocation = invocation.plugins.find((item) => item.id === event.plugin_invocation_id);
      if (!pluginInvocation) continue;
      pluginInvocation.completedAt = event.occurred_at;
      pluginInvocation.outcome = event.outcome;
      pluginInvocation.errorSummary = event.error_summary ?? "";
    }
  }
  return Array.from(invocations.values()).sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
}

function buildObjectSummaries(invocations, objects) {
  const summaries = new Map();
  for (const object of objects.values()) {
    summaries.set(object.id, createObjectSummary(object));
  }
  for (const invocation of invocations) {
    const skillSummary = ensureObjectSummary(summaries, invocation.skill, "skill");
    collectObservation(skillSummary, invocation.skillVersionHash, invocation.outcome, invocation.startedAt, invocation);
    for (const plugin of invocation.plugins) {
      const pluginSummary = ensureObjectSummary(summaries, plugin.plugin, "plugin");
      collectObservation(
        pluginSummary,
        plugin.pluginVersionHash,
        plugin.outcome,
        plugin.startedAt,
        { ...invocation, pluginFocus: plugin },
      );
    }
  }
  return Array.from(summaries.values())
    .map((item) => ({
      ...item,
      versions: Array.from(item.versionIndex.values()).sort((a, b) => new Date(b.latestAt || 0) - new Date(a.latestAt || 0)),
      recentInvocations: item.recentInvocations.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt)).slice(0, 5),
    }))
    .sort((a, b) => b.invocationCount - a.invocationCount || a.label.localeCompare(b.label));
}

function createObjectSummary(object) {
  return {
    id: object.id,
    kind: object.kind,
    label: object.display_name,
    sourceRoot: object.source_root,
    versionIndex: new Map(),
    invocationCount: 0,
    failureCount: 0,
    latestAt: "",
    recentInvocations: [],
  };
}

function ensureObjectSummary(summaries, object, fallbackKind) {
  if (!summaries.has(object.id)) {
    summaries.set(object.id, createObjectSummary({
      id: object.id,
      kind: object.kind ?? fallbackKind,
      display_name: object.display_name ?? object.id,
      source_root: object.source_root ?? t("sourceUnknown"),
    }));
  }
  return summaries.get(object.id);
}

function collectObservation(summary, versionHash, outcome, observedAt, record) {
  summary.invocationCount += 1;
  if (outcome === "failure") summary.failureCount += 1;
  summary.latestAt = maxTimestamp(summary.latestAt, observedAt);
  summary.recentInvocations.push(record);
  const version = summary.versionIndex.get(versionHash) ?? {
    versionHash,
    observations: 0,
    failures: 0,
    latestAt: "",
  };
  version.observations += 1;
  if (outcome === "failure") version.failures += 1;
  version.latestAt = maxTimestamp(version.latestAt, observedAt);
  summary.versionIndex.set(versionHash, version);
}

function maxTimestamp(a, b) {
  if (!a) return b;
  if (!b) return a;
  return new Date(a) > new Date(b) ? a : b;
}

function bindListClick(container, attribute, callback) {
  container.querySelectorAll(`[${attribute}]`).forEach((node) => {
    node.addEventListener("click", () => callback(node.getAttribute(attribute)));
  });
}

function bindKeyboardListClick(container, attribute, callback) {
  container.querySelectorAll(`[${attribute}]`).forEach((node) => {
    node.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      callback(node.getAttribute(attribute));
    });
  });
}

function hydrateFilterOptions() {
  replaceSelectOptions(elements.skillFilter, [["", t("all")]]);
  const skills = Array.from(new Set(state.invocations.map((item) => item.skillId))).sort((a, b) => a.localeCompare(b));
  for (const skillId of skills) {
    const option = document.createElement("option");
    option.value = skillId;
    option.textContent = state.objects.get(skillId)?.display_name ?? skillId;
    elements.skillFilter.append(option);
  }
}

function hydrateCompareObjectOptions() {
  replaceSelectOptions(elements.compareObjectFilter, [["", t("select")]]);
  [...state.objectSummaries]
    .sort((a, b) => a.label.localeCompare(b.label))
    .forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.label} (${translateToken(item.kind)})`;
      elements.compareObjectFilter.append(option);
    });
  elements.compareObjectFilter.value = state.filters.compareObjectId;
}

function hydrateCompareVersionOptions() {
  const objectSummary = state.objectSummaries.find((item) => item.id === state.filters.compareObjectId);
  const versions = objectSummary?.versions ?? [];
  replaceSelectOptions(elements.compareLeftFilter, [["", t("select")]]);
  replaceSelectOptions(elements.compareRightFilter, [["", t("select")]]);
  for (const version of versions) {
    appendOption(elements.compareLeftFilter, version.versionHash, trimHash(version.versionHash));
    appendOption(elements.compareRightFilter, version.versionHash, trimHash(version.versionHash));
  }
  if (!versions.some((item) => item.versionHash === state.filters.compareLeftVersion)) {
    state.filters.compareLeftVersion = versions[0]?.versionHash ?? "";
  }
  if (!versions.some((item) => item.versionHash === state.filters.compareRightVersion)) {
    state.filters.compareRightVersion = versions[1]?.versionHash ?? versions[0]?.versionHash ?? "";
  }
  elements.compareLeftFilter.value = state.filters.compareLeftVersion;
  elements.compareRightFilter.value = state.filters.compareRightVersion;
}

function replaceSelectOptions(select, entries) {
  select.innerHTML = "";
  entries.forEach(([value, label]) => appendOption(select, value, label));
}

function appendOption(select, value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  select.append(option);
}

function ensureSelectedInvocationVisible() {
  const visible = new Set(getFilteredInvocations().map((item) => item.id));
  if (!visible.has(state.selectedInvocationId)) state.selectedInvocationId = getFilteredInvocations()[0]?.id ?? null;
}

function ensureSelectedObjectVisible() {
  const visible = new Set(getFilteredObjects().map((item) => item.id));
  if (!visible.has(state.selectedObjectId)) state.selectedObjectId = getFilteredObjects()[0]?.id ?? null;
}

function getFilteredInvocations() {
  return state.invocations.filter((item) => {
    if (state.filters.skill && item.skillId !== state.filters.skill) return false;
    if (state.filters.outcome && item.outcome !== state.filters.outcome) return false;
    if (state.filters.trigger && item.triggerType !== state.filters.trigger) return false;
    return true;
  });
}

function getFilteredObjects() {
  return state.objectSummaries.filter((item) => !state.filters.objectKind || item.kind === state.filters.objectKind);
}

function buildSummary(invocations) {
  const skillCounts = new Map();
  const pluginCounts = new Map();
  const versionCounts = new Map();
  const failures = [];
  for (const invocation of invocations) {
    increment(skillCounts, invocation.skillId, invocation.skill.display_name);
    increment(versionCounts, `${invocation.skillId}:${invocation.skillVersionHash}`, `${invocation.skill.display_name} ${trimHash(invocation.skillVersionHash)}`);
    if (invocation.outcome === "failure") failures.push(invocation);
    for (const plugin of invocation.plugins) {
      increment(pluginCounts, plugin.pluginId, plugin.plugin.display_name);
      increment(versionCounts, `${plugin.pluginId}:${plugin.pluginVersionHash}`, `${plugin.plugin.display_name} ${trimHash(plugin.pluginVersionHash)}`);
      if (plugin.outcome === "failure") failures.push({ ...invocation, pluginFailure: plugin });
    }
  }
  return {
    totalInvocations: invocations.length,
    totalPlugins: invocations.reduce((sum, item) => sum + item.plugins.length, 0),
    uniqueSkillCount: skillCounts.size,
    uniquePluginCount: pluginCounts.size,
    lastUpdated: invocations[0]?.completedAt ?? invocations[0]?.startedAt ?? "",
    topSkills: sortCounts(skillCounts),
    topPlugins: sortCounts(pluginCounts),
    versions: sortCounts(versionCounts),
    failures: failures.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt)),
  };
}

function increment(map, key, label) {
  const current = map.get(key) ?? { key, label, count: 0 };
  current.count += 1;
  map.set(key, current);
}

function sortCounts(map) {
  return Array.from(map.values()).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function render() {
  const filteredInvocations = getFilteredInvocations();
  const filteredObjects = getFilteredObjects();
  const summary = buildSummary(state.invocations);
  const selectedInvocation = filteredInvocations.find((item) => item.id === state.selectedInvocationId);
  const selectedObject = filteredObjects.find((item) => item.id === state.selectedObjectId);

  elements.ledgerStatus.textContent = `${state.invocations.length} ${t("loadedSuffix")}`;
  elements.ledgerSource.textContent = state.activeRuntimeSource;
  elements.lastUpdated.textContent = summary.lastUpdated ? `${t("latestEventPrefix")} ${formatDateTime(summary.lastUpdated)}` : t("waiting");
  renderMetrics(summary);
  renderStack(elements.skillsList, summary.topSkills, t("invocations"), 6);
  renderStack(elements.pluginsList, summary.topPlugins, t("pluginCallUnit"), 6);
  renderFailures(summary.failures);
  renderStack(elements.versionsList, summary.versions, t("observations"), 6);
  renderInvocations(filteredInvocations);
  renderInvocationDetail(selectedInvocation);
  renderObjects(filteredObjects);
  renderObjectDetail(selectedObject);
  renderVersionCompare();

  elements.skillCount.textContent = `${summary.topSkills.length} ${t("skillsObserved")}`;
  elements.pluginCount.textContent = `${summary.topPlugins.length} ${t("pluginsObserved")}`;
  elements.failureCount.textContent = `${summary.failures.length} ${t("failed")}`;
  elements.versionCount.textContent = `${summary.versions.length} ${t("versions")}`;
}

function renderMetrics(summary) {
  const cards = [
    [t("skillInvocations"), summary.totalInvocations, `${summary.uniqueSkillCount} ${t("skillsObserved")}`],
    [t("pluginCalls"), summary.totalPlugins, `${summary.uniquePluginCount} ${t("pluginsObserved")}`],
    [t("failureRecords"), summary.failures.length, t("failureCombined")],
    [t("versionFingerprints"), summary.versions.length, t("fingerprintObserved")],
  ];
  elements.metrics.innerHTML = cards.map(([label, value, note]) => `
    <article class="metric-card">
      <span>${label}</span>
      <strong>${value}</strong>
      <p>${note}</p>
    </article>
  `).join("");
}

function renderStack(container, items, suffix, limit = 5) {
  container.innerHTML = "";
  if (!items.length) {
    container.innerHTML = renderEmpty(t("noData"));
    return;
  }
  items.slice(0, limit).forEach((item) => {
    const node = elements.stackTemplate.content.cloneNode(true);
    node.querySelector("strong").textContent = item.label;
    node.querySelector("p").textContent = item.key;
    node.querySelector("span").textContent = `${item.count} ${suffix}`;
    container.append(node);
  });
}

function renderFailures(items) {
  if (!items.length) {
    elements.failuresList.innerHTML = renderEmpty(t("noFailures"));
    return;
  }
  elements.failuresList.innerHTML = items.slice(0, 6).map((item) => {
    const target = item.pluginFailure ? `${item.pluginFailure.plugin.display_name} / ${item.skill.display_name}` : item.skill.display_name;
    const detail = item.pluginFailure?.errorSummary || item.errorSummary || t("completeWithoutError");
    return `
      <article class="stack-item">
        <div>
          <strong>${target}</strong>
          <p>${detail}</p>
        </div>
        <span>${formatDateTime(item.startedAt)}</span>
      </article>
    `;
  }).join("");
}

function renderInvocations(items) {
  if (!items.length) {
    elements.invocationList.innerHTML = renderEmpty(t("noMatchingInvocations"));
    elements.invocationDetail.innerHTML = renderEmpty(t("noInvocationSelected"));
    return;
  }
  elements.invocationList.innerHTML = items.map((item) => `
    <article class="list-item ${item.id === state.selectedInvocationId ? "is-active" : ""}" data-invocation-id="${item.id}" tabindex="0" role="button">
      <div class="list-item__header">
        <strong class="list-item__title">${item.skill.display_name}</strong>
        <span class="badge ${badgeClass(item.outcome)}">${translateToken(item.outcome)}</span>
      </div>
      <div class="list-item__meta">
        <div class="mono">${trimHash(item.skillVersionHash)}</div>
        <div>${translateToken(item.triggerType)} · ${item.plugins.length} ${t("linkedCalls")}</div>
        <div>${formatDateTime(item.startedAt)}</div>
      </div>
    </article>
  `).join("");
  bindListClick(elements.invocationList, "data-invocation-id", (id) => {
    state.selectedInvocationId = id;
    render();
  });
  bindKeyboardListClick(elements.invocationList, "data-invocation-id", (id) => {
    state.selectedInvocationId = id;
    render();
  });
}

function renderInvocationDetail(item) {
  if (!item) {
    elements.invocationDetail.innerHTML = renderEmpty(t("selectInvocationHint"));
    return;
  }
  const pluginLines = item.plugins.length
    ? item.plugins.map((plugin) => `
        <article class="stack-item">
          <div>
            <strong>${plugin.plugin.display_name}</strong>
            <p>${plugin.actionName}</p>
            <p class="mono">${trimHash(plugin.pluginVersionHash)}</p>
          </div>
          <span class="badge ${badgeClass(plugin.outcome)}">${translateToken(plugin.outcome)}</span>
        </article>
      `).join("")
    : renderEmpty(t("noPluginCalls"));

  const evidence = item.evidence.length
    ? item.evidence.map((entry) => `
        <article class="stack-item">
          <div>
            <strong>${entry.kind}</strong>
            <p class="mono">${entry.value}</p>
          </div>
          <span></span>
        </article>
      `).join("")
    : renderEmpty(t("noEvidence"));

  elements.invocationDetail.innerHTML = `
    <div class="detail-content">
      <div class="detail-block">
        <div class="detail-block__header">
          <strong>${t("detailInvocation")}</strong>
          <div class="badge-row">
            <span class="badge ${badgeClass(item.outcome)}">${translateToken(item.outcome)}</span>
            <span class="badge">${translateToken(item.triggerType)}</span>
          </div>
        </div>
        <dl class="detail-kv">
          <dt>${t("skill")}</dt><dd>${item.skill.display_name}</dd>
          <dt>${t("version")}</dt><dd class="mono">${item.skillVersionHash}</dd>
          <dt>${t("started")}</dt><dd>${formatDateTime(item.startedAt)}</dd>
          <dt>${t("completed")}</dt><dd>${item.completedAt ? formatDateTime(item.completedAt) : t("inProgress")}</dd>
          <dt>${t("actor")}</dt><dd>${item.actorId}</dd>
          <dt>${t("session")}</dt><dd class="mono">${item.sessionId}</dd>
          <dt>${t("task")}</dt><dd class="mono">${item.taskId}</dd>
          <dt>${t("project")}</dt><dd class="mono">${item.projectId}</dd>
        </dl>
      </div>
      <div class="detail-block">
        <div class="detail-block__header"><strong>${t("inputSummary")}</strong></div>
        <div>${item.inputSummary}</div>
      </div>
      <div class="detail-block">
        <div class="detail-block__header">
          <strong>${t("pluginLineage")}</strong>
          <span>${item.plugins.length} ${t("linkedCalls")}</span>
        </div>
        <div class="stack">${pluginLines}</div>
      </div>
      <div class="detail-block">
        <div class="detail-block__header">
          <strong>${t("evidence")}</strong>
          <span>${item.evidence.length} ${t("items")}</span>
        </div>
        <div class="stack">${evidence}</div>
      </div>
    </div>
  `;
}

function renderObjects(items) {
  if (!items.length) {
    elements.objectList.innerHTML = renderEmpty(t("noMatchingObjects"));
    elements.objectDetail.innerHTML = renderEmpty(t("noObjectSelected"));
    return;
  }
  elements.objectList.innerHTML = items.map((item) => `
    <article class="list-item ${item.id === state.selectedObjectId ? "is-active" : ""}" data-object-id="${item.id}" tabindex="0" role="button">
      <div class="list-item__header">
        <strong class="list-item__title">${item.label}</strong>
        <span class="badge">${translateToken(item.kind)}</span>
      </div>
      <div class="list-item__meta">
        <div>${item.invocationCount} ${t("observations")}</div>
        <div>${item.failureCount} ${t("failure")}</div>
        <div class="mono">${item.sourceRoot}</div>
      </div>
    </article>
  `).join("");
  bindListClick(elements.objectList, "data-object-id", (id) => {
    state.selectedObjectId = id;
    state.filters.compareObjectId = id;
    hydrateCompareVersionOptions();
    render();
  });
  bindKeyboardListClick(elements.objectList, "data-object-id", (id) => {
    state.selectedObjectId = id;
    state.filters.compareObjectId = id;
    hydrateCompareVersionOptions();
    render();
  });
}

function renderObjectDetail(item) {
  if (!item) {
    elements.objectDetail.innerHTML = renderEmpty(t("selectObjectHint"));
    return;
  }
  const versions = item.versions.length
    ? item.versions.map((version) => `
        <article class="stack-item">
          <div>
            <strong class="mono">${trimHash(version.versionHash)}</strong>
            <p>${version.observations} ${t("observations")} · ${version.failures} ${t("failure")}</p>
          </div>
          <span>${version.latestAt ? formatDateTime(version.latestAt) : t("noTimestamp")}</span>
        </article>
      `).join("")
    : renderEmpty(t("noVersions"));
  const recent = item.recentInvocations.length
    ? item.recentInvocations.map((entry) => {
        const label = entry.pluginFocus ? `${entry.pluginFocus.plugin.display_name} / ${entry.skill.display_name}` : entry.skill.display_name;
        const version = entry.pluginFocus ? entry.pluginFocus.pluginVersionHash : entry.skillVersionHash;
        return `
          <article class="stack-item">
            <div>
              <strong>${label}</strong>
              <p class="mono">${trimHash(version)}</p>
            </div>
            <span>${formatDateTime(entry.startedAt)}</span>
          </article>
        `;
      }).join("")
    : renderEmpty(t("noActivity"));

  elements.objectDetail.innerHTML = `
    <div class="detail-content">
      <div class="detail-block">
        <div class="detail-block__header">
          <strong>${t("objectPage")}</strong>
          <div class="badge-row">
            <span class="badge">${translateToken(item.kind)}</span>
            <span class="badge">${item.versions.length} ${t("versions")}</span>
          </div>
        </div>
        <dl class="detail-kv">
          <dt>ID</dt><dd class="mono">${item.id}</dd>
          <dt>${t("sourceRoot")}</dt><dd class="mono">${item.sourceRoot}</dd>
          <dt>${t("latestObserved")}</dt><dd>${item.latestAt ? formatDateTime(item.latestAt) : t("noTimestamp")}</dd>
          <dt>${t("latestVersion")}</dt><dd class="mono">${item.versions[0]?.versionHash ?? t("noVersions")}</dd>
        </dl>
      </div>
      <div class="detail-block">
        <div class="detail-block__header"><strong>${t("observedVersionsTitle")}</strong></div>
        <div class="stack">${versions}</div>
      </div>
      <div class="detail-block">
        <div class="detail-block__header"><strong>${t("recentActivity")}</strong></div>
        <div class="stack">${recent}</div>
      </div>
    </div>
  `;
}

function renderVersionCompare() {
  const objectSummary = state.objectSummaries.find((item) => item.id === state.filters.compareObjectId);
  const left = objectSummary?.versions.find((item) => item.versionHash === state.filters.compareLeftVersion);
  const right = objectSummary?.versions.find((item) => item.versionHash === state.filters.compareRightVersion);
  if (!objectSummary || !left || !right) {
    elements.comparePanel.innerHTML = renderEmpty(t("compareEmpty"));
    return;
  }
  elements.comparePanel.innerHTML = `
    <div class="compare-grid">
      ${renderCompareCard(t("base"), left)}
      ${renderCompareCard(t("target"), right)}
    </div>
    <div class="delta-block">
      <strong>${objectSummary.label}</strong>
      <div>${t("observationDelta")}: ${formatDelta(right.observations - left.observations)}</div>
      <div>${t("failureDelta")}: ${formatDelta(right.failures - left.failures)}</div>
    </div>
  `;
}

function renderCompareCard(label, version) {
  return `
    <article class="compare-card">
      <h3>${label}</h3>
      <p class="mono">${version.versionHash}</p>
      <dl class="detail-kv">
        <dt>${t("observations")}</dt><dd>${version.observations}</dd>
        <dt>${t("failure")}</dt><dd>${version.failures}</dd>
        <dt>${t("failureRate")}</dt><dd>${formatPercent(version.failures, version.observations)}</dd>
        <dt>${t("latestObserved")}</dt><dd>${version.latestAt ? formatDateTime(version.latestAt) : t("noTimestamp")}</dd>
      </dl>
    </article>
  `;
}

function renderEmpty(message) {
  return `<div class="empty-state">${message}</div>`;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat(state.locale === "zh-CN" ? "zh-CN" : "en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function trimHash(value) {
  return value.length > 28 ? `${value.slice(0, 28)}...` : value;
}

function formatPercent(numerator, denominator) {
  if (!denominator) return "0%";
  return `${Math.round((numerator / denominator) * 100)}%`;
}

function formatDelta(value) {
  return value > 0 ? `+${value}` : `${value}`;
}

function badgeClass(outcome) {
  return outcome ? `badge--${outcome}` : "";
}

function fallbackObject(id, kind) {
  return {
    id,
    kind,
    display_name: id,
    source_root: t("sourceUnknown"),
  };
}

function translateToken(value) {
  return translations[state.locale][value] ?? value;
}

function t(key) {
  return translations[state.locale][key] ?? key;
}

async function firstSuccessfulFetch(sources) {
  for (const source of sources) {
    const response = await fetch(source);
    if (response.ok) return { response, source };
  }
  throw new Error(`Unable to load any source from ${sources.join(", ")}`);
}

async function parseJsonResponse(response) {
  return JSON.parse(await response.text());
}
