/* Barrel + rig/driver helpers for the ported anesthesia sim engine. */
export * from './float32.js';
export { SimRandom } from './simRandom.js';
export { PatientPhysiology, Status, AirwayDevice } from './patientPhysiology.js';
export { DrugSystem } from './drugSystem.js';
export { rocuroniumBlockFromCe } from './neuromuscularModel.js';
export { VentilatorSystem, VentMode } from './ventilatorSystem.js';
export { AirwayProcedureSystem } from './airwayProcedureSystem.js';
export { SimulationCore } from './simulationCore.js';
export { ScenarioManager, ScenarioState } from './scenario/scenarioManager.js';
export { normalize, ScenarioEventType } from './scenario/scenarioLoader.js';

import { PatientPhysiology } from './patientPhysiology.js';
import { DrugSystem } from './drugSystem.js';
import { VentilatorSystem } from './ventilatorSystem.js';
import { SimulationCore } from './simulationCore.js';
import { ScenarioManager } from './scenario/scenarioManager.js';

/**
 * Build a scenario rig mirroring ScenarioParityExport.BuildRig / SimEvidence.BuildRig:
 * default patient (70/170/45), wired subsystems, central drive, seeded RNG.
 */
export function buildRig(seed) {
  const p = new PatientPhysiology();
  const d = new DrugSystem(); d.patient = p;
  const v = new VentilatorSystem(); v.patient = p;
  const s = new ScenarioManager();
  s.patient = p; s.drugSystem = d; s.ventilator = v;
  const core = new SimulationCore();
  core.patient = p; core.drugSystem = d; core.ventilator = v;
  core.alarmSystem = null; core.scenario = s; core.autoDrive = false;
  p.resetToBaseline();
  core.initialize(seed);
  return { p, d, v, s, core };
}

/**
 * Physiology-only rig mirroring SimEvidence.BuildRig (patient + drugs +
 * ventilator + core; no scenario). Sets demographics before reset.
 */
export function buildPhysRig(seed, weightKg = 70, heightCm = 170, ageYears = 45) {
  const p = new PatientPhysiology();
  p.weightKg = weightKg; p.heightCm = heightCm; p.ageYears = ageYears;
  const d = new DrugSystem(); d.patient = p;
  const v = new VentilatorSystem(); v.patient = p;
  const core = new SimulationCore();
  core.patient = p; core.drugSystem = d; core.ventilator = v;
  core.alarmSystem = null; core.scenario = null; core.autoDrive = false;
  p.resetToBaseline();
  core.initialize(seed);
  return { p, d, v, core };
}
