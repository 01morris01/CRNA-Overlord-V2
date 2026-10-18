/* Mock OR Day: 50 synthetic preop charts as live sim scenarios.

   Data (data/mock-or-day/):
   - index.json: one row per patient with engine physiology pulled from the
     chart's most recent preop vitals (or engineSupported false with a reason).
   - patients/pXX.json: the full chart, as in the original EHR page.
   - answer-keys/pXX.json: chart red flags, plan elements, go or delay call,
     ASA, and complications Booth should favor. Status 'draft': drafted by
     Claude from the chart for faculty review.
   The chart viewer is the original EHR page served at /mock-or-day/ehr.html,
   which opens a patient from its #pXX hash.

   Flow: pick patient, LOAD (engine physiology applied, runner reset), read
   the chart, fill the care plan, submit; START stays locked until then.
   Booth gets the patient, procedure and chart findings, and his director
   favors the complications that fit this chart. */

export const MOCK_OR_BASE = '/data/mock-or-day';
export const MOCK_OR_EHR = '/mock-or-day/ehr.html';

function str(value) { return value === null || value === undefined ? '' : String(value); }

function esc(value) {
  return str(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* Physiology from the index row, ready for parsePatientConfig. */
export function physiologyConfig(entry) {
  const p = entry?.physiology;
  if (!p) return null;
  return {
    weightKg: p.weightKg, heightCm: p.heightCm, ageYears: p.ageYears, sex: p.sex,
    baselineHR: p.baselineHR, baselineSystolic: p.baselineSystolic, baselineDiastolic: p.baselineDiastolic,
    baselineRR: p.baselineRR, baselineSpO2: p.baselineSpO2, baselineTemp: p.baselineTemp, baselineEtCO2: p.baselineEtCO2,
  };
}

/* A compact text chart, newest first, for the patient interview and for
   Booth's plan review. Stays under maxChars by trimming old notes first. */
export function buildChartDigest(patient, { maxChars = 7500 } = {}) {
  if (!patient) return '';
  const c = patient.case ?? {};
  const join = (rows, map) => (Array.isArray(rows) ? rows.map(map).filter(Boolean).join('; ') : '');
  const lines = [];
  lines.push(`${patient.name}, ${patient.age} ${patient.sex}, ${patient.ht_cm} cm, ${patient.wt_kg} kg, BMI ${patient.bmi}. ${patient.room} at ${patient.time}. Code status ${patient.code_status}.`);
  lines.push(`Allergies: ${(patient.allergies ?? []).length ? join(patient.allergies, (r) => `${r[0]} (${r[1]}, ${r[2]})`) : 'NKDA'}.`);
  lines.push(`Procedure: ${str(c.procedure)}. Indication: ${str(c.indication)}. Surgeon ${str(c.surgeon)}. Requested anesthesia: ${str(c.anesthesia_requested)}. Position: ${str(c.position)}. Dispo: ${str(c.dispo)}. Blood: ${str(c.blood)}. Surgeon notes: ${str(c.surgeon_notes)}`);
  lines.push(`Problems: ${join(patient.problems, (r) => `${r[0]} (${r[2]})`)}.`);
  const h = patient.history ?? {};
  if (h.pmh) lines.push(`PMH: ${[].concat(h.pmh).join(' | ')}`);
  if (h.psh) lines.push(`PSH: ${join(h.psh, (r) => `${r[0]} ${r[1]}`)}`);
  if (h.social) lines.push(`Social: ${Object.entries(h.social).map(([k, v]) => `${k} ${v}`).join('; ')}`);
  if (h.family) lines.push(`Family: ${[].concat(h.family).join(' | ')}`);
  if (h.ob) lines.push(`OB: ${h.ob}`);
  lines.push(`Home meds (name, sig, last dose): ${join(patient.home_meds, (r) => `${r[0]} ${r[1]} last ${r[3]}`)}.`);
  lines.push(`MAR: ${join(patient.mar, (r) => r.join(' '))}.`);
  if ((patient.discontinued ?? []).length) lines.push(`Discontinued: ${join(patient.discontinued, (r) => `${r[0]} (${r[2] ?? ''})`)}.`);
  const cols = patient.labs?.cols ?? [];
  for (const col of cols.slice(0, 2)) {
    lines.push(`Labs ${col.dt}: ${Object.entries(col.vals ?? {}).map(([k, v]) => `${k} ${v[0]}${v[1] ? `(${v[1]})` : ''}`).join(', ')}`);
  }
  if ((patient.labs?.other ?? []).length) lines.push(`Other labs: ${join(patient.labs.other, (r) => `${r[0]} ${r[1]} ${r[2]}`)}`);
  lines.push(`Imaging: ${join(patient.imaging, (r) => `${r[0]} ${r[1]}: ${r[2]}`)}`);
  lines.push(`Cardiology and studies: ${join(patient.cardiology, (r) => `${r[0]} ${r[1]}: ${r[2]}`)}`);
  lines.push(`Prior anesthesia: ${join(patient.anesthesia_history, (r) => `${r[0]} ${r[1]} ${r[2]}: ${r[3]}`)}`);
  const pre = patient.preop ?? {};
  lines.push(`Preop: arrived ${str(pre.arrived)}; last solids ${str(pre.npo_solids)}; last clears ${str(pre.npo_clears)}; IV ${str(pre.iv)}. Nursing: ${str(pre.nursing_note)}`);
  const v = (patient.vitals ?? []).slice(-2);
  lines.push(`Vitals: ${v.map((r) => `${r[0]} BP ${r[1]} HR ${r[2]} RR ${r[3]} SpO2 ${r[4]} T ${r[5] ?? ''}`).join(' | ')}`);
  lines.push(`Orders: ${join(patient.orders, (r) => `${r[0]} (${r[2]})`)}`);
  const bb = patient.blood_bank ?? {};
  lines.push(`Blood bank: ${bb.abo_rh ?? ''}, screen ${bb.antibody_screen ?? ''}, ${bb.units ?? ''}. ${bb.notes ?? ''}`);
  lines.push(`Consents: ${join(patient.consents, (r) => `${r[0]}: ${r[1]}`)}. Directives: ${str(patient.directives)}`);
  const head = lines.join('\n');
  const notes = (patient.notes ?? []).slice().reverse().map((r) => `NOTE ${r[0]} ${r[1]} (${r[2]}, ${r[3]}): ${r[4]}`);
  let out = head;
  for (const note of notes) {
    if (out.length + note.length + 1 > maxChars) break;
    out += `\n${note}`;
  }
  return out.slice(0, maxChars);
}

/* Interview grounding in the shape createPatientInterview expects. The chart
   digest is the whole truth; a few scripted answers keep the offline
   fallback useful when no API key exists. */
export function buildChartInterviewGrounding(patient) {
  if (!patient) return null;
  const pre = patient.preop ?? {};
  const allergies = (patient.allergies ?? []).length
    ? patient.allergies.map((r) => `${r[0]}, it gave me ${String(r[1]).toLowerCase()}`).join('. ')
    : 'No allergies that I know of.';
  const meds = (patient.home_meds ?? []).map((r) => `${r[0]} (${r[1]}), last taken ${r[3]}`).join('; ');
  const priorAnesthesia = (patient.anesthesia_history ?? []).map((r) => `${r[0]} ${r[1]} with ${r[2]}: ${r[3]}`).join('; ');
  return {
    patientName: patient.preferred_name || patient.label || 'the patient',
    voice: patient.sex === 'M' ? 'patient-male' : 'patient-female',
    chart: { digest: buildChartDigest(patient, { maxChars: 7200 }) },
    qa: [
      { id: 'mock_allergies', prompt: 'Do you have any allergies to medicines', response: allergies, domain: 'allergies' },
      { id: 'mock_npo', prompt: 'When did you last eat or drink anything', response: `Last food ${pre.npo_solids || 'not recorded'}; last drink ${pre.npo_clears || 'not recorded'}.`, domain: 'npo fasting eat drink' },
      { id: 'mock_meds', prompt: 'What medicines do you take and did you take them today', response: meds || 'I do not take any regular medicines.', domain: 'medications pills' },
      { id: 'mock_anesthesia', prompt: 'Have you had anesthesia or surgery before, any problems', response: priorAnesthesia || 'I have never had anesthesia.', domain: 'anesthesia surgery problems' },
      { id: 'mock_procedure', prompt: 'What surgery are you having today', response: `${patient.case?.procedure ?? 'My operation'}.`, domain: 'surgery procedure operation' },
    ],
  };
}

/* What Booth knows about this case once the plan is in. */
export function buildBoothCaseProfile(entry, answerKey) {
  if (!entry) return null;
  const flags = Array.isArray(answerKey?.redFlags) ? answerKey.redFlags : [];
  const order = { critical: 0, major: 1, minor: 2 };
  const serious = flags.filter((flag) => flag.severity !== 'minor');
  const hooks = (serious.length > 0 ? serious : flags)
    .slice()
    .sort((x, y) => (order[x.severity] ?? 3) - (order[y.severity] ?? 3))
    .map((flag) => flag.finding.charAt(0).toLowerCase() + flag.finding.slice(1));
  return {
    patient: entry.label,
    procedure: (entry.procedure ?? '').split(/[,(;]/)[0].trim().toLowerCase() || 'this case',
    summary: answerKey?.summary ?? null,
    hooks,
    complications: (answerKey?.boothComplications ?? []).map((item) => item.type),
  };
}

export function renderMockOrPanel() {
  return `
    <section id="mockor-panel" class="live-panel mockor-panel" aria-labelledby="mockor-heading">
      <h2 id="mockor-heading">Mock OR Day</h2>
      <p class="live-help">Fifty synthetic preop charts. Load a patient, read the chart, fill the care plan, then START. Booth grades the plan against a draft answer key.</p>
      <label class="live-field" for="mockor-select"><span>Patient</span>
        <select id="mockor-select"><option value="">Loading list...</option></select>
      </label>
      <div class="live-button-row">
        <button id="mockor-load" type="button" class="live-primary">LOAD PATIENT</button>
        <button id="mockor-chart" type="button" disabled>OPEN CHART</button>
        <button id="mockor-plan" type="button" disabled>CARE PLAN</button>
      </div>
      <div class="live-button-row">
        <button id="mockor-exit" type="button" class="live-secondary" disabled>EXIT MOCK OR</button>
      </div>
      <output id="mockor-status" class="mockor-status" aria-live="polite">Free play. No Mock OR patient loaded.</output>
    </section>`;
}

export function renderChartModal() {
  return `
    <div id="mockor-chart-modal" class="cp-modal mockor-chart-modal" role="dialog" aria-modal="true" aria-labelledby="mockor-chart-title" hidden>
      <div class="cp-dialog mockor-chart-dialog">
        <header class="cp-header">
          <div><p class="live-eyebrow">MOCK OR DAY · CHART</p><h2 id="mockor-chart-title">Chart</h2></div>
          <div class="cp-header-actions">
            <a id="mockor-chart-newtab" href="${MOCK_OR_EHR}" target="_blank" rel="noopener">OPEN IN NEW TAB</a>
            <button type="button" id="mockor-chart-close" class="live-secondary">CLOSE</button>
          </div>
        </header>
        <iframe id="mockor-chart-frame" class="mockor-chart-frame" title="Patient chart"></iframe>
      </div>
    </div>`;
}

export function optionLabel(entry) {
  const flag = entry.engineSupported ? '' : ' · chart only';
  return `${entry.time} ${entry.room} · ${entry.label} · ${entry.age} ${entry.sex} · ${entry.procedure}${flag}`;
}

/* Pure gate: may the sim start? */
export function startGate(state) {
  if (!state?.active) return { allowed: true };
  if (!state.engineSupported) return { allowed: false, reason: `${state.label} is chart and care plan only: ${state.engineNote ?? 'outside the engine range'}.` };
  if (!state.planSubmitted) return { allowed: false, reason: `Care plan first. Submit ${state.label}'s care plan to unlock START.` };
  return { allowed: true };
}

export function createMockOrController({
  root = (typeof document !== 'undefined' ? document : null),
  fetchImpl = (typeof fetch !== 'undefined' ? fetch : null),
  carePlan,
  onLoadPatient = () => ({ ok: true }),
  onExit = () => {},
  onStateChange = () => {},
} = {}) {
  const q = (id) => root?.getElementById?.(id) ?? null;
  const select = q('mockor-select');
  const loadButton = q('mockor-load');
  const chartButton = q('mockor-chart');
  const planButton = q('mockor-plan');
  const exitButton = q('mockor-exit');
  const statusOut = q('mockor-status');
  const chartModal = q('mockor-chart-modal');
  const chartFrame = q('mockor-chart-frame');
  const chartClose = q('mockor-chart-close');
  const chartNewTab = q('mockor-chart-newtab');
  const chartTitle = q('mockor-chart-title');

  let index = null;
  let state = { active: false };
  const cache = new Map();

  async function getJson(path) {
    if (cache.has(path)) return cache.get(path);
    if (!fetchImpl) throw new Error('fetch unavailable');
    const res = await fetchImpl(path);
    if (!res.ok) throw new Error(`${path} returned ${res.status}`);
    const data = await res.json();
    cache.set(path, data);
    return data;
  }

  function setStatus(text, kind = 'info') {
    if (!statusOut) return;
    statusOut.textContent = text;
    statusOut.dataset.kind = kind;
  }

  function describe() {
    if (!state.active) return 'Free play. No Mock OR patient loaded.';
    const gate = startGate(state);
    const grade = carePlan?.status?.().grade;
    const score = grade ? ` Plan ${grade.percent}%.` : '';
    return `${state.label} · ${state.procedure}.${score} ${gate.allowed ? 'START unlocked.' : gate.reason}`;
  }

  function publish() {
    if (chartButton) chartButton.disabled = !state.active;
    if (planButton) planButton.disabled = !state.active;
    if (exitButton) exitButton.disabled = !state.active;
    setStatus(describe(), state.active && !startGate(state).allowed ? 'warn' : 'info');
    onStateChange({ ...state });
  }

  async function init() {
    try {
      index = await getJson(`${MOCK_OR_BASE}/index.json`);
      if (select) {
        select.innerHTML = `<option value="">Choose a patient (${index.count})</option>${index.patients.map((entry) => `<option value="${esc(entry.id)}">${esc(optionLabel(entry))}</option>`).join('')}`;
      }
    } catch (error) {
      if (select) select.innerHTML = '<option value="">Mock OR list unavailable</option>';
      setStatus(`Mock OR list unavailable: ${error.message}`, 'error');
    }
    return index;
  }

  async function load(id = select?.value) {
    if (!id) { setStatus('Choose a patient first.', 'warn'); return null; }
    const entry = index?.patients?.find((row) => row.id === id);
    if (!entry) { setStatus('Unknown patient.', 'error'); return null; }
    setStatus(`Loading ${entry.label}...`);
    try {
      const [patient, answerKey] = await Promise.all([
        getJson(`${MOCK_OR_BASE}/patients/${id}.json`),
        getJson(`${MOCK_OR_BASE}/answer-keys/${id}.json`).catch(() => null),
      ]);
      const chartDigest = buildChartDigest(patient, { maxChars: 9000 });
      const planStatus = carePlan?.load({ patient, answerKey, chartDigest }) ?? { submitted: false };
      state = {
        active: true, id, label: entry.label, procedure: entry.procedure,
        engineSupported: entry.engineSupported, engineNote: entry.engineNote,
        planSubmitted: planStatus.submitted, entry, patient, answerKey,
      };
      const applied = entry.engineSupported ? onLoadPatient({ entry, patient, answerKey, config: physiologyConfig(entry) }) : { ok: true };
      if (applied && applied.ok === false) {
        setStatus(`Physiology rejected: ${applied.reason}`, 'error');
      }
      publish();
      return state;
    } catch (error) {
      setStatus(`Could not load ${entry.label}: ${error.message}`, 'error');
      return null;
    }
  }

  function openChart(id = state.id) {
    if (!id) return;
    const url = `${MOCK_OR_EHR}#${id}`;
    if (chartNewTab) chartNewTab.href = url;
    if (chartTitle) chartTitle.textContent = `Chart · ${state.label ?? id}`;
    if (chartModal) chartModal.hidden = false;
    if (chartFrame) {
      // The EHR opens a patient from its hash only on load, so a new patient
      // needs a fresh document, not just a hash change.
      if (chartFrame.dataset.patient !== id) {
        chartFrame.dataset.patient = id;
        chartFrame.src = `${MOCK_OR_EHR}?patient=${encodeURIComponent(id)}#${id}`;
      }
    }
  }

  function closeChart() { if (chartModal) chartModal.hidden = true; }

  function exit() {
    state = { active: false };
    carePlan?.clear?.();
    if (select) select.value = '';
    onExit();
    publish();
  }

  /* The student submitted from their own screen: the record is already in
     shared storage, so reread it without touching the runner. */
  function refreshPlan() {
    if (!state.active || !carePlan) return null;
    const planStatus = carePlan.load({ patient: state.patient, answerKey: state.answerKey, chartDigest: buildChartDigest(state.patient, { maxChars: 9000 }) });
    planUpdated(planStatus);
    return planStatus;
  }

  function planUpdated(planStatus) {
    if (!state.active) return;
    state.planSubmitted = Boolean(planStatus?.submitted);
    publish();
  }

  const onLoad = () => load();
  const onChart = () => openChart();
  const onPlan = () => carePlan?.open();
  const onExitClick = () => exit();
  const onChartClose = () => closeChart();
  const onBackdrop = (event) => { if (event.target === chartModal) closeChart(); };
  loadButton?.addEventListener?.('click', onLoad);
  chartButton?.addEventListener?.('click', onChart);
  planButton?.addEventListener?.('click', onPlan);
  exitButton?.addEventListener?.('click', onExitClick);
  chartClose?.addEventListener?.('click', onChartClose);
  chartModal?.addEventListener?.('click', onBackdrop);

  return {
    init, load, openChart, closeChart, exit, planUpdated, refreshPlan,
    gate: () => startGate(state),
    getState: () => ({ ...state }),
    destroy() {
      loadButton?.removeEventListener?.('click', onLoad);
      chartButton?.removeEventListener?.('click', onChart);
      planButton?.removeEventListener?.('click', onPlan);
      exitButton?.removeEventListener?.('click', onExitClick);
      chartClose?.removeEventListener?.('click', onChartClose);
      chartModal?.removeEventListener?.('click', onBackdrop);
    },
  };
}
