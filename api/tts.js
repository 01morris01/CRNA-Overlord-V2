/* ElevenLabs text-to-speech proxy for the patient voice.

   The ElevenLabs key must stay server-side, so the client posts text here and
   receives audio. If ELEVENLABS_API_KEY is not configured the endpoint returns
   501 and the client falls back to the browser's built-in speech synthesis, so
   the interview still works (with a plainer voice) before a key is added.

   Request body: { text: string, voiceId?: string }
   Response: audio/mpeg on success; JSON error otherwise.
*/

const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // "Rachel" preset
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_turbo_v2_5';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(501).json({ error: 'tts_unavailable', reason: 'ELEVENLABS_API_KEY not configured' });
  }

  const body = req.body ?? {};
  const text = typeof body.text === 'string' ? body.text.slice(0, 1200) : '';
  if (!text.trim()) return res.status(400).json({ error: 'Missing text' });
  const voiceId = typeof body.voiceId === 'string' && body.voiceId.trim() ? body.voiceId.trim() : DEFAULT_VOICE_ID;

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'content-type': 'application/json',
        accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      return res.status(502).json({ error: 'tts_error', details: response.status, message: detail.slice(0, 300) });
    }
    const audio = Buffer.from(await response.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(audio);
  } catch (error) {
    return res.status(502).json({ error: 'tts_network', details: String(error?.message ?? error) });
  }
}
