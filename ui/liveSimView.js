import {
  DEFAULT_CONFIG, SimRunner, VentMode, ventName,
} from '../crisis-sim/ui/simRunner.js';
import {
  COMPLICATION_OPTIONS,
  computeDrugDose,
  computeRegionalLidocaineDose,
  DRUG_ACTIONS,
  formatLidocaineSnapshot,
  formatMonitorSnapshot,
  LIDOCAINE_ROUTES,
  parsePatientConfig,
  PATIENT_PRESETS,
  validateSimulationResult,
  VOLATILE_AGENTS,
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
let selectedVolatileAgent = 'Sevoflurane';
let volatileSelectionDirty = false;

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

export function formatDrugLifecycleStatus(dose, result) {
  if (result.queued) {
    return {
      kind: 'info',
      message: `${dose.drugName}: ${dose.totalMg} mg total. DOSE QUEUED — RESUME TO ADVANCE.`,
    };
  }
  return {
    kind: 'success',
    message: `${dose.drugName}: ${dose.totalMg} mg total given — effect evolves with simulation time.`,
  };
}

export function formatPreoxygenationLifecycleStatus(result) {
  if (result.state === 'PAUSED') {
    return {
      kind: 'info',
      message: 'Preoxygenation set. RESUME TO ADVANCE OXYGEN STORES.',
    };
  }
  if (result.started) {
    return {
      kind: 'success',
      message: 'Preoxygenation started — oxygen stores evolve with simulation time.',
    };
  }
  return { kind: 'success', message: 'Preoxygenation continues.' };
}

export function deriveLifecyclePresentation(snapshot) {
  const lifecycle = snapshot.lifecycle
    || (snapshot.running ? 'RUNNING' : (snapshot.t > 0 ? 'PAUSED' : 'READY'));
  return {
    label: `${lifecycle} · ${snapshot.speed}× · ${String(snapshot.airwayDevice).toUpperCase()}`,
    startText: lifecycle === 'PAUSED' ? 'RESUME' : (lifecycle === 'RUNNING' ? 'RUNNING' : 'START'),
    startDisabled: lifecycle === 'RUNNING',
    pauseDisabled: lifecycle !== 'RUNNING',
  };
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
      <div class="live-vital-bp"><span>BP</span><strong id="live-vital-bp">—</strong><small>mmHg</small></div>
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
          <output id="live-intubation-state" class="live-help" aria-live="polite">No intubation attempts.</output>
          <div class="live-button-row">
            <button id="live-mask-ppv" type="button">MASK PPV · 30 SEC</button>
            <button id="live-cricoid-toggle" type="button" aria-pressed="false">APPLY CRICOID</button>
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
          <div class="live-tof-assessment">
            <button id="live-check-tof" type="button">CHECK TOF</button>
            <output id="live-last-tof" aria-live="polite">No quantitative TOF check recorded.</output>
          </div>
        </section>
      </div>

      <div class="live-sim-column live-sim-column-wide">
        <section id="live-volatile-panel" class="live-panel live-volatile-panel" aria-labelledby="live-volatile-heading">
          <h2 id="live-volatile-heading">Volatile anesthetic</h2>
          <p class="live-help">Select an agent and dial, then apply. End-tidal concentration and MAC remain engine-derived.</p>
          <div class="live-volatile-agents" role="group" aria-label="Volatile agent">
            <button type="button" data-volatile-agent="Sevoflurane" aria-pressed="true">SEVOFLURANE</button>
            <button type="button" data-volatile-agent="Desflurane" aria-pressed="false">DESFLURANE</button>
            <button type="button" data-volatile-agent="Isoflurane" aria-pressed="false">ISOFLURANE</button>
            <button id="live-volatile-off" type="button">AGENT OFF</button>
          </div>
          <div class="live-volatile-settings">
            <label class="live-field" for="live-volatile-dial"><span>Vaporizer dial</span><span class="live-input-unit"><input id="live-volatile-dial" type="number" value="2" min="0" max="18" step="0.1"><small>%</small></span></label>
            <button id="live-volatile-apply" type="button" class="live-primary">APPLY VOLATILE</button>
          </div>
          <dl class="live-volatile-readback">
            <div><dt>Selected</dt><dd id="live-volatile-current-agent">Sevoflurane</dd></div>
            <div><dt>Dial</dt><dd><span id="live-volatile-current-dial">0.0</span>%</dd></div>
            <div><dt>End tidal</dt><dd><span id="live-volatile-et">0.0</span>%</dd></div>
            <div><dt>MAC</dt><dd id="live-volatile-mac">0.00</dd></div>
          </dl>
        </section>

        <section id="live-lidocaine-panel" class="live-panel live-lidocaine-panel" aria-labelledby="live-lidocaine-heading">
          <h2 id="live-lidocaine-heading">Lidocaine</h2>
          <p class="live-help">Systemic and regional doses share one exposure model. Recommended-dose warnings remain advisory for deliberate toxicity exercises.</p>
          <div class="live-lidocaine-iv-grid">
            <button id="live-lidocaine-bolus" type="button" class="live-primary">IV BOLUS · 1.5 MG/KG</button>
            <label class="live-field" for="live-lidocaine-infusion-rate"><span>Infusion rate</span><span class="live-input-unit"><input id="live-lidocaine-infusion-rate" type="number" value="1.5" min="0.1" max="10" step="0.1"><small>mg/kg/hr</small></span></label>
            <button id="live-lidocaine-infusion-start" type="button">START / UPDATE INFUSION</button>
            <button id="live-lidocaine-infusion-stop" type="button" class="live-secondary">STOP INFUSION</button>
          </div>
          <fieldset class="live-regional-fieldset">
            <legend>Regional administration</legend>
            <div class="live-regional-grid">
              <label class="live-field" for="live-lidocaine-route"><span>Route</span><select id="live-lidocaine-route">${LIDOCAINE_ROUTES.map((route) => `<option value="${route.id}">${route.label}</option>`).join('')}</select></label>
              <label class="live-field" for="live-lidocaine-concentration"><span>Concentration</span><span class="live-input-unit"><input id="live-lidocaine-concentration" type="number" value="1.5" min="0.1" max="4" step="0.1" aria-describedby="live-lidocaine-dose-preview live-lidocaine-dose-warning"><small>%</small></span></label>
              <label class="live-field" for="live-lidocaine-volume"><span>Volume</span><span class="live-input-unit"><input id="live-lidocaine-volume" type="number" value="20" min="0.1" max="250" step="0.1" aria-describedby="live-lidocaine-dose-preview live-lidocaine-dose-warning"><small>mL</small></span></label>
              <label class="live-toggle live-regional-epinephrine" for="live-lidocaine-epinephrine"><input id="live-lidocaine-epinephrine" type="checkbox"><span>With epinephrine</span></label>
            </div>
            <output id="live-lidocaine-dose-preview" class="live-dose-calculation" aria-live="polite">300 mg · 4.29 mg/kg · max 300 mg</output>
            <p id="live-lidocaine-dose-warning" class="live-dose-warning" role="alert" hidden></p>
            <button id="live-lidocaine-regional-administer" type="button" class="live-primary">ADMINISTER REGIONAL LIDOCAINE</button>
          </fieldset>
          <dl class="live-readback-grid" aria-label="Current Lidocaine state">
            <div><dt>Total plasma</dt><dd><span id="live-lidocaine-total-level">0.00</span> mcg/mL</dd></div>
            <div><dt>Free plasma</dt><dd><span id="live-lidocaine-free-level">0.00</span> mcg/mL</dd></div>
            <div><dt>Effect site</dt><dd><span id="live-lidocaine-effect-level">0.00</span> mcg/mL</dd></div>
            <div><dt>Cumulative</dt><dd><span id="live-lidocaine-cumulative">0.0</span> mg</dd></div>
            <div><dt>Sensory block</dt><dd id="live-lidocaine-sensory">0%</dd></div>
            <div><dt>Motor block</dt><dd id="live-lidocaine-motor">0%</dd></div>
            <div><dt>Infusion</dt><dd id="live-lidocaine-infusion-state">OFF</dd></div>
            <div><dt>Toxicity</dt><dd id="live-lidocaine-toxicity" data-stage="none">NONE</dd></div>
          </dl>
        </section>

        <div class="live-clinical-grid">
          <section id="live-stimulus-panel" class="live-panel" aria-labelledby="live-stimulus-heading">
            <h2 id="live-stimulus-heading">Surgical stimulus</h2>
            <label class="live-field" for="live-stimulus-intensity"><span>Selected intensity · <output id="live-stimulus-selection" for="live-stimulus-intensity">0.00</output></span><input id="live-stimulus-intensity" type="range" value="0" min="0" max="1" step="0.05"></label>
            <div class="live-button-row">
              <button id="live-stimulus-apply" type="button" class="live-primary">APPLY STIMULUS</button>
              <button id="live-stimulus-off" type="button">STIMULUS OFF</button>
            </div>
            <dl class="live-readback-grid live-readback-compact">
              <div><dt>Raw</dt><dd id="live-stimulus-raw">0.00</dd></div>
              <div><dt>Effective</dt><dd id="live-stimulus-effective">0.00</dd></div>
            </dl>
          </section>

          <section id="live-lipid-panel" class="live-panel" aria-labelledby="live-lipid-heading">
            <h2 id="live-lipid-heading">LAST rescue · 20% lipid</h2>
            <p class="live-help">1.5 mL/kg bolus · 0.25 mL/kg/min infusion · cumulative cap 12 mL/kg.</p>
            <div class="live-rescue-actions">
              <button id="live-lipid-bolus" type="button" class="live-primary">GIVE 1.5 ML/KG BOLUS</button>
              <button id="live-lipid-infusion-start" type="button">START / DOUBLE INFUSION</button>
              <button id="live-lipid-infusion-stop" type="button">STOP INFUSION</button>
            </div>
            <dl class="live-readback-grid live-readback-compact">
              <div><dt>Cumulative</dt><dd><span id="live-lipid-cumulative">0.00</span> mL/kg</dd></div>
              <div><dt>Infusion</dt><dd id="live-lipid-infusion-state">OFF</dd></div>
            </dl>
          </section>
        </div>

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
  updateRegionalLidocainePreview(config.weightKg);
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

function updateRegionalLidocainePreview(weightKg = runner?.config.weightKg ?? DEFAULT_CONFIG.weightKg) {
  const route = document.getElementById('live-lidocaine-route');
  const concentration = document.getElementById('live-lidocaine-concentration');
  const volume = document.getElementById('live-lidocaine-volume');
  const epinephrine = document.getElementById('live-lidocaine-epinephrine');
  const preview = document.getElementById('live-lidocaine-dose-preview');
  const warning = document.getElementById('live-lidocaine-dose-warning');
  if (!route || !concentration || !volume || !epinephrine || !preview || !warning) return null;
  concentration.removeAttribute('aria-invalid');
  volume.removeAttribute('aria-invalid');
  try {
    const dose = computeRegionalLidocaineDose({
      route: route.value,
      concentrationPercent: Number(concentration.value),
      volumeMl: Number(volume.value),
      weightKg: Number(weightKg),
      epinephrine: epinephrine.checked,
    });
    preview.textContent = `${dose.totalMg.toFixed(1)} mg · ${dose.doseMgKg.toFixed(2)} mg/kg · max ${dose.maximumMg.toFixed(0)} mg`;
    warning.hidden = !dose.warning;
    warning.textContent = dose.warning || '';
    return dose;
  } catch (error) {
    preview.textContent = 'Enter a valid concentration, volume, and patient weight.';
    warning.hidden = false;
    warning.textContent = error.message;
    concentration.setAttribute('aria-invalid', 'true');
    volume.setAttribute('aria-invalid', 'true');
    return null;
  }
}

function setClinicalActionStatus(label, result) {
  if (!result.ok) {
    setStatus(result.reason, 'error');
    return;
  }
  if (result.queued) {
    setStatus(`${label} queued at paused simulation time — resume to advance physiology.`, 'info');
    return;
  }
  setStatus(`${label} recorded; effect evolves through the engine.`, 'success');
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

function renderVolatileSelection(agent) {
  selectedVolatileAgent = agent;
  for (const button of view.querySelectorAll('[data-volatile-agent]')) {
    button.setAttribute('aria-pressed', String(button.dataset.volatileAgent === agent));
  }
}

function renderSnapshot(snapshot) {
  latestSnapshot = snapshot;
  const monitor = formatMonitorSnapshot(snapshot);
  const lifecycle = deriveLifecyclePresentation(snapshot);
  setText('live-sim-clock', formatTime(snapshot.t));
  setText('live-case-state', lifecycle.label);
  const startButton = document.getElementById('live-start');
  const pauseButton = document.getElementById('live-pause');
  if (startButton) {
    startButton.textContent = lifecycle.startText;
    startButton.disabled = lifecycle.startDisabled;
  }
  if (pauseButton) pauseButton.disabled = lifecycle.pauseDisabled;
  setText('live-vital-hr', monitor.hr);
  setText('live-vital-bp', monitor.bp);
  setText('live-vital-map', monitor.map);
  setText('live-vital-spo2', monitor.spo2);
  setText('live-vital-etco2', monitor.etco2);
  setText('live-vital-tof', monitor.tof);
  setText('live-vital-tof-ratio', `ratio ${monitor.tofRatio}`);
  const lastTofCheck = snapshot.lastTofCheck;
  setText(
    'live-last-tof',
    lastTofCheck
      ? `Last check ${lastTofCheck.count}/4 · ratio ${lastTofCheck.ratio.toFixed(2)} · ${formatTime(lastTofCheck.tSec)}`
      : 'No quantitative TOF check recorded.',
  );
  if (!volatileSelectionDirty && VOLATILE_AGENTS.some((entry) => entry.name === snapshot.vaporizerAgent)) {
    renderVolatileSelection(snapshot.vaporizerAgent);
  }
  const volatileDial = document.getElementById('live-volatile-dial');
  if (volatileDial && document.activeElement !== volatileDial && !volatileSelectionDirty) {
    volatileDial.value = String(snapshot.vaporizer);
  }
  setText('live-volatile-current-agent', snapshot.vaporizerAgent);
  setText('live-volatile-current-dial', Number(snapshot.vaporizer).toFixed(1));
  setText('live-volatile-et', Number(snapshot.etAgent).toFixed(1));
  setText('live-volatile-mac', Number(snapshot.mac).toFixed(2));
  const lidocaine = formatLidocaineSnapshot(snapshot);
  setText('live-lidocaine-total-level', lidocaine.totalLevel);
  setText('live-lidocaine-free-level', lidocaine.freeLevel);
  setText('live-lidocaine-effect-level', lidocaine.effectSite);
  setText('live-lidocaine-cumulative', lidocaine.cumulativeMg);
  setText('live-lidocaine-sensory', lidocaine.sensoryBlock);
  setText('live-lidocaine-motor', lidocaine.motorBlock);
  setText(
    'live-lidocaine-infusion-state',
    snapshot.lidocaineInfusionActive
      ? `${Number(snapshot.lidocaineInfusionRateMgKgHour).toFixed(1)} mg/kg/hr`
      : 'OFF',
  );
  setText('live-lidocaine-toxicity', lidocaine.toxicity);
  const toxicity = document.getElementById('live-lidocaine-toxicity');
  if (toxicity) toxicity.dataset.stage = snapshot.lidocaineToxicityStage;
  setText('live-stimulus-raw', lidocaine.stimulusRaw);
  setText('live-stimulus-effective', lidocaine.stimulusEffective);
  setText('live-lipid-cumulative', lidocaine.lipidCumulative);
  setText('live-lipid-infusion-state', snapshot.lipidInfusionActive ? 'RUNNING' : 'OFF');
  setText('live-drive-forced', Number(snapshot.forcedApneaContribution).toFixed(2));
  setText('live-drive-drug', Number(snapshot.drugDepressionContribution).toFixed(2));
  setText('live-drive-complication', Number(snapshot.complicationDriveContribution).toFixed(2));
  setText('live-drive-muscle', Number(snapshot.respiratoryMuscleCapability).toFixed(2));
  const forcedApnea = document.getElementById('live-forced-apnea');
  if (forcedApnea) forcedApnea.checked = snapshot.forcedApnea;
  const latestAttempt = snapshot.intubationAttempts.at(-1);
  if (snapshot.intubationInProgress && latestAttempt) {
    const elapsed = Math.max(0, snapshot.t - latestAttempt.startTimeSec);
    const remaining = Math.max(0, latestAttempt.plannedDurationSec - elapsed);
    setText(
      'live-intubation-state',
      `ATTEMPT ${latestAttempt.attemptNumber} · ${remaining.toFixed(1)}s remaining · AIRWAY UNSECURED`,
    );
  } else if (latestAttempt?.outcome === 'succeeded') {
    setText(
      'live-intubation-state',
      `Attempt ${latestAttempt.attemptNumber} succeeded · tube secured · select ventilation`,
    );
  } else if (latestAttempt?.outcome === 'failed') {
    setText('live-intubation-state', `Attempt ${latestAttempt.attemptNumber} failed · mask airway retained`);
  } else {
    setText('live-intubation-state', 'No intubation attempts.');
  }
  const intubateButton = document.querySelector('[data-airway="intubated"]');
  if (intubateButton) intubateButton.disabled = snapshot.intubationInProgress || snapshot.airwayDevice !== 'mask';
  const ppvButton = document.getElementById('live-mask-ppv');
  if (ppvButton) {
    ppvButton.disabled = snapshot.ppvActive || snapshot.intubationInProgress || snapshot.airwayDevice !== 'mask';
    ppvButton.textContent = snapshot.ppvActive ? 'MASK PPV ACTIVE' : 'MASK PPV · 30 SEC';
  }
  const cricoidButton = document.getElementById('live-cricoid-toggle');
  if (cricoidButton) {
    cricoidButton.textContent = snapshot.cricoidPressureActive ? 'RELEASE CRICOID' : 'APPLY CRICOID';
    cricoidButton.setAttribute('aria-pressed', String(snapshot.cricoidPressureActive));
  }
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
  if (next === 'intubated') {
    setStatus(
      `Intubation attempt ${result.attemptNumber} started · ${result.plannedDurationSec}s unsupported laryngoscopy.`,
      'info',
    );
    liveRunner.emit();
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
    updateRegionalLidocainePreview(config.weightKg);
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
    const result = liveRunner.giveBolus(
      dose.drugName,
      dose.totalMg,
      `${dose.clinicalLabel} · ${dose.totalMg} mg total`,
    );
    const status = formatDrugLifecycleStatus(dose, result);
    setStatus(status.message, status.kind);
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
    const previousState = liveRunner.getLifecycleState();
    liveRunner.start();
    const resumed = previousState === 'PAUSED';
    liveRunner.logEvent('Case', resumed ? 'Simulation resumed' : 'Simulation started', {
      action: resumed ? 'resume' : 'start',
    });
    setStatus(resumed ? 'Simulation resumed.' : 'Simulation running.', 'success');
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
    const status = formatPreoxygenationLifecycleStatus(liveRunner.preoxygenate());
    setStatus(status.message, status.kind);
  });
  document.getElementById('live-export')?.addEventListener('click', downloadDebrief);
  document.getElementById('live-open-display')?.addEventListener('click', () => {
    window.open('/live-sim-display.html', 'crnaLiveSimDisplay', 'popup,width=1440,height=900');
    ensureRunner().emit();
    setStatus('Display opened; current snapshot published.', 'success');
  });
  document.getElementById('live-patient-form')?.addEventListener('submit', applyPatient);
  document.getElementById('live-machine-form')?.addEventListener('submit', applyMachine);
  document.getElementById('live-volatile-dial')?.addEventListener('input', () => {
    volatileSelectionDirty = true;
  });
  document.getElementById('live-volatile-apply')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    const dialPercent = Number(document.getElementById('live-volatile-dial')?.value);
    const result = liveRunner.setVolatile({ agent: selectedVolatileAgent, dialPercent });
    if (!result.ok) {
      setStatus(result.reason, 'error');
      return;
    }
    volatileSelectionDirty = false;
    setStatus(`${result.agent} applied at ${result.dialPercent.toFixed(1)}%.`, 'success');
  });
  document.getElementById('live-volatile-off')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    const result = liveRunner.setVolatile({ agent: selectedVolatileAgent, dialPercent: 0 });
    if (!result.ok) {
      setStatus(result.reason, 'error');
      return;
    }
    volatileSelectionDirty = false;
    const dial = document.getElementById('live-volatile-dial');
    if (dial) dial.value = '0';
    setStatus(`${result.agent} vaporizer turned off.`, 'success');
  });
  document.getElementById('live-lidocaine-bolus')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    const result = liveRunner.giveLidocaineBolus({ doseMgPerKg: 1.5 });
    setClinicalActionStatus('Lidocaine 1.5 mg/kg IV bolus', result);
  });
  document.getElementById('live-lidocaine-infusion-start')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    const rateMgPerKgHour = Number(document.getElementById('live-lidocaine-infusion-rate')?.value);
    const result = liveRunner.startLidocaineInfusion({ rateMgPerKgHour });
    setClinicalActionStatus(`Lidocaine infusion ${rateMgPerKgHour} mg/kg/hr`, result);
  });
  document.getElementById('live-lidocaine-infusion-stop')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    const result = liveRunner.stopLidocaineInfusion();
    if (result.ok && !result.changed) setStatus('Lidocaine infusion is already off.', 'info');
    else setClinicalActionStatus('Lidocaine infusion stopped', result);
  });
  for (const id of [
    'live-lidocaine-route', 'live-lidocaine-concentration',
    'live-lidocaine-volume', 'live-lidocaine-epinephrine',
  ]) {
    document.getElementById(id)?.addEventListener('input', () => updateRegionalLidocainePreview());
    document.getElementById(id)?.addEventListener('change', () => updateRegionalLidocainePreview());
  }
  document.getElementById('live-lidocaine-regional-administer')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    const dose = updateRegionalLidocainePreview(liveRunner.config.weightKg);
    if (!dose) {
      setStatus('Regional Lidocaine inputs are invalid.', 'error');
      return;
    }
    const result = liveRunner.administerRegionalLidocaine({
      route: dose.route,
      concentrationPercent: Number(document.getElementById('live-lidocaine-concentration')?.value),
      volumeMl: Number(document.getElementById('live-lidocaine-volume')?.value),
      epinephrine: document.getElementById('live-lidocaine-epinephrine')?.checked === true,
    });
    setClinicalActionStatus(
      `${dose.route} Lidocaine ${dose.totalMg.toFixed(1)} mg${dose.exceeded ? ' · ABOVE RECOMMENDATION' : ''}`,
      result,
    );
  });
  document.getElementById('live-stimulus-intensity')?.addEventListener('input', (event) => {
    setText('live-stimulus-selection', Number(event.currentTarget.value).toFixed(2));
  });
  document.getElementById('live-stimulus-apply')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    const intensity = Number(document.getElementById('live-stimulus-intensity')?.value);
    const result = liveRunner.setSurgicalStimulus(intensity);
    setClinicalActionStatus(`Surgical stimulus ${intensity.toFixed(2)}`, result);
  });
  document.getElementById('live-stimulus-off')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    const result = liveRunner.setSurgicalStimulus(0);
    const control = document.getElementById('live-stimulus-intensity');
    if (control) control.value = '0';
    setText('live-stimulus-selection', '0.00');
    if (result.ok && !result.changed) setStatus('Surgical stimulus is already off.', 'info');
    else setClinicalActionStatus('Surgical stimulus off', result);
  });
  document.getElementById('live-lipid-bolus')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    const result = liveRunner.giveLipidEmulsionBolus();
    setClinicalActionStatus('20% lipid bolus', result);
  });
  document.getElementById('live-lipid-infusion-start')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    const result = liveRunner.startLipidEmulsionInfusion();
    setClinicalActionStatus('20% lipid infusion', result);
  });
  document.getElementById('live-lipid-infusion-stop')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    const result = liveRunner.stopLipidEmulsionInfusion();
    if (result.ok && !result.changed) setStatus('20% lipid infusion is already off.', 'info');
    else setClinicalActionStatus('20% lipid infusion stopped', result);
  });
  document.getElementById('live-patient-preset')?.addEventListener('change', (event) => {
    const preset = PATIENT_PRESETS.find((candidate) => candidate.id === event.currentTarget.value);
    if (preset) fillPatientForm({ ...DEFAULT_CONFIG, ...preset.config });
  });
  document.getElementById('live-patient-weightKg')?.addEventListener('input', (event) => {
    updateDosePreviews(event.currentTarget.value);
    updateRegionalLidocainePreview(event.currentTarget.value);
  });
  document.getElementById('live-forced-apnea')?.addEventListener('change', (event) => {
    const liveRunner = ensureRunner();
    liveRunner.setForcedApnea(event.currentTarget.checked);
    liveRunner.emit();
    setStatus(event.currentTarget.checked ? 'Forced apnea imposed.' : 'Forced apnea lifted.', 'success');
  });
  document.getElementById('live-check-tof')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    const record = liveRunner.checkTrainOfFour();
    setStatus(
      `TOF checked: ${record.count}/4 · ratio ${record.ratio.toFixed(2)} at ${formatTime(record.tSec)}.`,
      'success',
    );
  });
  document.getElementById('live-mask-ppv')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    const result = liveRunner.deliverMaskVentilation({
      durationSeconds: 30,
      tidalVolumeMl: latestSnapshot?.ventSetTV || 500,
      respiratoryRate: latestSnapshot?.ventSetRR || 12,
      cricoidPressure: latestSnapshot?.cricoidPressureActive === true,
    });
    setStatus(
      result.ok
        ? `Mask PPV started · ${result.minuteVentilation.toFixed(1)} L/min for ${result.plannedDurationSec}s.`
        : result.reason,
      result.ok ? 'success' : 'error',
    );
    liveRunner.emit();
  });
  document.getElementById('live-cricoid-toggle')?.addEventListener('click', () => {
    const liveRunner = ensureRunner();
    const wasActive = latestSnapshot?.cricoidPressureActive === true;
    const result = wasActive
      ? liveRunner.releaseCricoidPressure()
      : liveRunner.applyCricoidPressure();
    setStatus(
      result.changed
        ? (wasActive ? 'Cricoid pressure released.' : 'Cricoid pressure applied.')
        : 'Cricoid pressure state unchanged.',
      'success',
    );
    liveRunner.emit();
  });

  for (const button of view.querySelectorAll('[data-airway]')) {
    button.addEventListener('click', () => handleAirway(button.dataset.airway));
  }
  for (const button of view.querySelectorAll('[data-volatile-agent]')) {
    button.addEventListener('click', () => {
      const metadata = VOLATILE_AGENTS.find((entry) => entry.name === button.dataset.volatileAgent);
      if (!metadata) return;
      volatileSelectionDirty = true;
      renderVolatileSelection(metadata.name);
      const dial = document.getElementById('live-volatile-dial');
      if (dial) dial.value = String(metadata.referenceDial);
    });
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
