# Examples

Every example below is typechecked against the package source on each docs build, so they stay current with the API.

| Example | Shows | Guide |
| --- | --- | --- |
| [`quick-start.ts`](https://github.com/Korus-Dev/codex-sdk/blob/main/docs/examples/quick-start.ts) | A complete turn with approvals, a deadline, and cleanup | [First conversation](/guide/quick-start) |
| [`readme.ts`](https://github.com/Korus-Dev/codex-sdk/blob/main/docs/examples/readme.ts) | The shortest streaming conversation | [Home](/) |
| [`streaming.ts`](https://github.com/Korus-Dev/codex-sdk/blob/main/docs/examples/streaming.ts) | Running a turn and collecting text and diff | [Stream events](/guide/streaming) |
| [`history.ts`](https://github.com/Korus-Dev/codex-sdk/blob/main/docs/examples/history.ts) | Paging threads and turns, resuming a thread | [Threads and turns](/guide/conversations) |
| [`tools.ts`](https://github.com/Korus-Dev/codex-sdk/blob/main/docs/examples/tools.ts) | An app-owned dynamic tool with argument validation | [Approvals and tools](/guide/extensions) |
| [`authentication.ts`](https://github.com/Korus-Dev/codex-sdk/blob/main/docs/examples/authentication.ts) | Reading account state and browser login | [Authentication](/guide/authentication) |
| [`unix-socket.ts`](https://github.com/Korus-Dev/codex-sdk/blob/main/docs/examples/unix-socket.ts) | Attaching to a running app-server | [Connect to Codex](/guide/connecting) |
| [`reconnect.ts`](https://github.com/Korus-Dev/codex-sdk/blob/main/docs/examples/reconnect.ts) | Keeping a client connected across failures | [Reconnect and recover](/guide/recovery) |

Run `npm run typecheck:docs` after changing an example.
