# Development and schema

Use the Node version in `.node-version` and the package's declared development tools. Dependency installation and lockfile updates follow your workspace's workflow.

## Validate changes

```sh
npm run typecheck
npm run typecheck:tests
npm test
npm run build
```

See [testing](/guide/testing) for coverage and documentation checks.

## Regenerate the schema

The checked-in schema is pinned in `src/protocol/schema-version.ts` to **codex-cli 0.167.0**. Provision that executable separately:

```sh
npm run check:schema -- --codex /absolute/path/to/pinned/codex
npm run generate:schema -- --codex /absolute/path/to/pinned/codex
npm run generate:rpc
```

The generator verifies the CLI version before invoking `app-server generate-ts --experimental`. It writes the generated type tree, client method map, server-request map, and schema-version constant. Check mode compares the entire generated file set and both maps without modifying them. No CLI is downloaded and no provider turn is started.

To change the schema pin deliberately:

```sh
npm run generate:schema -- --codex /path/to/new/codex --expected-version 'codex-cli X.Y.Z'
npm run generate:rpc
```

Review the generated protocol changes together, then run typechecks, tests, the package build, and `check:schema` with the chosen CLI. The generated inventory reads checked-in declarations, so it can be refreshed without running Codex.

## Work on the documentation

```sh
npm run dev:docs
npm run build:docs
npm run preview:docs
```

The site uses VitePress with a root base path and local search. `build:docs` checks inventory drift, typechecks the included quick-start source, and checks internal links during the build. Output is written to `docs/.vitepress/dist/`; cache and build output are ignored by Git. Deployment is separate from building the site.
