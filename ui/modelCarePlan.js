/* Completes the model care plan: every field on both pages, for the plan the
   instructor files when moving a student past the care plan step.

   Sources, in order of trust: the chart (history, labs, studies, airway exam,
   anesthesia history, consents, MAR), the answer key (red flags, plan items,
   decision, complications), and the per patient anesthetic choices in
   modelPlanSpecs.js. Scores (Apfel, STOP-Bang, RCRI) are computed from the
   chart with the standard criteria. Drug totals are computed from this
   patient's weight. Nothing here invents a lab value or a history item; when
   the chart is silent, the field says so.

   Called from carePlanSheet.buildModelPlan with that module's helpers, so
   there is no circular import. Draft teaching content for faculty review. */

import { MODEL_PLAN_SPECS } from './modelPlanSpecs.js';

const s = (value) => (value === null || value === undefined ? '' : String(value));
const lower = (value) => s(value).toLowerCase();
// Joined parts drop their own closing period so "A.; B" never happens.
const join = (parts, sep = '; ') => {
  const clean = parts.map((part) => s(part).trim()).filter(Boolean);
  return clean.map((part, index) => (index < clean.length - 1 && sep.startsWith(';') ? part.replace(/\.$/, '') : part)).join(sep);
};
// Unique, also dropping an item that another item already contains.
const unique = (list) => {
  const items = [...new Set(list.map((item) => s(item).trim()).filter(Boolean))];
  const key = (item) => item.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  return items.filter((item, index) => !items.some((other, j) => j !== index && key(other).includes(key(item)) && (key(other) !== key(item) || j < index)));
};

function trimText(text, max = 110) {
  const clean = s(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const at = Math.max(cut.lastIndexOf(';'), cut.lastIndexOf(','), cut.lastIndexOf(' '));
  return `${cut.slice(0, at > 40 ? at : max).replace(/[;,\s]+$/, '')}...`;
}

// The patient's own history (family history left out, so a parent's CAD
// does not score as the patient's).
function chartText(patient) {
  const { family, ...history } = patient.history ?? {};
  return lower(JSON.stringify({ h: history, p: patient.problems, n: patient.notes, a: patient.anesthesia_history, pre: patient.preop, m: patient.home_meds }));
}

/* ---------- airway ---------- */

function priorAirway(patient) {
  const rows = patient.anesthesia_history ?? [];
  if (!rows.length) return 'No prior anesthetic on record';
  const notable = rows.filter((row) => /grade|difficult|bougie|mask|airway|intubat|laryngospasm|desat|uneventful|lma|ett/i.test(`${row[2]} ${row[3]}`));
  const pick = (notable.length ? notable : rows).slice(-2);
  return join(pick.map((row) => `${s(row[0])} ${s(row[1])}: ${s(row[2])}${row[3] && !/^none$/i.test(row[3]) ? `, ${s(row[3])}` : ', no airway problems'}`));
}

/* ---------- systems by exception ---------- */

const SYSTEMS = [
  ['sysCv', /hypertens|\bhtn\b|\bcad\b|nstemi|\bmi\b|myocard|heart|cardi|\baf\b|atrial|fibrillation|valve|stenosis|\bef\b|hfpef|hfref|\bchf\b|\bicd\b|pacemaker|aneurysm|\baaa\b|carotid|dvt|\bpe\b|asd\b|avsd|murmur|brady|tachy|transplant|arrhythm|vascular|claudication|hypotension|shock|pheochromo/i],
  ['sysResp', /asthma|copd|\bosa\b|apnea|sleep apnea|sleep study|sleepiness|smok|\buri\b|lung|pulmon|pneum|nodule|wheez|snor|cpap|bronch|oxygen|\bo2\b|vap(e|ing)|sinus|polyp|aerd|tonsil|adenoid/i],
  ['sysNeuro', /seizure|stroke|\btia\b|cva|parkinson|dementia|migraine|anxiety|depress|adhd|autis|concussion|myasthenia|neuropath|glioma|frontal mass|psych|delirium|encephalopath|cognitive|lambert|developmental|trisomy|down syndrome|panic|bipolar|schizo|insomnia|headache/i],
  ['sysRenal', /kidney|renal|\bckd\b|esrd|dialysis|nephr|prostat|\bbph\b|urin|bladder|stone|ureter|creatinine|hyperkal|potassium/i],
  ['sysGi', /gerd|reflux|cirrho|hepat|liver|varice|ascites|gastr|achalasia|bowel|sbo\b|small bowel obstruction|append|pancrea|colon|diverticul|hernia|gallbladder|biliary|cholecyst|pylor|nausea|vomit|crohn|colitis|hcv|hepatitis/i],
  ['sysEndo', /diabet|\bdm\b|t1dm|t2dm|thyroid|graves|hashimoto|adrenal|parathyroid|obes|\bbmi\b|steroid|prednisone|cushing|prediabet|insulin|a1c|glp|sglt|calcium/i],
  ['sysHeme', /anemia|sickle|factor v|coag|warfarin|apixaban|dabigatran|rivaroxaban|heparin|\bhit\b|platelet|thromb|bleed|transfus|leukem|lymphom|hemophil|enoxaparin|clopidogrel|dapt|\binr\b|iron|neutropen|jehovah/i],
  ['sysOther', /pregnan|gestation|\bob\b|rheumatoid|\bra\b|lupus|arthritis|osteo|scoliosis|fracture|spine|spondyl|skin|latex|cancer|carcinoma|breast|pain|opioid|alcohol|cocaine|meth|\bhiv\b|eczema|allerg|tape|chemo|immunosupp|fibroid|endometrio|macromastia|tear|meniscus|ligament/i],
];

function systemsByException(patient, answerKey) {
  const items = [
    ...(patient.history?.pmh ?? []),
    ...(patient.problems ?? []).map((row) => row[0]),
  ];
  const flags = (answerKey?.redFlags ?? []).map((flag) => flag.finding);
  const out = {};
  for (const [field, pattern] of SYSTEMS) {
    const hits = unique(items.filter((item) => pattern.test(item)).map((item) => trimText(item, 100)));
    const flagHits = unique(flags.filter((flag) => pattern.test(flag)).map((flag) => trimText(flag, 90)));
    const lines = [...hits.slice(0, 4), ...flagHits.filter((flag) => !hits.some((hit) => lower(hit).includes(lower(flag).slice(0, 18)))).slice(0, 2).map((flag) => `Flag: ${flag}`)];
    out[field] = lines.length ? lines.join('; ') : 'No issues in the chart (by exception)';
  }
  return out;
}

/* ---------- labs, studies, history ---------- */

function otherLab(patient, pattern) {
  const rows = (patient.labs?.other ?? []).filter((row) => pattern.test(s(row[1])));
  return rows.length ? rows[rows.length - 1] : null;
}

function latestRowLab(patient, key) {
  for (const col of patient.labs?.cols ?? []) {
    const value = col?.vals?.[key];
    if (value && value[0] !== '' && value[0] !== undefined) return `${value[0]}${value[1] ? ` (${value[1]})` : ''}, ${col.dt}`;
  }
  return '';
}

function hcgText(patient, ageYears) {
  const row = otherLab(patient, /hcg|pregnan/i);
  if (row) return `${s(row[2])} (${s(row[0])})`;
  if (patient.sex !== 'F') return 'N/A (male)';
  if (ageYears !== null && ageYears < 10) return 'N/A (prepubertal)';
  if (ageYears !== null && ageYears >= 55) return 'N/A (postmenopausal age)';
  return 'Not on file: needed before an elective anesthetic';
}

function studies(patient) {
  const cardio = patient.cardiology ?? [];
  const ecg = cardio.filter((row) => /ecg|ekg|electrocardio|holter/i.test(s(row[1])));
  const echo = cardio.filter((row) => /echo|stress|cath|tee|angio|nuclear|mpi|cardiac mri|device|interrogation/i.test(s(row[1])));
  const imaging = patient.imaging ?? [];
  const fmt = (row) => `${s(row[0])} ${s(row[1])}: ${trimText(row[2], 150)}`;
  return {
    studyEcg: ecg.length ? ecg.slice(0, 2).map(fmt).join('; ') : 'None on file (not required unless the history calls for it)',
    studyEcho: echo.length ? echo.slice(0, 2).map(fmt).join('; ') : 'None on file',
    studyCxr: imaging.length ? imaging.slice(0, 2).map(fmt).join('; ') : 'None on file',
  };
}

function priorAnesthesia(patient) {
  const rows = (patient.anesthesia_history ?? []).map((row) => `${s(row[0])} ${s(row[1])}: ${s(row[2])}, ${s(row[3]) || 'no problems'}`);
  const family = (patient.history?.family ?? []).filter((line) => /anesthe|malignant|\bmh\b|pseudocholin|succinyl|reaction|fever and|stiff/i.test(line));
  return join([
    rows.length ? `Personal: ${rows.join('; ')}` : 'Personal: no prior anesthetics',
    family.length ? `Family: ${family.join('; ')}` : 'Family: no anesthesia problems reported',
  ], '. ');
}

/* ---------- risk scores ---------- */

function smokesNow(patient) {
  const text = lower(patient.history?.social?.tobacco);
  if (!text || /^never|no smok|non ?smoker|none|n\/a|denies/.test(text)) return false;
  if (/quit|former|ex.smok/.test(text) && !/current|still|daily/.test(text)) return false;
  return /ppd|current|smok|cig|vape|vaping|daily|pack|chew|dip/.test(text);
}

export function apfelScore(patient, { opioidsExpected = true } = {}) {
  const text = chartText(patient);
  const female = patient.sex === 'F';
  const nonSmoker = !smokesNow(patient);
  const ponvHistory = /ponv|postoperative nausea|motion sick|car sick|seasick|nausea and vomiting after|vomit(ed|ing) after (surgery|anesthesia|sedation)|severe nausea/.test(text);
  const parts = [female && 'female', nonSmoker && 'non smoker', ponvHistory && 'PONV or motion sickness history', opioidsExpected && 'postop opioids expected'].filter(Boolean);
  const score = parts.length;
  const risk = ['about 10%', 'about 20%', 'about 40%', 'about 60%', 'about 80%'][score];
  return { score, text: `${score} of 4 (${parts.join(', ') || 'no risk factors'}): ${risk} PONV risk` };
}

export function stopBang(patient, exam, bmi, ageYears) {
  const text = chartText(patient);
  const neck = Number((/neck(?: circumference)? (\d{2}) ?cm/.exec(`${lower(exam?.other)} ${text}`) ?? [])[1]);
  const items = [
    ['Snoring', /snor/.test(text) && !/no snor|denies snor|not snor/.test(text)],
    ['Tired', /daytime sleep|somnolen|tired|fatigue|sleepiness/.test(text)],
    ['Observed apnea', /witnessed (pause|apnea)|\bosa\b|obstructive sleep apnea|ahi \d/.test(text) && !/no (osa|apnea)|without osa|no witnessed/.test(text)],
    ['Pressure (HTN)', /hypertens|\bhtn\b/.test(text)],
    ['BMI over 35', bmi > 35],
    ['Age over 50', ageYears > 50],
    ['Neck over 40 cm', neck > 40],
    ['Male', patient.sex === 'M'],
  ];
  const hits = items.filter(([, on]) => on).map(([label]) => label);
  const known = /\bosa\b|obstructive sleep apnea|ahi \d/.test(text) && !/no osa|without osa|no obstructive/.test(text);
  const band = hits.length >= 5 ? 'high risk' : hits.length >= 3 ? 'intermediate risk' : 'low risk';
  return `${hits.length} of 8 (${hits.join(', ') || 'none'}): ${band}${known ? '; OSA already diagnosed' : ''}`;
}

const HIGH_RISK_SURGERY = /laparo|\blap\b|ex lap|laparotomy|cholecyst|append|colectomy|hartmann|bowel|hysterectomy|\btlh\b|gastrectomy|sleeve|robotic|vats|lobectomy|thoracot|cabg|\bavr\b|evar|\baaa\b|aort|transplant|adrenalectomy|nephrectomy|myotomy|cystectomy|sternotomy|craniotomy|intraperitoneal|hernia repair.*(robot|lap)|tep\b|ectopic/;

export function rcri(patient, procedure) {
  const text = chartText(patient);
  const cr = Number((patient.labs?.cols ?? []).map((col) => col.vals?.Cr?.[0]).find((value) => value !== undefined && value !== ''));
  const items = [
    ['high risk surgery', HIGH_RISK_SURGERY.test(lower(procedure))],
    ['ischemic heart disease', /\bcad\b|nstemi|stemi|myocardial infarction|\bmi\b|angina|stent|\bdes\b|cabg|ischemic cardiomyopathy|ischemic cm/.test(text)],
    ['heart failure', /heart failure|\bchf\b|hfref|hfpef|cardiomyopathy|ef (1|2|3)\d%|ef 15/.test(text)],
    ['cerebrovascular disease', /stroke|\btia\b|\bcva\b/.test(text)],
    ['insulin treated diabetes', /insulin|lispro|glargine|detemir|aspart|degludec/.test(text)],
    ['creatinine over 2', cr > 2],
  ];
  const hits = items.filter(([, on]) => on).map(([label]) => label);
  const risk = ['about 0.4%', 'about 0.9%', 'about 6.6%', 'about 11%'][Math.min(3, hits.length)];
  return `${hits.length} (${hits.join(', ') || 'none'}): ${risk} risk of a major cardiac event (Lee)`;
}

function metsText(patient) {
  const text = chartText(patient);
  if (/nyha (iii|iv|3|4)|bedbound|bed bound|wheelchair|unable to climb|cannot climb|dyspnea at rest|orthopnea/.test(text)) return 'Under 4 METs (limited by symptoms in the chart)';
  if (/walker|\bcane\b|limited by (pain|hip|knee|back)|nyha (ii|2)/.test(text)) return 'Under 4 METs or not assessable (limited mobility in the chart)';
  if (/marathon|runs? \d|running|triathlon|endurance|athlete|cycles|cycling|swims|gym|lifts|crossfit|soccer|hik(e|es|ing)|climbs? \d|flights? of stairs|plays (tennis|basketball|pickleball)/.test(text)) return 'Over 4 METs (exercises regularly per the chart)';
  return 'Probably 4 or more (independent, no exertional symptoms in the chart); confirm stairs without stopping';
}

/* ---------- drugs ---------- */

const MCG_DRUGS = /fentanyl|remifentanil|sufentanil|dexmedetomidine/i;

function roundDose(value, unit, drug) {
  if (unit === 'g') return `${Math.round(value * 10) / 10} g`;
  if (unit === 'mcg') return `${value >= 20 ? Math.round(value / 5) * 5 : Math.round(value * 10) / 10} mcg`;
  if (/propofol/i.test(drug) && value >= 30) return `${Math.round(value / 10) * 10} mg`;
  if (value >= 20) return `${Math.round(value / 5) * 5} mg`;
  if (value >= 10) return `${Math.round(value)} mg`;
  if (value >= 1) return `${Math.round(value * 10) / 10} mg`;
  return `${Math.round(value * 100) / 100} mg`;
}

function drugRow(row, ctx) {
  if (typeof row[1] !== 'number') return [s(row[0]), s(row[1]), s(row[2])];
  const [drug, perKg, opts = {}] = row;
  const unit = opts.unit ?? (MCG_DRUGS.test(drug) ? 'mcg' : 'mg');
  const basis = opts.basis ?? 'TBW';
  const weight = basis === 'IBW' ? ctx.ibw : basis === 'LBW' ? ctx.lbw : ctx.weight;
  let total = perKg * weight;
  let capped = false;
  if (Number.isFinite(opts.max) && total > opts.max) { total = opts.max; capped = true; }
  const perKgText = `${perKg} ${unit}/kg${basis !== 'TBW' ? ` (${basis} ${weight} kg)` : ''}`;
  // Adults get the usual fixed dose (acetaminophen 1 g, dexamethasone 4 mg).
  if (opts.adult && ctx.weight >= opts.adult.fromKg) {
    return [drug, opts.adult.dose, `${opts.adult.dose}${opts.note ? `, ${opts.note}` : ''}`];
  }
  const totalText = `${roundDose(total, unit, drug)}${capped && ctx.weight < 40 ? ' (max)' : ''}${opts.note ? `, ${opts.note}` : ''}`;
  return [drug, perKgText, totalText];
}

function allergic(drug, patient) {
  const name = lower(drug);
  return (patient.allergies ?? []).some((row) => {
    const allergen = lower(row[0]).split(/[\s(/,]/)[0];
    return allergen.length > 3 && name.includes(allergen);
  });
}

function fillTable(values, prefix, rows, rowsAvailable) {
  rows.slice(0, rowsAvailable).forEach((row, index) => {
    values[`${prefix}${index + 1}_drug`] = row[0];
    values[`${prefix}${index + 1}_perKg`] = row[1];
    values[`${prefix}${index + 1}_total`] = row[2];
  });
}

/* ---------- airway plans, PONV, emergence, fluids ---------- */

function defaultAirwayB(technique, ageYears) {
  if (/neuraxial|peripheral|mac/i.test(technique)) return 'Convert to GA: second generation LMA, or ETT with video laryngoscope if aspiration risk.';
  if (/lma|mask/i.test(technique)) return 'Convert to ETT with video laryngoscope if the LMA leaks, aspiration risk rises, or laryngospasm.';
  return ageYears !== null && ageYears < 10
    ? 'Video laryngoscope, ETT a half size smaller, second provider; LMA to oxygenate between attempts.'
    : 'Video laryngoscope with bougie, ETT a half size smaller, second provider; second generation LMA to oxygenate between attempts.';
}

function defaultAirwayC(ageYears, weight, rocuronium) {
  if (ageYears !== null && ageYears < 8) {
    return 'Cannot intubate, cannot oxygenate: call for help and ENT, two person mask with oral airway, LMA, then needle cricothyroidotomy or rigid bronchoscopy and surgical airway by ENT.';
  }
  const sug = rocuronium ? ` Sugammadex 16 mg/kg (${Math.round(16 * weight / 50) * 50} mg) only if waking up is a real option.` : '';
  return `Cannot intubate, cannot oxygenate: call for help, declare CICO, one attempt with a second generation LMA, then scalpel, bougie, 6.0 cuffed tube cricothyrotomy.${sug}`;
}

function extubation(spec, technique, patient, answerKey, child) {
  const dispo = lower(patient.case?.dispo);
  if (/intubated/.test(dispo)) return `Not extubated in the OR: transport intubated to ${patient.case.dispo.replace(/,? intubated/i, '')} on propofol, wean there.`;
  if (/neuraxial|peripheral|^mac$/i.test(technique)) return 'No airway device planned. Discharge from PACU when the block is regressing, vital signs stable, pain controlled, Aldrete 9 or more.';
  if (/mask/i.test(technique)) return 'No airway device: sevoflurane off, wake on 100% O2 by mask with jaw support as needed; to PACU when breathing regularly with airway reflexes back and SpO2 at baseline.';
  const keyText = lower(JSON.stringify(answerKey ?? {}));
  const paralyzed = /rocuronium|succinylcholine|vecuronium|cisatracurium|pancuronium/i.test(JSON.stringify(spec?.ind ?? []));
  const awakeOnly = /osa|difficult airway|full stomach|rsi|aspiration|obes|achalasia/.test(keyText);
  const device = /lma/i.test(technique) ? 'LMA out' : 'Extubate';
  const parts = [
    child ? `${device} when awake: eyes open, purposeful movement, regular breathing` : `${device} when awake and following commands`,
    paralyzed ? 'TOF ratio 0.9 or more on the quantitative monitor' : '',
    'TV over 5 mL/kg with RR in the normal range for age, SpO2 over 94% on FiO2 0.5 or less, hemodynamically stable, normothermic, no active bleeding in the airway',
    awakeOnly ? 'Fully awake, head up, suction ready (no deep extubation)' : '',
  ];
  return join(parts, '; ');
}

const CONTINGENCY = {
  Bronchospasm: ['Bronchospasm (rising peak pressure, upsloping EtCO2, wheeze)', '100% O2, deepen (propofol or sevoflurane), albuterol 4 to 8 puffs in the circuit', 'Epinephrine 10 mcg IV increments; check tube position and for anaphylaxis'],
  Anaphylaxis: ['Anaphylaxis (hypotension, bronchospasm, rash)', 'Stop the trigger, call for help, epinephrine 10 to 100 mcg IV, fluids 20 mL/kg', 'Epinephrine infusion, H1 and H2 blockers, steroids, tryptase within 1 h'],
  MalignantHyperthermia: ['Malignant hyperthermia (rising EtCO2, tachycardia, rigidity)', 'Stop volatiles, call for help and the MH cart, hyperventilate with 100% O2 at high flow', 'Dantrolene 2.5 mg/kg IV repeated, cool, treat potassium and acidosis, ICU'],
  Laryngospasm: ['Laryngospasm (stridor, no air movement)', 'CPAP with 100% O2 and jaw thrust (Larson point), remove the stimulus', 'Propofol 0.5 to 1 mg/kg, then succinylcholine 0.1 to 0.5 mg/kg IV (2 to 4 mg/kg IM) if it persists'],
  Hemorrhage: ['Major bleeding (falling BP, rising HR, losses past ABL)', 'Tell the surgeon, call for help, large bore access, warmed fluids', 'PRBC and plasma 1:1, activate massive transfusion, TXA, calcium'],
  OpioidRespDepression: ['Opioid respiratory depression (slow RR, rising EtCO2, sedation)', 'Stimulate, jaw thrust, assist ventilation', 'Naloxone 40 mcg IV increments, monitor for renarcotization'],
  HighSpinal: ['High spinal (dyspnea, arm weakness, hypotension, bradycardia)', 'Support airway and breathing, phenylephrine or ephedrine, left tilt if pregnant', 'Epinephrine and atropine for bradycardia, intubate if ventilation fails'],
  LocalAnestheticToxicity: ['Local anesthetic toxicity (tinnitus, seizure, arrhythmia)', 'Stop the local anesthetic, call for help, airway and 100% O2, benzodiazepine for seizure', 'Lipid emulsion 20% 1.5 mL/kg then 0.25 mL/kg/min, ACLS with small epinephrine doses'],
  TensionPneumothorax: ['Tension pneumothorax (rising pressures, hypotension, unilateral breath sounds)', '100% O2, stop nitrous oxide, tell the surgeon', 'Needle decompression 2nd intercostal space or 4th to 5th midaxillary, chest tube'],
  VentricularFibrillation: ['Ventricular fibrillation or pulseless VT', 'CPR, call for help, defibrillate', 'Epinephrine 1 mg every 3 to 5 min, amiodarone 300 mg, treat the cause'],
  Sympathectomy: ['Hypotension from sympathectomy', 'Phenylephrine or ephedrine, fluid', 'Norepinephrine infusion if it persists'],
};
const FALLBACK_CONTINGENCY = [
  ['Hypotension (MAP under 65 or 20% below baseline)', 'Lighten anesthetic, phenylephrine 50 to 100 mcg or ephedrine 5 to 10 mg, fluid bolus', 'Find the cause (bleeding, anaphylaxis, cardiac); norepinephrine infusion'],
  ['Desaturation (SpO2 under 90%)', '100% O2, check tube and circuit, hand ventilate, listen', 'Suction, bronchodilator, recruitment and PEEP; chest X ray'],
  ['Emergence delirium or agitation', 'Protect the patient and lines, rule out hypoxia and pain', 'Dexmedetomidine or small propofol dose'],
];

function contingencies(answerKey) {
  const types = unique((answerKey?.boothComplications ?? []).map((item) => item.type)).filter((type) => CONTINGENCY[type]);
  const rows = types.map((type) => CONTINGENCY[type]);
  for (const row of FALLBACK_CONTINGENCY) if (rows.length < 3) rows.push(row);
  return rows.slice(0, 3);
}

function antibioticPlan(patient) {
  const row = (patient.mar ?? []).find((entry) => /cef|cillin|clinda|vanco|metronid|gent|ertap|tazo|sulbactam|ceftri|levoflox|aztreonam/i.test(s(entry[0])));
  if (!row) return { antibiotic: 'None indicated for this procedure (none ordered)', antibioticRedose: 'N/A' };
  const name = lower(row[0]);
  let dose = s(row[0]);
  if (/cefazolin 2 g/.test(name) && Number(patient.wt_kg) >= 120) dose = 'Cefazolin 3 g IV (weight 120 kg or more)';
  const redose = /cefazolin|cefuroxime/.test(name) ? 'Every 4 h, and after blood loss over 1,500 mL'
    : /cefoxitin|sulbactam|tazo|piperacillin/.test(name) ? 'Every 2 h'
      : /clindamycin/.test(name) ? 'Every 6 h'
        : /vancomycin|ceftriaxone|metronidazole|gentamicin|ertapenem|levoflox/.test(name) ? 'Not redosed during a case of this length'
          : 'Per institutional table';
  const timing = /vancomycin/.test(name) ? 'start 60 to 120 min before incision' : 'complete within 60 min before incision';
  return { antibiotic: `${dose}, ${timing}${s(row[2]) ? ` (${s(row[2])})` : ''}`, antibioticRedose: redose };
}

const MED_RULES = [
  [/apixaban|rivaroxaban|edoxaban/, 'Hold 48 to 72 h before (renal function decides); check last dose'],
  [/dabigatran/, 'Hold 2 to 4 days by renal function; idarucizumab reverses'],
  [/warfarin/, 'Hold 5 days; INR under 1.5 for surgery or neuraxial'],
  [/enoxaparin/, 'Last prophylactic dose 12 h, treatment dose 24 h before neuraxial'],
  [/clopidogrel|ticagrelor|prasugrel/, 'Do not stop without the cardiologist when a stent is recent'],
  [/aspirin/, 'Usually continue (stop only if the surgeon and cardiology agree)'],
  [/metoprolol|atenolol|carvedilol|propranolol|bisoprolol|labetalol/, 'Continue, take the morning dose'],
  [/lisinopril|enalapril|losartan|valsartan|olmesartan|irbesartan|ramipril|sacubitril/, 'Hold the morning of surgery (hypotension)'],
  [/flozin/, 'Hold 3 days before (4 for ertugliflozin): euglycemic ketoacidosis'],
  [/glutide|tirzepatide|semaglutide/, 'Hold per ASA guidance (weekly dose: 1 week); full stomach precautions'],
  [/metformin/, 'Hold the morning of surgery'],
  [/insulin|glargine|detemir|degludec|lispro|aspart|pump/, 'Basal insulin 75 to 80% the night before; pump to basal or insulin infusion'],
  [/furosemide|hydrochlorothiazide|hctz|torsemide|spironolactone|chlorthalidone|bumetanide/, 'Hold the morning of surgery'],
  [/statin/, 'Continue'],
  [/prazole|famotidine/, 'Continue, take the morning dose'],
  [/albuterol|fluticasone|salmeterol|budesonide|formoterol|tiotropium|montelukast|inhaler/, 'Continue; bring the rescue inhaler'],
  [/levetiracetam|lamotrigine|valpro|carbamazepine|phenytoin|lacosamide/, 'Continue, do not miss doses'],
  [/levothyroxine|methimazole|propylthiouracil/, 'Continue'],
  [/prednisone|hydrocortisone|dexamethasone|methylpred/, 'Continue; stress dose per plan'],
  [/rasagiline|selegiline|phenelzine|tranylcypromine/, 'Continue; avoid meperidine, tramadol, methadone and indirect sympathomimetics'],
  [/carbidopa|levodopa/, 'Continue on schedule, give the morning dose'],
  [/buprenorphine|methadone/, 'Continue; plan multimodal analgesia'],
  [/sertraline|fluoxetine|citalopram|escitalopram|paroxetine|venlafaxine|duloxetine|bupropion/, 'Continue'],
  [/ibuprofen|naproxen|meloxicam|celecoxib|diclofenac/, 'Hold 3 to 7 days if bleeding is a concern'],
  [/phentermine/, 'Hold 4 to 7 days before (catecholamine effects)'],
  [/tacrolimus|mycophenolate|cyclosporine|azathioprine|methotrexate|etanercept|adalimumab/, 'Continue the immunosuppressant (biologic timing per the surgeon)'],
  [/pyridostigmine/, 'Continue, including the morning dose'],
  [/ambrisentan|bosentan|macitentan|sildenafil|tadalafil|treprostinil|epoprostenol/, 'Continue without interruption (pulmonary hypertension)'],
];

function medStatus(row) {
  const name = lower(row[0]);
  const today = /10\/27\/2026/.test(s(row[3]));
  const rule = MED_RULES.find(([pattern]) => pattern.test(name));
  const advice = rule ? rule[1] : 'Continue unless the plan says otherwise';
  return `${today ? 'Taken this morning. ' : ''}${advice}`;
}

/* ---------- the whole plan ---------- */

export function completeModelPlan(values, patient, answerKey, { ref, ageYears, keyAdds = {}, keyLeftovers = [] }) {
  const spec = MODEL_PLAN_SPECS[patient.id] ?? null;
  const exam = patient.preop?.airway_exam ?? {};
  const weight = Number(patient.wt_kg) || 70;
  const ctx = { weight, ibw: ref.ibw && ref.ibw < weight ? ref.ibw : weight, lbw: ref.lbw && ref.lbw < weight ? ref.lbw : weight };
  const procedure = s(patient.case?.procedure);
  const technique = spec?.tech ?? values.technique ?? 'GA with ETT';
  const child = ageYears !== null && ageYears < 12;

  values.preceptor = 'Faculty (instructor filled plan)';
  if (!s(values.vitalTemp).trim()) values.vitalTemp = 'Not recorded: take one in holding';
  if (!s(values.ablTarget).trim()) values.ablTarget = 'No Hct on file (ABL not computable; expected blood loss minimal)';
  const consents = patient.consents ?? [];
  const signed = (pattern) => consents.some((row) => pattern.test(s(row[0])) && /signed/i.test(s(row[1])) && !/not yet/i.test(s(row[1])));
  values.consentSurgical = signed(/surgical|procedure|surgery/i) || consents.some((row) => /surg/i.test(s(row[0])) && /sign/i.test(s(row[1])));
  values.consentAnesthesia = true;
  values.consentBlood = signed(/blood|transfus/i) || /crossmatch|type and cross/i.test(s(patient.case?.blood));

  (patient.home_meds ?? []).slice(0, 8).forEach((row, index) => { values[`med${index + 1}_status`] = medStatus(row); });

  values.mallampati = s(exam.mallampati) || 'Not documented';
  values.tmd = s(exam.tmd);
  values.mouthOpening = s(exam.mouth_opening);
  values.neckExtension = s(exam.neck);
  values.dentition = join([exam.dentition, exam.other]);
  values.priorGrade = priorAirway(patient);
  values.difficultAirway = ['No', 'Possible', 'Yes'].includes(exam.anticipated) ? exam.anticipated : 'No';

  Object.assign(values, systemsByException(patient, answerKey));

  values.labA1c = latestRowLab(patient, 'A1c') || (() => { const row = otherLab(patient, /a1c/i); return row ? `${s(row[2])} (${s(row[0])})` : 'Not on file'; })();
  values.labHcg = hcgText(patient, ageYears);
  for (const key of ['labInr', 'labPtt', 'labMgCa', 'labNa', 'labK', 'labCl', 'labCo2', 'labBun', 'labCr', 'labGlu', 'labHgb', 'labHct', 'labPlt', 'labWbc']) {
    if (!s(values[key]).trim()) values[key] = 'Not drawn';
  }
  Object.assign(values, studies(patient));

  const social = patient.history?.social ?? {};
  values.tobacco = s(social.tobacco) || 'Not documented';
  values.alcoholDrugs = join([social.alcohol && `Alcohol: ${social.alcohol}`, social.drugs && `Drugs: ${social.drugs}`]) || 'None reported';
  values.priorAnesthesia = priorAnesthesia(patient);

  const opioidsExpected = !/neuraxial|peripheral|^mac$/i.test(technique) && !/cataract|myringotomy|cystoscopy|stent|egd|colonoscopy/i.test(procedure);
  const apfel = apfelScore(patient, { opioidsExpected });
  values.apfel = child ? `Pediatric (POVOC): ${ageYears >= 3 ? 'age 3 or more' : 'under 3'}${/strabismus|tonsil|rectus/i.test(procedure) ? ', strabismus or tonsil surgery' : ''}${Number(patient.case?.duration_min) > 30 ? ', over 30 min' : ''}` : apfel.text;
  values.mets = ageYears !== null && ageYears < 12 ? 'N/A (child): age appropriate activity' : metsText(patient);
  values.rcri = ageYears !== null && ageYears < 18 ? 'N/A (pediatric)' : rcri(patient, procedure);
  values.stopBang = ageYears !== null && ageYears < 18
    ? (/snoring with|loud snor|\bosa\b|sleep apnea/.test(chartText(patient)) ? 'N/A (pediatric); snoring or OSA in the history, see airway' : 'N/A (pediatric); no snoring or OSA reported')
    : stopBang(patient, exam, Number(ref.bmi), ageYears);

  values.technique = technique;
  values.techniqueDetail = join([spec?.why, ...keyLeftovers]);
  const ivText = s(patient.preop?.iv) ? `IV in place: ${s(patient.preop.iv)}` : (child ? 'IV after inhalation induction' : 'One 18 g IV');
  values.monitorsAccess = join([`ASA standard monitors (ECG, NIBP, SpO2, EtCO2, temperature)`, ivText, spec?.mon, ...(keyAdds.monitorsAccess ?? [])]);
  values.positioning = join([
    s(patient.case?.position),
    'Pad all pressure points, arms under 90 degrees, eyes taped and protected, neck neutral; recheck after every position change',
    /tape/i.test(JSON.stringify(patient.allergies ?? [])) ? 'Tape allergy: silicone or paper tape only' : '',
    ...(keyAdds.positioning ?? []),
  ]);

  const c = patient.case ?? {};
  values.surgicalOverview = `${procedure} by ${s(c.surgeon)} for ${trimText(c.indication, 160)} Expected ${s(c.duration_min)} min. Position: ${s(c.position)}. Blood: ${s(c.blood)}. Disposition: ${s(c.dispo)}.${s(c.surgeon_notes) ? ` Surgeon: ${trimText(c.surgeon_notes, 160)}` : ''}`;
  values.keySurgicalSteps = join(spec?.steps ?? ['Incision and exposure (stimulating)', 'Main procedure', 'Closure and emergence']);
  Object.assign(values, antibioticPlan(patient));
  if (keyAdds.antibiotic?.length) values.antibiotic = join([values.antibiotic, ...keyAdds.antibiotic]);

  if (spec) {
    const usable = (rows) => rows.map((row) => drugRow(row, ctx)).filter((row) => !allergic(row[0], patient));
    fillTable(values, 'ind', usable(spec.ind ?? []), 6);
    fillTable(values, 'mnt', usable(spec.mnt ?? []), 6);
    fillTable(values, 'emg', usable(spec.emg ?? []), 6);
  }

  const usesRoc = JSON.stringify(spec?.ind ?? []).includes('Rocuronium');
  values.airwayPlanA = join([spec?.aA, ...(keyAdds.airwayPlanA ?? [])]) || values.airwayPlanA;
  values.airwayPlanB = spec?.aB ?? defaultAirwayB(technique, ageYears);
  values.airwayPlanC = spec?.aC ?? defaultAirwayC(ageYears, weight, usesRoc);

  const emgText = lower(JSON.stringify([spec?.emg ?? [], spec?.mnt ?? []]));
  const agents = [
    /ondansetron/.test(emgText) && !allergic('Ondansetron', patient) && 'ondansetron',
    /dexamethasone/.test(emgText) && 'dexamethasone',
    /scopolamine/.test(emgText) && 'scopolamine patch',
    /amisulpride/.test(emgText) && 'amisulpride rescue',
    /propofol infusion/.test(emgText) && 'propofol TIVA',
    /dexmedetomidine/.test(emgText) && 'dexmedetomidine',
  ].filter(Boolean);
  values.ponvProphylaxis = join([
    child ? `Pediatric PONV risk: ${values.apfel.replace(/^Pediatric \(POVOC\): /, '')}` : `Apfel ${apfel.score} of 4`,
    agents.length ? `Prophylaxis: ${agents.join(', ')}` : 'Prophylaxis: one agent or none for low risk',
    'Minimize opioids and volatile time; hydrate',
    'Rescue with a different class than prophylaxis',
    ...(keyAdds.ponvProphylaxis ?? []),
  ]);
  values.extubationCriteria = join([extubation(spec, technique, patient, answerKey, child), ...(keyAdds.extubationCriteria ?? [])]);

  const deficit = Number(ref.npoDeficit);
  values.lossReplacement = join([
    Number.isFinite(Number(ref.ebv)) ? `EBV ${ref.ebv} mL; ABL ${s(ref.abl ?? 'not computable (no Hct)')} mL to Hct ${s(ref.targetHct ?? 21)}` : '',
    'Replace blood loss with crystalloid 1.5 mL per mL (or colloid 1:1) up to the ABL; transfuse PRBC past the ABL or for Hgb under 7 (under 8 with cardiac disease)',
    `Maintenance ${s(ref.maintenanceRate)} mL/h${Number.isFinite(deficit) ? `; NPO deficit ${deficit} mL, half in the first hour` : ''}`,
    `Blood available: ${s(c.blood) || 'none ordered'}`,
    ...(keyAdds.lossReplacement ?? []),
  ]);

  contingencies(answerKey).forEach((row, index) => {
    values[`cont${index + 1}_if`] = row[0];
    values[`cont${index + 1}_first`] = row[1];
    values[`cont${index + 1}_then`] = row[2];
  });

  // Problem list: every red flag, then plan items, up to seven rows.
  let row = 1;
  while (row <= 7 && s(values[`prob${row}_problem`]).trim()) row += 1;
  for (const item of answerKey?.planItems ?? []) {
    if (row > 7) break;
    if (Object.values(values).some((value) => s(value) === item.item)) continue;
    values[`prob${row}_problem`] = item.item;
    values[`prob${row}_implication`] = `${s(item.domain).replace(/^\w/, (ch) => ch.toUpperCase())} plan for this case`;
    values[`prob${row}_plan`] = item.item;
    row += 1;
  }
  for (let i = 1; i <= 7; i += 1) {
    if (s(values[`prob${i}_problem`]).trim() && !s(values[`prob${i}_implication`]).trim()) values[`prob${i}_implication`] = 'See plan';
  }

  const flags = (answerKey?.redFlags ?? []).slice(0, 3).map((flag) => `${flag.finding} (${trimText(flag.action, 80)})`);
  const label = s(patient.preferred_name) || s(patient.name).split(',')[1]?.trim()?.split(' ')[0] || 'Patient';
  const induction = [1, 2, 3, 4, 5, 6].map((i) => values[`ind${i}_drug`]).filter(Boolean).join(', ');
  values.pacuReport = join([
    `${label}, ${s(patient.age)} ${s(patient.sex)}, ${s(patient.wt_kg)} kg, ASA ${s(values.asa)}, after ${procedure} under ${technique}`,
    `Allergies: ${s(values.allergies)}`,
    `History: ${trimText((patient.history?.pmh ?? []).slice(0, 3).join('; '), 180)}`,
    `Airway: Mallampati ${values.mallampati}, ${values.difficultAirway === 'No' ? 'no difficulty expected' : 'difficulty anticipated'}; ${trimText(values.airwayPlanA, 90)}`,
    induction ? `Drugs: ${induction}; reversal and analgesia as charted` : '',
    `Fluids: maintenance ${s(ref.maintenanceRate)} mL/h; totals and EBL from the record`,
    flags.length ? `Watch: ${flags.join('; ')}` : '',
    `Plan: ${s(c.dispo)}; multimodal analgesia, PONV rescue, call for SpO2 under 92%, SBP under 90 or over 180, HR under 50 or over 120, new neuro change`,
    ...(keyAdds.pacuReport ?? []),
  ]);
  // Chart text uses " - " as punctuation in places; the plan never does.
  for (const [field, value] of Object.entries(values)) {
    if (typeof value === 'string') values[field] = value.replace(/\s[-\u2012-\u2015]\s/g, ', ').replace(/[\u2012-\u2015]/g, ', ').replace(/, ,/g, ',');
  }
  return values;
}
