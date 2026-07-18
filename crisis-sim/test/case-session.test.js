import { describe, expect, test } from 'vitest';
import { normalizeCaseExperience } from '../sim/scenario/caseContract.js';
import {
  CASE_OBSERVATION_STATUS,
  CaseSession,
} from '../sim/scenario/caseSession.js';
import { makeCaseExperience } from './helpers/caseFixtures.js';

function expectDeeplyFrozen(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  expect(Object.isFrozen(value)).toBe(true);
  for (const nested of Object.values(value)) expectDeeplyFrozen(nested, seen);
}

function makeSessionDefinition() {
  const definition = makeCaseExperience();
  definition.assessment.findings.unshift({
    id: 'chart_allergy',
    learnerLabel: 'No known allergies',
    significance: 'Visible chart finding',
    initiallyVisible: true,
    instructorOnlyUntilDiscovered: false,
  });
  definition.assessment.findings.push({
    id: 'airway_history',
    learnerLabel: 'Prior difficult airway',
    significance: 'Advanced airway planning is required',
    initiallyVisible: false,
    instructorOnlyUntilDiscovered: true,
  });
  definition.assessment.actions.push({
    id: 'ask_airway',
    stage: 'interview',
    domain: 'airway',
    prompt: 'Ask about prior airway management',
    response: 'Prior difficult direct laryngoscopy',
    reveals: ['airway_history'],
    prerequisites: ['ask_npo'],
    scoringRuleId: 'discover_airway',
    critical: false,
  });
  definition.assessment.scoringRules.push({
    id: 'discover_airway',
    label: 'Assesses airway history',
    critical: false,
    source: 'ENGINE_OBSERVABLE',
    evidence: { type: 'assessment_action', actionId: 'ask_airway' },
  });
  definition.planRequirements.fields.push({
    id: 'technique',
    type: 'single',
    required: true,
    options: ['general', 'regional'],
  });
  definition.planRequirements.rules.push({
    id: 'plan_general',
    label: 'Selects general anesthesia',
    critical: false,
    source: 'ENGINE_OBSERVABLE',
    evidence: { type: 'plan_equals', fieldId: 'technique', value: 'general' },
  });
  definition.instructorGuide.considerations.push({
    id: 'consider_airway',
    phaseId: 'assessment',
    eventId: 'assessment_ready',
    title: 'Airway plan',
    consideration: 'Trainee should connect history to airway planning.',
    expectedResponse: 'Prepare an advanced airway strategy.',
    responseWindowSec: 0,
    redFlags: ['No backup airway plan'],
    scoringGuidance: 'Observe the stated strategy.',
    defaultRevealInDebrief: false,
  });
  definition.eventFlow.events[0].guidanceIds.push('consider_airway');
  return normalizeCaseExperience(definition);
}

function makeMultiSelectDefinition({
  required = true,
  evidenceValue = ['propofol', 'ketamine'],
} = {}) {
  const definition = makeCaseExperience();
  definition.planRequirements.fields.push({
    id: 'agents',
    type: 'multi',
    required,
    options: ['propofol', 'ketamine', 'etomidate'],
  });
  definition.planRequirements.rules.push({
    id: 'plan_agents',
    label: 'Selects the planned induction agents',
    critical: false,
    source: 'ENGINE_OBSERVABLE',
    evidence: {
      type: 'plan_equals',
      fieldId: 'agents',
      value: evidenceValue,
    },
  });
  return normalizeCaseExperience(definition);
}

function makeSession() {
  return new CaseSession({ definition: makeSessionDefinition(), seed: 12345 });
}

function advanceToFindings(session, { performAssessment = true } = {}) {
  expect(session.advanceStage({ stage: 'interview', tSec: 0.02 }).ok).toBe(true);
  if (performAssessment) {
    expect(session.recordAssessmentAction({ actionId: 'ask_npo', tSec: 0.04 }).ok).toBe(true);
  }
  expect(session.advanceStage({ stage: 'focused_exam', tSec: 0.06 }).ok).toBe(true);
  expect(session.advanceStage({ stage: 'findings_summary', tSec: 0.08 }).ok).toBe(true);
}

function advanceToPlan(session, findingIds = []) {
  advanceToFindings(session);
  expect(session.submitFindings({ findingIds, tSec: 0.1 }).ok).toBe(true);
  expect(session.advanceStage({ stage: 'plan_submission', tSec: 0.12 }).ok).toBe(true);
}

function advanceToDebrief(session, disposition = 'proceed') {
  advanceToPlan(session, ['npo_ok']);
  expect(session.submitPlan({
    selections: { disposition, technique: 'general' },
    tSec: 0.14,
  }).ok).toBe(true);
  if (disposition === 'proceed') {
    expect(session.advanceStage({ stage: 'debrief_draft', tSec: 0.16 }).ok).toBe(true);
  }
}

describe('CaseSession construction', () => {
  test('requires a normalized frozen definition and safe nonnegative integer seed', () => {
    const raw = makeCaseExperience();
    expect(() => new CaseSession({ definition: raw, seed: 1 })).toThrow(/normalized|frozen/i);
    expect(() => new CaseSession({
      definition: normalizeCaseExperience(raw),
      seed: Number.MAX_SAFE_INTEGER,
    })).not.toThrow();

    for (const seed of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY,
      Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => new CaseSession({
        definition: normalizeCaseExperience(raw),
        seed,
      })).toThrow(/seed/i);
    }
  });

  test('starts deterministic empty state with default reveals and pending rules', () => {
    const session = makeSession();
    const result = session.getLiveResult();

    expect(CASE_OBSERVATION_STATUS).toEqual([
      'observed', 'missed', 'not_yet_evaluable',
    ]);
    expect(Object.isFrozen(CASE_OBSERVATION_STATUS)).toBe(true);
    expect(session.currentTimeSec()).toBe(0);
    expect(result).toMatchObject({
      seed: 12345,
      stage: 'chart_review',
      sequence: 0,
      active: true,
      finalized: false,
      outcome: null,
      finalizedAtSec: null,
      completedActionIds: [],
      assessmentRecords: [],
      discoveredFindingIds: [],
      findingsSubmission: null,
      planSubmission: null,
      instructorObservations: [],
      feedbackRevealIds: ['consider_npo'],
      revisions: [],
      timeline: [],
    });
    expect(result.ruleResults).toEqual([
      {
        id: 'discover_npo',
        label: 'Assesses NPO status',
        critical: true,
        source: 'ENGINE_OBSERVABLE',
        status: 'pending',
        points: null,
        evidence: { type: 'assessment_action', actionId: 'ask_npo' },
        updatedAtSec: null,
      },
      {
        id: 'discover_airway',
        label: 'Assesses airway history',
        critical: false,
        source: 'ENGINE_OBSERVABLE',
        status: 'pending',
        points: null,
        evidence: { type: 'assessment_action', actionId: 'ask_airway' },
        updatedAtSec: null,
      },
      {
        id: 'plan_proceed',
        label: 'Selects disposition',
        critical: true,
        source: 'ENGINE_OBSERVABLE',
        status: 'pending',
        points: null,
        evidence: { type: 'plan_equals', fieldId: 'disposition', value: 'proceed' },
        updatedAtSec: null,
      },
      {
        id: 'plan_general',
        label: 'Selects general anesthesia',
        critical: false,
        source: 'ENGINE_OBSERVABLE',
        status: 'pending',
        points: null,
        evidence: { type: 'plan_equals', fieldId: 'technique', value: 'general' },
        updatedAtSec: null,
      },
    ]);
    expectDeeplyFrozen(result);
  });
});

describe('CaseSession chronology and stage lifecycle', () => {
  test('requires fixed-step nondecreasing timestamps and orders equal-time records by sequence', () => {
    const session = makeSession();

    for (const tSec of [-0.02, 0.01, Number.NaN, Number.POSITIVE_INFINITY,
      Number.MAX_SAFE_INTEGER]) {
      expect(() => session.advanceStage({ stage: 'interview', tSec })).toThrow(/tSec|0\.02|tick/i);
    }
    expect(session.getLiveResult().timeline).toEqual([]);

    expect(session.advanceStage({ stage: 'interview', tSec: 1 })).toMatchObject({ ok: true });
    expect(session.recordAssessmentAction({ actionId: 'ask_npo', tSec: 1 })).toMatchObject({
      ok: true,
    });
    expect(session.recordAssessmentAction({ actionId: 'ask_airway', tSec: 1 })).toMatchObject({
      ok: true,
    });
    expect(session.currentTimeSec()).toBe(1);
    expect(session.getLiveResult().timeline.map(({ sequence }) => sequence)).toEqual([1, 2, 3]);

    const before = JSON.stringify(session.getLiveResult());
    expect(() => session.advanceStage({ stage: 'focused_exam', tSec: 0.98 })).toThrow(/nondecreasing/i);
    expect(JSON.stringify(session.getLiveResult())).toBe(before);
  });

  test('enforces the legal stage path and requires findings before plan entry', () => {
    const session = makeSession();
    expect(session.advanceStage({ stage: 'focused_exam', tSec: 0 })).toEqual({
      ok: false, reason: 'INVALID_STAGE_TRANSITION',
    });
    expect(session.advanceStage({ stage: 'interview', tSec: 0 })).toMatchObject({ ok: true });
    expect(session.advanceStage({ stage: 'chart_review', tSec: 0 })).toEqual({
      ok: false, reason: 'INVALID_STAGE_TRANSITION',
    });
    expect(session.advanceStage({ stage: 'focused_exam', tSec: 0 })).toMatchObject({ ok: true });
    expect(session.advanceStage({ stage: 'findings_summary', tSec: 0 })).toMatchObject({ ok: true });
    expect(session.advanceStage({ stage: 'plan_submission', tSec: 0 })).toEqual({
      ok: false, reason: 'FINDINGS_SUBMISSION_REQUIRED',
    });
    expect(session.submitFindings({ findingIds: [], tSec: 0 })).toMatchObject({ ok: true });
    expect(session.advanceStage({ stage: 'plan_submission', tSec: 0 })).toMatchObject({ ok: true });
    expect(session.advanceStage({ stage: 'live_simulation', tSec: 0 })).toEqual({
      ok: false, reason: 'PLAN_SUBMISSION_REQUIRED',
    });

    expect(session.getLiveResult().timeline.filter(
      ({ kind }) => kind === 'stage_transition',
    ).map(({ toStage }) => toStage)).toEqual([
      'interview', 'focused_exam', 'findings_summary', 'plan_submission',
    ]);
  });

  test.each([
    ['proceed', 'live_simulation'],
    ['postpone', 'appropriately_deferred'],
  ])('plan disposition %s automatically enters %s', (disposition, expectedStage) => {
    const session = makeSession();
    advanceToPlan(session, ['npo_ok']);

    expect(session.submitPlan({
      selections: { disposition, technique: 'general' },
      tSec: 0.14,
    })).toMatchObject({ ok: true, stage: expectedStage });
    expect(session.getLiveResult().stage).toBe(expectedStage);
    if (expectedStage === 'live_simulation') {
      expect(session.advanceStage({ stage: 'debrief_draft', tSec: 0.16 })).toMatchObject({
        ok: true,
      });
    }
  });
});

describe('CaseSession learner assessment and submissions', () => {
  test('accepts only eligible current-stage assessment actions without partial mutation', () => {
    const session = makeSession();

    expect(session.recordAssessmentAction({ actionId: 'ask_npo', tSec: 0 })).toEqual({
      ok: false, reason: 'WRONG_STAGE',
    });
    expect(session.advanceStage({ stage: 'interview', tSec: 0 })).toMatchObject({ ok: true });
    expect(session.recordAssessmentAction({ actionId: 'missing', tSec: 0 })).toEqual({
      ok: false, reason: 'UNKNOWN_ACTION',
    });
    expect(session.recordAssessmentAction({ actionId: 'ask_airway', tSec: 0 })).toEqual({
      ok: false, reason: 'PREREQUISITES_UNMET',
    });

    expect(session.recordAssessmentAction({ actionId: 'ask_npo', tSec: 0 })).toEqual({
      ok: true, revealedFindingIds: ['npo_ok'],
    });
    expect(session.recordAssessmentAction({ actionId: 'ask_npo', tSec: 0 })).toEqual({
      ok: false, reason: 'DUPLICATE_ACTION',
    });
    expect(session.recordAssessmentAction({ actionId: 'ask_airway', tSec: 0 })).toEqual({
      ok: true, revealedFindingIds: ['airway_history'],
    });

    const result = session.getLiveResult();
    expect(result.completedActionIds).toEqual(['ask_npo', 'ask_airway']);
    expect(result.discoveredFindingIds).toEqual(['npo_ok', 'airway_history']);
    expect(result.assessmentRecords).toHaveLength(2);
    expect(result.timeline.filter(({ kind }) => kind === 'assessment_action')).toHaveLength(2);
    expect(result.ruleResults.slice(0, 2).map(({ status, points }) => ({ status, points })))
      .toEqual([
        { status: 'performed', points: 2 },
        { status: 'performed', points: 2 },
      ]);
  });

  test('revises copied findings submissions and allows a discovered critical omission', () => {
    const session = makeSession();
    advanceToFindings(session);
    const selected = ['npo_ok'];

    expect(session.submitFindings({
      findingIds: selected,
      notes: 'first summary',
      tSec: 0.1,
    })).toMatchObject({ ok: true });
    selected[0] = 'caller_mutation';
    expect(session.submitFindings({
      findingIds: [],
      notes: 'critical finding omitted',
      tSec: 0.1,
    })).toMatchObject({ ok: true });

    const result = session.getLiveResult();
    expect(result.findingsSubmission).toMatchObject({
      findingIds: [], notes: 'critical finding omitted', revision: 2,
    });
    expect(result.findingsSubmissionHistory).toHaveLength(2);
    expect(result.findingsSubmissionHistory[0]).toMatchObject({
      findingIds: ['npo_ok'], notes: 'first summary', revision: 1,
    });
    expect(result.timeline.filter(({ kind }) => kind === 'findings_submission')).toHaveLength(2);
  });

  test('rejects malformed, unknown, or unavailable findings atomically', () => {
    const session = makeSession();
    advanceToFindings(session, { performAssessment: false });
    const before = JSON.stringify(session.getLiveResult());

    expect(() => session.submitFindings({ findingIds: ['chart_allergy', 'chart_allergy'], tSec: 1 }))
      .toThrow(/duplicate/i);
    expect(session.submitFindings({ findingIds: ['missing'], tSec: 1 })).toEqual({
      ok: false, reason: 'UNKNOWN_FINDING',
    });
    expect(session.submitFindings({ findingIds: ['npo_ok'], tSec: 1 })).toEqual({
      ok: false, reason: 'FINDING_NOT_AVAILABLE',
    });
    expect(() => session.submitFindings({ findingIds: [], notes: null, tSec: 1 }))
      .toThrow(/notes/i);
    expect(JSON.stringify(session.getLiveResult())).toBe(before);
    expect(session.submitFindings({ findingIds: ['chart_allergy'], tSec: 0.1 }))
      .toMatchObject({ ok: true });
  });

  test('validates and copies structured plans, then evaluates rules in definition order', () => {
    const session = makeSession();
    advanceToPlan(session, ['npo_ok']);
    const before = JSON.stringify(session.getLiveResult());

    expect(() => session.submitPlan({ selections: ['proceed'], tSec: 0.14 }))
      .toThrow(/plain object/i);
    expect(() => session.submitPlan({ selections: { disposition: 'proceed' }, tSec: 0.14 }))
      .toThrow(/required.*technique|technique.*required/i);
    expect(() => session.submitPlan({
      selections: { disposition: 'proceed', technique: 'general', extra: true }, tSec: 0.14,
    })).toThrow(/unknown.*extra|extra.*unknown/i);
    expect(() => session.submitPlan({
      selections: { disposition: 'invalid', technique: 'general' }, tSec: 0.14,
    })).toThrow(/option|disposition/i);
    expect(JSON.stringify(session.getLiveResult())).toBe(before);

    const selections = { disposition: 'postpone', technique: 'general' };
    expect(session.submitPlan({ selections, rationale: 'Structured rationale', tSec: 0.14 }))
      .toMatchObject({ ok: true, stage: 'appropriately_deferred' });
    selections.disposition = 'proceed';
    expect(session.getLiveResult().planSubmission.selections).toEqual({
      disposition: 'postpone', technique: 'general',
    });
    expect(session.getLiveResult().ruleResults.slice(2).map(
      ({ id, status, points }) => ({ id, status, points }),
    )).toEqual([
      { id: 'plan_proceed', status: 'not_performed', points: 0 },
      { id: 'plan_general', status: 'performed', points: 2 },
    ]);
    expect(session.submitPlan({ selections: {
      disposition: 'proceed', technique: 'general',
    }, tSec: 0.14 })).toEqual({ ok: false, reason: 'WRONG_STAGE' });
  });

  test('keeps assessment and plan rules independent when their ids overlap', () => {
    const raw = makeCaseExperience();
    raw.planRequirements.rules[0].id = 'discover_npo';
    const session = new CaseSession({
      definition: normalizeCaseExperience(raw),
      seed: 1,
    });

    expect(session.advanceStage({ stage: 'interview', tSec: 0 }).ok).toBe(true);
    expect(session.recordAssessmentAction({ actionId: 'ask_npo', tSec: 0 }).ok).toBe(true);
    expect(session.advanceStage({ stage: 'focused_exam', tSec: 0 }).ok).toBe(true);
    expect(session.advanceStage({ stage: 'findings_summary', tSec: 0 }).ok).toBe(true);
    expect(session.submitFindings({ findingIds: ['npo_ok'], tSec: 0 }).ok).toBe(true);
    expect(session.advanceStage({ stage: 'plan_submission', tSec: 0 }).ok).toBe(true);
    expect(session.submitPlan({ selections: { disposition: 'postpone' }, tSec: 0 }).ok).toBe(true);

    expect(session.getLiveResult().ruleResults.map(({ id, status, points }) => ({
      id, status, points,
    }))).toEqual([
      { id: 'discover_npo', status: 'performed', points: 2 },
      { id: 'discover_npo', status: 'not_performed', points: 0 },
    ]);
  });

  test('accepts, canonicalizes, scores, and isolates multi-select plan values', () => {
    const session = new CaseSession({
      definition: makeMultiSelectDefinition(),
      seed: 1,
    });
    advanceToPlan(session, ['npo_ok']);
    const agents = ['ketamine', 'propofol'];

    expect(session.submitPlan({
      selections: { disposition: 'proceed', agents },
      tSec: 0.14,
    })).toMatchObject({ ok: true, stage: 'live_simulation' });
    agents[0] = 'etomidate';
    agents.push('caller_mutation');

    const result = session.getLiveResult();
    expect(result.planSubmission.selections).toEqual({
      disposition: 'proceed',
      agents: ['propofol', 'ketamine'],
    });
    expect(result.planSubmissionHistory[0].selections.agents).toEqual([
      'propofol', 'ketamine',
    ]);
    expect(result.ruleResults.at(-1)).toMatchObject({
      id: 'plan_agents', status: 'performed', points: 2,
    });
    expect(session.getLearnerContext().planSubmission.selections.agents).toEqual([
      'propofol', 'ketamine',
    ]);
    const instructor = session.getInstructorContext();
    expect(instructor.planSubmissionHistory[0].selections.agents).toEqual([
      'propofol', 'ketamine',
    ]);
    expect(() => { instructor.planSubmission.selections.agents.push('mutated'); })
      .toThrow(TypeError);
    expect(session.getLearnerContext()).not.toHaveProperty('planSubmissionHistory');
  });

  test('scores multi-select plan evidence independently of evidence array order', () => {
    const session = new CaseSession({
      definition: makeMultiSelectDefinition({
        evidenceValue: ['ketamine', 'propofol'],
      }),
      seed: 1,
    });
    advanceToPlan(session, ['npo_ok']);

    expect(session.submitPlan({
      selections: {
        disposition: 'proceed',
        agents: ['propofol', 'ketamine'],
      },
      tSec: 0.14,
    })).toMatchObject({ ok: true, stage: 'live_simulation' });

    const result = session.getLiveResult();
    expect(result.planSubmission.selections.agents).toEqual(['propofol', 'ketamine']);
    expect(result.ruleResults.at(-1)).toMatchObject({
      id: 'plan_agents',
      evidence: {
        type: 'plan_equals',
        fieldId: 'agents',
        value: ['ketamine', 'propofol'],
      },
      status: 'performed',
      points: 2,
    });
  });

  test.each([
    [
      'a scalar for multi',
      { disposition: 'proceed', agents: 'propofol' },
      /agents|multi|array/i,
    ],
    [
      'an array for single',
      { disposition: ['proceed'], agents: ['propofol'] },
      /disposition|single|option/i,
    ],
    [
      'duplicate multi values',
      { disposition: 'proceed', agents: ['propofol', 'propofol'] },
      /duplicate/i,
    ],
    [
      'an unknown multi option',
      { disposition: 'proceed', agents: ['propofol', 'thiopental'] },
      /agents|option/i,
    ],
    [
      'an empty required multi value',
      { disposition: 'proceed', agents: [] },
      /agents|required|empty/i,
    ],
  ])('rejects %s without mutation', (_label, selections, message) => {
    const session = new CaseSession({
      definition: makeMultiSelectDefinition(),
      seed: 1,
    });
    advanceToPlan(session, ['npo_ok']);
    const before = JSON.stringify(session.getLiveResult());

    expect(() => session.submitPlan({ selections, tSec: 0.14 })).toThrow(message);
    expect(JSON.stringify(session.getLiveResult())).toBe(before);
  });

  test('allows an empty ordinary multi array only for an optional field', () => {
    const session = new CaseSession({
      definition: makeMultiSelectDefinition({ required: false }),
      seed: 1,
    });
    advanceToPlan(session, ['npo_ok']);

    expect(session.submitPlan({
      selections: { disposition: 'proceed', agents: [] },
      tSec: 0.14,
    })).toMatchObject({ ok: true });
    expect(session.getLiveResult().planSubmission.selections.agents).toEqual([]);
    expect(session.getLiveResult().ruleResults.at(-1)).toMatchObject({
      status: 'not_performed', points: 0,
    });
  });
});

describe('CaseSession instructor evidence and feedback', () => {
  test('keeps latest keyed observations and chronological revision history', () => {
    const session = makeSession();

    expect(session.setInstructorObservation({
      considerationId: 'missing', status: 'observed', tSec: 0,
    })).toEqual({ ok: false, reason: 'UNKNOWN_CONSIDERATION' });
    expect(() => session.setInstructorObservation({
      considerationId: 'consider_npo', status: 'partial', tSec: 0,
    })).toThrow(/status/i);
    expect(() => session.setInstructorObservation({
      considerationId: 'consider_npo', status: 'observed', note: null, tSec: 0,
    })).toThrow(/note/i);

    expect(session.setInstructorObservation({
      considerationId: 'consider_npo', status: 'not_yet_evaluable', note: 'first', tSec: 0,
    })).toMatchObject({ ok: true });
    expect(session.setInstructorObservation({
      considerationId: 'consider_npo', status: 'missed', note: 'resolved', tSec: 0,
    })).toMatchObject({ ok: true });
    const result = session.getLiveResult();
    expect(result.instructorObservations).toEqual([{
      considerationId: 'consider_npo',
      status: 'missed',
      note: 'resolved',
      tSec: 0,
      sequence: 2,
      revision: 2,
    }]);
    expect(result.instructorObservationHistory.map(({ revision }) => revision)).toEqual([1, 2]);
    expect(result.ruleResults.every(({ points }) => points === null)).toBe(true);
  });

  test('maintains definition-ordered feedback reveals and never exposes guidance to learners', () => {
    const session = makeSession();
    const before = JSON.stringify(session.getLearnerContext());

    expect(session.setFeedbackReveal({
      considerationId: 'consider_airway', reveal: true, tSec: 0,
    })).toMatchObject({ ok: true });
    expect(session.getLiveResult().feedbackRevealIds).toEqual([
      'consider_npo', 'consider_airway',
    ]);
    expect(session.setFeedbackReveal({
      considerationId: 'consider_npo', reveal: false, tSec: 0,
    })).toMatchObject({ ok: true });
    expect(session.getLiveResult().feedbackRevealIds).toEqual(['consider_airway']);
    expect(session.getLiveResult().feedbackRevealHistory).toHaveLength(2);
    expect(JSON.stringify(session.getLearnerContext())).toBe(before);
    expect(JSON.stringify(session.getLearnerContext())).not.toContain('expectedResponse');
    expect(session.setFeedbackReveal({
      considerationId: 'missing', reveal: true, tSec: 0,
    })).toEqual({ ok: false, reason: 'UNKNOWN_CONSIDERATION' });
    expect(() => session.setFeedbackReveal({
      considerationId: 'consider_npo', reveal: 1, tSec: 0,
    })).toThrow(/boolean/i);
  });
});

describe('CaseSession live actions, projections, and Task 3 stubs', () => {
  test('copies canonical actions without physiology mutation and returns no flow activations', () => {
    const session = makeSession();
    const meta = { dose: { amount: 10 } };
    const snapshot = { hr: 80, nested: { source: 'caller' } };

    expect(session.recordCanonicalAction({
      action: 'drug', meta, snapshot, tSec: 0,
    })).toEqual({ ok: true, activations: [] });
    meta.dose.amount = 999;
    snapshot.nested.source = 'mutated';
    expect(session.getLiveResult().timeline[0]).toEqual({
      kind: 'live_action',
      action: 'drug',
      meta: { dose: { amount: 10 } },
      snapshot: { hr: 80, nested: { source: 'caller' } },
      tSec: 0,
      sequence: 1,
      stage: 'chart_review',
    });
    expect(() => session.recordCanonicalAction({ action: '', tSec: 0 })).toThrow(/action/i);
    expect(() => session.recordCanonicalAction({ action: 'x', meta: [], tSec: 0 }))
      .toThrow(/meta/i);
    expect(() => session.recordCanonicalAction({ action: 'x', snapshot: [], tSec: 0 }))
      .toThrow(/snapshot/i);
  });

  test('leaves timeline unchanged for event-flow stubs', () => {
    const session = makeSession();
    expect(session.activateBranch({ branchId: 'anything', tSec: 0 })).toEqual({
      ok: false, reason: 'NO_CASE_FLOW',
    });
    expect(session.advancePhase({ tSec: 0 })).toEqual({
      ok: false, reason: 'NO_CASE_FLOW',
    });
    expect(session.getLiveResult().timeline).toEqual([]);
  });

  test('delegates to frozen defensive projections and returns byte-stable full results', () => {
    const session = makeSession();
    const learner = session.getLearnerContext();
    const instructor = session.getInstructorContext();
    const result = session.getLiveResult();
    const serializedResult = JSON.stringify(result);

    expect(learner).toMatchObject({ stage: 'chart_review', flowState: null });
    expect(instructor).toMatchObject({ stage: 'chart_review', flowState: null });
    expect(instructor.considerations).toHaveLength(2);
    expect(JSON.stringify(learner)).not.toContain('Trainee should');
    expectDeeplyFrozen(learner);
    expectDeeplyFrozen(instructor);
    expectDeeplyFrozen(result);
    expect(() => { learner.stage = 'mutated'; }).toThrow(TypeError);
    expect(() => { instructor.ruleResults[0].points = 2; }).toThrow(TypeError);
    expect(() => { result.timeline.push({}); }).toThrow(TypeError);

    expect(session.getLearnerContext()).not.toBe(learner);
    expect(session.getInstructorContext()).not.toBe(instructor);
    expect(session.getLiveResult()).not.toBe(result);
    expect(JSON.stringify(session.getLiveResult())).toBe(serializedResult);
  });

  test('projects authorized instructor histories and times without leaking them to learners', () => {
    const session = makeSession();
    advanceToFindings(session);
    expect(session.submitFindings({
      findingIds: ['npo_ok'], notes: 'first', tSec: 0.1,
    }).ok).toBe(true);
    expect(session.submitFindings({
      findingIds: [], notes: 'revised', tSec: 0.1,
    }).ok).toBe(true);
    expect(session.advanceStage({ stage: 'plan_submission', tSec: 0.12 }).ok).toBe(true);
    expect(session.submitPlan({
      selections: { disposition: 'proceed', technique: 'general' }, tSec: 0.14,
    }).ok).toBe(true);
    expect(session.setInstructorObservation({
      considerationId: 'consider_npo', status: 'observed', tSec: 0.14,
    }).ok).toBe(true);
    expect(session.setFeedbackReveal({
      considerationId: 'consider_airway', reveal: true, tSec: 0.14,
    }).ok).toBe(true);

    const instructor = session.getInstructorContext();
    expect(instructor).toMatchObject({
      currentTimeSec: 0.14,
      finalizedAtSec: null,
      findingsSubmissionHistory: [
        { findingIds: ['npo_ok'], notes: 'first', revision: 1 },
        { findingIds: [], notes: 'revised', revision: 2 },
      ],
      planSubmissionHistory: [{
        selections: { disposition: 'proceed', technique: 'general' }, revision: 1,
      }],
      instructorObservationHistory: [{
        considerationId: 'consider_npo', status: 'observed', revision: 1,
      }],
      feedbackRevealHistory: [{
        considerationId: 'consider_airway', reveal: true, revision: 1,
      }],
    });
    expect(instructor.timeline.length).toBeGreaterThan(0);
    expectDeeplyFrozen(instructor);
    expect(() => { instructor.findingsSubmissionHistory[0].notes = 'mutated'; })
      .toThrow(TypeError);
    expect(session.getInstructorContext().findingsSubmissionHistory[0].notes).toBe('first');

    const learner = session.getLearnerContext();
    for (const key of [
      'currentTimeSec',
      'finalizedAtSec',
      'findingsSubmissionHistory',
      'planSubmissionHistory',
      'instructorObservationHistory',
      'feedbackRevealHistory',
      'timeline',
    ]) {
      expect(learner).not.toHaveProperty(key);
    }
    expect(JSON.stringify(learner)).not.toContain('first');
    expect(JSON.stringify(learner)).not.toContain('consider_airway');
  });
});

describe('CaseSession finalization and feedback-only revision', () => {
  test('blocks unresolved observations, then finalizes pending engine rules without free-text credit', () => {
    const session = makeSession();
    advanceToFindings(session, { performAssessment: false });
    expect(session.submitFindings({
      findingIds: [], notes: 'I assessed NPO status', tSec: 0.1,
    }).ok).toBe(true);
    expect(session.advanceStage({ stage: 'plan_submission', tSec: 0.12 }).ok).toBe(true);
    expect(session.submitPlan({
      selections: { disposition: 'proceed', technique: 'regional' },
      rationale: 'I would use general anesthesia',
      tSec: 0.14,
    }).ok).toBe(true);
    expect(session.advanceStage({ stage: 'debrief_draft', tSec: 0.16 }).ok).toBe(true);
    expect(session.setInstructorObservation({
      considerationId: 'consider_npo', status: 'not_yet_evaluable', tSec: 0.16,
    }).ok).toBe(true);

    expect(session.finalize({ tSec: 0.18 })).toEqual({
      ok: false,
      reason: 'PENDING_INSTRUCTOR_OBSERVATIONS',
      pendingConsiderationIds: ['consider_npo', 'consider_airway'],
    });
    expect(session.setInstructorObservation({
      considerationId: 'consider_npo', status: 'missed', tSec: 0.18,
    }).ok).toBe(true);
    expect(session.setInstructorObservation({
      considerationId: 'consider_airway', status: 'observed', tSec: 0.18,
    }).ok).toBe(true);
    const finalized = session.finalize({ tSec: 0.2 });

    expect(finalized).toMatchObject({
      ok: true,
      stage: 'debrief_finalized',
      finalized: true,
      active: false,
      outcome: 'completed',
      finalizedAtSec: 0.2,
    });
    expect(finalized.ruleResults.map(({ status, points }) => ({ status, points }))).toEqual([
      { status: 'not_performed', points: 0 },
      { status: 'not_performed', points: 0 },
      { status: 'performed', points: 2 },
      { status: 'not_performed', points: 0 },
    ]);
  });

  test('finalizes an appropriately deferred case and locks every non-revision mutation', () => {
    const session = makeSession();
    advanceToDebrief(session, 'postpone');
    expect(session.setInstructorObservation({
      considerationId: 'consider_npo', status: 'observed', tSec: 0.16,
    }).ok).toBe(true);
    expect(session.setInstructorObservation({
      considerationId: 'consider_airway', status: 'missed', tSec: 0.16,
    }).ok).toBe(true);
    const finalized = session.finalize({ tSec: 0.18 });

    expect(finalized).toMatchObject({
      ok: true,
      outcome: 'appropriately_deferred',
      stage: 'debrief_finalized',
    });
    expect(finalized.timeline.some(({ fromStage, toStage }) => (
      fromStage === 'appropriately_deferred' && toStage === 'debrief_draft'
    ))).toBe(true);
    const before = JSON.stringify(session.getLiveResult());
    const calls = [
      () => session.advanceStage({ stage: 'debrief_draft', tSec: 0.2 }),
      () => session.recordAssessmentAction({ actionId: 'ask_npo', tSec: 0.2 }),
      () => session.submitFindings({ findingIds: [], tSec: 0.2 }),
      () => session.submitPlan({ selections: {}, tSec: 0.2 }),
      () => session.recordCanonicalAction({ action: 'x', tSec: 0.2 }),
      () => session.setInstructorObservation({
        considerationId: 'consider_npo', status: 'missed', tSec: 0.2,
      }),
      () => session.setFeedbackReveal({
        considerationId: 'consider_npo', reveal: false, tSec: 0.2,
      }),
      () => session.activateBranch({ branchId: 'x', tSec: 0.2 }),
      () => session.advancePhase({ tSec: 0.2 }),
      () => session.finalize({ tSec: 0.2 }),
    ];
    for (const call of calls) expect(call()).toEqual({ ok: false, reason: 'FINALIZED' });
    expect(JSON.stringify(session.getLiveResult())).toBe(before);
  });

  test('supports explicit feedback-only revisions and preserves revision history', () => {
    const session = makeSession();
    advanceToDebrief(session);
    for (const considerationId of ['consider_npo', 'consider_airway']) {
      expect(session.setInstructorObservation({
        considerationId, status: 'observed', tSec: 0.16,
      }).ok).toBe(true);
    }
    expect(session.finalize({ tSec: 0.18 }).ok).toBe(true);
    expect(session.beginRevision({ tSec: 0.2 })).toMatchObject({
      ok: true, revision: 1,
    });
    expect(session.getLiveResult()).toMatchObject({
      stage: 'debrief_revision', finalized: false, active: true,
    });

    const locked = [
      () => session.advanceStage({ stage: 'debrief_draft', tSec: 0.2 }),
      () => session.recordAssessmentAction({ actionId: 'ask_npo', tSec: 0.2 }),
      () => session.submitFindings({ findingIds: [], tSec: 0.2 }),
      () => session.submitPlan({ selections: {}, tSec: 0.2 }),
      () => session.recordCanonicalAction({ action: 'x', tSec: 0.2 }),
    ];
    for (const call of locked) {
      expect(call()).toEqual({ ok: false, reason: 'REVISION_FEEDBACK_ONLY' });
    }
    expect(session.setInstructorObservation({
      considerationId: 'consider_npo', status: 'missed', note: 'revised', tSec: 0.22,
    }).ok).toBe(true);
    expect(session.setFeedbackReveal({
      considerationId: 'consider_airway', reveal: true, tSec: 0.22,
    }).ok).toBe(true);
    expect(session.finalize({ tSec: 0.24 })).toMatchObject({
      ok: true, stage: 'debrief_finalized', finalized: true,
    });
    expect(session.getLiveResult().revisions).toEqual([{
      revision: 1, tSec: 0.2, sequence: expect.any(Number),
    }]);
    expect(session.beginRevision({ tSec: 0.26 })).toMatchObject({
      ok: true, revision: 2,
    });
  });
});
