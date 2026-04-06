# Codex Adapter CLI

This adapter writes governed object data and runtime events for the local Web console.

## Commands

- `node adapter/cli.js sync-registry --manifest examples/skill.manifest.json --manifest examples/plugin.manifest.json`
- `node adapter/cli.js skill-start --manifest examples/skill.manifest.json --invocation-id skill-inv-002 --trigger explicit --session session-124 --input "Review a new diff"`
- `node adapter/cli.js skill-complete --manifest examples/skill.manifest.json --invocation-id skill-inv-002 --outcome success --evidence note:review-finished`
- `node adapter/cli.js plugin-start --manifest examples/plugin.manifest.json --skill-invocation-id skill-inv-002 --plugin-invocation-id plugin-inv-002 --action fetch_pr_patch`
- `node adapter/cli.js plugin-complete --manifest examples/plugin.manifest.json --skill-invocation-id skill-inv-002 --plugin-invocation-id plugin-inv-002 --action fetch_pr_patch --outcome success`
- `node adapter/cli.js run-skill --manifest examples/skill.manifest.json --trigger explicit --session session-124 --input "Review a new diff" --ledger /tmp/ledger.jsonl -- node -e "console.log('wrapped skill')"`
- `node adapter/cli.js run-plugin --manifest examples/plugin.manifest.json --skill-invocation-id skill-inv-002 --action fetch_pr_patch --ledger /tmp/ledger.jsonl -- node -e "console.log('wrapped plugin')"`
- `node adapter/cli.js run-skill --manifest examples/skill.manifest.json --trigger explicit --session session-124 --input "Nested example" --ledger /tmp/ledger.jsonl -- node adapter/cli.js run-plugin --manifest examples/plugin.manifest.json --action fetch_pr_patch -- node -e "console.log('nested plugin')"`

## Notes

- Version hashes are computed from file content under each manifest's `source_root`.
- The adapter writes append-only JSONL events to `data/runtime-events.jsonl` by default.
- The Web console prefers `data/` over `examples/`, so adapter output becomes visible without UI changes.
- `run-skill` is the simplest integration path: wrap the real skill command and let the adapter emit start/complete records automatically.
- `run-plugin` extends the same wrapper pattern to plugin calls under an existing skill invocation.
- When `run-plugin` executes inside `run-skill`, it can inherit `CODEX_GOVERNANCE_SKILL_INVOCATION_ID` and `CODEX_GOVERNANCE_LEDGER_PATH` automatically.
