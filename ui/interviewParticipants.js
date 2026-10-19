/* Who the student actually talks to in the preop interview.

   A 5 week old cannot answer questions, a 7 year old who is minimally verbal
   cannot either, and an 85 year old whose healthcare POA was activated for
   incapacity should not be the one giving her own history or consent. This
   reads the Mock OR chart and decides:

   - who is in the room (or on the phone): the patient, a parent or legal
     guardian, a healthcare POA, family at the bedside;
   - how each of them speaks (kind):
       self       adult with capacity, or a teenager, answering for themself
       child      3 to 11 years old: short answers, knows little medical detail
       nonverbal  infant, toddler, or minimally verbal: cannot answer
       impaired   adult who lacks capacity: present but unreliable
       proxy      parent, guardian, or healthcare POA answering for the patient
       family     relative at the bedside giving collateral history
   - who the interview starts with (defaultId), and a one line banner that
     tells the student why.

   Pure functions over the chart JSON; every decision is traceable to chart
   text (age, consents, directives, problems, nursing note, emergency
   contacts). */

const FEMALE = /\b(mother|mom|daughter|wife|sister|girlfriend|fianc[eé]e|aunt|grandmother|niece|stepmother)\b/i;
const MALE = /\b(father|dad|son|husband|brother|boyfriend|fianc[eé]|uncle|grandfather|nephew|stepfather)\b/i;
const RELATIONS = 'mother|father|parents?|wife|husband|spouse|daughter|son|sister|brother|girlfriend|boyfriend|fianc[eé]e?|aunt|uncle|grandmother|grandfather';

function text(value) {
  if (value === null || value === undefined) return '';
  return typeof value === 'string' ? value : JSON.stringify(value);
}

/* '4 y' -> 4, '18 mo' -> 1.5, '5 wk' -> about 0.1, '3 d' -> about 0.01. */
export function parseAgeYears(age) {
  const match = String(age ?? '').trim().match(/^(\d+(?:\.\d+)?)\s*(y|yr|yrs|years?|mo|mos|months?|wk|wks|weeks?|d|days?)?\b/i);
  if (!match) return null;
  const n = Number(match[1]);
  const unit = (match[2] ?? 'y').toLowerCase();
  if (unit.startsWith('mo')) return n / 12;
  if (unit.startsWith('w')) return n / 52;
  if (unit.startsWith('d')) return n / 365;
  return n;
}

/* "Adaeze Okafor (mother) 865-555-0142; Emeka Okafor (father) 865-555-0177" */
export function parseContacts(emergencyContact) {
  return String(emergencyContact ?? '')
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^(.+?)\s*\(([^)]*)\)\s*([\d-]+)?/);
      if (!match) return { name: part.replace(/[\d-]{7,}.*$/, '').trim(), relation: '', tags: [], phone: '' };
      const pieces = match[2].split(',').map((piece) => piece.trim()).filter(Boolean);
      return {
        name: match[1].trim(),
        relation: (pieces[0] ?? '').toLowerCase(),
        tags: pieces.slice(1),
        phone: match[3] ?? '',
        hcpoa: /hcpoa|healthcare poa|health care poa|poa/i.test(match[2]),
      };
    });
}

function sexForRelation(relation, patientSex) {
  if (FEMALE.test(relation)) return 'female';
  if (MALE.test(relation)) return 'male';
  // A spouse or partner with no gendered word: assume the other sex.
  return /^m/i.test(String(patientSex ?? '')) ? 'female' : 'male';
}

/* A voice cast role (api/tts.js VOICE_CAST): age band plus sex. */
export function voiceRole(sex, ageYears) {
  const who = /^m/i.test(String(sex ?? '')) ? 'male' : 'female';
  const age = Number.isFinite(ageYears) ? ageYears : 40;
  const band = age < 12 ? 'child' : age < 18 ? 'teen' : age < 40 ? 'young' : age < 65 ? 'middle' : 'older';
  return `${band}-${who}`;
}

/* A relative's likely age, from how they are related to the patient. */
export function relativeAge(relation, patientAge) {
  const age = Number.isFinite(patientAge) ? patientAge : 40;
  if (/mother|father|parent|guardian/.test(relation)) return age < 18 ? (age < 12 ? 32 : 42) : age + 28;
  if (/daughter|son/.test(relation)) return Math.max(18, age - 30);
  return age; // spouse, partner, sibling
}

export function voiceForRelation(relation, patientSex, patientAge = 40) {
  return voiceRole(sexForRelation(relation, patientSex), relativeAge(relation, patientAge));
}

function firstName(name) {
  return String(name ?? '').trim().split(/\s+/)[0] ?? '';
}

/* "OKAFOR, MICAH J" -> "Micah" */
export function givenName(chartName) {
  const given = String(chartName ?? '').split(',')[1]?.trim().split(/\s+/)[0] ?? '';
  return given ? given[0].toUpperCase() + given.slice(1).toLowerCase() : '';
}

/* "4 y" -> "4 years", "18 mo" -> "18 months", "5 wk" -> "5 weeks" */
export function ageWords(age) {
  const match = String(age ?? '').trim().match(/^(\d+)\s*(y|mo|wk|d)\b/i);
  if (!match) return String(age ?? '');
  const n = Number(match[1]);
  const unit = { y: 'year', mo: 'month', wk: 'week', d: 'day' }[match[2].toLowerCase()];
  return `${n} ${unit}${n === 1 ? '' : 's'}`;
}

function possessive(name) {
  return /s$/i.test(name) ? `${name}'` : `${name}'s`;
}

/* Capacity and communication, from chart text. */
export function assessPatient(patient = {}) {
  const ageYears = parseAgeYears(patient.age);
  const problems = text(patient.problems);
  const current = [text(patient.consents), text(patient.directives), text(patient.preop)].join(' ');
  const notes = text(patient.notes);
  const all = `${problems} ${current} ${notes}`;
  const nonverbal = /minimally verbal|nonverbal|non-verbal/i.test(all);
  const intellectual = (/intellectual disability,?\s*(moderate|severe|profound)/i.exec(all)?.[1] ?? '').toLowerCase() || null;
  const lacksCapacity = /lacks capacity|lacks decision|determination of incapacity|activated[^.;"]{0,60}incapacity/i.test(current)
    || /signed by [^;"]{0,60}\((?:hcpoa|healthcare poa|health care poa|guardian)\)/i.test(current)
    || (/lacks capacity/i.test(notes) && !/has capacity today/i.test(all));
  let stage = 'adult';
  if (ageYears !== null && ageYears < 3) stage = 'infant';
  else if (ageYears !== null && ageYears < 12) stage = 'child';
  else if (ageYears !== null && ageYears < 18) stage = 'teen';
  return { ageYears, stage, nonverbal, intellectual, lacksCapacity };
}

/* Family named as present in the nursing note or recent notes, e.g.
   "Mother at bedside", "Wife present", "son in hallway". */
export function bedsideRelations(patient = {}) {
  const sources = [text(patient.preop?.nursing_note), ...(patient.notes ?? []).map((row) => text(row?.[4]))].join(' ');
  const found = new Set();
  const pattern = new RegExp(`\\b(${RELATIONS})\\b[^.;"]{0,25}?\\b(at bedside|present|at the bedside|in hallway|in the hallway|with (?:him|her))`, 'gi');
  for (const match of sources.matchAll(pattern)) found.add(match[1].toLowerCase());
  return [...found];
}

function contactFor(contacts, relation) {
  return contacts.find((contact) => contact.relation === relation)
    ?? contacts.find((contact) => contact.relation.startsWith(relation));
}

/* Everyone the student can talk to, and who to start with. */
export function buildParticipants(patient = {}) {
  const assessment = assessPatient(patient);
  const { stage, nonverbal, intellectual, lacksCapacity } = assessment;
  const he = /^(m|male)$/i.test(String(patient.sex ?? '').trim()) ? 'he' : 'she';
  const patientName = patient.preferred_name || givenName(patient.name) || 'the patient';
  const ageText = ageWords(patient.age);
  const contacts = parseContacts(patient.emergency_contact);
  const consentsText = `${text(patient.consents)} ${text(patient.directives)} ${text(patient.history?.social)} ${text(patient.preop)}`;
  const bedside = bedsideRelations(patient);
  const minor = stage !== 'adult';
  const participants = [];

  // The patient.
  let patientKind = 'self';
  let patientNote = '';
  if (stage === 'infant') {
    patientKind = 'nonverbal';
    patientNote = `${patientName} is ${ageText} old and cannot answer questions.`;
  } else if (nonverbal) {
    patientKind = 'nonverbal';
    patientNote = `${patientName} is minimally verbal and will not be able to answer.`;
  } else if (stage === 'child') {
    patientKind = 'child';
    patientNote = `${patientName} is ${ageText} old${intellectual ? ` with ${intellectual} intellectual disability` : ''}. Expect short answers and little medical detail.`;
  } else if (lacksCapacity) {
    patientKind = 'impaired';
    patientNote = `${patientName} lacks capacity for medical decisions. What ${he} tells you may be unreliable.`;
  }
  participants.push({
    id: 'patient',
    role: 'patient',
    kind: patientKind,
    name: patientName,
    label: patientName,
    relation: 'patient',
    voice: voiceRole(patient.sex, assessment.ageYears),
    childVoice: stage === 'child' || stage === 'infant',
    presence: 'bedside',
    note: patientNote,
  });

  // The decision maker.
  let decider = null;
  let deciderRole = null;
  if (minor) {
    const guardianWord = /(mother|father)[^.;"]{0,20}legal guardian|legal guardian[^.;"]{0,20}(mother|father)|signed by (mother|father)/i.exec(consentsText);
    const relation = (guardianWord?.[1] ?? guardianWord?.[2] ?? guardianWord?.[3] ?? 'mother').toLowerCase();
    decider = contactFor(contacts, relation) ?? contacts.find((contact) => /mother|father|parent|guardian/.test(contact.relation)) ?? null;
    deciderRole = 'guardian';
  } else if (lacksCapacity) {
    decider = contacts.find((contact) => contact.hcpoa) ?? null;
    if (!decider) {
      const named = /(?:HCPOA|healthcare POA|health care POA)[^;"]{0,40}?(wife|husband|daughter|son|sister|brother|mother|father)/i.exec(consentsText)
        ?? /(wife|husband|daughter|son|sister|brother|mother|father)[^;"]{0,40}?(?:HCPOA|healthcare POA)/i.exec(consentsText);
      if (named) decider = contactFor(contacts, named[1].toLowerCase()) ?? null;
    }
    deciderRole = 'hcpoa';
  }
  if (decider) {
    const relationWord = decider.relation || (deciderRole === 'guardian' ? 'parent' : 'family');
    const notReached = new RegExp(`${relationWord}[^.;"]{0,20}(not reached|en route|by phone)`, 'i').test(text(patient.preop?.nursing_note));
    const titled = deciderRole === 'hcpoa'
      ? 'healthcare POA'
      : (/legal guardian/i.test(consentsText) ? 'parent and legal guardian' : 'parent');
    participants.push({
      id: 'decider',
      role: deciderRole,
      kind: 'proxy',
      name: decider.name,
      label: `${firstName(decider.name)}, ${possessive(patientName)} ${relationWord}`,
      relation: relationWord,
      title: titled,
      voice: voiceForRelation(relationWord, patient.sex, assessment.ageYears),
      presence: notReached ? 'phone' : 'bedside',
      note: `${decider.name} is ${possessive(patientName)} ${relationWord} and ${titled}${notReached ? '. Nursing has not reached them yet; you reach them by phone' : ''}.`,
    });
  }

  // Other family: the second parent of a child, and anyone the chart puts at the bedside.
  const used = new Set(participants.map((entry) => entry.name));
  const extra = [];
  if (minor) extra.push(...contacts.filter((contact) => /mother|father|parent/.test(contact.relation)));
  for (const relation of bedside) {
    const contact = relation === 'parent' || relation === 'parents'
      ? null
      : (contactFor(contacts, relation) ?? (relation === 'wife' || relation === 'husband' ? contactFor(contacts, 'spouse') : null));
    if (contact) extra.push(contact);
    else if (!/parent/.test(relation)) extra.push({ name: '', relation, tags: [], phone: '' });
  }
  for (const contact of extra) {
    const key = contact.name || contact.relation;
    if (used.has(key)) continue;
    used.add(key);
    const relationWord = contact.relation || 'family';
    participants.push({
      id: `family-${participants.length}`,
      role: minor && /mother|father|parent/.test(relationWord) ? 'parent' : 'family',
      kind: minor && /mother|father|parent/.test(relationWord) ? 'proxy' : 'family',
      name: contact.name || `${possessive(patientName)} ${relationWord}`,
      label: contact.name ? `${firstName(contact.name)}, ${possessive(patientName)} ${relationWord}` : `${possessive(patientName)} ${relationWord}`,
      relation: relationWord,
      title: minor && /mother|father|parent/.test(relationWord) ? 'parent' : '',
      voice: voiceForRelation(relationWord, patient.sex, assessment.ageYears),
      presence: 'bedside',
      note: '',
    });
  }

  // Who the interview starts with.
  const deciderEntry = participants.find((entry) => entry.id === 'decider');
  const anyParent = participants.find((entry) => entry.role === 'parent');
  let defaultId = 'patient';
  let banner = '';
  if (stage === 'infant' || stage === 'child' || nonverbal) {
    const lead = deciderEntry ?? anyParent;
    if (lead) {
      defaultId = lead.id;
      banner = `${patientName} is ${ageText} old${nonverbal && stage !== 'infant' ? ' and minimally verbal' : ''}${intellectual ? ` with ${intellectual} intellectual disability` : ''}. You are interviewing ${possessive(patientName)} ${lead.relation}, ${lead.name}${lead.title ? ` (${lead.title})` : ''}.${stage === 'infant' ? '' : (nonverbal ? ` ${patientName} will not answer questions; watch how ${he} responds.` : ` Speak to ${patientName} too, at ${he === 'he' ? 'his' : 'her'} level.`)}`;
    }
  } else if (stage === 'teen') {
    const lead = deciderEntry ?? anyParent;
    banner = `${patientName} is ${ageText} old. Interview ${patientName} directly; ${lead ? `${possessive(patientName)} ${lead.relation} ${lead.name} is the legal guardian and gives consent` : 'a parent or guardian gives consent'}. Ask sensitive questions privately.`;
  } else if (lacksCapacity && deciderEntry) {
    defaultId = deciderEntry.id;
    banner = `${patientName} lacks capacity for medical decisions. You are speaking with ${deciderEntry.name}, ${possessive(patientName)} ${deciderEntry.relation} and healthcare POA${deciderEntry.presence === 'phone' ? ', by phone' : ''}. ${patientName} is present and can still tell you how ${he} feels.`;
  }
  return { patientName, assessment, participants, defaultId, banner };
}
