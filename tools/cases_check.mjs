// cases_check.mjs: the in-room case logic, run against the real engine with no browser.
//     node tools/cases_check.mjs
// It takes scheduled patients through whole anesthetics by calling exactly what the room's buttons call, and checks that the
// engine responds, that the record against the program's rubrics is what the actions deserve, and that a clinically wrong
// action is not rewarded. It checks behaviour of the wiring. It does not check that the engine's physiology is right.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const ROOT = new URL('../', import.meta.url); let pass = 0, n = 0;
const ok = (name, cond, detail = '') => { n++; if (cond) pass++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (detail ? ' :: ' + String(detail).slice(0, 200) : '')); };
const fetchImpl = async (u) => { try { const t = readFileSync(fileURLToPath(new URL(u))); return { ok: true, status: 200, json: async () => JSON.parse(t) }; } catch (e) { return { ok: false, status: 404, json: async () => null }; } };
const store = new Map(); globalThis.localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
const { loadSchedule, createCase, planStatus, pointWorkstationAt, DRUGS, ACTIONS } = await import(new URL('world/js/cases.js', ROOT));
const sched = await loadSchedule(fetchImpl); const P = (id) => sched.find((p) => p.id === id);
ok('the schedule loads every patient, and most can be run on the engine', sched.length === 56 && sched.filter((p) => p.engineSupported).length === 53, `${sched.length} patients`);
ok('every drug the engine accepts can be drawn up, each with a label class', DRUGS.length >= 19 && DRUGS.every((d) => d.cls && d.unit));
pointWorkstationAt('p07'); ok('the workstation is pointed at the chosen patient and reports no plan yet', JSON.parse(store.get('overlord.student.session.v1')).patientId === 'p07' && planStatus('p07').submitted === false);
const wait = (C, s) => { C.runner.pause(); C.runner.stepFor(s); for (let i = 0; i < 3; i++) C.tick(0.05); };
const all = (C, ids) => ids.map((id) => C.act(id));

// ---- 1. a standard induction and emergence, done properly, on an ordinary scheduled patient with their own physiology
{ const e = P('p07'), C = await createCase(e, { sequence: 'standard', fetchImpl }); const s0 = C.runner.snapshot();
  ok('the case runs on this patient\'s own weight and vital signs, with the corrected carbon dioxide rule', Math.abs(C.weightKg - e.physiology.weightKg) < 0.01 && Math.round(s0.hr) === e.physiology.baselineHR && C.co2 === 'stores', `${C.weightKg} kg, HR ${s0.hr}`);
  let m = C.tick(0.1); ok('before anything is connected the monitor has nothing to show', Number.isNaN(m.shown.hr) && Number.isNaN(m.shown.spo2) && m.nibp === null);
  ok('baseline vital signs cannot be read before the monitors are on', C.act('baseline').ok === false);
  all(C, ['ppe', 'timeout', 'spo2', 'nibp', 'ecg', 'baseline', 'machine', 'suction', 'airwaykit', 'iv', 'sniff']); m = C.tick(0.1);
  ok('with monitors on, heart rate, saturation and a cuff pressure appear', m.shown.hr > 30 && m.shown.spo2 > 80 && m.nibp && m.nibp.sbp > 60, JSON.stringify(m.nibp));
  const big = C.draw('Propofol', 5000, 'mg'); ok('a dose far outside the engine\'s range is refused at the draw-up', big.ok === false, big.say);
  const prop = C.draw('Propofol', 2, 'mg/kg'), fent = C.draw('Fentanyl', 100, 'mcg'), roc = C.draw('Rocuronium', 0.6, 'mg/kg'); ok('doses by weight are worked out for this patient', prop.ok && Math.abs(prop.syringe.totalMg - 2 * C.weightKg) < 0.01 && roc.ok, prop.say);
  C.act('preox'); wait(C, 185); const eo = C.act('eto2'); ok('three minutes of 100% oxygen bring end-tidal oxygen above 90%', C.eto2Called > 90, eo.say);
  const before = C.runner.snapshot().etco2; C.give(fent.syringe.id); C.give(prop.syringe.id); wait(C, 50); const sI = C.runner.snapshot();
  ok('the induction dose takes effect in the engine', sI.bis < 70 && sI.sbp < s0.sbp, `BIS ${sI.bis.toFixed(0)} BP ${sI.sbp.toFixed(0)}`);
  ok('carbon dioxide stays physiologic through induction', before < 46 && sI.etco2 < 55, `${before.toFixed(0)} -> ${sI.etco2.toFixed(0)} mmHg`);
  all(C, ['lash', 'mask']); wait(C, 32); C.give(roc.syringe.id); const early = C.act('apnea'); all(C, ['reassess1', 'eyes']); C.act('mask'); wait(C, 120); const late = C.act('apnea'); const t1 = C.act('tof');
  ok('apnea cannot be confirmed while the patient is still breathing, and can once the relaxant has worked', early.ok === false && late.ok === true, early.say + ' / ' + late.say);
  ok('the relaxant takes the train of four to zero', C.tofChecks.at(-1).count === 0, t1.say);
  all(C, ['callready', 'open', 'blade']); wait(C, 12); all(C, ['view', 'tube']); wait(C, 22); m = C.tick(0.1);
  ok('laryngoscopy takes the engine\'s thirty seconds and ends with the tube in', m.s.airwayDevice === 'intubated' && C.lastAttempt && C.lastAttempt.outcome === 'succeeded', JSON.stringify(C.lastAttempt));
  all(C, ['bladeout', 'stylet', 'cuff', 'circuit']); C.vent({ mode: 1, setTidalVolume: Math.round(C.weightKg * 6 / 10) * 10, setRespiratoryRate: 12, setPeep: 5, o2FlowLPerMin: 1, airFlowLPerMin: 1 }); wait(C, 25);
  const ec = C.act('etco2'); ok('end-tidal CO2 is confirmed only once the ventilator is delivering breaths', ec.ok, ec.say);
  all(C, ['chest', 'breath', 'epigastric', 'mist', 'secure']); C.volatile('Sevoflurane', 2); wait(C, 60); all(C, ['reassess2', 'agentcheck', 'ready']);
  const ind = C.sheet('induction'); ok('a complete standard induction is closed by the engine itself: every item performed, outcome PASS', ind.final && ind.items.length === 14 && ind.raw === ind.max && ind.pass && C.final.outcome === 'PASS' && ind.items.find((q) => q.id === 'standard-7').by === 'engine', `${ind.raw}/${ind.max} ${JSON.stringify(ind.items.filter((q) => q.points !== 2).map((q) => [q.n, q.missing]))}`);
  wait(C, 900); const sM = C.runner.snapshot(); ok('during maintenance the engine shows agent on board and mechanical breaths', sM.etAgent > 0.8 && sM.ppeak > 5 && sM.capnogramPresent, `Et ${sM.etAgent.toFixed(2)} Ppeak ${sM.ppeak.toFixed(0)}`);
  C.act('closing'); C.volatile('Sevoflurane', 0); C.vent({ o2FlowLPerMin: 10, airFlowLPerMin: 0 }); C.act('tof'); const sug = C.draw('Sugammadex', 4, 'mg/kg'); C.give(sug.syringe.id); wait(C, 420); C.act('tof');
  ok('reversal brings the train of four ratio back', C.tofChecks.at(-1).ratio >= 0.9, C.said.at(-1).text);
  C.vent({ mode: 0 }); wait(C, 240); all(C, ['spont', 'untape', 'suctionop', 'loosen', 'reassess3']); let cmd = C.act('commands'); for (let i = 0; i < 12 && !cmd.ok; i++) { wait(C, 60); cmd = C.act('commands'); }
  ok('the patient follows commands only once the engine has them awake', cmd.ok, cmd.say + ' at ' + Math.round(C.runner.simTime / 60) + ' min');
  all(C, ['spont', 'cuffdown', 'extubate']); wait(C, 30); all(C, ['o2device', 'obstruction', 'stable', 'handover']);
  const em = C.sheet('emergence'), d = C.debrief(); ok('a proper emergence scores every item against the engine\'s own thresholds', em.raw === em.max && em.pass, `${em.raw}/${em.max} ${JSON.stringify(em.items.filter((q) => q.points !== 2).map((q) => [q.n, q.missing]))}`);
  ok('the debrief lists the drugs with their dose by weight and the whole timeline', d.drugs.length === 4 && d.drugs[0].perKg > 0 && d.log.length > 15 && d.attempts === 1 && d.lowestSpo2 > 90, JSON.stringify(d.drugs));
  ok('after handover nothing more can be done to the patient', C.act('extubate').ok === false);
}
// ---- 2. the same patient done badly: nothing is rewarded that was not earned
{ const C = await createCase(P('p07'), { sequence: 'standard', fetchImpl }); all(C, ['spo2', 'ecg', 'nibp']);
  const prop = C.draw('Propofol', 200, 'mg'), roc = C.draw('Rocuronium', 60, 'mg'); C.give(prop.syringe.id); C.give(roc.syringe.id); wait(C, 150); all(C, ['open', 'blade']); wait(C, 35); all(C, ['tube', 'circuit']); C.vent({ mode: 1, setTidalVolume: 500, setRespiratoryRate: 12 }); wait(C, 30); C.act('etco2'); C.volatile('Sevoflurane', 2); C.act('ready');
  const ind = C.sheet('induction'), it = (id) => ind.items.find((q) => q.id === id);
  ok('skipping the time-out, pre-oxygenation and the test ventilation before the relaxant loses those items', it('standard-2').points === 0 && it('standard-5').points === 0 && it('standard-7').points !== 2 && !ind.pass, `${ind.raw}/${ind.max}, criticals missed ${ind.criticalsMissed.join(',')}`);
  C.act('closing'); C.act('extubate'); const em = C.sheet('emergence'), e7 = em.items.find((q) => q.id === 'emergence-7'), e3 = em.items.find((q) => q.id === 'emergence-3');
  ok('extubating a paralysed, anesthetised patient scores nothing for readiness to extubate and fails the emergence', e7.points < 2 && e3.points === 0 && !em.pass && C.atExtubation.tofRatio < 0.9, `TOF ratio at extubation ${C.atExtubation.tofRatio.toFixed(2)}; ${em.raw}/${em.max}`);
}
// ---- 3. the program's own scored scenarios run unchanged
{ const C = await createCase(P('p52'), { fetchImpl }); ok('the rapid sequence patient loads the program\'s own scenario and the 53-item rubric', C.kind === 'rsi' && C.own === 'rsi_full_stomach_001' && C.rubric.items.length >= 50, `${C.rubric.items.length} items`);
  all(C, ['ppe', 'timeout', 'spo2', 'nibp', 'ecg', 'baseline', 'machine', 'suction', 'airwaykit', 'iv', 'sniff', 'preox']); const p = C.draw('Propofol', 2, 'mg/kg'), sx = C.draw('Succinylcholine', 1.5, 'mg/kg'); wait(C, 185); C.act('eto2'); C.give(p.syringe.id); C.act('cricoid'); C.give(sx.syringe.id); wait(C, 60); all(C, ['apnea', 'reassess1', 'eyes', 'callready', 'open', 'blade']); wait(C, 34); C.tick(0.1);
  all(C, ['view', 'tube', 'bladeout', 'stylet', 'cuff', 'circuit']); C.vent({ mode: 1, setTidalVolume: 450, setRespiratoryRate: 12, o2FlowLPerMin: 1, airFlowLPerMin: 1, setFiO2: 0.5 }); wait(C, 25); all(C, ['etco2', 'chest', 'breath', 'epigastric', 'mist', 'uncricoid', 'secure']); C.volatile('Sevoflurane', 2); wait(C, 40); all(C, ['reassess2', 'agentcheck', 'ready']);
  const ind = C.sheet('induction'), eng = ind.items.filter((q) => q.by === 'engine'); ok('a rapid sequence done in order is closed by the engine at 100%, PASS, with its conditional items resolved', ind.final && eng.length >= 12 && ind.percent === 100 && ind.pass && ind.items.find((q) => q.id === 'rsi-11').points === 2 && ind.items.find((q) => q.id === 'rsi-9').points === 2 && ind.items.find((q) => q.id === 'rsi-28').points === 2, `${ind.raw}/${ind.max}; engine scored ${eng.length}; not full: ${JSON.stringify(ind.items.filter((q) => q.points !== 2).map((q) => q.n))}`);
}
{ const C = await createCase(P('p54'), { fetchImpl }); const s = C.runner.snapshot(); ok('the emergence patient starts at the end of the case: tube in, agent on, relaxant still working', C.kind === 'emergence' && s.airwayDevice === 'intubated' && C.sheet('induction') === null && C.sheet('emergence').items.length === 9, `TOF ratio ${s.tofRatio.toFixed(2)}`); }
{ let threw = false; try { await createCase(P('p01'), { fetchImpl }); } catch (e) { threw = true; } ok('a child below the engine\'s weight floor is chart-only: no case is started', threw); }
{ const C = await createCase(P('p07'), { fetchImpl }); const r1 = C.order('give 100 of propofol'), r2 = C.order('sevo 2 percent'), r3 = C.order('rocuronium'), r4 = C.order('50 milligrams'); ok('orders in Booth\'s own words draw, give and ask for a missing dose', r1.ok && C.given[0].drug === 'Propofol' && r2.ok && /how much/i.test(r3.say) && r4.ok && C.given.at(-1).drug === 'Rocuronium', [r1.say, r3.say, r4.say].join(' | ')); }
ok('every action has a label and a phase', Object.values(ACTIONS).every((a) => a[0] && a[1]));
console.log(`\n${pass} of ${n} engine-level checks pass`); process.exit(pass === n ? 0 : 1);
