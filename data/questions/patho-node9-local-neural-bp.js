/**
 * Advanced Physiology & Pathophysiology — Node 9
 * Chapters 17–18: Local & Humoral Control of Blood Flow / Nervous Regulation of ABP
 * Source: Guyton & Hall 14e (local extracted text)
 */

export const PATHO_NODE9_QUESTIONS = [

  {
    id: "patho-n9-001",
    type: "mcq",
    prompt: "AUTOREGULATION of blood flow refers to the ability of a tissue to maintain relatively constant perfusion over a range of arterial pressures. Which two theories explain this phenomenon?",
    setup: "",
    ans: [
      { t: "Metabolic theory (vasodilators accumulate when flow falls) and myogenic theory (arteriolar smooth muscle stretches and contracts in response to increased transmural pressure)", ok: true  },
      { t: "Baroreflex theory and chemoreflex theory",                                                                                                                                      ok: false },
      { t: "Sympathetic tone and parasympathetic withdrawal",                                                                                                                                 ok: false },
      { t: "NO release and prostaglandin release",                                                                                                                                             ok: false },
    ],
    rationale: "The metabolic theory: when arterial pressure falls, tissue O₂ delivery falls, vasodilators (adenosine, CO₂, H⁺, lactate, K⁺) accumulate, and arterioles dilate to restore flow. The myogenic theory: increased transmural pressure stretches arteriolar smooth muscle, triggering reflex contraction (and vice versa). Both mechanisms operate simultaneously. Specialized tissues (kidney) add tubuloglomerular feedback; brain autoregulates primarily via CO₂/H⁺.",
    scene: "feedback_loop",
    sceneCfg: {
      label: "AUTOREGULATION — METABOLIC + MYOGENIC",
      kind: 'negative',
      nodes: [
        { id: 'stim', label: '↓ pressure', x: 140, y: 170 },
        { id: 'sens', label: 'vasodilators\naccumulate', x: 360, y: 170 },
        { id: 'ctrl', label: 'arteriole\ndilates', x: 580, y: 170 },
        { id: 'eff',  label: 'flow\nrestored', x: 780, y: 170 },
      ],
    },
    metadata: { topic: "Autoregulation", priority: "high" },
  },

  {
    id: "patho-n9-002",
    type: "mcq",
    prompt: "Which vasodilator is Guyton's chief candidate for mediating coronary blood flow coupling to myocardial metabolic demand?",
    setup: "",
    ans: [
      { t: "Adenosine (from ATP breakdown when local O₂ falls)",   ok: true  },
      { t: "Histamine",                                             ok: false },
      { t: "Bradykinin",                                             ok: false },
      { t: "Prostacyclin from endothelium",                           ok: false },
    ],
    rationale: "When cardiac O₂ supply lags demand, ATP is degraded to AMP and then to adenosine. Adenosine diffuses into the interstitium and acts on A2 receptors in coronary smooth muscle to dilate coronary arterioles, restoring O₂ supply. Because the heart extracts ~70% of arterial O₂ at rest, it can't compensate by extracting more — it MUST dilate. This is why adenosine is used as a pharmacologic coronary 'stress agent' and for AV nodal reentry termination.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "ADENOSINE — CORONARY AUTOREGULATION", radius: 60, wall: 12 },
    metadata: { topic: "Coronary Autoregulation", priority: "high" },
  },

  {
    id: "patho-n9-003",
    type: "mcq",
    prompt: "At rest, cardiac muscle extracts approximately what percentage of the oxygen delivered in coronary arterial blood?",
    setup: "",
    ans: [
      { t: "~70% — far higher than most other tissues", ok: true  },
      { t: "~25%",                                       ok: false },
      { t: "~5%",                                        ok: false },
      { t: "~100%",                                      ok: false },
    ],
    rationale: "Guyton: cardiac muscle extracts ~70% of arterial O₂ at rest, compared to ~25% for most tissues. Because extraction is already near-maximal, any increase in myocardial O₂ demand MUST be met by increasing coronary flow. This is why coronary artery disease is so dangerous: demand goes up during exercise but a stenotic vessel can't deliver.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "70% O₂ EXTRACTION AT REST", radius: 65, wall: 12 },
    metadata: { topic: "Coronary O₂ Extraction", priority: "high" },
  },

  {
    id: "patho-n9-004",
    type: "mcq",
    prompt: "The vasomotor center (VMC) is located in which part of the brainstem?",
    setup: "",
    ans: [
      { t: "Bilaterally in the reticular substance of the medulla and lower third of the pons", ok: true  },
      { t: "Cerebellar vermis",                                                                  ok: false },
      { t: "Hypothalamus anterior nucleus",                                                       ok: false },
      { t: "Posterior pituitary gland",                                                            ok: false },
    ],
    rationale: "The VMC sits bilaterally in the reticular substance of the medulla and lower pons. It has three functional areas: a vasoconstrictor area (tonically active, sympathetic outflow to vessels), a vasodilator area (inhibits the vasoconstrictor area), and a sensory area (receives baroreceptor and chemoreceptor afferents via the nucleus tractus solitarius).",
    scene: "feedback_loop",
    sceneCfg: { label: "VMC — MEDULLA / LOWER PONS", kind: 'negative' },
    metadata: { topic: "Vasomotor Center", priority: "medium" },
  },

  {
    id: "patho-n9-005",
    type: "mcq",
    prompt: "Guyton's 'Arterial Pressure = Cardiac Output × Total Peripheral Resistance' equation suggests that a drug that constricts arterioles everywhere will:",
    setup: "",
    ans: [
      { t: "Raise arterial pressure primarily by increasing SVR — but also slightly by increasing venous return and CO through venous constriction", ok: true  },
      { t: "Lower arterial pressure by reducing cardiac output",                                                                                       ok: false },
      { t: "Have no effect on blood pressure",                                                                                                           ok: false },
      { t: "Only affect capillary pressure",                                                                                                              ok: false },
    ],
    rationale: "The fundamental equation MAP = CO × SVR. Pure arteriolar constriction raises MAP directly via SVR and can also raise venous return by squeezing venous capacitance. This is why vasopressors like phenylephrine (pure α₁) and vasopressin raise pressure even without inotropy. The flip side: vasodilators lower pressure by reducing SVR.",
    scene: "feedback_loop",
    sceneCfg: { label: "MAP = CO × SVR", kind: 'negative' },
    metadata: { topic: "Pressure Control", priority: "high" },
  },

  {
    id: "patho-n9-006",
    type: "multi",
    prompt: "Select the THREE neurotransmitter/receptor effects Guyton ascribes to SYMPATHETIC control of the circulation:",
    setup: "",
    choices: [
      "Norepinephrine on vascular α₁ receptors → vasoconstriction",
      "Epinephrine on β₂ receptors in skeletal muscle vasculature → vasodilation",
      "Norepinephrine on cardiac β₁ receptors → ↑ HR and contractility",
      "Acetylcholine on cardiac M₂ receptors → ↓ HR (sympathetic pathway)",
      "Dopamine on gastric parietal cells → acid secretion (sympathetic pathway)",
    ],
    correctAnswers: [
      "Norepinephrine on vascular α₁ receptors → vasoconstriction",
      "Epinephrine on β₂ receptors in skeletal muscle vasculature → vasodilation",
      "Norepinephrine on cardiac β₁ receptors → ↑ HR and contractility",
    ],
    selectCount: 3,
    rationale: "Post-ganglionic sympathetic nerves release norepinephrine onto α₁ (vasoconstriction) and β₁ (cardiac stimulation). Circulating epinephrine from the adrenal medulla also acts on β₂ receptors in skeletal muscle and coronary vasculature, causing vasodilation — the rationale for the 'fight-or-flight' perfusion pattern (constrict skin/gut/kidney, dilate muscle). Cardiac vagal slowing is PARASYMPATHETIC (M₂), not sympathetic.",
    scene: null,
    metadata: { topic: "Autonomic Neurotransmitters", priority: "high" },
  },

  {
    id: "patho-n9-007",
    type: "mcq",
    prompt: "The carotid sinus baroreceptors fire most actively during which phase of arterial pressure?",
    setup: "",
    ans: [
      { t: "Rising systolic pressure — they are STRETCH receptors in the arterial wall", ok: true  },
      { t: "Low diastolic pressure",                                                      ok: false },
      { t: "During the isoelectric line between heart beats",                              ok: false },
      { t: "Only when pressure is chronically elevated",                                    ok: false },
    ],
    rationale: "Baroreceptors are stretch-sensitive mechanoreceptors in the carotid sinus and aortic arch that fire in proportion to arterial wall stretch. They discharge maximally during the systolic upstroke and minimally during diastole. Sustained hypertension RESETS the baroreceptor operating range (a few days), which is why the reflex does not 'cure' chronic hypertension — it's a short-term controller.",
    scene: "feedback_loop",
    sceneCfg: { label: "BAROREFLEX — STRETCH-ACTIVATED", kind: 'negative' },
    metadata: { topic: "Baroreflex", priority: "high" },
  },

  {
    id: "patho-n9-008",
    type: "mcq",
    prompt: "Under Guyton's description of CNS ischemic response, when does it activate and why is it 'the most powerful of all sympathetic vasoconstrictor responses'?",
    setup: "",
    ans: [
      { t: "When MAP falls below ~50 mmHg — brainstem hypoperfusion directly stimulates the vasomotor center, producing maximal sympathetic outflow", ok: true  },
      { t: "When MAP exceeds 200 mmHg — cerebral edema activates the reflex",                                                                           ok: false },
      { t: "When blood pH falls below 7.2",                                                                                                               ok: false },
      { t: "When arterial PaO₂ rises above 150 mmHg",                                                                                                     ok: false },
    ],
    rationale: "CNS ischemic response is a last-ditch reflex: when MAP drops below ~50 mmHg, the brainstem itself becomes hypoperfused, and VMC neurons depolarize from local CO₂/H⁺ accumulation, triggering massive sympathetic outflow. The result is profound vasoconstriction and a short-term MAP rescue — called the 'last-ditch stand' by Guyton. At MAPs below ~20 mmHg, the response fails as neurons die.",
    scene: "feedback_loop",
    sceneCfg: { label: "CNS ISCHEMIC RESPONSE — MAP <50", kind: 'negative' },
    metadata: { topic: "CNS Ischemic Response", priority: "medium" },
  },

  {
    id: "patho-n9-009",
    type: "short",
    prompt: "What is the primary neurotransmitter released by post-ganglionic sympathetic fibers onto vascular smooth muscle?",
    setup: "",
    acceptedAnswers: [
      "norepinephrine", "noradrenaline", "NE", "NA", "norepinephrine (NE)",
      "noradrenaline (NA)",
    ],
    canonicalAnswer: "Norepinephrine",
    rationale: "Norepinephrine is the post-ganglionic sympathetic transmitter at vascular α₁ receptors, producing constriction. The notable exceptions are sweat glands (ACh-mediated cholinergic sympathetic fibers) and the adrenal medulla (which directly secretes epinephrine into the blood).",
    scene: null,
    metadata: { topic: "Autonomic Neurotransmitters", priority: "medium" },
  },

  {
    id: "patho-n9-010",
    type: "mcq",
    prompt: "Which tissues are LEAST vasoconstricted by sympathetic outflow and thus preserve flow during hemorrhagic compensation?",
    setup: "",
    ans: [
      { t: "Brain and heart — poor sympathetic vasoconstrictor innervation preserves perfusion during sympathetic storm", ok: true  },
      { t: "Kidneys and gut",                                                                                             ok: false },
      { t: "Skin and skeletal muscle",                                                                                      ok: false },
      { t: "Liver and spleen",                                                                                                ok: false },
    ],
    rationale: "Sympathetic vasoconstrictor tone is strong in skin, gut, spleen, and kidney but very WEAK in the cerebral and coronary circulations. This heterogeneity is a design feature: during hemorrhage, sympathetic discharge redirects blood away from 'expendable' beds and preserves perfusion of heart and brain, the two tissues that can't tolerate any ischemia. This is why cold/clammy/pale skin and oliguria are early signs of compensated shock.",
    scene: "patient",
    sceneCfg: { label: "SPARING OF BRAIN & HEART", heartRate: 130 },
    metadata: { topic: "Shock Compensation", priority: "high" },
  },

  {
    id: "patho-n9-011",
    type: "mcq",
    prompt: "Which of the following causes vasodilation through ENDOTHELIUM-DERIVED NO, distinct from direct smooth muscle mechanisms?",
    setup: "",
    ans: [
      { t: "Acetylcholine acting on endothelial muscarinic receptors (M₃) → eNOS → NO → cGMP → vascular smooth muscle relaxation", ok: true  },
      { t: "Phenylephrine",                                                                                                         ok: false },
      { t: "Norepinephrine at α₁ receptors",                                                                                          ok: false },
      { t: "Angiotensin II",                                                                                                            ok: false },
    ],
    rationale: "Furchgott showed that ACh relaxes isolated vessels ONLY when the endothelium is intact: ACh activates endothelial M₃, raising intracellular Ca²⁺, which activates eNOS. NO then diffuses into adjacent smooth muscle, raising cGMP and relaxing the vessel. Damaged endothelium (atherosclerosis) loses this response — paradoxically causing vasoconstriction to ACh.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "ENDOTHELIUM-DERIVED NO", radius: 62, wall: 10 },
    metadata: { topic: "Endothelial Control", priority: "high" },
  },

  {
    id: "patho-n9-012",
    type: "mcq",
    prompt: "In cerebral circulation, which CHEMICAL stimulus is the most potent local regulator of blood flow?",
    setup: "",
    ans: [
      { t: "PaCO₂ (rising CO₂ → cerebral vasodilation, ~4% change in CBF per mmHg ΔPaCO₂)", ok: true  },
      { t: "PaO₂ (modest effect only at <50 mmHg)",                                            ok: false },
      { t: "Plasma glucose",                                                                    ok: false },
      { t: "Plasma calcium",                                                                    ok: false },
    ],
    rationale: "Cerebral blood flow is exquisitely sensitive to PaCO₂: a 1 mmHg rise in PaCO₂ raises CBF ~4% (through H⁺ mediation on cerebral arterioles). This is the basis for hyperventilation to reduce intracranial pressure in herniation (transient only). Hypocarbia constricts cerebral vessels; hypercarbia dilates them. Modest hypoxia has little effect until PaO₂ falls below ~50 mmHg, at which point CBF rises rapidly.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "CEREBRAL CO₂ REACTIVITY", radius: 58, wall: 12 },
    metadata: { topic: "Cerebral Blood Flow", priority: "high" },
  },

];

export const PATHO_NODE9_METADATA = {
  nodeId:   "patho-node-9",
  courseId: "adv-phys-path-1",
  chapter:  "Chapters 17–18",
  title:    "Local Blood Flow & Nervous Regulation of BP",
  totalQuestions: PATHO_NODE9_QUESTIONS.length,
  questionTypes: {
    mcq:   PATHO_NODE9_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: PATHO_NODE9_QUESTIONS.filter(q => q.type === 'multi').length,
    short: PATHO_NODE9_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
