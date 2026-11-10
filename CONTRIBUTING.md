# Contributing

Use Node.js 26.12.1 (`.node-version`) for development. The runtime floor is 22.19.0.

```sh
npm ci
npm run check
npm run build:docs
```

`check` runs source/test typechecks, coverage, the package build, and an npm pack dry run. The 85% statement threshold must remain intact.

Keep changes focused on the raw Codex app-server protocol, client, transports, and executable discovery. Provider-neutral conversation APIs belong in multi-agent-sdk; UI and native UI adapters belong in agent-ui-sdk. Host approval decisions, persistence, product workflows, and logging policy belong in applications.

Protect observable behavior with a regression test. Show the test failing for the defect before accepting it green. Extend an existing owning test when possible; avoid source-text assertions or tests that merely repeat implementation. See [testing](docs/guide/testing.md).

Update the guide and API reference when public behavior changes. All reusable examples under `docs/examples` are typechecked. Regenerate the inventory with `npm run generate:rpc` after schema changes. Follow [development](docs/guide/development.md) for the pinned CLI procedure; never hand-edit generated schema.

Verify the generated schema with the pinned CLI:

```sh
npm run check:schema -- --codex /absolute/path/to/codex-0.167.0
```

This generates schema locally without authentication or provider turns. It does not change your global CLI.

Report bugs with the SDK version, Node/OS version, Codex CLI version, selected transport, and a minimal reproduction. Remove credentials and private protocol payloads before sharing output.
