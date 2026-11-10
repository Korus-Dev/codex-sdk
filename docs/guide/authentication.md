# Authentication

Codex app-server owns account authentication. Your app reads it through `account/read` and renders its own signed-in or signed-out experience.

After initializing the client, send `account/login/start` with `{ type: 'chatgpt' }` for browser login or `{ type: 'chatgptDeviceCode' }` for device-code login. Narrow the response by `type`: browser login provides `authUrl` and `loginId`; device-code login provides `verificationUrl`, `userCode`, and `loginId`.

Register for `account/login/completed` before starting login. Your app opens the browser or displays the device code, handles completion, and refreshes `account/read`. Use `account/login/cancel` to cancel a pending login and `account/logout` to sign out. The SDK does not maintain an account cache or launch a browser.

Set stdio `codexHome` when the app needs a separate Codex identity and history directory. Treat authentication payloads and credentials as host-owned data; do not include them in logs or request diagnostics.

## Browser login

<<< @/examples/authentication.ts

The example accepts a host browser opener instead of launching one from the SDK. Keep one login attempt per app-owned session, match completion by `loginId`, and remove the subscription on completion, cancellation, or shutdown. Completion can arrive before another request resolves, so register first.

## Other credentials

`account/login/start` is a discriminated union. API-key login uses `{ type: 'apiKey', apiKey }`; device-code login returns a URL and one-time code to present to the user. Other variants carry their own required fields in `LoginAccountParams`. Never put credentials into renderer state or diagnostic logs.

`account/updated` and `account/rateLimits/updated` report backend changes. Use `account/rateLimits/read` to request current limits. Do not infer identity or entitlement from a model name or local credential files. If credentials change under a running process, reconnect and reread account state before continuing.
