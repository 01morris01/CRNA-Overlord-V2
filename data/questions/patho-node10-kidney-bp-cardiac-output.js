/**
 * Advanced Physiology & Pathophysiology — Node 10
 * Chapters 19–20: Kidneys in Long-Term BP Control / Cardiac Output & Venous Return
 * Source: Guyton & Hall 14e (local extracted text)
 */

export const PATHO_NODE10_QUESTIONS = [

  {
    id: "patho-n10-001",
    type: "mcq",
    prompt: "Guyton argues that the kidneys have an 'infinite gain' for long-term arterial pressure control. What does this mean mathematically?",
    setup: "",
    ans: [
      { t: "Pressure natriuresis keeps excreting Na⁺ and water until pressure returns to the set point, so remaining error → 0 and gain → ∞", ok: true  },
      { t: "The kidneys can continuously increase glomerular filtration rate without any upper limit as arterial pressure rises chronically",    ok: false },
      { t: "Plasma sodium concentration rises without bound during acute and sustained hemorrhagic hypotension and reflex sympathetic activation", ok: false },
      { t: "Carotid and aortic baroreceptors fire at an essentially infinite rate during chronic arterial hypertension to signal the brainstem",   ok: false },
    ],
    rationale: "The pressure-natriuresis mechanism is the only BP control system with infinite gain: as long as MAP deviates from the kidney's equilibrium set point, sodium and water excretion is adjusted to drive ECFV (and therefore BP) back toward equilibrium. Because it keeps working until error reaches zero, gain mathematically approaches infinity. All other loops (baroreflex, CNS ischemic, RAAS) have finite gain and 'give up' after a while.",
    scene: "nephron_flow",
    sceneCfg: { label: "PRESSURE NATRIURESIS — INFINITE GAIN", highlight: 'pct' },
    metadata: { topic: "Long-term BP Control", priority: "high" },
  },

  {
    id: "patho-n10-002",
    type: "multi",
    prompt: "Select the THREE ACTIONS Guyton lists for angiotensin II in blood pressure control:",
    setup: "",
    choices: [
      "Direct systemic arteriolar vasoconstriction raising total peripheral resistance",
      "Na⁺ retention through both direct proximal tubule effect and via aldosterone",
      "Right-shift of the renal function curve — pressure natriuresis at a higher set point",
      "Direct cardiac positive inotropy as its primary mechanism for raising arterial pressure",
      "Suppression of pituitary ADH secretion, reducing free-water reabsorption by the kidney",
    ],
    correctAnswers: [
      "Direct systemic arteriolar vasoconstriction raising total peripheral resistance",
      "Na⁺ retention through both direct proximal tubule effect and via aldosterone",
      "Right-shift of the renal function curve — pressure natriuresis at a higher set point",
    ],
    selectCount: 3,
    rationale: "Ang II constricts systemic arterioles (especially efferent renal arterioles, maintaining GFR in hypoperfusion), promotes Na⁺ retention directly at the proximal tubule AND indirectly via aldosterone, and shifts the pressure-natriuresis curve so the kidney tolerates higher pressures without natriuresing — a key mechanism in hypertension. It INCREASES (not decreases) ADH release and stimulates thirst.",
    scene: "nephron_flow",
    sceneCfg: { label: "ANGIOTENSIN II ACTIONS", highlight: 'cd' },
    metadata: { topic: "RAAS", priority: "high" },
  },

  {
    id: "patho-n10-003",
    type: "mcq",
    prompt: "Where is ANGIOTENSIN I converted to angiotensin II, and by what enzyme?",
    setup: "",
    ans: [
      { t: "In the pulmonary circulation by angiotensin-converting enzyme (ACE) on pulmonary endothelium", ok: true  },
      { t: "In the liver by hepatic renin during first-pass metabolism of angiotensinogen substrate",        ok: false },
      { t: "In the kidney by ACE expressed on proximal convoluted tubule epithelial cells directly",          ok: false },
      { t: "Throughout the systemic circulation by plasma renin acting on circulating Ang I substrate",        ok: false },
    ],
    rationale: "Renin (from renal juxtaglomerular cells) cleaves liver-derived angiotensinogen to angiotensin I. Pulmonary endothelial ACE then cleaves Ang I → Ang II during passage through the lung. Ang II acts on AT1 receptors for its pressor and sodium-retaining effects. ACE also degrades bradykinin — which is why ACE inhibitors cause cough and angioedema.",
    scene: null,
    metadata: { topic: "RAAS Biochemistry", priority: "medium" },
  },

  {
    id: "patho-n10-004",
    type: "mcq",
    prompt: "Normal resting cardiac output for a young, healthy man averages:",
    setup: "",
    ans: [
      { t: "~5.6 L/min — Guyton's canonical adult male value",     ok: true  },
      { t: "~2.5 L/min — well below the normal resting range",      ok: false },
      { t: "~10 L/min — typical of moderate exercise, not rest",    ok: false },
      { t: "~0.5 L/min — far below any compatible-with-life level",  ok: false },
    ],
    rationale: "Guyton quotes ~5.6 L/min for a young healthy man at rest and ~4.9 L/min for a woman (scaled to body surface area). Cardiac INDEX (CI = CO/BSA) normalizes for size and is typically ~3 L/min/m². CI peaks at ~4 L/min/m² around age 10 and declines to ~2.4 L/min/m² by age 80 as muscle mass and metabolism drop.",
    scene: null,
    metadata: { topic: "Cardiac Output", priority: "medium" },
  },

  {
    id: "patho-n10-005",
    type: "mcq",
    prompt: "According to the Frank-Starling law, within physiologic limits, what happens when venous return increases?",
    setup: "",
    ans: [
      { t: "Increased end-diastolic stretch → more forceful contraction → higher stroke volume and cardiac output", ok: true  },
      { t: "Decreased stroke volume due to pressure overload on the already stretched ventricular myocardium",        ok: false },
      { t: "No change — the ventricle runs at a fixed stroke volume regardless of preload changes during filling",     ok: false },
      { t: "Reflex bradycardia triggered by atrial stretch receptors, with no change in stroke volume or output",       ok: false },
    ],
    rationale: "Frank-Starling: increased venous return stretches the ventricular myocytes during diastole. Stretch brings actin and myosin into optimal overlap AND sensitizes troponin C to Ca²⁺, producing a more forceful contraction on the next beat. This is an intrinsic cardiac mechanism that auto-matches CO to venous return beat-by-beat.",
    scene: "frank_starling",
    sceneCfg: { label: "FRANK-STARLING", shift: 'normal' },
    metadata: { topic: "Frank-Starling", priority: "high" },
  },

  {
    id: "patho-n10-006",
    type: "mcq",
    prompt: "The Bainbridge reflex describes what physiologic response?",
    setup: "",
    ans: [
      { t: "Right atrial stretch triggers a reflex rise in heart rate via vagal withdrawal and sympathetic activation", ok: true  },
      { t: "Aortic arch stretch during hypertensive spikes triggers reflex bradycardia through vagal afferent signaling",  ok: false },
      { t: "Low carotid sinus pressure during hemorrhage triggers reflex hypertension through medullary vasomotor center",  ok: false },
      { t: "High cerebrospinal fluid pressure from elevated ICP triggers reflex bradycardia (the Cushing response)",         ok: false },
    ],
    rationale: "Bainbridge reflex: volume loading stretches the right atrium, activates atrial stretch receptors, signals the vasomotor center via vagal afferents, and increases heart rate by 10–15% through combined vagal withdrawal and sympathetic activation. It is a feed-forward mechanism that helps dispose of a volume load.",
    scene: "feedback_loop",
    sceneCfg: { label: "BAINBRIDGE — ATRIAL STRETCH", kind: 'negative' },
    metadata: { topic: "Bainbridge Reflex", priority: "medium" },
  },

  {
    id: "patho-n10-007",
    type: "mcq",
    prompt: "Mean systemic filling pressure (MSFP) is about 7 mmHg normally. What happens to MSFP during sympathetic venoconstriction?",
    setup: "",
    ans: [
      { t: "MSFP rises, increasing the pressure gradient for venous return and raising cardiac output",   ok: true  },
      { t: "MSFP falls as venous smooth muscle relaxes and capacitance vessels expand during the response", ok: false },
      { t: "MSFP is unchanged because it is determined only by total blood volume and not by vascular tone", ok: false },
      { t: "MSFP rises to match systemic arterial pressure because constriction equalizes all compartments",  ok: false },
    ],
    rationale: "MSFP is the pressure in the circulation if the heart stopped and all blood equilibrated — normally ~7 mmHg. It depends on blood VOLUME and vascular TONE. Sympathetic venoconstriction raises MSFP (squeezes venous capacitance), increasing the driving pressure for venous return (ΔP = MSFP − right atrial pressure) and therefore CO. This is why vasopressors raise CO as well as MAP.",
    scene: "frank_starling",
    sceneCfg: { label: "MSFP ↑ → VR ↑ → CO ↑", shift: 'inotropic' },
    metadata: { topic: "Venous Return", priority: "high" },
  },

  {
    id: "patho-n10-008",
    type: "mcq",
    prompt: "A patient is given a large rapid IV bolus of crystalloid. What happens to cardiac output on a Guytonian venous-return / cardiac-output curve graph?",
    setup: "",
    ans: [
      { t: "Venous return curve shifts rightward from higher MSFP, so intersection with the cardiac curve is at higher CO and higher RAP", ok: true  },
      { t: "Cardiac function curve shifts leftward as though inotropy had been added, with a new intersection at higher CO and lower RAP",   ok: false },
      { t: "Both the venous return curve and the cardiac function curve flatten toward the x-axis and overall cardiac output falls steeply", ok: false },
      { t: "The two curves separate and fail to intersect at any point, so cardiac output cannot be graphically determined in this scenario", ok: false },
    ],
    rationale: "Volume loading raises MSFP, shifting the venous return curve rightward. The new intersection with the (unchanged) cardiac function curve is at a higher CO and a slightly higher RAP. Cardiac function curve SHIFTS occur with inotropy (up/left) or failure (down/right). Guyton's graphical analysis is the classical framework for reasoning about fluid resuscitation vs inotropes vs vasopressors.",
    scene: "frank_starling",
    sceneCfg: { label: "VOLUME LOADING — VR SHIFTS RIGHT", shift: 'normal' },
    metadata: { topic: "CO-VR Curves", priority: "high" },
  },

  {
    id: "patho-n10-009",
    type: "mcq",
    prompt: "In compensated heart failure, Guyton notes that long-term CO often becomes normal or near-normal despite a weakened heart. What compensation makes this possible?",
    setup: "",
    ans: [
      { t: "Na⁺ and water retention raise MSFP and shift the venous return curve rightward, restoring CO along a flatter cardiac function curve", ok: true  },
      { t: "Chronic positive inotropic response from persistent baseline sympathetic tone alone fully restores cardiac contractility and output",   ok: false },
      { t: "Decreased systemic vascular resistance from chronic hypoperfusion reduces afterload enough to fully normalize cardiac output over time", ok: false },
      { t: "Chronic pulmonary vasoconstriction increases right-sided preload, which drives left-sided cardiac output back toward normal baseline",    ok: false },
    ],
    rationale: "Moderate fluid retention is Guyton's central explanation for compensated HF: RAAS-driven sodium and water retention shifts the venous return curve to the right (higher MSFP), restoring CO toward normal at a higher right atrial pressure. The cost is elevated filling pressures, predisposing to pulmonary or peripheral edema when retention is excessive.",
    scene: "frank_starling",
    sceneCfg: { label: "COMPENSATED HF — ↑MSFP RESCUES CO", shift: 'failure' },
    metadata: { topic: "Compensated HF", priority: "high" },
  },

  {
    id: "patho-n10-010",
    type: "short",
    prompt: "Name the renal segment whose afferent arteriole contains juxtaglomerular cells that secrete renin in response to reduced perfusion pressure.",
    setup: "",
    acceptedAnswers: [
      "afferent arteriole", "afferent", "juxtaglomerular apparatus", "JGA",
      "afferent arteriole (JGA)", "juxtaglomerular apparatus (JGA)",
    ],
    canonicalAnswer: "Afferent arteriole (JGA)",
    rationale: "Modified smooth muscle cells in the afferent arteriole of the juxtaglomerular apparatus release renin when (1) renal perfusion pressure falls, (2) macula densa senses low Cl⁻ delivery, or (3) β₁ sympathetic stimulation activates them. This triggers the RAAS cascade.",
    scene: "nephron_flow",
    sceneCfg: { label: "JGA — RENIN RELEASE", highlight: 'pct' },
    metadata: { topic: "JGA Anatomy", priority: "medium" },
  },

  {
    id: "patho-n10-011",
    type: "mcq",
    prompt: "In the renal function curve, what maneuver causes a long-term increase in equilibrium arterial pressure?",
    setup: "",
    ans: [
      { t: "Any rightward shift of the renal function curve — renal artery stenosis, ↑ renal sympathetic tone, chronic Ang II, or reduced nephron number", ok: true  },
      { t: "Chronic administration of a β-blocker, which reduces renin release and lowers long-term equilibrium arterial pressure through RAAS suppression", ok: false },
      { t: "Chronic dietary sodium restriction, which shifts the renal function curve leftward and lowers long-term equilibrium arterial pressure over time",  ok: false },
      { t: "Chronic administration of a loop or thiazide diuretic, which reduces ECFV and shifts the curve leftward to a lower long-term equilibrium pressure", ok: false },
    ],
    rationale: "Guyton's bold claim: long-term BP can only be raised by a RIGHTWARD shift of the renal function curve. Any intervention that forces the kidneys to equilibrate at a higher pressure (reduced nephron number, renal artery stenosis, excess Ang II, primary hyperaldosteronism) causes sustained hypertension. β-blockers, diuretics, and sodium restriction all SHIFT the curve LEFTWARD and lower equilibrium pressure.",
    scene: "nephron_flow",
    sceneCfg: { label: "RENAL FUNCTION CURVE — EQUILIBRIUM BP", highlight: 'pct' },
    metadata: { topic: "Hypertension Mechanisms", priority: "high" },
  },

  {
    id: "patho-n10-012",
    type: "mcq",
    prompt: "Which hormone provides a COUNTER-regulatory signal during volume expansion, promoting Na⁺ excretion?",
    setup: "",
    ans: [
      { t: "Atrial natriuretic peptide (ANP) released from atrial myocytes in response to atrial wall stretch", ok: true  },
      { t: "Aldosterone released from the adrenal zona glomerulosa in response to Ang II and hyperkalemia",      ok: false },
      { t: "Angiotensin II generated by ACE during lung transit, acting on systemic AT1 receptors globally",     ok: false },
      { t: "Renin released from renal juxtaglomerular cells in response to low perfusion pressure or macula densa", ok: false },
    ],
    rationale: "ANP is released from atrial myocytes when they are stretched by volume overload. It dilates afferent arterioles, raises GFR, and directly inhibits sodium reabsorption in the collecting duct, promoting natriuresis. BNP (B-type natriuretic peptide) is a ventricular analog — elevated in heart failure and used clinically as a diagnostic marker.",
    scene: "nephron_flow",
    sceneCfg: { label: "ANP — NATRIURETIC COUNTER-REG", highlight: 'cd' },
    metadata: { topic: "ANP/BNP", priority: "high" },
  },

];

export const PATHO_NODE10_METADATA = {
  nodeId:   "patho-node-10",
  courseId: "adv-phys-path-1",
  chapter:  "Chapters 19–20",
  title:    "Renal BP Control & Cardiac Output",
  totalQuestions: PATHO_NODE10_QUESTIONS.length,
  questionTypes: {
    mcq:   PATHO_NODE10_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: PATHO_NODE10_QUESTIONS.filter(q => q.type === 'multi').length,
    short: PATHO_NODE10_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
