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

## List, read, and resume

<<< @/examples/history.ts

Keep the same filters on each page and treat cursors as opaque. `archived: false` selects non-archived threads; `true` selects archived threads. Omitting `sourceKinds` or passing an empty list uses the server's interactive-source defaults. The SDK does not widen that filter. Listing persisted threads differs from `thread/loaded/list`, which reports the running server's loaded threads.

`thread/read` is suitable for a history viewer. `thread/resume` loads or rejoins runtime state; use it when continuing work. Metadata-only reads and resumes avoid fetching an entire large history. Page turns with `thread/turns/list`, and page their item detail with `thread/items/list` using the returned `nextCursor`. A turn summary need not contain every item.

## Input and settings

`turn/start` accepts generated `UserInput` variants, including text, images, skills, and mentions. Keep the discriminant (`type`) and required fields for each variant. Text input includes `text_elements: []` when no inline elements are present. For a turn-specific setting, use the fields on `TurnStartParams`; for thread defaults, use `ThreadStartParams` or `ThreadResumeParams`.

Read `config/read`, `model/list`, and the returned thread settings to present choices. Omit overrides to retain server-selected settings; do not invent a provider, model, reasoning effort, or token count when the backend does not report one.

## Mutations and recovery

`thread/fork` creates a separate continuation. `thread/archive` and `thread/unarchive` change listing visibility; `thread/name/set` sets a display name. Use each generated request shape in the [inventory](/api/json-rpc). Persistence, retention, and destructive-action confirmation belong to the host.

A request deadline does not stop the server operation. To interrupt a running turn, send `turn/interrupt` with its IDs and keep listening for completion. On reconnect, create or restart the transport, initialize the new connection, then read or resume the intended thread. Reconcile authoritative history before replaying a mutation that may already have succeeded.
