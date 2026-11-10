# Codex SDK

Keep this package focused on raw Codex app-server protocol fidelity, request lifecycle, transports, and executable discovery. Do not add provider-neutral projections, UI state, application policy, or app-specific tracing.

Read `CONTRIBUTING.md` and `docs/guide/testing.md` before changing tests. Protect observable behavior and demonstrate a red state for a regression. Preserve the coverage gate.

For public contract changes update `docs/api`, relevant guides, and typechecked examples. Before handoff run `npm run check`, `npm run build:docs`, and `git diff --check`. Use the pinned CLI for schema/native checks when it is provisioned. Record unavailable live validation explicitly.

Do not create branches, commit, push, publish, or modify global Codex installations without explicit user authorization. Preserve unrelated changes.
