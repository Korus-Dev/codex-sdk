---
layout: home

hero:
  name: Codex SDK
  text: Build directly on Codex.
  tagline: A typed app-server client and Node.js transports for streaming conversations, approvals, and tools in your own application.
  image:
    src: /logo.svg
    alt: Codex SDK
  actions:
    - theme: brand
      text: Start a conversation
      link: /guide/quick-start
    - theme: alt
      text: Why Codex SDK
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/Korus-Dev/codex-sdk

features:
  - icon: 🧬
    title: Typed end to end
    details: Parameters, results, notifications, and server requests follow the pinned Codex schema, including experimental APIs.
  - icon: 🌊
    title: Streaming conversations
    details: Start and resume threads, submit turns, and follow incremental output with typed, method-specific listeners.
  - icon: 🛡️
    title: Approvals and tools in your hands
    details: Answer command, file, permission, and user-input requests with your own policy. Expose app-owned dynamic tools to Codex.
  - icon: 🔌
    title: Spawn it or attach to it
    details: Launch an isolated app-server over stdio, or connect to a running one through its Unix control socket.
  - icon: ⏱️
    title: Every request accounted for
    details: Correlation, deadlines, disconnect handling, and per-request timings, without collecting protocol payloads.
  - icon: 📦
    title: Zero runtime dependencies
    details: A small ESM package for Node.js 22.19 and newer, with declarations for bundler-based TypeScript projects.
---

## A conversation on one screen

The client finds Codex, starts the app-server, and streams the reply. Everything else, from state to interface, stays yours.

<<< @/examples/readme.ts

[Follow the full walkthrough →](/guide/quick-start)

## Start from what you are building

| If you want to… | Read |
| --- | --- |
| Run your first turn | [First conversation](/guide/quick-start) |
| Render output as it streams | [Stream events](/guide/streaming) |
| Choose how to reach Codex | [Connect to Codex](/guide/connecting) |
| Answer approvals and expose your own tools | [Approvals and tools](/guide/extensions) |
| Load history and resume work | [Threads and turns](/guide/conversations) |
| Survive crashes and dropped connections | [Reconnect and recover](/guide/recovery) |
| Sign users in | [Authentication](/guide/authentication) |
| Look up a method or type | [Protocol inventory](/api/json-rpc) |

## Where it fits

::: info One layer of three
Codex SDK is the raw protocol layer: typed JSON-RPC, transports, and executable discovery.
[multi-agent-sdk](https://github.com/Korus-Dev/multi-agent-sdk) adds a provider-neutral agent API, and
[agent-ui-sdk](https://github.com/Korus-Dev/agent-ui-sdk) adds Vue conversation components and Electron integration.
:::

This is an independently maintained SDK, separate from OpenAI's official SDKs. The generated protocol targets **codex-cli 0.167.0**; the running server determines which features are available.
