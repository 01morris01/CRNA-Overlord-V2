/**
 * Basic Pharmacologic Principles themed scene renderer — Chapter 3
 * Draws pharmacology-themed diagrams to #scn canvas
 * Aesthetic: dark neon medical arcade matching the rest of the app
 */

let _sceneRafId = null;
let _sceneTime  = 0;
let _sceneData  = null;

// Maps question topic keywords → visual category
const TOPIC_MAP = {
  // Pharmacokinetics
  pharmacokinetics: 'pk', 'front-end': 'pk', 'back-end': 'pk',
  'effect-site': 'pk', biophase: 'pk', 'dynamic range': 'pk',
  'context-sensitive': 'pk', 'half-time': 'pk',
  // Elimination / kinetics
  'first-order': 'kinetics', 'zero-order': 'kinetics', clearance: 'kinetics',
  'half-life': 'kinetics', auc: 'kinetics', elimination: 'kinetics',
  bioavailability: 'kinetics', 'first-pass': 'kinetics',
  // Distribution / compartments
  'volume of distribution': 'distribution', 'central compartment': 'distribution',
  'peripheral compartment': 'distribution', 'steady-state': 'distribution',
  'compartment': 'distribution', lipophilic: 'distribution', hydrophilic: 'distribution',
  // Metabolism
  'phase i': 'metabolism', 'phase ii': 'metabolism', 'hepatic': 'metabolism',
  'oxidation': 'metabolism', 'conjugation': 'metabolism', metabolism: 'metabolism',
  'biliary': 'metabolism', 'activated charcoal': 'metabolism',
  // Renal / excretion
  'renal': 'renal', 'glomerular': 'renal', 'tubular': 'renal', kidney: 'renal',
  // Receptors / pharmacodynamics
  pharmacodynamics: 'receptors', receptor: 'receptors', affinity: 'receptors',
  agonist: 'receptors', antagonist: 'receptors', 'intrinsic activity': 'receptors',
  'up-regulation': 'receptors', 'down-regulation': 'receptors',
  'ligand-gated': 'receptors', 'ion channel': 'receptors',
  tachyphylaxis: 'receptors', synerg: 'receptors', additive: 'receptors',
};

function _getCategory(q) {
  const haystack = ((q.metadata?.topic || '') + ' ' + (q.prompt || '')).toLowerCase();
  for (const [kw, cat] of Object.entries(TOPIC_MAP)) {
    if (haystack.includes(kw)) return cat;
  }
  return 'default';
}

// ─── Drawing helpers ──────────────────────────────────────────────────────────

function _clear(ctx, W, H) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0a0a12';
  ctx.fillRect(0, 0, W, H);
}

function _grid(ctx, W, H, t) {
  ctx.save();
  ctx.strokeStyle = `rgba(80,120,200,${0.06 + 0.02 * Math.sin(t * 0.3)})`;
  ctx.lineWidth = 1;
  const spacing = 32;
  for (let x = 0; x < W; x += spacing) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += spacing) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.restore();
}

function _label(ctx, text, x, y, size, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha ?? 1;
  ctx.font = `${size}px monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y);
  ctx.restore();
}

// ─── Category scenes ──────────────────────────────────────────────────────────

function _drawPK(ctx, W, H, t) {
  // Animated biexponential decay curve (concentration vs time)
  const cx = W / 2, cy = H / 2;
  const colors = ['#00e5ff', '#ff6e40'];

  ctx.save();
  // Axes
  ctx.strokeStyle = 'rgba(0,229,255,0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 90, cy + 60); ctx.lineTo(cx + 90, cy + 60); // x-axis
  ctx.moveTo(cx - 90, cy + 60); ctx.lineTo(cx - 90, cy - 70); // y-axis
  ctx.stroke();

  // Curve
  ctx.strokeStyle = colors[0];
  ctx.lineWidth = 2;
  ctx.shadowColor = colors[0];
  ctx.shadowBlur = 8;
  ctx.beginPath();
  for (let i = 0; i <= 80; i++) {
    const x = cx - 90 + i * 2.25;
    const tNorm = i / 80;
    const y = cy + 60 - 120 * (0.6 * Math.exp(-5 * tNorm) + 0.4 * Math.exp(-0.8 * tNorm));
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Animated point
  const pct = (Math.sin(t * 0.5) + 1) / 2;
  const px = cx - 90 + pct * 180;
  const ptNorm = pct;
  const py = cy + 60 - 120 * (0.6 * Math.exp(-5 * ptNorm) + 0.4 * Math.exp(-0.8 * ptNorm));
  ctx.fillStyle = colors[1];
  ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();

  _label(ctx, 'C(t)', cx - 90, cy - 75, 9, colors[0], 0.8);
  _label(ctx, 'Time', cx + 95, cy + 63, 9, colors[0], 0.8);
  _label(ctx, 'PK CURVE', cx, cy - 85, 9, '#ffaa00', 0.7);
  ctx.restore();
}

function _drawKinetics(ctx, W, H, t) {
  // Half-life decay bars
  const cx = W / 2, cy = H / 2 + 10;
  const barW = 22, gap = 8;
  const halves = [1, 0.5, 0.25, 0.125, 0.0625, 0.03125];
  const colors = ['#00e5ff', '#00bcd4', '#26c6da', '#4dd0e1', '#80deea', '#b2ebf2'];

  ctx.save();
  halves.forEach((fraction, i) => {
    const x = cx - (halves.length / 2) * (barW + gap) + i * (barW + gap);
    const maxH = 90;
    const bH = maxH * fraction;
    const pulse = 0.85 + 0.15 * Math.sin(t * 1.2 + i * 0.8);
    ctx.fillStyle = colors[i];
    ctx.globalAlpha = pulse;
    ctx.fillRect(x, cy + 10 - bH, barW, bH);
    _label(ctx, `t${i + 1}`, x + barW / 2, cy + 22, 8, '#ccc', 0.7);
  });
  ctx.globalAlpha = 1;
  _label(ctx, 'HALF-LIFE DECAY', cx, cy - 88, 9, '#ffaa00', 0.75);
  ctx.restore();
}

function _drawDistribution(ctx, W, H, t) {
  // Two-compartment diagram: central + peripheral
  const cx = W / 2, cy = H / 2;

  ctx.save();
  // Central box
  const pulse1 = 0.7 + 0.3 * Math.sin(t * 0.8);
  ctx.strokeStyle = `rgba(0,229,255,${pulse1})`;
  ctx.lineWidth = 2;
  ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 10;
  ctx.strokeRect(cx - 80, cy - 35, 60, 50);
  _label(ctx, 'CENTRAL', cx - 50, cy - 10, 8, '#00e5ff', 0.9);
  _label(ctx, '~10% body', cx - 50, cy + 5, 7, '#4af', 0.7);
  ctx.shadowBlur = 0;

  // Peripheral box
  const pulse2 = 0.7 + 0.3 * Math.sin(t * 0.8 + Math.PI);
  ctx.strokeStyle = `rgba(255,170,0,${pulse2})`;
  ctx.shadowColor = '#ffaa00'; ctx.shadowBlur = 10;
  ctx.strokeRect(cx + 20, cy - 35, 60, 50);
  _label(ctx, 'PERIPH.', cx + 50, cy - 10, 8, '#ffaa00', 0.9);
  _label(ctx, 'fat/muscle', cx + 50, cy + 5, 7, '#fa8', 0.7);
  ctx.shadowBlur = 0;

  // Arrow between compartments
  const arrowAlpha = 0.5 + 0.5 * Math.sin(t * 1.2);
  ctx.strokeStyle = `rgba(180,255,100,${arrowAlpha})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx - 20, cy - 15); ctx.lineTo(cx + 20, cy - 15); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 20, cy + 5);  ctx.lineTo(cx + 20, cy + 5);  ctx.stroke();

  _label(ctx, '⇌', cx, cy - 12, 14, '#b4ff64', arrowAlpha);
  _label(ctx, 'COMPARTMENTS', cx, cy - 60, 9, '#ffaa00', 0.75);
  ctx.restore();
}

function _drawMetabolism(ctx, W, H, t) {
  // Liver hexagon + enzyme cycle
  const cx = W / 2, cy = H / 2 + 5;
  const r = 38;
  const pulse = 0.7 + 0.3 * Math.sin(t * 0.9);

  ctx.save();
  // Hexagon
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = `rgba(0,255,150,${pulse})`;
  ctx.lineWidth = 2;
  ctx.shadowColor = '#00ff96'; ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;

  _label(ctx, 'LIVER', cx, cy + 5, 10, '#00ff96', 0.9);

  // Rotating orbital
  const angle = t * 1.2;
  const ox = cx + (r + 14) * Math.cos(angle);
  const oy = cy + (r + 14) * Math.sin(angle);
  ctx.fillStyle = '#ff6e40';
  ctx.beginPath(); ctx.arc(ox, oy, 5, 0, Math.PI * 2); ctx.fill();

  _label(ctx, 'Ph I / Ph II', cx, cy - 62, 9, '#ffaa00', 0.75);
  _label(ctx, 'CYP450', cx, cy - 50, 8, '#00ff96', 0.65);
  ctx.restore();
}

function _drawRenal(ctx, W, H, t) {
  // Kidney outline (two ovals) + filtration arrows
  const cx = W / 2, cy = H / 2 + 5;

  ctx.save();
  const pulse = 0.6 + 0.4 * Math.sin(t * 0.9);

  // Left kidney
  ctx.strokeStyle = `rgba(255,110,64,${pulse})`;
  ctx.lineWidth = 2;
  ctx.shadowColor = '#ff6e40'; ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.ellipse(cx - 30, cy, 18, 30, -0.2, 0, Math.PI * 2);
  ctx.stroke();

  // Right kidney
  ctx.beginPath();
  ctx.ellipse(cx + 30, cy, 18, 30, 0.2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Filtration drop
  const dropY = cy - 28 + ((t * 30) % 56);
  ctx.fillStyle = `rgba(0,229,255,${0.8 + 0.2 * Math.sin(t * 2)})`;
  ctx.beginPath();
  ctx.arc(cx, dropY, 4, 0, Math.PI * 2); ctx.fill();

  _label(ctx, 'RENAL EXCRETION', cx, cy - 55, 9, '#ffaa00', 0.75);
  _label(ctx, 'GFR / tubular', cx, cy + 48, 8, '#ff6e40', 0.7);
  ctx.restore();
}

function _drawReceptors(ctx, W, H, t) {
  // Receptor lock-and-key animation
  const cx = W / 2, cy = H / 2 + 5;

  ctx.save();
  // Receptor (membrane channel)
  const pulse = 0.7 + 0.3 * Math.sin(t * 0.7);
  ctx.strokeStyle = `rgba(200,100,255,${pulse})`;
  ctx.lineWidth = 2;
  ctx.shadowColor = '#c864ff'; ctx.shadowBlur = 10;
  // Left pillar
  ctx.strokeRect(cx - 28, cy - 30, 14, 50);
  // Right pillar
  ctx.strokeRect(cx + 14, cy - 30, 14, 50);
  ctx.shadowBlur = 0;

  // Ligand bouncing
  const ligandX = cx + Math.sin(t * 1.5) * 35;
  const ligandY = cy - 40 + Math.cos(t * 0.9) * 10;
  ctx.fillStyle = '#ffaa00';
  ctx.beginPath(); ctx.arc(ligandX, ligandY, 7, 0, Math.PI * 2); ctx.fill();
  _label(ctx, 'L', ligandX, ligandY + 4, 9, '#000', 1);

  _label(ctx, 'RECEPTOR', cx, cy - 52, 9, '#ffaa00', 0.75);
  _label(ctx, 'affinity · Ia', cx, cy + 34, 8, '#c864ff', 0.7);
  ctx.restore();
}

function _drawDefault(ctx, W, H, t) {
  // Animated molecular orbits (generic pharmacology symbol)
  const cx = W / 2, cy = H / 2;
  const colors = ['#00e5ff', '#ff6e40', '#b4ff64'];

  ctx.save();
  colors.forEach((c, i) => {
    const r = 28 + i * 14;
    const speed = 0.6 + i * 0.3;
    const angle = t * speed + (i * Math.PI * 2) / 3;
    const ox = cx + r * Math.cos(angle);
    const oy = cy + r * Math.sin(angle);
    ctx.strokeStyle = `rgba(${c === '#00e5ff' ? '0,229,255' : c === '#ff6e40' ? '255,110,64' : '180,255,100'},0.25)`;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.arc(ox, oy, 5, 0, Math.PI * 2); ctx.fill();
  });
  // Nucleus
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
  _label(ctx, 'Rx', cx, cy + 4, 8, '#0a0a12', 1);
  _label(ctx, 'PHARMACOLOGY', cx, cy - 75, 9, '#ffaa00', 0.7);
  ctx.restore();
}

// ─── Dispatch ─────────────────────────────────────────────────────────────────

const DRAWERS = {
  pk:           _drawPK,
  kinetics:     _drawKinetics,
  distribution: _drawDistribution,
  metabolism:   _drawMetabolism,
  renal:        _drawRenal,
  receptors:    _drawReceptors,
  default:      _drawDefault,
};

// ─── Public API ───────────────────────────────────────────────────────────────

export function renderBasicPharmacologicPrinciplesScene(q) {
  const canvas = document.getElementById('scn');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  _sceneData = { category: _getCategory(q) };

  if (_sceneRafId) cancelAnimationFrame(_sceneRafId);
  _sceneTime = 0;

  const draw = (ts) => {
    _sceneTime = ts / 1000;
    _clear(ctx, W, H);
    _grid(ctx, W, H, _sceneTime);
    const fn = DRAWERS[_sceneData?.category] || DRAWERS.default;
    fn(ctx, W, H, _sceneTime);
    _sceneRafId = requestAnimationFrame(draw);
  };

  _sceneRafId = requestAnimationFrame(draw);
}

export function stopBasicPharmacologicPrinciplesScene() {
  if (_sceneRafId) {
    cancelAnimationFrame(_sceneRafId);
    _sceneRafId = null;
  }
  _sceneData = null;
}

// ─── Global registration (for dynamic dispatch via window[cfg.sceneRendererName]) ──
window.renderBasicPharmacologicPrinciplesScene = renderBasicPharmacologicPrinciplesScene;
window.stopBasicPharmacologicPrinciplesScene   = stopBasicPharmacologicPrinciplesScene;
