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
const { loadSchedule, createCase, planStatus, pointWorkstationAt, DRUGS, ACTIONS, matchAction } = await import(new URL('world/js/cases.js', ROOT));
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
{ const C = await createCase(P('p07'), { sequence: 'standard', fetchImpl }); const said = (t) => { const before = new Set(Object.keys(C.done)); const r = C.tell(t); return { r, did: Object.keys(C.done).filter((k) => !before.has(k)) }; };
  const a = said('gloves and eye protection on, then time out'), b = said('pulse ox on and bp cuff and ekg leads'), c = said('baseline vitals'), d = said('machine check, suction on, check the blade light, iv is running');
  ok('steps said in plain words are matched to the steps they name, several in one breath', a.did.includes('ppe') && a.did.includes('timeout') && ['spo2', 'nibp', 'ecg'].every((k) => b.did.includes(k)) && c.did.includes('baseline') && ['machine', 'suction', 'airwaykit', 'iv'].every((k) => d.did.includes(k)), JSON.stringify([a.did, b.did, c.did, d.did]));
  said('sniffing position'); said('preoxygenate'); wait(C, 200); const f = said('end tidal oxygen');
  ok('"end tidal oxygen" reads the end-tidal oxygen aloud; it does not start oxygen again', f.did.includes('eto2') && /end-tidal oxygen \d+%/i.test(f.r.say), f.r.say);
  const g = C.tell('give 2 mg/kg of propofol and 100 mcg of fentanyl'); ok('one sentence with two drugs draws up and gives both', C.given.length === 2 && C.given[0].drug === 'Propofol' && C.given[1].drug === 'Fentanyl', g.say);
  const h = C.tell('phenylephrine 100 mcg for the blood pressure'); ok('a drug order that mentions the blood pressure is an order, not a cuff reading', C.given.at(-1).drug === 'Phenylephrine', h.say);
  const sx = C.tell('succinylcholine 1.5 mg/kg'); ok('a decimal dose by weight is one order, not two sentences', C.given.at(-1).drug === 'Succinylcholine' && Math.abs(C.given.at(-1).totalMg - 1.5 * C.weightKg) < 1, sx.say);
  const bp = C.tell('the blood pressure is 90 over 50'); ok('talking about the blood pressure does not order blood', !/prbc|bolus/i.test(h.say + bp.say) && !C.runner.log.some((e) => /PRBC/i.test(String(e.detail || '') + String(e.kind || ''))), h.say + ' | ' + bp.say);
  const i = C.tell('do a barrel roll'); ok('words that are neither a step nor an order do nothing', !i.ok && i.did === 0, i.say);
  const want = { 'un-tape the eyes': 'untape', 'tape the eyes': 'eyes', 'suction the oropharynx': 'suctionop', 'suction on': 'suction', 'deflate the cuff': 'cuffdown', 'inflate the cuff': 'cuff', 'remove the blade': 'bladeout', 'insert the blade': 'blade', 'open the mouth': 'open', 'open your eyes': 'commands', 'end tidal co2': 'etco2', 'check the end tidal agent': 'agentcheck', 'tell the surgeon we are ready': 'ready', 'the surgeon is closing': 'closing', 'ready to intubate': 'callready', 'stable for transfer': 'stable', 'hand over to the pacu nurse': 'handover', 'secure the tube': 'secure', 'loosen the tape': 'loosen', 'release cricoid': 'uncricoid', 'listen to both lungs': 'breath', 'listen over the stomach': 'epigastric', 'check the eyelash reflex': 'lash', 'remove the stylet': 'stylet', 'connect the circuit': 'circuit', 'pass the tube': 'tube' };
  const wrong = Object.entries(want).filter(([t, id]) => matchAction(t) !== id).map(([t, id]) => `${t} -> ${matchAction(t)} (want ${id})`);
  ok('look-alike phrases go to the right step (tape and un-tape, inflate and deflate, blade in and blade out ...)', wrong.length === 0 && matchAction('face mask oxygen', { extubated: true }) === 'o2device' && matchAction('face mask oxygen') === 'preox', wrong.join('; ') || `${Object.keys(want).length} phrases`); }
// ---- hands: syringes pushed in parts, drugs that are only recorded, drugs that are refused, guarded machine values, the bag and its valve
{ const { buildShelf } = await import(new URL('world/js/cases.js', ROOT)), e = P('p51');
  const SHELF = { drugs: [{ name: 'Propofol', tier: 'modelled', cls: 'induction', unit: 'mg', syringe: { ml: 20, mgPerMl: 10 } }, { name: 'Ondansetron', tier: 'recorded', cls: 'other', unit: 'mg', syringe: { ml: 3, mgPerMl: 2 }, reason: 'it has no effect a monitor would show during the case' },
    { name: 'Hydromorphone', tier: 'refused', reason: 'its effect on breathing is not modelled' }, { name: 'Remifentanil', tier: 'modelled', syringe: { ml: 20, mgPerMl: 0.05 } }] };
  const setup = async () => { const C = await createCase(e, { fetchImpl }); C.shelf = buildShelf(SHELF); all(C, ['ppe', 'timeout', 'spo2', 'nibp', 'ecg', 'baseline', 'preox']); wait(C, 60); return C; };
  const C = await setup(), twin = await setup();
  ok('a drug whose effect the engine cannot show is refused at the draw-up, with the reason', C.draw('Hydromorphone', 1, 'mg').ok === false && /breathing is not modelled/.test(C.lastSay), C.lastSay);
  ok('the formulary file cannot promote a drug: one the engine has no handler for stays refused', C.shelf.get('Remifentanil').tier === 'refused' && C.draw('Remifentanil', 50, 'mcg').ok === false && C.shelf.get('Propofol').tier === 'modelled' && C.shelf.get('Rocuronium').tier === 'modelled');
  const d = C.draw('Propofol', 140, 'mg'), dt = twin.draw('Propofol', 140, 'mg'); ok('the syringe carries its concentration and volume, in the smallest syringe that holds it', d.ok && d.syringe.mgPerMl === 10 && Math.abs(d.syringe.volMl - 14) < 1e-9 && d.syringe.syringeMl === 20, d.say);
  for (let i = 0; i < 4; i++) { const r = C.push(d.syringe.id, 35); if (!r.ok) ok('a part push is accepted', false, JSON.stringify(r)); wait(C, 5); } twin.give(dt.syringe.id); wait(twin, 20); wait(C, 280); wait(twin, 280);
  const a = C.runner.snapshot(), b = twin.runner.snapshot(); ok('four pushes of 35 mg are the same drug as one push of 140 mg, a little later', Math.abs(a.propofolCe - b.propofolCe) < 0.12 && a.propofolCe > 2, `effect site ${a.propofolCe.toFixed(2)} against ${b.propofolCe.toFixed(2)} at five minutes`);
  ok('the record has one line for the syringe, with every push and its time', C.given.length === 1 && C.given[0].pushes.length === 4 && Math.abs(C.given[0].totalMg - 140) < 1e-6 && C.syringes.find((q) => q.id === d.syringe.id).given && C.given[0].route === 'IV' && C.debrief().drugs[0].label.includes('4 pushes') && C.debrief().drugs[0].label.includes('14 mL at 10 mg/mL'), C.debrief().drugs[0].label);
  const d2 = C.draw('Propofol', 50, 'mg'), part = C.push(d2.syringe.id, 20), ce1 = C.runner.snapshot().propofolCe; const junk = [C.push(d2.syringe.id, NaN), C.push(d2.syringe.id, -10), C.push(d2.syringe.id, 'lots'), C.push('nope', 5)]; const over = C.push(d2.syringe.id, 500), none = C.push(d2.syringe.id, 5); wait(C, 1);
  ok('a syringe stopped part-way is recorded as part given; nonsense amounts give nothing; more than is left gives what is left; an empty one gives nothing', part.ok && Math.abs(part.left - 30) < 1e-9 && junk.every((q) => !q.ok) && over.ok && Math.abs(over.mg - 30) < 1e-9 && over.done && !none.ok && Number.isFinite(C.runner.snapshot().propofolCe) && Number.isFinite(ce1), JSON.stringify([part.left, over.mg, none.ok]));
  const logN = C.runner.log.filter((q) => q.kind === 'Drug').length, undoN = C.runner.undoableDoses().length, o = C.draw('Ondansetron', 4, 'mg'), go = C.give(o.syringe.id), rec = C.given.at(-1);
  ok('a recorded-only drug is drawn up, given, timed and written down, and the engine is not told it happened', o.ok && go.ok && /not modelled/.test(go.say) && rec.drug === 'Ondansetron' && rec.tier === 'recorded' && Math.abs(rec.totalMg - 4) < 1e-9 && C.runner.log.filter((q) => q.kind === 'Drug').length === logN && C.runner.undoableDoses().length === undoN && C.runner.log.some((q) => q.kind === 'Drug, recorded only' && /Ondansetron/.test(q.detail)) && /recorded only/.test(C.debrief().drugs.at(-1).label), go.say);
  // the machine
  const v0 = C.runner.snapshot(), ps = C.vent({ mode: 3 }); ok('pressure support is refused: the engine\'s version ignores the patient\'s own breathing', ps.ok === false && C.runner.snapshot().ventMode === v0.ventMode, ps.say);
  C.vent({ mode: 1, setRespiratoryRate: -5, setTidalVolume: 'abc', banana: 3, setPeep: 99, o2FlowLPerMin: 400 }); const v1 = C.runner.snapshot();
  ok('the machine takes only its own controls, each held to what the control can reach', v1.ventMode === 1 && v1.ventSetRR === 4 && v1.ventSetTV === v0.ventSetTV && v1.ventSetPeep === 20 && v1.o2Flow === 15 && !('banana' in C.runner.v) && Number.isFinite(v1.mv), JSON.stringify([v1.ventSetRR, v1.ventSetTV, v1.ventSetPeep, v1.o2Flow]));
  ok('a vaporizer dial is held to what that agent\'s vaporizer has', C.volatile('Sevoflurane', 40).ok && C.runner.snapshot().vaporizer === 8 && C.volatile('Halothane', 1).ok === false);
  // the bag and its valve
  const B = await setup(); B.draw('Propofol', 2, 'mg/kg'); B.give(B.syringes.at(-1).id); wait(B, 60);
  B.setApl(30); const s30 = B.squeeze(500); B.setApl(5); const s5 = B.squeeze(500); B.setApl(1); const s1 = B.squeeze(500);
  ok('the valve limits what a squeeze can put into the patient: 500 mL goes in at 30 cmH2O, half of it at 5, a tenth at 1; the gauge reads the breath or the valve, whichever is lower', s30.delivered === 500 && Math.abs(s30.peak - 10) < 1e-9 && s5.delivered === 250 && s5.peak === 5 && s1.delivered === 50 && s1.peak === 1, JSON.stringify([s30, s5, s1].map((q) => [q.delivered, q.peak])));
  const O = await setup(); O.draw('Propofol', 2, 'mg/kg'); O.give(O.syringes.at(-1).id); wait(O, 45); O.setApl(2); for (let i = 0; i < 5; i++) { O.squeeze(500); wait(O, 5); }
  ok('squeezing against an open valve ventilates nobody: no episode worth the name reaches the engine and the step is not marked', !O.done.mask && !(O.runner.snapshot().mv >= 4), `MV ${O.runner.snapshot().mv}`);
  wait(B, 30); const starts0 = B.runner.log.filter((q) => q.detail === 'mask_ppv_started').length; B.setApl(30); for (let i = 0; i < 5; i++) { B.squeeze(480); wait(B, 5); } const sb = B.runner.snapshot();
  ok('steady squeezes become one episode in the engine at the rate and volume your hand is giving', sb.ppvActive === true && B.hand.episode && Math.abs(B.hand.episode.rate - 12) < 1.5 && Math.abs(sb.tv - 480) < 30 && !!B.done.mask && B.runner.log.filter((q) => q.detail === 'mask_ppv_started').length - starts0 === 1, JSON.stringify([sb.ppvActive, B.hand.episode, sb.tv, B.runner.log.filter((q) => q.detail === 'mask_ppv_started').length - starts0]));
  wait(B, 14); ok('when the hand stops, the engine\'s ventilation stops', B.runner.snapshot().ppvActive === false && B.hand.episode === null);
  for (let i = 0; i < 4; i++) { B.squeeze(480); wait(B, 5); } B.draw('Rocuronium', 0.6, 'mg/kg'); B.give(B.syringes.at(-1).id); wait(B, 5); const it7 = B.sheet('induction').items.find((q) => q.by === 'engine');
  ok('the engine\'s own rule (mask ventilation shown before the relaxant) is met by ventilating with the hand', it7 && it7.points === 2, JSON.stringify(it7 && [it7.n, it7.points]));
  for (let i = 0; i < 16; i++) { B.squeeze(480); wait(B, 5); } all(B, ['tof', 'open', 'blade']); wait(B, 35); const tubed = B.squeeze(480);
  ok('with a tube in, the bag is refused in plain words (the engine has no hand ventilation through a tube)', B.runner.snapshot().airwayDevice === 'intubated' && tubed.ok === false && /not in this simulation/.test(tubed.say), tubed.say);
  // reversal drugs: the engine does not add separate calls, so a syringe pushed in parts must reach it as one dose
  { const mk = async () => { const R = await createCase(P('p54'), { fetchImpl }); R.act('tof'); return R; }, one = await mk(), parts = await mk(), split = await mk();
    const r0 = one.runner.snapshot().tofRatio, d1 = one.draw('Sugammadex', 4, 'mg/kg'), d2 = parts.draw('Sugammadex', 4, 'mg/kg'), d3 = split.draw('Sugammadex', 4, 'mg/kg'); one.give(d1.syringe.id);
    for (let i = 0; i < 4; i++) { parts.push(d2.syringe.id, d2.syringe.totalMg / 4); wait(parts, 1); }                       // one push with short pauses
    split.push(d3.syringe.id, d3.syringe.totalMg / 2); wait(split, 30); split.push(d3.syringe.id, d3.syringe.totalMg / 2);   // a real second dose half a minute later
    wait(one, 120); wait(parts, 120); wait(split, 120); const a1 = one.runner.snapshot().tofRatio, a2 = parts.runner.snapshot().tofRatio, a3 = split.runner.snapshot().tofRatio, gp = parts.given.at(-1), gs = split.given.at(-1);
    ok('sugammadex pushed in four parts a second apart reaches the engine as one dose and reverses the block as one push does', r0 < 0.4 && a1 >= 0.9 && a2 >= 0.9 && gp.pushes.length === 4 && gp.doses.length === 1 && Math.abs(gp.doses[0].mg - d2.syringe.totalMg) < 1e-6 && parts.runner.log.filter((q) => q.kind === 'Drug' && /Sugammadex/.test(q.detail)).length === 1, `ratio ${r0.toFixed(2)} to ${a1.toFixed(2)} in one push, ${a2.toFixed(2)} in four parts`);
    ok('a reversal dose really split by half a minute is two doses, and the debrief says the simulation does not add them', gs.doses.length === 2 && /2 separate doses/.test(split.debrief().drugs.at(-1).label), `ratio after two half doses ${a3.toFixed(2)}; ${split.debrief().drugs.at(-1).label.slice(-90)}`); }
  { const R = await setup(); all(R, ['machine', 'suction', 'airwaykit', 'iv', 'sniff']); R.act('ready'); const n0 = R.runner.log.length; R.vent({ setTidalVolume: 520, setRespiratoryRate: 14 }); R.vent({ setTidalVolume: 520 });
    const lines = R.runner.log.slice(n0).filter((q) => q.kind === 'Machine'); ok('a ventilator change after the induction rubric has closed is still written into the timeline, old value and new, and an unchanged one is not', lines.length === 1 && /tidal volume \d+ to 520 mL/.test(lines[0].detail) && /rate \d+ to 14/.test(lines[0].detail), lines.map((q) => q.detail).join(' | '));
    R.runner.v.co2Kinetics = 'legacy'; R.tick(0.05); ok('the carbon dioxide rule cannot slip back to the original one during a case', R.runner.v.co2Kinetics === 'stores' && R.co2 === 'stores'); }
  // small truths
  const Q = await createCase(e, { fetchImpl }); Q.consent = { needed: true, signed: false }; const t1 = Q.act('timeout'); Q.consent.signed = true; const t2 = Q.act('timeout');
  ok('the time-out cannot say consent was checked while the anesthesia consent is unsigned', t1.ok === false && /not signed/.test(t1.say) && !t1.done && t2.ok === true && !!Q.done.timeout, t1.say);
  Q.staged = true; const st0 = Q.runner.snapshot().surgicalStimulusRaw; Q.act('ready'); const st1 = Q.runner.snapshot().surgicalStimulusRaw; ok('with the operation staged, telling the surgeon you are ready is not the incision', st0 === 0 && st1 === 0 && /position and prepare/.test(Q.lastSay), Q.lastSay); }
ok('every action has a label and a phase', Object.values(ACTIONS).every((a) => a[0] && a[1]));
console.log(`\n${pass} of ${n} engine-level checks pass`); process.exit(pass === n ? 0 : 1);
