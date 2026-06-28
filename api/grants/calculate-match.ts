import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GRANTS } from '../../src/data/grants.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  try {
    const { profile } = req.body;
    if (!profile) return res.status(400).json({ success: false, error: 'Profile is required.' });

    const stage = (profile.stage || 'idea').toLowerCase();
    const domain = (profile.domain || 'any').toLowerCase();
    const age = new Date().getFullYear() - parseInt(String(profile.incorporationYear || new Date().getFullYear()));
    const currentFunding = profile.currentFunding || 0;

    const scoredGrants = GRANTS.map(grant => {
      let score = 50;
      const reasons: string[] = [];

      const stageMatch = grant.stage.includes('any') || grant.stage.includes(stage);
      if (stageMatch) { score += 20; reasons.push(`Perfect stage fit: Ideal for your '${stage}' stage.`); }
      else { score -= 20; reasons.push(`Stage mismatch: Targets [${grant.stage.join(', ')}], not '${stage}'.`); }

      const domainMatch = grant.domain.includes('any') || grant.domain.some(d => d.toLowerCase() === domain);
      if (domainMatch) { score += 20; reasons.push(`Perfect domain alignment: Targets the '${domain}' sector.`); }
      else if (grant.domain.includes('any')) { score += 10; reasons.push('Broad sector fit: Open to all startup domains.'); }
      else { score -= 15; reasons.push(`Domain mismatch: Targets [${grant.domain.join(', ')}], not '${domain}'.`); }

      if (grant.id === 'sisfs-001') {
        if (age < 2) { score += 10; reasons.push(`Age eligibility satisfied: ${age} years (under 2-year limit).`); }
        else { score -= 30; reasons.push(`Ineligible by age: ${age} years exceeds the 2-year SISFS limit.`); }
        if (currentFunding > 1000000) { score -= 20; reasons.push(`Funding warning: ₹${currentFunding.toLocaleString('en-IN')} exceeds ₹10L previous govt support limit.`); }
      } else if (age <= 5) { score += 5; reasons.push(`Healthy startup age: ${age} years (suitable for early-stage grants).`); }

      return { grantId: grant.id, score: Math.max(0, Math.min(100, score)), reasons, eligible: score >= 50 };
    });

    res.json({ success: true, scores: scoredGrants });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
