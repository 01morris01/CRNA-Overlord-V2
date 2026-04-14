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
    prompt: "Kinetic energy is defined by KE = ½mv². If a gas molecule's velocity doubles while its mass remains constant, what happens to its kinetic energy?",
    setup: "",
    ans: [
      { t: "KE quadruples — because velocity is squared, doubling v multiplies KE by four",            ok: true  },
      { t: "KE doubles — kinetic energy increases in direct proportion to the change in velocity",      ok: false },
      { t: "KE increases eightfold — velocity is cubed in the kinetic energy relationship for gases",   ok: false },
      { t: "KE remains unchanged — only mass determines kinetic energy, not the velocity of the object", ok: false },
    ],
    rationale: "KE = ½mv². If velocity doubles: KE = ½m(2v)² = ½m × 4v² = 4 × (½mv²). Kinetic energy quadruples because of the v² term. This square relationship explains why even modest increases in gas flow velocity dramatically increase the energy — relevant to turbulent flow in airways and to the destructive potential of high-velocity flush gas.",
    scene: "gas_piston",
    sceneCfg: { label: "KE = ½mv² — VELOCITY SQUARED" },
    metadata: { topic: "Kinetic Energy", priority: "medium" },
  },

  {
    id: "cp-n4-014",
    type: "mcq",
    prompt: "Gravitational potential energy (PE = mgh) is the energy stored due to an object's position. When does potential energy convert to kinetic energy in a clinical setting?",
    setup: "",
    ans: [
      { t: "When an elevated IV bag drives fluid downward — stored PE converts to KE of the flowing fluid",      ok: true  },
      { t: "When a syringe is drawn back — the vacuum inside the syringe creates kinetic energy from nothing",    ok: false },
      { t: "When a ventilator compresses gas — all ventilator energy is classified as potential energy storage",   ok: false },
      { t: "PE never converts to KE in clinical medicine — the two forms of energy are completely independent",   ok: false },
    ],
    rationale: "Gravitational potential energy (PE = mgh) depends on mass, gravitational acceleration, and height. An elevated IV bag stores PE that converts to kinetic energy as fluid flows downward, creating the hydrostatic pressure that drives gravity-fed infusions. Raising the bag higher increases PE and therefore increases the flow rate — a direct application of energy conservation in everyday anesthesia practice.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Potential Energy", priority: "medium" },
  },

  {
    id: "cp-n4-015",
    type: "mcq",
    prompt: "In respiratory physiology, work of breathing can be expressed as Work = Pressure × Volume. What does this relationship tell us about the work a ventilator performs during each breath?",
    setup: "",
    ans: [
      { t: "Higher airway pressures or larger tidal volumes both increase the mechanical work per breath",       ok: true  },
      { t: "Work depends only on tidal volume — airway pressure has no effect on the energy cost of breathing",  ok: false },
      { t: "Work depends only on airway pressure — the delivered volume does not contribute to energy cost",      ok: false },
      { t: "Work of breathing is fixed for all patients regardless of pressure or volume settings on the vent",  ok: false },
    ],
    rationale: "Work = Pressure × Volume (W = P × V). Both variables contribute: higher plateau pressures (stiff lungs, high resistance) and larger tidal volumes each increase the work per breath. This is why lung-protective ventilation with lower tidal volumes and lower plateau pressures reduces the mechanical work imposed on the lungs, decreasing the risk of ventilator-induced lung injury.",
    scene: "gas_piston",
    sceneCfg: { label: "WORK = PRESSURE × VOLUME" },
    metadata: { topic: "Work", priority: "high" },
  },

  {
    id: "cp-n4-016",
    type: "mcq",
    prompt: "Pulmonary compliance is defined as C = ΔV/ΔP — the change in volume per unit change in pressure. What does LOW compliance mean clinically?",
    setup: "",
    ans: [
      { t: "The lungs are stiff and require more pressure to deliver the same tidal volume to the patient",    ok: true  },
      { t: "The lungs are highly distensible and accept large volumes with very little applied pressure",       ok: false },
      { t: "Airway resistance is elevated due to bronchospasm or secretions obstructing the endotracheal tube", ok: false },
      { t: "The patient has obstructive lung disease with air trapping and prolonged expiratory time constants", ok: false },
    ],
    rationale: "Compliance (C = ΔV/ΔP) measures how easily the lungs expand. Low compliance means stiff lungs — more pressure is needed per unit volume. Causes include ARDS, pulmonary fibrosis, pulmonary edema, and obesity. High compliance means the lungs expand easily, as seen in emphysema where alveolar walls are destroyed. Normal total respiratory compliance is approximately 50–100 mL/cmH₂O.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Compliance", priority: "high" },
  },

  {
    id: "cp-n4-017",
    type: "mcq",
    prompt: "Elastance is defined as the reciprocal of compliance (E = 1/C = ΔP/ΔV). What is the relationship between elastance and compliance?",
    setup: "",
    ans: [
      { t: "They are inversely related — high elastance means low compliance and vice versa",                    ok: true  },
      { t: "They are directly proportional — high elastance always accompanies high compliance in lung tissue",   ok: false },
      { t: "They are unrelated — elastance measures airway resistance while compliance measures lung volume",      ok: false },
      { t: "Elastance equals compliance squared — they share an exponential rather than reciprocal relationship", ok: false },
    ],
    rationale: "Elastance (E = ΔP/ΔV) is the inverse of compliance (C = ΔV/ΔP). High elastance means the lungs resist expansion and require more pressure per unit volume — the lungs are stiff. In ARDS, elastance is high (compliance is low) due to alveolar collapse and edema, mandating lung-protective ventilation with lower tidal volumes and higher PEEP.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Compliance", priority: "high" },
  },

  {
    id: "cp-n4-018",
    type: "mcq",
    prompt: "Airway resistance is defined as R = ΔP/Flow. Which of the following clinical conditions INCREASES airway resistance?",
    setup: "",
    ans: [
      { t: "Bronchospasm, use of a smaller endotracheal tube, and airway secretions or mucus plugging",     ok: true  },
      { t: "Administration of an inhaled bronchodilator such as albuterol before induction of anesthesia",   ok: false },
      { t: "Using a larger-diameter endotracheal tube during intubation for a surgical case under anesthesia", ok: false },
      { t: "Placing the patient in reverse Trendelenburg position to optimize diaphragmatic excursion",       ok: false },
    ],
    rationale: "Airway resistance (R = ΔP/Flow) increases when the airway lumen is narrowed. Common causes include bronchospasm (smooth muscle constriction), using a smaller ETT (resistance scales with 1/r⁴), mucus plugging, airway edema, and kinked ETT. Bronchodilators decrease resistance by relaxing airway smooth muscle, and a larger ETT reduces resistance dramatically due to the fourth-power radius relationship.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Resistance", priority: "high" },
  },

  {
    id: "cp-n4-019",
    type: "mcq",
    prompt: "The respiratory time constant (τ) equals Resistance × Compliance (τ = R × C). A patient with COPD has both high airway resistance and high compliance. What is the clinical consequence of a prolonged time constant?",
    setup: "",
    ans: [
      { t: "The lungs take longer to empty, requiring longer expiratory time to prevent air trapping and auto-PEEP", ok: true  },
      { t: "The lungs fill and empty faster, so the respiratory rate must be decreased to avoid hyperventilation",    ok: false },
      { t: "Tidal volume increases automatically because the longer time constant draws in more gas per breath",      ok: false },
      { t: "Time constants have no effect on ventilator management or the risk of air trapping in obstructive disease", ok: false },
    ],
    rationale: "τ = R × C. High resistance (COPD, bronchospasm) or high compliance (emphysema) increases τ, meaning the lungs take longer to empty. Three time constants are needed for 95% exhalation, five for ~100%. If expiratory time is shorter than 3τ, air trapping and auto-PEEP develop. Ventilator management in obstructive disease requires longer expiratory times — achieved by reducing respiratory rate or I:E ratio.",
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
