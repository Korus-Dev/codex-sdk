# Client

`new CodexAppServerClient(transport, options?)` wraps an [RpcTransport](/api/transports#custom-transports). Start it before making requests and initialize the connection before using Codex operations.

## Lifecycle

| Method | Behavior |
| --- | --- |
| `start(): Promise<void>` | Subscribe to transport messages/errors and start the transport |
| `initialize(params)` | Send a typed initialize request and then `initialized`; concurrent calls share the same promise |
| `close(): Promise<void>` | Unsubscribe, reject pending work, reset initialization, and close the transport |
| `onDisconnect(listener)` | Observe connection loss; returns an unsubscribe function |

A transport error rejects pending requests and resets connection initialization. Reconnection and request replay belong to the caller. `start()` is idempotent once started; initialization can be retried after a failed handshake.

## Requests and notifications

`request(method, params)` infers parameter and result types from `CodexAppServerMethodMap`. Methods whose parameters allow `undefined` can omit them. Remote errors reject with `RpcRemoteError`, preserving `code`, `message`, and `data`.

`notify(method, params)` sends a typed `ClientNotification` without waiting for a response. `initialize()` already sends `initialized`; do not send a duplicate handshake notification.

Use `onNotification(listener)` for all server notifications or `onNotification(method, listener)` for a typed method-specific listener. Both return unsubscribe functions. Global listeners run before method-specific listeners; a throwing subscriber is isolated through `onListenerError`.

## Server requests

`onServerRequest(method, handler)` provides a typed request and responder. `onAnyServerRequest(handler)` adds a fallback handler. Method-specific handlers run first. Registrations return unsubscribe functions.

A responder exposes `responded`, `resolve(result)`, and `reject(error)`. Rejection accepts an `Error`, a protocol `RpcError`, or a string. It responds at most once. Return `true` to claim a request you will answer asynchronously; resolving or rejecting also claims it. An unclaimed request receives a method-not-implemented error by default.

## Options

| Option | Behavior |
| --- | --- |
| `requestTimeoutMs` | Override all request deadlines. Defaults are 15,000 ms, or 120,000 ms for `thread/revert` |
| `onProtocolError(error)` | Report malformed messages and protocol frames |
| `onListenerError(error)` | Report notification, disconnect, and request-settled callback exceptions; defaults to a process warning |
| `unhandledServerRequestError(request)` | Choose the error response for an unhandled request; default code is `-32601` |
| `onRequestSettled(info)` | Receive one timing event per admitted outgoing request |

A timeout rejects pending local work and ignores late responses. It does not send cancellation to the server. Invalid framing may reject a specific request when its ID is known, or all pending work when it cannot be correlated; a protocol error does not itself imply the connection is lost.

## Request diagnostics

`CodexRequestSettledInfo` contains:

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | `RpcId` | Request correlation ID |
| `method` | `string` | Outgoing method |
| `outcome` | `'ok' \| 'error' \| 'timeout'` | Local settlement |
| `startedAt` | `number` | Epoch milliseconds at admission |
| `durationMs` | `number` | Elapsed time from the monotonic performance clock |

The hook runs synchronously once for success, timeout, or failure, including send, remote, protocol, disconnect, and close failures. Calls rejected before the client starts are not admitted. Hook exceptions are routed through `onListenerError` without changing settlement. No request parameters or response payloads are included, and no diagnostic environment flag is read.
