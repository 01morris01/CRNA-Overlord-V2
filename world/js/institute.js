// institute.js: the level you walk through. A contemporary anesthesia simulation institute: forecourt and pool, a low
// arrival, a daylit court, the dark anatomy gallery, a regional practice room, an operating room and a study studio.
//
// How it is lit (see tools/build_institute.py for the other half):
//   the building     baked light (sky, lamps, every bounce) from one lightmap  +  the sun, live, with one shadow map
//   things that move baked light probes (nine terms per colour, blended by position)  +  the same live sun  +  gallery spots
//   reflections      one captured cube per room, box-projected so floors reflect the room they are in
// Nothing in here knows about lessons. js/main.js decides what a station opens.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { loadPerson } from './person.js';
import { plateTexture, wordmarkTexture, drawTexture, TOKENS } from './brand.js';
import * as sound from './audio.js';

const LM_RANGE = 6, EXPOSURE = 2.0, SUN_GAIN = 0.6, EXPO = {},      // exposure overrides on top of the level file, for tuning between bakes
  SUN = { x: 9.6, xCourt: 4.95, zSplit: 4.5, zMin: -25.6, zMax: 16.2 },   // where direct sun can reach: the forecourt, the arrival, the court and the gallery's threshold. Elsewhere it is never drawn.
  A = (p) => new URL('../../assets/' + p, import.meta.url).href;
const draco = new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/gltf/');
export const loader = () => new GLTFLoader().setDRACOLoader(draco);
const SHEEN = { or_floor: 0.4, clinical_floor: 0.7 };      // how much of its room a polished surface mirrors, by material: a sheet floor should carry a soft sheen, not a picture of the ceiling lights
const C = THREE.ShaderChunk, SUN_MASK = `float ovSun = step( abs( vOvPos.x ), vOvPos.z > ${SUN.zSplit.toFixed(2)} ? ${SUN.x.toFixed(2)} : ${SUN.xCourt.toFixed(2)} ) * step( ${SUN.zMin.toFixed(2)}, vOvPos.z );\n`, SUN_USE = ['getDirectionalLightInfo( directionalLight, directLight );', 'getDirectionalLightInfo( directionalLight, directLight ); directLight.color *= ovSun;'];
const need = (chunk, a, b) => { if (!chunk.includes(a)) console.warn('institute: shader text changed, patch skipped:', a); return chunk.replace(a, b); };
// ---- the building's materials: lightmap is the only ambient term; no lamps but the sun; reflections fitted to the room
const S_BEGIN = SUN_MASK + need(need(need(C.lights_fragment_begin, '#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )', '#if 0'), '#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )', '#if 0'), SUN_USE[0], SUN_USE[1]);
const S_MAPS = need(need(C.lights_fragment_maps, 'irradiance += lightMapIrradiance;', 'irradiance = lightMapIrradiance;'), 'iblIrradiance += getIBLIrradiance( geometryNormal );', '');
const S_ENV = need(C.envmap_physical_pars_fragment, 'reflectVec = inverseTransformDirection( reflectVec, viewMatrix );', 'reflectVec = inverseTransformDirection( reflectVec, viewMatrix );\n\t\t\treflectVec = ovBox( reflectVec );');
const S_PARS = `
varying vec3 vOvPos; uniform vec3 ovBoxMin; uniform vec3 ovBoxMax; uniform vec3 ovProbePos; uniform float ovBoxOn; uniform float ovVary;
vec3 ovBox( vec3 d ) { if ( ovBoxOn < 0.5 ) return d; vec3 a = ( ovBoxMax - vOvPos ) / d, b = ( ovBoxMin - vOvPos ) / d, m = max( a, b ); float t = min( min( m.x, m.y ), m.z ); return normalize( vOvPos + d * t - ovProbePos ); }
float ovHash( vec2 p ) { return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 ); }
float ovNoise( vec2 p ) { vec2 i = floor( p ), f = fract( p ); f = f * f * ( 3.0 - 2.0 * f ); return mix( mix( ovHash( i ), ovHash( i + vec2( 1, 0 ) ), f.x ), mix( ovHash( i + vec2( 0, 1 ) ), ovHash( i + vec2( 1, 1 ) ), f.x ), f.y ); }`;
function patchStatic(m, box) {
  const u = { ovBoxMin: { value: box ? box.min : new THREE.Vector3() }, ovBoxMax: { value: box ? box.max : new THREE.Vector3() }, ovProbePos: { value: box ? box.at : new THREE.Vector3() }, ovBoxOn: { value: box ? 1 : 0 }, ovVary: { value: m.userData.vary || 0 } };
  m.userData.ov = u;
  m.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, u);
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vOvPos;').replace('#include <project_vertex>', '#include <project_vertex>\n\tvOvPos = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;');
    s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\n' + S_PARS).replace('#include <envmap_physical_pars_fragment>', S_ENV).replace('#include <lights_fragment_begin>', S_BEGIN).replace('#include <lights_fragment_maps>', S_MAPS)
      .replace('#include <map_fragment>', '#include <map_fragment>\n\tdiffuseColor.rgb *= 1.0 + ovVary * ( ovNoise( vOvPos.xz * 0.27 + vOvPos.y * 0.41 ) + 0.5 * ovNoise( vOvPos.xz * 1.3 + vOvPos.y * 1.7 ) - 0.75 ) * 1.6;');
  };
  m.customProgramCacheKey = () => 'ovStatic';
}
// ---- things that move: ambient from the blended probes, no sky-as-ambient; lamps and sun as usual
const D_BEGIN = SUN_MASK + need(need(C.lights_fragment_begin, 'vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );', 'vec3 irradiance = ovProbe( geometryNormal );'), SUN_USE[0], SUN_USE[1]);
const D_MAPS = need(C.lights_fragment_maps, 'iblIrradiance += getIBLIrradiance( geometryNormal );', '');
const D_PARS = `
varying vec3 vOvPos; uniform vec3 ovSH[ 9 ];
vec3 ovProbe( vec3 nv ) { vec3 n = inverseTransformDirection( nv, viewMatrix ); float x = n.x, y = n.y, z = n.z;
  vec3 c = ovSH[ 0 ] + ovSH[ 1 ] * x + ovSH[ 2 ] * y + ovSH[ 3 ] * z + ovSH[ 4 ] * x * y + ovSH[ 5 ] * y * z + ovSH[ 6 ] * ( 3.0 * z * z - 1.0 ) + ovSH[ 7 ] * x * z + ovSH[ 8 ] * ( x * x - y * y );
  return max( c, vec3( 0.0 ) ) * PI; }`;
export function newLight() { return { sh: { value: Array.from({ length: 9 }, () => new THREE.Vector3()) } }; }
export function patchDynamic(mats, light) {
  for (const m of mats) {
    if (!m.isMeshStandardMaterial || m.userData.ovDyn) continue; m.userData.ovDyn = true; const prev = m.onBeforeCompile, key = m.customProgramCacheKey ? m.customProgramCacheKey() : '';
    m.onBeforeCompile = (s, r) => { prev && prev(s, r); s.uniforms.ovSH = light.sh; s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vOvPos;').replace('#include <project_vertex>', '#include <project_vertex>\n\tvOvPos = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;'); s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\n' + D_PARS).replace('#include <lights_fragment_begin>', D_BEGIN).replace('#include <lights_fragment_maps>', D_MAPS); };
    m.customProgramCacheKey = () => 'ovDyn' + key;
  }
}

export async function createWorld({ host, state, touch = false, els, onStation, onProgress = () => {} }) {
  const t0 = performance.now(), bytes = { n: 0 };
  const prefs = Object.assign({ quality: touch ? 'low' : 'high', fov: 62, sens: 1, view: 'third', captions: true, motion: !matchMedia('(prefers-reduced-motion: reduce)').matches, diag: false }, state.game.prefs || {}); state.game.prefs = prefs;
  const Q = () => ({ high: { dpr: 2, shadow: 4096, lm: 'lightmap.jpg', mirror: 1024, aniso: 8 }, medium: { dpr: 1.5, shadow: 2048, lm: 'lightmap.jpg', mirror: 512, aniso: 4 }, low: { dpr: 1, shadow: 1024, lm: 'lightmap-2k.jpg', mirror: 0, aniso: 2 } })[prefs.quality];
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); renderer.setPixelRatio(Math.min(devicePixelRatio || 1, Q().dpr));
  renderer.toneMapping = THREE.AgXToneMapping; renderer.toneMappingExposure = EXPOSURE; renderer.localClippingEnabled = true; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; host.appendChild(renderer.domElement);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(prefs.fov, 1, 0.08, 400);
  const size = () => { const w = host.clientWidth || 1, h = host.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }; const ro = new ResizeObserver(size); ro.observe(host); size();
  const get = async (p) => { const r = await fetch(A(p)); const b = await r.arrayBuffer(); bytes.n += b.byteLength; return b; };
  const parse = (buf) => new Promise((res, rej) => loader().parse(buf, A('level/'), res, rej));

  // ------------------------------------------------------------------ load
  onProgress('Loading the building', 0.05);
  const [levelBuf, archBuf, skyBuf, lmBlob] = await Promise.all([get('level/level.json'), get('level/institute.glb'), get('level/sky.hdr'), get('level/' + Q().lm)]);
  const L = JSON.parse(new TextDecoder().decode(levelBuf)); onProgress('Laying out the rooms', 0.45);
  const lm = await new THREE.ImageBitmapLoader().setOptions({ imageOrientation: 'none', premultiplyAlpha: 'none', colorSpaceConversion: 'none' }).loadAsync(URL.createObjectURL(new Blob([lmBlob], { type: 'image/jpeg' }))).then((bmp) => { const t = new THREE.CanvasTexture(bmp); t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.channel = 1; t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; return t; });
  const skyData = new RGBELoader().setDataType(THREE.FloatType).parse(skyBuf); for (let i = 0, d = skyData.data; i < d.length; i++) if (d[i] > 48) d[i] = 48;      // keep the sun a bright disc, not a spike that speckles every reflection
  const sky = new THREE.DataTexture(skyData.data, skyData.width, skyData.height, THREE.RGBAFormat, THREE.FloatType); sky.mapping = THREE.EquirectangularReflectionMapping; sky.colorSpace = THREE.LinearSRGBColorSpace; sky.minFilter = THREE.LinearFilter; sky.magFilter = THREE.LinearFilter; sky.flipY = true; sky.needsUpdate = true;
  const pmrem = new THREE.PMREMGenerator(renderer), skyEnv = pmrem.fromEquirectangular(sky).texture;
  scene.background = sky; scene.backgroundIntensity = L.sky; scene.environment = skyEnv; scene.environmentIntensity = L.sky; scene.fog = new THREE.Fog(0xcdd9e6, 70, 260);

  // ------------------------------------------------------------------ rooms
  const rooms = Object.entries(L.rooms).map(([name, r]) => ({ name, ...r, exposure: EXPO[name] ?? r.exposure, cx: (r.x0 + r.x1) / 2, cz: (r.z0 + r.z1) / 2, top: r.h || 30 }));
  const order = ['gallery', 'regional', 'preop', 'or', 'studio', 'arrival', 'court', 'forecourt'].map((n) => rooms.find((r) => r.name === n));
  const roomAt = (x, y, z, pad = 0.05) => { for (const r of order) if (x >= r.x0 - pad && x <= r.x1 + pad && z >= r.z0 - pad && z <= r.z1 + pad && y <= r.top + 0.35) return r.name; return 'outside'; };
  const boxes = {}; for (const r of rooms) if (r.h) boxes[r.name] = { min: new THREE.Vector3(r.x0, 0, r.z0), max: new THREE.Vector3(r.x1, r.h, r.z1), at: new THREE.Vector3(r.cx, Math.min(r.h * 0.5, 1.7), r.cz), env: null };
  // ------------------------------------------------------------------ the building, split by room so each part reflects its own room
  const arch = await parse(archBuf), statics = [], roomMats = {}; const va = new THREE.Vector3(), vb = new THREE.Vector3(), vc = new THREE.Vector3(), vn = new THREE.Vector3();
  arch.scene.updateMatrixWorld(true);
  arch.scene.traverse((o) => {
    if (!o.isMesh) return; const g = o.geometry; g.applyMatrix4(o.matrixWorld); const pos = g.attributes.position, nor = g.attributes.normal, idx = g.index.array, bucket = {};
    for (let i = 0; i < idx.length; i += 3) { va.fromBufferAttribute(pos, idx[i]); vb.fromBufferAttribute(pos, idx[i + 1]); vc.fromBufferAttribute(pos, idx[i + 2]); vn.fromBufferAttribute(nor, idx[i]);
      const k = roomAt((va.x + vb.x + vc.x) / 3 + vn.x * 0.35, (va.y + vb.y + vc.y) / 3 + vn.y * 0.35, (va.z + vb.z + vc.z) / 3 + vn.z * 0.35); (bucket[k] ||= []).push(idx[i], idx[i + 1], idx[i + 2]); }
    const src = o.material; if (src.map) { src.map.anisotropy = Q().aniso; } if (src.roughnessMap && src.userData.rough_mul) src.roughness = src.userData.rough_mul; src.normalScale && src.normalMap && src.normalScale.multiplyScalar(1);
    for (const [k, ids] of Object.entries(bucket)) {
      const geo = new THREE.BufferGeometry(); for (const n of Object.keys(g.attributes)) geo.setAttribute(n, g.attributes[n]); geo.setIndex(ids); const bb = new THREE.Box3(); for (const i of ids) bb.expandByPoint(va.fromBufferAttribute(pos, i)); geo.boundingBox = bb; geo.boundingSphere = bb.getBoundingSphere(new THREE.Sphere());
      const m = src.clone(); m.userData = { ...src.userData, env: SHEEN[src.name] ?? 1 }; m.lightMap = lm; m.lightMapIntensity = LM_RANGE * Math.PI; m.envMapIntensity = 0; m.dithering = true; patchStatic(m, boxes[k]); (roomMats[k] ||= []).push(m);
      const mesh = new THREE.Mesh(geo, m); mesh.castShadow = true; mesh.receiveShadow = true; mesh.userData.room = k; mesh.matrixAutoUpdate = false; scene.add(mesh); statics.push(mesh);
    }
  });
  // the ground outside: drawn here so that it takes no room in the lightmap
  const groundLight = newLight(), ground = new THREE.Mesh(new THREE.PlaneGeometry(520, 520), new THREE.MeshStandardMaterial({ color: 0xb9b4a9, roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.302; ground.receiveShadow = true; patchDynamic([ground.material], groundLight); scene.add(ground);

  // ------------------------------------------------------------------ probes for things that move
  const probes = {}; for (const p of L.probes) (probes[p.room] ||= []).push({ p: new THREE.Vector3(...p.p), c: p.c });
  const tmp27 = new Float32Array(27);
  /** Blend the nearest probes of a room at a point into `light`. `rate` < 1 eases toward it (used for the walker). */
  function lightAt(light, pos, room, rate = 1) {
    const list = probes[room] || probes.court; let best = []; for (const pr of list) { const d = pr.p.distanceToSquared(pos); if (best.length < 4 || d < best[best.length - 1][0]) { best.push([d, pr]); best.sort((a, b) => a[0] - b[0]); if (best.length > 4) best.pop(); } }
    tmp27.fill(0); let W = 0; for (const [d, pr] of best) { const w = 1 / (d + 0.08); W += w; for (let i = 0; i < 27; i++) tmp27[i] += pr.c[i] * w; }
    const v = light.sh.value; for (let i = 0; i < 9; i++) { const x = tmp27[i * 3] / W, y = tmp27[i * 3 + 1] / W, z = tmp27[i * 3 + 2] / W; v[i].x += (x - v[i].x) * rate; v[i].y += (y - v[i].y) * rate; v[i].z += (z - v[i].z) * rate; }
  }
  lightAt(groundLight, new THREE.Vector3(0, 1, 9), 'forecourt');
  function litCopy(root, at, room) { const light = newLight(); lightAt(light, at, room); const mats = []; root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.material = Array.isArray(o.material) ? o.material.map((m) => m.clone()) : o.material.clone(); for (const m of [].concat(o.material)) mats.push(m); } }); patchDynamic(mats, light); for (const m of mats) m.userData.room = room; return { light, mats }; }
  const dynMats = [];      // every probe-lit material, so room reflections can be attached once they exist

  // ------------------------------------------------------------------ sun, with one shadow map over the whole level
  const sunDir = new THREE.Vector3(...L.sunDir).normalize(), sun = new THREE.DirectionalLight(new THREE.Color(...L.sunColor), L.sun * Math.PI * SUN_GAIN), mid = new THREE.Vector3(0, 2, (SUN.zMin + SUN.zMax) / 2);
  sun.position.copy(mid).addScaledVector(sunDir, 90); sun.target.position.copy(mid); sun.castShadow = true; sun.shadow.mapSize.set(Q().shadow, Q().shadow); sun.shadow.bias = -0.00025; sun.shadow.normalBias = 0.035; scene.add(sun, sun.target);
  { const view = new THREE.Matrix4().lookAt(sun.position, mid, new THREE.Vector3(0, 1, 0)).setPosition(sun.position).invert(), bb = new THREE.Box3(), p = new THREE.Vector3();
    for (const x of [-SUN.x, SUN.x]) for (const y of [-0.6, 8.2]) for (const z of [SUN.zMin, SUN.zMax]) bb.expandByPoint(p.set(x, y, z).applyMatrix4(view));
    Object.assign(sun.shadow.camera, { left: bb.min.x, right: bb.max.x, bottom: bb.min.y, top: bb.max.y, near: -bb.max.z - 2, far: -bb.min.z + 2 }); sun.shadow.camera.updateProjectionMatrix(); }
  // the gallery's exhibit spots: they light specimens and people; the building already has them baked in
  for (const [i, l] of L.lamps.entries()) { const s = new THREE.SpotLight(new THREE.Color(...l.color), l.power / (4 * Math.PI), 14, THREE.MathUtils.degToRad(l.angle / 2), l.blend, 2); s.position.set(...l.at); s.target.position.set(...l.to);
    if (i === 0 && prefs.quality !== 'low') { s.castShadow = true; s.shadow.mapSize.set(1024, 1024); s.shadow.bias = -0.0004; s.shadow.camera.near = 0.4; s.shadow.camera.far = 6; } scene.add(s, s.target); }

  // ------------------------------------------------------------------ glass, water, signs
  const glassMat = { clear: new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, roughness: 0.02, metalness: 0, depthWrite: false, envMapIntensity: 1.2 }), smoked: new THREE.MeshPhysicalMaterial({ color: 0x59636a, transparent: true, opacity: 0.38, roughness: 0.03, depthWrite: false, envMapIntensity: 1.4 }), roof: new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.04, roughness: 0.02, depthWrite: false, envMapIntensity: 0.6 }) };
  for (const g of L.glass) { const m = new THREE.Mesh(new THREE.BoxGeometry(Math.abs(g[3] - g[0]), Math.abs(g[4] - g[1]), Math.abs(g[5] - g[2])), glassMat[g[6]] || glassMat.clear); m.position.set((g[0] + g[3]) / 2, (g[1] + g[4]) / 2, (g[2] + g[5]) / 2); m.renderOrder = 3; scene.add(m); }
  const water = { mesh: null, time: { value: 0 } };
  { const [x0, z0, x1, z1, y] = L.pool, geo = new THREE.PlaneGeometry(x1 - x0, z1 - z0);
    if (Q().mirror) { water.mesh = new Reflector(geo, { textureWidth: Q().mirror, textureHeight: Q().mirror, clipBias: 0.003, shader: { uniforms: { color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null }, time: water.time },
      vertexShader: 'uniform mat4 textureMatrix; varying vec4 vUv; varying vec3 vW; void main(){ vUv = textureMatrix * vec4( position, 1.0 ); vW = ( modelMatrix * vec4( position, 1.0 ) ).xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }',
      fragmentShader: `uniform sampler2D tDiffuse; uniform float time; varying vec4 vUv; varying vec3 vW;
        void main(){ vec2 p = vW.xz; vec2 n = vec2( sin( p.x * 2.1 + time * 0.7 ) + sin( p.y * 3.3 - time * 0.9 ) + sin( ( p.x + p.y ) * 5.7 + time * 1.3 ) * 0.5, cos( p.y * 2.4 + time * 0.6 ) + cos( p.x * 3.9 + time * 1.1 ) + cos( ( p.x - p.y ) * 6.1 - time * 1.2 ) * 0.5 ) * 0.0035;
          vec3 refl = texture2D( tDiffuse, vUv.xy / vUv.w + n ).rgb; vec3 v = normalize( cameraPosition - vW ); float f = 0.04 + 0.96 * pow( 1.0 - max( v.y, 0.0 ), 5.0 );
          gl_FragColor = vec4( mix( vec3( 0.012, 0.022, 0.026 ), refl, clamp( f * 1.5 + 0.12, 0.0, 1.0 ) ), 1.0 );
#include <tonemapping_fragment>
#include <colorspace_fragment>
}` } }); }
    else water.mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x0b1418, roughness: 0.06, metalness: 0, envMapIntensity: 1.6 }));
    water.mesh.rotation.x = -Math.PI / 2; water.mesh.position.set((x0 + x1) / 2, y, (z0 + z1) / 2); scene.add(water.mesh); }
  const signs = {}; const signLight = newLight(); lightAt(signLight, new THREE.Vector3(6, 2, 5), 'forecourt');
  async function addSign(s) {
    const g = new THREE.PlaneGeometry(s.w, s.h); let m;
    if (s.style === 'plate') m = new THREE.MeshBasicMaterial({ map: await plateTexture(s.text, s.w, s.h), transparent: true, toneMapped: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    else if (s.style === 'wordmark') { m = new THREE.MeshStandardMaterial({ alphaMap: await wordmarkTexture(), color: 0xd9ab63, metalness: 1, roughness: 0.32, transparent: true, alphaTest: 0.35, envMapIntensity: 1.1 }); patchDynamic([m], signLight); }
    else m = new THREE.MeshBasicMaterial({ color: 0x0b0d10, toneMapped: true });
    const mesh = new THREE.Mesh(g, m); mesh.position.set(...s.at); mesh.rotation.y = Math.atan2(s.face[0], s.face[1]); mesh.renderOrder = 2; scene.add(mesh); signs[s.style === 'plate' ? 'plate:' + s.text : s.style] = mesh; return mesh;
  }
  await Promise.all(L.signs.map(addSign));
  /** Put a drawing on one of the level's screens (the lightbox, the regional display, the case rail). */
  function setScreen(name, texture, { glow = 1 } = {}) { const m = signs[name]; if (!m) return; if (m.material.map && m.material.map !== texture) m.material.map.dispose(); m.material.dispose(); m.material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: true, color: new THREE.Color(glow, glow, glow), polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }); }

  // ------------------------------------------------------------------ stations: where something can be opened
  const stations = Object.entries(L.stations).map(([key, s]) => ({ key, ...s, pos: new THREE.Vector3(s.at[0], 0, s.at[1]), room: roomAt(s.at[0], 1, s.at[1]) }));
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xcf9f58, metalness: 1, roughness: 0.36, envMapIntensity: 1 }), pulseMat = new THREE.MeshBasicMaterial({ color: 0xff5a3c, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
  for (const s of stations) { const r = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.325, 72), ringMat); r.rotation.x = -Math.PI / 2; r.position.set(s.pos.x, 0.0045, s.pos.z); r.receiveShadow = true; scene.add(r);
    s.pulse = new THREE.Mesh(new THREE.RingGeometry(0.36, 0.375, 72), pulseMat.clone()); s.pulse.rotation.x = -Math.PI / 2; s.pulse.position.set(s.pos.x, 0.006, s.pos.z); scene.add(s.pulse); }

  // ------------------------------------------------------------------ the walker
  const P = { x: L.spawn.x, z: L.spawn.z, yaw: Math.PI - L.spawn.yaw, speed: 0, room: 'forecourt', vx: 0, vz: 0 };   // yaw: the way the body faces; 0 looks toward +z (south), pi toward the building
  const cam = { yaw: P.yaw, pitch: -0.1, dist: prefs.view === 'first' ? 0 : 3.3, cur: 3.3, glide: null, free: true };
  if (state.game.pos && Number.isFinite(state.game.pos.x)) { P.x = state.game.pos.x; P.z = state.game.pos.z; P.yaw = state.game.pos.yaw || 0; cam.yaw = P.yaw; }
  const walker = { light: newLight(), person: null, shadow: null };
  async function setPerson(look) { const old = walker.person; const p = await loadPerson(look.person, { colour: look.colour, light: (mats) => { patchDynamic(mats, walker.light); for (const m of mats) { m.userData.walker = true; dynMats.push(m); } } });
    if (old) { scene.remove(old.root); old.dispose(); } walker.person = p; scene.add(p.root); p.onStep = () => sound.footstep(rooms.find((r) => r.name === P.room)?.floor || 'stone'); applyEnv(); }
  const blob = new THREE.Mesh(new THREE.CircleGeometry(0.34, 32), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false, map: drawTexture(64, 64, (g) => { const r = g.createRadialGradient(32, 32, 2, 32, 32, 31); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); }) }));
  blob.material.alphaMap = blob.material.map; blob.material.map = null; blob.rotation.x = -Math.PI / 2; blob.position.y = 0.007; blob.renderOrder = 1; scene.add(blob);
  const cols = L.colliders.filter((c) => c[4] < 1.7 && c[5] > 0.06).concat([[-2.3, 15.3, 2.3, 15.9, 0, 2]]);      // plus the forecourt's open side
  function collide(x, z, r = 0.27) { for (let it = 0; it < 3; it++) for (const c of cols) { const nx = Math.max(c[0], Math.min(x, c[2])), nz = Math.max(c[1], Math.min(z, c[3])), dx = x - nx, dz = z - nz, d2 = dx * dx + dz * dz;
      if (d2 < r * r) { if (d2 > 1e-8) { const d = Math.sqrt(d2); x = nx + dx / d * r; z = nz + dz / d * r; } else { const l = x - c[0], rr = c[2] - x, t = z - c[1], b = c[3] - z, m = Math.min(l, rr, t, b); if (m === l) x = c[0] - r; else if (m === rr) x = c[2] + r; else if (m === t) z = c[1] - r; else z = c[3] + r; } } }
    return [x, z]; }
  const blocked = (x, y, z, pad = 0.16) => { for (const c of L.colliders) if (x > c[0] - pad && x < c[2] + pad && z > c[1] - pad && z < c[3] + pad && y > c[4] - pad && y < c[5] + pad) return true; return false; };

  // ------------------------------------------------------------------ input
  const keys = new Set(), el = renderer.domElement; let drag = null, moveTo = null, stick = { x: 0, y: 0 }, enabled = true, near = null;
  const onKey = (e) => { const k = (e.key || '').toLowerCase(), down = e.type === 'keydown'; if (e.target.closest && e.target.closest('input, textarea, select')) { if (!down) keys.delete(k); return; }      /* typing is not walking; a key let go while typing is still let go */
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift'].includes(k)) { down ? keys.add(k) : keys.delete(k); if (down) moveTo = null; e.preventDefault(); }
    if (down && (k === 'e' || k === 'enter') && near && enabled) { e.preventDefault(); use(near); } if (down && k === 'v' && enabled) api.setPref('view', prefs.view === 'first' ? 'third' : 'first'); };
  addEventListener('keydown', onKey); addEventListener('keyup', onKey); addEventListener('blur', () => keys.clear());
  el.addEventListener('pointerdown', (e) => { if (!enabled) return; drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now(), id: e.pointerId }; el.setPointerCapture(e.pointerId); });
  el.addEventListener('pointermove', (e) => { if (!drag || drag.id !== e.pointerId || !enabled) return; const k = 0.0042 * prefs.sens * (touch ? 1.5 : 1); cam.yaw -= (e.clientX - drag.x) * k; cam.pitch = THREE.MathUtils.clamp(cam.pitch - (e.clientY - drag.y) * k, -1.0, 0.75); drag.x = e.clientX; drag.y = e.clientY; });
  el.addEventListener('pointerup', (e) => { if (!drag) return; const still = Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6 && performance.now() - drag.t < 450; drag = null; if (!still || !enabled) return;
    const r = el.getBoundingClientRect(), ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), camera);
    const t = -ray.ray.origin.y / ray.ray.direction.y; if (t > 0 && t < 40) { const p = ray.ray.origin.clone().addScaledVector(ray.ray.direction, t); const s = stations.find((q) => q.pos.distanceTo(p) < 0.9); moveTo = { x: s ? s.pos.x : p.x, z: s ? s.pos.z : p.z, then: s || null, t: 0 }; } });
  el.addEventListener('wheel', (e) => { if (!enabled) return; e.preventDefault(); cam.dist = THREE.MathUtils.clamp(cam.dist + e.deltaY * 0.003, 0, 4.6); prefs.view = cam.dist < 0.5 ? 'first' : 'third'; }, { passive: false });
  if (els.stick) { const k = els.stick.firstElementChild; let id = null; const set = (e) => { const r = els.stick.getBoundingClientRect(); let x = (e.clientX - r.left - r.width / 2) / (r.width / 2), y = (e.clientY - r.top - r.height / 2) / (r.height / 2); const m = Math.hypot(x, y); if (m > 1) { x /= m; y /= m; } stick = { x, y }; k.style.transform = `translate(${x * 34}px, ${y * 34}px)`; };
    els.stick.addEventListener('pointerdown', (e) => { id = e.pointerId; els.stick.setPointerCapture(id); moveTo = null; set(e); }); els.stick.addEventListener('pointermove', (e) => { if (e.pointerId === id) set(e); });
    const end = () => { id = null; stick = { x: 0, y: 0 }; k.style.transform = ''; }; els.stick.addEventListener('pointerup', end); els.stick.addEventListener('pointercancel', end); }
  if (els.act) els.act.addEventListener('click', () => near && enabled && use(near));
  if (els.prompt) els.prompt.addEventListener('click', () => near && enabled && use(near));

  // ------------------------------------------------------------------ using a station: the camera settles on it, then main.js opens it
  let invited = null, hideWalker = false;
  function use(s) { if (!enabled) return; enabled = false; moveTo = null; keys.clear(); els.prompt && els.prompt.classList.remove('on'); sound.sfx('tap');
    const eye = new THREE.Vector3(s.pos.x, 1.52, s.pos.z), look = new THREE.Vector3(...s.look); P.yaw = Math.atan2(look.x - s.pos.x, look.z - s.pos.z);      // a station may name its own viewpoint (`eye`, `fov`): a bedside, not the ring you walked to
    let from = s.eye ? new THREE.Vector3(...s.eye) : eye.clone().lerp(look, 0.12), to = look;
    if (matchMedia('(max-width: 820px)').matches) { const d = from.distanceTo(look) * 1.3; from = look.clone().add(from.sub(look).setLength(d)); to = look.clone(); to.y -= 0.5 * d * Math.tan(THREE.MathUtils.degToRad((s.fov || 46) / 2)); }      // on a narrow screen the panel covers the lower half: stand back a little and aim lower, so the subject sits in the half that is left
    glideTo(from, to, s.fov || 46, prefs.motion ? 0.85 : 0, () => onStation && onStation(s.key, api)); }
  function glideTo(pos, look, fov, seconds, done) { if (seconds <= 0) { camera.position.copy(pos); camera.lookAt(look); camera.fov = fov; camera.updateProjectionMatrix(); cam.glide = { hold: true, look: look.clone() }; done && done(); return; }
    cam.glide = { p0: camera.position.clone(), q0: camera.quaternion.clone(), f0: camera.fov, p1: pos, q1: new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(pos, look, camera.up)), f1: fov, t: 0, dur: seconds, done, look: look.clone() }; }

  // ------------------------------------------------------------------ reflections: one cube per room, captured once the scene is whole
  function applyEnv() { for (const m of dynMats) { const b = boxes[m.userData.walker ? P.room : m.userData.room]; m.envMap = b && b.env ? b.env : skyEnv; m.envMapIntensity = m.userData.walker ? 0.35 : (m.userData.envI ?? 0.8); } }
  function captureRooms() {
    for (const q of placed) q.root.visible = true; viewRoom = null;
    const rt = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType }), cc = new THREE.CubeCamera(0.05, 120, rt), hide = [walker.person?.root, blob, water.mesh].filter(Boolean); for (const h of hide) h.visible = false;
    for (const [name, b] of Object.entries(boxes)) { cc.position.copy(b.at); cc.update(renderer, scene); b.env && b.env.dispose(); b.env = pmrem.fromCubemap(rt.texture).texture; }
    for (const h of hide) h.visible = true; rt.dispose();
    for (const [name, list] of Object.entries(roomMats)) for (const m of list) { const b = boxes[name]; m.envMap = b ? b.env : skyEnv; m.envMapIntensity = b ? m.userData.env : L.sky; m.needsUpdate = true; }
    for (const k of Object.keys(glassMat)) { glassMat[k].envMap = k === 'roof' ? skyEnv : (boxes.court.env || skyEnv); glassMat[k].needsUpdate = true; } ringMat.envMap = boxes.court.env; ringMat.needsUpdate = true; applyEnv();
  }

  // ------------------------------------------------------------------ things placed in the level
  /** Add a model (already loaded) at a spot, lit by the probes there. Returns { root, light, mats }. */
  const placed = [], SEES = { forecourt: ['forecourt', 'arrival', 'court', 'outside'], arrival: ['forecourt', 'arrival', 'court', 'gallery', 'outside'], court: ['arrival', 'court', 'gallery', 'or', 'regional', 'preop', 'studio', 'forecourt', 'outside'], gallery: ['gallery', 'court'], or: ['or', 'court'], regional: ['regional', 'court', 'outside'], preop: ['preop', 'court'], studio: ['studio', 'court', 'outside'], outside: ['forecourt', 'arrival', 'court', 'outside'] };
  let viewRoom = null; const showFor = (r) => { viewRoom = r; const ok = SEES[r] || SEES.court; for (const q of placed) q.root.visible = ok.includes(q.room); };      // things in rooms you cannot see from here are not drawn
  function place(root, { at, room = null, envI = 0.8, shadow = true }) { const r = room || roomAt(at.x, at.y, at.z), lit = litCopy(root, at, r); for (const m of lit.mats) { m.userData.envI = envI; dynMats.push(m); } root.traverse((o) => { if (o.isMesh) { o.castShadow = shadow && prefs.quality !== 'low'; } }); scene.add(root); placed.push({ root, room: r, light: lit.light, mats: lit.mats });      /* lower cost: only the building and you cast sun shadows */ if (viewRoom) root.visible = (SEES[viewRoom] || SEES.court).includes(r); applyEnv(); return { root, ...lit }; }
  async function loadModel(path) { const g = await parse(await get(path)); return g; }
  /** Carry something already placed to another spot (a patient from a bay to the table): it takes the light and the reflections of where it now is. */
  function move(root, { at, room = null }) { const q = placed.find((p) => p.root === root); if (!q) return false; q.room = room || roomAt(at.x, at.y, at.z); if (q.light) lightAt(q.light, at, q.room); for (const m of q.mats || []) m.userData.room = q.room; if (viewRoom) root.visible = (SEES[viewRoom] || SEES.court).includes(q.room); applyEnv(); return true; }
  /** Take something out of the level for good and free what it held (never a room's shared reflection). */
  function unplace(root) { const i = placed.findIndex((p) => p.root === root); if (i < 0) return; const q = placed.splice(i, 1)[0], mine = new Set(q.mats || []); scene.remove(root); for (let k = dynMats.length - 1; k >= 0; k--) if (mine.has(dynMats[k])) dynMats.splice(k, 1);
    root.traverse((o) => { if (!o.isMesh) return; o.geometry.dispose(); for (const m of [].concat(o.material)) { for (const [k, v] of Object.entries(m)) if (k !== 'envMap' && v && v.isTexture) v.dispose(); m.dispose(); } }); }
  (async () => {     // furniture arrives after the first frame
    try { const g = await loadModel('level/props.glb'); const kids = [...g.scene.children]; for (const k of kids) { k.updateMatrixWorld(true); const c = new THREE.Box3().setFromObject(k).getCenter(new THREE.Vector3()); place(k, { at: c, envI: 0.6, shadow: Math.abs(c.x) < (c.z > SUN.zSplit ? SUN.x : SUN.xCourt) && c.z > SUN.zMin }); } captureRooms(); } catch (e) { console.warn('props', e); }
  })();

  // ------------------------------------------------------------------ frame
  const clock = new THREE.Clock(); let running = false, raf = 0, exposure = EXPOSURE, saveT = 0, frame = 0; const times = []; let lastRoom = null, pulseT = 0;
  const head = new THREE.Vector3(), want = new THREE.Vector3(), dir = new THREE.Vector3(), tmpV = new THREE.Vector3();
  function step(dt) {
    // --- move
    let ix = 0, iz = 0; if (enabled && !cam.glide) { if (keys.has('w') || keys.has('arrowup')) iz += 1; if (keys.has('s') || keys.has('arrowdown')) iz -= 1; if (keys.has('a') || keys.has('arrowleft')) ix -= 1; if (keys.has('d') || keys.has('arrowright')) ix += 1; ix += stick.x; iz -= stick.y; }
    let wx = 0, wz = 0, top = keys.has('shift') ? 1.15 : 2.05;
    if (ix || iz) { const m = Math.min(1, Math.hypot(ix, iz)), a = Math.atan2(ix, iz), f = cam.yaw - a; wx = Math.sin(f) * m; wz = Math.cos(f) * m; }
    else if (moveTo && enabled) { const dx = moveTo.x - P.x, dz = moveTo.z - P.z, d = Math.hypot(dx, dz); moveTo.t += dt; if (d < 0.12 || moveTo.t > 14) { const s = moveTo.then; moveTo = null; if (s && d < 0.5) use(s); } else { const m = Math.min(1, d / 0.7 + 0.25); wx = dx / d * m; wz = dz / d * m; } }
    const acc = Math.min(1, dt * 7.5); P.vx += (wx * top - P.vx) * acc; P.vz += (wz * top - P.vz) * acc;
    const ox = P.x, oz = P.z; let [nx, nz] = collide(P.x + P.vx * dt, P.z + P.vz * dt); nx = THREE.MathUtils.clamp(nx, L.bounds[0] + 1, L.bounds[2] - 1); nz = THREE.MathUtils.clamp(nz, L.bounds[1] + 1, L.bounds[3] - 1); P.x = nx; P.z = nz;
    P.speed = Math.hypot(P.x - ox, P.z - oz) / Math.max(dt, 1e-4); if (moveTo && P.speed < 0.15 && moveTo.t > 0.6) { moveTo.stuck = (moveTo.stuck || 0) + dt; if (moveTo.stuck > 0.5) moveTo = null; }
    if (P.speed > 0.2) { let d = Math.atan2(P.x - ox, P.z - oz) - P.yaw; d = Math.atan2(Math.sin(d), Math.cos(d)); P.yaw += d * Math.min(1, dt * 10); }
    P.room = roomAt(P.x, 1, P.z, 0.25); if (P.room === 'outside') P.room = lastRoom || 'forecourt';
    if (P.room !== lastRoom) { lastRoom = P.room; applyEnv(); sound.room(P.room, rooms.find((r) => r.name === P.room)?.floor); api.onRoom && api.onRoom(P.room); }
    // --- the person
    const pr = walker.person; if (pr) { pr.root.position.set(P.x, 0, P.z); pr.root.rotation.y = P.yaw; pr.update(dt, P.speed); lightAt(walker.light, tmpV.set(P.x, 1.1, P.z), P.room, Math.min(1, dt * 5)); { const c0 = walker.light.sh.value[0]; c0.x = Math.max(c0.x, 0.11); c0.y = Math.max(c0.y, 0.11); c0.z = Math.max(c0.z, 0.115); }   /* your own figure never falls to a silhouette */ pr.root.visible = !hideWalker && (cam.cur > 0.55 || !!cam.glide); }
    blob.position.x = P.x; blob.position.z = P.z; blob.visible = !hideWalker && (!pr || pr.root.visible);
    // --- the camera
    if (cam.glide && !cam.glide.hold) { const g = cam.glide; g.t = Math.min(1, g.t + dt / g.dur); const k = g.t * g.t * (3 - 2 * g.t); camera.position.lerpVectors(g.p0, g.p1, k); camera.quaternion.slerpQuaternions(g.q0, g.q1, k); camera.fov = g.f0 + (g.f1 - g.f0) * k; camera.updateProjectionMatrix(); if (g.t >= 1) { const d = g.done; g.hold = true; g.done = null; d && d(); } }
    else if (!cam.glide) {
      const eye = (pr ? pr.height : 1.74) - 0.14; head.set(P.x, eye, P.z); dir.set(Math.sin(cam.yaw) * Math.cos(cam.pitch), Math.sin(cam.pitch), Math.cos(cam.yaw) * Math.cos(cam.pitch));
      let d = cam.dist; if (d > 0.5) { const sh = Math.min(0.55, 0.2 * cam.cur); head.x += Math.cos(cam.yaw) * -sh; head.z += Math.sin(cam.yaw) * sh; head.y += 0.02;      /* the walker stands left of centre, so the way ahead stays in view */ const room = rooms.find((r) => r.name === P.room), ceil = (room && room.h ? room.h : 30) - 0.25;
        for (let s = 0.3; s <= cam.dist; s += 0.12) { want.copy(head).addScaledVector(dir, -s); if (blocked(want.x, want.y, want.z) || want.y > ceil || want.y < 0.25 || roomAt(want.x, want.y, want.z, 0.1) === 'outside') { d = Math.max(0.3, s - 0.22); break; } } }
      cam.cur += (d - cam.cur) * Math.min(1, dt * (d < cam.cur ? 16 : 5)); camera.position.copy(head).addScaledVector(dir, -cam.cur); camera.lookAt(tmpV.copy(head).addScaledVector(dir, 4));
      if (Math.abs(camera.fov - prefs.fov) > 0.01) { camera.fov += (prefs.fov - camera.fov) * Math.min(1, dt * 6); camera.updateProjectionMatrix(); }
    }
    // --- what can be opened from here
    near = null; if (enabled && !cam.glide) { let best = 2.3; for (const s of stations) { if (s.room !== P.room && !(s.room === 'court' && P.room === 'court')) continue; const d = s.pos.distanceTo(tmpV.set(P.x, 0, P.z)); if (d < best) { best = d; near = s; } } }
    if (els.prompt) { els.prompt.classList.toggle('on', !!near); if (near && els.prompt.dataset.key !== near.key) { els.prompt.dataset.key = near.key; els.prompt.innerHTML = `<kbd>${touch ? 'Tap' : 'E'}</kbd><span>${near.label}</span>`; } }
    pulseT += dt; for (const s of stations) { const on = invited === s.key; s.pulse.material.opacity += ((on ? (prefs.motion ? 0.55 + 0.35 * Math.sin(pulseT * 2.2) : 0.8) : 0) - s.pulse.material.opacity) * Math.min(1, dt * 4); s.pulse.visible = s.pulse.material.opacity > 0.01; if (on && prefs.motion) s.pulse.scale.setScalar(1 + 0.05 * Math.sin(pulseT * 2.2)); }
    // --- exposure follows the room, slowly, the way eyes do
    const er = rooms.find((r) => r.name === (cam.glide ? roomAt(camera.position.x, camera.position.y, camera.position.z, 0.3) : P.room)); exposure += (EXPOSURE * (er ? er.exposure : 1) - exposure) * Math.min(1, dt * 1.6); renderer.toneMappingExposure = exposure;
    { const vr = roomAt(camera.position.x, camera.position.y, camera.position.z, 0.3); if (vr !== viewRoom) showFor(vr); }
    water.time.value += dt; sound.listen({ x: P.x, z: P.z, room: P.room, pool: L.pool, dt }); api.onFrame && api.onFrame(dt);
    saveT += dt; if (saveT > 4 && enabled) { saveT = 0; state.game.pos = { x: +P.x.toFixed(2), z: +P.z.toFixed(2), yaw: +P.yaw.toFixed(2) }; }
  }
  function loop() { if (!running) return; raf = requestAnimationFrame(loop); const t = performance.now(), dt = Math.min(clock.getDelta(), 0.05); step(dt); renderer.render(scene, camera); frame++; times.push(performance.now() - t); if (times.length > 240) times.shift();
    if (prefs.diag && els.diag && frame % 20 === 0) { const s = api.stats(); els.diag.textContent = `${s.fps} fps · ${s.cpuMs} ms cpu · ${s.calls} calls · ${(s.tris / 1000).toFixed(0)}k tris · ${renderer.domElement.width}×${renderer.domElement.height}`; } }
  let fpsT = performance.now(), fpsN = 0, fps = 0; const fpsTick = () => { fpsN++; const n = performance.now(); if (n - fpsT > 1000) { fps = Math.round(fpsN * 1000 / (n - fpsT)); fpsN = 0; fpsT = n; } };
  const VIEWS = {    // fixed camera positions for review screenshots: [eye, look, fov]
    arrival: [[1.1, 1.62, 13.4], [-0.3, 2.3, 0], 60], atrium: [[-2.6, 1.62, -4.6], [0.2, 1.5, -9.9], 50], court: [[2.4, 1.62, -2.2], [-1.2, 2.6, -19], 66], gallery: [[0.9, 1.55, -26.3], [-0.2, 1.4, -28.6], 44],
    regional: [[-5.7, 1.6, -17.5], [-9.2, 1.0, -13.4], 60], bay: [[-7.6, 1.6, -15.6], [-9.3, 1.05, -13.0], 48], oranes: [[9.55, 1.55, -18.7], [7.6, 1.08, -17.3], 46], oreast: [[11.2, 1.62, -13.4], [7.6, 1.1, -16.9], 62], preop: [[-5.6, 1.62, -6.1], [-9.6, 1.0, -7.4], 62], preop2: [[-9.9, 1.6, -5.0], [-6.6, 0.9, -8.6], 60], pool: [[-0.8, 1.62, 12.9], [-5.6, 0.0, 8.4], 62], or: [[5.75, 1.62, -13.75], [9.0, 1.05, -16.3], 66], orwork: [[8.55, 1.6, -18.25], [8.75, 0.95, -15.2], 62], studio: [[5.8, 1.6, -3.8], [8.6, 1.25, -8.3], 62], collection: [[7.6, 1.5, -6.6], [7.6, 1.3, -8.4], 50], portal: [[0.3, 1.62, -17.6], [0, 1.6, -26], 55] };
  const api = {
    renderer, scene, camera, level: L, prefs, place, move, unplace, loadModel, lightAt, newLight, patchDynamic, setScreen, signs, roomAt, stations, P, boxes, dynMats, captureRooms,
    get enabled() { return enabled; }, onRoom: null, onFrame: null,
    async start() { await setPerson(state.character || { person: 'tunic', colour: 'ceil' }); captureRooms(); },
    setPerson, invite(key) { invited = key; },
    /** Register something that lights itself (a rigged person): it is shown and hidden with its room and takes that room's reflections. */
    adopt(root, room, mats) { for (const m of mats) { m.userData.room = room; m.userData.envI = 0.35; dynMats.push(m); } placed.push({ root, room }); applyEnv(); }, addCollider(c) { cols.push(c); L.colliders.push(c); }, get room() { return P.room; }, water,
    resume() { if (running) return; running = true; clock.getDelta(); const tick = () => { if (!running) return; fpsTick(); requestAnimationFrame(tick); }; tick(); loop(); },
    pause() { running = false; cancelAnimationFrame(raf); sound.quiet(); }, keep() { state.game.pos = { x: +P.x.toFixed(2), z: +P.z.toFixed(2), yaw: +P.yaw.toFixed(2) }; },
    /** Give the walker back control after a station closes. */
    release() { cam.glide = null; cam.yaw = P.yaw; cam.pitch = -0.1; enabled = true; hideWalker = false; },
    hold() { enabled = false; },
    /** Stand at a station without walking there (direct study, returning users). */
    teleport(key, facing = true) { const s = stations.find((q) => q.key === key); if (!s) return; P.x = s.pos.x; P.z = s.pos.z; if (facing) { P.yaw = Math.atan2(s.look[0] - s.pos.x, s.look[2] - s.pos.z); cam.yaw = P.yaw; } P.vx = P.vz = 0; lastRoom = null; },
    open(key) { const s = stations.find((q) => q.key === key); if (s) { api.teleport(key); use(s); } },
    /** Put the walker somewhere and face a point (the operating room's working position). */
    standAt(x, z, lookX, lookZ, pitch = -0.12) { P.x = x; P.z = z; P.vx = P.vz = 0; P.yaw = Math.atan2(lookX - x, lookZ - z); cam.glide = null; cam.yaw = P.yaw; cam.pitch = pitch; lastRoom = null; enabled = true; hideWalker = false; },
    /** Hold the camera on one thing (the patient's face, the monitor) while you work; release() or standAt() gives the walker back. */
    view(eye, look, fov = 50, seconds = 0.5) { enabled = false; hideWalker = true; moveTo = null; keys.clear(); glideTo(new THREE.Vector3(...eye), new THREE.Vector3(...look), fov, prefs.motion ? seconds : 0, null); },
    /** A fixed view for screenshots and deterministic capture; `person` places the walker in shot or hides it. */
    bookmark(name, { person = null } = {}) { const v = VIEWS[name]; if (!v) return false; enabled = false; hideWalker = !person; if (person) { P.x = person[0]; P.z = person[1]; P.yaw = person[2] || 0; }
      camera.position.set(...v[0]); camera.lookAt(new THREE.Vector3(...v[1])); camera.fov = v[2]; camera.updateProjectionMatrix(); cam.glide = { hold: true }; const r = rooms.find((q) => q.name === roomAt(v[0][0], v[0][1], v[0][2], 0.3)); exposure = EXPOSURE * (r ? r.exposure : 1); return true; },
    views: Object.keys(VIEWS),
    setPref(k, v) { prefs[k] = v; if (k === 'view') cam.dist = v === 'first' ? 0 : 3.3; if (k === 'quality') { renderer.setPixelRatio(Math.min(devicePixelRatio || 1, Q().dpr)); sun.shadow.mapSize.set(Q().shadow, Q().shadow); sun.shadow.map && sun.shadow.map.dispose(); sun.shadow.map = null; size(); } if (k === 'diag' && els.diag) els.diag.hidden = !v; },
    stats() { const s = [...times].sort((a, b) => a - b), q = (p) => s.length ? +s[Math.min(s.length - 1, Math.floor(s.length * p))].toFixed(2) : 0; return { fps, cpuMs: q(0.5), cpuP95: q(0.95), calls: renderer.info.render.calls, tris: renderer.info.render.triangles, geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures, loadMs: Math.round(api.loadMs), bytes: bytes.n, pixels: [renderer.domElement.width, renderer.domElement.height], quality: prefs.quality }; },
    toast(html, seconds = 5) { if (!els.toast) return; els.toast.innerHTML = html; els.toast.classList.add('on'); clearTimeout(api._tt); api._tt = setTimeout(() => els.toast.classList.remove('on'), seconds * 1000); },
    dispose() { api.pause(); ro.disconnect(); removeEventListener('keydown', onKey); removeEventListener('keyup', onKey); renderer.dispose(); renderer.domElement.remove(); },
  };
  api.loadMs = performance.now() - t0; onProgress('Ready', 1);
  return api;
}
