/* Mock OR Day care plan sheet.

   A digital version of the two page preoperative sheet the program fills out
   before simulations: page 1 "General Anesthesia Care Plan" (patient, NPO,
   consents, meds, airway, systems, labs, risk scores, prioritized problem
   list) and page 2 "Anesthetic Plan and Surgical Procedure" (technique, drugs
   by phase, airway plans, calculations, contingencies, PACU report).

   Chart identifiers autofill from the chart; the clinical thinking is the
   trainee's. Grading is offline first: the plan text is matched against the
   case answer key (a draft drafted from the chart for faculty review), the
   go or delay decision and ASA are compared, and the fluid and blood
   calculations are checked against reference values. Booth's narrative
   review is layered on top through /api/sim-operator mode 'plan'.

   Pure helpers are exported for tests; the DOM controller is at the bottom. */

export const CARE_PLAN_STORAGE_PREFIX = 'overlord.careplan.v1.';

const MED_ROWS = 8;
const PROBLEM_ROWS = 7;
const DRUG_ROWS = 4;
const CONTINGENCY_ROWS = 3;

export const DECISION_OPTIONS = Object.freeze([
  { id: '', label: 'Choose' },
  { id: 'proceed', label: 'Proceed as planned' },
  { id: 'proceed_mod', label: 'Proceed with modifications' },
  { id: 'delay', label: 'Delay or cancel' },
]);

export const BOARD_QUESTION = Object.freeze({
  prompt: 'Surgical prophylaxis: when should cefazolin finish infusing relative to incision?',
  options: [
    ['A', 'Within 120 minutes before incision'],
    ['B', 'Within 60 minutes before incision'],
    ['C', 'At the time of incision'],
    ['D', 'After skin closure'],
  ],
  answer: 'B',
});

/* Field schema. Each field: [name, label, kind, extra]. kind is text, area,
   num, select, check. Grouped by section and page. */
const t = (name, label, extra = {}) => ({ name, label, kind: 'text', ...extra });
const a = (name, label, extra = {}) => ({ name, label, kind: 'area', ...extra });
const n = (name, label, extra = {}) => ({ name, label, kind: 'num', ...extra });
const c = (name, label) => ({ name, label, kind: 'check' });
const sel = (name, label, options) => ({ name, label, kind: 'select', options });

function rows(prefix, count, columns) {
  const out = [];
  for (let i = 1; i <= count; i += 1) {
    for (const [key, label] of columns) out.push(t(`${prefix}${i}_${key}`, `${label} ${i}`, { row: i, column: key }));
  }
  return out;
}

export const CARE_PLAN_PAGES = Object.freeze([
  {
    id: 'page1',
    title: 'General Anesthesia Care Plan',
    sections: [
      { id: 'header', title: 'Student', fields: [t('student', 'Student'), t('date', 'Date'), t('preceptor', 'Preceptor'), t('caseNumber', 'Case')] },
      { id: 'procedure', title: 'Procedure', fields: [t('procedure', 'Procedure', { wide: true, auto: true }), t('indication', 'Indication', { wide: true, auto: true }), t('surgeon', 'Surgeon', { auto: true }), t('position', 'Position', { auto: true }), t('duration', 'Duration', { auto: true })] },
      { id: 'patient', title: 'Patient', fields: [
        t('ageSex', 'Age / sex', { auto: true }), n('heightCm', 'Height (cm)', { auto: true }), n('weightKg', 'Weight (kg)', { auto: true }),
        n('bmi', 'BMI'), t('asa', 'ASA (e.g. 3 or 3E)'), n('ibw', 'IBW (kg)'), n('lbw', 'LBW (kg)'), t('allergies', 'Allergies (reaction)', { wide: true, auto: true }),
      ] },
      { id: 'npo', title: 'NPO and consent', fields: [
        t('npoSolids', 'NPO solids (last)', { auto: true }), t('npoClears', 'NPO clears (last)', { auto: true }),
        c('consentSurgical', 'Surgical consent signed'), c('consentAnesthesia', 'Anesthesia consent signed'), c('consentBlood', 'Blood consent signed'),
        t('codeStatus', 'Code status', { auto: true }),
      ] },
      { id: 'vitals', title: 'Preop vitals', fields: [t('vitalBp', 'BP', { auto: true }), t('vitalHr', 'HR', { auto: true }), t('vitalRr', 'RR', { auto: true }), t('vitalSpo2', 'SpO2', { auto: true }), t('vitalTemp', 'Temp', { auto: true })] },
      { id: 'meds', title: 'Home medications', table: { prefix: 'med', count: MED_ROWS, columns: [['name', 'Medication'], ['last', 'Last dose'], ['status', 'Taken / held / note']] } },
      { id: 'airway', title: 'Airway', fields: [
        t('mallampati', 'Mallampati'), t('tmd', 'TMD'), t('mouthOpening', 'Mouth opening'), t('neckExtension', 'Neck extension'),
        t('dentition', 'Dentition'), t('priorGrade', 'Prior grade / device'), sel('difficultAirway', 'Anticipated difficulty', ['', 'No', 'Possible', 'Yes']),
      ] },
      { id: 'systems', title: 'Systems (by exception)', fields: [
        a('sysCv', 'Cardiovascular'), a('sysResp', 'Respiratory'), a('sysNeuro', 'Neuro / psych'), a('sysRenal', 'Renal / GU'),
        a('sysGi', 'GI / hepatic'), a('sysEndo', 'Endocrine'), a('sysHeme', 'Heme / coag'), a('sysOther', 'Other (MSK, skin, OB)'),
      ] },
      { id: 'labs', title: 'Labs and studies', fields: [
        t('labNa', 'Na'), t('labK', 'K'), t('labCl', 'Cl'), t('labCo2', 'CO2'), t('labBun', 'BUN'), t('labCr', 'Cr'), t('labGlu', 'Glu'),
        t('labHgb', 'Hgb'), t('labHct', 'Hct'), t('labPlt', 'Plt'), t('labWbc', 'WBC'),
        t('labInr', 'PT / INR'), t('labPtt', 'PTT'), t('labMgCa', 'Mg / Ca'), t('labA1c', 'A1c'), t('labHcg', 'hCG'),
        a('studyEcg', 'ECG'), a('studyEcho', 'Echo / stress'), a('studyCxr', 'CXR / other imaging'),
      ] },
      { id: 'social', title: 'History', fields: [t('tobacco', 'Tobacco'), t('alcoholDrugs', 'Alcohol / drugs'), a('priorAnesthesia', 'Prior anesthesia, personal and family')] },
      { id: 'scores', title: 'Risk scores', fields: [t('apfel', 'Apfel (PONV)'), t('mets', 'METs'), t('rcri', 'RCRI'), t('stopBang', 'STOP-Bang')] },
      { id: 'problems', title: 'Prioritized problem list', table: { prefix: 'prob', count: PROBLEM_ROWS, columns: [['problem', 'Problem'], ['implication', 'Anesthetic implication'], ['plan', 'Plan']] } },
      { id: 'decision', title: 'Decision', fields: [
        sel('decision', 'Go / no go', DECISION_OPTIONS.map((o) => o.id)),
        a('decisionRationale', 'Rationale (who you would call, what must change first)', { wide: true }),
      ] },
    ],
  },
  {
    id: 'page2',
    title: 'Anesthetic Plan and Surgical Procedure',
    sections: [
      { id: 'technique', title: 'Technique', fields: [
        sel('technique', 'Primary technique', ['', 'GA with ETT', 'GA with LMA', 'MAC', 'Neuraxial', 'Peripheral nerve block', 'Combined GA and regional', 'TIVA']),
        a('techniqueDetail', 'Technique details and why', { wide: true }),
        a('monitorsAccess', 'Monitors and access (ASA standard plus)'), a('positioning', 'Positioning and padding'),
      ] },
      { id: 'surgery', title: 'Surgical procedure', fields: [
        a('surgicalOverview', 'Overview', { wide: true }), a('keySurgicalSteps', 'Key steps with anesthetic implications', { wide: true }),
        t('antibiotic', 'Antibiotic, dose, time'), t('antibioticRedose', 'Redose interval'),
      ] },
      { id: 'drugsInduction', title: 'Induction drugs', table: { prefix: 'ind', count: DRUG_ROWS, columns: [['drug', 'Drug'], ['perKg', 'Dose per kg'], ['total', 'Total for this patient']] } },
      { id: 'drugsMaintenance', title: 'Maintenance', table: { prefix: 'mnt', count: DRUG_ROWS, columns: [['drug', 'Drug or agent'], ['perKg', 'Dose / setting'], ['total', 'Total or target']] } },
      { id: 'drugsEmergence', title: 'Emergence and analgesia', table: { prefix: 'emg', count: DRUG_ROWS, columns: [['drug', 'Drug'], ['perKg', 'Dose per kg'], ['total', 'Total for this patient']] } },
      { id: 'airwayPlans', title: 'Airway plans', fields: [a('airwayPlanA', 'Plan A'), a('airwayPlanB', 'Plan B'), a('airwayPlanC', 'Plan C (cannot intubate, cannot oxygenate)')] },
      { id: 'ponvEmergence', title: 'PONV and emergence', fields: [a('ponvProphylaxis', 'PONV prophylaxis'), a('extubationCriteria', 'Extubation criteria')] },
      { id: 'calcs', title: 'Calculations', fields: [
        n('ebv', 'EBV (mL)'), n('abl', 'ABL (mL)'), t('ablTarget', 'Target Hct used'), n('maintenanceRate', '4-2-1 maintenance (mL/h)'),
        n('npoHours', 'NPO hours (clears)'), n('npoDeficit', 'NPO deficit (mL)'), a('lossReplacement', 'Surgical loss replacement plan'),
      ] },
      { id: 'contingency', title: 'Contingencies', table: { prefix: 'cont', count: CONTINGENCY_ROWS, columns: [['if', 'If'], ['first', 'First action'], ['then', 'Then']] } },
      { id: 'handoff', title: 'PACU report and reflection', fields: [a('pacuReport', 'PACU report', { wide: true }), a('reflection', 'Reflection: what worries you most about this patient', { wide: true })] },
      { id: 'board', title: 'Board question', fields: [sel('boardAnswer', BOARD_QUESTION.prompt, ['', ...BOARD_QUESTION.options.map(([key]) => key)])] },
    ],
  },
]);

export function allFieldNames() {
  const names = [];
  for (const page of CARE_PLAN_PAGES) {
    for (const section of page.sections) {
      if (section.table) {
        const { prefix, count, columns } = section.table;
        for (let i = 1; i <= count; i += 1) for (const [key] of columns) names.push(`${prefix}${i}_${key}`);
      } else {
        for (const field of section.fields) names.push(field.name);
      }
    }
  }
  return names;
}

/* ---------- chart helpers ---------- */

function str(value) { return value === null || value === undefined ? '' : String(value); }

export function parseChartDateTime(text) {
  const match = /(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{2})(\d{2}))?/.exec(str(text));
  if (!match) return null;
  const [, mm, dd, yyyy, hh = '00', mi = '00'] = match;
  return new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(mi)));
}

export function surgeryDateTime(patient) {
  const arrived = parseChartDateTime(patient?.preop?.arrived);
  const time = /^(\d{2})(\d{2})$/.exec(str(patient?.time));
  const base = arrived ?? new Date(Date.UTC(2026, 9, 27));
  if (!time) return null;
  return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), Number(time[1]), Number(time[2])));
}

export function ageYearsFromChart(ageText) {
  const match = /([\d.]+)\s*(y|mo|wk|d)/i.exec(str(ageText));
  if (!match) return null;
  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit === 'y') return value;
  if (unit === 'mo') return value / 12;
  if (unit === 'wk') return value / 52;
  return value / 365;
}

function latestVitals(patient) {
  const list = Array.isArray(patient?.vitals) ? patient.vitals : [];
  return list.length > 0 ? list[list.length - 1] : null;
}

function latestLabValue(patient, key) {
  const cols = patient?.labs?.cols ?? [];
  for (const col of cols) {
    const value = col?.vals?.[key];
    if (value && value[0] !== '' && value[0] !== undefined) return { value: value[0], flag: value[1] ?? '', dt: col.dt };
  }
  return null;
}

export function latestHct(patient) {
  const hit = latestLabValue(patient, 'Hct');
  const value = hit ? Number(hit.value) : NaN;
  return Number.isFinite(value) ? value : null;
}

/* Identifiers and logistics only; the clinical thinking is the trainee's. */
export function autofillFromChart(patient) {
  if (!patient) return {};
  const caseInfo = patient.case ?? {};
  const v = latestVitals(patient);
  const allergies = (patient.allergies ?? []).length === 0
    ? 'NKDA'
    : patient.allergies.map((row) => `${row[0]} (${row[1]})`).join('; ');
  const out = {
    caseNumber: `${patient.id.toUpperCase()} · ${patient.room} ${patient.time}`,
    procedure: str(caseInfo.procedure),
    indication: str(caseInfo.indication),
    surgeon: str(caseInfo.surgeon),
    position: str(caseInfo.position),
    duration: caseInfo.duration_min ? `${caseInfo.duration_min} min` : '',
    ageSex: `${str(patient.age)} ${str(patient.sex)}`.trim(),
    heightCm: patient.ht_cm ?? '',
    weightKg: patient.wt_kg ?? '',
    allergies,
    npoSolids: str(patient.preop?.npo_solids),
    npoClears: str(patient.preop?.npo_clears),
    codeStatus: str(patient.code_status),
  };
  if (v) {
    out.vitalBp = str(v[1]);
    out.vitalHr = str(v[2]);
    out.vitalRr = str(v[3]);
    out.vitalSpo2 = str(v[4]);
    out.vitalTemp = str(v[5]);
  }
  (patient.home_meds ?? []).slice(0, MED_ROWS).forEach((row, index) => {
    out[`med${index + 1}_name`] = `${str(row[0])} ${str(row[1])}`.trim();
    out[`med${index + 1}_last`] = str(row[3]);
  });
  return out;
}

/* Optional helper the trainee can press: copy the newest value of each lab. */
export function labsFromChart(patient) {
  const pick = (key) => latestLabValue(patient, key)?.value ?? '';
  const inr = [pick('PT'), pick('INR')].filter(Boolean).join(' / ');
  const mgCa = [pick('Mg'), pick('Ca')].filter(Boolean).join(' / ');
  return {
    labNa: pick('Na'), labK: pick('K'), labCl: pick('Cl'), labCo2: pick('CO2'), labBun: pick('BUN'), labCr: pick('Cr'), labGlu: pick('Glu'),
    labHgb: pick('Hgb'), labHct: pick('Hct'), labPlt: pick('Plt'), labWbc: pick('WBC'), labInr: inr, labPtt: pick('aPTT'), labMgCa: mgCa,
  };
}

/* ---------- calculations ---------- */

const round = (value, digits = 0) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

export function maintenanceRate421(weightKg) {
  const w = Number(weightKg);
  if (!Number.isFinite(w) || w <= 0) return null;
  return Math.min(w, 10) * 4 + Math.max(0, Math.min(w, 20) - 10) * 2 + Math.max(0, w - 20);
}

export function ebvPerKg(ageYears, sex) {
  if (Number.isFinite(ageYears)) {
    if (ageYears < 1 / 12) return 85; // neonate
    if (ageYears < 1) return 80;
    if (ageYears < 12) return 75;
  }
  return sex === 'F' || sex === 'Female' ? 65 : 75;
}

/* Reference values for the calculations the sheet asks for. Formulas are
   stated so a grader can see exactly what was compared. */
export function computeReferenceCalcs(patient, { targetHct = 21 } = {}) {
  const heightCm = Number(patient?.ht_cm);
  const weightKg = Number(patient?.wt_kg);
  const sex = patient?.sex === 'F' ? 'F' : 'M';
  const ageYears = ageYearsFromChart(patient?.age);
  const out = { formulas: {} };
  if (Number.isFinite(heightCm) && Number.isFinite(weightKg) && heightCm > 0) {
    const m = heightCm / 100;
    out.bmi = round(weightKg / (m * m), 1);
    const overFiveFeet = heightCm - 152.4;
    out.ibw = round((sex === 'M' ? 50 : 45.5) + 0.9055 * overFiveFeet, 1);
    out.formulas.ibw = 'Devine: 50 kg (male) or 45.5 kg (female) plus 2.3 kg per inch over 5 feet';
    const bmi = weightKg / (m * m);
    out.lbw = round(sex === 'M' ? (9270 * weightKg) / (6680 + 216 * bmi) : (9270 * weightKg) / (8780 + 244 * bmi), 1);
    out.formulas.lbw = 'Janmahasatian lean body weight';
  }
  if (Number.isFinite(weightKg)) {
    const perKg = ebvPerKg(ageYears, sex);
    out.ebv = Math.round(weightKg * perKg);
    out.formulas.ebv = `${perKg} mL/kg x weight`;
    const hct = latestHct(patient);
    if (hct !== null) {
      out.startHct = hct;
      out.targetHct = targetHct;
      out.abl = hct > targetHct ? Math.round((out.ebv * (hct - targetHct)) / hct) : 0;
      out.formulas.abl = `EBV x (Hct ${hct} minus target ${targetHct}) / Hct ${hct}`;
    }
    out.maintenanceRate = maintenanceRate421(weightKg);
    out.formulas.maintenanceRate = '4 mL/kg/h first 10 kg, 2 mL/kg/h next 10 kg, 1 mL/kg/h after';
    const start = surgeryDateTime(patient);
    const clears = parseChartDateTime(patient?.preop?.npo_clears);
    if (start && clears && start > clears) {
      out.npoHours = round((start - clears) / 3600000, 1);
      out.npoDeficit = Math.round(out.npoHours * out.maintenanceRate);
      out.formulas.npoDeficit = `${out.npoHours} h since last clears x maintenance rate`;
    }
  }
  return out;
}

function numberIn(text) {
  const match = /-?\d+(?:\.\d+)?/.exec(str(text).replace(/,/g, ''));
  return match ? Number(match[0]) : null;
}

/* Calculations are teaching feedback, not points: different targets (Hct 21
   vs 30, averaged ABL formulas) are defensible, so a mismatch is flagged as
   'check' with the reference and formula rather than marked wrong. */
export function checkCalculations(values, reference) {
  const specs = [
    ['bmi', 'BMI', 0.05],
    ['ibw', 'IBW', 0.08],
    ['lbw', 'LBW', 0.12],
    ['ebv', 'EBV', 0.12],
    ['abl', 'ABL', 0.25],
    ['maintenanceRate', '4-2-1 maintenance', 0.05],
    ['npoDeficit', 'NPO deficit', 0.2],
  ];
  return specs.map(([key, label, tolerance]) => {
    const expected = reference[key];
    const entered = numberIn(values[key]);
    if (expected === undefined || expected === null) return { key, label, status: 'n/a', entered, expected: null, formula: null };
    if (entered === null) return { key, label, status: 'blank', entered: null, expected, formula: reference.formulas?.[key] ?? null };
    const ok = expected === 0 ? Math.abs(entered) < 1 : Math.abs(entered - expected) / Math.abs(expected) <= tolerance;
    return { key, label, status: ok ? 'ok' : 'check', entered, expected, formula: reference.formulas?.[key] ?? null };
  });
}

/* ---------- grading ---------- */

export function planText(values = {}) {
  return Object.entries(values)
    .filter(([key]) => !['student', 'preceptor', 'date', 'caseNumber'].includes(key))
    .map(([, value]) => (typeof value === 'string' ? value : ''))
    .join(' \n ')
    .toLowerCase();
}

function escapeRegExp(text) { return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/* Short keywords (rsi, ett, tof) need word boundaries so 'rsi' does not match
   'versions'. Longer stems (sickl, hydrat) match as prefixes. */
export function keywordHit(text, keyword) {
  const k = str(keyword).toLowerCase().trim();
  if (!k) return false;
  if (k.length <= 4) return new RegExp(`(^|[^a-z0-9])${escapeRegExp(k)}([^a-z0-9]|$)`).test(text);
  return text.includes(k);
}

export const SEVERITY_POINTS = Object.freeze({ critical: 5, major: 2, minor: 1 });

/* A plan that misses a critical chart finding is not a passing plan, however
   tidy the rest of it is. */
export const MISSED_CRITICAL_CAP = 60;

export function decisionCategory(recommendation) {
  const text = str(recommendation).toLowerCase();
  if (/^(delay|hold|cancel|postpone|discuss delay)/.test(text) || /^discuss .*delay/.test(text)) return 'delay';
  if (/delay|hold the|postpone|cancel/.test(text) && !/^proceed/.test(text)) return 'delay';
  if (/^proceed( now| \(urgent\)| \(emergent\))?$/.test(text) || text === 'proceed') return 'proceed';
  if (/^proceed/.test(text)) return 'proceed_mod';
  if (/first; proceed|then proceed|change the technique/.test(text)) return 'proceed_mod';
  return 'proceed_mod';
}

export function gradeCarePlan(values = {}, answerKey = null, patient = null) {
  const text = planText(values);
  const result = {
    earned: 0, possible: 0, percent: 0,
    redFlags: [], planItems: [], decision: null, asa: null, calcChecks: [], board: null,
    missedCritical: [], completeness: [],
  };
  if (answerKey) {
    for (const flag of answerKey.redFlags ?? []) {
      const points = SEVERITY_POINTS[flag.severity] ?? 1;
      const matched = (flag.keywords ?? []).filter((keyword) => keywordHit(text, keyword));
      const found = matched.length > 0;
      result.possible += points;
      if (found) result.earned += points;
      else if (flag.severity === 'critical') result.missedCritical.push(flag.finding);
      result.redFlags.push({ id: flag.id, severity: flag.severity, finding: flag.finding, found, matched, evidence: flag.evidence, action: flag.action });
    }
    for (const item of answerKey.planItems ?? []) {
      const found = (item.keywords ?? []).some((keyword) => keywordHit(text, keyword));
      result.possible += 1;
      if (found) result.earned += 1;
      result.planItems.push({ domain: item.domain, item: item.item, found });
    }
    const expected = decisionCategory(answerKey.decision?.recommendation);
    const chosen = values.decision || '';
    let points = 0;
    if (chosen === expected) points = 2;
    else if (chosen && ((chosen === 'proceed' && expected === 'proceed_mod') || (chosen === 'proceed_mod' && expected === 'proceed'))) points = 1;
    else if (chosen && ((chosen === 'proceed_mod' && expected === 'delay') || (chosen === 'delay' && expected === 'proceed_mod'))) points = 1;
    result.possible += 2;
    result.earned += points;
    result.decision = { chosen, expected, points, recommendation: answerKey.decision?.recommendation ?? '', rationale: answerKey.decision?.rationale ?? '' };
    const asaExpected = str(answerKey.asa?.suggested).toUpperCase().replace(/\s/g, '');
    const asaEntered = str(values.asa).toUpperCase().replace(/^ASA/, '').replace(/\s/g, '');
    if (asaExpected) {
      const sameClass = asaEntered.replace('E', '') === asaExpected.replace('E', '');
      const sameE = asaEntered.endsWith('E') === asaExpected.endsWith('E');
      const asaPoints = sameClass && sameE ? 1 : 0;
      result.possible += 1;
      result.earned += asaPoints;
      result.asa = { entered: asaEntered, expected: asaExpected, points: asaPoints, rationale: answerKey.asa?.rationale ?? '' };
    }
  }
  const boardPoints = values.boardAnswer === BOARD_QUESTION.answer ? 1 : 0;
  result.possible += 1;
  result.earned += boardPoints;
  result.board = { entered: values.boardAnswer ?? '', expected: BOARD_QUESTION.answer, points: boardPoints };
  if (patient) result.calcChecks = checkCalculations(values, computeReferenceCalcs(patient));
  result.completeness = missingRequired(values);
  const raw = result.possible > 0 ? Math.round((result.earned / result.possible) * 100) : 0;
  result.rawPercent = raw;
  result.capped = result.missedCritical.length > 0 && raw > MISSED_CRITICAL_CAP;
  result.percent = result.capped ? MISSED_CRITICAL_CAP : raw;
  return result;
}

/* START unlocks once these exist. Kept short: the sheet is long, and the gate
   is about thinking before touching the patient, not data entry. */
export function missingRequired(values = {}) {
  const missing = [];
  if (!str(values.asa).trim()) missing.push('ASA');
  if (!values.decision) missing.push('Go / no go decision');
  if (!values.technique) missing.push('Primary technique');
  if (!str(values.airwayPlanA).trim()) missing.push('Airway plan A');
  const problems = [1, 2, 3, 4, 5, 6, 7].filter((i) => str(values[`prob${i}_problem`]).trim()).length;
  if (problems < 3) missing.push(`Problem list (${problems} of 3 minimum)`);
  return missing;
}

/* Booth's offline verdict, used when the language model is unavailable. */
export function offlinePlanVerdict(grade, { meanness = 2 } = {}) {
  const lines = [];
  const pct = grade.percent;
  if (grade.missedCritical.length > 0) {
    lines.push(meanness >= 3
      ? 'The rest of this plan is decorative. You missed the thing that hurts the patient.'
      : (meanness === 2 ? 'Neat handwriting on a plan that misses the most dangerous thing in the chart.' : 'This plan misses a critical chart finding.'));
    if (grade.capped) lines.push(`Score capped at ${MISSED_CRITICAL_CAP}% until it is addressed.`);
  } else if (meanness >= 3) lines.push(pct >= 80 ? 'Fine. You read the chart. Do you want a medal?' : (pct >= 55 ? 'Half a plan. The patient gets the other half of an anesthetic, I guess.' : 'This plan reads like you skimmed the chart from the hallway.'));
  else if (meanness === 2) lines.push(pct >= 80 ? 'Solid plan. Annoyingly solid.' : (pct >= 55 ? 'Passable, with holes I could drive a crash cart through.' : 'This plan has gaps. Big ones.'));
  else lines.push(pct >= 80 ? 'Good plan.' : (pct >= 55 ? 'Reasonable start with important gaps.' : 'This plan misses major chart findings.'));
  if (grade.missedCritical.length > 0) lines.push(`Missed critical: ${grade.missedCritical.slice(0, 2).join('; ')}.`);
  const missedMajor = grade.redFlags.filter((f) => !f.found && f.severity === 'major').map((f) => f.finding);
  if (missedMajor.length > 0) lines.push(`Also not addressed: ${missedMajor.slice(0, 2).join('; ')}.`);
  if (grade.decision && grade.decision.points < 2 && grade.decision.expected) {
    const label = DECISION_OPTIONS.find((o) => o.id === grade.decision.expected)?.label ?? grade.decision.expected;
    lines.push(`On go or no go, the key says: ${label.toLowerCase()} (${grade.decision.recommendation}).`);
  }
  const calcIssues = grade.calcChecks.filter((check) => check.status === 'check').map((check) => `${check.label} (yours ${check.entered}, reference ${check.expected})`);
  if (calcIssues.length > 0) lines.push(`Recheck: ${calcIssues.slice(0, 3).join('; ')}.`);
  const hits = grade.redFlags.filter((f) => f.found && f.severity !== 'minor');
  if (hits.length > 0) lines.push(`You did catch ${hits[0].finding.toLowerCase()}.`);
  return lines.join(' ');
}

/* Context for Booth's language model review. The chart goes in as a digest. */
export function buildPlanReviewContext({ patient, chartDigest, values, answerKey, grade }) {
  const filled = Object.fromEntries(Object.entries(values ?? {}).filter(([, value]) => value !== '' && value !== false && value !== null && value !== undefined));
  return {
    patient: patient ? { id: patient.id, name: patient.label, age: patient.age, sex: patient.sex, procedure: patient.case?.procedure } : null,
    chart: chartDigest ?? null,
    plan: filled,
    answerKey: answerKey ? {
      status: answerKey.status, summary: answerKey.summary, asa: answerKey.asa, decision: answerKey.decision,
      redFlags: (answerKey.redFlags ?? []).map(({ severity, finding, evidence, action }) => ({ severity, finding, evidence, action })),
      planItems: (answerKey.planItems ?? []).map(({ domain, item }) => ({ domain, item })),
    } : null,
    offlineGrade: grade ? {
      percent: grade.percent,
      found: grade.redFlags.filter((f) => f.found).map((f) => f.finding),
      missed: grade.redFlags.filter((f) => !f.found).map((f) => `${f.severity}: ${f.finding}`),
      decision: grade.decision, asa: grade.asa,
      calcChecks: grade.calcChecks.filter((check) => check.status !== 'n/a'),
    } : null,
  };
}

/* ---------- storage ---------- */

export function loadStoredPlan(storage, patientId) {
  try {
    const raw = storage?.getItem?.(`${CARE_PLAN_STORAGE_PREFIX}${patientId}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveStoredPlan(storage, patientId, record) {
  try { storage?.setItem?.(`${CARE_PLAN_STORAGE_PREFIX}${patientId}`, JSON.stringify(record)); return true; } catch { return false; }
}

/* ---------- markup ---------- */

function esc(value) {
  return str(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function fieldMarkup(field, values) {
  const id = `cp-${field.name}`;
  const value = values[field.name] ?? '';
  const cls = `cp-field cp-${field.kind}${field.wide ? ' cp-wide' : ''}${field.auto ? ' cp-auto' : ''}`;
  if (field.kind === 'check') {
    return `<label class="${cls}" for="${id}"><input id="${id}" name="${field.name}" type="checkbox"${value ? ' checked' : ''}><span>${esc(field.label)}</span></label>`;
  }
  if (field.kind === 'select') {
    const labels = field.name === 'decision' ? Object.fromEntries(DECISION_OPTIONS.map((o) => [o.id, o.label]))
      : field.name === 'boardAnswer' ? Object.fromEntries([['', 'Choose'], ...BOARD_QUESTION.options.map(([key, text]) => [key, `${key}. ${text}`])])
        : null;
    const opts = field.options.map((option) => `<option value="${esc(option)}"${option === value ? ' selected' : ''}>${esc(labels?.[option] ?? (option || 'Choose'))}</option>`).join('');
    return `<label class="${cls}" for="${id}"><span>${esc(field.label)}</span><select id="${id}" name="${field.name}">${opts}</select></label>`;
  }
  if (field.kind === 'area') {
    return `<label class="${cls}" for="${id}"><span>${esc(field.label)}</span><textarea id="${id}" name="${field.name}" rows="2">${esc(value)}</textarea></label>`;
  }
  const type = field.kind === 'num' ? 'text" inputmode="decimal' : 'text';
  return `<label class="${cls}" for="${id}"><span>${esc(field.label)}</span><input id="${id}" name="${field.name}" type="${type}" value="${esc(value)}" autocomplete="off"></label>`;
}

function tableMarkup(section, values) {
  const { prefix, count, columns } = section.table;
  const head = columns.map(([, label]) => `<th scope="col">${esc(label)}</th>`).join('');
  const body = [];
  for (let i = 1; i <= count; i += 1) {
    body.push(`<tr><th scope="row">${i}</th>${columns.map(([key, label]) => {
      const name = `${prefix}${i}_${key}`;
      return `<td><input name="${name}" aria-label="${esc(label)} ${i}" value="${esc(values[name] ?? '')}" autocomplete="off"></td>`;
    }).join('')}</tr>`);
  }
  return `<table class="cp-table"><thead><tr><th scope="col">#</th>${head}</tr></thead><tbody>${body.join('')}</tbody></table>`;
}

export function renderCarePlanForm(values = {}) {
  return CARE_PLAN_PAGES.map((page, index) => `
    <section class="cp-page" data-cp-page="${page.id}"${index === 0 ? '' : ' hidden'} aria-label="${esc(page.title)}">
      <h3 class="cp-page-title">${esc(page.title)}</h3>
      ${page.sections.map((section) => `
        <fieldset class="cp-section" data-cp-section="${section.id}">
          <legend>${esc(section.title)}</legend>
          ${section.id === 'labs' ? '<button type="button" class="cp-inline-button" data-cp-action="labs">COPY LATEST LABS FROM CHART</button>' : ''}
          ${section.id === 'calcs' ? '<button type="button" class="cp-inline-button" data-cp-action="bmi">CALCULATE BMI ONLY</button>' : ''}
          ${section.table ? tableMarkup(section, values) : `<div class="cp-grid">${section.fields.map((field) => fieldMarkup(field, values)).join('')}</div>`}
        </fieldset>`).join('')}
    </section>`).join('');
}

export function renderCarePlanModal() {
  return `
    <div id="careplan-modal" class="cp-modal" role="dialog" aria-modal="true" aria-labelledby="careplan-title" hidden>
      <div class="cp-dialog">
        <header class="cp-header">
          <div>
            <p class="live-eyebrow">MOCK OR DAY · PREOP CARE PLAN</p>
            <h2 id="careplan-title">Care plan</h2>
            <p id="careplan-patient" class="cp-patient"></p>
          </div>
          <div class="cp-header-actions">
            <button type="button" data-cp-action="chart">OPEN CHART</button>
            <button type="button" data-cp-action="print">PRINT</button>
            <button type="button" data-cp-action="close" class="live-secondary">CLOSE</button>
          </div>
        </header>
        <nav class="cp-tabs" role="tablist" aria-label="Care plan pages">
          <button type="button" role="tab" data-cp-tab="page1" aria-selected="true">PAGE 1 · CARE PLAN</button>
          <button type="button" role="tab" data-cp-tab="page2" aria-selected="false">PAGE 2 · ANESTHETIC PLAN</button>
          <button type="button" role="tab" data-cp-tab="result" aria-selected="false">BOOTH'S GRADE</button>
        </nav>
        <form id="careplan-form" class="cp-form" novalidate></form>
        <section id="careplan-result" class="cp-result" data-cp-page="result" hidden aria-live="polite"></section>
        <footer class="cp-footer">
          <output id="careplan-status" class="cp-status">Draft saves on this device as you type.</output>
          <div class="cp-footer-actions">
            <button type="button" data-cp-action="reset" class="live-danger-outline">CLEAR SHEET</button>
            <button type="button" data-cp-action="submit" class="live-primary">SUBMIT FOR GRADING</button>
          </div>
        </footer>
      </div>
    </div>`;
}

function percentClass(pct) { return pct >= 80 ? 'good' : (pct >= 55 ? 'fair' : 'poor'); }

export function renderGradeMarkup(grade, { verdict = '', answerKey = null, aiPending = false } = {}) {
  if (!grade) return '<p class="cp-empty">Submit the plan to see the grade.</p>';
  const flagRows = grade.redFlags.map((flag) => `
    <li class="cp-flag cp-flag-${flag.severity} ${flag.found ? 'cp-found' : 'cp-missed'}">
      <span class="cp-flag-mark">${flag.found ? 'FOUND' : 'MISSED'}</span>
      <strong>${esc(flag.finding)}</strong> <small>${esc(flag.severity)}</small>
      <p>${esc(flag.evidence)}</p>
      ${flag.found ? '' : `<p class="cp-flag-action">Expected: ${esc(flag.action)}</p>`}
    </li>`).join('');
  const items = grade.planItems.map((item) => `<li class="${item.found ? 'cp-found' : 'cp-missed'}">${item.found ? 'Yes' : 'No'} · ${esc(item.item)}</li>`).join('');
  const calcs = grade.calcChecks.filter((check) => check.status !== 'n/a').map((check) => `
    <tr class="cp-calc-${check.status}"><th scope="row">${esc(check.label)}</th><td>${check.entered ?? 'blank'}</td><td>${check.expected}</td><td>${esc(check.status)}</td><td><small>${esc(check.formula ?? '')}</small></td></tr>`).join('');
  const decision = grade.decision ? `<p><strong>Go / no go:</strong> yours ${esc(DECISION_OPTIONS.find((o) => o.id === grade.decision.chosen)?.label ?? 'blank')}; key ${esc(grade.decision.recommendation)} (${grade.decision.points} of 2). <small>${esc(grade.decision.rationale)}</small></p>` : '';
  const asa = grade.asa ? `<p><strong>ASA:</strong> yours ${esc(grade.asa.entered || 'blank')}; key ${esc(grade.asa.expected)} (${grade.asa.points} of 1). <small>${esc(grade.asa.rationale)}</small></p>` : '';
  const board = `<p><strong>Board question:</strong> yours ${esc(grade.board.entered || 'blank')}; answer ${grade.board.expected}.</p>`;
  return `
    <div class="cp-score cp-score-${percentClass(grade.percent)}"><strong>${grade.percent}%</strong><span>${grade.earned} of ${grade.possible} points${grade.capped ? ` · capped at ${MISSED_CRITICAL_CAP}% for a missed critical finding` : ''}</span></div>
    <div class="cp-verdict"><span class="cp-verdict-name">BOOTH</span><p id="careplan-verdict">${esc(verdict)}${aiPending ? ' <em>(Booth is reading your plan...)</em>' : ''}</p></div>
    ${answerKey?.status === 'draft' ? `<p class="cp-draft-note">${esc(answerKey.reviewNote ?? 'Draft answer key for faculty review.')}</p>` : ''}
    ${answerKey?.summary ? `<p class="cp-key-summary"><strong>Case:</strong> ${esc(answerKey.summary)}</p>` : ''}
    ${decision}${asa}
    <h4>Chart findings</h4><ol class="cp-flags">${flagRows}</ol>
    <h4>Plan elements</h4><ul class="cp-items">${items}</ul>
    ${calcs ? `<h4>Calculations (feedback, not points)</h4><table class="cp-calc-table"><thead><tr><th>Item</th><th>Yours</th><th>Reference</th><th>Status</th><th>Formula</th></tr></thead><tbody>${calcs}</tbody></table>` : ''}
    ${board}
    ${grade.completeness.length ? `<p class="cp-missing">Required before START: ${esc(grade.completeness.join(', '))}</p>` : '<p class="cp-ready">Required items complete. START is unlocked.</p>'}`;
}

/* ---------- controller ---------- */

export function createCarePlanController({
  root = (typeof document !== 'undefined' ? document : null),
  storage = (typeof localStorage !== 'undefined' ? localStorage : null),
  fetchImpl = (typeof fetch !== 'undefined' ? fetch : null),
  getMeanness = () => 2,
  onOpenChart = () => {},
  onGraded = () => {},
} = {}) {
  const modal = root?.getElementById?.('careplan-modal');
  const form = root?.getElementById?.('careplan-form');
  const resultPane = root?.getElementById?.('careplan-result');
  const statusOut = root?.getElementById?.('careplan-status');
  const patientOut = root?.getElementById?.('careplan-patient');
  let current = null; // { patient, answerKey, chartDigest, record }
  let saveTimer = null;

  function setStatus(text) { if (statusOut) statusOut.textContent = text; }

  function readValues() {
    const values = {};
    if (!form) return values;
    for (const element of form.elements) {
      if (!element.name) continue;
      values[element.name] = element.type === 'checkbox' ? element.checked : element.value;
    }
    return values;
  }

  function writeValues(values) {
    if (!form) return;
    for (const [key, value] of Object.entries(values)) {
      const element = form.elements.namedItem(key);
      if (!element) continue;
      if (element.type === 'checkbox') element.checked = Boolean(value);
      else element.value = str(value);
    }
  }

  function persist(extra = {}) {
    if (!current) return;
    current.record = { ...(current.record ?? {}), values: readValues(), savedAt: new Date().toISOString(), ...extra };
    saveStoredPlan(storage, current.patient.id, current.record);
  }

  function showTab(tab) {
    for (const button of modal?.querySelectorAll?.('[data-cp-tab]') ?? []) button.setAttribute('aria-selected', String(button.dataset.cpTab === tab));
    for (const page of form?.querySelectorAll?.('[data-cp-page]') ?? []) page.hidden = page.dataset.cpPage !== tab;
    if (form) form.hidden = tab === 'result';
    if (resultPane) resultPane.hidden = tab !== 'result';
  }

  function renderResult({ aiPending = false } = {}) {
    if (!resultPane || !current) return;
    resultPane.innerHTML = renderGradeMarkup(current.record?.grade ?? null, {
      verdict: current.record?.verdict ?? '', answerKey: current.answerKey, aiPending,
    });
  }

  function load({ patient, answerKey, chartDigest }) {
    current = { patient, answerKey, chartDigest, record: loadStoredPlan(storage, patient.id) };
    if (form) form.innerHTML = renderCarePlanForm({});
    const base = { date: new Date().toISOString().slice(0, 10), ...autofillFromChart(patient) };
    writeValues({ ...base, ...(current.record?.values ?? {}) });
    if (patientOut) patientOut.textContent = `${patient.label} · ${patient.age} ${patient.sex} · ${patient.case?.short ?? patient.case?.procedure ?? ''}`;
    renderResult();
    setStatus(current.record?.submittedAt ? `Submitted ${new Date(current.record.submittedAt).toLocaleTimeString()}. Edits need a resubmit.` : 'Draft saves on this device as you type.');
    return status();
  }

  function status() {
    const record = current?.record;
    return {
      loaded: Boolean(current),
      submitted: Boolean(record?.submittedAt) && (record?.grade?.completeness?.length ?? 1) === 0,
      grade: record?.grade ?? null,
    };
  }

  async function submit() {
    if (!current) return null;
    const values = readValues();
    const grade = gradeCarePlan(values, current.answerKey, current.patient);
    const verdict = offlinePlanVerdict(grade, { meanness: getMeanness() });
    const complete = grade.completeness.length === 0;
    persist({ grade, verdict, submittedAt: complete ? new Date().toISOString() : null });
    showTab('result');
    renderResult({ aiPending: complete && Boolean(fetchImpl) });
    setStatus(complete ? 'Submitted. START is unlocked.' : `Not submitted: complete ${grade.completeness.join(', ')}.`);
    onGraded(status());
    if (!complete || !fetchImpl) return grade;
    try {
      const res = await fetchImpl('/api/sim-operator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          mode: 'plan',
          meanness: getMeanness(),
          context: buildPlanReviewContext({ patient: current.patient, chartDigest: current.chartDigest, values, answerKey: current.answerKey, grade }),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data?.reply === 'string' && data.reply.trim()) persist({ verdict: data.reply.trim(), verdictSource: 'ai' });
      }
    } catch { /* offline verdict stands */ }
    renderResult();
    onGraded(status());
    return grade;
  }

  function open() {
    if (!modal || !current) return;
    modal.hidden = false;
    showTab(current.record?.grade ? 'result' : 'page1');
    modal.querySelector?.('[data-cp-tab]')?.focus?.();
  }

  function close() { if (modal) modal.hidden = true; persist(); }

  function handleClick(event) {
    const tab = event.target.closest?.('[data-cp-tab]');
    if (tab) { showTab(tab.dataset.cpTab); return; }
    const action = event.target.closest?.('[data-cp-action]')?.dataset.cpAction;
    if (!action || !current) return;
    if (action === 'close') close();
    else if (action === 'submit') submit();
    else if (action === 'chart') onOpenChart(current.patient.id);
    else if (action === 'print') {
      persist();
      for (const page of form?.querySelectorAll?.('[data-cp-page]') ?? []) page.hidden = false;
      if (form) form.hidden = false;
      root.body?.classList?.add('printing-careplan');
      root.defaultView?.print?.();
      root.body?.classList?.remove('printing-careplan');
      showTab('page1');
    }
    else if (action === 'labs') { writeValues(labsFromChart(current.patient)); persist(); setStatus('Latest chart labs copied. Check them.'); }
    else if (action === 'bmi') {
      const ref = computeReferenceCalcs(current.patient);
      if (ref.bmi) { writeValues({ bmi: ref.bmi }); persist(); setStatus('BMI filled. IBW, LBW, EBV, ABL and fluids are yours to calculate.'); }
    } else if (action === 'reset') {
      if (form) form.innerHTML = renderCarePlanForm({});
      writeValues({ date: new Date().toISOString().slice(0, 10), ...autofillFromChart(current.patient) });
      current.record = null;
      persist();
      renderResult();
      onGraded(status());
      setStatus('Sheet cleared. Chart identifiers refilled.');
    }
  }

  function handleInput() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => persist(), 400);
  }

  function handleKey(event) { if (event.key === 'Escape' && modal && !modal.hidden) close(); }

  modal?.addEventListener?.('click', handleClick);
  form?.addEventListener?.('input', handleInput);
  root?.addEventListener?.('keydown', handleKey);

  return {
    load, open, close, submit, status, readValues,
    clear() { current = null; },
    destroy() {
      modal?.removeEventListener?.('click', handleClick);
      form?.removeEventListener?.('input', handleInput);
      root?.removeEventListener?.('keydown', handleKey);
    },
  };
}
