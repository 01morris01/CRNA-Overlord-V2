/* Student screen <-> instructor console link.

   Same browser, separate windows (the usual sim lab: one computer, two
   monitors), over BroadcastChannel, like the monitor display. Messages are
   validated and size capped on receipt; anything malformed is dropped.

   student -> console
     student-hello                       a student screen opened
     student-load    { patientId }       student picked a Mock OR patient
     student-plan    { patientId }       care plan submitted (record is in localStorage)
     student-booth   { id, text }        student talked to Booth
     student-state   { patientId, step, questions, planSubmitted, percent }  progress mirror
   console -> student
     console-state   { patientId, lifecycle, simTimeSec }   heartbeat
     booth-reply     { replyTo, text }   Booth's answer, spoken on the student screen
     instructor-advance { patientId, step }  instructor moved the student; the
                                         filled in work is already in shared storage

   The private note to the instructor never crosses this channel. */

export const STUDENT_CHANNEL = 'crna-overlord-student-v1';
export const STUDENT_PROTOCOL = 1;
export const STUDENT_SESSION_KEY = 'overlord.student.session.v1';
export const MAX_TEXT = 500;

const PATIENT_ID = /^p\d{2}$/;
export const WORKFLOW_STEPS = Object.freeze(['patient', 'chart', 'interview', 'plan', 'grade', 'or']);

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
    case 'student-state':
      return {
        type: 'student-state',
        patientId: PATIENT_ID.test(message.patientId ?? '') ? message.patientId : null,
        step: WORKFLOW_STEPS.includes(message.step) ? message.step : 'patient',
        questions: Number.isInteger(message.questions) ? Math.max(0, Math.min(999, message.questions)) : 0,
        planSubmitted: Boolean(message.planSubmitted),
        percent: Number.isFinite(message.percent) ? Math.max(0, Math.min(100, Math.round(message.percent))) : null,
      };
    case 'instructor-advance':
      return PATIENT_ID.test(message.patientId ?? '') && WORKFLOW_STEPS.includes(message.step)
        ? { type: 'instructor-advance', patientId: message.patientId, step: message.step }
        : null;
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
    ? new Set(['student-hello', 'student-load', 'student-plan', 'student-booth', 'student-state'])
    : new Set(['console-state', 'booth-reply', 'instructor-advance']);
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

/* Opens (or brings back) a named window. On a laptop with a second screen,
   Chrome's window management permission lets it land on the other screen;
   without it the window opens normally and can be dragged over. The window
   is opened synchronously so popup blockers see the click. */
export function openWindowOnOtherScreen(url, name, host = globalThis.window) {
  const win = host?.open?.(url, name, 'popup,width=1400,height=900');
  if (!win) return null;
  try { win.focus(); } catch { /* ignore */ }
  if (typeof host.getScreenDetails === 'function') {
    host.getScreenDetails().then((details) => {
      const other = details.screens.find((screen) => screen !== details.currentScreen);
      if (!other) return;
      win.moveTo(other.availLeft, other.availTop);
      win.resizeTo(other.availWidth, other.availHeight);
    }).catch(() => { /* permission declined: stays where it opened */ });
  }
  return win;
}
