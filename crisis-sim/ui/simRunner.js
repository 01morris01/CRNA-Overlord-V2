/* ═══════════════════════════════════════════════════════════════════
   simRunner.js — wraps the ported deterministic engine in a wall-clock
   real-time driver. Advances the sim in fixed 0.02 s steps (preserving
   C# determinism per step) paced to real time × speed, and emits a flat
   vitals snapshot each animation frame. All patient / machine / drug
   control goes through here so the console never touches engine
   internals directly.
   ═══════════════════════════════════════════════════════════════════ */
import {
  AirwayDevice, buildPhysRig, normalize, RubricScoringSession, ScenarioManager, VentMode,
} from '../sim/index.js';
import {
  buildDebrief as buildScenarioDebrief,
  buildLidocaineAttribution,
} from '../sim/scenario/scenarioDebrief.js';
import { CaseSession } from '../sim/scenario/caseSession.js';
import { applyCasePhysiologyInput } from '../sim/scenario/casePhysiologyInputs.js';

const SEED = 12345;
const MAX_ENGINE_SEED = 0x7fffffff;
const FIXED_TICKS_PER_SECOND = 50;
const DANGEROUS_INPUT_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
// Display-only convergence tolerance; it never feeds back into physiology.
export const INSTRUCTOR_NMB_TARGET_TOLERANCE = 0.02;

export const LIVE_COMPLICATIONS = Object.freeze([
  'Bronchospasm', 'HighSpinal', 'Sympathectomy', 'Anaphylaxis',
  'MalignantHyperthermia', 'OpioidRespDepression',
  'OpioidInducedRespiratoryDepression', 'Hemorrhage', 'Laryngospasm',
  'LocalAnestheticToxicity', 'TensionPneumothorax', 'VentricularFibrillation',
]);

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function copyJsonInput(value, label, ancestors = new WeakSet()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError(`${label} must contain only finite numbers`);
    return value;
  }
  if (typeof value !== 'object') throw new TypeError(`${label} must be JSON-safe`);
  if (ancestors.has(value)) throw new TypeError(`${label} must not contain cycles`);
  if (Object.getOwnPropertySymbols(value).length > 0) {
    throw new TypeError(`${label} must contain only string keys`);
  }
  const names = Object.getOwnPropertyNames(value);
  const dangerous = names.find((key) => DANGEROUS_INPUT_KEYS.has(key));
  if (dangerous) throw new TypeError(`${label} contains unsafe key ${dangerous}`);
  ancestors.add(value);
  let result;
  if (Array.isArray(value)) {
    if (Object.getPrototypeOf(value) !== Array.prototype) {
      ancestors.delete(value);
      throw new TypeError(`${label} must contain only ordinary arrays`);
    }
    const length = Object.getOwnPropertyDescriptor(value, 'length').value;
    if (names.length !== length + 1) {
      ancestors.delete(value);
      throw new TypeError(`${label} arrays must be dense`);
    }
    result = new Array(length);
    for (let index = 0; index < length; index += 1) {
      const descriptor = Object.getOwnPropertyDescriptor(value, `${index}`);
      if (!descriptor || !descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) {
        ancestors.delete(value);
        throw new TypeError(`${label} arrays must contain data properties`);
      }
      result[index] = copyJsonInput(descriptor.value, `${label}[${index}]`, ancestors);
    }
  } else {
    if (!isPlainObject(value)) {
      ancestors.delete(value);
      throw new TypeError(`${label} must contain only plain objects`);
    }
    result = {};
    for (const key of names) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) {
        ancestors.delete(value);
        throw new TypeError(`${label} must contain only enumerable data properties`);
      }
      Object.defineProperty(result, key, {
        configurable: true,
        enumerable: true,
        value: copyJsonInput(descriptor.value, `${label}.${key}`, ancestors),
        writable: true,
      });
    }
  }
  ancestors.delete(value);
  return result;
}

function alignedFixedStepCount(seconds, label) {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds <= 0) {
    throw new RangeError(`${label} must be a finite positive number`);
  }
  const rawSteps = seconds * FIXED_TICKS_PER_SECOND;
  const steps = Math.round(rawSteps);
  const tolerance = Number.EPSILON * Math.max(1, Math.abs(rawSteps)) * 8;
  if (!Number.isSafeInteger(steps) || Math.abs(rawSteps - steps) > tolerance) {
    throw new RangeError(`${label} must be fixed-step aligned to 0.02 seconds`);
  }
  return steps;
}

function requireFiniteField(object, key, label, { min = -Infinity, max = Infinity } = {}) {
  const value = object[key];
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(`${label}.${key} must be a finite number from ${min} to ${max}`);
  }
  return value;
}

function validateOptionalFiniteField(object, key, label, range) {
  if (Object.hasOwn(object, key)) requireFiniteField(object, key, label, range);
}

function drugSystemHasLearnerExposure(drugSystem) {
  if (drugSystem.activeInfusions.length > 0) return true;
  return Object.entries(drugSystem).some(([key, value]) => (
    key.startsWith('_')
      && ((typeof value === 'number' && value !== 0)
        || (typeof value === 'boolean' && value))
  ));
}

function cloneRunnerConfig(config) {
  const clone = { ...config };
  if (Array.isArray(config.failedIntubationAttempts)) {
    clone.failedIntubationAttempts = [...config.failedIntubationAttempts];
  }
  return clone;
}

function scenarioActiveConfig(scenario, patient, fallback) {
  return {
    ...fallback,
    ...scenario.patientProfile,
    baselineEtCO2: patient.baselineEtCO2,
    failedIntubationAttempts: [...scenario.airwayPlan.failedIntubationAttempts],
    intubationAttemptDurationSeconds: scenario.airwayPlan.intubationAttemptDurationSeconds,
  };
}

function captureScenarioConstructionEvidence(scenarioManager) {
  return JSON.stringify({
    eventLog: scenarioManager.eventLog,
    activePrompts: scenarioManager.activePrompts,
    feedbackMessage: scenarioManager.feedbackMessage,
    feedbackTimer: scenarioManager.feedbackTimer,
    currentScore: scenarioManager.currentScore,
    maxPossibleScore: scenarioManager.maxPossibleScore,
    elapsedTime: scenarioManager.elapsedTime,
    firedEvents: scenarioManager._firedEvents,
    completedChecks: scenarioManager._completedChecks,
    studentActions: scenarioManager._studentActions,
    transitions: scenarioManager._transitions,
    deadlines: scenarioManager._deadlines,
    airwayEventCursor: scenarioManager._airwayEventCursor,
    actionLog: scenarioManager.actionLog.entries,
    run: scenarioManager.run,
    lastResult: scenarioManager.lastResult,
  }, (_key, value) => {
    if (value instanceof Map) return { mapEntries: [...value.entries()] };
    if (value instanceof Set) return { setValues: [...value.values()] };
    return value;
  });
}

function prepareScenarioInputs({
  scenario,
  rubric,
  requireRubric = false,
  requireCase = false,
} = {}) {
  const scenarioCopy = copyJsonInput(scenario, 'scenario');
  const rubricCopy = requireRubric || rubric !== null && rubric !== undefined
    ? copyJsonInput(rubric, 'rubric')
    : null;
  if (!isPlainObject(scenarioCopy)) throw new TypeError('scenario must be a plain object');
  if (rubricCopy !== null && !isPlainObject(rubricCopy)) {
    throw new TypeError('rubric must be a plain object');
  }

  // Explicit loaders are stricter than legacy normalize defaults: every
  // teaching run must declare the reproducibility and physiology contract.
  if (!Number.isSafeInteger(scenarioCopy.seed)
    || scenarioCopy.seed < 0 || scenarioCopy.seed > MAX_ENGINE_SEED) {
    throw new RangeError('scenario.seed must be an explicitly declared nonnegative signed engine seed');
  }
  if (rubricCopy !== null
    && (typeof scenarioCopy.rubricId !== 'string' || scenarioCopy.rubricId.length === 0)) {
    throw new TypeError('scenario.rubricId must be an explicitly declared nonempty string');
  }
  if (rubricCopy !== null && !isPlainObject(scenarioCopy.rubricCriteria)) {
    throw new TypeError('scenario.rubricCriteria must be an explicitly declared plain object');
  }
  if (!isPlainObject(scenarioCopy.patientProfile)
    || !isPlainObject(scenarioCopy.startingSetup)
    || !Array.isArray(scenarioCopy.events)
    || !isPlainObject(scenarioCopy.airwayPlan)
    || !isPlainObject(scenarioCopy.debrief)) {
    throw new TypeError('scenario must define patientProfile, startingSetup, events, airwayPlan, and debrief');
  }
  const profile = scenarioCopy.patientProfile;
  requireFiniteField(profile, 'weightKg', 'scenario.patientProfile', { min: 0.1, max: 500 });
  requireFiniteField(profile, 'heightCm', 'scenario.patientProfile', { min: 30, max: 300 });
  requireFiniteField(profile, 'ageYears', 'scenario.patientProfile', { min: 0.01, max: 130 });
  if (profile.sex !== 'Male' && profile.sex !== 'Female') {
    throw new RangeError('scenario.patientProfile.sex must be Male or Female');
  }
  requireFiniteField(profile, 'baselineHR', 'scenario.patientProfile', { min: 1, max: 300 });
  requireFiniteField(profile, 'baselineSystolic', 'scenario.patientProfile', { min: 20, max: 300 });
  requireFiniteField(profile, 'baselineDiastolic', 'scenario.patientProfile', { min: 10, max: 250 });
  if (profile.baselineDiastolic >= profile.baselineSystolic) {
    throw new RangeError('scenario.patientProfile baseline diastolic must be below systolic');
  }
  requireFiniteField(profile, 'baselineSpO2', 'scenario.patientProfile', { min: 1, max: 100 });
  requireFiniteField(profile, 'baselineRR', 'scenario.patientProfile', { min: 1, max: 100 });
  requireFiniteField(profile, 'baselineTemp', 'scenario.patientProfile', { min: 20, max: 45 });
  validateOptionalFiniteField(
    profile, 'baselineEtCO2', 'scenario.patientProfile', { min: 1, max: 150 },
  );
  const setup = scenarioCopy.startingSetup;
  if (typeof setup.oxygenOn !== 'boolean'
    || typeof setup.fio2 !== 'number' || !Number.isFinite(setup.fio2)
    || setup.fio2 < 0.21 || setup.fio2 > 1
    || !['manual', 'vcv', 'pcv', 'psv'].includes(String(setup.ventMode).toLowerCase())
    || !['mask', 'ett'].includes(String(setup.airway).toLowerCase())) {
    throw new RangeError('scenario.startingSetup must declare valid oxygen, FiO2, mode, and airway');
  }
  validateOptionalFiniteField(
    setup, 'o2FlowLPerMin', 'scenario.startingSetup', { min: 0, max: 100 },
  );
  validateOptionalFiniteField(
    setup, 'airFlowLPerMin', 'scenario.startingSetup', { min: 0, max: 100 },
  );
  validateOptionalFiniteField(
    setup, 'n2oFlowLPerMin', 'scenario.startingSetup', { min: 0, max: 100 },
  );
  validateOptionalFiniteField(
    setup, 'tidalVolume', 'scenario.startingSetup', { min: 0, max: 2000 },
  );
  validateOptionalFiniteField(
    setup, 'respiratoryRate', 'scenario.startingSetup', { min: 0, max: 100 },
  );
  validateOptionalFiniteField(
    setup, 'peep', 'scenario.startingSetup', { min: 0, max: 50 },
  );
  requireFiniteField(setup, 'vaporizerDial', 'scenario.startingSetup', { min: 0, max: 18 });
  if (Object.hasOwn(setup, 'vaporizerAgent')
    && !['Sevoflurane', 'Desflurane', 'Isoflurane'].includes(setup.vaporizerAgent)) {
    throw new RangeError('scenario.startingSetup.vaporizerAgent is unsupported');
  }
  const plan = scenarioCopy.airwayPlan;
  if (!Array.isArray(plan.failedIntubationAttempts)
    || plan.failedIntubationAttempts.some((attempt) => (
      !Number.isSafeInteger(attempt) || attempt <= 0
    ))
    || new Set(plan.failedIntubationAttempts).size !== plan.failedIntubationAttempts.length) {
    throw new TypeError('scenario.airwayPlan.failedIntubationAttempts must be unique positive integers');
  }
  alignedFixedStepCount(
    plan.intubationAttemptDurationSeconds,
    'scenario.airwayPlan.intubationAttemptDurationSeconds',
  );
  if (plan.intubationAttemptDurationSeconds > 600) {
    throw new RangeError('scenario airway attempt duration must not exceed 600 seconds');
  }

  const scenarioForReset = copyJsonInput(scenarioCopy, 'scenario reset definition');
  const rubricForReset = rubricCopy === null
    ? null
    : copyJsonInput(rubricCopy, 'rubric reset definition');
  const definition = normalize(scenarioCopy);
  if (typeof definition.id !== 'string' || definition.id.trim().length === 0) {
    throw new TypeError('scenario.id must be a nonempty string');
  }
  if (typeof definition.title !== 'string' || definition.title.trim().length === 0) {
    throw new TypeError('scenario.title must be a nonempty string');
  }
  if (!Number.isSafeInteger(definition.seed)
    || definition.seed < 0 || definition.seed > MAX_ENGINE_SEED) {
    throw new RangeError('scenario.seed must be a nonnegative signed engine seed');
  }
  if (rubricCopy !== null
    && (typeof definition.rubricId !== 'string' || definition.rubricId.length === 0)) {
    throw new TypeError('scenario.rubricId must be a nonempty string');
  }
  if (rubricCopy !== null
    && (typeof rubricCopy.id !== 'string' || definition.rubricId !== rubricCopy.id)) {
    throw new RangeError('scenario.rubricId and rubric.id mismatch');
  }
  if (!isPlainObject(definition.patientProfile)
    || !isPlainObject(definition.startingSetup)
    || !Array.isArray(definition.events)
    || !isPlainObject(definition.airwayPlan)
    || !isPlainObject(definition.debrief)) {
    throw new TypeError('scenario must define patientProfile, startingSetup, events, airwayPlan, and debrief');
  }
  if (rubricCopy !== null && !isPlainObject(definition.rubricCriteria)) {
    throw new TypeError('scenario.rubricCriteria must be a plain object');
  }
  if (requireCase && definition.caseExperience === null) {
    throw new TypeError('scenario must define a complete case experience');
  }

  let administrativeSetup = null;
  if (definition.administrativeSetup !== null) {
    if (!isPlainObject(definition.administrativeSetup)) {
      throw new TypeError('scenario.administrativeSetup must be a plain object or null');
    }
    const allowedKeys = new Set(['instructorNmbTarget', 'preconditioningDurationSeconds']);
    if (Object.keys(definition.administrativeSetup).some((key) => !allowedKeys.has(key))) {
      throw new TypeError('scenario.administrativeSetup contains unsupported fields');
    }
    const { instructorNmbTarget, preconditioningDurationSeconds } = definition.administrativeSetup;
    if (!isPlainObject(instructorNmbTarget)
      || Object.keys(instructorNmbTarget).length !== 1
      || !Object.hasOwn(instructorNmbTarget, 'targetTofRatio')) {
      throw new TypeError('administrativeSetup.instructorNmbTarget must declare targetTofRatio');
    }
    const { targetTofRatio } = instructorNmbTarget;
    if (typeof targetTofRatio !== 'number' || !Number.isFinite(targetTofRatio)
      || targetTofRatio < 0 || targetTofRatio > 1) {
      throw new RangeError('administrativeSetup targetTofRatio must be from 0 to 1');
    }
    administrativeSetup = {
      instructorNmbTarget: { targetTofRatio },
      preconditioningDurationSeconds,
      preconditioningSteps: alignedFixedStepCount(
        preconditioningDurationSeconds,
        'administrativeSetup.preconditioningDurationSeconds',
      ),
    };
  }

  // Construction validates the optional literal rubric, all named criteria,
  // and seed before the active runner is stopped or any state is replaced.
  const validatedRubric = rubricCopy === null
    ? null
    : new RubricScoringSession({
      rubric: rubricCopy,
      criteria: definition.rubricCriteria,
      seed: definition.seed,
    }).rubric;
  return {
    scenario: definition,
    rubric: validatedRubric,
    administrativeSetup,
    resetInputs: rubricForReset === null
      ? { scenario: scenarioForReset }
      : { scenario: scenarioForReset, rubric: rubricForReset },
  };
}

function prepareRubricScenarioInputs(options) {
  return prepareScenarioInputs({ ...options, requireRubric: true });
}

function prepareCaseScenarioInputs({ scenario, rubric = null } = {}) {
  return prepareScenarioInputs({ scenario, rubric, requireCase: true });
}

function liveScenarioDefinition(config) {
  return {
    id: 'live_sim',
    title: 'Live Anesthesia Simulation',
    courseUnit: 'Live Simulation',
    maxDurationSeconds: 86400,
    tags: ['Live simulation', 'Anesthesia'],
    learningObjectives: [],
    expectedActions: [],
    dangerousActions: [],
    events: [],
    patientProfile: {
      weightKg: config.weightKg,
      heightCm: config.heightCm,
      ageYears: config.ageYears,
      sex: config.sex,
      baselineHR: config.baselineHR,
      baselineSystolic: config.baselineSystolic,
      baselineDiastolic: config.baselineDiastolic,
      baselineSpO2: config.baselineSpO2,
      baselineRR: config.baselineRR,
      baselineTemp: config.baselineTemp,
    },
    startingSetup: {
      oxygenOn: false,
      fio2: 0.21,
      tidalVolume: 0,
      respiratoryRate: 0,
      peep: 0,
      vaporizerDial: 0,
      ventMode: 'manual',
      airway: 'mask',
    },
    airwayPlan: {
      failedIntubationAttempts: [...config.failedIntubationAttempts],
      intubationAttemptDurationSeconds: config.intubationAttemptDurationSeconds,
    },
    debrief: {
      summary: 'Instructor-led live anesthesia simulation.',
      teachingPoints: [],
      reviewTopics: [],
      reviewTags: ['Live simulation', 'Anesthesia'],
    },
  };
}

export const DEFAULT_CONFIG = {
  weightKg: 70, heightCm: 170, ageYears: 45, sex: 'Male',
  baselineHR: 72, baselineSystolic: 120, baselineDiastolic: 80,
  baselineSpO2: 99, baselineRR: 14, baselineTemp: 36.6, baselineEtCO2: 38,
  failedIntubationAttempts: [], intubationAttemptDurationSeconds: 30,
};

export class SimRunner {
  #savedLiveConfig;

  #administrativePreconditioningCapability;

  constructor() {
    this.#savedLiveConfig = cloneRunnerConfig(DEFAULT_CONFIG);
    this.#administrativePreconditioningCapability = Object.freeze({});
    this.config = cloneRunnerConfig(this.#savedLiveConfig);
    this.running = false;
    this.speed = 1;
    this.simTime = 0;
    this.onTick = null;   // (snapshot) => void, every frame
    this.onEvent = null;  // (entry) => void, on logged action
    this.log = [];
    this._accum = 0;
    this._lastReal = 0;
    this._raf = 0;
    this._interval = 0;
    this._procedureUnsubscribe = null;
    this.rubricSession = null;
    this.caseSession = null;
    this.activeSeed = SEED;
    this._activeRubricScenario = null;
    this._loadedRubricScenario = null;
    this._activeCaseScenario = null;
    this._activeCaseDefinition = null;
    this._loadedCaseScenario = null;
    this._caseClockTick = 0;
    this._caseLiveEpochSec = null;
    this._appliedCaseActivationSequences = new Set();
    this._rafLoop = this._rafLoop.bind(this);
    this._tick = this._tick.bind(this);
    this.build();
  }

  build({ seed = SEED, scenarioDefinition = null } = {}) {
    const c = this.config;
    if (this._procedureUnsubscribe) this._procedureUnsubscribe();
    const profile = scenarioDefinition?.patientProfile ?? c;
    const { p, d, l, v, a, core } = buildPhysRig(
      seed,
      profile.weightKg,
      profile.heightCm,
      profile.ageYears,
    );
    p.sex = profile.sex ?? c.sex;
    p.baselineHR = profile.baselineHR ?? c.baselineHR;
    p.baselineSystolic = profile.baselineSystolic ?? c.baselineSystolic;
    p.baselineDiastolic = profile.baselineDiastolic ?? c.baselineDiastolic;
    p.baselineSpO2 = profile.baselineSpO2 ?? c.baselineSpO2;
    p.baselineRR = profile.baselineRR ?? c.baselineRR;
    p.baselineTemp = profile.baselineTemp ?? c.baselineTemp;
    p.baselineEtCO2 = profile.baselineEtCO2 ?? c.baselineEtCO2;
    p.resetToBaseline();
    const scenario = new ScenarioManager(this.#administrativePreconditioningCapability);
    scenario.patient = p;
    scenario.drugSystem = d;
    scenario.lidocaineSystem = l;
    scenario.ventilator = v;
    scenario.airwayProcedure = a;
    core.scenario = scenario;
    this._procedureUnsubscribe = a.addEventListener((event) => this.logProcedureEvent(event));
    core.initialize(seed);
    scenario.seed = seed;
    scenario.loadRaw(scenarioDefinition ?? liveScenarioDefinition(c));
    scenario.startScenario();
    this.p = p; this.d = d; this.l = l; this.v = v; this.a = a; this.s = scenario; this.core = core;
    this.simTime = 0; this._accum = 0;
    this.tofCheckHistory = [];
    this._instructorNmbTarget = null;
    this.rubricSession = null;
    this.caseSession = null;
    this.activeSeed = seed;
    this._activeRubricScenario = null;
    this._activeCaseScenario = null;
    this._activeCaseDefinition = null;
    this._caseClockTick = 0;
    this._caseLiveEpochSec = null;
    this._appliedCaseActivationSequences = new Set();
  }

  applyConfig(patch) {
    const wasRunning = this.running;
    this._stopRealtime();
    this._loadedRubricScenario = null;
    this._loadedCaseScenario = null;
    this.#savedLiveConfig = cloneRunnerConfig({ ...this.#savedLiveConfig, ...patch });
    this.config = cloneRunnerConfig(this.#savedLiveConfig);
    this.build();
    this.logEvent('Patient reset', `${this.config.weightKg} kg · ${this.config.ageYears} y · ${this.config.sex}`);
    if (wasRunning) this.start();
    else this.emit();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this._lastReal = typeof globalThis.performance?.now === 'function'
      ? globalThis.performance.now()
      : Date.now();
    // rAF paces smoothly while the tab is visible; the interval keeps the
    // sim advancing on wall-clock time even when this tab is backgrounded
    // (e.g. operator clicks over to the second-screen monitor window).
    // Both call _tick and share _lastReal, so elapsed time is never counted twice.
    if (typeof globalThis.requestAnimationFrame === 'function') {
      this._raf = globalThis.requestAnimationFrame(this._rafLoop);
      this._interval = globalThis.setInterval(() => this._tick(globalThis.performance.now()), 100);
    }
    this.emit();
  }

  pause() {
    this._stopRealtime();
    this.emit();
  }

  _stopRealtime() {
    this.running = false;
    if (typeof globalThis.cancelAnimationFrame === 'function') {
      globalThis.cancelAnimationFrame(this._raf);
    }
    this._raf = 0;
    clearInterval(this._interval);
    this._interval = 0;
  }

  reset() {
    if (this._loadedCaseScenario !== null) {
      const saved = copyJsonInput(this._loadedCaseScenario, 'loaded case scenario');
      this.loadCaseScenario(saved);
      return this.snapshot();
    }
    if (this._loadedRubricScenario !== null) {
      const saved = copyJsonInput(this._loadedRubricScenario, 'loaded rubric scenario');
      this.loadRubricScenario(saved);
      return this.snapshot();
    }
    this._stopRealtime();
    this.build();
    this.log = [];
    this.emit();
    return this.snapshot();
  }

  loadRubricScenario(options) {
    // Validation and complete candidate construction happen off-side. The
    // active runner is not stopped or touched unless the candidate already
    // owns a valid initial rubric trace and coherent learner t=0 state.
    const prepared = prepareRubricScenarioInputs(options);
    const candidate = this._createRubricScenarioCandidate(prepared);
    const result = candidate._rubricScenarioLoadResult;
    this._adoptRubricScenarioCandidate(candidate);
    this.emit();
    return copyJsonInput(result, 'rubric scenario load result');
  }

  loadCaseScenario({ scenario, rubric = null } = {}) {
    const prepared = prepareCaseScenarioInputs({ scenario, rubric });
    const candidate = this._createCaseScenarioCandidate(prepared);
    const result = candidate._caseScenarioLoadResult;
    this._adoptRubricScenarioCandidate(candidate);
    this.emit();
    return copyJsonInput(result, 'case scenario load result');
  }

  _createRubricScenarioCandidate(prepared) {
    const candidate = new SimRunner();
    candidate.#constructScenarioCandidate(prepared, { withCase: false });
    return candidate;
  }

  _createCaseScenarioCandidate(prepared) {
    const candidate = new SimRunner();
    candidate.#constructScenarioCandidate(prepared, { withCase: true });
    return candidate;
  }

  #assertScenarioConstructionEvidence(expectedEvidence) {
    if (captureScenarioConstructionEvidence(this.s) !== expectedEvidence) {
      throw new Error('Loader scenario construction evidence baseline changed');
    }
  }

  #assertLoaderPreconditioningPristine(expectedScenarioEvidence) {
    this.#assertScenarioConstructionEvidence(expectedScenarioEvidence);
    const pristine = this.core.tickCount === 0
      && this.core.simTime === 0
      && this.simTime === 0
      && this._accum === 0
      && this.log.length === 0
      && this.tofCheckHistory.length === 0
      && this.rubricSession === null
      && this.a.timeSec === 0
      && this.a.eventCount === 0
      && this.a.intubationAttemptCount === 0
      && this.a.ppvEpisodeCount === 0
      && this.a.cricoidPressureHistory.length === 0
      && this.l.timeSec === 0
      && this.l.tickCount === 0
      && this.l.doseHistory.length === 0
      && this.l.regionalHistory.length === 0
      && this.l.toxicityHistory.length === 0
      && this.l.lipidRescueHistory.length === 0
      && this.l.irritabilityHistory.length === 0
      && this.s.actionLog.entries.length === 0
      && this.s._studentActions.size === 0
      && (this.s.run?.firedTriggers.size ?? 0) === 0
      && !drugSystemHasLearnerExposure(this.d);
    if (!pristine) {
      throw new Error('Loader administrative preconditioning requires a pristine full rig');
    }
  }

  #constructScenarioCandidate(prepared, { withCase }) {
    const {
      scenario, rubric, administrativeSetup, resetInputs,
    } = prepared;
    this.build({ seed: scenario.seed, scenarioDefinition: scenario });
    const scenarioConstructionEvidence = captureScenarioConstructionEvidence(this.s);
    this.config = scenarioActiveConfig(scenario, this.p, this.config);

    const setup = scenario.startingSetup;
    this.setMachine({
      o2FlowLPerMin: setup.oxygenOn ? Math.max(2, setup.o2FlowLPerMin ?? 2) : 0,
      airFlowLPerMin: setup.airFlowLPerMin ?? 0,
      n2oFlowLPerMin: setup.n2oFlowLPerMin ?? 0,
      setFiO2: setup.fio2,
      setTidalVolume: setup.tidalVolume || this.v.setTidalVolume,
      setRespiratoryRate: setup.respiratoryRate || this.v.setRespiratoryRate,
      setPeep: setup.peep ?? this.v.setPeep,
    });
    if (Object.hasOwn(setup, 'vaporizerAgent')) {
      this.v.vaporizerAgent = setup.vaporizerAgent;
    }

    if (administrativeSetup !== null) {
      // Only a pristine loader-owned transition can authorize this paused
      // administrative interval; no learner event can be replayed afterward.
      this.#assertLoaderPreconditioningPristine(scenarioConstructionEvidence);
      this.s.beginAdministrativePreconditioning(
        this.#administrativePreconditioningCapability,
      );
      this.setInstructorNmbTarget(administrativeSetup.instructorNmbTarget);
      this.stepFor(administrativeSetup.preconditioningDurationSeconds);
      if (this.core.tickCount !== administrativeSetup.preconditioningSteps) {
        throw new Error('Administrative preconditioning fixed-step count mismatch');
      }

      // Preserve constructed physiology, but reseed learner randomness and
      // rebase every independent learner/action clock and breath phase.
      this.core.initialize(scenario.seed);
      this.l.rebaseLearnerTime();
      this.v.rebaseLearnerTime();
      this.a.reset();
      this.s.applyAirwayPlan();
      this.#assertScenarioConstructionEvidence(scenarioConstructionEvidence);
      this.s.rebaseLearnerRun(this.#administrativePreconditioningCapability);
      this.simTime = 0;
      this._accum = 0;
      this._lastReal = 0;
    }

    this.log = [];
    this.tofCheckHistory = [];
    if (rubric !== null) {
      this._activeRubricScenario = {
        id: scenario.id,
        title: scenario.title,
        rubricId: scenario.rubricId,
        seed: scenario.seed,
      };
      this.attachRubricSession({ rubric, criteria: scenario.rubricCriteria });
    }
    const loadResult = {
      ok: true,
      scenarioId: scenario.id,
      rubricId: rubric === null ? null : scenario.rubricId,
      seed: scenario.seed,
      initialSnapshot: this.compactRubricSnapshot(0),
    };
    if (withCase) {
      this.caseSession = new CaseSession({
        definition: scenario.caseExperience,
        seed: scenario.seed,
      });
      this._activeCaseScenario = {
        id: scenario.id,
        title: scenario.title,
        seed: scenario.seed,
      };
      this._activeCaseDefinition = scenario.caseExperience;
      this._loadedCaseScenario = resetInputs;
      this._caseScenarioLoadResult = loadResult;
      this.applyCaseActivations(this.caseSession.drainFlowActivations());
    } else {
      this._loadedRubricScenario = resetInputs;
      this._rubricScenarioLoadResult = loadResult;
    }
  }

  _adoptRubricScenarioCandidate(candidate) {
    this._stopRealtime();
    if (this._procedureUnsubscribe) this._procedureUnsubscribe();
    if (candidate._procedureUnsubscribe) candidate._procedureUnsubscribe();
    candidate._procedureUnsubscribe = null;

    for (const key of ['p', 'd', 'l', 'v', 'a', 's', 'core']) this[key] = candidate[key];
    this.simTime = candidate.simTime;
    this._accum = candidate._accum;
    this._lastReal = candidate._lastReal;
    this.log = candidate.log;
    this.tofCheckHistory = candidate.tofCheckHistory;
    this._instructorNmbTarget = candidate._instructorNmbTarget;
    this.rubricSession = candidate.rubricSession;
    this.caseSession = candidate.caseSession;
    this.activeSeed = candidate.activeSeed;
    this._activeRubricScenario = candidate._activeRubricScenario;
    this._loadedRubricScenario = candidate._loadedRubricScenario;
    this._activeCaseScenario = candidate._activeCaseScenario;
    this._activeCaseDefinition = candidate._activeCaseDefinition;
    this._loadedCaseScenario = candidate._loadedCaseScenario;
    this._caseClockTick = candidate._caseClockTick;
    this._caseLiveEpochSec = candidate._caseLiveEpochSec;
    this._appliedCaseActivationSequences = new Set(candidate._appliedCaseActivationSequences);
    this.config = cloneRunnerConfig(candidate.config);
    this._procedureUnsubscribe = this.a.addEventListener(
      (event) => this.logProcedureEvent(event),
    );
  }

  _nextCaseTimestamp({ live = false, engineTimeSec = null } = {}) {
    if (live) {
      if (this._caseLiveEpochSec === null) {
        throw new Error('Case live epoch is not initialized');
      }
      const rawTime = engineTimeSec === null
        ? this.core.tickCount / FIXED_TICKS_PER_SECOND
        : engineTimeSec;
      if (typeof rawTime !== 'number' || !Number.isFinite(rawTime) || rawTime < 0) {
        throw new TypeError('engineTimeSec must be a finite nonnegative number');
      }
      const engineTick = Math.round(rawTime * FIXED_TICKS_PER_SECOND);
      if (!Number.isSafeInteger(engineTick)) {
        throw new RangeError('engineTimeSec exceeds the safe fixed-step range');
      }
      return (Math.round(this._caseLiveEpochSec * FIXED_TICKS_PER_SECOND) + engineTick)
        / FIXED_TICKS_PER_SECOND;
    }
    this._caseClockTick += 1;
    if (!Number.isSafeInteger(this._caseClockTick)) {
      throw new RangeError('case ordering clock exceeds the safe fixed-step range');
    }
    return this._caseClockTick / FIXED_TICKS_PER_SECOND;
  }

  _copyCaseMutationResult(result, label = 'case mutation result') {
    const copied = copyJsonInput(result, label);
    if (isPlainObject(copied) && Object.hasOwn(copied, 'activations')) {
      delete copied.activations;
    }
    return copied;
  }

  _caseUnavailableResult() {
    return { ok: false, reason: 'NO_CASE_SESSION' };
  }

  _runCaseMutation(invoke, { enterLiveOnSuccess = false } = {}) {
    if (this.caseSession === null) return this._caseUnavailableResult();
    const usingLiveClock = this._caseLiveEpochSec !== null;
    const priorCaseClockTick = this._caseClockTick;
    const tSec = this._nextCaseTimestamp({ live: usingLiveClock });
    let result;
    try {
      result = invoke(tSec);
    } catch (error) {
      this._caseClockTick = priorCaseClockTick;
      throw error;
    }
    if (result?.ok !== true) {
      this._caseClockTick = priorCaseClockTick;
      return this._copyCaseMutationResult(result);
    }
    if (enterLiveOnSuccess && result.stage === 'live_simulation'
      && this._caseLiveEpochSec === null) {
      this._caseLiveEpochSec = tSec;
    }
    this.applyCaseActivations(result.activations ?? []);
    this.emit();
    return this._copyCaseMutationResult(result);
  }

  getLearnerCaseContext() {
    return this.caseSession?.getLearnerContext() ?? null;
  }

  getInstructorCaseContext() {
    return this.caseSession?.getInstructorContext() ?? null;
  }

  performAssessmentAction({ actionId } = {}) {
    return this._runCaseMutation(
      (tSec) => this.caseSession.recordAssessmentAction({ actionId, tSec }),
    );
  }

  advanceCaseStage({ stage } = {}) {
    return this._runCaseMutation(
      (tSec) => this.caseSession.advanceStage({ stage, tSec }),
    );
  }

  submitCaseFindings({ findingIds, notes = '' } = {}) {
    return this._runCaseMutation(
      (tSec) => this.caseSession.submitFindings({ findingIds, notes, tSec }),
    );
  }

  submitCasePlan({ selections, rationale = '' } = {}) {
    return this._runCaseMutation(
      (tSec) => this.caseSession.submitPlan({ selections, rationale, tSec }),
      { enterLiveOnSuccess: true },
    );
  }

  setInstructorCaseObservation({ considerationId, status, note = '' } = {}) {
    return this._runCaseMutation(
      (tSec) => this.caseSession.setInstructorObservation({
        considerationId, status, note, tSec,
      }),
    );
  }

  setCaseFeedbackReveal({ considerationId, reveal } = {}) {
    return this._runCaseMutation(
      (tSec) => this.caseSession.setFeedbackReveal({ considerationId, reveal, tSec }),
    );
  }

  advanceCasePhase() {
    return this._runCaseMutation((tSec) => this.caseSession.advancePhase({ tSec }));
  }

  activateCaseBranch({ branchId } = {}) {
    return this._runCaseMutation(
      (tSec) => this.caseSession.activateBranch({ branchId, tSec }),
    );
  }

  pauseCase() {
    return this._runCaseMutation(
      (tSec) => this.caseSession.setPaused({ paused: true, tSec }),
    );
  }

  resumeCase() {
    return this._runCaseMutation(
      (tSec) => this.caseSession.setPaused({ paused: false, tSec }),
    );
  }

  finalizeCaseDebrief() {
    return this._runCaseMutation((tSec) => this.caseSession.finalize({ tSec }));
  }

  beginCaseDebriefRevision() {
    return this._runCaseMutation((tSec) => this.caseSession.beginRevision({ tSec }));
  }

  applyCaseActivations(activations = []) {
    if (this.caseSession === null) return [];
    if (!Array.isArray(activations)) throw new TypeError('case activations must be an array');
    const applied = [];
    for (const activation of activations) {
      if (!Number.isSafeInteger(activation?.sequence) || activation.sequence <= 0) {
        throw new TypeError('case activation sequence must be a positive safe integer');
      }
      if (this._appliedCaseActivationSequences.has(activation.sequence)) continue;
      let appliedEffect = null;
      if (activation.effect !== null) {
        appliedEffect = applyCasePhysiologyInput({
          input: activation.effect,
          patient: this.p,
          lidocaineSystem: this.l,
          ventilator: this.v,
          scenarioManager: this.s,
        });
      }
      this._appliedCaseActivationSequences.add(activation.sequence);
      const entry = {
        t: activation.tSec,
        kind: 'Case event',
        detail: activation.eventId,
        meta: {
          source: 'scenario',
          eventId: activation.eventId,
          phaseId: activation.phaseId,
          activationSequence: activation.sequence,
          effect: appliedEffect,
        },
      };
      this.log.push(entry);
      if (this.onEvent) this.onEvent(entry);
      applied.push(copyJsonInput(entry, 'applied case activation'));
    }
    return applied;
  }

  processCaseFlowAfterStep() {
    if (this.caseSession === null || this._caseLiveEpochSec === null) return null;
    const tSec = this._nextCaseTimestamp({ live: true });
    const result = this.caseSession.processFlowStep({
      snapshot: this.compactRubricSnapshot(tSec),
      tSec,
    });
    if (result.ok === true) this.applyCaseActivations(result.activations ?? []);
    return result;
  }

  setSpeed(mult) { this.speed = mult; }

  getLifecycleState() {
    if (this.running) return 'RUNNING';
    return this.simTime > 0 ? 'PAUSED' : 'READY';
  }

  _rafLoop(now) {
    if (!this.running) return;
    this._tick(now);
    this._raf = globalThis.requestAnimationFrame(this._rafLoop);
  }

  _tick(now) {
    if (!this.running) return;
    let dtReal = (now - this._lastReal) / 1000;
    if (dtReal <= 0) return; // another path already consumed this slice
    this._lastReal = now;
    if (dtReal > 0.5) dtReal = 0.5; // don't fast-forward after a long background gap
    this._accum += dtReal * this.speed;
    const step = this.core.fixedStep;
    let guard = 0;
    while (this._accum >= step && guard < 8000) {
      this._stepOnce(step);
      this._accum -= step;
      guard++;
    }
    this.simTime = this.core.simTime;
    this.emit();
  }

  emit() { if (this.onTick) this.onTick(this.snapshot()); }

  _stepOnce(step) {
    this.core.stepOnce(step);
    this.processCaseFlowAfterStep();
    this.sampleRubricTraceAfterStep();
  }

  stepFor(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
      throw new RangeError('seconds must be a finite nonnegative number');
    }
    if (this.running) {
      throw new Error('Cannot stepFor while the realtime runner is active; pause it first');
    }
    const step = this.core.fixedStep;
    const ticksPerSecond = Math.round(1 / step);
    const rawSteps = seconds * ticksPerSecond;
    const steps = Math.round(rawSteps);
    const alignmentTolerance = Number.EPSILON * Math.max(1, Math.abs(rawSteps)) * 8;
    if (!Number.isSafeInteger(steps) || Math.abs(rawSteps - steps) > alignmentTolerance) {
      throw new RangeError(`seconds must be fixed-step aligned (${ticksPerSecond} ticks/second)`);
    }
    for (let index = 0; index < steps; index += 1) {
      this._stepOnce(step);
    }
    this.simTime = this.core.simTime;
    this.emit();
    return this.snapshot();
  }

  activeAnestheticInfusions() {
    return this.d.activeInfusions
      .filter(({ drugName, ratePerHour }) => (
        drugName === 'Propofol' && Number.isFinite(ratePerHour)
      ))
      .map(({ drugName, ratePerHour }) => ({ drug: drugName, rate: ratePerHour }));
  }

  attachRubricSession({ rubric, criteria } = {}) {
    if (this.core.tickCount !== 0) {
      throw new Error('Rubric session must be attached before simulation advance');
    }
    const session = new RubricScoringSession({ rubric, criteria, seed: this.activeSeed });
    session.recordTrace(this.compactRubricSnapshot(0));
    this.rubricSession = session;
    return session;
  }

  _copyRubricFinalizationResult(result) {
    const copied = copyJsonInput(result, 'finalized rubric result');
    return {
      ...copied,
      denominatorWarnings: copyJsonInput(
        this.rubricSession.rubric.discrepancies,
        'rubric denominator warnings',
      ),
    };
  }

  _currentRubricTime() {
    const live = this.rubricSession.getLiveResult();
    return Math.max(
      this.core.tickCount / FIXED_TICKS_PER_SECOND,
      this.a?.timeSec ?? 0,
      live.actionLedger.at(-1)?.tSec ?? 0,
      live.trace.at(-1)?.t ?? 0,
    );
  }

  getRubricStatus() {
    return this.rubricSession?.getLiveResult() ?? null;
  }

  isRubricFinalized() {
    return this.rubricSession?.isFinalized() ?? false;
  }

  getRubricDiscrepancies() {
    if (!this.rubricSession) return [];
    return copyJsonInput(this.rubricSession.rubric.discrepancies, 'rubric discrepancies');
  }

  getRubricPrintMetadata() {
    if (!this.rubricSession) return null;
    const rubric = this.rubricSession.rubric;
    return copyJsonInput({
      id: rubric.id,
      title: rubric.title,
      course: rubric.course,
      sourceFile: rubric.sourceFile,
      sourceHeaderDenominator: rubric.sourceHeaderDenominator,
      sourceFootnoteScoredItems: rubric.sourceFootnoteScoredItems,
      computedMaxPoints: rubric.computedMaxPoints,
      passRule: rubric.passRule,
      pointScale: rubric.pointScale,
      discrepancies: rubric.discrepancies,
    }, 'rubric print metadata');
  }

  setInstructorScore({ itemId, points, note = '' } = {}) {
    if (!this.rubricSession) {
      throw new Error('No rubric scenario is loaded');
    }
    return this.rubricSession.setInstructorScore({
      itemId,
      points,
      note,
      tSec: this._currentRubricTime(),
    });
  }

  finalizeRubric({ tSec } = {}) {
    if (!this.rubricSession) {
      return { ok: false, reason: 'NO_RUBRIC_SESSION', pendingItemIds: [] };
    }
    const finalized = this.rubricSession.finalize({
      tSec: tSec === undefined ? this._currentRubricTime() : tSec,
    });
    if (!finalized.ok) return copyJsonInput(finalized, 'rubric finalization result');
    return this._copyRubricFinalizationResult(finalized);
  }

  compactRubricSnapshot(t = this.simTime) {
    const p = this.p;
    const v = this.v;
    return {
      t,
      hr: p.heartRate,
      sbp: p.systolicBP,
      dbp: p.diastolicBP,
      map: p.meanArterialPressure > 0
        ? p.meanArterialPressure
        : p.diastolicBP + (p.systolicBP - p.diastolicBP) / 3,
      spo2: p.spO2,
      rr: p.respiratoryRate,
      etco2: p.etCO2,
      eto2: p.endTidalO2Percent,
      bis: p.bisIndex,
      mac: p.macMultiple,
      tof: p.trainOfFourCount,
      tofRatio: p.trainOfFourRatio,
      effectiveNmbBlockade: p.effectiveNmbBlockade,
      respiratoryMuscleCapability: p.respiratoryMuscleCapability,
      airwayDevice: p.airwayDeviceState,
      capnogramPresent: p.capnogramPresent,
      cricoidPressureActive: this.a.cricoidPressureActive,
      intubationAttemptCount: this.a.intubationAttemptCount,
      spontaneousRR: p.spontaneousRespiratoryRate,
      spontaneousTV: p.spontaneousTidalVolume,
      spontaneousMV: p.spontaneousMinuteVentilation,
      mechanicalMV: v.mechanicalMinuteVentilation,
      effectiveMV: v.effectiveMinuteVentilation,
      fio2: p.fiO2,
      ventMode: v.mode,
      ventSetTV: v.setTidalVolume,
      ventSetRR: v.setRespiratoryRate,
      ventSetPeep: v.setPeep,
      ventSetFiO2: v.setFiO2,
      o2Flow: v.o2FlowLPerMin,
      airFlow: v.airFlowLPerMin,
      n2oFlow: v.n2oFlowLPerMin,
      vaporizer: v.vaporizerDial,
      vaporizerAgent: v.vaporizerAgent,
      activeAnestheticInfusions: this.activeAnestheticInfusions(),
    };
  }

  recordRubricAction(action, meta = {}, tSec = this.a?.timeSec ?? this.simTime) {
    if (!this.rubricSession || this.isRubricFinalized()) return null;
    return this.rubricSession.recordAction({
      tSec,
      action,
      meta,
      snapshot: this.compactRubricSnapshot(tSec),
    });
  }

  recordCanonicalAction(action, meta = {}, tSec = this.a?.timeSec ?? this.simTime) {
    const rubric = this.recordRubricAction(action, meta, tSec);
    if (this.caseSession === null) return { rubric, caseResult: null };

    const usingLiveClock = this._caseLiveEpochSec !== null;
    const priorCaseClockTick = this._caseClockTick;
    const caseTimeSec = this._nextCaseTimestamp({
      live: usingLiveClock,
      engineTimeSec: usingLiveClock ? tSec : null,
    });
    let caseResult;
    try {
      caseResult = this.caseSession.recordCanonicalAction({
        action,
        meta,
        snapshot: this.compactRubricSnapshot(caseTimeSec),
        tSec: caseTimeSec,
      });
    } catch (error) {
      this._caseClockTick = priorCaseClockTick;
      throw error;
    }
    if (caseResult.ok !== true) {
      this._caseClockTick = priorCaseClockTick;
      return { rubric, caseResult };
    }
    this.applyCaseActivations(caseResult.activations ?? []);
    return { rubric, caseResult };
  }

  sampleRubricTraceAfterStep() {
    if (!this.rubricSession || this.isRubricFinalized() || this.core.tickCount % 50 !== 0) {
      return null;
    }
    const t = this.core.tickCount / 50;
    return this.rubricSession.recordTrace(this.compactRubricSnapshot(t));
  }

  snapshot() {
    const p = this.p, v = this.v;
    return {
      t: this.simTime,
      hr: p.heartRate, sbp: p.systolicBP, dbp: p.diastolicBP,
      // MAP falls back to the derived value before the first tick computes it
      map: p.meanArterialPressure > 0 ? p.meanArterialPressure : p.diastolicBP + (p.systolicBP - p.diastolicBP) / 3,
      spo2: p.spO2, rr: p.respiratoryRate, etco2: p.etCO2, eto2: p.endTidalO2Percent, temp: p.temperature,
      bis: p.bisIndex, mac: p.macMultiple, etAgent: p.endTidalAgent, agent: p.currentAgent,
      tof: p.trainOfFourCount, tofRatio: p.trainOfFourRatio,
      ppeak: v.measuredPeakPressure, mv: v.measuredMinuteVent, tv: v.measuredTidalVolume,
      mechanicalMV: v.mechanicalMinuteVentilation, effectiveMV: v.effectiveMinuteVentilation,
      fio2: p.fiO2, ventMode: v.mode, vaporizer: v.vaporizerDial, vaporizerAgent: v.vaporizerAgent,
      ventSetTV: v.setTidalVolume, ventSetRR: v.setRespiratoryRate, ventSetPeep: v.setPeep,
      ventSetFiO2: v.setFiO2,
      ventSetPressure: v.setPressureAbovePeep, ventSetPressureSupport: v.setPressureSupport,
      o2Flow: v.o2FlowLPerMin, airFlow: v.airFlowLPerMin, n2oFlow: v.n2oFlowLPerMin,
      intubated: p.isIntubated, spont: p.isBreathingSpontaneously, status: p.status,
      airwayDevice: p.airwayDeviceState, forcedApnea: p.forcedApneaActive,
      forcedApneaContribution: p.forcedApneaContribution,
      proceduralApnea: p.proceduralApneaActive,
      proceduralApneaContribution: p.proceduralApneaContribution,
      drugDepressionContribution: p.drugDepressionContribution,
      complicationDriveContribution: p.complicationDriveContribution,
      centralDrive: p.centralDrive, effectiveNmbBlockade: p.effectiveNmbBlockade,
      respiratoryMuscleCapability: p.respiratoryMuscleCapability,
      spontaneousRR: p.spontaneousRespiratoryRate, spontaneousTV: p.spontaneousTidalVolume,
      spontaneousMV: p.spontaneousMinuteVentilation, spontaneousEffort: p.spontaneousEffort,
      capnogramPresent: p.capnogramPresent,
      cricoidPressureActive: this.a.cricoidPressureActive,
      cricoidPressureHistory: this.a.cricoidPressureHistory,
      ppvActive: this.a.ppvActive,
      ppvEpisodeCount: this.a.ppvEpisodeCount,
      ppvCurrent: this.a.ppvCurrent,
      ppvHistory: this.a.ppvHistory,
      intubationInProgress: this.a.intubationInProgress,
      intubationAttemptCount: this.a.intubationAttemptCount,
      lastIntubationOutcome: this.a.lastIntubationOutcome,
      intubationAttempts: this.a.intubationAttempts,
      sugammadexRocRelief: this.d.sugammadexRocRelief,
      neostigmineRocRelief: this.d.neostigmineRocRelief,
      lastTofCheck: this.tofCheckHistory.length > 0
        ? { ...this.tofCheckHistory.at(-1) }
        : null,
      tofCheckCount: this.tofCheckHistory.length,
      tofCheckHistory: this.tofCheckHistory.map((entry) => ({ ...entry })),
      instructorNmbTarget: this.getInstructorNmbTargetStatus(),
      activeRubricScenario: this._activeRubricScenario === null
        ? null
        : { ...this._activeRubricScenario },
      activeAnestheticInfusions: this.activeAnestheticInfusions(),
      lidocainePlasmaTotalMcgMl: this.l.plasmaTotalMcgMl,
      lidocainePlasmaFreeMcgMl: this.l.plasmaFreeMcgMl,
      lidocaineEffectSiteMcgMl: this.l.effectSiteMcgMl,
      lidocaineCentralMg: this.l.centralMg,
      lidocainePeripheralMg: this.l.peripheralMg,
      lidocaineEliminatedMg: this.l.eliminatedMg,
      lidocaineCumulativeMg: this.l.cumulativeAdministeredMg,
      lidocaineCumulativeMgKg: this.l.cumulativeAdministeredMg / this.l.weightKg,
      lidocaineInfusionActive: this.l.infusionActive,
      lidocaineInfusionRateMgKgHour: this.l.infusionRateMgPerKgHour,
      lidocaineClearanceFactor: this.l.clearanceFactor,
      regionalSensoryBlock: this.l.regionalSensoryBlock,
      regionalMotorBlock: this.l.regionalMotorBlock,
      epiduralSympathectomyContribution: this.l.epiduralSympathectomyContribution,
      surgicalStimulusRaw: this.l.surgicalStimulusRaw,
      surgicalStimulusEffective: this.l.surgicalStimulusEffective,
      lidocaineSystemicAnalgesicContribution: this.l.systemicAnalgesicContribution,
      lidocaineAntiarrhythmicContribution: this.l.antiarrhythmicContribution,
      ventricularIrritabilityRaw: this.l.ventricularIrritabilityRaw,
      ventricularIrritabilityEffective: this.l.ventricularIrritabilityEffective,
      derivedRhythm: this.l.derivedRhythm,
      lidocaineCnsToxicity: this.l.cnsToxicity,
      lidocaineCardiacToxicity: this.l.cardiacToxicity,
      lidocaineSeizureActive: this.l.seizureActive,
      lidocaineToxicityStage: this.l.toxicityStage,
      lipidInfusionActive: this.l.lipidInfusionActive,
      lipidCumulativeMlKg: this.l.lipidCumulativeMlKg,
      lidocaineRegionalHistory: this.l.regionalHistory,
      lidocaineDoseHistory: this.l.doseHistory,
      lidocaineToxicityHistory: this.l.toxicityHistory,
      lipidRescueHistory: this.l.lipidRescueHistory,
      running: this.running, lifecycle: this.getLifecycleState(), speed: this.speed,
      patient: `${p.weightKg} kg · ${p.ageYears} y · ${p.sex}`,
      // physiologic drivers (truth-boundary inputs) + drug context for the advisor
      svr: p.svrFactor, vol: p.bloodVolumeFraction, airwayRes: p.airwayResistanceFactor,
      shunt: p.shuntFraction, hrOffset: p.hrComplicationOffset, respDrive: p.respiratoryDriveFactor,
      heat: p.heatLoadC, vco2: p.vco2MlMin,
      propofolCe: p.propofolCe, fentanylCe: p.fentanylCe, midazolamCe: p.midazolamCe,
      weightKg: p.weightKg,
    };
  }

  // ── physiologic drivers (truth boundary: set drivers, engine derives vitals) ──
  setDriver(key, value) { if (this.p) this.p[key] = value; }

  driverDefaults() {
    return {
      svrFactor: 1, bloodVolumeFraction: 1, airwayResistanceFactor: 1, shuntFraction: 0,
      hrComplicationOffset: 0, respiratoryDriveFactor: 1, heatLoadC: 0,
      vco2MlMin: this.p ? this.p.deriveRestingVco2() : 200,
    };
  }

  applyCondition(name, patch) {
    if (!this.p) return;
    const d = this.driverDefaults();
    Object.assign(d, patch);
    for (const k in d) this.p[k] = d[k];
    this.logEvent('Condition', name, { action: 'condition', name });
  }

  // live baseline nudge — engine lerps current vitals toward the new baseline (no reset)
  setBaselineLive(key, value) {
    if (this.p) this.p[key] = value;
    this.config[key] = value;
    if (this._loadedRubricScenario === null && this._loadedCaseScenario === null) {
      this.#savedLiveConfig[key] = value;
    }
  }

  // ── control surface ────────────────────────────────────────────────
  giveBolus(name, doseMg, label) {
    const state = this.getLifecycleState();
    this.d.administerBolus(name, doseMg);
    this.logEvent('Drug', label || `${name} ${doseMg} mg`, { action: 'drug', drug: name, doseMg });
    if (state === 'READY') this.start();
    return { state, started: state === 'READY', queued: state === 'PAUSED' };
  }

  finishLidocaineAction(invoke, {
    action, kind, detail, startWhenReady = true,
  }) {
    const state = this.getLifecycleState();
    let raw;
    try {
      raw = invoke();
    } catch (error) {
      return { ok: false, reason: error instanceof Error ? error.message : String(error) };
    }
    const result = (raw && typeof raw === 'object')
      ? { ok: true, ...raw }
      : { ok: true, changed: true, value: raw };
    const changed = result.changed !== false;
    if (changed) {
      this.logEvent(kind, typeof detail === 'function' ? detail(result) : detail, {
        action,
        ...result,
      });
    }
    const started = changed && startWhenReady && state === 'READY';
    if (started) this.start();
    else this.emit();
    return {
      ...result,
      state,
      started,
      queued: changed && state === 'PAUSED',
    };
  }

  giveLidocaineBolus({ doseMgPerKg = 1.5 } = {}) {
    return this.finishLidocaineAction(
      () => this.l.giveIvBolus({ doseMgPerKg }),
      {
        action: 'lidocaine_iv_bolus',
        kind: 'Lidocaine',
        detail: (result) => `IV ${result.doseMgPerKg} mg/kg · ${result.totalDoseMg.toFixed(1)} mg`,
      },
    );
  }

  startLidocaineInfusion({ rateMgPerKgHour } = {}) {
    return this.finishLidocaineAction(
      () => this.l.startInfusion({ rateMgPerKgHour }),
      {
        action: this.l.infusionActive
          ? 'lidocaine_infusion_rate_changed'
          : 'lidocaine_infusion_started',
        kind: 'Lidocaine',
        detail: (result) => `Infusion ${result.rateMgPerKgHour} mg/kg/hr`,
      },
    );
  }

  stopLidocaineInfusion() {
    return this.finishLidocaineAction(
      () => this.l.stopInfusion(),
      {
        action: 'lidocaine_infusion_stopped', kind: 'Lidocaine',
        detail: 'Infusion stopped', startWhenReady: false,
      },
    );
  }

  administerRegionalLidocaine(options) {
    const result = this.finishLidocaineAction(
      () => this.l.administerRegional(options),
      {
        action: 'regional_lidocaine_administered',
        kind: 'Regional Lidocaine',
        detail: (record) => `${record.route} · ${record.totalDoseMg.toFixed(1)} mg`,
      },
    );
    if (result.ok && result.changed !== false && result.doseLimitStatus === 'exceeded') {
      this.logEvent('Lidocaine warning', result.warning, {
        action: 'lidocaine_dose_warning',
        route: result.route,
        totalDoseMg: result.totalDoseMg,
        maximumRecommendedMg: result.maximumRecommendedMg,
      });
    }
    return result;
  }

  setSurgicalStimulus(intensity) {
    const previous = this.l.surgicalStimulusRaw;
    return this.finishLidocaineAction(
      () => {
        const value = this.l.setSurgicalStimulus(intensity);
        return { changed: value !== previous, value };
      },
      {
        action: 'surgical_stimulus_changed', kind: 'Surgical stimulus',
        detail: (result) => `Intensity ${result.value.toFixed(2)}`,
      },
    );
  }

  setVentricularIrritability(intensity) {
    const previous = this.l.ventricularIrritabilityRaw;
    return this.finishLidocaineAction(
      () => {
        const value = this.l.setVentricularIrritability(intensity);
        return { changed: value !== previous, value };
      },
      {
        action: 'ventricular_irritability_changed', kind: 'Rhythm driver',
        detail: (result) => `Intensity ${result.value.toFixed(2)}`,
        startWhenReady: false,
      },
    );
  }

  giveLipidEmulsionBolus() {
    return this.finishLidocaineAction(
      () => this.l.giveLipidBolus(),
      {
        action: 'lipid_emulsion_bolus', kind: 'LAST rescue',
        detail: (result) => `20% lipid ${result.deliveredMlKg.toFixed(2)} mL/kg bolus`,
      },
    );
  }

  startLipidEmulsionInfusion() {
    const action = this.l.lipidInfusionActive
      ? 'lipid_emulsion_infusion_rate_doubled'
      : 'lipid_emulsion_infusion_started';
    return this.finishLidocaineAction(
      () => this.l.startLipidInfusion(),
      {
        action, kind: 'LAST rescue',
        detail: (result) => `20% lipid ${result.rateMlKgMin.toFixed(2)} mL/kg/min`,
      },
    );
  }

  stopLipidEmulsionInfusion() {
    return this.finishLidocaineAction(
      () => this.l.stopLipidInfusion(),
      {
        action: 'lipid_emulsion_infusion_stopped', kind: 'LAST rescue',
        detail: '20% lipid infusion stopped', startWhenReady: false,
      },
    );
  }

  preoxygenate() {
    const state = this.getLifecycleState();
    this.setMachine({
      o2FlowLPerMin: 10, airFlowLPerMin: 0, n2oFlowLPerMin: 0, setFiO2: 1,
    });
    this.logEvent('Machine', 'Preoxygenation · 100% O₂ at 10 L/min', { action: 'preoxygenate' });
    if (state === 'READY') this.start();
    else this.emit();
    return { state, started: state === 'READY' };
  }

  setVentMode(mode) {
    const previousMode = this.v.mode;
    this.v.setMode(mode);
    this.logEvent('Ventilator', `Mode → ${ventName(mode)}`, {
      action: 'vent_mode_changed', previousMode, mode: this.v.mode,
    });
  }

  setMachine(patch) {
    Object.assign(this.v, patch);
    if ('mode' in patch) this.v.setMode(patch.mode);
    this.recordCanonicalAction('machine_settings_changed', { patch: { ...patch } });
  }

  setVolatile({ agent, dialPercent } = {}) {
    const allowed = new Set(['Sevoflurane', 'Desflurane', 'Isoflurane']);
    if (!Number.isFinite(dialPercent) || dialPercent < 0 || dialPercent > 18) {
      return { ok: false, reason: 'volatile dial must be between 0 and 18 percent' };
    }
    if (!allowed.has(agent)) {
      return { ok: false, reason: `unsupported volatile agent: ${agent}` };
    }
    this.v.vaporizerAgent = agent;
    this.v.vaporizerDial = dialPercent;
    this.logEvent('Volatile anesthetic', `${agent} ${dialPercent.toFixed(1)}%`, {
      action: 'volatile_changed',
      agent,
      dialPercent,
      airwayDevice: this.p.airwayDeviceState,
    });
    this.emit();
    return { ok: true, agent, dialPercent };
  }

  checkTrainOfFour() {
    const stored = Object.freeze({
      tSec: this.simTime,
      count: this.p.trainOfFourCount,
      ratio: this.p.trainOfFourRatio,
      effectiveNmbBlockade: this.p.effectiveNmbBlockade,
      nmbSource: this.p.dominantNmbSource,
      airwayDevice: this.p.airwayDeviceState,
    });
    this.tofCheckHistory.push(stored);
    this.logEvent(
      'Neuromuscular assessment',
      `TOF ${stored.count} · ratio ${stored.ratio.toFixed(2)}`,
      { action: 'tof_checked', ...stored },
    );
    this.emit();
    return { ...stored };
  }

  getInstructorNmbTargetStatus() {
    if (!this._instructorNmbTarget) return null;
    const targetTofRatio = this._instructorNmbTarget.targetTofRatio;
    const actualTofRatio = this.p.trainOfFourRatio;
    return {
      ...this._instructorNmbTarget,
      actualTofRatio,
      actualTofCount: this.p.trainOfFourCount,
      effectiveNmbBlockade: this.p.effectiveNmbBlockade,
      dominantNmbSource: this.p.dominantNmbSource,
      tolerance: INSTRUCTOR_NMB_TARGET_TOLERANCE,
      equilibrating: Math.abs(actualTofRatio - targetTofRatio)
        > INSTRUCTOR_NMB_TARGET_TOLERANCE,
    };
  }

  setInstructorNmbTarget({ targetTofRatio } = {}) {
    if (typeof targetTofRatio !== 'number' || !Number.isFinite(targetTofRatio)) {
      throw new TypeError('targetTofRatio must be a finite number');
    }
    if (targetTofRatio < 0 || targetTofRatio > 1) {
      throw new RangeError('targetTofRatio must be between 0 and 1');
    }

    this._instructorNmbTarget = {
      ...this.d.setAdministrativeNmbTarget({ targetTofRatio }),
    };
    const status = this.getInstructorNmbTargetStatus();
    this.logEvent(
      'Instructor NMB',
      `Administrative target · TOF ratio ${targetTofRatio.toFixed(2)}`,
      { action: 'instructor_nmb_depth_set', ...status },
    );
    this.emit();
    return { ...status };
  }

  assessSpontaneousVentilation() {
    this.logEvent('Respiratory assessment', 'Spontaneous ventilation assessed', {
      action: 'spontaneous_ventilation_assessed',
    });
    return this.compactRubricSnapshot();
  }

  confirmEtco2() {
    this.logEvent('Airway confirmation', 'Continuous EtCO₂ confirmed', {
      action: 'confirm_etco2',
    });
    return this.compactRubricSnapshot();
  }

  configureIntubationAttempts(options) { return this.a.configureIntubation(options); }

  deliverMaskVentilation(options) {
    return this.finishProcedureAction(this.a.deliverMaskVentilation(options));
  }

  stopMaskVentilation() { return this.finishProcedureAction(this.a.stopMaskVentilation(), false); }

  applyCricoidPressure() {
    const result = this.a.applyCricoidPressure();
    return this.finishProcedureAction(result, result.changed);
  }

  releaseCricoidPressure() {
    const result = this.a.releaseCricoidPressure();
    return this.finishProcedureAction(result, result.changed);
  }

  attemptIntubation() { return this.finishProcedureAction(this.a.attemptIntubation()); }

  intubate() { return this.attemptIntubation(); }

  extubate() {
    const result = this.p.transitionAirwayDevice(AirwayDevice.Extubated);
    if (!result.ok) return result;
    this.v.setMode(VentMode.Manual);
    this.logEvent('Airway', 'Extubated · manual/spontaneous', { action: 'extubate' });
    return result;
  }

  setAirwayDevice(next) { return this.p.transitionAirwayDevice(next); }

  setForcedApnea(active) {
    this.p.setForcedApnea(active);
    this.logEvent('Respiratory drive', active ? 'Forced apnea imposed' : 'Forced apnea lifted', {
      action: active ? 'force_apnea' : 'lift_forced_apnea',
    });
  }

  injectComplication(type) {
    if (!LIVE_COMPLICATIONS.includes(type)) {
      throw new RangeError(`Unsupported complication: ${type}`);
    }
    this.s.applyComplication({ complicationType: type, description: type });
    this.logEvent('Complication', type, { action: 'complication', type });
    return { ok: true, type };
  }

  buildDebrief() {
    const def = this.s.activeScenario || liveScenarioDefinition(this.config);
    let finalizedRubricResult = null;
    if (this.rubricSession) {
      const live = this.rubricSession.getLiveResult();
      if (live.ok !== true || live.finalized !== true) {
        const error = new Error(
          'Rubric debrief is not finalized; resolve pending instructor scores and call finalizeRubric()',
        );
        error.code = 'RUBRIC_DEBRIEF_NOT_FINALIZED';
        error.pendingItemIds = live.items
          .filter(({ points }) => points === null)
          .map(({ id }) => id);
        throw error;
      }
      finalizedRubricResult = this._copyRubricFinalizationResult(live);
    }
    let finalizedCaseResult = null;
    if (this.caseSession) {
      const liveCase = this.caseSession.getLiveResult();
      if (liveCase.finalized !== true) {
        const error = new Error(
          'Case debrief is not finalized; resolve pending instructor observations and call finalizeCaseDebrief()',
        );
        error.code = 'CASE_DEBRIEF_NOT_FINALIZED';
        error.pendingConsiderationIds = this._pendingCaseConsiderationIds();
        throw error;
      }
      finalizedCaseResult = liveCase;
    }
    const result = buildScenarioDebrief(
      def,
      this.s.run,
      this.s.scoring,
      this.s.actionLog,
      0,
      0,
      this.simTime,
      finalizedRubricResult,
      this.rubricSession?.rubric ?? null,
      finalizedCaseResult,
      finalizedCaseResult === null ? null : this._activeCaseDefinition,
    );
    result.respiratoryAttribution = this.p.respiratoryAttribution;
    result.lidocaineAttribution = buildLidocaineAttribution(this.l, this.tofCheckHistory);
    return finalizedRubricResult === null && finalizedCaseResult === null
      ? result
      : copyJsonInput(result, 'debrief result');
  }

  /* Considerations that finalizeCaseDebrief() would refuse on, so callers can
     surface exactly what still needs an instructor decision. */
  _pendingCaseConsiderationIds() {
    if (!this.caseSession || !this._activeCaseDefinition) return [];
    const observations = new Map(
      this.caseSession.getLiveResult().instructorObservations
        .map((observation) => [observation.considerationId, observation]),
    );
    return this._activeCaseDefinition.instructorGuide.considerations
      .filter(({ id }) => {
        const observation = observations.get(id);
        return !observation || observation.status === 'not_yet_evaluable';
      })
      .map(({ id }) => id);
  }

  logEvent(kind, detail, meta) {
    const entry = { t: this.simTime, kind, detail, meta: meta || null };
    this.log.push(entry);
    if (this.onEvent) this.onEvent(entry);
    if (meta?.source !== 'scenario' && typeof meta?.action === 'string') {
      const { action, ...canonicalMeta } = meta;
      this.recordCanonicalAction(action, canonicalMeta);
    }
  }

  finishProcedureAction(result, startWhenReady = result.ok) {
    const state = this.getLifecycleState();
    if (startWhenReady && state === 'READY') this.start();
    else this.emit();
    return { ...result, state, started: startWhenReady && state === 'READY' };
  }

  logProcedureEvent(event) {
    const entry = {
      t: event.tSec,
      kind: 'Airway procedure',
      detail: event.type,
      meta: { action: event.type, ...event.meta },
    };
    this.log.push(entry);
    if (this.onEvent) this.onEvent(entry);
    this.recordCanonicalAction(event.type, { ...event.meta }, event.tSec);
  }
}

export function ventName(m) {
  return { 0: 'Manual/Bag', 1: 'VCV', 2: 'PCV', 3: 'PSV' }[m] || String(m);
}
export { VentMode };
