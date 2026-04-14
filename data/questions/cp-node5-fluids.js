/**
 * Chemistry & Physics for Anesthesia — Node 5
 * Fluids — Hydrostatics & Hydrodynamics
 *
 * Topics: fluid definition, hydrostatic pressure (P = ρgh),
 * arterial line transducer leveling, IV bag elevation,
 * cerebral perfusion pressure, Poiseuille's law, Reynolds number.
 *
 * Source: NAS 510 Fluids Lecture
 */

export const CP_NODE5_QUESTIONS = [

  // ═══════════════════════════════════════════════════════════════════════════
  // FLUID BASICS & DEFINITIONS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n5-001",
    type: "mcq",
    prompt: "In physics, what defines a 'fluid' as distinct from a solid?",
    setup: "",
    ans: [
      { t: "A substance that takes the shape of its container and flows under shear stress", ok: true  },
      { t: "Any substance that exists exclusively in the liquid state at room temperature",  ok: false },
      { t: "A material with a fixed shape that resists deformation under applied pressure",  ok: false },
      { t: "Only aqueous solutions that contain dissolved solutes and can conduct electricity", ok: false },
    ],
    rationale: "Fluids are substances that continuously deform under shear stress and conform to the shape of their container. This includes both liquids and gases. In anesthesia, blood, IV crystalloids, and anesthetic gases are all fluids. Solids resist shear and maintain their own shape.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Fluid Definition", priority: "medium" },
  },

  {
    id: "cp-n5-002",
    type: "multi",
    prompt: "Select the THREE substances that qualify as fluids in the physics sense:",
    setup: "",
    choices: [
      "Blood flowing through the arterial vasculature of a patient under anesthesia",
      "Sevoflurane vapor carried in the fresh gas flow of an anesthesia breathing circuit",
      "A stainless steel laryngoscope blade resting on the instrument tray in the OR",
      "Lactated Ringer's solution infusing through an 18-gauge peripheral IV catheter",
      "A rigid endotracheal tube made of polyvinyl chloride sitting in its packaging",
    ],
    correctAnswers: [
      "Blood flowing through the arterial vasculature of a patient under anesthesia",
      "Sevoflurane vapor carried in the fresh gas flow of an anesthesia breathing circuit",
      "Lactated Ringer's solution infusing through an 18-gauge peripheral IV catheter",
    ],
    selectCount: 3,
    rationale: "Fluids include any substance that takes the shape of its container — liquids (blood, LR) and gases (sevoflurane vapor) all qualify. The laryngoscope blade and ETT are solids that maintain their own shape. In anesthesia practice, we work with fluids constantly: IV solutions, inhaled agents, and the patient's own blood.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Fluid Definition", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HYDROSTATIC PRESSURE — P = ρgh
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n5-003",
    type: "mcq",
    prompt: "Hydrostatic pressure is described by P = ρgh. Which variable does NOT affect the pressure at a given depth?",
    setup: "",
    ans: [
      { t: "The shape of the container or the total volume of fluid it holds",    ok: true  },
      { t: "The density (ρ) of the fluid filling the container at that depth",    ok: false },
      { t: "The height (h) of the fluid column measured above the point in question", ok: false },
      { t: "The acceleration due to gravity (g) acting on the fluid column mass", ok: false },
    ],
    rationale: "P = ρgh tells us that hydrostatic pressure depends only on fluid density, gravitational acceleration, and the depth of the fluid column. The container's shape and total volume are irrelevant — a narrow tube and a wide beaker of the same fluid at the same depth exert identical pressure. This is Pascal's principle.",
    scene: "pressure_depth",
    sceneCfg: { label: "P = ρgh — SHAPE IRRELEVANT" },
    metadata: { topic: "Hydrostatic Pressure", priority: "high" },
  },

  {
    id: "cp-n5-004",
    type: "mcq",
    prompt: "A diver descends deeper underwater. What happens to the hydrostatic pressure on the diver's body?",
    setup: "",
    ans: [
      { t: "Pressure increases linearly with depth because h increases in P = ρgh",  ok: true  },
      { t: "Pressure decreases as the diver moves farther from the water's surface",  ok: false },
      { t: "Pressure remains constant regardless of depth in an incompressible fluid", ok: false },
      { t: "Pressure fluctuates unpredictably depending on the ocean current velocity", ok: false },
    ],
    rationale: "Hydrostatic pressure increases with depth (h) according to P = ρgh. For every 10 meters of seawater descent, pressure increases by approximately 1 atmosphere. This is why divers must equalize pressure in body cavities and why nitrogen narcosis and oxygen toxicity become concerns at depth.",
    scene: "pressure_depth",
    sceneCfg: { label: "DEEPER = MORE PRESSURE" },
    metadata: { topic: "Hydrostatic Pressure", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ARTERIAL LINE TRANSDUCER & CLINICAL APPLICATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n5-005",
    type: "mcq",
    prompt: "An arterial line transducer is raised above the phlebostatic axis. In which direction does the displayed blood pressure reading change?",
    setup: "",
    ans: [
      { t: "The displayed pressure reads falsely LOW because the hydrostatic column subtracts from the measurement", ok: true  },
      { t: "The displayed pressure reads falsely HIGH because raising the transducer adds hydrostatic pressure",     ok: false },
      { t: "The displayed pressure is unaffected because transducer height does not influence the pressure reading",  ok: false },
      { t: "The arterial waveform becomes dampened but the numeric mean pressure value remains accurate and correct", ok: false },
    ],
    rationale: "Raising the transducer above the patient creates a hydrostatic column that subtracts from the measured pressure — the monitor reads lower than actual. The mnemonic is: transducer HIGH = reads LOW; transducer LOW = reads HIGH. Always zero the transducer at the phlebostatic axis (4th intercostal space, mid-axillary line) to eliminate hydrostatic error.",
    scene: "pressure_depth",
    sceneCfg: { label: "TRANSDUCER HIGH → READS LOW" },
    metadata: { topic: "Arterial Line Leveling", priority: "high" },
  },

  {
    id: "cp-n5-006",
    type: "mcq",
    prompt: "The phlebostatic axis — used to zero arterial and CVP transducers — is located at which anatomical landmark?",
    setup: "",
    ans: [
      { t: "Fourth intercostal space at the mid-axillary line, approximating the right atrium", ok: true  },
      { t: "Second intercostal space at the right sternal border, approximating the aortic root", ok: false },
      { t: "Angle of Louis at the manubriosternal junction, level with the carina of trachea",  ok: false },
      { t: "Xiphoid process at the lower sternal border, approximating the diaphragm position",  ok: false },
    ],
    rationale: "The phlebostatic axis is the external reference point for the right atrium: 4th intercostal space, mid-axillary line. Zeroing the transducer here ensures that hydrostatic effects of the fluid column between the transducer and the heart are eliminated. Incorrect leveling introduces systematic error proportional to the height difference.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Arterial Line Leveling", priority: "high" },
  },

  {
    id: "cp-n5-007",
    type: "short",
    prompt: "If the arterial line transducer is LOWERED below the phlebostatic axis, the displayed blood pressure reads falsely ___.",
    setup: "",
    acceptedAnswers: ["high", "HIGH", "falsely high", "too high", "elevated"],
    canonicalAnswer: "Falsely high",
    rationale: "Lowering the transducer below the patient means the hydrostatic column above the transducer adds to the measured pressure. The monitor displays a value higher than the patient's actual arterial pressure. Remember: transducer low = reads high; transducer high = reads low.",
    scene: "pressure_depth",
    sceneCfg: { label: "TRANSDUCER LOW → READS HIGH" },
    metadata: { topic: "Arterial Line Leveling", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // IV BAGS, HEAD POSITIONING, ATMOSPHERIC PRESSURE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n5-008",
    type: "mcq",
    prompt: "Why must a gravity-driven IV bag be elevated above the level of the patient's IV site?",
    setup: "",
    ans: [
      { t: "The height creates a hydrostatic pressure gradient (P = ρgh) that drives fluid flow into the vein", ok: true  },
      { t: "Elevation increases the osmolarity of the IV solution causing it to flow down the concentration gradient", ok: false },
      { t: "The IV tubing contains one-way valves that only permit flow when the bag is in an elevated position",  ok: false },
      { t: "Atmospheric pressure acts only on elevated fluid bags, not on those placed level with the patient",   ok: false },
    ],
    rationale: "Gravity-driven IV flow depends entirely on hydrostatic pressure. Elevating the bag creates a height difference (h) between the fluid level and the IV site. P = ρgh generates the pressure gradient that overcomes venous pressure and tubing resistance to drive flow. Raising the bag higher increases flow rate; lowering it can stop or reverse flow.",
    scene: "pressure_depth",
    sceneCfg: { label: "IV BAG ELEVATION → FLOW" },
    metadata: { topic: "IV Flow Mechanics", priority: "high" },
  },

  {
    id: "cp-n5-009",
    type: "mcq",
    prompt: "A patient is placed in a head-up (reverse Trendelenburg) position during surgery. What is the primary concern for cerebral perfusion?",
    setup: "",
    ans: [
      { t: "Hydrostatic pressure reduces cerebral perfusion pressure as the brain is above the heart level", ok: true  },
      { t: "Head-up tilt compresses the vertebral arteries mechanically reducing cerebral blood volume",    ok: false },
      { t: "Cerebral autoregulation is abolished in all anesthetized patients placed in head-up positions",  ok: false },
      { t: "Gravity shifts all blood to the cerebral vasculature causing dangerously elevated ICP readings", ok: false },
    ],
    rationale: "When the head is above the heart, the brain sits at the top of a hydrostatic column. Arterial pressure at the brain level is MAP minus the hydrostatic column height (roughly 1 mmHg per 1.36 cm above the heart). In steep head-up position, this can significantly reduce cerebral perfusion pressure. Anesthesia providers must account for this when managing beach-chair or sitting-position cases.",
    scene: "pressure_depth",
    sceneCfg: { label: "HEAD-UP → REDUCED CPP" },
    metadata: { topic: "Cerebral Perfusion", priority: "high" },
  },

  {
    id: "cp-n5-010",
    type: "mcq",
    prompt: "Atmospheric pressure at the summit of Mt. Everest is approximately 253 mmHg compared to 760 mmHg at sea level. Which principle explains this difference?",
    setup: "",
    ans: [
      { t: "There is less atmosphere above — the shorter column of air exerts less pressure at higher altitude", ok: true  },
      { t: "Temperature at the summit is lower, which directly reduces the barometric pressure by half",       ok: false },
      { t: "Wind velocity at extreme altitude creates a vacuum effect that lowers the local air pressure",     ok: false },
      { t: "The gravitational constant decreases proportionally with altitude, reducing atmospheric weight",    ok: false },
    ],
    rationale: "Atmospheric pressure is the weight of the column of air above you. At higher altitudes, there is less air above, so the pressure is lower. This has direct clinical implications: lower barometric pressure reduces the partial pressure of inspired oxygen (PiO₂ = FiO₂ × (Patm − PH₂O)), which is why supplemental oxygen is needed at altitude.",
    scene: "pressure_depth",
    sceneCfg: { label: "ALTITUDE → LOWER Patm" },
    metadata: { topic: "Atmospheric Pressure", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HYDRODYNAMICS — FLOW, POISEUILLE, REYNOLDS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n5-011",
    type: "mcq",
    prompt: "According to the Poiseuille relationship (Flow = ΔP / R), which change most dramatically increases flow through an IV catheter?",
    setup: "",
    ans: [
      { t: "Increasing the catheter radius — resistance falls with the fourth power of radius (r⁴)", ok: true  },
      { t: "Doubling the length of the catheter tubing from 6 inches to 12 inches total length",    ok: false },
      { t: "Switching from crystalloid to a more viscous colloid solution for volume resuscitation",  ok: false },
      { t: "Decreasing the height of the IV bag above the patient to reduce the pressure gradient",  ok: false },
    ],
    rationale: "Poiseuille's law states R = 8ηL / πr⁴. Resistance is inversely proportional to the fourth power of the radius. Doubling the radius decreases resistance 16-fold, massively increasing flow. This is why a short, large-bore (14G or 16G) peripheral IV delivers fluid faster than a long, narrow central line for rapid resuscitation.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "RADIUS⁴ — BIGGEST FACTOR" },
    metadata: { topic: "Poiseuille's Law", priority: "high" },
  },

  {
    id: "cp-n5-012",
    type: "mcq",
    prompt: "The Reynolds number predicts whether flow through a tube will be laminar or turbulent. Which statement about the Reynolds number is correct?",
    setup: "",
    ans: [
      { t: "It is dimensionless and flow becomes turbulent when it exceeds approximately 2,000–4,000", ok: true  },
      { t: "It is measured in pascals and turbulence occurs when it drops below 1,000 pascal threshold", ok: false },
      { t: "It is measured in liters per minute and laminar flow occurs only above 4,000 L/min values",  ok: false },
      { t: "It applies only to gas flow in the airways and has no relevance to blood flow in vessels",   ok: false },
    ],
    rationale: "The Reynolds number (Re = ρvd/η) is a dimensionless quantity. When Re < ~2,000, flow tends to be laminar (orderly, parabolic profile). When Re > ~4,000, flow becomes turbulent (chaotic, energy-wasting). Between 2,000 and 4,000 is a transitional zone. Turbulence increases resistance, requiring more pressure to maintain the same flow. Clinically, turbulent flow occurs at airway bifurcations, stenotic vessels, and kinked ETTs.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "REYNOLDS NUMBER — LAMINAR vs TURBULENT" },
    metadata: { topic: "Reynolds Number", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEW QUESTIONS 13–25
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n5-013",
    type: "mcq",
    prompt: "Poiseuille's law states R = 8ηL/πr⁴. If catheter length doubles while all other variables remain constant, how does resistance change?",
    setup: "",
    ans: [
      { t: "Resistance doubles — it is directly proportional to the length of the catheter tubing",  ok: true  },
      { t: "Resistance quadruples — length has an exponential relationship with flow resistance",     ok: false },
      { t: "Resistance is halved — longer tubing allows more laminar flow, reducing total resistance", ok: false },
      { t: "Resistance is unchanged — length has no effect on resistance in the Poiseuille equation",  ok: false },
    ],
    rationale: "In Poiseuille's law, resistance is directly proportional to length (R ∝ L). Doubling length doubles resistance. However, length has far less impact than radius — doubling length only doubles resistance, while halving radius increases resistance 16-fold. This is why short, large-bore catheters are preferred for rapid fluid resuscitation.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "RESISTANCE ∝ LENGTH" },
    metadata: { topic: "Poiseuille's Law", priority: "high" },
  },

  {
    id: "cp-n5-014",
    type: "mcq",
    prompt: "During massive hemorrhage, a trauma surgeon requests the fastest IV access possible. Which catheter provides the highest flow rate based on Poiseuille's law?",
    setup: "",
    ans: [
      { t: "A short 14-gauge peripheral IV — large radius and short length minimize resistance maximally",  ok: true  },
      { t: "A long 18-gauge central venous catheter — its direct access to the central vein increases flow", ok: false },
      { t: "A 22-gauge arterial catheter — arterial pressure provides a higher driving gradient for flow",   ok: false },
      { t: "A 20-gauge IV with extension tubing — the added length stabilizes laminar flow and boosts rate", ok: false },
    ],
    rationale: "Flow ∝ r⁴/L (Poiseuille). A 14G peripheral IV has a large radius (~1.0 mm) and short length (~5 cm). A triple-lumen central line has narrow lumens (~0.5 mm) and long length (~20 cm). Despite central venous access, the CVC delivers far less flow per lumen than the short, wide peripheral catheter. For rapid resuscitation, large-bore peripheral IVs are superior.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "SHORT + WIDE = MAX FLOW" },
    metadata: { topic: "Poiseuille's Law", priority: "high" },
  },

  {
    id: "cp-n5-015",
    type: "mcq",
    prompt: "Viscosity (η) appears in Poiseuille's law as R = 8ηL/πr⁴. How does whole blood viscosity compare to crystalloid, and what is the clinical implication?",
    setup: "",
    ans: [
      { t: "Blood is 3–4 times more viscous than crystalloid, so it flows slower through the same catheter", ok: true  },
      { t: "Blood and crystalloid have identical viscosity because both are water-based fluid preparations",   ok: false },
      { t: "Crystalloid is more viscous than blood because dissolved electrolytes increase internal friction",  ok: false },
      { t: "Viscosity is irrelevant to flow rate since pressure gradient alone determines catheter flow speed", ok: false },
    ],
    rationale: "Whole blood viscosity is approximately 3–4 centipoise (cP) vs ~1 cP for crystalloid (similar to water). Since resistance is directly proportional to viscosity, blood flows 3–4 times more slowly than crystalloid through the same catheter at the same driving pressure. This is why packed RBCs are often infused through large-bore IVs with pressure bags or rapid infusers.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Viscosity", priority: "high" },
  },

  {
    id: "cp-n5-016",
    type: "mcq",
    prompt: "Hematocrit strongly influences blood viscosity. A patient with polycythemia vera has a hematocrit of 65%. What effect does this have on blood flow?",
    setup: "",
    ans: [
      { t: "Markedly increased viscosity raises vascular resistance and reduces flow at a given pressure gradient", ok: true  },
      { t: "Elevated hematocrit decreases viscosity because more red cells create streamlined laminar flow patterns", ok: false },
      { t: "Hematocrit above 50% has no additional effect on viscosity once the blood is fully saturated with cells", ok: false },
      { t: "High hematocrit increases flow rate because more red cells generate higher oncotic driving pressure",     ok: false },
    ],
    rationale: "Blood viscosity rises exponentially with hematocrit above ~45%. At Hct 65%, viscosity can be 3–5 times normal, dramatically increasing vascular resistance and cardiac workload. This is why polycythemia patients are at risk for thrombosis and why phlebotomy or hemodilution may be necessary before anesthesia. Conversely, severe anemia (low Hct) reduces viscosity but compromises oxygen delivery.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Viscosity", priority: "high" },
  },

  {
    id: "cp-n5-017",
    type: "mcq",
    prompt: "The Reynolds number (Re = ρvd/η) is dimensionless. Which factor in the formula represents the tube diameter, and what happens to flow as diameter increases?",
    setup: "",
    ans: [
      { t: "The variable d is tube diameter — larger diameter raises Re and promotes turbulent flow at a given velocity", ok: true  },
      { t: "The variable ρ is tube diameter — density and diameter are the same variable in the Reynolds equation",       ok: false },
      { t: "The variable η is tube diameter — viscosity and diameter are interchangeable in the dimensionless ratio",     ok: false },
      { t: "Diameter is not part of the Reynolds equation — only velocity and density determine turbulence onset",        ok: false },
    ],
    rationale: "Re = ρvd/η where ρ = density, v = velocity, d = diameter, η = viscosity. Larger diameter increases Re, making turbulence more likely at a given velocity. In the aorta (large d) and at branch points where velocity increases, Re exceeds 2000 and flow becomes turbulent — producing Korotkoff sounds (blood pressure measurement) and cardiac murmurs.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "Re = ρvd/η — TURBULENCE PREDICTOR" },
    metadata: { topic: "Reynolds Number", priority: "medium" },
  },

  {
    id: "cp-n5-018",
    type: "mcq",
    prompt: "Laminar flow has a parabolic velocity profile: fastest in the center and zero at the wall. Turbulent flow has a flattened profile. Which type of flow requires MORE driving pressure for the same flow rate?",
    setup: "",
    ans: [
      { t: "Turbulent flow — chaotic motion wastes energy, requiring higher pressure to maintain the same flow rate", ok: true  },
      { t: "Laminar flow — the parabolic profile creates more friction at the wall, requiring more driving pressure",  ok: false },
      { t: "Both require identical driving pressure because total flow rate is the same in both flow conditions",       ok: false },
      { t: "Neither — driving pressure depends only on tube dimensions, not on the type of flow occurring within it",  ok: false },
    ],
    rationale: "In laminar flow, pressure drop is proportional to flow rate (ΔP ∝ Q). In turbulent flow, pressure drop is proportional to flow rate squared (ΔP ∝ Q²). Turbulence dissipates energy through random molecular collisions and eddies, requiring significantly more pressure to maintain the same volumetric flow. This is why conditions promoting turbulence (narrow ETT, bronchospasm) dramatically increase the work of breathing.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "TURBULENT = MORE PRESSURE NEEDED" },
    metadata: { topic: "Laminar vs Turbulent", priority: "high" },
  },

  {
    id: "cp-n5-019",
    type: "mcq",
    prompt: "The Bernoulli principle states that as fluid velocity increases through a constriction, lateral pressure decreases. How is this applied in a nebulizer?",
    setup: "",
    ans: [
      { t: "High-velocity gas past a liquid reservoir creates low pressure that draws medication up into the stream", ok: true  },
      { t: "High-pressure gas compresses the nebulizer reservoir, forcing liquid medication out through a nozzle",    ok: false },
      { t: "Ultrasonic vibrations from the gas flow shatter liquid into aerosol droplets inside the nebulizer cup",   ok: false },
      { t: "The gas cools as it flows through the nebulizer, causing medication vapor to condense into fine droplets", ok: false },
    ],
    rationale: "In a jet nebulizer, compressed gas flows at high velocity past a capillary tube immersed in liquid medication. Per Bernoulli's principle, the high-velocity stream creates low lateral pressure, drawing liquid up the tube (entrainment). The liquid is then shattered into aerosol by the gas stream. This is the same principle behind Venturi masks and suction ejectors.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Bernoulli Principle", priority: "high" },
  },

  {
    id: "cp-n5-020",
    type: "mcq",
    prompt: "According to Poiseuille's law, resistance is inversely proportional to the fourth power of the radius (R ∝ 1/r⁴). If the radius of an IV catheter is doubled, by what factor does flow increase?",
    setup: "",
    ans: [
      { t: "16-fold — because r⁴ means doubling the radius reduces resistance by a factor of sixteen",           ok: true  },
      { t: "2-fold — flow increases in direct linear proportion to any increase in the catheter radius",           ok: false },
      { t: "4-fold — flow increases with the square of the radius, not the fourth power as commonly stated",       ok: false },
      { t: "8-fold — the radius is cubed in the Poiseuille relationship for flow through clinical IV catheters",   ok: false },
    ],
    rationale: "Poiseuille's law states R = 8ηL/πr⁴. Since resistance is inversely proportional to r⁴, doubling the radius reduces resistance by 2⁴ = 16-fold, increasing flow 16-fold at the same driving pressure. This r⁴ relationship is why large-bore peripheral IVs are so much more effective for rapid resuscitation than smaller catheters, and why even a small reduction in ETT size dramatically increases airway resistance.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "DOUBLE RADIUS = 16× FLOW" },
    metadata: { topic: "Poiseuille's Law", priority: "high" },
  },

  {
    id: "cp-n5-021",
    type: "mcq",
    prompt: "The Coanda effect describes the tendency of a fluid jet to follow a nearby curved surface rather than traveling in a straight line. Where is this effect clinically relevant?",
    setup: "",
    ans: [
      { t: "In aortic regurgitation jets that follow the ventricular wall, making echocardiographic assessment complex", ok: true  },
      { t: "In the anesthesia machine flowmeter where gas flows in perfectly straight laminar columns at all flow rates", ok: false },
      { t: "In the oxygen flush valve where gas always travels in a straight line directly to the breathing circuit",     ok: false },
      { t: "Only in aerospace engineering — the Coanda effect has no relevance to medicine or fluid physiology",          ok: false },
    ],
    rationale: "The Coanda effect causes a jet of fluid to 'stick' to an adjacent surface due to entrainment of surrounding fluid. In echocardiography, regurgitant jets often adhere to cardiac chamber walls (wall-hugging jets), making them appear smaller on color-flow Doppler and leading to underestimation of regurgitation severity. Awareness of this effect improves diagnostic accuracy.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Coanda Effect", priority: "medium" },
  },

  {
    id: "cp-n5-022",
    type: "mcq",
    prompt: "A patient stands upright. The venous pressure in the foot is approximately 90 mmHg, while the venous pressure at the level of the heart is near 0 mmHg. What accounts for this difference?",
    setup: "",
    ans: [
      { t: "The hydrostatic column of blood between the heart and foot adds pressure proportional to the height", ok: true  },
      { t: "Venous valves in the lower extremity actively pump blood, generating 90 mmHg of additional pressure",  ok: false },
      { t: "Arterial blood pressure is transmitted directly to the venous system in the lower extremities only",   ok: false },
      { t: "Gravity compresses the foot veins mechanically, raising their pressure independently of blood column",  ok: false },
    ],
    rationale: "Venous pressure in a standing patient reflects the hydrostatic column of blood from the heart to the measurement point. The distance from heart to foot (~120 cm) creates roughly 90 mmHg of hydrostatic pressure (120 cm / 1.36 cm per mmHg ≈ 88 mmHg). Above the heart, venous pressures become subatmospheric. This gradient drives venous pooling in dependent areas under anesthesia.",
    scene: "pressure_depth",
    sceneCfg: { label: "VENOUS HYDROSTATIC GRADIENT" },
    metadata: { topic: "Hydrostatic Pressure", priority: "high" },
  },

  {
    id: "cp-n5-023",
    type: "mcq",
    prompt: "Trendelenburg position (head down, feet up) is sometimes used to treat hypotension. What is the proposed hemodynamic mechanism?",
    setup: "",
    ans: [
      { t: "Gravity redistributes venous blood from the lower extremities toward the heart, augmenting preload", ok: true  },
      { t: "The position compresses the abdominal aorta, increasing systemic vascular resistance substantially", ok: false },
      { t: "Head-down tilt directly stimulates baroreceptors in the neck, causing reflex vasoconstriction",      ok: false },
      { t: "Trendelenburg increases cerebral metabolic rate, which reflexively raises cardiac output and MAP",    ok: false },
    ],
    rationale: "In Trendelenburg position, the lower extremities are elevated above the heart, and gravity shifts venous blood centrally. This increases venous return and right atrial pressure (preload), potentially increasing stroke volume via the Frank-Starling mechanism. However, evidence for its effectiveness is mixed, and the position can impair ventilation by pushing abdominal contents against the diaphragm.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Hydrostatic Pressure", priority: "medium" },
  },

  {
    id: "cp-n5-024",
    type: "mcq",
    prompt: "The central venous pressure (CVP) waveform has several components: a, c, x, v, and y waves. The 'a' wave corresponds to which cardiac event?",
    setup: "",
    ans: [
      { t: "Atrial contraction — the a wave reflects the rise in atrial pressure during active atrial systole", ok: true  },
      { t: "Aortic valve opening — the a wave reflects the pressure surge as blood enters the aortic arch",     ok: false },
      { t: "Atrial relaxation — the a wave is the pressure decrease as the atrium begins to refill passively",  ok: false },
      { t: "AV valve closure — the a wave marks the rise in ventricular pressure at the onset of systole",      ok: false },
    ],
    rationale: "The CVP 'a' wave corresponds to atrial contraction (atrial systole). The 'c' wave reflects tricuspid valve closure and bulging into the atrium. The 'x' descent represents atrial relaxation. The 'v' wave is passive atrial filling during ventricular systole. The 'y' descent occurs when the tricuspid valve opens and the atrium empties into the ventricle.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "CVP Waveform", priority: "high" },
  },

  {
    id: "cp-n5-025",
    type: "mcq",
    prompt: "The Venturi effect is applied in anesthesia Venturi masks to deliver precise FiO₂. If the entrainment ports on a Venturi mask are made LARGER, what happens to the delivered FiO₂?",
    setup: "",
    ans: [
      { t: "FiO₂ decreases — larger ports entrain more room air, diluting the oxygen concentration further", ok: true  },
      { t: "FiO₂ increases — larger ports allow more oxygen to enter the mask from the surrounding environment", ok: false },
      { t: "FiO₂ is unchanged — port size affects only total flow rate without altering the oxygen fraction",    ok: false },
      { t: "FiO₂ becomes unpredictable — larger ports create turbulence that prevents consistent gas mixing",    ok: false },
    ],
    rationale: "In a Venturi mask, oxygen flows through a narrow jet, creating low lateral pressure that entrains room air (21% O₂) through side ports. Larger entrainment ports draw in more room air, increasing total flow but diluting the oxygen fraction. This is how Venturi masks deliver precise, fixed FiO₂ values (24%, 28%, 31%, 35%, 40%, 50%) by varying port size.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Bernoulli Principle", priority: "high" },
  },

];

export const CP_NODE5_METADATA = {
  nodeId:   "cp-node-5",
  courseId: "chem-phys-anesthesia",
  chapter:  "Fluids",
  title:    "Fluids — Hydrostatics & Hydrodynamics",
  totalQuestions: CP_NODE5_QUESTIONS.length,
  questionTypes: {
    mcq:   CP_NODE5_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: CP_NODE5_QUESTIONS.filter(q => q.type === 'multi').length,
    short: CP_NODE5_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
