/* The plan the instructor files when moving a student past the care plan:
   every field on both pages filled from the chart, the answer key and the
   per patient anesthetic choices, for all 56 patients. */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { allFieldNames, buildInstructorPlanRecord, buildModelPlan } from '../../ui/carePlanSheet.js';
import { MODEL_PLAN_SPECS } from '../../ui/modelPlanSpecs.js';
import { apfelScore, rcri } from '../../ui/modelCarePlan.js';

const base = resolve(import.meta.dirname, '../../data/mock-or-day');
const index = JSON.parse(readFileSync(resolve(base, 'index.json'), 'utf8'));
const chart = (id) => JSON.parse(readFileSync(resolve(base, `patients/${id}.json`), 'utf8'));
const key = (id) => JSON.parse(readFileSync(resolve(base, `answer-keys/${id}.json`), 'utf8'));
const DASH = /[‒–—―]|\s-\s/;
// Numbers the chart cannot give: no Hct drawn (healthy toddler, young adult), ice chips in labor.
const NOT_COMPUTABLE = new Set(['p37:abl', 'p56:abl', 'p14:npoHours', 'p14:npoDeficit']);

describe('model care plans', () => {
  it('has an airway exam in every chart and a spec for every patient', () => {
    for (const { id } of index.patients) {
      const exam = chart(id).preop.airway_exam;
      expect(exam, id).toBeTruthy();
      for (const field of ['mallampati', 'tmd', 'mouth_opening', 'neck', 'dentition']) expect(exam[field], `${id}:${field}`).toBeTruthy();
      expect(['No', 'Possible', 'Yes']).toContain(exam.anticipated);
      expect(MODEL_PLAN_SPECS[id], id).toBeTruthy();
    }
  });

  it('fills every field on both pages for all 56 patients, with no dashes', () => {
    const names = allFieldNames().filter((name) => !/^(med|prob|ind|mnt|emg)\d/.test(name));
    for (const { id } of index.patients) {
      const p = chart(id);
      const values = buildModelPlan(p, key(id));
      for (const name of names) {
        if (NOT_COMPUTABLE.has(`${id}:${name}`)) continue;
        const value = values[name];
        expect(value === true || value === false || String(value ?? '').trim().length > 0, `${id}:${name}`).toBe(true);
      }
      expect(values.ind1_drug, `${id} induction`).toBeTruthy();
      expect(values.mnt1_drug, `${id} maintenance`).toBeTruthy();
      expect(values.emg1_drug, `${id} emergence`).toBeTruthy();
      expect(values.prob3_problem, `${id} problems`).toBeTruthy();
      (p.home_meds ?? []).slice(0, 8).forEach((_, i) => expect(values[`med${i + 1}_status`], `${id} med ${i + 1}`).toBeTruthy());
      expect(JSON.stringify(values), id).not.toMatch(DASH);
      expect(JSON.stringify(values), id).not.toMatch(/undefined|NaN|\[object/);
    }
  });

  it('writes the airway exam, drugs for the weight and the right plan for the full stomach RSI patient', () => {
    const values = buildModelPlan(chart('p52'), key('p52'));
    expect(values.mallampati).toBe('III');
    expect(values.difficultAirway).toBe('Possible');
    expect(values.technique).toBe('GA with ETT');
    expect(values.ind2_drug).toBe('Propofol');
    expect(values.ind2_perKg).toMatch(/LBW/);
    expect(values.ind3_drug).toBe('Rocuronium');
    expect(values.ind3_perKg).toMatch(/1\.2 mg\/kg \(IBW/);
    expect(values.airwayPlanA).toMatch(/video laryngoscope/i);
    expect(values.airwayPlanC).toMatch(/cricothyrotomy/);
    expect(values.extubationCriteria).toMatch(/TOF ratio 0\.9/);
    expect(values.stopBang).toMatch(/^6 of 8/);
    expect(values.cont1_if).toBeTruthy();
    expect(values.pacuReport).toMatch(/Denise/);
  });

  it('respects allergies and the patient type', () => {
    const p10 = buildModelPlan(chart('p10'), key('p10'));
    expect(JSON.stringify(p10)).not.toMatch(/"Ondansetron"/);
    const p37 = buildModelPlan(chart('p37'), key('p37'));
    expect(p37.technique).toBe('GA by mask');
    expect(p37.rcri).toMatch(/pediatric/);
    expect(p37.extubationCriteria).toMatch(/No airway device/);
    const p03 = buildModelPlan(chart('p03'), key('p03'));
    expect(p03.technique).toBe('Neuraxial');
    expect(p03.ind2_drug).toBe('Spinal');
  });

  it('scores Apfel and RCRI from the chart, not from family history', () => {
    expect(apfelScore(chart('p20')).score).toBe(4);
    expect(rcri(chart('p52'), chart('p52').case.procedure)).toMatch(/^1 \(high risk surgery\)/);
    expect(rcri(chart('p07'), chart('p07').case.procedure)).toMatch(/ischemic heart disease/);
  });

  it('files a complete record when the instructor moves the student on', () => {
    const record = buildInstructorPlanRecord(chart('p51'), key('p51'), new Date('2026-10-27T12:00:00Z'));
    expect(record.values.mallampati).toBe('II');
    expect(record.values.ind4_drug).toBe('Rocuronium');
    expect(record.grade).toBeTruthy();
  });
});
