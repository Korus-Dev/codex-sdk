# Threads and turns

A thread holds conversation history. A turn submits input and produces notifications as Codex works. Use the typed client for `thread/start`, `thread/resume`, `thread/read`, `thread/list`, `turn/start`, and `turn/interrupt`.

## Stream output

Subscribe to `item/agentMessage/delta` for text and `turn/completed` for the final turn status. Notifications carry thread and turn identifiers; route them to the matching app-owned state. The SDK delivers both global and method-specific notification listeners. Each registration returns an unsubscribe function.

A `turn/start` response does not mean generation has finished. A completed turn can have a failed or interrupted status; inspect the notification's turn payload.

## Load history

Use `thread/read` for persisted thread data and `thread/resume` to load a thread into the running server. Follow the generated parameters and pagination fields rather than assuming the complete history fits one response. The [protocol inventory](/api/json-rpc) lists available methods.

## Interrupt and recover

Send `turn/interrupt` with the active `threadId` and `turnId`. Continue listening for the server's final notifications to reconcile app state.

Register `onDisconnect` to handle connection loss. Pending requests reject on disconnection; the SDK does not replay requests or reconnect automatically. Your app can start a fresh connection, initialize it, and resume the intended thread. Avoid blindly replaying mutations when their server-side outcome is unknown.
