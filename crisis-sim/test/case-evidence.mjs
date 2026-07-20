/* Executable evidence for the two Carson-Newman preanesthesia cases.
   Runs standalone under node (vitest silently skips .mjs, so this must be run
   with `node test/case-evidence.mjs`). Drives each case through public
   SimRunner methods only, inspects only public projections and debriefs,
   prints JSON summaries, proves determinism, and ends with CASE_EVIDENCE: PASS.
   A thin case-evidence.test.js re-runs the same drivers inside the suite. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { SimRunner, VentMode } from '../ui/simRunner.js';

const load = (n) => JSON.parse(readFileSync(new URL(`../sim/scenarios/${n}.json`, import.meta.url), 'utf8'));
const KAREN = load('cn_preassessment_lap_chole_001');
const BRITTANY = load('cn_preassessment_npo_mh_001');

const observeAll = (runner, exp) => {
  for (const c of exp.instructorGuide.considerations) {
    runner.setInstructorCaseObservation({ considerationId: c.id, status: 'observed' });
  }
};
const fingerprint = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const step = (runner, s) => { runner.pause(); return runner.stepFor(s); };

// --- Karen: complete correct path, returns the finalized case result ---
const KAREN_ALL_INTERVIEW = ['ask_asthma_control', 'ask_ponv_history', 'ask_contraceptive', 'ask_codeine'];
function runKaren(findingIds, plan, interviewActions = KAREN_ALL_INTERVIEW) {
  const r = new SimRunner();
  r.loadCaseScenario({ scenario: KAREN });
  r.advanceCaseStage({ stage: 'interview' });
  for (const id of interviewActions) r.performAssessmentAction({ actionId: id });
  r.advanceCaseStage({ stage: 'focused_exam' });
  r.performAssessmentAction({ actionId: 'exam_airway' });
  r.advanceCaseStage({ stage: 'findings_summary' });
  r.submitCaseFindings({ findingIds });
  r.advanceCaseStage({ stage: 'plan_submission' });
  r.submitCasePlan({ selections: plan });
  r.advanceCaseStage({ stage: 'debrief_draft' });
  observeAll(r, KAREN.caseExperience);
  assert.equal(r.finalizeCaseDebrief().ok, true, 'Karen must finalize');
  return r.buildDebrief().caseResult;
}

const karenGoodPlan = {
  disposition: 'proceed', asa_class: 'II', reactive_airway: 'sevoflurane_albuterol_ready',
  ponv_prophylaxis: 'multimodal', vte_prophylaxis: 'mechanical_scd', analgesia: 'multimodal_no_codeine',
};

// 1. Karen complete discovery/plan/debrief.
const karenComplete = runKaren(
  ['mild_asthma', 'ponv_high_risk', 'ocp_vte_risk', 'codeine_intolerance', 'airway_assessed'],
  karenGoodPlan,
);
assert.equal(karenComplete.outcome, 'completed');
assert.equal(karenComplete.assessment.missedFindings.length, 1); // anesthetic_history not performed
console.log('KAREN_COMPLETE:', JSON.stringify({
  outcome: karenComplete.outcome,
  discovered: karenComplete.assessment.discoveredFindings.map((f) => f.id),
  released: karenComplete.releasedFeedback.map((f) => f.considerationId),
}));

// 2. Karen missing the PONV history (never asks) and a weaker plan.
const karenMissed = runKaren(
  ['mild_asthma', 'airway_assessed'],
  { ...karenGoodPlan, ponv_prophylaxis: 'single_agent' },
  ['ask_asthma_control'],
);
const ponvRule = karenMissed.plan.ruleResults.find((r) => r.id === 'multimodal_ponv_prophylaxis');
assert.equal(ponvRule.status, 'not_performed', 'weak PONV plan must not score');
assert.ok(karenMissed.assessment.missedFindings.some((f) => f.id === 'ponv_high_risk'));
console.log('KAREN_MISSED_PONV:', JSON.stringify({
  ponvRule: ponvRule.status,
  missed: karenMissed.assessment.missedFindings.map((f) => f.id),
}));

// 3. Determinism: two identical Karen runs are byte-identical.
const fpA = fingerprint(runKaren(['mild_asthma', 'ponv_high_risk', 'ocp_vte_risk', 'codeine_intolerance', 'airway_assessed'], karenGoodPlan));
const fpB = fingerprint(runKaren(['mild_asthma', 'ponv_high_risk', 'ocp_vte_risk', 'codeine_intolerance', 'airway_assessed'], karenGoodPlan));
assert.equal(fpA, fpB, 'identical Karen runs must be byte-identical');
console.log('KAREN_DETERMINISM:', JSON.stringify({ fingerprintA: fpA.slice(0, 16), fingerprintB: fpB.slice(0, 16), identical: fpA === fpB }));

// --- Brittany: correct postpone path ---
const BR_ALL_INTERVIEW = ['ask_last_meal', 'ask_family_anesthesia', 'ask_pregnancy'];
const BR_ALL_EXAM = ['exam_airway', 'exam_dentition'];
function runBrittanyPostpone(findingIds, interview = BR_ALL_INTERVIEW, exam = BR_ALL_EXAM) {
  const r = new SimRunner();
  r.loadCaseScenario({ scenario: BRITTANY });
  r.advanceCaseStage({ stage: 'interview' });
  for (const id of interview) r.performAssessmentAction({ actionId: id });
  r.advanceCaseStage({ stage: 'focused_exam' });
  for (const id of exam) r.performAssessmentAction({ actionId: id });
  r.advanceCaseStage({ stage: 'findings_summary' });
  r.submitCaseFindings({ findingIds });
  r.advanceCaseStage({ stage: 'plan_submission' });
  r.submitCasePlan({
    selections: {
      disposition: 'postpone', asa_class: 'II', mh_management: 'escalate_trigger_free',
      trigger_free_technique: 'no_sux_no_volatile', airway_readiness: 'difficult_airway_prepared',
      team_communication: 'notify_team',
    },
  });
  assert.equal(r.getLearnerCaseContext().stage, 'appropriately_deferred');
  r.advanceCaseStage({ stage: 'debrief_draft' });
  observeAll(r, BRITTANY.caseExperience);
  assert.equal(r.finalizeCaseDebrief().ok, true, 'Brittany must finalize');
  return { runner: r, result: r.buildDebrief().caseResult };
}

const allBrittanyFindings = ['heavy_breakfast_two_hours', 'family_history_mh', 'pregnancy_screen_needed', 'predicted_difficult_airway', 'dental_injury_risk'];
const brPostpone = runBrittanyPostpone(allBrittanyFindings).result;
assert.equal(brPostpone.outcome, 'appropriately_deferred');
assert.equal(brPostpone.plan.ruleResults.find((r) => r.id === 'postpone_elective_case').status, 'performed');
// No live anesthetic actions occurred on the correct path.
assert.ok(!brPostpone.eventTimeline.some((e) => e.kind === 'live_action'), 'postpone path has no live actions');
console.log('BRITTANY_POSTPONE:', JSON.stringify({
  outcome: brPostpone.outcome,
  postponeRule: brPostpone.plan.ruleResults.find((r) => r.id === 'postpone_elective_case').status,
  liveActions: brPostpone.eventTimeline.filter((e) => e.kind === 'live_action').length,
}));

// 4. Brittany missing the NPO and MH findings (never asks about meal or family history).
const brMissed = runBrittanyPostpone(['pregnancy_screen_needed', 'dental_injury_risk'], ['ask_pregnancy'], ['exam_dentition']).result;
const missedIds = brMissed.assessment.missedFindings.map((f) => f.id);
assert.ok(missedIds.includes('heavy_breakfast_two_hours') && missedIds.includes('family_history_mh'));
console.log('BRITTANY_MISSED:', JSON.stringify({ missed: missedIds }));

// 5/6. Brittany training branch: MH physiology and dantrolene treatment.
function runBrittanyTraining() {
  const r = new SimRunner();
  r.loadCaseScenario({ scenario: BRITTANY });
  r.advanceCaseStage({ stage: 'interview' });
  r.performAssessmentAction({ actionId: 'ask_family_anesthesia' });
  r.advanceCaseStage({ stage: 'focused_exam' });
  r.performAssessmentAction({ actionId: 'exam_airway' });
  r.advanceCaseStage({ stage: 'findings_summary' });
  r.submitCaseFindings({ findingIds: ['family_history_mh', 'predicted_difficult_airway'] });
  r.advanceCaseStage({ stage: 'plan_submission' });
  r.submitCasePlan({
    selections: {
      disposition: 'postpone', asa_class: 'II', mh_management: 'escalate_trigger_free',
      trigger_free_technique: 'no_sux_no_volatile', airway_readiness: 'difficult_airway_prepared',
      team_communication: 'notify_team',
    },
  });
  assert.equal(r.activateCaseBranch({ branchId: 'proceed_for_training' }).ok, true);
  r.advanceCasePhase(); r.advanceCasePhase(); r.advanceCasePhase(); // -> training_maintenance
  const w = r.config.weightKg;
  r.giveBolus('Propofol', 2 * w, 'ind'); r.giveBolus('Rocuronium', 0.6 * w, 'nmb');
  step(r, 30); r.intubate(); r.setVentMode(VentMode.VCV);
  r.setMachine({ o2FlowLPerMin: 2, airFlowLPerMin: 2, setFiO2: 0.5, setTidalVolume: Math.round(7 * w), setRespiratoryRate: 12, vaporizerDial: 2 });
  step(r, 30);
  const preEtco2 = r.snapshot().etco2;
  assert.equal(r.activateCaseEvent({ eventId: 'mh_complication_started' }).ok, true);
  step(r, 120);
  const peak = r.snapshot();
  assert.ok(peak.etco2 > preEtco2 + 30, 'MH raises EtCO2 early');
  assert.ok(peak.temp > 37.5, 'MH raises temperature');
  r.setMachine({ vaporizerDial: 0, setRespiratoryRate: 20 });
  r.giveBolus('Dantrolene', 2.5 * w, 'dantrolene');
  step(r, 180);
  const treated = r.snapshot();
  assert.ok(treated.etco2 < peak.etco2, 'dantrolene plus stopping the trigger resolves MH');
  return { preEtco2, peakEtco2: peak.etco2, peakTemp: peak.temp, treatedEtco2: treated.etco2 };
}
const mh = runBrittanyTraining();
console.log('BRITTANY_TRAINING_MH:', JSON.stringify({
  preEtco2: mh.preEtco2.toFixed(1), peakEtco2: mh.peakEtco2.toFixed(1),
  peakTemp: mh.peakTemp.toFixed(1), treatedEtco2: mh.treatedEtco2.toFixed(1),
}));

console.log('CASE_EVIDENCE: PASS');
