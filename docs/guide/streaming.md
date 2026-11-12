# Stream events

A turn is a conversation with notifications. After `turn/start` is accepted, Codex streams what it is doing, and your app turns those events into whatever it shows.

## The shape of a turn

```
turn/started
  item/started          item = agentMessage | commandExecution | fileChange | reasoning | ...
    item/agentMessage/delta   (repeated)
  item/completed
  turn/diff/updated     aggregated file changes so far
  thread/tokenUsage/updated
turn/completed          status = completed | interrupted | failed
```

Every event carries `threadId`, and most carry `turnId`. Route by those identifiers rather than by arrival order, especially when several threads share one client.

## Subscribe

```ts
const stop = client.onNotification('item/agentMessage/delta', ({ params }) => {
  render(params.threadId, params.itemId, params.delta);
});
```

`onNotification(method, listener)` narrows `params` to that method. `onNotification(listener)` receives every notification, which suits logging or a custom reducer. Each registration returns an unsubscribe function. A listener that throws never affects other listeners or in-flight requests; the error goes to `onListenerError`.

## Items are the unit of work

Each piece of work appears as a `ThreadItem`, delivered by `item/started` and `item/completed` with its final state. Use deltas for live rendering and the completed item as the authoritative record.

| Item `type` | Meaning | Live updates |
| --- | --- | --- |
| `agentMessage` | Text addressed to the user | `item/agentMessage/delta` |
| `reasoning` | Reasoning summary and content | `item/reasoning/summaryTextDelta`, `item/reasoning/textDelta` |
| `plan` | A proposed plan | `item/plan/delta`, `turn/plan/updated` |
| `commandExecution` | A shell command and its output | `item/commandExecution/outputDelta` |
| `fileChange` | A patch applied to files | `item/fileChange/outputDelta`, `item/fileChange/patchUpdated` |
| `mcpToolCall` | A tool call to an MCP server | `item/mcpToolCall/progress` |

Narrow on `item.type` to reach each variant's fields. The full list of items and methods is in the [protocol inventory](/api/json-rpc#server-notifications).

## Finish a turn

`turn/start` resolves when the turn is admitted, not when it finishes. Wait for `turn/completed` and inspect `turn.status` and `turn.error`; a completed notification can carry a failed or interrupted turn. Events may arrive before the `turn/start` response resolves, so record them by `turnId` instead of assuming the order.

<<< @/examples/streaming.ts

The helper accumulates text and the final diff per turn, ignores events from earlier turns, and rejects if the connection drops. `turn/interrupt` ends a turn early; it still finishes with a `turn/completed` notification.

## Useful signals beyond the turn

- `thread/tokenUsage/updated` reports context use for a progress meter.
- `thread/status/changed` tells you when a thread becomes active or idle.
- `serverRequest/resolved` dismisses an approval already answered elsewhere.
- `warning`, `configWarning`, and `deprecationNotice` surface server-side problems worth showing or logging.
- `account/updated` and `account/rateLimits/updated` report account changes.

To reduce traffic, pass `optOutNotificationMethods` in the `initialize` capabilities. Exact method names listed there are suppressed for that connection.
