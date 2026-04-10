/**
 * Airway Management themed scene renderer — Chapter 2
 * Draws airway-themed diagrams to #scn canvas
 * Aesthetic: dark neon medical arcade matching the rest of the app
 */

let _sceneRafId = null;
let _sceneTime  = 0;
let _sceneData  = null;

// Maps question topic keywords → visual category
const TOPIC_MAP = {
  // Anatomy
  'laryn': 'larynx', 'vocal cord': 'larynx', 'arytenoid': 'larynx',
  'epiglottis': 'larynx', 'cricoid': 'larynx', 'thyroid cartilage': 'larynx',
  'glottis': 'larynx', 'trachea': 'larynx', 'bronchus': 'larynx',
  'bronchi': 'larynx', 'carina': 'larynx', 'alveol': 'larynx',
  'pneumocyte': 'larynx', 'epithelium': 'larynx',
  // Nerves / innervation
  'recurrent laryngeal': 'nerves', 'superior laryngeal': 'nerves',
  'glossopharyngeal': 'nerves', 'trigeminal': 'nerves', 'lingual nerve': 'nerves',
  'innervat': 'nerves', 'sphenopalatine': 'nerves',
  // Assessment / grading
  'mallampati': 'assessment', 'cormack': 'assessment', 'bougie': 'assessment',
  'thyromental': 'assessment', 'sternomental': 'assessment', '3-3-2': 'assessment',
  'ulbt': 'assessment', 'upper lip bite': 'assessment', 'lemon': 'assessment',
  'bones': 'assessment', 'atlanto': 'assessment', 'prayer sign': 'assessment',
  'interincisor': 'assessment',
  // Intubation technique
  'sniffing': 'intubation', 'ett': 'intubation', 'endotracheal': 'intubation',
  'intubat': 'intubation', 'burp': 'intubation', 'elm': 'intubation',
  'retrograde': 'intubation', 'lighted stylet': 'intubation',
  'capnograph': 'intubation', 'capnometry': 'intubation',
  // Nerve blocks / awake
  'glossopharyngeal block': 'blocks', 'superior laryngeal block': 'blocks',
  'transtracheal': 'blocks', 'awake': 'blocks', 'topicali': 'blocks',
  // Reflexes / emergencies
  'laryngospasm': 'reflexes', 'bronchospasm': 'reflexes',
  'negative-pressure': 'reflexes', 'aspiration': 'reflexes',
  'mendelson': 'reflexes', 'extubat': 'reflexes',
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

function _drawLarynx(ctx, W, H, t) {
  // Simplified airway cross-section (tracheal rings + carina)
  const cx = W / 2, cy = H / 2 + 5;
  const pulse = 0.7 + 0.3 * Math.sin(t * 0.8);

  ctx.save();
  // Tracheal outline
  ctx.strokeStyle = `rgba(0,229,255,${pulse})`;
  ctx.lineWidth = 2;
  ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy - 55);
  ctx.lineTo(cx - 20, cy + 10);
  ctx.lineTo(cx - 45, cy + 50); // left bronchus
  ctx.moveTo(cx - 20, cy + 10);
  ctx.lineTo(cx + 20, cy + 10);
  ctx.moveTo(cx + 20, cy - 55);
  ctx.lineTo(cx + 20, cy + 10);
  ctx.lineTo(cx + 45, cy + 50); // right bronchus
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Animated breath particle
  const pct = (Math.sin(t * 0.9) + 1) / 2;
  const bx = cx;
  const by = cy - 55 + pct * 65;
  ctx.fillStyle = `rgba(180,255,100,${0.7 + 0.3 * Math.sin(t * 2)})`;
  ctx.beginPath(); ctx.arc(bx, by, 4, 0, Math.PI * 2); ctx.fill();

  // Tracheal ring marks
  [-35, -20, -5].forEach(dy => {
    ctx.strokeStyle = 'rgba(0,229,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 22, cy + dy); ctx.lineTo(cx + 22, cy + dy);
    ctx.stroke();
  });

  _label(ctx, 'TRACHEA / CARINA', cx, cy - 65, 9, '#ffaa00', 0.75);
  ctx.restore();
}

function _drawNerves(ctx, W, H, t) {
  // Nerve pathway diagram — two branching lines
  const cx = W / 2, cy = H / 2;
  const pulse = 0.6 + 0.4 * Math.sin(t * 0.9);

  ctx.save();
  ctx.strokeStyle = `rgba(200,100,255,${pulse})`;
  ctx.lineWidth = 2;
  ctx.shadowColor = '#c864ff'; ctx.shadowBlur = 8;

  // Vagus trunk
  ctx.beginPath();
  ctx.moveTo(cx, cy - 60); ctx.lineTo(cx, cy + 20);
  ctx.stroke();

  // SLN branch
  ctx.beginPath();
  ctx.moveTo(cx, cy - 10);
  ctx.lineTo(cx - 50, cy + 10);
  ctx.stroke();

  // RLN branch
  ctx.beginPath();
  ctx.moveTo(cx, cy + 20);
  ctx.lineTo(cx + 50, cy + 50);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Animated signal pulse
  const pos = (t * 0.6) % 1;
  const sx = cx - pos * 50;
  const sy = cy - 10 + pos * 20;
  ctx.fillStyle = `rgba(255,200,0,${0.8})`;
  ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2); ctx.fill();

  _label(ctx, 'VAGUS', cx + 14, cy - 62, 8, '#c864ff', 0.8);
  _label(ctx, 'SLN', cx - 55, cy + 6, 8, '#00e5ff', 0.8);
  _label(ctx, 'RLN', cx + 55, cy + 46, 8, '#00e5ff', 0.8);
  _label(ctx, 'INNERVATION', cx, cy - 74, 9, '#ffaa00', 0.7);
  ctx.restore();
}

function _drawAssessment(ctx, W, H, t) {
  // Mallampati class bars
  const cx = W / 2, cy = H / 2 + 15;
  const classes = ['I', 'II', 'III', 'IV'];
  const heights = [80, 60, 40, 20];
  const colors  = ['#00e5ff', '#b4ff64', '#ffaa00', '#ff6e40'];
  const barW = 22, gap = 10;

  ctx.save();
  classes.forEach((cls, i) => {
    const x = cx - (classes.length / 2) * (barW + gap) + i * (barW + gap) + (barW + gap) / 2;
    const h = heights[i];
    const pulse = 0.8 + 0.2 * Math.sin(t * 1.0 + i * 0.9);
    ctx.fillStyle = colors[i];
    ctx.globalAlpha = pulse;
    ctx.fillRect(x - barW / 2, cy - h, barW, h);
    _label(ctx, cls, x, cy + 14, 9, colors[i], 0.9);
  });
  ctx.globalAlpha = 1;
  _label(ctx, 'MALLAMPATI', cx, cy - 90, 9, '#ffaa00', 0.75);
  ctx.restore();
}

function _drawIntubation(ctx, W, H, t) {
  // ETT with animated depth and EtCO2 waveform
  const cx = W / 2, cy = H / 2;

  ctx.save();
  // ETT tube shape
  const pulse = 0.7 + 0.3 * Math.sin(t * 0.6);
  ctx.strokeStyle = `rgba(0,229,255,${pulse})`;
  ctx.lineWidth = 2;
  ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy - 60);
  ctx.lineTo(cx - 8, cy + 20);
  ctx.arc(cx, cy + 20, 8, Math.PI, 0, false);
  ctx.lineTo(cx + 8, cy - 60);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // EtCO2 mini waveform
  const waveX = cx - 55;
  const waveY = cy + 45;
  ctx.strokeStyle = `rgba(180,255,100,0.8)`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i <= 110; i++) {
    const x = waveX + i;
    const phase = (i / 110 + t * 0.4) % 1;
    const y = waveY - 12 * Math.max(0, Math.sin(phase * Math.PI * 2) * (phase < 0.5 ? 1 : 0));
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();

  _label(ctx, 'ETT / EtCO2', cx, cy - 72, 9, '#ffaa00', 0.75);
  ctx.restore();
}

function _drawBlocks(ctx, W, H, t) {
  // Three block target points with animated halos
  const cx = W / 2, cy = H / 2;
  const targets = [
    { x: cx,      y: cy - 40, label: 'GP block',  color: '#00e5ff' },
    { x: cx - 40, y: cy + 15, label: 'SLN',       color: '#b4ff64' },
    { x: cx + 40, y: cy + 15, label: 'Trans-T',   color: '#ffaa00' },
  ];

  ctx.save();
  targets.forEach(({ x, y, label, color }) => {
    const r = 10 + 6 * Math.abs(Math.sin(t * 0.9));
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
    _label(ctx, label, x, y + 22, 7, color, 0.8);
  });
  _label(ctx, 'AIRWAY BLOCKS', cx, cy - 65, 9, '#ffaa00', 0.75);
  ctx.restore();
}

function _drawReflexes(ctx, W, H, t) {
  // Laryngospasm — animated cord closure
  const cx = W / 2, cy = H / 2 + 5;

  ctx.save();
  const open = 16 + 10 * Math.abs(Math.sin(t * 0.7));
  const color = `rgba(255,110,64,${0.7 + 0.3 * Math.sin(t * 1.2)})`;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.shadowColor = '#ff6e40'; ctx.shadowBlur = 10;

  // Left cord
  ctx.beginPath();
  ctx.moveTo(cx - open, cy - 25);
  ctx.lineTo(cx - 3,   cy);
  ctx.stroke();

  // Right cord
  ctx.beginPath();
  ctx.moveTo(cx + open, cy - 25);
  ctx.lineTo(cx + 3,   cy);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Trigger flash
  if (Math.sin(t * 2.5) > 0.7) {
    ctx.fillStyle = 'rgba(255,200,0,0.6)';
    ctx.beginPath(); ctx.arc(cx, cy - 40, 8, 0, Math.PI * 2); ctx.fill();
  }

  _label(ctx, 'LARYNGOSPASM', cx, cy - 60, 9, '#ffaa00', 0.75);
  _label(ctx, '⚡ SLN trigger', cx, cy + 25, 8, '#ff6e40', 0.7);
  ctx.restore();
}

function _drawDefault(ctx, W, H, t) {
  // Generic airway tube silhouette + pulse
  const cx = W / 2, cy = H / 2;
  const pulse = 0.7 + 0.3 * Math.sin(t * 0.8);

  ctx.save();
  ctx.strokeStyle = `rgba(0,229,255,${pulse})`;
  ctx.lineWidth = 2;
  ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 10;

  // Simple tube outline
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy - 65);
  ctx.lineTo(cx - 10, cy + 30);
  ctx.arc(cx, cy + 30, 10, Math.PI, 0);
  ctx.lineTo(cx + 10, cy - 65);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Animated particle going down
  const pct = (t * 0.5) % 1;
  const py = cy - 65 + pct * 95;
  ctx.fillStyle = '#b4ff64';
  ctx.beginPath(); ctx.arc(cx, py, 4, 0, Math.PI * 2); ctx.fill();

  _label(ctx, 'AIRWAY MGT', cx, cy - 78, 9, '#ffaa00', 0.7);
  ctx.restore();
}

// ─── Dispatch ─────────────────────────────────────────────────────────────────

const DRAWERS = {
  larynx:     _drawLarynx,
  nerves:     _drawNerves,
  assessment: _drawAssessment,
  intubation: _drawIntubation,
  blocks:     _drawBlocks,
  reflexes:   _drawReflexes,
  default:    _drawDefault,
};

// ─── Public API ───────────────────────────────────────────────────────────────

export function renderAirwayManagementScene(q) {
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

export function stopAirwayManagementScene() {
  if (_sceneRafId) {
    cancelAnimationFrame(_sceneRafId);
    _sceneRafId = null;
  }
  _sceneData = null;
}

// ─── Global registration (for dynamic dispatch via window[cfg.sceneRendererName]) ──
window.renderAirwayManagementScene = renderAirwayManagementScene;
window.stopAirwayManagementScene   = stopAirwayManagementScene;
