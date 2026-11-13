// main.js: the order of things. Sign in -> choose a character -> the institute -> a station (the gallery's exhibits, the
// studio, the rooms) -> back, with everything saved under the signed-in account. The mark, top right, is the menu and the
// direct route to study without walking.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { getSession, loginUser, registerUser, logout } from '../../core/auth.js';
import { load, save, summary, dueNow } from './save.js';
import { loadPerson, PEOPLE, COLOURS, DEFAULT_LOOK, peopleMeta } from './person.js';
import { markSVG, wordmarkSVG } from './brand.js';
import { isMuted, setMuted, sfx, onCaption } from './audio.js';
import { loadVoice } from './voice.js';

const Q = new URLSearchParams(location.search), $ = (id) => document.getElementById(id);
const touch = matchMedia('(hover: none) and (pointer: coarse)').matches, calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches || (state && state.game.prefs && state.game.prefs.motion === false);
let state = null, world = null, hall = null, scan = null, charScene = null, places = null, exhibits = null, periop = null, hands = null;
$('mark').innerHTML = markSVG() + `<span class="wmk">${wordmarkSVG({ weight: 3.4 })}</span>`; $('gateMark').innerHTML = wordmarkSVG(); $('veilMark').innerHTML = wordmarkSVG();
const veil = (on, text = 'Loading', k = null) => { $('veilText').textContent = text; $('veil').classList.toggle('off', !on); if (k !== null) $('veilBar').firstElementChild.style.width = Math.round(k * 100) + '%'; };
function screen(name) { for (const s of ['gate', 'character', 'world', 'hall', 'scan']) $(s).hidden = s !== name; document.body.dataset.screen = name; }
/** The section wipe: a hairline crosses the screen, and what is behind it has changed. */
function wipe(change) { const w = $('wipe'); if (calm()) { change(); return Promise.resolve(); }
  return new Promise((done) => { w.className = 'in'; setTimeout(async () => { await change(); w.className = 'out'; setTimeout(() => { w.className = ''; done(); }, 360); }, 350); }); }
const persist = () => { world && world.keep(); save(state); };
addEventListener('pagehide', () => state && persist());

// ---------- sign in (the app's own accounts, untouched) ----------
async function auth(fn) { const r = await fn($('gUser').value, $('gPass').value); if (!r.success) { $('gErr').textContent = r.error; return; } $('gErr').textContent = ''; afterAuth(); }
$('gateForm').addEventListener('submit', (e) => { e.preventDefault(); auth(loginUser); }); $('gReg').addEventListener('click', () => auth(registerUser));
function afterAuth() {
  state = load(); state.visits++; save(state); onCaption((t) => { if (!state.game.prefs || state.game.prefs.captions !== false) { const c = $('wCaption'); c.textContent = t; c.classList.add('on'); clearTimeout(afterAuth.t); afterAuth.t = setTimeout(() => c.classList.remove('on'), 5200); } });
  if (!state.character || !state.character.person || Q.has('character')) showCharacter(); else enterWorld();
}

// ---------- character ----------
async function showCharacter(back = null) {
  screen('character'); veil(false); const meta = await peopleMeta();
  const c = { ...DEFAULT_LOOK, ...(state.character || {}), name: state.character?.name || getSession().displayName };
  if (!charScene) {
    const host = $('charStage'), r = new THREE.WebGLRenderer({ antialias: true, alpha: true }); r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.toneMapping = THREE.AgXToneMapping; r.toneMappingExposure = 1.15; r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; host.appendChild(r.domElement);
    const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(28, 1, 0.1, 50); sc.environment = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(), 0.03).texture; sc.environmentIntensity = 0.55;
    const key = new THREE.DirectionalLight(0xfff1df, 2.6); key.position.set(-2.2, 4.2, 3.4); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; Object.assign(key.shadow.camera, { left: -1.5, right: 1.5, top: 2.4, bottom: -0.4, near: 0.5, far: 12 }); const fill = new THREE.DirectionalLight(0xbfd6ff, 0.9); fill.position.set(3, 2, -2); sc.add(key, fill);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.06, 96), new THREE.MeshStandardMaterial({ color: 0xdedad2, roughness: 0.55 })); disc.position.y = -0.03; disc.receiveShadow = true; const rim = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.006, 8, 120), new THREE.MeshStandardMaterial({ color: 0xcf9f58, metalness: 1, roughness: 0.35 })); rim.rotation.x = Math.PI / 2; sc.add(disc, rim);
    const size = () => { const w = host.clientWidth || 1, h = host.clientHeight || 1; r.setSize(w, h, false); cam.aspect = w / h; const d = w / h < 0.9 ? 7.4 : 5.6; cam.position.set(0, 1.25, d); cam.lookAt(0, 0.98, 0); cam.updateProjectionMatrix(); }; new ResizeObserver(size).observe(host); size();
    let p = null, spin = 0.35, dragX = null, token = 0; r.domElement.addEventListener('pointerdown', (e) => { dragX = e.clientX; }); addEventListener('pointermove', (e) => { if (dragX !== null) { spin += (e.clientX - dragX) * 0.011; dragX = e.clientX; } }); addEventListener('pointerup', () => { dragX = null; });
    const clock = new THREE.Clock(); (function loop() { requestAnimationFrame(loop); if ($('character').hidden) return; const dt = Math.min(clock.getDelta(), 0.05); if (p) { p.root.rotation.y = spin; p.update(dt, 0); } r.render(sc, cam); })();
    charScene = { async set(look) { const mine = ++token; if (p && p.id === look.person) { p.setColour(look.colour); return; } const n = await loadPerson(look.person, { colour: look.colour }); if (mine !== token) { n.dispose(); return; } if (p) { sc.remove(p.root); p.dispose(); } p = n; sc.add(p.root); } };
  }
  function draw() {
    const canTint = !!PEOPLE[c.person].tint, series = state.game.collection.filter((x) => x.id === 'regional-patch').length;
    $('charForm').innerHTML = `<input id="cName" maxlength="18" value="${(c.name || '').replace(/"/g, '')}" aria-label="Name">`
      + `<div class="opt-row"><span>Person</span><div class="people">${Object.keys(PEOPLE).map((k) => `<button data-person="${k}" class="${c.person === k ? 'on' : ''}" title="${PEOPLE[k].label}"><img alt="${PEOPLE[k].label}" src="../assets/characters/${meta[k].portrait}"></button>`).join('')}</div><p class="fine" style="margin:6px 0 0">${PEOPLE[c.person].label}.</p></div>`
      + (canTint ? `<div class="opt-row"><span>Color</span><div class="sw">${COLOURS.map((k) => `<button data-colour="${k.id}" class="${c.colour === k.id ? 'on' : ''}" title="${k.label}" aria-label="${k.label}" style="background:${k.rgb ? `rgb(${k.rgb.map((v) => Math.round(Math.pow(v, 1 / 2.2) * 255)).join(',')})` : 'conic-gradient(#e9e6e0, #9fd0b5, #e9e6e0)'}"></button>`).join('')}</div></div>` : `<div class="opt-row"><span>Color</span><p class="fine" style="margin:0">This one is worn as made.</p></div>`)
      + `<div class="opt-row"><span>Sleeve patch</span><p class="fine" style="margin:0">${series ? 'Regional series patch: earned. It is on your studio wall and your record.' : 'Plain. The first series you complete adds its mark.'}</p></div>`;
    $('charForm').querySelectorAll('[data-person]').forEach((b) => b.onclick = () => { c.person = b.dataset.person; if (!PEOPLE[c.person].tint) c.colour = 'asmade'; sfx('tap'); draw(); });
    $('charForm').querySelectorAll('[data-colour]').forEach((b) => b.onclick = () => { c.colour = b.dataset.colour; sfx('tap'); draw(); });
    $('cName').oninput = (e) => { c.name = e.target.value; }; charScene.set(c);
  }
  draw(); $('charGo').textContent = back ? 'Keep this' : 'Walk in'; $('charFine').textContent = 'You can change this at the mirror in your studio, or from the menu.';
  $('charGo').onclick = async () => { c.name = (c.name || '').trim() || getSession().displayName; state.character = { name: c.name, person: c.person, colour: c.colour }; save(state); if (world) await world.setPerson(state.character); await wipe(() => enterWorld({ fresh: !back })); };
}

// ---------- the institute ----------
const failed = (what) => (e) => { console.error(e); $('veilText').textContent = `${what} could not be loaded. Check the connection, then reload the page.`; $('veil').classList.remove('off'); $('veilBar').firstElementChild.style.width = '0%'; throw e; };
async function enterWorld(o) { return openWorld(o).catch(failed('The building')); }
async function openWorld({ fresh = false, from = null } = {}) {
  screen('world');
  if (!world) {
    veil(true, 'Loading the building', 0.03); const { createWorld } = await import('./institute.js'); await loadVoice();
    if (Q.get('q')) (state.game.prefs ||= {}).quality = Q.get('q');
    world = await createWorld({ host: $('worldStage'), state, touch, els: { prompt: $('wPrompt'), toast: $('wToast'), stick: $('stick'), act: $('padAct'), diag: $('wDiag') }, onStation: (key) => places.open(key), onProgress: (t, k) => veil(true, t, k) });
    await world.start(); veil(true, 'Setting out the exhibits', 0.9); const [{ mountPlaces }, { mountExhibits }] = await Promise.all([import('./places.js'), import('./exhibits.js')]);
    exhibits = await mountExhibits({ world, state }); world.onFrame = (dt) => exhibits.update(dt);
    const { mountHands } = await import('./hands.js'); hands = mountHands({ world, sound: { sfx }, layer: $('wHands') }); world.onPick = (e) => hands.pick(e); world.onGrab = (e) => hands.grab(e); world.grabbing = () => hands.busy;      // what you can pick up, turn, press and hold
    places = mountPlaces({ world, exhibits, state, persist, els: { place: $('wPlace'), goal: $('wGoal') }, enterHall, enterScan, showCharacter: () => { world.pause(); showCharacter(true); }, wipe });
    try { const { mountPeriop } = await import('./periop.js'); periop = await mountPeriop({ world, state, persist, clinical: () => exhibits.clinical, ui: places, wipe, hands, els: { hud: $('caseHud'), desk: $('desk'), deskTitle: $('deskTitle'), deskState: $('deskState'), deskGo: $('deskGo'), deskBack: $('deskBack'), frame: $('deskFrame') } });
      places.extend(periop); world.onFrame = (dt) => { exhibits.update(dt); periop.update(dt); hands.enable(!places.isOpen()); hands.update(dt); };
      for (const [file, fn] of [['./bedside.js', 'mountBedside']]) { try { const mod = await import(file); periop.kit(await mod[fn]({ world, hands, periop })); } catch (e) { console.warn('kit', file, e); } } } catch (e) { console.warn('pre-op holding and the operating room could not be set up', e); }
    if (Q.get('shot')) { world.resume(); world.bookmark(Q.get('shot')); }
  }
  world.resume(); veil(false); window.__ov = { state, world, hall, scan, places, exhibits, periop, hands, save, summary };
  if (!Q.get('shot')) { places.arrive({ fresh, from }); if (Q.get('go')) places.direct(Q.get('go'), Q.get('mode')); }
}

// ---------- the anatomy gallery's plexus exhibit ----------
async function enterHall(mode, where) { return openHall(mode, where).catch(failed('The exhibit')); }
async function openHall(mode, where = 'gallery') {
  world && world.pause(); screen('hall');
  if (!hall) { veil(true, 'Opening the exhibit', 0.5); const [{ createAtlas }, { mountLearn }] = await Promise.all([import('./atlas.js'), import('./learn.js')]); const atlas = await createAtlas($('hallStage'), { touch }); let earned = null;
    const learn = mountLearn({ atlas, state, els: { panel: $('hPanel'), bar: $('hBar'), tip: $('hTip'), labels: $('hLabels'), head: $('hHead') }, onReward: (e) => { earned = e; }, onExit: () => { atlas.stop(); const e = earned; earned = null; wipe(() => enterWorld({ from: { hall: true, earned: e } })); } }); hall = { atlas, learn }; }
  hall.learn.where = where; hall.learn.go(mode && mode !== 'menu' ? mode : 'menu');
  hall.atlas.start(); veil(false); window.__ov = { state, world, hall, scan, places, exhibits, periop, hands, save, summary };
}
// ---------- the airway and neck exhibit (scan and structure) ----------
async function enterScan(mode) { return openScan(mode).catch(failed('The exhibit')); }
async function openScan(mode) {
  world && world.pause(); screen('scan');
  if (!scan) { veil(true, 'Opening the exhibit', 0.5); const { mountScan } = await import('./scan.js'); scan = await mountScan({ state, touch, persist, els: { stage: $('scanStage'), head: $('sHead'), panel: $('sPanel'), bar: $('sBar'), slices: $('sSlices'), labels: $('sLabels'), tip: $('sTip') }, onExit: (earned) => { scan.stop(); wipe(() => enterWorld({ from: { scan: true, earned } })); } }); }
  scan.go(mode || 'menu'); scan.start(); veil(false); window.__ov = { state, world, hall, scan, places, exhibits, periop, hands, save, summary };
}

// ---------- the mark is the menu: direct study without walking, settings, identity ----------
$('mark').addEventListener('click', () => {
  if (!getSession() || !state) return; let m = $('menu'); if (m) return m.remove();
  m = document.createElement('div'); m.id = 'menu'; m.className = 'card menu'; const sm = summary(state);
  m.innerHTML = `<small>${state.character?.name || getSession().displayName}</small><p class="fine" style="margin-bottom:10px">${sm.attempts ? `Unaided: identified ${sm.identified ?? '–'}% · applied ${sm.applied ?? '–'}% · ${sm.due} due` : 'No answers recorded yet.'}</p>
    <button class="row" data-m="study">Study directly</button><button class="row" data-m="record">Your record</button><button class="row" data-m="settings">Settings</button><button class="row" data-m="character">Change character</button><button class="row" data-m="mute">Sound ${isMuted() ? 'off' : 'on'}</button><button class="row" data-m="classic">Classic Overlord</button><button class="row" data-m="signout">Sign out</button>`;
  document.body.appendChild(m);
  m.querySelectorAll('[data-m]').forEach((b) => b.onclick = async () => { m.remove(); const k = b.dataset.m;
    if (k === 'mute') return setMuted(!isMuted());
    if (k === 'study' || k === 'record' || k === 'settings') { if (document.body.dataset.screen !== 'world') { hall && hall.atlas.stop(); scan && scan.stop(); await enterWorld(); } return places.sheet(k); }
    if (k === 'character') { world && world.pause(); hall && hall.atlas.stop(); scan && scan.stop(); showCharacter(true); } else if (k === 'classic') { persist(); location.href = '../index.html'; } else { persist(); logout(); location.reload(); } });
});

if (getSession()) afterAuth(); else { screen('gate'); veil(false); }
