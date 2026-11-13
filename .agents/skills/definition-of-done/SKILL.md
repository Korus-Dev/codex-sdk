---
name: definition-of-done
description: Verify Codex SDK work before handoff, commit, or push. Use after repository changes.
---

# Definition of Done

Use proportional evidence. The user's requested validation depth is authoritative.

## Before handoff

- Inspect `git status --short`; preserve unrelated changes.
- Add focused tests for behavior changes, and show a regression test failing for
  the defect before accepting it green. Read `CONTRIBUTING.md` and
  `docs/guide/testing.md` before changing tests.
- Iterate with `npm run test:ai -- <name-or-path>`, or `npm run test:ai` for the
  whole unit suite. Never call `vitest` or `npx vitest` directly, and do not use
  `npm test` for agent runs.
- Finish with `npm run check`. It owns typechecks, tests with the coverage gate,
  the package build, the packed-consumer check, and the VitePress build. For a
  narrow change, run the affected script first (`typecheck`, `typecheck:tests`,
  `typecheck:docs`, `check:package`), but `npm run check` remains the handoff gate.
- Do not lower the coverage threshold.
- When the generated schema or method maps change, run `npm run generate:rpc`
  and `npm run check:schema` with the pinned CLI if it is provisioned.
- Run `git diff --check` after the final edit.
- Live or native provider tests, browser tests, and publishing are off-limits
  unless the user explicitly authorizes them. Record any validation that could
  not run, such as an unprovisioned pinned CLI.

## Scope

This package is typed JSON-RPC, transports, and executable discovery. Do not add
provider-neutral projections, UI state, application policy, or app-specific
tracing. That belongs in multi-agent-sdk or agent-ui-sdk.

## VitePress gate

Treat VitePress as a public SDK surface. For every change, decide and report one:

- **Updated:** public API, behavior, options, defaults, errors, or recommended
  workflows changed. Update `docs/api/` for exact contracts, `docs/guide/` for
  usage, and `docs/examples/` for typechecked examples. Update `README.md` only
  for discovery. Update `docs/.vitepress/config.mts` when pages move or are
  added, and run `npm run build:docs`.
- **No impact:** state why the change is internal.

The protocol inventory in `docs/api/json-rpc.md` is generated; never edit it by
hand. A public contract change is incomplete until its documentation matches.

## Report

Summarize the outcome and public API, checks actually run, VitePress impact, and
remaining unrelated changes. Explain selected failures or warnings. Do not create
branches, commit, push, or publish without explicit authorization.
