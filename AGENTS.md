# Repository Guidelines

## Project Structure & Module Organization

This repository currently defines the product contract for a Codex skill governance console rather than a full runnable product.

- `product-spec.md`: canonical product specification and scope
- `schemas/`: JSON Schemas for governed objects and runtime ledger events
- `examples/`: sample manifests and JSONL runtime events used as reference fixtures
- `data/`: adapter-produced registry and runtime ledger used by the console
- `adapter/`: local Node-based collection CLI for hashing source roots and writing ledger events
- `web/`: static local console prototype that reads the runtime ledger
- `.omx/`: local orchestration state; treat as runtime metadata, not product source

Keep new source files grouped by purpose. Put collection-side code in a dedicated adapter directory such as `adapter/`, UI code in `web/`, and shared contracts in `schemas/`.

## Build, Test, and Development Commands

There is no build system yet. Use lightweight validation commands while the repo is spec-first:

- `jq . schemas/governed-object.schema.json`: validate schema JSON syntax
- `jq . schemas/runtime-ledger.schema.json`: validate ledger schema JSON syntax
- `jq . examples/skill.manifest.json`: inspect sample governed object data
- `jq -c . examples/runtime-events.jsonl`: validate JSONL event lines
- `node adapter/cli.js sync-registry --manifest examples/skill.manifest.json --manifest examples/plugin.manifest.json`: generate the local governed object registry
- `node adapter/cli.js skill-start ...`: append a skill-start event to the local ledger
- `node adapter/cli.js run-skill ... -- <cmd>`: wrap a skill command and auto-record start/complete events
- `node adapter/cli.js run-plugin ... -- <cmd>`: wrap a plugin command under an existing skill invocation
- `python3 -m http.server 4173`: serve the repository locally for the static console in `web/`
- `open http://localhost:4173/web/`: view the local console after starting the server
- `open "http://localhost:4173/web/?ledger=../data/nested-runtime-events.jsonl"`: inspect an alternate ledger file in the UI
- `sed -n '1,220p' product-spec.md`: review the current product contract

If you add executable code, document the new local run and test commands here in the same change.

## Coding Style & Naming Conventions

Use Markdown for specs, JSON for machine-readable contracts, and plain JavaScript/CSS/HTML for the local prototype. Prefer ASCII unless a file already uses non-ASCII text.

- Indentation: 2 spaces for JSON, standard Markdown formatting elsewhere
- IDs: lowercase with `-`, `_`, or `.` separators, for example `code-review`
- Schema files: `*.schema.json`
- Example fixtures: descriptive names such as `runtime-events.jsonl`
- Browser files: keep modules small and centered on projection, rendering, or data loading

Keep documents concise and decision-oriented. Prefer stable field names over clever abbreviations.

## Testing Guidelines

Changes to schemas or examples must include syntax validation with `jq`. When introducing stricter schema validation, add a reproducible command and at least one passing example fixture.

Name future tests after the behavior they verify, for example `runtime-ledger.version-attribution.test.ts` or `governed-object.invalid-id.json`.

For UI changes, manually verify that `web/` still loads from a local HTTP server, that the overview, filters, and invocation detail panel render from `data/runtime-events.jsonl`, and that the hero ledger selector can switch to the nested demo ledger.

## Commit & Pull Request Guidelines

Follow the Lore commit protocol used by this workspace: the first line states why the change exists, followed by optional trailers such as `Constraint:`, `Rejected:`, `Confidence:`, and `Tested:`.

Pull requests should include:

- a short summary of the product or contract change
- affected files or schemas
- validation evidence, even if limited to `jq` commands
- screenshots only when UI work is introduced

Do not change object identity or event field names casually; those are repository contracts.
Do not make the console depend on passive log scraping; adapter-emitted ledger events are the intended collection surface.
