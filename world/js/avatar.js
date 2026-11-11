// avatar.js: the player's character in the game world. Built from rounded blocks, the way block-world characters are,
// so every part can be recoloured, swapped or added to: skin, hair, scrubs, cap, glasses, stethoscope, and things
// earned by showing you know something (the nerve stimulator on the hip is the first).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const OPTIONS = {
  skin: ['#f6d7bd', '#eab98f', '#d09a6a', '#a8703f', '#7a4a26', '#4f2f18'],
  hair: [['short', 'Short'], ['fade', 'Fade'], ['bun', 'Bun'], ['long', 'Long'], ['curly', 'Curly'], ['none', 'None']],
  hairColor: ['#1b1512', '#3e2a1c', '#7a4b26', '#c9a162', '#b4472f', '#8d9299'],
  scrubs: ['#2f6f7c', '#27456e', '#5a4a8c', '#2f7a55', '#8c3f55', '#c9603c', '#4a5560', '#d5dbe0'],
};
export const DEFAULT = { skin: 2, hair: 'short', hairColor: 1, scrubs: 0, cap: false, glasses: false, steth: true };

const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness: 0, ...o });
const box = (w, h, d, m, r = 0.035) => { const b = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.2, h / 2.2, d / 2.2)), m); b.castShadow = true; b.receiveShadow = true; return b; };
const at = (o, x, y, z) => { o.position.set(x, y, z); return o; };

export function buildAvatar(c = DEFAULT, rewards = []) {
  c = { ...DEFAULT, ...c };
  const skin = mat(OPTIONS.skin[c.skin]), top = mat(OPTIONS.scrubs[c.scrubs]), pants = mat(new THREE.Color(OPTIONS.scrubs[c.scrubs]).multiplyScalar(0.86));
  const hair = mat(OPTIONS.hairColor[c.hairColor], { roughness: 0.9 }), dark = mat('#20242a'), white = mat('#f2f3f1'), shoe = mat('#e9ebee', { roughness: 0.6 });
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  // legs, hinged at the hip
  const leg = (x) => { const p = at(new THREE.Group(), x, 0.72, 0); p.add(at(box(0.2, 0.64, 0.22, pants), 0, -0.32, 0), at(box(0.21, 0.11, 0.3, shoe, 0.04), 0, -0.665, 0.035)); body.add(p); return p; };
  const legL = leg(0.115), legR = leg(-0.115);
  // torso: scrub top with a V of skin at the neck, a chest pocket and a hem
  const torso = at(new THREE.Group(), 0, 0.72, 0); body.add(torso);
  torso.add(at(box(0.47, 0.62, 0.27, top, 0.05), 0, 0.31, 0));
  const vee = at(box(0.13, 0.13, 0.02, skin, 0.004), 0, 0.585, 0.128); vee.rotation.z = Math.PI / 4; torso.add(vee);
  torso.add(at(box(0.12, 0.11, 0.02, pants, 0.006), 0.115, 0.36, 0.131), at(box(0.475, 0.05, 0.275, pants, 0.02), 0, 0.03, 0));
  torso.add(at(box(0.075, 0.1, 0.014, white, 0.004), -0.125, 0.36, 0.137), at(box(0.075, 0.022, 0.016, mat('#ff5a3c')), -0.125, 0.395, 0.138));   // ID badge
  // arms, hinged at the shoulder: short sleeve, then skin
  const arm = (x) => { const p = at(new THREE.Group(), x, 1.3, 0); p.add(at(box(0.175, 0.27, 0.21, top, 0.04), 0, -0.115, 0), at(box(0.15, 0.4, 0.18, skin, 0.04), 0, -0.43, 0)); body.add(p); return p; };
  const armL = arm(0.325), armR = arm(-0.325);
  // head
  const head = at(new THREE.Group(), 0, 1.36, 0); body.add(head);
  head.add(at(box(0.16, 0.06, 0.16, skin, 0.02), 0, 0, 0), at(box(0.43, 0.42, 0.42, skin, 0.07), 0, 0.23, 0));
  for (const x of [0.095, -0.095]) head.add(at(box(0.055, 0.075, 0.02, dark, 0.012), x, 0.25, 0.207), at(box(0.018, 0.02, 0.01, white, 0.004), x + 0.012, 0.27, 0.218));
  head.add(at(box(0.11, 0.022, 0.012, mat('#8f4a3d'), 0.005), 0, 0.125, 0.208));
  const H = 0.23;   // head centre height inside the head group
  if (!c.cap) {
    if (c.hair === 'short' || c.hair === 'bun' || c.hair === 'long') head.add(at(box(0.45, 0.15, 0.44, hair, 0.06), 0, H + 0.165, -0.004), at(box(0.45, 0.2, 0.2, hair, 0.05), 0, H + 0.07, -0.125));
    if (c.hair === 'fade') head.add(at(box(0.4, 0.09, 0.4, hair, 0.04), 0, H + 0.19, 0), at(box(0.44, 0.14, 0.3, hair, 0.03), 0, H + 0.1, -0.07));
    if (c.hair === 'bun') head.add(at(box(0.17, 0.17, 0.17, hair, 0.07), 0, H + 0.2, -0.21));
    if (c.hair === 'long') head.add(at(box(0.46, 0.5, 0.13, hair, 0.05), 0, H - 0.1, -0.175), at(box(0.07, 0.34, 0.2, hair, 0.03), 0.2, H - 0.02, -0.06), at(box(0.07, 0.34, 0.2, hair, 0.03), -0.2, H - 0.02, -0.06));
    if (c.hair === 'curly') for (const [x, y, z, s] of [[0, 0.21, 0, 0.3], [0.15, 0.17, 0.02, 0.22], [-0.15, 0.17, 0.02, 0.22], [0, 0.17, -0.16, 0.26], [0.14, 0.1, -0.14, 0.2], [-0.14, 0.1, -0.14, 0.2], [0, 0.2, 0.13, 0.2]]) head.add(at(box(s, s, s, hair, s * 0.45), x, H + y, z));
  } else {   // scrub cap: covers the hair, a band at the brow
    head.add(at(box(0.455, 0.2, 0.445, top, 0.07), 0, H + 0.15, -0.005), at(box(0.46, 0.045, 0.45, pants, 0.02), 0, H + 0.065, -0.005));
    if (c.hair === 'bun' || c.hair === 'long' || c.hair === 'curly') head.add(at(box(0.3, 0.2, 0.16, top, 0.07), 0, H + 0.1, -0.24));
  }
  if (c.glasses) { for (const x of [0.095, -0.095]) head.add(at(box(0.13, 0.11, 0.012, mat('#111318'), 0.02), x, 0.25, 0.222), at(box(0.1, 0.08, 0.014, mat('#cfe6f5', { transparent: true, opacity: 0.55 }), 0.014), x, 0.25, 0.223)); head.add(at(box(0.07, 0.016, 0.012, dark), 0, 0.26, 0.222)); }
  if (c.steth) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.017, 8, 28), mat('#2b3038', { roughness: 0.5 })); t.rotation.x = Math.PI / 2 - 0.35; t.position.set(0, 0.6, 0.02); t.castShadow = true; torso.add(t); torso.add(at(box(0.05, 0.05, 0.03, mat('#c7ccd3', { metalness: 0.6, roughness: 0.3 }), 0.02), 0.07, 0.43, 0.14)); }
  if (c.cap && c.capStyle === 'dots') for (const [x, z] of [[0.15, 0.226], [-0.15, 0.226], [0, 0.226], [0.232, 0.08], [-0.232, 0.08], [0.232, -0.1], [-0.232, -0.1], [0.08, -0.23], [-0.08, -0.23]]) head.add(at(box(0.05, 0.05, 0.02, mat('#ff5a3c'), 0.02), x, H + 0.17, z));   // the regional cap, earned
  if (c.prop === 'book') { const b = at(new THREE.Group(), 0, 0.3, 0.3); b.add(box(0.3, 0.02, 0.22, mat('#f4f1ea'), 0.004), at(box(0.31, 0.012, 0.23, mat('#2f6f7c'), 0.004), 0, -0.014, 0)); b.rotation.x = -0.5; torso.add(b); }
  if (c.prop === 'crate') torso.add(at(box(0.42, 0.3, 0.3, mat('#c79b66'), 0.02), 0, 0.3, 0.36), at(box(0.44, 0.04, 0.32, mat('#74543a'), 0.01), 0, 0.3, 0.36));
  if (c.prop === 'rake') { const r = at(new THREE.Group(), -0.34, 0.2, 0.16); r.add(at(box(0.035, 1.3, 0.035, mat('#74543a'), 0.01), 0, 0.25, 0), at(box(0.34, 0.04, 0.05, mat('#3a4048'), 0.01), 0, -0.4, 0.02)); r.rotation.x = 0.35; torso.add(r); }
  if (c.prop === 'headset') head.add(at(box(0.47, 0.05, 0.06, mat('#20242a'), 0.02), 0, H + 0.2, 0), at(box(0.06, 0.13, 0.11, mat('#20242a'), 0.03), 0.235, H + 0.02, 0), at(box(0.06, 0.13, 0.11, mat('#20242a'), 0.03), -0.235, H + 0.02, 0));
  if (rewards.includes('nerve-stimulator')) {   // earned in Anatomy Hall
    const s = at(new THREE.Group(), 0.245, 0.06, 0.05); s.add(box(0.05, 0.13, 0.09, mat('#ff5a3c', { roughness: 0.45 }), 0.012), at(box(0.01, 0.05, 0.06, mat('#c6f36b', { emissive: '#c6f36b', emissiveIntensity: 0.9 }), 0.003), 0.027, 0.02, 0)); torso.add(s);
  }
  // Each moving part (two legs, torso, two arms, head) becomes ONE mesh with its colours baked into the vertices,
  // so a whole character costs six draw calls instead of about thirty-five.
  const skinMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.76, metalness: 0 });
  for (const part of [legL, legR, torso, armL, armR, head]) {
    part.updateMatrixWorld(true); const inv = part.matrixWorld.clone().invert(), geos = [], kids = [];
    part.traverse((o) => { if (!o.isMesh) return; const gg = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone(); gg.applyMatrix4(o.matrixWorld.clone().premultiply(inv)); const col = o.material.emissive && o.material.emissive.getHex() !== 0 ? o.material.emissive : o.material.color, n = gg.attributes.position.count, cs = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { cs[i * 3] = col.r; cs[i * 3 + 1] = col.g; cs[i * 3 + 2] = col.b; } gg.setAttribute('color', new THREE.BufferAttribute(cs, 3)); gg.deleteAttribute('uv'); geos.push(gg); kids.push(o); });
    for (const k of kids) k.removeFromParent(); for (const c of [...part.children]) if (!c.isMesh && c.children.length === 0) c.removeFromParent();
    const m = new THREE.Mesh(mergeGeometries(geos, false), skinMat); m.castShadow = true; m.receiveShadow = true; part.add(m);
  }
  let phase = 0, amt = 0, t = 0;
  g.userData.update = (dt, speed = 0, airborne = false) => {
    t += dt; const want = Math.min(1, speed / 3.2); amt += (want - amt) * Math.min(1, dt * 10); phase += dt * (5 + speed * 1.6);
    const s = Math.sin(phase) * 0.85 * amt, idle = 1 - amt;
    legL.rotation.x = airborne ? 0.35 : s; legR.rotation.x = airborne ? -0.25 : -s;
    armL.rotation.x = airborne ? -1.1 : -s * 0.9; armR.rotation.x = airborne ? -1.1 : s * 0.9; armL.rotation.z = 0.05 + idle * 0.03 * Math.sin(t * 1.6); armR.rotation.z = -armL.rotation.z;
    body.position.y = Math.abs(Math.cos(phase)) * 0.035 * amt + idle * 0.006 * Math.sin(t * 1.6); head.rotation.y = idle * 0.25 * Math.sin(t * 0.5); head.rotation.x = idle * 0.04 * Math.sin(t * 0.8);
    const pose = g.userData.pose;
    if (pose === 'sit') { legL.rotation.x = legR.rotation.x = -1.5; body.position.y = -0.24; armL.rotation.x = armR.rotation.x = -0.75; armL.rotation.z = -0.25; armR.rotation.z = 0.25; head.rotation.x = 0.28 + 0.03 * Math.sin(t * 0.7); head.rotation.y = 0.08 * Math.sin(t * 0.23); }
    if (pose === 'carry') { armL.rotation.x = armR.rotation.x = -1.15; armL.rotation.z = -0.12; armR.rotation.z = 0.12; }
    if (pose === 'rake' && speed < 0.1) { armL.rotation.x = -0.5 + 0.35 * Math.sin(t * 2.2); armR.rotation.x = -0.7 + 0.35 * Math.sin(t * 2.2); }
  };
  g.userData.wave = (k) => { armR.rotation.x = -2.6; armR.rotation.z = -0.3 + 0.35 * Math.sin(k * 9); };
  return g;
}
