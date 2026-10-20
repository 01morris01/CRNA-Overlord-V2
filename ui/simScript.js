/* The instructor's side of Booth: the event plan for a Mock OR case and the
   plain language explanations the instructor reads while the case runs.

   Three jobs, all pure so they can be tested without a browser.

   1. EVENT PLAN. Each Mock OR answer key lists the complications that fit
      the chart (boothComplications), and each one names the red flags it
      tests (flags). The student's graded care plan decides what is armed:
      a complication fires on its own only when the student missed or only
      partly caught a red flag it tests. Caught items stay in the plan as
      manual triggers, and background risks (no linked flag) never fire on
      their own.

   2. EXPLANATIONS. Whenever a complication starts, gets treated, resolves,
      or fails, and whenever a vital sign drifts, the instructor gets a note
      that says what is happening, why, what to watch for, and what the
      student should do. These notes are text only. Booth's voice plays in
      the room, so nothing here is ever spoken.

   3. GUIDE. What each engine complication does to the patient and what
      resolves it, read from crisis-sim/sim/scenario/scenarioManager.js so
      the "watch for" and "resolves when" text matches the engine. */

export const COMPLICATION_GUIDE = Object.freeze({
  MalignantHyperthermia: Object.freeze({
    label: 'Malignant hyperthermia',
    signs: 'EtCO2 climbs over about 5 minutes even with more ventilation, heart rate up about 30, airway pressure a little higher, temperature creeps up later (about 1 C every 4 minutes at full crisis).',
    response: 'Volatile off, call for help and the MH cart, 100% O2 at high flow and hyperventilate, dantrolene 2.5 mg/kg and repeat, active cooling.',
    resolves: 'Dantrolene resolves it. It works half as fast while the volatile is still on.',
    when: 'Needs a trigger: a volatile running or succinylcholine given. Best during maintenance.',
    affects: ['etco2', 'hr', 'temp'],
  }),
  Anaphylaxis: Object.freeze({
    label: 'Anaphylaxis',
    signs: 'Starts partial and worsens over a few minutes untreated: MAP falls (SVR down to about half), heart rate up about 40, SpO2 falls from shunt, peak pressures rise, ongoing volume loss.',
    response: 'Stop the trigger, call for help, 100% O2, epinephrine titrated IV, fluids, then supporting drugs.',
    resolves: 'Epinephrine resolves it. Stopping the allergen helps a little. It arrests if MAP stays under 45 for 2 minutes.',
    when: 'Any drug given first. Classically minutes after the antibiotic or the neuromuscular blocker.',
    affects: ['map', 'hr', 'spo2'],
  }),
  Bronchospasm: Object.freeze({
    label: 'Bronchospasm',
    signs: 'Starts partial and worsens over a few minutes untreated: airway resistance up to 4 times normal, peak pressure rises, EtCO2 slope rises (shark fin), SpO2 falls, heart rate up about 25.',
    response: '100% O2, deepen the volatile, albuterol through the circuit, epinephrine if severe, look for a cause (light plane, tube position, anaphylaxis).',
    resolves: 'Albuterol, epinephrine, or a volatile dial of 2.5% or more resolves it. It arrests if SpO2 stays under 85 for 2 minutes.',
    when: 'Patient intubated.',
    affects: ['spo2', 'hr', 'etco2'],
  }),
  Laryngospasm: Object.freeze({
    label: 'Laryngospasm',
    signs: 'Airway closes almost completely: no ventilation, EtCO2 trace flattens, SpO2 falls, then bradycardia once SpO2 is under 85.',
    response: '100% O2 with CPAP and jaw thrust, deepen with propofol, succinylcholine if it does not break.',
    resolves: 'Succinylcholine or a deep propofol level breaks it. CPAP plus jaw thrust eases it in two steps.',
    when: 'No tube, light plane, not paralyzed, after induction started. Best at induction or right after extubation.',
    affects: ['spo2', 'etco2', 'hr'],
  }),
  OpioidRespDepression: Object.freeze({
    label: 'Opioid respiratory depression',
    signs: 'Respiratory drive drops to about a fifth: slow shallow breathing, EtCO2 rises, SpO2 falls in a patient without a tube.',
    response: 'Stimulate, open the airway and assist ventilation, naloxone in small increments.',
    resolves: 'Naloxone reverses the drive. A large naloxone dose triggers a sympathetic surge. The opioid effect lingers for a long time.',
    when: 'Fentanyl given, no tube, not paralyzed. Best in PACU style moments or sedation cases.',
    affects: ['etco2', 'spo2'],
  }),
  HighSpinal: Object.freeze({
    label: 'High spinal',
    signs: 'Builds over about 2 minutes: MAP falls (SVR down to about half), heart rate drops about 26, breathing weakens while it is severe.',
    response: 'Pressors (phenylephrine, ephedrine, epinephrine if severe), fluids, support or secure the airway.',
    resolves: 'Pressors speed recovery a lot. It slowly fades on its own.',
    when: 'Epidural local anesthetic given.',
    affects: ['map', 'hr'],
  }),
  LocalAnestheticToxicity: Object.freeze({
    label: 'Local anesthetic systemic toxicity',
    signs: 'Plasma lidocaine jumps to a toxic level: CNS signs first (agitation, seizure), then arrhythmias and hypotension.',
    response: 'Stop the local, call for help, airway and oxygen, treat seizures, 20% lipid 1.5 mL/kg bolus then infusion.',
    resolves: 'Lipid emulsion and time bring the level down.',
    when: 'Any lidocaine given (IV or regional).',
    affects: ['map', 'hr'],
  }),
  Hemorrhage: Object.freeze({
    label: 'Hemorrhage',
    signs: 'Blood volume falls steadily: heart rate rises, then MAP collapses past 30% loss.',
    response: 'Call for blood, tell the surgeon, fluids and blood products, source control.',
    resolves: 'Needs source control and volume, and the live console has no button for either. Use it for a conversation, not a rescue.',
    when: 'Any time during the surgery.',
    affects: ['map', 'hr'],
  }),
  TensionPneumothorax: Object.freeze({
    label: 'Tension pneumothorax',
    signs: 'SpO2 falls, MAP falls, high airway pressures, heart rate up about 35.',
    response: 'Needle decompression, then a chest tube.',
    resolves: 'The live console has no decompression button. Use it for a conversation, not a rescue.',
    when: 'Any time, classically after central line placement or with positive pressure.',
    affects: ['spo2', 'map', 'hr'],
  }),
  VentricularFibrillation: Object.freeze({
    label: 'Ventricular fibrillation',
    signs: 'Pulseless arrest.',
    response: 'CPR, defibrillation, ACLS.',
    resolves: 'The live console has no defibrillation or compression button.',
    when: 'Any time.',
    affects: ['map', 'hr', 'spo2'],
  }),
});

// The live console can actually rescue these.
export const CONSOLE_RESCUABLE = Object.freeze([
  'MalignantHyperthermia', 'Anaphylaxis', 'Bronchospasm', 'Laryngospasm',
  'OpioidRespDepression', 'HighSpinal', 'LocalAnestheticToxicity',
]);

export const RUN_MODES = Object.freeze([
  Object.freeze({ id: 'booth', label: 'BOOTH RUNS IT', help: 'Booth picks the moment and starts armed events on his own. You get a note every time he does.' }),
  Object.freeze({ id: 'instructor', label: 'I RUN IT', help: 'Nothing starts on its own. Booth tells you when each event is ready, and you press TRIGGER.' }),
]);

export function guideFor(type) {
  return COMPLICATION_GUIDE[type] ?? { label: String(type ?? 'Unknown'), signs: '', response: '', resolves: '', when: '', affects: [] };
}

export function formatClock(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function quote(text) {
  return `"${String(text ?? '').replace(/\.$/, '')}"`;
}

/* The event plan for one Mock OR case. grade is the care plan grade
   (carePlanSheet gradeCarePlan or the judged grade), null when no plan was
   submitted. */
export function buildEventPlan({ answerKey = null, grade = null } = {}) {
  const items = Array.isArray(answerKey?.boothComplications) ? answerKey.boothComplications : [];
  const flagsById = new Map((answerKey?.redFlags ?? []).map((flag) => [flag.id, flag]));
  const statusById = new Map((grade?.redFlags ?? []).map((flag) => [flag.id, flag.status]));
  const seen = new Set();
  const events = [];
  for (const item of items) {
    if (!item?.type || seen.has(item.type)) continue;
    seen.add(item.type);
    const flags = (Array.isArray(item.flags) ? item.flags : [])
      .filter((id) => flagsById.has(id))
      .map((id) => ({
        id,
        finding: flagsById.get(id).finding,
        severity: flagsById.get(id).severity,
        status: grade ? (statusById.get(id) ?? 'missed') : null,
      }));
    const missed = flags.filter((flag) => flag.status === 'missed');
    const partial = flags.filter((flag) => flag.status === 'partial');
    let state;
    let reason;
    if (flags.length === 0) {
      state = 'background';
      reason = 'Background risk for this chart, not tied to anything in the care plan. Booth will not start it on his own.';
    } else if (!grade) {
      state = 'armed';
      reason = `No graded care plan yet, so ${flags.map((flag) => quote(flag.finding)).join(' and ')} counts as not caught.`;
    } else if (missed.length > 0 || partial.length > 0) {
      state = 'armed';
      const parts = [];
      if (missed.length > 0) parts.push(`missed ${missed.map((flag) => quote(flag.finding)).join(' and ')}`);
      if (partial.length > 0) parts.push(`only partly caught ${partial.map((flag) => quote(flag.finding)).join(' and ')}`);
      reason = `The student ${parts.join(', and ')} in the care plan.`;
    } else {
      state = 'caught';
      reason = `The student caught ${flags.map((flag) => quote(flag.finding)).join(' and ')} in the care plan, so Booth holds this one. Trigger it by hand if you want it anyway.`;
    }
    const rescuable = CONSOLE_RESCUABLE.includes(item.type);
    events.push({
      id: item.type,
      type: item.type,
      label: guideFor(item.type).label,
      why: item.why ? String(item.why) : '',
      flags,
      state,
      reason,
      rescuable,
      autoAllowed: state === 'armed' && rescuable,
    });
  }
  const order = { armed: 0, caught: 1, background: 2 };
  return events.sort((a, b) => order[a.state] - order[b.state]);
}

export function summarizeEventPlan(events = []) {
  if (events.length === 0) return 'No event plan. Free play: Booth picks from anything that fits the moment.';
  const armed = events.filter((event) => event.autoAllowed).length;
  const caught = events.filter((event) => event.state === 'caught').length;
  const background = events.filter((event) => event.state === 'background').length;
  const parts = [`${armed} armed`];
  if (caught > 0) parts.push(`${caught} caught by the student`);
  if (background > 0) parts.push(`${background} background`);
  return `${parts.join(', ')}.${armed === 0 ? ' Nothing will start on its own. Use TRIGGER to run one anyway.' : ''}`;
}

const SOURCE_NAMES = Object.freeze({
  booth: 'Booth',
  timeline: 'You (event plan)',
  instructor: 'You',
});

/* Note for the instructor when a complication starts. */
/* The guide describes the realistic clock; INSTANT drops the timing words. */
export function instantSigns(text) {
  const cleaned = String(text)
    .replace(/^(Starts partial and worsens over a few minutes untreated|Builds over about 2 minutes):\s*/i, '')
    .replace(/\s*over about 5 minutes/i, '')
    .replace(/\s*\(about 1 C every 4 minutes at full crisis\)/i, '');
  return `All at once. ${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)}`;
}

export const GRADUAL_TYPES = Object.freeze(['MalignantHyperthermia', 'Anaphylaxis', 'Bronchospasm', 'HighSpinal']);

export function describeInjection({ type, source = 'instructor', tSec = 0, event = null, freePlay = false, onset = null } = {}) {
  const guide = guideFor(type);
  const who = SOURCE_NAMES[source] ?? 'You';
  let why;
  if (event) {
    why = `${event.reason}${event.why ? ` Chart risk: ${event.why}.` : ''}`;
  } else if (source === 'booth') {
    why = freePlay
      ? 'Free play, no case event plan. The patient had been calm long enough and this fits what has happened so far.'
      : 'Fits the moment.';
  } else {
    why = 'Started by hand. It is not part of this case\'s event plan.';
  }
  return {
    kind: 'event',
    severity: 'critical',
    tSec,
    type,
    title: `${who} started ${guide.label}${onset === 'instant' && GRADUAL_TYPES.includes(type) ? ' (instant)' : ''} at ${formatClock(tSec)}`,
    lines: [
      ['Why', why],
      ...(GRADUAL_TYPES.includes(type) ? [['Onset', onset === 'instant' ? 'Instant: full severity now, to show the concept.' : 'Realistic: it builds over the next few minutes.']] : []),
      ['Watch for', onset === 'instant' && GRADUAL_TYPES.includes(type) ? instantSigns(guide.signs) : guide.signs],
      ['Student should', guide.response],
      ['Resolves when', guide.resolves],
    ].filter(([, text]) => text),
  };
}

export function describeTreatment({ type, tSec, startedAtSec, drug = null, action = null }) {
  const guide = guideFor(type);
  const delay = Number.isFinite(startedAtSec) ? Math.max(0, Math.round(tSec - startedAtSec)) : null;
  const what = drug ?? (action ? action.replaceAll('_', ' ') : 'a rescue');
  return {
    kind: 'treated', severity: 'good', tSec, type,
    title: `Student treated ${guide.label} with ${what}${delay === null ? '' : `, ${delay} seconds after it started`}`,
    lines: [['Next', 'Watch the vitals come back. Debrief what tipped them off and how fast they called it.']],
  };
}

export function describeResolution({ type, tSec, startedAtSec, treated }) {
  const guide = guideFor(type);
  const delay = Number.isFinite(startedAtSec) ? Math.max(0, Math.round(tSec - startedAtSec)) : null;
  return {
    kind: 'resolved', severity: 'good', tSec, type,
    title: `${guide.label} resolved${delay === null ? '' : ` after ${delay} seconds`}`,
    lines: [['Debrief', treated ? 'Ask what they saw first and why they picked their rescue.' : 'It resolved without a targeted rescue. Ask what they would have given.']],
  };
}

export function describeFailure({ text, tSec }) {
  return {
    kind: 'failure', severity: 'critical', tSec,
    title: `Engine failure: ${text}`,
    lines: [['What it means', 'The complication went untreated past the engine limit and the patient arrested. Pause, debrief, or reset.']],
  };
}

/* Early warning thresholds for the instructor, well before Booth's spoken
   complaints. Each fires once on entry and rearms on exit. */
export const INSTRUCTOR_WATCH = Object.freeze([
  Object.freeze({ id: 'etco2', label: 'EtCO2 rising', value: (s) => `EtCO2 ${Math.round(s.etco2)}`,
    enter: (s) => s.capnogramPresent !== false && s.etco2 > 50, exit: (s) => s.etco2 <= 46 }),
  Object.freeze({ id: 'spo2', label: 'SpO2 falling', value: (s) => `SpO2 ${Math.round(s.spo2)}`,
    enter: (s) => s.spo2 < 92, exit: (s) => s.spo2 >= 95 }),
  Object.freeze({ id: 'map', label: 'Hypotension', value: (s) => `MAP ${Math.round(s.map)}`,
    enter: (s) => s.map < 65, exit: (s) => s.map >= 70 }),
  Object.freeze({ id: 'hrHigh', label: 'Tachycardia', value: (s) => `HR ${Math.round(s.hr)}`, kind: 'hr',
    enter: (s) => s.hr > 115, exit: (s) => s.hr <= 105 }),
  Object.freeze({ id: 'hrLow', label: 'Bradycardia', value: (s) => `HR ${Math.round(s.hr)}`, kind: 'hr',
    enter: (s) => s.hr < 50, exit: (s) => s.hr >= 55 }),
  Object.freeze({ id: 'temp', label: 'Temperature rising', value: (s) => `Temp ${Number(s.temp).toFixed(1)}`,
    enter: (s) => s.temp >= 38, exit: (s) => s.temp <= 37.6 }),
]);

function fin(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

const pct = (value) => `${Math.round(value * 100)}%`;
const fixed1 = (value) => Number(value).toFixed(1);

/* Why a vital sign is where it is, from engine values only. kind is one of
   etco2, spo2, map, hr, temp. active lists running complications with who
   started them. */
export function explainCauses(kind, s = {}, { restingVco2 = 200, active = [] } = {}) {
  const causes = [];
  for (const entry of active) {
    const guide = guideFor(entry.type);
    if (!guide.affects.includes(kind)) continue;
    const who = SOURCE_NAMES[entry.source] ?? 'You';
    causes.push(`${guide.label} is running (${who === 'Booth' ? 'Booth started it' : 'started by you'} at ${formatClock(entry.tSec)}).`);
  }
  const lowMv = fin(s.effectiveMV) && s.effectiveMV < 4;
  const mvReason = () => {
    if (s.airwayDevice === 'mask' && !s.ppvActive && fin(s.respDrive) && s.respDrive < 0.6) return 'respiratory drive is depressed and nobody is bagging';
    if (fin(s.effectiveNmbBlockade) && s.effectiveNmbBlockade > 0.5 && Number(s.ventMode) === 0) return 'the patient is paralyzed and the ventilator is in manual mode';
    if (fin(s.respDrive) && s.respDrive < 0.6) return 'respiratory drive is depressed (drugs or a complication)';
    return 'ventilation is low for the CO2 load';
  };
  switch (kind) {
    case 'etco2':
      if (fin(s.vco2) && restingVco2 > 0 && s.vco2 > restingVco2 * 1.3) causes.push(`CO2 production is ${fixed1(s.vco2 / restingVco2)} times baseline (hypermetabolism).`);
      if (lowMv) causes.push(`Minute ventilation is only ${fixed1(s.effectiveMV)} L/min because ${mvReason()}.`);
      if (fin(s.airwayRes) && s.airwayRes > 2) causes.push(`Airway resistance is ${fixed1(s.airwayRes)} times normal, so exhalation is obstructed.`);
      break;
    case 'spo2':
      if (fin(s.shunt) && s.shunt > 0.12) causes.push(`Shunt is ${pct(s.shunt)} (V/Q mismatch).`);
      if (lowMv) causes.push(`Minute ventilation is only ${fixed1(s.effectiveMV)} L/min because ${mvReason()}.`);
      if (fin(s.fio2) && s.fio2 < 0.3) causes.push(`FiO2 is ${pct(s.fio2)}.`);
      break;
    case 'map':
      if (fin(s.svr) && s.svr < 0.8) causes.push(`SVR is ${pct(s.svr)} of normal (vasodilation).`);
      if (fin(s.vol) && s.vol < 0.85) causes.push(`Blood volume is down to ${pct(s.vol)}.`);
      if (fin(s.mac) && s.mac > 1.2) causes.push(`Volatile is at ${Number(s.mac).toFixed(2)} MAC.`);
      if (fin(s.propofolCe) && s.propofolCe > 2.5) causes.push(`Propofol effect site is ${fixed1(s.propofolCe)} mcg/mL.`);
      break;
    case 'hr':
      if (fin(s.hrOffset) && Math.abs(s.hrOffset) > 10) causes.push(`A complication is shifting heart rate by ${Math.round(s.hrOffset)} beats.`);
      if (fin(s.spo2) && s.spo2 < 85) causes.push(`SpO2 is ${Math.round(s.spo2)}, so hypoxia is driving the rate.`);
      if (fin(s.surgicalStimulusEffective) && s.surgicalStimulusEffective > 0.5 && (!fin(s.mac) || s.mac < 0.8)) causes.push('Surgical stimulus is high and the anesthetic is light.');
      if (fin(s.map) && s.map < 60 && s.hr > 100) causes.push('Compensating for a low MAP.');
      break;
    case 'temp':
      if (fin(s.heat) && s.heat > 0.3) causes.push('Heat load is building (hypermetabolism).');
      break;
    default:
  }
  if (causes.length === 0) {
    causes.push(active.length === 0
      ? 'No complication is running. This is the patient\'s physiology responding to the current drugs and settings.'
      : 'Nothing running explains it directly. Check drugs, depth, and ventilator settings.');
  }
  return causes;
}

export function describeVitalChange(watch, s, context = {}) {
  const kind = watch.kind ?? watch.id;
  return {
    kind: 'vital', severity: 'warn', tSec: s.t ?? 0,
    title: `${watch.label}: ${watch.value(s)}`,
    lines: [['Why', explainCauses(kind, s, context).join(' ')]],
  };
}

/* Detects a steady EtCO2 climb before it crosses a threshold: at least
   8 mmHg over the last 60 sim seconds. */
export function createTrendWatch({ windowSec = 60, riseMmHg = 8 } = {}) {
  let samples = [];
  let firedAt = -Infinity;
  return {
    reset() { samples = []; firedAt = -Infinity; },
    observe(s) {
      if (!fin(s?.t) || !fin(s?.etco2) || s.capnogramPresent === false) return null;
      samples.push({ t: s.t, v: s.etco2 });
      samples = samples.filter((sample) => s.t - sample.t <= windowSec);
      if (samples.length < 4 || s.t - firedAt < windowSec * 2) return null;
      const lowest = Math.min(...samples.map((sample) => sample.v));
      if (s.etco2 - lowest >= riseMmHg && s.etco2 <= 50) {
        firedAt = s.t;
        return { rise: Math.round(s.etco2 - lowest) };
      }
      return null;
    },
  };
}

/* Offline answer for the instructor's own questions: no attitude, no
   secrets kept, built only from the faculty context. */
export function buildFacultyAnswer(context = {}, question = '') {
  const v = context.vitals ?? {};
  const parts = [];
  const vitals = [];
  if (fin(v.hr)) vitals.push(`HR ${v.hr}`);
  if (fin(v.map)) vitals.push(`MAP ${v.map}`);
  if (fin(v.spo2)) vitals.push(`SpO2 ${v.spo2}`);
  if (fin(v.etco2)) vitals.push(`EtCO2 ${v.etco2}`);
  if (fin(v.temp)) vitals.push(`temp ${v.temp}`);
  parts.push(`Offline answer (no language model). Now: ${vitals.length > 0 ? vitals.join(', ') : 'case not started'}.`);
  const running = (context.injections ?? []).filter((entry) => entry.resolvedAtSec === null);
  if (running.length > 0) {
    for (const entry of running) {
      const guide = guideFor(entry.type);
      parts.push(`${guide.label} is running since ${formatClock(entry.injectedAtSec)} (${entry.source === 'booth' ? 'Booth' : 'you'}). ${entry.treatedAtSec === null ? 'Not treated yet.' : `Treated at ${formatClock(entry.treatedAtSec)}.`} Student should: ${guide.response}`);
    }
  } else {
    parts.push('No complication is running.');
  }
  const why = context.instructorNotes?.find((note) => note.kind === 'vital');
  if (why && /why|etco2|co2|sat|spo2|pressure|map|heart|hr|temp/i.test(question)) parts.push(`Latest explanation: ${why.title}. ${why.lines?.[0]?.[1] ?? ''}`);
  const armed = (context.eventPlan ?? []).filter((event) => event.autoAllowed && !event.fired);
  if (armed.length > 0) parts.push(`Still armed: ${armed.map((event) => event.label).join(', ')}.`);
  return parts.join(' ');
}
