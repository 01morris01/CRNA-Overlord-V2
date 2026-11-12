// voice.js: the lessons' spoken lines.
//
// Every line a lesson speaks is recorded ahead of time by tools/render_narration.py and listed, with its length, in
// assets/audio/narration/manifest.json. Nothing is sent anywhere while the app runs. Because each recording's length is
// known, the lessons take their timing from the recordings: a film cue lasts as long as its line plus a breath, so a line is
// never cut off and never leaves dead air. If the recordings are missing the authored timings stand and the browser's own
// voice is used; the captions carry the same words either way.
import { FILM } from '../data/plexus.js';
import { NARRATION } from '../data/regional.js';
import { isMuted } from './audio.js';

const BASE = new URL('../../assets/audio/narration/', import.meta.url), GAP = 0.75, clips = new Map(), players = new Map();
let info = null, loading = null, playing = null;
export function loadVoice() {
  return loading ||= (async () => {
    try { const r = await fetch(new URL('manifest.json', BASE)); if (r.ok) { info = await r.json(); for (const c of info.clips || []) clips.set(c.text, c); } } catch (e) { /* no recordings: the browser's voice and the captions carry the lesson */ }
    info ||= { clips: [] };
    if (FILM.cues.every((c) => clips.has(c.say))) { let t = 0; for (const c of FILM.cues) { c.t = +t.toFixed(2); t += clips.get(c.say).seconds + GAP; } FILM.seconds = +t.toFixed(2); }
    for (const n of NARRATION) { const c = clips.get(n.say); if (c) n.ms = Math.round((c.seconds + GAP) * 1000); }
    return info;
  })();
}
export const recorded = (text) => clips.has(text);
export const seconds = (text) => clips.get(text)?.seconds ?? null;
export const voiceName = () => (info && info.clips.length ? info.voice : null);
const player = (text) => { const c = clips.get(text); if (!c) return null; let a = players.get(text); if (!a) { a = new Audio(new URL(c.file, BASE).href); a.preload = 'auto'; a.ontimeupdate = () => { a.muted = isMuted(); }; players.set(text, a); } return a; };
/** Fetch a line's recording before it is needed, so it starts on the beat. */
export function warm(text) { player(text); }
export function stop() { if (playing) { playing.pause(); playing = null; } try { speechSynthesis.cancel(); } catch (e) { /* none */ } }
/** Speak a line, from `at` seconds into it. Returns true when a recording was used. */
export function say(text, { at = 0 } = {}) {
  stop(); const a = player(text);
  if (a) { const c = clips.get(text); if (at >= c.seconds - 0.08) return true; a.muted = isMuted(); const start = () => { try { a.currentTime = Math.max(0, at); } catch (e) { /* not seekable yet */ } a.play().catch(() => {}); };
    if (a.readyState >= 1) start(); else { a.addEventListener('loadedmetadata', () => { if (playing === a) start(); }, { once: true }); a.load(); } playing = a; return true; }
  try { if (!('speechSynthesis' in window) || isMuted()) return false; const u = new SpeechSynthesisUtterance(text); u.rate = 1; speechSynthesis.speak(u); } catch (e) { /* no voice: the captions carry it */ }
  return false;
}
export const speaking = () => !!playing && !playing.paused && !playing.ended;
