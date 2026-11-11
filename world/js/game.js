// game.js: the game direction. A floating block island you walk in third person: places to enter, people going about
// their day, field notes to find, a workshop, and a plot that is yours to build on.
//
// SCENE SPEC (what this file is built to)
//   composition  voxel.js lays the island out; the Hall's glass lantern tower is the landmark from everywhere
//   voxels       chunky one-metre blocks with a shaded bevel on every edge, baked corner occlusion, and deliberate
//                colour variation: patchy grass, three bands of rock, pale stone paths
//   lighting     late-afternoon sun from the south-west with soft shadows, cool sky fill, peach haze, a sea of cloud below
//   water        a fountain, a stream, a pond and a waterfall off the east edge, all moving
//   vegetation   broadleaf, blossom and conifer trees, hedges, vines over the rim, grass tufts, flowers, lily pads
//   activity     Booth at the coffee cart, a groundskeeper raking, a reader on a bench, a courier carrying crates,
//                birds round the tower, butterflies, falling petals, chimney smoke, a flag, a wind vane
//   sound        wind, water by distance, birds, footsteps on stone or timber, and a sound for everything you do
//   performance  all blocks in 4 draw calls with hidden faces removed; plants, clouds and far rocks instanced;
//                one fixed shadow map; no post-processing; pixel ratio capped
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { W, D, G, B, SITES, PLOT, LAMPS, BENCHES, PLACEABLE, hash, generate, mesh, castBlock } from './voxel.js';
import { buildAvatar, OPTIONS } from './avatar.js';
import { save, summary, dueNow } from './save.js';
import { FIELD_NOTES, OUTLINE } from '../data/plexus.js';
import { sfx, ambience, quiet } from './audio.js';

const ITEMS = { plank: ['Timber', '#cfa672'], glass: ['Glass', '#bfe3f2'], lamp: ['Lamp', '#ffe9b8'], hedge: ['Hedge', '#4a9a55'], coral: ['Coral', '#ff5a3c'], plexus: ['Plexus sculpture', '#f2cf55'] };
const A = G + 1;

export async function createWorld({ host, state, touch, els, onEnterHall, onLink }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, touch ? 1.5 : 2)); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = false; host.appendChild(renderer.domElement);   // shadows are redrawn every other frame: see loop()
  const scene = new THREE.Scene(), HAZE = new THREE.Color('#f4dec4'); scene.fog = new THREE.Fog(HAZE, 60, 330);
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 900);
  const size = () => { const w = host.clientWidth || 1, h = host.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  new ResizeObserver(size).observe(host); size();
  const uTime = { value: 0 }, v3 = new THREE.Vector3(), CX = 48, CZ = 50;

  // ---------- sky, sun, cloud sea, far rocks ----------
  const SUN = new THREE.Vector3(-0.55, 0.6, 0.58).normalize();
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(700, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, uniforms: { sun: { value: SUN } },
    vertexShader: 'varying vec3 d; void main(){ d = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
    fragmentShader: 'uniform vec3 sun; varying vec3 d; void main(){ float h = d.y; vec3 hor = vec3(.957,.871,.769); vec3 c = h > 0. ? mix(hor, vec3(.33,.63,.90), pow(smoothstep(0., .8, h), .65)) : mix(hor, vec3(.99,.93,.86), smoothstep(0., .5, -h)); float s = max(dot(normalize(d), sun), 0.); c += vec3(1.,.8,.52) * (pow(s, 6.) * .3 + pow(s, 300.) * 1.8); gl_FragColor = vec4(c, 1.); }' })));
  const sun = new THREE.DirectionalLight(0xfff0d2, 3.0); sun.position.copy(SUN).multiplyScalar(150).add(new THREE.Vector3(CX, G, CZ)); sun.target.position.set(CX, G, CZ);
  sun.castShadow = true; sun.shadow.mapSize.set(touch ? 2048 : 4096, touch ? 2048 : 4096); Object.assign(sun.shadow.camera, { left: -64, right: 64, top: 64, bottom: -64, near: 30, far: 320 }); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.05; sun.shadow.radius = 3.2;
  scene.add(sun, sun.target, new THREE.HemisphereLight(0xcde8ff, 0xc9a983, 1.0));
  const NOISE = 'float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); } float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(h1(i), h1(i+vec2(1,0)), f.x), mix(h1(i+vec2(0,1)), h1(i+vec2(1,1)), f.x), f.y); } float fbm(vec2 p){ return vn(p)*.5 + vn(p*2.03)*.25 + vn(p*4.1)*.125 + vn(p*8.3)*.0625; }';
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, fog: false, uniforms: { uTime, haze: { value: HAZE } },
    vertexShader: 'varying vec3 wp; void main(){ vec4 w = modelMatrix * vec4(position, 1.); wp = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `uniform float uTime; uniform vec3 haze; varying vec3 wp; ${NOISE} void main(){ vec2 p = wp.xz * .012 + vec2(uTime * .006, uTime * .003); float n = fbm(p) + .35 * fbm(p * 2.7 - uTime * .004); float a = smoothstep(.42, .78, n); vec3 c = mix(vec3(.93,.86,.80), vec3(1.,.985,.96), smoothstep(.5, .9, n)); float far = smoothstep(260., 900., length(wp.xz - cameraPosition.xz)); gl_FragColor = vec4(mix(c, haze, far), max(a, far) * .96); }` }));
  sea.rotation.x = -Math.PI / 2; sea.position.set(CX, -8, CZ); scene.add(sea);
  { const rock = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#9aa0a6', roughness: 1 }), 90), grass = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#7fbf58', roughness: 1 }), 30), m = new THREE.Matrix4(), q = new THREE.Quaternion(); let n = 0, g = 0; const r = (k) => { const x = Math.sin(k * 91.7) * 43758.5; return x - Math.floor(x); };
    for (let i = 0; i < 10; i++) { const ang = i * 0.63 + r(i) * 0.4, dist = 150 + r(i + 5) * 150, cx = CX + Math.cos(ang) * dist, cz = CZ + Math.sin(ang) * dist, cy = -2 + r(i + 9) * 46, s = 7 + r(i + 3) * 14;
      for (let k = 0; k < 9 && n < 90; k++) { const w = s * (1 - k * 0.1), hh = s * 0.5; m.compose(new THREE.Vector3(cx + (r(i * 9 + k) - 0.5) * s * 0.8, cy - k * hh * 0.55, cz + (r(i * 7 + k) - 0.5) * s * 0.8), q, new THREE.Vector3(w, hh, w * (0.7 + r(k + i) * 0.5))); rock.setMatrixAt(n++, m); }
      for (let k = 0; k < 3 && g < 30; k++) { m.compose(new THREE.Vector3(cx + (r(i * 4 + k) - 0.5) * s * 0.5, cy + s * 0.28, cz + (r(i * 5 + k) - 0.5) * s * 0.5), q, new THREE.Vector3(s * (0.9 - k * 0.2), s * 0.12, s * (0.8 - k * 0.15))); grass.setMatrixAt(g++, m); } }
    rock.count = n; grass.count = g; scene.add(rock, grass); }
  const clouds = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, emissive: '#fff1de', emissiveIntensity: 0.3, fog: false }), 70), cloudSeeds = [];
  { const r = (n) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); }; for (let i = 0; i < 14; i++) for (let j = 0; j < 5; j++) cloudSeeds.push({ x: r(i) * 520 - 230, y: 62 + r(i + 20) * 34, z: r(i + 40) * 520 - 230, ox: (r(i * 9 + j) - 0.5) * 18, oy: (r(i * 5 + j + 3) - 0.5) * 3, oz: (r(i * 7 + j + 6) - 0.5) * 10, sx: 8 + r(i + j * 3) * 10, sy: 2.6 + r(i * 2 + j) * 2.2, sz: 7 + r(i * 3 + j) * 7 }); scene.add(clouds); }

  // ---------- the island: bevelled blocks ----------
  let world = generate(state.game.plot);
  /** Every block face gets a soft bevel: the lighting normal bends outward near each edge, and the groove darkens a little. */
  function bevel(mat, sway) {
    mat.onBeforeCompile = (s) => { s.uniforms.uTime = uTime;
      s.vertexShader = 'uniform float uTime; varying vec3 vWP; varying vec3 vWN;\n' + s.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>\n vWN = normal; ${sway ? 'float ph = position.x * .7 + position.z * .6 + position.y * .9; transformed.x += sin(uTime * 1.25 + ph) * .045; transformed.z += cos(uTime * 1.05 + ph * 1.3) * .04;' : ''} vWP = position;`);
      s.fragmentShader = 'varying vec3 vWP; varying vec3 vWN;\n' + s.fragmentShader
        .replace('#include <color_fragment>', `#include <color_fragment>\n vec3 bN = normalize(vWN); vec3 bA = abs(bN); vec3 bF = fract(vWP - bN * .001); vec2 bU; vec3 bT1; vec3 bT2;
          if (bA.y > .5) { bU = bF.xz; bT1 = vec3(1.,0.,0.); bT2 = vec3(0.,0.,1.); } else if (bA.x > .5) { bU = bF.zy; bT1 = vec3(0.,0.,1.); bT2 = vec3(0.,1.,0.); } else { bU = bF.xy; bT1 = vec3(1.,0.,0.); bT2 = vec3(0.,1.,0.); }
          vec2 bE = smoothstep(.085, 0., bU) - smoothstep(.915, 1., bU); diffuseColor.rgb *= 1. - .1 * max(abs(bE.x), abs(bE.y));`)
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>\n normal = normalize((viewMatrix * vec4(normalize(bN - (bT1 * bE.x + bT2 * bE.y) * .8), 0.)).xyz);`); };
    return mat;
  }
  const mSolid = bevel(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 }), false), mLeaf = bevel(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }), true);
  const mGlass = new THREE.MeshPhysicalMaterial({ vertexColors: true, transparent: true, opacity: 0.3, roughness: 0.06, metalness: 0, side: THREE.DoubleSide, depthWrite: false });
  const mGlow = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false });
  const blocks = { solid: new THREE.Mesh(new THREE.BufferGeometry(), mSolid), leaf: new THREE.Mesh(new THREE.BufferGeometry(), mLeaf), glass: new THREE.Mesh(new THREE.BufferGeometry(), mGlass), glow: new THREE.Mesh(new THREE.BufferGeometry(), mGlow) };
  for (const k of ['solid', 'leaf', 'glow']) { blocks[k].castShadow = true; blocks[k].receiveShadow = k !== 'glow'; } blocks.glass.renderOrder = 3;
  scene.add(...Object.values(blocks)); let quads = 0;
  function remesh() { const g = mesh(world); for (const k of Object.keys(blocks)) { blocks[k].geometry.dispose(); blocks[k].geometry = g[k]; } quads = g.quads; syncPlinths(); }

  // ---------- water: stream, pond, waterfall, fountain ----------
  const WATER_FRAG = `uniform float uTime; uniform vec3 haze, sun; varying vec3 wp; ${NOISE}
    void main(){ vec2 p = wp.xz; float w = fbm(p * 1.4 + vec2(uTime * .25, uTime * .6)) + .5 * fbm(p * 3.1 - uTime * .4); vec3 n = normalize(vec3(dFdx(w) * 2.2, 1., dFdy(w) * 2.2)); vec3 v = normalize(cameraPosition - wp);
      float fres = pow(1. - max(dot(n, v), 0.), 3.); vec3 c = mix(vec3(.16,.62,.68), vec3(.80,.93,.97), fres * .6 + smoothstep(.95, 1.25, w) * .25); c += vec3(1.,.9,.7) * pow(max(dot(reflect(-sun, n), v), 0.), 80.) * .9; gl_FragColor = vec4(c, .78 + fres * .2); }`;
  const waterMat = new THREE.ShaderMaterial({ transparent: true, uniforms: { uTime, haze: { value: HAZE }, sun: { value: SUN } }, vertexShader: 'varying vec3 wp; void main(){ vec4 w = modelMatrix * vec4(position, 1.); wp = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }', fragmentShader: WATER_FRAG });
  { const p = [], idx = []; world.water.forEach((c, i) => { p.push(c.x, c.y, c.z + 1, c.x + 1, c.y, c.z + 1, c.x + 1, c.y, c.z, c.x, c.y, c.z); idx.push(i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3); });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); g.setIndex(idx); const m = new THREE.Mesh(g, waterMat); m.renderOrder = 1; scene.add(m);
    const pad = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.34, 0.34, 0.03, 9), new THREE.MeshStandardMaterial({ color: '#4f9f48', roughness: 0.8 }), 14), mm = new THREE.Matrix4(); let n = 0;
    for (const c of world.water) if (Math.hypot(c.x - SITES.pond.x, c.z - SITES.pond.z) < 3.8 && hash(c.x, 7, c.z) > 0.62 && n < 14) { mm.makeTranslation(c.x + 0.5, c.y + 0.02, c.z + 0.5); pad.setMatrixAt(n++, mm); } pad.count = n; scene.add(pad); }
  const fallMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: { uTime }, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
    fragmentShader: `uniform float uTime; varying vec2 vUv; ${NOISE} void main(){ float s = fbm(vec2(vUv.x * 9., vUv.y * 5. + uTime * 2.4)); float a = smoothstep(.25, .8, s) * smoothstep(0., .06, vUv.y) * smoothstep(1., .9, vUv.y) * (.35 + .65 * vUv.y); gl_FragColor = vec4(mix(vec3(.55,.83,.9), vec3(1.), s), a * .92); }` });
  const fallX = world.falls.length ? Math.max(...world.falls.map((f) => f.x)) : 88; { const m = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 40, 1, 1), fallMat); m.position.set(fallX + 0.55, G - 20.2, 59); m.rotation.y = Math.PI / 2; scene.add(m); const lip = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.2), fallMat); lip.position.set(fallX + 0.3, G - 0.5, 59); lip.rotation.set(0, Math.PI / 2, 0); scene.add(lip); }
  const dark = new THREE.MeshStandardMaterial({ color: '#2b3037', roughness: 0.6 }), wood = new THREE.MeshStandardMaterial({ color: '#c79b66', roughness: 0.8 }), glowM = new THREE.MeshBasicMaterial({ color: '#ffe7b0', toneMapped: false }), coralM = new THREE.MeshBasicMaterial({ color: '#ff5a3c', toneMapped: false });
  const put = (geo, m, x, y, z, ry = 0, parent = scene) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.rotation.y = ry; o.castShadow = m !== glowM && m !== coralM; o.receiveShadow = true; parent.add(o); return o; };
  const F = SITES.fountain; const pool = put(new THREE.CylinderGeometry(2.25, 2.25, 0.5, 40), waterMat, 47.5, G + 1.3, 47.5); pool.castShadow = false; put(new THREE.CylinderGeometry(0.2, 0.3, 1.9, 16), dark, 47.5, G + 2.2, 47.5);
  const dot = put(new THREE.SphereGeometry(0.34, 32, 20), coralM, 47.5, G + 3.6, 47.5), topDot = put(new THREE.SphereGeometry(0.85, 32, 20), coralM, 48, G + 27.4, 25);
  const jets = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(48 * 3), 3)), new THREE.PointsMaterial({ color: '#e8fbff', size: 0.07, transparent: true, opacity: 0.85, depthWrite: false })); scene.add(jets);

  // ---------- plants ----------
  { const tuft = new THREE.InstancedMesh(new THREE.BoxGeometry(0.07, 0.34, 0.07), new THREE.MeshStandardMaterial({ color: '#66b34d', roughness: 0.9 }), 5200), stem = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.32, 0.05), new THREE.MeshStandardMaterial({ color: '#4f9a45' }), 700), petal = new THREE.InstancedMesh(new THREE.BoxGeometry(0.2, 0.14, 0.2), new THREE.MeshStandardMaterial({ roughness: 0.7 }), 700);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), c = new THREE.Color(), cols = ['#ff5a3c', '#fff6e6', '#ffd95a', '#f7a8c4', '#b79cf2']; let nt = 0, nf = 0; world.flowers = [];
    for (let x = 1; x < W - 1; x++) for (let z = 1; z < D - 1; z++) { const y = world.grassAt(x, z); if (y < 0) continue;
      const k = Math.floor(hash(x, 11, z) * 4.4); for (let i = 0; i < k && nt < 5200; i++) { const s = 0.6 + hash(x, 20 + i, z) * 1.4; q.setFromEuler(new THREE.Euler((hash(x, 30 + i, z) - 0.5) * 0.5, hash(x, 40 + i, z) * 6, (hash(x, 50 + i, z) - 0.5) * 0.5)); m.compose(new THREE.Vector3(x + hash(x, 60 + i, z), y + 1 + 0.17 * s, z + hash(x, 70 + i, z)), q, sc.set(1, s, 1)); tuft.setMatrixAt(nt++, m); }
      if (hash(x, 12, z) > 0.85 && nf < 700) { const px = x + 0.25 + hash(x, 13, z) * 0.5, pz = z + 0.25 + hash(x, 14, z) * 0.5; m.makeTranslation(px, y + 1.16, pz); stem.setMatrixAt(nf, m); m.makeTranslation(px, y + 1.37, pz); petal.setMatrixAt(nf, m); petal.setColorAt(nf, c.set(cols[Math.floor(hash(x, 15, z) * cols.length)])); nf++; if (Math.hypot(x - 47, z - 48) < 26) world.flowers.push([px, y + 1.6, pz]); } }
    tuft.count = nt; stem.count = petal.count = nf; tuft.receiveShadow = true; petal.castShadow = true; scene.add(tuft, stem, petal); }

  // ---------- street furniture and props (slim things are modelled, not built from metre blocks) ----------
  let vane = null, flag = null, benchTool = null; const doorGlows = [];
  { const post = new THREE.BoxGeometry(0.13, 2.7, 0.13), foot = new THREE.BoxGeometry(0.34, 0.12, 0.34), head = new THREE.BoxGeometry(0.36, 0.42, 0.36), cap = new THREE.BoxGeometry(0.5, 0.07, 0.5);
    const bag = { dark: [], glow: [], wood: [] }, stash = (geo, k, x, y, z, ry = 0, ox = 0, oy = 0, oz = 0) => { const g = geo.clone(); g.translate(ox, oy, oz); g.rotateY(ry); g.translate(x, y, z); bag[k].push(g); };
    for (const [x, z] of LAMPS) { const y = world.top(x, z) + 1; stash(post, 'dark', x, y + 1.35, z); stash(foot, 'dark', x, y + 0.06, z); stash(head, 'glow', x, y + 2.9, z); stash(cap, 'dark', x, y + 3.14, z); }
    const seat = new THREE.BoxGeometry(2.3, 0.1, 0.56), back = new THREE.BoxGeometry(2.3, 0.5, 0.08), leg = new THREE.BoxGeometry(0.1, 0.46, 0.5);
    for (const [x, z, ry] of BENCHES) { const y = world.top(x, z) + 1; stash(seat, 'wood', x, y, z, ry, 0, 0.5, 0); stash(back, 'wood', x, y, z, ry, 0, 0.92, -0.25); stash(leg, 'dark', x, y, z, ry, -0.95, 0.23, 0); stash(leg, 'dark', x, y, z, ry, 0.95, 0.23, 0); }
    for (const [k, m] of [['dark', dark], ['glow', glowM], ['wood', wood]]) { const o = new THREE.Mesh(mergeGeometries(bag[k], false), m); o.castShadow = k !== 'glow'; o.receiveShadow = true; scene.add(o); }
    { const g = new THREE.Group(), b = SITES.board; g.position.set(b.x, world.top(b.x, b.z) + 1, b.z); g.rotation.y = Math.atan2(47.5 - b.x, 47.5 - b.z); scene.add(g); const add = (w, h, d, m, x, y, z) => put(new THREE.BoxGeometry(w, h, d), m, x, y, z, 0, g);
      add(0.12, 2.2, 0.12, dark, -0.95, 1.1, 0); add(0.12, 2.2, 0.12, dark, 0.95, 1.1, 0); add(2.0, 1.25, 0.08, wood, 0, 1.5, 0); add(2.2, 0.1, 0.3, dark, 0, 2.2, 0);
      for (const [x, y, w, h, c] of [[-0.55, 1.65, 0.5, 0.62, '#f6f3ea'], [0.1, 1.72, 0.46, 0.5, '#f6f3ea'], [0.62, 1.6, 0.36, 0.7, '#ff5a3c'], [0.05, 1.2, 0.6, 0.3, '#fff3c4']]) add(w, h, 0.02, new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 }), x, y, 0.055); }
    { const c = SITES.cart, y = A; for (const [dx, dz] of [[-0.2, -0.25], [0.3, 0.2], [0.9, -0.1]]) { put(new THREE.CylinderGeometry(0.09, 0.07, 0.2, 10), new THREE.MeshStandardMaterial({ color: '#fff7ee' }), c.x + 0.5 + dx, y + 1.1, c.z + 0.5 + dz); } put(new THREE.BoxGeometry(0.5, 0.6, 0.4), new THREE.MeshStandardMaterial({ color: '#c7ccd3', metalness: 0.5, roughness: 0.35 }), c.x + 1.5, y + 1.3, c.z + 0.5); }
    { const y = PLOT.y + 1; vane = new THREE.Group(); vane.position.set(74.5, y + 7.6, 68); scene.add(vane); put(new THREE.BoxGeometry(0.1, 1.6, 0.1), dark, 74.5, y + 6.8, 68); put(new THREE.BoxGeometry(1.5, 0.08, 0.08), dark, 0, 0, 0, 0, vane); put(new THREE.BoxGeometry(0.08, 0.08, 1.5), dark, 0, 0, 0, 0, vane); put(new THREE.BoxGeometry(0.5, 0.36, 0.04), coralM, 0.72, 0, 0, 0, vane);
      for (const [x, z, c] of [[77.4, 65.6, '#2f6f7c'], [77.4, 66.6, '#ffd95a'], [77.4, 70.4, '#ff5a3c']]) put(new THREE.BoxGeometry(0.3, 0.34, 0.3), new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 }), x, y + 1.17, z);
      put(new THREE.BoxGeometry(0.1, 3.4, 0.1), dark, PLOT.x1 + 0.9, y + 1.7, PLOT.z0 - 0.4); flag = put(new THREE.PlaneGeometry(1.5, 0.9, 10, 4), new THREE.MeshStandardMaterial({ color: OPTIONS.scrubs[state.character?.scrubs ?? 0], side: THREE.DoubleSide, roughness: 0.8 }), PLOT.x1 + 1.7, y + 2.95, PLOT.z0 - 0.4); flag.userData.base = flag.geometry.attributes.position.array.slice(); }
    for (const [s, w, h, ry, x, y, z] of [[SITES.hall, 4, 5, 0, 48, G + 6.5, 30.6], [SITES.or, 3, 3, Math.PI / 2, 66.4, A + 1.5, 48.5], [SITES.review, 3, 3, Math.PI / 2, 30.6, A + 1.5, 48.5]]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: '#ff8a5c', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })); m.position.set(x, y, z); m.rotation.y = ry; scene.add(m); doorGlows.push({ s, m }); } }
  function syncBenchTool() { if (benchTool) scene.remove(benchTool); benchTool = null; if (!state.game.rewards.includes('nerve-stimulator')) return; const g = new THREE.Group(); g.position.set(77.35, PLOT.y + 2.12, 68.4); put(new THREE.BoxGeometry(0.34, 0.2, 0.52), new THREE.MeshStandardMaterial({ color: '#ff5a3c', roughness: 0.45 }), 0, 0, 0, 0, g); put(new THREE.BoxGeometry(0.2, 0.02, 0.26), new THREE.MeshBasicMaterial({ color: '#c6f36b', toneMapped: false }), -0.02, 0.105, -0.06, 0, g); put(new THREE.BoxGeometry(0.03, 0.03, 0.5), dark, 0.1, -0.05, 0.5, 0.4, g); benchTool = g; scene.add(g); }
  syncBenchTool();

  // ---------- signs ----------
  for (const s of [SITES.hall, SITES.or, SITES.review, SITES.plot, SITES.workshop, SITES.regional]) {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 200; const g = c.getContext('2d'); g.font = "500 92px 'Inter Tight', system-ui, sans-serif"; const tw = g.measureText(s.sign).width, w = Math.min(1000, tw + 150);
    g.fillStyle = 'rgba(14,16,20,.92)'; g.beginPath(); g.roundRect((1024 - w) / 2, 20, w, 160, 80); g.fill(); g.fillStyle = '#ff5a3c'; g.beginPath(); g.arc((1024 - w) / 2 + 62, 100, 15, 0, 7); g.fill(); g.fillStyle = '#f4f4f2'; g.textBaseline = 'middle'; g.fillText(s.sign, (1024 - w) / 2 + 100, 104, 880);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; const big = s === SITES.hall ? 1.5 : s === SITES.plot || s === SITES.workshop ? 0.62 : 1;
    const p = new THREE.Mesh(new THREE.PlaneGeometry(4.6 * big * (s === SITES.regional ? 1.25 : 1), 0.9 * big), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false })); p.position.set(...s.signAt); p.rotation.y = s.signYaw; scene.add(p);
    if (s === SITES.plot) put(new THREE.BoxGeometry(0.14, 1.7, 0.14), new THREE.MeshStandardMaterial({ color: '#74543a' }), s.signAt[0], G + 0.85, s.signAt[2]);
  }

  // ---------- field notes ----------
  const noteMeshes = SITES.notes.map((n) => { const g = new THREE.Group(), card = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.66, 0.05), coralM), line = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.06), new THREE.MeshBasicMaterial({ color: '#fff', toneMapped: false })); line.position.y = 0.14; const l2 = line.clone(); l2.position.y = 0; const l3 = line.clone(); l3.position.y = -0.14; l3.scale.x = 0.6; g.add(card, line, l2, l3);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.56, 40), new THREE.MeshBasicMaterial({ color: '#ff5a3c', transparent: true, opacity: 0.7, side: THREE.DoubleSide, toneMapped: false })); ring.rotation.x = -Math.PI / 2;
    const y = world.top(n.x, n.z) + 1; g.position.set(n.x, y + 1.25, n.z); ring.position.set(n.x, y + 0.04, n.z); g.visible = ring.visible = !state.game.notes.includes(n.id); scene.add(g, ring); return { n, g, ring, y0: y + 1.25 }; });

  // ---------- the real anatomy, inside the world: in the Hall's lantern, and on your plot when you have earned it ----------
  let plexusProto = null; const plinths = new Map();
  async function loadPlexus() { if (plexusProto) return plexusProto; const draco = new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/gltf/'); const g = await new GLTFLoader().setDRACOLoader(draco).loadAsync('../assets/models/plexus/plexus-right-overlord-v2.glb'), grp = new THREE.Group();
    const keep = /root_of|trunk_of|division|cord_of|suprascapular_nerve|clavicle_r/; const mn = new THREE.MeshStandardMaterial({ color: '#f5d255', roughness: 0.35, emissive: '#8a6a12' }), mb = new THREE.MeshStandardMaterial({ color: '#efe8d8', roughness: 0.7 });
    g.scene.traverse((o) => { if (o.isMesh && keep.test(o.name)) { const c = new THREE.Mesh(o.geometry, o.userData.layer === 'nerve' ? mn : mb); c.castShadow = true; grp.add(c); } });
    const bb = new THREE.Box3().setFromObject(grp), ctr = bb.getCenter(new THREE.Vector3()); for (const c of grp.children) c.position.set(-ctr.x, -bb.min.y, -ctr.z); const sz = bb.getSize(new THREE.Vector3()); grp.scale.setScalar(2.0 / Math.max(sz.x, sz.y, sz.z)); plexusProto = grp; return grp; }
  function syncPlinths() { const want = new Set(state.game.plot.filter((p) => p[3] === B.PLINTH).map((p) => p.slice(0, 3).join(','))); for (const [k, g] of plinths) if (!want.has(k)) { scene.remove(g); plinths.delete(k); }
    for (const k of want) if (!plinths.has(k)) { const holder = new THREE.Group(), [x, y, z] = k.split(',').map(Number); holder.position.set(x + 0.5, y + 1, z + 0.5); plinths.set(k, holder); scene.add(holder); loadPlexus().then((p) => holder.add(p.clone())); } }
  const hallPiece = new THREE.Group(); hallPiece.position.set(48, G + 6, 24.5); scene.add(hallPiece); loadPlexus().then((p) => { const c = p.clone(); c.scale.multiplyScalar(1.7); hallPiece.add(c); });
  remesh();

  // ---------- people ----------
  const people = [], bubbles = document.createElement('div'); bubbles.className = 'labels'; host.parentElement.appendChild(bubbles);
  function person(name, look, x, z, opts, say) { const a = buildAvatar(look); a.userData.pose = opts.pose; a.position.set(x, world.top(x, z) + 1, z); if (opts.ry !== undefined) a.rotation.y = opts.ry; scene.add(a); const el = document.createElement('span'); el.style.maxWidth = '300px'; el.style.whiteSpace = 'normal'; el.style.opacity = 0; bubbles.appendChild(el); const p = { name, a, route: opts.route, fixed: opts.fixed, seatY: opts.seatY, say, el, i: 0, wait: 0, near: false, t: Math.random() * 9 }; people.push(p); return p; }
  person('Booth', { skin: 3, hair: 'fade', hairColor: 0, scrubs: 6, glasses: true, steth: false, prop: 'headset' }, SITES.booth.x, SITES.booth.z, { fixed: true, ry: -2.2 }, () => {
    const g = state.game, due = dueNow(state).length, P = g.progress || {};
    if (due) return `You have ${due} due in Anatomy Hall. Short visit. I will hold your coffee.`;
    if (P.regionalDone) return 'Four ways in, and you can say which and why. The pavilion crew say they will be finished "soon". They said that last term.';
    if (g.rewards.includes('nerve-stimulator')) return g.plot.some((p) => p[3] === B.PLINTH) ? 'Next in the Hall: four ways into that plexus, and a patient who cannot spare a lung.' : 'A nerve stimulator. It suits you. It is on your workshop bench too. The sculpture goes on your plot: press B when you are standing in it.';
    if (g.lessonDone) return 'You did the lesson. The challenge is the same room with the labels taken away. Unkind, but it works.';
    return 'Booth. I run the simulator. Anatomy Hall is up the steps, under the tower. There is a plexus in there nobody has labelled for you.'; });
  person('Groundskeeper', { skin: 1, hair: 'bun', hairColor: 4, scrubs: 3, steth: false, prop: 'rake' }, 41, 56, { pose: 'rake', route: [[41, 56.5], [54.5, 57], [57, 51.5], [55, 40], [41, 39.5], [38.5, 47]] }, () => 'Mind the hedge. It is the only thing on this island that grows without being tested first.');
  person('Reader', { skin: 4, hair: 'curly', hairColor: 0, scrubs: 1, glasses: true, steth: false, prop: 'book' }, 33.4, 53.2, { pose: 'sit', fixed: true, ry: 1.57, seatY: 0.02 }, () => 'Chapter fifty. Four ways into one plexus. The Hall shows it better than the page does, but the page is where it was checked.');
  person('Courier', { skin: 0, hair: 'short', hairColor: 3, scrubs: 5, steth: false, prop: 'crate' }, 58, 48.5, { pose: 'carry', route: [[58, 48.6], [65.2, 48.6], [58, 48.6], [49.5, 41], [49.5, 37.4], [49.5, 41]] }, () => 'Supplies for the OR. Mock OR Day does not restock itself.');

  // ---------- small life: birds, butterflies, petals, smoke, pollen ----------
  const wingGeo = new THREE.BoxGeometry(0.5, 0.03, 0.22), birdMat = new THREE.MeshStandardMaterial({ color: '#3d434b', roughness: 0.8 });
  const birds = Array.from({ length: 9 }, (_, i) => { const g = new THREE.Group(), l = new THREE.Mesh(wingGeo, birdMat), r = new THREE.Mesh(wingGeo, birdMat), body = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.4), birdMat); l.position.x = 0.27; r.position.x = -0.27; g.add(l, r, body); scene.add(g); return { g, l, r, rad: 13 + (i % 5) * 4.5, h: G + 22 + (i % 4) * 3.2, sp: 0.22 + (i % 3) * 0.06, ph: i * 0.9, cx: i < 6 ? 48 : 30 + i * 4, cz: i < 6 ? 25 : 52 }; });
  const flyMat = [new THREE.MeshBasicMaterial({ color: '#ffd95a', side: THREE.DoubleSide }), new THREE.MeshBasicMaterial({ color: '#fff6e6', side: THREE.DoubleSide }), new THREE.MeshBasicMaterial({ color: '#b79cf2', side: THREE.DoubleSide })], flyGeo = new THREE.PlaneGeometry(0.16, 0.2);
  const flies = (world.flowers || []).filter((_, i) => i % Math.max(1, Math.floor(world.flowers.length / 14)) === 0).slice(0, 14).map((f, i) => { const g = new THREE.Group(), l = new THREE.Mesh(flyGeo, flyMat[i % 3]), r = new THREE.Mesh(flyGeo, flyMat[i % 3]); l.position.x = 0.08; r.position.x = -0.08; g.add(l, r); scene.add(g); return { g, l, r, f, ph: i * 1.7 }; });
  const mkPoints = (n, color, sz, opacity) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3)); const p = new THREE.Points(g, new THREE.PointsMaterial({ color, size: sz, transparent: true, opacity, depthWrite: false })); p.frustumCulled = false; scene.add(p); return p; };
  const motes = mkPoints(300, '#fff6d8', 0.09, 0.75), petals = mkPoints(70, '#f7a8c4', 0.14, 0.95), smoke = mkPoints(26, '#d8d2ca', 0.9, 0.34), burst = mkPoints(40, '#ff5a3c', 0.16, 1); burst.userData = { t: 9, v: [] };
  { const a = motes.geometry.attributes.position; for (let i = 0; i < a.count; i++) a.setXYZ(i, Math.random() * W, G + 1 + Math.random() * 12, Math.random() * D); const b = petals.geometry.attributes.position; for (let i = 0; i < b.count; i++) b.setXYZ(i, 39 + Math.random() * 18, G + 1 + Math.random() * 8, 34 + Math.random() * 7); const s = smoke.geometry.attributes.position; for (let i = 0; i < s.count; i++) s.setXYZ(i, 76.5, PLOT.y + 11 + i * 0.5, 71.5); }
  function pop(x, y, z, color = '#ff5a3c') { burst.material.color.set(color); const a = burst.geometry.attributes.position; burst.userData.v = []; for (let i = 0; i < a.count; i++) { a.setXYZ(i, x, y, z); const th = Math.random() * 6.28, up = 1 + Math.random() * 3.5, r = 1 + Math.random() * 2.2; burst.userData.v.push([Math.cos(th) * r, up, Math.sin(th) * r]); } a.needsUpdate = true; burst.userData.t = 0; }
  const popBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false })); scene.add(popBox); let popT = 9;

  // ---------- the player ----------
  let avatar = null; const P = { x: SITES.spawn.x, y: A, z: SITES.spawn.z, vy: 0, ground: false, face: Math.PI, speed: 0 }, cam = { yaw: 0, pitch: 0.42, dist: 10.5 };
  function setCharacter() { if (avatar) scene.remove(avatar); avatar = buildAvatar(state.character, state.game.rewards); scene.add(avatar); if (flag) flag.material.color.set(OPTIONS.scrubs[state.character?.scrubs ?? 0]); syncBenchTool(); }
  setCharacter();
  if (state.game.pos) Object.assign(P, { x: state.game.pos[0], y: state.game.pos[1], z: state.game.pos[2] }), cam.yaw = state.game.pos[3] ?? 0; else P.y = world.top(P.x, P.z) + 1;
  const blocked = (x, y, z) => { for (let bx = Math.floor(x - 0.3); bx <= Math.floor(x + 0.3); bx++) for (let by = Math.floor(y + 0.001); by <= Math.floor(y + 1.74); by++) for (let bz = Math.floor(z - 0.3); bz <= Math.floor(z + 0.3); bz++) if (world.get(bx, by, bz)) return true; return false; };
  if (blocked(P.x, P.y, P.z) || world.top(P.x, P.z) < 0) Object.assign(P, { x: SITES.spawn.x, z: SITES.spawn.z, y: world.top(SITES.spawn.x, SITES.spawn.z) + 1 });

  // ---------- input ----------
  const keys = new Set(), stick = { x: 0, y: 0 }; let wantJump = false, build = { on: false, item: 'plank' }, ghost = null;
  const onKey = (e, d) => { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; d ? keys.add(e.code) : keys.delete(e.code); if (d && e.code === 'Space') { wantJump = true; e.preventDefault(); } if (d && e.code === 'KeyE') act(); if (d && e.code === 'KeyB') toggleBuild(); if (/^Arrow/.test(e.code)) e.preventDefault(); };
  addEventListener('keydown', (e) => api.active && onKey(e, true)); addEventListener('keyup', (e) => onKey(e, false));
  const cv = renderer.domElement; let drag = null;
  cv.addEventListener('pointerdown', (e) => { cv.setPointerCapture(e.pointerId); drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now() }; });
  cv.addEventListener('pointermove', (e) => { if (drag) { cam.yaw -= (e.clientX - drag.x) * 0.0055; cam.pitch = THREE.MathUtils.clamp(cam.pitch + (e.clientY - drag.y) * 0.004, -0.2, 1.25); drag.x = e.clientX; drag.y = e.clientY; } else if (build.on) aim(e); });
  cv.addEventListener('pointerup', (e) => { if (drag && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 7 && performance.now() - drag.t < 500 && build.on) { aim(e); place(); } drag = null; });
  cv.addEventListener('wheel', (e) => { cam.dist = THREE.MathUtils.clamp(cam.dist * (1 + Math.sign(e.deltaY) * 0.09), 3.2, 26); e.preventDefault(); }, { passive: false });
  { const s = els.stick, knob = s.firstElementChild; let id = null; const set = (e) => { const r = s.getBoundingClientRect(); let x = (e.clientX - r.left - r.width / 2) / (r.width / 2), y = (e.clientY - r.top - r.height / 2) / (r.height / 2); const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; } stick.x = x; stick.y = y; knob.style.transform = `translate(${x * 34}px, ${y * 34}px)`; };
    s.addEventListener('pointerdown', (e) => { id = e.pointerId; s.setPointerCapture(id); set(e); }); s.addEventListener('pointermove', (e) => e.pointerId === id && set(e)); const end = () => { id = null; stick.x = stick.y = 0; knob.style.transform = ''; }; s.addEventListener('pointerup', end); s.addEventListener('pointercancel', end);
    els.jump.addEventListener('pointerdown', () => { wantJump = true; }); els.act.addEventListener('pointerdown', () => act()); }

  // ---------- things you can walk up to ----------
  const inPlot = () => P.x >= PLOT.x0 - 0.5 && P.x <= PLOT.x1 + 1.5 && P.z >= PLOT.z0 - 0.5 && P.z <= PLOT.z1 + 1.5;
  const record = () => { const s = summary(state), d = dueNow(state), lines = Object.entries(s.byOutline || {}).map(([k, v]) => `${OUTLINE[k] || k}: ${v.correct} of ${v.seen}`); return s.attempts ? `<b>Your record.</b> ${s.attempts} unaided answers. ${lines.join('. ')}. ${d.length ? d.length + ' due now in Anatomy Hall.' : 'Nothing due right now.'} Field notes ${state.game.notes.length} of 4.` : 'Nothing on your record yet. Anatomy Hall is up the steps.'; };
  const SPOTS = [
    { at: SITES.hall, r: 2.8, label: 'Enter Anatomy Hall', run: () => { sfx('door'); onEnterHall(); } },
    { at: SITES.or, r: 2.4, label: 'Open Mock OR Day (leaves the island)', run: () => { sfx('door'); onLink('../student.html'); } },
    { at: SITES.review, r: 2.4, label: 'Open Review (leaves the island)', run: () => { sfx('door'); onLink('../index.html'); } },
    { at: SITES.regional, r: 3.2, label: 'Read the site notice', run: () => { sfx('page'); toast('Not built yet. Planned here: the same plexus with a needle path and an ultrasound plane, once both can be checked properly.', 7); } },
    { at: SITES.board, r: 2.4, label: 'Read the notice board', run: () => { sfx('page'); toast(record(), 9); } },
    { at: SITES.bench, r: 2.6, label: 'Look at your workbench', run: () => { sfx('tap'); const r = state.game.rewards; toast(r.length ? `<b>Your bench.</b> ${[r.includes('nerve-stimulator') && 'Nerve stimulator: in Anatomy Hall, Explore, select a cord and stimulate it', r.includes('plexus-model') && 'Plexus sculpture: place it on your plot', r.includes('block-cap') && 'Regional cap: under Wearing in the character screen'].filter(Boolean).join('. ')}.` : 'An empty bench. Tools arrive when you have shown you can use them. The first is in Anatomy Hall.', 9); } },
    { at: SITES.cart, r: 2.2, label: 'Coffee', run: () => { sfx('tap'); toast('Booth\'s coffee. The decaf is a rumour.', 4); } },
  ];
  let spot = null;
  function act() { if (!api.active) return; if (spot) spot.run(); }
  els.prompt.addEventListener('click', act);
  let toastT = 0; function toast(html, seconds = 4.5) { els.toast.innerHTML = html; els.toast.classList.add('on'); toastT = seconds; }

  // ---------- building, on your plot only ----------
  function drawBuild() { const inv = state.game.inventory; els.build.hidden = !build.on; els.build.innerHTML = Object.entries(ITEMS).filter(([k]) => !['plexus', 'coral'].includes(k) || inv[k] > 0 || state.game.plot.some((p) => p[3] === PLACEABLE[k])).map(([k, [n, c]]) => `<button data-item="${k}" class="${build.item === k ? 'on' : ''}"><i style="background:${c}"></i>${n}<span>${inv[k] || 0}</span></button>`).join('') + `<button data-item="remove" class="${build.item === 'remove' ? 'on' : ''}"><i style="background:#30353c"></i>Take back<span></span></button>`;
    els.build.querySelectorAll('button').forEach((b) => b.onclick = () => { build.item = b.dataset.item; sfx('tap'); drawBuild(); }); }
  function toggleBuild() { if (!api.active) return; if (!build.on && !inPlot()) return toast('Building happens on your plot, down the path south-east of the plaza.'); build.on = !build.on; if (ghost) ghost.visible = false; drawBuild(); drawDock(); sfx('tap'); if (build.on) toast(touch ? 'Tap a block on your plot to build against it.' : 'Click a block on your plot to build against it. B to stop.'); }
  let target = null;
  function aim(e) { const r = cv.getBoundingClientRect(), ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera); const h = castBlock(world, ray.ray.origin, ray.ray.direction, 50); target = null;
    if (h) { const c = build.item === 'remove' ? h.hit : h.before; if (c && c[0] >= PLOT.x0 && c[0] <= PLOT.x1 && c[2] >= PLOT.z0 && c[2] <= PLOT.z1 && c[1] > PLOT.y && c[1] < PLOT.y + 10) target = c; }
    if (!ghost) { ghost = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.02, 1.02, 1.02)), new THREE.LineBasicMaterial({ color: '#ffffff' })); scene.add(ghost); } ghost.visible = !!target; if (target) ghost.position.set(target[0] + 0.5, target[1] + 0.5, target[2] + 0.5); }
  function place() { if (!target) return toast('Only on your plot, and no higher than nine blocks.'); const [x, y, z] = target, g = state.game, inv = g.inventory;
    if (build.item === 'remove') { const i = g.plot.findIndex((p) => p[0] === x && p[1] === y && p[2] === z); if (i < 0) return; const t = g.plot[i][3], k = Object.keys(PLACEABLE).find((n) => PLACEABLE[n] === t); g.plot.splice(i, 1); inv[k] = (inv[k] || 0) + 1; world.set(x, y, z, 0); sfx('take'); }
    else { if (!(inv[build.item] > 0)) return toast(`No ${ITEMS[build.item][0].toLowerCase()} left. Correct answers in Anatomy Hall earn more.`); if (world.get(x, y, z)) return; if (Math.abs(x + 0.5 - P.x) < 0.8 && Math.abs(z + 0.5 - P.z) < 0.8 && y + 1 > P.y && y < P.y + 1.8) return toast('You are standing there.'); inv[build.item]--; g.plot.push([x, y, z, PLACEABLE[build.item]]); world.set(x, y, z, PLACEABLE[build.item]); sfx('place'); popBox.position.set(x + 0.5, y + 0.5, z + 0.5); popT = 0; pop(x + 0.5, y + 0.2, z + 0.5, '#f4efe6'); }
    remesh(); save(state); drawBuild(); drawDock(); ghost.visible = false; }
  function drawDock() { const inv = state.game.inventory, n = Object.values(inv).reduce((a, b) => a + b, 0); els.dock.innerHTML = `<button class="chip ${build.on ? 'on' : ''}" id="bBuild">${build.on ? 'Stop building' : 'Build'}</button><span class="chip">Blocks ${n}</span><span class="chip">Field notes ${state.game.notes.length} of 4</span><div class="note">${touch ? 'Stick to walk, drag to look' : 'W A S D to walk · drag to look · Space to jump · E to use · B to build'}</div>`; els.dock.querySelector('#bBuild').onclick = toggleBuild; }
  drawDock();

  const zoneOf = () => { const d = (s) => Math.hypot(P.x - s.x, P.z - s.z); if (inPlot()) return ['Your plot', build.on ? 'Building. What you place here stays.' : 'Yours to build on. Press B, or the Build button.']; if (P.x > 68 && P.z > 62 && P.z < 75) return ['The workshop', 'Your tools live on the bench at the back.']; if (P.z > 83) return ['The landing', 'The island is north. The tower is Anatomy Hall.']; if (P.z < 34 && P.x > 34 && P.x < 62) return ['Anatomy Hall', 'The plexus: a lesson, a challenge, and four ways in.']; if (d(SITES.or) < 9) return ['The OR', 'Mock OR Day and the live simulator.']; if (d(SITES.review) < 9) return ['Review', 'Question modes and free recall.']; if (d(SITES.regional) < 9) return ['Regional pavilion', 'Being built.']; if (d(SITES.pond) < 7) return ['The pond', 'The stream comes from the hill and leaves over the east edge.']; if (Math.hypot(P.x - 47.5, P.z - 48) < 10) return ['The plaza', 'Booth is at the coffee cart.']; if (P.z < 16) return ['The hill', 'The highest ground on the island.']; return ['The island', 'Coral cards are field notes. Walk into one.']; };
  let zone = ''; const clock = new THREE.Clock(); let saveT = 0, frameMs = 16, stepT = 0, fallT = 0;
  function step(dt) {
    uTime.value += dt; const T = uTime.value;
    // ----- move -----
    let f = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) - stick.y, s = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0) + stick.x;
    const l = Math.hypot(f, s); if (l > 1) { f /= l; s /= l; }
    const sp = 4.9 * (keys.has('ShiftLeft') ? 1.5 : 1), mx = (-Math.sin(cam.yaw) * f + Math.cos(cam.yaw) * s) * sp, mz = (-Math.cos(cam.yaw) * f - Math.sin(cam.yaw) * s) * sp;
    const tryAxis = (nx, nz) => { if (!blocked(nx, P.y, nz)) { P.x = nx; P.z = nz; return; } if (P.ground && !blocked(nx, P.y + 1.05, nz) && !blocked(P.x, P.y + 1.05, P.z)) P.vy = Math.max(P.vy, 7.3); };
    if (mx) tryAxis(P.x + mx * dt, P.z); if (mz) tryAxis(P.x, P.z + mz * dt);
    if (wantJump && P.ground) { P.vy = 7.3; sfx('jump'); } wantJump = false;
    P.vy -= 22 * dt; const ny = P.y + P.vy * dt;
    if (!blocked(P.x, ny, P.z)) { P.y = ny; P.ground = false; } else { if (P.vy < 0) { if (P.vy < -9) sfx('step'); P.y = Math.floor(ny) + 1; P.ground = true; } P.vy = 0; }
    P.speed = Math.hypot(mx, mz); if (P.speed > 0.2) { let d = Math.atan2(mx, mz) - P.face; d = Math.atan2(Math.sin(d), Math.cos(d)); P.face += d * Math.min(1, dt * 12); }
    if (P.speed > 0.5 && P.ground) { stepT -= dt * P.speed; if (stepT <= 0) { stepT = 1.75; const under = world.get(Math.floor(P.x), Math.floor(P.y - 0.5), Math.floor(P.z)); sfx(under === B.PLANK || under === B.SCAF || under === B.LOG ? 'stepWood' : 'step'); } }
    if (P.y < G - 14) { fallT += dt; if (fallT > 0.25) { Object.assign(P, { x: SITES.spawn.x, z: SITES.spawn.z, y: A, vy: 0 }); cam.yaw = 0; fallT = 0; toast('The island is the part with the ground. Back on the landing.'); } } else fallT = 0;
    avatar.position.set(P.x, P.y, P.z); avatar.rotation.y = P.face; avatar.userData.update(dt, P.speed, !P.ground);
    // ----- camera: behind and above, pulled in if a wall is in the way -----
    const tx = P.x, ty = P.y + 1.55, tz = P.z, cx = Math.sin(cam.yaw) * Math.cos(cam.pitch), cy = Math.sin(cam.pitch), cz = Math.cos(cam.yaw) * Math.cos(cam.pitch); let dist = cam.dist;
    for (let d = 0.6; d < cam.dist; d += 0.3) { const t = world.get(Math.floor(tx + cx * d), Math.floor(ty + cy * d), Math.floor(tz + cz * d)); if (t && t !== B.LEAF && t !== B.LEAF2 && t !== B.GLASS && t !== B.HEDGE && t !== B.BLOSSOM && t !== B.PINE) { dist = Math.max(1.1, d - 0.35); break; } }
    camera.position.set(tx + cx * dist, ty + cy * dist, tz + cz * dist); camera.lookAt(tx, ty, tz);
    // ----- people -----
    for (const p of people) { p.t += dt; let spd = 0; const dP = Math.hypot(P.x - p.a.position.x, P.z - p.a.position.z), was = p.near; p.near = dP < 3.6; if (p.near && !was) sfx('talk');
      if (p.route && !p.near) { const [gx, gz] = p.route[p.i], dx = gx - p.a.position.x, dz = gz - p.a.position.z, d = Math.hypot(dx, dz); if (p.wait > 0) p.wait -= dt; else if (d < 0.25) { p.i = (p.i + 1) % p.route.length; p.wait = 1.2 + (p.i % 2) * 3; } else { spd = 1.6; p.a.position.x += dx / d * spd * dt; p.a.position.z += dz / d * spd * dt; p.a.rotation.y = Math.atan2(dx, dz); } }
      if (p.near && !p.fixed) { let d = Math.atan2(P.x - p.a.position.x, P.z - p.a.position.z) - p.a.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); p.a.rotation.y += d * Math.min(1, dt * 6); }
      p.a.position.y = world.top(p.a.position.x, p.a.position.z) + 1 + (p.seatY ?? 0); p.a.userData.update(dt, spd); if (p.near && p.name === 'Booth' && p.t % 6 < 1.4) p.a.userData.wave(p.t);
      if (p.near) { v3.set(p.a.position.x, p.a.position.y + 2.3, p.a.position.z).project(camera); const r = cv.getBoundingClientRect(); p.el.innerHTML = `<b style="color:#ff8a6b;font-weight:500">${p.name}</b> &nbsp;${p.say()}`; p.el.style.transform = `translate(${(v3.x + 1) / 2 * r.width}px, ${(1 - v3.y) / 2 * r.height}px) translate(-50%, -100%)`; p.el.style.opacity = v3.z < 1 ? 1 : 0; } else p.el.style.opacity = 0; }
    // ----- field notes -----
    for (const m of noteMeshes) { if (!m.g.visible) continue; m.g.rotation.y += dt * 1.6; m.g.position.y = m.y0 + Math.sin(T * 2 + m.n.x) * 0.12; if (Math.hypot(P.x - m.n.x, P.z - m.n.z) < 1.2 && Math.abs(P.y - (m.y0 - 1.25)) < 2.5) { m.g.visible = m.ring.visible = false; state.game.notes.push(m.n.id); state.game.inventory.plank += 4; save(state); drawDock(); sfx('pickup'); pop(m.n.x, m.y0, m.n.z); toast(`<b>Field note ${state.game.notes.length} of 4.</b> ${FIELD_NOTES[m.n.id].text} <span style="opacity:.6">Plus four timber.</span>`, 9); } }
    // ----- small life -----
    for (const g of plinths.values()) g.rotation.y += dt * 0.35; hallPiece.rotation.y += dt * 0.25; dot.position.y = G + 3.6 + Math.sin(T * 1.4) * 0.1; topDot.scale.setScalar(1 + 0.05 * Math.sin(T * 2)); vane.rotation.y += dt * (1.2 + Math.sin(T * 0.3));
    { const a = flag.geometry.attributes.position, b = flag.userData.base; for (let i = 0; i < a.count; i++) { const u = (b[i * 3] + 0.75) / 1.5; a.setZ(i, Math.sin(T * 4 - u * 5) * 0.13 * u); } a.needsUpdate = true; }
    for (const b of birds) { const a = T * b.sp + b.ph; b.g.position.set(b.cx + Math.cos(a) * b.rad, b.h + Math.sin(a * 2.3) * 1.5, b.cz + Math.sin(a) * b.rad); b.g.rotation.y = -a; const w = Math.sin(T * 9 + b.ph) * 0.7; b.l.rotation.z = w; b.r.rotation.z = -w; }
    for (const b of flies) { const a = T * 0.7 + b.ph; b.g.position.set(b.f[0] + Math.sin(a) * 1.2, b.f[1] + 0.3 + Math.sin(a * 2.1) * 0.35, b.f[2] + Math.cos(a * 1.3) * 1.2); b.g.rotation.y = a; const w = Math.sin(T * 18 + b.ph) * 1.1; b.l.rotation.y = w; b.r.rotation.y = -w; }
    { const a = motes.geometry.attributes.position; for (let i = 0; i < a.count; i++) { let x = a.getX(i) + dt * 0.5; if (x > W) x = 0; a.setXYZ(i, x, a.getY(i) + Math.sin(T + i) * dt * 0.12, a.getZ(i)); } a.needsUpdate = true;
      const b = petals.geometry.attributes.position; for (let i = 0; i < b.count; i++) { let y = b.getY(i) - dt * (0.5 + (i % 5) * 0.12), x = b.getX(i) + Math.sin(T * 0.9 + i) * dt * 0.5; if (y < G + 0.2) { y = G + 5 + Math.random() * 5; x = 39 + Math.random() * 18; } b.setXYZ(i, x, y, b.getZ(i)); } b.needsUpdate = true;
      const s2 = smoke.geometry.attributes.position; for (let i = 0; i < s2.count; i++) { let y = s2.getY(i) + dt * 0.9; if (y > PLOT.y + 24) y = PLOT.y + 11; s2.setXYZ(i, 76.5 + (y - PLOT.y - 11) * 0.22 + Math.sin(T * 0.7 + i) * 0.25, y, 71.5 + Math.cos(T * 0.5 + i * 1.3) * 0.25); } s2.needsUpdate = true;
      const j = jets.geometry.attributes.position; for (let i = 0; i < j.count; i++) { const ph = ((T * 0.9 + i / j.count * 3) % 1), ang = i * 2.399, r = ph * 1.5; j.setXYZ(i, 47.5 + Math.cos(ang) * r, G + 3.2 + ph * 2.2 - ph * ph * 4.1, 47.5 + Math.sin(ang) * r); } j.needsUpdate = true; }
    if (burst.userData.t < 0.9) { burst.userData.t += dt; const a = burst.geometry.attributes.position, V = burst.userData.v; for (let i = 0; i < a.count; i++) { V[i][1] -= 9 * dt; a.setXYZ(i, a.getX(i) + V[i][0] * dt, a.getY(i) + V[i][1] * dt, a.getZ(i) + V[i][2] * dt); } a.needsUpdate = true; burst.material.opacity = 1 - burst.userData.t / 0.9; } else burst.material.opacity = 0;
    if (popT < 0.3) { popT += dt; const k = popT / 0.3; popBox.scale.setScalar(1.02 + 0.28 * (1 - k)); popBox.material.opacity = 0.55 * (1 - k); } else popBox.material.opacity = 0;
    for (let i = 0; i < cloudSeeds.length; i++) { const c = cloudSeeds[i], x = ((c.x + T * 1.1 + 230) % 520) - 230; v3.set(x + c.ox, c.y + c.oy, c.z + c.oz); clouds.setMatrixAt(i, new THREE.Matrix4().compose(v3, new THREE.Quaternion(), new THREE.Vector3(c.sx, c.sy, c.sz))); } clouds.instanceMatrix.needsUpdate = true;
    // ----- prompts, door glow, place names, sound -----
    spot = null; let best = 1e9; for (const s2 of SPOTS) { const d = Math.hypot(P.x - s2.at.x, P.z - s2.at.z); if (d < s2.r && d < best) { best = d; spot = s2; } }
    els.prompt.classList.toggle('on', !!spot && !build.on); if (spot) els.prompt.innerHTML = `<kbd>${touch ? 'Use' : 'E'}</kbd>${spot.label}`;
    for (const g of doorGlows) { const d = Math.hypot(P.x - g.s.x, P.z - g.s.z), want = d < 9 ? (0.1 + 0.16 * (1 - d / 9)) * (0.75 + 0.25 * Math.sin(T * 3)) : 0; g.m.material.opacity += (want - g.m.material.opacity) * Math.min(1, dt * 4); }
    const z = zoneOf(); if (z[0] + z[1] !== zone) { zone = z[0] + z[1]; els.head.innerHTML = `<small>Overlord island</small><h1>${z[0]}</h1><p>${z[1]}</p>`; }
    if (build.on && !inPlot()) { build.on = false; drawBuild(); drawDock(); if (ghost) ghost.visible = false; }
    if (toastT > 0) { toastT -= dt; if (toastT <= 0) els.toast.classList.remove('on'); }
    const near = (x, zz, r) => Math.max(0, 1 - Math.hypot(P.x - x, P.z - zz) / r); ambience({ wind: 0.25 + 0.6 * Math.max(0, world.edge(P.x, P.z) - 0.55) * 2 + Math.max(0, P.y - G - 4) * 0.05, water: Math.max(near(47.5, 47.5, 13), near(SITES.pond.x, SITES.pond.z, 12), near(61.5, 48.5, 9), near(fallX, 59, 18) * 1.3), birds: 1 }, dt);
    saveT += dt; if (saveT > 2.5) { saveT = 0; keep(); }
  }
  function keep() { state.game.pos = [+P.x.toFixed(2), +P.y.toFixed(2), +P.z.toFixed(2), +cam.yaw.toFixed(2)]; save(state); }
  let frameN = 0, photo = null;
  function loop() { if (!api.active) return; const dt = Math.min(clock.getDelta(), 0.05); frameMs += (dt * 1000 - frameMs) * 0.05; const _t0 = performance.now(); step(dt); const _t1 = performance.now(); api._dbg.stepMs += (_t1 - _t0 - api._dbg.stepMs) * 0.1; if (photo) { camera.position.set(photo[0], photo[1], photo[2]); camera.lookAt(photo[3], photo[4], photo[5]); } if (frameN++ % 2 === 0) renderer.shadowMap.needsUpdate = true; const _t2 = performance.now(); renderer.render(scene, camera); api._dbg.renderMs += (performance.now() - _t2 - api._dbg.renderMs) * 0.1; requestAnimationFrame(loop); }
  addEventListener('pagehide', () => api.active && keep());
  const api = {
    active: false, toast, setCharacter, P, cam, people, get quads() { return quads; }, get frameMs() { return frameMs; }, get info() { return renderer.info.render; }, world: () => world, keep,
    resume() { if (api.active) return; api.active = true; clock.getDelta(); setCharacter(); drawDock(); loop(); }, pause() { api.active = false; keys.clear(); quiet(); keep(); },
    photo(v) { photo = v; }, _dbg: { renderer, scene, sea, sun, clouds, blocks, water: waterMat, stepMs: 0, renderMs: 0 },   // a fixed camera for taking pictures of the island; null gives the camera back
    teleport(x, z, yaw = cam.yaw) { P.x = x; P.z = z; P.y = world.top(x, z) + 1; P.vy = 0; cam.yaw = yaw; }, toggleBuild, act, spotLabel: () => spot?.label || null, build: () => build, celebrate() { pop(P.x, P.y + 1.4, P.z); sfx('reward'); },
    blockScreen(x, y, z) { v3.set(x + 0.5, y + 0.5, z + 0.5).project(camera); const r = cv.getBoundingClientRect(); return [r.left + (v3.x + 1) / 2 * r.width, r.top + (1 - v3.y) / 2 * r.height]; },
  };
  return api;
}
