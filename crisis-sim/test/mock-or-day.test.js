import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { RUBRIC_SCENARIOS, TEACHING_CASES, parsePatientConfig } from '../../ui/liveSimModel.js';
import {
  BOARD_QUESTION,
  allFieldNames,
  autofillFromChart,
  buildPlanReviewContext,
  checkCalculations,
  computeReferenceCalcs,
  decisionCategory,
  gradeCarePlan,
  keywordHit,
  labsFromChart,
  maintenanceRate421,
  missingRequired,
  offlinePlanVerdict,
  renderCarePlanForm,
} from '../../ui/carePlanSheet.js';
import {
  buildBoothCaseProfile,
  buildChartDigest,
  buildChartInterviewGrounding,
  physiologyConfig,
  startGate,
} from '../../ui/mockOrDay.js';
import {
  CHAOS_PROFILES,
  DIRECTOR_COMPLICATIONS,
  computeIntensity,
  createDirector,
  createSimOperator,
} from '../../ui/simOperator.js';
import {
  FLOW_SCALE, PAW_SCALE, createWaveformRenderer, flowMorphology, pawMorphology, ventilatorMode,
} from '../../ui/liveWaveformRenderer.js';
import { LEARNER_MONITOR_KEYS, projectLearnerMonitorSnapshot } from '../../ui/liveSimTransport.js';
import { buildSystemPrompt } from '../../api/sim-operator.js';

const root = resolve(import.meta.dirname, '../..');
const base = resolve(root, 'data/mock-or-day');
const index = JSON.parse(readFileSync(resolve(base, 'index.json'), 'utf8'));
const patient = (id) => JSON.parse(readFileSync(resolve(base, `patients/${id}.json`), 'utf8'));
const answerKey = (id) => JSON.parse(readFileSync(resolve(base, `answer-keys/${id}.json`), 'utf8'));
const DASH = /[‒–—―]|\s-\s/;

describe('Mock OR Day data', () => {
  it('has all 56 charts (50 OR day plus 6 CN Rubric), each with an answer key', () => {
    expect(index.count).toBe(56);
    expect(index.patients).toHaveLength(56);
    expect(readdirSync(resolve(base, 'patients')).filter((f) => f.endsWith('.json'))).toHaveLength(56);
    expect(readdirSync(resolve(base, 'answer-keys')).filter((f) => f.endsWith('.json'))).toHaveLength(56);
    expect(new Set(index.patients.map((p) => p.id)).size).toBe(56);
  });

  it('carries every CN rubric scenario and teaching case as a labeled patient with matching physiology', () => {
    const cn = index.patients.filter((p) => p.cnRubric);
    expect(cn.map((p) => p.id)).toEqual(['p51', 'p52', 'p53', 'p54', 'p55', 'p56']);
    const expected = [...RUBRIC_SCENARIOS.map(({ id }) => [id, 'rubric']), ...TEACHING_CASES.map(({ id }) => [id, 'teaching'])];
    expect(cn.map((p) => [p.cnRubric.scenarioId, p.cnRubric.kind]).sort()).toEqual(expected.sort());
    for (const entry of cn) {
      expect(entry.label, entry.id).toMatch(/^CN Rubric · /);
      expect(entry.engineSupported, entry.id).toBe(true);
      const chartData = patient(entry.id);
      expect(chartData.label).toBe(entry.label);
      expect(chartData.cn).toEqual(entry.cnRubric);
      expect(answerKey(entry.id).cnRubric).toEqual(entry.cnRubric);
      const scenario = JSON.parse(readFileSync(resolve(root, `crisis-sim/sim/scenarios/${entry.cnRubric.scenarioId}.json`), 'utf8'));
      const profile = scenario.patientProfile;
      for (const key of ['weightKg', 'heightCm', 'baselineHR', 'baselineSystolic', 'baselineDiastolic', 'baselineRR', 'baselineSpO2', 'baselineTemp']) {
        expect(entry.physiology[key], `${entry.id}:${key}`).toBe(profile[key]);
      }
      expect(chartData.wt_kg).toBe(profile.weightKg);
      expect(chartData.vitals.at(-1)[1]).toBe(`${profile.baselineSystolic}/${profile.baselineDiastolic}`);
    }
    // The full stomach RSI patient reads like one.
    const rsi = patient('p52');
    expect(rsi.preop.npo_solids).toMatch(/vomiting/);
    expect(answerKey('p52').redFlags.map((f) => f.id)).toContain('fullstomach');
    expect(decisionCategory(answerKey('p56').decision.recommendation)).toBe('delay');
  });

  it('gives every engine supported patient a physiology the engine accepts', () => {
    const supported = index.patients.filter((p) => p.engineSupported);
    expect(supported.length).toBe(53);
    for (const entry of supported) {
      expect(() => parsePatientConfig(physiologyConfig(entry)), entry.id).not.toThrow();
    }
    for (const entry of index.patients.filter((p) => !p.engineSupported)) {
      expect(entry.engineNote, entry.id).toBeTruthy();
    }
  });

  it('marks every answer key as a faculty review draft with valid, usable content', () => {
    const types = new Set(DIRECTOR_COMPLICATIONS.map((entry) => entry.type));
    for (const entry of index.patients) {
      const key = answerKey(entry.id);
      expect(key.id).toBe(entry.id);
      expect(key.status).toBe('draft');
      expect(key.reviewNote).toMatch(/faculty review/);
      expect(key.redFlags.length, entry.id).toBeGreaterThan(0);
      expect(key.planItems.length, entry.id).toBeGreaterThan(0);
      for (const flag of key.redFlags) {
        expect(['critical', 'major', 'minor']).toContain(flag.severity);
        expect(flag.keywords.length, `${entry.id}:${flag.id}`).toBeGreaterThan(0);
      }
      for (const item of key.boothComplications) expect(types.has(item.type), `${entry.id}:${item.type}`).toBe(true);
      expect(JSON.stringify(key), entry.id).not.toMatch(DASH);
    }
  });
});

describe('care plan sheet', () => {
  const p05 = patient('p05');
  const k05 = answerKey('p05');

  it('covers both pages of the sheet, including the problem list and calculations', () => {
    const names = allFieldNames();
    for (const name of ['procedure', 'asa', 'npoSolids', 'consentAnesthesia', 'mallampati', 'stopBang', 'apfel', 'rcri',
      'prob7_plan', 'technique', 'airwayPlanC', 'ebv', 'abl', 'npoDeficit', 'maintenanceRate', 'cont3_then', 'pacuReport', 'boardAnswer']) {
      expect(names).toContain(name);
    }
    const markup = renderCarePlanForm({});
    expect(markup).toContain('General Anesthesia Care Plan');
    expect(markup).toContain('Anesthetic Plan and Surgical Procedure');
  });

  it('autofills identifiers and logistics but leaves the clinical thinking blank', () => {
    const filled = autofillFromChart(p05);
    expect(filled.procedure).toBe(p05.case.procedure);
    expect(filled.weightKg).toBe(p05.wt_kg);
    expect(filled.npoClears).toBe(p05.preop.npo_clears);
    expect(filled.med1_name).toBeTruthy();
    for (const clinical of ['asa', 'decision', 'technique', 'prob1_problem', 'ebv', 'abl', 'mallampati', 'airwayPlanA']) {
      expect(filled[clinical]).toBeUndefined();
    }
    expect(labsFromChart(p05).labK).toBe('3.0');
  });

  it('computes reference calculations with stated formulas', () => {
    expect(maintenanceRate421(70)).toBe(110);
    expect(maintenanceRate421(15)).toBe(50);
    const ref = computeReferenceCalcs(p05);
    expect(ref.bmi).toBe(25.3);
    expect(ref.ebv).toBe(Math.round(82 * 75));
    expect(ref.maintenanceRate).toBe(122);
    expect(ref.npoHours).toBe(2.5);
    expect(ref.formulas.abl).toMatch(/target 21/);
    const checks = checkCalculations({ ebv: '6150', abl: '9999', maintenanceRate: '' }, ref);
    expect(checks.find((c) => c.key === 'ebv').status).toBe('ok');
    expect(checks.find((c) => c.key === 'abl').status).toBe('check');
    expect(checks.find((c) => c.key === 'maintenanceRate').status).toBe('blank');
  });

  it('matches short keywords on word boundaries', () => {
    expect(keywordHit('plan rsi with roc', 'rsi')).toBe(true);
    expect(keywordHit('several versions', 'rsi')).toBe(false);
    expect(keywordHit('sickle cell trait', 'sickl')).toBe(true);
  });

  it('maps answer key recommendations to go or delay categories', () => {
    expect(decisionCategory('proceed')).toBe('proceed');
    expect(decisionCategory('proceed now')).toBe('proceed');
    expect(decisionCategory('proceed with modifications')).toBe('proceed_mod');
    expect(decisionCategory('postpone')).toBe('delay');
    expect(decisionCategory('discuss delay with vascular surgery')).toBe('delay');
    expect(decisionCategory('delay a few hours to treat DKA, then proceed')).toBe('delay');
  });

  it('scores an empty plan near zero and a plan that hits every finding at 100', () => {
    for (const entry of index.patients) {
      const key = answerKey(entry.id);
      const chart = patient(entry.id);
      expect(gradeCarePlan({}, key, chart).percent, entry.id).toBeLessThanOrEqual(5);
      const values = { decision: decisionCategory(key.decision.recommendation), asa: key.asa.suggested, boardAnswer: BOARD_QUESTION.answer };
      [...key.redFlags, ...key.planItems].forEach((item, i) => { values[`note${i}`] = item.keywords[0]; });
      expect(gradeCarePlan(values, key, chart).percent, entry.id).toBe(100);
    }
  });

  it('names missed critical findings and recommends from the key', () => {
    const grade = gradeCarePlan({ decision: 'proceed', asa: '2' }, k05, p05);
    expect(grade.missedCritical.length).toBeGreaterThan(0);
    const verdict = offlinePlanVerdict(grade, { meanness: 2 });
    expect(verdict).toMatch(/Missed critical/);
    expect(verdict).not.toMatch(DASH);
    const context = buildPlanReviewContext({ patient: p05, chartDigest: 'digest', values: { asa: '2', blank: '' }, answerKey: k05, grade });
    expect(context.plan).toEqual({ asa: '2' });
    expect(context.answerKey.status).toBe('draft');
    expect(Object.values(context.offlineGrade.minimumStatus)).toContain('missed');
    expect(context.answerKey.redFlags[0].id).toBeTruthy();
  });

  it('gates START on the short required list', () => {
    expect(missingRequired({})).toEqual(expect.arrayContaining(['ASA', 'Go / no go decision', 'Primary technique', 'Airway plan A']));
    const complete = { asa: '3', decision: 'proceed', technique: 'GA with ETT', airwayPlanA: 'VL', prob1_problem: 'a', prob2_problem: 'b', prob3_problem: 'c' };
    expect(missingRequired(complete)).toEqual([]);
    expect(startGate({ active: false }).allowed).toBe(true);
    expect(startGate({ active: true, engineSupported: true, planSubmitted: false, label: 'X' }).allowed).toBe(false);
    expect(startGate({ active: true, engineSupported: true, planSubmitted: true, label: 'X' }).allowed).toBe(true);
    expect(startGate({ active: true, engineSupported: false, engineNote: 'infant', label: 'X' }).allowed).toBe(false);
  });
});

describe('chart grounding', () => {
  it('keeps every chart digest inside the model budget and grounds the interview', () => {
    for (const entry of index.patients) {
      const chart = patient(entry.id);
      const digest = buildChartDigest(chart, { maxChars: 9000 });
      expect(digest.length).toBeLessThanOrEqual(9000);
      expect(digest).toContain(chart.case.procedure);
      const grounding = buildChartInterviewGrounding(chart);
      expect(grounding.chart.digest.length).toBeLessThanOrEqual(7200);
      expect(grounding.qa.map((q) => q.id)).toContain('mock_npo');
    }
  });
});

describe('Booth reads the Mock OR chart', () => {
  const STABLE = {
    t: 0, hr: 72, sbp: 120, dbp: 80, map: 93, spo2: 98, etco2: 38, temp: 36.8, capnogramPresent: true,
    derivedRhythm: 'sinus', lidocaineToxicityStage: 'none', airwayDevice: 'intubated', vaporizer: 2,
    vaporizerAgent: 'Sevoflurane', effectiveNmbBlockade: 0, respDrive: 1, lidocaineCumulativeMg: 0, tof: 4, tofRatio: 1, lifecycle: 'RUNNING',
  };

  it('favors the answer key complications when they are eligible', () => {
    const profile = CHAOS_PROFILES[3];
    const hist = { drugsGiven: new Set(['Propofol']), epiduralGiven: false, wasIntubated: true };
    const picks = [];
    for (let seed = 1; seed <= 6; seed += 1) {
      let state = seed;
      const director = createDirector({ random: () => { state = (state * 16807) % 2147483647; return state / 2147483647; } });
      director.setPreferred(['Bronchospasm']);
      for (let t = 0; t < profile.firstCalmSec + 2; t += 1) {
        const decision = director.update({ snapshot: { ...STABLE, t }, dt: t ? 1 : 0, intensity: computeIntensity(STABLE), profile, active: [], history: hist, enabled: true });
        if (decision) picks.push(decision.inject);
      }
    }
    expect(picks.length).toBe(6);
    expect(new Set(picks)).toEqual(new Set(['Bronchospasm']));
  });

  it('ignores unknown preferred types and clears with an empty list', () => {
    const director = createDirector();
    director.setPreferred(['Hemorrhage', 'Bronchospasm', 'Nonsense']);
    expect(director.getPreferred()).toEqual(['Bronchospasm']);
    director.setPreferred([]);
    expect(director.getPreferred()).toEqual([]);
  });

  it('mentions chart findings only once they are handed over, and shares the case with the model context', () => {
    const lines = [];
    let clock = 0;
    const runner = {
      rubricSession: null, caseSession: null, s: { eventLog: [] }, activeComplications: () => [],
      injectComplication: vi.fn(() => ({ ok: true })),
    };
    const operator = createSimOperator({ runner, say: (line) => lines.push(line), now: () => clock, schedule: (fn) => fn(), chaos: 0, chatter: 2, minGapMs: 0 });
    const entry = index.patients.find((p) => p.id === 'p42');
    const profile = buildBoothCaseProfile(entry, answerKey('p42'));
    expect(profile.hooks[0]).toMatch(/hemidiaphragm/);
    operator.setCaseProfile({ ...profile, hooks: [] });
    for (let t = 0; t <= 200; t += 1) { clock = t * 1000; operator.observe({ ...STABLE, t }); }
    expect(lines.some((line) => line.ruleId === 'amb_case')).toBe(false);

    operator.setCaseProfile(profile);
    for (let t = 201; t <= 600; t += 1) { clock = t * 1000; operator.observe({ ...STABLE, t }); }
    const caseLines = lines.filter((line) => line.ruleId === 'amb_case');
    expect(caseLines.length).toBeGreaterThan(0);
    expect(caseLines.some((line) => /hemidiaphragm|beach chair|osa/i.test(line.text))).toBe(true);
    for (const line of caseLines) expect(line.text).not.toMatch(/\{|\}/);
    const context = operator.caseContext();
    expect(context.mockOrCase.patient).toBe(entry.label);
    expect(context.mockOrCase.chartFindings.length).toBeGreaterThan(0);
    operator.setCaseProfile(null);
    expect(operator.caseContext().mockOrCase).toBeNull();
  });
});

describe('GE style machine screen', () => {
  it('draws volume control Paw up to Ppeak and back to PEEP, with square inspiratory flow', () => {
    const signals = { ventMode: 1, airwayDevice: 'intubated', ppeak: 22, ventSetPeep: 5, tv: 500, cycleRate: 12 };
    expect(ventilatorMode(signals)).toBe('vcv');
    expect(pawMorphology(0.33, signals)).toBeCloseTo(22, 0);
    expect(pawMorphology(0.95, signals)).toBeCloseTo(5, 0);
    const inspiratory = flowMorphology(0.1, signals);
    expect(inspiratory).toBeCloseTo(flowMorphology(0.3, signals), 6);
    expect(inspiratory).toBeCloseTo((0.5 / (5 / 3)) * 60, 6); // 500 mL over a 1.67 s inspiration
    expect(flowMorphology(0.4, signals)).toBeLessThan(0);
  });

  it('flatlines the ventilator traces when nothing is breathing', () => {
    const renderer = createWaveformRenderer({ sampleRate: 100, seconds: 2 });
    renderer.advance(0.25, { hr: 70, spo2: 98, rr: 0, etco2: 0, ventMode: 0, ppeak: 0, ventSetPeep: 0, spont: false });
    const history = renderer.snapshot();
    expect(history.paw.every((value) => value === 0)).toBe(true);
    expect(history.flow.every((value) => value === 0)).toBe(true);
  });

  it('keeps ventilator samples inside the normalized scale', () => {
    const renderer = createWaveformRenderer({ sampleRate: 100, seconds: 6 });
    const signals = { hr: 80, spo2: 99, rr: 12, etco2: 36, capnogramPresent: true, ventMode: 2, airwayDevice: 'intubated', ppeak: 60, ventSetPeep: 8, tv: 900, ventSetRR: 30 };
    for (let i = 0; i < 24; i += 1) renderer.advance(0.25, signals);
    const history = renderer.snapshot();
    expect(Math.max(...history.paw)).toBeLessThanOrEqual(1);
    expect(Math.min(...history.flow)).toBeGreaterThanOrEqual(-1);
    expect(PAW_SCALE).toBe(40);
    expect(FLOW_SCALE).toBe(60);
  });

  it('publishes machine gas and flow values to the display without case guidance', () => {
    for (const key of ['eto2', 'etAgent', 'mac', 'o2Flow', 'airFlow', 'n2oFlow', 'ventSetFiO2', 'spont']) expect(LEARNER_MONITOR_KEYS).toContain(key);
    const projected = projectLearnerMonitorSnapshot({ mac: 1.1, o2Flow: 1, instructorGuide: 'x', activeComplications: ['MH'], derivedRhythm: 'vt' });
    expect(Object.keys(projected).sort()).toEqual(['mac', 'o2Flow']);
  });
});

describe('Booth plan review prompt', () => {
  it('grounds the plan review in the chart, the draft key and the offline grade', () => {
    const prompt = buildSystemPrompt({ mode: 'plan', meanness: 2, context: { chart: 'CHART', answerKey: { status: 'draft' } } });
    expect(prompt).toMatch(/care plan/);
    expect(prompt).toMatch(/draft for faculty review/);
    expect(prompt).toContain('CHART');
    expect(prompt).not.toMatch(/[–—]/);
  });
});

describe('machine form sync', () => {
  it('rounds float32 engine settings so the browser does not silently block APPLY MACHINE SETTINGS', async () => {
    const { syncClinicalDraftControls } = await import('../../ui/liveSimView.js');
    const controls = new Map(['mode', 'setFiO2', 'o2FlowLPerMin'].map((name) => [name, { value: '' }]));
    const dial = { value: '' };
    const documentRoot = {
      getElementById: (id) => (id === 'live-machine-form' ? { elements: { namedItem: (name) => controls.get(name) ?? null } } : (id === 'live-volatile-dial' ? dial : null)),
    };
    syncClinicalDraftControls({ documentRoot, snapshot: { ventMode: 1, ventSetFiO2: Math.fround(0.21), o2Flow: Math.fround(2.1), vaporizer: Math.fround(1.7) } });
    expect(controls.get('setFiO2').value).toBe('0.21');
    expect(controls.get('o2FlowLPerMin').value).toBe('2.1');
    expect(dial.value).toBe('1.7');
  });

  it('follows PREOXYGENATE on the real engine so APPLY MACHINE SETTINGS cannot undo it', async () => {
    const { syncMachineFormFromSnapshot } = await import('../../ui/liveSimView.js');
    const { SimRunner } = await import('../ui/simRunner.js');
    const runner = new SimRunner();
    const names = ['mode', 'setTidalVolume', 'setRespiratoryRate', 'setPeep', 'setPressureAbovePeep', 'setPressureSupport', 'setFiO2', 'o2FlowLPerMin', 'airFlowLPerMin', 'n2oFlowLPerMin'];
    const controls = new Map(names.map((name) => [name, { value: '' }]));
    const form = { elements: { namedItem: (name) => controls.get(name) ?? null } };
    syncMachineFormFromSnapshot({ form, snapshot: runner.snapshot() });
    expect(controls.get('setFiO2').value).toBe('0.21');
    runner.preoxygenate();
    runner.pause();
    const updated = syncMachineFormFromSnapshot({ form, snapshot: runner.snapshot() });
    expect(updated).toEqual(expect.arrayContaining(['setFiO2', 'o2FlowLPerMin']));
    expect(controls.get('setFiO2').value).toBe('1');
    expect(controls.get('o2FlowLPerMin').value).toBe('10');
    // A field the instructor is editing, or edited since the last apply, is left alone.
    controls.get('setTidalVolume').value = '450';
    runner.setMachine({ setTidalVolume: 600, setFiO2: 0.5 });
    syncMachineFormFromSnapshot({ form, snapshot: runner.snapshot(), dirty: new Set(['setTidalVolume']), activeElement: controls.get('setFiO2') });
    expect(controls.get('setTidalVolume').value).toBe('450');
    expect(controls.get('setFiO2').value).toBe('1');
  });
});
