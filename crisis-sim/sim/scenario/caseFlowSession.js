import { copyCaseData } from './caseContract.js';

const FIXED_STEP_HZ = 50;
const INSTRUCTOR_EVENT_ACTION = 'instructor_event';
const PHYSIOLOGY_OPERATORS = Object.freeze({
  '<': (actual, expected) => actual < expected,
  '<=': (actual, expected) => actual <= expected,
  '>': (actual, expected) => actual > expected,
  '>=': (actual, expected) => actual >= expected,
  '==': (actual, expected) => actual === expected,
});

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function requirePlainObject(value, label) {
  if (!isPlainObject(value)) throw new TypeError(`${label} must be a plain object`);
}

function requireOrdinaryArray(value, label) {
  if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype) {
    throw new TypeError(`${label} must be an ordinary array`);
  }
}

function requireNonemptyString(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(`${label} must be a nonempty string`);
  }
}

function normalizeFixedStepTime(value, label = 'tSec') {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new TypeError(`${label} must be a finite nonnegative 0.02-second fixed-step timestamp`);
  }
  const ticks = value * FIXED_STEP_HZ;
  const nearestTick = Math.round(ticks);
  if (!Number.isSafeInteger(nearestTick) || Math.abs(ticks - nearestTick) > 1e-9) {
    throw new RangeError(`${label} must align to safe-integer 0.02-second fixed-step ticks`);
  }
  return nearestTick / FIXED_STEP_HZ;
}

function freezeRecursively(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) freezeRecursively(nested, seen);
  return Object.freeze(value);
}

function immutableCopy(value, label) {
  return freezeRecursively(copyCaseData(value, label));
}

function equalJsonSafe(left, right) {
  if (Object.is(left, right)) return true;
  if (left === null || right === null || typeof left !== 'object' || typeof right !== 'object') {
    return false;
  }
  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left)
      && Array.isArray(right)
      && left.length === right.length
      && left.every((entry, index) => equalJsonSafe(entry, right[index]));
  }
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  return leftKeys.length === rightKeys.length
    && leftKeys.every((key) => Object.hasOwn(right, key)
      && equalJsonSafe(left[key], right[key]));
}

function equalPlanTriggerValue(actual, expected) {
  if (!Array.isArray(actual) || !Array.isArray(expected)) {
    return equalJsonSafe(actual, expected);
  }
  if (actual.length !== expected.length) return false;
  const consumedActualIndexes = new Set();
  return expected.every((expectedOption) => {
    const matchingIndex = actual.findIndex((actualOption, index) => (
      !consumedActualIndexes.has(index) && equalJsonSafe(actualOption, expectedOption)
    ));
    if (matchingIndex < 0) return false;
    consumedActualIndexes.add(matchingIndex);
    return true;
  });
}

function matchesSubset(actual, expected) {
  if (expected === null || typeof expected !== 'object') return equalJsonSafe(actual, expected);
  if (Array.isArray(expected)) return equalJsonSafe(actual, expected);
  if (!isPlainObject(actual)) return false;
  return Object.keys(expected).every((key) => Object.hasOwn(actual, key)
    && matchesSubset(actual[key], expected[key]));
}

function validateEventFlow(eventFlow) {
  requirePlainObject(eventFlow, 'eventFlow');
  requireNonemptyString(eventFlow.initialPhaseId, 'eventFlow.initialPhaseId');
  requireOrdinaryArray(eventFlow.phases, 'eventFlow.phases');
  requireOrdinaryArray(eventFlow.events, 'eventFlow.events');
  requireOrdinaryArray(eventFlow.branches, 'eventFlow.branches');
  if (eventFlow.phases.length === 0) throw new TypeError('eventFlow.phases must not be empty');

  const phaseIds = new Set();
  for (const [index, phase] of eventFlow.phases.entries()) {
    requirePlainObject(phase, `eventFlow.phases[${index}]`);
    requireNonemptyString(phase.id, `eventFlow.phases[${index}].id`);
    if (phaseIds.has(phase.id)) throw new TypeError(`duplicate event-flow phase id ${phase.id}`);
    phaseIds.add(phase.id);
    requireOrdinaryArray(phase.events, `eventFlow.phases[${index}].events`);
    requireOrdinaryArray(
      phase.allowedInstructorControls,
      `eventFlow.phases[${index}].allowedInstructorControls`,
    );
    requirePlainObject(phase.completionWhen, `eventFlow.phases[${index}].completionWhen`);
  }
  if (!phaseIds.has(eventFlow.initialPhaseId)) {
    throw new TypeError(`unknown initial event-flow phase ${eventFlow.initialPhaseId}`);
  }

  const eventIds = new Set();
  const eventsById = new Map();
  for (const [index, currentEvent] of eventFlow.events.entries()) {
    requirePlainObject(currentEvent, `eventFlow.events[${index}]`);
    requireNonemptyString(currentEvent.id, `eventFlow.events[${index}].id`);
    requireNonemptyString(currentEvent.phaseId, `eventFlow.events[${index}].phaseId`);
    if (eventIds.has(currentEvent.id)) throw new TypeError(`duplicate event-flow event id ${currentEvent.id}`);
    if (!phaseIds.has(currentEvent.phaseId)) {
      throw new TypeError(`event ${currentEvent.id} references unknown phase ${currentEvent.phaseId}`);
    }
    eventIds.add(currentEvent.id);
    eventsById.set(currentEvent.id, currentEvent);
  }
  const phaseEventIds = new Set();
  for (const currentPhase of eventFlow.phases) {
    for (const eventId of currentPhase.events) {
      requireNonemptyString(eventId, `phase ${currentPhase.id} event id`);
      const currentEvent = eventsById.get(eventId);
      if (!currentEvent || currentEvent.phaseId !== currentPhase.id) {
        throw new TypeError(`phase ${currentPhase.id} contains invalid event ${eventId}`);
      }
      if (phaseEventIds.has(eventId)) {
        throw new TypeError(`event ${eventId} is listed in more than one phase`);
      }
      phaseEventIds.add(eventId);
    }
  }
  // Reverse invariant (matches caseContract): every declared event must appear
  // in its owning phase's events list. Otherwise getState() (which iterates
  // phase.events) would hide an event that onAction (which checks phaseId only)
  // would still fire — a hidden-but-fireable divergence.
  for (const currentEvent of eventFlow.events) {
    if (!phaseEventIds.has(currentEvent.id)) {
      throw new TypeError(`event ${currentEvent.id} is not listed in its owning phase ${currentEvent.phaseId}`);
    }
  }
}

function shouldResetPhysiology(trigger, actual) {
  switch (trigger.operator) {
    case '<':
      return actual >= trigger.value + trigger.resetDelta;
    case '<=':
      return trigger.resetDelta === 0
        ? actual > trigger.value
        : actual >= trigger.value + trigger.resetDelta;
    case '>':
      return actual <= trigger.value - trigger.resetDelta;
    case '>=':
      return trigger.resetDelta === 0
        ? actual < trigger.value
        : actual <= trigger.value - trigger.resetDelta;
    case '==':
      return trigger.resetDelta === 0
        ? actual !== trigger.value
        : Math.abs(actual - trigger.value) >= trigger.resetDelta;
    default:
      return false;
  }
}

function success(details = {}) {
  return immutableCopy({ ok: true, ...details }, 'case flow success');
}

function failure(reason) {
  return immutableCopy({ ok: false, reason }, 'case flow failure');
}

export class CaseFlowSession {
  #eventFlow;

  #phasesById;

  #eventsById;

  #branchesById;

  #initialTimeSec;

  #latestTimeSec;

  #entered = false;

  #currentPhaseId;

  #phaseStartedAtActiveSec = 0;

  #paused = false;

  #pauseStartedAtSec = null;

  #totalPausedSec = 0;

  #activationSequence = 0;

  #historySequence = 0;

  #firedEventIds = new Set();

  #activeEventIds = new Set();

  #responseDeadlines = new Map();

  #physiologyState = new Map();

  #timeEventsFiredThisEntry = new Set();

  #history = [];

  #pendingActivations = [];

  constructor({ eventFlow, initialTimeSec = 0 } = {}) {
    const copiedFlow = copyCaseData(eventFlow, 'eventFlow');
    validateEventFlow(copiedFlow);
    const safeInitialTime = normalizeFixedStepTime(initialTimeSec, 'initialTimeSec');

    this.#eventFlow = immutableCopy(copiedFlow, 'eventFlow');
    this.#phasesById = new Map(this.#eventFlow.phases.map((entry) => [entry.id, entry]));
    this.#eventsById = new Map(this.#eventFlow.events.map((entry) => [entry.id, entry]));
    this.#branchesById = new Map(this.#eventFlow.branches.map((entry) => [entry.id, entry]));
    this.#initialTimeSec = safeInitialTime;
    this.#latestTimeSec = safeInitialTime;
    this.#currentPhaseId = this.#eventFlow.initialPhaseId;
  }

  #validatedTime(tSec) {
    const safeTime = normalizeFixedStepTime(tSec);
    if (safeTime < this.#latestTimeSec) {
      throw new RangeError(`tSec must be nondecreasing (latest is ${this.#latestTimeSec})`);
    }
    return safeTime;
  }

  #commitTime(tSec) {
    this.#latestTimeSec = tSec;
  }

  #activeClock(tSec) {
    const currentPauseSec = this.#paused ? tSec - this.#pauseStartedAtSec : 0;
    return tSec - this.#initialTimeSec - this.#totalPausedSec - currentPauseSec;
  }

  #currentPhase() {
    return this.#phasesById.get(this.#currentPhaseId);
  }

  #appendHistory(record) {
    this.#historySequence += 1;
    this.#history.push(immutableCopy({
      ...record,
      historySequence: this.#historySequence,
    }, 'case flow history record'));
  }

  #clearActiveEvents(tSec, reason) {
    const eventsWithDeadlines = new Set();
    for (const deadline of this.#responseDeadlines.values()) {
      eventsWithDeadlines.add(deadline.eventId);
      this.#appendHistory({
        kind: 'response_window_closed',
        ...deadline,
        phaseId: this.#currentPhaseId,
        tSec,
        reason,
      });
    }
    for (const eventId of this.#activeEventIds) {
      if (eventsWithDeadlines.has(eventId)) continue;
      this.#appendHistory({
        kind: 'response_window_closed',
        eventId,
        phaseId: this.#currentPhaseId,
        tSec,
        reason,
      });
    }
    this.#activeEventIds.clear();
    this.#responseDeadlines.clear();
  }

  #expireResponseWindows(tSec) {
    for (const [activationSequence, deadline] of [...this.#responseDeadlines.entries()]) {
      if (tSec <= deadline.responseDeadlineSec) continue;
      this.#responseDeadlines.delete(activationSequence);
      const hasRemainingWindow = [...this.#responseDeadlines.values()]
        .some(({ eventId }) => eventId === deadline.eventId);
      if (!hasRemainingWindow) this.#activeEventIds.delete(deadline.eventId);
      this.#appendHistory({
        kind: 'response_window_expired',
        ...deadline,
        phaseId: this.#currentPhaseId,
        tSec,
      });
    }
  }

  #canFire(currentEvent) {
    return currentEvent.repeatable || !this.#firedEventIds.has(currentEvent.id);
  }

  #activate(currentEvent, source, tSec) {
    if (!this.#canFire(currentEvent)) return null;
    this.#activationSequence += 1;
    const responseDeadlineSec = currentEvent.responseWindowSec > 0
      ? normalizeFixedStepTime(tSec + currentEvent.responseWindowSec, 'response deadline')
      : null;
    const activation = immutableCopy({
      sequence: this.#activationSequence,
      tSec,
      eventId: currentEvent.id,
      phaseId: currentEvent.phaseId,
      source,
      effect: currentEvent.effect,
      responseDeadlineSec,
      guidanceIds: currentEvent.guidanceIds,
      debriefIds: currentEvent.debriefIds,
    }, 'case event activation');
    this.#firedEventIds.add(currentEvent.id);
    this.#activeEventIds.delete(currentEvent.id);
    this.#activeEventIds.add(currentEvent.id);
    if (responseDeadlineSec !== null) {
      this.#responseDeadlines.set(activation.sequence, immutableCopy({
        eventId: currentEvent.id,
        activationSequence: activation.sequence,
        activatedAtSec: tSec,
        responseDeadlineSec,
      }, 'case response deadline'));
    }
    this.#pendingActivations.push(activation);
    this.#appendHistory({ kind: 'event_activated', ...activation });
    return activation;
  }

  #enterPhase(phaseId, tSec, reason) {
    const priorPhaseId = this.#entered ? this.#currentPhaseId : null;
    if (this.#entered) this.#clearActiveEvents(tSec, 'phase_exit');
    this.#entered = true;
    this.#currentPhaseId = phaseId;
    this.#phaseStartedAtActiveSec = this.#activeClock(tSec);
    this.#timeEventsFiredThisEntry.clear();
    this.#physiologyState.clear();
    const historyRecord = {
      kind: 'phase_entered',
      phaseId,
      tSec,
      reason,
    };
    if (priorPhaseId !== null) historyRecord.fromPhaseId = priorPhaseId;
    this.#appendHistory(historyRecord);
    return this.#evaluatePhaseEnter(tSec);
  }

  #evaluatePhaseEnter(tSec) {
    const activatedIds = [];
    const startingPhaseId = this.#currentPhaseId;
    for (const eventId of this.#currentPhase().events) {
      if (this.#currentPhaseId !== startingPhaseId) break;
      const currentEvent = this.#eventsById.get(eventId);
      if (currentEvent.trigger.type !== 'phase_enter') continue;
      const activation = this.#activate(currentEvent, 'phase_enter', tSec);
      if (activation) {
        activatedIds.push(activation.eventId);
        activatedIds.push(...this.#completeForEvent(currentEvent.id, tSec));
      }
    }
    return activatedIds;
  }

  #nextPhaseId() {
    const index = this.#eventFlow.phases.findIndex(({ id }) => id === this.#currentPhaseId);
    return index >= 0 && index + 1 < this.#eventFlow.phases.length
      ? this.#eventFlow.phases[index + 1].id
      : null;
  }

  #advanceToNextPhase(tSec, reason) {
    const nextPhaseId = this.#nextPhaseId();
    if (nextPhaseId === null) return null;
    return {
      phaseId: nextPhaseId,
      activations: this.#enterPhase(nextPhaseId, tSec, reason),
    };
  }

  #completeForEvent(eventId, tSec) {
    const completion = this.#currentPhase().completionWhen;
    if (completion.type !== 'event_fired' || completion.eventId !== eventId) return [];
    return this.#advanceToNextPhase(tSec, `event_fired:${eventId}`)?.activations ?? [];
  }

  #completeForPlan(tSec) {
    if (this.#currentPhase().completionWhen.type !== 'plan_submitted') return [];
    return this.#advanceToNextPhase(tSec, 'plan_submitted')?.activations ?? [];
  }

  enterInitialPhase({ tSec } = {}) {
    const safeTime = this.#validatedTime(tSec);
    if (this.#entered) return [];
    this.#commitTime(safeTime);
    return immutableCopy(
      this.#enterPhase(this.#eventFlow.initialPhaseId, safeTime, 'initial'),
      'initial phase activations',
    );
  }

  #evaluateTimeEvents(tSec, snapshot) {
    const activatedIds = [];
    const activeClock = this.#activeClock(tSec);
    const phaseClock = activeClock - this.#phaseStartedAtActiveSec;
    const startingPhaseId = this.#currentPhaseId;
    for (const eventId of this.#currentPhase().events) {
      if (this.#currentPhaseId !== startingPhaseId) break;
      const currentEvent = this.#eventsById.get(eventId);
      let matches = false;
      switch (currentEvent.trigger.type) {
        case 'fixed_time':
          matches = activeClock >= currentEvent.trigger.atSec
            && !this.#timeEventsFiredThisEntry.has(currentEvent.id);
          break;
        case 'phase_time':
          matches = phaseClock >= currentEvent.trigger.atSec
            && !this.#timeEventsFiredThisEntry.has(currentEvent.id);
          break;
        case 'physiology':
          matches = this.#evaluatePhysiology(currentEvent, tSec, snapshot);
          break;
        default:
          break;
      }
      if (!matches) continue;
      if (currentEvent.trigger.type === 'fixed_time'
        || currentEvent.trigger.type === 'phase_time') {
        this.#timeEventsFiredThisEntry.add(currentEvent.id);
      }
      const source = currentEvent.trigger.type === 'physiology' ? 'physiology' : 'time';
      const activation = this.#activate(currentEvent, source, tSec);
      if (activation) {
        activatedIds.push(activation.eventId);
        activatedIds.push(...this.#completeForEvent(currentEvent.id, tSec));
      }
    }
    return activatedIds;
  }

  #evaluatePhysiology(currentEvent, tSec, snapshot) {
    const trigger = currentEvent.trigger;
    const actual = snapshot[trigger.key];
    const prior = this.#physiologyState.get(currentEvent.id) ?? {
      armed: true,
      sinceActiveSec: null,
    };
    if (typeof actual !== 'number' || !Number.isFinite(actual)) {
      prior.sinceActiveSec = null;
      this.#physiologyState.set(currentEvent.id, prior);
      return false;
    }
    const comparator = PHYSIOLOGY_OPERATORS[trigger.operator];
    if (!comparator) return false;
    const conditionMet = comparator(actual, trigger.value);
    if (!prior.armed) {
      if (shouldResetPhysiology(trigger, actual)) {
        prior.armed = true;
        prior.sinceActiveSec = null;
      }
      this.#physiologyState.set(currentEvent.id, prior);
      return false;
    }
    if (!conditionMet) {
      prior.sinceActiveSec = null;
      this.#physiologyState.set(currentEvent.id, prior);
      return false;
    }
    const activeNow = this.#activeClock(tSec);
    if (prior.sinceActiveSec === null) prior.sinceActiveSec = activeNow;
    const dwellMet = activeNow - prior.sinceActiveSec + 1e-9 >= trigger.dwellSec;
    if (dwellMet) {
      prior.armed = false;
      prior.sinceActiveSec = null;
    }
    this.#physiologyState.set(currentEvent.id, prior);
    return dwellMet;
  }

  onStep({ tSec, snapshot = {} } = {}) {
    requirePlainObject(snapshot, 'snapshot');
    const copiedSnapshot = copyCaseData(snapshot, 'snapshot');
    const safeTime = this.#validatedTime(tSec);
    this.#commitTime(safeTime);
    if (!this.#entered || this.#paused) return immutableCopy([], 'step activations');
    this.#expireResponseWindows(safeTime);
    return immutableCopy(
      this.#evaluateTimeEvents(safeTime, copiedSnapshot),
      'step activations',
    );
  }

  onAction({ action, meta = {}, tSec, snapshot = {} } = {}) {
    requireNonemptyString(action, 'action');
    requirePlainObject(meta, 'meta');
    requirePlainObject(snapshot, 'snapshot');
    const copiedMeta = copyCaseData(meta, 'action meta');
    copyCaseData(snapshot, 'action snapshot');
    if (action === INSTRUCTOR_EVENT_ACTION) {
      requireNonemptyString(copiedMeta.eventId, 'meta.eventId');
    }
    const safeTime = this.#validatedTime(tSec);
    if (action === INSTRUCTOR_EVENT_ACTION) {
      if (!this.#entered || this.#paused) return immutableCopy([], 'action activations');
      if (!this.#currentPhase().allowedInstructorControls.includes('activate_event')) {
        return immutableCopy([], 'action activations');
      }
      const currentEvent = this.#eventsById.get(copiedMeta.eventId);
      if (currentEvent?.phaseId !== this.#currentPhaseId
        || currentEvent.trigger.type !== 'instructor'
        || !this.#canFire(currentEvent)) {
        return immutableCopy([], 'action activations');
      }
      this.#commitTime(safeTime);
      this.#expireResponseWindows(safeTime);
      const activatedIds = [];
      const activation = this.#activate(currentEvent, 'instructor', safeTime);
      if (activation) {
        activatedIds.push(activation.eventId);
        activatedIds.push(...this.#completeForEvent(currentEvent.id, safeTime));
      }
      return immutableCopy(activatedIds, 'action activations');
    }

    this.#commitTime(safeTime);
    if (!this.#entered || this.#paused) return immutableCopy([], 'action activations');
    this.#expireResponseWindows(safeTime);

    const activatedIds = [];
    const startingPhaseId = this.#currentPhaseId;
    for (const eventId of this.#currentPhase().events) {
      if (this.#currentPhaseId !== startingPhaseId) break;
      const currentEvent = this.#eventsById.get(eventId);
      if (currentEvent.trigger.type !== 'action' || currentEvent.trigger.action !== action) continue;
      if (Object.hasOwn(currentEvent.trigger, 'match')
        && !matchesSubset(copiedMeta, currentEvent.trigger.match)) continue;
      const activation = this.#activate(currentEvent, 'action', safeTime);
      if (activation) {
        activatedIds.push(activation.eventId);
        activatedIds.push(...this.#completeForEvent(currentEvent.id, safeTime));
      }
    }
    return immutableCopy(activatedIds, 'action activations');
  }

  onPlan({ selections, tSec } = {}) {
    requirePlainObject(selections, 'selections');
    const copiedSelections = copyCaseData(selections, 'plan selections');
    const safeTime = this.#validatedTime(tSec);
    this.#commitTime(safeTime);
    if (!this.#entered || this.#paused) return immutableCopy([], 'plan activations');
    this.#expireResponseWindows(safeTime);

    const activatedIds = [];
    const startingPhaseId = this.#currentPhaseId;
    for (const eventId of this.#currentPhase().events) {
      if (this.#currentPhaseId !== startingPhaseId) break;
      const currentEvent = this.#eventsById.get(eventId);
      if (currentEvent.trigger.type !== 'plan') continue;
      if (!Object.hasOwn(copiedSelections, currentEvent.trigger.fieldId)
        || !equalPlanTriggerValue(
          copiedSelections[currentEvent.trigger.fieldId],
          currentEvent.trigger.equals,
        )) continue;
      const activation = this.#activate(currentEvent, 'plan', safeTime);
      if (activation) {
        activatedIds.push(activation.eventId);
        activatedIds.push(...this.#completeForEvent(currentEvent.id, safeTime));
      }
    }
    if (this.#currentPhaseId === startingPhaseId) {
      activatedIds.push(...this.#completeForPlan(safeTime));
    }
    return immutableCopy(activatedIds, 'plan activations');
  }

  advancePhase({ tSec } = {}) {
    const safeTime = this.#validatedTime(tSec);
    if (!this.#entered) return failure('NOT_ENTERED');
    if (this.#paused) return failure('PAUSED');
    if (!this.#currentPhase().allowedInstructorControls.includes('advance')) {
      return failure('CONTROL_NOT_ALLOWED');
    }
    const nextPhaseId = this.#nextPhaseId();
    if (nextPhaseId === null) return failure('NO_NEXT_PHASE');
    this.#commitTime(safeTime);
    this.#expireResponseWindows(safeTime);
    const fromPhaseId = this.#currentPhaseId;
    this.#appendHistory({
      kind: 'phase_advanced',
      fromPhaseId,
      toPhaseId: nextPhaseId,
      phaseId: nextPhaseId,
      tSec: safeTime,
    });
    const activations = this.#enterPhase(nextPhaseId, safeTime, 'instructor_advance');
    return success({
      phaseId: this.#currentPhaseId,
      targetPhaseId: nextPhaseId,
      activations,
    });
  }

  activateBranch({ branchId, tSec } = {}) {
    requireNonemptyString(branchId, 'branchId');
    const safeTime = this.#validatedTime(tSec);
    if (!this.#entered) return failure('NOT_ENTERED');
    if (this.#paused) return failure('PAUSED');
    const branch = this.#branchesById.get(branchId);
    if (!branch) return failure('UNKNOWN_BRANCH');
    if (!this.#currentPhase().allowedInstructorControls.includes('activate_branch')) {
      return failure('CONTROL_NOT_ALLOWED');
    }
    if (branch.fromPhaseId !== this.#currentPhaseId) return failure('BRANCH_NOT_AVAILABLE');
    this.#commitTime(safeTime);
    this.#expireResponseWindows(safeTime);
    const fromPhaseId = this.#currentPhaseId;
    this.#appendHistory({
      kind: 'branch_activated',
      branchId: branch.id,
      fromPhaseId,
      toPhaseId: branch.toPhaseId,
      phaseId: branch.toPhaseId,
      tSec: safeTime,
    });
    const activations = this.#enterPhase(branch.toPhaseId, safeTime, `branch:${branch.id}`);
    return success({
      phaseId: this.#currentPhaseId,
      targetPhaseId: branch.toPhaseId,
      activations,
    });
  }

  setPaused({ paused, tSec } = {}) {
    if (typeof paused !== 'boolean') throw new TypeError('paused must be a boolean');
    const safeTime = this.#validatedTime(tSec);
    if (!this.#entered) return failure('NOT_ENTERED');
    if (paused === this.#paused) return failure(paused ? 'ALREADY_PAUSED' : 'NOT_PAUSED');
    const requiredControl = paused ? 'pause' : 'resume';
    if (!this.#currentPhase().allowedInstructorControls.includes(requiredControl)) {
      return failure('CONTROL_NOT_ALLOWED');
    }
    this.#commitTime(safeTime);
    if (paused) {
      this.#expireResponseWindows(safeTime);
      this.#paused = true;
      this.#pauseStartedAtSec = safeTime;
      this.#appendHistory({
        kind: 'flow_paused', phaseId: this.#currentPhaseId, tSec: safeTime,
      });
    } else {
      const pausedDurationSec = safeTime - this.#pauseStartedAtSec;
      for (const [activationSequence, deadline] of this.#responseDeadlines.entries()) {
        this.#responseDeadlines.set(activationSequence, immutableCopy({
          ...deadline,
          responseDeadlineSec: normalizeFixedStepTime(
            deadline.responseDeadlineSec + pausedDurationSec,
            'response deadline',
          ),
        }, 'case response deadline'));
      }
      this.#totalPausedSec += pausedDurationSec;
      this.#paused = false;
      this.#pauseStartedAtSec = null;
      this.#appendHistory({
        kind: 'flow_resumed', phaseId: this.#currentPhaseId, tSec: safeTime,
      });
    }
    return success({ paused: this.#paused });
  }

  drainActivations() {
    const drained = immutableCopy(this.#pendingActivations, 'drained case activations');
    this.#pendingActivations = [];
    return drained;
  }

  getState() {
    const branchActivationPermitted = this.#entered
      && !this.#paused
      && this.#currentPhase().allowedInstructorControls.includes('activate_branch');
    const availableBranchIds = branchActivationPermitted
      ? this.#eventFlow.branches
        .filter(({ fromPhaseId }) => fromPhaseId === this.#currentPhaseId)
        .map(({ id }) => id)
      : [];
    // Instructor-fireable teaching beats for the current phase: an event whose
    // trigger is `instructor`, that has not already fired (unless repeatable),
    // when the phase permits activate_event and the flow is running. Mirrors
    // the guard in onAction(INSTRUCTOR_EVENT_ACTION) exactly.
    const eventActivationPermitted = this.#entered
      && !this.#paused
      && this.#currentPhase().allowedInstructorControls.includes('activate_event');
    const availableInstructorEventIds = eventActivationPermitted
      ? this.#currentPhase().events
        .map((eventId) => this.#eventsById.get(eventId))
        .filter((event) => event.trigger.type === 'instructor' && this.#canFire(event))
        .map((event) => event.id)
      : [];
    const responseDeadlines = [...this.#responseDeadlines.values()];
    return immutableCopy({
      currentPhaseId: this.#currentPhaseId,
      currentTimeSec: this.#latestTimeSec,
      paused: this.#paused,
      activeEventIds: [...this.#activeEventIds],
      availableBranchIds,
      availableInstructorEventIds,
      responseDeadlines,
      history: this.#history,
    }, 'case flow state');
  }
}
