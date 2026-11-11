// audio.js: every sound in Overlord's world, made in the browser with no audio files. Each room has its own air and its own
// echo; footsteps change with the floor; water is heard near the pool and the monitor near the operating room. Nothing plays
// until the first tap or key, the choice to mute is remembered, and sounds that explain a place are also captioned.
let ctx = null, master = null, wind = null, water = null, birdTimer = 0, birdsOn = 0, send = null, conv = null, vent = null, hum = null, beepT = 0, here = null, caption = null, heard = {};
let muted = false; try { muted = localStorage.getItem('overlord_world_mute') === '1'; } catch (e) { /* private mode */ }
const now = () => ctx.currentTime;
function noiseBuffer(seconds, brown = false) { const b = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate), d = b.getChannelData(0); let last = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; d[i] = brown ? (last = (last + 0.02 * w) / 1.02) * 3.2 : w; } return b; }
function loop(buffer, type, freq, q) { const s = ctx.createBufferSource(); s.buffer = buffer; s.loop = true; const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; const g = ctx.createGain(); g.gain.value = 0; s.connect(f).connect(g).connect(master); s.start(); return { g, f }; }
export function unlock() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  ctx = new AC(); master = ctx.createGain(); master.gain.value = muted ? 0 : 0.9; master.connect(ctx.destination);
  wind = loop(noiseBuffer(4, true), 'lowpass', 420, 0.4); water = loop(noiseBuffer(3), 'bandpass', 1500, 0.7); vent = loop(noiseBuffer(3), 'bandpass', 520, 0.5);
  send = ctx.createGain(); send.gain.value = 0.2; conv = ctx.createConvolver(); conv.buffer = impulse(1.2); send.connect(conv).connect(master);
  hum = ctx.createGain(); hum.gain.value = 0; hum.connect(master); for (const f of [55, 110.4]) { const o = ctx.createOscillator(); o.frequency.value = f; const g = ctx.createGain(); g.gain.value = f < 60 ? 0.5 : 0.18; o.connect(g).connect(hum); o.start(); }
  if (here) room(here.name, here.floor);
}
function impulse(seconds) { const key = seconds.toFixed(2); impulse.c ||= {}; if (impulse.c[key]) return impulse.c[key]; const n = Math.floor(ctx.sampleRate * seconds), b = ctx.createBuffer(2, n, ctx.sampleRate); for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.6); } return impulse.c[key] = b; }
for (const ev of ['pointerdown', 'keydown', 'touchstart']) addEventListener(ev, unlock, { passive: true });
export const isMuted = () => muted;
export function setMuted(m) { muted = m; try { localStorage.setItem('overlord_world_mute', m ? '1' : '0'); } catch (e) { /* ignore */ } if (master) master.gain.setTargetAtTime(m ? 0 : 0.9, now(), 0.05); }
function tone(freq, t0, dur, { type = 'sine', gain = 0.12, to = null, attack = 0.005 } = {}) {
  const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(freq, t0); if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(gain, t0 + attack); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); o.connect(g); g.connect(master); send && g.connect(send); o.start(t0); o.stop(t0 + dur + 0.02);
}
function burst(t0, dur, freq, gain, type = 'bandpass') { const s = ctx.createBufferSource(); s.buffer = burst.buf ||= noiseBuffer(0.4); const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = 1.2; const g = ctx.createGain(); g.gain.setValueAtTime(gain, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); s.connect(f).connect(g); g.connect(master); send && g.connect(send); s.start(t0, Math.random() * 0.2, dur + 0.02); }
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
export function quiet() { if (!ctx) return; const t = now(); for (const n of [wind.g, water.g, vent.g, hum]) n.gain.setTargetAtTime(0, t, 0.2); birdsOn = 0; }

// ---------- the institute: rooms, floors, and the sounds that belong to places ----------
const AIR = {   // echo length (s), how much of each sound goes to the echo, and the room's own air
  forecourt: { len: 0.5, wet: 0.04, wind: 0.5, vent: 0, hum: 0, birds: 0.5, says: 'Open air. Wind, and water moving in the pool.' },
  arrival: { len: 0.9, wet: 0.2, wind: 0.25, vent: 0, hum: 0, birds: 0.15, says: 'A low entrance. Sound closes in.' },
  court: { len: 2.6, wet: 0.42, wind: 0.1, vent: 0.02, hum: 0, birds: 0, says: 'A tall stone court. Footsteps carry.' },
  gallery: { len: 1.5, wet: 0.3, wind: 0, vent: 0.015, hum: 0.05, birds: 0, says: 'The gallery. Quiet, with a low hum from the exhibit lights.' },
  regional: { len: 0.45, wet: 0.1, wind: 0, vent: 0.07, hum: 0, birds: 0, says: 'A practice bay. Ventilation, soft floor.' },
  or: { len: 0.5, wet: 0.1, wind: 0, vent: 0.1, hum: 0, birds: 0, says: 'The operating room. Ventilation and a monitor tone.' },
  studio: { len: 0.35, wet: 0.06, wind: 0.03, vent: 0, hum: 0, birds: 0.08, says: 'Your studio. Timber floor, a small quiet room.' },
};
export function onCaption(fn) { caption = fn; }
const say = (key, text) => { if (heard[key] && now() - heard[key] < 40) return; if (ctx) heard[key] = now(); caption && caption(text); };
/** Called when the walker enters a room. */
export function room(name, floor) { here = { name, floor }; const a = AIR[name] || AIR.court; if (!ctx) return; const t = now(); conv.buffer = impulse(a.len); send.gain.setTargetAtTime(a.wet, t, 0.25); say('room:' + name, a.says); }
const STEP = {
  stone: (t) => { burst(t, 0.05, 1500 + Math.random() * 500, 0.11); tone(120 + Math.random() * 20, t, 0.05, { gain: 0.05, type: 'triangle' }); },
  pave: (t) => { burst(t, 0.06, 1100 + Math.random() * 400, 0.12); burst(t + 0.012, 0.05, 3200, 0.03); },
  concrete: (t) => { burst(t, 0.05, 900 + Math.random() * 300, 0.1); tone(100, t, 0.05, { gain: 0.045, type: 'triangle' }); },
  vinyl: (t) => burst(t, 0.07, 420 + Math.random() * 120, 0.09, 'lowpass'),
  timber: (t) => { burst(t, 0.05, 800, 0.08); tone(160 + Math.random() * 30, t, 0.06, { gain: 0.07, type: 'triangle' }); },
};
export function footstep(floor) { if (!ctx || muted) return; (STEP[floor] || STEP.stone)(now()); }
/** Every frame from the level: where the walker is. Air follows the room; water and the monitor follow distance. */
export function listen({ x, z, room: r, pool, dt = 0.016 }) {
  if (!ctx) return; const t = now(), a = AIR[r] || AIR.court;
  wind.g.gain.setTargetAtTime(0.03 + 0.1 * a.wind, t, 0.5); wind.f.frequency.setTargetAtTime(300 + 240 * a.wind + 50 * Math.sin(t * 0.3), t, 0.6); vent.g.gain.setTargetAtTime(a.vent, t, 0.4); hum.gain.setTargetAtTime(a.hum, t, 0.5);
  const dx = Math.max(pool[0] - x, 0, x - pool[2]), dz = Math.max(pool[1] - z, 0, z - pool[3]), d = Math.hypot(dx, dz), near = r === 'forecourt' || r === 'arrival' ? Math.max(0, 1 - d / 9) : 0; water.g.gain.setTargetAtTime(0.085 * near * near, t, 0.3); if (near > 0.55) say('water', 'Water moving in the pool.');
  const od = Math.hypot(x - 9.9, z + 17.2), beep = r === 'or' ? 1 : r === 'court' ? Math.max(0, 1 - od / 9) * 0.25 : 0; beepT -= dt;
  if (beep > 0.02 && beepT <= 0 && !muted) { beepT = 60 / 72; tone(880, t, 0.09, { gain: 0.045 * beep, type: 'sine' }); if (r === 'or') say('monitor', 'A monitor tone, steady, about 72 a minute. It is a recording of nothing: no patient is connected here.'); }
  birdsOn = a.birds; birdTimer -= dt; if (birdsOn > 0.05 && birdTimer <= 0 && !muted) { birdTimer = 2.5 + Math.random() * 6 / birdsOn; const base = 2400 + Math.random() * 1600, n = 2 + Math.floor(Math.random() * 3); for (let i = 0; i < n; i++) tone(base * (1 + Math.random() * 0.15), t + i * 0.11, 0.09, { gain: 0.02 * birdsOn, to: base * (0.8 + Math.random() * 0.5) }); }
}
