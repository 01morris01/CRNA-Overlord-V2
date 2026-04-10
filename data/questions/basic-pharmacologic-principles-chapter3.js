/**
 * Basic Pharmacologic Principles — Chapter 3
 * Course: Basics of Anesthesia  |  Node: node-3
 * 60 questions: 50 mcq, 10 multi
 */

export const PHARM_PRINCIPLES_QUESTIONS = [

  // ── 001 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-001",
    type: "mcq",
    prompt: "How is pharmacokinetics defined in clinical pharmacology?",
    ans: [
      { t: "The relationship between drug dose and drug concentration at the site of drug action.", ok: true  },
      { t: "The relationship between drug concentration and the resulting physiological effect.",   ok: false },
      { t: "The relationship between receptor affinity and intrinsic activity.",                    ok: false },
      { t: "The relationship between enzymatic destruction and renal tubular secretion.",           ok: false },
    ],
    rationale: "Pharmacokinetics describes what the body does to the drug and links dose to concentration at the site of action.",
    metadata: { tags: ["basic pharmacologic principles", "pharmacokinetics"] },
  },

  // ── 002 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-002",
    type: "mcq",
    prompt: "What term describes the mathematically derived virtual location where an anesthetic drug exerts its clinical effect?",
    ans: [
      { t: "Effect-site concentration.",     ok: true  },
      { t: "Steady-state compartment.",      ok: false },
      { t: "Central biophase volume.",       ok: false },
      { t: "Peripheral tissue volume.",      ok: false },
    ],
    rationale: "The effect-site concentration is a mathematical construct representing where drug effect occurs.",
    metadata: { tags: ["basic pharmacologic principles", "effect-site concentration"] },
  },

  // ── 003 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-003",
    type: "mcq",
    prompt: "What term describes the time delay between changes in plasma concentration and the actual clinical drug effect?",
    ans: [
      { t: "Biophase.",   ok: true  },
      { t: "Dynamic range.", ok: false },
      { t: "Clearance.", ok: false },
      { t: "Kinetics.",  ok: false },
    ],
    rationale: "Biophase describes the delay between plasma concentration changes and observed effect.",
    metadata: { tags: ["basic pharmacologic principles", "biophase"] },
  },

  // ── 004 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-004",
    type: "mcq",
    prompt: "How is front-end kinetics defined in intravenous drug administration?",
    ans: [
      { t: "Drug behavior immediately after initial administration.",    ok: true  },
      { t: "Drug behavior during a long continuous infusion.",           ok: false },
      { t: "Drug behavior immediately after infusion end.",             ok: false },
      { t: "Drug behavior at steady state only.",                        ok: false },
    ],
    rationale: "Front-end kinetics describes IV drug behavior immediately after administration.",
    metadata: { tags: ["basic pharmacologic principles", "front-end kinetics"] },
  },

  // ── 005 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-005",
    type: "mcq",
    prompt: "How is the dynamic range of a drug defined?",
    ans: [
      { t: "The concentration range in which changes in drug effect occur.",       ok: true  },
      { t: "The concentration range in which no physiological changes occur.",     ok: false },
      { t: "The time range in which concentration changes occur.",                 ok: false },
      { t: "The time range in which no concentration changes occur.",              ok: false },
    ],
    rationale: "Dynamic range is the drug concentration range over which changes in effect occur.",
    metadata: { tags: ["basic pharmacologic principles", "dynamic range"] },
  },

  // ── 006 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-006",
    type: "mcq",
    prompt: "When a patient exhibits an expected physiological result from an exceptionally low dose of a medication, what term describes this response?",
    ans: [
      { t: "Hyperreactive response.",     ok: true  },
      { t: "Hyporeactive response.",      ok: false },
      { t: "Hypersensitive response.",    ok: false },
      { t: "Tachyphylactic response.",    ok: false },
    ],
    rationale: "Hyperreactive describes an expected effect occurring at an unusually low dose.",
    metadata: { tags: ["basic pharmacologic principles", "drug responses", "hyperreactive"] },
  },

  // ── 007 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-007",
    type: "mcq",
    prompt: "When a patient exhibits an allergy or severe sensitivity to a drug, what term describes this response?",
    ans: [
      { t: "Hypersensitive response.",    ok: true  },
      { t: "Hyporeactive response.",      ok: false },
      { t: "Hyperreactive response.",     ok: false },
      { t: "Tachyphylactic response.",    ok: false },
    ],
    rationale: "Hypersensitive refers to an allergic or sensitivity-based response.",
    metadata: { tags: ["basic pharmacologic principles", "drug responses", "hypersensitivity"] },
  },

  // ── 008 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-008",
    type: "mcq",
    prompt: "How does tachyphylaxis differ from standard pharmacological tolerance?",
    ans: [
      { t: "Tachyphylaxis is acute tolerance acquired after only a few doses.",         ok: true  },
      { t: "Tachyphylaxis is chronic tolerance acquired after long-term exposure.",     ok: false },
      { t: "Tachyphylaxis increases receptor number.",                                  ok: false },
      { t: "Tachyphylaxis destroys receptors.",                                         ok: false },
    ],
    rationale: "Tachyphylaxis is acute tolerance that develops rapidly after only a few doses.",
    metadata: { tags: ["basic pharmacologic principles", "tachyphylaxis", "tolerance"] },
  },

  // ── 009 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-009",
    type: "mcq",
    prompt: "What mathematical representation defines an additive drug effect?",
    ans: [
      { t: "1 + 1 = 2", ok: true  },
      { t: "1 + 1 = 3", ok: false },
      { t: "1 + 1 = 0", ok: false },
      { t: "1 + 1 = 1", ok: false },
    ],
    rationale: "An additive effect means the combined result equals the sum of both drugs.",
    metadata: { tags: ["basic pharmacologic principles", "drug interactions", "additive"] },
  },

  // ── 010 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-010",
    type: "mcq",
    prompt: "What mathematical representation defines a synergistic drug effect?",
    ans: [
      { t: "1 + 1 = 3", ok: true  },
      { t: "1 + 1 = 2", ok: false },
      { t: "1 + 1 = 0", ok: false },
      { t: "1 + 1 = 1", ok: false },
    ],
    rationale: "A synergistic effect means the combined result is greater than the sum of the individual effects.",
    metadata: { tags: ["basic pharmacologic principles", "drug interactions", "synergy"] },
  },

  // ── 011 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-011",
    type: "mcq",
    prompt: "How does a noncompetitive antagonist alter the interaction between an agonist and its receptor?",
    ans: [
      { t: "It blocks the receptor so that even high agonist concentrations cannot overcome it.", ok: true  },
      { t: "It loosely blocks the receptor so high agonist concentrations can easily overcome it.", ok: false },
      { t: "It permanently destroys the receptor.",                                               ok: false },
      { t: "It detaches the receptor from the cell.",                                             ok: false },
    ],
    rationale: "Noncompetitive antagonism cannot be overcome by simply increasing agonist concentration.",
    metadata: { tags: ["basic pharmacologic principles", "antagonism", "noncompetitive antagonist"] },
  },

  // ── 012 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-012",
    type: "mcq",
    prompt: "Which formula accurately represents the volume of distribution (Vd)?",
    ans: [
      { t: "Amount of drug in body divided by drug concentration in blood.",              ok: true  },
      { t: "Drug concentration in blood divided by amount of drug in body.",              ok: false },
      { t: "Amount of drug in body multiplied by concentration in blood.",                ok: false },
      { t: "Drug concentration in blood multiplied by renal elimination rate.",           ok: false },
    ],
    rationale: "Vd equals amount of drug in the body divided by measured concentration.",
    metadata: { tags: ["basic pharmacologic principles", "volume of distribution", "equations"] },
  },

  // ── 013 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-013",
    type: "mcq",
    prompt: "The volume of distribution of the central compartment (Vd-cc) is typically similar in size to what physiological space?",
    ans: [
      { t: "Total plasma volume.",    ok: true  },
      { t: "Total adipose volume.",   ok: false },
      { t: "Total muscle volume.",    ok: false },
      { t: "Total gastric volume.",   ok: false },
    ],
    rationale: "Immediately after IV bolus and before distribution, the central compartment approximates plasma volume.",
    metadata: { tags: ["basic pharmacologic principles", "central compartment", "volume of distribution"] },
  },

  // ── 014 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-014",
    type: "mcq",
    prompt: "At steady-state volume of distribution (Vd-ss), which condition is met?",
    ans: [
      { t: "Drug input equals drug loss from the body.",                                  ok: true  },
      { t: "Drug input exceeds drug loss.",                                               ok: false },
      { t: "Free drug concentration is isolated to the central compartment.",             ok: false },
      { t: "Free drug concentration is isolated to the peripheral compartment.",          ok: false },
    ],
    rationale: "At steady state, input and elimination are equal and free drug concentrations have equilibrated across compartments.",
    metadata: { tags: ["basic pharmacologic principles", "steady state", "volume of distribution"] },
  },

  // ── 015 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-015",
    type: "multi",
    prompt: "Which organs are the two major sites of drug elimination? Select 2.",
    choices: ["Kidneys.", "Liver.", "Spleen.", "Stomach."],
    correctAnswers: ["Kidneys.", "Liver."],
    selectCount: 2,
    rationale: "The kidneys and liver are the primary organs responsible for elimination.",
    metadata: { tags: ["basic pharmacologic principles", "elimination", "kidneys", "liver"] },
  },

  // ── 016 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-016",
    type: "mcq",
    prompt: "Which formula represents the rate of drug elimination?",
    ans: [
      { t: "Clearance multiplied by concentration.", ok: true  },
      { t: "Clearance divided by concentration.",    ok: false },
      { t: "Concentration divided by clearance.",    ok: false },
      { t: "Concentration minus clearance.",         ok: false },
    ],
    rationale: "Rate of elimination equals clearance times concentration.",
    metadata: { tags: ["basic pharmacologic principles", "clearance", "elimination rate"] },
  },

  // ── 017 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-017",
    type: "mcq",
    prompt: "Area under the concentration-time curve (AUC) is commonly used as a measure of what?",
    ans: [
      { t: "Overall extent of drug bioavailability by a given route.",           ok: true  },
      { t: "Overall extent of drug toxicity in the central nervous system.",     ok: false },
      { t: "Overall extent of plasma protein binding.",                          ok: false },
      { t: "Overall extent of lipid membrane binding.",                          ok: false },
    ],
    rationale: "AUC reflects overall exposure and is commonly used as a measure of bioavailability.",
    metadata: { tags: ["basic pharmacologic principles", "AUC", "bioavailability"] },
  },

  // ── 018 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-018",
    type: "multi",
    prompt: "Which medications demonstrate capacity-limited, zero-order elimination kinetics? Select 3.",
    choices: [
      "Acetylsalicylic acid (ASA).",
      "Phenytoin.",
      "Ethanol.",
      "Fentanyl.",
      "Midazolam.",
    ],
    correctAnswers: ["Acetylsalicylic acid (ASA).", "Phenytoin.", "Ethanol."],
    selectCount: 3,
    rationale: "ASA, phenytoin, and ethanol are classic examples of capacity-limited elimination.",
    metadata: { tags: ["basic pharmacologic principles", "zero-order kinetics", "capacity-limited elimination"] },
  },

  // ── 019 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-019",
    type: "mcq",
    prompt: "For highly extracted drugs using flow-dependent elimination, what primarily determines the elimination rate?",
    ans: [
      { t: "Blood flow to the eliminating organ.",               ok: true  },
      { t: "Amount of adipose tissue available for storage.",    ok: false },
      { t: "Renal tubular oxidation capacity.",                  ok: false },
      { t: "Structural polarity of the medication.",             ok: false },
    ],
    rationale: "For highly extracted drugs, elimination depends primarily on blood flow to the organ.",
    metadata: { tags: ["basic pharmacologic principles", "flow-dependent elimination", "high extraction"] },
  },

  // ── 020 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-020",
    type: "mcq",
    prompt: "What percentage of the initial drug amount is eliminated after two half-lives?",
    ans: [
      { t: "75.0 percent.", ok: true  },
      { t: "50.0 percent.", ok: false },
      { t: "87.5 percent.", ok: false },
      { t: "93.8 percent.", ok: false },
    ],
    rationale: "After two half-lives, one quarter remains, so 75 percent has been eliminated.",
    metadata: { tags: ["basic pharmacologic principles", "half-life", "elimination"] },
  },

  // ── 021 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-021",
    type: "mcq",
    prompt: "What percentage of the initial drug amount is eliminated after four half-lives?",
    ans: [
      { t: "93.8 percent.", ok: true  },
      { t: "87.5 percent.", ok: false },
      { t: "96.9 percent.", ok: false },
      { t: "98.4 percent.", ok: false },
    ],
    rationale: "After four half-lives, one sixteenth remains, so 93.8 percent has been eliminated.",
    metadata: { tags: ["basic pharmacologic principles", "half-life", "elimination"] },
  },

  // ── 022 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-022",
    type: "mcq",
    prompt: "What percentage of the initial drug amount is eliminated after six half-lives?",
    ans: [
      { t: "98.4 percent.", ok: true  },
      { t: "96.9 percent.", ok: false },
      { t: "93.8 percent.", ok: false },
      { t: "87.5 percent.", ok: false },
    ],
    rationale: "After six half-lives, one sixty-fourth remains, so 98.4 percent has been eliminated.",
    metadata: { tags: ["basic pharmacologic principles", "half-life", "elimination"] },
  },

  // ── 023 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-023",
    type: "mcq",
    prompt: "In a one-compartment pharmacokinetic model, which assumption is made once equilibrium occurs?",
    ans: [
      { t: "Drug concentration at the site of action equals plasma concentration.",      ok: true  },
      { t: "Drug concentration at the site of action equals adipose concentration.",     ok: false },
      { t: "Drug bypasses the systemic circulation entirely.",                           ok: false },
      { t: "Drug binds exclusively to peripheral proteins.",                             ok: false },
    ],
    rationale: "In a one-compartment model at equilibrium, the concentration at the site of action is assumed to match plasma concentration.",
    metadata: { tags: ["basic pharmacologic principles", "one-compartment model"] },
  },

  // ── 024 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-024",
    type: "multi",
    prompt: "Which structures belong to the central compartment? Select 4.",
    choices: ["Brain.", "Lungs.", "Heart.", "Liver.", "Muscle.", "Fat."],
    correctAnswers: ["Brain.", "Lungs.", "Heart.", "Liver."],
    selectCount: 4,
    rationale: "The central compartment is made up of highly perfused tissues such as the brain, lungs, heart, and liver.",
    metadata: { tags: ["basic pharmacologic principles", "central compartment", "distribution"] },
  },

  // ── 025 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-025",
    type: "mcq",
    prompt: "What percentage of total cardiac output does the central compartment receive despite being only about 10 percent of body mass?",
    ans: [
      { t: "75 percent.", ok: true  },
      { t: "25 percent.", ok: false },
      { t: "95 percent.", ok: false },
      { t: "50 percent.", ok: false },
    ],
    rationale: "The central compartment receives about 75 percent of blood flow despite representing only about 10 percent of body mass.",
    metadata: { tags: ["basic pharmacologic principles", "central compartment", "cardiac output"] },
  },

  // ── 026 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-026",
    type: "multi",
    prompt: "Which structures belong to the peripheral compartment? Select 2.",
    choices: ["Fat.", "Muscle.", "Heart.", "Brain."],
    correctAnswers: ["Fat.", "Muscle."],
    selectCount: 2,
    rationale: "The peripheral compartment includes lower-perfusion tissues such as fat and muscle.",
    metadata: { tags: ["basic pharmacologic principles", "peripheral compartment", "distribution"] },
  },

  // ── 027 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-027",
    type: "mcq",
    prompt: "How does the ED50 of an inhalational anesthetic compare to MAC?",
    ans: [
      { t: "ED50 is the same as MAC.",        ok: true  },
      { t: "ED50 is double MAC.",             ok: false },
      { t: "ED50 is half of MAC.",            ok: false },
      { t: "ED50 is unrelated to MAC.",       ok: false },
    ],
    rationale: "For inhaled anesthetics, ED50 corresponds to MAC.",
    metadata: { tags: ["basic pharmacologic principles", "ED50", "MAC"] },
  },

  // ── 028 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-028",
    type: "mcq",
    prompt: "How is the therapeutic index calculated?",
    ans: [
      { t: "LD50 divided by ED50.",           ok: true  },
      { t: "ED50 divided by LD50.",           ok: false },
      { t: "LD50 multiplied by ED50.",        ok: false },
      { t: "ED50 subtracted from LD50.",      ok: false },
    ],
    rationale: "Therapeutic index is the ratio of lethal dose 50 to effective dose 50.",
    metadata: { tags: ["basic pharmacologic principles", "therapeutic index", "ED50", "LD50"] },
  },

  // ── 029 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-029",
    type: "mcq",
    prompt: "What reduces the overall bioavailability of an orally administered drug before it reaches systemic circulation?",
    ans: [
      { t: "First-pass elimination and incomplete gut absorption.",                ok: true  },
      { t: "Massive renal filtration and complete gut absorption.",                ok: false },
      { t: "Rapid biliary excretion and alveolar dead space.",                     ok: false },
      { t: "Pulmonary shunting and alveolar dead space.",                          ok: false },
    ],
    rationale: "Oral bioavailability is reduced by first-pass metabolism and incomplete absorption from the GI tract.",
    metadata: { tags: ["basic pharmacologic principles", "bioavailability", "first-pass effect"] },
  },

  // ── 030 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-030",
    type: "multi",
    prompt: "Which functional group modifications are associated with Phase I metabolism? Select 4.",
    choices: [
      "Oxidation.",
      "Reduction.",
      "Hydroxylation.",
      "De-methylation.",
      "Acetylation.",
      "Conjugation.",
    ],
    correctAnswers: ["Oxidation.", "Reduction.", "Hydroxylation.", "De-methylation."],
    selectCount: 4,
    rationale: "Phase I metabolism includes oxidation, reduction, hydroxylation, and de-methylation.",
    metadata: { tags: ["basic pharmacologic principles", "phase I metabolism"] },
  },

  // ── 031 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-031",
    type: "multi",
    prompt: "Which compounds are used in Phase II conjugation reactions? Select 4.",
    choices: [
      "Glucuronic acid compounds.",
      "Glutathione compounds.",
      "Sulfonic acid compounds.",
      "Acetylation compounds.",
      "De-methylation compounds.",
      "Oxidation compounds.",
    ],
    correctAnswers: [
      "Glucuronic acid compounds.",
      "Glutathione compounds.",
      "Sulfonic acid compounds.",
      "Acetylation compounds.",
    ],
    selectCount: 4,
    rationale: "Phase II metabolism involves conjugation with compounds such as glucuronic acid, glutathione, sulfate, and acetyl groups.",
    metadata: { tags: ["basic pharmacologic principles", "phase II metabolism", "conjugation"] },
  },

  // ── 032 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-032",
    type: "mcq",
    prompt: "What physical properties describe the metabolites produced by Phase II metabolism?",
    ans: [
      { t: "Larger molecular weight, highly polar, and largely inactive.",        ok: true  },
      { t: "Smaller molecular weight, highly nonpolar, and largely active.",      ok: false },
      { t: "Larger molecular weight, highly nonpolar, and largely inactive.",     ok: false },
      { t: "Smaller molecular weight, highly polar, and largely active.",         ok: false },
    ],
    rationale: "Phase II products are generally larger, more polar, and less active, which facilitates excretion.",
    metadata: { tags: ["basic pharmacologic principles", "phase II metabolism", "metabolites"] },
  },

  // ── 033 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-033",
    type: "mcq",
    prompt: "What formula determines hepatic extraction ratio (ER)?",
    ans: [
      { t: "Hepatic clearance divided by total hepatic blood flow.",           ok: true  },
      { t: "Total hepatic blood flow divided by hepatic clearance.",           ok: false },
      { t: "Hepatic clearance multiplied by hepatic blood flow.",              ok: false },
      { t: "Total hepatic blood flow minus hepatic clearance.",                ok: false },
    ],
    rationale: "Hepatic extraction ratio equals clearance divided by blood flow.",
    metadata: { tags: ["basic pharmacologic principles", "hepatic extraction ratio", "equations"] },
  },

  // ── 034 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-034",
    type: "multi",
    prompt: "Which pharmacokinetic properties characterize hydrophilic drugs? Select 4.",
    choices: [
      "Poor tissue and CNS penetration.",
      "High renal elimination of unchanged drug.",
      "Apparent volume of distribution around 0.65 L/kg.",
      "Small and highly polar molecular structures.",
      "Extremely high plasma protein binding.",
      "Predominant extensive hepatic metabolism.",
    ],
    correctAnswers: [
      "Poor tissue and CNS penetration.",
      "High renal elimination of unchanged drug.",
      "Apparent volume of distribution around 0.65 L/kg.",
      "Small and highly polar molecular structures.",
    ],
    selectCount: 4,
    rationale: "Hydrophilic drugs are generally polar, distribute less extensively, penetrate the CNS poorly, and are more likely to be excreted unchanged by the kidneys.",
    metadata: { tags: ["basic pharmacologic principles", "hydrophilic drugs"] },
  },

  // ── 035 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-035",
    type: "multi",
    prompt: "Which pharmacokinetic properties characterize lipophilic drugs? Select 4.",
    choices: [
      "Predominant hepatic metabolism.",
      "Greater tissue and CNS penetration.",
      "Apparent volume of distribution significantly greater than 1 L/kg.",
      "Higher protein binding.",
      "High renal elimination of unchanged drug.",
      "Small highly polar molecular structures.",
    ],
    correctAnswers: [
      "Predominant hepatic metabolism.",
      "Greater tissue and CNS penetration.",
      "Apparent volume of distribution significantly greater than 1 L/kg.",
      "Higher protein binding.",
    ],
    selectCount: 4,
    rationale: "Lipophilic drugs distribute extensively, penetrate tissue and CNS more readily, bind protein more, and often require hepatic metabolism.",
    metadata: { tags: ["basic pharmacologic principles", "lipophilic drugs"] },
  },

  // ── 036 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-036",
    type: "mcq",
    prompt: "Which intervention directly disrupts reabsorption of drug metabolites excreted into the GI tract via the biliary system?",
    ans: [
      { t: "Activated charcoal.", ok: true  },
      { t: "Sodium bicarbonate.", ok: false },
      { t: "Neostigmine.",        ok: false },
      { t: "Flumazenil.",         ok: false },
    ],
    rationale: "Activated charcoal can interrupt enterohepatic recirculation by binding drug in the GI tract.",
    metadata: { tags: ["basic pharmacologic principles", "biliary excretion", "activated charcoal"] },
  },

  // ── 037 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-037",
    type: "mcq",
    prompt: "During renal drug excretion, glomerular filtration removes what fraction of a drug?",
    ans: [
      { t: "Only the free, unbound drug from plasma.",           ok: true  },
      { t: "Only the heavily protein-bound drug from plasma.",   ok: false },
      { t: "Only active nonpolar metabolites.",                  ok: false },
      { t: "Only inactive nonpolar metabolites.",                ok: false },
    ],
    rationale: "Only the free, unbound fraction is filtered at the glomerulus.",
    metadata: { tags: ["basic pharmacologic principles", "renal excretion", "glomerular filtration"] },
  },

  // ── 038 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-038",
    type: "mcq",
    prompt: "Where does active tubular secretion of acidic and basic drugs occur in the kidney?",
    ans: [
      { t: "Proximal tubule.",    ok: true  },
      { t: "Distal tubule.",      ok: false },
      { t: "Loop of Henle.",      ok: false },
      { t: "Collecting duct.",    ok: false },
    ],
    rationale: "Active secretion of many acidic and basic drugs occurs in the proximal tubule.",
    metadata: { tags: ["basic pharmacologic principles", "renal excretion", "proximal tubule"] },
  },

  // ── 039 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-039",
    type: "mcq",
    prompt: "How is pharmacodynamics defined in clinical pharmacology?",
    ans: [
      { t: "What the drug does to the body, including concentration-effect relationships.", ok: true  },
      { t: "What the body does to the drug, including absorption and elimination.",          ok: false },
      { t: "Exact half-life variations among drug families.",                                ok: false },
      { t: "Exact clearance capacities of organ systems.",                                  ok: false },
    ],
    rationale: "Pharmacodynamics describes the effect of drug concentration on biological effect.",
    metadata: { tags: ["basic pharmacologic principles", "pharmacodynamics"] },
  },

  // ── 040 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-040",
    type: "mcq",
    prompt: "According to receptor theory, what term defines how well a compound is drawn into and held at a binding site?",
    ans: [
      { t: "Affinity.",           ok: true  },
      { t: "Intrinsic activity.", ok: false },
      { t: "Biodynamic state.",   ok: false },
      { t: "Tachyphylactic rate.", ok: false },
    ],
    rationale: "Affinity describes how strongly a ligand binds to its receptor.",
    metadata: { tags: ["basic pharmacologic principles", "receptors", "affinity"] },
  },

  // ── 041 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-041",
    type: "mcq",
    prompt: "If a ligand has excellent affinity for a receptor but zero intrinsic activity, what physiological effect results?",
    ans: [
      { t: "It will be ineffective at producing a functional change.",          ok: true  },
      { t: "It will produce a massive uncontrolled response.",                  ok: false },
      { t: "It will convert the receptor into an ion channel pore.",            ok: false },
      { t: "It will permanently destroy the receptor complex.",                 ok: false },
    ],
    rationale: "A ligand with affinity but no intrinsic activity binds without activating the receptor, functioning as an antagonist.",
    metadata: { tags: ["basic pharmacologic principles", "receptors", "intrinsic activity", "antagonist"] },
  },

  // ── 042 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-042",
    type: "mcq",
    prompt: "Ligand-receptor interaction is primarily governed by the random movement of molecules known as what phenomenon?",
    ans: [
      { t: "Brownian motion.",  ok: true  },
      { t: "Newtonian motion.", ok: false },
      { t: "Laplace tension.",  ok: false },
      { t: "Poiseuille flow.",  ok: false },
    ],
    rationale: "Random molecular motion responsible for collision and binding opportunity is Brownian motion.",
    metadata: { tags: ["basic pharmacologic principles", "receptors", "Brownian motion"] },
  },

  // ── 043 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-043",
    type: "mcq",
    prompt: "Which drug is a classic example of a partial agonist with good affinity but less than ideal intrinsic activity?",
    ans: [
      { t: "Buprenorphine.",  ok: true  },
      { t: "Isoproterenol.",  ok: false },
      { t: "Vecuronium.",     ok: false },
      { t: "Neostigmine.",    ok: false },
    ],
    rationale: "Buprenorphine is a partial agonist at the mu opioid receptor.",
    metadata: { tags: ["basic pharmacologic principles", "partial agonist", "buprenorphine"] },
  },

  // ── 044 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-044",
    type: "mcq",
    prompt: "How is fentanyl classified relative to opioid receptor binding and effect magnitude?",
    ans: [
      { t: "Superagonist.",    ok: true  },
      { t: "Partial agonist.", ok: false },
      { t: "Inverse agonist.", ok: false },
      { t: "Full antagonist.", ok: false },
    ],
    rationale: "This source set classifies fentanyl as a superagonist because of its high potency relative to morphine.",
    metadata: { tags: ["basic pharmacologic principles", "fentanyl", "superagonist"] },
  },

  // ── 045 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-045",
    type: "mcq",
    prompt: "Which drug acts as a selective beta-2 agonist?",
    ans: [
      { t: "Albuterol.",      ok: true  },
      { t: "Vecuronium.",     ok: false },
      { t: "Neostigmine.",    ok: false },
      { t: "Buprenorphine.",  ok: false },
    ],
    rationale: "Albuterol is a selective beta-2 agonist.",
    metadata: { tags: ["basic pharmacologic principles", "beta-2 agonist", "albuterol"] },
  },

  // ── 046 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-046",
    type: "mcq",
    prompt: "Which property combination defines a competitive antagonist such as vecuronium?",
    ans: [
      { t: "High receptor affinity with no intrinsic activity.",        ok: true  },
      { t: "High intrinsic activity with no receptor affinity.",        ok: false },
      { t: "Low receptor affinity with high intrinsic activity.",       ok: false },
      { t: "Zero affinity and zero intrinsic activity.",                ok: false },
    ],
    rationale: "Competitive antagonists bind receptors well but do not activate them.",
    metadata: { tags: ["basic pharmacologic principles", "competitive antagonist", "vecuronium"] },
  },

  // ── 047 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-047",
    type: "mcq",
    prompt: "How does neostigmine reverse neuromuscular blockade caused by a competitive antagonist such as vecuronium?",
    ans: [
      { t: "It inhibits acetylcholinesterase, increasing acetylcholine so it can outcompete the antagonist.", ok: true  },
      { t: "It stimulates acetylcholinesterase to destroy acetylcholine.",                                    ok: false },
      { t: "It directly destroys vecuronium molecules in plasma.",                                           ok: false },
      { t: "It forcefully closes postsynaptic ion channels.",                                                 ok: false },
    ],
    rationale: "Neostigmine raises acetylcholine concentration at the receptor by inhibiting acetylcholinesterase.",
    metadata: { tags: ["basic pharmacologic principles", "neostigmine", "competitive antagonism", "neuromuscular blockade"] },
  },

  // ── 048 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-048",
    type: "mcq",
    prompt: "What receptor adaptation is expected after prolonged administration of an antagonist drug?",
    ans: [
      { t: "Up-regulation causing hypersensitivity to agonists.",          ok: true  },
      { t: "Down-regulation causing hyposensitivity to agonists.",         ok: false },
      { t: "Destruction of all receptor sites.",                           ok: false },
      { t: "Prevention of all cellular adaptation.",                       ok: false },
    ],
    rationale: "Long-term blockade often leads to up-regulation and increased sensitivity to agonists.",
    metadata: { tags: ["basic pharmacologic principles", "receptor regulation", "up-regulation"] },
  },

  // ── 049 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-049",
    type: "mcq",
    prompt: "What receptor adaptation is expected after prolonged administration of an agonist drug?",
    ans: [
      { t: "Down-regulation causing hyposensitivity to agonists.", ok: true  },
      { t: "Up-regulation causing hypersensitivity to agonists.",  ok: false },
      { t: "Destruction of all receptor sites.",                   ok: false },
      { t: "Prevention of all cellular adaptation.",               ok: false },
    ],
    rationale: "Prolonged agonist exposure commonly leads to down-regulation and reduced sensitivity.",
    metadata: { tags: ["basic pharmacologic principles", "receptor regulation", "down-regulation"] },
  },

  // ── 050 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-050",
    type: "mcq",
    prompt: "Structurally, ligand-gated ion channels are typically composed of how many protein subunits spanning a membrane?",
    ans: [
      { t: "Five.",  ok: true  },
      { t: "Two.",   ok: false },
      { t: "Ten.",   ok: false },
      { t: "Zero.",  ok: false },
    ],
    rationale: "Ligand-gated ion channels are typically pentameric, with five subunits.",
    metadata: { tags: ["basic pharmacologic principles", "ligand-gated ion channels"] },
  },

  // ── 051 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-051",
    type: "multi",
    prompt: "Which neurotransmitters actively control ligand-gated ion channels in the human nervous system? Select 4.",
    choices: [
      "Acetylcholine.",
      "Glycine.",
      "Serotonin.",
      "GABA.",
      "Isoproterenol.",
      "Buprenorphine.",
    ],
    correctAnswers: ["Acetylcholine.", "Glycine.", "Serotonin.", "GABA."],
    selectCount: 4,
    rationale: "Examples of neurotransmitters that act through ligand-gated ion channels include acetylcholine, glycine, serotonin, and GABA.",
    metadata: { tags: ["basic pharmacologic principles", "ligand-gated ion channels", "neurotransmitters"] },
  },

  // ── 052 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-052",
    type: "mcq",
    prompt: "How is a drug's back-end kinetics defined?",
    ans: [
      { t: "Drug behavior during a continuous infusion, including the period after infusion ends.", ok: true  },
      { t: "Drug behavior only during the first minutes after IV administration.",                  ok: false },
      { t: "Drug behavior isolated to oral ingestion.",                                             ok: false },
      { t: "Drug behavior before the biophase delay.",                                              ok: false },
    ],
    rationale: "Back-end kinetics describes what happens during an infusion and after the infusion is stopped.",
    metadata: { tags: ["basic pharmacologic principles", "back-end kinetics"] },
  },

  // ── 053 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-053",
    type: "mcq",
    prompt: "How is context-sensitive half-time defined?",
    ans: [
      { t: "The time required for drug concentration to fall by 50 percent after infusion termination, based on infusion duration.", ok: true  },
      { t: "The fixed time required for complete hepatic elimination of a steady-state drug.",                                       ok: false },
      { t: "The constant time for a single bolus to fall by 50 percent in plasma.",                                                 ok: false },
      { t: "The time devoted to initial receptor binding after infusion start.",                                                    ok: false },
    ],
    rationale: "Context-sensitive half-time depends on the duration of infusion and describes how long it takes concentration to fall by half after stopping it.",
    metadata: { tags: ["basic pharmacologic principles", "context-sensitive half-time"] },
  },

  // ── 054 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-054",
    type: "mcq",
    prompt: "Under first-order kinetics, how is a drug eliminated over time?",
    ans: [
      { t: "A constant fraction of the drug is eliminated per unit time.", ok: true  },
      { t: "A constant amount of the drug is eliminated per unit time.",   ok: false },
      { t: "Elimination speed continuously increases over time.",          ok: false },
      { t: "Elimination ceases after the first pass.",                     ok: false },
    ],
    rationale: "In first-order kinetics, elimination rate is proportional to concentration, so a constant fraction is removed over time.",
    metadata: { tags: ["basic pharmacologic principles", "first-order kinetics"] },
  },

  // ── 055 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-055",
    type: "mcq",
    prompt: "Under zero-order kinetics, how is a drug eliminated over time?",
    ans: [
      { t: "A constant amount of the drug is eliminated per unit time.",   ok: true  },
      { t: "A constant fraction of the drug is eliminated per unit time.", ok: false },
      { t: "Elimination speed continuously increases over time.",          ok: false },
      { t: "Elimination ceases after the first pass.",                     ok: false },
    ],
    rationale: "In zero-order kinetics, a fixed amount is eliminated each unit of time regardless of concentration.",
    metadata: { tags: ["basic pharmacologic principles", "zero-order kinetics"] },
  },

  // ── 056 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-056",
    type: "mcq",
    prompt: "What factor determines clearance for drugs exhibiting zero-order, capacity-limited elimination?",
    ans: [
      { t: "The concentration of drug achieved.",                                  ok: true  },
      { t: "Total regional blood flow delivered.",                                 ok: false },
      { t: "Clearance is completely independent of drug concentration.",           ok: false },
      { t: "It is determined entirely by a fixed half-life.",                      ok: false },
    ],
    rationale: "For capacity-limited elimination, clearance depends on the concentration achieved because elimination pathways saturate.",
    metadata: { tags: ["basic pharmacologic principles", "zero-order kinetics", "capacity-limited elimination"] },
  },

  // ── 057 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-057",
    type: "mcq",
    prompt: "Why is use of a single elimination half-life potentially flawed for drugs with multi-compartment pharmacokinetics?",
    ans: [
      { t: "Because half-life is truly mathematically accurate only in a simple one-compartment model.", ok: true  },
      { t: "Because half-life only measures zero-order elimination.",                                    ok: false },
      { t: "Because glomerular filtration nullifies half-life.",                                         ok: false },
      { t: "Because first-pass metabolism destroys half-life calculations.",                             ok: false },
    ],
    rationale: "A single half-life oversimplifies elimination when drugs distribute across multiple compartments.",
    metadata: { tags: ["basic pharmacologic principles", "half-life", "multi-compartment pharmacokinetics"] },
  },

  // ── 058 — multi ──────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-058",
    type: "multi",
    prompt: "Which clinical factors can significantly alter standard pharmacokinetics from the typical healthy adult baseline? Select 3.",
    choices: [
      "General anesthesia.",
      "Extreme age.",
      "Severe systemic co-morbidities.",
      "Localized epidermis.",
      "Minor hair shedding.",
    ],
    correctAnswers: ["General anesthesia.", "Extreme age.", "Severe systemic co-morbidities."],
    selectCount: 3,
    rationale: "General anesthesia, age extremes, and major co-morbidities can all substantially alter normal pharmacokinetic behavior.",
    metadata: { tags: ["basic pharmacologic principles", "pharmacokinetics", "clinical factors"] },
  },

  // ── 059 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-059",
    type: "mcq",
    prompt: "Approximately what fraction of total body mass does the central compartment represent?",
    ans: [
      { t: "About 10 percent.", ok: true  },
      { t: "About 50 percent.", ok: false },
      { t: "About 70 percent.", ok: false },
      { t: "About 90 percent.", ok: false },
    ],
    rationale: "The central compartment includes highly perfused tissues and accounts for roughly 10 percent of body mass.",
    metadata: { tags: ["basic pharmacologic principles", "central compartment"] },
  },

  // ── 060 ──────────────────────────────────────────────────────────────────────
  {
    id: "boa-node3-pharm-060",
    type: "mcq",
    prompt: "What type of ion channel allows ions to pass based only on gradients without gating?",
    ans: [
      { t: "Always-open channels.",         ok: true  },
      { t: "Mechanically gated channels.",  ok: false },
      { t: "Voltage-controlled channels.",  ok: false },
      { t: "Ligand-controlled channels.",   ok: false },
    ],
    rationale: "Some ion channels are constitutively open and allow conductance based only on electrochemical gradients.",
    metadata: { tags: ["basic pharmacologic principles", "ion channels", "always-open channels"] },
  },

];

// ── Metadata ──────────────────────────────────────────────────────────────────

const _mcqCount   = PHARM_PRINCIPLES_QUESTIONS.filter(q => q.type === 'mcq').length;
const _multiCount = PHARM_PRINCIPLES_QUESTIONS.filter(q => q.type === 'multi').length;

export const PHARM_PRINCIPLES_METADATA = {
  nodeId:    "node-3",
  courseId:  "basics-of-anesthesia",
  chapter:   "Chapter 3",
  title:     "Basic Pharmacologic Principles",
  totalQuestions: PHARM_PRINCIPLES_QUESTIONS.length,
  questionTypes: { mcq: _mcqCount, multi: _multiCount, short: 0 },
};
