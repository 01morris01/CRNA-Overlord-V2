/** Hands: the things in a room that you pick up, put somewhere, turn, press or hold.
 *
 *  A thing registers once with add(). Kinds:
 *    take   you pick it up; it rides in your hand until you put it on a place that takes it, or back where it lives
 *    place  somewhere a held thing can go (a finger, a hook, a port). It shows only while you hold something it takes
 *    press  one click does it (a switch, a button, a drawer, a patient's eyelid)
 *    turn   drag sideways, roll the wheel, or use the minus and plus in the tip (a knob, a dial)
 *    hold   press and keep pressing (a plunger, a bag); the thing is told how long you have held and when you let go
 *
 *  Nothing here knows any medicine. Each thing's own functions say what happens and what gets recorded; this file only
 *  finds what you are pointing at, says in words what a click would do, and carries what you hold. Walking is never taken
 *  away: you can hold a thing and walk, and X (or the button under its name) puts it back where it lives.
 */
import * as THREE from 'three';

const V = () => new THREE.Vector3(), esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const KIND_WORD = { take: 'Pick up', place: 'Put it here', press: 'Use', turn: 'Turn', hold: 'Press and hold' };

export function mountHands({ world, sound = null, layer }) {
  const { camera, scene } = world, things = new Map(), listeners = [], ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), tmp = V(), tmp2 = V(), box = new THREE.Box3();
  if (!camera.parent) scene.add(camera);                      // what you hold is a child of your eyes
  const hand = new THREE.Group(); hand.name = 'hand'; hand.position.set(0.19, -0.17, -0.44); camera.add(hand);
  const tip = document.createElement('div'); tip.className = 'htip'; tip.hidden = true; const chip = document.createElement('div'); chip.className = 'hheld'; chip.hidden = true; const marks = document.createElement('div'); marks.className = 'hmarks'; layer.append(marks, tip, chip);
  const sfx = (n) => { try { sound && sound.sfx && sound.sfx(n); } catch { /* sound is optional */ } };
  let held = null, hover = null, picked = null, grab = null, pointer = { x: innerWidth / 2, y: innerHeight / 2, seen: false }, on = true, tweens = [], lastTip = '';
  const emit = (type, thing, more = {}) => { const ev = { type, id: thing.id, group: thing.group, t: performance.now(), ...more }; api.last = ev; for (const f of listeners) { try { f(ev); } catch (e) { console.warn('hands listener', e); } } };

  // ------------------------------------------------------------------ registering
  /** Add a thing. Returns it. `obj` is what you see (and, unless `hit` is given, what the pointer must be over); a small or thin
   *  thing should give `pad` (metres) so that it can be caught without a surgeon's aim. */
  function add(t) {
    if (things.has(t.id)) remove(t.id);
    const th = { kind: 'press', group: 'room', reach: 1.5, pad: 0, when: () => true, ...t };
    if (th.obj && !th.home && th.kind === 'take') th.home = { parent: th.obj.parent, pos: th.obj.position.clone(), quat: th.obj.quaternion.clone(), scale: th.obj.scale.clone() };
    things.set(th.id, th); return th;
  }
  function remove(id) { const th = things.get(id); if (!th) return; if (held && held.id === id) letGo(false); if (hover === th) hover = null; if (picked === th) picked = null; things.delete(id); }
  function clear(group) { for (const th of [...things.values()]) if (th.group === group) remove(th.id); }
  const label = (th, withHeld = null) => (typeof th.label === 'function' ? th.label(withHeld) : th.label) || th.id;
  /** Where a thing is, in the room. */
  function centre(th, out = V()) { if (th.at) { const p = th.at(); return p ? out.copy(p) : null; } if (!th.obj) return null; th.obj.updateWorldMatrix(true, true); box.setFromObject(th.obj); return box.isEmpty() ? th.obj.getWorldPosition(out) : box.getCenter(out); }
  const size = (th) => { if (!th.obj || th.at) return th.pad || 0.03; box.setFromObject(th.obj); return box.isEmpty() ? 0.03 : box.getSize(tmp2).length() / 2; };
  const usable = (th) => { if (!on) return false; if (th.kind === 'place') return !!held && !!th.takes && th.takes(held) && th.when(held); if (held && th !== held) return th.kind !== 'take' && th.when(held) && (th.whileHolding !== false); return th !== held && th.when(null); };

  // ------------------------------------------------------------------ what the pointer is on
  const eyeToScreen = (p) => { tmp.copy(p).project(camera); return { x: (tmp.x + 1) / 2 * innerWidth, y: (1 - tmp.y) / 2 * innerHeight, front: tmp.z < 1 && tmp.z > -1 }; };
  function find() {
    if (!on || !world.enabled) return null;
    const px = world.locked ? innerWidth / 2 : pointer.x, py = world.locked ? innerHeight / 2 : pointer.y; if (!world.locked && !pointer.seen) return null;
    ndc.set(px / innerWidth * 2 - 1, -(py / innerHeight) * 2 + 1); camera.updateMatrixWorld(); ray.setFromCamera(ndc, camera);
    let best = null, bestD = 1e9;
    for (const th of things.values()) { if (!usable(th)) continue; const c = centre(th, tmp2); if (!c) continue; const d = c.distanceTo(camera.position); if (d > th.reach + 1.2) continue;
      // 1. the pointer is over the thing itself
      let hitD = null; if (th.obj && !th.at && th.obj.visible !== false) { const targets = th.hit ? [].concat(th.hit) : [th.obj]; const h = ray.intersectObjects(targets, true)[0]; if (h) hitD = h.distance; }
      // 2. or close enough to it on the screen (a finger-width for small things)
      if (hitD == null) { const s = eyeToScreen(c); if (!s.front) continue; const rpx = Math.max(th.kind === 'place' ? 26 : 16, (th.pad || 0) / Math.max(d, 0.2) * innerHeight * 0.9); if (Math.hypot(s.x - px, s.y - py) > rpx) continue; hitD = d + 0.02; }
      if (hitD < bestD) { bestD = hitD; best = th; best._d = d; } }
    if (best) best._far = best._d > best.reach; return best;
  }

  // ------------------------------------------------------------------ taking, placing, putting back
  const HOLD = { pos: [0, 0, 0], rot: [0.2, -0.5, 0.1], scale: 1 };
  function tween(obj, to, seconds, done) { const from = { pos: obj.position.clone(), quat: obj.quaternion.clone(), scale: obj.scale.clone() }; tweens.push({ obj, from, to, t: 0, dur: Math.max(0.001, world.prefs.motion ? seconds : 0.001), done }); }
  function take(th) { if (held) return false; if (th.onTake && th.onTake() === false) return false; held = th; const o = th.obj; if (o) { const h = { ...HOLD, ...(th.hand || {}) }; hand.attach(o); tween(o, { pos: new THREE.Vector3(...h.pos), quat: new THREE.Quaternion().setFromEuler(new THREE.Euler(...h.rot)), scale: new THREE.Vector3(1, 1, 1).multiplyScalar(h.scale).multiply(th.home.scale) }, 0.2); } sfx('tap'); emit('take', th); return true; }
  /** Put what you hold back where it lives (or leave it in place when `home` is false: a module has already moved it). */
  function letGo(home = true) { if (!held) return; const th = held; held = null; const o = th.obj; if (o && home && th.home && th.home.parent) { th.home.parent.attach(o); tween(o, { pos: th.home.pos, quat: th.home.quat, scale: th.home.scale }, 0.22); } if (home) { th.onBack && th.onBack(); emit('back', th); } }
  function place(pl) { const th = held; if (!th) return false; const r = pl.put(th); if (r === false) return false; if (held === th) held = null; sfx('ok'); emit('place', th, { place: pl.id }); return true; }
  /** Move a thing's object to a parent and pose with the same easing the hand uses (for modules placing things). */
  function settle(obj, parent, { pos = [0, 0, 0], rot = [0, 0, 0], quat = null, scale = null } = {}, seconds = 0.22, done = null) { parent.attach(obj); tween(obj, { pos: new THREE.Vector3(...pos), quat: quat || new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)), scale: scale ? new THREE.Vector3(...[].concat(scale, scale, scale).slice(0, 3)) : obj.scale.clone() }, seconds, done); }

  // ------------------------------------------------------------------ doing
  function act(th, e = null) {
    if (!th || !usable(th)) return false;
    if (th._far) { say(`${label(th, held)}: step closer.`); return true; }
    const no = th.why && th.why(held); if (no) { say(no); sfx('no'); emit('refused', th, { why: no }); return true; }
    if (th.kind === 'take') return take(th);
    if (th.kind === 'place') return place(th);
    if (th.kind === 'press') { const r = th.use && th.use(held); sfx(r === false ? 'no' : 'tap'); emit('press', th); return true; }
    if (th.kind === 'turn') { picked = th; return true; }                                 // a click chooses the knob; the wheel, a drag or the tip's buttons turn it
    return true;
  }
  function turn(th, steps) { if (!th || th.kind !== 'turn' || !usable(th) || th._far) return; const no = th.why && th.why(held); if (no) { say(no); return; } th.set(steps); sfx('tick'); emit('turn', th, { steps }); }
  const say = (text) => { api.said = text; world.toast && world.toast(esc(text), 3.2); };

  // pointer: a press on a knob or a plunger belongs to the hands, not to looking round
  function onGrab(e) {
    if (!on || !world.enabled) return false; pointer.x = e.clientX; pointer.y = e.clientY; pointer.seen = true; const th = find(); if (!th || th._far) return false;
    if (e.button === 2) return false;
    if (th.kind === 'hold') { const no = th.why && th.why(held); if (no) { say(no); sfx('no'); return true; } grab = { th, t: 0, id: e.pointerId, moved: 0 }; th.start && th.start(held); emit('hold', th, { phase: 'start' }); return true; }
    if (th.kind === 'turn') { picked = th; grab = { th, t: 0, id: e.pointerId, moved: 0, x: e.clientX, acc: 0, turn: true }; return true; }
    return false;
  }
  function endGrab() { if (!grab) return; const g = grab; grab = null; if (!g.turn) { g.th.end && g.th.end(g.t); emit('hold', g.th, { phase: 'end', seconds: g.t }); } }
  addEventListener('pointerup', endGrab); addEventListener('pointercancel', endGrab); addEventListener('blur', endGrab);
  addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.seen = true;
    if (grab && grab.turn) { const dx = world.locked ? e.movementX : e.clientX - grab.x; grab.x = e.clientX; grab.acc += dx; grab.moved += Math.abs(dx); const per = grab.th.px || 14; while (Math.abs(grab.acc) >= per) { const s = Math.sign(grab.acc); grab.acc -= s * per; turn(grab.th, s); } } });
  world.renderer.domElement.addEventListener('wheel', (e) => { const th = picked && usable(picked) ? picked : (hover && hover.kind === 'turn' ? hover : null); if (!th || !on || !world.enabled) return; e.preventDefault(); e.stopImmediatePropagation(); turn(th, e.deltaY < 0 ? 1 : -1); }, { passive: false, capture: true });
  addEventListener('keydown', (e) => { if (!on || !world.enabled || e.metaKey || e.ctrlKey || e.altKey || (e.target.closest && e.target.closest('input, textarea, select'))) return; const k = e.key.toLowerCase();
    if (k === 'x' && held) { letGo(true); e.preventDefault(); } else if (k === 'f' && hover) { act(hover); e.preventDefault(); } else if ((k === '[' || k === '-') && picked) turn(picked, -1); else if ((k === ']' || k === '=' || k === '+') && picked) turn(picked, 1); });
  chip.addEventListener('click', (e) => { if (e.target.closest('[data-back]')) letGo(true); });
  tip.addEventListener('click', (e) => { const b = e.target.closest('[data-turn]'); if (b && picked) turn(picked, +b.dataset.turn); });

  // ------------------------------------------------------------------ each frame
  function update(dt) {
    for (let i = tweens.length - 1; i >= 0; i--) { const w = tweens[i]; w.t = Math.min(1, w.t + dt / w.dur); const k = w.t * w.t * (3 - 2 * w.t); w.obj.position.lerpVectors(w.from.pos, w.to.pos, k); w.obj.quaternion.slerpQuaternions(w.from.quat, w.to.quat, k); w.obj.scale.lerpVectors(w.from.scale, w.to.scale, k); if (w.t >= 1) { tweens.splice(i, 1); w.done && w.done(); } }
    if (grab && !grab.turn) { grab.t += dt; grab.th.hold && grab.th.hold(dt, grab.t); }
    hover = grab ? grab.th : find(); if (picked && (!usable(picked) || (centre(picked, tmp2) && tmp2.distanceTo(camera.position) > picked.reach + 0.6))) picked = null;
    const shown = hover || picked;
    // the tip: what this is and what a click does
    let html = ''; if (shown && on) { const th = shown, no = !th._far && th.why ? th.why(held) : null, verb = th._far ? 'Step closer' : no || (typeof th.verb === 'function' ? th.verb(held) : th.verb) || KIND_WORD[th.kind], val = th.get ? th.get() : null;
      html = `<b>${esc(label(th, held))}</b><span class="${th._far || no ? 'no' : ''}">${esc(verb)}</span>${val != null ? `<i>${esc(val)}</i>` : ''}${th.kind === 'turn' && !th._far && picked === th ? '<em><button data-turn="-1" aria-label="Less">&minus;</button><button data-turn="1" aria-label="More">+</button></em>' : ''}`; }
    if (html !== lastTip) { tip.innerHTML = html; lastTip = html; tip.hidden = !html; }
    if (html) { const lock = world.locked || (picked && shown === picked && !hover); let x = lock ? innerWidth / 2 : pointer.x + 16, y = lock ? innerHeight / 2 + 22 : pointer.y + 18; if (lock && picked && !hover) { const c = centre(picked, tmp2), s = c && eyeToScreen(c); if (s && s.front) { x = s.x + 18; y = s.y + 14; } } tip.style.transform = `translate(${Math.round(Math.min(innerWidth - 240, Math.max(8, x)))}px, ${Math.round(Math.min(innerHeight - 70, Math.max(8, y)))}px)`; tip.classList.toggle('mid', !!lock && !picked); }
    world.renderer.domElement.style.cursor = hover && !hover._far && on ? 'pointer' : '';
    // what you hold, and where it can go
    const ch = held ? `<small>In your hand</small><b>${esc(label(held))}</b><span>${esc(held.holdHint || 'Click where it goes.')}</span><button data-back>Put it back <kbd>X</kbd></button>` : ''; if (chip.dataset.h !== ch) { chip.dataset.h = ch; chip.innerHTML = ch; chip.hidden = !ch; }
    let n = 0; const want = []; if (on && world.enabled) { for (const th of things.values()) { if (!usable(th)) continue; if (th.kind === 'place' || th === hover || (th.mark && th.mark(held))) want.push(th); } }
    for (const th of want) { const c = centre(th, tmp2); if (!c) continue; const d = c.distanceTo(camera.position); if (d > th.reach + 2.5) continue; const s = eyeToScreen(c); if (!s.front) continue; let m = marks.children[n]; if (!m) { m = document.createElement('i'); marks.append(m); } n++;
      const r = Math.max(9, Math.min(46, size(th) / Math.max(d, 0.25) * innerHeight * 0.62)); m.style.transform = `translate(${Math.round(s.x - r)}px, ${Math.round(s.y - r)}px)`; m.style.width = m.style.height = `${Math.round(r * 2)}px`; m.className = (th === hover ? 'on ' : '') + (th.kind === 'place' ? 'place ' : '') + (d > th.reach ? 'far' : ''); }
    while (marks.children.length > n) marks.lastChild.remove();
  }

  const api = {
    add, remove, clear, take: (id) => take(things.get(id)), back: () => letGo(true), release: () => letGo(false), settle, turn: (id, steps) => turn(things.get(id), steps), say, hand, last: null, said: '',
    get held() { return held; }, get hover() { return hover; }, get picked() { return picked; }, get things() { return things; }, get busy() { return !!grab; },
    /** Switch the hands off (a panel is open) or on. */
    enable(v) { on = !!v; if (!on) { endGrab(); picked = null; } },
    on(fn) { listeners.push(fn); return () => listeners.splice(listeners.indexOf(fn), 1); },
    /** A click (or a tap) on the picture: true when a thing took it. */
    pick(e) { if (!on) return false; if (e) { pointer.x = e.clientX; pointer.y = e.clientY; pointer.seen = true; } const th = find(); if (!th) { if (picked) { picked = null; return true; } return false; } return act(th, e); },
    grab: onGrab,
    /** Where a thing is on the screen, for checks and for pointing a learner at it. */
    where(id) { const th = things.get(id); if (!th) return null; const c = centre(th, V()); if (!c) return { id, usable: false }; const s = eyeToScreen(c), d = c.distanceTo(camera.position), no = th.why ? th.why(held) : null; return { id, kind: th.kind, label: label(th, held), x: Math.round(s.x), y: Math.round(s.y), front: s.front, dist: +d.toFixed(3), reach: th.reach, usable: usable(th), why: no || null, at: c.toArray().map((v) => +v.toFixed(3)), value: th.get ? th.get() : null }; },
    list(group = null) { return [...things.values()].filter((t) => !group || t.group === group).map((t) => api.where(t.id)); },
    update,
  };
  return api;
}
