import assert from 'node:assert/strict';
import { SimRunner } from '../ui/simRunner.js';

const numericKeys = [
  't', 'hr', 'sbp', 'dbp', 'map', 'spo2', 'rr', 'etco2', 'temp',
  'bis', 'mac', 'etAgent', 'tof', 'tofRatio', 'ppeak', 'mv', 'tv',
  'fio2', 'ventMode', 'vaporizer', 'ventSetTV', 'ventSetRR', 'ventSetPeep', 'ventSetFiO2',
  'ventSetPressure', 'ventSetPressureSupport', 'o2Flow', 'airFlow', 'n2oFlow', 'status',
  'forcedApneaContribution', 'drugDepressionContribution',
  'complicationDriveContribution', 'centralDrive', 'effectiveNmbBlockade',
  'respiratoryMuscleCapability', 'spontaneousRR', 'spontaneousTV',
  'spontaneousMV', 'spontaneousEffort', 'sugammadexRocRelief',
  'neostigmineRocRelief', 'speed', 'svr', 'vol', 'airwayRes', 'shunt',
  'hrOffset', 'respDrive', 'heat', 'vco2', 'propofolCe', 'fentanylCe',
  'midazolamCe', 'weightKg',
  'eto2', 'mechanicalMV', 'effectiveMV', 'proceduralApneaContribution',
  'ppvEpisodeCount', 'intubationAttemptCount',
  'tofCheckCount',
  'lidocainePlasmaTotalMcgMl', 'lidocainePlasmaFreeMcgMl',
  'lidocaineEffectSiteMcgMl', 'lidocaineCentralMg', 'lidocainePeripheralMg',
  'lidocaineEliminatedMg', 'lidocaineCumulativeMg', 'lidocaineCumulativeMgKg',
  'lidocaineInfusionRateMgKgHour', 'lidocaineClearanceFactor',
  'regionalSensoryBlock', 'regionalMotorBlock', 'epiduralSympathectomyContribution',
  'surgicalStimulusRaw', 'surgicalStimulusEffective',
  'lidocaineSystemicAnalgesicContribution', 'lidocaineAntiarrhythmicContribution',
  'ventricularIrritabilityRaw', 'ventricularIrritabilityEffective',
  'lidocaineCnsToxicity', 'lidocaineCardiacToxicity', 'lipidCumulativeMlKg',
];

const booleanKeys = [
  'intubated', 'spont', 'forcedApnea', 'capnogramPresent', 'running',
  'proceduralApnea', 'cricoidPressureActive', 'ppvActive', 'intubationInProgress',
  'lidocaineInfusionActive', 'lidocaineSeizureActive', 'lipidInfusionActive',
];

const stringKeys = [
  'agent', 'vaporizerAgent', 'airwayDevice', 'lifecycle', 'patient', 'lastIntubationOutcome',
  'derivedRhythm', 'lidocaineToxicityStage',
];

const arrayKeys = [
  'cricoidPressureHistory', 'ppvHistory', 'intubationAttempts', 'tofCheckHistory',
  'lidocaineRegionalHistory', 'lidocaineDoseHistory', 'lidocaineToxicityHistory',
  'lipidRescueHistory', 'activeAnestheticInfusions',
];
const nullableObjectKeys = [
  'ppvCurrent', 'lastTofCheck', 'instructorNmbTarget', 'activeRubricScenario',
];

const requiredKeys = [
  ...numericKeys, ...booleanKeys, ...stringKeys, ...arrayKeys, ...nullableObjectKeys,
];

const runner = new SimRunner();
runner.core.stepOnce(runner.core.fixedStep);
runner.simTime = runner.core.simTime;
const snapshot = runner.snapshot();

for (const key of requiredKeys) {
  assert.ok(Object.hasOwn(snapshot, key), `snapshot is missing ${key}`);
}

for (const key of numericKeys) {
  assert.equal(typeof snapshot[key], 'number', `${key} must be a number`);
  assert.ok(Number.isFinite(snapshot[key]), `${key} must be finite`);
}

for (const key of booleanKeys) {
  assert.equal(typeof snapshot[key], 'boolean', `${key} must be a boolean`);
}

for (const key of stringKeys) {
  assert.equal(typeof snapshot[key], 'string', `${key} must be a string`);
}

for (const key of arrayKeys) {
  assert.ok(Array.isArray(snapshot[key]), `${key} must be an array`);
}

for (const key of nullableObjectKeys) {
  assert.ok(snapshot[key] === null || typeof snapshot[key] === 'object', `${key} must be null or an object`);
}

assert.ok(
  ['mask', 'intubated', 'extubated'].includes(snapshot.airwayDevice),
  `unexpected airwayDevice: ${snapshot.airwayDevice}`,
);
assert.ok(
  ['READY', 'RUNNING', 'PAUSED'].includes(snapshot.lifecycle),
  `unexpected lifecycle: ${snapshot.lifecycle}`,
);

assert.equal(Object.keys(snapshot).length, requiredKeys.length, 'snapshot key count changed');
for (const forbidden of [
  'caseExperience', 'caseContext', 'learnerChart', 'assessment', 'planRequirements',
  'instructorGuide', 'considerations', 'expectedResponse', 'scoringGuidance',
]) {
  assert.equal(Object.hasOwn(snapshot, forbidden), false, `snapshot leaked ${forbidden}`);
}

runner.administerRegionalLidocaine({
  route: 'peripheral', concentrationPercent: 1.5, volumeMl: 20, epinephrine: false,
});
runner.giveLidocaineBolus({ doseMgPerKg: 1.5 });
const copied = runner.snapshot();
copied.lidocaineRegionalHistory[0].remainingMg = -1;
copied.lidocaineDoseHistory[0].totalDoseMg = -1;
assert.equal(runner.snapshot().lidocaineRegionalHistory[0].remainingMg, 300);
assert.ok(runner.snapshot().lidocaineDoseHistory[0].totalDoseMg > 0);

runner.d.startInfusion('Propofol', 300);
runner.d.startInfusion('Fentanyl', 0.1);
const infusionSnapshot = runner.snapshot();
assert.deepEqual(infusionSnapshot.activeAnestheticInfusions, [
  { drug: 'Propofol', rate: 300 },
]);
infusionSnapshot.activeAnestheticInfusions[0].rate = -1;
assert.equal(runner.snapshot().activeAnestheticInfusions[0].rate, 300);

assert.equal(snapshot.instructorNmbTarget, null);
const administrativeNmb = runner.setInstructorNmbTarget({ targetTofRatio: 0.7 });
const nmbSnapshot = runner.snapshot().instructorNmbTarget;
assert.deepEqual(Object.keys(nmbSnapshot), [
  'source',
  'targetTofRatio',
  'targetBlockade',
  'rocuroniumCe',
  'actualTofRatio',
  'actualTofCount',
  'effectiveNmbBlockade',
  'dominantNmbSource',
  'tolerance',
  'equilibrating',
]);
assert.equal(nmbSnapshot.source, 'administrative');
assert.equal(nmbSnapshot.targetTofRatio, 0.7);
assert.equal(typeof nmbSnapshot.equilibrating, 'boolean');
administrativeNmb.targetTofRatio = 0;
nmbSnapshot.targetTofRatio = 0;
assert.equal(runner.snapshot().instructorNmbTarget.targetTofRatio, 0.7);

console.log('SNAPSHOT CONTRACT: PASS');
console.log(`keys=${requiredKeys.length} numeric=${numericKeys.length} boolean=${booleanKeys.length} string=${stringKeys.length} arrays=${arrayKeys.length}`);
console.log(`tick=${snapshot.t.toFixed(2)}s airway=${snapshot.airwayDevice} status=${snapshot.status}`);
