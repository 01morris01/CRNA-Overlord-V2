const DEFAULT_TOF_RECOVERY_RATIO = 0.90;
const DEFAULT_PREOXYGENATION_FIO2_MIN = 0.99;
const DEFAULT_PREOXYGENATION_DURATION_SEC = 180;
const DEFAULT_SPONTANEOUS_RR_MIN = 8;
const DEFAULT_SPONTANEOUS_TV_MIN_ML_PER_KG = 5;
const DEFAULT_SPONTANEOUS_MV_MIN = 4;
const DEFAULT_MINIMUM_PPV_MINUTE_VENTILATION = 4;
const DEFAULT_FAILED_ATTEMPT_SPO2_RECOVERY_DELTA = 2;
const DEFAULT_ETCO2_CONFIRMATION_SAMPLES = 5;
const DEFAULT_ACCEPTED_INDUCTION_DRUGS = Object.freeze(['Propofol', 'Etomidate', 'Ketamine']);
const DEFAULT_ACCEPTED_NMB_DRUGS = Object.freeze(['Rocuronium', 'Succinylcholine']);
const DEFAULT_REVERSAL_DRUGS = Object.freeze(['Sugammadex', 'Neostigmine']);
const DEFAULT_ALLOWED_VENT_MODES = Object.freeze([1, 2]);
const SUPPORTED_VOLATILE_AGENTS = new Set(['sevoflurane', 'desflurane', 'isoflurane']);
const SUPPORTED_MECHANICAL_VENT_MODES = new Set([1, 2, 3]);
const DANGEROUS_OBJECT_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

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

function copyJsonSafe(value, label, ancestors = new WeakSet()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError(`${label} must contain only JSON-safe values`);
    return value;
  }
  if (typeof value !== 'object') {
    throw new TypeError(`${label} must contain only JSON-safe values`);
  }
  if (ancestors.has(value)) throw new TypeError(`${label} must not contain cycles`);
  if (Object.getOwnPropertySymbols(value).length > 0) {
    throw new TypeError(`${label} must contain only JSON-safe string keys`);
  }

  const ownNames = Object.getOwnPropertyNames(value);
  const dangerousKey = ownNames.find((key) => DANGEROUS_OBJECT_KEYS.has(key));
  if (dangerousKey) throw new TypeError(`Dangerous rubric data key is not allowed: ${dangerousKey}`);

  ancestors.add(value);
  let copied;
  if (Array.isArray(value)) {
    if (Object.getPrototypeOf(value) !== Array.prototype) {
      ancestors.delete(value);
      throw new TypeError(`${label} must contain only ordinary arrays`);
    }
    const length = Object.getOwnPropertyDescriptor(value, 'length').value;
    if (ownNames.length !== length + 1) {
      ancestors.delete(value);
      throw new TypeError(`${label} arrays must contain only JSON-safe indexed values`);
    }
    copied = new Array(length);
    for (let index = 0; index < length; index += 1) {
      const descriptor = Object.getOwnPropertyDescriptor(value, `${index}`);
      if (!descriptor || !descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) {
        ancestors.delete(value);
        throw new TypeError(`${label} array indexes must be JSON-safe enumerable data properties`);
      }
      copied[index] = copyJsonSafe(descriptor.value, `${label}[${index}]`, ancestors);
    }
  } else {
    if (!isPlainObject(value)) {
      ancestors.delete(value);
      throw new TypeError(`${label} must contain only JSON-safe plain objects`);
    }
    copied = {};
    for (const key of ownNames) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) {
        ancestors.delete(value);
        throw new TypeError(`${label} must contain only JSON-safe data properties`);
      }
      Object.defineProperty(copied, key, {
        configurable: true,
        enumerable: true,
        value: copyJsonSafe(descriptor.value, `${label}.${key}`, ancestors),
        writable: true,
      });
    }
  }
  ancestors.delete(value);
  return copied;
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
    || value.some((entry) => (
      !Number.isSafeInteger(entry) || !SUPPORTED_MECHANICAL_VENT_MODES.has(entry)
    ))
    || new Set(value).size !== value.length) {
    throw new TypeError(
      'criteria.allowedVentModes must be a nonempty unique array of supported modes 1, 2, or 3',
    );
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
  if (spontaneousTvMinMl !== null
    && (!Number.isFinite(spontaneousTvMinMl) || spontaneousTvMinMl <= 0)) {
    throw new RangeError('criteria spontaneous tidal-volume threshold must be finite and positive');
  }

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
    failedAttemptSpo2RecoveryDelta: finiteCriterion(
      criteria,
      'failedAttemptSpo2RecoveryDelta',
      DEFAULT_FAILED_ATTEMPT_SPO2_RECOVERY_DELTA,
      { min: 0, max: 100 },
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

function normalizedRoot(input, label) {
  const copied = copyJsonSafe(input, label);
  if (!isPlainObject(copied)) throw new TypeError(`${label} must be a plain object`);
  return copied;
}

function normalizeActionRecords(actions) {
  if (!Array.isArray(actions)) throw new TypeError('actions must be an ordinary dense array');
  let previousTime = -Infinity;
  return actions.map((record, index) => {
    if (!isPlainObject(record)) throw new TypeError(`actions[${index}] must be a plain object`);
    if (typeof record.tSec !== 'number' || !Number.isFinite(record.tSec) || record.tSec < 0) {
      throw new TypeError(`actions[${index}].tSec must be a finite nonnegative number`);
    }
    if (record.tSec < previousTime) {
      throw new TypeError('actions must use nondecreasing ledger chronology');
    }
    previousTime = record.tSec;
    if (typeof record.action !== 'string' || record.action.trim().length === 0) {
      throw new TypeError(`actions[${index}].action must be a nonempty string`);
    }
    const meta = Object.hasOwn(record, 'meta') ? record.meta : {};
    const snapshot = Object.hasOwn(record, 'snapshot') ? record.snapshot : null;
    if (!isPlainObject(meta)) throw new TypeError(`actions[${index}].meta must be a plain object`);
    if (snapshot !== null && !isPlainObject(snapshot)) {
      throw new TypeError(`actions[${index}].snapshot must be null or a plain object`);
    }
    return { ...record, meta, snapshot };
  });
}

function normalizeTraceRecords(trace) {
  if (!Array.isArray(trace)) throw new TypeError('trace must be an ordinary dense array');
  let previousTime = -1;
  return trace.map((sample, index) => {
    if (!isPlainObject(sample)) throw new TypeError(`trace[${index}] must be a plain object`);
    if (!Number.isSafeInteger(sample.t) || sample.t < 0) {
      throw new TypeError(`trace[${index}].t must be a nonnegative safe integer`);
    }
    if (sample.t <= previousTime) {
      throw new TypeError('trace timestamps must be strictly increasing and unique');
    }
    previousTime = sample.t;
    return sample;
  });
}

function normalizeItem(item, label = 'item') {
  if (!isPlainObject(item)) throw new TypeError(`${label} must be a plain object`);
  if (!isPlainObject(item.engineEvidence)) {
    throw new TypeError(`${label}.engineEvidence must be a plain object`);
  }
  if (typeof item.engineEvidence.ruleId !== 'string'
    || item.engineEvidence.ruleId.trim().length === 0) {
    throw new TypeError(`${label}.engineEvidence.ruleId must be a nonempty string`);
  }
  return item;
}

function normalizeRubric(rubric) {
  if (!isPlainObject(rubric)) throw new TypeError('rubric must be a plain object');
  if (typeof rubric.id !== 'string' || rubric.id.trim().length === 0) {
    throw new TypeError('rubric.id must be a nonempty string');
  }
  if (!Array.isArray(rubric.items)) throw new TypeError('rubric.items must be an ordinary dense array');
  for (let index = 0; index < rubric.items.length; index += 1) {
    const item = rubric.items[index];
    if (!isPlainObject(item)) throw new TypeError(`rubric.items[${index}] must be a plain object`);
    if (typeof item.id !== 'string' || item.id.trim().length === 0) {
      throw new TypeError(`rubric.items[${index}].id must be a nonempty string`);
    }
    if (item.engineEvidence !== null) normalizeItem(item, `rubric.items[${index}]`);
  }
  return rubric;
}

function normalizeEvaluationInput(input) {
  const copied = normalizedRoot(input, 'evaluateRubricItem input');
  const finalized = Object.hasOwn(copied, 'finalized') ? copied.finalized : false;
  if (typeof finalized !== 'boolean') throw new TypeError('finalized must be a boolean');
  const criteria = Object.hasOwn(copied, 'criteria') ? copied.criteria : {};
  if (!isPlainObject(criteria)) throw new TypeError('criteria must be a plain object');
  return {
    item: normalizeItem(copied.item),
    actions: normalizeActionRecords(copied.actions ?? []),
    trace: normalizeTraceRecords(copied.trace ?? []),
    criteria,
    finalized,
  };
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
  const extubation = actionEntries.find(({ record }) => record.action === 'extubate');
  const cutoff = extubation?.index ?? Infinity;
  const scoringActions = actionEntries.filter((entry) => entry.index < cutoff);
  const scoringTrace = traceEntries(trace).filter(({ sample }) => (
    !extubation || sample.t <= extubation.record.tSec
  ));
  const sources = new Map();
  const addSource = ({
    key, type, name, initialRate, time, activationIndex = null, citation, citationType,
  }) => {
    if (!(initialRate > 0)) return;
    const current = sources.get(key);
    if (current && (current.time < time
      || (current.time === time
        && (current.activationIndex ?? -1) <= (activationIndex ?? -1)))) return;
    sources.set(key, {
      type, name, initialRate, time, activationIndex, citation, citationType,
    });
  };

  for (const entry of scoringTrace) {
    if (typeof entry.sample.vaporizer === 'number' && entry.sample.vaporizer > 0) {
      addSource({
        key: 'volatile',
        type: 'volatile',
        name: typeof entry.sample.vaporizerAgent === 'string'
          ? entry.sample.vaporizerAgent.toLocaleLowerCase('en-US')
          : null,
        initialRate: entry.sample.vaporizer,
        time: entry.sample.t,
        citation: traceCitation(
          entry, ['vaporizer', 'vaporizerAgent', 'activeAnestheticInfusions'],
        ),
        citationType: 'trace',
      });
    }
    for (const infusion of infusionRates(entry.sample.activeAnestheticInfusions)) {
      addSource({
        key: `infusion:${infusion.drug}`,
        type: 'infusion',
        name: infusion.drug,
        initialRate: infusion.rate,
        time: entry.sample.t,
        citation: traceCitation(entry, ['activeAnestheticInfusions']),
        citationType: 'trace',
      });
    }
  }

  for (const entry of scoringActions) {
    if (entry.record.action === 'volatile_changed') {
      const dial = ownValue(entry.record.meta, 'dialPercent');
      const agent = ownValue(entry.record.meta, 'agent');
      if (typeof dial === 'number' && dial > 0 && typeof agent === 'string') {
        addSource({
          key: 'volatile',
          type: 'volatile',
          name: agent.toLocaleLowerCase('en-US'),
          initialRate: dial,
          time: entry.record.tSec,
          activationIndex: entry.index,
          citation: actionCitation(entry, ['agent', 'dialPercent']),
          citationType: 'action',
        });
      }
    }
    for (const infusion of infusionRates(ownValue(entry.record.snapshot, 'activeAnestheticInfusions'))) {
      addSource({
        key: `infusion:${infusion.drug}`,
        type: 'infusion',
        name: infusion.drug,
        initialRate: infusion.rate,
        time: entry.record.tSec,
        activationIndex: entry.index,
        citation: actionCitation(entry, [], ['activeAnestheticInfusions']),
        citationType: 'action',
      });
    }
    const infusion = infusionAction(entry);
    if (infusion?.previousRate > 0) {
      addSource({
        key: `infusion:${infusion.drug}`,
        type: 'infusion',
        name: infusion.drug,
        initialRate: infusion.previousRate,
        time: entry.record.tSec,
        activationIndex: entry.index,
        citation: actionCitation(entry, infusion.keys),
        citationType: 'action',
      });
    }
  }

  if (sources.size === 0) {
    return result(extubation || finalized ? 'not_performed' : 'pending', ruleId);
  }

  const sourceStates = [];
  const stateChangeCitations = [];
  for (const source of sources.values()) {
    const afterActivation = (entry) => (
      source.activationIndex === null
        ? entry.record.tSec >= source.time
        : entry.index >= source.activationIndex
    );
    if (source.type === 'volatile') {
      const changes = scoringActions.filter((entry) => (
        entry.record.action === 'volatile_changed'
        && afterActivation(entry)
        && typeof ownValue(entry.record.meta, 'dialPercent') === 'number'
      ));
      const changedTowardStop = changes.some((entry) => (
        ownValue(entry.record.meta, 'dialPercent') < source.initialRate
      ));
      const latest = changes.at(-1);
      sourceStates.push({
        complete: latest ? ownValue(latest.record.meta, 'dialPercent') === 0 : false,
        changedTowardStop,
      });
      stateChangeCitations.push(...changes.map((entry) => (
        actionCitation(entry, ['agent', 'dialPercent'])
      )));
    } else {
      const changes = scoringActions
        .map((entry) => ({ entry, infusion: infusionAction(entry) }))
        .filter(({ entry, infusion }) => (
          infusion?.drug === source.name && afterActivation(entry)
        ));
      const latest = changes.at(-1);
      const terminalRate = latest?.infusion.rate ?? source.initialRate;
      sourceStates.push({
        complete: terminalRate < source.initialRate,
        changedTowardStop: changes.some(({ infusion }) => (
          infusion.rate < source.initialRate
        )),
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

  if (sourceStates.every(({ complete }) => complete)) {
    return result('performed', ruleId, actionCitations, sourceTraceCitations);
  }
  if (sourceStates.some(({ complete, changedTowardStop }) => complete || changedTowardStop)) {
    return result('partial', ruleId, actionCitations, sourceTraceCitations);
  }
  return result(
    extubation || finalized ? 'not_performed' : 'pending',
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
  const qualifies = (sample) => (
    typeof sample.fio2 === 'number'
    && sample.fio2 >= criteria.preoxygenationFiO2Min
    && typeof sample.spontaneousRR === 'number'
    && sample.spontaneousRR > 0
    && typeof sample.spontaneousTV === 'number'
    && sample.spontaneousTV > 0
  );
  let currentStartIndex = null;
  let currentEndIndex = null;
  let currentCount = 0;
  let bestStartIndex = null;
  let bestEndIndex = null;
  let bestCount = 0;
  for (let index = 0; index < trace.length; index += 1) {
    const sample = trace[index];
    if (sample.t > induction.record.tSec) break;
    if (!qualifies(sample)) {
      currentStartIndex = null;
      currentEndIndex = null;
      currentCount = 0;
      continue;
    }
    if (currentEndIndex !== null && sample.t - trace[currentEndIndex].t !== 1) {
      currentStartIndex = null;
      currentEndIndex = null;
      currentCount = 0;
    }
    if (currentStartIndex === null) currentStartIndex = index;
    currentEndIndex = index;
    currentCount += 1;
    if (currentCount > bestCount) {
      bestStartIndex = currentStartIndex;
      bestEndIndex = currentEndIndex;
      bestCount = currentCount;
    }
  }
  return {
    startIndex: bestStartIndex,
    endIndex: bestEndIndex,
    durationSec: bestCount,
    sampleCount: bestCount,
  };
}

function preoxygenationEvidence(run, trace) {
  const endpointIndexes = [run.startIndex, run.endIndex]
    .filter((index) => index !== null)
    .filter((index, position, indexes) => indexes.indexOf(index) === position);
  const endpoints = endpointIndexes.map((index) => traceCitation(
    { index, sample: trace[index] }, ['fio2', 'spontaneousRR', 'spontaneousTV'],
  ));
  return {
    endpoints,
    summary: {
      startT: run.startIndex === null ? null : trace[run.startIndex].t,
      endT: run.endIndex === null ? null : trace[run.endIndex].t,
      durationSec: run.durationSec,
      sampleCount: run.sampleCount,
    },
  };
}

function evaluatePreoxygenation({ actionEntries, trace, criteria, finalized, ruleId }) {
  const induction = firstDrug(actionEntries, criteria.acceptedInductionDrugs);
  if (!induction) return result(finalized ? 'not_performed' : 'pending', ruleId);
  const run = qualifyingPreoxygenation(trace, induction, criteria);
  const actionCitations = [actionCitation(induction, ['drug', 'doseMg'])];
  const compactEvidence = preoxygenationEvidence(run, trace);
  if (run.durationSec >= criteria.preoxygenationDurationSec) {
    return result('performed', ruleId, actionCitations, compactEvidence.endpoints, {
      preoxygenation: compactEvidence.summary,
    });
  }
  if (run.durationSec > 0) {
    return result('partial', ruleId, actionCitations, compactEvidence.endpoints, {
      preoxygenation: compactEvidence.summary,
    });
  }
  return result('not_performed', ruleId, actionCitations, compactEvidence.endpoints, {
    preoxygenation: compactEvidence.summary,
  });
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
  if (attempt) {
    if (!induction || !nmb || induction.index > attempt.index || nmb.index > attempt.index) {
      return result('not_performed', ruleId, citations);
    }
    return result(induction.index < nmb.index ? 'performed' : 'partial', ruleId, citations);
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

function failedAttemptOutcome(actionEntries, nextAttempt) {
  if (!nextAttempt) return null;
  const attemptNumber = ownValue(nextAttempt.record.meta, 'attemptNumber');
  const followingAttempt = actionEntries.find((entry) => (
    entry.index > nextAttempt.index && entry.record.action === 'intubation_attempt_started'
  ));
  return actionEntries.find((entry) => (
    entry.index > nextAttempt.index
    && entry.index < (followingAttempt?.index ?? Infinity)
    && ['intubation_attempt_failed', 'intubation_attempt_succeeded'].includes(entry.record.action)
    && (attemptNumber === undefined
      || ownValue(entry.record.meta, 'attemptNumber') === attemptNumber)
  )) ?? null;
}

function failedAttemptOxygenation(trace, failure, ppv, nextAttempt, criteria) {
  if (!ppv) {
    return {
      preRescue: null,
      nadir: null,
      postRescue: null,
      recovered: false,
      citations: [],
    };
  }
  const endTime = nextAttempt?.record.tSec ?? Infinity;
  const samples = traceEntries(trace).filter(({ sample }) => (
    Number.isSafeInteger(sample.t)
    && sample.t >= failure.record.tSec
    && sample.t <= endTime
    && typeof sample.spo2 === 'number'
    && Number.isFinite(sample.spo2)
    && sample.spo2 >= 0
    && sample.spo2 <= 100
  ));
  const preRescue = samples.filter(({ sample }) => sample.t <= ppv.record.tSec).at(-1) ?? null;
  const postRescue = samples.filter(({ sample }) => sample.t >= ppv.record.tSec).at(-1) ?? null;
  const nadir = samples.reduce((lowest, candidate) => (
    !lowest || candidate.sample.spo2 < lowest.sample.spo2 ? candidate : lowest
  ), null);
  const recovered = Boolean(preRescue && nadir && postRescue && (
    postRescue.sample.spo2 >= preRescue.sample.spo2
    || postRescue.sample.spo2 - nadir.sample.spo2
      >= criteria.failedAttemptSpo2RecoveryDelta
  ));
  const citations = [preRescue, nadir, postRescue]
    .filter(Boolean)
    .filter((entry, index, entriesToCite) => (
      entriesToCite.findIndex((candidate) => candidate.index === entry.index) === index
    ))
    .map((entry) => traceCitation(entry, ['spo2']));
  return { preRescue, nadir, postRescue, recovered, citations };
}

function analyzeFailedAttempts(actionEntries, trace, criteria) {
  const failures = actionEntries.filter(
    ({ record }) => record.action === 'intubation_attempt_failed',
  );
  return failures.map((failure) => {
    const nextAttempt = actionEntries.find((entry) => (
      entry.index > failure.index && entry.record.action === 'intubation_attempt_started'
    ));
    const endIndex = nextAttempt?.index ?? Infinity;
    const entriesInSegment = actionEntries.filter((entry) => (
      entry.index > failure.index && entry.index < endIndex
    ));
    const anyPpv = entriesInSegment.find(
      ({ record }) => record.action === 'mask_ppv_started',
    ) ?? null;
    const ppv = entriesInSegment.find((entry) => qualifyingPpv(entry, criteria)) ?? null;
    const activeCricoid = Boolean(ppv && cricoidActiveAt(actionEntries, ppv));
    const cricoid = actionEntries.filter((entry) => (
      entry.index <= (ppv?.index ?? endIndex)
      && entry.record.action === 'cricoid_pressure_applied'
    )).at(-1) ?? null;
    const cricoidRescue = entriesInSegment.some(
      ({ record }) => record.action === 'cricoid_pressure_applied',
    ) || cricoidActiveAt(actionEntries, failure);
    const actionStatus = ppv && activeCricoid
      ? 'performed'
      : (anyPpv || cricoidRescue ? 'partial' : 'not_performed');
    const nextOutcome = failedAttemptOutcome(actionEntries, nextAttempt);
    const oxygenation = failedAttemptOxygenation(
      trace, failure, ppv, nextAttempt, criteria,
    );
    return {
      failure,
      nextAttempt,
      nextOutcome,
      ppv,
      cricoid: cricoidRescue ? cricoid : null,
      actionStatus,
      oxygenation,
    };
  });
}

function aggregateSegmentStatuses(statuses) {
  if (statuses.some((status) => status === 'not_performed')) return 'not_performed';
  if (statuses.some((status) => status === 'partial')) return 'partial';
  return 'performed';
}

function uniqueCitations(citations) {
  return citations
    .filter(Boolean)
    .filter((citation, index, all) => (
      all.findIndex((candidate) => candidate.index === citation.index) === index
    ))
    .sort((left, right) => left.index - right.index);
}

function evaluateFailedAttemptPpv({ actionEntries, trace, criteria, finalized, ruleId }) {
  const segments = analyzeFailedAttempts(actionEntries, trace, criteria);
  if (segments.length === 0) {
    return result(
      finalized ? 'performed' : 'pending', ruleId, [], [],
      finalized ? { conditionTriggered: false } : {},
    );
  }
  const status = aggregateSegmentStatuses(segments.map(({ actionStatus }) => actionStatus));
  const citations = uniqueCitations(segments.flatMap((segment) => [
    actionCitation(segment.failure, ['attemptNumber']),
    segment.cricoid ? actionCitation(segment.cricoid) : null,
    segment.ppv ? actionCitation(
      segment.ppv,
      ['airwayDevice', 'minuteVentilation', 'cricoidPressure'],
      ['airwayDevice', 'mechanicalMV', 'effectiveMV', 'cricoidPressureActive'],
    ) : null,
    segment.nextAttempt ? actionCitation(segment.nextAttempt, ['attemptNumber']) : null,
  ]));
  const summaries = segments.map((segment) => ({
    failureAttemptNumber: ownValue(segment.failure.record.meta, 'attemptNumber') ?? null,
    rescueStatus: segment.actionStatus,
    qualifyingPpvIndex: segment.ppv?.index ?? null,
    cricoidActive: Boolean(segment.ppv && cricoidActiveAt(actionEntries, segment.ppv)),
    nextAttemptNumber: ownValue(segment.nextAttempt?.record.meta, 'attemptNumber') ?? null,
  }));
  return result(status, ruleId, citations, [], {
    conditionTriggered: true,
    segments: summaries,
  });
}

function evaluateAppropriateFailedAttempt({
  actionEntries, trace, criteria, finalized, ruleId,
}) {
  const segments = analyzeFailedAttempts(actionEntries, trace, criteria);
  if (segments.length === 0) {
    return result(
      finalized ? 'performed' : 'pending', ruleId, [], [],
      finalized ? { conditionTriggered: false } : {},
    );
  }
  const statuses = segments.map((segment) => {
    if (segment.actionStatus !== 'performed') return segment.actionStatus;
    const failureAttemptNumber = ownValue(segment.failure.record.meta, 'attemptNumber');
    const nextAttemptNumber = ownValue(segment.nextAttempt?.record.meta, 'attemptNumber');
    const progressed = Number.isSafeInteger(failureAttemptNumber)
      && Number.isSafeInteger(nextAttemptNumber)
      && nextAttemptNumber > failureAttemptNumber
      && Boolean(segment.nextOutcome);
    return segment.oxygenation.recovered && progressed ? 'performed' : 'partial';
  });
  const citations = uniqueCitations(segments.flatMap((segment) => [
    actionCitation(segment.failure, ['attemptNumber']),
    segment.cricoid ? actionCitation(segment.cricoid) : null,
    segment.ppv ? actionCitation(
      segment.ppv,
      ['airwayDevice', 'minuteVentilation', 'cricoidPressure'],
      ['airwayDevice', 'mechanicalMV', 'effectiveMV', 'cricoidPressureActive'],
    ) : null,
    segment.nextAttempt ? actionCitation(segment.nextAttempt, ['attemptNumber']) : null,
    segment.nextOutcome ? actionCitation(segment.nextOutcome, ['attemptNumber']) : null,
  ]));
  const traceCitations = uniqueCitations(
    segments.flatMap(({ oxygenation }) => oxygenation.citations),
  );
  const summaries = segments.map((segment, index) => ({
    failureAttemptNumber: ownValue(segment.failure.record.meta, 'attemptNumber') ?? null,
    rescueStatus: segment.actionStatus,
    preRescueSpO2: segment.oxygenation.preRescue?.sample.spo2 ?? null,
    nadirSpO2: segment.oxygenation.nadir?.sample.spo2 ?? null,
    postRescueSpO2: segment.oxygenation.postRescue?.sample.spo2 ?? null,
    oxygenationRecovered: segment.oxygenation.recovered,
    requiredRecoveryDelta: criteria.failedAttemptSpo2RecoveryDelta,
    nextAttemptNumber: ownValue(segment.nextAttempt?.record.meta, 'attemptNumber') ?? null,
    nextAttemptOutcome: segment.nextOutcome?.record.action === 'intubation_attempt_succeeded'
      ? 'succeeded'
      : (segment.nextOutcome?.record.action === 'intubation_attempt_failed' ? 'failed' : null),
    segmentStatus: statuses[index],
  }));
  return result(aggregateSegmentStatuses(statuses), ruleId, citations, traceCitations, {
    conditionTriggered: true,
    segments: summaries,
  });
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
    actionEntries: entries(input.actions),
    trace: input.trace,
    criteria: resolveCriteria(input.criteria),
    finalized: input.finalized,
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
  rsi_failed_attempt_ppv_with_cricoid: evaluateFailedAttemptPpv,
  rsi_cricoid_release_after_confirmation: evaluateCricoidRelease,
  rsi_inhaled_anesthetic_on: evaluatePostSuccess,
  rsi_vent_mode: evaluatePostSuccess,
  rsi_tidal_volume: evaluatePostSuccess,
  rsi_respiratory_rate: evaluatePostSuccess,
  rsi_fresh_gas: evaluatePostSuccess,
  rsi_fio2: evaluatePostSuccess,
  rsi_bag_to_vent: evaluatePostSuccess,
  rsi_appropriate_failed_attempt_intervention: evaluateAppropriateFailedAttempt,
  rsi_under_three_attempts: evaluateUnderThree,
};

export const RUBRIC_RULES = Object.freeze({ ...RULE_EVALUATORS });

export function evaluateRubricItem(input = {}) {
  const normalized = normalizeEvaluationInput(input);
  const ruleId = normalized.item.engineEvidence.ruleId;
  const evaluator = RUBRIC_RULES[ruleId];
  if (!evaluator) throw new RangeError(`Unknown rubric rule: ${String(ruleId)}`);
  return evaluator(context(normalized, ruleId));
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

function normalizeViolationInput(input) {
  const copied = normalizedRoot(input, 'detectRubricViolations input');
  const criteria = Object.hasOwn(copied, 'criteria') ? copied.criteria : {};
  if (!isPlainObject(criteria)) throw new TypeError('criteria must be a plain object');
  return {
    rubric: normalizeRubric(copied.rubric),
    actions: normalizeActionRecords(copied.actions ?? []),
    trace: normalizeTraceRecords(copied.trace ?? []),
    criteria,
  };
}

export function detectRubricViolations(input = {}) {
  const normalized = normalizeViolationInput(input);
  const {
    rubric, actions, trace, criteria,
  } = normalized;
  for (const item of rubric.items) {
    const ruleId = item.engineEvidence?.ruleId;
    if (ruleId && !RUBRIC_RULES[ruleId]) throw new RangeError(`Unknown rubric rule: ${ruleId}`);
  }
  const rawActions = Object.getOwnPropertyDescriptor(input, 'actions')?.value ?? [];
  const rawAction = Object.getOwnPropertyDescriptor(input, 'action')?.value;
  const triggerIndex = rawActions.indexOf(rawAction);
  if (triggerIndex < 0) {
    throw new TypeError('action must be the exact ledger member supplied in actions');
  }
  const actionEntries = entries(actions);
  const trigger = actionEntries[triggerIndex];
  if (trigger.record.action === 'instructor_rubric_score_set') return immutable([]);
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
        if (run.durationSec < resolvedCriteria.preoxygenationDurationSec) {
          const compactEvidence = preoxygenationEvidence(run, trace);
          add(preoxygenationItem, {
            actions: [],
            trace: compactEvidence.endpoints,
            preoxygenation: compactEvidence.summary,
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
