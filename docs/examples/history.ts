import type { CodexAppServerClient, v2 } from '@korus-dev/codex-sdk';

// The caller starts and initializes the connection once.
export async function listThreads(client: CodexAppServerClient): Promise<v2.Thread[]> {
  const threads: v2.Thread[] = [];
  let cursor: string | null = null;
  do {
    const page: v2.ThreadListResponse = await client.request('thread/list', {
      cursor, limit: 50, archived: false, sortKey: 'updated_at',
    });
    threads.push(...page.data);
    cursor = page.nextCursor;
  } while (cursor !== null);
  return threads;
}

export async function readHistory(client: CodexAppServerClient, threadId: string) {
  // Reading metadata/history does not resume the thread or submit a turn.
  const { thread } = await client.request('thread/read', { threadId, includeTurns: false });
  const turns: v2.Turn[] = [];
  let cursor: string | null = null;
  do {
    const page: v2.ThreadTurnsListResponse = await client.request('thread/turns/list', {
      threadId, cursor, limit: 50, sortDirection: 'asc', itemsView: 'summary',
    });
    turns.push(...page.data);
    cursor = page.nextCursor;
  } while (cursor !== null);
  return { thread, turns };
}

export async function resumeThread(client: CodexAppServerClient, threadId: string) {
  // Preserve backend settings by omitting model/provider overrides.
  return client.request('thread/resume', { threadId, excludeTurns: true });
}
