/* Phase 2: the instructor-only teaching-beat control. Proves an instructor can
   fire a scheduled instructor event (bronchospasm) from the mounted console,
   and that the available instructor event ids and their metadata never reach
   the learner workspace projection or the learner transport snapshot. */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { SimRunner, VentMode } from '../ui/simRunner.js';
import { renderInstructorCaseMarkup, renderLearnerCaseMarkup } from '../../ui/liveCaseModel.js';
import { createLiveCaseController } from '../../ui/liveCaseView.js';
import { projectLearnerMonitorSnapshot } from '../../ui/liveSimTransport.js';

const KAREN = JSON.parse(readFileSync(new URL('../sim/scenarios/cn_preassessment_lap_chole_001.json', import.meta.url), 'utf8'));

function driveToInductionPhase() {
  const r = new SimRunner();
  r.loadCaseScenario({ scenario: KAREN });
  r.advanceCaseStage({ stage: 'interview' });
  r.performAssessmentAction({ actionId: 'ask_asthma_control' });
  r.advanceCaseStage({ stage: 'focused_exam' });
  r.performAssessmentAction({ actionId: 'exam_airway' });
  r.advanceCaseStage({ stage: 'findings_summary' });
  r.submitCaseFindings({ findingIds: ['mild_asthma', 'airway_assessed'] });
  r.advanceCaseStage({ stage: 'plan_submission' });
  r.submitCasePlan({
    selections: {
      disposition: 'proceed', asa_class: 'II', reactive_airway: 'sevoflurane_albuterol_ready',
      ponv_prophylaxis: 'multimodal', vte_prophylaxis: 'mechanical_scd', analgesia: 'multimodal_no_codeine',
    },
  });
  r.advanceCasePhase(); // preinduction -> induction_airway
  return r;
}

describe('instructor teaching-beat control', () => {
  test('the instructor projection exposes the fireable beat; the learner does not', () => {
    const r = driveToInductionPhase();
    const instructor = r.getInstructorCaseContext();
    expect(instructor.flowState.availableInstructorEventIds).toContain('bronchospasm_onset');

    const learner = r.getLearnerCaseContext();
    // The event id must not appear anywhere in the learner workspace projection.
    expect(JSON.stringify(learner)).not.toContain('bronchospasm_onset');
    expect(JSON.stringify(learner)).not.toContain('availableInstructorEventIds');
    // The learner flow state is limited to phase title and paused only.
    expect(Object.keys(learner.flowState ?? {}).sort()).toEqual(['currentPhaseTitle', 'paused']);
  });

  test('the instructor markup renders the beat button; the learner markup never does', () => {
    const r = driveToInductionPhase();
    const instructorMarkup = renderInstructorCaseMarkup(r.getInstructorCaseContext());
    expect(instructorMarkup.instructorEvents).toContain('data-case-event="bronchospasm_onset"');

    const learnerHtml = JSON.stringify(renderLearnerCaseMarkup(r.getLearnerCaseContext()));
    expect(learnerHtml).not.toContain('bronchospasm_onset');
    expect(learnerHtml).not.toContain('data-case-event');
  });

  test('the learner transport snapshot carries no case-event data', () => {
    const r = driveToInductionPhase();
    const learnerSnapshot = projectLearnerMonitorSnapshot(r.snapshot());
    expect(JSON.stringify(learnerSnapshot)).not.toContain('bronchospasm');
    expect(JSON.stringify(learnerSnapshot)).not.toContain('event');
  });

  test('instructor event METADATA (not just the id) never reaches the learner, before or after firing', () => {
    // Seed sentinels into the beat's answer-key channels and its guidance.
    const scenario = structuredClone(KAREN);
    scenario.id = 'cn_beat_metadata_probe';
    const beat = scenario.caseExperience.eventFlow.events.find((e) => e.id === 'bronchospasm_onset');
    beat.expectedResponses = ['ADVLEAK_EVENT_EXPECTED'];
    beat.unsafeResponses = ['ADVLEAK_EVENT_UNSAFE'];
    beat.effect.description = 'ADVLEAK_EFFECT_DESCRIPTION';
    const guidance = scenario.caseExperience.instructorGuide.considerations
      .find((c) => c.id === 'consider_bronchospasm_rescue');
    guidance.scoringGuidance = 'ADVLEAK_BEAT_GUIDANCE';
    guidance.redFlags = ['ADVLEAK_BEAT_REDFLAG'];

    const r = new SimRunner();
    r.loadCaseScenario({ scenario });
    r.advanceCaseStage({ stage: 'interview' });
    r.performAssessmentAction({ actionId: 'ask_asthma_control' });
    r.advanceCaseStage({ stage: 'focused_exam' });
    r.performAssessmentAction({ actionId: 'exam_airway' });
    r.advanceCaseStage({ stage: 'findings_summary' });
    r.submitCaseFindings({ findingIds: ['mild_asthma', 'airway_assessed'] });
    r.advanceCaseStage({ stage: 'plan_submission' });
    r.submitCasePlan({
      selections: {
        disposition: 'proceed', asa_class: 'II', reactive_airway: 'sevoflurane_albuterol_ready',
        ponv_prophylaxis: 'multimodal', vte_prophylaxis: 'mechanical_scd', analgesia: 'multimodal_no_codeine',
      },
    });
    r.advanceCasePhase(); // -> induction_airway, beat available

    const learnerClean = () => {
      const html = JSON.stringify(renderLearnerCaseMarkup(r.getLearnerCaseContext()))
        + JSON.stringify(r.getLearnerCaseContext());
      return (html.match(/ADVLEAK_[A-Z_]+/g) ?? []);
    };
    // Instructor CAN see it (probe is live).
    expect(JSON.stringify(r.getInstructorCaseContext())).toContain('ADVLEAK_EVENT_EXPECTED');
    // Learner sees none, before firing.
    expect(learnerClean()).toEqual([]);
    // Fire the beat, then re-check the learner surface.
    expect(r.activateCaseEvent({ eventId: 'bronchospasm_onset' })).toMatchObject({ ok: true });
    expect(learnerClean()).toEqual([]);
  });

  test('no instructor-only string reaches the learner through Brittany\'s training branch', () => {
    const BRITTANY = JSON.parse(readFileSync(new URL('../sim/scenarios/cn_preassessment_npo_mh_001.json', import.meta.url), 'utf8'));
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
    r.activateCaseBranch({ branchId: 'proceed_for_training' });

    // Harvest the real instructor-only strings that are NOT part of the learner corpus.
    const learnerCorpus = new Set();
    for (const f of BRITTANY.caseExperience.assessment.findings) learnerCorpus.add(f.learnerLabel);
    for (const a of BRITTANY.caseExperience.assessment.actions) learnerCorpus.add(a.prompt);
    const instructorOnly = [];
    for (const c of BRITTANY.caseExperience.instructorGuide.considerations) {
      for (const s of [c.scoringGuidance, ...(c.redFlags ?? []), c.expectedResponse]) {
        if (s && s.length > 12 && !learnerCorpus.has(s)) instructorOnly.push(s);
      }
    }
    expect(instructorOnly.length).toBeGreaterThan(4); // probe has material

    const phases = ['trigger_free_induction', 'difficult_airway', 'training_maintenance', 'training_emergence'];
    for (const target of phases) {
      r.advanceCasePhase();
      const learnerBlob = JSON.stringify(r.getLearnerCaseContext())
        + JSON.stringify(renderLearnerCaseMarkup(r.getLearnerCaseContext()));
      for (const secret of instructorOnly) {
        expect(learnerBlob, `leak of "${secret.slice(0, 30)}" at ${target}`).not.toContain(secret);
      }
    }
  });

  test('clicking the beat button fires the event and injects the complication', () => {
    class EvtEl {
      constructor(id = '') { this.id = id; this.dataset = {}; this.disabled = false; this.innerHTML = ''; this.textContent = ''; this.value = ''; this.listeners = new Map(); this.queryMap = {}; }

      addEventListener(t, fn) { const a = this.listeners.get(t) ?? []; a.push(fn); this.listeners.set(t, a); }

      removeEventListener() {}

      insertAdjacentHTML() {}

      emit(t, target = this) { for (const fn of this.listeners.get(t) ?? []) fn({ target, currentTarget: this }); }

      closest(sel) {
        const m = /^\[data-([a-z-]+)\]$/.exec(sel);
        if (!m) return null;
        const key = m[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        return Object.hasOwn(this.dataset, key) ? this : null;
      }

      querySelector() { return null; }

      querySelectorAll(s) { return this.queryMap[s] ?? []; }
    }
    const ids = [
      'live-case-workspace', 'live-case-status', 'live-case-notes', 'live-case-submit-findings',
      'live-case-submit-plan', 'live-case-instructor', 'live-case-current-phase', 'live-case-active-event',
      'live-case-pause', 'live-case-advance', 'live-case-branches', 'live-case-events',
      'live-case-considerations', 'live-case-history', 'live-case-print',
    ];
    const byId = Object.fromEntries(ids.map((id) => [id, new EvtEl(id)]));
    const regions = Object.fromEntries(['chart', 'interview', 'exam', 'findings', 'plan'].map((r) => [r, new EvtEl()]));
    const root = {
      querySelector(sel) {
        if (sel.startsWith('#')) return byId[sel.slice(1)] ?? null;
        const m = /^\[data-case-region-content="([a-z]+)"\]$/.exec(sel);
        return m ? regions[m[1]] ?? null : null;
      },
    };

    const runner = driveToInductionPhase();
    // Set up a ventilated intubated patient so bronchospasm has an airway to obstruct.
    const w = runner.config.weightKg;
    runner.setMachine({ o2FlowLPerMin: 2, airFlowLPerMin: 2, setFiO2: 0.5 });
    runner.giveBolus('Propofol', 2 * w, 'ind');
    runner.giveBolus('Rocuronium', 0.6 * w, 'nmb');
    runner.pause(); runner.stepFor(30);
    runner.intubate();
    runner.setVentMode(VentMode.VCV);
    runner.setMachine({ setTidalVolume: Math.round(7 * w), setRespiratoryRate: 12, setFiO2: 0.5 });
    runner.pause(); runner.stepFor(30);
    const beforePpeak = runner.snapshot().ppeak;

    const controller = createLiveCaseController({ runner, root });
    controller.render();
    // The instructor panel now holds a fireable beat button.
    const instructorPanel = byId['live-case-instructor'];
    const eventButton = new EvtEl();
    eventButton.dataset.caseEvent = 'bronchospasm_onset';
    // Fire the button through the instructor click handler (event delegation).
    instructorPanel.emit('click', eventButton);

    runner.pause(); runner.stepFor(20);
    const after = runner.snapshot();
    expect(after.ppeak).toBeGreaterThan(30);
    expect(after.ppeak).toBeGreaterThan(beforePpeak);
    expect(after.spo2).toBeLessThan(95);
  });
});
