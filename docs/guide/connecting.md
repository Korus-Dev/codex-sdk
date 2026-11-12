# Connect to Codex

Two transports ship with the SDK, and both plug into the same `CodexAppServerClient`.

| Transport | Use it when | Lifecycle |
| --- | --- | --- |
| `CodexAppServerStdioTransport` | Your app should launch its own Codex process | The transport owns the child; closing it stops the process |
| `CodexAppServerUnixSocketTransport` | An app-server is already running | The server is not yours; closing disconnects this client only |

## Launch your own app-server

The stdio transport runs `codex app-server --listen stdio://` and speaks JSONL over its pipes. With no options it finds Codex for you and uses the current directory:

```ts
const client = new CodexAppServerClient(new CodexAppServerStdioTransport());
```

Configure the process in your trusted host:

```ts
const transport = new CodexAppServerStdioTransport({
  command: '/absolute/path/to/codex',
  cwd: '/path/to/project',
  codexHome: '/path/to/app-codex-home',
  env: { HTTPS_PROXY: 'http://proxy.example.com:8080' },
  configOverrides: ['mcp_servers.knowledge.url="https://mcp.example.com/mcp"'],
  onStderr: text => logger.debug(text),
  onExit: ({ code, signal }) => logger.info({ code, signal }),
});
```

- `command` pins the executable. Without it, [discovery](/api/transports#executable-discovery) searches app bundles, your `PATH`, a login shell, and common install locations.
- `codexHome` gives the process its own identity, configuration, and history. Use it to isolate your app from the user's personal Codex.
- `configOverrides` become `-c` arguments in the order you give them. No feature flags are implicit.
- `executableDiscovery: false` limits the transport to the command and environment you supplied.

See [transports and discovery](/api/transports) for every option and default.

## Attach to a running app-server

Start a server that listens on a control socket, then connect to it:

```sh
codex app-server --listen unix://
```

<<< @/examples/unix-socket.ts

Without `socketPath`, the transport looks for `app-server-control/app-server-control.sock` under `codexHome`, then `CODEX_HOME`, then `~/.codex`. Several clients can share one server, which is how an app can follow work started elsewhere. Disconnecting never stops or disables anything on the server.

## Write your own transport

The client needs only five methods. Implement `RpcTransport` to tunnel through SSH, a WebSocket, or an in-memory fake for tests. See [custom transports](/api/transports#custom-transports) for the contract and its error semantics.

## What every transport shares

- Call `client.start()` before the first request and `client.close()` when finished.
- Call `initialize()` once per connection. It sends the required `initialized` notification for you.
- A connection error rejects pending requests and reports through `onDisconnect`. Nothing reconnects automatically; see [reconnect and recover](/guide/recovery).
- Malformed frames report through `onProtocolError` and do not by themselves mean the connection is lost.
