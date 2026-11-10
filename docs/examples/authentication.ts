import type { CodexAppServerClient } from '@korus-dev/codex-sdk';

export async function readAccount(client: CodexAppServerClient) {
  const state = await client.request('account/read', { refreshToken: false });
  // A null account is not a failed connection. The server reports whether auth is required.
  return state;
}

export async function beginLogin(client: CodexAppServerClient, openBrowser: (url: string) => void) {
  const unsubscribe = client.onNotification('account/login/completed', ({ params }) => {
    // Match params.loginId to the attempt owned by your app; refresh account/read on success.
    console.log(params.loginId, params.success);
  });
  try {
    const login = await client.request('account/login/start', { type: 'chatgpt' });
    if (login.type === 'chatgpt') openBrowser(login.authUrl);
    // Keep the subscription until completion or cancellation, then call unsubscribe().
    return { login, unsubscribe };
  } catch (error) {
    unsubscribe();
    throw error;
  }
}
