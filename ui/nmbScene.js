/**
 * Neuromuscular Blocker scene renderer — Chapter 10
 * Draws topic-specific NMJ / pharmacological diagrams to #scn canvas
 * Aesthetic: dark neon medical arcade matching the app
 *
 * Exports: renderNMBScene(q), stopNMBScene()
 * Also exposed on window for dynamic dispatch from gameUI.js
 */

let _rafId   = null;
let _scTime  = 0;
let _scData  = null;

// ─── topic keyword → visual category ─────────────────────────────────────────

const TOPIC_MAP = {
  // Depolarizing
  succinylcholine: 'depolarizing', suxamethonium: 'depolarizing',
  depolariz: 'depolarizing', fasciculation: 'depolarizing', phase: 'depolarizing',

  // Reversal
  sugammadex: 'sugammadex', reversal: 'reversal', neostigmine: 'reversal',
  edrophonium: 'reversal', anticholinesterase: 'reversal', pyridostigmine: 'reversal',

  // TOF / Monitoring
  'train-of-four': 'tof', tof: 'tof', monitoring: 'tof', twitch: 'tof',
  fade: 'tof', ptc: 'tof', 'post-tetanic': 'tof', residual: 'tof',
  acceleromyography: 'tof', 'double-burst': 'tof',

  // Pseudocholinesterase / Dibucaine
  pseudocholinesterase: 'pseudoche', dibucaine: 'pseudoche', butyrylcholinesterase: 'pseudoche',
  plasma: 'pseudoche',

  // Hyperkalemia / Burns / Crush / Denervation
  hyperkalem: 'hyperkalemia', burn: 'hyperkalemia', crush: 'hyperkalemia',
  denervat: 'hyperkalemia', 'extrajunctional': 'hyperkalemia', potassium: 'hyperkalemia',

  // Malignant Hyperthermia
  malignant: 'mh', 'malignant hyperthermia': 'mh', dantrolene: 'mh',
  ryr: 'mh', sarcoplasmic: 'mh', calcium: 'mh',

  // Hofmann / Laudanosine
  hofmann: 'hofmann', hoffman: 'hofmann', laudanosine: 'hofmann',
  cisatracurium: 'hofmann', atracurium: 'hofmann', organ: 'hofmann',

  // Histamine / Hemodynamics
  histamine: 'histamine', mast: 'histamine', flushing: 'histamine',
  hypotension: 'histamine', hemodynamic: 'histamine',

  // Non-depolarizing (default NDNMBA)
  rocuronium: 'nondepol', vecuronium: 'nondepol', pancuronium: 'nondepol',
  mivacurium: 'nondepol', 'non-depolariz': 'nondepol', competitive: 'nondepol',
  ndnmba: 'nondepol', aminosteroidal: 'nondepol', steroidal: 'nondepol',
};

function _getCategory(q) {
  const topic = (q.metadata?.topicId || q.metadata?.topic || '').toLowerCase();
  const text  = (q.q || '').toLowerCase();
  for (const [kw, cat] of Object.entries(TOPIC_MAP)) {
    if (topic.includes(kw) || text.includes(kw)) return cat;
  }
  return 'default';
}

// ─── public API ───────────────────────────────────────────────────────────────

export function renderNMBScene(q) {
  const canvas = document.getElementById('scn');
  if (!canvas) return;

  _scData = { q, category: _getCategory(q) };
  _scTime = 0;

  if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }

  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  function tick() {
    _rafId = requestAnimationFrame(tick);
    _scTime += 0.016;
    _drawScene(ctx, W, H, _scData, _scTime);
  }
  tick();
}

export function stopNMBScene() {
  if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }
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
  ctx.shadowBlur  = blur || 10;
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

// ─── dispatcher ──────────────────────────────────────────────────────────────

function _drawScene(ctx, W, H, data, t) {
  switch (data.category) {
    case 'depolarizing':  _sceneDepolarizing(ctx, W, H, data.q, t);  break;
    case 'nondepol':      _sceneNonDepol(ctx, W, H, data.q, t);      break;
    case 'sugammadex':    _sceneSugammadex(ctx, W, H, data.q, t);    break;
    case 'reversal':      _sceneReversal(ctx, W, H, data.q, t);      break;
    case 'tof':           _sceneTOF(ctx, W, H, data.q, t);           break;
    case 'pseudoche':     _scenePseudoChe(ctx, W, H, data.q, t);     break;
    case 'hyperkalemia':  _sceneHyperkalemia(ctx, W, H, data.q, t);  break;
    case 'mh':            _sceneMH(ctx, W, H, data.q, t);            break;
    case 'hofmann':       _sceneHofmann(ctx, W, H, data.q, t);       break;
    case 'histamine':     _sceneHistamine(ctx, W, H, data.q, t);     break;
    default:              _sceneNMJDefault(ctx, W, H, data.q, t);    break;
  }
}

// ─── SCENE: Depolarizing Block (Succinylcholine) ─────────────────────────────

function _sceneDepolarizing(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#060210');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'DEPOLARIZING BLOCK — SUCCINYLCHOLINE', cx, 16, '#ff8844', 9);

  // Motor nerve terminal
  ctx.save();
  ctx.fillStyle = 'rgba(40,80,160,.55)';
  ctx.fillRect(cx - 50, cy - 80, 100, 38);
  ctx.strokeStyle = '#4488ff'; ctx.lineWidth = 1.5;
  _glow(ctx, '#4488ff', 8);
  ctx.strokeRect(cx - 50, cy - 80, 100, 38);
  ctx.restore();
  _txt(ctx, 'MOTOR NERVE', cx, cy - 61, '#4488ff', 9);

  // Synaptic cleft
  ctx.save();
  ctx.fillStyle = 'rgba(255,136,0,.09)';
  ctx.fillRect(cx - 70, cy - 42, 140, 22);
  ctx.restore();
  _txt(ctx, '— SYNAPTIC CLEFT —', cx, cy - 31, '#555', 7);

  // End-plate — glowing red (sustained depolarization)
  const gPulse = 0.6 + 0.4 * Math.abs(Math.sin(t * 3.5));
  ctx.save();
  ctx.fillStyle = `rgba(255,40,40,${0.2 + 0.15 * gPulse})`;
  ctx.fillRect(cx - 80, cy - 18, 160, 24);
  ctx.strokeStyle = `rgba(255,60,60,${gPulse})`;
  ctx.lineWidth = 2;
  _glow(ctx, '#ff2200', 16 * gPulse);
  ctx.strokeRect(cx - 80, cy - 18, 160, 24);
  ctx.restore();
  _txt(ctx, 'MOTOR END-PLATE  ⚡ SUSTAINED DEPOLARIZATION', cx, cy - 6, '#ff6644', 8);

  // ACh molecules raining into cleft
  for (let i = 0; i < 6; i++) {
    const ox = cx - 52 + i * 20;
    const phase = (t * 1.8 + i * 0.9) % 1;
    const oy = cy - 80 + phase * 58;
    const alpha = phase < 0.8 ? 1 : 1 - (phase - 0.8) / 0.2;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffcc00';
    _glow(ctx, '#ffcc00', 5);
    ctx.beginPath(); ctx.arc(ox, oy, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    if (i === 2) _txt(ctx, 'SCh', ox, oy - 10, '#ffcc00', 7);
  }

  // Fasciculation squiggles (muscle fiber)
  ctx.save();
  ctx.strokeStyle = '#ff8844'; ctx.lineWidth = 1.8;
  _glow(ctx, '#ff8844', 7);
  ctx.beginPath();
  const fascAmp = 5 * Math.abs(Math.sin(t * 6));
  for (let x = cx - 75; x < cx + 75; x += 2) {
    const y = cy + 30 + fascAmp * Math.sin((x + t * 60) * 0.22);
    x === cx - 75 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
  _txt(ctx, '⚡ FASCICULATIONS', cx, cy + 52, '#ff8844', 9);

  // Info panel
  _txt(ctx, 'Phase I: Depolarized → Inactivated → Flaccid Paralysis', cx, H - 22, '#88aaff', 8);
  _txt(ctx, 'Reversed by pseudocholinesterase hydrolysis — NOT neostigmine', cx, H - 10, '#ffaa44', 7);
  const topic = q.metadata?.topic || 'Succinylcholine';
  _txt(ctx, topic.toUpperCase(), W - 8, H - 10, '#4488ff', 7, 'right');
}

// ─── SCENE: Non-Depolarizing Block ───────────────────────────────────────────

function _sceneNonDepol(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#010818');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'NON-DEPOLARIZING BLOCK — COMPETITIVE ANTAGONISM', cx, 16, '#44aaff', 9);

  // Receptor (end-plate)
  const rPulse = 1 + 0.06 * Math.sin(t * 1.8);
  ctx.save();
  ctx.strokeStyle = '#4466cc'; ctx.lineWidth = 2;
  _glow(ctx, '#3355aa', 10 * rPulse);
  ctx.beginPath(); ctx.arc(cx, cy, 35, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  _txt(ctx, 'nAChR', cx, cy, '#88aaff', 9);
  _txt(ctx, 'BLOCKED', cx, cy + 14, '#ff4444', 7);

  // NDNMBA occupying receptor (two alpha subunits)
  for (let s = -1; s <= 1; s += 2) {
    const sx = cx + s * 18, sy = cy - 22;
    ctx.save();
    ctx.fillStyle = '#ff4444';
    _glow(ctx, '#ff2200', 10);
    ctx.beginPath(); ctx.arc(sx, sy, 10, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    _txt(ctx, 'R', sx, sy, '#fff', 8);
  }
  _txt(ctx, 'NDNMBA occupies both α-subunits', cx, cy - 44, '#ff8888', 7);

  // ACh rejected
  const achX = cx - 95 + 12 * Math.sin(t * 0.9), achY = cy;
  ctx.save();
  ctx.fillStyle = 'rgba(100,200,100,.5)';
  ctx.beginPath(); ctx.arc(achX, achY, 9, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  _txt(ctx, 'ACh', achX, achY, '#aaffaa', 7);
  _txt(ctx, 'UNABLE\nTO BIND', achX, achY - 22, '#aaffaa', 7);
  _arrow(ctx, achX + 10, achY, cx - 37, cy, '#ff2200', 1.5);
  _txt(ctx, '✕', cx - 52, cy, '#ff2200', 12);

  // No fasciculations panel
  ctx.save();
  ctx.fillStyle = 'rgba(0,20,50,.7)';
  ctx.fillRect(cx + 50, cy - 28, 115, 55); ctx.restore();
  _txt(ctx, 'NO FASCICULATIONS', cx + 107, cy - 16, '#00ff88', 8);
  _txt(ctx, 'NO DEPOLARIZATION', cx + 107, cy - 3, '#00ff88', 8);
  _txt(ctx, 'Competitive → Reversible', cx + 107, cy + 12, '#88aaff', 7);

  _txt(ctx, 'Reversed by ↑ACh (neostigmine) or encapsulation (sugammadex)', cx, H - 10, '#ffaa44', 7);
  const topic = q.metadata?.topic || 'Non-Depolarizing';
  _txt(ctx, topic.toUpperCase(), W - 8, H - 10, '#4488ff', 7, 'right');
}

// ─── SCENE: Sugammadex encapsulation ─────────────────────────────────────────

function _sceneSugammadex(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020510');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'SUGAMMADEX — SELECTIVE RELAXANT BINDING', cx, 16, '#00ff88', 10);

  // Gamma-cyclodextrin ring (sugammadex)
  const R = 38;
  ctx.save();
  _glow(ctx, '#00ff88', 12);
  ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  // Dashed outer ring
  ctx.save();
  ctx.setLineDash([4, 3]);
  ctx.strokeStyle = 'rgba(0,255,136,.35)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, R + 10, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
  _txt(ctx, 'γ-CYCLODEXTRIN', cx, cy - R - 16, '#00ff88', 8);
  _txt(ctx, '(SUGAMMADEX)', cx, cy - R - 5, '#00cc66', 7);

  // Rocuronium inside cavity
  const enclosed = Math.min(1, t * 0.5); // animate entering over 2 sec
  const roc_x = cx + (1 - enclosed) * 80;
  ctx.save();
  ctx.globalAlpha = enclosed;
  ctx.fillStyle = '#ff8844';
  _glow(ctx, '#ff6600', 14);
  ctx.beginPath(); ctx.arc(roc_x, cy, 14, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  _txt(ctx, 'Roc', roc_x, cy, '#fff', 8);
  _txt(ctx, 'ROCURONIUM', cx, cy + R + 10, '#ff8844', 8);
  _txt(ctx, 'encapsulated — inactive', cx, cy + R + 22, '#ff6622', 7);

  // Arrow from right showing rocuronium approaching
  if (enclosed < 0.95) {
    _arrow(ctx, cx + 100, cy, roc_x + 16, cy, '#ff8844', 2);
    _txt(ctx, 'PLASMA', cx + 110, cy - 14, '#ff8844', 7, 'left');
  }

  // Dose table
  const doses = [
    { label: 'Moderate block', dose: '2 mg/kg', c: '#ffcc00' },
    { label: 'Deep block',     dose: '4 mg/kg', c: '#ff8800' },
    { label: 'RSI rescue',     dose: '16 mg/kg', c: '#ff4444' },
  ];
  const tx = 14;
  _txt(ctx, 'DOSE GUIDE', tx + 50, H * .58, '#ffffff', 8, 'left');
  doses.forEach((d, i) => {
    _txt(ctx, `${d.label}: ${d.dose}`, tx + 50, H * .58 + 14 + i * 13, d.c, 7, 'left');
  });

  _txt(ctx, 'No muscarinic effects • No anticholinergic needed', cx, H - 10, '#00ff88', 8);
}

// ─── SCENE: Reversal (Neostigmine) ───────────────────────────────────────────

function _sceneReversal(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#040c06');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'ANTICHOLINESTERASE REVERSAL', cx, 16, '#ffaa00', 10);

  // AChE enzyme symbol
  ctx.save();
  ctx.fillStyle = 'rgba(60,120,60,.45)';
  ctx.beginPath(); ctx.arc(cx, cy - 20, 28, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#44aa44'; ctx.lineWidth = 1.5;
  _glow(ctx, '#44aa44', 8);
  ctx.stroke();
  ctx.restore();
  _txt(ctx, 'AChE', cx, cy - 20, '#44ff44', 10);
  _txt(ctx, 'INHIBITED', cx, cy - 20 + 14, '#44ff44', 7);

  // Neostigmine blocking AChE (X mark)
  ctx.save();
  ctx.strokeStyle = '#ffaa00'; ctx.lineWidth = 2.5;
  _glow(ctx, '#ffaa00', 10);
  const crossX = cx + 28, crossY = cy - 44;
  ctx.beginPath();
  ctx.moveTo(crossX - 8, crossY - 8); ctx.lineTo(crossX + 8, crossY + 8);
  ctx.moveTo(crossX + 8, crossY - 8); ctx.lineTo(crossX - 8, crossY + 8);
  ctx.stroke();
  ctx.restore();
  _txt(ctx, 'NEO', crossX + 16, crossY, '#ffaa00', 7);

  // ACh accumulation (rising bubbles)
  for (let i = 0; i < 8; i++) {
    const phase = (t * 0.8 + i * 0.35) % 1;
    const bx = cx - 60 + (i % 4) * 36 + 8 * Math.sin(phase * 6 + i);
    const by = cy + 40 - phase * 65;
    const alpha = phase < 0.7 ? 0.9 : 0.9 * (1 - (phase - 0.7) / 0.3);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffdd00';
    _glow(ctx, '#ffdd00', 5);
    ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  _txt(ctx, '↑ ACh accumulates', cx, cy + 52, '#ffdd00', 9);
  _txt(ctx, 'outcompetes NDNMBA at receptor', cx, cy + 65, '#ff9900', 8);

  // Warning: anticholinergic needed
  ctx.save();
  ctx.fillStyle = 'rgba(80,20,10,.7)';
  ctx.fillRect(cx - 100, H - 36, 200, 28); ctx.restore();
  _txt(ctx, '⚠ Give glycopyrrolate / atropine', cx, H - 24, '#ff6666', 8);
  _txt(ctx, 'to block muscarinic side effects', cx, H - 12, '#ff4444', 7);
}

// ─── SCENE: Train-of-Four Monitoring ─────────────────────────────────────────

function _sceneTOF(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#030814');
  const cx = W / 2, cy = H * 0.35;

  _txt(ctx, 'TRAIN-OF-FOUR (TOF) MONITORING', cx, 16, '#00aaff', 10);

  // 4 stimulus pulses
  const labels   = ['T1', 'T2', 'T3', 'T4'];
  const heights  = [70, 52, 36, 20]; // fade pattern for NDNMB block
  const colors   = ['#00ff88', '#44ee66', '#88dd44', '#bbcc22'];
  const spacing  = 52;
  const baseX    = cx - spacing * 1.5;
  const baseY    = cy + 40;

  const pulse = 1 + 0.05 * Math.sin(t * 3.0);

  labels.forEach((lbl, i) => {
    const bx  = baseX + i * spacing;
    const bh  = heights[i] * pulse;
    const col = colors[i];

    // Bar
    ctx.save();
    ctx.fillStyle = col;
    _glow(ctx, col, 8);
    ctx.fillRect(bx - 12, baseY - bh, 24, bh);
    ctx.restore();

    // Label below
    _txt(ctx, lbl, bx, baseY + 12, col, 9);

    // Amplitude annotation on T1 only
    if (i === 0) {
      _txt(ctx, `${heights[i]}%`, bx, baseY - bh - 10, col, 8);
    }
    if (i === 3) {
      _txt(ctx, `${heights[i]}%`, bx, baseY - bh - 10, col, 8);
    }
  });

  // TOF ratio annotation
  const ratio = (heights[3] / heights[0]).toFixed(2);
  _txt(ctx, `TOF ratio = T4/T1 = ${heights[3]}/${heights[0]} = ${ratio}`, cx, baseY + 30, '#ffaa00', 9);

  // Fade arrow
  _arrow(ctx, baseX - 16, baseY - heights[0] * pulse / 2,
              baseX + spacing * 3 + 16, baseY - heights[3] * pulse / 2, '#ff4444', 1.5);
  _txt(ctx, 'FADE → non-depolarizing block', cx, cy - 30, '#ff4444', 8);

  // Adequacy zone
  ctx.save();
  ctx.fillStyle = 'rgba(0,60,20,.5)';
  ctx.fillRect(cx - 100, H * 0.72, 200, 24); ctx.restore();
  _txt(ctx, '✓ ADEQUATE REVERSAL: TOF ≥ 0.9', cx, H * 0.72 + 12, '#00ff88', 9);

  _txt(ctx, 'PTC used when TOF = 0  •  DBS detects subtle fade', cx, H - 10, '#4488ff', 7);
}

// ─── SCENE: Pseudocholinesterase / Dibucaine ──────────────────────────────────

function _scenePseudoChe(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#030a08');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'PSEUDOCHOLINESTERASE (BUTYRYLCHOLINESTERASE)', cx, 16, '#44ffaa', 9);

  // Enzyme pool representation
  ctx.save();
  ctx.fillStyle = 'rgba(20,80,50,.5)';
  ctx.beginPath(); ctx.ellipse(cx, cy - 10, 65, 40, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#44ffaa'; ctx.lineWidth = 1.5;
  _glow(ctx, '#44ffaa', 8);
  ctx.stroke();
  ctx.restore();
  _txt(ctx, 'PLASMA', cx, cy - 22, '#44ffaa', 9);
  _txt(ctx, 'CHOLINESTERASE', cx, cy - 8, '#22cc88', 8);

  // Succinylcholine entering
  const schX = cx - 85 + 55 * ((t * 0.4) % 1);
  const schY = cy - 34;
  ctx.save();
  ctx.fillStyle = '#ffcc00';
  _glow(ctx, '#ffcc00', 8);
  ctx.beginPath(); ctx.arc(schX, schY, 8, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  _txt(ctx, 'SCh', schX, schY - 14, '#ffcc00', 7);

  // Dibucaine number bar chart
  const cases = [
    { label: 'Normal',     dn: 80, dur: '~8-10 min',  c: '#00ff88' },
    { label: 'Heterozyg.', dn: 60, dur: '~20 min',    c: '#ffcc00' },
    { label: 'Homozyg.',   dn: 20, dur: '>2 hours',   c: '#ff4444' },
  ];

  const bY = H * 0.78, maxH = H * 0.2;
  const bW = (W - 60) / cases.length;
  _txt(ctx, 'DIBUCAINE NUMBER & SCh DURATION', W / 2, bY - maxH - 12, '#ffffff', 9);

  cases.forEach((c, i) => {
    const bx = 30 + i * bW + bW / 2;
    const bh = (c.dn / 80) * maxH * (1 + 0.04 * Math.sin(t * 2 + i));
    ctx.save();
    ctx.fillStyle = c.c; _glow(ctx, c.c, 5);
    ctx.fillRect(bx - bW * 0.28, bY - bh, bW * 0.56, bh);
    ctx.restore();
    _txt(ctx, `${c.dn}`, bx, bY - bh - 9, c.c, 8);
    _txt(ctx, c.label, bx, bY + 10, c.c, 7);
    _txt(ctx, c.dur, bx, bY + 22, c.c, 6);
  });

  _txt(ctx, 'Dibucaine # = enzyme QUALITY, not quantity', cx, H - 10, '#88aaff', 7);
}

// ─── SCENE: Hyperkalemia / Burns / Denervation ───────────────────────────────

function _sceneHyperkalemia(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#0a0200');
  const cx = W / 2, cy = H * 0.42;

  _txt(ctx, 'SUCCINYLCHOLINE HYPERKALEMIA RISK', cx, 16, '#ff2200', 10);

  // Muscle fiber with extrajunctional receptors
  ctx.save();
  ctx.fillStyle = 'rgba(100,40,10,.3)';
  ctx.fillRect(cx - 100, cy - 20, 200, 40); ctx.restore();
  ctx.save();
  ctx.strokeStyle = '#cc4422'; ctx.lineWidth = 1.5;
  _glow(ctx, '#cc4422', 6);
  ctx.strokeRect(cx - 100, cy - 20, 200, 40);
  ctx.restore();
  _txt(ctx, 'MUSCLE FIBER', cx, cy + 6, '#cc4422', 8);

  // Extrajunctional receptors (orange dots along membrane)
  const numR = 8;
  for (let i = 0; i < numR; i++) {
    const rx = cx - 90 + i * (180 / (numR - 1));
    const ry = cy - 20;
    const gPulse = 0.7 + 0.3 * Math.abs(Math.sin(t * 2.5 + i * 0.8));
    ctx.save();
    ctx.fillStyle = `rgba(255,136,0,${gPulse})`;
    _glow(ctx, '#ff8800', 8 * gPulse);
    ctx.beginPath(); ctx.arc(rx, ry, 6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  _txt(ctx, 'EXTRAJUNCTIONAL nAChRs (upregulated)', cx, cy - 36, '#ff8800', 7);

  // K+ efflux arrows (upward)
  const kPulse = 0.5 + 0.5 * Math.abs(Math.sin(t * 2));
  for (let i = 0; i < 7; i++) {
    const kx = cx - 84 + i * 28;
    _arrow(ctx, kx, cy - 22, kx + 4 * Math.sin(i), cy - 60 - 15 * kPulse, '#ff4444', 1.5);
  }
  _txt(ctx, 'K⁺ EFFLUX ↑↑↑', cx, cy - 78, '#ff2200', 11);

  // Plasma K+ display
  const kVal = (4.5 + 4 * kPulse).toFixed(1);
  ctx.save();
  ctx.fillStyle = 'rgba(60,0,0,.8)';
  ctx.fillRect(cx - 60, cy + 30, 120, 34); ctx.restore();
  _txt(ctx, `K⁺: ${kVal} mEq/L`, cx, cy + 42, '#ff2200', 11);
  _txt(ctx, '⚠ CARDIAC ARREST RISK', cx, cy + 56, '#ff4444', 8);

  // Causes list
  const causes = ['Burns >24h', 'Crush injury', 'Denervation', 'Immobility', 'Myopathy'];
  _txt(ctx, 'Risk conditions:', 14, H * .78, '#ffaa44', 8, 'left');
  causes.forEach((c, i) => {
    _txt(ctx, `• ${c}`, 14, H * .78 + 12 + i * 12, '#ff8822', 7, 'left');
  });

  _txt(ctx, 'USE ROCURONIUM — Avoid succinylcholine in these patients', cx, H - 10, '#00ff88', 7);
}

// ─── SCENE: Malignant Hyperthermia ───────────────────────────────────────────

function _sceneMH(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#0a0300');
  const cx = W / 2, cy = H * 0.4;

  _txt(ctx, 'MALIGNANT HYPERTHERMIA', cx, 16, '#ff2200', 11);

  // Sarcoplasmic reticulum
  ctx.save();
  ctx.fillStyle = 'rgba(80,20,20,.45)';
  ctx.strokeStyle = '#cc3300'; ctx.lineWidth = 1.5;
  _glow(ctx, '#cc3300', 8);
  ctx.beginPath();
  ctx.moveTo(cx - 80, cy - 10);
  ctx.bezierCurveTo(cx - 80, cy - 50, cx + 80, cy - 50, cx + 80, cy - 10);
  ctx.bezierCurveTo(cx + 80, cy + 30, cx - 80, cy + 30, cx - 80, cy - 10);
  ctx.fill(); ctx.stroke();
  ctx.restore();
  _txt(ctx, 'SARCOPLASMIC RETICULUM', cx, cy - 30, '#cc3300', 8);
  _txt(ctx, 'RYR1 MUTATION', cx, cy - 14, '#ff6644', 7);

  // Ca2+ storm (red particles flying out)
  for (let i = 0; i < 14; i++) {
    const angle = (i / 14) * Math.PI * 2 + t * (1.5 + i * 0.08);
    const r = 30 + 42 * ((t * 0.6 + i * 0.07) % 1);
    const px = cx + r * Math.cos(angle);
    const py = cy + r * 0.55 * Math.sin(angle);
    const alpha = Math.max(0, 1 - r / 72);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ff6622';
    _glow(ctx, '#ff4400', 10);
    ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    if (i === 3) _txt(ctx, 'Ca²⁺', px, py - 9, '#ff6622', 7);
  }

  // Temperature display
  const tempVal = (38.5 + 1.5 * Math.abs(Math.sin(t * 0.7))).toFixed(1);
  ctx.save();
  ctx.fillStyle = 'rgba(60,0,0,.75)';
  ctx.fillRect(cx + 50, cy - 28, 100, 26); ctx.restore();
  _txt(ctx, `TEMP: ${tempVal}°C ↑`, cx + 100, cy - 15, '#ff2200', 9);

  // Effects
  const efx = ['Hyperthermia ↑', 'Rigidity', 'Metabolic acidosis', 'Hyperkalemia', 'Rhabdomyolysis'];
  efx.forEach((e, i) => {
    _txt(ctx, `• ${e}`, 14, H * .63 + i * 13, '#ff8844', 8, 'left');
  });

  // Treatment
  ctx.save();
  ctx.fillStyle = 'rgba(0,40,20,.75)';
  ctx.fillRect(cx + 10, H * .62, W - cx - 18, 60); ctx.restore();
  _txt(ctx, 'Rx: DANTROLENE', cx + (W - cx) / 2 + 10, H * .62 + 14, '#00ff88', 9);
  _txt(ctx, '2.5 mg/kg IV', cx + (W - cx) / 2 + 10, H * .62 + 28, '#00cc66', 8);
  _txt(ctx, 'Blocks RYR1 → ↓ Ca²⁺ release', cx + (W - cx) / 2 + 10, H * .62 + 42, '#00aa44', 7);

  _txt(ctx, 'Triggers: Succinylcholine + Volatile agents  |  Genetic: RYR1, CACNA1S', cx, H - 10, '#ff8800', 7);
}

// ─── SCENE: Hofmann Elimination ───────────────────────────────────────────────

function _sceneHofmann(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#040a04');
  const cx = W / 2, cy = H * 0.38;

  _txt(ctx, 'HOFMANN ELIMINATION — ORGAN-INDEPENDENT', cx, 16, '#00ffcc', 10);

  // Cisatracurium parent molecule
  ctx.save();
  ctx.fillStyle = 'rgba(20,80,60,.5)';
  ctx.beginPath(); ctx.arc(cx, cy, 32, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#00ffcc'; ctx.lineWidth = 2;
  _glow(ctx, '#00ffcc', 10);
  ctx.stroke();
  ctx.restore();
  _txt(ctx, 'CISATRA-', cx, cy - 6, '#00ffcc', 8);
  _txt(ctx, 'CURIUM', cx, cy + 7, '#00ffcc', 8);

  // Hofmann arrow (spontaneous, temp/pH dependent)
  const progress = (t * 0.3) % 1;
  const arrowX = cx + 38 + progress * 60;
  _arrow(ctx, cx + 38, cy, cx + 100, cy, '#00ffcc', 2);
  _txt(ctx, 'pH 7.4 / 37°C', cx + 69, cy - 14, '#55ffaa', 7);
  _txt(ctx, 'SPONTANEOUS', cx + 69, cy + 14, '#55ffaa', 7);

  // Products
  const pX = cx + 120;
  // Laudanosine
  ctx.save();
  ctx.fillStyle = 'rgba(255,100,0,.3)';
  ctx.beginPath(); ctx.arc(pX, cy - 26, 18, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#ff8800'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
  _txt(ctx, 'Lauda-', pX, cy - 30, '#ff8800', 7);
  _txt(ctx, 'nosine', pX, cy - 18, '#ff8800', 7);
  _arrow(ctx, cx + 100, cy, pX, cy - 26, '#ff8800', 1.2);

  // MQA (monoquaternary acrylate)
  ctx.save();
  ctx.fillStyle = 'rgba(100,200,100,.3)';
  ctx.beginPath(); ctx.arc(pX, cy + 26, 18, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#44ff44'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
  _txt(ctx, 'MQA', pX, cy + 26, '#44ff44', 8);
  _arrow(ctx, cx + 100, cy, pX, cy + 26, '#44ff44', 1.2);

  // Warning: laudanosine
  ctx.save();
  ctx.fillStyle = 'rgba(40,10,0,.7)';
  ctx.fillRect(cx + 140, cy - 42, 110, 26); ctx.restore();
  _txt(ctx, '⚠ CNS excitation', cx + 140 + 55, cy - 32, '#ff8800', 7);
  _txt(ctx, 'at HIGH doses', cx + 140 + 55, cy - 20, '#ff6600', 7);

  // No organ required panel
  const nrX = 14;
  ctx.save();
  ctx.fillStyle = 'rgba(0,40,20,.7)';
  ctx.fillRect(nrX, H * 0.6, 150, 48); ctx.restore();
  _txt(ctx, '✓ No renal needed', nrX + 75, H * 0.6 + 14, '#00ff88', 8);
  _txt(ctx, '✓ No hepatic needed', nrX + 75, H * 0.6 + 27, '#00ff88', 8);
  _txt(ctx, 'Ideal: renal/hepatic failure', nrX + 75, H * 0.6 + 40, '#00cc66', 7);

  _txt(ctx, 'Cisatracurium → 5× less laudanosine than atracurium', cx, H - 10, '#88ffcc', 7);
}

// ─── SCENE: Histamine / Mast Cell ────────────────────────────────────────────

function _sceneHistamine(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#080208');
  const cx = W / 2, cy = H * 0.38;

  _txt(ctx, 'HISTAMINE RELEASE — MAST CELL DEGRANULATION', cx, 16, '#ffaaff', 9);

  // Mast cell
  const mcR = 36;
  ctx.save();
  ctx.fillStyle = 'rgba(80,30,80,.5)';
  _glow(ctx, '#cc44cc', 10);
  ctx.beginPath(); ctx.arc(cx, cy, mcR, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#cc44cc'; ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
  _txt(ctx, 'MAST', cx, cy - 5, '#cc44cc', 9);
  _txt(ctx, 'CELL', cx, cy + 7, '#cc44cc', 9);

  // Degranulation particles (histamine)
  const nGrains = 16;
  for (let i = 0; i < nGrains; i++) {
    const angle = (i / nGrains) * Math.PI * 2;
    const phase = (t * 1.4 + i * 0.2) % 1;
    const r = mcR + phase * 55;
    const alpha = Math.max(0, 1 - phase * 1.2);
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ff44ff';
    _glow(ctx, '#cc00cc', 8);
    ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    if (i === 4) _txt(ctx, 'H₁', px + 10, py, '#ff44ff', 7);
  }

  // Effects panel
  const efx = [
    { txt: 'Flushing / erythema', c: '#ff8888' },
    { txt: 'Hypotension (vasodilation)', c: '#ff6666' },
    { txt: 'Bronchospasm', c: '#ff4444' },
    { txt: 'Urticaria (wheal & flare)', c: '#ff8888' },
  ];
  ctx.save();
  ctx.fillStyle = 'rgba(20,0,20,.7)';
  ctx.fillRect(cx + 50, cy - 26, 150, efx.length * 15 + 8); ctx.restore();
  efx.forEach((e, i) => {
    _txt(ctx, `• ${e.txt}`, cx + 125, cy - 18 + i * 15, e.c, 7);
  });

  // Drug risk panel
  ctx.save();
  ctx.fillStyle = 'rgba(30,0,30,.7)';
  ctx.fillRect(14, H * 0.65, 120, 44); ctx.restore();
  _txt(ctx, 'HIGH RISK:', 74, H * 0.65 + 12, '#ff88ff', 8);
  _txt(ctx, 'Atracurium, Mivacurium', 74, H * 0.65 + 25, '#ff66ff', 7);
  _txt(ctx, '(rapid large bolus)', 74, H * 0.65 + 37, '#cc44cc', 7);

  ctx.save();
  ctx.fillStyle = 'rgba(0,30,0,.7)';
  ctx.fillRect(cx - 10, H * 0.65, 125, 44); ctx.restore();
  _txt(ctx, 'LOW/NONE:', cx + 52, H * 0.65 + 12, '#44ff44', 8);
  _txt(ctx, 'Rocuronium, Vecuronium,', cx + 52, H * 0.65 + 25, '#22ff22', 7);
  _txt(ctx, 'Cisatracurium', cx + 52, H * 0.65 + 37, '#22cc22', 7);

  _txt(ctx, 'Slow injection over 60–90 sec reduces histamine release', cx, H - 10, '#ffaaff', 7);
}

// ─── SCENE: Default NMJ Synapse ──────────────────────────────────────────────

function _sceneNMJDefault(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020510');
  const cx = W / 2, cy = H * 0.4;

  _txt(ctx, 'NEUROMUSCULAR JUNCTION (NMJ)', cx, 16, '#ffcc44', 10);

  // Motor nerve axon
  ctx.save();
  ctx.strokeStyle = '#4488ff'; ctx.lineWidth = 3;
  _glow(ctx, '#4488ff', 10);
  ctx.beginPath(); ctx.moveTo(cx, 28); ctx.lineTo(cx, cy - 56); ctx.stroke();
  ctx.restore();

  // Terminal bouton
  ctx.save();
  ctx.fillStyle = 'rgba(40,70,160,.6)';
  _glow(ctx, '#4488ff', 10);
  ctx.beginPath(); ctx.arc(cx, cy - 42, 22, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#4488ff'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
  _txt(ctx, 'MOTOR NERVE\nTERMINAL', cx, cy - 56, '#4488ff', 7);

  // Synaptic vesicles (animated)
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + t * 0.8;
    const vx = cx + 12 * Math.cos(angle), vy = cy - 42 + 10 * Math.sin(angle);
    ctx.save();
    ctx.fillStyle = '#88ccff';
    ctx.beginPath(); ctx.arc(vx, vy, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // ACh quanta released (downward)
  for (let i = 0; i < 5; i++) {
    const phase = (t * 1.2 + i * 0.25) % 1;
    const ay = cy - 20 + phase * 30;
    const ax = cx + (i - 2) * 12;
    const alpha = phase < 0.8 ? 1 : 1 - (phase - 0.8) / 0.2;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffdd00';
    _glow(ctx, '#ffdd00', 5);
    ctx.beginPath(); ctx.arc(ax, ay, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // Synaptic cleft gap
  ctx.save();
  ctx.fillStyle = 'rgba(255,220,0,.06)';
  ctx.fillRect(cx - 55, cy + 6, 110, 20); ctx.restore();
  _txt(ctx, '— SYNAPTIC CLEFT (50 nm) —', cx, cy + 16, '#554400', 7);

  // Motor end-plate
  const pulse = 0.5 + 0.5 * Math.abs(Math.sin(t * 2));
  ctx.save();
  ctx.fillStyle = `rgba(0,200,100,${0.15 + 0.1 * pulse})`;
  ctx.fillRect(cx - 70, cy + 26, 140, 20);
  ctx.strokeStyle = `rgba(0,200,100,${pulse})`;
  ctx.lineWidth = 1.5;
  _glow(ctx, '#00cc66', 8 * pulse);
  ctx.strokeRect(cx - 70, cy + 26, 140, 20);
  ctx.restore();
  _txt(ctx, 'MOTOR END-PLATE  —  nAChR × 5 subunits (2α,β,γ/ε,δ)', cx, cy + 36, '#00cc66', 7);

  // Action potential → muscle contraction
  _arrow(ctx, cx, cy + 48, cx, cy + 70, '#00ff88', 2);
  _txt(ctx, 'ACTION POTENTIAL', cx, cy + 82, '#00ff88', 8);
  _txt(ctx, 'MUSCLE CONTRACTION', cx, cy + 95, '#44ff88', 8);

  // AChE
  _txt(ctx, 'AChE →', cx + 80, cy + 20, '#ffaa44', 7, 'left');
  _txt(ctx, 'choline + acetate', cx + 80, cy + 32, '#ff8822', 7, 'left');

  // Topic chip
  const topic = q.metadata?.topic || 'NMJ';
  _txt(ctx, topic.toUpperCase(), W - 8, H - 10, '#4488ff', 7, 'right');
  _txt(ctx, '2 ACh molecules needed to open channel', cx, H - 10, '#88aaff', 7);
}

// ─── expose on window ─────────────────────────────────────────────────────────
// (also exposed via gameUI.js window assignments, but redundant is safe)

if (typeof window !== 'undefined') {
  window.renderNMBScene = renderNMBScene;
  window.stopNMBScene   = stopNMBScene;
}
