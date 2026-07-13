import { describe, expect, it } from 'vitest';
import { SimRunner } from '../ui/simRunner.js';

function advance(runner, seconds) {
  runner.core.stepFor(seconds);
  runner.simTime = runner.core.simTime;
  return runner.snapshot();
}

describe('live SimRunner integration', () => {
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
