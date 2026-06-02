/**
 * Technological Advances in Anesthesia Practice, Week 5
 * Positioning / Gas Laws (Gas Laws portion)
 * Source: NAS 560 Gas Laws lecture (Dr. Whybrew). Every question cites its source slide.
 * Textbook alignment: Pardo 19; Nagelhout 15, 23.
 * Authoring conventions: periods, commas, and semicolons only (no dashes as punctuation); numeric ranges written with the word "to".
 */

export const TA_WK5_QUESTIONS = [

  /* ================================================================
     Kinetic molecular theory, states of matter, pressure, solubility
     ================================================================ */

  {
    id: "ta-w5-001",
    type: "mcq",
    prompt: "Kinetic molecular theory underlies the gas laws. Which statement correctly describes how molecules behave in the solid, liquid, and gas states?",
    setup: "",
    ans: [
      { t: "In a solid the molecules sit in a regular lattice and oscillate in place under strong intermolecular forces; in a liquid added heat moves them farther apart with weaker attraction (Van der Waals forces); and with still more heat they overcome these forces and move freely through space as a gas", ok: true },
      { t: "In a gas the molecules are locked in a rigid lattice, while in a solid they move freely through space", ok: false },
      { t: "Molecules in all three states have identical kinetic energy and spacing", ok: false },
      { t: "Liquids have no intermolecular attraction at all, while gases are held tightly by Van der Waals forces", ok: false },
    ],
    rationale: "Kinetic molecular theory holds that all substances are composed of atoms or molecules that attract one another and move, and that matter exists as a solid, liquid, or gas. In a solid the molecules occupy a regular lattice and oscillate in one position under strong forces from their neighbors. As heat is added and the substance becomes a liquid, the molecules vibrate and move farther apart so the intermolecular force weakens, although a residual attraction known as Van der Waals forces remains. With still more heat the molecules gain enough kinetic energy to overcome the Van der Waals forces and move freely through space as a gas. Source: NAS 560 Gas Laws lecture.", // source: slide 5
    scene: "chemistry_lab",
    sceneCfg: { label: "STATES OF MATTER" },
    metadata: { topic: "Kinetic Molecular Theory", priority: "medium" },
  },

  {
    id: "ta-w5-002",
    type: "mcq",
    prompt: "Volatility and vapor pressure are central to vaporizer design. Which statement is correct?",
    setup: "",
    ans: [
      { t: "Volatility is the ability to change from liquid to gas, and a volatile liquid vaporizes readily at a low temperature; vapor pressure (the pressure exerted by molecules leaving the liquid to enter the gas phase) determines vaporizer design, and because desflurane has a high boiling point its vaporizer must be heated", ok: true },
      { t: "Volatility is the resistance to vaporization, so the most volatile agents need the most heating", ok: false },
      { t: "Vapor pressure has no relationship to vaporizer design", ok: false },
      { t: "Desflurane has a very low vapor pressure, so its vaporizer never needs heating", ok: false },
    ],
    rationale: "Volatility is the ability of a substance to change states from liquid to gas, and a volatile liquid is readily vaporizable at a low temperature. This matters because vapor pressure, the pressure exerted by molecules leaving the liquid phase to enter the gas phase, determines vaporizer design. Desflurane has a high boiling point, so its vaporizer must be plugged in and heated to deliver a controlled concentration. Source: NAS 560 Gas Laws lecture.", // source: slide 7
    scene: "gas_piston",
    sceneCfg: { label: "VOLATILITY AND VAPOR PRESSURE" },
    metadata: { topic: "Vapor Pressure", priority: "high" },
  },

  {
    id: "ta-w5-003",
    type: "mcq",
    prompt: "In gas law calculations, what is standard temperature and pressure (STP)?",
    setup: "",
    ans: [
      { t: "Standard temperature is 273 Kelvin, equal to 0 degrees Celsius, and standard pressure is about 100 kilopascals (the actual value is 101.3 kPa, often rounded to 100)", ok: true },
      { t: "Standard temperature is 0 Kelvin and standard pressure is 760 kilopascals", ok: false },
      { t: "Standard temperature is 37 degrees Celsius and standard pressure is 1 kilopascal", ok: false },
      { t: "Standard temperature is 100 degrees Celsius and standard pressure is 14.7 kilopascals", ok: false },
    ],
    rationale: "Standard temperature and pressure provides a reference for comparing gas volumes. Standard temperature is 273 Kelvin, which equals 0 degrees Celsius, and standard pressure is about 100 kilopascals; the actual value is 101.3 kPa but it is often stated as 100. Source: NAS 560 Gas Laws lecture.", // source: slide 10
    scene: "gas_piston",
    sceneCfg: { label: "STANDARD TEMPERATURE AND PRESSURE" },
    metadata: { topic: "Units and STP", priority: "medium" },
  },

  {
    id: "ta-w5-004",
    type: "mcq",
    prompt: "Standard atmospheric pressure can be expressed in several units. Which set of equivalencies is correct?",
    setup: "",
    ans: [
      { t: "1 atmosphere equals 760 torr, which is about 760 mmHg, about 14.7 psi, and about 1.013 x 10 to the fifth power pascals", ok: true },
      { t: "1 atmosphere equals 76 torr, 7.4 psi, and 100 pascals", ok: false },
      { t: "1 atmosphere equals 760 psi, 14.7 torr, and 1 pascal", ok: false },
      { t: "1 atmosphere equals 273 torr, 0 psi, and 100,000 atmospheres", ok: false },
    ],
    rationale: "Standard pressure can be written several equivalent ways: 1 atmosphere equals 760 torr, which is about 760 mmHg (millimeters of mercury), about 14.7 psi (pounds per square inch), and about 1.013 x 10 to the fifth power newtons per meter squared, which is the same as 1.013 x 10 to the fifth power pascals. The standard unit of pressure is the pascal, and 100,000 pascals equals 100 kilopascals. Source: NAS 560 Gas Laws lecture.", // source: slide 12
    scene: "pressure_depth",
    sceneCfg: { label: "PRESSURE UNIT EQUIVALENCIES" },
    metadata: { topic: "Units and STP", priority: "high" },
  },

  {
    id: "ta-w5-005",
    type: "mcq",
    prompt: "When the pressure gauge on a gas cylinder reads zero, what is the actual (absolute) pressure inside the cylinder?",
    setup: "",
    ans: [
      { t: "About 1 atmosphere, which is about 760 torr or 760 mmHg or 14.7 psi absolute; the gauge reads 0 psi because it measures pressure above atmospheric", ok: true },
      { t: "A true vacuum of 0 absolute pressure, since the gauge reads zero", ok: false },
      { t: "About 760 psi absolute, because the gauge underreads by a factor of 10", ok: false },
      { t: "Exactly 14.7 atmospheres absolute", ok: false },
    ],
    rationale: "A cylinder pressure gauge reads gauge pressure, which is the pressure above atmospheric. When the gauge reads zero (0 psi) the cylinder is not empty of all pressure; the absolute pressure inside is about 1 atmosphere, which is about 760 torr, 760 mmHg, or 14.7 psi. For the CRNA, this distinction between gauge and absolute pressure explains why a cylinder at gauge zero still holds gas at atmospheric pressure. Source: NAS 560 Gas Laws lecture.", // source: slide 13
    scene: "pressure_depth",
    sceneCfg: { label: "GAUGE VERSUS ABSOLUTE PRESSURE" },
    metadata: { topic: "Units and STP", priority: "medium" },
  },

  {
    id: "ta-w5-006",
    type: "mcq",
    prompt: "How does temperature affect the solubility of a gas in a liquid, and what is the clinical consequence in a hypothermic patient?",
    setup: "",
    ans: [
      { t: "Gas solubility in a liquid is inversely related to temperature, so as temperature falls more gas dissolves; a hypothermic patient therefore retains more anesthetic gas in the blood, which slows emergence", ok: true },
      { t: "Gas solubility rises as temperature rises, so a hypothermic patient emerges faster", ok: false },
      { t: "Temperature has no effect on the solubility of a gas in a liquid", ok: false },
      { t: "A hypothermic patient holds less anesthetic gas, which speeds emergence", ok: false },
    ],
    rationale: "The solubility of a gas in a liquid is inversely related to temperature. As temperature rises, greater kinetic energy lets gas molecules escape and less gas stays dissolved; as temperature falls, slower molecules dissolve more readily, so more gas stays in solution. Clinically, a hypothermic patient retains more anesthetic gas in the blood because of this increased solubility, which produces a slower emergence. Source: NAS 560 Gas Laws lecture.", // source: slide 14
    scene: "chemistry_lab",
    sceneCfg: { label: "SOLUBILITY AND TEMPERATURE" },
    metadata: { topic: "Solubility", priority: "high" },
  },

  {
    id: "ta-w5-007",
    type: "mcq",
    prompt: "Henry's law relates gas solubility to pressure. Which statement correctly states the law and gives a clinical application?",
    setup: "",
    ans: [
      { t: "At a constant temperature, the amount of gas dissolved in a liquid is directly proportional to the partial pressure of that gas above the liquid; raising the partial pressure of oxygen above the blood increases the oxygen dissolved in blood and improves arterial oxygenation", ok: true },
      { t: "At a constant temperature, dissolved gas is inversely proportional to partial pressure, so raising the oxygen partial pressure lowers the dissolved oxygen", ok: false },
      { t: "Henry's law applies only to solids and has no relevance to oxygen in blood", ok: false },
      { t: "Dissolved gas depends only on temperature and not at all on partial pressure", ok: false },
    ],
    rationale: "Henry's law states that, at a constant temperature, the amount of gas dissolved in a liquid is directly proportional to the partial pressure of that gas at equilibrium above the gas to liquid interface. Increasing the partial pressure of a gas above a liquid increases the amount that dissolves. Clinically, increasing the partial pressure of oxygen above the blood increases the oxygen that dissolves in blood and improves arterial oxygenation. A familiar example is a carbonated drink, which holds dissolved carbon dioxide under pressure and releases bubbles when the pressure above it is lowered. Source: NAS 560 Gas Laws lecture.", // source: slide 15
    scene: "chemistry_lab",
    sceneCfg: { label: "HENRY'S LAW" },
    metadata: { topic: "Solubility", priority: "high" },
  },

  /* ================================================================
     Diffusion (Fick, Graham), nitrous oxide, osmosis
     ================================================================ */

  {
    id: "ta-w5-008",
    type: "mcq",
    prompt: "Diffusion in the body is described in part by Fick's law. What does Fick's law describe?",
    setup: "",
    ans: [
      { t: "Fick's law describes the movement of molecules from a region of high concentration to a region of low concentration, the process by which many molecules diffuse across cell membranes", ok: true },
      { t: "Fick's law describes the movement of molecules from low to high concentration against the gradient", ok: false },
      { t: "Fick's law states that diffusion is inversely proportional to the square root of molecular weight", ok: false },
      { t: "Fick's law describes the movement of water across a semipermeable membrane", ok: false },
    ],
    rationale: "Diffusion is the net movement of molecules through space due to random motion, which minimizes a concentration gradient and is driven by the kinetic energy of the molecules (temperature is directly proportional to kinetic energy). Fick's law describes diffusion as the movement of molecules from a high concentration to a low concentration, the process by which many molecules cross cell membranes. The choice about the square root of molecular weight describes Graham's law, and the one about water across a membrane describes osmosis. Source: NAS 560 Gas Laws lecture.", // source: slide 17
    scene: "pulmonary",
    sceneCfg: { label: "FICK'S LAW" },
    metadata: { topic: "Diffusion", priority: "high" },
  },

  {
    id: "ta-w5-009",
    type: "mcq",
    prompt: "Because nitrous oxide is highly soluble, it diffuses into air-filled spaces faster than nitrogen leaves them. What is the clinical consequence?",
    setup: "",
    ans: [
      { t: "Nitrous oxide diffuses into air-filled spaces and expands them, increasing the volume or pressure of an endotracheal tube cuff, the intestines, the inner ear, intraocular gas, and an air embolism", ok: true },
      { t: "Nitrous oxide shrinks all air-filled spaces because it is poorly soluble", ok: false },
      { t: "Nitrous oxide has no effect on closed gas spaces", ok: false },
      { t: "Nitrous oxide affects only the stomach and never the endotracheal tube cuff", ok: false },
    ],
    rationale: "Nitrous oxide is more soluble than the other gases present, so over time it diffuses into air-filled spaces faster than nitrogen can diffuse out, increasing their volume or pressure. This is an application of Fick's law and expands an endotracheal tube cuff over time and enlarges gas in the intestines, the inner ear, intraocular spaces, and an air embolism. For the CRNA, this is why nitrous oxide is avoided in bowel obstruction, middle ear surgery, intraocular gas, and suspected air embolism. Source: NAS 560 Gas Laws lecture.", // source: slide 18
    scene: "pulmonary",
    sceneCfg: { label: "NITROUS OXIDE EXPANSION" },
    metadata: { topic: "Diffusion", priority: "high" },
  },

  {
    id: "ta-w5-010",
    type: "mcq",
    prompt: "What is diffusion hypoxia, and how is it prevented at the end of a nitrous oxide anesthetic?",
    setup: "",
    ans: [
      { t: "When nitrous oxide is discontinued it rapidly diffuses out of the blood into the alveoli and dilutes the alveolar oxygen; it is prevented by turning off the nitrous oxide and administering oxygen before extubation, because failing to do so leaves the patient hypoxic", ok: true },
      { t: "Diffusion hypoxia is caused by nitrous oxide being too insoluble to leave the blood, and it requires no treatment", ok: false },
      { t: "It is prevented by leaving the nitrous oxide running through extubation", ok: false },
      { t: "It is caused by oxygen diffusing out of the blood and is prevented by giving more nitrous oxide", ok: false },
    ],
    rationale: "Because nitrous oxide is highly soluble, large volumes dissolve in the blood during the anesthetic. When it is discontinued it rapidly diffuses out of the blood into the alveoli and dilutes the alveolar oxygen. This is prevented by turning off the nitrous oxide and administering oxygen; if the nitrous oxide is not turned off and oxygen given before extubation, the patient will become hypoxic. Source: NAS 560 Gas Laws lecture.", // source: slide 18
    scene: "pulmonary",
    sceneCfg: { label: "DIFFUSION HYPOXIA" },
    metadata: { topic: "Diffusion", priority: "high" },
  },

  {
    id: "ta-w5-011",
    type: "mcq",
    prompt: "Graham's law governs the rate of gas diffusion. Which statement is correct, and what is its clinical use with helium?",
    setup: "",
    ans: [
      { t: "Diffusion of gases is inversely proportional to the square root of the molecular weight, so smaller and lighter molecules diffuse faster; helium diffuses faster than air or oxygen, so giving helium with oxygen helps the mixture pass a partial airway obstruction or epiglottitis", ok: true },
      { t: "Diffusion is directly proportional to molecular weight, so heavier molecules diffuse faster", ok: false },
      { t: "Helium diffuses more slowly than oxygen, so it worsens airway obstruction", ok: false },
      { t: "Graham's law describes the dissolving of a gas in a liquid and has no relation to molecular weight", ok: false },
    ],
    rationale: "Graham's law states that the diffusion of gases, both through membranes and in solutions, is inversely proportional to the square root of the molecular weight; smaller or lighter molecules diffuse faster and larger or heavier molecules diffuse more slowly. Helium, being light, diffuses faster than either air or oxygen, so a helium and oxygen mixture passes more easily through a partially obstructed airway, which is useful in partial airway obstruction or epiglottitis. Source: NAS 560 Gas Laws lecture.", // source: slide 19
    scene: "pulmonary",
    sceneCfg: { label: "GRAHAM'S LAW" },
    metadata: { topic: "Diffusion", priority: "high" },
  },

  {
    id: "ta-w5-012",
    type: "mcq",
    prompt: "Osmosis and the related pressures are important in fluid management. Which set of definitions is correct?",
    setup: "",
    ans: [
      { t: "Osmosis is the movement of water across a semipermeable membrane (permeable to water but not solute) to equilibrate a concentration gradient; osmotic pressure is the force needed to stop osmosis and reflects all solutes, while oncotic (colloid osmotic) pressure is the portion exerted specifically by plasma proteins", ok: true },
      { t: "Osmosis is the movement of solute rather than water, and oncotic pressure is exerted by sodium", ok: false },
      { t: "Osmotic pressure is the pressure that drives osmosis forward, and oncotic pressure is exerted by red cells", ok: false },
      { t: "Osmosis moves water from low to high water concentration, increasing the gradient", ok: false },
    ],
    rationale: "Osmosis is the movement of water across a semipermeable membrane to equilibrate a concentration gradient, where the membrane is permeable to water but not to solute. Osmotic pressure is the force necessary to stop osmosis and is exerted by all solutes, such as salts, sugars, and proteins, across the membrane. Oncotic pressure, also called colloid osmotic pressure, is the portion of that pressure exerted specifically by the proteins in the blood plasma. Source: NAS 560 Gas Laws lecture.", // source: slide 20
    scene: "starling_forces",
    sceneCfg: { label: "OSMOSIS AND ONCOTIC PRESSURE" },
    metadata: { topic: "Osmosis", priority: "medium" },
  },

  /* ================================================================
     The gas laws and Dalton's law of partial pressures
     ================================================================ */

  {
    id: "ta-w5-013",
    type: "mcq",
    prompt: "Charles' gas law describes the relationship between which two variables, and how are they related?",
    setup: "",
    ans: [
      { t: "At constant pressure, volume and temperature are directly proportional, so volume increases as temperature increases", ok: true },
      { t: "At constant pressure, volume and temperature are inversely proportional, so volume falls as temperature rises", ok: false },
      { t: "At constant temperature, pressure and volume are inversely proportional", ok: false },
      { t: "At constant volume, pressure and temperature are directly proportional", ok: false },
    ],
    rationale: "Charles' gas law studied the relationship of volume and temperature when pressure is held constant. Volume and temperature are directly proportional, so at a constant pressure the volume increases as the temperature increases. The option about pressure and volume at constant temperature describes Boyle's law, and the one about pressure and temperature at constant volume describes Gay-Lussac's law. Source: NAS 560 Gas Laws lecture.", // source: slide 22
    scene: "gas_piston",
    sceneCfg: { label: "CHARLES' LAW" },
    metadata: { topic: "Gas Laws", priority: "high" },
  },

  {
    id: "ta-w5-014",
    type: "mcq",
    prompt: "Boyle's gas law describes the relationship between which two variables, and how are they related?",
    setup: "",
    ans: [
      { t: "At constant temperature, pressure and volume are inversely proportional, so as pressure increases volume decreases", ok: true },
      { t: "At constant temperature, pressure and volume are directly proportional, so both rise together", ok: false },
      { t: "At constant pressure, volume and temperature are directly proportional", ok: false },
      { t: "At constant volume, pressure and temperature are inversely proportional", ok: false },
    ],
    rationale: "Boyle's gas law studied the relationship of pressure and volume when temperature is held constant. Pressure and volume are inversely (indirectly) proportional, so at a constant temperature, as pressure increases the volume decreases. The option about volume and temperature describes Charles' law, and the one about pressure and temperature describes Gay-Lussac's law. Source: NAS 560 Gas Laws lecture.", // source: slide 23
    scene: "gas_piston",
    sceneCfg: { label: "BOYLE'S LAW" },
    metadata: { topic: "Gas Laws", priority: "high" },
  },

  {
    id: "ta-w5-015",
    type: "mcq",
    prompt: "Gay-Lussac's gas law describes the relationship between which two variables, and why can it cause a gas cylinder to explode if heated?",
    setup: "",
    ans: [
      { t: "At constant volume, pressure and temperature are directly proportional, so as temperature increases pressure increases; heating a fixed-volume oxygen cylinder therefore raises its pressure, potentially to the point of explosion", ok: true },
      { t: "At constant volume, pressure and temperature are inversely proportional, so heating the cylinder lowers the pressure", ok: false },
      { t: "At constant pressure, volume and temperature are inversely proportional", ok: false },
      { t: "At constant temperature, pressure and volume are directly proportional", ok: false },
    ],
    rationale: "Gay-Lussac's gas law studied the relationship of pressure and temperature when volume is held constant. Pressure and temperature are directly proportional, so at a constant volume, as temperature increases the pressure increases. This is why raising the temperature of an oxygen cylinder without changing its volume raises the internal pressure, potentially to the point that it explodes. Source: NAS 560 Gas Laws lecture.", // source: slide 24
    scene: "gas_piston",
    sceneCfg: { label: "GAY-LUSSAC'S LAW" },
    metadata: { topic: "Gas Laws", priority: "high" },
  },

  {
    id: "ta-w5-016",
    type: "mcq",
    prompt: "Dalton's law of partial pressures states what about a mixture of gases?",
    setup: "",
    ans: [
      { t: "The total pressure of a gas mixture is the sum of the partial pressures of each individual gas (Ptotal = P1 + P2 + P3 and so on), and each gas exerts a partial pressure according to its fraction of the mixture", ok: true },
      { t: "The total pressure equals the partial pressure of the single most abundant gas only", ok: false },
      { t: "The total pressure equals the product of the partial pressures of the gases", ok: false },
      { t: "Each gas in a mixture exerts the same partial pressure regardless of its fraction", ok: false },
    ],
    rationale: "Dalton's law of partial pressures states that the total pressure of a system is the additive sum of the pressures of each individual gas in the system (Ptotal = P1 + P2 + P3 and so on). Each gas exerts a partial pressure according to its fraction of the mixture. This principle underlies gas mixtures such as a scuba tank and the delivery of inhaled nitric oxide, where the partial pressure of the active gas is calculated within the mixture. Source: NAS 560 Gas Laws lecture.", // source: slide 28
    scene: "gas_piston",
    sceneCfg: { label: "DALTON'S LAW" },
    metadata: { topic: "Partial Pressures", priority: "high" },
  },

  {
    id: "ta-w5-017",
    type: "mcq",
    prompt: "Using Dalton's law at sea level (total pressure 760 mmHg), what is the approximate partial pressure of oxygen in room air, which is about 21 percent oxygen?",
    setup: "",
    ans: [
      { t: "About 160 mmHg, calculated as 0.21 multiplied by 760 mmHg", ok: true },
      { t: "About 600 mmHg, calculated as 0.79 multiplied by 760 mmHg", ok: false },
      { t: "About 760 mmHg, because oxygen alone exerts the full atmospheric pressure", ok: false },
      { t: "About 21 mmHg, because the percentage equals the partial pressure directly", ok: false },
    ],
    rationale: "By Dalton's law, the partial pressure of a gas equals its fraction of the mixture multiplied by the total pressure. In room air at sea level (760 mmHg), oxygen is about 21 percent, so its partial pressure is 0.21 multiplied by 760 mmHg, which is about 160 mmHg. Nitrogen is about 79 percent, so 0.79 multiplied by 760 mmHg is about 600 mmHg, and the two partial pressures sum to about 760 mmHg. Source: NAS 560 Gas Laws lecture.", // source: slide 28
    scene: "gas_piston",
    sceneCfg: { label: "PARTIAL PRESSURE CALCULATION" },
    metadata: { topic: "Partial Pressures", priority: "high" },
  },

  /* ================================================================
     State transitions and adiabatic cooling
     ================================================================ */

  {
    id: "ta-w5-018",
    type: "mcq",
    prompt: "How do melting point, boiling point, and critical temperature distinguish the liquid, vapor, and gas states?",
    setup: "",
    ans: [
      { t: "When a solid reaches its melting point it becomes a liquid; when a liquid reaches its boiling point it becomes a vapor; and when a liquid reaches its critical temperature it becomes a gas", ok: true },
      { t: "When a gas reaches its melting point it becomes a solid, and the critical temperature converts a gas to a liquid", ok: false },
      { t: "Boiling point converts a solid directly to a gas, skipping the liquid state", ok: false },
      { t: "Critical temperature is the point at which a gas freezes into a solid", ok: false },
    ],
    rationale: "A substance changes state at characteristic points: when a solid reaches its melting point it becomes a liquid; when a liquid reaches its boiling point it becomes a vapor; and when a liquid reaches its critical temperature it becomes a gas. These transition points describe how a substance moves between the solid, liquid, vapor, and gas states. Source: NAS 560 Gas Laws lecture.", // source: slide 30
    scene: "chemistry_lab",
    sceneCfg: { label: "LIQUID, VAPOR, AND GAS" },
    metadata: { topic: "States of Matter", priority: "medium" },
  },

  {
    id: "ta-w5-019",
    type: "mcq",
    prompt: "What is adiabatic cooling, and where is it seen with a gas cylinder?",
    setup: "",
    ans: [
      { t: "Adiabatic cooling occurs when the pressure of a gas decreases as it expands into a larger volume so rapidly that there is no time to exchange heat; it is seen when gas escapes from a cylinder, and a carbon dioxide fire extinguisher cools as the gas expands to atmospheric pressure", ok: true },
      { t: "Adiabatic cooling occurs when a gas is compressed slowly with full heat exchange", ok: false },
      { t: "Adiabatic cooling is the warming of a gas as it expands", ok: false },
      { t: "Adiabatic cooling requires adding heat to the gas from an outside source", ok: false },
    ],
    rationale: "Adiabatic cooling occurs when the pressure of a gas decreases, such as when it expands into a larger volume. It is seen when gas escapes from a cylinder and generally occurs when a gas expands so rapidly that there is no time to exchange heat with the surroundings. A carbon dioxide fire extinguisher is an example: the gas comes out at high pressure and cools as it expands to atmospheric pressure. Source: NAS 560 Gas Laws lecture.", // source: slide 31
    scene: "gas_piston",
    sceneCfg: { label: "ADIABATIC COOLING" },
    metadata: { topic: "Thermodynamics", priority: "medium" },
  },

  {
    id: "ta-w5-020",
    type: "mcq",
    prompt: "The Joule-Thomson effect is observed when a compressed gas cylinder is opened. What does it describe?",
    setup: "",
    ans: [
      { t: "The temperature of a gas decreases as the gas is allowed to expand adiabatically; when gas is let out of a cylinder, the cylinder becomes cold, the regulator can freeze, and condensation forms on the cylinder", ok: true },
      { t: "The temperature of a gas increases as it expands out of a cylinder, warming the regulator", ok: false },
      { t: "It describes the rise in pressure when a cylinder is heated at constant volume", ok: false },
      { t: "It describes the dissolving of a gas into a liquid under high pressure", ok: false },
    ],
    rationale: "The Joule-Thomson effect is a process in which the temperature of a gas decreases as the gas is allowed to expand adiabatically. When a compressed gas escapes freely from a cylinder, the process is adiabatic and cooling occurs: the cylinder becomes cold, the regulator can freeze, and condensation forms on the cylinder. Source: NAS 560 Gas Laws lecture.", // source: slide 32
    scene: "gas_piston",
    sceneCfg: { label: "JOULE-THOMSON EFFECT" },
    metadata: { topic: "Thermodynamics", priority: "medium" },
  },

];

export const TA_WK5_METADATA = {
  nodeId: "ta-wk-5",
  courseId: "tech-advances-anesthesia",
  chapter: "Pardo 19; Nagelhout 15, 23",
  title: "Positioning / Gas Laws",
  totalQuestions: 20,
  questionTypes: { mcq: 20, multi: 0, short: 0 },
};
