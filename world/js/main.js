// main.js: the order of things. Sign in -> make a character -> the island -> Anatomy Hall -> back, with everything saved.
import * as THREE from 'three';
import { getSession, loginUser, registerUser, logout } from '../../core/auth.js';
import { load, save, summary, dueNow } from './save.js';
import { buildAvatar, OPTIONS, DEFAULT } from './avatar.js';

const Q = new URLSearchParams(location.search), $ = (id) => document.getElementById(id);
const touch = matchMedia('(hover: none) and (pointer: coarse)').matches;
let state = null, world = null, hall = null, charScene = null;
const veil = (on, text = 'Loading') => { $('veilText').textContent = text; $('veil').classList.toggle('off', !on); };
function screen(name) { for (const s of ['gate', 'character', 'world', 'hall']) $(s).hidden = s !== name; document.body.dataset.screen = name; }

// ---------- sign in (the app's own accounts, untouched) ----------
async function auth(fn) { const r = await fn($('gUser').value, $('gPass').value); if (!r.success) { $('gErr').textContent = r.error; return; } $('gErr').textContent = ''; afterAuth(); }
$('gateForm').addEventListener('submit', (e) => { e.preventDefault(); auth(loginUser); }); $('gReg').addEventListener('click', () => auth(registerUser));
function afterAuth() { state = load(); state.visits++; save(state); if (!state.character || Q.has('character')) showCharacter(); else Q.get('go') === 'hall' ? enterHall() : enterWorld(); }

// ---------- character ----------
function showCharacter() {
  screen('character'); veil(false);
  const c = { ...DEFAULT, ...(state.character || {}), name: state.character?.name || getSession().displayName };
  if (!charScene) {
    const host = $('charStage'), r = new THREE.WebGLRenderer({ antialias: true, alpha: true }); r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.toneMapping = THREE.ACESFilmicToneMapping; r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; host.appendChild(r.domElement);
    const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50); cam.position.set(0, 1.5, 6.4); cam.lookAt(0, 1.02, 0);
    const sun = new THREE.DirectionalLight(0xfff0d4, 3); sun.position.set(-3, 6, 4); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -2, right: 2, top: 3, bottom: -1 }); sc.add(sun, new THREE.HemisphereLight(0xcfe9ff, 0xc7ab82, 1.1));
    const base = new THREE.Group(); for (const [y, col, s] of [[-0.25, '#84c95c', 2.2], [-0.75, '#8d6b49', 2.2]]) { const m = new THREE.Mesh(new THREE.BoxGeometry(s, 0.5, s), new THREE.MeshStandardMaterial({ color: col, roughness: 0.95 })); m.position.y = y; m.receiveShadow = true; base.add(m); } sc.add(base);
    const size = () => { const w = host.clientWidth || 1, h = host.clientHeight || 1; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }; new ResizeObserver(size).observe(host); size();
    let av = null, spin = 0.5, dragX = null, t = 0; r.domElement.addEventListener('pointerdown', (e) => { dragX = e.clientX; }); addEventListener('pointermove', (e) => { if (dragX !== null) { spin += (e.clientX - dragX) * 0.012; dragX = e.clientX; } }); addEventListener('pointerup', () => { dragX = null; });
    const clock = new THREE.Clock(); (function loop() { requestAnimationFrame(loop); if ($('character').hidden) return; const dt = clock.getDelta(); t += dt; if (av) { av.rotation.y = spin + Math.sin(t * 0.4) * 0.25; av.userData.update(dt, 0); } base.rotation.y = spin * 0.2; r.render(sc, cam); })();
    charScene = { set(cfg, rewards) { if (av) sc.remove(av); av = buildAvatar(cfg, rewards); sc.add(av); } };
  }
  const sw = (key, label, items, text) => `<div class="opt-row"><span>${label}</span><div class="sw ${text ? 'txt' : ''}">${items.map((it, i) => text ? `<button data-k="${key}" data-v="${it[0]}" class="${c[key] === it[0] ? 'on' : ''}">${it[1]}</button>` : `<button data-k="${key}" data-v="${i}" class="${c[key] === i ? 'on' : ''}" style="background:${it}" aria-label="${label} ${i + 1}"></button>`).join('')}</div></div>`;
  function draw() {
    $('charForm').innerHTML = `<input id="cName" maxlength="18" value="${c.name.replace(/"/g, '')}" aria-label="Name">` + sw('skin', 'Skin', OPTIONS.skin) + sw('hair', 'Hair', OPTIONS.hair, true) + sw('hairColor', 'Hair colour', OPTIONS.hairColor) + sw('scrubs', 'Scrubs', OPTIONS.scrubs)
      + `<div class="opt-row"><span>Wearing</span><div class="sw txt">${[['cap', 'Scrub cap'], ['glasses', 'Glasses'], ['steth', 'Stethoscope']].map(([k, n]) => `<button data-t="${k}" class="${c[k] ? 'on' : ''}">${n}</button>`).join('')}</div></div>`
      + (state.game.rewards.length ? `<div class="opt-row"><span>Earned</span><div class="sw txt"><button class="on" disabled>Nerve stimulator</button></div></div>` : `<div class="opt-row"><span>Earned</span><p class="fine" style="margin:0">Nothing yet. The first item is in Anatomy Hall.</p></div>`);
    $('charForm').querySelectorAll('[data-k]').forEach((b) => b.onclick = () => { c[b.dataset.k] = b.dataset.k === 'hair' ? b.dataset.v : +b.dataset.v; draw(); });
    $('charForm').querySelectorAll('[data-t]').forEach((b) => b.onclick = () => { c[b.dataset.t] = !c[b.dataset.t]; draw(); });
    $('cName').oninput = (e) => { c.name = e.target.value; }; charScene.set(c, state.game.rewards);
  }
  draw();
  $('charGo').onclick = () => { c.name = (c.name || '').trim() || getSession().displayName; state.character = c; save(state); enterWorld(true); };
}

// ---------- the island ----------
async function enterWorld(fresh = false, back = null) {
  screen('world');
  if (!world) { veil(true, 'Building the island'); const { createWorld } = await import('./game.js'); world = await createWorld({ host: $('worldStage'), state, touch, els: { head: $('wHead'), prompt: $('wPrompt'), toast: $('wToast'), dock: $('wDock'), build: $('wBuild'), stick: $('stick'), jump: $('padJump'), act: $('padAct') }, onEnterHall: enterHall, onLink: (url) => { world.pause(); location.href = url; } }); }
  world.resume(); veil(false); window.__ov = { state, world, hall, save };
  const name = state.character.name, due = dueNow(state).length, s = summary(state);
  if (back) world.toast(back.items.length ? `<b>Earned.</b> ${back.items.join('. ')}. Plus ${back.blocks} blocks.` : `Plus ${back.blocks} blocks for your plot.`, 8);
  else if (fresh || state.visits <= 1) world.toast(`Welcome, ${name}. Walk north to the plaza. Booth is by the notice board.`, 7);
  else world.toast(`Welcome back, ${name}. ${due ? `<b>${due} due</b> in Anatomy Hall.` : s.attempts ? 'Nothing due today.' : 'Anatomy Hall is north, under the hill.'}`, 7);
}

// ---------- Anatomy Hall ----------
async function enterHall() {
  world && world.pause(); screen('hall');
  if (!hall) { veil(true, 'Opening Anatomy Hall'); const [{ createAtlas }, { mountLearn }] = await Promise.all([import('./atlas.js'), import('./learn.js')]); const atlas = await createAtlas($('hallStage'), { touch }); let earned = null;
    const learn = mountLearn({ atlas, state, els: { panel: $('hPanel'), bar: $('hBar'), tip: $('hTip'), labels: $('hLabels'), head: $('hHead') }, onReward: (e) => { earned = e; }, onExit: () => { atlas.stop(); const e = earned; earned = null; enterWorld(false, e); } }); hall = { atlas, learn }; }
  else hall.learn.go('menu');
  hall.atlas.start(); veil(false); window.__ov = { state, world, hall, save };
}

// ---------- the mark is the menu ----------
$('mark').addEventListener('click', () => {
  if (!getSession()) return; let m = $('menu'); if (m) return m.remove();
  m = document.createElement('div'); m.id = 'menu'; m.className = 'card menu'; const sm = summary(state);
  m.innerHTML = `<small>${state.character?.name || getSession().displayName}</small><p class="fine" style="margin-bottom:10px">${sm.attempts ? `Identified ${sm.identified ?? '–'}% · applied ${sm.applied ?? '–'}% · ${sm.due} due` : 'No answers recorded yet.'}</p><button class="row" data-m="character">Change character</button><button class="row" data-m="classic">Classic Overlord</button><button class="row" data-m="signout">Sign out</button>`;
  document.body.appendChild(m);
  m.querySelectorAll('[data-m]').forEach((b) => b.onclick = () => { m.remove(); const k = b.dataset.m; if (k === 'character') { world && world.pause(); hall && hall.atlas.stop(); showCharacter(); } else if (k === 'classic') { world && world.keep(); location.href = '../index.html'; } else { world && world.keep(); logout(); location.reload(); } });
});

if (getSession()) afterAuth(); else { screen('gate'); veil(false); }
