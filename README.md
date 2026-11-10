# Codex SDK

**Build Node.js applications on the Codex app-server.**

A typed TypeScript client for streaming conversations, responding to approvals, and connecting your tools to Codex. Bring your own application state and interface—the SDK handles the protocol and connection.

[![npm version](https://img.shields.io/npm/v/%40korus-dev%2Fcodex-sdk?color=0b7a65)](https://www.npmjs.com/package/@korus-dev/codex-sdk)
[![CI](https://github.com/Korus-Dev/codex-sdk/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Korus-Dev/codex-sdk/actions/workflows/ci.yml)
[![Documentation](https://github.com/Korus-Dev/codex-sdk/actions/workflows/docs.yml/badge.svg?branch=main)](https://korus-dev.github.io/codex-sdk/)
[![License](https://img.shields.io/badge/license-Apache--2.0-0b7a65.svg)](LICENSE)
[![Node.js](https://img.shields.io/node/v/%40korus-dev%2Fcodex-sdk?color=339933)](package.json)

**[Documentation →](https://korus-dev.github.io/codex-sdk/)** · [Getting started](https://korus-dev.github.io/codex-sdk/guide/quick-start.html) · [API reference](https://korus-dev.github.io/codex-sdk/api/) · [Contributing](CONTRIBUTING.md)

## What you get

- **Typed requests and events.** Parameters, results, notifications, and tool responses follow the Codex app-server schema.
- **Streaming conversations.** Start and resume threads, submit turns, and receive incremental output.
- **Approvals and tools.** Respond to server requests with your application's authorization policy.
- **Two ways to connect.** Launch an app-server over stdio or attach to an existing Unix control socket.
- **Request diagnostics.** Observe outcomes and timings without collecting protocol payloads.
- **Zero runtime dependencies.** ESM built on Node.js, with TypeScript declarations for bundler-based projects.

This is an independently maintained SDK, separate from OpenAI's official SDKs.

Use [multi-agent-sdk](https://github.com/Korus-Dev/multi-agent-sdk) for a provider-neutral agent API and [agent-ui-sdk](https://github.com/Korus-Dev/agent-ui-sdk) for Vue conversation components and Electron integration.

## Install

```sh
npm install @korus-dev/codex-sdk
```

Requires **Node.js 22.19.0 or newer** and a separately installed Codex CLI. TypeScript projects also need `@types/node`. Use ESM (`"type": "module"` in your app's `package.json`).

The generated protocol targets **Codex CLI 0.167.0**, including experimental APIs. Feature availability depends on the running server and its configuration.

## Your first conversation

With Codex installed and authenticated, stream your first reply:

```ts
import { CodexAppServerClient, CodexAppServerStdioTransport } from '@korus-dev/codex-sdk';

const client = new CodexAppServerClient(new CodexAppServerStdioTransport());
client.onNotification('item/agentMessage/delta', ({ params }) => {
  process.stdout.write(params.delta);
});

await client.start();
try {
  await client.initialize({
    clientInfo: { name: 'hello_codex', title: null, version: '1.0.0' },
    capabilities: null,
  });
  const { thread } = await client.request('thread/start', {});
  const finished = new Promise<void>(resolve => {
    client.onNotification('turn/completed', () => resolve());
  });
  await client.request('turn/start', {
    threadId: thread.id,
    input: [{ type: 'text', text: 'Say hello!', text_elements: [] }],
  });
  await finished;
} finally {
  await client.close();
}
```

The SDK finds Codex automatically and uses your current directory. See the [full conversation guide](https://korus-dev.github.io/codex-sdk/guide/quick-start.html) for approvals, deadlines, and connection recovery.

## Connect your way

| Transport | Use it when | Lifecycle |
| --- | --- | --- |
| `CodexAppServerStdioTransport` | Your app should launch its own Codex process | Closing the transport stops its child |
| `CodexAppServerUnixSocketTransport` | An app-server is already running | Closing disconnects this client and leaves the server running |

Configure `command`, `cwd`, `codexHome`, environment variables, and Codex overrides in your trusted Node.js host. There are no implicit feature flags. Set `executableDiscovery: false` when you want only your supplied command and environment.

See [transports and executable discovery](https://korus-dev.github.io/codex-sdk/api/transports.html) for configuration and custom transports.

## Go further

| Build | Guide |
| --- | --- |
| History and conversation recovery | [Threads and turns](https://korus-dev.github.io/codex-sdk/guide/conversations.html) |
| Account and sign-in flows | [Authentication](https://korus-dev.github.io/codex-sdk/guide/authentication.html) |
| App-owned tools and approval handling | [Approvals and tools](https://korus-dev.github.io/codex-sdk/guide/extensions.html) |
| External tool services | [MCP servers](https://korus-dev.github.io/codex-sdk/guide/mcp.html) |
| Pairing and remote connections | [Remote control](https://korus-dev.github.io/codex-sdk/guide/remote-control.html) |
| Every typed protocol method | [Protocol inventory](https://korus-dev.github.io/codex-sdk/api/json-rpc.html) |

Import runtime APIs and types from `@korus-dev/codex-sdk`. See the [export reference](https://korus-dev.github.io/codex-sdk/api/) for the complete API and generated types.

## Development

```sh
npm ci
npm run check
```

Development uses Node.js 26.12.1, pinned in `.node-version`. `check` runs typechecks, tests with coverage, the package build, a packed-consumer check, and the VitePress build. Preview the VitePress documentation with `npm run dev:docs`.

See the [development guide](docs/guide/development.md) for schema generation, CLI verification, and release workflows.

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md), or [open an issue](https://github.com/Korus-Dev/codex-sdk/issues) for bugs and questions.

## License and security

Released under [Apache-2.0](LICENSE). See [CHANGELOG.md](CHANGELOG.md) for release notes and [SECURITY.md](SECURITY.md) to report vulnerabilities privately.
