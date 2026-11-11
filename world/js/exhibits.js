// exhibits.js: what stands in the level besides the building. The gallery's specimens, the atrium's sectioned figure, the
// things on your studio shelf, what the level's screens show, and (only when present on this machine) operating-room
// equipment from a licensed pack that is never committed. Everything here is lit by the level's baked probes.
import * as THREE from 'three';
import { has } from './save.js';
import { drawTexture, plateTexture, patchSVG, svgImage, TOKENS } from './brand.js';
import { HIDE } from '../data/plexus.js';
import { CASES } from '../data/regional.js';
import { SCAN_BASE, loadVolume, sliceImage } from './scan.js';

const LOOK = { bone: [0xddd3bd, 0.62, 0], nerve: [0xe7b94a, 0.42, 0.05], artery: [0xb5493f, 0.4, 0], vein: [0x4c628f, 0.42, 0], airway: [0xbcd0db, 0.5, 0] };
const steel = () => new THREE.MeshStandardMaterial({ color: 0xb9bcc0, metalness: 1, roughness: 0.32 }), brass = () => new THREE.MeshStandardMaterial({ color: 0xcf9f58, metalness: 1, roughness: 0.36 });
const OR_LAYOUT = [   // [file, x, y (null = stand on the floor), z, turn, room]. Three.js axes; the table lies north-south, head to the north.
  ['OpreatingTable.glb', 8.6, null, -15.6, Math.PI / 2, 'or', [8.25, -16.7, 8.95, -14.5, 0, 0.95]], ['Anesthesia.glb', 9.85, null, -17.1, -2.0, 'or', [9.3, -17.65, 10.4, -16.55, 0, 1.5]], ['VentiletorMachine.glb', 7.45, null, -17.25, 2.2, 'or', [7.1, -17.65, 7.8, -16.85, 0, 1.5]],
  ['IVPole.glb', 7.7, null, -16.35, 0, 'or', [7.5, -16.55, 7.9, -16.15, 0, 1.6]], ['Trolley.glb', 6.85, null, -14.3, 0.5, 'or', [6.2, -14.8, 7.5, -13.8, 0, 1.0]], ['SurgeryTools.glb', 6.85, 1.03, -14.3, 0.5, 'or', null],
  ['SideTrolley.glb', 10.5, null, -14.1, -0.6, 'or', [10.1, -14.5, 10.9, -13.7, 0, 0.9]], ['BowlTrolley.glb', 10.95, null, -15.6, 1.2, 'or', [10.6, -15.95, 11.3, -15.25, 0, 0.9]], ['Stool.glb', 9.0, null, -17.95, 0, 'or', [8.75, -18.2, 9.25, -17.7, 0, 0.6]],
  ['OperationLight.glb', 8.7, 2.98, -15.4, 0.4, 'or', null], ['Cupboard.glb', 11.72, null, -12.45, -Math.PI / 2, 'or', null], ['Cupboard.glb', 11.72, null, -13.55, -Math.PI / 2, 'or', null], ['LEDTV.glb', 8.6, 1.25, -19.56, 0, 'or', null], ['SuctionCanister.glb', 11.1, 1.45, -19.5, 0, 'or', null],
  ['Stool.glb', -7.55, null, -14.15, 0, 'regional', [-7.8, -14.4, -7.3, -13.9, 0, 0.6]], ['SideTrolley.glb', -9.95, null, -13.9, 0.3, 'regional', [-10.35, -14.3, -9.55, -13.5, 0, 0.9]], ['IVPole.glb', -9.55, null, -16.45, 0, 'regional', [-9.75, -16.65, -9.35, -16.25, 0, 1.6]],
];

export async function mountExhibits({ world, state }) {
  const ST = Object.fromEntries(world.stations.map((s) => [s.key, s])), api = { figure: null, hasORPack: false, hasScan: false, shelf: [] }, V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
  const stand = (group, at, room) => { world.place(group, { at, room, envI: 0.9 }); return group; };
  // ---------------------------------------------------------------- the plexus: life size on its mount, and one third size for a shelf
  let plexusSrc = null;
  async function plexus(scale) {
    plexusSrc ||= (await world.loadModel('models/plexus/plexus-right-overlord-v2.glb')).scene; const g = plexusSrc.clone(true), box = new THREE.Box3(), inner = new THREE.Group();
    g.traverse((m) => { if (!m.isMesh) return; const layer = m.userData.layer || 'bone', L = LOOK[layer]; if (!L || HIDE.includes(m.name)) { m.visible = false; return; }
      m.geometry = m.geometry.clone(); m.geometry.computeVertexNormals(); m.material = new THREE.MeshStandardMaterial({ color: L[0], roughness: L[1], metalness: 0, emissive: layer === 'nerve' ? 0x3a2606 : 0x000000, emissiveIntensity: L[2] * 4, side: THREE.DoubleSide }); box.expandByObject(m); });
    const c = box.getCenter(new THREE.Vector3()); g.position.set(-c.x, -box.min.y, -c.z); inner.add(g); inner.scale.setScalar(scale); inner.userData.height = (box.max.y - box.min.y) * scale; return inner;
  }
  { const m = V(ST.plexus.mount), p = await plexus(1), rod = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.5, 12), steel()), base = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.012, 48), steel()), g = new THREE.Group();
    p.position.set(0.05, 0.16, 0.02); rod.position.set(0, 0.25, -0.06); base.position.y = 0.006; g.add(p, rod, base); g.position.copy(m); stand(g, m.clone().add(new THREE.Vector3(0, 0.38, 0)), 'gallery'); api.plexus = g; }
  // ---------------------------------------------------------------- the atrium's sectioned figure: skeleton and nerves inside a body surface that a moving plane cuts away
  try {
    const src = (await world.loadModel('models/figure/figure-zanatomy.glb')).scene, m = V(ST.atrium.mount), g = new THREE.Group(), K = 1.3, cut = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1), floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), -m.y - 0.002);
    src.traverse((o) => { if (!o.isMesh) return; o.geometry.computeVertexNormals();
      if (o.name.startsWith('skeleton')) o.material = new THREE.MeshStandardMaterial({ color: 0xe3dac6, roughness: 0.58 });
      else if (o.name.startsWith('nerves')) o.material = new THREE.MeshStandardMaterial({ color: 0xe2a93c, roughness: 0.45, emissive: 0x4a2c05, emissiveIntensity: 0.35, clippingPlanes: [floor] });
      else { o.material = new THREE.MeshStandardMaterial({ color: 0xece6dc, roughness: 0.5, side: THREE.DoubleSide, clippingPlanes: [cut], clipShadows: true }); o.userData.skin = true; } });
    src.scale.setScalar(K); g.add(src); const H = 1.71 * K;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.0055, 10, 96), brass()), disc = new THREE.Mesh(new THREE.CircleGeometry(0.52, 64), new THREE.MeshBasicMaterial({ color: 0xff5a3c, transparent: true, opacity: 0.05, side: THREE.DoubleSide, depthWrite: false })), posts = new THREE.Group();
    ring.rotation.x = Math.PI / 2; disc.rotation.x = -Math.PI / 2; for (const a of [0.9, 2.5, 4.1, 5.5]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, H + 0.12, 8), steel()); p.position.set(Math.cos(a) * 0.52, (H + 0.12) / 2, Math.sin(a) * 0.52); posts.add(p); }
    g.add(ring, disc, posts); g.position.copy(m); stand(g, m.clone().add(new THREE.Vector3(0, 1.2, 0)), 'court');
    // the placed copies have cloned materials: fetch the planes back from them
    const planes = []; g.traverse((o) => { if (o.isMesh && o.material.clippingPlanes && o.material.clippingPlanes.length && o.userData.skin) planes.push(o.material.clippingPlanes[0]); });
    const fig = { k: 0.62, auto: true, t: 11, skin: true, set(k) { fig.k = Math.max(0.04, Math.min(1, k)); const y = m.y + fig.k * H; for (const p of planes) p.constant = y; ring.position.y = fig.k * H; disc.position.y = fig.k * H; }, showSkin(on) { fig.skin = on; g.traverse((o) => { if (o.userData.skin) o.visible = on; }); } };
    fig.set(0.62); api.figure = fig;
  } catch (e) { console.warn('figure', e); }
  // ---------------------------------------------------------------- the studio: what you hold, where you can see it
  const shelfGroup = new THREE.Group(); world.scene.add(shelfGroup); let shelfBuilt = '';
  async function plateMesh(text, w = 0.2, h = 0.032) { const g = new THREE.Group(), b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.004), brass()), t = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: await plateTexture(text, w, h, { px: 512 }), transparent: true, depthWrite: false })); t.position.z = 0.0025; g.add(b, t); return g; }
  async function refreshShelf() {
    const slots = ST.collection.shelf.map(V), held = state.game.collection.map((c) => c.id), best = state.game.best.plexus, sig = held.join('|') + '|' + (best ? best.right + '/' + best.ms : '') + '|' + (api.hasScan ? 1 : 0); if (sig === shelfBuilt) return; shelfBuilt = sig;
    for (const o of [...shelfGroup.children]) shelfGroup.remove(o); api.shelf = [];
    const put = async (slot, obj, label) => { const at = slots[slot], g = new THREE.Group(); g.add(obj); const pl = await plateMesh(label); pl.position.set(0, -0.018, 0.165); g.add(pl); g.position.copy(at); shelfGroup.add(g); world.place(g, { at: at.clone().add(new THREE.Vector3(0, 0.12, 0)), room: 'studio', envI: 0.8, shadow: false }); api.shelf.push({ slot, g }); };
    if (held.includes('plexus-specimen')) { const p = await plexus(0.34), base = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.01, 40), brass()), g = new THREE.Group(); base.position.y = 0.005; p.position.y = 0.012; g.add(base, p); await put(1, g, 'BRACHIAL PLEXUS');
      if (best) { const b = await plateMesh(`BEST  ${best.right} OF ${best.total}  ·  ${Math.floor(best.ms / 60000)}:${String(Math.round(best.ms / 1000) % 60).padStart(2, '0')}`, 0.2, 0.028); b.position.copy(slots[1]).add(new THREE.Vector3(0, -0.052, 0.165)); shelfGroup.add(b); world.place(b, { at: slots[1], room: 'studio', shadow: false }); } }
    if (held.includes('regional-patch')) { const img = await svgImage(patchSVG({ series: 1 })), tex = drawTexture(256, 256, (c) => { c.fillStyle = '#1a1c20'; c.fillRect(0, 0, 256, 256); c.drawImage(img, 28, 28, 200, 200); }), g = new THREE.Group(), fr = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.17, 0.012), brass()), face = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 0.15), new THREE.MeshBasicMaterial({ map: tex })); face.position.z = 0.0065; fr.position.y = face.position.y = 0.1; g.add(fr, face); g.rotation.x = -0.12; await put(3, g, 'REGIONAL SERIES'); }
    if (held.includes('airway-sections') && api.airwayMini) { const g = new THREE.Group(), base = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.01, 40), brass()); base.position.y = 0.005; g.add(base, await api.airwayMini()); await put(0, g, 'AIRWAY AND NECK'); }
    world.setScreen('cases', casesTexture());
  }
  function casesTexture() { const A = Object.entries(state.game.cases).filter(([, v]) => v.attempts && v.attempts.length);
    return drawTexture(1350, 550, (c, w, h) => { c.fillStyle = '#2a2520'; c.fillRect(0, 0, w, h); c.font = '500 22px "Inter Tight", system-ui'; c.fillStyle = 'rgba(255,255,255,.34)'; if ('letterSpacing' in c) c.letterSpacing = '5px';
      if (!A.length) { c.fillText('CASE ARCHIVE', 48, 70); c.font = '300 30px "Inter Tight", system-ui'; c.letterSpacing = '0px'; c.fillText('Cases you complete and explain are pinned here.', 48, 130); return; }
      A.slice(0, 3).forEach(([id, v], i) => { const cs = CASES.find((q) => q.id === id), x = 46 + i * 430, last = v.attempts[v.attempts.length - 1]; c.save(); c.translate(x + 190, 275); c.rotate((i - 1) * 0.012); c.fillStyle = '#efeae0'; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 18; c.shadowOffsetY = 6; c.fillRect(-190, -235, 380, 470); c.shadowColor = 'transparent';
        c.fillStyle = '#ff5a3c'; c.fillRect(-150, -196, 300, 2); c.fillStyle = '#16181b'; c.letterSpacing = '3px'; c.font = '500 15px "Inter Tight", system-ui'; c.fillText('CASE RECONSTRUCTION', -150, -160); c.letterSpacing = '0px'; c.font = '300 30px "Inter Tight", system-ui';
        const words = (cs ? cs.title || cs.stem : id).split(' '); let line = '', y = -110; for (const wd of words) { if (c.measureText(line + wd).width > 300) { c.fillText(line, -150, y); y += 36; line = ''; if (y > 30) break; } line += wd + ' '; } if (y <= 30) c.fillText(line, -150, y);
        c.font = '400 17px "Inter Tight", system-ui'; c.fillStyle = '#4a4d52'; c.fillText(`${v.attempts.length} attempt${v.attempts.length > 1 ? 's' : ''}`, -150, 130); c.fillText(`Last: ${last.grade === 'best' ? 'the preferred approach' : last.grade === 'ok' ? 'a defensible approach' : 'not the approach'}`, -150, 158); c.fillText(new Date(last.t).toLocaleDateString(), -150, 186); c.restore(); }); }); }
  // ---------------------------------------------------------------- screens
  world.setScreen('display', drawTexture(1280, 630, (c, w, h) => { c.fillStyle = '#0d1014'; c.fillRect(0, 0, w, h); c.fillStyle = '#ff5a3c'; c.fillRect(70, 96, 3, 60); c.fillStyle = '#f4f4f2'; c.font = '300 54px "Inter Tight", system-ui'; c.fillText('Four ways in', 96, 146);
    c.font = '400 25px "Inter Tight", system-ui'; ['Interscalene', 'Supraclavicular', 'Infraclavicular', 'Axillary'].forEach((n, i) => { const y = 250 + i * 74; c.fillStyle = 'rgba(255,255,255,.16)'; c.fillRect(96, y + 16, 900, 1); c.fillStyle = '#f4f4f2'; c.fillText(n, 96, y); c.fillStyle = '#a4a8b0'; c.fillText(['roots, between the scalenes', 'trunks and divisions, over the first rib', 'cords, around the axillary artery', 'terminal nerves, in the axilla'][i], 420, y); });
    c.fillStyle = '#e6c98a'; c.font = '400 20px "Inter Tight", system-ui'; c.fillText('Levels shown on the anatomical model. No ultrasound image is simulated in this room.', 96, 580); }), { glow: 0.85 });
  world.setScreen('lightbox', drawTexture(512, 366, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w * 0.7); g.addColorStop(0, '#e9eef2'); g.addColorStop(1, '#aab6c0'); c.fillStyle = g; c.fillRect(0, 0, w, h); }), { glow: 0.55 });
  // ---------------------------------------------------------------- operating-room equipment, only if the licensed pack is on this machine
  async function orPack() {
    try { const r = await fetch(new URL('../../assets/local/or-pack/OpreatingTable.glb', import.meta.url), { method: 'HEAD' }); if (!r.ok) return; } catch (e) { return; }
    api.hasORPack = true; const cache = {};
    for (const [file, x, y, z, turn, room, col] of OR_LAYOUT) { try { cache[file] ||= (await world.loadModel('local/or-pack/' + file)).scene; const g = cache[file].clone(true), holder = new THREE.Group(); holder.add(g); holder.rotation.y = turn; holder.position.set(x, 0, z); holder.updateMatrixWorld(true); const b = new THREE.Box3().setFromObject(holder);
        holder.position.y = y === null ? -b.min.y : y; world.place(holder, { at: new THREE.Vector3(x, 1.0, z), room, envI: 0.7, shadow: false }); if (col) world.addCollider(col); } catch (e) { console.warn('or pack', file, e); } }
    await patient(new THREE.Vector3(8.6, 0.93, -15.6), 'or'); world.captureRooms();
  }
  // a figure under a sheet for the tables: set dressing made from an openly licensed avatar, not a simulated patient
  let patientSrc = null;
  async function patient(at, room) { try { patientSrc ||= (await world.loadModel('models/patient/patient-supine.glb')).scene; const g = patientSrc.clone(true);
      g.traverse((o) => { if (!o.isMesh) return; o.material = o.material.clone(); const m = o.material; m.envMapIntensity = 0.4; if (/hair/.test(m.name)) { m.transparent = false; m.alphaTest = 0.5; m.side = THREE.DoubleSide; m.roughness = 0.9; } if (/drape/.test(m.name)) { m.side = THREE.DoubleSide; m.color.set(room === 'or' ? 0x5f8f9e : 0xe9edf0); } });
      g.position.copy(at); world.place(g, { at: at.clone().add(new THREE.Vector3(0, 0.2, 0)), room, envI: 0.4, shadow: false }); } catch (e) { console.warn('patient', e); } }
  patient(new THREE.Vector3(-8.6, 0.9, -15.2), 'regional');
  orPack();
  // ---------------------------------------------------------------- the airway and neck, from the scan: on its mount, on the lightbox, and small for a shelf
  async function scanExhibit() {
    try { const r = await fetch(new URL('volume.json', SCAN_BASE), { method: 'HEAD' }); if (!r.ok) return; } catch (e) { return; }
    const src = (await world.loadModel('models/headneck/headneck.glb')).scene, rec = await (await fetch(new URL('structures.json', SCAN_BASE))).json(), G = Object.fromEntries(rec.structures.map((q) => [q.id, q.group]));
    const C = { airway: [0x9fd3ea, 0.35], cartilage: [0xc9dbe2, 0.5], bone: [0xddd4c0, 0.62], artery: [0xb5493f, 0.4], vein: [0x4c628f, 0.42], gland: [0xc9a35a, 0.5] };
    function model(scale, groups) { const g = src.clone(true), box = new THREE.Box3(), inner = new THREE.Group();
      g.traverse((m) => { if (!m.isMesh) return; const gr = G[m.name], kind = gr === 'vessel' ? (/vein|vena/.test(m.name) ? 'vein' : 'artery') : gr, L = C[kind]; if (!L || !groups.includes(gr) || m.name === 'skull') { m.visible = false; return; }
        m.geometry = m.geometry.clone(); m.geometry.computeVertexNormals(); m.material = new THREE.MeshStandardMaterial({ color: L[0], roughness: L[1], side: THREE.DoubleSide }); box.expandByObject(m); });
      const c = box.getCenter(new THREE.Vector3()); g.position.set(-c.x, -box.min.y, -c.z); inner.add(g); inner.scale.setScalar(scale); inner.userData.height = (box.max.y - box.min.y) * scale; return inner; }
    { const m = V(ST.airway.mount), p = model(1, ['airway', 'cartilage', 'bone', 'vessel', 'gland']), rod = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.2, 12), steel()), base = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.012, 48), steel()), g = new THREE.Group();
      p.position.set(0, 0.13, 0); rod.position.set(0, 0.1, -0.05); base.position.y = 0.006; g.add(p, rod, base); g.position.copy(m); stand(g, m.clone().add(new THREE.Vector3(0, 0.3, 0)), 'gallery'); }
    api.airwayMini = async () => { const p = model(0.5, ['airway', 'cartilage', 'bone']); p.position.y = 0.012; return p; };
    try { const Vv = await loadVolume(), put = (c, axis, index, x, y, h) => { const img = sliceImage(Vv, axis, index, [40, 400]), t = document.createElement('canvas'); t.width = img.width; t.height = img.height; t.getContext('2d').putImageData(img, 0, 0); const w = h * img.width / img.height; c.drawImage(t, x - w / 2, y - h / 2, w, h); };
      world.setScreen('lightbox', drawTexture(1044, 744, (c, w, h) => { c.fillStyle = '#05070a'; c.fillRect(0, 0, w, h); c.imageSmoothingQuality = 'high'; put(c, 'sagittal', Math.round(Vv.NI / 2), w * 0.3, h * 0.5, h * 0.86); put(c, 'coronal', Math.round(Vv.NJ * 0.5), w * 0.72, h * 0.5, h * 0.86);
        c.fillStyle = 'rgba(255,255,255,.6)'; c.font = '500 15px "Inter Tight", system-ui'; if ('letterSpacing' in c) c.letterSpacing = '3px'; c.fillText('CT  ·  SAGITTAL', w * 0.3 - 70, h - 18); c.fillText('CT  ·  CORONAL', w * 0.72 - 66, h - 18); }), { glow: 1.5 }); } catch (e) { console.warn('lightbox', e); }
    api.hasScan = true;
  }
  await scanExhibit();
  await refreshShelf();
  // one member of staff in the court, looking at the figure. Set dressing: no name, no speech, and not another learner.
  api.people = [];
  (async () => { try { const { loadPerson } = await import('./person.js'), who = ['longcoat', 'coat', 'tunic'].find((k) => k !== (state.character && state.character.person)), light = world.newLight(), at = new THREE.Vector3(-2.35, 0, -13.7), mats = [];
      const p = await loadPerson(who, { light: (m) => { world.patchDynamic(m, light); mats.push(...m); } }); world.lightAt(light, new THREE.Vector3(at.x, 1.1, at.z), 'court'); p.root.position.copy(at); p.root.rotation.y = Math.atan2(0 - at.x, -9.7 - at.z);
      world.scene.add(p.root); world.adopt(p.root, 'court', mats); world.addCollider([at.x - 0.3, at.z - 0.3, at.x + 0.3, at.z + 0.3, 0, 1.8]); api.people.push(p); } catch (e) { console.warn('staff figure', e); } })();
  api.update = (dt) => { const f = api.figure; if (f && f.auto && world.prefs.motion) { f.t += dt; f.set(0.5 + 0.44 * Math.sin(f.t * 2 * Math.PI / 52)); } for (const q of api.people) q.update(dt, 0); };
  api.refresh = refreshShelf; api.plexusModel = plexus;
  return api;
}
