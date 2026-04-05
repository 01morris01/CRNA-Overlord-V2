/**
 * OPIOIDS QUESTION BANK - Chapter 9
 * Course: Basics of Anesthesia
 * Node: node-9
 * Topic: Opioids
 * 
 * Question Types:
 * - mcq: Multiple choice (single best answer)
 * - multi: Select all that apply (multiple correct answers)
 * - short: Short answer (flexible grading)
 */

export const OPIOIDS_QUESTIONS = [
  // ===========================
  // HIGHEST-PRIORITY YIELD
  // ===========================
  
  // Q1 - MCQ
  {
    id: "opioid-001",
    type: "mcq",
    prompt: "Which of the following lists correctly ranks these opioids by potency from least to most potent?",
    choices: [
      "Meperidine, Morphine, Hydromorphone, Fentanyl",
      "Fentanyl, Hydromorphone, Morphine, Meperidine",
      "Morphine, Meperidine, Fentanyl, Hydromorphone",
      "Hydromorphone, Fentanyl, Meperidine, Morphine"
    ],
    correctAnswers: ["Meperidine, Morphine, Hydromorphone, Fentanyl"],
    rationale: "Based on the standard morphine multiplier, the correct ranking from least to most potent is: Meperidine (0.1x) < Morphine (1x) < Hydromorphone (5x) < Alfentanil (10-20x) < Fentanyl (100x) < Remifentanil (100-200x) < Sufentanil (500-1000x).",
    metadata: { priority: "high", topic: "potency" }
  },

  // Q2 - Short Answer
  {
    id: "opioid-002",
    type: "short",
    prompt: "Which opioid holds the highest potency, rated at 500 to 1000 times that of morphine?",
    correctAnswers: ["Sufentanil"],
    acceptedAnswers: [
      "sufentanil", "Sufentanil", "SUFENTANIL",
      "sufenta", "Sufenta",
      "sufentanyl", "Sufentanyl"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: true,
      allowMinorMisspellings: true,
      allowWordOrderVariation: false,
      fuzzyThreshold: 0.85
    },
    rationale: "Sufentanil is 5 to 10 times more potent than fentanyl, making it 500 to 1000 times more potent than morphine. It is the most potent of all opioids used in anesthesia.",
    metadata: { priority: "high", topic: "potency" }
  },

  // Q3 - MCQ
  {
    id: "opioid-003",
    type: "mcq",
    prompt: "What pharmacokinetic trait explains Fentanyl's rapid blood-brain barrier penetration and high potency?",
    choices: [
      "Extremely high lipid solubility traits",
      "Exceptionally low protein binding rates",
      "Complete absence of active metabolites",
      "Exclusively renal elimination pathways"
    ],
    correctAnswers: ["Extremely high lipid solubility traits"],
    rationale: "Fentanyl is extremely lipid-soluble, which allows it to rapidly penetrate the blood-brain barrier. It is 100 times more potent than morphine.",
    metadata: { priority: "high", topic: "pharmacokinetics" }
  },

  // Q4 - Short Answer
  {
    id: "opioid-004",
    type: "short",
    prompt: "What adverse effect is uniquely associated with rapid IV administration of high-dose Fentanyl?",
    correctAnswers: ["Chest rigidity"],
    acceptedAnswers: [
      "chest rigidity", "Chest rigidity", "CHEST RIGIDITY",
      "skeletal muscle rigidity", "muscle rigidity",
      "stiff chest", "rigid chest",
      "chest wall rigidity", "thoracic rigidity",
      "wooden chest", "truncal rigidity"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: true,
      allowMinorMisspellings: true,
      allowWordOrderVariation: true,
      fuzzyThreshold: 0.8
    },
    rationale: "Rapid administration of high doses of fentanyl uniquely carries the risk of causing severe skeletal muscle rigidity, commonly referred to as 'stiff chest' or 'wooden chest syndrome'.",
    metadata: { priority: "high", topic: "adverse-effects" }
  },

  // Q5 - MCQ
  {
    id: "opioid-005",
    type: "mcq",
    prompt: "How is the ultra-short acting opioid Remifentanil primarily metabolized in the bloodstream?",
    choices: [
      "Hydrolyzed by non-specific plasma esterase",
      "Conjugated via hepatic cytochrome enzymes",
      "Excreted unchanged directly by the kidneys",
      "Broken down rapidly by pseudocholinesterase"
    ],
    correctAnswers: ["Hydrolyzed by non-specific plasma esterase"],
    rationale: "Remifentanil uniquely avoids hepatic and renal pathways entirely. It is hydrolyzed directly in the blood by non-specific plasma and tissue esterases (primarily in RBCs).",
    metadata: { priority: "high", topic: "metabolism" }
  },

  // Q6 - Short Answer
  {
    id: "opioid-006",
    type: "short",
    prompt: "Does Remifentanil rely on pseudocholinesterase for its metabolism in the blood?",
    correctAnswers: ["No"],
    acceptedAnswers: [
      "no", "No", "NO",
      "false", "False", "FALSE",
      "it does not", "it doesn't",
      "negative", "nope"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: true,
      allowMinorMisspellings: false,
      allowWordOrderVariation: false,
      fuzzyThreshold: 0.95
    },
    rationale: "Remifentanil is hydrolyzed by non-specific plasma and tissue esterases primarily in the red blood cells, but it does NOT utilize pseudocholinesterase.",
    metadata: { priority: "high", topic: "metabolism" }
  },

  // Q7 - MCQ
  {
    id: "opioid-007",
    type: "mcq",
    prompt: "Why does Alfentanil possess such a rapid onset of action of only one to two minutes?",
    choices: [
      "It has the lowest pKa of all the opioids",
      "It has the highest lipid solubility rates",
      "It bypasses hepatic biotransformations",
      "It completely avoids plasma proteins"
    ],
    correctAnswers: ["It has the lowest pKa of all the opioids"],
    rationale: "Alfentanil possesses the lowest pKa (6.5) of the opioids discussed. Because of this, approximately 90% of the drug is unionized at body pH, allowing for rapid penetration of the blood-brain barrier.",
    metadata: { priority: "high", topic: "pharmacokinetics" }
  },

  // Q8 - Multi Select
  {
    id: "opioid-008",
    type: "multi",
    prompt: "Which two metabolites are produced by the hepatic conjugation of Morphine? Select 2 correct answers.",
    choices: [
      "Morphine-3-glucuronide (M3G)",
      "Morphine-6-glucuronide (M6G)",
      "Normeperidine active compounds",
      "N-dealkylation inactive elements"
    ],
    correctAnswers: [
      "Morphine-3-glucuronide (M3G)",
      "Morphine-6-glucuronide (M6G)"
    ],
    selectCount: 2,
    rationale: "Morphine is metabolized by conjugation (glucuronidation) in the liver into M3G (inactive) and M6G (an active metabolite that provides analgesia).",
    metadata: { priority: "high", topic: "metabolism" }
  },

  // Q9 - MCQ
  {
    id: "opioid-009",
    type: "mcq",
    prompt: "Which statement correctly differentiates the active from the inactive metabolite of Morphine?",
    choices: [
      "M6G provides analgesia, whereas M3G possesses no analgesic properties",
      "M3G provides analgesia, whereas M6G possesses no analgesic properties",
      "M3G triggers seizures, whereas M6G triggers smooth muscle relaxations",
      "M6G triggers seizures, whereas M3G triggers smooth muscle relaxations"
    ],
    correctAnswers: ["M6G provides analgesia, whereas M3G possesses no analgesic properties"],
    rationale: "Morphine is metabolized by conjugation into morphine-3-glucuronide (M3G) and morphine-6-glucuronide (M6G). M6G is an active metabolite that provides analgesia, while M3G has no analgesic properties.",
    metadata: { priority: "high", topic: "metabolism" }
  },

  // Q10 - MCQ
  {
    id: "opioid-010",
    type: "mcq",
    prompt: "Why is Hydromorphone considered a highly safe opioid choice for patients with renal failure?",
    choices: [
      "It possesses absolutely no active metabolites",
      "It strictly utilizes esterase for its breakdown",
      "It causes zero respiratory depression effects",
      "It completely avoids all hepatic conjugations"
    ],
    correctAnswers: ["It possesses absolutely no active metabolites"],
    rationale: "Hydromorphone is metabolized in the liver but lacks any active metabolites, making it extremely safe for patients with renal failure where active metabolites from other drugs might accumulate.",
    metadata: { priority: "high", topic: "clinical-safety" }
  },

  // Q11 - Short Answer
  {
    id: "opioid-011",
    type: "short",
    prompt: "What is the active, toxic metabolite of Meperidine that can cause seizures?",
    correctAnswers: ["Normeperidine"],
    acceptedAnswers: [
      "normeperidine", "Normeperidine", "NORMEPERIDINE",
      "nor-meperidine", "Nor-meperidine",
      "normeperadine", "normeperdine"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: false,
      allowMinorMisspellings: true,
      allowWordOrderVariation: false,
      fuzzyThreshold: 0.85
    },
    rationale: "Meperidine is metabolized in the liver to an active metabolite called normeperidine. Buildup of this metabolite can cause seizures, making it particularly dangerous in renal patients.",
    metadata: { priority: "high", topic: "adverse-effects" }
  },

  // Q12 - MCQ
  {
    id: "opioid-012",
    type: "mcq",
    prompt: "Why does Meperidine uniquely cause tachycardia and mydriasis rather than bradycardia and miosis?",
    choices: [
      "It possesses a structure similar to atropine",
      "It possesses a structure similar to ephedrine",
      "It heavily stimulates central vagal responses",
      "It purely activates the sympathetic pathways"
    ],
    correctAnswers: ["It possesses a structure similar to atropine"],
    rationale: "Meperidine contains a benzene ring structure that is highly similar to atropine. Because of this, it produces atropine-like effects (increased heart rate and dilated pupils) instead of the classic opioid effects of bradycardia and constricted pupils.",
    metadata: { priority: "high", topic: "pharmacology" }
  },

  // Q13 - MCQ
  {
    id: "opioid-013",
    type: "mcq",
    prompt: "What severe interaction can occur if Meperidine is given to a patient currently taking MAOIs?",
    choices: [
      "Fatal serotonin syndrome excitatory reaction",
      "Sudden malignant hyperthermia muscle rigids",
      "Severe pulmonary edema fluid accumulations",
      "Massive histamine release anaphylactic shock"
    ],
    correctAnswers: ["Fatal serotonin syndrome excitatory reaction"],
    rationale: "Meperidine blocks the uptake of serotonin. If administered to a patient on Monoamine Oxidase Inhibitors (MAOIs), it causes a fatal excitatory reaction known as serotonin syndrome, leading to delirium, convulsions, or death.",
    metadata: { priority: "high", topic: "drug-interactions" }
  },

  // Q14 - Short Answer
  {
    id: "opioid-014",
    type: "short",
    prompt: "Which opioid is most frequently utilized to successfully treat post-operative shivering?",
    correctAnswers: ["Meperidine"],
    acceptedAnswers: [
      "meperidine", "Meperidine", "MEPERIDINE",
      "demerol", "Demerol", "DEMEROL",
      "pethidine", "Pethidine"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: true,
      allowMinorMisspellings: true,
      allowWordOrderVariation: false,
      fuzzyThreshold: 0.85
    },
    rationale: "Meperidine is uniquely effective at terminating or attenuating post-operative shivering in 70-80% of patients via its specific action on kappa receptors.",
    metadata: { priority: "high", topic: "clinical-use" }
  },

  // Q15 - Multi Select
  {
    id: "opioid-015",
    type: "multi",
    prompt: "Which of the following are specific clinical actions of the Mu-1 receptor? Select 4 correct answers.",
    choices: [
      "Supraspinal analgesia",
      "Euphoria",
      "Miosis",
      "Bradycardia",
      "Physical dependence",
      "Marked constipation"
    ],
    correctAnswers: ["Supraspinal analgesia", "Euphoria", "Miosis", "Bradycardia"],
    selectCount: 4,
    rationale: "Mu-1 receptors are responsible for supraspinal/spinal analgesia, euphoria, miosis, bradycardia, urinary retention, hypothermia, and pruritis. Physical dependence and marked constipation are specifically associated with Mu-2 actions.",
    metadata: { priority: "high", topic: "receptors" }
  },

  // Q16 - Multi Select
  {
    id: "opioid-016",
    type: "multi",
    prompt: "Which of the following are specific clinical actions associated with the Mu-2 receptor? Select 4 correct answers.",
    choices: [
      "Severe depression of ventilations",
      "High risk for physical dependence",
      "Decreased gastrointestinal transit",
      "Effective spinal level analgesias",
      "Intense psychotomimetic dysphoria",
      "Potent suppression of immune cells"
    ],
    correctAnswers: [
      "Severe depression of ventilations",
      "High risk for physical dependence",
      "Decreased gastrointestinal transit",
      "Effective spinal level analgesias"
    ],
    selectCount: 4,
    rationale: "The Mu-2 receptor is primarily associated with the adverse effects of opioid agonists, notably depression of ventilation, physical dependence, decreased GI motility (constipation), and spinal analgesia. Dysphoria is associated with Kappa receptors, and immune suppression with Mu-3.",
    metadata: { priority: "high", topic: "receptors" }
  },

  // Q17 - MCQ
  {
    id: "opioid-017",
    type: "mcq",
    prompt: "What is the primary clinical action uniquely associated with the Mu-3 receptor subtype?",
    choices: [
      "Produces marked immune system suppression",
      "Causes dangerous respiratory depressions",
      "Creates intense feelings of pure euphoria",
      "Triggers severe gastrointestinal stasis"
    ],
    correctAnswers: ["Produces marked immune system suppression"],
    rationale: "Mu-3 receptors have a large distribution in astrocytes, endothelial cells, and macrophages, meaning they play a unique role in immune suppression.",
    metadata: { priority: "high", topic: "receptors" }
  },

  // Q18 - MCQ
  {
    id: "opioid-018",
    type: "mcq",
    prompt: "Which specific receptor is uniquely responsible for triggering dysphoria, diuresis, and anti-shivering effects?",
    choices: [
      "The Kappa opioid receptor subtype",
      "The Delta opioid receptor subtype",
      "The Mu-one opioid receptor subtype",
      "The Mu-two opioid receptor subtype"
    ],
    correctAnswers: ["The Kappa opioid receptor subtype"],
    rationale: "Unlike Mu receptors, Kappa receptors uniquely cause dysphoria and diuresis, and they are also the primary target for producing anti-shivering effects.",
    metadata: { priority: "high", topic: "receptors" }
  },

  // Q19 - Multi Select
  {
    id: "opioid-019",
    type: "multi",
    prompt: "Which of the following physiological effects are mediated by the Delta opioid receptor? Select 3 correct answers.",
    choices: [
      "Spinal and supraspinal analgesias",
      "Significant nausea and vomiting",
      "Severe depression of ventilations",
      "Marked diuresis and fluid losses",
      "Potent shivering reflex stoppings"
    ],
    correctAnswers: [
      "Spinal and supraspinal analgesias",
      "Significant nausea and vomiting",
      "Severe depression of ventilations"
    ],
    selectCount: 3,
    rationale: "Delta receptors are largely responsible for spinal/supraspinal analgesia, modulating nausea and vomiting, and causing depression of ventilation. Diuresis and shivering control are specific to Kappa receptors.",
    metadata: { priority: "high", topic: "receptors" }
  },

  // Q20 - MCQ
  {
    id: "opioid-020",
    type: "mcq",
    prompt: "What is the primary pharmacological mechanism of action for the drug Naloxone (Narcan)?",
    choices: [
      "Pure competitive opioid receptor antagonist",
      "Partial noncompetitive opioid receptor agonist",
      "Weak kappa agonist and strong mu antagonist",
      "Strong delta agonist and weak mu antagonists"
    ],
    correctAnswers: ["Pure competitive opioid receptor antagonist"],
    rationale: "Naloxone is a pure competitive opioid antagonist that acts by displacing the agonist from the receptor, but it does not activate the receptor itself.",
    metadata: { priority: "high", topic: "antagonists" }
  },

  // Q21 - Short Answer
  {
    id: "opioid-021",
    type: "short",
    prompt: "What major clinical risk occurs due to Naloxone's short 30-45 minute duration of action?",
    correctAnswers: ["Renarcotization"],
    acceptedAnswers: [
      "renarcotization", "Renarcotization", "RENARCOTIZATION",
      "re-narcotization", "Re-narcotization",
      "re narcotization", "recurrance of narcosis",
      "return of narcosis", "rebound narcosis"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: false,
      allowMinorMisspellings: true,
      allowWordOrderVariation: true,
      fuzzyThreshold: 0.8
    },
    rationale: "Because Naloxone's duration of action is only about 30-45 minutes, patients are at a high risk of experiencing renarcotization if the original opioid's half-life outlasts the antagonist.",
    metadata: { priority: "high", topic: "antagonists" }
  },

  // Q22 - Multi Select
  {
    id: "opioid-022",
    type: "multi",
    prompt: "Rapid administration of Naloxone can result in which of the following severe adverse effects? Select 4 correct answers.",
    choices: [
      "Severe pulmonary edema",
      "Ventricular arrhythmias",
      "Significant hypertension",
      "Abrupt return of pain",
      "Deep respiratory arrest",
      "Massive immune collapse"
    ],
    correctAnswers: [
      "Severe pulmonary edema",
      "Ventricular arrhythmias",
      "Significant hypertension",
      "Abrupt return of pain"
    ],
    selectCount: 4,
    rationale: "Naloxone must be titrated slowly. Because it abruptly reverses analgesia, the sudden return of pain can result in massive sympathetic and cardiovascular stimulation, leading to hypertension, arrhythmias, tachycardia, and pulmonary edema.",
    metadata: { priority: "high", topic: "antagonists" }
  },

  // Q23 - Short Answer
  {
    id: "opioid-023",
    type: "short",
    prompt: "What is the primary route of administration for the opioid antagonist Naltrexone (Revia)?",
    correctAnswers: ["Oral"],
    acceptedAnswers: [
      "oral", "Oral", "ORAL",
      "po", "PO", "P.O.", "p.o.",
      "by mouth", "per os", "orally"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: true,
      allowMinorMisspellings: false,
      allowWordOrderVariation: false,
      fuzzyThreshold: 0.9
    },
    rationale: "Naltrexone is a much longer-acting antagonist compared to naloxone and is administered orally, often used for opioid addiction and decreasing alcohol cravings.",
    metadata: { priority: "high", topic: "antagonists" }
  },

  // Q24 - MCQ
  {
    id: "opioid-024",
    type: "mcq",
    prompt: "What specific receptor activity profile provides Butorphanol (Stadol) with its clinical safety benefits?",
    choices: [
      "Weak Mu antagonist and strong Kappa agonist",
      "Strong Mu agonist and weak Kappa antagonist",
      "Pure Delta agonist and weak Kappa antagonist",
      "Pure Kappa antagonist and weak Delta agonist"
    ],
    correctAnswers: ["Weak Mu antagonist and strong Kappa agonist"],
    rationale: "Butorphanol is a weak mu antagonist (or partial agonist) and a kappa receptor agonist. This combination provides analgesia and anti-shivering effects while safely capping the potential for dangerous respiratory depression.",
    metadata: { priority: "high", topic: "agonist-antagonists" }
  },

  // Q25 - MCQ
  {
    id: "opioid-025",
    type: "mcq",
    prompt: "What is the specific receptor activity profile of the agonist-antagonist drug Nalbuphine (Nubain)?",
    choices: [
      "Antagonist at the Mu receptors and agonist at the Kappa receptors",
      "Agonist at the Mu receptors and antagonist at the Kappa receptors",
      "Antagonist at the Delta receptors and agonist at the Mu receptors",
      "Agonist at the Delta receptors and antagonist at the Mu receptors"
    ],
    correctAnswers: ["Antagonist at the Mu receptors and agonist at the Kappa receptors"],
    rationale: "Nalbuphine produces its analgesic effects by acting as an agonist at the Kappa receptors while simultaneously acting as an antagonist at the Mu receptors.",
    metadata: { priority: "high", topic: "agonist-antagonists" }
  },

  // Q26 - MCQ
  {
    id: "opioid-026",
    type: "mcq",
    prompt: "How do opioids primarily alter the patient's respiratory response curve to carbon dioxide?",
    choices: [
      "They shift the CO2 response curve to the right",
      "They shift the CO2 response curve to the left",
      "They elevate the baseline CO2 response curves",
      "They flatten the baseline CO2 response curves"
    ],
    correctAnswers: ["They shift the CO2 response curve to the right"],
    rationale: "Opioids shift the CO2 response curve to the right. This means the body requires a significantly higher PaCO2 level to successfully stimulate the drive to breathe.",
    metadata: { priority: "high", topic: "respiratory-effects" }
  },

  // Q27 - Multi Select
  {
    id: "opioid-027",
    type: "multi",
    prompt: "Which three drugs can successfully reverse opioid-induced spasms of the Sphincter of Oddi? Select 3 correct answers.",
    choices: [
      "Naloxone",
      "Glucagon",
      "Nitroglycerin",
      "Sugammadex",
      "Neostigmine"
    ],
    correctAnswers: ["Naloxone", "Glucagon", "Nitroglycerin"],
    selectCount: 3,
    rationale: "All opioid agonists can increase biliary duct pressure and cause a spasm of the Sphincter of Oddi. This can be reversed by administering Naloxone, Glucagon, or Nitroglycerin.",
    metadata: { priority: "high", topic: "adverse-effects" }
  },

  // ===========================
  // MEDIUM-PRIORITY YIELD
  // ===========================

  // Q28 - Multi Select
  {
    id: "opioid-028",
    type: "multi",
    prompt: "Which two opioids are contraindicated in patients with renal failure due to the accumulation of active metabolites? Select 2 correct answers.",
    choices: [
      "Morphine",
      "Meperidine",
      "Fentanyl",
      "Remifentanil"
    ],
    correctAnswers: ["Morphine", "Meperidine"],
    selectCount: 2,
    rationale: "Morphine and meperidine produce active metabolites (M6G and normeperidine, respectively) that are renally excreted and can dangerously accumulate in patients experiencing renal failure.",
    metadata: { priority: "medium", topic: "clinical-safety" }
  },

  // Q29 - Short Answer
  {
    id: "opioid-029",
    type: "short",
    prompt: "Which specific weight measurement should be used to calculate opioid dosing?",
    correctAnswers: ["Lean body mass"],
    acceptedAnswers: [
      "lean body mass", "Lean body mass", "LEAN BODY MASS",
      "lbm", "LBM", "L.B.M.",
      "ideal body weight", "IBW", "ibw",
      "lean mass", "lean weight"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: true,
      allowMinorMisspellings: true,
      allowWordOrderVariation: true,
      fuzzyThreshold: 0.8
    },
    rationale: "Because an opioid's high volume of distribution (Vd) distributes heavily into skeletal muscle, an individual's pharmacokinetic patterns correlate much better with lean body mass than total body weight.",
    metadata: { priority: "medium", topic: "dosing" }
  },

  // Q30 - MCQ
  {
    id: "opioid-030",
    type: "mcq",
    prompt: "Why do elderly patients require significantly lower doses of opioid medications?",
    choices: [
      "Decreased clearance and increased brain sensitivity",
      "Increased clearance and decreased brain sensitivity",
      "Decreased clearance and decreased brain sensitivity",
      "Increased clearance and increased brain sensitivity"
    ],
    correctAnswers: ["Decreased clearance and increased brain sensitivity"],
    rationale: "Age alters pharmacokinetics and pharmacodynamics. Elderly patients have decreased clearance mechanisms and an increased sensitivity to the drugs within the brain.",
    metadata: { priority: "medium", topic: "patient-factors" }
  },

  // Q31 - MCQ
  {
    id: "opioid-031",
    type: "mcq",
    prompt: "In what specific patient population will very low doses of opioids trigger severe hypotension?",
    choices: [
      "Patients who are severely volume depleted",
      "Patients who are significantly fluid overloaded",
      "Patients who possess severe renal impairments",
      "Patients who possess severe liver dysfunctions"
    ],
    correctAnswers: ["Patients who are severely volume depleted"],
    rationale: "While opioids generally maintain cardiovascular stability, patients who are volume depleted or dependent on high sympathetic tone (like a trauma patient with blood loss) will experience severe hypotension even with very low doses of opioids.",
    metadata: { priority: "medium", topic: "patient-factors" }
  },

  // Q32 - MCQ
  {
    id: "opioid-032",
    type: "mcq",
    prompt: "How should an anesthesia provider appropriately manage a patient's continuous transdermal fentanyl or morphine patch during a surgical procedure?",
    choices: [
      "Keep it on and add IV medications to it",
      "Remove it immediately upon entering the OR",
      "Remove it and replace it with a brand new patch",
      "Keep it on but strictly avoid all IV opioid meds"
    ],
    correctAnswers: ["Keep it on and add IV medications to it"],
    rationale: "The recommended practice is to keep the transdermal patch on during surgery. Because the patient is already used to that baseline amount of medication, the provider should simply add their IV anesthetics to it.",
    metadata: { priority: "medium", topic: "clinical-management" }
  },

  // Q33 - MCQ
  {
    id: "opioid-033",
    type: "mcq",
    prompt: "How does chronic alcoholism specifically affect a patient's opioid requirements during anesthesia?",
    choices: [
      "They often require higher plasma levels to achieve adequate analgesia",
      "They often require significantly lower doses to prevent fatal overdoses",
      "They must strictly avoid all synthetic phenylpiperidine derivatives",
      "They achieve profound analgesia with extremely small opioid doses"
    ],
    correctAnswers: ["They often require higher plasma levels to achieve adequate analgesia"],
    rationale: "In alcoholic patients, providers often need to administer higher doses to achieve adequate plasma levels for pain control. This may be related to an overall decrease in opioid sensitivity in these patients.",
    metadata: { priority: "medium", topic: "patient-factors" }
  },

  // Q34 - Short Answer
  {
    id: "opioid-034",
    type: "short",
    prompt: "Which two excitatory nociceptive neurotransmitters are inhibited by opioid agonists?",
    correctAnswers: ["Substance-P and glutamate"],
    acceptedAnswers: [
      "substance-p and glutamate", "Substance-P and glutamate",
      "substance p and glutamate", "substance P, glutamate",
      "glutamate and substance-p", "glutamate and substance p",
      "substance p, glutamate", "glutamate, substance p",
      "substance-P/glutamate", "glutamate/substance-P"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: false,
      allowMinorMisspellings: true,
      allowWordOrderVariation: true,
      fuzzyThreshold: 0.75
    },
    rationale: "Opioids block afferent nerve transmission at the level of the spinal cord by inhibiting the release of excitatory nociceptive neurotransmitters, specifically Substance-P and glutamate.",
    metadata: { priority: "medium", topic: "mechanism" }
  },

  // Q35 - Multi Select
  {
    id: "opioid-035",
    type: "multi",
    prompt: "What are the three endogenous opioid ligands naturally produced by the body? Select 3 correct answers.",
    choices: [
      "Enkephalins",
      "Endorphins",
      "Dynorphins",
      "Glutamates",
      "Substance-P"
    ],
    correctAnswers: ["Enkephalins", "Endorphins", "Dynorphins"],
    selectCount: 3,
    rationale: "The body supplies its own internal opioids called endogenous ligands, which specifically include enkephalins, endorphins, and dynorphins.",
    metadata: { priority: "medium", topic: "physiology" }
  },

  // Q36 - MCQ
  {
    id: "opioid-036",
    type: "mcq",
    prompt: "What is the primary physiological objective of employing pre-emptive opioid analgesia techniques?",
    choices: [
      "Preventing central pain pathway sensitization",
      "Enhancing post-operative opioid dependencies",
      "Accelerating hepatic biotransformation speeds",
      "Reversing respiratory depression side effects"
    ],
    correctAnswers: ["Preventing central pain pathway sensitization"],
    rationale: "Pre-emptive analgesia involves administering opioids before painful stimuli occur in order to 'fill up' receptors, stop Substance-P on the front end, and prevent the development of the pain pathway (central sensitization).",
    metadata: { priority: "medium", topic: "clinical-use" }
  },

  // Q37 - Short Answer
  {
    id: "opioid-037",
    type: "short",
    prompt: "What physiological effect do opioids have on the patient's pupillary diameter?",
    correctAnswers: ["Miosis"],
    acceptedAnswers: [
      "miosis", "Miosis", "MIOSIS",
      "pinpoint pupils", "constricted pupils",
      "pupil constriction", "pupillary constriction",
      "small pupils", "constriction"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: false,
      allowMinorMisspellings: true,
      allowWordOrderVariation: true,
      fuzzyThreshold: 0.85
    },
    rationale: "Opioids cause pupillary constriction (miosis) via parasympathetic stimulation of the oculomotor nerve and the Edinger-Westphal nucleus. (Meperidine is the only exception).",
    metadata: { priority: "medium", topic: "effects" }
  },

  // Q38 - Short Answer
  {
    id: "opioid-038",
    type: "short",
    prompt: "Which specific nucleus is stimulated by opioids to cause pinpoint pupils (miosis)?",
    correctAnswers: ["The Edinger-Westphal nucleus"],
    acceptedAnswers: [
      "edinger-westphal nucleus", "Edinger-Westphal nucleus",
      "edinger westphal nucleus", "edinger-westphal",
      "EW nucleus", "E-W nucleus", "EWN"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: true,
      allowMinorMisspellings: true,
      allowWordOrderVariation: false,
      fuzzyThreshold: 0.8
    },
    rationale: "Opioids cause miosis via parasympathetic stimulation of the oculomotor nerve and the Edinger-Westphal nucleus.",
    metadata: { priority: "medium", topic: "neuroanatomy" }
  },

  // Q39 - MCQ
  {
    id: "opioid-039",
    type: "mcq",
    prompt: "What is the proven physiological mechanism behind opioid-induced pruritis (itching)?",
    choices: [
      "Central mechanism in the medulla oblongata",
      "Massive peripheral histamine degranulations",
      "Widespread cutaneous vasodilation reactions",
      "Allergic reaction to medication preservatives"
    ],
    correctAnswers: ["Central mechanism in the medulla oblongata"],
    rationale: "Opioid-induced pruritis is a receptor-mediated event (reversible by naloxone) linked to a central 'scratching center' in the medulla oblongata. It is explicitly NOT related to histamine release, preservatives, or cutaneous vasodilation.",
    metadata: { priority: "medium", topic: "adverse-effects" }
  },

  // Q40 - Short Answer
  {
    id: "opioid-040",
    type: "short",
    prompt: "In what specific anatomical location is the Chemoreceptor Trigger Zone (CTZ) located?",
    correctAnswers: ["The area postrema"],
    acceptedAnswers: [
      "area postrema", "Area postrema", "AREA POSTREMA",
      "the area postrema", "postrema",
      "AP", "area postrema of the brain"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: true,
      allowMinorMisspellings: true,
      allowWordOrderVariation: false,
      fuzzyThreshold: 0.85
    },
    rationale: "Opioid-induced nausea and vomiting is largely mediated by Delta receptors stimulating the Chemoreceptor Trigger Zone, which is located in the area postrema of the brain.",
    metadata: { priority: "medium", topic: "neuroanatomy" }
  },

  // Q41 - Short Answer
  {
    id: "opioid-041",
    type: "short",
    prompt: "What three primary pharmacokinetic properties dictate the action of opioids?",
    correctAnswers: ["pKa, lipid solubility, and protein binding"],
    acceptedAnswers: [
      "pka, lipid solubility, and protein binding",
      "pka, lipid solubility, protein binding",
      "lipid solubility, pka, protein binding",
      "protein binding, lipid solubility, pka",
      "pKa/lipid solubility/protein binding"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: true,
      allowMinorMisspellings: true,
      allowWordOrderVariation: true,
      fuzzyThreshold: 0.7
    },
    rationale: "The general pharmacokinetics and clinical action of opioids depend heavily on their individual pKa, lipid solubility, and protein binding characteristics.",
    metadata: { priority: "medium", topic: "pharmacokinetics" }
  },

  // Q42 - MCQ
  {
    id: "opioid-042",
    type: "mcq",
    prompt: "What is the primary chemical classification of opioids regarding their baseline pH status?",
    choices: [
      "They are classified as weak bases",
      "They are classified as weak acids",
      "They are classified as strong bases",
      "They are classified as strong acids"
    ],
    correctAnswers: ["They are classified as weak bases"],
    rationale: "Pharmacokinetically, all opioids are chemically classified as weak bases.",
    metadata: { priority: "medium", topic: "pharmacology" }
  },

  // Q43 - Short Answer
  {
    id: "opioid-043",
    type: "short",
    prompt: "Which tissue serves as one of the largest distribution sites for opioids due to their high volume of distribution?",
    correctAnswers: ["Skeletal muscle tissue"],
    acceptedAnswers: [
      "skeletal muscle", "Skeletal muscle", "SKELETAL MUSCLE",
      "skeletal muscle tissue", "muscle tissue", "muscle",
      "striated muscle", "voluntary muscle"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: false,
      allowMinorMisspellings: true,
      allowWordOrderVariation: true,
      fuzzyThreshold: 0.8
    },
    rationale: "Opioids are widely distributed in various peripheral sites throughout the body, with skeletal muscle being one of the largest distribution reservoirs.",
    metadata: { priority: "medium", topic: "pharmacokinetics" }
  },

  // Q44 - Short Answer
  {
    id: "opioid-044",
    type: "short",
    prompt: "What specific pulmonary pharmacokinetic action heavily influences the distribution of Fentanyl?",
    correctAnswers: ["The first-pass effect"],
    acceptedAnswers: [
      "first-pass effect", "First-pass effect", "FIRST-PASS EFFECT",
      "first pass effect", "first-pass", "first pass",
      "pulmonary first pass", "lung first pass",
      "first pass uptake", "first-pass uptake"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: false,
      allowMinorMisspellings: true,
      allowWordOrderVariation: true,
      fuzzyThreshold: 0.8
    },
    rationale: "Fentanyl is uniquely identified as the opioid most eliminated by first-pass uptake in the lungs. The lungs transiently take up the majority of the injected drug before it redistributes.",
    metadata: { priority: "medium", topic: "pharmacokinetics" }
  },

  // Q45 - Multi Select
  {
    id: "opioid-045",
    type: "multi",
    prompt: "Which of the following drugs belong to the synthetic phenylpiperidine derivative classification? Select 4 correct answers.",
    choices: [
      "Fentanyl",
      "Sufentanil",
      "Alfentanil",
      "Remifentanil",
      "Morphine",
      "Hydromorphone"
    ],
    correctAnswers: ["Fentanyl", "Sufentanil", "Alfentanil", "Remifentanil"],
    selectCount: 4,
    rationale: "The phenylpiperidine derivatives represent the most common class of synthetic opioids used in anesthesia, and this group includes fentanyl, alfentanil, sufentanil, remifentanil, and meperidine.",
    metadata: { priority: "medium", topic: "classification" }
  },

  // Q46 - MCQ
  {
    id: "opioid-046",
    type: "mcq",
    prompt: "Which naturally occurring opioid is a benzylisoquinoline derivative that lacks analgesic activity?",
    choices: [
      "Papaverine hydrochloride injections",
      "Morphine sulfate liquid solutions",
      "Codeine phosphate oral compounds",
      "Fentanyl citrate intravenous meds"
    ],
    correctAnswers: ["Papaverine hydrochloride injections"],
    rationale: "Papaverine is a naturally occurring benzylisoquinoline derivative that provides smooth muscle relaxation but possesses absolutely no opiate or analgesic activity.",
    metadata: { priority: "medium", topic: "classification" }
  },

  // Q47 - MCQ
  {
    id: "opioid-047",
    type: "mcq",
    prompt: "Which chemical classification of synthetic opioids does the drug Methadone belong to?",
    choices: [
      "Diphenylpropylamine drug derivatives",
      "Phenylpiperidine drug classifications",
      "Benzylisoquinoline drug formulations",
      "Benzomorphan specific classifications"
    ],
    correctAnswers: ["Diphenylpropylamine drug derivatives"],
    rationale: "Synthetic opioids are divided into 4 groups. Methadone belongs strictly to the diphenylpropylamine derivative classification.",
    metadata: { priority: "medium", topic: "classification" }
  },

  // Q48 - MCQ
  {
    id: "opioid-048",
    type: "mcq",
    prompt: "Intranasal administration of opioids in children is associated with what specific complication?",
    choices: [
      "Decreased overall pulmonary system compliance",
      "Increased overall pulmonary system compliance",
      "Decreased overall systemic vascular resistance",
      "Increased overall systemic vascular resistance"
    ],
    correctAnswers: ["Decreased overall pulmonary system compliance"],
    rationale: "While drugs like fentanyl and sufentanil can be given intranasally, in children this route is associated with a decrease in pulmonary compliance.",
    metadata: { priority: "medium", topic: "administration" }
  },

  // Q49 - Multi Select
  {
    id: "opioid-049",
    type: "multi",
    prompt: "Which of the following are acceptable routes of administration for opioids? Select 4 correct answers.",
    choices: [
      "Intravenous (IV)",
      "Intramuscular (IM)",
      "Transdermal",
      "Transmucosal",
      "Intra-arterial"
    ],
    correctAnswers: ["Intravenous (IV)", "Intramuscular (IM)", "Transdermal", "Transmucosal"],
    selectCount: 4,
    rationale: "Opioids can be administered via IV, IM, rectally, PO, intranasally, topically/transdermally, and transmucosally.",
    metadata: { priority: "medium", topic: "administration" }
  },

  // ===========================
  // LOWEST-PRIORITY YIELD
  // ===========================

  // Q50 - Short Answer
  {
    id: "opioid-050",
    type: "short",
    prompt: "Do opioids reliably provide amnesia during surgical procedures?",
    correctAnswers: ["No"],
    acceptedAnswers: [
      "no", "No", "NO",
      "false", "False", "FALSE",
      "they do not", "they don't",
      "negative", "nope"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: true,
      allowMinorMisspellings: false,
      allowWordOrderVariation: false,
      fuzzyThreshold: 0.95
    },
    rationale: "Even at doses large enough to produce unconsciousness, opioids do not provide consistent or reliable amnesia, though they do significantly decrease the dose requirements of other anesthetics.",
    metadata: { priority: "low", topic: "effects" }
  },

  // Q51 - Short Answer
  {
    id: "opioid-051",
    type: "short",
    prompt: "What term describes pain specifically caused by noxious stimuli, such as surgery?",
    correctAnswers: ["Nociceptive pain"],
    acceptedAnswers: [
      "nociceptive pain", "Nociceptive pain", "NOCICEPTIVE PAIN",
      "nociceptive", "Nociceptive"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: false,
      allowMinorMisspellings: true,
      allowWordOrderVariation: false,
      fuzzyThreshold: 0.85
    },
    rationale: "Nociceptive pain is caused by noxious stimuli activating nociceptors, and is typically divided into somatic and visceral pain.",
    metadata: { priority: "low", topic: "definitions" }
  },

  // Q52 - MCQ
  {
    id: "opioid-052",
    type: "mcq",
    prompt: "How is neuropathic pain defined?",
    choices: [
      "Chronic pain from aberrant signal processing",
      "Acute pain from somatic tissue destructions",
      "Sudden pain from visceral organ dilations",
      "Normal pain from nociceptive transmissions"
    ],
    correctAnswers: ["Chronic pain from aberrant signal processing"],
    rationale: "Neuropathic pain is caused by aberrant signal processing in the peripheral or central nervous system, and is often described as burning, shooting, or electric.",
    metadata: { priority: "low", topic: "definitions" }
  },

  // Q53 - Multi Select
  {
    id: "opioid-053",
    type: "multi",
    prompt: "Which of the following are cardiovascular consequences of acute pain? Select 3 correct answers.",
    choices: [
      "Hypertension",
      "Tachycardia",
      "Bradycardia",
      "Increased systemic vascular resistance",
      "Decreased systemic vascular resistance"
    ],
    correctAnswers: ["Hypertension", "Tachycardia", "Increased systemic vascular resistance"],
    selectCount: 3,
    rationale: "Acute pain stimulates the neuroendocrine stress response, which causes hypertension, tachycardia, increased systemic vascular resistance (SVR), and increased myocardial oxygen demand.",
    metadata: { priority: "low", topic: "physiology" }
  },

  // Q54 - Short Answer
  {
    id: "opioid-054",
    type: "short",
    prompt: "What is the primary immunologic consequence of acute pain?",
    correctAnswers: ["Decreased immune response"],
    acceptedAnswers: [
      "decreased immune response", "Decreased immune response",
      "immune suppression", "immunosuppression",
      "decreased immunity", "lowered immune response",
      "suppressed immune system", "weakened immunity"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: false,
      allowMinorMisspellings: true,
      allowWordOrderVariation: true,
      fuzzyThreshold: 0.75
    },
    rationale: "Acute pain stimulates the neuroendocrine stress response, which ultimately lowers and suppresses the immune system's response.",
    metadata: { priority: "low", topic: "physiology" }
  },

  // Q55 - MCQ
  {
    id: "opioid-055",
    type: "mcq",
    prompt: "Where do the fast-sharp pain nerve A-delta fibers terminate within the spinal cord?",
    choices: [
      "Lamina I and Lamina V regions",
      "Lamina II and Lamina III areas",
      "Anterior lateral quadrant area",
      "Substantia gelatinosa regions"
    ],
    correctAnswers: ["Lamina I and Lamina V regions"],
    rationale: "A-delta fibers, which transmit fast and sharp pain, specifically terminate in Lamina I and V of the spinal cord.",
    metadata: { priority: "low", topic: "neuroanatomy" }
  },

  // Q56 - Short Answer
  {
    id: "opioid-056",
    type: "short",
    prompt: "Where do the slow, chronic pain C-fibers specifically terminate within the spinal cord?",
    correctAnswers: ["Substantia gelatinosa (Lamina II & III)"],
    acceptedAnswers: [
      "substantia gelatinosa", "Substantia gelatinosa",
      "lamina II and III", "lamina 2 and 3",
      "laminae II and III", "lamina II & III",
      "SG", "substantia gelatinosa lamina II III"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: true,
      allowMinorMisspellings: true,
      allowWordOrderVariation: true,
      fuzzyThreshold: 0.75
    },
    rationale: "C-fibers are small, unmyelinated fibers sensitive to mostly chemical pain stimuli, and they carry pain impulses to terminate specifically in the substantia gelatinosa (Lamina II and III).",
    metadata: { priority: "low", topic: "neuroanatomy" }
  },

  // Q57 - MCQ
  {
    id: "opioid-057",
    type: "mcq",
    prompt: "Which brain stem area is often referred to as the 'Analgesia System' upon electrical stimulation?",
    choices: [
      "Periaqueductal gray matter brainstem",
      "Anterior lateral quadrant structures",
      "Primary somatosensory cortex regions",
      "Descending spinothalamic tract zones"
    ],
    correctAnswers: ["Periaqueductal gray matter brainstem"],
    rationale: "Electrical stimulation of the periaqueductal and periventricular areas in the brainstem causes intense descending analgesia, earning this area the name the 'Analgesia System'.",
    metadata: { priority: "low", topic: "neuroanatomy" }
  },

  // Q58 - Short Answer
  {
    id: "opioid-058",
    type: "short",
    prompt: "Which ancient civilization is credited with being the first to isolate the 'joy plant' (opium)?",
    correctAnswers: ["The Sumerians"],
    acceptedAnswers: [
      "sumerians", "Sumerians", "SUMERIANS",
      "the sumerians", "The Sumerians",
      "sumerian", "Sumerian"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: false,
      allowMinorMisspellings: true,
      allowWordOrderVariation: false,
      fuzzyThreshold: 0.85
    },
    rationale: "Historically, the Sumerians isolated the 'joy plant', with earliest dates of opioid use going as far back as 300 BC.",
    metadata: { priority: "low", topic: "history" }
  },

  // Q59 - MCQ
  {
    id: "opioid-059",
    type: "mcq",
    prompt: "Who originally isolated the prototypical opioid morphine from poppy seed juice in 1806?",
    choices: [
      "Serturner",
      "Robiquet",
      "Macmumm",
      "Sydenham"
    ],
    correctAnswers: ["Serturner"],
    rationale: "Morphine was isolated from opium by a pharmacist named Serturner in 1806, and it was famously named after Morpheus, the Greek god of dreams.",
    metadata: { priority: "low", topic: "history" }
  },

  // Q60 - MCQ
  {
    id: "opioid-060",
    type: "mcq",
    prompt: "What specific medical inventions in 1845 and 1853 popularized the practice of giving large doses of intravenous morphine for anesthesia?",
    choices: [
      "The invention of the syringe and the hollow needle",
      "The isolation of purified liquid poppy seed extracts",
      "The initial creation of synthetic phenylpiperidines",
      "The discovery of the periaqueductal gray area"
    ],
    correctAnswers: ["The invention of the syringe and the hollow needle"],
    rationale: "The syringe was developed in 1845 by Rynd and the hollow needle in 1853 by Wood. This allowed 19th-century providers to begin administering large IV doses of morphine as an anesthetic.",
    metadata: { priority: "low", topic: "history" }
  },

  // Q61 - Short Answer
  {
    id: "opioid-061",
    type: "short",
    prompt: "Which drug was synthesized in 1915 as a mixed agonist-antagonist that possessed analgesic properties but could also successfully antagonize the respiratory depression caused by morphine?",
    correctAnswers: ["Nalorphine"],
    acceptedAnswers: [
      "nalorphine", "Nalorphine", "NALORPHINE",
      "nalline", "Nalline"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: true,
      allowMinorMisspellings: true,
      allowWordOrderVariation: false,
      fuzzyThreshold: 0.85
    },
    rationale: "Synthesized by Macmumm in 1915, nalorphine (Nalline) was developed during a push to create newer opioids that decreased side effects (like respiratory depression) while maintaining pain control.",
    metadata: { priority: "low", topic: "history" }
  },

  // Q62 - Short Answer
  {
    id: "opioid-062",
    type: "short",
    prompt: "Following the creation of the first synthetic opioid (Meperidine) in 1939, what specific anesthetic technique was developed that renewed widespread interest in opioid anesthesia?",
    correctAnswers: ["The N2O-narcotic technique"],
    acceptedAnswers: [
      "n2o-narcotic technique", "N2O-narcotic technique",
      "nitrous oxide narcotic technique", "N2O narcotic",
      "n2o-narcotic", "nitrous oxide-narcotic",
      "N2O/narcotic technique", "n2o/narcotic"
    ],
    answerMatching: {
      ignoreCase: true,
      ignoreExtraSpaces: true,
      ignorePunctuation: true,
      allowAbbreviations: true,
      allowMinorMisspellings: true,
      allowWordOrderVariation: true,
      fuzzyThreshold: 0.75
    },
    rationale: "After opioids fell out of favor for 30-40 years, the creation of Meperidine led to the development of the Nitrous Oxide (N2O)-narcotic technique, which brought opioids back into standard anesthesia practice.",
    metadata: { priority: "low", topic: "history" }
  },

  // Q63 - MCQ
  {
    id: "opioid-063",
    type: "mcq",
    prompt: "In what year was the first synthetic opioid, meperidine, developed, leading to renewed interest in opioid anesthesia?",
    choices: [
      "Developed in the year nineteen thirty nine",
      "Developed in the year eighteen forty five",
      "Developed in the year eighteen fifty three",
      "Developed in the year nineteen fifteen"
    ],
    correctAnswers: ["Developed in the year nineteen thirty nine"],
    rationale: "After opioids fell out of favor for 30-40 years with anesthesia, there was a renewed interest after the development of Meperidine in 1939, which was the first synthetic opioid.",
    metadata: { priority: "low", topic: "history" }
  }
];

// Export function for getQuestions API
export function getOpioidQuestions() {
  return OPIOIDS_QUESTIONS;
}

// Course/Node metadata
export const OPIOIDS_METADATA = {
  courseId: "basics-of-anesthesia",
  nodeId: "node-9",
  topicName: "Opioids",
  chapter: "Chapter 9",
  totalQuestions: OPIOIDS_QUESTIONS.length,
  questionTypes: {
    mcq: OPIOIDS_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: OPIOIDS_QUESTIONS.filter(q => q.type === 'multi').length,
    short: OPIOIDS_QUESTIONS.filter(q => q.type === 'short').length
  },
  priorityBreakdown: {
    high: OPIOIDS_QUESTIONS.filter(q => q.metadata?.priority === 'high').length,
    medium: OPIOIDS_QUESTIONS.filter(q => q.metadata?.priority === 'medium').length,
    low: OPIOIDS_QUESTIONS.filter(q => q.metadata?.priority === 'low').length
  }
};
