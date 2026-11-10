# Build an app on Codex

Use `@korus-dev/codex-sdk` to send typed requests to the Codex app-server, stream notifications, and respond to approval or tool requests from your Node.js host.

Start with a [conversation](/guide/quick-start), choose a [transport](/api/transports), then add your app's [approval and tool handlers](/guide/extensions).

The SDK exposes the Codex protocol directly. Your app owns conversation state, persistence policy, authentication UX, and presentation. The checked-in schema is `codex-cli 0.167.0`; the running server determines which features are available.
