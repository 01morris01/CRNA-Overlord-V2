export const PATIENT_PRESETS = Object.freeze([
  {
    id: 'standard-70', label: 'Standard adult · 70 kg',
    config: { weightKg: 70, heightCm: 170, ageYears: 45, sex: 'Male' },
  },
  {
    id: 'adult-80', label: 'Adult · 80 kg',
    config: { weightKg: 80, heightCm: 178, ageYears: 52, sex: 'Male' },
  },
  {
    id: 'older-65', label: 'Older adult · 65 kg',
    config: { weightKg: 65, heightCm: 162, ageYears: 72, sex: 'Female' },
  },
]);

export const DRUG_ACTIONS = Object.freeze([
  { id: 'propofol_2_mgkg', group: 'Induction', drugName: 'Propofol', amount: 2, unit: 'mg/kg', label: 'Propofol 2 mg/kg' },
  { id: 'fentanyl_2_mcgkg', group: 'Induction', drugName: 'Fentanyl', amount: 2, unit: 'mcg/kg', label: 'Fentanyl 2 mcg/kg' },
  { id: 'rocuronium_06_mgkg', group: 'Induction', drugName: 'Rocuronium', amount: 0.6, unit: 'mg/kg', label: 'Rocuronium 0.6 mg/kg' },
  { id: 'succinylcholine_1_mgkg', group: 'Induction', drugName: 'Succinylcholine', amount: 1, unit: 'mg/kg', label: 'Succinylcholine 1 mg/kg' },
  { id: 'midazolam_003_mgkg', group: 'Induction', drugName: 'Midazolam', amount: 0.03, unit: 'mg/kg', label: 'Midazolam 0.03 mg/kg' },
  { id: 'phenylephrine_100_mcg', group: 'Rescue', drugName: 'Phenylephrine', amount: 100, unit: 'mcg', label: 'Phenylephrine 100 mcg' },
  { id: 'ephedrine_10_mg', group: 'Rescue', drugName: 'Ephedrine', amount: 10, unit: 'mg', label: 'Ephedrine 10 mg' },
  { id: 'epinephrine_10_mcg', group: 'Rescue', drugName: 'Epinephrine', amount: 10, unit: 'mcg', label: 'Epinephrine 10 mcg' },
  { id: 'epinephrine_50_mcg', group: 'Rescue', drugName: 'Epinephrine', amount: 50, unit: 'mcg', label: 'Epinephrine 50 mcg' },
  { id: 'naloxone_004_mg', group: 'Rescue', drugName: 'Naloxone', amount: 0.04, unit: 'mg', label: 'Naloxone 0.04 mg' },
  { id: 'naloxone_04_mg', group: 'Rescue', drugName: 'Naloxone', amount: 0.4, unit: 'mg', label: 'Naloxone 0.4 mg' },
  { id: 'dantrolene_25_mgkg', group: 'Rescue', drugName: 'Dantrolene', amount: 2.5, unit: 'mg/kg', label: 'Dantrolene 2.5 mg/kg' },
  { id: 'albuterol_1_mg', group: 'Rescue', drugName: 'Albuterol', amount: 1, unit: 'mg', label: 'Albuterol 1 mg' },
  { id: 'sugammadex_2_mgkg', group: 'Emergence', drugName: 'Sugammadex', amount: 2, unit: 'mg/kg', label: 'Sugammadex 2 mg/kg · TOF ≥2' },
  { id: 'sugammadex_4_mgkg', group: 'Emergence', drugName: 'Sugammadex', amount: 4, unit: 'mg/kg', label: 'Sugammadex 4 mg/kg · deep block' },
  { id: 'sugammadex_16_mgkg', group: 'Emergence', drugName: 'Sugammadex', amount: 16, unit: 'mg/kg', label: 'Sugammadex 16 mg/kg · rescue' },
  { id: 'neostigmine_007_mgkg', group: 'Emergence', drugName: 'Neostigmine', amount: 0.07, unit: 'mg/kg', capMg: 5, label: 'Neostigmine 0.07 mg/kg · max 5 mg' },
  { id: 'glycopyrrolate_02_mg', group: 'Emergence', drugName: 'Glycopyrrolate', amount: 0.2, unit: 'mg', label: 'Glycopyrrolate 0.2 mg' },
  { id: 'atropine_05_mg', group: 'Emergence', drugName: 'Atropine', amount: 0.5, unit: 'mg', label: 'Atropine 0.5 mg' },
]);

export const COMPLICATION_OPTIONS = Object.freeze([
  'Bronchospasm', 'HighSpinal', 'Anaphylaxis', 'MalignantHyperthermia',
  'OpioidRespDepression', 'Hemorrhage', 'Laryngospasm',
  'LocalAnestheticToxicity', 'TensionPneumothorax', 'VentricularFibrillation',
]);

export const VENT_MODE_NAMES = Object.freeze({
  0: 'Manual/Bag', 1: 'VCV', 2: 'PCV', 3: 'PSV',
});

export const VOLATILE_AGENTS = Object.freeze([
  Object.freeze({ name: 'Sevoflurane', referenceDial: 2 }),
  Object.freeze({ name: 'Desflurane', referenceDial: 6 }),
  Object.freeze({ name: 'Isoflurane', referenceDial: 1.2 }),
]);

export const LIDOCAINE_ROUTES = Object.freeze([
  Object.freeze({ id: 'infiltration', label: 'Infiltration' }),
  Object.freeze({ id: 'peripheral', label: 'Peripheral block' }),
  Object.freeze({ id: 'epidural', label: 'Epidural' }),
]);

export const SIMULATION_RESULT_FIELDS = Object.freeze([
  'scenarioId', 'title', 'courseUnit', 'durationSec', 'rawPoints', 'maxPoints',
  'score', 'timeToRecognitionSec', 'timeToTreatmentSec', 'teachingFeedback',
  'teachingPoints', 'reviewTopics', 'reviewTags', 'criticalActionsCompleted',
  'criticalActionsMissed', 'dangerousActions', 'respiratoryAttribution',
]);

const DEFAULT_PATIENT_CONFIG = Object.freeze({
  weightKg: 70, heightCm: 170, ageYears: 45, sex: 'Male',
  baselineHR: 72, baselineSystolic: 120, baselineDiastolic: 80,
  baselineSpO2: 99, baselineRR: 14, baselineTemp: 36.6, baselineEtCO2: 38,
});

const CONFIG_RANGES = Object.freeze({
  weightKg: [20, 300], heightCm: [100, 230], ageYears: [1, 100],
  baselineHR: [20, 220], baselineSystolic: [50, 260],
  baselineDiastolic: [25, 160], baselineSpO2: [50, 100],
  baselineRR: [2, 60], baselineTemp: [30, 43], baselineEtCO2: [5, 100],
});

function roundMg(value) {
  return Math.round((value + Number.EPSILON) * 1000) / 1000;
}

export function computeDrugDose(actionId, weightKg) {
  const action = DRUG_ACTIONS.find((candidate) => candidate.id === actionId);
  if (!action) throw new RangeError(`Unknown drug action: ${actionId}`);
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new RangeError('Patient weight must be a positive finite number');
  }

  let totalMg;
  switch (action.unit) {
    case 'mg/kg': totalMg = action.amount * weightKg; break;
    case 'mcg/kg': totalMg = action.amount * weightKg / 1000; break;
    case 'mg': totalMg = action.amount; break;
    case 'mcg': totalMg = action.amount / 1000; break;
    default: throw new RangeError(`Unsupported dose unit: ${action.unit}`);
  }
  if (Number.isFinite(action.capMg)) totalMg = Math.min(totalMg, action.capMg);

  return {
    id: action.id,
    drugName: action.drugName,
    totalMg: roundMg(totalMg),
    clinicalLabel: action.label,
  };
}

export function computeRegionalLidocaineDose({
  route, concentrationPercent, volumeMl, weightKg, epinephrine,
} = {}) {
  if (!LIDOCAINE_ROUTES.some((candidate) => candidate.id === route)) {
    throw new RangeError(`Unsupported regional Lidocaine route: ${route}`);
  }
  if (!Number.isFinite(concentrationPercent) || concentrationPercent <= 0) {
    throw new RangeError('Lidocaine concentration must be a positive finite number');
  }
  if (!Number.isFinite(volumeMl) || volumeMl <= 0) {
    throw new RangeError('Lidocaine volume must be a positive finite number');
  }
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new RangeError('Patient weight must be a positive finite number');
  }
  if (typeof epinephrine !== 'boolean') {
    throw new TypeError('epinephrine must be a boolean');
  }
  const totalMg = concentrationPercent * 10 * volumeMl;
  const doseMgKg = totalMg / weightKg;
  const maximumMg = epinephrine
    ? Math.min(7 * weightKg, 500)
    : Math.min(4.5 * weightKg, 300);
  const exceeded = totalMg > maximumMg;
  return {
    route,
    totalMg,
    doseMgKg,
    maximumMg,
    exceeded,
    warning: exceeded
      ? `Dose exceeds the ${maximumMg.toFixed(0)} mg recommendation for this selection.`
      : null,
  };
}

export function parsePatientConfig(values = {}) {
  const merged = { ...DEFAULT_PATIENT_CONFIG, ...values };
  if (!['Male', 'Female'].includes(merged.sex)) {
    throw new RangeError('sex must be Male or Female');
  }

  const parsed = { sex: merged.sex };
  for (const [key, [minimum, maximum]] of Object.entries(CONFIG_RANGES)) {
    const value = Number(merged[key]);
    if (!Number.isFinite(value) || value < minimum || value > maximum) {
      throw new RangeError(`${key} must be between ${minimum} and ${maximum}`);
    }
    parsed[key] = value;
  }
  if (parsed.baselineDiastolic >= parsed.baselineSystolic) {
    throw new RangeError('baselineDiastolic must be below baselineSystolic');
  }

  return {
    weightKg: parsed.weightKg,
    heightCm: parsed.heightCm,
    ageYears: parsed.ageYears,
    sex: parsed.sex,
    baselineHR: parsed.baselineHR,
    baselineSystolic: parsed.baselineSystolic,
    baselineDiastolic: parsed.baselineDiastolic,
    baselineSpO2: parsed.baselineSpO2,
    baselineRR: parsed.baselineRR,
    baselineTemp: parsed.baselineTemp,
    baselineEtCO2: parsed.baselineEtCO2,
  };
}

function formatted(value, digits = 0) {
  if (!Number.isFinite(value)) return '—';
  const factor = 10 ** digits;
  const rounded = Math.round((Number(value) + Number.EPSILON) * factor) / factor;
  return rounded.toFixed(digits);
}

export function formatMonitorSnapshot(snapshot = {}) {
  const systolic = formatted(snapshot.sbp);
  const diastolic = formatted(snapshot.dbp);
  return {
    hr: formatted(snapshot.hr),
    sbp: systolic,
    dbp: diastolic,
    bp: systolic === '—' || diastolic === '—' ? '—' : `${systolic}/${diastolic}`,
    map: formatted(snapshot.map),
    spo2: formatted(snapshot.spo2),
    rr: formatted(snapshot.rr),
    etco2: formatted(snapshot.etco2),
    temp: formatted(snapshot.temp, 1),
    tof: formatted(snapshot.tof),
    tofRatio: formatted(snapshot.tofRatio, 2),
    spontaneousRR: formatted(snapshot.spontaneousRR),
    spontaneousTV: formatted(snapshot.spontaneousTV),
    spontaneousMV: formatted(snapshot.spontaneousMV, 1),
    spontaneousEffort: formatted(snapshot.spontaneousEffort, 2),
    ppeak: formatted(snapshot.ppeak),
    mv: formatted(snapshot.mv, 1),
    tv: formatted(snapshot.tv),
    fio2: Number.isFinite(snapshot.fio2) ? formatted(snapshot.fio2 * 100) : '—',
    ventMode: VENT_MODE_NAMES[snapshot.ventMode] || '—',
    vaporizer: formatted(snapshot.vaporizer, 1),
    vaporizerAgent: typeof snapshot.vaporizerAgent === 'string' ? snapshot.vaporizerAgent : '—',
  };
}

export function formatLidocaineSnapshot(snapshot = {}) {
  const percent = (value) => (Number.isFinite(value) ? `${formatted(value * 100)}%` : '—');
  return {
    totalLevel: formatted(snapshot.lidocainePlasmaTotalMcgMl, 2),
    freeLevel: formatted(snapshot.lidocainePlasmaFreeMcgMl, 2),
    effectSite: formatted(snapshot.lidocaineEffectSiteMcgMl, 2),
    cumulativeMg: formatted(snapshot.lidocaineCumulativeMg, 1),
    sensoryBlock: percent(snapshot.regionalSensoryBlock),
    motorBlock: percent(snapshot.regionalMotorBlock),
    stimulusRaw: formatted(snapshot.surgicalStimulusRaw, 2),
    stimulusEffective: formatted(snapshot.surgicalStimulusEffective, 2),
    toxicity: typeof snapshot.lidocaineToxicityStage === 'string'
      ? snapshot.lidocaineToxicityStage.toUpperCase()
      : '—',
    lipidCumulative: formatted(snapshot.lipidCumulativeMlKg, 2),
  };
}

function thresholdAlarm(snapshot, key, predicate, id, label, severity = 'critical') {
  const value = snapshot[key];
  return Number.isFinite(value) && predicate(value)
    ? { id, label, value, severity }
    : null;
}

export function deriveAlarms(snapshot = {}) {
  return [
    thresholdAlarm(snapshot, 'hr', (value) => value < 45, 'hr-low', 'Heart rate low'),
    thresholdAlarm(snapshot, 'hr', (value) => value > 120, 'hr-high', 'Heart rate high', 'warning'),
    thresholdAlarm(snapshot, 'map', (value) => value < 60, 'map-low', 'MAP low'),
    thresholdAlarm(snapshot, 'spo2', (value) => value < 92, 'spo2-low', 'SpO₂ low'),
    thresholdAlarm(snapshot, 'rr', (value) => value < 6, 'rr-low', 'Respiratory rate low'),
    thresholdAlarm(snapshot, 'rr', (value) => value > 30, 'rr-high', 'Respiratory rate high', 'warning'),
    thresholdAlarm(snapshot, 'etco2', (value) => value < 25, 'etco2-low', 'EtCO₂ low', 'warning'),
    thresholdAlarm(snapshot, 'etco2', (value) => value > 50, 'etco2-high', 'EtCO₂ high'),
    thresholdAlarm(snapshot, 'temp', (value) => value < 35, 'temp-low', 'Temperature low', 'warning'),
    thresholdAlarm(snapshot, 'temp', (value) => value > 38.5, 'temp-high', 'Temperature high'),
    thresholdAlarm(snapshot, 'ppeak', (value) => value > 35, 'ppeak-high', 'Peak airway pressure high'),
  ].filter(Boolean);
}

export function validateSimulationResult(result) {
  const missing = SIMULATION_RESULT_FIELDS.filter((field) => !Object.hasOwn(result || {}, field));
  const invalid = [];
  if (result && missing.length === 0) {
    for (const field of ['scenarioId', 'title', 'courseUnit', 'teachingFeedback']) {
      if (typeof result[field] !== 'string') invalid.push(field);
    }
    for (const field of ['durationSec', 'rawPoints', 'maxPoints', 'score', 'timeToRecognitionSec', 'timeToTreatmentSec']) {
      if (!Number.isFinite(result[field])) invalid.push(field);
    }
    for (const field of ['teachingPoints', 'reviewTopics', 'reviewTags', 'criticalActionsCompleted', 'criticalActionsMissed', 'dangerousActions']) {
      if (!Array.isArray(result[field])) invalid.push(field);
    }
    if (!result.respiratoryAttribution || typeof result.respiratoryAttribution !== 'object') {
      invalid.push('respiratoryAttribution');
    }
  }
  return { ok: missing.length === 0 && invalid.length === 0, missing, invalid };
}
