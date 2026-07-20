import { describe, expect, test } from 'vitest';
import standardScenario from '../sim/scenarios/standard_iv_healthy_001.json';
import { SimRunner } from '../ui/simRunner.js';
import { normalizeCaseExperience } from '../sim/scenario/caseContract.js';
import { CaseSession } from '../sim/scenario/caseSession.js';
import { buildCaseDebrief, CASE_TIMELINE_SOURCES } from '../sim/scenario/caseDebrief.js';
import { buildDebrief } from '../sim/scenario/scenarioDebrief.js';
import { makeCaseExperience } from './helpers/caseFixtures.js';

function makeBaseResult(overrides = {}) {
  return {
    scenarioId: 'case_contract_fixture_001',
    title: 'Preanesthesia contract fixture',
    courseUnit: 'Test course',
    durationSec: 12,
    rawPoints: 0,
    maxPoints: 0,
    score: 0,
    timeToRecognitionSec: -1,
    timeToTreatmentSec: -1,
    teachingFeedback: 'Teaching fixture summary.',
    teachingPoints: [],
    reviewTopics: [],
    reviewTags: [],
    criticalActionsCompleted: [],
    criticalActionsMissed: [],
    dangerousActions: [],
    ...overrides,
  };
}

function definitionWithSecondConsideration() {
  const experience = makeCaseExperience();
  experience.instructorGuide.considerations.push({
    id: 'consider_airway',
    phaseId: 'assessment',
    eventId: 'assessment_ready',
    title: 'Airway exam',
    consideration: 'Trainee should document a Mallampati class.',
    expectedResponse: 'Perform and record an airway exam.',
    responseWindowSec: 0,
    redFlags: ['Induction without an airway exam'],
    scoringGuidance: 'Observe the exam sequence.',
    defaultRevealInDebrief: false,
  });
  return normalizeCaseExperience(experience);
}

function driveToFinalized(session, {
  disposition = 'proceed',
  reveal = [],
  unreveal = [],
  considerationIds = ['consider_npo'],
} = {}) {
  expect(session.advanceStage({ stage: 'interview', tSec: 0.02 }).ok).toBe(true);
  expect(session.recordAssessmentAction({ actionId: 'ask_npo', tSec: 0.04 }).ok).toBe(true);
  expect(session.advanceStage({ stage: 'focused_exam', tSec: 0.06 }).ok).toBe(true);
  expect(session.advanceStage({ stage: 'findings_summary', tSec: 0.08 }).ok).toBe(true);
  expect(session.submitFindings({ findingIds: ['npo_ok'], tSec: 0.1 }).ok).toBe(true);
  expect(session.advanceStage({ stage: 'plan_submission', tSec: 0.12 }).ok).toBe(true);
  expect(session.submitPlan({ selections: { disposition }, tSec: 0.14 }).ok).toBe(true);
  if (disposition === 'proceed') {
    expect(session.advanceStage({ stage: 'debrief_draft', tSec: 0.16 }).ok).toBe(true);
  }
  let clock = 0.18;
  for (const considerationId of considerationIds) {
    expect(session.setInstructorObservation({
      considerationId,
      status: 'observed',
      note: `observed ${considerationId}`,
      tSec: clock,
    }).ok).toBe(true);
    clock += 0.02;
  }
  for (const [considerationIds_, flag] of [[reveal, true], [unreveal, false]]) {
    for (const considerationId of considerationIds_) {
      expect(session.setFeedbackReveal({
        considerationId,
        reveal: flag,
        tSec: clock,
      }).ok).toBe(true);
      clock += 0.02;
    }
  }
  const finalized = session.finalize({ tSec: clock });
  expect(finalized.ok).toBe(true);
  return finalized;
}

function makeFinalizedCase(options = {}) {
  const definition = options.definition ?? normalizeCaseExperience(makeCaseExperience());
  const session = new CaseSession({ definition, seed: 12345 });
  const caseSessionResult = driveToFinalized(session, options);
  return { definition, session, caseSessionResult };
}

function build(overrides = {}) {
  const { definition, caseSessionResult } = makeFinalizedCase(overrides.fixture);
  return buildCaseDebrief({
    baseResult: makeBaseResult(),
    caseSessionResult,
    caseDefinition: definition,
    ...overrides.args,
  });
}

describe('buildCaseDebrief composition', () => {
  test('returns the base result plus a single additive caseResult key', () => {
    const baseResult = makeBaseResult();
    const { definition, caseSessionResult } = makeFinalizedCase();
    const result = buildCaseDebrief({ baseResult, caseSessionResult, caseDefinition: definition });

    for (const [key, value] of Object.entries(baseResult)) {
      expect(result[key]).toEqual(value);
    }
    const added = Object.keys(result).filter((key) => !Object.hasOwn(baseResult, key));
    expect(added).toEqual(['caseResult']);
  });

  test('reports the case identity, outcome, and finalization time', () => {
    const result = build();
    expect(result.caseResult).toMatchObject({
      caseId: 'case_contract_fixture_001',
      outcome: 'completed',
    });
    expect(Number.isFinite(result.caseResult.finalizedAtSec)).toBe(true);
    expect(result.caseResult.finalizedAtSec).toBeGreaterThan(0);
  });

  test('marks an appropriately deferred case with its own outcome', () => {
    const result = build({ fixture: { disposition: 'postpone' } });
    expect(result.caseResult.outcome).toBe('appropriately_deferred');
  });

  test('separates discovered from missed assessment findings', () => {
    const result = build();
    const { assessment } = result.caseResult;

    expect(assessment.actions.map(({ id }) => id)).toEqual(['ask_npo']);
    expect(assessment.discoveredFindings.map(({ id }) => id)).toEqual(['npo_ok']);
    expect(assessment.missedFindings).toEqual([]);
    expect(assessment.findingsSubmission.findingIds).toEqual(['npo_ok']);
  });

  test('lists undiscovered findings as missed', () => {
    const experience = makeCaseExperience();
    experience.assessment.findings.push({
      id: 'airway_history',
      learnerLabel: 'Prior difficult airway',
      significance: 'Advanced airway planning is required',
      initiallyVisible: false,
      instructorOnlyUntilDiscovered: true,
    });
    const definition = normalizeCaseExperience(experience);
    const result = build({ fixture: { definition } });

    expect(result.caseResult.assessment.discoveredFindings.map(({ id }) => id)).toEqual(['npo_ok']);
    expect(result.caseResult.assessment.missedFindings.map(({ id }) => id)).toEqual(['airway_history']);
  });

  test('carries the submitted plan selections, rationale, and rule results', () => {
    const result = build();
    const { plan } = result.caseResult;

    expect(plan.selections).toMatchObject({ disposition: 'proceed' });
    expect(typeof plan.rationale).toBe('string');
    expect(Array.isArray(plan.ruleResults)).toBe(true);
    expect(plan.ruleResults.every((rule) => typeof rule.id === 'string')).toBe(true);
    expect(plan.ruleResults.every((rule) => rule.status !== 'pending')).toBe(true);
  });

  test('labels every timeline entry with a supported source', () => {
    // unreveal produces a feedback_reveal record so every source is exercised.
    const result = build({ fixture: { unreveal: ['consider_npo'] } });
    const { eventTimeline } = result.caseResult;

    expect(eventTimeline.length).toBeGreaterThan(0);
    expect(CASE_TIMELINE_SOURCES).toEqual(['learner', 'instructor', 'scenario', 'administrative']);
    expect(Object.isFrozen(CASE_TIMELINE_SOURCES)).toBe(true);
    for (const entry of eventTimeline) {
      expect(CASE_TIMELINE_SOURCES).toContain(entry.source);
    }
    const byKind = new Map(eventTimeline.map((entry) => [entry.kind, entry.source]));
    expect(byKind.get('assessment_action')).toBe('learner');
    expect(byKind.get('plan_submission')).toBe('learner');
    expect(byKind.get('instructor_observation')).toBe('instructor');
    expect(byKind.get('feedback_reveal')).toBe('instructor');
    expect(byKind.get('case_finalized')).toBe('administrative');
  });

  test('records instructor observations with status and note', () => {
    const result = build();
    expect(result.caseResult.instructorObservations).toHaveLength(1);
    expect(result.caseResult.instructorObservations[0]).toMatchObject({
      considerationId: 'consider_npo',
      status: 'observed',
      note: 'observed consider_npo',
    });
  });

  test('releases author defaults plus considerations the instructor reveals', () => {
    const definition = definitionWithSecondConsideration();
    // consider_npo defaults to revealed; consider_airway does not.
    const result = build({
      fixture: {
        definition,
        considerationIds: ['consider_npo', 'consider_airway'],
        reveal: ['consider_airway'],
      },
    });

    expect(result.caseResult.releasedFeedback.map(({ considerationId }) => considerationId))
      .toEqual(['consider_npo', 'consider_airway']);
    expect(result.caseResult.instructorObservations).toHaveLength(2);
  });

  test('honors an instructor withdrawing a default reveal', () => {
    const definition = definitionWithSecondConsideration();
    const result = build({
      fixture: {
        definition,
        considerationIds: ['consider_npo', 'consider_airway'],
        reveal: ['consider_airway'],
        unreveal: ['consider_npo'],
      },
    });

    expect(result.caseResult.releasedFeedback.map(({ considerationId }) => considerationId))
      .toEqual(['consider_airway']);
  });

  test('never leaks unreleased instructor guidance into releasedFeedback', () => {
    const definition = definitionWithSecondConsideration();
    const result = build({
      fixture: {
        definition,
        considerationIds: ['consider_npo', 'consider_airway'],
        unreveal: ['consider_npo'],
      },
    });

    expect(result.caseResult.releasedFeedback).toEqual([]);
    const serialized = JSON.stringify(result.caseResult.releasedFeedback);
    expect(serialized).not.toContain('Perform and record an airway exam.');
  });

  test('never exposes instructor-only scoring guidance or red flags, even once released', () => {
    const definition = definitionWithSecondConsideration();
    const result = build({
      fixture: {
        definition,
        considerationIds: ['consider_npo', 'consider_airway'],
        reveal: ['consider_airway'],
      },
    });

    const serialized = JSON.stringify(result.caseResult.releasedFeedback);
    expect(serialized).not.toContain('Observe the exam sequence.');
    expect(serialized).not.toContain('Observe sequence.');
    expect(serialized).not.toContain('Induction without an airway exam');
    expect(serialized).not.toContain('Plan submitted without NPO assessment');
    for (const entry of result.caseResult.releasedFeedback) {
      expect(Object.hasOwn(entry, 'scoringGuidance')).toBe(false);
      expect(Object.hasOwn(entry, 'redFlags')).toBe(false);
    }
  });

  test('exposes revision history after a reopened debrief', () => {
    const { definition, session } = makeFinalizedCase();
    expect(session.beginRevision({ tSec: 1 }).ok).toBe(true);
    const refinalized = session.finalize({ tSec: 1.2 });
    expect(refinalized.ok).toBe(true);

    const result = buildCaseDebrief({
      baseResult: makeBaseResult(),
      caseSessionResult: refinalized,
      caseDefinition: definition,
    });
    expect(result.caseResult.revisions).toHaveLength(1);
    expect(result.caseResult.revisions[0]).toMatchObject({ revision: 1 });
  });

  test('produces a deeply frozen, JSON-safe case result', () => {
    const result = build();
    expect(() => JSON.parse(JSON.stringify(result.caseResult))).not.toThrow();
    expect(Object.isFrozen(result.caseResult)).toBe(true);
    expect(Object.isFrozen(result.caseResult.eventTimeline)).toBe(true);
  });

  test('is deterministic across identical runs', () => {
    expect(build().caseResult).toEqual(build().caseResult);
  });
});

describe('buildCaseDebrief rejection rules', () => {
  test('rejects an unfinalized case session result', () => {
    const definition = normalizeCaseExperience(makeCaseExperience());
    const session = new CaseSession({ definition, seed: 12345 });
    expect(() => buildCaseDebrief({
      baseResult: makeBaseResult(),
      caseSessionResult: session.getLiveResult(),
      caseDefinition: definition,
    })).toThrow(/finalized/i);
  });

  test('rejects an invalid outcome', () => {
    const { definition, caseSessionResult } = makeFinalizedCase();
    const tampered = { ...caseSessionResult, outcome: 'passed' };
    expect(() => buildCaseDebrief({
      baseResult: makeBaseResult(),
      caseSessionResult: tampered,
      caseDefinition: definition,
    })).toThrow(/outcome/i);
  });

  test('rejects a nonchronological timeline', () => {
    const { definition, caseSessionResult } = makeFinalizedCase();
    const timeline = caseSessionResult.timeline.map((entry) => ({ ...entry }));
    expect(timeline.length).toBeGreaterThan(1);
    timeline[timeline.length - 1] = { ...timeline.at(-1), tSec: -1 };
    expect(() => buildCaseDebrief({
      baseResult: makeBaseResult(),
      caseSessionResult: { ...caseSessionResult, timeline },
      caseDefinition: definition,
    })).toThrow(/chronological|tSec/i);
  });

  test('rejects an unknown released consideration id', () => {
    const { definition, caseSessionResult } = makeFinalizedCase();
    expect(() => buildCaseDebrief({
      baseResult: makeBaseResult(),
      caseSessionResult: { ...caseSessionResult, feedbackRevealIds: ['not_a_consideration'] },
      caseDefinition: definition,
    })).toThrow(/unknown|consideration/i);
  });

  test('derives caseId from the owning scenario id', () => {
    const { definition, caseSessionResult } = makeFinalizedCase();
    const result = buildCaseDebrief({
      baseResult: makeBaseResult({ scenarioId: 'cn_preassessment_lap_chole_001' }),
      caseSessionResult,
      caseDefinition: definition,
    });
    expect(result.caseResult.caseId).toBe('cn_preassessment_lap_chole_001');
  });

  test('rejects a base result without a usable scenario id', () => {
    const { definition, caseSessionResult } = makeFinalizedCase();
    expect(() => buildCaseDebrief({
      baseResult: makeBaseResult({ scenarioId: '' }),
      caseSessionResult,
      caseDefinition: definition,
    })).toThrow(/scenarioId/i);
  });

  test('rejects non-JSON-safe and unsafe values', () => {
    const { definition, caseSessionResult } = makeFinalizedCase();
    for (const timeline of [
      [{ ...caseSessionResult.timeline[0], note: () => 'nope' }],
      [{ ...caseSessionResult.timeline[0], depth: Number.NaN }],
      [{ ...caseSessionResult.timeline[0], nested: { __proto__: { polluted: true } } }],
    ]) {
      expect(() => buildCaseDebrief({
        baseResult: makeBaseResult(),
        caseSessionResult: { ...caseSessionResult, timeline },
        caseDefinition: definition,
      })).toThrow();
    }
  });

  test('rejects a base result that already carries the reserved caseResult key', () => {
    const { definition, caseSessionResult } = makeFinalizedCase();
    expect(() => buildCaseDebrief({
      baseResult: makeBaseResult({ caseResult: {} }),
      caseSessionResult,
      caseDefinition: definition,
    })).toThrow(/caseResult/);
  });

  test('rejects a missing case definition', () => {
    const { caseSessionResult } = makeFinalizedCase();
    expect(() => buildCaseDebrief({
      baseResult: makeBaseResult(),
      caseSessionResult,
      caseDefinition: null,
    })).toThrow();
  });
});

describe('SimRunner case debrief finalization', () => {
  function makeRunnerCase() {
    const scenario = structuredClone(standardScenario);
    scenario.id = 'runner_case_debrief_001';
    scenario.title = 'Runner debrief case';
    scenario.caseExperience = makeCaseExperience();
    return scenario;
  }

  function loadRunner() {
    const runner = new SimRunner();
    runner.loadCaseScenario({ scenario: makeRunnerCase(), rubric: null });
    return runner;
  }

  function advanceRunnerToDebrief(runner) {
    expect(runner.advanceCaseStage({ stage: 'interview' })).toMatchObject({ ok: true });
    expect(runner.performAssessmentAction({ actionId: 'ask_npo' })).toMatchObject({ ok: true });
    expect(runner.advanceCaseStage({ stage: 'focused_exam' })).toMatchObject({ ok: true });
    expect(runner.advanceCaseStage({ stage: 'findings_summary' })).toMatchObject({ ok: true });
    expect(runner.submitCaseFindings({ findingIds: ['npo_ok'] })).toMatchObject({ ok: true });
    expect(runner.advanceCaseStage({ stage: 'plan_submission' })).toMatchObject({ ok: true });
    expect(runner.submitCasePlan({ selections: { disposition: 'proceed' } }))
      .toMatchObject({ ok: true });
    expect(runner.advanceCaseStage({ stage: 'debrief_draft' })).toMatchObject({ ok: true });
  }

  test('refuses to build a debrief while a case is unfinalized', () => {
    const runner = loadRunner();
    advanceRunnerToDebrief(runner);

    let thrown = null;
    try {
      runner.buildDebrief();
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(Error);
    expect(thrown.code).toBe('CASE_DEBRIEF_NOT_FINALIZED');
    expect(thrown.pendingConsiderationIds).toEqual(['consider_npo']);
  });

  test('refuses finalization while required instructor observations are pending', () => {
    const runner = loadRunner();
    advanceRunnerToDebrief(runner);

    expect(runner.finalizeCaseDebrief()).toMatchObject({
      ok: false,
      reason: 'PENDING_INSTRUCTOR_OBSERVATIONS',
      pendingConsiderationIds: ['consider_npo'],
    });
  });

  test('composes caseResult into the debrief once finalized', () => {
    const runner = loadRunner();
    advanceRunnerToDebrief(runner);
    expect(runner.setInstructorCaseObservation({
      considerationId: 'consider_npo',
      status: 'observed',
      note: 'Asked intake timing',
    })).toMatchObject({ ok: true });
    expect(runner.finalizeCaseDebrief()).toMatchObject({ ok: true });

    const debrief = runner.buildDebrief();
    expect(debrief.caseResult).toMatchObject({
      caseId: 'runner_case_debrief_001',
      outcome: 'completed',
    });
    expect(debrief.caseResult.assessment.actions.map(({ id }) => id)).toEqual(['ask_npo']);
    expect(debrief.caseResult.eventTimeline.length).toBeGreaterThan(0);
    expect(() => JSON.parse(JSON.stringify(debrief))).not.toThrow();
  });

  test('reopening a finalized case debrief blocks building again until refinalized', () => {
    const runner = loadRunner();
    advanceRunnerToDebrief(runner);
    expect(runner.setInstructorCaseObservation({
      considerationId: 'consider_npo',
      status: 'observed',
    })).toMatchObject({ ok: true });
    expect(runner.finalizeCaseDebrief()).toMatchObject({ ok: true });
    expect(runner.beginCaseDebriefRevision()).toMatchObject({ ok: true, revision: 1 });

    expect(() => runner.buildDebrief()).toThrow(/not finalized/i);
    expect(runner.finalizeCaseDebrief()).toMatchObject({ ok: true });
    expect(runner.buildDebrief().caseResult.revisions).toHaveLength(1);
  });

  test('leaves a rubric-only runner debrief free of caseResult', () => {
    const runner = new SimRunner();
    expect(Object.hasOwn(runner.buildDebrief(), 'caseResult')).toBe(false);
  });
});

describe('scenarioDebrief additive composition', () => {
  const def = {
    id: 'case_contract_fixture_001',
    title: 'Preanesthesia contract fixture',
    courseUnit: 'Test course',
    expectedActions: [],
    dangerousActions: [],
    debrief: {
      summary: 'Teaching fixture summary.',
      teachingPoints: [],
      reviewTopics: [],
      reviewTags: [],
    },
    tags: [],
  };
  const run = {
    timeToRecognition: -1,
    timeToTreatment: -1,
    expectedDone: new Set(),
    expectedLate: new Map(),
    dangerousFired: [],
  };

  test('leaves the legacy no-case result shape unchanged', () => {
    const legacy = buildDebrief(def, run, null, [], 0, 0, 12);
    expect(Object.hasOwn(legacy, 'caseResult')).toBe(false);
    expect(Object.hasOwn(legacy, 'rubricResult')).toBe(false);
    expect(legacy.scenarioId).toBe('case_contract_fixture_001');
  });

  test('appends caseResult when a finalized case session is supplied', () => {
    const { definition, caseSessionResult } = makeFinalizedCase();
    const composed = buildDebrief(
      def, run, null, [], 0, 0, 12, null, null, caseSessionResult, definition,
    );
    expect(composed.caseResult).toMatchObject({ caseId: 'case_contract_fixture_001' });
    expect(Object.hasOwn(composed, 'rubricResult')).toBe(false);
  });
});
