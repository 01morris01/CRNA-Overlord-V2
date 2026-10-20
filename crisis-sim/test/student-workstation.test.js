import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  replyGivesAwayIssue,
  STUDENT_SUGGESTIONS,
  analyzeStudentAction,
  buildOperatorNote,
  buildStudentReply,
  classifyStudentStatement,
  parseStudentModelReply,
  studentFacts,
} from '../../ui/boothStudent.js';
import { sanitizeStudentMessage, createStudentChannel, STUDENT_PROTOCOL } from '../../ui/studentChannel.js';
import { STEPS, furthestStep, stepGate, REVIEW_ITEMS } from '../../ui/studentWorkflow.js';
import { extractBoothCommand } from '../../ui/boothDock.js';
import { createSimOperatorController } from '../../ui/simOperatorView.js';
import { patientVoiceFor, pickSynthesisVoice } from '../../ui/patientInterview.js';
import { resolveVoice, OPERATOR_DEFAULT_VOICE_ID } from '../../api/tts.js';
import { buildSystemPrompt } from '../../api/sim-operator.js';
import { SimRunner } from '../ui/simRunner.js';

const root = resolve(import.meta.dirname, '../..');
const DASH = /[‒–—―]|\s-\s/;
const awakeFacts = studentFacts({ snapshot: { effectiveNmbBlockade: 0, propofolCe: 0, mac: 0, airwayDevice: 'mask' }, history: { drugsGiven: new Set(), preoxygenated: true } });
const inducedNoRoc = studentFacts({ snapshot: { effectiveNmbBlockade: 0, propofolCe: 3.5, mac: 0, airwayDevice: 'mask' }, history: { drugsGiven: new Set(['Propofol', 'Fentanyl']), preoxygenated: true } });
const ready = studentFacts({ snapshot: { effectiveNmbBlockade: 0.95, propofolCe: 3.5, airwayDevice: 'mask' }, history: { drugsGiven: new Set(['Propofol', 'Rocuronium']), preoxygenated: true } });

describe('what the student said', () => {
  it('tells a plan from a report and picks the action', () => {
    expect(classifyStudentStatement('I am going to intubate my patient now')).toMatchObject({ intent: 'intubate', tense: 'plan' });
    expect(classifyStudentStatement('I have tubed them')).toMatchObject({ intent: 'intubate', tense: 'done' });
    expect(classifyStudentStatement('the tube is in')).toMatchObject({ intent: 'intubate', tense: 'done' });
    expect(classifyStudentStatement("I'm about to extubate")).toMatchObject({ intent: 'extubate', tense: 'plan' });
    expect(classifyStudentStatement('why is my pressure dropping?')).toMatchObject({ tense: 'question' });
    expect(classifyStudentStatement('pushing propofol now')).toMatchObject({ intent: 'induce' });
  });

  it('accepts only messages that address Booth when hands free', () => {
    expect(extractBoothCommand("Booth, I'm going to intubate now")).toBe("I'm going to intubate now");
    expect(extractBoothCommand('hey booth the tube is in')).toBe('the tube is in');
    expect(extractBoothCommand('can I get suction')).toBeNull();
    expect(extractBoothCommand('Booth')).toBe('');
  });
});

describe('what the student may have missed', () => {
  it('flags intubation without a paralytic, and without a hypnotic', () => {
    const noRoc = analyzeStudentAction({ intent: 'intubate' }, inducedNoRoc);
    expect(noRoc.issues.map((i) => i.id)).toEqual(['no_paralytic']);
    expect(noRoc.suggestions).toEqual(expect.arrayContaining(['fail_intubation', 'inject_laryngospasm']));
    const awake = analyzeStudentAction({ intent: 'intubate' }, awakeFacts);
    expect(awake.issues[0].id).toBe('not_asleep');
    expect(analyzeStudentAction({ intent: 'intubate' }, ready).issues).toEqual([]);
  });

  it('respects charts where avoiding paralysis is the plan', () => {
    const mg = studentFacts({ snapshot: { effectiveNmbBlockade: 0, propofolCe: 4 }, history: { drugsGiven: new Set(['Propofol']), preoxygenated: true }, answerKey: { planItems: [{ item: 'GETA with TIVA, minimal or no NMB' }] } });
    const result = analyzeStudentAction({ intent: 'intubate' }, mg);
    expect(result.issues.map((i) => i.id)).toEqual(['no_paralytic_planned']);
    expect(result.suggestions).toEqual([]);
  });

  it('tells the instructor when a reported action never happened in the engine', () => {
    const issues = analyzeStudentAction({ intent: 'intubate', tense: 'done' }, ready).issues;
    expect(issues.map((i) => i.id)).toEqual(['claimed_not_done']);
    const tubed = studentFacts({ snapshot: { effectiveNmbBlockade: 0.95, propofolCe: 3.5, airwayDevice: 'intubated' }, history: { drugsGiven: new Set(['Propofol', 'Rocuronium']), preoxygenated: true } });
    expect(analyzeStudentAction({ intent: 'intubate', tense: 'done' }, tubed).issues).toEqual([]);
  });

  it('flags extubation on residual block', () => {
    const f = studentFacts({ snapshot: { tofRatio: 0.6, spont: true, mac: 0.1 }, history: {} });
    expect(analyzeStudentAction({ intent: 'extubate' }, f).issues[0].id).toBe('residual_block');
  });
});

describe('Booth answers the student', () => {
  it('never names the problem before the student acts', () => {
    const plan = classifyStudentStatement('I am going to intubate now');
    const analysis = analyzeStudentAction(plan, inducedNoRoc);
    for (let i = 0; i < 30; i += 1) {
      const reply = buildStudentReply(plan, analysis, { meanness: (i % 3) + 1, random: () => (i % 10) / 10 });
      expect(reply).not.toMatch(/paraly|\broc(uronium)?\b|relax|blocker|\bsux\b|succinyl/i);
      expect(reply).not.toMatch(DASH);
    }
  });

  it('names it, about the decision, once it is done', () => {
    const done = classifyStudentStatement('I have tubed them');
    const reply = buildStudentReply(done, analyzeStudentAction(done, inducedNoRoc), { meanness: 3, random: () => 0 });
    expect(reply).toMatch(/paralytic/);
    expect(reply).not.toMatch(/idiot|stupid|dumb/i);
  });

  it('writes the instructor a plain note with what was missed and what it causes', () => {
    const plan = classifyStudentStatement('I am going to intubate now');
    const note = buildOperatorNote('I am going to intubate now', plan, analyzeStudentAction(plan, inducedNoRoc));
    expect(note).toMatch(/No neuromuscular blocker/);
    expect(note).toMatch(/Would cause/);
    expect(note).toMatch(/did not tell them/);
  });

  it('throws out a model reply that hints at the problem before the act', async () => {
    const leak = { id: 'no_paralytic' };
    expect(replyGivesAwayIssue("Bold move without a paralytic. Let's see how that goes.", [leak])).toBe(true);
    expect(replyGivesAwayIssue("Bold. Let's see how that goes.", [leak])).toBe(false);
    const runner = new SimRunner();
    runner.giveBolus('Propofol', 150, 'Propofol');
    runner.pause();
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ({ reply: '```json\n{"reply":"Bold move without a paralytic.","operatorNote":"No roc.","suggestions":["fail_intubation"]}\n```' }),
    }));
    const controller = createSimOperatorController({ runner, root: null, fetchImpl, storage: null, random: () => 0 });
    controller.observeEvent({ t: 0, kind: 'Drug', detail: 'Propofol', meta: { action: 'drug', drug: 'Propofol', doseMg: 150 } });
    const plan = await controller.respondToStudent('I am going to intubate now');
    expect(plan.reply).not.toMatch(/paraly/i);
    // Booth carried out the order and says so to the instructor, then the model's note.
    expect(plan.note).toBe('Booth did: Intubation attempt 1 started. No roc.');
    // After the act the same reply is allowed.
    const done = await controller.respondToStudent('I have tubed them');
    expect(done.reply).toBe('Bold move without a paralytic.');
  });

  it('keeps only whitelisted actions from the model', () => {
    const parsed = parseStudentModelReply('{"reply":"Bold.","operatorNote":"No roc.","suggestions":["fail_intubation","delete_patient"]}');
    expect(parsed).toEqual({ reply: 'Bold.', operatorNote: 'No roc.', suggestions: ['fail_intubation'] });
    expect(parseStudentModelReply('not json')).toBeNull();
  });

  it('runs end to end in the console controller, with buttons that act on the engine', async () => {
    const runner = new SimRunner();
    runner.giveBolus('Propofol', 150, 'Propofol');
    runner.pause();
    const controller = createSimOperatorController({ runner, root: null, fetchImpl: null, storage: null, random: () => 0 });
    controller.observeEvent({ t: 0, kind: 'Drug', detail: 'Propofol', meta: { action: 'drug', drug: 'Propofol', doseMg: 150 } });
    const plan = await controller.respondToStudent('I am going to intubate now');
    expect(plan.analysis.issues.map((i) => i.id)).toContain('no_paralytic');
    expect(plan.reply).not.toMatch(/paraly/i);
    expect(plan.suggestions).toContain('fail_intubation');
    // Booth already started the attempt on the student's word, so the fail hits it.
    expect(runner.snapshot().intubationInProgress).toBe(true);
    const result = controller.applySuggestion('fail_intubation');
    expect(result).toMatchObject({ ok: true, target: 'current', attemptNumber: 1 });
    expect(runner.log.some((entry) => /set to fail/.test(entry.detail))).toBe(true);
    expect(controller.applySuggestion('inject_laryngospasm')).toMatchObject({ ok: true });
    expect(controller.applySuggestion('nonsense').ok).toBe(false);
  });
});

describe('Booth carries out what the student orders', () => {
  function controllerFor(runner, extra = {}) {
    return createSimOperatorController({ runner, root: null, fetchImpl: null, storage: null, random: () => 0, ...extra });
  }

  it('gives a drug said through speech errors and asks for a missing dose', async () => {
    const runner = new SimRunner();
    const controller = controllerFor(runner);
    const ask = await controller.respondToStudent("hey Booth we're going to give some automatic");
    expect(ask.reply).toMatch(/Etomidate/);
    expect(ask.reply).toMatch(/how much|dose/i);
    expect(runner.log.some((entry) => entry.meta?.drug === 'Etomidate')).toBe(false);
    const dose = await controller.respondToStudent('20');
    expect(dose.executed.map((entry) => entry.label)).toEqual(['Etomidate 20 mg']);
    expect(runner.log.at(-1).meta).toMatchObject({ action: 'drug', drug: 'Etomidate', doseMg: 20 });
    expect(runner.getLifecycleState()).toBe('RUNNING');
    runner.pause();
    const roc = await controller.respondToStudent('push 100 of rocker onion');
    expect(roc.executed.map((entry) => entry.label)).toEqual(['Rocuronium 100 mg']);
    expect(roc.reply).toMatch(/^Rocuronium 100 mg/);
  });

  it('knows the student is in the OR even before the clock starts', async () => {
    const runner = new SimRunner();
    let context = null;
    const fetchImpl = vi.fn(async (url, init) => { context = JSON.parse(init.body).context; return { ok: false }; });
    const controller = controllerFor(runner, { fetchImpl, getStage: () => ({ studentStep: 'or', studentStepLabel: 'Into the OR' }) });
    await controller.respondToStudent('what do you think about the plan');
    expect(context.where).toMatch(/In the operating room/);
    expect(context.where).toMatch(/not preop/);
  });

  it('leaves orders to the instructor when set to', async () => {
    const runner = new SimRunner();
    const storage = new Map();
    const store = { getItem: (k) => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v) };
    store.setItem('overlord.booth.settings.v2', JSON.stringify({ studentOrders: 'instructor' }));
    const controller = controllerFor(runner, { storage: store });
    expect(controller.getStudentOrdersMode()).toBe('instructor');
    const result = await controller.respondToStudent('push 50 of propofol');
    expect(result.executed).toEqual([]);
    expect(runner.log.some((entry) => entry.meta?.action === 'drug')).toBe(false);
    expect(result.note).toMatch(/Waiting for you: Propofol 50 mg/);
    expect(controller.executeOrder(result.parsed.orders[0])).toMatchObject({ ok: true, label: 'Propofol 50 mg' });
  });
});

describe('instructor can fail an intubation attempt', () => {
  it('fails the next attempt without touching anything else', () => {
    const runner = new SimRunner();
    expect(runner.failIntubationAttempt()).toMatchObject({ ok: true, target: 'next', attemptNumber: 1 });
    expect(runner.intubate().ok).toBe(true);
    runner.pause();
    runner.stepFor(35);
    expect(runner.snapshot().airwayDevice).toBe('mask');
    expect(runner.a.intubationAttempts[0].outcome).toBe('failed');
    // Second attempt is untouched and succeeds.
    expect(runner.intubate().ok).toBe(true);
    runner.stepFor(35);
    expect(runner.snapshot().airwayDevice).toBe('intubated');
  });

  it('can fail the attempt already in progress', () => {
    const runner = new SimRunner();
    runner.intubate();
    runner.pause();
    runner.stepFor(5);
    expect(runner.failIntubationAttempt()).toMatchObject({ ok: true, target: 'current', attemptNumber: 1 });
    runner.stepFor(30);
    expect(runner.a.intubationAttempts[0].outcome).toBe('failed');
  });
});

describe('student screen link', () => {
  it('drops malformed or oversized messages', () => {
    expect(sanitizeStudentMessage({ protocol: STUDENT_PROTOCOL, type: 'student-load', patientId: 'p05' })).toEqual({ type: 'student-load', patientId: 'p05' });
    expect(sanitizeStudentMessage({ protocol: STUDENT_PROTOCOL, type: 'student-load', patientId: '../x' })).toBeNull();
    expect(sanitizeStudentMessage({ protocol: 2, type: 'student-hello' })).toBeNull();
    expect(sanitizeStudentMessage({ protocol: STUDENT_PROTOCOL, type: 'evil' })).toBeNull();
    const long = sanitizeStudentMessage({ protocol: STUDENT_PROTOCOL, type: 'student-booth', id: 'a', text: 'x'.repeat(5000) });
    expect(long.text.length).toBe(500);
  });

  it('delivers student messages to the console and Booth replies back', () => {
    const bus = new Set();
    class FakeChannel {
      constructor() { this.listeners = new Set(); bus.add(this); }
      postMessage(data) { for (const other of bus) if (other !== this) for (const l of other.listeners) l({ data }); }
      addEventListener(_, l) { this.listeners.add(l); }
      removeEventListener(_, l) { this.listeners.delete(l); }
      close() { bus.delete(this); }
    }
    const student = createStudentChannel({ role: 'student', BroadcastChannelImpl: FakeChannel });
    const consoleSide = createStudentChannel({ role: 'console', BroadcastChannelImpl: FakeChannel });
    const atConsole = [];
    const atStudent = [];
    consoleSide.subscribe((m) => atConsole.push(m));
    student.subscribe((m) => atStudent.push(m));
    student.post({ type: 'student-booth', id: 'm1', text: 'I am going to intubate now' });
    consoleSide.post({ type: 'booth-reply', replyTo: 'm1', text: 'Bold.' });
    student.post({ type: 'booth-reply', replyTo: 'x', text: 'student cannot speak for Booth' });
    expect(atConsole).toEqual([{ type: 'student-booth', id: 'm1', text: 'I am going to intubate now' }]);
    expect(atStudent).toEqual([{ type: 'booth-reply', replyTo: 'm1', text: 'Bold.' }]);
  });
});

describe('workstation steps go in order', () => {
  it('unlocks each step only when the one before is done', () => {
    expect(STEPS).toEqual(['patient', 'chart', 'interview', 'plan', 'grade', 'or']);
    expect(furthestStep({})).toBe(0);
    expect(furthestStep({ patientId: 'p05' })).toBe(1);
    const reviewed = Object.fromEntries(REVIEW_ITEMS.map((item) => [item, true]));
    expect(furthestStep({ patientId: 'p05', reviewed })).toBe(2);
    expect(stepGate('interview', { questions: 2 }).allowed).toBe(false);
    expect(furthestStep({ patientId: 'p05', reviewed, questions: 3 })).toBe(3);
    expect(furthestStep({ patientId: 'p05', reviewed, questions: 3, planSubmitted: true })).toBe(5);
    expect(furthestStep({ patientId: 'p05', reviewed: { allergies: true }, questions: 9, planSubmitted: true })).toBe(1);
  });

  it('puts every preop step on one page in the right order', () => {
    const html = readFileSync(resolve(root, 'student.html'), 'utf8');
    const order = STEPS.map((step) => html.indexOf(`data-step="${step}"`));
    expect(order.every((at) => at > 0)).toBe(true);
    expect([...order].sort((x, y) => x - y)).toEqual(order);
    for (const id of ['student-chart-frame', 'patient-interview-input', 'student-plan-host', 'student-grade-host', 'student-open-monitor', 'student-side']) {
      expect(html).toContain(`id="${id}"`);
    }
  });
});

describe('Booth has his own voice', () => {
  it('never falls back to the patient voice', () => {
    expect(resolveVoice('operator', {})).toBe(OPERATOR_DEFAULT_VOICE_ID);
    expect(resolveVoice('operator', { ELEVENLABS_VOICE_ID: 'patientVoice' })).toBe(OPERATOR_DEFAULT_VOICE_ID);
    expect(resolveVoice('operator', {})).not.toBe(resolveVoice('patient-female', {}));
    expect(resolveVoice('operator', {})).not.toBe(resolveVoice('patient-male', {}));
    expect(resolveVoice('operator', { ELEVENLABS_OPERATOR_VOICE_ID: 'custom' })).toBe('custom');
  });

  it('gives patients a voice that matches the chart', () => {
    expect(patientVoiceFor('M')).toBe('patient-male');
    expect(patientVoiceFor('Female')).toBe('patient-female');
    const voices = [{ name: 'Google UK English Male', lang: 'en-GB' }, { name: 'Samantha', lang: 'en-US' }];
    expect(pickSynthesisVoice(voices, 'patient-male').name).toMatch(/Male/);
    expect(pickSynthesisVoice(voices, 'patient-female').name).toBe('Samantha');
  });
});

describe('Booth student prompt', () => {
  it('forbids hints before the act and insults at any time', () => {
    const prompt = buildSystemPrompt({ mode: 'student', meanness: 3, context: { student: { statement: 'x' } } });
    expect(prompt).toMatch(/NEVER name, hint at/);
    expect(prompt).toMatch(/no "idiot"/);
    expect(prompt).toMatch(/operatorNote/);
    expect(prompt).not.toMatch(/[–—]/);
    for (const id of Object.keys(STUDENT_SUGGESTIONS)) expect(id).toMatch(/^[a-z_]+$/);
  });
});

describe('care plan grading reads what the student meant', () => {
  const base = resolve(root, 'data/mock-or-day');
  const read = (path) => JSON.parse(readFileSync(resolve(base, path), 'utf8'));

  it('credits misspelled findings like clopidadrel, without crossing hyper and hypo', async () => {
    const { gradeCarePlan, keywordHit, planText } = await import('../../ui/carePlanSheet.js');
    const values = { asa: '4', decision: 'proceed_mod', decisionRationale: 'The surgeon or primary team d/t heperan infusion and ACT. Lisinopril taken and Clopidadrel not held long enough' };
    const grade = gradeCarePlan(values, read('answer-keys/p11.json'), read('patients/p11.json'));
    const status = Object.fromEntries(grade.redFlags.map((flag) => [flag.id, flag.status]));
    expect(status.clopidogrel).toBe('found');
    expect(status.acei).toBe('found');
    expect(keywordHit(planText({ x: 'hypertension' }), 'hypotension')).toBe(false);
    expect(keywordHit(planText({ x: 'sugamadex' }), 'sugammadex')).toBe(true);
  });

  it("lets Booth's review mark findings partial so the score matches what he says", async () => {
    const { gradeCarePlan, applyReviewJudgments, parsePlanReview } = await import('../../ui/carePlanSheet.js');
    // No heparin, platelet or HIT words, so the text alone leaves HIT missed.
    const grade = gradeCarePlan({ asa: '4', decision: 'proceed_mod', decisionRationale: 'call the surgeon about the drip and the ACT, clopidogrel not held long enough' }, read('answer-keys/p11.json'), read('patients/p11.json'));
    expect(grade.redFlags.find((flag) => flag.id === 'hit').status).toBe('missed');
    const review = parsePlanReview('```json\n{"review":"You flagged the heparin infusion but not possible HIT.","flags":{"hit":"partial","clopidogrel":"found","bogus":"found"},"decisionPoints":1}\n```');
    const judged = applyReviewJudgments(grade, review);
    const hit = judged.redFlags.find((flag) => flag.id === 'hit');
    expect(hit.status).toBe('partial');
    expect(judged.missedCritical).not.toContain(hit.finding);
    expect(judged.earned).toBeGreaterThan(grade.earned);
    expect(judged.source).toBe('review');
    expect(parsePlanReview('plain text review').review).toBe('plain text review');
  });

  it('asks the reviewer for per finding judgments and gives it room to finish', () => {
    const prompt = buildSystemPrompt({ mode: 'plan', meanness: 2, context: {} });
    expect(prompt).toMatch(/found\|partial\|missed/);
    expect(prompt).toMatch(/clopidadrel/);
    expect(prompt).toMatch(/never call something missed that they mentioned/);
    const api = readFileSync(resolve(root, 'api/sim-operator.js'), 'utf8');
    expect(api).toMatch(/plan: 1200/);
  });
});

describe('instructor moves the student', () => {
  it('fills in every earlier step as done correctly', async () => {
    const { advanceSession, scriptedInterview } = await import('../../ui/studentWorkflow.js');
    const toInterview = advanceSession({}, 'p11', 'interview');
    expect(Object.values(toInterview.reviewed).every(Boolean)).toBe(true);
    expect(toInterview.questions).toBe(0);
    const toPlan = advanceSession({}, 'p11', 'plan');
    expect(toPlan.questions).toBeGreaterThanOrEqual(3);
    expect(toPlan.autoInterview).toBe(true);
    const kept = advanceSession({ patientId: 'p11', questions: 7, reviewed: { allergies: true } }, 'p11', 'plan');
    expect(kept.questions).toBe(7);
    expect(furthestStep({ ...toPlan, planSubmitted: false })).toBe(3);
    const qa = scriptedInterview({ qa: [{ prompt: 'When did you last eat', response: '0730' }] });
    expect(qa).toEqual([{ question: 'When did you last eat?', answer: '0730' }]);
  });

  it('files an answer key plan that passes every gate for all 50 charts', async () => {
    const { buildInstructorPlanRecord } = await import('../../ui/carePlanSheet.js');
    const index = JSON.parse(readFileSync(resolve(root, 'data/mock-or-day/index.json'), 'utf8'));
    for (const entry of index.patients) {
      const patient = JSON.parse(readFileSync(resolve(root, `data/mock-or-day/patients/${entry.id}.json`), 'utf8'));
      const key = JSON.parse(readFileSync(resolve(root, `data/mock-or-day/answer-keys/${entry.id}.json`), 'utf8'));
      const record = buildInstructorPlanRecord(patient, key);
      expect(record.grade.completeness, entry.id).toEqual([]);
      expect(record.grade.percent, entry.id).toBe(100);
      expect(record.filledBy).toBe('instructor');
      expect(record.values.asa).toBe(String(key.asa.suggested));
    }
  });

  it('carries progress and advance messages on the student link', () => {
    expect(sanitizeStudentMessage({ protocol: STUDENT_PROTOCOL, type: 'student-state', patientId: 'p11', step: 'plan', questions: 4, planSubmitted: true, percent: 83.4 }))
      .toEqual({ type: 'student-state', patientId: 'p11', step: 'plan', questions: 4, planSubmitted: true, percent: 83 });
    expect(sanitizeStudentMessage({ protocol: STUDENT_PROTOCOL, type: 'instructor-advance', patientId: 'p11', step: 'grade' }))
      .toEqual({ type: 'instructor-advance', patientId: 'p11', step: 'grade' });
    expect(sanitizeStudentMessage({ protocol: STUDENT_PROTOCOL, type: 'instructor-advance', patientId: 'p11', step: 'hack' })).toBeNull();
  });

  it('offers STUDENT SIM and INSTRUCTOR SIM when LIVE SIM is pressed', () => {
    const view = readFileSync(resolve(root, 'ui/liveSimView.js'), 'utf8');
    expect(view).toMatch(/data-launch="student"/);
    expect(view).toMatch(/data-launch="instructor"/);
    expect(view).toMatch(/data-launch="both"/);
    expect(view).toMatch(/openLaunchChooser\(\)/);
  });
});

describe('partial credit floor', () => {
  it('gives W. Tate partial credit for the heparin infusion and the pacer, and keeps look alike drugs apart', async () => {
    const { gradeCarePlan, keywordHit, planText } = await import('../../ui/carePlanSheet.js');
    const read = (path) => JSON.parse(readFileSync(resolve(root, 'data/mock-or-day', path), 'utf8'));
    const values = { asa: '4', decision: 'proceed_mod', prob3_problem: 'Pacer', decisionRationale: 'The surgeon or primary team d/t heperan infusion and ACT. Lisinopril taken and Clopidadrel not held long enough' };
    const grade = gradeCarePlan(values, read('answer-keys/p11.json'), read('patients/p11.json'));
    const status = Object.fromEntries(grade.redFlags.map((flag) => [flag.id, flag.status]));
    expect(status).toMatchObject({ hit: 'partial', pacemaker: 'partial', clopidogrel: 'found', acei: 'found' });
    expect(grade.missedCritical).toEqual([]);
    for (const [word, target] of [['propofol', 'propranolol'], ['ketorolac', 'ketamine'], ['epinephrine', 'ephedrine'], ['nicardipine', 'nifedipine'], ['dopamine', 'dobutamine'], ['hydromorphone', 'hydralazine']]) {
      expect(keywordHit(planText({ x: word }), target), `${word} vs ${target}`).toBe(false);
    }
  });

  it('never lets the reviewer rate a finding below what the plan text shows', async () => {
    const { gradeCarePlan, applyReviewJudgments } = await import('../../ui/carePlanSheet.js');
    const read = (path) => JSON.parse(readFileSync(resolve(root, 'data/mock-or-day', path), 'utf8'));
    const grade = gradeCarePlan({ decisionRationale: 'heparin infusion, clopidogrel too recent' }, read('answer-keys/p11.json'), read('patients/p11.json'));
    const judged = applyReviewJudgments(grade, { flags: { hit: 'missed', clopidogrel: 'missed', pacemaker: 'found' } });
    const status = Object.fromEntries(judged.redFlags.map((flag) => [flag.id, flag.status]));
    expect(status).toMatchObject({ hit: 'partial', clopidogrel: 'found', pacemaker: 'found' });
  });
});

describe('chart copied fields earn nothing', () => {
  it('scores an untouched sheet (autofill plus copied labs) at zero for every chart', async () => {
    const { gradeCarePlan, autofillFromChart, labsFromChart } = await import('../../ui/carePlanSheet.js');
    const index = JSON.parse(readFileSync(resolve(root, 'data/mock-or-day/index.json'), 'utf8'));
    for (const entry of index.patients) {
      const patient = JSON.parse(readFileSync(resolve(root, `data/mock-or-day/patients/${entry.id}.json`), 'utf8'));
      const key = JSON.parse(readFileSync(resolve(root, `data/mock-or-day/answer-keys/${entry.id}.json`), 'utf8'));
      const grade = gradeCarePlan({ ...autofillFromChart(patient), ...labsFromChart(patient) }, key, patient);
      expect(grade.percent, entry.id).toBe(0);
    }
  });
});
