import { isRecord, type CodexAppServerClient, type v2 } from '@korus-dev/codex-sdk';

export const tools: v2.DynamicToolSpec[] = [{
  type: 'function', name: 'lookup_ticket', description: 'Read a ticket by ID',
  inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: false },
}];

export function registerTicketTool(client: CodexAppServerClient, lookupTicket: (id: string) => Promise<string>) {
  return client.onServerRequest('item/tool/call', async ({ params }, responder) => {
    if (params.namespace !== null || params.tool !== 'lookup_ticket') return false;
    const input = params.arguments;
    if (!isRecord(input) || typeof input.id !== 'string' || Object.keys(input).some(key => key !== 'id')) {
      responder.resolve({ success: false, contentItems: [{ type: 'inputText', text: 'Expected a ticket ID.' }] });
      return true;
    }
    // The injected host function must authorize access for this connection's user.
    const text = await lookupTicket(input.id);
    responder.resolve({ success: true, contentItems: [{ type: 'inputText', text }] });
    return true;
  });
}

export async function startToolThread(client: CodexAppServerClient) {
  return client.request('thread/start', { dynamicTools: tools });
}
