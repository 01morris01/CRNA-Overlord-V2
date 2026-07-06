/**
 * HOSPITAL MAP — 3D course selector ("Voss General: Simulation Wing").
 *
 * Upgrades the SELECT STUDY PATH screen: wraps window.showCourseSelector so the
 * classic card grid still renders (and remains the fallback for no-WebGL /
 * grid-preference / any runtime error), then mounts a Three.js hospital floor
 * plan in its place. Each course is a rotation bay in a cross-shaped building:
 * central hub, four wings, two bays per wing. Entering a bay routes through the
 * exact same path as a card click: selectedCourseId = id; showTopicMap().
 *
 * Load order: after three.js and legacy/legacy.js (needs COURSES, loadSave,
 * showTopicMap, showSplash, openStore, selectedCourseId at CALL time).
 */
(function(){
'use strict';

var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var PREF_KEY = 'voss_hospital_view'; // '3d' | 'grid'

var CODES = {
  'adv-phys-path-1':'PP1', 'adv-phys-path-2':'PP2', 'tech-advances-anesthesia':'TEC',
  'adv-pharmacology-1':'AP1', 'regional-anesthesia':'REG', 'basics-anesthesia':'BAS',
  'chem-phys-anesthesia':'CPA', 'adv-health-assess':'AHA'
};
/* nodeConfig course ids → legacy course ids (lastSeen.course may hold either) */
var ID_ALIAS = { 'basics-of-anesthesia':'basics-anesthesia', 'adv-health-assessment':'adv-health-assess' };

var WING_NAMES = ['PHYSIOLOGY WING', 'CLINICAL WING', 'ANESTHESIA WING', 'SCIENCES WING'];

/* Cross-shaped floor plan: fx/fz is the unit vector from bay toward corridor. */
var LAYOUT = [
  {x:-6.5, z: 12,   fx: 1, fz: 0},   /* south wing  */
  {x: 6.5, z: 12,   fx:-1, fz: 0},
  {x:-12,  z: 5.5,  fx: 0, fz:-1},   /* west wing   */
  {x:-12,  z:-5.5,  fx: 0, fz: 1},
  {x:-6.5, z:-12,   fx: 1, fz: 0},   /* north wing  */
  {x: 6.5, z:-12,   fx:-1, fz: 0},
  {x: 12,  z:-5.5,  fx: 0, fz: 1},   /* east wing   */
  {x: 12,  z: 5.5,  fx: 0, fz:-1}
];

var STYLE = {
  done:    {color:'#00ffa3', hex:0x00ffa3, word:'COMPLETE',    edge:.55, glow:.3 },
  current: {color:'#ffb000', hex:0xffb000, word:'IN PROGRESS', edge:.85, glow:.5 },
  open:    {color:'#3a7bff', hex:0x3a7bff, word:'AVAILABLE',   edge:.5,  glow:.26}
};

/* ─── module state ──────────────────────────────────────────────────────── */
var built = false, failed = false, active = false;
var container, labelsWrap, panelEl, hudProgress, hudFill, hudPts;
var renderer, scene, camera, raf = 0;
var bays = [];
var hitboxes = [];
var glowCache = {};
var mode = 'overview', focusI = null, hoverI = null;
var user = {theta:0, phi:0, dist:1};
var cam = {tx:0, ty:.5, tz:0, dist:46, theta:0, phi:1.02};
var routeCurve, pulse, pulseGlow, pawn, ping, curLight, dust;
var now = 0, last = 0, pulseT = 0;
var sizedW = -1, sizedH = -1;

function pref(){ try { return localStorage.getItem(PREF_KEY) || '3d'; } catch(e){ return '3d'; } }
function setPref(v){ try { localStorage.setItem(PREF_KEY, v); } catch(e){ /* ignore */ } }
function grid(){ return document.getElementById('course-selection-container'); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

/* ─── per-course progress from the same save the topic map reads ────────── */
function buildData(){
  var save = (typeof loadSave === 'function' && loadSave()) || {};
  var stats = save.topicStats || {};
  var lastCourse = save.lastSeen && save.lastSeen.course || null;
  var cur = ID_ALIAS[lastCourse] || lastCourse;

  return COURSES.map(function(course, i){
    var topics = course.topics || [];
    var done = 0;
    topics.forEach(function(t){ var s = stats[t.id]; if (s && s.bestPct >= 60) done++; });
    var total = topics.length;
    var state = 'open';
    if (total > 0 && done >= total) state = 'done';
    else if (course.id === cur) state = 'current';
    var f = total ? done / total : 0;
    return {
      id: course.id,
      code: CODES[course.id] || (course.id.slice(0,3).toUpperCase()),
      bay: 'BAY ' + String(i + 1).padStart(2, '0'),
      name: course.title,
      done: done, total: total, state: state,
      stars: f >= 1 ? 3 : f >= .6 ? 2 : f >= .2 ? 1 : 0
    };
  });
}

/* ─── svg + canvas helpers ──────────────────────────────────────────────── */
function starSVG(on){
  return '<svg viewBox="0 0 24 24" class="hm-star' + (on ? ' on' : '') + '"><path d="M12 2 L14.6 9.4 L22 12 L14.6 14.6 L12 22 L9.4 14.6 L2 12 L9.4 9.4 Z"/></svg>';
}
function starsRow(n){
  var s = '';
  for (var i = 0; i < 3; i++) s += starSVG(i < n);
  return s;
}
function hexToRgb(h){
  var n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function glowTex(col){
  if (glowCache[col]) return glowCache[col];
  var cv = document.createElement('canvas'); cv.width = cv.height = 128;
  var g = cv.getContext('2d'), c = hexToRgb(col);
  var gr = g.createRadialGradient(64, 64, 2, 64, 64, 64);
  gr.addColorStop(0,  'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',.9)');
  gr.addColorStop(.4, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',.28)');
  gr.addColorStop(1,  'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  glowCache[col] = new THREE.CanvasTexture(cv);
  return glowCache[col];
}
function ecgY(p){
  if (p < .08) return 2 * Math.sin(p / .08 * Math.PI);
  if (p < .12) return 0;
  if (p < .15) return -4 * ((p - .12) / .03);
  if (p < .19) return -4 + 18 * ((p - .15) / .04);
  if (p < .23) return 14 - 20 * ((p - .19) / .04);
  if (p < .30) return -6 + 6 * ((p - .23) / .07);
  if (p < .52) return 0;
  if (p < .66) return 3.4 * Math.sin((p - .52) / .14 * Math.PI);
  return 0;
}
function canvasStar(g, x, y, r){
  var ir = r * .42;
  g.beginPath();
  for (var i = 0; i < 8; i++){
    var a = -Math.PI / 2 + i * Math.PI / 4;
    var rr = (i % 2 === 0) ? r : ir;
    var px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr;
    if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
  }
  g.closePath();
}

function drawMonitor(b){
  var g = b._mcv.getContext('2d');
  var st = STYLE[b.state], acc = st.color;
  g.clearRect(0, 0, 512, 320);
  g.fillStyle = '#081221'; g.fillRect(0, 0, 512, 320);
  g.globalAlpha = .5; g.strokeStyle = acc; g.lineWidth = 3;
  g.strokeRect(6, 6, 500, 308); g.globalAlpha = 1;

  g.font = '500 20px "JetBrains Mono", monospace';
  g.fillStyle = '#93a5c4'; g.textAlign = 'left';
  g.fillText(b.bay, 26, 42);
  g.fillStyle = acc; g.textAlign = 'right';
  g.fillText(st.word, 486, 42);

  g.textAlign = 'left';
  g.font = '700 96px Antonio, sans-serif';
  g.fillStyle = '#f2ead8';
  g.fillText(b.code, 26, 150);

  for (var i = 0; i < 3; i++){
    canvasStar(g, 400 + i * 36, 124, 13);
    if (i < b.stars){ g.fillStyle = '#ffb000'; g.fill(); }
    else { g.strokeStyle = 'rgba(93,112,147,.7)'; g.lineWidth = 2; g.stroke(); }
  }

  var fs = 19;
  g.font = '500 ' + fs + 'px "JetBrains Mono", monospace';
  while (g.measureText(b.name).width > 462 && fs > 12){
    fs--; g.font = '500 ' + fs + 'px "JetBrains Mono", monospace';
  }
  g.fillStyle = '#93a5c4';
  g.fillText(b.name, 26, 190);

  g.lineWidth = 2.5; g.strokeStyle = acc;
  g.beginPath();
  for (var x = 0; x <= 460; x += 2){
    var y = 228 - ecgY((x % 140) / 140) * 2.1;
    if (x === 0) g.moveTo(26, y); else g.lineTo(26 + x, y);
  }
  g.stroke();

  var pct = b.total ? b.done / b.total : 0;
  g.fillStyle = 'rgba(143,168,255,.16)'; g.fillRect(26, 272, 340, 13);
  g.fillStyle = acc; g.fillRect(26, 272, 340 * pct, 13);
  g.font = '500 22px "JetBrains Mono", monospace';
  g.fillStyle = '#f2ead8'; g.textAlign = 'right';
  g.fillText(b.done + ' of ' + b.total, 486, 285);
  g.textAlign = 'left';
  b._mtx.needsUpdate = true;
}

/* ─── DOM shell ─────────────────────────────────────────────────────────── */
function injectCSS(){
  if (document.getElementById('hospital-map-css')) return;
  var css = [
    '#hospital-selector{position:relative;width:100%;flex:1 1 auto;min-height:min(72vh,560px);display:none;border-radius:8px;overflow:hidden;border:1px solid var(--line,#1a2940);background:radial-gradient(120% 90% at 50% 0%, #081226 0%, #04080f 60%);}',
    '#hospital-selector .hm-stage{position:absolute;inset:0;touch-action:none;}',
    '#hospital-selector .hm-stage canvas{display:block;width:100%;height:100%;}',
    '#hospital-selector .hm-labels{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:3;}',
    '.hm-lcard{position:absolute;left:0;top:0;will-change:transform;background:rgba(9,17,32,.82);border:1px solid rgba(143,168,255,.16);border-radius:8px;padding:5px 9px;max-width:230px;box-shadow:0 10px 30px rgba(0,0,0,.4);transition:opacity .25s,border-color .25s;}',
    '.hm-lcard.off{opacity:0;}.hm-lcard.dim{opacity:.35;}',
    '.hm-lhead{display:flex;align-items:center;gap:7px;white-space:nowrap;}',
    '.hm-ldot{width:7px;height:7px;border-radius:50%;background:var(--acc,#5d7093);box-shadow:0 0 8px var(--acc,#5d7093);}',
    '.hm-lbay{font-family:var(--fm,monospace);font-size:.42rem;letter-spacing:.14em;color:#5d7093;}',
    '.hm-lcode{font-family:var(--fm,monospace);font-weight:700;font-size:.52rem;letter-spacing:.1em;color:#f2ead8;}',
    '.hm-lbody{max-height:0;opacity:0;overflow:hidden;transition:max-height .3s,opacity .25s;}',
    '.hm-lcard.open{border-color:var(--acc,rgba(143,168,255,.34));}',
    '.hm-lcard.open .hm-lbody{max-height:120px;opacity:1;}',
    '.hm-lname{font-size:.5rem;color:#dbe4f5;margin-top:6px;line-height:1.35;font-weight:500;}',
    '.hm-lmeta{display:flex;align-items:center;gap:7px;margin-top:6px;}',
    '.hm-lbar{flex:1;height:3px;background:rgba(143,168,255,.14);border-radius:2px;overflow:hidden;}',
    '.hm-lbar i{display:block;height:100%;background:var(--acc,#5d7093);}',
    '.hm-lcount{font-family:var(--fm,monospace);font-size:.42rem;color:#93a5c4;white-space:nowrap;}',
    '.hm-star{width:11px;height:11px;fill:none;stroke:#5d7093;stroke-width:1.6;}',
    '.hm-star.on{fill:#ffb000;stroke:#ffb000;}',
    '#hospital-selector .hm-vig{position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(ellipse at 50% 42%, transparent 52%, rgba(2,5,10,.6) 100%);}',
    '#hospital-selector .hm-scan{position:absolute;inset:0;z-index:6;pointer-events:none;opacity:.45;background:repeating-linear-gradient(0deg, rgba(255,255,255,.022) 0 1px, transparent 1px 3px);}',
    '.hm-hud{position:absolute;z-index:4;pointer-events:none;font-family:var(--fm,monospace);}',
    '.hm-brand{top:10px;left:12px;}',
    '.hm-brand-name{font-family:var(--fd,sans-serif);font-weight:700;font-size:1rem;letter-spacing:.14em;color:#f2ead8;line-height:1;}',
    '.hm-brand-sub{font-size:.42rem;letter-spacing:.32em;color:#8fa8ff;margin-top:4px;}',
    '.hm-brand-vitals{display:flex;align-items:center;gap:8px;margin-top:7px;padding-top:7px;border-top:1px solid rgba(143,168,255,.16);}',
    '.hm-ecg{width:110px;height:26px;}',
    '.hm-hr{font-family:var(--fm,monospace);font-weight:700;font-size:.7rem;color:#00ffa3;}',
    '.hm-hr small{font-weight:400;font-size:.4rem;letter-spacing:.2em;color:#5d7093;margin-left:3px;}',
    '@media (max-width:700px){.hm-brand-vitals{display:none;}}',
    '.hm-prog{top:10px;right:12px;text-align:right;}',
    '.hm-prog-label{font-size:.42rem;letter-spacing:.26em;color:#5d7093;}',
    '.hm-prog-main{font-size:.55rem;color:#f2ead8;margin-top:5px;}',
    '.hm-prog-bar{height:3px;width:150px;background:rgba(143,168,255,.14);border-radius:2px;margin-top:6px;margin-left:auto;overflow:hidden;}',
    '.hm-prog-bar i{display:block;height:100%;width:0;background:#ffb000;border-radius:2px;transition:width .8s;}',
    '.hm-legend{left:12px;bottom:12px;display:flex;gap:12px;padding:7px 11px;background:rgba(9,17,32,.72);border:1px solid rgba(143,168,255,.16);border-radius:8px;}',
    '.hm-lg-row{display:flex;align-items:center;gap:6px;font-size:.42rem;color:#93a5c4;}',
    '.hm-lg-chip{width:8px;height:8px;border-radius:50%;background:var(--c);box-shadow:0 0 7px var(--c);}',
    '.hm-hint{right:12px;bottom:12px;font-size:.4rem;letter-spacing:.06em;color:#5d7093;max-width:250px;line-height:1.7;text-align:right;}',
    '.hm-panel{position:absolute;right:14px;top:50%;z-index:5;width:262px;transform:translate(20px,-50%);opacity:0;pointer-events:none;padding:16px;background:rgba(9,17,32,.9);border:1px solid rgba(143,168,255,.16);border-top:2px solid var(--acc,#3a7bff);border-radius:12px;backdrop-filter:blur(12px);transition:transform .4s,opacity .3s;font-family:var(--fb,sans-serif);}',
    '.hm-panel.on{transform:translate(0,-50%);opacity:1;pointer-events:auto;}',
    '.hm-p-top{display:flex;justify-content:space-between;font-family:var(--fm,monospace);font-size:.46rem;letter-spacing:.14em;}',
    '.hm-p-bay{color:#5d7093;}.hm-p-status{color:var(--acc,#3a7bff);font-weight:700;}',
    '.hm-p-name{font-family:var(--fd,sans-serif);font-weight:600;font-size:.95rem;line-height:1.15;color:#f2ead8;margin-top:9px;letter-spacing:.02em;}',
    '.hm-p-bar{height:4px;background:rgba(143,168,255,.14);border-radius:3px;margin-top:12px;overflow:hidden;}',
    '.hm-p-bar i{display:block;height:100%;width:0;background:var(--acc,#3a7bff);border-radius:3px;transition:width .6s;}',
    '.hm-p-meta{display:flex;justify-content:space-between;align-items:center;margin-top:7px;font-family:var(--fm,monospace);font-size:.5rem;color:#93a5c4;}',
    '.hm-p-starrow{display:flex;gap:3px;}',
    '.hm-p-enter{display:block;width:100%;margin-top:13px;font-family:var(--fm,monospace);font-weight:700;font-size:.52rem;letter-spacing:.2em;text-transform:uppercase;color:#04080f;background:var(--acc,#3a7bff);border:none;border-radius:8px;padding:11px 0;cursor:pointer;transition:transform .16s,filter .2s;}',
    '.hm-p-enter:hover{filter:brightness(1.12);}.hm-p-enter:active{transform:scale(.97);}',
    '.hm-p-back{display:block;width:100%;margin-top:8px;background:none;border:1px solid rgba(143,168,255,.16);border-radius:8px;font-family:var(--fm,monospace);font-size:.46rem;letter-spacing:.16em;color:#93a5c4;padding:8px 0;cursor:pointer;}',
    '.hm-p-back:hover{border-color:rgba(143,168,255,.34);color:#dbe4f5;}',
    '.hm-bar{display:flex;align-items:center;gap:.8rem;padding:.6rem 0;margin-top:.5rem;border-top:1px solid var(--line,#1a2940);font-family:var(--fm,monospace);font-size:.5rem;width:100%;}',
    '.hm-bar .hm-pts{color:var(--amber,#ffb000);}',
    '.hm-bar .hm-sep{color:var(--muted-2,#384a66);}',
    '.hm-bar .hm-inv{color:var(--muted,#5a6f8a);}',
    '.hm-bar button{background:none;border:1px solid var(--line,#1a2940);font-family:var(--fm,monospace);font-size:.5rem;padding:.25rem .7rem;cursor:pointer;border-radius:3px;letter-spacing:.1em;}',
    '.hm-btn-store{color:var(--amber,#ffb000);}',
    '.hm-btn-grid,.hm-btn-back{color:var(--muted,#5a6f8a);}',
    '.hm-3d-toggle{background:none;border:1px solid var(--line,#1a2940);color:#8fa8ff;font-family:var(--fm,monospace);font-size:.5rem;padding:.25rem .7rem;cursor:pointer;border-radius:3px;letter-spacing:.1em;}',
    '@media (max-width:700px){',
    '  .hm-panel{left:10px;right:10px;top:auto;bottom:10px;width:auto;transform:translateY(16px);}',
    '  .hm-panel.on{transform:translateY(0);}',
    '  .hm-hint{display:none;}',
    '  .hm-legend{gap:8px;padding:6px 9px;}',
    '  .hm-lcard{max-width:170px;}',
    '  #hospital-selector.hm-focus .hm-lcard{opacity:0;}',
    '}',
    '@media (prefers-reduced-motion: reduce){.hm-panel,.hm-lcard,.hm-p-bar i,.hm-prog-bar i{transition-duration:.01ms!important;}}'
  ].join('\n');
  var el = document.createElement('style');
  el.id = 'hospital-map-css';
  el.textContent = css;
  document.head.appendChild(el);
}

function ensureDOM(){
  if (container) return;
  injectCSS();
  var sel = document.getElementById('course-selector');
  var gridEl = grid();
  if (!sel || !gridEl) throw new Error('course selector DOM not found');

  container = document.createElement('div');
  container.id = 'hospital-selector';
  container.innerHTML =
      '<div class="hm-stage"></div>'
    + '<div class="hm-vig"></div>'
    + '<div class="hm-labels"></div>'
    + '<div class="hm-hud hm-brand"><div class="hm-brand-name">VOSS GENERAL</div><div class="hm-brand-sub">SIMULATION WING</div>'
    +   '<div class="hm-brand-vitals"><canvas class="hm-ecg" width="220" height="52"></canvas><span class="hm-hr">72<small>HR</small></span></div>'
    + '</div>'
    + '<div class="hm-hud hm-prog"><div class="hm-prog-label">ROTATION PROGRESS</div><div class="hm-prog-main"></div><div class="hm-prog-bar"><i></i></div></div>'
    + '<div class="hm-hud hm-legend">'
    +   '<div class="hm-lg-row"><span class="hm-lg-chip" style="--c:#00ffa3"></span>Complete</div>'
    +   '<div class="hm-lg-row"><span class="hm-lg-chip" style="--c:#ffb000"></span>In progress</div>'
    +   '<div class="hm-lg-row"><span class="hm-lg-chip" style="--c:#3a7bff"></span>Available</div>'
    + '</div>'
    + '<div class="hm-hud hm-hint">Drag to orbit. Scroll to zoom. Arrows move between bays. Enter opens. Esc for overview.</div>'
    + '<div class="hm-panel">'
    +   '<div class="hm-p-top"><span class="hm-p-bay"></span><span class="hm-p-status"></span></div>'
    +   '<div class="hm-p-name"></div>'
    +   '<div class="hm-p-bar"><i></i></div>'
    +   '<div class="hm-p-meta"><span class="hm-p-count"></span><span class="hm-p-starrow"></span></div>'
    +   '<button class="hm-p-enter">Enter rotation</button>'
    +   '<button class="hm-p-back">Return to overview</button>'
    + '</div>'
    + '<div class="hm-scan"></div>';
  gridEl.parentNode.insertBefore(container, gridEl);
  initECG(container.querySelector('.hm-ecg'));

  /* bottom bar (pts / store / view toggle / back) shown with the 3D map */
  var bar = document.createElement('div');
  bar.className = 'hm-bar';
  bar.id = 'hospital-bar';
  bar.style.display = 'none';
  bar.innerHTML =
      '<span class="hm-pts"></span><span class="hm-sep">|</span><span class="hm-inv"></span><span style="flex:1;"></span>'
    + '<button class="hm-btn-store">STORE</button>'
    + '<button class="hm-btn-grid">GRID VIEW</button>'
    + '<button class="hm-btn-back">BACK</button>';
  gridEl.parentNode.insertBefore(bar, gridEl);

  labelsWrap = container.querySelector('.hm-labels');
  panelEl = container.querySelector('.hm-panel');
  hudProgress = container.querySelector('.hm-prog-main');
  hudFill = container.querySelector('.hm-prog-bar i');

  bar.querySelector('.hm-btn-store').onclick = function(){
    lastScreen = 'course-selector';
    if (typeof openStore === 'function') openStore();
  };
  bar.querySelector('.hm-btn-grid').onclick = function(){
    setPref('grid');
    showCourseSelector();
  };
  bar.querySelector('.hm-btn-back').onclick = function(){
    if (typeof showSplash === 'function') showSplash();
  };
  panelEl.querySelector('.hm-p-enter').onclick = function(){
    if (focusI == null) return;
    enterCourse(bays[focusI].id);
  };
  panelEl.querySelector('.hm-p-back').onclick = overview;
}

function enterCourse(courseId){
  hide();
  selectedCourseId = courseId;
  showTopicMap();
}

/* ─── HUD ECG sweep ─────────────────────────────────────────────────────── */
var _eg, _eW, _eH, _ex = 0, _eyPrev = 0;
function ecgAt(x){ return _eH * .62 - ecgY((x % 170) / 170) * 2.0; }
function initECG(cv){
  if (!cv) return;
  _eg = cv.getContext('2d');
  _eW = cv.width; _eH = cv.height;
  _eyPrev = _eH * .62;
  if (RM){
    _eg.strokeStyle = '#00ffa3'; _eg.lineWidth = 2.2; _eg.beginPath();
    for (var sx = 0; sx < _eW; sx += 2){
      var sy = ecgAt(sx);
      if (sx === 0) _eg.moveTo(sx, sy); else _eg.lineTo(sx, sy);
    }
    _eg.stroke();
  }
}
function stepECG(dt){
  if (RM || !_eg) return;
  var nx = _ex + dt * 110;
  _eg.strokeStyle = '#00ffa3'; _eg.lineWidth = 2.2;
  _eg.shadowColor = '#00ffa3'; _eg.shadowBlur = 5;
  while (_ex < nx){
    var x2 = _ex + 2;
    _eg.clearRect((x2 + 4) % _eW, 0, 26, _eH);
    _eg.beginPath();
    _eg.moveTo(_ex % _eW, _eyPrev);
    var ny = ecgAt(x2);
    if (x2 % _eW < _ex % _eW){ _eyPrev = ny; _ex = x2; continue; }
    _eg.lineTo(x2 % _eW, ny);
    _eg.stroke();
    _eyPrev = ny; _ex = x2;
  }
  _eg.shadowBlur = 0;
}

/* ─── scene construction ────────────────────────────────────────────────── */
function buildScene(){
  renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false });
  if (!renderer.getContext()) throw new Error('no WebGL context');
  renderer.setClearColor(0x04080f, 1);
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.querySelector('.hm-stage').appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x04080f, 42, 110);
  camera = new THREE.PerspectiveCamera(46, 1, .1, 300);

  scene.add(new THREE.HemisphereLight(0x2a3f66, 0x05070c, 1.0));
  var dir = new THREE.DirectionalLight(0x8fa8ff, .55);
  dir.position.set(-6, 14, 8);
  scene.add(dir);

  /* floor grid */
  var cv = document.createElement('canvas'); cv.width = cv.height = 256;
  var g = cv.getContext('2d');
  g.fillStyle = '#060d19'; g.fillRect(0, 0, 256, 256);
  g.strokeStyle = 'rgba(90,130,255,.09)'; g.lineWidth = 1;
  for (var i = 0; i <= 256; i += 32){
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke();
    g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke();
  }
  var ft = new THREE.CanvasTexture(cv);
  ft.wrapS = ft.wrapT = THREE.RepeatWrapping; ft.repeat.set(26, 26);
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), new THREE.MeshBasicMaterial({ map: ft }));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  /* ceiling light strips along both corridors */
  var stripMat = new THREE.MeshBasicMaterial({ color:0x2e5fbf, transparent:true, opacity:.3, blending:THREE.AdditiveBlending, depthWrite:false });
  for (var sv = -14; sv <= 14; sv += 4.7){
    [-2.7, 2.7].forEach(function(off){
      var sa = new THREE.Mesh(new THREE.BoxGeometry(.16, .05, 3.4), stripMat);
      sa.position.set(off, 5.2, sv); scene.add(sa);
      var sb = new THREE.Mesh(new THREE.BoxGeometry(3.4, .05, .16), stripMat);
      sb.position.set(sv, 5.2, off); scene.add(sb);
    });
  }

  /* building shell */
  var wallMat = new THREE.MeshLambertMaterial({ color:0x0d1830 });
  var wallEdgeMat = new THREE.LineBasicMaterial({ color:0x8fa8ff, transparent:true, opacity:.18 });
  function wall(cx, cz, w, d, h){
    h = h || 1.15;
    var geo = new THREE.BoxGeometry(w, h, d);
    var m = new THREE.Mesh(geo, wallMat);
    m.position.set(cx, h / 2, cz);
    scene.add(m);
    var e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), wallEdgeMat);
    e.position.copy(m.position);
    scene.add(e);
  }
  wall(-10.5, 12.25, .35, 8.5);  wall(10.5, 12.25, .35, 8.5);   /* south wing */
  wall(-6.75, 16.5, 7.85, .35);  wall(6.75, 16.5, 7.85, .35);
  wall(-10.5, -12.25, .35, 8.5); wall(10.5, -12.25, .35, 8.5);  /* north wing */
  wall(0, -16.5, 21.35, .35);
  wall(-12.25, -9, 8.5, .35);    wall(-12.25, 9, 8.5, .35);     /* west wing */
  wall(-16.5, 0, .35, 18.35);
  wall(12.25, -9, 8.5, .35);     wall(12.25, 9, 8.5, .35);      /* east wing */
  wall(16.5, 0, .35, 18.35);
  wall(-3.1, 16.5, .55, .55, 2.3); wall(3.1, 16.5, .55, .55, 2.3); /* entrance pylons */

  /* corridor slabs and centerlines */
  var slabMat = new THREE.MeshBasicMaterial({ color:0x0a1424 });
  var slabEW = new THREE.Mesh(new THREE.PlaneGeometry(33, 4.4), slabMat);
  slabEW.rotation.x = -Math.PI / 2; slabEW.position.y = .03;
  scene.add(slabEW);
  var slabNS = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 33), slabMat);
  slabNS.rotation.x = -Math.PI / 2; slabNS.position.y = .034;
  scene.add(slabNS);
  var hubSlab = new THREE.Mesh(new THREE.CircleGeometry(4.6, 48), new THREE.MeshBasicMaterial({ color:0x0d1a30 }));
  hubSlab.rotation.x = -Math.PI / 2; hubSlab.position.y = .038;
  scene.add(hubSlab);
  var lineMat = new THREE.MeshBasicMaterial({ color:0x3a7bff, transparent:true, opacity:.4, blending:THREE.AdditiveBlending, depthWrite:false });
  var clEW = new THREE.Mesh(new THREE.PlaneGeometry(33, .12), lineMat);
  clEW.rotation.x = -Math.PI / 2; clEW.position.y = .042;
  scene.add(clEW);
  var clNS = new THREE.Mesh(new THREE.PlaneGeometry(.12, 33), lineMat);
  clNS.rotation.x = -Math.PI / 2; clNS.position.y = .042;
  scene.add(clNS);

  /* central hub: nurse station */
  var desk = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.8, .85, 24),
    new THREE.MeshLambertMaterial({ color:0x0b1526 })
  );
  desk.position.y = .43;
  scene.add(desk);
  var hubRing = new THREE.Mesh(
    new THREE.RingGeometry(2.4, 2.62, 64),
    new THREE.MeshBasicMaterial({ color:0x3a7bff, transparent:true, opacity:.3, side:THREE.DoubleSide, depthWrite:false })
  );
  hubRing.rotation.x = -Math.PI / 2; hubRing.position.y = .05;
  scene.add(hubRing);
  var crossCv = document.createElement('canvas'); crossCv.width = crossCv.height = 128;
  var cg = crossCv.getContext('2d');
  cg.fillStyle = '#ff3366';
  cg.fillRect(46, 20, 36, 88);
  cg.fillRect(20, 46, 88, 36);
  var hubCross = new THREE.Sprite(new THREE.SpriteMaterial({
    map:new THREE.CanvasTexture(crossCv), transparent:true, opacity:.9, depthWrite:false
  }));
  hubCross.scale.set(1.5, 1.5, 1);
  hubCross.position.set(0, 3.1, 0);
  scene.add(hubCross);
  var hubLight = new THREE.PointLight(0x3a7bff, .5, 18);
  hubLight.position.set(0, 4, 0);
  scene.add(hubLight);

  /* wing signs */
  function wingSign(txt, x, z){
    var scv = document.createElement('canvas'); scv.width = 512; scv.height = 96;
    var sg = scv.getContext('2d');
    sg.font = '700 40px Antonio, sans-serif';
    sg.textAlign = 'center'; sg.textBaseline = 'middle';
    sg.fillStyle = '#8fa8ff';
    sg.fillText(txt.split('').join(' '), 256, 48);
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map:new THREE.CanvasTexture(scv), transparent:true, opacity:.85, depthWrite:false }));
    s.scale.set(9, 1.69, 1);
    s.position.set(x, 2.5, z);
    scene.add(s);
  }
  wingSign(WING_NAMES[0], 0, 12.8);
  wingSign(WING_NAMES[1], -13, 0);
  wingSign(WING_NAMES[2], 0, -12.8);
  wingSign(WING_NAMES[3], 13, 0);

  /* entrance board */
  var bcv = document.createElement('canvas'); bcv.width = 512; bcv.height = 128;
  var bg = bcv.getContext('2d');
  bg.fillStyle = '#0a1424'; bg.fillRect(0, 0, 512, 128);
  bg.strokeStyle = 'rgba(58,123,255,.7)'; bg.lineWidth = 4;
  bg.strokeRect(4, 4, 504, 120);
  bg.fillStyle = '#ff3366';
  bg.fillRect(52, 34, 18, 60);
  bg.fillRect(31, 55, 60, 18);
  bg.font = '700 44px Antonio, sans-serif';
  bg.textAlign = 'left'; bg.textBaseline = 'middle';
  bg.fillStyle = '#f2ead8';
  bg.fillText('MAIN ENTRANCE', 122, 66);
  var board = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 1.5),
    new THREE.MeshBasicMaterial({ map:new THREE.CanvasTexture(bcv), side:THREE.DoubleSide })
  );
  board.position.set(0, 2.05, 16.62);
  scene.add(board);

  /* helipad */
  var pcv = document.createElement('canvas'); pcv.width = pcv.height = 256;
  var pg = pcv.getContext('2d');
  pg.strokeStyle = 'rgba(143,168,255,.85)'; pg.lineWidth = 10;
  pg.beginPath(); pg.arc(128, 128, 108, 0, Math.PI * 2); pg.stroke();
  pg.font = '900 130px Antonio, sans-serif';
  pg.textAlign = 'center'; pg.textBaseline = 'middle';
  pg.fillStyle = 'rgba(143,168,255,.85)';
  pg.fillText('H', 128, 136);
  var pad = new THREE.Mesh(
    new THREE.PlaneGeometry(5.5, 5.5),
    new THREE.MeshBasicMaterial({ map:new THREE.CanvasTexture(pcv), transparent:true, depthWrite:false })
  );
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(0, .025, 21.2);
  scene.add(pad);

  /* bays */
  bays.forEach(function(b, i){
    var st = STYLE[b.state];
    var L = LAYOUT[i];
    b.x = L.x; b.z = L.z; b.fx = L.fx; b.fz = L.fz;
    b.ang = Math.atan2(L.fx, L.fz);

    var grp = new THREE.Group();
    grp.position.set(b.x, 0, b.z);

    var plinth = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, .25, 3.6),
      new THREE.MeshLambertMaterial({ color:0x0b1526 })
    );
    plinth.position.y = .125;
    grp.add(plinth);

    var glassGeo = new THREE.BoxGeometry(3.1, 2.4, 3.1);
    b._glassMat = new THREE.MeshPhongMaterial({ color: st.hex, transparent:true, opacity:.07, shininess:90, depthWrite:false });
    var glass = new THREE.Mesh(glassGeo, b._glassMat);
    glass.position.y = 1.45;
    grp.add(glass);

    var edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(glassGeo),
      new THREE.LineBasicMaterial({ color: st.hex, transparent:true, opacity: st.edge })
    );
    edges.position.y = 1.45;
    grp.add(edges);
    b._edges = edges;

    b._coreMat = new THREE.MeshBasicMaterial({ color: st.hex, transparent:true, opacity:.5 });
    var core = new THREE.Mesh(new THREE.BoxGeometry(2.7, .1, 2.7), b._coreMat);
    core.position.y = .3;
    grp.add(core);

    b._mcv = document.createElement('canvas');
    b._mcv.width = 512; b._mcv.height = 320;
    b._mtx = new THREE.CanvasTexture(b._mcv);
    b._mtx.anisotropy = 8;
    drawMonitor(b);
    var mon = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 1.56),
      new THREE.MeshBasicMaterial({ map: b._mtx })
    );
    mon.position.set(b.fx * 1.3, 1.55, b.fz * 1.3);
    mon.rotation.y = b.ang;
    grp.add(mon);

    b._glowMat = new THREE.SpriteMaterial({
      map: glowTex(st.color), transparent:true, opacity: st.glow,
      blending:THREE.AdditiveBlending, depthWrite:false
    });
    var glow = new THREE.Sprite(b._glowMat);
    glow.scale.set(5.4, 5.4, 1);
    glow.position.y = 1.5;
    grp.add(glow);
    b._glow = glow;

    b._blobMat = new THREE.MeshBasicMaterial({
      map: glowTex(st.color), transparent:true, opacity:.16,
      blending:THREE.AdditiveBlending, depthWrite:false
    });
    var blob = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 5.6), b._blobMat);
    blob.rotation.x = -Math.PI / 2;
    blob.position.y = .02;
    grp.add(blob);

    var hit = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 3.4, 3.8),
      new THREE.MeshBasicMaterial({ visible:false })
    );
    hit.position.y = 1.6;
    hit.userData.i = i;
    grp.add(hit);
    hitboxes.push(hit);

    scene.add(grp);
    b._grp = grp;

    var el = document.createElement('div');
    el.className = 'hm-lcard';
    labelsWrap.appendChild(el);
    b._label = el;
    fillLabel(b);
  });

  if (document.fonts && document.fonts.ready){
    document.fonts.ready.then(function(){ bays.forEach(drawMonitor); });
  }

  /* progression route through the corridors */
  var routePts = [
    [0, 20.5], [0, 15],
    [-4.7, 12], [0, 11.4], [4.7, 12],
    [1.2, 8], [0, 3], [-3, 1.2], [-8, 1.4],
    [-12, 3.6], [-14.2, 0], [-12, -3.6],
    [-8, -1.4], [-3, -1.2], [-1.2, -5],
    [-4.7, -12], [0, -11.4], [4.7, -12],
    [1.4, -8], [3, -1.2], [8, -1.4],
    [12, -3.6], [14.2, 0], [12, 3.6]
  ].map(function(p){ return new THREE.Vector3(p[0], .06, p[1]); });
  routeCurve = new THREE.CatmullRomCurve3(routePts);
  scene.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(routeCurve.getPoints(220)),
    new THREE.LineBasicMaterial({ color:0x00ffa3, transparent:true, opacity:.32 })
  ));
  pulse = new THREE.Mesh(
    new THREE.SphereGeometry(.11, 12, 12),
    new THREE.MeshBasicMaterial({ color:0x00ffa3 })
  );
  pulseGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex('#00ffa3'), transparent:true, opacity:.6,
    blending:THREE.AdditiveBlending, depthWrite:false
  }));
  pulseGlow.scale.set(1.6, 1.6, 1);
  scene.add(pulse); scene.add(pulseGlow);

  /* current-bay markers */
  pawn = new THREE.Mesh(
    new THREE.OctahedronGeometry(.32),
    new THREE.MeshBasicMaterial({ color:0xffb000 })
  );
  scene.add(pawn);
  ping = new THREE.Mesh(
    new THREE.RingGeometry(.5, .58, 48),
    new THREE.MeshBasicMaterial({ color:0xffb000, transparent:true, opacity:.5, side:THREE.DoubleSide, depthWrite:false })
  );
  ping.rotation.x = -Math.PI / 2;
  scene.add(ping);
  curLight = new THREE.PointLight(0xffb000, .8, 12);
  scene.add(curLight);
  placeCurrentMarkers();

  /* dust */
  if (!RM){
    var N = 140, pos = new Float32Array(N * 3);
    for (var d = 0; d < N; d++){
      pos[d * 3] = (Math.random() - .5) * 46;
      pos[d * 3 + 1] = Math.random() * 7;
      pos[d * 3 + 2] = (Math.random() - .5) * 56;
    }
    var dg = new THREE.BufferGeometry();
    dg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    dust = new THREE.Points(dg, new THREE.PointsMaterial({
      color:0x8fa8ff, size:.06, transparent:true, opacity:.35, depthWrite:false
    }));
    scene.add(dust);
  }

  bindInput();
}

function fillLabel(b){
  var st = STYLE[b.state];
  var pct = b.total ? Math.round(b.done / b.total * 100) : 0;
  b._label.style.setProperty('--acc', st.color);
  b._label.innerHTML =
      '<div class="hm-lhead"><span class="hm-ldot"></span><span class="hm-lbay">' + b.bay + '</span><span class="hm-lcode">' + b.code + '</span></div>'
    + '<div class="hm-lbody">'
    + '<div class="hm-lname">' + b.name + '</div>'
    + '<div class="hm-lmeta"><span class="hm-lbar"><i style="width:' + pct + '%"></i></span><span class="hm-lcount">' + b.done + ' of ' + b.total + '</span></div>'
    + '</div>';
}

function placeCurrentMarkers(){
  var ci = -1;
  bays.forEach(function(b, i){ if (b.state === 'current') ci = i; });
  var visible = ci >= 0;
  pawn.visible = ping.visible = visible;
  curLight.intensity = visible ? .8 : 0;
  if (!visible) return;
  var c = bays[ci];
  pawn.position.set(c.x, 3.05, c.z);
  ping.position.set(c.x, .05, c.z);
  curLight.position.set(c.x, 3, c.z);
}

/* ─── refresh (data → visuals), runs on every show() ────────────────────── */
function refresh(){
  var fresh = buildData();
  fresh.forEach(function(nb, i){
    var b = bays[i];
    b.done = nb.done; b.total = nb.total; b.state = nb.state; b.stars = nb.stars;
    var st = STYLE[b.state];
    b._glassMat.color.setHex(st.hex);
    b._edges.material.color.setHex(st.hex);
    b._coreMat.color.setHex(st.hex);
    b._glowMat.map = glowTex(st.color);
    b._blobMat.map = glowTex(st.color);
    drawMonitor(b);
    fillLabel(b);
  });
  placeCurrentMarkers();

  var doneCount = 0;
  bays.forEach(function(b){ if (b.state === 'done') doneCount++; });
  hudProgress.innerHTML = '<b>' + doneCount + '</b> of <b>' + bays.length + '</b> rotations complete';
  hudFill.style.width = (bays.length ? doneCount / bays.length * 100 : 0) + '%';

  var save = (typeof loadSave === 'function' && loadSave()) || {};
  var inv = save.inv || { shield:0, skip:0, reveal:0, time:0 };
  var bar = document.getElementById('hospital-bar');
  bar.querySelector('.hm-pts').textContent = (save.bankedPts || 0).toLocaleString() + ' PTS';
  bar.querySelector('.hm-inv').textContent =
    'SHIELD ' + inv.shield + ' · SKIP ' + inv.skip + ' · REVEAL ' + inv.reveal + ' · TIME ' + inv.time;
}

/* ─── camera ────────────────────────────────────────────────────────────── */
function desired(){
  var narrow = camera.aspect < .85;
  if (mode === 'focus' && focusI != null){
    var c = bays[focusI];
    return {
      tx: c.x + c.fx * .8, ty: 1.15, tz: c.z + c.fz * .8,
      dist: (narrow ? 11.5 : 8.6) * user.dist,
      theta: c.ang + user.theta,
      phi: clamp(1.18 + user.phi, .5, 1.45)
    };
  }
  return {
    tx:0, ty:.5, tz:0,
    dist: (narrow ? 58 : 46) * user.dist,
    theta: user.theta + (RM ? 0 : Math.sin(now * .00016) * .05),
    phi: clamp(1.02 + user.phi, .5, 1.45)
  };
}

/* ─── selection ─────────────────────────────────────────────────────────── */
function refreshLabels(){
  bays.forEach(function(b, i){
    b._label.classList.toggle('open', i === hoverI || i === focusI);
    b._label.classList.toggle('dim', focusI != null && i !== focusI && i !== hoverI);
  });
}
function select(i){
  focusI = clamp(i, 0, bays.length - 1);
  mode = 'focus';
  user.theta = 0; user.phi = 0;
  var b = bays[focusI], st = STYLE[b.state];
  panelEl.style.setProperty('--acc', st.color);
  panelEl.querySelector('.hm-p-bay').textContent = b.bay + ' · ' + b.code;
  panelEl.querySelector('.hm-p-status').textContent = st.word;
  panelEl.querySelector('.hm-p-name').textContent = b.name;
  panelEl.querySelector('.hm-p-bar i').style.width = (b.total ? Math.round(b.done / b.total * 100) : 0) + '%';
  panelEl.querySelector('.hm-p-count').textContent = b.done + ' of ' + b.total + ' nodes';
  panelEl.querySelector('.hm-p-starrow').innerHTML = starsRow(b.stars);
  panelEl.querySelector('.hm-p-enter').textContent = b.state === 'done' ? 'Review rotation' : 'Enter rotation';
  panelEl.classList.add('on');
  container.classList.add('hm-focus');
  refreshLabels();
}
function overview(){
  mode = 'overview'; focusI = null;
  user.theta = 0; user.phi = 0;
  panelEl.classList.remove('on');
  container.classList.remove('hm-focus');
  refreshLabels();
}

/* ─── input ─────────────────────────────────────────────────────────────── */
function bindInput(){
  var ray = new THREE.Raycaster();
  var ndc = new THREE.Vector2(2, 2);
  var dragging = false, moved = false, px = 0, py = 0;
  var stage = container.querySelector('.hm-stage');

  function setNDC(e){
    var r = renderer.domElement.getBoundingClientRect();
    if (!r.width || !r.height) return;
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  }
  function setHover(i){
    if (hoverI === i) return;
    hoverI = i;
    stage.style.cursor = i == null ? '' : 'pointer';
    refreshLabels();
  }
  function pick(){
    ray.setFromCamera(ndc, camera);
    var hits = ray.intersectObjects(hitboxes);
    return hits.length ? hits[0].object.userData.i : null;
  }

  stage.addEventListener('pointerdown', function(e){
    dragging = true; moved = false; px = e.clientX; py = e.clientY;
    setNDC(e);
  });
  window.addEventListener('pointermove', function(e){
    if (!active) return;
    setNDC(e);
    if (dragging){
      var dx = e.clientX - px, dy = e.clientY - py;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      if (moved){
        user.theta -= dx * .005;
        user.phi = clamp(user.phi - dy * .003, -.5, .35);
        px = e.clientX; py = e.clientY;
        setHover(null);
      }
    } else if (e.target === renderer.domElement){
      setHover(pick());
    } else {
      setHover(null);
    }
  });
  window.addEventListener('pointerup', function(){
    if (!active){ dragging = false; return; }
    if (dragging && !moved){
      var i = pick();
      if (i != null) select(i);
      else if (mode === 'focus') overview();
    }
    dragging = false;
  });
  stage.addEventListener('wheel', function(e){
    e.preventDefault();
    user.dist = clamp(user.dist * (1 + e.deltaY * .001), .55, 1.8);
  }, { passive:false });

  document.addEventListener('keydown', function(e){
    if (!active) return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
      e.preventDefault();
      var step = e.key === 'ArrowRight' ? 1 : -1;
      if (focusI == null) select(0);
      else select((focusI + step + bays.length) % bays.length);
    } else if (e.key === 'Enter'){
      if (mode === 'focus') enterCourse(bays[focusI].id);
      else if (hoverI != null) select(hoverI);
    } else if (e.key === 'Escape'){
      overview();
    }
  });
}

/* ─── label projection ──────────────────────────────────────────────────── */
var _v3;
function updateLabels(){
  var W = container.clientWidth, H = container.clientHeight;
  if (!W || !H) return;
  _v3 = _v3 || new THREE.Vector3();
  bays.forEach(function(b){
    _v3.set(b.x, 3.4, b.z).project(camera);
    var behind = _v3.z > 1;
    b._label.classList.toggle('off', behind);
    if (behind) return;
    var sx = (_v3.x * .5 + .5) * W;
    var sy = (-_v3.y * .5 + .5) * H;
    var d = camera.position.distanceTo(b._grp.position);
    var s = clamp(13 / d, .6, 1.05);
    b._label.style.transform = 'translate(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px) translate(-50%,-100%) scale(' + s.toFixed(3) + ')';
    b._label.style.transformOrigin = '50% 100%';
  });
}

/* ─── sizing + loop ─────────────────────────────────────────────────────── */
function resize(){
  if (!renderer) return;
  var w = container.clientWidth, h = container.clientHeight;
  if (!w || !h) return;
  if (w === sizedW && h === sizedH) return;
  sizedW = w; sizedH = h;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function tick(t){
  raf = requestAnimationFrame(tick);
  if (!active || !container.clientWidth) return;
  resize();
  var dt = Math.min(.05, (t - last) / 1000);
  last = t; now = t;

  var des = desired();
  var k = RM ? 1 : Math.min(1, dt * 4);
  cam.tx += (des.tx - cam.tx) * k;
  cam.ty += (des.ty - cam.ty) * k;
  cam.tz += (des.tz - cam.tz) * k;
  cam.dist += (des.dist - cam.dist) * k;
  var dTh = des.theta - cam.theta;
  cam.theta += Math.atan2(Math.sin(dTh), Math.cos(dTh)) * k;   /* shortest arc */
  cam.phi += (des.phi - cam.phi) * k;
  camera.position.set(
    cam.tx + cam.dist * Math.sin(cam.phi) * Math.sin(cam.theta),
    cam.ty + cam.dist * Math.cos(cam.phi),
    cam.tz + cam.dist * Math.sin(cam.phi) * Math.cos(cam.theta)
  );
  camera.lookAt(cam.tx, cam.ty, cam.tz);

  if (!RM){
    pulseT = (pulseT + dt * .045) % 1;
    var pp = routeCurve.getPointAt(pulseT);
    pulse.position.copy(pp);
    pulseGlow.position.copy(pp);

    if (pawn.visible){
      pawn.position.y = 3.05 + Math.sin(t * .0022) * .14;
      pawn.rotation.y += dt * 1.1;
      var ph = (t * .0006) % 1;
      ping.scale.setScalar(1 + ph * 2.4);
      ping.material.opacity = .5 * (1 - ph);
    }

    if (dust){
      var dp = dust.geometry.attributes.position;
      for (var i2 = 1; i2 < dp.array.length; i2 += 3){
        dp.array[i2] += dt * .22;
        if (dp.array[i2] > 7) dp.array[i2] = 0;
      }
      dp.needsUpdate = true;
    }
  }

  bays.forEach(function(b, i){
    var st = STYLE[b.state];
    var hot = (i === hoverI || i === focusI);
    var eo = hot ? Math.min(1, st.edge * 1.9) : st.edge;
    b._edges.material.opacity += (eo - b._edges.material.opacity) * (RM ? 1 : dt * 8);
    var go = hot ? Math.min(1, st.glow * 1.9) : st.glow;
    b._glowMat.opacity += (go - b._glowMat.opacity) * (RM ? 1 : dt * 8);
    var ts = hot ? 1.035 : 1;
    var cs = b._grp.scale.x + (ts - b._grp.scale.x) * (RM ? 1 : dt * 8);
    b._grp.scale.setScalar(cs);
  });

  stepECG(dt);
  updateLabels();
  renderer.render(scene, camera);
}

/* ─── show / hide ───────────────────────────────────────────────────────── */
function show(){
  ensureDOM();
  if (!built){
    bays = buildData();
    if (bays.length !== LAYOUT.length) throw new Error('expected ' + LAYOUT.length + ' courses, got ' + bays.length);
    buildScene();
    built = true;
  }
  container.style.display = 'block';
  document.getElementById('hospital-bar').style.display = 'flex';
  active = true;
  overview();
  sizedW = sizedH = -1;
  last = performance.now();
  if (!raf) raf = requestAnimationFrame(tick);
  refresh();
}

function hide(){
  active = false;
  if (container){
    container.style.display = 'none';
    var bar = document.getElementById('hospital-bar');
    if (bar) bar.style.display = 'none';
  }
}

/* ─── wire into the app ─────────────────────────────────────────────────── */
function threeOK(){
  return typeof THREE !== 'undefined' && typeof COURSES !== 'undefined' && Array.isArray(COURSES);
}

var _classicSelector = window.showCourseSelector;
window.showCourseSelector = function(){
  _classicSelector.apply(this, arguments);
  var gridEl = grid();
  if (failed || !threeOK() || pref() === 'grid'){
    hide();
    if (gridEl && !failed && threeOK()) addGridToggle(gridEl);
    return;
  }
  try {
    show();
    if (gridEl) gridEl.style.display = 'none';
  } catch (err){
    console.error('[hospital-map] falling back to grid view:', err);
    failed = true;
    hide();
    if (gridEl) gridEl.style.display = 'grid';
  }
};

/* "3D MAP" button injected into the classic grid header so users can return */
function addGridToggle(gridEl){
  if (gridEl.querySelector('.hm-3d-toggle')) return;
  var hdr = gridEl.firstElementChild;
  if (!hdr) return;
  var btn = document.createElement('button');
  btn.className = 'hm-3d-toggle';
  btn.textContent = '3D MAP';
  btn.onclick = function(){
    setPref('3d');
    showCourseSelector();
  };
  hdr.appendChild(btn);
}

var _classicTopicMap = window.showTopicMap;
window.showTopicMap = function(){
  hide();
  _classicTopicMap.apply(this, arguments);
};

var _classicSplash = window.showSplash;
if (typeof _classicSplash === 'function'){
  window.showSplash = function(){
    hide();
    _classicSplash.apply(this, arguments);
  };
}
})();
