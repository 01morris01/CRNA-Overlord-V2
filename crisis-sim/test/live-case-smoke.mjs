import assert from 'node:assert/strict';
import { SimRunner, VentMode } from '../ui/simRunner.js';
import { validateSimulationResult } from '../../ui/liveSimModel.js';

function advance(runner, seconds) {
  runner.core.stepFor(seconds);
  runner.simTime = runner.core.simTime;
  const snapshot = runner.snapshot();
  runner.emit();
  return snapshot;
}

function advanceUntil(runner, predicate, maxSeconds, stepSeconds = 1) {
  for (let elapsed = 0; elapsed < maxSeconds; elapsed += stepSeconds) {
    const snapshot = advance(runner, stepSeconds);
    if (predicate(snapshot)) return snapshot;
  }
  throw new Error(`Condition not reached within ${maxSeconds} simulated seconds`);
}

function line(label, snapshot, extra = '') {
  console.log(
    `${label}: t=${snapshot.t.toFixed(1)}s HR=${snapshot.hr.toFixed(1)} `
    + `SpO2=${snapshot.spo2.toFixed(1)} EtCO2=${snapshot.etco2.toFixed(1)} `
    + `TOF=${snapshot.tof}/${snapshot.tofRatio.toFixed(3)} `
    + `spont=${snapshot.spontaneousRR.toFixed(1)}x${snapshot.spontaneousTV.toFixed(0)} `
    + `ventMV=${snapshot.mv.toFixed(2)} ${extra}`,
  );
}

console.log('LIVE CASE SMOKE: 80 kg induction-to-emergence');
const runner = new SimRunner();
runner.applyConfig({ weightKg: 80, heightCm: 178, ageYears: 52, sex: 'Male' });

runner.setAirwayDevice('mask');
runner.setVentMode(VentMode.Manual);
runner.setMachine({
  o2FlowLPerMin: 10, airFlowLPerMin: 0, n2oFlowLPerMin: 0, setFiO2: 1,
});
runner.logEvent('Machine', 'Preoxygenation · 100% O2 at 10 L/min', { action: 'preoxygenate' });
const preoxygenated = advance(runner, 180);
assert.ok(preoxygenated.fio2 > 0.95, 'preoxygenation must raise FiO2');
assert.ok(preoxygenated.spo2 > 97, 'preoxygenation must preserve saturation');
line('PASS preoxygenation', preoxygenated);

runner.giveBolus('Propofol', 2 * 80, 'Propofol 2 mg/kg · 160 mg total');
runner.giveBolus('Fentanyl', 0.002 * 80, 'Fentanyl 2 mcg/kg · 0.16 mg total');
const lidocaineBolus = runner.giveLidocaineBolus({ doseMgPerKg: 1.5 });
assert.equal(lidocaineBolus.ok, true, lidocaineBolus.reason);
runner.giveBolus('Rocuronium', 0.6 * 80, 'Rocuronium 0.6 mg/kg · 48 mg total');
runner.setForcedApnea(true);
const induced = advanceUntil(
  runner,
  (snapshot) => snapshot.bis < 65 && snapshot.tofRatio < 0.97,
  300,
);
assert.equal(induced.forcedApnea, true);
assert.ok(induced.effectiveNmbBlockade > 0.03, 'rocuronium must increase effective blockade');
assert.ok(induced.lidocainePlasmaTotalMcgMl > 0, 'therapeutic Lidocaine must appear in exposure');
assert.equal(induced.lidocaineToxicityStage, 'none', '1.5 mg/kg Lidocaine must remain therapeutic');
line('PASS induction + paralysis', induced);

const intubation = runner.intubate();
assert.equal(intubation.ok, true, intubation.reason);
const laryngoscopy = runner.snapshot();
assert.equal(laryngoscopy.airwayDevice, 'mask', 'airway must remain unsecured during laryngoscopy');
assert.equal(laryngoscopy.intubationInProgress, true, 'timed attempt must be active');
assert.equal(laryngoscopy.effectiveMV, 0, 'laryngoscopy must inhibit support');
const intubated = advance(runner, intubation.plannedDurationSec);
assert.equal(intubated.lastIntubationOutcome, 'succeeded');
assert.equal(intubated.airwayDevice, 'intubated');
assert.equal(intubated.ventMode, VentMode.Manual, 'tube placement must not silently start VCV');
runner.setVentMode(VentMode.VCV);
runner.setMachine({
  setTidalVolume: 560, setRespiratoryRate: 12, setPeep: 5,
  setFiO2: 0.5, o2FlowLPerMin: 2, airFlowLPerMin: 2,
});
const ventilated = advance(runner, 90);
assert.equal(ventilated.airwayDevice, 'intubated');
assert.equal(ventilated.ventMode, VentMode.VCV);
assert.ok(ventilated.mv > 4, 'mandatory ventilation must produce minute ventilation');
assert.ok(ventilated.capnogramPresent, 'supported intubated ventilation must produce capnogram presence');
line('PASS intubation + VCV', ventilated);

runner.setMachine({ vaporizerAgent: 'Sevoflurane', vaporizerDial: 2.1 });
const maintenance = advance(runner, 20 * 60);
assert.equal(maintenance.forcedApnea, true);
assert.equal(maintenance.airwayDevice, 'intubated');
assert.ok(maintenance.mv > 4);
assert.ok(maintenance.mac > 0, 'volatile maintenance must produce a MAC signal');
line('PASS 20-minute maintenance', maintenance);

runner.injectComplication('Bronchospasm');
const bronchospasm = advance(runner, 10);
assert.ok(bronchospasm.airwayRes > 1.5, 'bronchospasm must raise airway resistance');
assert.ok(bronchospasm.ppeak > maintenance.ppeak, 'bronchospasm must raise peak pressure');
runner.giveBolus('Albuterol', 1, 'Albuterol 1 mg');
const treated = advance(runner, 120);
assert.ok(treated.airwayRes < bronchospasm.airwayRes, 'albuterol must reverse the bronchospasm driver trend');
line('PASS bronchospasm injected + treated', treated, `airwayRes ${bronchospasm.airwayRes.toFixed(2)}→${treated.airwayRes.toFixed(2)}`);

runner.setMachine({ vaporizerDial: 0, setFiO2: 1, o2FlowLPerMin: 10, airFlowLPerMin: 0 });
runner.giveBolus('Sugammadex', 4 * 80, 'Sugammadex 4 mg/kg · 320 mg total');
const reversed = advanceUntil(runner, (snapshot) => snapshot.tofRatio >= 0.9, 900);
assert.ok(reversed.tofRatio >= 0.9);
line('PASS sugammadex reversal', reversed);

runner.setForcedApnea(false);
const breathingOverVent = advanceUntil(
  runner,
  (snapshot) => snapshot.spontaneousRR > 2
    && snapshot.spontaneousTV > 100
    && snapshot.spontaneousMV > 0.5
    && snapshot.spontaneousEffort > 0.1,
  600,
);
assert.equal(breathingOverVent.ventMode, VentMode.VCV, 'mandatory ventilation must remain active');
assert.ok(breathingOverVent.mv > 4, 'mandatory vent output must remain visible');
line('PASS spontaneous effort over mandatory ventilation', breathingOverVent);

const extubation = runner.extubate();
assert.equal(extubation.ok, true, extubation.reason);
const extubated = advance(runner, 30);
assert.equal(extubated.airwayDevice, 'extubated');
assert.equal(extubated.ventMode, VentMode.Manual);
assert.ok(extubated.spontaneousEffort > 0.1);
line('PASS extubation', extubated);

const debrief = runner.buildDebrief();
assert.equal(debrief.lidocaineAttribution.doseHistory[0].type, 'iv_bolus');
assert.equal(debrief.lidocaineAttribution.currentToxicityStage, 'none');
const debriefValidation = validateSimulationResult(debrief);
assert.deepEqual(debriefValidation, { ok: true, missing: [], invalid: [] });
console.log(`PASS debrief SimulationResult validation: ${Object.keys(debrief).length} fields`);

console.log('LIVE CASE SMOKE: neostigmine TOF-0 negative case');
const negative = new SimRunner();
negative.applyConfig({ weightKg: 80 });
for (let dose = 0; dose < 5; dose += 1) {
  negative.giveBolus('Rocuronium', 0.6 * 80, 'Rocuronium 0.6 mg/kg · 48 mg total');
}
const tofZero = advanceUntil(negative, (snapshot) => snapshot.tof === 0, 600);
assert.equal(tofZero.tof, 0);
negative.giveBolus('Neostigmine', Math.min(0.07 * 80, 5), 'Neostigmine 0.07 mg/kg · 5 mg total');
const afterNeostigmine = advance(negative, 420);
const neoLog = negative.log.find((entry) => entry.meta?.drug === 'Neostigmine');
assert.ok(neoLog, 'neostigmine must be logged');
assert.equal(neoLog.meta.doseMg, 5, 'neostigmine log must contain total milligrams');
assert.equal(afterNeostigmine.neostigmineRocRelief, 0, 'TOF-0 neostigmine must have no reversal effect');
assert.ok(afterNeostigmine.tofRatio < 0.9, 'block must persist below the extubation endpoint');
line('PASS TOF-0 neostigmine logs without reversal', afterNeostigmine);

console.log('LIVE CASE SMOKE: PASS');
