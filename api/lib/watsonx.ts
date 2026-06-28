/**
 * IBM Watsonx.ai helper — eu-de (Frankfurt) region
 * REST API — no SDK needed, works in Vercel serverless
 *
 * Required env vars:
 *   IBM_API_KEY      — IBM Cloud API key
 *   IBM_PROJECT_ID   — Watsonx.ai project ID
 */

const WATSONX_URL = 'https://eu-de.ml.cloud.ibm.com';
const MODEL_ID = 'ibm/granite-4-h-small';
const IAM_TOKEN_URL = 'https://iam.cloud.ibm.com/identity/token';

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getIAMToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const resp = await fetch(IAM_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
      apikey: process.env.IBM_API_KEY!,
    }),
  });
  if (!resp.ok) throw new Error(`IBM IAM token error ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
  return cachedToken!;
}

export interface WatsonxMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface WatsonxOptions {
  temperature?: number;
  max_tokens?: number;
}

export async function callGranite(messages: WatsonxMessage[], options: WatsonxOptions = {}): Promise<string> {
  const token = await getIAMToken();
  const resp = await fetch(`${WATSONX_URL}/ml/v1/text/chat?version=2024-05-31`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      model_id: MODEL_ID,
      project_id: process.env.IBM_PROJECT_ID!,
      messages,
      parameters: { temperature: options.temperature ?? 0.7, max_new_tokens: options.max_tokens ?? 1024 },
    }),
  });
  if (!resp.ok) throw new Error(`Watsonx API error ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  return data.choices?.[0]?.message?.content ?? '';
}

export async function callGraniteWithRetry(
  messages: WatsonxMessage[],
  options: WatsonxOptions = {},
  retries = 3,
  delay = 1000
): Promise<string> {
  try {
    return await callGranite(messages, options);
  } catch (error: any) {
    const msg = (error?.message || '').toLowerCase();
    const isTransient = msg.includes('429') || msg.includes('503') || msg.includes('rate limit') || msg.includes('unavailable');
    if (isTransient && retries > 0) {
      await new Promise(r => setTimeout(r, delay));
      return callGraniteWithRetry(messages, options, retries - 1, delay * 1.8);
    }
    throw error;
  }
}
