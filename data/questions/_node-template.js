/**
 * NODE QUESTION BANK TEMPLATE
 * ============================================================
 * Copy this file to data/questions/<nodeId>.js and fill it in.
 *
 * Then add ONE entry to core/nodeConfig.js:
 *
 *   import { MY_QUESTIONS, MY_METADATA } from '../data/questions/<nodeId>.js';
 *
 *   "node-XX": {
 *     courseId:          "basics-of-anesthesia",
 *     title:             "My Topic",
 *     chapterLabel:      "Ch. XX",
 *     badgeLabel:        "TOPIC Ch.XX",
 *     icon:              "📍",
 *     questions:         MY_QUESTIONS,
 *     questionsMeta:     MY_METADATA,
 *     sceneRendererName: "renderMyScene",   // optional — omit if no custom scene
 *     stopSceneName:     "stopMyScene",     // optional
 *   },
 *
 * That's it. The node will appear on the map and be fully playable.
 * ============================================================
 *
 * QUESTION TYPES
 * ─────────────────────────────────────────────────────────────
 *  mcq   — single best answer, uses `ans: [{t, ok}]`
 *  multi — select N answers, uses `choices`, `correctAnswers`, `selectCount`
 *  short — free-text answer, uses `acceptedAnswers`
 */

export const MY_QUESTIONS = [

  // ── MCQ example ────────────────────────────────────────────
  {
    id: "topic-001",
    type: "mcq",
    prompt: "Question stem goes here?",
    setup: "",   // optional clinical scenario shown above the question
    ans: [
      { t: "Correct answer choice",    ok: true  },
      { t: "Incorrect distractor A",   ok: false },
      { t: "Incorrect distractor B",   ok: false },
      { t: "Incorrect distractor C",   ok: false },
    ],
    rationale: "Explanation of why the correct answer is right and why the distractors are wrong.",
    metadata: { topic: "Subtopic Name", priority: "high" }
  },

  // ── Multi-select example ────────────────────────────────────
  {
    id: "topic-002",
    type: "multi",
    prompt: "Select TWO options that apply:",
    setup: "",
    choices: [
      "Choice A",
      "Choice B (correct)",
      "Choice C (correct)",
      "Choice D",
      "Choice E",
    ],
    correctAnswers: ["Choice B (correct)", "Choice C (correct)"],
    selectCount: 2,
    rationale: "Explanation of why B and C are correct.",
    metadata: { topic: "Subtopic Name", priority: "medium" }
  },

  // ── Short answer example ────────────────────────────────────
  {
    id: "topic-003",
    type: "short",
    prompt: "What is the name of the enzyme that metabolizes succinylcholine?",
    setup: "",
    acceptedAnswers: [
      "pseudocholinesterase",
      "plasma cholinesterase",
      "butyrylcholinesterase",
      "pseudocholinesterase (plasma cholinesterase)",
    ],
    rationale: "Succinylcholine is hydrolyzed by pseudocholinesterase (also called plasma cholinesterase or butyrylcholinesterase) in the plasma.",
    metadata: { topic: "Subtopic Name", priority: "high" }
  },

];

// ── Metadata (auto-computed — no manual editing needed) ──────
export const MY_METADATA = {
  nodeId:    "node-XX",
  courseId:  "basics-of-anesthesia",
  chapter:   "Chapter XX",
  title:     "My Topic",
  totalQuestions: MY_QUESTIONS.length,
  questionTypes: {
    mcq:   MY_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: MY_QUESTIONS.filter(q => q.type === 'multi').length,
    short: MY_QUESTIONS.filter(q => q.type === 'short').length,
  }
};
