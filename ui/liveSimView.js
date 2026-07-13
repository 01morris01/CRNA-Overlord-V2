import {
  DEFAULT_CONFIG, SimRunner, VentMode, ventName,
} from '../crisis-sim/ui/simRunner.js';
import {
  COMPLICATION_OPTIONS,
  computeDrugDose,
  DRUG_ACTIONS,
  formatMonitorSnapshot,
  parsePatientConfig,
  PATIENT_PRESETS,
  validateSimulationResult,
} from './liveSimModel.js';
import { createLiveSimTransport } from './liveSimTransport.js';

let initialized = false;
let runner = null;
let transport = null;
let latestSnapshot = null;
let view = null;
let launchSource = null;
let launchObserver = null;
let courseSelectorDisplay = null;

const patientFields = [
  ['weightKg', 'Weight', 'kg', 1],
  ['heightCm', 'Height', 'cm', 1],
  ['ageYears', 'Age', 'years', 1],
  ['baselineHR', 'Baseline HR', 'bpm', 1],
  ['baselineSystolic', 'Baseline SBP', 'mmHg', 1],
  ['baselineDiastolic', 'Baseline DBP', 'mmHg', 1],
  ['baselineSpO2', 'Baseline SpO₂', '%', 1],
  ['baselineRR', 'Baseline RR', '/min', 1],
  ['baselineTemp', 'Baseline temp', '°C', 0.1],
  ['baselineEtCO2', 'Baseline EtCO₂', 'mmHg', 1],
];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
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

function fieldMarkup([name, label, unit, step]) {
  return `
    <label class="live-field" for="live-patient-${name}">
      <span>${label}</span>
      <span class="live-input-unit"><input id="live-patient-${name}" name="${name}" type="number" step="${step}" required><small>${unit}</small></span>
    </label>`;
}

function drugMarkup(group) {
  return DRUG_ACTIONS.filter((action) => action.group === group).map((action) => `
    <button class="live-dose-button" type="button" data-drug-action="${action.id}">
      <span>${escapeHtml(action.label)}</span>
      <small data-dose-preview="${action.id}">total — mg</small>
    </button>`).join('');
}

function complicationMarkup() {
  return COMPLICATION_OPTIONS.map((type) => `
    <button type="button" class="live-complication-button" data-complication="${type}">${escapeHtml(type.replaceAll(/([a-z])([A-Z])/g, '$1 $2'))}</button>
  `).join('');
}

function renderShell() {
  view.innerHTML = `
    <div class="live-education-fence" role="note">Educational simulation. Not for clinical use.</div>
    <header class="live-sim-header">
      <div>
        <p class="live-eyebrow">INSTRUCTOR CONSOLE</p>
        <h1>Live Anesthesia Simulation</h1>
        <p id="live-case-state" class="live-case-state">READY · 1×</p>
      </div>
      <div class="live-header-actions">
        <output id="live-sim-clock" class="live-sim-clock" aria-label="Simulation time">00:00</output>
        <button id="live-open-display" type="button">OPEN DISPLAY</button>
        <button id="live-close" type="button" class="live-secondary">BACK TO MAP</button>
      </div>
    </header>

    <div class="live-vitals" aria-label="Current engine-derived vitals">
      <div><span>HR</span><strong id="live-vital-hr">—</strong><small>bpm</small></div>
      <div><span>BP</span><strong id="live-vital-bp">—</strong><small>mmHg</small></div>
      <div><span>MAP</span><strong id="live-vital-map">—</strong><small>mmHg</small></div>
      <div><span>SpO₂</span><strong id="live-vital-spo2">—</strong><small>%</small></div>
      <div><span>EtCO₂</span><strong id="live-vital-etco2">—</strong><small>mmHg</small></div>
      <div><span>TOF</span><strong id="live-vital-tof">—</strong><small id="live-vital-tof-ratio">ratio —</small></div>
    </div>

    <div id="live-action-status" class="live-action-status" role="status" aria-live="polite">Controls ready.</div>

    <div class="live-sim-grid">
      <div class="live-sim-column">
        <section class="live-panel" aria-labelledby="live-case-heading">
          <h2 id="live-case-heading">Case flow</h2>
          <div class="live-button-row">
            <button id="live-start" type="button" class="live-primary">START</button>
            <button id="live-pause" type="button">PAUSE</button>
            <button id="live-reset" type="button" class="live-danger-outline">RESET</button>
          </div>
          <label class="live-field" for="live-speed"><span>Simulation speed</span>
            <select id="live-speed"><option value="1">1×</option><option value="5">5×</option><option value="20">20×</option><option value="100">100×</option></select>
          </label>
          <button id="live-preoxygenate" type="button">PREOXYGENATE · 100% O₂</button>
          <button id="live-export" type="button">END CASE + EXPORT DEBRIEF</button>
        </section>

        <section class="live-panel" aria-labelledby="live-patient-heading">
          <h2 id="live-patient-heading">Patient setup</h2>
          <p class="live-help">Applying setup rebuilds and resets the verified runner.</p>
          <label class="live-field" for="live-patient-preset"><span>Supported preset</span>
            <select id="live-patient-preset"><option value="">Custom</option>${PATIENT_PRESETS.map((preset) => `<option value="${preset.id}">${escapeHtml(preset.label)}</option>`).join('')}</select>
          </label>
          <form id="live-patient-form" class="live-form-grid" novalidate>
            ${patientFields.map(fieldMarkup).join('')}
            <label class="live-field" for="live-patient-sex"><span>Sex</span><select id="live-patient-sex" name="sex"><option>Male</option><option>Female</option></select></label>
            <button type="submit" class="live-primary live-form-submit">APPLY + RESET PATIENT</button>
          </form>
        </section>

        <section class="live-panel" aria-labelledby="live-airway-heading">
          <h2 id="live-airway-heading">Airway + respiratory drive</h2>
          <div class="live-button-row">
            <button type="button" data-airway="mask">MASK</button>
            <button type="button" data-airway="intubated">INTUBATE</button>
            <button type="button" data-airway="extubated">EXTUBATE</button>
          </div>
          <label class="live-toggle" for="live-forced-apnea">
            <input id="live-forced-apnea" type="checkbox"><span>Forced apnea imposed</span>
          </label>
          <div class="live-drive-grid" aria-label="Engine respiratory drive contributions">
            <span>Forced <strong id="live-drive-forced">—</strong></span>
            <span>Drug <strong id="live-drive-drug">—</strong></span>
            <span>Complication <strong id="live-drive-complication">—</strong></span>
            <span>NMB capability <strong id="live-drive-muscle">—</strong></span>
          </div>
        </section>
      </div>

      <div class="live-sim-column live-sim-column-wide">
        <section class="live-panel" aria-labelledby="live-machine-heading">
          <h2 id="live-machine-heading">Anesthesia machine</h2>
          <form id="live-machine-form" class="live-machine-grid">
            <label class="live-field"><span>Mode</span><select name="mode"><option value="0">Manual/Bag</option><option value="1">VCV</option><option value="2">PCV</option><option value="3">PSV</option></select></label>
            <label class="live-field"><span>TV</span><span class="live-input-unit"><input name="setTidalVolume" type="number" value="500" min="100" max="1200"><small>mL</small></span></label>
            <label class="live-field"><span>RR</span><span class="live-input-unit"><input name="setRespiratoryRate" type="number" value="12" min="1" max="40"><small>/min</small></span></label>
            <label class="live-field"><span>PEEP</span><span class="live-input-unit"><input name="setPeep" type="number" value="5" min="0" max="30"><small>cmH₂O</small></span></label>
            <label class="live-field"><span>PC above PEEP</span><span class="live-input-unit"><input name="setPressureAbovePeep" type="number" value="15" min="1" max="50"><small>cmH₂O</small></span></label>
            <label class="live-field"><span>Pressure support</span><span class="live-input-unit"><input name="setPressureSupport" type="number" value="10" min="0" max="40"><small>cmH₂O</small></span></label>
            <label class="live-field"><span>FiO₂</span><span class="live-input-unit"><input name="setFiO2" type="number" value="1" min="0.21" max="1" step="0.01"><small>fraction</small></span></label>
            <label class="live-field"><span>O₂ flow</span><span class="live-input-unit"><input name="o2FlowLPerMin" type="number" value="2" min="0" max="15" step="0.1"><small>L/min</small></span></label>
            <label class="live-field"><span>Air flow</span><span class="live-input-unit"><input name="airFlowLPerMin" type="number" value="0" min="0" max="15" step="0.1"><small>L/min</small></span></label>
            <label class="live-field"><span>N₂O flow</span><span class="live-input-unit"><input name="n2oFlowLPerMin" type="number" value="0" min="0" max="15" step="0.1"><small>L/min</small></span></label>
            <label class="live-field"><span>Vaporizer agent</span><select name="vaporizerAgent"><option>Sevoflurane</option><option>Desflurane</option><option>Isoflurane</option></select></label>
            <label class="live-field"><span>Vaporizer dial</span><span class="live-input-unit"><input name="vaporizerDial" type="number" value="0" min="0" max="18" step="0.1"><small>%</small></span></label>
            <button type="submit" class="live-primary live-machine-submit">APPLY MACHINE SETTINGS</button>
          </form>
        </section>

        ${['Induction', 'Rescue', 'Emergence'].map((group) => `
          <section class="live-panel" aria-labelledby="live-${group.toLowerCase()}-heading">
            <h2 id="live-${group.toLowerCase()}-heading">${group} drugs</h2>
            <div class="live-dose-grid">${drugMarkup(group)}</div>
          </section>`).join('')}

        <section class="live-panel" aria-labelledby="live-complication-heading">
          <h2 id="live-complication-heading">Inject existing complication</h2>
          <p class="live-help">Delegates to the verified ScenarioManager state machine. Vitals remain derived.</p>
          <div class="live-complication-grid">${complicationMarkup()}</div>
        </section>
      </div>

      <aside class="live-panel live-event-panel" aria-labelledby="live-events-heading">
        <div class="live-event-header"><h2 id="live-events-heading">Event log</h2><span>sim time</span></div>
        <ol id="live-event-log" class="live-event-log"><li class="live-empty">No events yet.</li></ol>
      </aside>
    </div>`;
}

function setStatus(message, kind = 'info') {
  const status = document.getElementById('live-action-status');
  if (!status) return;
  status.textContent = message;
  status.dataset.kind = kind;
}

function fillPatientForm(config) {
  const form = document.getElementById('live-patient-form');
  if (!form) return;
  for (const [key, value] of Object.entries(config)) {
    const control = form.elements.namedItem(key);
    if (control) control.value = String(value);
  }
  updateDosePreviews(config.weightKg);
}

function updateDosePreviews(weightKg) {
  for (const action of DRUG_ACTIONS) {
    const preview = document.querySelector(`[data-dose-preview="${action.id}"]`);
    if (!preview) continue;
    try {
      const dose = computeDrugDose(action.id, Number(weightKg));
      preview.textContent = `total ${dose.totalMg.toLocaleString(undefined, { maximumFractionDigits: 3 })} mg`;
    } catch {
      preview.textContent = 'total — mg';
    }
  }
}

function renderEventLog() {
  const list = document.getElementById('live-event-log');
  if (!list || !runner) return;
  if (runner.log.length === 0) {
    list.innerHTML = '<li class="live-empty">No events yet.</li>';
    return;
  }
  list.innerHTML = runner.log.slice().reverse().map((entry) => `
    <li><time>${formatTime(entry.t)}</time><div><strong>${escapeHtml(entry.kind)}</strong><span>${escapeHtml(entry.detail)}</span></div></li>
  `).join('');
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function renderSnapshot(snapshot) {
  latestSnapshot = snapshot;
  const monitor = formatMonitorSnapshot(snapshot);
  setText('live-sim-clock', formatTime(snapshot.t));
  setText('live-case-state', `${snapshot.running ? 'RUNNING' : 'PAUSED'} · ${snapshot.speed}× · ${String(snapshot.airwayDevice).toUpperCase()}`);
  setText('live-vital-hr', monitor.hr);
  setText('live-vital-bp', monitor.bp);
  setText('live-vital-map', monitor.map);
  setText('live-vital-spo2', monitor.spo2);
  setText('live-vital-etco2', monitor.etco2);
  setText('live-vital-tof', monitor.tof);
  setText('live-vital-tof-ratio', `ratio ${monitor.tofRatio}`);
  setText('live-drive-forced', Number(snapshot.forcedApneaContribution).toFixed(2));
  setText('live-drive-drug', Number(snapshot.drugDepressionContribution).toFixed(2));
  setText('live-drive-complication', Number(snapshot.complicationDriveContribution).toFixed(2));
  setText('live-drive-muscle', Number(snapshot.respiratoryMuscleCapability).toFixed(2));
  const forcedApnea = document.getElementById('live-forced-apnea');
  if (forcedApnea) forcedApnea.checked = snapshot.forcedApnea;
  transport?.publishSnapshot(snapshot);
}

function ensureRunner() {
  if (runner) return runner;
  runner = new SimRunner();
  try {
    transport = createLiveSimTransport({ role: 'instructor' });
  } catch (error) {
    transport = null;
    setStatus(`Display sync unavailable: ${error.message}`, 'error');
  }
  runner.onTick = renderSnapshot;
  runner.onEvent = renderEventLog;
  runner.emit();
  fillPatientForm(runner.config);
  renderEventLog();
  return runner;
}

function handleAirway(next) {
  const liveRunner = ensureRunner();
  let result;
  if (next === 'intubated') result = liveRunner.intubate();
  else if (next === 'extubated') result = liveRunner.extubate();
  else result = liveRunner.setAirwayDevice('mask');

  if (!result.ok) {
    setStatus(result.reason, 'error');
    return;
  }
  if (next === 'mask' && result.changed) liveRunner.logEvent('Airway', 'Device → mask', { action: 'airway', device: 'mask' });
  setStatus(result.changed ? `Airway device: ${result.current}` : `Airway already ${result.current}`, 'success');
  liveRunner.emit();
}

function applyMachine(event) {
  event.preventDefault();
  const liveRunner = ensureRunner();
  const data = new FormData(event.currentTarget);
  const mode = Number(data.get('mode'));
  const patch = {
    setTidalVolume: Number(data.get('setTidalVolume')),
    setRespiratoryRate: Number(data.get('setRespiratoryRate')),
    setPeep: Number(data.get('setPeep')),
    setPressureAbovePeep: Number(data.get('setPressureAbovePeep')),
    setPressureSupport: Number(data.get('setPressureSupport')),
    setFiO2: Number(data.get('setFiO2')),
    o2FlowLPerMin: Number(data.get('o2FlowLPerMin')),
    airFlowLPerMin: Number(data.get('airFlowLPerMin')),
    n2oFlowLPerMin: Number(data.get('n2oFlowLPerMin')),
    vaporizerAgent: String(data.get('vaporizerAgent')),
    vaporizerDial: Number(data.get('vaporizerDial')),
  };
  if (Object.values(patch).some((value) => typeof value === 'number' && !Number.isFinite(value))) {
    setStatus('Machine settings must be finite numbers.', 'error');
    return;
  }
  liveRunner.setVentMode(mode);
  liveRunner.setMachine(patch);
  liveRunner.logEvent('Machine', `${ventName(mode)} · TV ${patch.setTidalVolume} · RR ${patch.setRespiratoryRate} · PEEP ${patch.setPeep}`);
  setStatus('Machine settings applied.', 'success');
  liveRunner.emit();
}

function applyPatient(event) {
  event.preventDefault();
  const form = event.currentTarget;
  try {
    const config = parsePatientConfig(Object.fromEntries(new FormData(form)));
    ensureRunner().applyConfig(config);
    updateDosePreviews(config.weightKg);
    setStatus('Patient applied; runner reset.', 'success');
    renderEventLog();
  } catch (error) {
    setStatus(error.message, 'error');
  }
}

function giveDrug(actionId) {
  const liveRunner = ensureRunner();
  try {
    const dose = computeDrugDose(actionId, liveRunner.config.weightKg);
    liveRunner.giveBolus(dose.drugName, dose.totalMg, `${dose.clinicalLabel} · ${dose.totalMg} mg total`);
    setStatus(`${dose.drugName}: ${dose.totalMg} mg total given.`, 'success');
  } catch (error) {
    setStatus(error.message, 'error');
  }
}

function downloadDebrief() {
  const liveRunner = ensureRunner();
  liveRunner.pause();
  liveRunner.logEvent('Case', 'Ended for debrief export', { action: 'end_case' });
  const result = liveRunner.buildDebrief();
  const validation = validateSimulationResult(result);
  if (!validation.ok) {
    setStatus(`Debrief invalid: ${[...validation.missing, ...validation.invalid].join(', ')}`, 'error');
    return;
  }
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `overlord-live-sim-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  setStatus('Debrief validated and exported.', 'success');
}

function showLiveSim() {
  document.getElementById('level-map')?.classList.remove('on');
  const courseSelector = document.getElementById('course-selector');
  if (courseSelector) {
    courseSelectorDisplay = courseSelector.style.display;
    courseSelector.style.display = 'none';
  }
  const game = document.getElementById('game');
  if (game) game.style.display = 'none';
  const splash = document.getElementById('splash');
  if (splash) splash.style.display = 'none';
  view.hidden = false;
  view.setAttribute('aria-hidden', 'false');
  view.classList.add('is-open');
  ensureRunner().emit();
  document.getElementById('live-start')?.focus();
}

function closeLiveSim() {
  runner?.pause();
  view.hidden = true;
  view.setAttribute('aria-hidden', 'true');
  view.classList.remove('is-open');
  const courseSelector = document.getElementById('course-selector');
  if (courseSelector && courseSelectorDisplay !== null) {
    courseSelector.style.display = courseSelectorDisplay;
    courseSelectorDisplay = null;
  }
  if (launchSource?.closest('#level-map')) {
    document.getElementById('level-map')?.classList.add('on');
  }
  launchSource?.focus();
}

function registerLaunchButton(button) {
  if (!button || button.dataset.liveSimBound === 'true') return;
  button.dataset.liveSimBound = 'true';
  button.addEventListener('click', (event) => {
    launchSource = event.currentTarget;
    showLiveSim();
  });
}

function ensureMenuLaunchButtons() {
  registerLaunchButton(document.getElementById('live-sim-launch'));

  const courseSelectorBody = document.querySelector('#course-selector > div');
  if (courseSelectorBody && !document.getElementById('live-sim-course-launch')) {
    const button = document.createElement('button');
    button.id = 'live-sim-course-launch';
    button.className = 'big-btn live-sim-menu-launch';
    button.type = 'button';
    button.textContent = 'LIVE ANESTHESIA SIM';
    courseSelectorBody.insertBefore(button, courseSelectorBody.children[1] ?? null);
  }
  registerLaunchButton(document.getElementById('live-sim-course-launch'));

  const hospitalBar = document.getElementById('hospital-bar');
  if (hospitalBar && !document.getElementById('hospital-live-sim-launch')) {
    const button = document.createElement('button');
    button.id = 'hospital-live-sim-launch';
    button.className = 'hm-btn-live live-sim-menu-launch';
    button.type = 'button';
    button.textContent = 'LIVE SIM';
    hospitalBar.insertBefore(button, hospitalBar.querySelector('.hm-btn-store'));
  }
  registerLaunchButton(document.getElementById('hospital-live-sim-launch'));
}

function observeMenuLaunchers() {
  ensureMenuLaunchButtons();
  const courseSelector = document.getElementById('course-selector');
  if (!courseSelector || typeof MutationObserver === 'undefined') return;
  launchObserver = new MutationObserver(ensureMenuLaunchButtons);
  launchObserver.observe(courseSelector, { childList: true, subtree: true });
}

function bindControls() {
  document.getElementById('live-close')?.addEventListener('click', closeLiveSim);
  document.getElementById('live-start')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    liveRunner.start();
    liveRunner.logEvent('Case', 'Simulation started', { action: 'start' });
    setStatus('Simulation running.', 'success');
  });
  document.getElementById('live-pause')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    liveRunner.pause();
    liveRunner.logEvent('Case', 'Simulation paused', { action: 'pause' });
    setStatus('Simulation paused.');
  });
  document.getElementById('live-reset')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    liveRunner.reset();
    liveRunner.logEvent('Case', 'Simulation reset', { action: 'reset' });
    fillPatientForm(liveRunner.config);
    renderEventLog();
    setStatus('Simulation reset.', 'success');
  });
  document.getElementById('live-speed')?.addEventListener('change', (event) => {
    const speed = Number(event.currentTarget.value);
    const liveRunner = ensureRunner();
    liveRunner.setSpeed(speed);
    liveRunner.logEvent('Case', `Speed → ${speed}×`, { action: 'speed', speed });
    liveRunner.emit();
  });
  document.getElementById('live-preoxygenate')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    liveRunner.setMachine({ o2FlowLPerMin: 10, airFlowLPerMin: 0, n2oFlowLPerMin: 0, setFiO2: 1 });
    liveRunner.logEvent('Machine', 'Preoxygenation · 100% O₂ at 10 L/min', { action: 'preoxygenate' });
    liveRunner.emit();
    setStatus('Preoxygenation settings applied.', 'success');
  });
  document.getElementById('live-export')?.addEventListener('click', downloadDebrief);
  document.getElementById('live-open-display')?.addEventListener('click', () => {
    window.open('/live-sim-display.html', 'crnaLiveSimDisplay', 'popup,width=1440,height=900');
    ensureRunner().emit();
    setStatus('Display opened; current snapshot published.', 'success');
  });
  document.getElementById('live-patient-form')?.addEventListener('submit', applyPatient);
  document.getElementById('live-machine-form')?.addEventListener('submit', applyMachine);
  document.getElementById('live-patient-preset')?.addEventListener('change', (event) => {
    const preset = PATIENT_PRESETS.find((candidate) => candidate.id === event.currentTarget.value);
    if (preset) fillPatientForm({ ...DEFAULT_CONFIG, ...preset.config });
  });
  document.getElementById('live-patient-weightKg')?.addEventListener('input', (event) => updateDosePreviews(event.currentTarget.value));
  document.getElementById('live-forced-apnea')?.addEventListener('change', (event) => {
    const liveRunner = ensureRunner();
    liveRunner.setForcedApnea(event.currentTarget.checked);
    liveRunner.emit();
    setStatus(event.currentTarget.checked ? 'Forced apnea imposed.' : 'Forced apnea lifted.', 'success');
  });

  for (const button of view.querySelectorAll('[data-airway]')) {
    button.addEventListener('click', () => handleAirway(button.dataset.airway));
  }
  for (const button of view.querySelectorAll('[data-drug-action]')) {
    button.addEventListener('click', () => giveDrug(button.dataset.drugAction));
  }
  for (const button of view.querySelectorAll('[data-complication]')) {
    button.addEventListener('click', () => {
      try {
        const result = ensureRunner().injectComplication(button.dataset.complication);
        setStatus(`${result.type} injected through the engine state machine.`, 'success');
      } catch (error) {
        setStatus(error.message, 'error');
      }
    });
  }
}

export function initLiveSimView() {
  if (initialized) return;
  view = document.getElementById('live-sim-view');
  if (!view) return;
  initialized = true;
  renderShell();
  bindControls();
  observeMenuLaunchers();
  fillPatientForm(DEFAULT_CONFIG);
  window.showLiveSim = showLiveSim;
}

export { closeLiveSim, showLiveSim };
