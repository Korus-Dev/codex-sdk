# Reconnect and recover

Connections end: the app-server crashes, the machine sleeps, a socket closes. The SDK reports what happened and leaves the recovery to you, because only your app knows which work matters.

## What the client does

- Rejects every pending request and calls `onDisconnect` listeners when the transport reports an error.
- Resets initialization, so a new connection starts from a clean handshake.
- Reports malformed frames through `onProtocolError` without treating them as disconnection.
- Rejects a request after its deadline (15 seconds by default, 120 seconds for `thread/revert`). The server may still be doing the work.

## What your app does

1. Detect the loss with `onDisconnect`.
2. Close the client to release the child process, then create a fresh client and transport.
3. Start, initialize, and re-register your notification and server-request handlers.
4. Read or resume the threads your app owns, and reconcile what you show with the server's history.
5. Only then accept new work.

<<< @/examples/reconnect.ts

## Replaying work safely

A request that was in flight when the connection dropped may have succeeded. Before repeating a mutation, read the authoritative state:

- After `turn/start`, call `thread/read` or `thread/turns/list` and look for the turn before sending another.
- After `thread/fork` or `thread/archive`, list threads and check the result.
- A turn that was running may still be running. Resume the thread, observe its status, and use `turn/interrupt` only if the user asked to stop.

Treat an approval as belonging to the connection that received it. After a disconnect, discard its UI and let the server ask again rather than answering on a new connection.

## Observe, do not guess

Use `onRequestSettled` to record each request's method, outcome (`ok`, `error`, or `timeout`), and duration. It never receives parameters or results, so it is safe to forward to metrics. Use `onProtocolError` and the stdio transport's `onStderr` and `onExit` when you need to explain why a connection ended.

See [troubleshooting](/guide/troubleshooting) for common failure modes.
