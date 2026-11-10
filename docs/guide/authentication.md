# Authentication

Codex app-server owns account authentication. Your app reads it through `account/read` and renders its own signed-in or signed-out experience.

After initializing the client, send `account/login/start` with `{ type: 'chatgpt' }` for browser login or `{ type: 'chatgptDeviceCode' }` for device-code login. Narrow the response by `type`: browser login provides `authUrl` and `loginId`; device-code login provides `verificationUrl`, `userCode`, and `loginId`.

Register for `account/login/completed` before starting login. Your app opens the browser or displays the device code, handles completion, and refreshes `account/read`. Use `account/login/cancel` to cancel a pending login and `account/logout` to sign out. The SDK does not maintain an account cache or launch a browser.

Set stdio `codexHome` when the app needs a separate Codex identity and history directory. Treat authentication payloads and credentials as host-owned data; do not include them in logs or request diagnostics.
