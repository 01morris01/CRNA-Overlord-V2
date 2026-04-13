/**
 * Scene Registry — data-driven scene dispatcher.
 *
 * Motivation:
 *   The existing app binds scenes to *nodes* via nodeConfig.sceneRendererName,
 *   which means every new node requires a new hand-written scene file. That
 *   makes it impossible for a content agent to emit a new question and its
 *   matching visual in one shot.
 *
 *   This module provides the opposite model: a SCENE_REGISTRY keyed by a
 *   stable "scene kind" string, where each value is a pure draw function that
 *   takes (ctx, W, H, cfg, t) and renders one frame. A question can now carry
 *     q.scene    = "vessel_cross_section"
 *     q.sceneCfg = { radius: 65, wall: 12, label: "BLOOD VESSEL", ... }
 *   and the UI will pick the draw function out of the registry and animate it
 *   without touching nodeConfig or writing a new file.
 *
 *   gameUI.js checks the registry FIRST. If q.scene isn't a registered kind,
 *   the legacy per-node renderer still runs, so existing nodes don't break.
 *
 * Aesthetic:
 *   Dark neon medical arcade, matching the rest of the scene files — cyan/
 *   magenta glow on near-black background.
 */

// ─── RAF ownership ──────────────────────────────────────────────────────────
//
// The registry owns ONE raf loop. Starting a new scene cancels the previous
// one. Legacy per-node scenes have their own raf loops; gameUI.js is
// responsible for calling stopActiveScene() + the node's stopXxxScene()
// before switching modes.

let _rafId = null;
let _t = 0;
let _activeDraw = null;
let _activeCfg = null;

export function stopActiveScene() {
  if (_rafId) {
    cancelAnimationFrame(_rafId);
    _rafId = null;
  }
  _activeDraw = null;
  _activeCfg = null;
}

/**
 * Start rendering a scene from the registry.
 * @param {string} kind - registry key (e.g. "patient", "ecg_waveform")
 * @param {object} cfg  - scene params (radius, labels, flags, etc.)
 */
export function runScene(kind, cfg = {}) {
  const canvas = document.getElementById('scn');
  if (!canvas) {
    console.warn('[sceneRegistry] no #scn canvas found');
    return;
  }
  const draw = SCENE_REGISTRY[kind];
  if (typeof draw !== 'function') {
    console.warn(`[sceneRegistry] unknown scene kind: ${kind}`);
    return;
  }

  stopActiveScene();
  _activeDraw = draw;
  _activeCfg = cfg || {};
  _t = 0;

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  function tick() {
    _rafId = requestAnimationFrame(tick);
    _t += 0.016;
    try {
      _activeDraw(ctx, W, H, _activeCfg, _t);
    } catch (err) {
      console.error('[sceneRegistry] draw error', err);
      stopActiveScene();
    }
  }
  tick();
}

// ─── shared helpers ─────────────────────────────────────────────────────────

function bg(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#05070f');
  grad.addColorStop(1, '#0a0f1c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // faint grid
  ctx.strokeStyle = 'rgba(0, 255, 200, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
}

function txt(ctx, str, x, y, opts = {}) {
  ctx.save();
  ctx.font = opts.font || '14px "Courier New", monospace';
  ctx.fillStyle = opts.color || '#6ef7ff';
  ctx.textAlign = opts.align || 'left';
  ctx.textBaseline = opts.baseline || 'alphabetic';
  if (opts.glow) {
    ctx.shadowColor = opts.color || '#6ef7ff';
    ctx.shadowBlur = opts.glow;
  }
  ctx.fillText(str, x, y);
  ctx.restore();
}

function glow(ctx, color, blur, fn) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  fn();
  ctx.restore();
}

// ─── primitive draw functions ───────────────────────────────────────────────

/**
 * Generic "patient body" silhouette with optional callout hotspots.
 * cfg: { label, hotspots: [{x,y,r,label}], heartRate }
 */
function drawPatient(ctx, W, H, cfg, t) {
  bg(ctx, W, H);

  const cx = W / 2;
  const cy = H / 2;
  const pulse = 1 + Math.sin(t * 4) * 0.03;

  // body silhouette
  ctx.save();
  ctx.strokeStyle = '#6ef7ff';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#6ef7ff';
  ctx.shadowBlur = 10;

  // head
  ctx.beginPath();
  ctx.arc(cx, cy - 120, 32, 0, Math.PI * 2);
  ctx.stroke();

  // torso
  ctx.beginPath();
  ctx.moveTo(cx - 55, cy - 80);
  ctx.lineTo(cx + 55, cy - 80);
  ctx.lineTo(cx + 70, cy + 80);
  ctx.lineTo(cx - 70, cy + 80);
  ctx.closePath();
  ctx.stroke();

  // arms
  ctx.beginPath();
  ctx.moveTo(cx - 55, cy - 70); ctx.lineTo(cx - 110, cy + 40);
  ctx.moveTo(cx + 55, cy - 70); ctx.lineTo(cx + 110, cy + 40);
  ctx.stroke();

  // legs
  ctx.beginPath();
  ctx.moveTo(cx - 35, cy + 80); ctx.lineTo(cx - 45, cy + 180);
  ctx.moveTo(cx + 35, cy + 80); ctx.lineTo(cx + 45, cy + 180);
  ctx.stroke();

  // heart pulse
  ctx.fillStyle = `rgba(255, 80, 120, ${0.6 + 0.2 * Math.sin(t * 4)})`;
  ctx.beginPath();
  ctx.arc(cx - 10, cy - 30, 10 * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // hotspots
  const hotspots = cfg.hotspots || [];
  for (const h of hotspots) {
    const ring = 1 + Math.sin(t * 3) * 0.15;
    ctx.save();
    ctx.strokeStyle = '#ff6ef7';
    ctx.shadowColor = '#ff6ef7';
    ctx.shadowBlur = 15;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx + (h.x || 0), cy + (h.y || 0), (h.r || 14) * ring, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    if (h.label) txt(ctx, h.label, cx + (h.x || 0) + 20, cy + (h.y || 0), { color: '#ff6ef7', glow: 6 });
  }

  if (cfg.label) txt(ctx, cfg.label, 20, 30, { color: '#6ef7ff', glow: 8, font: '16px "Courier New", monospace' });
  if (cfg.heartRate) txt(ctx, `HR: ${cfg.heartRate}`, W - 20, 30, { color: '#ff6ef7', align: 'right', glow: 6 });
}

/**
 * Scrolling ECG trace.
 * cfg: { label, rhythm: 'sinus'|'afib'|'vtach', rate }
 */
function drawEcgWaveform(ctx, W, H, cfg, t) {
  bg(ctx, W, H);

  const baseY = H / 2;
  const rate = cfg.rate || 75; // bpm
  const rhythm = cfg.rhythm || 'sinus';
  const speed = 80; // px/sec

  ctx.save();
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#00ff88';
  ctx.shadowBlur = 10;
  ctx.beginPath();

  const period = (60 / rate);
  for (let x = 0; x < W; x++) {
    const tx = (x / speed) - t;
    // phase in [0, 1) within one beat
    const phase = ((tx % period) + period) % period / period;
    let y = 0;

    if (rhythm === 'vtach') {
      y = 60 * Math.sin(phase * Math.PI * 2);
    } else if (rhythm === 'afib') {
      y = 30 * Math.sin(phase * Math.PI * 18 + x * 0.2) * (1 + 0.3 * Math.sin(x * 0.05));
      if (phase > 0.45 && phase < 0.55) y -= 70 * Math.sin((phase - 0.45) / 0.1 * Math.PI);
    } else {
      // sinus: P - QRS - T
      if (phase < 0.08) y = -8 * Math.sin(phase / 0.08 * Math.PI);          // P
      else if (phase < 0.14) y = 0;
      else if (phase < 0.18) y = 12;                                         // Q
      else if (phase < 0.22) y = -70 * Math.sin((phase - 0.18) / 0.04 * Math.PI); // R
      else if (phase < 0.26) y = 15;                                         // S
      else if (phase < 0.40) y = 0;
      else if (phase < 0.55) y = -20 * Math.sin((phase - 0.40) / 0.15 * Math.PI); // T
      else y = 0;
    }

    if (x === 0) ctx.moveTo(x, baseY + y);
    else ctx.lineTo(x, baseY + y);
  }
  ctx.stroke();
  ctx.restore();

  if (cfg.label) txt(ctx, cfg.label, 20, 30, { color: '#00ff88', glow: 8, font: '16px "Courier New", monospace' });
  txt(ctx, `${rhythm.toUpperCase()}  ${rate} bpm`, W - 20, 30, { color: '#00ff88', align: 'right', glow: 6 });
}

/**
 * Frank–Starling curve with moving operating point.
 * cfg: { label, point, shift: 'normal'|'failure'|'inotropic' }
 */
function drawFrankStarling(ctx, W, H, cfg, t) {
  bg(ctx, W, H);

  const pad = 60;
  const x0 = pad, y0 = H - pad;
  const x1 = W - pad, y1 = pad;
  const plotW = x1 - x0, plotH = y0 - y1;

  // axes
  ctx.save();
  ctx.strokeStyle = '#6ef7ff';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#6ef7ff';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0);
  ctx.stroke();
  ctx.restore();

  txt(ctx, 'STROKE VOLUME', 20, y1 - 10, { color: '#6ef7ff', glow: 4 });
  txt(ctx, 'LVEDV (PRELOAD)', x1 - 10, H - 20, { color: '#6ef7ff', glow: 4, align: 'right' });

  // curves
  const curves = [
    { shift: 'inotropic', color: '#00ff88', scale: 1.25, label: '+inotropy' },
    { shift: 'normal',    color: '#6ef7ff', scale: 1.00, label: 'normal'    },
    { shift: 'failure',   color: '#ff4466', scale: 0.60, label: 'failure'   },
  ];

  for (const c of curves) {
    ctx.save();
    ctx.strokeStyle = c.color;
    ctx.lineWidth = c.shift === (cfg.shift || 'normal') ? 3 : 1.5;
    ctx.shadowColor = c.color;
    ctx.shadowBlur = c.shift === (cfg.shift || 'normal') ? 12 : 4;
    ctx.globalAlpha = c.shift === (cfg.shift || 'normal') ? 1 : 0.45;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const px = i / 100;
      // saturating curve: 1 - e^(-3x)
      const py = (1 - Math.exp(-3 * px)) * c.scale;
      const sx = x0 + px * plotW;
      const sy = y0 - py * plotH * 0.85;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.restore();

    txt(ctx, c.label, x1 - 10, y1 + 20 + curves.indexOf(c) * 18, { color: c.color, align: 'right', glow: 4 });
  }

  // operating point
  const active = curves.find(c => c.shift === (cfg.shift || 'normal'));
  const px = typeof cfg.point === 'number' ? cfg.point : 0.5 + 0.2 * Math.sin(t * 1.5);
  const py = (1 - Math.exp(-3 * px)) * active.scale;
  const sx = x0 + px * plotW;
  const sy = y0 - py * plotH * 0.85;
  glow(ctx, '#ffdd00', 20, () => {
    ctx.fillStyle = '#ffdd00';
    ctx.beginPath();
    ctx.arc(sx, sy, 7, 0, Math.PI * 2);
    ctx.fill();
  });

  if (cfg.label) txt(ctx, cfg.label, 20, 30, { color: '#6ef7ff', glow: 8, font: '16px "Courier New", monospace' });
}

/**
 * Blood vessel cross-section with pulsing lumen.
 * cfg: { radius, wall, label, eqLines: [...] }
 */
function drawVesselCrossSection(ctx, W, H, cfg, t) {
  bg(ctx, W, H);

  const cx = W / 2, cy = H / 2;
  const r  = (cfg.radius || 65);
  const wall = (cfg.wall || 12);
  const pulse = 1 + Math.sin(t * 2) * 0.04;

  // outer wall
  glow(ctx, '#ff6ef7', 12, () => {
    ctx.strokeStyle = '#ff6ef7';
    ctx.lineWidth = wall;
    ctx.beginPath();
    ctx.arc(cx, cy, r * pulse, 0, Math.PI * 2);
    ctx.stroke();
  });

  // lumen fill
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * pulse);
  grad.addColorStop(0, 'rgba(255, 30, 80, 0.55)');
  grad.addColorStop(1, 'rgba(255, 30, 80, 0.15)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, (r - wall / 2) * pulse, 0, Math.PI * 2);
  ctx.fill();

  // flow particles
  ctx.fillStyle = '#ffcc66';
  for (let i = 0; i < 12; i++) {
    const a = (t * 0.8 + i / 12) * Math.PI * 2;
    const rr = (r - wall) * 0.55 * (0.6 + 0.4 * ((i * 37) % 10) / 10);
    const px = cx + Math.cos(a) * rr;
    const py = cy + Math.sin(a) * rr;
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // radius indicator
  ctx.save();
  ctx.strokeStyle = 'rgba(110, 247, 255, 0.7)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(cx, cy); ctx.lineTo(cx + r * pulse, cy);
  ctx.stroke();
  ctx.restore();
  txt(ctx, `r`, cx + r / 2, cy - 6, { color: '#6ef7ff', glow: 4 });

  if (cfg.label) txt(ctx, cfg.label, 20, 30, { color: '#ff6ef7', glow: 8, font: '16px "Courier New", monospace' });

  const eqLines = cfg.eqLines || [];
  eqLines.forEach((line, i) => {
    txt(ctx, line, 20, H - 20 - (eqLines.length - 1 - i) * 22, {
      color: '#ffcc66', glow: 4, font: '14px "Courier New", monospace',
    });
  });
}

/**
 * Neuron action potential vs time, with phase markers.
 * cfg: { label, phase: 'rest'|'depol'|'repol'|'hyper', showEk, showEna }
 */
function drawActionPotential(ctx, W, H, cfg, t) {
  bg(ctx, W, H);

  const pad = 70;
  const x0 = pad, y0 = H - pad;
  const x1 = W - pad, y1 = pad;
  const plotW = x1 - x0, plotH = y0 - y1;

  // axes
  ctx.save();
  ctx.strokeStyle = '#6ef7ff';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#6ef7ff';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0);
  ctx.stroke();
  ctx.restore();

  txt(ctx, 'Vm (mV)', 20, y1 - 10, { color: '#6ef7ff', glow: 4 });
  txt(ctx, 'time (ms)', x1 - 10, H - 20, { color: '#6ef7ff', glow: 4, align: 'right' });

  // voltage -> y mapping: -90 mV bottom, +40 mV top
  const vmToY = (v) => y0 - ((v + 90) / 130) * plotH;

  // Ek and ENa reference lines
  if (cfg.showEk !== false) {
    ctx.save();
    ctx.strokeStyle = 'rgba(110, 247, 255, 0.5)';
    ctx.setLineDash([6, 4]);
    const y = vmToY(-90);
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    ctx.restore();
    txt(ctx, 'Ek ≈ -90', x1 - 10, vmToY(-90) - 4, { color: '#6ef7ff', align: 'right' });
  }
  if (cfg.showEna !== false) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 110, 247, 0.5)';
    ctx.setLineDash([6, 4]);
    const y = vmToY(60);
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    ctx.restore();
    txt(ctx, 'ENa ≈ +60', x1 - 10, vmToY(60) - 4, { color: '#ff6ef7', align: 'right' });
  }

  // AP waveform
  ctx.save();
  ctx.strokeStyle = '#ffdd00';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#ffdd00';
  ctx.shadowBlur = 12;
  ctx.beginPath();

  const period = 3.0; // sec per AP
  const phase = ((t % period) / period);
  for (let i = 0; i <= 200; i++) {
    const p = i / 200;
    let v = -70;
    if (p < 0.1)      v = -70 + (p / 0.1) * 10;              // small depol to threshold
    else if (p < 0.14) v = -60 + ((p - 0.1) / 0.04) * 95;    // upstroke to +35
    else if (p < 0.22) v = 35 - ((p - 0.14) / 0.08) * 95;    // repol to -60
    else if (p < 0.30) v = -60 - ((p - 0.22) / 0.08) * 20;   // hyperpol to -80
    else if (p < 0.40) v = -80 + ((p - 0.30) / 0.10) * 10;   // return
    else               v = -70;

    const sx = x0 + p * plotW;
    const sy = vmToY(v);
    if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
  }
  ctx.stroke();
  ctx.restore();

  // phase marker — where are we in the AP?
  const phaseMap = { rest: 0.05, depol: 0.12, repol: 0.18, hyper: 0.26 };
  const pp = phaseMap[cfg.phase] != null ? phaseMap[cfg.phase] : phase * 0.4;
  const sx = x0 + pp * plotW;
  glow(ctx, '#ff6ef7', 15, () => {
    ctx.strokeStyle = '#ff6ef7';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(sx, y1); ctx.lineTo(sx, y0); ctx.stroke();
    ctx.setLineDash([]);
  });

  if (cfg.label) txt(ctx, cfg.label, 20, 30, { color: '#ffdd00', glow: 8, font: '16px "Courier New", monospace' });
  if (cfg.phase)  txt(ctx, `phase: ${cfg.phase}`, W - 20, 30, { color: '#ff6ef7', align: 'right', glow: 6 });
}

// ─── pathophysiology primitives (added for Adv Phys & Pathophysiology course) ─
//
// These are intentionally generic: every question-specific detail lives in the
// cfg object, so one draw function can serve dozens of questions. The look
// matches the existing neon-medical aesthetic (cyan/magenta/yellow glow on
// near-black background).

/**
 * Phospholipid bilayer cross-section with optional integral proteins.
 * cfg: {
 *   label, sublabel,
 *   channels: [{ kind: 'na'|'k'|'ca'|'cl'|'pump'|'leak'|'aquaporin', label, x? }],
 *   highlight: 'na'|'k'|'ca'|'pump'|null   // glow one element
 * }
 */
function drawCellMembrane(ctx, W, H, cfg, t) {
  bg(ctx, W, H);

  const cx = W / 2;
  const topY    = H * 0.38;
  const botY    = H * 0.62;
  const lipidR  = 11;

  // ECF / ICF labels
  txt(ctx, 'EXTRACELLULAR', W - 20, topY - 30, { color: '#6ef7ff', align: 'right', glow: 6 });
  txt(ctx, 'INTRACELLULAR', W - 20, botY + 42, { color: '#ff6ef7', align: 'right', glow: 6 });

  // bilayer — two rows of phospholipids (heads + tails)
  const spacing = 24;
  const count = Math.floor(W / spacing) + 2;
  for (let row = 0; row < 2; row++) {
    const headY = row === 0 ? topY : botY;
    const tailY = row === 0 ? topY + lipidR + 12 : botY - lipidR - 12;
    for (let i = 0; i < count; i++) {
      const x = i * spacing;
      // tails
      ctx.strokeStyle = 'rgba(255, 220, 120, 0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 3, headY); ctx.lineTo(x - 3, tailY);
      ctx.moveTo(x + 3, headY); ctx.lineTo(x + 3, tailY);
      ctx.stroke();
      // head
      glow(ctx, '#ffdd66', 6, () => {
        ctx.fillStyle = '#ffdd66';
        ctx.beginPath();
        ctx.arc(x, headY, lipidR * 0.55, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  // faint central divider line (hydrophobic core)
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 220, 120, 0.18)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, (topY + botY) / 2); ctx.lineTo(W, (topY + botY) / 2);
  ctx.stroke();
  ctx.restore();

  // channels/pumps
  const channels = cfg.channels || [];
  const COLOR = {
    na:        '#ff6ef7',
    k:         '#6ef7ff',
    ca:        '#ffdd00',
    cl:        '#00ff88',
    pump:      '#ff8833',
    leak:      '#6effaa',
    aquaporin: '#66ccff',
  };
  const LABEL = {
    na: 'Na⁺', k: 'K⁺', ca: 'Ca²⁺', cl: 'Cl⁻',
    pump: 'Na⁺/K⁺ ATPase', leak: 'K⁺ leak', aquaporin: 'H₂O',
  };

  channels.forEach((ch, i) => {
    const x  = typeof ch.x === 'number' ? ch.x : (W * (i + 1) / (channels.length + 1));
    const col = COLOR[ch.kind] || '#ffffff';
    const isHi = cfg.highlight === ch.kind;
    const pulseB = isHi ? (20 + Math.sin(t * 4) * 6) : 10;

    glow(ctx, col, pulseB, () => {
      ctx.strokeStyle = col;
      ctx.lineWidth = isHi ? 3 : 2;
      // cylinder spanning bilayer
      const tx = x - 14;
      const rx = x + 14;
      ctx.beginPath();
      ctx.moveTo(tx, topY - lipidR);
      ctx.lineTo(tx, botY + lipidR);
      ctx.moveTo(rx, topY - lipidR);
      ctx.lineTo(rx, botY + lipidR);
      ctx.stroke();
      // top/bottom caps
      ctx.beginPath();
      ctx.ellipse(x, topY - lipidR, 14, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(x, botY + lipidR, 14, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
    });

    // animated ion flux arrows
    const flow = ((t * 1.2) % 1);
    const yA = topY + flow * (botY - topY);
    glow(ctx, col, isHi ? 14 : 8, () => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, yA, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    txt(ctx, ch.label || LABEL[ch.kind] || '?', x, botY + 62 + (i % 2) * 14, {
      color: col, align: 'center', glow: 4,
    });
  });

  if (cfg.label)    txt(ctx, cfg.label,    20, 30, { color: '#6ef7ff', glow: 8, font: '16px "Courier New", monospace' });
  if (cfg.sublabel) txt(ctx, cfg.sublabel, 20, 50, { color: '#ffdd66', glow: 4 });
}

/**
 * Paired-bar gradient chart of extracellular vs intracellular ion concentrations.
 * cfg: {
 *   label,
 *   ions: [{ name, ecf, icf, unit, highlight? }],   // values in mEq/L or mmol/L
 *   max?: number                                    // y-axis max, auto if absent
 * }
 */
function drawIonGradientBars(ctx, W, H, cfg, t) {
  bg(ctx, W, H);

  const ions = cfg.ions && cfg.ions.length ? cfg.ions : [
    { name: 'Na⁺', ecf: 142, icf: 14,  unit: 'mEq/L' },
    { name: 'K⁺',  ecf: 4.2, icf: 140, unit: 'mEq/L' },
    { name: 'Ca²⁺',ecf: 2.4, icf: 0.0001, unit: 'mEq/L' },
    { name: 'Cl⁻',ecf: 108, icf: 4,   unit: 'mEq/L' },
  ];

  const pad = 70;
  const x0 = pad, x1 = W - pad;
  const y0 = H - pad, y1 = pad + 10;
  const plotW = x1 - x0, plotH = y0 - y1;

  // axes
  ctx.save();
  ctx.strokeStyle = '#6ef7ff';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#6ef7ff';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0);
  ctx.stroke();
  ctx.restore();

  txt(ctx, 'CONCENTRATION', 20, y1 - 6, { color: '#6ef7ff', glow: 4 });

  // log-ish scaling: bars use sqrt(value) so Ca²⁺ still shows
  const maxVal = cfg.max || Math.max(...ions.flatMap(i => [i.ecf, i.icf]));
  const norm = v => Math.sqrt(Math.max(v, 0.0001) / maxVal);

  const groupW = plotW / ions.length;
  const barW   = groupW * 0.32;

  ions.forEach((ion, i) => {
    const gx = x0 + groupW * (i + 0.5);
    const ecfH = norm(ion.ecf) * plotH * 0.92;
    const icfH = norm(ion.icf) * plotH * 0.92;
    const hi = ion.highlight;

    // ECF bar (cyan)
    glow(ctx, '#6ef7ff', hi ? 18 : 8, () => {
      ctx.fillStyle = 'rgba(110, 247, 255, 0.75)';
      ctx.fillRect(gx - barW - 4, y0 - ecfH, barW, ecfH);
    });
    txt(ctx, String(ion.ecf), gx - barW / 2 - 4, y0 - ecfH - 6, {
      color: '#6ef7ff', align: 'center', glow: 3, font: '12px "Courier New", monospace',
    });

    // ICF bar (magenta)
    glow(ctx, '#ff6ef7', hi ? 18 : 8, () => {
      ctx.fillStyle = 'rgba(255, 110, 247, 0.75)';
      ctx.fillRect(gx + 4, y0 - icfH, barW, icfH);
    });
    txt(ctx, String(ion.icf), gx + barW / 2 + 4, y0 - icfH - 6, {
      color: '#ff6ef7', align: 'center', glow: 3, font: '12px "Courier New", monospace',
    });

    // ion label
    txt(ctx, ion.name, gx, y0 + 22, {
      color: hi ? '#ffdd00' : '#ffffff', align: 'center', glow: hi ? 10 : 4,
      font: '14px "Courier New", monospace',
    });
  });

  // legend
  txt(ctx, '■ ECF', x1 - 80, y1 + 14, { color: '#6ef7ff', glow: 4 });
  txt(ctx, '■ ICF', x1 - 80, y1 + 32, { color: '#ff6ef7', glow: 4 });

  if (cfg.label) txt(ctx, cfg.label, 20, 30, { color: '#ffdd00', glow: 8, font: '16px "Courier New", monospace' });
}

/**
 * Sarcomere cross-bridge cycle — Z-lines flanking actin+myosin.
 * cfg: { label, state: 'relaxed'|'contracted'|'cycle', tropomyosin: boolean }
 */
function drawSarcomere(ctx, W, H, cfg, t) {
  bg(ctx, W, H);

  const cy = H / 2;
  const state = cfg.state || 'cycle';

  // in 'cycle' mode sarcomere oscillates between relaxed and contracted
  let shrink = 0;
  if (state === 'relaxed')         shrink = 0;
  else if (state === 'contracted') shrink = 0.35;
  else                             shrink = 0.17 + Math.sin(t * 1.5) * 0.17;

  const fullW = W * 0.72;
  const sW    = fullW * (1 - shrink);
  const left  = W / 2 - sW / 2;
  const right = W / 2 + sW / 2;

  // Z-lines
  glow(ctx, '#6ef7ff', 12, () => {
    ctx.strokeStyle = '#6ef7ff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(left,  cy - 60); ctx.lineTo(left,  cy + 60);
    ctx.moveTo(right, cy - 60); ctx.lineTo(right, cy + 60);
    ctx.stroke();
  });
  txt(ctx, 'Z',  left - 8,  cy + 78, { color: '#6ef7ff', glow: 4 });
  txt(ctx, 'Z',  right + 2, cy + 78, { color: '#6ef7ff', glow: 4 });

  // thin (actin) filaments from each Z
  const actinLen = sW * 0.42;
  glow(ctx, '#00ff88', 8, () => {
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    for (let k = -2; k <= 2; k++) {
      if (k === 0) continue;
      const yy = cy + k * 10;
      ctx.beginPath();
      ctx.moveTo(left,  yy); ctx.lineTo(left + actinLen, yy);
      ctx.moveTo(right, yy); ctx.lineTo(right - actinLen, yy);
      ctx.stroke();
    }
  });

  // thick (myosin) filament — center, with cross-bridge heads
  const thickLen = sW * 0.48;
  const cxM = W / 2;
  glow(ctx, '#ff6ef7', 14, () => {
    ctx.strokeStyle = '#ff6ef7';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cxM - thickLen / 2, cy); ctx.lineTo(cxM + thickLen / 2, cy);
    ctx.stroke();
  });
  // heads (cross-bridges) oscillate
  ctx.save();
  ctx.strokeStyle = '#ff6ef7';
  ctx.shadowColor = '#ff6ef7';
  ctx.shadowBlur = 10;
  ctx.lineWidth = 2;
  const headOffsets = [-thickLen * 0.35, -thickLen * 0.1, thickLen * 0.1, thickLen * 0.35];
  headOffsets.forEach((ox, i) => {
    const ang = Math.sin(t * 3 + i) * 0.6;
    const hx = cxM + ox;
    const dx = Math.cos(ang) * 12;
    const dy = Math.sin(ang) * 12;
    ctx.beginPath();
    ctx.moveTo(hx, cy - 12); ctx.lineTo(hx + dx, cy - 12 - dy);
    ctx.moveTo(hx, cy + 12); ctx.lineTo(hx + dx, cy + 12 + dy);
    ctx.stroke();
  });
  ctx.restore();

  // M line
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 220, 120, 0.6)';
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(cxM, cy - 30); ctx.lineTo(cxM, cy + 30);
  ctx.stroke();
  ctx.restore();
  txt(ctx, 'M', cxM + 6, cy - 34, { color: '#ffdd66', glow: 4 });

  // I-band / A-band brackets
  txt(ctx, 'I', left + actinLen / 2 - 4, cy - 80, { color: '#00ff88', glow: 4 });
  txt(ctx, 'A', cxM - 4, cy - 100, { color: '#ff6ef7', glow: 6 });

  if (cfg.label) txt(ctx, cfg.label, 20, 30, { color: '#ff6ef7', glow: 8, font: '16px "Courier New", monospace' });
  txt(ctx, `state: ${state}`, W - 20, 30, { color: '#ffdd66', align: 'right', glow: 4 });
}

/**
 * Oxyhemoglobin dissociation curve with configurable shift.
 * cfg: { label, shift: 'right'|'left'|'normal', point? (0..100 PaO2) }
 */
function drawOxygenDissociation(ctx, W, H, cfg, t) {
  bg(ctx, W, H);

  const pad = 60;
  const x0 = pad, y0 = H - pad;
  const x1 = W - pad, y1 = pad;
  const plotW = x1 - x0, plotH = y0 - y1;

  // axes
  ctx.save();
  ctx.strokeStyle = '#6ef7ff';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#6ef7ff';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0);
  ctx.stroke();
  ctx.restore();

  txt(ctx, 'SaO₂ %', 20, y1 - 10, { color: '#6ef7ff', glow: 4 });
  txt(ctx, 'PaO₂ (mmHg)', x1 - 10, H - 20, { color: '#6ef7ff', glow: 4, align: 'right' });

  // sigmoidal: SaO2 = PaO2^n / (P50^n + PaO2^n)
  const shift = cfg.shift || 'normal';
  const P50 = shift === 'right' ? 35 : shift === 'left' ? 19 : 26.6;
  const n = 2.7;

  const curves = [
    { s: 'left',   color: '#66ccff', P50: 19   },
    { s: 'normal', color: '#00ff88', P50: 26.6 },
    { s: 'right',  color: '#ff4466', P50: 35   },
  ];

  curves.forEach(c => {
    const active = c.s === shift;
    ctx.save();
    ctx.strokeStyle = c.color;
    ctx.lineWidth = active ? 3 : 1.5;
    ctx.globalAlpha = active ? 1 : 0.35;
    ctx.shadowColor = c.color;
    ctx.shadowBlur = active ? 12 : 4;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const pO2 = (i / 200) * 100;
      const sat = Math.pow(pO2, n) / (Math.pow(c.P50, n) + Math.pow(pO2, n));
      const sx = x0 + (pO2 / 100) * plotW;
      const sy = y0 - sat * plotH * 0.95;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.restore();
    txt(ctx, c.s === 'normal' ? 'normal (P50=26.6)' : c.s + '-shift', x1 - 10,
        y1 + 18 + curves.indexOf(c) * 16,
        { color: c.color, align: 'right', glow: 4 });
  });

  // P50 marker
  const pO2Pt = typeof cfg.point === 'number' ? cfg.point
    : (P50 + Math.sin(t * 1.4) * 5);
  const sat = Math.pow(pO2Pt, n) / (Math.pow(P50, n) + Math.pow(pO2Pt, n));
  const sx = x0 + (pO2Pt / 100) * plotW;
  const sy = y0 - sat * plotH * 0.95;
  glow(ctx, '#ffdd00', 18, () => {
    ctx.fillStyle = '#ffdd00';
    ctx.beginPath();
    ctx.arc(sx, sy, 6, 0, Math.PI * 2);
    ctx.fill();
  });
  txt(ctx, `P50 = ${P50.toFixed(1)}`, sx + 10, sy - 6, { color: '#ffdd00', glow: 4 });

  if (cfg.label) txt(ctx, cfg.label, 20, 30, { color: '#6ef7ff', glow: 8, font: '16px "Courier New", monospace' });
}

/**
 * Stylized nephron with four segments. cfg: { label, highlight: 'pct'|'loop'|'dct'|'cd' }
 */
function drawNephronFlow(ctx, W, H, cfg, t) {
  bg(ctx, W, H);

  const cy = H / 2;
  const segY = cy;
  const startX = 80;
  const endX = W - 80;

  // glomerulus
  glow(ctx, '#ff6ef7', 14, () => {
    ctx.strokeStyle = '#ff6ef7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(startX, segY - 50, 26, 0, Math.PI * 2);
    ctx.stroke();
    // squiggly capillary tuft
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 6; a += 0.3) {
      const r = 18 + Math.sin(a * 3) * 4;
      const x = startX + Math.cos(a) * r;
      const y = segY - 50 + Math.sin(a) * r;
      if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });
  txt(ctx, 'Glomerulus', startX, segY - 90, { color: '#ff6ef7', align: 'center', glow: 6 });

  // segments
  const segs = [
    { key: 'pct',  label: 'PCT',  color: '#00ff88', x0: startX + 40,  x1: startX + 220, note: '65% Na⁺, H₂O, glucose, AA' },
    { key: 'loop', label: 'LoH',  color: '#6ef7ff', x0: startX + 220, x1: startX + 400, note: 'countercurrent; 25% Na⁺ (TAL)' },
    { key: 'dct',  label: 'DCT',  color: '#ffdd00', x0: startX + 400, x1: startX + 560, note: 'NCC, ~5% Na⁺' },
    { key: 'cd',   label: 'CD',   color: '#ff8833', x0: startX + 560, x1: endX,        note: 'ENaC + ADH (H₂O), aldosterone' },
  ];

  // tubule path: horizontal except loop (U-shape)
  ctx.save();
  ctx.lineWidth = 10;
  segs.forEach(s => {
    const hi = cfg.highlight === s.key;
    ctx.strokeStyle = s.color;
    ctx.globalAlpha = hi ? 1 : 0.55;
    ctx.shadowColor = s.color;
    ctx.shadowBlur  = hi ? 18 : 6;

    if (s.key === 'loop') {
      // descending, bottom, ascending
      const midX = (s.x0 + s.x1) / 2;
      const bottomY = segY + 70;
      ctx.beginPath();
      ctx.moveTo(s.x0, segY);
      ctx.lineTo(midX - 15, segY);
      ctx.lineTo(midX - 15, bottomY);
      ctx.lineTo(midX + 15, bottomY);
      ctx.lineTo(midX + 15, segY);
      ctx.lineTo(s.x1, segY);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(s.x0, segY); ctx.lineTo(s.x1, segY);
      ctx.stroke();
    }

    txt(ctx, s.label, (s.x0 + s.x1) / 2, segY - 20, {
      color: s.color, align: 'center', glow: hi ? 10 : 4,
      font: '14px "Courier New", monospace',
    });
    txt(ctx, s.note, (s.x0 + s.x1) / 2, segY + 110, {
      color: s.color, align: 'center', glow: 2, font: '11px "Courier New", monospace',
    });
  });
  ctx.restore();

  // filtrate flow particles
  const segFor = (x) => {
    for (const s of segs) if (x >= s.x0 && x <= s.x1) return s;
    return segs[0];
  };
  for (let i = 0; i < 8; i++) {
    const frac = ((t * 0.18 + i / 8) % 1);
    const x = startX + 40 + frac * (endX - startX - 40);
    const s = segFor(x);
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(x, segY, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (cfg.label) txt(ctx, cfg.label, 20, 30, { color: '#ffdd00', glow: 8, font: '16px "Courier New", monospace' });
}

/**
 * Capillary Starling forces diagram.
 * cfg: { label, Pc, piC, Pif, piIf, net } - values in mmHg (strings ok)
 */
function drawStarlingForces(ctx, W, H, cfg, t) {
  bg(ctx, W, H);

  const cy = H / 2;
  const capX0 = W * 0.18;
  const capX1 = W * 0.82;
  const capR  = 38;

  // capillary tube
  glow(ctx, '#ff6ef7', 14, () => {
    ctx.strokeStyle = '#ff6ef7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(capX0, cy - capR); ctx.lineTo(capX1, cy - capR);
    ctx.moveTo(capX0, cy + capR); ctx.lineTo(capX1, cy + capR);
    // caps
    ctx.ellipse(capX0, cy, 14, capR, 0, 0, Math.PI * 2);
    ctx.ellipse(capX1, cy, 14, capR, 0, 0, Math.PI * 2);
    ctx.stroke();
  });

  // lumen fill
  const grad = ctx.createLinearGradient(capX0, 0, capX1, 0);
  grad.addColorStop(0, 'rgba(255, 30, 80, 0.35)');
  grad.addColorStop(1, 'rgba(255, 30, 80, 0.12)');
  ctx.fillStyle = grad;
  ctx.fillRect(capX0, cy - capR + 1, capX1 - capX0, capR * 2 - 2);

  // flow particles inside
  for (let i = 0; i < 10; i++) {
    const frac = ((t * 0.4 + i / 10) % 1);
    const x = capX0 + 10 + frac * (capX1 - capX0 - 20);
    const y = cy - capR + 6 + (i * 7) % (capR * 2 - 12);
    ctx.fillStyle = '#ffcc66';
    ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
  }

  // force arrows + labels
  const forces = [
    { label: 'Pc',  val: cfg.Pc   ?? '+32',  color: '#ff6ef7', up: false, x: capX0 + (capX1 - capX0) * 0.25 },
    { label: 'πc',  val: cfg.piC  ?? '−25',  color: '#6ef7ff', up: true,  x: capX0 + (capX1 - capX0) * 0.5  },
    { label: 'Pif', val: cfg.Pif  ?? '−3',   color: '#ffdd66', up: true,  x: capX0 + (capX1 - capX0) * 0.75 },
    { label: 'πif', val: cfg.piIf ?? '+8',   color: '#00ff88', up: false, x: capX0 + (capX1 - capX0) * 0.9  },
  ];

  forces.forEach(f => {
    const yA = f.up ? cy - capR - 6 : cy + capR + 6;
    const yB = f.up ? cy - capR - 46 : cy + capR + 46;
    glow(ctx, f.color, 8, () => {
      ctx.strokeStyle = f.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(f.x, yA); ctx.lineTo(f.x, yB);
      // arrowhead
      const sign = f.up ? 1 : -1;
      ctx.moveTo(f.x - 6, yB + 8 * sign); ctx.lineTo(f.x, yB);
      ctx.lineTo(f.x + 6, yB + 8 * sign);
      ctx.stroke();
    });
    const lblY = f.up ? yB - 8 : yB + 16;
    txt(ctx, `${f.label}=${f.val}`, f.x, lblY, {
      color: f.color, align: 'center', glow: 4,
      font: '12px "Courier New", monospace',
    });
  });

  // net filtration line
  if (cfg.net != null) {
    txt(ctx, `NET: ${cfg.net} mmHg`, W / 2, H - 24, {
      color: '#ffdd00', align: 'center', glow: 10,
      font: '14px "Courier New", monospace',
    });
  }

  if (cfg.label) txt(ctx, cfg.label, 20, 30, { color: '#ff6ef7', glow: 8, font: '16px "Courier New", monospace' });
}

/**
 * Generic feedback loop diagram — boxes + arrows. Best for baroreflex / RAAS.
 * cfg: { label, nodes: [{ id, label, x, y }], edges: [{ from, to, sign:'+'|'-', label? }], kind: 'negative'|'positive' }
 */
function drawFeedbackLoop(ctx, W, H, cfg, t) {
  bg(ctx, W, H);

  const nodes = cfg.nodes || [
    { id: 'stim',  label: '↓ MAP',          x: W * 0.14, y: H * 0.5 },
    { id: 'sens',  label: 'Baroreceptors',  x: W * 0.38, y: H * 0.5 },
    { id: 'ctrl',  label: 'Vasomotor Ctr', x: W * 0.62, y: H * 0.5 },
    { id: 'eff',   label: '↑ SNS\nHR·Contractility·SVR',  x: W * 0.86, y: H * 0.5 },
  ];
  const edges = cfg.edges || [
    { from: 'stim', to: 'sens', sign: '+' },
    { from: 'sens', to: 'ctrl', sign: '+' },
    { from: 'ctrl', to: 'eff',  sign: '+' },
    { from: 'eff',  to: 'stim', sign: cfg.kind === 'positive' ? '+' : '-' },
  ];

  const isPos = cfg.kind === 'positive';
  const accent = isPos ? '#ff4466' : '#6ef7ff';

  const byId = {};
  nodes.forEach(n => byId[n.id] = n);

  // draw edges first
  edges.forEach(e => {
    const a = byId[e.from], b = byId[e.to];
    if (!a || !b) return;
    const col = e.sign === '-' ? '#6ef7ff' : '#ff6ef7';

    ctx.save();
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.shadowColor = col;
    ctx.shadowBlur = 8;

    // if both nodes on the same row, curve upward for the feedback return arrow
    const sameRow = Math.abs(a.y - b.y) < 2;
    ctx.beginPath();
    if (sameRow && e.from === 'eff' && e.to === 'stim') {
      // big arch below
      const midX = (a.x + b.x) / 2;
      const archY = a.y + 95;
      ctx.moveTo(a.x - 40, a.y + 20);
      ctx.quadraticCurveTo(midX, archY, b.x + 40, b.y + 20);
      // arrowhead
      ctx.moveTo(b.x + 40, b.y + 20);
      ctx.lineTo(b.x + 50, b.y + 14);
      ctx.moveTo(b.x + 40, b.y + 20);
      ctx.lineTo(b.x + 52, b.y + 26);
    } else {
      ctx.moveTo(a.x + 50, a.y);
      ctx.lineTo(b.x - 50, b.y);
      // arrowhead
      ctx.lineTo(b.x - 60, b.y - 6);
      ctx.moveTo(b.x - 50, b.y);
      ctx.lineTo(b.x - 60, b.y + 6);
    }
    ctx.stroke();
    ctx.restore();

    // sign badge
    const mx = (a.x + b.x) / 2;
    const my = sameRow && e.from === 'eff' ? a.y + 95 : a.y - 14;
    glow(ctx, col, 10, () => {
      ctx.fillStyle = '#050710';
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mx, my, 10, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    });
    txt(ctx, e.sign, mx, my + 4, { color: col, align: 'center', glow: 4, font: 'bold 14px "Courier New", monospace' });
  });

  // draw nodes
  nodes.forEach(n => {
    const lines = n.label.split('\n');
    const boxW = Math.max(...lines.map(l => l.length)) * 7 + 20;
    const boxH = 26 + (lines.length - 1) * 14;
    glow(ctx, accent, 10, () => {
      ctx.fillStyle = 'rgba(10, 15, 28, 0.85)';
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(n.x - boxW / 2, n.y - boxH / 2, boxW, boxH);
      ctx.fill(); ctx.stroke();
    });
    lines.forEach((line, i) => {
      txt(ctx, line, n.x, n.y - boxH / 2 + 16 + i * 14, {
        color: accent, align: 'center', glow: 4, font: '12px "Courier New", monospace',
      });
    });
  });

  if (cfg.label) txt(ctx, cfg.label, 20, 30, { color: accent, glow: 8, font: '16px "Courier New", monospace' });
  txt(ctx, isPos ? 'positive feedback' : 'negative feedback', W - 20, 30, {
    color: accent, align: 'right', glow: 4,
  });
}

/**
 * Left-ventricular pressure-volume loop.
 * cfg: { label, state: 'normal'|'hf'|'aortic_stenosis'|'mr'|'ar' }
 */
function drawPvLoop(ctx, W, H, cfg, t) {
  bg(ctx, W, H);

  const pad = 60;
  const x0 = pad, y0 = H - pad;
  const x1 = W - pad, y1 = pad;
  const plotW = x1 - x0, plotH = y0 - y1;

  // axes
  ctx.save();
  ctx.strokeStyle = '#6ef7ff';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#6ef7ff';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0);
  ctx.stroke();
  ctx.restore();

  txt(ctx, 'LV PRESSURE (mmHg)', 20, y1 - 10, { color: '#6ef7ff', glow: 4 });
  txt(ctx, 'LV VOLUME (mL)',     x1 - 10, H - 20, { color: '#6ef7ff', glow: 4, align: 'right' });

  // mapping 0..200 mL → x, 0..200 mmHg → y
  const vToX = v => x0 + (v / 200) * plotW;
  const pToY = p => y0 - (p / 200) * plotH * 0.95;

  const state = cfg.state || 'normal';
  // corners for each state: (EDV, ESV, peak systolic P, diastolic fill endpoint P)
  const config = {
    normal:           { edv: 130, esv: 55, sysP: 120, diaP: 8,  color: '#00ff88' },
    hf:               { edv: 170, esv: 110,sysP: 105, diaP: 20, color: '#ff4466' },
    aortic_stenosis:  { edv: 125, esv: 60, sysP: 200, diaP: 12, color: '#ff8833' },
    mr:               { edv: 160, esv: 60, sysP: 115, diaP: 12, color: '#ff6ef7' },
    ar:               { edv: 180, esv: 70, sysP: 140, diaP: 15, color: '#ffdd00' },
  };
  const c = config[state] || config.normal;

  // Four phases:
  //   A (esv, diaP low) — filling → B (edv, diaP)
  //   B                  — isovolumic contraction → C (edv, sysP diastole open aortic)
  //   C                  — ejection → D (esv, sysP)
  //   D                  — isovolumic relaxation → A

  const A = { v: c.esv, p: 5 };
  const B = { v: c.edv, p: c.diaP };
  const C = { v: c.edv, p: c.sysP };
  const D = { v: c.esv, p: c.sysP * 0.6 };

  ctx.save();
  ctx.strokeStyle = c.color;
  ctx.lineWidth = 3;
  ctx.shadowColor = c.color;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  // filling (A→B): curve up along EDPVR
  ctx.moveTo(vToX(A.v), pToY(A.p));
  for (let i = 1; i <= 20; i++) {
    const frac = i / 20;
    const vv = A.v + frac * (B.v - A.v);
    // nonlinear compliance: p rises gently
    const pp = A.p + Math.pow(frac, 2.2) * (B.p - A.p);
    ctx.lineTo(vToX(vv), pToY(pp));
  }
  // isovolumic contraction B→C
  ctx.lineTo(vToX(C.v), pToY(C.p));
  // ejection C→D: curve
  for (let i = 1; i <= 20; i++) {
    const frac = i / 20;
    const vv = C.v + frac * (D.v - C.v);
    const pp = C.p + frac * (D.p - C.p);
    ctx.lineTo(vToX(vv), pToY(pp));
  }
  // isovolumic relaxation D→A
  ctx.lineTo(vToX(A.v), pToY(A.p));
  ctx.stroke();
  ctx.restore();

  // label corners
  txt(ctx, 'EDV', vToX(B.v), pToY(B.p) + 14, { color: c.color, align: 'center', glow: 3 });
  txt(ctx, 'ESV', vToX(A.v), pToY(A.p) + 14, { color: c.color, align: 'center', glow: 3 });

  // moving dot to animate loop
  const phase = (t * 0.9) % 1;
  let dotV, dotP;
  if (phase < 0.35) {
    const f = phase / 0.35;
    dotV = A.v + f * (B.v - A.v);
    dotP = A.p + Math.pow(f, 2.2) * (B.p - A.p);
  } else if (phase < 0.4) {
    const f = (phase - 0.35) / 0.05;
    dotV = B.v;
    dotP = B.p + f * (C.p - B.p);
  } else if (phase < 0.9) {
    const f = (phase - 0.4) / 0.5;
    dotV = C.v + f * (D.v - C.v);
    dotP = C.p + f * (D.p - C.p);
  } else {
    const f = (phase - 0.9) / 0.1;
    dotV = A.v;
    dotP = D.p + f * (A.p - D.p);
  }
  glow(ctx, '#ffdd00', 18, () => {
    ctx.fillStyle = '#ffdd00';
    ctx.beginPath();
    ctx.arc(vToX(dotV), pToY(dotP), 6, 0, Math.PI * 2);
    ctx.fill();
  });

  const SV = (c.edv - c.esv);
  txt(ctx, `SV = ${SV} mL   state: ${state}`, 20, H - 20, {
    color: c.color, glow: 4, font: '13px "Courier New", monospace',
  });
  if (cfg.label) txt(ctx, cfg.label, 20, 30, { color: c.color, glow: 8, font: '16px "Courier New", monospace' });
}

/**
 * Decompensated shock positive-feedback spiral.
 * cfg: { label, stage: 'nonprogressive'|'progressive'|'irreversible' }
 */
function drawShockSpiral(ctx, W, H, cfg, t) {
  bg(ctx, W, H);

  const cx = W / 2, cy = H / 2;
  const stage = cfg.stage || 'progressive';

  // concentric spiral that darkens inward
  const col = stage === 'irreversible' ? '#ff0044'
            : stage === 'progressive'  ? '#ff6644'
            : '#ffdd00';
  ctx.save();
  ctx.strokeStyle = col;
  ctx.lineWidth = 2;
  ctx.shadowColor = col;
  ctx.shadowBlur = 14;
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 8; a += 0.08) {
    const r = 140 - a * 6;
    if (r < 10) break;
    const x = cx + Math.cos(a + t * 0.6) * r;
    const y = cy + Math.sin(a + t * 0.6) * r;
    if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  // positive-feedback labels around the loop
  const labels = [
    { text: '↓ CO',            ang: 0              },
    { text: '↓ tissue O₂',     ang: Math.PI * 0.33 },
    { text: 'myocardial\ndepression',  ang: Math.PI * 0.66 },
    { text: 'acidosis + cap leak', ang: Math.PI      },
    { text: '↓ venous\nreturn',    ang: Math.PI * 1.33 },
    { text: '↓↓ preload',      ang: Math.PI * 1.66 },
  ];
  labels.forEach((L, i) => {
    const r = 170;
    const x = cx + Math.cos(L.ang) * r * 1.15;
    const y = cy + Math.sin(L.ang) * r * 0.7;
    L.text.split('\n').forEach((line, j) => {
      txt(ctx, line, x, y + j * 13, { color: col, align: 'center', glow: 6, font: '12px "Courier New", monospace' });
    });
  });

  // central stage indicator
  glow(ctx, col, 20, () => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(cx, cy, 14 + Math.sin(t * 3) * 4, 0, Math.PI * 2);
    ctx.fill();
  });
  txt(ctx, 'SHOCK', cx, cy + 4, { color: '#050710', align: 'center', font: 'bold 11px "Courier New", monospace' });
  txt(ctx, stage.toUpperCase(), cx, cy + 36, { color: col, align: 'center', glow: 6, font: '13px "Courier New", monospace' });

  if (cfg.label) txt(ctx, cfg.label, 20, 30, { color: col, glow: 8, font: '16px "Courier New", monospace' });
}

// ─── chemistry / physics primitives ─────────────────────────────────────────

/**
 * Gas law piston — Boyle's / Charles visual. Piston slides left/right.
 * cfg: { label, law: 'boyle'|'charles', animate: true }
 */
function drawGasPiston(ctx, W, H, cfg, t) {
  bg(ctx, W, H);

  const cy = H / 2;
  const cylX0 = W * 0.12, cylX1 = W * 0.88;
  const cylH = 80;
  const law = cfg.law || 'boyle';

  // piston position oscillates
  const frac = law === 'charles'
    ? 0.45 + Math.sin(t * 1.2) * 0.25   // volume grows with T
    : 0.55 + Math.sin(t * 1.5) * 0.25;  // Boyle inverse
  const pistonX = cylX0 + (cylX1 - cylX0) * frac;

  // cylinder outline
  ctx.save();
  ctx.strokeStyle = '#6ef7ff';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#6ef7ff';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.rect(cylX0, cy - cylH / 2, cylX1 - cylX0, cylH);
  ctx.stroke();
  ctx.restore();

  // gas fill (left of piston)
  const gasGrad = ctx.createLinearGradient(cylX0, 0, pistonX, 0);
  gasGrad.addColorStop(0, 'rgba(110, 247, 255, 0.25)');
  gasGrad.addColorStop(1, 'rgba(255, 110, 247, 0.15)');
  ctx.fillStyle = gasGrad;
  ctx.fillRect(cylX0 + 2, cy - cylH / 2 + 2, pistonX - cylX0 - 2, cylH - 4);

  // gas particles
  for (let i = 0; i < 14; i++) {
    const px = cylX0 + 10 + Math.random() * (pistonX - cylX0 - 20);
    const py = cy - cylH / 2 + 8 + Math.random() * (cylH - 16);
    const speed = 1 + Math.sin(t * 4 + i) * 0.5;
    ctx.fillStyle = `rgba(255, 220, 100, ${0.5 + speed * 0.15})`;
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // piston head
  glow(ctx, '#ff6ef7', 10, () => {
    ctx.fillStyle = '#ff6ef7';
    ctx.fillRect(pistonX - 4, cy - cylH / 2 + 2, 8, cylH - 4);
  });
  // piston rod
  ctx.strokeStyle = '#ff6ef7';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(pistonX, cy);
  ctx.lineTo(cylX1 + 20, cy);
  ctx.stroke();

  // labels
  const vol = Math.round(frac * 100);
  txt(ctx, `V = ${vol}%`, cylX0 + (pistonX - cylX0) / 2, cy + cylH / 2 + 25, {
    color: '#6ef7ff', align: 'center', glow: 4,
  });

  if (law === 'boyle') {
    txt(ctx, `P ∝ 1/V (T const)`, W / 2, cy - cylH / 2 - 18, {
      color: '#ff6ef7', align: 'center', glow: 6,
    });
  } else {
    txt(ctx, `V ∝ T (P const)`, W / 2, cy - cylH / 2 - 18, {
      color: '#ffdd00', align: 'center', glow: 6,
    });
  }

  if (cfg.label) txt(ctx, cfg.label, 20, 30, { color: '#6ef7ff', glow: 8, font: '16px "Courier New", monospace' });
}

/**
 * IV drip / syringe calculator visual — shows bag, rate, concentration.
 * cfg: { label, drug, concentration, dose, rate, unit }
 */
function drawIvDripCalc(ctx, W, H, cfg, t) {
  bg(ctx, W, H);

  const cx = W / 2, cy = H / 2;

  // IV bag outline (left side)
  const bagX = W * 0.18, bagY = H * 0.15, bagW = 90, bagH = 120;
  glow(ctx, '#6ef7ff', 10, () => {
    ctx.strokeStyle = '#6ef7ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // bag shape
    ctx.moveTo(bagX, bagY + 10);
    ctx.lineTo(bagX, bagY + bagH);
    ctx.lineTo(bagX + bagW, bagY + bagH);
    ctx.lineTo(bagX + bagW, bagY + 10);
    ctx.quadraticCurveTo(bagX + bagW / 2, bagY - 8, bagX, bagY + 10);
    ctx.stroke();
    // tubing
    ctx.beginPath();
    ctx.moveTo(bagX + bagW / 2, bagY + bagH);
    ctx.lineTo(bagX + bagW / 2, bagY + bagH + 60);
    ctx.stroke();
  });

  // fluid fill inside bag
  const fillH = bagH * (0.5 + Math.sin(t * 0.3) * 0.15);
  ctx.fillStyle = 'rgba(110, 247, 255, 0.2)';
  ctx.fillRect(bagX + 2, bagY + bagH - fillH, bagW - 4, fillH - 2);

  // drip animation
  const dripY = bagY + bagH + 10 + ((t * 80) % 50);
  ctx.fillStyle = '#6ef7ff';
  ctx.beginPath();
  ctx.ellipse(bagX + bagW / 2, dripY, 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3-step framework boxes (right side)
  const steps = [
    { n: '1', title: 'CONCENTRATION', detail: cfg.concentration || 'drug ÷ volume' },
    { n: '2', title: 'DOSE', detail: cfg.dose || 'rate × weight' },
    { n: '3', title: 'RATE (mL/hr)', detail: cfg.rate || 'dose ÷ conc × 60' },
  ];
  const stepX = W * 0.42, stepW = W * 0.52;
  steps.forEach((s, i) => {
    const sy = H * 0.15 + i * 85;
    const col = ['#6ef7ff', '#ff6ef7', '#ffdd00'][i];
    glow(ctx, col, 8, () => {
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(stepX, sy, stepW, 65);
      ctx.stroke();
    });
    txt(ctx, `Step ${s.n}: ${s.title}`, stepX + 10, sy + 20, {
      color: col, glow: 4, font: 'bold 13px "Courier New", monospace',
    });
    txt(ctx, s.detail, stepX + 10, sy + 44, {
      color: '#ffffff', glow: 2, font: '12px "Courier New", monospace',
    });
  });

  // drug label on bag
  txt(ctx, cfg.drug || 'DRUG', bagX + bagW / 2, bagY + bagH / 2, {
    color: '#ffdd00', align: 'center', glow: 6, font: 'bold 14px "Courier New", monospace',
  });

  if (cfg.label) txt(ctx, cfg.label, 20, 30, { color: '#ffdd00', glow: 8, font: '16px "Courier New", monospace' });
}

/**
 * Pressure depth diagram — vertical column with depth markers.
 * cfg: { label, fluid: 'water'|'mercury'|'blood', depths: [{m, label}] }
 */
function drawPressureDepth(ctx, W, H, cfg, t) {
  bg(ctx, W, H);

  const colX = W * 0.35, colW = 100;
  const topY = 50, botY = H - 50;
  const colH = botY - topY;
  const fluid = cfg.fluid || 'water';
  const col = fluid === 'mercury' ? '#ff6ef7' : fluid === 'blood' ? '#ff4466' : '#6ef7ff';

  // column outline
  glow(ctx, col, 8, () => {
    ctx.strokeStyle = col;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.rect(colX, topY, colW, colH);
    ctx.stroke();
  });

  // fluid gradient fill
  const grad = ctx.createLinearGradient(0, topY, 0, botY);
  grad.addColorStop(0, `${col}15`);
  grad.addColorStop(1, `${col}55`);
  ctx.fillStyle = grad;
  ctx.fillRect(colX + 2, topY + 2, colW - 4, colH - 4);

  // atmospheric arrow at top
  glow(ctx, '#ffdd00', 6, () => {
    ctx.strokeStyle = '#ffdd00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(colX + colW / 2, topY - 30);
    ctx.lineTo(colX + colW / 2, topY);
    ctx.moveTo(colX + colW / 2 - 8, topY - 8);
    ctx.lineTo(colX + colW / 2, topY);
    ctx.lineTo(colX + colW / 2 + 8, topY - 8);
    ctx.stroke();
  });
  txt(ctx, 'Patm', colX + colW / 2, topY - 36, { color: '#ffdd00', align: 'center', glow: 4 });

  // depth markers
  const depths = cfg.depths || [
    { m: 0.25, label: 'P = ρgh (low)' },
    { m: 0.75, label: 'P = ρgh (high)' },
  ];
  depths.forEach(d => {
    const y = topY + colH * d.m;
    ctx.save();
    ctx.strokeStyle = '#ffdd00';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(colX, y);
    ctx.lineTo(colX + colW + 100, y);
    ctx.stroke();
    ctx.restore();
    txt(ctx, d.label, colX + colW + 110, y + 4, { color: '#ffdd00', glow: 4 });
  });

  // P = ρgh equation
  txt(ctx, 'P = ρ × g × h', W * 0.65, botY - 20, {
    color: col, align: 'center', glow: 6, font: '16px "Courier New", monospace',
  });

  if (cfg.label) txt(ctx, cfg.label, 20, 30, { color: col, glow: 8, font: '16px "Courier New", monospace' });
}

// ─── registry ───────────────────────────────────────────────────────────────

export const SCENE_REGISTRY = {
  patient:              drawPatient,
  ecg_waveform:         drawEcgWaveform,
  frank_starling:       drawFrankStarling,
  vessel_cross_section: drawVesselCrossSection,
  action_potential:     drawActionPotential,
  // pathophysiology primitives
  cell_membrane:        drawCellMembrane,
  ion_gradient_bars:    drawIonGradientBars,
  sarcomere:            drawSarcomere,
  oxygen_dissociation:  drawOxygenDissociation,
  nephron_flow:         drawNephronFlow,
  starling_forces:      drawStarlingForces,
  feedback_loop:        drawFeedbackLoop,
  pv_loop:              drawPvLoop,
  shock_spiral:         drawShockSpiral,
  // chemistry & physics primitives
  gas_piston:           drawGasPiston,
  iv_drip_calc:         drawIvDripCalc,
  pressure_depth:       drawPressureDepth,
};

export const SCENE_KINDS = Object.keys(SCENE_REGISTRY);

// ─── window exposure (for gameUI.js and non-module callers) ─────────────────

if (typeof window !== 'undefined') {
  window.SCENE_REGISTRY = SCENE_REGISTRY;
  window.SCENE_KINDS    = SCENE_KINDS;
  window.runScene       = runScene;
  window.stopActiveScene = stopActiveScene;
}
