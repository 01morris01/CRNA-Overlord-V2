/**
 * Pulmonary Physiology — Chapter 5 (Node 5)
 * Basics of Anesthesia course
 * 60 questions: MCQ + multi-select
 */

export const PULMONARY_QUESTIONS = [

  // ── boa-node5-pulm-001 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-001",
    type: "mcq",
    prompt: "Which pressure gradient drives blood flow through the pulmonary circulation?",
    setup: "",
    ans: [
      { t: "Mean pulmonary arterial pressure minus pulmonary venous pressure", ok: true },
      { t: "Mean arterial pressure minus central venous pressure", ok: false },
      { t: "Alveolar pressure minus atmospheric pressure", ok: false },
      { t: "Pulmonary capillary wedge pressure minus left atrial pressure", ok: false },
    ],
    rationale: "Pulmonary blood flow is driven by the gradient between mean pulmonary arterial pressure (~15 mmHg) and pulmonary venous pressure (~5 mmHg), yielding a low-resistance driving pressure of ~10 mmHg.",
    metadata: { topic: "Pulmonary Circulation", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["PVR", "pulmonary circulation", "hemodynamics"] }
  },

  // ── boa-node5-pulm-002 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-002",
    type: "mcq",
    prompt: "Pulmonary vascular resistance (PVR) is calculated as:",
    setup: "",
    ans: [
      { t: "(Mean PAP − PCWP) / cardiac output × 80", ok: true },
      { t: "(MAP − CVP) / cardiac output × 80", ok: false },
      { t: "Mean PAP / cardiac output", ok: false },
      { t: "(PCWP − CVP) / cardiac output × 80", ok: false },
    ],
    rationale: "PVR = (mean pulmonary arterial pressure − pulmonary capillary wedge pressure) / cardiac output × 80 dynes·s·cm⁻⁵. Normal PVR is 50–150 dynes·s·cm⁻⁵, roughly 1/10 of SVR.",
    metadata: { topic: "Pulmonary Vascular Resistance", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["PVR", "pulmonary circulation"] }
  },

  // ── boa-node5-pulm-003 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-003",
    type: "mcq",
    prompt: "What is the PRIMARY stimulus for hypoxic pulmonary vasoconstriction (HPV)?",
    setup: "",
    ans: [
      { t: "Low alveolar PO₂ (PAO₂)", ok: true },
      { t: "Elevated arterial PCO₂", ok: false },
      { t: "Decreased mixed venous PO₂ alone", ok: false },
      { t: "Pulmonary arterial hypoxemia without alveolar hypoxia", ok: false },
    ],
    rationale: "HPV is triggered primarily by low alveolar PO₂ (PAO₂ < ~70 mmHg). Mixed venous PO₂ also contributes but is secondary. HPV diverts blood away from poorly ventilated regions, optimizing V/Q matching.",
    metadata: { topic: "Hypoxic Pulmonary Vasoconstriction", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["HPV", "hypoxic pulmonary vasoconstriction", "V/Q"] }
  },

  // ── boa-node5-pulm-004 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-004",
    type: "mcq",
    prompt: "Which inhaled anesthetic agent has the GREATEST inhibitory effect on hypoxic pulmonary vasoconstriction?",
    setup: "",
    ans: [
      { t: "All potent volatile agents inhibit HPV to a similar degree at clinical concentrations", ok: true },
      { t: "Halothane inhibits HPV far more than isoflurane or sevoflurane", ok: false },
      { t: "Desflurane uniquely abolishes HPV at 0.5 MAC", ok: false },
      { t: "Nitrous oxide selectively potentiates HPV", ok: false },
    ],
    rationale: "At clinical doses (1 MAC), all potent volatile anesthetics inhibit HPV to a similar, modest degree (~50% inhibition). This is clinically relevant during one-lung ventilation. Nitrous oxide mildly increases PVR but does not potentiate HPV.",
    metadata: { topic: "Hypoxic Pulmonary Vasoconstriction", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["HPV", "volatile anesthetics", "one-lung ventilation"] }
  },

  // ── boa-node5-pulm-005 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-005",
    type: "mcq",
    prompt: "In West Zone 1 of the lung, blood flow is:",
    setup: "",
    ans: [
      { t: "Absent because alveolar pressure exceeds both arterial and venous pressures", ok: true },
      { t: "Greatest because gravity increases arterial pressure", ok: false },
      { t: "Intermittent, occurring only during systole", ok: false },
      { t: "Determined entirely by venous pressure exceeding alveolar pressure", ok: false },
    ],
    rationale: "Zone 1 (apex): PA > Pa > Pv. Alveolar pressure exceeds capillary pressure, collapsing vessels and stopping flow. Zone 1 rarely exists in normal lungs (occurs when arterial pressure drops or alveolar pressure is raised, e.g., positive pressure ventilation).",
    metadata: { topic: "West Lung Zones", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["West zones", "pulmonary circulation", "blood flow"] }
  },

  // ── boa-node5-pulm-006 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-006",
    type: "mcq",
    prompt: "In West Zone 2, blood flow is determined by:",
    setup: "",
    ans: [
      { t: "Arterial minus alveolar pressure (Pa − PA)", ok: true },
      { t: "Arterial minus venous pressure (Pa − Pv)", ok: false },
      { t: "Venous minus alveolar pressure (Pv − PA)", ok: false },
      { t: "Alveolar pressure alone", ok: false },
    ],
    rationale: "Zone 2 (middle): Pa > PA > Pv. Flow is determined by the arterial–alveolar pressure difference, acting as a Starling resistor. Flow increases toward the base as gravitational arterial pressure increases.",
    metadata: { topic: "West Lung Zones", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["West zones", "Starling resistor", "blood flow"] }
  },

  // ── boa-node5-pulm-007 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-007",
    type: "mcq",
    prompt: "West Zone 3 of the lung is characterized by:",
    setup: "",
    ans: [
      { t: "Pa > Pv > PA — flow determined by arteriovenous pressure gradient", ok: true },
      { t: "PA > Pa > Pv — no blood flow", ok: false },
      { t: "Pa > PA > Pv — flow driven by arterial-alveolar gradient", ok: false },
      { t: "Pv > PA > Pa — retrograde flow", ok: false },
    ],
    rationale: "Zone 3 (base): Pa > Pv > PA. Both pressures exceed alveolar pressure, so flow is determined by the standard arteriovenous gradient (Pa − Pv). This zone has the greatest blood flow.",
    metadata: { topic: "West Lung Zones", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["West zones", "blood flow"] }
  },

  // ── boa-node5-pulm-008 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-008",
    type: "mcq",
    prompt: "The oxyhemoglobin dissociation curve shifts to the RIGHT in response to:",
    setup: "",
    ans: [
      { t: "Increased temperature, increased PCO₂, decreased pH, increased 2,3-DPG", ok: true },
      { t: "Decreased temperature, decreased PCO₂, increased pH, fetal hemoglobin", ok: false },
      { t: "Carbon monoxide binding to hemoglobin", ok: false },
      { t: "Methemoglobin formation", ok: false },
    ],
    rationale: "A rightward shift (increased P50) means hemoglobin releases O₂ more readily. Causes: ↑temp, ↑PCO₂, ↓pH (acidosis), ↑2,3-DPG. Mnemonic: CADET faces right — CO₂, Acid, 2,3-DPG, Exercise, Temperature.",
    metadata: { topic: "Oxyhemoglobin Dissociation Curve", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["oxyhemoglobin", "P50", "Bohr effect", "2,3-DPG"] }
  },

  // ── boa-node5-pulm-009 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-009",
    type: "mcq",
    prompt: "The P50 of normal adult hemoglobin at standard conditions is approximately:",
    setup: "",
    ans: [
      { t: "27 mmHg", ok: true },
      { t: "40 mmHg", ok: false },
      { t: "60 mmHg", ok: false },
      { t: "100 mmHg", ok: false },
    ],
    rationale: "P50 is the PO₂ at which hemoglobin is 50% saturated. Normal adult value is ~27 mmHg at pH 7.40, PCO₂ 40 mmHg, 37°C. Fetal Hb P50 is ~19 mmHg (left shift).",
    metadata: { topic: "Oxyhemoglobin Dissociation Curve", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["P50", "oxyhemoglobin", "hemoglobin saturation"] }
  },

  // ── boa-node5-pulm-010 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-010",
    type: "mcq",
    prompt: "Pulse oximetry may give a FALSELY HIGH SpO₂ reading in the presence of:",
    setup: "",
    ans: [
      { t: "Carboxyhemoglobin (COHb)", ok: true },
      { t: "Methemoglobin at high concentrations", ok: false },
      { t: "Severe anemia (hemoglobin 5 g/dL)", ok: false },
      { t: "Nail polish", ok: false },
    ],
    rationale: "Standard pulse oximeters use two wavelengths (660 nm, 940 nm) and cannot distinguish COHb from OxyHb — both absorb similarly at 660 nm. COHb reads as ~90% SpO₂ regardless of true saturation. Methemoglobin drives SpO₂ toward 85% (not falsely high). Anemia affects signal strength but not saturation reading per se.",
    metadata: { topic: "Pulse Oximetry", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["pulse oximetry", "SpO2", "carboxyhemoglobin", "COHb"] }
  },

  // ── boa-node5-pulm-011 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-011",
    type: "mcq",
    prompt: "The alveolar gas equation is used to calculate:",
    setup: "",
    ans: [
      { t: "Ideal alveolar PO₂ (PAO₂)", ok: true },
      { t: "Arterial PO₂ (PaO₂)", ok: false },
      { t: "Mixed venous PO₂ (PvO₂)", ok: false },
      { t: "Alveolar dead space", ok: false },
    ],
    rationale: "The alveolar gas equation: PAO₂ = FiO₂(Patm − PH₂O) − PaCO₂/R. It calculates the ideal alveolar oxygen tension, which is then compared to measured PaO₂ to derive the A-a gradient.",
    metadata: { topic: "Alveolar Gas Equation", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["alveolar gas equation", "PAO2", "A-a gradient"] }
  },

  // ── boa-node5-pulm-012 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-012",
    type: "mcq",
    prompt: "At sea level breathing room air (FiO₂ = 0.21), the approximate calculated PAO₂ is:",
    setup: "Assume: Patm = 760 mmHg, PH₂O = 47 mmHg, PaCO₂ = 40 mmHg, R = 0.8",
    ans: [
      { t: "~100 mmHg", ok: true },
      { t: "~60 mmHg", ok: false },
      { t: "~150 mmHg", ok: false },
      { t: "~40 mmHg", ok: false },
    ],
    rationale: "PAO₂ = 0.21 × (760 − 47) − 40/0.8 = 0.21 × 713 − 50 = 149.7 − 50 ≈ 100 mmHg. This matches normal resting PaO₂ of ~95 mmHg, giving an A-a gradient of ~5 mmHg.",
    metadata: { topic: "Alveolar Gas Equation", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["alveolar gas equation", "PAO2", "sea level"] }
  },

  // ── boa-node5-pulm-013 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-013",
    type: "mcq",
    prompt: "At high altitude, PaO₂ decreases primarily because of:",
    setup: "",
    ans: [
      { t: "Decreased barometric pressure reducing the partial pressure of inspired oxygen", ok: true },
      { t: "Increased FiO₂ consumption by pulmonary tissues", ok: false },
      { t: "Increased alveolar CO₂ from altitude-induced hypoventilation", ok: false },
      { t: "Increased V/Q mismatch from pulmonary vasoconstriction", ok: false },
    ],
    rationale: "At altitude, barometric pressure falls while FiO₂ remains 21%. The reduced inspired PO₂ (PiO₂ = FiO₂ × Patm) lowers PAO₂ and thus PaO₂. Hyperventilation actually decreases PaCO₂, partially compensating via the alveolar gas equation.",
    metadata: { topic: "Altitude Physiology", priority: "medium", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["altitude", "barometric pressure", "PaO2"] }
  },

  // ── boa-node5-pulm-014 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-014",
    type: "mcq",
    prompt: "How long does a healthy adult maintain SaO₂ > 90% after apnea when pre-oxygenated with 100% O₂?",
    setup: "",
    ans: [
      { t: "8–10 minutes", ok: true },
      { t: "1–2 minutes", ok: false },
      { t: "30–60 seconds", ok: false },
      { t: "20–25 minutes", ok: false },
    ],
    rationale: "Adequate pre-oxygenation (EtO₂ > 90%) increases FRC oxygen stores, extending safe apnea to ~8–10 minutes in healthy adults. Obese patients desaturate much faster (~3–4 min) due to reduced FRC.",
    metadata: { topic: "Apnea and Desaturation", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["apnea", "pre-oxygenation", "desaturation", "RSI"] }
  },

  // ── boa-node5-pulm-015 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-015",
    type: "mcq",
    prompt: "Which patient population desaturates FASTEST during apnea?",
    setup: "",
    ans: [
      { t: "Morbidly obese patients", ok: true },
      { t: "Healthy athletic adults", ok: false },
      { t: "Young children compared to infants", ok: false },
      { t: "Patients with COPD on supplemental O₂", ok: false },
    ],
    rationale: "Morbidly obese patients have markedly reduced FRC (often < closing capacity in supine position) and increased oxygen consumption, leading to rapid desaturation (~3–4 min even after pre-oxygenation). Infants also desaturate quickly due to small FRC/weight ratio.",
    metadata: { topic: "Apnea and Desaturation", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["apnea", "obesity", "desaturation", "FRC"] }
  },

  // ── boa-node5-pulm-016 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-016",
    type: "mcq",
    prompt: "The normal A-a (alveolar-arterial) oxygen gradient breathing room air is approximately:",
    setup: "",
    ans: [
      { t: "5–15 mmHg", ok: true },
      { t: "25–35 mmHg", ok: false },
      { t: "< 2 mmHg", ok: false },
      { t: "40–50 mmHg", ok: false },
    ],
    rationale: "The normal A-a gradient on room air is 5–15 mmHg, accounting for the physiologic shunt from bronchial and thebesian veins (~2–5% of cardiac output). The gradient increases with age (~2.5 mmHg per decade) and markedly increases with V/Q mismatch, shunt, or diffusion impairment.",
    metadata: { topic: "A-a Gradient", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["A-a gradient", "shunt", "V/Q mismatch"] }
  },

  // ── boa-node5-pulm-017 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-017",
    type: "mcq",
    prompt: "A patient has PaO₂ 60 mmHg on FiO₂ 1.0 (100% O₂). The MOST likely cause is:",
    setup: "",
    ans: [
      { t: "True intrapulmonary shunt (Qs/Qt)", ok: true },
      { t: "Simple V/Q mismatch", ok: false },
      { t: "Hypoventilation alone", ok: false },
      { t: "Diffusion impairment", ok: false },
    ],
    rationale: "A persistently low PaO₂ on 100% FiO₂ indicates true shunt — blood bypassing ventilated alveoli entirely (anatomic or intrapulmonary). V/Q mismatch, diffusion impairment, and hypoventilation all respond to supplemental O₂. Shunt does not because the shunted blood never contacts alveolar O₂.",
    metadata: { topic: "Shunt", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["shunt", "P/F ratio", "100% oxygen", "V/Q"] }
  },

  // ── boa-node5-pulm-018 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-018",
    type: "mcq",
    prompt: "The P/F ratio (PaO₂/FiO₂) threshold for ARDS is:",
    setup: "",
    ans: [
      { t: "≤ 300 mmHg (mild), ≤ 200 mmHg (moderate), ≤ 100 mmHg (severe)", ok: true },
      { t: "≤ 400 mmHg for any severity", ok: false },
      { t: "≤ 200 mmHg (mild), ≤ 100 mmHg (moderate/severe)", ok: false },
      { t: "< 60 mmHg regardless of FiO₂", ok: false },
    ],
    rationale: "Berlin ARDS criteria: mild P/F ≤ 300, moderate P/F ≤ 200, severe P/F ≤ 100 — all with PEEP ≥ 5 cmH₂O. Normal P/F ratio is ~500 mmHg (PaO₂ 100/FiO₂ 0.21 ≈ 476).",
    metadata: { topic: "P/F Ratio", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["P/F ratio", "ARDS", "Berlin criteria"] }
  },

  // ── boa-node5-pulm-019 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-019",
    type: "mcq",
    prompt: "What percentage of CO₂ is transported in the blood as bicarbonate (HCO₃⁻)?",
    setup: "",
    ans: [
      { t: "~70%", ok: true },
      { t: "~10%", ok: false },
      { t: "~30%", ok: false },
      { t: "~90%", ok: false },
    ],
    rationale: "CO₂ transport: ~70% as HCO₃⁻ (formed in RBCs via carbonic anhydrase), ~20–23% as carbaminohemoglobin (bound to Hb), ~7–10% dissolved in plasma. The chloride shift maintains electrical neutrality when HCO₃⁻ leaves RBCs.",
    metadata: { topic: "CO2 Transport", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["CO2 transport", "bicarbonate", "carbonic anhydrase", "chloride shift"] }
  },

  // ── boa-node5-pulm-020 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-020",
    type: "mcq",
    prompt: "The Haldane effect describes:",
    setup: "",
    ans: [
      { t: "Deoxygenated hemoglobin carries more CO₂ than oxygenated hemoglobin", ok: true },
      { t: "CO₂ shifts the oxyhemoglobin dissociation curve to the right", ok: false },
      { t: "Increased CO₂ production at altitude", ok: false },
      { t: "Inhibition of carbonic anhydrase by CO", ok: false },
    ],
    rationale: "The Haldane effect: deoxy-Hb binds CO₂ (as carbaminohemoglobin) more avidly than oxy-Hb. In tissues, as Hb unloads O₂ it picks up more CO₂. In lungs, O₂ loading displaces CO₂. The Bohr effect is the opposite relationship (CO₂/pH shifts the O₂ curve).",
    metadata: { topic: "CO2 Transport", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["Haldane effect", "CO2 transport", "carbaminohemoglobin"] }
  },

  // ── boa-node5-pulm-021 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-021",
    type: "mcq",
    prompt: "Hypercapnia (↑PaCO₂) causes which cardiovascular effect?",
    setup: "",
    ans: [
      { t: "Increased sympathetic tone leading to hypertension and tachycardia", ok: true },
      { t: "Direct myocardial depression with bradycardia", ok: false },
      { t: "Pulmonary vasodilation", ok: false },
      { t: "Peripheral vasoconstriction without change in HR", ok: false },
    ],
    rationale: "Hypercapnia stimulates the SNS, causing catecholamine release → tachycardia, hypertension, and increased cardiac output. Simultaneously, CO₂ is a direct cerebral and coronary vasodilator. Pulmonary vasoconstriction (not dilation) also occurs with hypercapnia.",
    metadata: { topic: "Hypercapnia Effects", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["hypercapnia", "CO2", "cardiovascular effects", "sympathetic"] }
  },

  // ── boa-node5-pulm-022 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-022",
    type: "mcq",
    prompt: "Anatomical dead space in a 70 kg adult is approximately:",
    setup: "",
    ans: [
      { t: "150 mL (roughly 2.2 mL/kg)", ok: true },
      { t: "500 mL (equal to tidal volume)", ok: false },
      { t: "50 mL", ok: false },
      { t: "300 mL", ok: false },
    ],
    rationale: "Anatomical dead space comprises the conducting airways (trachea to terminal bronchioles) — approximately 1 mL/pound (2.2 mL/kg) or ~150 mL in a 70 kg adult. Physiologic dead space = anatomical + alveolar dead space, assessed by the Bohr equation.",
    metadata: { topic: "Dead Space", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["dead space", "anatomical dead space", "tidal volume"] }
  },

  // ── boa-node5-pulm-023 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-023",
    type: "mcq",
    prompt: "The Bohr equation estimates:",
    setup: "",
    ans: [
      { t: "Physiologic dead space (VD/VT ratio)", ok: true },
      { t: "Shunt fraction (Qs/Qt)", ok: false },
      { t: "Oxygen consumption via Fick principle", ok: false },
      { t: "Alveolar PO₂", ok: false },
    ],
    rationale: "Bohr equation: VD/VT = (PaCO₂ − PeCO₂) / PaCO₂. It calculates the fraction of tidal volume that is dead space (does not participate in gas exchange). Normal VD/VT ≈ 0.33.",
    metadata: { topic: "Dead Space", priority: "medium", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["Bohr equation", "dead space", "VD/VT"] }
  },

  // ── boa-node5-pulm-024 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-024",
    type: "mcq",
    prompt: "Central chemoreceptors located in the medulla primarily respond to:",
    setup: "",
    ans: [
      { t: "Changes in CSF pH (driven by CO₂ diffusion across the blood-brain barrier)", ok: true },
      { t: "Arterial PO₂ levels below 60 mmHg", ok: false },
      { t: "Peripheral carotid body input exclusively", ok: false },
      { t: "Direct CO₂ detection without pH change", ok: false },
    ],
    rationale: "Central chemoreceptors sense CSF pH. CO₂ rapidly crosses the blood-brain barrier and combines with water to form H⁺ and HCO₃⁻, lowering CSF pH. They do NOT respond to hypoxemia. They account for ~80% of the ventilatory response to CO₂.",
    metadata: { topic: "Chemoreceptors", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["chemoreceptors", "central", "medulla", "CO2", "CSF pH"] }
  },

  // ── boa-node5-pulm-025 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-025",
    type: "mcq",
    prompt: "Peripheral chemoreceptors (carotid and aortic bodies) primarily respond to:",
    setup: "",
    ans: [
      { t: "Arterial hypoxemia (PaO₂ < 60 mmHg), hypercapnia, and acidosis", ok: true },
      { t: "CSF pH changes only", ok: false },
      { t: "PaO₂ < 100 mmHg", ok: false },
      { t: "Changes in hemoglobin oxygen saturation", ok: false },
    ],
    rationale: "Carotid bodies (CN IX) and aortic bodies (CN X) sense PaO₂, PaCO₂, and pH. The hypoxic ventilatory response is steep below PaO₂ 60 mmHg. Carotid bodies are the dominant peripheral sensors. Note: they sense PO₂, not SaO₂ — anemia doesn't stimulate them.",
    metadata: { topic: "Chemoreceptors", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["chemoreceptors", "peripheral", "carotid body", "hypoxia"] }
  },

  // ── boa-node5-pulm-026 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-026",
    type: "mcq",
    prompt: "Opioids impair ventilatory control primarily by:",
    setup: "",
    ans: [
      { t: "Blunting central chemoreceptor response to CO₂", ok: true },
      { t: "Directly paralyzing the diaphragm", ok: false },
      { t: "Stimulating peripheral carotid bodies", ok: false },
      { t: "Increasing FRC and thus O₂ reserve", ok: false },
    ],
    rationale: "Opioids depress the central chemoreceptors in the medulla (mu-receptor mediated), right-shifting and flattening the CO₂-ventilation response curve. This leads to apnea at supratherapeutic levels. They also suppress hypoxic drive at the carotid bodies.",
    metadata: { topic: "Ventilation Control", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["opioids", "respiratory depression", "chemoreceptors", "CO2 response"] }
  },

  // ── boa-node5-pulm-027 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-027",
    type: "mcq",
    prompt: "Volatile anesthetic agents affect ventilation control by:",
    setup: "",
    ans: [
      { t: "Dose-dependent depression of CO₂ and hypoxic ventilatory responses", ok: true },
      { t: "Selective blunting of the hypercapnic drive only", ok: false },
      { t: "Stimulation of central chemoreceptors below 0.5 MAC", ok: false },
      { t: "Preserving hypoxic ventilatory response at all clinical concentrations", ok: false },
    ],
    rationale: "Volatile agents cause dose-dependent respiratory depression, blunting both central CO₂ response and peripheral hypoxic drive (carotid bodies). Even subanesthetic concentrations (~0.1 MAC) markedly blunt the hypoxic ventilatory response. This is clinically important in the post-anesthesia care unit.",
    metadata: { topic: "Ventilation Control", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["volatile anesthetics", "respiratory depression", "hypoxic drive", "ventilatory response"] }
  },

  // ── boa-node5-pulm-028 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-028",
    type: "mcq",
    prompt: "The Fick equation for oxygen consumption (VO₂) is:",
    setup: "",
    ans: [
      { t: "VO₂ = CO × (CaO₂ − CvO₂)", ok: true },
      { t: "VO₂ = CO × (CvO₂ − CaO₂)", ok: false },
      { t: "VO₂ = Hb × SaO₂ × 1.34", ok: false },
      { t: "VO₂ = PAO₂ / PaO₂ × 100%", ok: false },
    ],
    rationale: "Fick principle: VO₂ = cardiac output × arteriovenous O₂ content difference (CaO₂ − CvO₂). Normal VO₂ ≈ 250 mL/min. CaO₂ = (Hb × SaO₂ × 1.34) + (0.003 × PaO₂). This equation also underlies the Fick method of measuring cardiac output.",
    metadata: { topic: "Fick Equation", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["Fick equation", "oxygen consumption", "VO2", "cardiac output"] }
  },

  // ── boa-node5-pulm-029 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-029",
    type: "mcq",
    prompt: "Normal mixed venous O₂ saturation (SvO₂) at rest is approximately:",
    setup: "",
    ans: [
      { t: "70–75%", ok: true },
      { t: "95–98%", ok: false },
      { t: "50–55%", ok: false },
      { t: "85–90%", ok: false },
    ],
    rationale: "Normal SvO₂ is 70–75%, reflecting normal O₂ extraction (~25%). Low SvO₂ (<65%) indicates increased extraction (↑demand or ↓supply). Elevated SvO₂ (>80%) can indicate septic distributive shock, left-to-right shunt, or wedged PA catheter.",
    metadata: { topic: "Fick Equation", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["SvO2", "mixed venous", "oxygen extraction", "Fick"] }
  },

  // ── boa-node5-pulm-030 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-030",
    type: "mcq",
    prompt: "Which condition causes a LEFT shift of the oxyhemoglobin dissociation curve, INCREASING hemoglobin's affinity for oxygen?",
    setup: "",
    ans: [
      { t: "Fetal hemoglobin (HbF)", ok: true },
      { t: "High altitude acclimatization", ok: false },
      { t: "Stored packed red blood cells (↑2,3-DPG depletion)", ok: false },
      { t: "Sickle cell disease", ok: false },
    ],
    rationale: "Left shifts (↑O₂ affinity, ↓P50) occur with: HbF, hypothermia, alkalosis, ↓CO₂, ↓2,3-DPG (stored blood). HbF's left shift facilitates O₂ transfer from mother to fetus across the placenta. Stored blood has ↓2,3-DPG causing a left shift, which can impair O₂ delivery.",
    metadata: { topic: "Oxyhemoglobin Dissociation Curve", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["oxyhemoglobin", "left shift", "fetal hemoglobin", "2,3-DPG"] }
  },

  // ── boa-node5-pulm-031 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-031",
    type: "mcq",
    prompt: "The respiratory quotient (R) used in the alveolar gas equation reflects:",
    setup: "",
    ans: [
      { t: "The ratio of CO₂ produced to O₂ consumed (VCO₂/VO₂)", ok: true },
      { t: "The ratio of dead space to tidal volume", ok: false },
      { t: "The fraction of alveolar O₂ that diffuses into the blood", ok: false },
      { t: "The ratio of PaCO₂ to PaO₂", ok: false },
    ],
    rationale: "R (respiratory quotient) = VCO₂/VO₂. Normal value is 0.8 on a mixed diet. Pure carbohydrate metabolism gives R = 1.0; pure fat metabolism gives R = 0.7. R is used in the alveolar gas equation to correct for the CO₂ replaced by O₂ in alveoli.",
    metadata: { topic: "Alveolar Gas Equation", priority: "medium", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["respiratory quotient", "R value", "alveolar gas equation", "VCO2/VO2"] }
  },

  // ── boa-node5-pulm-032 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-032",
    type: "mcq",
    prompt: "Carbon monoxide poisoning causes cellular hypoxia PRIMARILY because:",
    setup: "",
    ans: [
      { t: "COHb cannot carry O₂ AND CO shifts the oxyhemoglobin curve left, impairing O₂ release", ok: true },
      { t: "CO directly inhibits carbonic anhydrase", ok: false },
      { t: "CO causes severe pulmonary edema", ok: false },
      { t: "CO stimulates HPV, reducing pulmonary blood flow", ok: false },
    ],
    rationale: "CO has ~240× higher affinity for Hb than O₂, forming COHb that cannot carry O₂. Additionally, CO causes a left shift (increased O₂ affinity) of remaining oxy-Hb, impairing O₂ unloading at tissues. CO also inhibits cytochrome c oxidase (complex IV), causing cellular asphyxia.",
    metadata: { topic: "Oxyhemoglobin Dissociation Curve", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["carbon monoxide", "COHb", "left shift", "cellular hypoxia"] }
  },

  // ── boa-node5-pulm-033 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-033",
    type: "mcq",
    prompt: "Which statement about V/Q mismatch is CORRECT?",
    setup: "",
    ans: [
      { t: "Low V/Q regions cause hypoxemia that responds to supplemental O₂; high V/Q regions cause hypercapnia", ok: true },
      { t: "Low V/Q regions cause hypercapnia; high V/Q regions cause hypoxemia", ok: false },
      { t: "Both low and high V/Q mismatch produce hypoxemia resistant to O₂ supplementation", ok: false },
      { t: "V/Q mismatch cannot be detected by an elevated A-a gradient", ok: false },
    ],
    rationale: "Low V/Q (perfusion > ventilation): poorly ventilated alveoli produce low-O₂, high-CO₂ blood → hypoxemia with widened A-a gradient (responds to O₂). High V/Q (ventilation > perfusion): dead space effect → CO₂ retention. Both cause widened A-a gradient.",
    metadata: { topic: "V/Q Mismatch", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["V/Q mismatch", "hypoxemia", "A-a gradient", "supplemental oxygen"] }
  },

  // ── boa-node5-pulm-034 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-034",
    type: "mcq",
    prompt: "Pulmonary surfactant reduces surface tension in alveoli by:",
    setup: "",
    ans: [
      { t: "Reducing the work of breathing and preventing alveolar collapse (atelectasis)", ok: true },
      { t: "Increasing alveolar radius to obey Laplace's Law", ok: false },
      { t: "Inhibiting carbonic anhydrase in alveolar type II cells", ok: false },
      { t: "Binding to alveolar macrophages to stimulate O₂ production", ok: false },
    ],
    rationale: "Surfactant (dipalmitoylphosphatidylcholine, DPPC) reduces surface tension, lowering the pressure needed to maintain alveolar patency (Laplace's Law: P = 2T/r). By reducing T more in smaller alveoli, surfactant stabilizes alveoli of different sizes and prevents collapse.",
    metadata: { topic: "Pulmonary Mechanics", priority: "medium", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["surfactant", "atelectasis", "Laplace law", "surface tension"] }
  },

  // ── boa-node5-pulm-035 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-035",
    type: "mcq",
    prompt: "Which lung volume CANNOT be measured by spirometry alone?",
    setup: "",
    ans: [
      { t: "Functional residual capacity (FRC)", ok: true },
      { t: "Tidal volume (VT)", ok: false },
      { t: "Forced vital capacity (FVC)", ok: false },
      { t: "Inspiratory reserve volume (IRV)", ok: false },
    ],
    rationale: "FRC is the volume in the lungs at end-expiration. It cannot be measured by spirometry because spirometry measures only volume changes during breathing, not absolute lung volumes. FRC is measured by helium dilution, nitrogen washout, or body plethysmography.",
    metadata: { topic: "Lung Volumes", priority: "medium", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["FRC", "lung volumes", "spirometry", "body plethysmography"] }
  },

  // ── boa-node5-pulm-036 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-036",
    type: "mcq",
    prompt: "Functional residual capacity (FRC) in a 70 kg adult is approximately:",
    setup: "",
    ans: [
      { t: "2,400 mL", ok: true },
      { t: "500 mL", ok: false },
      { t: "4,800 mL", ok: false },
      { t: "1,200 mL", ok: false },
    ],
    rationale: "Normal FRC ≈ 2,400 mL (ERV 1,200 + RV 1,200 mL). FRC represents the equilibrium between lung elastic recoil inward and chest wall recoil outward. FRC decreases with obesity, supine position, general anesthesia, and pregnancy.",
    metadata: { topic: "Lung Volumes", priority: "medium", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["FRC", "lung volumes", "anesthesia effects"] }
  },

  // ── boa-node5-pulm-037 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-037",
    type: "mcq",
    prompt: "General anesthesia typically reduces FRC by approximately:",
    setup: "",
    ans: [
      { t: "15–20% (~400–500 mL)", ok: true },
      { t: "50% (~1,200 mL)", ok: false },
      { t: "5% (~120 mL)", ok: false },
      { t: "30–40% (~700–1,000 mL)", ok: false },
    ],
    rationale: "Induction of general anesthesia reduces FRC by ~15–20% (400–500 mL) due to: loss of tonic respiratory muscle activity, cephalad diaphragm displacement, and airway closure. This reduction promotes atelectasis formation, especially in obese patients.",
    metadata: { topic: "Lung Volumes", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["FRC", "general anesthesia", "atelectasis", "FRC reduction"] }
  },

  // ── boa-node5-pulm-038 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-038",
    type: "mcq",
    prompt: "Methemoglobin causes a falsely SpO₂ reading that trends toward:",
    setup: "",
    ans: [
      { t: "85% regardless of true saturation", ok: true },
      { t: "100% (falsely high)", ok: false },
      { t: "0% (falsely low)", ok: false },
      { t: "The true SaO₂ minus 10%", ok: false },
    ],
    rationale: "Methemoglobin absorbs equally at both 660 nm and 940 nm wavelengths, causing standard two-wavelength pulse oximeters to register ~85% SpO₂ regardless of the true saturation. High MetHb with true SpO₂ > 85% reads falsely low; true SpO₂ < 85% reads falsely high.",
    metadata: { topic: "Pulse Oximetry", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["methemoglobin", "pulse oximetry", "SpO2", "MetHb"] }
  },

  // ── boa-node5-pulm-039 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-039",
    type: "mcq",
    prompt: "During one-lung ventilation (OLV), arterial hypoxemia is MOST commonly caused by:",
    setup: "",
    ans: [
      { t: "Shunt through the non-ventilated (operative) lung receiving continued perfusion", ok: true },
      { t: "Absolute dead space from the ventilated lung", ok: false },
      { t: "Bronchoconstriction in the dependent (ventilated) lung", ok: false },
      { t: "Diffusion impairment in the dependent lung", ok: false },
    ],
    rationale: "During OLV, the non-ventilated (operative/nondependent) lung continues to receive ~50% of pulmonary blood flow, creating a large obligatory shunt. HPV partially compensates by diverting blood toward the ventilated lung. Volatile agents reduce HPV, worsening hypoxemia.",
    metadata: { topic: "V/Q Mismatch", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["one-lung ventilation", "OLV", "shunt", "HPV"] }
  },

  // ── boa-node5-pulm-040 ──────────────────────────────────────────────────────
  {
    id: "boa-node5-pulm-040",
    type: "mcq",
    prompt: "The oxygen content of blood (CaO₂) is calculated as:",
    setup: "",
    ans: [
      { t: "(Hb × SaO₂ × 1.34) + (0.003 × PaO₂)", ok: true },
      { t: "SaO₂ × PaO₂ / 100", ok: false },
      { t: "Hb × 1.34 only", ok: false },
      { t: "(PaO₂ × 0.003) / SaO₂", ok: false },
    ],
    rationale: "CaO₂ (mL O₂/dL) = (Hb × SaO₂ × 1.34) + (0.003 × PaO₂). The 1.34 mL O₂/g Hb represents the carrying capacity of hemoglobin. The dissolved fraction (0.003 × PaO₂) is small at normal PaO₂ but becomes significant with hyperbaric O₂.",
    metadata: { topic: "Fick Equation", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["oxygen content", "CaO2", "hemoglobin", "Fick"] }
  },

  // ── boa-node5-pulm-041 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-041",
    type: "multi",
    prompt: "Select TWO factors that directly INCREASE pulmonary vascular resistance (PVR):",
    setup: "",
    choices: [
      "Hypoxia (alveolar PO₂ < 70 mmHg)",
      "Hyperventilation (↓PaCO₂, ↑pH)",
      "Hypercapnia and acidosis",
      "Inhaled nitric oxide (iNO)",
      "Sildenafil (phosphodiesterase-5 inhibitor)",
    ],
    correctAnswers: [
      "Hypoxia (alveolar PO₂ < 70 mmHg)",
      "Hypercapnia and acidosis",
    ],
    selectCount: 2,
    rationale: "Hypoxic pulmonary vasoconstriction increases PVR in response to low PAO₂. Hypercapnia and acidosis (↑PaCO₂, ↓pH) also increase PVR. Hyperventilation (↓PaCO₂, alkalosis), iNO, and sildenafil all decrease PVR (used to treat pulmonary hypertension).",
    metadata: { topic: "Pulmonary Vascular Resistance", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["PVR", "pulmonary hypertension", "HPV", "nitric oxide"] }
  },

  // ── boa-node5-pulm-042 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-042",
    type: "multi",
    prompt: "Select THREE correct statements about the West lung zones:",
    setup: "",
    choices: [
      "Zone 1 is at the apex where alveolar pressure exceeds arterial pressure",
      "Zone 2 acts as a Starling resistor, flow driven by Pa − PA",
      "Zone 3 has the greatest blood flow driven by Pa − Pv",
      "Zone 1 has the highest V/Q ratio in the normal upright lung",
      "Positive pressure ventilation converts Zone 3 to Zone 1",
    ],
    correctAnswers: [
      "Zone 1 is at the apex where alveolar pressure exceeds arterial pressure",
      "Zone 2 acts as a Starling resistor, flow driven by Pa − PA",
      "Zone 3 has the greatest blood flow driven by Pa − Pv",
    ],
    selectCount: 3,
    rationale: "West zones: Zone 1 (apex) PA > Pa > Pv — no flow; Zone 2 (middle) Pa > PA > Pv — Starling resistor (Pa − PA drives flow); Zone 3 (base) Pa > Pv > PA — normal AV gradient drives flow. The apex has the highest V/Q (not Zone 1 specifically per se — the entire apex region). PPV expands Zone 1/2 by raising PA, converting lower zones to Zone 1 conditions.",
    metadata: { topic: "West Lung Zones", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["West zones", "V/Q", "pulmonary blood flow"] }
  },

  // ── boa-node5-pulm-043 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-043",
    type: "multi",
    prompt: "Select TWO conditions that cause a RIGHTWARD shift of the oxyhemoglobin dissociation curve:",
    setup: "",
    choices: [
      "Fever (temperature 40°C)",
      "Hypothermia (temperature 32°C)",
      "Alkalosis (pH 7.55)",
      "Lactic acidosis (pH 7.20)",
      "Fetal hemoglobin",
    ],
    correctAnswers: [
      "Fever (temperature 40°C)",
      "Lactic acidosis (pH 7.20)",
    ],
    selectCount: 2,
    rationale: "Right shift (↓O₂ affinity, ↑P50) — Hb releases O₂ more easily: fever, acidosis (Bohr effect), ↑CO₂, ↑2,3-DPG. Left shift (↑O₂ affinity): hypothermia, alkalosis, ↓CO₂, HbF, ↓2,3-DPG.",
    metadata: { topic: "Oxyhemoglobin Dissociation Curve", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["Bohr effect", "right shift", "P50", "temperature", "pH"] }
  },

  // ── boa-node5-pulm-044 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-044",
    type: "multi",
    prompt: "Select TWO causes of an ELEVATED A-a gradient:",
    setup: "",
    choices: [
      "Pulmonary embolism (high V/Q dead space)",
      "Hypoventilation from opioids (normal A-a gradient)",
      "Intracardiac right-to-left shunt",
      "Altitude hypoxia with normal lungs",
      "Anemia (hemoglobin 7 g/dL)",
    ],
    correctAnswers: [
      "Pulmonary embolism (high V/Q dead space)",
      "Intracardiac right-to-left shunt",
    ],
    selectCount: 2,
    rationale: "The A-a gradient widens with V/Q mismatch (including PE), true shunt, and diffusion impairment. Pure hypoventilation (opioids, sedatives) reduces PaO₂ via the alveolar gas equation but does NOT widen the A-a gradient (PAO₂ also falls proportionally). Altitude and anemia preserve a normal A-a gradient.",
    metadata: { topic: "A-a Gradient", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["A-a gradient", "V/Q mismatch", "shunt", "hypoventilation"] }
  },

  // ── boa-node5-pulm-045 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-045",
    type: "multi",
    prompt: "Select THREE mechanisms by which CO₂ is transported in venous blood:",
    setup: "",
    choices: [
      "Dissolved in plasma (~7–10%)",
      "As bicarbonate (HCO₃⁻) (~70%)",
      "Bound to albumin as carbamino compounds (~15%)",
      "Bound to hemoglobin as carbaminohemoglobin (~20–23%)",
      "As carbonic acid (H₂CO₃) (>50%)",
    ],
    correctAnswers: [
      "Dissolved in plasma (~7–10%)",
      "As bicarbonate (HCO₃⁻) (~70%)",
      "Bound to hemoglobin as carbaminohemoglobin (~20–23%)",
    ],
    selectCount: 3,
    rationale: "CO₂ transport: ~70% as HCO₃⁻ (carbonic anhydrase in RBCs), ~20–23% as carbaminohemoglobin (CO₂ + Hb amino groups), ~7–10% dissolved. Albumin carbamino compounds are negligible. H₂CO₃ is a short-lived intermediate, not a major transport form.",
    metadata: { topic: "CO2 Transport", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["CO2 transport", "bicarbonate", "carbaminohemoglobin", "dissolved CO2"] }
  },

  // ── boa-node5-pulm-046 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-046",
    type: "multi",
    prompt: "Select TWO cardiovascular effects of acute hypercapnia (PaCO₂ 70 mmHg):",
    setup: "",
    choices: [
      "Increased heart rate via sympathetic stimulation",
      "Bradycardia from direct vagal stimulation",
      "Hypertension from catecholamine release",
      "Pulmonary vasodilation",
      "Decreased cardiac contractility",
    ],
    correctAnswers: [
      "Increased heart rate via sympathetic stimulation",
      "Hypertension from catecholamine release",
    ],
    selectCount: 2,
    rationale: "Acute hypercapnia triggers sympathetic activation (adrenal medulla + direct CNS), causing tachycardia and hypertension. Direct myocardial effects of CO₂ are depressant but are normally masked by sympathetic stimulation. Hypercapnia causes pulmonary vasoconstriction (not dilation), worsening HPV.",
    metadata: { topic: "Hypercapnia Effects", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["hypercapnia", "cardiovascular", "sympathetic", "catecholamines"] }
  },

  // ── boa-node5-pulm-047 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-047",
    type: "multi",
    prompt: "Select TWO factors that decrease FRC in a patient undergoing general anesthesia:",
    setup: "",
    choices: [
      "Supine positioning causing cephalad diaphragm shift",
      "Loss of tonic respiratory muscle activity",
      "Endotracheal intubation",
      "Application of PEEP 5 cmH₂O",
      "Increased tidal volume",
    ],
    correctAnswers: [
      "Supine positioning causing cephalad diaphragm shift",
      "Loss of tonic respiratory muscle activity",
    ],
    selectCount: 2,
    rationale: "FRC decreases with: (1) supine positioning (abdomen pushes diaphragm cephalad); (2) loss of tonic respiratory muscle tone with anesthesia; (3) obesity; (4) increased abdominal pressure. PEEP restores/increases FRC. Intubation doesn't directly change FRC.",
    metadata: { topic: "Lung Volumes", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["FRC", "supine", "general anesthesia", "PEEP"] }
  },

  // ── boa-node5-pulm-048 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-048",
    type: "multi",
    prompt: "Select TWO true statements about the carotid bodies:",
    setup: "",
    choices: [
      "They respond to PaO₂, not to SaO₂ or CaO₂",
      "Anemia stimulates them because oxygen delivery falls",
      "They respond to arterial hypoxemia with ventilatory stimulation",
      "They are innervated by the phrenic nerve",
      "Bilateral carotid endarterectomy abolishes the hypercapnic ventilatory response",
    ],
    correctAnswers: [
      "They respond to PaO₂, not to SaO₂ or CaO₂",
      "They respond to arterial hypoxemia with ventilatory stimulation",
    ],
    selectCount: 2,
    rationale: "Carotid bodies sense PaO₂ directly (not SaO₂ or CaO₂ — anemia and CO poisoning don't stimulate them). They fire when PaO₂ < ~60 mmHg and stimulate ventilation. They are innervated by CN IX (Hering's nerve). Bilateral carotid body resection abolishes the hypoxic (not hypercapnic) ventilatory response.",
    metadata: { topic: "Chemoreceptors", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["carotid body", "peripheral chemoreceptors", "PaO2", "hypoxic drive"] }
  },

  // ── boa-node5-pulm-049 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-049",
    type: "multi",
    prompt: "Select TWO drugs that BLUNT the hypoxic ventilatory response (HVR):",
    setup: "",
    choices: [
      "Volatile anesthetic agents (e.g., sevoflurane 0.1 MAC)",
      "Neostigmine",
      "Ketamine",
      "Opioids (morphine, fentanyl)",
      "Dexamethasone",
    ],
    correctAnswers: [
      "Volatile anesthetic agents (e.g., sevoflurane 0.1 MAC)",
      "Opioids (morphine, fentanyl)",
    ],
    selectCount: 2,
    rationale: "Both volatile agents (even 0.1 MAC markedly blunts HVR) and opioids (μ-receptor mediated) suppress the carotid body response to hypoxia. This is a significant PACU risk — residual anesthetic or analgesic agents can mask hypoxemia. Ketamine preserves airway reflexes and HVR.",
    metadata: { topic: "Ventilation Control", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["hypoxic ventilatory response", "opioids", "volatile anesthetics", "PACU"] }
  },

  // ── boa-node5-pulm-050 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-050",
    type: "multi",
    prompt: "Select THREE features of a true intrapulmonary shunt (Qs/Qt) that distinguish it from V/Q mismatch:",
    setup: "",
    choices: [
      "PaO₂ does not improve with 100% FiO₂",
      "Always presents with hypercapnia",
      "A-a gradient is elevated",
      "Caused by atelectasis or consolidation (alveoli perfused but not ventilated)",
      "Responds dramatically to bronchodilators",
    ],
    correctAnswers: [
      "PaO₂ does not improve with 100% FiO₂",
      "A-a gradient is elevated",
      "Caused by atelectasis or consolidation (alveoli perfused but not ventilated)",
    ],
    selectCount: 3,
    rationale: "True shunt: blood bypasses ventilated alveoli entirely, so increasing FiO₂ cannot oxygenate it (the blood never contacts alveolar gas). A-a gradient widens. Causes: atelectasis, consolidation, ARDS, intracardiac R→L shunt. Hypercapnia is unusual because compensatory hyperventilation usually maintains PaCO₂ or even creates hypocapnia.",
    metadata: { topic: "Shunt", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["shunt", "atelectasis", "FiO2", "V/Q", "A-a gradient"] }
  },

  // ── boa-node5-pulm-051 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-051",
    type: "multi",
    prompt: "Select TWO components of the Fick equation required to calculate cardiac output:",
    setup: "",
    choices: [
      "Oxygen consumption (VO₂)",
      "Arteriovenous oxygen content difference (CaO₂ − CvO₂)",
      "Mean arterial pressure",
      "Pulmonary capillary wedge pressure",
      "Respiratory quotient",
    ],
    correctAnswers: [
      "Oxygen consumption (VO₂)",
      "Arteriovenous oxygen content difference (CaO₂ − CvO₂)",
    ],
    selectCount: 2,
    rationale: "Fick: CO = VO₂ / (CaO₂ − CvO₂). To measure CO, you need: VO₂ (measured by metabolic cart or assumed ~250 mL/min), CaO₂ (arterial blood gas + Hb), and CvO₂ (mixed venous sample from PA catheter). MAP and PCWP are needed for SVR/PVR, not CO.",
    metadata: { topic: "Fick Equation", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["Fick", "cardiac output", "VO2", "CaO2", "CvO2"] }
  },

  // ── boa-node5-pulm-052 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-052",
    type: "multi",
    prompt: "Select TWO conditions in which pulse oximetry is UNRELIABLE:",
    setup: "",
    choices: [
      "Carbon monoxide poisoning",
      "Mild anemia (Hb 10 g/dL) with normal PaO₂",
      "Methemoglobinemia",
      "Hypothermia causing vasoconstriction and poor signal",
      "Supplemental O₂ at FiO₂ 0.40",
    ],
    correctAnswers: [
      "Carbon monoxide poisoning",
      "Methemoglobinemia",
    ],
    selectCount: 2,
    rationale: "Standard two-wavelength pulse oximeters cannot differentiate COHb (reads ~100%) or MetHb (drives toward 85%) from OxyHb. Poor perfusion (hypothermia, hypotension) reduces signal quality but doesn't cause systematic false readings. Co-oximetry (4-wavelength) is required to accurately measure COHb and MetHb.",
    metadata: { topic: "Pulse Oximetry", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["pulse oximetry", "COHb", "MetHb", "co-oximetry"] }
  },

  // ── boa-node5-pulm-053 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-053",
    type: "multi",
    prompt: "Select THREE causes of increased dead space (VD/VT):",
    setup: "",
    choices: [
      "Pulmonary embolism",
      "Positive pressure ventilation with high PEEP",
      "Pneumonia consolidation (V/Q = 0)",
      "Hypotension reducing pulmonary perfusion",
      "Shallow, high-frequency breathing",
    ],
    correctAnswers: [
      "Pulmonary embolism",
      "Positive pressure ventilation with high PEEP",
      "Hypotension reducing pulmonary perfusion",
    ],
    selectCount: 3,
    rationale: "Dead space increases when ventilated areas are not perfused (V/Q → ∞): pulmonary embolism (blocked vessels), high PEEP (overdistension compresses surrounding capillaries), hypotension (reduced pulmonary perfusion pressure). Pneumonia consolidation is low V/Q (V/Q → 0) = shunt, not dead space. Rapid shallow breathing increases anatomical dead space fraction.",
    metadata: { topic: "Dead Space", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["dead space", "VD/VT", "pulmonary embolism", "PEEP", "V/Q"] }
  },

  // ── boa-node5-pulm-054 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-054",
    type: "multi",
    prompt: "Select TWO ways in which volatile anesthetics affect pulmonary physiology (beyond ventilatory depression):",
    setup: "",
    choices: [
      "Inhibit hypoxic pulmonary vasoconstriction (HPV)",
      "Increase functional residual capacity (FRC)",
      "Cause bronchodilation",
      "Increase mucociliary clearance",
      "Stimulate central chemoreceptors",
    ],
    correctAnswers: [
      "Inhibit hypoxic pulmonary vasoconstriction (HPV)",
      "Cause bronchodilation",
    ],
    selectCount: 2,
    rationale: "Volatiles: (1) inhibit HPV, worsening V/Q matching during one-lung ventilation; (2) bronchodilate via smooth muscle relaxation (useful in bronchospasm). They decrease (not increase) FRC via muscle relaxation. Mucociliary clearance is impaired. They depress (not stimulate) chemoreceptors.",
    metadata: { topic: "Ventilation Control", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["volatile anesthetics", "HPV", "bronchodilation", "FRC", "pulmonary effects"] }
  },

  // ── boa-node5-pulm-055 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-055",
    type: "multi",
    prompt: "Select TWO correct relationships between lung volume and pulmonary vascular resistance (PVR):",
    setup: "",
    choices: [
      "PVR is lowest at functional residual capacity (FRC)",
      "PVR increases at high lung volumes due to compression of alveolar vessels",
      "PVR increases at low lung volumes due to increased alveolar-wall tension on extra-alveolar vessels",
      "PVR remains constant throughout the tidal volume range",
      "PVR is lowest at total lung capacity (TLC)",
    ],
    correctAnswers: [
      "PVR is lowest at functional residual capacity (FRC)",
      "PVR increases at high lung volumes due to compression of alveolar vessels",
    ],
    selectCount: 2,
    rationale: "PVR has a U-shaped relationship with lung volume, lowest at FRC. At high volumes (near TLC): alveolar capillaries are compressed by distended alveoli → ↑PVR. At low volumes (near RV): extra-alveolar vessels are compressed by perivascular tissue tension → ↑PVR. FRC represents the optimal balance.",
    metadata: { topic: "Pulmonary Vascular Resistance", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["PVR", "lung volume", "FRC", "alveolar vessels"] }
  },

  // ── boa-node5-pulm-056 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-056",
    type: "multi",
    prompt: "Select TWO correct features of central chemoreceptors:",
    setup: "",
    choices: [
      "Located on the ventral surface of the medulla oblongata",
      "Respond directly to arterial PO₂ below 60 mmHg",
      "Account for approximately 80% of the ventilatory response to CO₂",
      "Are rapidly responsive (seconds) compared to peripheral chemoreceptors",
      "Are not affected by opioids",
    ],
    correctAnswers: [
      "Located on the ventral surface of the medulla oblongata",
      "Account for approximately 80% of the ventilatory response to CO₂",
    ],
    selectCount: 2,
    rationale: "Central chemoreceptors: ventral medullary surface; respond to CSF pH (CO₂ crosses BBB); ~80% of CO₂ ventilatory response; slower response (minutes) than peripheral (seconds) because CO₂ must diffuse across BBB and equilibrate. They do NOT respond to hypoxia. Opioids depress them via mu receptors.",
    metadata: { topic: "Chemoreceptors", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["central chemoreceptors", "medulla", "CO2 response", "BBB"] }
  },

  // ── boa-node5-pulm-057 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-057",
    type: "multi",
    prompt: "Select TWO factors that INCREASE oxygen delivery (DO₂) to tissues:",
    setup: "DO₂ = CO × CaO₂ × 10",
    choices: [
      "Increasing hemoglobin concentration from 7 to 10 g/dL",
      "Decreasing cardiac output by 30%",
      "Administering supplemental O₂ to increase SaO₂ from 88% to 97%",
      "Inducing mild hypothermia",
      "Increasing PaCO₂ to promote Bohr effect",
    ],
    correctAnswers: [
      "Increasing hemoglobin concentration from 7 to 10 g/dL",
      "Administering supplemental O₂ to increase SaO₂ from 88% to 97%",
    ],
    selectCount: 2,
    rationale: "DO₂ = CO × CaO₂ × 10. CaO₂ = (Hb × SaO₂ × 1.34) + (0.003 × PaO₂). Increasing Hb or SaO₂ directly increases CaO₂ and thus DO₂. Decreasing CO reduces DO₂. Hypothermia reduces metabolic demand (VO₂) but doesn't increase DO₂. The Bohr effect improves O₂ unloading but doesn't change DO₂.",
    metadata: { topic: "Fick Equation", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["oxygen delivery", "DO2", "CaO2", "hemoglobin", "cardiac output"] }
  },

  // ── boa-node5-pulm-058 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-058",
    type: "multi",
    prompt: "Select TWO physiologic compensations that occur with acute altitude exposure:",
    setup: "",
    choices: [
      "Hyperventilation driven by peripheral chemoreceptor hypoxic stimulation",
      "Acute respiratory acidosis from initial CO₂ retention",
      "Erythropoietin release → increased RBC production (over days–weeks)",
      "Immediate polycythemia from bone marrow activation",
      "Decreased HPV to preserve pulmonary blood flow",
    ],
    correctAnswers: [
      "Hyperventilation driven by peripheral chemoreceptor hypoxic stimulation",
      "Erythropoietin release → increased RBC production (over days–weeks)",
    ],
    selectCount: 2,
    rationale: "Acute altitude: hypoxia stimulates carotid bodies → hyperventilation (immediate), causing respiratory alkalosis (not acidosis). Over days, EPO release stimulates erythropoiesis → polycythemia (acclimatization). Immediate 'polycythemia' doesn't occur from BMT; splenic contraction gives minor hemoconcentration. HPV actually increases at altitude.",
    metadata: { topic: "Altitude Physiology", priority: "medium", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["altitude", "acclimatization", "hyperventilation", "EPO", "polycythemia"] }
  },

  // ── boa-node5-pulm-059 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-059",
    type: "multi",
    prompt: "Select TWO correct statements about the relationship between PaO₂ and SpO₂ on the oxyhemoglobin dissociation curve:",
    setup: "",
    choices: [
      "At PaO₂ 60 mmHg, SpO₂ is ~90% — clinically acceptable minimum",
      "Above PaO₂ 100 mmHg, increasing PaO₂ adds little additional SpO₂",
      "The curve is linear throughout its range",
      "SpO₂ of 75% corresponds to PaO₂ of approximately 40 mmHg (mixed venous)",
      "A PaO₂ of 27 mmHg corresponds to SpO₂ ~100%",
    ],
    correctAnswers: [
      "At PaO₂ 60 mmHg, SpO₂ is ~90% — clinically acceptable minimum",
      "Above PaO₂ 100 mmHg, increasing PaO₂ adds little additional SpO₂",
    ],
    selectCount: 2,
    rationale: "The curve is sigmoidal, not linear. Key points: PaO₂ 27 mmHg = SpO₂ 50% (P50); PaO₂ 40 mmHg = SpO₂ ~75% (mixed venous); PaO₂ 60 mmHg = SpO₂ ~90% (the clinical 'danger threshold'); PaO₂ 100 mmHg = SpO₂ ~97%. Above ~100 mmHg, the curve flattens — increasing PaO₂ yields negligible SpO₂ gain.",
    metadata: { topic: "Oxyhemoglobin Dissociation Curve", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["oxyhemoglobin", "P50", "SpO2", "PaO2", "sigmoidal curve"] }
  },

  // ── boa-node5-pulm-060 — MULTI ──────────────────────────────────────────────
  {
    id: "boa-node5-pulm-060",
    type: "multi",
    prompt: "Select TWO strategies used to manage hypoxemia during one-lung ventilation (OLV):",
    setup: "",
    choices: [
      "Apply CPAP (5–10 cmH₂O) to the non-ventilated operative lung",
      "Increase volatile anesthetic concentration to enhance HPV",
      "Apply PEEP to the dependent (ventilated) lung",
      "Administer inhaled NO to the non-ventilated lung",
      "Reduce tidal volume to increase respiratory rate",
    ],
    correctAnswers: [
      "Apply CPAP (5–10 cmH₂O) to the non-ventilated operative lung",
      "Apply PEEP to the dependent (ventilated) lung",
    ],
    selectCount: 2,
    rationale: "OLV hypoxemia management: (1) CPAP to non-ventilated lung — keeps alveoli partially open, allowing some O₂ uptake while reducing shunt; (2) PEEP to dependent lung — recruits collapsed alveoli and improves V/Q. Volatile agents inhibit HPV, worsening hypoxemia at high concentrations. iNO is given to the ventilated lung to vasodilate and increase its blood flow share.",
    metadata: { topic: "V/Q Mismatch", priority: "high", category: "pulmonary-physiology", source: "node-5-chapter-5", tags: ["OLV", "one-lung ventilation", "CPAP", "PEEP", "hypoxemia management"] }
  },

];

// ── Metadata (auto-computed) ─────────────────────────────────────────────────
export const PULMONARY_METADATA = {
  nodeId:    "node-5",
  courseId:  "basics-of-anesthesia",
  chapter:   "Chapter 5",
  title:     "Pulmonary Physiology",
  totalQuestions: PULMONARY_QUESTIONS.length,
  questionTypes: {
    mcq:   PULMONARY_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: PULMONARY_QUESTIONS.filter(q => q.type === 'multi').length,
    short: PULMONARY_QUESTIONS.filter(q => q.type === 'short').length,
  }
};
