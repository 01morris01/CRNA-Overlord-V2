import { describe, expect, it } from 'vitest';
import {
  computeDrugDose,
  computeRegionalLidocaineDose,
  deriveAlarms,
  formatInstructorNmb,
  formatLidocaineSnapshot,
  formatMonitorSnapshot,
  formatRubricFlag,
  formatRubricStatus,
  parsePatientConfig,
  RUBRIC_SCENARIO_ASSETS,
  RUBRIC_SCENARIOS,
  validateSimulationResult,
  VOLATILE_AGENTS,
  LIDOCAINE_ROUTES,
} from '../../ui/liveSimModel.js';
import {
  deriveLifecyclePresentation,
  formatDrugLifecycleStatus,
  formatPreoxygenationLifecycleStatus,
} from '../../ui/liveSimView.js';

describe('live simulation dose model', () => {
  it('announces READY evolution and PAUSED dose queueing explicitly', () => {
    const dose = { drugName: 'Propofol', totalMg: 140 };

    expect(formatDrugLifecycleStatus(dose, {
      state: 'READY', started: true, queued: false,
    })).toEqual({
      kind: 'success',
      message: 'Propofol: 140 mg total given — effect evolves with simulation time.',
    });
    expect(formatDrugLifecycleStatus(dose, {
      state: 'PAUSED', started: false, queued: true,
    })).toEqual({
      kind: 'info',
      message: 'Propofol: 140 mg total. DOSE QUEUED — RESUME TO ADVANCE.',
    });
  });

  it('announces whether preoxygenation started or remains frozen while paused', () => {
    expect(formatPreoxygenationLifecycleStatus({ state: 'READY', started: true })).toEqual({
      kind: 'success',
      message: 'Preoxygenation started — oxygen stores evolve with simulation time.',
    });
    expect(formatPreoxygenationLifecycleStatus({ state: 'PAUSED', started: false })).toEqual({
      kind: 'info',
      message: 'Preoxygenation set. RESUME TO ADVANCE OXYGEN STORES.',
    });
  });

  it('derives READY/RUNNING/PAUSED labels and button state from runner snapshots', () => {
    expect(deriveLifecyclePresentation({ lifecycle: 'READY', speed: 1, airwayDevice: 'mask' })).toEqual({
      label: 'READY · 1× · MASK', startText: 'START', startDisabled: false, pauseDisabled: true,
    });
    expect(deriveLifecyclePresentation({ lifecycle: 'RUNNING', speed: 5, airwayDevice: 'intubated' })).toEqual({
      label: 'RUNNING · 5× · INTUBATED', startText: 'RUNNING', startDisabled: true, pauseDisabled: false,
    });
    expect(deriveLifecyclePresentation({ lifecycle: 'PAUSED', speed: 1, airwayDevice: 'intubated' })).toEqual({
      label: 'PAUSED · 1× · INTUBATED', startText: 'RESUME', startDisabled: false, pauseDisabled: true,
    });
  });

  it('converts clinical induction units to total milligrams', () => {
    expect(computeDrugDose('propofol_2_mgkg', 80)).toMatchObject({
      drugName: 'Propofol', totalMg: 160,
    });
    expect(computeDrugDose('fentanyl_2_mcgkg', 80)).toMatchObject({
      drugName: 'Fentanyl', totalMg: 0.16,
    });
    expect(computeDrugDose('phenylephrine_100_mcg', 80)).toMatchObject({
      drugName: 'Phenylephrine', totalMg: 0.1,
    });
  });

  it('computes every sugammadex tier and caps neostigmine at 5 mg', () => {
    expect(computeDrugDose('sugammadex_2_mgkg', 80).totalMg).toBe(160);
    expect(computeDrugDose('sugammadex_4_mgkg', 80).totalMg).toBe(320);
    expect(computeDrugDose('sugammadex_16_mgkg', 80).totalMg).toBe(1280);
    expect(computeDrugDose('neostigmine_007_mgkg', 80)).toMatchObject({
      drugName: 'Neostigmine', totalMg: 5,
    });
  });

  it('rejects unknown definitions and non-physiologic weights', () => {
    expect(() => computeDrugDose('unknown', 80)).toThrow(/Unknown drug action/);
    expect(() => computeDrugDose('propofol_2_mgkg', 0)).toThrow(/weight/);
  });

  it('computes regional Lidocaine dose and capped route recommendation', () => {
    expect(LIDOCAINE_ROUTES.map((route) => route.id)).toEqual([
      'infiltration', 'peripheral', 'epidural',
    ]);
    expect(computeRegionalLidocaineDose({
      route: 'peripheral', concentrationPercent: 1.5, volumeMl: 20,
      weightKg: 70, epinephrine: false,
    })).toMatchObject({
      totalMg: 300,
      doseMgKg: 300 / 70,
      maximumMg: 300,
      exceeded: false,
      warning: null,
    });
    expect(computeRegionalLidocaineDose({
      route: 'epidural', concentrationPercent: 2, volumeMl: 20,
      weightKg: 70, epinephrine: false,
    })).toMatchObject({ totalMg: 400, maximumMg: 300, exceeded: true });
  });

  it('rejects unsupported regional routes and invalid numeric inputs', () => {
    expect(() => computeRegionalLidocaineDose({
      route: 'bier', concentrationPercent: 1, volumeMl: 20, weightKg: 70, epinephrine: false,
    })).toThrow(/route/);
    expect(() => computeRegionalLidocaineDose({
      route: 'peripheral', concentrationPercent: 0, volumeMl: 20, weightKg: 70, epinephrine: false,
    })).toThrow(/concentration/);
  });
});

describe('live rubric presentation model', () => {
  it('declares the four approved scenario labels separately from their fetch assets', () => {
    expect(RUBRIC_SCENARIOS).toEqual([
      { id: 'standard_iv_healthy_001', label: 'Standard IV - Healthy Adult' },
      { id: 'rsi_full_stomach_001', label: 'RSI - Full Stomach' },
      { id: 'emergence_residual_block_001', label: 'Emergence - Residual Blockade' },
      { id: 'rsi_failed_first_attempt_001', label: 'RSI - Failed First Attempt' },
    ]);
    expect(RUBRIC_SCENARIO_ASSETS.rsi_full_stomach_001).toEqual({
      scenarioUrl: '/crisis-sim/sim/scenarios/rsi_full_stomach_001.json',
      rubricUrl: '/data/rubrics/carson-newman-rsi-induction.json',
    });
    expect(RUBRIC_SCENARIO_ASSETS.standard_iv_healthy_001).toEqual({
      scenarioUrl: '/crisis-sim/sim/scenarios/standard_iv_healthy_001.json',
      rubricUrl: '/data/rubrics/carson-newman-standard-iv-induction.json',
    });
    expect(RUBRIC_SCENARIO_ASSETS.emergence_residual_block_001).toEqual({
      scenarioUrl: '/crisis-sim/sim/scenarios/emergence_residual_block_001.json',
      rubricUrl: '/data/rubrics/carson-newman-anesthesia-emergence.json',
    });
    expect(RUBRIC_SCENARIO_ASSETS.rsi_failed_first_attempt_001).toEqual({
      scenarioUrl: '/crisis-sim/sim/scenarios/rsi_failed_first_attempt_001.json',
      rubricUrl: '/data/rubrics/carson-newman-rsi-induction.json',
    });
    expect(RUBRIC_SCENARIO_ASSETS.rsi_failed_first_attempt_001.rubricUrl)
      .toBe('/data/rubrics/carson-newman-rsi-induction.json');
  });

  it('formats score state and the literal source-denominator discrepancy', () => {
    expect(formatRubricStatus({
      rawPoints: 44,
      maxPoints: 106,
      percentage: 44 / 106 * 100,
      finalized: false,
      pendingInstructorCount: 3,
      pendingEngineCount: 0,
      pendingUnscoreableCount: 0,
      items: new Array(53).fill({}),
      denominatorWarnings: [{
        code: 'SOURCE_DENOMINATOR_MISMATCH',
        sourceHeaderDenominator: 49,
        computedMaxPoints: 106,
      }],
    })).toEqual({
      score: '44 / 106',
      percentage: '41.5%',
      outcome: 'IN PROGRESS',
      finalized: false,
      pendingCount: 3,
      pendingMessage: '3 instructor observations pending before finalization.',
      warnings: ['Source header denominator /49; encoded rubric computes 106 points across 53 rows.'],
    });
  });

  it('retains exact rubric labels in violation flags and formats NMB readback', () => {
    expect(formatRubricFlag({
      displayNumber: '11',
      text: 'Do NOT provide positive pressure ventilation prior to the first attempt at laryngoscopy',
      tSec: 12,
      triggerAction: 'mask_ppv_started',
      evidence: { actions: [{ tSec: 12, action: 'mask_ppv_started' }] },
    })).toEqual({
      label: 'Item 11 — Do NOT provide positive pressure ventilation prior to the first attempt at laryngoscopy',
      timing: '00:12 · mask_ppv_started',
      evidence: '{"actions":[{"tSec":12,"action":"mask_ppv_started"}]}',
    });

    expect(formatInstructorNmb({
      tofRatio: 0.67,
      tof: 3,
      effectiveNmbBlockade: 0.41,
      instructorNmbTarget: {
        targetTofRatio: 0.7,
        actualTofRatio: 0.67,
        actualTofCount: 3,
        effectiveNmbBlockade: 0.41,
        dominantNmbSource: 'Rocuronium',
        equilibrating: true,
      },
    })).toEqual({
      targetRatio: '0.70',
      actualRatio: '0.67',
      tofCount: '3 / 4',
      effectiveBlockade: '0.41',
      dominantSource: 'Rocuronium',
      equilibrium: 'EQUILIBRATING',
    });
  });
});

describe('live simulation patient setup', () => {
  it('parses every supported runner config field', () => {
    const result = parsePatientConfig({
      weightKg: '80', heightCm: '178', ageYears: '52', sex: 'Female',
      baselineHR: '68', baselineSystolic: '118', baselineDiastolic: '72',
      baselineSpO2: '98', baselineRR: '13', baselineTemp: '36.8', baselineEtCO2: '39',
    });

    expect(result).toEqual({
      weightKg: 80, heightCm: 178, ageYears: 52, sex: 'Female',
      baselineHR: 68, baselineSystolic: 118, baselineDiastolic: 72,
      baselineSpO2: 98, baselineRR: 13, baselineTemp: 36.8, baselineEtCO2: 39,
    });
  });

  it('rejects values outside the control surface ranges', () => {
    expect(() => parsePatientConfig({ weightKg: '5' })).toThrow(/weightKg/);
    expect(() => parsePatientConfig({ weightKg: '80', sex: 'Other' })).toThrow(/sex/);
  });
});

describe('display model', () => {
  it('declares every supported volatile choice and reference dial', () => {
    expect(VOLATILE_AGENTS).toEqual([
      { name: 'Sevoflurane', referenceDial: 2 },
      { name: 'Desflurane', referenceDial: 6 },
      { name: 'Isoflurane', referenceDial: 1.2 },
    ]);
  });

  it('formats engine values without inventing missing normals', () => {
    const model = formatMonitorSnapshot({
      hr: 72.4, sbp: 121.2, dbp: 77.8, map: 92.3, spo2: 98.7,
      rr: 14, etco2: 38.2, temp: 36.65, tof: 4, tofRatio: 0.94,
      spontaneousRR: 11.6, spontaneousTV: 421.4, spontaneousMV: 4.89,
      spontaneousEffort: 0.78, ppeak: 19.2, mv: 6.4, tv: 500.1,
      fio2: 0.5, ventMode: 1, vaporizer: 2.1, vaporizerAgent: 'Sevoflurane',
    });

    expect(model).toMatchObject({
      hr: '72', sbp: '121', dbp: '78', bp: '121/78', map: '92', spo2: '99', rr: '14',
      etco2: '38', temp: '36.7', tof: '4', tofRatio: '0.94',
      spontaneousRR: '12', spontaneousTV: '421', spontaneousMV: '4.9',
      spontaneousEffort: '0.78', ventMode: 'VCV',
    });
    expect(formatMonitorSnapshot({}).hr).toBe('—');
  });

  it('derives threshold alarms only from received state', () => {
    expect(deriveAlarms({ hr: 72, map: 75, spo2: 99, rr: 14, etco2: 38, temp: 36.6, ppeak: 20 })).toEqual([]);

    const ids = deriveAlarms({
      hr: 135, map: 48, spo2: 84, rr: 3, etco2: 62, temp: 39.2, ppeak: 41,
    }).map((alarm) => alarm.id);

    expect(ids).toEqual([
      'hr-high', 'map-low', 'spo2-low', 'rr-low', 'etco2-high', 'temp-high', 'ppeak-high',
    ]);
  });

  it('formats Lidocaine exposure, block, stimulus, toxicity, and rescue state', () => {
    expect(formatLidocaineSnapshot({
      lidocainePlasmaTotalMcgMl: 2.345,
      lidocainePlasmaFreeMcgMl: 0.678,
      lidocaineEffectSiteMcgMl: 0.456,
      lidocaineCumulativeMg: 300,
      regionalSensoryBlock: 0.75,
      regionalMotorBlock: 0.4,
      surgicalStimulusRaw: 0.8,
      surgicalStimulusEffective: 0.2,
      lidocaineToxicityStage: 'warning',
      lipidCumulativeMlKg: 1.5,
    })).toEqual({
      totalLevel: '2.35', freeLevel: '0.68', effectSite: '0.46', cumulativeMg: '300.0',
      sensoryBlock: '75%', motorBlock: '40%', stimulusRaw: '0.80',
      stimulusEffective: '0.20', toxicity: 'WARNING', lipidCumulative: '1.50',
    });
  });
});

describe('SimulationResult validation', () => {
  it('accepts the existing live SimulationResult shape and reports missing fields', () => {
    const valid = {
      scenarioId: 'live_sim', title: 'Live Anesthesia Simulation', courseUnit: 'Live Simulation',
      durationSec: 1, rawPoints: 0, maxPoints: 0, score: 0,
      timeToRecognitionSec: -1, timeToTreatmentSec: -1, teachingFeedback: '',
      teachingPoints: [], reviewTopics: [], reviewTags: [],
      criticalActionsCompleted: [], criticalActionsMissed: [], dangerousActions: [],
      respiratoryAttribution: {},
    };

    expect(validateSimulationResult(valid)).toEqual({ ok: true, missing: [], invalid: [] });
    expect(validateSimulationResult({ scenarioId: 'live_sim' })).toMatchObject({
      ok: false,
      missing: expect.arrayContaining(['title', 'durationSec', 'respiratoryAttribution']),
    });
  });
});
