# Architecture

![Your app calls CodexAppServerClient, which uses a transport to reach the Codex app-server](/architecture.svg)

The SDK has three layers:

| Layer | Responsibility |
| --- | --- |
| `CodexAppServerClient` | Typed requests, correlation, timeouts, notifications, server-request responders, and disconnect listeners |
| `RpcTransport` | Connection lifecycle and JSON-RPC message delivery |
| Executable discovery | Resolve a Codex command and augment its child environment |

The stdio transport owns its spawned process. The Unix-socket transport connects to an existing app-server without owning its lifecycle. Both implement the same [transport contract](/api/transports#custom-transports).

## Message flow

The client distinguishes four kinds of incoming message:

| Message | Handling |
| --- | --- |
| Response to a request | Resolves or rejects the pending promise by ID; remote errors become `RpcRemoteError` |
| Notification | Delivered to global listeners, then to listeners for its method |
| Server request | Offered to handlers for its method, then to fallback handlers, each with a once-only responder |
| Anything else | Reported through `onProtocolError` |

Listeners are isolated from each other: one that throws is reported through `onListenerError` and never disturbs the rest or in-flight requests.

## Generated protocol

Types and method maps are generated from the Codex CLI's own schema, pinned in `src/protocol/schema-version.ts`. `CodexAppServerMethodMap` types every request, and `CodexServerRequestMethodMap` types every server request. Nothing validates payloads at runtime: the types are a compile-time contract with the running server.

## Responsibilities

Generated types and method maps describe Codex's wire protocol. The client does not reduce notifications into conversation snapshots or automatically reload history. Your app determines which threads to load, how to display incremental output, and when to reconnect.

Keep the client in a trusted Node.js host. If your UI runs in another process or browser, expose the actions and data that your app needs through an app-owned boundary.

The package uses a root ESM entry point and TypeScript declarations, built with Vite and `tsc`. TypeScript consumers use Bundler module resolution. It has no runtime dependencies.
