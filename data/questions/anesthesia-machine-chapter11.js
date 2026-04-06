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
