# Testing

The test suite runs locally with fake transports, child-process fixtures, and local socket probes. It verifies protocol behavior without provider turns.

```sh
npm test
npm run typecheck
npm run typecheck:tests
npm run typecheck:docs
npm run test:coverage
```

The statement coverage gate is 85%. Regression coverage includes request correlation and deadlines, initialization, approval responders, listener isolation, diagnostics, stdio process lifecycle, executable discovery, Unix-socket framing, and binary resource handling.

Schema-generator fixtures check the complete file set and both request maps. `check:schema` separately verifies output from a provisioned matching Codex CLI. It generates schema locally and does not run a provider turn.

`npm run build:docs` checks the generated protocol inventory, typechecks the quick-start example, and builds the VitePress site with dead-link checking.
