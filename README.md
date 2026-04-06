# Runlog

Runlog is a local-first runtime governance layer for coding agents. It helps you trace how `skills` and `plugins` execute, which implementation version ran, what happened inside one invocation, and where failures cluster over time.

[English](#english) | [中文](#中文)

## English

### What Runlog Is

Runlog exists because agent platforms usually expose execution surfaces such as skills, plugins, prompts, and tools, but do not provide a stable governance layer for:

- version-linked invocation history
- plugin lineage under a skill run
- portable local telemetry collection
- compact inspection of runtime drift and failures

Runlog is not a prompt library and not a hosted observability backend. It is a local workflow made of three layers:

1. `web/`
   A static dashboard for summary metrics, invocation history, object pages, and version comparisons.
2. `adapter/`
   A local Node adapter that emits runtime events, computes content-hash versions, and writes ledger records.
3. `data/` + `schemas/`
   The local runtime ledger plus JSON Schemas that define the contract between collection and display.

### Core Concepts

- `skill`: a governed runtime object with a stable ID and source root
- `plugin`: a governed runtime object linked under a skill-centric execution model
- `implementation version`: an immutable content hash derived from source files
- `runtime ledger`: append-only JSONL events used as the source of historical truth

### Quick Start

Initialize the local registry:

```bash
node adapter/cli.js sync-registry \
  --manifest examples/skill.manifest.json \
  --manifest examples/plugin.manifest.json
```

Run the local server:

```bash
python3 -m http.server 4173
```

Open the dashboard:

- `http://localhost:4173/web/`
- `http://localhost:4173/web/?ledger=../data/nested-runtime-events.jsonl`

### Current Status

The current prototype already supports:

- local runtime event collection
- wrapped skill and plugin execution
- nested plugin calls under a skill context
- English / Chinese UI switching
- compact browser-based runtime inspection

It does not yet include hosted storage, team workflows, or direct native Codex telemetry integration.

## 中文

### Runlog 是什么

Runlog 是一个面向编码代理的本地优先运行治理层。它用来回答这些问题：

- 某个 `skill` / `plugin` 到底被调用了多少次
- 某次运行对应的是哪个实现版本
- 一次调用内部到底发生了什么
- 哪些失败集中在某个版本或某条链路上

它不是 prompt 管理器，也不是托管式观测平台。当前仓库由三层组成：

1. `web/`
   静态看板，用来查看汇总指标、调用历史、对象页和版本对比。
2. `adapter/`
   本地 Node 采集层，用来产生日志事件、计算内容哈希版本，并写入 ledger。
3. `data/` + `schemas/`
   本地 runtime ledger 以及定义数据契约的 JSON Schema。

### 核心概念

- `skill`：带稳定 ID 和源路径的治理对象
- `plugin`：挂在 skill 运行链路下的一类治理对象
- `implementation version`：基于源码内容计算出的不可变哈希版本
- `runtime ledger`：追加写入的 JSONL 事件账本，是运行历史的真实来源

### 快速开始

先生成本地治理对象 registry：

```bash
node adapter/cli.js sync-registry \
  --manifest examples/skill.manifest.json \
  --manifest examples/plugin.manifest.json
```

再启动本地服务：

```bash
python3 -m http.server 4173
```

打开控制台：

- `http://localhost:4173/web/`
- `http://localhost:4173/web/?ledger=../data/nested-runtime-events.jsonl`

### 当前能力

当前原型已经支持：

- 本地 runtime 事件采集
- skill / plugin 包裹执行
- skill 内嵌 plugin 调用链路
- 中英文界面切换
- 浏览器内的紧凑运行看板

暂时还不包含：

- 托管式存储
- 团队协作工作流
- 平台原生 Codex telemetry 集成
