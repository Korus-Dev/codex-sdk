# Wire types and errors

Import wire types and helpers from `@korus-dev/codex-sdk`. A custom transport implements `RpcTransport`; see [transports](/api/transports#custom-transports).

## Messages

`RpcId` is a string or number. `RpcRequest` has `id`, `method`, and optional `params`. Notifications omit `id`; successful responses have `id` and `result`; error responses have `id` and `error`. `RpcMessage` is their union. `RpcError` has numeric `code`, string `message`, and optional `data`.

The transport accepts unknown incoming data so the client can distinguish requests, notifications, responses, and malformed frames. Generated declarations are compile-time contracts, not runtime payload validators. Standard JSON handling does not preserve arbitrary integer precision or revive dates and `bigint`.

## Errors

| Error | Meaning | Host action |
| --- | --- | --- |
| `RpcRemoteError` | The server returned an error response; preserves `code` and `data` | Inspect the server error and decide whether retry is appropriate |
| `RpcTransportProtocolError` | Malformed frame; optional `requestId` identifies affected work | Report protocol failure and reconcile pending work |
| Ordinary transport `Error` | Connection failure | Reconnect and initialize before resuming |
| Request timeout `Error` | Local deadline elapsed | Reconcile before retrying a mutation; the server may still be working |

`RpcTransportProtocolError(message, { cause?, requestId? })` does not itself declare the transport disconnected. An unknown correlation ID cannot identify a single pending request. `onProtocolError` reports malformed protocol data separately from `onDisconnect`.

## Guards and listener helpers

`isRecord(value)` accepts a non-null, non-array object. `isRpcError(value)` additionally checks numeric `code` and string `message`; neither deeply validates arbitrary server payloads.

`notifyListeners(listeners, value, onListenerError?)` delivers a value while isolating listener exceptions. `reportListenerError(error, handler?)` sends an exception to the chosen handler, or emits a process warning by default. A throwing error handler is also isolated. These helpers do not create telemetry or retain protocol payloads.
