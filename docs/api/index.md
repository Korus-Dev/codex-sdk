# Public API

Import runtime APIs and types from `@korus-dev/codex-sdk`. The package uses `main` for its ESM entry point and `types` for declarations.

```ts
import {
  CodexAppServerClient,
  CodexAppServerStdioTransport,
  codexSchemaCliVersion,
  type CodexAppServerMethodMap,
  type CodexServerRequestMethodMap,
  type ResponseItem,
  type v2,
} from '@korus-dev/codex-sdk';
```

## Runtime exports

| Area | Exports |
| --- | --- |
| Client | `CodexAppServerClient` |
| Transports | `CodexAppServerStdioTransport`, `CodexAppServerUnixSocketTransport` |
| Discovery | `resolveCodexRuntime`, `discoverCodexExecutable`, `codexRuntimePathEntries`, `withCodexRuntimePath` |
| Wire helpers | `RpcRemoteError`, `RpcTransportProtocolError`, `isRecord`, `isRpcError` |
| Listener helpers | `notifyListeners`, `reportListenerError` |
| Schema | `codexSchemaCliVersion` |

See [client](/api/codex), [transports](/api/transports), and [wire types and errors](/api/wire) for their contracts.

## Generated types

Top-level protocol types such as `ResponseItem`, both method maps, client options, transport options, responders, and wire types are available at the root. Version 2 protocol types are available through the type-only `v2` namespace:

```ts
import type { v2, CodexAppServerMethodMap } from '@korus-dev/codex-sdk';

type Thread = v2.Thread;
type StartThread = CodexAppServerMethodMap['thread/start']['params'];
```

Use `import type` for generated types; they have no runtime values. TypeScript projects use `module: "ESNext"` and `moduleResolution: "Bundler"`. Import through the package root instead of depending on internal file paths.

## Protocol compatibility

`codexSchemaCliVersion` identifies the checked-in schema, currently **codex-cli 0.167.0**. Types include experimental methods; the running Codex server decides which are available. Consult the [protocol inventory](/api/json-rpc) for all request and notification methods.
