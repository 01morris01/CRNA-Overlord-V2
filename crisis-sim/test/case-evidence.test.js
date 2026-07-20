/* In-suite evidence for the teaching cases: the determinism guarantee and the
   missed-finding / weak-plan scoring paths that the happy-path scenario tests
   do not exercise. The standalone test/case-evidence.mjs covers the same
   drivers plus the full live MH trajectory and must be run under node. */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { SimRunner } from '../ui/simRunner.js';

const load = (n) => JSON.parse(readFileSync(new URL(`../sim/scenarios/${n}.json`, import.meta.url), 'utf8'));
const KAREN = load('cn_preassessment_lap_chole_001');
const BRITTANY = load('cn_preassessment_npo_mh_001');

function observeAll(runner, exp) {
  for (const c of exp.instructorGuide.considerations) {
    runner.setInstructorCaseObservation({ considerationId: c.id, status: 'observed' });
  }
}

function runKaren(interview, findingIds, plan) {
  const r = new SimRunner();
  r.loadCaseScenario({ scenario: KAREN });
  r.advanceCaseStage({ stage: 'interview' });
  for (const id of interview) r.performAssessmentAction({ actionId: id });
  r.advanceCaseStage({ stage: 'focused_exam' });
  r.performAssessmentAction({ actionId: 'exam_airway' });
  r.advanceCaseStage({ stage: 'findings_summary' });
  r.submitCaseFindings({ findingIds });
  r.advanceCaseStage({ stage: 'plan_submission' });
  r.submitCasePlan({ selections: plan });
  r.advanceCaseStage({ stage: 'debrief_draft' });
  observeAll(r, KAREN.caseExperience);
  expect(r.finalizeCaseDebrief()).toMatchObject({ ok: true });
  return r.buildDebrief().caseResult;
}

const KAREN_GOOD_PLAN = {
  disposition: 'proceed', asa_class: 'II', reactive_airway: 'sevoflurane_albuterol_ready',
  ponv_prophylaxis: 'multimodal', vte_prophylaxis: 'mechanical_scd', analgesia: 'multimodal_no_codeine',
};
const KAREN_ALL = ['ask_asthma_control', 'ask_ponv_history', 'ask_contraceptive', 'ask_codeine'];
const KAREN_ALL_FINDINGS = ['mild_asthma', 'ponv_high_risk', 'ocp_vte_risk', 'codeine_intolerance', 'airway_assessed'];

describe('case determinism', () => {
  test('two identical Karen runs produce a byte-identical case result', () => {
    const fp = () => createHash('sha256')
      .update(JSON.stringify(runKaren(KAREN_ALL, KAREN_ALL_FINDINGS, KAREN_GOOD_PLAN)))
      .digest('hex');
    expect(fp()).toBe(fp());
  });
});

describe('missed findings and weak plans score correctly', () => {
  test('never asking the PONV history leaves it missed and the weak plan unscored', () => {
    const result = runKaren(
      ['ask_asthma_control'],
      ['mild_asthma', 'airway_assessed'],
      { ...KAREN_GOOD_PLAN, ponv_prophylaxis: 'single_agent' },
    );
    expect(result.assessment.missedFindings.map((f) => f.id)).toContain('ponv_high_risk');
    expect(result.plan.ruleResults.find((r) => r.id === 'multimodal_ponv_prophylaxis').status)
      .toBe('not_performed');
  });

  test('Brittany: missing the NPO and MH history leaves both findings missed', () => {
    const r = new SimRunner();
    r.loadCaseScenario({ scenario: BRITTANY });
    r.advanceCaseStage({ stage: 'interview' });
    r.performAssessmentAction({ actionId: 'ask_pregnancy' });
    r.advanceCaseStage({ stage: 'focused_exam' });
    r.performAssessmentAction({ actionId: 'exam_dentition' });
    r.advanceCaseStage({ stage: 'findings_summary' });
    r.submitCaseFindings({ findingIds: ['pregnancy_screen_needed', 'dental_injury_risk'] });
    r.advanceCaseStage({ stage: 'plan_submission' });
    r.submitCasePlan({
      selections: {
        disposition: 'postpone', asa_class: 'II', mh_management: 'escalate_trigger_free',
        trigger_free_technique: 'no_sux_no_volatile', airway_readiness: 'difficult_airway_prepared',
        team_communication: 'notify_team',
      },
    });
    r.advanceCaseStage({ stage: 'debrief_draft' });
    observeAll(r, BRITTANY.caseExperience);
    expect(r.finalizeCaseDebrief()).toMatchObject({ ok: true });
    const missed = r.buildDebrief().caseResult.assessment.missedFindings.map((f) => f.id);
    expect(missed).toEqual(expect.arrayContaining(['heavy_breakfast_two_hours', 'family_history_mh']));
  });

  test('the correct postpone path records no live anesthetic actions', () => {
    const r = new SimRunner();
    r.loadCaseScenario({ scenario: BRITTANY });
    r.advanceCaseStage({ stage: 'interview' });
    for (const id of ['ask_last_meal', 'ask_family_anesthesia']) r.performAssessmentAction({ actionId: id });
    r.advanceCaseStage({ stage: 'focused_exam' });
    r.performAssessmentAction({ actionId: 'exam_airway' });
    r.advanceCaseStage({ stage: 'findings_summary' });
    r.submitCaseFindings({ findingIds: ['heavy_breakfast_two_hours', 'family_history_mh', 'predicted_difficult_airway'] });
    r.advanceCaseStage({ stage: 'plan_submission' });
    r.submitCasePlan({
      selections: {
        disposition: 'postpone', asa_class: 'II', mh_management: 'escalate_trigger_free',
        trigger_free_technique: 'no_sux_no_volatile', airway_readiness: 'difficult_airway_prepared',
        team_communication: 'notify_team',
      },
    });
    r.advanceCaseStage({ stage: 'debrief_draft' });
    observeAll(r, BRITTANY.caseExperience);
    r.finalizeCaseDebrief();
    const timeline = r.buildDebrief().caseResult.eventTimeline;
    expect(timeline.some((e) => e.kind === 'live_action')).toBe(false);
  });
});
