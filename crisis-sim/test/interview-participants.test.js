import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  ageWords,
  assessPatient,
  buildParticipants,
  givenName,
  parseAgeYears,
  parseContacts,
} from '../../ui/interviewParticipants.js';
import { buildChartInterviewGrounding, scriptedAnswer } from '../../ui/mockOrDay.js';
import { currentSpeaker, historyForSpeaker, questionPlaceholder, speakerTag } from '../../ui/patientInterview.js';
import { buildSpeakerPrompt } from '../../api/patient-chat.js';
import { readInterview, writeInterview } from '../../ui/studentWorkflow.js';

const chart = (id) => JSON.parse(readFileSync(new URL(`../../data/mock-or-day/patients/${id}.json`, import.meta.url), 'utf8'));
const index = JSON.parse(readFileSync(new URL('../../data/mock-or-day/index.json', import.meta.url), 'utf8'));

function summary(id) {
  const { participants, defaultId } = buildParticipants(chart(id));
  const lead = participants.find((entry) => entry.id === defaultId);
  return { lead, patient: participants.find((entry) => entry.role === 'patient'), participants };
}

describe('parsing the chart', () => {
  it('reads ages, names, and contacts', () => {
    expect(parseAgeYears('4 y')).toBe(4);
    expect(parseAgeYears('18 mo')).toBe(1.5);
    expect(parseAgeYears('5 wk')).toBeCloseTo(0.096, 2);
    expect(ageWords('5 wk')).toBe('5 weeks');
    expect(ageWords('1 y')).toBe('1 year');
    expect(givenName('OKAFOR, MICAH J')).toBe('Micah');
    expect(parseContacts('Velma Lambdin (wife, HCPOA) 865-555-0927; Darrell Lambdin (son) 423-555-0612')).toEqual([
      { name: 'Velma Lambdin', relation: 'wife', tags: ['HCPOA'], phone: '865-555-0927', hcpoa: true },
      { name: 'Darrell Lambdin', relation: 'son', tags: [], phone: '423-555-0612', hcpoa: false },
    ]);
  });

  it('flags capacity only from chart evidence', () => {
    expect(assessPatient(chart('p24')).lacksCapacity).toBe(true); // POA activated for incapacity
    expect(assessPatient(chart('p44')).lacksCapacity).toBe(true); // consent signed by HCPOA, lacks capacity
    expect(assessPatient(chart('p03')).lacksCapacity).toBe(false); // dementia, but "has capacity today"
    expect(assessPatient(chart('p26')).nonverbal).toBe(true);
    expect(assessPatient(chart('p50')).intellectual).toBe('moderate');
  });
});

describe('who the student talks to, across all 50 patients', () => {
  it('starts with a parent for every child under 12', () => {
    for (const id of ['p01', 'p13', 'p26', 'p37', 'p50']) {
      const { lead, patient } = summary(id);
      expect(lead.role, id).not.toBe('patient');
      expect(lead.kind, id).toBe('proxy');
      expect(['mother', 'father'], id).toContain(lead.relation);
      expect(['child', 'nonverbal'], id).toContain(patient.kind);
    }
    expect(summary('p01').lead).toMatchObject({ name: 'Adaeze Okafor', title: 'parent and legal guardian', voice: 'patient-female' });
    expect(summary('p13').patient.kind).toBe('nonverbal');
    expect(summary('p37').patient.kind).toBe('nonverbal');
    expect(summary('p26').patient.kind).toBe('nonverbal');
    expect(summary('p50').patient.kind).toBe('child');
  });

  it('starts with the healthcare POA when the adult lacks capacity', () => {
    expect(summary('p24').lead).toMatchObject({ name: 'Donna Pridemore-Hurst', relation: 'daughter', title: 'healthcare POA', presence: 'phone' });
    expect(summary('p24').patient.kind).toBe('impaired');
    expect(summary('p44').lead).toMatchObject({ name: 'Velma Lambdin', relation: 'wife', title: 'healthcare POA', presence: 'bedside' });
  });

  it('lets a teenager answer for herself with the guardian available', () => {
    const { lead, participants } = summary('p45');
    expect(lead.role).toBe('patient');
    expect(lead.kind).toBe('self');
    expect(participants.find((entry) => entry.id === 'decider')).toMatchObject({ name: 'Tonya Arwood', relation: 'mother' });
    expect(buildParticipants(chart('p45')).banner).toMatch(/Ask sensitive questions privately/);
  });

  it('every other adult answers for themself, with bedside family as optional collateral', () => {
    const special = new Set(['p01', 'p13', 'p24', 'p26', 'p37', 'p44', 'p45', 'p50']);
    for (const { id } of index.patients) {
      if (special.has(id)) continue;
      const { lead, participants } = summary(id);
      expect(lead.kind, id).toBe('self');
      for (const entry of participants.filter((item) => item.role !== 'patient')) expect(entry.kind, id).toBe('family');
    }
    expect(summary('p05').participants.map((entry) => entry.label)).toContain("Darla, Colton's mother");
    expect(summary('p39').participants.map((entry) => entry.label)).toContain("Rhonda, Dewey's sister");
  });
});

describe('scripted answers sound like the person giving them', () => {
  it('a parent speaks about the child, the child defers, the infant cannot answer', () => {
    const p01 = buildChartInterviewGrounding(chart('p01'));
    expect(p01.defaultSpeakerId).toBe('decider');
    const allergies = (sid) => p01.scripted[sid].find((item) => item.id === 'mock_allergies').response;
    expect(allergies('decider')).toBe('He has no allergies that we know of.');
    expect(allergies('patient')).toBe("I don't know. Ask my mother.");
    expect(p01.qa).toBe(p01.scripted.decider);
    const p13 = buildChartInterviewGrounding(chart('p13'));
    expect(p13.scripted.patient[0].response).toBe('(Mason is 5 weeks old and cannot answer questions.)');
    expect(p13.scripted.decider.find((item) => item.id === 'mock_family').response).toMatch(/high fever and stiff jaw/);
  });

  it('an impaired patient defers to the POA; family hedges', () => {
    const p24 = buildChartInterviewGrounding(chart('p24'));
    expect(p24.scripted.patient.find((item) => item.id === 'mock_meds').response).toBe("Oh, I don't remember. Ask my daughter.");
    expect(p24.scripted.decider.find((item) => item.id === 'mock_allergies').response).toBe('She is allergic to Codeine (confusion, hallucinations); Sulfa antibiotics (rash).');
    const facts = { allergies: [], solids: 'x', clears: 'y', meds: [], anesthesia: [], family: [], habits: [], procedure: 'z' };
    expect(scriptedAnswer('mock_allergies', facts, { kind: 'family' }, { he: 'he' })).toBe('As far as I know, he has no allergies that we know of.');
  });

  it('every patient has scripted answers for every person in the room', () => {
    for (const { id } of index.patients) {
      const grounding = buildChartInterviewGrounding(chart(id));
      for (const entry of grounding.participants) {
        expect(grounding.scripted[entry.id], `${id} ${entry.id}`).toHaveLength(7);
        for (const item of grounding.scripted[entry.id]) expect(item.response, `${id} ${entry.id} ${item.id}`).not.toMatch(/undefined|\[object/);
      }
    }
  });
});

describe('interview panel helpers', () => {
  it('tags, placeholders, and labeled history', () => {
    const p24 = buildChartInterviewGrounding(chart('p24'));
    const donna = currentSpeaker(p24, 'decider');
    expect(speakerTag(donna)).toBe('DAUGHTER · HEALTHCARE POA · BY PHONE');
    expect(speakerTag(currentSpeaker(p24, 'patient'))).toBe('PATIENT · LACKS CAPACITY');
    expect(questionPlaceholder(p24, donna)).toBe('When did Miss Opal last eat or drink anything?');
    expect(currentSpeaker({ patientName: 'Sam' }, null)).toMatchObject({ kind: 'self', label: 'Sam' });
    const history = historyForSpeaker([
      { role: 'trainee', content: 'Hi' },
      { role: 'patient', content: 'I feel cold.', speakerId: 'patient', label: 'Miss Opal' },
      { role: 'patient', content: 'She takes carvedilol.', speakerId: 'decider', label: 'Donna' },
    ], 'decider');
    expect(history[1]).toEqual({ role: 'trainee', content: '(Miss Opal said: I feel cold.)' });
    expect(history[2]).toEqual({ role: 'patient', content: 'She takes carvedilol.' });
  });

  it('the transcript is saved per patient', () => {
    const store = new Map();
    const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
    writeInterview(storage, 'p01', [{ role: 'trainee', content: 'Hi' }]);
    expect(readInterview(storage, 'p01')).toEqual([{ role: 'trainee', content: 'Hi' }]);
    expect(readInterview(storage, 'p02')).toEqual([]);
  });
});

describe('the model is told who is speaking', () => {
  const p01 = buildChartInterviewGrounding(chart('p01'));
  const speakerFor = (id) => {
    const entry = currentSpeaker(p01, id);
    return { ...entry, patientName: 'Micah', patientAge: '4 y', patientSex: 'M', decider: 'mother' };
  };

  it('parent, child, infant, impaired, and family prompts', () => {
    const parent = buildSpeakerPrompt(speakerFor('decider'), p01.chart, p01.scripted.decider);
    expect(parent).toMatch(/^You are Adaeze Okafor, Micah's mother and legal guardian\. You make the medical decisions/);
    expect(parent).toMatch(/about Micah \(he\)/);
    const child = buildSpeakerPrompt(speakerFor('patient'), p01.chart, p01.scripted.patient);
    expect(child).toMatch(/You are Micah, a child who is 4 y old/);
    expect(child).toMatch(/Ask my mom/);
    expect(buildSpeakerPrompt({ kind: 'nonverbal', patientName: 'Mason', patientAge: '5 wk' }, {}, [])).toMatch(/ONE short stage direction in parentheses/);
    expect(buildSpeakerPrompt({ kind: 'impaired', patientName: 'Miss Opal', patientAge: '85 y', decider: 'daughter' }, {}, [])).toMatch(/your daughter handles that/);
    expect(buildSpeakerPrompt({ kind: 'family', name: 'Darla Reynolds', relation: 'mother', patientName: 'Colton', patientAge: '36 y', patientSex: 'M' }, {}, []))
      .toMatch(/You are family, not the decision maker; Colton answers for himself/);
    expect(buildSpeakerPrompt({ kind: 'self' }, {}, [])).toBeNull();
    for (const prompt of [parent, child]) expect(prompt).not.toMatch(/ [–—] /);
  });
});
