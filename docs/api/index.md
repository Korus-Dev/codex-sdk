# Exports

Import client, transports, executable discovery, wire types and errors, listener helpers, and generated protocol types from `codex-sdk`.

## Runtime entry points

| Import | Exports |
| --- | --- |
| `codex-sdk` | Complete public API |
| `codex-sdk/protocol` | Client, protocol types, method maps, wire helpers, schema version |
| `codex-sdk/protocol/client` | `CodexAppServerClient` and its option/responder types |
| `codex-sdk/protocol/wire` | `RpcRemoteError`, `RpcTransportProtocolError`, `isRecord`, `isRpcError`, wire types |
| `codex-sdk/protocol/schema-version` | `codexSchemaCliVersion` |
| `codex-sdk/protocol/listener-errors` | `notifyListeners`, `reportListenerError`, `ListenerErrorHandler` |

The root exports `notifyListeners` and `ListenerErrorHandler`; use the listener-errors subpath for `reportListenerError`.

## Types-only subpaths

Generated declarations and method maps intentionally have no runtime entry:

```ts
import type { Thread } from 'codex-sdk/protocol/generated/v2/Thread';
import type { CodexAppServerMethodMap } from 'codex-sdk/protocol/method-map';
import type { CodexServerRequestMethodMap } from 'codex-sdk/protocol/server-request-map';
```

Use `import type`. The wildcard `codex-sdk/protocol/*` resolves declarations, while explicitly listed runtime entries above also resolve ESM.

## Protocol compatibility

`codexSchemaCliVersion` identifies the checked-in schema, currently **codex-cli 0.167.0**. Types include experimental methods; the running Codex server decides which are available. Consult the [protocol inventory](/api/json-rpc) for all request and notification methods.
