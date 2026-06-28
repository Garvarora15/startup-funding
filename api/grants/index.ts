import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GRANTS } from '../../src/data/grants.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });
  try {
    const { q, stage, domain, minAmount } = req.query;
    let filtered = [...GRANTS];
    if (q && typeof q === 'string') {
      const s = q.toLowerCase().trim();
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(s) || g.description.toLowerCase().includes(s) ||
        g.eligibility.toLowerCase().includes(s) || g.source.toLowerCase().includes(s) ||
        g.domain.some(d => d.toLowerCase().includes(s))
      );
    }
    if (stage && typeof stage === 'string' && stage !== 'any') {
      const t = stage.toLowerCase().trim();
      filtered = filtered.filter(g => g.stage.includes('any') || g.stage.some(s => s.toLowerCase() === t));
    }
    if (domain && typeof domain === 'string' && domain !== 'any') {
      const t = domain.toLowerCase().trim();
      filtered = filtered.filter(g => g.domain.includes('any') || g.domain.some(d => d.toLowerCase() === t));
    }
    if (minAmount) {
      const amt = parseInt(minAmount as string, 10);
      if (!isNaN(amt)) filtered = filtered.filter(g => g.amount_inr === null || g.amount_inr >= amt);
    }
    res.json({ success: true, grants: filtered, total: filtered.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
