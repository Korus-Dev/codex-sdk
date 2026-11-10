# Transports and discovery

## Stdio

`new CodexAppServerStdioTransport(options?)` spawns and owns `codex app-server --listen stdio://`. Messages use JSONL over stdin/stdout; diagnostics are read separately from stderr.

| Option | Purpose |
| --- | --- |
| `command` | Explicit Codex executable, trimmed |
| `configOverrides` | Caller-owned `-c` overrides, in order; defaults to an empty list |
| `codexHome` | Set `CODEX_HOME` in the child environment |
| `cwd` | Child working directory |
| `env` | Child environment overrides, merged with the process environment |
| `executableDiscovery` | Injectable discovery dependencies and probe timeout |
| `onExit` | Receive `{ code, signal, stderr }` when the process exits |
| `onStderr` | Receive stderr chunks |
| `spawnProcess` | Injectable child-process spawn implementation |
| `shutdownTimeoutMs` | Shutdown grace period; default 12,000 ms |
| `maxDiagnosticBufferChars` | Retained diagnostic tail; default 64 Ki characters |
| `maxOutputLineChars` | JSONL line limit; default min(256 Mi characters, half Node's maximum string length) |

Closing the transport stops its child, with bounded shutdown. No feature flags are implicit. To opt into a Codex setting, pass its override explicitly, for example `configOverrides: ['features.default_mode_request_user_input=true']` when supported by your CLI.

## Unix socket

`new CodexAppServerUnixSocketTransport({ type: 'unixSocket', socketPath?, codexHome?, maxFrameBytes? })` connects to an already-running Codex control socket using its WebSocket framing. It does not start or stop that server.

An explicit nonblank `socketPath` wins. Otherwise, the path is `app-server-control/app-server-control.sock` under `codexHome`, `CODEX_HOME`, or `~/.codex`, in that order. The default maximum frame size is 64 MiB. Oversized or malformed frames surface through the protocol error path.

## Executable discovery

Stdio uses `resolveCodexRuntime({ command?, env?, discovery? })` to return `{ command, env }`. Discovery searches, in order:

1. macOS ChatGPT and Codex app bundles.
2. The current environment's PATH.
3. Login-shell PATH.
4. Common user binary locations.
5. nvm locations.

A nonblank explicit command is used unchanged apart from trimming, even if discovery finds another binary. Environment augmentation still runs, supporting launchers that need Node or other tools on PATH. Without a match, the command falls back to `codex` and spawn reports any failure.

Login-shell probes run asynchronously, concurrently, and with a five-second default bound per probe. Results are cached by shell, PATH, and home for the process lifetime. Windows skips login-shell probes and considers PATHEXT executable suffixes.

The root also exports synchronous helpers `discoverCodexExecutable`, `codexRuntimePathEntries`, and `withCodexRuntimePath`. Use the asynchronous resolver when avoiding event-loop blocking matters. `CodexExecutableDiscoveryDependencies` supports injected filesystem/process functions, shell, platform, paths, and `shellTimeoutMs` for controlled environments and tests.

## Custom transports

Implement `RpcTransport` to supply a different connection while retaining the client:

```ts
interface RpcTransport {
  start(): Promise<void>;
  send(message: RpcMessage): void;
  close(): Promise<void>;
  onMessage(listener: (message: unknown) => void): () => void;
  onError(listener: (error: Error) => void): () => void;
}
```

Message delivery must be subscribed before startup completes. `send` can throw; the client rejects that request. Use `RpcTransportProtocolError` for malformed framing that does not imply disconnection, with `requestId` when correlation is known. Other transport errors signal connection loss. Listener registrations must return cleanup functions.
