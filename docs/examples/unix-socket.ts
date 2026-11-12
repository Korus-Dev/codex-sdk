import { CodexAppServerClient, CodexAppServerUnixSocketTransport } from '@korus-dev/codex-sdk';

/**
 * Attaches to an app-server that is already running, for example one started
 * with `codex app-server --listen unix://`. Closing the client disconnects
 * this connection and leaves the server running.
 */
export async function attachToRunningServer(socketPath?: string) {
  const client = new CodexAppServerClient(
    new CodexAppServerUnixSocketTransport({ type: 'unixSocket', socketPath }),
  );
  await client.start();
  try {
    await client.initialize({
      clientInfo: { name: 'my_app', title: 'My App', version: '1.0.0' },
      capabilities: null,
    });
    const { data } = await client.request('thread/loaded/list', {});
    return { client, loadedThreadIds: data };
  } catch (error) {
    await client.close();
    throw error;
  }
}
