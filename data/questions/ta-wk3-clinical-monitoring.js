/**
 * Technological Advances in Anesthesia Practice, Week 3
 * Clinical Monitoring (Intraoperative Monitoring)
 * Sources: NAS 560 Anesthesia Monitoring lecture (ta-w3-001 to 046, comments cite "slide N") and NAS 560 Neuromuscular Monitoring lecture (ta-w3-047 onward, comments cite "NMB slide N"). Every question cites its source slide.
 * Textbook alignment: Pardo 20; Nagelhout 17 to 19.
 * Authoring conventions: periods, commas, and semicolons only (no dashes as punctuation); numeric ranges written with the word "to".
 */

export const TA_WK3_QUESTIONS = [

  /* ================================================================
     AANA standards, mandatory monitoring, and gas analysis
     ================================================================ */

  {
    id: "ta-w3-001",
    type: "mcq",
    prompt: "The AANA Standards of Care address intraoperative monitoring. Under Standard II, which physiologic parameters must be continually monitored, and how frequently at minimum?",
    setup: "",
    ans: [
      { t: "Oxygenation, ventilation, circulation, and temperature must be continually monitored, and the interval between mandatory measurements never exceeds 5 minutes", ok: true },
      { t: "Only oxygenation and circulation must be monitored, and readings are required no more often than every 30 minutes", ok: false },
      { t: "Only blood pressure and heart rate must be monitored, and only during induction and emergence", ok: false },
      { t: "Temperature alone must be monitored continuously, while the other parameters are optional", ok: false },
    ],
    rationale: "AANA Standard II requires continual monitoring of oxygenation, ventilation, circulation, and temperature. The frequency of mandatory monitoring varies by category but never exceeds 5 minutes, and if a monitor is not used a reason should be recorded on the patient record. Standard I separately requires the continuous presence of a qualified anesthesia provider because physiologic derangements can occur rapidly. For the CRNA, these standards define the minimum monitoring that must be documented for every anesthetic. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 4
    scene: "patient",
    sceneCfg: { label: "AANA STANDARD II" },
    metadata: { topic: "AANA Standards", priority: "high" },
  },

  {
    id: "ta-w3-002",
    type: "mcq",
    prompt: "Among the monitors specifically mandated during anesthesia, the oxygen analyzer guards against delivery of a hypoxic gas mixture. On the inspired oxygen analyzer, what reading is considered a hypoxic mixture?",
    setup: "",
    ans: [
      { t: "Any inspired oxygen concentration below 30 percent is considered a hypoxic mixture", ok: true },
      { t: "Any inspired oxygen concentration below 80 percent is considered a hypoxic mixture", ok: false },
      { t: "Only an inspired oxygen concentration of 0 percent qualifies as a hypoxic mixture", ok: false },
      { t: "Any inspired oxygen concentration above 21 percent is considered a hypoxic mixture", ok: false },
    ],
    rationale: "The specifically mandated monitors include alarms for disconnects with the ventilator, continuous ECG, blood pressure and heart rate at least every 5 minutes, temperature, an oxygen analyzer, blood oxygenation, verification of expired oxygen, and capnography with expired carbon dioxide. Modern machines monitor both inspired and expired oxygen because mixing oxygen, air, nitrous oxide, and a volatile agent can produce a hypoxic mixture; anything below 30 percent on the oxygen analyzer is considered hypoxic. For the CRNA, the oxygen analyzer is the last line of defense against an inadvertent hypoxic fresh gas mixture. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 5
    scene: "pulmonary",
    sceneCfg: { label: "OXYGEN ANALYZER" },
    metadata: { topic: "Mandatory Monitoring", priority: "high" },
  },

  {
    id: "ta-w3-003",
    type: "mcq",
    prompt: "How does mass spectrometry analyze respiratory and anesthetic gases?",
    setup: "",
    ans: [
      { t: "It compares the mass to charge ratio of gases, places them into a spectrum, and measures each gas concentration as a volumes percent of inspired and end-tidal gas", ok: true },
      { t: "It measures the color change of a pH sensitive indicator exposed to carbon dioxide", ok: false },
      { t: "It measures the fraction of laser energy scattered by gas molecules at different wavelengths", ok: false },
      { t: "It uses a lead anode and gold cathode in potassium hydroxide to generate a current proportional to oxygen", ok: false },
    ],
    rationale: "Mass spectrometry analyzes inspired (FI) and end-tidal (ET) concentrations of oxygen, nitrogen, carbon dioxide, nitrous oxide, and anesthetic gases. It compares the mass to charge ratio of the gases on the basis of their differing molecular weights, places them into a spectrum, and reports concentration in volumes percent. Its advantages are multigas and multiagent capability, speed, reliability, and low cost; its disadvantages are that it measures only preprogrammed gases, must be scavenged, needs warm-up time, and takes space. The distractors describe colorimetric, Raman, and galvanic methods. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 9
    scene: "pulmonary",
    sceneCfg: { label: "MASS SPECTROMETRY" },
    metadata: { topic: "Gas Monitoring", priority: "medium" },
  },

  {
    id: "ta-w3-004",
    type: "mcq",
    prompt: "Capnography gas sampling can be mainstream or sidestream. Which statement correctly contrasts them?",
    setup: "",
    ans: [
      { t: "Mainstream sampling measures gas directly in the breathing circuit, giving a fast high-fidelity waveform but adding weight and dead space, whereas sidestream sampling aspirates gas through a thin line that is lightweight but can be clogged by water or secretions", ok: true },
      { t: "Mainstream sampling aspirates gas through a thin flexible line, whereas sidestream sampling measures gas directly in the circuit", ok: false },
      { t: "Both methods aspirate gas to a distant analyzer, and neither one adds any dead space to the circuit", ok: false },
      { t: "Mainstream sampling works only above 40 breaths per minute, whereas sidestream sampling cannot measure carbon dioxide at all", ok: false },
    ],
    rationale: "Mainstream sampling measures gas directly in the breathing system: it is fast with a good fidelity waveform and water and secretions are not an issue, but the sensor is heavy in the circuit, increases dead space, adds an opportunity for disconnect, and limits gas options. Sidestream sampling uses a pump in the monitor to aspirate a sample through a thin flexible line: it is accurate below 40 breaths per minute, lightweight, and less prone to disconnect, but water and secretions may clog the line and the flexible tube can be obstructed. For the CRNA, sidestream sampling is the common configuration but its sampling line is vulnerable to moisture. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 10
    scene: "pulmonary",
    sceneCfg: { label: "MAINSTREAM VS SIDESTREAM" },
    metadata: { topic: "Gas Monitoring", priority: "medium" },
  },

  {
    id: "ta-w3-005",
    type: "mcq",
    prompt: "The galvanic (fuel) cell is a common method of oxygen analysis on the anesthesia machine. Which description is correct?",
    setup: "",
    ans: [
      { t: "It uses a lead anode and a gold cathode surrounded by potassium hydroxide electrolyte; the cathode is the sensing electrode, the anode is gradually consumed and replaced, and the cell is calibrated daily to room air at 21 percent oxygen", ok: true },
      { t: "It compares the mass to charge ratio of oxygen molecules accelerated through a magnetic field", ok: false },
      { t: "It measures the color change of a pH sensitive strip in the presence of oxygen", ok: false },
      { t: "It uses a laser to measure light scattered by oxygen molecules at different wavelengths", ok: false },
    ],
    rationale: "The galvanic, or fuel, cell oxygen sensor has a lead anode and a gold cathode surrounded by potassium hydroxide electrolyte. The cathode is the sensing electrode; the anode is gradually worn out as hydroxyl ions react to form lead oxide and must be replaced. The cell is calibrated daily to room air at 21 percent oxygen. Sensor life begins to degrade once it is removed from its package, and leaving it in the machine during nights and weekends shortens life because of constant high oxygen exposure. The distractors describe mass spectrometry, colorimetric, and Raman methods. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 15
    scene: "pulmonary",
    sceneCfg: { label: "GALVANIC OXYGEN CELL" },
    metadata: { topic: "Gas Monitoring", priority: "medium" },
  },

  {
    id: "ta-w3-006",
    type: "mcq",
    prompt: "The terms capnometry, capnography, and capnogram are distinct. Which set of definitions is correct?",
    setup: "",
    ans: [
      { t: "Capnometry is the measurement and numerical display of carbon dioxide concentration during the respiratory cycle, capnography is the graphic record of carbon dioxide concentration, and the capnogram is the actual waveform generated", ok: true },
      { t: "Capnometry is the waveform, capnography is the number, and the capnogram is the monitor itself", ok: false },
      { t: "All three terms mean the same thing and are used interchangeably", ok: false },
      { t: "Capnometry measures oxygen, capnography measures nitrogen, and the capnogram measures anesthetic agent", ok: false },
    ],
    rationale: "Capnometry is the measurement and numerical display of carbon dioxide concentrations during the respiratory cycle. Capnography is the graphic record of carbon dioxide concentration on a screen or paper. The capnogram is the actual waveform generated by the capnometer. Distinguishing these terms matters because the numeric end-tidal value (capnometry) and the shape of the waveform (capnogram) give different clinical information. For the CRNA, the capnogram shape can reveal problems that a normal end-tidal number alone would miss. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 16
    scene: "pulmonary",
    sceneCfg: { label: "CAPNOMETRY VS CAPNOGRAPHY" },
    metadata: { topic: "Capnography", priority: "high" },
  },

  {
    id: "ta-w3-007",
    type: "mcq",
    prompt: "During cardiopulmonary resuscitation, why is exhaled carbon dioxide a valuable monitor, and what does a sudden increase in end-tidal carbon dioxide suggest?",
    setup: "",
    ans: [
      { t: "Exhaled carbon dioxide is a better indicator of the presence of circulation than the ECG during resuscitation, and a sudden increase in end-tidal carbon dioxide may indicate return of spontaneous circulation and cardiac output", ok: true },
      { t: "Exhaled carbon dioxide reflects only the inspired oxygen concentration, and a sudden increase indicates a circuit disconnect", ok: false },
      { t: "A sudden increase in end-tidal carbon dioxide reliably indicates esophageal intubation", ok: false },
      { t: "Exhaled carbon dioxide is meaningless during resuscitation because circulation is absent", ok: false },
    ],
    rationale: "Carbon dioxide analysis gives clues to changes in circulation: decreased cardiac output, pulmonary embolism, or reduced blood flow to the lungs all lower exhaled carbon dioxide. During resuscitation, exhaled carbon dioxide is a better indicator of the presence of circulation than the ECG, and a sudden increase in carbon dioxide may indicate return of spontaneous cardiac function and output. For the CRNA, capnography is therefore a real-time monitor of the effectiveness of chest compressions and of return of spontaneous circulation. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 17
    scene: "pulmonary",
    sceneCfg: { label: "CO2 AND CIRCULATION" },
    metadata: { topic: "Capnography", priority: "high" },
  },

  {
    id: "ta-w3-008",
    type: "mcq",
    prompt: "Capnography warns of many airway and circuit problems. Is the presence of carbon dioxide on the capnogram a guarantee of correct tracheal tube placement?",
    setup: "",
    ans: [
      { t: "No; carbon dioxide warns of events such as esophageal intubation, apnea, extubation, disconnection, and airway obstruction, but carbon dioxide may still be detected if the tube tip sits above the vocal cords, so its presence does not guarantee tracheal placement", ok: true },
      { t: "Yes; any detectable carbon dioxide guarantees the tube is correctly within the trachea", ok: false },
      { t: "No; carbon dioxide can never be detected unless the tube is in the esophagus", ok: false },
      { t: "Yes; carbon dioxide is detected only when the tube tip is below the carina", ok: false },
    ],
    rationale: "Capnography warns of esophageal intubation, apnea, extubation, disconnection, ventilator malfunction, return to spontaneous respiration during muscle relaxant use, compliance and resistance changes, partial or complete airway obstruction, poor mask or LMA fit, and a leaking endotracheal tube cuff. However, the presence of carbon dioxide is not necessarily a guarantee of tracheal placement, because carbon dioxide may be detected if the endotracheal tube tip is above the vocal cords. For the CRNA, sustained carbon dioxide over several breaths plus confirmatory signs, not a single detectable value, supports correct placement. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 20
    scene: "pulmonary",
    sceneCfg: { label: "CO2 IS NOT PROOF OF PLACEMENT" },
    metadata: { topic: "Capnography", priority: "high" },
  },

  {
    id: "ta-w3-009",
    type: "mcq",
    prompt: "The normal capnogram is divided into phases. Which description of the capnograph phases is correct?",
    setup: "",
    ans: [
      { t: "Phase 1 is the start of expiration carrying carbon dioxide free gas from anatomic dead space, phase 2 is expiration of mixed dead space and alveolar gas, phase 3 is the alveolar plateau of carbon dioxide rich gas, and phase 4 (or 0) is inspiration", ok: true },
      { t: "Phase 1 is inspiration, phase 2 is the alveolar plateau, phase 3 is dead space gas, and phase 4 is expiration", ok: false },
      { t: "Phase 1 is the alveolar plateau, and all later phases represent rebreathing", ok: false },
      { t: "There is only a single phase, which represents inspired carbon dioxide", ok: false },
    ],
    rationale: "The capnograph phases are: phase 1, initiation of expiration carrying carbon dioxide free gas from anatomic dead space; phase 2, expiration of a mixture of dead space and alveolar gas; phase 3, the alveolar plateau of carbon dioxide rich gas from the alveoli; and phase 4 (or 0), inspiration. The end-tidal carbon dioxide value is read at the end of phase 3. For the CRNA, recognizing the phases is the basis for interpreting every abnormal capnogram. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 23
    scene: "pulmonary",
    sceneCfg: { label: "CAPNOGRAPH PHASES" },
    metadata: { topic: "Capnography", priority: "high" },
  },

  {
    id: "ta-w3-010",
    type: "mcq",
    prompt: "A dip appears in phase 3 of the capnogram during an abdominal case. What does this curare cleft indicate?",
    setup: "",
    ans: [
      { t: "The return of spontaneous respiratory effort, signaling that the patient is beginning to breathe and may need deeper neuromuscular relaxation for the abdominal surgery", ok: true },
      { t: "Complete airway obstruction requiring immediate reintubation", ok: false },
      { t: "Rebreathing of carbon dioxide from an exhausted absorber", ok: false },
      { t: "Esophageal placement of the endotracheal tube", ok: false },
    ],
    rationale: "The curare cleft is a dip within phase 3 of the capnogram. It indicates the return of spontaneous respiratory efforts, where the patient attempts a breath against the ventilator. During an abdominal procedure the patient will need to be adequately relaxed, so the cleft signals the need for additional neuromuscular blockade. For the CRNA, the curare cleft is an early waveform sign of returning muscle activity, often before other clinical signs. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 27
    scene: "pulmonary",
    sceneCfg: { label: "CURARE CLEFT" },
    metadata: { topic: "Capnography", priority: "medium" },
  },

  {
    id: "ta-w3-011",
    type: "mcq",
    prompt: "The capnogram shows a prolonged phase 2 and a steeper, upsloping phase 3. What does this pattern indicate?",
    setup: "",
    ans: [
      { t: "Obstruction to expiratory gas flow, as seen with bronchospasm, COPD, or a kinked endotracheal tube", ok: true },
      { t: "Rebreathing of carbon dioxide from an exhausted absorber", ok: false },
      { t: "Return of spontaneous respiration in a paralyzed patient", ok: false },
      { t: "Normal ventilation with no abnormality", ok: false },
    ],
    rationale: "Obstruction to expiratory gas flow produces a prolonged phase 2 and a steeper phase 3 slope on the capnogram. It occurs with bronchospasm, COPD, and a kinked endotracheal tube. For the CRNA, a sloping phase 3 should prompt evaluation for bronchospasm or a mechanically obstructed tube and guide treatment such as bronchodilation or relief of the kink. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 30
    scene: "pulmonary",
    sceneCfg: { label: "EXPIRATORY OBSTRUCTION" },
    metadata: { topic: "Capnography", priority: "high" },
  },

  {
    id: "ta-w3-012",
    type: "mcq",
    prompt: "The capnogram shows an elevated baseline that does not return to zero, with elevation of phase 1. What does this indicate, and how is it corrected?",
    setup: "",
    ans: [
      { t: "Rebreathing of carbon dioxide; it is corrected by increasing fresh gas flow or changing the carbon dioxide absorber, because the absorbent canister needs changing", ok: true },
      { t: "Hyperventilation; it is corrected by decreasing the respiratory rate", ok: false },
      { t: "A leaking endotracheal tube cuff; it is corrected by extubation", ok: false },
      { t: "Normal physiology; no correction is needed", ok: false },
    ],
    rationale: "Rebreathing of carbon dioxide produces an elevation in the baseline carbon dioxide and in phase 1; the baseline should normally be zero. It can be eliminated by increasing the fresh gas flow or changing the carbon dioxide absorber, because the absorbent canister needs changing. For the CRNA, a baseline that fails to return to zero is a classic sign of an exhausted absorbent or inadequate fresh gas flow. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 31
    scene: "pulmonary",
    sceneCfg: { label: "REBREATHING" },
    metadata: { topic: "Capnography", priority: "high" },
  },

  /* ================================================================
     Agent analysis, airway pressures and flows, pulse oximetry
     ================================================================ */

  {
    id: "ta-w3-013",
    type: "mcq",
    prompt: "Anesthetic agent analysis is part of respiratory gas monitoring. What information does monitoring the inspired and expired agent concentration provide?",
    setup: "",
    ans: [
      { t: "It assesses vaporizer output, detects an incorrect agent, detects a vaporizer that is turned off or empty, and provides information on the uptake and elimination of agent in the patient, which is especially useful during low-flow anesthesia", ok: true },
      { t: "It measures the patient hemoglobin concentration and oxygen saturation", ok: false },
      { t: "It measures only the inspired oxygen concentration and nothing about the volatile agent", ok: false },
      { t: "It directly measures the depth of neuromuscular blockade", ok: false },
    ],
    rationale: "Analysis of agent assesses vaporizer output, detects an incorrect agent, and detects a vaporizer that is turned off or empty (the numbers will go down). It also provides information on the uptake and elimination of agent within the patient, and during low-flow anesthesia it provides evidence of volatile concentrations. For the CRNA, expired agent monitoring is the practical way to titrate end-tidal volatile concentration toward a MAC target. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 35
    scene: "pulmonary",
    sceneCfg: { label: "AGENT ANALYSIS" },
    metadata: { topic: "Gas Monitoring", priority: "medium" },
  },

  {
    id: "ta-w3-014",
    type: "mcq",
    prompt: "During volume-controlled ventilation, peak airway pressure and plateau pressure carry different information. Which statement is correct?",
    setup: "",
    ans: [
      { t: "Peak pressure (normally about 15 to 25 cm H2O) strongly reflects airway resistance and rises as tidal volume increases, and persistent peak pressures above 45 cm H2O are a barotrauma risk; plateau pressure, measured during an end-inspiratory pause with no airflow, is best kept below 30 cm H2O to limit barotrauma in ARDS", ok: true },
      { t: "Plateau pressure reflects airway resistance, while peak pressure reflects only the inspired oxygen concentration", ok: false },
      { t: "Peak and plateau pressures are always equal and have no separate meaning", ok: false },
      { t: "Peak pressures above 5 cm H2O always cause barotrauma and should never be exceeded", ok: false },
    ],
    rationale: "Peak pressure is the maximum pressure within the airway during the inspiratory phase, normally about 15 to 25 cm H2O; it strongly reflects airway resistance, and as tidal volume increases so does the pressure required to drive that volume in. Persistent peak pressures higher than 45 cm H2O are a risk factor for barotrauma and should be avoided, for example by decreasing tidal volume or switching to pressure ventilation. Plateau pressure is measured at the end of the inspiratory phase when the ventilator prevents expiratory airflow for a set time (about half a second); keeping plateau pressure below 30 cm H2O minimizes barotrauma in ARDS. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 38
    scene: "pulmonary",
    sceneCfg: { label: "PEAK VS PLATEAU PRESSURE" },
    metadata: { topic: "Airway Pressures and Flows", priority: "high" },
  },

  {
    id: "ta-w3-015",
    type: "mcq",
    prompt: "What is positive end-expiratory pressure (PEEP), and what is its main benefit?",
    setup: "",
    ans: [
      { t: "PEEP is positive pressure maintained in the airway at the end of exhalation; it increases end-expired lung volume and prevents airspace closure, essentially splinting the alveoli open, and is generally effective in diffuse lung disease that decreases functional residual capacity", ok: true },
      { t: "PEEP is negative pressure applied during inspiration to pull the lungs open", ok: false },
      { t: "PEEP is the peak pressure reached during inspiration and reflects airway resistance", ok: false },
      { t: "PEEP empties the alveoli completely at end exhalation to prevent rebreathing", ok: false },
    ],
    rationale: "Positive end-expiratory pressure is positive pressure in the airway at the end of exhalation. It increases end-expired lung volume and prevents airspace closure at the end of expiration, essentially splinting the alveoli open. It is generally effective in patients with diffuse lung disease that decreases functional residual capacity, and most ventilated patients may benefit from about 5 cm of PEEP. For the CRNA, PEEP recruits and stabilizes alveoli to improve oxygenation but must be balanced against its effect on venous return. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 40
    scene: "pulmonary",
    sceneCfg: { label: "PEEP" },
    metadata: { topic: "Airway Pressures and Flows", priority: "high" },
  },

  {
    id: "ta-w3-016",
    type: "mcq",
    prompt: "On the ventilator, how is minute volume determined, and what is the typical inspiratory to expiratory (I:E) ratio?",
    setup: "",
    ans: [
      { t: "Minute volume equals respiratory rate multiplied by tidal volume (MV = RR x TV), and the I:E ratio is usually set near 1:2 or 1:2.5 to mimic the normal pattern of spontaneous breathing", ok: true },
      { t: "Minute volume equals tidal volume divided by respiratory rate, and the I:E ratio is usually 2:1", ok: false },
      { t: "Minute volume equals peak pressure times plateau pressure, and the I:E ratio is usually 1:10", ok: false },
      { t: "Minute volume is independent of rate and tidal volume, and the I:E ratio is always 1:1", ok: false },
    ],
    rationale: "Minute volume is set by the tidal volume and respiratory rate by the equation MV = RR x TV. The I:E ratio is the inspiratory time plus inspiratory pause time relative to expiration, usually set to about 1:2 or 1:2.5 to mimic the usual pattern of spontaneous breathing. For the CRNA, lengthening expiration (a larger I:E denominator) is used in obstructive disease to allow complete exhalation and avoid breath stacking. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 36
    scene: "pulmonary",
    sceneCfg: { label: "MINUTE VOLUME AND I:E RATIO" },
    metadata: { topic: "Airway Pressures and Flows", priority: "medium" },
  },

  {
    id: "ta-w3-017",
    type: "mcq",
    prompt: "Pulse oximetry provides a quantitative estimate of hemoglobin oxygen saturation. On what physical principle does it rely, and what are its two main categories?",
    setup: "",
    ans: [
      { t: "It relies on the Lambert-Beer law describing how light is absorbed by matter, and its two main categories are fractional oximetry and functional oximetry", ok: true },
      { t: "It relies on the mass to charge ratio of hemoglobin, and its two categories are mainstream and sidestream", ok: false },
      { t: "It relies on a galvanic cell reaction, and its two categories are anodic and cathodic", ok: false },
      { t: "It relies on colorimetric pH change, and its two categories are inspired and expired", ok: false },
    ],
    rationale: "Pulse oximetry provides quantitative analysis of the saturation of hemoglobin with oxygen using the Lambert-Beer law, a mathematical means of expressing how light is absorbed by matter. The two main types of oximetry are fractional and functional. For the CRNA, understanding that the device is fundamentally a light-absorption measurement explains why dyshemoglobins, dyes, and poor signal all distort the reading. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 41
    scene: "oxygen_dissociation",
    sceneCfg: { label: "PULSE OXIMETRY PRINCIPLE" },
    metadata: { topic: "Pulse Oximetry", priority: "high" },
  },

  {
    id: "ta-w3-018",
    type: "mcq",
    prompt: "How do fractional and functional oximetry differ, and which one does a standard pulse oximeter report?",
    setup: "",
    ans: [
      { t: "Fractional oximetry is oxyhemoglobin divided by the sum of oxyhemoglobin, deoxyhemoglobin, methemoglobin, and carboxyhemoglobin and equals the SaO2 from an arterial sample, whereas functional oximetry is oxyhemoglobin divided by the sum of oxyhemoglobin and deoxyhemoglobin and equals the SpO2 a standard pulse oximeter measures noninvasively", ok: true },
      { t: "Fractional oximetry equals the SpO2 measured noninvasively, while functional oximetry equals the SaO2 measured invasively", ok: false },
      { t: "Both measure the same value and differ only in the units reported", ok: false },
      { t: "Functional oximetry includes methemoglobin and carboxyhemoglobin, while fractional oximetry ignores them", ok: false },
    ],
    rationale: "Fractional oximetry is oxyhemoglobin divided by the sum of oxyhemoglobin, deoxyhemoglobin, methemoglobin, and carboxyhemoglobin; it equals the arterial oxygen saturation (SaO2) and can only be measured from an arterial blood sample, so it is invasive. Functional oximetry is oxyhemoglobin divided by the sum of oxyhemoglobin and deoxyhemoglobin; it equals the SpO2 and is measured noninvasively by a standard pulse oximeter. For the CRNA, this distinction explains why a pulse oximeter SpO2 can read normal while a co-oximeter fractional SaO2 is low in the presence of dyshemoglobins. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 42
    scene: "oxygen_dissociation",
    sceneCfg: { label: "FRACTIONAL VS FUNCTIONAL" },
    metadata: { topic: "Pulse Oximetry", priority: "high" },
  },

  {
    id: "ta-w3-019",
    type: "mcq",
    prompt: "A standard two-wavelength pulse oximeter emits red and infrared light. Which wavelengths are used, and how do oxyhemoglobin and deoxyhemoglobin differ in their absorption?",
    setup: "",
    ans: [
      { t: "It emits red light at about 660 nm and infrared light at about 940 nm; deoxyhemoglobin absorbs more light in the red band and oxyhemoglobin absorbs more in the infrared band, and photoplethysmography identifies the pulsatile arterial signal", ok: true },
      { t: "It emits only a single green wavelength, and both forms of hemoglobin absorb it equally", ok: false },
      { t: "It emits red at 940 nm and infrared at 660 nm, and oxyhemoglobin absorbs more red light", ok: false },
      { t: "It emits ultraviolet light, and absorption does not differ between the two forms of hemoglobin", ok: false },
    ],
    rationale: "A standard pulse oximeter emits two wavelengths of light: red at 660 nm and infrared at 940 nm. Deoxyhemoglobin absorbs more light in the red band, while oxyhemoglobin absorbs more light in the infrared band. Sensors detect the amount of red and infrared light absorbed, and photoplethysmography identifies pulsatile arterial flow versus non-pulsatile flow; an equation then calculates the SpO2. For the CRNA, the 660 and 940 nm pairing is why a fixed equal-absorption interferent such as methemoglobin drives the reading toward a fixed value. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 43
    scene: "oxygen_dissociation",
    sceneCfg: { label: "SpO2 WAVELENGTHS" },
    metadata: { topic: "Pulse Oximetry", priority: "high" },
  },

  {
    id: "ta-w3-020",
    type: "mcq",
    prompt: "Over what saturation range is the pulse oximeter accurate, and which conditions reduce its accuracy?",
    setup: "",
    ans: [
      { t: "Between an SpO2 of 70 and 100 percent the pulse oximeter is accurate to within about 5 percent; below 70 percent readings are extrapolated and unreliable, and accuracy is reduced by hypothermia, poor circulation or low cardiac output, vasoconstriction, and improper placement", ok: true },
      { t: "It is accurate only above 95 percent, and no clinical condition affects it", ok: false },
      { t: "It is most accurate below 70 percent, where calibration data are richest", ok: false },
      { t: "It is accurate to within 0.1 percent at all saturations regardless of perfusion", ok: false },
    ],
    rationale: "If the SpO2 is between 70 and 100 percent the pulse oximeter is accurate to within about 5 percent; lower than 70 percent the readings are extrapolated and unreliable, because calibration involved healthy volunteers whose SpO2 did not routinely reach below 70 percent and because more deoxyhemoglobin is present below 70 percent. Accuracy is reduced by hypothermia, poor circulation or low cardiac output, vasoconstriction, and improper placement, since low perfusion makes it difficult to distinguish a true signal from background noise. Correlating the plethysmographic pulse with the ECG is one way to judge accuracy. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 45
    scene: "oxygen_dissociation",
    sceneCfg: { label: "PULSE OX ACCURACY" },
    metadata: { topic: "Pulse Oximetry", priority: "high" },
  },

  {
    id: "ta-w3-021",
    type: "mcq",
    prompt: "A patient rescued from a house fire has a normal-appearing pulse oximeter reading. How does carboxyhemoglobin affect the SpO2?",
    setup: "",
    ans: [
      { t: "Carboxyhemoglobin is interpreted by the oximeter as about 90 percent oxyhemoglobin and 10 percent deoxyhemoglobin, so high carboxyhemoglobin levels cause the pulse oximeter to overestimate the SpO2", ok: true },
      { t: "Carboxyhemoglobin causes the pulse oximeter to read falsely low, near 0 percent", ok: false },
      { t: "Carboxyhemoglobin has no effect on the pulse oximeter reading", ok: false },
      { t: "Carboxyhemoglobin makes the oximeter read exactly the true arterial saturation", ok: false },
    ],
    rationale: "Pulse oximeter readings can be falsely high or low because of abnormal hemoglobins. Carboxyhemoglobin, seen in patients exposed to smoke or fire, is measured by the oximeter as about 90 percent oxyhemoglobin and 10 percent deoxyhemoglobin, so when carboxyhemoglobin is high the device overestimates the SpO2. For the CRNA, a reassuring SpO2 in a burn or smoke-inhalation patient can therefore be dangerously misleading, and co-oximetry is needed. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 46
    scene: "oxygen_dissociation",
    sceneCfg: { label: "CARBOXYHEMOGLOBIN" },
    metadata: { topic: "Pulse Oximetry", priority: "high" },
  },

  {
    id: "ta-w3-022",
    type: "mcq",
    prompt: "Methemoglobinemia can be caused by drugs such as prilocaine, nitrates, and dapsone. How does methemoglobin affect the pulse oximeter, and what is the underlying change in the iron?",
    setup: "",
    ans: [
      { t: "Methemoglobin absorbs equal amounts of red and infrared light, driving the SpO2 toward a fixed reading of about 85 percent; it forms when hemoglobin iron is oxidized from the +2 ferrous to the +3 ferric state, which left-shifts the oxygen dissociation curve and releases oxygen less easily", ok: true },
      { t: "Methemoglobin makes the SpO2 read 100 percent regardless of true saturation, and it forms when iron is reduced from ferric to ferrous", ok: false },
      { t: "Methemoglobin has no effect on the reading and does not change the iron oxidation state", ok: false },
      { t: "Methemoglobin makes the SpO2 read 0 percent and right-shifts the oxygen dissociation curve", ok: false },
    ],
    rationale: "Methemoglobin absorbs equal amounts of red and infrared light, so the SpO2 is driven toward a fixed reading of about 85 percent regardless of the true saturation. Methemoglobin forms when the hemoglobin iron goes from its +2 ferrous form to the +3 ferric state; the ferric state shows a left shift on the oxygen dissociation curve and releases oxygen less easily. Drugs that can cause methemoglobinemia include nitrates, local anesthetics such as prilocaine, chlorates, antimalarials, antineoplastics, sulfonamides, dapsone, and metoclopramide. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 47
    scene: "oxygen_dissociation",
    sceneCfg: { label: "METHEMOGLOBIN" },
    metadata: { topic: "Pulse Oximetry", priority: "high" },
  },

  {
    id: "ta-w3-023",
    type: "mcq",
    prompt: "Besides abnormal hemoglobins, several factors interfere with pulse oximetry. Which set correctly lists such causes and their mechanism?",
    setup: "",
    ans: [
      { t: "Melanin inhibits passage of light through tissue, motion artifact prevents correct measurement of the waveform peaks and troughs, fluorescent light emits in the 660 nm region and interferes with the red band, and nail polish inhibits light passage through the fingernail", ok: true },
      { t: "Bright sunlight increases accuracy, and nail polish has no effect on the reading", ok: false },
      { t: "Motion artifact improves the signal, and fluorescent light interferes only with the infrared band", ok: false },
      { t: "Melanin enhances light transmission, so darker skin always gives more accurate readings", ok: false },
    ],
    rationale: "Other causes of pulse oximeter interference include melanin, which inhibits the passage of light through tissue; motion artifact, which leaves the oximeter unable to measure the peaks and troughs of the waveform correctly; fluorescent light, which emits a wavelength in the 660 nm region that interferes with the red band; and nail polish, which inhibits passage of light through the fingernail. For the CRNA, recognizing these artifacts prevents unnecessary alarm responses and unrecognized true desaturation. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 48
    scene: "oxygen_dissociation",
    sceneCfg: { label: "PULSE OX INTERFERENCE" },
    metadata: { topic: "Pulse Oximetry", priority: "medium" },
  },

  {
    id: "ta-w3-024",
    type: "mcq",
    prompt: "The esophageal stethoscope is a classic intraoperative monitor. What does it measure, in whom can it be used, and what is a contraindication?",
    setup: "",
    ans: [
      { t: "It measures temperature and lung (and heart) sounds, is limited to intubated patients and placed nasally or orally, and is contraindicated in patients with esophageal varices or strictures", ok: true },
      { t: "It measures blood pressure and is used only in awake patients, with no contraindications", ok: false },
      { t: "It measures end-tidal carbon dioxide and is intended for placement in the trachea", ok: false },
      { t: "It measures the depth of anesthesia and is contraindicated only in children", ok: false },
    ],
    rationale: "The esophageal stethoscope measures temperature and lung sounds. It is limited to use with intubated patients, placed nasally or orally, and contraindicated in patients with esophageal varices or strictures. If it is accidentally placed in the trachea rather than the esophagus, an air leak around the endotracheal tube cuff results. For the CRNA, it is a simple, inexpensive monitor of breath and heart sounds plus core-near temperature in an intubated patient. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 49
    scene: "patient",
    sceneCfg: { label: "ESOPHAGEAL STETHOSCOPE" },
    metadata: { topic: "Stethoscopes", priority: "medium" },
  },

  /* ================================================================
     Temperature: thermoregulation, heat production, redistribution
     ================================================================ */

  {
    id: "ta-w3-025",
    type: "mcq",
    prompt: "Why is intraoperative temperature monitoring important, and what does mild hypothermia do according to the lecture?",
    setup: "",
    ans: [
      { t: "Mild hypothermia can triple the incidence of cardiac complications and surgical wound infections and can increase surgical blood loss; temperature monitoring also detects malignant hyperthermia and helps prevent hyperthermia", ok: true },
      { t: "Mild hypothermia has no measurable effect on outcomes and is monitored only for patient comfort", ok: false },
      { t: "Mild hypothermia decreases the incidence of wound infection and reduces cardiac risk", ok: false },
      { t: "Temperature is monitored only to detect fever from infection, not hypothermia", ok: false },
    ],
    rationale: "Temperature monitoring detects hypothermia, and studies show that mild hypothermia can triple the incidence of cardiac complications and surgical wound infections and can increase surgical blood loss. Monitoring also detects malignant hyperthermia and helps prevent hyperthermia. For the CRNA, these outcome effects are why maintaining normothermia is an active intraoperative goal rather than a comfort measure. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 54
    scene: "patient",
    sceneCfg: { label: "WHY MONITOR TEMPERATURE" },
    metadata: { topic: "Temperature Monitoring", priority: "high" },
  },

  {
    id: "ta-w3-026",
    type: "mcq",
    prompt: "According to the AANA standards on temperature, when must temperature be monitored during anesthesia?",
    setup: "",
    ans: [
      { t: "Temperature should be monitored when clinically significant changes in body temperature are intended, anticipated, or suspected; in practice any case lasting more than 1 hour and any pediatric anesthetic in a patient younger than 12 years should have temperature monitored", ok: true },
      { t: "Temperature must be monitored only during cardiac surgery and never in children", ok: false },
      { t: "Temperature must be monitored only in cases shorter than 15 minutes", ok: false },
      { t: "Temperature monitoring is never required under the AANA standards", ok: false },
    ],
    rationale: "The AANA standards state that every patient receiving anesthesia shall have temperature monitored when clinically significant changes in body temperature are intended, anticipated, or suspected. In practice, any case lasting more than 1 hour and any pediatric anesthetic in a patient younger than 12 years should have temperature monitored. For the CRNA, these triggers set the practical threshold for placing a temperature probe. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 56
    scene: "patient",
    sceneCfg: { label: "AANA TEMPERATURE STANDARD" },
    metadata: { topic: "Temperature Monitoring", priority: "high" },
  },

  {
    id: "ta-w3-027",
    type: "mcq",
    prompt: "Where is thermoregulatory control centered, and how is the body divided for the purpose of heat balance?",
    setup: "",
    ans: [
      { t: "Control appears to be in the hypothalamus; the body is divided into a core zone (trunk and head) protected by an outer peripheral zone with superficial (skin and subcutaneous) and intermediate (skeletal muscle) layers, and maintaining total body heat matters more than any individual zone temperature", ok: true },
      { t: "Control is in the medulla, and the body is a single uniform thermal compartment", ok: false },
      { t: "Control is in the skin; the core zone is the limbs and the periphery is the trunk", ok: false },
      { t: "Control is in the liver, and only the core temperature matters while peripheral temperature is irrelevant", ok: false },
    ],
    rationale: "Thermoregulatory control appears to be in the hypothalamus. For simplicity the body is divided into zones: a core zone (trunk and head) protected by an outer layer, and a peripheral zone with a superficial component (skin and subcutaneous tissues) and an intermediate component (skeletal muscle). Total body heat is the combination of zone temperatures, and maintaining total body heat is more important than any individual zone temperature. For the CRNA, this zone model explains why warming the periphery before induction reduces the core to peripheral gradient that drives redistribution. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 58
    scene: "feedback_loop",
    sceneCfg: { label: "THERMOREGULATION ZONES" },
    metadata: { topic: "Temperature Monitoring", priority: "medium" },
  },

  {
    id: "ta-w3-028",
    type: "mcq",
    prompt: "Shivering thermogenesis is one mechanism of heat production. Which statement about it is correct?",
    setup: "",
    ans: [
      { t: "Shivering involves skeletal muscles, particularly those of the arms and legs, can increase heat production by about 500 percent, and is indirectly controlled by catecholamines stimulating beta-adrenergic receptors", ok: true },
      { t: "Shivering involves only the diaphragm and decreases heat production", ok: false },
      { t: "Shivering is controlled solely by insulin and occurs only in brown fat", ok: false },
      { t: "Shivering increases heat production by no more than 5 percent", ok: false },
    ],
    rationale: "Shivering thermogenesis involves skeletal muscles, particularly those of locomotion in the arms and legs, and can increase heat production by about 500 percent. It is indirectly controlled by catecholamines: stimulating beta-adrenergic receptors in adipose tissue produces lipolysis, increasing lipase concentration, which supplies substrate for increased muscle activity. For the CRNA, postoperative shivering markedly raises oxygen consumption, which is hazardous in patients with limited cardiac reserve. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 61
    scene: "metabolism",
    sceneCfg: { label: "SHIVERING THERMOGENESIS" },
    metadata: { topic: "Temperature Monitoring", priority: "medium" },
  },

  {
    id: "ta-w3-029",
    type: "mcq",
    prompt: "Non-shivering thermogenesis is especially important in infants. Which statement about brown adipose tissue is correct?",
    setup: "",
    ans: [
      { t: "Brown adipose fat is rich in mitochondria and deposited near capillary beds so peripheral blood passes the heaters before returning centrally; in infants it is the primary thermogenic tissue (scapulae, axilla, neck, and along the vertebral axis) and can double heat production, while in adults it concentrates around the neck and kidneys", ok: true },
      { t: "Brown adipose fat has few mitochondria and cannot generate heat", ok: false },
      { t: "Brown adipose fat is found only in adults and is absent in infants", ok: false },
      { t: "Brown adipose fat cools the blood before it returns to the central circulation", ok: false },
    ],
    rationale: "Brown adipose fat is histologically different from white fat and is deposited near rich capillary beds so that all peripheral blood must pass by these heaters before reaching the central circulation. It has more mitochondria, giving it greater metabolic capacity. In infants it is the primary thermogenic tissue, located in the scapulae, axilla, around the neck, and along the vertebral axis, and infants can double their heat production this way; in adults brown fat concentrates around the neck and kidneys. Norepinephrine stimulates lipolysis, and on cold exposure ATP formation becomes less efficient so more heat is released. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 62
    scene: "metabolism",
    sceneCfg: { label: "BROWN ADIPOSE TISSUE" },
    metadata: { topic: "Temperature Monitoring", priority: "medium" },
  },

  {
    id: "ta-w3-030",
    type: "mcq",
    prompt: "After induction of general anesthesia, core temperature often falls most steeply in the first hour. What is the main mechanism?",
    setup: "",
    ans: [
      { t: "Anesthetic-induced vasodilation redistributes heat from the warm core to the cooler periphery, lowering the core temperature with the greatest decrease in the first hour, rather than simple loss to the environment", ok: true },
      { t: "Anesthesia causes vasoconstriction that traps cold blood in the core", ok: false },
      { t: "The fall is due entirely to evaporation from the skin during prepping and is unrelated to blood flow", ok: false },
      { t: "Core temperature rises in the first hour because anesthesia increases the metabolic rate", ok: false },
    ],
    rationale: "Core temperature redistribution is increased heat loss resulting from the vasodilating effects of volatile and regional anesthetics, which raise blood flow and therefore heat flow from the core to the body surface. The core temperature can drop quickly from this vasodilation, with the greatest decrease in the first hour, and then come back up. Some initial loss may be attributed to prepping and draping, but the predominant cause is redistribution of heat from core to periphery. For the CRNA, prewarming the periphery before induction is the most effective way to blunt this first-hour redistribution drop. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 67
    scene: "patient",
    sceneCfg: { label: "CORE TEMPERATURE REDISTRIBUTION" },
    metadata: { topic: "Temperature Monitoring", priority: "high" },
  },

  {
    id: "ta-w3-031",
    type: "mcq",
    prompt: "What are the four mechanisms of heat loss, and which one accounts for the most heat loss in the operating room?",
    setup: "",
    ans: [
      { t: "The four mechanisms are convection, radiation, conduction, and evaporation; radiation accounts for the most heat loss in the operating room", ok: true },
      { t: "The mechanisms are filtration, osmosis, and diffusion, and osmosis accounts for the most loss", ok: false },
      { t: "The four mechanisms are convection, radiation, conduction, and evaporation, and conduction accounts for the most loss", ok: false },
      { t: "There is only one mechanism, evaporation, which accounts for all heat loss", ok: false },
    ],
    rationale: "The four mechanisms of heat loss are convection, radiation, conduction, and evaporation. Most heat is lost in the operating room by radiation, making it the number one route: heat is transferred on the infrared spectrum from the warm body to the cooler operating room environment, with the greatest loss from areas of highest blood flow such as the patient head. For the CRNA, because radiation dominates, covering exposed skin and warming the room target the largest source of loss. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 73
    scene: "patient",
    sceneCfg: { label: "MECHANISMS OF HEAT LOSS" },
    metadata: { topic: "Temperature Monitoring", priority: "high" },
  },

  {
    id: "ta-w3-032",
    type: "mcq",
    prompt: "How does convection cause heat loss, and how significant is it in the operating room?",
    setup: "",
    ans: [
      { t: "Convection transfers kinetic energy from the body to surrounding air molecules that rise and are replaced by cooler air, creating currents; it is the second largest method of heat loss in anesthetized patients and is increased by the constant turnover of operating room air", ok: true },
      { t: "Convection requires direct physical contact between the body and a cold surface", ok: false },
      { t: "Convection is heat transferred on the infrared spectrum to the walls and ceiling", ok: false },
      { t: "Convection is negligible in the operating room because the air is always still", ok: false },
    ],
    rationale: "Convection is the process of creating air currents by heat: the body transfers kinetic energy to air molecules at the skin surface, and those molecules rise and are replaced by colder molecules, which are warmed in turn. It is the second largest method of heat loss in anesthetized patients. In the operating room, the constant turnover of room air increases convective loss; clothing or drapes reduce it, and a 1 inch layer of still air can reduce heat loss by about 0.5 kcal/hr. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 71
    scene: "patient",
    sceneCfg: { label: "CONVECTION" },
    metadata: { topic: "Temperature Monitoring", priority: "medium" },
  },

  {
    id: "ta-w3-033",
    type: "mcq",
    prompt: "Conduction is one mechanism of intraoperative heat loss. Which statement is correct?",
    setup: "",
    ans: [
      { t: "Conduction requires direct physical contact and transfers heat from the warmer object to the cooler one; loss from the core by conduction is normally low, but contact with a 1 inch steel slab can raise it above 300 kcal/h, which is why warming blankets on the table reduce this transfer", ok: true },
      { t: "Conduction occurs only through air currents and never requires contact", ok: false },
      { t: "Conduction transfers heat from the cooler object to the warmer object", ok: false },
      { t: "Conduction from the body core is normally the single largest source of heat loss", ok: false },
    ],
    rationale: "Conduction requires direct physical contact, with net energy transfer from the warmer object to the cooler object. Heat loss from the body core by conduction is normally low because the superficial zone has high resistance and low conductance. However, contact with a 1 inch thick steel slab can raise conductive loss to above 300 kcal/h, while a 1 inch layer of polyurethane foam reduces it to about 0.5 kcal/h; warming blankets on the operating room table can stop or reverse this transfer. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 74
    scene: "patient",
    sceneCfg: { label: "CONDUCTION" },
    metadata: { topic: "Temperature Monitoring", priority: "medium" },
  },

  {
    id: "ta-w3-034",
    type: "mcq",
    prompt: "How much heat is lost through evaporation, and what increases evaporative loss during surgery?",
    setup: "",
    ans: [
      { t: "About 16 kcal/hr is lost through insensible evaporation from skin and lungs, roughly half of it respiratory; evaporative loss increases with open body cavities (such as open abdominal surgery) and with skin prepped using liquids like alcohol, iodine, or chlorhexidine", ok: true },
      { t: "Evaporation contributes no measurable heat loss and is unaffected by open cavities", ok: false },
      { t: "Evaporation accounts for 300 kcal/hr at rest with closed skin and no respiration", ok: false },
      { t: "Evaporative loss decreases when body cavities are opened", ok: false },
    ],
    rationale: "About 16 kcal/hr is lost through insensible evaporation from the skin and lungs, and roughly half of this is respiratory loss. Considerable additional heat loss can occur from open cavities, such as during open abdominal surgery, and patients whose skin is prepped with liquids such as alcohol, iodine, or chlorhexidine experience evaporative heat loss. This is a more significant issue in pediatric than adult patients. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 76
    scene: "patient",
    sceneCfg: { label: "EVAPORATION" },
    metadata: { topic: "Temperature Monitoring", priority: "medium" },
  },

  {
    id: "ta-w3-035",
    type: "mcq",
    prompt: "What is the typical time course of core temperature loss during general anesthesia?",
    setup: "",
    ans: [
      { t: "Core temperature falls about 1 to 2 degrees Celsius in the first hour, followed by a more gradual loss of roughly 0.3 degrees Celsius per hour, and after about 4 hours the temperature levels off", ok: true },
      { t: "Core temperature rises 1 to 2 degrees Celsius in the first hour and keeps rising", ok: false },
      { t: "Core temperature falls 10 degrees Celsius in the first 5 minutes, then stabilizes", ok: false },
      { t: "Core temperature does not change measurably during general anesthesia", ok: false },
    ],
    rationale: "General anesthesia is associated with a decrease in core temperature of 1 to 2 degrees Celsius in the first hour, followed by a more gradual loss of about 0.3 degrees Celsius per hour. After roughly 4 hours of anesthesia the temperature levels off. This plateau may represent heat loss equaling heat production in a relatively warm patient, and at about 33 to 35 degrees Celsius a compensatory vasoconstriction occurs despite the inhibiting effect of volatile anesthetics. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 77
    scene: "patient",
    sceneCfg: { label: "HEAT LOSS TIME COURSE" },
    metadata: { topic: "Temperature Monitoring", priority: "high" },
  },

  {
    id: "ta-w3-036",
    type: "mcq",
    prompt: "How does significant hypothermia affect the ECG and cardiovascular system?",
    setup: "",
    ans: [
      { t: "It prolongs the PR, QRS, and QT intervals, can make ST segments shift and T waves become diphasic then inverted, and produces an extra deflection called a J wave in the precordial leads; mild hypothermia can also cause cold-induced hypertension in the elderly, associated with a roughly 3-fold rise in plasma norepinephrine", ok: true },
      { t: "It shortens all ECG intervals and abolishes the P wave, with no effect on catecholamines", ok: false },
      { t: "It has no effect on the ECG and lowers plasma norepinephrine", ok: false },
      { t: "It produces a delta wave and causes hypotension from norepinephrine depletion", ok: false },
    ],
    rationale: "Hypothermia prolongs the PR, QRS, and QT intervals; the ST segment may shift and T waves can become diphasic and then inverted; and an extra deflection called a J wave appears in the precordial leads. These changes occur with significant hypothermia, such as during cardiopulmonary bypass, and may persist for days. Mild hypothermia of about 34 to 36 degrees Celsius can cause cold-induced hypertension in the elderly, associated with a roughly 3-fold increase in plasma norepinephrine that drives vasoconstriction and hypertension and may augment cardiac irritability. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 79
    scene: "ecg_waveform",
    sceneCfg: { label: "HYPOTHERMIA ECG EFFECTS" },
    metadata: { topic: "Temperature Monitoring", priority: "high" },
  },

  {
    id: "ta-w3-037",
    type: "mcq",
    prompt: "Beyond cardiac effects, how does mild hypothermia affect surgical wound infection and coagulation?",
    setup: "",
    ans: [
      { t: "A core temperature drop of about 1.9 degrees Celsius triples the incidence of wound infection after colon surgery, partly through vasoconstriction that reduces oxygen delivery and impairs neutrophil function; mild hypothermia also increases blood loss through impaired platelet function (reduced thromboxane A2 release) and reduced clotting factor enzyme activity", ok: true },
      { t: "Hypothermia eliminates wound infection risk and improves neutrophil function", ok: false },
      { t: "Hypothermia improves platelet function and decreases blood loss in every case", ok: false },
      { t: "Hypothermia affects only heart rate and has no effect on infection or clotting", ok: false },
    ],
    rationale: "A decrease in core temperature of about 1.9 degrees Celsius triples the incidence of wound infection after colon surgery; hypothermia causes vasoconstriction that reduces oxygen delivery and impairs neutrophil function, and it increases protein wasting. For coagulation, mild hypothermia is generally thought to increase blood loss, related to reduced platelet function (from reduced thromboxane A2 release) and reduced clotting factor enzyme activity; a relative thrombocytopenia also occurs as fluid shifts out of the vasculature and platelets are sequestered in the spleen. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 82
    scene: "patient",
    sceneCfg: { label: "HYPOTHERMIA, INFECTION, COAGULATION" },
    metadata: { topic: "Temperature Monitoring", priority: "high" },
  },

  {
    id: "ta-w3-038",
    type: "mcq",
    prompt: "How do non-volatile general anesthetic agents such as barbiturates, propofol, and opioids affect thermoregulation?",
    setup: "",
    ans: [
      { t: "They interfere with the central control system and change the body set point, so that whereas the body normally reacts when temperature deviates by about 2 to 3 degrees Celsius, under general anesthesia it does not react until temperature has changed by about 4 degrees Celsius from the set point", ok: true },
      { t: "They tighten thermoregulation so the body reacts to a change of only 0.1 degrees Celsius", ok: false },
      { t: "They have no effect on the thermoregulatory set point", ok: false },
      { t: "They raise the set point so the patient becomes hyperthermic in every case", ok: false },
    ],
    rationale: "Non-volatile anesthetic agents (barbiturates, propofol, and opioid agonists) interfere with the central control system, producing central hypothermia and changing the body set point. Normally the body reacts when its temperature changes by about 2 to 3 degrees Celsius, but under general anesthesia it does not react until the temperature has changed by about 4 degrees Celsius from the set point. For the CRNA, this widened interthreshold range is why anesthetized patients cool passively until far from the set point. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 87
    scene: "feedback_loop",
    sceneCfg: { label: "ANESTHESIA AND SET POINT" },
    metadata: { topic: "Temperature Monitoring", priority: "medium" },
  },

  {
    id: "ta-w3-039",
    type: "mcq",
    prompt: "Why are pediatric and geriatric patients at particular risk for intraoperative hypothermia?",
    setup: "",
    ans: [
      { t: "Pediatric patients have a higher body surface area to weight ratio (convective and radiant losses about 4 times those of adults), thin subcutaneous tissue, more transcutaneous evaporation, and a larger relative minute volume; geriatric patients have a reduced ability to regulate temperature and can increase metabolism only about half as much as a younger adult", ok: true },
      { t: "Pediatric patients lose less heat than adults because of their small size, and the elderly regulate temperature better than the young", ok: false },
      { t: "Both groups have thermoregulation identical to healthy young adults", ok: false },
      { t: "Only patients between 20 and 40 years old are at risk for hypothermia", ok: false },
    ],
    rationale: "Pediatric patients have a greater body surface area to weight ratio, producing convective and radiant heat losses about 4 times greater than adults (critical body surface area about 0.5 m2, typically under 9 kg), a thin layer of subcutaneous tissue that gives less insulation, more transcutaneous evaporation especially in infants, and a larger minute volume with greater respiratory heat loss. Geriatric patients have a decreased ability to regulate temperature and cannot raise metabolism to increase heat production, with the ability to increase metabolism about half that of a younger adult. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 91
    scene: "patient",
    sceneCfg: { label: "EXTREMES OF AGE" },
    metadata: { topic: "Temperature Monitoring", priority: "high" },
  },

  {
    id: "ta-w3-040",
    type: "mcq",
    prompt: "Postoperative shivering is a common and distressing event. Which statement is correct?",
    setup: "",
    ans: [
      { t: "Patients sometimes rate shivering as worse than postoperative pain; it can be triggered by hypothermia but also by general or regional anesthesia in the absence of hypothermia, markedly increases oxygen consumption, and is treated with 12.5 to 25 mg of intravenous meperidine, with the elderly less likely to shiver than the young", ok: true },
      { t: "Shivering occurs only with documented hypothermia and never without it", ok: false },
      { t: "Shivering is treated with 500 mg of intravenous meperidine and lowers oxygen consumption", ok: false },
      { t: "The elderly shiver more vigorously than the young", ok: false },
    ],
    rationale: "The feeling of cold and shivering is often described as the worst part of the hospital experience, sometimes rated worse than postoperative pain. It can be triggered by hypothermia but also by general or regional anesthesia in the absence of hypothermia. Treatment is 12.5 to 25 mg of meperidine intravenously, and the elderly are less likely to shiver than the young. Postoperative shivering can increase oxygen consumption as much as 5-fold, decreasing arterial oxygen saturation and correlating with an increased risk of myocardial infarction and angina. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 93
    scene: "patient",
    sceneCfg: { label: "POSTOPERATIVE SHIVERING" },
    metadata: { topic: "Temperature Monitoring", priority: "high" },
  },

  {
    id: "ta-w3-041",
    type: "mcq",
    prompt: "Temperature monitoring sites differ in how closely they reflect core temperature. Which ranking from nearest to core is correct?",
    setup: "",
    ans: [
      { t: "From nearest to core: pulmonary artery, then esophageal, then tympanic, then nasopharyngeal, then bladder; esophageal and nasopharyngeal readings can be inaccurate if influenced by respiratory gases, and bladder temperature is accurate when urine output is high", ok: true },
      { t: "From nearest to core: skin, then axillary, then rectal, with the pulmonary artery being the least accurate", ok: false },
      { t: "All sites reflect core temperature equally well", ok: false },
      { t: "Bladder temperature is the single most accurate site regardless of urine output", ok: false },
    ],
    rationale: "Ranked from nearest to core, the temperature monitoring sites are: first the pulmonary artery, second esophageal (which can be inaccurate if influenced by respiratory gases), third tympanic, fourth nasopharyngeal (also subject to respiratory gas influence), and fifth bladder (accurate when urine output is high). Non-central sites such as axillary, rectal, and skin may not correlate with core temperature and are slower to reflect changes because they depend on blood flow and the environment. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 96
    scene: "patient",
    sceneCfg: { label: "TEMPERATURE MONITORING SITES" },
    metadata: { topic: "Temperature Monitoring", priority: "high" },
  },

  {
    id: "ta-w3-042",
    type: "mcq",
    prompt: "What are the active methods of warming a patient, and which superficial method is most frequently used in the operating room?",
    setup: "",
    ans: [
      { t: "Active warming includes superficial methods (warming blanket, radiant heat unit, forced air warmer, heated liquids against skin) and core methods (heated humidifiers, gastric lavage, peritoneal irrigation, fluid warmers, extracorporeal heat exchangers); the forced air warmer, such as the Bair Hugger, is the most frequently used method in the OR", ok: true },
      { t: "The only effective method is placing the patient near a window for sunlight", ok: false },
      { t: "Core warming methods are never used, and forced air warming is contraindicated", ok: false },
      { t: "Heated intravenous bags placed directly on the skin are the proven first-line method", ok: false },
    ],
    rationale: "Active warming includes superficial methods (a warming blanket, radiant heat unit, forced air warmer, and heated liquids against the skin) and core methods (heated humidifiers, gastric lavage, peritoneal irrigation, fluid warmers, and extracorporeal heat exchangers). The forced air warmer, such as the Bair Hugger, reduces radiant and convective heat loss and the incidence of postoperative shivering and is the most frequently used method in the operating room; a sheet or blanket should always lie between the skin and the paper blanket. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 100
    scene: "patient",
    sceneCfg: { label: "ACTIVE WARMING METHODS" },
    metadata: { topic: "Temperature Monitoring", priority: "medium" },
  },

  /* ================================================================
     Passive conservation and neurologic monitoring
     ================================================================ */

  {
    id: "ta-w3-043",
    type: "mcq",
    prompt: "Passive heat conservation is also used intraoperatively. Which statement about passive insulation and the heat and moisture exchanger (HME) is correct?",
    setup: "",
    ans: [
      { t: "A single layer of passive insulation, such as a cotton blanket or drape, can reduce cutaneous heat loss by about 30 percent largely by trapping a layer of still air, and adding more layers does not reduce loss much further; the HME is a passive artificial nose that needs about 1 hour to become fully saturated and efficient, is almost as effective as a heated humidifier, and has efficiency inversely related to fresh gas flow and tidal volume", ok: true },
      { t: "A single layer of insulation reduces cutaneous heat loss by 95 percent, and each added blanket roughly doubles the effect", ok: false },
      { t: "The HME actively heats gas with an electrical element and works instantly", ok: false },
      { t: "HME efficiency increases as fresh gas flow and tidal volume increase", ok: false },
    ],
    rationale: "A single layer of passive insulation can reduce cutaneous heat loss by about 30 percent; it provides little true insulation but creates a layer of still air that acts as insulation, and adding more layers (for example 3 more blankets) does not reduce loss to a greater extent. The heat and moisture exchanger is a passive method of heat conservation, an artificial nose, that needs about 1 hour to become saturated with water and fully efficient and is almost as effective as a heated humidifier; fresh gas flow rate and tidal volume are inversely related to HME efficiency. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 109
    scene: "patient",
    sceneCfg: { label: "PASSIVE INSULATION AND HME" },
    metadata: { topic: "Temperature Monitoring", priority: "medium" },
  },

  {
    id: "ta-w3-044",
    type: "mcq",
    prompt: "Specialized neurologic monitoring includes several distinct modalities. Which option correctly identifies them?",
    setup: "",
    ans: [
      { t: "They include the EEG (electroencephalogram), SSEP (somatosensory evoked potential), MEP (motor evoked potential), VEP (visual evoked potential), BAEP (brainstem auditory evoked potential), BIS (bispectral index), NIRS (near infrared spectroscopy), TCD (transcranial Doppler), and ICP (intracranial pressure) monitoring", ok: true },
      { t: "They include only the ECG and pulse oximeter, which together assess brain function", ok: false },
      { t: "They include capnography, spirometry, and the oxygen analyzer", ok: false },
      { t: "They include only blood pressure and temperature monitoring", ok: false },
    ],
    rationale: "Specialized methods of neurologic monitoring include the EEG (electroencephalogram), SSEP (somatosensory evoked potential), MEP (motor evoked potential), VEP (visual evoked potential), BAEP (brainstem auditory evoked potential), BIS (bispectral index), NIRS (near infrared spectroscopy), TCD (transcranial Doppler ultrasonography), and ICP (intracranial pressure) monitoring. For the CRNA, evoked potentials assess the integrity of specific sensory and motor pathways and are sensitive to anesthetic agents, which must be kept stable during monitoring. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 112
    scene: "neuro",
    sceneCfg: { label: "NEUROLOGIC MONITORING MODALITIES" },
    metadata: { topic: "Neurologic Monitoring", priority: "medium" },
  },

  {
    id: "ta-w3-045",
    type: "mcq",
    prompt: "The bispectral index (BIS) is used to assess depth of anesthesia. Which statement about BIS is correct?",
    setup: "",
    ans: [
      { t: "BIS extrapolates a number from 0 to 100 from EEG channel parameters to estimate the depth of hypnosis (it is not a raw EEG); values above 70 carry a higher likelihood of recall while values of 40 to 70 have a low incidence, though patient variability exists, and the signal is susceptible to electrocautery and electromyographic interference", ok: true },
      { t: "BIS is a direct raw EEG, and a value above 70 indicates deep anesthesia with no recall risk", ok: false },
      { t: "BIS ranges from 0 to 10, and a value of 0 indicates full wakefulness", ok: false },
      { t: "BIS is immune to electrocautery and muscle activity interference", ok: false },
    ],
    rationale: "BIS measures the depth of hypnosis. It is not an EEG; it extrapolates via an algorithm from EEG channel parameters to derive a number from 0 to 100 correlating with the level of sedation. Values above 70 are likely to have recall; values of 40 to 70 have a low incidence of recall, although there is patient-to-patient variability (one patient with a value of 47 had recall without somatic signs). The signal is susceptible to electrocautery interference (unipolar cautery overloads it), electromyographic activity such as shivering, forced air warmers, and pacemaker spikes, and it represents a trend rather than an absolute. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 113
    scene: "neuro",
    sceneCfg: { label: "BISPECTRAL INDEX (BIS)" },
    metadata: { topic: "Neurologic Monitoring", priority: "high" },
  },

  {
    id: "ta-w3-046",
    type: "mcq",
    prompt: "Cerebral oximetry uses near infrared spectroscopy (NIRS). Which statement about it is correct?",
    setup: "",
    ans: [
      { t: "NIRS assesses regional cerebral oxygen saturation (SrO2) noninvasively from a forehead sensor using the Beer-Lambert law; normal values under anesthesia are generally 60 to 80 percent, a greater than 20 percent reduction correlates with regional and global ischemia, and it is best used as a trend monitor rather than for absolute ischemic thresholds", ok: true },
      { t: "NIRS measures arterial blood pressure in the carotid artery and is unrelated to oxygenation", ok: false },
      { t: "The NIRS reading is always identical to the pulse oximeter SpO2 and replaces it", ok: false },
      { t: "A greater than 20 percent increase in cerebral saturation indicates ischemia", ok: false },
    ],
    rationale: "Cerebral oximetry uses near infrared spectroscopy to assess cerebral oxygen saturation (SrO2); the light source is applied to the forehead and transmitted through tissue and bone, allowing detection of decreases in cerebral blood flow relative to cerebral metabolic rate. It differs from pulse oximetry, and the pulse oximeter reading may not reflect cerebral oximetry. Normal values under anesthesia generally range between 60 and 80 percent, the cerebral oximeter uses the Beer-Lambert law, and a greater than 20 percent reduction in cerebral oxygen saturation correlates with regional and global ischemia. It is best used as a trend monitor, with caution about claims of absolute ischemic thresholds; the most frequent uses are neonatology, cardiac surgery, and carotid endarterectomy. Source: NAS 560 Anesthesia Monitoring lecture.", // source: slide 117
    scene: "neuro",
    sceneCfg: { label: "CEREBRAL OXIMETRY (NIRS)" },
    metadata: { topic: "Neurologic Monitoring", priority: "high" },
  },

  /* ================================================================
     NEUROMUSCULAR MONITORING (Source: NAS 560 Neuromuscular Monitoring lecture)
     Principles, stimulation patterns, sites, blockade states, Phase I and II
     ================================================================ */

  {
    id: "ta-w3-047",
    type: "mcq",
    prompt: "Why is neuromuscular monitoring used during anesthesia, and what four questions does it help answer?",
    setup: "",
    ans: [
      { t: "Because it is easy to give more relaxant than necessary (causing longer recovery, prolonged ventilation, and added expense) and the depth of relaxation in the diaphragm, larynx, and surgical field cannot be measured directly, a peripheral nerve is monitored to answer whether blockade is adequate, whether it is excessive, whether it can be antagonized, and whether it has been adequately antagonized", ok: true },
      { t: "Because relaxants have no measurable side effects, monitoring simply confirms the drug was given", ok: false },
      { t: "Because the diaphragm can be measured directly, peripheral nerve monitoring is unnecessary", ok: false },
      { t: "Only to determine the patient body temperature during the case", ok: false },
    ],
    rationale: "Neuromuscular monitoring is used because it is easy to give more relaxant than necessary, which leads to a longer recovery phase, prolonged mechanical ventilation, and expense. The depth of relaxation in the diaphragm, larynx, and surgical field cannot be measured directly, so a peripheral nerve is stimulated instead. Monitoring helps answer four questions: is neuromuscular blockade adequate, is it excessive, can it be antagonized, and has it been adequately antagonized. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 3
    scene: "neuro",
    sceneCfg: { label: "WHY MONITOR NEUROMUSCULAR BLOCKADE" },
    metadata: { topic: "NMB Monitoring Principles", priority: "high" },
  },

  {
    id: "ta-w3-048",
    type: "mcq",
    prompt: "Stimulation of a peripheral nerve produces an all-or-none muscle response. How do supramaximal and submaximal stimuli differ?",
    setup: "",
    ans: [
      { t: "A supramaximal stimulus is set about 20 to 25 percent higher than the current needed to activate all local motor nerve fibers (under about 50 mA) and is painful but accurate, whereas a submaximal stimulus uses about 50 to 70 percent of that current, is recommended in the awake or recovering patient, but is less accurate", ok: true },
      { t: "A submaximal stimulus is higher than a supramaximal stimulus and is the most accurate", ok: false },
      { t: "Both stimuli activate only a single nerve fiber and give identical results", ok: false },
      { t: "A supramaximal stimulus is painless while a submaximal stimulus is painful", ok: false },
    ],
    rationale: "The reaction of a muscle fiber is all or none: it either contracts or it does not, and the response of the whole muscle depends on the number of nerve fibers activated. A supramaximal stimulus is set about 20 to 25 percent higher than the current required to activate all local motor nerve fibers (under about 50 mA); it ensures every fiber fires but is painful. A submaximal stimulus uses about 50 to 70 percent of the supramaximal current and is recommended during recovery and when the patient is awake, but it is not as accurate. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 7
    scene: "neuro",
    sceneCfg: { label: "SUPRAMAXIMAL VS SUBMAXIMAL" },
    metadata: { topic: "NMB Monitoring Principles", priority: "high" },
  },

  {
    id: "ta-w3-049",
    type: "mcq",
    prompt: "The two variables of a peripheral nerve stimulator are the stimulation pattern and the electrical output. How are they expressed?",
    setup: "",
    ans: [
      { t: "The pattern is expressed in hertz (cycles per second, for example 1 Hz is one stimulus per second and 0.1 Hz is one every 10 seconds), and the electrical output is measured in milliamps, with about 10 mA as the maximum", ok: true },
      { t: "The pattern is measured in milliamps and the output is measured in hertz", ok: false },
      { t: "Both variables are measured in volts, with 100 V as the maximum", ok: false },
      { t: "The pattern is fixed at 50 Hz and the output cannot be changed", ok: false },
    ],
    rationale: "A peripheral nerve stimulator has two variables. The stimulation pattern is expressed in hertz, the number of cycles per second: 1 Hz is one stimulus every second and 0.1 Hz is one stimulus every 10 seconds. The electrical output is how much current is used and is measured in milliamps, with about 10 mA as the maximum. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 9
    scene: "neuro",
    sceneCfg: { label: "STIMULATOR VARIABLES" },
    metadata: { topic: "NMB Monitoring Principles", priority: "medium" },
  },

  {
    id: "ta-w3-050",
    type: "mcq",
    prompt: "How should the electrodes of a peripheral nerve stimulator be placed?",
    setup: "",
    ans: [
      { t: "Directly over the nerve (not the muscle); when the electrodes are far apart, the negative (black) electrode is placed most distally directly over the nerve and the positive electrode proximally; the ulnar nerve correlates more closely with the diaphragm, and clean dry skin with adhesive pads allows the same site each time", ok: true },
      { t: "Directly over the muscle belly, with polarity irrelevant at any spacing", ok: false },
      { t: "The positive (red) electrode is always placed most distally over the nerve", ok: false },
      { t: "One electrode per arm on opposite limbs, to compare sides", ok: false },
    ],
    rationale: "Electrodes are placed directly over the nerve, not the muscle, and the ulnar nerve correlates more closely with the diaphragm. Because direct current is applied there is a positive (red) and a negative (black) electrode; using adhesive pads on clean dry skin lets the same area be monitored each time. If the electrodes are close together (about 2 cm) polarity does not matter, but if they are farther apart the negative (black) electrode is placed most distally and directly over the nerve with the positive electrode proximal. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 11
    scene: "neuro",
    sceneCfg: { label: "ELECTRODE PLACEMENT" },
    metadata: { topic: "NMB Monitoring Principles", priority: "medium" },
  },

  {
    id: "ta-w3-051",
    type: "mcq",
    prompt: "What is single twitch stimulation used for, and at what frequencies is it delivered?",
    setup: "",
    ans: [
      { t: "Single electrical stimuli are delivered at 1 Hz (once per second) or 0.1 Hz (once every 10 seconds); it is a good pattern for evaluating intubating conditions, because when the twitches disappear it should correlate with relaxed laryngeal muscles and diaphragm", ok: true },
      { t: "It delivers four stimuli at once and is used only during recovery", ok: false },
      { t: "It is delivered at 50 Hz for 5 seconds and measures fade", ok: false },
      { t: "It cannot be used to assess intubating conditions", ok: false },
    ],
    rationale: "Single twitch stimulation applies single electrical stimuli at 1 Hz (once every second) or 0.1 Hz (once every 10 seconds). It is a good pattern for evaluating intubating conditions, because when the twitches have disappeared this should correlate with relaxed laryngeal muscles and diaphragm. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 14
    scene: "neuro",
    sceneCfg: { label: "SINGLE TWITCH" },
    metadata: { topic: "Stimulation Patterns", priority: "medium" },
  },

  {
    id: "ta-w3-052",
    type: "mcq",
    prompt: "How is the train-of-four (TOF) delivered, and how are the TOF count and TOF ratio interpreted?",
    setup: "",
    ans: [
      { t: "Four supramaximal stimuli are delivered every 0.5 second (2 Hz); the response is judged by the fade of the twitches, the TOF count is the number of twitches present, and the TOF ratio is the height of the fourth twitch divided by the first (T4 over T1)", ok: true },
      { t: "A single stimulus is delivered once every 10 seconds, and the ratio is the first twitch divided by the fourth", ok: false },
      { t: "Forty stimuli are delivered per second, and only the total count matters", ok: false },
      { t: "Two stimuli are delivered 750 msec apart, and there is no ratio", ok: false },
    ],
    rationale: "The train-of-four, introduced in the 1970s, delivers four supramaximal stimuli every 0.5 second, which is 2 Hz. It is evaluated by the fade in the muscle twitch response. The TOF count is the number of twitches present out of four, and the TOF ratio is the height of the fourth twitch divided by the first (T4 over T1). With a nondepolarizing relaxant the first twitch is always the strongest and the later twitches fade. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 15
    scene: "neuro",
    sceneCfg: { label: "TRAIN OF FOUR" },
    metadata: { topic: "Stimulation Patterns", priority: "high" },
  },

  {
    id: "ta-w3-053",
    type: "mcq",
    prompt: "As nondepolarizing neuromuscular blockade deepens, how does the train-of-four response change?",
    setup: "",
    ans: [
      { t: "With no blockade the fourth twitch is as strong as the first; as blockade deepens the fourth twitch fades and is lost first, then the third and second follow the same pattern, and with deep blockade no twitch is present", ok: true },
      { t: "The first twitch is lost before the fourth as blockade deepens", ok: false },
      { t: "All four twitches remain equal until blockade is complete", ok: false },
      { t: "The fourth twitch grows stronger as blockade deepens", ok: false },
    ],
    rationale: "With no neuromuscular blockade the fourth twitch is as strong as the first. As nondepolarizing blockade deepens, the fourth twitch becomes weaker (fades) and is lost first; the third and second twitches then follow the same pattern, and with deep blockade no twitch is present. The loss of twitches correlates with the single twitch height. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 16
    scene: "neuro",
    sceneCfg: { label: "TOF FADE PATTERN" },
    metadata: { topic: "Stimulation Patterns", priority: "high" },
  },

  {
    id: "ta-w3-054",
    type: "mcq",
    prompt: "How does the train-of-four response to succinylcholine (a depolarizing relaxant) differ from the response to a nondepolarizing relaxant?",
    setup: "",
    ans: [
      { t: "With succinylcholine all four twitches diminish together and equally (the first and fourth stay equal in height), so there is no true fade; with a nondepolarizing relaxant the twitches fade sequentially, the fourth weakening before the first", ok: true },
      { t: "With succinylcholine the fourth twitch fades before the first, exactly like a nondepolarizing relaxant", ok: false },
      { t: "Succinylcholine causes the four twitches to grow progressively stronger", ok: false },
      { t: "Succinylcholine produces no twitches at any depth of block", ok: false },
    ],
    rationale: "With succinylcholine, a depolarizing relaxant, all four twitches fade together: the first and fourth twitches remain equal in height, and as blockade deepens all four diminish in size equally until, with deep block, no twitches are seen or felt. This equal decrease is not called a fade, just a lower twitch height. A nondepolarizing relaxant instead produces sequential fade, with the fourth twitch weakening before the first. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 18
    scene: "neuro",
    sceneCfg: { label: "TOF WITH SUCCINYLCHOLINE" },
    metadata: { topic: "Stimulation Patterns", priority: "high" },
  },

  {
    id: "ta-w3-055",
    type: "mcq",
    prompt: "As neuromuscular blockade wears off, in what order do the train-of-four twitches return, and what TOF ratio indicates adequate recovery?",
    setup: "",
    ans: [
      { t: "Twitches return in the same order they disappeared (with a nondepolarizing relaxant the first returns, then the second, third, and fourth until the fourth equals the first); a TOF ratio of 0.7 has been cited as adequate recovery, although some sources require 0.9 to 0.95", ok: true },
      { t: "Twitches return in the reverse order, the fourth first, and any ratio above 0.1 is adequate", ok: false },
      { t: "All four twitches return simultaneously, and the ratio is irrelevant", ok: false },
      { t: "Adequate recovery requires a TOF ratio of exactly 0.2", ok: false },
    ],
    rationale: "As the neuromuscular blocker diffuses away from the junction, relaxation wears off and the twitches return in the same order they disappeared. With a nondepolarizing relaxant the first twitch is felt, then the second, third, and fourth, until the fourth again equals the first; with succinylcholine four weak twitches are felt that all strengthen together to baseline. A TOF ratio of 0.7 (the fourth twitch 70 percent as strong as the first) has been cited as adequate recovery for airway maintenance and breathing, although some sources require 0.9 to 0.95. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 19
    scene: "neuro",
    sceneCfg: { label: "RETURN OF TWITCHES" },
    metadata: { topic: "Stimulation Patterns", priority: "high" },
  },

  {
    id: "ta-w3-056",
    type: "mcq",
    prompt: "Tetanic stimulation is used to assess neuromuscular blockade. How is it delivered, and what is the mechanism of the fade it produces?",
    setup: "",
    ans: [
      { t: "Tetanus is the rapid delivery of stimuli, most commonly 50 Hz for 5 seconds; observation is for fade, which is a presynaptic event because the large initial release of acetylcholine depletes the nerve terminal stores and reduces the rate of release", ok: true },
      { t: "Tetanus is a single stimulus every 10 seconds, and fade is a purely postsynaptic event", ok: false },
      { t: "Tetanus is delivered at 2 Hz and never produces fade", ok: false },
      { t: "Fade during tetanus occurs because acetylcholine release increases over time", ok: false },
    ],
    rationale: "Tetanic stimulation rapidly delivers stimuli at 30, 50, or 100 Hz, most commonly 50 Hz for 5 seconds (sometimes 100 Hz for 5 seconds), and is painful. Observation is for fade, which is a presynaptic event: at the beginning of tetanus a large amount of acetylcholine is released from the nerve terminal, and depletion of the stores reduces the rate of release. The degree of fade depends on the degree of blockade, the frequency, the length, and how often the tetanic stimulus is applied, making tetanus useful for assessing recovery. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 20
    scene: "neuro",
    sceneCfg: { label: "TETANIC STIMULATION" },
    metadata: { topic: "Stimulation Patterns", priority: "high" },
  },

  {
    id: "ta-w3-057",
    type: "mcq",
    prompt: "When a nondepolarizing block is so intense that there is no train-of-four response, how does the post-tetanic count assess it?",
    setup: "",
    ans: [
      { t: "A 50 Hz tetanus is applied for 5 seconds, then after a 3 second pause single twitches at 1 Hz are counted; post-tetanic twitches appear before the first train-of-four twitch returns, so the count grades an intense block when TOF and single twitch show no response", ok: true },
      { t: "It applies a single twitch only and is identical to the train-of-four", ok: false },
      { t: "Post-tetanic twitches appear only after the train-of-four has fully returned", ok: false },
      { t: "It is used only when the block is light and the train-of-four is already 4 of 4", ok: false },
    ],
    rationale: "When a nondepolarizing relaxant has taken full effect there may be no response to the train-of-four, so the TOF cannot grade the intensity of the block. The post-tetanic count applies a 50 Hz tetanus for 5 seconds, waits about 3 seconds, then delivers single twitch stimuli at 1 Hz. With an extremely intense block there is no response at all; as the block dissipates, post-tetanic twitches appear, and they appear before the first twitch of the train-of-four returns. The count therefore evaluates the degree of an intense block when there is no TOF or single twitch response. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 23
    scene: "neuro",
    sceneCfg: { label: "POST-TETANIC COUNT" },
    metadata: { topic: "Stimulation Patterns", priority: "high" },
  },

  {
    id: "ta-w3-058",
    type: "mcq",
    prompt: "What is double-burst stimulation (DBS), and why is it preferred over the train-of-four during recovery?",
    setup: "",
    ans: [
      { t: "DBS delivers two bursts of 50 Hz tetanic stimuli separated by 750 msec; in nonparalyzed muscle the two contractions are equal, while in partially paralyzed muscle the second is weaker (fade); it correlates closely with the TOF but its fade is easier to feel", ok: true },
      { t: "DBS delivers a single sustained stimulus and cannot detect fade", ok: false },
      { t: "DBS shows equal contractions even with significant residual paralysis", ok: false },
      { t: "DBS is delivered at 0.1 Hz and is unrelated to the train-of-four", ok: false },
    ],
    rationale: "Double-burst stimulation delivers two bursts of 50 Hz tetanic stimuli separated by 750 msec. In nonparalyzed muscle the response is two equal contractions; in partially paralyzed muscle the second response is weaker than the first (fade). DBS is closely correlated with the train-of-four, and during recovery it is preferred because the fade is easier to feel, although a lack of fade in DBS or TOF does not exclude significant residual blockade. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 25
    scene: "neuro",
    sceneCfg: { label: "DOUBLE-BURST STIMULATION" },
    metadata: { topic: "Stimulation Patterns", priority: "high" },
  },

  {
    id: "ta-w3-059",
    type: "mcq",
    prompt: "Which peripheral nerves are most commonly used for neuromuscular monitoring, and what is a key limitation of the ulnar nerve?",
    setup: "",
    ans: [
      { t: "The ulnar and facial nerves are the most commonly used; the ulnar nerve is not well correlated with the larynx and diaphragm, and at the facial nerve the corrugator supercilii is better correlated than the orbicularis oculi", ok: true },
      { t: "The ulnar nerve perfectly reflects the larynx and diaphragm and needs no alternative", ok: false },
      { t: "Only the posterior tibial nerve can be used for monitoring", ok: false },
      { t: "The facial nerve cannot be used for neuromuscular monitoring", ok: false },
    ],
    rationale: "In principle any superficial peripheral nerve can be stimulated, but the ulnar and facial nerves are the most commonly used. The ulnar nerve is not well correlated with the larynx and diaphragm. At the facial nerve, monitoring may use the orbicularis oculi (inner eyebrow), but the corrugator supercilii is better correlated; the orbicularis oris may also be used. Other options include the posterior tibial, common peroneal, and median nerves. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 29
    scene: "neuro",
    sceneCfg: { label: "SITES OF STIMULATION" },
    metadata: { topic: "Sites and Muscle Sensitivity", priority: "medium" },
  },

  {
    id: "ta-w3-060",
    type: "mcq",
    prompt: "How does the diaphragm compare with the adductor pollicis in its response to muscle relaxants?",
    setup: "",
    ans: [
      { t: "The diaphragm is the most resistant muscle, requiring about 1.4 to 2.0 times the dose needed to block the adductor pollicis, and it also has a shorter onset and quicker recovery; so as a relaxant wears off the adductor pollicis may still be blocked while the diaphragm is not, and the patient can push or buck", ok: true },
      { t: "The diaphragm is the most sensitive muscle and is blocked first and longest", ok: false },
      { t: "The diaphragm and adductor pollicis respond identically to all relaxants", ok: false },
      { t: "The diaphragm requires only half the dose needed to block the adductor pollicis", ok: false },
    ],
    rationale: "The diaphragm is the most resistant muscle to both depolarizing and nondepolarizing relaxants, requiring about 1.4 to 2.0 times the amount needed to block the adductor pollicis. Its onset is shorter and its recovery quicker than peripheral muscles. As a relaxant wears off, the adductor pollicis may still be blocked while the diaphragm is not, which is why a patient can be pushing or bucking even though monitoring at the thumb still shows blockade. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 30
    scene: "neuro",
    sceneCfg: { label: "DIAPHRAGM RESISTANCE" },
    metadata: { topic: "Sites and Muscle Sensitivity", priority: "high" },
  },

  {
    id: "ta-w3-061",
    type: "mcq",
    prompt: "Muscles differ in their sensitivity to neuromuscular blockade. Which ordering, from most to least sensitive, is correct?",
    setup: "",
    ans: [
      { t: "From most to least sensitive: abdominal, orbicularis oculi, geniohyoid, masseter, upper airway muscles, peripheral limbs, laryngeal, and diaphragm", ok: true },
      { t: "From most to least sensitive: diaphragm, laryngeal, peripheral limbs, with abdominal last", ok: false },
      { t: "All muscles are equally sensitive to neuromuscular blockade", ok: false },
      { t: "The diaphragm is the most sensitive and the abdominal muscles are the least sensitive", ok: false },
    ],
    rationale: "Muscles vary in their resistance to relaxants, so a dose that blocks one group cannot be automatically extrapolated to another. Listed from most to least sensitive, the order is abdominal, orbicularis oculi, geniohyoid, masseter, upper airway muscles, peripheral limbs, laryngeal, and diaphragm. The diaphragm is the least sensitive and most resistant. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 32
    scene: "neuro",
    sceneCfg: { label: "MUSCLE SENSITIVITY ORDER" },
    metadata: { topic: "Sites and Muscle Sensitivity", priority: "medium" },
  },

  {
    id: "ta-w3-062",
    type: "mcq",
    prompt: "When monitoring at the ulnar nerve, where are the electrodes placed and what muscle action is observed?",
    setup: "",
    ans: [
      { t: "Electrodes are applied to the volar side of the wrist, the distal electrode about 1 cm proximal to the flexion crease on the radial side of the flexor carpi ulnaris and the proximal electrode 2 to 5 cm above it; stimulation produces finger flexion and thumb adduction", ok: true },
      { t: "Electrodes are placed on the dorsum of the hand and produce wrist extension", ok: false },
      { t: "Electrodes are placed over the orbicularis oculi and produce eyebrow movement", ok: false },
      { t: "Stimulation of the ulnar nerve produces plantar flexion of the foot", ok: false },
    ],
    rationale: "For ulnar nerve monitoring the electrodes are best applied to the volar side of the wrist, with the distal electrode about 1 cm proximal to the flexion crease on the radial side of the flexor carpi ulnaris and the proximal electrode 2 to 5 cm proximal to the distal one. Stimulation produces finger flexion and thumb adduction; if the proximal (red) electrode is placed over the ulnar groove at the elbow, thumb adduction is more pronounced. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 33
    scene: "neuro",
    sceneCfg: { label: "ULNAR NERVE MONITORING" },
    metadata: { topic: "Sites and Muscle Sensitivity", priority: "medium" },
  },

  {
    id: "ta-w3-063",
    type: "mcq",
    prompt: "How does single twitch height relate to the percentage of acetylcholine receptors occupied by a nondepolarizing relaxant?",
    setup: "",
    ans: [
      { t: "No change is seen in the single twitch until about 70 percent of receptors are occupied, and the single twitch is totally lost when about 90 percent are occupied, so only a narrow window of receptor occupancy separates a normal twitch from complete loss", ok: true },
      { t: "The single twitch disappears as soon as 10 percent of receptors are occupied", ok: false },
      { t: "Single twitch height is unrelated to receptor occupancy", ok: false },
      { t: "The single twitch is lost at 30 percent occupancy and returns at 90 percent", ok: false },
    ],
    rationale: "Interpreting neuromuscular function involves the approximate number of receptors occupied. No change is seen in the single twitch until about 70 percent of receptors are occupied, and the single twitch is totally lost when about 90 percent are occupied. Therefore a narrow window of receptor occupancy exists when administering a nondepolarizing relaxant, which is why monitoring is needed to titrate the block. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 37
    scene: "neuro",
    sceneCfg: { label: "RECEPTOR OCCUPANCY WINDOW" },
    metadata: { topic: "Blockade States and Recovery", priority: "high" },
  },

  {
    id: "ta-w3-064",
    type: "mcq",
    prompt: "How are intense and moderate (surgical) neuromuscular blockade defined?",
    setup: "",
    ans: [
      { t: "Intense blockade occurs within about 3 to 6 minutes after an intubating dose of a nondepolarizing relaxant, with no train-of-four response and possibly no post-tetanic twitches; moderate (surgical) blockade begins when the first train-of-four twitch returns and indicates adequate relaxation for most procedures and usually enough recovery for reversal with neostigmine", ok: true },
      { t: "Intense blockade is defined by a 4 of 4 train-of-four, and moderate blockade by 0 of 4", ok: false },
      { t: "Moderate blockade occurs before any drug is given", ok: false },
      { t: "Intense blockade always lasts exactly 1 hour regardless of dose or patient", ok: false },
    ],
    rationale: "Intense blockade occurs within about 3 to 6 minutes after an intubating dose of a nondepolarizing relaxant; there is no response to the train-of-four and there may or may not be post-tetanic twitches, and its duration depends on the drug, dose, and patient. Moderate or surgical blockade begins when the first twitch of the train-of-four returns; it indicates adequate relaxation for most procedures (although the patient can still cough or buck) and is usually enough recovery for adequate reversal with neostigmine. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 39
    scene: "neuro",
    sceneCfg: { label: "BLOCKADE STATES" },
    metadata: { topic: "Blockade States and Recovery", priority: "high" },
  },

  {
    id: "ta-w3-065",
    type: "mcq",
    prompt: "On the relationship between receptor blockade and clinical response, which pairing is correct?",
    setup: "",
    ans: [
      { t: "At about 90 percent of receptors blocked there is adequate abdominal relaxation with a 1 of 4 train-of-four; at about 75 percent the tidal volume and vital capacity are normal with a 4 of 4 train-of-four; and at about 50 percent the patient can generate an inspiratory force of negative 20 cm H2O and sustain a head lift", ok: true },
      { t: "At 100 percent blocked the train-of-four is 4 of 4 with full strength", ok: false },
      { t: "At 30 percent blocked the patient is completely paralyzed", ok: false },
      { t: "A 4 of 4 train-of-four guarantees that zero receptors are blocked", ok: false },
    ],
    rationale: "The percentage of receptors blocked correlates with the clinical response: at 99 to 100 percent there is complete paralysis with 0 of 4 train-of-four; at 95 percent the diaphragm moves with 0 of 4; at 90 percent abdominal relaxation is adequate with 1 of 4; at 75 percent tidal volume and vital capacity are normal with 4 of 4; at 50 percent the patient can inspire to negative 20 cm H2O and sustain a head lift; and at 30 percent a hand grasp is sustained. A 4 of 4 train-of-four can still coexist with substantial receptor occupancy, which is why clinical signs matter. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 41
    scene: "neuro",
    sceneCfg: { label: "RECEPTOR BLOCKADE AND RECOVERY" },
    metadata: { topic: "Blockade States and Recovery", priority: "high" },
  },

  {
    id: "ta-w3-066",
    type: "mcq",
    prompt: "What characterizes a Phase I block from a depolarizing relaxant such as succinylcholine?",
    setup: "",
    ans: [
      { t: "Muscle fasciculations appear, there is no fade with tetanus or train-of-four (although amplitude is reduced in proportion to block intensity), there are no post-tetanic twitches, and anticholinesterases such as neostigmine augment (prolong) the block", ok: true },
      { t: "Fade with tetanus and train-of-four is prominent, and anticholinesterases reverse the block", ok: false },
      { t: "Fasciculations never occur and post-tetanic twitches are always present", ok: false },
      { t: "The block is identical to a nondepolarizing block in every respect", ok: false },
    ],
    rationale: "A Phase I block is the normal response to a depolarizing relaxant. Muscle fasciculations appear, there is no fade with tetanus or the train-of-four (although the amplitude is reduced in proportion to the intensity of block), and there are no post-tetanic twitches. Anticholinesterases such as neostigmine or edrophonium augment and prolong the block, because they depress the pseudocholinesterase that metabolizes succinylcholine, so the drug remains at its site of action. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 43
    scene: "neuro",
    sceneCfg: { label: "PHASE I BLOCK" },
    metadata: { topic: "Phase I and Phase II", priority: "high" },
  },

  {
    id: "ta-w3-067",
    type: "mcq",
    prompt: "How does a Phase II block differ from a Phase I block, and what promotes the transition to a Phase II block?",
    setup: "",
    ans: [
      { t: "A Phase II block behaves like a nondepolarizing block: fasciculations do not appear, there is fade with tetanus and train-of-four, and post-tetanic twitches are present, so an anticholinesterase may antagonize it; the transition is promoted by a large dose or long duration of succinylcholine, such as more than 3 mg/kg, 500 mg over 30 minutes, or a prolonged infusion", ok: true },
      { t: "A Phase II block shows no fade and is prolonged by anticholinesterases, exactly like Phase I", ok: false },
      { t: "A Phase II block occurs only at very low doses of succinylcholine", ok: false },
      { t: "A Phase II block produces strong fasciculations and no fade", ok: false },
    ],
    rationale: "A Phase II block develops when a depolarizing relaxant is given in large doses and begins to behave like a nondepolarizing block. Fasciculations do not appear before paralysis, there is fade with tetanus and the train-of-four, and post-tetanic twitches are present unless the block is extremely intense, so an anticholinesterase may antagonize it. The transition from Phase I to Phase II is influenced by both time and dose: a dose greater than about 3 mg/kg, about 500 mg over 30 minutes, or a prolonged succinylcholine infusion (versus a single bolus) makes a Phase II block more likely. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 44
    scene: "neuro",
    sceneCfg: { label: "PHASE II BLOCK" },
    metadata: { topic: "Phase I and Phase II", priority: "high" },
  },

  {
    id: "ta-w3-068",
    type: "mcq",
    prompt: "Which clinical pearls about neuromuscular monitoring and reversal are correct?",
    setup: "",
    ans: [
      { t: "Avoid total twitch suppression during surgery (keep 1 to 2 tactile responses), do not attempt reversal at a train-of-four of 0 of 4 (2 to 3 of 4 is desirable), and confirm recovery with reliable signs such as a sustained head lift for more than 5 seconds, since a lack of fade does not exclude significant residual blockade", ok: true },
      { t: "Reversal is best attempted at a train-of-four of 0 of 4 for maximum effect", ok: false },
      { t: "A lack of fade on the train-of-four guarantees full recovery with no residual blockade", ok: false },
      { t: "Total twitch suppression should be maintained throughout surgery", ok: false },
    ],
    rationale: "Clinical pearls include avoiding total twitch suppression during surgery (there should be 1 to 2 tactile responses), using tactile train-of-four during the case, and antagonizing the block at the end of the procedure. Double-burst stimulation is preferable to the train-of-four during recovery because fade is easier to feel, but a lack of fade in DBS or TOF does not exclude significant residual blockade. Reversal should not be attempted at a train-of-four of 0 of 4; 2 to 3 of 4 is desirable because more twitches mean more reliable reversal. Reliable signs such as a sustained head lift, leg lift, or hand grip for more than 5 seconds and a strong inspiratory force confirm returned strength. Source: NAS 560 Neuromuscular Monitoring lecture.", // source: NMB slide 46
    scene: "neuro",
    sceneCfg: { label: "CLINICAL PEARLS AND REVERSAL" },
    metadata: { topic: "Blockade States and Recovery", priority: "high" },
  },

];

export const TA_WK3_METADATA = {
  nodeId: "ta-wk-3",
  courseId: "tech-advances-anesthesia",
  chapter: "Pardo 20; Nagelhout 17 to 19",
  title: "Clinical Monitoring",
  totalQuestions: 68,
  questionTypes: { mcq: 68, multi: 0, short: 0 },
};
