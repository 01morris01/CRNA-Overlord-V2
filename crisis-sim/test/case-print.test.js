/* Printable case sections, and the confidentiality probe for that surface.

   The printable export is a leak surface in its own right: everything the
   transport allowlist and learner projection protect is undone if the print
   button emits the answer key. These tests seed LEAK_ sentinels through every
   channel that must never print, render the printable case, and grep it. */
import { describe, expect, test } from 'vitest';
import standardScenario from '../sim/scenarios/standard_iv_healthy_001.json';
import { SimRunner } from '../ui/simRunner.js';
import { makeCaseExperience } from './helpers/caseFixtures.js';
import { renderPrintableCase } from '../../ui/liveSimView.js';

const SENTINEL = /LEAK_[A-Z_]+/g;

/* Channels that must NEVER appear in printable output. */
function seedForbiddenSentinels(experience) {
  // Uncompleted assessment action: its response is the answer key.
  experience.assessment.actions.push({
    id: 'ask_secret',
    stage: 'interview',
    domain: 'airway',
    prompt: 'Ask the concealed airway question',
    response: 'LEAK_UNCOMPLETED_ACTION_RESPONSE',
    reveals: ['hidden_finding'],
    prerequisites: [],
    scoringRuleId: 'discover_secret',
    critical: false,
  });
  experience.assessment.findings.push({
    id: 'hidden_finding',
    learnerLabel: 'LEAK_UNDISCOVERED_FINDING_LABEL',
    significance: 'LEAK_UNDISCOVERED_FINDING_SIGNIFICANCE',
    initiallyVisible: false,
    instructorOnlyUntilDiscovered: true,
  });
  // Scoring-rule labels populate ruleResults[].label — instructor scoring state
  // that the print scrub must drop (ruleResults print only id/status/points).
  experience.assessment.scoringRules.push({
    id: 'discover_secret',
    label: 'LEAK_ASSESSMENT_RULE_LABEL',
    critical: false,
    source: 'ENGINE_OBSERVABLE',
    evidence: { type: 'assessment_action', actionId: 'ask_secret' },
  });
  experience.planRequirements.rules.push({
    id: 'plan_secret',
    label: 'LEAK_PLAN_RULE_LABEL',
    critical: false,
    source: 'ENGINE_OBSERVABLE',
    evidence: { type: 'plan_equals', fieldId: 'disposition', value: 'postpone' },
  });
  // Event expected/unsafe responses and effect metadata reach the debrief
  // timeline; the printable timeline prints only tSec/sequence/kind/source.
  experience.eventFlow.events[0].expectedResponses = ['LEAK_EVENT_EXPECTED'];
  experience.eventFlow.events[0].unsafeResponses = ['LEAK_EVENT_UNSAFE'];

  // Released consideration: its scoring guidance and red flags stay hidden
  // even though the consideration itself is released.
  const [released] = experience.instructorGuide.considerations;
  released.title = 'NPO status';
  released.consideration = 'Trainee should establish intake timing.';
  released.expectedResponse = 'Ask solids and clear-liquid timing.';
  released.scoringGuidance = 'LEAK_SCORING_GUIDANCE';
  released.redFlags = ['LEAK_RED_FLAG'];
  released.defaultRevealInDebrief = true;

  // Unreleased consideration: every field stays hidden.
  experience.instructorGuide.considerations.push({
    id: 'consider_airway',
    phaseId: 'assessment',
    eventId: 'assessment_ready',
    title: 'LEAK_UNRELEASED_TITLE',
    consideration: 'LEAK_UNRELEASED_BODY',
    expectedResponse: 'LEAK_UNRELEASED_EXPECTED',
    responseWindowSec: 0,
    redFlags: ['LEAK_UNRELEASED_RED_FLAG'],
    scoringGuidance: 'LEAK_UNRELEASED_GUIDANCE',
    defaultRevealInDebrief: false,
  });

  // Debrief teaching text that was never released.
  experience.debrief.teachingItems[0].title = 'LEAK_DEBRIEF_TITLE';
  experience.debrief.teachingItems[0].explanation = 'LEAK_DEBRIEF_EXPLANATION';

  return experience;
}

function finalizedCaseDebrief({ seed = seedForbiddenSentinels, note = 'Asked intake timing' } = {}) {
  const runner = new SimRunner();
  const scenario = structuredClone(standardScenario);
  scenario.id = 'cn_print_probe_001';
  scenario.title = 'Print probe case';
  scenario.caseExperience = seed(makeCaseExperience());
  runner.loadCaseScenario({ scenario });

  expect(runner.advanceCaseStage({ stage: 'interview' })).toMatchObject({ ok: true });
  expect(runner.performAssessmentAction({ actionId: 'ask_npo' })).toMatchObject({ ok: true });
  expect(runner.advanceCaseStage({ stage: 'focused_exam' })).toMatchObject({ ok: true });
  expect(runner.advanceCaseStage({ stage: 'findings_summary' })).toMatchObject({ ok: true });
  expect(runner.submitCaseFindings({ findingIds: ['npo_ok'] })).toMatchObject({ ok: true });
  expect(runner.advanceCaseStage({ stage: 'plan_submission' })).toMatchObject({ ok: true });
  expect(runner.submitCasePlan({
    selections: { disposition: 'proceed' },
    rationale: 'Proceeding with standard induction.',
  })).toMatchObject({ ok: true });
  expect(runner.advanceCaseStage({ stage: 'debrief_draft' })).toMatchObject({ ok: true });
  for (const considerationId of ['consider_npo', 'consider_airway']) {
    const result = runner.setInstructorCaseObservation({
      considerationId, status: 'observed', note,
    });
    if (considerationId === 'consider_npo') expect(result).toMatchObject({ ok: true });
  }
  expect(runner.finalizeCaseDebrief()).toMatchObject({ ok: true });
  return runner.buildDebrief();
}

describe('renderPrintableCase sections', () => {
  test('renders every required section', () => {
    const html = renderPrintableCase({ debrief: finalizedCaseDebrief() });
    for (const heading of [
      'Assessment',
      'Anesthetic Plan',
      'Event Timeline',
      'Instructor Observations',
      'Released Teaching Feedback',
    ]) {
      expect(html).toContain(heading);
    }
    expect(html).toContain('Educational simulation. Not for clinical use.');
    expect(html).toContain('cn_print_probe_001');
  });

  test('rejects a debrief without a finalized case result', () => {
    expect(() => renderPrintableCase({ debrief: {} })).toThrow(/case/i);
    expect(() => renderPrintableCase({})).toThrow(/case/i);
  });

  test('labels an appropriately deferred case explicitly', () => {
    const runner = new SimRunner();
    const scenario = structuredClone(standardScenario);
    scenario.id = 'cn_print_deferred_001';
    scenario.caseExperience = makeCaseExperience();
    runner.loadCaseScenario({ scenario });
    expect(runner.advanceCaseStage({ stage: 'interview' })).toMatchObject({ ok: true });
    expect(runner.performAssessmentAction({ actionId: 'ask_npo' })).toMatchObject({ ok: true });
    expect(runner.advanceCaseStage({ stage: 'focused_exam' })).toMatchObject({ ok: true });
    expect(runner.advanceCaseStage({ stage: 'findings_summary' })).toMatchObject({ ok: true });
    expect(runner.submitCaseFindings({ findingIds: ['npo_ok'] })).toMatchObject({ ok: true });
    expect(runner.advanceCaseStage({ stage: 'plan_submission' })).toMatchObject({ ok: true });
    expect(runner.submitCasePlan({ selections: { disposition: 'postpone' } }))
      .toMatchObject({ ok: true });
    expect(runner.setInstructorCaseObservation({
      considerationId: 'consider_npo', status: 'observed',
    })).toMatchObject({ ok: true });
    expect(runner.finalizeCaseDebrief()).toMatchObject({ ok: true });

    const html = renderPrintableCase({ debrief: runner.buildDebrief() });
    expect(html).toContain('APPROPRIATELY DEFERRED');
    expect(html).toMatch(/deferred/i);
  });

  test('escapes hostile markup in case content', () => {
    const html = renderPrintableCase({
      debrief: finalizedCaseDebrief({ note: '<script>alert("print")</script>' }),
    });
    expect(html).not.toMatch(/<script>alert/i);
    expect(html).toContain('&lt;script&gt;');
  });
});

describe('printable case confidentiality probe', () => {
  test('no forbidden sentinel reaches the printable output', () => {
    const html = renderPrintableCase({ debrief: finalizedCaseDebrief() });
    const leaks = [...new Set(html.match(SENTINEL) ?? [])];
    // eslint-disable-next-line no-console
    console.log(`PRINT_LEAK_PROBE: ${JSON.stringify({ leaks })}`);
    expect(leaks).toEqual([]);
  });

  test('scoringGuidance and redFlags are absent even for released considerations', () => {
    const html = renderPrintableCase({ debrief: finalizedCaseDebrief() });
    expect(html).not.toContain('LEAK_SCORING_GUIDANCE');
    expect(html).not.toContain('LEAK_RED_FLAG');
    expect(html).not.toContain('scoringGuidance');
    expect(html).not.toContain('redFlags');
  });

  test('unreleased considerations, undiscovered findings, and uncompleted responses are absent', () => {
    const html = renderPrintableCase({ debrief: finalizedCaseDebrief() });
    for (const forbidden of [
      'LEAK_UNRELEASED_TITLE', 'LEAK_UNRELEASED_BODY', 'LEAK_UNRELEASED_EXPECTED',
      'LEAK_UNRELEASED_RED_FLAG', 'LEAK_UNRELEASED_GUIDANCE',
      'LEAK_UNDISCOVERED_FINDING_LABEL', 'LEAK_UNDISCOVERED_FINDING_SIGNIFICANCE',
      'LEAK_UNCOMPLETED_ACTION_RESPONSE',
      'LEAK_DEBRIEF_TITLE', 'LEAK_DEBRIEF_EXPLANATION',
    ]) {
      expect(html).not.toContain(forbidden);
    }
  });

  test('the probe is live: released feedback and instructor notes do print', () => {
    const html = renderPrintableCase({ debrief: finalizedCaseDebrief() });
    // Released consideration prose is the point of the section.
    expect(html).toContain('NPO status');
    expect(html).toContain('Trainee should establish intake timing.');
    // The instructor's own note belongs on the evaluation record.
    expect(html).toContain('Asked intake timing');
    // Discovered findings and the submitted plan are learner-earned record.
    expect(html).toContain('NPO appropriate');
    expect(html).toContain('Proceeding with standard induction.');
  });
});
