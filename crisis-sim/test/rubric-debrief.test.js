import { describe, expect, test } from 'vitest';
import emergenceRubric from '../../data/rubrics/carson-newman-anesthesia-emergence.json';
import rsiRubric from '../../data/rubrics/carson-newman-rsi-induction.json';
import standardRubric from '../../data/rubrics/carson-newman-standard-iv-induction.json';
import emergenceScenario from '../sim/scenarios/emergence_residual_block_001.json';
import {
  buildRubricDebrief,
  observedConsequence,
} from '../sim/scenario/rubricDebrief.js';
import { RubricScoringSession } from '../sim/scenario/rubricScoringSession.js';
import { SimRunner } from '../ui/simRunner.js';
import { validateSimulationResult } from '../../ui/liveSimModel.js';

const RUBRICS = [emergenceRubric, standardRubric, rsiRubric];

function baseResult() {
  return {
    scenarioId: 'rubric-test',
    title: 'Rubric test',
    courseUnit: 'Test',
    durationSec: 90,
    rawPoints: 0,
    maxPoints: 0,
    score: 0,
    timeToRecognitionSec: -1,
    timeToTreatmentSec: -1,
    teachingFeedback: '',
    teachingPoints: [],
    reviewTopics: [],
    reviewTags: [],
    criticalActionsCompleted: [],
    criticalActionsMissed: [],
    dangerousActions: [],
    respiratoryAttribution: {},
  };
}

function finalizedFor(rubric, { points = 2, actions = [] } = {}) {
  const session = new RubricScoringSession({ rubric, criteria: { weightKg: 70 } });
  for (const action of actions) session.recordAction(action);
  const tSec = actions.at(-1)?.tSec ?? 0;
  for (const item of session.rubric.items) {
    if (item.scoringSource === 'INSTRUCTOR_OBSERVED') {
      session.setInstructorScore({ itemId: item.id, points, note: `note ${item.id}`, tSec });
    }
  }
  const result = session.finalize({ tSec });
  if (!result.ok) throw new Error(`Fixture did not finalize: ${result.reason}`);
  return {
    ...structuredClone(result),
    denominatorWarnings: structuredClone(session.rubric.discrepancies),
  };
}

function scoreInstructorRows(runner, points = 2) {
  const tSec = runner.rubricSession.getLiveResult().trace.at(-1)?.t ?? 0;
  for (const item of runner.rubricSession.rubric.items) {
    if (item.scoringSource === 'INSTRUCTOR_OBSERVED') {
      runner.rubricSession.setInstructorScore({ itemId: item.id, points, tSec });
    }
  }
}

function unsafeEmergenceRun() {
  const runner = new SimRunner();
  runner.loadRubricScenario({ scenario: emergenceScenario, rubric: emergenceRubric });
  runner.extubate();
  runner.stepFor(90);
  scoreInstructorRows(runner);
  const finalized = runner.finalizeRubric();
  if (!finalized.ok) throw new Error(`Fixture did not finalize: ${finalized.reason}`);
  return { runner, debrief: runner.buildDebrief() };
}

describe('pure rubric debrief composition', () => {
  test.each(RUBRICS)('preserves $id literal rows and source metadata', (rubric) => {
    const result = buildRubricDebrief({
      baseResult: baseResult(),
      sessionResult: finalizedFor(rubric),
    });

    expect(result.rubricResult).toMatchObject({
      rubricId: rubric.id,
      itemCount: rubric.items.length,
      maxPoints: rubric.computedMaxPoints,
      percentage: expect.any(Number),
      criticalItemsOmitted: expect.any(Array),
      outcome: expect.stringMatching(/^(PASS|NOT PASS)$/),
      denominatorWarnings: rubric.discrepancies,
      failureReasons: expect.any(Array),
    });
    expect(result.rubricResult.items.map((item) => ({
      id: item.id,
      displayNumber: item.displayNumber,
      text: item.text,
      critical: item.critical,
      scoringSource: item.scoringSource,
    }))).toEqual(rubric.items.map((item) => ({
      id: item.id,
      displayNumber: item.displayNumber,
      text: item.text,
      critical: item.critical,
      scoringSource: item.scoringSource,
    })));
    expect(result.rubricResult.items.every((item) => (
      ['Engine observed', 'Instructor observed', 'Unscoreable'].includes(item.source)
    ))).toBe(true);
  });

  test('retains the RSI 49-versus-106 warning and separates failure reasons', () => {
    const sessionResult = finalizedFor(rsiRubric, { points: 0 });
    const result = buildRubricDebrief({ baseResult: baseResult(), sessionResult });

    expect(result.rubricResult.denominatorWarnings).toEqual([{
      code: 'SOURCE_DENOMINATOR_MISMATCH',
      sourceHeaderDenominator: 49,
      computedMaxPoints: 106,
    }]);
    expect(result.rubricResult.failureReasons.map(({ code }) => code)).toEqual([
      'PERCENT_BELOW_MINIMUM',
      'CRITICAL_ITEMS_OMITTED',
    ]);
  });

  test('classifies every ledger record without losing chronology or snapshots', () => {
    const snapshot = { t: 3, spo2: 98, tofRatio: 0.7 };
    const actions = [
      { tSec: 1, action: 'drug', meta: { drug: 'Propofol' }, snapshot },
      { tSec: 2, action: 'mask_ppv_started', meta: {}, snapshot },
      { tSec: 3, action: 'intubation_attempt_started', meta: {}, snapshot },
      {
        tSec: 4,
        action: 'instructor_nmb_depth_set',
        meta: { source: 'administrative', targetTofRatio: 0.7 },
        snapshot,
      },
      {
        tSec: 5,
        action: 'instructor_rubric_score_set',
        meta: { itemId: 'emergence-1', points: 2, revision: 1 },
        snapshot: {},
      },
    ];
    const result = buildRubricDebrief({
      baseResult: baseResult(),
      sessionResult: finalizedFor(emergenceRubric, { actions }),
    });

    expect(result.actionTimeline.map(({ action, source }) => [action, source])).toEqual([
      ['drug', 'learner'],
      ['mask_ppv_started', 'learner'],
      ['intubation_attempt_started', 'learner'],
      ['instructor_nmb_depth_set', 'administrative'],
      ['instructor_rubric_score_set', 'instructor'],
      ...emergenceRubric.items
        .filter(({ scoringSource }) => scoringSource === 'INSTRUCTOR_OBSERVED')
        .map(() => ['instructor_rubric_score_set', 'instructor']),
    ]);
    expect(result.actionTimeline[0]).toMatchObject(actions[0]);
    expect(result.administrativeActions.map(({ source }) => source)).toEqual([
      'administrative',
      'instructor',
      ...Array(6).fill('instructor'),
    ]);
  });

  test('copies all data defensively and rejects unsafe inputs atomically', () => {
    const base = baseResult();
    const sessionResult = finalizedFor(emergenceRubric);
    const result = buildRubricDebrief({ baseResult: base, sessionResult });
    result.teachingPoints.push('mutated');
    result.rubricResult.items[0].text = 'mutated';
    result.actionTimeline[0].meta.note = 'mutated';

    const again = buildRubricDebrief({ baseResult: base, sessionResult });
    expect(base.teachingPoints).toEqual([]);
    expect(sessionResult.items[0].text).toBe(emergenceRubric.items[0].text);
    expect(again.rubricResult.items[0].text).toBe(emergenceRubric.items[0].text);

    expect(() => buildRubricDebrief({
      baseResult: base,
      sessionResult: { ok: false, reason: 'INSTRUCTOR_SCORES_PENDING', pendingItemIds: ['x'] },
    })).toThrow(/successful finalized/i);
    expect(() => buildRubricDebrief({ baseResult: {}, sessionResult }))
      .toThrow(/baseResult/i);
    expect(() => buildRubricDebrief({
      baseResult: base,
      sessionResult: { ...sessionResult, finalized: false },
    })).toThrow(/successful finalized/i);
    expect(() => buildRubricDebrief({
      baseResult: base,
      sessionResult: { ...sessionResult, percentage: Number.NaN },
    })).toThrow(/finite|JSON-safe/i);

    const accessor = { ...sessionResult };
    Object.defineProperty(accessor, 'outcome', { enumerable: true, get: () => 'PASS' });
    expect(() => buildRubricDebrief({ baseResult: base, sessionResult: accessor }))
      .toThrow(/data propert|JSON-safe/i);
    const cycle = { ...sessionResult };
    cycle.loop = cycle;
    expect(() => buildRubricDebrief({ baseResult: base, sessionResult: cycle }))
      .toThrow(/cycle/i);
    const unsafe = { ...sessionResult };
    Object.defineProperty(unsafe, '__proto__', { enumerable: true, value: {} });
    expect(() => buildRubricDebrief({ baseResult: base, sessionResult: unsafe }))
      .toThrow(/unsafe|dangerous/i);
  });
});

describe('observed consequences', () => {
  test('rejects malformed item results instead of silently treating them as consequence-free', () => {
    expect(() => observedConsequence({ itemResult: {}, actions: [], trace: [] }))
      .toThrow(/itemResult/i);
  });

  test('uses the actual extubation snapshot and independently measured 90-second nadir', () => {
    const { runner, debrief } = unsafeEmergenceRun();
    const action = debrief.actionTimeline.find(({ action: name }) => name === 'extubate');
    const windowTrace = debrief.physiologicTrace.filter(({ t, spo2 }) => (
      t >= action.tSec && t <= action.tSec + 90 && Number.isFinite(spo2)
    ));
    const expectedNadir = windowTrace.reduce((best, sample) => (
      sample.spo2 < best.spo2 ? sample : best
    ));

    for (const id of ['emergence-3', 'emergence-4']) {
      const item = debrief.rubricResult.items.find((candidate) => candidate.id === id);
      expect(item.points).toBeLessThan(2);
      expect(item.observedConsequence).toMatchObject({
        trigger: { action: 'extubate', tSec: action.tSec },
        observationWindow: { startSec: action.tSec, endSec: action.tSec + 90 },
        extrema: {
          spo2Nadir: {
            value: expectedNadir.spo2,
            tSec: expectedNadir.t,
            elapsedSec: expectedNadir.t - action.tSec,
          },
        },
      });
      expect(item.observedConsequence.statement).not.toMatch(/caus|resulted|because|led to/i);
    }
    expect(debrief.rubricResult.items.find(({ id }) => id === 'emergence-3')
      .observedConsequence.actionSnapshot.tofRatio).toBe(action.snapshot.tofRatio);
    expect(debrief.rubricResult.items.find(({ id }) => id === 'emergence-4')
      .observedConsequence.actionSnapshot).toMatchObject({
        spontaneousRR: action.snapshot.spontaneousRR,
        spontaneousTV: action.snapshot.spontaneousTV,
        spontaneousMV: action.snapshot.spontaneousMV,
      });
    expect(runner.rubricSession.getLiveResult().finalized).toBe(true);
  });

  test('does not invent absent action or trace measurements', () => {
    const { debrief } = unsafeEmergenceRun();
    const item = structuredClone(
      debrief.rubricResult.items.find(({ id }) => id === 'emergence-4'),
    );
    delete item.observedConsequence;
    const actions = structuredClone(debrief.actionTimeline);
    const extubate = actions.find(({ action }) => action === 'extubate');
    delete extubate.snapshot.spontaneousTV;
    const trace = structuredClone(debrief.physiologicTrace);
    for (const sample of trace) delete sample.spo2;

    const consequence = observedConsequence({ itemResult: item, actions, trace });
    expect(consequence.actionSnapshot).not.toHaveProperty('spontaneousTV');
    expect(consequence.extrema).not.toHaveProperty('spo2Nadir');
    expect(consequence.statement).not.toMatch(/tidal volume|\bTV\b|SpO2|SpO₂/i);
  });

  test('keeps instructor failures human-scored and consequence-free', () => {
    const sessionResult = finalizedFor(emergenceRubric, { points: 0 });
    const result = buildRubricDebrief({ baseResult: baseResult(), sessionResult });
    const instructor = result.rubricResult.items.find(
      ({ scoringSource }) => scoringSource === 'INSTRUCTOR_OBSERVED',
    );

    expect(instructor).toMatchObject({ source: 'Instructor observed', points: 0 });
    expect(instructor.observedConsequence).toBeNull();
  });

  test('preserves violation literal labels and structured evidence exactly', () => {
    const sessionResult = finalizedFor(emergenceRubric);
    sessionResult.violations = [{
      rubricId: emergenceRubric.id,
      itemId: 'emergence-3',
      displayNumber: '3',
      text: emergenceRubric.items[2].text,
      tSec: 12,
      evidence: { measured: { tofRatio: 0.55 } },
    }];
    const result = buildRubricDebrief({ baseResult: baseResult(), sessionResult });
    expect(result.violationFlags).toEqual(sessionResult.violations);
    expect(result.violationFlags).not.toBe(sessionResult.violations);
  });
});

describe('SimRunner rubric debrief lifecycle', () => {
  test('blocks pending rubric debriefs, then finalizes and builds deterministically', () => {
    const runner = new SimRunner();
    runner.loadRubricScenario({ scenario: emergenceScenario, rubric: emergenceRubric });

    const pending = runner.finalizeRubric();
    expect(pending).toMatchObject({
      ok: false,
      reason: 'INSTRUCTOR_SCORES_PENDING',
      pendingItemIds: expect.any(Array),
    });
    expect(() => runner.buildDebrief()).toThrow(/not finalized|pending/i);

    scoreInstructorRows(runner);
    expect(runner.finalizeRubric()).toMatchObject({
      ok: true,
      finalized: true,
      denominatorWarnings: [],
    });
    const first = runner.buildDebrief();
    const fingerprint = JSON.stringify(first);
    first.rubricResult.items[0].text = 'mutated';
    first.actionTimeline[0].meta.note = 'mutated';
    const second = runner.buildDebrief();

    expect(JSON.stringify(second)).toBe(fingerprint);
    expect(validateSimulationResult(second)).toEqual({ ok: true, missing: [], invalid: [] });
  });

  test('leaves the generic live SimulationResult shape unchanged', () => {
    const runner = new SimRunner();
    const result = runner.buildDebrief();

    expect(result).not.toHaveProperty('rubricResult');
    expect(result).not.toHaveProperty('actionTimeline');
    expect(validateSimulationResult(result)).toEqual({ ok: true, missing: [], invalid: [] });
  });
});
