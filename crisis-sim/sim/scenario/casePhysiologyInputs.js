import { copyCaseData } from './caseContract.js';

export const CASE_INPUT_TYPES = Object.freeze([
  'set_surgical_stimulus',
  'inject_complication',
  'set_forced_apnea',
  'set_machine',
]);

const MACHINE_PATCH_RANGES = Object.freeze({
  o2FlowLPerMin: Object.freeze([0, 100]),
  airFlowLPerMin: Object.freeze([0, 100]),
  n2oFlowLPerMin: Object.freeze([0, 100]),
  setFiO2: Object.freeze([0.21, 1]),
  setTidalVolume: Object.freeze([0, 2000]),
  setRespiratoryRate: Object.freeze([0, 100]),
  setPeep: Object.freeze([0, 50]),
  vaporizerDial: Object.freeze([0, 18]),
});
const MACHINE_PATCH_KEYS = new Set([
  ...Object.keys(MACHINE_PATCH_RANGES),
  'mode',
  'vaporizerAgent',
]);
const VENTILATOR_MODES = Object.freeze({ manual: 0, vcv: 1, pcv: 2, psv: 3 });
const VOLATILE_AGENTS = new Set(['Sevoflurane', 'Desflurane', 'Isoflurane']);

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function requirePlainObject(value, label) {
  if (!isPlainObject(value)) throw new TypeError(`${label} must be a plain object`);
}

function requireExactKeys(value, keys, label) {
  const expected = new Set(keys);
  const actual = Object.keys(value);
  const unexpected = actual.find((key) => !expected.has(key));
  if (unexpected) throw new TypeError(`${label}.${unexpected} is unsupported`);
  const missing = keys.find((key) => !Object.hasOwn(value, key));
  if (missing) throw new TypeError(`${label}.${missing} is required`);
}

function requireFiniteRange(value, label, min, max) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(`${label} must be a finite number from ${min} to ${max}`);
  }
}

function requireNonemptyString(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(`${label} must be a nonempty string`);
  }
}

function freezeRecursively(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) freezeRecursively(nested, seen);
  return Object.freeze(value);
}

function validateMachinePatch(patch) {
  requirePlainObject(patch, 'case effect patch');
  for (const key of Object.keys(patch)) {
    if (!MACHINE_PATCH_KEYS.has(key)) {
      throw new TypeError(`case effect patch.${key} is an unsupported machine patch key`);
    }
    if (Object.hasOwn(MACHINE_PATCH_RANGES, key)) {
      const [min, max] = MACHINE_PATCH_RANGES[key];
      requireFiniteRange(patch[key], `case effect patch.${key}`, min, max);
      continue;
    }
    if (key === 'mode') {
      const numberMode = Number.isInteger(patch.mode) && patch.mode >= 0 && patch.mode <= 3;
      const stringMode = typeof patch.mode === 'string'
        && Object.hasOwn(VENTILATOR_MODES, patch.mode.toLowerCase());
      if (!numberMode && !stringMode) {
        throw new RangeError('case effect patch.mode must be manual, vcv, pcv, psv, or 0 through 3');
      }
      continue;
    }
    if (!VOLATILE_AGENTS.has(patch.vaporizerAgent)) {
      throw new RangeError('case effect patch.vaporizerAgent must be a supported agent');
    }
  }
}

export function validateCasePhysiologyInput(input) {
  const copied = copyCaseData(input, 'case physiology input');
  requirePlainObject(copied, 'case physiology input');
  requireNonemptyString(copied.type, 'case physiology input.type');

  switch (copied.type) {
    case 'set_surgical_stimulus':
      requireExactKeys(copied, ['type', 'intensity'], 'case physiology input');
      requireFiniteRange(copied.intensity, 'case physiology input.intensity', 0, 1);
      break;
    case 'inject_complication':
      requireExactKeys(
        copied,
        ['type', 'complicationType', 'description'],
        'case physiology input',
      );
      requireNonemptyString(
        copied.complicationType,
        'case physiology input.complicationType',
      );
      requireNonemptyString(copied.description, 'case physiology input.description');
      break;
    case 'set_forced_apnea':
      requireExactKeys(copied, ['type', 'active'], 'case physiology input');
      if (typeof copied.active !== 'boolean') {
        throw new TypeError('case physiology input.active must be a boolean');
      }
      break;
    case 'set_machine':
      requireExactKeys(copied, ['type', 'patch'], 'case physiology input');
      validateMachinePatch(copied.patch);
      break;
    default:
      throw new RangeError(`Unsupported case effect: ${copied.type}`);
  }

  return freezeRecursively(copied);
}

function requireMethod(target, method, label) {
  if (target === null || typeof target !== 'object' || typeof target[method] !== 'function') {
    throw new TypeError(`${label}.${method} must be available`);
  }
}

function applyAllowlistedMachinePatch(ventilator, patch) {
  if (ventilator === null || typeof ventilator !== 'object') {
    throw new TypeError('ventilator must be available');
  }
  if (Object.hasOwn(patch, 'mode')) requireMethod(ventilator, 'setMode', 'ventilator');

  for (const [key, value] of Object.entries(patch)) {
    if (key === 'mode') {
      ventilator.setMode(typeof value === 'string' ? VENTILATOR_MODES[value.toLowerCase()] : value);
    } else {
      ventilator[key] = value;
    }
  }
}

export function applyCasePhysiologyInput({
  input,
  patient,
  lidocaineSystem,
  ventilator,
  scenarioManager,
} = {}) {
  const validated = validateCasePhysiologyInput(input);

  switch (validated.type) {
    case 'set_surgical_stimulus':
      requireMethod(lidocaineSystem, 'setSurgicalStimulus', 'lidocaineSystem');
      lidocaineSystem.setSurgicalStimulus(validated.intensity);
      break;
    case 'inject_complication':
      requireMethod(scenarioManager, 'applyComplication', 'scenarioManager');
      scenarioManager.applyComplication({
        complicationType: validated.complicationType,
        description: validated.description,
      });
      break;
    case 'set_forced_apnea':
      requireMethod(patient, 'setForcedApnea', 'patient');
      patient.setForcedApnea(validated.active);
      break;
    case 'set_machine':
      applyAllowlistedMachinePatch(ventilator, validated.patch);
      break;
    default:
      throw new RangeError(`Unsupported case effect: ${validated.type}`);
  }

  return validated;
}
