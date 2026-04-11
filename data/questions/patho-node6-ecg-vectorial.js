/**
 * Advanced Physiology & Pathophysiology — Node 6
 * Chapters 11–12: Fundamentals of ECG / Vectorial Analysis
 * Source: Guyton & Hall 14e (local extracted text)
 */

export const PATHO_NODE6_QUESTIONS = [

  {
    id: "patho-n6-001",
    type: "mcq",
    prompt: "Which ECG feature most directly represents atrial depolarization spreading across both atria?",
    setup: "",
    ans: [
      { t: "P wave",         ok: true  },
      { t: "QRS complex",    ok: false },
      { t: "T wave",          ok: false },
      { t: "U wave",          ok: false },
    ],
    rationale: "The P wave represents atrial depolarization (from SA node across both atria via Bachmann's bundle and the internodal pathways). Atrial REPOLARIZATION is buried inside the QRS and is not normally visible.",
    scene: "ecg_waveform",
    sceneCfg: { label: "P WAVE — ATRIAL DEPOLARIZATION", rhythm: 'sinus', rate: 75 },
    metadata: { topic: "ECG Waves", priority: "medium" },
  },

  {
    id: "patho-n6-002",
    type: "mcq",
    prompt: "Why is the T wave upright in most leads even though it represents REPOLARIZATION (opposite electrical charge compared to depolarization)?",
    setup: "",
    ans: [
      { t: "Ventricular repolarization spreads from epicardium to endocardium — opposite direction of depolarization — so the net vector still points toward the positive electrode", ok: true  },
      { t: "The T wave is actually a delayed depolarization event",                                                                                                                      ok: false },
      { t: "Repolarization is electrically silent; the upright deflection is an artifact",                                                                                                 ok: false },
      { t: "The T wave is inverted in reality and drawn upright by convention",                                                                                                            ok: false },
    ],
    rationale: "Depolarization spreads endocardium → epicardium. Repolarization spreads epicardium → endocardium (endocardium depolarizes first but has longer APD, so it repolarizes last). Because both the direction AND the charge flip, the net T wave vector points the same way as the QRS, making the T wave upright. This is why inverted T waves are clinically meaningful — they suggest ischemia or electrical remodeling.",
    scene: "ecg_waveform",
    sceneCfg: { label: "T WAVE — REPOLARIZATION VECTOR", rhythm: 'sinus', rate: 72 },
    metadata: { topic: "T Wave", priority: "high" },
  },

  {
    id: "patho-n6-003",
    type: "mcq",
    prompt: "Using Einthoven's triangle, lead II records the potential difference between which pair of electrodes?",
    setup: "",
    ans: [
      { t: "Right arm (−) and left leg (+)",  ok: true  },
      { t: "Right arm (−) and left arm (+)",  ok: false },
      { t: "Left arm (−) and left leg (+)",    ok: false },
      { t: "Left leg (−) and right leg (+)",   ok: false },
    ],
    rationale: "Einthoven's bipolar limb leads: Lead I = LA(+) − RA(−); Lead II = LL(+) − RA(−); Lead III = LL(+) − LA(−). Lead II is typically the 'rhythm strip' lead because its axis (+60°) runs nearly parallel to the normal cardiac axis, giving tall upright P and QRS.",
    scene: "ecg_waveform",
    sceneCfg: { label: "LEAD II — RA(−) to LL(+)", rhythm: 'sinus', rate: 75 },
    metadata: { topic: "Lead Placement", priority: "medium" },
  },

  {
    id: "patho-n6-004",
    type: "mcq",
    prompt: "What is the normal range for the mean electrical axis of the heart in an adult?",
    setup: "",
    ans: [
      { t: "−30° to +90°",     ok: true  },
      { t: "0° to +30°",       ok: false },
      { t: "−90° to +90°",     ok: false },
      { t: "+90° to +180°",    ok: false },
    ],
    rationale: "Normal axis is −30° to +90°. Left axis deviation (more negative than −30°) occurs with LVH, LBBB, inferior MI; right axis deviation (beyond +90°) with RVH, COPD, pulmonary embolism, lateral MI, or LPFB. The axis tells you which myocardium is depolarizing toward you on average.",
    scene: null,
    metadata: { topic: "Axis", priority: "medium" },
  },

  {
    id: "patho-n6-005",
    type: "mcq",
    prompt: "A 40-year-old man has small-amplitude QRS in ALL limb leads but normal QRS shape and duration. What physiologic or anatomic finding is most likely?",
    setup: "",
    ans: [
      { t: "Pericardial effusion damping the voltage reaching the electrodes", ok: true  },
      { t: "Left ventricular hypertrophy",                                      ok: false },
      { t: "Myocardial infarction",                                              ok: false },
      { t: "Wolff-Parkinson-White syndrome",                                      ok: false },
    ],
    rationale: "Low voltage in all limb leads classically represents a barrier between the heart and the electrodes that damps the signal — most commonly pericardial effusion. Other causes include morbid obesity, COPD (hyperinflated lungs), and infiltrative cardiomyopathies (amyloid). LVH produces HIGH voltages; MI causes Q waves.",
    scene: "ecg_waveform",
    sceneCfg: { label: "LOW VOLTAGE → EFFUSION?", rhythm: 'sinus', rate: 75 },
    metadata: { topic: "Voltage Abnormalities", priority: "medium" },
  },

  {
    id: "patho-n6-006",
    type: "multi",
    prompt: "Select the THREE ways to estimate the mean electrical axis from a 12-lead ECG:",
    setup: "",
    choices: [
      "Find the limb lead with the most isoelectric QRS and the axis is perpendicular to it",
      "Determine whether QRS is predominantly positive in leads I and aVF",
      "Use Einthoven's triangle to plot vectors from lead I, II, III",
      "Look exclusively at precordial leads V1–V6",
      "Use only the T wave deflection",
    ],
    correctAnswers: [
      "Find the limb lead with the most isoelectric QRS and the axis is perpendicular to it",
      "Determine whether QRS is predominantly positive in leads I and aVF",
      "Use Einthoven's triangle to plot vectors from lead I, II, III",
    ],
    selectCount: 3,
    rationale: "Three common bedside methods: (1) identify the isoelectric lead and draw the axis perpendicular; (2) quadrant method from I and aVF — both upright = normal axis; I+ aVF− = left axis (usually); I− aVF+ = right axis; (3) full vector construction on Einthoven's triangle. Precordial leads alone cannot give you the frontal-plane axis, and the T wave is not used.",
    scene: null,
    metadata: { topic: "Axis Determination", priority: "medium" },
  },

  {
    id: "patho-n6-007",
    type: "mcq",
    prompt: "What structural/conduction change in the heart causes the QRS complex to widen beyond 0.12 sec?",
    setup: "",
    ans: [
      { t: "Conduction delay or block below the AV node (bundle branch block, ventricular beats, sodium-channel blockade)", ok: true  },
      { t: "AV nodal block alone",                                                                                            ok: false },
      { t: "Hyperthyroidism",                                                                                                  ok: false },
      { t: "SA node dysfunction",                                                                                               ok: false },
    ],
    rationale: "QRS widens when depolarization can't use the fast Purkinje system and has to spread cell-to-cell. Classic causes: bundle branch block, ventricular escape/ectopic beats, WPW pre-excitation, severe hyperkalemia, TCA or class Ia/Ic sodium-channel blocker overdose. Pure AV nodal block widens the PR interval but QRS stays narrow unless an escape rhythm is involved.",
    scene: "ecg_waveform",
    sceneCfg: { label: "WIDE QRS → BELOW AV NODE", rhythm: 'vtach', rate: 140 },
    metadata: { topic: "QRS Width", priority: "high" },
  },

  {
    id: "patho-n6-008",
    type: "mcq",
    prompt: "A patient shows ST elevation in leads II, III, and aVF. What region of myocardium is injured, and what coronary artery is most commonly responsible?",
    setup: "",
    ans: [
      { t: "Inferior wall — right coronary artery (RCA) in ~80% of patients", ok: true  },
      { t: "Anterior wall — LAD",                                              ok: false },
      { t: "Lateral wall — circumflex",                                        ok: false },
      { t: "Posterior wall — posterior descending artery",                      ok: false },
    ],
    rationale: "Leads II, III, aVF view the inferior wall of the left ventricle. Inferior STEMI is RCA-territory in ~80% of patients (RCA supplies PDA and thus the inferior wall in right-dominant circulations) and left circumflex in ~20% (left-dominant). Reciprocal ST depression often appears in leads I and aVL.",
    scene: "ecg_waveform",
    sceneCfg: { label: "INFERIOR STEMI — II, III, aVF", rhythm: 'sinus', rate: 75 },
    metadata: { topic: "STEMI Localization", priority: "high" },
  },

  {
    id: "patho-n6-009",
    type: "short",
    prompt: "At a standard paper speed (25 mm/sec) and standard gain (10 mm/mV), one small box is 1 mm. How many seconds does one LARGE box (5 small boxes) represent?",
    setup: "",
    acceptedAnswers: [
      "0.2", "0.2 sec", "0.20", "0.20 sec", "0.2 seconds", "200 ms", "200 msec",
    ],
    canonicalAnswer: "0.2 sec (200 ms)",
    rationale: "At 25 mm/sec, each mm = 0.04 sec, and each large box (5 mm) = 0.20 sec. Heart rate shortcut: 300/(number of large boxes between R waves) gives rate in bpm. Five large boxes between R waves = 60 bpm; three = 100 bpm.",
    scene: "ecg_waveform",
    sceneCfg: { label: "1 LARGE BOX = 0.20 SEC", rhythm: 'sinus', rate: 60 },
    metadata: { topic: "ECG Timing", priority: "medium" },
  },

  {
    id: "patho-n6-010",
    type: "mcq",
    prompt: "What causes the J-point ST elevation seen transiently in many young, healthy male patients and in hypothermia (the Osborn 'J' wave)?",
    setup: "",
    ans: [
      { t: "Early repolarization — a transient outward K⁺ current notches the junction between QRS and ST", ok: true  },
      { t: "Coronary occlusion",                                                                              ok: false },
      { t: "Left ventricular hypertrophy",                                                                     ok: false },
      { t: "Pericarditis (diffuse ST elevation)",                                                                ok: false },
    ],
    rationale: "Benign 'early repolarization' (and Osborn waves in hypothermia) reflect a transient outward K⁺ current (Ito) that notches the J point — the transition between the end of QRS and the ST segment. It must be distinguished from ischemic ST elevation: early repolarization is diffuse, concave up, often with notched J point and large T waves, and tends to normalize on exercise.",
    scene: "ecg_waveform",
    sceneCfg: { label: "J POINT NOTCH", rhythm: 'sinus', rate: 60 },
    metadata: { topic: "ST Segment", priority: "medium" },
  },

  {
    id: "patho-n6-011",
    type: "mcq",
    prompt: "Using vector analysis, the mean QRS axis in the frontal plane represents:",
    setup: "",
    ans: [
      { t: "The average direction of net electrical current flow during ventricular depolarization",  ok: true  },
      { t: "The average direction of current during ventricular repolarization",                      ok: false },
      { t: "The direction in which the SA node fires",                                                  ok: false },
      { t: "The timing of atrial vs ventricular conduction",                                             ok: false },
    ],
    rationale: "The mean axis is the vector sum of all instantaneous depolarization vectors during QRS, projected onto the frontal plane. It is a snapshot of where the bulk of left ventricular mass is depolarizing. Axis shifts can detect hypertrophy, infarction, block, or positional changes.",
    scene: null,
    metadata: { topic: "Vector Analysis", priority: "medium" },
  },

  {
    id: "patho-n6-012",
    type: "mcq",
    prompt: "Which abnormality on an ECG most strongly suggests right ventricular hypertrophy?",
    setup: "",
    ans: [
      { t: "Right axis deviation with dominant R in V1",      ok: true  },
      { t: "Left axis deviation with dominant R in I and aVL", ok: false },
      { t: "Diffuse low voltages",                              ok: false },
      { t: "Widened QRS with RSR' in V1",                       ok: false },
    ],
    rationale: "RVH increases right ventricular muscle mass, shifting the mean vector rightward (right axis >+90°) and producing a taller R wave than S wave in V1. RSR' in V1 with QRS >0.12 sec is right bundle branch block — a different pathology. Dominant R in I/aVL suggests LVH; low voltages suggest effusion/COPD/obesity.",
    scene: null,
    metadata: { topic: "RVH", priority: "medium" },
  },

];

export const PATHO_NODE6_METADATA = {
  nodeId:   "patho-node-6",
  courseId: "adv-phys-path-1",
  chapter:  "Chapters 11–12",
  title:    "Fundamentals of ECG & Vectorial Analysis",
  totalQuestions: PATHO_NODE6_QUESTIONS.length,
  questionTypes: {
    mcq:   PATHO_NODE6_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: PATHO_NODE6_QUESTIONS.filter(q => q.type === 'multi').length,
    short: PATHO_NODE6_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
