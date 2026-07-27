import { deriveAlarms, formatMonitorSnapshot } from './liveSimModel.js';
import { createLiveSimTransport } from './liveSimTransport.js';
import { createWaveformRenderer } from './liveWaveformRenderer.js';

let latestSnapshot = null;
let currentSessionId = null;
let lastReceivedAt = 0;
let lastStateRequestAt = 0;
let silencedUntil = 0;
let activeAlarms = [];
let audioContext = null;
const acknowledged = new Set();
let waveformRenderer = createWaveformRenderer({ sampleRate: 100, seconds: 6 });
let lastWaveformFrame = 0;

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '00:00';
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return hours > 0
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function setConnection(label, state) {
  const element = document.getElementById('display-connection');
  if (!element) return;
  element.textContent = label;
  element.dataset.state = state;
}

function renderSnapshot(snapshot) {
  const model = formatMonitorSnapshot(snapshot);
  setText('display-patient', snapshot.patient || 'Live patient');
  setText('display-clock', formatTime(snapshot.t));
  setText('display-hr', model.hr);
  setText('display-sbp', model.sbp);
  setText('display-dbp', model.dbp);
  const bp = document.getElementById('display-bp');
  if (bp) {
    const label = model.sbp === '—' || model.dbp === '—'
      ? 'Blood pressure unavailable'
      : `Blood pressure ${model.sbp} over ${model.dbp} millimeters of mercury`;
    bp.setAttribute('aria-label', label);
  }
  setText('display-map', model.map);
  setText('display-spo2', model.spo2);
  setText('display-etco2', model.etco2);
  setText('display-rr', model.rr);
  setText('display-temp', model.temp);
  setText('display-tof', model.tof);
  setText('display-tof-ratio', model.tofRatio);
  setText('display-spontaneous-rr', model.spontaneousRR);
  setText('display-spontaneous-tv', model.spontaneousTV);
  setText('display-spontaneous-mv', model.spontaneousMV);
  setText('display-spontaneous-effort', model.spontaneousEffort);
  setText('display-airway', `${String(snapshot.airwayDevice || '—').toUpperCase()} · ${snapshot.forcedApnea ? 'FORCED APNEA ON' : 'FORCED APNEA OFF'}`);
  setText('display-vent-mode', model.ventMode);
  setText('display-machine-tv', model.tv);
  setText('display-machine-mv', model.mv);
  setText('display-ppeak', model.ppeak);
  setText('display-fio2', model.fio2);
  setText('display-set-tv', Number.isFinite(snapshot.ventSetTV) ? Math.round(snapshot.ventSetTV) : '—');
  setText('display-set-rr', Number.isFinite(snapshot.ventSetRR) ? Math.round(snapshot.ventSetRR) : '—');
  setText('display-peep', Number.isFinite(snapshot.ventSetPeep) ? Math.round(snapshot.ventSetPeep) : '—');
  setText('display-set-pressure', Number.isFinite(snapshot.ventSetPressure) ? Math.round(snapshot.ventSetPressure) : '—');
  setText('display-pressure-support', Number.isFinite(snapshot.ventSetPressureSupport) ? Math.round(snapshot.ventSetPressureSupport) : '—');
  setText('display-vaporizer', `${model.vaporizerAgent} ${model.vaporizer}%`);
  renderAlarms(snapshot);
}

function renderAlarms(snapshot) {
  activeAlarms = deriveAlarms(snapshot);
  const activeIds = new Set(activeAlarms.map((alarm) => alarm.id));
  for (const id of acknowledged) {
    if (!activeIds.has(id)) acknowledged.delete(id);
  }

  const list = document.getElementById('display-alarm-list');
  if (!list) return;
  if (activeAlarms.length === 0) {
    setText('display-alarm-heading', 'No active alarms');
    list.innerHTML = '<p>All received values within display thresholds.</p>';
    return;
  }

  const unacknowledged = activeAlarms.filter((alarm) => !acknowledged.has(alarm.id));
  setText('display-alarm-heading', `${unacknowledged.length} unacknowledged · ${activeAlarms.length} active`);
  list.innerHTML = activeAlarms.map((alarm) => `
    <div class="display-alarm" data-severity="${alarm.severity}" data-acknowledged="${acknowledged.has(alarm.id)}">
      <strong>${alarm.label}</strong><span>${Number(alarm.value).toFixed(1)}</span><small>${acknowledged.has(alarm.id) ? 'ACKNOWLEDGED' : 'ACTIVE'}</small>
    </div>`).join('');
}

let currentBriefKey = null;

function el(tag, text, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderBrief(brief) {
  const panel = document.getElementById('display-case-brief');
  if (!panel) return;
  // A rubric-only scenario (no case) clears the brief.
  if (!brief || typeof brief !== 'object') {
    panel.hidden = true;
    currentBriefKey = null;
    return;
  }
  // Re-render only when the brief actually changes (it is static per case).
  const key = JSON.stringify(brief);
  if (key === currentBriefKey) { panel.hidden = false; return; }
  currentBriefKey = key;
  panel.hidden = false;

  const patient = brief.patient ?? {};
  const proc = brief.scheduledProcedure ?? {};
  setText('display-brief-patient', patient.syntheticName || 'Case patient');

  const demo = document.getElementById('display-brief-demographics');
  if (demo) {
    demo.replaceChildren();
    const rows = [
      ['MRN', patient.mrn],
      ['Age', Number.isFinite(patient.ageYears) ? `${patient.ageYears} yr` : patient.ageYears],
      ['Sex', patient.sex],
      ['Procedure', proc.name],
      ['Site', [proc.site, proc.laterality && proc.laterality !== 'none' ? `(${proc.laterality})` : ''].filter(Boolean).join(' ')],
    ];
    for (const [label, value] of rows) {
      if (value === undefined || value === null || value === '') continue;
      const div = el('div');
      div.append(el('dt', label), el('dd', String(value)));
      demo.append(div);
    }
  }

  const docs = document.getElementById('display-brief-documents');
  if (docs) {
    docs.replaceChildren();
    for (const doc of Array.isArray(brief.documents) ? brief.documents : []) {
      const article = el('article', undefined, 'display-brief-doc');
      article.append(el('h4', doc.title || doc.id || 'Note'));
      for (const section of Array.isArray(doc.sections) ? doc.sections : []) {
        if (section?.heading) article.append(el('strong', section.heading));
        if (section?.text) article.append(el('p', section.text));
      }
      docs.append(article);
    }
    if (!docs.childNodes.length) docs.append(el('p', 'No chart notes.'));
  }

  const listInto = (id, items, format) => {
    const ul = document.getElementById(id);
    if (!ul) return;
    ul.replaceChildren();
    const rows = (Array.isArray(items) ? items : []).map(format).filter(Boolean);
    if (!rows.length) { ul.append(el('li', '—')); return; }
    for (const row of rows) ul.append(el('li', row));
  };
  listInto('display-brief-medications', brief.medications, (m) => [m.name, m.dose, m.route, m.frequency].filter(Boolean).join(' · '));
  listInto('display-brief-allergies', brief.allergies, (a) => [a.substance, a.reaction ? `(${a.reaction})` : ''].filter(Boolean).join(' '));
  listInto('display-brief-labs', brief.labs, (l) => [l.name ?? l.label, l.value, l.unit].filter(Boolean).join(' '));
}

function onTransportMessage(message) {
  if (message.type !== 'snapshot') return;
  if (message.sessionChanged) {
    acknowledged.clear();
    waveformRenderer = createWaveformRenderer({ sampleRate: 100, seconds: 6 });
    lastWaveformFrame = 0;
    currentBriefKey = null;
  }
  currentSessionId = message.sessionId;
  latestSnapshot = message.payload;
  lastReceivedAt = Date.now();
  setConnection(`LIVE · ${currentSessionId.slice(-8)}`, 'live');
  renderSnapshot(latestSnapshot);
  renderBrief(message.brief ?? null);
}

function ensureCanvas(canvas) {
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { context, width: rect.width, height: rect.height };
}

function drawGrid(context, width, height) {
  context.clearRect(0, 0, width, height);
  context.strokeStyle = 'rgba(90, 111, 138, .12)';
  context.lineWidth = 1;
  for (let x = 0; x < width; x += 32) {
    context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
  }
  for (let y = 0; y < height; y += 24) {
    context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
  }
}

// RENDERING ONLY: these rolling samples are visual synthesis from received
// numerics. They are not physiology and never feed a value back to the engine.
function drawTrace(canvas, color, samples, capacity, baseline = 'bottom') {
  const dimensions = ensureCanvas(canvas);
  if (!dimensions) return;
  const { context, width, height } = dimensions;
  drawGrid(context, width, height);
  if (samples.length === 0) return;
  context.strokeStyle = color;
  context.lineWidth = 2;
  context.shadowBlur = 8;
  context.shadowColor = color;
  context.beginPath();
  const padding = Math.min(10, Math.max(4, height * 0.08));
  const denominator = Math.max(1, capacity - 1);
  for (let index = 0; index < samples.length; index += 1) {
    const x = width - (samples.length - 1 - index) / denominator * width;
    const value = Math.max(-1, Math.min(1, samples[index]));
    const y = baseline === 'center'
      ? height / 2 - value * (height / 2 - padding)
      : height - padding - Math.max(0, value) * (height - padding * 2);
    const clampedY = Math.max(padding, Math.min(height - padding, y));
    if (index === 0) context.moveTo(x, clampedY); else context.lineTo(x, clampedY);
  }
  context.stroke();
  context.shadowBlur = 0;
}

function drawWaveforms(now) {
  const elapsedSeconds = lastWaveformFrame > 0 ? (now - lastWaveformFrame) / 1000 : 0;
  lastWaveformFrame = now;
  waveformRenderer.advance(elapsedSeconds, latestSnapshot || {});
  const history = waveformRenderer.snapshot();

  drawTrace(document.getElementById('display-ecg'), '#00ffa3', history.ecg, history.capacity, 'center');
  drawTrace(document.getElementById('display-pleth'), '#5b9eff', history.pleth, history.capacity);
  drawTrace(document.getElementById('display-capnogram'), '#ffb000', history.co2, history.capacity);
  requestAnimationFrame(drawWaveforms);
}

function enableAudio() {
  const AudioContextImpl = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextImpl) {
    setText('display-audio', 'AUDIO UNAVAILABLE');
    return;
  }
  audioContext ||= new AudioContextImpl();
  audioContext.resume();
  setText('display-audio', 'ALARM AUDIO ON');
}

// RENDERING ONLY: alarm tone communicates display thresholds; it is not a
// physiologic signal and does not alter received state.
function playAlarmTone() {
  if (!audioContext || Date.now() < silencedUntil) return;
  if (!activeAlarms.some((alarm) => !acknowledged.has(alarm.id))) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.frequency.value = 880;
  gain.gain.setValueAtTime(.035, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .16);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + .16);
}

const transport = (() => {
  try {
    return createLiveSimTransport({ role: 'display' });
  } catch (error) {
    setConnection(`SYNC ERROR · ${error.message}`, 'error');
    return null;
  }
})();

transport?.subscribe(onTransportMessage);
transport?.requestState();

document.getElementById('display-fullscreen')?.addEventListener('click', () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
});
document.getElementById('display-audio')?.addEventListener('click', enableAudio);
document.getElementById('display-brief-toggle')?.addEventListener('click', (event) => {
  const body = document.getElementById('display-brief-body');
  if (!body) return;
  const collapsed = body.hidden = !body.hidden;
  event.target.textContent = collapsed ? 'SHOW BRIEF' : 'HIDE BRIEF';
  event.target.setAttribute('aria-expanded', String(!collapsed));
});
document.getElementById('display-acknowledge')?.addEventListener('click', () => {
  activeAlarms.forEach((alarm) => acknowledged.add(alarm.id));
  if (latestSnapshot) renderAlarms(latestSnapshot);
});
document.getElementById('display-silence')?.addEventListener('click', () => {
  silencedUntil = Date.now() + 120000;
  setText('display-silence', 'SILENCED 2 MIN');
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') transport?.requestState();
});
window.addEventListener('beforeunload', () => transport?.close());

setInterval(() => {
  const now = Date.now();
  const snapshotAge = lastReceivedAt > 0 ? now - lastReceivedAt : 0;
  if (snapshotAge > 3000 && now - lastStateRequestAt > 3000) {
    lastStateRequestAt = now;
    transport?.requestState();
  }
  if (snapshotAge > 10000) setConnection('STALE · REQUESTING STATE', 'stale');
  if (Date.now() >= silencedUntil) setText('display-silence', 'SILENCE 2 MIN');
  playAlarmTone();
}, 1000);

requestAnimationFrame(drawWaveforms);
