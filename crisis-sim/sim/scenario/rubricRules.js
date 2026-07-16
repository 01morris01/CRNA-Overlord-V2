const DEFAULT_TOF_RECOVERY_RATIO = 0.90;
const DEFAULT_PREOXYGENATION_FIO2_MIN = 0.99;
const DEFAULT_PREOXYGENATION_DURATION_SEC = 180;
const DEFAULT_SPONTANEOUS_RR_MIN = 8;
const DEFAULT_SPONTANEOUS_TV_MIN_ML_PER_KG = 5;
const DEFAULT_SPONTANEOUS_MV_MIN = 4;
const DEFAULT_MINIMUM_PPV_MINUTE_VENTILATION = 4;
const DEFAULT_ETCO2_CONFIRMATION_SAMPLES = 5;
const DEFAULT_ACCEPTED_INDUCTION_DRUGS = Object.freeze(['Propofol', 'Etomidate', 'Ketamine']);
const DEFAULT_ACCEPTED_NMB_DRUGS = Object.freeze(['Rocuronium', 'Succinylcholine']);
const DEFAULT_REVERSAL_DRUGS = Object.freeze(['Sugammadex', 'Neostigmine']);
const DEFAULT_ALLOWED_VENT_MODES = Object.freeze([1, 2]);
const SUPPORTED_VOLATILE_AGENTS = new Set(['sevoflurane', 'desflurane', 'isoflurane']);

const STATUS_POINTS = Object.freeze({
  pending: null,
  performed: 2,
  partial: 1,
  not_performed: 0,
});

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function cloneJson(value) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (Array.isArray(value)) return value.map(cloneJson);
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, cloneJson(nested)]));
  }
  throw new TypeError('Rubric rule evidence must contain only JSON-safe values');
}

function deepFreeze(value, visited = new WeakSet()) {
  if (value === null || typeof value !== 'object' || visited.has(value)) return value;
  visited.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, visited);
  return Object.freeze(value);
}

function immutable(value) {
  return deepFreeze(cloneJson(value));
}

function finiteCriterion(criteria, key, fallback, { min = 0, max = Infinity } = {}) {
  const value = Object.hasOwn(criteria, key) ? criteria[key] : fallback;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(`criteria.${key} must be a finite number from ${min} to ${max}`);
  }
  return value;
}

function stringListCriterion(criteria, key, fallback) {
  const value = Object.hasOwn(criteria, key) ? criteria[key] : fallback;
  if (!Array.isArray(value) || value.length === 0
    || value.some((entry) => typeof entry !== 'string' || entry.trim().length === 0)) {
    throw new TypeError(`criteria.${key} must be a nonempty array of drug names`);
  }
  return Object.freeze(value.map((entry) => entry.trim().toLocaleLowerCase('en-US')));
}

function modeListCriterion(criteria) {
  const value = Object.hasOwn(criteria, 'allowedVentModes')
    ? criteria.allowedVentModes
    : DEFAULT_ALLOWED_VENT_MODES;
  if (!Array.isArray(value) || value.length === 0
    || value.some((entry) => !Number.isInteger(entry))) {
    throw new TypeError('criteria.allowedVentModes must be a nonempty array of integer modes');
  }
  return Object.freeze([...value]);
}

function resolveCriteria(criteria = {}) {
  if (!isPlainObject(criteria)) throw new TypeError('criteria must be a plain object');
  const weightKg = Object.hasOwn(criteria, 'weightKg')
    ? finiteCriterion(criteria, 'weightKg', null, { min: Number.MIN_VALUE })
    : null;
  const spontaneousTvMinMlPerKg = finiteCriterion(
    criteria,
    'spontaneousTvMinMlPerKg',
    DEFAULT_SPONTANEOUS_TV_MIN_ML_PER_KG,
    { min: Number.MIN_VALUE },
  );
  const spontaneousTvMinMl = Object.hasOwn(criteria, 'spontaneousTvMinMl')
    ? finiteCriterion(criteria, 'spontaneousTvMinMl', null, { min: Number.MIN_VALUE })
    : (weightKg === null ? null : weightKg * spontaneousTvMinMlPerKg);

  const etco2ConfirmationSamples = finiteCriterion(
    criteria, 'etco2ConfirmationSamples', DEFAULT_ETCO2_CONFIRMATION_SAMPLES, { min: 1 },
  );
  if (!Number.isSafeInteger(etco2ConfirmationSamples)) {
    throw new RangeError('criteria.etco2ConfirmationSamples must be a positive safe integer');
  }

  return Object.freeze({
    tofRecoveryRatio: finiteCriterion(
      criteria, 'tofRecoveryRatio', DEFAULT_TOF_RECOVERY_RATIO, { min: 0, max: 1 },
    ),
    preoxygenationFiO2Min: finiteCriterion(
      criteria, 'preoxygenationFiO2Min', DEFAULT_PREOXYGENATION_FIO2_MIN,
      { min: 0, max: 1 },
    ),
    preoxygenationDurationSec: finiteCriterion(
      criteria, 'preoxygenationDurationSec', DEFAULT_PREOXYGENATION_DURATION_SEC,
      { min: Number.MIN_VALUE },
    ),
    spontaneousRrMin: finiteCriterion(
      criteria, 'spontaneousRrMin', DEFAULT_SPONTANEOUS_RR_MIN,
      { min: Number.MIN_VALUE },
    ),
    spontaneousTvMinMl,
    spontaneousTvMinMlPerKg,
    spontaneousMvMin: finiteCriterion(
      criteria, 'spontaneousMvMin', DEFAULT_SPONTANEOUS_MV_MIN,
      { min: Number.MIN_VALUE },
    ),
    minimumPpvMinuteVentilation: finiteCriterion(
      criteria, 'minimumPpvMinuteVentilation', DEFAULT_MINIMUM_PPV_MINUTE_VENTILATION,
      { min: Number.MIN_VALUE },
    ),
    etco2ConfirmationSamples,
    acceptedInductionDrugs: stringListCriterion(
      criteria, 'acceptedInductionDrugs', DEFAULT_ACCEPTED_INDUCTION_DRUGS,
    ),
    acceptedNmbDrugs: stringListCriterion(
      criteria, 'acceptedNmbDrugs', DEFAULT_ACCEPTED_NMB_DRUGS,
    ),
    reversalDrugs: stringListCriterion(criteria, 'reversalDrugs', DEFAULT_REVERSAL_DRUGS),
    allowedVentModes: modeListCriterion(criteria),
  });
}

function entries(actions) {
  if (!Array.isArray(actions)) throw new TypeError('actions must be an array');
  return actions.map((record, index) => ({ record, index }));
}

function traceEntries(trace) {
  if (!Array.isArray(trace)) throw new TypeError('trace must be an array');
  return trace.map((sample, index) => ({ sample, index }));
}

function ownValue(value, key) {
  return isPlainObject(value) && Object.hasOwn(value, key) ? value[key] : undefined;
}

function actionCitation(entry, metaKeys = [], snapshotKeys = []) {
  const citation = {
    index: entry.index,
    tSec: entry.record.tSec,
    action: entry.record.action,
  };
  const meta = {};
  for (const key of metaKeys) {
    const value = ownValue(entry.record.meta, key);
    if (value !== undefined) meta[key] = value;
  }
  const snapshot = {};
  for (const key of snapshotKeys) {
    const value = ownValue(entry.record.snapshot, key);
    if (value !== undefined) snapshot[key] = value;
  }
  if (Object.keys(meta).length > 0) citation.meta = meta;
  if (Object.keys(snapshot).length > 0) citation.snapshot = snapshot;
  return citation;
}

function traceCitation(entry, fields) {
  const used = {};
  for (const field of fields) {
    if (Object.hasOwn(entry.sample, field)) used[field] = entry.sample[field];
  }
  return { index: entry.index, tSec: entry.sample.t, fields: used };
}

function evidence(ruleId, actionCitations = [], traceCitations = [], extra = {}) {
  return { ruleId, actions: actionCitations, trace: traceCitations, ...extra };
}

function result(status, ruleId, actionCitations = [], traceCitations = [], extra = {}) {
  return immutable({
    status,
    points: STATUS_POINTS[status],
    evidence: evidence(ruleId, actionCitations, traceCitations, extra),
  });
}

function namedDrug(entry) {
  const drug = ownValue(entry.record.meta, 'drug');
  return typeof drug === 'string' ? drug.trim().toLocaleLowerCase('en-US') : null;
}

function firstDrug(actionEntries, accepted) {
  return actionEntries.find((entry) => (
    entry.record.action === 'drug' && accepted.includes(namedDrug(entry))
  ));
}

function actionRatio(entry) {
  const metaRatio = ownValue(entry.record.meta, 'ratio');
  if (typeof metaRatio === 'number' && Number.isFinite(metaRatio)) return metaRatio;
  const snapshotRatio = ownValue(entry.record.snapshot, 'tofRatio');
  return typeof snapshotRatio === 'number' && Number.isFinite(snapshotRatio)
    ? snapshotRatio
    : null;
}

function actionNumber(entry, metaKey, snapshotKey = metaKey) {
  const metaValue = ownValue(entry.record.meta, metaKey);
  if (typeof metaValue === 'number' && Number.isFinite(metaValue)) return metaValue;
  const snapshotValue = ownValue(entry.record.snapshot, snapshotKey);
  return typeof snapshotValue === 'number' && Number.isFinite(snapshotValue)
    ? snapshotValue
    : null;
}

function assessmentValues(entry) {
  return {
    rr: actionNumber(entry, 'spontaneousRR'),
    tv: actionNumber(entry, 'spontaneousTV'),
    mv: actionNumber(entry, 'spontaneousMV'),
  };
}

function ppvValues(entry) {
  const airwayDevice = ownValue(entry.record.meta, 'airwayDevice')
    ?? ownValue(entry.record.snapshot, 'airwayDevice');
  const minuteVentilation = actionNumber(entry, 'minuteVentilation', 'mechanicalMV')
    ?? actionNumber(entry, 'effectiveMV', 'effectiveMV');
  return { airwayDevice, minuteVentilation };
}

function qualifyingPpv(entry, criteria) {
  const values = ppvValues(entry);
  return entry.record.action === 'mask_ppv_started'
    && values.airwayDevice === 'mask'
    && values.minuteVentilation !== null
    && values.minuteVentilation >= criteria.minimumPpvMinuteVentilation;
}

function machinePatch(entry) {
  const meta = isPlainObject(entry.record.meta) ? entry.record.meta : {};
  return isPlainObject(meta.patch) ? meta.patch : meta;
}

function firstAttempt(actionEntries) {
  return actionEntries.find(({ record }) => record.action === 'intubation_attempt_started');
}

function firstSuccess(actionEntries) {
  return actionEntries.find(({ record }) => record.action === 'intubation_attempt_succeeded');
}

function endDiscriminator(actionEntries, finalized) {
  return finalized || actionEntries.some(({ record }) => record.action === 'extubate');
}

function infusionRates(value) {
  const rates = [];
  const add = (drug, raw) => {
    if (typeof drug !== 'string' || drug.trim().length === 0) return;
    let rate = raw;
    if (isPlainObject(raw)) {
      rate = ['rate', 'infusionRate', 'rateMgPerHour', 'rateMgKgHour']
        .map((key) => ownValue(raw, key))
        .find((candidate) => typeof candidate === 'number' && Number.isFinite(candidate));
    }
    if (typeof rate === 'number' && Number.isFinite(rate) && rate > 0) {
      rates.push({ drug: drug.trim().toLocaleLowerCase('en-US'), rate });
    }
  };
  if (Array.isArray(value)) {
    for (const entry of value) {
      if (!isPlainObject(entry)) continue;
      add(entry.drug ?? entry.name, entry);
    }
  } else if (isPlainObject(value)) {
    for (const [drug, rate] of Object.entries(value)) add(drug, rate);
  }
  return rates;
}

function infusionAction(entry) {
  const meta = isPlainObject(entry.record.meta) ? entry.record.meta : {};
  const drug = typeof meta.drug === 'string'
    ? meta.drug.trim().toLocaleLowerCase('en-US')
    : null;
  const rateKey = ['rate', 'infusionRate', 'rateMgPerHour', 'rateMgKgHour', 'newRate']
    .find((key) => typeof meta[key] === 'number' && Number.isFinite(meta[key]));
  const previousKey = ['previousRate', 'previousInfusionRate', 'previousRateMgPerHour']
    .find((key) => typeof meta[key] === 'number' && Number.isFinite(meta[key]));
  const identifiesInfusion = entry.record.action.includes('infusion') || rateKey !== undefined;
  if (!identifiesInfusion || !drug || !rateKey) return null;
  return {
    drug,
    rate: meta[rateKey],
    previousRate: previousKey ? meta[previousKey] : null,
    keys: ['drug', previousKey, rateKey].filter(Boolean),
  };
}

function evaluateStopAnesthetic({ actionEntries, trace, finalized, ruleId }) {
  const sources = new Map();
  const addSource = (key, type, name, initialRate, time, citation, citationType) => {
    if (!(initialRate > 0)) return;
    const current = sources.get(key);
    if (current && current.time <= time) return;
    sources.set(key, {
      type, name, initialRate, time, citation, citationType,
    });
  };

  for (const entry of traceEntries(trace)) {
    if (typeof entry.sample.vaporizer === 'number' && entry.sample.vaporizer > 0) {
      addSource(
        'volatile',
        'volatile',
        typeof entry.sample.vaporizerAgent === 'string'
          ? entry.sample.vaporizerAgent.toLocaleLowerCase('en-US')
          : null,
        entry.sample.vaporizer,
        entry.sample.t,
        traceCitation(entry, ['vaporizer', 'vaporizerAgent', 'activeAnestheticInfusions']),
        'trace',
      );
    }
    for (const infusion of infusionRates(entry.sample.activeAnestheticInfusions)) {
      addSource(
        `infusion:${infusion.drug}`,
        'infusion',
        infusion.drug,
        infusion.rate,
        entry.sample.t,
        traceCitation(entry, ['activeAnestheticInfusions']),
        'trace',
      );
    }
  }

  for (const entry of actionEntries) {
    if (entry.record.action === 'volatile_changed') {
      const dial = ownValue(entry.record.meta, 'dialPercent');
      const agent = ownValue(entry.record.meta, 'agent');
      if (typeof dial === 'number' && dial > 0 && typeof agent === 'string') {
        addSource(
          'volatile',
          'volatile',
          agent.toLocaleLowerCase('en-US'),
          dial,
          entry.record.tSec,
          actionCitation(entry, ['agent', 'dialPercent']),
          'action',
        );
      }
    }
    for (const infusion of infusionRates(ownValue(entry.record.snapshot, 'activeAnestheticInfusions'))) {
      addSource(
        `infusion:${infusion.drug}`,
        'infusion',
        infusion.drug,
        infusion.rate,
        entry.record.tSec,
        actionCitation(entry, [], ['activeAnestheticInfusions']),
        'action',
      );
    }
    const infusion = infusionAction(entry);
    if (infusion?.previousRate > 0) {
      addSource(
        `infusion:${infusion.drug}`,
        'infusion',
        infusion.drug,
        infusion.previousRate,
        entry.record.tSec,
        actionCitation(entry, infusion.keys),
        'action',
      );
    }
  }

  if (sources.size === 0) {
    return result(endDiscriminator(actionEntries, finalized) ? 'not_performed' : 'pending', ruleId);
  }

  const sourceStates = [];
  const stateChangeCitations = [];
  for (const source of sources.values()) {
    if (source.type === 'volatile') {
      const changes = actionEntries.filter((entry) => (
        entry.record.action === 'volatile_changed'
        && entry.record.tSec >= source.time
        && typeof ownValue(entry.record.meta, 'dialPercent') === 'number'
      ));
      const reduced = changes.some((entry) => (
        ownValue(entry.record.meta, 'dialPercent') < source.initialRate
      ));
      const latest = changes.at(-1);
      sourceStates.push({
        reduced,
        remains: latest ? ownValue(latest.record.meta, 'dialPercent') > 0 : true,
      });
      stateChangeCitations.push(...changes.map((entry) => (
        actionCitation(entry, ['agent', 'dialPercent'])
      )));
    } else {
      const changes = actionEntries
        .map((entry) => ({ entry, infusion: infusionAction(entry) }))
        .filter(({ entry, infusion }) => (
          infusion?.drug === source.name && entry.record.tSec >= source.time
        ));
      const reduced = changes.some(({ infusion }) => infusion.rate < source.initialRate);
      const latest = changes.at(-1);
      sourceStates.push({
        reduced,
        remains: latest ? latest.infusion.rate > 0 : true,
      });
      stateChangeCitations.push(...changes.map(({ entry, infusion }) => (
        actionCitation(entry, infusion.keys)
      )));
    }
  }

  const sourceActionCitations = [...sources.values()]
    .filter(({ citationType }) => citationType === 'action')
    .map(({ citation }) => citation);
  const sourceTraceCitations = [...sources.values()]
    .filter(({ citationType }) => citationType === 'trace')
    .map(({ citation }) => citation)
    .filter((citation, index, citations) => (
      citations.findIndex((candidate) => candidate.index === citation.index) === index
    ));
  const actionCitations = [...sourceActionCitations, ...stateChangeCitations]
    .filter((citation, index, citations) => (
      citations.findIndex((candidate) => candidate.index === citation.index) === index
    ))
    .sort((left, right) => left.index - right.index);

  if (sourceStates.every(({ reduced, remains }) => reduced && !remains)) {
    return result('performed', ruleId, actionCitations, sourceTraceCitations);
  }
  if (sourceStates.some(({ reduced }) => reduced)) {
    return result('partial', ruleId, actionCitations, sourceTraceCitations);
  }
  return result(
    endDiscriminator(actionEntries, finalized) ? 'not_performed' : 'pending',
    ruleId,
    actionCitations,
    sourceTraceCitations,
  );
}

function evaluateTof({ actionEntries, criteria, finalized, ruleId }) {
  const extubation = actionEntries.find(({ record }) => record.action === 'extubate');
  const cutoff = extubation?.index ?? Infinity;
  const checks = actionEntries.filter((entry) => (
    entry.index < cutoff && entry.record.action === 'tof_checked' && actionRatio(entry) !== null
  ));
  const reversals = actionEntries.filter((entry) => (
    entry.index < cutoff
    && entry.record.action === 'drug'
    && criteria.reversalDrugs.includes(namedDrug(entry))
  ));
  const latest = checks.at(-1);
  const citations = [
    ...checks.map((entry) => actionCitation(entry, ['ratio'], ['tofRatio'])),
    ...reversals.map((entry) => actionCitation(entry, ['drug', 'doseMg'])),
  ].sort((left, right) => left.index - right.index);
  if (latest && actionRatio(latest) >= criteria.tofRecoveryRatio) {
    const latestLowBefore = checks.filter((entry) => (
      entry.index < latest.index && actionRatio(entry) < criteria.tofRecoveryRatio
    )).at(-1);
    if (!latestLowBefore) return result('performed', ruleId, citations);
    const orderedReversal = reversals.some((entry) => (
      entry.index > latestLowBefore.index && entry.index < latest.index
    ));
    return result(orderedReversal ? 'performed' : 'partial', ruleId, citations);
  }
  if (checks.length > 0 || reversals.length > 0) return result('partial', ruleId, citations);
  return result(extubation || finalized ? 'not_performed' : 'pending', ruleId, citations);
}

function evaluateSpontaneous({ actionEntries, criteria, finalized, ruleId }) {
  const extubation = actionEntries.find(({ record }) => record.action === 'extubate');
  const cutoff = extubation?.index ?? Infinity;
  const assessment = actionEntries.filter(
    (entry) => (
      entry.index < cutoff && entry.record.action === 'spontaneous_ventilation_assessed'
    ),
  ).at(-1);
  if (!assessment) {
    return result(endDiscriminator(actionEntries, finalized) ? 'not_performed' : 'pending', ruleId);
  }
  const citation = actionCitation(
    assessment,
    ['spontaneousRR', 'spontaneousTV', 'spontaneousMV'],
    ['spontaneousRR', 'spontaneousTV', 'spontaneousMV'],
  );
  if (criteria.spontaneousTvMinMl === null) {
    return result(finalized ? 'not_performed' : 'pending', ruleId, [citation]);
  }
  const values = assessmentValues(assessment);
  const passes = [
    values.rr !== null && values.rr >= criteria.spontaneousRrMin,
    values.tv !== null && values.tv >= criteria.spontaneousTvMinMl,
    values.mv !== null && values.mv >= criteria.spontaneousMvMin,
  ];
  if (passes.every(Boolean)) return result('performed', ruleId, [citation]);
  if (passes.some(Boolean)) return result('partial', ruleId, [citation]);
  return result('not_performed', ruleId, [citation]);
}

function evaluateStandardMask({ actionEntries, criteria, finalized, ruleId }) {
  const nmb = firstDrug(actionEntries, criteria.acceptedNmbDrugs);
  if (!nmb) return result(finalized ? 'not_performed' : 'pending', ruleId);
  const before = actionEntries.filter((entry) => entry.index < nmb.index && qualifyingPpv(entry, criteria));
  if (before.length > 0) {
    return result('performed', ruleId, [
      actionCitation(before.at(-1), ['airwayDevice', 'minuteVentilation'], ['airwayDevice', 'mechanicalMV', 'effectiveMV']),
      actionCitation(nmb, ['drug', 'doseMg']),
    ]);
  }
  const nextAttempt = actionEntries.find((entry) => (
    entry.index > nmb.index && entry.record.action === 'intubation_attempt_started'
  ));
  const after = actionEntries.find((entry) => (
    entry.index > nmb.index
    && entry.index < (nextAttempt?.index ?? Infinity)
    && qualifyingPpv(entry, criteria)
  ));
  if (after) return result('partial', ruleId, [
    actionCitation(nmb, ['drug', 'doseMg']),
    actionCitation(after, ['airwayDevice', 'minuteVentilation'], ['airwayDevice', 'mechanicalMV', 'effectiveMV']),
  ]);
  if (nextAttempt || finalized) return result('not_performed', ruleId, [
    actionCitation(nmb, ['drug', 'doseMg']),
    ...(nextAttempt ? [actionCitation(nextAttempt, ['attemptNumber'])] : []),
  ]);
  return result('pending', ruleId, [actionCitation(nmb, ['drug', 'doseMg'])]);
}

function qualifyingPreoxygenation(trace, induction, criteria) {
  const available = traceEntries(trace)
    .filter(({ sample }) => Number.isSafeInteger(sample.t) && sample.t <= induction.record.tSec)
    .sort((left, right) => left.sample.t - right.sample.t);
  const qualifies = ({ sample }) => (
    typeof sample.fio2 === 'number'
    && sample.fio2 >= criteria.preoxygenationFiO2Min
    && typeof sample.spontaneousRR === 'number'
    && sample.spontaneousRR > 0
    && typeof sample.spontaneousTV === 'number'
    && sample.spontaneousTV > 0
  );
  let current = [];
  let longest = [];
  for (const candidate of available) {
    if (!qualifies(candidate)) {
      current = [];
      continue;
    }
    if (current.length > 0 && candidate.sample.t - current.at(-1).sample.t !== 1) {
      current = [];
    }
    current.push(candidate);
    if (current.length > longest.length) longest = [...current];
  }
  return longest;
}

function evaluatePreoxygenation({ actionEntries, trace, criteria, finalized, ruleId }) {
  const induction = firstDrug(actionEntries, criteria.acceptedInductionDrugs);
  if (!induction) return result(finalized ? 'not_performed' : 'pending', ruleId);
  const run = qualifyingPreoxygenation(trace, induction, criteria);
  const actionCitations = [actionCitation(induction, ['drug', 'doseMg'])];
  const traceCitations = run.map((entry) => (
    traceCitation(entry, ['fio2', 'spontaneousRR', 'spontaneousTV'])
  ));
  const duration = run.length;
  if (duration >= criteria.preoxygenationDurationSec) {
    return result('performed', ruleId, actionCitations, traceCitations);
  }
  if (duration > 0) return result('partial', ruleId, actionCitations, traceCitations);
  return result('not_performed', ruleId, actionCitations, traceCitations);
}

function evaluateCricoid({ actionEntries, criteria, finalized, ruleId }) {
  const induction = firstDrug(actionEntries, criteria.acceptedInductionDrugs);
  const attempt = firstAttempt(actionEntries);
  const applications = actionEntries.filter(
    ({ record }) => record.action === 'cricoid_pressure_applied',
  );
  const correct = applications.find((entry) => (
    induction && entry.index > induction.index && (!attempt || entry.index < attempt.index)
  ));
  if (correct) return result('performed', ruleId, [
    actionCitation(induction, ['drug', 'doseMg']),
    actionCitation(correct),
    ...(attempt ? [actionCitation(attempt, ['attemptNumber'])] : []),
  ]);
  if (applications.length > 0) {
    return result('partial', ruleId, applications.map((entry) => actionCitation(entry)));
  }
  return result(finalized ? 'not_performed' : 'pending', ruleId);
}

function evaluateMedicationSelection({ actionEntries, criteria, finalized, ruleId }) {
  const induction = firstDrug(actionEntries, criteria.acceptedInductionDrugs);
  const nmb = firstDrug(actionEntries, criteria.acceptedNmbDrugs);
  const citations = [induction, nmb].filter(Boolean)
    .map((entry) => actionCitation(entry, ['drug', 'doseMg']));
  if (induction && nmb) return result('performed', ruleId, citations);
  if (induction || nmb) return result('partial', ruleId, citations);
  return result(finalized ? 'not_performed' : 'pending', ruleId);
}

function evaluateMedicationSequence({ actionEntries, criteria, finalized, ruleId }) {
  const induction = firstDrug(actionEntries, criteria.acceptedInductionDrugs);
  const nmb = firstDrug(actionEntries, criteria.acceptedNmbDrugs);
  const attempt = firstAttempt(actionEntries);
  const citations = [induction, nmb, attempt].filter(Boolean).map((entry) => (
    entry.record.action === 'drug'
      ? actionCitation(entry, ['drug', 'doseMg'])
      : actionCitation(entry, ['attemptNumber'])
  ));
  if (induction && nmb && attempt) {
    return result(
      induction.index < nmb.index && nmb.index < attempt.index ? 'performed' : 'partial',
      ruleId,
      citations,
    );
  }
  return result(finalized ? 'not_performed' : 'pending', ruleId, citations);
}

function evaluateNoPpv({ actionEntries, finalized, ruleId }) {
  const attempt = firstAttempt(actionEntries);
  const ppv = actionEntries.find((entry) => (
    entry.record.action === 'mask_ppv_started' && (!attempt || entry.index < attempt.index)
  ));
  if (ppv) return result('not_performed', ruleId, [
    actionCitation(ppv, ['airwayDevice', 'minuteVentilation'], ['airwayDevice', 'mechanicalMV']),
    ...(attempt ? [actionCitation(attempt, ['attemptNumber'])] : []),
  ]);
  if (attempt) return result('performed', ruleId, [actionCitation(attempt, ['attemptNumber'])]);
  return result(finalized ? 'not_performed' : 'pending', ruleId);
}

function qualifyingEtco2Run(trace, success, criteria) {
  const candidates = traceEntries(trace)
    .filter(({ sample }) => Number.isSafeInteger(sample.t) && sample.t >= success.record.tSec)
    .sort((left, right) => left.sample.t - right.sample.t);
  const qualifies = ({ sample }) => (
    sample.airwayDevice === 'intubated'
    && typeof sample.mechanicalMV === 'number' && sample.mechanicalMV > 0
    && sample.capnogramPresent === true
    && typeof sample.etco2 === 'number' && sample.etco2 > 0
  );
  let current = [];
  for (const candidate of candidates) {
    if (!qualifies(candidate)) {
      current = [];
      continue;
    }
    if (current.length > 0 && candidate.sample.t - current.at(-1).sample.t !== 1) current = [];
    current.push(candidate);
    if (current.length >= criteria.etco2ConfirmationSamples) return current;
  }
  return [];
}

function anyEtco2Waveform(trace, success) {
  return traceEntries(trace).find(({ sample }) => (
    Number.isSafeInteger(sample.t)
    && sample.t >= success.record.tSec
    && sample.airwayDevice === 'intubated'
    && typeof sample.mechanicalMV === 'number' && sample.mechanicalMV > 0
    && sample.capnogramPresent === true
    && typeof sample.etco2 === 'number' && sample.etco2 > 0
  ));
}

function etco2Facts(actionEntries, trace, criteria) {
  const success = firstSuccess(actionEntries);
  if (!success) return { success: null, confirmation: null, run: [], waveform: null };
  const confirmation = actionEntries.find((entry) => (
    entry.index > success.index && entry.record.action === 'confirm_etco2'
  ));
  return {
    success,
    confirmation,
    run: qualifyingEtco2Run(trace, success, criteria),
    waveform: anyEtco2Waveform(trace, success),
  };
}

function etco2Citations(facts) {
  const actions = [facts.success, facts.confirmation].filter(Boolean)
    .map((entry) => actionCitation(entry, ['attemptNumber']));
  const trace = facts.run.length > 0
    ? facts.run.map((entry) => traceCitation(
      entry, ['airwayDevice', 'mechanicalMV', 'capnogramPresent', 'etco2'],
    ))
    : (facts.waveform ? [traceCitation(
      facts.waveform, ['airwayDevice', 'mechanicalMV', 'capnogramPresent', 'etco2'],
    )] : []);
  return { actions, trace };
}

function evaluateEtco2({ actionEntries, trace, criteria, finalized, ruleId }) {
  const facts = etco2Facts(actionEntries, trace, criteria);
  const citations = etco2Citations(facts);
  if (facts.confirmation && facts.run.length >= criteria.etco2ConfirmationSamples) {
    return result('performed', ruleId, citations.actions, citations.trace);
  }
  if (facts.confirmation || facts.waveform) {
    return result('partial', ruleId, citations.actions, citations.trace);
  }
  return result(finalized ? 'not_performed' : 'pending', ruleId, citations.actions, citations.trace);
}

function cricoidActiveAt(actionEntries, target) {
  let active = false;
  for (const entry of actionEntries) {
    if (entry.index > target.index) break;
    if (entry.record.action === 'cricoid_pressure_applied') active = true;
    if (entry.record.action === 'cricoid_pressure_released') active = false;
  }
  const explicit = ownValue(target.record.meta, 'cricoidPressure')
    ?? ownValue(target.record.snapshot, 'cricoidPressureActive');
  return explicit === true || active;
}

function evaluateFailedIntervention({ actionEntries, criteria, finalized, ruleId }) {
  const failures = actionEntries.filter(
    ({ record }) => record.action === 'intubation_attempt_failed',
  );
  if (failures.length === 0) {
    return result(
      finalized ? 'performed' : 'pending', ruleId, [], [],
      finalized ? { conditionTriggered: false } : {},
    );
  }
  const failure = failures.at(-1);
  const nextAttempt = actionEntries.find((entry) => (
    entry.index > failure.index && entry.record.action === 'intubation_attempt_started'
  ));
  const endIndex = nextAttempt?.index ?? Infinity;
  const segment = actionEntries.filter((entry) => entry.index > failure.index && entry.index < endIndex);
  const ppv = segment.find((entry) => qualifyingPpv(entry, criteria));
  const cricoidBeforeFailure = actionEntries.filter((entry) => (
    entry.index <= failure.index && entry.record.action === 'cricoid_pressure_applied'
  )).at(-1);
  const cricoid = segment.find(({ record }) => record.action === 'cricoid_pressure_applied')
    ?? (cricoidActiveAt(actionEntries, failure) ? cricoidBeforeFailure ?? failure : null);
  const ppvWithCricoid = ppv && cricoidActiveAt(actionEntries, ppv);
  const citations = [
    actionCitation(failure, ['attemptNumber']),
    ...(cricoid ? [actionCitation(cricoid)] : []),
    ...(ppv ? [actionCitation(
      ppv,
      ['airwayDevice', 'minuteVentilation', 'cricoidPressure'],
      ['airwayDevice', 'mechanicalMV', 'effectiveMV', 'cricoidPressureActive'],
    )] : []),
    ...(nextAttempt ? [actionCitation(nextAttempt, ['attemptNumber'])] : []),
  ];
  if (ppvWithCricoid) return result('performed', ruleId, citations, [], { conditionTriggered: true });
  if (ppv || cricoid) return result('partial', ruleId, citations, [], { conditionTriggered: true });
  if (nextAttempt || finalized) {
    return result('not_performed', ruleId, citations, [], { conditionTriggered: true });
  }
  return result('pending', ruleId, citations, [], { conditionTriggered: true });
}

function evaluateCricoidRelease({ actionEntries, trace, criteria, finalized, ruleId }) {
  const facts = etco2Facts(actionEntries, trace, criteria);
  const release = actionEntries.filter(
    ({ record }) => record.action === 'cricoid_pressure_released',
  ).at(-1);
  const applied = actionEntries.filter(
    ({ record }) => record.action === 'cricoid_pressure_applied',
  ).at(-1);
  const etco2 = etco2Citations(facts);
  const citations = [
    ...(applied ? [actionCitation(applied)] : []),
    ...etco2.actions,
    ...(release ? [actionCitation(release)] : []),
  ].sort((left, right) => left.index - right.index);
  if (applied && release && applied.index < release.index
    && facts.success && release.index > facts.success.index) {
    const waveformCompletedAt = facts.run.at(-1)?.sample.t ?? Infinity;
    if (facts.confirmation && facts.run.length >= criteria.etco2ConfirmationSamples
      && facts.confirmation.index < release.index
      && release.record.tSec >= waveformCompletedAt) {
      return result('performed', ruleId, citations, etco2.trace);
    }
    return result('partial', ruleId, citations, etco2.trace);
  }
  return result(finalized ? 'not_performed' : 'pending', ruleId, citations, etco2.trace);
}

function postSuccessRule({
  actionEntries, finalized, ruleId, actionName, extract, activeAtSuccess,
}) {
  const success = firstSuccess(actionEntries);
  const candidates = actionEntries
    .filter((entry) => entry.record.action === actionName)
    .map((entry) => ({ entry, value: extract(entry) }))
    .filter(({ value }) => value !== null);
  if (success) {
    const after = candidates.find(({ entry }) => entry.index > success.index);
    if (after) return result('performed', ruleId, [
      actionCitation(success, ['attemptNumber']),
      actionCitation(after.entry, after.value.metaKeys, after.value.snapshotKeys),
    ]);
    const before = candidates.filter(({ entry }) => entry.index < success.index).at(-1);
    if (before && activeAtSuccess(before.value.value, success.record.snapshot)) {
      return result('partial', ruleId, [
        actionCitation(before.entry, before.value.metaKeys, before.value.snapshotKeys),
        actionCitation(success, ['attemptNumber'], before.value.successSnapshotKeys),
      ]);
    }
  }
  return result(finalized ? 'not_performed' : 'pending', ruleId, [
    ...(success ? [actionCitation(success, ['attemptNumber'])] : []),
  ]);
}

function volatileSetting(entry) {
  const agent = ownValue(entry.record.meta, 'agent');
  const dial = ownValue(entry.record.meta, 'dialPercent');
  if (typeof agent !== 'string' || !SUPPORTED_VOLATILE_AGENTS.has(agent.toLocaleLowerCase('en-US'))
    || typeof dial !== 'number' || !Number.isFinite(dial) || dial <= 0) return null;
  return {
    value: { agent: agent.toLocaleLowerCase('en-US'), dial },
    metaKeys: ['agent', 'dialPercent'],
    snapshotKeys: [],
    successSnapshotKeys: ['vaporizer', 'vaporizerAgent'],
  };
}

function ventModeSetting(entry, criteria, { requireBag = false } = {}) {
  const mode = ownValue(entry.record.meta, 'mode');
  const previousMode = ownValue(entry.record.meta, 'previousMode');
  if (!criteria.allowedVentModes.includes(mode) || (requireBag && previousMode !== 0)) return null;
  return {
    value: mode,
    metaKeys: ['previousMode', 'mode'],
    snapshotKeys: [],
    successSnapshotKeys: ['ventMode'],
  };
}

function numericMachineSetting(entry, names, successSnapshotKeys, validator = (value) => value > 0) {
  const patch = machinePatch(entry);
  const key = names.find((candidate) => Object.hasOwn(patch, candidate));
  const value = key ? patch[key] : undefined;
  if (typeof value !== 'number' || !Number.isFinite(value) || !validator(value)) return null;
  return {
    value,
    metaKeys: isPlainObject(entry.record.meta?.patch) ? ['patch'] : [key],
    snapshotKeys: [],
    successSnapshotKeys,
  };
}

function freshGasSetting(entry) {
  const patch = machinePatch(entry);
  const keys = ['o2FlowLPerMin', 'airFlowLPerMin', 'n2oFlowLPerMin'];
  const changed = keys.filter((key) => Object.hasOwn(patch, key));
  if (changed.length === 0) return null;
  if (changed.some((key) => (
    typeof patch[key] !== 'number' || !Number.isFinite(patch[key]) || patch[key] < 0
  ))) return null;
  const snapshotNames = {
    o2FlowLPerMin: 'o2Flow',
    airFlowLPerMin: 'airFlow',
    n2oFlowLPerMin: 'n2oFlow',
  };
  const finalFlows = Object.fromEntries(keys.map((key) => {
    if (Object.hasOwn(patch, key)) return [key, patch[key]];
    const snapshotValue = ownValue(entry.record.snapshot, snapshotNames[key]);
    return [key, typeof snapshotValue === 'number' && Number.isFinite(snapshotValue)
      ? snapshotValue
      : 0];
  }));
  const total = Object.values(finalFlows).reduce((sum, value) => sum + value, 0);
  if (!Number.isFinite(total) || total <= 0) return null;
  return {
    value: finalFlows,
    metaKeys: isPlainObject(entry.record.meta?.patch) ? ['patch'] : changed,
    snapshotKeys: ['o2Flow', 'airFlow', 'n2oFlow'],
    successSnapshotKeys: ['o2Flow', 'airFlow', 'n2oFlow'],
  };
}

function evaluatePostSuccess({ actionEntries, criteria, finalized, ruleId }) {
  switch (ruleId) {
    case 'rsi_inhaled_anesthetic_on':
      return postSuccessRule({
        actionEntries, finalized, ruleId, actionName: 'volatile_changed', extract: volatileSetting,
        activeAtSuccess: (value, snapshot) => (
          isPlainObject(snapshot)
          && typeof snapshot.vaporizer === 'number' && snapshot.vaporizer > 0
          && typeof snapshot.vaporizerAgent === 'string'
          && snapshot.vaporizerAgent.toLocaleLowerCase('en-US') === value.agent
        ),
      });
    case 'rsi_vent_mode':
      return postSuccessRule({
        actionEntries, finalized, ruleId, actionName: 'vent_mode_changed',
        extract: (entry) => ventModeSetting(entry, criteria),
        activeAtSuccess: (value, snapshot) => isPlainObject(snapshot) && snapshot.ventMode === value,
      });
    case 'rsi_tidal_volume':
      return postSuccessRule({
        actionEntries, finalized, ruleId, actionName: 'machine_settings_changed',
        extract: (entry) => numericMachineSetting(
          entry, ['setTidalVolume', 'ventSetTV'], ['ventSetTV'],
        ),
        activeAtSuccess: (value, snapshot) => isPlainObject(snapshot) && snapshot.ventSetTV === value,
      });
    case 'rsi_respiratory_rate':
      return postSuccessRule({
        actionEntries, finalized, ruleId, actionName: 'machine_settings_changed',
        extract: (entry) => numericMachineSetting(
          entry, ['setRespiratoryRate', 'ventSetRR'], ['ventSetRR'],
        ),
        activeAtSuccess: (value, snapshot) => isPlainObject(snapshot) && snapshot.ventSetRR === value,
      });
    case 'rsi_fresh_gas':
      return postSuccessRule({
        actionEntries, finalized, ruleId, actionName: 'machine_settings_changed', extract: freshGasSetting,
        activeAtSuccess: (_value, snapshot) => (
          isPlainObject(snapshot)
          && [snapshot.o2Flow, snapshot.airFlow, snapshot.n2oFlow]
            .every((value) => typeof value === 'number' && Number.isFinite(value))
          && snapshot.o2Flow + snapshot.airFlow + snapshot.n2oFlow > 0
        ),
      });
    case 'rsi_fio2':
      return postSuccessRule({
        actionEntries, finalized, ruleId, actionName: 'machine_settings_changed',
        extract: (entry) => numericMachineSetting(
          entry,
          ['setFiO2', 'ventSetFiO2'],
          ['ventSetFiO2', 'fio2'],
          (value) => value >= 0.21 && value <= 1,
        ),
        activeAtSuccess: (value, snapshot) => (
          isPlainObject(snapshot) && (snapshot.ventSetFiO2 === value || snapshot.fio2 === value)
        ),
      });
    case 'rsi_bag_to_vent':
      return postSuccessRule({
        actionEntries, finalized, ruleId, actionName: 'vent_mode_changed',
        extract: (entry) => ventModeSetting(entry, criteria, { requireBag: true }),
        activeAtSuccess: (value, snapshot) => isPlainObject(snapshot) && snapshot.ventMode === value,
      });
    default:
      throw new RangeError(`Unknown rubric rule: ${ruleId}`);
  }
}

function evaluateUnderThree({ actionEntries, finalized, ruleId }) {
  const third = actionEntries.find((entry) => (
    entry.record.action === 'intubation_attempt_started'
    && ownValue(entry.record.meta, 'attemptNumber') >= 3
  ));
  if (third) return result('not_performed', ruleId, [actionCitation(third, ['attemptNumber'])]);
  const success = actionEntries.find((entry) => (
    entry.record.action === 'intubation_attempt_succeeded'
    && [1, 2].includes(ownValue(entry.record.meta, 'attemptNumber'))
  ));
  if (success) return result('performed', ruleId, [actionCitation(success, ['attemptNumber'])]);
  return result(finalized ? 'not_performed' : 'pending', ruleId);
}

function context(input, ruleId) {
  return {
    actionEntries: entries(input.actions ?? []),
    trace: input.trace ?? [],
    criteria: resolveCriteria(input.criteria ?? {}),
    finalized: input.finalized === true,
    ruleId,
  };
}

const RULE_EVALUATORS = {
  emergence_stop_anesthetic: evaluateStopAnesthetic,
  emergence_tof_and_reversal: evaluateTof,
  emergence_spontaneous_ventilation: evaluateSpontaneous,
  standard_mask_ventilation_before_nmb: evaluateStandardMask,
  rsi_preoxygenation: evaluatePreoxygenation,
  rsi_cricoid_applied: evaluateCricoid,
  rsi_medication_selection: evaluateMedicationSelection,
  rsi_medication_sequence: evaluateMedicationSequence,
  rsi_no_ppv_before_first_laryngoscopy: evaluateNoPpv,
  rsi_continuous_etco2_confirmation: evaluateEtco2,
  rsi_failed_attempt_ppv_with_cricoid: evaluateFailedIntervention,
  rsi_cricoid_release_after_confirmation: evaluateCricoidRelease,
  rsi_inhaled_anesthetic_on: evaluatePostSuccess,
  rsi_vent_mode: evaluatePostSuccess,
  rsi_tidal_volume: evaluatePostSuccess,
  rsi_respiratory_rate: evaluatePostSuccess,
  rsi_fresh_gas: evaluatePostSuccess,
  rsi_fio2: evaluatePostSuccess,
  rsi_bag_to_vent: evaluatePostSuccess,
  rsi_appropriate_failed_attempt_intervention: evaluateFailedIntervention,
  rsi_under_three_attempts: evaluateUnderThree,
};

export const RUBRIC_RULES = Object.freeze({ ...RULE_EVALUATORS });

export function evaluateRubricItem({
  item, actions = [], trace = [], criteria = {}, finalized = false,
} = {}) {
  const ruleId = item?.engineEvidence?.ruleId;
  const evaluator = RUBRIC_RULES[ruleId];
  if (!evaluator) throw new RangeError(`Unknown rubric rule: ${String(ruleId)}`);
  return evaluator(context({ actions, trace, criteria, finalized }, ruleId));
}

function makeFlag(rubric, item, trigger, flagEvidence) {
  return immutable({
    rubricId: rubric.id,
    itemId: item.id,
    displayNumber: item.displayNumber,
    text: item.text,
    tSec: trigger.record.tSec,
    triggerAction: trigger.record.action,
    evidence: flagEvidence,
  });
}

function flagEvidenceWithTrigger(ruleEvidence, trigger) {
  const triggerCitation = actionCitation(trigger, [
    'drug', 'doseMg', 'ratio', 'attemptNumber', 'airwayDevice', 'minuteVentilation',
  ], [
    'tofRatio', 'spontaneousRR', 'spontaneousTV', 'spontaneousMV', 'mechanicalMV',
  ]);
  const actions = [...(ruleEvidence?.actions ?? [])];
  if (!actions.some((citation) => citation.index === trigger.index)) actions.push(triggerCitation);
  actions.sort((left, right) => left.index - right.index);
  return { ...(ruleEvidence ?? {}), actions };
}

export function detectRubricViolations({
  rubric, action, actions = [], trace = [], criteria = {},
} = {}) {
  for (const item of rubric?.items ?? []) {
    const ruleId = item.engineEvidence?.ruleId;
    if (ruleId && !RUBRIC_RULES[ruleId]) throw new RangeError(`Unknown rubric rule: ${ruleId}`);
  }
  const actionEntries = entries(actions);
  const triggerIndex = actionEntries.findIndex(({ record }) => record === action);
  const fallbackIndex = actionEntries.length - 1;
  const trigger = actionEntries[triggerIndex >= 0 ? triggerIndex : fallbackIndex];
  if (!trigger || trigger.record.action === 'instructor_rubric_score_set') return immutable([]);
  const resolvedCriteria = resolveCriteria(criteria);
  const flags = [];
  const add = (item, ruleEvidence = { actions: [], trace: [] }) => {
    if (!item) return;
    flags.push(makeFlag(
      rubric,
      item,
      trigger,
      flagEvidenceWithTrigger(ruleEvidence, trigger),
    ));
  };

  if (trigger.record.action === 'drug') {
    const drug = namedDrug(trigger);
    const firstAcceptedNmb = firstDrug(actionEntries, resolvedCriteria.acceptedNmbDrugs);
    if (resolvedCriteria.acceptedNmbDrugs.includes(drug) && firstAcceptedNmb?.index === trigger.index) {
      const item = rubric.items.find(
        (candidate) => candidate.engineEvidence?.ruleId === 'standard_mask_ventilation_before_nmb',
      );
      if (item) {
        const qualifyingBefore = actionEntries.some((entry) => (
          entry.index < trigger.index && qualifyingPpv(entry, resolvedCriteria)
        ));
        if (!qualifyingBefore) add(item);
      }
    }

    const firstInduction = firstDrug(actionEntries, resolvedCriteria.acceptedInductionDrugs);
    if (resolvedCriteria.acceptedInductionDrugs.includes(drug)
      && firstInduction?.index === trigger.index) {
      const preoxygenationItem = rubric.items.find(({ id }) => (
        id === 'standard-5' || id === 'rsi-7'
      ));
      if (preoxygenationItem) {
        const run = qualifyingPreoxygenation(trace, trigger, resolvedCriteria);
        const duration = run.length;
        if (duration < resolvedCriteria.preoxygenationDurationSec) {
          add(preoxygenationItem, {
            actions: [],
            trace: run.map((entry) => (
              traceCitation(entry, ['fio2', 'spontaneousRR', 'spontaneousTV'])
            )),
          });
        }
      }
    }
  }

  if (trigger.record.action === 'mask_ppv_started') {
    const firstAttemptEntry = firstAttempt(actionEntries);
    if (!firstAttemptEntry || trigger.index < firstAttemptEntry.index) {
      add(rubric.items.find(
        (candidate) => candidate.engineEvidence?.ruleId === 'rsi_no_ppv_before_first_laryngoscopy',
      ));
    }
  }

  if (trigger.record.action === 'extubate') {
    for (const ruleId of ['emergence_tof_and_reversal', 'emergence_spontaneous_ventilation']) {
      const item = rubric.items.find((candidate) => candidate.engineEvidence?.ruleId === ruleId);
      if (!item) continue;
      const evaluation = evaluateRubricItem({ item, actions, trace, criteria, finalized: false });
      if (evaluation.points !== 2) add(item, evaluation.evidence);
    }
  }

  if (trigger.record.action === 'intubation_attempt_started'
    && ownValue(trigger.record.meta, 'attemptNumber') >= 3) {
    add(rubric.items.find(
      (candidate) => candidate.engineEvidence?.ruleId === 'rsi_under_three_attempts',
    ));
  }

  return immutable(flags);
}
