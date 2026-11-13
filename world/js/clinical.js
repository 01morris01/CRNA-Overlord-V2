// clinical.js: the equipment of the operating room, the regional bay and pre-op holding, and what its screens show.
//
// The models are professionally made, openly licensed pieces (credited one by one in assets/LICENSES.md), prepared offline by
// tools/clinical_set.py; a few fittings no open model covered are built by tools/clinical_kit.py.
//
// The operating room's patient monitor and ventilator display are real in the sense that matters: when a case is running
// they show the app's own physiology engine, number for number, and their traces are drawn by the app's own waveform
// generator (ui/liveWaveformRenderer.js), the same one the classic live-sim display uses. A channel shows nothing until its
// sensor has been put on the patient. With no patient in the room the screens say STANDBY. The stand monitors in pre-op holding
// show the last vital signs recorded in the chart of the patient in their bay, and say so. The ultrasound in the regional bay
// has no probe model and shows what a probe held in air shows, marked as not a scan.
import * as THREE from 'three';
import { TOKENS, wordmarkSVG, svgImage } from './brand.js';
import { beat, alarm } from './audio.js';

const FONT = '"Inter Tight", system-ui, sans-serif', MONO = 'ui-monospace, "SF Mono", Menlo, monospace';
/** A canvas to draw a display on. Model files keep their pictures top row first, so a canvas meant for a model's screen is not flipped. */
function canvasTex(w, h, onModel = true) { const c = document.createElement('canvas'); c.width = w; c.height = h; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.flipY = !onModel; return { c, g: c.getContext('2d'), t, w, h }; }
/** One trace from the waveform generator's history (values -1..1, newest last), scrolling right to left. */
function trace(g, arr, x0, y0, w, h, color, { lo = -1, hi = 1, cap = 600, fill = false, width = 2.2 } = {}) {
  g.save(); g.beginPath(); g.rect(x0, y0 - 2, w, h + 4); g.clip(); g.lineWidth = width; g.lineJoin = 'round'; g.strokeStyle = color; g.shadowColor = color; g.shadowBlur = 6; const n = arr ? arr.length : 0, y = (v) => y0 + h - (Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo) * h;
  if (n > 1) { g.beginPath(); for (let i = 0; i < n; i += 2) { const x = x0 + w * (cap - n + i) / (cap - 1), yy = y(arr[i]); i === 0 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); if (fill) { g.lineTo(x0 + w, y0 + h); g.lineTo(x0 + w * (cap - n) / (cap - 1), y0 + h); g.closePath(); g.globalAlpha = 0.16; g.fillStyle = color; g.shadowBlur = 0; g.fill(); } }
  else { g.globalAlpha = 0.35; g.beginPath(); g.moveTo(x0, y(0)); g.lineTo(x0 + w, y(0)); g.stroke(); }
  g.restore();
}
const label = (g, text, x, y, size, color, { font = FONT, weight = 500, align = 'left', spacing = 0 } = {}) => { g.font = `${weight} ${size}px ${font}`; g.fillStyle = color; g.textAlign = align; if ('letterSpacing' in g) g.letterSpacing = spacing + 'px'; g.fillText(text, x, y); g.textAlign = 'left'; if ('letterSpacing' in g) g.letterSpacing = '0px'; };
const demoTag = (g, x, y) => { g.fillStyle = '#f0b429'; g.beginPath(); g.roundRect(x, y, 74, 24, 4); g.fill(); label(g, 'DEMO', x + 37, y + 18, 15, '#14100a', { weight: 700, align: 'center', spacing: 2 }); };
const clock = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
const num = (v, d = 0) => (Number.isFinite(v) ? v.toFixed(d) : '--');
const MODES = ['Manual / spontaneous', 'Volume control', 'Pressure control', 'Pressure support'];

// ---- what each screen draws
function standby(S, title) { const { g, w, h } = S; g.fillStyle = '#04070a'; g.fillRect(0, 0, w, h); g.fillStyle = '#0c1318'; g.fillRect(0, 0, w, Math.round(h * 0.076)); label(g, title, 12, Math.round(h * 0.054), Math.round(h * 0.03), '#8fa3ad', { spacing: 2 }); label(g, clock(), w - 12, Math.round(h * 0.054), Math.round(h * 0.032), '#c9d5da', { font: MONO, align: 'right' });
  label(g, 'STANDBY', w / 2, h * 0.5, Math.round(h * 0.09), '#5f7480', { weight: 300, align: 'center', spacing: 8 }); label(g, 'No patient in the room', w / 2, h * 0.5 + h * 0.07, Math.round(h * 0.034), '#4a5a63', { align: 'center' }); }
/** The patient monitor with a case running: the engine's numbers, and the app's own traces. A channel that has not been connected shows dashes. */
function drawMonitor(S, L, blink) {
  const { g, w, h } = S, m = L.m, s = m.s, mon = m.mon, wv = m.wave; g.fillStyle = '#04070a'; g.fillRect(0, 0, w, h); g.fillStyle = '#0c1318'; g.fillRect(0, 0, w, 38); label(g, L.label || '', 12, 26, 16, '#dfe6e9', { weight: 600 }); label(g, 'CASE ' + m.clock, w - 12, 26, 16, '#c9d5da', { font: MONO, align: 'right' });
  const gas = mon.gas && s.capnogramPresent, low = mon.spo2 && s.spo2 < 90, rows = [['II', '#3ee06a', mon.ecg ? wv.ecg : null, { lo: -0.35, hi: 1.15 }, mon.ecg || mon.spo2 ? num(s.hr) : '--', 'HR  /min', mon.ecg], ['Pleth', low ? '#ff5a4c' : '#4cc9ff', mon.spo2 ? wv.pleth : null, { lo: -0.1, hi: 1.15 }, mon.spo2 ? num(s.spo2) : '--', 'SpO₂  %', mon.spo2], ['CO₂', '#f2d24b', gas ? wv.co2 : null, { lo: -0.08, hi: 1.25, fill: true }, gas ? num(s.etco2) : '--', 'etCO₂  mmHg', mon.gas]];
  const top = 46, rh = (h - top - 118) / 3, tw = w - 176;
  rows.forEach(([name, color, arr, opt, value, unit, on], i) => { const y = top + i * rh; if (i === 1 && low && blink) { g.fillStyle = 'rgba(255,60,50,.16)'; g.fillRect(0, y, w, rh); } g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(8, y + rh - 1, w - 16, 1); label(g, name, 12, y + 20, 14, color, { weight: 600 }); if (!on) label(g, 'not connected', 70, y + 20, 12, '#56666f'); trace(g, arr, 12, y + 26, tw, rh - 40, color, opt);
    label(g, value, w - 14, y + rh - 22, 58, color, { font: MONO, weight: 600, align: 'right' }); label(g, unit, w - 14, y + 22, 13, color, { align: 'right' }); });
  let y = h - 112; const n = m.nibp; label(g, 'NIBP', 12, y + 20, 14, '#e8edf0', { weight: 600 }); label(g, n ? `${n.sbp}/${n.dbp}` : '--/--', 12, y + 56, 36, '#e8edf0', { font: MONO, weight: 600 }); label(g, n ? `(${n.map})  ${Math.max(0, Math.round((m.t - n.t) / 60))} min ago` : mon.nibp ? 'cycling' : 'cuff not on', 12, y + 76, 13, '#aeb9bf');
  label(g, 'RR', 236, y + 20, 14, '#f2d24b', { weight: 600 }); label(g, gas ? num(s.rr) : '--', 236, y + 56, 36, '#f2d24b', { font: MONO, weight: 600 }); label(g, 'TEMP', 316, y + 20, 14, '#e8edf0', { weight: 600 }); label(g, mon.ecg || mon.spo2 ? num(s.temp, 1) : '--', 316, y + 56, 30, '#e8edf0', { font: MONO, weight: 600 });
  label(g, 'O₂  insp / end-tidal', w - 14, y + 20, 13, '#9fd0ff', { align: 'right' }); label(g, gas ? `${num(s.fio2 * 100)} / ${num(s.eto2)}` : '-- / --', w - 14, y + 44, 24, '#9fd0ff', { font: MONO, weight: 600, align: 'right' });
  if (gas && (s.etAgent > 0.04 || s.vaporizer > 0)) { label(g, `${(s.vaporizerAgent || s.agent || 'Agent').toString().slice(0, 4).toUpperCase()}  ${num(s.etAgent, 1)}%   MAC ${num(s.mac, 1)}`, w - 14, y + 72, 16, '#d6a3ff', { font: MONO, weight: 600, align: 'right' }); }
  g.fillStyle = '#0c1318'; g.fillRect(0, h - 30, w, 30); const tof = s.lastTofCheck; label(g, tof ? `TOF ${tof.count}/4` + (tof.count === 4 ? `  ratio ${tof.ratio.toFixed(2)}` : '') + `  at ${Math.floor(tof.tSec / 60)}:${String(Math.floor(tof.tSec % 60)).padStart(2, '0')}` : 'TOF not checked', 12, h - 10, 13, '#aeb9bf', { font: MONO });
  if (low) label(g, 'SpO₂ LOW', w - 12, h - 10, 14, blink ? '#ff5a4c' : '#7a2e28', { weight: 700, align: 'right', spacing: 1.5 }); else label(g, L.sub || '', w - 12, h - 10, 12, '#6f7f88', { align: 'right' });
}
/** The ventilator display: the machine's settings and what the engine says it is delivering. */
function drawVent(S, L) {
  const { g, w, h } = S, s = L.m.s, wv = L.m.wave; g.fillStyle = '#05080b'; g.fillRect(0, 0, w, h); g.fillStyle = '#0c1318'; g.fillRect(0, 0, w, 34); label(g, (MODES[s.ventMode] || 'Manual').toUpperCase(), 10, 23, 13, '#dfe6e9', { weight: 600, spacing: 1.2 }); label(g, s.airwayDevice === 'intubated' ? 'ETT' : s.airwayDevice === 'mask' ? 'MASK' : 'NO DEVICE', w - 10, 23, 12, '#8fa3ad', { align: 'right', spacing: 1.5 });
  label(g, 'Paw  cmH₂O', 10, 52, 12, '#ffd166'); label(g, 'Ppeak ' + num(s.ppeak), w - 10, 52, 12, '#ffd166', { align: 'right', font: MONO }); trace(g, wv.paw, 10, 58, w - 20, 62, '#ffd166', { lo: -0.08, hi: 0.75, fill: true });
  label(g, 'Flow', 10, 140, 12, '#7be0c3'); label(g, 'MV ' + num(s.mv, 1) + ' L/min', w - 10, 140, 12, '#7be0c3', { align: 'right', font: MONO }); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(10, 179, w - 20, 1); trace(g, wv.flow, 10, 146, w - 20, 66, '#7be0c3', { lo: -1, hi: 1 });
  [['VT', num(s.ventMode ? s.tv : s.spontaneousTV), 'mL'], ['RR', num(s.ventMode ? s.ventSetRR : s.spontaneousRR), '/min'], ['PEEP', num(s.ventSetPeep), 'cmH₂O'], ['FiO₂', num(s.fio2, 2), '']].forEach(([k, v, u], i) => { const x = 10 + i * ((w - 20) / 4); label(g, k, x, 236, 12, '#8fa3ad'); label(g, v, x, 264, 24, '#e8edf0', { font: MONO, weight: 600 }); label(g, u, x, 279, 10, '#6f7f88'); });
  label(g, `O₂ ${num(s.o2Flow, 1)}  Air ${num(s.airFlow, 1)}  N₂O ${num(s.n2oFlow, 1)} L/min`, 10, 304, 12, '#9fd0ff', { font: MONO }); label(g, s.vaporizer > 0 ? `${String(s.vaporizerAgent).slice(0, 4)} ${num(s.vaporizer, 1)}%` : 'agent off', w - 10, 304, 12, '#d6a3ff', { font: MONO, align: 'right' });
}
/** A spot-check monitor on a stand (pre-op holding, the block bay). It shows the last vital signs recorded in the chart of whoever is in
 *  that bay, with where they were taken. It is not live, and says "last recorded". With nobody in the bay it is on standby. */
function drawSpot(S, d) { const { g, w, h } = S; g.fillStyle = '#06090c'; g.fillRect(0, 0, w, h);
  if (!d) { label(g, 'STANDBY', w / 2, h / 2 + 8, 26, '#5f7480', { align: 'center', spacing: 4, weight: 300 }); return; }
  label(g, 'NIBP  mmHg', 14, 30, 15, '#8fa3ad', { spacing: 1 }); label(g, `${num(d.sbp)}/${num(d.dbp)}`, 14, 86, 54, '#e8edf0', { font: MONO, weight: 600 });
  label(g, 'PULSE', 14, 128, 14, '#3ee06a'); label(g, num(d.hr), 14, 170, 42, '#3ee06a', { font: MONO, weight: 600 }); label(g, 'SpO₂ %', w / 2 + 8, 128, 14, '#4cc9ff'); label(g, num(d.spo2), w / 2 + 8, 170, 42, '#4cc9ff', { font: MONO, weight: 600 });
  label(g, 'TEMP °C', 14, 208, 14, '#e8edf0'); label(g, num(d.temp, 1), 14, 244, 30, '#e8edf0', { font: MONO, weight: 600 }); label(g, 'RESP', w / 2 + 8, 208, 14, '#f2d24b'); label(g, num(d.rr), w / 2 + 8, 244, 30, '#f2d24b', { font: MONO, weight: 600 });
  g.fillStyle = '#0c1318'; g.fillRect(0, h - 46, w, 46); label(g, 'LAST RECORDED · NOT LIVE', 14, h - 28, 11, '#8fa3ad', { spacing: 1.2 }); label(g, String(d.when || 'in the chart').slice(0, 30), 14, h - 11, 12.5, '#c9d5da'); }
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
function drawTouch(S) { const { g, w, h } = S; g.fillStyle = '#0a0e12'; g.fillRect(0, 0, w, h); const names = ['Nerve', 'Vascular', 'MSK', 'Small parts', 'Depth', 'Gain', 'Focus', 'Color', 'Freeze', 'Measure', 'Label', 'Store'];
  names.forEach((n, i) => { const cx = i % 4, cy = Math.floor(i / 4), bw = (w - 50) / 4, bh = (h - 40) / 3, x = 10 + cx * (bw + 10), y = 10 + cy * (bh + 10); g.fillStyle = i === 0 ? '#1f5f73' : '#172028'; g.beginPath(); g.roundRect(x, y, bw, bh, 8); g.fill(); g.strokeStyle = i === 0 ? '#58c4de' : 'rgba(255,255,255,.1)'; g.lineWidth = 1.5; g.stroke(); label(g, n, x + bw / 2, y + bh / 2 + 6, 17, i === 0 ? '#e9fbff' : '#b9c6cc', { align: 'center' }); }); }
function drawPanel(S) { const { g, w, h } = S; g.fillStyle = '#0a0e12'; g.fillRect(0, 0, w, h); label(g, 'ROOM', 22, 44, 18, '#8fa3ad', { weight: 600, spacing: 4 }); label(g, clock(), w - 22, 46, 26, '#e8edf0', { font: MONO, align: 'right' });
  [['Surgical lights', 'On', true], ['Ambient', 'Cool', true], ['Laminar field', 'On', true], ['Door', 'Open', false], ['Display', 'Room board', true], ['Music', 'Off', false]].forEach(([k, v, on], i) => { const cx = i % 2, cy = Math.floor(i / 2), bw = (w - 66) / 2, bh = (h - 110) / 3, x = 22 + cx * (bw + 22), y = 70 + cy * (bh + 12); g.fillStyle = '#141c23'; g.beginPath(); g.roundRect(x, y, bw, bh - 4, 10); g.fill();
    g.fillStyle = on ? '#3ee06a' : '#56636b'; g.beginPath(); g.arc(x + 22, y + 26, 6, 0, 7); g.fill(); label(g, k, x + 40, y + 32, 17, '#cfd8dc'); label(g, v, x + 16, y + bh - 24, 24, on ? '#e9fbff' : '#8fa3ad', { weight: 300 }); });
  label(g, 'Display only. This panel controls nothing.', 22, h - 16, 13, '#f0b429'); }
/** The room board. With no case it says so; with a case it carries what a time-out needs in view: who, what, allergies, the clock. */
function drawBoard(S, mark, L) {
  const { g, w, h } = S; const bg = g.createLinearGradient(0, 0, w, h); bg.addColorStop(0, '#0a1016'); bg.addColorStop(1, '#070a0e'); g.fillStyle = bg; g.fillRect(0, 0, w, h);
  if (mark) g.drawImage(mark, 70, 62, 342 * 0.72, 64 * 0.72); label(g, 'OPERATING ROOM', 72, 190, 26, '#8fa3ad', { weight: 500, spacing: 8 }); g.fillStyle = TOKENS.coral; g.fillRect(72, 214, 96, 3);
  label(g, clock(), w - 72, 204, 150, '#f1f4f5', { font: MONO, weight: 300, align: 'right' }); label(g, new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }), w - 76, 252, 26, '#8fa3ad', { align: 'right' });
  const rows = (list, y0 = 486) => list.forEach(([k, v, c], i) => { const y = y0 + i * 74; g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(74, y - 44, 980, 1); label(g, k, 74, y, 22, '#6f828c', { spacing: 1 }); label(g, String(v).slice(0, 62), 400, y, 26, c || '#dfe6e9', { weight: 400 }); });
  if (!L || !L.board) { label(g, 'No case is running.', 70, 318, 82, '#f1f4f5', { weight: 300 }); label(g, 'The monitors are on standby. Bring a patient from pre-op holding to begin.', 74, 384, 27, '#aab7be', { weight: 400 });
    rows([['Patients', 'Pre-op holding, west side of the court'], ['Anesthesia position', 'Head of the table, beside the workstation'], ['Monitors', 'Driven by the simulator once a patient is connected']]); return; }
  const b = L.board; label(g, b.name.slice(0, 30), 70, 318, 76, '#f1f4f5', { weight: 300 }); label(g, `${b.age} ${b.sex}  ·  ${b.weight} kg  ·  ${b.procedure}`.slice(0, 84), 74, 384, 27, '#aab7be', { weight: 400 });
  rows([['Allergies', b.allergies, /^(nkda|none|no known)/i.test(b.allergies) ? '#9fe0a8' : '#ff8d7a'], ['Time-out', b.timeout ? 'Called at ' + b.timeout : 'Not yet called', b.timeout ? '#9fe0a8' : '#f0b429'], ['Now', b.phase]]);
  const x = w - 430, y = 330; g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 1.5; g.beginPath(); g.roundRect(x, y, 360, 300, 14); g.stroke(); label(g, 'CASE CLOCK', x + 26, y + 44, 16, '#6f828c', { spacing: 3 }); label(g, L.m.clock, x + 26, y + 150, 92, '#f1f4f5', { font: MONO, weight: 300 });
  label(g, b.sequence, x + 26, y + 206, 20, '#aab7be'); label(g, 'Simulated patient. Not for clinical use.', x + 26, y + 262, 15, '#f0b429');
}

/** Load the equipment, stand it in its rooms, and keep its screens drawn. Returns { has, update(dt) }. */
export async function mountClinical({ world }) {
  const api = { has: false, pieces: {}, screens: {}, update() {} }; let g;
  try { g = await world.loadModel('level/clinical.glb'); } catch (e) { console.warn('clinical equipment', e); return api; }
  const found = {};
  for (const k of [...g.scene.children]) { k.updateMatrixWorld(true); const c = new THREE.Box3().setFromObject(k).getCenter(new THREE.Vector3()), room = (k.userData && k.userData.room) || world.roomAt(c.x, c.y, c.z);
    const lit = world.place(k, { at: c, room, envI: 0.75, shadow: false, solid: true }); api.pieces[k.name] = k;      /* solid: its own outline goes into the floor map of what stops you */
    for (const m of lit.mats) if (m.map && m.transparent && m.opacity === 1) { m.transparent = false; m.alphaTest = 0.4; m.depthWrite = true; }      /* cloth with a see-through band: cut out, not blended, so it sorts and takes light like the solid thing it is */
    k.traverse((o) => { if (o.isMesh && /^screen_/.test(o.name)) (found[o.name.replace(/^screen_/, '').replace(/[_.]?\d+$/, '')] ||= []).push({ mesh: o, piece: k, room }); }); k.userData.room = room; }      /* a second machine or monitor in another room carries the same screens under a numbered name */
  const S = {}, MATS = {}, make = (name, w, h, glow) => { const s = canvasTex(w, h); S[name] = s; const m = MATS[name] = new THREE.MeshBasicMaterial({ map: s.t, toneMapped: true, color: new THREE.Color(glow, glow, glow) }); for (const q of found[name] || []) { q.mesh.material.dispose && q.mesh.material.dispose(); q.mesh.material = m; } return s; };
  /** The live patient is shown on the screens of ONE room; the same kind of screen elsewhere stays on standby. */
  const idle = {}, idleMat = (name, title) => { if (!idle[name]) { const s = canvasTex(S[name].w, S[name].h); standby(s, title); s.t.needsUpdate = true; idle[name] = new THREE.MeshBasicMaterial({ map: s.t, toneMapped: true, color: MATS[name].color.clone() }); } return idle[name]; };
  let liveRoom = null; const point = (room) => { if (room === liveRoom) return; liveRoom = room; for (const [name, title] of [['monitor', 'PATIENT MONITOR'], ['vent', 'VENTILATOR']]) for (const q of found[name] || []) q.mesh.material = !room || q.room === room ? MATS[name] : idleMat(name, title); };
  make('monitor', 560, 500, 1.5); make('vent', 320, 320, 1.5); make('us', 640, 548, 1.4); make('us_touch', 480, 296, 1.1); make('panel', 560, 404, 1.2); make('device', 200, 140, 1.0); make('pump', 116, 80, 1.0);
  // the workstation's own controls turn with the engine's settings: the three flow-control knobs by liters a minute, the vaporizer dials by percent.
  // Each is re-centered first (the model keeps every part in the machine's frame) and turns about its own axis, found from its own shape.
  const flatAxis = (pos) => { const n = pos.count, m = [0, 0, 0, 0, 0, 0], v = new THREE.Vector3(); for (let i = 0; i < n; i++) { v.fromBufferAttribute(pos, i); m[0] += v.x * v.x; m[1] += v.x * v.y; m[2] += v.x * v.z; m[3] += v.y * v.y; m[4] += v.y * v.z; m[5] += v.z * v.z; }
    const mul = (a) => new THREE.Vector3(m[0] * a.x + m[1] * a.y + m[2] * a.z, m[1] * a.x + m[3] * a.y + m[4] * a.z, m[2] * a.x + m[4] * a.y + m[5] * a.z), top = (skip) => { let a = new THREE.Vector3(0.61, 0.52, 0.6); for (let k = 0; k < 60; k++) { a = mul(a); if (skip) a.addScaledVector(skip, -a.dot(skip)); a.normalize(); } return a; };
    const e1 = top(null), e2 = top(e1), e3 = new THREE.Vector3().crossVectors(e1, e2).normalize(), l = [e1, e2, e3].map((e) => e.dot(mul(e))), ax = (l[0] - l[1] > l[1] - l[2] ? e1 : e3).clone(); return ax.z < 0 ? ax.negate() : ax; };      /* a round thing spreads equally in two directions; the odd one out is its axis, whether it is a long knob or a flat dial */
  const turns = {}, centred = new WeakMap(); for (const [pn, m] of Object.entries(api.pieces)) { if (!pn.startsWith('eq_anesthesia_machine')) continue; const set = turns[m.userData.room] = {}; for (const k of [...m.children]) { const n = k.isMesh && k.material ? k.material.name : ''; if (!/^(knob_|dial_)/.test(n)) continue;
      let c = centred.get(k.geometry); if (!c) { k.geometry.computeBoundingBox(); const ctr = k.geometry.boundingBox.getCenter(new THREE.Vector3()); k.geometry.translate(-ctr.x, -ctr.y, -ctr.z); c = { ctr, axis: flatAxis(k.geometry.attributes.position) }; centred.set(k.geometry, c); } k.position.add(c.ctr); k.userData.axis = c.axis; set[n] = k; } }
  const turn = turns.or || {};
  const dials = (s, room = 'or') => { for (const [r, tr] of Object.entries(turns)) { const on = s && r === room, set = (n, a) => { if (tr[n]) tr[n].quaternion.setFromAxisAngle(tr[n].userData.axis, on ? a : 0); }; dialsOf(set, on ? s : null); } }, dialsOf = (set, s) => { set('knob_oxygen', s ? -s.o2Flow * 0.45 : 0); set('knob_air', s ? -s.airFlow * 0.45 : 0); set('knob_nitrous', s ? -s.n2oFlow * 0.45 : 0); set('dial_sevoflurane', s && s.vaporizerAgent === 'Sevoflurane' ? -s.vaporizer * 0.5 : 0); set('dial_isoflurane', s && s.vaporizerAgent === 'Isoflurane' ? -s.vaporizer * 0.5 : 0); };
  // the stand monitors' own screens: the model carries a picture of numbers that belong to nobody, so a real display is laid over it (its place measured on the model)
  api.spots = {}; for (const [name, k] of Object.entries(api.pieces)) { if (!name.startsWith('eq_vitals_monitor')) continue; const s = canvasTex(240, 308, false), q = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.154), new THREE.MeshBasicMaterial({ map: s.t, toneMapped: true, color: new THREE.Color(1.15, 1.15, 1.15) }));
    q.position.set(-0.038, 1.237, 0.0335); q.rotation.x = -0.1639; q.name = 'screen_spot'; k.add(q); drawSpot(s, null); s.t.needsUpdate = true; const sp = api.spots[name] = { s, data: null, at: k.getWorldPosition(new THREE.Vector3()), set(d) { sp.data = d || null; drawSpot(s, sp.data); s.t.needsUpdate = true; } }; }
  const board = canvasTex(1536, 782, false); world.setScreen('orwall', board.t, { glow: 1.25 });
  const speckle = document.createElement('canvas'); speckle.width = 200; speckle.height = 160; const sg = speckle.getContext('2d'), noise = () => { const im = sg.createImageData(200, 160), d = im.data; for (let i = 0; i < d.length; i += 4) { const v = Math.pow(Math.random(), 2.2) * 150; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } sg.putImageData(im, 0, 0); };
  let mark = null; svgImage(wordmarkSVG({ ink: '#f1f4f5', accent: TOKENS.coral, weight: 2.8 })).then((i) => { mark = i; drawBoard(board, mark, api.live); board.t.needsUpdate = true; }).catch(() => {});
  const still = () => { drawTouch(S.us_touch); S.us_touch.t.needsUpdate = true; drawPanel(S.panel); S.panel.t.needsUpdate = true; if (!api.live) { drawBoard(board, mark, null); board.t.needsUpdate = true; }
    for (const [n, text] of [['device', 'STANDBY'], ['pump', 'OFF']]) { const s = S[n]; s.g.fillStyle = '#06090c'; s.g.fillRect(0, 0, s.w, s.h); label(s.g, text, s.w / 2, s.h / 2 + 6, s.h * 0.2, '#6f828c', { align: 'center', spacing: 2 }); s.t.needsUpdate = true; } };
  let t = 0, fast = 0, slow = 0, minute = 99, wasLive = false, phase = 0, alarmT = 0, boardT = 0; noise(); standby(S.monitor, 'PATIENT MONITOR'); S.monitor.t.needsUpdate = true; standby(S.vent, 'VENTILATOR'); S.vent.t.needsUpdate = true; drawUltrasound(S.us, 0, speckle); S.us.t.needsUpdate = true; still();
  api.has = true; api.screens = Object.fromEntries(Object.entries(found).map(([k, list]) => [k, (list.find((q) => q.room === 'or') || list[0]).mesh])); api.turn = turn; api.turns = turns; api.live = null;      // set each frame by the case that is running: { m (what the case's tick returned), label, sub, board, room }
  /** The screen of a kind (monitor, vent ...) in a room. */
  api.screenIn = (kind, room) => { const q = (found[kind] || []).find((x) => x.room === room); return q ? q.mesh : null; };
  /** Screens are redrawn only for the room being looked into, and no faster than a real display refreshes its traces. */
  api.update = (dt) => { t += dt; fast += dt; slow += dt; minute += dt; boardT += dt; const p = world.camera.position, room = world.roomAt(p.x, p.y, p.z, 0.3), motion = world.prefs.motion, L = api.live;
    if (L) { const ph = L.m.wave.cardiacPhase, mon = L.m.mon; if (ph < phase && (mon.spo2 || mon.ecg)) beat(mon.spo2 ? L.m.s.spo2 : 99); phase = ph;      /* one tone per beat drawn, from the monitor itself */
      if (mon.spo2 && L.m.s.spo2 < 90) { alarmT -= dt; if (alarmT <= 0) { alarmT = 2.2; alarm(); } } }
    point(L ? L.room || 'or' : null);
    if (L && (room === (L.room || 'or') || room === 'court') && fast > (motion ? 1 / 20 : 0.5)) { fast = 0; drawMonitor(S.monitor, L, Math.floor(t * 2) % 2 === 0); S.monitor.t.needsUpdate = true; drawVent(S.vent, L); S.vent.t.needsUpdate = true; dials(L.m.s, L.room || 'or'); }
    if (L && boardT > 1) { boardT = 0; drawBoard(board, mark, L); board.t.needsUpdate = true; }
    if (!L && wasLive) { dials(null); standby(S.monitor, 'PATIENT MONITOR'); S.monitor.t.needsUpdate = true; standby(S.vent, 'VENTILATOR'); S.vent.t.needsUpdate = true; drawBoard(board, mark, null); board.t.needsUpdate = true; } wasLive = !!L;
    if ((room === 'regional' || room === 'procedure') && slow > (motion ? 0.16 : 2)) { slow = 0; if (motion) noise(); drawUltrasound(S.us, t, speckle); S.us.t.needsUpdate = true; }
    if (minute > 20) { minute = 0; still(); if (!L) { standby(S.monitor, 'PATIENT MONITOR'); S.monitor.t.needsUpdate = true; standby(S.vent, 'VENTILATOR'); S.vent.t.needsUpdate = true; } } };
  return api;
}
