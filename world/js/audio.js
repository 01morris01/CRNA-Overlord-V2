// audio.js: every sound in Overlord's world, made in the browser with no audio files. Ambience (wind, water, birds)
// follows where you stand; short sounds answer what you do. Nothing plays until the first tap or key, and the
// choice to mute is remembered.
let ctx = null, master = null, wind = null, water = null, birdTimer = 0, birdsOn = 0;
let muted = false; try { muted = localStorage.getItem('overlord_world_mute') === '1'; } catch (e) { /* private mode */ }
const now = () => ctx.currentTime;
function noiseBuffer(seconds, brown = false) { const b = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate), d = b.getChannelData(0); let last = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; d[i] = brown ? (last = (last + 0.02 * w) / 1.02) * 3.2 : w; } return b; }
function loop(buffer, type, freq, q) { const s = ctx.createBufferSource(); s.buffer = buffer; s.loop = true; const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; const g = ctx.createGain(); g.gain.value = 0; s.connect(f).connect(g).connect(master); s.start(); return { g, f }; }
export function unlock() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  ctx = new AC(); master = ctx.createGain(); master.gain.value = muted ? 0 : 0.9; master.connect(ctx.destination);
  wind = loop(noiseBuffer(4, true), 'lowpass', 420, 0.4); water = loop(noiseBuffer(3), 'bandpass', 1500, 0.7);
}
for (const ev of ['pointerdown', 'keydown', 'touchstart']) addEventListener(ev, unlock, { passive: true });
export const isMuted = () => muted;
export function setMuted(m) { muted = m; try { localStorage.setItem('overlord_world_mute', m ? '1' : '0'); } catch (e) { /* ignore */ } if (master) master.gain.setTargetAtTime(m ? 0 : 0.9, now(), 0.05); }
function tone(freq, t0, dur, { type = 'sine', gain = 0.12, to = null, attack = 0.005 } = {}) {
  const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(freq, t0); if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(gain, t0 + attack); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); o.connect(g).connect(master); o.start(t0); o.stop(t0 + dur + 0.02);
}
function burst(t0, dur, freq, gain, type = 'bandpass') { const s = ctx.createBufferSource(); s.buffer = burst.buf ||= noiseBuffer(0.4); const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = 1.2; const g = ctx.createGain(); g.gain.setValueAtTime(gain, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); s.connect(f).connect(g).connect(master); s.start(t0, Math.random() * 0.2, dur + 0.02); }
const SFX = {
  tap: (t) => tone(660, t, 0.06, { gain: 0.05, type: 'triangle' }),
  correct: (t) => { tone(659, t, 0.16, { gain: 0.1 }); tone(988, t + 0.11, 0.28, { gain: 0.1 }); },
  wrong: (t) => { tone(233, t, 0.22, { gain: 0.09, type: 'triangle', to: 185 }); },
  pickup: (t) => { tone(784, t, 0.1, { gain: 0.09 }); tone(1175, t + 0.07, 0.12, { gain: 0.09 }); tone(1568, t + 0.14, 0.3, { gain: 0.08 }); },
  reward: (t) => { [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.1, 0.5, { gain: 0.09 })); },
  place: (t) => { burst(t, 0.09, 420, 0.3, 'lowpass'); tone(150, t, 0.08, { gain: 0.12, to: 90 }); },
  take: (t) => { burst(t, 0.07, 900, 0.18); tone(220, t, 0.07, { gain: 0.07, to: 330 }); },
  door: (t) => { burst(t, 0.5, 700, 0.12); tone(196, t, 0.5, { gain: 0.06, to: 392 }); },
  step: (t) => burst(t, 0.06, 380 + Math.random() * 160, 0.11, 'lowpass'),
  stepWood: (t) => { burst(t, 0.05, 900, 0.1); tone(170 + Math.random() * 30, t, 0.05, { gain: 0.07, type: 'triangle' }); },
  jump: (t) => tone(260, t, 0.14, { gain: 0.06, to: 520, type: 'triangle' }),
  talk: (t) => { for (let i = 0; i < 3; i++) tone(300 + Math.random() * 180, t + i * 0.07, 0.06, { gain: 0.05, type: 'square' }); },
  page: (t) => burst(t, 0.12, 2400, 0.08),
};
export function sfx(name) { if (!ctx || muted || !SFX[name]) return; SFX[name](now()); }
/** Call every frame from the island. wind 0..1, water 0..1 (how near moving water is), birds 0..1. */
export function ambience({ wind: w = 0, water: wa = 0, birds = 0 }, dt = 0.016) {
  if (!ctx) return; const t = now();
  wind.g.gain.setTargetAtTime(0.05 + 0.1 * w, t, 0.4); wind.f.frequency.setTargetAtTime(320 + 260 * w + 60 * Math.sin(t * 0.3), t, 0.6);
  water.g.gain.setTargetAtTime(0.11 * wa, t, 0.25); birdsOn = birds; birdTimer -= dt;
  if (birdsOn > 0.05 && birdTimer <= 0 && !muted) { birdTimer = 1.6 + Math.random() * 5 / birdsOn; const base = 2200 + Math.random() * 1800, n = 2 + Math.floor(Math.random() * 3); for (let i = 0; i < n; i++) tone(base * (1 + Math.random() * 0.15), t + i * 0.11, 0.09, { gain: 0.035 * birdsOn, to: base * (0.8 + Math.random() * 0.5) }); }
}
export function quiet() { if (!ctx) return; const t = now(); wind.g.gain.setTargetAtTime(0, t, 0.2); water.g.gain.setTargetAtTime(0, t, 0.2); birdsOn = 0; }
