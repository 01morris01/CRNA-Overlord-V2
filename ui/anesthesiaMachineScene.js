/**
 * Anesthesia Machine scene renderer — Chapter 11
 * Draws topic-specific diagrams to the #scn canvas
 * Aesthetic: dark neon medical arcade matching the app
 *
 * Exports: renderAnesthesiaMachineScene(q), stopAnesthesiaMachineScene()
 * Also exposed on window for dynamic dispatch from gameUI.js
 */

let _rafId  = null;
let _scTime = 0;
let _scData = null;

// ─── topic keyword → visual category ─────────────────────────────────────────

const TOPIC_MAP = {
  // Cylinders / Yokes / E-cylinder / H-cylinder
  cylinder:    'cylinder', yoke:        'cylinder', 'e-cylinder': 'cylinder',
  'h-cylinder': 'cylinder', psi:        'cylinder',

  // PISS / DISS / Pin index
  piss:        'piss', diss:        'piss', 'pin index': 'piss',
  'diameter index': 'piss', pin:    'piss', 'non-interchangeable': 'piss',

  // Oxygen flush
  flush:       'flush', 'oxygen flush': 'flush', barotrauma: 'flush',

  // Flowmeter / Rotameter / Manifold
  flowmeter:   'flowmeter', rotameter: 'flowmeter', manifold:   'flowmeter',
  bobbin:      'flowmeter', 'flow control': 'flowmeter',

  // Vaporizer / Agents
  vaporizer:   'vaporizer', tec:       'vaporizer', isoflurane: 'vaporizer',
  sevoflurane: 'vaporizer', desflurane: 'vaporizer', agent:     'vaporizer',
  'variable-bypass': 'vaporizer', 'latent heat': 'vaporizer',

  // Soda lime / Absorber / Compound A / CO
  'soda lime': 'sodalime', amsorb:     'sodalime', 'compound a': 'sodalime',
  'carbon monoxide': 'sodalime', absorber:  'sodalime', baralyme:   'sodalime',
  'carbon dioxide': 'sodalime', desiccated: 'sodalime',

  // Scavenging / Waste gas
  scavenging:  'scavenging', 'waste gas': 'scavenging', 'apl': 'scavenging',
  passive:     'scavenging', active:      'scavenging',

  // Bellows / Ventilator / Ascending / Descending
  bellows:     'bellows', ventilator:  'bellows', ascending:   'bellows',
  descending:  'bellows', disconnect:  'bellows',

  // Breathing circuit / Rebreathing / Circle / Mapleson
  'breathing circuit': 'circuit', rebreathing: 'circuit', circle: 'circuit',
  mapleson:    'circuit', 'check valve': 'circuit', 'reservoir bag': 'circuit',

  // MSMAID / Machine check
  msmaid:      'msmaid', checklist:   'msmaid', 'machine check': 'msmaid',

  // Leak / Obstruction / Troubleshoot
  leak:        'troubleshoot', obstruction: 'troubleshoot',
  troubleshoot: 'troubleshoot', kink:       'troubleshoot',
};

function _getCategory(q) {
  const topic = (q.metadata?.topic || '').toLowerCase();
  const text  = (q.prompt || q.q || '').toLowerCase();
  for (const [kw, cat] of Object.entries(TOPIC_MAP)) {
    if (topic.includes(kw) || text.includes(kw)) return cat;
  }
  return 'default';
}

// ─── public API ───────────────────────────────────────────────────────────────

export function renderAnesthesiaMachineScene(q) {
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

export function stopAnesthesiaMachineScene() {
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
    case 'cylinder':     _sceneCylinder(ctx, W, H, data.q, t);     break;
    case 'piss':         _scenePISS(ctx, W, H, data.q, t);         break;
    case 'flush':        _sceneFlush(ctx, W, H, data.q, t);        break;
    case 'flowmeter':    _sceneFlowmeter(ctx, W, H, data.q, t);    break;
    case 'vaporizer':    _sceneVaporizer(ctx, W, H, data.q, t);    break;
    case 'sodalime':     _sceneSodaLime(ctx, W, H, data.q, t);     break;
    case 'scavenging':   _sceneScavenging(ctx, W, H, data.q, t);   break;
    case 'bellows':      _sceneBellows(ctx, W, H, data.q, t);      break;
    case 'circuit':      _sceneCircuit(ctx, W, H, data.q, t);      break;
    case 'msmaid':       _sceneMSMAID(ctx, W, H, data.q, t);       break;
    case 'troubleshoot': _sceneTroubleshoot(ctx, W, H, data.q, t); break;
    default:             _sceneDefault(ctx, W, H, data.q, t);      break;
  }
}

// ─── SCENE: Cylinder & Yoke ──────────────────────────────────────────────────

function _sceneCylinder(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020812');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'E-CYLINDER — HIGH PRESSURE SYSTEM', cx, 14, '#00aaff', 9);

  // Draw two cylinders side by side: O2 (green) and N2O (blue)
  const cylinders = [
    { label: 'O2', x: cx - 55, color: '#00ff88', psi: '2200 psi', factor: '0.28' },
    { label: 'N2O', x: cx + 55, color: '#4488ff', psi: '750 psi', factor: '—' },
  ];

  cylinders.forEach(cyl => {
    const x = cyl.x;
    const yTop = cy - 50;
    const bodyH = 70;

    // Cylinder body
    ctx.save();
    ctx.fillStyle = `rgba(${cyl.color === '#00ff88' ? '0,60,30' : '20,40,100'},.5)`;
    ctx.fillRect(x - 16, yTop, 32, bodyH);
    ctx.strokeStyle = cyl.color;
    ctx.lineWidth = 2;
    _glow(ctx, cyl.color, 8);
    ctx.strokeRect(x - 16, yTop, 32, bodyH);
    ctx.restore();

    // Valve cap
    ctx.save();
    ctx.fillStyle = cyl.color;
    _glow(ctx, cyl.color, 6);
    ctx.fillRect(x - 8, yTop - 10, 16, 12);
    ctx.restore();

    // Gauge circle
    const gaugeY = cy + 36;
    ctx.save();
    ctx.strokeStyle = cyl.color; ctx.lineWidth = 1.5;
    _glow(ctx, cyl.color, 5);
    ctx.beginPath(); ctx.arc(x, gaugeY, 12, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();

    // Animated pressure needle
    const needleAngle = -Math.PI * 0.7 + (0.1 * Math.sin(t * 0.4));
    ctx.save();
    ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, gaugeY);
    ctx.lineTo(x + 10 * Math.cos(needleAngle), gaugeY + 10 * Math.sin(needleAngle));
    ctx.stroke();
    ctx.restore();

    _txt(ctx, cyl.label, x, yTop + bodyH * 0.45, cyl.color, 10);
    _txt(ctx, cyl.psi, x, gaugeY + 18, cyl.color, 7);
  });

  // Hanger yoke indicators
  _txt(ctx, 'HANGER YOKE FUNCTIONS:', cx, H * 0.82, '#ffffff', 8);
  _txt(ctx, '1. Orients & supports  2. Gas-tight seal  3. Uni-directional flow', cx, H * 0.82 + 13, '#ffcc00', 7);
  _txt(ctx, 'PISS prevents wrong-cylinder misconnection', cx, H - 10, '#ff6644', 7);

  const topic = q.metadata?.topic || 'Cylinders';
  _txt(ctx, topic.toUpperCase(), W - 8, 10, '#4488ff', 7, 'right');
}

// ─── SCENE: PISS / DISS ──────────────────────────────────────────────────────

function _scenePISS(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#04060f');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'PIN INDEX & DIAMETER INDEX SAFETY SYSTEMS', cx, 14, '#ffcc00', 8);

  // Banner
  const bannerAlpha = 0.7 + 0.3 * Math.abs(Math.sin(t * 1.5));
  ctx.save();
  ctx.globalAlpha = bannerAlpha;
  ctx.fillStyle = 'rgba(200,0,0,.2)';
  ctx.fillRect(cx - 110, 24, 220, 14);
  ctx.restore();
  _txt(ctx, '— NON-INTERCHANGEABLE CONNECTIONS —', cx, 31, '#ff4444', 8);

  // PISS side (left)
  const lx = cx - 65, pinY = cy - 10;
  ctx.save();
  ctx.fillStyle = 'rgba(0,80,40,.5)';
  ctx.fillRect(lx - 30, pinY - 22, 60, 44);
  ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 1.5;
  _glow(ctx, '#00ff88', 6);
  ctx.strokeRect(lx - 30, pinY - 22, 60, 44);
  ctx.restore();
  _txt(ctx, 'PISS', lx, pinY - 30, '#00ff88', 9);
  _txt(ctx, 'E-CYLINDER', lx, pinY + 30, '#00ff88', 7);

  // Pin holes on PISS
  const pissPins = [{ dx: -10, dy: -6 }, { dx: 8, dy: 8 }];
  pissPins.forEach(p => {
    ctx.save();
    ctx.fillStyle = '#ffcc00';
    _glow(ctx, '#ffcc00', 5);
    ctx.beginPath(); ctx.arc(lx + p.dx, pinY + p.dy, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });
  _txt(ctx, 'pin holes', lx, pinY + 8, '#aaffaa', 6);

  // DISS side (right)
  const rx = cx + 65;
  ctx.save();
  ctx.fillStyle = 'rgba(0,40,100,.5)';
  ctx.fillRect(rx - 30, pinY - 22, 60, 44);
  ctx.strokeStyle = '#4488ff'; ctx.lineWidth = 1.5;
  _glow(ctx, '#4488ff', 6);
  ctx.strokeRect(rx - 30, pinY - 22, 60, 44);
  ctx.restore();
  _txt(ctx, 'DISS', rx, pinY - 30, '#4488ff', 9);
  _txt(ctx, 'WALL PIPELINE', rx, pinY + 30, '#4488ff', 7);

  // DISS diameter ring
  ctx.save();
  ctx.strokeStyle = '#4488ff'; ctx.lineWidth = 2.5;
  _glow(ctx, '#4488ff', 8);
  ctx.beginPath(); ctx.arc(rx, pinY, 14, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  _txt(ctx, 'dia.', rx, pinY, '#aaccff', 7);

  _txt(ctx, 'Each gas has a UNIQUE pin arrangement (PISS) or diameter (DISS)', cx, H - 20, '#ffcc00', 7);
  _txt(ctx, 'Prevents wrong-gas misconnection at high and intermediate pressure', cx, H - 9, '#ff8844', 7);

  const topic = q.metadata?.topic || 'PISS/DISS';
  _txt(ctx, topic.toUpperCase(), W - 8, 10, '#4488ff', 7, 'right');
}

// ─── SCENE: Oxygen Flush ─────────────────────────────────────────────────────

function _sceneFlush(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#060210');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'OXYGEN FLUSH VALVE', cx, 14, '#00aaff', 10);

  // Flush button
  const btnPulse = 0.8 + 0.2 * Math.abs(Math.sin(t * 4));
  ctx.save();
  ctx.fillStyle = `rgba(0,100,220,${btnPulse * 0.6})`;
  _glow(ctx, '#0088ff', 12 * btnPulse);
  ctx.beginPath(); ctx.arc(cx - 60, cy - 20, 18, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#00aaff'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx - 60, cy - 20, 18, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  _txt(ctx, 'FLUSH', cx - 60, cy - 20, '#ffffff', 8);

  // Flow spike arrow
  const arrowLen = 70 + 20 * Math.abs(Math.sin(t * 3));
  _arrow(ctx, cx - 40, cy - 20, cx - 40 + arrowLen, cy - 20, '#00eeff', 2.5);

  // Common gas outlet
  ctx.save();
  ctx.fillStyle = 'rgba(0,60,80,.6)';
  ctx.fillRect(cx + 35, cy - 36, 50, 32);
  ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 1.5;
  _glow(ctx, '#00ffff', 6);
  ctx.strokeRect(cx + 35, cy - 36, 50, 32);
  ctx.restore();
  _txt(ctx, 'CGO', cx + 60, cy - 20, '#00ffff', 9);

  // Stats
  ctx.save();
  ctx.fillStyle = 'rgba(0,20,50,.7)';
  ctx.fillRect(cx - 70, cy + 10, 140, 34);
  ctx.restore();
  _txt(ctx, '35 – 75 L/min @ 40 psi', cx, cy + 22, '#00ff88', 9);
  _txt(ctx, 'Bypasses flowmeters — unmetered flow', cx, cy + 36, '#ffaa44', 7);

  // Barotrauma warning
  const warnPulse = 0.5 + 0.5 * Math.abs(Math.sin(t * 2));
  ctx.save();
  ctx.globalAlpha = warnPulse;
  ctx.fillStyle = 'rgba(200,0,0,.25)';
  ctx.fillRect(cx - 105, H - 32, 210, 22);
  ctx.restore();
  _txt(ctx, '⚠  DO NOT FLUSH DURING INSPIRATION — BAROTRAUMA RISK', cx, H - 21, '#ff4444', 8);
  _txt(ctx, 'Stays active even in STANDBY mode', cx, H - 10, '#ffcc00', 7);

  const topic = q.metadata?.topic || 'Flush Valve';
  _txt(ctx, topic.toUpperCase(), W - 8, 10, '#4488ff', 7, 'right');
}

// ─── SCENE: Flowmeter / Rotameter ────────────────────────────────────────────

function _sceneFlowmeter(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020a10');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'FLOWMETER BANK — LOW PRESSURE SYSTEM', cx, 14, '#44ffcc', 9);

  const gases = [
    { label: 'N2O', color: '#4488ff', flow: 0.55 + 0.05 * Math.sin(t * 0.7) },
    { label: 'Air', color: '#ffcc44', flow: 0.40 + 0.04 * Math.sin(t * 0.9 + 1) },
    { label: 'O2',  color: '#00ff88', flow: 0.65 + 0.06 * Math.sin(t * 0.6 + 2) },
  ];

  const tubeH = 80, tubeW = 16;
  const startX = cx - 52;
  const spacing = 52;
  const baseY = cy + 38;

  gases.forEach((gas, i) => {
    const tx = startX + i * spacing;
    const bobbinY = baseY - tubeH * gas.flow;

    // Tube outline
    ctx.save();
    ctx.strokeStyle = gas.color; ctx.lineWidth = 1.5;
    ctx.fillStyle = 'rgba(10,20,30,.4)';
    _glow(ctx, gas.color, 4);
    ctx.fillRect(tx - tubeW / 2, baseY - tubeH, tubeW, tubeH);
    ctx.strokeRect(tx - tubeW / 2, baseY - tubeH, tubeW, tubeH);
    ctx.restore();

    // Bobbin
    ctx.save();
    ctx.fillStyle = gas.color;
    _glow(ctx, gas.color, 8);
    ctx.beginPath(); ctx.ellipse(tx, bobbinY, tubeW * 0.4, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    _txt(ctx, gas.label, tx, baseY + 12, gas.color, 9);
    _txt(ctx, `${Math.round(gas.flow * 100)}%`, tx, bobbinY - 10, gas.color, 7);

    // "DOWNSTREAM" arrow on O2 (rightmost)
    if (i === 2) {
      _arrow(ctx, tx + tubeW, baseY - tubeH * 0.5, tx + tubeW + 22, baseY - tubeH * 0.5, '#00ff88', 1.5);
      _txt(ctx, '→ manifold', tx + tubeW + 32, baseY - tubeH * 0.5, '#00ff88', 7, 'left');
    }
  });

  // Safety note
  ctx.save();
  ctx.fillStyle = 'rgba(0,40,10,.6)';
  ctx.fillRect(cx - 115, H - 30, 230, 20);
  ctx.restore();
  _txt(ctx, 'O2 MUST be furthest DOWNSTREAM to prevent hypoxic leak', cx, H - 20, '#00ff88', 8);
  _txt(ctx, 'Counterclockwise = ↑ flow  •  O2 knob = fluted profile', cx, H - 9, '#ffcc44', 7);

  const topic = q.metadata?.topic || 'Flowmeter';
  _txt(ctx, topic.toUpperCase(), W - 8, 10, '#4488ff', 7, 'right');
}

// ─── SCENE: Vaporizer ────────────────────────────────────────────────────────

function _sceneVaporizer(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#030608');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'VARIABLE-BYPASS VAPORIZER', cx, 14, '#ff8844', 10);

  // Vaporizer body
  ctx.save();
  ctx.fillStyle = 'rgba(60,30,0,.5)';
  ctx.fillRect(cx - 55, cy - 45, 110, 80);
  ctx.strokeStyle = '#ff8844'; ctx.lineWidth = 2;
  _glow(ctx, '#ff8844', 8);
  ctx.strokeRect(cx - 55, cy - 45, 110, 80);
  ctx.restore();

  // Agent label
  _txt(ctx, 'ISO / SEV / DES', cx, cy - 28, '#ffdd88', 9);
  _txt(ctx, 'VAPORIZER', cx, cy - 14, '#ff8844', 8);

  // Sight glass / fill level
  ctx.save();
  ctx.fillStyle = 'rgba(0,150,180,.35)';
  ctx.fillRect(cx + 30, cy - 30, 16, 50);
  ctx.strokeStyle = '#00ccff'; ctx.lineWidth = 1;
  ctx.strokeRect(cx + 30, cy - 30, 16, 50);
  ctx.restore();
  _txt(ctx, 'FILL', cx + 38, cy - 37, '#00ccff', 6);

  // Dial indicator
  const dialAngle = -Math.PI * 0.6 + (Math.PI * 0.8) * 0.5 + 0.05 * Math.sin(t * 0.5);
  ctx.save();
  ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 2;
  _glow(ctx, '#ffcc00', 8);
  const dX = cx - 38, dY = cy;
  ctx.beginPath(); ctx.arc(dX, dY, 14, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(dX, dY);
  ctx.lineTo(dX + 12 * Math.cos(dialAngle), dY + 12 * Math.sin(dialAngle));
  ctx.stroke();
  ctx.restore();
  _txt(ctx, 'DIAL', dX, dY + 20, '#ffcc00', 7);

  // Vapor molecules rising
  for (let i = 0; i < 5; i++) {
    const phase = (t * 0.9 + i * 0.4) % 1;
    const vx = cx - 10 + i * 5;
    const vy = cy + 30 - phase * 50;
    const alpha = phase < 0.7 ? 0.8 : 0.8 * (1 - (phase - 0.7) / 0.3);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#aaddff';
    ctx.beginPath(); ctx.arc(vx, vy, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // Info panel
  ctx.save();
  ctx.fillStyle = 'rgba(20,10,0,.7)';
  ctx.fillRect(cx - 110, H - 38, 220, 28);
  ctx.restore();
  _txt(ctx, 'Desflurane (bp ~23°C) → requires Tec 6 heated vaporizer', cx, H - 28, '#ffaa44', 7);
  _txt(ctx, 'Latent heat of vaporization → vaporizer cools over time', cx, H - 16, '#ff6622', 7);
  _txt(ctx, 'Interlock: only ONE vaporizer ON at a time', cx, H - 5, '#00ff88', 7);

  const topic = q.metadata?.topic || 'Vaporizers';
  _txt(ctx, topic.toUpperCase(), W - 8, 10, '#4488ff', 7, 'right');
}

// ─── SCENE: Soda Lime / CO2 Absorber ─────────────────────────────────────────

function _sceneSodaLime(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#040c04');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'CO2 ABSORBER — SODA LIME / AMSORB', cx, 14, '#44ff88', 9);

  // Canister
  ctx.save();
  ctx.fillStyle = 'rgba(10,50,20,.5)';
  ctx.fillRect(cx - 38, cy - 40, 76, 70);
  ctx.strokeStyle = '#44ff88'; ctx.lineWidth = 1.5;
  _glow(ctx, '#44ff88', 6);
  ctx.strokeRect(cx - 38, cy - 40, 76, 70);
  ctx.restore();
  _txt(ctx, 'CANISTER', cx, cy - 48, '#44ff88', 8);

  // CO2 molecules entering
  for (let i = 0; i < 4; i++) {
    const phase = (t * 1.2 + i * 0.5) % 1;
    const mx = cx - 20 + i * 13;
    const my = cy - 40 + phase * 55;
    const alpha = phase < 0.8 ? 0.9 : 0.9 * (1 - (phase - 0.8) / 0.2);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ff4444';
    ctx.beginPath(); ctx.arc(mx, my, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    if (i === 1 && phase < 0.3) _txt(ctx, 'CO2', mx, my - 10, '#ff6666', 6);
  }

  // Reaction arrow → H2O + CaCO3
  _arrow(ctx, cx, cy + 35, cx, cy + 55, '#44ff88', 2);
  _txt(ctx, 'CO2 + Ca(OH)2 → CaCO3 + H2O', cx, cy + 67, '#aaffaa', 8);

  // Warning box
  const wPulse = 0.5 + 0.5 * Math.abs(Math.sin(t * 2.5));
  ctx.save();
  ctx.globalAlpha = wPulse;
  ctx.fillStyle = 'rgba(150,50,0,.3)';
  ctx.fillRect(cx - 108, H - 42, 216, 12);
  ctx.restore();
  _txt(ctx, '⚠ Desiccated absorber + inhaled agents → CO (carboxyhemoglobin)', cx, H - 37, '#ff6644', 7);
  _txt(ctx, 'Sevo + soda lime → Compound A (nephrotoxic at >8% for 4-6h)', cx, H - 25, '#ffaa44', 7);
  _txt(ctx, 'Amsorb: omits NaOH/KOH to reduce degradation risk', cx, H - 13, '#44ff88', 7);

  const topic = q.metadata?.topic || 'Soda Lime';
  _txt(ctx, topic.toUpperCase(), W - 8, 10, '#4488ff', 7, 'right');
}

// ─── SCENE: Scavenging ───────────────────────────────────────────────────────

function _sceneScavenging(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#040408');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'SCAVENGING SYSTEM — WASTE GAS DISPOSAL', cx, 14, '#aaaaff', 9);

  // APL valve (source)
  ctx.save();
  ctx.fillStyle = 'rgba(30,30,80,.5)';
  ctx.fillRect(14, cy - 14, 50, 28);
  ctx.strokeStyle = '#8888ff'; ctx.lineWidth = 1.5;
  _glow(ctx, '#8888ff', 5);
  ctx.strokeRect(14, cy - 14, 50, 28);
  ctx.restore();
  _txt(ctx, 'APL', 39, cy - 21, '#aaaaff', 8);
  _txt(ctx, 'VALVE', 39, cy, '#8888ff', 7);

  // Flow path
  _arrow(ctx, 65, cy, cx - 30, cy, '#8888ff', 1.5);

  // Interface
  ctx.save();
  ctx.fillStyle = 'rgba(20,20,60,.5)';
  ctx.fillRect(cx - 30, cy - 22, 60, 44);
  ctx.strokeStyle = '#aaaaff'; ctx.lineWidth = 1.5;
  _glow(ctx, '#aaaaff', 6);
  ctx.strokeRect(cx - 30, cy - 22, 60, 44);
  ctx.restore();
  _txt(ctx, 'INTERFACE', cx, cy - 9, '#ccccff', 8);
  _txt(ctx, '(reservoir)', cx, cy + 6, '#8888aa', 7);

  // Active branch
  _arrow(ctx, cx + 30, cy - 8, W - 20, cy - 8, '#00ffcc', 1.5);
  _txt(ctx, 'ACTIVE', W - 20, cy - 18, '#00ffcc', 8, 'right');
  _txt(ctx, 'hospital vacuum', W - 20, cy - 8, '#00ccaa', 7, 'right');

  // Passive branch
  _arrow(ctx, cx + 30, cy + 8, W - 20, cy + 8, '#ffcc44', 1.5);
  _txt(ctx, 'PASSIVE', W - 20, cy + 18, '#ffcc44', 8, 'right');
  _txt(ctx, 'pressure gradient', W - 20, cy + 8, '#ccaa33', 7, 'right');

  // OSHA limits
  ctx.save();
  ctx.fillStyle = 'rgba(20,10,40,.7)';
  ctx.fillRect(cx - 110, H - 30, 220, 20);
  ctx.restore();
  _txt(ctx, 'OSHA: N2O ≤ 25 ppm  •  Volatile agents ≤ 2 ppm', cx, H - 20, '#ffcc44', 8);
  _txt(ctx, 'OR ventilation: minimum 15 complete air exchanges/hour', cx, H - 9, '#aaaaff', 7);

  const topic = q.metadata?.topic || 'Scavenging';
  _txt(ctx, topic.toUpperCase(), W - 8, 10, '#4488ff', 7, 'right');
}

// ─── SCENE: Bellows / Ventilator ─────────────────────────────────────────────

function _sceneBellows(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#030810');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'ASCENDING BELLOWS — VENTILATOR', cx, 14, '#44ccff', 10);

  // Bellows shape (accordion)
  const bX = cx, bBaseY = cy + 42;
  const bH = 55 + 18 * Math.abs(Math.sin(t * 1.8)); // ascending on exhale
  const bW = 44;
  const nFolds = 5;
  const foldH = bH / nFolds;

  ctx.save();
  ctx.strokeStyle = '#44ccff'; ctx.lineWidth = 1.8;
  _glow(ctx, '#44ccff', 6);
  for (let i = 0; i <= nFolds; i++) {
    const fy = bBaseY - i * foldH;
    const fw = (i % 2 === 0) ? bW : bW * 0.75;
    ctx.beginPath();
    ctx.moveTo(bX - fw / 2, fy);
    ctx.lineTo(bX + fw / 2, fy);
    ctx.stroke();
    if (i > 0) {
      ctx.beginPath();
      ctx.moveTo(bX - bW / 2, fy);
      ctx.lineTo(bX - fw / 2, fy - foldH * 0.5);
      ctx.moveTo(bX + bW / 2, fy);
      ctx.lineTo(bX + fw / 2, fy - foldH * 0.5);
      ctx.stroke();
    }
  }
  ctx.restore();

  // Arrow showing rise direction
  _arrow(ctx, bX + bW * 0.7, bBaseY - bH - 10, bX + bW * 0.7, bBaseY - bH - 28, '#00ff88', 2);
  _txt(ctx, '↑ RISES on exhale', bX + bW * 0.7 + 30, bBaseY - bH - 20, '#00ff88', 7, 'left');

  // Disconnect indicator (red X)
  const discAlpha = 0.4 + 0.4 * Math.abs(Math.sin(t * 3));
  ctx.save();
  ctx.globalAlpha = discAlpha;
  ctx.strokeStyle = '#ff2200'; ctx.lineWidth = 3;
  _glow(ctx, '#ff2200', 10);
  const dx = bX - 65, dy = bBaseY - bH * 0.5;
  ctx.beginPath();
  ctx.moveTo(dx - 10, dy - 10); ctx.lineTo(dx + 10, dy + 10);
  ctx.moveTo(dx + 10, dy - 10); ctx.lineTo(dx - 10, dy + 10);
  ctx.stroke();
  ctx.restore();
  _txt(ctx, 'FAILS TO RISE', bX - 65, dy + 20, '#ff4444', 7);
  _txt(ctx, '→ DISCONNECT', bX - 65, dy + 32, '#ff6666', 7);

  _txt(ctx, 'Ascending bellows: VISUALLY ALERTS on disconnect', cx, H - 18, '#44ccff', 8);
  _txt(ctx, 'Descending (hanging) bellows fall by gravity — MASKS disconnect', cx, H - 7, '#ff8844', 7);

  const topic = q.metadata?.topic || 'Ventilator';
  _txt(ctx, topic.toUpperCase(), W - 8, 10, '#4488ff', 7, 'right');
}

// ─── SCENE: Circle Breathing Circuit ────────────────────────────────────────

function _sceneCircuit(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020808');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'CIRCLE BREATHING CIRCUIT', cx, 14, '#00ffcc', 9);

  // Circle path
  const R = 42;
  ctx.save();
  ctx.strokeStyle = '#224444'; ctx.lineWidth = 12;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#00ffcc'; ctx.lineWidth = 2;
  _glow(ctx, '#00ffcc', 5);
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  // Animated gas particle around circuit
  const angle = t * 1.5;
  const px = cx + R * Math.cos(angle), py = cy + R * Math.sin(angle);
  ctx.save();
  ctx.fillStyle = '#00ff88'; _glow(ctx, '#00ff88', 10);
  ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Labels at cardinal positions
  _txt(ctx, 'PATIENT', cx, cy - R - 12, '#aaffcc', 8);
  _txt(ctx, 'Y-piece', cx, cy - R - 24, '#66aaaa', 7);
  _txt(ctx, 'CO2 ABSORBER', cx, cy + R + 12, '#44ffaa', 8);
  _txt(ctx, 'INSP CHECK VALVE', cx + R + 10, cy, '#ffcc44', 7, 'left');
  _txt(ctx, 'EXP CHECK VALVE', cx - R - 10, cy, '#ff8844', 7, 'right');

  // Check valves (must NEVER be both open)
  const valveAlpha = 0.6 + 0.4 * Math.abs(Math.sin(t * 2));
  ctx.save();
  ctx.globalAlpha = valveAlpha;
  ctx.fillStyle = '#ffcc44';
  ctx.beginPath(); ctx.arc(cx + R, cy, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  _txt(ctx, 'Insp + Exp valves must NEVER be open simultaneously', cx, H - 18, '#ffcc44', 7);
  _txt(ctx, 'APL fully open during spontaneous ventilation', cx, H - 7, '#00ffcc', 7);

  const topic = q.metadata?.topic || 'Breathing Circuit';
  _txt(ctx, topic.toUpperCase(), W - 8, 10, '#4488ff', 7, 'right');
}

// ─── SCENE: MSMAID Checklist ─────────────────────────────────────────────────

function _sceneMSMAID(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020412');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'MSMAID PRE-ANESTHESIA CHECKLIST', cx, 14, '#ffdd44', 10);

  const items = [
    { letter: 'M', word: 'Machine',   color: '#44ffcc' },
    { letter: 'S', word: 'Suction',   color: '#44aaff' },
    { letter: 'M', word: 'Monitors',  color: '#ff88cc' },
    { letter: 'A', word: 'Airway',    color: '#ffcc44' },
    { letter: 'I', word: 'IV access', color: '#88ff88' },
    { letter: 'D', word: 'Drugs',     color: '#ff8844' },
  ];

  const startY = cy - 42;
  const rowH = 18;

  items.forEach((item, i) => {
    const y = startY + i * rowH;
    const checkPulse = i === Math.floor((t * 0.8) % items.length);

    // Checkbox
    ctx.save();
    ctx.strokeStyle = item.color; ctx.lineWidth = 1.2;
    _glow(ctx, item.color, checkPulse ? 10 : 3);
    ctx.strokeRect(cx - 90, y - 7, 13, 13);
    if (checkPulse) {
      ctx.fillStyle = item.color;
      ctx.fillRect(cx - 88, y - 5, 9, 9);
    }
    ctx.restore();

    // Letter badge
    ctx.save();
    ctx.fillStyle = item.color;
    _glow(ctx, item.color, checkPulse ? 12 : 4);
    ctx.font = `bold 11px "Courier New",monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.letter, cx - 65, y);
    ctx.restore();

    _txt(ctx, item.word, cx + 10, y, item.color, 9, 'left');
  });

  _txt(ctx, 'Systematic check performed BEFORE every anesthetic', cx, H - 10, '#ffdd44', 8);

  const topic = q.metadata?.topic || 'MSMAID';
  _txt(ctx, topic.toUpperCase(), W - 8, 10, '#4488ff', 7, 'right');
}

// ─── SCENE: Troubleshooting / Disconnect / Obstruction ───────────────────────

function _sceneTroubleshoot(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#080202');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'CIRCUIT TROUBLESHOOTING', cx, 14, '#ff4444', 10);

  // Circuit line
  const lineY = cy - 10;
  ctx.save();
  ctx.strokeStyle = '#336633'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(20, lineY); ctx.lineTo(W - 20, lineY); ctx.stroke();
  ctx.restore();

  // Pressure waveform (flat if disconnect, spiked if obstruction)
  const waveX = 20;
  const waveW = W - 40;
  ctx.save();
  ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 1.8;
  _glow(ctx, '#00ff88', 5);
  ctx.beginPath();
  for (let px = 0; px < waveW; px++) {
    const phase = (px / waveW + t * 0.3) % 1;
    let amp;
    if (phase < 0.3) {
      amp = 20 * Math.sin(phase / 0.3 * Math.PI); // normal breath
    } else {
      amp = 2 * Math.sin((phase - 0.3) / 0.7 * Math.PI * 2); // near-flat = disconnect
    }
    const py = lineY + 28 - amp;
    if (px === 0) ctx.moveTo(waveX + px, py);
    else ctx.lineTo(waveX + px, py);
  }
  ctx.stroke();
  ctx.restore();

  // Warning indicator
  const warn = 0.5 + 0.5 * Math.abs(Math.sin(t * 3));
  ctx.save();
  ctx.globalAlpha = warn;
  ctx.fillStyle = 'rgba(255,0,0,.3)';
  ctx.fillRect(cx - 55, cy + 16, 110, 20);
  ctx.restore();
  _txt(ctx, '⚠  DISCONNECT DETECTED', cx, cy + 26, '#ff4444', 9);

  // Known causes
  ctx.save();
  ctx.fillStyle = 'rgba(30,10,10,.7)';
  ctx.fillRect(cx - 115, H - 54, 230, 44);
  ctx.restore();
  _txt(ctx, 'MOST COMMON DISCONNECT SITE: ETT ↔ circuit', cx, H - 45, '#ff8844', 8);
  _txt(ctx, 'Obstruction causes: kinked ETT, wrong selector position,', cx, H - 33, '#ffcc44', 7);
  _txt(ctx, 'machine on hose, absorbent wrapper left in canister', cx, H - 21, '#ffcc44', 7);
  _txt(ctx, 'Bellows fails to RISE → leak. Tx: ↑ FGF if absorber exhausted', cx, H - 9, '#ff4444', 7);

  const topic = q.metadata?.topic || 'Troubleshooting';
  _txt(ctx, topic.toUpperCase(), W - 8, 10, '#4488ff', 7, 'right');
}

// ─── SCENE: Default (Anesthesia Machine Silhouette) ──────────────────────────

function _sceneDefault(ctx, W, H, q, t) {
  _bg(ctx, W, H, '#020510');
  const cx = W / 2, cy = H / 2;

  _txt(ctx, 'ANESTHESIA MACHINE — CHAPTER 11', cx, 14, '#4488ff', 9);

  const pulse = 1 + 0.03 * Math.sin(t * 1.2);

  // Machine body (main column)
  ctx.save();
  ctx.fillStyle = 'rgba(20,30,60,.7)';
  ctx.fillRect(cx - 50, cy - 55, 100, 95);
  ctx.strokeStyle = '#4488ff'; ctx.lineWidth = 2;
  _glow(ctx, '#4488ff', 6 * pulse);
  ctx.strokeRect(cx - 50, cy - 55, 100, 95);
  ctx.restore();

  // Screen display
  ctx.save();
  ctx.fillStyle = 'rgba(0,100,60,.5)';
  ctx.fillRect(cx - 38, cy - 48, 76, 34);
  ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 1;
  ctx.strokeRect(cx - 38, cy - 48, 76, 34);
  ctx.restore();
  _txt(ctx, 'ANESTHESIA', cx, cy - 35, '#00ff88', 8);
  _txt(ctx, 'MACHINE', cx, cy - 22, '#00cc66', 7);

  // Vaporizer slots
  for (let i = 0; i < 2; i++) {
    const vx = cx - 22 + i * 28;
    ctx.save();
    ctx.fillStyle = `rgba(${i === 0 ? '80,30,0' : '40,0,80'},.5)`;
    ctx.fillRect(vx - 10, cy - 5, 20, 32);
    ctx.strokeStyle = i === 0 ? '#ff8844' : '#cc44ff'; ctx.lineWidth = 1.2;
    ctx.strokeRect(vx - 10, cy - 5, 20, 32);
    ctx.restore();
    _txt(ctx, i === 0 ? 'SEV' : 'ISO', vx, cy + 11, i === 0 ? '#ff8844' : '#cc44ff', 7);
  }

  // Flowmeter bank
  for (let i = 0; i < 3; i++) {
    const fx = cx - 34 + i * 34;
    const fh = 18 + 8 * Math.sin(t * 0.8 + i);
    ctx.save();
    ctx.strokeStyle = ['#4488ff', '#ffcc44', '#00ff88'][i]; ctx.lineWidth = 1;
    ctx.strokeRect(fx - 4, cy + 35, 8, 18);
    ctx.fillStyle = ['#4488ff', '#ffcc44', '#00ff88'][i];
    ctx.fillRect(fx - 3, cy + 35 + 18 - fh * 0.5, 6, fh * 0.5);
    ctx.restore();
  }

  // Wheels
  for (const wx of [cx - 40, cx + 40]) {
    ctx.save();
    ctx.strokeStyle = '#445566'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(wx, cy + 40, 8, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  _txt(ctx, 'High → Intermediate → Low Pressure Systems', cx, H - 18, '#4488ff', 8);
  _txt(ctx, 'PISS • DISS • Vaporizer • Absorber • Scavenging', cx, H - 7, '#44aaff', 7);

  const topic = q.metadata?.topic || 'Machine';
  _txt(ctx, topic.toUpperCase(), W - 8, 10, '#4488ff', 7, 'right');
}

// ─── expose on window for dynamic dispatch ────────────────────────────────────

window.renderAnesthesiaMachineScene = renderAnesthesiaMachineScene;
window.stopAnesthesiaMachineScene   = stopAnesthesiaMachineScene;
