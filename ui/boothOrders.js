/* What the student tells Booth to do, turned into engine orders.

   Speech recognition mangles drug names ("rocker onion" for rocuronium,
   "automatic" for etomidate). This module hears through that: a list of
   known mishearings, then a sound alike match on a consonant skeleton of the
   words. It reads doses in digits or words ("one hundred of roc", "fifty
   mics of fentanyl", "point six per kilo"), checks they are plausible, and
   returns orders the console can carry out. A drug named without a dose
   comes back as needsDose so Booth can ask for it; the next number the
   student says completes it.

   Pure functions. The console decides whether to carry the orders out. */

export const ORDER_DRUGS = Object.freeze({
  Propofol: { unit: 'mg', range: [10, 500], aliases: ['propofol', 'propofal', 'propafol', 'pro pofol', 'propel', 'pro full', 'proper fall', 'prop of all', 'diprivan', 'milk of amnesia', 'pro paul', 'propo'] },
  Etomidate: { unit: 'mg', range: [2, 60], aliases: ['etomidate', 'etomidat', 'etomidite', 'etoma date', 'eto', 'a tomato date', 'automatic', 'automated', 'atomic date', 'edamame date', 'amidate', 'etomidates'] },
  Ketamine: { unit: 'mg', range: [5, 400], aliases: ['ketamine', 'keta mean', 'ketameen', 'keta meen', 'cat a mean', 'special k', 'ketalar', 'k t mean'] },
  Midazolam: { unit: 'mg', range: [0.25, 10], aliases: ['midazolam', 'versed', 'verse', 'mid as lamb', 'mid as lam', 'midaz', 'versa'] },
  Fentanyl: { unit: 'mcg', range: [0.01, 0.5], aliases: ['fentanyl', 'fentanil', 'fentanol', 'fent', 'fentanyls', 'sublimaze', 'fenta'] },
  Rocuronium: { unit: 'mg', range: [5, 300], aliases: ['rocuronium', 'roc', 'rock', 'rocky', 'rocker onion', 'rocker on ium', 'rock uranium', 'rocurium', 'rock your own ium', 'zemuron', 'rocker onium', 'roc uranium', 'rokuronium', 'rocks'] },
  Vecuronium: { unit: 'mg', range: [1, 20], aliases: ['vecuronium', 'vec', 'veck', 'vecs', 'back uranium', 'vecker onion', 'vecurium'] },
  Pancuronium: { unit: 'mg', range: [1, 15], aliases: ['pancuronium', 'panc', 'pank', 'pancake uranium', 'pancurium', 'pan uranium', 'pan curonium'] },
  Succinylcholine: { unit: 'mg', range: [20, 250], aliases: ['succinylcholine', 'sux', 'succs', 'sucks', 'succ', 'suxamethonium', 'anectine', 'succinyl choline', 'sucks in a coaling', 'succinyl', 'sexy colin'] },
  Phenylephrine: { unit: 'mcg', range: [0.025, 0.5], aliases: ['phenylephrine', 'phenyl', 'neo', 'neosynephrine', 'neo synephrine', 'phenylephrin', 'funnel effort', 'fennel effrin'] },
  Ephedrine: { unit: 'mg', range: [2.5, 50], aliases: ['ephedrine', 'ephedra', 'ephedrin', 'a fed rain', 'ephed', 'efedrin'] },
  Epinephrine: { unit: 'mcg', range: [0.005, 1], aliases: ['epinephrine', 'epi', 'adrenaline', 'epinephrin', 'happy nephron', 'epi pen'] },
  Atropine: { unit: 'mg', range: [0.2, 2], aliases: ['atropine', 'atropin', 'a trope een'] },
  Glycopyrrolate: { unit: 'mg', range: [0.1, 1], aliases: ['glycopyrrolate', 'glyco', 'glycopyrolate', 'robinul', 'glyco pyro late', 'glycopyrrolates'] },
  Neostigmine: { unit: 'mg', range: [0.5, 5], aliases: ['neostigmine', 'neostigmin', 'neo stigmine', 'neo stigma mean', 'bloxiverz'] },
  Sugammadex: { unit: 'mg', range: [50, 1600], aliases: ['sugammadex', 'sugamadex', 'sugar madex', 'sugar mad ex', 'sugar max', 'bridion', 'sugar madness', 'sugamadecks', 'suggs'] },
  Naloxone: { unit: 'mg', range: [0.02, 2], aliases: ['naloxone', 'narcan', 'naloxon', 'nar can', 'nalaxone'] },
  Dantrolene: { unit: 'mg', range: [20, 1000], aliases: ['dantrolene', 'dantrium', 'ryanodex', 'dantroline', 'dan trolene'] },
  Albuterol: { unit: 'mg', range: [0.09, 5], aliases: ['albuterol', 'albuterols', 'ventolin', 'al butyrol', 'puffs of albuterol'] },
});

const NUMBER_WORDS = {
  zero: 0, oh: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  a: 1, an: 1, half: 0.5,
};
const SCALE_WORDS = { hundred: 100, thousand: 1000 };

/* "one hundred fifty" -> "150", "point six" -> "0.6", "two point five" -> "2.5". */
export function wordsToDigits(text) {
  const tokens = String(text ?? '').toLowerCase().replace(/(\d),(\d)/g, '$1$2').split(/\s+/).filter(Boolean);
  const out = [];
  let value = null;
  let decimal = null;
  const flush = () => {
    if (value === null && decimal === null) return;
    out.push(String(decimal === null ? value : (value ?? 0) + Number(`0.${decimal}`)));
    value = null; decimal = null;
  };
  for (let i = 0; i < tokens.length; i += 1) {
    const word = tokens[i].replace(/[^a-z0-9.]/g, '');
    const next = tokens[i + 1]?.replace(/[^a-z0-9.]/g, '');
    const isNumberWord = Object.hasOwn(NUMBER_WORDS, word) && !['a', 'an', 'oh', 'half'].includes(word);
    if (decimal !== null && (isNumberWord || /^\d$/.test(word))) { decimal += String(NUMBER_WORDS[word] ?? word); continue; }
    if (word === 'point' && (value !== null || Object.hasOwn(NUMBER_WORDS, next) || /^\d/.test(next ?? ''))) {
      decimal = '';
      continue;
    }
    if (isNumberWord) { value = (value ?? 0) + NUMBER_WORDS[word]; continue; }
    if ((word === 'a' || word === 'an') && SCALE_WORDS[next]) { value = (value ?? 0) + 1; continue; }
    if (SCALE_WORDS[word] && value !== null) {
      value = word === 'hundred' ? (value % 100) * 100 + Math.floor(value / 100) * 100 : value * SCALE_WORDS[word];
      continue;
    }
    if (word === 'and' && value !== null && Object.hasOwn(NUMBER_WORDS, next)) continue;
    if (word === 'half' && value !== null) { value += 0.5; continue; }
    flush();
    out.push(tokens[i]);
  }
  flush();
  return out.join(' ');
}

function clean(text) {
  return wordsToDigits(String(text ?? '').toLowerCase())
    .replace(/(\d)\s*(mg|mcg|ml|cc|g)\b/g, '$1 $2')
    .replace(/[^a-z0-9.%/ ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* A rough sound skeleton: spelling that sounds alike collapses, vowels drop
   after the first letter. "rocker onion" and "rocuronium" both give rkrnn/rkrnm. */
export function soundKey(text) {
  let s = String(text ?? '').toLowerCase().replace(/[^a-z]/g, '');
  if (!s) return '';
  s = s.replace(/ph/g, 'f').replace(/ck/g, 'k').replace(/qu/g, 'kw').replace(/x/g, 'ks')
    .replace(/c(?=[eiy])/g, 's').replace(/c/g, 'k').replace(/z/g, 's').replace(/y/g, 'i').replace(/dg/g, 'j')
    .replace(/(.)\1+/g, '$1');
  return s[0] + s.slice(1).replace(/[aeiouhw]/g, '');
}

function levenshtein(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const temp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = temp;
    }
  }
  return row[b.length];
}

const ALIAS_INDEX = Object.entries(ORDER_DRUGS).flatMap(([drug, { aliases }]) => aliases.map((alias) => ({ drug, alias, joined: alias.replace(/\s+/g, ''), key: soundKey(alias) })));
// Words that sound like drugs but are everyday speech; they only count next to a dose or a give verb.
const RISKY_ALIASES = new Set(['automatic', 'automated', 'rock', 'rocks', 'sucks', 'neo', 'verse', 'fent', 'epi', 'roc', 'vec', 'panc', 'eto', 'glyco', 'versa', 'propel', 'rocky', 'happy nephron', 'special k']);
const COMMON_WORDS = new Set(['me', 'my', 'you', 'your', 'minute', 'second', 'moment', 'the', 'some', 'and', 'then', 'now', 'to', 'of', 'a', 'an', 'we', 'i', 'im', 'are', 'going', 'give', 'push', 'pushing', 'giving', 'gonna', 'will', 'lets', 'booth', 'hey', 'mg', 'mcg', 'more', 'another', 'little', 'bit', 'is', 'in', 'it', 'him', 'her', 'them', 'patient', 'that', 'this', 'with', 'for', 'on', 'up', 'please', 'go', 'ahead', 'okay', 'ok', 'so', 'he', 'she', 'start', 'be', 'about']);

/* Every drug named in the text, with where it was found. Exact and known
   mishearings first, then sound alike matches of 1 to 3 words. */
export function findDrugs(text, { orderContext = true } = {}) {
  const words = clean(text).split(' ').filter(Boolean);
  const found = [];
  const taken = new Set();
  for (let size = 4; size >= 1; size -= 1) {
    for (let start = 0; start + size <= words.length; start += 1) {
      if ([...Array(size).keys()].some((k) => taken.has(start + k))) continue;
      const phrase = words.slice(start, start + size).join(' ');
      const joined = phrase.replace(/\s+/g, '');
      if (words.slice(start, start + size).some((word) => /\d/.test(word))) continue;
      let hit = ALIAS_INDEX.find((entry) => entry.alias === phrase || entry.joined === joined);
      if (hit && RISKY_ALIASES.has(hit.alias) && !orderContext) hit = null;
      const window = words.slice(start, start + size);
      if (!hit && size <= 3 && joined.length >= 5 && !COMMON_WORDS.has(window[0]) && !COMMON_WORDS.has(window.at(-1))) {
        const key = soundKey(joined);
        let best = null;
        for (const entry of ALIAS_INDEX) {
          if (entry.joined.length < 5 || entry.key.length < 3) continue;
          const distance = levenshtein(key, entry.key);
          const score = 1 - distance / Math.max(key.length, entry.key.length);
          const spelled = 1 - levenshtein(joined, entry.joined) / Math.max(joined.length, entry.joined.length);
          const combined = Math.max(score * 0.75 + spelled * 0.25, spelled);
          if (combined >= 0.72 && (!best || combined > best.combined)) best = { ...entry, combined };
        }
        if (best) hit = best;
      }
      if (hit) {
        for (let k = 0; k < size; k += 1) taken.add(start + k);
        found.push({ drug: hit.drug, start, end: start + size, heard: phrase });
      }
    }
  }
  return found.sort((a, b) => a.start - b.start);
}


/* The dose closest to the drug name: "100 of roc", "roc 50", "fifty mics of
   fentanyl", "0.6 per kilo of roc". Returns { amount, unit } or null. */
export function findDose(words, drugStart, drugEnd) {
  const numberAt = (i) => (i >= 0 && i < words.length && /^\d*\.?\d+$/.test(words[i]) ? Number(words[i]) : null);
  const readUnit = (i) => {
    const w = words[i] ?? '';
    let unit = null;
    if (/^(mcg|mic|mics|micro|micros|microgram|micrograms|ug)$/.test(w)) unit = 'mcg';
    else if (/^(mg|mgs|milligram|milligrams|migs|mig|milli|millis)$/.test(w)) unit = 'mg';
    else if (/^(g|gram|grams)$/.test(w)) unit = 'g';
    else if (/^(ml|cc|cc's|mls)$/.test(w)) unit = 'ml';
    let used = unit ? 1 : 0;
    const perKg = (j) => (words[j] === 'per' && /^(kilo|kg|kilogram|kilograms|k)$/.test(words[j + 1] ?? '')) || /^(mg\/kg|mcg\/kg)$/.test(words[j] ?? '');
    if (/^mg\/kg$/.test(w)) return { unit: 'mg/kg', used: 1 };
    if (/^mcg\/kg$/.test(w)) return { unit: 'mcg/kg', used: 1 };
    if (perKg(i + used)) {
      unit = `${unit ?? 'mg'}/kg`;
      used += words[i + used] === 'per' ? 2 : 1;
    }
    return { unit, used };
  };
  // Number before the drug: "100 of roc", "100 mg of roc", "100 milligrams roc"
  for (let i = drugStart - 1; i >= Math.max(0, drugStart - 5); i -= 1) {
    const amount = numberAt(i);
    if (amount === null) continue;
    const { unit } = readUnit(i + 1);
    return { amount, unit };
  }
  // Number after the drug: "roc 100", "roc at 50 mg", "fentanyl 100 mics"
  for (let i = drugEnd; i < Math.min(words.length, drugEnd + 4); i += 1) {
    const amount = numberAt(i);
    if (amount === null) continue;
    const { unit } = readUnit(i + 1);
    return { amount, unit };
  }
  return null;
}

/* Total mg for a dose, with the drug's usual unit when none was said, or an
   explanation when it does not make sense. */
export function resolveDose(drug, dose, weightKg) {
  const info = ORDER_DRUGS[drug];
  if (!info || !dose) return { ok: false, reason: 'no dose' };
  let unit = dose.unit ?? info.unit;
  if (unit === 'ml') return { ok: false, reason: `Milliliters of ${drug.toLowerCase()} depend on the concentration. Say the dose in mg or mcg.` };
  let totalMg;
  if (unit === 'g') { totalMg = dose.amount * 1000; unit = 'g'; } else if (unit === 'mg') totalMg = dose.amount;
  else if (unit === 'mcg') totalMg = dose.amount / 1000;
  else if (unit === 'mg/kg') totalMg = dose.amount * weightKg;
  else if (unit === 'mcg/kg') totalMg = dose.amount * weightKg / 1000;
  else return { ok: false, reason: 'unknown unit' };
  totalMg = Math.round(totalMg * 1000) / 1000;
  const [low, high] = info.range;
  const shown = unit.endsWith('/kg') ? `${dose.amount} ${unit} (${totalMg >= 1 ? `${totalMg} mg` : `${Math.round(totalMg * 1000)} mcg`})` : `${dose.amount} ${unit}`;
  if (totalMg < low * 0.5 || totalMg > high * 1.5) {
    return { ok: false, implausible: true, totalMg, unit, reason: `${drug} ${shown} is outside the usual range. Say it again if you mean it, with units.` };
  }
  return { ok: true, totalMg, unit, label: `${drug} ${shown}` };
}

const GIVE = /\b(push|pushing|pushed|give|giving|gave|given|bolus|administer|administering|administered|hang|hanging|dose|redose|re dose|more|another|in|draw|injecting|inject)\b/;
const QUESTION = /\?\s*$|^(what|why|how|should|can|could|is|are|do|does|did|would|when|which)\b/;

/* Other orders, in plain words. Each returns an order object or null. */
const ACTION_RULES = [
  [/\b(pre ?ox|preoxygenat|denitrogen|100 ?% (o2|oxygen)|hundred percent|mask on (him|her|the patient)?|put (him|her|them) on (the )?mask)/, () => ({ kind: 'preoxygenate', label: 'Preoxygenate, 100% O2 at 10 L/min' })],
  [/\b(bag|bagging|mask ventilat|mask ppv|ventilate (him|her|them) by mask|assist (his|her) breathing|squeeze the bag|positive pressure by mask)/, () => ({ kind: 'mask_ppv', label: 'Mask ventilation, 30 seconds' })],
  [/\b(extubat|pull(ing)? the tube|tube out|take the tube out)/, () => ({ kind: 'extubate', label: 'Extubate' })],
  [/\b(intubat|laryngoscop|glidescope|video laryngoscope|pass(ing)? the tube|place the tube|placing the tube|going in with the blade|tube him|tube her)/, () => ({ kind: 'intubate', label: 'Intubation attempt' })],
  [/\b(cricoid|sellick)/, (t) => (/\b(release|off|let go|stop)\b/.test(t) ? { kind: 'cricoid_off', label: 'Release cricoid' } : { kind: 'cricoid_on', label: 'Apply cricoid pressure' })],
  [/\b(twitch|train of four|tof|nerve stimulator|peripheral nerve)/, () => ({ kind: 'tof', label: 'Check train of four' })],
  [/\b(put (him|her|them) on the vent|on the ventilator|start (the )?vent|vent on|volume control|mechanical ventilation)/, () => ({ kind: 'vent_on', label: 'Ventilator on, volume control' })],
  [/\b(sevo|sevoflurane|des\b|desflurane|iso\b|isoflurane|the gas|volatile|agent)\b/, (t) => {
    const agent = /\bdes|desflurane/.test(t) ? 'Desflurane' : /\biso\b|isoflurane/.test(t) ? 'Isoflurane' : 'Sevoflurane';
    if (/\b(off|stop|turn off|shut off|kill)\b/.test(t)) return { kind: 'volatile', agent, dial: 0, label: `${agent} off` };
    const pct = t.match(/(\d*\.?\d+)\s*(%|percent)/) ?? t.match(/\b(?:sevo|sevoflurane|des|desflurane|iso|isoflurane)\s+(?:to|at)?\s*(\d*\.?\d+)\b/);
    if (!pct) return null;
    const dial = Number(pct[1]);
    if (!(dial > 0 && dial <= 18)) return null;
    return { kind: 'volatile', agent, dial, label: `${agent} ${dial}%` };
  }],
  [/\b(fluid|fluids|bolus of|lr\b|lactated|ringer|saline|ns\b|albumin|blood|prbc|packed (red )?cells|units? of blood)/, (t) => {
    const type = /\b(blood|prbc|packed|units? of)/.test(t) ? 'PRBC' : /albumin/.test(t) ? 'Albumin5' : /saline|\bns\b/.test(t) ? 'NS' : 'LR';
    if (/\b(stop|off|hold|turn off)\b/.test(t)) return { kind: 'fluid_stop', label: 'Stop fluids' };
    const rate = t.match(/(\d+)\s*(ml|cc)?\s*(an hour|per hour|\/h|hr|ml\/hr|mls an hour)/);
    if (rate) return { kind: 'fluid_rate', type, mlPerHr: Number(rate[1]), label: `${type} at ${rate[1]} mL/h` };
    const units = t.match(/(\d+)\s*units?/);
    if (type === 'PRBC' && units) return { kind: 'fluid_bolus', type, volumeMl: Number(units[1]) * 300, overMin: 15 * Number(units[1]), label: `PRBC ${units[1]} unit${units[1] === '1' ? '' : 's'}` };
    const volume = t.match(/(\d+)\s*(ml|cc|mls)?\b/) ?? (/\b(liter|litre)\b/.test(t) ? ['', '1000'] : null);
    if (!volume && !/\b(open|wide open|bolus|run|hang|start)\b/.test(t)) return null;
    const volumeMl = volume ? Number(volume[1]) : 500;
    if (!(volumeMl >= 50 && volumeMl <= 3000)) return null;
    return { kind: 'fluid_bolus', type, volumeMl, overMin: type === 'PRBC' ? 15 : 10, label: `${type} ${volumeMl} mL bolus` };
  }],
  [/\b(start the (case|sim|clock)|let'?s (go|start|begin)|we'?re (in the room|starting)|start (the )?simulation|time out (is )?done|begin (the )?case)/, () => ({ kind: 'start', label: 'Start the case' })],
];

/* The whole statement to orders. pendingDrug: a drug Booth asked the dose for. */
export function parseStudentOrders(text, { weightKg = 70, pendingDrug = null } = {}) {
  const t = clean(text);
  const words = t.split(' ').filter(Boolean);
  const isQuestion = QUESTION.test(String(text ?? '').trim().toLowerCase());
  const orders = [];
  const problems = [];
  let needsDose = null;
  if (!t) return { orders, problems, needsDose, isQuestion };

  const orderContext = GIVE.test(t) || /\d/.test(t) || Boolean(pendingDrug);
  const drugs = findDrugs(text, { orderContext });

  // Only a number after Booth asked "how much?": it belongs to that drug.
  if (pendingDrug && !drugs.length) {
    const dose = findDose(words, words.length, words.length) ?? findDose(words, 0, 0);
    if (dose) {
      const resolved = resolveDose(pendingDrug, dose, weightKg);
      if (resolved.ok) orders.push({ kind: 'drug', drug: pendingDrug, totalMg: resolved.totalMg, label: resolved.label });
      else problems.push(resolved.reason);
      return { orders, problems, needsDose, isQuestion: false };
    }
  }

  if (!isQuestion) {
    for (const hit of drugs) {
      const dose = findDose(words, hit.start, hit.end);
      if (!dose) {
        if (orderContext || drugs.length === 1) needsDose = hit.drug;
        continue;
      }
      const resolved = resolveDose(hit.drug, dose, weightKg);
      if (resolved.ok) orders.push({ kind: 'drug', drug: hit.drug, totalMg: resolved.totalMg, label: resolved.label, heard: hit.heard });
      else problems.push(resolved.reason);
    }
    // Remove the drug words before matching other orders, so "roc in" is not an intubation.
    const rest = words.filter((_, i) => !drugs.some((hit) => i >= hit.start && i < hit.end)).join(' ');
    for (const [pattern, build] of ACTION_RULES) {
      if (!pattern.test(rest)) continue;
      const order = build(rest);
      if (order && !orders.some((existing) => existing.kind === order.kind)) orders.push(order);
    }
  }
  return { orders, problems, needsDose, isQuestion, drugsHeard: drugs.map((hit) => ({ drug: hit.drug, heard: hit.heard })) };
}

/* A short line Booth says for what he did. */
export function describeOrders(orders) {
  if (!orders.length) return '';
  const parts = orders.map((order) => order.label);
  return `${parts.join(', ')}. Done.`;
}
