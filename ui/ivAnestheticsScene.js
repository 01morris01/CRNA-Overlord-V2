/**
 * IV Anesthetics themed scene renderer — Chapter 8
 * Draws pharmacology-themed diagrams to #scn canvas
 * Aesthetic: dark neon medical arcade matching the rest of the app
 */

let _sceneRafId = null;
let _sceneTime  = 0;
let _sceneData  = null;

// Maps question topic keywords → visual category
const TOPIC_MAP = {
  gaba: 'gaba', chloride: 'gaba', receptor: 'gaba', inhibitory: 'gaba',
  barbiturate: 'barb', thiopental: 'barb', methohexital: 'barb', burst: 'barb',
  propofol: 'propofol', diisopropyl: 'propofol', emulsion: 'propofol', soybean: 'propofol',
  ketamine: 'ketamine', nmda: 'ketamine', dissociat: 'ketamine', arylcyclohex: 'ketamine',
  etomidate: 'etomidate', adrenocortical: 'etomidate', myoclonus: 'etomidate',
  dexmedetomidine: 'dex', alpha: 'dex', sympatholytic: 'dex',
  benzodiazepine: 'benzo', midazolam: 'benzo', lorazepam: 'benzo', diazepam: 'benzo', flumazenil: 'benzo',
  droperidol: 'droperidol', butyrophenone: 'droperidol', qtc: 'droperidol',
};

function getCategory(q) {
  const topic = (q.metadata?.topicId || q.metadata?.topic || '').toLowerCase();
  const text  = (q.q || '').toLowerCase();
  for (const [key, cat] of Object.entries(TOPIC_MAP)) {
    if (topic.includes(key) || text.includes(key)) return cat;
  }
  return 'default';
}

export function renderIVAnestheticsScene(q) {
  const canvas = document.getElementById('scn');
  if (!canvas) return;

  _sceneData = { q, category: getCategory(q) };
  _sceneTime = 0;

  if (_sceneRafId) { cancelAnimationFrame(_sceneRafId); _sceneRafId = null; }

  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  function tick() {
    _sceneRafId = requestAnimationFrame(tick);
    _sceneTime += 0.016;
    _drawScene(ctx, W, H, _sceneData, _sceneTime);
  }
  tick();
}

export function stopIVAnestheticsScene() {
  if (_sceneRafId) { cancelAnimationFrame(_sceneRafId); _sceneRafId = null; }
}

// ─── draw dispatcher ─────────────────────────────────────────────────────────

function _drawScene(ctx, W, H, data, t) {
  switch (data.category) {
    case 'gaba':      _sceneGABA(ctx, W, H, data.q, t);       break;
    case 'barb':      _sceneBarbiturate(ctx, W, H, data.q, t); break;
    case 'propofol':  _scenePropofol(ctx, W, H, data.q, t);   break;
    case 'ketamine':  _sceneKetamine(ctx, W, H, data.q, t);   break;
    case 'etomidate': _sceneEtomidate(ctx, W, H, data.q, t);  break;
    case 'dex':       _sceneDex(ctx, W, H, data.q, t);        break;
    case 'benzo':     _sceneBenzo(ctx, W, H, data.q, t);      break;
    case 'droperidol':_sceneDroperidol(ctx, W, H, data.q, t); break;
    default:          _sceneOR(ctx, W, H, data.q, t);         break;
  }
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function _bg(ctx, W, H, color) {
  ctx.fillStyle = color || '#020510';
  ctx.fillRect(0, 0, W, H);
}

function _txt(ctx, s, x, y, color, size, align) {
  ctx.save();
  ctx.fillStyle = color || '#fff';
  ctx.font = `bold ${size || 10}px "Courier New",monospace`;
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
  ctx.restore();
}

function _glow(ctx, color, blur) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur || 10;
}

function _arrow(ctx, x1, y1, x2, y2, color, w) {
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color;
  ctx.lineWidth = w || 1.5;
  _glow(ctx, color, 6);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const a = Math.atan2(y2 - y1, x2 - x1), h = 7;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - h * Math.cos(a - Math.PI / 6), y2 - h * Math.sin(a - Math.PI / 6));
  ctx.lineTo(x2 - h * Math.cos(a + Math.PI / 6), y2 - h * Math.sin(a + Math.PI / 6));
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

// ─── SCENE: GABA receptor / chloride channel ─────────────────────────────────

function _sceneGABA(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#010818');
  const cx = W / 2, cy = H / 2;

  // Membrane
  ctx.fillStyle = 'rgba(0,80,60,.4)';
  ctx.fillRect(0, cy - 48, W, 24);
  ctx.fillRect(0, cy + 24, W, 24);
  _txt(ctx, 'PHOSPHOLIPID BILAYER', W * .82, cy - 36, '#00aa66', 7);

  // GABA receptor — 5 subunits arranged in ring
  const pulse = 1 + .08 * Math.sin(t * 2.2);
  const radii = [22, 22, 22, 22, 22];
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const rx = cx + 28 * Math.cos(angle);
    const ry = cy + 28 * Math.sin(angle);
    ctx.save();
    ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 2;
    _glow(ctx, '#00cc66', 10 * pulse);
    ctx.beginPath(); ctx.arc(rx, ry, radii[i] * .4, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  _txt(ctx, 'GABA-A', cx, cy, '#00ff88', 9);
  _txt(ctx, '5 SUBUNITS', cx, cy + 14, '#00cc66', 7);

  // Cl- channel pore
  ctx.save();
  ctx.strokeStyle = '#44aaff'; ctx.lineWidth = 1.5;
  _glow(ctx, '#4488ff', 8);
  ctx.beginPath(); ctx.moveTo(cx, cy - 48); ctx.lineTo(cx, cy + 48); ctx.stroke();
  ctx.restore();
  _txt(ctx, 'Cl⁻', cx + 14, cy - 20, '#4488ff', 10);
  _txt(ctx, '→', cx, cy - 4, '#4488ff', 12);

  // GABA molecules floating in
  const gx1 = cx - 90 + 50 * Math.abs(Math.sin(t * .7));
  const gx2 = cx + 90 - 50 * Math.abs(Math.sin(t * .7 + 1));
  [gx1, gx2].forEach(gx => {
    ctx.save();
    ctx.fillStyle = 'rgba(0,255,100,.8)';
    _glow(ctx, '#00ff88', 10);
    ctx.beginPath(); ctx.arc(gx, cy - 80, 8, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    _txt(ctx, 'GABA', gx, cy - 96, '#00ff88', 7);
  });

  _txt(ctx, 'GABA-A RECEPTOR — Cl⁻ CHANNEL', cx, 16, '#00ff88', 10);
  _txt(ctx, '↑ Cl⁻ influx → hyperpolarization → ↓ excitability', cx, H - 10, '#44aaff', 8);
}

// ─── SCENE: Barbiturate / EEG burst suppression ───────────────────────────────

function _sceneBarbiturate(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#060414');
  const cx = W / 2;

  // EEG header
  _txt(ctx, 'BARBITURATE — EEG EFFECT', cx, 16, '#ffaa00', 10);

  // EEG waveform — alternating burst / suppression
  const wY = H * .38;
  const phase = (t * .5) % (Math.PI * 2);
  const isBurst = Math.sin(phase * 2) > 0;

  ctx.save();
  ctx.strokeStyle = isBurst ? '#ff8800' : '#335';
  ctx.lineWidth = 1.8;
  _glow(ctx, isBurst ? '#ff6600' : '#222', isBurst ? 8 : 2);
  ctx.beginPath();
  for (let x = 20; x < W - 20; x++) {
    const xn = (x - 20) / (W - 40);
    const burstRegion = Math.sin(xn * Math.PI * 6 + t * 8);
    const amp = isBurst ? 18 * burstRegion : 1.5 * Math.sin(xn * Math.PI * 60 + t * 2);
    const y = wY + amp;
    x === 20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  _txt(ctx, isBurst ? '⚡ BURST' : '— SUPPRESSION —', cx, wY - 26, isBurst ? '#ff8800' : '#4444aa', 9);

  // Redistribution diagram (vessel-rich → fat)
  const diagramY = H * .64;
  const organs = [
    { label: 'BRAIN/HEART', color: '#ff4488', x: cx - 90, pct: .9 },
    { label: 'MUSCLE', color: '#ffaa00', x: cx, pct: .5 },
    { label: 'FAT', color: '#88aaff', x: cx + 90, pct: .15 },
  ];

  _txt(ctx, 'REDISTRIBUTION (terminates effect)', cx, diagramY - 28, '#888', 8);
  organs.forEach((o, i) => {
    const barH = 40 * o.pct * (1 + .04 * Math.sin(t * 1.5 + i));
    ctx.save();
    ctx.fillStyle = o.color; _glow(ctx, o.color, 5);
    ctx.globalAlpha = 0.75;
    ctx.fillRect(o.x - 18, diagramY - barH, 36, barH);
    ctx.restore();
    _txt(ctx, o.label, o.x, diagramY + 12, o.color, 7);
  });

  // Arrows showing redistribution direction
  _arrow(ctx, cx - 66, diagramY - 18, cx - 22, diagramY - 10, '#ffaa00', 1.5);
  _arrow(ctx, cx + 22, diagramY - 10, cx + 66, diagramY - 6, '#88aaff', 1.5);

  _txt(ctx, '⚠ Acidosis / ↓ protein → ↑ free drug', cx, H - 10, '#ff6666', 8);
}

// ─── SCENE: Propofol / lipid emulsion ────────────────────────────────────────

function _scenePropofol(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020c08');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'PROPOFOL — 2,6-DIISOPROPYLPHENOL', cx, 16, '#00ff88', 10);

  // Milky emulsion droplets floating
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 + t * .4;
    const r = 52 + 12 * Math.sin(t * .8 + i);
    const dx = cx + r * Math.cos(angle);
    const dy = cy - 12 + r * .4 * Math.sin(angle);
    const size = 4 + 3 * Math.abs(Math.sin(t * .6 + i));
    ctx.save();
    ctx.fillStyle = `rgba(240,240,255,${.35 + .2 * Math.abs(Math.sin(t + i))})`;
    _glow(ctx, '#aaddff', 5);
    ctx.beginPath(); ctx.arc(dx, dy, size, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // Central molecule label
  ctx.save();
  ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 1.5;
  _glow(ctx, '#00cc66', 12);
  ctx.beginPath(); ctx.arc(cx, cy - 12, 26, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  _txt(ctx, '⬡', cx, cy - 12, '#00ff88', 22);
  _txt(ctx, 'PROPOFOL', cx, cy - 12, '#001a00', 7);

  // Key stats panel
  const stats = [
    { txt: 'Clearance: 10× thiopental', c: '#00ff88' },
    { txt: 'Duration: 3–8 min', c: '#ffaa00' },
    { txt: '↓ CMRO₂  ↓ ICP  ↓ IOP', c: '#4488ff' },
    { txt: '↓ BP via vasodilation', c: '#ff6688' },
    { txt: 'Discard vial after 6 hrs', c: '#ff8800' },
  ];
  stats.forEach((s, i) => {
    _txt(ctx, s.txt, cx, H * .68 + i * 16, s.c, 8);
  });

  // Extrahepatic clearance diagram
  _txt(ctx, 'EXTRAHEPATIC: Kidney + Small Intestine + Lungs = 40%', cx, H - 10, '#888', 7);
}

// ─── SCENE: Ketamine / NMDA dissociation ─────────────────────────────────────

function _sceneKetamine(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#080410');
  const cx = W / 2;

  _txt(ctx, 'KETAMINE — DISSOCIATIVE ANESTHESIA', cx, 16, '#ff88ff', 10);

  // Two brain regions drifting apart
  const drift = 28 + 18 * Math.abs(Math.sin(t * .5));

  // Thalamus (left)
  ctx.save();
  ctx.strokeStyle = '#ff44aa'; ctx.lineWidth = 2;
  _glow(ctx, '#ff00aa', 12);
  ctx.beginPath(); ctx.ellipse(cx - drift, H * .35, 36, 26, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  _txt(ctx, 'THALAMUS', cx - drift, H * .35, '#ff44aa', 8);

  // Limbic cortex (right)
  ctx.save();
  ctx.strokeStyle = '#aa44ff'; ctx.lineWidth = 2;
  _glow(ctx, '#8800ff', 12);
  ctx.beginPath(); ctx.ellipse(cx + drift, H * .35, 36, 26, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  _txt(ctx, 'LIMBIC', cx + drift, H * .30, '#aa44ff', 8);
  _txt(ctx, 'CORTEX', cx + drift, H * .40, '#aa44ff', 8);

  // Disconnection symbol
  const gapAlpha = .4 + .6 * Math.abs(Math.sin(t * 1.5));
  ctx.save();
  ctx.strokeStyle = `rgba(255,68,68,${gapAlpha})`; ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(cx - drift + 36, H * .35); ctx.lineTo(cx + drift - 36, H * .35);
  ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  _txt(ctx, '✕ DISCONNECTED', cx, H * .35, '#ff4444', 8);

  // Clinical effects
  const efx = [
    { t: '↑ HR  ↑ BP  ↑ CO', c: '#ff8844' },
    { t: 'Bronchodilation', c: '#00ff88' },
    { t: 'Spontaneous respirations preserved', c: '#44aaff' },
    { t: 'NMDA antagonist — analgesia', c: '#ffaa00' },
    { t: 'Potentiates NMBAs', c: '#ff6666' },
  ];
  efx.forEach((e, i) => {
    _txt(ctx, e.t, cx, H * .58 + i * 18, e.c, 8);
  });

  _txt(ctx, 'IV: 1–2 mg/kg  |  IM: 4–6 mg/kg  |  Metabolized via N-demethylation', cx, H - 10, '#666', 7);
}

// ─── SCENE: Etomidate / adrenal suppression ───────────────────────────────────

function _sceneEtomidate(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#04080c');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'ETOMIDATE — CARDIAC SPARING INDUCTION', cx, 16, '#4488ff', 10);

  // Adrenal gland schematic
  const adY = cy - 10;
  ctx.save();
  ctx.strokeStyle = '#ff8800'; ctx.lineWidth = 2;
  _glow(ctx, '#ff6600', 10);
  ctx.beginPath();
  ctx.moveTo(cx - 30, adY - 18);
  ctx.bezierCurveTo(cx - 30, adY - 36, cx + 30, adY - 36, cx + 30, adY - 18);
  ctx.bezierCurveTo(cx + 38, adY, cx + 20, adY + 24, cx, adY + 24);
  ctx.bezierCurveTo(cx - 20, adY + 24, cx - 38, adY, cx - 30, adY - 18);
  ctx.closePath();
  ctx.fillStyle = 'rgba(180,80,0,.25)'; ctx.fill(); ctx.stroke();
  ctx.restore();
  _txt(ctx, 'ADRENAL CORTEX', cx, adY - 2, '#ff8800', 9);

  // Blocked enzyme arrow
  const supPulse = .5 + .5 * Math.abs(Math.sin(t * 1.8));
  ctx.save();
  ctx.strokeStyle = `rgba(255,0,0,${supPulse})`; ctx.lineWidth = 2.5;
  ctx.setLineDash([6, 3]);
  ctx.beginPath(); ctx.moveTo(cx + 60, adY - 20); ctx.lineTo(cx + 32, adY - 5); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
  _txt(ctx, '✕', cx + 64, adY - 28, '#ff2222', 14);
  _txt(ctx, '11β-hydroxylase', cx + 90, adY - 40, '#ff4444', 7, 'right');
  _txt(ctx, 'blocked 4–8 hrs', cx + 90, adY - 28, '#ff6666', 7, 'right');

  // Heart — stable
  const hb = 1 + .04 * Math.abs(Math.sin(t * 2.4));
  ctx.save();
  ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 2;
  _glow(ctx, '#00cc66', 10 * hb);
  ctx.beginPath();
  ctx.moveTo(cx - 90, cy - 14);
  ctx.bezierCurveTo(cx - 90, cy - 32, cx - 72, cy - 32, cx - 72, cy - 14);
  ctx.bezierCurveTo(cx - 72, cy - 32, cx - 54, cy - 32, cx - 54, cy - 14);
  ctx.bezierCurveTo(cx - 54, cy + 4, cx - 72, cy + 20, cx - 72, cy + 24);
  ctx.bezierCurveTo(cx - 72, cy + 20, cx - 90, cy + 4, cx - 90, cy - 14);
  ctx.stroke();
  ctx.restore();
  _txt(ctx, '❤', cx - 72, cy + 4, '#00ff88', 16);
  _txt(ctx, 'CO MAINTAINED', cx - 72, cy + 36, '#00ff88', 7);

  _txt(ctx, 'PONV ↑  |  Myoclonus ↑  |  Propylene glycol solvent', cx, H - 10, '#888', 7);
}

// ─── SCENE: Dexmedetomidine / α2 ─────────────────────────────────────────────

function _sceneDex(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#030812');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'DEXMEDETOMIDINE — α2 AGONIST', cx, 16, '#44ddff', 10);

  // Sympathetic chain schematic
  const chainX = cx - 80;
  const nodeY  = [H * .30, H * .45, H * .60];
  nodeY.forEach((ny, i) => {
    ctx.save();
    ctx.strokeStyle = `rgba(80,80,200,${.5 + .3 * Math.abs(Math.sin(t * .8 + i))})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(chainX, ny, 10, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    _txt(ctx, 'α2', chainX, ny, '#44aaff', 8);
    if (i < 2) {
      ctx.save(); ctx.strokeStyle = '#335'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(chainX, ny + 10); ctx.lineTo(chainX, nodeY[i + 1] - 10); ctx.stroke();
      ctx.restore();
    }
  });
  _txt(ctx, 'SYMPATHETIC', chainX - 2, H * .70, '#335588', 7);
  _txt(ctx, 'CHAIN ⊣', chainX - 2, H * .76, '#44aaff', 7);

  // Effects panel
  const efx = [
    { t: 'Anxiolysis + Sedation', c: '#00ff88' },
    { t: 'Analgesia (opioid-sparing)', c: '#ffaa00' },
    { t: '↓ HR  ↓ BP  (sympatholytic)', c: '#ff6666' },
    { t: 'Transient ↑ BP (peripheral α2)', c: '#ff8844' },
    { t: 'No respiratory depression', c: '#44aaff' },
    { t: 'Seizure foci NOT suppressed', c: '#ff44ff' },
  ];
  efx.forEach((e, i) => {
    _txt(ctx, e.t, cx + 30, H * .28 + i * 18, e.c, 8, 'left');
  });

  // Bradycardia warning
  const warn = .4 + .6 * Math.abs(Math.sin(t * 2.5));
  _txt(ctx, `⚠ Bradycardia / Heart block / Asystole risk`, cx, H * .78, `rgba(255,68,68,${warn})`, 8);
  _txt(ctx, '⚠ Hypovolemia + MAP < 70 = major risk', cx, H * .85, '#ff8800', 8);

  _txt(ctx, 'Hepatic: N-methylation + Hydroxylation + Conjugation', cx, H - 10, '#555', 7);
}

// ─── SCENE: Benzodiazepines ───────────────────────────────────────────────────

function _sceneBenzo(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#060410');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'BENZODIAZEPINES — GABA-A MODULATOR', cx, 16, '#8888ff', 10);

  // Benzene ring (structural motif)
  const rr = 28;
  for (let i = 0; i < 6; i++) {
    const a1 = (i / 6) * Math.PI * 2, a2 = ((i + 1) / 6) * Math.PI * 2;
    ctx.save();
    ctx.strokeStyle = '#8888ff'; ctx.lineWidth = 2;
    _glow(ctx, '#6666ff', 8 + 4 * Math.sin(t + i));
    ctx.beginPath();
    ctx.moveTo(cx + rr * Math.cos(a1), cy - 30 + rr * Math.sin(a1));
    ctx.lineTo(cx + rr * Math.cos(a2), cy - 30 + rr * Math.sin(a2));
    ctx.stroke();
    ctx.restore();
  }
  _txt(ctx, 'BENZENE', cx, cy - 30, '#6644cc', 8);
  _txt(ctx, 'RING', cx, cy - 18, '#6644cc', 8);

  // Properties list
  const props = [
    { t: 'Hypnotic  •  Sedative', c: '#aa88ff' },
    { t: 'Anxiolytic  •  Amnesic', c: '#8888ff' },
    { t: 'Anticonvulsant', c: '#66aaff' },
    { t: '↓ Muscle tone (central)', c: '#44aaff' },
    { t: 'NO direct analgesia', c: '#ff6666' },
  ];
  props.forEach((p, i) => {
    _txt(ctx, p.t, cx, H * .56 + i * 16, p.c, 8);
  });

  // Half-life bar
  const benzos = [
    { n: 'Midazolam', hl: 2,  c: '#00ff88' },
    { n: 'Lorazepam', hl: 15, c: '#ffaa00' },
    { n: 'Diazepam',  hl: 30, c: '#ff6688' },
  ];
  const bY = H * .43, bMaxW = 90;
  _txt(ctx, 'Elimination t½ (hrs)', cx, bY - 16, '#555', 7);
  benzos.forEach((b, i) => {
    const bx = cx - 50;
    const bh = 10, by = bY + i * 14;
    const bw = (b.hl / 30) * bMaxW;
    ctx.save(); ctx.fillStyle = b.c; _glow(ctx, b.c, 4);
    ctx.fillRect(bx, by - bh / 2, bw, bh);
    ctx.restore();
    _txt(ctx, `${b.n} (${b.hl}h)`, bx + bMaxW + 4, by, b.c, 7, 'left');
  });

  _txt(ctx, 'Reversal: Flumazenil 0.2 mg q2–10 min (max 1 mg)', cx, H - 10, '#888', 7);
}

// ─── SCENE: Droperidol / QTc ─────────────────────────────────────────────────

function _sceneDroperidol(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#080204');
  const cx = W / 2;

  _txt(ctx, 'DROPERIDOL — BUTYROPHENONE', cx, 16, '#ffaa44', 10);

  // ECG / QTc waveform
  const eY = H * .38;
  ctx.save();
  ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 1.8;
  _glow(ctx, '#00cc66', 6);
  ctx.beginPath();
  const ecgPoints = [
    [0, 0], [.1, 0], [.12, -6], [.14, 0],
    [.28, 0], [.32, -28], [.36, 22], [.40, -8], [.44, 0],
    [.58, 0], [.62, 8], [.66, 14], [.70, 8], [.74, 0],   // T wave (prolonged QTc)
    [.9, 0], [1, 0],
  ];
  ecgPoints.forEach(([xn, yn], i) => {
    const px = 20 + xn * (W - 40), py = eY + yn;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  });
  ctx.stroke();
  ctx.restore();

  // QTc bracket
  const qStart = 20 + .28 * (W - 40), qEnd = 20 + .74 * (W - 40);
  ctx.save(); ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 1.5;
  _glow(ctx, '#ff2222', 8 * (.5 + .5 * Math.abs(Math.sin(t * 2))));
  ctx.beginPath();
  ctx.moveTo(qStart, eY + 30); ctx.lineTo(qStart, eY + 38);
  ctx.lineTo(qEnd,   eY + 38); ctx.lineTo(qEnd, eY + 30);
  ctx.stroke(); ctx.restore();
  _txt(ctx, '⚠ QTc PROLONGED', (qStart + qEnd) / 2, eY + 50, '#ff4444', 8);

  // Drug info
  const info = [
    { t: 'D2 antagonist — antidopaminergic', c: '#ffaa00' },
    { t: 'Antiemetic via CTZ (medulla)', c: '#00ff88' },
    { t: 'Also blocks: 5-HT, NE, GABA', c: '#88aaff' },
    { t: '⚠ Contraindicated in Parkinson\'s', c: '#ff6666' },
    { t: 'Black box: 12-lead ECG if >1.25 mg', c: '#ff4444' },
  ];
  info.forEach((s, i) => {
    _txt(ctx, s.t, cx, H * .64 + i * 17, s.c, 8);
  });

  _txt(ctx, 'Derivative of phenothiazines  |  Extrapyramidal effects possible', cx, H - 10, '#555', 7);
}

// ─── SCENE: default OR ───────────────────────────────────────────────────────

function _sceneOR(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020510');
  const cx = W / 2, cy = H / 2;

  // OR table
  ctx.save();
  ctx.fillStyle = 'rgba(25,55,80,.85)';
  ctx.fillRect(cx - 105, cy + 18, 210, 14);
  ctx.strokeStyle = '#336688'; ctx.lineWidth = 1;
  ctx.strokeRect(cx - 105, cy + 18, 210, 14);
  ctx.restore();

  // Patient
  ctx.save();
  ctx.fillStyle = '#ddaa88';
  ctx.beginPath(); ctx.arc(cx, cy - 24, 15, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#5588aa';
  ctx.fillRect(cx - 22, cy - 8, 44, 24);
  ctx.fillStyle = '#ddaa88';
  ctx.fillRect(cx - 36, cy - 6, 12, 18);
  ctx.fillRect(cx + 24, cy - 6, 12, 18);
  ctx.restore();

  // IV line
  ctx.save();
  ctx.strokeStyle = '#88aacc'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 2]);
  ctx.beginPath(); ctx.moveTo(cx + 36, cy + 4); ctx.lineTo(cx + 82, cy - 12); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // IV bag
  const bagX = cx + 86, bagY = cy - 34;
  const drip = Math.abs(Math.sin(t * 2)) * 4;
  ctx.save();
  ctx.fillStyle = 'rgba(100,180,255,.28)'; ctx.strokeStyle = '#88aacc'; ctx.lineWidth = 1;
  ctx.fillRect(bagX - 13, bagY - 18 - drip, 26, 22 + drip);
  ctx.strokeRect(bagX - 13, bagY - 18 - drip, 26, 22 + drip);
  ctx.restore();
  _txt(ctx, '💊', bagX, bagY - 6, '#fff', 11);
  _txt(ctx, 'IV AGENT', bagX, bagY + 12, '#4488ff', 7);

  // Info panel
  ctx.save();
  ctx.fillStyle = 'rgba(4,8,24,.85)'; ctx.strokeStyle = 'rgba(80,100,200,.3)'; ctx.lineWidth = 1;
  ctx.fillRect(8, 8, 162, 52); ctx.strokeRect(8, 8, 162, 52);
  ctx.restore();
  _txt(ctx, '📚 BASICS OF ANESTHESIA', 89, 22, '#ffaa00', 7);
  _txt(ctx, 'CHAPTER 8: IV ANESTHETICS', 89, 36, '#88aaff', 8);
  _txt(ctx, (q.metadata?.topic || 'IV ANESTHETICS').toUpperCase(), 89, 50, '#4488ff', 8);

  // Vitals
  const hr = Math.round(72 + 4 * Math.abs(Math.sin(t * 1.8)));
  _txt(ctx, `HR: ${hr}`, 44, H - 18, '#00ff88', 9);
  _txt(ctx, 'SpO₂: 99%', cx, H - 18, '#4488ff', 9);
  _txt(ctx, 'RR: 14', W - 46, H - 18, '#ffaa00', 9);
}

// ─── Expose on window for dynamic dispatch ───────────────────────────────────
window.renderIVAnestheticsScene = renderIVAnestheticsScene;
window.stopIVAnestheticsScene   = stopIVAnestheticsScene;
