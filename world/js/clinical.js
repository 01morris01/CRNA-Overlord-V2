// clinical.js: the equipment of the operating room and the regional bay, and what its screens show.
//
// The models are professionally made, openly licensed pieces (credited one by one in assets/LICENSES.md), prepared offline by
// tools/clinical_set.py; a few fittings no open model covered are built by tools/clinical_kit.py. Nothing here is a working
// device. Every display says what it is on its own face: the patient monitor and ventilator run a labelled demonstration loop,
// the way real monitors do in demo mode, and the ultrasound shows what a probe held in air shows. No patient is simulated in
// these rooms, and nothing is scored from them.
import * as THREE from 'three';
import { TOKENS, wordmarkSVG, svgImage } from './brand.js';
import { pulse } from './audio.js';

const FONT = '"Inter Tight", system-ui, sans-serif', MONO = 'ui-monospace, "SF Mono", Menlo, monospace';
const HR = 72, RR = 12, BEAT = 60 / HR, BREATH = 60 / RR, EXP = BREATH * 2 / 3;      // one breath: expiration first (two thirds), then inspiration (I:E 1:2)
const gauss = (x, m, s) => Math.exp(-((x - m) * (x - m)) / (2 * s * s));
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
// One lead II complex: P wave, a narrow QRS, an upright T. Drawn for its look on a demonstration display.
const ecg = (t) => { const p = ((t % BEAT) + BEAT) % BEAT / BEAT; return 0.11 * gauss(p, 0.2, 0.026) - 0.1 * gauss(p, 0.335, 0.009) + 1.0 * gauss(p, 0.355, 0.011) - 0.2 * gauss(p, 0.378, 0.01) + 0.26 * gauss(p, 0.6, 0.05); };
// A pulse wave: quick upstroke, slower fall, a dicrotic notch. It trails the QRS, as a finger probe does.
const pleth = (t) => { const p = (((t - 0.24) % BEAT) + BEAT) % BEAT / BEAT; return 0.95 * gauss(p, 0.16, 0.075) + 0.42 * gauss(p, 0.43, 0.11) + 0.05; };
// A capnogram: baseline, a steep rise, a plateau that climbs a little to its end-tidal value, a steep fall on inspiration.
const capno = (t) => { const c = ((t % BREATH) + BREATH) % BREATH; if (c < 0.3) return 0; if (c < EXP) return smooth(0.3, 0.75, c) * (0.92 + 0.08 * (c - 0.75) / (EXP - 0.75)); return 1 - smooth(EXP, EXP + 0.28, c); };
// Volume control: pressure ramps to a peak, holds a plateau during the pause, then falls back to PEEP; flow is square in, decaying out.
const INSP = BREATH - EXP, PAUSE = 0.3;
const paw = (t) => { const c = ((t % BREATH) + BREATH) % BREATH, peep = 5, peak = 19, plat = 15; if (c < EXP) return peep + (plat - peep) * Math.exp(-c / 0.22); const i = c - EXP; return i < INSP - PAUSE ? peep + (peak - peep) * (0.25 + 0.75 * i / (INSP - PAUSE)) : plat + (peak - plat) * Math.exp(-(i - (INSP - PAUSE)) / 0.05); };
const flow = (t) => { const c = ((t % BREATH) + BREATH) % BREATH; if (c < EXP) return -0.85 * Math.exp(-c / 0.42); const i = c - EXP; return i < INSP - PAUSE ? 0.62 : 0; };

/** A canvas to draw a display on. Model files keep their pictures top row first, so a canvas meant for a model's screen is not flipped. */
function canvasTex(w, h, onModel = true) { const c = document.createElement('canvas'); c.width = w; c.height = h; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.flipY = !onModel; return { c, g: c.getContext('2d'), t, w, h }; }
/** A sweeping trace: the newest sample is at the pen, a short gap runs ahead of it, and what lies beyond is the previous pass. */
function trace(g, fn, t, x0, y0, w, h, { seconds, color, lo = 0, hi = 1, width = 2.2, fill = false }) {
  const pps = w / seconds, pen = (t * pps) % w, gap = 16; g.save(); g.beginPath(); g.rect(x0, y0 - 2, w, h + 4); g.clip(); g.lineWidth = width; g.lineJoin = 'round'; g.strokeStyle = color; g.shadowColor = color; g.shadowBlur = 6;
  const y = (v) => y0 + h - (Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo) * h;
  for (const [a, b] of [[0, pen], [pen + gap, w]]) { if (b - a < 2) continue; g.beginPath(); for (let x = a; x <= b; x += 1.5) { const ts = x <= pen ? t - (pen - x) / pps : t - (pen + w - x) / pps, yy = y(fn(ts)); x === a ? g.moveTo(x0 + x, yy) : g.lineTo(x0 + x, yy); } g.stroke();
    if (fill) { g.lineTo(x0 + b, y0 + h); g.lineTo(x0 + a, y0 + h); g.closePath(); g.globalAlpha = 0.16; g.fillStyle = color; g.shadowBlur = 0; g.fill(); g.globalAlpha = 1; } }
  g.restore();
}
const label = (g, text, x, y, size, color, { font = FONT, weight = 500, align = 'left', spacing = 0 } = {}) => { g.font = `${weight} ${size}px ${font}`; g.fillStyle = color; g.textAlign = align; if ('letterSpacing' in g) g.letterSpacing = spacing + 'px'; g.fillText(text, x, y); g.textAlign = 'left'; if ('letterSpacing' in g) g.letterSpacing = '0px'; };
const demoTag = (g, x, y) => { g.fillStyle = '#f0b429'; g.beginPath(); g.roundRect(x, y, 74, 24, 4); g.fill(); label(g, 'DEMO', x + 37, y + 18, 15, '#14100a', { weight: 700, align: 'center', spacing: 2 }); };
const clock = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

// ---- what each screen draws
function drawMonitor(S, t) {
  const { g, w, h } = S; g.fillStyle = '#04070a'; g.fillRect(0, 0, w, h); g.fillStyle = '#0c1318'; g.fillRect(0, 0, w, 38); demoTag(g, 10, 7); label(g, 'ADULT', 98, 26, 15, '#8fa3ad', { spacing: 2 }); label(g, clock(), w - 12, 26, 16, '#c9d5da', { font: MONO, align: 'right' });
  const rows = [['II', '#3ee06a', ecg, { seconds: 5, lo: -0.35, hi: 1.15 }, String(HR), 'HR  /min'], ['Pleth', '#4cc9ff', pleth, { seconds: 5, lo: -0.1, hi: 1.15 }, '98', 'SpO₂  %'], ['CO₂', '#f2d24b', capno, { seconds: 15, lo: -0.08, hi: 1.25, fill: true }, '36', 'etCO₂  mmHg']];
  const top = 46, rh = (h - top - 86) / 3, tw = w - 176;
  rows.forEach(([name, color, fn, opt, value, unit], i) => { const y = top + i * rh; g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(8, y + rh - 1, w - 16, 1); label(g, name, 12, y + 20, 14, color, { weight: 600 }); trace(g, fn, t, 12, y + 26, tw, rh - 40, { ...opt, color });
    label(g, value, w - 14, y + rh - 26, 62, color, { font: MONO, weight: 600, align: 'right' }); label(g, unit, w - 14, y + 22, 13, color, { align: 'right' }); });
  const y = h - 80; label(g, 'NIBP', 12, y + 22, 14, '#e8edf0', { weight: 600 }); label(g, '118/72', 70, y + 40, 38, '#e8edf0', { font: MONO, weight: 600 }); label(g, '(87)  mmHg', 226, y + 40, 16, '#aeb9bf'); label(g, 'RR', w - 150, y + 22, 14, '#f2d24b', { weight: 600 }); label(g, String(RR), w - 14, y + 40, 38, '#f2d24b', { font: MONO, weight: 600, align: 'right' });
  g.fillStyle = '#1a1407'; g.fillRect(0, h - 30, w, 30); label(g, 'DEMONSTRATION LOOP  ·  NO PATIENT CONNECTED', w / 2, h - 10, 13, '#f0b429', { weight: 600, align: 'center', spacing: 1.5 });
}
function drawVent(S, t) {
  const { g, w, h } = S; g.fillStyle = '#05080b'; g.fillRect(0, 0, w, h); g.fillStyle = '#0c1318'; g.fillRect(0, 0, w, 34); demoTag(g, 8, 5); label(g, 'VOLUME CONTROL', w - 10, 23, 13, '#8fa3ad', { align: 'right', spacing: 1.5 });
  label(g, 'Paw  cmH₂O', 10, 54, 12, '#ffd166'); trace(g, paw, t, 10, 60, w - 20, 74, { seconds: 10, color: '#ffd166', lo: 0, hi: 24, fill: true }); label(g, 'Flow', 10, 156, 12, '#7be0c3'); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(10, 201, w - 20, 1); trace(g, flow, t, 10, 164, w - 20, 74, { seconds: 10, color: '#7be0c3', lo: -1, hi: 1 });
  [['VT', '480', 'mL'], ['RR', String(RR), '/min'], ['PEEP', '5', 'cmH₂O'], ['FiO₂', '0.50', '']].forEach(([k, v, u], i) => { const x = 10 + i * ((w - 20) / 4); label(g, k, x, 262, 12, '#8fa3ad'); label(g, v, x, 292, 26, '#e8edf0', { font: MONO, weight: 600 }); label(g, u, x, 308, 10, '#6f7f88'); });
}
function drawUltrasound(S, t, speckle) {
  const { g, w, h } = S; g.fillStyle = '#020304'; g.fillRect(0, 0, w, h); label(g, 'LINEAR  ·  NERVE', 16, 30, 16, '#cfd8dc', { weight: 600, spacing: 1.5 }); label(g, clock(), w - 16, 30, 15, '#90a0a8', { font: MONO, align: 'right' }); demoTag(g, w - 170, 12);
  const x0 = 120, y0 = 58, iw = w - 240, ih = h - 150; g.fillStyle = '#000'; g.fillRect(x0, y0, iw, ih);
  g.drawImage(speckle, x0, y0, iw, ih);                                                         // a probe in air: bright bands that repeat and fade with depth (reverberation), then noise
  for (let k = 0; k < 7; k++) { const y = y0 + 10 + k * 21 + Math.sin(t * 0.7 + k) * 0.6, a = 0.85 * Math.pow(0.62, k); const gr = g.createLinearGradient(0, y - 7, 0, y + 9); gr.addColorStop(0, 'rgba(235,240,240,0)'); gr.addColorStop(0.45, `rgba(235,240,240,${a})`); gr.addColorStop(1, 'rgba(235,240,240,0)'); g.fillStyle = gr; g.fillRect(x0, y - 7, iw, 16); }
  const fade = g.createLinearGradient(0, y0, 0, y0 + ih); fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(0.45, 'rgba(0,0,0,.72)'); fade.addColorStop(1, 'rgba(0,0,0,.94)'); g.fillStyle = fade; g.fillRect(x0, y0, iw, ih);
  g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1; for (let k = 0; k <= 4; k++) { const y = y0 + ih * k / 4; g.beginPath(); g.moveTo(x0 + iw + 10, y); g.lineTo(x0 + iw + (k % 2 ? 18 : 24), y); g.stroke(); label(g, String(k), x0 + iw + 30, y + 5, 13, '#90a0a8', { font: MONO }); }
  label(g, 'cm', x0 + iw + 30, y0 + ih + 22, 12, '#6f7f88'); [['Depth', '4.0 cm'], ['Gain', '52'], ['Freq', '12 MHz'], ['MI', '0.7']].forEach(([k, v], i) => { label(g, k, 16, 92 + i * 46, 12, '#6f7f88'); label(g, v, 16, 112 + i * 46, 16, '#cfd8dc', { font: MONO }); });
  for (let k = 0; k < 9; k++) { g.fillStyle = `rgb(${28 * k + 16},${28 * k + 16},${28 * k + 16})`; g.fillRect(88, y0 + 190 + k * 14, 12, 14); }
  g.fillStyle = '#1a1407'; g.fillRect(0, h - 44, w, 44); label(g, 'PROBE IN AIR  ·  NO PATIENT  ·  NOT A SCAN', w / 2, h - 16, 15, '#f0b429', { weight: 600, align: 'center', spacing: 1.5 });
}
function drawTouch(S) { const { g, w, h } = S; g.fillStyle = '#0a0e12'; g.fillRect(0, 0, w, h); const names = ['Nerve', 'Vascular', 'MSK', 'Small parts', 'Depth', 'Gain', 'Focus', 'Colour', 'Freeze', 'Measure', 'Label', 'Store'];
  names.forEach((n, i) => { const cx = i % 4, cy = Math.floor(i / 4), bw = (w - 50) / 4, bh = (h - 40) / 3, x = 10 + cx * (bw + 10), y = 10 + cy * (bh + 10); g.fillStyle = i === 0 ? '#1f5f73' : '#172028'; g.beginPath(); g.roundRect(x, y, bw, bh, 8); g.fill(); g.strokeStyle = i === 0 ? '#58c4de' : 'rgba(255,255,255,.1)'; g.lineWidth = 1.5; g.stroke(); label(g, n, x + bw / 2, y + bh / 2 + 6, 17, i === 0 ? '#e9fbff' : '#b9c6cc', { align: 'center' }); }); }
function drawPanel(S) { const { g, w, h } = S; g.fillStyle = '#0a0e12'; g.fillRect(0, 0, w, h); label(g, 'ROOM', 22, 44, 18, '#8fa3ad', { weight: 600, spacing: 4 }); label(g, clock(), w - 22, 46, 26, '#e8edf0', { font: MONO, align: 'right' });
  [['Surgical lights', 'On', true], ['Ambient', 'Cool', true], ['Laminar field', 'On', true], ['Door', 'Open', false], ['Display', 'Room board', true], ['Music', 'Off', false]].forEach(([k, v, on], i) => { const cx = i % 2, cy = Math.floor(i / 2), bw = (w - 66) / 2, bh = (h - 110) / 3, x = 22 + cx * (bw + 22), y = 70 + cy * (bh + 12); g.fillStyle = '#141c23'; g.beginPath(); g.roundRect(x, y, bw, bh - 4, 10); g.fill();
    g.fillStyle = on ? '#3ee06a' : '#56636b'; g.beginPath(); g.arc(x + 22, y + 26, 6, 0, 7); g.fill(); label(g, k, x + 40, y + 32, 17, '#cfd8dc'); label(g, v, x + 16, y + bh - 24, 24, on ? '#e9fbff' : '#8fa3ad', { weight: 300 }); });
  label(g, 'Display only. This panel controls nothing.', 22, h - 16, 13, '#f0b429'); }
function drawBoard(S, mark) {
  const { g, w, h } = S; const bg = g.createLinearGradient(0, 0, w, h); bg.addColorStop(0, '#0a1016'); bg.addColorStop(1, '#070a0e'); g.fillStyle = bg; g.fillRect(0, 0, w, h);
  if (mark) g.drawImage(mark, 70, 62, 342 * 0.72, 64 * 0.72); label(g, 'OPERATING ROOM', 72, 190, 26, '#8fa3ad', { weight: 500, spacing: 8 }); g.fillStyle = TOKENS.coral; g.fillRect(72, 214, 96, 3);
  label(g, 'No case is running.', 70, 318, 82, '#f1f4f5', { weight: 300 }); label(g, 'The monitors show a demonstration loop. No patient is connected in this room.', 74, 384, 27, '#aab7be', { weight: 400 });
  [['Anesthesia position', 'Head of the table, beside the workstation'], ['To run a case', 'Open the Student Workstation from this room'], ['Equipment', 'Placed for the room’s layout. Its controls are not live']].forEach(([k, v], i) => { const y = 486 + i * 74; g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(74, y - 44, 980, 1); label(g, k, 74, y, 22, '#6f828c', { spacing: 1 }); label(g, v, 400, y, 26, '#dfe6e9', { weight: 400 }); });
  label(g, clock(), w - 72, 204, 150, '#f1f4f5', { font: MONO, weight: 300, align: 'right' }); label(g, new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }), w - 76, 252, 26, '#8fa3ad', { align: 'right' });
  const x = w - 430, y = 330; g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 1.5; g.beginPath(); g.roundRect(x, y, 360, 300, 14); g.stroke(); label(g, 'DISPLAYS IN THIS ROOM', x + 26, y + 44, 16, '#6f828c', { spacing: 3 });
  [['Patient monitor', 'Demonstration loop'], ['Ventilator', 'Demonstration loop'], ['Wall panel', 'Display only']].forEach(([k, v], i) => { const yy = y + 100 + i * 70; g.fillStyle = '#f0b429'; g.beginPath(); g.arc(x + 34, yy - 8, 6, 0, 7); g.fill(); label(g, k, x + 56, yy, 23, '#dfe6e9'); label(g, v, x + 56, yy + 28, 18, '#8fa3ad'); });
}

/** Load the equipment, stand it in its rooms, and keep its screens drawn. Returns { has, update(dt) }. */
export async function mountClinical({ world }) {
  const api = { has: false, pieces: {}, screens: {}, update() {} }; let g;
  try { g = await world.loadModel('level/clinical.glb'); } catch (e) { console.warn('clinical equipment', e); return api; }
  const found = {};
  for (const k of [...g.scene.children]) { k.updateMatrixWorld(true); const c = new THREE.Box3().setFromObject(k).getCenter(new THREE.Vector3()), room = (k.userData && k.userData.room) || world.roomAt(c.x, c.y, c.z);
    const lit = world.place(k, { at: c, room, envI: 0.75, shadow: false }); api.pieces[k.name] = k;
    for (const m of lit.mats) if (m.map && m.transparent && m.opacity === 1) { m.transparent = false; m.alphaTest = 0.4; m.depthWrite = true; }      /* cloth with a see-through band: cut out, not blended, so it sorts and takes light like the solid thing it is */
    k.traverse((o) => { if (o.isMesh && /^screen_/.test(o.name)) found[o.name.replace(/^screen_/, '').replace(/_\d+$/, '')] = o; }); }
  const S = {}, make = (name, w, h, glow) => { const s = canvasTex(w, h); S[name] = s; const o = found[name]; if (o) { o.material.dispose && o.material.dispose(); o.material = new THREE.MeshBasicMaterial({ map: s.t, toneMapped: true, color: new THREE.Color(glow, glow, glow) }); } return s; };
  make('monitor', 560, 500, 1.5); make('vent', 320, 320, 1.5); make('us', 640, 548, 1.4); make('us_touch', 480, 296, 1.1); make('panel', 560, 404, 1.2); make('device', 200, 140, 1.0); make('pump', 116, 80, 1.0);
  const board = canvasTex(1536, 782, false); world.setScreen('orwall', board.t, { glow: 1.25 });
  const speckle = document.createElement('canvas'); speckle.width = 200; speckle.height = 160; const sg = speckle.getContext('2d'), noise = () => { const im = sg.createImageData(200, 160), d = im.data; for (let i = 0; i < d.length; i += 4) { const v = Math.pow(Math.random(), 2.2) * 150; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } sg.putImageData(im, 0, 0); };
  let mark = null; svgImage(wordmarkSVG({ ink: '#f1f4f5', accent: TOKENS.coral, weight: 2.8 })).then((i) => { mark = i; drawBoard(board, mark); board.t.needsUpdate = true; }).catch(() => {});
  const still = () => { drawTouch(S.us_touch); S.us_touch.t.needsUpdate = true; drawPanel(S.panel); S.panel.t.needsUpdate = true; drawBoard(board, mark); board.t.needsUpdate = true;
    for (const [n, text] of [['device', 'STANDBY'], ['pump', 'OFF']]) { const s = S[n]; s.g.fillStyle = '#06090c'; s.g.fillRect(0, 0, s.w, s.h); label(s.g, text, s.w / 2, s.h / 2 + 6, s.h * 0.2, '#6f828c', { align: 'center', spacing: 2 }); s.t.needsUpdate = true; } };
  let t = 0, fast = 0, slow = 0, minute = 99; noise(); drawMonitor(S.monitor, 0); S.monitor.t.needsUpdate = true; drawVent(S.vent, 0); S.vent.t.needsUpdate = true; drawUltrasound(S.us, 0, speckle); S.us.t.needsUpdate = true; still();
  api.has = true; api.screens = found;
  /** Screens are redrawn only for the room being looked into, and no faster than a real display refreshes its traces. */
  let heard = pulse.n;
  api.update = (dt) => { t += dt; fast += dt; slow += dt; minute += dt; if (pulse.n !== heard) { heard = pulse.n; t += 0.355 * BEAT - (t % BEAT); }      /* each tone you hear falls on the R wave you see */ const p = world.camera.position, room = world.roomAt(p.x, p.y, p.z, 0.3), motion = world.prefs.motion;
    if (room === 'or' && fast > (motion ? 1 / 20 : 1)) { fast = 0; drawMonitor(S.monitor, t); S.monitor.t.needsUpdate = true; drawVent(S.vent, t); S.vent.t.needsUpdate = true; }
    if (room === 'regional' && slow > (motion ? 0.16 : 2)) { slow = 0; if (motion) noise(); drawUltrasound(S.us, t, speckle); S.us.t.needsUpdate = true; }
    if (minute > 20) { minute = 0; still(); } };
  return api;
}
