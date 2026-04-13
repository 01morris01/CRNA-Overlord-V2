/**
 * Chemistry & Physics for Anesthesia — Node 4
 * Physics II — Energy, Work & Ventilation
 * Source: NAS 510 Physics 2 lecture transcript
 *         (KE, PE, work, O₂ flush valve, APL valve, spontaneous vs positive
 *          pressure ventilation, barotrauma, work of breathing, terminal velocity)
 */

export const CP_NODE4_QUESTIONS = [

  // ═══════════════════════════════════════════════════════════════════════════
  // KINETIC & POTENTIAL ENERGY
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n4-001",
    type: "mcq",
    prompt: "A high-velocity asteroid carries enormous destructive potential because its energy of motion is very large. What type of energy does a moving object possess?",
    setup: "",
    ans: [
      { t: "Kinetic energy — the energy an object has due to its motion (KE = ½mv²)",                    ok: true  },
      { t: "Potential energy — the energy stored in an object due to its position or configuration",      ok: false },
      { t: "Thermal energy — the total internal energy from random molecular vibration and rotation",     ok: false },
      { t: "Chemical energy — energy stored in molecular bonds and released during chemical reactions",   ok: false },
    ],
    rationale: "Kinetic energy (KE = ½mv²) is the energy of motion. It depends on both mass and the square of velocity — doubling speed quadruples KE. The asteroid example illustrates why high velocity is so dangerous: KE scales with v², so even moderate mass at extreme speed carries devastating energy.",
    scene: "gas_piston",
    sceneCfg: { label: "KINETIC ENERGY = ½mv²" },
    metadata: { topic: "Kinetic Energy", priority: "high" },
  },

  {
    id: "cp-n4-002",
    type: "mcq",
    prompt: "A reservoir bag hanging above a patient on an IV pole stores energy by virtue of its elevated position. What form of energy does it possess?",
    setup: "",
    ans: [
      { t: "Gravitational potential energy — energy stored due to height above a reference point",        ok: true  },
      { t: "Kinetic energy — the bag possesses motion energy because gravity is pulling it downward",     ok: false },
      { t: "Elastic potential energy — the bag wall stretches and stores energy like a compressed spring", ok: false },
      { t: "Radiant energy — the bag absorbs overhead OR light and converts it to stored heat energy",    ok: false },
    ],
    rationale: "Gravitational potential energy (PE = mgh) depends on mass, gravitational acceleration, and height. An elevated IV bag uses this principle: fluid flows to the patient because the bag's PE converts to kinetic energy as fluid descends. Higher bag position = more driving pressure.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Potential Energy", priority: "medium" },
  },

  {
    id: "cp-n4-003",
    type: "mcq",
    prompt: "During mechanical ventilation, gas expands against the piston of a bellows ventilator. In physics, the product of force applied over a distance defines which quantity?",
    setup: "",
    ans: [
      { t: "Work — defined as force multiplied by the distance over which the force is applied (W = F × d)", ok: true  },
      { t: "Power — the rate at which energy is transferred, measured in watts or joules per second",         ok: false },
      { t: "Impulse — force multiplied by the time interval during which the force acts on the object",       ok: false },
      { t: "Torque — the rotational equivalent of force times the perpendicular lever arm distance",          ok: false },
    ],
    rationale: "Work = Force × Distance (W = Fd). When gas expands against a piston, the gas exerts a force over the distance the piston moves, performing work. In ventilation, the ventilator does work on the gas to push it into the lungs — this is the mechanical work of breathing.",
    scene: "gas_piston",
    sceneCfg: { label: "WORK = FORCE × DISTANCE" },
    metadata: { topic: "Work", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OXYGEN FLUSH VALVE & APL VALVE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n4-004",
    type: "mcq",
    prompt: "The oxygen flush valve delivers gas at 35–75 L/min at approximately 400 kPa, bypassing the vaporizer and flowmeters. What makes this the leading cause of barotrauma on the anesthesia machine?",
    setup: "",
    ans: [
      { t: "It delivers high flow at high pressure directly to the circuit, risking dangerous airway pressures", ok: true  },
      { t: "It adds anesthetic vapor at high concentration, causing overdose rather than pressure injury",        ok: false },
      { t: "It depletes the oxygen cylinder rapidly, leading to hypoxic gas delivery to the patient",             ok: false },
      { t: "It reverses flow direction in the circuit, creating negative pressure that collapses the lungs",      ok: false },
    ],
    rationale: "The O₂ flush valve bypasses flowmeters and vaporizer, delivering 35–75 L/min at ~400 kPa directly into the breathing circuit. If the APL valve is closed or the patient is connected to a closed circuit, this volume has nowhere to escape and airway pressure spikes rapidly, causing barotrauma (pneumothorax, pneumomediastinum). It is the leading cause of barotrauma from the anesthesia machine.",
    scene: "gas_piston",
    sceneCfg: { label: "O₂ FLUSH — 35-75 L/min @ 400 kPa" },
    metadata: { topic: "O₂ Flush Valve", priority: "high" },
  },

  {
    id: "cp-n4-005",
    type: "mcq",
    prompt: "The APL (adjustable pressure-limiting) valve controls how much pressure builds in the breathing circuit during manual ventilation. What happens when the APL valve is fully closed?",
    setup: "",
    ans: [
      { t: "All pressure is directed to the patient with no gas escaping through the valve to scavenging",  ok: true  },
      { t: "The breathing circuit opens fully to atmosphere, preventing any positive pressure from building", ok: false },
      { t: "Fresh gas flow is shut off at the common gas outlet to protect the patient from overpressure",   ok: false },
      { t: "The ventilator automatically switches from manual to mechanical mode to prevent barotrauma",     ok: false },
    ],
    rationale: "APL stands for adjustable pressure-limiting valve. When fully open, excess gas escapes at low pressure. When fully closed, no gas escapes — all pressure from squeezing the bag or flush valve is transmitted directly to the patient's airway. This is why activating the O₂ flush with a closed APL valve is extremely dangerous.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "APL Valve", priority: "high" },
  },

  {
    id: "cp-n4-006",
    type: "mcq",
    prompt: "A CRNA accidentally activates the oxygen flush valve while the APL valve is fully closed and the patient is intubated. What is the most likely immediate complication?",
    setup: "",
    ans: [
      { t: "Barotrauma — rapid pressure buildup with no relief valve causes lung injury such as pneumothorax", ok: true  },
      { t: "Hypoxemia — the flush valve delivers nitrogen instead of oxygen, causing acute desaturation",       ok: false },
      { t: "Bronchospasm — high-flow cold gas reflexively triggers smooth muscle contraction in the airways",   ok: false },
      { t: "Vaporizer flooding — the flush bypasses the vaporizer and pushes liquid agent into the circuit",    ok: false },
    ],
    rationale: "With APL closed: no pressure relief. O₂ flush delivers 35–75 L/min at ~400 kPa directly to the patient circuit. Airway pressure rises in seconds to dangerous levels, rupturing alveoli. The result is pneumothorax, pneumomediastinum, or subcutaneous emphysema. Always verify the APL valve is open before using the flush.",
    scene: "gas_piston",
    sceneCfg: { label: "BAROTRAUMA — FLUSH + CLOSED APL" },
    metadata: { topic: "Barotrauma", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SPONTANEOUS vs POSITIVE PRESSURE VENTILATION
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n4-007",
    type: "mcq",
    prompt: "During spontaneous breathing, the diaphragm contracts and descends, increasing thoracic volume. According to Boyle's law, what happens to intrathoracic pressure, and how does air enter the lungs?",
    setup: "",
    ans: [
      { t: "Intrathoracic pressure falls below atmospheric pressure, and air flows in down the pressure gradient", ok: true  },
      { t: "Intrathoracic pressure rises above atmospheric, pushing the chest wall outward to draw air inward",    ok: false },
      { t: "Intrathoracic pressure stays constant while the diaphragm actively pumps air into the lung alveoli",   ok: false },
      { t: "Atmospheric pressure drops below intrathoracic pressure, creating a vacuum that pulls air into lungs",  ok: false },
    ],
    rationale: "Boyle's law: at constant temperature, P₁V₁ = P₂V₂. Diaphragm contraction increases thoracic volume → intrathoracic pressure drops below atmospheric → air flows from high pressure (atmosphere) to low pressure (thorax). This is the physics of every spontaneous breath.",
    scene: "gas_piston",
    sceneCfg: { label: "SPONTANEOUS BREATHING — Boyle's Law" },
    metadata: { topic: "Spontaneous Ventilation", priority: "high" },
  },

  {
    id: "cp-n4-008",
    type: "mcq",
    prompt: "Positive pressure ventilation reverses the normal breathing mechanism. How does a mechanical ventilator inflate the lungs?",
    setup: "",
    ans: [
      { t: "The ventilator pushes gas above atmospheric pressure into the airway, expanding the lungs outward",   ok: true  },
      { t: "The ventilator creates a negative pressure around the chest, pulling the thorax open like an iron lung", ok: false },
      { t: "The ventilator stimulates the phrenic nerve electrically, causing the diaphragm to contract normally",  ok: false },
      { t: "The ventilator suctions gas from the lungs first, then allows passive recoil to draw in fresh gas",    ok: false },
    ],
    rationale: "In positive pressure ventilation, the machine generates supra-atmospheric pressure at the airway opening, forcing gas into the lungs. This is the opposite of spontaneous breathing, where sub-atmospheric intrathoracic pressure draws gas in. Understanding this reversal is critical for managing hemodynamic effects of PPV (decreased venous return, decreased preload).",
    scene: "gas_piston",
    sceneCfg: { label: "POSITIVE PRESSURE VENTILATION" },
    metadata: { topic: "Positive Pressure Ventilation", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WORK OF BREATHING & TERMINAL VELOCITY
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n4-009",
    type: "multi",
    prompt: "Select the THREE conditions that increase a patient's work of breathing:",
    setup: "",
    choices: [
      "Bronchospasm — narrowed airways increase resistance requiring greater pressure to maintain flow",
      "Restrictive lung disease — stiff lungs or chest wall demand more force to achieve tidal volume",
      "Fentanyl-induced trunk rigidity — rigid chest wall muscles impede thoracic cage expansion",
      "Administration of an inhaled bronchodilator — relaxes airway smooth muscle and widens airways",
      "Placing the patient in reverse Trendelenburg — gravity assists diaphragmatic descent",
    ],
    correctAnswers: [
      "Bronchospasm — narrowed airways increase resistance requiring greater pressure to maintain flow",
      "Restrictive lung disease — stiff lungs or chest wall demand more force to achieve tidal volume",
      "Fentanyl-induced trunk rigidity — rigid chest wall muscles impede thoracic cage expansion",
    ],
    selectCount: 3,
    rationale: "Work of breathing increases when airway resistance rises (bronchospasm), lung/chest wall compliance decreases (restrictive disease), or chest wall rigidity develops (fentanyl trunk rigidity — a well-known opioid side effect requiring succinylcholine or naloxone). Bronchodilators decrease resistance, and reverse Trendelenburg aids diaphragm mechanics — both reduce work of breathing.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Work of Breathing", priority: "high" },
  },

  {
    id: "cp-n4-010",
    type: "mcq",
    prompt: "An object falling through air eventually reaches a constant velocity where gravitational force equals air resistance. What is this maximum constant velocity called?",
    setup: "",
    ans: [
      { t: "Terminal velocity — the speed at which drag force equals gravitational force, so acceleration is zero", ok: true  },
      { t: "Escape velocity — the minimum speed needed to break free from a gravitational field permanently",       ok: false },
      { t: "Critical velocity — the flow speed at which laminar flow transitions to turbulent flow in a tube",      ok: false },
      { t: "Drift velocity — the average speed of charged particles moving through a conductor under voltage",      ok: false },
    ],
    rationale: "Terminal velocity is reached when the drag force from air resistance exactly balances gravitational force, producing zero net force and therefore zero acceleration. The object falls at constant speed. While not directly clinical, this concept reinforces the equilibrium principle: when opposing forces balance, net acceleration is zero — analogous to steady-state drug infusions.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Terminal Velocity", priority: "low" },
  },

  {
    id: "cp-n4-011",
    type: "mcq",
    prompt: "Kinetic energy depends on mass and velocity. If a gas molecule's velocity doubles while its mass stays constant, by what factor does its kinetic energy change?",
    setup: "",
    ans: [
      { t: "KE increases by a factor of 4 — because KE = ½mv² and velocity is squared in the equation",  ok: true  },
      { t: "KE increases by a factor of 2 — kinetic energy scales linearly with velocity not its square",  ok: false },
      { t: "KE increases by a factor of 8 — velocity is cubed in the kinetic energy formula for gases",    ok: false },
      { t: "KE stays the same — mass is unchanged so the total kinetic energy remains constant overall",   ok: false },
    ],
    rationale: "KE = ½mv². If v doubles: KE = ½m(2v)² = ½m × 4v² = 4 × (½mv²). Kinetic energy quadruples. This v² relationship explains why even small increases in velocity (or flow rate) dramatically increase energy — relevant to turbulent flow in airways and the destructive potential of high-velocity flush gas.",
    scene: "gas_piston",
    sceneCfg: { label: "KE = ½mv² — velocity squared" },
    metadata: { topic: "Kinetic Energy", priority: "medium" },
  },

  {
    id: "cp-n4-012",
    type: "mcq",
    prompt: "During spontaneous ventilation, which specific muscle is the primary generator of the negative intrathoracic pressure that drives inspiration?",
    setup: "",
    ans: [
      { t: "The diaphragm — its contraction and descent increases thoracic volume and lowers pressure",        ok: true  },
      { t: "The external intercostals — they are the sole driver of tidal breathing during quiet respiration",  ok: false },
      { t: "The sternocleidomastoid — this accessory muscle generates the negative pressure for every breath",  ok: false },
      { t: "The internal intercostals — they contract during inspiration to expand the rib cage laterally",     ok: false },
    ],
    rationale: "The diaphragm is the primary muscle of inspiration. When it contracts, it descends and flattens, increasing thoracic volume by approximately 75% of tidal volume during quiet breathing. External intercostals assist by elevating the ribs. Sternocleidomastoid and scalenes are accessory muscles recruited only during labored breathing.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Spontaneous Ventilation", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEW QUESTIONS 13–25
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n4-013",
    type: "mcq",
    prompt: "A gas molecule of mass 5 × 10⁻²⁶ kg travels at 500 m/s. What is its kinetic energy?",
    setup: "KE = ½mv²",
    ans: [
      { t: "6.25 × 10⁻²¹ J — calculated as one-half times mass times velocity squared",    ok: true  },
      { t: "2.50 × 10⁻²³ J — calculated as mass times velocity without squaring the speed", ok: false },
      { t: "1.25 × 10⁻²⁰ J — calculated by squaring both mass and velocity in the formula", ok: false },
      { t: "5.00 × 10⁻²⁴ J — calculated by dividing mass by velocity squared in the formula", ok: false },
    ],
    rationale: "KE = ½mv² = 0.5 × (5 × 10⁻²⁶) × (500)² = 0.5 × 5 × 10⁻²⁶ × 2.5 × 10⁵ = 6.25 × 10⁻²¹ J. This calculation reinforces the v² dependence: at the molecular level, faster gas molecules carry disproportionately more energy, which is why temperature (proportional to average KE) increases rapidly with molecular speed.",
    scene: "gas_piston",
    sceneCfg: { label: "KE CALCULATION — MOLECULAR LEVEL" },
    metadata: { topic: "Kinetic Energy", priority: "medium" },
  },

  {
    id: "cp-n4-014",
    type: "mcq",
    prompt: "An IV bag containing 1 kg of fluid is raised 1.0 m above the patient's IV site. What is the approximate gravitational potential energy stored in the fluid?",
    setup: "PE = mgh, g ≈ 9.8 m/s².",
    ans: [
      { t: "9.8 J — mass times gravitational acceleration times height gives the stored energy",   ok: true  },
      { t: "1.0 J — potential energy equals mass times height alone without gravitational factor",  ok: false },
      { t: "98 J — the calculation requires multiplying by 10 times the gravitational constant",    ok: false },
      { t: "4.9 J — potential energy is one-half of mass times gravity times height by convention",  ok: false },
    ],
    rationale: "PE = mgh = 1.0 kg × 9.8 m/s² × 1.0 m = 9.8 J. This potential energy converts to kinetic energy as fluid flows downward, creating the hydrostatic pressure that drives gravity-fed IV infusions. Raising the bag higher stores more PE and increases flow rate.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Potential Energy", priority: "medium" },
  },

  {
    id: "cp-n4-015",
    type: "mcq",
    prompt: "A ventilator delivers a tidal volume of 500 mL against a plateau pressure of 20 cmH₂O. The work performed by the ventilator on the lungs during this breath is approximately:",
    setup: "Work = Pressure × Volume. Convert units: 1 cmH₂O = 98.07 Pa; 500 mL = 0.0005 m³.",
    ans: [
      { t: "Approximately 1.0 joule — pressure times volume with appropriate unit conversion applied", ok: true  },
      { t: "Approximately 10,000 joules — multiplying cmH₂O directly by mL without unit conversion",  ok: false },
      { t: "Approximately 0.01 joules — the work of a single breath is negligible in energy terms",    ok: false },
      { t: "Cannot be calculated — work requires force and distance, not pressure and volume values",   ok: false },
    ],
    rationale: "Work = P × V. Converting: 20 cmH₂O × 98.07 Pa/cmH₂O = 1961 Pa. Volume = 0.5 L = 0.0005 m³. W = 1961 × 0.0005 ≈ 0.98 J ≈ 1.0 J per breath. At 12 breaths/min, the ventilator performs about 12 J/min of mechanical work. This helps quantify the work of breathing the machine takes over from the patient.",
    scene: "gas_piston",
    sceneCfg: { label: "WORK = PRESSURE × VOLUME" },
    metadata: { topic: "Work", priority: "high" },
  },

  {
    id: "cp-n4-016",
    type: "mcq",
    prompt: "Pulmonary compliance is defined as the change in volume per unit change in pressure (C = ΔV/ΔP). A patient's lungs accept 500 mL for a pressure change of 10 cmH₂O. What is the compliance?",
    setup: "",
    ans: [
      { t: "50 mL/cmH₂O — dividing the volume change by the pressure change that produced it",    ok: true  },
      { t: "5000 mL/cmH₂O — multiplying volume by pressure gives the compliance of the lungs",     ok: false },
      { t: "0.02 mL/cmH₂O — compliance is the inverse ratio of pressure change to volume change",  ok: false },
      { t: "500 mL/cmH₂O — compliance equals the tidal volume regardless of the driving pressure",  ok: false },
    ],
    rationale: "C = ΔV/ΔP = 500 mL / 10 cmH₂O = 50 mL/cmH₂O. Normal total respiratory compliance is about 50–100 mL/cmH₂O. Low compliance (stiff lungs, as in ARDS or pulmonary fibrosis) means more pressure is required for the same volume — increasing the work of breathing.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Compliance", priority: "high" },
  },

  {
    id: "cp-n4-017",
    type: "mcq",
    prompt: "Elastance is the reciprocal of compliance (E = ΔP/ΔV). A patient with ARDS has a compliance of 25 mL/cmH₂O. What is the elastance, and what does it mean clinically?",
    setup: "",
    ans: [
      { t: "0.04 cmH₂O/mL — the lungs are stiff and require more pressure to deliver each unit of volume", ok: true  },
      { t: "25 cmH₂O/mL — elastance and compliance are numerically identical for any given lung condition",  ok: false },
      { t: "0.04 mL/cmH₂O — elastance describes how easily the lung expands under applied pressure",        ok: false },
      { t: "625 cmH₂O/mL — elastance is compliance squared, reflecting exponential stiffness increase",      ok: false },
    ],
    rationale: "E = 1/C = 1/25 = 0.04 cmH₂O/mL. High elastance means the lungs resist expansion — more pressure is needed per mL of delivered volume. In ARDS, reduced compliance (increased elastance) due to alveolar collapse and edema mandates lung-protective ventilation with lower tidal volumes and higher PEEP.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Compliance", priority: "high" },
  },

  {
    id: "cp-n4-018",
    type: "mcq",
    prompt: "Airway resistance is defined as R = ΔP/Flow. If driving pressure is 10 cmH₂O and flow is 0.5 L/s, what is the airway resistance?",
    setup: "",
    ans: [
      { t: "20 cmH₂O/L/s — dividing the pressure gradient by the flow rate gives the resistance value", ok: true  },
      { t: "5 cmH₂O/L/s — multiplying pressure by flow gives the resistance in the airway passages",    ok: false },
      { t: "0.05 cmH₂O/L/s — resistance is calculated as flow divided by the driving pressure gradient", ok: false },
      { t: "10 cmH₂O/L/s — resistance equals the driving pressure alone when flow is less than 1 liter", ok: false },
    ],
    rationale: "R = ΔP/Flow = 10 / 0.5 = 20 cmH₂O/L/s. Normal airway resistance is about 1–3 cmH₂O/L/s; 20 cmH₂O/L/s indicates severe obstruction (bronchospasm, kinked ETT). High resistance means more pressure is needed to maintain the same flow, dramatically increasing the work of breathing.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Resistance", priority: "high" },
  },

  {
    id: "cp-n4-019",
    type: "mcq",
    prompt: "The time constant (τ) of the respiratory system equals resistance × compliance (τ = R × C). A patient has R = 5 cmH₂O/L/s and C = 50 mL/cmH₂O. What is τ and how many time constants are needed for 95% exhalation?",
    setup: "",
    ans: [
      { t: "τ = 0.25 seconds; three time constants (0.75 s) achieve approximately 95% exhalation", ok: true  },
      { t: "τ = 250 seconds; one time constant is sufficient for complete exhalation of tidal volume", ok: false },
      { t: "τ = 0.25 seconds; one time constant achieves 95% exhalation of the delivered tidal volume", ok: false },
      { t: "τ = 10 seconds; five time constants are needed for even partial exhalation to begin",       ok: false },
    ],
    rationale: "τ = R × C = 5 × 0.05 L/cmH₂O = 0.25 s (note: 50 mL = 0.05 L). One τ = 63% exhaled, two τ = 86%, three τ = 95%, five τ ≈ 100%. With τ = 0.25 s, 3τ = 0.75 s for 95% exhalation. In obstructive disease (high R) or emphysema (high C), τ increases and expiratory time must be prolonged to prevent air trapping.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Time Constants", priority: "high" },
  },

  {
    id: "cp-n4-020",
    type: "mcq",
    prompt: "LaPlace's law for a sphere states P = 2T/r, where T is wall tension and r is radius. In the lung, why do small alveoli tend to collapse into larger ones without surfactant?",
    setup: "",
    ans: [
      { t: "Smaller radius generates higher pressure at the same wall tension, driving air into larger alveoli", ok: true  },
      { t: "Larger alveoli have higher pressure and push air into smaller alveoli, causing them to overexpand",   ok: false },
      { t: "Small alveoli have thicker walls that generate more elastic recoil and resist inflation more easily",  ok: false },
      { t: "Gravity causes small alveoli to compress preferentially because they contain less residual gas volume", ok: false },
    ],
    rationale: "By LaPlace's law (P = 2T/r), a smaller sphere with the same wall tension generates higher internal pressure. Without surfactant, small alveoli would have higher pressure than large ones, and air would flow from small (high P) to large (low P), causing atelectasis. Surfactant reduces surface tension more in smaller alveoli, equalizing pressures and stabilizing the lung.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "LaPlace's Law", priority: "high" },
  },

  {
    id: "cp-n4-021",
    type: "mcq",
    prompt: "Pulmonary surfactant is produced by type II alveolar cells. What is its primary physical role in maintaining lung stability?",
    setup: "",
    ans: [
      { t: "It reduces alveolar surface tension, preventing collapse and equalizing pressures across alveoli", ok: true  },
      { t: "It increases alveolar surface tension to maintain alveolar shape during forceful expiratory effort", ok: false },
      { t: "It provides structural rigidity to alveolar walls, acting like scaffolding to prevent stretching",  ok: false },
      { t: "It absorbs excess fluid from the alveolar space to keep the gas-exchange surface completely dry",   ok: false },
    ],
    rationale: "Surfactant (dipalmitoylphosphatidylcholine, DPPC) lowers surface tension at the air-liquid interface of alveoli. By LaPlace's law, this prevents small alveoli from emptying into large ones. Premature neonates lack sufficient surfactant, leading to respiratory distress syndrome (RDS) with widespread atelectasis and poor compliance.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "LaPlace's Law", priority: "high" },
  },

  {
    id: "cp-n4-022",
    type: "mcq",
    prompt: "On a flow-volume loop, a patient shows a 'scooped out' expiratory limb with reduced peak expiratory flow. This pattern is most consistent with:",
    setup: "",
    ans: [
      { t: "Obstructive lung disease — airflow limitation causes concavity of the expiratory curve on the loop", ok: true  },
      { t: "Restrictive lung disease — reduced lung volumes produce the characteristic scooped expiratory shape", ok: false },
      { t: "Normal pulmonary function — a mild concavity in the expiratory limb is a normal physiologic finding", ok: false },
      { t: "Upper airway obstruction — fixed extrathoracic lesions cause scooping of the expiratory limb only",   ok: false },
    ],
    rationale: "The scooped (concave) expiratory limb is the hallmark of obstructive lung disease (COPD, asthma). Dynamic airway compression during forced expiration limits flow, especially at lower lung volumes. Restrictive disease shows reduced volumes but preserved loop shape. Fixed upper airway obstruction flattens both inspiratory and expiratory limbs.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Flow-Volume Loops", priority: "medium" },
  },

  {
    id: "cp-n4-023",
    type: "mcq",
    prompt: "The total work of breathing has two main components. Which two forces must the respiratory muscles (or ventilator) overcome during each breath?",
    setup: "",
    ans: [
      { t: "Elastic recoil of the lungs and chest wall, plus resistive forces from airway and tissue friction", ok: true  },
      { t: "Gravitational force on the diaphragm plus the buoyancy force of air inside the pleural space",      ok: false },
      { t: "Inertial force of the gas column in the trachea plus the osmotic pressure across alveolar walls",   ok: false },
      { t: "Surface tension of the pleural fluid plus the hydrostatic pressure of the pulmonary vasculature",    ok: false },
    ],
    rationale: "Work of breathing = elastic work + resistive work. Elastic work overcomes the tendency of lungs and chest wall to recoil (determined by compliance). Resistive work overcomes friction in the airways (airway resistance) and tissues (tissue resistance). In COPD, resistive work dominates; in pulmonary fibrosis, elastic work dominates.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Work of Breathing", priority: "high" },
  },

  {
    id: "cp-n4-024",
    type: "mcq",
    prompt: "Specific heat capacity is the energy required to raise one gram of a substance by 1°C. Water has a high specific heat of 4.18 J/g°C. What is the clinical relevance for anesthesia?",
    setup: "",
    ans: [
      { t: "Warming IV fluids requires substantial energy; cold fluids can significantly lower patient temperature", ok: true  },
      { t: "Water's high specific heat means patients cannot become hypothermic during surgical procedures",         ok: false },
      { t: "IV fluid warmers are unnecessary because water reaches body temperature almost instantaneously",          ok: false },
      { t: "High specific heat causes rapid patient cooling since water absorbs body heat very efficiently",           ok: false },
    ],
    rationale: "Water's high specific heat (4.18 J/g°C) means it takes a lot of energy to change its temperature. Infusing cold crystalloid (stored at ~20°C) into a patient at 37°C requires the patient's body to supply that energy, causing hypothermia. This is why fluid warmers are used for large-volume resuscitation — each liter of room-temperature crystalloid can lower core temperature by approximately 0.25°C.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Heat Capacity", priority: "medium" },
  },

  {
    id: "cp-n4-025",
    type: "mcq",
    prompt: "The law of conservation of energy states that energy cannot be created or destroyed, only transformed. In an anesthesia circuit, what happens to the kinetic energy of gas when it encounters a sharp bend in the tubing?",
    setup: "",
    ans: [
      { t: "Some kinetic energy converts to heat and turbulence, increasing resistance at the bend point", ok: true  },
      { t: "All kinetic energy is destroyed at the bend, requiring the ventilator to regenerate new flow",  ok: false },
      { t: "Kinetic energy doubles at the bend because the gas accelerates through the narrower pathway",   ok: false },
      { t: "Energy is stored as potential energy in the tubing wall and released during the next breath",    ok: false },
    ],
    rationale: "Energy is conserved but transformed. At a sharp bend, orderly (laminar) flow becomes turbulent. The kinetic energy of organized flow is partly converted to random molecular motion (heat) and chaotic eddies (turbulence). This increases resistance and the pressure needed to maintain flow — one reason smooth, gradual bends in breathing circuits are preferable to sharp angles.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Energy Conservation", priority: "medium" },
  },

];

export const CP_NODE4_METADATA = {
  nodeId:   "cp-node-4",
  courseId: "chem-phys-anesthesia",
  chapter:  "Physics II",
  title:    "Physics II — Energy, Work & Ventilation",
  totalQuestions: CP_NODE4_QUESTIONS.length,
  questionTypes: {
    mcq:   CP_NODE4_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: CP_NODE4_QUESTIONS.filter(q => q.type === 'multi').length,
    short: CP_NODE4_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
