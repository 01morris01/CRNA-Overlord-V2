/* Booth: the sim operator.

   A sarcastic sim tech who sits in the control booth and runs the live case.
   Two jobs, kept apart on purpose.

   1. DIRECTOR (runs the sim). Adaptive pacing modeled on Valve's Left 4 Dead
      AI Director (Booth, GDC 2009): estimate how unstable the patient is
      ("intensity"), inject a complication only after a calm stretch, never
      stack a second crisis on a live one, and enforce a relax window after
      the trainee wins. Every injection goes through runner.injectComplication,
      the same verified ScenarioManager path as the instructor buttons. Booth
      never writes a vital or a physiologic driver.

   2. MOUTH (talks trash). Rule based barks modeled on Valve's dynamic dialog
      system (Ruskin, GDC 2012): each moment becomes a query of facts, the most
      specific matching rule wins, and rules carry cooldowns and said once
      memory. Barks are deterministic and offline, so they cost nothing and
      cannot invent facts. Every number Booth quotes is read from the snapshot.

   Guardrails, from Riskin et al., Pediatrics 2015 (rudeness lowered NICU team
   diagnostic and procedural performance by cutting information sharing and
   help seeking):
   - Booth mocks actions and outcomes, never the person.
   - Pausing and calling for help are never punished; at every meanness level
     the arrest and failed airway lines tell the trainee to call for help.
   - Booth never names a complication he injected until the trainee treats
     it or it resolves, so his commentary cannot hand over the diagnosis.
   - With a Carson-Newman rubric or a teaching case loaded, Booth only talks.
     Injecting there would corrupt the scored record.
*/

export const OPERATOR_NAME = 'Booth';

export const MEANNESS_LEVELS = Object.freeze([
  Object.freeze({ id: 1, label: 'DRY' }),
  Object.freeze({ id: 2, label: 'SALTY' }),
  Object.freeze({ id: 3, label: 'SAVAGE' }),
]);

// Durations are simulation seconds so pacing scales with the speed selector.
export const CHAOS_PROFILES = Object.freeze({
  0: Object.freeze({ id: 0, label: 'COMMENTARY ONLY', maxInjections: 0 }),
  1: Object.freeze({
    id: 1, label: 'ROUTINE', maxInjections: 1, firstCalmSec: 240, buildCalmSec: 180, relaxSec: [240, 360],
  }),
  2: Object.freeze({
    id: 2, label: 'BUSY', maxInjections: 2, firstCalmSec: 180, buildCalmSec: 120, relaxSec: [150, 240],
  }),
  3: Object.freeze({
    id: 3, label: 'HOSTILE', maxInjections: 4, firstCalmSec: 120, buildCalmSec: 75, relaxSec: [90, 150],
  }),
});

// How much Booth talks between events. Gaps are wall clock milliseconds of
// silence before he fills it, so he keeps talking at any sim speed.
export const CHATTER_LEVELS = Object.freeze([
  Object.freeze({ id: 0, label: 'EVENTS ONLY', gapMs: null }),
  Object.freeze({ id: 1, label: 'STEADY', gapMs: [12000, 18000] }),
  Object.freeze({ id: 2, label: 'NONSTOP', gapMs: [5000, 8000] }),
]);

export const CALM_INTENSITY = 0.12;
export const PEAK_INTENSITY = 0.55;
const PEAK_FADE_HOLD_SEC = 30;
const FORCE_SOON_SEC = 20;
const IDLE_LIMIT_SEC = 60;

export const COMPLICATION_LABELS = Object.freeze({
  Bronchospasm: 'bronchospasm',
  HighSpinal: 'high spinal',
  Anaphylaxis: 'anaphylaxis',
  MalignantHyperthermia: 'malignant hyperthermia',
  OpioidRespDepression: 'opioid respiratory depression',
  Hemorrhage: 'hemorrhage',
  Laryngospasm: 'laryngospasm',
  LocalAnestheticToxicity: 'local anesthetic systemic toxicity',
  TensionPneumothorax: 'tension pneumothorax',
  VentricularFibrillation: 'ventricular fibrillation',
  NaloxoneSurge: 'naloxone surge',
});

// What the director may pick. Each entry has a plausibility gate (it has to
// make clinical sense right now) and must be winnable with a control that
// exists in the live console.
export const DIRECTOR_COMPLICATIONS = Object.freeze([
  Object.freeze({
    type: 'Laryngospasm',
    rescue: 'Succinylcholine, or deepen with propofol',
    // Laryngospasm needs a light, unblocked plane: a paralyzed larynx can't
    // spasm, and the engine breaks it immediately at deep propofol levels.
    plausible: (s, h) => s.airwayDevice !== 'intubated'
      && (s.effectiveNmbBlockade ?? 0) < 0.3
      && (s.propofolCe ?? 0) < 1.2
      && (h.drugsGiven.size > 0 || (s.vaporizer ?? 0) > 0 || h.wasIntubated),
  }),
  Object.freeze({
    type: 'Bronchospasm',
    rescue: 'Albuterol, epinephrine, or deepen the volatile',
    plausible: (s) => s.airwayDevice === 'intubated',
  }),
  Object.freeze({
    type: 'MalignantHyperthermia',
    rescue: 'Volatile off plus dantrolene',
    plausible: (s, h) => (s.vaporizer ?? 0) > 0 || h.drugsGiven.has('Succinylcholine'),
  }),
  Object.freeze({
    type: 'Anaphylaxis',
    rescue: 'Epinephrine',
    plausible: (s, h) => h.drugsGiven.size > 0,
  }),
  Object.freeze({
    type: 'OpioidRespDepression',
    rescue: 'Naloxone titrated in small doses',
    plausible: (s, h) => h.drugsGiven.has('Fentanyl') && s.airwayDevice !== 'intubated'
      && (s.effectiveNmbBlockade ?? 0) < 0.3,
  }),
  Object.freeze({
    type: 'HighSpinal',
    rescue: 'Phenylephrine or ephedrine',
    plausible: (s, h) => h.epiduralGiven,
  }),
  Object.freeze({
    type: 'LocalAnestheticToxicity',
    rescue: '20% lipid emulsion',
    plausible: (s) => (s.lidocaineCumulativeMg ?? 0) > 0,
  }),
]);

// Kept off the director's list because the live console has no way to fix them.
export const DIRECTOR_EXCLUDED = Object.freeze({
  Hemorrhage: 'No fluid, blood, or source control action exists in the live console.',
  TensionPneumothorax: 'No needle decompression action exists in the live console.',
  VentricularFibrillation: 'No defibrillation or compression action exists in the live console.',
});

// Drugs and actions that count as treating each complication. Treating one
// is what lets Booth say its name out loud.
export const TREATMENTS = Object.freeze({
  MalignantHyperthermia: Object.freeze({ drugs: ['Dantrolene'], actions: [] }),
  Anaphylaxis: Object.freeze({ drugs: ['Epinephrine'], actions: [] }),
  Bronchospasm: Object.freeze({ drugs: ['Albuterol', 'Epinephrine'], actions: [] }),
  Laryngospasm: Object.freeze({ drugs: ['Succinylcholine', 'Propofol'], actions: [] }),
  OpioidRespDepression: Object.freeze({ drugs: ['Naloxone'], actions: [] }),
  HighSpinal: Object.freeze({ drugs: ['Phenylephrine', 'Ephedrine', 'Epinephrine'], actions: [] }),
  LocalAnestheticToxicity: Object.freeze({
    drugs: [], actions: ['lipid_emulsion_bolus', 'lipid_emulsion_infusion_started'],
  }),
});

function finite(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

/* Patient instability on a 0 to 1 scale, from engine derived values only.
   The worst single derangement dominates; the rest add a little. */
export function computeIntensity(s = {}) {
  const terms = [];
  const add = (value) => terms.push(clamp01(value));
  if (finite(s.spo2)) add((94 - s.spo2) / 20);
  if (finite(s.map)) {
    add((65 - s.map) / 25);
    add((s.map - 120) / 40);
  }
  if (finite(s.hr)) {
    add((s.hr - 120) / 40);
    add((50 - s.hr) / 20);
  }
  if (finite(s.etco2) && s.capnogramPresent !== false) add((s.etco2 - 50) / 25);
  if (finite(s.temp)) add((s.temp - 38) / 1.5);
  if (s.derivedRhythm === 'ventricular_fibrillation') add(1);
  else if (s.derivedRhythm === 'ventricular_tachycardia') add(0.8);
  else if (s.derivedRhythm === 'ventricular_ectopy') add(0.3);
  if (s.lidocaineToxicityStage === 'cardiac') add(0.8);
  else if (s.lidocaineToxicityStage === 'cns') add(0.5);
  else if (s.lidocaineToxicityStage === 'warning') add(0.2);
  if (terms.length === 0) return 0;
  const worst = Math.max(...terms);
  const total = terms.reduce((sum, value) => sum + value, 0);
  return Math.min(1, worst + 0.3 * (total - worst));
}

/* The single most deranged engine value, phrased for Booth to read out
   ("MAP 58"). Null when everything is within the calm range. */
export function worstFinding(s = {}) {
  const candidates = [];
  const push = (score, text) => { if (score > 0) candidates.push({ score: clamp01(score), text }); };
  if (s.derivedRhythm === 'ventricular_fibrillation') push(1, 'Ventricular fibrillation');
  else if (s.derivedRhythm === 'ventricular_tachycardia') push(0.8, 'Ventricular tachycardia on the monitor');
  if (finite(s.spo2)) push((94 - s.spo2) / 20, `SpO2 ${Math.round(s.spo2)}`);
  if (finite(s.map)) {
    push((65 - s.map) / 25, `MAP ${Math.round(s.map)}`);
    push((s.map - 120) / 40, `MAP ${Math.round(s.map)}`);
  }
  if (finite(s.hr)) {
    push((s.hr - 120) / 40, `Heart rate ${Math.round(s.hr)}`);
    push((50 - s.hr) / 20, `Heart rate ${Math.round(s.hr)}`);
  }
  if (finite(s.etco2) && s.capnogramPresent !== false) push((s.etco2 - 50) / 25, `EtCO2 ${Math.round(s.etco2)}`);
  if (finite(s.temp)) push((s.temp - 38) / 1.5, `Temp ${s.temp.toFixed(1)}`);
  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => b.score - a.score)[0].text;
}

export function caseStage(s = {}, history = {}) {
  const drugs = history.drugsGiven ?? new Set();
  if (s.airwayDevice === 'extubated' || drugs.has('Sugammadex') || drugs.has('Neostigmine')) return 'emergence';
  if (s.airwayDevice === 'intubated') return 'maintenance';
  if (drugs.size === 0 && !((s.vaporizer ?? 0) > 0)) return 'preinduction';
  return 'induction';
}

// Complications that should hold the director back. Opioid depression lingers
// in the state machine for hours of sim time, so once naloxone has restored
// drive it stops counting as an open crisis.
export function gatingComplications(active = [], s = {}) {
  return active.filter((type) => !(type === 'OpioidRespDepression' && (s.respDrive ?? 0) >= 0.85));
}

// Sim seconds after a drug is given before Booth treats the patient as settled.
export const DRUG_SETTLE_SEC = 60;

export function eligibleComplications(s, history, { active = [], used = [] } = {}) {
  // Never strike while a drug is still in flight: the picture isn't steady yet
  // and the trainee couldn't tell cause from effect.
  if (finite(history.lastDrugT) && finite(s.t) && s.t - history.lastDrugT < DRUG_SETTLE_SEC) return [];
  const live = new Set(active);
  const candidates = DIRECTOR_COMPLICATIONS
    .filter((entry) => !live.has(entry.type) && entry.plausible(s, history));
  const fresh = candidates.filter((entry) => !used.includes(entry.type));
  return (fresh.length > 0 ? fresh : candidates).map((entry) => entry.type);
}

/* Pacing state machine. update() returns { inject: type } when Booth decides
   to act; the caller performs the injection through the runner. */
export function createDirector({ random = Math.random } = {}) {
  let state;
  function reset() {
    state = {
      phase: 'BUILD_UP', calmForSec: 0, fadeCalmSec: 0, relaxUntilSec: 0,
      injected: [], forceSoon: false, extra: 0, intensity: 0,
    };
  }
  reset();

  function update({ snapshot, dt, intensity, profile, active, history, enabled }) {
    state.intensity = intensity;
    if (!enabled || !profile || profile.maxInjections === 0) return null;
    const cap = profile.maxInjections + state.extra;
    const gating = gatingComplications(active, snapshot);
    const t = snapshot.t ?? 0;

    switch (state.phase) {
      case 'BUILD_UP': {
        if (intensity >= PEAK_INTENSITY) {
          // The trainee built their own crisis. Back off like the L4D director does.
          state.phase = 'PEAK';
          state.calmForSec = 0;
          return null;
        }
        if (gating.length > 0 || intensity >= CALM_INTENSITY) {
          state.calmForSec = 0;
          return null;
        }
        state.calmForSec += dt;
        if (state.injected.length >= cap) {
          state.phase = 'DONE';
          return null;
        }
        const baseRequired = state.injected.length === 0 ? profile.firstCalmSec : profile.buildCalmSec;
        const required = state.forceSoon ? Math.min(baseRequired, FORCE_SOON_SEC) : baseRequired;
        if (state.calmForSec < required) return null;
        const pool = eligibleComplications(snapshot, history, { active, used: state.injected });
        if (pool.length === 0) return null;
        const type = pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))];
        state.injected.push(type);
        state.phase = 'PEAK';
        state.calmForSec = 0;
        state.forceSoon = false;
        return { inject: type };
      }
      case 'PEAK': {
        if (gating.length === 0 && intensity < PEAK_INTENSITY) {
          state.phase = 'PEAK_FADE';
          state.fadeCalmSec = 0;
        }
        return null;
      }
      case 'PEAK_FADE': {
        if (gating.length > 0 || intensity >= PEAK_INTENSITY) {
          state.phase = 'PEAK';
          return null;
        }
        state.fadeCalmSec = intensity < CALM_INTENSITY ? state.fadeCalmSec + dt : 0;
        if (state.fadeCalmSec >= PEAK_FADE_HOLD_SEC) {
          const [low, high] = profile.relaxSec;
          state.relaxUntilSec = t + low + random() * (high - low);
          state.phase = 'RELAX';
        }
        return null;
      }
      case 'RELAX': {
        if (intensity >= PEAK_INTENSITY) {
          state.phase = 'PEAK';
          return null;
        }
        if (t >= state.relaxUntilSec) {
          state.phase = state.injected.length >= cap ? 'DONE' : 'BUILD_UP';
          state.calmForSec = 0;
        }
        return null;
      }
      default:
        return null;
    }
  }

  return {
    update,
    reset,
    // The trainee asked for it: shorten the wait, and grant one more
    // complication if the case already hit its cap.
    forceSoon() {
      state.forceSoon = true;
      if (state.phase === 'RELAX') state.relaxUntilSec = 0;
      if (state.phase === 'DONE') {
        state.extra += 1;
        state.phase = 'BUILD_UP';
      }
    },
    raiseCap() {
      if (state.phase === 'DONE') state.phase = 'BUILD_UP';
    },
    getState() { return { ...state, injected: [...state.injected] }; },
  };
}

/* ── Bark library ────────────────────────────────────────────────────────
   Each rule: concept, optional when(query), score (higher is more specific),
   lines as [heat, text]. Heat 1 lines are dry, heat 3 lines are savage.
   Templates fill from engine values: {spo2} {map} {hr} {etco2} {temp}
   {tofRatio} {tof} {attempts} {complication} {name}. No line here invents a
   number; every clinical claim is standard teaching. */
// Standard board facts Booth drops during quiet stretches. Kept to well
// established teaching (MHAUS, ASRA, FDA labeling) and to doses the console uses.
export const PEARLS = Object.freeze([
  'sevoflurane MAC is about 2 percent in a middle aged adult, and MAC falls with age.',
  'the TOF ratio should be at least 0.9 before extubation.',
  'neostigmine can\'t reverse a deep block. You need twitches first.',
  'early malignant hyperthermia usually shows up as rising EtCO2 and tachycardia. The temperature climbs later.',
  'dantrolene starts at 2.5 mg per kg and repeats until the signs settle.',
  'laryngospasm breaks with positive pressure, deepening, or succinylcholine.',
  'in anaphylaxis, epinephrine is the drug. Antihistamines are supporting cast.',
  'lipid rescue for local anesthetic toxicity starts with a 1.5 mL per kg bolus of 20 percent emulsion.',
  'good preoxygenation means an end tidal oxygen of about 90 percent before apnea.',
  'succinylcholine and the volatile agents are the classic MH triggers.',
  'phenylephrine raises pressure and often drops the heart rate by reflex.',
  'naloxone gets titrated in small increments so you restore breathing without a sympathetic surge.',
]);

export const BARK_RULES = Object.freeze([
  // Case flow
  { id: 'case_start', concept: 'CASE_START', score: 1, once: true, lines: [
    [1, '{name} here. I run the room. You run the patient. Try to keep it that way.'],
    [2, 'Monitors on, mics hot. Everything you do is being recorded for my personal enjoyment.'],
    [3, 'Fresh trainee. My favorite. Let\'s see how long the patient lasts.'],
  ] },
  { id: 'paused', concept: 'PAUSED', score: 1, cooldownMs: 60000, lines: [
    [1, 'Paused. Good. Think it through. I\'ll wait.'],
    [2, 'Paused. Smartest thing you\'ve done all case. Take the minute.'],
    [3, 'Pause away. Thinking is allowed in here. Encouraged, even.'],
  ] },

  // Airway and induction
  { id: 'preox', concept: 'PREOX', score: 1, once: true, lines: [
    [1, 'Preoxygenating. Look at you, respecting the FRC.'],
    [2, 'Hundred percent at ten liters. Your future self thanks you. I wanted a show.'],
    [3, 'Preox. Responsible. Boring. Fine.'],
  ] },
  { id: 'no_preox', concept: 'INTUBATION_START', score: 2, once: true, when: (q) => !q.preoxygenated, lines: [
    [1, 'Going for the tube without preoxygenating. Apnea on room air gets ugly fast. Watch that sat.'],
    [2, 'No preox and you\'re reaching for the blade. Bold. The oxygen reserve you skipped was the whole safety margin.'],
    [3, 'Skipped preox. Love that for me. SpO2 is {spo2} and the clock just started.'],
  ] },
  { id: 'propofol', concept: 'DRUG', score: 2, cooldownMs: 90000, when: (q) => q.drug === 'Propofol', lines: [
    [1, 'Propofol in. Watch the pressure over the next minute.'],
    [2, 'Propofol on board. MAP check incoming, unless you like surprises.'],
    [3, 'Milk of amnesia, served. Now babysit that blood pressure, champ.'],
  ] },
  { id: 'roc', concept: 'DRUG', score: 2, cooldownMs: 90000, when: (q) => q.drug === 'Rocuronium', lines: [
    [1, 'Roc is in. You own this airway now.'],
    [2, 'Rocuronium. You own the airway now. No take backs.'],
    [3, 'Paralyzed. Can\'t breathe, can\'t complain. Your move, hotshot.'],
  ] },
  { id: 'sux', concept: 'DRUG', score: 2, cooldownMs: 90000, when: (q) => q.drug === 'Succinylcholine' && !q.treating, lines: [
    [1, 'Sux in. Fasciculations, then the clock is ticking.'],
    [2, 'Succinylcholine. Fasciculations, then a short window. Don\'t waste it.'],
    [3, 'Sux is in. The patient is twitching more than your hands. Barely.'],
  ] },
  { id: 'intubation_failed_repeat', concept: 'INTUBATION_FAILED', score: 3, when: (q) => q.failedAttempts >= 2, lines: [
    [1, 'Attempt {attempts} failed. Call for help, oxygenate, and change something before you go again.'],
    [2, 'Strike {attempts}. Call for help. Change position, blade, or device. Same move, same miss.'],
    [3, 'Strike {attempts}. Call for help right now. Repeating the same attempt is how airways turn into incident reports.'],
  ] },
  { id: 'intubation_failed', concept: 'INTUBATION_FAILED', score: 2, lines: [
    [1, 'Missed. Mask ventilate and reoxygenate before you try again.'],
    [2, 'Esophagus says hi. Bag the patient, then reset. Don\'t keep stabbing.'],
    [3, 'That tube went somewhere. Not the trachea. Bag them before round two, Picasso.'],
  ] },
  { id: 'intubation_first_pass', concept: 'INTUBATION_SUCCESS', score: 2, when: (q) => q.failedAttempts === 0, lines: [
    [1, 'First pass. Confirm it with EtCO2 before you celebrate.'],
    [2, 'First pass. Fine. I\'ll allow it. Waveform capnography or it didn\'t happen.'],
    [3, 'First pass? Who are you and what did you do with the trainee?'],
  ] },
  { id: 'intubation_success', concept: 'INTUBATION_SUCCESS', score: 1, lines: [
    [1, 'Tube\'s in. Confirm with EtCO2.'],
    [2, 'Eventually. Tube\'s in. Confirm placement before anyone claps.'],
    [3, 'Finally. The trachea was there the whole time. Confirm it.'],
  ] },
  { id: 'mask_after_fail', concept: 'MASK_PPV', score: 2, once: true, when: (q) => q.failedAttempts > 0, lines: [
    [1, 'Bagging between attempts. Correct.'],
    [2, 'Mask ventilating between attempts. Correct. Annoyingly.'],
    [3, 'Bagging between attempts. Look at you, learning in real time.'],
  ] },

  // Emergence and reversal
  { id: 'tof', concept: 'TOF_CHECK', score: 1, once: true, lines: [
    [1, 'Checked the TOF. Data over vibes.'],
    [2, 'Quantitative TOF check. Data over vibes. Respect.'],
    [3, 'You checked the twitches. Somebody stayed awake in lecture.'],
  ] },
  { id: 'neo_count_zero', concept: 'DRUG', score: 3, when: (q) => q.drug === 'Neostigmine' && q.tof === 0, lines: [
    [1, 'Neostigmine at a TOF count of zero won\'t reverse anything. Wait for twitches or use sugammadex.'],
    [2, 'Neostigmine at TOF zero. That does nothing. Sugammadex exists. So does patience.'],
    [3, 'Neostigmine with zero twitches. You reversed nothing and gained a bradycardia risk. Great trade.'],
  ] },
  { id: 'neo', concept: 'DRUG', score: 2, when: (q) => q.drug === 'Neostigmine', lines: [
    [1, 'Neostigmine with twitches present. Pair it with an anticholinergic.'],
    [2, 'Neostigmine. Acceptable. Glycopyrrolate goes with it unless you enjoy bradycardia.'],
    [3, 'Neostigmine. Old school. Don\'t forget the glyco or the heart rate will remind you.'],
  ] },
  { id: 'sugammadex', concept: 'DRUG', score: 2, cooldownMs: 120000, when: (q) => q.drug === 'Sugammadex', lines: [
    [1, 'Sugammadex in. Recheck the TOF before you pull anything.'],
    [2, 'Sugammadex. The expensive easy button. Somewhere a pharmacist is crying.'],
    [3, 'Sugammadex. Money can\'t buy skill, but it can buy a TOF ratio.'],
  ] },
  { id: 'extubate_early', concept: 'EXTUBATE', score: 2, when: (q) => finite(q.tofRatio) && q.tofRatio < 0.9, lines: [
    [1, 'Extubated at a TOF ratio of {tofRatio}. The target is 0.9. Watch that airway closely.'],
    [2, 'Extubated at {tofRatio}. The number is 0.9. Enjoy the residual blockade.'],
    [3, 'Pulled the tube at {tofRatio}. Weak patient, floppy airway, your name on the report.'],
  ] },
  { id: 'extubate_ok', concept: 'EXTUBATE', score: 1, lines: [
    [1, 'Extubated with a TOF ratio of {tofRatio}. Good.'],
    [2, 'Extubated at {tofRatio}. Textbook. Disgusting.'],
    [3, 'TOF ratio {tofRatio} at extubation. Fine. I had nothing. Happy?'],
  ] },
  { id: 'naloxone_full', concept: 'DRUG', score: 3, when: (q) => q.drug === 'Naloxone' && q.doseMg >= 0.4, lines: [
    [1, 'A full 0.4 mg of naloxone. Titrate 40 mcg at a time so you restore breathing without a sympathetic surge.'],
    [2, 'Full 0.4 of naloxone. You wanted breathing. You may have bought a surge. Titrate next time.'],
    [3, 'You slammed the whole 0.4 mg. Pain, pulmonary edema, hypertension. Titrate, cowboy.'],
  ] },
  { id: 'naloxone_small', concept: 'DRUG', score: 2, when: (q) => q.drug === 'Naloxone', lines: [
    [1, 'Small naloxone dose. Titrating. Correct.'],
    [2, 'Forty mics of naloxone. Titrating like an adult. Weird.'],
    [3, 'Titrated naloxone. Who taught you that? Not me.'],
  ] },

  // Booth's own chaos. Cryptic on purpose: no free diagnosis.
  { id: 'injected', concept: 'INJECTED', score: 1, priority: 2, lines: [
    [1, 'Something changed. Eyes on the monitor.'],
    [2, 'I touched something. Don\'t ask what. Figure it out.'],
    [3, 'I got bored. Your problem now.'],
    [3, 'Hold my coffee.'],
  ] },
  { id: 'instructor_injected', concept: 'INSTRUCTOR_INJECTED', score: 1, once: true, lines: [
    [1, 'You\'re injecting your own complications now. Noted.'],
    [2, 'Doing my job for me? Cute. I\'ll grade the cleanup.'],
    [3, 'Stealing my buttons. Bold. Let\'s see you fix what you broke.'],
  ] },

  // Correct rescue: now the complication can be named.
  { id: 'treat_mh', concept: 'TREATED', score: 3, when: (q) => q.complicationType === 'MalignantHyperthermia', lines: [
    [1, 'Dantrolene for malignant hyperthermia. Correct. Agent off, hyperventilate on 100%, cool, call the MH hotline.'],
    [2, 'Dantrolene. Somebody read the MH poster. Trigger off, cool them, and keep dosing to effect.'],
    [3, 'MH, and you caught it. I\'m almost proud. Agent off, cool, dose to effect. Don\'t get comfortable.'],
  ] },
  { id: 'treat_anaphylaxis', concept: 'TREATED', score: 3, when: (q) => q.complicationType === 'Anaphylaxis', lines: [
    [1, 'Epinephrine for anaphylaxis. Correct. Repeat to effect and support the pressure.'],
    [2, 'Epi for anaphylaxis. Right drug. Small doses, repeat as needed.'],
    [3, 'You found the anaphylaxis. Took you a minute. Epi, repeat, and stop the trigger.'],
  ] },
  { id: 'treat_broncho', concept: 'TREATED', score: 3, when: (q) => q.complicationType === 'Bronchospasm', lines: [
    [1, 'Treating bronchospasm. Correct. Deepening the volatile helps too.'],
    [2, 'Bronchodilator for bronchospasm. I\'m impressed. Don\'t tell anyone.'],
    [3, 'Bronchospasm, recognized. The peak pressures were screaming at you, but sure.'],
  ] },
  { id: 'treat_spasm', concept: 'TREATED', score: 3, when: (q) => q.complicationType === 'Laryngospasm', lines: [
    [1, 'Breaking the laryngospasm. Correct. Keep positive pressure on.'],
    [2, 'Cords open, crisis closed. Laryngospasm, handled.'],
    [3, 'Laryngospasm, broken. The patient\'s cords are less tight than your grip on the bag.'],
  ] },
  { id: 'treat_opioid', concept: 'TREATED', score: 3, when: (q) => q.complicationType === 'OpioidRespDepression', lines: [
    [1, 'Naloxone for opioid respiratory depression. Correct. Watch for renarcotization.'],
    [2, 'Opioid depression, reversed. The naloxone wears off before the fentanyl might. Keep watching.'],
    [3, 'You reversed the opioid you gave. Circle of life.'],
  ] },
  { id: 'treat_spinal', concept: 'TREATED', score: 3, when: (q) => q.complicationType === 'HighSpinal', lines: [
    [1, 'Pressors for the high block sympathectomy. Correct. Watch the breathing too.'],
    [2, 'High spinal, recognized. Pressors in. Now watch ventilation, the block may climb.'],
    [3, 'Sympathectomy, treated. The epidural went places. You followed it. Barely.'],
  ] },
  { id: 'treat_last', concept: 'TREATED', score: 3, when: (q) => q.complicationType === 'LocalAnestheticToxicity', lines: [
    [1, 'Lipid for local anesthetic toxicity. Correct. Stop the local, support the airway.'],
    [2, 'Lipid emulsion. Correct call for LAST. Keep the infusion going.'],
    [3, 'LAST, caught. The lidocaine was the problem the whole time. Shocking.'],
  ] },
  { id: 'trigger_off_mh', concept: 'TRIGGER_OFF', score: 2, when: (q) => !q.dantroleneGiven, lines: [
    [1, 'Volatile off. Good start. The trigger is gone. The problem isn\'t.'],
    [2, 'Agent off. Half credit. What finishes the job?'],
    [3, 'Turned off the vaporizer. Cute. Now finish it.'],
  ] },

  // Shotgun pharmacology. Socratic, never names a hidden complication.
  { id: 'shotgun_dantrolene', concept: 'SHOTGUN', score: 3, when: (q) => q.drug === 'Dantrolene', lines: [
    [1, 'Dantrolene without an MH picture. What made you think MH? Check EtCO2 and temperature.'],
    [2, 'Dantrolene with no MH picture. Expensive guess. What is the monitor actually saying?'],
    [3, 'Dantrolene for vibes. Pharmacy is drafting a letter. Read the monitor first.'],
  ] },
  { id: 'shotgun_naloxone', concept: 'SHOTGUN', score: 3, when: (q) => q.drug === 'Naloxone', lines: [
    [1, 'Naloxone without opioid on board. What are you reversing?'],
    [2, 'Naloxone with no opioid to reverse. Bold. Look again.'],
    [3, 'Reversing an opioid you never gave. That\'s a new one.'],
  ] },
  { id: 'shotgun_lipid', concept: 'SHOTGUN_LIPID', score: 1, once: true, lines: [
    [1, 'Lipid without a local anesthetic toxicity picture. What made you go there?'],
    [2, 'Lipid emulsion with no LAST. Creamy. Wrong.'],
    [3, 'You gave the patient a salad dressing for no reason. Read the room.'],
  ] },

  // More drug and machine commentary so the booth is never silent for long.
  { id: 'fentanyl', concept: 'DRUG', score: 2, cooldownMs: 90000, when: (q) => q.drug === 'Fentanyl', lines: [
    [1, 'Fentanyl in. Respiratory drive is about to take a hit if they are breathing on their own.'],
    [2, 'Fentanyl. Watch the respiratory rate. It will tell on you.'],
    [3, 'Fentanyl. The patient is about to forget how to breathe. Keep up.'],
  ] },
  { id: 'midazolam', concept: 'DRUG', score: 2, cooldownMs: 90000, when: (q) => q.drug === 'Midazolam', lines: [
    [1, 'Midazolam in. Anxiolysis and amnesia, plus some respiratory depression.'],
    [2, 'Versed. Calm patient, calmer respiratory drive.'],
    [3, 'Midazolam. Now the patient is as relaxed as you pretend to be.'],
  ] },
  { id: 'phenylephrine', concept: 'DRUG', score: 2, cooldownMs: 60000, when: (q) => q.drug === 'Phenylephrine', lines: [
    [1, 'Phenylephrine. Expect a reflex drop in heart rate.'],
    [2, 'Neo push. Pressure up, heart rate down. Classic.'],
    [3, 'Phenylephrine. Treating the number. Hopefully you also know the cause.'],
  ] },
  { id: 'ephedrine', concept: 'DRUG', score: 2, cooldownMs: 60000, when: (q) => q.drug === 'Ephedrine', lines: [
    [1, 'Ephedrine. Mixed acting, so it helps both rate and pressure.'],
    [2, 'Ephedrine. Nice choice when the heart rate is low too.'],
    [3, 'Ephedrine. The pressor equivalent of a pep talk.'],
  ] },
  { id: 'epinephrine', concept: 'DRUG', score: 2, cooldownMs: 60000, when: (q) => q.drug === 'Epinephrine', lines: [
    [1, 'Epinephrine in. Watch for tachycardia and arrhythmias.'],
    [2, 'Epi. The big gun. Make sure the indication matches.'],
    [3, 'Epi. The heart rate is about to have opinions.'],
  ] },
  { id: 'anticholinergic', concept: 'DRUG', score: 2, cooldownMs: 60000, when: (q) => q.drug === 'Glycopyrrolate' || q.drug === 'Atropine', lines: [
    [1, 'Anticholinergic in. Watch the heart rate climb.'],
    [2, 'Anticholinergic on board. Dry mouth, faster heart. You\'re welcome, patient.'],
    [3, 'Anticholinergic. Heart rate goes up. So does my respect. Slightly.'],
  ] },
  { id: 'albuterol', concept: 'DRUG', score: 2, cooldownMs: 60000, when: (q) => q.drug === 'Albuterol', lines: [
    [1, 'Albuterol. Watch the peak pressures for a response.'],
    [2, 'Albuterol down the tube. Let\'s see if the airway agrees with you.'],
    [3, 'Albuterol. Puff puff, hope it helps.'],
  ] },
  { id: 'volatile_on', concept: 'VOLATILE', score: 1, cooldownMs: 30000, when: (q) => finite(q.dial) && q.dial > 0, lines: [
    [1, '{agent} at {dial} percent. Give it time to equilibrate before you judge it.'],
    [2, '{agent} dialed to {dial}. The end tidal will catch up. Patience.'],
    [3, '{agent} at {dial}. Spinning dials like a DJ.'],
  ] },
  { id: 'cricoid', concept: 'CRICOID', score: 1, once: true, lines: [
    [1, 'Cricoid on. Release it if it worsens the view or ventilation.'],
    [2, 'Cricoid pressure. Controversial, but go ahead.'],
    [3, 'Cricoid on. Hope your helper has better aim than you.'],
  ] },
  { id: 'vent_mode', concept: 'VENT_MODE', score: 1, cooldownMs: 45000, lines: [
    [1, 'Vent mode changed. Check the delivered tidal volume and EtCO2.'],
    [2, 'New vent mode. Now confirm it is doing what you think it is.'],
    [3, 'Button pushing on the vent. Bold. Check the numbers.'],
  ] },

  // Ambient chatter: fills silence with commentary grounded in the current
  // monitor. Most specific situation wins; cooldowns rotate the rest.
  { id: 'amb_unstable', concept: 'AMBIENT', score: 6, cooldownMs: 15000, when: (q) => q.intensity >= 0.35 && q.worst, lines: [
    [1, '{worst}. That is still the number that matters most right now.'],
    [1, 'Still looking at {worst}. What is your plan for it?'],
    [2, '{worst}. Still. I\'m not going to stop mentioning it.'],
    [2, 'Reminder: {worst}. The patient hasn\'t forgotten either.'],
    [3, '{worst}. I\'ll keep saying it until you fix it.'],
    [3, '{worst}. Bold strategy, ignoring that.'],
    [1, '{worst}. If you are falling behind, call for help. That is a skill, not a weakness.'],
    [1, '{worst}. Work it systematically: airway, breathing, circulation.'],
    [2, '{worst}. Pick a cause. Treat it. Reassess.'],
    [2, '{worst}. Calling for help is allowed. Encouraged, even.'],
    [3, '{worst}. Panic is optional. Treatment isn\'t.'],
    [3, '{worst}. Call for help now, before this turns into a code.'],
  ] },
  { id: 'amb_apneic', concept: 'AMBIENT', score: 5, cooldownMs: 20000,
    when: (q) => q.airwayDevice !== 'intubated' && q.spont === false && !q.ppvActive && !q.intubationInProgress, lines: [
    [1, 'No spontaneous breathing and nobody is ventilating. Mask ventilate or secure the airway.'],
    [2, 'Patient isn\'t breathing. Neither is your plan. Ventilate.'],
    [3, 'Apneic and unventilated. The oxygen reserve is a clock, and it\'s running.'],
  ] },
  { id: 'amb_awareness', concept: 'AMBIENT', score: 5, cooldownMs: 30000,
    when: (q) => q.airwayDevice === 'intubated' && !(q.vaporizer > 0) && !q.infusionRunning && finite(q.bis) && q.bis > 60, lines: [
    [1, 'BIS {bis} with no agent running. Awareness under anesthesia is a real complication.'],
    [2, 'BIS {bis}, vaporizer off. Is anything keeping this patient asleep?'],
    [3, 'BIS {bis} and no agent. The patient may be listening to all of this.'],
  ] },
  { id: 'amb_hidden', concept: 'AMBIENT', score: 4, cooldownMs: 25000, when: (q) => q.hiddenActive && q.intensity < 0.35, lines: [
    [1, 'Something is still off. Run your monitors top to bottom.'],
    [1, 'Scan everything: pressures, EtCO2, temperature, rhythm.'],
    [2, 'You good? Because I know something you don\'t.'],
    [2, 'Scan the whole monitor. Not just the parts you like.'],
    [3, 'I can see it. Can you?'],
    [3, 'Tick tock. Waiting costs you.'],
  ] },
  { id: 'amb_mild', concept: 'AMBIENT', score: 3, cooldownMs: 20000, when: (q) => q.intensity >= CALM_INTENSITY && q.intensity < 0.35 && q.worst, lines: [
    [1, '{worst}. Drifting. Watch it.'],
    [2, '{worst}. Not a crisis. Yet.'],
    [3, '{worst}. Trending the wrong way, like my patience.'],
  ] },
  { id: 'amb_relax', concept: 'AMBIENT', score: 3, cooldownMs: 40000, when: (q) => q.phase === 'RELAX', lines: [
    [1, 'Quiet stretch. Use it: check depth, check the vent, plan ahead.'],
    [2, 'I\'m letting you breathe. Enjoy it while it lasts.'],
    [3, 'Recess. Don\'t get used to it.'],
  ] },
  { id: 'amb_preinduction', concept: 'AMBIENT', score: 3, cooldownMs: 25000, when: (q) => q.stage === 'preinduction', lines: [
    [1, 'Before induction: suction, backup airway, drugs ready. Know your plan B.'],
    [1, 'Patient is awake. Have the airway plan settled before you push anything.'],
    [2, 'Patient is awake and trusts you. Adorable.'],
    [2, 'Still preinduction. The OR clock is running.'],
    [3, 'Any day now. The patient is aging in real time.'],
    [3, 'Take your time. Not like anyone is waiting. Everyone is waiting.'],
  ] },
  { id: 'amb_emergence', concept: 'AMBIENT', score: 2, cooldownMs: 25000, when: (q) => q.stage === 'emergence', lines: [
    [1, 'Emergence. Watch the airway, the breathing, and the TOF ratio.'],
    [1, 'TOF ratio {tofRatio}, respiratory rate {rr}. Keep an eye on both.'],
    [2, 'Emergence: where good cases go to die. Watch that airway.'],
    [3, 'Waking up. The most dangerous part, and you look relaxed. Interesting.'],
  ] },
  { id: 'amb_maintenance', concept: 'AMBIENT', score: 2, cooldownMs: 20000,
    when: (q) => q.stage === 'maintenance' && q.vaporizer > 0 && q.intensity < 0.35, lines: [
    [1, '{agent} at {dial} percent, MAC {mac}. Steady.'],
    [1, 'MAC {mac}. Think about awareness on one side and blood pressure on the other.'],
    [2, '{agent} dialed to {dial}, MAC {mac}. Riveting.'],
    [2, 'Maintenance. Peak excitement for absolutely no one.'],
    [3, 'MAC {mac}. The patient is asleep. I\'m almost asleep.'],
    [3, 'Sitting at {dial} percent {agent}. I\'ve seen glaciers with more energy.'],
    [1, 'End tidal agent catching up. Watch MAC, not just the dial.'],
    [2, 'MAC {mac}. Asleep, not dead. Let\'s keep it that way.'],
    [3, 'MAC {mac}. Deep enough for you to stop fidgeting.'],
  ] },
  { id: 'amb_scheming', concept: 'AMBIENT', score: 2, cooldownMs: 35000, when: (q) => q.phase === 'BUILD_UP' && q.directorArmed && q.intensity < CALM_INTENSITY, lines: [
    [1, 'Everything is stable. Stay sharp anyway.'],
    [2, 'Everything\'s stable. That\'s usually when I get ideas.'],
    [3, 'Stable vitals. Suspiciously stable. I\'m bored, and bored is dangerous for you.'],
  ] },
  { id: 'amb_done', concept: 'AMBIENT', score: 2, cooldownMs: 120000, when: (q) => q.phase === 'DONE' && q.directorArmed, lines: [
    [1, 'I\'m out of complications for this one. Finish strong.'],
    [2, 'Out of tricks. Don\'t tell anyone.'],
    [3, 'I\'ve run out of ways to ruin your day. Take the win.'],
  ] },
  { id: 'amb_calm', concept: 'AMBIENT', score: 1, when: (q) => q.intensity < CALM_INTENSITY, lines: [
    [1, 'HR {hr}, MAP {map}, sat {spo2}. Stable. Keep scanning.'],
    [1, 'EtCO2 {etco2}, sat {spo2}. Ventilation looks fine.'],
    [2, 'HR {hr}, MAP {map}, sat {spo2}. Boring. I hate boring.'],
    [2, 'Sat {spo2}. Look at you, oxygenating.'],
    [3, 'MAP {map}. Fine. Fine is my least favorite word.'],
    [3, 'Heart rate {hr}. Steadier than your hands.'],
    [1, 'Sat {spo2}, EtCO2 {etco2}. Check the waveform, not just the number.'],
    [1, 'Pressure {map}. Is that adequate for this patient\'s baseline?'],
    [2, 'MAP {map}. Kidneys are happy. Rare day.'],
    [2, 'EtCO2 {etco2}. Ventilating like you meant it.'],
    [3, 'Sat {spo2}. Hard to mess that up. Don\'t test me.'],
    [3, 'HR {hr}. Calmer than the surgeon will be.'],
  ] },
  // Boredom and trivia never play during a crisis; only amb_unstable does.
  { id: 'amb_pearl', concept: 'AMBIENT', score: 0, cooldownMs: 40000, when: (q) => q.intensity < 0.35, lines: PEARLS.flatMap((pearl) => [
    [1, `Pearl: ${pearl}`],
    [2, `Free education: ${pearl}`],
    [3, `Since you clearly need it: ${pearl}`],
  ]) },

  // Vitals, from the snapshot only.
  { id: 'arrest', concept: 'ARREST', score: 1, priority: 3, lines: [
    [1, 'No perfusion. Call for help and start ACLS. Now.'],
    [2, 'That\'s an arrest. Call for help, compressions, ACLS. Move.'],
    [3, 'Congratulations, you achieved cardiac arrest. Call for help. Compressions. Now.'],
  ] },
  { id: 'desat_severe', concept: 'DESAT_SEVERE', score: 1, priority: 2, lines: [
    [1, 'SpO2 {spo2}. Oxygen first, everything else second. FiO2, airway, ventilation.'],
    [2, 'SpO2 {spo2}. I\'m not saying panic. I\'m saying 100%, check the airway, ventilate.'],
    [3, 'SpO2 {spo2}. The patient is turning the color of your evaluation. FiO2 up, fix the airway.'],
  ] },
  { id: 'desat', concept: 'DESAT', score: 1, priority: 1, lines: [
    [1, 'SpO2 {spo2} and falling. Find out why.'],
    [2, 'Sat\'s {spo2}. Hear the pulse ox pitch dropping? That\'s the patient talking.'],
    [3, 'SpO2 {spo2}. That number is heading south and taking your plan with it.'],
  ] },
  { id: 'recovered', concept: 'RECOVERED', score: 1, lines: [
    [1, 'Sat\'s back to {spo2}. Good. Figure out what caused the dip.'],
    [2, 'Back to {spo2}. Crisis averted. Mostly on purpose, I assume.'],
    [3, 'SpO2 {spo2}. You fixed it. I had money on the other outcome.'],
  ] },
  { id: 'hypotension_severe', concept: 'HYPOTENSION_SEVERE', score: 1, priority: 2, lines: [
    [1, 'MAP {map}. Treat the pressure now, then find the cause.'],
    [2, 'MAP {map}. That\'s not hypotension, that\'s a lifestyle. Pressor now, cause next.'],
    [3, 'MAP {map}. The brain called. It wants its perfusion back. Pressor. Now.'],
  ] },
  { id: 'hypotension', concept: 'HYPOTENSION', score: 1, lines: [
    [1, 'MAP {map}. The kidneys have filed a complaint.'],
    [2, 'MAP {map}. Below 65 and drifting. Depth, drugs, volume, or something worse?'],
    [3, 'MAP {map}. Organs are starting a group chat about you.'],
  ] },
  { id: 'hypertension', concept: 'HYPERTENSION', score: 1, lines: [
    [1, 'MAP {map}. Light, in pain, or both? Check depth against stimulus.'],
    [2, 'MAP {map}. Somebody\'s feeling the surgery. Look at your depth.'],
    [3, 'MAP {map}. The patient is angrier than I am. That takes effort.'],
  ] },
  { id: 'tachy', concept: 'TACHY', score: 1, lines: [
    [1, 'Heart rate {hr}. Ask why before you treat a number.'],
    [2, 'HR {hr}. Pain, light anesthesia, hypovolemia, or something nastier. Pick a cause, not a drug.'],
    [3, 'HR {hr}. The heart is sprinting away from your management.'],
  ] },
  { id: 'brady', concept: 'BRADY', score: 1, lines: [
    [1, 'Heart rate {hr}. Check oxygenation, then look for the cause.'],
    [2, 'HR {hr}. That\'s not chill. Oxygenation first, then think vagal or drug.'],
    [3, 'HR {hr}. That heart rate is a cry for help. Oxygenation first, then the cause.'],
  ] },
  { id: 'hypercarbia', concept: 'HYPERCARBIA', score: 1, lines: [
    [1, 'EtCO2 {etco2}. Check your minute ventilation. Then ask what is making the CO2.'],
    [2, 'EtCO2 {etco2} and climbing. Ventilation problem or production problem? Think.'],
    [3, 'EtCO2 {etco2}. The capnograph is begging for your attention.'],
  ] },
  { id: 'fever', concept: 'FEVER', score: 1, lines: [
    [1, 'Temp {temp}. Patients usually cool down under anesthesia. Interesting.'],
    [2, 'Temp {temp}. Under anesthesia. Not normal. Think.'],
    [3, 'Temp {temp}. Your patient is cooking and so is your evaluation.'],
  ] },
  { id: 'idle', concept: 'IDLE', score: 1, cooldownMs: 90000, lines: [
    [1, 'The patient needs something from you. What\'s your next move?'],
    [2, 'Still waiting on you to do something. The patient is too.'],
    [3, 'Are you treating, or watching a documentary about treating?'],
  ] },

  // Outcomes from the ScenarioManager event log.
  { id: 'resolved', concept: 'RESOLVED', score: 1, lines: [
    [1, '{complication} resolved. Replay what tipped you off while it\'s fresh.'],
    [2, '{complication} resolved. Took you long enough.'],
    [3, '{complication}, handled. I\'ll find something worse.'],
  ] },
  { id: 'failure', concept: 'FAILURE', score: 1, priority: 3, cooldownMs: 180000, lines: [
    [1, 'The complication won. Call for help, pause, and review what you missed.'],
    [2, 'That one got away from you. Call for help. Then debrief it honestly.'],
    [3, 'And that\'s a code. Call for help. We\'ll talk about this. At length.'],
  ] },
  { id: 'naloxone_surge', concept: 'NALOXONE_SURGE', score: 1, priority: 2, lines: [
    [1, 'Full reversal triggered a sympathetic surge. That\'s why naloxone gets titrated.'],
    [2, 'Hello, catecholamine storm. That\'s what an un-titrated naloxone dose buys you.'],
    [3, 'You reversed the opioid and the patient\'s whole personality. Titrate next time.'],
  ] },
]);

export function fillTemplate(text, facts = {}) {
  const fmt = {
    spo2: finite(facts.spo2) ? Math.round(facts.spo2) : '?',
    map: finite(facts.map) ? Math.round(facts.map) : '?',
    hr: finite(facts.hr) ? Math.round(facts.hr) : '?',
    etco2: finite(facts.etco2) ? Math.round(facts.etco2) : '?',
    temp: finite(facts.temp) ? facts.temp.toFixed(1) : '?',
    tofRatio: finite(facts.tofRatio) ? facts.tofRatio.toFixed(2) : '?',
    tof: finite(facts.tof) ? facts.tof : '?',
    attempts: finite(facts.attempts) ? facts.attempts : '?',
    complication: facts.complicationLabel ?? 'That',
    worst: facts.worst ?? 'Something',
    agent: facts.agent ?? facts.vaporizerAgent ?? 'The agent',
    dial: finite(facts.dial) ? facts.dial.toFixed(1) : (finite(facts.vaporizer) ? facts.vaporizer.toFixed(1) : '?'),
    mac: finite(facts.mac) ? facts.mac.toFixed(2) : '?',
    bis: finite(facts.bis) ? Math.round(facts.bis) : '?',
    rr: finite(facts.rr) ? Math.round(facts.rr) : '?',
    name: OPERATOR_NAME,
  };
  return text.replace(/\{(\w+)\}/g, (match, key) => (key in fmt ? String(fmt[key]) : match));
}

/* Most specific matching rule wins (Ruskin). Ties break randomly. Line heat is
   capped at the meanness setting and prefers lines at exactly that heat. */
export function selectBark(query, {
  rules = BARK_RULES, meanness = 2, memory, nowMs = 0, random = Math.random,
} = {}) {
  const matching = rules.filter((rule) => {
    if (rule.concept !== query.concept) return false;
    if (rule.once && memory?.said.has(rule.id)) return false;
    const last = memory?.lastByRule.get(rule.id);
    if (rule.cooldownMs && last !== undefined && nowMs - last < rule.cooldownMs) return false;
    if (rule.when && !rule.when(query)) return false;
    return rule.lines.some(([heat]) => heat <= meanness);
  });
  if (matching.length === 0) return null;
  // Chatter shouldn't hit the same rule twice in a row when anything else fits.
  const varied = query.concept === 'AMBIENT' && matching.length > 1
    ? matching.filter((rule) => rule.id !== memory?.lastRuleId)
    : matching;
  const best = Math.max(...varied.map((rule) => rule.score ?? 0));
  const top = varied.filter((rule) => (rule.score ?? 0) === best);
  const rule = top[Math.min(top.length - 1, Math.floor(random() * top.length))];
  const exact = rule.lines.filter(([heat]) => heat === meanness);
  const upToLevel = rule.lines.filter(([heat]) => heat <= meanness);
  // Chatter draws from every line up to the attitude level for variety, but
  // only falls to a milder line once the exact-heat lines have all been used.
  const exactFresh = exact.filter(([, text]) => !(memory?.recentTemplates ?? []).includes(text));
  const pool = query.concept === 'AMBIENT' && exactFresh.length === 0 ? upToLevel
    : (exact.length > 0 ? exact : upToLevel);
  const recent = memory?.recentTemplates ?? [];
  const fresh = pool.filter(([, text]) => text !== memory?.lastTemplate && !recent.includes(text));
  const choices = fresh.length > 0 ? fresh : pool;
  const [heat, text] = choices[Math.min(choices.length - 1, Math.floor(random() * choices.length))];
  return {
    ruleId: rule.id, concept: query.concept, heat, priority: rule.priority ?? 1,
    template: text, text: fillTemplate(text, query),
  };
}

// Vital sign bands with hysteresis so a number hovering at a threshold
// doesn't make Booth repeat himself.
const VITAL_BANDS = Object.freeze([
  { id: 'arrest', concept: 'ARREST',
    enter: (s) => s.derivedRhythm === 'ventricular_fibrillation' || (finite(s.hr) && finite(s.map) && s.hr < 20 && s.map < 30),
    exit: (s) => s.derivedRhythm !== 'ventricular_fibrillation' && finite(s.map) && s.map > 50 },
  { id: 'desatSevere', concept: 'DESAT_SEVERE', enter: (s) => s.spo2 < 80, exit: (s) => s.spo2 >= 88 },
  { id: 'desat', concept: 'DESAT', enter: (s) => s.spo2 < 90, exit: (s) => s.spo2 >= 94, recovery: 'RECOVERED' },
  { id: 'hypotensionSevere', concept: 'HYPOTENSION_SEVERE', enter: (s) => s.map < 50, exit: (s) => s.map >= 58 },
  { id: 'hypotension', concept: 'HYPOTENSION', enter: (s) => s.map < 65, exit: (s) => s.map >= 70 },
  { id: 'hypertension', concept: 'HYPERTENSION', enter: (s) => s.map > 120, exit: (s) => s.map <= 110 },
  { id: 'tachy', concept: 'TACHY', enter: (s) => s.hr > 130, exit: (s) => s.hr <= 120 },
  { id: 'brady', concept: 'BRADY', enter: (s) => s.hr < 45, exit: (s) => s.hr >= 50 },
  { id: 'hypercarbia', concept: 'HYPERCARBIA',
    enter: (s) => s.capnogramPresent !== false && s.etco2 > 60, exit: (s) => s.etco2 <= 52 },
  { id: 'fever', concept: 'FEVER', enter: (s) => s.temp >= 38.5, exit: (s) => s.temp <= 38.2 },
]);

// Concepts that are already covered by a more severe active band.
const BAND_SUPPRESSED_BY = Object.freeze({
  desat: 'desatSevere', hypotension: 'hypotensionSevere',
});

const SCENARIO_LOG_PATTERNS = Object.freeze([
  { pattern: /^(MH) resolved/i, type: 'MalignantHyperthermia' },
  { pattern: /^Anaphylaxis resolved/i, type: 'Anaphylaxis' },
  { pattern: /^Bronchospasm resolved/i, type: 'Bronchospasm' },
  { pattern: /^Opioid depression resolved/i, type: 'OpioidRespDepression' },
  { pattern: /^Laryngospasm BROKEN/i, type: 'Laryngospasm' },
  { pattern: /^Hemorrhage resolved/i, type: 'Hemorrhage' },
  { pattern: /^High spinal resolving/i, type: 'HighSpinal' },
]);

function stripLogTimestamp(line) {
  return String(line).replace(/^\[[^\]]*\]\s*/, '');
}

const NON_LEARNER_ACTIONS = new Set(['complication', 'start', 'resume', 'pause', 'condition']);

export function createSimOperator({
  runner,
  say = () => {},
  random = Math.random,
  now = () => Date.now(),
  schedule = (fn) => setTimeout(fn, 0),
  isLive = (snapshot) => snapshot?.lifecycle === 'RUNNING',
  meanness = 2,
  chaos = 1,
  minGapMs = 5000,
  enabled = true,
  chatter = 1,
} = {}) {
  const director = createDirector({ random });
  const settings = { meanness, chaos, enabled, chatter };
  let nextAmbientGapMs = null;
  let memory;
  let history;
  let bands;
  let last = null;
  let lastEvalT = null;
  let lastLifecycle = null;
  let scenarioLogIndex = 0;
  let seenOutcomes = new Set();
  let pendingInjection = null;
  let idleBarkedForAction = -1;
  let transcript = [];

  function resetState() {
    director.reset();
    memory = {
      said: new Set(), lastByRule: new Map(), lastText: null, lastTemplate: null, lastRuleId: null, lastSayMs: -Infinity,
    };
    history = {
      drugsGiven: new Set(), epiduralGiven: false, wasIntubated: false, preoxygenated: false,
      failedAttempts: 0, lastLearnerActionT: 0, lastDrugT: null, learnerActions: [],
      injections: [], extremes: { minSpO2: null, minMap: null, maxHr: null, maxEtco2: null, maxTemp: null },
      outcomes: [],
    };
    bands = new Map();
    lastEvalT = null;
    scenarioLogIndex = 0;
    seenOutcomes = new Set();
    idleBarkedForAction = -1;
    transcript = [];
  }
  resetState();

  function profile() {
    return CHAOS_PROFILES[settings.chaos] ?? CHAOS_PROFILES[1];
  }

  function directorAllowed() {
    return Boolean(runner) && !runner.rubricSession && !runner.caseSession;
  }

  function activeComplications() {
    try { return runner?.activeComplications?.() ?? []; } catch { return []; }
  }

  function revealed(type) {
    return history.injections.some((entry) => entry.type === type && entry.revealed);
  }

  function hiddenTypes() {
    return new Set(history.injections.filter((entry) => !entry.revealed).map((entry) => entry.type));
  }

  function speak(query, { force = false } = {}) {
    if (!settings.enabled) return null;
    const nowMs = now();
    const bark = selectBark({ ...last, ...query }, {
      meanness: settings.meanness, memory, nowMs, random,
    });
    if (!bark) return null;
    const gapOk = nowMs - memory.lastSayMs >= minGapMs;
    if (!force && !gapOk && bark.priority < 2) return null;
    memory.said.add(bark.ruleId);
    memory.lastByRule.set(bark.ruleId, nowMs);
    memory.lastText = bark.text;
    memory.lastTemplate = bark.template;
    memory.recentTemplates = [...(memory.recentTemplates ?? []), bark.template].slice(-10);
    memory.lastRuleId = bark.ruleId;
    memory.lastSayMs = nowMs;
    nextAmbientGapMs = pickAmbientGap();
    const line = { ...bark, tSec: last?.t ?? 0, speaker: OPERATOR_NAME };
    transcript.push(line);
    if (transcript.length > 200) transcript = transcript.slice(-200);
    say(line);
    return line;
  }

  function pickAmbientGap() {
    const level = CHATTER_LEVELS.find((entry) => entry.id === settings.chatter);
    if (!level?.gapMs) return null;
    const [low, high] = level.gapMs;
    return low + random() * (high - low);
  }

  // Fill silence with commentary grounded in the current monitor.
  function maybeChatter(snapshot, intensity, active) {
    if (nextAmbientGapMs === null) nextAmbientGapMs = pickAmbientGap();
    if (nextAmbientGapMs === null) return;
    if (now() - memory.lastSayMs < nextAmbientGapMs) return;
    const hidden = hiddenTypes();
    const directorState = director.getState();
    const line = speak({
      concept: 'AMBIENT',
      intensity,
      worst: worstFinding(snapshot),
      stage: caseStage(snapshot, history),
      phase: directorState.phase,
      directorArmed: directorAllowed() && settings.chaos > 0,
      hiddenActive: active.some((type) => hidden.has(type))
        || (hidden.has('LocalAnestheticToxicity') && (snapshot.lidocaineToxicityStage ?? 'none') !== 'none'),
      infusionRunning: (snapshot.activeAnestheticInfusions?.length ?? 0) > 0,
      agent: snapshot.vaporizerAgent,
      dial: snapshot.vaporizer,
    }, { force: true });
    if (!line) nextAmbientGapMs = pickAmbientGap(); // nothing fit; try again after another gap
  }

  function trackExtremes(s) {
    const x = history.extremes;
    const low = (key, value) => { if (finite(value) && (x[key] === null || value < x[key])) x[key] = value; };
    const high = (key, value) => { if (finite(value) && (x[key] === null || value > x[key])) x[key] = value; };
    low('minSpO2', s.spo2);
    low('minMap', s.map);
    high('maxHr', s.hr);
    if (s.capnogramPresent !== false) high('maxEtco2', s.etco2);
    high('maxTemp', s.temp);
  }

  function evaluateBands(s) {
    const entered = [];
    for (const band of VITAL_BANDS) {
      const active = bands.get(band.id) === true;
      if (!active && band.enter(s)) {
        bands.set(band.id, true);
        entered.push(band);
      } else if (active && band.exit(s)) {
        bands.set(band.id, false);
        if (band.recovery) speak({ concept: band.recovery });
      }
    }
    for (const band of entered) {
      const suppressor = BAND_SUPPRESSED_BY[band.id];
      if (suppressor && bands.get(suppressor) === true) continue;
      speak({ concept: band.concept });
      break; // one vital complaint per evaluation
    }
  }

  function readScenarioLog() {
    const log = runner?.s?.eventLog;
    if (!Array.isArray(log)) return;
    if (log.length < scenarioLogIndex) scenarioLogIndex = 0;
    for (; scenarioLogIndex < log.length; scenarioLogIndex += 1) {
      const text = stripLogTimestamp(log[scenarioLogIndex]);
      // The engine repeats some outcome lines every tick (a failed complication
      // re-arrests each step). Each distinct outcome counts once.
      if (seenOutcomes.has(text)) continue;
      seenOutcomes.add(text);
      if (/FAILURE/.test(text)) {
        history.outcomes.push({ tSec: last?.t ?? 0, text });
        for (const entry of history.injections) entry.revealed = true;
        speak({ concept: 'FAILURE' }, { force: true });
        continue;
      }
      if (/Naloxone SLAM/i.test(text)) {
        history.outcomes.push({ tSec: last?.t ?? 0, text });
        speak({ concept: 'NALOXONE_SURGE' }, { force: true });
        continue;
      }
      const match = SCENARIO_LOG_PATTERNS.find(({ pattern }) => pattern.test(text));
      if (!match) continue;
      history.outcomes.push({ tSec: last?.t ?? 0, text });
      for (const entry of history.injections) {
        if (entry.type === match.type && entry.resolvedAtSec === null) {
          entry.resolvedAtSec = last?.t ?? 0;
          entry.revealed = true;
        }
      }
      speak({
        concept: 'RESOLVED',
        complicationLabel: capitalize(COMPLICATION_LABELS[match.type] ?? match.type),
      });
    }
  }

  function performInjection(type) {
    schedule(() => {
      if (!settings.enabled || !directorAllowed()) return;
      if (!isLive(runner.snapshot?.() ?? last)) return;
      pendingInjection = type;
      try {
        runner.injectComplication(type);
      } catch {
        // Unsupported or rejected: the director simply moves on.
      } finally {
        pendingInjection = null;
      }
    });
  }

  function observe(snapshot) {
    if (!snapshot) return;
    if (last && finite(snapshot.t) && finite(last.t) && snapshot.t + 0.5 < last.t) {
      // Runner reset or rebuilt: start a fresh case without replaying old log lines.
      resetState();
      lastLifecycle = null;
      scenarioLogIndex = Array.isArray(runner?.s?.eventLog) ? runner.s.eventLog.length : 0;
    }
    const previousLifecycle = lastLifecycle;
    lastLifecycle = snapshot.lifecycle;
    last = snapshot;
    if (previousLifecycle === 'RUNNING' && snapshot.lifecycle === 'PAUSED') {
      speak({ concept: 'PAUSED' }, { force: true });
    }
    if (!isLive(snapshot)) return;
    if (previousLifecycle !== 'RUNNING') speak({ concept: 'CASE_START' }, { force: true });

    const t = finite(snapshot.t) ? snapshot.t : 0;
    if (lastEvalT !== null && t - lastEvalT < 0.5) return; // evaluate twice per sim second at most
    const dt = lastEvalT === null ? 0 : Math.min(10, Math.max(0, t - lastEvalT));
    lastEvalT = t;

    trackExtremes(snapshot);
    readScenarioLog();
    const active = activeComplications();
    const intensity = computeIntensity(snapshot);
    evaluateBands(snapshot);

    if (intensity >= 0.35
      && t - history.lastLearnerActionT >= IDLE_LIMIT_SEC
      && idleBarkedForAction !== history.learnerActions.length) {
      if (speak({ concept: 'IDLE' })) idleBarkedForAction = history.learnerActions.length;
    }

    const decision = director.update({
      snapshot, dt, intensity, profile: profile(), active, history,
      enabled: settings.enabled && directorAllowed(),
    });
    if (decision?.inject) performInjection(decision.inject);
    if (settings.enabled && !decision?.inject) maybeChatter(snapshot, intensity, active);
  }

  function treatMatches(type, { drug = null, action = null }) {
    const plan = TREATMENTS[type];
    if (!plan) return false;
    return (drug !== null && plan.drugs.includes(drug)) || (action !== null && plan.actions.includes(action));
  }

  function handleTreatment({ drug = null, action = null, tSec }) {
    const active = new Set(activeComplications());
    if ((last?.lidocaineToxicityStage ?? 'none') !== 'none') active.add('LocalAnestheticToxicity');
    const target = history.injections.find((entry) => entry.treatedAtSec === null
      && active.has(entry.type) && treatMatches(entry.type, { drug, action }));
    if (target) {
      target.treatedAtSec = tSec;
      target.revealed = true;
      speak({ concept: 'TREATED', complicationType: target.type, drug }, { force: true });
      return true;
    }
    // Rescue drug for a complication the learner caused themselves (or an
    // instructor injection already revealed): still correct, no roast.
    for (const type of active) {
      if (treatMatches(type, { drug, action })) return true;
    }
    return false;
  }

  function observeEvent(entry) {
    if (!entry) return;
    const meta = entry.meta ?? {};
    const action = meta.action;
    const tSec = finite(entry.t) ? entry.t : (last?.t ?? 0);
    if (typeof action !== 'string' || meta.source === 'scenario') return;

    if (action === 'complication') {
      const source = pendingInjection === meta.type ? 'booth' : 'instructor';
      history.injections.push({
        type: meta.type, source, tSec, treatedAtSec: null, resolvedAtSec: null, revealed: false,
      });
      speak({ concept: source === 'booth' ? 'INJECTED' : 'INSTRUCTOR_INJECTED' }, { force: source === 'booth' });
      return;
    }
    if (NON_LEARNER_ACTIONS.has(action)) return;

    history.lastLearnerActionT = tSec;
    history.learnerActions.push({ tSec, action, detail: entry.detail ?? '' });
    if (history.learnerActions.length > 400) history.learnerActions.shift();

    switch (action) {
      case 'drug': {
        const drug = meta.drug;
        const doseMg = meta.doseMg;
        history.drugsGiven.add(drug);
        history.lastDrugT = tSec;
        if (handleTreatment({ drug, tSec })) return;
        // Only clear mismatches get called out. Empiric or supportive choices
        // (albuterol in anaphylaxis, a pressor for any hypotension) stay quiet.
        const live = activeComplications();
        const dantroleneWithoutMh = drug === 'Dantrolene' && !live.includes('MalignantHyperthermia');
        const naloxoneWithoutOpioid = drug === 'Naloxone'
          && !history.drugsGiven.has('Fentanyl') && !live.includes('OpioidRespDepression');
        if (dantroleneWithoutMh || naloxoneWithoutOpioid) {
          speak({ concept: 'SHOTGUN', drug, doseMg });
          return;
        }
        speak({ concept: 'DRUG', drug, doseMg, treating: false });
        return;
      }
      case 'volatile_changed':
        if (meta.dialPercent === 0 && activeComplications().includes('MalignantHyperthermia')) {
          speak({ concept: 'TRIGGER_OFF', dantroleneGiven: history.drugsGiven.has('Dantrolene') });
          return;
        }
        speak({ concept: 'VOLATILE', agent: meta.agent, dial: meta.dialPercent });
        return;
      case 'cricoid_pressure_applied':
        speak({ concept: 'CRICOID' });
        return;
      case 'vent_mode_changed':
        speak({ concept: 'VENT_MODE' });
        return;
      case 'preoxygenate':
        history.preoxygenated = true;
        speak({ concept: 'PREOX' });
        return;
      case 'intubation_attempt_started':
        speak({ concept: 'INTUBATION_START', preoxygenated: history.preoxygenated });
        return;
      case 'intubation_attempt_failed':
        history.failedAttempts += 1;
        speak({ concept: 'INTUBATION_FAILED', failedAttempts: history.failedAttempts, attempts: history.failedAttempts }, { force: true });
        return;
      case 'intubation_attempt_succeeded':
        history.wasIntubated = true;
        speak({ concept: 'INTUBATION_SUCCESS', failedAttempts: history.failedAttempts }, { force: true });
        return;
      case 'mask_ppv_started':
        speak({ concept: 'MASK_PPV', failedAttempts: history.failedAttempts });
        return;
      case 'extubate':
        history.wasIntubated = true;
        speak({ concept: 'EXTUBATE', tofRatio: last?.tofRatio }, { force: true });
        return;
      case 'tof_checked':
        speak({ concept: 'TOF_CHECK' });
        return;
      case 'lipid_emulsion_bolus':
      case 'lipid_emulsion_infusion_started':
        if (!handleTreatment({ action, tSec }) && (last?.lidocaineToxicityStage ?? 'none') === 'none') {
          speak({ concept: 'SHOTGUN_LIPID' });
        }
        return;
      case 'regional_lidocaine_administered':
        if (/epidural/i.test(entry.detail ?? '') || meta.route === 'epidural') history.epiduralGiven = true;
        return;
      default:
    }
  }

  /* Grounded context for the language model. In 'ask' mode an injected
     complication the trainee hasn't treated is withheld entirely, so the
     model cannot leak a diagnosis it was never told. */
  function caseContext({ revealAll = false } = {}) {
    const s = last ?? {};
    const round = (value, digits = 0) => (finite(value) ? Number(value.toFixed(digits)) : null);
    return {
      operatorName: OPERATOR_NAME,
      simTimeSec: round(s.t),
      lifecycle: s.lifecycle ?? null,
      patient: s.patient ?? null,
      vitals: {
        hr: round(s.hr), sbp: round(s.sbp), dbp: round(s.dbp), map: round(s.map), spo2: round(s.spo2),
        etco2: s.capnogramPresent === false ? null : round(s.etco2), temp: round(s.temp, 1),
        tofCount: s.tof ?? null, tofRatio: round(s.tofRatio, 2), airwayDevice: s.airwayDevice ?? null,
        vaporizerAgent: s.vaporizer > 0 ? s.vaporizerAgent : null, vaporizerDial: round(s.vaporizer, 1),
        fio2: round(s.fio2, 2), rhythm: s.derivedRhythm ?? null,
      },
      extremes: {
        minSpO2: round(history.extremes.minSpO2), minMap: round(history.extremes.minMap),
        maxHr: round(history.extremes.maxHr), maxEtco2: round(history.extremes.maxEtco2),
        maxTemp: round(history.extremes.maxTemp, 1),
      },
      learnerActions: history.learnerActions.slice(-40).map((a) => ({ tSec: round(a.tSec), action: a.action, detail: a.detail })),
      intubation: { failedAttempts: history.failedAttempts, preoxygenated: history.preoxygenated },
      injections: history.injections.map((entry) => {
        const disclose = revealAll || entry.revealed;
        return {
          complication: disclose ? (COMPLICATION_LABELS[entry.type] ?? entry.type) : null,
          disclosed: disclose,
          source: entry.source,
          injectedAtSec: round(entry.tSec),
          treatedAtSec: round(entry.treatedAtSec),
          resolvedAtSec: round(entry.resolvedAtSec),
          timeToTreatmentSec: finite(entry.treatedAtSec) ? round(entry.treatedAtSec - entry.tSec) : null,
        };
      }),
      // Outcomes are only recorded once a complication resolves or fails, and
      // both reveal it, so nothing here can name a hidden complication.
      outcomes: history.outcomes.slice(-12).map((o) => o.text),
      recentLines: transcript.slice(-8).map((line) => line.text),
      directorPhase: director.getState().phase,
    };
  }

  return {
    observe,
    observeEvent,
    caseContext,
    setMeanness(level) { if ([1, 2, 3].includes(Number(level))) settings.meanness = Number(level); },
    setChaos(level) {
      if (Object.hasOwn(CHAOS_PROFILES, Number(level))) {
        settings.chaos = Number(level);
        director.raiseCap();
      }
    },
    setEnabled(value) { settings.enabled = Boolean(value); },
    setChatter(level) {
      if (CHATTER_LEVELS.some((entry) => entry.id === Number(level))) {
        settings.chatter = Number(level);
        nextAmbientGapMs = pickAmbientGap();
      }
    },
    forceSoon() { director.forceSoon(); },
    reset: resetState,
    getSettings() { return { ...settings, directorAllowed: directorAllowed() }; },
    getDirectorState() { return director.getState(); },
    getHistory() {
      return {
        ...history,
        drugsGiven: [...history.drugsGiven],
        injections: history.injections.map((entry) => ({ ...entry })),
      };
    },
    getTranscript() { return transcript.map((line) => ({ ...line })); },
    isRevealed: revealed,
  };
}

function capitalize(text) {
  return text ? text[0].toUpperCase() + text.slice(1) : text;
}

/* Offline fallbacks so Booth still works with no API key or no network.
   Both read only the grounded case context. */
export function buildLocalAnswer(context = {}) {
  const v = context.vitals ?? {};
  const parts = [];
  if (finite(v.spo2)) parts.push(`SpO2 ${v.spo2}`);
  if (finite(v.map)) parts.push(`MAP ${v.map}`);
  if (finite(v.hr)) parts.push(`HR ${v.hr}`);
  if (finite(v.etco2)) parts.push(`EtCO2 ${v.etco2}`);
  if (finite(v.temp)) parts.push(`temp ${v.temp}`);
  const reading = parts.length > 0 ? parts.join(', ') : 'nothing useful yet';
  return `My brain is offline, so here's the monitor: ${reading}. Start with whatever is furthest from normal and ask what causes it.`;
}

export function buildLocalRoast(context = {}, meanness = 2) {
  const x = context.extremes ?? {};
  const lines = [];
  const minutes = finite(context.simTimeSec) ? Math.round(context.simTimeSec / 60) : 0;
  const opener = {
    1: `Case review, ${minutes} minutes of sim time.`,
    2: `${minutes} minutes of sim time. I watched all of it. You're welcome.`,
    3: `${minutes} minutes of sim time I'll never get back. Let's do this.`,
  }[meanness] ?? `Case review, ${minutes} minutes.`;
  lines.push(opener);
  if (finite(x.minSpO2) && x.minSpO2 < 90) lines.push(`Lowest SpO2 was ${x.minSpO2}. Oxygenation slipped. Find the moment it started.`);
  if (finite(x.minMap) && x.minMap < 65) lines.push(`Lowest MAP was ${x.minMap}. Below 65 counts, even when it's brief.`);
  if (finite(x.maxEtco2) && x.maxEtco2 > 55) lines.push(`EtCO2 peaked at ${x.maxEtco2}. Know whether that was ventilation or production.`);
  if (finite(x.maxTemp) && x.maxTemp >= 38.5) lines.push(`Temperature reached ${x.maxTemp}. That should have been a clue.`);
  const failed = context.intubation?.failedAttempts ?? 0;
  if (failed > 0) lines.push(`${failed} failed intubation attempt${failed === 1 ? '' : 's'}. Oxygenate between attempts and change something before the next one.`);
  if (context.intubation && context.intubation.preoxygenated === false && (context.learnerActions ?? []).some((a) => a.action === 'intubation_attempt_started')) {
    lines.push('No preoxygenation before the airway. That reserve is the whole safety margin.');
  }
  for (const entry of context.injections ?? []) {
    const name = entry.complication ?? 'An undisclosed complication';
    if (finite(entry.timeToTreatmentSec)) {
      lines.push(`${capitalize(name)}: treated ${entry.timeToTreatmentSec} seconds after onset.`);
    } else if (finite(entry.resolvedAtSec)) {
      lines.push(`${capitalize(name)}: resolved without a targeted rescue from you. Know what you would have given.`);
    } else {
      lines.push(`${capitalize(name)}: never got definitive treatment.`);
    }
  }
  if (lines.length === 1) lines.push('No major derangements. Either you were good or I was asleep. Run it again on a higher chaos setting.');
  return lines.join(' ');
}
