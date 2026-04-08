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
    acceptedAnswers: ["Gamma-aminobutyric acid", "GABA"],
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
    acceptedAnswers: ["By decreasing the rate of dissociation", "Decreasing the rate of dissociation"],
    rationale: "Barbiturates enhance the action of GABA by binding to the receptor and decreasing the rate of dissociation of GABA, which increases the duration that the chloride channel remains open.",
    metadata: { topic: "Barbiturates", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "barbiturates", "gaba", "high-yield", "short-answer"] }
  },

  {
    id: "n8c8-q004",
    type: "short",
    prompt: "Which anatomical system located within the brainstem is directly targeted by most intravenous anesthetics to control consciousness?",
    setup: "",
    acceptedAnswers: ["Reticular Activating System", "RAS"],
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
    acceptedAnswers: ["Presynaptic axon terminals", "Axon terminals"],
    rationale: "GABA is synthesized and stored directly in the presynaptic axon terminals.",
    metadata: { topic: "General CNS", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "general-cns", "gaba", "short-answer"] }
  },

  {
    id: "n8c8-q007",
    type: "short",
    prompt: "What specific ion is responsible for triggering the release of GABA into the synaptic cleft during a nerve action potential?",
    setup: "",
    acceptedAnswers: ["Calcium ions", "Calcium", "Ca2+"],
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
    acceptedAnswers: ["Intramuscularly and Rectally", "IM and Rectally", "IM and rectal"],
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
    acceptedAnswers: ["Methohexital"],
    rationale: "While all barbiturates increase the seizure threshold, methohexital has the least effect on it and can even cause epileptiform seizures at large doses, making it the drug of choice for ECT.",
    metadata: { topic: "Barbiturates", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "barbiturates", "ect", "short-answer"] }
  },

  {
    id: "n8c8-q013",
    type: "short",
    prompt: "What is the specific elimination half-life of the barbiturate methohexital?",
    setup: "",
    acceptedAnswers: ["3.9 hours", "3.9 hrs", "3.9"],
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
    acceptedAnswers: ["Increases metabolism; shortens duration", "Increases metabolism", "Shortens duration"],
    rationale: "Chronic barbiturate use induces the cytochrome P450 enzyme system, which increases the metabolism of other drugs and shortens their clinical duration of action.",
    metadata: { topic: "Barbiturates", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "barbiturates", "drug-interactions", "short-answer"] }
  },

  {
    id: "n8c8-q017",
    type: "short",
    prompt: "How do extremely high, deep-coma doses of barbiturates distinctly act upon the GABA receptors compared to lower induction doses?",
    setup: "",
    acceptedAnswers: ["Directly activate GABA receptors", "Directly activate GABA"],
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
    acceptedAnswers: ["Garlic or metal taste", "Metal taste", "Garlic taste"],
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
    ],
    rationale: "The total clearance of propofol exceeds hepatic blood flow, meaning extrahepatic metabolism occurs. The kidney, small intestine, and lungs account for 40% of its clearance.",
    metadata: { topic: "Propofol", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "propofol", "pharmacokinetics", "short-answer"] }
  },

  {
    id: "n8c8-q024",
    type: "short",
    prompt: "Approximately what percentage of a propofol bolus dose is actively eliminated by the lungs via first-pass metabolism?",
    setup: "",
    acceptedAnswers: ["30 percent", "30%", "30"],
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
    acceptedAnswers: ["Arterial and venous vasodilation", "Vasodilation", "Arterial and venous dilation"],
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
    acceptedAnswers: ["Within 6 hours", "6 hours", "6 hrs"],
    rationale: "Propofol supports bacterial growth because it lacks preservatives. Sterile technique must be used, and any open vial must be discarded within 6 hours.",
    metadata: { topic: "Propofol", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "propofol", "safety", "short-answer"] }
  },

  {
    id: "n8c8-q030",
    type: "short",
    prompt: "How long is the standard clinical duration of a single induction dose of propofol?",
    setup: "",
    acceptedAnswers: ["3 to 8 minutes", "3-8 minutes", "3 to 8 min"],
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
    acceptedAnswers: ["Beta-1 subunit", "β1 subunit", "Beta 1 subunit"],
    rationale: "While benzodiazepines target a different subunit, propofol has its primary effect on the beta-1 subunit of the GABA receptor.",
    metadata: { topic: "Propofol", priority: "medium", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "propofol", "gaba", "short-answer"] }
  },

  // ─── BENZODIAZEPINES ──────────────────────────────────────────────────────────

  {
    id: "n8c8-q033",
    type: "short",
    prompt: "What specific chemical structure acts as the foundational component for all benzodiazepine medications utilized in anesthesia?",
    setup: "",
    acceptedAnswers: ["A stable benzene ring", "Stable benzene ring", "Benzene ring"],
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
    acceptedAnswers: ["Due to extrapyramidal effects", "Extrapyramidal effects"],
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
    acceptedAnswers: ["Chemoreceptor trigger zone", "CTZ"],
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
    acceptedAnswers: ["N-methyl-D-aspartate", "NMDA", "NMDA receptor"],
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
    ],
    rationale: "Ketamine stimulates the sympathetic nervous system and inhibits norepinephrine reuptake, leading to increased blood pressure, heart rate, and cardiac output.",
    metadata: { topic: "Ketamine", priority: "high", category: "iv-anesthetics", source: "node-8-chapter-8", tags: ["node-8", "chapter-8", "iv-anesthetics", "ketamine", "cardiovascular", "high-yield", "short-answer"] }
  },

  {
    id: "n8c8-q054",
    type: "short",
    prompt: "Why is ketamine considered a highly advantageous induction agent for a patient with severe asthma?",
    setup: "",
    acceptedAnswers: ["It is a potent bronchodilator", "Potent bronchodilator", "Bronchodilator"],
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
    acceptedAnswers: ["Myoclonus"],
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
