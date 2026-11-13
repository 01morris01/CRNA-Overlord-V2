// person.js: the learner's character. Four rigged people (Microsoft Rocketbox, MIT), each with idle, walk and brisk-walk
// clips re-baked onto their own skeleton by tools/convert_rocketbox.py. Garment color is a choice where the clothing
// allows it; nothing here pretends a costume changes what you know.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const PEOPLE = {   // what you choose from. `tint`: how the garment can be recoloured (null = as made).
  tunic: { label: 'Tunic and trousers', tint: 'white' }, scrubs: { label: 'Scrubs, cap and mask', tint: 'green' },
  coat: { label: 'White coat', tint: null }, longcoat: { label: 'Long coat and tie', tint: null },
};
export const COLOURS = [   // garment colors, linear-ish display values; the first is "as made"
  { id: 'asmade', label: 'As made', rgb: null }, { id: 'ceil', label: 'Ceil blue', rgb: [0.42, 0.62, 0.86] }, { id: 'teal', label: 'Teal', rgb: [0.16, 0.5, 0.5] },
  { id: 'navy', label: 'Navy', rgb: [0.1, 0.16, 0.34] }, { id: 'wine', label: 'Wine', rgb: [0.42, 0.1, 0.18] }, { id: 'graphite', label: 'Graphite', rgb: [0.2, 0.21, 0.24] },
];
export const DEFAULT_LOOK = { person: 'tunic', colour: 'ceil' };
let META = null;
export async function peopleMeta() { return META ||= await (await fetch(new URL('../../assets/characters/characters.json', import.meta.url))).json(); }

const TINT_GLSL = `
uniform vec3 ovTint; uniform float ovTintMode;
vec3 ovGarment(vec3 c) {
  if (ovTintMode < 0.5) return c;
  float mx = max(c.r, max(c.g, c.b)), mn = min(c.r, min(c.g, c.b)), sat = mx > 0.0 ? (mx - mn) / mx : 0.0, m;
  if (ovTintMode < 1.5) m = smoothstep(0.24, 0.1, sat) * smoothstep(0.14, 0.36, mx);                      /* white cloth: bright and colorless */
  else m = smoothstep(0.1, 0.28, sat) * step(c.r, c.g) * step(c.b, c.g * 1.04) * smoothstep(0.02, 0.08, mx);   /* green cloth: green leads */
  float shade = ovTintMode < 1.5 ? mx / 0.82 : dot(c, vec3(0.2126, 0.7152, 0.0722)) / 0.2;
  return mix(c, ovTint * shade, m);
}`;
/** Load one person. `light(materials)` lets the world attach its probe lighting to the character's materials. */
export async function loadPerson(id, { colour = 'asmade', light = null } = {}) {
  const meta = (await peopleMeta())[id] || (await peopleMeta()).tunic, spec = PEOPLE[id] || PEOPLE.tunic;
  const gltf = await new GLTFLoader().loadAsync(new URL('../../assets/characters/' + meta.file, import.meta.url).href);
  const root = new THREE.Group(), model = gltf.scene; root.add(model); model.rotation.y = Math.atan2(meta.forward[0], meta.forward[2]) * -1; model.position.y = -meta.feet_z;
  const tint = { ovTint: { value: new THREE.Color(1, 1, 1) }, ovTintMode: { value: 0 } }, mats = [], feet = [];
  model.traverse((o) => {
    if (o.isBone && /(L|R) Foot$/.test(o.name.replace(/_/g, ' '))) feet.push(o);
    if (!o.isMesh) return; o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false;
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      if (mats.includes(m)) continue; mats.push(m); const part = m.userData.part || '';
      m.metalness = 0; m.envMapIntensity = 0.5;
      if (part === 'hair') { m.transparent = false; m.alphaTest = 0.5; m.alphaToCoverage = true; m.side = THREE.DoubleSide; m.depthWrite = true; m.roughness = 0.9; m.envMapIntensity = 0; m.color.multiplyScalar(0.8); }
      if ((part === 'body' || part === 'kit') && spec.tint) { m.userData.garment = true; }
    }
  });
  const hooks = mats.map((m) => (shader) => {
    if (m.userData.part === 'hair') shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_begin>', THREE.ShaderChunk.lights_fragment_begin.replace('#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )', '#if 0').replace('#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )', '#if 0'));   /* hair cards take only soft light, or every card shows */
    if (m.userData.garment) { Object.assign(shader.uniforms, tint); shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\n' + TINT_GLSL).replace('#include <map_fragment>', '#include <map_fragment>\n\tdiffuseColor.rgb = ovGarment( diffuseColor.rgb );'); }
  });
  mats.forEach((m, i) => { m.userData.ovHook = hooks[i]; m.onBeforeCompile = hooks[i]; m.customProgramCacheKey = () => 'person' + (m.userData.garment ? 'G' : '') + (m.userData.part === 'hair' ? 'H' : ''); });
  if (light) light(mats);
  function setColour(cid) { const c = COLOURS.find((x) => x.id === cid) || COLOURS[0]; if (!spec.tint || !c.rgb) { tint.ovTintMode.value = 0; return; } tint.ovTintMode.value = spec.tint === 'white' ? 1 : 2; tint.ovTint.value.setRGB(c.rgb[0], c.rgb[1], c.rgb[2]); }
  setColour(colour);
  // ---- clips: stand, walk, walk briskly; whichever suits the speed, played at the rate that keeps the feet from sliding
  const mixer = new THREE.AnimationMixer(model), act = {}; for (const c of gltf.animations) { act[c.name] = mixer.clipAction(c); act[c.name].play(); act[c.name].setEffectiveWeight(c.name === 'Idle' ? 1 : 0); }
  const sp = { Walk: meta.clips.Walk.speed, Brisk: meta.clips.Brisk.speed }, w = { Idle: 1, Walk: 0, Brisk: 0 }; let last = [0, 0], onStep = null; const fp = new THREE.Vector3();
  function update(dt, speed = 0) {
    const want = speed < 0.08 ? 'Idle' : speed <= sp.Walk * 1.12 ? 'Walk' : 'Brisk', k = Math.min(1, dt * 7);
    for (const n of Object.keys(w)) { w[n] += ((n === want ? 1 : 0) - w[n]) * k; act[n] && act[n].setEffectiveWeight(w[n]); }
    if (act.Walk) act.Walk.timeScale = THREE.MathUtils.clamp(speed / sp.Walk, 0.6, 1.5); if (act.Brisk) act.Brisk.timeScale = THREE.MathUtils.clamp(speed / sp.Brisk, 0.8, 1.6);
    mixer.update(dt);
    if (onStep && speed > 0.3) feet.forEach((f, i) => { f.getWorldPosition(fp); const y = fp.y - root.position.y, was = last[i]; last[i] = y; if (was > 0.115 && y <= 0.115) onStep(i); });   // a foot coming down
  }
  return { root, id, meta, height: meta.height, update, setColour, mats, set onStep(fn) { onStep = fn; }, canTint: !!spec.tint,
    dispose() { mixer.stopAllAction(); model.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); for (const m of Array.isArray(o.material) ? o.material : [o.material]) { for (const k of ['map', 'normalMap']) m[k] && m[k].dispose(); m.dispose(); } } }); } };
}
