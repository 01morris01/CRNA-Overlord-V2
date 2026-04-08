/**
 * Inhaled Anesthetics themed scene renderer — Chapter 7
 * Draws pharmacology-themed diagrams to #scn canvas
 * Aesthetic: dark neon medical arcade matching the rest of the app
 */

let _sceneRafId = null;
let _sceneTime  = 0;
let _sceneData  = null;

// Maps question topic keywords → visual category
const TOPIC_MAP = {
  mac: 'mac', minimum: 'mac', alveolar: 'mac', concentration: 'mac',
  partition: 'pk', coefficient: 'pk', blood: 'pk', solubility: 'pk',
  uptake: 'pk', distribution: 'pk', pharmacokinetic: 'pk',
  guedel: 'guedel', stage: 'guedel', plane: 'guedel', depth: 'guedel',
  nitrous: 'n2o', n2o: 'n2o', diffusion: 'n2o', second: 'n2o',
  cardiovascular: 'cardio', cardiac: 'cardio', vascular: 'cardio', hypotension: 'cardio', heart: 'cardio',
  broncho: 'respiratory', respiratory: 'respiratory', airway: 'respiratory', apnea: 'respiratory',
  compound: 'safety', toxicity: 'safety', hepatitis: 'safety', nephro: 'safety', carbon: 'safety', halothane: 'safety',
  desflurane: 'agent', sevoflurane: 'agent', isoflurane: 'agent', halothane: 'agent', enflurane: 'agent',
  vapor: 'agent', boiling: 'agent', molecular: 'agent',
};

function getCategory(q) {
  const topic = (q.metadata?.topicId || q.metadata?.topic || '').toLowerCase();
  const text  = (q.q || '').toLowerCase();
  for (const [key, cat] of Object.entries(TOPIC_MAP)) {
    if (topic.includes(key) || text.includes(key)) return cat;
  }
  return 'default';
}

export function renderInhaledAnestheticsScene(q) {
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

export function stopInhaledAnestheticsScene() {
  if (_sceneRafId) { cancelAnimationFrame(_sceneRafId); _sceneRafId = null; }
}

// ─── draw dispatcher ─────────────────────────────────────────────────────────

function _drawScene(ctx, W, H, data, t) {
  switch (data.category) {
    case 'mac':         _sceneMAC(ctx, W, H, data.q, t);         break;
    case 'pk':          _scenePK(ctx, W, H, data.q, t);          break;
    case 'guedel':      _sceneGuedel(ctx, W, H, data.q, t);      break;
    case 'n2o':         _sceneN2O(ctx, W, H, data.q, t);         break;
    case 'cardio':      _sceneCardio(ctx, W, H, data.q, t);      break;
    case 'respiratory': _sceneRespiratory(ctx, W, H, data.q, t); break;
    case 'safety':      _sceneSafety(ctx, W, H, data.q, t);      break;
    case 'agent':       _sceneAgent(ctx, W, H, data.q, t);       break;
    default:            _sceneOR(ctx, W, H, data.q, t);          break;
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

// ─── SCENE: MAC bar chart ─────────────────────────────────────────────────────

function _sceneMAC(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020c04');
  const cx = W / 2;

  _txt(ctx, 'MAC VALUES — INHALED ANESTHETICS', cx, 16, '#00ff88', 10);

  const agents = [
    { name: 'N₂O',       mac: 104, color: '#88ddff' },
    { name: 'Desflurane', mac: 6.6, color: '#ff8844' },
    { name: 'Isoflurane', mac: 1.17, color: '#ffaa00' },
    { name: 'Sevoflurane',mac: 2.05, color: '#00ff88' },
    { name: 'Halothane',  mac: 0.75, color: '#ff4488' },
    { name: 'Enflurane',  mac: 1.63, color: '#aa88ff' },
  ];

  // Normalize to visible scale — N2O is 104%, show log-ish scale
  const maxDisplay = 8; // display max for bar height (cap N2O bar)
  const barW  = 28, gap = 6;
  const totalW = agents.length * (barW + gap) - gap;
  const startX = cx - totalW / 2;
  const baseY  = H * .82;
  const maxH   = H * .50;

  agents.forEach((ag, i) => {
    const displayVal = Math.min(ag.mac, maxDisplay);
    const barH = (displayVal / maxDisplay) * maxH * (1 + .02 * Math.sin(t * 1.2 + i));
    const bx = startX + i * (barW + gap);
    ctx.save();
    ctx.fillStyle = ag.color;
    _glow(ctx, ag.color, 6);
    ctx.globalAlpha = 0.8;
    ctx.fillRect(bx, baseY - barH, barW, barH);
    ctx.restore();

    // MAC value label on top
    const label = ag.mac >= 10 ? `${ag.mac}%` : `${ag.mac}%`;
    _txt(ctx, label, bx + barW / 2, baseY - barH - 10, ag.color, 7);
    // Agent name below
    _txt(ctx, ag.name, bx + barW / 2, baseY + 12, ag.color, 7);
  });

  // Y-axis label
  _txt(ctx, 'MAC (%)', 18, H * .55, '#555', 7, 'left');
  _txt(ctx, 'N₂O bar capped at 8 for scale', cx, H - 10, '#444', 7);
}

// ─── SCENE: Pharmacokinetics / partition coefficients ─────────────────────────

function _scenePK(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020810');
  const cx = W / 2;

  _txt(ctx, 'UPTAKE — BLOOD:GAS PARTITION', cx, 16, '#44aaff', 10);

  // Three compartments stacked
  const comps = [
    { label: 'ALVEOLUS (FA)',    y: H * .28, color: '#44aaff', wFactor: 1.0 },
    { label: 'BLOOD (Fa)',       y: H * .48, color: '#ff6688', wFactor: 0.7 },
    { label: 'BRAIN / TISSUE',   y: H * .68, color: '#00ff88', wFactor: 0.5 },
  ];

  comps.forEach((c, i) => {
    const w = (W - 60) * c.wFactor * (1 + .015 * Math.sin(t * .8 + i));
    const bx = cx - w / 2;
    ctx.save();
    ctx.fillStyle = c.color; ctx.globalAlpha = .15;
    ctx.fillRect(bx, c.y - 14, w, 28);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = c.color; ctx.lineWidth = 1.5;
    _glow(ctx, c.color, 6);
    ctx.strokeRect(bx, c.y - 14, w, 28);
    ctx.restore();
    _txt(ctx, c.label, cx, c.y, c.color, 9);
  });

  // Arrows between compartments
  _arrow(ctx, cx, H * .28 + 14, cx, H * .48 - 14, '#4488ff', 1.5);
  _arrow(ctx, cx, H * .48 + 14, cx, H * .68 - 14, '#00cc66', 1.5);

  // Partition coefficient table
  const pkData = [
    { agent: 'N₂O',        bg: 0.47, color: '#88ddff' },
    { agent: 'Desflurane', bg: 0.45, color: '#ff8844' },
    { agent: 'Sevoflurane',bg: 0.65, color: '#00ff88' },
    { agent: 'Isoflurane', bg: 1.46, color: '#ffaa00' },
    { agent: 'Halothane',  bg: 2.54, color: '#ff4488' },
  ];

  const tableX = W - 10, tableY = H * .28;
  _txt(ctx, 'B:G Coef', tableX - 55, tableY - 20, '#555', 7, 'right');
  pkData.forEach((pk, i) => {
    _txt(ctx, `${pk.agent}: ${pk.bg}`, tableX - 10, tableY + i * 14, pk.color, 7, 'right');
  });

  _txt(ctx, '↓ B:G = faster induction & recovery', cx, H - 10, '#888', 8);
}

// ─── SCENE: Guedel's Stages ───────────────────────────────────────────────────

function _sceneGuedel(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#050410');
  const cx = W / 2;

  _txt(ctx, "GUEDEL'S STAGES OF ANESTHESIA", cx, 16, '#aa88ff', 10);

  const stages = [
    { num: 'I',   name: 'Analgesia',      desc: 'Conscious, amnesia begins',        color: '#00ff88' },
    { num: 'II',  name: 'Excitement',     desc: 'Delirium, breath-holding, emesis', color: '#ffaa00' },
    { num: 'III', name: 'Surgical',       desc: 'Planes 1–4, loss of reflexes',     color: '#44aaff' },
    { num: 'IV',  name: 'Medullary Depr.',desc: 'Apnea, CV collapse → DEATH',       color: '#ff4444' },
  ];

  const rowH = (H - 52) / stages.length;

  stages.forEach((st, i) => {
    const y = 32 + i * rowH + rowH / 2;
    const flash = i === 3 ? (.4 + .6 * Math.abs(Math.sin(t * 2.5))) : 1;
    ctx.save();
    ctx.fillStyle = st.color; ctx.globalAlpha = .08 * flash;
    ctx.fillRect(10, 32 + i * rowH, W - 20, rowH - 4);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = st.color; ctx.lineWidth = 1;
    _glow(ctx, st.color, 4 * flash);
    ctx.strokeRect(10, 32 + i * rowH, W - 20, rowH - 4);
    ctx.restore();
    _txt(ctx, `Stage ${st.num}`, 50, y - 6, st.color, 9);
    _txt(ctx, st.name, 50, y + 8, st.color, 8);
    _txt(ctx, st.desc, cx + 30, y, '#888', 8);
  });

  // Stage III detail note
  _txt(ctx, 'Stage III Plane 3: pupil dilation, loss of laryngeal reflex', cx, H - 10, '#666', 7);
}

// ─── SCENE: N2O / diffusion hypoxia ──────────────────────────────────────────

function _sceneN2O(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#040c10');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'NITROUS OXIDE — UNIQUE PROPERTIES', cx, 16, '#88ddff', 10);

  // Alveolus cross-section
  const alvR = 38;
  ctx.save();
  ctx.strokeStyle = '#88ddff'; ctx.lineWidth = 2;
  _glow(ctx, '#44aaff', 8);
  ctx.beginPath(); ctx.arc(cx, cy - 10, alvR, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  _txt(ctx, 'ALVEOLUS', cx, cy - 10, '#88ddff', 9);

  // N2O molecules rushing out (diffusion hypoxia)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + t * .8;
    const r = alvR + 14 + 12 * Math.abs(Math.sin(t * 1.2 + i));
    const mx = cx + r * Math.cos(angle);
    const my = (cy - 10) + r * .55 * Math.sin(angle);
    ctx.save();
    ctx.fillStyle = `rgba(136,221,255,${.5 + .4 * Math.abs(Math.sin(t + i))})`;
    _glow(ctx, '#44aaff', 6);
    ctx.beginPath(); ctx.arc(mx, my, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    _txt(ctx, 'N₂O', mx, my, '#88ddff', 6);
  }

  // Key properties
  const props = [
    { t: 'MAC = 104% (no solo anesthesia at 1 atm)', c: '#88ddff' },
    { t: 'B:G = 0.47 — fastest onset/offset', c: '#00ff88' },
    { t: '2nd gas effect: ↑ [volatile] uptake', c: '#ffaa00' },
    { t: 'Diffusion hypoxia: O₂ supplement on emergence', c: '#ff6666' },
    { t: 'Expands closed gas spaces (bowel/middle ear)', c: '#ff4488' },
    { t: 'Inactivates Vit B12 (N5-methylTHF synthase)', c: '#aa88ff' },
  ];
  props.forEach((p, i) => {
    _txt(ctx, p.t, cx, H * .62 + i * 16, p.c, 7);
  });

  _txt(ctx, '30% N₂O in 70% O₂ = safest routine blend', cx, H - 10, '#555', 7);
}

// ─── SCENE: Cardiovascular effects ───────────────────────────────────────────

function _sceneCardio(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#080206');
  const cx = W / 2;

  _txt(ctx, 'CV EFFECTS — INHALED ANESTHETICS', cx, 16, '#ff6688', 10);

  // ECG strip
  const eY = H * .35;
  ctx.save();
  ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 1.8;
  _glow(ctx, '#00cc66', 6);
  ctx.beginPath();
  for (let x = 10; x < W - 10; x++) {
    const xn = (x - 10) / (W - 20);
    const cycle = (xn * 3 + t * .5) % 1;
    let y = 0;
    if (cycle < .08)       y = 0;
    else if (cycle < .12)  y = -5 * Math.sin((cycle - .08) / .04 * Math.PI);  // P wave
    else if (cycle < .22)  y = 0;
    else if (cycle < .25)  y = 5;   // Q
    else if (cycle < .28)  y = -28; // R
    else if (cycle < .31)  y = 8;   // S
    else if (cycle < .40)  y = 0;
    else if (cycle < .55)  y = -8 * Math.sin((cycle - .40) / .15 * Math.PI); // T
    else                   y = 0;
    const py = eY + y;
    x === 10 ? ctx.moveTo(x, py) : ctx.lineTo(x, py);
  }
  ctx.stroke();
  ctx.restore();

  // Agent comparison table
  const agents = [
    { name: 'Halothane',   hr: '↓↓', bp: '↓↓', co: '↓↓', note: 'Sensitizes to epi' },
    { name: 'Isoflurane',  hr: '↑',  bp: '↓↓', co: '→',  note: 'Vasodilation' },
    { name: 'Desflurane',  hr: '↑↑', bp: '↓',  co: '→',  note: 'SNS activation' },
    { name: 'Sevoflurane', hr: '↑',  bp: '↓',  co: '→',  note: 'Best cardiac profile' },
  ];

  const tableY = H * .50;
  _txt(ctx, 'AGENT       HR   MAP   CO   NOTE', 12, tableY - 10, '#555', 7, 'left');
  agents.forEach((ag, i) => {
    const y = tableY + i * 16;
    _txt(ctx, `${ag.name.padEnd(12)} ${ag.hr.padEnd(5)} ${ag.bp.padEnd(6)} ${ag.co.padEnd(5)} ${ag.note}`, 12, y, '#aaa', 7, 'left');
  });

  _txt(ctx, 'N₂O + volatile: additive ↑ PVR; avoid in pulm HTN', cx, H - 10, '#ff6666', 7);
}

// ─── SCENE: Respiratory / bronchodilation ─────────────────────────────────────

function _sceneRespiratory(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#030a06');
  const cx = W / 2, cy = H * .40;

  _txt(ctx, 'RESPIRATORY EFFECTS — VOLATILES', cx, 16, '#44ff88', 10);

  // Bronchi diagram — expanding = bronchodilation
  const expand = .6 + .4 * Math.abs(Math.sin(t * 1.2));
  const brW = 28 * expand, brH = 50 * expand;

  // Left bronchus
  ctx.save();
  ctx.strokeStyle = '#44ff88'; ctx.lineWidth = 2;
  _glow(ctx, '#00cc66', 8);
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy - 20);
  ctx.quadraticCurveTo(cx - 40, cy - 20, cx - 40 - brW * .3, cy + brH * .6);
  ctx.stroke();
  ctx.restore();

  // Right bronchus
  ctx.save();
  ctx.strokeStyle = '#44ff88'; ctx.lineWidth = 2;
  _glow(ctx, '#00cc66', 8);
  ctx.beginPath();
  ctx.moveTo(cx + 10, cy - 20);
  ctx.quadraticCurveTo(cx + 40, cy - 20, cx + 40 + brW * .3, cy + brH * .6);
  ctx.stroke();
  ctx.restore();

  // Trachea
  ctx.save();
  ctx.strokeStyle = '#44ff88'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx, cy - 50); ctx.lineTo(cx, cy - 20); ctx.stroke();
  ctx.restore();
  _txt(ctx, 'BRONCHODILATION', cx, cy - 60, '#44ff88', 9);

  const efx = [
    { t: 'All volatiles: bronchodilators', c: '#00ff88' },
    { t: 'Halothane: best bronchodilator historically', c: '#ffaa00' },
    { t: 'All volatiles: dose-dependent apnea', c: '#ff6666' },
    { t: 'Blunt hypoxic pulmonary vasoconstriction (HPV)', c: '#ff8844' },
    { t: 'Desflurane: irritant — ↑ secretions/laryngospasm', c: '#ff4488' },
    { t: 'CO₂ response curve shifts right & flattens', c: '#88aaff' },
  ];
  efx.forEach((e, i) => {
    _txt(ctx, e.t, cx, H * .62 + i * 16, e.c, 7);
  });

  _txt(ctx, 'Sevoflurane = airway-friendliest volatile for induction', cx, H - 10, '#444', 7);
}

// ─── SCENE: Safety / toxicity ─────────────────────────────────────────────────

function _sceneSafety(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#080204');
  const cx = W / 2;

  _txt(ctx, 'SAFETY & TOXICITY — VOLATILES', cx, 16, '#ff4444', 10);

  const hazards = [
    {
      title: 'Halothane Hepatitis',
      lines: ['Oxidative metabolism → TFA protein adducts', 'Type I: benign (mild transaminase ↑)', 'Type II: immune-mediated, fatal (1:35K)'],
      color: '#ff4444', y: H * .28,
    },
    {
      title: 'Compound A (Sevo)',
      lines: ['Sevo + CO₂ absorbent → Compound A', 'Nephrotoxic in rats; clinical significance low', 'Use ≥2 L/min fresh gas flow as precaution'],
      color: '#ff8844', y: H * .52,
    },
    {
      title: 'CO Production',
      lines: ['Des > Enf > Iso with desiccated absorbent (BaOH)', 'CO binds Hb → COHb, SpO₂ falsely normal', 'Prevent: keep absorbent moist, use fresh flows'],
      color: '#ffaa00', y: H * .76,
    },
  ];

  hazards.forEach((hz) => {
    const flash = .7 + .3 * Math.abs(Math.sin(t * 1.8));
    ctx.save();
    ctx.fillStyle = hz.color; ctx.globalAlpha = .07 * flash;
    ctx.fillRect(8, hz.y - 14, W - 16, 42);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = hz.color; ctx.lineWidth = 1;
    _glow(ctx, hz.color, 5 * flash);
    ctx.strokeRect(8, hz.y - 14, W - 16, 42);
    ctx.restore();
    _txt(ctx, hz.title, cx, hz.y - 2, hz.color, 9);
    hz.lines.forEach((l, li) => {
      _txt(ctx, l, cx, hz.y + 10 + li * 13, '#888', 7);
    });
  });

  _txt(ctx, 'MH trigger: all volatiles + succinylcholine', cx, H - 10, '#ff2222', 8);
}

// ─── SCENE: Agent properties ──────────────────────────────────────────────────

function _sceneAgent(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#030814');
  const cx = W / 2;

  _txt(ctx, 'INHALED AGENT PROPERTIES', cx, 16, '#ffaa00', 10);

  // Gas molecules drifting across canvas
  for (let i = 0; i < 16; i++) {
    const mx = ((i * 37 + t * 18) % (W - 20)) + 10;
    const my = 30 + (i * 43) % (H - 50);
    const sz = 2 + (i % 4);
    const alpha = .2 + .3 * Math.abs(Math.sin(t * .6 + i));
    ctx.save();
    ctx.fillStyle = `rgba(255,170,80,${alpha})`;
    _glow(ctx, '#ff8800', 3);
    ctx.beginPath(); ctx.arc(mx, my, sz, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  const agents = [
    { name: 'Sevoflurane', mac: '2.05', bg: '0.65',  vp: '160 mmHg', mw: '200', color: '#00ff88' },
    { name: 'Desflurane',  mac: '6.6',  bg: '0.45',  vp: '669 mmHg', mw: '168', color: '#ff8844' },
    { name: 'Isoflurane',  mac: '1.17', bg: '1.46',  vp: '240 mmHg', mw: '184', color: '#ffaa00' },
    { name: 'Halothane',   mac: '0.75', bg: '2.54',  vp: '243 mmHg', mw: '197', color: '#ff4488' },
    { name: 'N₂O',         mac: '104',  bg: '0.47',  vp: 'gas',      mw: '44',  color: '#88ddff' },
  ];

  const tableY = H * .30;
  _txt(ctx, 'AGENT        MAC   B:G   VP(mmHg)  MW', 10, tableY - 14, '#555', 7, 'left');
  agents.forEach((ag, i) => {
    const y = tableY + i * 18;
    const row = `${ag.name.padEnd(13)} ${ag.mac.padEnd(6)} ${ag.bg.padEnd(6)} ${ag.vp.padEnd(10)} ${ag.mw}`;
    _txt(ctx, row, 10, y, ag.color, 7, 'left');
  });

  // Meyer-Overton correlation
  ctx.save();
  ctx.strokeStyle = '#666'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(20, H * .74); ctx.lineTo(W - 20, H * .74); ctx.stroke();
  ctx.setLineDash([]); ctx.restore();
  _txt(ctx, 'Meyer-Overton: MAC ∝ 1/Oil:Gas coefficient', cx, H * .80, '#aa8844', 8);
  _txt(ctx, 'Potency ↑ as oil solubility ↑ (lipid theory)', cx, H * .88, '#665522', 7);

  _txt(ctx, 'Desflurane requires heated vaporizer (VP near atm)', cx, H - 10, '#888', 7);
}

// ─── SCENE: default OR ───────────────────────────────────────────────────────

function _sceneOR(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020510');
  const cx = W / 2, cy = H / 2;

  // Vaporizer schematic (simple box with dial)
  const vx = cx - 10, vy = cy - 30;
  ctx.save();
  ctx.fillStyle = 'rgba(40,40,80,.7)'; ctx.strokeStyle = '#4488ff'; ctx.lineWidth = 1.5;
  ctx.fillRect(vx - 36, vy - 20, 72, 48);
  ctx.strokeRect(vx - 36, vy - 20, 72, 48);
  ctx.restore();

  // Dial
  const dialAngle = -Math.PI / 4 + Math.sin(t * .4) * .3;
  ctx.save();
  ctx.strokeStyle = '#ffaa00'; ctx.lineWidth = 2;
  _glow(ctx, '#ff8800', 8);
  ctx.beginPath(); ctx.arc(vx, vy + 4, 12, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(vx, vy + 4);
  ctx.lineTo(vx + 12 * Math.cos(dialAngle), vy + 4 + 12 * Math.sin(dialAngle));
  ctx.stroke();
  ctx.restore();
  _txt(ctx, 'VAPORIZER', vx, vy + 28, '#4488ff', 8);

  // Gas flow arrows
  _arrow(ctx, cx + 38, vy + 4, cx + 80, vy + 4, '#00ff88', 2);
  _txt(ctx, 'Fresh Gas Flow →', cx + 78, vy - 8, '#00ff88', 7, 'right');

  // Patient silhouette
  ctx.save();
  ctx.fillStyle = '#ddaa88';
  ctx.beginPath(); ctx.arc(cx + 90, cy - 20, 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#5588aa';
  ctx.fillRect(cx + 80, cy - 10, 28, 18);
  ctx.restore();

  // Info panel
  ctx.save();
  ctx.fillStyle = 'rgba(4,8,24,.85)'; ctx.strokeStyle = 'rgba(80,100,200,.3)'; ctx.lineWidth = 1;
  ctx.fillRect(8, 8, 170, 52); ctx.strokeRect(8, 8, 170, 52);
  ctx.restore();
  _txt(ctx, '📚 BASICS OF ANESTHESIA', 93, 22, '#ffaa00', 7);
  _txt(ctx, 'CHAPTER 7: INHALED ANESTHETICS', 93, 36, '#88aaff', 8);
  _txt(ctx, (q.metadata?.topic || 'INHALED ANESTHETICS').toUpperCase(), 93, 50, '#44aaff', 8);

  // Breathing circuit indicator
  const breathPulse = .4 + .6 * Math.abs(Math.sin(t * 1.4));
  _txt(ctx, `SpO₂: 99%  EtCO₂: 35  AA: ${(2.0 + .1 * Math.sin(t * .5)).toFixed(1)}%`, cx, H - 10, `rgba(0,255,136,${breathPulse})`, 8);
}

// ─── Expose on window for dynamic dispatch ───────────────────────────────────
window.renderInhaledAnestheticsScene = renderInhaledAnestheticsScene;
window.stopInhaledAnestheticsScene   = stopInhaledAnestheticsScene;
