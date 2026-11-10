# Testing

The test suite runs locally with fake transports, child-process fixtures, and local socket probes. It verifies protocol behavior without provider turns.

```sh
npm run test:ai
npm run typecheck
npm run typecheck:tests
npm run typecheck:docs
npm run test:coverage
```

The statement coverage gate is 85%. Regression coverage includes request correlation and deadlines, initialization, approval responders, listener isolation, diagnostics, stdio process lifecycle, executable discovery, Unix-socket framing, and binary resource handling.

Schema-generator fixtures check the complete file set and both request maps. `check:schema` separately verifies output from a provisioned matching Codex CLI. It generates schema locally and does not run a provider turn.

`npm run build:docs` checks the generated protocol inventory, typechecks the quick-start example, and builds the VitePress site with dead-link checking.

## Test value

For a regression test, identify the observable contract, the defect it prevents, and why existing coverage does not already protect it. Demonstrate failure with the defect or an intentional mutation before accepting the test green. Test through public transport, client, or package boundaries; do not assert committed implementation text or internal call ordering. Keep fixtures and child processes bounded and clean them up in `finally`.

## Package contents

`npm run check:package` packs the built SDK with scripts disabled, enforces the tarball file allowlist, and installs it in a temporary consumer. It imports the public root in plain Node ESM and compiles a strict TypeScript consumer with Bundler resolution. The temporary files are removed afterward. Run `npm run build` first, or use `npm run check` for the complete typecheck, test, build, package, and documentation gate. CI separately checks schema output from the pinned CLI.

## Agent iteration

Run `npm run test:ai -- <name-or-path>` for targeted unit tests or `npm run test:ai` for the whole unit suite. Do not call `vitest` or `npx vitest` directly, and do not use `npm test` for agent runs. Failure details and a short summary remain visible, followed by `[TESTS:DONE]`. It uses the existing unit configuration, timeouts, and fixtures; it does not start browser, Playwright, live, or native provider tests.

Live/native provider tests, browser tests, and publishing are off-limits during agent iteration and require explicit authorization from Nicolas. `npm run check` remains the final handoff gate; `test:ai` is for development iteration. The regular `test` and `test:coverage` commands retain their existing behavior.
