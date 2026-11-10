# Approvals and tools

Codex can send requests back to your client while a turn is running. Register `onServerRequest(method, handler)` before submitting the turn. The method selects the request and response types.

For `item/commandExecution/requestApproval`, inspect the request and resolve a decision such as `{ decision: 'decline' }`. Your app owns the approval UI and policy. File-change approvals, permission requests, and `item/tool/requestUserInput` each have their own generated response shape.

A handler can respond synchronously or asynchronously. Returning `true` claims a request even if a response will arrive later. Otherwise, the next registered handler can try it. Once a responder resolves or rejects, later calls to that responder have no effect. A thrown handler error becomes an internal-error response. Unhandled requests receive error code `-32601`, configurable through `unhandledServerRequestError`.

## Dynamic tools

Pass `dynamicTools` in `thread/start` to describe app-owned tools using the generated `DynamicToolSpec` schema. Handle `item/tool/call` to execute a tool and send a typed result. Your app validates arguments, authorizes the action, and implements the operation. The protocol client does not execute tools for you.

Use `onAnyServerRequest` for a fallback handler when you need to observe multiple request methods. Consult the [server-request inventory](/api/json-rpc#server-requests) for the pinned methods.
