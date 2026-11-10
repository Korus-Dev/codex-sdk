import { CodexAppServerClient, CodexAppServerStdioTransport } from '@korus-dev/codex-sdk';

const client = new CodexAppServerClient(new CodexAppServerStdioTransport());
client.onNotification('item/agentMessage/delta', ({ params }) => {
  process.stdout.write(params.delta);
});

await client.start();
try {
  await client.initialize({
    clientInfo: { name: 'hello_codex', title: null, version: '1.0.0' },
    capabilities: null,
  });
  const { thread } = await client.request('thread/start', {});
  const finished = new Promise<void>(resolve => {
    client.onNotification('turn/completed', () => resolve());
  });
  await client.request('turn/start', {
    threadId: thread.id,
    input: [{ type: 'text', text: 'Say hello!', text_elements: [] }],
  });
  await finished;
} finally {
  await client.close();
}
