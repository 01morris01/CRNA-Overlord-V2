/** Where things go on a patient who is lying down: fingertips, upper arms, electrode sites, the places a stethoscope is put.
 *
 *  A figure made with its own sites (the first patient carries them as landmarks placed on its own skin) is taken at its word.
 *  For every other figure the sites are worked out from the few landmarks it does have (sternal notch, chin, wrists, hands)
 *  and from the patient's charted height, and each one is then dropped onto the figure's own drawn surface with a ray, so that a
 *  probe or an electrode sits on what you see and not in the air above it or inside it. Sides are the patient's own: with the
 *  head toward -z and the face up, the patient's right hand is at -x.
 *
 *  The surface positions (which rib space, which line) follow the ordinary bedside descriptions: five-electrode ECG with the
 *  arm electrodes under the outer clavicles, the leg electrodes on the lower chest wall clear of an abdominal field and the
 *  chest electrode at V5; heart sounds at the second right and second left spaces beside the sternum, the lower left sternal
 *  border and the apex; lung sounds at the second space in the mid-clavicular line and low in the mid-axillary line on each
 *  side. They are estimates on a generated body, set by an AI from those descriptions, and have not been reviewed by faculty.
 */
import * as THREE from 'three';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z), DOWN = V(0, -1, 0);
export const SITE_LABEL = {
  fingerL: 'left index finger', fingerR: 'right index finger', armL: 'left upper arm', armR: 'right upper arm', handL: 'back of the left hand', handR: 'back of the right hand',
  ecgRA: 'under the right clavicle', ecgLA: 'under the left clavicle', ecgRL: 'right lower chest wall', ecgLL: 'left lower chest wall', ecgV: 'left chest, V5',
  lungRU: 'right upper chest', lungLU: 'left upper chest', lungRL: 'right lower chest, at the side', lungLL: 'left lower chest, at the side', epigastrium: 'over the stomach', trachea: 'over the windpipe',
  aortic: 'second space, right of the sternum', pulmonic: 'second space, left of the sternum', tricuspid: 'lower left edge of the sternum', mitral: 'the apex of the heart',
  eyeL: 'left eye', eyeR: 'right eye', mouth: 'mouth', chin: 'chin', forehead: 'forehead', wristL: 'left wrist', wristR: 'right wrist',
};

/** Sites for one figure. `P` is what js/periop.js keeps for a patient: { root, lm (landmarks in the figure's own frame), meta? }.
 *  Returns get(id) -> { id, label, local, pos (in the room), normal (in the room), axis? (in the room, for a finger or an arm), exact }. */
export function bodySites(P, { heightM = 1.72 } = {}) {
  const root = P.root, L = P.lm || {}, k = heightM / 1.72, cache = new Map(), ray = new THREE.Raycaster(), skin = [];
  root.updateMatrixWorld(true); root.traverse((o) => { if (o.isMesh && !/hair|lash|brow|eye|teeth|tongue/i.test(o.name + ' ' + ((o.material && o.material.name) || ''))) skin.push(o); });
  const own = (P.meta && P.meta.sites) || P.sites || null, SN = L.sternalNotch || (L.chin ? L.chin.clone().add(V(0, -0.01, 0.105 * k)) : V(0, 0.17, -0.56 * k));
  const toRoom = (v) => root.localToWorld(v.clone()), dirRoom = (v) => v.clone().transformDirection(root.matrixWorld);
  /** The first drawn surface met from a point above (or beside) the body, looking along `dir` (both in the figure's own frame). */
  function drop(local, dir = DOWN, back = 0.45) { const from = toRoom(local.clone().addScaledVector(dir, -back)), d = dirRoom(dir); ray.set(from, d); ray.far = back + 0.5; ray.near = 0;
    const h = ray.intersectObjects(skin, false)[0]; if (!h) return null; const n = h.face ? h.face.normal.clone().transformDirection(h.object.matrixWorld) : d.clone().negate(); if (n.dot(d) > 0) n.negate(); return { pos: h.point.clone(), normal: n, on: h.object.name }; }
  const shoulder = (s) => V(s * 0.19 * k, SN.y - 0.03, SN.z + 0.035 * k), hand = (s) => (s > 0 ? L.handL : L.handR), wrist = (s) => (s > 0 ? L.wristL : L.wristR);
  const EST = {      // [x, z] on the chest from the sternal notch (meters at 1.72 m, scaled by height), dropped from above unless a direction is given
    ecgRA: [-0.105, 0.045], ecgLA: [0.105, 0.045], ecgV: [0.150, 0.185, V(-0.55, -0.83, 0).normalize()], ecgRL: [-0.150, 0.275, V(0.55, -0.83, 0).normalize()], ecgLL: [0.150, 0.275, V(-0.55, -0.83, 0).normalize()],
    lungRU: [-0.085, 0.065], lungLU: [0.085, 0.065], lungRL: [-0.30, 0.215, V(1, -0.12, 0).normalize()], lungLL: [0.30, 0.215, V(-1, -0.12, 0).normalize()],
    aortic: [-0.030, 0.070], pulmonic: [0.030, 0.070], tricuspid: [0.025, 0.155], mitral: [0.085, 0.185], epigastrium: [0, 0.255], trachea: [0, -0.030],
  };
  function make(id) {
    if (own && own[id]) { const o = own[id], local = V(...(o.pos || o)), n = o.normal ? V(...o.normal) : V(0, 1, 0), a = o.axis ? V(...o.axis) : null; return { id, label: SITE_LABEL[id] || id, local, pos: toRoom(local), normal: dirRoom(n), axis: a ? dirRoom(a) : null, exact: true }; }
    let local = null, hit = null, axis = null;
    if (EST[id]) { const [x, z, dir] = EST[id]; local = V(SN.x + x * k, 0.5, SN.z + z * k); if (dir) local.y = Math.max(0.06, SN.y - 0.06); hit = drop(local, dir || DOWN, dir ? 0.3 : 0.45); }
    else if (/^(eye[LR]|mouth|chin|forehead|nose)$/.test(id) && L[id]) { local = L[id].clone(); hit = { pos: toRoom(local), normal: dirRoom(V(0, 1, 0)) }; }
    else if (/^(finger|hand|wrist|arm)[LR]$/.test(id)) { const s = id.endsWith('L') ? 1 : -1, h = hand(s), w = wrist(s); if (!h || !w) return null; const along = h.clone().sub(w); along.y = 0; if (along.lengthSq() < 1e-6) along.set(0, 0, 1); along.normalize();
      if (id.startsWith('finger')) { local = h.clone().addScaledVector(along, 0.085 * k); axis = along; } else if (id.startsWith('hand')) { local = h.clone(); axis = along; } else if (id.startsWith('wrist')) { local = w.clone(); axis = along; }
      else { const sh = shoulder(s), el = sh.clone().lerp(w, 0.53); local = sh.clone().lerp(el, 0.55); axis = el.clone().sub(sh).normalize(); }
      hit = drop(V(local.x, 0.5, local.z)) || { pos: toRoom(local), normal: dirRoom(V(0, 1, 0)) }; if (id.startsWith('arm')) { const c = toRoom(local); c.y = hit.pos.y - 0.045 * k; hit = { pos: c, normal: hit.normal }; } }
    if (!hit) return null; return { id, label: SITE_LABEL[id] || id, local: root.worldToLocal(hit.pos.clone()), pos: hit.pos, normal: hit.normal, axis: axis ? dirRoom(axis) : null, exact: false, on: hit.on || null };
  }
  return { get(id) { if (!cache.has(id)) cache.set(id, make(id)); const s = cache.get(id); if (s) s.pos = toRoom(s.local); return s; }, ids: () => Object.keys(SITE_LABEL), heightM, exact: !!own, clear: () => cache.clear() };
}
