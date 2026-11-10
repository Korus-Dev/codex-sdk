# Architecture

The SDK has three layers:

| Layer | Responsibility |
| --- | --- |
| `CodexAppServerClient` | Typed requests, correlation, timeouts, notifications, server-request responders, and disconnect listeners |
| `RpcTransport` | Connection lifecycle and JSON-RPC message delivery |
| Executable discovery | Resolve a Codex command and augment its child environment |

The stdio transport owns its spawned process. The Unix-socket transport connects to an existing app-server without owning its lifecycle. Both implement the same [transport contract](/api/transports#custom-transports).

Generated types and method maps describe Codex's wire protocol. The client does not reduce notifications into conversation snapshots or automatically reload history. Your app determines which threads to load, how to display incremental output, and when to reconnect.

Keep the client in a trusted Node.js host. If your UI runs in another process or browser, expose the actions and data that your app needs through an app-owned boundary.
