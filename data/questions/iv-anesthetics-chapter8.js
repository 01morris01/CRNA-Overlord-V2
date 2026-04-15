/**
 * IV ANESTHETICS QUESTION BANK - Chapter 8
 * Course: Basics of Anesthesia
 * Node: node-8
 * Topic: Intravenous Anesthetic Agents
 *
 * Question Types:
 * - mcq:   Multiple choice (single best answer) — ans array of {t, ok}
 * - multi:  Select multiple (choices + correctAnswers + selectCount)
 * - short:  Free response (acceptedAnswers array)
 *
 * Tags: node-8, chapter-8, iv-anesthetics, nbcrna-style
 */

export const IV_ANESTHETICS_QUESTIONS = [

  // ─── CNS / GABA FOUNDATION ───────────────────────────────────────────────────

  {
    id: "n8c8-q001",
    type: "short",
    prompt: "Which primary inhibitory neurotransmitter located in the CNS is considered the most likely site of action for barbiturates and other intravenous anesthetics?",
    setup: "",
    acceptedAnswers: [
      "Gamma-aminobutyric acid", "GABA",
      "gamma aminobutyric acid",
      "gamma-aminobutyric",
      "gamma aminobutyric",
      "gaba neurotransmitter",
      "aminobutyric acid",
    ],
    rationale: "GABA is the principal inhibitory neurotransmitter in the CNS and acts by causing postsynaptic inhibition of excitatory nerves, making it the primary target for IV induction agents.",
    metadata: { topic: "General CNS", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "general-cns", "high-yield", "short-answer"] }
  },

  {
    id: "n8c8-q002",
    type: "mcq",
    prompt: "How many protein subunits structurally form the GABA receptor, and which specific ion channel does this receptor directly control to reduce excitability?",
    setup: "",
    ans: [
      { t: "Five subunits control the inward flux of chloride ions.", ok: true },
      { t: "Four subunits control the inward flux of chloride ions.", ok: false },
      { t: "Five subunits control the inward flux of positive ions.", ok: false },
      { t: "Four subunits control the inward flux of positive ions.", ok: false },
    ],
    rationale: "The GABA receptor is composed of 5 protein subunits that control a chloride ion channel. When activated, the inward flux of chloride hyperpolarizes the cell and reduces excitability.",
    metadata: { topic: "General CNS", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "general-cns", "gaba", "high-yield", "single-choice"] }
  },

  {
    id: "n8c8-q003",
    type: "short",
    prompt: "By what exact mechanism do barbiturates initially enhance the action of GABA at the receptor?",
    setup: "",
    acceptedAnswers: [
      "By decreasing the rate of dissociation", "Decreasing the rate of dissociation",
      "decrease rate of dissociation",
      "decreases the rate of dissociation",
      "decreasing dissociation rate",
      "decrease the dissociation rate",
      "slows dissociation",
      "slowing the rate of dissociation",
      "slows the rate of dissociation",
      "decreased rate of dissociation",
      "slow dissociation rate",
      "decreasing rate of dissociation",
      "decrease dissociation",
      "decreases dissociation",
      "slowing dissociation rate",
    ],
    rationale: "Barbiturates enhance the action of GABA by binding to the receptor and decreasing the rate of dissociation of GABA, which increases the duration that the chloride channel remains open.",
    metadata: { topic: "Barbiturates", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "barbiturates", "gaba", "high-yield", "short-answer"] }
  },

  {
    id: "n8c8-q004",
    type: "short",
    prompt: "Which anatomical system located within the brainstem is directly targeted by most intravenous anesthetics to control consciousness?",
    setup: "",
    acceptedAnswers: [
      "Reticular Activating System", "RAS",
      "reticular activating system",
      "the reticular activating system",
      "reticular activation system",
      "reticular activated system",
      "reticulating activating system",
      "reticular system",
      "ARAS",
      "ascending reticular activating system",
    ],
    rationale: "Most IV anesthetics work on the reticular activating system, which is a polysynaptic network of neurons in the brainstem that relays signals to the thalamus and cerebral cortex to control consciousness.",
    metadata: { topic: "General CNS", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "general-cns", "ras", "high-yield", "short-answer"] }
  },

  {
    id: "n8c8-q005",
    type: "multi",
    prompt: "Select THREE neurotransmitters that are explicitly classified as excitatory within the central nervous system:",
    setup: "",
    choices: [
      "Acetylcholine",
      "Dopamine",
      "Norepinephrine",
      "Serotonin",
      "Gamma-aminobutyric acid",
    ],
    correctAnswers: ["Acetylcholine", "Dopamine", "Norepinephrine"],
    selectCount: 3,
    rationale: "Acetylcholine, dopamine, and norepinephrine are classified as excitatory neurotransmitters, whereas GABA is the principal inhibitory neurotransmitter.",
    metadata: { topic: "General CNS", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "general-cns", "neurotransmitters", "multi-select"] }
  },

  {
    id: "n8c8-q006",
    type: "short",
    prompt: "Where is GABA primarily synthesized and stored before a nerve action potential causes its release?",
    setup: "",
    acceptedAnswers: [
      "Presynaptic axon terminals", "Axon terminals",
      "presynaptic terminals",
      "axon terminal",
      "presynaptic axon terminal",
      "nerve terminals",
      "presynaptic nerve terminals",
      "pre-synaptic axon terminals",
      "presynaptic nerve terminal",
      "axonal terminals",
      "terminal boutons",
    ],
    rationale: "GABA is synthesized and stored directly in the presynaptic axon terminals.",
    metadata: { topic: "General CNS", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "general-cns", "gaba", "short-answer"] }
  },

  {
    id: "n8c8-q007",
    type: "short",
    prompt: "What specific ion is responsible for triggering the release of GABA into the synaptic cleft during a nerve action potential?",
    setup: "",
    acceptedAnswers: [
      "Calcium ions", "Calcium", "Ca2+",
      "calcium ion",
      "Ca++",
      "ca++",
      "calcium 2+",
      "ca 2+",
      "calcium (ca2+)",
      "calcium influx",
    ],
    rationale: "When a nerve action potential occurs, calcium ions cause the release of GABA from the presynaptic vesicles into the synapse.",
    metadata: { topic: "General CNS", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "general-cns", "gaba", "short-answer"] }
  },

  // ─── BARBITURATES ─────────────────────────────────────────────────────────────

  {
    id: "n8c8-q008",
    type: "mcq",
    prompt: "What is the primary reason barbiturates can easily cross lipid membranes to produce their central nervous system effects?",
    setup: "",
    ans: [
      { t: "The drug's pKa value is above the body pH level.", ok: true },
      { t: "The drug's pKa value is below the body pH level.", ok: false },
      { t: "The drug's pKa value equals the body pH level.", ok: false },
      { t: "The drug's pKa value alters the body pH level.", ok: false },
    ],
    rationale: "Because the pKa of barbiturates is above the normal body pH, they pass through lipid membranes very easily.",
    metadata: { topic: "Barbiturates", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "barbiturates", "pharmacokinetics", "single-choice"] }
  },

  {
    id: "n8c8-q009",
    type: "short",
    prompt: "Which route of administration is most commonly utilized for administering barbiturates specifically as a pediatric induction method?",
    setup: "",
    acceptedAnswers: [
      "Intramuscularly and Rectally", "IM and Rectally", "IM and rectal",
      "intramuscular and rectal",
      "IM/rectal",
      "IM and PR",
      "rectal and intramuscular",
      "rectal and IM",
      "PR and IM",
      "rectally and IM",
      "intramuscular rectal",
      "IM rectal",
    ],
    rationale: "While IV administration is the most common route generally, intramuscular and rectal routes are utilized for anesthesia induction in children.",
    metadata: { topic: "Barbiturates", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "barbiturates", "peds", "short-answer"] }
  },

  {
    id: "n8c8-q010",
    type: "mcq",
    prompt: "Why is the initial clinical effect of an induction dose of thiopental rapidly terminated in the patient?",
    setup: "",
    ans: [
      { t: "It is terminated primarily by rapid redistribution.", ok: true },
      { t: "It is terminated primarily by rapid liver metabolism.", ok: false },
      { t: "It is terminated primarily by rapid kidney clearance.", ok: false },
      { t: "It is terminated primarily by rapid blood hydrolysis.", ok: false },
    ],
    rationale: "The initial doses of thiopental are rapidly terminated by redistribution away from the vessel-rich organs into other tissues, which is heavily dependent on cardiac output.",
    metadata: { topic: "Thiopental", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "thiopental", "barbiturates", "high-yield", "single-choice"] }
  },

  {
    id: "n8c8-q011",
    type: "multi",
    prompt: "Select THREE drugs that can cause the precipitation of thiopental if the IV line is not flushed between administrations:",
    setup: "",
    choices: [
      "Rocuronium",
      "Vecuronium",
      "Midazolam",
      "Etomidate",
      "Propofol",
    ],
    correctAnswers: ["Rocuronium", "Vecuronium", "Midazolam"],
    selectCount: 3,
    rationale: "Thiopental is preserved in a highly alkaline solution to prevent precipitation. Administering acidic drugs like rocuronium, vecuronium, atracurium, pancuronium, midazolam, alfentanil, or sufentanil can cause it to precipitate.",
    metadata: { topic: "Thiopental", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "thiopental", "barbiturates", "drug-interactions", "multi-select"] }
  },

  {
    id: "n8c8-q012",
    type: "short",
    prompt: "What specific barbiturate is currently utilized most often for electroconvulsive therapy because it has the least effect on increasing the seizure threshold?",
    setup: "",
    acceptedAnswers: [
      "Methohexital",
      "methohexitol",
      "methohexital sodium",
      "metho hexital",
      "methohexatol",
      "methohexiatal",
      "brevital",
      "Brevital",
    ],
    rationale: "While all barbiturates increase the seizure threshold, methohexital has the least effect on it and can even cause epileptiform seizures at large doses, making it the drug of choice for ECT.",
    metadata: { topic: "Barbiturates", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "barbiturates", "ect", "short-answer"] }
  },

  {
    id: "n8c8-q013",
    type: "short",
    prompt: "What is the specific elimination half-life of the barbiturate methohexital?",
    setup: "",
    acceptedAnswers: [
      "3.9 hours", "3.9 hrs", "3.9",
      "3.9 hour",
      "3.9h",
      "3.9 hr",
      "3.9hours",
    ],
    rationale: "Methohexital has an elimination half-life of 3.9 hours, which is much shorter than thiopental.",
    metadata: { topic: "Barbiturates", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "barbiturates", "methohexital", "short-answer"] }
  },

  {
    id: "n8c8-q014",
    type: "multi",
    prompt: "Select FOUR severe allergic complications that can occur due to histamine release associated with barbiturate administration:",
    setup: "",
    choices: [
      "Hives",
      "Edema",
      "Shock",
      "Bronchospasm",
      "Hypertension",
      "Bradycardia",
    ],
    correctAnswers: ["Hives", "Edema", "Shock", "Bronchospasm"],
    selectCount: 4,
    rationale: "Barbiturates are associated with histamine release, which can lead to urticarial rashes and severe anaphylactic reactions including hives, edema, bronchospasm, and shock.",
    metadata: { topic: "Barbiturates", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "barbiturates", "adverse-effects", "multi-select"] }
  },

  {
    id: "n8c8-q015",
    type: "mcq",
    prompt: "What specific EEG pattern is produced by high, dose-related administration of barbiturates?",
    setup: "",
    ans: [
      { t: "Burst suppression EEG pattern.", ok: true },
      { t: "Theta wave dominant EEG pattern.", ok: false },
      { t: "Delta wave dominant EEG pattern.", ok: false },
      { t: "Gamma wave dominant EEG pattern.", ok: false },
    ],
    rationale: "Dose-related depression of EEG waves by barbiturates can ultimately lead to a burst suppression pattern on the monitor.",
    metadata: { topic: "Barbiturates", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "barbiturates", "eeg", "single-choice"] }
  },

  {
    id: "n8c8-q016",
    type: "short",
    prompt: "How does chronic barbiturate use affect the metabolism of other drugs like muscle relaxants and opioids?",
    setup: "",
    acceptedAnswers: [
      "Increases metabolism; shortens duration", "Increases metabolism", "Shortens duration",
      "increases metabolism and shortens duration",
      "induces metabolism",
      "induces cytochrome p450",
      "P450 induction",
      "enzyme induction",
      "CYP450 induction",
      "cytochrome p450 induction",
      "accelerates metabolism",
      "shortens clinical duration",
      "increased drug metabolism",
    ],
    rationale: "Chronic barbiturate use induces the cytochrome P450 enzyme system, which increases the metabolism of other drugs and shortens their clinical duration of action.",
    metadata: { topic: "Barbiturates", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "barbiturates", "drug-interactions", "short-answer"] }
  },

  {
    id: "n8c8-q017",
    type: "short",
    prompt: "How do extremely high, deep-coma doses of barbiturates distinctly act upon the GABA receptors compared to lower induction doses?",
    setup: "",
    acceptedAnswers: [
      "Directly activate GABA receptors", "Directly activate GABA",
      "directly activates GABA receptors",
      "direct GABA activation",
      "direct activation of GABA receptors",
      "direct activation of GABA",
      "activates GABA receptors",
      "activates GABA directly",
      "activates GABA receptors without GABA",
      "GABA receptor activation without GABA",
    ],
    rationale: "While lower doses simply enhance the binding of existing GABA, higher doses of barbiturates directly activate the GABA receptors even in the absence of GABA, which is responsible for deep barbiturate comas.",
    metadata: { topic: "Barbiturates", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "barbiturates", "gaba", "short-answer"] }
  },

  {
    id: "n8c8-q018",
    type: "multi",
    prompt: "Select TWO patient conditions that will severely increase the free fraction of barbiturates due to altered protein binding:",
    setup: "",
    choices: [
      "Severe liver disease",
      "Profound hypoalbuminemia",
      "Chronic renal failure",
      "Uncontrolled diabetes",
    ],
    correctAnswers: ["Severe liver disease", "Profound hypoalbuminemia"],
    selectCount: 2,
    rationale: "Because barbiturates are highly protein-bound, conditions that lower protein levels, such as severe liver disease or hypoalbuminemia, will significantly alter their distribution and increase their clinical effect.",
    metadata: { topic: "Barbiturates", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "barbiturates", "protein-binding", "multi-select"] }
  },

  {
    id: "n8c8-q019",
    type: "short",
    prompt: "What unusual sensory side effect is frequently reported by patients immediately following a barbiturate injection?",
    setup: "",
    acceptedAnswers: [
      "Garlic or metal taste", "Metal taste", "Garlic taste",
      "metallic taste",
      "garlic metallic taste",
      "metal or garlic taste",
      "metalic taste",
      "garlic or metallic taste",
      "metallic or garlic taste",
      "taste of garlic",
      "taste of metal",
      "garlic taste in mouth",
      "metallic taste in mouth",
    ],
    rationale: "Patients frequently report a distinct garlic or metal taste in their mouth upon intravenous injection of barbiturates.",
    metadata: { topic: "Barbiturates", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "barbiturates", "adverse-effects", "short-answer"] }
  },

  // ─── PROPOFOL ─────────────────────────────────────────────────────────────────

  {
    id: "n8c8-q020",
    type: "mcq",
    prompt: "What is the specific chemical name for the drug propofol?",
    setup: "",
    ans: [
      { t: "2,6-diisopropylphenol.", ok: true },
      { t: "2,4-diisopropylphenol.", ok: false },
      { t: "2,6-dimethylisophenol.", ok: false },
      { t: "2,4-dimethylisophenol.", ok: false },
    ],
    rationale: "Propofol is chemically known as 2,6-diisopropylphenol.",
    metadata: { topic: "Propofol", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "propofol", "single-choice"] }
  },

  {
    id: "n8c8-q021",
    type: "multi",
    prompt: "Select THREE specific ingredients that make up the oil-water emulsion formulation used to deliver propofol:",
    setup: "",
    choices: [
      "Soybean oil",
      "Egg lecithin",
      "Glycerin",
      "Propylene glycol",
      "Normal saline",
    ],
    correctAnswers: ["Soybean oil", "Egg lecithin", "Glycerin"],
    selectCount: 3,
    rationale: "Because propofol is not water-soluble, it is prepared in an oil-water emulsion containing soybean oil, egg lecithin, and glycerin.",
    metadata: { topic: "Propofol", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "propofol", "formulation", "multi-select"] }
  },

  {
    id: "n8c8-q022",
    type: "mcq",
    prompt: "Why is an egg allergy generally not considered an absolute contraindication for administration of propofol?",
    setup: "",
    ans: [
      { t: "It uses yolk lecithin, and allergies are to the whites.", ok: true },
      { t: "It uses white lecithin, and allergies are to the yolks.", ok: false },
      { t: "It uses shell extracts, and allergies are to the yolks.", ok: false },
      { t: "It uses lipid portions, and allergies are to the whites.", ok: false },
    ],
    rationale: "Propofol is formulated with egg lecithin extracted from egg yolk, whereas most egg allergic reactions are triggered by egg whites.",
    metadata: { topic: "Propofol", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "propofol", "clinical-nuance", "single-choice"] }
  },

  {
    id: "n8c8-q023",
    type: "short",
    prompt: "Which three extrahepatic organs account for 40% of the plasma clearance of propofol?",
    setup: "",
    acceptedAnswers: [
      "Kidney, small intestine, and lungs",
      "Kidney small intestine lungs",
      "Kidneys, small intestine, and lungs",
      "lungs kidneys and small intestine",
      "kidneys lungs small intestine",
      "small intestine lungs kidneys",
      "lungs small intestine kidney",
      "kidney lungs small intestine",
      "kidneys and lungs and small intestine",
      "small intestine and lungs and kidneys",
      "lung kidney small intestine",
      "kidney lungs and small intestine",
      "kidney and lungs and small intestine",
      "kidney lungs small intestine",
    ],
    rationale: "The total clearance of propofol exceeds hepatic blood flow, meaning extrahepatic metabolism occurs. The kidney, small intestine, and lungs account for 40% of its clearance.",
    metadata: { topic: "Propofol", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "propofol", "pharmacokinetics", "short-answer"] }
  },

  {
    id: "n8c8-q024",
    type: "short",
    prompt: "Approximately what percentage of a propofol bolus dose is actively eliminated by the lungs via first-pass metabolism?",
    setup: "",
    acceptedAnswers: [
      "30 percent", "30%", "30",
      "thirty percent",
      "30 per cent",
      "30percent",
      "approximately 30 percent",
      "about 30 percent",
    ],
    rationale: "The lungs play a major role in extrahepatic metabolism, accounting for first-pass metabolism of 30% of a propofol bolus dose.",
    metadata: { topic: "Propofol", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "propofol", "pharmacokinetics", "short-answer"] }
  },

  {
    id: "n8c8-q025",
    type: "mcq",
    prompt: "How does the clearance rate of propofol compare directly to the clearance rate of thiopental?",
    setup: "",
    ans: [
      { t: "Exactly ten times higher than thiopental.", ok: true },
      { t: "Exactly two times higher than thiopental.", ok: false },
      { t: "Exactly ten times lower than thiopental.", ok: false },
      { t: "Exactly two times lower than thiopental.", ok: false },
    ],
    rationale: "Propofol has a highly rapid clearance rate that is 10 times that of thiopental, allowing rapid recovery even after continuous infusion.",
    metadata: { topic: "Propofol", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "propofol", "thiopental", "high-yield", "single-choice"] }
  },

  {
    id: "n8c8-q026",
    type: "mcq",
    prompt: "What specific effect does propofol have on cerebral physiology?",
    setup: "",
    ans: [
      { t: "It decreases the cerebral metabolic rate for oxygen.", ok: true },
      { t: "It increases the cerebral metabolic rate for oxygen.", ok: false },
      { t: "It maintains the cerebral metabolic rate for oxygen.", ok: false },
      { t: "It eliminates all cerebral metabolic rate for oxygen.", ok: false },
    ],
    rationale: "Propofol reduces CMRO2, which leads to decreased cerebral blood flow, decreased intracranial pressure, and decreased intraocular pressure.",
    metadata: { topic: "Propofol", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "propofol", "cns-effects", "high-yield", "single-choice"] }
  },

  {
    id: "n8c8-q027",
    type: "short",
    prompt: "By what exact mechanism does propofol decrease a patient's blood pressure?",
    setup: "",
    acceptedAnswers: [
      "Arterial and venous vasodilation", "Vasodilation", "Arterial and venous dilation",
      "vasodilitation",
      "vascular dilation",
      "arterial and venous vasodilitation",
      "venous and arterial vasodilation",
      "arterial venous vasodilation",
      "vasodilates arteries and veins",
      "decreases vascular resistance",
      "venodilation and arterial dilation",
    ],
    rationale: "Propofol decreases blood pressure by causing both arterial and venous vasodilation, which reduces preload and afterload.",
    metadata: { topic: "Propofol", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "propofol", "cardiovascular", "high-yield", "short-answer"] }
  },

  {
    id: "n8c8-q028",
    type: "mcq",
    prompt: "By what exact mechanism does an induction dose of propofol decrease a patient's total minute ventilation?",
    setup: "",
    ans: [
      { t: "It decreases the tidal volume and respiratory rate.", ok: true },
      { t: "It increases the tidal volume and respiratory rate.", ok: false },
      { t: "It halts the resting respiratory system.", ok: false },
      { t: "It paralyzes the diaphragm.", ok: false },
    ],
    rationale: "Propofol decreases minute ventilation by reducing both tidal volume and respiratory rate.",
    metadata: { topic: "Propofol", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "propofol", "respiratory", "single-choice"] }
  },

  {
    id: "n8c8-q029",
    type: "short",
    prompt: "Because propofol lacks preservatives and supports bacterial growth, it must be discarded within how many hours after opening?",
    setup: "",
    acceptedAnswers: [
      "Within 6 hours", "6 hours", "6 hrs",
      "6 hour",
      "six hours",
      "six hour",
      "6 h",
      "6h",
      "discard after 6 hours",
      "6 hours after opening",
    ],
    rationale: "Propofol supports bacterial growth because it lacks preservatives. Sterile technique must be used, and any open vial must be discarded within 6 hours.",
    metadata: { topic: "Propofol", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "propofol", "safety", "short-answer"] }
  },

  {
    id: "n8c8-q030",
    type: "short",
    prompt: "How long is the standard clinical duration of a single induction dose of propofol?",
    setup: "",
    acceptedAnswers: [
      "3 to 8 minutes", "3-8 minutes", "3 to 8 min",
      "3-8 min",
      "3 to 8",
      "3-8",
      "three to eight minutes",
      "3 to 8 mins",
      "3-8 mins",
      "approximately 3 to 8 minutes",
    ],
    rationale: "Because of propofol's rapid distribution and elimination, a standard induction dose only lasts 3 to 8 minutes.",
    metadata: { topic: "Propofol", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "propofol", "pharmacokinetics", "short-answer"] }
  },

  {
    id: "n8c8-q031",
    type: "multi",
    prompt: "Select TWO specific chemical reactions that represent the Phase I and Phase II hepatic biotransformation pathways for propofol:",
    setup: "",
    choices: [
      "Phase I oxidation by cytochrome P450",
      "Phase II glucuronidation",
      "Phase I ester hydrolysis",
      "Phase II Hofmann elimination",
    ],
    correctAnswers: ["Phase I oxidation by cytochrome P450", "Phase II glucuronidation"],
    selectCount: 2,
    rationale: "Propofol undergoes liver metabolism via Phase I oxidation by cytochrome P450 enzymes and Phase II glucuronidation to create inactive metabolites.",
    metadata: { topic: "Propofol", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "propofol", "metabolism", "multi-select"] }
  },

  {
    id: "n8c8-q032",
    type: "short",
    prompt: "Which specific subunit of the GABA receptor is primarily targeted by propofol to produce its clinical effects?",
    setup: "",
    acceptedAnswers: [
      "Beta-1 subunit", "β1 subunit", "Beta 1 subunit",
      "beta-1",
      "beta 1",
      "b1 subunit",
      "beta1 subunit",
      "beta1",
      "B1 subunit",
      "beta one subunit",
      "beta-1 subunit of GABA",
    ],
    rationale: "While benzodiazepines target a different subunit, propofol has its primary effect on the beta-1 subunit of the GABA receptor.",
    metadata: { topic: "Propofol", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "propofol", "gaba", "short-answer"] }
  },

  // ─── BENZODIAZEPINES ──────────────────────────────────────────────────────────

  {
    id: "n8c8-q033",
    type: "short",
    prompt: "What specific chemical structure acts as the foundational component for all benzodiazepine medications utilized in anesthesia?",
    setup: "",
    acceptedAnswers: [
      "A stable benzene ring", "Stable benzene ring", "Benzene ring",
      "benzene",
      "benzo ring",
      "aromatic ring",
      "six carbon ring",
      "6 carbon ring",
      "benzine ring",
      "aromatic benzene ring",
      "six-carbon benzene ring",
    ],
    rationale: "All benzodiazepines contain a stable, six-carbon aromatic benzene ring that is the foundational component of their structure.",
    metadata: { topic: "Benzodiazepines", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "benzodiazepines", "short-answer"] }
  },

  {
    id: "n8c8-q034",
    type: "mcq",
    prompt: "Which benzodiazepine is the least lipid soluble, leading to a delayed onset of action?",
    setup: "",
    ans: [
      { t: "Lorazepam", ok: true },
      { t: "Midazolam", ok: false },
      { t: "Diazepam", ok: false },
      { t: "Etomidate", ok: false },
    ],
    rationale: "Lorazepam is the least lipid-soluble of the benzodiazepines, which is responsible for its delayed onset. Midazolam is more water-soluble.",
    metadata: { topic: "Benzodiazepines", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "benzodiazepines", "single-choice"] }
  },

  {
    id: "n8c8-q035",
    type: "multi",
    prompt: "Select SIX clinical properties shared by all benzodiazepines:",
    setup: "",
    choices: [
      "Hypnotic",
      "Sedative",
      "Anxiolytic",
      "Amnesic",
      "Anticonvulsant",
      "Centrally reduce muscle tone",
      "Direct analgesia",
    ],
    correctAnswers: [
      "Hypnotic",
      "Sedative",
      "Anxiolytic",
      "Amnesic",
      "Anticonvulsant",
      "Centrally reduce muscle tone",
    ],
    selectCount: 6,
    rationale: "All benzodiazepines possess hypnotic, sedative, anxiolytic, amnesic, and anticonvulsant properties, and they centrally reduce muscle tone. They do not provide direct analgesia.",
    metadata: { topic: "Benzodiazepines", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "benzodiazepines", "high-yield", "multi-select"] }
  },

  {
    id: "n8c8-q036",
    type: "mcq",
    prompt: "What are the specific elimination half-lives of diazepam and lorazepam, respectively?",
    setup: "",
    ans: [
      { t: "Diazepam is 30 hours and lorazepam is 15 hours.", ok: true },
      { t: "Diazepam is 15 hours and lorazepam is 30 hours.", ok: false },
      { t: "Diazepam is 10 hours and lorazepam is 20 hours.", ok: false },
      { t: "Diazepam is 20 hours and lorazepam is 10 hours.", ok: false },
    ],
    rationale: "The elimination half-life of diazepam is 30 hours, lorazepam is 15 hours, and midazolam is 2 hours.",
    metadata: { topic: "Benzodiazepines", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "benzodiazepines", "single-choice"] }
  },

  {
    id: "n8c8-q037",
    type: "mcq",
    prompt: "What specific dosing parameter must be used for continuous infusions of benzodiazepines in obese patients?",
    setup: "",
    ans: [
      { t: "Ideal body weight", ok: true },
      { t: "Total body weight", ok: false },
      { t: "Lean body weight", ok: false },
      { t: "Blood volume", ok: false },
    ],
    rationale: "In obesity, the volume of distribution is increased, which increases the elimination half-life. Continuous infusions must be based on ideal body weight.",
    metadata: { topic: "Benzodiazepines", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "benzodiazepines", "dosing", "single-choice"] }
  },

  {
    id: "n8c8-q038",
    type: "multi",
    prompt: "Combining benzodiazepines with opioid medications creates a synergistic effect that markedly increases the risk of which THREE severe side effects?",
    setup: "",
    choices: [
      "Apnea",
      "Decreased blood pressure",
      "Decreased systemic vascular resistance",
      "Extreme pulmonary hypertension",
      "Extreme cardiac contractility",
    ],
    correctAnswers: ["Apnea", "Decreased blood pressure", "Decreased systemic vascular resistance"],
    selectCount: 3,
    rationale: "Benzodiazepines and opioids have synergistic actions. Combining them can markedly decrease blood pressure and systemic vascular resistance and can cause severe apnea.",
    metadata: { topic: "Benzodiazepines", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "benzodiazepines", "opioids", "drug-interactions", "multi-select"] }
  },

  {
    id: "n8c8-q039",
    type: "mcq",
    prompt: "What is the rescue dose of flumazenil for a suspected benzodiazepine overdose?",
    setup: "",
    ans: [
      { t: "0.2 mg every 2 to 10 minutes.", ok: true },
      { t: "0.4 mg every 4 to 10 minutes.", ok: false },
      { t: "0.6 mg every 6 to 10 minutes.", ok: false },
      { t: "0.8 mg every 8 to 10 minutes.", ok: false },
    ],
    rationale: "Flumazenil is a competitive antagonist dosed at 0.2 mg every 2 to 10 minutes up to a maximum of 1 mg.",
    metadata: { topic: "Benzodiazepines", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "benzodiazepines", "reversal", "single-choice"] }
  },

  {
    id: "n8c8-q040",
    type: "mcq",
    prompt: "Which of the following drugs can significantly increase the free fraction of diazepam by directly competing for protein-binding sites?",
    setup: "",
    ans: [
      { t: "Heparin", ok: true },
      { t: "Insulin", ok: false },
      { t: "Lithium", ok: false },
      { t: "Digoxin", ok: false },
    ],
    rationale: "Heparin competes with benzodiazepines for protein-binding sites, which can increase the free fraction of the drug and intensify its effects.",
    metadata: { topic: "Benzodiazepines", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "benzodiazepines", "drug-interactions", "single-choice"] }
  },

  {
    id: "n8c8-q041",
    type: "mcq",
    prompt: "How does the administration of cimetidine affect the clinical pharmacokinetics of benzodiazepines?",
    setup: "",
    ans: [
      { t: "It binds cytochrome P450 to reduce metabolism.", ok: true },
      { t: "It binds cytochrome P450 to increase metabolism.", ok: false },
      { t: "It binds GABA-A to reduce metabolism.", ok: false },
      { t: "It binds GABA-A to increase metabolism.", ok: false },
    ],
    rationale: "Cimetidine binds to the cytochrome P450 enzyme system, which reduces the metabolism of benzodiazepines and prolongs their effects.",
    metadata: { topic: "Benzodiazepines", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "benzodiazepines", "drug-interactions", "single-choice"] }
  },

  // ─── DROPERIDOL ───────────────────────────────────────────────────────────────

  {
    id: "n8c8-q042",
    type: "mcq",
    prompt: "What specific adverse cardiac effect is the reason for the FDA black box warning requiring a 12-lead ECG prior to droperidol administration?",
    setup: "",
    ans: [
      { t: "Doses over 1.25 mg may significantly prolong the QTc interval.", ok: true },
      { t: "Doses over 1.25 mg may significantly shorten the QTc interval.", ok: false },
      { t: "Doses over 1.25 mg may significantly prolong the PR interval.", ok: false },
      { t: "Doses over 1.25 mg may significantly shorten the PR interval.", ok: false },
    ],
    rationale: "Droperidol carries a black box warning because doses greater than 1.25 mg can prolong the QTc interval, potentially causing cardiac arrhythmias, torsades de pointes, and cardiac arrest.",
    metadata: { topic: "Droperidol", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "droperidol", "cardiovascular", "high-yield", "single-choice"] }
  },

  {
    id: "n8c8-q043",
    type: "short",
    prompt: "Why is droperidol contraindicated in patients with Parkinson's disease?",
    setup: "",
    acceptedAnswers: [
      "Due to extrapyramidal effects", "Extrapyramidal effects",
      "EPS",
      "extrapyramidal",
      "extrapyramidal symptoms",
      "extrapyramidal side effects",
      "extra pyramidal effects",
      "extra-pyramidal effects",
      "extrapyrimidal effects",
      "extrapyramidal reactions",
    ],
    rationale: "Because droperidol antagonizes dopamine receptor activation, it causes extrapyramidal effects and is therefore contraindicated in Parkinson's disease.",
    metadata: { topic: "Droperidol", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "droperidol", "contraindications", "short-answer"] }
  },

  {
    id: "n8c8-q044",
    type: "mcq",
    prompt: "To which specific chemical drug class does droperidol belong?",
    setup: "",
    ans: [
      { t: "Butyrophenones", ok: true },
      { t: "Phenothiazines", ok: false },
      { t: "Arylcyclohexylamines", ok: false },
      { t: "Benzodiazepines", ok: false },
    ],
    rationale: "Droperidol is a butyrophenone, which is a derivative of phenothiazines.",
    metadata: { topic: "Droperidol", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "droperidol", "single-choice"] }
  },

  {
    id: "n8c8-q045",
    type: "multi",
    prompt: "In addition to antagonizing dopamine receptors, droperidol specifically interferes with the transmission of which THREE neurotransmitters?",
    setup: "",
    choices: ["Serotonin", "Norepinephrine", "Gamma-aminobutyric acid", "Acetylcholine", "Glutamate"],
    correctAnswers: ["Serotonin", "Norepinephrine", "Gamma-aminobutyric acid"],
    selectCount: 3,
    rationale: "Droperidol interferes with transmission mediated by serotonin, norepinephrine, and GABA.",
    metadata: { topic: "Droperidol", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "droperidol", "neurotransmitters", "multi-select"] }
  },

  {
    id: "n8c8-q046",
    type: "short",
    prompt: "Droperidol acts as a powerful antiemetic by inhibiting dopamine-2 receptors in what specific anatomical region?",
    setup: "",
    acceptedAnswers: [
      "Chemoreceptor trigger zone", "CTZ",
      "chemo receptor trigger zone",
      "chemoreceptor trigger",
      "chemoreceptor zone",
      "chemo trigger zone",
      "CTZ in medulla",
      "chemoreceptor trigger zone medulla",
      "chemo receptor zone",
      "chemoreceptor triggger zone",
    ],
    rationale: "Droperidol is a powerful antiemetic because it inhibits dopamine-2 receptors in the chemoreceptor trigger zone located in the medulla.",
    metadata: { topic: "Droperidol", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "droperidol", "antiemetic", "short-answer"] }
  },

  // ─── KETAMINE ─────────────────────────────────────────────────────────────────

  {
    id: "n8c8-q047",
    type: "mcq",
    prompt: "To which specific chemical class does ketamine belong, making it a direct relative of phencyclidine?",
    setup: "",
    ans: [
      { t: "Arylcyclohexylamines", ok: true },
      { t: "Butyrophenones", ok: false },
      { t: "Phenothiazines", ok: false },
      { t: "Benzodiazepines", ok: false },
    ],
    rationale: "Ketamine is an arylcyclohexylamine and is a relative of phencyclidine.",
    metadata: { topic: "Ketamine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "ketamine", "single-choice"] }
  },

  {
    id: "n8c8-q048",
    type: "short",
    prompt: "What specific receptor is primarily antagonized by ketamine to produce its clinical effects?",
    setup: "",
    acceptedAnswers: [
      "N-methyl-D-aspartate", "NMDA", "NMDA receptor",
      "N methyl D aspartate",
      "n-methyl d-aspartate",
      "nmda receptors",
      "n methyl aspartate",
      "N-methylaspartate",
      "NMDA channel",
      "nmda glutamate receptor",
    ],
    rationale: "Ketamine works primarily through antagonism of N-methyl-D-aspartate receptors.",
    metadata: { topic: "Ketamine", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "ketamine", "mechanism", "high-yield", "short-answer"] }
  },

  {
    id: "n8c8-q049",
    type: "mcq",
    prompt: "Which brain structures are disconnected from one another by ketamine to produce dissociative anesthesia?",
    setup: "",
    ans: [
      { t: "Thalamus from the limbic cortex.", ok: true },
      { t: "Thalamus from the motor cortex.", ok: false },
      { t: "Brainstem from the limbic lobes.", ok: false },
      { t: "Brainstem from the motor tracts.", ok: false },
    ],
    rationale: "Ketamine produces dissociative anesthesia by dissociating the thalamus from the limbic cortex without depressing the reticular activating system.",
    metadata: { topic: "Ketamine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "ketamine", "mechanism", "single-choice"] }
  },

  {
    id: "n8c8-q050",
    type: "multi",
    prompt: "Select THREE characteristic clinical presentations of a patient under ketamine dissociative anesthesia:",
    setup: "",
    choices: [
      "Unresponsive to verbal commands",
      "Spontaneous respirations remain intact",
      "Involuntary movement of the limbs",
      "Profound flaccid muscle paralysis",
      "Complete closure of the eyelids",
    ],
    correctAnswers: [
      "Unresponsive to verbal commands",
      "Spontaneous respirations remain intact",
      "Involuntary movement of the limbs",
    ],
    selectCount: 3,
    rationale: "Patients under ketamine may appear conscious but are unresponsive to commands, maintain spontaneous respirations, and often move their limbs involuntarily.",
    metadata: { topic: "Ketamine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "ketamine", "clinical-effects", "multi-select"] }
  },

  {
    id: "n8c8-q051",
    type: "mcq",
    prompt: "What is the standard intravenous induction dose of ketamine?",
    setup: "",
    ans: [
      { t: "1 to 2 mg/kg", ok: true },
      { t: "3 to 4 mg/kg", ok: false },
      { t: "4 to 6 mg/kg", ok: false },
      { t: "6 to 8 mg/kg", ok: false },
    ],
    rationale: "The standard IV induction dose for ketamine is 1 to 2 mg/kg.",
    metadata: { topic: "Ketamine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "ketamine", "dosing", "single-choice"] }
  },

  {
    id: "n8c8-q052",
    type: "mcq",
    prompt: "What is the recommended intramuscular dart dose of ketamine used for a combative patient?",
    setup: "",
    ans: [
      { t: "4 to 6 mg/kg", ok: true },
      { t: "1 to 2 mg/kg", ok: false },
      { t: "6 to 8 mg/kg", ok: false },
      { t: "2 to 4 mg/kg", ok: false },
    ],
    rationale: "The recommended IM dart dose for a combative patient is 4 to 6 mg/kg.",
    metadata: { topic: "Ketamine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "ketamine", "dosing", "single-choice"] }
  },

  {
    id: "n8c8-q053",
    type: "short",
    prompt: "By what exact mechanism does ketamine produce its prominent cardiovascular stimulation?",
    setup: "",
    acceptedAnswers: [
      "Sympathetic stimulation; inhibits norepinephrine reuptake",
      "Sympathetic stimulation and norepinephrine reuptake inhibition",
      "Inhibits norepinephrine reuptake",
      "sympathetic stimulation",
      "sympathomimetic",
      "norepinephrine reuptake inhibition",
      "NE reuptake inhibition",
      "inhibits NE reuptake",
      "sympathetic nervous system stimulation",
      "blocks norepinephrine reuptake",
      "sympathetic stimulation and NE reuptake inhibition",
      "stimulates sympathetic nervous system",
      "SNS stimulation",
    ],
    rationale: "Ketamine stimulates the sympathetic nervous system and inhibits norepinephrine reuptake, leading to increased blood pressure, heart rate, and cardiac output.",
    metadata: { topic: "Ketamine", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "ketamine", "cardiovascular", "high-yield", "short-answer"] }
  },

  {
    id: "n8c8-q054",
    type: "short",
    prompt: "Why is ketamine considered a highly advantageous induction agent for a patient with severe asthma?",
    setup: "",
    acceptedAnswers: [
      "It is a potent bronchodilator", "Potent bronchodilator", "Bronchodilator",
      "bronchdilator",
      "broncho dilator",
      "bronchial dilation",
      "causes bronchodilation",
      "bronchodilation",
      "dilates bronchi",
      "relaxes bronchioles",
      "bronchial relaxation",
    ],
    rationale: "Because it is a potent bronchodilator, ketamine is an excellent choice for asthmatic patients.",
    metadata: { topic: "Ketamine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "ketamine", "respiratory", "short-answer"] }
  },

  {
    id: "n8c8-q055",
    type: "mcq",
    prompt: "How does ketamine uniquely act at the spinal cord level to provide direct analgesic effects?",
    setup: "",
    ans: [
      { t: "It blocks glutamate at the spinal cord level.", ok: true },
      { t: "It blocks serotonin at the spinal cord level.", ok: false },
      { t: "It blocks dopamine at the spinal cord level.", ok: false },
      { t: "It blocks histamine at the spinal cord level.", ok: false },
    ],
    rationale: "Ketamine has direct analgesic effects even at subanesthetic doses by blocking glutamate at the spinal cord level and occupying opioid receptors.",
    metadata: { topic: "Ketamine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "ketamine", "analgesia", "single-choice"] }
  },

  {
    id: "n8c8-q056",
    type: "mcq",
    prompt: "How does administration of ketamine affect the clinical duration of non-depolarizing muscle relaxant medications?",
    setup: "",
    ans: [
      { t: "It potentiates the neuromuscular blockers.", ok: true },
      { t: "It neutralizes the neuromuscular blockers.", ok: false },
      { t: "It accelerates the neuromuscular blockers.", ok: false },
      { t: "It terminates the neuromuscular blockers.", ok: false },
    ],
    rationale: "Ketamine specifically potentiates the action of non-depolarizing muscle relaxants.",
    metadata: { topic: "Ketamine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "ketamine", "drug-interactions", "single-choice"] }
  },

  {
    id: "n8c8-q057",
    type: "mcq",
    prompt: "How is ketamine chemically metabolized within the liver by the cytochrome P450 enzyme system?",
    setup: "",
    ans: [
      { t: "Primarily via N-demethylation.", ok: true },
      { t: "Primarily via O-demethylation.", ok: false },
      { t: "Primarily via N-hydroxylation.", ok: false },
      { t: "Primarily via O-hydroxylation.", ok: false },
    ],
    rationale: "Ketamine is primarily metabolized in the liver via N-demethylation by cytochrome P450 into active and inactive metabolites that are excreted in the urine.",
    metadata: { topic: "Ketamine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "ketamine", "metabolism", "single-choice"] }
  },

  {
    id: "n8c8-q058",
    type: "mcq",
    prompt: "What specific medication is recommended to attenuate the profound salivation caused by ketamine administration?",
    setup: "",
    ans: [
      { t: "Robinul", ok: true },
      { t: "Esmolol", ok: false },
      { t: "Aspirin", ok: false },
      { t: "Heparin", ok: false },
    ],
    rationale: "Ketamine causes significantly increased salivation, which can be attenuated with an anticholinergic medication. Robinul is the best choice.",
    metadata: { topic: "Ketamine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "ketamine", "drug-interactions", "single-choice"] }
  },

  {
    id: "n8c8-q059",
    type: "multi",
    prompt: "Select TWO drugs that possess dangerous specific interactions with ketamine, leading to either prolonged duration or a predisposition to seizures:",
    setup: "",
    choices: ["Theophylline", "Lithium", "Cimetidine", "Flumazenil"],
    correctAnswers: ["Theophylline", "Lithium"],
    selectCount: 2,
    rationale: "Theophylline combined with ketamine predisposes the patient to seizures. Lithium is known to prolong the clinical duration of ketamine.",
    metadata: { topic: "Ketamine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "ketamine", "drug-interactions", "multi-select"] }
  },

  // ─── ETOMIDATE ────────────────────────────────────────────────────────────────

  {
    id: "n8c8-q060",
    type: "mcq",
    prompt: "What solvent is etomidate dissolved in that causes its characteristic pain on injection?",
    setup: "",
    ans: [
      { t: "Propylene glycol", ok: true },
      { t: "Potassium glycol", ok: false },
      { t: "Phosphate glycol", ok: false },
      { t: "Pyridine glycol", ok: false },
    ],
    rationale: "Etomidate is dissolved in propylene glycol, which is responsible for the pain on injection.",
    metadata: { topic: "Etomidate", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "etomidate", "single-choice"] }
  },

  {
    id: "n8c8-q061",
    type: "mcq",
    prompt: "Why is etomidate considered an excellent induction agent for patients with poor cardiac function?",
    setup: "",
    ans: [
      { t: "It maintains myocardial contractility and cardiac output.", ok: true },
      { t: "It increases myocardial contractility and cardiac output.", ok: false },
      { t: "It depresses myocardial contractility and cardiac output.", ok: false },
      { t: "It optimizes myocardial contractility and cardiac output.", ok: false },
    ],
    rationale: "Etomidate has minimal cardiovascular effects. Myocardial contractility and cardiac output remain unchanged, and it causes only a mild reduction in systemic vascular resistance.",
    metadata: { topic: "Etomidate", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "etomidate", "cardiovascular", "high-yield", "single-choice"] }
  },

  {
    id: "n8c8-q062",
    type: "mcq",
    prompt: "What specific endocrine effect is caused by a single induction dose of etomidate?",
    setup: "",
    ans: [
      { t: "It causes adrenocortical suppression lasting four to eight hours.", ok: true },
      { t: "It causes adrenocortical suppression lasting five to nine hours.", ok: false },
      { t: "It causes adrenocortical stimulation lasting four to eight hours.", ok: false },
      { t: "It causes adrenocortical stimulation lasting five to nine hours.", ok: false },
    ],
    rationale: "Induction doses of etomidate transiently inhibit enzymes involved in converting cholesterol to cortisol, leading to adrenocortical suppression that lasts 4 to 8 hours.",
    metadata: { topic: "Etomidate", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "etomidate", "endocrine", "high-yield", "single-choice"] }
  },

  {
    id: "n8c8-q063",
    type: "short",
    prompt: "Etomidate has a disinhibitory effect on parts of the nervous system that control extrapyramidal motor activity, leading to a high incidence of what side effect?",
    setup: "",
    acceptedAnswers: [
      "Myoclonus",
      "myoclonic movements",
      "myoclonic",
      "myoclonic jerks",
      "myoclonic activity",
      "myoclonus movements",
      "involuntary muscle movements",
      "muscle twitching",
      "myoclonic contractions",
      "myoclonis",
      "mioclonus",
    ],
    rationale: "Unlike barbiturates, etomidate has a disinhibitory effect on extrapyramidal motor activity, which is responsible for a high incidence of myoclonus.",
    metadata: { topic: "Etomidate", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "etomidate", "adverse-effects", "short-answer"] }
  },

  {
    id: "n8c8-q064",
    type: "short",
    prompt: "What common gastrointestinal side effect is highly associated with administration of etomidate?",
    setup: "",
    acceptedAnswers: [
      "Post-operative nausea and vomiting",
      "PONV",
      "Postoperative nausea and vomiting",
      "nausea and vomiting",
      "N/V",
      "nausea vomiting",
      "post op nausea",
      "post-op nausea and vomiting",
      "postop nausea and vomiting",
      "nausea",
      "post operative nausea and vomiting",
      "post operative nausea",
      "vomiting",
    ],
    rationale: "Post-operative nausea and vomiting is common following administration of etomidate.",
    metadata: { topic: "Etomidate", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "etomidate", "adverse-effects", "short-answer"] }
  },

  {
    id: "n8c8-q065",
    type: "multi",
    prompt: "Select TWO specific biological pathways responsible for rapidly hydrolyzing etomidate into an inactive metabolite:",
    setup: "",
    choices: [
      "Plasma esterases",
      "Hepatic microsomal enzymes",
      "Plasma pseudocholinesterase",
      "Renal glomerular filtration",
    ],
    correctAnswers: ["Plasma esterases", "Hepatic microsomal enzymes"],
    selectCount: 2,
    rationale: "Etomidate is rapidly hydrolyzed into inactive metabolites by both plasma esterases and hepatic microsomal enzymes.",
    metadata: { topic: "Etomidate", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "etomidate", "metabolism", "multi-select"] }
  },

  // ─── DEXMEDETOMIDINE ──────────────────────────────────────────────────────────

  {
    id: "n8c8-q066",
    type: "short",
    prompt: "What is the primary mechanism of action of dexmedetomidine?",
    setup: "",
    acceptedAnswers: [
      "Potent alpha-2 adrenergic agonist",
      "Alpha-2 adrenergic agonist",
      "α2 adrenergic agonist",
      "alpha-2 agonist",
      "alpha 2 agonist",
      "alpha2 agonist",
      "a2 agonist",
      "a-2 agonist",
      "a 2 agonist",
      "alpha 2 adrenergic",
      "a2 adrenergic agonist",
    ],
    rationale: "Dexmedetomidine is a potent alpha-2 adrenergic agonist that provides anxiolytic, sympatholytic, and analgesic properties.",
    metadata: { topic: "Dexmedetomidine", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "dexmedetomidine", "mechanism", "high-yield", "short-answer"] }
  },

  {
    id: "n8c8-q067",
    type: "multi",
    prompt: "Select THREE specific hepatic pathways utilized to rapidly metabolize dexmedetomidine into an inactive compound:",
    setup: "",
    choices: [
      "N-methylation",
      "Hydroxylation",
      "Conjugation",
      "Glucuronidation",
      "Ester hydrolysis",
    ],
    correctAnswers: ["N-methylation", "Hydroxylation", "Conjugation"],
    selectCount: 3,
    rationale: "Dexmedetomidine undergoes rapid hepatic metabolism involving N-methylation, hydroxylation, and conjugation.",
    metadata: { topic: "Dexmedetomidine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "dexmedetomidine", "metabolism", "multi-select"] }
  },

  {
    id: "n8c8-q068",
    type: "mcq",
    prompt: "Why is dexmedetomidine considered a highly useful drug for epilepsy surgery?",
    setup: "",
    ans: [
      { t: "It does not suppress seizure foci.", ok: true },
      { t: "It does not activate seizure foci.", ok: false },
      { t: "It completely halts seizure foci.", ok: false },
      { t: "It destroys seizure foci.", ok: false },
    ],
    rationale: "Because dexmedetomidine resembles a physiologic sleep state, seizure foci are not suppressed, making it an excellent drug for mapping during epilepsy surgery.",
    metadata: { topic: "Dexmedetomidine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "dexmedetomidine", "cns-effects", "single-choice"] }
  },

  {
    id: "n8c8-q069",
    type: "mcq",
    prompt: "How does dexmedetomidine specifically alter intracranial pressure and cerebral metabolic rate for oxygen?",
    setup: "",
    ans: [
      { t: "It produces no significant alterations.", ok: true },
      { t: "It produces huge significant alterations.", ok: false },
      { t: "It produces large systemic alterations.", ok: false },
      { t: "It produces massive vital alterations.", ok: false },
    ],
    rationale: "Dexmedetomidine decreases cerebral blood flow without causing significant changes to intracranial pressure or cerebral metabolic rate for oxygen.",
    metadata: { topic: "Dexmedetomidine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "dexmedetomidine", "cns-effects", "single-choice"] }
  },

  {
    id: "n8c8-q070",
    type: "multi",
    prompt: "Select THREE severe cardiovascular adverse effects that can result from unopposed vagal stimulation caused by dexmedetomidine:",
    setup: "",
    choices: [
      "Heart block",
      "Severe bradycardia",
      "Asystole",
      "Ventricular tachycardia",
      "Atrial fibrillation",
    ],
    correctAnswers: ["Heart block", "Severe bradycardia", "Asystole"],
    selectCount: 3,
    rationale: "Dexmedetomidine can cause heart block, severe bradycardia, or even asystole resulting from unopposed vagal stimulation.",
    metadata: { topic: "Dexmedetomidine", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "dexmedetomidine", "cardiovascular", "high-yield", "multi-select"] }
  },

  {
    id: "n8c8-q071",
    type: "multi",
    prompt: "Select TWO patient factors identified as major risks for severe hemodynamic instability when administering dexmedetomidine:",
    setup: "",
    choices: [
      "Hypovolemia",
      "MAP less than 70",
      "Severe obesity",
      "Tachycardia",
    ],
    correctAnswers: ["Hypovolemia", "MAP less than 70"],
    selectCount: 2,
    rationale: "Because dexmedetomidine causes significant sympatholytic effects and bradycardia, hypovolemia and a mean arterial pressure less than 70 are major risk factors for hemodynamic instability.",
    metadata: { topic: "Dexmedetomidine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "dexmedetomidine", "cardiovascular", "multi-select"] }
  },

  {
    id: "n8c8-q072",
    type: "mcq",
    prompt: "Why might dexmedetomidine produce a transient initial increase in systemic blood pressure upon administration?",
    setup: "",
    ans: [
      { t: "Severe vasoconstriction mediated by peripheral alpha-2 receptors.", ok: true },
      { t: "Severe vasoconstriction mediated by peripheral alpha-1 receptors.", ok: false },
      { t: "Severe vasoconstriction mediated by peripheral beta-2 receptors.", ok: false },
      { t: "Severe vasoconstriction mediated by peripheral beta-1 receptors.", ok: false },
    ],
    rationale: "Dexmedetomidine may initially produce a transient increase in systemic arterial blood pressure and reflex bradycardia due to direct vasoconstriction mediated by peripheral alpha-2 adrenergic receptors before central sympatholytic effects take over.",
    metadata: { topic: "Dexmedetomidine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "dexmedetomidine", "cardiovascular", "single-choice"] }
  },

  // ─── FOUNDATION / MIXED ───────────────────────────────────────────────────────

  {
    id: "n8c8-q073",
    type: "multi",
    prompt: "Select SIX core pharmacologic properties associated with intravenous induction agents:",
    setup: "",
    choices: [
      "Hypnosis",
      "Sedation",
      "Amnesia",
      "Analgesia",
      "Muscle relaxation",
      "Inhibition of autonomic responses",
      "Diuresis",
    ],
    correctAnswers: [
      "Hypnosis",
      "Sedation",
      "Amnesia",
      "Analgesia",
      "Muscle relaxation",
      "Inhibition of autonomic responses",
    ],
    selectCount: 6,
    rationale: "Intravenous induction agents are characterized by hypnotic, sedative, amnestic, and often muscle-relaxing properties, along with suppression of autonomic responses. Diuresis is not a defining feature.",
    metadata: { topic: "General CNS", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "general-cns", "foundation", "multi-select"] }
  },

  {
    id: "n8c8-q074",
    type: "mcq",
    prompt: "Sensory input processed by brainstem arousal pathways is primarily relayed to which structure before reaching the cerebral cortex?",
    setup: "",
    ans: [
      { t: "Thalamus", ok: true },
      { t: "Cerebellum", ok: false },
      { t: "Basal ganglia", ok: false },
      { t: "Hypothalamus", ok: false },
    ],
    rationale: "The thalamus serves as the primary relay center for sensory information before it is transmitted to the cerebral cortex for processing.",
    metadata: { topic: "General CNS", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "general-cns", "single-choice"] }
  },

  {
    id: "n8c8-q075",
    type: "multi",
    prompt: "Select TWO mechanisms that contribute to the inhibitory effects of gamma-aminobutyric acid in the central nervous system:",
    setup: "",
    choices: [
      "Postsynaptic inhibition of excitatory neurons",
      "Presynaptic inhibition of excitatory neurotransmitter release",
      "Increased sodium influx",
      "Increased dopamine release",
    ],
    correctAnswers: [
      "Postsynaptic inhibition of excitatory neurons",
      "Presynaptic inhibition of excitatory neurotransmitter release",
    ],
    selectCount: 2,
    rationale: "GABA decreases neuronal excitability by both directly inhibiting postsynaptic neurons and reducing presynaptic release of excitatory neurotransmitters.",
    metadata: { topic: "General CNS", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "general-cns", "gaba", "multi-select"] }
  },

  {
    id: "n8c8-q076",
    type: "mcq",
    prompt: "Which intravenous anesthetic agent was historically considered a standard induction drug but is no longer manufactured in the United States due to ethical and legal concerns?",
    setup: "",
    ans: [
      { t: "Thiopental", ok: true },
      { t: "Methohexital", ok: false },
      { t: "Propofol", ok: false },
      { t: "Etomidate", ok: false },
    ],
    rationale: "Thiopental was historically a gold-standard induction agent but is no longer manufactured in the United States due to its association with lethal injection protocols.",
    metadata: { topic: "Thiopental", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "thiopental", "historical", "single-choice"] }
  },

  {
    id: "n8c8-q077",
    type: "mcq",
    prompt: "Administration of barbiturates should be avoided in which patient population due to increased risk of bronchospasm?",
    setup: "",
    ans: [
      { t: "Patients with asthma", ok: true },
      { t: "Patients with renal failure", ok: false },
      { t: "Patients with diabetes", ok: false },
      { t: "Patients with Parkinson disease", ok: false },
    ],
    rationale: "Barbiturates can trigger histamine release, which may precipitate bronchospasm, particularly in patients with reactive airway disease.",
    metadata: { topic: "Barbiturates", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "barbiturates", "adverse-effects", "single-choice"] }
  },

  {
    id: "n8c8-q078",
    type: "mcq",
    prompt: "Which electroencephalographic change may occur transiently following administration of an induction dose of a barbiturate?",
    setup: "",
    ans: [
      { t: "Transient isoelectric pattern", ok: true },
      { t: "Persistent beta activation", ok: false },
      { t: "Continuous delta activity", ok: false },
      { t: "Alpha wave dominance", ok: false },
    ],
    rationale: "High-dose barbiturate administration can transiently suppress cortical activity, resulting in a briefly flat or isoelectric EEG tracing.",
    metadata: { topic: "Barbiturates", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "barbiturates", "eeg", "single-choice"] }
  },

  {
    id: "n8c8-q079",
    type: "mcq",
    prompt: "A 1:1 mixture of which two intravenous agents is sometimes used clinically for procedural sedation and is colloquially referred to as ketofol?",
    setup: "",
    ans: [
      { t: "Ketamine and propofol", ok: true },
      { t: "Ketamine and etomidate", ok: false },
      { t: "Ketamine and midazolam", ok: false },
      { t: "Propofol and dexmedetomidine", ok: false },
    ],
    rationale: "A combination of ketamine and propofol provides both analgesia and sedation, balancing hemodynamic effects and reducing adverse effects of each drug individually.",
    metadata: { topic: "Ketamine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "ketamine", "propofol", "sedation", "single-choice"] }
  },

  {
    id: "n8c8-q080",
    type: "mcq",
    prompt: "Which intravenous anesthetic is particularly useful in patients with chronic opioid use due to its ability to reduce opioid requirements?",
    setup: "",
    ans: [
      { t: "Ketamine", ok: true },
      { t: "Propofol", ok: false },
      { t: "Etomidate", ok: false },
      { t: "Thiopental", ok: false },
    ],
    rationale: "Ketamine provides analgesia through NMDA receptor antagonism and can reduce opioid tolerance and requirements in chronic opioid users.",
    metadata: { topic: "Ketamine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "ketamine", "analgesia", "single-choice"] }
  },

  {
    id: "n8c8-q081",
    type: "mcq",
    prompt: "In a patient with depleted sympathetic reserves, administration of ketamine may result in which unexpected hemodynamic effect?",
    setup: "",
    ans: [
      { t: "Myocardial depression and hypotension", ok: true },
      { t: "Severe hypertension", ok: false },
      { t: "Reflex bradycardia", ok: false },
      { t: "Increased systemic vascular resistance", ok: false },
    ],
    rationale: "Ketamine typically increases cardiovascular parameters via sympathetic stimulation, but in catecholamine-depleted states, its direct myocardial depressant effects may predominate.",
    metadata: { topic: "Ketamine", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "ketamine", "cardiovascular", "high-yield", "single-choice"] }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL — Barbiturate MOA/Side Effects, Propofol CV/Resp, Benzo PK,
  //              Etomidate CV, Dexmedetomidine CV, Ketamine interactions
  // ═══════════════════════════════════════════════════════════════════════════

  // ── RETICULAR ACTIVATING SYSTEM & BARBITURATE MOA ────────────────────────

  {
    id: "n8c8-q082", type: "mcq",
    prompt: "Most IV induction agents produce unconsciousness by acting on the reticular activating system (RAS). Where is the RAS located?",
    setup: "",
    ans: [
      { t: "In the brainstem — a polysynaptic network of neurons controlling consciousness and vital functions", ok: true  },
      { t: "In the cerebral cortex — the outer layer of gray matter responsible for higher cognitive processing", ok: false },
      { t: "In the spinal cord dorsal horn — the sensory relay center for nociceptive and proprioceptive input", ok: false },
      { t: "In the hypothalamus — the autonomic regulatory center for temperature, hunger, and thirst responses", ok: false },
    ],
    rationale: "The reticular activating system is a polysynaptic network of neurons and regulatory centers located in the brainstem. It controls consciousness, arousal, sleep-wake cycles, and several vital functions. IV anesthetics produce unconsciousness primarily by depressing RAS activity. The cortex processes higher functions but depends on RAS for arousal. The hypothalamus regulates autonomic function, not consciousness per se.",
    scene: null, metadata: { topic: "General CNS", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["RAS", "brainstem", "consciousness"] }
  },

  {
    id: "n8c8-q083", type: "mcq",
    prompt: "At standard induction doses, barbiturates enhance GABA activity by binding to the GABA-A receptor. What specific effect do they have on the chloride channel?",
    setup: "",
    ans: [
      { t: "They decrease the rate of GABA dissociation from its receptor, prolonging chloride channel opening duration",  ok: true  },
      { t: "They increase the frequency of chloride channel opening without changing the duration of each individual opening", ok: false },
      { t: "They directly open the chloride channel independent of GABA binding at any dose administered clinically",         ok: false },
      { t: "They block the chloride channel and prevent inhibitory neurotransmission, producing paradoxical CNS excitation",   ok: false },
    ],
    rationale: "At clinical induction doses, barbiturates ENHANCE GABA action by decreasing the rate of GABA dissociation from the receptor, which PROLONGS the duration of Cl⁻ channel opening. This produces the sedative/hypnotic effect. Benzodiazepines, by contrast, increase the FREQUENCY of channel opening. At higher (supra-clinical) doses, barbiturates can directly activate GABA receptors even WITHOUT GABA — this produces deeper anesthesia (barbiturate coma) and is distinct from the GABA-enhancing mechanism.",
    scene: null, metadata: { topic: "Barbiturates", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["GABA", "chloride channel", "duration", "barbiturate MOA"] }
  },

  {
    id: "n8c8-q084", type: "mcq",
    prompt: "At very high doses, barbiturates can directly activate GABA receptors even in the absence of GABA. What clinical state does this produce?",
    setup: "",
    ans: [
      { t: "Deep anesthetic effects including barbiturate coma — a state of profound CNS depression beyond sedation",  ok: true  },
      { t: "Seizure activity from unopposed excitatory neurotransmission due to complete GABA receptor desensitization", ok: false },
      { t: "Selective analgesia without loss of consciousness, similar to the dissociative effects of ketamine",        ok: false },
      { t: "Paradoxical CNS excitation with hypertonicity and tremor from direct stimulation of the motor cortex",       ok: false },
    ],
    rationale: "At clinical doses, barbiturates enhance GABA (sedative/hypnotic). At high doses, they DIRECTLY activate GABA receptors independent of GABA — this produces the deep anesthetic effects of barbiturate coma. This is pharmacologically distinct from the enhancing mechanism and explains why barbiturate overdose produces such profound CNS depression compared to benzodiazepines (which can only enhance existing GABA, not mimic it).",
    scene: null, metadata: { topic: "Barbiturates", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["GABA", "direct activation", "barbiturate coma", "high dose"] }
  },

  // ── THIOPENTAL PHARMACOKINETICS & PRECIPITATION ──────────────────────────

  {
    id: "n8c8-q085", type: "mcq",
    prompt: "Thiopental is a weak acid preserved in an alkaline solution (pH 10-11). Why must it not be mixed with acidic drugs or solutions such as lactated Ringer's?",
    setup: "",
    ans: [
      { t: "Thiopental precipitates out of solution when pH drops below its pKa, forming visible crystals that can occlude IV lines", ok: true  },
      { t: "Lactated Ringer's chemically deactivates thiopental by breaking its barbituric acid ring structure irreversibly",          ok: false },
      { t: "The alkaline pH of thiopental neutralizes the lactate buffer in LR, producing dangerous carbon dioxide gas bubbles",        ok: false },
      { t: "Acidic solutions convert thiopental into its active metabolite too rapidly, causing immediate cardiovascular collapse",      ok: false },
    ],
    rationale: "Thiopental is a weak acid that requires alkaline pH (10-11) to remain in solution. When mixed with acidic drugs or solutions, the pH drops below thiopental's pKa and it precipitates — forming visible crystals that can block IV tubing and cause tissue necrosis if injected intra-arterially. Drugs that precipitate with thiopental include: pancuronium, vecuronium, rocuronium, atracurium, alfentanil, sufentanil, and midazolam. Always FLUSH the IV line between administration of thiopental and any other drug.",
    scene: null, metadata: { topic: "Barbiturates", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["thiopental", "precipitation", "alkaline pH", "flush between drugs"] }
  },

  {
    id: "n8c8-q086", type: "multi",
    prompt: "Which drugs are known to precipitate when mixed with thiopental in the same IV line? (Select THREE)",
    setup: "",
    choices: [
      "Rocuronium — a non-depolarizing NMB that precipitates in alkaline thiopental solutions",
      "Midazolam — a benzodiazepine that is acidic in solution and incompatible with thiopental",
      "Sufentanil — an opioid that precipitates when combined with the alkaline pH of thiopental",
      "Propofol — a lipid emulsion that is physically compatible with most IV solutions at any pH",
      "Normal saline — an isotonic crystalloid that does not alter thiopental's alkaline pH significantly",
    ],
    correctAnswers: [
      "Rocuronium — a non-depolarizing NMB that precipitates in alkaline thiopental solutions",
      "Midazolam — a benzodiazepine that is acidic in solution and incompatible with thiopental",
      "Sufentanil — an opioid that precipitates when combined with the alkaline pH of thiopental",
    ],
    selectCount: 3,
    rationale: "Drugs that precipitate with thiopental (pH 10-11) include: pancuronium, vecuronium, rocuronium, atracurium, alfentanil, sufentanil, and midazolam. Always flush the IV line between thiopental and any other medication. Propofol and NS do not precipitate with thiopental. This incompatibility is a practical clinical concern — precipitation can occlude IV lines and cause harm if injected.",
    scene: null, metadata: { topic: "Barbiturates", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["thiopental", "drug precipitation", "incompatibility", "IV flush"] }
  },

  // ── BARBITURATE SIDE EFFECTS ─────────────────────────────────────────────

  {
    id: "n8c8-q087", type: "multi",
    prompt: "Which are recognized side effects of barbiturate administration? (Select THREE)",
    setup: "",
    choices: [
      "Garlic or metallic taste reported by awake patients during injection of the drug",
      "CNS excitation including hypertonus, tremor, or involuntary twitching movements",
      "Respiratory depression with blunted response to both hypercarbia and hypoxia drives",
      "Bronchodilation and decreased airway resistance in asthmatic patients under anesthesia",
      "Bacteriostatic properties that allow the drug to remain sterile indefinitely after mixing",
    ],
    correctAnswers: [
      "Garlic or metallic taste reported by awake patients during injection of the drug",
      "CNS excitation including hypertonus, tremor, or involuntary twitching movements",
      "Respiratory depression with blunted response to both hypercarbia and hypoxia drives",
    ],
    selectCount: 3,
    rationale: "Barbiturate side effects include: garlic/metallic taste, CNS excitement (hypertonus, tremor, twitching from some CNS stimulation), respiratory depression (blunted CO₂ and O₂ response, apnea common after induction), pain on injection (possibly pH-related). Barbiturates do NOT bronchodilate — they actually fail to blunt airway reflexes completely, risking bronchospasm in asthmatics and laryngospasm in lightly anesthetized patients. They do NOT have preservatives — must be used within 6 hours and discarded (support bacterial growth).",
    scene: null, metadata: { topic: "Barbiturates", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["side effects", "garlic taste", "CNS excitement", "respiratory depression"] }
  },

  {
    id: "n8c8-q088", type: "mcq",
    prompt: "A patient with a history of reactive airway disease receives thiopental for induction. During laryngoscopy at a light plane of anesthesia, the patient develops severe bronchospasm. Why?",
    setup: "",
    ans: [
      { t: "Barbiturates do not completely blunt noxious airway reflexes — instrumentation at light depth triggers bronchospasm in asthmatics", ok: true  },
      { t: "Thiopental directly stimulates muscarinic receptors in bronchial smooth muscle, causing active bronchoconstriction during induction", ok: false },
      { t: "The alkaline pH of thiopental causes direct chemical irritation of the tracheal mucosa, triggering reflex airway smooth muscle spasm", ok: false },
      { t: "Barbiturates block beta-2 adrenergic receptors in bronchial smooth muscle, removing the tonic bronchodilatory influence of the SNS",   ok: false },
    ],
    rationale: "Barbiturates cause respiratory depression but do NOT completely suppress airway reflexes. Airway instrumentation (laryngoscopy, intubation) at a light plane can trigger bronchospasm in asthmatic patients and laryngospasm in any lightly anesthetized patient. This is why adequate depth of anesthesia must be ensured before instrumenting the airway, and why propofol (which has bronchodilatory properties) is often preferred for asthmatics.",
    scene: null, metadata: { topic: "Barbiturates", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["bronchospasm", "laryngospasm", "airway reflexes", "asthma"] }
  },

  {
    id: "n8c8-q089", type: "mcq",
    prompt: "Thiopental solutions do not contain preservatives. What is the clinical implication?",
    setup: "",
    ans: [
      { t: "They support bacterial growth — must be prepared with sterile technique and discarded within 6 hours of mixing", ok: true  },
      { t: "They remain stable indefinitely at room temperature and can be stored for up to 30 days after reconstitution",   ok: false },
      { t: "They require refrigeration at 4°C to prevent spontaneous degradation of the barbituric acid ring structure",     ok: false },
      { t: "They are chemically incompatible with normal saline and must only be reconstituted with sterile water for injection", ok: false },
    ],
    rationale: "Without preservatives, reconstituted thiopental supports bacterial growth. Clinical protocol requires strict sterile technique during preparation and use within 6 hours, after which the solution must be discarded. This is similar to propofol, which also lacks preservatives in some formulations and supports bacterial growth in its lipid emulsion.",
    scene: null, metadata: { topic: "Barbiturates", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["thiopental", "no preservatives", "bacterial growth", "6 hours"] }
  },

  // ── PROPOFOL — CV, RESPIRATORY, FIRST-PASS ───────────────────────────────

  {
    id: "n8c8-q090", type: "mcq",
    prompt: "Approximately 30% of a propofol bolus dose undergoes first-pass uptake in which organ before reaching the systemic circulation?",
    setup: "",
    ans: [
      { t: "The lungs — pulmonary first-pass metabolism removes roughly 30% of the initial bolus dose from circulation",  ok: true  },
      { t: "The liver — hepatic first-pass extraction removes the majority of propofol before it reaches the brain",       ok: false },
      { t: "The kidneys — renal filtration clears 30% of propofol directly into the urine during the initial pass",        ok: false },
      { t: "The spleen — splenic sequestration traps lipophilic drugs like propofol in the reticuloendothelial system",     ok: false },
    ],
    rationale: "The lung plays a significant role in propofol's first-pass metabolism, removing approximately 30% of a bolus dose before it reaches the arterial circulation. This pulmonary uptake helps buffer the initial bolus but also means that the effective dose reaching the brain is less than the injected dose. The liver is the primary site of ongoing metabolism (not first-pass for IV drugs), and the kidneys excrete metabolites, not parent drug.",
    scene: null, metadata: { topic: "Propofol", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["propofol", "first-pass", "pulmonary uptake", "30%"] }
  },

  {
    id: "n8c8-q091", type: "multi",
    prompt: "Propofol reduces cerebral metabolic rate for oxygen (CMRO₂). Which cerebral effects follow from this? (Select THREE)",
    setup: "",
    choices: [
      "Decreased cerebral blood flow (CBF) secondary to reduced metabolic demand in the brain",
      "Decreased intracranial pressure (ICP) due to reduced cerebral blood volume from vasoconstriction",
      "Decreased intraocular pressure (IOP) making propofol suitable for ophthalmic procedures",
      "Increased cerebral perfusion pressure (CPP) in all patients regardless of hemodynamic status",
      "Increased cerebral blood flow due to direct vasodilation of cerebral arterioles by propofol",
    ],
    correctAnswers: [
      "Decreased cerebral blood flow (CBF) secondary to reduced metabolic demand in the brain",
      "Decreased intracranial pressure (ICP) due to reduced cerebral blood volume from vasoconstriction",
      "Decreased intraocular pressure (IOP) making propofol suitable for ophthalmic procedures",
    ],
    selectCount: 3,
    rationale: "Propofol ↓CMRO₂ → ↓CBF → ↓ICP and ↓IOP. However, propofol also ↓MAP via vasodilation, which can DECREASE CPP (CPP = MAP − ICP). In head-injured patients with hypotension, propofol's MAP reduction could dangerously lower CPP even though ICP is decreased. This is why propofol must be used cautiously in traumatic brain injury with hemodynamic instability.",
    scene: null, metadata: { topic: "Propofol", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["propofol", "CMRO2", "ICP", "IOP", "CBF"] }
  },

  {
    id: "n8c8-q092", type: "mcq",
    prompt: "Propofol decreases blood pressure primarily through which cardiovascular mechanism?",
    setup: "",
    ans: [
      { t: "Both arterial and venous vasodilation — reducing preload (venous) and afterload (arterial) simultaneously",  ok: true  },
      { t: "Direct myocardial depression reducing contractility and stroke volume without affecting vascular tone at all", ok: false },
      { t: "Reflex bradycardia from stimulation of carotid baroreceptors by the lipid emulsion vehicle in the solution",   ok: false },
      { t: "Sympathetic nervous system activation that paradoxically causes hypotension through catecholamine depletion",   ok: false },
    ],
    rationale: "Propofol's primary CV effect is vasodilation — both arterial (↓afterload/SVR) and venous (↓preload/venous return). This reduces MAP significantly, especially in patients with diminished compensatory reserve: elderly, hypovolemic, diabetic, hypertensive, obese, and those with cardiovascular disease. While some direct myocardial depression may occur, vasodilation is the dominant mechanism.",
    scene: null, metadata: { topic: "Propofol", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["propofol", "hypotension", "vasodilation", "preload", "afterload"] }
  },

  {
    id: "n8c8-q093", type: "multi",
    prompt: "Which patient populations are at INCREASED risk of cardiovascular depression from propofol? (Select FOUR)",
    setup: "",
    choices: [
      "Elderly patients with reduced baroreceptor sensitivity and decreased cardiac reserve",
      "Hypovolemic patients with inadequate circulating volume to maintain venous return",
      "Patients with diabetes, hypertension, or obesity who have baseline vascular dysfunction",
      "Patients with pre-existing cardiovascular disease and limited compensatory mechanisms",
      "Young healthy ASA I patients with robust sympathetic tone and normal blood volume",
      "Pregnant patients in the second trimester with physiologic volume expansion",
    ],
    correctAnswers: [
      "Elderly patients with reduced baroreceptor sensitivity and decreased cardiac reserve",
      "Hypovolemic patients with inadequate circulating volume to maintain venous return",
      "Patients with diabetes, hypertension, or obesity who have baseline vascular dysfunction",
      "Patients with pre-existing cardiovascular disease and limited compensatory mechanisms",
    ],
    selectCount: 4,
    rationale: "Propofol's vasodilatory effects produce exaggerated hypotension in: elderly (↓baroreceptor response), hypovolemic (↓preload reserve), diabetic/hypertensive/obese (↓vascular compliance), and patients with cardiovascular disease (↓cardiac reserve). Young healthy patients typically compensate via baroreflexes. Dose reduction and slow titration are essential in these high-risk populations.",
    scene: null, metadata: { topic: "Propofol", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["propofol", "CV risk", "elderly", "hypovolemic", "diabetes", "obesity"] }
  },

  {
    id: "n8c8-q094", type: "mcq",
    prompt: "Propofol affects the respiratory system by decreasing minute ventilation. What are the specific components of this respiratory depression?",
    setup: "",
    ans: [
      { t: "It reduces both tidal volume and respiratory rate, blunts responses to hypoxia and hypercapnia, and increases upper airway collapsibility", ok: true  },
      { t: "It reduces only respiratory rate while maintaining tidal volume, and it stimulates hypoxic ventilatory drive as a protective mechanism",     ok: false },
      { t: "It reduces only tidal volume while maintaining respiratory rate, and it has no effect on upper airway muscle tone or reflexes at any dose",  ok: false },
      { t: "It causes bronchospasm by directly constricting airway smooth muscle, which is the primary mechanism of minute ventilation reduction",        ok: false },
    ],
    rationale: "Propofol decreases minute ventilation through BOTH ↓tidal volume AND ↓respiratory rate. It blunts the ventilatory response to both hypoxia and hypercapnia. It also increases upper airway collapsibility (reduces pharyngeal muscle tone), contributing to obstruction. Notably, propofol does NOT cause bronchospasm — it actually has mild bronchodilatory properties, which is one reason it is preferred over thiopental for asthmatic patients.",
    scene: null, metadata: { topic: "Propofol", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["propofol", "respiratory depression", "tidal volume", "upper airway"] }
  },

  // ── BENZODIAZEPINES — PK, SPECIAL POPULATIONS, REVERSAL ──────────────────

  {
    id: "n8c8-q095", type: "mcq",
    prompt: "Benzodiazepines rely on the liver for biotransformation. How does advancing age affect diazepam and midazolam clearance?",
    setup: "",
    ans: [
      { t: "Increasing age reduces clearance of diazepam significantly, and to a lesser degree midazolam — prolonging their effects", ok: true  },
      { t: "Increasing age has no effect on benzodiazepine clearance because renal elimination dominates for both drugs at all ages",  ok: false },
      { t: "Increasing age increases the clearance of both drugs equally because hepatic blood flow rises with age from vasodilation",  ok: false },
      { t: "Only midazolam clearance is affected by age — diazepam is cleared by plasma esterases independent of hepatic function",    ok: false },
    ],
    rationale: "Benzodiazepines depend on hepatic biotransformation into water-soluble metabolites excreted in bile and urine. Advancing age reduces hepatic metabolic capacity, significantly decreasing diazepam clearance (and to a lesser degree midazolam). This means elderly patients may have prolonged sedation and require dose reduction. Diazepam's active metabolite (desmethyldiazepam) further extends its clinical effect in the elderly.",
    scene: null, metadata: { topic: "Benzodiazepines", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["age", "clearance", "diazepam", "midazolam", "hepatic"] }
  },

  {
    id: "n8c8-q096", type: "mcq",
    prompt: "In an obese patient, the volume of distribution (Vd) of benzodiazepines is increased. How does this affect dosing strategy for induction versus continuous infusion?",
    setup: "",
    ans: [
      { t: "May initially need a larger induction dose (↑Vd), but infusions should be dosed on ideal body weight to avoid accumulation", ok: true  },
      { t: "Both induction and infusion doses should be based on total body weight because Vd increase applies equally to both phases",    ok: false },
      { t: "Both induction and infusion doses should be reduced because obesity decreases hepatic clearance of all benzodiazepines",        ok: false },
      { t: "Obesity has no clinically significant effect on benzodiazepine pharmacokinetics and no dose adjustment is required at all",       ok: false },
    ],
    rationale: "In obesity, the increased Vd of lipophilic benzodiazepines means the drug distributes into a larger tissue reservoir. For INDUCTION: a larger initial dose may be needed to achieve target plasma levels. For INFUSION: dosing on total body weight causes drug accumulation in fat stores → prolonged elimination half-life → delayed recovery. Therefore, continuous infusions should be dosed on IDEAL body weight (IBW).",
    scene: null, metadata: { topic: "Benzodiazepines", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["obesity", "Vd", "IBW", "dosing", "accumulation"] }
  },

  {
    id: "n8c8-q097", type: "mcq",
    prompt: "Flumazenil (Romazicon) reverses benzodiazepine effects. What is unique about this reversal agent compared to reversal agents for other IV anesthetic classes?",
    setup: "",
    ans: [
      { t: "No other class of IV hypnotic drug has a specific pharmacologic antagonist — flumazenil is unique to benzodiazepines",  ok: true  },
      { t: "Flumazenil also reverses the effects of barbiturates, propofol, and etomidate at the GABA-A receptor complex as well",  ok: false },
      { t: "Flumazenil is an irreversible antagonist that permanently blocks GABA-A receptors once administered intravenously",       ok: false },
      { t: "Flumazenil works by enhancing hepatic metabolism of benzodiazepines rather than competing at the GABA-A receptor site",   ok: false },
    ],
    rationale: "Flumazenil is a COMPETITIVE antagonist at the benzodiazepine binding site on GABA-A receptors. It is the ONLY specific antagonist available for any IV hypnotic class — barbiturates, propofol, etomidate, and ketamine have no reversal agents. Dose: 0.2 mg every 2-10 minutes up to 1 mg. Caution: duration may be shorter than the benzodiazepine → risk of resedation. Seizure risk in chronic benzodiazepine users.",
    scene: null, metadata: { topic: "Benzodiazepines", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["flumazenil", "reversal", "competitive antagonist", "unique"] }
  },

  // ── ETOMIDATE CV STABILITY ───────────────────────────────────────────────

  {
    id: "n8c8-q098", type: "mcq",
    prompt: "Etomidate is described as having 'minimal cardiovascular effects.' What specific hemodynamic profile supports this claim?",
    setup: "",
    ans: [
      { t: "Only a mild SVR reduction and slight BP decrease — myocardial contractility and cardiac output remain essentially unchanged", ok: true  },
      { t: "It increases cardiac output and SVR simultaneously, producing hypertension that requires beta-blocker prophylaxis",            ok: false },
      { t: "It produces the same degree of vasodilation as propofol but is offset by a reflex tachycardia that maintains MAP",              ok: false },
      { t: "It has no hemodynamic effects whatsoever — heart rate, BP, SVR, and cardiac output are completely unaffected at any dose",       ok: false },
    ],
    rationale: "Etomidate produces only a mild reduction in SVR and a slight decrease in BP. Critically, myocardial contractility and cardiac output remain unchanged — making it the preferred induction agent for hemodynamically unstable patients. It also reduces CMRO₂, CBF, and ICP to a degree equal to thiopental, while CPP is well maintained because of the minimal cardiac effects. It is NOT completely without CV effects (slight BP drop), but the impact is far less than propofol or barbiturates.",
    scene: null, metadata: { topic: "Etomidate", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["etomidate", "CV stability", "SVR", "contractility", "cardiac output"] }
  },

  {
    id: "n8c8-q099", type: "mcq",
    prompt: "Compared to barbiturates and benzodiazepines, how does etomidate's effect on ventilation differ?",
    setup: "",
    ans: [
      { t: "Ventilation is LESS affected by etomidate than by barbiturates or benzodiazepines at equipotent induction doses",  ok: true  },
      { t: "Ventilation is MORE affected by etomidate, causing more profound apnea than thiopental at equivalent doses",        ok: false },
      { t: "Etomidate causes complete respiratory arrest regardless of dose, requiring immediate mechanical ventilation",        ok: false },
      { t: "Etomidate has identical respiratory depression to propofol and barbiturates — no clinically meaningful difference",   ok: false },
    ],
    rationale: "Etomidate produces less respiratory depression than barbiturates or benzodiazepines at equipotent doses. While some respiratory depression occurs, it is milder — making etomidate a good choice when both hemodynamic stability AND preserved ventilatory drive are desired (e.g., rapid sequence induction in a trauma patient with potential full stomach and hemodynamic instability).",
    scene: null, metadata: { topic: "Etomidate", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["etomidate", "respiratory", "less depression", "ventilation"] }
  },

  // ── DEXMEDETOMIDINE CV RISKS ─────────────────────────────────────────────

  {
    id: "n8c8-q100", type: "mcq",
    prompt: "Dexmedetomidine can produce severe bradycardia, heart block, or even asystole through which mechanism?",
    setup: "",
    ans: [
      { t: "Unopposed vagal stimulation — dex inhibits sympathetic outflow via central α₂ agonism, leaving vagal tone dominant",  ok: true  },
      { t: "Direct blockade of cardiac sodium channels, slowing conduction through the AV node similar to class Ia antiarrhythmics", ok: false },
      { t: "Stimulation of cardiac muscarinic M₂ receptors causing direct parasympathetic activation of the SA and AV nodes",        ok: false },
      { t: "Coronary vasoconstriction reducing myocardial oxygen supply, which triggers reflexive bradycardia as a protective response", ok: false },
    ],
    rationale: "Dexmedetomidine is a central α₂ agonist that inhibits sympathetic outflow from the locus coeruleus. This reduces circulating catecholamines, leaving parasympathetic (vagal) tone UNOPPOSED. The result can be bradycardia, heart block, or even asystole — particularly in patients who are hypovolemic or have a MAP <70 mmHg. Risk factors for hemodynamic instability include hypovolemia, pre-existing conduction defects, concurrent use of beta-blockers or calcium channel blockers, and high loading doses.",
    scene: null, metadata: { topic: "Dexmedetomidine", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["dexmedetomidine", "bradycardia", "asystole", "vagal", "unopposed"] }
  },

  // ── KETAMINE — LITHIUM INTERACTION ───────────────────────────────────────

  {
    id: "n8c8-q101", type: "mcq",
    prompt: "Which psychiatric medication may prolong the duration of ketamine's effects?",
    setup: "",
    ans: [
      { t: "Lithium — it may prolong the duration of ketamine-induced anesthesia and emergence from dissociative state",  ok: true  },
      { t: "Sertraline (Zoloft) — SSRIs accelerate ketamine metabolism through CYP3A4 enzyme induction in the liver",      ok: false },
      { t: "Haloperidol — antipsychotics competitively bind NMDA receptors and completely block ketamine's dissociative effect", ok: false },
      { t: "Bupropion — dopamine-norepinephrine reuptake inhibitors have no interaction with ketamine at any clinical dose",     ok: false },
    ],
    rationale: "Lithium may prolong the duration of ketamine. The mechanism is not fully elucidated but may involve altered NMDA receptor function or changes in ketamine redistribution/metabolism. This is clinically relevant because many psychiatric patients take lithium for bipolar disorder, and ketamine is increasingly used for depression treatment and procedural sedation. Providers should be aware of potentially prolonged effects in lithium-treated patients.",
    scene: null, metadata: { topic: "Ketamine", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["ketamine", "lithium", "drug interaction", "prolonged duration"] }
  },

  // ── BENZODIAZEPINES — CNS EFFECTS ────────────────────────────────────────

  {
    id: "n8c8-q102", type: "mcq",
    prompt: "Benzodiazepines reduce cerebral blood flow and intracranial pressure. How does this effect compare to barbiturates?",
    setup: "",
    ans: [
      { t: "Benzodiazepines reduce CBF and ICP but NOT to the same extent as barbiturates — the effect is less pronounced",  ok: true  },
      { t: "Benzodiazepines produce greater CBF and ICP reduction than barbiturates at equipotent sedative doses given IV",    ok: false },
      { t: "Benzodiazepines have no effect on CBF or ICP whatsoever — only barbiturates and propofol affect cerebral hemodynamics", ok: false },
      { t: "Benzodiazepines paradoxically increase CBF and ICP, which is why they are contraindicated in neurosurgical patients",   ok: false },
    ],
    rationale: "Benzodiazepines do reduce CBF and ICP, but the magnitude is less than barbiturates or propofol. They are also effective in preventing and treating seizures. Despite the lesser cerebral depressant effect, benzodiazepines are useful adjuncts in neuroanesthesia and can be reversed with flumazenil if needed — an advantage over barbiturates which have no specific antagonist.",
    scene: null, metadata: { topic: "Benzodiazepines", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["benzodiazepines", "CBF", "ICP", "less than barbiturates", "seizures"] }
  },

];

export const IV_ANESTHETICS_METADATA = {
  nodeId: "node-8",
  courseId: "basics-of-anesthesia",
  chapter: "Chapter 8",
  title: "IV Anesthetics",
  questionSetId: "node-8-chapter-8-iv-anesthetics",
  tags: ["node-8", "chapter-8", "iv-anesthetics", "nbcrna-style"],
  totalQuestions: IV_ANESTHETICS_QUESTIONS.length,
  questionTypes: {
    mcq:   IV_ANESTHETICS_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: IV_ANESTHETICS_QUESTIONS.filter(q => q.type === 'multi').length,
    short: IV_ANESTHETICS_QUESTIONS.filter(q => q.type === 'short').length,
  }
};
