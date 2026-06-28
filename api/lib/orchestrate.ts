/**
 * IBM watsonx Orchestrate helper — calls a deployed native Orchestrate agent
 * (e.g. "Startup_grant_agent") via its chat/completions endpoint.
 *
 * This is a different IBM Cloud service than raw watsonx.ai (see watsonx.ts).
 * Orchestrate agents are built/configured in the Orchestrate console (Agent
 * Builder UI) and can use tools, knowledge bases, and their own reasoning
 * loop — this module just invokes the already-deployed agent over REST.
 *
 * Required env vars:
 *   ORCHESTRATE_SERVICE_URL   — e.g. https://api.eu-de.watson-orchestrate.cloud.ibm.com/instances/<instance-id>
 *   ORCHESTRATE_AGENT_ID      — the agent's ID (from the agent's settings in the console)
 *   ORCHESTRATE_IAM_APIKEY    — IBM Cloud API key with access to this Orchestrate instance
 */

const IAM_TOKEN_URL = 'https://iam.cloud.ibm.com/identity/token';

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getOrchestrateIAMToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const resp = await fetch(IAM_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
      apikey: process.env.ORCHESTRATE_IAM_APIKEY!,
    }),
  });
  if (!resp.ok) throw new Error(`Orchestrate IAM token error ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
  return cachedToken!;
}

export interface OrchestrateMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Calls the deployed Orchestrate agent's chat/completions endpoint.
 * Note: Orchestrate agents carry their own instructions/behavior configured
 * in the console, so a "system" message here is sent as additional context
 * but the agent's own configured instructions still drive its behavior.
 */
export async function callOrchestrateAgent(messages: OrchestrateMessage[]): Promise<string> {
  const baseUrl = process.env.ORCHESTRATE_SERVICE_URL!;
  const agentId = process.env.ORCHESTRATE_AGENT_ID!;
  if (!baseUrl || !agentId) {
    throw new Error('Orchestrate not configured: missing ORCHESTRATE_SERVICE_URL or ORCHESTRATE_AGENT_ID');
  }

  const token = await getOrchestrateIAMToken();
  const url = `${baseUrl.replace(/\/$/, '')}/v1/orchestrate/${agentId}/chat/completions`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      stream: false,
    }),
  });

  if (!resp.ok) {
    throw new Error(`Orchestrate API error ${resp.status}: ${await resp.text()}`);
  }

  const data = await resp.json();
  // ChatCompletionResponse.choices[0] shape mirrors OpenAI-style chat completions.
  const choice = data?.choices?.[0];
  const content =
    choice?.message?.content ??
    choice?.delta?.content ??
    (typeof choice === 'string' ? choice : '');

  if (!content) {
    throw new Error('Orchestrate API returned an empty response');
  }
  return content;
}

export async function callOrchestrateAgentWithRetry(
  messages: OrchestrateMessage[],
  retries = 2,
  delay = 1000
): Promise<string> {
  try {
    return await callOrchestrateAgent(messages);
  } catch (error: any) {
    const msg = (error?.message || '').toLowerCase();
    const isTransient = msg.includes('429') || msg.includes('503') || msg.includes('rate limit') || msg.includes('unavailable');
    if (isTransient && retries > 0) {
      await new Promise(r => setTimeout(r, delay));
      return callOrchestrateAgentWithRetry(messages, retries - 1, delay * 1.8);
    }
    throw error;
  }
}
