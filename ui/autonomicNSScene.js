/**
 * Autonomic Nervous System themed scene renderer — Chapter 6
 * Draws pharmacology/anatomy-themed diagrams to #scn canvas
 * Aesthetic: dark neon medical arcade matching the rest of the app
 */

let _sceneRafId = null;
let _sceneTime  = 0;
let _sceneData  = null;

// Maps question topic keywords → visual category
const TOPIC_MAP = {
  synapse: 'synapse', acetylcholine: 'synapse', muscarinic: 'synapse', nicotinic: 'synapse',
  cholinesterase: 'synapse', pseudocholinesterase: 'synapse', sludge: 'synapse',
  sympathetic: 'sns', thoracolumbar: 'sns', stellate: 'sns', preganglionic: 'sns',
  postganglionic: 'sns', piloerector: 'sns', sweat: 'sns',
  parasympathetic: 'pns', vagus: 'pns', cranial: 'pns', sacral: 'pns',
  catecholamine: 'synthesis', phenylalanine: 'synthesis', tyrosine: 'synthesis',
  dopa: 'synthesis', dopamine: 'synthesis', synthesis: 'synthesis', pnmt: 'synthesis',
  adrenal: 'adrenal', chromaffin: 'adrenal', medulla: 'adrenal', epinephrine: 'adrenal',
  norepinephrine: 'adrenal', cortisol: 'adrenal',
  receptor: 'receptors', alpha: 'receptors', beta: 'receptors', adrenergic: 'receptors',
  upregulation: 'receptors', downregulation: 'receptors',
  dopamine: 'dopamine', renal: 'dopamine', glomerular: 'dopamine',
  ephedrine: 'drugs', phenylephrine: 'drugs', dobutamine: 'drugs',
  isoproterenol: 'drugs', clonidine: 'drugs', dexmedetomidine: 'drugs',
};

function getCategory(q) {
  const topic = (q.metadata?.topicId || q.metadata?.topic || '').toLowerCase();
  const text  = (q.prompt || q.q || '').toLowerCase();
  for (const [key, cat] of Object.entries(TOPIC_MAP)) {
    if (topic.includes(key) || text.includes(key)) return cat;
  }
  return 'default';
}

export function renderAutonomicNSScene(q) {
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

export function stopAutonomicNSScene() {
  if (_sceneRafId) { cancelAnimationFrame(_sceneRafId); _sceneRafId = null; }
}

// ─── draw dispatcher ─────────────────────────────────────────────────────────

function _drawScene(ctx, W, H, data, t) {
  switch (data.category) {
    case 'synapse':   _sceneSynapse(ctx, W, H, data.q, t);   break;
    case 'sns':       _sceneSNS(ctx, W, H, data.q, t);       break;
    case 'pns':       _scenePNS(ctx, W, H, data.q, t);       break;
    case 'synthesis': _sceneSynthesis(ctx, W, H, data.q, t); break;
    case 'adrenal':   _sceneAdrenal(ctx, W, H, data.q, t);   break;
    case 'receptors': _sceneReceptors(ctx, W, H, data.q, t); break;
    case 'dopamine':  _sceneDopamine(ctx, W, H, data.q, t);  break;
    case 'drugs':     _sceneDrugs(ctx, W, H, data.q, t);     break;
    default:          _sceneDefault(ctx, W, H, data.q, t);   break;
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

// ─── SCENE: Synapse / Acetylcholine ──────────────────────────────────────────

function _sceneSynapse(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020c08');
  const cx = W / 2, cy = H * .40;

  _txt(ctx, 'CHOLINERGIC SYNAPSE', cx, 16, '#00ff88', 10);

  // Presynaptic terminal
  ctx.save();
  ctx.fillStyle = 'rgba(0,180,100,.25)'; ctx.strokeStyle = '#00cc66'; ctx.lineWidth = 1.5;
  _glow(ctx, '#00aa55', 6);
  ctx.beginPath(); ctx.roundRect(cx - 60, cy - 48, 120, 38, 6); ctx.fill(); ctx.stroke();
  ctx.restore();
  _txt(ctx, 'PRESYNAPTIC TERMINAL', cx, cy - 29, '#00ff88', 8);

  // Vesicles in presynaptic terminal
  for (let i = 0; i < 5; i++) {
    const vx = cx - 40 + i * 20 + 4 * Math.sin(t * 1.2 + i);
    const vy = cy - 36 + 4 * Math.cos(t * .8 + i);
    ctx.save();
    ctx.fillStyle = 'rgba(0,255,136,.55)';
    _glow(ctx, '#00ff88', 5);
    ctx.beginPath(); ctx.arc(vx, vy, 6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    _txt(ctx, 'ACh', vx, vy, '#001a00', 5);
  }

  // Synaptic cleft
  ctx.save();
  ctx.fillStyle = 'rgba(80,160,255,.08)';
  ctx.fillRect(cx - 60, cy - 10, 120, 20);
  ctx.restore();
  _txt(ctx, '◀ SYNAPTIC CLEFT ▶', cx, cy, '#335588', 7);

  // ACh molecule traveling across cleft
  const ach = cx - 40 + (80 * ((t * .5) % 1));
  ctx.save();
  ctx.fillStyle = 'rgba(0,255,136,.9)';
  _glow(ctx, '#00ff88', 8);
  ctx.beginPath(); ctx.arc(ach, cy, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Postsynaptic membrane
  ctx.save();
  ctx.fillStyle = 'rgba(80,80,200,.2)'; ctx.strokeStyle = '#6666ff'; ctx.lineWidth = 1.5;
  _glow(ctx, '#4444cc', 6);
  ctx.beginPath(); ctx.roundRect(cx - 60, cy + 10, 120, 28, 4); ctx.fill(); ctx.stroke();
  ctx.restore();
  _txt(ctx, 'POSTSYNAPTIC (Nicotinic/Muscarinic)', cx, cy + 24, '#8888ff', 7);

  // AChE enzyme flash
  const acheAlpha = .4 + .6 * Math.abs(Math.sin(t * 2.2));
  _txt(ctx, `AChE — terminates action`, cx, cy + 46, `rgba(255,170,0,${acheAlpha})`, 8);

  // SLUDGE mnemonic
  const sludge = ['S — Salivation', 'L — Lacrimation', 'U — Urination',
                  'D — Defecation', 'G — GI cramps', 'E — Emesis'];
  sludge.forEach((s, i) => {
    _txt(ctx, s, cx, H * .66 + i * 15, i < 3 ? '#00ff88' : '#ffaa00', 7);
  });

  _txt(ctx, 'SLUDGE = Cholinergic Crisis signs', cx, H - 10, '#555', 7);
}

// ─── SCENE: Sympathetic Nervous System ───────────────────────────────────────

function _sceneSNS(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#060210');
  const cx = W / 2;

  _txt(ctx, 'SYMPATHETIC NERVOUS SYSTEM', cx, 16, '#ff8844', 10);

  // Spinal cord segment
  const scX = 30, scW = 22;
  ctx.save();
  ctx.fillStyle = 'rgba(255,120,50,.2)'; ctx.strokeStyle = '#ff8844'; ctx.lineWidth = 1.5;
  _glow(ctx, '#ff6600', 6);
  ctx.fillRect(scX, 30, scW, H - 50); ctx.strokeRect(scX, 30, scW, H - 50);
  ctx.restore();
  _txt(ctx, 'SC', scX + scW / 2, H / 2, '#ff8844', 8);

  // T1-L3 region highlighted
  const tStart = 30 + (H - 50) * .15;
  const tEnd   = 30 + (H - 50) * .65;
  ctx.save();
  ctx.fillStyle = 'rgba(255,140,0,.35)';
  _glow(ctx, '#ff8800', 8);
  ctx.fillRect(scX + 1, tStart, scW - 2, tEnd - tStart);
  ctx.restore();
  _txt(ctx, 'T1', scX + scW + 4, tStart, '#ffaa00', 7, 'left');
  _txt(ctx, 'L3', scX + scW + 4, tEnd, '#ffaa00', 7, 'left');
  _txt(ctx, '←PREGANGLIONIC', scX + scW + 4, (tStart + tEnd) / 2, '#ff8844', 7, 'left');

  // Paravertebral ganglion chain
  const chainX = cx - 20;
  const gangNodes = 5;
  for (let i = 0; i < gangNodes; i++) {
    const gy = 50 + i * ((H - 80) / (gangNodes - 1));
    const pulse = 1 + .06 * Math.sin(t * 1.5 + i);
    ctx.save();
    ctx.strokeStyle = '#ff4488'; ctx.lineWidth = 1.5;
    _glow(ctx, '#ff2266', 8 * pulse);
    ctx.beginPath(); ctx.arc(chainX, gy, 10 * pulse, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    _txt(ctx, 'G', chainX, gy, '#ff4488', 8);
    if (i < gangNodes - 1) {
      ctx.save(); ctx.strokeStyle = '#551133'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(chainX, gy + 10); ctx.lineTo(chainX, 50 + (i + 1) * ((H - 80) / (gangNodes - 1)) - 10);
      ctx.stroke(); ctx.restore();
    }
    // Short preganglionic arrow
    _arrow(ctx, scX + scW, gy, chainX - 10, gy, '#ff8844', 1);
    // Long postganglionic arrow
    _arrow(ctx, chainX + 10, gy, cx + 80, gy, '#ff4488', 1);
  }

  _txt(ctx, 'GANGLIA', chainX, H - 12, '#ff4488', 7);
  _txt(ctx, 'TARGET ORGANS →', cx + 60, H - 12, '#888', 7);

  // Key labels
  const efx = [
    { t: '↑ HR  ↑ BP  ↑ CO', c: '#ff8844' },
    { t: 'Bronchodilation', c: '#ffaa00' },
    { t: 'Pupil dilation', c: '#ffdd66' },
    { t: 'GI inhibition', c: '#ff6688' },
    { t: 'Sweat (ACh exception)', c: '#44aaff' },
  ];
  efx.forEach((e, i) => {
    _txt(ctx, e.t, cx + 75, H * .30 + i * 18, e.c, 7);
  });
}

// ─── SCENE: Parasympathetic Nervous System ───────────────────────────────────

function _scenePNS(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020a14');
  const cx = W / 2;

  _txt(ctx, 'PARASYMPATHETIC NERVOUS SYSTEM', cx, 16, '#44ddff', 10);

  // Brain / brainstem schematic
  ctx.save();
  ctx.strokeStyle = '#44aaff'; ctx.lineWidth = 1.5;
  _glow(ctx, '#2288cc', 8);
  ctx.beginPath(); ctx.ellipse(cx - 60, H * .28, 32, 22, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  _txt(ctx, 'BRAINSTEM', cx - 60, H * .28, '#44ddff', 8);

  // Cranial nerves
  const cns = [
    { n: 'CN III', y: H * .18, c: '#00ff88' },
    { n: 'CN VII', y: H * .28, c: '#ffaa00' },
    { n: 'CN IX',  y: H * .38, c: '#ff88aa' },
    { n: 'CN X',   y: H * .48, c: '#44ddff' },
  ];

  cns.forEach((cn) => {
    const pulse = 1 + .05 * Math.sin(t * 1.3);
    ctx.save();
    ctx.strokeStyle = cn.c; ctx.lineWidth = 1.5;
    _glow(ctx, cn.c, 5 * pulse);
    ctx.beginPath();
    ctx.moveTo(cx - 28, cn.y);
    ctx.lineTo(cx + 50, cn.y);
    ctx.stroke(); ctx.restore();
    _txt(ctx, cn.n, cx - 52, cn.y, cn.c, 8);
    _txt(ctx, '→', cx + 56, cn.y, cn.c, 10);
  });

  // Vagus highlight
  const vAlpha = .6 + .4 * Math.abs(Math.sin(t * 1.5));
  ctx.save();
  ctx.strokeStyle = `rgba(68,221,255,${vAlpha})`; ctx.lineWidth = 3;
  _glow(ctx, '#44ddff', 10 * vAlpha);
  ctx.beginPath(); ctx.moveTo(cx + 50, H * .48); ctx.lineTo(cx + 110, H * .75); ctx.stroke();
  ctx.restore();
  _txt(ctx, 'VAGUS = 75%', cx + 90, H * .60, `rgba(68,221,255,${vAlpha})`, 8);
  _txt(ctx, 'of PNS traffic', cx + 90, H * .67, `rgba(68,221,255,${vAlpha * .7})`, 7);

  // Sacral origin
  ctx.save();
  ctx.fillStyle = 'rgba(68,200,255,.15)'; ctx.strokeStyle = '#44aacc'; ctx.lineWidth = 1.5;
  ctx.fillRect(cx - 80, H * .62, 55, 28);
  ctx.strokeRect(cx - 80, H * .62, 55, 28);
  ctx.restore();
  _txt(ctx, 'S2–S4', cx - 52, H * .76, '#44ddff', 8);

  // Effects
  const efx = [
    { t: '↓ HR  ↓ Conduction', c: '#44ddff' },
    { t: '↑ GI motility', c: '#00ff88' },
    { t: 'Pupil constriction', c: '#ffaa00' },
    { t: 'Bladder emptying', c: '#ff88aa' },
  ];
  efx.forEach((e, i) => {
    _txt(ctx, e.t, cx + 40, H * .80 + i * 16, e.c, 7);
  });

  _txt(ctx, 'Long preganglionic → Short postganglionic', cx, H - 10, '#444', 7);
}

// ─── SCENE: Catecholamine Synthesis Pathway ───────────────────────────────────

function _sceneSynthesis(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#030810');
  const cx = W / 2;

  _txt(ctx, 'CATECHOLAMINE SYNTHESIS PATHWAY', cx, 16, '#ffaa00', 10);

  const steps = [
    { name: 'Phenylalanine', enzyme: '',                color: '#888' },
    { name: 'Tyrosine',      enzyme: 'Tyrosine\nhydroxylase', color: '#88aaff' },
    { name: 'DOPA',          enzyme: 'DOPA\ndecarboxylase',   color: '#ffaa00' },
    { name: 'Dopamine',      enzyme: 'Dopamine\nβ-hydroxylase', color: '#44ddff' },
    { name: 'Norepinephrine',enzyme: 'PNMT\n(Cortisol→)',     color: '#ff8844' },
    { name: 'Epinephrine',   enzyme: '',                color: '#ff4488' },
  ];

  const stepH = (H - 50) / steps.length;
  steps.forEach((s, i) => {
    const y = 34 + i * stepH + stepH / 2;
    const bx = cx - 55;
    const bw = 110, bh = 20;
    const pulse = 1 + .03 * Math.sin(t * 1.2 + i);
    ctx.save();
    ctx.fillStyle = s.color; ctx.globalAlpha = .18 * pulse;
    ctx.fillRect(bx, y - bh / 2, bw, bh);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = s.color; ctx.lineWidth = 1;
    _glow(ctx, s.color, 5);
    ctx.strokeRect(bx, y - bh / 2, bw, bh);
    ctx.restore();
    _txt(ctx, s.name, cx, y, s.color, 9);

    if (i < steps.length - 1) {
      // Arrow down
      _arrow(ctx, cx, y + bh / 2 + 1, cx, y + stepH - bh / 2, '#555', 1.2);
      // Enzyme label
      if (s.enzyme) {
        const elines = s.enzyme.split('\n');
        elines.forEach((el, li) => {
          _txt(ctx, el, cx + 70, y + stepH * .4 + li * 11, '#666', 7);
        });
      }
    }
  });

  _txt(ctx, 'MAO-A: Epi, NE, DA  |  MAO-B: DA only  |  COMT: all', cx, H - 10, '#555', 7);
}

// ─── SCENE: Adrenal Medulla / Catecholamines ─────────────────────────────────

function _sceneAdrenal(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#060210');
  const cx = W / 2, cy = H * .38;

  _txt(ctx, 'ADRENAL MEDULLA — CATECHOLAMINES', cx, 16, '#ff8844', 10);

  // Adrenal gland shape
  ctx.save();
  ctx.strokeStyle = '#ff8844'; ctx.lineWidth = 2;
  _glow(ctx, '#ff6600', 10);
  ctx.beginPath();
  ctx.moveTo(cx - 35, cy - 22);
  ctx.bezierCurveTo(cx - 35, cy - 44, cx + 35, cy - 44, cx + 35, cy - 22);
  ctx.bezierCurveTo(cx + 44, cy, cx + 24, cy + 28, cx, cy + 28);
  ctx.bezierCurveTo(cx - 24, cy + 28, cx - 44, cy, cx - 35, cy - 22);
  ctx.closePath();
  ctx.fillStyle = 'rgba(180,80,0,.22)'; ctx.fill(); ctx.stroke();
  ctx.restore();
  _txt(ctx, 'ADRENAL', cx, cy - 12, '#ff8844', 9);
  _txt(ctx, 'MEDULLA', cx, cy + 2, '#ff6600', 8);

  // Chromaffin cells represented as dots
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2 + t * .3;
    const r = 14 + 4 * Math.abs(Math.sin(t * .7 + i));
    const dx = cx + r * Math.cos(angle);
    const dy = cy - 4 + r * .5 * Math.sin(angle);
    ctx.save();
    ctx.fillStyle = `rgba(255,180,50,${.5 + .3 * Math.abs(Math.sin(t + i))})`;
    _glow(ctx, '#ffaa00', 5);
    ctx.beginPath(); ctx.arc(dx, dy, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  _txt(ctx, 'CHROMAFFIN CELLS', cx, cy + 44, '#ffaa00', 7);

  // Products
  const products = [
    { t: 'Epinephrine (80%)', c: '#ff4488', x: cx - 72, y: cy + 62 },
    { t: 'Norepinephrine (20%)', c: '#ff8844', x: cx + 72, y: cy + 62 },
  ];
  products.forEach((p) => {
    _txt(ctx, p.t, p.x, p.y, p.c, 7);
    _arrow(ctx, cx, cy + 28, p.x, p.y - 10, p.c, 1.2);
  });

  // Key pharmacology
  const facts = [
    { t: 'Epi: poorly lipid soluble', c: '#ff4488' },
    { t: 'NE lacks methyl group vs Epi', c: '#ff8844' },
    { t: 'PNMT: NE → Epi (cortisol ↑)', c: '#ffaa00' },
    { t: 'End product: Vanillylmandelic acid (VMA)', c: '#888' },
    { t: 'Synthesis base: Phenylalanine', c: '#666' },
  ];
  facts.forEach((f, i) => {
    _txt(ctx, f.t, cx, H * .70 + i * 16, f.c, 7);
  });
}

// ─── SCENE: Adrenergic Receptors ──────────────────────────────────────────────

function _sceneReceptors(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#030610');
  const cx = W / 2;

  _txt(ctx, 'ADRENERGIC RECEPTORS', cx, 16, '#ffaa00', 10);

  const receptors = [
    {
      name: 'α1', color: '#ff4488',
      effects: ['Vasoconstriction', 'Pupil dilation', 'Bladder neck contraction', '↓ Insulin'],
      x: cx * .45,
    },
    {
      name: 'α2', color: '#ff8844',
      effects: ['Presynaptic inhibition', '↓ Insulin', 'Venous constriction', 'Platelet aggregation'],
      x: cx * 1.55,
    },
    {
      name: 'β1', color: '#00ff88',
      effects: ['↑ HR  ↑ Contractility', '↑ Renin secretion', '↑ Lipolysis', 'GI relaxation'],
      x: cx * .45,
    },
    {
      name: 'β2', color: '#44ddff',
      effects: ['Bronchodilation', 'Vasodilation', '↑ Insulin', 'Hyperpolarization (↓Ca²⁺)'],
      x: cx * 1.55,
    },
  ];

  const rowH = (H - 50) / 2;

  receptors.forEach((r, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const ry = 32 + row * rowH;
    const bx = r.x - 75;

    ctx.save();
    ctx.fillStyle = r.color; ctx.globalAlpha = .10;
    ctx.fillRect(bx, ry, 150, rowH - 8);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = r.color; ctx.lineWidth = 1.5;
    _glow(ctx, r.color, 6);
    ctx.strokeRect(bx, ry, 150, rowH - 8);
    ctx.restore();

    _txt(ctx, r.name, r.x, ry + 12, r.color, 11);
    r.effects.forEach((e, ei) => {
      _txt(ctx, e, r.x, ry + 28 + ei * 14, '#888', 7);
    });
  });

  _txt(ctx, 'β2 > β1 affinity for Epi  |  Upregulation: beta-blocker withdrawal → rebound tachy', cx, H - 10, '#555', 7);
}

// ─── SCENE: Dopamine / Renal Effects ─────────────────────────────────────────

function _sceneDopamine(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020a14');
  const cx = W / 2, cy = H * .35;

  _txt(ctx, 'DOPAMINE — UNIQUE DUAL ACTION', cx, 16, '#44ddff', 10);

  // Kidney schematic
  ctx.save();
  ctx.strokeStyle = '#44ddff'; ctx.lineWidth = 2;
  _glow(ctx, '#2299cc', 10);
  ctx.beginPath();
  ctx.ellipse(cx - 20, cy, 28, 40, Math.PI / 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx + 20, cy, 28, 40, -Math.PI / 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  _txt(ctx, 'KIDNEYS', cx, cy, '#44ddff', 8);

  // Blood flow arrows pulsing
  const bfPulse = .6 + .4 * Math.abs(Math.sin(t * 1.6));
  ctx.save();
  ctx.strokeStyle = `rgba(0,255,136,${bfPulse})`; ctx.lineWidth = 2.5;
  _glow(ctx, '#00cc66', 8 * bfPulse);
  ctx.beginPath();
  ctx.moveTo(cx - 70, cy - 20); ctx.lineTo(cx - 48, cy - 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 70, cy - 20); ctx.lineTo(cx + 48, cy - 10);
  ctx.stroke();
  ctx.restore();
  _txt(ctx, '↑ RENAL BF', cx - 75, cy - 28, `rgba(0,255,136,${bfPulse})`, 7);
  _txt(ctx, '↑ RENAL BF', cx + 75, cy - 28, `rgba(0,255,136,${bfPulse})`, 7);

  // Renal effects panel
  const renal = [
    { t: '↑ Renal blood flow (DA1)', c: '#00ff88' },
    { t: '↑ Glomerular filtration (DA1)', c: '#00ff88' },
    { t: '↑ Sodium excretion (DA1)', c: '#00ff88' },
    { t: '↑ Urine output', c: '#44ddff' },
  ];
  renal.forEach((r, i) => {
    _txt(ctx, r.t, cx, H * .56 + i * 14, r.c, 7);
  });

  // Cardiac effect
  _txt(ctx, '↑ Cardiac contractility (β1)', cx, H * .56 + 4 * 14 + 4, '#ffaa00', 7);

  // Half-life note
  _txt(ctx, 'Cannot cross BBB → L-dopa used in Parkinson\'s', cx, H * .88, '#ff8844', 7);
  _txt(ctx, 't½ ≈ 1 minute (MAO + COMT)', cx, H - 10, '#555', 7);
}

// ─── SCENE: Sympathomimetic Drugs ────────────────────────────────────────────

function _sceneDrugs(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#040810');
  const cx = W / 2;

  _txt(ctx, 'SYMPATHOMIMETIC DRUGS', cx, 16, '#ffaa44', 10);

  // Drug molecules drifting
  for (let i = 0; i < 12; i++) {
    const mx = ((i * 43 + t * 14) % (W - 20)) + 10;
    const my = 26 + (i * 37) % (H - 40);
    const sz = 2 + (i % 3);
    const alpha = .12 + .15 * Math.abs(Math.sin(t * .7 + i));
    ctx.save();
    ctx.fillStyle = `rgba(255,170,50,${alpha})`;
    ctx.beginPath(); ctx.arc(mx, my, sz, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  const drugs = [
    { name: 'Ephedrine',       cat: 'NonCat',  key: 'Direct + indirect (releases NE)', c: '#ffaa00' },
    { name: 'Phenylephrine',   cat: 'NonCat',  key: 'α1 — venoconstriction > art', c: '#ff8844' },
    { name: 'Isoproterenol',   cat: 'SynCat',  key: 'Most potent β1+β2 agonist', c: '#00ff88' },
    { name: 'Dobutamine',      cat: 'SynCat',  key: '↑ CO ↓ filling P (D5W only)', c: '#44ddff' },
    { name: 'Clonidine',       cat: 'α2 Ag',   key: 'Rousable sedation; ↓ insulin', c: '#aa88ff' },
    { name: 'Dexmedetomidine', cat: 'α2 Ag',   key: 'Rousable; vent weaning safe', c: '#88aaff' },
  ];

  const tableY = H * .26;
  _txt(ctx, 'DRUG           CLASS     KEY POINT', 10, tableY - 14, '#444', 7, 'left');

  drugs.forEach((d, i) => {
    const y = tableY + i * 17;
    _txt(ctx, d.name.padEnd(15), 10, y, d.c, 7, 'left');
    _txt(ctx, d.cat.padEnd(10), 108, y, '#666', 7, 'left');
    _txt(ctx, d.key, 175, y, '#555', 7, 'left');
  });

  // Key rule
  ctx.save();
  ctx.strokeStyle = 'rgba(255,100,100,.3)'; ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(10, H * .85); ctx.lineTo(W - 10, H * .85); ctx.stroke();
  ctx.setLineDash([]); ctx.restore();

  _txt(ctx, '⚠ Sympathomimetics CONTRAINDICATED in untreated hypovolemia', cx, H * .91, '#ff4444', 7);
  _txt(ctx, 'Ephedrine CV effect: less intense, 10× longer than epinephrine', cx, H - 10, '#555', 7);
}

// ─── SCENE: default ANS overview ─────────────────────────────────────────────

function _sceneDefault(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020510');
  const cx = W / 2, cy = H / 2;

  // CNS brain outline
  ctx.save();
  ctx.strokeStyle = '#4488ff'; ctx.lineWidth = 1.5;
  _glow(ctx, '#2255cc', 8);
  ctx.beginPath(); ctx.ellipse(cx, cy - 40, 44, 32, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  _txt(ctx, 'CNS', cx, cy - 40, '#4488ff', 9);

  // Two branches: SNS and PNS
  _arrow(ctx, cx - 20, cy - 8, cx - 64, cy + 30, '#ff8844', 1.5);
  _arrow(ctx, cx + 20, cy - 8, cx + 64, cy + 30, '#44ddff', 1.5);

  // SNS box
  ctx.save();
  ctx.strokeStyle = '#ff8844'; ctx.lineWidth = 1.5;
  _glow(ctx, '#ff6600', 6);
  ctx.strokeRect(cx - 106, cy + 30, 80, 26);
  ctx.restore();
  _txt(ctx, 'SNS', cx - 66, cy + 43, '#ff8844', 9);

  // PNS box
  ctx.save();
  ctx.strokeStyle = '#44ddff'; ctx.lineWidth = 1.5;
  _glow(ctx, '#2299cc', 6);
  ctx.strokeRect(cx + 26, cy + 30, 80, 26);
  ctx.restore();
  _txt(ctx, 'PNS', cx + 66, cy + 43, '#44ddff', 9);

  // NE/ACh labels
  _txt(ctx, 'NE (main)', cx - 66, cy + 66, '#ff8844', 7);
  _txt(ctx, 'ACh (all)', cx + 66, cy + 66, '#44ddff', 7);

  // Pulse lines
  const pulse = .4 + .6 * Math.abs(Math.sin(t * 1.5));
  ctx.save();
  ctx.strokeStyle = `rgba(0,255,136,${pulse})`; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(10, H * .85); ctx.lineTo(W - 10, H * .85); ctx.stroke();
  ctx.restore();

  // Info panel
  ctx.save();
  ctx.fillStyle = 'rgba(4,8,24,.85)'; ctx.strokeStyle = 'rgba(80,100,200,.3)'; ctx.lineWidth = 1;
  ctx.fillRect(8, 8, 170, 52); ctx.strokeRect(8, 8, 170, 52);
  ctx.restore();
  _txt(ctx, '📚 BASICS OF ANESTHESIA', 93, 22, '#ffaa00', 7);
  _txt(ctx, 'CHAPTER 6: AUTONOMIC NS', 93, 36, '#88aaff', 8);
  _txt(ctx, (q.metadata?.topic || 'AUTONOMIC NERVOUS SYSTEM').toUpperCase(), 93, 50, '#44aaff', 7);

  const hr = Math.round(72 + 4 * Math.abs(Math.sin(t * 1.8)));
  _txt(ctx, `HR: ${hr}   BP: 120/80   SpO₂: 99%`, cx, H - 10, `rgba(0,255,136,${pulse})`, 8);
}

// ─── Expose on window for dynamic dispatch ───────────────────────────────────
window.renderAutonomicNSScene = renderAutonomicNSScene;
window.stopAutonomicNSScene   = stopAutonomicNSScene;
