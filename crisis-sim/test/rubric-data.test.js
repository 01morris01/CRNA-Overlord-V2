import { describe, expect, test } from 'vitest';
import emergenceRaw from '../../data/rubrics/carson-newman-anesthesia-emergence.json';
import standardRaw from '../../data/rubrics/carson-newman-standard-iv-induction.json';
import rsiRaw from '../../data/rubrics/carson-newman-rsi-induction.json';
import {
  normalizeRubric,
  RUBRIC_SCORING_SOURCES,
  summarizeRubric,
} from '../sim/scenario/rubricLoader.js';

const POINT_SCALE = Object.freeze({ performed: 2, partial: 1, notPerformed: 0 });
const PASS_RULE = Object.freeze({
  minimumPercent: 85,
  requireEveryCriticalPerformed: true,
});

const EMERGENCE_ITEMS = [
  ['1', 'Anticipate the end of the surgery and communicate with the surgical team regarding closure and dressings.', false],
  ['2', 'Discontinue volatile anesthetics and decrease any continuous infusions (e.g., propofol).', false],
  ['3', 'Confirm adequate train-of-four (TOF) ratio and reverse neuromuscular blockade if necessary.', true],
  ['4', 'Ensure the patient has resumed spontaneous ventilation and that rate and tidal volumes are adequate.', true],
  ['5', 'Un-tape the eyes.', false],
  ['6', 'Suction the oropharynx as needed. Loosen tape / securing devices on the ETT. Ensure the patient is hemodynamically stable.', false],
  ['7', 'Extubate either when deeply anesthetized (deep extubation to prevent coughing / bucking) or when fully awake (patient opens eyes, follows commands, and has sustained protective airway reflexes).', true],
  ['8', 'Apply a supplementary oxygen delivery device (e.g., face mask, nasal cannula), assess for airway obstruction (e.g., need for OPA / NPA), and monitor oxygen saturation closely.', true],
  ['9', 'Ensure the patient is stable for transfer and provide a structured handover to the Post-Anesthesia Care Unit (PACU) team.', true],
];

const STANDARD_ITEMS = [
  ['1', 'Don PPE and observe universal precautions', true],
  ['2', 'Verbalize the anesthesia time-out prior to induction', true],
  ['3', 'Apply standard ASA monitors and obtain baseline vital signs\nPulse oximeter · blood pressure · ECG (BIS/CVP PRN); assess baseline vitals', true],
  ['4', 'Confirm readiness for induction\nMachine checked · suction on · monitors on · airway equipment available · IV access · induction drugs available', true],
  ['5', 'Position (“sniffing”) and pre-oxygenate\n100% FiO₂ for 3 minutes at normal tidal breaths; verbalize ETO₂ > 90%', true],
  ['6', 'Verbalize and administer induction medications\nAppropriate selection · correct doses · correct sequence', true],
  ['7', 'Confirm ability to mask-ventilate before the neuromuscular blocking agent\nAssess LOC / eyelash reflex, then confirm positive-pressure ventilation before the paralytic', true],
  ['8', 'Administer neuromuscular blocking agent and manage onset\nVerbalize agent and dose · demonstrate PPV while awaiting blockade · re-assess vital signs', true],
  ['9', 'Prepare to intubate\nConfirm unconsciousness/apnea · eye protection · confirm readiness (TOF 0/4) · continue SaO₂ monitoring', false],
  ['10', 'Laryngoscopy\nOpen mouth (jaw thrust / scissor) · insert blade avoiding teeth & soft tissue · verbalize anatomy (pharynx, epiglottis, glottis, cords)', false],
  ['11', 'Endotracheal intubation\nPass ETT through glottis under direct vision · remove blade & stylet · inflate cuff · connect breathing circuit', false],
  ['12', 'Confirm endotracheal tube placement\nContinuous ETCO₂ waveform · symmetric chest rise · bilateral breath sounds · absent epigastric sounds', true],
  ['13', 'Secure airway and initiate maintenance\nIf unable to intubate, mask-ventilate · turn on inhaled agent · secure ETT · set ventilator (mode, Vt, RR, fresh gas, FiO₂, bag→vent)', false],
  ['14', 'Closeout and overall competency\nRe-assess vitals & adjust agent · verbalize readiness for surgery · appropriate rescue if unable to intubate · intubation in < 3 attempts', true],
];

const RSI_ITEMS = [
  ['1', 'Don appropriate PPE and observe universal precautions during induction / intubation', true],
  ['2', 'Verbalize the anesthesia time-out prior to induction', true],
  ['3', 'Apply standard ASA monitors', true],
  ['3a', 'Pulse oximeter', true],
  ['3b', 'Blood pressure', true],
  ['3c', 'Electrocardiogram', true],
  ['3d', 'Other monitors (BIS, CVP, etc.) PRN', false],
  ['4', 'Obtain and assess baseline vital signs', true],
  ['5', 'Confirm readiness for induction (anesthesia machine checked, suction on, monitors on, airway equipment available, IV access, induction drugs available)', true],
  ['6', 'Position patient in proper “sniffing position”', false],
  ['7', 'Pre-oxygenate at 100% FiO₂ for 3 minutes at normal tidal breaths', true],
  ['8', 'Verbalize that the ETO₂ is > 90%', true],
  ['9', 'Apply cricoid pressure as appropriate', true],
  ['10', 'Verbalize and administer medications for induction', true],
  ['10a', 'Select appropriate medications', true],
  ['10b', 'Verbalize appropriate doses', true],
  ['10c', 'Administer the medications in the appropriate sequence', true],
  ['11', 'Do not mask ventilate prior to first laryngoscopy', false],
  ['12', 'Re-assess vital signs and correct if needed', true],
  ['13', 'Confirm unconsciousness and apnea', false],
  ['14', 'Apply eye protection', false],
  ['15', 'Verbalize and confirm readiness to intubate', false],
  ['16', 'Continue to monitor SaO₂', true],
  ['17', 'Open mouth – jaw thrust or scissor technique', false],
  ['18', 'Insert laryngoscope blade avoiding teeth and soft tissue', false],
  ['19', 'Verbalize anatomy visualized (pharynx, epiglottis, glottis, vocal cords)', false],
  ['20', 'Insert endotracheal tube through glottic opening', false],
  ['21', 'Verbalize and confirm visualization of endotracheal tube passing through glottic opening', false],
  ['22', 'Hold the endotracheal tube and remove the laryngoscope blade', false],
  ['23', 'Hold the endotracheal tube and remove the stylet', false],
  ['24', 'Inflate the endotracheal tube pilot balloon', false],
  ['25', 'Connect the breathing circuit to the endotracheal tube', false],
  ['26', 'Verbalize and confirm placement of the endotracheal tube by the presence of continuous ETCO₂ waveform with ventilation', true],
  ['27', 'Verbalize and confirm endotracheal tube placement by additional indicators', true],
  ['27a', 'Observe for symmetric chest rise', true],
  ['27b', 'Auscultate for bilateral breath sounds', true],
  ['27c', 'Auscultate over the stomach to rule out esophageal intubation', true],
  ['27d', 'Misting in the endotracheal tube', false],
  ['28', 'If unable to intubate perform positive pressure mask ventilation with cricoid pressure', true],
  ['29', 'Remove cricoid pressure after endotracheal tube placement confirmed', false],
  ['30', 'Turn on the inhaled anesthetic', false],
  ['31', 'Secure the endotracheal tube with tape or device', false],
  ['32', 'Set ventilator mode appropriate for the patient', true],
  ['33', 'Set tidal volume', false],
  ['34', 'Set the respiratory rate', false],
  ['35', 'Adjust the fresh gas flow rate', false],
  ['36', 'Set the FiO₂', false],
  ['37', 'Turn on the ventilator from bag to ventilator mode', false],
  ['38', 'Re-assess vital signs and correct if needed', true],
  ['39', 'Re-assess and adjust the inhaled anesthetic', false],
  ['40', 'Verbalize readiness for the surgical procedure', false],
  ['41', 'Appropriate intervention if unable to intubate', true],
  ['42', 'Completion of intubation in < 3 attempts', true],
];

const EMERGENCE_EVIDENCE = {
  2: {
    snapshotKeys: ['vaporizer', 'vaporizerAgent', 'activeAnestheticInfusions', 'airwayDevice'],
    actionLogEntries: ['volatile_changed', 'drug', 'extubate'],
    ruleId: 'emergence_stop_anesthetic',
  },
  3: {
    snapshotKeys: ['tofRatio', 'effectiveNmbBlockade', 'airwayDevice'],
    actionLogEntries: ['tof_checked', 'drug', 'extubate'],
    ruleId: 'emergence_tof_and_reversal',
  },
  4: {
    snapshotKeys: ['spontaneousRR', 'spontaneousTV', 'spontaneousMV', 'respiratoryMuscleCapability', 'airwayDevice'],
    actionLogEntries: ['spontaneous_ventilation_assessed', 'extubate'],
    ruleId: 'emergence_spontaneous_ventilation',
  },
};

const STANDARD_EVIDENCE = {
  7: {
    snapshotKeys: ['airwayDevice', 'mechanicalMV', 'effectiveMV'],
    actionLogEntries: ['mask_ppv_started', 'mask_ppv_completed', 'drug', 'intubation_attempt_started'],
    ruleId: 'standard_mask_ventilation_before_nmb',
  },
};

const RSI_EVIDENCE = {
  7: {
    snapshotKeys: ['fio2', 'eto2', 'airwayDevice', 'spontaneousRR', 'spontaneousTV'],
    actionLogEntries: ['preoxygenate', 'drug'],
    ruleId: 'rsi_preoxygenation',
  },
  9: {
    snapshotKeys: ['cricoidPressureActive'],
    actionLogEntries: ['drug', 'cricoid_pressure_applied', 'intubation_attempt_started'],
    ruleId: 'rsi_cricoid_applied',
  },
  '10a': {
    snapshotKeys: ['effectiveNmbBlockade'],
    actionLogEntries: ['drug'],
    ruleId: 'rsi_medication_selection',
  },
  '10c': {
    snapshotKeys: ['effectiveNmbBlockade', 'airwayDevice'],
    actionLogEntries: ['drug', 'intubation_attempt_started'],
    ruleId: 'rsi_medication_sequence',
  },
  11: {
    snapshotKeys: ['airwayDevice', 'ppvActive', 'intubationAttemptCount'],
    actionLogEntries: ['mask_ppv_started', 'intubation_attempt_started'],
    ruleId: 'rsi_no_ppv_before_first_laryngoscopy',
  },
  26: {
    snapshotKeys: ['capnogramPresent', 'etco2', 'airwayDevice', 'mechanicalMV'],
    actionLogEntries: ['intubation_attempt_succeeded', 'confirm_etco2'],
    ruleId: 'rsi_continuous_etco2_confirmation',
  },
  28: {
    snapshotKeys: ['cricoidPressureActive', 'ppvActive', 'mechanicalMV', 'effectiveMV', 'intubationAttemptCount'],
    actionLogEntries: ['intubation_attempt_failed', 'cricoid_pressure_applied', 'mask_ppv_started', 'mask_ppv_completed', 'intubation_attempt_started'],
    ruleId: 'rsi_failed_attempt_ppv_with_cricoid',
  },
  29: {
    snapshotKeys: ['cricoidPressureActive', 'capnogramPresent', 'etco2', 'airwayDevice'],
    actionLogEntries: ['intubation_attempt_succeeded', 'confirm_etco2', 'cricoid_pressure_released'],
    ruleId: 'rsi_cricoid_release_after_confirmation',
  },
  30: {
    snapshotKeys: ['vaporizer', 'vaporizerAgent', 'airwayDevice'],
    actionLogEntries: ['intubation_attempt_succeeded', 'volatile_changed'],
    ruleId: 'rsi_inhaled_anesthetic_on',
  },
  32: {
    snapshotKeys: ['ventMode', 'airwayDevice'],
    actionLogEntries: ['intubation_attempt_succeeded', 'vent_mode_changed'],
    ruleId: 'rsi_vent_mode',
  },
  33: {
    snapshotKeys: ['ventSetTV', 'airwayDevice'],
    actionLogEntries: ['intubation_attempt_succeeded', 'machine_settings_changed'],
    ruleId: 'rsi_tidal_volume',
  },
  34: {
    snapshotKeys: ['ventSetRR', 'airwayDevice'],
    actionLogEntries: ['intubation_attempt_succeeded', 'machine_settings_changed'],
    ruleId: 'rsi_respiratory_rate',
  },
  35: {
    snapshotKeys: ['o2Flow', 'airFlow', 'n2oFlow', 'airwayDevice'],
    actionLogEntries: ['intubation_attempt_succeeded', 'machine_settings_changed'],
    ruleId: 'rsi_fresh_gas',
  },
  36: {
    snapshotKeys: ['ventSetFiO2', 'fio2', 'airwayDevice'],
    actionLogEntries: ['intubation_attempt_succeeded', 'machine_settings_changed'],
    ruleId: 'rsi_fio2',
  },
  37: {
    snapshotKeys: ['ventMode', 'mechanicalMV', 'airwayDevice'],
    actionLogEntries: ['intubation_attempt_succeeded', 'vent_mode_changed'],
    ruleId: 'rsi_bag_to_vent',
  },
  41: {
    snapshotKeys: ['spo2', 'cricoidPressureActive', 'ppvActive', 'mechanicalMV', 'effectiveMV', 'intubationAttemptCount', 'airwayDevice'],
    actionLogEntries: ['intubation_attempt_failed', 'cricoid_pressure_applied', 'mask_ppv_started', 'mask_ppv_completed', 'intubation_attempt_started', 'intubation_attempt_succeeded'],
    ruleId: 'rsi_appropriate_failed_attempt_intervention',
  },
  42: {
    snapshotKeys: ['intubationAttemptCount', 'airwayDevice'],
    actionLogEntries: ['intubation_attempt_started', 'intubation_attempt_succeeded'],
    ruleId: 'rsi_under_three_attempts',
  },
};

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

function literalItems(rubric) {
  return rubric.items.map(({ displayNumber, text, critical }) => [displayNumber, text, critical]);
}

function sourceTotals(rubric) {
  return RUBRIC_SCORING_SOURCES.map((source) => (
    rubric.items.filter((item) => item.scoringSource === source).length
  ));
}

function evidenceByDisplayNumber(rubric) {
  return Object.fromEntries(rubric.items
    .filter((item) => item.scoringSource === 'ENGINE_OBSERVABLE')
    .map((item) => [item.displayNumber, item.engineEvidence]));
}

function expectCommonItemContract(rubric) {
  const ids = new Set();
  for (const item of rubric.items) {
    expect(item.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(ids.has(item.id)).toBe(false);
    ids.add(item.id);
    expect(item.displayNumber).toBeTypeOf('string');
    expect(item.displayNumber.length).toBeGreaterThan(0);
    expect(item.text).toBe(item.text.trim());
    expect(item.text.length).toBeGreaterThan(0);
    expect(item.text.endsWith('*')).toBe(false);
    expect(item.pointScale).toEqual(POINT_SCALE);
    expect(RUBRIC_SCORING_SOURCES).toContain(item.scoringSource);
    expect(item.engineEvidence === null).toBe(item.scoringSource !== 'ENGINE_OBSERVABLE');
  }
}

describe('literal Carson-Newman rubric data', () => {
  test.each([
    {
      raw: emergenceRaw,
      expected: EMERGENCE_ITEMS,
      metadata: {
        id: 'carson-newman-anesthesia-emergence',
        title: 'Clinical Examination — Anesthesia Emergence',
        course: 'NAS 560 · Summer 2026',
        sourceFile: 'Carson-Newman_Anesthesia_Emergence_Rubric.pdf',
        sourceSha256: 'c0745b7244f2120d4f509545f5dc26120800f0469208e736c3147119969e3fcf',
        sourceHeaderDenominator: 18,
        sourceFootnoteScoredItems: 9,
        computedItemCount: 9,
        computedMaxPoints: 18,
        computedCriticalCount: 5,
        discrepancies: [],
      },
      summary: { itemCount: 9, maxPoints: 18, criticalCount: 5 },
      sources: [3, 6, 0],
      evidence: EMERGENCE_EVIDENCE,
    },
    {
      raw: standardRaw,
      expected: STANDARD_ITEMS,
      metadata: {
        id: 'carson-newman-standard-iv-induction',
        title: 'Clinical Examination — General Anesthesia: Standard Intravenous Induction (Non–Rapid Sequence)',
        course: 'NAS 560 · Summer 2026',
        sourceFile: 'Carson-Newman_Standard_IV_Induction_Rubric.pdf',
        sourceSha256: '453455c5be47ff3e00cc13da1106ea8738501073302e3f1b6a846f786b2a91a7',
        sourceHeaderDenominator: 28,
        sourceFootnoteScoredItems: 14,
        computedItemCount: 14,
        computedMaxPoints: 28,
        computedCriticalCount: 10,
        discrepancies: [],
      },
      summary: { itemCount: 14, maxPoints: 28, criticalCount: 10 },
      sources: [1, 13, 0],
      evidence: STANDARD_EVIDENCE,
    },
    {
      raw: rsiRaw,
      expected: RSI_ITEMS,
      metadata: {
        id: 'carson-newman-rsi-induction',
        title: 'Clinical Examination — General Anesthesia: Rapid Sequence Induction (RSI)',
        course: 'NAS 560 · Summer 2026',
        sourceFile: 'Carson-Newman_RSI_Induction_Rubric.pdf',
        sourceSha256: '36a48cb37f9d85333357d583981048da615ec314611dee29a9a8eea6efb14de0',
        sourceHeaderDenominator: 49,
        sourceFootnoteScoredItems: 53,
        computedItemCount: 53,
        computedMaxPoints: 106,
        computedCriticalCount: 27,
        discrepancies: [{
          code: 'SOURCE_DENOMINATOR_MISMATCH',
          sourceHeaderDenominator: 49,
          computedMaxPoints: 106,
        }],
      },
      summary: { itemCount: 53, maxPoints: 106, criticalCount: 27 },
      sources: [17, 36, 0],
      evidence: RSI_EVIDENCE,
    },
  ])('$metadata.id preserves every source row and its scoring contract', ({
    raw, expected, metadata, summary, sources, evidence,
  }) => {
    const rubric = normalizeRubric(raw);

    expect(rubric).toMatchObject(metadata);
    expect(rubric.pointScale).toEqual(POINT_SCALE);
    expect(rubric.passRule).toEqual(PASS_RULE);
    expect(literalItems(rubric)).toEqual(expected);
    expectCommonItemContract(rubric);
    expect(summarizeRubric(rubric)).toEqual(summary);
    expect(sourceTotals(rubric)).toEqual(sources);
    expect(evidenceByDisplayNumber(rubric)).toEqual(evidence);
  });

  test('normalization deep-copies and deep-freezes rubric data', () => {
    const raw = copy(emergenceRaw);
    const rubric = normalizeRubric(raw);
    raw.title = 'changed after normalization';
    raw.items[0].text = 'changed after normalization';

    expect(rubric.title).toBe('Clinical Examination — Anesthesia Emergence');
    expect(rubric.items[0].text).toBe(EMERGENCE_ITEMS[0][1]);
    expect(Object.isFrozen(rubric)).toBe(true);
    expect(Object.isFrozen(rubric.items)).toBe(true);
    expect(Object.isFrozen(rubric.items[0])).toBe(true);
    expect(Object.isFrozen(rubric.items[0].pointScale)).toBe(true);
    expect(Object.isFrozen(rubric.items[1].engineEvidence)).toBe(true);
    expect(Object.isFrozen(rubric.items[1].engineEvidence.snapshotKeys)).toBe(true);
    expect(Object.isFrozen(rubric.discrepancies)).toBe(true);
    expect(Object.isFrozen(summarizeRubric(rubric))).toBe(true);
    expect(Object.isFrozen(RUBRIC_SCORING_SOURCES)).toBe(true);
    expect(Object.getPrototypeOf(rubric)).toBe(Object.prototype);
    expect(Object.getPrototypeOf(rubric.items[0])).toBe(Object.prototype);
    expect(Object.getPrototypeOf(rubric.items[1].engineEvidence)).toBe(Object.prototype);
    expect('attackerMetadata' in rubric).toBe(false);
    expect(() => { rubric.title = 'mutation'; }).toThrow(TypeError);
    expect(() => { rubric.items[0].text = 'mutation'; }).toThrow(TypeError);
    expect(() => { rubric.items[1].engineEvidence.ruleId = 'mutation'; }).toThrow(TypeError);
    expect(() => { rubric.items.push({}); }).toThrow(TypeError);
    expect(() => { Object.setPrototypeOf(rubric, { attackerMetadata: true }); }).toThrow(TypeError);
  });

  test('preserves the RSI source denominator mismatch without guessing a correction', () => {
    const rubric = normalizeRubric(rsiRaw);
    expect(rubric.sourceHeaderDenominator).toBe(49);
    expect(rubric.computedMaxPoints).toBe(106);
    expect(rubric.discrepancies).toEqual([{
      code: 'SOURCE_DENOMINATOR_MISMATCH',
      sourceHeaderDenominator: 49,
      computedMaxPoints: 106,
    }]);
  });
});

describe('strict rubric loader rejection', () => {
  test.each([
    ['empty rubric id', (raw) => { raw.id = ''; }],
    ['malformed source hash', (raw) => { raw.sourceSha256 = 'not-a-sha'; }],
    ['duplicate item ids', (raw) => { raw.items[1].id = raw.items[0].id; }],
    ['empty item text', (raw) => { raw.items[0].text = ' '; }],
    ['non-boolean critical metadata', (raw) => { raw.items[0].critical = 1; }],
    ['bad rubric point scale', (raw) => { raw.pointScale.partial = 2; }],
    ['bad per-item point scale', (raw) => { raw.items[0].pointScale.notPerformed = 1; }],
    ['unknown scoring source', (raw) => { raw.items[0].scoringSource = 'MODEL_GUESSED'; }],
    ['missing engine evidence', (raw) => { raw.items[1].engineEvidence = null; }],
    ['empty snapshot evidence', (raw) => { raw.items[1].engineEvidence.snapshotKeys = []; }],
    ['empty action evidence', (raw) => { raw.items[1].engineEvidence.actionLogEntries = []; }],
    ['unknown snapshot evidence', (raw) => { raw.items[1].engineEvidence.snapshotKeys = ['madeUpSnapshot']; }],
    ['unknown action evidence', (raw) => { raw.items[1].engineEvidence.actionLogEntries = ['made_up_action']; }],
    ['unknown rule id', (raw) => { raw.items[1].engineEvidence.ruleId = 'made_up_rule'; }],
    ['evidence on instructor item', (raw) => { raw.items[0].engineEvidence = copy(raw.items[1].engineEvidence); }],
    ['wrong computed item count', (raw) => { raw.computedItemCount += 1; }],
    ['wrong source footnote item count', (raw) => { raw.sourceFootnoteScoredItems += 1; }],
    ['wrong computed maximum', (raw) => { raw.computedMaxPoints += 2; }],
    ['wrong computed critical count', (raw) => { raw.computedCriticalCount = 99; }],
    ['wrong minimum pass percent', (raw) => { raw.passRule.minimumPercent = 80; }],
    ['weakened critical pass rule', (raw) => { raw.passRule.requireEveryCriticalPerformed = false; }],
    ['non-array discrepancies', (raw) => { raw.discrepancies = {}; }],
    ['malformed discrepancy object', (raw) => { raw.discrepancies = [{}]; }],
  ])('rejects %s', (_name, mutate) => {
    const raw = copy(emergenceRaw);
    mutate(raw);
    expect(() => normalizeRubric(raw)).toThrow();
  });

  test.each([
    ['root', (json) => `{"__proto__":{"attackerMetadata":"root"},${json.slice(1)}`],
    ['item', (json) => json.replace(
      '"items":[{',
      '"items":[{"__proto__":{"attackerMetadata":"item"},',
    )],
    ['engine evidence', (json) => json.replace(
      '"engineEvidence":{',
      '"engineEvidence":{"__proto__":{"attackerMetadata":"evidence"},',
    )],
  ])('rejects an own __proto__ key at the %s boundary', (_name, inject) => {
    const json = JSON.stringify(emergenceRaw);
    const raw = JSON.parse(inject(json));

    expect(() => normalizeRubric(raw)).toThrow(/Dangerous rubric key.*__proto__/);
    expect(Object.prototype.attackerMetadata).toBeUndefined();
  });

  test.each([
    ['top-level unexpected field', (raw) => { raw.critcal = 5; }, /Rubric schema.*unexpected.*critcal/],
    ['top-level missing field', (raw) => { delete raw.course; }, /Rubric schema.*missing.*course/],
    [
      'missing computed critical count',
      (raw) => { delete raw.computedCriticalCount; },
      /Rubric schema.*missing.*computedCriticalCount/,
    ],
    [
      'item unexpected field',
      (raw) => { raw.items[0].critcal = false; },
      /emergence-1 schema.*unexpected.*critcal/,
    ],
    [
      'item missing field',
      (raw) => { delete raw.items[0].critical; },
      /emergence-1 schema.*missing.*critical/,
    ],
  ])('rejects an exact-schema violation: %s', (_name, mutate, message) => {
    const raw = copy(emergenceRaw);
    mutate(raw);
    expect(() => normalizeRubric(raw)).toThrow(message);
  });

  test('rejects an unresolved source denominator mismatch', () => {
    const raw = copy(rsiRaw);
    raw.discrepancies = [];
    expect(() => normalizeRubric(raw)).toThrow(/SOURCE_DENOMINATOR_MISMATCH/);
  });

  test.each([
    ['a swapped real evidence block', (raw) => {
      [raw.items[1].engineEvidence, raw.items[2].engineEvidence] = [
        raw.items[2].engineEvidence,
        raw.items[1].engineEvidence,
      ];
    }],
    ['another known rule id', (raw) => {
      raw.items[1].engineEvidence.ruleId = raw.items[2].engineEvidence.ruleId;
    }],
    ['another known snapshot key', (raw) => {
      raw.items[1].engineEvidence.snapshotKeys[0] = 'tofRatio';
    }],
    ['a missing snapshot key', (raw) => {
      raw.items[1].engineEvidence.snapshotKeys.pop();
    }],
    ['an extra known snapshot key', (raw) => {
      raw.items[1].engineEvidence.snapshotKeys.push('tofRatio');
    }],
    ['another known action entry', (raw) => {
      raw.items[1].engineEvidence.actionLogEntries[0] = 'tof_checked';
    }],
    ['a missing action entry', (raw) => {
      raw.items[1].engineEvidence.actionLogEntries.pop();
    }],
    ['an extra known action entry', (raw) => {
      raw.items[1].engineEvidence.actionLogEntries.push('tof_checked');
    }],
  ])('rejects engine evidence that substitutes %s', (_name, mutate) => {
    const raw = copy(emergenceRaw);
    mutate(raw);
    expect(() => normalizeRubric(raw)).toThrow(/evidence contract/);
  });

  test('accepts the exact engine evidence arrays in a different order', () => {
    const raw = copy(emergenceRaw);
    raw.items[1].engineEvidence.snapshotKeys.reverse();
    raw.items[1].engineEvidence.actionLogEntries.reverse();
    expect(normalizeRubric(raw).items[1].engineEvidence).toEqual(raw.items[1].engineEvidence);
  });

  test('rejects malformed denominator discrepancy metadata', () => {
    const raw = copy(rsiRaw);
    raw.discrepancies[0].computedMaxPoints = 49;
    expect(() => normalizeRubric(raw)).toThrow(/computedMaxPoints/);
  });

  test.each([
    ['an unknown code', (discrepancy) => {
      discrepancy.code = 'UNREVIEWED_SOURCE_WARNING';
    }],
    ['a missing field', (discrepancy) => {
      delete discrepancy.sourceHeaderDenominator;
    }],
    ['an extra field', (discrepancy) => {
      discrepancy.note = 'not part of the approved schema';
    }],
    ['a non-numeric source denominator', (discrepancy) => {
      discrepancy.sourceHeaderDenominator = '49';
    }],
    ['a non-numeric computed maximum', (discrepancy) => {
      discrepancy.computedMaxPoints = '106';
    }],
  ])('rejects SOURCE_DENOMINATOR_MISMATCH with %s', (_name, mutate) => {
    const raw = copy(rsiRaw);
    mutate(raw.discrepancies[0]);
    expect(() => normalizeRubric(raw)).toThrow();
  });

  test('rejects a denominator mismatch warning when the denominator matches', () => {
    const raw = copy(emergenceRaw);
    raw.discrepancies = [{
      code: 'SOURCE_DENOMINATOR_MISMATCH',
      sourceHeaderDenominator: 18,
      computedMaxPoints: 18,
    }];
    expect(() => normalizeRubric(raw)).toThrow(/SOURCE_DENOMINATOR_MISMATCH/);
  });
});
