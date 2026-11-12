import type { CodexAppServerClient, v2 } from '@korus-dev/codex-sdk';

export type TurnResult = {
  status: v2.TurnStatus;
  error: v2.TurnError | null;
  text: string;
  diff: string | null;
};

type TurnState = { text: string; diff: string | null; completed: v2.Turn | null };

/**
 * Runs one turn and resolves with its outcome. Events are recorded per turn ID,
 * so notifications that arrive before the `turn/start` response are not lost
 * and a late event from an earlier turn cannot finish this one.
 */
export async function runTurn(
  client: CodexAppServerClient,
  threadId: string,
  prompt: string,
  onText: (delta: string) => void = () => undefined,
): Promise<TurnResult> {
  const turns = new Map<string, TurnState>();
  const stateFor = (turnId: string): TurnState => {
    let state = turns.get(turnId);
    if (!state) {
      state = { text: '', diff: null, completed: null };
      turns.set(turnId, state);
    }
    return state;
  };

  let activeTurnId: string | null = null;
  const { promise, resolve, reject } = Promise.withResolvers<TurnResult>();
  const settleIfDone = () => {
    const state = activeTurnId === null ? undefined : turns.get(activeTurnId);
    if (state?.completed) {
      resolve({
        status: state.completed.status,
        error: state.completed.error,
        text: state.text,
        diff: state.diff,
      });
    }
  };

  const subscriptions = [
    client.onNotification('item/agentMessage/delta', ({ params }) => {
      if (params.threadId !== threadId) return;
      stateFor(params.turnId).text += params.delta;
      if (params.turnId === activeTurnId) onText(params.delta);
    }),
    client.onNotification('turn/diff/updated', ({ params }) => {
      if (params.threadId === threadId) stateFor(params.turnId).diff = params.diff;
    }),
    client.onNotification('turn/completed', ({ params }) => {
      if (params.threadId !== threadId) return;
      stateFor(params.turn.id).completed = params.turn;
      settleIfDone();
    }),
    client.onDisconnect(reject),
  ];

  try {
    const { turn } = await client.request('turn/start', {
      threadId,
      input: [{ type: 'text', text: prompt, text_elements: [] }],
    });
    activeTurnId = turn.id;
    settleIfDone();
    return await promise;
  } finally {
    for (const unsubscribe of subscriptions) unsubscribe();
  }
}
