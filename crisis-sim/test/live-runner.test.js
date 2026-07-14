import { describe, expect, it } from 'vitest';
import { SimRunner } from '../ui/simRunner.js';

function advance(runner, seconds) {
  runner.core.stepFor(seconds);
  runner.simTime = runner.core.simTime;
  return runner.snapshot();
}

describe('live SimRunner integration', () => {
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

  it('rejects a complication with no existing engine state machine', () => {
    const runner = new SimRunner();

    expect(() => runner.injectComplication('InventedCrisis')).toThrow(/Unsupported complication/);
  });

  it('builds a live debrief with the existing SimulationResult shape', () => {
    const runner = new SimRunner();
    runner.setForcedApnea(true);
    advance(runner, 1);

    const result = runner.buildDebrief();

    expect(Object.keys(result).sort()).toEqual([
      'courseUnit', 'criticalActionsCompleted', 'criticalActionsMissed',
      'dangerousActions', 'durationSec', 'maxPoints', 'rawPoints',
      'respiratoryAttribution', 'reviewTags', 'reviewTopics', 'scenarioId',
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
  });
});
