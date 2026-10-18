/* Booth talks with the student.

   The student tells Booth what they are doing ("I'm going to intubate now",
   "the tube is in"). Booth answers the student in character and, separately,
   writes a private note to the sim operator (the instructor): what the
   student may have missed, what it would cause, and engine actions the
   instructor can take to make the consequence real.

   Teaching rule, chosen deliberately: before the student acts, Booth never
   names what is missing. He lets them commit ("Bold. Let's see how that
   goes."). Once they report the action as done, the mistake is history and
   Booth may name it, sarcastically, about the decision and never about the
   person. The instructor sees the full analysis the whole time.

   Truth boundary: the analysis reads only engine facts (drugs given,
   effect site levels, TOF, MAC, airway state) and the Mock OR answer key.
   The engine does not fail laryngoscopy for lack of a paralytic, so that
   consequence exists only if the instructor chooses to apply it.

   Pure functions; the DOM and network live in the controllers. */

export const PARALYTICS = Object.freeze(['Rocuronium', 'Succinylcholine', 'Vecuronium', 'Cisatracurium']);
export const HYPNOTICS = Object.freeze(['Propofol', 'Etomidate', 'Ketamine', 'Methohexital']);

/* Actions the instructor can take from a Booth note. Anything a model
   suggests outside this list is dropped. */
export const STUDENT_SUGGESTIONS = Object.freeze({
  fail_intubation: { label: 'FAIL THIS INTUBATION ATTEMPT', kind: 'fail_intubation' },
  inject_laryngospasm: { label: 'INJECT LARYNGOSPASM', kind: 'inject', complication: 'Laryngospasm' },
  inject_bronchospasm: { label: 'INJECT BRONCHOSPASM', kind: 'inject', complication: 'Bronchospasm' },
  inject_opioid_resp: { label: 'INJECT OPIOID RESPIRATORY DEPRESSION', kind: 'inject', complication: 'OpioidRespDepression' },
  stimulus_high: { label: 'APPLY STRONG SURGICAL STIMULUS', kind: 'stimulus', intensity: 0.8 },
});

const INTENTS = [
  ['extubate', /\bextubat|pull(ing)? (the )?tube|tube out\b|take (the )?tube out/],
  ['intubate', /\bintubat|\btub(e|ed|ing) (him|her|them|the patient|my patient)|\b(place|placing|put|putting|pass|passing) (the |an |my )?(ett|tube|endotracheal)|laryngoscop|glidescope|video ?laryngoscope|\bdl\b|\bvl\b|tube is in|\bi tubed\b|i have tubed|i've tubed/],
  ['reverse', /sugammadex|neostigmine|\brevers/],
  ['paralyze', /\broc(uronium)?\b|\bsux\b|succ|paraly|vec(uronium)?|cisatrac|\bnmb\b/],
  ['induce', /\binduc|propofol|etomidate|ketamine|put (him|her|them|the patient) (to sleep|under)|going to sleep/],
  ['preoxygenate', /pre-?ox|preoxygen|denitrogen/],
  ['incision', /incision|\bcut\b|surgeon (can|may) (start|go|cut)|start (the )?(case|surgery)|ok to (start|cut)/],
  ['mask', /mask ventilat|bag(ging)? (him|her|them|the patient)|bag mask|\bbvm\b/],
];

const DONE = /\b(i have|i've|i just|just|already|done|finished|placed|secured|is in|are in|went in)\b|\b(intubated|extubated|tubed|induced|paralyzed|reversed|gave|pushed|preoxygenated)\b/;
const PLAN = /\b(going to|gonna|about to|i will|i'll|i'm going|let me|let's|plan(ning)? to|want to|ready to|now)\b/;

export function classifyStudentStatement(text) {
  const t = String(text ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
  if (!t) return { intent: 'none', tense: 'other', text: '' };
  const hit = INTENTS.find(([, pattern]) => pattern.test(t));
  const intent = hit ? hit[0] : 'other';
  let tense;
  if (/\?\s*$/.test(t) || /^(what|why|how|should|can|could|is|are|do|does|did|would)\b/.test(t)) tense = 'question';
  else if (PLAN.test(t) && !/\b(i have|i've|already|is in)\b/.test(t)) tense = 'plan';
  else if (DONE.test(t)) tense = 'done';
  else tense = intent === 'other' ? 'other' : 'plan';
  return { intent, tense, text: t };
}

function finite(value) { return typeof value === 'number' && Number.isFinite(value); }

/* Facts the analysis may use, gathered by the console from the runner and
   Booth's history. Everything is optional. */
export function studentFacts({ snapshot = {}, history = {}, answerKey = null } = {}) {
  const drugs = new Set([...(history.drugsGiven ?? [])].map(String));
  const keyText = answerKey ? JSON.stringify(answerKey).toLowerCase() : '';
  return {
    drugsGiven: [...drugs],
    paralyticGiven: PARALYTICS.some((drug) => drugs.has(drug)),
    hypnoticGiven: HYPNOTICS.some((drug) => drugs.has(drug)),
    preoxygenated: Boolean(history.preoxygenated),
    nmb: finite(snapshot.effectiveNmbBlockade) ? snapshot.effectiveNmbBlockade : null,
    propofolCe: finite(snapshot.propofolCe) ? snapshot.propofolCe : null,
    mac: finite(snapshot.mac) ? snapshot.mac : null,
    tof: finite(snapshot.tof) ? snapshot.tof : null,
    tofRatio: finite(snapshot.tofRatio) ? snapshot.tofRatio : null,
    spont: snapshot.spont ?? null,
    airwayDevice: snapshot.airwayDevice ?? null,
    intubationInProgress: Boolean(snapshot.intubationInProgress),
    infusionRunning: (snapshot.activeAnestheticInfusions?.length ?? 0) > 0,
    // Charts where avoiding or minimizing paralysis is the point (myasthenia,
    // Lambert-Eaton, nerve monitoring). Booth flags, the instructor judges.
    caseAvoidsParalysis: /avoid (or minimize )?(nmb|neuromuscular)|avoid nmb|no nmb|without nmb|minimal or no nmb|no nmb after intubation|avoid long acting nmb/.test(keyText),
    caseNeedsRsi: /\brsi\b|rapid sequence/.test(keyText),
  };
}

function asleep(f) {
  return f.hypnoticGiven || (f.propofolCe !== null && f.propofolCe >= 1.5) || (f.mac !== null && f.mac >= 0.5) || f.infusionRunning;
}

function relaxed(f) {
  return f.paralyticGiven || (f.nmb !== null && f.nmb >= 0.5);
}

/* What the student may have missed for this action. Each issue carries what
   it would cause and which instructor actions fit. */
export function analyzeStudentAction({ intent, tense }, f) {
  const issues = [];
  const add = (id, missed, consequence, suggestions = [], severity = 'major') => issues.push({ id, missed, consequence, suggestions, severity });
  // They report it done, but the engine disagrees: worth telling the instructor.
  if (tense === 'done' && intent === 'intubate' && f.airwayDevice && f.airwayDevice !== 'intubated') {
    add('claimed_not_done', f.intubationInProgress ? 'They say the tube is in, but the attempt is still in progress in the engine' : 'They say the tube is in, but no intubation is recorded in the engine',
      'Ask them to perform it on the console (INTUBATE) or confirm with EtCO2', [], 'minor');
  }
  if (tense === 'done' && intent === 'extubate' && f.airwayDevice === 'intubated') {
    add('claimed_not_done', 'They say they extubated, but the engine still shows an endotracheal tube', 'Ask them to perform it on the console (EXTUBATE)', [], 'minor');
  }
  if (intent === 'intubate') {
    if (f.airwayDevice === 'intubated' && tense !== 'done') add('already_intubated', 'The patient is already intubated', 'Nothing to do; ask what they actually mean', [], 'minor');
    if (!asleep(f)) {
      add('not_asleep', 'No hypnotic on board (no induction agent given, low effect site and MAC)',
        'Laryngoscopy on an awake patient: recall, hypertension, tachycardia, coughing, laryngospasm',
        ['inject_laryngospasm', 'fail_intubation'], 'critical');
    }
    if (!relaxed(f)) {
      if (f.caseAvoidsParalysis) {
        add('no_paralytic_planned', 'No paralytic, which this chart may justify (paralysis avoided or minimized)',
          'If they chose this on purpose, ask for their reasoning and how they will get good conditions (depth, remifentanil, lidocaine)', [], 'minor');
      } else {
        add('no_paralytic', 'No neuromuscular blocker given',
          'Poor view and closed cords, coughing and bucking, vocal cord trauma, laryngospasm, likely failed first attempt',
          ['fail_intubation', 'inject_laryngospasm'], 'major');
      }
    }
    if (!f.preoxygenated) {
      add('no_preox', 'No preoxygenation recorded',
        'Short safe apnea time; the engine will desaturate the patient sooner during the attempt', [], 'major');
    }
  } else if (intent === 'extubate') {
    if (f.tofRatio !== null && f.tofRatio < 0.9) {
      add('residual_block', `TOF ratio ${f.tofRatio.toFixed(2)} (below 0.9)`,
        'Residual weakness: hypoventilation, airway obstruction, aspiration, reintubation', [], 'critical');
    }
    if (f.spont === false) add('apneic', 'No spontaneous breathing', 'Apnea after extubation; immediate desaturation', [], 'critical');
    if (f.mac !== null && f.mac > 0.2 && f.mac < 0.8) {
      add('stage_two', `MAC ${f.mac.toFixed(2)}, likely in the excitement stage`,
        'Laryngospasm on emergence', ['inject_laryngospasm'], 'major');
    }
  } else if (intent === 'induce') {
    if (!f.preoxygenated) add('no_preox', 'No preoxygenation recorded', 'Faster desaturation once apneic', [], 'major');
    if (f.caseNeedsRsi) add('rsi_case', 'This chart calls for a rapid sequence plan', 'Aspiration risk if they mask ventilate or delay securing the airway', [], 'minor');
  } else if (intent === 'incision') {
    if (!asleep(f)) {
      add('light', 'Anesthetic depth looks light for incision', 'Movement, hypertension, tachycardia, awareness', ['stimulus_high'], 'critical');
    }
  } else if (intent === 'reverse') {
    if (f.tof === 0) add('deep_block', 'TOF count 0', 'Neostigmine cannot reverse a deep block; sugammadex dose must match depth', [], 'major');
  } else if (intent === 'mask') {
    if (f.caseNeedsRsi && !relaxed(f)) add('rsi_mask', 'Mask ventilation in a chart that calls for RSI', 'Gastric insufflation and aspiration risk', [], 'minor');
  }
  const order = { critical: 0, major: 1, minor: 2 };
  issues.sort((x, y) => order[x.severity] - order[y.severity]);
  const suggestions = [...new Set(issues.flatMap((issue) => issue.suggestions))];
  return { intent, issues, suggestions };
}

function pick(lines, random) {
  return lines[Math.min(lines.length - 1, Math.floor(random() * lines.length))];
}

const PLAN_WITH_ISSUES = {
  1: ['Okay. Walk me through it as you go.', 'Your call. I\'m watching.', 'Proceed when you are ready.'],
  2: ['Bold. Let\'s see how that goes.', 'Sure. What could possibly go wrong.', 'Interesting choice. I\'ll be right here.'],
  3: ['Oh, absolutely. Go right ahead. I\'ll get the popcorn.', 'Love the confidence. Hate the plan. Go on.', 'You sure? Never mind, don\'t answer that. Proceed.'],
};
const PLAN_CLEAN = {
  1: ['Sounds reasonable. Go ahead.', 'Okay. Carry on.'],
  2: ['Fine. Don\'t make it weird.', 'Reasonable. I\'m almost disappointed.'],
  3: ['Competent. Ugh. Go.', 'Nothing for me to make fun of. Rude.'],
};
const DONE_CLEAN = {
  1: ['Done. Now confirm it.', 'Good. Keep watching the monitor.'],
  2: ['Fine. Prove it on the monitor.', 'Look at you. Keep it that way.'],
  3: ['Wow, it worked. Write it down, it may not happen again.', 'Okay, that was clean. Don\'t get used to the compliments.'],
};
const REVEAL = {
  no_paralytic: ['You tubed without a paralytic. The cords had opinions about that.', 'Congratulations, you intubated someone who could still fight back.'],
  not_asleep: ['You put a blade in an awake patient\'s mouth. They\'ll remember you.', 'Laryngoscopy without an induction agent. Bold way to make an enemy.'],
  no_preox: ['No preox, and now you\'re racing the pulse ox.', 'Skipped preoxygenation. Hope you like watching that number fall.'],
  residual_block: ['You pulled the tube on a TOF ratio under 0.9. Interesting way to test a diaphragm.', 'Extubated with residual block. Their airway muscles say thanks for nothing.'],
  apneic: ['You extubated someone who wasn\'t breathing. That is a choice.'],
  stage_two: ['Pulling the tube in the excitement stage. Laryngospasm sends its regards.'],
  light: ['They cut on a light patient. Hope you like hypertension.'],
  deep_block: ['Neostigmine at TOF zero. That\'s a wish, not a reversal.'],
  rsi_case: ['That chart was begging for a rapid sequence plan.'],
  rsi_mask: ['Mask ventilating the full stomach. The stomach is filling up nicely.'],
  claimed_not_done: ['Is it, though? The monitor disagrees.'],
  no_paralytic_planned: ['No paralytic. Hope that was deliberate.'],
  already_intubated: ['They are already intubated. Keep up.'],
};

/* Offline reply to the student. Never names an issue before the action. */
export function buildStudentReply(classification, analysis, { meanness = 2, random = Math.random } = {}) {
  const heat = [1, 2, 3].includes(meanness) ? meanness : 2;
  const serious = analysis.issues.filter((issue) => issue.severity !== 'minor');
  if (classification.tense === 'done') {
    if (serious.length === 0) {
      if (analysis.issues.some((issue) => issue.id === 'claimed_not_done')) return pick(REVEAL.claimed_not_done, random);
      return pick(DONE_CLEAN[heat], random);
    }
    return pick(REVEAL[serious[0].id] ?? ['That went about how I expected.'], random);
  }
  if (classification.tense === 'question') {
    return pick({
      1: ['Good question. What do the numbers tell you?', 'Think it through out loud. What would you check first?'],
      2: ['Great question. Look at the monitor and answer it yourself.', 'I\'m the booth, not the answer key. What does the monitor say?'],
      3: ['Asking me? Bold. The monitor is right there.', 'I could tell you. I won\'t. Check the patient.'],
    }[heat], random);
  }
  if (classification.intent === 'other') {
    return pick({ 1: ['Noted.', 'Okay.'], 2: ['Noted. Riveting.', 'Fascinating. Carry on.'], 3: ['Cool story.', 'Thanks for the update nobody asked for.'] }[heat], random);
  }
  return pick(serious.length > 0 ? PLAN_WITH_ISSUES[heat] : PLAN_CLEAN[heat], random);
}

/* Private note to the instructor. Plain, specific, no attitude. */
export function buildOperatorNote(statement, classification, analysis) {
  const said = `Student said: "${String(statement).slice(0, 200)}"`;
  if (analysis.issues.length === 0) {
    return `${said}. Nothing missing that I can see from the engine state.`;
  }
  const lines = analysis.issues.map((issue) => `${issue.missed}. Would cause: ${issue.consequence}.`);
  const timing = classification.tense === 'done'
    ? 'They report it as done.'
    : 'They have not done it yet; I did not tell them what is missing.';
  return `${said}. ${timing} ${lines.join(' ')}`;
}

/* Words that would give an issue away. Before the student acts, a model reply
   that contains any of them is discarded for the offline line: the rule is
   enforced in code, not left to the model's instructions. */
const ISSUE_HINTS = {
  no_paralytic: /paraly|\broc(uronium)?\b|\bsux\b|succinyl|vecuron|cisatrac|relax|blocker|\bnmb\b|neuromuscular/i,
  no_paralytic_planned: /paraly|\broc(uronium)?\b|relax|blocker|\bnmb\b|neuromuscular/i,
  not_asleep: /awake|conscious|asleep|induc|propofol|etomidate|ketamine|hypnotic|sedat/i,
  no_preox: /pre-?ox|preoxygen|denitrogen|oxygen reserve|\bfao2\b|apnea time/i,
  residual_block: /\btof\b|train of four|residual|revers|sugammadex|neostigmine|twitch|block/i,
  apneic: /breath|apne|spontaneous/i,
  stage_two: /stage|excitement|laryngospasm|\bmac\b|deep|light/i,
  light: /light|depth|\bmac\b|deep|awareness/i,
  deep_block: /\btof\b|twitch|neostigmine|sugammadex|deep block/i,
  rsi_case: /\brsi\b|rapid sequence|cricoid|full stomach|aspirat/i,
  rsi_mask: /\brsi\b|rapid sequence|full stomach|aspirat|insufflat/i,
};

export function replyGivesAwayIssue(reply, issues = []) {
  return issues.some((issue) => ISSUE_HINTS[issue.id]?.test(String(reply ?? '')));
}

/* The model answers in JSON; keep only well formed fields and whitelisted
   suggestions. Returns null when the text is unusable. */
export function parseStudentModelReply(text, allowed = Object.keys(STUDENT_SUGGESTIONS)) {
  if (typeof text !== 'string') return null;
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try {
    const data = JSON.parse(text.slice(start, end + 1));
    const reply = typeof data.reply === 'string' ? data.reply.trim() : '';
    if (!reply) return null;
    return {
      reply,
      operatorNote: typeof data.operatorNote === 'string' ? data.operatorNote.trim() : '',
      suggestions: Array.isArray(data.suggestions) ? data.suggestions.filter((id) => allowed.includes(id)) : [],
    };
  } catch {
    return null;
  }
}
