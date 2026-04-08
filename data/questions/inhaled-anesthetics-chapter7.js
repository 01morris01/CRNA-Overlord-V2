/**
 * INHALED ANESTHETICS QUESTION BANK - Chapter 7
 * Course: Basics of Anesthesia
 * Node: node-7
 * Topic: Inhaled Anesthetic Agents
 *
 * Question Types:
 * - mcq:   Multiple choice (single best answer) — ans array of {t, ok}
 * - multi:  Select multiple (choices + correctAnswers + selectCount)
 * - short:  Free response (acceptedAnswers array)
 *
 * Tags: basics-of-anesthesia, node-7, chapter-7, inhaled-anesthetics, nbcrna-style
 */

export const INHALED_ANESTHETICS_QUESTIONS = [

  // ─── GAS EXCHANGE / PHARMACOKINETICS ─────────────────────────────────────────

  {
    id: "n7c7-q001",
    type: "short",
    prompt: "What is the primary driving force that allows gas exchange to occur across the diffusion barrier in the lungs?",
    setup: "",
    acceptedAnswers: [
      "Partial pressure gradients", "Partial pressure gradient",
      "pressure gradient",
      "partial pressure difference",
      "pressure difference",
      "diffusion gradient",
      "partial pressure",
      "gradient of partial pressures",
    ],
    rationale: "The driving force of gas diffusion is the gradient in partial pressure, which continues until the pressures across the diffusion barrier are equalized.",
    metadata: { topic: "Gas Exchange", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "gas-exchange", "high-yield", "short-answer"] }
  },

  {
    id: "n7c7-q002",
    type: "short",
    prompt: "At steady state, the partial pressure of an inhaled anesthetic in the alveoli is equal to the partial pressure in what specific anatomical tissues?",
    setup: "",
    acceptedAnswers: [
      "Brain and spinal cord",
      "spinal cord and brain",
      "brain spinal cord",
      "CNS",
      "central nervous system",
      "the brain and spinal cord",
      "brain and cord",
    ],
    rationale: "At steady state, gas exchange equalizes so that the partial pressure in the alveoli matches the partial pressure in the brain and spinal cord.",
    metadata: { topic: "Gas Exchange", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "steady-state", "distribution", "short-answer"] }
  },

  {
    id: "n7c7-q003",
    type: "short",
    prompt: "Which specific law states that partial pressure is determined by the fractional concentration of a drug relative to the total alveolar gas?",
    setup: "",
    acceptedAnswers: [
      "Dalton's Law", "Daltons Law", "Dalton Law",
      "dalton's law",
      "daltons law of partial pressures",
      "law of partial pressures",
      "dalton's law of partial pressures",
      "Dalton",
      "dalton",
    ],
    rationale: "Dalton's Law of Partial Pressures dictates that partial pressure is determined by the fractional concentration of the drug relative to that of total alveolar gas.",
    metadata: { topic: "Gas Exchange", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "daltons-law", "short-answer"] }
  },

  {
    id: "n7c7-q004",
    type: "short",
    prompt: "Which specific pharmacokinetic parameter directly indicates an inhalational anesthetic's speed of onset and emergence?",
    setup: "",
    acceptedAnswers: [
      "Blood:Gas partition coefficient", "Blood gas partition coefficient", "Blood:gas coefficient",
      "blood gas coefficient",
      "blood/gas partition coefficient",
      "blood:gas partition coefficient",
      "blood gas partition",
      "blood gas ratio",
      "B:G coefficient",
      "blood gas solubility",
    ],
    rationale: "Anesthetic solubility is expressed as the blood:gas partition coefficient. Drugs with lower blood:gas coefficients are less soluble in blood, allowing the alveolar fraction to rise more quickly and the target partial pressure to be reached faster.",
    metadata: { topic: "Partition Coefficients", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "blood-gas", "high-yield", "short-answer"] }
  },

  {
    id: "n7c7-q005",
    type: "multi",
    prompt: "Select TWO physiological changes that will actively decrease the speed of onset of an inhalational anesthetic:",
    setup: "",
    choices: [
      "Significant increases in the patient's cardiac output",
      "Significant decreases in the patient's cardiac output",
      "The presence of severe ventilation-perfusion mismatch",
      "The presence of severe hypoventilation and hypothermia",
    ],
    correctAnswers: [
      "Significant increases in the patient's cardiac output",
      "The presence of severe ventilation-perfusion mismatch",
    ],
    selectCount: 2,
    rationale: "Increases in cardiac output actively decrease the speed of onset, particularly for more soluble anesthetics. Ventilation-perfusion abnormalities also severely reduce the speed of onset.",
    metadata: { topic: "Pharmacokinetics", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "onset", "cardiac-output", "v-q", "multi-select", "high-yield"] }
  },

  {
    id: "n7c7-q006",
    type: "short",
    prompt: "Which specific partition coefficient is a direct measure of an anesthetic's lipid solubility and its clinical potency?",
    setup: "",
    acceptedAnswers: [
      "Oil:Gas Coefficient", "Oil gas coefficient", "Oil:Gas partition coefficient",
      "oil gas partition coefficient",
      "oil/gas coefficient",
      "oil:gas coefficient",
      "oil gas ratio",
      "oil gas solubility",
      "oil:gas",
    ],
    rationale: "The Oil:Gas coefficient measures solubility in lipids compared to gas, which directly correlates to an agent's clinical potency.",
    metadata: { topic: "Partition Coefficients", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "oil-gas", "potency", "short-answer"] }
  },

  {
    id: "n7c7-q007",
    type: "short",
    prompt: "Which unique phenomenon explains why the extremely high fractional volume of nitrous oxide delivery substantially increases its own rate of induction?",
    setup: "",
    acceptedAnswers: [
      "The concentration effect", "Concentration effect",
      "the concentration effect",
      "concentration effect nitrous oxide",
    ],
    rationale: "Because nitrous oxide is given in very high concentrations, its massive uptake into the blood actively affects alveolar volume, increasing its own rate of rise in a phenomenon known as the concentration effect.",
    metadata: { topic: "Nitrous Oxide", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "nitrous-oxide", "concentration-effect", "short-answer"] }
  },

  {
    id: "n7c7-q008",
    type: "short",
    prompt: "What phenomenon describes the faster alveolar rise of a volatile anesthetic when it is administered concurrently with high concentrations of nitrous oxide?",
    setup: "",
    acceptedAnswers: [
      "The second gas effect", "Second gas effect",
      "the second gas effect",
      "second gas phenomenon",
      "second gas",
    ],
    rationale: "The rate of rise for a volatile anesthetic is greater in the presence of high-concentration nitrous oxide than without it, which is known as the second gas effect.",
    metadata: { topic: "Nitrous Oxide", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "nitrous-oxide", "second-gas-effect", "short-answer", "high-yield"] }
  },

  {
    id: "n7c7-q009",
    type: "short",
    prompt: "Based on a normal Functional Residual Capacity of 2 Liters and an Alveolar Ventilation of 4 Liters per minute, what is the exact duration of one pulmonary time constant?",
    setup: "",
    acceptedAnswers: [
      "0.5 minutes", "0.5 min", "0.5",
      "half a minute",
      "30 seconds",
      "30 sec",
      "0.5 minute",
      "one half minute",
      ".5 minutes",
      ".5 min",
    ],
    rationale: "A time constant is calculated as Capacity divided by Flow. Two liters divided by four liters per minute equals exactly 0.5 minutes.",
    metadata: { topic: "Pharmacokinetics", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "time-constant", "calculation", "short-answer"] }
  },

  {
    id: "n7c7-q010",
    type: "mcq",
    prompt: "Based on standard time constants, exactly what percentage of a concentration change is successfully achieved after precisely two time constants have elapsed?",
    setup: "",
    ans: [
      { t: "It reaches eighty-six percent of the desired concentration.", ok: true },
      { t: "It reaches sixty-three percent of the desired concentration.", ok: false },
      { t: "It reaches ninety-five percent of the desired concentration.", ok: false },
      { t: "It reaches ninety-eight percent of the desired concentration.", ok: false },
    ],
    rationale: "One time constant equals the time it takes to achieve a 63% change in concentration. Two constants achieve an 86% change, three achieve 95%, and four achieve 98%.",
    metadata: { topic: "Pharmacokinetics", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "time-constant", "single-choice"] }
  },

  {
    id: "n7c7-q011",
    type: "short",
    prompt: "Which three distinct physiological factors directly determine the uptake of an inhalational anesthetic into the bloodstream?",
    setup: "",
    acceptedAnswers: [
      "Solubility, CO, A-V difference", "Solubility, cardiac output, A-V difference", "Solubility, CO, arterial venous difference",
      "solubility cardiac output AV difference",
      "solubility CO AV gradient",
      "solubility blood flow AV difference",
      "solubility cardiac output arterial venous difference",
      "blood solubility cardiac output AV difference",
      "solubility CO venous difference",
    ],
    rationale: "Uptake is calculated as solubility multiplied by cardiac output multiplied by the arterial-venous difference in partial pressures.",
    metadata: { topic: "Pharmacokinetics", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "uptake", "high-yield", "short-answer"] }
  },

  {
    id: "n7c7-q012",
    type: "short",
    prompt: "Which specific tissue group receives 75% of the total cardiac output despite only making up 9% of the total body mass?",
    setup: "",
    acceptedAnswers: [
      "Vessel-Rich Group", "VRG", "Vessel rich group",
      "vessel-rich group",
      "vessel rich",
      "VRG tissues",
      "vessel rich tissue group",
      "vessel-rich tissue group",
    ],
    rationale: "The Vessel-Rich Group comprises only 9% of the body mass but receives a massive 75% of the total cardiac output.",
    metadata: { topic: "Distribution", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "tissue-groups", "distribution", "short-answer"] }
  },

  {
    id: "n7c7-q013",
    type: "mcq",
    prompt: "Which of the following tissue groups accounts for exactly fifty percent of total body mass but receives only eighteen percent of the cardiac output?",
    setup: "",
    ans: [
      { t: "It is the Muscle Tissue Group.", ok: true },
      { t: "It is the Vessel-Rich Group.", ok: false },
      { t: "It is the Adipose Tissue Group.", ok: false },
      { t: "It is the Vessel-Poor Group.", ok: false },
    ],
    rationale: "The Muscle Group makes up 50% of the body mass but receives only 18% of the cardiac output.",
    metadata: { topic: "Distribution", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "tissue-groups", "single-choice"] }
  },

  {
    id: "n7c7-q014",
    type: "short",
    prompt: "Which phenomenon occurs when a high concentration of nitrous oxide is discontinued, leaving the body rapidly and transiently diluting oxygen and carbon dioxide in the lungs?",
    setup: "",
    acceptedAnswers: [
      "Diffusion hypoxia",
      "diffusion hypoxia",
      "Fink effect",
      "fink effect",
      "nitrous oxide diffusion hypoxia",
    ],
    rationale: "Diffusion hypoxia occurs at the end of a procedure when nitrous oxide is discontinued and rapidly exits the blood, diluting alveolar oxygen. One hundred percent oxygen must be administered for 3 to 5 minutes to prevent this.",
    metadata: { topic: "Nitrous Oxide", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "nitrous-oxide", "diffusion-hypoxia", "high-yield", "short-answer"] }
  },

  {
    id: "n7c7-q015",
    type: "mcq",
    prompt: "Why do pediatric patients generally achieve anesthesia more rapidly than adults despite having a higher cardiac output requirement?",
    setup: "",
    ans: [
      { t: "Due to a higher ventilatory rate and vessel-rich group blood flow.", ok: true },
      { t: "Due to a lower ventilatory rate and muscle-rich group blood flow.", ok: false },
      { t: "Due to a higher respiratory rate and fat-poor group blood flow.", ok: false },
      { t: "Due to a lower respiratory rate and vessel-poor group blood flow.", ok: false },
    ],
    rationale: "Children achieve anesthesia much more rapidly than adults primarily because of a significantly higher ventilatory rate and greater blood flow to the vessel-rich group.",
    metadata: { topic: "Pharmacokinetics", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "pediatrics", "induction", "single-choice"] }
  },

  {
    id: "n7c7-q016",
    type: "mcq",
    prompt: "Why does nitrous oxide rapidly increase the volume and pressure of internal air-filled spaces, such as an acute intestinal obstruction or pneumothorax?",
    setup: "",
    ans: [
      { t: "Nitrogen gas is exactly 34 times less soluble than nitrous oxide.", ok: true },
      { t: "Nitrogen gas is exactly 34 times more soluble than nitrous oxide.", ok: false },
      { t: "Nitrogen gas is exactly 15 times less soluble than nitrous oxide.", ok: false },
      { t: "Nitrogen gas is exactly 15 times more soluble than nitrous oxide.", ok: false },
    ],
    rationale: "Nitrous oxide easily diffuses into air-containing cavities because these spaces are normally rich in nitrogen, and nitrogen is 34 times less soluble than nitrous oxide, causing the space to rapidly expand.",
    metadata: { topic: "Nitrous Oxide", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "nitrous-oxide", "air-spaces", "single-choice", "high-yield"] }
  },

  // ─── CHEMISTRY ────────────────────────────────────────────────────────────────

  {
    id: "n7c7-q017",
    type: "short",
    prompt: "All volatile inhalation agents are strictly classified as what fundamental type of chemical compound?",
    setup: "",
    acceptedAnswers: [
      "Hydrocarbons",
      "hydrocarbons",
      "hydrocarbon",
      "halogenated hydrocarbons",
      "volatile hydrocarbons",
    ],
    rationale: "All volatile inhalation agents are hydrocarbons that are either ethers or aliphatic hydrocarbons with four or fewer carbons.",
    metadata: { topic: "Chemistry", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "chemistry", "short-answer"] }
  },

  {
    id: "n7c7-q018",
    type: "multi",
    prompt: "Select FOUR halogen elements that have been historically substituted onto hydrocarbon structures to create modern volatile anesthetics:",
    setup: "",
    choices: ["Fluorine", "Chlorine", "Bromine", "Iodine", "Sodium", "Potassium"],
    correctAnswers: ["Fluorine", "Chlorine", "Bromine", "Iodine"],
    selectCount: 4,
    rationale: "The development of halogenated agents involved substituting hydrogen atoms with fluorine, chlorine, bromine, or iodine.",
    metadata: { topic: "Chemistry", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "chemistry", "halogens", "multi-select"] }
  },

  {
    id: "n7c7-q019",
    type: "mcq",
    prompt: "How does increasing the number of fluorine atoms physically alter the specific clinical properties of a volatile anesthetic?",
    setup: "",
    ans: [
      { t: "It lowers flammability and decreases metabolism.", ok: true },
      { t: "It raises flammability and decreases metabolism.", ok: false },
      { t: "It lowers flammability and increases metabolism.", ok: false },
      { t: "It raises flammability and increases metabolism.", ok: false },
    ],
    rationale: "The addition of halogens improves stability, decreases flammability, and lessens the extent of hepatic metabolism.",
    metadata: { topic: "Chemistry", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "chemistry", "flammability", "single-choice"] }
  },

  {
    id: "n7c7-q020",
    type: "short",
    prompt: "Which volatile anesthetic uniquely undergoes biodegradation by way of an alternative reductive pathway in addition to standard phase I oxidation?",
    setup: "",
    acceptedAnswers: [
      "Halothane",
      "halothane",
      "halothane hepatitis",
    ],
    rationale: "While modern agents only biodegrade via phase I oxidation, halothane uniquely can be metabolized by an alternative reductive pathway.",
    metadata: { topic: "Metabolism", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "halothane", "metabolism", "short-answer"] }
  },

  // ─── MAC VALUES ───────────────────────────────────────────────────────────────

  {
    id: "n7c7-q021",
    type: "mcq",
    prompt: "What are the exact Minimum Alveolar Concentration values for sevoflurane, isoflurane, and desflurane, respectively?",
    setup: "",
    ans: [
      { t: "Sevo is 1.80 percent, Iso is 1.15 percent, and Des is 6.00 percent.", ok: true },
      { t: "Sevo is 1.15 percent, Iso is 6.00 percent, and Des is 1.80 percent.", ok: false },
      { t: "Sevo is 6.00 percent, Iso is 1.80 percent, and Des is 1.15 percent.", ok: false },
      { t: "Sevo is 1.80 percent, Iso is 6.00 percent, and Des is 1.15 percent.", ok: false },
    ],
    rationale: "The standard MAC values are sevoflurane 1.8%, isoflurane 1.15%, and desflurane 6.0%.",
    metadata: { topic: "MAC", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "mac", "agents", "single-choice", "high-yield"] }
  },

  {
    id: "n7c7-q022",
    type: "short",
    prompt: "Which volatile anesthetic possesses a remarkably high vapor pressure of 669 mmHg and boils near room temperature?",
    setup: "",
    acceptedAnswers: [
      "Desflurane",
      "desflurane",
      "des",
    ],
    rationale: "Desflurane has an extremely high vapor pressure of 669 mmHg, whereas sevoflurane is 157 mmHg and isoflurane is 238 mmHg.",
    metadata: { topic: "Agent Properties", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "desflurane", "vapor-pressure", "short-answer"] }
  },

  {
    id: "n7c7-q023",
    type: "mcq",
    prompt: "Which of the following combinations correctly matches the inhalational anesthetic with its precise blood:gas partition coefficient?",
    setup: "",
    ans: [
      { t: "Halothane is 2.50, Isoflurane is 1.40, and Desflurane is 0.42.", ok: true },
      { t: "Halothane is 1.40, Isoflurane is 0.42, and Desflurane is 2.50.", ok: false },
      { t: "Halothane is 0.42, Isoflurane is 2.50, and Desflurane is 1.40.", ok: false },
      { t: "Halothane is 2.50, Isoflurane is 0.42, and Desflurane is 1.40.", ok: false },
    ],
    rationale: "The precise blood:gas coefficients are halothane 2.5, isoflurane 1.4, sevoflurane 0.6, nitrous oxide 0.47, and desflurane 0.42.",
    metadata: { topic: "Partition Coefficients", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "blood-gas", "agents", "single-choice", "high-yield"] }
  },

  {
    id: "n7c7-q024",
    type: "short",
    prompt: "According to the Meyer-Overton Rule, what specific chemical property is directly proportional to an anesthetic agent's clinical potency?",
    setup: "",
    acceptedAnswers: [
      "High lipid solubility", "Lipid solubility",
      "lipid soluble",
      "oil solubility",
      "lipophilicity",
      "fat solubility",
      "lipid solubility oil gas",
      "high oil:gas coefficient",
      "high oil gas coefficient",
    ],
    rationale: "The Meyer-Overton Rule states that the more lipid soluble an agent is, represented by a higher Oil:Gas partition coefficient, the greater its potency, which corresponds to a lower MAC value.",
    metadata: { topic: "MAC", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "meyer-overton", "potency", "short-answer", "high-yield"] }
  },

  {
    id: "n7c7-q025",
    type: "short",
    prompt: "Which specific receptor is the common target for inhalational anesthetics to produce both spinal and supraspinal effects?",
    setup: "",
    acceptedAnswers: [
      "GABAA receptor", "GABA-A receptor", "GABAa receptor",
      "gaba receptor",
      "gaba a receptor",
      "gaba-a",
      "gabaa",
      "gaba a",
      "GABA",
      "gaba",
      "gamma-aminobutyric acid receptor",
      "gamma aminobutyric acid receptor",
      "GABA-A chloride channel",
    ],
    rationale: "While many receptors are involved, the primary common target is the GABAA receptor, which is a ligand-gated chloride ion channel.",
    metadata: { topic: "Mechanism", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "gaba", "mechanism", "short-answer"] }
  },

  {
    id: "n7c7-q026",
    type: "multi",
    prompt: "Select FIVE clinical factors that will actively decrease a patient's Minimum Alveolar Concentration requirement:",
    setup: "",
    choices: [
      "Advancing age",
      "Hypothermia",
      "Acute alcohol intoxication",
      "Pregnancy",
      "Severe hypoxemia",
      "Hyperthyroidism",
      "Chronic alcohol use",
    ],
    correctAnswers: [
      "Advancing age",
      "Hypothermia",
      "Acute alcohol intoxication",
      "Pregnancy",
      "Severe hypoxemia",
    ],
    selectCount: 5,
    rationale: "Advancing age, hypothermia, acute alcohol use, acidosis, hypoxemia, anemia, hypotension, and pregnancy all decrease the MAC requirement.",
    metadata: { topic: "MAC", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "mac", "decrease-mac", "multi-select", "high-yield"] }
  },

  {
    id: "n7c7-q027",
    type: "multi",
    prompt: "Select THREE clinical factors that will actively increase a patient's Minimum Alveolar Concentration requirement:",
    setup: "",
    choices: [
      "Decreasing age",
      "Hyperthermia",
      "Cocaine use",
      "Hypotension",
      "Acute alcohol",
    ],
    correctAnswers: ["Decreasing age", "Hyperthermia", "Cocaine use"],
    selectCount: 3,
    rationale: "Decreasing age, hyperthermia, hyperthyroidism, hypernatremia, chronic alcohol use, MAOIs, and cocaine use all actively increase the MAC requirement.",
    metadata: { topic: "MAC", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "mac", "increase-mac", "multi-select", "high-yield"] }
  },

  {
    id: "n7c7-q028",
    type: "multi",
    prompt: "Select THREE classes of neurotransmitter agonists and antagonists that can actively decrease a patient's MAC requirement:",
    setup: "",
    choices: [
      "Alpha-2 sympathetic agonists",
      "Calcium channel blockers",
      "Adenosine and ATP agents",
      "Alpha-1 sympathetic agonists",
      "Potassium channel blockers",
    ],
    correctAnswers: [
      "Alpha-2 sympathetic agonists",
      "Calcium channel blockers",
      "Adenosine and ATP agents",
    ],
    selectCount: 3,
    rationale: "Alpha-2 agonists, calcium channel blockers, adenosine and ATP agents, some beta-blockers, and false neurotransmitters all decrease MAC.",
    metadata: { topic: "MAC", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "mac", "pharmacology", "multi-select"] }
  },

  {
    id: "n7c7-q029",
    type: "short",
    prompt: "What specific clinical threshold is defined by the MAC-BAR50 measurement?",
    setup: "",
    acceptedAnswers: [
      "Block adrenergic response", "Adrenergic response block",
      "blocks adrenergic response",
      "block adrenergic responses",
      "adrenergic block",
      "adrenergic response blockade",
      "blocking adrenergic response",
      "block the adrenergic response to surgery",
      "prevent adrenergic response",
    ],
    rationale: "MAC-BAR50 is the concentration required to block the adrenergic response to surgical stimulation, which requires a much greater MAC than standard skin incision MAC.",
    metadata: { topic: "MAC", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "mac-bar", "short-answer", "high-yield"] }
  },

  {
    id: "n7c7-q030",
    type: "short",
    prompt: "When administered concurrently with 50 to 60 percent nitrous oxide, what does the required MAC of sevoflurane specifically drop down to?",
    setup: "",
    acceptedAnswers: [
      "0.57 percent", "0.57%", "0.57",
      "point 57 percent",
      ".57 percent",
      ".57%",
      ".57",
      "0.57 MAC",
    ],
    rationale: "When used alongside 50 to 60 percent nitrous oxide, the MAC of sevoflurane drops significantly from 1.8% down to 0.57%.",
    metadata: { topic: "MAC", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "sevoflurane", "nitrous-oxide", "mac", "short-answer"] }
  },

  // ─── GUEDEL'S STAGES ──────────────────────────────────────────────────────────

  {
    id: "n7c7-q031",
    type: "multi",
    prompt: "Select THREE specific clinical characteristics that define Stage 1, Analgesia, according to Guedel's classical stages of anesthesia:",
    setup: "",
    choices: [
      "Mild cortical center depression",
      "Loss of sensation to pain",
      "Skeletal movement intact",
      "Paralysis of intercostal muscles",
      "Loss of spinal reflexes",
      "Severe cardiovascular depression",
    ],
    correctAnswers: [
      "Mild cortical center depression",
      "Loss of sensation to pain",
      "Skeletal movement intact",
    ],
    selectCount: 3,
    rationale: "Stage 1 features mild cortical center depression, loss of pain sensation, and intact skeletal movement.",
    metadata: { topic: "Guedel's Stages", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "gudedel", "stage-1", "multi-select"] }
  },

  {
    id: "n7c7-q032",
    type: "short",
    prompt: "During which defined stage of anesthesia does the patient experience an excitement phase characterized by divergent eyes and a dominant involuntary system?",
    setup: "",
    acceptedAnswers: [
      "Stage 2", "Stage II",
      "stage two",
      "stage 2 excitement",
      "excitement stage",
      "two",
      "2",
    ],
    rationale: "Stage 2 is the excitement stage, related to central depression of motor centers leaving the involuntary system dominant, characterized by tachycardia, hypertension, and divergent eyes.",
    metadata: { topic: "Guedel's Stages", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "gudedel", "stage-2", "short-answer"] }
  },

  {
    id: "n7c7-q033",
    type: "short",
    prompt: "During Stage 3 of surgical anesthesia, which specific physiological event marks the transition into Plane 3?",
    setup: "",
    acceptedAnswers: [
      "Paralysis of intercostal muscles", "Intercostal paralysis",
      "intercostal muscle paralysis",
      "paralysis of intercostals",
      "intercostal muscle paresis",
      "intercostal muscles paralyzed",
    ],
    rationale: "Stage 3, Plane 3 is specifically characterized by the paralysis of the intercostal muscles.",
    metadata: { topic: "Guedel's Stages", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "gudedel", "stage-3", "short-answer"] }
  },

  // ─── CNS EFFECTS ─────────────────────────────────────────────────────────────

  {
    id: "n7c7-q034",
    type: "short",
    prompt: "What unique physiological phenomenon occurs when volatile agents actively decrease the cerebral metabolic rate for oxygen while simultaneously increasing cerebral blood flow?",
    setup: "",
    acceptedAnswers: [
      "Uncoupling",
      "uncoupling",
      "cerebral uncoupling",
      "flow metabolism uncoupling",
      "uncoupled cerebral autoregulation",
      "cerebral blood flow uncoupling",
    ],
    rationale: "Uncoupling is defined as decreases in cerebral metabolic rate for oxygen occurring alongside dose-dependent increases in cerebral blood flow.",
    metadata: { topic: "CNS Effects", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "cerebral-physiology", "uncoupling", "short-answer", "high-yield"] }
  },

  {
    id: "n7c7-q035",
    type: "mcq",
    prompt: "How does the addition of nitrous oxide to a volatile anesthetic specifically alter cerebral hemodynamics compared to using the volatile agent alone?",
    setup: "",
    ans: [
      { t: "It increases both the cerebral metabolic rate for oxygen and the cerebral blood flow.", ok: true },
      { t: "It decreases both the cerebral metabolic rate for oxygen and the cerebral blood flow.", ok: false },
      { t: "It maintains both the cerebral metabolic rate for oxygen and the cerebral blood flow.", ok: false },
      { t: "It eliminates both the cerebral metabolic rate for oxygen and the cerebral blood flow.", ok: false },
    ],
    rationale: "While volatile agents generally decrease cerebral metabolic rate for oxygen, the addition of nitrous oxide has been observed to increase both cerebral metabolic rate for oxygen and cerebral blood flow.",
    metadata: { topic: "CNS Effects", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "nitrous-oxide", "cerebral-physiology", "single-choice"] }
  },

  // ─── CARDIOVASCULAR EFFECTS ───────────────────────────────────────────────────

  {
    id: "n7c7-q036",
    type: "short",
    prompt: "Which specific inhalational agent uniquely activates the sympathetic nervous system and actually increases systemic vascular resistance?",
    setup: "",
    acceptedAnswers: [
      "Nitrous oxide", "N2O",
      "nitrous oxide",
      "nitrous",
      "laughing gas",
      "N2O gas",
    ],
    rationale: "While volatile agents uniformly decrease mean arterial pressure via a reduction in systemic vascular resistance, nitrous oxide activates the sympathetic nervous system and increases systemic vascular resistance.",
    metadata: { topic: "Cardiovascular Effects", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "nitrous-oxide", "cardiovascular", "short-answer", "high-yield"] }
  },

  {
    id: "n7c7-q037",
    type: "short",
    prompt: "What highly dangerous phenomenon describes the shunting of myocardial blood flow away from ischemic cardiac tissue toward healthy, easily dilated vessels?",
    setup: "",
    acceptedAnswers: [
      "Coronary steal",
      "coronary steal syndrome",
      "coronary steal phenomenon",
      "coronary artery steal",
      "myocardial steal",
      "steal syndrome",
    ],
    rationale: "Coronary steal is a reverse Robin Hood phenomenon where blood is deprived in ischemic areas and diverted to better perfused areas, a risk with coronary vasodilation from isoflurane or desflurane.",
    metadata: { topic: "Cardiovascular Effects", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "coronary-steal", "cardiovascular", "short-answer", "high-yield"] }
  },

  {
    id: "n7c7-q038",
    type: "multi",
    prompt: "Select TWO volatile anesthetics that specifically increase the patient's heart rate:",
    setup: "",
    choices: ["Isoflurane", "Desflurane", "Sevoflurane", "Halothane"],
    correctAnswers: ["Isoflurane", "Desflurane"],
    selectCount: 2,
    rationale: "Isoflurane and desflurane both increase heart rate. Sevoflurane keeps it stable, and halothane reduces it.",
    metadata: { topic: "Cardiovascular Effects", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "heart-rate", "agents", "multi-select"] }
  },

  {
    id: "n7c7-q039",
    type: "short",
    prompt: "Which inhalational anesthetic is highly recognized for sensitizing the myocardium to catecholamines, thereby increasing the risk of arrhythmias?",
    setup: "",
    acceptedAnswers: [
      "Halothane",
      "halothane",
    ],
    rationale: "Halothane is unique among the agents listed because it sensitizes the myocardium to catecholamines.",
    metadata: { topic: "Cardiovascular Effects", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "halothane", "arrhythmias", "short-answer"] }
  },

  // ─── RESPIRATORY EFFECTS ──────────────────────────────────────────────────────

  {
    id: "n7c7-q040",
    type: "short",
    prompt: "How do volatile anesthetics specifically alter a patient's spontaneous respiratory mechanics?",
    setup: "",
    acceptedAnswers: [
      "Decrease tidal volume; increase rate", "Decrease tidal volume increase rate", "Decrease TV increase rate",
      "decrease tidal volume and increase respiratory rate",
      "decreased TV increased RR",
      "lower tidal volume higher rate",
      "reduced tidal volume increased rate",
      "decrease TV increase RR",
      "decrease tidal volume increase respiratory rate",
      "TV decreases RR increases",
    ],
    rationale: "Volatile agents produce a dose-dependent reduction in tidal volume accompanied by a reflexive increase in respiratory rate.",
    metadata: { topic: "Respiratory Effects", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "respiratory", "short-answer", "high-yield"] }
  },

  {
    id: "n7c7-q041",
    type: "short",
    prompt: "Which three inhalational agents are specifically classified as non-pungent and are utilized to prevent coughing, breath-holding, and laryngospasm during induction?",
    setup: "",
    acceptedAnswers: [
      "Halothane, sevoflurane, N2O", "Halothane sevoflurane N2O", "Halothane, sevoflurane, nitrous oxide",
      "sevoflurane halothane N2O",
      "N2O halothane sevoflurane",
      "halothane sevo nitrous",
      "sevoflurane halothane nitrous oxide",
      "nitrous oxide halothane sevoflurane",
      "halothane sevoflurane nitrous",
      "sevo halothane nitrous oxide",
    ],
    rationale: "Halothane, sevoflurane, and nitrous oxide are non-pungent. Desflurane and isoflurane are pungent and irritating to the airways.",
    metadata: { topic: "Respiratory Effects", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "pungency", "induction", "short-answer"] }
  },

  // ─── SAFETY / TOXICITY ────────────────────────────────────────────────────────

  {
    id: "n7c7-q042",
    type: "short",
    prompt: "The FDA recommends avoiding fresh gas flows less than 1 Liter per minute when using sevoflurane to prevent accumulation of what specific nephrotoxic byproduct?",
    setup: "",
    acceptedAnswers: [
      "Compound A",
      "compound a",
      "compund A",
      "compound A byproduct",
      "sevo compound A",
    ],
    rationale: "Degradation of sevoflurane by soda lime results in Compound A. The FDA limits sevoflurane exposure to 2 MAC-hours at flow rates of 1 to 2 liters per minute and does not recommend flows less than 1 liter per minute.",
    metadata: { topic: "Safety", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "sevoflurane", "compound-a", "safety", "short-answer", "high-yield"] }
  },

  {
    id: "n7c7-q043",
    type: "short",
    prompt: "What extremely dangerous byproduct is produced when either desflurane or isoflurane is degraded by completely dry carbon dioxide absorbents?",
    setup: "",
    acceptedAnswers: [
      "Carbon monoxide", "CO",
      "carbon monoxide gas",
      "CO gas",
      "carbon monoxide poisoning",
    ],
    rationale: "While sevoflurane produces Compound A, the degradation of desflurane or isoflurane by dry absorbents yields carbon monoxide.",
    metadata: { topic: "Safety", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "desflurane", "isoflurane", "carbon-monoxide", "short-answer", "high-yield"] }
  },

  {
    id: "n7c7-q044",
    type: "short",
    prompt: "Which volatile anesthetic undergoes an exceptionally high rate of hepatic metabolism and is linked to immune-mediated fulminant hepatic failure?",
    setup: "",
    acceptedAnswers: [
      "Halothane",
      "halothane",
    ],
    rationale: "Halothane undergoes 12 to 25 percent hepatic metabolism and is associated with halothane hepatitis, which can result in fulminant hepatic failure triggered by an immune response.",
    metadata: { topic: "Hepatic Toxicity", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "halothane", "hepatic-toxicity", "short-answer", "high-yield"] }
  },

  {
    id: "n7c7-q045",
    type: "mcq",
    prompt: "According to recent meta-analyses, how do volatile anesthetics affect patients undergoing resections for cancer compared to total intravenous anesthesia?",
    setup: "",
    ans: [
      { t: "They inhibit the immune response and yield worse overall survival.", ok: true },
      { t: "They augment the immune response and yield worse overall survival.", ok: false },
      { t: "They inhibit the immune response and yield better overall survival.", ok: false },
      { t: "They augment the immune response and yield better overall survival.", ok: false },
    ],
    rationale: "Volatile anesthetics can inhibit the immune response, and studies show worse recurrence-free and overall survival rates compared to using total intravenous anesthesia for cancer resections.",
    metadata: { topic: "Clinical Considerations", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "cancer", "immune-response", "single-choice"] }
  },

  {
    id: "n7c7-q046",
    type: "mcq",
    prompt: "Which specific volatile anesthetic possesses the highest global warming potential and the longest atmospheric lifetime, making it the most detrimental greenhouse gas among modern agents?",
    setup: "",
    ans: [
      { t: "Desflurane", ok: true },
      { t: "Isoflurane", ok: false },
      { t: "Sevoflurane", ok: false },
      { t: "Halothane", ok: false },
    ],
    rationale: "The modern halogenated agents exert environmental greenhouse gas effects in the order of desflurane greater than isoflurane greater than sevoflurane.",
    metadata: { topic: "Clinical Considerations", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "environment", "desflurane", "single-choice"] }
  },

  // ─── FORMULAS ─────────────────────────────────────────────────────────────────

  {
    id: "n7c7-q047",
    type: "short",
    prompt: "How is the pulmonary time constant mathematically calculated for an inhalational anesthetic?",
    setup: "",
    acceptedAnswers: [
      "Capacity divided by flow", "Capacity/flow", "FRC divided by alveolar ventilation",
      "FRC / alveolar ventilation",
      "FRC/flow",
      "volume divided by flow",
      "functional residual capacity divided by alveolar ventilation",
      "capacity over flow",
    ],
    rationale: "A time constant is calculated by dividing the functional residual capacity by the alveolar ventilation flow rate.",
    metadata: { topic: "Pharmacokinetics", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "time-constant", "formula", "short-answer"] }
  },

  {
    id: "n7c7-q048",
    type: "short",
    prompt: "What specific physiological variables are multiplied together to determine the total uptake of an inhalational anesthetic?",
    setup: "",
    acceptedAnswers: [
      "Solubility, cardiac output, gradient", "Solubility cardiac output gradient", "Solubility, CO, gradient",
      "solubility CO AV gradient",
      "solubility blood flow gradient",
      "solubility cardiac output AV gradient",
      "solubility x cardiac output x gradient",
      "solubility and cardiac output and gradient",
    ],
    rationale: "Uptake equals the drug's solubility multiplied by cardiac output multiplied by the arterial-venous difference in partial pressures.",
    metadata: { topic: "Pharmacokinetics", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "uptake", "formula", "short-answer"] }
  },

  {
    id: "n7c7-q049",
    type: "short",
    prompt: "What specific scientific hypothesis states that an anesthetic's clinical potency is directly proportional to its lipid solubility?",
    setup: "",
    acceptedAnswers: [
      "Meyer-Overton Rule", "Meyer Overton Rule",
      "meyer-overton rule",
      "meyer overton rule",
      "Meyer-Overton hypothesis",
      "Meyer Overton hypothesis",
      "meyer overton",
      "meyer-overton",
    ],
    rationale: "The Meyer-Overton Rule dictates that the more lipid-soluble an agent is, the greater its potency, which corresponds to a lower MAC requirement.",
    metadata: { topic: "MAC", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "meyer-overton", "potency", "short-answer"] }
  },

  {
    id: "n7c7-q050",
    type: "short",
    prompt: "What specific pharmacokinetic phenomenon describes the faster alveolar rise of a volatile anesthetic when it is administered concurrently with high concentrations of nitrous oxide?",
    setup: "",
    acceptedAnswers: [
      "The second gas effect", "Second gas effect",
      "the second gas effect",
      "second gas phenomenon",
      "second gas",
    ],
    rationale: "The rate of rise for a volatile anesthetic is greater in the presence of nitrous oxide than without it, which is explicitly known as the second gas effect.",
    metadata: { topic: "Nitrous Oxide", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "second-gas-effect", "nitrous-oxide", "short-answer"] }
  },

  {
    id: "n7c7-q051",
    type: "mcq",
    prompt: "Why do pediatric patients achieve general anesthesia more rapidly than adults?",
    setup: "",
    ans: [
      { t: "Due strictly to higher ventilatory rates and high vessel-rich blood flows.", ok: true },
      { t: "Due strictly to lower ventilatory rates and high vessel-poor blood flows.", ok: false },
      { t: "Due strictly to higher respiratory rates and high muscle-tissue blood flows.", ok: false },
      { t: "Due strictly to lower respiratory rates and high adipose-tissue blood flows.", ok: false },
    ],
    rationale: "Children achieve anesthesia more rapidly than adults primarily because of a significantly higher ventilatory rate and greater blood flow to the vessel-rich group.",
    metadata: { topic: "Pharmacokinetics", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "pediatrics", "single-choice"] }
  },

  {
    id: "n7c7-q052",
    type: "mcq",
    prompt: "How does severe clinical obesity typically alter the induction and emergence phases of an inhalational anesthetic?",
    setup: "",
    ans: [
      { t: "Induction remains unaltered, but emergence becomes significantly prolonged.", ok: true },
      { t: "Induction becomes prolonged, but emergence remains significantly unaltered.", ok: false },
      { t: "Induction becomes accelerated, and emergence remains significantly unaltered.", ok: false },
      { t: "Induction remains unaltered, and emergence becomes significantly accelerated.", ok: false },
    ],
    rationale: "Obesity has minimal clinical effects on anesthetic induction; however, emergence may be significantly slower because of the deposition of anesthetics into fat stores.",
    metadata: { topic: "Pharmacokinetics", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "obesity", "emergence", "single-choice"] }
  },

  {
    id: "n7c7-q053",
    type: "short",
    prompt: "Why does nitrous oxide rapidly expand internal air-filled cavities like an acute pneumothorax or obstructed bowel?",
    setup: "",
    acceptedAnswers: [
      "Nitrogen is less soluble", "Nitrogen less soluble",
      "nitrogen is 34 times less soluble",
      "nitrogen less soluble than N2O",
      "nitrogen is less soluble than nitrous oxide",
      "nitrogen 34 times less soluble",
      "poor nitrogen solubility",
    ],
    rationale: "Nitrous oxide diffuses rapidly into air-containing cavities because these spaces are rich in nitrogen, which is 34 times less soluble than nitrous oxide, causing a massive increase in volume.",
    metadata: { topic: "Nitrous Oxide", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "nitrous-oxide", "air-spaces", "short-answer"] }
  },

  // ─── INDIVIDUAL MAC VALUES ────────────────────────────────────────────────────

  {
    id: "n7c7-q054",
    type: "mcq",
    prompt: "What is the exact Minimum Alveolar Concentration requirement for sevoflurane?",
    setup: "",
    ans: [
      { t: "1.80 percent", ok: true },
      { t: "1.15 percent", ok: false },
      { t: "6.00 percent", ok: false },
      { t: "0.75 percent", ok: false },
    ],
    rationale: "The MAC of sevoflurane is 1.8 percent.",
    metadata: { topic: "MAC", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "sevoflurane", "mac", "single-choice"] }
  },

  {
    id: "n7c7-q055",
    type: "mcq",
    prompt: "What is the exact Minimum Alveolar Concentration requirement for isoflurane?",
    setup: "",
    ans: [
      { t: "1.15 percent", ok: true },
      { t: "1.80 percent", ok: false },
      { t: "6.00 percent", ok: false },
      { t: "0.75 percent", ok: false },
    ],
    rationale: "The MAC of isoflurane is 1.15 percent.",
    metadata: { topic: "MAC", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "isoflurane", "mac", "single-choice"] }
  },

  {
    id: "n7c7-q056",
    type: "mcq",
    prompt: "What is the exact Minimum Alveolar Concentration requirement for desflurane?",
    setup: "",
    ans: [
      { t: "6.00 percent", ok: true },
      { t: "1.80 percent", ok: false },
      { t: "1.15 percent", ok: false },
      { t: "0.75 percent", ok: false },
    ],
    rationale: "The MAC of desflurane is 6.0 percent.",
    metadata: { topic: "MAC", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "desflurane", "mac", "single-choice"] }
  },

  {
    id: "n7c7-q057",
    type: "mcq",
    prompt: "What is the exact Minimum Alveolar Concentration requirement for halothane?",
    setup: "",
    ans: [
      { t: "0.75 percent", ok: true },
      { t: "1.15 percent", ok: false },
      { t: "1.80 percent", ok: false },
      { t: "6.00 percent", ok: false },
    ],
    rationale: "The MAC of halothane is 0.75 percent.",
    metadata: { topic: "MAC", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "halothane", "mac", "single-choice"] }
  },

  {
    id: "n7c7-q058",
    type: "short",
    prompt: "What is the exact Minimum Alveolar Concentration requirement for nitrous oxide?",
    setup: "",
    acceptedAnswers: [
      "105 percent", "105%", "105",
      "one hundred five percent",
      "105 percent MAC",
      "105 MAC",
      "one hundred and five percent",
    ],
    rationale: "The MAC of nitrous oxide is 105 percent, making it the least potent inhalational agent.",
    metadata: { topic: "MAC", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "nitrous-oxide", "mac", "short-answer"] }
  },

  // ─── INDIVIDUAL BLOOD:GAS VALUES ─────────────────────────────────────────────

  {
    id: "n7c7-q059",
    type: "mcq",
    prompt: "What is the precise Blood:Gas partition coefficient for sevoflurane?",
    setup: "",
    ans: [
      { t: "0.60", ok: true },
      { t: "1.40", ok: false },
      { t: "0.42", ok: false },
      { t: "2.50", ok: false },
    ],
    rationale: "Sevoflurane has a Blood:Gas partition coefficient of 0.6.",
    metadata: { topic: "Partition Coefficients", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "sevoflurane", "blood-gas", "single-choice"] }
  },

  {
    id: "n7c7-q060",
    type: "mcq",
    prompt: "What is the precise Blood:Gas partition coefficient for isoflurane?",
    setup: "",
    ans: [
      { t: "1.40", ok: true },
      { t: "0.60", ok: false },
      { t: "0.42", ok: false },
      { t: "2.50", ok: false },
    ],
    rationale: "Isoflurane has a Blood:Gas partition coefficient of 1.4.",
    metadata: { topic: "Partition Coefficients", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "isoflurane", "blood-gas", "single-choice"] }
  },

  {
    id: "n7c7-q061",
    type: "mcq",
    prompt: "What is the precise Blood:Gas partition coefficient for desflurane?",
    setup: "",
    ans: [
      { t: "0.42", ok: true },
      { t: "0.60", ok: false },
      { t: "1.40", ok: false },
      { t: "2.50", ok: false },
    ],
    rationale: "Desflurane has a Blood:Gas partition coefficient of 0.42, making it the fastest of the volatile agents.",
    metadata: { topic: "Partition Coefficients", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "desflurane", "blood-gas", "single-choice"] }
  },

  {
    id: "n7c7-q062",
    type: "mcq",
    prompt: "What is the precise Blood:Gas partition coefficient for halothane?",
    setup: "",
    ans: [
      { t: "2.50", ok: true },
      { t: "1.40", ok: false },
      { t: "0.60", ok: false },
      { t: "0.42", ok: false },
    ],
    rationale: "Halothane has a Blood:Gas partition coefficient of 2.5, making it the slowest of the volatile agents.",
    metadata: { topic: "Partition Coefficients", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "halothane", "blood-gas", "single-choice"] }
  },

  {
    id: "n7c7-q063",
    type: "short",
    prompt: "What is the precise Blood:Gas partition coefficient for nitrous oxide?",
    setup: "",
    acceptedAnswers: [
      "0.47",
      "point 47",
      ".47",
      "0.47 blood gas",
    ],
    rationale: "Nitrous oxide has a Blood:Gas partition coefficient of 0.47.",
    metadata: { topic: "Partition Coefficients", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "nitrous-oxide", "blood-gas", "short-answer"] }
  },

  // ─── INDIVIDUAL OIL:GAS VALUES ────────────────────────────────────────────────

  {
    id: "n7c7-q064",
    type: "mcq",
    prompt: "What is the precise Oil:Gas partition coefficient for sevoflurane?",
    setup: "",
    ans: [
      { t: "47", ok: true },
      { t: "91", ok: false },
      { t: "19", ok: false },
      { t: "224", ok: false },
    ],
    rationale: "Sevoflurane has an Oil:Gas coefficient of 47.",
    metadata: { topic: "Partition Coefficients", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "sevoflurane", "oil-gas", "single-choice"] }
  },

  {
    id: "n7c7-q065",
    type: "mcq",
    prompt: "What is the precise Oil:Gas partition coefficient for isoflurane?",
    setup: "",
    ans: [
      { t: "91", ok: true },
      { t: "47", ok: false },
      { t: "19", ok: false },
      { t: "224", ok: false },
    ],
    rationale: "Isoflurane has an Oil:Gas coefficient of 91.",
    metadata: { topic: "Partition Coefficients", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "isoflurane", "oil-gas", "single-choice"] }
  },

  {
    id: "n7c7-q066",
    type: "mcq",
    prompt: "What is the precise Oil:Gas partition coefficient for desflurane?",
    setup: "",
    ans: [
      { t: "19", ok: true },
      { t: "47", ok: false },
      { t: "91", ok: false },
      { t: "224", ok: false },
    ],
    rationale: "Desflurane has an Oil:Gas coefficient of 19.",
    metadata: { topic: "Partition Coefficients", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "desflurane", "oil-gas", "single-choice"] }
  },

  {
    id: "n7c7-q067",
    type: "mcq",
    prompt: "What is the precise Oil:Gas partition coefficient for halothane?",
    setup: "",
    ans: [
      { t: "224", ok: true },
      { t: "91", ok: false },
      { t: "47", ok: false },
      { t: "19", ok: false },
    ],
    rationale: "Halothane has an Oil:Gas coefficient of 224, making it the most lipid-soluble and most potent.",
    metadata: { topic: "Partition Coefficients", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "halothane", "oil-gas", "single-choice"] }
  },

  {
    id: "n7c7-q068",
    type: "short",
    prompt: "What is the precise Oil:Gas partition coefficient for nitrous oxide?",
    setup: "",
    acceptedAnswers: [
      "1.4",
      "one point four",
      "1.4 oil gas",
    ],
    rationale: "Nitrous oxide has an extremely low Oil:Gas coefficient of 1.4.",
    metadata: { topic: "Partition Coefficients", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "nitrous-oxide", "oil-gas", "short-answer"] }
  },

  // ─── INDIVIDUAL VAPOR PRESSURES ───────────────────────────────────────────────

  {
    id: "n7c7-q069",
    type: "mcq",
    prompt: "What is the exact measured vapor pressure for sevoflurane?",
    setup: "",
    ans: [
      { t: "157 mmHg", ok: true },
      { t: "238 mmHg", ok: false },
      { t: "669 mmHg", ok: false },
      { t: "243 mmHg", ok: false },
    ],
    rationale: "Sevoflurane has a vapor pressure of 157 mmHg.",
    metadata: { topic: "Agent Properties", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "sevoflurane", "vapor-pressure", "single-choice"] }
  },

  {
    id: "n7c7-q070",
    type: "mcq",
    prompt: "What is the exact measured vapor pressure for isoflurane?",
    setup: "",
    ans: [
      { t: "238 mmHg", ok: true },
      { t: "157 mmHg", ok: false },
      { t: "669 mmHg", ok: false },
      { t: "243 mmHg", ok: false },
    ],
    rationale: "Isoflurane has a vapor pressure of 238 mmHg.",
    metadata: { topic: "Agent Properties", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "isoflurane", "vapor-pressure", "single-choice"] }
  },

  {
    id: "n7c7-q071",
    type: "mcq",
    prompt: "What is the exact measured vapor pressure for desflurane?",
    setup: "",
    ans: [
      { t: "669 mmHg", ok: true },
      { t: "238 mmHg", ok: false },
      { t: "157 mmHg", ok: false },
      { t: "243 mmHg", ok: false },
    ],
    rationale: "Desflurane has an exceptionally high vapor pressure of 669 mmHg, boiling near room temperature.",
    metadata: { topic: "Agent Properties", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "desflurane", "vapor-pressure", "single-choice"] }
  },

  {
    id: "n7c7-q072",
    type: "mcq",
    prompt: "What is the exact measured vapor pressure for halothane?",
    setup: "",
    ans: [
      { t: "243 mmHg", ok: true },
      { t: "238 mmHg", ok: false },
      { t: "157 mmHg", ok: false },
      { t: "669 mmHg", ok: false },
    ],
    rationale: "Halothane has a vapor pressure of 243 mmHg.",
    metadata: { topic: "Agent Properties", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "halothane", "vapor-pressure", "single-choice"] }
  },

  // ─── MAC MODIFIERS (ADDITIONAL) ───────────────────────────────────────────────

  {
    id: "n7c7-q073",
    type: "multi",
    prompt: "Select FOUR specific clinical factors that will actively increase a patient's Minimum Alveolar Concentration requirement:",
    setup: "",
    choices: [
      "Chronic alcohol consumption",
      "Hyperthyroidism condition",
      "Cocaine administration",
      "Decreasing patient age",
      "Acute alcohol intoxication",
      "Pregnancy condition",
    ],
    correctAnswers: [
      "Chronic alcohol consumption",
      "Hyperthyroidism condition",
      "Cocaine administration",
      "Decreasing patient age",
    ],
    selectCount: 4,
    rationale: "Decreasing age, hyperthermia, hyperthyroidism, hypernatremia, chronic alcohol use, MAOIs, and cocaine use all increase the MAC requirement.",
    metadata: { topic: "MAC", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "mac", "increase-mac", "multi-select"] }
  },

  {
    id: "n7c7-q074",
    type: "multi",
    prompt: "Select FOUR specific clinical factors that will actively decrease a patient's Minimum Alveolar Concentration requirement:",
    setup: "",
    choices: [
      "Advancing patient age",
      "Acute alcohol intoxication",
      "Maternal pregnancy state",
      "Profound systemic hypoxia",
      "Chronic alcohol consumption",
      "Hyperthyroidism condition",
    ],
    correctAnswers: [
      "Advancing patient age",
      "Acute alcohol intoxication",
      "Maternal pregnancy state",
      "Profound systemic hypoxia",
    ],
    selectCount: 4,
    rationale: "Advancing age, hypothermia, acute alcohol use, acidosis, hypoxemia, anemia, hypotension, and pregnancy all decrease the MAC requirement.",
    metadata: { topic: "MAC", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "mac", "decrease-mac", "multi-select"] }
  },

  {
    id: "n7c7-q075",
    type: "multi",
    prompt: "Select THREE specific clinical factors that will produce no change in a patient's Minimum Alveolar Concentration requirement:",
    setup: "",
    choices: [
      "Patient biological gender",
      "Duration of anesthesia",
      "Systemic arterial hypertension",
      "Advancing patient age",
      "Acute alcohol intoxication",
    ],
    correctAnswers: [
      "Patient biological gender",
      "Duration of anesthesia",
      "Systemic arterial hypertension",
    ],
    selectCount: 3,
    rationale: "Duration of anesthesia, gender, carbon dioxide levels, alkalosis, and hypertension do not change MAC.",
    metadata: { topic: "MAC", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "mac", "no-change-mac", "multi-select"] }
  },

  {
    id: "n7c7-q076",
    type: "short",
    prompt: "What specific clinical measurement represents the anesthetic concentration at which fifty percent of patients will respond to the command to open their eyes?",
    setup: "",
    acceptedAnswers: [
      "MAC-awake", "MAC awake",
      "mac awake",
      "mac-awake",
      "MAC awake value",
      "awake MAC",
    ],
    rationale: "MAC-awake measures the concentration where 50% of patients respond to command, typically occurring at about one-third of the standard MAC value.",
    metadata: { topic: "MAC", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "mac-awake", "short-answer"] }
  },

  // ─── GUEDEL'S STAGES (ADDITIONAL) ────────────────────────────────────────────

  {
    id: "n7c7-q077",
    type: "short",
    prompt: "According to Guedel's stages, what specific clinical characteristics define Stage 1 of anesthesia?",
    setup: "",
    acceptedAnswers: [
      "Analgesia; intact skeletal movement", "Analgesia and intact skeletal movement",
      "analgesia",
      "stage 1 analgesia",
      "analgesia with intact skeletal movement",
      "pain loss intact movement",
    ],
    rationale: "Stage 1 is the analgesia stage characterized by mild cortical center depression, loss of pain sensation, and intact skeletal movement.",
    metadata: { topic: "Guedel's Stages", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "gudedel", "stage-1", "short-answer"] }
  },

  {
    id: "n7c7-q078",
    type: "short",
    prompt: "What classical stage of anesthesia is defined by an excitement phase featuring tachycardia, divergent eyes, and an extremely high risk for complications during emergence?",
    setup: "",
    acceptedAnswers: [
      "Stage 2", "Stage II",
      "stage two",
      "excitement stage",
      "stage 2 excitement",
      "two",
      "2",
    ],
    rationale: "Stage 2 is the excitement stage. It is related to central depression of motor centers leaving the involuntary system dominant and is highly obvious and dangerous during emergence.",
    metadata: { topic: "Guedel's Stages", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "gudedel", "stage-2", "short-answer"] }
  },

  {
    id: "n7c7-q079",
    type: "short",
    prompt: "During Stage 3 of surgical anesthesia, what specific physiological event distinctly marks the transition into Plane 3?",
    setup: "",
    acceptedAnswers: [
      "Paralysis of intercostal muscles", "Intercostal paralysis",
      "intercostal muscle paralysis",
      "paralysis of intercostals",
      "intercostal muscles paralyzed",
      "intercostal paresis",
    ],
    rationale: "Stage 3 consists of four planes, with Plane 3 marked by paralysis of the intercostal muscles.",
    metadata: { topic: "Guedel's Stages", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "gudedel", "stage-3", "short-answer"] }
  },

  {
    id: "n7c7-q080",
    type: "short",
    prompt: "What classical stage of anesthesia is characterized strictly by profound respiratory paralysis and cardiovascular collapse due to toxic overdose?",
    setup: "",
    acceptedAnswers: [
      "Stage 4", "Stage IV",
      "stage four",
      "stage 4 overdose",
      "stage 4 respiratory arrest",
      "four",
      "4",
    ],
    rationale: "Stage 4 is respiratory paralysis and postmortem, occurring due to a toxic overdose with severe cardiovascular and respiratory depression.",
    metadata: { topic: "Guedel's Stages", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "gudedel", "stage-4", "short-answer"] }
  },

  {
    id: "n7c7-q081",
    type: "short",
    prompt: "What unique physiological phenomenon occurs when volatile agents actively decrease the cerebral metabolic rate for oxygen while simultaneously increasing cerebral blood flow?",
    setup: "",
    acceptedAnswers: [
      "Uncoupling",
      "uncoupling",
      "cerebral uncoupling",
      "flow metabolism uncoupling",
      "cerebral blood flow uncoupling",
    ],
    rationale: "Uncoupling is defined as dose-dependent decreases in cerebral metabolic rate for oxygen occurring alongside increases in cerebral blood flow, partially disrupting normal cerebral autoregulation.",
    metadata: { topic: "CNS Effects", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "uncoupling", "cerebral-physiology", "short-answer"] }
  },

  {
    id: "n7c7-q082",
    type: "short",
    prompt: "What specific effect do volatile anesthetics have on a patient's electroencephalogram readings?",
    setup: "",
    acceptedAnswers: [
      "Dose-dependent suppression", "Dose dependent suppression",
      "dose dependent EEG suppression",
      "EEG suppression",
      "suppression",
      "dose-related suppression",
      "suppress EEG",
      "EEG depression",
    ],
    rationale: "Volatile agents produce a dose-dependent suppression of EEG activity.",
    metadata: { topic: "CNS Effects", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "eeg", "short-answer"] }
  },

  {
    id: "n7c7-q083",
    type: "short",
    prompt: "Which specific inhalational agent uniquely activates the sympathetic nervous system and actively increases both systemic vascular resistance and pulmonary vascular resistance?",
    setup: "",
    acceptedAnswers: [
      "Nitrous oxide", "N2O",
      "nitrous oxide",
      "nitrous",
      "laughing gas",
    ],
    rationale: "While volatile agents uniformly decrease blood pressure via a reduction in systemic vascular resistance, nitrous oxide uniquely activates the sympathetic nervous system, increasing systemic vascular resistance and pulmonary vascular resistance.",
    metadata: { topic: "Cardiovascular Effects", priority: "high", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "nitrous-oxide", "cardiovascular", "short-answer", "high-yield"] }
  },

  {
    id: "n7c7-q084",
    type: "multi",
    prompt: "Select TWO volatile anesthetics that specifically cause a clinical increase in the patient's heart rate:",
    setup: "",
    choices: ["Isoflurane", "Desflurane", "Sevoflurane", "Halothane"],
    correctAnswers: ["Isoflurane", "Desflurane"],
    selectCount: 2,
    rationale: "Isoflurane and desflurane both increase heart rate. Sevoflurane keeps it stable, and halothane reduces it.",
    metadata: { topic: "Cardiovascular Effects", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "heart-rate", "agents", "multi-select"] }
  },

  {
    id: "n7c7-q085",
    type: "mcq",
    prompt: "Which of the following specific medication classes is highly effective at treating status asthmaticus because it safely relaxes airway smooth muscle?",
    setup: "",
    ans: [
      { t: "The volatile inhalational anesthetics.", ok: true },
      { t: "The intravenous barbiturate class.", ok: false },
      { t: "The intravenous benzodiazepine class.", ok: false },
      { t: "The depolarizing muscle relaxants.", ok: false },
    ],
    rationale: "Volatile anesthetics relax airway smooth muscle producing bronchodilation, making them highly useful for treating status asthmaticus.",
    metadata: { topic: "Respiratory Effects", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "status-asthmaticus", "volatile-agents", "single-choice"] }
  },

  {
    id: "n7c7-q086",
    type: "short",
    prompt: "What are the FDA guidelines regarding fresh gas flow rates and time limits to prevent Compound A toxicity when administering sevoflurane?",
    setup: "",
    acceptedAnswers: [
      "Max 2 MAC-hours; flows >1 L/min", "2 MAC-hours and flows greater than 1 L/min",
      "2 MAC-hours",
      "2 MAC hours 1 L/min",
      "less than 1 liter per minute flows not recommended",
      "2 MAC hours flows greater than 1 LPM",
      "max 2 MAC hours",
    ],
    rationale: "The FDA recommends that exposure to sevoflurane should not exceed 2 MAC-hours at flow rates of 1 to 2 liters per minute, and fresh gas flow rates less than 1 liter per minute are not recommended.",
    metadata: { topic: "Safety", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "sevoflurane", "compound-a", "safety", "short-answer"] }
  },

  {
    id: "n7c7-q087",
    type: "mcq",
    prompt: "How do isoflurane, desflurane, and sevoflurane specifically affect hepatic artery blood flow compared to halothane?",
    setup: "",
    ans: [
      { t: "They maintain or increase hepatic artery blood flow.", ok: true },
      { t: "They restrict or decrease hepatic artery blood flow.", ok: false },
      { t: "They eliminate or block hepatic artery blood flow.", ok: false },
      { t: "They mirror halothane's hepatic artery blood flow.", ok: false },
    ],
    rationale: "While all agents decrease total hepatic blood flow, isoflurane, desflurane, and sevoflurane maintain or increase hepatic artery flow, whereas halothane reduces it the most.",
    metadata: { topic: "Hepatic Effects", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "hepatic-blood-flow", "agents", "single-choice"] }
  },

  {
    id: "n7c7-q088",
    type: "short",
    prompt: "What are the two distinct clinical presentations of halothane hepatitis?",
    setup: "",
    acceptedAnswers: [
      "Mild reaction and fulminant failure", "Mild reaction; fulminant failure",
      "mild hepatic reaction and fulminant hepatic failure",
      "mild and fulminant",
      "mild hepatitis and fulminant hepatic failure",
      "mild reaction fulminant failure",
      "mild hepatitis fulminant failure",
    ],
    rationale: "Halothane hepatitis presents as either a mild hepatic reaction or a rare fulminant hepatic failure triggered by an immune response.",
    metadata: { topic: "Hepatic Toxicity", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "halothane", "hepatic-toxicity", "short-answer"] }
  },

  {
    id: "n7c7-q089",
    type: "mcq",
    prompt: "How do volatile anesthetics specifically alter the immune response and cancer survival rates when compared to total intravenous anesthesia?",
    setup: "",
    ans: [
      { t: "They inhibit the immune response and yield worse overall survival.", ok: true },
      { t: "They augment the immune response and yield worse overall survival.", ok: false },
      { t: "They inhibit the immune response and yield better overall survival.", ok: false },
      { t: "They augment the immune response and yield better overall survival.", ok: false },
    ],
    rationale: "Volatile anesthetics can inhibit the immune response, and recent data show worse recurrence-free and overall survival rates compared to total intravenous anesthesia for cancer resections.",
    metadata: { topic: "Clinical Considerations", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "cancer", "immune-response", "single-choice"] }
  },

  {
    id: "n7c7-q090",
    type: "mcq",
    prompt: "Which of the following lists correctly orders the modern halogenated anesthetics by their global warming potential from the highest to the lowest?",
    setup: "",
    ans: [
      { t: "Desflurane, Isoflurane, Sevoflurane.", ok: true },
      { t: "Sevoflurane, Isoflurane, Desflurane.", ok: false },
      { t: "Isoflurane, Sevoflurane, Desflurane.", ok: false },
      { t: "Desflurane, Sevoflurane, Isoflurane.", ok: false },
    ],
    rationale: "The modern halogenated agents exert environmental greenhouse gas effects in the order of desflurane greater than isoflurane greater than sevoflurane.",
    metadata: { topic: "Clinical Considerations", priority: "medium", category: "inhaled-anesthetics", source: "node-7-chapter-7", tags: ["basics-of-anesthesia", "node-7", "chapter-7", "environment", "agents", "single-choice"] }
  },

];

export const INHALED_ANESTHETICS_METADATA = {
  nodeId: "node-7",
  courseId: "basics-of-anesthesia",
  chapter: "Chapter 7",
  title: "Inhaled Anesthetics",
  questionSetId: "basics-anesthesia-node-7-chapter-7-inhaled-anesthetics",
  tags: ["basics-of-anesthesia", "node-7", "chapter-7", "inhaled-anesthetics", "nbcrna-style"],
  totalQuestions: INHALED_ANESTHETICS_QUESTIONS.length,
  questionTypes: {
    mcq:   INHALED_ANESTHETICS_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: INHALED_ANESTHETICS_QUESTIONS.filter(q => q.type === 'multi').length,
    short: INHALED_ANESTHETICS_QUESTIONS.filter(q => q.type === 'short').length,
  }
};
