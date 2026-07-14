import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPhysRig, VentMode } from '../sim/index.js';
import { SimRunner } from '../ui/simRunner.js';

function advanceUntil(rig, predicate, maxSeconds) {
  for (let elapsed = 0; elapsed < maxSeconds; elapsed += 1) {
    rig.core.stepFor(1);
    if (predicate(rig)) return;
  }
  throw new Error(`Condition not reached within ${maxSeconds} seconds`);
}

function advanceRunner(runner, seconds) {
  runner.core.stepFor(seconds);
  runner.simTime = runner.core.simTime;
  return runner.snapshot();
}

function apneicParalyzedRig(seed) {
  const rig = buildPhysRig(seed, 70, 170, 45);
  rig.v.o2FlowLPerMin = 0;
  rig.v.airFlowLPerMin = 5;
  rig.v.setMode(VentMode.Manual);
  rig.d.administerBolus('Rocuronium', 210);
  advanceUntil(rig, ({ p }) => p.trainOfFourCount === 0, 300);
  rig.p.setForcedApnea(true);
  rig.v.o2FlowLPerMin = 10;
  rig.v.airFlowLPerMin = 0;
  return rig;
}

function printPpvCurve() {
  const supported = apneicParalyzedRig(9201);
  const withheld = apneicParalyzedRig(9201);
  supported.a.deliverMaskVentilation({
    durationSeconds: 120, tidalVolumeMl: 500, respiratoryRate: 12,
  });

  console.log('PPV SUPPORT CURVE');
  console.log('t,supported_spo2,supported_etco2,supported_mv,withheld_spo2,withheld_etco2,withheld_mv');
  for (let t = 0; t <= 120; t += 15) {
    if (t > 0) {
      supported.core.stepFor(15);
      withheld.core.stepFor(15);
    }
    console.log([
      t,
      supported.p.spO2.toFixed(3), supported.p.etCO2.toFixed(3), supported.v.effectiveMinuteVentilation.toFixed(3),
      withheld.p.spO2.toFixed(3), withheld.p.etCO2.toFixed(3), withheld.v.effectiveMinuteVentilation.toFixed(3),
    ].join(','));
  }
  assert.ok(supported.p.spO2 >= 95);
  assert.ok(withheld.p.spO2 < 90);
}

function printPreoxygenationCurves() {
  const roomAir = buildPhysRig(9202, 70, 170, 45);
  roomAir.v.o2FlowLPerMin = 0;
  roomAir.v.airFlowLPerMin = 5;

  const preoxygenated = buildPhysRig(9202, 70, 170, 45);
  preoxygenated.v.o2FlowLPerMin = 10;
  preoxygenated.v.airFlowLPerMin = 0;
  preoxygenated.core.stepFor(180);
  assert.ok(preoxygenated.p.endTidalO2Percent > 90);

  roomAir.p.setForcedApnea(true);
  preoxygenated.p.setForcedApnea(true);
  console.log('PREOXYGENATION APNEA CURVES');
  console.log('t,room_air_spo2,room_air_eto2,preox_spo2,preox_eto2');
  for (let t = 0; t <= 120; t += 15) {
    if (t > 0) {
      roomAir.core.stepFor(15);
      preoxygenated.core.stepFor(15);
    }
    console.log([
      t,
      roomAir.p.spO2.toFixed(3), roomAir.p.endTidalO2Percent.toFixed(3),
      preoxygenated.p.spO2.toFixed(3), preoxygenated.p.endTidalO2Percent.toFixed(3),
    ].join(','));
  }
  assert.ok(roomAir.p.spO2 < 90);
  assert.ok(preoxygenated.p.spO2 >= 95);
}

function desaturationTiming(preoxygenate) {
  const rig = buildPhysRig(9203, 70, 170, 45);
  if (preoxygenate) {
    rig.v.o2FlowLPerMin = 10;
    rig.v.airFlowLPerMin = 0;
    rig.core.stepFor(180);
  } else {
    rig.v.o2FlowLPerMin = 0;
    rig.v.airFlowLPerMin = 5;
  }
  rig.a.configureIntubation({ failedIntubationAttempts: [1], attemptDurationSeconds: 60 });
  rig.a.attemptIntubation();
  rig.core.stepFor(60);
  return rig.a.intubationAttempts[0];
}

function rescueRun() {
  const runner = new SimRunner();
  runner.configureIntubationAttempts({ failedIntubationAttempts: [1], attemptDurationSeconds: 45 });
  runner.setMachine({ o2FlowLPerMin: 0, airFlowLPerMin: 5 });
  runner.attemptIntubation();
  const failed = advanceRunner(runner, 45);
  runner.setMachine({ o2FlowLPerMin: 10, airFlowLPerMin: 0 });
  runner.applyCricoidPressure();
  runner.deliverMaskVentilation({
    durationSeconds: 90, tidalVolumeMl: 500, respiratoryRate: 12, cricoidPressure: true,
  });
  const rescued = advanceRunner(runner, 90);
  runner.attemptIntubation();
  const succeeded = advanceRunner(runner, 45);
  const included = new Set([
    'intubation_attempt_started', 'intubation_attempt_failed',
    'cricoid_pressure_applied', 'mask_ppv_started', 'intubation_attempt_succeeded',
  ]);
  const order = runner.log.map((entry) => entry.meta?.action).filter((action) => included.has(action));
  return { runner, failed, rescued, succeeded, order };
}

function combinedRun() {
  const runner = new SimRunner();
  runner.configureIntubationAttempts({ failedIntubationAttempts: [1], attemptDurationSeconds: 40 });
  runner.preoxygenate();
  advanceRunner(runner, 180);
  runner.deliverMaskVentilation({ durationSeconds: 20, tidalVolumeMl: 500, respiratoryRate: 12 });
  const midPpv = advanceRunner(runner, 10);
  advanceRunner(runner, 10);
  runner.attemptIntubation();
  const midAttempt = advanceRunner(runner, 20);
  const completed = advanceRunner(runner, 20);
  const payload = JSON.stringify({ midPpv, midAttempt, completed, log: runner.log });
  return {
    hash: createHash('sha256').update(payload).digest('hex'),
    midPpv: { t: midPpv.t, active: midPpv.ppvActive, spo2: midPpv.spo2, mv: midPpv.mechanicalMV },
    midAttempt: {
      t: midAttempt.t, active: midAttempt.intubationInProgress,
      spo2: midAttempt.spo2, contribution: midAttempt.proceduralApneaContribution,
    },
  };
}

printPpvCurve();
printPreoxygenationCurves();

const roomTiming = desaturationTiming(false);
const preoxTiming = desaturationTiming(true);
console.log('DESATURATION TIMING');
console.log(JSON.stringify({ roomAir: roomTiming, preoxygenated: preoxTiming }));
assert.equal(roomTiming.desaturatedBelow90, true);
assert.ok(Number.isFinite(roomTiming.timeToSpo2_90Sec));
assert.equal(preoxTiming.desaturatedBelow90, false);
assert.equal(preoxTiming.timeToSpo2_90Sec, null);

const rescue = rescueRun();
console.log('RSI RESCUE ORDER');
console.log(rescue.order.join(' -> '));
console.log(`oxygenation=${rescue.failed.spo2.toFixed(3)}->${rescue.rescued.spo2.toFixed(3)}`);
assert.deepEqual(rescue.order, [
  'intubation_attempt_started',
  'intubation_attempt_failed',
  'cricoid_pressure_applied',
  'mask_ppv_started',
  'intubation_attempt_started',
  'intubation_attempt_succeeded',
]);
assert.ok(rescue.rescued.spo2 > rescue.failed.spo2);
assert.equal(rescue.succeeded.airwayDevice, 'intubated');

const first = combinedRun();
const second = combinedRun();
console.log('DETERMINISM');
console.log(`mid_ppv=${JSON.stringify(first.midPpv)}`);
console.log(`mid_attempt=${JSON.stringify(first.midAttempt)}`);
console.log(`fingerprint_a=${first.hash}`);
console.log(`fingerprint_b=${second.hash}`);
console.log(`equal=${first.hash === second.hash}`);
assert.equal(first.midPpv.active, true);
assert.equal(first.midAttempt.active, true);
assert.equal(first.hash, second.hash);

console.log('AIRWAY GAPS EVIDENCE: PASS');
