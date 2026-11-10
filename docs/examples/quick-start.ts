import { CodexAppServerClient, CodexAppServerStdioTransport } from '@korus-dev/codex-sdk';

const client = new CodexAppServerClient(new CodexAppServerStdioTransport({
  command: '/absolute/path/to/codex',
  cwd: process.cwd(),
  configOverrides: [],
}));
client.onNotification('item/agentMessage/delta', ({ params }) => {
  process.stdout.write(params.delta);
});
client.onServerRequest('item/commandExecution/requestApproval', (_request, responder) => {
  responder.resolve({ decision: 'decline' });
});

await client.start();
try {
  await client.initialize({
    clientInfo: { name: 'my_app', title: 'My App', version: '1.0.0' },
    capabilities: { experimentalApi: true, requestAttestation: false },
  });
  const { thread } = await client.request('thread/start', { cwd: process.cwd() });
  const { promise: completed, resolve, reject } = Promise.withResolvers<void>();
  const unsubscribeCompleted = client.onNotification('turn/completed', ({ params }) => {
    if (params.threadId !== thread.id) return;
    if (params.turn.status === 'completed') resolve();
    else reject(new Error(`Turn ended: ${params.turn.status}`));
  });
  const unsubscribeDisconnect = client.onDisconnect(reject);
  const deadline = setTimeout(() => reject(new Error('Turn completion timed out')), 300_000);
  // Observe rejection even if the connection drops before turn/start responds.
  void completed.catch(() => undefined);
  try {
    await client.request('turn/start', {
      threadId: thread.id,
      input: [{ type: 'text', text: 'Explain this project.', text_elements: [] }],
    });
    await completed;
  } finally {
    clearTimeout(deadline);
    unsubscribeCompleted();
    unsubscribeDisconnect();
  }
} finally {
  await client.close();
}
