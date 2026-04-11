/**
 * Advanced Physiology & Pathophysiology — Node 1
 * Chapters 1–2: Functional Organization of the Human Body / The Cell and Its Functions
 * Source: Guyton & Hall 14e (local extracted text)
 */

export const PATHO_NODE1_QUESTIONS = [

  {
    id: "patho-n1-001",
    type: "mcq",
    prompt: "Arterial baroreceptors respond to a drop in MAP by increasing sympathetic outflow, raising heart rate and SVR until pressure returns to baseline. What type of control system is this?",
    setup: "",
    ans: [
      { t: "Negative feedback",  ok: true  },
      { t: "Positive feedback",  ok: false },
      { t: "Feed-forward control", ok: false },
      { t: "Open-loop control",  ok: false },
    ],
    rationale: "Negative feedback counteracts a disturbance to return a variable toward its set point. Baroreflex control of MAP is Guyton's canonical example. Positive feedback amplifies change (e.g., uterine contraction, Na⁺ spike upstroke), which is uncommon and usually pathologic.",
    scene: "feedback_loop",
    sceneCfg: {
      label: "BAROREFLEX — NEGATIVE FEEDBACK",
      kind: "negative",
    },
    metadata: { topic: "Homeostasis", priority: "high" },
  },

  {
    id: "patho-n1-002",
    type: "mcq",
    prompt: "A patient's MAP was 90 mmHg, dropped to 60 mmHg after hemorrhage, and homeostatic mechanisms brought it back to 84 mmHg. What is the feedback gain of the compensatory system?",
    setup: "",
    ans: [
      { t: "Gain = 4 (correction 24 / remaining error 6)", ok: true  },
      { t: "Gain = 0.25",                                   ok: false },
      { t: "Gain = 24",                                     ok: false },
      { t: "Gain = 30",                                     ok: false },
    ],
    rationale: "Feedback Gain = correction / remaining error. Correction = 24 mmHg (from 60 back to 84), remaining error = 6 mmHg (from 84 vs 90 set point). 24 / 6 = 4. Higher gain means a more effective homeostatic system.",
    scene: "feedback_loop",
    sceneCfg: { label: "FEEDBACK GAIN = correction ÷ error", kind: "negative" },
    metadata: { topic: "Feedback Gain", priority: "high" },
  },

  {
    id: "patho-n1-003",
    type: "multi",
    prompt: "Select the TWO processes in the body that rely on physiologic positive feedback rather than negative feedback:",
    setup: "",
    choices: [
      "Uterine contractions during labor",
      "Arterial baroreflex",
      "Action potential upstroke (voltage-gated Na⁺ channel activation)",
      "Thermoregulation in cold exposure",
      "Blood glucose regulation",
    ],
    correctAnswers: [
      "Uterine contractions during labor",
      "Action potential upstroke (voltage-gated Na⁺ channel activation)",
    ],
    selectCount: 2,
    rationale: "Guyton lists uterine contraction (oxytocin surge) and neuronal action potential upstroke as rare examples where positive feedback is beneficial — each amplifies an initial change because rapid commitment is required. All other listed items are negative-feedback loops.",
    scene: "feedback_loop",
    sceneCfg: { label: "POSITIVE FEEDBACK — rare but real", kind: "positive" },
    metadata: { topic: "Feedback Types", priority: "medium" },
  },

  {
    id: "patho-n1-004",
    type: "mcq",
    prompt: "Which tissue is MOST vulnerable to disrupted oxygen homeostasis, beginning irreversible damage fastest after a perfusion interruption?",
    setup: "",
    ans: [
      { t: "Cerebral neurons (3–5 min)",          ok: true  },
      { t: "Hepatocytes (15–20 min)",             ok: false },
      { t: "Skeletal myocytes (~1 hr)",           ok: false },
      { t: "Bone osteocytes (many hours)",        ok: false },
    ],
    rationale: "Guyton notes cerebral neurons begin dying after 3–5 min of ischemia; cardiomyocytes suffer permanent damage within 20–30 min; liver cells within 15–20 min; skeletal muscle within about an hour; bone cells survive many hours. This ordering drives clinical priorities during resuscitation.",
    scene: "patient",
    sceneCfg: { label: "TISSUE O₂ TOLERANCE", hotspots: [{ x: 0, y: -120, r: 22, label: "Brain 3–5 min" }] },
    metadata: { topic: "Oxygen Homeostasis", priority: "high" },
  },

  {
    id: "patho-n1-005",
    type: "mcq",
    prompt: "What is the dominant component of a cell by mass?",
    setup: "",
    ans: [
      { t: "Water (70–85%)",         ok: true  },
      { t: "Proteins (10–20%)",      ok: false },
      { t: "Lipids (2–95%)",         ok: false },
      { t: "Carbohydrates (1–6%)",   ok: false },
    ],
    rationale: "Guyton chapter 2 states cell composition is approximately 70–85% water, 10–20% protein, 2–95% lipid (wide range depending on cell type, e.g., adipocytes), and 1–6% carbohydrate. Water is by far the dominant constituent of all cells.",
    scene: null,
    metadata: { topic: "Cell Composition", priority: "medium" },
  },

  {
    id: "patho-n1-006",
    type: "mcq",
    prompt: "Which membrane molecule generally DECREASES plasma-membrane fluidity and permeability while increasing flexibility and stability?",
    setup: "",
    ans: [
      { t: "Cholesterol",             ok: true  },
      { t: "Phosphatidylcholine",     ok: false },
      { t: "Glycoprotein (glycocalyx)", ok: false },
      { t: "Integral channel protein", ok: false },
    ],
    rationale: "Cholesterol intercalates between phospholipid tails. In most membranes it decreases fluidity and permeability to small water-soluble molecules while simultaneously increasing mechanical flexibility and stability — a dual stabilizing role emphasized by Guyton.",
    scene: "cell_membrane",
    sceneCfg: {
      label: "LIPID BILAYER — cholesterol modulates fluidity",
      channels: [{ kind: 'k', label: 'K⁺' }, { kind: 'na', label: 'Na⁺' }],
    },
    metadata: { topic: "Membrane Structure", priority: "high" },
  },

  {
    id: "patho-n1-007",
    type: "multi",
    prompt: "Select the THREE functions Guyton attributes to the negatively charged glycocalyx on the cell exterior:",
    setup: "",
    choices: [
      "Repels other negatively charged molecules",
      "Participates in cell–cell attachment and recognition",
      "Plays a role in immune reactions",
      "Serves as the primary source of cellular ATP",
      "Provides the principal structural barrier to water",
    ],
    correctAnswers: [
      "Repels other negatively charged molecules",
      "Participates in cell–cell attachment and recognition",
      "Plays a role in immune reactions",
    ],
    selectCount: 3,
    rationale: "The glycocalyx (glycolipids + glycoproteins + proteoglycans) carries net negative charge: it repels anions, mediates cell–cell adhesion/recognition, and participates in immune signaling. ATP production is mitochondrial; the water barrier is the phospholipid bilayer itself.",
    scene: "cell_membrane",
    sceneCfg: { label: "GLYCOCALYX", channels: [{ kind: 'aquaporin' }] },
    metadata: { topic: "Glycocalyx", priority: "medium" },
  },

  {
    id: "patho-n1-008",
    type: "mcq",
    prompt: "Which organelle contains the acid hydrolases that digest intracellular debris and fused phagocytotic vesicles?",
    setup: "",
    ans: [
      { t: "Lysosome",            ok: true  },
      { t: "Peroxisome",          ok: false },
      { t: "Smooth ER",           ok: false },
      { t: "Mitochondrion",       ok: false },
    ],
    rationale: "Lysosomes bud from the Golgi and carry acid hydrolases (phosphatases, nucleases, proteases, lipases, lysozymes). In lysosomal storage diseases (Tay-Sachs, I-cell), one or more hydrolases are absent or mis-sorted and substrate accumulates inside engorged lysosomes.",
    scene: null,
    metadata: { topic: "Organelles", priority: "medium" },
  },

  {
    id: "patho-n1-009",
    type: "mcq",
    prompt: "Under physiologic conditions, what is the approximate maximum ATP yield from complete oxidation of one glucose molecule, per Guyton?",
    setup: "",
    ans: [
      { t: "~38 ATP",          ok: true  },
      { t: "2 ATP",            ok: false },
      { t: "~12 ATP",          ok: false },
      { t: "~100 ATP",         ok: false },
    ],
    rationale: "Guyton chapter 2 states a maximum of 38 ATP per glucose molecule is formed when glucose is fully oxidized (glycolysis + Krebs + oxidative phosphorylation), with anaerobic glycolysis alone yielding only 2 ATP. The cellular ΔG of ATP hydrolysis is about −12 kcal/mol because [ATP] is roughly 10× [ADP].",
    scene: null,
    metadata: { topic: "Bioenergetics", priority: "medium" },
  },

  {
    id: "patho-n1-010",
    type: "short",
    prompt: "Name the structural and functional unit of skeletal muscle that sits between two Z-lines.",
    setup: "",
    acceptedAnswers: ["sarcomere", "the sarcomere"],
    canonicalAnswer: "Sarcomere",
    rationale: "The sarcomere spans Z-line to Z-line. It contains the A band (thick myosin overlapping thin actin) flanked by I bands (thin actin only). Sliding-filament contraction shortens the I band and the H zone but not the A band itself.",
    scene: "sarcomere",
    sceneCfg: { label: "SARCOMERE", state: 'cycle' },
    metadata: { topic: "Cytoskeleton", priority: "medium" },
  },

  {
    id: "patho-n1-011",
    type: "mcq",
    prompt: "A patient has a baseline MAP of 100 mmHg. A hypotensive challenge drops it to 40 mmHg, and compensation restores it to only 55 mmHg. Compared to a healthy person whose baroreflex would have a gain of ~2, what does this tell you?",
    setup: "Correction = 15 mmHg, remaining error = 45 mmHg.",
    ans: [
      { t: "Gain ≈ 0.33 — severely impaired baroreflex/homeostatic response", ok: true  },
      { t: "Gain ≈ 3 — supraphysiologic response",                           ok: false },
      { t: "Gain ≈ 1 — normal response",                                      ok: false },
      { t: "Gain cannot be calculated from these numbers",                    ok: false },
    ],
    rationale: "Gain = correction ÷ remaining error = 15/45 = 0.33. A healthy baroreflex has gain around 2, so this patient's loop is markedly impaired — seen clinically in autonomic failure, long-standing diabetes, beta-blockade, or spinal cord injury.",
    scene: "feedback_loop",
    sceneCfg: { label: "IMPAIRED FEEDBACK GAIN", kind: "negative" },
    metadata: { topic: "Feedback Gain", priority: "high" },
  },

  {
    id: "patho-n1-012",
    type: "mcq",
    prompt: "Which process fundamentally distinguishes physiology from pathophysiology?",
    setup: "",
    ans: [
      { t: "Pathophysiology studies disordered body function and the effects of disease", ok: true },
      { t: "Physiology requires dissection; pathophysiology does not",                     ok: false },
      { t: "Pathophysiology focuses only on cellular mechanisms",                           ok: false },
      { t: "Physiology only applies to the healthy organism at rest",                       ok: false },
    ],
    rationale: "Physiology is the science of normal function; pathophysiology is the study of disordered function and disease effects — the basis for clinical medicine. Guyton opens Unit 1 with this distinction because CRNA practice constantly moves between the two.",
    scene: null,
    metadata: { topic: "Scope", priority: "low" },
  },

];

export const PATHO_NODE1_METADATA = {
  nodeId:   "patho-node-1",
  courseId: "adv-phys-path-1",
  chapter:  "Chapters 1–2",
  title:    "Organization of the Human Body & The Cell",
  totalQuestions: PATHO_NODE1_QUESTIONS.length,
  questionTypes: {
    mcq:   PATHO_NODE1_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: PATHO_NODE1_QUESTIONS.filter(q => q.type === 'multi').length,
    short: PATHO_NODE1_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
