# Agent Runtime Governance

Agent Runtime Governance is a local-first governance console for agentic coding workflows. It tracks how `skills` and `plugins` run over time, attributes behavior to concrete implementation versions, and lets you inspect runtime history through a simple Web dashboard.

This project exists because current coding-agent platforms expose execution surfaces such as skills, plugins, prompts, and MCP tools, but usually do not provide a stable governance layer for:

- version-linked invocation history
- plugin lineage under a skill run
- portable local telemetry collection
- compact inspection of failures, usage, and runtime drift

## What It Does

The repository currently contains three connected layers:

1. `web/`
   A local static dashboard for viewing summary metrics, invocation history, object pages, and version comparisons.

2. `adapter/`
   A Node-based local adapter that emits standardized runtime events, computes content-hash versions, and writes to the runtime ledger.

3. `data/` + `schemas/`
   The local runtime ledger and JSON Schemas that define the contract between collection and display.

## Core Concepts

- `skill`: a governed runtime object with a stable ID and source root
- `plugin`: a governed runtime object linked under a skill-centric execution model
- `implementation version`: an immutable content hash derived from source files
- `runtime ledger`: append-only JSONL events used as the source of historical truth

## Quick Start

Initialize the local registry:

```bash
node adapter/cli.js sync-registry \
  --manifest examples/skill.manifest.json \
  --manifest examples/plugin.manifest.json
```

Serve the dashboard:

```bash
python3 -m http.server 4173
```

Then open:

- `http://localhost:4173/web/`
- or `http://localhost:4173/web/?ledger=../data/nested-runtime-events.jsonl`

## Current Status

This is an early prototype. It already supports:

- local runtime event collection
- wrapped skill and plugin execution
- nested plugin calls under a skill context
- English / Chinese UI switching
- compact runtime inspection in the browser

It does not yet include hosted storage, team workflows, or direct native Codex telemetry integration.
