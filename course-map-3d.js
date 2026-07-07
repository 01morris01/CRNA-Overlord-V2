/**
 * COURSE MAP 3D — themed department environments for each course's topic map.
 *
 * Wraps window.renderTopicMap (defined in ui/topicMap.js). When WebGL is
 * available it renders the course's nodes as stations inside a subject-themed
 * 3D department of Voss General; on any failure (or a persisted 2D preference)
 * it delegates to the original 2D themed map, and legacy showTopicMap's own
 * try/catch remains the second net.
 *
 * Node interaction is identical to the 2D map: clicking a station focuses the
 * camera and opens the existing _showNodeDetail overlay, whose START SESSION
 * button calls startStudySessionForNode(courseId, topic.id).
 *
 * Load order: after three.js, ui/topicMap.js, and legacy/legacy.js.
 */
(function(){
'use strict';

var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var PREF_KEY = 'voss_topicmap_view'; // '3d' | '2d'

/* Theme identities carried over from the 2D maps (names + accents preserved). */
var THEMES = {
  'adv-phys-path-1':          { name:'PATHO VOLCANIC',    accent:'#ff3300', bg:0x160502, floor:'lava',      props:'volcanic',   particles:'embers',
                                model:'assets/models/patho-world.glb' },
  'adv-phys-path-2':          { name:'NEURAL ARCTIC',     accent:'#00ddff', bg:0x03121e, floor:'ice',       props:'crystals',   particles:'snow'    },
  'tech-advances-anesthesia': { name:'OR ALPHA STATION',  accent:'#00ffa3', bg:0x02130c, floor:'ortile',    props:'orlights',   particles:'dust'    },
  'basics-anesthesia':        { name:'TRAINING THEATRE',  accent:'#5b9eff', bg:0x040b20, floor:'blueprint', props:'holo',       particles:'dust'    },
  'chem-phys-anesthesia':     { name:'GAS LAW LAB',       accent:'#a78bfa', bg:0x0b0619, floor:'molecule',  props:'molecules',  particles:'bubbles' },
  'adv-health-assess':        { name:'CADAVER LAB',       accent:'#ffb000', bg:0x171002, floor:'theater',   props:'theater',    particles:'dust'    },
  'adv-pharmacology-1':       { name:'PHARM LAB',         accent:'#ff6b9d', bg:0x17030d, floor:'molecule',  props:'capsules',   particles:'bubbles' },
  'regional-anesthesia':      { name:'NERVE MAP',         accent:'#00e5ff', bg:0x021519, floor:'nerve',     props:'dendrites',  particles:'signals' }
};
var FALLBACK_THEME = THEMES['tech-advances-anesthesia'];

var TIER_STYLE = {
  new:       { color:'#5d7093', word:'NEW'       },
  started:   { color:null,      word:'STARTED'   },  /* accent at half strength */
  completed: { color:null,      word:'COMPLETED' },  /* accent */
  mastered:  { color:'#ffb000', word:'MASTERED'  }
};

var COLS = 6, DX = 6.2, DZ = 7.2;   /* COLS drops to 3 on narrow containers (set per build) */

/* ─── module state ──────────────────────────────────────────────────────── */
var failed = false, active = false;
var renderer, scene, camera, raf = 0;
var wm, labelsWrap, hudEl;
var nodes = [];            /* per-node scene refs + data */
var hitboxes = [];
var theme, courseIdNow, onSelectNow;
var pathCurve, pathLine, pulseMesh, pulseGlow, beacon, beaconRing, particles, particleCfg;
var MODEL_CACHE = {};   /* url -> parsed gltf.scene, shared across rebuilds */
var buildSeq = 0;       /* invalidates async model placement on course switch */
var mode = 'overview', focusI = null, hoverI = null;
var user = {theta:0, phi:0, dist:1};
var cam = {tx:0, ty:.5, tz:0, dist:34, theta:0, phi:1.05};
var fitDist = 34;
var now = 0, last = 0, pulseT = 0;
var sizedW = -1, sizedH = -1;
var glowCache = {};
var inputBound = false;

function pref(){ try { return localStorage.getItem(PREF_KEY) || '3d'; } catch(e){ return '3d'; } }
function setPref(v){ try { localStorage.setItem(PREF_KEY, v); } catch(e){ /* ignore */ } }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function hexToRgb(h){
  var n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function accInt(){ return parseInt(theme.accent.slice(1), 16); }
function tierColor(tier){
  if (tier === 'started') return shade(theme.accent, .55);
  if (tier === 'completed') return theme.accent;
  return TIER_STYLE[tier].color;
}
function shade(hex, f){
  var c = hexToRgb(hex);
  return 'rgb(' + Math.round(c[0]*f) + ',' + Math.round(c[1]*f) + ',' + Math.round(c[2]*f) + ')';
}
function glowTex(col){
  if (glowCache[col]) return glowCache[col];
  var cv = document.createElement('canvas'); cv.width = cv.height = 128;
  var g = cv.getContext('2d');
  var m = /^rgb\((\d+),(\d+),(\d+)\)$/.exec(col);
  var c = m ? [+m[1], +m[2], +m[3]] : hexToRgb(col);
  var gr = g.createRadialGradient(64, 64, 2, 64, 64, 64);
  gr.addColorStop(0,  'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',.9)');
  gr.addColorStop(.4, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',.28)');
  gr.addColorStop(1,  'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  glowCache[col] = new THREE.CanvasTexture(cv);
  return glowCache[col];
}

/* ─── themed floor textures (drawn to canvas) ───────────────────────────── */
function floorTexture(kind, accent){
  var cv = document.createElement('canvas'); cv.width = cv.height = 512;
  var g = cv.getContext('2d');
  var c = hexToRgb(accent);
  function acc(a){ return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  g.fillStyle = '#070b14'; g.fillRect(0, 0, 512, 512);
  var i, x, y;

  if (kind === 'lava'){
    g.fillStyle = '#120705'; g.fillRect(0, 0, 512, 512);
    for (i = 0; i < 26; i++){
      g.strokeStyle = acc(.06 + Math.random() * .13);
      g.lineWidth = 1 + Math.random() * 2.5;
      g.beginPath();
      x = Math.random() * 512; y = Math.random() * 512;
      g.moveTo(x, y);
      for (var s = 0; s < 5; s++){
        x += (Math.random() - .5) * 130; y += (Math.random() - .5) * 130;
        g.lineTo(x, y);
      }
      g.stroke();
    }
  } else if (kind === 'ice'){
    g.fillStyle = '#0a1420'; g.fillRect(0, 0, 512, 512);
    for (i = 0; i < 20; i++){
      g.strokeStyle = 'rgba(190,230,255,' + (.04 + Math.random() * .09) + ')';
      g.lineWidth = 1;
      g.beginPath();
      x = Math.random() * 512; y = Math.random() * 512;
      g.moveTo(x, y);
      g.lineTo(x + (Math.random() - .5) * 260, y + (Math.random() - .5) * 260);
      g.stroke();
    }
    for (i = 0; i <= 512; i += 64){
      g.strokeStyle = acc(.06); g.lineWidth = 1;
      g.strokeRect(i, 0, 64, 512);
    }
  } else if (kind === 'ortile'){
    for (i = 0; i <= 512; i += 64){
      g.strokeStyle = acc(.12); g.lineWidth = 1;
      g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 512); g.stroke();
      g.beginPath(); g.moveTo(0, i); g.lineTo(512, i); g.stroke();
    }
    g.strokeStyle = acc(.05);
    for (i = 32; i <= 512; i += 64){
      g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 512); g.stroke();
      g.beginPath(); g.moveTo(0, i); g.lineTo(512, i); g.stroke();
    }
  } else if (kind === 'blueprint'){
    g.fillStyle = '#050c1e'; g.fillRect(0, 0, 512, 512);
    for (i = 0; i <= 512; i += 32){
      g.strokeStyle = acc(i % 128 === 0 ? .16 : .06); g.lineWidth = 1;
      g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 512); g.stroke();
      g.beginPath(); g.moveTo(0, i); g.lineTo(512, i); g.stroke();
    }
  } else if (kind === 'molecule'){
    for (i = 0; i < 12; i++){
      x = Math.random() * 512; y = Math.random() * 512;
      var r = 18 + Math.random() * 30;
      g.strokeStyle = acc(.10); g.lineWidth = 1.5;
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + r + 26, y); g.stroke();
      g.beginPath(); g.arc(x + r + 32, y, 6, 0, Math.PI * 2); g.stroke();
    }
  } else if (kind === 'theater'){
    for (i = 1; i <= 7; i++){
      g.strokeStyle = acc(.05 + .02 * i); g.lineWidth = 2;
      g.beginPath(); g.arc(256, 256, i * 38, 0, Math.PI * 2); g.stroke();
    }
    g.strokeStyle = acc(.08);
    for (i = 0; i < 12; i++){
      var a = i * Math.PI / 6;
      g.beginPath(); g.moveTo(256, 256);
      g.lineTo(256 + Math.cos(a) * 266, 256 + Math.sin(a) * 266); g.stroke();
    }
  } else if (kind === 'nerve'){
    g.fillStyle = '#03141a'; g.fillRect(0, 0, 512, 512);
    for (i = 0; i < 9; i++){
      x = Math.random() * 512; y = 512;
      g.strokeStyle = acc(.09 + Math.random() * .12);
      g.lineWidth = 2.2;
      var bx = x, by = y;
      g.beginPath(); g.moveTo(bx, by);
      for (var b = 0; b < 6; b++){
        var nx = bx + (Math.random() - .5) * 120, ny = by - 60 - Math.random() * 50;
        g.quadraticCurveTo(bx + (Math.random() - .5) * 60, (by + ny) / 2, nx, ny);
        bx = nx; by = ny;
        if (Math.random() < .5){
          g.moveTo(bx, by);
          g.lineTo(bx + (Math.random() - .5) * 90, by - 30 - Math.random() * 40);
          g.moveTo(bx, by);
        }
      }
      g.stroke();
    }
  }
  var t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 4);
  return t;
}

/* ─── themed perimeter props ────────────────────────────────────────────── */
function perimeterSpots(count, halfX, halfZ){
  /* ring of positions just outside the node field */
  var out = [];
  for (var i = 0; i < count; i++){
    var a = i / count * Math.PI * 2 + .35;
    out.push({
      x: Math.cos(a) * (halfX + 6 + Math.random() * 5),
      z: Math.sin(a) * (halfZ + 6 + Math.random() * 5),
      a: a
    });
  }
  return out;
}

function buildProps(kind, halfX, halfZ){
  var hex = accInt();
  var spots = perimeterSpots(12, halfX, halfZ);
  var dark = new THREE.MeshLambertMaterial({ color: 0x0c1322 });
  var accMat = new THREE.MeshBasicMaterial({ color: hex, transparent:true, opacity:.5 });

  if (kind === 'volcanic'){
    spots.forEach(function(s){
      var h = 1.5 + Math.random() * 3.5;
      var rock = new THREE.Mesh(new THREE.ConeGeometry(.9 + Math.random() * 1.2, h, 5), new THREE.MeshLambertMaterial({ color: 0x1a0d08 }));
      rock.position.set(s.x, h / 2, s.z);
      rock.rotation.y = Math.random() * Math.PI;
      scene.add(rock);
      var tip = new THREE.Mesh(new THREE.SphereGeometry(.14, 8, 8), accMat);
      tip.position.set(s.x, h + .1, s.z);
      scene.add(tip);
    });
  } else if (kind === 'crystals'){
    spots.forEach(function(s){
      var h = 1.6 + Math.random() * 3.2;
      var cr = new THREE.Mesh(
        new THREE.ConeGeometry(.5 + Math.random() * .6, h, 6),
        new THREE.MeshPhongMaterial({ color: hex, transparent:true, opacity:.28, shininess:120 })
      );
      cr.position.set(s.x, h / 2, s.z);
      cr.rotation.set((Math.random() - .5) * .3, Math.random() * Math.PI, (Math.random() - .5) * .3);
      scene.add(cr);
    });
  } else if (kind === 'orlights'){
    [[-halfX * .6, -halfZ * .6], [halfX * .6, -halfZ * .6], [-halfX * .6, halfZ * .6], [halfX * .6, halfZ * .6]].forEach(function(p){
      var ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.6, .14, 10, 32),
        new THREE.MeshBasicMaterial({ color: hex, transparent:true, opacity:.55 })
      );
      ring.position.set(p[0], 6.5, p[1]);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      var stem = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 2.4), dark);
      stem.position.set(p[0], 7.7, p[1]);
      scene.add(stem);
    });
    spots.slice(0, 8).forEach(function(s){
      var cart = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, 1), dark);
      cart.position.set(s.x, .55, s.z);
      cart.rotation.y = s.a;
      scene.add(cart);
    });
  } else if (kind === 'holo'){
    spots.forEach(function(s){
      var sz = 1 + Math.random() * 1.8;
      var geo = new THREE.BoxGeometry(sz, sz, sz);
      var e = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: hex, transparent:true, opacity:.35 })
      );
      e.position.set(s.x, sz / 2 + .6 + Math.random(), s.z);
      e.rotation.y = Math.random() * Math.PI;
      scene.add(e);
    });
  } else if (kind === 'molecules' || kind === 'capsules'){
    spots.forEach(function(s, i){
      if (kind === 'capsules' && i % 2 === 0){
        var pillG = new THREE.Group();
        var body = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, 1.2, 14), new THREE.MeshPhongMaterial({ color: hex, transparent:true, opacity:.5 }));
        var capA = new THREE.Mesh(new THREE.SphereGeometry(.42, 14, 10), new THREE.MeshPhongMaterial({ color: 0xf2ead8, transparent:true, opacity:.5 }));
        var capB = capA.clone();
        capA.position.y = .6; capB.position.y = -.6;
        pillG.add(body); pillG.add(capA); pillG.add(capB);
        pillG.position.set(s.x, 1.6 + Math.random(), s.z);
        pillG.rotation.set(Math.random(), Math.random(), Math.random() * .8);
        scene.add(pillG);
      } else {
        var mol = new THREE.Group();
        var n = 3 + Math.floor(Math.random() * 3);
        var prev = null;
        for (var a2 = 0; a2 < n; a2++){
          var at = new THREE.Mesh(
            new THREE.SphereGeometry(.3 + Math.random() * .2, 12, 10),
            new THREE.MeshPhongMaterial({ color: a2 % 2 ? hex : 0xf2ead8, transparent:true, opacity:.45 })
          );
          at.position.set((Math.random() - .5) * 2, (Math.random() - .5) * 2, (Math.random() - .5) * 2);
          mol.add(at);
          if (prev){
            var d = new THREE.Vector3().subVectors(at.position, prev.position);
            var bond = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, d.length(), 6), accMat);
            bond.position.copy(prev.position).add(d.clone().multiplyScalar(.5));
            bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
            mol.add(bond);
          }
          prev = at;
        }
        mol.position.set(s.x, 2.2 + Math.random() * 1.5, s.z);
        scene.add(mol);
      }
    });
  } else if (kind === 'theater'){
    /* observation ring tiers around the field */
    for (var t2 = 0; t2 < 3; t2++){
      var rad = Math.max(halfX, halfZ) + 7 + t2 * 2.2;
      var tier = new THREE.Mesh(
        new THREE.CylinderGeometry(rad + 1, rad + 1, .8, 48, 1, true),
        new THREE.MeshLambertMaterial({ color: 0x120d04, side: THREE.DoubleSide })
      );
      tier.position.y = .4 + t2 * .9;
      scene.add(tier);
    }
    [[-halfX * .5, -halfZ * .5], [halfX * .5, halfZ * .5], [-halfX * .5, halfZ * .5], [halfX * .5, -halfZ * .5]].forEach(function(p){
      var beam = new THREE.Mesh(
        new THREE.ConeGeometry(1.6, 6.4, 20, 1, true),
        new THREE.MeshBasicMaterial({ color: hex, transparent:true, opacity:.07, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide })
      );
      beam.position.set(p[0], 3.2, p[1]);
      scene.add(beam);
    });
  } else if (kind === 'dendrites'){
    spots.forEach(function(s){
      var pts = [];
      var bx = s.x, by = 0, bz = s.z;
      for (var seg = 0; seg < 7; seg++){
        pts.push(new THREE.Vector3(bx, by, bz));
        bx += (Math.random() - .5) * 1.6;
        by += .8 + Math.random() * .8;
        bz += (Math.random() - .5) * 1.6;
        pts.push(new THREE.Vector3(bx, by, bz));
      }
      var line = new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: hex, transparent:true, opacity:.4 })
      );
      scene.add(line);
      var syn = new THREE.Mesh(new THREE.SphereGeometry(.12, 8, 8), accMat);
      syn.position.set(bx, by, bz);
      scene.add(syn);
    });
  }
}

/* ─── particles ─────────────────────────────────────────────────────────── */
var PARTICLE_CFG = {
  embers:  { n:120, vy: .9,  drift:.35, size:.09, span:1 },
  snow:    { n:160, vy:-.55, drift:.5,  size:.08, span:1 },
  dust:    { n:110, vy: .18, drift:.15, size:.06, span:1 },
  bubbles: { n:110, vy: .7,  drift:.45, size:.1,  span:1 },
  signals: { n:90,  vy: .5,  drift:.7,  size:.09, span:1 }
};
function buildParticles(kind, halfX, halfZ){
  if (RM) return;
  particleCfg = PARTICLE_CFG[kind] || PARTICLE_CFG.dust;
  var n = particleCfg.n;
  var pos = new Float32Array(n * 3);
  for (var i = 0; i < n; i++){
    pos[i * 3]     = (Math.random() - .5) * (halfX + 10) * 2;
    pos[i * 3 + 1] = Math.random() * 9;
    pos[i * 3 + 2] = (Math.random() - .5) * (halfZ + 10) * 2;
  }
  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  particles = new THREE.Points(geo, new THREE.PointsMaterial({
    color: accInt(), size: particleCfg.size, transparent:true, opacity:.4, depthWrite:false
  }));
  particles.userData = { halfX: halfX + 10, halfZ: halfZ + 10 };
  scene.add(particles);
}

/* ─── node stations ─────────────────────────────────────────────────────── */
function nodeShapeMesh(type, mat){
  if (type === 'synthesis') return new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, .5, 6), mat);
  if (type === 'mastery')   return new THREE.Mesh(new THREE.OctahedronGeometry(.66), mat);
  return new THREE.Mesh(new THREE.SphereGeometry(.5, 18, 14), mat);
}

function layoutPositions(count){
  var rows = Math.ceil(count / COLS);
  var out = [];
  for (var i = 0; i < count; i++){
    var row = Math.floor(i / COLS);
    var col = i % COLS;
    if (row % 2 === 1) col = COLS - 1 - col;   /* serpentine */
    var rowCount = Math.min(COLS, count - row * COLS);
    var offset = (Math.min(COLS, count) - 1) / 2;
    out.push({
      x: (col - offset) * DX,
      z: ((rows - 1) / 2 - row) * DZ   /* row 0 nearest the camera; later rows recede into fog */
    });
    void rowCount;
  }
  return { pts: out, rows: rows };
}

function buildStations(topics, stats){
  var lay = layoutPositions(topics.length);
  var nextIdx = -1;
  topics.forEach(function(t, i){
    var tier = _tierForStats(stats[t.id]);
    if (nextIdx === -1 && (tier === 'new' || tier === 'started')) nextIdx = i;
  });

  topics.forEach(function(t, i){
    var tier = _tierForStats(stats[t.id]);
    var col = tierColor(tier);
    var p = lay.pts[i];
    var n = {
      topic: t, tier: tier, i: i,
      x: p.x, y: 0, z: p.z,           /* y is re-snapped onto GLB terrain when present */
      isNext: i === nextIdx
    };

    var grp = new THREE.Group();
    grp.position.set(p.x, 0, p.z);

    var plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.25, .3, 20),
      new THREE.MeshLambertMaterial({ color: 0x0c1424 })
    );
    plinth.position.y = .15;
    grp.add(plinth);

    var dim = tier === 'new';
    var shapeMat = new THREE.MeshPhongMaterial({
      color: dim ? 0x25324a : new THREE.Color(col).getHex(),
      transparent: true, opacity: dim ? .5 : .88, shininess: 80
    });
    var shape = nodeShapeMesh(t.type, shapeMat);
    shape.position.y = 1.35;
    grp.add(shape);
    n._shape = shape;

    var ringGeo = new THREE.RingGeometry(.95, 1.08, 32);
    var ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
      color: dim ? 0x25324a : new THREE.Color(col).getHex(),
      transparent: true, opacity: dim ? .25 : .6, side: THREE.DoubleSide, depthWrite: false
    }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = .32;
    grp.add(ring);

    var glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex(dim ? '#25324a' : col), transparent: true,
      opacity: tier === 'mastered' ? .55 : tier === 'completed' ? .4 : tier === 'started' ? .3 : .12,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    glow.scale.set(3.4, 3.4, 1);
    glow.position.y = 1.35;
    grp.add(glow);
    n._glowMat = glow.material;
    n._glowBase = glow.material.opacity;

    if (tier === 'mastered'){
      var halo = new THREE.Mesh(
        new THREE.TorusGeometry(.85, .05, 8, 32),
        new THREE.MeshBasicMaterial({ color: 0xffb000, transparent:true, opacity:.8 })
      );
      halo.rotation.x = Math.PI / 2.4;
      halo.position.y = 1.35;
      grp.add(halo);
      n._halo = halo;
    }

    var hit = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 3.2, 2.6),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hit.position.y = 1.4;
    hit.userData.i = i;
    grp.add(hit);
    hitboxes.push(hit);

    scene.add(grp);
    n._grp = grp;

    var el = document.createElement('div');
    el.className = 'cm-lcard';
    el.style.setProperty('--acc', dim ? '#5d7093' : col);
    var typeWord = t.type === 'synthesis' ? 'SYNTHESIS' : t.type === 'mastery' ? 'MASTERY' : 'NODE ' + t.order;
    var s = stats[t.id] || {};
    el.innerHTML =
        '<div class="cm-lhead"><span class="cm-ldot"></span><span class="cm-lorder">' + (t.order || i + 1) + '</span></div>'
      + '<div class="cm-lbody">'
      + '<div class="cm-ltype">' + typeWord + ' · ' + TIER_STYLE[tier].word + '</div>'
      + '<div class="cm-lname">' + t.title + '</div>'
      + '<div class="cm-lmeta"><span class="cm-lbar"><i style="width:' + (s.bestPct || 0) + '%"></i></span><span class="cm-lpct">' + (s.bestPct || 0) + '%</span></div>'
      + '</div>';
    labelsWrap.appendChild(el);
    n._label = el;

    nodes.push(n);
  });

  /* path through the stations in study order */
  var pts = nodes.map(function(n){ return new THREE.Vector3(n.x, .1, n.z); });
  if (pts.length > 1){
    pathCurve = new THREE.CatmullRomCurve3(pts);
    pathLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pathCurve.getPoints(Math.max(60, pts.length * 14))),
      new THREE.LineBasicMaterial({ color: accInt(), transparent: true, opacity: .3 })
    );
    scene.add(pathLine);
    pulseMesh = new THREE.Mesh(
      new THREE.SphereGeometry(.12, 10, 10),
      new THREE.MeshBasicMaterial({ color: accInt() })
    );
    pulseGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex(theme.accent), transparent: true, opacity: .6,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    pulseGlow.scale.set(1.4, 1.4, 1);
    scene.add(pulseMesh); scene.add(pulseGlow);
  } else {
    pathCurve = null; pulseMesh = null; pulseGlow = null;
  }

  /* beacon on the next node to study */
  var nx = nodes.filter(function(n){ return n.isNext; })[0];
  if (nx){
    beacon = new THREE.PointLight(accInt(), .9, 10);
    beacon.position.set(nx.x, 3, nx.z);
    scene.add(beacon);
    beaconRing = new THREE.Mesh(
      new THREE.RingGeometry(.5, .6, 40),
      new THREE.MeshBasicMaterial({ color: accInt(), transparent: true, opacity: .5, side: THREE.DoubleSide, depthWrite: false })
    );
    beaconRing.rotation.x = -Math.PI / 2;
    beaconRing.position.set(nx.x, .06, nx.z);
    scene.add(beaconRing);
  } else {
    beacon = null; beaconRing = null;
  }

  return lay;
}

/* ─── scene assembly per course ─────────────────────────────────────────── */
function disposeScene(){
  if (!scene) return;
  scene.traverse(function(o){
    if (o.userData && o.userData.__keep) return;   /* cached GLB assets survive rebuilds */
    if (o.geometry) o.geometry.dispose();
    if (o.material){
      var mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach(function(m){
        if (m.map) m.map.dispose();
        m.dispose();
      });
    }
  });
  nodes = []; hitboxes = [];
  pathCurve = null; pathLine = null; pulseMesh = null; pulseGlow = null;
  beacon = null; beaconRing = null; particles = null;
  glowCache = {};
}

/* ─── themed GLB environment (Patho I: ashen web world) ─────────────────── */
function loadThemeModel(url, halfX, halfZ, seq){
  function place(src){
    if (seq !== buildSeq || !scene) return;   /* course switched while loading */
    var root = src.clone(true);               /* geometry + materials shared with cache */
    root.traverse(function(o){ o.userData.__keep = true; });

    /* footprint: cover the node field plus a margin all around */
    var box = new THREE.Box3().setFromObject(root);
    var size = new THREE.Vector3(); box.getSize(size);
    var center = new THREE.Vector3(); box.getCenter(center);
    var sXZ = Math.max((halfX + 9) * 2 / size.x, (halfZ + 9) * 2 / size.z);
    var sY = 6 / Math.max(.001, size.y);      /* flatten relief to ~6 world units */
    root.scale.set(sXZ, sY, sXZ);
    root.position.set(-center.x * sXZ, -box.min.y * sY - .6, -center.z * sXZ);
    scene.add(root);

    /* neutral key light so the PBR textures read (theme lights are tinted) */
    var key = new THREE.DirectionalLight(0xfff0dd, .85);
    key.position.set(10, 22, 12);
    scene.add(key);

    snapStations(root);
  }
  if (MODEL_CACHE[url]){ place(MODEL_CACHE[url]); return; }
  new THREE.GLTFLoader().load(url, function(gltf){
    MODEL_CACHE[url] = gltf.scene;
    place(gltf.scene);
  }, undefined, function(err){
    console.warn('[course-map-3d] environment model failed to load, keeping procedural floor:', err);
  });
}

/* drop each station onto the terrain surface and rebuild the path at height */
function snapStations(root){
  var ray = new THREE.Raycaster();
  var down = new THREE.Vector3(0, -1, 0);
  var origin = new THREE.Vector3();
  nodes.forEach(function(n){
    origin.set(n.x, 80, n.z);
    ray.set(origin, down);
    var hits = ray.intersectObject(root, true);
    n.y = hits.length ? hits[0].point.y : 0;
    n._grp.position.y = n.y;
  });
  if (nodes.length > 1){
    var pts = nodes.map(function(n){ return new THREE.Vector3(n.x, n.y + .25, n.z); });
    pathCurve = new THREE.CatmullRomCurve3(pts);
    if (pathLine){
      pathLine.geometry.dispose();
      pathLine.geometry = new THREE.BufferGeometry().setFromPoints(pathCurve.getPoints(Math.max(60, pts.length * 14)));
    }
  }
  var nx = nodes.filter(function(n){ return n.isNext; })[0];
  if (nx){
    if (beacon) beacon.position.set(nx.x, nx.y + 3, nx.z);
    if (beaconRing) beaconRing.position.set(nx.x, nx.y + .06, nx.z);
  }
}

function buildScene(courseId, course){
  disposeScene();
  /* narrow container: 3 columns so the field reads as a corridor receding
     down the screen instead of overflowing the sides */
  var cw = (wm && wm.clientWidth) || window.innerWidth || 0;
  var ch = (wm && wm.clientHeight) || window.innerHeight || 0;
  COLS = (cw > 0 && ch > 0 && cw / ch < .9) ? 3 : 6;
  scene = new THREE.Scene();

  scene.add(new THREE.HemisphereLight(0x36486e, 0x05070c, .95));
  var dir = new THREE.DirectionalLight(accInt(), .35);
  dir.position.set(-8, 16, 10);
  scene.add(dir);

  var stats = (typeof _getTopicStats === 'function' ? _getTopicStats() : {});
  var lay = buildStations(course.topics || [], stats);
  var rows = lay.rows;
  var halfX = (Math.min(COLS, (course.topics || []).length) - 1) / 2 * DX + 3;
  var halfZ = Math.max(1, (rows - 1) / 2 * DZ + 3);

  var hasModel = !!(theme.model && typeof THREE.GLTFLoader === 'function');
  if (!hasModel){
    /* procedural floor */
    var floor = new THREE.Mesh(
      new THREE.PlaneGeometry(220, 220),
      new THREE.MeshBasicMaterial({ map: floorTexture(theme.floor, theme.accent) })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -.01;
    scene.add(floor);

    /* department slab under the node field */
    var slab = new THREE.Mesh(
      new THREE.PlaneGeometry(halfX * 2 + 5, halfZ * 2 + 5),
      new THREE.MeshBasicMaterial({ color: 0x070d18, transparent: true, opacity: .88 })
    );
    slab.rotation.x = -Math.PI / 2;
    slab.position.y = .015;
    scene.add(slab);

    buildProps(theme.props, halfX, halfZ);
  }
  buildParticles(theme.particles, halfX, halfZ);
  if (hasModel){
    buildSeq++;
    loadThemeModel(theme.model, halfX, halfZ, buildSeq);
  }

  fitDist = clamp(Math.max(halfX * 1.25, halfZ * 2.6) + 9, 24, 58);
  /* fog tracks the framing distance so pulled-back cameras never lose the far rows */
  scene.fog = new THREE.Fog(theme.bg, fitDist * .85, fitDist * 2.4);
  cam = {tx:0, ty:.5, tz:0, dist: fitDist * 1.15, theta:0, phi:1.05};
}

/* ─── DOM shell ─────────────────────────────────────────────────────────── */
function injectCSS(){
  if (document.getElementById('course-map-3d-css')) return;
  var css = [
    '#world-map.cm-3d{padding:0!important;overflow:hidden!important;position:relative!important;min-height:min(64vh,520px);}',
    '#world-map.cm-3d .cm-stage{position:absolute;inset:0;touch-action:none;}',
    '#world-map.cm-3d .cm-stage canvas{display:block;width:100%;height:100%;}',
    '#world-map.cm-3d .cm-labels{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:3;}',
    '.cm-lcard{position:absolute;left:0;top:0;will-change:transform;background:rgba(7,13,26,.82);border:1px solid rgba(143,168,255,.16);border-radius:9px;padding:2px 6px;max-width:220px;box-shadow:0 8px 24px rgba(0,0,0,.4);transition:opacity .25s,border-color .25s;}',
    '.cm-lcard.open{padding:5px 9px;}',
    '.cm-lcard.off{opacity:0;}.cm-lcard.dim{opacity:.3;}',
    '.cm-lhead{display:flex;align-items:center;gap:6px;white-space:nowrap;}',
    '.cm-ldot{width:7px;height:7px;border-radius:50%;background:var(--acc,#5d7093);box-shadow:0 0 8px var(--acc,#5d7093);}',
    '.cm-lorder{font-family:var(--fm,monospace);font-weight:700;font-size:.5rem;color:#f2ead8;letter-spacing:.08em;}',
    '.cm-lbody{max-height:0;max-width:0;opacity:0;overflow:hidden;transition:max-height .3s,max-width .3s,opacity .25s;}',
    '.cm-lcard.open{border-color:var(--acc,rgba(143,168,255,.34));}',
    '.cm-lcard.open .cm-lbody{max-height:120px;max-width:220px;opacity:1;}',
    '.cm-lname{width:200px;}',
    '.cm-ltype{font-family:var(--fm,monospace);font-size:.38rem;letter-spacing:.14em;color:#5d7093;margin-top:5px;}',
    '.cm-lname{font-size:.5rem;color:#dbe4f5;margin-top:4px;line-height:1.35;font-weight:500;}',
    '.cm-lmeta{display:flex;align-items:center;gap:6px;margin-top:5px;}',
    '.cm-lbar{flex:1;height:3px;background:rgba(143,168,255,.14);border-radius:2px;overflow:hidden;}',
    '.cm-lbar i{display:block;height:100%;background:var(--acc,#5d7093);}',
    '.cm-lpct{font-family:var(--fm,monospace);font-size:.4rem;color:#93a5c4;}',
    '.cm-hud{position:absolute;z-index:4;pointer-events:none;font-family:var(--fm,monospace);}',
    '.cm-title{top:10px;left:14px;}',
    '.cm-title-name{font-family:var(--fd,sans-serif);font-weight:700;font-size:.92rem;letter-spacing:.16em;color:var(--cm-acc,#8fa8ff);line-height:1;}',
    '.cm-title-sub{font-size:.42rem;letter-spacing:.2em;color:#93a5c4;margin-top:5px;max-width:340px;line-height:1.5;}',
    '.cm-stats{top:10px;right:14px;text-align:right;}',
    '.cm-stats-main{font-size:.52rem;color:#f2ead8;}',
    '.cm-stats-pts{font-size:.44rem;color:#ffb000;margin-top:4px;letter-spacing:.1em;}',
    '.cm-legend{left:14px;bottom:12px;display:flex;gap:11px;padding:6px 10px;background:rgba(7,13,26,.72);border:1px solid rgba(143,168,255,.16);border-radius:8px;}',
    '.cm-lg-row{display:flex;align-items:center;gap:5px;font-size:.4rem;color:#93a5c4;}',
    '.cm-lg-chip{width:7px;height:7px;border-radius:50%;background:var(--c);box-shadow:0 0 6px var(--c);}',
    '.cm-hint{right:14px;bottom:12px;font-size:.38rem;letter-spacing:.06em;color:#5d7093;max-width:230px;line-height:1.7;text-align:right;}',
    '.cm-2d-btn{position:absolute;top:10px;right:14px;margin-top:44px;z-index:5;pointer-events:auto;background:none;border:1px solid rgba(143,168,255,.2);color:#8fa8ff;font-family:var(--fm,monospace);font-size:.42rem;padding:.22rem .6rem;cursor:pointer;border-radius:3px;letter-spacing:.1em;}',
    '.cm-3d-btn{background:none;border:1px solid var(--line,#1a2940);color:#8fa8ff;font-family:var(--fm,monospace);font-size:.5rem;padding:.25rem .7rem;cursor:pointer;border-radius:3px;letter-spacing:.1em;margin-left:.5rem;}',
    '@media (max-width:700px){.cm-hint{display:none;}.cm-title-sub{max-width:200px;}.cm-lcard{max-width:160px;}}',
    '@media (prefers-reduced-motion: reduce){.cm-lcard,.cm-lbar i{transition-duration:.01ms!important;}}'
  ].join('\n');
  var el = document.createElement('style');
  el.id = 'course-map-3d-css';
  el.textContent = css;
  document.head.appendChild(el);
}

function buildDOM(course){
  wm.classList.add('cm-3d');
  wm.innerHTML = '';
  wm.style.cssText = 'width:100%;position:relative;overflow:hidden;border-radius:8px;border:1px solid var(--line,#1a2940);background:#04070d;min-height:min(64vh,520px);flex:1;';

  var stage = document.createElement('div');
  stage.className = 'cm-stage';
  wm.appendChild(stage);
  stage.appendChild(renderer.domElement);

  labelsWrap = document.createElement('div');
  labelsWrap.className = 'cm-labels';
  wm.appendChild(labelsWrap);

  var stats = (typeof _getTopicStats === 'function' ? _getTopicStats() : {});
  var doneCount = 0;
  (course.topics || []).forEach(function(t){
    var tier = _tierForStats(stats[t.id]);
    if (tier === 'completed' || tier === 'mastered') doneCount++;
  });
  var save = (typeof loadSave === 'function' && loadSave()) || {};

  hudEl = document.createElement('div');
  hudEl.innerHTML =
      '<div class="cm-hud cm-title" style="--cm-acc:' + theme.accent + '">'
    +   '<div class="cm-title-name">' + theme.name + '</div>'
    +   '<div class="cm-title-sub">' + course.title.toUpperCase() + ' · ' + (course.topics || []).length + ' NODES</div>'
    + '</div>'
    + '<div class="cm-hud cm-stats">'
    +   '<div class="cm-stats-main"><b>' + doneCount + '</b> of <b>' + (course.topics || []).length + '</b> nodes complete</div>'
    +   '<div class="cm-stats-pts">' + (save.bankedPts || 0).toLocaleString() + ' PTS</div>'
    + '</div>'
    + '<div class="cm-hud cm-legend">'
    +   '<div class="cm-lg-row"><span class="cm-lg-chip" style="--c:#ffb000"></span>Mastered</div>'
    +   '<div class="cm-lg-row"><span class="cm-lg-chip" style="--c:' + theme.accent + '"></span>Completed</div>'
    +   '<div class="cm-lg-row"><span class="cm-lg-chip" style="--c:' + shade(theme.accent, .55) + '"></span>Started</div>'
    +   '<div class="cm-lg-row"><span class="cm-lg-chip" style="--c:#5d7093"></span>New</div>'
    + '</div>'
    + '<div class="cm-hud cm-hint">Drag to orbit. Scroll to zoom. Arrows move between nodes. Enter opens. Esc for overview.</div>';
  wm.appendChild(hudEl);

  var btn2d = document.createElement('button');
  btn2d.className = 'cm-2d-btn';
  btn2d.textContent = '2D MAP';
  btn2d.onclick = function(){
    setPref('2d');
    if (typeof showTopicMap === 'function') showTopicMap();
  };
  wm.appendChild(btn2d);
}

/* ─── camera ────────────────────────────────────────────────────────────── */
function desired(){
  var narrow = camera.aspect < .85;
  if (mode === 'focus' && focusI != null){
    var n = nodes[focusI];
    return {
      tx: n.x, ty: n.y + 1.1, tz: n.z,
      dist: (narrow ? 12 : 9) * user.dist,
      theta: user.theta,
      phi: clamp(1.12 + user.phi, .5, 1.4)
    };
  }
  return {
    tx: 0, ty: .5, tz: 0,
    dist: fitDist * (narrow ? 1.2 : 1) * user.dist,
    theta: user.theta + (RM ? 0 : Math.sin(now * .00014) * .04),
    phi: clamp(1.05 + user.phi, .5, 1.4)
  };
}

/* ─── selection ─────────────────────────────────────────────────────────── */
function refreshLabels(){
  nodes.forEach(function(n, i){
    n._label.classList.toggle('open', i === hoverI || i === focusI);
    n._label.classList.toggle('dim', focusI != null && i !== focusI && i !== hoverI);
  });
}
function openDetail(i){
  var n = nodes[i];
  var stats = (typeof _getTopicStats === 'function' ? _getTopicStats() : {});
  var tid = n.topic.id;
  /* Launch through the legacyShim bridge: selectTopic stores the
     TOPIC_TO_NODE mapping (legacy topic id -> NODE_CONFIG node id) and
     startStudySession consumes it. Calling startStudySessionForNode with the
     raw legacy topic id would fail for courses whose ids differ (adv1-t*,
     ba-t*, cp-t*, ha-t*). Unmapped topics fall through to the legacy engine,
     same as clicking a marker on the classic map. */
  if (typeof _showNodeDetail === 'function'){
    _showNodeDetail(n.topic, stats[tid], function(){
      if (typeof window.selectTopic === 'function' && typeof window.startStudySession === 'function'){
        window.selectTopic(tid);
        window.startStudySession();
      } else if (onSelectNow){
        onSelectNow(tid);
      }
    });
  } else if (onSelectNow){
    onSelectNow(tid);
  }
}
function select(i, withDetail){
  if (!nodes.length) return;
  focusI = clamp(i, 0, nodes.length - 1);
  mode = 'focus';
  user.theta = 0; user.phi = 0;
  refreshLabels();
  if (withDetail) openDetail(focusI);
}
function overview(){
  mode = 'overview'; focusI = null;
  user.theta = 0; user.phi = 0;
  refreshLabels();
}

/* ─── input (bound once; raycasts against the CURRENT hitboxes) ─────────── */
function bindInput(){
  if (inputBound) return;
  inputBound = true;
  var ray = new THREE.Raycaster();
  var ndc = new THREE.Vector2(2, 2);
  var dragging = false, moved = false, px = 0, py = 0;

  function detailOpen(){ return !!document.getElementById('node-detail-overlay'); }
  function setNDC(e){
    var r = renderer.domElement.getBoundingClientRect();
    if (!r.width || !r.height) return;
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  }
  function setHover(i){
    if (hoverI === i) return;
    hoverI = i;
    renderer.domElement.style.cursor = i == null ? '' : 'pointer';
    refreshLabels();
  }
  function pick(){
    ray.setFromCamera(ndc, camera);
    var hits = ray.intersectObjects(hitboxes);
    return hits.length ? hits[0].object.userData.i : null;
  }

  renderer.domElement.addEventListener('pointerdown', function(e){
    if (!active || detailOpen()) return;
    dragging = true; moved = false; px = e.clientX; py = e.clientY;
    setNDC(e);
  });
  window.addEventListener('pointermove', function(e){
    if (!active || detailOpen()) return;
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
    if (detailOpen()){ dragging = false; return; }
    if (dragging && !moved){
      var i = pick();
      if (i != null) select(i, true);
      else if (mode === 'focus') overview();
    }
    dragging = false;
  });
  renderer.domElement.addEventListener('wheel', function(e){
    e.preventDefault();
    user.dist = clamp(user.dist * (1 + e.deltaY * .001), .5, 1.9);
  }, { passive:false });

  document.addEventListener('keydown', function(e){
    /* visibility gate: after a session starts the map is hidden but still
       "active" — without this, Enter mid-quiz would reopen the node detail */
    if (!active || detailOpen() || !renderer.domElement.offsetParent) return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
      e.preventDefault();
      var step = e.key === 'ArrowRight' ? 1 : -1;
      if (focusI == null) select(0, false);
      else select((focusI + step + nodes.length) % nodes.length, false);
    } else if (e.key === 'Enter'){
      if (focusI != null) openDetail(focusI);
      else if (hoverI != null) select(hoverI, true);
    } else if (e.key === 'Escape'){
      overview();
    }
  });
}

/* ─── labels ────────────────────────────────────────────────────────────── */
var _v3;
function updateLabels(){
  var W = wm.clientWidth, H = wm.clientHeight;
  if (!W || !H) return;
  _v3 = _v3 || new THREE.Vector3();
  nodes.forEach(function(n){
    _v3.set(n.x, n.y + 2.15, n.z).project(camera);
    var behind = _v3.z > 1;
    n._label.classList.toggle('off', behind);
    if (behind) return;
    var sx = (_v3.x * .5 + .5) * W;
    var sy = (-_v3.y * .5 + .5) * H;
    var d = camera.position.distanceTo(n._grp.position);
    var s = clamp(11 / d, .45, .95);
    n._label.style.transform = 'translate(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px) translate(-50%,-100%) scale(' + s.toFixed(3) + ')';
    n._label.style.transformOrigin = '50% 100%';
  });
}

/* ─── sizing + loop ─────────────────────────────────────────────────────── */
function resize(){
  if (!renderer || !wm) return;
  var w = wm.clientWidth, h = wm.clientHeight;
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
  if (!active || !wm || !wm.clientWidth || !renderer.domElement.offsetParent) return;
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
  cam.theta += Math.atan2(Math.sin(dTh), Math.cos(dTh)) * k;
  cam.phi += (des.phi - cam.phi) * k;
  camera.position.set(
    cam.tx + cam.dist * Math.sin(cam.phi) * Math.sin(cam.theta),
    cam.ty + cam.dist * Math.cos(cam.phi),
    cam.tz + cam.dist * Math.sin(cam.phi) * Math.cos(cam.theta)
  );
  camera.lookAt(cam.tx, cam.ty, cam.tz);

  if (!RM){
    if (pathCurve && pulseMesh){
      pulseT = (pulseT + dt * .05) % 1;
      var pp = pathCurve.getPointAt(pulseT);
      pulseMesh.position.copy(pp);
      pulseGlow.position.copy(pp);
    }
    if (beaconRing){
      var ph = (t * .0006) % 1;
      beaconRing.scale.setScalar(1 + ph * 2.2);
      beaconRing.material.opacity = .5 * (1 - ph);
    }
    if (particles && particleCfg){
      var dp = particles.geometry.attributes.position;
      var hx = particles.userData.halfX, hz = particles.userData.halfZ;
      for (var i = 0; i < dp.array.length; i += 3){
        dp.array[i]     += Math.sin(t * .0005 + i) * particleCfg.drift * dt;
        dp.array[i + 1] += particleCfg.vy * dt;
        dp.array[i + 2] += Math.cos(t * .0004 + i) * particleCfg.drift * dt;
        if (particleCfg.vy > 0 && dp.array[i + 1] > 9) dp.array[i + 1] = 0;
        if (particleCfg.vy < 0 && dp.array[i + 1] < 0) dp.array[i + 1] = 9;
        if (dp.array[i] > hx) dp.array[i] = -hx;
        if (dp.array[i] < -hx) dp.array[i] = hx;
        if (dp.array[i + 2] > hz) dp.array[i + 2] = -hz;
        if (dp.array[i + 2] < -hz) dp.array[i + 2] = hz;
      }
      dp.needsUpdate = true;
    }
    nodes.forEach(function(n, i){
      n._shape.rotation.y += dt * (n.topic.type === 'mastery' ? 1.2 : .4);
      n._shape.position.y = 1.35 + Math.sin(t * .0016 + i) * .08;
      if (n._halo) n._halo.rotation.z += dt * .8;
      var hot = (i === hoverI || i === focusI);
      var target = hot ? Math.min(1, n._glowBase * 2.2 + .15) : n._glowBase;
      n._glowMat.opacity += (target - n._glowMat.opacity) * dt * 8;
      var ts = hot ? 1.12 : 1;
      var cs = n._grp.scale.x + (ts - n._grp.scale.x) * dt * 8;
      n._grp.scale.setScalar(cs);
    });
  }

  updateLabels();
  renderer.render(scene, camera);
}

/* ─── entry point ───────────────────────────────────────────────────────── */
function render3D(courseId, course, onSelectTopic){
  injectCSS();
  wm = document.getElementById('world-map');
  if (!wm) throw new Error('world-map container not found');

  if (!renderer){
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    if (!renderer.getContext()) throw new Error('no WebGL context');
    renderer.outputEncoding = THREE.sRGBEncoding;
  }

  courseIdNow = courseId;
  onSelectNow = onSelectTopic;
  theme = THEMES[courseId] || FALLBACK_THEME;
  buildDOM(course);           /* creates the stage and labelsWrap first */
  buildScene(courseId, course);
  renderer.setClearColor(theme.bg, 1);
  bindInput();

  camera = camera || new THREE.PerspectiveCamera(46, 1, .1, 260);
  camera.fov = 46; camera.updateProjectionMatrix();

  mode = 'overview'; focusI = null; hoverI = null;
  user = {theta:0, phi:0, dist:1};
  sizedW = sizedH = -1;
  active = true;
  last = performance.now();
  if (!raf) raf = requestAnimationFrame(tick);
}

function deactivate(){
  active = false;
  if (wm) wm.classList.remove('cm-3d');
}

/* ─── wiring ────────────────────────────────────────────────────────────── */
function threeOK(){ return typeof THREE !== 'undefined'; }

var _classic2D = window.renderTopicMap;
window.renderTopicMap = function(courseId, course, onSelectTopic){
  if (failed || !threeOK() || pref() === '2d'){
    deactivate();
    var r = _classic2D.apply(this, arguments);
    add3DToggle();
    return r;
  }
  try {
    render3D(courseId, course, onSelectTopic);
  } catch (err){
    console.error('[course-map-3d] falling back to 2D map:', err);
    failed = true;
    deactivate();
    var r2 = _classic2D.apply(this, arguments);
    return r2;
  }
};

/* "3D MAP" button appended to the 2D map's bottom bar so users can return */
function add3DToggle(){
  if (failed || !threeOK()) return;
  var wmEl = document.getElementById('world-map');
  if (!wmEl || wmEl.querySelector('.cm-3d-btn')) return;
  var bar = wmEl.lastElementChild;
  if (!bar) return;
  var btn = document.createElement('button');
  btn.className = 'cm-3d-btn';
  btn.textContent = '3D MAP';
  btn.onclick = function(){
    setPref('3d');
    if (typeof showTopicMap === 'function') showTopicMap();
  };
  bar.appendChild(btn);
}

/* stop rendering when the user leaves the topic map */
var _classicSelector2 = window.showCourseSelector;
window.showCourseSelector = function(){
  deactivate();
  return _classicSelector2.apply(this, arguments);
};
})();
