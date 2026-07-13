import { deriveAlarms, formatMonitorSnapshot } from './liveSimModel.js';
import { createLiveSimTransport } from './liveSimTransport.js';

let latestSnapshot = null;
let currentSessionId = null;
let lastReceivedAt = 0;
let lastStateRequestAt = 0;
let silencedUntil = 0;
let activeAlarms = [];
let audioContext = null;
const acknowledged = new Set();

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
  setText('display-bp', model.bp);
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

function onTransportMessage(message) {
  if (message.type !== 'snapshot') return;
  if (message.sessionChanged) acknowledged.clear();
  currentSessionId = message.sessionId;
  latestSnapshot = message.payload;
  lastReceivedAt = Date.now();
  setConnection(`LIVE · ${currentSessionId.slice(-8)}`, 'live');
  renderSnapshot(latestSnapshot);
}

function ensureCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const context = canvas.getContext('2d');
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

function ecgMorphology(phase) {
  if (phase < .12) return Math.sin(phase / .12 * Math.PI) * .1;
  if (phase < .18) return -.12 * Math.sin((phase - .12) / .06 * Math.PI);
  if (phase < .205) return (phase - .18) / .025 * 1.05;
  if (phase < .235) return 1.05 - (phase - .205) / .03 * 1.55;
  if (phase < .29) return -.5 + (phase - .235) / .055 * .5;
  if (phase < .5) return Math.sin((phase - .29) / .21 * Math.PI) * .24;
  return 0;
}

function plethMorphology(phase) {
  if (phase < .16) return (phase / .16) ** 2;
  const decay = Math.exp(-(phase - .16) * 4.2);
  const notch = phase > .38 && phase < .48 ? -.09 * Math.sin((phase - .38) / .1 * Math.PI) : 0;
  return Math.max(0, decay + notch);
}

function capnoMorphology(phase) {
  if (phase < .12) return 0;
  if (phase < .2) return (phase - .12) / .08;
  if (phase < .55) return .9 + (phase - .2) / .35 * .1;
  if (phase < .66) return 1 - (phase - .55) / .11;
  return 0;
}

// RENDERING ONLY: waveform morphology below is visual synthesis from received
// numerics. It is not physiology and never feeds a value back to the engine.
function drawTrace(canvas, color, valueAt, now) {
  const { context, width, height } = ensureCanvas(canvas);
  drawGrid(context, width, height);
  context.strokeStyle = color;
  context.lineWidth = 2;
  context.shadowBlur = 8;
  context.shadowColor = color;
  context.beginPath();
  for (let x = 0; x <= width; x += 2) {
    const time = now - (width - x) * 10;
    const value = valueAt(time);
    const y = height * .78 - value * height * .58;
    if (x === 0) context.moveTo(x, y); else context.lineTo(x, y);
  }
  context.stroke();
  context.shadowBlur = 0;
}

function drawWaveforms(now) {
  const snapshot = latestSnapshot;
  const heartRate = Number.isFinite(snapshot?.hr) ? Math.max(1, snapshot.hr) : 0;
  const respiratoryRate = Number.isFinite(snapshot?.rr) ? Math.max(1, snapshot.rr) : 0;
  const oxygenScale = Number.isFinite(snapshot?.spo2) ? Math.max(.25, snapshot.spo2 / 100) : 0;
  const co2Scale = Number.isFinite(snapshot?.etco2) ? Math.max(.15, snapshot.etco2 / 50) : 0;

  drawTrace(document.getElementById('display-ecg'), '#00ffa3', (time) => {
    if (!Number.isFinite(snapshot?.hr)) return 0;
    const phase = ((time / 1000) * heartRate / 60) % 1;
    return ecgMorphology(phase);
  }, now);
  drawTrace(document.getElementById('display-pleth'), '#5b9eff', (time) => {
    if (!Number.isFinite(snapshot?.hr) || !Number.isFinite(snapshot?.spo2)) return 0;
    const phase = ((time / 1000) * heartRate / 60) % 1;
    return plethMorphology(phase) * oxygenScale;
  }, now);
  drawTrace(document.getElementById('display-capnogram'), '#ffb000', (time) => {
    if (snapshot?.capnogramPresent !== true || !Number.isFinite(snapshot?.rr) || !Number.isFinite(snapshot?.etco2)) return 0;
    const phase = ((time / 1000) * respiratoryRate / 60) % 1;
    return capnoMorphology(phase) * co2Scale;
  }, now);
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
