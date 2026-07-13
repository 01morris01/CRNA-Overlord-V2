export const LIVE_SIM_CHANNEL = 'crna-overlord-live-sim-v1';
export const LIVE_SIM_PROTOCOL = 1;

function makeId(prefix) {
  const randomId = globalThis.crypto?.randomUUID?.()
    || `${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
  return `${prefix}-${randomId}`;
}

export function createLiveSimTransport({
  role,
  BroadcastChannelImpl = globalThis.BroadcastChannel,
  channelName = LIVE_SIM_CHANNEL,
  sessionId = role === 'instructor' ? makeId('instructor') : null,
  sessionStartedAt = Date.now(),
} = {}) {
  if (!['instructor', 'display'].includes(role)) {
    throw new TypeError('role must be instructor or display');
  }
  if (typeof BroadcastChannelImpl !== 'function') {
    throw new Error('BroadcastChannel is unavailable in this browser');
  }

  const channel = new BroadcastChannelImpl(channelName);
  const subscribers = new Set();
  let closed = false;
  let sequence = 0;
  let currentEnvelope = null;
  let receivedSessionId = null;
  let receivedSessionStartedAt = -Infinity;
  let receivedSequence = 0;

  function assertOpen() {
    if (closed) throw new Error('Live simulation transport is closed');
  }

  function post(message) {
    assertOpen();
    channel.postMessage({ protocol: LIVE_SIM_PROTOCOL, ...message });
  }

  function notify(message) {
    for (const subscriber of subscribers) subscriber(message);
  }

  function publishPayload(payload) {
    sequence += 1;
    currentEnvelope = {
      type: 'snapshot', sessionId, sessionStartedAt, sequence, payload,
    };
    post(currentEnvelope);
    return sequence;
  }

  function receiveSnapshot(message) {
    const incomingStartedAt = Number(message.sessionStartedAt);
    const incomingSequence = Number(message.sequence);
    if (!message.sessionId || !Number.isFinite(incomingStartedAt) || !Number.isFinite(incomingSequence)) return;

    let sessionChanged = false;
    if (receivedSessionId === null) {
      receivedSessionId = message.sessionId;
      receivedSessionStartedAt = incomingStartedAt;
      receivedSequence = 0;
    } else if (message.sessionId !== receivedSessionId) {
      if (incomingStartedAt < receivedSessionStartedAt) return;
      receivedSessionId = message.sessionId;
      receivedSessionStartedAt = incomingStartedAt;
      receivedSequence = 0;
      sessionChanged = true;
    }

    if (incomingSequence <= receivedSequence) return;
    receivedSequence = incomingSequence;
    notify({ ...message, sessionChanged });
  }

  function onMessage(event) {
    const message = event?.data;
    if (!message || message.protocol !== LIVE_SIM_PROTOCOL) return;

    if (message.type === 'state-request' && role === 'instructor' && currentEnvelope) {
      publishPayload(currentEnvelope.payload);
      return;
    }
    if (message.type === 'snapshot' && role === 'display') receiveSnapshot(message);
  }

  channel.addEventListener('message', onMessage);

  return Object.freeze({
    role,
    sessionId,

    publishSnapshot(payload) {
      assertOpen();
      if (role !== 'instructor') throw new Error('Only the instructor can publish snapshots');
      return publishPayload(payload);
    },

    requestState() {
      if (role !== 'display') throw new Error('Only a display can request state');
      post({ type: 'state-request', requestId: makeId('request') });
    },

    subscribe(subscriber) {
      assertOpen();
      if (typeof subscriber !== 'function') throw new TypeError('subscriber must be a function');
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },

    close() {
      if (closed) return;
      closed = true;
      subscribers.clear();
      channel.removeEventListener('message', onMessage);
      channel.close();
    },
  });
}
