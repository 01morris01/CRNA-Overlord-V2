/**
 * Opioid-themed scene renderer — Chapter 9
 * Draws topic-specific anatomical/pharmacological diagrams to #scn canvas
 * Aesthetic: dark neon medical arcade matching the rest of the app
 */

let _sceneRafId = null;
let _sceneTime = 0;
let _sceneData = null;

// Maps question topic keywords → visual category
const TOPIC_MAP = {
  receptor: 'receptor', mu: 'receptor', kappa: 'receptor', delta: 'receptor',
  naloxone: 'reversal', naltrexone: 'reversal', antagonist: 'reversal', reversal: 'reversal',
  metabolism: 'metabolism', metabolite: 'metabolism', conjugation: 'metabolism',
  hepatic: 'metabolism', glucuronide: 'metabolism', m3g: 'metabolism', m6g: 'metabolism',
  respiratory: 'respiratory', respiration: 'respiratory', apnea: 'respiratory',
  ventilation: 'respiratory', co2: 'respiratory', hypercapnia: 'respiratory',
  pain: 'cns', nociception: 'cns', brainstem: 'cns', medulla: 'cns',
  seizure: 'cns', tolerance: 'cns', withdrawal: 'cns', spinal: 'cns',
  potency: 'pk', pharmacokinetics: 'pk', pka: 'pk', lipid: 'pk',
  protein: 'pk', clearance: 'pk', half: 'pk', remifentanil: 'pk',
};

function getCategory(q) {
  const topic = (q.metadata?.topicId || q.metadata?.topic || '').toLowerCase();
  const text = (q.q || '').toLowerCase();
  for (const [key, cat] of Object.entries(TOPIC_MAP)) {
    if (topic.includes(key) || text.includes(key)) return cat;
  }
  return 'default';
}

export function renderOpioidScene(q) {
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

export function stopOpioidScene() {
  if (_sceneRafId) { cancelAnimationFrame(_sceneRafId); _sceneRafId = null; }
}

// ─── draw dispatcher ─────────────────────────────────────────────────────────

function _drawScene(ctx, W, H, data, t) {
  switch (data.category) {
    case 'receptor':    _sceneReceptor(ctx, W, H, data.q, t); break;
    case 'reversal':    _sceneReversal(ctx, W, H, data.q, t); break;
    case 'metabolism':  _sceneMetabolism(ctx, W, H, data.q, t); break;
    case 'respiratory': _sceneRespiratory(ctx, W, H, data.q, t); break;
    case 'cns':         _sceneCNS(ctx, W, H, data.q, t); break;
    case 'pk':          _scenePK(ctx, W, H, data.q, t); break;
    default:            _sceneOR(ctx, W, H, data.q, t); break;
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

// ─── SCENE: receptor ─────────────────────────────────────────────────────────

function _sceneReceptor(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#010518');
  const cx = W / 2, cy = H / 2;

  // Membrane bands
  ctx.fillStyle = 'rgba(70,30,120,.45)';
  ctx.fillRect(0, cy - 52, W, 26);
  ctx.fillRect(0, cy + 26, W, 26);
  _txt(ctx, 'PHOSPHOLIPID BILAYER', W * .82, cy - 39, '#7755aa', 7);

  // Receptor helices (7 transmembrane)
  const pulse = 1 + .07 * Math.sin(t * 2);
  ctx.save();
  ctx.strokeStyle = '#cc88ff'; ctx.lineWidth = 2;
  _glow(ctx, '#9944ee', 14 * pulse);
  for (let i = -3; i <= 3; i++) {
    const rx = cx + i * 16;
    ctx.beginPath();
    ctx.moveTo(rx, cy - 52); ctx.lineTo(rx - 4, cy - 30);
    ctx.lineTo(rx + 4, cy - 10); ctx.lineTo(rx, cy + 26);
    ctx.stroke();
  }
  ctx.restore();
  _txt(ctx, 'μ OPIOID RECEPTOR', cx, cy - 66, '#cc88ff', 10);

  // Binding pocket label
  _txt(ctx, 'BINDING', cx, cy - 12, '#ffaa44', 8);
  _txt(ctx, 'POCKET', cx, cy, '#ffaa44', 8);

  // Floating opioid molecule
  const mox = cx - 90 + 55 * (0.5 + 0.5 * Math.sin(t * .7));
  const moy = cy - 90 + 40 * Math.abs(Math.sin(t * .7));
  ctx.save();
  ctx.fillStyle = '#ff8844';
  _glow(ctx, '#ff6600', 12);
  ctx.beginPath(); ctx.arc(mox, moy, 11, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  _txt(ctx, '⬡', mox, moy, '#fff', 13);
  _txt(ctx, 'OPIOID', mox, moy - 20, '#ff8844', 8);

  // Intracellular effects
  _txt(ctx, '↓ cAMP  ↑ K⁺ efflux  ↓ Ca²⁺ influx', cx, cy + 65, '#00ff88', 9);

  // Topic chip
  const topic = q.metadata?.topic || 'receptor';
  _txt(ctx, topic.toUpperCase(), W * .88, H - 14, '#4488ff', 8);
}

// ─── SCENE: reversal/naloxone ─────────────────────────────────────────────────

function _sceneReversal(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#100508');
  const cx = W / 2, cy = H / 2;

  const pulse = .5 + .5 * Math.abs(Math.sin(t * 1.3));

  // Receptor circle
  ctx.save();
  ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 2.5;
  _glow(ctx, '#ff2200', 12 * pulse);
  ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  _txt(ctx, 'μ RECEPTOR', cx, cy + 46, '#ff6666', 9);

  // Naloxone occupying receptor
  ctx.save();
  ctx.fillStyle = `rgba(255,68,0,${.65 + .35 * pulse})`;
  _glow(ctx, '#ff4400', 16 * pulse);
  ctx.beginPath(); ctx.arc(cx, cy, 15, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  _txt(ctx, 'NAL', cx, cy, '#fff', 8);

  // Blocked opioid (floating, rejected)
  const bx = cx - 85 + 10 * Math.sin(t * .6), by = cy - 10;
  ctx.save();
  ctx.fillStyle = 'rgba(150,150,60,.6)';
  ctx.beginPath(); ctx.arc(bx, by, 11, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  _txt(ctx, '⬡', bx, by, '#aaa', 12);
  _txt(ctx, 'BLOCKED', bx, by - 20, '#888', 8);
  _arrow(ctx, bx + 15, by, cx - 32, cy, '#ff2200', 2);

  // Effects panel (right)
  const eff = [
    { txt: '↑ Respiratory Rate', c: '#00ff88' },
    { txt: '↑ Consciousness',    c: '#00ff88' },
    { txt: '↑ Pain (reversal)',  c: '#ff8800' },
    { txt: '⚠ Renarcotization', c: '#ff4444' },
  ];
  eff.forEach((e, i) => {
    _txt(ctx, e.txt, W - 10, cy - 38 + i * 22, e.c, 8, 'right');
  });

  _txt(ctx, 'COMPETITIVE OPIOID ANTAGONISM', cx, 18, '#ffaa00', 10);
  _txt(ctx, `t½ naloxone < t½ most opioids → RENARCOTIZATION risk`, cx, H - 14, '#ff8800', 8);
}

// ─── SCENE: metabolism/hepatic ────────────────────────────────────────────────

function _sceneMetabolism(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#060d04');
  const cx = W / 2, cy = H / 2;

  // Liver silhouette
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - 70, cy - 18);
  ctx.bezierCurveTo(cx - 68, cy - 55, cx + 45, cy - 55, cx + 68, cy - 18);
  ctx.bezierCurveTo(cx + 78, cy + 16, cx + 22, cy + 48, cx - 18, cy + 48);
  ctx.bezierCurveTo(cx - 50, cy + 48, cx - 70, cy + 18, cx - 70, cy - 18);
  ctx.closePath();
  ctx.fillStyle = 'rgba(139,69,19,.45)';
  ctx.fill();
  ctx.strokeStyle = '#aa6633'; ctx.lineWidth = 1.5;
  _glow(ctx, '#aa6633', 10);
  ctx.stroke();
  ctx.restore();
  _txt(ctx, 'LIVER', cx, cy - 8, '#cc8844', 12);
  _txt(ctx, 'UDP-glucuronosyltransferase', cx, cy + 10, '#996633', 8);

  // Input: Drug
  _arrow(ctx, 28, cy - 30, cx - 72, cy - 18, '#4488ff', 2);
  _txt(ctx, 'DRUG', 26, cy - 44, '#4488ff', 9, 'left');

  // Outputs (animated)
  const a1 = 5 * Math.sin(t * 1.4);
  const a2 = 5 * Math.sin(t * 1.4 + 1.2);

  _arrow(ctx, cx + 70, cy - 20, W - 24, cy - 52 + a1, '#ff8800', 2);
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,20,.7)';
  ctx.fillRect(W - 118, cy - 76 + a1, 112, 32); ctx.restore();
  _txt(ctx, 'M3G — 90%', W - 62, cy - 65 + a1, '#ff8800', 9);
  _txt(ctx, 'neuroexcitatory / inactive', W - 62, cy - 52 + a1, '#ff6600', 7);

  _arrow(ctx, cx + 70, cy + 18, W - 24, cy + 48 + a2, '#00ff88', 2);
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,20,.7)';
  ctx.fillRect(W - 118, cy + 36 + a2, 112, 32); ctx.restore();
  _txt(ctx, 'M6G — 10%', W - 62, cy + 47 + a2, '#00ff88', 9);
  _txt(ctx, 'POTENT analgesic', W - 62, cy + 60 + a2, '#00cc66', 7);

  _txt(ctx, 'HEPATIC GLUCURONIDE CONJUGATION', cx, 16, '#ffaa00', 10);
  _txt(ctx, '⚠ M6G accumulates in renal failure', cx, H - 14, '#ff4444', 8);
}

// ─── SCENE: respiratory depression ───────────────────────────────────────────

function _sceneRespiratory(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#01080d');
  const cx = W / 2, cy = H * .44;

  // Lungs
  function _lung(flip) {
    const sign = flip ? 1 : -1;
    const alpha = .3 + .15 * Math.abs(Math.sin(t * 1.1));
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx + sign * 12, cy - 46);
    ctx.bezierCurveTo(cx + sign * 12, cy - 56, cx + sign * 72, cy - 52, cx + sign * 80, cy - 20);
    ctx.bezierCurveTo(cx + sign * 84, cy + 18, cx + sign * 50, cy + 50, cx + sign * 26, cy + 55);
    ctx.bezierCurveTo(cx + sign * 12, cy + 58, cx + sign * 12, cy + 20, cx + sign * 12, cy - 10);
    ctx.closePath();
    ctx.fillStyle = `rgba(60,120,200,${alpha})`;
    ctx.fill();
    ctx.strokeStyle = '#4488cc'; ctx.lineWidth = 1.5;
    _glow(ctx, '#4488cc', 8);
    ctx.stroke();
    ctx.restore();
  }
  _lung(false); _lung(true);

  _txt(ctx, 'CO₂', 36, cy - 16, '#ff4444', 12);
  const co2arr = 4 * Math.sin(t * .9);
  _arrow(ctx, 36, cy + 2 + co2arr, 36, cy - 34 - co2arr, '#ff4444', 2);
  _txt(ctx, '↑ PaCO₂', 36, cy + 20, '#ff4444', 9);

  _txt(ctx, 'RR', W - 44, cy - 16, '#ffaa00', 12);
  _arrow(ctx, W - 44, cy - 34, W - 44, cy + 2, '#ffaa00', 2);
  _txt(ctx, '↓ Rate', W - 44, cy + 20, '#ffaa00', 9);

  // Waveform at bottom — slowing + flattening
  const wY = H - 26;
  ctx.save();
  ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 1.5;
  _glow(ctx, '#00ff88', 6);
  ctx.beginPath();
  const amp = 14 + 5 * Math.sin(t * .4);        // diminishing amplitude
  const freq = 0.038 - 0.006 * Math.sin(t * .3); // slowing frequency
  for (let x = 20; x < W - 20; x++) {
    const y = wY + amp * Math.sin((x + t * 18) * freq * 2 * Math.PI / 40);
    x === 20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
  _txt(ctx, '— RESPIRATORY WAVEFORM (DEPRESSED) —', cx, H - 10, '#008844', 8);

  _txt(ctx, 'OPIOID-INDUCED RESPIRATORY DEPRESSION', cx, 16, '#ff4444', 10);
  _txt(ctx, 'Mechanism: ↓ brainstem CO₂ sensitivity  •  ↓ hypoxic drive', cx, cy + 70, '#88aaff', 8);
}

// ─── SCENE: CNS / pain pathway ────────────────────────────────────────────────

function _sceneCNS(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#080510');
  const cx = W / 2;

  // Brain
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, H * .28, 62, 44, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(60,28,88,.65)';
  ctx.fill();
  ctx.strokeStyle = '#8866aa'; ctx.lineWidth = 1.5;
  _glow(ctx, '#7755aa', 12);
  ctx.stroke();
  ctx.restore();
  _txt(ctx, 'BRAIN CORTEX', cx, H * .22, '#8866aa', 9);
  _txt(ctx, 'PAG / Medulla', cx, H * .32, '#aa88cc', 8);

  // Spinal cord (vertical line)
  ctx.save();
  ctx.strokeStyle = '#7755aa'; ctx.lineWidth = 2.5;
  _glow(ctx, '#7755aa', 8);
  ctx.beginPath();
  ctx.moveTo(cx, H * .28 + 44); ctx.lineTo(cx, H * .84);
  ctx.stroke();
  ctx.restore();
  _txt(ctx, 'DORSAL HORN', cx + 52, H * .6, '#8866aa', 8, 'left');

  // Peripheral pain signal (right → spinal cord)
  const sigPulse = .5 + .5 * Math.abs(Math.sin(t * 2.2));
  ctx.save();
  ctx.strokeStyle = `rgba(255,68,0,${sigPulse})`; ctx.lineWidth = 1.8;
  ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.moveTo(W - 30, H * .84); ctx.lineTo(cx + 4, H * .84); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
  _arrow(ctx, W - 30, H * .84, cx + 4, H * .84, '#ff4400', 2);
  _txt(ctx, 'NOCICEPTION', W - 26, H * .84 - 14, '#ff4400', 8, 'right');
  _txt(ctx, 'A-δ / C fibers', W - 26, H * .84 + 8, '#ff6622', 7, 'right');

  // Descending inhibition (brain → spinal)
  const inhPulse = .6 + .4 * Math.abs(Math.sin(t * 1.6 + 1));
  ctx.save();
  ctx.strokeStyle = `rgba(0,255,136,${inhPulse})`; ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(cx - 10, H * .28 + 44); ctx.lineTo(cx - 10, H * .65);
  ctx.stroke();
  ctx.restore();
  _txt(ctx, '⊣ OPIOID', cx - 50, H * .56, '#00ff88', 8, 'right');
  _txt(ctx, 'INHIBITION', cx - 50, H * .66, '#00ff88', 8, 'right');

  _txt(ctx, 'DESCENDING PAIN MODULATION', cx, 16, '#ffaa00', 10);
  _txt(ctx, 'Substance P ↓  •  Glutamate ↓  •  cAMP ↓', cx, H - 10, '#88aaff', 8);
}

// ─── SCENE: pharmacokinetics / potency ────────────────────────────────────────

function _scenePK(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#010a0c');
  const mx = 52, my = 24, gW = W - mx - 18, gH = H * .48;

  // Axes
  ctx.save();
  ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(mx, my + gH); ctx.lineTo(mx + gW, my + gH); // x
  ctx.moveTo(mx, my); ctx.lineTo(mx, my + gH); // y
  ctx.stroke();
  ctx.restore();
  _txt(ctx, 'TIME →', mx + gW / 2, my + gH + 14, '#444', 8);
  _txt(ctx, 'PLASMA', mx - 30, my + gH / 2 - 6, '#444', 7);
  _txt(ctx, 'CONC', mx - 30, my + gH / 2 + 6, '#444', 7);

  // PK curves
  const drugs = [
    { n: 'REMIFENTANIL', c: '#00ff88', pk: .92, hl: .12 },
    { n: 'FENTANYL',     c: '#ff8844', pk: .88, hl: .32 },
    { n: 'MORPHINE',     c: '#4488ff', pk: .60, hl: .55 },
    { n: 'MEPERIDINE',   c: '#aa66ff', pk: .50, hl: .72 },
  ];
  drugs.forEach(d => {
    ctx.save();
    ctx.strokeStyle = d.c; ctx.lineWidth = 2;
    _glow(ctx, d.c, 6);
    ctx.beginPath();
    for (let i = 0; i <= gW; i++) {
      const xn = i / gW;
      const yn = xn < .08 ? d.pk * (xn / .08) : d.pk * Math.exp(-(xn - .08) / (.9 * d.hl));
      const px = mx + i, py = my + gH - yn * gH;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
    _txt(ctx, d.n, mx + gW * .11, my + gH - d.pk * gH - 9, d.c, 7, 'left');
  });

  // Potency bar chart
  const opioids = [
    { n: 'MEPERI',   p: .1,  c: '#4466ff' },
    { n: 'MORPH',    p: 1,   c: '#4488ff' },
    { n: 'HYDROM',   p: 5,   c: '#44aaff' },
    { n: 'FENTANYL', p: 100, c: '#ff8844' },
    { n: 'SUFENTA',  p: 750, c: '#ff4444' },
  ];
  const bY = H * .79, bMaxH = H * .16;
  const bW = (W - 60) / opioids.length;
  _txt(ctx, 'RELATIVE POTENCY vs MORPHINE (log scale)', W / 2, bY - bMaxH - 10, '#ffaa00', 9);

  opioids.forEach((op, i) => {
    const bx = 30 + i * bW + bW / 2;
    const norm = Math.log10(op.p + 1) / Math.log10(751);
    const bh = norm * bMaxH * (1 + .04 * Math.sin(t * 2 + i));
    ctx.save();
    ctx.fillStyle = op.c; _glow(ctx, op.c, 5);
    ctx.fillRect(bx - bW * .28, bY - bh, bW * .56, bh);
    ctx.restore();
    _txt(ctx, op.n, bx, bY + 10, op.c, 7);
  });
}

// ─── SCENE: default OR ───────────────────────────────────────────────────────

function _sceneOR(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020510');
  const cx = W / 2, cy = H / 2;

  // OR table
  ctx.save();
  ctx.fillStyle = 'rgba(25,55,80,.85)';
  ctx.fillRect(cx - 105, cy + 18, 210, 14);
  ctx.fillRect(cx - 95, cy + 32, 190, 7);
  ctx.strokeStyle = '#336688'; ctx.lineWidth = 1;
  ctx.strokeRect(cx - 105, cy + 18, 210, 14);
  ctx.restore();

  // Patient
  ctx.save();
  ctx.fillStyle = '#ddaa88';
  ctx.beginPath(); ctx.arc(cx, cy - 24, 15, 0, Math.PI * 2); ctx.fill(); // head
  ctx.fillStyle = '#5588aa';
  ctx.fillRect(cx - 22, cy - 8, 44, 24); // torso
  ctx.fillStyle = '#ddaa88';
  ctx.fillRect(cx - 36, cy - 6, 12, 18); // left arm
  ctx.fillRect(cx + 24, cy - 6, 12, 18); // right arm
  ctx.restore();

  // IV line with animated drip
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
  _txt(ctx, 'OPIOID', bagX, bagY + 12, '#4488ff', 7);

  // Info panel
  const topic = (q.metadata?.topic || 'opioids').toUpperCase();
  ctx.save();
  ctx.fillStyle = 'rgba(4,8,24,.85)'; ctx.strokeStyle = 'rgba(80,100,200,.3)'; ctx.lineWidth = 1;
  ctx.fillRect(8, 8, 162, 52); ctx.strokeRect(8, 8, 162, 52);
  ctx.restore();
  _txt(ctx, '📚 BASICS OF ANESTHESIA', 89, 22, '#ffaa00', 7);
  _txt(ctx, 'CHAPTER 9: OPIOIDS', 89, 36, '#ff8888', 8);
  _txt(ctx, topic, 89, 50, '#4488ff', 8);

  // Vitals
  const hr = Math.round(68 + 4 * Math.abs(Math.sin(t * 1.8)));
  _txt(ctx, `HR: ${hr}`, 44, H - 18, '#00ff88', 9);
  _txt(ctx, 'SpO₂: 98%', cx, H - 18, '#4488ff', 9);
  _txt(ctx, 'RR: 14', W - 46, H - 18, '#ffaa00', 9);
}
