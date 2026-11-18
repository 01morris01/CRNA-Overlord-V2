/** Bedside: the monitoring you put on the patient with your own hands.
 *
 *  The oximeter probe and the pressure cuff lie on the table beside the patient's head with their cables run from the monitor.
 *  You pick one up, the places it can go are ringed on the patient, and you put it there. Putting it on is the case's own
 *  action (the same one the step list presses), so the monitor's channel comes up because the case recorded the sensor, and
 *  for no other reason; taking it off again blanks the channel. If a step is pressed on the list instead, the thing is shown
 *  where the record says it is. Where each sensor went is written into the case's record.
 *
 *  When a step is pressed on the list, the cuff goes on the LEFT arm and the probe on the RIGHT index finger: the chart's IV is in the
 *  right antecubital fossa, and a cuff is not put on the IV arm or on the arm with the oximeter (it would stop both each time it cycles).
 *
 *  What is not modeled: a reading does not depend on which finger or arm you chose (the simulation has no sensors, only the
 *  values; see docs/overlord-world/ENGINE-COVERAGE.md).
 */
import * as THREE from 'three';
import { bodySites } from './body.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

export async function mountBedside({ world, hands }) {
  const [pg, cg] = await Promise.all([world.loadModel('models/airway/spo2_probe.glb'), world.loadModel('models/airway/nibp_cuff.glb')]);
  const probe = pg.scene, cuff = cg.scene; probe.name = 'spo2_probe'; cuff.name = 'nibp_cuff';
  const lines = new THREE.Group(); lines.name = 'bedside_cables'; let inRoom = false, ctx = null, sites = null, st = null;
  const wire = (r, colour) => { const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(), V(0, 0.01, 0)]), 2, r, 4), new THREE.MeshStandardMaterial({ color: colour, roughness: 0.55 })); m.name = 'cable'; m.userData.r = r; m.userData.a = V(); m.userData.b = V(9, 9, 9); lines.add(m); return m; };
  const probeWire = wire(0.0021, 0xd9dde0), cuffHose = wire(0.0042, 0x2c3238);
  /** A cable hanging between two points: down from the monitor, a sag in the middle, up to the thing. Rebuilt only when an end has moved. */
  function hang(mesh, a, b, sag = 0.16) { const u = mesh.userData; if (u.a.distanceToSquared(a) < 1e-6 && u.b.distanceToSquared(b) < 2.5e-5) return; u.a.copy(a); u.b.copy(b); const mid = a.clone().lerp(b, 0.5); mid.y = Math.max(0.3, Math.min(a.y, b.y) - sag * Math.min(1, a.distanceTo(b)));
    const pts = [a, a.clone().add(V(0, -0.1, 0.03)), mid, b.clone().add(V(0, 0.035, 0)).lerp(mid, 0.12), b]; mesh.geometry.dispose(); mesh.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.35), 40, u.r, 6); }
  const basis = (z, up) => { const zz = z.clone().normalize(), xx = new THREE.Vector3().crossVectors(up, zz).normalize(), yy = new THREE.Vector3().crossVectors(zz, xx); return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(xx, yy, zz)); };
  const localQuat = (root, q) => root.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(q);
  const HOME = { probe: { pos: [-0.27, 0.021, -0.80], rot: [0, 0.5, 0] }, cuff: { pos: [0.27, 0.069, -0.82], rot: [0, 1.35, 0] } };      // beside the head, on the mattress (meters from the table center at the mattress top)
  const SPO2 = ['fingerL', 'fingerR'], NIBP = ['armL', 'armR'];
  function home(obj, key, fast = false) { const T = ctx ? ctx.TABLE : world.level.stations.or.table && V(world.level.stations.or.table[0], 0.9, world.level.stations.or.table[1]), h = HOME[key]; const pos = [T.x + h.pos[0], T.y + h.pos[1], T.z + h.pos[2]]; if (fast) { world.scene.attach(obj); obj.position.set(...pos); obj.rotation.set(...h.rot); obj.scale.setScalar(1); } else hands.settle(obj, world.scene, { pos, rot: h.rot, scale: 1 }, 0.25); }
  function ensure() { if (inRoom) return; inRoom = true; const T = world.level.stations.or.table, at = V(T[0], 1.0, T[1] - 0.8);
    for (const o of [probe, cuff, lines]) world.place(o, { at, room: 'or', envI: 0.5, shadow: false }); home(probe, 'probe', true); home(cuff, 'cuff', true); }
  /** The kit belongs to whichever room the case is in: the building draws only the things of the room you can see from where you stand. */
  function toRoom(room, T) { const at = V(T.x, 1.0, T.z - 0.8); for (const o of [probe, cuff, lines]) world.move(o, { at, room }); }
  function onto(obj, id) { const s = sites.get(id), P = ctx.P; if (!s) return false; const up = s.normal.clone(), q = basis(s.axis || V(0, 0, 1), up), local = s.local.clone();
    if (obj === probe) local.y += 0.004; hands.settle(obj, P.root, { pos: local.toArray(), quat: localQuat(P.root, q), scale: 1 }, 0.22); return true; }

  const kit = { name: 'bedside',
    begin(c) { ctx = c; ensure(); toRoom(c.room || 'or', c.TABLE); const C = c.C, P = c.P; st = C.kit ||= {}; st.sites ||= {}; sites = P ? bodySites(P, { heightM: (c.entry.physiology && c.entry.physiology.heightCm ? c.entry.physiology.heightCm / 100 : 1.72) }) : null; kit.sites = sites; st.shown = { spo2: null, nibp: null }; home(probe, 'probe', true); home(cuff, 'cuff', true);
      if (!hands || !sites) return;
      const off = (key, word) => () => { if (!C.mon[key]) return; C.mon[key] = false; st.sites[key] = null; st.shown[key] = null; c.say(`${word} off.`); };
      const T = {
        probe: hands.add({ id: 'spo2probe', group: 'case', kind: 'take', obj: probe, pad: 0.035, reach: 1.45, hand: { pos: [0, 0, 0], rot: [0.5, -0.6, 0.2] }, label: () => (C.mon.spo2 ? `Pulse oximeter probe, on the ${sites.get(st.sites.spo2 || 'fingerL').label}` : 'Pulse oximeter probe'), verb: () => (C.mon.spo2 ? 'Take it off' : 'Pick up'), holdHint: 'Clip it on a fingertip.', onTake: off('spo2', 'Pulse oximeter'), onBack: () => { st.shown.spo2 = null; } }),
        cuff: hands.add({ id: 'nibpcuff', group: 'case', kind: 'take', obj: cuff, pad: 0.05, reach: 1.45, hand: { pos: [0.02, -0.02, 0.04], rot: [0.3, -0.9, 0.1], scale: 0.85 }, label: () => (C.mon.nibp ? `Blood pressure cuff, on the ${sites.get(st.sites.nibp || 'armR').label}` : 'Blood pressure cuff'), verb: () => (C.mon.nibp ? 'Take it off' : 'Pick up'), holdHint: 'Wrap it round an upper arm.', onTake: off('nibp', 'Blood pressure cuff'), onBack: () => { st.shown.nibp = null; } }),
      };
      for (const id of SPO2) hands.add({ id: 'spo2@' + id, group: 'case', kind: 'place', pad: 0.03, reach: 1.45, at: () => sites.get(id) && sites.get(id).pos, label: () => 'Clip it on the ' + sites.get(id).label, verb: 'Put it here', takes: (h) => h === T.probe, when: () => !!sites.get(id), put: () => { st.sites.spo2 = id; st.shown.spo2 = id; onto(probe, id); const r = c.act('spo2'); if (C.done.spo2) C.done.spo2.site = sites.get(id).label; return r.ok; } });
      for (const id of NIBP) hands.add({ id: 'nibp@' + id, group: 'case', kind: 'place', pad: 0.06, reach: 1.45, at: () => sites.get(id) && sites.get(id).pos, label: () => 'Wrap it round the ' + sites.get(id).label, verb: 'Put it here', takes: (h) => h === T.cuff, when: () => !!sites.get(id), put: () => { st.sites.nibp = id; st.shown.nibp = id; onto(cuff, id); const r = c.act('nibp'); if (C.done.nibp) C.done.nibp.site = sites.get(id).label; return r.ok; } });
      kit.things = T; },
    end() { ctx = null; sites = null; st = null; kit.things = null; if (inRoom) { home(probe, 'probe', true); home(cuff, 'cuff', true); const T = world.level.stations.or.table; toRoom('or', V(T[0], 0.9, T[1])); } },
    /** Show each thing where the case's record says it is: on the patient once the record has the sensor on, at home otherwise. */
    update() { if (!ctx || !st) return; const C = ctx.C, held = hands && hands.held;
      if (sites) { const want = { spo2: C.mon.spo2 ? (st.sites.spo2 ||= (st.sites.nibp === 'armR' ? 'fingerL' : 'fingerR')) : null, nibp: C.mon.nibp ? (st.sites.nibp ||= (st.sites.spo2 === 'fingerL' ? 'armR' : 'armL')) : null };
        for (const [key, obj, th] of [['spo2', probe, kit.things && kit.things.probe], ['nibp', cuff, kit.things && kit.things.cuff]]) { if (held && held === th) continue; if (st.shown[key] !== want[key]) { st.shown[key] = want[key]; if (want[key]) { onto(obj, want[key]); if (C.done[key]) C.done[key].site ||= sites.get(want[key]).label; } else home(obj, key === 'spo2' ? 'probe' : 'cuff'); } } }
      const m = ctx.machine; if (m) { m.updateMatrixWorld(true); const a = m.localToWorld(V(-0.62, 1.37, 0.03)), b = m.localToWorld(V(-0.62, 1.33, 0.03)); hang(probeWire, a, probe.getWorldPosition(V()).add(V(0, 0.004, 0)), 0.22); hang(cuffHose, b, cuff.localToWorld(V(0, 0.056, 0.07)), 0.3); } },
  };
  return kit;
}
