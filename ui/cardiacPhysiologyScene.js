/**
 * Cardiac Physiology themed scene renderer — Chapter 4
 * Draws cardiac-physiology-themed diagrams to #scn canvas
 * Aesthetic: dark neon medical arcade matching the rest of the app
 */

let _sceneRafId = null;
let _sceneTime  = 0;
let _sceneData  = null;

// Maps question topic keywords → visual category
const TOPIC_MAP = {
  // Cellular / conduction
  'gap junction': 'conduction', syncytium: 'conduction', intercalated: 'conduction',
  'action potential': 'conduction', depolarization: 'conduction', repolarization: 'conduction',
  'pacemaker': 'conduction', 'sa node': 'conduction', 'av node': 'conduction',
  'purkinje': 'conduction', bachmann: 'conduction', 'bundle of his': 'conduction',
  automaticity: 'conduction', sodium: 'conduction', potassium: 'conduction',
  // Anatomy
  'myocardium': 'anatomy', 'endocardium': 'anatomy', 'epicardium': 'anatomy',
  'pericardium': 'anatomy', 'heart wall': 'anatomy', 'wall layer': 'anatomy',
  'valve': 'anatomy', 'mitral': 'anatomy', 'tricuspid': 'anatomy',
  'aortic valve': 'anatomy', 'pulmonic': 'anatomy', semilunar: 'anatomy',
  atrioventricular: 'anatomy', 'papillary': 'anatomy', 'chordae': 'anatomy',
  'fibrous skeleton': 'anatomy',
  // Coronary circulation
  'coronary': 'coronary', lad: 'coronary', circumflex: 'coronary', rca: 'coronary',
  'coronary sinus': 'coronary', thebesian: 'coronary', 'anterior cardiac vein': 'coronary',
  'coronary perfusion': 'coronary', 'oxygen extraction': 'coronary', 'lvedp': 'coronary',
  // Hemodynamics: MAP, SVR, CO, SV
  map: 'hemodynamics', svr: 'hemodynamics', 'cardiac output': 'hemodynamics',
  'cardiac index': 'hemodynamics', 'stroke volume': 'hemodynamics', 'heart rate': 'hemodynamics',
  'ejection fraction': 'hemodynamics', 'end-diastolic': 'hemodynamics',
  'end-systolic': 'hemodynamics', poiseuille: 'hemodynamics', resistance: 'hemodynamics',
  'flow rate': 'hemodynamics', viscosity: 'hemodynamics', radius: 'hemodynamics',
  // Preload / Frank-Starling / compliance
  preload: 'starling', 'frank-starling': 'starling', 'venous return': 'starling',
  'end-diastolic volume': 'starling', compliance: 'starling', filling: 'starling',
  'cvp': 'starling', 'pcwp': 'starling', hypovolemia: 'starling',
  tamponade: 'starling', pneumothorax: 'starling', 'pulsus paradoxus': 'starling',
  'systolic pressure variation': 'starling',
  // Afterload / Laplace / contractility
  afterload: 'afterload', laplace: 'afterload', 'wall stress': 'afterload',
  contractility: 'afterload', inotropy: 'afterload', hypotension: 'afterload',
  // ANS / reflexes
  sympathetic: 'ans', parasympathetic: 'ans', 'beta-1': 'ans', muscarinic: 'ans',
  baroreceptor: 'ans', bainbridge: 'ans', oculocardiac: 'ans', cushing: 'ans',
  brainstem: 'ans', 'vagus nerve': 'ans', 'glossopharyngeal': 'ans',
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

export function renderCardiacPhysiologyScene(q) {
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

export function stopCardiacPhysiologyScene() {
  if (_sceneRafId) { cancelAnimationFrame(_sceneRafId); _sceneRafId = null; }
}

// ─── draw dispatcher ─────────────────────────────────────────────────────────

function _drawScene(ctx, W, H, data, t) {
  switch (data.category) {
    case 'conduction':   _sceneConduction(ctx, W, H, data.q, t);  break;
    case 'anatomy':      _sceneAnatomy(ctx, W, H, data.q, t);     break;
    case 'coronary':     _sceneCoronary(ctx, W, H, data.q, t);    break;
    case 'hemodynamics': _sceneHemo(ctx, W, H, data.q, t);        break;
    case 'starling':     _sceneStarling(ctx, W, H, data.q, t);    break;
    case 'afterload':    _sceneAfterload(ctx, W, H, data.q, t);   break;
    case 'ans':          _sceneANS(ctx, W, H, data.q, t);         break;
    default:             _sceneDefault(ctx, W, H, data.q, t);     break;
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

// ─── Scene: Cardiac Conduction / Action Potential ────────────────────────────
function _sceneConduction(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020510');
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);

  // ECG waveform
  ctx.save();
  _glow(ctx, '#00e5ff', 10 * pulse);
  ctx.strokeStyle = `rgba(0,229,255,${0.7 + 0.3 * pulse})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < W; i++) {
    const phase = ((i / W) * 4 + t * 0.5) % 1;
    let y = H * 0.4;
    if (phase < 0.08) y -= H * 0.04 * Math.sin(phase / 0.08 * Math.PI);       // P wave
    else if (phase < 0.18) y += H * 0.02 * Math.sin((phase - 0.08) / 0.04 * Math.PI); // Q
    else if (phase < 0.22) y -= H * 0.22 * Math.sin((phase - 0.18) / 0.04 * Math.PI); // R
    else if (phase < 0.28) y += H * 0.06 * Math.sin((phase - 0.22) / 0.06 * Math.PI); // S
    else if (phase > 0.45 && phase < 0.65) y -= H * 0.06 * Math.sin((phase - 0.45) / 0.20 * Math.PI); // T
    i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
  }
  ctx.stroke();
  ctx.restore();

  // Conduction pathway labels
  const nodes = [
    { label: 'SA', x: W * 0.2, y: H * 0.65, color: '#ffd740' },
    { label: 'AV', x: W * 0.5, y: H * 0.65, color: '#ffab40' },
    { label: 'HIS', x: W * 0.65, y: H * 0.72, color: '#ff7043' },
    { label: 'PKJ', x: W * 0.82, y: H * 0.72, color: '#ef5350' },
  ];
  nodes.forEach((n, i) => {
    ctx.save();
    _glow(ctx, n.color, 8 * pulse);
    ctx.strokeStyle = n.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    _txt(ctx, n.label, n.x, n.y, n.color, 7);
    if (i < nodes.length - 1) {
      ctx.save();
      ctx.strokeStyle = nodes[i + 1].color + 'aa';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(n.x + 10, n.y);
      ctx.lineTo(nodes[i + 1].x - 10, nodes[i + 1].y);
      ctx.stroke();
      ctx.restore();
    }
  });

  _txt(ctx, 'CARDIAC CONDUCTION', W / 2, H * 0.9, '#40c4ff', 10);
}

// ─── Scene: Heart Wall / Valve Anatomy ───────────────────────────────────────
function _sceneAnatomy(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020810');
  const pulse = 0.5 + 0.5 * Math.sin(t * 1.8);

  // Heart cross-section — simple 4-chamber sketch
  const cx = W / 2, cy = H * 0.44;
  ctx.save();
  _glow(ctx, '#ef5350', 12 * pulse);
  ctx.strokeStyle = `rgba(239,83,80,${0.5 + 0.5 * pulse})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 52, 58, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Septum (vertical)
  ctx.save();
  ctx.strokeStyle = '#ef5350aa';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 50); ctx.lineTo(cx, cy + 50);
  ctx.stroke();
  ctx.restore();

  // Chamber labels
  _txt(ctx, 'RA', cx - 24, cy - 18, '#ef9a9a', 8);
  _txt(ctx, 'LA', cx + 24, cy - 18, '#ef9a9a', 8);
  _txt(ctx, 'RV', cx - 24, cy + 18, '#ef9a9a', 8);
  _txt(ctx, 'LV', cx + 24, cy + 18, '#ef9a9a', 8);

  // Layer labels
  const layers = [
    { label: 'Pericardium', y: H * 0.82, color: '#80cbc4' },
    { label: 'Epicardium', y: H * 0.87, color: '#a5d6a7' },
    { label: 'Myocardium', y: H * 0.87 + 11, color: '#ffcc80' },
    { label: 'Endocardium', y: H * 0.87 + 22, color: '#f48fb1' },
  ];
  layers.forEach(l => _txt(ctx, l.label, W / 2, l.y, l.color, 7));

  _txt(ctx, 'HEART ANATOMY', W / 2, H * 0.06, '#40c4ff', 10);
}

// ─── Scene: Coronary Circulation ─────────────────────────────────────────────
function _sceneCoronary(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#030508');
  const pulse = 0.5 + 0.5 * Math.sin(t * 2);

  // Aortic root
  ctx.save();
  _glow(ctx, '#ff7043', 10 * pulse);
  ctx.strokeStyle = '#ff7043';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 12, H * 0.1);
  ctx.lineTo(W / 2 - 12, H * 0.25);
  ctx.moveTo(W / 2 + 12, H * 0.1);
  ctx.lineTo(W / 2 + 12, H * 0.25);
  ctx.stroke();
  _txt(ctx, 'Aorta', W / 2, H * 0.08, '#ff8a65', 8);
  ctx.restore();

  // LCA and RCA branches
  const vessels = [
    { label: 'LAD', x1: W / 2 - 12, y1: H * 0.25, x2: W * 0.2, y2: H * 0.6, color: '#42a5f5' },
    { label: 'LCx', x1: W / 2 - 12, y1: H * 0.25, x2: W * 0.3, y2: H * 0.7, color: '#5c6bc0' },
    { label: 'RCA', x1: W / 2 + 12, y1: H * 0.25, x2: W * 0.75, y2: H * 0.65, color: '#66bb6a' },
  ];
  vessels.forEach(v => {
    ctx.save();
    _glow(ctx, v.color, 6);
    ctx.strokeStyle = v.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(v.x1, v.y1);
    ctx.quadraticCurveTo((v.x1 + v.x2) / 2, v.y1 + 40, v.x2, v.y2);
    ctx.stroke();
    _txt(ctx, v.label, v.x2, v.y2 + 10, v.color, 8);
    ctx.restore();
  });

  // Coronary sinus
  ctx.save();
  ctx.strokeStyle = '#ab47bcaa';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(W * 0.25, H * 0.72);
  ctx.quadraticCurveTo(W / 2, H * 0.82, W * 0.7, H * 0.76);
  ctx.stroke();
  ctx.restore();
  _txt(ctx, 'Coronary sinus → RA', W / 2, H * 0.87, '#ce93d8', 7);

  _txt(ctx, 'CPP = AoDBP − LVEDP', W / 2, H * 0.93, '#ffd740', 8);
  _txt(ctx, 'CORONARY CIRCULATION', W / 2, H * 0.97, '#ff7043', 9);
}

// ─── Scene: Hemodynamics (CO, SVR, MAP, Poiseuille) ──────────────────────────
function _sceneHemo(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#030203');
  const pulse = 0.5 + 0.5 * Math.sin(t * 2.5);

  // MAP gauge
  const gaugeX = W * 0.25, gaugeY = H * 0.38, gaugeR = 34;
  ctx.save();
  _glow(ctx, '#42a5f5', 10 * pulse);
  ctx.strokeStyle = '#546e7a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(gaugeX, gaugeY, gaugeR, Math.PI, 2 * Math.PI);
  ctx.stroke();
  const needleAngle = Math.PI + (0.6 + 0.2 * Math.sin(t)) * Math.PI;
  ctx.strokeStyle = '#42a5f5';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(gaugeX, gaugeY);
  ctx.lineTo(gaugeX + (gaugeR - 8) * Math.cos(needleAngle), gaugeY + (gaugeR - 8) * Math.sin(needleAngle));
  ctx.stroke();
  ctx.restore();
  _txt(ctx, 'MAP', gaugeX, gaugeY + 12, '#90caf9', 8);

  // Equations
  const eqs = [
    { text: 'MAP = CO × SVR', color: '#42a5f5' },
    { text: 'CO = HR × SV', color: '#66bb6a' },
    { text: 'SV = EDV − ESV', color: '#ffd740' },
    { text: 'EF = SV/EDV × 100', color: '#ff7043' },
    { text: 'SVR = 80×(MAP−CVP)/CO', color: '#ab47bc' },
    { text: 'Poiseuille: Q ∝ r⁴/L', color: '#80deea' },
  ];
  eqs.forEach((e, i) => _txt(ctx, e.text, W * 0.66, H * 0.22 + i * 14, e.color, 7));

  _txt(ctx, 'HEMODYNAMICS', W / 2, H * 0.9, '#40c4ff', 10);
}

// ─── Scene: Preload / Frank-Starling / Compliance ────────────────────────────
function _sceneStarling(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020508');

  // Axes
  const ox = W * 0.13, oy = H * 0.80, ow = W * 0.72, oh = H * 0.60;
  ctx.save();
  ctx.strokeStyle = '#546e7a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ox, oy - oh); ctx.lineTo(ox, oy); ctx.lineTo(ox + ow, oy);
  ctx.stroke();
  _txt(ctx, 'Preload (EDV)', ox + ow / 2, H * 0.88, '#78909c', 8);
  _txt(ctx, 'SV / CO', ox - 20, oy - oh / 2, '#78909c', 8);
  ctx.restore();

  // Normal F-S curve
  ctx.save();
  _glow(ctx, '#42a5f5', 8);
  ctx.strokeStyle = '#42a5f5';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 100; i++) {
    const x = ox + (i / 100) * ow;
    const n = i / 100;
    const y = oy - oh * (1 - Math.exp(-3 * n)) * (1 - 0.25 * n);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  // Improved (up-left shift)
  ctx.save();
  ctx.strokeStyle = '#66bb6a99';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  for (let i = 0; i <= 100; i++) {
    const x = ox + (i / 100) * ow;
    const n = i / 100;
    const y = oy - oh * 1.2 * (1 - Math.exp(-3 * n)) * (1 - 0.25 * n);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  // Depressed (down-right shift)
  ctx.save();
  ctx.strokeStyle = '#ef535099';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  for (let i = 0; i <= 100; i++) {
    const x = ox + (i / 100) * ow;
    const n = i / 100;
    const y = oy - oh * 0.65 * (1 - Math.exp(-2.5 * n)) * (1 - 0.25 * n);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  _txt(ctx, 'Blue=normal  Green=↑inotropy  Red=↓inotropy', W / 2, H * 0.94, '#78909c', 7);
  _txt(ctx, 'FRANK-STARLING / PRELOAD', W / 2, H * 0.07, '#40c4ff', 10);
}

// ─── Scene: Afterload / Laplace / Contractility ───────────────────────────────
function _sceneAfterload(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#050205');
  const pulse = 0.5 + 0.5 * Math.sin(t * 2);

  // Dilated LV (high afterload)
  ctx.save();
  const r = 36 + 8 * pulse;
  _glow(ctx, '#ef5350', 10 * pulse);
  ctx.strokeStyle = '#ef5350';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(W * 0.3, H * 0.4, r, r + 4, 0, 0, Math.PI * 2);
  ctx.stroke();
  _txt(ctx, '↑ Afterload', W * 0.3, H * 0.4, '#ef9a9a', 7);
  _txt(ctx, '↓ SV, EF, CO', W * 0.3, H * 0.55, '#ef5350', 7);
  ctx.restore();

  // Normal LV (optimal)
  ctx.save();
  _glow(ctx, '#66bb6a', 8);
  ctx.strokeStyle = '#66bb6a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(W * 0.72, H * 0.4, 28, 32, 0, 0, Math.PI * 2);
  ctx.stroke();
  _txt(ctx, 'Normal', W * 0.72, H * 0.4, '#a5d6a7', 7);
  ctx.restore();

  // Laplace formula
  _txt(ctx, 'LAW OF LAPLACE:', W / 2, H * 0.68, '#ffd740', 8);
  _txt(ctx, 'σ = P × r / (2T)', W / 2, H * 0.76, '#fff176', 9);
  _txt(ctx, 'P=pressure  r=radius  T=wall thickness', W / 2, H * 0.83, '#b0bec5', 7);

  _txt(ctx, 'AFTERLOAD · LAPLACE · CONTRACTILITY', W / 2, H * 0.93, '#ff4081', 8);
}

// ─── Scene: ANS / Reflexes ────────────────────────────────────────────────────
function _sceneANS(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020a05');
  const pulse = 0.5 + 0.5 * Math.sin(t * 2);

  // SNS (left)
  ctx.save();
  _glow(ctx, '#ff7043', 8 * pulse);
  ctx.strokeStyle = '#ff7043';
  ctx.lineWidth = 2;
  ctx.strokeRect(W * 0.05, H * 0.22, W * 0.32, H * 0.2);
  _txt(ctx, 'SNS', W * 0.21, H * 0.3, '#ff7043', 10);
  _txt(ctx, 'β1 → ↑HR, ↑inotropy', W * 0.21, H * 0.36, '#ffab91', 7);
  ctx.restore();

  // PNS (right)
  ctx.save();
  _glow(ctx, '#42a5f5', 8 * pulse);
  ctx.strokeStyle = '#42a5f5';
  ctx.lineWidth = 2;
  ctx.strokeRect(W * 0.63, H * 0.22, W * 0.32, H * 0.2);
  _txt(ctx, 'PNS', W * 0.79, H * 0.3, '#42a5f5', 10);
  _txt(ctx, 'M2 → ↓HR', W * 0.79, H * 0.36, '#90caf9', 7);
  ctx.restore();

  // Reflex table
  const reflexes = [
    { name: 'Baroreceptor', effect: 'HTN → ↑vagal → ↓HR', color: '#ffd740' },
    { name: 'Bainbridge', effect: 'Atrial stretch → ↑HR', color: '#a5d6a7' },
    { name: 'Oculocardiac', effect: 'Eye traction → ↓HR', color: '#80deea' },
    { name: 'Cushing', effect: '↑ICP → ↑BP + ↓HR', color: '#f48fb1' },
  ];
  reflexes.forEach((r, i) => {
    _txt(ctx, `${r.name}: ${r.effect}`, W / 2, H * 0.56 + i * 12, r.color, 7);
  });

  _txt(ctx, 'ANS CONTROL · REFLEXES', W / 2, H * 0.92, '#69f0ae', 10);
}

// ─── Scene: Default ──────────────────────────────────────────────────────────
function _sceneDefault(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020510');
  const pulse = 0.5 + 0.5 * Math.sin(t * 1.8);

  // Beating heart outline
  ctx.save();
  _glow(ctx, '#ef5350', 14 * pulse);
  ctx.strokeStyle = `rgba(239,83,80,${0.6 + 0.4 * pulse})`;
  ctx.lineWidth = 2;
  const hx = W / 2, hy = H * 0.4, s = 1 + 0.06 * Math.sin(t * 1.8);
  ctx.beginPath();
  ctx.moveTo(hx, hy - 30 * s);
  ctx.bezierCurveTo(hx - 50 * s, hy - 60 * s, hx - 70 * s, hy, hx, hy + 40 * s);
  ctx.bezierCurveTo(hx + 70 * s, hy, hx + 50 * s, hy - 60 * s, hx, hy - 30 * s);
  ctx.stroke();
  ctx.restore();

  _txt(ctx, 'CARDIAC PHYSIOLOGY', W / 2, H * 0.82, '#40c4ff', 10);
  _txt(ctx, 'Chapter 4', W / 2, H * 0.9, '#78909c', 8);
}

// ─── wire up window globals ───────────────────────────────────────────────────
window.renderCardiacPhysiologyScene = renderCardiacPhysiologyScene;
window.stopCardiacPhysiologyScene   = stopCardiacPhysiologyScene;
