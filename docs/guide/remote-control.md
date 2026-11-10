# Remote control

Use the typed app-server RPCs to enable Codex remote control, pair clients, and inspect connection status. Your host owns eligibility checks, pairing presentation, expiry, cancellation, and device management.

## Check policy and enable

```ts
const { requirements } = await client.request('configRequirements/read');
if (requirements?.allowRemoteControl === false) {
  throw new Error('Remote control is disabled by managed policy.');
}
const status = await client.request('remoteControl/status/read');
await client.request('remoteControl/enable', { ephemeral: false });
```

Missing requirements are not an explicit grant. The running server decides whether an operation is available. Subscribe to `remoteControl/status/changed` for status updates rather than assuming an enable response means the connection is ready.

## Pair a client

```ts
const pairing = await client.request('remoteControl/pairing/start', { manualCode: true });
const url = new URL('https://chatgpt.com/codex/pair');
url.searchParams.set('pairing_code', pairing.pairingCode);
const result = await client.request('remoteControl/pairing/status', {
  pairingCode: pairing.pairingCode,
});
```

Present the URL as the QR destination, or show `manualPairingCode` when present. Keep `pairingCode` opaque and out of logs. Polling is host-owned; stop when claimed, expired, cancelled, or disconnected. The response contains `expiresAt` for expiry handling.

## List and revoke

Call `remoteControl/client/list` with the pairing's `environmentId`, a page size, and the previous `nextCursor`. Keep the environment filter on every page. To revoke a selected client, send `remoteControl/client/revoke` with `environmentId` and `clientId`. Confirm that action in your app before submitting it.

`remoteControl/disable` disables the server connection. Closing a Unix-socket SDK transport only disconnects this SDK client; it does not disable remote control or stop the shared server.

## Wire values

The SDK uses standard JSON parsing and does not transform timestamps, perform runtime schema validation, or revive arbitrary values to `bigint`. Some generated declarations use `bigint` for wide integer fields. Check the actual server representation and convert explicitly at your host boundary; JSON numbers beyond JavaScript's safe-integer range cannot be recovered losslessly after parsing. Do not serialize native `bigint` directly through JSON IPC.
