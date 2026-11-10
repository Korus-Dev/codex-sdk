# Setup

Use Node.js **22.19.0 or newer** to run the SDK. Development uses Node.js **26.12.1**, recorded in `.node-version`. Provision the Codex CLI separately. The npm package is `@korus-dev/codex-sdk`. Run `npm ci` in this repository for development.

## Install in your app

```sh
npm install @korus-dev/codex-sdk
npm install --save-dev typescript @types/node
```

The package is ESM-only. Set `"type": "module"` in your application's `package.json`. TypeScript projects use `module: "ESNext"` and `moduleResolution: "Bundler"`. Legacy `node10` resolution is not supported. Node ambient types must be enabled in your TypeScript project (`"types": ["node"]` when your config restricts them).

Import the SDK from `@korus-dev/codex-sdk`. The exports map exposes the package root and `@korus-dev/codex-sdk/package.json`.

The SDK and Codex CLI are separate packages. Install the CLI version you intend to use, authenticate it using your chosen account flow, and select its executable in the transport. No API key is needed for the local test suite or schema generation.

## Develop this package

```sh
git clone https://github.com/Korus-Dev/codex-sdk.git
cd codex-sdk
npm ci
```

After provisioning the declared development dependencies, run:

```sh
npm run typecheck
npm test
npm run build
```

The build produces ESM and declarations in `dist/`. Import runtime APIs from `@korus-dev/codex-sdk` in a consuming Node.js project. Generated protocol paths require [type-only imports](/api/#generated-types).

Select an executable with `command` and optionally isolate its files and account with `codexHome`. See [discovery](/api/transports#executable-discovery) for the behavior when no command is supplied.

The protocol is pinned to **codex-cli 0.167.0**. Provisioning or updating the CLI is separate from installing this package. See [schema generation](/guide/development#regenerate-the-schema) before changing the pin.
