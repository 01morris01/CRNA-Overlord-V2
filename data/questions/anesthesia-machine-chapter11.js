/**
 * ANESTHESIA MACHINE QUESTION BANK — Chapter 11
 * Course: Basics of Anesthesia
 * Node: node-11
 *
 * Question Types:
 * - mcq:   Single best answer — ans:[{t, ok}]
 * - multi:  Select multiple  — choices + correctAnswers + selectCount
 * - short:  Free response    — acceptedAnswers[]
 */

export const MACHINE_QUESTIONS = [

  // ─── DELIVERY SYSTEMS / HIGH PRESSURE ────────────────────────────────────────

  {
    id: "machine-001",
    type: "mcq",
    prompt: "What are the three distinct pneumatic systems found on all anesthesia machines?",
    setup: "",
    ans: [
      { t: "High pressure, intermediate pressure, and low pressure systems", ok: true },
      { t: "Peak pressure, intermediate pressure, and low pressure systems", ok: false },
      { t: "Base pressure, intermediate pressure, and low pressure systems", ok: false },
      { t: "Dual pressure, intermediate pressure, and low pressure systems", ok: false },
    ],
    rationale: "The anesthesia machine is mechanically divided into high, intermediate, and low pressure systems based on the varying pressures of gas they handle and reduce for patient use.",
    metadata: { topic: "Pressure Systems", priority: "high" }
  },

  {
    id: "machine-002",
    type: "mcq",
    prompt: "Why must cylinder valves strictly be closed when an anesthesia machine is actively using a hospital pipeline supply?",
    setup: "",
    ans: [
      { t: "The machine will always default to pulling gas from the source with the highest total pressure", ok: true },
      { t: "The machine will always default to pulling gas from the source with the warmest total pressure", ok: false },
      { t: "The machine will always default to pulling gas from the source with the lowest active pressure", ok: false },
      { t: "The machine will always default to pulling gas from the source with the coldest active pressure", ok: false },
    ],
    rationale: "When pipeline supplies of gases are being used, cylinder valves should be closed because the machine will always use gas from the source that has the highest pressure.",
    metadata: { topic: "Cylinders", priority: "high" }
  },

  {
    id: "machine-003",
    type: "multi",
    prompt: "Which of the following are primary functions of the hanger yoke assembly in the high pressure system? (Select THREE)",
    choices: [
      "Orients and supports the cylinder",
      "Provides a gas-tight seal",
      "Ensures a uni-directional flow of gas into the machine",
      "Reduces the high pressure down to 40–48 psi",
      "Provides a connection point for the hospital wall pipelines",
    ],
    correctAnswers: [
      "Orients and supports the cylinder",
      "Provides a gas-tight seal",
      "Ensures a uni-directional flow of gas into the machine",
    ],
    selectCount: 3,
    rationale: "The hanger yoke assembly strictly orients and supports the cylinder, provides a gas-tight seal, and ensures a uni-directional flow of gas into the machine via a check valve. Pressure reduction is handled by the regulator, and wall pipelines connect to the intermediate system via DISS.",
    metadata: { topic: "Cylinders", priority: "high" }
  },

  {
    id: "machine-004",
    type: "mcq",
    prompt: "A patient is receiving 4 L/min of oxygen from an E-cylinder showing 1500 psi. Using the standard O2 cylinder factor of 0.28, approximately how many minutes remain in the tank?",
    setup: "E-cylinder O2 factor = 0.28. Remaining time = (PSI × factor) ÷ flow rate.",
    ans: [
      { t: "Precisely 105 minutes left", ok: true },
      { t: "Precisely 210 minutes total", ok: false },
      { t: "Precisely 52.5 minutes left", ok: false },
      { t: "Precisely 310 minutes now", ok: false },
    ],
    rationale: "To calculate the duration, multiply the remaining pressure (1500 psi) by the cylinder factor (0.28), then divide by the flow rate (4 L/min): 1500 × 0.28 ÷ 4 = 105 minutes remaining.",
    metadata: { topic: "Cylinders", priority: "high" }
  },

  {
    id: "machine-005",
    type: "mcq",
    prompt: "Why does the pressure gauge on a nitrous oxide E-cylinder remain at 750 psi even after half of its contents have been used?",
    setup: "",
    ans: [
      { t: "The pressure drops only after all the liquid has vaporized", ok: true },
      { t: "The pressure drops only after all the casing has compressed", ok: false },
      { t: "The pressure drops only after all the regulators have opened", ok: false },
      { t: "The pressure drops only after all the pipelines have drained", ok: false },
    ],
    rationale: "Because nitrous oxide exists as a liquid under pressure inside the tank, the pressure gauge will consistently read 750 psi as liquid vaporizes to replace the lost gas. The pressure only drops once all liquid is exhausted, at which point the tank is about 75% empty.",
    metadata: { topic: "Cylinders", priority: "high" }
  },

  {
    id: "machine-006",
    type: "mcq",
    prompt: "Which of the following correctly matches the standard medical gas with its designated cylinder and hose color?",
    setup: "",
    ans: [
      { t: "Oxygen is green, nitrous oxide is blue, and air is yellow", ok: true },
      { t: "Oxygen is blue, nitrous oxide is yellow, and air is green", ok: false },
      { t: "Oxygen is yellow, nitrous oxide is green, and air is blue", ok: false },
      { t: "Oxygen is green, nitrous oxide is yellow, and air is blue", ok: false },
    ],
    rationale: "Compressed gases and their pressure indicators are color-coded with oxygen as green, nitrous oxide as blue, and air as yellow.",
    metadata: { topic: "Cylinders", priority: "medium" }
  },

  {
    id: "machine-007",
    type: "mcq",
    prompt: "What safety system utilizes specific pin configurations to prevent a provider from attaching the wrong gas cylinder to the wrong yoke?",
    setup: "",
    ans: [
      { t: "Pin Index Safety System (PISS)", ok: true },
      { t: "Diameter Index Safety System (DISS)", ok: false },
      { t: "Common Gas Outlets System", ok: false },
      { t: "Fail Safe Valve System", ok: false },
    ],
    rationale: "The Pin Index Safety System uses unique pin and hole placements on the cylinder and yoke to ensure that only the correct gas cylinder can be connected to its specific yoke.",
    metadata: { topic: "PISS/DISS", priority: "high" }
  },

  {
    id: "machine-008",
    type: "short",
    prompt: "What does PISS stand for in the context of anesthesia machine safety systems?",
    acceptedAnswers: [
      "Pin Index Safety System",
      "pin index safety system",
      "PISS",
    ],
    rationale: "PISS = Pin Index Safety System. It uses specific pin/hole configurations on E-cylinders and yokes to prevent wrong-gas connections at the high pressure system.",
    metadata: { topic: "PISS/DISS", priority: "high" }
  },

  // ─── INTERMEDIATE PRESSURE SYSTEM ────────────────────────────────────────────

  {
    id: "machine-009",
    type: "mcq",
    prompt: "What is the primary purpose of the Diameter Index Safety System (DISS) on the anesthesia machine?",
    setup: "",
    ans: [
      { t: "To strictly prevent misconnections to the wall pipelines", ok: true },
      { t: "To strictly prevent misconnections to the tank cylinders", ok: false },
      { t: "To strictly prevent misconnections to the vaporizer unit", ok: false },
      { t: "To strictly prevent misconnections to the scavenger hose", ok: false },
    ],
    rationale: "The Diameter Index Safety System (DISS) uses gas-specific diameter fittings to prevent misconnections to the hospital's wall pipeline delivery systems.",
    metadata: { topic: "PISS/DISS", priority: "high" }
  },

  {
    id: "machine-010",
    type: "short",
    prompt: "What does DISS stand for?",
    acceptedAnswers: [
      "Diameter Index Safety System",
      "diameter index safety system",
      "DISS",
    ],
    rationale: "DISS = Diameter Index Safety System. It uses gas-specific diameter connectors for wall pipeline supply connections at the intermediate pressure system.",
    metadata: { topic: "PISS/DISS", priority: "high" }
  },

  {
    id: "machine-011",
    type: "mcq",
    prompt: "What specific pressure reduction is achieved by the second-stage regulator for nitrous oxide and oxygen, respectively?",
    setup: "",
    ans: [
      { t: "Nitrous oxide to 26 psi and oxygen to 14 psi", ok: true },
      { t: "Nitrous oxide to 14 psi and oxygen to 26 psi", ok: false },
      { t: "Nitrous oxide to 40 psi and oxygen to 15 psi", ok: false },
      { t: "Nitrous oxide to 15 psi and oxygen to 40 psi", ok: false },
    ],
    rationale: "The second-stage reducing device eliminates fluctuations in supply by lowering nitrous oxide to 26 psi and oxygen to 14 psi.",
    metadata: { topic: "Pressure Systems", priority: "medium" }
  },

  {
    id: "machine-012",
    type: "mcq",
    prompt: "What specific functions remain operational on the anesthesia machine even when the master switch is placed in the STANDBY (OFF) position?",
    setup: "",
    ans: [
      { t: "Only the oxygen flush valve and the oxygen flowmeter remain functional", ok: true },
      { t: "Only the flow control valves and the vaporizers remain fully functional", ok: false },
      { t: "Only the fail safe valves and the pipeline inlet connections are active", ok: false },
      { t: "Only the ascending bellows and the scavenging systems remain functional", ok: false },
    ],
    rationale: "When the master switch is in the STANDBY (OFF) position, oxygen flow and electricity are generally blocked, but the oxygen flush valve and the auxiliary oxygen flowmeter remain operational for emergency use.",
    metadata: { topic: "Pressure Systems", priority: "medium" }
  },

  {
    id: "machine-013",
    type: "multi",
    prompt: "Which of the following hazards are NOT guarded against by the machine's oxygen failure safety devices (fail-safe valve and alarm)? (Select THREE)",
    choices: [
      "A cylinder containing the incorrect type of gas",
      "A cross-connection occurring in the pipeline supply",
      "The oxygen flow control valve not being turned on",
      "A total loss of oxygen pressure from the wall pipeline",
      "An empty oxygen E-cylinder when pipeline is disconnected",
    ],
    correctAnswers: [
      "A cylinder containing the incorrect type of gas",
      "A cross-connection occurring in the pipeline supply",
      "The oxygen flow control valve not being turned on",
    ],
    selectCount: 3,
    rationale: "Oxygen failure devices alert the provider if the supply pressure drops below roughly 30 psi, but they do NOT protect against pipeline crossovers, a cylinder containing the wrong gas, or the provider simply failing to turn on the oxygen flow control valve.",
    metadata: { topic: "Pressure Systems", priority: "high" }
  },

  // ─── OXYGEN FLUSH VALVE ───────────────────────────────────────────────────────

  {
    id: "machine-014",
    type: "mcq",
    prompt: "Which of the following correctly describes the flow rate and pressure output characteristics of the oxygen flush valve?",
    setup: "",
    ans: [
      { t: "It delivers 35 to 75 liters per minute at exactly 40 psi", ok: true },
      { t: "It delivers 15 to 25 liters per minute at exactly 40 psi", ok: false },
      { t: "It delivers 35 to 75 liters per minute at exactly 60 psi", ok: false },
      { t: "It delivers 15 to 25 liters per minute at exactly 60 psi", ok: false },
    ],
    rationale: "The oxygen flush valve bypasses the flowmeters to deliver a massive unmetered flow of 35 to 75 L/min of oxygen directly to the common gas outlet at a pressure of 40 psi.",
    metadata: { topic: "Flush Valve", priority: "high" }
  },

  {
    id: "machine-015",
    type: "mcq",
    prompt: "What is the primary hazard of activating the oxygen flush valve during the inspiration phase of mechanical ventilation?",
    setup: "",
    ans: [
      { t: "It delivers extreme pressure spikes and causes severe barotrauma", ok: true },
      { t: "It rapidly depletes the emergency E-cylinder backup supplies", ok: false },
      { t: "It completely dilutes the circuit gases and causes deep awareness", ok: false },
      { t: "It immediately bypasses all fail-safe safety system gas controls", ok: false },
    ],
    rationale: "Because the oxygen flush delivers a massive volume of gas at 40 psi directly to the common gas outlet, activating it while the ventilator is actively delivering a breath can cause an extreme pressure spike and severe barotrauma to the patient's lungs.",
    metadata: { topic: "Flush Valve", priority: "high" }
  },

  {
    id: "machine-016",
    type: "short",
    prompt: "Name one dangerous consequence of activating the oxygen flush valve during active mechanical ventilation.",
    acceptedAnswers: [
      "barotrauma",
      "pressure spike",
      "lung injury",
      "pneumothorax",
      "severe barotrauma",
    ],
    rationale: "Activating the oxygen flush during inspiration creates a massive pressure spike at 40 psi into the circuit, risking severe pulmonary barotrauma including pneumothorax.",
    metadata: { topic: "Flush Valve", priority: "high" }
  },

  // ─── LOW PRESSURE SYSTEM AND VAPORIZERS ──────────────────────────────────────

  {
    id: "machine-017",
    type: "multi",
    prompt: "Which of the following components are considered part of the machine's low pressure system? (Select FOUR)",
    choices: [
      "Flow indicators (glass tubes)",
      "Vaporizers",
      "Common gas outlet",
      "Low-pressure piping",
      "Oxygen flush valve",
      "Pipeline inlet connections",
    ],
    correctAnswers: [
      "Flow indicators (glass tubes)",
      "Vaporizers",
      "Common gas outlet",
      "Low-pressure piping",
    ],
    selectCount: 4,
    rationale: "The low pressure system is located downstream of the flow control valves and includes the flow indicators, vaporizers, low-pressure piping, and the common gas outlet. The oxygen flush valve and pipeline inlet connections are part of the intermediate pressure system.",
    metadata: { topic: "Vaporizers", priority: "high" }
  },

  {
    id: "machine-018",
    type: "mcq",
    prompt: "How should an anesthesia provider physically manipulate the flow control valve to accurately increase the gas flow?",
    setup: "",
    ans: [
      { t: "Rotate the flow valve in a counterclockwise manner", ok: true },
      { t: "Rotate the flow valve in a strict downwardly manner", ok: false },
      { t: "Rotate the flow valve in a strict clockwise manner", ok: false },
      { t: "Rotate the flow valve in a strict upwardly manner", ok: false },
    ],
    rationale: "To increase the flow of gas, the provider must use a counterclockwise rotation of the flow control valve. Clockwise rotation actively decreases the flow.",
    metadata: { topic: "Flowmeter", priority: "medium" }
  },

  {
    id: "machine-019",
    type: "mcq",
    prompt: "To prevent delivery of a hypoxic gas mixture in the event of a flowmeter leak, where MUST the oxygen flowmeter be mechanically positioned relative to the other gases?",
    setup: "",
    ans: [
      { t: "It must be located in the furthest downstream position", ok: true },
      { t: "It must be located in the furthest upstream positions", ok: false },
      { t: "It must be located in the absolute middlemost position", ok: false },
      { t: "It must be located in the completely isolated position", ok: false },
    ],
    rationale: "Oxygen must always be the last gas in the flowmeter sequence (furthest downstream) before the mixed gases enter the manifold, ensuring that a crack in an upstream glass tube leaks nitrous or air rather than oxygen.",
    metadata: { topic: "Flowmeter", priority: "high" }
  },

  {
    id: "machine-020",
    type: "mcq",
    prompt: "Which flow control valve knob has a uniquely fluted profile to safely distinguish it from the others by touch?",
    setup: "",
    ans: [
      { t: "Oxygen (O2)", ok: true },
      { t: "Helium (He)", ok: false },
      { t: "Nitrous oxide (N2O)", ok: false },
      { t: "Medical Air", ok: false },
    ],
    rationale: "For safety purposes, the oxygen knob has a uniquely fluted profile so it looks and feels completely different from the other gas knobs.",
    metadata: { topic: "Flowmeter", priority: "medium" }
  },

  {
    id: "machine-021",
    type: "mcq",
    prompt: "What is the specific function of the manifold within the anesthesia machine's low-pressure pneumatic system?",
    setup: "",
    ans: [
      { t: "It acts as the specific mixing chamber where flowmeter gases combine", ok: true },
      { t: "It acts as the specific cooling chamber where hot liquids are cooled", ok: false },
      { t: "It acts as the specific heating chamber where cold oxygen is warmed", ok: false },
      { t: "It acts as the specific pressure chamber where all gases are stored", ok: false },
    ],
    rationale: "The manifold functions as a mixing chamber where gas flow exits the flowmeters and combines before being directed into a vaporizer or the breathing system.",
    metadata: { topic: "Flowmeter", priority: "medium" }
  },

  {
    id: "machine-022",
    type: "mcq",
    prompt: "What specific thermodynamic principle explains why a variable-bypass vaporizer cools down over time as it operates?",
    setup: "",
    ans: [
      { t: "It is caused by the latent heat of vaporization", ok: true },
      { t: "It is caused by the latent heat of condensation", ok: false },
      { t: "It is caused by the precise heat of sublimation", ok: false },
      { t: "It is caused by the specific heat of liquefying", ok: false },
    ],
    rationale: "The latent heat of vaporization is the energy (heat) required to convert a liquid into a vapor. As the volatile agent vaporizes, it actively absorbs heat from the surrounding liquid and container, causing the vaporizer to cool down.",
    metadata: { topic: "Vaporizers", priority: "high" }
  },

  {
    id: "machine-023",
    type: "multi",
    prompt: "Which of the following are distinct safety features specifically integrated into modern variable-bypass vaporizers? (Select THREE)",
    choices: [
      "Interlock mechanisms ensuring only one vaporizer can be on",
      "Agent-specific filler ports to prevent filling the wrong agent",
      "Viewable windows on the filler ports to prevent overfilling",
      "Ascending bellows systems to monitor expiratory volumes",
      "Fail-safe valves to shut off vaporizers if oxygen decreases",
    ],
    correctAnswers: [
      "Interlock mechanisms ensuring only one vaporizer can be on",
      "Agent-specific filler ports to prevent filling the wrong agent",
      "Viewable windows on the filler ports to prevent overfilling",
    ],
    selectCount: 3,
    rationale: "Modern vaporizers feature an interlock safety mechanism (allowing only one to be turned on at a time), agent-specific filler ports, and a window to prevent overfilling. Bellows and fail-safe valves are separate pneumatic components of the machine, not the vaporizers.",
    metadata: { topic: "Vaporizers", priority: "high" }
  },

  {
    id: "machine-024",
    type: "mcq",
    prompt: "Which volatile anesthetic requires a specialized, heated, and pressurized vaporizer (such as the Tec 6) due to its boiling point being near room temperature?",
    setup: "",
    ans: [
      { t: "Desflurane", ok: true },
      { t: "Isoflurane", ok: false },
      { t: "Sevoflurane", ok: false },
      { t: "Halothane", ok: false },
    ],
    rationale: "Desflurane cannot be safely vaporized in a standard variable-bypass vaporizer because its boiling point is near room temperature (22.8°C); it requires a specialized heated and pressurized delivery system such as the Tec 6.",
    metadata: { topic: "Vaporizers", priority: "high" }
  },

  {
    id: "machine-025",
    type: "short",
    prompt: "What is the boiling point concern that requires desflurane to use a heated, pressurized vaporizer instead of a standard variable-bypass vaporizer?",
    acceptedAnswers: [
      "near room temperature",
      "boiling point near room temperature",
      "low boiling point",
      "boiling point of 22.8",
      "22.8 degrees",
      "22.8",
    ],
    rationale: "Desflurane has a boiling point of approximately 22.8°C, which is near room temperature. This means it would uncontrollably vaporize in a standard vaporizer, requiring the specialized Tec 6 heated and pressurized system.",
    metadata: { topic: "Vaporizers", priority: "high" }
  },

  // ─── BREATHING CIRCUIT / VENTILATOR ──────────────────────────────────────────

  {
    id: "machine-026",
    type: "mcq",
    prompt: "Why is the Mapleson F (Jackson-Rees) semi-open breathing system frequently utilized for pediatric anesthesia and transport?",
    setup: "",
    ans: [
      { t: "It offers minimal dead space and extremely low gas resistance", ok: true },
      { t: "It offers heavy condensation and extremely warm breathing gas", ok: false },
      { t: "It offers complete rebreathing and zero atmospheric pollutions", ok: false },
      { t: "It offers massive dead space and extremely high gas resistance", ok: false },
    ],
    rationale: "The Mapleson F (Jackson-Rees) semi-open system is usually used for pediatric anesthesia and transport because it offers minimal dead space and resistance.",
    metadata: { topic: "Breathing Circuit", priority: "medium" }
  },

  {
    id: "machine-027",
    type: "mcq",
    prompt: "What critical safety rule governs the proper mechanical operation of the inspiratory and expiratory check valves?",
    setup: "",
    ans: [
      { t: "They must absolutely never be completely open simultaneously", ok: true },
      { t: "They must absolutely never be completely shut simultaneously", ok: false },
      { t: "They must absolutely never be fully disconnected from alarms", ok: false },
      { t: "They must absolutely never be fully attached to scavenging", ok: false },
    ],
    rationale: "To properly ensure one-way flow, the inspiratory and expiratory check valves must never be open simultaneously.",
    metadata: { topic: "Breathing Circuit", priority: "high" }
  },

  {
    id: "machine-028",
    type: "mcq",
    prompt: "During spontaneous breathing, where should the Adjustable Pressure Limiting (APL) valve be positioned?",
    setup: "",
    ans: [
      { t: "Fully open (minimum pressure)", ok: true },
      { t: "Fully closed (maximum pressure)", ok: false },
      { t: "Partially closed", ok: false },
      { t: "Manually occluded", ok: false },
    ],
    rationale: "The APL (pop-off) valve is located on the expiratory side of the circuit. During spontaneous respirations, it must be fully open (min) to prevent resistance against the patient's breathing efforts.",
    metadata: { topic: "Breathing Circuit", priority: "high" }
  },

  {
    id: "machine-029",
    type: "short",
    prompt: "What is the name of the pressure-limiting valve on the expiratory limb of the circle circuit that is opened during spontaneous ventilation?",
    acceptedAnswers: [
      "APL valve",
      "APL",
      "adjustable pressure limiting valve",
      "pop off valve",
      "pop-off valve",
    ],
    rationale: "The Adjustable Pressure Limiting (APL) valve, also called the pop-off valve, is located on the expiratory limb. It must be fully open during spontaneous ventilation to minimize resistance.",
    metadata: { topic: "Breathing Circuit", priority: "high" }
  },

  {
    id: "machine-030",
    type: "mcq",
    prompt: "The highly compliant reservoir bag provides partial protection to the patient by naturally plateauing its pressure below what specific limit?",
    setup: "",
    ans: [
      { t: "Strictly less than 60 cm H2O of pressure", ok: true },
      { t: "Strictly less than 40 cm H2O of pressure", ok: false },
      { t: "Strictly less than 20 cm H2O of pressure", ok: false },
      { t: "Strictly less than 80 cm H2O of pressure", ok: false },
    ],
    rationale: "The reservoir bag is the most compliant part of the breathing system and is designed to distend and plateau at a pressure less than 60 cm H2O to partially protect the patient from excessive positive pressure.",
    metadata: { topic: "Breathing Circuit", priority: "medium" }
  },

  {
    id: "machine-031",
    type: "mcq",
    prompt: "Why are ascending (standing) bellows considered significantly safer than descending (hanging) bellows during anesthesia?",
    setup: "",
    ans: [
      { t: "They visibly fail to rise if a circuit disconnect has occurred", ok: true },
      { t: "They visibly fail to fall if a circuit disconnect has occurred", ok: false },
      { t: "They actively trigger the oxygen failure safety alarm circuits", ok: false },
      { t: "They actively trigger the specific interlock safety mechanisms", ok: false },
    ],
    rationale: "Ascending bellows passively rise during patient exhalation. If a circuit disconnect occurs, they will visibly fail to rise, immediately alerting the provider. Hanging bellows continue to passively fall via gravity during a disconnect, masking the danger.",
    metadata: { topic: "Ventilator", priority: "high" }
  },

  {
    id: "machine-032",
    type: "short",
    prompt: "What type of bellows (ascending or descending) is considered safer and why — in one word, what do they fail to do when a disconnect occurs?",
    acceptedAnswers: [
      "ascending",
      "ascending bellows",
      "rise",
      "fail to rise",
    ],
    rationale: "Ascending (standing) bellows are safer because they visibly fail to RISE when a circuit disconnect occurs, immediately alerting the provider. Descending (hanging) bellows continue to fall by gravity, masking the disconnect.",
    metadata: { topic: "Ventilator", priority: "high" }
  },

  {
    id: "machine-033",
    type: "mcq",
    prompt: "Where are filters specifically recommended to be placed in the anesthesia circuit to prevent microbial transmission, and what is their required efficiency?",
    setup: "",
    ans: [
      { t: "Positioned on the expiratory limb with greater than 95% efficiency", ok: true },
      { t: "Positioned in the inspiratory limb with greater than 95% efficiency", ok: false },
      { t: "Positioned at the scavenging system with greater than 95% efficiency", ok: false },
      { t: "Positioned at the common gas outlet with greater than 95% efficiency", ok: false },
    ],
    rationale: "Filters should be placed on the expiratory limb (or as an HMEF at the Y-piece) to prevent microbes from the patient from contaminating the machine. They must have an efficiency rating higher than 95% for particle sizes of 0.3 microns.",
    metadata: { topic: "Breathing Circuit", priority: "medium" }
  },

  // ─── ELECTRICAL SYSTEMS ───────────────────────────────────────────────────────

  {
    id: "machine-034",
    type: "mcq",
    prompt: "Why must high-frequency surgical devices never be plugged into the electrical outlets on the back of the anesthesia machine?",
    setup: "",
    ans: [
      { t: "They can easily exceed the power limits and blow the circuit breaker", ok: true },
      { t: "They can easily reverse the power limits and melt the circuit breaker", ok: false },
      { t: "They can easily deplete the power limits and trip the safety monitors", ok: false },
      { t: "They can easily corrupt the power limits and shut the safety monitors", ok: false },
    ],
    rationale: "The electrical outlets are intended to power monitors, and high-frequency surgical devices should not be connected to them because they can exceed power requirements and activate a circuit breaker.",
    metadata: { topic: "Electrical Systems", priority: "medium" }
  },

  // ─── CO2 ELIMINATION / ABSORBERS ─────────────────────────────────────────────

  {
    id: "machine-035",
    type: "multi",
    prompt: "Which of the following compounds are found in standard Soda Lime carbon dioxide absorbent? (Select FOUR)",
    choices: [
      "Water (H2O)",
      "Calcium hydroxide Ca(OH)2",
      "Sodium hydroxide (NaOH)",
      "Potassium hydroxide (KOH)",
      "Calcium chloride (CaCl2)",
      "Barium hydroxide Ba(OH)2",
    ],
    correctAnswers: [
      "Water (H2O)",
      "Calcium hydroxide Ca(OH)2",
      "Sodium hydroxide (NaOH)",
      "Potassium hydroxide (KOH)",
    ],
    selectCount: 4,
    rationale: "Standard soda lime consists of water, calcium hydroxide, sodium hydroxide, and potassium hydroxide. Amsorb Plus utilizes calcium chloride instead of NaOH/KOH, and Baralyme used barium.",
    metadata: { topic: "Soda Lime", priority: "high" }
  },

  {
    id: "machine-036",
    type: "multi",
    prompt: "Which of the following chemical compounds are specifically OMITTED from Amsorb Plus to significantly reduce the degradation of inhaled anesthetic agents? (Select TWO)",
    choices: [
      "Sodium hydroxide (NaOH)",
      "Potassium hydroxide (KOH)",
      "Calcium hydroxide Ca(OH)2",
      "Calcium chloride (CaCl2)",
      "Water (H2O)",
    ],
    correctAnswers: [
      "Sodium hydroxide (NaOH)",
      "Potassium hydroxide (KOH)",
    ],
    selectCount: 2,
    rationale: "Amsorb Plus contains water, calcium hydroxide, and calcium chloride, but it specifically does not contain NaOH or KOH, which decreases the risks associated with the degradation of inhaled gases (Compound A and CO formation).",
    metadata: { topic: "Soda Lime", priority: "high" }
  },

  {
    id: "machine-037",
    type: "mcq",
    prompt: "What dangerous outcome is explicitly produced when sevoflurane reacts with desiccated Baralyme in the carbon dioxide absorber?",
    setup: "",
    ans: [
      { t: "It reliably generates a massive risk of an OR fire", ok: true },
      { t: "It reliably generates a massive risk of Compound A", ok: false },
      { t: "It reliably generates a massive risk of carbon gas", ok: false },
      { t: "It reliably generates a massive risk of hypoxic O2", ok: false },
    ],
    rationale: "While sevoflurane interacting with standard soda lime creates nephrotoxic Compound A, its interaction specifically with desiccated Baralyme carries a severe risk of spontaneous combustion and operating room fires.",
    metadata: { topic: "Soda Lime", priority: "high" }
  },

  {
    id: "machine-038",
    type: "mcq",
    prompt: "At what specific concentration and exposure duration is Compound A considered toxic to humans?",
    setup: "",
    ans: [
      { t: "At concentrations strictly greater than 8 percent for 4 to 6 hours", ok: true },
      { t: "At concentrations strictly greater than 4 percent for 2 to 4 hours", ok: false },
      { t: "At concentrations strictly greater than 2 percent for 6 to 8 hours", ok: false },
      { t: "At concentrations strictly greater than 6 percent for 8 to 9 hours", ok: false },
    ],
    rationale: "Compound A, formed from the degradation of sevoflurane by soda lime, is toxic to humans at maximum concentrations (greater than 8%) for 4 to 6 hours.",
    metadata: { topic: "Soda Lime", priority: "high" }
  },

  {
    id: "machine-039",
    type: "short",
    prompt: "What nephrotoxic degradation product is produced when sevoflurane reacts with soda lime?",
    acceptedAnswers: [
      "Compound A",
      "compound A",
      "compound a",
    ],
    rationale: "Compound A is the nephrotoxic vinyl ether produced when sevoflurane degrades in the presence of soda lime (especially at low fresh gas flows). It is toxic at concentrations >8% for 4–6 hours.",
    metadata: { topic: "Soda Lime", priority: "high" }
  },

  {
    id: "machine-040",
    type: "mcq",
    prompt: "What extremely dangerous byproduct can be generated if a patient is ventilated using an exhausted, desiccated carbon dioxide absorber with inhaled anesthetics?",
    setup: "",
    ans: [
      { t: "Carbon monoxide", ok: true },
      { t: "Sulfur dioxide", ok: false },
      { t: "Nitrogen dioxide", ok: false },
      { t: "Hydrogen sulfide", ok: false },
    ],
    rationale: "Desiccated absorbent can actively degrade inhaled anesthetics (especially desflurane, enflurane, and isoflurane) into carbon monoxide, leading to lethal carboxyhemoglobinemia in the patient.",
    metadata: { topic: "Soda Lime", priority: "high" }
  },

  {
    id: "machine-041",
    type: "short",
    prompt: "What form of hemoglobin is produced when a patient is exposed to carbon monoxide generated by desiccated CO2 absorbent?",
    acceptedAnswers: [
      "carboxyhemoglobin",
      "COHb",
      "carboxyhaemoglobin",
    ],
    rationale: "Carbon monoxide binds hemoglobin with 250x greater affinity than oxygen to form carboxyhemoglobin (COHb), causing functional anemia and potentially lethal tissue hypoxia.",
    metadata: { topic: "Soda Lime", priority: "high" }
  },

  {
    id: "machine-042",
    type: "mcq",
    prompt: "If the CO2 absorber completely exhausts in the middle of a case and cannot be changed safely, what is the immediate troubleshooting action to buy time?",
    setup: "",
    ans: [
      { t: "Immediately increase the fresh gas flows", ok: true },
      { t: "Immediately decrease the fresh gas flows", ok: false },
      { t: "Immediately increase the tidal gas volume", ok: false },
      { t: "Immediately decrease the tidal gas volume", ok: false },
    ],
    rationale: "Increasing the fresh gas flows converts the breathing system into a more semi-open state, washing out the exhaled CO2 and bypassing reliance on the chemical absorber until it can be changed.",
    metadata: { topic: "Troubleshooting", priority: "high" }
  },

  // ─── SCAVENGING ───────────────────────────────────────────────────────────────

  {
    id: "machine-043",
    type: "mcq",
    prompt: "What is the strictly recommended OSHA limit regarding the maximum atmospheric concentration of nitrous oxide in the operating room?",
    setup: "",
    ans: [
      { t: "It should absolutely never exceed 25 ppm air", ok: true },
      { t: "It should absolutely never exceed 50 ppm air", ok: false },
      { t: "It should absolutely never exceed 2 ppm air", ok: false },
      { t: "It should absolutely never exceed 15 ppm air", ok: false },
    ],
    rationale: "OSHA recommends that atmospheric pollution from nitrous oxide should not exceed 25 parts per million (ppm), while volatile anesthetic agents should not exceed 2 ppm.",
    metadata: { topic: "Scavenging", priority: "medium" }
  },

  {
    id: "machine-044",
    type: "short",
    prompt: "What is the OSHA recommended maximum atmospheric concentration limit for volatile anesthetic agents (not nitrous oxide) in the operating room?",
    acceptedAnswers: [
      "2 ppm",
      "2",
      "two ppm",
    ],
    rationale: "OSHA recommends that volatile anesthetic agents (halogenated agents) should not exceed 2 ppm in the OR atmosphere, while nitrous oxide is limited to 25 ppm.",
    metadata: { topic: "Scavenging", priority: "medium" }
  },

  {
    id: "machine-045",
    type: "mcq",
    prompt: "What is the minimum recommended number of complete air exchanges per hour for an operating room's ventilation system to control atmospheric pollution?",
    setup: "",
    ans: [
      { t: "A strict minimum of exactly fifteen complete air exchanges", ok: true },
      { t: "A strict minimum of exactly thirty complete air exchanges", ok: false },
      { t: "A strict minimum of exactly twenty complete air exchanges", ok: false },
      { t: "A strict minimum of exactly twelve complete air exchanges", ok: false },
    ],
    rationale: "To help control atmospheric pollution, operating rooms should be adequately ventilated and completely exchanged a minimum of 15 times per hour.",
    metadata: { topic: "Scavenging", priority: "medium" }
  },

  {
    id: "machine-046",
    type: "mcq",
    prompt: "What is the difference between an active and a passive scavenging system?",
    setup: "",
    ans: [
      { t: "Active systems use hospital vacuums; passive systems use pressure gradients", ok: true },
      { t: "Passive systems use hospital vacuums; active systems use pressure gradients", ok: false },
      { t: "Active systems use the machine bellows; passive systems use fresh gas flows", ok: false },
      { t: "Passive systems use the machine bellows; active systems use fresh gas flows", ok: false },
    ],
    rationale: "Active scavenging systems are directly connected to the hospital's vacuum system to pull waste gases away, whereas passive systems rely on a natural pressure gradient to move gas into the hospital ventilation.",
    metadata: { topic: "Scavenging", priority: "medium" }
  },

  // ─── MSMAID / MACHINE CHECK ───────────────────────────────────────────────────

  {
    id: "machine-047",
    type: "multi",
    prompt: "What does the machine check mnemonic 'MSMAID' stand for? (Select SIX correct items)",
    choices: [
      "Machine",
      "Suction",
      "Monitors",
      "Airway",
      "IV access",
      "Drugs",
      "Defibrillator",
      "Alarms",
    ],
    correctAnswers: [
      "Machine",
      "Suction",
      "Monitors",
      "Airway",
      "IV access",
      "Drugs",
    ],
    selectCount: 6,
    rationale: "The standard machine check mnemonic MSMAID stands for Machine, Suction, Monitors, Airway, IV access, and Drugs.",
    metadata: { topic: "MSMAID", priority: "high" }
  },

  {
    id: "machine-048",
    type: "short",
    prompt: "In the MSMAID pre-anesthesia checklist, what does the letter 'A' stand for?",
    acceptedAnswers: [
      "Airway",
      "airway",
    ],
    rationale: "MSMAID = Machine, Suction, Monitors, Airway, IV access, Drugs. The 'A' specifically stands for Airway, reminding the provider to verify airway equipment is present and functional.",
    metadata: { topic: "MSMAID", priority: "high" }
  },

  {
    id: "machine-049",
    type: "short",
    prompt: "Spell out all six items in the MSMAID pre-anesthesia machine check mnemonic.",
    acceptedAnswers: [
      "Machine Suction Monitors Airway IV Drugs",
      "machine suction monitors airway iv drugs",
      "machine, suction, monitors, airway, iv access, drugs",
    ],
    rationale: "MSMAID = Machine, Suction, Monitors, Airway, IV access, Drugs. This systematic checklist ensures critical safety items are verified before every anesthetic.",
    metadata: { topic: "MSMAID", priority: "high" }
  },

  // ─── DISCONNECTS / OBSTRUCTIONS / TROUBLESHOOTING ────────────────────────────

  {
    id: "machine-050",
    type: "mcq",
    prompt: "According to closed claims studies, where does the most common preventable breathing circuit disconnect occur?",
    setup: "",
    ans: [
      { t: "Between the endotracheal tube and the breathing circuit", ok: true },
      { t: "Between the common gas outlet and the fresh gas tubing", ok: false },
      { t: "Between the scavenging system and the hospital vacuums", ok: false },
      { t: "Between the vaporizer outlet and the manifold chambers", ok: false },
    ],
    rationale: "Studies show that breathing circuit disconnects are the most common preventable anesthetic mishap, and the most common site is specifically between the endotracheal tube (ETT) and the circuit.",
    metadata: { topic: "Troubleshooting", priority: "high" }
  },

  {
    id: "machine-051",
    type: "mcq",
    prompt: "If an anesthesia provider notices that the mechanical ventilator bellows are failing to return to their full height during each cycle, what is the most likely cause?",
    setup: "",
    ans: [
      { t: "A significant gas leakage within the system", ok: true },
      { t: "A significant gas blockage within the system", ok: false },
      { t: "A significant gas spillage within the system", ok: false },
      { t: "A significant gas stalling within the system", ok: false },
    ],
    rationale: "Because ascending bellows actively fill using the patient's exhaled volume, a failure of the bellows to return to their full height is the primary visual indicator of a leak or partial disconnect in the breathing circuit.",
    metadata: { topic: "Troubleshooting", priority: "high" }
  },

  {
    id: "machine-052",
    type: "multi",
    prompt: "Which of the following are known causes of dangerous obstructions within the anesthesia breathing system? (Select FOUR)",
    choices: [
      "The anesthesia machine rolling over a hose",
      "The bag-ventilator selector in the wrong position",
      "A severely kinked endotracheal tube or circuit tubing",
      "Failing to remove the plastic wrapper from the absorbent",
      "Opening the oxygen flush valve during an expiration",
      "Disconnecting the wall pipeline from the machine",
    ],
    correctAnswers: [
      "The anesthesia machine rolling over a hose",
      "The bag-ventilator selector in the wrong position",
      "A severely kinked endotracheal tube or circuit tubing",
      "Failing to remove the plastic wrapper from the absorbent",
    ],
    selectCount: 4,
    rationale: "Known causes of obstruction include the machine rolling over a hose, the bag-ventilator selector in the wrong position, a kinked ETT or circuit tubing, a stuck unidirectional valve, or failing to remove the absorbent wrapper before placing it in the canister.",
    metadata: { topic: "Troubleshooting", priority: "high" }
  },

  {
    id: "machine-053",
    type: "short",
    prompt: "What is the most common preventable anesthetic mishap identified in closed claims studies related to the breathing circuit?",
    acceptedAnswers: [
      "breathing circuit disconnect",
      "circuit disconnect",
      "disconnect",
      "disconnection",
    ],
    rationale: "Closed claims studies consistently identify breathing circuit disconnection as the most common preventable anesthetic mishap, most often occurring at the ETT-circuit junction.",
    metadata: { topic: "Troubleshooting", priority: "high" }
  },

  {
    id: "machine-054",
    type: "short",
    prompt: "When troubleshooting a CO2 absorber that has been exhausted mid-case, what is the emergency intervention to wash out CO2 without changing the canister?",
    acceptedAnswers: [
      "increase fresh gas flow",
      "increase fresh gas flows",
      "high fresh gas flow",
      "turn up fresh gas flow",
    ],
    rationale: "Increasing fresh gas flows washes out exhaled CO2 by converting the circle system into a semi-open system, reducing reliance on the chemical absorber.",
    metadata: { topic: "Troubleshooting", priority: "high" }
  },


  // ── boa-node11-ads-001 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-001",
    type: "mcq",
    prompt: "What is the primary purpose of the anesthesia delivery system?",
    setup: "",
    ans: [
      { t: "To provide only oxygen to the patient and eliminate nitrogen.", ok: false },
      { t: "To deliver known concentrations of oxygen and anesthetic gases while removing carbon dioxide through washout or chemical neutralization.", ok: true },
      { t: "To monitor cardiac output and blood pressure during anesthesia.", ok: false },
      { t: "To humidify inspired gases and prevent all airway resistance.", ok: false },
    ],
    rationale: "The anesthesia delivery system provides controlled concentrations of oxygen and anesthetic gases and manages carbon dioxide removal either by washout or chemical absorption.",
    metadata: { topic: "Purpose and Components", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "purpose", "gas delivery", "carbon dioxide"] }
  },

  // ── boa-node11-ads-002 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-002",
    type: "mcq",
    prompt: "Which list correctly identifies the four main components of the anesthesia workstation?",
    setup: "",
    ans: [
      { t: "Ventilator, suction canister, ECG, and laryngoscope.", ok: false },
      { t: "The anesthesia machine, vaporizers, breathing circuit, and scavenging system.", ok: true },
      { t: "Pipeline source, cylinder source, pulse oximeter, and capnograph.", ok: false },
      { t: "Gas analyzer, absorbent canister, reservoir bag, and APL valve.", ok: false },
    ],
    rationale: "The anesthesia workstation includes the machine, vaporizers, breathing circuit, and scavenging system.",
    metadata: { topic: "Purpose and Components", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "workstation", "components"] }
  },

  // ── boa-node11-ads-003 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-003",
    type: "mcq",
    prompt: "What are the three pneumatic systems found in all anesthesia machines?",
    setup: "",
    ans: [
      { t: "Primary, secondary, and tertiary pressure systems.", ok: false },
      { t: "High pressure, intermediate pressure, and low pressure systems.", ok: true },
      { t: "Cylinder pressure, wall pressure, and patient pressure systems.", ok: false },
      { t: "Supply pressure, control pressure, and exhaust pressure systems.", ok: false },
    ],
    rationale: "The anesthesia machine is organized into high, intermediate, and low pressure systems.",
    metadata: { topic: "Pressure Systems", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "pressure systems", "machine"] }
  },

  // ── boa-node11-ads-004 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-004",
    type: "mcq",
    prompt: "From which source does the high pressure system receive gas?",
    setup: "",
    ans: [
      { t: "Only from hospital pipeline inlets.", ok: false },
      { t: "Only from the common gas outlet.", ok: false },
      { t: "Directly from the high pressure cylinders attached to the machine.", ok: true },
      { t: "From the scavenging interface.", ok: false },
    ],
    rationale: "The high pressure system receives gas directly from machine-mounted cylinders.",
    metadata: { topic: "High Pressure System", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "high pressure system", "cylinders"] }
  },

  // ── boa-node11-ads-005 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-005",
    type: "multi",
    prompt: "Which are critical functions of the hanger yoke? Select 3.",
    setup: "",
    choices: [
      "It orients and supports the cylinder.",
      "It provides a gas-tight seal.",
      "It ensures unidirectional gas flow into the machine.",
      "It warms the gas before entry into the regulator.",
      "It measures gas concentration inside the cylinder.",
    ],
    correctAnswers: [
      "It orients and supports the cylinder.",
      "It provides a gas-tight seal.",
      "It ensures unidirectional gas flow into the machine.",
    ],
    selectCount: 3,
    rationale: "The hanger yoke supports and orients the cylinder, provides a seal, and helps ensure one-way flow into the machine.",
    metadata: { topic: "High Pressure System", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "hanger yoke", "cylinder safety"] }
  },

  // ── boa-node11-ads-006 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-006",
    type: "mcq",
    prompt: "What is the role of the pressure-reducing device in the high pressure system?",
    setup: "",
    ans: [
      { t: "It increases cylinder pressure to wall pressure.", ok: false },
      { t: "It reduces high cylinder pressure to a constant usable pressure of about 40 to 48 psi.", ok: true },
      { t: "It bypasses the flowmeter and directly enters the patient circuit.", ok: false },
      { t: "It prevents carbon dioxide rebreathing.", ok: false },
    ],
    rationale: "The regulator reduces very high cylinder pressure to an intermediate usable pressure.",
    metadata: { topic: "High Pressure System", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "pressure regulator", "high pressure system"] }
  },

  // ── boa-node11-ads-007 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-007",
    type: "mcq",
    prompt: "Why should E-cylinder valves be closed when pipeline gas is in use?",
    setup: "",
    ans: [
      { t: "Open cylinders increase vaporizer output.", ok: false },
      { t: "The machine defaults to the highest pressure source, so open cylinders can be silently drained if pipeline pressure fluctuates.", ok: true },
      { t: "Open cylinders lower the oxygen concentration in the circuit.", ok: false },
      { t: "Closed cylinders prevent the fail-safe valve from activating.", ok: false },
    ],
    rationale: "If the cylinder stays open, the machine may begin drawing from it during pipeline pressure changes and silently drain the backup source.",
    metadata: { topic: "High Pressure System", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "oxygen cylinder", "pipeline", "backup supply"] }
  },

  // ── boa-node11-ads-008 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-008",
    type: "mcq",
    prompt: "What are the approximate pressure and volume specifications for a full oxygen E-cylinder?",
    setup: "",
    ans: [
      { t: "750 psig and 1590 L.", ok: false },
      { t: "500 psig and 660 L.", ok: false },
      { t: "2000 to 2200 psig and 625 to 660 L.", ok: true },
      { t: "45 to 55 psig and 660 L.", ok: false },
    ],
    rationale: "A full oxygen E-cylinder contains about 625 to 660 liters at roughly 2000 to 2200 psig.",
    metadata: { topic: "Cylinders", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "oxygen cylinder", "E-cylinder"] }
  },

  // ── boa-node11-ads-009 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-009",
    type: "mcq",
    prompt: "If an oxygen E-cylinder gauge reads about 1100 psig, approximately how much oxygen volume is left?",
    setup: "",
    ans: [
      { t: "About 110 L.", ok: false },
      { t: "About 330 L.", ok: true },
      { t: "About 750 L.", ok: false },
      { t: "About 1590 L.", ok: false },
    ],
    rationale: "Oxygen cylinder pressure roughly tracks remaining volume. About half of 2200 psi corresponds to about half of 660 liters, or about 330 liters.",
    metadata: { topic: "Cylinders", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "oxygen cylinder", "calculations"] }
  },

  // ── boa-node11-ads-010 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-010",
    type: "mcq",
    prompt: "What are the pressure and volume of a full nitrous oxide E-cylinder?",
    setup: "",
    ans: [
      { t: "2000 psig and 660 L.", ok: false },
      { t: "745 to 750 psig and 1590 L.", ok: true },
      { t: "50 psig and 1590 L.", ok: false },
      { t: "2200 psig and 625 L.", ok: false },
    ],
    rationale: "A full nitrous oxide E-cylinder is about 745 to 750 psig and contains about 1590 liters.",
    metadata: { topic: "Cylinders", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "nitrous oxide", "E-cylinder"] }
  },

  // ── boa-node11-ads-011 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-011",
    type: "mcq",
    prompt: "Why is the pressure gauge of a nitrous oxide tank an unreliable indicator of volume until the tank is nearly empty?",
    setup: "",
    ans: [
      { t: "Nitrous oxide pressure increases as volume decreases.", ok: false },
      { t: "Nitrous oxide exists as a liquid-vapor equilibrium, so pressure remains near 745 psig until all liquid has vaporized.", ok: true },
      { t: "The regulator hides the true pressure.", ok: false },
      { t: "Nitrous oxide has no measurable pressure until the valve is opened.", ok: false },
    ],
    rationale: "As long as liquid nitrous oxide remains, cylinder pressure stays near vapor pressure and does not reflect remaining contents well.",
    metadata: { topic: "Cylinders", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "nitrous oxide", "liquid-vapor equilibrium"] }
  },

  // ── boa-node11-ads-012 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-012",
    type: "mcq",
    prompt: "What is the oxygen E-cylinder factor used for calculating remaining time?",
    setup: "",
    ans: [
      { t: "0.14", ok: false },
      { t: "0.28", ok: true },
      { t: "0.5", ok: false },
      { t: "2.8", ok: false },
    ],
    rationale: "The oxygen E-cylinder factor is approximately 0.28.",
    metadata: { topic: "Cylinders", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "oxygen cylinder", "cylinder factor"] }
  },

  // ── boa-node11-ads-013 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-013",
    type: "mcq",
    prompt: "If an oxygen tank pressure is 1000 psi and the flow rate is 5 L/min, approximately how many minutes of oxygen remain?",
    setup: "",
    ans: [
      { t: "28 minutes.", ok: false },
      { t: "40 minutes.", ok: false },
      { t: "56 minutes.", ok: true },
      { t: "112 minutes.", ok: false },
    ],
    rationale: "1000 × 0.28 = 280 liters. 280 ÷ 5 = 56 minutes.",
    metadata: { topic: "Cylinders", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "oxygen cylinder", "calculation", "emergency planning"] }
  },

  // ── boa-node11-ads-014 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-014",
    type: "mcq",
    prompt: "Which safety system is used to prevent connection of an incorrect gas cylinder to the hanger yoke?",
    setup: "",
    ans: [
      { t: "DISS", ok: false },
      { t: "Fail-safe valve", ok: false },
      { t: "PISS", ok: true },
      { t: "APL valve", ok: false },
    ],
    rationale: "The Pin Index Safety System prevents incorrect E-cylinder attachment.",
    metadata: { topic: "Safety Systems", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "PISS", "cylinder safety"] }
  },

  // ── boa-node11-ads-015 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-015",
    type: "mcq",
    prompt: "Which safety system is used for pipeline inlet connections to prevent wall misconnection?",
    setup: "",
    ans: [
      { t: "PISS", ok: false },
      { t: "DISS", ok: true },
      { t: "Oxygen analyzer", ok: false },
      { t: "Reservoir bag", ok: false },
    ],
    rationale: "The Diameter Index Safety System is used for pipeline inlet and hose connections.",
    metadata: { topic: "Safety Systems", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "DISS", "pipeline safety"] }
  },

  // ── boa-node11-ads-016 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-016",
    type: "mcq",
    prompt: "In the intermediate pressure system, what is the normal operating pressure for pipeline gases?",
    setup: "",
    ans: [
      { t: "2000 psi", ok: false },
      { t: "745 psi", ok: false },
      { t: "Approximately 50 psi", ok: true },
      { t: "Less than 10 psi", ok: false },
    ],
    rationale: "Pipeline gases typically enter the machine at about 50 psi.",
    metadata: { topic: "Intermediate Pressure System", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "intermediate pressure system", "pipeline"] }
  },

  // ── boa-node11-ads-017 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-017",
    type: "mcq",
    prompt: "Which components usually remain functional even when the master switch of the anesthesia machine is turned off?",
    setup: "",
    ans: [
      { t: "The vaporizers and ventilator.", ok: false },
      { t: "The oxygen flush valve and usually the auxiliary oxygen flowmeter.", ok: true },
      { t: "The scavenging system and oxygen analyzer.", ok: false },
      { t: "The bellows and capnograph.", ok: false },
    ],
    rationale: "Emergency oxygen access is typically maintained through the oxygen flush valve and often an auxiliary oxygen flowmeter.",
    metadata: { topic: "Intermediate Pressure System", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "master switch", "oxygen flush", "auxiliary oxygen"] }
  },

  // ── boa-node11-ads-018 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-018",
    type: "mcq",
    prompt: "What is the goal of the Oxygen Failure Safety Device, also called the fail-safe valve?",
    setup: "",
    ans: [
      { t: "To prevent any loss of oxygen from a full cylinder.", ok: false },
      { t: "To shut off all machine power during pipeline failure.", ok: false },
      { t: "To prevent delivery of a hypoxic gas mixture by shutting off or reducing other gas flows if oxygen supply pressure falls.", ok: true },
      { t: "To analyze inspired oxygen concentration at the patient end.", ok: false },
    ],
    rationale: "The fail-safe valve responds to oxygen supply pressure and reduces or stops the flow of other gases when oxygen pressure falls.",
    metadata: { topic: "Safety Systems", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "fail-safe valve", "oxygen safety"] }
  },

  // ── boa-node11-ads-019 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-019",
    type: "mcq",
    prompt: "Which hazard is NOT prevented by the fail-safe valve?",
    setup: "",
    ans: [
      { t: "Low oxygen supply pressure.", ok: false },
      { t: "Pipeline crossover or a cylinder containing the wrong gas.", ok: true },
      { t: "Shutoff of nitrous oxide when oxygen pressure falls.", ok: false },
      { t: "Reduction of other gas flow when oxygen source pressure is lost.", ok: false },
    ],
    rationale: "The fail-safe valve is pressure-based, not concentration-based. It does not detect the wrong gas under pressure.",
    metadata: { topic: "Safety Systems", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "fail-safe valve", "pipeline crossover", "oxygen analyzer"] }
  },

  // ── boa-node11-ads-020 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-020",
    type: "mcq",
    prompt: "What is the flow rate range of the oxygen flush valve?",
    setup: "",
    ans: [
      { t: "5 to 10 L/min", ok: false },
      { t: "10 to 20 L/min", ok: false },
      { t: "35 to 75 L/min", ok: true },
      { t: "80 to 120 L/min", ok: false },
    ],
    rationale: "The oxygen flush valve delivers a high unmetered flow of oxygen, commonly 35 to 75 L/min.",
    metadata: { topic: "Oxygen Flush Valve", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "oxygen flush valve", "flow"] }
  },

  // ── boa-node11-ads-021 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-021",
    type: "mcq",
    prompt: "Why should the oxygen flush valve be avoided during the inspiratory phase of mechanical ventilation?",
    setup: "",
    ans: [
      { t: "It lowers tidal volume.", ok: false },
      { t: "It can produce an extreme pressure spike and cause barotrauma because the ventilator spill valve is closed during inspiration.", ok: true },
      { t: "It removes anesthetic from the vaporizer reservoir.", ok: false },
      { t: "It prevents carbon dioxide absorption in the canister.", ok: false },
    ],
    rationale: "During inspiration the circuit is already pressurized, so flushing oxygen can sharply increase airway pressure and cause barotrauma.",
    metadata: { topic: "Oxygen Flush Valve", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "oxygen flush valve", "barotrauma", "mechanical ventilation"] }
  },

  // ── boa-node11-ads-022 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-022",
    type: "mcq",
    prompt: "How can use of the oxygen flush valve increase the risk of anesthesia awareness?",
    setup: "",
    ans: [
      { t: "It decreases oxygen delivery.", ok: false },
      { t: "It bypasses the vaporizer and dilutes the anesthetic concentration in the circuit.", ok: true },
      { t: "It activates the scavenger and removes all gas.", ok: false },
      { t: "It reduces carbon dioxide absorption.", ok: false },
    ],
    rationale: "The oxygen flush bypasses the vaporizer, lowering delivered volatile anesthetic concentration and potentially making the patient lighter.",
    metadata: { topic: "Oxygen Flush Valve", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "oxygen flush valve", "awareness", "vaporizers"] }
  },

  // ── boa-node11-ads-023 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-023",
    type: "mcq",
    prompt: "The low pressure system is located downstream of which component?",
    setup: "",
    ans: [
      { t: "Pressure regulator", ok: false },
      { t: "Flow control valves", ok: true },
      { t: "Check valve in the hanger yoke", ok: false },
      { t: "Cylinder pressure gauge", ok: false },
    ],
    rationale: "The low pressure system begins after the flow control valves.",
    metadata: { topic: "Low Pressure System", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "low pressure system", "flow control valves"] }
  },

  // ── boa-node11-ads-024 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-024",
    type: "mcq",
    prompt: "Why is the oxygen flowmeter placed in the downstream or last position in the flowmeter sequence?",
    setup: "",
    ans: [
      { t: "To keep oxygen under higher pressure.", ok: false },
      { t: "To reduce gas viscosity.", ok: false },
      { t: "To ensure a leak in an upstream flowmeter does not create a hypoxic mixture delivered to the patient.", ok: true },
      { t: "To improve carbon dioxide elimination.", ok: false },
    ],
    rationale: "Placing oxygen last helps prevent upstream leaks from causing delivery of a hypoxic mixture.",
    metadata: { topic: "Low Pressure System", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "flowmeter", "oxygen safety", "low pressure system"] }
  },

  // ── boa-node11-ads-025 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-025",
    type: "mcq",
    prompt: "In a flowmeter with a ball float, where should the flow be read?",
    setup: "",
    ans: [
      { t: "At the top of the ball.", ok: false },
      { t: "At the center of the ball.", ok: true },
      { t: "At the bottom of the ball.", ok: false },
      { t: "At the right edge of the tube.", ok: false },
    ],
    rationale: "For a spherical ball float, the flow is read at the center of the ball.",
    metadata: { topic: "Flowmeters", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "flowmeter", "Thorpe tube"] }
  },

  // ── boa-node11-ads-026 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-026",
    type: "mcq",
    prompt: "What is the function of the manifold in the low pressure system?",
    setup: "",
    ans: [
      { t: "It absorbs carbon dioxide before the vaporizer.", ok: false },
      { t: "It acts as a mixing chamber where gases from the flowmeters combine before entering the vaporizer or breathing circuit.", ok: true },
      { t: "It reduces cylinder pressure to 50 psi.", ok: false },
      { t: "It stores reserve oxygen for emergencies.", ok: false },
    ],
    rationale: "The manifold combines the individually metered gases before they proceed to the vaporizer and common gas outlet.",
    metadata: { topic: "Low Pressure System", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "manifold", "low pressure system"] }
  },

  // ── boa-node11-ads-027 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-027",
    type: "mcq",
    prompt: "Which physics principle explains why liquid anesthetic cools as it vaporizes within a vaporizer?",
    setup: "",
    ans: [
      { t: "Boyle's law", ok: false },
      { t: "Reynolds number", ok: false },
      { t: "Latent heat of vaporization", ok: true },
      { t: "Fick's law", ok: false },
    ],
    rationale: "Vaporization requires energy, which is taken from the surroundings and cools the remaining liquid and device.",
    metadata: { topic: "Vaporizers", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "vaporizer", "latent heat of vaporization"] }
  },

  // ── boa-node11-ads-028 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-028",
    type: "mcq",
    prompt: "Which option correctly matches the volatile agent with its standard color code?",
    setup: "",
    ans: [
      { t: "Sevoflurane blue, Isoflurane yellow, Desflurane purple", ok: false },
      { t: "Sevoflurane yellow, Isoflurane purple, Desflurane blue", ok: true },
      { t: "Sevoflurane purple, Isoflurane blue, Desflurane yellow", ok: false },
      { t: "Sevoflurane red, Isoflurane green, Desflurane orange", ok: false },
    ],
    rationale: "Standard color coding pairs Sevoflurane with yellow, Isoflurane with purple, and Desflurane with blue.",
    metadata: { topic: "Vaporizers", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "vaporizers", "volatile agents", "color coding"] }
  },

  // ── boa-node11-ads-029 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-029",
    type: "mcq",
    prompt: "What is the function of the interlock safety mechanism on the vaporizer manifold?",
    setup: "",
    ans: [
      { t: "It prevents use of oxygen and nitrous oxide together.", ok: false },
      { t: "It prevents more than one vaporizer from being turned on simultaneously.", ok: true },
      { t: "It allows simultaneous activation of two vaporizers for balanced anesthesia.", ok: false },
      { t: "It controls scavenging pressure.", ok: false },
    ],
    rationale: "The interlock prevents simultaneous activation of more than one vaporizer and helps prevent overdose or unpredictable concentrations.",
    metadata: { topic: "Vaporizers", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "vaporizers", "interlock safety"] }
  },

  // ── boa-node11-ads-030 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-030",
    type: "mcq",
    prompt: "Why does Desflurane require a specialized heated and pressurized vaporizer such as the Tec 6?",
    setup: "",
    ans: [
      { t: "Because it is too viscous to pass through a standard flowmeter.", ok: false },
      { t: "Because its boiling point is near room temperature, so it would vaporize uncontrollably in a standard variable-bypass vaporizer.", ok: true },
      { t: "Because it reacts with oxygen under room conditions.", ok: false },
      { t: "Because it cannot be mixed with fresh gas.", ok: false },
    ],
    rationale: "Desflurane's boiling point is close to room temperature, so it requires a heated, pressurized vaporizer for controlled delivery.",
    metadata: { topic: "Vaporizers", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "desflurane", "Tec 6", "vaporizers"] }
  },

  // ── boa-node11-ads-031 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-031",
    type: "mcq",
    prompt: "What is the common gas outlet?",
    setup: "",
    ans: [
      { t: "The point where scavenged gases leave the machine.", ok: false },
      { t: "The point where all machine gases and vapors exit to enter the breathing circuit.", ok: true },
      { t: "The point where exhaled gas enters the absorber.", ok: false },
      { t: "The point where wall pipeline gas first enters the machine.", ok: false },
    ],
    rationale: "The common gas outlet is the final exit point from the machine before gas enters the breathing circuit.",
    metadata: { topic: "Low Pressure System", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "common gas outlet", "gas flow"] }
  },

  // ── boa-node11-ads-032 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-032",
    type: "mcq",
    prompt: "What is the primary advantage of a semi-closed circle breathing system?",
    setup: "",
    ans: [
      { t: "It prevents all rebreathing.", ok: false },
      { t: "It allows rebreathing of gases, conserving heat, moisture, and anesthetic while reducing pollution.", ok: true },
      { t: "It completely eliminates the need for CO2 absorption.", ok: false },
      { t: "It delivers only room air and oxygen.", ok: false },
    ],
    rationale: "The circle system permits safe rebreathing after CO2 removal, conserving heat, moisture, and anesthetic agent.",
    metadata: { topic: "Circle System", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "circle system", "rebreathing"] }
  },

  // ── boa-node11-ads-033 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-033",
    type: "mcq",
    prompt: "Which component in a circle system prevents rebreathing of carbon dioxide?",
    setup: "",
    ans: [
      { t: "Reservoir bag", ok: false },
      { t: "APL valve", ok: false },
      { t: "Carbon dioxide absorbent canister", ok: true },
      { t: "Oxygen analyzer", ok: false },
    ],
    rationale: "In a circle system, carbon dioxide is chemically removed by the absorbent canister.",
    metadata: { topic: "Circle System", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "circle system", "carbon dioxide absorbent"] }
  },

  // ── boa-node11-ads-034 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-034",
    type: "mcq",
    prompt: "How should the APL valve be set during spontaneous ventilation?",
    setup: "",
    ans: [
      { t: "Fully closed", ok: false },
      { t: "Fully open or at minimum", ok: true },
      { t: "Mid-range between 20 and 30 cmH2O", ok: false },
      { t: "It should be disconnected from the circuit", ok: false },
    ],
    rationale: "During spontaneous ventilation, the APL valve should be open or at minimum to minimize expiratory resistance.",
    metadata: { topic: "APL Valve", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "APL valve", "spontaneous ventilation"] }
  },

  // ── boa-node11-ads-035 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-035",
    type: "mcq",
    prompt: "What does the APL valve range of 'Min to 70' represent?",
    setup: "",
    ans: [
      { t: "Oxygen flow in liters per minute", ok: false },
      { t: "Vaporizer output range in percent", ok: false },
      { t: "The pressure in cmH2O at which the valve opens and releases gas to the scavenging system", ok: true },
      { t: "Carbon dioxide absorber capacity", ok: false },
    ],
    rationale: "The markings correspond to the approximate pressure at which the APL valve opens and vents gas.",
    metadata: { topic: "APL Valve", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "APL valve", "pressure limiting"] }
  },

  // ── boa-node11-ads-036 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-036",
    type: "multi",
    prompt: "Which are functions of the reservoir bag? Select 3.",
    setup: "",
    choices: [
      "Acts as a gas reservoir.",
      "Provides a means for manual ventilation.",
      "Serves as a tactile and visual monitor of spontaneous breathing.",
      "Measures anesthetic concentration directly.",
      "Chemically absorbs carbon dioxide.",
    ],
    correctAnswers: [
      "Acts as a gas reservoir.",
      "Provides a means for manual ventilation.",
      "Serves as a tactile and visual monitor of spontaneous breathing.",
    ],
    selectCount: 3,
    rationale: "The reservoir bag stores gas, allows manual ventilation, and provides visual and tactile feedback about ventilation.",
    metadata: { topic: "Reservoir Bag", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "reservoir bag", "manual ventilation"] }
  },

  // ── boa-node11-ads-037 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-037",
    type: "mcq",
    prompt: "Why are ascending bellows preferred over descending bellows?",
    setup: "",
    ans: [
      { t: "Ascending bellows generate higher tidal volumes.", ok: false },
      { t: "Ascending bellows fail to rise during a disconnect, providing a visual warning.", ok: true },
      { t: "Ascending bellows do not require oxygen to function.", ok: false },
      { t: "Descending bellows cannot be used with circle systems.", ok: false },
    ],
    rationale: "Ascending bellows require exhaled gas return to rise, so a disconnect is more visually apparent.",
    metadata: { topic: "Bellows", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "bellows", "disconnect safety"] }
  },

  // ── boa-node11-ads-038 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-038",
    type: "mcq",
    prompt: "Which chemical byproduct is formed when Sevoflurane reacts with soda lime?",
    setup: "",
    ans: [
      { t: "Carbon monoxide", ok: false },
      { t: "Compound A", ok: true },
      { t: "Nitric oxide", ok: false },
      { t: "Methane", ok: false },
    ],
    rationale: "Sevoflurane can degrade in the presence of absorbent and form Compound A.",
    metadata: { topic: "CO2 Absorbent", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "sevoflurane", "Compound A", "absorbent"] }
  },

  // ── boa-node11-ads-039 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-039",
    type: "mcq",
    prompt: "Under what condition is the risk of Compound A formation increased?",
    setup: "",
    ans: [
      { t: "High concentrations of sevoflurane for long durations at low fresh gas flow rates.", ok: true },
      { t: "High oxygen concentration with no volatile agent.", ok: false },
      { t: "Use of nitrous oxide with high fresh gas flow.", ok: false },
      { t: "Use of desflurane at room temperature.", ok: false },
    ],
    rationale: "Low fresh gas flow, longer duration, and higher sevoflurane concentrations increase contact with absorbent and raise Compound A risk.",
    metadata: { topic: "CO2 Absorbent", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "sevoflurane", "Compound A", "low flow anesthesia"] }
  },

  // ── boa-node11-ads-040 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-040",
    type: "mcq",
    prompt: "What dangerous byproduct can be produced if volatile agents pass through desiccated carbon dioxide absorbent?",
    setup: "",
    ans: [
      { t: "Carbon monoxide", ok: true },
      { t: "Carbon dioxide", ok: false },
      { t: "Ozone", ok: false },
      { t: "Nitrous acid", ok: false },
    ],
    rationale: "Dry absorbent can degrade volatile anesthetics and generate carbon monoxide.",
    metadata: { topic: "CO2 Absorbent", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "desiccated absorbent", "carbon monoxide"] }
  },

  // ── boa-node11-ads-041 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-041",
    type: "mcq",
    prompt: "How do active and passive scavenging systems differ?",
    setup: "",
    ans: [
      { t: "Active uses exhaled carbon dioxide absorption while passive uses washout.", ok: false },
      { t: "Active uses a vacuum to pull waste gas, while passive relies on pressure to push gas out.", ok: true },
      { t: "Active is only for pediatric circuits, passive is for adults.", ok: false },
      { t: "Active is used only with wall oxygen, passive only with cylinders.", ok: false },
    ],
    rationale: "Active scavenging uses suction, while passive scavenging depends on circuit pressure and venting.",
    metadata: { topic: "Scavenging", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "scavenging", "active scavenging", "passive scavenging"] }
  },

  // ── boa-node11-ads-042 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-042",
    type: "mcq",
    prompt: "What is the first priority step if a pipeline crossover causing hypoxia is suspected during a case?",
    setup: "",
    ans: [
      { t: "Turn off the vaporizer and continue ventilation.", ok: false },
      { t: "Disconnect the pipeline hose from the wall and open the backup oxygen cylinder.", ok: true },
      { t: "Increase nitrous oxide flow to dilute the error.", ok: false },
      { t: "Close the APL valve and use the oxygen flush valve continuously.", ok: false },
    ],
    rationale: "If a pipeline gas source is wrong, isolate it immediately and switch to a known oxygen source from the backup cylinder.",
    metadata: { topic: "Troubleshooting", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "pipeline crossover", "hypoxia", "crisis management"] }
  },

  // ── boa-node11-ads-043 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-043",
    type: "mcq",
    prompt: "Which monitor is considered the true last line of defense against delivery of a hypoxic gas mixture?",
    setup: "",
    ans: [
      { t: "Fail-safe valve", ok: false },
      { t: "Oxygen pressure gauge", ok: false },
      { t: "Oxygen analyzer measuring FiO2 in the circuit", ok: true },
      { t: "Flowmeter bobbin position", ok: false },
    ],
    rationale: "Only an oxygen analyzer measures the actual inspired oxygen concentration being delivered to the patient.",
    metadata: { topic: "Safety Systems", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "oxygen analyzer", "hypoxic mixture safety"] }
  },

  // ── boa-node11-ads-044 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-044",
    type: "mcq",
    prompt: "In the MSMAID machine check mnemonic, what does the 'S' stand for?",
    setup: "",
    ans: [
      { t: "Scavenging", ok: false },
      { t: "Switch", ok: false },
      { t: "Suction", ok: true },
      { t: "Soda lime", ok: false },
    ],
    rationale: "The 'S' stands for suction, a critical part of the pre-case machine check.",
    metadata: { topic: "Machine Check", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "machine check", "MSMAID", "suction"] }
  },

  // ── boa-node11-ads-045 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-045",
    type: "mcq",
    prompt: "How can a provider troubleshoot carbon dioxide absorbent exhaustion mid-case if the canister cannot be changed immediately?",
    setup: "",
    ans: [
      { t: "Lower fresh gas flow to preserve absorbent function.", ok: false },
      { t: "Increase fresh gas flow to wash out carbon dioxide and convert the system into a nonrebreathing setup.", ok: true },
      { t: "Turn off oxygen and rely on room air.", ok: false },
      { t: "Close the APL valve and manually ventilate harder.", ok: false },
    ],
    rationale: "High fresh gas flow can wash CO2 out of the circuit and temporarily reduce rebreathing when absorbent is exhausted.",
    metadata: { topic: "Troubleshooting", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "carbon dioxide absorbent", "troubleshooting", "fresh gas flow"] }
  },

  // ── boa-node11-ads-046 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-046",
    type: "mcq",
    prompt: "At approximately what maximum pressure should a reservoir bag plateau to help protect the patient?",
    setup: "",
    ans: [
      { t: "Less than 20 cmH2O", ok: false },
      { t: "Less than 40 cmH2O", ok: false },
      { t: "Less than 60 cmH2O", ok: true },
      { t: "Less than 100 cmH2O", ok: false },
    ],
    rationale: "The reservoir bag should plateau below dangerously high pressures, commonly taught as under 60 cmH2O.",
    metadata: { topic: "Reservoir Bag", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "reservoir bag", "airway pressure"] }
  },

  // ── boa-node11-ads-047 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-047",
    type: "mcq",
    prompt: "What is the OSHA recommendation for maximum occupational exposure to nitrous oxide in the operating room?",
    setup: "",
    ans: [
      { t: "Less than 2 ppm", ok: false },
      { t: "Less than 10 ppm", ok: false },
      { t: "Less than 25 ppm", ok: true },
      { t: "Less than 100 ppm", ok: false },
    ],
    rationale: "The cited recommendation is to keep nitrous oxide exposure below 25 ppm.",
    metadata: { topic: "Scavenging", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "nitrous oxide", "OSHA", "occupational safety"] }
  },

  // ── boa-node11-ads-048 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-048",
    type: "mcq",
    prompt: "In the intermediate pressure system, at about what pressure is the oxygen failure alarm triggered?",
    setup: "",
    ans: [
      { t: "5 psi", ok: false },
      { t: "15 psi", ok: false },
      { t: "About 30 psi", ok: true },
      { t: "About 50 psi", ok: false },
    ],
    rationale: "The oxygen failure alarm is typically triggered when oxygen supply pressure falls below about 30 psi.",
    metadata: { topic: "Safety Systems", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "oxygen failure alarm", "intermediate pressure system"] }
  },

  // ── boa-node11-ads-049 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-049",
    type: "mcq",
    prompt: "Which breathing system is commonly used for pediatric transport because of its minimal dead space?",
    setup: "",
    ans: [
      { t: "Circle system", ok: false },
      { t: "Mapleson F or Jackson-Rees", ok: true },
      { t: "Mapleson D Bain circuit", ok: false },
      { t: "Closed ether mask system", ok: false },
    ],
    rationale: "The Mapleson F, or Jackson-Rees system, is valued in pediatric transport because it has low resistance and minimal dead space.",
    metadata: { topic: "Mapleson Systems", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "Mapleson F", "Jackson-Rees", "pediatrics"] }
  },

  // ── boa-node11-ads-050 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-050",
    type: "mcq",
    prompt: "The component that receives gases from the flowmeters and combines them before they enter the vaporizer is the:",
    setup: "",
    ans: [
      { t: "Common gas outlet", ok: false },
      { t: "Manifold", ok: true },
      { t: "Hanger yoke", ok: false },
      { t: "Scavenging interface", ok: false },
    ],
    rationale: "The manifold is the mixing chamber that combines gases from the flowmeters.",
    metadata: { topic: "Low Pressure System", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "manifold", "flowmeters"] }
  },

  // ── boa-node11-ads-051 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-051",
    type: "mcq",
    prompt: "A flow-measuring device with a glass tube and a bobbin or float is called a:",
    setup: "",
    ans: [
      { t: "Vaporizer", ok: false },
      { t: "Flowmeter or Thorpe tube", ok: true },
      { t: "Pressure regulator", ok: false },
      { t: "CO2 absorber", ok: false },
    ],
    rationale: "A Thorpe tube is the variable orifice flowmeter used in anesthesia machines.",
    metadata: { topic: "Flowmeters", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "flowmeter", "Thorpe tube"] }
  },

  // ── boa-node11-ads-052 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-052",
    type: "mcq",
    prompt: "To increase the flow of a gas, the flow control valve should be rotated:",
    setup: "",
    ans: [
      { t: "Clockwise", ok: false },
      { t: "Counterclockwise", ok: true },
      { t: "Inward only", ok: false },
      { t: "Upward only", ok: false },
    ],
    rationale: "Standard anesthesia flow control valves are opened by rotating them counterclockwise.",
    metadata: { topic: "Flowmeters", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "flow control valve", "operation"] }
  },

  // ── boa-node11-ads-053 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-053",
    type: "mcq",
    prompt: "Which safety system is specifically designed for E-cylinders to prevent gas cross-connection?",
    setup: "",
    ans: [
      { t: "DISS", ok: false },
      { t: "PISS", ok: true },
      { t: "Oxygen analyzer", ok: false },
      { t: "Vaporizer interlock", ok: false },
    ],
    rationale: "E-cylinders use the Pin Index Safety System.",
    metadata: { topic: "Safety Systems", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "PISS", "E-cylinder safety"] }
  },

  // ── boa-node11-ads-054 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-054",
    type: "mcq",
    prompt: "Which statement correctly describes flow within a flowmeter tube?",
    setup: "",
    ans: [
      { t: "Turbulent flow occurs at the bottom where the tube is narrow, and laminar flow occurs at the top where it is wider.", ok: false },
      { t: "Laminar flow occurs at the bottom where the tube is narrow, and turbulent flow occurs at the top where it is wider.", ok: true },
      { t: "Flow is entirely turbulent throughout the tube.", ok: false },
      { t: "Flow is entirely laminar throughout the tube.", ok: false },
    ],
    rationale: "At lower flow in the narrow lower portion, flow is more laminar. At higher flow in the wider upper portion, turbulence becomes more important.",
    metadata: { topic: "Flowmeters", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "flowmeter", "laminar flow", "turbulent flow"] }
  },

  // ── boa-node11-ads-055 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-055",
    type: "mcq",
    prompt: "What can occur if liquid anesthetic is accidentally tipped into the bypass chamber of a vaporizer?",
    setup: "",
    ans: [
      { t: "The vaporizer stops delivering agent completely.", ok: false },
      { t: "The vaporizer may deliver a dangerously high concentration of anesthetic.", ok: true },
      { t: "The oxygen analyzer will automatically correct the error.", ok: false },
      { t: "Only nitrous oxide flow is affected.", ok: false },
    ],
    rationale: "Liquid anesthetic in the bypass chamber can cause the vaporizer to deliver an excessively high anesthetic concentration.",
    metadata: { topic: "Vaporizers", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "vaporizer", "safety hazard"] }
  },

  // ── boa-node11-ads-056 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-056",
    type: "mcq",
    prompt: "What is the purpose of a check valve in the pipeline inlet?",
    setup: "",
    ans: [
      { t: "It increases the pressure of wall gases.", ok: false },
      { t: "It prevents reverse flow of gas from the machine or cylinders back into the hospital pipeline.", ok: true },
      { t: "It measures oxygen concentration.", ok: false },
      { t: "It removes carbon monoxide from the gas supply.", ok: false },
    ],
    rationale: "A pipeline inlet check valve prevents reverse gas flow back into the hospital pipeline system.",
    metadata: { topic: "Intermediate Pressure System", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "pipeline inlet", "check valve"] }
  },

  // ── boa-node11-ads-057 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-057",
    type: "mcq",
    prompt: "How does an HMEF at the Y-piece help the patient?",
    setup: "",
    ans: [
      { t: "It adds volatile anesthetic to inspired gas.", ok: false },
      { t: "It acts as a heat and moisture exchanger filter, conserving exhaled heat and humidity.", ok: true },
      { t: "It measures end-tidal carbon dioxide directly.", ok: false },
      { t: "It lowers airway resistance by eliminating all turbulence.", ok: false },
    ],
    rationale: "An HMEF conserves heat and moisture and also functions as a filter.",
    metadata: { topic: "Breathing Circuit Components", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "HMEF", "Y-piece", "heat and moisture exchange"] }
  },

  // ── boa-node11-ads-058 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-058",
    type: "mcq",
    prompt: "In a circle system, why must the inspiratory and expiratory valves never open simultaneously?",
    setup: "",
    ans: [
      { t: "It would reduce oxygen pressure in the cylinders.", ok: false },
      { t: "It would allow rebreathing of carbon dioxide and ineffective ventilation.", ok: true },
      { t: "It would overheat the vaporizer.", ok: false },
      { t: "It would shut down the scavenging system.", ok: false },
    ],
    rationale: "The circle system depends on one-way flow. Simultaneous opening would disrupt directional flow and promote CO2 rebreathing.",
    metadata: { topic: "Circle System", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "circle system", "unidirectional valves", "rebreathing"] }
  },

  // ── boa-node11-ads-059 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-059",
    type: "mcq",
    prompt: "At what FiO2 should the oxygen analyzer alarm as a fail-safe threshold?",
    setup: "",
    ans: [
      { t: "Below 10%", ok: false },
      { t: "Below 18%", ok: true },
      { t: "Below 25%", ok: false },
      { t: "Below 30%", ok: false },
    ],
    rationale: "The source set notes an alarm threshold for FiO2 below 18 percent.",
    metadata: { topic: "Safety Systems", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "oxygen analyzer", "FiO2 alarm"] }
  },

  // ── boa-node11-ads-060 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-060",
    type: "mcq",
    prompt: "Why is it critical to check the battery backup of an anesthesia machine?",
    setup: "",
    ans: [
      { t: "To preserve vaporizer calibration.", ok: false },
      { t: "To ensure the ventilator and monitors continue to function during power failure.", ok: true },
      { t: "To maintain suction pressure.", ok: false },
      { t: "To prevent oxygen cylinder depletion.", ok: false },
    ],
    rationale: "Battery backup is essential to maintain powered functions such as ventilation and monitoring during electrical failure.",
    metadata: { topic: "Electrical Safety", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "battery backup", "power failure"] }
  },

  // ── boa-node11-ads-061 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-061",
    type: "mcq",
    prompt: "Which gas flow control knob has a unique fluted profile so it can be identified by touch?",
    setup: "",
    ans: [
      { t: "Nitrous oxide", ok: false },
      { t: "Air", ok: false },
      { t: "Carbon dioxide", ok: false },
      { t: "Oxygen", ok: true },
    ],
    rationale: "The oxygen knob is intentionally tactilely distinct for safety.",
    metadata: { topic: "Machine Safety", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "oxygen knob", "machine safety"] }
  },

  // ── boa-node11-ads-062 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-062",
    type: "mcq",
    prompt: "If the oxygen flush is activated and the breathing circuit pressure gauge does not move, where is the most likely problem?",
    setup: "",
    ans: [
      { t: "A disconnected scavenging hose.", ok: false },
      { t: "A major disconnect between the common gas outlet and the patient.", ok: true },
      { t: "A depleted vaporizer.", ok: false },
      { t: "An exhausted CO2 absorbent canister.", ok: false },
    ],
    rationale: "If oxygen flush flow does not build pressure, a large disconnect between the machine output and patient is likely present.",
    metadata: { topic: "Troubleshooting", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "oxygen flush valve", "disconnect troubleshooting"] }
  },

  // ── boa-node11-ads-063 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-063",
    type: "mcq",
    prompt: "What is the efficiency requirement for filters used in anesthesia breathing circuits?",
    setup: "",
    ans: [
      { t: "Greater than 80% for particles over 1 micron.", ok: false },
      { t: "Greater than 90% for particles over 0.5 microns.", ok: false },
      { t: "Greater than 95% for particles at least 0.3 microns.", ok: true },
      { t: "Greater than 99.9% for all gases and vapors.", ok: false },
    ],
    rationale: "The cited requirement is greater than 95 percent efficiency for particles 0.3 microns or larger.",
    metadata: { topic: "Breathing Circuit Components", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "filters", "breathing circuit", "infection control"] }
  },

  // ── boa-node11-ads-064 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-064",
    type: "mcq",
    prompt: "How does a second stage reducing device differ from the first stage regulator?",
    setup: "",
    ans: [
      { t: "It increases pressure back to cylinder levels.", ok: false },
      { t: "It further reduces pressure to a more precise level to stabilize flowmeter output despite inlet fluctuations.", ok: true },
      { t: "It measures oxygen concentration in the circuit.", ok: false },
      { t: "It replaces the fail-safe valve completely.", ok: false },
    ],
    rationale: "A second stage reducing device provides more stable and precise pressure for consistent flowmeter performance.",
    metadata: { topic: "Intermediate Pressure System", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "pressure regulation", "flowmeter accuracy"] }
  },

  // ── boa-node11-ads-065 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-065",
    type: "mcq",
    prompt: "Which Mapleson system is generally considered most efficient for spontaneous ventilation?",
    setup: "",
    ans: [
      { t: "Mapleson A", ok: true },
      { t: "Mapleson B", ok: false },
      { t: "Mapleson D", ok: false },
      { t: "Mapleson F", ok: false },
    ],
    rationale: "Mapleson A is classically the most efficient Mapleson system for spontaneous ventilation.",
    metadata: { topic: "Mapleson Systems", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "Mapleson", "spontaneous ventilation"] }
  },

  // ── boa-node11-ads-066 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-066",
    type: "mcq",
    prompt: "What is the primary risk of using Baralyme with Sevoflurane compared with soda lime?",
    setup: "",
    ans: [
      { t: "More carbon dioxide rebreathing.", ok: false },
      { t: "Higher risk of spontaneous combustion and operating room fires.", ok: true },
      { t: "Lower oxygen concentration.", ok: false },
      { t: "Inability to use low fresh gas flow.", ok: false },
    ],
    rationale: "Sevoflurane interacting with Baralyme is associated with more dangerous degradation behavior, including fire risk.",
    metadata: { topic: "CO2 Absorbent", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "Baralyme", "sevoflurane", "fire risk"] }
  },

  // ── boa-node11-ads-067 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-067",
    type: "mcq",
    prompt: "What visual cue suggests that carbon dioxide absorbent is exhausted?",
    setup: "",
    ans: [
      { t: "The granules turn bright red.", ok: false },
      { t: "The pH-sensitive dye, often ethyl violet, turns purple.", ok: true },
      { t: "The canister pressure rises to 70 cmH2O.", ok: false },
      { t: "The reservoir bag becomes rigid.", ok: false },
    ],
    rationale: "Many absorbents use a pH-sensitive indicator dye such as ethyl violet that turns purple when exhausted.",
    metadata: { topic: "CO2 Absorbent", priority: "high", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "carbon dioxide absorbent", "ethyl violet"] }
  },

  // ── boa-node11-ads-068 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-068",
    type: "mcq",
    prompt: "Which description best matches an open breathing system as used historically?",
    setup: "",
    ans: [
      { t: "It contains a reservoir bag and no fresh gas flow.", ok: false },
      { t: "It has no reservoir bag and no rebreathing, such as ether dripped onto a gauze mask.", ok: true },
      { t: "It uses a circle absorber and low flow anesthesia.", ok: false },
      { t: "It requires a ventilator with ascending bellows.", ok: false },
    ],
    rationale: "Historically, open systems involved unrestricted atmospheric access, no reservoir bag, and no controlled rebreathing.",
    metadata: { topic: "Breathing Systems", priority: "low", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "open breathing system", "historical systems"] }
  },

  // ── boa-node11-ads-069 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-069",
    type: "mcq",
    prompt: "How does the machine indicate loss of electrical power?",
    setup: "",
    ans: [
      { t: "By shutting off all gas flow silently.", ok: false },
      { t: "By activating a power failure indicator alarm.", ok: true },
      { t: "By opening the APL valve automatically.", ok: false },
      { t: "By venting all gases to scavenging.", ok: false },
    ],
    rationale: "The machine alerts the provider to electrical loss using a power failure alarm or indicator.",
    metadata: { topic: "Electrical Safety", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "electrical safety", "power failure"] }
  },

  // ── boa-node11-ads-070 ──────────────────────────────────────────────────────
  {
    id: "boa-node11-ads-070",
    type: "mcq",
    prompt: "Which machine electrical component is specifically NOT intended for high-frequency surgical devices?",
    setup: "",
    ans: [
      { t: "The oxygen analyzer outlet", ok: false },
      { t: "The auxiliary electrical outlets", ok: true },
      { t: "The battery charger", ok: false },
      { t: "The pressure regulator housing", ok: false },
    ],
    rationale: "The machine's auxiliary outlets are not intended for high-power surgical devices such as electrosurgical units.",
    metadata: { topic: "Electrical Safety", priority: "medium", category: "anesthesia-machine", source: "node-11-chapter-11", tags: ["anesthesia delivery systems", "electrical safety", "auxiliary outlets"] }
  },

];

export const MACHINE_METADATA = {
  nodeId: "node-11",
  courseId: "basics-of-anesthesia",
  chapter: "Chapter 11",
  title: "Anesthesia Machine",
  totalQuestions: MACHINE_QUESTIONS.length,
  questionTypes: {
    mcq:   MACHINE_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: MACHINE_QUESTIONS.filter(q => q.type === 'multi').length,
    short: MACHINE_QUESTIONS.filter(q => q.type === 'short').length,
  }
};
