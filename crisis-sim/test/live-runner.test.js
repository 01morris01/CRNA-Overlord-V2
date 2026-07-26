import { describe, expect, it } from 'vitest';
import emergenceRubric from '../../data/rubrics/carson-newman-anesthesia-emergence.json';
import rsiRubric from '../../data/rubrics/carson-newman-rsi-induction.json';
import emergenceScenario from '../sim/scenarios/emergence_residual_block_001.json';
import { SimRunner, VentMode } from '../ui/simRunner.js';

function advance(runner, seconds) {
  runner.core.stepFor(seconds);
  runner.simTime = runner.core.simTime;
  return runner.snapshot();
}

describe('live SimRunner integration', () => {
  it('preserves the frozen no-case action fingerprint', () => {
    const runner = new SimRunner();
    runner.giveBolus('Propofol', 140);
    runner.pause();
    runner.setAirwayDevice('intubated');
    runner.setMachine({
      mode: VentMode.VCV,
      setFiO2: 1,
      setTidalVolume: 500,
      setRespiratoryRate: 12,
      setPeep: 5,
    });
    runner.stepFor(1);
    const snapshot = runner.snapshot();

    expect({
      coreTick: runner.core.tickCount,
      simTime: runner.simTime,
      ppfA1: runner.d._ppfA1,
      hr: snapshot.hr,
      sbp: snapshot.sbp,
      dbp: snapshot.dbp,
      spo2: snapshot.spo2,
      rr: snapshot.rr,
      etco2: snapshot.etco2,
      airway: snapshot.airwayDevice,
      mode: snapshot.ventMode,
      log: runner.log.map((entry) => entry.meta?.action),
    }).toEqual({
      coreTick: 50,
      simTime: 0.9999999776482582,
      ppfA1: 138.5626220703125,
      hr: 71.99114227294922,
      sbp: 119.92874145507812,
      dbp: 79.96990966796875,
      spo2: 97.57184600830078,
      rr: 12,
      etco2: 38.058746337890625,
      airway: 'intubated',
      mode: VentMode.VCV,
      log: ['drug'],
    });
    expect(runner.getLearnerCaseContext()).toBeNull();
    expect(runner.getInstructorCaseContext()).toBeNull();
  });

  it('seals finalized rubric evidence against later stepping and action projection', () => {
    const runner = new SimRunner();
    runner.loadRubricScenario({ scenario: emergenceScenario, rubric: emergenceRubric });
    for (const item of runner.getRubricStatus().items) {
      if (item.scoringSource === 'INSTRUCTOR_OBSERVED') {
        runner.setInstructorScore({ itemId: item.id, points: 2 });
      }
    }
    expect(runner.finalizeRubric()).toMatchObject({ ok: true, finalized: true });
    const sealed = runner.getRubricStatus();
    const sealedTrace = JSON.stringify(sealed.trace);
    const sealedLedger = JSON.stringify(sealed.actionLedger);

    expect(() => runner.stepFor(1)).not.toThrow();
    expect(() => runner.giveBolus('Propofol', 140, 'post-finalization probe')).not.toThrow();
    expect(() => runner.setInstructorNmbTarget({ targetTofRatio: 0.7 })).not.toThrow();
    expect(runner.getRubricStatus()).toBe(sealed);
    expect(JSON.stringify(sealed.trace)).toBe(sealedTrace);
    expect(JSON.stringify(sealed.actionLedger)).toBe(sealedLedger);
  });

  it('attaches a rubric session with a compact initial trace at exact t=0', () => {
    const runner = new SimRunner();

    const session = runner.attachRubricSession({
      rubric: emergenceRubric,
      criteria: { weightKg: 70 },
    });

    expect(runner.rubricSession).toBe(session);
    expect(session.getLiveResult().trace).toEqual([
      expect.objectContaining({
        t: 0,
        airwayDevice: 'mask',
        ventSetFiO2: expect.any(Number),
        activeAnestheticInfusions: [],
      }),
    ]);
    expect(Object.getPrototypeOf(session.getLiveResult().trace[0])).toBe(Object.prototype);
  });

  it('allows rubric-session replacement only before the first fixed step', () => {
    const runner = new SimRunner();
    const first = runner.attachRubricSession({
      rubric: emergenceRubric,
      criteria: { weightKg: 70 },
    });

    const replacement = runner.attachRubricSession({
      rubric: rsiRubric,
      criteria: { weightKg: 70 },
    });

    expect(replacement).not.toBe(first);
    expect(runner.rubricSession).toBe(replacement);
    expect(replacement.getLiveResult().trace.map(({ t }) => t)).toEqual([0]);
  });

  it('rejects first-time late attachment without installing a session', () => {
    const runner = new SimRunner();
    runner.stepFor(0.02);

    expect(() => runner.attachRubricSession({
      rubric: emergenceRubric,
      criteria: { weightKg: 70 },
    })).toThrow(/before simulation advance/i);
    expect(runner.rubricSession).toBeNull();
  });

  it('rejects late replacement without mutating the existing rubric session', () => {
    const runner = new SimRunner();
    const existing = runner.attachRubricSession({
      rubric: emergenceRubric,
      criteria: { weightKg: 70 },
    });
    runner.stepFor(0.02);
    const resultBefore = existing.getLiveResult();

    expect(() => runner.attachRubricSession({
      rubric: rsiRubric,
      criteria: { weightKg: 70 },
    })).toThrow(/before simulation advance/i);
    expect(runner.rubricSession).toBe(existing);
    expect(existing.getLiveResult()).toBe(resultBefore);
  });

  it('rejects unaligned deterministic advances and stepping during realtime execution', () => {
    const runner = new SimRunner();

    expect(() => runner.stepFor(0.01)).toThrow(/fixed-step aligned/i);
    expect(runner.core.tickCount).toBe(0);
    expect(() => runner.stepFor(0.02)).not.toThrow();
    expect(runner.core.tickCount).toBe(1);

    runner.start();
    expect(() => runner.stepFor(0.02)).toThrow(/realtime runner is active/i);
    expect(runner.core.tickCount).toBe(1);
    runner.pause();
  });

  it('samples byte-identical one-second evidence through uneven and continuous advances', () => {
    function run(chunks) {
      const runner = new SimRunner();
      const session = runner.attachRubricSession({
        rubric: emergenceRubric,
        criteria: { weightKg: 70 },
      });
      runner.setForcedApnea(true);
      runner.deliverMaskVentilation({
        durationSeconds: 2.5,
        tidalVolumeMl: 500,
        respiratoryRate: 12,
      });
      runner.pause();
      for (const seconds of chunks) runner.stepFor(seconds);
      return session.getLiveResult().trace;
    }

    const continuous = run([2.5]);
    const uneven = run([0.38, 0.62, 0.46, 1.04]);

    expect(continuous.map(({ t }) => t)).toEqual([0, 1, 2]);
    expect(continuous[1]).toMatchObject({ mechanicalMV: 6, effectiveMV: 6 });
    expect(continuous[2]).toMatchObject({ mechanicalMV: 6, effectiveMV: 6 });
    expect(JSON.stringify(uneven)).toBe(JSON.stringify(continuous));
  });

  it('keeps combined mid-PPV and mid-attempt trace evidence chunk-independent', () => {
    function run({ ppvChunks, attemptChunks }) {
      const runner = new SimRunner();
      const session = runner.attachRubricSession({
        rubric: rsiRubric,
        criteria: { weightKg: 70 },
      });
      runner.setForcedApnea(true);
      runner.deliverMaskVentilation({
        durationSeconds: 1.2,
        tidalVolumeMl: 500,
        respiratoryRate: 12,
      });
      runner.pause();
      for (const seconds of ppvChunks) runner.stepFor(seconds);
      runner.configureIntubationAttempts({ attemptDurationSeconds: 1.2 });
      runner.attemptIntubation();
      for (const seconds of attemptChunks) runner.stepFor(seconds);
      return session.getLiveResult().trace;
    }

    const continuous = run({ ppvChunks: [1.2], attemptChunks: [1.3] });
    const uneven = run({ ppvChunks: [0.38, 0.82], attemptChunks: [0.46, 0.84] });

    expect(continuous.map(({ t }) => t)).toEqual([0, 1, 2]);
    expect(continuous[1]).toMatchObject({ mechanicalMV: 6, effectiveMV: 6 });
    expect(continuous[2]).toMatchObject({
      airwayDevice: 'mask', intubationAttemptCount: 1, mechanicalMV: 0,
    });
    expect(JSON.stringify(uneven)).toBe(JSON.stringify(continuous));
  });

  it('captures integer trace samples while an intubation attempt is in progress', () => {
    const runner = new SimRunner();
    const session = runner.attachRubricSession({
      rubric: rsiRubric,
      criteria: { weightKg: 70 },
    });
    runner.configureIntubationAttempts({ attemptDurationSeconds: 2.5 });
    runner.attemptIntubation();
    runner.pause();

    runner.stepFor(2.5);

    expect(session.getLiveResult().trace.map(({ t }) => t)).toEqual([0, 1, 2]);
    expect(session.getLiveResult().trace[1]).toMatchObject({
      airwayDevice: 'mask', intubationAttemptCount: 1, mechanicalMV: 0,
    });
    expect(session.getLiveResult().trace[2]).toMatchObject({
      airwayDevice: 'mask', intubationAttemptCount: 1, mechanicalMV: 0,
    });
  });

  it('samples the same fixed trace from the production wall-clock tick loop', () => {
    const runner = new SimRunner();
    const session = runner.attachRubricSession({
      rubric: emergenceRubric,
      criteria: { weightKg: 70 },
    });
    runner.running = true;
    runner._lastReal = 0;

    runner._tick(500);
    runner._tick(1000);

    expect(session.getLiveResult().trace.map(({ t }) => t)).toEqual([0, 1]);
    runner.pause();
  });

  it('records normalized clinical actions with immediate snapshots and procedure timestamps', () => {
    const runner = new SimRunner();
    const session = runner.attachRubricSession({
      rubric: rsiRubric,
      criteria: { weightKg: 70 },
    });

    runner.preoxygenate();
    runner.setMachine({
      setFiO2: 1,
      setTidalVolume: 500,
      setRespiratoryRate: 12,
      o2FlowLPerMin: 10,
    });
    runner.setVentMode(VentMode.VCV);
    runner.setVolatile({ agent: 'Sevoflurane', dialPercent: 2 });
    runner.giveBolus('Propofol', 140, 'Propofol 140 mg');
    runner.checkTrainOfFour();
    runner.applyCricoidPressure();
    runner.deliverMaskVentilation({ durationSeconds: 1 });
    runner.pause();
    runner.stepFor(1);
    runner.configureIntubationAttempts({ attemptDurationSeconds: 1 });
    runner.attemptIntubation();
    runner.stepFor(1);
    runner.confirmEtco2();
    runner.releaseCricoidPressure();
    runner.assessSpontaneousVentilation();
    runner.extubate();

    const ledger = session.getLiveResult().actionLedger;
    const canonical = ledger.map(({ action }) => action);
    expect(canonical).toEqual([
      'machine_settings_changed',
      'preoxygenate',
      'machine_settings_changed',
      'vent_mode_changed',
      'volatile_changed',
      'drug',
      'tof_checked',
      'cricoid_pressure_applied',
      'mask_ppv_started',
      'mask_ppv_completed',
      'intubation_attempt_started',
      'intubation_attempt_succeeded',
      'confirm_etco2',
      'cricoid_pressure_released',
      'spontaneous_ventilation_assessed',
      'extubate',
    ]);
    for (const action of ledger) {
      expect(action.snapshot).toEqual(expect.objectContaining({
        t: expect.any(Number),
        airwayDevice: expect.any(String),
        ventSetFiO2: expect.any(Number),
      }));
    }
    const completedLog = runner.log.find(
      (entry) => entry.meta?.action === 'mask_ppv_completed',
    );
    const completedAction = ledger.find(({ action }) => action === 'mask_ppv_completed');
    expect(completedAction.tSec).toBe(completedLog.t);
    expect(completedAction.tSec).toBe(1);
    expect(ledger.find(({ action }) => action === 'intubation_attempt_succeeded').tSec)
      .toBe(2);
    expect(ledger.find(({ action }) => action === 'vent_mode_changed').meta)
      .toMatchObject({ mode: VentMode.VCV });
    expect(ledger.find(({ action }) => action === 'drug').snapshot.activeAnestheticInfusions)
      .toEqual([]);
  });

  it('records a failed attempt at the exact procedure timestamp with a matching snapshot', () => {
    const runner = new SimRunner();
    const session = runner.attachRubricSession({
      rubric: rsiRubric,
      criteria: { weightKg: 70 },
    });
    runner.configureIntubationAttempts({
      failedIntubationAttempts: [1],
      attemptDurationSeconds: 1,
    });
    runner.attemptIntubation();
    runner.pause();

    runner.stepFor(1);

    const procedureEvent = runner.log.find(
      (entry) => entry.meta?.action === 'intubation_attempt_failed',
    );
    const action = session.getLiveResult().actionLedger.find(
      (entry) => entry.action === 'intubation_attempt_failed',
    );
    expect(procedureEvent.t).toBe(1);
    expect(action).toMatchObject({
      tSec: procedureEvent.t,
      meta: { attemptNumber: 1, outcome: 'failed' },
      snapshot: { t: procedureEvent.t, airwayDevice: 'mask', intubationAttemptCount: 1 },
    });
  });

  it('preserves legacy machine logs while projecting machine actions only into a rubric session', () => {
    const legacy = new SimRunner();
    legacy.setMachine({ setFiO2: 0.8 });
    expect(legacy.log).toEqual([]);

    legacy.preoxygenate();
    expect(legacy.log.map((entry) => entry.meta?.action)).toEqual(['preoxygenate']);

    const scored = new SimRunner();
    const session = scored.attachRubricSession({
      rubric: rsiRubric,
      criteria: { weightKg: 70 },
    });
    scored.setMachine({ setFiO2: 0.8 });
    scored.preoxygenate();

    expect(scored.log.map((entry) => entry.meta?.action)).toEqual(['preoxygenate']);
    expect(session.getLiveResult().actionLedger.map(({ action }) => action)).toEqual([
      'machine_settings_changed',
      'machine_settings_changed',
      'preoxygenate',
    ]);
  });

  it('keeps rubric drivers inert without a session and administrative airway setup unscoreable', () => {
    const runner = new SimRunner();

    expect(() => runner.assessSpontaneousVentilation()).not.toThrow();
    expect(() => runner.confirmEtco2()).not.toThrow();
    expect(runner.setAirwayDevice('intubated')).toMatchObject({ ok: true });
    expect(runner.rubricSession).toBeNull();

    const scored = new SimRunner();
    const session = scored.attachRubricSession({
      rubric: rsiRubric,
      criteria: { weightKg: 70 },
    });
    expect(scored.setAirwayDevice('intubated')).toMatchObject({ ok: true });
    expect(session.getLiveResult().actionLedger.filter(
      ({ action }) => action.startsWith('intubation_attempt_'),
    )).toEqual([]);
  });

  it('defensively copies compact anesthetic-infusion evidence', () => {
    const runner = new SimRunner();
    runner.d.startInfusion('Propofol', 300);
    runner.d.startInfusion('Fentanyl', 0.1);
    runner.d.startInfusion('Rocuronium', 20);
    const session = runner.attachRubricSession({
      rubric: emergenceRubric,
      criteria: { weightKg: 70 },
    });

    const full = runner.snapshot();
    const compact = runner.compactRubricSnapshot();
    expect(full.activeAnestheticInfusions).toEqual([{ drug: 'Propofol', rate: 300 }]);
    expect(compact.activeAnestheticInfusions).toEqual([{ drug: 'Propofol', rate: 300 }]);
    full.activeAnestheticInfusions[0].rate = -1;
    compact.activeAnestheticInfusions[0].rate = -2;

    expect(runner.d.activeInfusions.find(({ drugName }) => drugName === 'Propofol').ratePerHour)
      .toBe(300);
    expect(session.getLiveResult().trace[0].activeAnestheticInfusions)
      .toEqual([{ drug: 'Propofol', rate: 300 }]);
  });

  it('starts physiologic time when the first READY dose is administered', () => {
    const runner = new SimRunner();

    expect(runner.getLifecycleState()).toBe('READY');
    const result = runner.giveBolus('Propofol', 140, 'Propofol 2 mg/kg · 140 mg total');

    expect(result).toEqual({ state: 'READY', started: true, queued: false });
    expect(runner.getLifecycleState()).toBe('RUNNING');
    expect(runner.snapshot()).toMatchObject({ running: true, lifecycle: 'RUNNING' });
    expect(runner.log.at(-1)).toMatchObject({
      t: 0, kind: 'Drug', meta: { action: 'drug', drug: 'Propofol', doseMg: 140 },
    });
  });

  it('continues a RUNNING dose and queues a PAUSED dose without advancing time', () => {
    const runner = new SimRunner();
    runner.start();

    expect(runner.giveBolus('Rocuronium', 42, 'Rocuronium 0.6 mg/kg')).toEqual({
      state: 'RUNNING', started: false, queued: false,
    });
    runner.core.stepFor(1);
    runner.simTime = runner.core.simTime;
    runner.pause();
    const frozenTime = runner.simTime;

    expect(runner.getLifecycleState()).toBe('PAUSED');
    expect(runner.giveBolus('Propofol', 20, 'Propofol 20 mg')).toEqual({
      state: 'PAUSED', started: false, queued: true,
    });
    expect(runner.simTime).toBe(frozenTime);
    expect(runner.getLifecycleState()).toBe('PAUSED');
  });

  it('starts preoxygenation from READY without recording a drug', () => {
    const runner = new SimRunner();

    const result = runner.preoxygenate();

    expect(result).toEqual({ state: 'READY', started: true });
    expect(runner.getLifecycleState()).toBe('RUNNING');
    expect(runner.v).toMatchObject({
      o2FlowLPerMin: 10, airFlowLPerMin: 0, n2oFlowLPerMin: 0, setFiO2: 1,
    });
    expect(runner.log.filter((entry) => entry.kind === 'Drug')).toEqual([]);
    expect(runner.log.at(-1)).toMatchObject({
      kind: 'Machine', meta: { action: 'preoxygenate' },
    });
  });

  it('can apply patient configuration in the Node verification environment', () => {
    const runner = new SimRunner();

    expect(() => runner.applyConfig({ weightKg: 80 })).not.toThrow();
    expect(runner.config.weightKg).toBe(80);
  });

  it('exposes existing machine settings for the read-only display', () => {
    const runner = new SimRunner();
    runner.setMachine({
      setTidalVolume: 560,
      setRespiratoryRate: 14,
      setPeep: 7,
      setPressureAbovePeep: 18,
      setPressureSupport: 12,
      o2FlowLPerMin: 6,
      airFlowLPerMin: 2,
      n2oFlowLPerMin: 1,
    });

    expect(runner.snapshot()).toMatchObject({
      ventSetTV: 560,
      ventSetRR: 14,
      ventSetPeep: 7,
      ventSetPressure: 18,
      ventSetPressureSupport: 12,
      o2Flow: 6,
      airFlow: 2,
      n2oFlow: 1,
    });
  });

  it('sets only supported volatile inputs and logs the fixed-step action', () => {
    const runner = new SimRunner();

    expect(runner.setVolatile({ agent: 'Desflurane', dialPercent: 6 })).toMatchObject({
      ok: true, agent: 'Desflurane', dialPercent: 6,
    });
    expect(runner.snapshot()).toMatchObject({ vaporizerAgent: 'Desflurane', vaporizer: 6 });
    expect(runner.log.at(-1)).toMatchObject({
      t: 0,
      meta: { action: 'volatile_changed', agent: 'Desflurane', dialPercent: 6 },
    });
    const acceptedLogLength = runner.log.length;
    expect(runner.setVolatile({ agent: 'Ether', dialPercent: 2 })).toEqual({
      ok: false, reason: 'unsupported volatile agent: Ether',
    });
    expect(runner.log).toHaveLength(acceptedLogLength);
    expect(runner.snapshot()).toMatchObject({ vaporizerAgent: 'Desflurane', vaporizer: 6 });
    runner.setVolatile({ agent: 'Desflurane', dialPercent: 0 });
    expect(runner.snapshot()).toMatchObject({ vaporizerAgent: 'Desflurane', vaporizer: 0 });
  });

  it.each([
    ['Sevoflurane', 2],
    ['Desflurane', 6],
  ])('derives end-tidal concentration and MAC after setting %s', (agent, dialPercent) => {
    const runner = new SimRunner();
    runner.setVolatile({ agent, dialPercent });

    const snapshot = advance(runner, 30);

    expect(snapshot.etAgent).toBeGreaterThan(0);
    expect(snapshot.mac).toBeGreaterThan(0);
    expect(snapshot.agent).toBe(agent);
  });

  it('checks TOF without changing any neuromuscular state', () => {
    const runner = new SimRunner();
    runner.giveBolus('Rocuronium', 42, 'Rocuronium 42 mg');
    runner.core.stepFor(120);
    runner.simTime = runner.core.simTime;
    const before = runner.snapshot();
    const fingerprintBefore = {
      effectiveNmbBlockade: before.effectiveNmbBlockade,
      tof: before.tof,
      tofRatio: before.tofRatio,
      respiratoryMuscleCapability: before.respiratoryMuscleCapability,
      spontaneousEffort: before.spontaneousEffort,
    };

    const record = runner.checkTrainOfFour();
    const after = runner.snapshot();

    expect(record).toMatchObject({
      count: before.tof,
      ratio: before.tofRatio,
      tSec: before.t,
      nmbSource: 'rocuronium',
      airwayDevice: 'mask',
    });
    expect({
      effectiveNmbBlockade: after.effectiveNmbBlockade,
      tof: after.tof,
      tofRatio: after.tofRatio,
      respiratoryMuscleCapability: after.respiratoryMuscleCapability,
      spontaneousEffort: after.spontaneousEffort,
    }).toEqual(fingerprintBefore);
    expect(after.tofCheckHistory).toEqual([record]);
    expect(runner.log.at(-1).meta.action).toBe('tof_checked');

    record.count = 4;
    expect(runner.snapshot().tofCheckHistory[0].count).toBe(before.tof);
  });

  it('delegates bronchospasm to the existing complication state machine and treatment path', () => {
    const runner = new SimRunner();

    const result = runner.injectComplication('Bronchospasm');
    const affected = advance(runner, 5);
    const peakResistance = affected.airwayRes;

    expect(result).toEqual({ ok: true, type: 'Bronchospasm' });
    expect(peakResistance).toBeGreaterThan(1);
    expect(affected.shunt).toBeGreaterThan(0);

    runner.giveBolus('Albuterol', 1, 'Albuterol 1 mg');
    const treated = advance(runner, 90);

    expect(treated.airwayRes).toBeLessThan(peakResistance);
    expect(runner.log.some((entry) => entry.meta?.action === 'complication')).toBe(true);
  });

  it('wires live administrative LAST into the same Lidocaine system', () => {
    const runner = new SimRunner();

    runner.injectComplication('LocalAnestheticToxicity');

    expect(runner.l).toBe(runner.s.lidocaineSystem);
    expect(runner.l.plasmaTotalMcgMl).toBeCloseTo(10, 4);
    expect(runner.s.eventLog.some((entry) => entry.includes('last_exposure_injected'))).toBe(true);
  });

  it('exposes the approved Lidocaine, stimulus, irritability, and lipid action surface', () => {
    const runner = new SimRunner();

    expect(runner.giveLidocaineBolus({ doseMgPerKg: 1.5 })).toMatchObject({
      ok: true, state: 'READY', started: true, queued: false, doseMgPerKg: 1.5,
    });
    runner.core.stepFor(1);
    runner.simTime = runner.core.simTime;
    runner.pause();
    const pausedAt = runner.simTime;
    expect(runner.startLidocaineInfusion({ rateMgPerKgHour: 1.5 })).toMatchObject({
      ok: true, state: 'PAUSED', started: false, queued: true, rateMgPerKgHour: 1.5,
    });
    expect(runner.startLidocaineInfusion({ rateMgPerKgHour: 2 })).toMatchObject({
      ok: true, changed: true, rateMgPerKgHour: 2,
    });
    expect(runner.simTime).toBe(pausedAt);
    expect(runner.stopLidocaineInfusion()).toMatchObject({ ok: true, changed: true });
    expect(runner.administerRegionalLidocaine({
      route: 'peripheral', concentrationPercent: 1.5, volumeMl: 20, epinephrine: false,
    })).toMatchObject({ ok: true, totalDoseMg: 300, doseLimitStatus: 'within_limit' });
    const stimulus = runner.setSurgicalStimulus(0.8);
    const irritability = runner.setVentricularIrritability(0.7);
    expect(stimulus).toMatchObject({ ok: true });
    expect(stimulus.value).toBeCloseTo(0.8, 6);
    expect(irritability).toMatchObject({ ok: true });
    expect(irritability.value).toBeCloseTo(0.7, 6);
    expect(runner.giveLipidEmulsionBolus()).toMatchObject({
      ok: true, doseMlKg: 1.5, deliveredMlKg: 1.5,
    });
    expect(runner.startLipidEmulsionInfusion()).toMatchObject({
      ok: true, rateMlKgMin: 0.25,
    });
    expect(runner.startLipidEmulsionInfusion()).toMatchObject({
      ok: true, rateMlKgMin: 0.5,
    });
    expect(runner.stopLipidEmulsionInfusion()).toMatchObject({ ok: true, changed: true });

    expect(runner.log.map((entry) => entry.meta?.action).filter(Boolean)).toEqual([
      'lidocaine_iv_bolus',
      'lidocaine_infusion_started',
      'lidocaine_infusion_rate_changed',
      'lidocaine_infusion_stopped',
      'regional_lidocaine_administered',
      'surgical_stimulus_changed',
      'ventricular_irritability_changed',
      'lipid_emulsion_bolus',
      'lipid_emulsion_infusion_started',
      'lipid_emulsion_infusion_rate_doubled',
      'lipid_emulsion_infusion_stopped',
    ]);
  });

  it('rejects invalid Lidocaine inputs without changing state or action log', () => {
    const runner = new SimRunner();
    const before = runner.snapshot();
    const logLength = runner.log.length;

    expect(runner.stopLidocaineInfusion()).toMatchObject({ ok: true, changed: false });
    expect(runner.stopLipidEmulsionInfusion()).toMatchObject({ ok: true, changed: false });

    expect(runner.giveLidocaineBolus({ doseMgPerKg: -1 })).toEqual({
      ok: false, reason: 'doseMgPerKg must be a positive finite number',
    });
    expect(runner.administerRegionalLidocaine({
      route: 'bier', concentrationPercent: 1, volumeMl: 10, epinephrine: false,
    })).toEqual({ ok: false, reason: 'unsupported regional Lidocaine route: bier' });
    expect(runner.setSurgicalStimulus(2)).toEqual({
      ok: false, reason: 'surgical stimulus must be a finite number between 0 and 1',
    });

    expect(runner.log).toHaveLength(logLength);
    expect(runner.getLifecycleState()).toBe('READY');
    expect(runner.snapshot()).toMatchObject({
      lidocaineCumulativeMg: before.lidocaineCumulativeMg,
      surgicalStimulusRaw: before.surgicalStimulusRaw,
    });
  });

  it('returns copied Lidocaine histories in the live snapshot', () => {
    const runner = new SimRunner();
    runner.administerRegionalLidocaine({
      route: 'epidural', concentrationPercent: 2, volumeMl: 20, epinephrine: false,
    });
    const snapshot = runner.snapshot();
    snapshot.lidocaineRegionalHistory[0].remainingMg = -1;
    snapshot.lidocaineDoseHistory.push({ type: 'invented' });

    expect(runner.snapshot().lidocaineRegionalHistory[0].remainingMg).toBe(400);
    expect(runner.snapshot().lidocaineDoseHistory).toEqual([]);
  });

  it('rejects a complication with no existing engine state machine', () => {
    const runner = new SimRunner();

    expect(() => runner.injectComplication('InventedCrisis')).toThrow(/Unsupported complication/);
  });

  it('builds a live debrief with respiratory and Lidocaine attribution', () => {
    const runner = new SimRunner();
    runner.setForcedApnea(true);
    advance(runner, 1);

    const result = runner.buildDebrief();

    expect(Object.keys(result).sort()).toEqual([
      'courseUnit', 'criticalActionsCompleted', 'criticalActionsMissed',
      'dangerousActions', 'durationSec', 'maxPoints', 'rawPoints',
      'lidocaineAttribution', 'respiratoryAttribution', 'reviewTags', 'reviewTopics', 'scenarioId',
      'score', 'teachingFeedback', 'teachingPoints', 'timeToRecognitionSec',
      'timeToTreatmentSec', 'title',
    ].sort());
    expect(result).toMatchObject({
      scenarioId: 'live_sim',
      title: 'Live Anesthesia Simulation',
      courseUnit: 'Live Simulation',
      durationSec: runner.simTime,
      rawPoints: 0,
      maxPoints: 0,
      score: 0,
    });
    expect(result.respiratoryAttribution).toMatchObject({
      forcedApneaActive: true,
      forcedApneaContribution: 0,
      dominantSource: 'forced_apnea',
    });
    expect(result.lidocaineAttribution).toMatchObject({
      peakPlasmaTotalMcgMl: 0,
      currentToxicityStage: 'none',
      doseHistory: [],
      regionalHistory: [],
      toxicityHistory: [],
      lipidRescueHistory: [],
      tofCheckHistory: [],
    });
  });

  it('exposes timed PPV, cricoid, and intubation attempts through structured snapshots and logs', () => {
    const runner = new SimRunner();
    runner.configureIntubationAttempts({
      failedIntubationAttempts: [1],
      attemptDurationSeconds: 2,
    });

    expect(runner.applyCricoidPressure()).toMatchObject({ ok: true, changed: true });
    expect(runner.deliverMaskVentilation({
      durationSeconds: 1,
      tidalVolumeMl: 500,
      respiratoryRate: 12,
      cricoidPressure: true,
    })).toMatchObject({ ok: true, plannedDurationSec: 1, minuteVentilation: 6 });
    advance(runner, 1);
    expect(runner.intubate()).toMatchObject({ ok: true, attemptNumber: 1, plannedDurationSec: 2 });
    advance(runner, 2);

    const snapshot = runner.snapshot();
    expect(snapshot).toMatchObject({
      eto2: expect.any(Number),
      cricoidPressureActive: true,
      ppvActive: false,
      ppvEpisodeCount: 1,
      intubationInProgress: false,
      intubationAttemptCount: 1,
      lastIntubationOutcome: 'failed',
      proceduralApnea: false,
      airwayDevice: 'mask',
    });
    expect(snapshot.ppvHistory[0]).toMatchObject({
      startTimeSec: 0,
      endTimeSec: 1,
      deliveredDurationSec: 1,
      airwayDevice: 'mask',
      cricoidPressure: true,
    });
    expect(snapshot.intubationAttempts[0]).toMatchObject({
      attemptNumber: 1,
      startTimeSec: 1,
      endTimeSec: 3,
      outcome: 'failed',
    });
    expect(runner.log.map((entry) => entry.meta?.action).filter(Boolean)).toEqual([
      'cricoid_pressure_applied',
      'mask_ppv_started',
      'mask_ppv_completed',
      'intubation_attempt_started',
      'intubation_attempt_failed',
    ]);

    const historyCopy = snapshot.ppvHistory;
    historyCopy[0].completionReason = 'mutated';
    expect(runner.snapshot().ppvHistory[0].completionReason).toBe('completed');
  });

  it('keeps administrative airway setup outside the intubation attempt log', () => {
    const runner = new SimRunner();

    expect(runner.setAirwayDevice('intubated').ok).toBe(true);

    expect(runner.snapshot()).toMatchObject({
      airwayDevice: 'intubated',
      intubationAttemptCount: 0,
      lastIntubationOutcome: 'none',
    });
    expect(runner.log.filter(
      (entry) => entry.meta?.action?.startsWith('intubation_attempt_'),
    )).toEqual([]);
  });
});
