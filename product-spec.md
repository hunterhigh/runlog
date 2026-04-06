# Runlog v1

## Summary

This product is a local Web governance console for heavy individual Codex users. It governs runtime behavior for skills and plugins through a versioned invocation ledger. It is not a prompt library, not a static registry, and not a release platform.

The product is delivered as three layers:

- a local Web console for governance and inspection
- a Codex adapter that emits runtime events
- a local runtime ledger that serves as the contract between collection and display

The core value is operational visibility:

- See which skills and plugins are used most.
- Inspect exactly what happened in each invocation.
- Attribute behavior changes to concrete implementation versions.
- Trace plugin activity under a skill-centric execution model.
- Ship a portable governance layer that other users can install without depending on native Codex telemetry APIs.

## Product Goals

The first version must answer five questions:

1. Which skills and plugins do I use most?
2. What exactly happened in this invocation?
3. Did behavior change after a version change?
4. Which plugin calls were involved in this skill run?
5. Which version produced this failure?

## Scope

### In scope

- Codex-first runtime governance
- Local-only Web console
- Local adapter-based telemetry collection
- Skill and plugin identity management
- Immutable implementation version tracking via content hashes
- Skill-centric invocation history
- Plugin lineage under each skill invocation
- Query and filtering by object, version, outcome, and time

### Out of scope

- Hosted multi-user product
- Cross-platform abstraction across Codex and Claude Code
- Passive scraping of Codex UI output as the primary data source
- Approval workflows
- Release workflows
- Manual semantic versioning
- Full task/session governance beyond supporting context

## Primary Concepts

### Skill

A governed runtime object with:

- stable repo-declared `id`
- display name
- source root used for version hashing

### Plugin

A governed runtime object with:

- stable repo-declared `id`
- display name
- source root used for version hashing

Plugins are first-class governed objects, but the main execution narrative stays skill-centric.

### Implementation version

Each skill or plugin implementation version is identified by an immutable content hash generated from normalized source content under its declared source root.

This is the source of truth for runtime attribution in v1.

### Codex adapter

The adapter is the runtime collection layer installed alongside the user's Codex environment. It is responsible for:

- observing skill execution boundaries
- emitting standardized runtime events
- resolving object declarations
- calculating implementation hashes
- writing append-only records to the local ledger

The adapter is the preferred collection path because Codex does not currently expose a stable native governance telemetry surface for this data model.

### Runtime ledger

The runtime ledger is the stable exchange layer between collection and display. The console reads from it; the adapter writes to it.

### Invocation

One skill trigger creates one primary invocation record. Plugin calls are linked child records attached to the parent skill invocation.

## Runtime Model

### Skill invocation boundary

The primary runtime unit is one skill trigger. Trigger types are:

- explicit
- keyword
- autonomous

Each skill invocation records:

- invocation ID
- start timestamp
- end timestamp
- skill ID
- skill version hash
- trigger type
- session ID
- task ID if available
- repo/project identifier
- actor identifier if available
- input summary
- outcome
- evidence pointers

### Plugin invocation boundary

Plugin invocation records are linked to a parent skill invocation and capture:

- plugin invocation ID
- parent skill invocation ID
- start timestamp
- end timestamp
- plugin ID
- plugin version hash
- action name
- outcome
- error summary if failed

### Outcomes

The allowed top-level outcomes are:

- success
- failure
- cancelled
- degraded

`degraded` is used when execution partially succeeds but loses completeness or evidence.

## Required Declarations

Every governed skill or plugin must declare:

- `id`
- `kind`
- `display_name`
- `source_root`

Optional fields for future governance:

- `owner`
- `notes`

Identity must come from declarations, not file paths.

## Delivery Architecture

### Web console

The console is a read-only local application that:

- reads the local runtime ledger
- projects event history into queryable views
- renders overview, explorer, object, and version insights

### Adapter

The adapter is the write path. It must:

- hook into skill and plugin execution paths
- emit standardized events defined by this spec
- persist them locally without requiring a hosted backend

### Ledger

The ledger is the compatibility boundary. Future platform adapters may change, but the console contract should remain stable as long as the ledger schema remains compatible.

## Console Information Architecture

### Home

The home screen is a governance overview. It prioritizes:

- most-used skills
- most-used plugins
- recent failures
- recent version changes
- recent invocation activity

### Invocation explorer

The invocation explorer supports:

- list view of skill invocations
- filter by skill, plugin, version, outcome, trigger, and time
- detail drill-down per invocation
- child plugin lineage per invocation

### Object pages

Each skill and plugin has a detail page with:

- stable identity
- current observed version
- historical versions
- invocation volume
- recent failures
- linked invocation history

### Version compare

Users can compare two observed versions of one object by:

- version metadata
- observed outcomes
- failure concentration
- changed runtime patterns

## Instrumentation Design

### Ingestion model

Use explicit runtime instrumentation through the adapter, not log parsing.

### Required event flow

1. Emit `skill_invocation_started` when a skill begins.
2. Resolve and attach the skill version hash immediately.
3. Emit `plugin_invocation_started` and `plugin_invocation_completed` for each plugin call.
4. Emit `skill_invocation_completed` when the skill finishes.
5. Persist events to an append-only local store.
6. Project stored events into queryable local state for the UI.

### Persistence requirement

The append-only runtime store is the source of historical truth. Derived query views may be rebuilt from it.

### Collection responsibility

The console does not infer invocation history by scraping terminal output. The adapter owns event emission and ledger writes. This keeps the product portable for users who download it and install it into their own Codex environments.

## Query Model

The v1 console must support:

- fetch recent skill invocations
- fetch recent plugin invocations
- aggregate invocation counts by skill
- aggregate invocation counts by plugin
- filter invocations by version hash
- filter invocations by outcome
- fetch one invocation with plugin lineage
- fetch version history for one skill or plugin

## Acceptance Criteria

The implementation is complete when:

1. A skill invocation appears with the correct ID, version hash, timestamps, trigger, and outcome.
2. Linked plugin calls appear under the skill invocation with their own IDs, hashes, actions, and outcomes.
3. Home view correctly ranks most-used skills and plugins from invocation data.
4. Users can identify which version caused a failure.
5. Renaming source files without changing declared ID does not break continuity.
6. Missing declaration IDs are rejected explicitly and do not create unstable identities.
7. Partial runtime failures still create a cancelled or degraded record instead of dropping history.

## Defaults

- The product is local-only by default.
- The product owns the telemetry protocol, while the adapter owns runtime collection.
- Skill invocations are the primary analysis unit.
- Plugins are first-class objects but subordinate in the main execution story.
- Content hashes are the only required version identity in v1.
- Manual release labels may be added later as optional metadata, not as the primary key.
