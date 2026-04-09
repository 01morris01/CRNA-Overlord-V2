/**
 * Pulmonary Physiology themed scene renderer — Chapter 5
 * Draws pulmonary-physiology-themed diagrams to #scn canvas
 * Aesthetic: dark neon medical arcade matching the rest of the app
 */

let _sceneRafId = null;
let _sceneTime  = 0;
let _sceneData  = null;

// Maps question topic keywords → visual category
const TOPIC_MAP = {
  // Pulmonary circulation / PVR
  pvr: 'circulation', 'pulmonary vascular': 'circulation', 'pulmonary artery': 'circulation',
  'pulmonary circulation': 'circulation', 'pulmonary blood': 'circulation',
  // HPV
  hpv: 'hpv', hypoxic: 'hpv', vasoconstriction: 'hpv',
  // West zones
  zone: 'zones', 'west zone': 'zones', 'starling': 'zones',
  // Oxyhemoglobin dissociation curve
  oxyhemoglobin: 'oxycurve', 'dissociation curve': 'oxycurve', 'p50': 'oxycurve',
  bohr: 'oxycurve', '2,3-dgp': 'oxycurve', '2,3-dpg': 'oxycurve',
  haldane: 'oxycurve', 'left shift': 'oxycurve', 'right shift': 'oxycurve',
  // Pulse oximetry
  'pulse ox': 'oximetry', spo2: 'oximetry', spо2: 'oximetry', oximetry: 'oximetry',
  carboxyhemoglobin: 'oximetry', methemoglobin: 'oximetry', cohb: 'oximetry',
  // Alveolar gas / A-a gradient
  alveolar: 'alveolar', 'a-a': 'alveolar', 'a−a': 'alveolar', 'pao2': 'alveolar',
  'alveolar gas': 'alveolar', altitude: 'alveolar',
  // Shunt / V/Q
  shunt: 'shunt', 'v/q': 'shunt', 'vq': 'shunt', 'p/f': 'shunt', ards: 'shunt',
  // CO2 transport / chemoreceptors / ventilation control
  co2: 'co2transport', bicarbonate: 'co2transport', carbamin: 'co2transport',
  hypercapnia: 'co2transport', chemoreceptor: 'co2transport', carotid: 'co2transport',
  medulla: 'co2transport', opioid: 'co2transport', ventilat: 'co2transport',
  // Dead space / lung volumes / Fick
  dead: 'lungvol', frc: 'lungvol', tidal: 'lungvol', 'lung volume': 'lungvol',
  fick: 'lungvol', vo2: 'lungvol', svo2: 'lungvol', oxygen: 'lungvol',
};

function getCategory(q) {
  const topic = (q.metadata?.topicId || q.metadata?.topic || '').toLowerCase();
  const text  = (q.prompt || q.q || '').toLowerCase();
  const combined = topic + ' ' + text;
  for (const [key, cat] of Object.entries(TOPIC_MAP)) {
    if (combined.includes(key)) return cat;
  }
  return 'default';
}

export function renderPulmonaryPhysiologyScene(q) {
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

export function stopPulmonaryPhysiologyScene() {
  if (_sceneRafId) { cancelAnimationFrame(_sceneRafId); _sceneRafId = null; }
}

// ─── draw dispatcher ─────────────────────────────────────────────────────────

function _drawScene(ctx, W, H, data, t) {
  switch (data.category) {
    case 'circulation':  _sceneCirculation(ctx, W, H, data.q, t);  break;
    case 'hpv':          _sceneHPV(ctx, W, H, data.q, t);          break;
    case 'zones':        _sceneWestZones(ctx, W, H, data.q, t);    break;
    case 'oxycurve':     _sceneOxyCurve(ctx, W, H, data.q, t);     break;
    case 'oximetry':     _sceneOximetry(ctx, W, H, data.q, t);     break;
    case 'alveolar':     _sceneAlveolar(ctx, W, H, data.q, t);     break;
    case 'shunt':        _sceneShunt(ctx, W, H, data.q, t);        break;
    case 'co2transport': _sceneCO2(ctx, W, H, data.q, t);          break;
    case 'lungvol':      _sceneLungVol(ctx, W, H, data.q, t);      break;
    default:             _sceneDefault(ctx, W, H, data.q, t);      break;
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

// ─── Scene: Pulmonary Circulation / PVR ──────────────────────────────────────
function _sceneCirculation(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020815');
  // Animated pulmonary artery flow
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);
  ctx.save();
  _glow(ctx, '#00bfff', 12 * pulse);
  // Right heart → lungs → left heart
  ctx.strokeStyle = `rgba(0,191,255,${0.6 + 0.4 * pulse})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W * 0.1, H * 0.5);
  ctx.bezierCurveTo(W * 0.2, H * 0.2, W * 0.4, H * 0.15, W * 0.5, H * 0.3);
  ctx.bezierCurveTo(W * 0.6, H * 0.15, W * 0.8, H * 0.2, W * 0.9, H * 0.5);
  ctx.stroke();
  ctx.restore();

  // Labels
  _txt(ctx, 'PA', W * 0.5, H * 0.2, '#00bfff', 9);
  _txt(ctx, 'RV', W * 0.1, H * 0.55, '#4fc3f7', 9);
  _txt(ctx, 'LV', W * 0.9, H * 0.55, '#4fc3f7', 9);

  // PVR formula
  _txt(ctx, 'PVR = (mPAP − PCWP) / CO × 80', W / 2, H * 0.72, '#26c6da', 8);
  _txt(ctx, 'Normal: 50-150 dyn·s·cm⁻⁵', W / 2, H * 0.82, '#b0bec5', 8);
  _txt(ctx, 'PULMONARY CIRCULATION', W / 2, H * 0.92, '#00e5ff', 9);
}

// ─── Scene: Hypoxic Pulmonary Vasoconstriction ───────────────────────────────
function _sceneHPV(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#080508');
  const pulse = 0.5 + 0.5 * Math.sin(t * 2.5);

  // Alveolus — left (hypoxic, vasoconstricted)
  ctx.save();
  _glow(ctx, '#ff1744', 8);
  ctx.strokeStyle = '#ff1744';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(W * 0.28, H * 0.38, 28, 0, Math.PI * 2);
  ctx.stroke();
  _txt(ctx, 'Low PO₂', W * 0.28, H * 0.38, '#ff6b6b', 8);
  // Vasoconstricted vessel
  ctx.strokeStyle = `rgba(255,82,82,${0.6 + 0.4 * pulse})`;
  ctx.lineWidth = 2 + pulse;
  ctx.beginPath();
  ctx.moveTo(W * 0.28, H * 0.52);
  ctx.lineTo(W * 0.28, H * 0.72);
  ctx.stroke();
  _txt(ctx, 'HPV ↑PVR', W * 0.28, H * 0.8, '#ff5252', 8);
  ctx.restore();

  // Alveolus — right (normoxic, vasodilated)
  ctx.save();
  _glow(ctx, '#00e676', 8);
  ctx.strokeStyle = '#00e676';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(W * 0.72, H * 0.38, 28, 0, Math.PI * 2);
  ctx.stroke();
  _txt(ctx, 'Normal PO₂', W * 0.72, H * 0.38, '#69f0ae', 8);
  ctx.strokeStyle = '#00e676';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(W * 0.72, H * 0.52);
  ctx.lineTo(W * 0.72, H * 0.72);
  ctx.stroke();
  _txt(ctx, '↑ Blood Flow', W * 0.72, H * 0.8, '#00e676', 8);
  ctx.restore();

  _txt(ctx, 'HYPOXIC PULMONARY VASOCONSTRICTION', W / 2, H * 0.92, '#ff4081', 8);
}

// ─── Scene: West Lung Zones ───────────────────────────────────────────────────
function _sceneWestZones(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020a12');
  const lung_x = W * 0.25, lung_w = W * 0.5;
  const zone_h = H * 0.22;

  // Zone 1 (apex, top)
  ctx.fillStyle = 'rgba(255,82,82,0.25)';
  ctx.fillRect(lung_x, H * 0.06, lung_w, zone_h);
  _txt(ctx, 'ZONE 1  PA > Pa > Pv', W * 0.5, H * 0.17, '#ff5252', 9);
  _txt(ctx, 'No flow', W * 0.87, H * 0.17, '#ff8a80', 8);

  // Zone 2 (middle)
  ctx.fillStyle = 'rgba(255,213,79,0.25)';
  ctx.fillRect(lung_x, H * 0.06 + zone_h, lung_w, zone_h);
  _txt(ctx, 'ZONE 2  Pa > PA > Pv', W * 0.5, H * 0.39, '#ffd740', 9);
  _txt(ctx, 'Pa−PA', W * 0.87, H * 0.39, '#ffe57f', 8);

  // Zone 3 (base)
  ctx.fillStyle = 'rgba(0,230,118,0.25)';
  ctx.fillRect(lung_x, H * 0.06 + zone_h * 2, lung_w, zone_h);
  _txt(ctx, 'ZONE 3  Pa > Pv > PA', W * 0.5, H * 0.61, '#00e676', 9);
  _txt(ctx, 'Pa−Pv', W * 0.87, H * 0.61, '#69f0ae', 8);

  // Gravity arrow
  ctx.save();
  _glow(ctx, '#90caf9', 6);
  ctx.strokeStyle = '#90caf9';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W * 0.1, H * 0.1);
  ctx.lineTo(W * 0.1, H * 0.75);
  ctx.stroke();
  ctx.fillStyle = '#90caf9';
  ctx.beginPath();
  ctx.moveTo(W * 0.1, H * 0.77);
  ctx.lineTo(W * 0.08, H * 0.73);
  ctx.lineTo(W * 0.12, H * 0.73);
  ctx.fill();
  ctx.restore();
  _txt(ctx, 'g', W * 0.1, H * 0.82, '#90caf9', 9);

  _txt(ctx, 'WEST LUNG ZONES', W / 2, H * 0.9, '#40c4ff', 9);
}

// ─── Scene: Oxyhemoglobin Dissociation Curve ─────────────────────────────────
function _sceneOxyCurve(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020510');

  const ox = W * 0.15, oy = H * 0.82, ow = W * 0.7, oh = H * 0.65;

  // Axes
  ctx.save();
  ctx.strokeStyle = '#546e7a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ox, oy - oh); ctx.lineTo(ox, oy); ctx.lineTo(ox + ow, oy);
  ctx.stroke();
  _txt(ctx, 'PO₂ (mmHg)', ox + ow / 2, H * 0.9, '#78909c', 8);
  _txt(ctx, 'SaO₂%', ox - 22, oy - oh / 2, '#78909c', 8);
  ctx.restore();

  // Normal curve (sigmoidal)
  const curve = (x) => {
    const n = 2.7, p50 = 0.38; // normalized P50 along x-axis
    return Math.pow(x, n) / (Math.pow(p50, n) + Math.pow(x, n));
  };

  ctx.save();
  _glow(ctx, '#42a5f5', 8);
  ctx.strokeStyle = '#42a5f5';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 100; i++) {
    const x = ox + (i / 100) * ow;
    const y = oy - curve(i / 100) * oh;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  // Right shift (red)
  const shift = 0.08 * (0.5 + 0.5 * Math.sin(t * 1.5));
  ctx.save();
  ctx.strokeStyle = 'rgba(255,82,82,0.7)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  for (let i = 0; i <= 100; i++) {
    const x = ox + (i / 100) * ow;
    const y = oy - curve(Math.max(0, i / 100 - shift)) * oh;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  // P50 marker
  const p50x = ox + 0.38 * ow;
  ctx.save();
  ctx.strokeStyle = '#ffd740';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(p50x, oy); ctx.lineTo(p50x, oy - 0.5 * oh);
  ctx.stroke();
  ctx.restore();
  _txt(ctx, 'P50=27', p50x, oy - 0.5 * oh - 6, '#ffd740', 7);

  // Key points
  _txt(ctx, '90%→PO₂60', ox + 0.5 * ow + 8, oy - 0.9 * oh + 2, '#a5d6a7', 7);
  _txt(ctx, 'OXY-Hb DISSOCIATION CURVE', W / 2, H * 0.07, '#40c4ff', 9);
  _txt(ctx, 'Blue=normal  Red=↑P50 right-shift', W / 2, H * 0.95, '#78909c', 7);
}

// ─── Scene: Pulse Oximetry ────────────────────────────────────────────────────
function _sceneOximetry(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#030a0a');
  const pulse = 0.5 + 0.5 * Math.sin(t * 4);

  // Waveform
  ctx.save();
  _glow(ctx, '#00e5ff', 10 * pulse);
  ctx.strokeStyle = `rgba(0,229,255,${0.7 + 0.3 * pulse})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < W; i++) {
    const phase = (i / W) * Math.PI * 6 - t * 3;
    const amp = H * 0.12 * Math.max(0, Math.sin(phase) * Math.exp(-Math.pow(((phase % (Math.PI * 2)) - Math.PI) / 1.2, 2)));
    const y = H * 0.45 - amp;
    i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
  }
  ctx.stroke();
  ctx.restore();

  // SpO₂ display
  _txt(ctx, 'SpO₂', W / 2, H * 0.65, '#b0bec5', 9);
  ctx.save();
  _glow(ctx, '#00e5ff', 15);
  _txt(ctx, '97%', W / 2, H * 0.73, '#00e5ff', 22);
  ctx.restore();

  // Interference table
  const items = [
    { label: 'COHb', effect: '→ falsely HIGH (~100%)', color: '#ef9a9a' },
    { label: 'MetHb', effect: '→ trends to 85%', color: '#ce93d8' },
    { label: 'Low perf', effect: '→ poor signal', color: '#fff176' },
  ];
  items.forEach((item, i) => {
    _txt(ctx, `${item.label}: ${item.effect}`, W / 2, H * 0.85 + i * 12, item.color, 7);
  });

  _txt(ctx, 'PULSE OXIMETRY', W / 2, H * 0.06, '#00e5ff', 10);
}

// ─── Scene: Alveolar Gas Equation / Altitude ─────────────────────────────────
function _sceneAlveolar(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#03050a');

  // Animated alveolus
  const breathe = 0.5 + 0.5 * Math.sin(t * 2);
  const r = 38 + breathe * 10;
  ctx.save();
  _glow(ctx, '#80cbc4', 10);
  ctx.strokeStyle = '#80cbc4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(W / 2, H * 0.35, r, 0, Math.PI * 2);
  ctx.stroke();
  _txt(ctx, 'Alveolus', W / 2, H * 0.35, '#b2dfdb', 8);
  ctx.restore();

  // O₂ and CO₂ molecules
  _txt(ctx, 'O₂', W / 2 - r - 14, H * 0.35, '#42a5f5', 10);
  _txt(ctx, 'CO₂', W / 2 + r + 18, H * 0.35, '#ef5350', 10);

  // Equation
  _txt(ctx, 'PAO₂ = FiO₂(Patm − 47) − PaCO₂/R', W / 2, H * 0.6, '#e0f7fa', 8);
  _txt(ctx, 'Sea level: PAO₂ ≈ 100 mmHg', W / 2, H * 0.69, '#b2dfdb', 8);
  _txt(ctx, 'A-a gradient = PAO₂ − PaO₂', W / 2, H * 0.78, '#80deea', 8);
  _txt(ctx, 'Normal A-a: 5–15 mmHg', W / 2, H * 0.86, '#80cbc4', 7);
  _txt(ctx, 'ALVEOLAR GAS EQUATION', W / 2, H * 0.93, '#00bcd4', 9);
}

// ─── Scene: Shunt / V/Q / P-F Ratio ──────────────────────────────────────────
function _sceneShunt(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#050205');

  // Ventilated alveolus
  ctx.save();
  _glow(ctx, '#69f0ae', 8);
  ctx.strokeStyle = '#69f0ae';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(W * 0.65, H * 0.32, 30, 0, Math.PI * 2);
  ctx.stroke();
  _txt(ctx, 'V/Q=1', W * 0.65, H * 0.32, '#b9f6ca', 8);
  ctx.restore();

  // Shunted alveolus (collapsed, no ventilation)
  ctx.save();
  _glow(ctx, '#ff1744', 6);
  ctx.strokeStyle = '#ff1744';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.arc(W * 0.35, H * 0.32, 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  _txt(ctx, 'V/Q=0', W * 0.35, H * 0.32, '#ff8a80', 8);
  ctx.restore();

  // Blood bypassing
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);
  ctx.save();
  ctx.strokeStyle = `rgba(255,82,82,${0.5 + 0.5 * pulse})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W * 0.35, H * 0.5);
  ctx.quadraticCurveTo(W * 0.35, H * 0.72, W * 0.5, H * 0.72);
  ctx.stroke();
  ctx.restore();

  // P/F ratio ladder
  const pf = [
    { label: '≤300 Mild ARDS', color: '#fff176' },
    { label: '≤200 Mod ARDS', color: '#ffb74d' },
    { label: '≤100 Sev ARDS', color: '#ef5350' },
  ];
  pf.forEach((p, i) => _txt(ctx, p.label, W / 2, H * 0.55 + i * 11, p.color, 7));

  _txt(ctx, 'SHUNT · V/Q · P/F RATIO', W / 2, H * 0.9, '#ff4081', 9);
}

// ─── Scene: CO₂ Transport / Chemoreceptors / Ventilation ─────────────────────
function _sceneCO2(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#040a05');

  // CO₂ transport pie approximation
  const slices = [
    { pct: 0.70, color: '#42a5f5', label: '70% HCO₃⁻' },
    { pct: 0.22, color: '#ab47bc', label: '22% CarbHb' },
    { pct: 0.08, color: '#26c6da', label: '8% dissolved' },
  ];
  const cx = W * 0.3, cy = H * 0.38, pr = 38;
  let angle = -Math.PI / 2;
  slices.forEach(s => {
    const end = angle + s.pct * Math.PI * 2;
    ctx.save();
    _glow(ctx, s.color, 8);
    ctx.fillStyle = s.color + '99';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, pr, angle, end);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    angle = end;
  });
  slices.forEach((s, i) => _txt(ctx, s.label, W * 0.62, H * 0.25 + i * 14, s.color, 8));

  // Chemoreceptor summary
  _txt(ctx, 'CENTRAL: medulla, CSF pH (CO₂)', W / 2, H * 0.62, '#80cbc4', 7);
  _txt(ctx, 'PERIPHERAL: carotid/aortic, PO₂', W / 2, H * 0.71, '#a5d6a7', 7);
  _txt(ctx, 'Opioids & volatiles → ↓ HVR', W / 2, H * 0.80, '#ffcc80', 7);
  _txt(ctx, 'CO₂ TRANSPORT · CHEMORECEPTORS', W / 2, H * 0.91, '#00e676', 9);
}

// ─── Scene: Lung Volumes / Fick / Dead Space ─────────────────────────────────
function _sceneLungVol(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#02050a');
  const breathe = 0.5 + 0.5 * Math.sin(t * 1.8);

  // Stacked lung volume bars
  const bars = [
    { label: 'IRV', h: 0.25, color: '#42a5f5' },
    { label: 'VT',  h: 0.10, color: '#66bb6a' },
    { label: 'ERV', h: 0.12, color: '#ffa726' },
    { label: 'RV',  h: 0.10, color: '#ef5350' },
  ];
  const bx = W * 0.12, bw = W * 0.28;
  let by = H * 0.08;
  bars.forEach(b => {
    const bh = H * b.h;
    ctx.save();
    _glow(ctx, b.color, 5);
    ctx.fillStyle = b.color + '55';
    ctx.strokeStyle = b.color;
    ctx.lineWidth = 1.5;
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeRect(bx, by, bw, bh);
    _txt(ctx, b.label, bx + bw / 2, by + bh / 2, b.color, 8);
    ctx.restore();
    by += bh;
  });

  // FRC bracket
  const frc_top = H * 0.08 + H * (0.25 + 0.10); // top of ERV
  const frc_h   = H * (0.12 + 0.10);
  ctx.save();
  ctx.strokeStyle = '#ffd740';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(bx + bw + 4, frc_top);
  ctx.lineTo(bx + bw + 12, frc_top);
  ctx.lineTo(bx + bw + 12, frc_top + frc_h);
  ctx.lineTo(bx + bw + 4, frc_top + frc_h);
  ctx.stroke();
  _txt(ctx, 'FRC', bx + bw + 20, frc_top + frc_h / 2, '#ffd740', 8);
  ctx.restore();

  // Fick equation
  _txt(ctx, 'FICK:  VO₂ = CO × (CaO₂ − CvO₂)', W * 0.65, H * 0.42, '#80deea', 8);
  _txt(ctx, 'Normal SvO₂: 70–75%', W * 0.65, H * 0.52, '#b2dfdb', 7);
  _txt(ctx, 'DO₂ = CO × CaO₂ × 10', W * 0.65, H * 0.62, '#80cbc4', 7);
  _txt(ctx, 'CaO₂ = Hb×SaO₂×1.34 + 0.003×PaO₂', W * 0.65, H * 0.72, '#4fc3f7', 7);

  _txt(ctx, 'LUNG VOLUMES · FICK · DEAD SPACE', W / 2, H * 0.9, '#40c4ff', 9);
}

// ─── Scene: Default ──────────────────────────────────────────────────────────
function _sceneDefault(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020510');
  const pulse = 0.5 + 0.5 * Math.sin(t * 2);

  // Animated lung outline
  ctx.save();
  _glow(ctx, '#42a5f5', 12 * pulse);
  ctx.strokeStyle = `rgba(66,165,245,${0.6 + 0.4 * pulse})`;
  ctx.lineWidth = 2;
  // Left lobe
  ctx.beginPath();
  ctx.ellipse(W * 0.36, H * 0.42, 32, 48, -0.2, 0, Math.PI * 2);
  ctx.stroke();
  // Right lobe
  ctx.beginPath();
  ctx.ellipse(W * 0.64, H * 0.42, 38, 48, 0.2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Trachea
  ctx.save();
  ctx.strokeStyle = '#90caf9';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W / 2, H * 0.12);
  ctx.lineTo(W / 2, H * 0.26);
  ctx.lineTo(W * 0.38, H * 0.32);
  ctx.moveTo(W / 2, H * 0.26);
  ctx.lineTo(W * 0.62, H * 0.32);
  ctx.stroke();
  ctx.restore();

  _txt(ctx, 'PULMONARY PHYSIOLOGY', W / 2, H * 0.84, '#40c4ff', 10);
  _txt(ctx, 'Chapter 5', W / 2, H * 0.92, '#78909c', 8);
}

// ─── wire up window globals ───────────────────────────────────────────────────
window.renderPulmonaryPhysiologyScene = renderPulmonaryPhysiologyScene;
window.stopPulmonaryPhysiologyScene   = stopPulmonaryPhysiologyScene;
