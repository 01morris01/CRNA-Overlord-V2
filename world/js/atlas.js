// atlas.js: the gallery's examination view. One region of real, sourced anatomy that you can turn, peel by layer, isolate,
// and pick from without labels, against the dark backdrop it stands in front of. It knows nothing about lessons or scoring; js/learn.js drives it.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { STRUCTURES, HIDE } from '../data/plexus.js';

const LOOK = {   // conventional atlas colours: this is the realistic direction, so nerves are yellow, arteries red, veins blue
  bone: { color: 0xddd3bd, roughness: 0.66 }, muscle: { color: 0x8a372f, roughness: 0.52, sheen: 0.4, sheenColor: 0xff9f8a },
  artery: { color: 0xc9372c, roughness: 0.3, clearcoat: 0.5 }, vein: { color: 0x4166b5, roughness: 0.32, clearcoat: 0.4 },
  nerve: { color: 0xf2cf55, roughness: 0.38, clearcoat: 0.35 }, airway: { color: 0xbcd0db, roughness: 0.5 },
};
const WARM = new THREE.Color(0xff5a3c), PICK = new THREE.Color(0xffffff);

export async function createAtlas(host, { url = '../assets/models/plexus/plexus-right-overlord-v2.glb', touch = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, touch ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 30);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.09; controls.minDistance = 0.09; controls.maxDistance = 3.4; controls.zoomSpeed = 0.9;
  const size = () => { const w = host.clientWidth || 1, h = host.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h; w > 820 ? camera.setViewOffset(w, h, w * 0.1, 0, w, h) : camera.setViewOffset(w, h, 0, h * 0.13, w, h); camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(size); ro.observe(host); size();

  // --- two rooms for the same specimen: a daylight studio, and the dark museum of direction A
  const sky = new THREE.Mesh(new THREE.SphereGeometry(12, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false,
    uniforms: { top: { value: new THREE.Color(0xe9eef2) }, mid: { value: new THREE.Color(0xcfd8df) }, bot: { value: new THREE.Color(0x98a5b0) } },
    vertexShader: 'varying vec3 p; void main(){ p = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: 'uniform vec3 top, mid, bot; varying vec3 p; void main(){ float h = p.y; vec3 c = h > 0. ? mix(mid, top, smoothstep(0., .7, h)) : mix(mid, bot, smoothstep(0., .55, -h)); gl_FragColor = vec4(c, 1.); }' }));
  scene.add(sky);
  const key = new THREE.DirectionalLight(0xfff3e4, 2.6); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.radius = 5;
  Object.assign(key.shadow.camera, { left: -0.7, right: 0.7, top: 0.7, bottom: -0.7, near: 0.1, far: 5 });
  const rim = new THREE.DirectionalLight(0x9fcbff, 2.2), fill = new THREE.HemisphereLight(0xffffff, 0x8794a0, 0.55);
  scene.add(key, key.target, rim, fill);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(1.6, 64), new THREE.ShadowMaterial({ opacity: 0.22 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  function setRoom(mode) {
    const dark = mode === 'dark'; sky.visible = !dark; scene.background = dark ? new THREE.Color(0x000000) : null; floor.visible = !dark;
    scene.environmentIntensity = dark ? 0.3 : 0.75; fill.intensity = dark ? 0.12 : 0.5; rim.intensity = dark ? 3.4 : 1.8; renderer.toneMappingExposure = dark ? 1.0 : 0.9;
  }

  // --- the specimen
  const draco = new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/gltf/');
  const gltf = await new GLTFLoader().setDRACOLoader(draco).loadAsync(url);
  const root = gltf.scene; scene.add(root);
  const parts = new Map();   // id -> { mesh, layer, selectable, anchor, samples, shown, alpha, glow }
  root.traverse((m) => {
    if (!m.isMesh) return;
    const id = m.name, layer = m.userData.layer || 'bone';
    if (HIDE.includes(id)) { m.visible = false; return; }
    m.geometry.computeVertexNormals(); m.geometry.computeBoundingBox();
    m.material = new THREE.MeshPhysicalMaterial({ ...LOOK[layer], metalness: 0, side: THREE.DoubleSide, transparent: true, opacity: 1 });
    m.castShadow = true; m.receiveShadow = true;
    const pos = m.geometry.attributes.position, n = pos.count, stepN = Math.max(1, Math.floor(n / 90)), samples = [];
    for (let i = 0; i < n; i += stepN) samples.push(new THREE.Vector3().fromBufferAttribute(pos, i));
    // a point ON the structure near its middle, so labels and camera moves land on it and not in empty space
    const c = m.geometry.boundingBox.getCenter(new THREE.Vector3()); let anchor = samples[0], best = 1e9;
    for (const s of samples) { const d = s.distanceToSquared(c); if (d < best) { best = d; anchor = s; } }
    parts.set(id, { id, origin: m.userData.origin || 'source', what: m.userData.what || '', mesh: m, layer, selectable: m.userData.selectable !== false && m.userData.selectable !== 0, anchor: anchor.clone(), centre: c, samples, shown: true, alpha: 1, glow: 0, base: m.material.color.clone() });
  });
  const centroid = (ids) => { const v = new THREE.Vector3(); let k = 0; for (const id of ids) { const p = parts.get(id); if (p) { v.add(p.centre); k++; } } return v.multiplyScalar(1 / Math.max(1, k)); };
  const G = centroid(['superior_trunk_of_brachial_plexus_r', 'middle_trunk_of_brachial_plexus_r', 'inferior_trunk_of_brachial_plexus_r']);
  const PC = centroid(['posterior_cord_of_brachial_plexus_r']), HUM = centroid(['humerus_r']), ALL = new THREE.Box3().setFromObject(root).getCenter(new THREE.Vector3());
  const ARM = HUM.clone().lerp(G, 0.25);
  floor.position.set(ALL.x, new THREE.Box3().setFromObject(root).min.y - 0.02, ALL.z);
  key.position.set(G.x - 0.9, G.y + 1.5, G.z + 1.6); key.target.position.copy(ARM); rim.position.set(G.x + 1.2, G.y + 0.5, G.z - 1.6);
  const CORDS = centroid(['lateral_cord_of_brachial_plexus_r', 'medial_cord_of_brachial_plexus_r', 'posterior_cord_of_brachial_plexus_r']), DIVS = centroid(['anterior_division_of_middle_trunk_of_brachial_plexus_r', 'posterior_division_of_middle_trunk_of_brachial_plexus_r']);
  const AX = (() => { const p = parts.get('median_nerve_r'); let top = p.samples[0]; for (const s of p.samples) if (s.y > top.y) top = s; return top.clone(); })();
  const VIEWS = {   // [target, offset from target]. Patient's right arm is at -X, anterior is +Z.
    whole: [ALL, [-0.62, 0.1, 1.9]], anterolateral: [G, [-0.2, 0.07, 0.4]], groove: [G, [-0.13, 0.05, 0.2]], cords: [PC.clone().lerp(G, 0.3), [-0.17, 0.03, 0.24]],
    arm: [ARM, [-0.62, 0.02, 1.02]], supraclav: [DIVS, [-0.2, 0.26, 0.2]], infraclav: [CORDS, [-0.08, -0.02, 0.36]], axilla: [AX, [-0.16, -0.12, 0.4]], anterior: [G, [0, 0.02, 0.5]], lateral: [G, [-0.5, 0.04, 0.05]], posterior: [G, [-0.12, 0.1, -0.5]], superior: [G, [-0.05, 0.5, 0.12]],
  };
  let fly = null;
  function view(name, seconds = 1.1, jitter = 0) { const [t, o] = VIEWS[name] || VIEWS.whole; const off = new THREE.Vector3(o[0], o[1], o[2]); if (jitter) off.applyAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() * 2 - 1) * jitter).multiplyScalar(1 + (Math.random() * 2 - 1) * 0.12); flyTo(t.clone().add(off), t.clone(), seconds); }
  function flyTo(pos, target, seconds = 0.9) { if (seconds <= 0) { camera.position.copy(pos); controls.target.copy(target); controls.update(); return; } fly = { p0: camera.position.clone(), t0: controls.target.clone(), p1: pos, t1: target, t: 0, dur: seconds }; }
  function focus(id, seconds = 0.9) { const p = parts.get(id); if (!p) return; const dir = camera.position.clone().sub(controls.target).normalize(); const r = Math.max(0.16, p.mesh.geometry.boundingBox.getSize(new THREE.Vector3()).length() * 0.9); flyTo(p.anchor.clone().addScaledVector(dir, Math.min(r, 0.7)), p.anchor.clone(), seconds); }

  // --- visibility model: each part eases toward a target opacity; 0 = gone, small = ghost, 1 = solid
  const layerOn = { bone: true, muscle: true, artery: true, vein: true, nerve: true, airway: true }, layerGhost = {}, hidden = new Set(); let isolated = null, selected = null, hovered = null;
  const glowing = new Set();
  function target(p) {
    if (hidden.has(p.id) || !layerOn[p.layer]) return 0;
    if (isolated && !isolated.has(p.id)) return 0.05;
    if (layerGhost[p.layer] && !glowing.has(p.id) && selected !== p.id) return 0.1;
    return 1;
  }
  const markers = new Map(), markerGroup = new THREE.Group(); scene.add(markerGroup);
  function setMarkers(list) {   // [{ id, at: Vector3 }]
    markerGroup.clear(); markers.clear();
    for (const m of list || []) { const g = new THREE.Group(); g.position.copy(m.at);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.021, 0.0024, 12, 48), new THREE.MeshBasicMaterial({ color: 0xff5a3c, toneMapped: false, depthTest: false, transparent: true })); ring.renderOrder = 9;
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.0045, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, depthTest: false, transparent: true })); core.renderOrder = 10;
      const hit = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 8), new THREE.MeshBasicMaterial({ visible: false })); hit.userData.marker = m.id; g.add(ring, core, hit); markerGroup.add(g); markers.set(m.id, { g, ring, hit, chosen: false }); }
  }
  const api = {
    renderer, scene, camera, controls, parts, view, focus, setRoom, setMarkers, markers,
    centreOf: (ids) => centroid(ids), topOf: (ids) => { let top = null; for (const id of ids) for (const s of parts.get(id)?.samples || []) if (!top || s.y > top.y) top = s; return top.clone(); },
    chooseMarker(id) { for (const [k, m] of markers) m.chosen = k === id; }, markerScreen(id) { const m = markers.get(id); if (!m) return null; const v = m.g.position.clone().project(camera), r = renderer.domElement.getBoundingClientRect(); return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height }; },
    flyTo,
    /** Where a named view puts the camera (for authored lessons). */
    pose(name) { const [t, o] = VIEWS[name] || VIEWS.whole; return { pos: t.clone().add(new THREE.Vector3(o[0], o[1], o[2])), target: t.clone() }; },
    setPose(pos, target) { fly = null; camera.position.copy(pos); controls.target.copy(target); controls.update(); },
    /** Jump every structure to its final opacity and glow: used when scrubbing, so the picture depends only on the time. */
    settle() { for (const p of parts.values()) { p.alpha = target(p); p.glow = glowing.has(p.id) ? 0.7 : 0; } pulse = 0; },
    /** Draw exactly one frame now (deterministic capture). Optional width/height in pixels. */
    renderOnce({ width = 0, height = 0 } = {}) { if (width && height) { renderer.setPixelRatio(1); renderer.setSize(width, height, false); camera.aspect = width / height; camera.clearViewOffset(); camera.updateProjectionMatrix(); } paint(0); renderer.render(scene, camera); },
    setLayer(layer, on) { layerOn[layer] = on; }, layerIsOn: (l) => layerOn[l],
    ghost(layers) { for (const k of Object.keys(layerOn)) layerGhost[k] = layers.includes(k); },
    hide(id) { hidden.add(id); if (selected === id) selected = null; }, show(id) { hidden.delete(id); }, isHidden: (id) => hidden.has(id), hiddenList: () => [...hidden],
    showAll() { hidden.clear(); isolated = null; for (const k of Object.keys(layerOn)) { layerOn[k] = true; layerGhost[k] = false; } },
    isolate(ids) { isolated = ids && ids.length ? new Set(ids) : null; }, isIsolated: () => !!isolated,
    select(id) { selected = id; }, selected: () => selected,
    glow(ids) { glowing.clear(); for (const id of ids || []) glowing.add(id); },
    nameOf: (id) => STRUCTURES[id]?.name || parts.get(id)?.mesh.userData.za_name?.replace(/\.r$/, '') || id,
    /** What is under the pointer. Thin nerves and vessels are hard to hit, so within a few pixels they win. */
    pick(ev) {
      const r = renderer.domElement.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
      const ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2((x / r.width) * 2 - 1, -(y / r.height) * 2 + 1), camera);
      if (markers.size) { const mh = ray.intersectObjects([...markers.values()].map((m) => m.hit), false)[0]; if (mh) return 'marker:' + mh.object.userData.marker; }
      const live = [...parts.values()].filter((p) => p.selectable && p.alpha > 0.5);
      const hit = ray.intersectObjects(live.map((p) => p.mesh), false)[0];
      let best = null, bestD = (touch ? 22 : 11) ** 2; const v = new THREE.Vector3(), hitDist = hit ? hit.distance : Infinity;
      for (const p of live) { if (p.layer !== 'nerve' && p.layer !== 'artery' && p.layer !== 'vein') continue;
        for (const s of p.samples) { v.copy(s).project(camera); if (v.z > 1) continue; const dx = (v.x + 1) / 2 * r.width - x, dy = (1 - v.y) / 2 * r.height - y, d = dx * dx + dy * dy;
          if (d < bestD && s.distanceTo(camera.position) < hitDist + 0.012) { bestD = d; best = p; } } }
      if (hit && (hit.object.userData.layer === 'nerve' || !best)) return hit.object.name;
      return best ? best.id : hit ? hit.object.name : null;
    },
    hover(id) { hovered = id; },
    screenOf(id) { const p = parts.get(id); if (!p) return null; const v = p.anchor.clone().project(camera), r = renderer.domElement.getBoundingClientRect(); return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height, behind: v.z > 1, alpha: p.alpha }; },
    running: false, start() { if (!api.running) { api.running = true; clock.getDelta(); loop(); } }, stop() { api.running = false; },
    onFrame: null, dispose() { api.stop(); ro.disconnect(); renderer.dispose(); renderer.domElement.remove(); },
  };
  const clock = new THREE.Clock(); let pulse = 0;
  function loop() {
    if (!api.running) return; const dt = Math.min(clock.getDelta(), 0.05); pulse += dt;
    if (fly) { fly.t = Math.min(1, fly.t + dt / fly.dur); const k = fly.t * fly.t * (3 - 2 * fly.t); camera.position.lerpVectors(fly.p0, fly.p1, k); controls.target.lerpVectors(fly.t0, fly.t1, k); if (fly.t >= 1) fly = null; }
    controls.update();
    paint(dt);
    for (const m of markers.values()) { m.g.quaternion.copy(camera.quaternion); const k = m.chosen ? 1.5 + 0.12 * Math.sin(pulse * 5) : 1 + 0.06 * Math.sin(pulse * 2.4); m.g.scale.setScalar(k * Math.max(0.35, camera.position.distanceTo(m.g.position) / 1.5)); /* about the same size on screen at any zoom */ m.ring.material.color.set(m.chosen ? 0xffffff : 0xff5a3c); }
    api.onFrame && api.onFrame(dt); renderer.render(scene, camera); requestAnimationFrame(loop);
  }
  function paint(dt) {
    for (const p of parts.values()) {
      const t = target(p); p.alpha += (t - p.alpha) * Math.min(1, dt * 9); const m = p.mesh.material;
      m.opacity = p.alpha; p.mesh.visible = p.alpha > 0.012; m.depthWrite = p.alpha > 0.6; p.mesh.castShadow = p.alpha > 0.6; p.mesh.renderOrder = p.alpha > 0.6 ? 0 : 2;
      const g = glowing.has(p.id) ? 0.55 + 0.25 * Math.sin(pulse * 3.2) : 0; if (dt > 0) p.glow += (g - p.glow) * Math.min(1, dt * 8);
      if (selected === p.id) m.emissive.copy(PICK).multiplyScalar(0.3); else if (p.glow > 0.01) m.emissive.copy(WARM).multiplyScalar(p.glow * 0.7); else if (hovered === p.id) m.emissive.copy(PICK).multiplyScalar(0.12); else m.emissive.setScalar(0);
    }
  }
  setRoom('dark'); view('whole', 0);
  return api;
}
