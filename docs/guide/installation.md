# Setup

Use Node.js **22.19.0 or newer** to run the SDK. Development uses Node.js **26.12.1**, recorded in `.node-version`. Provision the Codex CLI separately. The npm package is `@korus-dev/codex-sdk`. Run `npm ci` in this repository for development.

```sh
git clone git@github.com:Korus-Dev/codex-sdk.git
cd codex-sdk
```

After provisioning the declared development dependencies, run:

```sh
npm run typecheck
npm test
npm run build
```

The build produces ESM and declarations in `dist/`. Import runtime APIs from `@korus-dev/codex-sdk` in a consuming Node.js project. Generated protocol paths require [type-only imports](/api/#types-only-subpaths).

Select an executable with `command` and optionally isolate its files and account with `codexHome`. See [discovery](/api/transports#executable-discovery) for the behavior when no command is supplied.

The protocol is pinned to **codex-cli 0.167.0**. Provisioning or updating the CLI is separate from installing this package. See [schema generation](/guide/development#regenerate-the-schema) before changing the pin.
