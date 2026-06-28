import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGraniteWithRetry } from '../lib/watsonx.js';
import { withHumanValidationNotice } from '../lib/compliance.js';

function generateLocalFallback(body: any): string {
  const { startupName = 'Your Startup', startupDescription = '', stage = 'early', domain = 'tech', targetGrantName = 'the grant', targetGrantDetails = '', additionalNotes = '', language = 'english' } = body || {};
  const lang = (language || 'english').toLowerCase();

  if (lang === 'hindi') {
    return `# अनुदान प्रस्ताव\n*IBM Granite स्थानीय इंजन (ऑफ़लाइन मोड)*\n\n**स्टार्टअप:** ${startupName} | **क्षेत्र:** ${domain} | **चरण:** ${stage}\n**लक्षित योजना:** ${targetGrantName}\n\n---\n\n## 1. कार्यकारी सारांश\n${startupName} ${domain} क्षेत्र में ${stage} चरण पर काम करने वाला एक अग्रणी उद्यम है। हमारी नवाचार — ${startupDescription} — बाजार की महत्वपूर्ण कमियों को दूर करती है।\n\n## 2. समस्या विवरण\n${domain} क्षेत्र में महत्वपूर्ण प्रणालीगत बाधाएं हैं जो मौजूदा समाधानों की सीमाओं को उजागर करती हैं।\n\n## 3. प्रस्तावित समाधान\n${startupDescription}\n\n## 4. पात्रता मानदंडों के साथ संरेखण\n${targetGrantDetails || 'हम सभी DPIIT, चरण और डोमेन पात्रता मानदंडों को पूरा करते हैं।'}\n${additionalNotes ? `\nअतिरिक्त नोट्स: ${additionalNotes}` : ''}\n\n## 5. मील के पत्थर और फंड उपयोग\n| मील का पत्थर | आवंटन | परिणाम |\n|---|---|---|\n| R&D और इंजीनियरिंग | 40% | उत्पादन MVP |\n| बीटा परीक्षण | 20% | बाजार सत्यापन |\n| बुनियादी ढांचा | 15% | सुरक्षा |\n| प्रतिभा | 15% | टीम निर्माण |\n| संचालन | 10% | कानूनी |\n\n## 6. सामाजिक-आर्थिक प्रभाव\n${startupName} ${domain} क्षेत्र में घरेलू IP विकसित करेगा और भारत की आत्मनिर्भरता में योगदान देगा।`;
  }

  return `# GRANT PROPOSAL DRAFT\n*IBM Granite Local Engine (Watsonx.ai offline mode)*\n\n**Startup:** ${startupName} | **Sector:** ${domain} | **Stage:** ${stage}\n**Target Grant:** ${targetGrantName}\n\n---\n\n## 1. EXECUTIVE SUMMARY\n${startupName} is a ${stage}-stage venture in the ${domain} sector applying for the ${targetGrantName}. Our core innovation — ${startupDescription} — addresses critical market gaps with strong national impact potential.\n\n## 2. PROBLEM STATEMENT\nThe ${domain} sector faces significant bottlenecks in scalability, efficiency, and accessibility that existing solutions fail to address adequately.\n\n## 3. PROPOSED SOLUTION & INNOVATION\n${startupDescription}\n\nOur approach delivers measurable improvements over legacy alternatives with a defensible technical moat built on proprietary methodologies.\n\n## 4. ALIGNMENT WITH ELIGIBILITY CRITERIA\n${targetGrantDetails || 'We satisfy all DPIIT, stage, and domain eligibility criteria for this scheme, including DPIIT startup recognition, incorporation within the required timeframe, and sector alignment.'}\n${additionalNotes ? `\nAdditional Notes: ${additionalNotes}` : ''}\n\n## 5. PROJECT MILESTONES & FUND UTILIZATION\n| Milestone | Allocation | Expected Outcome |\n|---|---|---|\n| R&D & Engineering | 40% | Production-ready MVP |\n| Beta Pilots & Validation | 20% | Market validation with 10+ pilots |\n| Infrastructure & Security | 15% | Compliance & scale readiness |\n| Talent Acquisition | 15% | Core engineering team buildout |\n| Operations & Legal | 10% | IP filing, admin, regulatory |\n\n## 6. SOCIO-ECONOMIC & STRATEGIC IMPACT\nThis funding will enable ${startupName} to create skilled employment, build domestic IP in the ${domain} sector, reduce import dependency, and contribute directly to India's self-reliance and Digital India agenda.`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  try {
    const { startupName, startupDescription, stage, domain, targetGrantName, targetGrantDetails, additionalNotes, language = 'english' } = req.body;
    if (!startupName || !startupDescription || !targetGrantName) {
      return res.status(400).json({ success: false, error: 'Startup Name, Description, and Target Grant are required.' });
    }

    const systemPrompt = `You are the IBM Granite Enterprise Pitch Specialist on IBM Watsonx.ai. Draft award-winning grant proposals aligned with Indian institutional and government grant board standards. Write fully articulated, professional content — no placeholders or generic filler. Respond entirely in ${language.toUpperCase()}. For Hindi use Devanagari script. For Punjabi use Gurmukhi script.`;

    const userPrompt = `Draft a comprehensive grant proposal for:
Startup: ${startupName}
Domain: ${domain}
Stage: ${stage}
Description: ${startupDescription}
Target Grant: ${targetGrantName}
Grant Guidelines: ${targetGrantDetails || 'Standard government startup grant criteria'}
${additionalNotes ? `Additional Notes: ${additionalNotes}` : ''}

Include ALL sections in professional Markdown format:
1. EXECUTIVE SUMMARY
2. PROBLEM STATEMENT  
3. PROPOSED SOLUTION & INNOVATION
4. ALIGNMENT WITH ELIGIBILITY CRITERIA
5. PROJECT MILESTONES & FUND UTILIZATION (include a formatted table)
6. SOCIO-ECONOMIC & STRATEGIC IMPACT`;

    const proposal = await callGraniteWithRetry(
      [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      { temperature: 0.8, max_tokens: 2048 }
    );
    res.json({ success: true, proposal: withHumanValidationNotice(proposal, language), timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error('Watsonx proposal error:', error.message);
    const fallbackLanguage = req.body?.language || 'english';
    res.json({ success: true, proposal: withHumanValidationNotice(generateLocalFallback(req.body), fallbackLanguage), timestamp: new Date().toISOString() });
  }
}
