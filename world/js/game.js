// game.js: the game direction. A small block island you walk in third person. It has places (Anatomy Hall, the OR,
// Review, your plot), people (Booth, the groundskeeper), things to find (field notes) and something to build (your plot).
// SCENE SPEC (what this file is built to):
//   layout      72 x 72 m island in open sea; pier south, round plaza with fountain at the centre, hall under the north hill
//   materials   matte painted blocks with baked corner shading; glass is clear and faintly blue; lamps and coral glow
//   lighting    late-afternoon sun from the south-west (warm, soft shadows), cool sky fill, pale peach haze at the horizon
//   landmarks   teal hall roof, coral door frame, terracotta Review roof, the coral dot on the fountain
//   movement    leaves and hedges sway, water moves, clouds drift, field notes turn, two people go about their day
//   performance one mesh per material (4 draw calls for all blocks), instanced plants and clouds, fixed shadow frustum,
//               pixel ratio capped (2 desktop, 1.5 touch), no post-processing
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { W, D, H, SEA, B, GROUND, SITES, LAMPS, BENCHES, PLACEABLE, generate, mesh, castBlock } from './voxel.js';
import { buildAvatar } from './avatar.js';
import { save, summary, dueNow } from './save.js';

const NOTES = {
  dock: 'C5 and C6 join as the superior trunk. C7 goes on alone as the middle trunk. C8 and T1 join as the inferior trunk.',
  east: 'At the first rib the subclavian vein passes in front of the anterior scalene. The artery and the plexus pass behind it.',
  west: 'Every trunk splits in two. All three posterior divisions join into one posterior cord, and from it come the axillary and radial nerves.',
  hill: 'An interscalene block sits high, around the superior and middle trunks. The inferior trunk is the one it tends to miss.',
};
const ITEMS = { plank: ['Plank', '#cfa672'], glass: ['Glass', '#bfe3f2'], lamp: ['Lamp', '#ffe9b8'], hedge: ['Hedge', '#4a9a55'], plexus: ['Plexus model', '#f2cf55'] };

export async function createWorld({ host, state, touch, els, onEnterHall, onLink }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, touch ? 1.5 : 2)); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; host.appendChild(renderer.domElement);
  const scene = new THREE.Scene(), HAZE = new THREE.Color('#f6dfc0'); scene.fog = new THREE.Fog(HAZE, 55, 240);
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 600);
  const size = () => { const w = host.clientWidth || 1, h = host.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  new ResizeObserver(size).observe(host); size();

  // sky, sun, haze
  const SUN = new THREE.Vector3(-0.55, 0.62, 0.56).normalize();
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(500, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, uniforms: { sun: { value: SUN } },
    vertexShader: 'varying vec3 d; void main(){ d = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
    fragmentShader: 'uniform vec3 sun; varying vec3 d; void main(){ float h = clamp(d.y, -0.2, 1.); vec3 c = mix(vec3(.965,.875,.753), vec3(.36,.66,.90), pow(smoothstep(-.02, .75, h), .7)); float s = max(dot(normalize(d), sun), 0.); c += vec3(1.,.82,.55) * (pow(s, 6.) * .28 + pow(s, 260.) * 1.6); gl_FragColor = vec4(c, 1.); }' })));
  const sun = new THREE.DirectionalLight(0xfff0d4, 3.1); sun.position.copy(SUN).multiplyScalar(120).add(new THREE.Vector3(36, 0, 36)); sun.target.position.set(36, 6, 36);
  sun.castShadow = true; sun.shadow.mapSize.set(touch ? 2048 : 4096, touch ? 2048 : 4096); Object.assign(sun.shadow.camera, { left: -52, right: 52, top: 52, bottom: -52, near: 20, far: 260 }); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.04; sun.shadow.radius = 3;
  scene.add(sun, sun.target, new THREE.HemisphereLight(0xcfe9ff, 0xc7ab82, 1.05));

  // the island
  let world = generate(state.game.plot);
  const uTime = { value: 0 };
  const mSolid = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.93, metalness: 0 });
  const mLeaf = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 });
  mLeaf.onBeforeCompile = (s) => { s.uniforms.uTime = uTime; s.vertexShader = 'uniform float uTime;\n' + s.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n float ph = position.x * .7 + position.z * .6 + position.y * .9; transformed.x += sin(uTime * 1.25 + ph) * .045; transformed.z += cos(uTime * 1.05 + ph * 1.3) * .04;'); };
  const mGlass = new THREE.MeshPhysicalMaterial({ vertexColors: true, transparent: true, opacity: 0.34, roughness: 0.08, metalness: 0, side: THREE.DoubleSide, depthWrite: false });
  const mGlow = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false });
  const blocks = { solid: new THREE.Mesh(new THREE.BufferGeometry(), mSolid), leaf: new THREE.Mesh(new THREE.BufferGeometry(), mLeaf), glass: new THREE.Mesh(new THREE.BufferGeometry(), mGlass), glow: new THREE.Mesh(new THREE.BufferGeometry(), mGlow) };
  for (const k of ['solid', 'leaf']) { blocks[k].castShadow = true; blocks[k].receiveShadow = true; } blocks.glow.castShadow = true; blocks.glass.renderOrder = 2;
  scene.add(...Object.values(blocks)); let quads = 0;
  function remesh() { const g = mesh(world); for (const k of Object.keys(blocks)) { blocks[k].geometry.dispose(); blocks[k].geometry = g[k]; } quads = g.quads; syncPlinths(); }

  // water
  const water = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400, 1, 1), new THREE.ShaderMaterial({ transparent: true, uniforms: { uTime, haze: { value: HAZE }, sun: { value: SUN } },
    vertexShader: 'varying vec3 wp; void main(){ vec4 w = modelMatrix * vec4(position, 1.); wp = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `uniform float uTime; uniform vec3 haze, sun; varying vec3 wp;
      void main(){ vec2 p = wp.xz; float w = sin(p.x * .55 + uTime * .9) * sin(p.y * .47 - uTime * .7) + .5 * sin((p.x + p.y) * 1.3 + uTime * 1.6) + .25 * sin(p.x * 2.9 - p.y * 2.1 + uTime * 2.3);
        vec3 n = normalize(vec3(dFdx(w) * 1.8, 1., dFdy(w) * 1.8)); vec3 v = normalize(cameraPosition - wp); float fres = pow(1. - max(dot(n, v), 0.), 3.);
        float d = length(wp.xz - vec2(36.)); vec3 c = mix(vec3(.20,.66,.70), vec3(.07,.33,.52), smoothstep(30., 70., d)); c = mix(c, vec3(.78,.90,.96), fres * .55);
        c += vec3(1.,.9,.7) * pow(max(dot(reflect(-sun, n), v), 0.), 90.) * .9; c += smoothstep(.72, 1., w * .5 + .5) * .05;
        float fog = smoothstep(70., 260., length(cameraPosition - wp)); gl_FragColor = vec4(mix(c, haze, fog), mix(.8, 1., fres)); }` }));
  water.rotation.x = -Math.PI / 2; water.position.set(36, SEA, 36); scene.add(water);

  // plants on the grass: tufts and flowers, placed by a fixed hash so they never move
  { const tuft = new THREE.InstancedMesh(new THREE.BoxGeometry(0.07, 0.34, 0.07), new THREE.MeshStandardMaterial({ color: '#63b04b', roughness: 0.9 }), 3200), stem = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.32, 0.05), new THREE.MeshStandardMaterial({ color: '#4f9a45' }), 420), petal = new THREE.InstancedMesh(new THREE.BoxGeometry(0.2, 0.14, 0.2), new THREE.MeshStandardMaterial({ roughness: 0.7 }), 420);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), c = new THREE.Color(), cols = ['#ff5a3c', '#fff6e6', '#ffd95a', '#f7a8c4', '#b79cf2']; let nt = 0, nf = 0;
    const h3 = (x, z, k) => { let n = Math.imul(x + 11, 73856093) ^ Math.imul(z + 7, 19349663) ^ Math.imul(k, 83492791); n = Math.imul(n ^ n >>> 13, 1274126177); return ((n ^ n >>> 16) >>> 0) / 4294967296; };
    for (let x = 1; x < W - 1; x++) for (let z = 1; z < D - 1; z++) { const y = world.grassAt(x, z); if (y < 0 || world.get(x, y + 1, z)) continue;
      const k = Math.floor(h3(x, z, 1) * 4); for (let i = 0; i < k && nt < 3200; i++) { const s = 0.6 + h3(x, z, 10 + i) * 1.3; q.setFromEuler(new THREE.Euler((h3(x, z, 30 + i) - 0.5) * 0.5, h3(x, z, 40 + i) * 6, (h3(x, z, 50 + i) - 0.5) * 0.5)); m.compose(new THREE.Vector3(x + h3(x, z, 60 + i), y + 1 + 0.17 * s, z + h3(x, z, 70 + i)), q, sc.set(1, s, 1)); tuft.setMatrixAt(nt++, m); }
      if (h3(x, z, 2) > 0.86 && nf < 420) { const px = x + 0.25 + h3(x, z, 3) * 0.5, pz = z + 0.25 + h3(x, z, 4) * 0.5; m.makeTranslation(px, y + 1.16, pz); stem.setMatrixAt(nf, m); m.makeTranslation(px, y + 1.37, pz); petal.setMatrixAt(nf, m); petal.setColorAt(nf, c.set(cols[Math.floor(h3(x, z, 5) * cols.length)])); nf++; } }
    tuft.count = nt; stem.count = petal.count = nf; tuft.receiveShadow = true; petal.castShadow = true; scene.add(tuft, stem, petal); }
  // clouds
  const clouds = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, emissive: '#fff3e0', emissiveIntensity: 0.25, fog: false }), 60), cloudSeeds = [];
  { const r = (n) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); }; for (let i = 0; i < 12; i++) for (let j = 0; j < 5; j++) cloudSeeds.push({ x: r(i) * 420 - 190, y: 46 + r(i + 20) * 26, z: r(i + 40) * 420 - 190, ox: (r(i * 9 + j) - 0.5) * 16, oy: (r(i * 5 + j + 3) - 0.5) * 2.4, oz: (r(i * 7 + j + 6) - 0.5) * 9, sx: 7 + r(i + j * 3) * 9, sy: 2.4 + r(i * 2 + j) * 2, sz: 6 + r(i * 3 + j) * 6 }); scene.add(clouds); }
  let dot = null, motes = null;
  // street furniture: slim things are modelled, not built from metre blocks
  { const dark = new THREE.MeshStandardMaterial({ color: '#2b3037', roughness: 0.6 }), wood = new THREE.MeshStandardMaterial({ color: '#c79b66', roughness: 0.8 }), glowM = new THREE.MeshBasicMaterial({ color: '#ffe7b0', toneMapped: false });
    const put = (geo, m, x, y, z, ry = 0) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.rotation.y = ry; o.castShadow = m !== glowM; o.receiveShadow = true; scene.add(o); return o; };
    const post = new THREE.BoxGeometry(0.13, 2.7, 0.13), foot = new THREE.BoxGeometry(0.34, 0.12, 0.34), head = new THREE.BoxGeometry(0.36, 0.42, 0.36), cap = new THREE.BoxGeometry(0.5, 0.07, 0.5);
    for (const [x, z] of LAMPS) { const y = world.top(x, z) + 1; put(post, dark, x, y + 1.35, z); put(foot, dark, x, y + 0.06, z); put(head, glowM, x, y + 2.9, z); put(cap, dark, x, y + 3.14, z); }
    const seat = new THREE.BoxGeometry(2.3, 0.1, 0.56), back = new THREE.BoxGeometry(2.3, 0.5, 0.08), leg = new THREE.BoxGeometry(0.1, 0.46, 0.5);
    for (const [x, z, ry] of BENCHES) { const y = world.top(x, z) + 1, g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; scene.add(g); for (const [geo, m, px, py, pz] of [[seat, wood, 0, 0.5, 0], [back, wood, 0, 0.92, -0.25], [leg, dark, -0.95, 0.23, 0], [leg, dark, 0.95, 0.23, 0]]) { const o = new THREE.Mesh(geo, m); o.position.set(px, py, pz); o.castShadow = true; o.receiveShadow = true; g.add(o); } }
    // the notice board, facing the plaza
    { const g = new THREE.Group(), y = world.top(SITES.board.x, SITES.board.z) + 1; g.position.set(SITES.board.x + 0.9, y, SITES.board.z + 0.9); g.rotation.y = Math.atan2(36.5 - g.position.x, 38.5 - g.position.z); scene.add(g);
      const add = (w, h, d, m, x, yy, z) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, yy, z); o.castShadow = true; g.add(o); };
      add(0.12, 2.2, 0.12, dark, -0.95, 1.1, 0); add(0.12, 2.2, 0.12, dark, 0.95, 1.1, 0); add(2.0, 1.25, 0.08, wood, 0, 1.5, 0); add(2.2, 0.1, 0.3, dark, 0, 2.2, 0);
      for (const [x, yy, w, h, c] of [[-0.55, 1.65, 0.5, 0.62, '#f6f3ea'], [0.1, 1.72, 0.46, 0.5, '#f6f3ea'], [0.62, 1.6, 0.36, 0.7, '#ff5a3c'], [0.05, 1.2, 0.6, 0.3, '#fff3c4']]) add(w, h, 0.02, new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 }), x, yy, 0.055); }
    // the fountain: still water in the basin and the Overlord dot above it
    const pool = put(new THREE.CylinderGeometry(1.95, 1.95, 0.5, 40), new THREE.MeshPhysicalMaterial({ color: '#3fb0c0', roughness: 0.05, transparent: true, opacity: 0.82 }), 36.5, GROUND + 1.35, 38.5); pool.castShadow = false;
    put(new THREE.CylinderGeometry(0.16, 0.24, 1.7, 16), dark, 36.5, GROUND + 2.2, 38.5);
    dot = put(new THREE.SphereGeometry(0.46, 32, 20), new THREE.MeshBasicMaterial({ color: '#ff5a3c', toneMapped: false }), 36.5, GROUND + 3.7, 38.5);
    // pollen in the afternoon light
    const n = 260, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { pos[i * 3] = Math.random() * W; pos[i * 3 + 1] = GROUND + 1 + Math.random() * 9; pos[i * 3 + 2] = Math.random() * D; }
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); motes = new THREE.Points(pg, new THREE.PointsMaterial({ color: '#fff6d8', size: 0.09, transparent: true, opacity: 0.75, depthWrite: false })); scene.add(motes); }
  // signs
  for (const s of [SITES.hall, SITES.or, SITES.review, SITES.plot, SITES.regional]) {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 200; const g = c.getContext('2d'); g.font = "500 92px 'Inter Tight', system-ui, sans-serif"; const tw = g.measureText(s.sign).width, w = Math.min(1000, tw + 150);
    g.fillStyle = 'rgba(14,16,20,.92)'; g.beginPath(); g.roundRect((1024 - w) / 2, 20, w, 160, 80); g.fill(); g.fillStyle = '#ff5a3c'; g.beginPath(); g.arc((1024 - w) / 2 + 62, 100, 15, 0, 7); g.fill(); g.fillStyle = '#f4f4f2'; g.textBaseline = 'middle'; g.fillText(s.sign, (1024 - w) / 2 + 100, 104, 880);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; const p = new THREE.Mesh(new THREE.PlaneGeometry(5.6 * (s === SITES.regional ? 1.25 : 1) * 0.82, 0.9), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }));
    p.position.set(...s.signAt); p.rotation.y = s.signYaw; scene.add(p);
    if (s === SITES.plot) { const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.9, 0.14), new THREE.MeshStandardMaterial({ color: '#74543a' })); post.position.set(s.signAt[0], 7.9, s.signAt[2]); post.castShadow = true; scene.add(post); p.scale.setScalar(0.6); }
  }
  // field notes: coral cards that turn slowly until you walk into them
  const noteMeshes = SITES.notes.map((n) => { const g = new THREE.Group(), card = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.66, 0.05), new THREE.MeshBasicMaterial({ color: '#ff5a3c', toneMapped: false })), line = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.06), new THREE.MeshBasicMaterial({ color: '#fff', toneMapped: false })); line.position.y = 0.14; const l2 = line.clone(); l2.position.y = 0; const l3 = line.clone(); l3.position.y = -0.14; l3.scale.x = 0.6; g.add(card, line, l2, l3);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.56, 40), new THREE.MeshBasicMaterial({ color: '#ff5a3c', transparent: true, opacity: 0.7, side: THREE.DoubleSide, toneMapped: false })); ring.rotation.x = -Math.PI / 2;
    const y = world.top(n.x, n.z) + 1; g.position.set(n.x, y + 1.25, n.z); ring.position.set(n.x, y + 0.04, n.z); g.visible = ring.visible = !state.game.notes.includes(n.id); scene.add(g, ring); return { n, g, ring }; });

  // the plexus model on its plinth: the real nerves from the atlas, three times life size, on your plot
  let plexusProto = null; const plinths = new Map();
  async function loadPlexus() { if (plexusProto) return plexusProto; const draco = new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/gltf/'); const g = await new GLTFLoader().setDRACOLoader(draco).loadAsync('../assets/models/plexus/plexus-right-overlord-v2.glb'), grp = new THREE.Group();
    const keep = /trunk_of|division|cord_of|suprascapular_nerve|clavicle_r/; /* the supraclavicular plexus, about ten times life size */ const mn = new THREE.MeshStandardMaterial({ color: '#f5d255', roughness: 0.35, emissive: '#8a6a12' }), mb = new THREE.MeshStandardMaterial({ color: '#efe8d8', roughness: 0.7 });
    g.scene.traverse((o) => { if (o.isMesh && keep.test(o.name)) { const c = new THREE.Mesh(o.geometry, o.userData.layer === 'nerve' ? mn : mb); c.castShadow = true; grp.add(c); } });
    const bb = new THREE.Box3().setFromObject(grp), ctr = bb.getCenter(new THREE.Vector3()); for (const c of grp.children) c.position.set(-ctr.x, -bb.min.y, -ctr.z); const sz = bb.getSize(new THREE.Vector3()), k = 2.0 / Math.max(sz.x, sz.y, sz.z); grp.scale.setScalar(k); plexusProto = grp; return grp; }
  function syncPlinths() { const want = new Set(state.game.plot.filter((p) => p[3] === B.PLINTH).map((p) => p.slice(0, 3).join(','))); for (const [k, g] of plinths) if (!want.has(k)) { scene.remove(g); plinths.delete(k); }
    for (const k of want) if (!plinths.has(k)) { const holder = new THREE.Group(), [x, y, z] = k.split(',').map(Number); holder.position.set(x + 0.5, y + 1, z + 0.5); plinths.set(k, holder); scene.add(holder); loadPlexus().then((p) => holder.add(p.clone())); } }
  remesh();

  // people
  const people = [], bubbles = document.createElement('div'); bubbles.className = 'labels'; host.parentElement.appendChild(bubbles);
  function person(name, look, x, z, route, say) { const a = buildAvatar(look); a.position.set(x, world.top(x, z) + 1, z); scene.add(a); const el = document.createElement('span'); el.style.maxWidth = '300px'; el.style.whiteSpace = 'normal'; el.style.opacity = 0; bubbles.appendChild(el); const p = { name, a, route, say, el, i: 0, wait: 0, near: false, t: Math.random() * 9 }; people.push(p); return p; }
  const sum = () => summary(state);
  person('Booth', { skin: 3, hair: 'fade', hairColor: 0, scrubs: 6, glasses: true, steth: false }, SITES.booth.x, SITES.booth.z, null, () => {
    const g = state.game, due = dueNow(state).length;
    if (g.rewards.includes('nerve-stimulator')) return g.plot.some((p) => p[3] === B.PLINTH) ? (due ? `${due} structures are due again. They will not get easier by being avoided. I checked.` : 'Nice plot. The regional pavilion is next, when they finish building it.') : 'A nerve stimulator. It suits you. The plexus model goes on your plot, south-east. Press B when you are standing in it.';
    if (due) return `You have ${due} due in Anatomy Hall. Short visit. I will hold your coffee.`;
    if (g.lessonDone) return 'You did the lesson. The challenge is the same room with the labels taken away. Unkind, but it works.';
    return 'Booth. I run the simulator. Anatomy Hall is north, under the hill. There is a plexus in there nobody has labelled for you.'; });
  person('Groundskeeper', { skin: 1, hair: 'bun', hairColor: 4, scrubs: 3, cap: false, steth: false }, 33, 45, [[33, 45], [41, 45.5], [43, 39], [41, 32.5], [33, 32], [30.5, 38.5]], () => 'Mind the hedge. It is the only thing on this island that grows without being tested first.');

  // the player
  let avatar = null; const P = { x: SITES.spawn.x, y: 5, z: SITES.spawn.z, vy: 0, ground: false, face: Math.PI, speed: 0 }, cam = { yaw: 0, pitch: 0.46, dist: 9.5 };
  function setCharacter() { if (avatar) scene.remove(avatar); avatar = buildAvatar(state.character, state.game.rewards); scene.add(avatar); }
  setCharacter();
  if (state.game.pos) Object.assign(P, { x: state.game.pos[0], y: state.game.pos[1], z: state.game.pos[2] }), cam.yaw = state.game.pos[3] ?? 0; else P.y = world.top(P.x, P.z) + 1;
  const blocked = (x, y, z) => { for (let bx = Math.floor(x - 0.3); bx <= Math.floor(x + 0.3); bx++) for (let by = Math.floor(y + 0.001); by <= Math.floor(y + 1.74); by++) for (let bz = Math.floor(z - 0.3); bz <= Math.floor(z + 0.3); bz++) if (world.get(bx, by, bz)) return true; return x < 0.4 || z < 0.4 || x > W - 0.4 || z > D - 0.4; };
  if (blocked(P.x, P.y, P.z)) P.y = world.top(P.x, P.z) + 1;

  // input
  const keys = new Set(), stick = { x: 0, y: 0 }; let wantJump = false, build = { on: false, item: 'plank' }, ghost = null;
  const onKey = (e, d) => { if (e.target.tagName === 'INPUT') return; d ? keys.add(e.code) : keys.delete(e.code); if (d && e.code === 'Space') { wantJump = true; e.preventDefault(); } if (d && e.code === 'KeyE') act(); if (d && e.code === 'KeyB') toggleBuild(); if (/^Arrow/.test(e.code)) e.preventDefault(); };
  addEventListener('keydown', (e) => api.active && onKey(e, true)); addEventListener('keyup', (e) => onKey(e, false));
  const cv = renderer.domElement; let drag = null;
  cv.addEventListener('pointerdown', (e) => { cv.setPointerCapture(e.pointerId); drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now() }; });
  cv.addEventListener('pointermove', (e) => { if (drag) { cam.yaw -= (e.clientX - drag.x) * 0.0055; cam.pitch = THREE.MathUtils.clamp(cam.pitch + (e.clientY - drag.y) * 0.004, -0.12, 1.25); drag.x = e.clientX; drag.y = e.clientY; } else if (build.on) aim(e); });
  cv.addEventListener('pointerup', (e) => { if (drag && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 7 && performance.now() - drag.t < 500 && build.on) { aim(e); place(); } drag = null; });
  cv.addEventListener('wheel', (e) => { cam.dist = THREE.MathUtils.clamp(cam.dist * (1 + Math.sign(e.deltaY) * 0.09), 3.2, 16); e.preventDefault(); }, { passive: false });
  { const s = els.stick, knob = s.firstElementChild; let id = null; const set = (e) => { const r = s.getBoundingClientRect(); let x = (e.clientX - r.left - r.width / 2) / (r.width / 2), y = (e.clientY - r.top - r.height / 2) / (r.height / 2); const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; } stick.x = x; stick.y = y; knob.style.transform = `translate(${x * 34}px, ${y * 34}px)`; };
    s.addEventListener('pointerdown', (e) => { id = e.pointerId; s.setPointerCapture(id); set(e); }); s.addEventListener('pointermove', (e) => e.pointerId === id && set(e)); const end = () => { id = null; stick.x = stick.y = 0; knob.style.transform = ''; }; s.addEventListener('pointerup', end); s.addEventListener('pointercancel', end);
    els.jump.addEventListener('pointerdown', () => { wantJump = true; }); els.act.addEventListener('pointerdown', () => act()); }

  // things you can walk up to
  const inPlot = () => P.x >= SITES.plot.x0 - 0.5 && P.x <= SITES.plot.x1 + 1.5 && P.z >= SITES.plot.z0 - 0.5 && P.z <= SITES.plot.z1 + 1.5;
  const SPOTS = [
    { at: SITES.hall, r: 2.6, label: 'Enter Anatomy Hall', run: () => onEnterHall() },
    { at: SITES.or, r: 2.4, label: 'Open Mock OR Day (leaves the island)', run: () => onLink('../student.html') },
    { at: SITES.review, r: 2.4, label: 'Open Review (leaves the island)', run: () => onLink('../index.html') },
    { at: SITES.regional, r: 3, label: 'Read the site notice', run: () => toast('Not built yet. Planned here: needle path and ultrasound view on the same anatomy you just learned in the Hall.', 6) },
    { at: { x: SITES.board.x + 0.9, z: SITES.board.z + 0.9 }, r: 2.4, label: 'Read the notice board', run: () => { const s = sum(), d = dueNow(state); toast(s.attempts ? `<b>Your record.</b> Identified ${s.identified ?? '–'}%, applied ${s.applied ?? '–'}%, from ${s.attempts} unaided answers. ${d.length ? d.length + ' due now in Anatomy Hall.' : 'Nothing due right now.'} Field notes ${state.game.notes.length} of 4.` : 'Nothing on your record yet. Anatomy Hall is north.', 7); } },
  ];
  let spot = null;
  function act() { if (!api.active) return; if (spot) spot.run(); }
  els.prompt.addEventListener('click', act);
  let toastT = 0; function toast(html, seconds = 4.5) { els.toast.innerHTML = html; els.toast.classList.add('on'); toastT = seconds; }

  // building, on your plot only
  function drawBuild() { const inv = state.game.inventory; els.build.hidden = !build.on; els.build.innerHTML = Object.entries(ITEMS).filter(([k]) => k !== 'plexus' || inv.plexus > 0 || state.game.plot.some((p) => p[3] === B.PLINTH)).map(([k, [n, c]]) => `<button data-item="${k}" class="${build.item === k ? 'on' : ''}"><i style="background:${c}"></i>${n}<span>${inv[k] || 0}</span></button>`).join('') + `<button data-item="remove" class="${build.item === 'remove' ? 'on' : ''}"><i style="background:#30353c"></i>Take back<span></span></button>`;
    els.build.querySelectorAll('button').forEach((b) => b.onclick = () => { build.item = b.dataset.item; drawBuild(); }); }
  function toggleBuild() { if (!api.active) return; if (!build.on && !inPlot()) return toast('Building happens on your plot, south-east of the plaza.'); build.on = !build.on; if (ghost) ghost.visible = false; drawBuild(); drawDock(); if (build.on) toast(touch ? 'Tap a block on your plot to build against it.' : 'Click a block on your plot to build against it. B to stop.'); }
  let target = null;
  function aim(e) { const r = cv.getBoundingClientRect(), ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera); const h = castBlock(world, ray.ray.origin, ray.ray.direction, 40); const p = SITES.plot; target = null;
    if (h) { const c = build.item === 'remove' ? h.hit : h.before; if (c && c[0] >= p.x0 && c[0] <= p.x1 && c[2] >= p.z0 && c[2] <= p.z1 && c[1] > GROUND && c[1] < GROUND + 9) target = c; }
    if (!ghost) { ghost = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.02, 1.02, 1.02)), new THREE.LineBasicMaterial({ color: '#ffffff' })); scene.add(ghost); } ghost.visible = !!target; if (target) ghost.position.set(target[0] + 0.5, target[1] + 0.5, target[2] + 0.5); }
  function place() { if (!target) return toast('Only on your plot, and no higher than eight blocks.'); const [x, y, z] = target, g = state.game, inv = g.inventory;
    if (build.item === 'remove') { const i = g.plot.findIndex((p) => p[0] === x && p[1] === y && p[2] === z); if (i < 0) return; const t = g.plot[i][3], k = Object.keys(PLACEABLE).find((n) => PLACEABLE[n] === t); g.plot.splice(i, 1); inv[k] = (inv[k] || 0) + 1; world.set(x, y, z, 0); }
    else { if (!(inv[build.item] > 0)) return toast(`No ${ITEMS[build.item][0].toLowerCase()} left. Correct answers in Anatomy Hall earn more.`); if (world.get(x, y, z)) return; if (Math.abs(x + 0.5 - P.x) < 0.8 && Math.abs(z + 0.5 - P.z) < 0.8 && y + 1 > P.y && y < P.y + 1.8) return toast('You are standing there.'); inv[build.item]--; g.plot.push([x, y, z, PLACEABLE[build.item]]); world.set(x, y, z, PLACEABLE[build.item]); }
    remesh(); save(state); drawBuild(); drawDock(); ghost.visible = false; }
  function drawDock() { const inv = state.game.inventory, n = Object.values(inv).reduce((a, b) => a + b, 0); els.dock.innerHTML = `<button class="chip ${build.on ? 'on' : ''}" id="bBuild">${build.on ? 'Stop building' : 'Build'}</button><span class="chip">Blocks ${n}</span><span class="chip">Field notes ${state.game.notes.length} of 4</span><div class="note">${touch ? 'Stick to walk, drag to look' : 'W A S D to walk · drag to look · Space to jump · E to use · B to build'}</div>`; els.dock.querySelector('#bBuild').onclick = toggleBuild; }
  drawDock();

  const zoneOf = () => { const d = (s) => Math.hypot(P.x - s.x, P.z - s.z); if (inPlot()) return ['Your plot', build.on ? 'Building. What you place here stays.' : 'Yours to build on. Press B, or the Build button.']; if (P.z > 60.5) return ['The pier', 'The island is north.']; if (d(SITES.hall) < 9) return ['Anatomy Hall', 'A real plexus, a lesson, and a challenge with no labels.']; if (d(SITES.or) < 8) return ['The OR', 'Mock OR Day and the live simulator.']; if (d(SITES.review) < 8) return ['Review', 'Question modes and free recall.']; if (d(SITES.regional) < 8) return ['Regional pavilion', 'Being built.']; if (Math.hypot(P.x - 36.5, P.z - 38.5) < 8) return ['The plaza', 'Booth is by the notice board.']; return ['The island', 'Coral cards are field notes. Walk into one.']; };
  let zone = '';
  const clock = new THREE.Clock(), v3 = new THREE.Vector3(); let saveT = 0, frameMs = 16, wetT = 0;
  function step(dt) {
    uTime.value += dt;
    // move
    let f = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) - stick.y, s = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0) + stick.x;
    const l = Math.hypot(f, s); if (l > 1) { f /= l; s /= l; }
    const sp = 4.7 * (keys.has('ShiftLeft') ? 1.5 : 1), mx = (-Math.sin(cam.yaw) * f + Math.cos(cam.yaw) * s) * sp, mz = (-Math.cos(cam.yaw) * f - Math.sin(cam.yaw) * s) * sp;
    const tryAxis = (nx, nz) => { if (!blocked(nx, P.y, nz)) { P.x = nx; P.z = nz; return; } if (P.ground && !blocked(nx, P.y + 1.05, nz) && !blocked(P.x, P.y + 1.05, P.z)) P.vy = Math.max(P.vy, 7.3); };
    if (mx) tryAxis(P.x + mx * dt, P.z); if (mz) tryAxis(P.x, P.z + mz * dt);
    if (wantJump && P.ground) P.vy = 7.3; wantJump = false;
    P.vy -= 22 * dt; const ny = P.y + P.vy * dt;
    if (!blocked(P.x, ny, P.z)) { P.y = ny; P.ground = false; } else { if (P.vy < 0) { P.y = Math.floor(ny) + 1; P.ground = true; } P.vy = 0; }
    P.speed = Math.hypot(mx, mz); if (P.speed > 0.2) { let d = Math.atan2(mx, mz) - P.face; d = Math.atan2(Math.sin(d), Math.cos(d)); P.face += d * Math.min(1, dt * 12); }
    if (P.y < SEA - 0.9) { wetT += dt; if (wetT > 0.5) { Object.assign(P, { x: SITES.spawn.x, z: SITES.spawn.z, y: 5, vy: 0 }); cam.yaw = 0; wetT = 0; toast('Scrubs are not swimwear. Back on the pier.'); } } else wetT = 0;
    avatar.position.set(P.x, P.y, P.z); avatar.rotation.y = P.face; avatar.userData.update(dt, P.speed, !P.ground);
    // camera: behind and above, pulled in if a wall is in the way
    const tx = P.x, ty = P.y + 1.55, tz = P.z, cx = Math.sin(cam.yaw) * Math.cos(cam.pitch), cy = Math.sin(cam.pitch), cz = Math.cos(cam.yaw) * Math.cos(cam.pitch); let dist = cam.dist;
    for (let d = 0.6; d < cam.dist; d += 0.3) { const t = world.get(Math.floor(tx + cx * d), Math.floor(ty + cy * d), Math.floor(tz + cz * d)); if (t && t !== B.LEAF && t !== B.LEAF2 && t !== B.GLASS && t !== B.HEDGE) { dist = Math.max(1.1, d - 0.35); break; } }
    camera.position.set(tx + cx * dist, Math.max(ty + cy * dist, SEA + 0.4), tz + cz * dist); camera.lookAt(tx, ty, tz);
    // people
    for (const p of people) { p.t += dt; let spd = 0;
      const dP = Math.hypot(P.x - p.a.position.x, P.z - p.a.position.z); p.near = dP < 3.4;
      if (p.route && !p.near) { const [gx, gz] = p.route[p.i], dx = gx - p.a.position.x, dz = gz - p.a.position.z, d = Math.hypot(dx, dz); if (p.wait > 0) p.wait -= dt; else if (d < 0.25) { p.i = (p.i + 1) % p.route.length; p.wait = 1.5 + (p.i % 2) * 2.5; } else { spd = 1.5; p.a.position.x += dx / d * spd * dt; p.a.position.z += dz / d * spd * dt; p.a.rotation.y = Math.atan2(dx, dz); } }
      if (p.near) { let d = Math.atan2(P.x - p.a.position.x, P.z - p.a.position.z) - p.a.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); p.a.rotation.y += d * Math.min(1, dt * 6); }
      p.a.position.y = world.top(p.a.position.x, p.a.position.z) + 1; p.a.userData.update(dt, spd); if (p.near && p.name === 'Booth' && p.t % 6 < 1.4) p.a.userData.wave(p.t);
      if (p.near) { v3.set(p.a.position.x, p.a.position.y + 2.25, p.a.position.z).project(camera); const r = cv.getBoundingClientRect(); p.el.innerHTML = `<b style="color:#ff8a6b;font-weight:500">${p.name}</b> &nbsp;${p.say()}`; p.el.style.transform = `translate(${(v3.x + 1) / 2 * r.width}px, ${(1 - v3.y) / 2 * r.height}px) translate(-50%, -100%)`; p.el.style.opacity = v3.z < 1 ? 1 : 0; } else p.el.style.opacity = 0; }
    // field notes
    for (const m of noteMeshes) { if (!m.g.visible) continue; m.g.rotation.y += dt * 1.6; m.g.position.y += Math.sin(uTime.value * 2 + m.n.x) * 0.002; if (Math.hypot(P.x - m.n.x, P.z - m.n.z) < 1.1 && Math.abs(P.y - (m.g.position.y - 1.25)) < 2.5) { m.g.visible = m.ring.visible = false; state.game.notes.push(m.n.id); state.game.inventory.plank += 4; save(state); drawDock(); toast(`<b>Field note ${state.game.notes.length} of 4.</b> ${NOTES[m.n.id]} <span style="opacity:.6">Plus four planks.</span>`, 9); } }
    for (const g of plinths.values()) g.rotation.y += dt * 0.35;
    dot.position.y = GROUND + 3.7 + Math.sin(uTime.value * 1.4) * 0.12; { const a = motes.geometry.attributes.position; for (let i = 0; i < a.count; i++) { let x = a.getX(i) + dt * 0.5, y = a.getY(i) + Math.sin(uTime.value + i) * dt * 0.12; if (x > W) x = 0; a.setXYZ(i, x, y, a.getZ(i)); } a.needsUpdate = true; }
    for (let i = 0; i < cloudSeeds.length; i++) { const c = cloudSeeds[i], x = ((c.x + uTime.value * 1.1 + 190) % 420) - 190; v3.set(x + c.ox, c.y + c.oy, c.z + c.oz); clouds.setMatrixAt(i, new THREE.Matrix4().compose(v3, new THREE.Quaternion(), new THREE.Vector3(c.sx, c.sy, c.sz))); } clouds.instanceMatrix.needsUpdate = true;
    // prompts and place names
    spot = null; let best = 1e9; for (const s of SPOTS) { const d = Math.hypot(P.x - s.at.x, P.z - s.at.z); if (d < s.r && d < best) { best = d; spot = s; } }
    els.prompt.classList.toggle('on', !!spot && !build.on); if (spot) els.prompt.innerHTML = `<kbd>${touch ? 'Use' : 'E'}</kbd>${spot.label}`;
    const z = zoneOf(); if (z[0] + z[1] !== zone) { zone = z[0] + z[1]; els.head.innerHTML = `<small>Overlord island</small><h1>${z[0]}</h1><p>${z[1]}</p>`; }
    if (build.on && !inPlot()) { build.on = false; drawBuild(); drawDock(); if (ghost) ghost.visible = false; }
    if (toastT > 0) { toastT -= dt; if (toastT <= 0) els.toast.classList.remove('on'); }
    saveT += dt; if (saveT > 2.5) { saveT = 0; keep(); }
  }
  function keep() { state.game.pos = [+P.x.toFixed(2), +P.y.toFixed(2), +P.z.toFixed(2), +cam.yaw.toFixed(2)]; save(state); }
  function loop() { if (!api.active) return; const dt = Math.min(clock.getDelta(), 0.05); frameMs += (dt * 1000 - frameMs) * 0.05; step(dt); renderer.render(scene, camera); requestAnimationFrame(loop); }
  addEventListener('pagehide', () => api.active && keep());
  const api = {
    active: false, toast, setCharacter, P, cam, people, get quads() { return quads; }, get frameMs() { return frameMs; }, get info() { return renderer.info.render; }, world: () => world, keep,
    resume() { if (api.active) return; api.active = true; clock.getDelta(); setCharacter(); drawDock(); loop(); }, pause() { api.active = false; keys.clear(); keep(); },
    teleport(x, z, yaw = cam.yaw) { P.x = x; P.z = z; P.y = world.top(x, z) + 1; P.vy = 0; cam.yaw = yaw; }, toggleBuild, act, spotLabel: () => spot?.label || null, build: () => build,
    blockScreen(x, y, z) { v3.set(x + 0.5, y + 0.5, z + 0.5).project(camera); const r = cv.getBoundingClientRect(); return [r.left + (v3.x + 1) / 2 * r.width, r.top + (1 - v3.y) / 2 * r.height]; },
  };
  return api;
}
