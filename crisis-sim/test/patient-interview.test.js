import { readFileSync } from 'node:fs';
import { describe, expect, test, vi } from 'vitest';
import {
  buildInterviewGrounding,
  deterministicPatientReply,
  createPatientInterview,
} from '../../ui/patientInterview.js';

const KAREN = JSON.parse(readFileSync(new URL('../sim/scenarios/cn_preassessment_lap_chole_001.json', import.meta.url), 'utf8'));

describe('buildInterviewGrounding', () => {
  test('extracts the learner-safe chart and interview-stage scripted Q&A', () => {
    const g = buildInterviewGrounding(KAREN.caseExperience);
    expect(g.patientName).toBe('Karen Whitfield');
    // Only interview/chart_review stage actions become interview questions.
    const ids = g.qa.map((q) => q.id);
    expect(ids).toContain('ask_asthma_control');
    expect(ids).toContain('ask_ponv_history');
    // The focused_exam action (exam_airway) is NOT an interview question.
    expect(ids).not.toContain('exam_airway');
    // Each qa carries the sourced answer.
    const npo = g.qa.find((q) => q.id === 'ask_asthma_control');
    expect(npo.response).toMatch(/asthma|albuterol/i);
    // The grounding chart carries no instructor content.
    expect(JSON.stringify(g.chart)).not.toMatch(/scoringGuidance|redFlags|instructorGuide/);
  });

  test('returns null for a rubric-only scenario (no case)', () => {
    expect(buildInterviewGrounding(null)).toBeNull();
    expect(buildInterviewGrounding({})).toEqual(expect.objectContaining({ qa: [] }));
  });
});

describe('deterministicPatientReply (sourced fallback)', () => {
  const qa = buildInterviewGrounding(KAREN.caseExperience).qa;

  test('matches a natural question to the correct scripted answer', () => {
    const r = deterministicPatientReply('When did you last have anything to eat or drink?', qa);
    // No NPO question in Karen; ensure a food question does not falsely match asthma.
    expect(r.matched === false || r.coversQuestionIds.length <= 1).toBe(true);

    const asthma = deterministicPatientReply('Tell me about your asthma control and triggers', qa);
    expect(asthma.coversQuestionIds).toEqual(['ask_asthma_control']);
    expect(asthma.reply).toBe(qa.find((q) => q.id === 'ask_asthma_control').response);
  });

  test('returns a plain non-committal answer when nothing matches, never inventing', () => {
    const r = deterministicPatientReply('Do you have any heart problems or chest pain?', qa);
    expect(r.matched).toBe(false);
    expect(r.coversQuestionIds).toEqual([]);
    expect(r.reply).toMatch(/not sure|nothing/i);
  });
});

// --- Minimal fake DOM so the controller can be exercised headlessly ---
function fakeEl() {
  return {
    value: '', textContent: '', hidden: false, scrollTop: 0, scrollHeight: 100,
    children: [],
    listeners: {},
    addEventListener(type, fn) { (this.listeners[type] ??= []).push(fn); },
    removeEventListener() {},
    setAttribute() {},
    append(...nodes) { this.children.push(...nodes); },
    replaceChildren() { this.children = []; },
    emit(type, ev = {}) { (this.listeners[type] ?? []).forEach((fn) => fn(ev)); },
  };
}

function fakeRoot() {
  const ids = ['live-patient-interview', 'patient-interview-transcript', 'patient-interview-input',
    'patient-interview-send', 'patient-interview-mic', 'patient-interview-status'];
  const byId = Object.fromEntries(ids.map((id) => [id, fakeEl()]));
  return {
    byId,
    getElementById: (id) => byId[id] ?? null,
    createElement: () => fakeEl(),
  };
}

describe('createPatientInterview controller', () => {
  test('uses the grounded AI reply, performs the matched action, and speaks it', async () => {
    const root = fakeRoot();
    const performed = [];
    const runner = { performAssessmentAction: (a) => { performed.push(a.actionId); return { ok: true }; } };
    const spoken = [];
    const speechHost = {
      speechSynthesis: { cancel() {}, speak: (u) => spoken.push(u.text) },
      SpeechSynthesisUtterance: class { constructor(t) { this.text = t; } },
    };
    const fetchImpl = vi.fn(async (url) => {
      if (url === '/api/patient-chat') {
        return { ok: true, json: async () => ({ reply: 'I have mild asthma, I rarely use my inhaler.', coversQuestionIds: ['ask_asthma_control'] }) };
      }
      return { ok: false, json: async () => ({}) }; // /api/tts unavailable -> synthesis fallback
    });

    const interview = createPatientInterview({ runner, root, fetchImpl, speechHost });
    interview.setCase(KAREN.caseExperience);
    await interview.ask('How is your asthma?');

    expect(fetchImpl).toHaveBeenCalledWith('/api/patient-chat', expect.anything());
    // The grounded reply was shown, the matched interview action was performed,
    // and the reply was spoken via the synthesis fallback.
    expect(performed).toEqual(['ask_asthma_control']);
    expect(spoken).toEqual(['I have mild asthma, I rarely use my inhaler.']);
    const transcriptText = root.byId['patient-interview-transcript'].children.map((c) => c.children.map((x) => x.textContent).join('')).join(' ');
    expect(transcriptText).toContain('How is your asthma?');
    expect(transcriptText).toContain('mild asthma');
  });

  test('falls back to the sourced deterministic reply when the AI endpoint is unavailable', async () => {
    const root = fakeRoot();
    const performed = [];
    const runner = { performAssessmentAction: (a) => { performed.push(a.actionId); return { ok: true }; } };
    const fetchImpl = vi.fn(async () => ({ ok: false, json: async () => ({}), status: 501 }));

    const interview = createPatientInterview({ runner, root, fetchImpl, speechHost: {} });
    interview.setCase(KAREN.caseExperience);
    await interview.ask('Tell me about your asthma');

    // With no AI, the patient still answers from the sourced script and scores it.
    expect(performed).toEqual(['ask_asthma_control']);
    const patientTurn = root.byId['patient-interview-transcript'].children.at(-1);
    const said = patientTurn.children.map((x) => x.textContent).join('');
    expect(said).toContain(KAREN.caseExperience.assessment.actions.find((a) => a.id === 'ask_asthma_control').response);
  });

  test('hides the panel for a rubric-only scenario', () => {
    const root = fakeRoot();
    const interview = createPatientInterview({ runner: {}, root, fetchImpl: null, speechHost: {} });
    interview.setCase(null);
    expect(root.byId['live-patient-interview'].hidden).toBe(true);
  });
});
