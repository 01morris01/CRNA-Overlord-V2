import { describe, expect, it } from 'vitest';
import { normalizeCaseExperience } from '../sim/scenario/caseContract.js';
import { CASE_OBSERVATION_STATUS, CaseSession } from '../sim/scenario/caseSession.js';
import { makeCaseScenario } from './helpers/caseFixtures.js';
import {
  escapeCaseHtml,
  formatCaseClock,
  renderInstructorCaseMarkup,
  renderInstructorCaseShell,
  renderLearnerCaseMarkup,
  renderLearnerCaseShell,
} from '../../ui/liveCaseModel.js';

const XSS = '<script>alert("case")</script>';
const ATTR_BREAKOUT = '"><img src=x onerror=alert(1)>';

function requireOk(result) {
  expect(result).toMatchObject({ ok: true });
  return result;
}

function makeSession() {
  const definition = normalizeCaseExperience(makeCaseScenario());
  return new CaseSession({ definition, seed: 12345 });
}

function makeFindingsStageSession() {
  const session = makeSession();
  requireOk(session.advanceStage({ stage: 'interview', tSec: 1 }));
  requireOk(session.recordAssessmentAction({ actionId: 'ask_npo', tSec: 2 }));
  requireOk(session.advanceStage({ stage: 'focused_exam', tSec: 3 }));
  requireOk(session.advanceStage({ stage: 'findings_summary', tSec: 4 }));
  return session;
}

function makePlanStageSession() {
  const session = makeFindingsStageSession();
  requireOk(session.submitFindings({
    findingIds: ['npo_ok'], notes: 'Learner summary note', tSec: 5,
  }));
  requireOk(session.advanceStage({ stage: 'plan_submission', tSec: 6 }));
  return session;
}

function makeProgressedSession() {
  const session = makePlanStageSession();
  requireOk(session.submitPlan({
    selections: { disposition: 'proceed' }, rationale: 'Proceed rationale', tSec: 7,
  }));
  return session;
}

function makeFinalizedSession() {
  const session = makeProgressedSession();
  requireOk(session.advanceStage({ stage: 'debrief_draft', tSec: 8 }));
  requireOk(session.setInstructorObservation({
    considerationId: 'consider_npo', status: 'observed', note: 'Observed live', tSec: 9,
  }));
  requireOk(session.finalize({ tSec: 10 }));
  return session;
}

function combinedLearnerMarkup(markup) {
  return [
    markup.chart, markup.interview, markup.exam,
    markup.findings, markup.plan, markup.status,
  ].join('\n');
}

function combinedInstructorMarkup(markup) {
  return [
    markup.currentPhase, markup.activeEvent, markup.branches,
    markup.considerations, markup.history,
  ].join('\n');
}

function everyControlTag(markupString) {
  return markupString.match(/<(?:button|input|textarea|select|fieldset)\b[^>]*>/g) ?? [];
}

describe('escapeCaseHtml', () => {
  it('escapes every executable HTML metacharacter', () => {
    expect(escapeCaseHtml('<a href="x">&\'')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&#039;');
    expect(escapeCaseHtml(null)).toBe('');
    expect(escapeCaseHtml(undefined)).toBe('');
    expect(escapeCaseHtml(42)).toBe('42');
  });
});

describe('formatCaseClock', () => {
  it('formats fixed-step case times as zero-padded clocks', () => {
    expect(formatCaseClock(0)).toBe('00:00');
    expect(formatCaseClock(65)).toBe('01:05');
    expect(formatCaseClock(59.98)).toBe('00:59');
    expect(formatCaseClock(3661)).toBe('01:01:01');
  });

  it('collapses invalid values to a zero clock', () => {
    expect(formatCaseClock(Number.NaN)).toBe('00:00');
    expect(formatCaseClock(-5)).toBe('00:00');
    expect(formatCaseClock(Number.POSITIVE_INFINITY)).toBe('00:00');
    expect(formatCaseClock('12')).toBe('00:00');
  });
});

describe('case UI shells', () => {
  it('renders the learner workspace shell with stable accessible IDs', () => {
    for (const id of [
      'live-case-workspace', 'live-case-stage-chart', 'live-case-stage-interview',
      'live-case-stage-exam', 'live-case-stage-findings', 'live-case-stage-plan',
      'live-case-notes', 'live-case-submit-findings', 'live-case-submit-plan',
    ]) expect(renderLearnerCaseShell()).toContain(`id="${id}"`);
  });

  it('renders the instructor panel shell with stable accessible IDs', () => {
    for (const id of [
      'live-case-instructor', 'live-case-current-phase', 'live-case-active-event',
      'live-case-considerations', 'live-case-history', 'live-case-pause',
      'live-case-advance', 'live-case-branches',
    ]) expect(renderInstructorCaseShell()).toContain(`id="${id}"`);
  });

  it('includes polite aria-live status regions in both shells', () => {
    expect(renderLearnerCaseShell()).toContain('aria-live="polite"');
    expect(renderInstructorCaseShell()).toContain('aria-live="polite"');
  });

  it('is pure, deterministic, and free of executable script content', () => {
    expect(renderLearnerCaseShell()).toBe(renderLearnerCaseShell());
    expect(renderInstructorCaseShell()).toBe(renderInstructorCaseShell());
    expect(renderLearnerCaseShell()).not.toMatch(/<script/i);
    expect(renderInstructorCaseShell()).not.toMatch(/<script/i);
  });
});

describe('learner case markup', () => {
  it('renders chart, stage, and phase details from a real learner projection', () => {
    const markup = renderLearnerCaseMarkup(makeSession().getLearnerContext());
    expect(markup.chart).toContain('Taylor Example');
    expect(markup.chart).toContain('SIM-0001');
    expect(markup.chart).toContain('Test procedure');
    expect(markup.status).toContain('CHART REVIEW');
    expect(markup.status).toContain('Assessment');
    expect(Object.isFrozen(markup)).toBe(true);
  });

  it('renders empty defaults without throwing when no case is loaded', () => {
    const markup = renderLearnerCaseMarkup();
    expect(typeof markup.chart).toBe('string');
    expect(markup.status).toContain('No teaching case');
    expect(markup.submitFindingsDisabled).toBe(true);
    expect(markup.submitPlanDisabled).toBe(true);
  });

  it('conceals action responses before completion and reveals them after', () => {
    const fresh = makeSession();
    requireOk(fresh.advanceStage({ stage: 'interview', tSec: 1 }));
    const before = renderLearnerCaseMarkup(fresh.getLearnerContext());
    expect(before.interview).toContain('data-case-action="ask_npo"');
    expect(before.interview).toContain('Ask last oral intake');
    expect(combinedLearnerMarkup(before)).not.toContain('Solids eight hours ago');

    requireOk(fresh.recordAssessmentAction({ actionId: 'ask_npo', tSec: 2 }));
    const after = renderLearnerCaseMarkup(fresh.getLearnerContext());
    expect(after.interview).toContain('Solids eight hours ago');
    const completedButton = everyControlTag(after.interview)
      .find((tag) => tag.includes('data-case-action="ask_npo"'));
    expect(completedButton).toContain('disabled');
  });

  it('associates discovered finding checkboxes with labels', () => {
    const markup = renderLearnerCaseMarkup(makeFindingsStageSession().getLearnerContext());
    expect(markup.findings).toContain('NPO appropriate');
    expect(markup.findings).toContain('Aspiration risk assessed');
    expect(markup.findings).toContain('id="live-case-finding-npo_ok"');
    expect(markup.findings).toContain('for="live-case-finding-npo_ok"');
    expect(markup.findings).toContain('data-case-finding="npo_ok"');
  });

  it('groups plan fields with fieldset, legend, and associated option labels', () => {
    const markup = renderLearnerCaseMarkup(makePlanStageSession().getLearnerContext());
    expect(markup.plan).toContain('<fieldset');
    expect(markup.plan).toContain('<legend');
    expect(markup.plan).toContain('id="live-case-plan-disposition-proceed"');
    expect(markup.plan).toContain('for="live-case-plan-disposition-proceed"');
    expect(markup.plan).toContain('id="live-case-plan-disposition-postpone"');
    expect(markup.plan).toContain('name="live-case-plan-disposition"');
    expect(markup.plan).toContain('data-case-plan-field="disposition"');
    expect(markup.plan).not.toContain('disabled');
  });

  it('marks the learner plan selection after submission', () => {
    const markup = renderLearnerCaseMarkup(makeProgressedSession().getLearnerContext());
    const proceedInput = everyControlTag(markup.plan)
      .find((tag) => tag.includes('id="live-case-plan-disposition-proceed"'));
    const postponeInput = everyControlTag(markup.plan)
      .find((tag) => tag.includes('id="live-case-plan-disposition-postpone"'));
    expect(proceedInput).toContain('checked');
    expect(postponeInput).not.toContain('checked');
    expect(markup.plan).toContain('Proceed rationale');
  });

  it('gates the submit controls by stage and finalization', () => {
    const chartStage = renderLearnerCaseMarkup(makeSession().getLearnerContext());
    expect(chartStage.submitFindingsDisabled).toBe(true);
    expect(chartStage.submitPlanDisabled).toBe(true);

    const findingsStage = renderLearnerCaseMarkup(makeFindingsStageSession().getLearnerContext());
    expect(findingsStage.submitFindingsDisabled).toBe(false);
    expect(findingsStage.submitPlanDisabled).toBe(true);

    const planStage = renderLearnerCaseMarkup(makePlanStageSession().getLearnerContext());
    expect(planStage.submitFindingsDisabled).toBe(true);
    expect(planStage.submitPlanDisabled).toBe(false);

    const finalized = renderLearnerCaseMarkup(makeFinalizedSession().getLearnerContext());
    expect(finalized.finalized).toBe(true);
    expect(finalized.submitFindingsDisabled).toBe(true);
    expect(finalized.submitPlanDisabled).toBe(true);
    expect(finalized.notesDisabled).toBe(true);
    expect(finalized.status).toContain('FINALIZED');
  });

  it('disables every rendered learner control once finalized', () => {
    const markup = renderLearnerCaseMarkup(makeFinalizedSession().getLearnerContext());
    const controls = everyControlTag(combinedLearnerMarkup(markup));
    expect(controls.length).toBeGreaterThan(0);
    for (const tag of controls) expect(tag).toContain('disabled');
  });

  it('escapes malicious chart, response, note, and scenario strings', () => {
    const hostile = {
      active: true,
      stage: 'interview',
      finalized: false,
      outcome: null,
      learnerChart: {
        patient: { syntheticName: XSS, mrn: ATTR_BREAKOUT, ageYears: 40, sex: XSS },
        scheduledProcedure: { name: XSS, site: ATTR_BREAKOUT, laterality: 'none' },
        documents: [XSS],
        medications: [{ name: XSS, dose: ATTR_BREAKOUT }],
        allergies: [ATTR_BREAKOUT],
        labs: [],
        studies: [],
      },
      surgery: {
        procedure: XSS,
        indication: ATTR_BREAKOUT,
        position: 'supine',
        expectedDurationMin: 30,
        expectedStimulation: 'low',
        bloodLossRisk: 'low',
      },
      assessmentStages: ['chart_review', 'interview'],
      planFields: [{
        id: 'disposition', type: 'single', required: true, options: [ATTR_BREAKOUT, 'postpone'],
      }],
      actions: [{
        id: 'ask', stage: 'interview', domain: 'npo',
        prompt: XSS, completed: true, response: ATTR_BREAKOUT,
      }],
      discoveredFindings: [{
        id: 'f1', learnerLabel: XSS, discovered: true,
        initiallyVisible: false, significance: ATTR_BREAKOUT,
      }],
      assessmentRecords: [{ actionId: 'ask', tSec: 1, sequence: 1 }],
      findingsSubmission: { findingIds: ['f1'], notes: XSS, tSec: 2, sequence: 2 },
      planSubmission: {
        selections: { disposition: ATTR_BREAKOUT }, rationale: XSS, tSec: 3, sequence: 3,
      },
      flowState: { currentPhaseTitle: XSS, paused: false },
    };
    const combined = combinedLearnerMarkup(renderLearnerCaseMarkup(hostile));
    expect(combined).not.toMatch(/<script/i);
    expect(combined).not.toContain('<img');
    expect(combined).not.toContain('"><img');
    expect(combined).toContain('&lt;script&gt;');
    expect(combined).toContain('&lt;img');
  });

  it('never leaks concealed fields from a hostile instructor-shaped projection', () => {
    const instructorContext = makeSession().getInstructorContext();
    const rendered = JSON.stringify(renderLearnerCaseMarkup(instructorContext));
    for (const concealed of [
      'Solids eight hours ago',
      'Aspiration risk assessed',
      'Trainee should establish intake timing.',
      'Ask solids and clear-liquid timing.',
      'Plan submitted without NPO assessment',
      'Observe sequence.',
      'Connect intake timing to aspiration risk.',
      'plan_equals',
      'assessment_action',
    ]) expect(rendered).not.toContain(concealed);
  });

  it('ignores every concealed field on an explicitly hostile object', () => {
    const hostile = {
      active: true,
      stage: 'interview',
      finalized: false,
      outcome: null,
      learnerChart: { patient: { syntheticName: 'Safe Name' } },
      surgery: {
        procedure: 'Safe procedure',
        indication: 'Safe indication',
        position: 'supine',
        expectedDurationMin: 30,
        expectedStimulation: 'low',
        bloodLossRisk: 'low',
        physiologicChallenges: ['LEAK_physiologic_challenge'],
        anesthesiaConsiderations: ['LEAK_anesthesia_consideration'],
      },
      assessment: {
        actions: [{ id: 'a', response: 'LEAK_concealed_response' }],
        findings: [{ id: 'f', significance: 'LEAK_significance' }],
        scoringRules: [{ id: 'r', label: 'LEAK_rule_answer' }],
      },
      actions: [{
        id: 'visible', stage: 'interview', domain: 'npo', prompt: 'Safe prompt',
        completed: false, response: 'LEAK_uncompleted_response',
        expectedResponse: 'LEAK_expected_response',
      }],
      discoveredFindings: [{
        id: 'df', learnerLabel: 'Safe label', discovered: false,
        initiallyVisible: true, significance: 'LEAK_undiscovered_significance',
      }],
      instructorGuide: {
        considerations: [{
          id: 'c', consideration: 'LEAK_guidance', expectedResponse: 'LEAK_expected',
          redFlags: ['LEAK_red_flag'], scoringGuidance: 'LEAK_scoring_guidance',
        }],
      },
      considerations: [{ id: 'c2', consideration: 'LEAK_current_consideration' }],
      ruleResults: [{ id: 'rr', label: 'LEAK_rule_result' }],
      eventFlow: { events: [{ id: 'e', expectedResponses: ['LEAK_expected_responses'] }] },
      debrief: { teachingItems: [{ id: 't', explanation: 'LEAK_unreleased_debrief' }] },
      timeline: [{ kind: 'LEAK_timeline', tSec: 1, sequence: 1 }],
      instructorObservations: [{ considerationId: 'c', note: 'LEAK_instructor_note' }],
      flowState: {
        currentPhaseTitle: 'Safe phase',
        paused: false,
        activeEventIds: ['LEAK_active_event'],
        history: [{ kind: 'LEAK_flow_history' }],
      },
    };
    const rendered = JSON.stringify(renderLearnerCaseMarkup(hostile));
    expect(rendered).not.toContain('LEAK_');
    expect(rendered).toContain('Safe prompt');
    expect(rendered).toContain('Safe label');
  });
});

describe('instructor case markup', () => {
  it('renders complete consideration guidance from a real instructor projection', () => {
    const markup = renderInstructorCaseMarkup(makeSession().getInstructorContext());
    expect(markup.considerations).toContain('NPO status');
    expect(markup.considerations).toContain('Trainee should establish intake timing.');
    expect(markup.considerations).toContain('Ask solids and clear-liquid timing.');
    expect(markup.considerations).toContain('Plan submitted without NPO assessment');
    expect(markup.considerations).toContain('Observe sequence.');
    expect(markup.currentPhase).toContain('Assessment');
    expect(Object.isFrozen(markup)).toBe(true);
  });

  it('renders one control per frozen observation status for each consideration', () => {
    const markup = renderInstructorCaseMarkup(makeSession().getInstructorContext());
    expect(CASE_OBSERVATION_STATUS).toEqual(['observed', 'missed', 'not_yet_evaluable']);
    for (const status of CASE_OBSERVATION_STATUS) {
      expect(markup.considerations).toContain(`data-case-status="${status}"`);
    }
    expect(markup.considerations).toContain('data-case-observation="consider_npo"');
    expect(markup.considerations).toContain('data-case-observation-note="consider_npo"');
  });

  it('presses the recorded observation status and shows the note', () => {
    const session = makeSession();
    requireOk(session.setInstructorObservation({
      considerationId: 'consider_npo', status: 'missed', note: 'Never asked', tSec: 1,
    }));
    const markup = renderInstructorCaseMarkup(session.getInstructorContext());
    const buttons = everyControlTag(markup.considerations)
      .filter((tag) => tag.includes('data-case-observation="consider_npo"'));
    const missed = buttons.find((tag) => tag.includes('data-case-status="missed"'));
    const observed = buttons.find((tag) => tag.includes('data-case-status="observed"'));
    expect(missed).toContain('aria-pressed="true"');
    expect(observed).toContain('aria-pressed="false"');
    expect(markup.considerations).toContain('Never asked');
  });

  it('reflects the feedback reveal state through a checkbox control', () => {
    const session = makeSession();
    const revealed = renderInstructorCaseMarkup(session.getInstructorContext());
    const revealedTag = everyControlTag(revealed.considerations)
      .find((tag) => tag.includes('data-case-reveal="consider_npo"'));
    expect(revealedTag).toContain('type="checkbox"');
    expect(revealedTag).toContain('checked');

    requireOk(session.setFeedbackReveal({
      considerationId: 'consider_npo', reveal: false, tSec: 1,
    }));
    const concealed = renderInstructorCaseMarkup(session.getInstructorContext());
    const concealedTag = everyControlTag(concealed.considerations)
      .find((tag) => tag.includes('data-case-reveal="consider_npo"'));
    expect(concealedTag).not.toContain('checked');
  });

  it('renders session history chronologically even from unsorted input', () => {
    const real = renderInstructorCaseMarkup(makeProgressedSession().getInstructorContext());
    const stageIndex = real.history.indexOf('stage_transition');
    const actionIndex = real.history.indexOf('assessment_action');
    const planIndex = real.history.indexOf('plan_submission');
    expect(stageIndex).toBeGreaterThan(-1);
    expect(actionIndex).toBeGreaterThan(stageIndex);
    expect(planIndex).toBeGreaterThan(actionIndex);

    const unsorted = renderInstructorCaseMarkup({
      active: true,
      stage: 'interview',
      finalized: false,
      timeline: [
        { kind: 'gamma_marker', tSec: 5, sequence: 3 },
        { kind: 'alpha_marker', tSec: 1, sequence: 1 },
        { kind: 'beta_marker', tSec: 3, sequence: 2 },
      ],
    });
    const alpha = unsorted.history.indexOf('alpha_marker');
    const beta = unsorted.history.indexOf('beta_marker');
    const gamma = unsorted.history.indexOf('gamma_marker');
    expect(alpha).toBeGreaterThan(-1);
    expect(beta).toBeGreaterThan(alpha);
    expect(gamma).toBeGreaterThan(beta);
    expect(unsorted.history).toContain(formatCaseClock(5));
  });

  it('renders phase, active event, pause, and branch controls from flow state', () => {
    const markup = renderInstructorCaseMarkup(makeSession().getInstructorContext());
    expect(markup.currentPhase).toContain('Assessment');
    expect(typeof markup.activeEvent).toBe('string');
    expect(markup.pauseDisabled).toBe(false);
    expect(markup.advanceDisabled).toBe(false);
    expect(markup.pauseLabel).toBe('PAUSE CASE');

    const withBranches = renderInstructorCaseMarkup({
      active: true,
      stage: 'live_simulation',
      finalized: false,
      flowState: {
        currentPhaseId: 'assessment',
        currentPhaseTitle: 'Assessment',
        paused: true,
        activeEventIds: ['assessment_ready'],
        availableBranchIds: ['proceed_for_training'],
      },
    });
    expect(withBranches.branches).toContain('data-case-branch="proceed_for_training"');
    expect(withBranches.pauseLabel).toBe('RESUME CASE');
    expect(withBranches.activeEvent).toContain('assessment_ready');
  });

  it('disables every instructor control once finalized', () => {
    const markup = renderInstructorCaseMarkup(makeFinalizedSession().getInstructorContext());
    expect(markup.finalized).toBe(true);
    expect(markup.pauseDisabled).toBe(true);
    expect(markup.advanceDisabled).toBe(true);
    const controls = everyControlTag(combinedInstructorMarkup(markup));
    expect(controls.length).toBeGreaterThan(0);
    for (const tag of controls) expect(tag).toContain('disabled');
  });

  it('escapes malicious guidance and note strings without executable HTML', () => {
    const markup = renderInstructorCaseMarkup({
      active: true,
      stage: 'interview',
      finalized: false,
      considerations: [{
        id: 'hostile', phaseId: 'assessment', eventId: 'assessment_ready',
        title: XSS, consideration: ATTR_BREAKOUT, expectedResponse: XSS,
        responseWindowSec: 30, redFlags: [ATTR_BREAKOUT], scoringGuidance: XSS,
        defaultRevealInDebrief: true,
      }],
      instructorObservations: [{
        considerationId: 'hostile', status: 'observed', note: XSS,
        tSec: 1, sequence: 1, revision: 1,
      }],
      feedbackRevealIds: ['hostile'],
      timeline: [{ kind: XSS, tSec: 1, sequence: 1 }],
      flowState: {
        currentPhaseId: 'assessment', currentPhaseTitle: ATTR_BREAKOUT,
        paused: false, activeEventIds: [XSS], availableBranchIds: [ATTR_BREAKOUT],
      },
    });
    const combined = combinedInstructorMarkup(markup);
    expect(combined).not.toMatch(/<script/i);
    expect(combined).not.toContain('<img');
    expect(combined).not.toContain('"><img');
    expect(combined).toContain('&lt;script&gt;');
    expect(combined).toContain('&lt;img');
  });
});
