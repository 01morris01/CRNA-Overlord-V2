/**
 * Chemistry & Physics for Anesthesia — Node 9
 * Acids, Bases & Buffers
 *
 * Topics: Arrhenius/Brønsted-Lowry definitions, pH/pOH, strong vs weak
 * acids/bases, Henderson-Hasselbalch, buffer systems (bicarbonate, phosphate,
 * protein/hemoglobin), clinical acid-base (metabolic/respiratory acidosis &
 * alkalosis), anion gap, compensation, ABG interpretation, clinical relevtic
 * to anesthesia (hyperventilation, bicarb administration, lactate, etc.)
 */

export const CP_NODE9_QUESTIONS = [

  // ═══════════════════════════════════════════════════════════════
  // DEFINITIONS & FUNDAMENTALS
  // ═══════════════════════════════════════════════════════════════

  { id: "cp-n9-001", type: "mcq",
    prompt: "According to the Brønsted-Lowry definition, an acid is a substance that:",
    setup: "",
    ans: [
      { t: "Donates a proton (H⁺) to another substance in a chemical reaction",  ok: true  },
      { t: "Accepts a proton (H⁺) from another substance in a chemical reaction", ok: false },
      { t: "Donates an electron pair to form a coordinate covalent bond with another molecule", ok: false },
      { t: "Produces hydroxide ions (OH⁻) when dissolved in an aqueous water solution",        ok: false },
    ],
    rationale: "Brønsted-Lowry: acid = proton (H⁺) donor; base = proton acceptor. This is broader than the Arrhenius definition (acid produces H⁺ in water, base produces OH⁻) because it applies to non-aqueous systems too. The Lewis definition (acid = electron pair acceptor) is even broader but less commonly used in clinical acid-base discussions.",
    scene: null, metadata: { topic: "Acid-Base Definitions", priority: "medium" },
  },

  { id: "cp-n9-002", type: "mcq",
    prompt: "What does pH measure, and what is the normal arterial blood pH range?",
    setup: "",
    ans: [
      { t: "The negative logarithm of hydrogen ion concentration; normal arterial pH is 7.35 to 7.45",  ok: true  },
      { t: "The direct concentration of hydrogen ions in moles per liter; normal arterial pH is 7.0 to 7.5", ok: false },
      { t: "The ratio of bicarbonate to carbonic acid in plasma; normal arterial pH is 6.80 to 7.20",        ok: false },
      { t: "The partial pressure of carbon dioxide dissolved in arterial blood; normal pH is 35 to 45",       ok: false },
    ],
    rationale: "pH = −log[H⁺]. Normal arterial pH is 7.35–7.45. Below 7.35 = acidemia; above 7.45 = alkalemia. Because pH is a logarithmic scale, a change of 1 pH unit represents a 10-fold change in [H⁺]. Normal [H⁺] is approximately 40 nmol/L (at pH 7.40). Life is generally incompatible with pH below ~6.8 or above ~7.8.",
    scene: null, metadata: { topic: "pH", priority: "high" },
  },

  { id: "cp-n9-003", type: "mcq",
    prompt: "If blood pH drops from 7.40 to 7.10, by what factor has the hydrogen ion concentration changed?",
    setup: "",
    ans: [
      { t: "It has approximately doubled — each 0.3 pH unit decrease represents a roughly 2-fold increase in [H⁺]",  ok: true  },
      { t: "It has increased by exactly 0.30 units — pH and [H⁺] have a direct linear one-to-one relationship",       ok: false },
      { t: "It has increased 10-fold — each 0.1 pH unit change corresponds to a 10-fold change in [H⁺] concentration", ok: false },
      { t: "It has not changed significantly — a 0.30 pH change is clinically insignificant for hydrogen ion levels",    ok: false },
    ],
    rationale: "pH is logarithmic: a decrease of ~0.3 pH units doubles [H⁺] (because log₁₀(2) ≈ 0.3). So pH 7.40 → [H⁺] ~40 nmol/L; pH 7.10 → [H⁺] ~80 nmol/L (doubled). A full 1.0 pH unit change = 10-fold [H⁺] change. This is why seemingly small pH changes are clinically significant — a pH of 7.10 represents severe acidemia with major physiologic consequences.",
    scene: null, metadata: { topic: "pH", priority: "high" },
  },

  { id: "cp-n9-004", type: "mcq",
    prompt: "What distinguishes a STRONG acid from a WEAK acid?",
    setup: "",
    ans: [
      { t: "A strong acid completely dissociates in solution, releasing all its H⁺ ions; a weak acid only partially dissociates",  ok: true  },
      { t: "A strong acid has a higher molecular weight; a weak acid has a lower molecular weight for its chemical structure",      ok: false },
      { t: "A strong acid is more concentrated in solution; a weak acid is more dilute at the same molar concentration level",      ok: false },
      { t: "A strong acid is corrosive to metals; a weak acid is safe to handle without any protective equipment or precautions",    ok: false },
    ],
    rationale: "Strong acids (HCl, H₂SO₄) dissociate completely — every molecule releases H⁺. Weak acids (carbonic acid H₂CO₃, acetic acid) only partially dissociate — an equilibrium exists between ionized and un-ionized forms. The pKa of a weak acid indicates where this equilibrium sits. In the body, carbonic acid (H₂CO₃) is the key weak acid in the bicarbonate buffer system.",
    scene: null, metadata: { topic: "Acid-Base Definitions", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════
  // BUFFER SYSTEMS
  // ═══════════════════════════════════════════════════════════════

  { id: "cp-n9-005", type: "mcq",
    prompt: "What is a buffer, and why are buffers essential in human physiology?",
    setup: "",
    ans: [
      { t: "A solution that resists pH change when acid or base is added — essential because enzymes function within narrow pH ranges",  ok: true  },
      { t: "A solution that always maintains pH at exactly 7.40 regardless of how much acid or base is introduced into the system",      ok: false },
      { t: "A strong acid that neutralizes bases to prevent alkalosis — the body's primary defense against metabolic alkalosis",          ok: false },
      { t: "A protein that transports hydrogen ions across cell membranes — essential for maintaining intracellular pH at 6.80",           ok: false },
    ],
    rationale: "A buffer is a solution containing a weak acid and its conjugate base (or weak base and conjugate acid) that RESISTS pH change when acid or base is added. Buffers don't prevent pH change entirely — they minimize it. The body's buffer systems are critical because enzymatic function, protein structure, and cellular processes require pH within a narrow range (7.35–7.45 for blood).",
    scene: null, metadata: { topic: "Buffers", priority: "high" },
  },

  { id: "cp-n9-006", type: "mcq",
    prompt: "The bicarbonate buffer system (CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻) is the most important extracellular buffer. Why is it so effective?",
    setup: "",
    ans: [
      { t: "Both components are independently regulated — CO₂ by the lungs and HCO₃⁻ by the kidneys, allowing rapid and sustained correction",  ok: true  },
      { t: "It has the highest pKa of any buffer system at 7.40, which exactly matches normal blood pH and maximizes buffering capacity there",    ok: false },
      { t: "Bicarbonate is present in the highest concentration of any ion in the body, far exceeding all other buffer species combined",           ok: false },
      { t: "The reaction is irreversible — once H⁺ is consumed by bicarbonate, it cannot be regenerated under any physiologic conditions",          ok: false },
    ],
    rationale: "The bicarbonate system is uniquely effective because it is an OPEN system: CO₂ (the acid component) is regulated by ventilation (lungs — fast, minutes), and HCO₃⁻ (the base component) is regulated by renal reabsorption/excretion (kidneys — slow, hours to days). This dual regulation makes it far more powerful than a closed buffer. Its pKa is actually 6.1 (not 7.4), which would make it a poor buffer in a closed system — but the open regulation compensates.",
    scene: null, metadata: { topic: "Buffers", priority: "high" },
  },

  { id: "cp-n9-007", type: "multi",
    prompt: "Besides the bicarbonate system, which are the other major buffer systems in the body? (Select THREE)",
    setup: "",
    choices: [
      "Hemoglobin buffer — the largest non-bicarbonate intracellular buffer in red blood cells",
      "Phosphate buffer — important intracellular buffer and in renal tubular fluid (HPO₄²⁻/H₂PO₄⁻)",
      "Plasma protein buffer — albumin and other proteins with ionizable amino acid side chains",
      "Sodium chloride buffer — NaCl dissociates to buffer acids by releasing chloride as a proton acceptor",
      "Calcium carbonate buffer — CaCO₃ from bone continuously dissolves to neutralize any acid in plasma",
    ],
    correctAnswers: [
      "Hemoglobin buffer — the largest non-bicarbonate intracellular buffer in red blood cells",
      "Phosphate buffer — important intracellular buffer and in renal tubular fluid (HPO₄²⁻/H₂PO₄⁻)",
      "Plasma protein buffer — albumin and other proteins with ionizable amino acid side chains",
    ],
    selectCount: 3,
    rationale: "Major body buffer systems: (1) Bicarbonate (most important ECF buffer), (2) Hemoglobin (largest non-bicarb buffer, in RBCs — imidazole groups on histidine), (3) Phosphate (important ICF buffer and in renal tubules), (4) Plasma proteins (albumin histidine residues). NaCl is not a buffer — it fully dissociates into strong ions. While bone does release CaCO₃ in chronic acidosis, this is a compensatory mechanism, not a buffer system per se.",
    scene: null, metadata: { topic: "Buffers", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════
  // HENDERSON-HASSELBALCH
  // ═══════════════════════════════════════════════════════════════

  { id: "cp-n9-008", type: "mcq",
    prompt: "The Henderson-Hasselbalch equation for the bicarbonate system is pH = 6.1 + log([HCO₃⁻]/[H₂CO₃]). At normal pH 7.40, what is the ratio of bicarbonate to carbonic acid?",
    setup: "",
    ans: [
      { t: "20:1 — there is 20 times more bicarbonate than carbonic acid at normal arterial blood pH of 7.40",  ok: true  },
      { t: "1:20 — there is 20 times more carbonic acid than bicarbonate at normal arterial blood pH of 7.40",   ok: false },
      { t: "1:1 — bicarbonate and carbonic acid are present in equal concentrations at normal physiologic pH",    ok: false },
      { t: "10:1 — there is 10 times more bicarbonate than carbonic acid at the pKa of the buffer system",        ok: false },
    ],
    rationale: "pH = 6.1 + log([HCO₃⁻]/[H₂CO₃]). At pH 7.40: 7.40 = 6.1 + log(ratio) → log(ratio) = 1.3 → ratio = 10^1.3 ≈ 20. So [HCO₃⁻]/[H₂CO₃] = 20:1. Normal values: HCO₃⁻ ≈ 24 mEq/L, H₂CO₃ ≈ 1.2 mEq/L (derived from PaCO₂ × 0.03). Anything that disturbs this 20:1 ratio changes pH.",
    scene: null, metadata: { topic: "Henderson-Hasselbalch", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════
  // CLINICAL ACID-BASE DISORDERS
  // ═══════════════════════════════════════════════════════════════

  { id: "cp-n9-009", type: "mcq",
    prompt: "A patient has pH 7.28, PaCO₂ 60 mmHg, HCO₃⁻ 26 mEq/L. What is the primary acid-base disorder?",
    setup: "",
    ans: [
      { t: "Respiratory acidosis — elevated PaCO₂ is the primary disturbance causing the low pH (acidemia)",  ok: true  },
      { t: "Metabolic acidosis — the slightly elevated bicarbonate indicates a metabolic acid production problem", ok: false },
      { t: "Respiratory alkalosis — the elevated PaCO₂ causes alkalemia through CO₂ retention and buffering",     ok: false },
      { t: "Mixed metabolic and respiratory alkalosis — both components are contributing to an alkalemic state",     ok: false },
    ],
    rationale: "pH <7.35 = acidemia. PaCO₂ 60 (high) = respiratory acid. HCO₃⁻ 26 (slightly above normal 24) = early renal compensation (kidneys retaining bicarb to offset the respiratory acid). Primary disorder: respiratory acidosis. Causes: hypoventilation (opioid overdose, COPD exacerbation, residual NMB, obesity hypoventilation). In anesthesia, this is commonly seen with inadequate ventilation settings.",
    scene: null, metadata: { topic: "ABG Interpretation", priority: "high" },
  },

  { id: "cp-n9-010", type: "mcq",
    prompt: "A patient has pH 7.52, PaCO₂ 28 mmHg, HCO₃⁻ 23 mEq/L. What is the primary disorder and a common anesthesia-related cause?",
    setup: "",
    ans: [
      { t: "Respiratory alkalosis — from hyperventilation; common cause is excessive mechanical ventilation settings",  ok: true  },
      { t: "Metabolic alkalosis — from bicarbonate retention; common cause is excessive IV sodium bicarbonate infusion", ok: false },
      { t: "Respiratory acidosis — from hypoventilation; common cause is residual neuromuscular blockade in recovery",   ok: false },
      { t: "Metabolic acidosis — from lactic acid production; common cause is prolonged tourniquet time during surgery",  ok: false },
    ],
    rationale: "pH >7.45 = alkalemia. PaCO₂ 28 (low) = respiratory cause (the patient is blowing off CO₂). HCO₃⁻ 23 (near normal) = minimal renal compensation yet. Primary: respiratory alkalosis from hyperventilation. In anesthesia, this often results from excessive tidal volume or respiratory rate on the ventilator. Intentional hyperventilation may be used briefly for ↑ICP, but sustained hyperventilation causes cerebral vasoconstriction and left-shifts the OHD curve.",
    scene: null, metadata: { topic: "ABG Interpretation", priority: "high" },
  },

  { id: "cp-n9-011", type: "mcq",
    prompt: "A patient has pH 7.30, PaCO₂ 35 mmHg, HCO₃⁻ 16 mEq/L. What is the primary disorder?",
    setup: "",
    ans: [
      { t: "Metabolic acidosis — low HCO₃⁻ is the primary disturbance; the normal-low PaCO₂ reflects respiratory compensation",  ok: true  },
      { t: "Respiratory acidosis — the PaCO₂ of 35 indicates CO₂ retention as the primary cause of the acidemic state observed",   ok: false },
      { t: "Respiratory alkalosis — the PaCO₂ of 35 is below 40 mmHg, indicating hyperventilation as the primary disturbance",      ok: false },
      { t: "Mixed metabolic and respiratory alkalosis — both bicarbonate and CO₂ are below their normal reference range values",      ok: false },
    ],
    rationale: "pH 7.30 = acidemia. HCO₃⁻ 16 (low) = metabolic acid. PaCO₂ 35 (slightly low) = respiratory compensation (hyperventilating to blow off CO₂). Primary: metabolic acidosis. Common causes in anesthesia: lactic acidosis (hypoperfusion, sepsis, tourniquet release), diabetic ketoacidosis, renal failure, massive transfusion (citrate metabolism). Calculate the anion gap to differentiate.",
    scene: null, metadata: { topic: "ABG Interpretation", priority: "high" },
  },

  { id: "cp-n9-012", type: "mcq",
    prompt: "What is the anion gap, and what does an ELEVATED anion gap indicate?",
    setup: "",
    ans: [
      { t: "AG = Na⁺ − (Cl⁻ + HCO₃⁻); normal 8-12; elevated AG indicates unmeasured acids like lactate, ketones, or uremia",  ok: true  },
      { t: "AG = Na⁺ + K⁺ − Cl⁻; normal 20-24; elevated AG indicates excessive bicarbonate loss from GI or renal sources",       ok: false },
      { t: "AG = HCO₃⁻ − PaCO₂; normal 0-5; elevated AG indicates a primary respiratory disorder with metabolic compensation",    ok: false },
      { t: "AG = Cl⁻ − HCO₃⁻; normal 30-36; elevated AG indicates hyperchloremic acidosis from excessive normal saline infusion",  ok: false },
    ],
    rationale: "Anion gap = Na⁺ − (Cl⁻ + HCO₃⁻). Normal: 8-12 mEq/L. Elevated AG means unmeasured anions are present — the MUDPILES mnemonic: Methanol, Uremia, DKA, Propylene glycol, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates. A NORMAL AG metabolic acidosis (hyperchloremic) results from HCO₃⁻ loss (diarrhea, RTA) or excessive NS administration.",
    scene: null, metadata: { topic: "Anion Gap", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════
  // COMPENSATION
  // ═══════════════════════════════════════════════════════════════

  { id: "cp-n9-013", type: "mcq",
    prompt: "In metabolic acidosis, how does the respiratory system compensate, and how quickly does this occur?",
    setup: "",
    ans: [
      { t: "By increasing ventilation (↑rate and depth) to blow off CO₂ — respiratory compensation begins within minutes",  ok: true  },
      { t: "By decreasing ventilation to retain CO₂ and raise PaCO₂ — respiratory compensation takes 24-48 hours to begin", ok: false },
      { t: "By increasing renal bicarbonate reabsorption — this is how the respiratory system helps maintain pH balance",      ok: false },
      { t: "The respiratory system cannot compensate for metabolic disorders — only the kidneys can correct metabolic acidosis", ok: false },
    ],
    rationale: "Metabolic acidosis → chemoreceptors detect ↑[H⁺] and ↓pH → stimulate medullary respiratory center → hyperventilation (Kussmaul breathing) → ↓PaCO₂ → partial pH correction. Respiratory compensation is FAST (minutes to hours). Renal compensation for respiratory disorders is SLOW (hours to days). Compensation never fully corrects pH back to 7.40 — it only minimizes the deviation.",
    scene: null, metadata: { topic: "Compensation", priority: "high" },
  },

  { id: "cp-n9-014", type: "mcq",
    prompt: "In respiratory acidosis, how do the kidneys compensate?",
    setup: "",
    ans: [
      { t: "By increasing bicarbonate reabsorption and H⁺ secretion — renal compensation takes hours to days to reach full effect",  ok: true  },
      { t: "By decreasing bicarbonate reabsorption to lower plasma HCO₃⁻ and bring the 20:1 ratio back toward normal balance",       ok: false },
      { t: "By directly excreting dissolved CO₂ into the urine — the kidneys can eliminate volatile acids as well as fixed acids",     ok: false },
      { t: "Kidneys cannot compensate for respiratory disorders — only the lungs can correct respiratory acidosis by hyperventilation",  ok: false },
    ],
    rationale: "Respiratory acidosis (↑PaCO₂) → kidneys compensate by: (1) ↑HCO₃⁻ reabsorption in proximal tubule, (2) ↑H⁺ secretion in distal tubule, (3) ↑ammonium (NH₄⁺) excretion. This raises plasma [HCO₃⁻] to partially restore the 20:1 ratio. Renal compensation takes 24-72 hours for full effect — which is why acute respiratory acidosis is more dangerous than chronic (no time for renal compensation).",
    scene: null, metadata: { topic: "Compensation", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════
  // ANESTHESIA-SPECIFIC CLINICAL APPLICATIONS
  // ═══════════════════════════════════════════════════════════════

  { id: "cp-n9-015", type: "mcq",
    prompt: "During general anesthesia, intentional hyperventilation (lowering PaCO₂) produces respiratory alkalosis. Why might an anesthesia provider do this temporarily?",
    setup: "",
    ans: [
      { t: "To reduce ICP — hyperventilation causes cerebral vasoconstriction via ↓PaCO₂, decreasing cerebral blood volume",  ok: true  },
      { t: "To increase oxygen delivery — hyperventilation shifts the oxyhemoglobin curve rightward, improving O₂ unloading",   ok: false },
      { t: "To stimulate spontaneous breathing — respiratory alkalosis activates peripheral chemoreceptors and drives ventilation", ok: false },
      { t: "To prevent metabolic acidosis — lowering PaCO₂ directly increases the production of bicarbonate by the lungs",        ok: false },
    ],
    rationale: "Hyperventilation ↓PaCO₂ → cerebral arteriolar vasoconstriction → ↓cerebral blood volume → ↓ICP. This is used as a temporizing measure in acute brain herniation. However: (1) the effect is transient (CSF pH normalizes in hours), (2) excessive hyperventilation (PaCO₂ <25) risks cerebral ischemia, (3) alkalosis LEFT-shifts the OHD curve (↓O₂ unloading — the opposite of what option B claims).",
    scene: null, metadata: { topic: "Clinical Application", priority: "high" },
  },

  { id: "cp-n9-016", type: "mcq",
    prompt: "After tourniquet release during orthopedic surgery, the anesthesia provider observes a transient drop in ETCO₂ followed by a rise, and a drop in pH. What acid-base disturbance is occurring?",
    setup: "",
    ans: [
      { t: "Metabolic acidosis from washout of lactic acid and CO₂ that accumulated in the ischemic limb during tourniquet time",  ok: true  },
      { t: "Respiratory alkalosis from reflex hyperventilation triggered by sudden reperfusion of the previously ischemic extremity", ok: false },
      { t: "Metabolic alkalosis from release of bicarbonate stored in the ischemic tissue during the prolonged tourniquet inflation", ok: false },
      { t: "Respiratory acidosis from tourniquet pain causing the patient to hypoventilate and retain CO₂ during the release phase",  ok: false },
    ],
    rationale: "During tourniquet time, the ischemic limb produces lactate (anaerobic metabolism) and CO₂ that cannot be cleared. On deflation, this acid-laden blood returns to central circulation → transient ↓pH (metabolic acidosis) and ↑PaCO₂. The initial ETCO₂ dip reflects transit time before the acid bolus reaches the lungs. The provider should be prepared for hypotension (vasodilation from acidic metabolites) and may need to temporarily ↑ventilation.",
    scene: null, metadata: { topic: "Clinical Application", priority: "high" },
  },

  { id: "cp-n9-017", type: "mcq",
    prompt: "Normal saline (0.9% NaCl) has a chloride concentration of 154 mEq/L, much higher than plasma (98-106 mEq/L). What acid-base disturbance can large-volume NS resuscitation cause?",
    setup: "",
    ans: [
      { t: "Hyperchloremic non-anion-gap metabolic acidosis — excess chloride displaces bicarbonate to maintain electroneutrality",  ok: true  },
      { t: "Hypochloremic metabolic alkalosis — the sodium load stimulates renal bicarbonate retention in the proximal tubule",       ok: false },
      { t: "Respiratory acidosis — the high osmolality of NS depresses the central respiratory drive causing hypoventilation",         ok: false },
      { t: "Respiratory alkalosis — chloride stimulates peripheral chemoreceptors causing compensatory hyperventilation reflexively",   ok: false },
    ],
    rationale: "NS delivers equal Na⁺ and Cl⁻ (154 mEq/L each). The excess chloride (normal plasma Cl⁻ ~100) displaces HCO₃⁻ to maintain electroneutrality → ↓[HCO₃⁻] → metabolic acidosis. The anion gap stays normal because Cl⁻ (a measured anion) rises as HCO₃⁻ falls. This is why balanced crystalloids (LR, Plasmalyte) are preferred for large-volume resuscitation — their chloride content better matches plasma.",
    scene: null, metadata: { topic: "Clinical Application", priority: "high" },
  },

  { id: "cp-n9-018", type: "mcq",
    prompt: "Sodium bicarbonate (NaHCO₃) is sometimes administered IV to treat severe metabolic acidosis. What is a major concern with its use?",
    setup: "",
    ans: [
      { t: "It generates CO₂ when buffering H⁺ — if ventilation is inadequate, intracellular and CSF pH may paradoxically worsen",  ok: true  },
      { t: "It causes severe hyperkalemia by driving potassium out of cells through a direct sodium-potassium exchange mechanism",     ok: false },
      { t: "It produces methemoglobin by oxidizing hemoglobin iron from Fe²⁺ to Fe³⁺ at the alkaline pH levels it creates",           ok: false },
      { t: "It precipitates as calcium carbonate crystite in the IV tubing whenever the patient is also receiving calcium chloride",     ok: false },
    ],
    rationale: "NaHCO₃ + H⁺ → H₂CO₃ → CO₂ + H₂O. The CO₂ produced must be eliminated by ventilation. If the patient is hypoventilating, CO₂ crosses cell membranes and the BBB faster than HCO₃⁻, paradoxically worsening INTRACELLULAR and CSF acidosis even as plasma pH improves. This is why adequate ventilation must be ensured before/during bicarb administration. NaHCO₃ actually drives K⁺ INTO cells (treats hyperkalemia, not causes it).",
    scene: null, metadata: { topic: "Clinical Application", priority: "high" },
  },

  { id: "cp-n9-019", type: "short",
    prompt: "What is the normal bicarbonate (HCO₃⁻) concentration in arterial blood?",
    setup: "",
    acceptedAnswers: ["24 mEq/L", "24", "22-26 mEq/L", "22-26", "24 meq/L"],
    canonicalAnswer: "24 mEq/L (range 22-26)",
    rationale: "Normal arterial HCO₃⁻ is approximately 24 mEq/L (range 22-26). This is the metabolic component of the Henderson-Hasselbalch equation. Values below 22 suggest metabolic acidosis (HCO₃⁻ consumed or lost); above 26 suggests metabolic alkalosis (HCO₃⁻ retained or gained).",
    scene: null, metadata: { topic: "ABG Interpretation", priority: "high" },
  },

  { id: "cp-n9-020", type: "short",
    prompt: "What is the normal PaCO₂ range in arterial blood?",
    setup: "",
    acceptedAnswers: ["35-45 mmHg", "35-45", "40 mmHg", "40", "35 to 45 mmHg"],
    canonicalAnswer: "35-45 mmHg (normal ~40)",
    rationale: "Normal PaCO₂ is 35-45 mmHg (average 40). This is the respiratory component of acid-base balance. Below 35 = respiratory alkalosis (hyperventilation). Above 45 = respiratory acidosis (hypoventilation). PaCO₂ is directly controlled by alveolar ventilation — doubling minute ventilation roughly halves PaCO₂.",
    scene: null, metadata: { topic: "ABG Interpretation", priority: "high" },
  },

  { id: "cp-n9-021", type: "mcq",
    prompt: "Lactic acidosis is a common cause of metabolic acidosis in the perioperative setting. What produces the lactate?",
    setup: "",
    ans: [
      { t: "Anaerobic glycolysis in hypoperfused tissues — pyruvate is converted to lactate when oxygen delivery is inadequate",  ok: true  },
      { t: "Aerobic metabolism in well-perfused tissues — lactate is the normal end product of the citric acid cycle in all cells", ok: false },
      { t: "Hepatic gluconeogenesis converting amino acids to glucose — lactate is a byproduct of this synthetic pathway",          ok: false },
      { t: "Renal tubular secretion of hydrogen ions — the kidney produces lactate as a vehicle for excreting acid into the urine", ok: false },
    ],
    rationale: "When O₂ delivery is inadequate (shock, hemorrhage, sepsis, aortic cross-clamp), cells switch to anaerobic glycolysis. Without O₂, pyruvate cannot enter the Krebs cycle and is instead reduced to lactate by lactate dehydrogenase. Lactate accumulation → lactic acidosis (elevated AG metabolic acidosis). Serum lactate >2 mmol/L is abnormal; >4 mmol/L indicates severe hypoperfusion. Treatment: restore oxygen delivery, not bicarbonate.",
    scene: null, metadata: { topic: "Clinical Application", priority: "high" },
  },

  { id: "cp-n9-022", type: "mcq",
    prompt: "Massive transfusion of stored blood products can cause metabolic changes. Which acid-base disturbance is most commonly seen INITIALLY?",
    setup: "",
    ans: [
      { t: "Metabolic acidosis — stored blood contains citrate anticoagulant and accumulated lactate from red cell storage lesion",  ok: true  },
      { t: "Metabolic alkalosis — stored blood is buffered to alkaline pH before transfusion to prevent hemolysis during storage",    ok: false },
      { t: "Respiratory acidosis — the cold temperature of stored blood depresses the central respiratory drive upon transfusion",     ok: false },
      { t: "Respiratory alkalosis — citrate in stored blood stimulates peripheral chemoreceptors, triggering reflex hyperventilation",  ok: false },
    ],
    rationale: "Stored blood has low pH from accumulated lactate (storage lesion) and citrate anticoagulant. Initially, massive transfusion causes metabolic acidosis. However, as the liver metabolizes citrate into bicarbonate over hours, a LATE metabolic alkalosis may develop — this is the 'citrate-to-bicarbonate conversion.' Other massive transfusion concerns: hyperkalemia (K⁺ leaks from stored RBCs), hypocalcemia (citrate chelates Ca²⁺), hypothermia, coagulopathy.",
    scene: null, metadata: { topic: "Clinical Application", priority: "high" },
  },

  { id: "cp-n9-023", type: "mcq",
    prompt: "A buffer is most effective at resisting pH change when the solution pH is close to the buffer's pKa. At what pH is a buffer at maximum capacity?",
    setup: "",
    ans: [
      { t: "When pH equals the pKa — at this point the weak acid and conjugate base are in equal concentrations (50:50 ratio)",  ok: true  },
      { t: "When pH is 2 units above the pKa — the conjugate base completely dominates and absorbs all added acid efficiently",   ok: false },
      { t: "When pH is 2 units below the pKa — the weak acid completely dominates and absorbs all added base most efficiently",    ok: false },
      { t: "Buffer capacity is independent of pH — it depends only on the total concentration of the buffer species in solution",   ok: false },
    ],
    rationale: "A buffer is most effective when pH = pKa (Henderson-Hasselbalch: when [A⁻]/[HA] = 1, log(1) = 0, so pH = pKa). At this point, equal amounts of weak acid and conjugate base are available to neutralize either added acid or added base. The effective buffering range is typically pKa ± 1 pH unit. The bicarbonate system's pKa is 6.1 — seemingly far from blood pH 7.4 — but its open-system regulation by lungs and kidneys compensates for this.",
    scene: null, metadata: { topic: "Buffers", priority: "medium" },
  },

  { id: "cp-n9-024", type: "mcq",
    prompt: "Metabolic alkalosis can occur in surgical patients from prolonged nasogastric suctioning. What is the mechanism?",
    setup: "",
    ans: [
      { t: "Loss of gastric HCl (H⁺ and Cl⁻) — removing acid from the body shifts the balance toward alkalosis with hypochloremia",  ok: true  },
      { t: "Loss of pancreatic bicarbonate — removing base from the GI tract shifts the balance toward compensatory alkalosis",          ok: false },
      { t: "Stimulation of renal bicarbonate excretion — the kidneys sense low gastric volume and retain extra acid to compensate",       ok: false },
      { t: "Respiratory compensation for the pain of NG tube insertion — hyperventilation raises pH by blowing off excess CO₂ from lungs", ok: false },
    ],
    rationale: "Gastric parietal cells secrete HCl. NG suctioning removes this acid → loss of H⁺ (alkalosis) + loss of Cl⁻ (hypochloremia). The kidneys try to reabsorb Na⁺ in the proximal tubule but with low Cl⁻ available, they must reabsorb HCO₃⁻ instead → perpetuates the alkalosis. Treatment: replace volume and chloride (NS), which allows the kidneys to excrete the excess HCO₃⁻. This is called 'chloride-responsive' metabolic alkalosis.",
    scene: null, metadata: { topic: "Clinical Application", priority: "high" },
  },

  { id: "cp-n9-025", type: "mcq",
    prompt: "Which statement correctly describes the relationship between pH, PaCO₂, and ventilation during general anesthesia?",
    setup: "",
    ans: [
      { t: "Increasing minute ventilation lowers PaCO₂ and raises pH; decreasing minute ventilation raises PaCO₂ and lowers pH",  ok: true  },
      { t: "Increasing minute ventilation raises both PaCO₂ and pH simultaneously through enhanced gas exchange in the alveoli",    ok: false },
      { t: "PaCO₂ is independent of ventilation during general anesthesia because the anesthesia machine regulates it automatically", ok: false },
      { t: "Decreasing minute ventilation lowers PaCO₂ because slower breathing allows more time for CO₂ diffusion out of the blood", ok: false },
    ],
    rationale: "Ventilation and PaCO₂ have an inverse relationship: ↑MV → ↓PaCO₂ → ↑pH (respiratory alkalosis). ↓MV → ↑PaCO₂ → ↓pH (respiratory acidosis). The anesthesia provider directly controls this via ventilator settings (tidal volume × respiratory rate = minute ventilation). ETCO₂ monitoring provides real-time feedback on ventilation adequacy. This is the fastest way to manipulate pH during a case.",
    scene: null, metadata: { topic: "Clinical Application", priority: "high" },
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
