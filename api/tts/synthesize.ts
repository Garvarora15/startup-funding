import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { text, language } = req.body;
    if (!text) return res.status(400).json({ success: false, error: 'Text is required.' });

    const apiKey = process.env.WATSON_TTS_API_KEY;
    const baseUrl = process.env.WATSON_TTS_URL;

    // If Watson TTS credentials not available, tell client to use browser fallback
    if (!apiKey || !baseUrl) {
      return res.json({ success: false, fallback: true });
    }

    // Voice selection by language
    let voice = 'en-US_AllisonV3Voice';
    if (language === 'hindi' || language === 'punjabi') voice = 'hi-IN_AditiVoice';
    else if (language === 'spanish') voice = 'es-ES_LauraV3Voice';
    else if (language === 'french') voice = 'fr-FR_ReneeV3Voice';
    else if (language === 'german') voice = 'de-DE_BirgitV3Voice';

    const endpoint = `${baseUrl.replace(/\/$/, '')}/v1/synthesize?voice=${voice}`;
    const authHeader = `Basic ${Buffer.from(`apikey:${apiKey}`).toString('base64')}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'audio/mp3',
        Authorization: authHeader,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.error(`[TTS] Watson TTS error: ${response.status}`);
      return res.json({ success: false, fallback: true });
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');
    res.json({ success: true, audio: base64Audio, format: 'mp3' });
  } catch (error: any) {
    console.error('[TTS] Error:', error.message);
    // Always fallback gracefully — browser Web Speech API will handle it
    res.json({ success: false, fallback: true });
  }
}
