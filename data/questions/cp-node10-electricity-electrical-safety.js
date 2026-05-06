/**
 * Chemistry & Physics for Anesthesia — Node 10
 * Electricity & Electrical Safety
 *
 * Topics: Ohm's law, AC vs DC, macro/microshock, grounding systems,
 * isolated power systems, line isolation monitors, GFCI, capacitance,
 * electrosurgical units, defibrillation, leakage current, impedance.
 *
 * Source: NAS 510 Electricity & Electrical Safety Lecture
 */

export const CP_NODE10_QUESTIONS = [

  // ═══════════════════════════════════════════════════════════════════════════
  // OHM'S LAW — VOLTAGE, CURRENT, RESISTANCE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n10-001",
    type: "mcq",
    prompt: "Ohm's law states V = IR. A monitoring device draws 0.5 mA of current through a patient's skin resistance of 1,000 ohms. What voltage is being applied?",
    setup: "",
    ans: [
      { t: "0.5 V — voltage equals current (0.0005 A) multiplied by resistance (1,000 Ω)",  ok: true  },
      { t: "5.0 V — current must be converted to amps before multiplication",                ok: false },
      { t: "500 V — multiply milliamps directly by ohms without unit conversion",             ok: false },
      { t: "0.05 V — divide current by resistance rather than multiplying",                   ok: false },
    ],
    rationale: "Ohm's law: V = I × R. Converting 0.5 mA to amps gives 0.0005 A. Multiplying by 1,000 Ω yields 0.5 V. This fundamental relationship governs all electrical circuits in the OR, from patient monitors to electrosurgical devices. Understanding unit conversion (mA to A) is essential for calculating safe current levels through patient tissue.",
    scene: "electrical_safety",
    sceneCfg: { label: "OHM'S LAW — V = IR" },
    metadata: { topic: "Ohm's Law", priority: "high" },
  },

  {
    id: "cp-n10-002",
    type: "mcq",
    prompt: "According to Ohm's law, what happens to current flow through the body if skin resistance decreases (e.g., from perspiration or surgical prep solution)?",
    setup: "",
    ans: [
      { t: "Current increases — lower resistance allows more current to flow for the same applied voltage",            ok: true  },
      { t: "Current decreases — less resistance means less driving force for electron movement through tissue",         ok: false },
      { t: "Current remains unchanged — skin resistance does not affect current flow through deeper tissues",           ok: false },
      { t: "Current oscillates — changing resistance causes alternating current patterns regardless of the source type", ok: false },
    ],
    rationale: "From Ohm's law (I = V/R), current is inversely proportional to resistance at constant voltage. Dry skin has high resistance (10,000–100,000 Ω), but wet or prepped skin may drop to 1,000 Ω or less. This dramatically increases current flow and shock hazard. Surgical prep solutions, perspiration, and electrode gel all reduce skin impedance, making patients in the OR particularly vulnerable to electrical injury.",
    scene: "electrical_safety",
    sceneCfg: { label: "SKIN RESISTANCE & CURRENT" },
    metadata: { topic: "Ohm's Law", priority: "high" },
  },

  {
    id: "cp-n10-003",
    type: "mcq",
    prompt: "A defibrillator delivers 200 joules to a patient with a transthoracic impedance of 50 ohms. Using the energy formula E = I²Rt, which factor would most reduce the effectiveness of energy delivery?",
    setup: "",
    ans: [
      { t: "Increased transthoracic impedance from poor pad contact — less current reaches the myocardium",                ok: true  },
      { t: "Decreased transthoracic impedance from excessive gel — too much current bypasses the heart entirely",           ok: false },
      { t: "Using a higher energy setting — excessive energy always reduces the fraction delivered to cardiac tissue",       ok: false },
      { t: "Shorter shock duration — brief pulses deliver more total energy per unit time than longer waveforms",            ok: false },
    ],
    rationale: "Transthoracic impedance (typically 70–80 Ω) determines how much current actually reaches the myocardium. High impedance from poor pad contact, excessive chest hair, or improper pad placement reduces current delivery. Since energy delivery depends on I²Rt, higher impedance (lower I for a given V) means less energy is delivered to the heart. Proper pad placement and firm contact are essential for effective defibrillation.",
    scene: "electrical_safety",
    sceneCfg: { label: "DEFIBRILLATOR IMPEDANCE" },
    metadata: { topic: "Ohm's Law", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AC vs DC CURRENT
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n10-004",
    type: "mcq",
    prompt: "Standard US hospital electrical outlets supply alternating current (AC) at 60 Hz. Why is 60 Hz AC particularly dangerous regarding cardiac rhythm?",
    setup: "",
    ans: [
      { t: "60 Hz is close to the vulnerable period frequency, increasing the risk of inducing ventricular fibrillation", ok: true  },
      { t: "60 Hz AC only produces thermal burns and has no direct effect on cardiac electrical conduction pathways",      ok: false },
      { t: "60 Hz AC is safer than DC because the alternating polarity cancels out the net current through the heart",     ok: false },
      { t: "60 Hz is too slow to stimulate cardiac tissue, so the primary risk is skeletal muscle tetany only",            ok: false },
    ],
    rationale: "AC at 60 Hz is especially dangerous because each cycle can potentially stimulate the heart during its vulnerable period (relative refractory period on the T wave). At 60 cycles per second, the probability of a stimulus coinciding with the vulnerable period is high. DC shock, while also dangerous, delivers a single impulse. Frequencies above 100,000 Hz (as used in electrosurgery) do not cause cardiac stimulation because the rapid oscillations do not allow ion channels to respond.",
    scene: "electrical_safety",
    sceneCfg: { label: "60 Hz AC — CARDIAC DANGER" },
    metadata: { topic: "AC vs DC Current", priority: "high" },
  },

  {
    id: "cp-n10-005",
    type: "mcq",
    prompt: "Electrosurgical units (Bovie) operate at frequencies of 300,000–3,000,000 Hz. Why do these high-frequency currents not cause electrocution?",
    setup: "",
    ans: [
      { t: "At frequencies above ~100 kHz, current oscillates too rapidly for cardiac and nerve cell membranes to depolarize", ok: true  },
      { t: "High-frequency current does not actually pass through the patient's body — it only arcs at the tissue surface",     ok: false },
      { t: "The amperage used in electrosurgery is far below the microshock threshold so no tissue stimulation occurs",         ok: false },
      { t: "Electrosurgical current travels only through the grounding pad circuit and never reaches the heart",                ok: false },
    ],
    rationale: "Cell membranes act as capacitors with a time constant that limits how quickly they can depolarize. At frequencies above approximately 100,000 Hz (100 kHz), the current alternates so rapidly that sodium channels cannot open and close fast enough to generate an action potential. The current still causes resistive heating (hence tissue cutting and coagulation), but it cannot stimulate nerves or cardiac muscle. This is the fundamental safety principle behind electrosurgery.",
    scene: "electrical_safety",
    sceneCfg: { label: "ESU — HIGH FREQUENCY SAFETY" },
    metadata: { topic: "Electrosurgical Units", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MACROSHOCK & MICROSHOCK THRESHOLDS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n10-006",
    type: "mcq",
    prompt: "What is the approximate current threshold at which a person can first perceive an electrical shock (macroshock, 60 Hz AC, skin contact)?",
    setup: "",
    ans: [
      { t: "1 mA — the threshold of perception for 60 Hz AC through intact skin",                    ok: true  },
      { t: "10 mA — perception requires enough current to stimulate sensory nerve endings in the skin", ok: false },
      { t: "100 μA — even microamp-level currents are immediately felt at the skin surface",           ok: false },
      { t: "100 mA — the perception threshold and fibrillation threshold are the same value",          ok: false },
    ],
    rationale: "The hierarchy of macroshock effects at 60 Hz AC: 1 mA = threshold of perception (tingling), 5 mA = maximum harmless current, 10–20 mA = let-go threshold (sustained muscle contraction prevents releasing the conductor), 50 mA = pain and possible respiratory arrest, 100–300 mA = ventricular fibrillation. These thresholds are clinically important because OR equipment can potentially deliver currents at any of these levels if a fault occurs.",
    scene: "electrical_safety",
    sceneCfg: { label: "MACROSHOCK — 1 mA PERCEPTION" },
    metadata: { topic: "Macroshock", priority: "high" },
  },

  {
    id: "cp-n10-007",
    type: "mcq",
    prompt: "The 'let-go' current for 60 Hz AC is approximately 10–20 mA. What does this term describe clinically?",
    setup: "",
    ans: [
      { t: "The current level causing sustained skeletal muscle tetany so the victim cannot voluntarily release the conductor",  ok: true  },
      { t: "The maximum current a patient can safely receive before ventricular fibrillation is induced",                        ok: false },
      { t: "The current at which a circuit breaker trips and automatically disconnects power to the faulty device",              ok: false },
      { t: "The current threshold at which the diaphragm relaxes, allowing the patient to resume spontaneous ventilation",       ok: false },
    ],
    rationale: "At 10–20 mA (60 Hz AC), current through the forearm flexor muscles causes sustained tetanic contraction. The victim physically cannot open their hand to release the energized conductor. This is extremely dangerous because continued contact allows current to increase as perspiration lowers skin resistance, potentially escalating to respiratory arrest (50 mA) or ventricular fibrillation (100 mA). In the OR, the anesthetist must be prepared to cut the power source rather than try to pull the patient away.",
    scene: "electrical_safety",
    sceneCfg: { label: "LET-GO THRESHOLD — 10–20 mA" },
    metadata: { topic: "Macroshock", priority: "high" },
  },

  {
    id: "cp-n10-008",
    type: "mcq",
    prompt: "Microshock refers to electrical current delivered directly to the myocardium. What is the threshold for microshock-induced ventricular fibrillation?",
    setup: "",
    ans: [
      { t: "100–200 μA (microamperes) — direct myocardial contact bypasses the protective resistance of skin and tissue",  ok: true  },
      { t: "1–5 mA (milliamperes) — the same threshold as the skin perception level for macroshock",                       ok: false },
      { t: "10–20 mA — the let-go current threshold applies equally to internal and external shock",                       ok: false },
      { t: "50–100 μA — only half the commonly cited threshold is actually needed to fibrillate the heart",                 ok: false },
    ],
    rationale: "Microshock can cause ventricular fibrillation at just 100–200 μA (0.1–0.2 mA) when current is delivered directly to the myocardium via intracardiac catheters (PA catheters, pacing wires, central lines). This is 1,000 times less than the macroshock VF threshold of 100 mA. The skin and body tissues normally provide substantial resistance that limits current reaching the heart, but invasive monitoring bypasses this protection. This is why electrically susceptible patients require extra precautions.",
    scene: "electrical_safety",
    sceneCfg: { label: "MICROSHOCK — 100 μA VF" },
    metadata: { topic: "Microshock", priority: "high" },
  },

  {
    id: "cp-n10-009",
    type: "mcq",
    prompt: "Which patient scenario creates the greatest risk for microshock-induced ventricular fibrillation?",
    setup: "",
    ans: [
      { t: "A patient with a saline-filled pulmonary artery catheter connected to an externalized transducer — the fluid column provides a direct conductive path to the heart", ok: true  },
      { t: "A patient with peripheral IV access in the left hand — peripheral veins do not provide a direct electrical path to the myocardium",                                ok: false },
      { t: "A patient with a pulse oximeter on the finger — optical sensors cannot conduct electrical current to the heart",                                                    ok: false },
      { t: "A patient with surface ECG electrodes — gel electrodes distribute current over a large area preventing microshock",                                                 ok: false },
    ],
    rationale: "Saline-filled intracardiac catheters (PA catheters, CVP lines, pacing wires) create a direct low-resistance conductive pathway from the external environment to the endocardium. Even tiny leakage currents (100 μA) from monitoring equipment connected to these lines can cause VF. Peripheral IVs, pulse oximeters, and surface ECG leads do not provide direct myocardial contact. Patients with intracardiac catheters are classified as 'electrically susceptible' and require isolated power systems and strict equipment safety protocols.",
    scene: "electrical_safety",
    sceneCfg: { label: "MICROSHOCK — PA CATHETER RISK" },
    metadata: { topic: "Microshock", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUNDING SYSTEMS & ISOLATED POWER SYSTEMS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n10-010",
    type: "mcq",
    prompt: "What is the primary purpose of an isolated power system (IPS) in the operating room?",
    setup: "",
    ans: [
      { t: "To prevent a single ground fault from completing a circuit through the patient — the first fault does not cause shock", ok: true  },
      { t: "To provide higher voltage for electrosurgical units that require more power than standard outlets",                     ok: false },
      { t: "To filter out electromagnetic interference from surgical equipment that could corrupt monitoring signals",              ok: false },
      { t: "To provide backup power during a hospital power outage so surgical procedures can continue safely",                    ok: false },
    ],
    rationale: "An isolated power system uses an isolation transformer to separate OR circuits from the main grounded power supply. In a grounded system, a single fault (person touching a hot wire while grounded) completes the circuit and causes shock. In an isolated system, the first fault does not complete a circuit because neither conductor is referenced to ground. Current cannot flow to ground through the person. The system only becomes dangerous after a second fault, which the line isolation monitor is designed to detect.",
    scene: "electrical_safety",
    sceneCfg: { label: "ISOLATED POWER SYSTEM" },
    metadata: { topic: "Isolated Power Systems", priority: "high" },
  },

  {
    id: "cp-n10-011",
    type: "mcq",
    prompt: "A line isolation monitor (LIM) in the OR alarms when it detects a hazard current of 5 mA. What does this alarm indicate?",
    setup: "",
    ans: [
      { t: "A first fault (ground fault) has occurred — the isolated system is now equivalent to a grounded system and a second fault would cause shock", ok: true  },
      { t: "A patient is currently receiving a 5 mA shock and the team must immediately disconnect all electrical equipment",                             ok: false },
      { t: "Total current draw on the circuit has exceeded its capacity and the circuit breaker is about to trip",                                         ok: false },
      { t: "The isolation transformer has failed and the OR has lost all electrical power requiring emergency backup generators",                          ok: false },
    ],
    rationale: "The LIM continuously monitors the degree of isolation between the two conductors and ground. When it detects that a potential ground fault could allow 2–5 mA of hazard current to flow (depending on the threshold), it alarms. This means one conductor has developed a connection to ground (first fault). The system is still safe — no one is being shocked — but it has lost its protective isolation. A second fault could now cause shock. The response is to identify and unplug the last device connected, NOT to cancel surgery or disconnect all equipment.",
    scene: "electrical_safety",
    sceneCfg: { label: "LIM ALARM — FIRST FAULT" },
    metadata: { topic: "Line Isolation Monitor", priority: "high" },
  },

  {
    id: "cp-n10-012",
    type: "mcq",
    prompt: "When a line isolation monitor (LIM) alarms during surgery, what is the correct immediate response?",
    setup: "",
    ans: [
      { t: "Unplug the last piece of equipment connected — it is the most likely source of the ground fault",                                   ok: true  },
      { t: "Immediately stop the surgical procedure and evacuate the OR until the fault is repaired by biomedical engineering",                   ok: false },
      { t: "Disconnect all monitoring from the patient because the LIM alarm means the patient is actively receiving a shock",                   ok: false },
      { t: "Reset the LIM by pressing the silence button — alarms frequently trigger from normal equipment power cycling",                       ok: false },
    ],
    rationale: "A LIM alarm indicates a first fault has degraded the isolation of the power system, but the patient is NOT currently being shocked. Surgery should NOT stop. The correct response is to unplug the last device connected, as it is the most probable source of the fault. If the alarm clears, that device should be removed from service and inspected. If the alarm persists, additional devices should be unplugged one at a time. The surgery continues because the first fault alone does not create a shock hazard — only a simultaneous second fault would.",
    scene: "electrical_safety",
    sceneCfg: { label: "LIM ALARM — RESPONSE" },
    metadata: { topic: "Line Isolation Monitor", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GFCI & GROUNDING
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n10-013",
    type: "mcq",
    prompt: "How does a ground fault circuit interrupter (GFCI) differ from the isolated power system used in ORs?",
    setup: "",
    ans: [
      { t: "A GFCI interrupts the circuit within milliseconds of detecting a ground fault, cutting power — an IPS does not interrupt power on the first fault", ok: true  },
      { t: "A GFCI provides isolation from ground just like an IPS but at a lower cost and is equally suitable for OR use",                                     ok: false },
      { t: "A GFCI monitors current leakage but never interrupts power — it only sounds an alarm identical to a LIM",                                          ok: false },
      { t: "A GFCI is designed for use only with DC circuits while isolated power systems handle both AC and DC",                                               ok: false },
    ],
    rationale: "GFCIs detect a difference between current flowing in the hot and neutral conductors (indicating leakage to ground) and interrupt the circuit in about 4–5 milliseconds. While effective for preventing macroshock, GFCIs cut power — which is unacceptable in the OR during critical procedures. Isolated power systems with LIMs allow the first fault to occur without interrupting power, alerting staff while maintaining continuous equipment operation. GFCIs are appropriate for wet locations (bathrooms, kitchens) but not for ORs where power interruption could endanger the patient.",
    scene: "electrical_safety",
    sceneCfg: { label: "GFCI vs ISOLATED POWER" },
    metadata: { topic: "GFCI", priority: "medium" },
  },

  {
    id: "cp-n10-014",
    type: "mcq",
    prompt: "The equipment grounding wire (green wire) in a hospital-grade power cord serves what primary safety function?",
    setup: "",
    ans: [
      { t: "It provides a low-resistance path to ground for fault current, preventing the equipment chassis from becoming energized", ok: true  },
      { t: "It carries the return current during normal device operation to complete the standard power circuit",                      ok: false },
      { t: "It delivers the ground reference voltage needed for monitoring equipment to display accurate waveforms",                  ok: false },
      { t: "It shields the other conductors from electromagnetic interference generated by nearby surgical equipment",                ok: false },
    ],
    rationale: "The equipment ground wire (green or green/yellow in hospital-grade plugs) connects the metal chassis of equipment to the building ground. If an internal fault energizes the chassis, fault current flows through the low-resistance ground wire (instead of through a person touching the device) and trips the circuit breaker. Without intact grounding, a person touching the energized chassis and a grounded object would complete the circuit and receive a shock. Regular inspection of ground wire integrity is a critical part of biomedical equipment maintenance.",
    scene: "electrical_safety",
    sceneCfg: { label: "EQUIPMENT GROUNDING" },
    metadata: { topic: "Grounding Systems", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ELECTROSURGICAL UNITS — MONOPOLAR vs BIPOLAR
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n10-015",
    type: "mcq",
    prompt: "In monopolar electrosurgery (Bovie), current travels from the active electrode through the patient to the return electrode (grounding pad). What is the most common cause of electrosurgical burns at alternative sites?",
    setup: "",
    ans: [
      { t: "Inadequate contact area at the return electrode — concentrating current density causes thermal injury at the pad site",  ok: true  },
      { t: "Using the device on coagulation mode rather than cut mode — coagulation always produces deeper thermal spread",          ok: false },
      { t: "Patient contact with the metal OR table — modern OR tables are fully insulated and cannot serve as alternate paths",      ok: false },
      { t: "Excessive voltage settings — voltage above 100 V automatically causes burns regardless of current pathway or pad contact", ok: false },
    ],
    rationale: "Electrosurgical burns occur when current density (current per unit area) is high enough to cause resistive heating. The active electrode is intentionally small to concentrate energy for cutting/coagulation. The return electrode must be large to disperse current over a wide area, keeping current density (and heating) low. If the return pad is partially detached, improperly placed, or has insufficient contact, current concentrates at the remaining contact area, producing an unintended burn. Modern return electrode monitoring (REM) systems detect impedance changes at the pad and alarm if contact is compromised.",
    scene: "electrical_safety",
    sceneCfg: { label: "MONOPOLAR ESU — BURNS" },
    metadata: { topic: "Electrosurgical Units", priority: "high" },
  },

  {
    id: "cp-n10-016",
    type: "mcq",
    prompt: "Why is bipolar electrosurgery considered safer than monopolar for procedures near the heart or in patients with pacemakers?",
    setup: "",
    ans: [
      { t: "Current flows only between the two tips of the bipolar forceps — it does not travel through the body to a remote return electrode",  ok: true  },
      { t: "Bipolar units operate at lower frequencies (below 1 kHz) that cannot stimulate cardiac tissue under any circumstances",               ok: false },
      { t: "Bipolar devices use DC current exclusively, which is inherently safer than AC current for cardiac patients",                          ok: false },
      { t: "Bipolar forceps deliver zero current to the patient — they use ultrasonic vibration rather than electrical energy for hemostasis",    ok: false },
    ],
    rationale: "In bipolar electrosurgery, both the active and return electrodes are incorporated into the forceps tips. Current passes only through the tissue grasped between the tips, traveling a very short distance. No return pad is needed, and current does not traverse the body. This eliminates the risk of current passing near the heart, pacemaker leads, or other sensitive structures. Bipolar is preferred for neurosurgery, ophthalmic surgery, and procedures in patients with cardiac implantable electronic devices (CIEDs).",
    scene: "electrical_safety",
    sceneCfg: { label: "BIPOLAR ESU — SAFETY" },
    metadata: { topic: "Electrosurgical Units", priority: "high" },
  },

  {
    id: "cp-n10-017",
    type: "mcq",
    prompt: "Where should the electrosurgical return electrode (grounding pad) be placed on the patient?",
    setup: "",
    ans: [
      { t: "Over a large, well-vascularized muscle mass close to the surgical site — typically the thigh or upper arm", ok: true  },
      { t: "Over a bony prominence such as the scapula or iliac crest to ensure firm, consistent contact pressure",     ok: false },
      { t: "As far from the surgical site as possible to maximize the current pathway and reduce tissue heating",        ok: false },
      { t: "On the same side as any ECG electrodes to ensure a common ground reference for monitoring accuracy",        ok: false },
    ],
    rationale: "The return electrode should be placed over a well-vascularized muscular area near the surgical site. Good perfusion dissipates heat, and proximity to the surgical site minimizes the current pathway through the body. Bony prominences provide poor contact and uneven current distribution. The pad should avoid scar tissue, skin folds, implanted metal hardware, and areas with excessive hair (which creates air gaps). Proper placement reduces the risk of thermal injury and ensures effective current return.",
    scene: "electrical_safety",
    sceneCfg: { label: "RETURN ELECTRODE PLACEMENT" },
    metadata: { topic: "Electrosurgical Units", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CAPACITANCE, INDUCTANCE & IMPEDANCE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n10-018",
    type: "mcq",
    prompt: "Capacitance can cause current leakage in medical equipment. How does stray capacitance between internal wiring and the equipment chassis create a shock hazard?",
    setup: "",
    ans: [
      { t: "AC current can flow through capacitive coupling between energized conductors and the grounded chassis without a direct wire connection", ok: true  },
      { t: "Capacitance stores DC energy that discharges as a single shock when the chassis is touched during power cycling",                        ok: false },
      { t: "Capacitance only affects equipment operating above 1 MHz and has no relevance to standard 60 Hz hospital equipment",                    ok: false },
      { t: "Stray capacitance eliminates grounding protection by acting as an insulator between the chassis and the ground wire",                   ok: false },
    ],
    rationale: "Capacitive coupling occurs when two conductors (energized wire and chassis) are separated by an insulator (wire insulation). AC current can 'leak' through this capacitance because alternating voltage causes displacement current across the capacitor. The higher the frequency and the closer the conductors, the greater the leakage. This is why all medical equipment must meet strict leakage current standards (< 100 μA for patient-contact devices, < 10 μA for devices with direct cardiac connection). Regular leakage current testing by biomedical engineering is essential.",
    scene: "electrical_safety",
    sceneCfg: { label: "CAPACITIVE LEAKAGE" },
    metadata: { topic: "Capacitance", priority: "medium" },
  },

  {
    id: "cp-n10-019",
    type: "mcq",
    prompt: "Impedance, rather than simple resistance, determines current flow in AC circuits. Bioimpedance monitoring uses this principle to measure which physiologic parameter?",
    setup: "",
    ans: [
      { t: "Cardiac output and stroke volume — thoracic bioimpedance changes with blood volume shifts during the cardiac cycle",           ok: true  },
      { t: "Core body temperature — tissue impedance varies linearly with temperature allowing non-invasive thermometry",                  ok: false },
      { t: "Blood glucose concentration — impedance spectroscopy can distinguish glucose molecules from other plasma solutes",             ok: false },
      { t: "Depth of neuromuscular blockade — impedance across the neuromuscular junction reflects acetylcholine receptor occupancy",      ok: false },
    ],
    rationale: "Thoracic bioimpedance monitoring (e.g., NICOM, ICG) applies a small high-frequency, low-amplitude AC current across the thorax. As blood volume in the aorta and great vessels changes during systole and diastole, the thoracic impedance fluctuates. These impedance changes are proportional to stroke volume and can be used to calculate cardiac output non-invasively. Impedance (Z) combines resistance (R), capacitive reactance (Xc), and inductive reactance (XL) and is frequency-dependent, unlike pure resistance.",
    scene: "electrical_safety",
    sceneCfg: { label: "BIOIMPEDANCE MONITORING" },
    metadata: { topic: "Impedance", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEFIBRILLATOR SAFETY
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n10-020",
    type: "mcq",
    prompt: "During defibrillation in the OR, which precaution is most critical for the anesthesia provider?",
    setup: "",
    ans: [
      { t: "Ensure no team member is in contact with the patient, bed, or any conductive equipment connected to the patient during discharge", ok: true  },
      { t: "Disconnect the pulse oximeter probe because defibrillation energy will permanently damage the SpO₂ sensor",                        ok: false },
      { t: "Turn off the anesthesia machine completely because volatile agents are highly flammable when exposed to defibrillation energy",     ok: false },
      { t: "Increase the IV fluid rate to maximum to provide a low-resistance shunt that protects the myocardium from excessive energy",       ok: false },
    ],
    rationale: "The paramount safety concern during defibrillation is preventing shock to OR personnel. Current can travel through any conductive pathway from the patient (IV poles, bed frame, direct body contact). The anesthesia provider must announce 'Clear!' and visually verify that all personnel have broken contact with the patient and all connected equipment. Most modern monitors are designed to tolerate defibrillation without disconnection, though artifact may temporarily obscure the display. Volatile anesthetics are not flammable at clinical concentrations in oxygen-enriched environments.",
    scene: "electrical_safety",
    sceneCfg: { label: "DEFIBRILLATION — CLEAR!" },
    metadata: { topic: "Defibrillator Safety", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ELECTRICAL BURNS & CURRENT PATHWAYS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n10-021",
    type: "mcq",
    prompt: "Current flowing through the body follows the path of least resistance. Which tissue type has the LOWEST electrical resistance?",
    setup: "",
    ans: [
      { t: "Blood and nerve tissue — their high electrolyte and water content provide low-resistance conductive pathways", ok: true  },
      { t: "Bone — its dense mineral structure conducts electrons efficiently like metal conductors",                       ok: false },
      { t: "Adipose tissue — fat is a good conductor because lipid bilayers allow free ion movement",                      ok: false },
      { t: "Dry skin — the stratum corneum is the most efficient conductor of electrical current in the body",             ok: false },
    ],
    rationale: "Tissue resistance from lowest to highest: blood/nerve < muscle < wet skin < dry skin < bone < fat. Blood and nerves have high electrolyte concentrations and water content, making them excellent conductors. This explains why current preferentially follows neurovascular bundles through the body. Bone and fat have the highest resistance. The clinical implication is that electrical injuries often cause deep tissue damage along vascular pathways that may not be apparent from surface examination.",
    scene: "electrical_safety",
    sceneCfg: { label: "TISSUE RESISTANCE HIERARCHY" },
    metadata: { topic: "Electrical Burns", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEAKAGE CURRENT TESTING
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n10-022",
    type: "mcq",
    prompt: "Hospital biomedical engineering tests equipment for leakage current. What is the maximum allowable leakage current for devices with direct cardiac contact (e.g., transvenous pacing catheters)?",
    setup: "",
    ans: [
      { t: "10 μA — far below the 100 μA microshock fibrillation threshold to provide a safety margin",              ok: true  },
      { t: "100 μA — set exactly at the microshock threshold since any current below this level cannot cause harm",   ok: false },
      { t: "1 mA — the perception threshold for macroshock is the standard for all medical equipment in hospitals",   ok: false },
      { t: "500 μA — equipment with cardiac contact is allowed higher leakage because isolation systems provide protection", ok: false },
    ],
    rationale: "For equipment with direct cardiac connection (Type CF applied parts in IEC classification), the maximum allowable leakage current is 10 μA under normal conditions. This provides a substantial safety margin below the 100 μA microshock VF threshold. For general patient-contact equipment (Type BF), the limit is 100 μA. For non-patient-contact equipment, the limit is 500 μA. These stringent standards reflect the extreme vulnerability of the electrically susceptible patient with intracardiac catheters.",
    scene: "electrical_safety",
    sceneCfg: { label: "LEAKAGE CURRENT — 10 μA LIMIT" },
    metadata: { topic: "Leakage Current Testing", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MULTI-SELECT QUESTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n10-023",
    type: "multi",
    prompt: "Select the THREE correct statements about macroshock thresholds at 60 Hz AC:",
    setup: "",
    choices: [
      "1 mA is the threshold of perception — the minimum current felt as a tingling sensation",
      "10–20 mA is the let-go threshold — sustained muscle contraction prevents releasing the conductor",
      "100 mA can cause ventricular fibrillation if current crosses the heart",
      "50 mA is the threshold for permanent brain damage due to cerebral neuron depolarization",
      "500 mA is required before any thermal injury to skin can occur",
    ],
    correctAnswers: [
      "1 mA is the threshold of perception — the minimum current felt as a tingling sensation",
      "10–20 mA is the let-go threshold — sustained muscle contraction prevents releasing the conductor",
      "100 mA can cause ventricular fibrillation if current crosses the heart",
    ],
    selectCount: 3,
    rationale: "The macroshock hierarchy: 1 mA = perception, 5 mA = maximum harmless current, 10–20 mA = let-go threshold (tetanic muscle contraction), 50 mA = respiratory arrest and severe pain, 100–300 mA = ventricular fibrillation, 6+ A = sustained myocardial contraction and tissue burns. 50 mA does not specifically cause brain damage — it causes respiratory muscle paralysis and pain. Thermal burns can occur at much lower currents than 500 mA if current density is high (e.g., at a small contact point).",
    scene: "electrical_safety",
    sceneCfg: { label: "MACROSHOCK THRESHOLDS" },
    metadata: { topic: "Macroshock", priority: "high" },
  },

  {
    id: "cp-n10-024",
    type: "multi",
    prompt: "Select the TWO patient populations or scenarios that are at greatest risk for microshock:",
    setup: "",
    choices: [
      "Patient with a saline-filled pulmonary artery catheter in situ",
      "Patient with a peripheral pulse oximeter probe on the index finger",
      "Patient with temporary transvenous pacing wires externalized through the chest wall",
      "Patient with a standard three-lead surface ECG monitoring system",
      "Patient wearing sequential compression devices on both lower extremities",
    ],
    correctAnswers: [
      "Patient with a saline-filled pulmonary artery catheter in situ",
      "Patient with temporary transvenous pacing wires externalized through the chest wall",
    ],
    selectCount: 2,
    rationale: "Microshock risk exists when there is a direct conductive pathway from the external environment to the myocardium. Pulmonary artery catheters and transvenous pacing wires both provide this pathway — saline-filled lumens and metal wires respectively conduct current directly to the endocardium. Surface ECG electrodes, pulse oximeters, and compression devices contact only the skin surface and do not create direct cardiac conduction paths. These patients are classified as 'electrically susceptible' and require equipment with leakage current below 10 μA.",
    scene: "electrical_safety",
    sceneCfg: { label: "MICROSHOCK RISK PATIENTS" },
    metadata: { topic: "Microshock", priority: "high" },
  },

  {
    id: "cp-n10-025",
    type: "multi",
    prompt: "Select the TWO advantages of an isolated power system (IPS) over a standard grounded power system in the OR:",
    setup: "",
    choices: [
      "A single ground fault does not cause shock — the first fault merely triggers a LIM alarm",
      "Power is not interrupted during a first fault, allowing surgery to continue safely",
      "The IPS eliminates all risk of electrical shock regardless of the number of faults",
      "The IPS provides higher voltage than standard outlets for demanding surgical equipment",
      "The IPS automatically identifies and disconnects the specific faulty device without human intervention",
    ],
    correctAnswers: [
      "A single ground fault does not cause shock — the first fault merely triggers a LIM alarm",
      "Power is not interrupted during a first fault, allowing surgery to continue safely",
    ],
    selectCount: 2,
    rationale: "The two key advantages of an IPS are: (1) fault tolerance — a single ground fault does not complete a circuit through the patient because neither conductor is referenced to ground; and (2) continuity of power — unlike a GFCI, the IPS does not interrupt power on a first fault, which is critical during surgery. However, the IPS does NOT eliminate all shock risk (a second simultaneous fault creates a grounded circuit) and does NOT automatically identify or disconnect faulty equipment (staff must unplug devices one at a time to identify the source). The LIM provides the warning that the system has lost its isolation.",
    scene: "electrical_safety",
    sceneCfg: { label: "IPS ADVANTAGES" },
    metadata: { topic: "Isolated Power Systems", priority: "high" },
  },

  {
    id: "cp-n10-026",
    type: "multi",
    prompt: "Select the THREE correct statements regarding electrosurgical unit (ESU) safety in the OR:",
    setup: "",
    choices: [
      "Monopolar ESU requires a return electrode (grounding pad) to complete the circuit through the patient",
      "Bipolar ESU confines current flow between the two forceps tips and does not require a return pad",
      "ESU current at 300 kHz–3 MHz does not cause neuromuscular stimulation due to the high frequency",
      "ESU units use low-frequency 60 Hz AC, which is why they can cause cardiac arrhythmias",
      "Monopolar ESU is preferred over bipolar for surgery in patients with pacemakers",
    ],
    correctAnswers: [
      "Monopolar ESU requires a return electrode (grounding pad) to complete the circuit through the patient",
      "Bipolar ESU confines current flow between the two forceps tips and does not require a return pad",
      "ESU current at 300 kHz–3 MHz does not cause neuromuscular stimulation due to the high frequency",
    ],
    selectCount: 3,
    rationale: "Monopolar ESU sends current from a small active electrode through the patient to a large dispersive return electrode. Bipolar ESU limits current to tissue between the forceps tips, eliminating the need for a return pad. ESU operates at radiofrequencies (300 kHz–3 MHz), far above the threshold for neuromuscular stimulation (~100 kHz). ESU does NOT use 60 Hz AC — that would cause electrocution. Bipolar (not monopolar) is preferred for patients with pacemakers/ICDs because current does not traverse the body and cannot interfere with cardiac devices.",
    scene: "electrical_safety",
    sceneCfg: { label: "ESU SAFETY PRINCIPLES" },
    metadata: { topic: "Electrosurgical Units", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SHORT ANSWER QUESTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n10-027",
    type: "short",
    prompt: "What is the approximate current threshold (in microamperes) for microshock-induced ventricular fibrillation when current is applied directly to the myocardium?",
    setup: "",
    acceptedAnswers: [
      "100",
      "100 microamperes",
      "100 μA",
      "100-200 μA",
      "100-200 microamperes",
      "100 uA",
      "100-200",
    ],
    canonicalAnswer: "100 μA (microamperes)",
    rationale: "The microshock fibrillation threshold is approximately 100 μA (some sources cite 100–200 μA) when current is delivered directly to the myocardium via intracardiac catheters or pacing wires. This is 1,000 times less than the 100 mA macroshock VF threshold because skin and body tissue resistance is bypassed. This threshold drives the strict 10 μA maximum leakage current standard for equipment with direct cardiac contact.",
    scene: "electrical_safety",
    sceneCfg: { label: "MICROSHOCK THRESHOLD" },
    metadata: { topic: "Microshock", priority: "high" },
  },

  {
    id: "cp-n10-028",
    type: "short",
    prompt: "State Ohm's law as an equation relating voltage (V), current (I), and resistance (R).",
    setup: "",
    acceptedAnswers: [
      "V = IR",
      "V=IR",
      "V = I × R",
      "V = I * R",
      "V equals I times R",
      "voltage equals current times resistance",
      "I = V/R",
      "R = V/I",
    ],
    canonicalAnswer: "V = IR (voltage equals current times resistance)",
    rationale: "Ohm's law (V = IR) is the foundational equation of electrical circuits. Voltage (V, in volts) equals current (I, in amperes) multiplied by resistance (R, in ohms). Rearranged: I = V/R (current increases with voltage, decreases with resistance) and R = V/I. This relationship is essential for understanding why decreased skin resistance increases shock hazard, why small currents through low-resistance pathways (intracardiac catheters) can be lethal, and how defibrillator energy delivery depends on transthoracic impedance.",
    scene: "electrical_safety",
    sceneCfg: { label: "OHM'S LAW EQUATION" },
    metadata: { topic: "Ohm's Law", priority: "high" },
  },

  {
    id: "cp-n10-029",
    type: "short",
    prompt: "What device in the operating room continuously monitors the integrity of the isolated power system and alarms when a ground fault is detected?",
    setup: "",
    acceptedAnswers: [
      "line isolation monitor",
      "LIM",
      "Line Isolation Monitor",
      "line isolation monitor (LIM)",
      "the line isolation monitor",
      "a line isolation monitor",
    ],
    canonicalAnswer: "Line isolation monitor (LIM)",
    rationale: "The line isolation monitor (LIM) is mounted on the wall of each operating room that uses an isolated power system. It continuously measures the impedance between each conductor and ground, calculating the maximum current that could flow if a ground fault occurred (hazard current). When this hazard current exceeds the alarm threshold (typically 2–5 mA), the LIM sounds an audible and visual alarm. The LIM does NOT interrupt power — it only warns that the system has lost its protective isolation due to a first fault.",
    scene: "electrical_safety",
    sceneCfg: { label: "LINE ISOLATION MONITOR" },
    metadata: { topic: "Line Isolation Monitor", priority: "high" },
  },

];

export const CP_NODE10_METADATA = {
  nodeId:    "cp-node-10",
  courseId:  "chem-phys-anesthesia",
  chapter:   "Electricity & Electrical Safety",
  title:     "Electricity & Electrical Safety",
  totalQuestions: CP_NODE10_QUESTIONS.length,
  questionTypes: {
    mcq:   22,
    multi: 4,
    short: 3,
  }
};
