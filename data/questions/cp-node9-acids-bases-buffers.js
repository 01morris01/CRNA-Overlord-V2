/**
 * Chemistry & Physics for Anesthesia — Node 9
 * Acids, Bases & Buffers
 *
 * Topics: pH scale, hydrogen ion concentration, Bronsted-Lowry & Lewis
 * acids/bases, strong vs weak acids, Ka/pKa, Henderson-Hasselbalch,
 * buffer systems (bicarbonate, phosphate, protein, hemoglobin),
 * ABG interpretation, metabolic & respiratory acid-base disorders,
 * anion gap, buffer capacity, CO2/bicarbonate system, clinical scenarios.
 *
 * Source: NAS 510 Acids, Bases & Buffers Lecture
 */

export const CP_NODE9_QUESTIONS = [

  // ═══════════════════════════════════════════════════════════════════════════
  // pH SCALE, HYDROGEN ION CONCENTRATION, LOGARITHMIC NATURE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n9-001",
    type: "mcq",
    prompt: "Normal arterial blood pH is 7.40. What is the corresponding hydrogen ion concentration [H+]?",
    setup: "",
    ans: [
      { t: "40 nmol/L, the normal [H+] when pH equals 7.40", ok: true },
      { t: "40 mmol/L, since [H+] sits in the millimolar range", ok: false },
      { t: "7.4 nmol/L, since [H+] simply equals the pH number", ok: false },
      { t: "4.0 nmol/L, one tenth of the pH value in nanomoles", ok: false },
    ],
    rationale: "At a pH of 7.40, [H+] = 10^(-7.40) mol/L = approximately 40 nmol/L (40 x 10^-9 mol/L). This is an extremely small concentration compared to other plasma electrolytes (Na+ ~140 mmol/L), yet tight regulation of [H+] within 35-45 nmol/L is essential for enzymatic function, protein structure, and cellular processes. Anesthesia providers must understand this relationship because small pH changes reflect large proportional changes in [H+].",
    scene: "chemistry_lab",
    sceneCfg: { label: "pH & [H+] RELATIONSHIP" },
    metadata: { topic: "pH Scale", priority: "high" },
  },

  {
    id: "cp-n9-002",
    type: "mcq",
    prompt: "Because pH is a logarithmic scale, a decrease in pH from 7.4 to 7.1 represents what approximate change in hydrogen ion concentration?",
    setup: "",
    ans: [
      { t: "A doubling of [H+], from about 40 to about 80 nmol/L", ok: true },
      { t: "A 30 percent rise in [H+], matching the 0.3 pH change", ok: false },
      { t: "A tenfold rise in [H+], since 0.1 pH unit is one log", ok: false },
      { t: "No real change in [H+], a 0.3 pH shift is trivial here", ok: false },
    ],
    rationale: "pH = -log[H+], so the relationship is inverse and logarithmic. A 0.3 unit decrease in pH corresponds to a doubling of [H+] (log 2 = 0.301). At pH 7.4, [H+] is ~40 nmol/L; at pH 7.1, [H+] is ~80 nmol/L. This logarithmic nature means that seemingly small pH changes represent substantial alterations in [H+]. A clinically useful rule: for every 0.01 unit change in pH, [H+] changes by approximately 1 nmol/L (near the normal range).",
    scene: "chemistry_lab",
    sceneCfg: { label: "LOGARITHMIC pH SCALE" },
    metadata: { topic: "pH Scale", priority: "high" },
  },

  {
    id: "cp-n9-003",
    type: "mcq",
    prompt: "Which of the following correctly describes the pH of a neutral solution at 37 degrees C (body temperature)?",
    setup: "",
    ans: [
      { t: "About 6.8, since the Kw of water rises with temperature", ok: true },
      { t: "Exactly 7.0, since neutral pH never depends on temperature", ok: false },
      { t: "About 7.4, since neutral pH equals normal blood pH here", ok: false },
      { t: "About 7.8, since higher temperature lifts neutral pH up", ok: false },
    ],
    rationale: "The neutral pH of water (where [H+] = [OH-]) is 7.0 only at 25 degrees C. At 37 degrees C, the ion product of water (Kw) increases from 10^-14 to approximately 2.4 x 10^-14, making neutral pH approximately 6.8. This means blood at pH 7.4 is actually more alkaline relative to neutral water at body temperature than it appears. Understanding this is relevant when interpreting intracellular pH and the alpha-stat versus pH-stat strategies for managing pH during hypothermic cardiopulmonary bypass.",
    scene: "chemistry_lab",
    sceneCfg: { label: "NEUTRAL pH AT BODY TEMP" },
    metadata: { topic: "pH Scale", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BRONSTED-LOWRY vs LEWIS ACIDS/BASES
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n9-004",
    type: "mcq",
    prompt: "According to the Bronsted-Lowry definition, what characterizes an acid?",
    setup: "",
    ans: [
      { t: "A proton (H+) donor, any species that gives up a hydrogen ion", ok: true },
      { t: "An electron pair acceptor, any species taking a lone pair", ok: false },
      { t: "A species that releases OH- ions when dissolved in water", ok: false },
      { t: "Any species whose aqueous solution shows a pH below 7.0", ok: false },
    ],
    rationale: "The Bronsted-Lowry definition is the most clinically relevant acid-base framework. An acid is a proton (H+) donor, and a base is a proton acceptor. For example, carbonic acid (H2CO3) donates a proton to become bicarbonate (HCO3-), its conjugate base. This definition is broader than the Arrhenius definition (which requires aqueous solutions) and is essential for understanding physiological buffer systems, drug ionization, and acid-base homeostasis.",
    scene: "chemistry_lab",
    sceneCfg: { label: "BRONSTED-LOWRY DEFINITION" },
    metadata: { topic: "Acid-Base Definitions", priority: "high" },
  },

  {
    id: "cp-n9-005",
    type: "mcq",
    prompt: "A Lewis acid is best described as which of the following?",
    setup: "",
    ans: [
      { t: "An electron pair acceptor that forms a coordinate bond", ok: true },
      { t: "A proton donor that releases hydrogen ions into solution", ok: false },
      { t: "A species that raises [OH-] in an aqueous solution", ok: false },
      { t: "Any molecule able to hydrogen bond with water molecules", ok: false },
    ],
    rationale: "The Lewis definition is the broadest acid-base concept. A Lewis acid is an electron pair acceptor; a Lewis base is an electron pair donor. This definition encompasses reactions without proton transfer. Clinically relevant examples include metal ion interactions: Fe2+ in hemoglobin acts as a Lewis acid accepting electron pairs from O2 and CO. BF3 (boron trifluoride) is a classic Lewis acid. Understanding Lewis acid-base chemistry helps explain drug-receptor interactions and metal-ligand coordination in biological systems.",
    scene: "chemistry_lab",
    sceneCfg: { label: "LEWIS ACID — e- PAIR ACCEPTOR" },
    metadata: { topic: "Acid-Base Definitions", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STRONG vs WEAK ACIDS/BASES, Ka, pKa
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n9-006",
    type: "mcq",
    prompt: "Hydrochloric acid (HCl) is classified as a strong acid because:",
    setup: "",
    ans: [
      { t: "It dissociates fully in water, ionizing almost 100 percent", ok: true },
      { t: "It carries a very high molecular weight versus other acids", ok: false },
      { t: "It releases more heat per mole when mixed with water", ok: false },
      { t: "It has a pKa above 7, giving strong buffering at body pH", ok: false },
    ],
    rationale: "Strong acids dissociate completely (100%) in aqueous solution. HCl -> H+ + Cl- with no remaining undissociated HCl molecules. Other strong acids include H2SO4, HNO3, and HClO4. In contrast, weak acids only partially dissociate and exist in equilibrium between ionized and unionized forms. Gastric acid is essentially HCl (pH ~1-2), and its aspiration during anesthesia can cause severe chemical pneumonitis (Mendelson syndrome) precisely because of this complete dissociation and extreme acidity.",
    scene: "chemistry_lab",
    sceneCfg: { label: "STRONG ACID — COMPLETE DISSOCIATION" },
    metadata: { topic: "Strong vs Weak Acids", priority: "high" },
  },

  {
    id: "cp-n9-007",
    type: "mcq",
    prompt: "The pKa of a weak acid is defined as the pH at which:",
    setup: "",
    ans: [
      { t: "50% of the acid is in its ionized (conjugate base) form and 50% is unionized — [A-] = [HA]", ok: true },
      { t: "The acid is completely dissociated and no unionized molecules remain in solution", ok: false },
      { t: "The buffering capacity of the acid is at its minimum and cannot resist pH changes", ok: false },
      { t: "The acid begins to precipitate out of solution due to exceeding its solubility product", ok: false },
    ],
    rationale: "pKa = -log(Ka), where Ka is the acid dissociation constant. At pH = pKa, exactly half the acid is dissociated ([A-] = [HA]), which is the point of maximum buffering capacity. This concept is central to understanding drug ionization: local anesthetics (pKa ~7.6-8.9) exist in pH-dependent equilibrium between ionized (charged, water-soluble) and unionized (uncharged, lipid-soluble) forms. The unionized form crosses nerve membranes, while the ionized form binds the sodium channel. This is why local anesthetics work poorly in infected (acidic) tissue.",
    scene: "chemistry_lab",
    sceneCfg: { label: "pKa — HALF IONIZED" },
    metadata: { topic: "pKa and Dissociation", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HENDERSON-HASSELBALCH EQUATION
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n9-008",
    type: "mcq",
    prompt: "The Henderson-Hasselbalch equation is pH = pKa + log([A-]/[HA]). For the bicarbonate buffer system, which substitution is correct?",
    setup: "",
    ans: [
      { t: "pH = 6.1 + log([HCO3-] / [0.03 x PaCO2]), using pKa 6.1 for H2CO3", ok: true },
      { t: "pH = 7.4 + log([HCO3-] / [PaCO2]), using blood pH as the pKa value", ok: false },
      { t: "pH = 6.1 + log([PaCO2] / [HCO3-]), placing the CO2 term on top", ok: false },
      { t: "pH = 7.1 + log([HCO3-] / [H2CO3]), using the pKa of body water", ok: false },
    ],
    rationale: "For the bicarbonate system: pH = 6.1 + log([HCO3-] / [0.03 x PaCO2]). The pKa of carbonic acid (H2CO3) is 6.1. Because dissolved CO2 is in equilibrium with H2CO3, and direct H2CO3 measurement is impractical, we use 0.03 x PaCO2 (where 0.03 is the solubility coefficient of CO2 in plasma at 37C in mmol/L/mmHg). Normal values: pH = 6.1 + log(24/1.2) = 6.1 + log(20) = 6.1 + 1.3 = 7.4. This equation is the cornerstone of clinical ABG interpretation.",
    scene: "chemistry_lab",
    sceneCfg: { label: "HENDERSON-HASSELBALCH — HCO3/CO2" },
    metadata: { topic: "Henderson-Hasselbalch", priority: "high" },
  },

  {
    id: "cp-n9-009",
    type: "mcq",
    prompt: "Using Henderson-Hasselbalch, if a patient's PaCO2 rises from 40 to 80 mmHg with HCO3- unchanged at 24 mEq/L, what is the approximate new pH?",
    setup: "",
    ans: [
      { t: "7.10, since doubling PaCO2 halves the ratio and cuts pH by 0.3", ok: true },
      { t: "7.25, since pH falls about 0.15 for each doubling of PaCO2", ok: false },
      { t: "7.00, since doubling PaCO2 drives a full 0.4 unit fall in pH", ok: false },
      { t: "7.35, since buffering leaves PaCO2 with little effect on pH", ok: false },
    ],
    rationale: "pH = 6.1 + log(24 / [0.03 x 80]) = 6.1 + log(24/2.4) = 6.1 + log(10) = 6.1 + 1.0 = 7.10. Doubling PaCO2 from 40 to 80 cuts the [HCO3-]/[CO2] ratio from 20 to 10, and log(10) = 1.0 vs log(20) = 1.3, so pH drops by 0.3 units. This acute respiratory acidosis scenario occurs with hypoventilation during anesthesia (e.g., opioid-induced respiratory depression, bronchospasm, circuit obstruction). The 0.3 unit drop per doubling of PaCO2 is a clinically useful rule of thumb.",
    scene: "chemistry_lab",
    sceneCfg: { label: "PaCO2 DOUBLED — pH DROP" },
    metadata: { topic: "Henderson-Hasselbalch", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BUFFER SYSTEMS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n9-010",
    type: "mcq",
    prompt: "Which buffer system is the most important extracellular buffer in the body?",
    setup: "",
    ans: [
      { t: "Bicarbonate buffer (H2CO3/HCO3-), set by both lungs and kidneys", ok: true },
      { t: "Phosphate buffer (H2PO4-/HPO4 2-), the main buffer in all fluids", ok: false },
      { t: "Hemoglobin buffer, dominant in plasma due to its concentration", ok: false },
      { t: "Protein buffer, supplying most extracellular buffering capacity", ok: false },
    ],
    rationale: "The bicarbonate system (H2CO3/HCO3-) is the most important extracellular buffer despite its pKa of 6.1 being far from blood pH 7.4. Its effectiveness comes from three factors: (1) high concentration of HCO3- (~24 mEq/L), (2) the open system nature — CO2 is continuously removed by ventilation (lungs) and HCO3- is regulated by the kidneys, and (3) the large reservoir of CO2. The phosphate system is more important intracellularly and in renal tubular fluid. Hemoglobin buffers within RBCs, not in extracellular fluid.",
    scene: "chemistry_lab",
    sceneCfg: { label: "BICARBONATE BUFFER — ECF" },
    metadata: { topic: "Buffer Systems", priority: "high" },
  },

  {
    id: "cp-n9-011",
    type: "mcq",
    prompt: "Hemoglobin is an effective physiologic buffer primarily because:",
    setup: "",
    ans: [
      { t: "Its histidine imidazole groups have a pKa near physiologic pH", ok: true },
      { t: "It dissolves freely in plasma, buffering the extracellular fluid", ok: false },
      { t: "Its heme iron groups neutralize H+ directly by redox reactions", ok: false },
      { t: "It turns CO2 into carbonic acid in plasma without any enzyme", ok: false },
    ],
    rationale: "Hemoglobin accounts for about 35% of total blood buffering capacity. The imidazole side chains of its 38 histidine residues have pKa values near 6.8, close to physiologic pH, making them effective buffers. Critically, deoxygenated hemoglobin (deoxy-Hb) is a weaker acid (better proton acceptor/buffer) than oxygenated hemoglobin (oxy-Hb). This is the Haldane effect: as Hb releases O2 in tissues, it becomes a better buffer and picks up CO2 and H+; in the lungs, oxygenation releases CO2 and H+. Hb is intracellular (within RBCs), not dissolved in plasma.",
    scene: "chemistry_lab",
    sceneCfg: { label: "HEMOGLOBIN BUFFER — HALDANE" },
    metadata: { topic: "Buffer Systems", priority: "high" },
  },

  {
    id: "cp-n9-012",
    type: "mcq",
    prompt: "The phosphate buffer system (H2PO4-/HPO4 2-) is most physiologically important in which compartment?",
    setup: "",
    ans: [
      { t: "Intracellular fluid and renal tubular fluid, where phosphate is high", ok: true },
      { t: "Arterial plasma, where it holds pH between 7.35 and 7.45 tightly", ok: false },
      { t: "Cerebrospinal fluid, where it is the only buffer for the brain", ok: false },
      { t: "Interstitial fluid, where it supplies most extracellular buffering", ok: false },
    ],
    rationale: "The phosphate buffer system has a pKa of 6.8, closer to intracellular pH (~7.0-7.2) than blood pH (7.4), making it a more effective buffer intracellularly. Intracellular phosphate concentrations are much higher (~75 mmol/L) than plasma levels (~1 mmol/L). In the kidneys, phosphate is concentrated in tubular fluid and serves as a major urinary buffer (titratable acidity), accepting secreted H+ ions as part of renal acid excretion. This allows the kidneys to excrete acid without dropping urine pH to dangerously low levels.",
    scene: "chemistry_lab",
    sceneCfg: { label: "PHOSPHATE BUFFER — ICF & RENAL" },
    metadata: { topic: "Buffer Systems", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ABG INTERPRETATION
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n9-013",
    type: "mcq",
    prompt: "An ABG shows: pH 7.28, PaCO2 60 mmHg, HCO3- 27 mEq/L. What is the primary acid-base disturbance?",
    setup: "",
    ans: [
      { t: "Acute respiratory acidosis, high PaCO2 with only mild HCO3- rise", ok: true },
      { t: "Metabolic acidosis, since a low pH always comes from metabolism", ok: false },
      { t: "Chronic respiratory acidosis, with full renal HCO3- compensation", ok: false },
      { t: "Mixed respiratory and metabolic alkalosis, since HCO3- is high", ok: false },
    ],
    rationale: "pH is low (acidemia) and PaCO2 is elevated (>40), pointing to respiratory acidosis as the primary disorder. HCO3- is only mildly elevated (27 vs normal 24), consistent with acute compensation (in acute respiratory acidosis, HCO3- rises ~1 mEq/L per 10 mmHg rise in PaCO2 due to tissue buffering). If chronic (renal compensation), HCO3- would rise ~3.5 mEq/L per 10 mmHg PaCO2 increase (expected ~31 mEq/L). This scenario commonly occurs during anesthesia from inadequate ventilation, airway obstruction, or excessive dead space.",
    scene: "chemistry_lab",
    sceneCfg: { label: "ABG — ACUTE RESP ACIDOSIS" },
    metadata: { topic: "ABG Interpretation", priority: "high" },
  },

  {
    id: "cp-n9-014",
    type: "mcq",
    prompt: "An ABG shows: pH 7.52, PaCO2 30 mmHg, HCO3- 24 mEq/L. What is the acid-base disturbance?",
    setup: "",
    ans: [
      { t: "Acute respiratory alkalosis, low PaCO2 with normal HCO3- so far", ok: true },
      { t: "Metabolic alkalosis, since excess bicarbonate raises the pH here", ok: false },
      { t: "Compensated metabolic acidosis, low PaCO2 as the compensation", ok: false },
      { t: "Mixed acid-base disorder, since PaCO2 and HCO3- are both off", ok: false },
    ],
    rationale: "The high pH (alkalemia) with low PaCO2 and normal HCO3- is classic acute respiratory alkalosis. The patient is hyperventilating and blowing off CO2 faster than it is produced. HCO3- is normal because renal compensation (decreased HCO3- reabsorption) takes 2-5 days. Causes during anesthesia include pain, anxiety, light anesthesia, mechanical over-ventilation, hypoxemia-driven tachypnea, and central neurogenic hyperventilation. Acute respiratory alkalosis shifts the oxyhemoglobin curve left, impairs cerebral blood flow, and can cause arrhythmias.",
    scene: "chemistry_lab",
    sceneCfg: { label: "ABG — RESP ALKALOSIS" },
    metadata: { topic: "ABG Interpretation", priority: "high" },
  },

  {
    id: "cp-n9-015",
    type: "mcq",
    prompt: "Base excess (BE) on an ABG is defined as:",
    setup: "",
    ans: [
      { t: "Strong acid or base needed to titrate blood to pH 7.40 at PaCO2 40", ok: true },
      { t: "The difference between measured HCO3- and the normal 24 mEq/L", ok: false },
      { t: "The total of all blood buffer bases, including Hb and phosphate", ok: false },
      { t: "The ratio of bicarbonate to dissolved CO2 as a single number", ok: false },
    ],
    rationale: "Base excess (normal: -2 to +2 mEq/L) represents the metabolic component of acid-base status, independent of respiratory factors. It is calculated by determining how much strong acid (positive BE) or strong base (negative BE, also called base deficit) is needed to return blood pH to 7.40 at standardized conditions (PaCO2 40 mmHg, 37C). A negative BE (base deficit) indicates metabolic acidosis; a positive BE indicates metabolic alkalosis. Anesthesia providers use BE to guide bicarbonate therapy: dose (mEq NaHCO3) = BE x 0.3 x body weight (kg).",
    scene: "chemistry_lab",
    sceneCfg: { label: "BASE EXCESS — METABOLIC INDEX" },
    metadata: { topic: "ABG Interpretation", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // METABOLIC ACIDOSIS/ALKALOSIS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n9-016",
    type: "mcq",
    prompt: "A patient presents with metabolic acidosis (pH 7.25, HCO3- 12 mEq/L). The expected respiratory compensation (Winter's formula) predicts PaCO2 should be approximately:",
    setup: "",
    ans: [
      { t: "27 mmHg, from Winter's formula (1.5 x 12) + 8 equals about 26", ok: true },
      { t: "40 mmHg, since PaCO2 stays normal in a purely metabolic problem", ok: false },
      { t: "50 mmHg, since the body retains CO2 to offset low bicarbonate", ok: false },
      { t: "15 mmHg, since PaCO2 should fall to match the HCO3- value", ok: false },
    ],
    rationale: "Winter's formula predicts the expected PaCO2 for appropriate respiratory compensation in metabolic acidosis: PaCO2 = (1.5 x [HCO3-]) + 8 (plus or minus 2). For HCO3- of 12: PaCO2 = 18 + 8 = 26 mmHg (range 24-28). If the measured PaCO2 is higher than predicted, there is a concurrent respiratory acidosis; if lower, there is a concurrent respiratory alkalosis. This formula is essential for identifying mixed acid-base disorders, which frequently occur in critically ill surgical patients.",
    scene: "chemistry_lab",
    sceneCfg: { label: "WINTER'S FORMULA" },
    metadata: { topic: "Metabolic Acidosis", priority: "high" },
  },

  {
    id: "cp-n9-017",
    type: "mcq",
    prompt: "Which of the following is the most common cause of metabolic alkalosis in surgical patients?",
    setup: "",
    ans: [
      { t: "Nasogastric suction or vomiting, losing gastric H+ and Cl- as acid", ok: true },
      { t: "Excess normal saline, whose high chloride load drives alkalosis", ok: false },
      { t: "Hyperventilation on the ventilator, removing CO2 and raising HCO3-", ok: false },
      { t: "Acute kidney injury, failing to excrete the retained bicarbonate", ok: false },
    ],
    rationale: "Vomiting and nasogastric suction remove gastric acid (HCl), causing metabolic alkalosis through loss of H+ and Cl-. The resulting hypochloremia impairs renal bicarbonate excretion (chloride-responsive alkalosis). Volume contraction activates the RAAS, further promoting H+ secretion and HCO3- reabsorption in the kidneys. Treatment includes volume repletion with normal saline (provides Cl- for renal HCO3- excretion) and KCl replacement. This is extremely common in surgical patients with bowel obstruction or prolonged NGT drainage.",
    scene: "chemistry_lab",
    sceneCfg: { label: "METABOLIC ALKALOSIS — GI LOSSES" },
    metadata: { topic: "Metabolic Alkalosis", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RESPIRATORY ACIDOSIS/ALKALOSIS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n9-018",
    type: "mcq",
    prompt: "During general anesthesia, a patient's end-tidal CO2 (ETCO2) steadily rises to 65 mmHg. Which is the most likely cause of this acute respiratory acidosis?",
    setup: "",
    ans: [
      { t: "Inadequate minute ventilation failing to clear produced CO2", ok: true },
      { t: "Excess sodium bicarbonate being converted into extra CO2 load", ok: false },
      { t: "Malignant hyperthermia, which raises ETCO2 but acidifies metabolism", ok: false },
      { t: "Renal failure, since the kidneys cannot excrete enough of the CO2", ok: false },
    ],
    rationale: "Acute respiratory acidosis during anesthesia is most commonly caused by inadequate minute ventilation (low tidal volume, low respiratory rate, or increased dead space). The lungs are the only route for CO2 elimination. Common causes under anesthesia include: opioid-induced respiratory depression, residual neuromuscular blockade, bronchospasm, circuit malfunction, endobronchial intubation, and exhausted CO2 absorber. Note: malignant hyperthermia does cause dramatically rising ETCO2, but the primary disorder is a hypermetabolic state causing both increased CO2 production AND metabolic (lactic) acidosis. Kidneys excrete fixed acids, not CO2.",
    scene: "chemistry_lab",
    sceneCfg: { label: "RESP ACIDOSIS — HYPOVENTILATION" },
    metadata: { topic: "Respiratory Acidosis", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ANION GAP
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n9-019",
    type: "mcq",
    prompt: "The anion gap is calculated as Na+ - (Cl- + HCO3-). A patient's labs show Na+ 140, Cl- 100, HCO3- 15 mEq/L. The anion gap is:",
    setup: "",
    ans: [
      { t: "25 mEq/L, well above normal, marking an anion gap acidosis", ok: true },
      { t: "12 mEq/L, within normal limits, so no acid-base problem here", ok: false },
      { t: "40 mEq/L, equal to unmeasured cations minus unmeasured anions", ok: false },
      { t: "15 mEq/L, since the anion gap matches the bicarbonate level", ok: false },
    ],
    rationale: "AG = Na+ - (Cl- + HCO3-) = 140 - (100 + 15) = 25 mEq/L. Normal AG is 8-12 mEq/L (representing unmeasured anions like albumin, phosphate, sulfate, and organic acids). An elevated AG indicates accumulation of unmeasured anions (organic acids). The mnemonic MUDPILES helps recall causes: Methanol, Uremia, DKA, Propylene glycol/Paraldehyde, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates. This calculation is essential for the anesthesia provider evaluating metabolic acidosis in the perioperative period.",
    scene: "chemistry_lab",
    sceneCfg: { label: "ANION GAP CALCULATION" },
    metadata: { topic: "Anion Gap", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CO2/BICARBONATE SYSTEM & CLINICAL BUFFERING
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n9-020",
    type: "mcq",
    prompt: "The enzyme carbonic anhydrase catalyzes the reaction CO2 + H2O <-> H2CO3. Where is this enzyme most abundantly located?",
    setup: "",
    ans: [
      { t: "Red blood cells, where it speeds CO2 hydration for HCO3- transport", ok: true },
      { t: "Plasma, where the enzyme circulates freely at high concentrations", ok: false },
      { t: "Hepatocytes, since the liver mainly turns CO2 into bicarbonate", ok: false },
      { t: "Alveolar cells, where it aids gas exchange across the membrane", ok: false },
    ],
    rationale: "Carbonic anhydrase (CA) is abundant in red blood cells, renal tubular cells, and gastric parietal cells. In RBCs, CA accelerates the hydration of CO2 to H2CO3 by a factor of ~13,000, which then rapidly dissociates to H+ and HCO3-. The HCO3- is transported out of the RBC into plasma via the chloride shift (HCO3-/Cl- exchanger, band 3 protein), while H+ is buffered by deoxyhemoglobin. In the lungs, the process reverses. Acetazolamide, a carbonic anhydrase inhibitor used for altitude sickness and glaucoma, causes metabolic acidosis by impairing renal HCO3- reabsorption.",
    scene: "chemistry_lab",
    sceneCfg: { label: "CARBONIC ANHYDRASE — RBCs" },
    metadata: { topic: "CO2/Bicarbonate System", priority: "high" },
  },

  {
    id: "cp-n9-021",
    type: "mcq",
    prompt: "Buffer capacity is maximal when the pH of the solution equals the pKa of the buffer. Despite having a pKa of 6.1 (far from blood pH 7.4), the bicarbonate buffer system is effective because:",
    setup: "",
    ans: [
      { t: "It is an open system, with lungs setting CO2 and kidneys setting HCO3-", ok: true },
      { t: "Its pKa shifts up to 7.4 at body temperature through protein binding", ok: false },
      { t: "Carbonic acid greatly outnumbers bicarbonate, giving extra capacity", ok: false },
      { t: "The bicarbonate system only buffers respiratory, not metabolic, loads", ok: false },
    ],
    rationale: "In a closed system, a buffer with pKa 6.1 would be a poor buffer at pH 7.4 (operating far from maximal capacity). However, the bicarbonate system is open: ventilation controls CO2 removal (adjusting the acid component) and the kidneys regulate HCO3- reabsorption/excretion (adjusting the base component). This dual organ regulation means the system never reaches true chemical equilibrium, maintaining effective buffering. Additionally, the large total body CO2 and HCO3- pools provide enormous buffering capacity. This open-system concept is fundamental to understanding why ventilator adjustments rapidly alter pH.",
    scene: "chemistry_lab",
    sceneCfg: { label: "OPEN SYSTEM BUFFERING" },
    metadata: { topic: "Buffer Capacity", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CLINICAL SCENARIOS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n9-022",
    type: "mcq",
    prompt: "A patient with diabetic ketoacidosis (DKA) presents with pH 7.15, PaCO2 20 mmHg, HCO3- 7 mEq/L, and Kussmaul respirations. The deep rapid breathing represents:",
    setup: "",
    ans: [
      { t: "Maximal respiratory compensation, driving PaCO2 down to lift the pH", ok: true },
      { t: "A primary respiratory alkalosis running alongside the acidosis here", ok: false },
      { t: "Respiratory failure from ketoacid injury to the brainstem center", ok: false },
      { t: "A measurement artifact, since PaCO2 cannot fall below 25 mmHg ever", ok: false },
    ],
    rationale: "Kussmaul breathing (deep, rapid respirations) is the body's maximal respiratory compensation for severe metabolic acidosis. Peripheral and central chemoreceptors detect the low pH and stimulate hyperventilation to lower PaCO2. Using Winter's formula: expected PaCO2 = (1.5 x 7) + 8 = 18.5 mmHg (range 16.5-20.5). The measured PaCO2 of 20 falls within this range, confirming appropriate compensation (not a separate respiratory disorder). In DKA, ketoacids (beta-hydroxybutyrate, acetoacetate) consume HCO3-, producing an anion gap metabolic acidosis. Treatment priorities: insulin, fluids, potassium monitoring.",
    scene: "chemistry_lab",
    sceneCfg: { label: "DKA — KUSSMAUL BREATHING" },
    metadata: { topic: "Clinical Scenarios", priority: "high" },
  },

  {
    id: "cp-n9-023",
    type: "mcq",
    prompt: "Lactic acidosis during anesthesia is most commonly caused by:",
    setup: "",
    ans: [
      { t: "Tissue hypoperfusion, forcing cells into anaerobic glycolysis", ok: true },
      { t: "Excess lactated Ringer's, whose lactate directly causes acidosis", ok: false },
      { t: "Hypothermia, since cold raises lactate by driving aerobic work", ok: false },
      { t: "Hyperventilation, where alkalosis triggers lactic acid production", ok: false },
    ],
    rationale: "Type A lactic acidosis (most common) results from tissue hypoperfusion and hypoxia. When O2 delivery is insufficient, cells shift from aerobic metabolism (oxidative phosphorylation) to anaerobic glycolysis, producing lactate instead of entering the Krebs cycle. Causes during anesthesia include: hemorrhagic shock, cardiogenic shock, aortic cross-clamping, tourniquet ischemia, mesenteric ischemia, and sepsis. Lactated Ringer's does NOT cause lactic acidosis — the lactate is rapidly metabolized to bicarbonate by the liver. Rising intraoperative lactate (>2 mmol/L) should prompt investigation of perfusion adequacy.",
    scene: "chemistry_lab",
    sceneCfg: { label: "LACTIC ACIDOSIS — HYPOPERFUSION" },
    metadata: { topic: "Clinical Scenarios", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MULTI-SELECT QUESTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n9-024",
    type: "multi",
    prompt: "Select the THREE causes of anion gap metabolic acidosis from the following list:",
    setup: "",
    choices: [
      "Diabetic ketoacidosis (DKA)",
      "Prolonged vomiting",
      "Lactic acidosis from shock",
      "Diarrhea with bicarbonate loss",
      "Ethylene glycol ingestion",
    ],
    correctAnswers: [
      "Diabetic ketoacidosis (DKA)",
      "Lactic acidosis from shock",
      "Ethylene glycol ingestion",
    ],
    selectCount: 3,
    rationale: "Anion gap metabolic acidosis results from accumulation of unmeasured organic acids. DKA produces ketoacids (beta-hydroxybutyrate, acetoacetate). Lactic acidosis adds lactate. Ethylene glycol is metabolized to glycolic and oxalic acids. In contrast, vomiting causes metabolic alkalosis (loss of HCl), and diarrhea causes non-anion-gap (hyperchloremic) metabolic acidosis because it directly loses HCO3-. The mnemonic MUDPILES captures the anion gap causes: Methanol, Uremia, DKA, Propylene glycol, Isoniazid, Lactic acidosis, Ethylene glycol, Salicylates.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Anion Gap", priority: "high" },
  },

  {
    id: "cp-n9-025",
    type: "multi",
    prompt: "Select the TWO correct statements about the chloride shift (Hamburger phenomenon):",
    setup: "",
    choices: [
      "HCO3- moves out of RBCs into plasma in exchange for Cl- entering the RBC via band 3 protein",
      "The chloride shift occurs in venous blood as CO2 enters RBCs and is converted to HCO3-",
      "The chloride shift moves Cl- out of RBCs to maintain electrical neutrality when HCO3- enters",
      "The chloride shift occurs exclusively in the pulmonary capillaries during gas exchange",
      "The chloride shift is an active transport process requiring ATP from RBC glycolysis",
    ],
    correctAnswers: [
      "HCO3- moves out of RBCs into plasma in exchange for Cl- entering the RBC via band 3 protein",
      "The chloride shift occurs in venous blood as CO2 enters RBCs and is converted to HCO3-",
    ],
    selectCount: 2,
    rationale: "In tissue capillaries, CO2 diffuses into RBCs where carbonic anhydrase rapidly converts it to H2CO3, which dissociates to H+ and HCO3-. The HCO3- is then transported out of the RBC into plasma via the band 3 anion exchanger (AE1), with Cl- moving in to maintain electroneutrality — this is the chloride shift. It is a passive, facilitated exchange (not active transport). The reverse occurs in the lungs: HCO3- re-enters RBCs, Cl- exits, and CO2 is regenerated for exhalation. This process allows the majority of CO2 (~70%) to be transported as plasma bicarbonate.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "CO2/Bicarbonate System", priority: "medium" },
  },

  {
    id: "cp-n9-026",
    type: "multi",
    prompt: "Select the TWO situations in which sodium bicarbonate (NaHCO3) administration is most clearly indicated during anesthesia:",
    setup: "",
    choices: [
      "Severe metabolic acidosis (pH < 7.10) refractory to other treatments causing hemodynamic instability",
      "Acute respiratory acidosis from hypoventilation during mechanical ventilation",
      "Hyperkalemia with ECG changes — NaHCO3 helps shift potassium intracellularly",
      "Mild metabolic acidosis (pH 7.30) from brief tourniquet use during orthopedic surgery",
      "Respiratory alkalosis from hyperventilation-induced anxiety in the preoperative area",
    ],
    correctAnswers: [
      "Severe metabolic acidosis (pH < 7.10) refractory to other treatments causing hemodynamic instability",
      "Hyperkalemia with ECG changes — NaHCO3 helps shift potassium intracellularly",
    ],
    selectCount: 2,
    rationale: "NaHCO3 is indicated for: (1) severe metabolic acidosis (pH <7.10-7.15) with hemodynamic compromise when the underlying cause cannot be rapidly corrected, and (2) life-threatening hyperkalemia with ECG changes, where NaHCO3 alkalinizes the blood and shifts K+ intracellularly. It is NOT indicated for respiratory acidosis (treatment is improving ventilation), mild metabolic acidosis (address the underlying cause), or respiratory alkalosis. Important caveats: NaHCO3 generates CO2 (requires adequate ventilation), provides a large sodium load, and can cause hypokalemia and overshoot alkalosis. Dose: 1-2 mEq/kg IV.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Buffer Capacity", priority: "high" },
  },

  {
    id: "cp-n9-027",
    type: "multi",
    prompt: "Select the THREE physiologic buffer systems that operate in the blood:",
    setup: "",
    choices: [
      "Bicarbonate buffer (H2CO3/HCO3-)",
      "Hemoglobin buffer (HHb/Hb-)",
      "Plasma protein buffer (primarily albumin)",
      "Ammonia buffer (NH3/NH4+)",
      "Acetate buffer (CH3COOH/CH3COO-)",
    ],
    correctAnswers: [
      "Bicarbonate buffer (H2CO3/HCO3-)",
      "Hemoglobin buffer (HHb/Hb-)",
      "Plasma protein buffer (primarily albumin)",
    ],
    selectCount: 3,
    rationale: "The three major blood buffer systems are: (1) Bicarbonate (handles ~64% of ECF buffering, regulated by lungs and kidneys), (2) Hemoglobin (handles ~35% of whole blood buffering via histidine residues, enhanced by deoxygenation — Haldane effect), and (3) Plasma proteins, especially albumin (contribute ~7% of plasma buffering via ionizable amino acid side chains). The ammonia buffer system operates in the renal tubules (not blood) as part of renal acid excretion. Acetate buffer is not a physiologic blood buffer system, though acetate is used in some IV solutions and is metabolized to bicarbonate.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Buffer Systems", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SHORT ANSWER QUESTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n9-028",
    type: "short",
    prompt: "What is the normal ratio of bicarbonate (HCO3-) to dissolved CO2 (0.03 x PaCO2) that maintains a blood pH of 7.40?",
    setup: "",
    acceptedAnswers: [
      "20:1",
      "20 to 1",
      "20/1",
      "twenty to one",
    ],
    canonicalAnswer: "20:1",
    rationale: "The Henderson-Hasselbalch equation shows that pH = 6.1 + log([HCO3-]/[0.03 x PaCO2]). At normal values: [HCO3-] = 24 mEq/L and [0.03 x 40] = 1.2 mEq/L. The ratio is 24/1.2 = 20. log(20) = 1.3, and 6.1 + 1.3 = 7.4. Therefore, a 20:1 ratio of bicarbonate to dissolved CO2 maintains normal pH. Any process that alters this ratio changes pH. The body can compensate by adjusting either component: the lungs regulate CO2 (the denominator) within minutes, while the kidneys adjust HCO3- (the numerator) over hours to days.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Henderson-Hasselbalch", priority: "high" },
  },

  {
    id: "cp-n9-029",
    type: "short",
    prompt: "What is the normal anion gap value (in mEq/L)?",
    setup: "",
    acceptedAnswers: [
      "12",
      "8-12",
      "8 to 12",
      "10-12",
      "10",
      "8-16",
      "12 mEq/L",
    ],
    canonicalAnswer: "8-12 mEq/L",
    rationale: "The normal anion gap is 8-12 mEq/L (some sources cite 10-12 or up to 14 depending on the laboratory). It is calculated as AG = Na+ - (Cl- + HCO3-). The gap represents unmeasured anions in plasma, primarily albumin (~75% of the normal AG), plus phosphate, sulfate, and organic anions. An elevated AG (>12-14) indicates accumulation of unmeasured acids (MUDPILES). Importantly, hypoalbuminemia (common in critically ill patients) lowers the AG by ~2.5 mEq/L for each 1 g/dL decrease in albumin below 4.0 g/dL, potentially masking an anion gap acidosis.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Anion Gap", priority: "high" },
  },

  {
    id: "cp-n9-030",
    type: "short",
    prompt: "In the Henderson-Hasselbalch equation for the bicarbonate system (pH = pKa + log[HCO3-]/[0.03 x PaCO2]), what is the pKa value of carbonic acid?",
    setup: "",
    acceptedAnswers: [
      "6.1",
      "6.10",
    ],
    canonicalAnswer: "6.1",
    rationale: "The pKa of carbonic acid (H2CO3) is 6.1. This value is used in the Henderson-Hasselbalch equation for the bicarbonate buffer system: pH = 6.1 + log([HCO3-]/[0.03 x PaCO2]). Although 6.1 is far from blood pH (7.4), the bicarbonate system remains the most important extracellular buffer because it operates as an open system — CO2 is continuously regulated by ventilation and HCO3- by renal function. The 6.1 value is actually a composite pKa accounting for the equilibrium between CO2, H2CO3, H+, and HCO3- (the true pKa of H2CO3 dissociation is approximately 3.6, but the slow hydration of CO2 shifts the apparent pKa to 6.1).",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Henderson-Hasselbalch", priority: "medium" },
  },

];

export const CP_NODE9_METADATA = {
  nodeId:   "cp-node-9",
  courseId: "chem-phys-anesthesia",
  chapter:  "Acids, Bases & Buffers",
  title:    "Acids, Bases & Buffers",
  totalQuestions: CP_NODE9_QUESTIONS.length,
  questionTypes: {
    mcq:   CP_NODE9_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: CP_NODE9_QUESTIONS.filter(q => q.type === 'multi').length,
    short: CP_NODE9_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
