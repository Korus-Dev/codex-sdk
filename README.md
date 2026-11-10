# codex-sdk

Build Node.js apps on the Codex app-server with a typed JSON-RPC client, notifications, approval responses, and stdio or Unix-socket transports. The package has no runtime dependencies beyond Node.js built-ins. It is private and unpublished.

The supported runtime floor is Node.js 22.19.0. Development uses Node.js 26.12.1, recorded in `.node-version`. The protocol schema is pinned to **codex-cli 0.167.0**, including experimental APIs. Access to a method still depends on the running server and its configuration.

## Start a conversation

```ts
import { CodexAppServerClient, CodexAppServerStdioTransport } from 'codex-sdk';

const transport = new CodexAppServerStdioTransport({
  command: '/absolute/path/to/codex',
  cwd: process.cwd(),
  // Only caller-supplied overrides are passed as -c arguments, in order.
  configOverrides: [],
});
const client = new CodexAppServerClient(transport);
client.onNotification(notification => console.log(notification));
client.onServerRequest('item/commandExecution/requestApproval', (_request, responder) => {
  // Replace this policy with your app's approval UI.
  responder.resolve({ decision: 'decline' });
});

await client.start();
try {
  await client.initialize({
    clientInfo: { name: 'my_app', title: 'My App', version: '1.0.0' },
    capabilities: { experimentalApi: true, requestAttestation: false },
  });
  const { thread } = await client.request('thread/start', { cwd: process.cwd() });
  const completed = new Promise<void>(resolve => {
    const unsubscribe = client.onNotification('turn/completed', event => {
      if (event.params.threadId === thread.id) { unsubscribe(); resolve(); }
    });
  });
  await client.request('turn/start', {
    threadId: thread.id,
    input: [{ type: 'text', text: 'Explain this project.', text_elements: [] }],
  });
  await completed;
} finally {
  await client.close();
}
```

`initialize()` sends the required `initialized` notification once per connection. Register handlers before starting requests. Unhandled server requests receive a method-not-implemented error. A production app should also handle disconnection and impose its own turn-completion deadline.

## Choose a transport

- `CodexAppServerStdioTransport` spawns and owns `codex app-server --listen stdio://`. Closing it stops its child. Set `codexHome`, `cwd`, `env`, and `configOverrides` explicitly for isolation or app policy. No feature overrides are implicit.
- `CodexAppServerUnixSocketTransport({ type: 'unixSocket', socketPath })` connects to an existing server using the Codex control-socket WebSocket protocol. It never starts or stops that server. Without `socketPath`, it uses the Codex convention under `codexHome` (or the default Codex home).

Stdio uses `resolveCodexRuntime()` to augment the child environment. Discovery searches macOS Codex/ChatGPT application bundles, the current PATH, a login-shell PATH, common user binary locations, and nvm locations, in that order. Login-shell probes are asynchronous, bounded (5 seconds by default), and cached. Windows skips shell probes and uses PATHEXT candidates. A nonblank `command` is used as supplied (trimmed), but environment discovery still runs by default to support launchers that need Node or other tools on PATH. Set `executableDiscovery: false` to skip every shell/filesystem probe and PATH augmentation; the command is trimmed (or defaults to `codex`) and the child receives `process.env` merged with your `env` overrides. An unresolved default falls back to `codex`; spawn reports launch failures. Discovery helpers and injectable discovery dependencies are exported from the package root.

## Diagnostics and request lifecycle

Pass `onRequestSettled` in `CodexAppServerClientOptions` to collect request timings:

```ts
const client = new CodexAppServerClient(transport, {
  onRequestSettled(info) {
    // info: CodexRequestSettledInfo
    // { id, method, outcome: 'ok' | 'error' | 'timeout', startedAt, durationMs }
    console.log(info);
  },
  onListenerError(error) { console.error(error); },
});
```

The synchronous hook runs once per admitted outgoing request, including send, remote, protocol, disconnect, and close errors. Calls rejected before the client starts do not enter the hook. `startedAt` is epoch milliseconds; `durationMs` uses a monotonic clock. Payloads are excluded. Hook exceptions go to `onListenerError` (a process warning by default) and cannot change request settlement. No diagnostic environment flags are read. Requests default to 15 seconds, with 120 seconds for `thread/revert`; `requestTimeoutMs` overrides both.

## Imports

The root exports runtime APIs and generated types. Runtime subpaths are `codex-sdk/protocol`, `/protocol/client`, `/protocol/wire`, `/protocol/schema-version`, and `/protocol/listener-errors`. Generated declarations and method maps are deliberately **types-only**:

```ts
import type { Thread } from 'codex-sdk/protocol/generated/v2/Thread';
import type { CodexAppServerMethodMap } from 'codex-sdk/protocol/method-map';
```

Use `import type` for these paths; there is no runtime module for generated types.

## Documentation

Read the [guide](docs/guide/index.md) and [API reference](docs/api/index.md), or run `npm run dev:docs` for the VitePress site. `npm run build:docs` validates and builds it locally.

## Develop and regenerate

Package-local tooling versions are declared in `devDependencies`. Install through the containing workspace's dependency workflow, then use `npm run typecheck`, `npm run typecheck:tests`, and `npm test`. `npm run test:coverage` retains the 85% statement gate. `npm run build` emits ESM and declarations under `dist/`.

With a matching Codex CLI available:

```sh
npm run check:schema -- --codex /absolute/path/to/pinned/codex
npm run generate:schema -- --codex /absolute/path/to/pinned/codex
```

The generator checks the CLI version against `src/protocol/schema-version.ts` before generating files. It runs `app-server generate-ts --experimental`, rebuilds both request maps, and compares the complete generated file set in check mode. These commands generate schema locally; they do not run a provider turn.

To upgrade, obtain the intended CLI and explicitly select its version:

```sh
npm run generate:schema -- --codex /path/to/new/codex --expected-version 'codex-cli X.Y.Z'
```

Review generated types, both method maps, and the schema version together; run the typechecks, tests, build, and `check:schema` with that CLI. The CLI must be provisioned separately; the generator never downloads or installs it.
