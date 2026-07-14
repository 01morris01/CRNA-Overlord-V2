import assert from 'node:assert/strict';
import { SimRunner } from '../ui/simRunner.js';

const numericKeys = [
  't', 'hr', 'sbp', 'dbp', 'map', 'spo2', 'rr', 'etco2', 'temp',
  'bis', 'mac', 'etAgent', 'tof', 'tofRatio', 'ppeak', 'mv', 'tv',
  'fio2', 'ventMode', 'vaporizer', 'ventSetTV', 'ventSetRR', 'ventSetPeep',
  'ventSetPressure', 'ventSetPressureSupport', 'o2Flow', 'airFlow', 'n2oFlow', 'status',
  'forcedApneaContribution', 'drugDepressionContribution',
  'complicationDriveContribution', 'centralDrive', 'effectiveNmbBlockade',
  'respiratoryMuscleCapability', 'spontaneousRR', 'spontaneousTV',
  'spontaneousMV', 'spontaneousEffort', 'sugammadexRocRelief',
  'neostigmineRocRelief', 'speed', 'svr', 'vol', 'airwayRes', 'shunt',
  'hrOffset', 'respDrive', 'heat', 'vco2', 'propofolCe', 'fentanylCe',
  'midazolamCe', 'weightKg',
];

const booleanKeys = [
  'intubated', 'spont', 'forcedApnea', 'capnogramPresent', 'running',
];

const stringKeys = ['agent', 'vaporizerAgent', 'airwayDevice', 'lifecycle', 'patient'];

const requiredKeys = [...numericKeys, ...booleanKeys, ...stringKeys];

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

assert.ok(
  ['mask', 'intubated', 'extubated'].includes(snapshot.airwayDevice),
  `unexpected airwayDevice: ${snapshot.airwayDevice}`,
);
assert.ok(
  ['READY', 'RUNNING', 'PAUSED'].includes(snapshot.lifecycle),
  `unexpected lifecycle: ${snapshot.lifecycle}`,
);

assert.equal(Object.keys(snapshot).length, requiredKeys.length, 'snapshot key count changed');

console.log('SNAPSHOT CONTRACT: PASS');
console.log(`keys=${requiredKeys.length} numeric=${numericKeys.length} boolean=${booleanKeys.length} string=${stringKeys.length}`);
console.log(`tick=${snapshot.t.toFixed(2)}s airway=${snapshot.airwayDevice} status=${snapshot.status}`);
