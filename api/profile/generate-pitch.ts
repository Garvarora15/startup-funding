import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGraniteWithRetry } from '../lib/watsonx.js';

function getSmartFallbackPitch(name: string, domain: string, stage: string, format: string, language: string, frequency: string): string {
  const domainMap: Record<string, { problem: string; tech: string; impact: string }> = {
    ai: { problem: 'critical bottlenecks in manual data structuring and decision intelligence', tech: 'proprietary advanced generative AI and ML engines', impact: 'doubles engineering productivity and lowers operational overheads by 45%' },
    fintech: { problem: 'slow, expensive cross-border payroll and settlement processing', tech: 'decentralized instant settlement ledgers', impact: 'enables friction-free, instantaneous global financial operations' },
    healthtech: { problem: 'limited access to specialized diagnostics in rural and semi-urban areas', tech: 'AI-enhanced portable diagnostic devices', impact: 'enables frontline workers to conduct immediate, accurate screenings' },
    agritech: { problem: 'unpredictable crop yields and inefficient water usage in agriculture', tech: 'IoT soil sensors and predictive smart irrigation systems', impact: 'reduces water waste by 35% and increases harvest yields by 28%' },
    cleantech: { problem: 'industrial carbon emissions and fossil fuel dependency', tech: 'novel solid-state catalytic carbon absorption arrays', impact: 'captures up to 92% of emitted industrial atmospheric carbon' },
    edtech: { problem: 'lack of personalized learning pathways for diverse student populations', tech: 'adaptive AI curriculum engines with real-time assessment', impact: 'improves learning outcomes by 40% across rural and urban cohorts' },
    any: { problem: 'operational efficiency bottlenecks and legacy system friction', tech: 'proprietary intelligent optimization systems', impact: 'automates complex workflows to drive sustainable, scalable growth' },
  };
  const d = domainMap[(domain || 'any').toLowerCase()] || domainMap.any;
  const fmt = (format || 'elevator').toLowerCase();

  if (fmt === 'twitter') return `Introducing ${name}! 🚀 Solving ${d.problem} using ${d.tech} to ensure ${d.impact}. Join our mission. #Startup #${(domain || 'Tech').charAt(0).toUpperCase() + (domain || 'Tech').slice(1)} #Innovation`;
  if (fmt === 'investor-hook') return `**INVESTOR ALERT:** ${name} is targeting the trillion-dollar problem of ${d.problem}.\n\nBy deploying ${d.tech}, our high-growth model ensures that ${d.impact} — creating a massive market entry point with strong IP defensibility, government grant backing, and a clear path to Series A.\n\n**The opportunity is now. We're raising to scale.**`;
  if (fmt === 'one-pager') return `### ${name} — Executive One-Pager\n\n**The Problem**\nIndustry is crippled by ${d.problem}, costing enterprises billions annually in inefficiency and lost potential.\n\n**Our Technology**\nWe deploy ${d.tech} that directly tackles this systemic challenge with unprecedented precision and scalability.\n\n**Strategic Impact**\n${d.impact} — positioning ${name} as a category-defining leader in the ${domain || 'technology'} sector with strong alignment to India's self-reliance mission.`;
  return `${name} is solving the critical problem of ${d.problem} through the strategic deployment of ${d.tech}, ensuring that ${d.impact} — driving India's ${domain || 'technology'} ecosystem forward.`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  try {
    const { name, domain, stage, format = 'elevator', language = 'english', frequency = 'on-demand' } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Startup Name is required.' });

    const systemPrompt = `You are the IBM Granite Pitch Architect on IBM Watsonx.ai. Generate professional startup pitches tailored for grant applications. Be specific, impactful, and free of marketing buzzwords. Write the content directly without any prefaces or concluding remarks. Respond entirely in ${language.toUpperCase()}. For Hindi use Devanagari. For Punjabi use Gurmukhi.`;

    const userPrompt = `Generate a highly-compelling pitch for:
Startup Name: ${name}
Primary Sector: ${domain}
Venture Stage: ${stage}
Desired Output Format: ${format}
Desired Language: ${language}
Update Frequency: ${frequency}

Format Guidelines:
- elevator: A concise, impactful 2-sentence elevator pitch
- one-pager: 3 bullet points covering Problem, Technology, and Impact
- twitter: Under 260 characters with 2 relevant hashtags
- investor-hook: High-intensity problem-solution hook with market size and competitive moat`;

    const pitch = await callGraniteWithRetry(
      [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      { temperature: 0.85, max_tokens: 512 }
    );
    res.json({ success: true, pitch: pitch.trim().replace(/^"|"$/g, '') });
  } catch (error: any) {
    console.error('Pitch generation error:', error.message);
    const { name, domain, stage, format = 'elevator', language = 'english', frequency = 'on-demand' } = req.body;
    res.json({ success: true, pitch: getSmartFallbackPitch(name, domain, stage, format, language, frequency) });
  }
}
