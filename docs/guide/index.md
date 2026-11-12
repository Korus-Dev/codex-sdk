# Why Codex SDK

Codex app-server exposes a rich, bidirectional JSON-RPC protocol. `@korus-dev/codex-sdk` makes it comfortable to use from Node.js: every request, notification, and server request is typed, and the plumbing around it is handled once.

- Launching or finding the Codex executable, and speaking JSONL over stdio or a Unix control socket.
- Correlating responses, enforcing request deadlines, and rejecting pending work when a connection drops.
- Typing `thread/start`, `turn/start`, and every other method against the checked-in schema.
- Routing approvals, user-input questions, and dynamic tool calls to handlers you register.
- Reporting request timings and listener failures without touching protocol payloads.

## The boundary

The SDK owns the protocol. Your application owns the product.

| The SDK handles | Your application decides |
| --- | --- |
| Request and response correlation | Which threads to load and when |
| Typed notifications and server requests | How output is reduced into state and shown |
| Stdio and Unix-socket connections | When to reconnect and what to resume |
| Executable discovery and child environment | Which Codex, home directory, and configuration to trust |
| Request deadlines and diagnostics | Retry, cancellation, and logging policy |
| Responder lifecycle for server requests | Approval policy and tool authorization |

The client does not reduce notifications into conversation snapshots, reload history, or reconnect on its own. That keeps it small and predictable, and it keeps decisions that depend on your product in your code.

## Choose your layer

| Layer | Use it for |
| --- | --- |
| **codex-sdk** (this package) | Talking to Codex app-server with full protocol fidelity |
| [multi-agent-sdk](https://github.com/Korus-Dev/multi-agent-sdk) | A provider-neutral agent API |
| [agent-ui-sdk](https://github.com/Korus-Dev/agent-ui-sdk) | Vue conversation components and Electron integration |

Reach for this package when you need the protocol itself: a custom host, a bridge, a test harness, or a capability the higher layers do not project yet. Keep it in a trusted Node.js host and expose product-shaped actions to anything beyond it.

## Default workflow

1. [Install the SDK](/guide/installation) and make sure the Codex CLI is available and signed in.
2. Run a [first conversation](/guide/quick-start) over the default stdio transport.
3. [Stream events](/guide/streaming) into your own state and handle [approvals and tools](/guide/extensions).
4. Add [history](/guide/conversations), [authentication](/guide/authentication), and [recovery](/guide/recovery) as your app needs them.

## Next

- [Install the package](/guide/installation)
- [Run your first conversation](/guide/quick-start)
- [Connect to Codex](/guide/connecting)
- [Understand the architecture](/guide/architecture)
- [Browse the API reference](/api/)

The checked-in schema is **codex-cli 0.167.0**, including experimental APIs. The running server determines which features are available.
