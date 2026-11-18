/** Positions: how a patient lies for each part of a case, stored with the case, and the figure posed to match.
 *
 *  data/world/positions.json  the positions (what, why, references, what to check)
 *  data/world/case-setups.json  per patient: which position in which part of the case, who turns them and when
 *
 *  A figure built with pose clips (assets/people/hero/<id>.glb: single-keyframe glTF animations named for the pose, keying body
 *  bones only) is posed here: each clip is read once into a target for every bone it keys, and a change of position moves the
 *  bones there over a few seconds (the team turning the patient). Per-pose things in the same file (supports, pillows, blankets,
 *  named `<name>__<pose>`) show only in their pose. Landmarks written as { bone, offset } follow the bones, so whatever sits on
 *  the patient (probe, cuff, IV port, mask, tube) can follow too.
 *  A figure without pose clips (every older generated patient) is NOT moved: the position is still recorded and the room says
 *  that this figure cannot show it.
 */
import * as THREE from 'three';

const J = (p) => fetch(new URL(`../../${p}`, import.meta.url)).then((r) => { if (!r.ok) throw new Error(`${r.status} ${p}`); return r.json(); });
export async function loadPositions() { const [lib, setups] = await Promise.all([J('data/world/positions.json').catch(() => null), J('data/world/case-setups.json').catch(() => null)]); return { lib: (lib && lib.positions) || {}, setups: setups || {} }; }

/** The position plan for one case: [{ from, position, by, say }], `kind` 'general' or 'sedation'. */
export function planFor(P, id, kind = 'general') { const s = (P.setups[id] || P.setups.default || {}); return (s[kind] || (P.setups.default || {})[kind] || [{ from: 'setup', position: 'supine_flat' }]).map((q) => ({ ...q, def: P.lib[q.position] || null })); }
export function setupFor(P, id) { return P.setups[id] || null; }

const ease = (t) => t * t * (3 - 2 * t);

/** A poser for one loaded figure. `gltf` is the loaded file (scene + animations), `meta` its JSON (landmarks). */
export function makePoser(gltf, meta = null) {
  const scene = gltf.scene, bones = new Map(), poses = new Map(), perPose = [], pressMorphs = []; let skinned = false;
  scene.traverse((o) => {
    if (o.isBone) bones.set(o.name, o); if (o.isSkinnedMesh) skinned = true;
    const m = /__([a-z_]+)$/.exec(o.name || ''); if (m) perPose.push({ o, pose: m[1] });
    if (o.isMesh && o.morphTargetDictionary) {
      const dict = {}; for (const [k, i] of Object.entries(o.morphTargetDictionary)) { const pm = /^press_(.+)$/.exec(k); if (pm) dict[pm[1]] = i; }
      if (Object.keys(dict).length) pressMorphs.push({ mesh: o, dict });
    }
  });
  for (const clip of gltf.animations || []) {
    const target = new Map();
    for (const tr of clip.tracks) { const [name, prop] = tr.name.split('.'), b = bones.get(name) || scene.getObjectByName(name); if (!b || !b.isBone) continue; const e = target.get(b) || {}; const v = tr.values;
      if (prop === 'quaternion') e.q = new THREE.Quaternion(v[0], v[1], v[2], v[3]); else if (prop === 'position') e.p = new THREE.Vector3(v[0], v[1], v[2]); else if (prop === 'scale') e.s = new THREE.Vector3(v[0], v[1], v[2]); target.set(b, e); }
    if (target.size) poses.set(clip.name, target);
  }
  const rest = new Map(); for (const b of bones.values()) rest.set(b, { q: b.quaternion.clone(), p: b.position.clone(), s: b.scale.clone() });
  let current = null, move = null; const extra = new Map(), base = new Map();      // base: each bone's pose before any extra rotation      // extra: additive rotations applied after the pose (head extension for laryngoscopy, jaw)
  const LM = (meta && meta.landmarks) || null;
  function showPerPose(pose) { for (const { o, pose: p } of perPose) o.visible = p === pose; }
  function setPressMorphs(pose) { for (const { mesh, dict } of pressMorphs) for (const [p, idx] of Object.entries(dict)) mesh.morphTargetInfluences[idx] = p === pose ? 1 : 0; }
  const api = {
    get canPose() { return skinned && poses.size > 0; }, get poses() { return [...poses.keys()]; }, get current() { return current; }, get moving() { return !!move; }, bones,
    /** Go to a pose over `seconds` (0 = at once). Returns false if this figure has no such pose. */
    set(pose, seconds = 0, done = null) {
      const target = poses.get(pose); if (!target) return false;
      const from = new Map(); for (const b of target.keys()) from.set(b, { q: (base.get(b) || b.quaternion).clone(), p: b.position.clone(), s: b.scale.clone() });
      if (seconds <= 0) { for (const [b, e] of target) { if (e.q) { b.quaternion.copy(e.q); base.set(b, e.q.clone()); } if (e.p) b.position.copy(e.p); if (e.s) b.scale.copy(e.s); } current = pose; move = null; showPerPose(pose); setPressMorphs(pose); done && done(); return true; }
      for (const { o } of perPose) if (/^blanket/.test(o.name)) o.visible = false;      // the blanket comes off for the turn and goes back on after
      move = { pose, target, from, fromPose: current, t: 0, dur: seconds, done }; return true;
    },
    /** Add a rotation (radians, about the bone's own axis) on top of the pose, e.g. head extension; null removes it. */
    nudge(boneName, axis = null, angle = 0) { const b = bones.get(boneName); if (!b) return false; if (!base.has(b)) base.set(b, b.quaternion.clone()); if (!axis || !angle) { extra.delete(b); b.quaternion.copy(base.get(b)); } else extra.set(b, new THREE.Quaternion().setFromAxisAngle(axis, angle)); return true; },
    update(dt) {
      if (move) { move.t = Math.min(1, move.t + dt / move.dur); const k = ease(move.t);
        for (const [b, e] of move.target) { const f = move.from.get(b); if (e.q) { b.quaternion.slerpQuaternions(f.q, e.q, k); base.set(b, b.quaternion.clone()); } if (e.p) b.position.lerpVectors(f.p, e.p, k); if (e.s) b.scale.lerpVectors(f.s, e.s, k); }
        for (const { mesh, dict } of pressMorphs) for (const [p, idx] of Object.entries(dict)) mesh.morphTargetInfluences[idx] = (p === move.pose ? k : 0) + (p === move.fromPose ? 1 - k : 0);
        if (move.t >= 1) { const m = move; move = null; current = m.pose; showPerPose(m.pose); setPressMorphs(m.pose); m.done && m.done(); } }
      for (const [b, q] of extra) b.quaternion.copy(base.get(b) || b.quaternion).multiply(q);      // the pose, then the extra rotation; rebuilt from the base each frame so it never accumulates
      scene.updateMatrixWorld(true);
    },
    /** Landmarks in the figure root's frame, from the bones as they are now. Returns null when the file has none. */
    landmarks(root, out = {}) { if (!LM) return null; const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
      for (const [k, v] of Object.entries(LM)) { if (!v || !v.bone) continue; const b = bones.get(v.bone); if (!b) continue; const p = new THREE.Vector3(...(v.offset || [0, 0, 0])); b.localToWorld(p); p.applyMatrix4(inv); (out[k] ||= new THREE.Vector3()).copy(p); }
      return out; },
  };
  return api;
}
