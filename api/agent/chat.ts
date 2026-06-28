import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GRANTS } from '../../src/data/grants.js';
import { callGraniteWithRetry } from '../lib/watsonx.js';
import { callOrchestrateAgentWithRetry } from '../lib/orchestrate.js';
import { checkComplianceForUserMessage } from '../lib/compliance.js';

function generateLocalChatFallback(message: string, startupProfile: any, language = 'english'): string {
  const query = (message || '').toLowerCase();
  const lang = (language || 'english').toLowerCase();

  let matchedGrants = GRANTS.filter(g => {
    const nameMatch = g.name && query.includes(g.name.toLowerCase());
    const domainMatch = Array.isArray(g.domain) && g.domain.some(d => query.includes(d.toLowerCase()));
    const stageMatch = Array.isArray(g.stage) && g.stage.some(s => query.includes(s.toLowerCase()));
    return nameMatch || domainMatch || stageMatch;
  });

  if (matchedGrants.length === 0 && startupProfile) {
    const pDomain = (startupProfile.domain || '').toLowerCase();
    const pStage = (startupProfile.stage || '').toLowerCase();
    matchedGrants = GRANTS.filter(g => {
      const dMatches = Array.isArray(g.domain) && (g.domain.includes('any') || g.domain.some(d => d.toLowerCase() === pDomain));
      const sMatches = Array.isArray(g.stage) && (g.stage.includes('any') || g.stage.some(s => s.toLowerCase() === pStage));
      return dMatches && sMatches;
    }).slice(0, 3);
  }
  if (matchedGrants.length === 0) matchedGrants = GRANTS.slice(0, 3);

  if (lang === 'hindi') {
    let r = `### **IBM ग्रेनाइट स्थानीय एजेंट सलाहकार**\n\n*नोट: Watsonx.ai अस्थायी रूप से अनुपलब्ध है। स्थानीय हेयुरिस्टिक कोर सक्रिय है।*\n\n`;
    matchedGrants.forEach(g => {
      r += `#### **${g.name}**\n- **फंडिंग:** ${g.amount_display}\n- **पात्रता:** ${g.eligibility}\n- **समय सीमा:** ${g.deadline}\n- **स्रोत:** ${g.source}\n- **आवेदन:** [आधिकारिक पोर्टल](${g.application_link})\n\n`;
    });
    r += `### कार्रवाई योग्य कदम\n1. **दस्तावेज सत्यापित करें:** DPIIT मान्यता प्रमाणपत्र अद्यतन रखें।\n2. **प्रस्ताव तैयार करें:** प्रस्ताव जनरेटर टैब का उपयोग करें।\n3. **पिच डेक:** फंडिंग बोर्ड की आवश्यकताओं के अनुसार तैयार करें।`;
    return r;
  }

  if (lang === 'punjabi') {
    let r = `### **IBM ਗ੍ਰੇਨਾਈਟ ਸਥਾਨਕ ਏਜੰਟ ਸਲਾਹਕਾਰ**\n\n*ਨੋਟ: Watsonx.ai ਅਸਥਾਈ ਤੌਰ 'ਤੇ ਉਪਲਬਧ ਨਹੀਂ। ਸਥਾਨਕ ਹੇਯੂਰਿਸਟਿਕ ਕੋਰ ਸਰਗਰਮ ਹੈ।*\n\n`;
    matchedGrants.forEach(g => {
      r += `#### **${g.name}**\n- **ਫੰਡਿੰਗ:** ${g.amount_display}\n- **ਯੋਗਤਾ:** ${g.eligibility}\n- **ਆਖਰੀ ਮਿਤੀ:** ${g.deadline}\n- **ਸਰੋਤ:** ${g.source}\n- **ਅਰਜ਼ੀ:** [ਅਧਿਕਾਰਤ ਪੋਰਟਲ](${g.application_link})\n\n`;
    });
    return r;
  }

  let r = `### **IBM Granite Local Agent Advisory**\n\n*Note: Watsonx.ai is temporarily unavailable. Using local heuristic engine.*\n\n`;
  r += `Based on your request, here are the best-matched grants from our database:\n\n`;
  matchedGrants.forEach(g => {
    r += `#### **${g.name}**\n- **Funding:** ${g.amount_display}\n- **Eligibility:** ${g.eligibility}\n- **Deadline:** ${g.deadline}\n- **Source:** ${g.source}\n- **Apply:** [Official Portal](${g.application_link})\n\n`;
    r += `*Strategic Fit:* This scheme aligns with ${startupProfile?.name || 'your startup'}'s profile and developmental timeline.\n\n`;
  });
  r += `### Actionable Next Steps\n1. **Verify Documentation:** Ensure your DPIIT recognition certificate is valid.\n2. **Draft Proposal:** Use the Proposal Generator tab to create a professional pitch.\n3. **Prepare Pitch Deck:** Align your slides with the funding board's milestones.`;
  return r;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  const { message, history, startupProfile, language = 'english' } = req.body;
  if (!message) return res.status(400).json({ success: false, error: 'Message is required.' });

  // Legal-boundary guardrail: never let the agent attempt restricted portal
  // actions (auto-submit, credential entry, CAPTCHA bypass) on behalf of the
  // user. This check runs before any AI call, on every message.
  const compliance = checkComplianceForUserMessage(message);
  if (!compliance.allowed) {
    return res.json({ success: true, reply: compliance.userMessage, timestamp: new Date().toISOString() });
  }

  try {
    const grantsContext = GRANTS.map(g =>
      `- ID: ${g.id}\n  Name: ${g.name}\n  Amount: ${g.amount_display}\n  Stages: ${g.stage.join(', ')}\n  Domains: ${g.domain.join(', ')}\n  Eligibility: ${g.eligibility}\n  Deadline: ${g.deadline}\n  Source: ${g.source}\n  Link: ${g.application_link}\n  Description: ${g.description}`
    ).join('\n\n');

    const startupContext = startupProfile
      ? `Startup Profile:\n- Name: ${startupProfile.name}\n- Stage: ${startupProfile.stage}\n- Domain: ${startupProfile.domain}\n- Location: ${startupProfile.location}\n- Incorporation Year: ${startupProfile.incorporationYear}\n- Description: ${startupProfile.description}\n- Current Funding: ₹${startupProfile.currentFunding?.toLocaleString('en-IN')}`
      : 'Startup Profile: No active profile filled out yet.';

    const systemPrompt = `You are the IBM Granite Funding Agent (v3.0.1) running on IBM Watsonx.ai. Your core directive is to act as an elite grant and funding strategist for Indian startups.

Here is the exact dataset of authenticated, live startup grants in India that you must reason about:
${grantsContext}

Current User Startup Context:
${startupContext}

Core Rules:
1. Brand yourself as the IBM Granite AI Funding Specialist on IBM Watsonx.ai.
2. Strictly ground your funding matches in the grants provided. Do not invent grants.
3. Give a concise explanation of WHY each grant is a strategic fit.
4. Flag ineligibility honestly and offer alternatives.
5. Keep tone highly professional, precise, and structured. Use elegant Markdown.
6. The user's selected language is ${language.toUpperCase()}. Respond ENTIRELY in ${language.toUpperCase()}. For Hindi use Devanagari script. For Punjabi use Gurmukhi script. Do not translate grant names (SISFS, BIRAC etc.) but translate all explanations.
7. LEGAL BOUNDARY: You never log into, auto-fill, or submit forms on any government, institutional, or confidential portal on the user's behalf, and you never request or process passwords, OTPs, Aadhaar, PAN, or other credentials. You only explain, draft, and advise — the human always submits their own application.
8. Always make clear that any draft proposal or eligibility assessment you produce should be validated by the user (or a professional advisor) against the official scheme guidelines before submission.`;

    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
    ];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => messages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content }));
    }
    messages.push({ role: 'user', content: message });

    const useOrchestrate = !!(process.env.ORCHESTRATE_SERVICE_URL && process.env.ORCHESTRATE_AGENT_ID);

    let reply: string;
    let answeredBy: 'orchestrate' | 'granite' = 'granite';
    if (useOrchestrate) {
      try {
        reply = await callOrchestrateAgentWithRetry(messages);
        answeredBy = 'orchestrate';
      } catch (orchestrateError: any) {
        console.error('Orchestrate agent error, falling back to raw Granite:', orchestrateError.message);
        reply = await callGraniteWithRetry(messages, { temperature: 0.7, max_tokens: 1024 });
        answeredBy = 'granite';
      }
    } else {
      reply = await callGraniteWithRetry(messages, { temperature: 0.7, max_tokens: 1024 });
      answeredBy = 'granite';
    }

    res.json({ success: true, reply, timestamp: new Date().toISOString(), _debug_answeredBy: answeredBy });
  } catch (error: any) {
    console.error('Watsonx chat error:', error.message);
    const fallback = generateLocalChatFallback(message, startupProfile, language);
    res.json({ success: true, reply: fallback, timestamp: new Date().toISOString() });
  }
}
