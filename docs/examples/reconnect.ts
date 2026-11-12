import {
  CodexAppServerClient,
  CodexAppServerStdioTransport,
  type CodexAppServerClientOptions,
} from '@korus-dev/codex-sdk';

export type SupervisorOptions = {
  /** Called after every successful connection, including reconnections. */
  onConnected(client: CodexAppServerClient): Promise<void> | void;
  onError?(error: Error): void;
  clientOptions?: CodexAppServerClientOptions;
  retryDelayMs?: number;
};

/**
 * Keeps one initialized client available. The SDK never reconnects by itself,
 * so the host decides when to retry and which threads to resume afterwards.
 */
export function superviseCodex({ onConnected, onError, clientOptions, retryDelayMs = 2_000 }: SupervisorOptions) {
  let stopped = false;
  let current: CodexAppServerClient | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const scheduleRetry = () => {
    if (stopped || timer) return;
    timer = setTimeout(() => {
      timer = null;
      void connect();
    }, retryDelayMs);
  };

  const connect = async (): Promise<void> => {
    if (stopped) return;
    const client = new CodexAppServerClient(new CodexAppServerStdioTransport(), clientOptions);
    const lost = (error: Error) => {
      if (current === client) current = null;
      onError?.(error);
      // Release the child process; pending requests were already rejected.
      void client.close().catch(() => undefined);
      scheduleRetry();
    };

    try {
      client.onDisconnect(lost);
      await client.start();
      await client.initialize({
        clientInfo: { name: 'my_app', title: 'My App', version: '1.0.0' },
        capabilities: null,
      });
      current = client;
      // Read or resume the threads your app owns here, before accepting new work.
      await onConnected(client);
    } catch (error) {
      if (current === client) current = null;
      onError?.(error instanceof Error ? error : new Error(String(error)));
      await client.close().catch(() => undefined);
      scheduleRetry();
    }
  };

  void connect();

  return {
    get client() {
      return current;
    },
    async stop() {
      stopped = true;
      if (timer) clearTimeout(timer);
      const client = current;
      current = null;
      await client?.close();
    },
  };
}
