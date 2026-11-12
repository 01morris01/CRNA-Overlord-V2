// scan.js: the gallery's second exhibit. One person's airway and neck, two ways at once: the CT scan itself, and the
// structures outlined on it. Cut the model and the scan shows on the cut. Click a structure and the slices jump to it. Click
// a slice and the structure lights up on the model. Then find things with the names switched off.
//
// What this is: an automatic segmentation (TotalSegmentator) of one openly licensed, de-identified scan, reviewed and
// corrected with AI assistance in 3D Slicer (docs/overlord-world/HEADNECK-CT.md). What it is not: checked by a radiologist,
// or a statement about anyone else's anatomy. Everything said about position here is MEASURED ON THIS SCAN and worded so.
// All segmentation ran offline; the browser only loads the finished model and the scan's slices.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { recordAttempt, dueNow, grant, has } from './save.js';
import { sfx } from './audio.js';

export const SCAN_BASE = new URL('../../assets/models/headneck/', import.meta.url);
const OUTLINE = 'I.A.2', OUTLINE_NAME = 'Basic sciences: respiratory anatomy';
const GROUPS = [['airway', 'Airway'], ['cartilage', 'Cartilage'], ['bone', 'Bone'], ['vessel', 'Vessels'], ['gland', 'Glands'], ['muscle', 'Muscles'], ['other', 'Other']];
const LOOK = { airway: [0x9fd3ea, 0.35, 0.92], cartilage: [0xc9dbe2, 0.5, 1], bone: [0xddd4c0, 0.62, 1], artery: [0xb5493f, 0.4, 1], vein: [0x4c628f, 0.42, 1], gland: [0xc9a35a, 0.5, 1], muscle: [0x8f4a41, 0.55, 1], other: [0xb9a092, 0.55, 1] };
const WINDOWS = { soft: ['Soft tissue', 40, 400], bone: ['Bone', 500, 2000], air: ['Air', -550, 1500] };
const AXES = { sagittal: { n: [1, 0, 0], name: 'Sagittal' }, coronal: { n: [0, 0, 1], name: 'Coronal' }, axial: { n: [0, 1, 0], name: 'Axial' } };
// What can be asked, and for each a neighbour to measure it against when a hint or an explanation is needed.
const ASK = { trachea: 'cricoid_cartilage', larynx_air: 'thyroid_cartilage', hypopharynx: 'larynx_air', oropharynx: 'tongue', nasopharynx: 'soft_palate', thyroid_cartilage: 'hyoid', cricoid_cartilage: 'thyroid_cartilage', hyoid: 'mandible', mandible: 'hyoid',
  thyroid_gland: 'cricoid_cartilage', esophagus: 'trachea', tongue: 'mandible', soft_palate: 'hard_palate', hard_palate: 'tongue', spinal_cord: 'esophagus', common_carotid_artery_left: 'thyroid_gland', common_carotid_artery_right: 'thyroid_gland',
  internal_jugular_vein_left: 'common_carotid_artery_left', internal_jugular_vein_right: 'common_carotid_artery_right', sternocleidomastoid_left: 'internal_jugular_vein_left', sternocleidomastoid_right: 'internal_jugular_vein_right',
  anterior_scalene_left: 'sternocleidomastoid_left', anterior_scalene_right: 'sternocleidomastoid_right', middle_scalene_left: 'anterior_scalene_left', middle_scalene_right: 'anterior_scalene_right', submandibular_gland_left: 'mandible', submandibular_gland_right: 'mandible', vertebrae_C6: 'cricoid_cartilage' };
const N_ITEMS = 8, shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/** Load the scan's volume files into typed arrays. Shared by the exhibit and by the level's lightbox. */
export async function loadVolume() {
  const vol = await (await fetch(new URL('volume.json', SCAN_BASE))).json(), [NI, NJ, NK] = vol.grid.dims_ijk, A = vol.atlas;
  const read = async (file) => { const img = new Image(); await new Promise((ok, no) => { img.onload = ok; img.onerror = () => no(new Error('could not load ' + file)); img.src = new URL(file, SCAN_BASE).href; });      /* onload, not decode(): decode() waits for a frame, and a page opened in a background tab would wait for ever */ const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; const g = c.getContext('2d', { willReadFrequently: true, colorSpace: 'srgb' }); g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data, out = new Uint8Array(NI * NJ * NK), W = c.width; for (let k = 0; k < NK; k++) { const x0 = (k % A.tiles_per_row) * A.tile_width_px, y0 = Math.floor(k / A.tiles_per_row) * A.tile_height_px; for (let j = 0; j < NJ; j++) { let s = ((y0 + j) * W + x0) * 4, t = NI * (j + NJ * k); for (let i = 0; i < NI; i++, s += 4) out[t + i] = d[s]; } } return out; };
  const [I, Lb] = await Promise.all([read(vol.intensity.file), read(vol.labels.file)]), lut = vol.intensity.lut, hu = new Float32Array(256);
  for (let b = 0; b < 256; b++) { let n = 0; while (n < lut.byte.length - 2 && b > lut.byte[n + 1]) n++; hu[b] = lut.hu[n] + (lut.hu[n + 1] - lut.hu[n]) * (b - lut.byte[n]) / (lut.byte[n + 1] - lut.byte[n]); }
  return { vol, NI, NJ, NK, I, Lb, hu, at: (i, j, k) => i + NI * (j + NJ * k) };
}
/** One slice as greyscale ImageData in radiological display: patient's right on the left; anterior or superior at the top. */
export function sliceImage(V, axis, index, [level, width], tint = 0) {
  const { NI, NJ, NK, I, Lb, hu } = V, w = axis === 'sagittal' ? NJ : NI, h = axis === 'axial' ? NJ : NK, img = new ImageData(w, h), d = img.data, lo = level - width / 2;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = axis === 'sagittal' ? index : NI - 1 - x, j = axis === 'axial' ? NJ - 1 - y : axis === 'sagittal' ? NJ - 1 - x : index, k = axis === 'axial' ? index : NK - 1 - y, v = i + NI * (j + NJ * k);
    let g = Math.max(0, Math.min(255, (hu[I[v]] - lo) / width * 255)), r = g, b = g, p = (y * w + x) * 4; if (tint && Lb[v] === tint) { r = g * 0.45 + 255 * 0.55; g = g * 0.45 + 90 * 0.55; b = b * 0.45 + 60 * 0.55; }
    d[p] = r; d[p + 1] = g; d[p + 2] = b; d[p + 3] = 255; }
  return img;
}

export async function mountScan({ state, touch = false, persist, els, onExit }) {
  const { stage, head, panel, bar, slices, labels, tip } = els, draco = new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/gltf/');
  const [V, rec, gltf] = await Promise.all([loadVolume(), fetch(new URL('structures.json', SCAN_BASE)).then((r) => r.json()), new GLTFLoader().setDRACOLoader(draco).loadAsync(new URL('headneck.glb', SCAN_BASE).href)]);
  const { vol, NI, NJ, NK } = V, M = new THREE.Matrix4().set(...vol.grid.voxel_to_frame.flat()), Minv = M.clone().invert(), B = vol.grid.bounds_m, bmin = new THREE.Vector3(...B.min), bmax = new THREE.Vector3(...B.max), size = bmax.clone().sub(bmin), centre = bmin.clone().add(bmax).multiplyScalar(0.5);
  const byLabel = {}, R = {}; for (const s of rec.structures) { R[s.id] = s; byLabel[s.label_id] = s.id; }
  const toVoxel = (p) => { const v = p.clone().applyMatrix4(Minv); return [Math.round(v.x), Math.round(v.y), Math.round(v.z)].map((n, a) => Math.max(0, Math.min([NI, NJ, NK][a] - 1, n))); }, toFrame = (i, j, k) => new THREE.Vector3(i, j, k).applyMatrix4(M);
  // ---------------------------------------------------------------- the 3D view
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); renderer.setPixelRatio(Math.min(devicePixelRatio || 1, touch ? 1.5 : 2)); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.localClippingEnabled = true; stage.appendChild(renderer.domElement);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000000); scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.32;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 20), controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.dampingFactor = 0.09; controls.minDistance = 0.12; controls.maxDistance = 2.2; controls.target.copy(centre);
  const key = new THREE.DirectionalLight(0xfff1e0, 2.6), rim = new THREE.DirectionalLight(0x9fcbff, 2.4), fill = new THREE.HemisphereLight(0xffffff, 0x6b7480, 0.25); key.position.set(0.9, 1.2, 1.4); rim.position.set(-1.1, 0.5, -1.4); scene.add(key, rim, fill);
  const fit = () => { const w = stage.clientWidth || 1, h = stage.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h; w > 820 ? camera.setViewOffset(w, h, w * 0.06, 0, w, h) : camera.setViewOffset(w, h, 0, h * 0.16, w, h); camera.updateProjectionMatrix(); }; const ro = new ResizeObserver(fit); ro.observe(stage); fit();
  const cut = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0), parts = new Map();
  gltf.scene.traverse((m) => { if (!m.isMesh) return; const s = R[m.name]; if (!s) { m.visible = false; return; } const kind = s.group === 'vessel' ? (/vein|vena/.test(s.id) ? 'vein' : 'artery') : s.group, L = LOOK[kind] || LOOK.other;
    m.geometry.computeVertexNormals(); m.material = new THREE.MeshStandardMaterial({ color: L[0], roughness: L[1], metalness: 0, transparent: true, opacity: L[2], side: THREE.DoubleSide, clippingPlanes: [] }); m.material.userData.base = L[2];
    parts.set(s.id, { id: s.id, mesh: m, group: s.group, centre: new THREE.Vector3(...s.mask.centroid_m), alpha: L[2], base: L[2], glow: 0 }); });
  scene.add(gltf.scene);
  // the scan drawn on the cutting plane, straight from the volume
  const tex = (data, filter) => { const t = new THREE.Data3DTexture(data, NI, NJ, NK); t.format = THREE.RedFormat; t.type = THREE.UnsignedByteType; t.minFilter = t.magFilter = filter; t.unpackAlignment = 1; t.needsUpdate = true; return t; };
  const U = { tI: { value: tex(V.I, THREE.LinearFilter) }, tL: { value: tex(V.Lb, THREE.NearestFilter) }, toVox: { value: Minv }, dims: { value: new THREE.Vector3(NI, NJ, NK) }, win: { value: new THREE.Vector2(40, 400) }, sel: { value: 0 }, fade: { value: 0.86 }, plain: { value: 0 }, tK: { value: null }, lutHu: { value: vol.intensity.lut.hu }, lutByte: { value: vol.intensity.lut.byte } };
  const keyData = new Uint8Array(256 * 4), keyTex = new THREE.DataTexture(keyData, 256, 1); keyTex.minFilter = keyTex.magFilter = THREE.NearestFilter; U.tK.value = keyTex;      // per outlined structure: its colour, and whether it is shown
  const slab = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShaderMaterial({ uniforms: U, side: THREE.DoubleSide, toneMapped: false, transparent: true, depthWrite: false,
    vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4( position, 1.0 ); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `precision highp sampler3D; uniform sampler3D tI; uniform sampler3D tL; uniform sampler2D tK; uniform mat4 toVox; uniform vec3 dims; uniform vec2 win; uniform float sel; uniform float fade; uniform float plain; uniform float lutHu[ 5 ]; uniform float lutByte[ 5 ]; varying vec3 vW;
      float hu( float b ) { for ( int n = 0; n < 4; n ++ ) { if ( b <= lutByte[ n + 1 ] ) return mix( lutHu[ n ], lutHu[ n + 1 ], ( b - lutByte[ n ] ) / ( lutByte[ n + 1 ] - lutByte[ n ] ) ); } return lutHu[ 4 ]; }
      void main() { vec3 uvw = ( ( toVox * vec4( vW, 1.0 ) ).xyz + 0.5 ) / dims; if ( any( lessThan( uvw, vec3( 0.0 ) ) ) || any( greaterThan( uvw, vec3( 1.0 ) ) ) ) discard;
        float h = hu( texture( tI, uvw ).r * 255.0 ), g = clamp( ( h - ( win.x - win.y * 0.5 ) ) / win.y, 0.0, 1.0 ), a = 1.0; vec3 c = vec3( g ); float l = floor( texture( tL, uvw ).r * 255.0 + 0.5 );
        if ( plain < 0.5 ) { vec4 k = texture2D( tK, vec2( ( l + 0.5 ) / 256.0, 0.5 ) ); if ( l > 0.5 && k.a > 0.5 ) c = mix( c, k.rgb, 0.5 ); else a = h < -500.0 ? 0.0 : fade; }
        if ( sel > 0.5 && abs( l - sel ) < 0.5 ) { c = mix( c, vec3( 1.0, 0.36, 0.24 ), 0.6 ); a = 1.0; } if ( a < 0.01 ) discard; gl_FragColor = vec4( pow( c, vec3( 2.2 ) ), a );
        #include <colorspace_fragment>
      }` }));
  slab.scale.setScalar(Math.max(size.x, size.y, size.z) * 1.02); slab.renderOrder = 5; scene.add(slab);
  const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1, 1)), new THREE.LineBasicMaterial({ color: 0xff5a3c, toneMapped: false })); slab.add(frame);

  // ---------------------------------------------------------------- state
  const S = { mode: 'menu', names: true, axis: 'sagittal', on: true, flip: false, pos: { sagittal: 0, coronal: 0, axial: 0 }, win: 'soft', groups: Object.fromEntries(GROUPS.map(([k]) => [k, k === 'muscle' || k === 'other' ? 0 : 1])), hidden: new Set(), isolated: null, sel: null, cross: centre.clone(), slicesOnly: false, fade: 0.86 };
  const name = (id) => R[id]?.display_name || id, lc = (id) => name(id).replace(/^([A-Z])(?![0-9A-Z])/, (m) => m.toLowerCase());
  const persistNow = () => persist && persist();
  /** Where a lies from b on this scan, from the centroids of the corrected masks. */
  function measured(a, b) { const d = parts.get(a).centre.clone().sub(parts.get(b).centre).multiplyScalar(1000), ph = [];
    if (Math.abs(d.y) >= 5) ph.push(`${Math.round(Math.abs(d.y))} mm ${d.y > 0 ? 'above' : 'below'}`); if (Math.abs(d.z) >= 5) ph.push(`${Math.round(Math.abs(d.z))} mm ${d.z > 0 ? 'in front of' : 'behind'}`); if (Math.abs(d.x) >= 5) ph.push(`${Math.round(Math.abs(d.x))} mm to the patient's ${d.x > 0 ? 'left' : 'right'} of`);
    return ph.length ? ph.join(ph.length > 2 ? ', ' : ' and ').replace(/, ([^,]*)$/, ' and $1') + ' the ' + lc(b) : 'at the same place as the ' + lc(b); }
  function target(p) { if (S.slicesOnly || S.hidden.has(p.id)) return 0; const g = S.groups[p.group]; if (S.isolated && S.isolated !== p.id) return 0.05; if (S.isolated === p.id || S.sel === p.id) return Math.max(p.base, 0.9); return g === 1 ? p.base : g === 0.5 ? 0.13 : 0; }
  function applyCut() { const a = AXES[S.axis], n = new THREE.Vector3(...a.n), d = S.pos[S.axis] + n.dot(centre), on = S.on && !S.slicesOnly ? 1 : 0;
    cut.normal.copy(n).multiplyScalar(S.flip ? 1 : -1); cut.constant = (S.flip ? -1 : 1) * d; for (const p of parts.values()) p.mesh.material.clippingPlanes = on ? [cut] : [];
    for (const p of parts.values()) { const o = R[p.id].label_id * 4, c = p.mesh.material.color, shown = !S.slicesOnly && target(p) > 0.4; keyData[o] = Math.pow(c.r, 1 / 2.2) * 255; keyData[o + 1] = Math.pow(c.g, 1 / 2.2) * 255; keyData[o + 2] = Math.pow(c.b, 1 / 2.2) * 255; keyData[o + 3] = shown ? 255 : 0; } keyTex.needsUpdate = true; U.fade.value = S.fade; U.plain.value = S.slicesOnly ? 1 : 0;
    slab.visible = S.on || S.slicesOnly; slab.position.copy(centre).addScaledVector(n, S.pos[S.axis]); slab.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n); U.sel.value = S.sel && S.names ? R[S.sel].label_id : 0; U.win.value.set(WINDOWS[S.win][1], WINDOWS[S.win][2]); }
  const VIEWS = { left: [1, 0.14, 0.34], front: [0.2, 0.12, 1], right: [-1, 0.12, 0.25], back: [-0.2, 0.15, -1], above: [0.12, 1, 0.42], threeq: [0.75, 0.3, 0.75] }; let fly = null;
  function view(n, seconds = 0.9, jitter = 0) { const v = new THREE.Vector3(...(VIEWS[n] || VIEWS.threeq)).normalize(); if (jitter) v.applyAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() * 2 - 1) * jitter); const pos = centre.clone().addScaledVector(v, 0.86); if (seconds <= 0) { camera.position.copy(pos); controls.target.copy(centre); controls.update(); } else fly = { p0: camera.position.clone(), p1: pos, t0: controls.target.clone(), t1: centre.clone(), t: 0, dur: seconds }; }
  // ---------------------------------------------------------------- the slice views (plain canvases; the same voxels)
  slices.innerHTML = Object.keys(AXES).map((a) => `<figure data-axis="${a}"><figcaption>${AXES[a].name}<em></em></figcaption><canvas></canvas><i class="lr"></i></figure>`).join('') + `<div class="sl-tools"><div class="tools" id="scCut"></div><label class="mini">Move the cut</label><input type="range" id="scPos" aria-label="Slice position"><label class="mini">Scan over model</label><input type="range" id="scFade" min="0" max="1" step="0.02" aria-label="How strongly the scan covers the model behind the cut"><div class="tools">${Object.entries(WINDOWS).map(([k, w]) => `<button class="chip" data-win="${k}">${w[0]}</button>`).join('')}</div><p class="fine">Shown as if you stood at the patient's feet: the patient's <b>left is on your right</b>. Voxels are 1.5 mm.</p></div>`;
  const cv = {}; for (const f of slices.querySelectorAll('figure')) { const a = f.dataset.axis, c = f.querySelector('canvas'); c.width = a === 'sagittal' ? NJ : NI; c.height = a === 'axial' ? NJ : NK; cv[a] = { f, c, g: c.getContext('2d'), em: f.querySelector('em') };
    f.querySelector('figcaption').onclick = () => { S.axis = a; S.on = true; S.flip = false; if (!S.slicesOnly) view({ sagittal: 'left', coronal: 'front', axial: 'above' }[a], 0.8); refresh(); };
    c.addEventListener('pointerdown', (e) => { const r = c.getBoundingClientRect(), x = Math.floor((e.clientX - r.left) / r.width * c.width), y = Math.floor((e.clientY - r.top) / r.height * c.height), [ci, cj, ck] = toVoxel(S.cross);
      const i = a === 'sagittal' ? ci : NI - 1 - x, j = a === 'axial' ? NJ - 1 - y : a === 'sagittal' ? NJ - 1 - x : cj, k = a === 'axial' ? ck : NK - 1 - y; sliceClick(a, i, j, k); }); }
  const idx = (a) => { const [i, j, k] = toVoxel(S.cross); return a === 'sagittal' ? i : a === 'coronal' ? j : k; };
  function drawSlices() { const [ci, cj, ck] = toVoxel(S.cross), tint = S.sel && S.names && S.mode !== 'items' ? R[S.sel].label_id : (S.mode === 'items' && S.phase === 'feedback' && S.sel ? R[S.sel].label_id : 0);
    for (const a of Object.keys(AXES)) { const o = cv[a]; o.g.putImageData(sliceImage(V, a, idx(a), [WINDOWS[S.win][1], WINDOWS[S.win][2]], tint), 0, 0); o.g.strokeStyle = 'rgba(255,90,60,.8)'; o.g.lineWidth = 1; o.g.beginPath();
      const x = a === 'sagittal' ? NJ - 1 - cj : NI - 1 - ci, y = a === 'axial' ? NJ - 1 - cj : NK - 1 - ck; o.g.moveTo(x + 0.5, 0); o.g.lineTo(x + 0.5, o.c.height); o.g.moveTo(0, y + 0.5); o.g.lineTo(o.c.width, y + 0.5); o.g.stroke();
      o.f.classList.toggle('on', S.axis === a && (S.on || S.slicesOnly)); o.em.textContent = ` · ${a === 'sagittal' ? (S.cross.x >= 0 ? 'left ' : 'right ') + Math.abs(S.cross.x * 1000).toFixed(0) : ((a === 'axial' ? S.cross.y : S.cross.z) * 1000).toFixed(0)} mm`; } }
  function setCross(p, moveCut = true) { S.cross.copy(p).clamp(bmin, bmax); if (moveCut) { S.pos.sagittal = S.cross.x - centre.x; S.pos.axial = S.cross.y - centre.y; S.pos.coronal = S.cross.z - centre.z; } }
  // ---------------------------------------------------------------- picking
  const ray = new THREE.Raycaster(); let down = null;
  function pick3d(e) { const r = renderer.domElement.getBoundingClientRect(); ray.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), camera); const live = [...parts.values()].filter((p) => p.alpha > 0.4).map((p) => p.mesh);
    for (const h of ray.intersectObjects(live, false)) { if (S.on && !S.slicesOnly && cut.distanceToPoint(h.point) < 0) continue; return { id: h.object.name, point: h.point }; } return null; }
  renderer.domElement.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  renderer.domElement.addEventListener('pointerup', (e) => { if (!down) return; const still = Math.hypot(e.clientX - down.x, e.clientY - down.y) < 7 && performance.now() - down.t < 600; down = null; if (still) click3d(pick3d(e)); });
  renderer.domElement.addEventListener('pointermove', (e) => { if (e.buttons) return tip.classList.remove('on'); const h = pick3d(e), show = h && S.names && S.mode !== 'items'; renderer.domElement.style.cursor = h ? 'pointer' : 'grab'; tip.classList.toggle('on', !!show); if (show) { tip.textContent = name(h.id); tip.style.left = e.clientX + 'px'; tip.style.top = e.clientY + 'px'; } });
  renderer.domElement.addEventListener('pointerleave', () => tip.classList.remove('on'));
  function choose(id, at, from) {
    if (S.mode === 'items') { if (S.phase === 'feedback' || (S.item.on === 'slice') !== (from === 'slice')) return; S.picked = id; S.pickedAt = at ? at.clone() : null; S.phase = id ? 'sure' : 'ask'; S.sel = id; if (at) setCross(at, false); sfx('tap'); return refresh(); }
    S.sel = id; if (id) { setCross(at || parts.get(id).centre, from !== 'slice' || !S.on); sfx('tap'); } if (S.mode === 'menu' && id) S.mode = 'explore'; if (S.mode === 'tour') tourAct(from, id); refresh(); }
  const click3d = (h) => choose(h ? h.id : null, h ? h.point : null, '3d');
  function sliceClick(a, i, j, k) { const id = byLabel[V.Lb[V.at(i, j, k)]] || null, p = toFrame(i, j, k); if (S.mode !== 'items') { setCross(p, true); if (S.axis !== a && !S.on) S.axis = a; } choose(id, p, 'slice'); if (!id && S.mode !== 'items') { S.note = 'Nothing is outlined at that point. Most of a scan is not labelled.'; refresh(); } }

  // ---------------------------------------------------------------- the guided tour: operations on this scan, nothing to memorise
  const TOUR = [
    { title: 'This is the scan.', say: 'One person, lying down, head to the right of the cut you see. Grey is soft tissue, white is bone, black is air.', do: 'Drag the slider to move through the body from side to side.', set: () => { S.slicesOnly = true; S.axis = 'sagittal'; S.on = true; view('left'); }, until: 'moved' },
    { title: 'Software outlined it.', say: `${rec.counts.exported} structures were outlined on these slices by a program, then checked against the scan and corrected. No radiologist has reviewed them.`, do: 'Select the air column anywhere on the model.', set: () => { S.slicesOnly = false; S.on = true; S.pos.sagittal = 0; view('left'); }, until: 'airway3d' },
    { title: 'The same thing, on the slice.', say: 'Model and scan share one set of coordinates, so a place on one is a place on the other.', do: 'Now select the air column on any of the three slices.', set: () => {}, until: 'airwaySlice' },
    { title: 'See through what hides it.', say: 'Vessels and glands lie under bone and muscle. Each group can be solid, ghosted or off.', do: 'Ghost the bones: press Bone in the bar below.', set: () => { S.on = false; S.groups.bone = 1; view('front'); }, until: 'boneGhost' },
    { title: 'Left is on your right.', say: 'Slices are drawn as if you stood at the patient\'s feet. The patient\'s left side is on the right of the picture.', do: 'On the axial slice, select the LEFT internal jugular vein.', set: () => { S.axis = 'axial'; S.on = true; setCross(parts.get('thyroid_cartilage').centre, true); view('threeq'); }, until: 'ijvLeftSlice' },
  ];
  function tourAct(from, id) { if (S.done) return; const u = TOUR[S.step].until, g = id && R[id].group; let ok = false;
    if (u === 'airway3d') ok = from === '3d' && g === 'airway'; if (u === 'airwaySlice') ok = from === 'slice' && g === 'airway'; if (u === 'ijvLeftSlice') { ok = from === 'slice' && id === 'internal_jugular_vein_left'; if (!ok && from === 'slice' && id) S.note = id === 'internal_jugular_vein_right' ? 'That is the right one. The picture is mirrored: the patient\'s left is on your right.' : `That is the ${lc(id)}.`; }
    if (ok) { S.done = true; S.note = ''; sfx('correct'); } }

  // ---------------------------------------------------------------- identification: on the model, and on the slices alone
  function makeItems() { const due = new Set(dueNow(state).map((d) => d.item)), ids = Object.keys(ASK).filter((id) => parts.has(id)), mk = (id, on) => ({ id, on, ask: on === 'slice' ? `On the slices, select the ${lc(id)}.` : `On the model, select the ${lc(id)}.` });
    const all = ids.flatMap((id) => [mk(id, '3d'), mk(id, 'slice')]), first = shuffle(all.filter((q) => due.has(q.ask))), rest = shuffle(all.filter((q) => !due.has(q.ask))), out = []; for (const q of [...first, ...rest]) { if (out.length >= N_ITEMS) break; if (out.some((o) => o.id === q.id)) continue; if (!due.has(q.ask) && out.filter((o) => o.on === q.on).length >= N_ITEMS / 2) continue; out.push(q); } return shuffle(out); }
  function present(retry = false) { const it = S.item = retry ? { ...S.items[S.i], on: S.items[S.i].on === 'slice' ? '3d' : 'slice' } : S.items[S.i]; S.phase = 'ask'; S.picked = null; S.sel = null; S.hint = false; S.retry = retry; S.isolated = null; S.hidden.clear(); S.t0 = performance.now(); S.note = '';
    for (const [k] of GROUPS) S.groups[k] = 1; const p = parts.get(it.id);
    if (it.on === 'slice') { S.slicesOnly = true; S.on = true; const ax = shuffle(Object.keys(AXES).filter((a) => a !== S.lastAxis))[0]; S.lastAxis = S.axis = ax; const j = (Math.random() * 2 - 1) * 0.004; setCross(p.centre.clone().add(new THREE.Vector3(ax === 'sagittal' ? j : 0, ax === 'axial' ? j : 0, ax === 'coronal' ? j : 0)), true); S.win = R[it.id].group === 'bone' ? 'bone' : 'soft'; S.lastView = 'slice:' + ax; }
    else { S.slicesOnly = false; S.on = false; const dress = shuffle(['plain', 'noMuscle', 'ghostBone'].filter((d) => d !== S.lastDress && !(d === 'noMuscle' && p.group === 'muscle') && !(d === 'ghostBone' && p.group === 'bone')))[0]; S.lastDress = dress; if (dress !== 'plain' || p.group !== 'muscle') S.groups.muscle = p.group === 'muscle' ? 1 : dress === 'noMuscle' ? 0 : 0.5; if (dress === 'ghostBone') S.groups.bone = 0.5; if (p.group !== 'other') S.groups.other = 0.5;
      const v = shuffle(Object.keys(VIEWS).filter((n) => n !== S.lastView))[0]; S.lastView = v; view(v, 0.9, 0.35); } }
  function answer(conf) { const it = S.item, correct = S.picked === it.id, ms = Math.round(performance.now() - S.t0), assist = S.retry ? 'retry' : S.hint ? 'hint' : null;
    recordAttempt(state, { objective: 'airway.identify.' + it.id, outline: OUTLINE, item: S.items[S.i].ask, evidence: 'identified', correct, confidence: conf, picked: S.picked, assist, ms, where: 'gallery', view: S.lastView });
    if (S.retry) S.results[S.results.length - 1].retry = { correct, picked: S.picked }; else S.results.push({ it, correct, conf, picked: S.picked, assist, ms });
    persistNow(); S.phase = 'feedback'; sfx(correct ? 'correct' : 'wrong'); S.slicesOnly = false; S.on = true; S.sel = it.id; S.names = true; for (const [k] of GROUPS) S.groups[k] = k === 'muscle' || k === 'other' ? 0.5 : 1; S.groups[parts.get(it.id).group] = 1; setCross(parts.get(it.id).centre, true); }
  function finish() { const own = S.results.filter((r) => !r.assist), right = own.filter((r) => r.correct).length, total = S.results.length; S.pass = total > 0 && right >= Math.ceil(total * 0.75); S.earned = [];
    if (S.pass && grant(state, 'airway-sections', `identified the airway and neck without labels, ${right} of ${total}`)) S.earned.push('The airway and neck section set is now in your studio'); const ms = own.reduce((a, r) => a + (r.ms || 0), 0), b = state.game.best.airway; if (S.pass && (!b || right > b.right || (right === b.right && ms < b.ms))) state.game.best.airway = { right, total, ms, t: Date.now() };
    persistNow(); if (S.earned.length) sfx('reward'); S.right = right; S.total = total; }

  // ---------------------------------------------------------------- drawing the interface
  function go(mode) { S.mode = mode; S.note = ''; S.sel = null; S.isolated = null; S.hidden.clear(); S.slicesOnly = false; S.names = true; document.body.dataset.learn = mode;
    if (mode === 'menu' || mode === 'explore') { S.on = true; S.axis = 'sagittal'; S.flip = false; S.pos.sagittal = 0; for (const [k] of GROUPS) S.groups[k] = k === 'muscle' || k === 'other' ? 0 : 1; setCross(centre, false); S.cross.x = centre.x; view('left'); }
    if (mode === 'tour') { S.step = 0; S.done = false; S.moved = 0; TOUR[0].set(); }
    if (mode === 'items') { S.items = makeItems(); S.i = 0; S.results = []; S.lastView = null; S.lastAxis = null; present(); }
    if (mode === 'results') finish();
    refresh(); }
  function refresh() { applyCut(); drawSlices(); drawBar(); draw(); }
  function drawBar() { const hide = S.mode === 'items' && S.phase !== 'feedback';
    bar.innerHTML = `<div class="grp">${GROUPS.map(([k, n]) => `<button class="chip ${S.groups[k] === 1 ? 'on' : S.groups[k] === 0.5 ? 'half' : ''}" data-group="${k}" title="Solid, ghosted, off">${n}</button>`).join('')}</div>
      <div class="grp">${[['left', 'Left'], ['front', 'Front'], ['right', 'Right'], ['back', 'Back'], ['above', 'Above']].map(([k, n]) => `<button class="chip" data-view="${k}">${n}</button>`).join('')}</div>
`;
    slices.querySelector('#scCut').innerHTML = hide && S.item.on === 'slice' ? '' : `${Object.keys(AXES).map((a) => `<button class="chip ${S.on && S.axis === a ? 'on warm' : ''}" data-cut="${a}">${AXES[a].name}</button>`).join('')}<button class="chip ${S.on ? '' : 'on'}" data-cut="off" title="No cut: the whole model">Whole</button><button class="chip" data-cut="flip" title="Keep the other side" ${S.on ? '' : 'disabled'}>Flip</button>`;
    bar.querySelectorAll('[data-group]').forEach((b) => b.onclick = () => { const k = b.dataset.group; S.groups[k] = S.groups[k] === 1 ? 0.5 : S.groups[k] === 0.5 ? 0 : 1; sfx('tap'); if (S.mode === 'tour' && TOUR[S.step].until === 'boneGhost' && k === 'bone' && S.groups.bone < 1 && !S.done) { S.done = true; sfx('correct'); } refresh(); });
    bar.querySelectorAll('[data-view]').forEach((b) => b.onclick = () => view(b.dataset.view));
    slices.querySelectorAll('[data-cut]').forEach((b) => b.onclick = () => { const k = b.dataset.cut; if (k === 'off') S.on = false; else if (k === 'flip') S.flip = !S.flip; else { S.on = true; S.axis = k; S.flip = false; view({ sagittal: 'left', coronal: 'front', axial: 'above' }[k], 0.8); } refresh(); });
    const pos = slices.querySelector('#scPos'), n = new THREE.Vector3(...AXES[S.axis].n), half = n.dot(size) / 2; pos.min = (-half * 1000).toFixed(1); pos.max = (half * 1000).toFixed(1); pos.step = 1.5; pos.value = (S.pos[S.axis] * 1000).toFixed(1);
    pos.oninput = () => { S.pos[S.axis] = +pos.value / 1000; S.cross.copy(S.cross).addScaledVector(n, centre.clone().addScaledVector(n, S.pos[S.axis]).sub(S.cross).dot(n)); if (S.mode === 'tour' && TOUR[S.step].until === 'moved') { S.moved += 1; if (S.moved > 14 && !S.done) { S.done = true; sfx('correct'); draw(); } } applyCut(); drawSlices(); };
    const fd = slices.querySelector('#scFade'); fd.value = S.fade; fd.oninput = () => { S.fade = +fd.value; U.fade.value = S.fade; };
    slices.querySelectorAll('[data-win]').forEach((b) => { b.classList.toggle('on', S.win === b.dataset.win); b.onclick = () => { S.win = b.dataset.win; refresh(); }; });
    slices.classList.toggle('only', S.slicesOnly); slices.dataset.ask = hide ? S.item.on : ''; }
  function draw() { let h = ''; const due = dueNow(state).filter((d) => d.objective.startsWith('airway.')).length, held = has(state, 'airway-sections');
    if (S.mode === 'menu') {
      head.innerHTML = `<small>Anatomy gallery · airway and neck</small><h1>One person's scan.</h1><p>A CT of the head and neck, and the structures outlined on it. Cut it, see through it, find the same thing on the slices.</p>`;
      h = `${due ? `<button class="row go" data-go="items"><b>Review what is due</b><span>${due} you missed or guessed, first.</span></button>` : ''}<h3>Learn</h3><button class="row ${!due && !state.game.progress.scanTour ? 'go' : ''}" data-go="tour"><b>From scan to structure</b><span>Five short steps. You act at every one. Not scored.</span></button>
        <h3>Show what you know</h3><button class="row ${!due && state.game.progress.scanTour && !held ? 'go' : ''}" data-go="items"><b>Identify</b><span>${N_ITEMS} structures, half on the model and half on bare slices. No labels. Recorded.</span></button>
        <h3>Free</h3><button class="row" data-go="explore"><b>Explore</b><span>Cut, ghost, isolate, read the slices. Never recorded.</span></button><button class="row quiet" data-go="exit"><b>Step back from the exhibit</b></button>
        <details class="src"><summary>What this is, and its limits</summary><p>${vol.source.attribution}</p><p>The scan was released at 1.5 mm voxels with the face blurred by its publisher; this exhibit also removes the soft tissue in front of the facial skeleton and shows nothing above the palate's level of the skull.</p><p class="chk">${rec.disclaimer} ${rec.counts.accepted} outlines were accepted as made, ${rec.counts.corrected} were corrected, and ${rec.counts.excluded} were left out. This software does not outline the brachial plexus or any peripheral nerve; those come from a different model, at the plinth beside this one.</p></details>`;
    } else if (S.mode === 'tour') { const st = TOUR[S.step], last = S.step === TOUR.length - 1;
      head.innerHTML = `<small>From scan to structure · step ${S.step + 1} of ${TOUR.length} · guided, not scored</small><h1>${st.title}</h1><p>${st.say}</p>`;
      h = `<div class="dots">${TOUR.map((_, i) => `<i class="${i < S.step ? 'past' : i === S.step ? 'now' : ''}"></i>`).join('')}</div><h2>${S.done ? 'Yes.' : st.do}</h2>${S.note && !S.done ? `<p class="nudge">${S.note}</p>` : ''}${S.done ? `<button class="btn" data-act="tnext">${last ? 'Finish' : 'Next'}</button>` : ''}<button class="chip quiet" data-go="menu">Leave</button>`;
    } else if (S.mode === 'explore') { const id = S.sel, s = id && R[id];
      head.innerHTML = `<small>Explore · free, never recorded</small><h1>Cut it. See through it.</h1><p>Select a structure on the model or on a slice.</p>`;
      h = `<div class="tools"><button class="chip ${S.names ? 'on' : ''}" data-act="names">Names ${S.names ? 'on' : 'off'}</button><button class="chip" data-go="menu">Done</button></div>`;
      if (!id) h += `<h2>Nothing selected.</h2><p>${S.note || 'Drag to turn. The coral frame is the cut: move it with the slider beside the slices.'}</p>`;
      else if (!S.names) h += `<h2>What is this?</h2><p>Decide, then switch names on.</p>`;
      else { const m = s.mesh, ref = ASK[id] && parts.has(ASK[id]) ? ASK[id] : null; h += `<h2>${s.display_name}</h2><p class="fine">${s.group[0].toUpperCase() + s.group.slice(1)}${s.side && s.side !== 'midline' ? ' · patient\'s ' + s.side : ''} · ${s.mask.volume_mL.toFixed(1)} mL on this scan</p>
        ${ref ? `<p><b>Measured on this scan:</b> its centre lies ${measured(id, ref)}.</p>` : ''}<p class="fine"><span class="badge">${s.review.status === 'corrected' ? 'Corrected in review' : 'Accepted in review'}</span> ${s.review.note || ''}</p>
        <p class="fine">Surface: ${m.triangles_raw.toLocaleString()} triangles from the mask, ${m.triangles_final.toLocaleString()} after cleanup; the cleaned surface stays within ${m.surface_distance_raw_to_final_mm.max.toFixed(2)} mm of the first.</p>
        <div class="tools"><button class="chip" data-act="isolate">${S.isolated ? 'Show the rest' : 'Isolate'}</button><button class="chip" data-act="hide">Hide</button><button class="chip" data-act="find">Find on the slices</button></div>`; }
    } else if (S.mode === 'items') { const it = S.item, r = S.results[S.results.length - 1], last = S.i === S.items.length - 1;
      head.innerHTML = `<small>Identify · ${S.i + 1} of ${S.items.length} · ${it.on === 'slice' ? 'on the slices' : 'on the model'}${S.retry ? ' · second try' : ''}</small><h1 class="stem">${S.retry ? (it.on === 'slice' ? 'Now find it on the slices.' : 'Now find it on the model.') : S.items[S.i].ask}</h1><p>${S.phase === 'feedback' ? '' : it.on === 'slice' ? 'Only the scan. Use the slider to move the active slice.' : 'No labels. Turn it and ghost what is in your way.'}</p>`;
      if (S.phase === 'ask') h = `<h2>${S.retry ? 'Again, another way.' : 'Select it.'}</h2><p>${S.retry ? 'This second try is recorded as assisted.' : 'You can change your mind before you commit.'}</p>${S.hint ? `<p class="nudge">Measured on this scan: its centre lies ${measured(it.id, ASK[it.id])}. It is in the ${R[it.id].group} group.</p>` : !S.retry ? '<button class="chip quiet" data-act="hint">Show a hint (the answer is then recorded as assisted)</button>' : ''}`;
      else if (S.phase === 'sure') h = `<h2>Selected. How sure are you?</h2><p>The name stays hidden until you commit.</p><div class="sure"><button class="btn alt" data-conf="1">Guess</button><button class="btn alt" data-conf="2">Think so</button><button class="btn" data-conf="3">Sure</button></div>`;
      else { const rr = S.retry ? r.retry : r, ok = rr.correct, nextLabel = last ? 'See how you did' : 'Next', why = (picked) => picked ? `<p>You selected the <b>${lc(picked)}</b>. Measured on this scan, the ${lc(it.id)} lies ${measured(it.id, picked)}.</p>` : '<p>Nothing was outlined where you selected.</p>';
        h = `<div class="verdict ${ok ? 'yes' : 'no'}">${S.retry ? (ok ? 'Found it this time' : 'Still not it') : ok ? (r.assist ? 'Correct, with a hint' : 'Correct') : 'Not this time'}</div><h2>${name(it.id)}</h2>${ok ? `<p>Its centre lies ${measured(it.id, ASK[it.id])}, on this scan.</p>` : why(rr.picked)}
          <p class="fine">${S.retry ? 'Second try after seeing the answer: recorded as assisted. The first answer is the one that counts, and it comes back tomorrow.' : r.assist ? 'You used the hint, so this is recorded as assisted and does not count as recall.' : ok ? (r.conf === 1 ? 'Right, but a guess, so it comes back in two days.' : '') : 'It comes back tomorrow. It is lit now on the model and on every slice.'}</p>
          ${!ok && !S.retry ? `<button class="btn" data-act="iretry">Find it again ${it.on === 'slice' ? 'on the model' : 'on the slices'}</button><button class="chip quiet" data-act="inext">Skip the second try</button>` : `<button class="btn" data-act="inext">${nextLabel}</button>`}`; }
    } else if (S.mode === 'results') { const helped = S.results.filter((r) => r.assist).length, retried = S.results.filter((r) => r.retry).length, missed = S.results.filter((r) => !r.correct), own = S.results.filter((r) => !r.assist), by = (on) => own.filter((r) => r.it.on === on);
      head.innerHTML = `<small>Results</small><h1>${S.pass ? 'You can read this neck.' : 'Closer than last time.'}</h1><p>${S.pass ? 'Without labels, on the model and on bare slices.' : 'What you missed is scheduled to come back.'}</p>`;
      h = `<div class="two"><div><b>${by('3d').filter((r) => r.correct).length} of ${by('3d').length}</b><span>on the model, unaided</span></div><div><b>${by('slice').filter((r) => r.correct).length} of ${by('slice').length}</b><span>on slices, unaided</span></div></div>
        <h3>What you showed</h3><p>${missed.length ? `Back tomorrow: ${[...new Set(missed.map((r) => lc(r.it.id)))].join(', ')}.` : 'Nothing missed. These return in six days.'}</p>${helped || retried ? `<p class="fine">${helped ? `${helped} answered with a hint. ` : ''}${retried ? `${retried} tried a second time after feedback. ` : ''}Kept as assisted work, not counted above.</p>` : ''}
        <h3>What it added</h3><p>${S.earned.length ? S.earned.join('. ') + '.' : S.pass ? 'Nothing new: you already hold the section set.' : 'Nothing yet. Three in four unaided adds the section set to your studio.'}</p><p class="fine">This is one person's scan with software outlines. Finding things on it is practice at reading anatomy, not a clinical competence or an exam score. Filed under ${OUTLINE} (${OUTLINE_NAME}).</p>
        <button class="btn" data-go="exit">Step back from the exhibit</button><button class="btn alt" data-go="items">Go again</button>`;
    }
    if (touch) h = h.replace(/\bSelect\b/g, 'Tap');
    panel.innerHTML = h; panel.scrollTop = 0; labels.innerHTML = S.sel && S.names && S.mode !== 'results' && !(S.mode === 'items' && S.phase !== 'feedback') ? `<span data-id="${S.sel}">${name(S.sel)}</span>` : '';
    panel.querySelectorAll('[data-go]').forEach((b) => b.onclick = () => { sfx('tap'); b.dataset.go === 'exit' ? onExit(S.earned && S.earned.length ? { items: S.earned } : null) : go(b.dataset.go); });
    const on = (sel, fn) => { const b = panel.querySelector(sel); if (b) b.onclick = fn; };
    on('[data-act=names]', () => { S.names = !S.names; refresh(); }); on('[data-act=isolate]', () => { S.isolated = S.isolated ? null : S.sel; refresh(); }); on('[data-act=hide]', () => { S.hidden.add(S.sel); S.sel = null; refresh(); }); on('[data-act=find]', () => { S.on = true; setCross(parts.get(S.sel).centre, true); refresh(); });
    on('[data-act=tnext]', () => { if (S.step === TOUR.length - 1) { state.game.progress.scanTour = true; persistNow(); go('menu'); } else { S.step++; S.done = false; S.note = ''; S.moved = 0; S.sel = null; TOUR[S.step].set(); refresh(); } });
    on('[data-act=hint]', () => { S.hint = true; draw(); }); panel.querySelectorAll('[data-conf]').forEach((b) => b.onclick = () => { answer(+b.dataset.conf); refresh(); });
    on('[data-act=iretry]', () => { present(true); sfx('tap'); refresh(); }); on('[data-act=inext]', () => { if (S.i === S.items.length - 1) go('results'); else { S.i++; present(); refresh(); } });
  }
  // ---------------------------------------------------------------- frame
  const clock = new THREE.Clock(); let pulse = 0; const api = { running: false, renderer, camera, parts, state: S, records: R, volume: V, go, view,
    screenOf(id) { const p = parts.get(id); if (!p) return null; const v = p.centre.clone().project(camera), r = renderer.domElement.getBoundingClientRect(); return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height }; },
    /** Where on a slice canvas a structure's centre is (for tests and for "find on the slices"). */
    sliceSpot(axis, id) { const [i, j, k] = toVoxel(parts.get(id).centre), o = cv[axis], r = o.c.getBoundingClientRect(), x = axis === 'sagittal' ? NJ - 1 - j : NI - 1 - i, y = axis === 'axial' ? NJ - 1 - j : NK - 1 - k; return { x: r.left + (x + 0.5) / o.c.width * r.width, y: r.top + (y + 0.5) / o.c.height * r.height, on: [idx(axis), axis === 'sagittal' ? i : axis === 'coronal' ? j : k] }; },
    labelAt(p) { const [i, j, k] = toVoxel(p); return byLabel[V.Lb[V.at(i, j, k)]] || null; },
    /** A point on screen where a click would select this structure on the model right now, or null (it may be hidden or cut away). */
    spot3d(id) { const p = parts.get(id); if (!p || p.alpha < 0.4) return null; const pos = p.mesh.geometry.attributes.position, r = renderer.domElement.getBoundingClientRect(), v = new THREE.Vector3(), step = Math.max(1, Math.floor(pos.count / 260));
      for (let i = 0; i < pos.count; i += step) { v.fromBufferAttribute(pos, i).applyMatrix4(p.mesh.matrixWorld).project(camera); if (v.z > 1) continue; const x = r.left + (v.x + 1) / 2 * r.width, y = r.top + (1 - v.y) / 2 * r.height; if (x < r.left + 30 || x > r.right - 400 || y < r.top + 150 || y > r.bottom - 300) continue; if (document.elementFromPoint(x, y) !== renderer.domElement) continue;      /* under a button or a panel: nobody could click there */ const h = pick3d({ clientX: x, clientY: y }); if (h && h.id === id) return [x, y]; } return null; },
    /** A point on a slice canvas, as now displayed, that lies inside this structure's outline, or null if it is not on that slice. */
    findOnSlice(axis, id) { const lab = R[id].label_id, [ci, cj, ck] = toVoxel(S.cross), o = cv[axis], r = o.c.getBoundingClientRect(); let sx = 0, sy = 0, n = 0; const pts = [];
      for (let y = 0; y < o.c.height; y++) for (let x = 0; x < o.c.width; x++) { const i = axis === 'sagittal' ? ci : NI - 1 - x, j = axis === 'axial' ? NJ - 1 - y : axis === 'sagittal' ? NJ - 1 - x : cj, k = axis === 'axial' ? ck : NK - 1 - y; if (V.Lb[V.at(i, j, k)] === lab) { sx += x; sy += y; n++; pts.push([x, y]); } }
      if (!n) return null; const mx = sx / n, my = sy / n, at = (q) => [r.left + (q[0] + 0.5) / o.c.width * r.width, r.top + (q[1] + 0.5) / o.c.height * r.height, n]; pts.sort((p1, p2) => ((p1[0] - mx) ** 2 + (p1[1] - my) ** 2) - ((p2[0] - mx) ** 2 + (p2[1] - my) ** 2));
      for (let i = 0, stepN = Math.max(1, Math.floor(pts.length / 40)); i < pts.length; i += stepN) { const c = at(pts[i]); if (document.elementFromPoint(c[0], c[1]) === o.c) return c; }      /* the point nearest the outline's middle that is not under a button or a panel */ return null; },
    start() { if (api.running) return; api.running = true; clock.getDelta(); loop(); }, stop() { api.running = false; tip.classList.remove('on'); } };
  function loop() { if (!api.running) return; const dt = Math.min(clock.getDelta(), 0.05); pulse += dt; requestAnimationFrame(loop);
    if (fly) { fly.t = Math.min(1, fly.t + dt / fly.dur); const k = fly.t * fly.t * (3 - 2 * fly.t); camera.position.lerpVectors(fly.p0, fly.p1, k); controls.target.lerpVectors(fly.t0, fly.t1, k); if (fly.t >= 1) fly = null; } controls.update();
    for (const p of parts.values()) { const t = target(p), m = p.mesh.material; p.alpha += (t - p.alpha) * Math.min(1, dt * 9); m.opacity = p.alpha; p.mesh.visible = p.alpha > 0.012; m.depthWrite = p.alpha > 0.6; p.mesh.renderOrder = p.alpha > 0.6 ? 0 : 2;
      const lit = S.sel === p.id && (S.mode !== 'items' || S.phase !== 'ask') ? (S.mode === 'items' && S.phase === 'sure' ? 0.3 : 0.5 + 0.2 * Math.sin(pulse * 3)) : 0; p.glow += (lit - p.glow) * Math.min(1, dt * 8); if (S.mode === 'items' && S.phase === 'sure' && S.picked === p.id) m.emissive.setScalar(0.3); else m.emissive.setRGB(p.glow, p.glow * 0.35, p.glow * 0.24); }
    for (const el of labels.children) { const q = api.screenOf(el.dataset.id); if (q) el.style.transform = `translate(${q.x}px, ${q.y}px) translate(16px, -50%)`; }
    renderer.render(scene, camera); }
  view('left', 0); go('menu');
  return api;
}
