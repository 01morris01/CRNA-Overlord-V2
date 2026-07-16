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

function composeRubric(rubric, sessionResult, base = baseResult()) {
  return buildRubricDebrief({ baseResult: base, sessionResult, rubricDefinition: rubric });
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
    const result = composeRubric(rubric, finalizedFor(rubric));

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
    const result = composeRubric(rsiRubric, sessionResult);

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
      {
        tSec: 1,
        action: 'drug',
        meta: { drug: 'Propofol', source: 'administrative' },
        snapshot,
      },
      {
        tSec: 2,
        action: 'mask_ppv_started',
        meta: { source: 'instructor' },
        snapshot,
      },
      {
        tSec: 3,
        action: 'intubation_attempt_started',
        meta: { source: 'administrative' },
        snapshot,
      },
      {
        tSec: 3.5,
        action: 'unknown_action',
        meta: { source: 'administrative' },
        snapshot,
      },
      {
        tSec: 4,
        action: 'instructor_nmb_depth_set',
        meta: { source: 'learner', targetTofRatio: 0.7 },
        snapshot,
      },
      {
        tSec: 5,
        action: 'instructor_rubric_score_set',
        meta: {
          itemId: 'emergence-1', points: 2, revision: 1, source: 'learner',
        },
        snapshot: {},
      },
    ];
    const result = buildRubricDebrief({
      baseResult: baseResult(),
      sessionResult: finalizedFor(emergenceRubric, { actions }),
      rubricDefinition: emergenceRubric,
    });

    expect(result.actionTimeline.map(({ action, source }) => [action, source])).toEqual([
      ['drug', 'learner'],
      ['mask_ppv_started', 'learner'],
      ['intubation_attempt_started', 'learner'],
      ['unknown_action', 'learner'],
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
    const result = composeRubric(emergenceRubric, sessionResult, base);
    result.teachingPoints.push('mutated');
    result.rubricResult.items[0].text = 'mutated';
    result.actionTimeline[0].meta.note = 'mutated';

    const again = composeRubric(emergenceRubric, sessionResult, base);
    expect(base.teachingPoints).toEqual([]);
    expect(sessionResult.items[0].text).toBe(emergenceRubric.items[0].text);
    expect(again.rubricResult.items[0].text).toBe(emergenceRubric.items[0].text);

    expect(() => buildRubricDebrief({
      baseResult: base,
      sessionResult: { ok: false, reason: 'INSTRUCTOR_SCORES_PENDING', pendingItemIds: ['x'] },
      rubricDefinition: emergenceRubric,
    })).toThrow(/successful finalized/i);
    expect(() => buildRubricDebrief({
      baseResult: {}, sessionResult, rubricDefinition: emergenceRubric,
    }))
      .toThrow(/baseResult/i);
    expect(() => buildRubricDebrief({
      baseResult: base,
      sessionResult: { ...sessionResult, finalized: false },
      rubricDefinition: emergenceRubric,
    })).toThrow(/successful finalized/i);
    expect(() => buildRubricDebrief({
      baseResult: base,
      sessionResult: { ...sessionResult, percentage: Number.NaN },
      rubricDefinition: emergenceRubric,
    })).toThrow(/finite|JSON-safe/i);

    const accessor = { ...sessionResult };
    Object.defineProperty(accessor, 'outcome', { enumerable: true, get: () => 'PASS' });
    expect(() => buildRubricDebrief({
      baseResult: base, sessionResult: accessor, rubricDefinition: emergenceRubric,
    }))
      .toThrow(/data propert|JSON-safe/i);
    const cycle = { ...sessionResult };
    cycle.loop = cycle;
    expect(() => buildRubricDebrief({
      baseResult: base, sessionResult: cycle, rubricDefinition: emergenceRubric,
    }))
      .toThrow(/cycle/i);
    const unsafe = { ...sessionResult };
    Object.defineProperty(unsafe, '__proto__', { enumerable: true, value: {} });
    expect(() => buildRubricDebrief({
      baseResult: base, sessionResult: unsafe, rubricDefinition: emergenceRubric,
    }))
      .toThrow(/unsafe|dangerous/i);
  });

  test.each([
    ['provisional result', (result) => { result.provisional = true; }],
    ['missing provisional marker', (result) => { delete result.provisional; }],
    ['incomplete result', (result) => { result.incomplete = true; }],
    ['pending instructor count', (result) => { result.pendingInstructorCount = 1; }],
    ['pending engine count', (result) => { result.pendingEngineCount = 1; }],
    ['pending unscoreable count', (result) => { result.pendingUnscoreableCount = 1; }],
    ['missing pending count', (result) => { delete result.pendingEngineCount; }],
    ['null finalization time', (result) => { result.finalizedAtSec = null; }],
    ['negative finalization time', (result) => { result.finalizedAtSec = -1; }],
    ['unscoreable item', (result) => {
      result.items[0].scoringSource = 'UNSCOREABLE';
      result.items[0].evidence = null;
    }],
    ['pending item', (result) => {
      result.items[0].points = null;
      result.items[0].status = 'pending';
    }],
    ['raw point mismatch', (result) => { result.rawPoints += 1; }],
    ['maximum mismatch', (result) => { result.maxPoints += 2; }],
    ['percentage mismatch', (result) => { result.percentage += 1; }],
    ['critical omission mismatch', (result) => { result.criticalItemsOmitted = []; }],
    ['zero-percent PASS', (result) => {
      for (const item of result.items) {
        item.points = 0;
        item.status = 'not_performed';
      }
      result.rawPoints = 0;
      result.percentage = 0;
      result.criticalItemsOmitted = result.items
        .filter(({ critical }) => critical)
        .map(({ id }) => id);
      result.outcome = 'PASS';
    }],
    ['all-performed NOT PASS', (result) => {
      for (const item of result.items) {
        item.points = 2;
        item.status = 'performed';
      }
      result.rawPoints = result.maxPoints;
      result.percentage = 100;
      result.criticalItemsOmitted = [];
      result.outcome = 'NOT PASS';
    }],
  ])('rejects a forged authoritative session: %s', (_label, mutate) => {
    const sessionResult = finalizedFor(emergenceRubric);
    mutate(sessionResult);
    expect(() => composeRubric(emergenceRubric, sessionResult))
      .toThrow(/final|sessionResult|pending|outcome|item|point|percent|critical|unscoreable/i);
  });

  test.each([
    ['rubric id', (result) => { result.rubricId = 'forged-rubric'; }],
    ['literal text', (result) => { result.items[0].text = 'Forged literal text'; }],
    ['item order', (result) => { [result.items[0], result.items[1]] = [result.items[1], result.items[0]]; }],
    ['display number', (result) => { result.items[0].displayNumber = 'X'; }],
    ['critical metadata', (result) => { result.items[0].critical = !result.items[0].critical; }],
    ['scoring source', (result) => {
      result.items[0].scoringSource = 'ENGINE_OBSERVABLE';
      result.items[0].evidence = { ruleId: 'emergence_stop_anesthetic', actions: [], trace: [] };
    }],
    ['engine rule', (result) => {
      const engine = result.items.find(({ scoringSource }) => scoringSource === 'ENGINE_OBSERVABLE');
      engine.evidence.ruleId = 'emergence_spontaneous_ventilation';
    }],
    ['extra denominator warning', (result) => {
      result.denominatorWarnings.push({ code: 'FORGED_WARNING' });
    }],
  ])('rejects forged rubric provenance: %s', (_label, mutate) => {
    const sessionResult = finalizedFor(emergenceRubric);
    mutate(sessionResult);
    expect(() => composeRubric(emergenceRubric, sessionResult))
      .toThrow(/rubric|item|literal|order|source|rule|warning|critical/i);
  });

  test('requires an explicit normalized rubric consistency contract', () => {
    expect(() => buildRubricDebrief({
      baseResult: baseResult(),
      sessionResult: finalizedFor(emergenceRubric),
    })).toThrow(/rubric/i);
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
      .observedConsequence.actionSnapshot).toEqual({
        tofRatio: action.snapshot.tofRatio,
        effectiveNmbBlockade: action.snapshot.effectiveNmbBlockade,
        airwayDevice: action.snapshot.airwayDevice,
      });
    expect(debrief.rubricResult.items.find(({ id }) => id === 'emergence-4')
      .observedConsequence.actionSnapshot).toEqual({
        spontaneousRR: action.snapshot.spontaneousRR,
        spontaneousTV: action.snapshot.spontaneousTV,
        spontaneousMV: action.snapshot.spontaneousMV,
        respiratoryMuscleCapability: action.snapshot.respiratoryMuscleCapability,
        airwayDevice: action.snapshot.airwayDevice,
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

  test('uses exact rule-specific numeric action fields and omits unrelated values', () => {
    const { debrief } = unsafeEmergenceRun();
    const actions = structuredClone(debrief.actionTimeline);
    const extubate = actions.find(({ action }) => action === 'extubate');
    extubate.snapshot = {
      tofRatio: 0.71,
      effectiveNmbBlockade: 0.44,
      airwayDevice: 'extubated',
      spontaneousRR: 9,
      spontaneousTV: 180,
      spontaneousMV: 1.62,
      respiratoryMuscleCapability: 0.56,
      unrelatedNull: null,
      unrelatedString: 'measured',
      unrelatedBoolean: true,
    };
    const trace = structuredClone(debrief.physiologicTrace);
    const tofItem = structuredClone(
      debrief.rubricResult.items.find(({ id }) => id === 'emergence-3'),
    );
    const ventilationItem = structuredClone(
      debrief.rubricResult.items.find(({ id }) => id === 'emergence-4'),
    );

    expect(observedConsequence({ itemResult: tofItem, actions, trace }).actionSnapshot)
      .toEqual({
        tofRatio: 0.71,
        effectiveNmbBlockade: 0.44,
        airwayDevice: 'extubated',
      });
    expect(observedConsequence({ itemResult: ventilationItem, actions, trace }).actionSnapshot)
      .toEqual({
        spontaneousRR: 9,
        spontaneousTV: 180,
        spontaneousMV: 1.62,
        respiratoryMuscleCapability: 0.56,
        airwayDevice: 'extubated',
      });

    extubate.snapshot.tofRatio = '0.71';
    extubate.snapshot.effectiveNmbBlockade = null;
    extubate.snapshot.airwayDevice = '';
    extubate.snapshot.spontaneousRR = null;
    extubate.snapshot.spontaneousTV = '180';
    extubate.snapshot.spontaneousMV = false;
    extubate.snapshot.respiratoryMuscleCapability = '0.56';
    const noNumericTof = observedConsequence({ itemResult: tofItem, actions, trace });
    const noNumericVentilation = observedConsequence({
      itemResult: ventilationItem,
      actions,
      trace,
    });
    expect(noNumericTof.actionSnapshot).toEqual({});
    expect(noNumericVentilation.actionSnapshot).toEqual({});
    expect(noNumericTof.statement).not.toMatch(/TOF ratio|block|airway/i);
    expect(noNumericVentilation.statement).not.toMatch(/spontaneous|tidal|ventilation/i);
  });

  test('uses inclusive window endpoints, earliest equal nadirs, and no invented empty samples', () => {
    const { debrief } = unsafeEmergenceRun();
    const item = structuredClone(
      debrief.rubricResult.items.find(({ id }) => id === 'emergence-3'),
    );
    const actions = [{
      tSec: 10,
      action: 'extubate',
      meta: {},
      snapshot: { tofRatio: 0.7 },
    }];
    const atEnd = observedConsequence({
      itemResult: item,
      actions,
      trace: [{ t: 9, spo2: 1 }, { t: 10, spo2: 95 }, { t: 100, spo2: 89 }, { t: 101, spo2: 1 }],
    });
    expect(atEnd.extrema.spo2Nadir).toEqual({ value: 89, tSec: 100, elapsedSec: 90 });

    const tied = observedConsequence({
      itemResult: item,
      actions,
      trace: [{ t: 10, spo2: 95 }, { t: 60, spo2: 89 }, { t: 100, spo2: 89 }],
    });
    expect(tied.extrema.spo2Nadir).toEqual({ value: 89, tSec: 60, elapsedSec: 50 });

    const empty = observedConsequence({
      itemResult: item,
      actions,
      trace: [{ t: 10, tofRatio: 0.7 }],
    });
    expect(empty.extrema).toEqual({});
    expect(empty.statement).not.toMatch(/SpO/i);
  });

  test('rejects an overflowing finite observation window before producing output', () => {
    const { debrief } = unsafeEmergenceRun();
    const item = structuredClone(
      debrief.rubricResult.items.find(({ id }) => id === 'emergence-3'),
    );
    const actions = [{
      tSec: Number.MAX_VALUE,
      action: 'extubate',
      meta: {},
      snapshot: { tofRatio: 0.7 },
    }];

    expect(() => observedConsequence({
      itemResult: item,
      actions,
      trace: [],
      windowSec: Number.MAX_VALUE,
    })).toThrow(/window|overflow|finite/i);
  });

  test('keeps instructor failures human-scored and consequence-free', () => {
    const sessionResult = finalizedFor(emergenceRubric, { points: 0 });
    const result = composeRubric(emergenceRubric, sessionResult);
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
    const result = composeRubric(emergenceRubric, sessionResult);
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
    const returnedFinal = runner.finalizeRubric();
    expect(returnedFinal).toMatchObject({
      ok: true,
      finalized: true,
      denominatorWarnings: [],
    });
    const actionCount = runner.rubricSession.getLiveResult().actionLedger.length;
    returnedFinal.items[0].text = 'forged returned text';
    returnedFinal.denominatorWarnings.push({ code: 'FORGED_WARNING' });
    runner._finalizedRubricResult = {
      ...returnedFinal,
      denominatorWarnings: [{ code: 'FORGED_CACHE_WARNING' }],
    };
    const repeatedFinal = runner.finalizeRubric();
    expect(repeatedFinal.items[0].text).toBe(emergenceRubric.items[0].text);
    expect(repeatedFinal.denominatorWarnings).toEqual([]);
    expect(runner.rubricSession.getLiveResult().actionLedger).toHaveLength(actionCount);
    const first = runner.buildDebrief();
    const fingerprint = JSON.stringify(first);
    first.rubricResult.items[0].text = 'mutated';
    first.actionTimeline[0].meta.note = 'mutated';
    const second = runner.buildDebrief();

    expect(JSON.stringify(second)).toBe(fingerprint);
    expect(second.rubricResult.items[0].text).toBe(emergenceRubric.items[0].text);
    expect(second.rubricResult.denominatorWarnings).toEqual([]);
    expect(validateSimulationResult(second)).toEqual({ ok: true, missing: [], invalid: [] });
  });

  test('adopts direct frozen session finalization and drops finalized authority on reset', () => {
    const runner = new SimRunner();
    runner.loadRubricScenario({ scenario: emergenceScenario, rubric: emergenceRubric });
    scoreInstructorRows(runner);
    const finalized = runner.rubricSession.finalize({ tSec: 0 });
    expect(finalized).toMatchObject({ ok: true, finalized: true });
    expect(runner.buildDebrief().rubricResult.rubricId).toBe(emergenceRubric.id);

    runner.reset();
    expect(runner.rubricSession.getLiveResult().finalized).toBe(false);
    expect(() => runner.buildDebrief()).toThrow(/not finalized|pending/i);
  });

  test('leaves the generic live SimulationResult shape unchanged', () => {
    const runner = new SimRunner();
    const result = runner.buildDebrief();

    expect(result).not.toHaveProperty('rubricResult');
    expect(result).not.toHaveProperty('actionTimeline');
    expect(validateSimulationResult(result)).toEqual({ ok: true, missing: [], invalid: [] });
  });
});
