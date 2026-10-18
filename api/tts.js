/* ElevenLabs text-to-speech proxy for the patient voice.

   The ElevenLabs key must stay server-side, so the client posts text here and
   receives audio. If ELEVENLABS_API_KEY is not configured the endpoint returns
   501 and the client falls back to the browser's built-in speech synthesis, so
   the interview still works (with a plainer voice) before a key is added.

   Request body: { text: string, voiceId?: string, voice?: 'operator'|'patient-male'|'patient-female' }

   Voices: Booth must never sound like the patient. Each role has its own
   built in ElevenLabs premade voice, overridable by env var:
   - operator (Booth):  ELEVENLABS_OPERATOR_VOICE_ID, default "Clyde" (gruff)
   - patient, male:     ELEVENLABS_PATIENT_MALE_VOICE_ID, default "Adam"
   - patient, female:   ELEVENLABS_PATIENT_FEMALE_VOICE_ID or ELEVENLABS_VOICE_ID, default "Rachel"
   Before this, Booth fell back to the patient voice whenever the operator
   variable was unset, so both sounded the same.
   Response: audio/mpeg on success; JSON error otherwise.
*/

export const OPERATOR_DEFAULT_VOICE_ID = '2EiwWnXFnvU5JabPnv8n'; // "Clyde" preset
export const PATIENT_MALE_DEFAULT_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // "Adam" preset

export function resolveVoice(voice, env = process.env) {
  if (voice === 'operator') return env.ELEVENLABS_OPERATOR_VOICE_ID || OPERATOR_DEFAULT_VOICE_ID;
  if (voice === 'patient-male') return env.ELEVENLABS_PATIENT_MALE_VOICE_ID || PATIENT_MALE_DEFAULT_VOICE_ID;
  if (voice === 'patient-female') return env.ELEVENLABS_PATIENT_FEMALE_VOICE_ID || env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
  return env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
}
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
  // voice: 'operator' selects Booth's voice (sim operator) from server config.
  const operatorVoice = body.voice === 'operator';
  const voiceId = typeof body.voiceId === 'string' && body.voiceId.trim()
    ? body.voiceId.trim()
    : resolveVoice(body.voice);
  const modelId = operatorVoice ? (process.env.ELEVENLABS_OPERATOR_MODEL_ID || MODEL_ID) : MODEL_ID;

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
        model_id: modelId,
        voice_settings: operatorVoice
          ? { stability: 0.35, similarity_boost: 0.8, style: 0.45 }
          : { stability: 0.5, similarity_boost: 0.75 },
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
