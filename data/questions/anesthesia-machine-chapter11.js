/**
 * ANESTHESIA MACHINE QUESTION BANK — Chapter 11
 * Course: Basics of Anesthesia
 * Node: node-11
 *
 * 100 NBCRNA board-style questions covering anesthesia delivery systems.
 *
 * Question Types:
 * - mcq:   Single best answer — ans:[{t, ok}]
 * - multi:  Select multiple  — choices + correctAnswers + selectCount
 * - short:  Free response    — acceptedAnswers[]
 */

export const MACHINE_QUESTIONS = [

  // ═══════════════════════════════════════════════════════════════════════════
  // THREE PNEUMATIC SYSTEMS OVERVIEW (5 questions: 001-005)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── boa-node11-ads-001 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-001",
    type: "mcq",
    scene: null,
    prompt: "An anesthesia machine is mechanically organized into three pneumatic systems based on the pressures each section handles. Which grouping correctly names all three?",
    setup: "",
    ans: [
      { t: "High pressure, intermediate pressure, and low pressure systems", ok: true },
      { t: "Peak pressure, intermediate pressure, and baseline pressure systems", ok: false },
      { t: "Source pressure, regulator pressure, and delivery pressure systems", ok: false },
      { t: "Cylinder pressure, pipeline pressure, and patient-circuit pressure", ok: false },
    ],
    rationale: "Every modern anesthesia machine is divided into high pressure (cylinder supply and regulators), intermediate pressure (pipeline inlets, ventilator power, oxygen flush), and low pressure (downstream of flow control valves through the common gas outlet). 'Peak/baseline' and 'source/delivery' are fabricated terms. 'Cylinder/pipeline/patient-circuit' conflates sources with functional pressure zones.",
    metadata: { topic: "Pneumatic Systems Overview", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["pneumatic systems", "machine organization", "pressure zones"] }
  },

  // ── boa-node11-ads-002 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-002",
    type: "mcq",
    scene: null,
    prompt: "A provider notes gas pressures near 2200 psi at the cylinder, 50 psi at the pipeline inlet, and sub-atmospheric pressures at the vaporizer outlet. Each of these pressures corresponds to which pneumatic system, respectively?",
    setup: "",
    ans: [
      { t: "High pressure, intermediate pressure, and low pressure", ok: true },
      { t: "Intermediate pressure, high pressure, and low pressure", ok: false },
      { t: "High pressure, low pressure, and intermediate pressure", ok: false },
      { t: "Low pressure, intermediate pressure, and high pressure", ok: false },
    ],
    rationale: "Cylinders at 2200 psi are the high pressure system. Pipeline gases enter at approximately 50 psi in the intermediate system. Downstream of the flow control valves, including vaporizers and the common gas outlet, constitutes the low pressure system. Reversing the order confuses source pressures with machine architecture.",
    metadata: { topic: "Pneumatic Systems Overview", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["pneumatic systems", "pressure identification", "machine architecture"] }
  },

  // ── boa-node11-ads-003 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-003",
    type: "multi",
    scene: null,
    prompt: "Which of the following components are located within the intermediate pressure system? (Select THREE)",
    choices: [
      "Pipeline inlet connections via DISS fittings",
      "Ventilator power inlet for driving gas",
      "Oxygen flush valve supply pathway",
      "Hanger yoke assembly and check valve",
      "Concentration-calibrated vaporizer chamber",
    ],
    correctAnswers: [
      "Pipeline inlet connections via DISS fittings",
      "Ventilator power inlet for driving gas",
      "Oxygen flush valve supply pathway",
    ],
    selectCount: 3,
    rationale: "Pipeline inlets, ventilator driving gas, and the oxygen flush valve all operate at intermediate pressures of 40-55 psi. The hanger yoke belongs to the high pressure system. Vaporizers sit in the low pressure system downstream of the flow control valves.",
    metadata: { topic: "Pneumatic Systems Overview", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["pneumatic systems", "intermediate pressure", "component location"] }
  },

  // ── boa-node11-ads-004 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-004",
    type: "mcq",
    scene: null,
    prompt: "Why is proper understanding of the three pneumatic systems clinically important when troubleshooting an anesthesia machine malfunction?",
    setup: "",
    ans: [
      { t: "It allows the provider to localize a fault based on the pressure range where the problem occurs", ok: true },
      { t: "It ensures the provider can manually increase pipeline supply pressures during a crisis", ok: false },
      { t: "It enables the provider to bypass the vaporizer and deliver agent through the flush valve", ok: false },
      { t: "It permits the provider to connect cylinder gas directly to the common gas outlet port", ok: false },
    ],
    rationale: "Understanding pressure zones lets the clinician systematically isolate whether a gas delivery problem originates at the cylinder (high), pipeline/regulators (intermediate), or flowmeters/vaporizers (low). Providers cannot manually increase pipeline pressures. The flush valve bypasses vaporizers and cannot deliver agent. Direct cylinder-to-outlet connections are not possible on a properly designed machine.",
    metadata: { topic: "Pneumatic Systems Overview", priority: "medium", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["pneumatic systems", "troubleshooting", "clinical reasoning"] }
  },

  // ── boa-node11-ads-005 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-005",
    type: "short",
    scene: null,
    prompt: "What are the three pneumatic systems of the anesthesia machine, listed from highest to lowest operating pressure?",
    acceptedAnswers: [
      "High pressure, intermediate pressure, low pressure",
      "high pressure, intermediate pressure, low pressure",
      "High, intermediate, low",
      "high, intermediate, low",
      "High pressure system, intermediate pressure system, low pressure system",
    ],
    rationale: "The three pneumatic systems, from highest to lowest operating pressure, are the high pressure system (cylinders, up to 2200 psi), intermediate pressure system (pipeline supply, 40-55 psi), and low pressure system (downstream of flow control valves, near atmospheric).",
    metadata: { topic: "Pneumatic Systems Overview", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["pneumatic systems", "recall", "machine organization"] }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HIGH PRESSURE SYSTEM (8 questions: 006-013)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── boa-node11-ads-006 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-006",
    type: "multi",
    scene: null,
    prompt: "Which of the following are primary functions of the hanger yoke assembly? (Select THREE)",
    choices: [
      "Orients and supports the E-cylinder on the machine",
      "Provides a gas-tight seal between cylinder and machine",
      "Contains a check valve for unidirectional gas flow",
      "Reduces cylinder pressure from 2200 psi to 45 psi",
      "Connects the machine to the hospital wall pipeline",
    ],
    correctAnswers: [
      "Orients and supports the E-cylinder on the machine",
      "Provides a gas-tight seal between cylinder and machine",
      "Contains a check valve for unidirectional gas flow",
    ],
    selectCount: 3,
    rationale: "The hanger yoke orients/supports the cylinder, provides a gas-tight seal, and houses a check valve ensuring unidirectional flow. Pressure reduction to 40-48 psi is performed by the first-stage regulator, not the yoke. Pipeline connections use DISS fittings, which are separate from the yoke assembly.",
    metadata: { topic: "High Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["hanger yoke", "check valve", "cylinder mounting"] }
  },

  // ── boa-node11-ads-007 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-007",
    type: "mcq",
    scene: null,
    prompt: "A Bourdon gauge on a full oxygen E-cylinder reads 2200 psi. What physical principle does this gauge use to display pressure?",
    setup: "",
    ans: [
      { t: "A curved hollow tube straightens proportionally as internal pressure rises", ok: true },
      { t: "A piezoelectric crystal generates voltage proportional to applied pressure", ok: false },
      { t: "A mercury column rises in a calibrated glass tube as pressure increases", ok: false },
      { t: "A capacitive membrane deflects and changes electrical capacitance value", ok: false },
    ],
    rationale: "Bourdon gauges contain a curved, hollow metal tube that tends to straighten as internal gas pressure increases, mechanically moving a needle across a calibrated dial. Piezoelectric and capacitive sensors are electronic transducers not used in standard cylinder gauges. Mercury manometers measure much lower pressures and are not used on cylinders.",
    metadata: { topic: "High Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Bourdon gauge", "pressure measurement", "cylinder monitoring"] }
  },

  // ── boa-node11-ads-008 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-008",
    type: "mcq",
    scene: null,
    prompt: "The first-stage pressure regulator on the anesthesia machine reduces cylinder pressure to what approximate range before gas enters the intermediate system?",
    setup: "",
    ans: [
      { t: "Approximately 40 to 48 psi for safe downstream handling", ok: true },
      { t: "Approximately 10 to 15 psi for direct patient delivery", ok: false },
      { t: "Approximately 100 to 120 psi for ventilator power supply", ok: false },
      { t: "Approximately 200 to 250 psi for flowmeter calibration", ok: false },
    ],
    rationale: "First-stage regulators reduce cylinder pressure (up to 2200 psi for O2) to approximately 40-48 psi, matching pipeline pressure so the machine can handle gas from either source. 10-15 psi is too low and corresponds to second-stage reduction. 100-250 psi values are fabricated and dangerously high for intermediate system components.",
    metadata: { topic: "High Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["pressure regulator", "first-stage reduction", "cylinder pressure"] }
  },

  // ── boa-node11-ads-009 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-009",
    type: "mcq",
    scene: null,
    prompt: "Why must cylinder valves be closed when the anesthesia machine is actively connected to a functioning hospital pipeline supply?",
    setup: "",
    ans: [
      { t: "The machine preferentially draws from the highest-pressure source, silently depleting cylinders", ok: true },
      { t: "Open cylinders will force pipeline gas backward into the hospital wall supply manifold", ok: false },
      { t: "Simultaneous cylinder and pipeline flow will cause vaporizer output to become unpredictable", ok: false },
      { t: "The check valve cannot distinguish between cylinder gas and pipeline gas compositions", ok: false },
    ],
    rationale: "Because cylinder pressure after first-stage regulation (45 psi) is slightly below pipeline pressure (50 psi), the machine normally draws from the pipeline. However, if pipeline pressure drops even slightly, the machine silently switches to cylinder supply, depleting emergency reserves. Closing cylinders prevents unnoticed depletion. Gas cannot flow backward through check valves. Vaporizer output is unaffected by the gas source. Check valves function based on pressure differentials, not gas composition.",
    metadata: { topic: "High Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["cylinder management", "pipeline priority", "gas depletion"] }
  },

  // ── boa-node11-ads-010 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-010",
    type: "mcq",
    scene: null,
    prompt: "What is the purpose of the check valve located within the hanger yoke assembly?",
    setup: "",
    ans: [
      { t: "It ensures gas flows only from the cylinder into the machine, preventing backflow", ok: true },
      { t: "It reduces cylinder pressure from 2200 psi down to the intermediate pressure range", ok: false },
      { t: "It filters particulate debris larger than 100 micrometers from cylinder gas", ok: false },
      { t: "It color-codes the gas stream so the correct pipeline connection can be verified", ok: false },
    ],
    rationale: "The check valve in the hanger yoke permits unidirectional flow from cylinder to machine and prevents gas from leaking out through an empty yoke. Pressure reduction is the regulator's function. Filtration is performed by a separate 100-micrometer filter. Color coding is a visual identification system, not a valve function.",
    metadata: { topic: "High Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["check valve", "hanger yoke", "unidirectional flow"] }
  },

  // ── boa-node11-ads-011 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-011",
    type: "mcq",
    scene: null,
    prompt: "A provider notices the Bourdon gauge reads zero on an oxygen E-cylinder that was just delivered. Which explanation is most likely?",
    setup: "",
    ans: [
      { t: "The cylinder valve is closed, so no pressure is transmitted to the gauge", ok: true },
      { t: "The cylinder is completely empty and must be replaced immediately now", ok: false },
      { t: "The Bourdon gauge has been damaged during transport of the cylinder", ok: false },
      { t: "The first-stage regulator has failed and is blocking all pressure flow", ok: false },
    ],
    rationale: "Bourdon gauges only display pressure when the cylinder valve is open. A newly delivered cylinder reading zero most likely has a closed valve. While an empty cylinder is possible, it is unlikely for a new delivery. Gauge damage and regulator failure are less common explanations for a zero reading on a new cylinder.",
    metadata: { topic: "High Pressure System", priority: "medium", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Bourdon gauge", "cylinder valve", "troubleshooting"] }
  },

  // ── boa-node11-ads-012 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-012",
    type: "short",
    scene: null,
    prompt: "What is the oxygen E-cylinder factor used for calculating remaining supply duration?",
    acceptedAnswers: [
      "0.28",
      ".28",
    ],
    rationale: "The O2 E-cylinder factor is 0.28. This factor converts remaining psi to liters (psi x 0.28 = liters remaining). It is derived from the full cylinder capacity of 625 L at 2200 psi (625/2200 ≈ 0.28).",
    metadata: { topic: "High Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["cylinder factor", "oxygen", "supply calculation"] }
  },

  // ── boa-node11-ads-013 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-013",
    type: "mcq",
    scene: null,
    prompt: "Why is the first-stage regulator output set slightly below normal pipeline pressure?",
    setup: "",
    ans: [
      { t: "So the machine preferentially uses pipeline gas and conserves cylinder reserves for emergencies", ok: true },
      { t: "So the machine preferentially uses cylinder gas and avoids pipeline contamination completely", ok: false },
      { t: "So the machine can detect pipeline failure by measuring the pressure differential constantly", ok: false },
      { t: "So the machine can equalize both sources and draw from them simultaneously during operation", ok: false },
    ],
    rationale: "Regulators output at ~45 psi, slightly below pipeline pressure (~50 psi). This differential ensures the machine draws from the pipeline when available, preserving cylinder gas for emergencies. The machine does not preferentially use cylinders, does not use the differential for detection, and does not draw from both sources simultaneously under normal conditions.",
    metadata: { topic: "High Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["pressure regulator", "pipeline priority", "gas conservation"] }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // E-CYLINDERS (8 questions: 014-021)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── boa-node11-ads-014 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-014",
    type: "mcq",
    scene: null,
    prompt: "A full oxygen E-cylinder contains approximately 625 liters at 2200 psi. What physical state is the oxygen inside this cylinder?",
    setup: "",
    ans: [
      { t: "Entirely compressed gas, because O2 critical temperature is far below room temperature", ok: true },
      { t: "A mixture of liquid and gas in vapor-pressure equilibrium at room temperature", ok: false },
      { t: "Entirely liquid oxygen under high pressure that vaporizes upon valve opening", ok: false },
      { t: "Supercritical fluid that behaves as both liquid and gas simultaneously", ok: false },
    ],
    rationale: "Oxygen has a critical temperature of -119°C, well below room temperature, so it exists only as compressed gas in the cylinder. Unlike N2O (critical temp 36.5°C), oxygen cannot exist as a liquid at room temperature regardless of pressure. It is not in liquid-vapor equilibrium, not entirely liquid, and not supercritical at cylinder conditions.",
    metadata: { topic: "E-Cylinders", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["oxygen", "E-cylinder", "gas physics", "critical temperature"] }
  },

  // ── boa-node11-ads-015 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-015",
    type: "mcq",
    scene: null,
    prompt: "A nitrous oxide E-cylinder reads 750 psi on the Bourdon gauge. What can the provider reliably conclude about the remaining contents?",
    setup: "",
    ans: [
      { t: "The tank could be anywhere from full to approximately 25 percent remaining", ok: true },
      { t: "The tank is exactly full because 750 psi is the maximum fill pressure", ok: false },
      { t: "The tank is approximately half full based on the proportional pressure", ok: false },
      { t: "The tank has less than 10 percent remaining and should be replaced now", ok: false },
    ],
    rationale: "Because N2O exists as a liquid-vapor mixture, pressure remains constant at ~750 psi as long as any liquid remains. Pressure only drops after all liquid has vaporized, which occurs when the tank is about 75% depleted. Therefore, 750 psi could indicate a tank that is full or up to ~75% used. The gauge cannot distinguish between these states. It is not necessarily full, half full, or nearly empty.",
    metadata: { topic: "E-Cylinders", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["nitrous oxide", "pressure gauge", "liquid-vapor equilibrium"] }
  },

  // ── boa-node11-ads-016 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-016",
    type: "mcq",
    scene: null,
    prompt: "Why does the pressure gauge on a nitrous oxide E-cylinder remain at approximately 750 psi until the tank is nearly empty?",
    setup: "",
    ans: [
      { t: "N2O exists as liquid-vapor equilibrium, and vapor pressure stays constant until all liquid vaporizes", ok: true },
      { t: "The Bourdon gauge mechanism cannot detect gradual pressure changes smaller than 100 psi accurately", ok: false },
      { t: "The first-stage regulator maintains constant backpressure on the gauge regardless of tank contents", ok: false },
      { t: "N2O molecules are too small for the gauge to accurately measure incremental volume loss over time", ok: false },
    ],
    rationale: "N2O has a critical temperature of 36.5°C, so at room temperature it exists as a liquid-vapor mixture. Vapor pressure depends only on temperature, not on how much liquid remains. As gas is used, liquid vaporizes to maintain equilibrium pressure at ~750 psi. Only after all liquid is gone does pressure begin to fall. The gauge is accurate, the regulator does not affect gauge readings, and molecular size is irrelevant.",
    metadata: { topic: "E-Cylinders", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["nitrous oxide", "vapor pressure", "liquid-vapor equilibrium"] }
  },

  // ── boa-node11-ads-017 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-017",
    type: "mcq",
    scene: null,
    prompt: "A full nitrous oxide E-cylinder contains approximately 1590 liters of gas. If a provider must determine how much N2O remains, which method is most reliable?",
    setup: "",
    ans: [
      { t: "Weighing the cylinder and subtracting the known tare weight of the empty tank", ok: true },
      { t: "Reading the Bourdon pressure gauge and calculating volume proportionally", ok: false },
      { t: "Timing how long the tank has been open and estimating total usage from flow", ok: false },
      { t: "Feeling the temperature of the cylinder wall to estimate the liquid-gas boundary", ok: false },
    ],
    rationale: "Because N2O pressure remains constant while liquid is present, the pressure gauge cannot reliably indicate remaining volume. Weighing is the gold standard — the difference between current weight and tare weight reflects remaining liquid mass, which can be converted to gas volume. Timing is imprecise. Temperature palpation is unreliable and non-quantitative.",
    metadata: { topic: "E-Cylinders", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["nitrous oxide", "cylinder weighing", "volume estimation"] }
  },

  // ── boa-node11-ads-018 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-018",
    type: "mcq",
    scene: null,
    prompt: "How does the relationship between pressure and remaining volume differ between an oxygen E-cylinder and a nitrous oxide E-cylinder?",
    setup: "",
    ans: [
      { t: "O2 pressure drops linearly with use; N2O pressure remains constant until liquid is exhausted", ok: true },
      { t: "Both gases show linear pressure decline proportional to remaining cylinder volume over time", ok: false },
      { t: "O2 pressure remains constant until empty; N2O pressure drops linearly with volume consumed", ok: false },
      { t: "Neither gas shows a predictable pressure-volume relationship in standard E-cylinders today", ok: false },
    ],
    rationale: "Oxygen is stored only as compressed gas, so pressure directly reflects remaining volume (linear relationship). N2O is stored as liquid-vapor mixture, so pressure reflects only vapor pressure (constant) until all liquid is gone, then drops rapidly. The behaviors are opposite; they are not both linear, not reversed, and both are predictable within their physical constraints.",
    metadata: { topic: "E-Cylinders", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["oxygen vs nitrous oxide", "pressure-volume relationship", "gas physics"] }
  },

  // ── boa-node11-ads-019 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-019",
    type: "short",
    scene: null,
    prompt: "What is the approximate volume in liters of a full oxygen E-cylinder?",
    acceptedAnswers: [
      "625",
      "625 liters",
      "625 L",
      "625L",
    ],
    rationale: "A full oxygen E-cylinder at 2200 psi contains approximately 625 liters of gaseous oxygen. This value, combined with the cylinder factor of 0.28, is essential for calculating remaining supply time during emergencies.",
    metadata: { topic: "E-Cylinders", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["oxygen", "E-cylinder", "volume", "recall"] }
  },

  // ── boa-node11-ads-020 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-020",
    type: "short",
    scene: null,
    prompt: "What is the approximate pressure in psi of a full oxygen E-cylinder?",
    acceptedAnswers: [
      "2200",
      "2200 psi",
      "2,200",
      "2,200 psi",
    ],
    rationale: "A full oxygen E-cylinder is pressurized to approximately 2200 psi (pounds per square inch). Because oxygen is stored entirely as compressed gas, this pressure decreases linearly as the cylinder empties.",
    metadata: { topic: "E-Cylinders", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["oxygen", "E-cylinder", "pressure", "recall"] }
  },

  // ── boa-node11-ads-021 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-021",
    type: "mcq",
    scene: null,
    prompt: "During a case, the N2O Bourdon gauge suddenly begins to drop from 750 psi. What does this indicate about the cylinder contents?",
    setup: "",
    ans: [
      { t: "All liquid N2O has vaporized and roughly 75 percent of the total supply is already gone", ok: true },
      { t: "The cylinder has just begun to empty and approximately 75 percent of the supply remains", ok: false },
      { t: "The first-stage regulator is malfunctioning and should be replaced before continuing", ok: false },
      { t: "Ambient temperature has dropped below the critical temperature of nitrous oxide gas", ok: false },
    ],
    rationale: "N2O pressure drops only after all liquid has vaporized. At that point, approximately 75% of the original contents have been used, leaving only ~25% as compressed gas. This is not the start of emptying, not a regulator malfunction, and temperature dropping below 36.5°C (N2O critical temp) would not cause a sudden gauge drop in clinical settings.",
    metadata: { topic: "E-Cylinders", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["nitrous oxide", "pressure drop", "clinical monitoring"] }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPRESSED GAS SAFETY (8 questions: 022-029)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── boa-node11-ads-022 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-022",
    type: "mcq",
    scene: null,
    prompt: "Which answer correctly matches each medical gas to its designated cylinder color in the United States?",
    setup: "",
    ans: [
      { t: "Oxygen is green, nitrous oxide is blue, and medical air is yellow", ok: true },
      { t: "Oxygen is blue, nitrous oxide is green, and medical air is yellow", ok: false },
      { t: "Oxygen is green, nitrous oxide is yellow, and medical air is blue", ok: false },
      { t: "Oxygen is yellow, nitrous oxide is blue, and medical air is green", ok: false },
    ],
    rationale: "US color coding standards designate green for oxygen, blue for nitrous oxide, and yellow for medical air. Confusing these colors could lead to wrong-gas administration. Nitrogen is black, helium is brown, and CO2 is gray — but these are not among the choices.",
    metadata: { topic: "Compressed Gas Safety", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["color coding", "gas identification", "safety standards"] }
  },

  // ── boa-node11-ads-023 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-023",
    type: "mcq",
    scene: null,
    prompt: "The Diameter Index Safety System (DISS) prevents misconnection of gas supplies at which location on the anesthesia machine?",
    setup: "",
    ans: [
      { t: "At the pipeline inlet where wall hoses connect to the machine", ok: true },
      { t: "At the hanger yoke where E-cylinders mount to the machine", ok: false },
      { t: "At the common gas outlet where the circuit attaches to flow", ok: false },
      { t: "At the vaporizer port where agent-specific filling occurs", ok: false },
    ],
    rationale: "DISS uses gas-specific diameter fittings for pipeline (wall) connections at the intermediate pressure system. The hanger yoke uses the Pin Index Safety System (PISS). The common gas outlet and vaporizer filling ports use different proprietary connection systems.",
    metadata: { topic: "Compressed Gas Safety", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["DISS", "pipeline connections", "safety systems"] }
  },

  // ── boa-node11-ads-024 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-024",
    type: "mcq",
    scene: null,
    prompt: "The Pin Index Safety System (PISS) prevents incorrect gas connections at which location on the anesthesia machine?",
    setup: "",
    ans: [
      { t: "At the hanger yoke where E-cylinders attach to the machine body", ok: true },
      { t: "At the pipeline inlet where hospital wall hoses are connected", ok: false },
      { t: "At the flowmeter bank where individual gas flows are adjusted", ok: false },
      { t: "At the breathing circuit where inspiratory tubing connects to it", ok: false },
    ],
    rationale: "PISS uses specific pin-and-hole configurations on the cylinder post and yoke to ensure only the correct gas cylinder can be mounted. Each gas has a unique pin position. Pipeline connections use DISS. Flowmeters and breathing circuits use different connection standards.",
    metadata: { topic: "Compressed Gas Safety", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["PISS", "cylinder safety", "pin configuration"] }
  },

  // ── boa-node11-ads-025 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-025",
    type: "short",
    scene: null,
    prompt: "What does DISS stand for in the context of anesthesia machine gas safety?",
    acceptedAnswers: [
      "Diameter Index Safety System",
      "diameter index safety system",
    ],
    rationale: "DISS = Diameter Index Safety System. It uses gas-specific diameter fittings to prevent misconnection of pipeline gas hoses at the intermediate pressure system. Each gas has a unique bore-and-shoulder diameter combination.",
    metadata: { topic: "Compressed Gas Safety", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["DISS", "safety acronym", "recall"] }
  },

  // ── boa-node11-ads-026 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-026",
    type: "short",
    scene: null,
    prompt: "What does PISS stand for in the context of anesthesia machine gas safety?",
    acceptedAnswers: [
      "Pin Index Safety System",
      "pin index safety system",
    ],
    rationale: "PISS = Pin Index Safety System. It uses unique pin positions on the cylinder valve and matching holes on the hanger yoke to prevent wrong-gas cylinder attachment. This system operates in the high pressure system.",
    metadata: { topic: "Compressed Gas Safety", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["PISS", "safety acronym", "recall"] }
  },

  // ── boa-node11-ads-027 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-027",
    type: "mcq",
    scene: null,
    prompt: "What is the purpose of the 100-micrometer filter located downstream of the cylinder inlet on the anesthesia machine?",
    setup: "",
    ans: [
      { t: "It traps particulate debris such as rust and metal fragments before they enter the machine", ok: true },
      { t: "It removes bacterial and viral contaminants from the compressed gas before patient delivery", ok: false },
      { t: "It separates liquid water condensate from the gas stream to prevent corrosion downstream", ok: false },
      { t: "It filters out trace anesthetic agents that may contaminate the fresh cylinder gas supply", ok: false },
    ],
    rationale: "The 100-micrometer (0.1 mm) filter captures particulate debris — rust, metal filings, and other contaminants — that may be present in compressed gas cylinders. It is not fine enough for microbial filtration (requires 0.2 micrometer). It is not designed as a water separator or anesthetic agent filter.",
    metadata: { topic: "Compressed Gas Safety", priority: "medium", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["filtration", "particulate filter", "cylinder debris"] }
  },

  // ── boa-node11-ads-028 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-028",
    type: "mcq",
    scene: null,
    prompt: "A technician discovers that the pins on a cylinder post have been removed or damaged, allowing the cylinder to fit on the wrong yoke. Which safety system has been defeated?",
    setup: "",
    ans: [
      { t: "The Pin Index Safety System, which is the only barrier preventing wrong-gas cylinder mounting", ok: true },
      { t: "The Diameter Index Safety System, which prevents wrong-gas connections at pipeline inlets", ok: false },
      { t: "The fail-safe valve system, which is designed to shut off N2O when O2 pressure falls low", ok: false },
      { t: "The oxygen ratio controller, which maintains a minimum fractional oxygen concentration", ok: false },
    ],
    rationale: "PISS uses specific pin placements to physically prevent wrong-gas cylinder-to-yoke connections. Removing or damaging pins defeats this critical safety layer. DISS protects pipeline connections, not cylinders. The fail-safe valve responds to O2 pressure loss. The O2 ratio controller manages flow ratios, not physical connections.",
    metadata: { topic: "Compressed Gas Safety", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["PISS", "safety defeat", "equipment tampering"] }
  },

  // ── boa-node11-ads-029 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-029",
    type: "mcq",
    scene: null,
    prompt: "Which statement best describes the relationship between PISS and DISS in the overall gas safety design of the anesthesia machine?",
    setup: "",
    ans: [
      { t: "PISS guards high-pressure cylinder connections; DISS guards intermediate-pressure pipeline connections", ok: true },
      { t: "DISS guards high-pressure cylinder connections; PISS guards intermediate-pressure pipeline connections", ok: false },
      { t: "Both systems guard pipeline connections but at different stages of pressure reduction in machine", ok: false },
      { t: "Both systems guard cylinder connections but use different pin configurations for each gas type", ok: false },
    ],
    rationale: "PISS operates at the high-pressure system (cylinders to yoke). DISS operates at the intermediate-pressure system (pipeline hoses to machine inlets). They are complementary systems protecting different connection points. They are not interchangeable, and neither system covers both locations.",
    metadata: { topic: "Compressed Gas Safety", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["PISS", "DISS", "complementary safety systems"] }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERMEDIATE PRESSURE SYSTEM (10 questions: 030-039)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── boa-node11-ads-030 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-030",
    type: "mcq",
    scene: null,
    prompt: "Hospital pipeline gases enter the anesthesia machine at what approximate pressure range?",
    setup: "",
    ans: [
      { t: "40 to 55 psi, which defines the intermediate pressure system operating range", ok: true },
      { t: "14 to 26 psi, which defines the low pressure system operating range precisely", ok: false },
      { t: "200 to 750 psi, matching the range of E-cylinder pressures in common use", ok: false },
      { t: "1 to 5 psi, reflecting near-atmospheric patient breathing circuit pressures", ok: false },
    ],
    rationale: "Pipeline gases are delivered at 40-55 psi, which is the operating range of the intermediate pressure system. 14-26 psi reflects second-stage regulator outputs (low pressure zone). 200-750 psi is cylinder range (high pressure). 1-5 psi is patient circuit pressure, not a supply pressure.",
    metadata: { topic: "Intermediate Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["pipeline pressure", "intermediate system", "gas supply"] }
  },

  // ── boa-node11-ads-031 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-031",
    type: "mcq",
    scene: null,
    prompt: "When the master switch is turned to the STANDBY (OFF) position, which functions remain operational?",
    setup: "",
    ans: [
      { t: "The oxygen flush valve and the auxiliary oxygen flowmeter continue to function normally", ok: true },
      { t: "The electronic vaporizer heating element and ventilator bellows continue to operate", ok: false },
      { t: "The flow control valves for all gases and the main flowmeter tubes remain active", ok: false },
      { t: "The scavenging system suction and the CO2 absorber bypass valve remain engaged", ok: false },
    ],
    rationale: "In STANDBY, oxygen flow and electrical power are generally blocked, but the O2 flush valve and auxiliary O2 flowmeter remain functional for emergency use since they connect directly to the pipeline/cylinder supply. Vaporizer heaters, main flowmeters, ventilator bellows, and scavenging suction all require the master switch to be ON.",
    metadata: { topic: "Intermediate Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["master switch", "standby mode", "emergency oxygen"] }
  },

  // ── boa-node11-ads-032 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-032",
    type: "mcq",
    scene: null,
    prompt: "What is the primary function of the fail-safe valve in the intermediate pressure system?",
    setup: "",
    ans: [
      { t: "It shuts off or proportionally reduces nitrous oxide flow when oxygen supply pressure drops", ok: true },
      { t: "It prevents delivery of a hypoxic mixture by monitoring the actual oxygen concentration", ok: false },
      { t: "It stops all gas flow to the patient circuit if the breathing circuit becomes disconnected", ok: false },
      { t: "It activates an audible alarm when the oxygen concentration falls below 21 percent level", ok: false },
    ],
    rationale: "The fail-safe valve is pressure-sensitive — it responds to falling O2 supply pressure by shutting off or reducing N2O flow. Critically, it does NOT monitor oxygen concentration or ratio. It cannot prevent hypoxic mixtures if O2 pressure is adequate but flow is set too low. It does not detect disconnects or monitor FiO2.",
    metadata: { topic: "Intermediate Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["fail-safe valve", "oxygen pressure", "N2O shutoff"] }
  },

  // ── boa-node11-ads-033 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-033",
    type: "mcq",
    scene: null,
    prompt: "A critical limitation of the fail-safe valve is that it cannot prevent a hypoxic mixture under which of the following circumstances?",
    setup: "",
    ans: [
      { t: "When oxygen supply pressure is normal but the oxygen flow control valve is set too low", ok: true },
      { t: "When both the oxygen pipeline and the oxygen E-cylinder have completely run out of supply", ok: false },
      { t: "When the nitrous oxide pipeline is delivering gas at a pressure exceeding 55 psi currently", ok: false },
      { t: "When the patient is connected to a circle breathing system with fresh soda lime canisters", ok: false },
    ],
    rationale: "The fail-safe valve is a pressure-sensing device only. If O2 supply pressure is adequate, the valve stays open even if the provider has set O2 flow dangerously low. It cannot analyze gas composition or flow ratios. Total O2 supply failure would actually trigger the valve. N2O overpressure and circuit type are not relevant to fail-safe function.",
    metadata: { topic: "Intermediate Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["fail-safe limitations", "hypoxic mixture", "clinical safety"] }
  },

  // ── boa-node11-ads-034 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-034",
    type: "mcq",
    scene: null,
    prompt: "At approximately what oxygen supply pressure does the oxygen supply failure alarm activate?",
    setup: "",
    ans: [
      { t: "Approximately 30 psi, providing early warning before complete oxygen supply loss occurs", ok: true },
      { t: "Approximately 5 psi, activating only when oxygen supply is nearly completely exhausted", ok: false },
      { t: "Approximately 55 psi, activating as soon as pipeline pressure drops below normal range", ok: false },
      { t: "Approximately 100 psi, providing warning well before any clinically significant pressure drop", ok: false },
    ],
    rationale: "The O2 supply failure alarm sounds at approximately 30 psi, below normal pipeline pressure (50 psi) but high enough to give the provider time to act before O2 is completely exhausted. 5 psi would be too late. 55 psi would trigger during normal fluctuations. 100 psi is above normal pipeline operating pressure.",
    metadata: { topic: "Intermediate Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["O2 failure alarm", "alarm threshold", "30 psi"] }
  },

  // ── boa-node11-ads-035 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-035",
    type: "mcq",
    scene: null,
    prompt: "Which characteristic of the oxygen supply failure alarm ensures it can function even during a complete electrical power failure?",
    setup: "",
    ans: [
      { t: "It is powered by the gas pressure itself, requiring no external electrical supply to sound", ok: true },
      { t: "It contains a dedicated backup battery that lasts at least 72 hours during power outages", ok: false },
      { t: "It connects to the hospital emergency power generator through a dedicated wired circuit", ok: false },
      { t: "It uses a piezoelectric crystal that generates electricity from mechanical vibration only", ok: false },
    ],
    rationale: "The O2 supply failure alarm is pneumatically powered — it uses stored gas pressure to drive the audible alarm, making it independent of electrical supply. This is a critical safety feature ensuring alarm function even during complete power failure. It does not rely on batteries, generators, or piezoelectric mechanisms.",
    metadata: { topic: "Intermediate Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["O2 failure alarm", "pneumatic alarm", "power independence"] }
  },

  // ── boa-node11-ads-036 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-036",
    type: "multi",
    scene: null,
    prompt: "Which of the following are true limitations of the fail-safe valve? (Select TWO)",
    choices: [
      "It cannot detect a wrong gas connected to the oxygen pipeline inlet",
      "It cannot prevent hypoxia when O2 pressure is normal but O2 flow is set low",
      "It cannot function if the master switch is in the ON position during use",
      "It cannot activate unless the N2O cylinder is mounted on the machine",
      "It cannot operate without an intact electrical power supply to the machine",
    ],
    correctAnswers: [
      "It cannot detect a wrong gas connected to the oxygen pipeline inlet",
      "It cannot prevent hypoxia when O2 pressure is normal but O2 flow is set low",
    ],
    selectCount: 2,
    rationale: "The fail-safe valve senses only O2 supply pressure. If a wrong gas (e.g., N2) is connected to the O2 pipeline, pressure will be adequate and the valve stays open, passing the wrong gas. Similarly, if O2 pressure is normal but the provider sets O2 flow too low, the valve cannot intervene. It functions regardless of master switch position, does not require N2O to be mounted, and is pneumatic (no electricity needed).",
    metadata: { topic: "Intermediate Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["fail-safe limitations", "wrong gas", "pressure-only sensing"] }
  },

  // ── boa-node11-ads-037 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-037",
    type: "mcq",
    scene: null,
    prompt: "Why is the term 'fail-safe' considered misleading when applied to the oxygen pressure failure device?",
    setup: "",
    ans: [
      { t: "It implies the device prevents all hypoxic mixtures, but it only responds to O2 pressure loss", ok: true },
      { t: "It implies the device can fail, when in reality it has redundant backup systems in all cases", ok: false },
      { t: "It implies the device works automatically, but it actually requires manual activation by staff", ok: false },
      { t: "It implies the device is present on all machines, but only modern machines actually include it", ok: false },
    ],
    rationale: "The name 'fail-safe' misleadingly suggests complete protection against hypoxic delivery. In reality, the device only responds to oxygen supply pressure loss. It cannot detect improper flow settings, wrong-gas pipeline connections, or actual delivered oxygen concentration. It does have limitations, works automatically, and is present on all modern machines.",
    metadata: { topic: "Intermediate Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["fail-safe misnomer", "safety misconceptions", "critical thinking"] }
  },

  // ── boa-node11-ads-038 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-038",
    type: "mcq",
    scene: null,
    prompt: "During a pipeline crossover incident where nitrogen is mistakenly connected to the oxygen wall outlet, how would the fail-safe valve respond?",
    setup: "",
    ans: [
      { t: "It would remain open because adequate pressure is present at the oxygen inlet port", ok: true },
      { t: "It would close immediately because it can detect the wrong gas composition flowing", ok: false },
      { t: "It would trigger the oxygen supply failure alarm at 30 psi to alert the provider", ok: false },
      { t: "It would shut off nitrous oxide flow because the wrong gas caused a pressure imbalance", ok: false },
    ],
    rationale: "The fail-safe valve senses only pressure, not gas identity. Nitrogen at adequate pressure (~50 psi) would satisfy the valve's pressure requirement, and it would remain open — allowing N2O to flow alongside nitrogen, potentially delivering a hypoxic mixture. This scenario represents a critical limitation of the fail-safe system. The valve would not detect wrong gas, would not trigger the alarm, and would not shut off N2O.",
    metadata: { topic: "Intermediate Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["pipeline crossover", "fail-safe limitation", "wrong gas scenario"] }
  },

  // ── boa-node11-ads-039 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-039",
    type: "mcq",
    scene: null,
    prompt: "Which device in the intermediate pressure system is specifically designed to maintain a minimum oxygen-to-nitrous-oxide flow ratio?",
    setup: "",
    ans: [
      { t: "The oxygen ratio controller, also called the proportioning system on the machine", ok: true },
      { t: "The fail-safe valve, which shuts off N2O when O2 supply pressure drops low enough", ok: false },
      { t: "The second-stage regulator, which reduces gas pressure before entering flowmeters", ok: false },
      { t: "The oxygen supply failure alarm, which sounds when O2 pressure falls below 30 psi", ok: false },
    ],
    rationale: "The oxygen ratio controller (proportioning system) mechanically links O2 and N2O flow controls to maintain a minimum O2 concentration (usually ~25%). Unlike the fail-safe valve (pressure-only), this device actually monitors flow ratios. The second-stage regulator only reduces pressure. The O2 alarm only alerts to pressure loss.",
    metadata: { topic: "Intermediate Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["proportioning system", "O2 ratio controller", "hypoxia prevention"] }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OXYGEN FLUSH VALVE (5 questions: 040-044)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── boa-node11-ads-040 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-040",
    type: "mcq",
    scene: null,
    prompt: "The oxygen flush valve delivers pure oxygen at what approximate flow rate, and which components does it bypass?",
    setup: "",
    ans: [
      { t: "35 to 75 L/min, bypassing both the flowmeters and the vaporizers completely", ok: true },
      { t: "10 to 15 L/min, bypassing only the vaporizers but flowing through the flowmeters", ok: false },
      { t: "35 to 75 L/min, flowing through both the flowmeters and the vaporizers normally", ok: false },
      { t: "100 to 150 L/min, bypassing the flowmeters but flowing through all the vaporizers", ok: false },
    ],
    rationale: "The O2 flush valve delivers 35-75 L/min of pure oxygen directly to the common gas outlet, completely bypassing both vaporizers and flowmeters. This is critical because it means flush dilutes any anesthetic agent in the circuit. It does not pass through flowmeters or vaporizers. 100-150 L/min is too high; 10-15 L/min is too low.",
    metadata: { topic: "Oxygen Flush Valve", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["O2 flush", "flow rate", "vaporizer bypass"] }
  },

  // ── boa-node11-ads-041 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-041",
    type: "mcq",
    scene: null,
    prompt: "Why is the oxygen flush valve button designed with a recessed configuration?",
    setup: "",
    ans: [
      { t: "To prevent accidental activation from objects resting on or bumping the machine", ok: true },
      { t: "To allow the provider to locate it by touch when wearing surgical gloves easily", ok: false },
      { t: "To reduce the force needed to activate it during a cardiopulmonary emergency event", ok: false },
      { t: "To enable one-handed operation while the other hand manages the airway of patient", ok: false },
    ],
    rationale: "The recessed design prevents inadvertent activation, which could cause barotrauma from high-flow oxygen or dilute anesthetic concentration. While tactile identification is a secondary benefit, the primary design purpose is preventing accidental engagement. It does not reduce activation force and is not specifically designed for one-handed operation.",
    metadata: { topic: "Oxygen Flush Valve", priority: "medium", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["O2 flush", "recessed button", "safety design"] }
  },

  // ── boa-node11-ads-042 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-042",
    type: "mcq",
    scene: null,
    prompt: "During mechanical ventilation, inadvertent activation of the oxygen flush valve poses the greatest risk of which complication?",
    setup: "",
    ans: [
      { t: "Pulmonary barotrauma from delivering 35-75 L/min into a closed breathing circuit system", ok: true },
      { t: "Severe bronchospasm from the sudden delivery of cold, dry oxygen gas to the airway", ok: false },
      { t: "Anesthetic overdose from the flush valve concentrating vaporizer output to the patient", ok: false },
      { t: "Complete circuit disconnection from the high-pressure surge at the common gas outlet", ok: false },
    ],
    rationale: "During mechanical ventilation, the patient circuit is essentially closed. Flushing 35-75 L/min into a closed circuit can rapidly increase airway pressure, causing pulmonary barotrauma. The flush bypasses (not concentrates) vaporizers, so anesthetic overdose is impossible. Bronchospasm and circuit disconnection are not primary risks of flush activation.",
    metadata: { topic: "Oxygen Flush Valve", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["O2 flush", "barotrauma", "ventilation hazard"] }
  },

  // ── boa-node11-ads-043 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-043",
    type: "mcq",
    scene: null,
    prompt: "A provider uses the oxygen flush valve during an inhalation anesthetic case. What effect does this have on the anesthetic concentration being delivered?",
    setup: "",
    ans: [
      { t: "It significantly dilutes the anesthetic because flush oxygen bypasses the vaporizer", ok: true },
      { t: "It has no effect on anesthetic concentration since the vaporizer remains active", ok: false },
      { t: "It increases anesthetic concentration by forcing more carrier gas through the vaporizer", ok: false },
      { t: "It converts liquid anesthetic to gas by the high-velocity oxygen flow through chamber", ok: false },
    ],
    rationale: "Since the flush valve delivers pure O2 directly to the common gas outlet, bypassing the vaporizer, it dilutes whatever anesthetic concentration was present in the breathing circuit. This can cause unintended lightening of anesthesia. The flush does not pass through the vaporizer, so it cannot increase agent concentration or vaporize liquid agent.",
    metadata: { topic: "Oxygen Flush Valve", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["O2 flush", "anesthetic dilution", "vaporizer bypass"] }
  },

  // ── boa-node11-ads-044 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-044",
    type: "mcq",
    scene: null,
    prompt: "Which statement about oxygen flush valve operation is correct regarding the master switch position?",
    setup: "",
    ans: [
      { t: "The flush valve works regardless of whether the master switch is ON or in STANDBY", ok: true },
      { t: "The flush valve only works when the master switch is turned fully to the ON position", ok: false },
      { t: "The flush valve only works when the master switch is placed in the STANDBY position", ok: false },
      { t: "The flush valve requires both the master switch ON and a connected pipeline to work", ok: false },
    ],
    rationale: "The O2 flush valve connects directly to the oxygen supply (pipeline or cylinder) and operates independently of the master switch. This ensures emergency O2 is always available. It does not require the switch to be ON, does not require STANDBY specifically, and does not require both conditions to be met simultaneously.",
    metadata: { topic: "Oxygen Flush Valve", priority: "medium", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["O2 flush", "master switch independence", "emergency oxygen"] }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FLOW CONTROL VALVES & FLOWMETERS (6 questions: 045-050)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── boa-node11-ads-045 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-045",
    type: "mcq",
    scene: null,
    prompt: "The oxygen flow control knob has a unique physical design compared to other gas knobs. Which feature distinguishes it?",
    setup: "",
    ans: [
      { t: "It is fluted and projects further than other knobs for tactile identification", ok: true },
      { t: "It is painted green and has a smaller diameter than all the other gas knobs", ok: false },
      { t: "It rotates clockwise to increase flow, opposite to all the other gas control knobs", ok: false },
      { t: "It requires two hands to operate as an additional safety measure against errors", ok: false },
    ],
    rationale: "The O2 flow control knob is physically distinct — it is fluted (ridged) and larger/more prominent than other gas knobs, allowing tactile identification even without looking. All gas knobs turn counterclockwise (CCW) to increase flow. The O2 knob is not distinguished by color alone, rotation direction, or two-handed operation requirements.",
    metadata: { topic: "Flow Control Valves", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["O2 knob", "fluted design", "tactile identification"] }
  },

  // ── boa-node11-ads-046 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-046",
    type: "mcq",
    scene: null,
    prompt: "In which direction must a flow control valve be turned to increase gas flow, and in which direction to decrease it?",
    setup: "",
    ans: [
      { t: "Counterclockwise to increase flow, and clockwise to decrease flow through valve", ok: true },
      { t: "Clockwise to increase flow, and counterclockwise to decrease flow through valve", ok: false },
      { t: "Counterclockwise to increase flow, and also counterclockwise to decrease the flow", ok: false },
      { t: "The direction varies depending on which gas is being controlled on the machine", ok: false },
    ],
    rationale: "All flow control valves on the anesthesia machine follow the standard convention: counterclockwise (CCW) opens/increases flow, clockwise (CW) closes/decreases flow. This is consistent across all gases and is the same 'lefty-loosey, righty-tighty' convention used universally. The direction does not vary by gas type.",
    metadata: { topic: "Flow Control Valves", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["flow control", "CCW increase", "CW decrease"] }
  },

  // ── boa-node11-ads-047 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-047",
    type: "mcq",
    scene: null,
    prompt: "On a standard anesthesia machine with multiple flowmeter tubes, what is the correct left-to-right sequence, and why is this arrangement important?",
    setup: "",
    ans: [
      { t: "N2O, then air, then O2 — placing O2 downstream prevents hypoxic dilution from leaks", ok: true },
      { t: "O2, then air, then N2O — placing O2 upstream maximizes total fresh gas flow delivery", ok: false },
      { t: "Air, then O2, then N2O — placing air first ensures adequate nitrogen delivery always", ok: false },
      { t: "The sequence is arbitrary and varies by manufacturer without any safety significance", ok: false },
    ],
    rationale: "Oxygen is positioned downstream (rightmost) so that if a leak occurs in an upstream flowmeter tube, the leaked gas is a less critical gas (N2O or air), and O2 enters the common manifold last, closest to the outlet. This prevents unintended dilution of O2 by a leaking upstream tube. The sequence is not arbitrary — it is a deliberate safety design.",
    metadata: { topic: "Flow Control Valves", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["flowmeter sequence", "O2 downstream", "safety design"] }
  },

  // ── boa-node11-ads-048 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-048",
    type: "mcq",
    scene: null,
    prompt: "When reading a Thorpe tube flowmeter, where should the provider read the flow rate for a ball-type float versus a tapered-type float?",
    setup: "",
    ans: [
      { t: "Read at the center of the ball float and at the top of the tapered float indicator", ok: true },
      { t: "Read at the top of the ball float and at the center of the tapered float indicator", ok: false },
      { t: "Read at the bottom of both float types for consistent measurement across all gases", ok: false },
      { t: "Read at the top of both float types since both floats displace gas in the same way", ok: false },
    ],
    rationale: "For ball floats, the reading is taken at the center (equator) of the ball. For tapered (bobbin/skirted) floats, the reading is taken at the top edge of the float. Reading at the wrong position introduces significant measurement error. The reading positions differ because of the different geometries of each float type.",
    metadata: { topic: "Flow Control Valves", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["flowmeter reading", "ball float", "tapered float"] }
  },

  // ── boa-node11-ads-049 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-049",
    type: "mcq",
    scene: null,
    prompt: "The auxiliary (emergency) oxygen flowmeter on the anesthesia machine has which unique operational characteristic?",
    setup: "",
    ans: [
      { t: "It functions even when the master switch is in the STANDBY or OFF position", ok: true },
      { t: "It delivers oxygen at higher flow rates than the main flowmeter can achieve", ok: false },
      { t: "It connects directly to the vaporizer to maintain anesthetic during emergencies", ok: false },
      { t: "It bypasses the pressure regulators and delivers gas at full cylinder pressure", ok: false },
    ],
    rationale: "The auxiliary O2 flowmeter connects directly to the O2 supply, bypassing the master switch, ensuring emergency O2 delivery even when the machine is in STANDBY. It does not deliver higher flows than the main flowmeter, does not connect to vaporizers, and does not bypass pressure regulators (gas is still regulated).",
    metadata: { topic: "Flow Control Valves", priority: "medium", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["auxiliary flowmeter", "emergency oxygen", "master switch bypass"] }
  },

  // ── boa-node11-ads-050 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-050",
    type: "short",
    scene: null,
    prompt: "In which direction do you turn a flow control valve to increase gas flow: clockwise or counterclockwise?",
    acceptedAnswers: [
      "counterclockwise",
      "Counterclockwise",
      "CCW",
      "counter-clockwise",
      "Counter-clockwise",
    ],
    rationale: "All flow control valves on the anesthesia machine open (increase flow) when turned counterclockwise (CCW). This follows the universal convention of 'lefty-loosey' for opening valves.",
    metadata: { topic: "Flow Control Valves", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["flow control", "valve direction", "recall"] }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LOW PRESSURE SYSTEM (4 questions: 051-054)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── boa-node11-ads-051 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-051",
    type: "mcq",
    scene: null,
    prompt: "The low pressure system of the anesthesia machine begins at which point and ends where?",
    setup: "",
    ans: [
      { t: "It begins downstream of the flow control valves and ends at the common gas outlet", ok: true },
      { t: "It begins at the pipeline inlet connections and ends at the second-stage regulators", ok: false },
      { t: "It begins at the E-cylinder hanger yoke and ends at the first-stage pressure regulator", ok: false },
      { t: "It begins at the breathing circuit and ends at the patient endotracheal tube connector", ok: false },
    ],
    rationale: "The low pressure system encompasses everything downstream of the flow control valves — including vaporizers, the common manifold, and the common gas outlet (also called the fresh gas supply tube connection). Pipeline inlets and regulators are in the intermediate system. The hanger yoke is in the high pressure system. The breathing circuit is external to the machine's pneumatic systems.",
    metadata: { topic: "Low Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["low pressure system", "boundaries", "common gas outlet"] }
  },

  // ── boa-node11-ads-052 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-052",
    type: "multi",
    scene: null,
    prompt: "Which of the following components are located within the low pressure system? (Select THREE)",
    choices: [
      "Concentration-calibrated vaporizers for volatile agents",
      "Common gas outlet connecting to the breathing circuit",
      "Fresh gas supply tube delivering mixed gas to circuit",
      "First-stage pressure regulators for cylinder gas supply",
      "Pipeline inlet connections with DISS safety fittings",
    ],
    correctAnswers: [
      "Concentration-calibrated vaporizers for volatile agents",
      "Common gas outlet connecting to the breathing circuit",
      "Fresh gas supply tube delivering mixed gas to circuit",
    ],
    selectCount: 3,
    rationale: "Vaporizers, the common gas outlet, and the fresh gas supply tube are all downstream of the flow control valves in the low pressure system. First-stage regulators are in the high pressure system. Pipeline inlets with DISS fittings are in the intermediate pressure system.",
    metadata: { topic: "Low Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["low pressure components", "vaporizers", "common gas outlet"] }
  },

  // ── boa-node11-ads-053 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-053",
    type: "mcq",
    scene: null,
    prompt: "Why is the low pressure system considered the most vulnerable to leaks during the machine checkout process?",
    setup: "",
    ans: [
      { t: "It operates at near-atmospheric pressure where small leaks can entrain room air undetected", ok: true },
      { t: "It contains the highest pressures on the machine making blowout failures most common", ok: false },
      { t: "It has the most complex electronic components that are prone to seal degradation rapidly", ok: false },
      { t: "It is the oldest section of the machine and receives the least maintenance attention now", ok: false },
    ],
    rationale: "The low pressure system operates near atmospheric pressure. At these low pressures, small leaks may not produce audible hissing and can entrain room air, diluting anesthetic and oxygen delivery. High pressures are in the high pressure system. The low pressure system is primarily pneumatic, not electronic. Age and maintenance frequency are not defining characteristics.",
    metadata: { topic: "Low Pressure System", priority: "medium", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["low pressure leaks", "checkout", "vulnerability"] }
  },

  // ── boa-node11-ads-054 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-054",
    type: "mcq",
    scene: null,
    prompt: "What is the function of the common gas outlet on the anesthesia machine?",
    setup: "",
    ans: [
      { t: "It is the final exit point where the mixed fresh gas leaves the machine for the circuit", ok: true },
      { t: "It is the point where pipeline gases first enter the machine from the hospital wall unit", ok: false },
      { t: "It is the connection where scavenging tubing attaches to remove waste anesthetic gases", ok: false },
      { t: "It is the port where the oxygen analyzer sensor is mounted for continuous FiO2 readings", ok: false },
    ],
    rationale: "The common gas outlet is the final output of the machine's internal gas delivery pathway. Fresh gas (O2, air, N2O, and vaporized anesthetic) exits here and enters the breathing circuit via the fresh gas supply tube. Pipeline inlets, scavenging connections, and O2 analyzer ports are all separate connection points.",
    metadata: { topic: "Low Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["common gas outlet", "fresh gas delivery", "machine output"] }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VAPORIZERS (10 questions: 055-064)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── boa-node11-ads-055 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-055",
    type: "mcq",
    scene: null,
    prompt: "Modern variable-bypass vaporizers split incoming fresh gas flow so that a small percentage enters the vaporizing chamber. Approximately what fraction of total flow is directed through the chamber at typical clinical settings?",
    setup: "",
    ans: [
      { t: "Approximately 20 percent of total flow passes through the vaporizing chamber", ok: true },
      { t: "Approximately 80 percent of total flow passes through the vaporizing chamber", ok: false },
      { t: "Approximately 50 percent of total flow passes through the vaporizing chamber", ok: false },
      { t: "Approximately 5 percent of total flow passes through the vaporizing chamber", ok: false },
    ],
    rationale: "In a variable-bypass vaporizer, the concentration dial adjusts a splitting valve that directs roughly 20% of fresh gas through the vaporizing chamber (where it becomes saturated with agent) and ~80% through the bypass. The two streams rejoin to produce the desired output concentration. 80% through the chamber would produce dangerously high concentrations. 50% and 5% are incorrect ratios.",
    metadata: { topic: "Vaporizers", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["variable-bypass", "splitting ratio", "vaporizing chamber"] }
  },

  // ── boa-node11-ads-056 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-056",
    type: "multi",
    scene: null,
    prompt: "Which of the following are characteristics of modern variable-bypass vaporizers? (Select FOUR)",
    choices: [
      "Agent-specific calibration for a single volatile anesthetic",
      "Flow-over design where gas passes over liquid agent surface",
      "Temperature compensation to maintain consistent output",
      "Heated pressurized chamber requiring electrical power supply",
      "Keyed filling system to prevent incorrect agent filling",
      "Universal compatibility with any volatile anesthetic agent",
    ],
    correctAnswers: [
      "Agent-specific calibration for a single volatile anesthetic",
      "Flow-over design where gas passes over liquid agent surface",
      "Temperature compensation to maintain consistent output",
      "Keyed filling system to prevent incorrect agent filling",
    ],
    selectCount: 4,
    rationale: "Modern variable-bypass vaporizers are agent-specific, flow-over, temperature-compensated, and have keyed filling systems. The heated pressurized chamber describes the desflurane Tec 6 vaporizer, which is NOT a variable-bypass design. Universal compatibility would be dangerous given different vapor pressures and potencies of agents.",
    metadata: { topic: "Vaporizers", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["vaporizer characteristics", "agent-specific", "temperature compensation"] }
  },

  // ── boa-node11-ads-057 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-057",
    type: "mcq",
    scene: null,
    prompt: "Why does desflurane require a specially heated, pressurized vaporizer (Tec 6) rather than a standard variable-bypass design?",
    setup: "",
    ans: [
      { t: "Desflurane has a boiling point near room temperature, making variable-bypass output unpredictable", ok: true },
      { t: "Desflurane has an extremely high boiling point requiring active heating to vaporize any agent", ok: false },
      { t: "Desflurane is chemically unstable at room temperature and must be heated to prevent breakdown", ok: false },
      { t: "Desflurane has a very low MAC value requiring precise metering impossible in bypass designs", ok: false },
    ],
    rationale: "Desflurane's boiling point is 22.8°C — near room temperature. In a standard variable-bypass vaporizer, small temperature changes could cause unpredictable boiling and wildly inconsistent output. The Tec 6 heats desflurane to 39°C under 2 atm pressure, creating a controlled vapor that is then precisely metered. Desflurane does not have a high boiling point, is not chemically unstable, and actually has one of the highest MAC values (6.0%).",
    metadata: { topic: "Vaporizers", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["desflurane", "Tec 6", "heated vaporizer", "boiling point"] }
  },

  // ── boa-node11-ads-058 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-058",
    type: "mcq",
    scene: null,
    prompt: "What is the purpose of wicks and baffles inside the vaporizing chamber of a variable-bypass vaporizer?",
    setup: "",
    ans: [
      { t: "They increase the surface area for gas-liquid contact, improving vaporization efficiency", ok: true },
      { t: "They filter particulate contamination from the liquid anesthetic before it vaporizes", ok: false },
      { t: "They regulate the temperature inside the chamber by absorbing excess thermal energy", ok: false },
      { t: "They prevent liquid anesthetic from splashing out through the gas outlet during tipping", ok: false },
    ],
    rationale: "Wicks draw liquid agent upward by capillary action, and baffles create tortuous gas pathways — both dramatically increase the surface area of gas-liquid contact, ensuring the gas passing through the chamber becomes fully saturated with agent vapor. They do not filter particulates, do not regulate temperature (the bimetallic strip does), and while tipping is a concern, wicks and baffles are not the primary anti-tipping mechanism.",
    metadata: { topic: "Vaporizers", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["wicks", "baffles", "vaporization efficiency", "surface area"] }
  },

  // ── boa-node11-ads-059 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-059",
    type: "mcq",
    scene: null,
    prompt: "What is the purpose of the vaporizer interlock system on modern anesthesia machines?",
    setup: "",
    ans: [
      { t: "It prevents more than one vaporizer from being turned on simultaneously on machine", ok: true },
      { t: "It locks the vaporizer to the machine frame to prevent theft or unauthorized removal", ok: false },
      { t: "It seals the filling port during operation to prevent agent spills in the operating room", ok: false },
      { t: "It connects the vaporizer output to the oxygen analyzer for real-time concentration data", ok: false },
    ],
    rationale: "The interlock system is a mechanical safety device that ensures only one vaporizer can be active at a time, preventing inadvertent delivery of multiple volatile agents simultaneously. It does not secure against theft, does not seal filling ports, and does not interface with the oxygen analyzer.",
    metadata: { topic: "Vaporizers", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["interlock system", "vaporizer safety", "multiple agent prevention"] }
  },

  // ── boa-node11-ads-060 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-060",
    type: "mcq",
    scene: null,
    prompt: "What is the function of the keyed filling system on agent-specific vaporizers?",
    setup: "",
    ans: [
      { t: "It uses agent-specific bottle adapters to prevent filling a vaporizer with the wrong agent", ok: true },
      { t: "It uses a digital key code that must be entered before the vaporizer will accept liquid agent", ok: false },
      { t: "It locks the concentration dial to prevent accidental changes during filling of the vaporizer", ok: false },
      { t: "It uses color-coded tubing that matches the flowmeter to ensure correct gas-agent pairing", ok: false },
    ],
    rationale: "Keyed filling systems use physically distinct bottle adapters that only fit the corresponding vaporizer — for example, a sevoflurane bottle adapter cannot physically connect to an isoflurane vaporizer. There are no digital codes involved. The system prevents wrong-agent filling, not dial locking. Color-coded tubing is not part of the filling system.",
    metadata: { topic: "Vaporizers", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["keyed filling", "agent-specific", "wrong agent prevention"] }
  },

  // ── boa-node11-ads-061 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-061",
    type: "mcq",
    scene: null,
    prompt: "How does the temperature compensation mechanism in a variable-bypass vaporizer maintain consistent anesthetic output?",
    setup: "",
    ans: [
      { t: "A bimetallic strip adjusts the splitting valve to increase chamber flow as temperature drops", ok: true },
      { t: "An electric heating element maintains the vaporizing chamber at a constant preset temperature", ok: false },
      { t: "A thermoelectric cooler prevents the agent from overheating during high fresh gas flow rates", ok: false },
      { t: "A pressure relief valve opens when temperature-induced vapor pressure exceeds safe limits", ok: false },
    ],
    rationale: "Variable-bypass vaporizers use a passive bimetallic strip that expands or contracts with temperature changes. When the chamber cools (from the endothermic vaporization process), the strip adjusts to direct more gas through the chamber, maintaining output. Electric heating is used only in the Tec 6 (desflurane). Thermoelectric coolers and pressure relief valves are not part of temperature compensation.",
    metadata: { topic: "Vaporizers", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["temperature compensation", "bimetallic strip", "output consistency"] }
  },

  // ── boa-node11-ads-062 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-062",
    type: "short",
    scene: null,
    prompt: "What type of vaporizer design is used for desflurane because of its near-room-temperature boiling point?",
    acceptedAnswers: [
      "Tec 6",
      "tec 6",
      "Tec-6",
      "heated pressurized vaporizer",
      "heated vaporizer",
      "Aladin cassette",
    ],
    rationale: "The Tec 6 (or Aladin cassette system in GE machines) is a heated, pressurized vaporizer specifically designed for desflurane. It heats the agent to 39°C and pressurizes it to 2 atm, producing a controlled vapor that can be precisely metered. This design is necessary because desflurane's boiling point (22.8°C) is too close to room temperature for reliable variable-bypass vaporization.",
    metadata: { topic: "Vaporizers", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Tec 6", "desflurane", "heated vaporizer", "recall"] }
  },

  // ── boa-node11-ads-063 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-063",
    type: "mcq",
    scene: null,
    prompt: "If a provider accidentally fills a sevoflurane vaporizer with isoflurane, what is the most likely clinical consequence?",
    setup: "",
    ans: [
      { t: "The delivered concentration will differ from the dial setting because of different vapor pressures", ok: true },
      { t: "The vaporizer will immediately malfunction and stop producing any vapor output at all", ok: false },
      { t: "The machine will detect the error and automatically shut down the vaporizer for safety", ok: false },
      { t: "There will be no clinical consequence because all volatile agents have identical vapor pressures", ok: false },
    ],
    rationale: "Each volatile agent has a unique vapor pressure. A vaporizer calibrated for sevoflurane's vapor pressure (160 mmHg at 20°C) will produce inaccurate output when filled with isoflurane (240 mmHg at 20°C), potentially delivering a higher-than-intended concentration. The vaporizer will still function mechanically. Machines cannot detect wrong-agent filling. Volatile agents absolutely do not share identical vapor pressures.",
    metadata: { topic: "Vaporizers", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["wrong agent filling", "vapor pressure mismatch", "clinical error"] }
  },

  // ── boa-node11-ads-064 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-064",
    type: "mcq",
    scene: null,
    prompt: "In a variable-bypass vaporizer, what happens to the gas stream that does NOT enter the vaporizing chamber?",
    setup: "",
    ans: [
      { t: "It flows through the bypass channel and reunites with vaporized gas at the outlet", ok: true },
      { t: "It is vented to the scavenging system as excess gas that is not needed anymore", ok: false },
      { t: "It recirculates through the flowmeter tubes to maintain accurate flow measurements", ok: false },
      { t: "It is stored in the reservoir bag until the vaporizing chamber needs additional flow", ok: false },
    ],
    rationale: "In a variable-bypass design, the concentration dial splits fresh gas into two streams: ~20% enters the vaporizing chamber (becoming saturated with agent), and ~80% bypasses the chamber entirely. The two streams rejoin at the vaporizer outlet, producing the desired concentration. Bypass gas is not vented, recirculated, or stored.",
    metadata: { topic: "Vaporizers", priority: "medium", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["bypass channel", "gas splitting", "vaporizer design"] }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BREATHING SYSTEMS CLASSIFICATION (8 questions: 065-072)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── boa-node11-ads-065 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-065",
    type: "mcq",
    scene: null,
    prompt: "Which breathing system classification is most commonly used for adult anesthesia in modern operating rooms?",
    setup: "",
    ans: [
      { t: "Semi-closed circle system with CO2 absorption and partial rebreathing of gases", ok: true },
      { t: "Closed circle system with complete rebreathing and no excess gas venting at all", ok: false },
      { t: "Open system with no reservoir bag and no rebreathing of exhaled gases by patient", ok: false },
      { t: "Semi-open Mapleson D system with high fresh gas flows preventing all rebreathing", ok: false },
    ],
    rationale: "The semi-closed circle system is the standard for adult anesthesia. It allows partial rebreathing with CO2 absorption, conserving anesthetic agent and moisture. A truly closed system (no gas venting) is uncommon and technically demanding because FGF must exactly match uptake. Open systems are historical. Mapleson circuits are used for specific situations, not as the standard adult setup.",
    metadata: { topic: "Breathing Systems", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["semi-closed circle", "most common", "adult anesthesia"] }
  },

  // ── boa-node11-ads-066 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-066",
    type: "mcq",
    scene: null,
    prompt: "Why is a truly closed circle breathing system considered uncommon and potentially dangerous in routine clinical practice?",
    setup: "",
    ans: [
      { t: "Fresh gas flow must precisely match patient uptake, and any mismatch risks hypoxia or hypercarbia", ok: true },
      { t: "The CO2 absorbent is not compatible with closed-system flows and fails to remove carbon dioxide", ok: false },
      { t: "Closed systems generate excessive heat from the absorber that can burn the patient's airway", ok: false },
      { t: "The unidirectional valves cannot maintain proper gas flow direction at very low flow rates", ok: false },
    ],
    rationale: "In a closed system, no gas escapes through the APL valve — so fresh gas flow must exactly replace what the patient absorbs (O2 consumption + anesthetic uptake). Any mismatch can cause hypoxia (too little O2) or hypercarbia (inadequate CO2 removal). CO2 absorbent works fine at low flows. Heat generation is minimal and not a burn hazard. Unidirectional valves function at all clinically relevant flow rates.",
    metadata: { topic: "Breathing Systems", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["closed circuit", "dangers", "FGF matching"] }
  },

  // ── boa-node11-ads-067 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-067",
    type: "mcq",
    scene: null,
    prompt: "The Bain circuit is a modification of which Mapleson breathing system classification?",
    setup: "",
    ans: [
      { t: "Mapleson D — a coaxial design with fresh gas flowing inside the expiratory tubing", ok: true },
      { t: "Mapleson A — a Magill design optimized for controlled ventilation during general anesthesia", ok: false },
      { t: "Mapleson F — a Jackson-Rees modification designed specifically for pediatric patient use", ok: false },
      { t: "Mapleson C — a simple system with minimal dead space used only for resuscitation situations", ok: false },
    ],
    rationale: "The Bain circuit is a coaxial modification of the Mapleson D system, where the fresh gas tube runs inside the corrugated expiratory limb. Mapleson A (Magill) is a different configuration efficient for spontaneous ventilation. Mapleson F (Jackson-Rees) is the pediatric modification. Mapleson C is used for resuscitation, not related to the Bain design.",
    metadata: { topic: "Breathing Systems", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Bain circuit", "Mapleson D", "coaxial design"] }
  },

  // ── boa-node11-ads-068 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-068",
    type: "mcq",
    scene: null,
    prompt: "The Jackson-Rees modification is a variant of which Mapleson system, and for which patient population is it primarily used?",
    setup: "",
    ans: [
      { t: "Mapleson F, primarily used for pediatric patients due to low resistance and dead space", ok: true },
      { t: "Mapleson A, primarily used for adult patients requiring spontaneous ventilation support", ok: false },
      { t: "Mapleson D, primarily used for trauma patients requiring rapid sequence induction setup", ok: false },
      { t: "Mapleson B, primarily used for geriatric patients with reduced respiratory muscle strength", ok: false },
    ],
    rationale: "The Jackson-Rees modification is a Mapleson F system with an open-tailed bag, specifically designed for pediatric patients. Its low resistance and minimal dead space make it ideal for small tidal volumes. Mapleson A is for adults (Magill system). Mapleson D is the basis for the Bain circuit. Mapleson B is not commonly used and is not associated with geriatric-specific applications.",
    metadata: { topic: "Breathing Systems", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Jackson-Rees", "Mapleson F", "pediatric breathing system"] }
  },

  // ── boa-node11-ads-069 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-069",
    type: "mcq",
    scene: null,
    prompt: "Which Mapleson classification is considered most efficient for spontaneous ventilation, and what mnemonic helps remember this?",
    setup: "",
    ans: [
      { t: "Mapleson A is best for spontaneous — the mnemonic is 'A for spontaneous, D for controlled'", ok: true },
      { t: "Mapleson D is best for spontaneous — the mnemonic is 'D for spontaneous, A for controlled'", ok: false },
      { t: "Mapleson F is best for spontaneous — the mnemonic is 'F for freedom of breathing patterns'", ok: false },
      { t: "Mapleson C is best for spontaneous — the mnemonic is 'C for comfortable spontaneous flow'", ok: false },
    ],
    rationale: "Mapleson A (Magill) is the most efficient for spontaneous ventilation, requiring the lowest FGF. The mnemonic pairs A with spontaneous and D with controlled ventilation efficiency. Mapleson D (Bain) is most efficient for controlled ventilation. Mapleson F is pediatric-specific. Mapleson C is not considered most efficient for any mode.",
    metadata: { topic: "Breathing Systems", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Mapleson efficiency", "spontaneous ventilation", "mnemonic"] }
  },

  // ── boa-node11-ads-070 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-070",
    type: "short",
    scene: null,
    prompt: "What Mapleson classification is the Bain circuit?",
    acceptedAnswers: [
      "Mapleson D",
      "mapleson D",
      "D",
      "Mapleson d",
    ],
    rationale: "The Bain circuit is a Mapleson D system. It is a coaxial design where the fresh gas delivery tube runs inside the outer corrugated expiratory limb. It is most efficient for controlled (mechanical) ventilation.",
    metadata: { topic: "Breathing Systems", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Bain circuit", "Mapleson D", "recall"] }
  },

  // ── boa-node11-ads-071 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-071",
    type: "mcq",
    scene: null,
    prompt: "What defines an open breathing system in the historical classification of anesthetic delivery?",
    setup: "",
    ans: [
      { t: "No reservoir bag, no rebreathing, and unrestricted contact with the atmosphere exists", ok: true },
      { t: "A reservoir bag is present but all exhaled gas is vented through the APL valve only", ok: false },
      { t: "A CO2 absorber is used but gas flows are set high enough to prevent any rebreathing", ok: false },
      { t: "The system is open to the room air but uses a face mask with a one-way valve system", ok: false },
    ],
    rationale: "An open system (e.g., ether dripped onto gauze) has no reservoir bag, no controlled rebreathing, and complete atmospheric exposure. It is the simplest and most historical system. A reservoir bag indicates at least a semi-open system. CO2 absorbers are part of circle systems. One-way valves suggest a more organized circuit design.",
    metadata: { topic: "Breathing Systems", priority: "medium", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["open system", "historical", "classification"] }
  },

  // ── boa-node11-ads-072 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-072",
    type: "mcq",
    scene: null,
    prompt: "Semi-open breathing systems (Mapleson A through F) share which common characteristic that distinguishes them from circle systems?",
    setup: "",
    ans: [
      { t: "They lack a CO2 absorber and rely on fresh gas flow to prevent rebreathing of CO2", ok: true },
      { t: "They lack a reservoir bag and rely entirely on continuous fresh gas flow for breathing", ok: false },
      { t: "They lack unidirectional valves and allow bidirectional gas flow in all circuit limbs", ok: false },
      { t: "They lack a scavenging connection and vent all waste gases directly into room air", ok: false },
    ],
    rationale: "Mapleson systems (semi-open) do not contain CO2 absorbers. They prevent rebreathing by using adequate fresh gas flow rates to wash CO2-laden gas out of the circuit. Most Mapleson systems have reservoir bags (except open-tailed modifications). They may have valves (APL). They can connect to scavenging. The defining absence is the CO2 absorber.",
    metadata: { topic: "Breathing Systems", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Mapleson systems", "no absorber", "FGF dependent"] }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CIRCLE SYSTEM COMPONENTS (8 questions: 073-080)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── boa-node11-ads-073 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-073",
    type: "mcq",
    scene: null,
    prompt: "What is the critical function of unidirectional valves in the circle breathing system?",
    setup: "",
    ans: [
      { t: "They ensure gas flows in only one direction through the circuit, preventing rebreathing of CO2", ok: true },
      { t: "They regulate the total fresh gas flow entering the circuit from the common gas outlet port", ok: false },
      { t: "They control the pressure inside the breathing circuit by venting excess gas automatically", ok: false },
      { t: "They filter bacterial contamination from the exhaled gas before it reaches the CO2 absorber", ok: false },
    ],
    rationale: "Unidirectional (one-way) valves direct gas flow in a single direction around the circle — exhaled gas passes through the absorber and inspiratory gas flows to the patient. Only one valve opens at a time (inspiration opens the inspiratory valve; expiration opens the expiratory valve). They do not regulate FGF, control pressure (that is the APL valve), or filter bacteria.",
    metadata: { topic: "Circle System Components", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["unidirectional valves", "one-way flow", "CO2 prevention"] }
  },

  // ── boa-node11-ads-074 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-074",
    type: "mcq",
    scene: null,
    prompt: "During normal breathing in a circle system, how do the unidirectional valves coordinate their opening?",
    setup: "",
    ans: [
      { t: "Only one valve is open at any given time — the inspiratory during inhalation, expiratory during exhalation", ok: true },
      { t: "Both valves are open simultaneously during the transition between inspiration and expiration phases", ok: false },
      { t: "Both valves remain closed during exhalation to allow complete CO2 absorption before the next breath", ok: false },
      { t: "The inspiratory valve stays open continuously while the expiratory valve cycles with each breath", ok: false },
    ],
    rationale: "In a properly functioning circle system, only one unidirectional valve is open at a time. During inspiration, the inspiratory valve opens (expiratory closes). During expiration, the expiratory valve opens (inspiratory closes). This ensures gas flows in a single direction around the circuit. Simultaneous opening or continuous opening would defeat the purpose of directional flow.",
    metadata: { topic: "Circle System Components", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["valve coordination", "inspiration-expiration cycle", "unidirectional flow"] }
  },

  // ── boa-node11-ads-075 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-075",
    type: "mcq",
    scene: null,
    prompt: "The adjustable pressure-limiting (APL) valve is located on which limb of the circle breathing system, and what is its common alternative name?",
    setup: "",
    ans: [
      { t: "On the expiratory limb, commonly called the pop-off valve for excess gas venting", ok: true },
      { t: "On the inspiratory limb, commonly called the check valve for unidirectional gas flow", ok: false },
      { t: "Between the absorber canisters, commonly called the relief valve for pressure safety", ok: false },
      { t: "At the fresh gas inlet, commonly called the demand valve for flow-triggered delivery", ok: false },
    ],
    rationale: "The APL (pop-off) valve sits on the expiratory limb of the circle system. During spontaneous ventilation, it vents excess gas to the scavenging system, preventing excessive circuit pressure. It is not on the inspiratory limb (that would vent fresh gas), not between absorber canisters, and not at the fresh gas inlet. 'Check valve' and 'demand valve' describe different devices.",
    metadata: { topic: "Circle System Components", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["APL valve", "pop-off valve", "expiratory limb"] }
  },

  // ── boa-node11-ads-076 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-076",
    type: "multi",
    scene: null,
    prompt: "Which of the following are recognized functions of the reservoir bag in the circle breathing system? (Select THREE)",
    choices: [
      "Serves as a compliant reservoir for fresh and exhaled gas accumulation",
      "Allows visual and tactile monitoring of spontaneous breathing patterns",
      "Enables manual positive-pressure ventilation when hand squeezed",
      "Prevents circuit pressure from exceeding 60 cmH2O under normal use",
      "Filters carbon dioxide from exhaled gas before it is rebreathed",
    ],
    correctAnswers: [
      "Serves as a compliant reservoir for fresh and exhaled gas accumulation",
      "Allows visual and tactile monitoring of spontaneous breathing patterns",
      "Enables manual positive-pressure ventilation when hand squeezed",
    ],
    selectCount: 3,
    rationale: "The reservoir (breathing) bag accumulates gas between breaths, allows the provider to observe spontaneous ventilation (bag movement), and enables manual ventilation. Its compliant design limits pressure to approximately 60 cmH2O, but this is a passive safety feature of its construction rather than an active filtering or pressure-control function. CO2 absorption is performed by the soda lime canister, not the reservoir bag.",
    metadata: { topic: "Circle System Components", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["reservoir bag", "breathing bag", "functions"] }
  },

  // ── boa-node11-ads-077 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-077",
    type: "mcq",
    scene: null,
    prompt: "The compliance of the standard reservoir bag limits circuit pressure to approximately what maximum value?",
    setup: "",
    ans: [
      { t: "Approximately 60 cmH2O, providing a passive pressure safety limit in the circuit", ok: true },
      { t: "Approximately 120 cmH2O, matching the maximum ventilator pressure setting allowed", ok: false },
      { t: "Approximately 20 cmH2O, which is the normal peak inspiratory pressure during use", ok: false },
      { t: "Approximately 200 cmH2O, because the bag material is designed for high-pressure use", ok: false },
    ],
    rationale: "The reservoir bag's elastic compliance naturally limits circuit pressure to approximately 60 cmH2O — beyond this, the bag distends rather than allowing further pressure rise. This is a passive safety feature. 120 cmH2O and 200 cmH2O are dangerously high. 20 cmH2O is a typical PIP during normal ventilation, not the bag's pressure limit.",
    metadata: { topic: "Circle System Components", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["reservoir bag", "pressure limit", "60 cmH2O"] }
  },

  // ── boa-node11-ads-078 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-078",
    type: "mcq",
    scene: null,
    prompt: "What does the breathing circuit pressure gauge (airway pressure manometer) display during mechanical ventilation?",
    setup: "",
    ans: [
      { t: "Peak inspiratory pressure (PIP) generated during each mechanical breath delivery cycle", ok: true },
      { t: "The oxygen concentration percentage of inspired gas being delivered to the patient now", ok: false },
      { t: "The volume of tidal ventilation in milliliters delivered during each mechanical breath", ok: false },
      { t: "The end-tidal carbon dioxide concentration in the exhaled gas from the patient circuit", ok: false },
    ],
    rationale: "The circuit pressure gauge measures and displays the peak inspiratory pressure (PIP) during mechanical ventilation. Changes in PIP can indicate circuit obstruction, bronchospasm, pneumothorax, or disconnection. Oxygen concentration is measured by the O2 analyzer. Tidal volume is measured by spirometry. ETCO2 is measured by capnography. These are all separate monitoring devices.",
    metadata: { topic: "Circle System Components", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["pressure gauge", "PIP", "airway pressure"] }
  },

  // ── boa-node11-ads-079 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-079",
    type: "mcq",
    scene: null,
    prompt: "A stuck (incompetent) unidirectional valve in the circle system would most likely result in which clinical problem?",
    setup: "",
    ans: [
      { t: "Rebreathing of CO2-laden gas because unidirectional flow around the circuit is lost", ok: true },
      { t: "Delivery of an excessively high concentration of volatile anesthetic to the patient", ok: false },
      { t: "Complete loss of fresh gas flow from the common gas outlet into the breathing circuit", ok: false },
      { t: "Inability of the ventilator to generate adequate tidal volumes during controlled breaths", ok: false },
    ],
    rationale: "A stuck-open unidirectional valve allows gas to flow in both directions (bidirectional flow), permitting exhaled CO2 to bypass the absorber and be rebreathed. This causes hypercarbia. It would not affect anesthetic concentration from the vaporizer, would not block fresh gas flow, and would not directly impair ventilator volume delivery.",
    metadata: { topic: "Circle System Components", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["valve malfunction", "CO2 rebreathing", "hypercarbia"] }
  },

  // ── boa-node11-ads-080 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-080",
    type: "short",
    scene: null,
    prompt: "What is the common alternative name for the adjustable pressure-limiting (APL) valve?",
    acceptedAnswers: [
      "pop-off valve",
      "Pop-off valve",
      "pop off valve",
      "Pop off valve",
      "pop-off",
    ],
    rationale: "The APL valve is commonly called the 'pop-off' valve. It is located on the expiratory limb and vents excess circuit gas to the scavenging system, preventing excessive pressure buildup during spontaneous ventilation.",
    metadata: { topic: "Circle System Components", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["APL valve", "pop-off valve", "recall"] }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VENTILATORS AND BELLOWS (5 questions: 081-085)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── boa-node11-ads-081 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-081",
    type: "mcq",
    scene: null,
    prompt: "What is the standard bellows configuration on modern anesthesia ventilators, and what is its defining characteristic?",
    setup: "",
    ans: [
      { t: "Ascending (standing) bellows that rise during exhalation under the force of exhaled gas", ok: true },
      { t: "Descending (hanging) bellows that fall during exhalation under the force of gravity alone", ok: false },
      { t: "Ascending (standing) bellows that rise during inspiration driven by the ventilator piston", ok: false },
      { t: "Descending (hanging) bellows that fall during inspiration driven by a compressed gas source", ok: false },
    ],
    rationale: "Modern machines use ascending (standing) bellows as the standard. These bellows rise during exhalation as the patient's exhaled gas refills them. This upward movement during exhalation is the key characteristic. Descending bellows fall with gravity and are older designs. The bellows rise during EXhalation, not INspiration.",
    metadata: { topic: "Ventilators and Bellows", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["ascending bellows", "standing bellows", "exhalation"] }
  },

  // ── boa-node11-ads-082 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-082",
    type: "mcq",
    scene: null,
    prompt: "Why are ascending (standing) bellows considered safer than descending (hanging) bellows in anesthesia ventilators?",
    setup: "",
    ans: [
      { t: "A circuit disconnect is immediately visible because ascending bellows will fail to rise on exhalation", ok: true },
      { t: "Ascending bellows deliver higher tidal volumes and more consistent peak pressures to patients", ok: false },
      { t: "Ascending bellows do not require driving gas, eliminating the risk of barotrauma from overpressure", ok: false },
      { t: "Ascending bellows filter exhaled carbon dioxide more effectively than descending bellows designs", ok: false },
    ],
    rationale: "If the breathing circuit disconnects from the patient, ascending bellows will not refill (rise) during exhalation because no exhaled gas returns to the bellows. This provides an immediate visual cue of disconnection. Descending bellows continue to fall with gravity even when disconnected, masking the problem. Bellows type does not affect tidal volume consistency, driving gas requirements, or CO2 filtration.",
    metadata: { topic: "Ventilators and Bellows", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["disconnect detection", "ascending vs descending", "safety advantage"] }
  },

  // ── boa-node11-ads-083 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-083",
    type: "mcq",
    scene: null,
    prompt: "A patient becomes disconnected from the breathing circuit during mechanical ventilation. How would the bellows behavior differ between ascending and descending bellows designs?",
    setup: "",
    ans: [
      { t: "Ascending bellows stop rising; descending bellows continue falling normally, hiding the disconnect", ok: true },
      { t: "Both bellows types stop moving immediately, providing equally reliable disconnect detection cues", ok: false },
      { t: "Ascending bellows continue rising; descending bellows collapse completely and trigger an alarm", ok: false },
      { t: "Neither bellows type can detect a disconnection since this requires a separate pressure monitor", ok: false },
    ],
    rationale: "Ascending bellows require exhaled gas to push them upward. Without a patient connection, no exhaled gas returns, and the bellows fail to rise — an obvious visual indicator. Descending bellows fall by gravity regardless of patient connection, so they continue to move normally even when disconnected, hiding the problem. While separate monitors also detect disconnects, the bellows behavior itself differs between types.",
    metadata: { topic: "Ventilators and Bellows", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["disconnect comparison", "bellows behavior", "clinical scenario"] }
  },

  // ── boa-node11-ads-084 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-084",
    type: "short",
    scene: null,
    prompt: "What is the standard type of bellows used on modern anesthesia machines: ascending or descending?",
    acceptedAnswers: [
      "ascending",
      "Ascending",
      "ascending bellows",
      "Ascending bellows",
      "standing",
      "Standing",
      "standing bellows",
    ],
    rationale: "Ascending (standing) bellows are the standard on modern anesthesia machines. They rise during exhalation and provide an immediate visual indicator of circuit disconnection because they will fail to rise if the patient is not connected.",
    metadata: { topic: "Ventilators and Bellows", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["ascending bellows", "standard design", "recall"] }
  },

  // ── boa-node11-ads-085 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-085",
    type: "mcq",
    scene: null,
    prompt: "What is the key clinical danger of descending (hanging) bellows that led to their replacement by ascending designs?",
    setup: "",
    ans: [
      { t: "They cannot reliably detect a circuit disconnection because gravity refills them regardless", ok: true },
      { t: "They generate dangerously high airway pressures that frequently cause pneumothorax events", ok: false },
      { t: "They are incompatible with volatile anesthetic agents and degrade circuit tubing material", ok: false },
      { t: "They require significantly more driving gas than ascending bellows during routine operation", ok: false },
    ],
    rationale: "The primary danger of descending bellows is their inability to visually indicate a circuit disconnect. Because gravity pulls them down during exhalation regardless of whether exhaled gas is returning, they appear to function normally even when the patient is disconnected. This can delay recognition of a life-threatening disconnection. They do not generate higher pressures, are compatible with all agents, and driving gas requirements are similar between types.",
    metadata: { topic: "Ventilators and Bellows", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["descending bellows", "disconnect danger", "obsolete design"] }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CO2 ABSORPTION (6 questions: 086-091)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── boa-node11-ads-086 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-086",
    type: "mcq",
    scene: null,
    prompt: "What is the correct sequence of the chemical reaction by which soda lime absorbs carbon dioxide?",
    setup: "",
    ans: [
      { t: "CO2 + H2O forms carbonic acid, which reacts with hydroxides to form carbonates, water, and heat", ok: true },
      { t: "CO2 reacts directly with calcium hydroxide to form calcium carbonate and oxygen gas as a byproduct", ok: false },
      { t: "CO2 combines with sodium chloride in the absorbent to form sodium bicarbonate and hydrochloric acid", ok: false },
      { t: "CO2 is physically adsorbed onto granule surfaces without chemical change in an exothermic process", ok: false },
    ],
    rationale: "The soda lime reaction proceeds in steps: CO2 + H2O → H2CO3 (carbonic acid), then H2CO3 + Ca(OH)2/NaOH/KOH → CaCO3/Na2CO3 + H2O + heat. It is a true chemical reaction (not physical adsorption), requires water, and produces heat as a byproduct. CO2 does not react directly with Ca(OH)2 without water. Sodium chloride and hydrochloric acid are not involved.",
    metadata: { topic: "CO2 Absorption", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["soda lime chemistry", "carbonic acid", "exothermic reaction"] }
  },

  // ── boa-node11-ads-087 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-087",
    type: "mcq",
    scene: null,
    prompt: "How can a provider confirm that the CO2 absorber canister is actively functioning during a case?",
    setup: "",
    ans: [
      { t: "The canister should feel warm to the touch because the absorption reaction is exothermic", ok: true },
      { t: "The canister should feel cold to the touch because the absorption reaction is endothermic", ok: false },
      { t: "The canister should produce a clicking sound as the granules contract during CO2 binding", ok: false },
      { t: "The canister should display a constant green color regardless of the absorbent exhaustion", ok: false },
    ],
    rationale: "CO2 absorption by soda lime is exothermic — it produces heat. A warm canister indicates active CO2 absorption. A cold canister suggests the absorbent may be exhausted or there is minimal CO2 being absorbed. The reaction is not endothermic, does not produce clicking sounds, and the color change (from white to violet/purple) indicates exhaustion, not normal function.",
    metadata: { topic: "CO2 Absorption", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["canister warmth", "exothermic confirmation", "clinical assessment"] }
  },

  // ── boa-node11-ads-088 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-088",
    type: "mcq",
    scene: null,
    prompt: "What visual indicator alerts the provider that the CO2 absorbent is becoming exhausted?",
    setup: "",
    ans: [
      { t: "A pH-sensitive dye causes a color change in the absorbent granules as they are consumed", ok: true },
      { t: "The absorbent granules physically shrink in size and fall to the bottom of the canister", ok: false },
      { t: "A digital sensor on the canister displays a numerical reading of remaining absorber capacity", ok: false },
      { t: "The clear canister housing becomes opaque as chemical byproducts coat the inner walls", ok: false },
    ],
    rationale: "CO2 absorbents contain pH-sensitive indicator dyes that change color as the hydroxide bases are consumed and pH drops. For example, ethyl violet changes from white to purple in exhausted soda lime. Granules do not shrink. There are no digital sensors on standard canisters. The canister housing does not become opaque.",
    metadata: { topic: "CO2 Absorption", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["color change indicator", "absorbent exhaustion", "pH dye"] }
  },

  // ── boa-node11-ads-089 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-089",
    type: "mcq",
    scene: null,
    prompt: "What is the primary advantage of Amsorb Plus over traditional soda lime as a CO2 absorbent?",
    setup: "",
    ans: [
      { t: "It contains only calcium hydroxide and does not produce carbon monoxide or Compound A", ok: true },
      { t: "It absorbs CO2 three times faster than soda lime and lasts significantly longer per fill", ok: false },
      { t: "It eliminates the need for color-change indicators because it never becomes exhausted", ok: false },
      { t: "It is compatible with all anesthetic agents including the discontinued agent methoxyflurane", ok: false },
    ],
    rationale: "Amsorb Plus contains only calcium hydroxide (Ca(OH)2) without the strong bases (NaOH, KOH) found in traditional soda lime. This eliminates the production of carbon monoxide from desiccated absorbent and Compound A from sevoflurane degradation. It does not absorb faster, does become exhausted, and agent compatibility is not its distinguishing feature.",
    metadata: { topic: "CO2 Absorption", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Amsorb Plus", "calcium hydroxide only", "safer absorbent"] }
  },

  // ── boa-node11-ads-090 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-090",
    type: "mcq",
    scene: null,
    prompt: "Why is water essential for the CO2 absorption reaction in soda lime?",
    setup: "",
    ans: [
      { t: "Water is needed to convert CO2 to carbonic acid, the necessary first step of the reaction", ok: true },
      { t: "Water acts as a catalyst that speeds up the reaction without being consumed in process", ok: false },
      { t: "Water cools the granules and prevents thermal degradation of the calcium hydroxide base", ok: false },
      { t: "Water dissolves the carbonate end-products so they can drain out of the canister freely", ok: false },
    ],
    rationale: "The first step of CO2 absorption requires water: CO2 + H2O → H2CO3 (carbonic acid). Without water, CO2 cannot form carbonic acid and the reaction chain cannot proceed. This is why desiccated absorbent fails to absorb CO2 properly and instead produces dangerous byproducts. Water is consumed (not a catalyst), does not primarily cool granules, and carbonates remain in the granules (they do not drain).",
    metadata: { topic: "CO2 Absorption", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["water requirement", "carbonic acid formation", "desiccation risk"] }
  },

  // ── boa-node11-ads-091 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-091",
    type: "short",
    scene: null,
    prompt: "What CO2 absorbent contains only calcium hydroxide and is considered safer than traditional soda lime?",
    acceptedAnswers: [
      "Amsorb Plus",
      "Amsorb",
      "amsorb plus",
      "amsorb",
      "Amsorb+",
    ],
    rationale: "Amsorb Plus is a CO2 absorbent that contains only calcium hydroxide (Ca(OH)2), eliminating the strong bases (NaOH, KOH) present in traditional soda lime. This makes it safer because it does not produce carbon monoxide or Compound A when exposed to volatile anesthetics, even when desiccated.",
    metadata: { topic: "CO2 Absorption", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Amsorb Plus", "safer absorbent", "recall"] }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ATMOSPHERIC POLLUTION (5 questions: 092-096)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── boa-node11-ads-092 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-092",
    type: "mcq",
    scene: null,
    prompt: "According to OSHA standards, what are the maximum permissible workplace exposure limits for waste anesthetic gases in the operating room?",
    setup: "",
    ans: [
      { t: "Nitrous oxide less than 25 ppm and halogenated agents less than 2 ppm during exposure", ok: true },
      { t: "Nitrous oxide less than 50 ppm and halogenated agents less than 10 ppm during exposure", ok: false },
      { t: "Nitrous oxide less than 5 ppm and halogenated agents less than 0.5 ppm during exposure", ok: false },
      { t: "Nitrous oxide less than 100 ppm and halogenated agents less than 25 ppm during exposure", ok: false },
    ],
    rationale: "OSHA recommends N2O exposure below 25 ppm (time-weighted average) and halogenated agents below 2 ppm. These limits protect healthcare workers from chronic exposure effects including reproductive toxicity and potential hepatotoxicity. 50/10, 5/0.5, and 100/25 ppm are all incorrect values.",
    metadata: { topic: "Atmospheric Pollution", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["OSHA limits", "N2O 25 ppm", "agents 2 ppm"] }
  },

  // ── boa-node11-ads-093 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-093",
    type: "mcq",
    scene: null,
    prompt: "How many times per hour should the operating room air be exchanged to help maintain safe levels of waste anesthetic gases?",
    setup: "",
    ans: [
      { t: "A minimum of 15 air exchanges per hour is the recommended standard for all ORs", ok: true },
      { t: "A minimum of 5 air exchanges per hour is sufficient for standard-sized operating rooms", ok: false },
      { t: "A minimum of 30 air exchanges per hour is required only when using nitrous oxide gas", ok: false },
      { t: "Air exchanges are unnecessary if an active scavenging system is properly functioning now", ok: false },
    ],
    rationale: "The standard recommendation is a minimum of 15 air exchanges per hour in the OR. This ventilation rate, combined with scavenging, dilutes and removes waste anesthetic gases. 5 exchanges is insufficient. 30 is not standard. Air exchanges are still necessary even with functioning scavenging because scavenging cannot capture all leaked gases.",
    metadata: { topic: "Atmospheric Pollution", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["air exchanges", "15 per hour", "OR ventilation"] }
  },

  // ── boa-node11-ads-094 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-094",
    type: "mcq",
    scene: null,
    prompt: "What is the difference between active and passive scavenging systems for waste anesthetic gas disposal?",
    setup: "",
    ans: [
      { t: "Active systems use wall suction to remove waste gas; passive systems vent gas to the outside by tubing", ok: true },
      { t: "Active systems filter anesthetic from waste gas; passive systems release unfiltered gas into the room", ok: false },
      { t: "Active systems recycle waste gas for reuse; passive systems destroy the anesthetic molecules present", ok: false },
      { t: "Active systems require the provider to manually vent gas; passive systems are fully automated now", ok: false },
    ],
    rationale: "Active scavenging uses the hospital's central vacuum (suction) system to actively draw waste gas from the APL and ventilator relief valves. Passive scavenging relies on the slight positive pressure of waste gas to flow through tubing that vents directly to the outside of the building. Neither system filters, recycles, or destroys anesthetic. 'Active' does not mean manual.",
    metadata: { topic: "Atmospheric Pollution", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["active scavenging", "passive scavenging", "waste gas disposal"] }
  },

  // ── boa-node11-ads-095 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-095",
    type: "mcq",
    scene: null,
    prompt: "Which of the following is the most common preventable source of operating room atmospheric pollution with anesthetic gases?",
    setup: "",
    ans: [
      { t: "Sloppy anesthetic technique such as poor mask fit and failure to turn off gas flow promptly", ok: true },
      { t: "Manufacturing defects in the anesthesia machine's internal gas delivery tubing and valves", ok: false },
      { t: "Normal passive diffusion of volatile agents through the walls of the breathing circuit hoses", ok: false },
      { t: "Leakage from the CO2 absorber canister during normal operation under standard conditions", ok: false },
    ],
    rationale: "The most common source of OR pollution is sloppy technique — poor-fitting masks, leaving gas flowing when not connected to the patient, failure to use scavenging, and inadequate circuit checks. Manufacturing defects are rare. Circuit permeation is minimal. Absorber canister leaks are uncommon with proper assembly.",
    metadata: { topic: "Atmospheric Pollution", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["pollution sources", "sloppy technique", "prevention"] }
  },

  // ── boa-node11-ads-096 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-096",
    type: "short",
    scene: null,
    prompt: "What is the OSHA maximum permissible workplace exposure limit for nitrous oxide in ppm?",
    acceptedAnswers: [
      "25",
      "25 ppm",
      "<25 ppm",
      "less than 25 ppm",
    ],
    rationale: "OSHA recommends that workplace exposure to nitrous oxide not exceed 25 ppm (time-weighted average). This limit helps protect healthcare workers from chronic health effects associated with long-term N2O exposure, including reproductive and neurological toxicity.",
    metadata: { topic: "Atmospheric Pollution", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["OSHA", "N2O limit", "25 ppm", "recall"] }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEGRADATION OF ANESTHETICS (4 questions: 097-100)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── boa-node11-ads-097 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-097",
    type: "mcq",
    scene: null,
    prompt: "What dangerous byproduct is produced when volatile anesthetics interact with desiccated CO2 absorbent?",
    setup: "",
    ans: [
      { t: "Carbon monoxide, which can cause patient carboxyhemoglobinemia and impaired O2 delivery", ok: true },
      { t: "Hydrogen cyanide, which inhibits cellular respiration by binding cytochrome oxidase enzymes", ok: false },
      { t: "Nitrogen dioxide, which causes severe chemical pneumonitis and pulmonary edema in patients", ok: false },
      { t: "Sulfur dioxide, which triggers intense bronchospasm and airway inflammation upon inhalation", ok: false },
    ],
    rationale: "Desiccated (dried-out) CO2 absorbent reacts with volatile anesthetics — especially desflurane — to produce carbon monoxide (CO). CO binds hemoglobin with 200x the affinity of O2, forming carboxyhemoglobin and impairing oxygen delivery. Hydrogen cyanide, nitrogen dioxide, and sulfur dioxide are not produced by this reaction.",
    metadata: { topic: "Degradation of Anesthetics", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["desiccated absorbent", "carbon monoxide", "carboxyhemoglobin"] }
  },

  // ── boa-node11-ads-098 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-098",
    type: "mcq",
    scene: null,
    prompt: "What toxic byproduct is produced when sevoflurane interacts with soda lime absorbent?",
    setup: "",
    ans: [
      { t: "Compound A (fluoromethyl-2,2-difluoro-1-vinyl ether), which is nephrotoxic in rats", ok: true },
      { t: "Compound B, a hepatotoxic metabolite that causes acute liver failure in all patients", ok: false },
      { t: "Carbon monoxide at levels sufficient to cause carboxyhemoglobinemia even with fresh soda lime", ok: false },
      { t: "Formaldehyde, which is a potent respiratory irritant and known human carcinogen chemical", ok: false },
    ],
    rationale: "Sevoflurane reacts with the strong bases (NaOH, KOH) in soda lime to produce Compound A (fluoromethyl-2,2-difluoro-1-[trifluoromethyl]vinyl ether), which is nephrotoxic in rats at high concentrations. Clinical significance in humans remains debated. 'Compound B' is not a recognized degradation product. CO production requires desiccated absorbent. Formaldehyde is not a significant product of this reaction.",
    metadata: { topic: "Degradation of Anesthetics", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["sevoflurane", "Compound A", "soda lime degradation"] }
  },

  // ── boa-node11-ads-099 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-099",
    type: "mcq",
    scene: null,
    prompt: "Which CO2 absorbent was associated with an increased risk of fire when used with sevoflurane and has subsequently been removed from the market?",
    setup: "",
    ans: [
      { t: "Baralyme, which contained barium hydroxide that generated extreme heat with sevoflurane", ok: true },
      { t: "Amsorb Plus, which contained unstable calcium compounds that ignited during normal use", ok: false },
      { t: "Soda lime, which produced flammable hydrogen gas when exposed to high sevoflurane levels", ok: false },
      { t: "Lithium hydroxide, which spontaneously combusted when exposed to any volatile anesthetic", ok: false },
    ],
    rationale: "Baralyme (barium hydroxide lime) was removed from the market because its interaction with sevoflurane, particularly when desiccated, generated extremely high temperatures — sufficient to cause fires within the CO2 absorber canister. Amsorb Plus is the safer alternative. Soda lime can produce heat but not to the fire-risk level of Baralyme. Lithium hydroxide is not used in clinical CO2 absorbents.",
    metadata: { topic: "Degradation of Anesthetics", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Baralyme", "fire risk", "sevoflurane interaction"] }
  },

  // ── boa-node11-ads-100 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-100",
    type: "mcq",
    scene: null,
    prompt: "A provider arrives Monday morning and suspects the CO2 absorbent may have desiccated over the weekend from continuous fresh gas flow. What is the safest course of action?",
    setup: "",
    ans: [
      { t: "Replace the absorbent entirely — desiccated absorbent produces CO and must not be used", ok: true },
      { t: "Add sterile water to the existing absorbent granules to rehydrate them before the case", ok: false },
      { t: "Run high fresh gas flows for 10 minutes to flush any degradation products from circuit", ok: false },
      { t: "Proceed with the case using low fresh gas flows to minimize absorbent degradation rate", ok: false },
    ],
    rationale: "Desiccated absorbent must be replaced — it produces carbon monoxide when exposed to volatile agents and cannot be safely rehydrated in situ. Adding water does not uniformly rehydrate granules and may create channels. Flushing does not remove the risk because CO is produced during subsequent agent use. Using low flows does not solve the underlying desiccation problem and still risks CO production.",
    metadata: { topic: "Degradation of Anesthetics", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["desiccated absorbent", "do not use", "Monday morning scenario"] }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL — Intermediate & Low Pressure Detail, Vaporizer Mechanism,
  //              Mapleson A–F Breathing Systems
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "boa-node11-ads-101",
    type: "multi",
    prompt: "Which components are located within the INTERMEDIATE pressure system of the anesthesia machine? (Select FOUR)",
    setup: "",
    choices: [
      "Pipeline inlet connections with DISS fittings and check valves",
      "Pipeline pressure indicators (gauges) color-coded by gas at 45-55 psi",
      "Master switch controlling both pneumatic and electrical functions",
      "Oxygen pressure failure devices (fail-safe valve and alarm at ~30 psi)",
      "Vaporizers and the common gas outlet delivering agent to the circuit",
      "Hanger yoke assembly with Pin Index Safety System for E-cylinders",
    ],
    correctAnswers: [
      "Pipeline inlet connections with DISS fittings and check valves",
      "Pipeline pressure indicators (gauges) color-coded by gas at 45-55 psi",
      "Master switch controlling both pneumatic and electrical functions",
      "Oxygen pressure failure devices (fail-safe valve and alarm at ~30 psi)",
    ],
    selectCount: 4,
    rationale: "The intermediate pressure system (40-55 psi) includes pipeline inlets, pipeline pressure indicators, piping, gas power outlet, master switch, O₂ pressure failure devices, O₂ flush, second-stage reducing devices, and flow control valves. Vaporizers and the common gas outlet are in the LOW pressure system (downstream of flow control valves). The hanger yoke is in the HIGH pressure system.",
    scene: null,
    metadata: { topic: "Intermediate Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["intermediate pressure", "components", "pipeline"] }
  },

  {
    id: "boa-node11-ads-102",
    type: "mcq",
    prompt: "The second-stage reducing device in the intermediate pressure system lowers N₂O to approximately 26 psig and O₂ to approximately 14 psig. What is the primary purpose of this further pressure reduction?",
    setup: "",
    ans: [
      { t: "It eliminates pressure fluctuations in the pipeline supply so that flowmeter readings remain constant and accurate", ok: true  },
      { t: "It raises the pressure high enough to overcome resistance in the vaporizer wicks and baffles during gas flow",      ok: false },
      { t: "It converts the gas from a liquid state back to a vapor state before it enters the flowmeter glass tubes",         ok: false },
      { t: "It prevents the fail-safe valve from activating by keeping all gas pressures above the 30 psi alarm threshold",    ok: false },
    ],
    rationale: "Second-stage regulators sit upstream of the N₂O and O₂ flow control valves. They reduce pipeline pressure further (N₂O to ~26 psig, O₂ to ~14 psig) to eliminate supply fluctuations, ensuring stable and accurate flowmeter readings regardless of upstream pressure variations. They do not convert liquid to vapor, do not raise pressure, and are independent of the fail-safe valve.",
    scene: null,
    metadata: { topic: "Intermediate Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["second-stage regulator", "pressure reduction", "flowmeter accuracy"] }
  },

  {
    id: "boa-node11-ads-103",
    type: "mcq",
    prompt: "The O₂ flush valve delivers 35-75 L/min of oxygen and bypasses which components of the machine?",
    setup: "",
    ans: [
      { t: "It bypasses both the flowmeters and the vaporizers, delivering unmetered oxygen directly to the common gas outlet",  ok: true  },
      { t: "It bypasses only the vaporizers but still flows through the flowmeter tubes so the provider can see the flow rate",  ok: false },
      { t: "It bypasses only the flowmeters but still passes through the vaporizer to pick up anesthetic agent before delivery", ok: false },
      { t: "It does not bypass anything — it simply increases the oxygen flow rate through the normal flowmeter/vaporizer path",  ok: false },
    ],
    rationale: "The O₂ flush valve provides direct communication between the high/intermediate pressure system and the low pressure common gas outlet, bypassing BOTH flowmeters AND vaporizers. This means: (1) the flow is unmetered — you cannot see it on the flowmeter, (2) it dilutes any anesthetic agent in the circuit (risk of awareness), and (3) it can cause barotrauma if the circuit is connected to a patient during positive pressure ventilation.",
    scene: null,
    metadata: { topic: "Oxygen Flush Valve", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["O2 flush", "bypasses flowmeters", "bypasses vaporizers", "barotrauma"] }
  },

  {
    id: "boa-node11-ads-104",
    type: "multi",
    prompt: "Which components are located within the LOW pressure system of the anesthesia machine? (Select FOUR)",
    setup: "",
    choices: [
      "Flow indicators (glass Thorpe tubes with bobbin or ball floats)",
      "Vaporizers with agent-specific variable-bypass design",
      "Common gas outlet where all gases and vapors exit the machine",
      "Back pressure safety devices preventing downstream pressure effects",
      "Pipeline inlet connections with DISS fittings receiving wall gas supply",
      "Oxygen pressure failure devices including the fail-safe valve mechanism",
    ],
    correctAnswers: [
      "Flow indicators (glass Thorpe tubes with bobbin or ball floats)",
      "Vaporizers with agent-specific variable-bypass design",
      "Common gas outlet where all gases and vapors exit the machine",
      "Back pressure safety devices preventing downstream pressure effects",
    ],
    selectCount: 4,
    rationale: "The low pressure system is DOWNSTREAM of the flow control valves. It includes flow indicators (Thorpe tubes), vaporizer circuit control valves, vaporizers, back pressure safety devices, low-pressure piping, and the common gas outlet. Pipeline inlets and DISS fittings are in the intermediate pressure system. The fail-safe valve is also in the intermediate system.",
    scene: null,
    metadata: { topic: "Low Pressure System", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["low pressure", "components", "vaporizers", "common gas outlet"] }
  },

  {
    id: "boa-node11-ads-105",
    type: "mcq",
    prompt: "In a variable-bypass vaporizer, how does the concentration control dial regulate the output concentration of anesthetic agent?",
    setup: "",
    ans: [
      { t: "It adjusts a splitting valve that controls what proportion of total FGF enters the vaporizing chamber versus the bypass", ok: true  },
      { t: "It directly heats the liquid anesthetic to increase its vapor pressure and therefore the output concentration",           ok: false },
      { t: "It changes the size of the common gas outlet orifice to alter the total flow rate exiting the machine",                   ok: false },
      { t: "It adjusts the pipeline inlet pressure regulator to increase the driving pressure through the vaporizer",                  ok: false },
    ],
    rationale: "The variable-bypass vaporizer splits incoming FGF into two portions: ~20% or less passes through the vaporizing chamber where it flows over liquid agent and becomes saturated with vapor. The remaining ~80% bypasses the chamber. The two portions mix at the outlet. The concentration dial adjusts this split ratio — turning it up sends more gas through the chamber, increasing agent output. It does not heat the agent (that's what the bimetallic temperature compensator does), nor does it change outlet orifice size or pipeline pressure.",
    scene: null,
    metadata: { topic: "Vaporizers", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["variable-bypass", "concentration dial", "splitting valve", "vaporizing chamber"] }
  },

  {
    id: "boa-node11-ads-106",
    type: "mcq",
    prompt: "In the variable-bypass vaporizer, what happens to the fresh gas that passes through the BYPASS chamber?",
    setup: "",
    ans: [
      { t: "It remains free of anesthetic agent and mixes with the saturated gas from the vaporizing chamber at the outlet",  ok: true  },
      { t: "It picks up a small amount of agent through vapor diffusion across the chamber wall separating the two pathways",  ok: false },
      { t: "It is warmed by the temperature-compensating valve before being delivered directly to the patient breathing circuit", ok: false },
      { t: "It is recirculated back to the flowmeters for re-measurement before joining the vaporizing chamber output stream",   ok: false },
    ],
    rationale: "In a variable-bypass design, the bypass portion of FGF does NOT contact liquid agent — it passes through a separate channel and remains agent-free. At the vaporizer outlet, this clean gas dilutes the fully saturated gas from the vaporizing chamber to produce the desired clinical concentration. If all gas went through the chamber, the output would be dangerously concentrated (the saturated vapor concentration of sevoflurane is ~21% at 20°C — far above clinical use).",
    scene: null,
    metadata: { topic: "Vaporizers", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["bypass chamber", "dilution", "output concentration", "variable-bypass"] }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MAPLESON BREATHING SYSTEMS A–F
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "boa-node11-ads-107",
    type: "mcq",
    prompt: "What defines the Mapleson A breathing system, and what is its clinical name?",
    setup: "Mnemonic: A = APL at patient's end.",
    ans: [
      { t: "APL valve located at the patient's end; clinically known as the Magill or Lack circuit",   ok: true  },
      { t: "Both APL and FGF located at the patient's end; clinically known as the Bain circuit",       ok: false },
      { t: "Corrugated tubing absent with no reservoir bag; used primarily for emergency intubations",   ok: false },
      { t: "APL valve located distal from the patient's end; clinically known as the Jackson-Rees mod", ok: false },
    ],
    rationale: "Mapleson A: the APL valve is at the PATIENT'S end. Clinical examples: Magill circuit (original) and Lack circuit (coaxial modification). It is the most efficient Mapleson system for spontaneous ventilation because exhaled dead-space gas is preferentially vented through the APL valve before alveolar gas. Mapleson B is obsolete. Mapleson D is the Bain. Mapleson F is Jackson-Rees.",
    scene: null,
    metadata: { topic: "Breathing Systems", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Mapleson A", "Magill", "Lack", "APL at patient end"] }
  },

  {
    id: "boa-node11-ads-108",
    type: "mcq",
    prompt: "What defines the Mapleson B breathing system, and what is its current clinical status?",
    setup: "Mnemonic: B = Both APL and FGF at patient's end.",
    ans: [
      { t: "Both the APL valve and fresh gas flow inlet are located at the patient's end — now considered obsolete",  ok: true  },
      { t: "The APL valve alone is at the patient's end with FGF at the machine end — this is the Magill circuit",    ok: false },
      { t: "Corrugated tubing is absent and the system is used for emergency intubations in the field setting",        ok: false },
      { t: "The reservoir bag is eliminated and replaced by open tubing — this is the Ayer's T-piece modification",    ok: false },
    ],
    rationale: "Mapleson B has BOTH the APL valve AND the fresh gas flow inlet at the patient's end. This configuration is now obsolete because it wastes fresh gas and provides poor CO₂ elimination efficiency compared to other designs. It should not be confused with Mapleson A (APL only at patient end) or Mapleson D/Bain (APL distal from patient).",
    scene: null,
    metadata: { topic: "Breathing Systems", priority: "medium", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Mapleson B", "obsolete", "both APL and FGF at patient end"] }
  },

  {
    id: "boa-node11-ads-109",
    type: "mcq",
    prompt: "What defines the Mapleson C breathing system, and when is it typically used?",
    setup: "Mnemonic: C = Corrugation absent.",
    ans: [
      { t: "Corrugated tubing is absent — used for emergency intubations and short transport with manual ventilation",  ok: true  },
      { t: "The APL valve is at the patient's end — used for prolonged spontaneous ventilation during maintenance",      ok: false },
      { t: "The reservoir bag is eliminated — used exclusively for pediatric anesthesia due to minimal dead space",      ok: false },
      { t: "The APL valve is located distal from the patient — used as the standard Bain coaxial circuit design",         ok: false },
    ],
    rationale: "Mapleson C has no corrugated reservoir tubing (C = Corrugation absent). It is a compact system used for emergency situations — resuscitation bags and short manual ventilation during intubation. Its simplicity makes it ideal for brief procedures, but the lack of corrugated tubing limits gas reservoir capacity for sustained ventilation.",
    scene: null,
    metadata: { topic: "Breathing Systems", priority: "medium", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Mapleson C", "corrugation absent", "emergency intubation"] }
  },

  {
    id: "boa-node11-ads-110",
    type: "mcq",
    prompt: "What defines the Mapleson D breathing system, and what is its common clinical modification?",
    setup: "Mnemonic: D = Distal APL.",
    ans: [
      { t: "APL valve is located DISTAL from the patient's end; the Bain circuit is a coaxial modification of Mapleson D",  ok: true  },
      { t: "Both APL and FGF are at the patient's end; the Magill circuit is a modification of Mapleson D design",            ok: false },
      { t: "The reservoir bag is eliminated; Ayer's T-piece is a modification of the Mapleson D breathing system",             ok: false },
      { t: "The APL valve is absent entirely; the Jackson-Rees circuit is another name for the Mapleson D system",             ok: false },
    ],
    rationale: "Mapleson D: the APL valve is DISTAL from the patient (D = Distal APL). The Bain circuit is a coaxial modification where the FGF tube runs inside the corrugated expiratory limb. Mapleson D is the most efficient system for controlled ventilation. The Bain is popular for its streamlined design but requires an inner-tube integrity test to prevent rebreathing from a disconnected FGF line.",
    scene: null,
    metadata: { topic: "Breathing Systems", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Mapleson D", "Bain circuit", "distal APL", "controlled ventilation"] }
  },

  {
    id: "boa-node11-ads-111",
    type: "mcq",
    prompt: "What defines the Mapleson E breathing system, and what is its clinical name?",
    setup: "Mnemonic: E = End (reservoir bag) eliminated.",
    ans: [
      { t: "The reservoir bag is eliminated from the system; clinically known as Ayer's T-piece",   ok: true  },
      { t: "The APL valve is eliminated from the system; clinically known as the Jackson-Rees mod", ok: false },
      { t: "The corrugated tubing is absent from the system; used for emergency intubation only",   ok: false },
      { t: "Both APL and FGF are at the patient end; this system is now considered obsolete",        ok: false },
    ],
    rationale: "Mapleson E: the reservoir bag at the END is eliminated (E = End bag eliminated). This is Ayer's T-piece — a simple open-ended tube with FGF near the patient. It has very low resistance and dead space, making it useful for pediatric patients. However, without a bag, manual ventilation is not possible unless modified (which creates the Mapleson F/Jackson-Rees).",
    scene: null,
    metadata: { topic: "Breathing Systems", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Mapleson E", "Ayer's T-piece", "no reservoir bag", "pediatric"] }
  },

  {
    id: "boa-node11-ads-112",
    type: "mcq",
    prompt: "What defines the Mapleson F breathing system, and why is it preferred for pediatric anesthesia and transport?",
    setup: "Mnemonic: F = Free from APL (APL is absent).",
    ans: [
      { t: "The APL valve is absent — Jackson-Rees modification; preferred for minimal dead space and very low resistance", ok: true  },
      { t: "The APL valve is at the patient's end — Magill circuit; preferred for high fresh gas flow efficiency",            ok: false },
      { t: "The corrugated tubing is absent — used for emergency intubation; preferred for rapid setup in the field",          ok: false },
      { t: "Both APL and FGF are distal from the patient — Bain circuit; preferred for controlled mechanical ventilation",     ok: false },
    ],
    rationale: "Mapleson F: Free from APL (the APL valve is absent). This is the Jackson-Rees modification of Ayer's T-piece — it adds a reservoir bag with an open tail to the Mapleson E. It's the preferred system for pediatric anesthesia and transport of intubated patients because it has minimal dead space, very low resistance, and allows both manual ventilation (by occluding the bag tail) and spontaneous breathing.",
    scene: null,
    metadata: { topic: "Breathing Systems", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Mapleson F", "Jackson-Rees", "APL absent", "pediatric", "transport"] }
  },

  {
    id: "boa-node11-ads-113",
    type: "mcq",
    prompt: "All semi-open (Mapleson) breathing systems are different arrangements of the same basic components. Which statement correctly describes what varies between systems A through F?",
    setup: "",
    ans: [
      { t: "The relative positions of the FGF inlet, APL valve, reservoir bag, and corrugated tubing change between systems",  ok: true  },
      { t: "The number of unidirectional valves and CO₂ absorbent canisters differs between each Mapleson classification",      ok: false },
      { t: "The operating pressure range changes — Mapleson A operates at high pressure while Mapleson F is low pressure",      ok: false },
      { t: "The type of anesthetic agent each system can deliver varies — some are for volatiles only, others for IV agents",    ok: false },
    ],
    rationale: "All Mapleson systems use the same components: FGF inlet tubing, corrugated reservoir tubing, facemask/connection, reservoir bag, and APL (expiratory) valve. What differs is the ARRANGEMENT of these components relative to each other and the patient. None contain CO₂ absorbent or unidirectional valves — those are features of the circle (semi-closed) system. CO₂ elimination in Mapleson systems depends entirely on high fresh gas flows to wash out exhaled CO₂.",
    scene: null,
    metadata: { topic: "Breathing Systems", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Mapleson systems", "component arrangement", "semi-open", "no CO2 absorber"] }
  },

  {
    id: "boa-node11-ads-114",
    type: "short",
    prompt: "The Bain circuit is a coaxial modification of which Mapleson breathing system?",
    setup: "",
    acceptedAnswers: ["Mapleson D", "mapleson D", "D", "Mapleson d", "mapleson d"],
    canonicalAnswer: "Mapleson D",
    rationale: "The Bain circuit is a coaxial modification of Mapleson D where the FGF tube runs concentrically inside the corrugated expiratory limb. This streamlined design is convenient but requires an integrity test — if the inner FGF tube disconnects, the patient rebreathes exhaled gas without fresh gas supplementation, leading to hypoxia and hypercarbia.",
    scene: null,
    metadata: { topic: "Breathing Systems", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Bain circuit", "Mapleson D", "coaxial"] }
  },

  {
    id: "boa-node11-ads-115",
    type: "short",
    prompt: "The Jackson-Rees circuit (used for pediatric anesthesia and transport) is also known as which Mapleson classification?",
    setup: "",
    acceptedAnswers: ["Mapleson F", "mapleson F", "F", "Mapleson f", "mapleson f"],
    canonicalAnswer: "Mapleson F",
    rationale: "Jackson-Rees = Mapleson F. It is free from an APL valve (F = Free from APL). It adds an open-tailed reservoir bag to Ayer's T-piece (Mapleson E), allowing manual ventilation while maintaining minimal dead space and resistance — ideal for pediatric patients and intubated patient transport.",
    scene: null,
    metadata: { topic: "Breathing Systems", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Jackson-Rees", "Mapleson F", "pediatric"] }
  },

  {
    id: "boa-node11-ads-116",
    type: "mcq",
    prompt: "A key difference between semi-open (Mapleson) systems and the semi-closed circle system is how CO₂ is eliminated. How do Mapleson systems remove CO₂?",
    setup: "",
    ans: [
      { t: "By using high fresh gas flows to wash out exhaled CO₂ — there is no chemical CO₂ absorbent in the system",  ok: true  },
      { t: "By passing exhaled gas through soda lime granules that chemically neutralize CO₂ into carbonates and water",  ok: false },
      { t: "By using unidirectional valves that trap CO₂ in the expiratory limb and prevent it from reaching the patient", ok: false },
      { t: "By venting all exhaled gas to the scavenging system and delivering only fresh gas with each subsequent breath", ok: false },
    ],
    rationale: "Mapleson (semi-open) systems have NO CO₂ absorbent and NO unidirectional valves. CO₂ is eliminated solely by high fresh gas flows (typically 2-3× minute ventilation) that wash exhaled gas out through the APL valve before the patient rebreathes it. This is wasteful of gas and anesthetic agent compared to the circle system, which uses soda lime to chemically neutralize CO₂ and allows lower fresh gas flows.",
    scene: null,
    metadata: { topic: "Breathing Systems", priority: "high", category: "anesthesia-delivery-systems", source: "node-11-chapter-11", tags: ["Mapleson", "CO2 elimination", "high FGF", "no absorbent"] }
  },

];

export const MACHINE_METADATA = {
  nodeId: "node-11",
  courseId: "basics-of-anesthesia",
  chapter: "Chapter 11",
  title: "Anesthesia Delivery Systems",
  totalQuestions: MACHINE_QUESTIONS.length,
  questionTypes: {
    mcq:   MACHINE_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: MACHINE_QUESTIONS.filter(q => q.type === 'multi').length,
    short: MACHINE_QUESTIONS.filter(q => q.type === 'short').length,
  }
};
