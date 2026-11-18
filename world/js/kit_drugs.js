/** Drugs by hand: the labeled syringes on the worktop, the IV port on the patient, and the plunger.
 *
 *  Reach for a syringe (it is lifted into your hand and the chip says what it holds), carry it to the IV port at the patient's
 *  right antecubital fossa (the chart's 20 g catheter), click the port to connect it (a Luer connection: the syringe seats on the
 *  valve and the tip turns green), then press and hold the plunger. While you hold, the plunger moves at a steady hand speed
 *  and what has left the syringe is handed to the case in small parts through the case's own C.push, so the record holds every
 *  part with its time; let go and nothing more is given. Press again and only the new part is given. Take the syringe off the
 *  port (click it), and X puts it back on the tray; an empty syringe is discarded when it comes off.
 *
 *  The step list's "give" button and typed orders still work: the syringe then shows where the record says it is.
 *  Models: assets/models/airway/syringe_{3,5,10}ml.glb and iv_port.glb when they exist (sources in assets/models/airway/SOURCES.md);
 *  until then a plain stand-in drawn here, at real sizes, and the tip says "stand-in".
 *  Not modeled: dead space in the port and line (a flush is not needed for the drug to count), the speed of the push changing the
 *  drug's effect (the engine takes each part as a bolus).
 */
import * as THREE from 'three';
import { DRUG_CLASS, fmtDose } from './cases.js';
import { bodySites } from './body.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const ID_MM = { 3: 8.66, 5: 12.07, 10: 14.43, 20: 19.13 };      // inside diameter of common US Luer-lock syringes (BD), mm
const PUSH_ML_PER_S = 0.5;                                        // a steady hand push; held to this so a 20 mL propofol syringe takes 40 s
const FLUSH_S = 0.25;                                             // parts reach the case this often while the plunger moves

export async function mountDrugs({ world, hands }) {
  const load = async (p) => { try { return await world.loadModel(p); } catch (e) { return null; } };
  const [g3, g5, g10, gPort] = await Promise.all(['syringe_3ml', 'syringe_5ml', 'syringe_10ml', 'iv_port'].map((n) => load(`models/airway/${n}.glb`)));
  const MODEL = { 3: g3, 5: g5, 10: g10, 20: g10 };
  let ctx = null, C = null, P = null, rows = new Map(), port = null, portThing = null, onPort = null, pushing = null, flushT = 0, siteCache = null;

  // ---------------------------------------------------------------- a syringe you can see: barrel, plunger, tip, label
  function label(s) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 160; const g = c.getContext('2d'), col = (DRUG_CLASS[s.cls] || DRUG_CLASS.other || ['', '#ffffff'])[1];
    g.fillStyle = '#fbfbf7'; g.fillRect(0, 0, 512, 160); g.fillStyle = col; g.fillRect(0, 0, 512, 34); if (s.cls === 'relaxant') { g.fillStyle = '#fbfbf7'; g.font = '700 24px sans-serif'; g.fillText('WARNING: PARALYZING AGENT', 14, 26); }
    g.fillStyle = '#111'; g.font = '700 48px sans-serif'; g.fillText(s.drug.toUpperCase(), 14, 88); g.font = '500 30px sans-serif';
    g.fillText(`${s.mgPerMl ? `${s.mgPerMl} ${s.unit === 'mcg' ? 'mcg' : 'mg'}/mL` : fmtDose(s.totalMg, s.unit)}  ·  ${s.volMl ? `${+s.volMl.toFixed(1)} mL` : ''}`, 14, 132);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  }
  function standIn(s) {      // barrel axis +z, tip at +z; plunger slides toward +z as it is pushed
    const size = s.syringeMl || 10, r = (ID_MM[size] || 14.4) / 2000, len = (s.syringeMl || 10) * 1e-6 / (Math.PI * r * r), wall = 0.0009, g = new THREE.Group();
    const clear = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.08, transmission: 0.9, thickness: 0.002, ior: 1.49, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false });
    const white = new THREE.MeshStandardMaterial({ color: 0xf2f2ee, roughness: 0.45 }), rubber = new THREE.MeshStandardMaterial({ color: 0x2a2a2c, roughness: 0.6 });
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(r + wall, r + wall, len, 28, 1, true), clear); barrel.rotation.x = Math.PI / 2; barrel.name = 'barrel';
    const flange = new THREE.Mesh(new THREE.BoxGeometry(r * 4.6, 0.0016, r * 1.9), white); flange.position.z = -len / 2; flange.rotation.x = Math.PI / 2;
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.0021, 0.003, 0.011, 16), white); tip.rotation.x = Math.PI / 2; tip.position.z = len / 2 + 0.0055; tip.name = 'tip';
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.0052, 0.0052, 0.008, 20, 1, true), white); collar.rotation.x = Math.PI / 2; collar.position.z = len / 2 + 0.004;
    const plunger = new THREE.Group(); plunger.name = 'plunger'; const stopper = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.98, r * 0.98, 0.006, 24), rubber), rod = new THREE.Mesh(new THREE.BoxGeometry(r * 1.2, r * 1.2, len * 1.02), white), thumb = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.5, r * 1.5, 0.0018, 24), white);
    stopper.rotation.x = Math.PI / 2; rod.position.z = -len / 2 - 0.003; thumb.rotation.x = Math.PI / 2; thumb.position.z = -len - 0.006; plunger.add(stopper, rod, thumb);
    const lab = new THREE.Mesh(new THREE.CylinderGeometry(r + wall * 1.6, r + wall * 1.6, len * 0.62, 28, 1, true, -0.2, Math.PI * 1.15), new THREE.MeshStandardMaterial({ map: label(s), roughness: 0.7, side: THREE.DoubleSide })); lab.rotation.x = Math.PI / 2; lab.rotation.y = Math.PI; lab.position.z = -len * 0.05; lab.name = 'label';
    g.add(barrel, flange, tip, collar, plunger, lab); return { g, plunger, len, standIn: true, travel: (ml) => len * (ml / size), z0: len / 2 - 0.003 };
  }
  function fromModel(s) {
    const src = MODEL[s.syringeMl || 10]; if (!src) return null; const g = src.scene.clone(true), plunger = g.getObjectByName('plunger'), tip = g.getObjectByName('tip'), lab = g.getObjectByName('label'); if (!plunger || !tip) return null;
    if (lab && lab.isMesh) { lab.material = lab.material.clone(); lab.material.map = label(s); lab.material.needsUpdate = true; }
    const size = s.syringeMl || 10, json = (src.parser && src.parser.json && src.parser.json.extras) || {}, len = json.travelFull || 0.06, z0 = plunger.position.z;
    return { g, plunger, len, standIn: false, travel: (ml) => len * (ml / size), z0 };
  }
  function make(s) { const v = fromModel(s) || standIn(s); v.g.name = 'syringe_' + s.id; v.g.userData.sid = s.id; return v; }
  /** The plunger where the record says it is: drawn volume minus what has been given. */
  const volOf = (s) => s.volMl || 10, mgPerMlOf = (s) => s.mgPerMl || s.totalMg / volOf(s);      // a drug with no stated concentration is drawn as 10 mL
  function plungerTo(row) { const s = row.s, left = Math.max(0, volOf(s) * (1 - (s.givenMg + (row.pending || 0)) / s.totalMg)); row.v.plunger.position.z = row.v.z0 - row.v.travel(left) + (row.v.standIn ? 0 : 0); row.left = left; return left; }

  // ---------------------------------------------------------------- where things are
  function trayPose(i) { const m = ctx.machine; m.updateMatrixWorld(true); const pos = m.localToWorld(V(0.56 + (i % 2) * 0.006, 0.915, 0.115 + i * 0.026)); const q = m.getWorldQuaternion(new THREE.Quaternion()).multiply(new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), Math.PI)); return { pos, q }; }
  function ivSite() {
    if (siteCache) return siteCache; const ph = ctx.entry && ctx.entry.physiology, sites = bodySites(P, { heightM: ph && ph.heightCm ? ph.heightCm / 100 : 1.72 }); siteCache = sites.get('antecubitalR'); return siteCache;
  }
  function buildPort() {
    const g = new THREE.Group(); g.name = 'iv_port';
    if (gPort) { g.add(gPort.scene.clone(true)); g.userData.model = true; }
    else { const clear = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.1, transmission: 0.85, thickness: 0.002, transparent: true, opacity: 0.6 }), white = new THREE.MeshStandardMaterial({ color: 0xf4f4f0, roughness: 0.4 }), blue = new THREE.MeshStandardMaterial({ color: 0x2f6fd0, roughness: 0.45 }), film = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, transparent: true, opacity: 0.35, depthWrite: false });
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0045, 0.018, 16), new THREE.MeshStandardMaterial({ color: 0xe96aa0, roughness: 0.4 })); hub.rotation.x = Math.PI / 2;      // a 20 gauge catheter hub is pink (ISO 10555-5 color code, as used in the US)
      const dressing = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.07), film); dressing.rotation.x = -Math.PI / 2; dressing.position.set(0, 0.002, 0.004);
      const line = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(0, 0, 0.01), V(0.004, 0.004, 0.045), V(0.006, 0.006, 0.09)]), 20, 0.0016, 8), clear);
      const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.0048, 0.0048, 0.016, 20), white); valve.rotation.x = Math.PI / 2; valve.position.set(0.006, 0.007, 0.098);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.0042, 0.0042, 0.004, 20), blue); cap.rotation.x = Math.PI / 2; cap.position.set(0.006, 0.007, 0.108);
      const entry = new THREE.Object3D(); entry.name = 'port'; entry.position.set(0.006, 0.007, 0.11); entry.rotation.y = Math.PI;      // a syringe enters from +z, pointing back along -z
      g.add(hub, dressing, line, valve, cap, entry); }
    return g;
  }
  function portFrame() { const e = port.getObjectByName('port') || port; e.updateWorldMatrix(true, false); return { pos: e.getWorldPosition(V()), q: e.getWorldQuaternion(new THREE.Quaternion()) }; }

  // ---------------------------------------------------------------- connecting and pushing
  function connect(row) { onPort = row; const f = portFrame(), back = V(0, 0, -1).applyQuaternion(f.q).multiplyScalar(row.v.len / 2 + 0.012); hands.settle(row.g, world.scene, { pos: f.pos.clone().add(back).toArray(), quat: f.q.clone() }, 0.18); row.connected = true; ctx.say(`${row.s.label}: connected to the IV port.`); return true; }
  function disconnect(row) { if (onPort !== row) return; flush(row); try { C.settle(row.s.id); } catch (e) { /* nothing held */ } onPort = null; row.connected = false; }
  function flush(row) { const mg = row.pending || 0; if (mg <= 0) return; row.pending = 0; const r = C.push(row.s.id, mg); if (!r.ok && r.say) ctx.say(r.say, false); ctx.dirty(); }
  function startPush() { if (!onPort) return; const s = onPort.s; if (s.given) { ctx.say('The syringe is empty.', false); return; } pushing = { row: onPort, ml: 0, t0: C.runner.simTime }; flushT = 0; }
  function stopPush() { if (!pushing) return; const row = pushing.row; flush(row); const ml = pushing.ml; pushing = null; if (ml > 0.005) { const s = row.s, mg = ml * mgPerMlOf(s); ctx.say(`${s.drug}: ${ml.toFixed(1)} mL pushed${mg ? ` (${fmtDose(Math.round(mg * (s.unit === 'mcg' ? 1e4 : 10)) / (s.unit === 'mcg' ? 1e4 : 10), s.unit)})` : ''}; ${row.left.toFixed(1)} mL left in the syringe.`); } }

  const kit = { name: 'drugs',
    begin(c) { ctx = c; C = c.C; P = c.P; siteCache = null; rows = new Map(); onPort = null; pushing = null; if (!C || !P || !c.machine || !hands) return; c.own('syringes');
      port = buildPort(); world.place(port, { at: P.root.position.clone(), room: c.room, envI: 0.5, shadow: false }); const site = ivSite();
      if (site) { const n = site.normal.clone().normalize(), ax = (site.axis || V(0, 0, 1)).clone().projectOnPlane(n).normalize(), x = V().crossVectors(n, ax).normalize(), q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, n, ax));
        const at = site.pos.clone().addScaledVector(n, 0.003); hands.settle(port, P.root, { pos: P.root.worldToLocal(at).toArray(), quat: P.root.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(q) }, 0); }
      portThing = hands.add({ id: 'ivport', group: 'case', kind: 'place', pad: 0.03, reach: 1.5, at: () => portFrame().pos, label: () => 'IV port, right antecubital (20 g)', verb: 'Connect the syringe', takes: (h) => !!h && /^syr:/.test(h.id), when: () => !onPort, put: (h) => connect(rows.get(h.id.slice(4))) });
      kit.update(0); },
    end() { if (pushing) stopPush(); for (const row of rows.values()) { if (row.thing) hands.remove(row.thing.id); hands.remove('push:' + row.s.id); world.unplace(row.g); } rows.clear(); if (port) { world.unplace(port); port = null; } if (portThing) hands.remove('ivport'); ctx = C = P = null; onPort = null; },
    update(dt) { if (!ctx || !C || !ctx.machine) return;
      const want = C.syringes.filter((s) => !s.given || (rows.get(s.id) && rows.get(s.id).connected));
      for (const [id, row] of rows) if (!want.includes(row.s)) { if (onPort === row) disconnect(row); hands.remove('syr:' + id); hands.remove('push:' + id); world.unplace(row.g); rows.delete(id); }
      want.forEach((s, i) => { let row = rows.get(s.id);
        if (!row) { const v = make(s); row = { s, v, g: v.g, i, pending: 0, left: 0, connected: false }; rows.set(s.id, row); const tp = trayPose(i); world.place(v.g, { at: tp.pos, room: ctx.room, envI: 0.5, shadow: false }); v.g.position.copy(tp.pos); v.g.quaternion.copy(tp.q);
          const inPlunger = (o) => { for (let q = o; q; q = q.parent) if (q === v.plunger) return true; return false; }, body = []; v.g.traverse((o) => { if (o.isMesh && !inPlunger(o)) body.push(o); });      // the barrel, label and tip: where a hand takes hold; the plunger is for the thumb
          row.thing = hands.add({ id: 'syr:' + s.id, group: 'case', kind: 'take', obj: v.g, hit: body, pad: 0.012, reach: 1.5, hand: { pos: [0.01, 0.02, -0.02], rot: [0.12, Math.PI + 0.25, 0] },
            label: () => `${s.label}${row.v.standIn ? ' (stand-in model)' : ''}`, verb: () => (row.connected ? 'Take it off the port' : 'Pick up'), get: () => `${row.left.toFixed(1)} mL in the syringe`,
            holdHint: 'Carry it to the IV port at the right elbow and click the port to connect.', onTake: () => { if (row.connected) disconnect(row); }, onBack: () => { if (s.given) { ctx.say(`Empty ${s.drug} syringe discarded.`); } } });
          { v.g.updateMatrixWorld(true); const bb = new THREE.Box3(); v.plunger.traverse((o) => { if (o.isMesh) { o.geometry.computeBoundingBox(); bb.union(o.geometry.boundingBox.clone().applyMatrix4(new THREE.Matrix4().copy(v.g.matrixWorld).invert().multiply(o.matrixWorld))); } }); row.thumb = V(0, 0, bb.isEmpty() ? -v.len : bb.min.z + 0.002); }      // the thumb rest: the rear of the plunger, in the syringe's own frame
          hands.add({ id: 'push:' + s.id, group: 'case', kind: 'hold', obj: v.plunger, at: () => v.g.localToWorld(row.thumb.clone()), pad: 0.014, reach: 1.5, when: () => row.connected && !hands.held,
            label: () => `${s.label}: plunger`, verb: () => (s.given ? 'Empty: take the syringe off the port' : 'Press and hold to push'), get: () => `${row.left.toFixed(1)} of ${volOf(s).toFixed(1)} mL left`,
            start: () => startPush(), end: () => stopPush() }); }
        row.i = i; });
      if (pushing && dt > 0) { const row = pushing.row, s = row.s; if (row.left <= 1e-4 || s.given) stopPush(); else { const ml = Math.min(row.left, PUSH_ML_PER_S * dt); pushing.ml += ml; row.pending += ml * mgPerMlOf(s); plungerTo(row); flushT += dt; if (flushT >= FLUSH_S) { flushT = 0; flush(row); } } }      // a hand pushes in real time, whatever the case clock's speed
      for (const row of rows.values()) plungerTo(row); },
    /** For checks: the record of one syringe, and where the kit thinks it is. */
    state() { return { onPort: onPort && onPort.s.id, pushing: !!pushing, rows: [...rows.values()].map((r) => ({ id: r.s.id, drug: r.s.drug, left: +r.left.toFixed(3), givenMg: r.s.givenMg, pushes: r.s.pushes.length, connected: r.connected, standIn: r.v.standIn })) }; },
  };
  return kit;
}
