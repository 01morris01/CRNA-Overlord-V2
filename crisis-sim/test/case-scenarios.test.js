/* Literal scenario-contract tests for the authored Carson-Newman teaching
   cases. Assert exact identity, the finding and rule ids the cases are built
   on, and that each case loads, normalizes, drives to finalization, and
   produces a debrief. Clinical provenance is in docs/case-clinical-sourcing.md.

   NOTE ON IDS: Karen's finding and rule ids were realigned to the real Case 07
   patient per operator direction (asthma-centric), superseding the composite
   ids in the original plan. See docs/case-design-scripts.md. */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { normalizeCaseExperience } from '../sim/scenario/caseContract.js';
import { SimRunner, VentMode } from '../ui/simRunner.js';

function loadScenario(name) {
  return JSON.parse(readFileSync(new URL(`../sim/scenarios/${name}.json`, import.meta.url), 'utf8'));
}

describe('Karen Whitfield — cn_preassessment_lap_chole_001', () => {
  const scenario = loadScenario('cn_preassessment_lap_chole_001');
  const exp = scenario.caseExperience;

  test('has the expected identity and procedure', () => {
    expect(scenario.id).toBe('cn_preassessment_lap_chole_001');
    expect(exp.learnerChart.patient.syntheticName).toBe('Karen Whitfield');
    expect(exp.learnerChart.scheduledProcedure.name).toBe('Laparoscopic cholecystectomy');
    expect(exp.learnerChart.patient.ageYears).toBe(32);
  });

  test('carries the realigned (asthma-centric) finding ids', () => {
    expect(exp.assessment.findings.map((f) => f.id)).toEqual([
      'mild_asthma', 'ponv_high_risk', 'ocp_vte_risk',
      'codeine_intolerance', 'airway_assessed', 'anesthetic_history_reviewed',
    ]);
  });

  test('carries the realigned plan rule ids', () => {
    expect(exp.planRequirements.rules.map((r) => r.id)).toEqual([
      'asa_ii_with_reason', 'reactive_airway_plan', 'multimodal_ponv_prophylaxis',
      'vte_prophylaxis', 'postoperative_pain_plan',
    ]);
  });

  test('the asthma bronchospasm beat is instructor-triggered (time-compressible) and injects Bronchospasm', () => {
    const beat = exp.eventFlow.events.find((e) => e.id === 'bronchospasm_onset');
    expect(beat.trigger.type).toBe('instructor');
    expect(beat.effect).toMatchObject({ type: 'inject_complication', complicationType: 'Bronchospasm' });
  });

  test('the disposition proceed route enters live simulation', () => {
    expect(exp.planRequirements.completionRoutes).toContainEqual(
      expect.objectContaining({ fieldId: 'disposition', equals: 'proceed', stage: 'live_simulation' }),
    );
  });

  test('normalizes without error', () => {
    expect(() => normalizeCaseExperience(exp)).not.toThrow();
  });

  test('loads, drives assessment through finalization, and produces a debrief', () => {
    const runner = new SimRunner();
    expect(runner.loadCaseScenario({ scenario })).toMatchObject({ ok: true });

    expect(runner.advanceCaseStage({ stage: 'interview' })).toMatchObject({ ok: true });
    for (const id of ['ask_asthma_control', 'ask_ponv_history', 'ask_contraceptive', 'ask_codeine']) {
      expect(runner.performAssessmentAction({ actionId: id })).toMatchObject({ ok: true });
    }
    expect(runner.advanceCaseStage({ stage: 'focused_exam' })).toMatchObject({ ok: true });
    expect(runner.performAssessmentAction({ actionId: 'exam_airway' })).toMatchObject({ ok: true });
    expect(runner.advanceCaseStage({ stage: 'findings_summary' })).toMatchObject({ ok: true });
    expect(runner.submitCaseFindings({
      findingIds: ['mild_asthma', 'ponv_high_risk', 'ocp_vte_risk', 'codeine_intolerance', 'airway_assessed'],
    })).toMatchObject({ ok: true });
    expect(runner.advanceCaseStage({ stage: 'plan_submission' })).toMatchObject({ ok: true });
    expect(runner.submitCasePlan({
      selections: {
        disposition: 'proceed', asa_class: 'II', reactive_airway: 'sevoflurane_albuterol_ready',
        ponv_prophylaxis: 'multimodal', vte_prophylaxis: 'mechanical_scd', analgesia: 'multimodal_no_codeine',
      },
    })).toMatchObject({ ok: true });
    expect(runner.getLearnerCaseContext().stage).toBe('live_simulation');
    expect(runner.advanceCaseStage({ stage: 'debrief_draft' })).toMatchObject({ ok: true });
    for (const c of exp.instructorGuide.considerations) {
      runner.setInstructorCaseObservation({ considerationId: c.id, status: 'observed' });
    }
    expect(runner.finalizeCaseDebrief()).toMatchObject({ ok: true });

    const debrief = runner.buildDebrief();
    expect(debrief.caseResult.caseId).toBe('cn_preassessment_lap_chole_001');
    expect(debrief.caseResult.outcome).toBe('completed');
    // The four discoverable interview findings plus the airway exam were performed.
    expect(debrief.caseResult.assessment.discoveredFindings.map((f) => f.id).sort()).toEqual([
      'airway_assessed', 'codeine_intolerance', 'mild_asthma', 'ocp_vte_risk', 'ponv_high_risk',
    ]);
    // Every plan rule scored.
    expect(debrief.caseResult.plan.ruleResults.every((r) => r.status !== 'pending')).toBe(true);
    // consider_airway_exam defaults to not-revealed and was never toggled, so it stays confidential.
    expect(debrief.caseResult.releasedFeedback.map((f) => f.considerationId)).not.toContain('consider_airway_exam');
  });

  test('the instructor can fire the bronchospasm beat live and the airway obstructs', () => {
    const runner = new SimRunner();
    runner.loadCaseScenario({ scenario });
    runner.advanceCaseStage({ stage: 'interview' });
    runner.performAssessmentAction({ actionId: 'ask_asthma_control' });
    runner.advanceCaseStage({ stage: 'focused_exam' });
    runner.performAssessmentAction({ actionId: 'exam_airway' });
    runner.advanceCaseStage({ stage: 'findings_summary' });
    runner.submitCaseFindings({ findingIds: ['mild_asthma', 'airway_assessed'] });
    runner.advanceCaseStage({ stage: 'plan_submission' });
    runner.submitCasePlan({
      selections: {
        disposition: 'proceed', asa_class: 'II', reactive_airway: 'sevoflurane_albuterol_ready',
        ponv_prophylaxis: 'multimodal', vte_prophylaxis: 'mechanical_scd', analgesia: 'multimodal_no_codeine',
      },
    });
    expect(runner.advanceCasePhase()).toMatchObject({ ok: true }); // preinduction -> induction_airway
    const w = runner.config.weightKg;
    runner.setMachine({ o2FlowLPerMin: 2, airFlowLPerMin: 2, setFiO2: 0.5 });
    runner.giveBolus('Propofol', 2 * w, 'induction');
    runner.giveBolus('Rocuronium', 0.6 * w, 'nmb');
    runner.pause(); runner.stepFor(30);
    runner.intubate();
    runner.setVentMode(VentMode.VCV);
    runner.setMachine({ setTidalVolume: Math.round(7 * w), setRespiratoryRate: 12, setFiO2: 0.5 });
    runner.pause(); runner.stepFor(30);
    const before = runner.snapshot().ppeak;
    expect(runner.activateCaseEvent({ eventId: 'bronchospasm_onset' })).toMatchObject({ ok: true });
    runner.pause(); runner.stepFor(20);
    const after = runner.snapshot();
    // Bronchospasm raises peak airway pressure well above the pre-beat value.
    expect(after.ppeak).toBeGreaterThan(30);
    expect(after.ppeak).toBeGreaterThan(before);
    expect(after.spo2).toBeLessThan(95);
  });
});

describe('Brittany Cole — cn_preassessment_npo_mh_001', () => {
  const scenario = loadScenario('cn_preassessment_npo_mh_001');
  const exp = scenario.caseExperience;

  test('has the expected identity and procedure', () => {
    expect(scenario.id).toBe('cn_preassessment_npo_mh_001');
    expect(exp.learnerChart.patient.syntheticName).toBe('Brittany Cole');
    expect(exp.learnerChart.scheduledProcedure.name).toBe('Knee arthroscopy');
  });

  test('carries the expected finding ids', () => {
    expect(exp.assessment.findings.map((f) => f.id)).toEqual([
      'heavy_breakfast_two_hours', 'family_history_mh', 'pregnancy_screen_needed',
      'predicted_difficult_airway', 'dental_injury_risk',
    ]);
  });

  test('carries the expected plan rule ids', () => {
    expect(exp.planRequirements.rules.map((r) => r.id)).toEqual([
      'asa_not_changed_by_npo', 'postpone_elective_case', 'escalate_mh_history',
      'trigger_free_plan', 'difficult_airway_plan', 'team_communication',
    ]);
  });

  test('ASA is not changed by NPO (rule checks ASA II)', () => {
    const rule = exp.planRequirements.rules.find((r) => r.id === 'asa_not_changed_by_npo');
    expect(rule.evidence).toMatchObject({ type: 'plan_equals', fieldId: 'asa_class', value: 'II' });
  });

  test('the proceed_for_training branch is instructor-only, labeled not recommended, and unreachable by plan selection', () => {
    const branch = exp.eventFlow.branches.find((b) => b.id === 'proceed_for_training');
    expect(branch).toBeDefined();
    expect(branch.instructorOnly).toBe(true);
    expect(branch.label).toMatch(/not the recommended/i);

    // A plan completion route may only lead to live_simulation or appropriately_deferred,
    // never directly into a training phase; the training branch is the only way in.
    const trainingPhaseIds = new Set([
      'training_preinduction', 'trigger_free_induction', 'difficult_airway',
      'training_maintenance', 'training_emergence',
    ]);
    for (const route of exp.planRequirements.completionRoutes) {
      expect(trainingPhaseIds.has(route.stage)).toBe(false);
    }
    // The branch is the only edge into the training subgraph.
    const edgesIntoTraining = exp.eventFlow.branches.filter((b) => trainingPhaseIds.has(b.toPhaseId));
    expect(edgesIntoTraining.every((b) => b.instructorOnly === true)).toBe(true);
    const entryEdges = edgesIntoTraining.filter((b) => !trainingPhaseIds.has(b.fromPhaseId));
    expect(entryEdges).toHaveLength(1);
    expect(entryEdges[0].id).toBe('proceed_for_training');
  });

  test('discloses the compressed MH timeline in instructor-facing metadata', () => {
    expect(Array.isArray(scenario.physiologyDisclosures)).toBe(true);
    const joined = scenario.physiologyDisclosures.join(' ');
    expect(joined).toMatch(/compressed approximately 5x|~5x|5x/i);
    expect(joined).toMatch(/EtCO2.*early|EtCO2 rises.*before temperature|sign ordering/i);
    // The one-line description an instructor reads also carries the disclosure.
    expect(scenario.description).toMatch(/compressed approximately 5x|DISCLOSURE/i);
  });

  test('the MH beat is instructor-triggered and injects MalignantHyperthermia', () => {
    const mh = exp.eventFlow.events.find((e) => e.id === 'mh_complication_started');
    expect(mh.trigger.type).toBe('instructor');
    expect(mh.effect).toMatchObject({ type: 'inject_complication', complicationType: 'MalignantHyperthermia' });
  });

  test('normalizes without error', () => {
    expect(() => normalizeCaseExperience(exp)).not.toThrow();
  });

  test('primary path: discover, postpone, and finalize as appropriately deferred', () => {
    const runner = new SimRunner();
    expect(runner.loadCaseScenario({ scenario })).toMatchObject({ ok: true });
    expect(runner.advanceCaseStage({ stage: 'interview' })).toMatchObject({ ok: true });
    for (const id of ['ask_last_meal', 'ask_family_anesthesia', 'ask_pregnancy']) {
      expect(runner.performAssessmentAction({ actionId: id })).toMatchObject({ ok: true });
    }
    expect(runner.advanceCaseStage({ stage: 'focused_exam' })).toMatchObject({ ok: true });
    expect(runner.performAssessmentAction({ actionId: 'exam_airway' })).toMatchObject({ ok: true });
    expect(runner.performAssessmentAction({ actionId: 'exam_dentition' })).toMatchObject({ ok: true });
    expect(runner.advanceCaseStage({ stage: 'findings_summary' })).toMatchObject({ ok: true });
    expect(runner.submitCaseFindings({
      findingIds: ['heavy_breakfast_two_hours', 'family_history_mh', 'pregnancy_screen_needed', 'predicted_difficult_airway', 'dental_injury_risk'],
    })).toMatchObject({ ok: true });
    expect(runner.advanceCaseStage({ stage: 'plan_submission' })).toMatchObject({ ok: true });
    expect(runner.submitCasePlan({
      selections: {
        disposition: 'postpone', asa_class: 'II', mh_management: 'escalate_trigger_free',
        trigger_free_technique: 'no_sux_no_volatile', airway_readiness: 'difficult_airway_prepared',
        team_communication: 'notify_team',
      },
    })).toMatchObject({ ok: true });
    expect(runner.getLearnerCaseContext().stage).toBe('appropriately_deferred');
    expect(runner.advanceCaseStage({ stage: 'debrief_draft' })).toMatchObject({ ok: true });
    for (const c of exp.instructorGuide.considerations) {
      runner.setInstructorCaseObservation({ considerationId: c.id, status: 'observed' });
    }
    expect(runner.finalizeCaseDebrief()).toMatchObject({ ok: true });
    const debrief = runner.buildDebrief();
    expect(debrief.caseResult.outcome).toBe('appropriately_deferred');
    expect(debrief.caseResult.plan.ruleResults.find((r) => r.id === 'postpone_elective_case').status).toBe('performed');
  });

  test('training branch: instructor drives MH and dantrolene resolves it', () => {
    const runner = new SimRunner();
    runner.loadCaseScenario({ scenario });
    runner.advanceCaseStage({ stage: 'interview' });
    runner.performAssessmentAction({ actionId: 'ask_family_anesthesia' });
    runner.advanceCaseStage({ stage: 'focused_exam' });
    runner.performAssessmentAction({ actionId: 'exam_airway' });
    runner.advanceCaseStage({ stage: 'findings_summary' });
    runner.submitCaseFindings({ findingIds: ['family_history_mh', 'predicted_difficult_airway'] });
    runner.advanceCaseStage({ stage: 'plan_submission' });
    runner.submitCasePlan({
      selections: {
        disposition: 'postpone', asa_class: 'II', mh_management: 'escalate_trigger_free',
        trigger_free_technique: 'no_sux_no_volatile', airway_readiness: 'difficult_airway_prepared',
        team_communication: 'notify_team',
      },
    });
    expect(runner.activateCaseBranch({ branchId: 'proceed_for_training' })).toMatchObject({ ok: true });
    expect(runner.advanceCasePhase()).toMatchObject({ ok: true }); // trigger_free_induction
    expect(runner.advanceCasePhase()).toMatchObject({ ok: true }); // difficult_airway
    expect(runner.advanceCasePhase()).toMatchObject({ ok: true }); // training_maintenance
    const w = runner.config.weightKg;
    runner.giveBolus('Propofol', 2 * w, 'ind');
    runner.giveBolus('Rocuronium', 0.6 * w, 'nmb');
    runner.pause(); runner.stepFor(30);
    runner.intubate();
    runner.setVentMode(VentMode.VCV);
    runner.setMachine({ o2FlowLPerMin: 2, airFlowLPerMin: 2, setFiO2: 0.5, setTidalVolume: Math.round(7 * w), setRespiratoryRate: 12, vaporizerDial: 2 });
    runner.pause(); runner.stepFor(30);
    const pre = runner.snapshot().etco2;
    expect(runner.activateCaseEvent({ eventId: 'mh_complication_started' })).toMatchObject({ ok: true });
    runner.pause(); runner.stepFor(120);
    const peak = runner.snapshot();
    expect(peak.etco2).toBeGreaterThan(pre + 30); // hypercarbia is the early MH sign
    // treat: stop trigger and give dantrolene
    runner.setMachine({ vaporizerDial: 0, setRespiratoryRate: 20 });
    runner.giveBolus('Dantrolene', 2.5 * w, 'dantrolene');
    runner.pause(); runner.stepFor(180);
    expect(runner.snapshot().etco2).toBeLessThan(peak.etco2);
  });
});
