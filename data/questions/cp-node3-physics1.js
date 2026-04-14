/**
 * Chemistry & Physics for Anesthesia — Node 3
 * Physics I — Forces, Pressure & Measurement
 * Source: NAS 510 Physics 1 lecture transcript
 *         (Newton's laws, mass vs weight, vectors vs scalars,
 *          pressure units, barometer/manometer/Bourdon, gauge vs absolute)
 */

export const CP_NODE3_QUESTIONS = [

  // ═══════════════════════════════════════════════════════════════════════════
  // NEWTON'S LAWS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n3-001",
    type: "mcq",
    prompt: "An anesthetized patient lies motionless on the OR table with no net force acting on them. Which of Newton's laws explains why the patient remains at rest?",
    setup: "",
    ans: [
      { t: "Newton's first law — an object at rest stays at rest unless acted on by an unbalanced force",   ok: true  },
      { t: "Newton's second law — net force equals mass times acceleration, which here equals zero force",  ok: false },
      { t: "Newton's third law — every action has an equal and opposite reaction from the OR table",        ok: false },
      { t: "Law of conservation of energy — total energy is constant so no motion can spontaneously begin", ok: false },
    ],
    rationale: "Newton's first law (inertia) states that an object at rest remains at rest, and an object in motion remains in motion at constant velocity, unless an unbalanced external force acts on it. The patient has no net force, so they stay still — a straightforward application of inertia.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Newton's Laws", priority: "high" },
  },

  {
    id: "cp-n3-002",
    type: "mcq",
    prompt: "When you push a syringe plunger, you apply a force that accelerates the medication. Doubling the force on the same syringe doubles the acceleration. Which law governs this relationship?",
    setup: "",
    ans: [
      { t: "Newton's second law — F = m × a, so doubling force doubles acceleration at constant mass",    ok: true  },
      { t: "Newton's first law — objects resist changes in motion proportional to applied external force",  ok: false },
      { t: "Newton's third law — the plunger pushes back on your thumb with equal and opposite force",     ok: false },
      { t: "Hooke's law — force is proportional to displacement of the elastic plunger seal material",     ok: false },
    ],
    rationale: "Newton's second law (F = ma) directly relates force to acceleration for a given mass. Doubling force while mass stays constant doubles acceleration. The syringe plunger is a practical anesthesia example: more force = faster injection.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Newton's Laws", priority: "high" },
  },

  {
    id: "cp-n3-003",
    type: "mcq",
    prompt: "A CRNA pushes an OR bed forward. The bed simultaneously pushes back against the CRNA with equal force in the opposite direction. This illustrates which principle?",
    setup: "",
    ans: [
      { t: "Newton's third law — for every action force there is an equal and opposite reaction force",     ok: true  },
      { t: "Newton's first law — the bed resists motion due to its inertia until the push overcomes it",    ok: false },
      { t: "Newton's second law — the bed accelerates because the applied force exceeds frictional force",  ok: false },
      { t: "The law of momentum conservation — total momentum of the CRNA and bed system stays constant",   ok: false },
    ],
    rationale: "Newton's third law states that forces always come in action-reaction pairs of equal magnitude and opposite direction. When you push the bed, the bed pushes back on you. The bed still moves because the action and reaction act on different objects.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Newton's Laws", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MASS VS WEIGHT / VELOCITY VS SPEED / VECTORS VS SCALARS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n3-004",
    type: "mcq",
    prompt: "An astronaut has a mass of 80 kg. On the moon, gravitational acceleration is roughly 1.6 m/s². What is true about the astronaut's mass and weight on the moon compared to Earth?",
    setup: "",
    ans: [
      { t: "Mass stays 80 kg; weight decreases because weight = mass × local gravitational acceleration",  ok: true  },
      { t: "Both mass and weight decrease proportionally because gravity is weaker on the lunar surface",   ok: false },
      { t: "Mass increases to compensate for lower gravity so that total weight remains the same value",    ok: false },
      { t: "Weight stays the same because it is an intrinsic property like mass that does not change",      ok: false },
    ],
    rationale: "Mass (kg) is an intrinsic property of matter and does not change with location. Weight = mass × g, so it varies with gravitational acceleration. On Earth: 80 × 9.8 = 784 N. On the moon: 80 × 1.6 = 128 N. In anesthesia, we dose drugs by mass (kg), not weight.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Mass vs Weight", priority: "high" },
  },

  {
    id: "cp-n3-005",
    type: "mcq",
    prompt: "A bolus of propofol travels through IV tubing at 2 m/s toward the patient's right antecubital vein. Is '2 m/s toward the right AC' a speed or a velocity?",
    setup: "",
    ans: [
      { t: "Velocity — it has both magnitude (2 m/s) and a specified direction (toward the right AC)",  ok: true  },
      { t: "Speed — any rate of motion measured in meters per second is classified as a scalar speed",  ok: false },
      { t: "Acceleration — the fluid changes position over time so it must be accelerating continuously", ok: false },
      { t: "Neither — flow rate through tubing is measured in mL/min, not in meters per second",         ok: false },
    ],
    rationale: "Speed is a scalar (magnitude only). Velocity is a vector (magnitude + direction). Stating '2 m/s toward the right AC' specifies both, making it a velocity. This vector-vs-scalar distinction connects directly to EKG axis determination, where electrical vectors have both size and direction.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Vectors vs Scalars", priority: "medium" },
  },

  {
    id: "cp-n3-006",
    type: "mcq",
    prompt: "During EKG interpretation, lead axis vectors have both magnitude and direction. In physics, a quantity with both magnitude and direction is called a:",
    setup: "",
    ans: [
      { t: "Vector — a quantity defined by both its magnitude and its direction in space",           ok: true  },
      { t: "Scalar — a quantity described by magnitude alone without any directional component",     ok: false },
      { t: "Tensor — a multidimensional array used only in advanced material stress calculations",   ok: false },
      { t: "Constant — a fixed numerical value that does not change with position or orientation",   ok: false },
    ],
    rationale: "Vectors have magnitude + direction (velocity, force, electrical axis). Scalars have magnitude only (speed, mass, temperature). In EKG axis determination, each lead records a projection of the cardiac electrical vector — understanding vectors is essential for interpreting axis deviation.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Vectors vs Scalars", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PRESSURE CONCEPTS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n3-007",
    type: "mcq",
    prompt: "A syringe with a small-bore needle generates much higher pressure at the tip than the same force applied through a large-bore needle. Why?",
    setup: "",
    ans: [
      { t: "Pressure = force / area — the smaller cross-sectional area produces higher pressure",        ok: true  },
      { t: "Smaller needles increase the total force applied because they concentrate kinetic energy",    ok: false },
      { t: "Viscosity of the fluid is higher in narrow needles, which registers as increased pressure",   ok: false },
      { t: "The Venturi effect accelerates fluid through the narrow needle, creating suction pressure",   ok: false },
    ],
    rationale: "Pressure = Force / Area (P = F/A). For the same pushing force, a smaller plunger or needle cross-section means the force is distributed over less area, producing higher pressure. This is why small-gauge needles require more pushing force to achieve adequate flow and why a finger poke hurts more than a palm press.",
    scene: "gas_piston",
    sceneCfg: { label: "PRESSURE = FORCE / AREA" },
    metadata: { topic: "Pressure Fundamentals", priority: "high" },
  },

  {
    id: "cp-n3-008",
    type: "mcq",
    prompt: "Standard atmospheric pressure at sea level is commonly expressed as 760 mmHg. Which of the following is an equivalent expression of this same pressure?",
    setup: "",
    ans: [
      { t: "1 atm — one atmosphere is defined as exactly 760 mmHg at sea level",                    ok: true  },
      { t: "100 atm — atmospheric pressure is 100 times the mercury column height in atmospheres",  ok: false },
      { t: "760 PSI — pounds per square inch and mmHg are numerically identical at sea level",       ok: false },
      { t: "7.6 bar — one bar equals 100 mmHg so 760 mmHg converts to 7.6 bar exactly",            ok: false },
    ],
    rationale: "Standard atmospheric pressure equivalences: 760 mmHg = 1 atm = 101.325 kPa = 14.7 PSI = 1.013 bar. These conversions appear constantly in anesthesia — gas cylinder pressures, ventilator settings, and vaporizer physics all require fluency with pressure units.",
    scene: "pressure_depth",
    sceneCfg: { label: "ATMOSPHERIC PRESSURE = 760 mmHg = 1 atm" },
    metadata: { topic: "Pressure Units", priority: "high" },
  },

  {
    id: "cp-n3-009",
    type: "mcq",
    prompt: "A mercury barometer measures atmospheric pressure by the height of a mercury column. A manometer measures the pressure of an enclosed gas. What instrument uses a coiled metal tube to read gas cylinder pressure?",
    setup: "",
    ans: [
      { t: "A Bourdon gauge — a sealed coiled tube that straightens as internal pressure rises",          ok: true  },
      { t: "An aneroid barometer — a flexible metal capsule that responds to atmospheric pressure only",  ok: false },
      { t: "A mercury manometer — an open-tube liquid column used for low-pressure gas measurement",      ok: false },
      { t: "A strain-gauge transducer — a Wheatstone bridge sensor used for arterial line monitoring",    ok: false },
    ],
    rationale: "Gas cylinders on the anesthesia machine use Bourdon gauges — a curved metal tube that tends to straighten as pressure increases, moving a needle on a dial. Aneroid (meaning 'without liquid') barometers measure atmospheric pressure. Manometers use liquid columns. Strain-gauge transducers are electronic and used for invasive blood pressure.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Pressure Measurement", priority: "high" },
  },

  {
    id: "cp-n3-010",
    type: "mcq",
    prompt: "What is the relationship between gauge pressure and absolute pressure?",
    setup: "",
    ans: [
      { t: "Absolute pressure equals gauge pressure plus atmospheric pressure (gauge starts at zero)",      ok: true  },
      { t: "Absolute pressure equals gauge pressure minus atmospheric pressure (gauge reads higher)",       ok: false },
      { t: "They are identical — gauge and absolute pressure always display the same value on instruments",  ok: false },
      { t: "Gauge pressure includes atmospheric pressure while absolute pressure starts from zero baseline", ok: false },
    ],
    rationale: "Gauge pressure reads zero at atmospheric pressure — it only shows pressure ABOVE ambient. Absolute pressure includes atmospheric pressure: P_abs = P_gauge + P_atm. Gas law equations (PV = nRT, Boyle's law) require absolute pressure. Barometers measure absolute pressure; Bourdon gauges and manometers measure gauge pressure.",
    scene: "gas_piston",
    sceneCfg: { label: "GAUGE vs ABSOLUTE PRESSURE" },
    metadata: { topic: "Gauge vs Absolute", priority: "high" },
  },

  {
    id: "cp-n3-011",
    type: "mcq",
    prompt: "Rubbing alcohol (isopropanol) evaporates from skin faster than water at the same temperature. What does this indicate about isopropanol's vapor pressure compared to water?",
    setup: "",
    ans: [
      { t: "Isopropanol has a higher vapor pressure, so it vaporizes more readily at the same temperature", ok: true  },
      { t: "Isopropanol has a lower vapor pressure, but its smaller molecules slip through skin faster",    ok: false },
      { t: "Both liquids have the same vapor pressure; isopropanol just absorbs more heat from the skin",   ok: false },
      { t: "Vapor pressure is irrelevant; isopropanol evaporates faster only because it has lower density",  ok: false },
    ],
    rationale: "Vapor pressure is the pressure exerted by a liquid's vapor in equilibrium at a given temperature. A higher vapor pressure means the liquid vaporizes more easily. Isopropanol's higher vapor pressure compared to water explains its faster evaporation. In anesthesia, volatile agents have specific vapor pressures that determine vaporizer output — desflurane's very high VP requires a heated, pressurized vaporizer.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Vapor Pressure", priority: "medium" },
  },

  {
    id: "cp-n3-012",
    type: "multi",
    prompt: "Select the TWO quantities that are vectors (have both magnitude and direction):",
    setup: "",
    choices: [
      "Velocity — rate of position change in a specified direction",
      "Temperature — measured in kelvins or degrees with no directional component",
      "Force — a push or pull applied along a specific line of action",
      "Mass — the amount of matter in an object measured in kilograms",
      "Speed — the magnitude of velocity without any directional information",
    ],
    correctAnswers: [
      "Velocity — rate of position change in a specified direction",
      "Force — a push or pull applied along a specific line of action",
    ],
    selectCount: 2,
    rationale: "Vectors have both magnitude and direction. Velocity (speed + direction) and force (magnitude + line of action) are vectors. Temperature, mass, and speed are scalars — they have magnitude only. This distinction is foundational for understanding EKG axis vectors and hemodynamic force diagrams.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Vectors vs Scalars", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEW QUESTIONS 13–25
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n3-013",
    type: "mcq",
    prompt: "Convert 1 atm of pressure to kilopascals (kPa). Which value is correct?",
    setup: "",
    ans: [
      { t: "101.325 kPa — this is the SI equivalent of one standard atmosphere of pressure",   ok: true  },
      { t: "760.000 kPa — kilopascals and mmHg share the same numerical value at sea level",   ok: false },
      { t: "14.7 kPa — this is the atmospheric pressure expressed in pounds per square inch",   ok: false },
      { t: "10.133 kPa — one atmosphere converts to roughly ten kilopascals at sea level",      ok: false },
    ],
    rationale: "1 atm = 760 mmHg = 101.325 kPa = 14.7 PSI = 1.013 bar. The kPa is the standard SI unit of pressure used internationally. Many ventilators and monitoring systems display pressures in kPa, so rapid conversion from mmHg or cmH₂O is a core CRNA skill.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Pressure Units", priority: "high" },
  },

  {
    id: "cp-n3-014",
    type: "mcq",
    prompt: "Why is 1 mmHg a larger pressure unit than 1 cmH₂O, and what clinical systems use each?",
    setup: "",
    ans: [
      { t: "Mercury is 13.6× denser than water — hemodynamics use mmHg, ventilators use cmH₂O",  ok: true  },
      { t: "Water is denser than mercury — so cmH₂O represents a larger pressure than mmHg does",  ok: false },
      { t: "They are equivalent units — 1 mmHg = 1 cmH₂O with no conversion factor needed at all", ok: false },
      { t: "Mercury is used because it is cheaper — clinical utility, not density, determines the unit", ok: false },
    ],
    rationale: "Mercury is 13.6× denser than water, so a 1 mm column of mercury exerts more pressure than a 1 cm column of water. Conversion: 1 mmHg ≈ 1.36 cmH₂O. Hemodynamic monitoring (BP, CVP, PA pressures) uses mmHg. Ventilator pressures (PIP, PEEP, plateau) use cmH₂O. Knowing when to convert between them is essential when integrating ventilator and hemodynamic data.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Pressure Units", priority: "high" },
  },

  {
    id: "cp-n3-015",
    type: "mcq",
    prompt: "A CRNA applies 10 N of force to a 10 mL syringe (plunger area ~1.75 cm²) and then switches to a 60 mL syringe (plunger area ~7.0 cm²) with the same force. How does the injection pressure compare?",
    setup: "",
    ans: [
      { t: "The 10 mL syringe generates about 4 times higher pressure because its area is 4 times smaller", ok: true  },
      { t: "Both syringes generate identical injection pressure because the same 10 N force was applied",    ok: false },
      { t: "The 60 mL syringe generates higher pressure because its larger volume compresses the fluid more", ok: false },
      { t: "Syringe size does not affect pressure since flow rate is the only variable that changes here",    ok: false },
    ],
    rationale: "P = F/A. With 10 N on the 10 mL syringe: 10/1.75 ≈ 5.7 N/cm². With 10 N on the 60 mL syringe: 10/7.0 ≈ 1.4 N/cm². The smaller syringe produces roughly 4 times the pressure. This is why smaller syringes can generate dangerously high pressures during nerve blocks or line flushing.",
    scene: "gas_piston",
    sceneCfg: { label: "SMALL SYRINGE = HIGH PRESSURE" },
    metadata: { topic: "Pressure Fundamentals", priority: "high" },
  },

  {
    id: "cp-n3-016",
    type: "mcq",
    prompt: "Two force vectors of equal magnitude act at right angles to each other. The resultant vector magnitude is found using which mathematical relationship?",
    setup: "Think about how perpendicular components combine.",
    ans: [
      { t: "The Pythagorean theorem — resultant equals the square root of the sum of the squared components", ok: true  },
      { t: "Simple addition — the resultant equals the arithmetic sum of both perpendicular vector magnitudes", ok: false },
      { t: "Simple subtraction — perpendicular vectors cancel partially, reducing the resultant by half",      ok: false },
      { t: "Multiplication — perpendicular vector resultant is the product of the two component magnitudes",   ok: false },
    ],
    rationale: "When two vectors are perpendicular, the resultant magnitude = sqrt(A² + B²), a direct application of the Pythagorean theorem. In EKG axis determination, leads I and aVF are roughly perpendicular, so the net cardiac vector can be estimated by combining their magnitudes as a right triangle — the resultant direction gives the electrical axis.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Vectors vs Scalars", priority: "medium" },
  },

  {
    id: "cp-n3-017",
    type: "mcq",
    prompt: "Momentum is defined as mass × velocity (p = mv). Why does a heavier patient on a rolling stretcher require more force or time to stop?",
    setup: "",
    ans: [
      { t: "Greater mass at the same speed produces greater momentum — stopping requires more impulse (F × Δt)",  ok: true  },
      { t: "Heavier objects have more friction with the floor, which paradoxically makes them harder to decelerate", ok: false },
      { t: "Momentum is independent of mass — only velocity determines how hard it is to stop a rolling object",    ok: false },
      { t: "Gravitational acceleration must be overcome to stop any moving object regardless of its mass or speed",  ok: false },
    ],
    rationale: "Momentum p = mv. More mass at the same velocity → more momentum. Stopping requires an impulse (force × time) equal to the momentum. This is why transport safety matters: a 150 kg bariatric patient on a stretcher has 50% more momentum than a 100 kg patient at the same speed, requiring proportionally more braking force.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Momentum", priority: "medium" },
  },

  {
    id: "cp-n3-018",
    type: "mcq",
    prompt: "Friction in the breathing circuit increases when corrugated tubing has moisture buildup. In physics, friction is a force that:",
    setup: "",
    ans: [
      { t: "Opposes relative motion between surfaces and converts kinetic energy into thermal energy", ok: true  },
      { t: "Acts perpendicular to surfaces in contact and accelerates objects away from each other",   ok: false },
      { t: "Only exists between solid surfaces and has no relevance to gas flow through tubing",       ok: false },
      { t: "Increases the velocity of gas flow by channeling it through a narrower effective pathway",  ok: false },
    ],
    rationale: "Friction opposes the relative motion of surfaces in contact, converting kinetic energy to heat. In breathing circuits, internal surface roughness and condensation increase frictional resistance to gas flow. This is analogous to vascular resistance: rough or narrowed vessels increase the work needed to maintain blood flow.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Friction", priority: "medium" },
  },

  {
    id: "cp-n3-019",
    type: "mcq",
    prompt: "A 70 kg patient weighs 686 N on Earth (g = 9.8 m/s²). On Mars where g = 3.7 m/s², what is the patient's weight?",
    setup: "",
    ans: [
      { t: "259 N — weight on Mars equals 70 kg multiplied by the Martian gravitational acceleration", ok: true  },
      { t: "686 N — weight is constant regardless of the planet because mass does not change at all",   ok: false },
      { t: "26.5 N — weight on Mars equals Earth weight divided by the ratio of gravitational values",  ok: false },
      { t: "490 N — weight on Mars is exactly half of Earth weight because Mars is half the size",       ok: false },
    ],
    rationale: "Weight = mass × local g. On Mars: W = 70 × 3.7 = 259 N. Mass remains 70 kg everywhere. This reinforces why anesthesia dosing uses mass (kg) rather than weight (N) — a drug dose that is correct on Earth remains correct in any gravitational field because pharmacokinetics depend on the amount of matter, not gravitational force.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Mass vs Weight", priority: "medium" },
  },

  {
    id: "cp-n3-020",
    type: "mcq",
    prompt: "A mercury barometer reads 750 mmHg on a stormy day. How does this compare to the standard atmospheric pressure of 760 mmHg?",
    setup: "",
    ans: [
      { t: "The pressure is below standard — low barometric pressure is associated with storm systems", ok: true  },
      { t: "The pressure is above standard — storms create higher atmospheric pressure in the region",   ok: false },
      { t: "The reading is identical to standard — 10 mmHg difference is within normal measurement error", ok: false },
      { t: "The barometer is malfunctioning — atmospheric pressure cannot drop below 760 mmHg at sea level", ok: false },
    ],
    rationale: "Standard atmospheric pressure is 760 mmHg; 750 mmHg is below standard. Low-pressure weather systems are associated with storms. Barometric pressure changes affect vaporizer output (variable-bypass vaporizers deliver a set concentration, but partial pressure changes with Patm) and gas volumes in closed body spaces per Boyle's law.",
    scene: "pressure_depth",
    sceneCfg: { label: "BAROMETER — READING Patm" },
    metadata: { topic: "Pressure Measurement", priority: "medium" },
  },

  {
    id: "cp-n3-021",
    type: "mcq",
    prompt: "A manometer uses a liquid column to measure low pressures, while a Bourdon gauge uses a coiled metal tube for high pressures. Which statement best compares these two devices?",
    setup: "",
    ans: [
      { t: "Manometers are accurate at low pressures; Bourdon gauges handle high pressures without liquid columns", ok: true  },
      { t: "Both devices require mercury columns and differ only in the diameter of the tubing they employ",         ok: false },
      { t: "Bourdon gauges measure only atmospheric pressure while manometers measure only gas cylinder pressure",   ok: false },
      { t: "Manometers are used for gas cylinders and Bourdon gauges are used for central venous pressure lines",    ok: false },
    ],
    rationale: "Manometers measure relatively low pressures (e.g., airway pressure, CVP) using a liquid column whose height reflects the applied pressure. Bourdon gauges measure high pressures (e.g., gas cylinders at 750–2200 PSI) via a curved metal tube that straightens proportionally to internal pressure. Choosing the right instrument depends on the pressure range being measured.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Pressure Measurement", priority: "medium" },
  },

  {
    id: "cp-n3-022",
    type: "mcq",
    prompt: "Desflurane has a vapor pressure of approximately 669 mmHg at 20°C. Standard atmospheric pressure is 760 mmHg. What is the clinical implication of desflurane's vapor pressure being so close to 1 atm?",
    setup: "",
    ans: [
      { t: "Desflurane nearly boils at room temperature, requiring a specially heated and pressurized vaporizer", ok: true  },
      { t: "Desflurane cannot vaporize at room temperature because its vapor pressure is below atmospheric",      ok: false },
      { t: "Desflurane has the lowest volatility of all agents, making it the safest for standard vaporizers",    ok: false },
      { t: "Desflurane's vapor pressure has no special clinical significance compared to sevoflurane or isoflurane", ok: false },
    ],
    rationale: "A liquid boils when its vapor pressure equals ambient pressure. Desflurane's VP of 669 mmHg at 20°C is very close to 760 mmHg, so even slight warming above room temperature could cause it to boil uncontrollably in a standard vaporizer. The Tec 6 vaporizer heats desflurane to 39°C and uses electronic flow control to deliver precise concentrations safely.",
    scene: "gas_piston",
    sceneCfg: { label: "DESFLURANE VP ≈ 669 mmHg at 20°C" },
    metadata: { topic: "Vapor Pressure", priority: "high" },
  },

  {
    id: "cp-n3-023",
    type: "mcq",
    prompt: "Endotracheal tube (ETT) cuff pressure should be maintained between 20–30 cmH₂O. A cuff pressure of 40 cmH₂O risks which complication?",
    setup: "",
    ans: [
      { t: "Tracheal mucosal ischemia — the cuff pressure exceeds capillary perfusion pressure of the mucosa", ok: true  },
      { t: "Cuff rupture and immediate loss of the airway seal leading to massive air leak around the tube",    ok: false },
      { t: "Barotrauma to the lung parenchyma since cuff pressure is transmitted directly to the alveoli",      ok: false },
      { t: "Negative pressure pulmonary edema caused by the high-pressure cuff obstructing expiratory flow",    ok: false },
    ],
    rationale: "Tracheal mucosal capillary perfusion pressure is approximately 25–35 cmH₂O. ETT cuff pressures exceeding 30 cmH₂O compress the mucosal capillaries, causing ischemia that can lead to tracheal stenosis or tracheomalacia. Keeping cuff pressure at 20–30 cmH₂O balances adequate seal against mucosal perfusion.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Pressure Fundamentals", priority: "high" },
  },

  {
    id: "cp-n3-024",
    type: "mcq",
    prompt: "Compartment syndrome develops when tissue pressure in a fascial compartment exceeds capillary perfusion pressure. Normal compartment pressure is below 10 mmHg. At what threshold is surgical intervention typically warranted?",
    setup: "",
    ans: [
      { t: "When compartment pressure exceeds 30 mmHg or is within 30 mmHg of diastolic blood pressure", ok: true  },
      { t: "When compartment pressure reaches 15 mmHg since any elevation above normal requires surgery", ok: false },
      { t: "Only when compartment pressure exceeds systolic blood pressure and all perfusion has ceased",  ok: false },
      { t: "Compartment syndrome is diagnosed by nerve conduction alone and pressure is never measured",   ok: false },
    ],
    rationale: "Compartment pressures above 30 mmHg (or within 30 mmHg of diastolic pressure — the 'delta pressure') compromise local perfusion and cause tissue ischemia. Fasciotomy is indicated to restore blood flow. Prolonged lithotomy or lateral positioning during anesthesia can contribute to compartment syndrome, making pressure awareness a clinical concern for CRNAs.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Pressure Fundamentals", priority: "high" },
  },

  {
    id: "cp-n3-025",
    type: "mcq",
    prompt: "A Venturi mask entrains room air through side ports using the Bernoulli effect. Which principle explains why high-velocity oxygen flow through a narrow jet entrains surrounding air?",
    setup: "",
    ans: [
      { t: "As gas velocity increases through the jet, lateral pressure drops and room air is drawn in", ok: true  },
      { t: "The oxygen jet heats surrounding air, causing it to expand and flow into the mask passively", ok: false },
      { t: "Turbulence at the jet orifice creates positive pressure that pushes room air into the mask",  ok: false },
      { t: "Oxygen is denser than nitrogen, so it displaces room air downward and into the mask opening",  ok: false },
    ],
    rationale: "The Bernoulli principle states that as fluid velocity increases, lateral (static) pressure decreases. In a Venturi mask, oxygen flows at high velocity through a narrow jet, creating a region of low pressure that entrains room air through side ports. The size of the entrainment ports determines the final FiO₂ — larger ports entrain more air and deliver a lower, more precise FiO₂.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Pressure Fundamentals", priority: "high" },
  },

];

export const CP_NODE3_METADATA = {
  nodeId:   "cp-node-3",
  courseId: "chem-phys-anesthesia",
  chapter:  "Physics I",
  title:    "Physics I — Forces, Pressure & Measurement",
  totalQuestions: CP_NODE3_QUESTIONS.length,
  questionTypes: {
    mcq:   CP_NODE3_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: CP_NODE3_QUESTIONS.filter(q => q.type === 'multi').length,
    short: CP_NODE3_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
