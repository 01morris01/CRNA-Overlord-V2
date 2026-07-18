import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { normalizeRubric } from '../sim/scenario/rubricLoader.js';
import { RubricScoringSession } from '../sim/scenario/rubricScoringSession.js';
import { SimRunner, VentMode } from '../ui/simRunner.js';
import { validateSimulationResult } from '../../ui/liveSimModel.js';

const loadJson = (relativeUrl) => JSON.parse(readFileSync(new URL(relativeUrl, import.meta.url), 'utf8'));

const RUBRICS = [
  loadJson('../../data/rubrics/carson-newman-standard-iv-induction.json'),
  loadJson('../../data/rubrics/carson-newman-rsi-induction.json'),
  loadJson('../../data/rubrics/carson-newman-anesthesia-emergence.json'),
].map(normalizeRubric);

const standardRubric = RUBRICS.find(({ id }) => id === 'carson-newman-standard-iv-induction');
const rsiRubric = RUBRICS.find(({ id }) => id === 'carson-newman-rsi-induction');
const emergenceRubric = RUBRICS.find(({ id }) => id === 'carson-newman-anesthesia-emergence');

const standardScenario = loadJson('../sim/scenarios/standard_iv_healthy_001.json');
const rsiScenario = loadJson('../sim/scenarios/rsi_full_stomach_001.json');
const failedRsiScenario = loadJson('../sim/scenarios/rsi_failed_first_attempt_001.json');
const emergenceScenario = loadJson('../sim/scenarios/emergence_residual_block_001.json');

const RULE_IDS = Object.freeze([
  'emergence_stop_anesthetic',
  'emergence_tof_and_reversal',
  'emergence_spontaneous_ventilation',
  'standard_mask_ventilation_before_nmb',
  'rsi_preoxygenation',
  'rsi_cricoid_applied',
  'rsi_medication_selection',
  'rsi_medication_sequence',
  'rsi_no_ppv_before_first_laryngoscopy',
  'rsi_continuous_etco2_confirmation',
  'rsi_failed_attempt_ppv_with_cricoid',
  'rsi_cricoid_release_after_confirmation',
  'rsi_inhaled_anesthetic_on',
  'rsi_vent_mode',
  'rsi_tidal_volume',
  'rsi_respiratory_rate',
  'rsi_fresh_gas',
  'rsi_fio2',
  'rsi_bag_to_vent',
  'rsi_appropriate_failed_attempt_intervention',
  'rsi_under_three_attempts',
]);

function printSection(name, value) {
  console.log(`=== ${name} ===`);
  console.log(JSON.stringify(value));
}

function assertFiniteJson(value, path = '$', ancestors = new WeakSet()) {
  if (typeof value === 'number') {
    assert.ok(Number.isFinite(value), `${path} must be finite`);
    return;
  }
  if (value === null || ['string', 'boolean'].includes(typeof value)) return;
  assert.equal(typeof value, 'object', `${path} must be JSON-compatible`);
  assert.equal(ancestors.has(value), false, `${path} must not contain cycles`);
  ancestors.add(value);
  if (Array.isArray(value)) {
    value.forEach((nested, index) => assertFiniteJson(nested, `${path}[${index}]`, ancestors));
  } else {
    for (const [key, nested] of Object.entries(value)) {
      assertFiniteJson(nested, `${path}.${key}`, ancestors);
    }
  }
  ancestors.delete(value);
}

function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  return `{${Object.keys(value).sort().map((key) => (
    `${JSON.stringify(key)}:${stableStringify(value[key])}`
  )).join(',')}}`;
}

function act(runner, callback, label = 'runner action') {
  const result = callback();
  runner.pause();
  if (result && typeof result === 'object' && result.ok === false) {
    throw new Error(`${label} failed: ${result.reason}`);
  }
  return result;
}

function advanceUntil(runner, predicate, maxSeconds, label) {
  for (let elapsed = 0; elapsed < maxSeconds; elapsed += 1) {
    const snapshot = runner.stepFor(1);
    if (predicate(snapshot)) return snapshot;
  }
  throw new Error(`${label} not reached within ${maxSeconds} seconds`);
}

function scoreInstructorRows(runner, points = 2) {
  for (const item of runner.rubricSession.rubric.items) {
    if (item.scoringSource === 'INSTRUCTOR_OBSERVED') {
      runner.setInstructorScore({
        itemId: item.id,
        points,
        note: `Evidence driver score for ${item.displayNumber}`,
      });
    }
  }
}

function finalizeRunner(runner, points = 2) {
  scoreInstructorRows(runner, points);
  const finalized = runner.finalizeRubric();
  assert.equal(finalized.ok, true, finalized.reason);
  assert.equal(finalized.pendingInstructorCount, 0);
  assert.equal(finalized.pendingEngineCount, 0);
  assert.equal(finalized.pendingUnscoreableCount, 0);
  return finalized;
}

function loadRunner(scenario, rubric) {
  const runner = new SimRunner();
  const loaded = runner.loadRubricScenario({ scenario, rubric });
  assert.deepEqual(
    { scenarioId: loaded.scenarioId, rubricId: loaded.rubricId, seed: loaded.seed },
    { scenarioId: scenario.id, rubricId: rubric.id, seed: scenario.seed },
  );
  return runner;
}

function preoxygenate(runner, seconds = 180) {
  act(runner, () => runner.preoxygenate(), 'preoxygenation');
  return runner.stepFor(seconds);
}

function giveInduction(runner, { weightKg = runner.config.weightKg } = {}) {
  act(runner, () => runner.giveBolus(
    'Propofol', 2 * weightKg, `Propofol 2 mg/kg · ${2 * weightKg} mg total`,
  ), 'propofol');
  act(runner, () => runner.giveBolus(
    'Rocuronium', 0.6 * weightKg, `Rocuronium 0.6 mg/kg · ${0.6 * weightKg} mg total`,
  ), 'rocuronium');
}

function establishSupportedTube(runner, { fio2 = 1, tv = 550, rr = 12 } = {}) {
  act(runner, () => runner.setVolatile({ agent: 'Sevoflurane', dialPercent: 2 }), 'volatile');
  act(runner, () => runner.setVentMode(VentMode.VCV), 'VCV');
  act(runner, () => runner.setMachine({
    setTidalVolume: tv,
    setRespiratoryRate: rr,
    setPeep: 5,
    setFiO2: fio2,
    o2FlowLPerMin: fio2 === 1 ? 10 : 2,
    airFlowLPerMin: fio2 === 1 ? 0 : 2,
    n2oFlowLPerMin: 0,
  }), 'machine settings');
  runner.stepFor(11);
  act(runner, () => runner.confirmEtco2(), 'EtCO2 confirmation');
}

function successfulRsiWorkflow({ scenario = rsiScenario, releaseCricoid = true } = {}) {
  const runner = loadRunner(scenario, rsiRubric);
  preoxygenate(runner);
  giveInduction(runner);
  act(runner, () => runner.applyCricoidPressure(), 'cricoid application');
  const attempt = act(runner, () => runner.attemptIntubation(), 'intubation attempt');
  runner.stepFor(attempt.plannedDurationSec);
  assert.equal(runner.snapshot().lastIntubationOutcome, 'succeeded');
  establishSupportedTube(runner);
  if (releaseCricoid) act(runner, () => runner.releaseCricoidPressure(), 'cricoid release');
  return runner;
}

function failedRescueWorkflow() {
  const runner = loadRunner(failedRsiScenario, rsiRubric);
  giveInduction(runner);
  const first = act(runner, () => runner.attemptIntubation(), 'failed attempt one');
  runner.stepFor(first.plannedDurationSec);
  const afterFailure = runner.snapshot();
  assert.equal(afterFailure.lastIntubationOutcome, 'failed');
  act(runner, () => runner.applyCricoidPressure(), 'rescue cricoid');
  const ppv = act(runner, () => runner.deliverMaskVentilation({
    durationSeconds: 30,
    tidalVolumeMl: 600,
    respiratoryRate: 14,
    cricoidPressure: true,
  }), 'rescue PPV');
  runner.stepFor(ppv.plannedDurationSec);
  const afterPpv = runner.snapshot();
  const second = act(runner, () => runner.attemptIntubation(), 'attempt two');
  runner.stepFor(second.plannedDurationSec);
  establishSupportedTube(runner);
  act(runner, () => runner.releaseCricoidPressure(), 'rescue cricoid release');
  return { runner, afterFailure, afterPpv };
}

function standardWorkflow() {
  const runner = loadRunner(standardScenario, standardRubric);
  preoxygenate(runner);
  act(runner, () => runner.giveBolus('Propofol', 140, 'Propofol 2 mg/kg · 140 mg total'));
  const ppv = act(runner, () => runner.deliverMaskVentilation({
    durationSeconds: 30, tidalVolumeMl: 500, respiratoryRate: 12,
  }), 'standard PPV');
  act(runner, () => runner.giveBolus('Rocuronium', 42, 'Rocuronium 0.6 mg/kg · 42 mg total'));
  runner.stepFor(ppv.plannedDurationSec);
  const attempt = act(runner, () => runner.attemptIntubation(), 'standard intubation');
  runner.stepFor(attempt.plannedDurationSec);
  act(runner, () => runner.setVentMode(VentMode.VCV));
  act(runner, () => runner.setMachine({
    setTidalVolume: 500, setRespiratoryRate: 12, setPeep: 5,
    setFiO2: 0.5, o2FlowLPerMin: 2, airFlowLPerMin: 2,
  }));
  runner.stepFor(10);
  return runner;
}

function unsafeStandardWorkflow() {
  const runner = loadRunner(standardScenario, standardRubric);
  act(runner, () => runner.giveBolus('Propofol', 140, 'Propofol 140 mg'));
  act(runner, () => runner.giveBolus('Rocuronium', 42, 'Rocuronium 42 mg'));
  return runner;
}

function safeEmergenceWorkflow() {
  const runner = loadRunner(emergenceScenario, emergenceRubric);
  act(runner, () => runner.setVolatile({ agent: 'Sevoflurane', dialPercent: 0 }));
  const lowTof = act(runner, () => runner.checkTrainOfFour());
  assert.ok(lowTof.ratio < 0.9);
  act(runner, () => runner.giveBolus(
    'Sugammadex', 4 * runner.config.weightKg,
    `Sugammadex 4 mg/kg · ${4 * runner.config.weightKg} mg total`,
  ));
  advanceUntil(runner, (snapshot) => snapshot.tofRatio >= 0.9, 900, 'TOF recovery');
  const recoveredTof = act(runner, () => runner.checkTrainOfFour());
  assert.ok(recoveredTof.ratio >= 0.9);
  const breathing = advanceUntil(runner, (snapshot) => (
    snapshot.spontaneousRR >= emergenceScenario.rubricCriteria.spontaneousRrMin
    && snapshot.spontaneousTV
      >= emergenceScenario.rubricCriteria.spontaneousTvMinMlPerKg * runner.config.weightKg
    && snapshot.spontaneousMV >= emergenceScenario.rubricCriteria.spontaneousMvMin
  ), 1200, 'adequate spontaneous ventilation');
  assert.ok(breathing.spontaneousMV >= 4);
  act(runner, () => runner.assessSpontaneousVentilation());
  act(runner, () => runner.extubate(), 'safe extubation');
  runner.stepFor(5);
  return runner;
}

function unsafeEmergenceWorkflow() {
  const runner = loadRunner(emergenceScenario, emergenceRubric);
  act(runner, () => runner.extubate(), 'unsafe extubation');
  runner.stepFor(90);
  return runner;
}

const sourceClassification = RUBRICS.map((rubric) => {
  const counts = {
    ENGINE_OBSERVABLE: 0,
    INSTRUCTOR_OBSERVED: 0,
    UNSCOREABLE: 0,
  };
  for (const item of rubric.items) counts[item.scoringSource] += 1;
  return { rubricId: rubric.id, ...counts };
});
const sourceTotals = sourceClassification.reduce((totals, counts) => ({
  ENGINE_OBSERVABLE: totals.ENGINE_OBSERVABLE + counts.ENGINE_OBSERVABLE,
  INSTRUCTOR_OBSERVED: totals.INSTRUCTOR_OBSERVED + counts.INSTRUCTOR_OBSERVED,
  UNSCOREABLE: totals.UNSCOREABLE + counts.UNSCOREABLE,
}), { ENGINE_OBSERVABLE: 0, INSTRUCTOR_OBSERVED: 0, UNSCOREABLE: 0 });
assert.deepEqual(sourceTotals, {
  ENGINE_OBSERVABLE: 21,
  INSTRUCTOR_OBSERVED: 55,
  UNSCOREABLE: 0,
});

const rsiMismatch = {
  sourceHeaderDenominator: rsiRubric.sourceHeaderDenominator,
  sourceFootnoteScoredItems: rsiRubric.sourceFootnoteScoredItems,
  computedMaxPoints: rsiRubric.computedMaxPoints,
  discrepancy: rsiRubric.discrepancies[0],
};
assert.deepEqual(rsiMismatch, {
  sourceHeaderDenominator: 49,
  sourceFootnoteScoredItems: 53,
  computedMaxPoints: 106,
  discrepancy: {
    code: 'SOURCE_DENOMINATOR_MISMATCH',
    sourceHeaderDenominator: 49,
    computedMaxPoints: 106,
  },
});
printSection('SOURCE_CLASSIFICATION', {
  rubrics: sourceClassification,
  totals: sourceTotals,
  rsiMismatch,
});

function makePassRuleRubric(id, itemCount, criticalIndexes) {
  const pointScale = { performed: 2, partial: 1, notPerformed: 0 };
  const criticalSet = new Set(criticalIndexes);
  const items = Array.from({ length: itemCount }, (_, index) => ({
    id: `${id}-${index + 1}`,
    displayNumber: String(index + 1),
    text: `Pass-rule evidence item ${index + 1}`,
    pointScale,
    critical: criticalSet.has(index),
    scoringSource: 'INSTRUCTOR_OBSERVED',
    engineEvidence: null,
  }));
  return {
    id,
    title: `Pass rule evidence ${id}`,
    course: 'Evidence',
    sourceFile: `${id}.pdf`,
    sourceSha256: '0'.repeat(64),
    sourceHeaderDenominator: itemCount * 2,
    sourceFootnoteScoredItems: itemCount,
    computedItemCount: itemCount,
    computedMaxPoints: itemCount * 2,
    computedCriticalCount: criticalIndexes.length,
    discrepancies: [],
    pointScale,
    passRule: { minimumPercent: 85, requireEveryCriticalPerformed: true },
    items,
  };
}

function passRuleCase({ id, itemCount, criticalIndexes, points }) {
  const session = new RubricScoringSession({
    rubric: makePassRuleRubric(id, itemCount, criticalIndexes), seed: 7001,
  });
  session.rubric.items.forEach((item, index) => session.setInstructorScore({
    itemId: item.id, points: points[index], tSec: 0,
  }));
  const result = session.finalize({ tSec: 0 });
  assert.equal(result.ok, true);
  return {
    id,
    rawPoints: result.rawPoints,
    maxPoints: result.maxPoints,
    percentage: result.percentage,
    criticalItemsOmitted: result.criticalItemsOmitted,
    outcome: result.outcome,
  };
}

const passRuleCases = [
  passRuleCase({
    id: 'critical-partial-at-90', itemCount: 10, criticalIndexes: [0],
    points: [1, 1, ...Array(8).fill(2)],
  }),
  passRuleCase({
    id: 'below-minimum-at-84', itemCount: 25, criticalIndexes: [0, 1, 2, 3, 4],
    points: [...Array(5).fill(2), ...Array(4).fill(0), ...Array(16).fill(2)],
  }),
  passRuleCase({
    id: 'all-critical-performed-above-minimum', itemCount: 10, criticalIndexes: [0, 1],
    points: Array(10).fill(2),
  }),
];
assert.deepEqual(passRuleCases.map(({ percentage, outcome }) => ({ percentage, outcome })), [
  { percentage: 90, outcome: 'NOT PASS' },
  { percentage: 84, outcome: 'NOT PASS' },
  { percentage: 100, outcome: 'PASS' },
]);
assert.deepEqual(passRuleCases[0].criticalItemsOmitted, ['critical-partial-at-90-1']);
assert.deepEqual(passRuleCases[1].criticalItemsOmitted, []);
assert.deepEqual(passRuleCases[2].criticalItemsOmitted, []);
printSection('PASS_RULE_CASES', passRuleCases);

const standardPerformedRunner = standardWorkflow();
const standardPerformed = finalizeRunner(standardPerformedRunner);
const standardOmittedRunner = unsafeStandardWorkflow();
const standardOmitted = finalizeRunner(standardOmittedRunner);
const emergencePerformedRunner = safeEmergenceWorkflow();
const emergencePerformed = finalizeRunner(emergencePerformedRunner);
const emergenceOmittedRunner = unsafeEmergenceWorkflow();
const emergenceOmitted = finalizeRunner(emergenceOmittedRunner);
const rsiPerformedRunner = successfulRsiWorkflow();
const rsiPerformed = finalizeRunner(rsiPerformedRunner);
const rsiOmittedRunner = loadRunner(rsiScenario, rsiRubric);
const rsiOmitted = finalizeRunner(rsiOmittedRunner);
const rsiPpvViolationRunner = loadRunner(rsiScenario, rsiRubric);
act(rsiPpvViolationRunner, () => rsiPpvViolationRunner.deliverMaskVentilation({
  durationSeconds: 5, tidalVolumeMl: 500, respiratoryRate: 12,
}));
rsiPpvViolationRunner.stepFor(5);
giveInduction(rsiPpvViolationRunner);
const violationAttempt = act(rsiPpvViolationRunner, () => rsiPpvViolationRunner.attemptIntubation());
rsiPpvViolationRunner.stepFor(violationAttempt.plannedDurationSec);
const rsiPpvViolation = finalizeRunner(rsiPpvViolationRunner);
const rescuePerformedRun = failedRescueWorkflow();
const rescuePerformed = finalizeRunner(rescuePerformedRun.runner);
const improperFailureRunner = loadRunner(failedRsiScenario, rsiRubric);
improperFailureRunner.configureIntubationAttempts({
  failedIntubationAttempts: [1, 2], attemptDurationSeconds: 30,
});
for (let attemptNumber = 1; attemptNumber <= 3; attemptNumber += 1) {
  const attempt = act(improperFailureRunner, () => improperFailureRunner.attemptIntubation());
  improperFailureRunner.stepFor(attempt.plannedDurationSec);
}
const improperFailure = finalizeRunner(improperFailureRunner);

function engineItem(result, ruleId) {
  const item = result.items.find(({ evidence }) => evidence?.ruleId === ruleId);
  assert.ok(item, `missing engine result for ${ruleId}`);
  return item;
}

const matrixSources = {
  emergence_stop_anesthetic: [emergencePerformed, emergenceOmitted],
  emergence_tof_and_reversal: [emergencePerformed, emergenceOmitted],
  emergence_spontaneous_ventilation: [emergencePerformed, emergenceOmitted],
  standard_mask_ventilation_before_nmb: [standardPerformed, standardOmitted],
};
for (const ruleId of RULE_IDS.filter((id) => id.startsWith('rsi_'))) {
  matrixSources[ruleId] = [rsiPerformed, rsiOmitted];
}
matrixSources.rsi_no_ppv_before_first_laryngoscopy = [rsiPerformed, rsiPpvViolation];
matrixSources.rsi_failed_attempt_ppv_with_cricoid = [rescuePerformed, improperFailure];
matrixSources.rsi_appropriate_failed_attempt_intervention = [rescuePerformed, improperFailure];
matrixSources.rsi_under_three_attempts = [rsiPerformed, improperFailure];

const productionRuleIds = RUBRICS.flatMap(({ items }) => items)
  .filter(({ scoringSource }) => scoringSource === 'ENGINE_OBSERVABLE')
  .map(({ engineEvidence }) => engineEvidence.ruleId);
assert.deepEqual([...new Set(productionRuleIds)].sort(), [...RULE_IDS].sort());
assert.equal(productionRuleIds.length, RULE_IDS.length);

const engineRuleMatrix = RULE_IDS.map((ruleId) => {
  const [performedResult, omittedResult] = matrixSources[ruleId];
  const performedItem = engineItem(performedResult, ruleId);
  const omittedItem = engineItem(omittedResult, ruleId);
  assert.equal(performedItem.points, 2, `${ruleId} performed case`);
  assert.equal(performedItem.status, 'performed', `${ruleId} performed status`);
  assert.equal(omittedItem.points, 0, `${ruleId} omitted case`);
  assert.equal(omittedItem.status, 'not_performed', `${ruleId} omitted status`);
  return {
    ruleId,
    performed_points: performedItem.points,
    omitted_points: omittedItem.points,
    evidence_summary: {
      performed: performedItem.evidence,
      omitted: omittedItem.evidence,
    },
  };
});
assert.deepEqual(engineRuleMatrix.map(({ ruleId }) => ruleId), RULE_IDS);
for (const ruleId of [
  'rsi_failed_attempt_ppv_with_cricoid', 'rsi_appropriate_failed_attempt_intervention',
]) {
  const row = engineRuleMatrix.find((candidate) => candidate.ruleId === ruleId);
  assert.equal(row.evidence_summary.performed.conditionTriggered, true);
  assert.equal(row.evidence_summary.omitted.conditionTriggered, true);
}
printSection('ENGINE_RULE_MATRIX', engineRuleMatrix);

function flagsFor(runner, itemId) {
  return runner.rubricSession.getLiveResult().violations.filter((flag) => flag.itemId === itemId);
}

function assertLiteralFlag(runner, rubric, itemId) {
  const item = rubric.items.find(({ id }) => id === itemId);
  const flags = flagsFor(runner, itemId);
  assert.ok(flags.length > 0, `expected flag for ${itemId}`);
  for (const flag of flags) {
    assert.equal(flag.displayNumber, item.displayNumber);
    assert.equal(flag.text, item.text);
    assert.ok(flag.evidence.actions.length > 0, `${itemId} flag must cite measured action`);
  }
  return flags;
}

const standardPreoxCompliant = standardWorkflow();
const standardPreoxViolation = loadRunner(standardScenario, standardRubric);
act(standardPreoxViolation, () => standardPreoxViolation.giveBolus('Propofol', 140));
const rsiPreoxCompliant = successfulRsiWorkflow();
const rsiPreoxViolation = loadRunner(rsiScenario, rsiRubric);
act(rsiPreoxViolation, () => rsiPreoxViolation.giveBolus('Propofol', 220));

const violationPairs = [
  ['Standard 7', assertLiteralFlag(standardOmittedRunner, standardRubric, 'standard-7'),
    flagsFor(standardPerformedRunner, 'standard-7')],
  ['RSI 11', assertLiteralFlag(rsiPpvViolationRunner, rsiRubric, 'rsi-11'),
    flagsFor(rsiPerformedRunner, 'rsi-11')],
  ['Emergence 3', assertLiteralFlag(emergenceOmittedRunner, emergenceRubric, 'emergence-3'),
    flagsFor(emergencePerformedRunner, 'emergence-3')],
  ['Emergence 4', assertLiteralFlag(emergenceOmittedRunner, emergenceRubric, 'emergence-4'),
    flagsFor(emergencePerformedRunner, 'emergence-4')],
  ['Standard 5', assertLiteralFlag(standardPreoxViolation, standardRubric, 'standard-5'),
    flagsFor(standardPreoxCompliant, 'standard-5')],
  ['RSI 7', assertLiteralFlag(rsiPreoxViolation, rsiRubric, 'rsi-7'),
    flagsFor(rsiPreoxCompliant, 'rsi-7')],
  ['RSI 42', assertLiteralFlag(improperFailureRunner, rsiRubric, 'rsi-42'),
    flagsFor(rsiPerformedRunner, 'rsi-42')],
].map(([pair, violation, compliant]) => {
  assert.equal(compliant.length, 0, `${pair} compliant run false-positive`);
  return { pair, violation, compliant };
});
printSection('VIOLATION_PAIRS', violationPairs);

function validateDebrief(debrief, finalized, rubric, scenario) {
  assert.deepEqual(validateSimulationResult(debrief), { ok: true, missing: [], invalid: [] });
  assert.equal(finalized.pendingInstructorCount, 0);
  assert.equal(finalized.incomplete, false);
  assert.equal(debrief.scenarioId, scenario.id);
  assert.equal(debrief.rubricResult.rubricId, rubric.id);
  assert.equal(debrief.rubricResult.outcome, finalized.outcome);
  assert.equal(debrief.rubricResult.itemCount, rubric.items.length);
  assert.equal(debrief.rubricResult.items.length, rubric.items.length);
  assert.deepEqual(debrief.rubricResult.items.map((item) => ({
    id: item.id,
    displayNumber: item.displayNumber,
    text: item.text,
    scoringSource: item.scoringSource,
  })), rubric.items.map((item) => ({
    id: item.id,
    displayNumber: item.displayNumber,
    text: item.text,
    scoringSource: item.scoringSource,
  })));
  assert.ok(Array.isArray(debrief.actionTimeline));
  assert.ok(Array.isArray(debrief.physiologicTrace) && debrief.physiologicTrace.length > 0);
  assert.ok(Array.isArray(debrief.violationFlags));
  assert.ok(Array.isArray(debrief.administrativeActions));
  assert.ok(debrief.administrativeActions.every(({ source }) => (
    source === 'instructor' || source === 'administrative'
  )));
  assert.deepEqual(debrief.rubricResult.denominatorWarnings, rubric.discrepancies);
  assertFiniteJson(debrief);
}

const caseRuns = [
  { scenario: standardScenario, rubric: standardRubric, runner: standardWorkflow() },
  { scenario: rsiScenario, rubric: rsiRubric, runner: successfulRsiWorkflow() },
  { scenario: emergenceScenario, rubric: emergenceRubric, runner: safeEmergenceWorkflow() },
  { scenario: failedRsiScenario, rubric: rsiRubric, ...failedRescueWorkflow() },
];
const scenarioDebriefs = caseRuns.map((entry) => {
  const finalized = finalizeRunner(entry.runner);
  const debrief = entry.runner.buildDebrief();
  validateDebrief(debrief, finalized, entry.rubric, entry.scenario);
  const summary = {
    scenarioId: entry.scenario.id,
    rubricId: entry.rubric.id,
    rawPoints: debrief.rubricResult.rawPoints,
    maxPoints: debrief.rubricResult.maxPoints,
    percentage: debrief.rubricResult.percentage,
    outcome: debrief.rubricResult.outcome,
    actionCount: debrief.actionTimeline.length,
    traceCount: debrief.physiologicTrace.length,
    flagCount: debrief.violationFlags.length,
  };
  console.log(`=== FOUR_SCENARIO_DEBRIEF:${entry.scenario.id}:SUMMARY ===`);
  console.log(JSON.stringify(summary));
  console.log(`=== FOUR_SCENARIO_DEBRIEF:${entry.scenario.id}:JSON_BEGIN ===`);
  console.log(JSON.stringify(debrief));
  console.log(`=== FOUR_SCENARIO_DEBRIEF:${entry.scenario.id}:JSON_END ===`);
  return { ...entry, finalized, debrief, summary };
});
printSection('FOUR_SCENARIO_DEBRIEFS', scenarioDebriefs.map(({ summary }) => summary));

const failedCase = scenarioDebriefs.find(({ scenario }) => (
  scenario.id === failedRsiScenario.id
));
const procedureActions = failedCase.debrief.actionTimeline
  .map(({ action }) => action)
  .filter((action) => /^(intubation_attempt_|cricoid_pressure_|mask_ppv_)/.test(action));
const requiredRescueChain = [
  'intubation_attempt_started',
  'intubation_attempt_failed',
  'cricoid_pressure_applied',
  'mask_ppv_started',
  'intubation_attempt_started',
  'intubation_attempt_succeeded',
];
let chainCursor = -1;
for (const action of requiredRescueChain) {
  chainCursor = procedureActions.indexOf(action, chainCursor + 1);
  assert.ok(chainCursor >= 0, `failed rescue chain missing ordered ${action}`);
}
const failedAttempt = failedCase.runner.a.intubationAttempts[0];
const secondAttempt = failedCase.runner.a.intubationAttempts[1];
const rescueItem = failedCase.debrief.rubricResult.items.find(({ id }) => id === 'rsi-41');
const rescueSegment = rescueItem.evidence.segments[0];
assert.equal(failedAttempt.outcome, 'failed');
assert.equal(secondAttempt.outcome, 'succeeded');
assert.equal(failedCase.runner.snapshot().intubationAttemptCount, 2);
assert.equal(failedCase.runner.snapshot().airwayDevice, 'intubated');
assert.equal(engineItem(failedCase.finalized, 'rsi_continuous_etco2_confirmation').points, 2);
assert.equal(rescueSegment.oxygenationRecovered, true);
assert.ok(rescueSegment.postRescueSpO2 > rescueSegment.nadirSpO2);
const etco2Samples = failedCase.debrief.physiologicTrace.filter((sample) => (
  sample.airwayDevice === 'intubated'
  && sample.capnogramPresent === true
  && sample.etco2 > 0
  && sample.mechanicalMV > 0
));
assert.ok(etco2Samples.length >= failedRsiScenario.rubricCriteria.etco2ConfirmationSamples);
assert.ok(failedCase.debrief.actionTimeline.some(({ action }) => action === 'confirm_etco2'));
const failedRescueEvidence = {
  orderedProcedureActions: procedureActions,
  requiredRescueChain,
  failedAttempt,
  secondAttempt,
  oxygenation: {
    preRescueSpO2: rescueSegment.preRescueSpO2,
    nadirSpO2: rescueSegment.nadirSpO2,
    postRescueSpO2: rescueSegment.postRescueSpO2,
    recovered: rescueSegment.oxygenationRecovered,
  },
  finalSnapshot: {
    intubationAttemptCount: failedCase.runner.snapshot().intubationAttemptCount,
    airwayDevice: failedCase.runner.snapshot().airwayDevice,
    capnogramPresent: failedCase.runner.snapshot().capnogramPresent,
    etco2: failedCase.runner.snapshot().etco2,
  },
  continuousEtco2Confirmation: {
    requiredSamples: failedRsiScenario.rubricCriteria.etco2ConfirmationSamples,
    measuredSamples: etco2Samples.length,
    firstSample: etco2Samples[0],
    lastSample: etco2Samples.at(-1),
    confirmationLogged: true,
  },
};
printSection('FAILED_FIRST_ATTEMPT_RESCUE', failedRescueEvidence);

const unsafeConsequenceRunner = unsafeEmergenceWorkflow();
const unsafeConsequenceFinal = finalizeRunner(unsafeConsequenceRunner);
const unsafeConsequenceDebrief = unsafeConsequenceRunner.buildDebrief();
validateDebrief(
  unsafeConsequenceDebrief, unsafeConsequenceFinal, emergenceRubric, emergenceScenario,
);
const extubationAction = unsafeConsequenceDebrief.actionTimeline.find(
  ({ action }) => action === 'extubate',
);
assert.ok(extubationAction);
const traceWindow = unsafeConsequenceDebrief.physiologicTrace.filter(({ t }) => (
  t >= extubationAction.tSec && t <= extubationAction.tSec + 90
));
const measuredNadir = traceWindow.reduce((nadir, sample) => (
  sample.spo2 < nadir.spo2 ? sample : nadir
));
const extubationTraceSample = traceWindow.find(({ t }) => t === extubationAction.tSec);
assert.ok(extubationTraceSample);
for (const field of ['tofRatio', 'spontaneousTV', 'spo2']) {
  assert.equal(extubationAction.snapshot[field], extubationTraceSample[field]);
}
const unsafeItems = ['emergence-3', 'emergence-4'].map((itemId) => {
  const rubricItem = emergenceRubric.items.find(({ id }) => id === itemId);
  const item = unsafeConsequenceDebrief.rubricResult.items.find(({ id }) => id === itemId);
  assert.equal(item.text, rubricItem.text);
  assert.equal(item.displayNumber, rubricItem.displayNumber);
  assert.equal(item.scoringSource, 'ENGINE_OBSERVABLE');
  assert.equal(item.observedConsequence.extrema.spo2Nadir.value, measuredNadir.spo2);
  assert.equal(item.observedConsequence.extrema.spo2Nadir.tSec, measuredNadir.t);
  assert.doesNotMatch(item.observedConsequence.statement, /caus|resulted|because|led to/i);
  return {
    itemId,
    displayNumber: item.displayNumber,
    text: item.text,
    source: item.source,
    consequence: item.observedConsequence,
  };
});
const unsafeEmergenceEvidence = {
  extubation: {
    tSec: extubationAction.tSec,
    tofRatio: extubationAction.snapshot.tofRatio,
    spontaneousTV: extubationAction.snapshot.spontaneousTV,
    spo2: extubationAction.snapshot.spo2,
  },
  next90Sec: {
    sampleCount: traceWindow.length,
    spo2Nadir: measuredNadir.spo2,
    nadirAtSec: measuredNadir.t,
    elapsedSec: measuredNadir.t - extubationAction.tSec,
  },
  items: unsafeItems,
};
printSection('UNSAFE_EMERGENCE_CONSEQUENCES', unsafeEmergenceEvidence);

function deterministicComprehensiveRun() {
  const runner = loadRunner(failedRsiScenario, rsiRubric);
  const checkpoints = {};
  checkpoints.preoxygenation = preoxygenate(runner);
  giveInduction(runner);
  runner.stepFor(5);
  checkpoints.postDrug = runner.snapshot();
  const first = act(runner, () => runner.attemptIntubation());
  runner.stepFor(first.plannedDurationSec / 2);
  checkpoints.midFailedIntubationAttempt = runner.snapshot();
  runner.stepFor(first.plannedDurationSec / 2);
  act(runner, () => runner.applyCricoidPressure());
  const ppv = act(runner, () => runner.deliverMaskVentilation({
    durationSeconds: 30, tidalVolumeMl: 600, respiratoryRate: 14, cricoidPressure: true,
  }));
  runner.stepFor(ppv.plannedDurationSec / 2);
  checkpoints.midPpv = runner.snapshot();
  runner.stepFor(ppv.plannedDurationSec / 2);
  const second = act(runner, () => runner.attemptIntubation());
  runner.stepFor(second.plannedDurationSec);
  establishSupportedTube(runner);
  checkpoints.sustainedSupportedEtco2 = runner.snapshot();
  act(runner, () => runner.releaseCricoidPressure());
  act(runner, () => runner.setInstructorNmbTarget({ targetTofRatio: 0.7 }));
  runner.stepFor(10);
  checkpoints.nmbTargetEquilibration = runner.snapshot();
  const finalized = finalizeRunner(runner);
  const debrief = runner.buildDebrief();
  validateDebrief(debrief, finalized, rsiRubric, failedRsiScenario);
  assert.equal(checkpoints.midFailedIntubationAttempt.intubationInProgress, true);
  assert.equal(checkpoints.midPpv.ppvActive, true);
  assert.equal(checkpoints.sustainedSupportedEtco2.capnogramPresent, true);
  assert.ok(checkpoints.sustainedSupportedEtco2.etco2 > 0);
  assert.equal(checkpoints.nmbTargetEquilibration.instructorNmbTarget.targetTofRatio, 0.7);
  const payload = {
    checkpoints,
    debrief,
    intubationAttempts: runner.a.intubationAttempts,
    ppvHistory: runner.a.ppvHistory,
    cricoidPressureHistory: runner.a.cricoidPressureHistory,
  };
  assertFiniteJson(payload);
  const canonicalJson = stableStringify(payload);
  return {
    canonicalJson,
    fingerprint: createHash('sha256').update(canonicalJson).digest('hex'),
    checkpoints: Object.fromEntries(Object.entries(checkpoints).map(([name, snapshot]) => [
      name,
      {
        t: snapshot.t,
        spo2: snapshot.spo2,
        etco2: snapshot.etco2,
        tofRatio: snapshot.tofRatio,
        ppvActive: snapshot.ppvActive,
        intubationInProgress: snapshot.intubationInProgress,
        airwayDevice: snapshot.airwayDevice,
        mechanicalMV: snapshot.mechanicalMV,
        instructorNmbTarget: snapshot.instructorNmbTarget,
      },
    ])),
  };
}

const fingerprintA = deterministicComprehensiveRun();
const fingerprintB = deterministicComprehensiveRun();
assert.equal(fingerprintA.canonicalJson, fingerprintB.canonicalJson);
assert.equal(fingerprintA.fingerprint, fingerprintB.fingerprint);
printSection('DETERMINISM_FINGERPRINTS', {
  fingerprintA: fingerprintA.fingerprint,
  fingerprintB: fingerprintB.fingerprint,
  byteIdentical: fingerprintA.canonicalJson === fingerprintB.canonicalJson,
  canonicalBytes: Buffer.byteLength(fingerprintA.canonicalJson),
  checkpoints: fingerprintA.checkpoints,
});

console.log('RUBRIC_EVIDENCE: PASS');
