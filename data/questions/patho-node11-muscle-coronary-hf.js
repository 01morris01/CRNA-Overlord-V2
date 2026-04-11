/**
 * Advanced Physiology & Pathophysiology — Node 11
 * Chapters 21–22: Muscle Blood Flow / Coronary Circulation / Cardiac Failure
 * Source: Guyton & Hall 14e (local extracted text)
 */

export const PATHO_NODE11_QUESTIONS = [

  {
    id: "patho-n11-001",
    type: "mcq",
    prompt: "Resting coronary blood flow is approximately:",
    setup: "",
    ans: [
      { t: "~70 mL/min per 100 g of myocardium, or ~225 mL/min total (≈ 4–5% of CO)", ok: true  },
      { t: "~5 mL/min total",                                                            ok: false },
      { t: "~1 L/min total",                                                              ok: false },
      { t: "~2 mL/min per 100 g",                                                          ok: false },
    ],
    rationale: "Guyton quotes ~70 mL/min per 100 g of heart at rest and ~225 mL/min total — about 4–5% of the cardiac output to supply an organ that is only 0.5% of body mass. The heart is METABOLICALLY busy, not volumetrically big, and its oxygen extraction is nearly maximal at rest.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "CORONARY REST FLOW — 70 mL/min/100g", radius: 60, wall: 12 },
    metadata: { topic: "Coronary Flow", priority: "medium" },
  },

  {
    id: "patho-n11-002",
    type: "mcq",
    prompt: "Why does LEFT ventricular coronary flow actually FALL to a low value during systole, unlike flow to most other tissues?",
    setup: "",
    ans: [
      { t: "Strong compression of intramuscular vessels by the contracting LV myocardium physically squeezes them closed", ok: true  },
      { t: "Coronary arteries receive direct parasympathetic vasoconstriction during systole",                              ok: false },
      { t: "Aortic pressure drops during systole",                                                                            ok: false },
      { t: "The LV ostium closes during systole",                                                                              ok: false },
    ],
    rationale: "During systole the LV generates ~120 mmHg inside the wall — higher than coronary driving pressure — and mechanically compresses intramural coronary vessels. As a result, LEFT coronary flow is biphasic with most flow occurring during DIASTOLE. This is why tachycardia (shortened diastole) and hypotension both threaten subendocardial perfusion. Right coronary flow is less affected because RV pressures are lower.",
    scene: "pv_loop",
    sceneCfg: { label: "LV COMPRESSION — DIASTOLIC PERFUSION", state: 'normal' },
    metadata: { topic: "Coronary Phasic Flow", priority: "high" },
  },

  {
    id: "patho-n11-003",
    type: "mcq",
    prompt: "Under resting conditions, cardiac muscle gets most of its energy from:",
    setup: "",
    ans: [
      { t: "Fatty acid oxidation (~70% of ATP production)", ok: true  },
      { t: "Glucose via glycolysis",                         ok: false },
      { t: "Branched-chain amino acids",                      ok: false },
      { t: "Lactate — as a primary fuel",                      ok: false },
    ],
    rationale: "At rest, cardiac muscle derives ~70% of its ATP from fatty acid β-oxidation. It flexibly switches to lactate and glucose during exercise and high workload. Under ischemic/anaerobic conditions, the heart must rely on anaerobic glycolysis — which yields little ATP, consumes blood glucose rapidly, and produces large amounts of lactic acid that contribute to ischemic pain and acidosis.",
    scene: null,
    metadata: { topic: "Cardiac Metabolism", priority: "medium" },
  },

  {
    id: "patho-n11-004",
    type: "mcq",
    prompt: "In the first 30–60 seconds after cardiac muscle damage from an MI, what COMPENSATORY mechanism is maximally activated?",
    setup: "",
    ans: [
      { t: "Sympathetic nervous system reflex activation — increased HR, contractility, venoconstriction, and arteriolar constriction", ok: true  },
      { t: "Renin-angiotensin-aldosterone system — activates within minutes",                                                              ok: false },
      { t: "Atrial natriuretic peptide release",                                                                                             ok: false },
      { t: "Cardiac muscle repair via stem cell proliferation",                                                                                ok: false },
    ],
    rationale: "Acute drop in cardiac output triggers baroreflex-mediated sympathetic discharge within 30–60 seconds. NE acts on cardiac β₁ (↑HR, ↑contractility) and vascular α₁ (vasoconstriction, ↑SVR, ↑MSFP). This is the fast compensation. RAAS takes 10–60 minutes to activate; chronic adaptations (fluid retention, cardiac remodeling) take hours to days.",
    scene: "pv_loop",
    sceneCfg: { label: "ACUTE HF — SNS RESCUE", state: 'hf' },
    metadata: { topic: "Acute HF Compensation", priority: "high" },
  },

  {
    id: "patho-n11-005",
    type: "multi",
    prompt: "Select the THREE chronic compensatory mechanisms in cardiac failure that Guyton emphasizes:",
    setup: "",
    choices: [
      "Fluid retention via RAAS activation and ADH",
      "Sympathetic venoconstriction → increased mean systemic filling pressure",
      "Partial myocardial recovery and remodeling over weeks",
      "Reduction in systemic vascular resistance as a primary compensatory mechanism",
      "Increase in atrial natriuretic peptide to improve cardiac function",
    ],
    correctAnswers: [
      "Fluid retention via RAAS activation and ADH",
      "Sympathetic venoconstriction → increased mean systemic filling pressure",
      "Partial myocardial recovery and remodeling over weeks",
    ],
    selectCount: 3,
    rationale: "Chronic HF compensations: (1) RAAS-driven Na⁺ and H₂O retention raises blood volume and MSFP; (2) sustained venoconstriction holds more blood in the effective circulation; (3) partial myocardial recovery and remodeling occurs as the uninjured myocardium hypertrophies and scar forms. SVR actually RISES (not falls), and ANP/BNP are elevated biomarkers but insufficient to rescue function — their elevation is a MARKER, not a treatment.",
    scene: "frank_starling",
    sceneCfg: { label: "CHRONIC HF COMPENSATIONS", shift: 'failure' },
    metadata: { topic: "Chronic HF", priority: "high" },
  },

  {
    id: "patho-n11-006",
    type: "mcq",
    prompt: "A patient with severe systolic HF has an EF of 20%. On a Frank-Starling graph, how does his cardiac function curve compare to normal?",
    setup: "",
    ans: [
      { t: "It is shifted downward and flattened — for any given preload, contractility generates a smaller stroke volume, and further preload yields diminishing returns", ok: true  },
      { t: "Shifted upward — more contractility for any given preload",                                                                                                         ok: false },
      { t: "Unchanged — only preload determines CO",                                                                                                                              ok: false },
      { t: "Shifted left — more sensitive to preload",                                                                                                                             ok: false },
    ],
    rationale: "Systolic HF flattens and shifts the cardiac function curve downward: the failing ventricle generates less SV at every preload AND its ability to recruit extra SV with additional volume is limited. Adding more fluid eventually just raises filling pressures (and causes pulmonary edema) without improving CO. This is why diuretics paradoxically help HF — by reducing preload out of the over-filled range.",
    scene: "frank_starling",
    sceneCfg: { label: "HF — FLATTENED STARLING", shift: 'failure' },
    metadata: { topic: "HF Hemodynamics", priority: "high" },
  },

  {
    id: "patho-n11-007",
    type: "mcq",
    prompt: "Which plasma biomarker is Guyton's cited 'strong indicator of heart failure' released from stretched ventricular myocytes?",
    setup: "",
    ans: [
      { t: "BNP (B-type natriuretic peptide)",                     ok: true  },
      { t: "Troponin I",                                            ok: false },
      { t: "CK-MB",                                                 ok: false },
      { t: "Myoglobin",                                              ok: false },
    ],
    rationale: "BNP is released from ventricular myocytes in response to wall stretch. Plasma BNP correlates with severity of heart failure and is used to rule in/out HF as a cause of acute dyspnea. Troponin/CK-MB/myoglobin are markers of ACUTE MYOCYTE NECROSIS (MI), not of the chronic pressure/volume stress that drives HF.",
    scene: null,
    metadata: { topic: "HF Biomarkers", priority: "high" },
  },

  {
    id: "patho-n11-008",
    type: "mcq",
    prompt: "A patient with chronic HF becomes acutely worse with dyspnea, rales, and frothy sputum. What is the dominant pathophysiology?",
    setup: "",
    ans: [
      { t: "Acute pulmonary edema from elevated LA pressure transmitted back into pulmonary capillaries", ok: true  },
      { t: "Bronchospasm from mast cell degranulation",                                                     ok: false },
      { t: "Right-to-left shunt reopening across a PFO",                                                      ok: false },
      { t: "Pleural effusion compressing lung parenchyma",                                                     ok: false },
    ],
    rationale: "When LV filling pressures rise acutely (>25–30 mmHg), LA and pulmonary venous pressures follow, pushing pulmonary capillary pressure above plasma oncotic pressure. Fluid floods into alveoli → pink frothy sputum and rales. Treatment targets preload (loop diuretics, venodilators like nitroglycerin), afterload, and oxygenation (often non-invasive positive pressure).",
    scene: "starling_forces",
    sceneCfg: { label: "PULMONARY EDEMA", Pc: "+35", piC: "−25", Pif: "+2", piIf: "+8" },
    metadata: { topic: "Pulmonary Edema", priority: "high" },
  },

  {
    id: "patho-n11-009",
    type: "mcq",
    prompt: "What proportion of cardiac output is distributed to SKELETAL MUSCLE at rest, and what is the dominant mechanism by which it increases 20-fold during maximal exercise?",
    setup: "",
    ans: [
      { t: "~20% at rest; metabolic vasodilation (K⁺, CO₂, adenosine, H⁺, hypoxia) drops muscle arteriolar resistance dramatically", ok: true  },
      { t: "~5% at rest; cardiac sympathetic outflow alone",                                                                           ok: false },
      { t: "~50% at rest; shunt vessels reopen",                                                                                         ok: false },
      { t: "~80% at rest; the rest goes to brain",                                                                                         ok: false },
    ],
    rationale: "Skeletal muscle gets ~15–20% of resting CO but can take >85% during maximal exercise. The main mechanism is active hyperemia: local metabolites (K⁺, CO₂, H⁺, lactate, adenosine) dilate precapillary sphincters and arterioles, and tissue O₂ falls as demand rises. Sympathetic outflow SIMULTANEOUSLY constricts splanchnic and cutaneous beds, redirecting CO to muscle.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "EXERCISE HYPEREMIA — ~20× INCREASE", radius: 75, wall: 8 },
    metadata: { topic: "Exercise Physiology", priority: "medium" },
  },

  {
    id: "patho-n11-010",
    type: "short",
    prompt: "What is the primary metabolic byproduct that accumulates during cardiac ischemia and causes anginal PAIN by stimulating afferent nerve endings?",
    setup: "",
    acceptedAnswers: [
      "lactic acid", "lactate", "lactate (lactic acid)", "adenosine",
      "lactic acid / adenosine",
    ],
    canonicalAnswer: "Lactic acid (and adenosine)",
    rationale: "Anaerobic cardiac metabolism under ischemia produces large amounts of lactic acid. Adenosine (from ATP breakdown) also activates A1 receptors on cardiac afferents. Both are candidate mediators of anginal pain, which is referred to dermatomes T1–T4 (chest, left arm, jaw).",
    scene: null,
    metadata: { topic: "Angina", priority: "medium" },
  },

  {
    id: "patho-n11-011",
    type: "mcq",
    prompt: "Guyton notes that 'with a ≥ 50% decrease in cardiac output, death often occurs within minutes'. What mechanism is responsible?",
    setup: "",
    ans: [
      { t: "Progressive tissue hypoperfusion → acidosis → myocardial and vascular failure → positive-feedback spiral (irreversible shock)", ok: true  },
      { t: "Direct effect of low CO on baroreceptor firing",                                                                                   ok: false },
      { t: "Reflex coronary vasoconstriction",                                                                                                   ok: false },
      { t: "Acute collapse of the venous system",                                                                                                 ok: false },
    ],
    rationale: "When CO falls ≥ 50%, tissue O₂ delivery is insufficient to sustain cellular metabolism. Acidosis impairs myocardial contractility and relaxes vascular smooth muscle (vasomotor failure), which further drops CO in a vicious cycle. Once this positive-feedback loop is established, shock transitions from reversible to irreversible. The narrow therapeutic window is why early recognition and aggressive resuscitation matter.",
    scene: "shock_spiral",
    sceneCfg: { label: "VICIOUS CYCLE — SHOCK", stage: 'progressive' },
    metadata: { topic: "Shock Physiology", priority: "high" },
  },

  {
    id: "patho-n11-012",
    type: "mcq",
    prompt: "In left heart failure with low CO and preserved right-sided function, which vascular bed fills up first and becomes congested?",
    setup: "",
    ans: [
      { t: "Pulmonary venous circulation — LA pressure rises, transmitted retrograde into pulmonary veins and capillaries", ok: true  },
      { t: "Hepatic veins and jugular venous system",                                                                         ok: false },
      { t: "Systemic arteriolar bed",                                                                                          ok: false },
      { t: "Coronary venous system",                                                                                            ok: false },
    ],
    rationale: "Isolated left HF fails to clear blood from the pulmonary vascular bed, so pressure builds upstream in pulmonary veins → pulmonary capillaries → alveolar edema. The right heart continues to pump into this congested circuit. Only once right ventricular failure supervenes does systemic congestion (JVD, hepatomegaly, peripheral edema) appear — so those are typically signs of BIVENTRICULAR HF.",
    scene: "starling_forces",
    sceneCfg: { label: "LHF — PULMONARY CONGESTION", Pc: "+30", piC: "−25", Pif: "0", piIf: "+8" },
    metadata: { topic: "HF Types", priority: "high" },
  },

];

export const PATHO_NODE11_METADATA = {
  nodeId:   "patho-node-11",
  courseId: "adv-phys-path-1",
  chapter:  "Chapters 21–22",
  title:    "Muscle/Coronary Blood Flow & Cardiac Failure",
  totalQuestions: PATHO_NODE11_QUESTIONS.length,
  questionTypes: {
    mcq:   PATHO_NODE11_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: PATHO_NODE11_QUESTIONS.filter(q => q.type === 'multi').length,
    short: PATHO_NODE11_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
