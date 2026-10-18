/* Student screen <-> instructor console link.

   Same browser, separate windows (the usual sim lab: one computer, two
   monitors), over BroadcastChannel, like the monitor display. Messages are
   validated and size capped on receipt; anything malformed is dropped.

   student -> console
     student-hello                       a student screen opened
     student-load    { patientId }       student picked a Mock OR patient
     student-plan    { patientId }       care plan submitted (record is in localStorage)
     student-booth   { id, text }        student talked to Booth
   console -> student
     console-state   { patientId, lifecycle, simTimeSec }   heartbeat
     booth-reply     { replyTo, text }   Booth's answer, spoken on the student screen

   The private note to the instructor never crosses this channel. */

export const STUDENT_CHANNEL = 'crna-overlord-student-v1';
export const STUDENT_PROTOCOL = 1;
export const STUDENT_SESSION_KEY = 'overlord.student.session.v1';
export const MAX_TEXT = 500;

const PATIENT_ID = /^p\d{2}$/;

function str(value, max = MAX_TEXT) {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

/* Returns a clean message or null. */
export function sanitizeStudentMessage(message) {
  if (!message || typeof message !== 'object' || message.protocol !== STUDENT_PROTOCOL) return null;
  switch (message.type) {
    case 'student-hello':
      return { type: 'student-hello' };
    case 'student-load':
    case 'student-plan':
      return PATIENT_ID.test(message.patientId ?? '') ? { type: message.type, patientId: message.patientId } : null;
    case 'student-booth': {
      const text = str(message.text).trim();
      const id = str(message.id, 64);
      return text && id ? { type: 'student-booth', id, text } : null;
    }
    case 'console-state':
      return {
        type: 'console-state',
        patientId: PATIENT_ID.test(message.patientId ?? '') ? message.patientId : null,
        lifecycle: str(message.lifecycle, 24) || null,
        simTimeSec: Number.isFinite(message.simTimeSec) ? message.simTimeSec : null,
      };
    case 'booth-reply': {
      const text = str(message.text).trim();
      const replyTo = str(message.replyTo, 64);
      return text && replyTo ? { type: 'booth-reply', replyTo, text } : null;
    }
    default:
      return null;
  }
}

export function createStudentChannel({
  role,
  BroadcastChannelImpl = globalThis.BroadcastChannel,
  channelName = STUDENT_CHANNEL,
} = {}) {
  if (!['student', 'console'].includes(role)) throw new TypeError('role must be student or console');
  if (typeof BroadcastChannelImpl !== 'function') return null;
  const channel = new BroadcastChannelImpl(channelName);
  const listeners = new Set();
  const accepts = role === 'console'
    ? new Set(['student-hello', 'student-load', 'student-plan', 'student-booth'])
    : new Set(['console-state', 'booth-reply']);
  let closed = false;

  function onMessage(event) {
    const clean = sanitizeStudentMessage(event?.data);
    if (!clean || !accepts.has(clean.type)) return;
    for (const listener of listeners) listener(clean);
  }
  channel.addEventListener('message', onMessage);

  return {
    role,
    post(message) {
      if (closed) return false;
      const clean = sanitizeStudentMessage({ protocol: STUDENT_PROTOCOL, ...message });
      if (!clean) return false;
      channel.postMessage({ protocol: STUDENT_PROTOCOL, ...clean });
      return true;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    close() {
      if (closed) return;
      closed = true;
      listeners.clear();
      channel.removeEventListener('message', onMessage);
      channel.close();
    },
  };
}

export function readStudentSession(storage) {
  try {
    const raw = storage?.getItem?.(STUDENT_SESSION_KEY);
    const data = raw ? JSON.parse(raw) : null;
    return data && PATIENT_ID.test(data.patientId ?? '') ? data : null;
  } catch { return null; }
}

export function writeStudentSession(storage, session) {
  try { storage?.setItem?.(STUDENT_SESSION_KEY, JSON.stringify(session)); return true; } catch { return false; }
}
