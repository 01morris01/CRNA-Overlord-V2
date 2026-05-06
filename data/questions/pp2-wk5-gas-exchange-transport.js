/**
 * BIOL-510-A Adv Phys & Pathophys II — Week 5
 * Principles of Gas Exchange / Transport of O2 & CO2
 * Guyton & Hall 14e, Ch. 40–41
 * 25 questions: 18 MCQ, 4 multi-select, 3 short-answer
 */

export const PP2_WK5_QUESTIONS = [

  // ── pp2-w5-001 ── Fick's Law of Diffusion ──────────────────────────────────
  {
    id: "pp2-w5-001",
    type: "mcq",
    prompt: "According to Fick's law, which factor has the GREATEST influence on the rate of gas diffusion across the respiratory membrane?",
    setup: "",
    ans: [
      { t: "Partial pressure gradient of the gas across the membrane", ok: true },
      { t: "Total surface area of the respiratory membrane", ok: false },
      { t: "Molecular weight of the gas", ok: false },
      { t: "Thickness of the respiratory membrane", ok: false },
    ],
    rationale: "Fick's law states: V̇gas = (A × D × ΔP) / T, where A = surface area, D = diffusion coefficient, ΔP = partial pressure gradient, and T = membrane thickness. The partial pressure gradient (ΔP) is the primary driving force for diffusion — without a gradient, no net diffusion occurs regardless of membrane characteristics. Surface area (A) and thickness (T) are important structural determinants, but the pressure gradient is the physiologic variable that changes breath-to-breath and is the direct driving force. For CRNAs, understanding that increasing FiO2 raises the alveolar-to-capillary PO2 gradient is the clinical application of this principle — it is why supplemental O2 works.",
    scene: "pulmonary",
    sceneCfg: { label: "FICK'S LAW" },
    metadata: { topic: "Fick's Law", priority: "high" },
  },

  // ── pp2-w5-002 ── Respiratory Membrane Thickness ───────────────────────────
  {
    id: "pp2-w5-002",
    type: "mcq",
    prompt: "The normal respiratory membrane is approximately 0.2–0.6 µm thick. A patient with pulmonary edema develops interstitial fluid accumulation that doubles membrane thickness. According to Fick's law, what happens to the rate of O2 diffusion (assuming all other factors remain constant)?",
    setup: "",
    ans: [
      { t: "The diffusion rate is halved because rate is inversely proportional to membrane thickness", ok: true },
      { t: "The diffusion rate is quartered because the relationship is inverse-square", ok: false },
      { t: "The diffusion rate is unchanged because the alveolar-capillary PO2 gradient compensates automatically", ok: false },
      { t: "The diffusion rate increases because edema fluid acts as a solvent facilitating gas transfer", ok: false },
    ],
    rationale: "In Fick's law (V̇ = A × D × ΔP / T), diffusion rate is inversely proportional to membrane thickness (T) — a linear, not squared, relationship. Doubling T halves V̇. Pulmonary edema, fibrosis, and ARDS all increase effective membrane thickness, impairing gas exchange. This is why CRNAs may see desaturation despite adequate FiO2 in patients with pulmonary edema — increasing FiO2 raises ΔP to partially compensate, but cannot fully overcome a severely thickened diffusion barrier. PEEP helps by redistributing edema fluid away from the alveolar surface, reducing effective T.",
    scene: "pulmonary",
    sceneCfg: { label: "MEMBRANE THICKNESS" },
    metadata: { topic: "Fick's Law", priority: "high" },
  },

  // ── pp2-w5-003 ── CO2 vs O2 Diffusion ─────────────────────────────────────
  {
    id: "pp2-w5-003",
    type: "mcq",
    prompt: "CO2 diffuses across the respiratory membrane approximately 20 times faster than O2 despite having a higher molecular weight. What property of CO2 accounts for this?",
    setup: "",
    ans: [
      { t: "CO2 has a much higher solubility in the alveolar membrane than O2, and diffusion coefficient depends on solubility/√MW", ok: true },
      { t: "CO2 has a lower molecular weight than O2, increasing its diffusion rate", ok: false },
      { t: "The partial pressure gradient for CO2 is 20 times greater than for O2", ok: false },
      { t: "CO2 actively transported across the membrane by carbonic anhydrase in type I pneumocytes", ok: false },
    ],
    rationale: "The diffusion coefficient (D) is proportional to solubility/√MW. CO2 is approximately 24 times more soluble in water/tissue than O2, which more than compensates for its slightly higher molecular weight (44 vs 32 g/mol). The net result is that CO2 diffuses ~20× faster. This is why CO2 retention is a late finding in diffusion impairment — O2 transfer fails long before CO2 transfer does. For CRNAs, a rising PaCO2 in a patient with diffusion impairment signals severe disease. Carbonic anhydrase facilitates CO2 hydration in RBCs and renal tubules, not membrane transport (D).",
    scene: "pulmonary",
    sceneCfg: { label: "CO2 vs O2 DIFFUSION" },
    metadata: { topic: "Diffusion Coefficient", priority: "high" },
  },

  // ── pp2-w5-004 ── Oxygen-Hemoglobin Dissociation Curve Shape ───────────────
  {
    id: "pp2-w5-004",
    type: "mcq",
    prompt: "The oxygen-hemoglobin dissociation curve is sigmoid-shaped rather than linear. What molecular mechanism produces the sigmoid shape?",
    setup: "",
    ans: [
      { t: "Cooperative binding — binding of O2 to one heme subunit increases the O2 affinity of the remaining subunits", ok: true },
      { t: "Competitive inhibition — CO2 and O2 compete for the same binding site on hemoglobin", ok: false },
      { t: "Saturation kinetics — hemoglobin has a single O2 binding site that saturates at high PO2", ok: false },
      { t: "Allosteric inhibition by 2,3-DPG that is overcome only at high PO2 values", ok: false },
    ],
    rationale: "Hemoglobin exhibits cooperative binding (positive cooperativity). Each Hgb molecule has four heme groups. Binding of the first O2 causes a conformational change from the T (tense/deoxy) state toward the R (relaxed/oxy) state, progressively increasing affinity for subsequent O2 molecules. This produces the sigmoid curve: slow initial binding (low affinity in T state), steep middle portion (rapid loading as cooperativity kicks in), and a flat upper portion (near-saturation). CO2 and O2 bind at different sites — CO2 binds the globin chain, O2 binds the heme iron (B is wrong). Hgb has four binding sites, not one (C). 2,3-DPG stabilizes the T state but does not explain the sigmoid shape itself (D).",
    scene: "pulmonary",
    sceneCfg: { label: "COOPERATIVE BINDING" },
    metadata: { topic: "Oxyhemoglobin Dissociation Curve", priority: "high" },
  },

  // ── pp2-w5-005 ── P50 ─────────────────────────────────────────────────────
  {
    id: "pp2-w5-005",
    type: "mcq",
    prompt: "The P50 of adult hemoglobin is 26.7 mmHg. What does this value represent, and what does an INCREASE in P50 indicate?",
    setup: "",
    ans: [
      { t: "P50 is the PO2 at which hemoglobin is 50% saturated; an increased P50 means decreased O2 affinity (right shift) and easier O2 unloading at the tissues", ok: true },
      { t: "P50 is the PO2 at which hemoglobin is 50% saturated; an increased P50 means increased O2 affinity (left shift) and tighter O2 binding", ok: false },
      { t: "P50 is the PO2 required to fully saturate hemoglobin; an increased P50 means more O2 is needed for full saturation", ok: false },
      { t: "P50 is the partial pressure of O2 dissolved in plasma at 50% saturation; it reflects Henry's law, not hemoglobin affinity", ok: false },
    ],
    rationale: "P50 is defined as the PO2 at which hemoglobin is 50% saturated with O2. Normal adult P50 = 26.7 mmHg. An increased P50 means a higher PO2 is required to achieve 50% saturation — i.e., hemoglobin releases O2 more readily (right shift, decreased affinity). A decreased P50 means hemoglobin holds onto O2 more tightly (left shift, increased affinity). For CRNAs, knowing the P50 helps predict tissue O2 delivery: acidosis, fever, and elevated 2,3-DPG all raise P50, facilitating O2 unloading to metabolically active tissues — a beneficial adaptive response.",
    scene: "pulmonary",
    sceneCfg: { label: "P50 = 26.7 mmHg" },
    metadata: { topic: "Oxyhemoglobin Dissociation Curve", priority: "high" },
  },

  // ── pp2-w5-006 ── Bohr Effect ─────────────────────────────────────────────
  {
    id: "pp2-w5-006",
    type: "mcq",
    prompt: "A patient undergoing a prolonged laparoscopic procedure develops a pH of 7.28 (respiratory acidosis from CO2 insufflation). How does this acidosis affect tissue O2 delivery via the Bohr effect?",
    setup: "",
    ans: [
      { t: "Acidosis right-shifts the oxyhemoglobin curve, lowering Hgb O2 affinity and enhancing O2 unloading at the tissues", ok: true },
      { t: "Acidosis left-shifts the curve, increasing Hgb O2 affinity and impairing O2 unloading", ok: false },
      { t: "Acidosis has no effect on the oxyhemoglobin curve; only temperature changes shift the curve", ok: false },
      { t: "Acidosis reduces dissolved O2 according to Henry's law, decreasing total O2 delivery", ok: false },
    ],
    rationale: "The Bohr effect describes how decreased pH (increased H+ concentration) reduces hemoglobin's affinity for O2, shifting the dissociation curve to the right and increasing P50. H+ ions bind to specific amino acid residues on hemoglobin, stabilizing the T (deoxy) conformation and promoting O2 release. During laparoscopic surgery with CO2 insufflation, absorbed CO2 causes respiratory acidosis. While this enhances peripheral O2 unloading (beneficial), the CRNA must manage ventilation to prevent severe acidosis. Conversely, hyperventilation-induced alkalosis left-shifts the curve, potentially impairing tissue O2 delivery — relevant during controlled ventilation under general anesthesia.",
    scene: "pulmonary",
    sceneCfg: { label: "BOHR EFFECT" },
    metadata: { topic: "Bohr Effect", priority: "high" },
  },

  // ── pp2-w5-007 ── 2,3-DPG ────────────────────────────────────────────────
  {
    id: "pp2-w5-007",
    type: "mcq",
    prompt: "A patient receives a massive transfusion of banked packed red blood cells (stored > 21 days). 2,3-DPG levels in stored blood are severely depleted. What is the expected effect on oxygen delivery?",
    setup: "",
    ans: [
      { t: "Left-shifted oxyhemoglobin curve with impaired O2 unloading at the tissues despite adequate Hgb and SaO2", ok: true },
      { t: "Right-shifted curve with enhanced O2 unloading, improving tissue oxygenation", ok: false },
      { t: "No effect on the curve because 2,3-DPG is regenerated instantly upon transfusion", ok: false },
      { t: "Decreased O2 carrying capacity due to hemoglobin denaturation in stored blood", ok: false },
    ],
    rationale: "2,3-DPG (2,3-diphosphoglycerate, also called 2,3-BPG) binds to the central cavity of deoxyhemoglobin, stabilizing the T state and reducing O2 affinity (right shift). In stored blood, 2,3-DPG is progressively consumed — levels approach zero after ~2-3 weeks of storage. Transfusion of this depleted blood produces a left-shifted curve (low P50), meaning hemoglobin binds O2 tightly and resists releasing it to tissues. It takes 12-24 hours for RBCs to regenerate normal 2,3-DPG levels in vivo (C is wrong). For CRNAs managing massive transfusion, this is critical: the patient may have adequate Hgb and SaO2 yet still have impaired tissue O2 delivery until 2,3-DPG is restored.",
    scene: "pulmonary",
    sceneCfg: { label: "2,3-DPG DEPLETION" },
    metadata: { topic: "2,3-DPG", priority: "high" },
  },

  // ── pp2-w5-008 ── Carbon Monoxide ─────────────────────────────────────────
  {
    id: "pp2-w5-008",
    type: "mcq",
    prompt: "A patient presents to the ED after a house fire with cherry-red skin, SpO2 reading 98%, and altered mental status. PaO2 on ABG is 95 mmHg. CO-oximetry reveals COHgb of 35%. Why does the pulse oximeter give a falsely reassuring reading?",
    setup: "",
    ans: [
      { t: "Conventional pulse oximeters use only two wavelengths (660 nm and 940 nm) and cannot distinguish COHgb from OxyHgb because COHgb absorbs similarly to OxyHgb at 660 nm", ok: true },
      { t: "CO increases O2 binding to hemoglobin, so the SpO2 accurately reflects true O2 saturation", ok: false },
      { t: "The high PaO2 proves that tissue oxygenation is adequate and the SpO2 is correct", ok: false },
      { t: "Pulse oximeters measure dissolved O2 via Henry's law, which is unaffected by CO", ok: false },
    ],
    rationale: "Standard pulse oximeters emit light at two wavelengths: 660 nm (red) and 940 nm (infrared). They calculate the ratio of absorbances to estimate SpO2. Carboxyhemoglobin (COHgb) absorbs light at 660 nm almost identically to oxyhemoglobin, so the oximeter 'reads' COHgb as OxyHgb, producing a falsely normal SpO2. CO binds hemoglobin with ~240× the affinity of O2 AND left-shifts the remaining functional Hgb (increased affinity = impaired unloading). PaO2 reflects dissolved O2 only and says nothing about Hgb-bound O2 availability. CO-oximetry (which uses 4+ wavelengths) is required for accurate assessment. For CRNAs, this is critical in fire victims and smokers — always request CO-oximetry when CO exposure is suspected.",
    scene: "pulmonary",
    sceneCfg: { label: "CO POISONING & PULSE OX" },
    metadata: { topic: "Carbon Monoxide", priority: "high" },
  },

  // ── pp2-w5-009 ── Fetal Hemoglobin ────────────────────────────────────────
  {
    id: "pp2-w5-009",
    type: "mcq",
    prompt: "Fetal hemoglobin (HgbF) has a P50 of approximately 19 mmHg compared to adult HgbA P50 of 26.7 mmHg. What structural feature of HgbF accounts for this difference, and what is its physiologic significance?",
    setup: "",
    ans: [
      { t: "HgbF has gamma (γ) chains instead of beta (β) chains, which bind 2,3-DPG poorly; reduced 2,3-DPG binding increases O2 affinity (left shift), facilitating O2 transfer from maternal to fetal blood", ok: true },
      { t: "HgbF has a different heme group that binds O2 irreversibly, ensuring the fetus always receives adequate oxygen", ok: false },
      { t: "HgbF has alpha (α) chains replaced by epsilon (ε) chains, which have a higher intrinsic O2 affinity", ok: false },
      { t: "HgbF has the same structure as HgbA but operates at a lower pH in fetal blood, causing a left shift", ok: false },
    ],
    rationale: "Fetal hemoglobin (α2γ2) has gamma chains in place of the beta chains found in adult hemoglobin (α2β2). The gamma chains have a lower affinity for 2,3-DPG — specifically, a serine residue replaces histidine at position 143, reducing the positive charge in the central cavity where 2,3-DPG binds. With less 2,3-DPG stabilizing the T state, HgbF remains preferentially in the R (oxy) state, giving it higher O2 affinity (lower P50, left-shifted curve). This allows fetal blood to extract O2 from maternal blood in the placenta. For pediatric anesthesia, HgbF persists for several months after birth — neonates tolerate lower PaO2 values partly because their Hgb loads O2 more efficiently, but tissue unloading may be less effective.",
    scene: "pulmonary",
    sceneCfg: { label: "FETAL HEMOGLOBIN" },
    metadata: { topic: "Fetal Hemoglobin", priority: "medium" },
  },

  // ── pp2-w5-010 ── Temperature Shift ───────────────────────────────────────
  {
    id: "pp2-w5-010",
    type: "mcq",
    prompt: "During therapeutic hypothermia (target temperature 33°C) after cardiac arrest, how is the oxyhemoglobin dissociation curve affected, and what is the clinical implication?",
    setup: "",
    ans: [
      { t: "The curve left-shifts (decreased P50), increasing Hgb O2 affinity; tissue O2 unloading is reduced, but this is offset by decreased metabolic demand at lower temperature", ok: true },
      { t: "The curve right-shifts (increased P50), enhancing O2 delivery to cold-injured tissues", ok: false },
      { t: "Hypothermia has no significant effect on the oxyhemoglobin curve; only pH and 2,3-DPG matter clinically", ok: false },
      { t: "The curve left-shifts AND metabolic demand increases, creating a dangerous O2 supply-demand mismatch", ok: false },
    ],
    rationale: "Hypothermia left-shifts the oxyhemoglobin dissociation curve (decreased P50), increasing Hgb O2 affinity and reducing O2 release at tissues. However, hypothermia also decreases metabolic rate by approximately 6-8% per 1°C reduction, reducing tissue O2 demand. The net effect is usually adequate tissue oxygenation despite impaired unloading. Conversely, fever right-shifts the curve and increases O2 demand simultaneously. For CRNAs managing therapeutic hypothermia, ABG values should be interpreted carefully — pH-stat vs alpha-stat management strategies differ in how temperature correction affects blood gas interpretation and cerebral blood flow management.",
    scene: "pulmonary",
    sceneCfg: { label: "HYPOTHERMIA & O2 AFFINITY" },
    metadata: { topic: "Temperature Effects", priority: "medium" },
  },

  // ── pp2-w5-011 ── Henry's Law / Dissolved O2 ─────────────────────────────
  {
    id: "pp2-w5-011",
    type: "mcq",
    prompt: "According to Henry's law, the amount of O2 dissolved in plasma at a PaO2 of 100 mmHg is approximately:",
    setup: "",
    ans: [
      { t: "0.3 mL O2/dL — calculated as 0.003 mL O2/dL/mmHg × 100 mmHg", ok: true },
      { t: "3.0 mL O2/dL — the solubility coefficient of O2 is 0.03 mL/dL/mmHg", ok: false },
      { t: "20 mL O2/dL — this represents the total O2 content including Hgb-bound O2", ok: false },
      { t: "1.34 mL O2/dL — this is Hüfner's constant, not dissolved O2", ok: false },
    ],
    rationale: "Henry's law states that the amount of gas dissolved in a liquid is proportional to its partial pressure: dissolved O2 = 0.003 mL O2/dL/mmHg × PaO2. At PaO2 = 100 mmHg: 0.003 × 100 = 0.3 mL O2/dL. This is only ~1.5% of total O2 content (~20 mL/dL). The vast majority of O2 is Hgb-bound (~19.7 mL/dL). However, dissolved O2 is clinically critical: it is the only form that exerts partial pressure and drives diffusion into tissues. Under hyperbaric conditions (e.g., HBO therapy at 3 atm with 100% O2), dissolved O2 can reach ~6 mL/dL, potentially supporting tissue oxygenation even without functional hemoglobin. For CRNAs, this is relevant in severe anemia and CO poisoning management.",
    scene: "pulmonary",
    sceneCfg: { label: "HENRY'S LAW — DISSOLVED O2" },
    metadata: { topic: "Henry's Law", priority: "high" },
  },

  // ── pp2-w5-012 ── O2 Content Equation ─────────────────────────────────────
  {
    id: "pp2-w5-012",
    type: "mcq",
    prompt: "Calculate the CaO2 for a patient with Hgb 10 g/dL, SaO2 98%, and PaO2 90 mmHg using the oxygen content equation: CaO2 = (1.34 × Hgb × SaO2) + (0.003 × PaO2).",
    setup: "",
    ans: [
      { t: "13.4 mL O2/dL — (1.34 × 10 × 0.98) + (0.003 × 90) = 13.13 + 0.27 ≈ 13.4", ok: true },
      { t: "20.1 mL O2/dL — this would require a Hgb of 15 g/dL", ok: false },
      { t: "9.0 mL O2/dL — this incorrectly omits the Hgb-bound component", ok: false },
      { t: "0.27 mL O2/dL — this is only the dissolved O2 component", ok: false },
    ],
    rationale: "CaO2 = (1.34 × Hgb × SaO2) + (0.003 × PaO2). The constant 1.34 mL O2/g Hgb is Hüfner's constant — the theoretical maximum O2 each gram of Hgb can carry (some texts use 1.36 or 1.39). Hgb-bound O2: 1.34 × 10 × 0.98 = 13.13 mL/dL. Dissolved O2: 0.003 × 90 = 0.27 mL/dL. Total CaO2 ≈ 13.4 mL/dL. Normal CaO2 is ~20 mL/dL (with Hgb 15 g/dL). This patient's anemia (Hgb 10) reduces CaO2 by ~33% despite normal saturation. For CRNAs, this equation shows why transfusion thresholds matter — SaO2 can be 100% yet O2 content severely reduced if Hgb is low. Increasing FiO2 only increases the dissolved component (minimal gain).",
    scene: "pulmonary",
    sceneCfg: { label: "O2 CONTENT EQUATION" },
    metadata: { topic: "O2 Content Equation", priority: "high" },
  },

  // ── pp2-w5-013 ── DO2 Oxygen Delivery ─────────────────────────────────────
  {
    id: "pp2-w5-013",
    type: "mcq",
    prompt: "A patient has a CaO2 of 13.4 mL O2/dL and a cardiac output of 5 L/min. What is the oxygen delivery (DO2), and how does it compare to normal?",
    setup: "",
    ans: [
      { t: "DO2 = 670 mL O2/min (CO × CaO2 × 10); this is below the normal ~1000 mL O2/min, indicating impaired O2 delivery", ok: true },
      { t: "DO2 = 67 mL O2/min; this uses the formula without the factor-of-10 conversion", ok: false },
      { t: "DO2 = 1340 mL O2/min; this incorrectly doubles the cardiac output", ok: false },
      { t: "DO2 = 1000 mL O2/min; this is normal because cardiac output compensates for anemia", ok: false },
    ],
    rationale: "DO2 = CO × CaO2 × 10 (the factor of 10 converts dL to L). DO2 = 5 × 13.4 × 10 = 670 mL O2/min. Normal DO2 is approximately 1000 mL O2/min (5 L/min × 20 mL/dL × 10). Normal O2 consumption (VO2) is ~250 mL/min, giving an extraction ratio of ~25%. When DO2 falls below a critical threshold (~300-330 mL O2/min), VO2 becomes supply-dependent, and anaerobic metabolism begins (lactic acidosis). This patient's DO2 of 670 is adequate but has reduced reserve. For CRNAs, DO2 optimization involves three levers: increasing CO (fluids, inotropes), increasing Hgb (transfusion), and maximizing SaO2 (FiO2, ventilation).",
    scene: "pulmonary",
    sceneCfg: { label: "O2 DELIVERY (DO2)" },
    metadata: { topic: "O2 Delivery", priority: "high" },
  },

  // ── pp2-w5-014 ── CO2 Transport Mechanisms ────────────────────────────────
  {
    id: "pp2-w5-014",
    type: "mcq",
    prompt: "CO2 is transported in the blood via three mechanisms. Which form accounts for the LARGEST fraction of total CO2 transport?",
    setup: "",
    ans: [
      { t: "Bicarbonate (HCO3⁻) — approximately 70% of CO2 is converted to HCO3⁻ by carbonic anhydrase in red blood cells", ok: true },
      { t: "Carbaminohemoglobin — CO2 bound to the terminal amino groups of hemoglobin, approximately 20-23%", ok: false },
      { t: "Dissolved CO2 in plasma — approximately 7-10%, governed by Henry's law with solubility coefficient 0.067 mL/dL/mmHg", ok: false },
      { t: "Carbonic acid (H2CO3) — the intermediate form that exists briefly before dissociating", ok: false },
    ],
    rationale: "CO2 transport: ~70% as bicarbonate (HCO3⁻), ~20-23% as carbaminohemoglobin, ~7-10% dissolved in plasma. In RBCs, carbonic anhydrase catalyzes: CO2 + H2O → H2CO3 → H+ + HCO3⁻. The HCO3⁻ is exchanged for Cl⁻ across the RBC membrane (chloride shift) and transported in plasma. This system is the body's primary CO2 transport mechanism AND a major blood buffer system. Carbonic acid (H2CO3) is a transient intermediate, not a transport form (D). For CRNAs, understanding CO2 transport is essential for interpreting ABGs and managing ventilation — minute ventilation adjustments directly regulate the amount of CO2 eliminated, affecting both PaCO2 and pH.",
    scene: "pulmonary",
    sceneCfg: { label: "CO2 TRANSPORT" },
    metadata: { topic: "CO2 Transport", priority: "high" },
  },

  // ── pp2-w5-015 ── Haldane Effect ──────────────────────────────────────────
  {
    id: "pp2-w5-015",
    type: "mcq",
    prompt: "The Haldane effect describes how O2 binding to hemoglobin affects CO2 transport. Which statement BEST describes the Haldane effect and its physiologic significance?",
    setup: "",
    ans: [
      { t: "Oxygenation of hemoglobin in the lungs reduces its affinity for CO2 and H+, promoting CO2 release; deoxygenation in tissues increases CO2 and H+ binding, facilitating CO2 loading", ok: true },
      { t: "Increased CO2 in tissues decreases hemoglobin's O2 affinity, promoting O2 unloading (this describes the Bohr effect, not the Haldane effect)", ok: false },
      { t: "Hemoglobin buffers CO2 by converting it to bicarbonate within the plasma", ok: false },
      { t: "O2 and CO2 compete for the same binding site on the heme iron, and O2 displaces CO2 in the lungs", ok: false },
    ],
    rationale: "The Haldane effect and Bohr effect are reciprocal phenomena. The Bohr effect: CO2/H+ reduces Hgb O2 affinity (facilitates O2 unloading at tissues). The Haldane effect: O2 binding reduces Hgb CO2/H+ affinity (facilitates CO2 unloading in lungs). In the lungs, as Hgb binds O2, it releases CO2 and H+. In tissues, as Hgb releases O2, it picks up CO2 and H+. The Haldane effect is quantitatively more important for CO2 transport than the Bohr effect is for O2 transport. CO2 binds the globin chain amino groups (not the heme iron, so D is incorrect). Carbonic anhydrase is in RBCs, not plasma (C). The Haldane effect accounts for approximately 50% of the total CO2 exchange in the lungs.",
    scene: "pulmonary",
    sceneCfg: { label: "HALDANE EFFECT" },
    metadata: { topic: "Haldane Effect", priority: "high" },
  },

  // ── pp2-w5-016 ── Chloride Shift ──────────────────────────────────────────
  {
    id: "pp2-w5-016",
    type: "mcq",
    prompt: "As blood passes through the tissue capillaries and CO2 enters the red blood cell, the chloride shift (Hamburger phenomenon) occurs. What is the mechanism and purpose of this shift?",
    setup: "",
    ans: [
      { t: "HCO3⁻ produced inside the RBC exits via the band 3 (AE1) anion exchanger in exchange for Cl⁻ entering the cell, maintaining electroneutrality and allowing continued CO2 hydration", ok: true },
      { t: "Cl⁻ exits the RBC in exchange for HCO3⁻ entering, acidifying the plasma to facilitate O2 release", ok: false },
      { t: "Na+ enters the RBC along with HCO3⁻ to maintain osmotic balance during CO2 loading", ok: false },
      { t: "K+ leaves the RBC as CO2 enters, preventing intracellular acidosis", ok: false },
    ],
    rationale: "In tissue capillaries: CO2 diffuses into RBCs → carbonic anhydrase catalyzes CO2 + H2O → H2CO3 → H+ + HCO3⁻. The accumulating HCO3⁻ must exit the RBC to maintain the reaction driving forward. The band 3 protein (anion exchanger 1, AE1) exchanges intracellular HCO3⁻ for extracellular Cl⁻ on a 1:1 basis, maintaining electroneutrality. This is the chloride shift (Hamburger phenomenon). In the lungs, the process reverses: Cl⁻ exits and HCO3⁻ re-enters the RBC, where carbonic anhydrase reconverts it to CO2 for exhalation. The slight water influx following Cl⁻ makes venous RBCs marginally larger than arterial RBCs. For CRNAs, understanding the chloride shift explains why venous blood has slightly higher Cl⁻ in plasma and lower in RBCs relative to arterial blood.",
    scene: "pulmonary",
    sceneCfg: { label: "CHLORIDE SHIFT" },
    metadata: { topic: "Chloride Shift", priority: "medium" },
  },

  // ── pp2-w5-017 ── A-a Gradient ────────────────────────────────────────────
  {
    id: "pp2-w5-017",
    type: "mcq",
    prompt: "A 65-year-old patient on room air has ABG: PaO2 72 mmHg, PaCO2 40 mmHg. Using the alveolar gas equation PAO2 = FiO2(Patm − PH2O) − PaCO2/RQ, calculate the A-a gradient. (Assume Patm = 760 mmHg, PH2O = 47 mmHg, RQ = 0.8)",
    setup: "",
    ans: [
      { t: "A-a gradient = 28 mmHg; PAO2 = 0.21(713) − 40/0.8 = 149.7 − 50 = 99.7 mmHg; gradient = 99.7 − 72 = 27.7 ≈ 28 mmHg (elevated, suggesting V/Q mismatch or diffusion impairment)", ok: true },
      { t: "A-a gradient = 8 mmHg; this assumes PAO2 equals 80 mmHg, which is incorrect", ok: false },
      { t: "A-a gradient = 50 mmHg; this uses PaCO2 directly without dividing by RQ", ok: false },
      { t: "A-a gradient = 0 mmHg; PAO2 should equal PaO2 in a healthy patient", ok: false },
    ],
    rationale: "Alveolar gas equation: PAO2 = FiO2 × (Patm − PH2O) − PaCO2/RQ = 0.21 × (760 − 47) − 40/0.8 = 0.21 × 713 − 50 = 149.7 − 50 = 99.7 mmHg. A-a gradient = PAO2 − PaO2 = 99.7 − 72 = 27.7 mmHg. Normal A-a gradient ≈ 2.5 + (0.21 × age) = 2.5 + 13.65 ≈ 16 mmHg for a 65-year-old. This patient's gradient of 28 is elevated, indicating either V/Q mismatch, diffusion impairment, or shunt. For CRNAs, the A-a gradient is essential for distinguishing hypoxemia causes: hypoventilation alone causes hypoxemia with a NORMAL A-a gradient, while V/Q mismatch, shunt, and diffusion impairment all cause ELEVATED gradients.",
    scene: "pulmonary",
    sceneCfg: { label: "A-a GRADIENT" },
    metadata: { topic: "A-a Gradient", priority: "high" },
  },

  // ── pp2-w5-018 ── Alveolar Gas Equation ───────────────────────────────────
  {
    id: "pp2-w5-018",
    type: "mcq",
    prompt: "A patient is placed on 60% FiO2 via face mask at sea level. Using the simplified alveolar gas equation, what is the approximate PAO2 if PaCO2 is 35 mmHg? (RQ = 0.8)",
    setup: "",
    ans: [
      { t: "PAO2 ≈ 384 mmHg — 0.60 × (760 − 47) − 35/0.8 = 427.8 − 43.75 ≈ 384 mmHg", ok: true },
      { t: "PAO2 ≈ 456 mmHg — this omits the PaCO2/RQ correction", ok: false },
      { t: "PAO2 ≈ 149 mmHg — this uses 0.21 FiO2 instead of 0.60", ok: false },
      { t: "PAO2 ≈ 300 mmHg — this uses an RQ of 1.0 instead of 0.8", ok: false },
    ],
    rationale: "PAO2 = FiO2 × (Patm − PH2O) − PaCO2/RQ = 0.60 × (760 − 47) − 35/0.8 = 0.60 × 713 − 43.75 = 427.8 − 43.75 = 384.05 mmHg. If the PaO2 on this FiO2 is, say, 150 mmHg, the A-a gradient would be 384 − 150 = 234 mmHg, indicating severe shunt or V/Q mismatch. For CRNAs, the ratio PaO2/FiO2 (P/F ratio) is a simpler bedside tool: normal P/F > 400; ARDS mild 200-300, moderate 100-200, severe < 100. The alveolar gas equation is the foundation for calculating A-a gradient and understanding the expected PAO2 at any FiO2, which guides ventilator management and diagnosis of gas exchange pathology.",
    scene: "pulmonary",
    sceneCfg: { label: "ALVEOLAR GAS EQUATION" },
    metadata: { topic: "Alveolar Gas Equation", priority: "high" },
  },

  // ── pp2-w5-019 ── Multi-Select: Right Shift Factors ──────────────────────
  {
    id: "pp2-w5-019",
    type: "multi",
    prompt: "Select ALL factors that cause a RIGHT shift of the oxyhemoglobin dissociation curve (increased P50, decreased O2 affinity).",
    setup: "",
    ans: [
      { t: "Decreased pH (acidosis) — Bohr effect", ok: true },
      { t: "Increased temperature (fever, exercise)", ok: true },
      { t: "Increased 2,3-DPG concentration", ok: true },
      { t: "Increased PaCO2 (hypercapnia)", ok: true },
      { t: "Carbon monoxide (CO) binding to hemoglobin", ok: false },
      { t: "Fetal hemoglobin (HgbF)", ok: false },
      { t: "Hypothermia", ok: false },
      { t: "Alkalosis (increased pH)", ok: false },
    ],
    rationale: "Right-shift factors (mnemonic: CADET — CO2, Acid, 2,3-DPG, Exercise/temperature, note T is also Temperature) all decrease Hgb O2 affinity, promoting tissue O2 unloading. Carbon monoxide LEFT-shifts the curve for remaining functional heme groups (despite also reducing total O2-carrying capacity) — this double insult makes CO particularly dangerous. Fetal hemoglobin, hypothermia, and alkalosis all LEFT-shift the curve (increase affinity). For CRNAs, recognizing these shifts is essential: a septic patient (acidotic, febrile, elevated 2,3-DPG) has a right-shifted curve facilitating tissue O2 delivery — but this benefit can be reversed by aggressive cooling, bicarbonate administration, or massive transfusion of 2,3-DPG-depleted blood.",
    scene: "pulmonary",
    sceneCfg: { label: "RIGHT SHIFT FACTORS" },
    metadata: { topic: "Oxyhemoglobin Dissociation Curve", priority: "high" },
  },

  // ── pp2-w5-020 ── Multi-Select: CO2 Transport ────────────────────────────
  {
    id: "pp2-w5-020",
    type: "multi",
    prompt: "Select ALL TRUE statements about CO2 transport in the blood.",
    setup: "",
    ans: [
      { t: "Approximately 70% of CO2 is transported as bicarbonate (HCO3⁻) in plasma", ok: true },
      { t: "Carbonic anhydrase in RBCs catalyzes the conversion of CO2 + H2O → H2CO3, which rapidly dissociates to H+ + HCO3⁻", ok: true },
      { t: "CO2 binds to the amino-terminal groups of hemoglobin (not the heme iron) to form carbaminohemoglobin", ok: true },
      { t: "The Haldane effect states that deoxygenated hemoglobin carries more CO2 than oxygenated hemoglobin", ok: true },
      { t: "CO2 is primarily transported as dissolved gas because its solubility is 20× greater than O2", ok: false },
      { t: "Carbonic anhydrase is located in plasma, where most bicarbonate formation occurs", ok: false },
    ],
    rationale: "All four true statements describe key aspects of CO2 transport. Although CO2 is ~20× more soluble than O2, dissolved CO2 still only accounts for ~7-10% of total transport (E is false — the high solubility does not make it the primary form). Carbonic anhydrase is located inside RBCs (and renal tubular cells), not in plasma (F is false) — this is why the bicarbonate must be shuttled out of the RBC via the chloride shift. The Haldane effect is reciprocal to the Bohr effect and is quantitatively responsible for about 50% of total CO2 exchange in the lungs. For CRNAs, the interplay between O2 and CO2 transport systems means that changes in oxygenation status directly affect CO2 elimination and vice versa.",
    scene: "pulmonary",
    sceneCfg: { label: "CO2 TRANSPORT FACTS" },
    metadata: { topic: "CO2 Transport", priority: "high" },
  },

  // ── pp2-w5-021 ── Multi-Select: Diffusion Impairment ─────────────────────
  {
    id: "pp2-w5-021",
    type: "multi",
    prompt: "Select ALL conditions that impair gas diffusion across the respiratory membrane by altering one or more Fick's law variables.",
    setup: "",
    ans: [
      { t: "Pulmonary fibrosis — increases membrane thickness (↑T)", ok: true },
      { t: "Emphysema — destroys alveolar septa, decreasing surface area (↓A)", ok: true },
      { t: "Pulmonary edema — increases effective membrane thickness with interstitial fluid (↑T)", ok: true },
      { t: "Pneumonectomy — reduces total surface area by removing one lung (↓A)", ok: true },
      { t: "Anemia — reduces O2-carrying capacity but does not alter the respiratory membrane", ok: false },
      { t: "Hypoventilation — reduces alveolar PO2 but does not impair the membrane itself", ok: false },
    ],
    rationale: "Fick's law: V̇ = (A × D × ΔP) / T. Pulmonary fibrosis and edema increase T (thickness). Emphysema and pneumonectomy decrease A (surface area). All four impair diffusion. Anemia reduces O2 content but does not alter membrane properties — the problem is downstream of diffusion. Hypoventilation reduces ΔP (alveolar PO2 drops), which technically reduces the driving force for diffusion, but this is not a diffusion impairment per se — the membrane is intact, and the A-a gradient remains normal. For CRNAs, DLCO (diffusion capacity for CO) testing quantifies membrane diffusion capacity; low DLCO predicts perioperative desaturation risk and guides anesthetic planning.",
    scene: "pulmonary",
    sceneCfg: { label: "DIFFUSION IMPAIRMENT" },
    metadata: { topic: "Fick's Law", priority: "medium" },
  },

  // ── pp2-w5-022 ── Multi-Select: Oxygen Cascade ───────────────────────────
  {
    id: "pp2-w5-022",
    type: "multi",
    prompt: "The oxygen cascade describes the progressive drop in PO2 from atmosphere to mitochondria. Select ALL values that correctly match the normal PO2 at each level (sea level, room air).",
    setup: "",
    ans: [
      { t: "Atmospheric (dry inspired) PO2 ≈ 159 mmHg — 0.21 × 760 mmHg", ok: true },
      { t: "Humidified tracheal PO2 ≈ 149 mmHg — 0.21 × (760 − 47)", ok: true },
      { t: "Alveolar PO2 (PAO2) ≈ 100 mmHg — reduced by CO2 addition and V/Q effects", ok: true },
      { t: "Arterial PO2 (PaO2) ≈ 95-100 mmHg — slightly below PAO2 due to physiologic shunt", ok: true },
      { t: "Mitochondrial PO2 ≈ 40 mmHg — this is the PO2 of mixed venous blood, not mitochondria", ok: false },
      { t: "Alveolar PO2 ≈ 159 mmHg — no drop occurs between atmosphere and alveolus", ok: false },
    ],
    rationale: "The oxygen cascade: Atmosphere (159) → Trachea after humidification (149) → Alveolus (~100) → Arterial blood (~95-100) → Tissue capillary (~40) → Mitochondria (~1-5 mmHg). Mitochondrial PO2 is very low (~1-5 mmHg), NOT 40 mmHg — that is mixed venous PO2 (PvO2), which reflects the average capillary-level PO2 after O2 extraction. The alveolar PO2 drops from 149 to ~100 because CO2 from metabolism occupies alveolar gas space (alveolar gas equation). For CRNAs, every level of the cascade can be disrupted under anesthesia: reduced FiO2 (atmospheric level), airway obstruction (tracheal level), V/Q mismatch and atelectasis (alveolar level), shunt (arterial level), and low cardiac output (tissue level).",
    scene: "pulmonary",
    sceneCfg: { label: "OXYGEN CASCADE" },
    metadata: { topic: "Oxygen Cascade", priority: "high" },
  },

  // ── pp2-w5-023 ── Short Answer: DLCO ──────────────────────────────────────
  {
    id: "pp2-w5-023",
    type: "short",
    prompt: "Why is carbon monoxide (CO) used rather than O2 to measure lung diffusion capacity (DLCO)? Explain the physiologic principle in 2-3 sentences.",
    setup: "",
    ans: [
      { t: "CO has an extremely high affinity for hemoglobin (240× that of O2), so the partial pressure of CO in pulmonary capillary blood remains essentially zero throughout transit. This means the back-pressure is negligible, and the rate of CO uptake is determined entirely by the diffusion properties of the alveolar-capillary membrane (area and thickness), not by blood flow or capillary PO2. This isolates the membrane diffusion component, making DLCO a pure measure of diffusion capacity.", ok: true },
    ],
    rationale: "DLCO testing uses a small amount of inhaled CO (0.3%). Because Hgb binds CO with ~240× the affinity of O2, capillary PCO remains near zero — the measurement is diffusion-limited, not perfusion-limited. O2 transfer, by contrast, is normally perfusion-limited (equilibrates by 1/3 of capillary transit time), so measuring O2 uptake would conflate diffusion and perfusion. In disease states that reduce membrane area (emphysema) or increase thickness (fibrosis), DLCO decreases. For CRNAs, a low preoperative DLCO (< 60% predicted) warns of impaired gas exchange under anesthesia and may predict postoperative pulmonary complications. Exercise and anemia also affect DLCO and must be accounted for in interpretation.",
    scene: "pulmonary",
    sceneCfg: { label: "DLCO" },
    metadata: { topic: "Diffusion Capacity", priority: "medium" },
  },

  // ── pp2-w5-024 ── Short Answer: Anesthesia Effects on Gas Exchange ────────
  {
    id: "pp2-w5-024",
    type: "short",
    prompt: "Describe three mechanisms by which general anesthesia impairs gas exchange, and explain how each affects the A-a gradient.",
    setup: "",
    ans: [
      { t: "1) Atelectasis: General anesthesia causes compression atelectasis (diaphragm cephalad displacement) and absorption atelectasis (high FiO2 washout of N2), creating intrapulmonary shunt that widens the A-a gradient. 2) Reduced FRC: Anesthesia decreases functional residual capacity by 15-20%, causing small airway closure and V/Q mismatch in dependent lung regions, widening the A-a gradient. 3) Inhibition of hypoxic pulmonary vasoconstriction (HPV): Volatile anesthetics dose-dependently inhibit HPV, allowing continued perfusion of poorly ventilated lung units, increasing V/Q mismatch and widening the A-a gradient.", ok: true },
    ],
    rationale: "General anesthesia impairs gas exchange through multiple mechanisms, all of which widen the A-a gradient: (1) Atelectasis develops within minutes of induction in nearly 100% of patients — the combination of supine positioning, muscle relaxation, and high FiO2 creates both compression and absorption atelectasis. Recruitment maneuvers and PEEP are countermeasures. (2) FRC reduction occurs because loss of diaphragmatic tone allows abdominal contents to push the diaphragm cephalad. When FRC falls below closing capacity (especially in elderly, obese, or COPD patients), small airways close during tidal breathing, creating low V/Q units. (3) Volatile anesthetics (sevoflurane, desflurane, isoflurane) inhibit HPV in a dose-dependent manner — at 1-2 MAC, HPV is reduced by 20-30%. IV agents (propofol, ketamine) have less effect on HPV, which is one reason total IV anesthesia may be preferred during one-lung ventilation.",
    scene: "pulmonary",
    sceneCfg: { label: "ANESTHESIA & GAS EXCHANGE" },
    metadata: { topic: "Anesthesia Effects", priority: "high" },
  },

  // ── pp2-w5-025 ── Short Answer: Bohr vs Haldane ──────────────────────────
  {
    id: "pp2-w5-025",
    type: "short",
    prompt: "Compare and contrast the Bohr effect and the Haldane effect. Include where each operates physiologically and which gas transport each primarily facilitates.",
    setup: "",
    ans: [
      { t: "The Bohr effect describes how increased CO2/H+ (decreased pH) reduces hemoglobin's O2 affinity, right-shifting the oxyhemoglobin dissociation curve. It operates primarily at the tissues, where CO2 production and local acidosis promote O2 unloading from hemoglobin to metabolically active cells. The Haldane effect is the reciprocal: oxygenation of hemoglobin reduces its ability to carry CO2 and H+. It operates primarily in the lungs, where O2 binding causes hemoglobin to release CO2 for exhalation. The Bohr effect primarily facilitates O2 delivery; the Haldane effect primarily facilitates CO2 elimination.", ok: true },
    ],
    rationale: "These two effects are two sides of the same coin — both arise from the allosteric properties of hemoglobin. The Bohr effect: at tissues, CO2 diffuses into RBCs, forms H+ (via carbonic anhydrase), and H+ binds hemoglobin, stabilizing the T state and releasing O2. The Haldane effect: in the lungs, O2 binds hemoglobin, shifting it to the R state, which releases H+ and CO2. The H+ combines with HCO3⁻ (reverse chloride shift brings HCO3⁻ back into the RBC) to regenerate CO2, which diffuses into the alveolus. Quantitatively, the Haldane effect is responsible for a greater proportion of gas exchange than the Bohr effect — approximately 50% of CO2 exchange depends on the Haldane effect. For CRNAs, these coupled effects ensure that O2 delivery and CO2 removal are automatically coordinated: where O2 is consumed and CO2 produced (tissues), both effects synergize to load CO2 and unload O2.",
    scene: "pulmonary",
    sceneCfg: { label: "BOHR vs HALDANE" },
    metadata: { topic: "Bohr & Haldane Effects", priority: "high" },
  },

];

export const PP2_WK5_METADATA = {
  nodeId: "pp2-wk-5",
  courseId: "adv-phys-path-2",
  chapter: "Ch. 40–41",
  title: "Principles of Gas Exchange / Transport of O2 & CO2",
  totalQuestions: PP2_WK5_QUESTIONS.length,
  questionTypes: { mcq: 18, multi: 4, short: 3 },
};
