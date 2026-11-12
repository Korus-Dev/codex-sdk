# Troubleshooting

## Codex does not start

Set an absolute `command` to choose the intended binary. Inspect stdio `onStderr` and `onExit`, then check the child environment, working directory, and Codex home. Explicit commands still receive [discovery's augmented environment](/api/transports#executable-discovery).

If your app runs from a launcher with a minimal `PATH` (a packaged desktop app, a service manager), discovery searches app bundles, a login shell, and common install locations. Set `executableDiscovery: false` only when you supply everything yourself.

## The first request times out or fails

Call `start()`, then `initialize()`, before any other request. Requests sent before `start()` throw immediately, and Codex expects the initialize handshake before other methods. `initialize()` sends `initialized` for you; do not send it again.

## A request times out

The default is 15 seconds, except `thread/revert` at 120 seconds. `requestTimeoutMs` overrides both. A timeout rejects local pending work; it does not cancel the operation in Codex. Reconcile server state before retrying a mutation.

## A turn never finishes

`turn/start` resolves when the turn is admitted. Wait for `turn/completed` for the same `threadId` and turn ID.

If it does not arrive, the turn is probably waiting for you. Register handlers for `item/commandExecution/requestApproval`, `item/fileChange/requestApproval`, `item/permissions/requestApproval`, and `item/tool/requestUserInput` before starting the turn. An unclaimed request is answered with a method-not-implemented error, so the action it asked about does not proceed. A handler that returns `true` and never resolves leaves the turn waiting indefinitely.

## Streamed text is missing or duplicated

Notifications can arrive before the `turn/start` response, and several threads can stream through one client. Filter by `threadId` and turn ID, and record events as they arrive instead of starting to listen after the response. The [streaming guide](/guide/streaming) shows a pattern that handles both.

## A method is unavailable

Check `codexSchemaCliVersion` and the running CLI version. The package's generated types describe `codex-cli 0.167.0`, including experimental APIs. Enable experimental capabilities in `initialize` when needed; runtime configuration, authentication, and server version still control availability.

## The Unix socket does not connect

Confirm that a server is listening (`codex app-server --listen unix://`) and that the socket path matches. Without `socketPath`, the transport uses `app-server-control/app-server-control.sock` under `codexHome`, `CODEX_HOME`, or `~/.codex`, in that order. A rejected WebSocket upgrade reports the server's HTTP status line in the error message.

## A frame or output line is too large

Oversized Unix-socket frames and stdio output lines surface as protocol errors. Raise `maxFrameBytes` (default 64 MiB) or `maxOutputLineChars` only after checking which request produced the payload; paging a large history with `thread/turns/list` is usually the better fix.

## Notifications stop

Use `onDisconnect` to detect connection loss and `onProtocolError` to report malformed messages. Listener exceptions are isolated and go to `onListenerError`. The app owns reconnection and thread recovery; see [reconnect and recover](/guide/recovery).

## A protocol subpath fails to import

Generated declarations and method maps are types-only. Use `import type`, or import the client and runtime errors from the [runtime entry points](/api/).
