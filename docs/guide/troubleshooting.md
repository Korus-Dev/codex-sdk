# Troubleshooting

## Codex does not start

Set an absolute `command` to choose the intended binary. Inspect stdio `onStderr` and `onExit`, then check the child environment, working directory, and Codex home. Explicit commands still receive [discovery's augmented environment](/api/transports#executable-discovery).

## A request times out

The default is 15 seconds, except `thread/revert` at 120 seconds. `requestTimeoutMs` overrides both. A timeout rejects local pending work; it does not cancel the operation in Codex. Reconcile server state before retrying a mutation.

## A method is unavailable

Check `codexSchemaCliVersion` and the running CLI version. The package's generated types describe `codex-cli 0.167.0`, including experimental APIs. Enable experimental capabilities in `initialize` when needed; runtime configuration, authentication, and server version still control availability.

## Notifications stop

Use `onDisconnect` to detect connection loss and `onProtocolError` to report malformed messages. Listener exceptions are isolated and go to `onListenerError`. The app owns reconnection and thread recovery.

## A protocol subpath fails to import

Generated declarations and method maps are types-only. Use `import type`, or import the client and runtime errors from the [runtime entry points](/api/).
