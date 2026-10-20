/* Booth hears orders through speech errors, the engine has the added drugs,
   fluids and undo, and FiO2 follows the flowmeters. */
import { describe, expect, it, vi } from 'vitest';
import { findDrugs, parseStudentOrders, resolveDose, wordsToDigits } from '../../ui/boothOrders.js';
import { createUtteranceAssembler } from '../../ui/speechAssembler.js';
import { renderBoothDock } from '../../ui/boothDock.js';
import { fio2FromFlows, flowsForFiO2, computeCustomDose, ENGINE_DRUGS, DRUG_ACTIONS, computeDrugDose } from '../../ui/liveSimModel.js';
import { SimRunner, VentMode, DRUG_UNDO_WINDOW_SEC } from '../ui/simRunner.js';

const labels = (text, options) => parseStudentOrders(text, options).orders.map((order) => order.label);

describe('drug names through speech to text', () => {
  it('hears the mangled names from the session', () => {
    expect(labels('100 of rocker onion')).toEqual(['Rocuronium 100 mg']);
    expect(parseStudentOrders("hey Booth we're going to give some automatic").needsDose).toBe('Etomidate');
    expect(labels('push 50 of rock you ronium')).toEqual(['Rocuronium 50 mg']);
    expect(labels('give 140 of pro po fall')).toEqual(['Propofol 140 mg']);
    expect(labels('push 20 of eat a mid date')).toEqual(['Etomidate 20 mg']);
    expect(labels('give 8 of pan curo nium')).toEqual(['Pancuronium 8 mg']);
    expect(labels('keta mean 100')).toEqual(['Ketamine 100 mg']);
    expect(labels('sugar madex two hundred')).toEqual(['Sugammadex 200 mg']);
  });

  it('reads doses in words, units and per kilo, with the usual unit when none is said', () => {
    expect(wordsToDigits('one hundred fifty')).toBe('150');
    expect(wordsToDigits('two point five')).toBe('2.5');
    expect(labels('fifty mics of fentanyl')).toEqual(['Fentanyl 50 mcg']);
    expect(labels('push 100 of fentanyl')).toEqual(['Fentanyl 100 mcg']);
    expect(labels('push 100 of neo')).toEqual(['Phenylephrine 100 mcg']);
    expect(labels('roc point six per kilo', { weightKg: 70 })).toEqual(['Rocuronium 0.6 mg/kg (42 mg)']);
    expect(resolveDose('Propofol', { amount: 5000, unit: 'mg' }, 70).ok).toBe(false);
  });

  it('completes a drug Booth asked the dose for', () => {
    expect(labels('20', { pendingDrug: 'Etomidate' })).toEqual(['Etomidate 20 mg']);
  });

  it('does not hear drugs in ordinary talk or act on questions', () => {
    for (const text of ['give me a minute', 'the patient is rocking back and forth', 'his potassium is normal', 'we need suction ready', 'push the cart closer']) {
      expect(findDrugs(text), text).toEqual([]);
      expect(labels(text), text).toEqual([]);
    }
    const question = parseStudentOrders('should I give rocuronium?');
    expect(question.isQuestion).toBe(true);
    expect(question.orders).toEqual([]);
  });

  it('turns plain words into the other orders', () => {
    expect(labels('we are going to preoxygenate')).toEqual(['Preoxygenate, 100% O2 at 10 L/min']);
    expect(labels('start sevo at 2 percent')).toEqual(['Sevoflurane 2%']);
    expect(labels('hang a liter of LR')).toEqual(['LR 1000 mL bolus']);
    expect(labels('give 2 units of blood')).toEqual(['PRBC 2 units']);
    expect(labels('run LR at 100 an hour')).toEqual(['LR at 100 mL/h']);
    expect(labels('check the twitches')).toEqual(['Check train of four']);
    expect(labels('apply cricoid and push 120 of roc')).toEqual(['Rocuronium 120 mg', 'Apply cricoid pressure']);
  });
});

describe('waiting for the speaker to finish', () => {
  it('still renders the Booth dock on the student screen', () => {
    expect(renderBoothDock()).toContain('data-booth="input"');
  });

  it('joins phrases said within the pause and sends once', () => {
    vi.useFakeTimers();
    const sent = [];
    const assembler = createUtteranceAssembler({ onUtterance: (text) => sent.push(text), timers: globalThis });
    const result = (phrase, isFinal) => ({ 0: { transcript: phrase }, isFinal });
    assembler.push({ resultIndex: 0, results: [result("hey Booth we're going to give some", true)] });
    vi.advanceTimersByTime(1500);
    assembler.push({ resultIndex: 1, results: [result("hey Booth we're going to give some", true), result('etomidate 20', false)] });
    vi.advanceTimersByTime(1500);
    expect(sent).toEqual([]);
    vi.advanceTimersByTime(1000);
    expect(sent).toEqual(["hey Booth we're going to give some etomidate 20"]);
    vi.useRealTimers();
  });
});

describe('added drugs in the engine', () => {
  function induced(drug, mgPerKg) {
    const r = new SimRunner();
    r.pause();
    r.preoxygenate(); r.pause();
    r.stepFor(60);
    const base = r.snapshot();
    r.giveBolus(drug, mgPerKg * 70, drug); r.pause();
    r.giveBolus('Rocuronium', 42, 'roc'); r.pause();
    r.stepFor(60);
    r.attemptIntubation(); r.pause(); r.stepFor(35);
    r.setMachine({ mode: VentMode.VCV, setFiO2: 1, setTidalVolume: 500, setRespiratoryRate: 12 });
    let minBis = 100; let maxHr = 0; let maxMap = 0; let minMap = 999;
    for (let t = 0; t < 300; t += 1) {
      r.stepFor(1);
      const s = r.snapshot();
      minBis = Math.min(minBis, s.bis); maxHr = Math.max(maxHr, s.hr); maxMap = Math.max(maxMap, s.map); minMap = Math.min(minMap, s.map);
    }
    return { base, minBis, maxHr, maxMap, minMap };
  }

  it('etomidate induces with stable pressure; ketamine raises heart rate and pressure', () => {
    const eto = induced('Etomidate', 0.3);
    expect(eto.minBis).toBeLessThan(55);
    expect(eto.minMap).toBeGreaterThan(eto.base.map * 0.9);
    const ket = induced('Ketamine', 2);
    expect(ket.minBis).toBeLessThan(60);
    expect(ket.maxHr).toBeGreaterThan(ket.base.hr + 10);
    expect(ket.maxMap).toBeGreaterThan(ket.base.map + 10);
  });

  it('pancuronium has a slower onset and longer block than rocuronium', () => {
    const onset = (drug, mgPerKg) => {
      const r = new SimRunner();
      r.pause();
      r.giveBolus('Propofol', 140, 'p'); r.pause();
      r.giveBolus(drug, mgPerKg * 70, drug); r.pause();
      for (let t = 1; t < 600; t += 1) { r.stepFor(1); if (r.snapshot().tof === 0) return t; }
      return null;
    };
    const roc = onset('Rocuronium', 0.6);
    const panc = onset('Pancuronium', 0.1);
    const vec = onset('Vecuronium', 0.1);
    expect(roc).toBeLessThan(90);
    expect(panc).toBeGreaterThan(roc + 45);
    expect(vec).toBeGreaterThan(roc);
    expect(DRUG_ACTIONS.some((action) => action.drugName === 'Pancuronium')).toBe(true);
    expect(computeDrugDose('ketamine_2_mgkg', 70).totalMg).toBe(140);
    expect(ENGINE_DRUGS).toEqual(expect.arrayContaining(['Etomidate', 'Ketamine', 'Pancuronium', 'Vecuronium']));
    expect(computeCustomDose({ drugName: 'Rocuronium', amount: 1.2, unit: 'mg/kg', weightKg: 70 }).totalMg).toBe(84);
  });
});

describe('undo a drug pressed by mistake', () => {
  it('takes the dose back exactly, leaving the others', () => {
    const only = new SimRunner();
    only.pause();
    only.giveBolus('Fentanyl', 0.1, 'f'); only.pause();
    only.stepFor(60);
    const both = new SimRunner();
    both.pause();
    both.giveBolus('Fentanyl', 0.1, 'f'); both.pause();
    both.stepFor(10);
    both.giveBolus('Rocuronium', 42, 'roc by mistake'); both.pause();
    both.stepFor(20);
    expect(both.undoableDoses().map((dose) => dose.label)).toEqual(['roc by mistake', 'f']);
    expect(both.undoDrug()).toMatchObject({ ok: true, name: 'Rocuronium' });
    both.stepFor(30);
    expect(both.snapshot().fentanylCe).toBeCloseTo(only.snapshot().fentanylCe, 6);
    expect(both.d._rocuroniumCe).toBe(0);
    expect(both.log.at(-1).meta).toMatchObject({ action: 'drug_undone', drug: 'Rocuronium' });
  });

  it('only within the window, and never for reversal agents', () => {
    const r = new SimRunner();
    r.pause();
    r.giveBolus('Sugammadex', 140, 's'); r.pause();
    expect(r.undoDrug().ok).toBe(false);
    r.giveBolus('Propofol', 140, 'p'); r.pause();
    r.stepFor(DRUG_UNDO_WINDOW_SEC + 2);
    expect(r.undoDrug().ok).toBe(false);
  });
});

describe('IV fluids', () => {
  it('restores a hypovolemic patient and counts what went in', () => {
    const r = new SimRunner();
    r.pause();
    r.p.bloodVolumeFraction = 0.7;
    r.stepFor(60);
    const before = r.snapshot();
    expect(r.giveFluid({ type: 'LR', volumeMl: 1000, overMin: 10 }).ok).toBe(true);
    r.stepFor(600);
    const after = r.snapshot();
    expect(after.fluids.totalMl).toBe(1000);
    expect(after.fluids.bloodVolumeFraction).toBeGreaterThan(0.79);
    expect(after.map).toBeGreaterThan(before.map + 5);
    expect(r.giveFluid({ type: 'PRBC', volumeMl: 600, overMin: 15 }).ok).toBe(true);
    expect(r.setFluidRate({ type: 'LR', mlPerHr: 100 }).ok).toBe(true);
    expect(r.snapshot().fluids.lines.map((line) => line.mode)).toEqual(['bolus', 'rate']);
    expect(r.stopFluid().ok).toBe(true);
    expect(r.giveFluid({ type: 'Juice' }).ok).toBe(false);
  });
});

describe('FiO2 follows the flowmeters', () => {
  it('mixes O2, air and N2O, and splits flows for a typed FiO2', () => {
    expect(fio2FromFlows({ o2: 1, air: 1 })).toBe(0.61);
    expect(fio2FromFlows({ o2: 2 })).toBe(1);
    expect(fio2FromFlows({ o2: 1, n2o: 1 })).toBe(0.5);
    expect(fio2FromFlows({})).toBeNull();
    const flows = flowsForFiO2({ fio2: 0.5, o2: 1, air: 1 });
    expect(flows.o2 + flows.air).toBeCloseTo(2, 5);
    expect(fio2FromFlows(flows)).toBe(0.5);
  });

  it('a flow change without an FiO2 sets the engine FiO2 from the flows', () => {
    const r = new SimRunner();
    r.setMachine({ mode: VentMode.VCV, setFiO2: 1, o2FlowLPerMin: 2, airFlowLPerMin: 0 });
    r.setMachine({ o2FlowLPerMin: 1, airFlowLPerMin: 1 });
    expect(r.snapshot().ventSetFiO2).toBeCloseTo(0.605, 3);
  });
});
