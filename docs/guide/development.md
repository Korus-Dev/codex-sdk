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

## CI and releases

Pull requests and pushes to `main` run source/test checks, the 85% statement coverage gate, package builds, npm pack dry runs, and documentation builds on Linux and macOS with Node.js 22.19.0 and 26.12.1. A separate Linux job checks schema regeneration using Codex CLI 0.167.0.

The `Publish to npm` workflow runs manually on `main`. Its version input must match both committed manifests and cannot be the development placeholder `0.0.0`. It repeats quality, documentation, package, and schema checks before publishing. A dependent job creates the GitHub tag and release only after npm publication succeeds. The workflow requests OIDC credentials rather than storing an npm token.

Before the first release, configure the package's npm trusted publisher for organization `Korus-Dev`, repository `codex-sdk`, and workflow filename `publish.yml`. Choose a real release version and commit the synchronized manifest/lockfile and changelog. For a package's first publication, verify the npm account's bootstrap requirements before dispatching; configuring a workflow alone does not register a trusted publisher. Do not add a long-lived token to the repository as a workaround.

The documentation workflow builds with `DOCS_BASE=/codex-sdk/` and deploys the VitePress output to GitHub Pages. Enable Pages with GitHub Actions as the source. The default local build retains `/` as its base. Repository visibility, npm ownership/trusted-publisher setup, workflow execution, and the first publication are release administration tasks, separate from local validation.

Dependency patches and the scoped VitePress Vite override keep build tooling on patched versions. The override can be removed when VitePress declares a patched Vite dependency itself. The published SDK has no runtime npm dependencies.
