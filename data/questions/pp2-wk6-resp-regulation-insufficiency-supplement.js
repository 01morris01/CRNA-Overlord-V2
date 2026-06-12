/**
 * BIOL-510-A Adv Phys and Pathophys II SUPPLEMENT
 * Regulation of Respiration and Respiratory Insufficiency (Guyton and Hall 14e, Ch. 42 to 43)
 * Sourced from the chapter slides; every MCQ cites its source page.
 * Authoring conventions: periods, commas, semicolons only (no dashes as punctuation); ranges with the word "to"; answer options kept approximately equal length.
 */

export const PP2_WK6_SUPPLEMENT_QUESTIONS = [

  {
    id: "pp2-w6r-001",
    type: "mcq",
    prompt: "Which respiratory neuron group is located in the medulla and generates the basic inspiratory rhythm?",
    setup: "",
    ans: [
      { t: "Dorsal respiratory group", ok: true },
      { t: "Pneumotaxic center", ok: false },
      { t: "Apneustic center area", ok: false },
      { t: "Hering Breuer center", ok: false },
    ],
    rationale: "The dorsal respiratory group lies in the medulla, has intrinsic nerve activity, and is mainly responsible for inspiration and for the basic rhythm of respiration. The pneumotaxic center is in the pons, and the apneustic center is marked with a question mark because its role in humans is uncertain.", // source: Ch 42 p 4
    scene: "pulmonary",
    sceneCfg: { label: "DORSAL RESPIRATORY GROUP" },
    metadata: { topic: "Respiratory centers", priority: "high" },
  },

  {
    id: "pp2-w6r-002",
    type: "mcq",
    prompt: "The inspiratory signal sent by the dorsal respiratory group is best described as which type of signal?",
    setup: "",
    ans: [
      { t: "A ramp signal", ok: true },
      { t: "A square wave", ok: false },
      { t: "A steady plateau", ok: false },
      { t: "A random burst", ok: false },
    ],
    rationale: "Inspiratory signals are ramp signals: the signal progressively increases to the inspiratory muscles during inspiration and then abruptly stops, allowing passive expiration by elastic recoil. The ramp becomes steeper when more rapid lung filling is needed.", // source: Ch 42 p 4
    scene: "pulmonary",
    sceneCfg: { label: "INSPIRATORY RAMP SIGNAL" },
    metadata: { topic: "Inspiratory ramp", priority: "high" },
  },

  {
    id: "pp2-w6r-003",
    type: "mcq",
    prompt: "Why does the inspiratory ramp signal stop abruptly at the end of inspiration?",
    setup: "",
    ans: [
      { t: "To allow passive recoil", ok: true },
      { t: "To force active exhaling", ok: false },
      { t: "To trigger a deep cough", ok: false },
      { t: "To slow the heart rate", ok: false },
    ],
    rationale: "The ramp signal abruptly stops so that inspiratory muscle activity ceases and expiration proceeds passively by the elastic recoil of the lungs and chest wall. Quiet expiration does not require active muscle contraction.", // source: Ch 42 p 4
    scene: "pulmonary",
    sceneCfg: { label: "ABRUPT RAMP TERMINATION" },
    metadata: { topic: "Inspiratory ramp", priority: "medium" },
  },

  {
    id: "pp2-w6r-004",
    type: "mcq",
    prompt: "The pneumotaxic center, which modulates breathing, is located in which structure?",
    setup: "",
    ans: [
      { t: "The pons", ok: true },
      { t: "The medulla", ok: false },
      { t: "The midbrain", ok: false },
      { t: "The cortex", ok: false },
    ],
    rationale: "The pneumotaxic center is located in the pons. It sends modulatory signals to the dorsal respiratory group that decrease the duration of the inspiratory ramp signal. The dorsal and ventral respiratory groups are in the medulla.", // source: Ch 42 p 5
    scene: "pulmonary",
    sceneCfg: { label: "PNEUMOTAXIC CENTER LOCATION" },
    metadata: { topic: "Pneumotaxic center", priority: "high" },
  },

  {
    id: "pp2-w6r-005",
    type: "mcq",
    prompt: "What is the net effect of a strong pneumotaxic center signal on the pattern of breathing?",
    setup: "",
    ans: [
      { t: "Faster, shallower breaths", ok: true },
      { t: "Slower, deeper breaths", ok: false },
      { t: "Slower, shallow breaths", ok: false },
      { t: "Faster, deeper breaths", ok: false },
    ],
    rationale: "By decreasing the duration of the ramp signal, the pneumotaxic center limits inspiration and makes breaths shallower. Because inspiration is shortened, more breaths occur per minute, so respiratory rate increases.", // source: Ch 42 p 5
    scene: "pulmonary",
    sceneCfg: { label: "PNEUMOTAXIC BREATHING PATTERN" },
    metadata: { topic: "Pneumotaxic center", priority: "high" },
  },

  {
    id: "pp2-w6r-006",
    type: "mcq",
    prompt: "Which statement about the ventral respiratory group is correct?",
    setup: "",
    ans: [
      { t: "Inactive during quiet breathing", ok: true },
      { t: "Drives all quiet inspiration", ok: false },
      { t: "Sets the resting rhythm", ok: false },
      { t: "Located within the pons", ok: false },
    ],
    rationale: "The ventral respiratory group is in the medulla and is largely inactive during quiet respiration. It contributes during active respiration such as exercise or heavy forceful breathing, functioning mainly for expiration but also aiding inspiration.", // source: Ch 42 p 6
    scene: "pulmonary",
    sceneCfg: { label: "VENTRAL RESPIRATORY GROUP" },
    metadata: { topic: "Ventral respiratory group", priority: "high" },
  },

  {
    id: "pp2-w6r-007",
    type: "mcq",
    prompt: "The ventral respiratory group becomes important mainly under which condition?",
    setup: "",
    ans: [
      { t: "Heavy forceful breathing", ok: true },
      { t: "Quiet resting breathing", ok: false },
      { t: "Normal sleep breathing", ok: false },
      { t: "Breath holding at rest", ok: false },
    ],
    rationale: "The ventral respiratory group contributes during active respiration, such as exercise or heavy forceful breathing, when large volumes of ventilation are needed. It receives projections from the dorsal respiratory group and functions mainly for expiration.", // source: Ch 42 p 6
    scene: "pulmonary",
    sceneCfg: { label: "VRG ACTIVE BREATHING ROLE" },
    metadata: { topic: "Ventral respiratory group", priority: "medium" },
  },

  {
    id: "pp2-w6r-008",
    type: "mcq",
    prompt: "The Hering Breuer reflex, triggered by pulmonary stretch receptors, primarily serves to do what?",
    setup: "",
    ans: [
      { t: "Prevent lung overinflation", ok: true },
      { t: "Trigger forceful coughing", ok: false },
      { t: "Cause airway narrowing", ok: false },
      { t: "Increase tidal volume", ok: false },
    ],
    rationale: "Stretch receptors located in the smooth muscle of large and small airways minimize the work of breathing by inhibiting excessively large tidal volumes. The Hering Breuer reflex prevents overinflation of the lungs.", // source: Ch 42 p 7
    scene: "pulmonary",
    sceneCfg: { label: "HERING BREUER REFLEX" },
    metadata: { topic: "Lung receptors", priority: "high" },
  },

  {
    id: "pp2-w6r-009",
    type: "mcq",
    prompt: "Stimulation of irritant receptors in the airways produces which set of responses?",
    setup: "",
    ans: [
      { t: "Bronchoconstriction, cough, sneeze", ok: true },
      { t: "Bronchodilation, slow deep breaths", ok: false },
      { t: "Apnea, lowered blood pressure", ok: false },
      { t: "Tachypnea, reduced airway tone", ok: false },
    ],
    rationale: "Irritant receptors are found in the nasal mucosa, upper airways, and possibly the alveoli. Their stimulation causes bronchoconstriction and protective reflexes such as cough and sneeze.", // source: Ch 42 p 7
    scene: "pulmonary",
    sceneCfg: { label: "IRRITANT RECEPTOR RESPONSES" },
    metadata: { topic: "Lung receptors", priority: "medium" },
  },

  {
    id: "pp2-w6r-010",
    type: "mcq",
    prompt: "J receptors are located in the pulmonary capillary wall and interstitium and are stimulated by which condition?",
    setup: "",
    ans: [
      { t: "Pulmonary congestion or edema", ok: true },
      { t: "Mild airway dryness only", ok: false },
      { t: "Elevated arterial oxygen", ok: false },
      { t: "Low ambient air humidity", ok: false },
    ],
    rationale: "J receptors lie in the capillary wall and interstitium. They are stimulated by lung disease and edema such as pulmonary congestion and produce rapid shallow breathing, also called tachypnea.", // source: Ch 42 p 7
    scene: "pulmonary",
    sceneCfg: { label: "J RECEPTOR STIMULATION" },
    metadata: { topic: "Lung receptors", priority: "medium" },
  },

  {
    id: "pp2-w6r-011",
    type: "mcq",
    prompt: "Stimulation of arterial baroreceptors by elevated blood pressure produces which respiratory effect?",
    setup: "",
    ans: [
      { t: "Brief apnea and bronchodilation", ok: true },
      { t: "Sustained hyperpnea and cough", ok: false },
      { t: "Deep sighing and bradypnea", ok: false },
      { t: "Forced expiration and sneeze", ok: false },
    ],
    rationale: "Stimulation of arterial baroreceptors by elevated blood pressure results in brief apnea and bronchodilation. By contrast, arterial chemoreceptor stimulation causes hyperpnea and increased blood pressure.", // source: Ch 42 p 8
    scene: "pulmonary",
    sceneCfg: { label: "BARORECEPTOR APNEA EFFECT" },
    metadata: { topic: "Other reflexes", priority: "medium" },
  },

  {
    id: "pp2-w6r-012",
    type: "mcq",
    prompt: "Central chemoreceptors in the brainstem respond directly and most powerfully to which mediator?",
    setup: "",
    ans: [
      { t: "Hydrogen ions", ok: true },
      { t: "Dissolved oxygen", ok: false },
      { t: "Plasma bicarbonate", ok: false },
      { t: "Arterial potassium", ok: false },
    ],
    rationale: "The central chemosensitive area is located in the brainstem, and its direct mediator is the hydrogen ion. Carbon dioxide acts indirectly: it crosses into the cerebrospinal fluid, combines with water to form carbonic acid, and releases hydrogen ions that excite the area.", // source: Ch 42 p 10
    scene: "pulmonary",
    sceneCfg: { label: "CENTRAL DIRECT MEDIATOR" },
    metadata: { topic: "Central chemoreceptors", priority: "high" },
  },

  {
    id: "pp2-w6r-013",
    type: "mcq",
    prompt: "By what mechanism does carbon dioxide stimulate the central chemosensitive area?",
    setup: "",
    ans: [
      { t: "Forming acid that frees H ions", ok: true },
      { t: "Binding CO2 sensors directly", ok: false },
      { t: "Raising local oxygen tension", ok: false },
      { t: "Blocking bicarbonate transport", ok: false },
    ],
    rationale: "Carbon dioxide combines with water to form carbonic acid, which dissociates into hydrogen ions and bicarbonate. The hydrogen ions are the direct stimulus to the chemosensitive area, so the action of carbon dioxide is mediated through pH.", // source: Ch 42 p 10
    scene: "pulmonary",
    sceneCfg: { label: "CO2 ACTS THROUGH PH" },
    metadata: { topic: "Central chemoreceptors", priority: "high" },
  },

  {
    id: "pp2-w6r-014",
    type: "mcq",
    prompt: "The peripheral chemoreceptors in the carotid and aortic bodies respond mainly to which mediator?",
    setup: "",
    ans: [
      { t: "Decreased oxygen", ok: true },
      { t: "Increased oxygen", ok: false },
      { t: "Decreased sodium", ok: false },
      { t: "Increased glucose", ok: false },
    ],
    rationale: "The peripheral chemoreceptors are located in the aortic bodies and carotid bodies, and their main mediator is decreased oxygen. They also respond to a lesser extent to carbon dioxide and hydrogen ion levels.", // source: Ch 42 p 10
    scene: "pulmonary",
    sceneCfg: { label: "PERIPHERAL OXYGEN SENSING" },
    metadata: { topic: "Peripheral chemoreceptors", priority: "high" },
  },

  {
    id: "pp2-w6r-015",
    type: "mcq",
    prompt: "The carotid bodies, which sense oxygen, are located in which anatomic position?",
    setup: "",
    ans: [
      { t: "At the carotid bifurcation", ok: true },
      { t: "Within the aortic valve", ok: false },
      { t: "Inside the jugular bulb", ok: false },
      { t: "Along the vagus trunk", ok: false },
    ],
    rationale: "The carotid bodies are located at the bifurcation of the carotid arteries. They respond primarily to oxygen, with the greatest effect occurring when arterial PO2 falls below 100 mm Hg.", // source: Ch 42 p 12
    scene: "pulmonary",
    sceneCfg: { label: "CAROTID BODY LOCATION" },
    metadata: { topic: "Peripheral chemoreceptors", priority: "medium" },
  },

  {
    id: "pp2-w6r-016",
    type: "mcq",
    prompt: "Carotid body nerve impulse output increases most sharply when arterial PO2 falls below approximately what value?",
    setup: "",
    ans: [
      { t: "100 mm Hg", ok: true },
      { t: "300 mm Hg", ok: false },
      { t: "250 mm Hg", ok: false },
      { t: "150 mm Hg", ok: false },
    ],
    rationale: "The carotid bodies respond primarily to oxygen, and the greatest effect occurs when arterial PO2 is below 100 mm Hg. The impulse versus PO2 curve rises steeply only as PO2 drops well under 100 mm Hg.", // source: Ch 42 p 12
    scene: "pulmonary",
    sceneCfg: { label: "PO2 THRESHOLD FOR FIRING" },
    metadata: { topic: "Peripheral chemoreceptors", priority: "medium" },
  },

  {
    id: "pp2-w6r-017",
    type: "mcq",
    prompt: "Why do changes in arterial PCO2 affect respiration more strongly than equivalent changes in arterial pH?",
    setup: "",
    ans: [
      { t: "CO2 crosses the barrier readily", ok: true },
      { t: "Blood pH never truly changes", ok: false },
      { t: "H ions bypass the barrier fast", ok: false },
      { t: "CO2 binds receptors more tightly", ok: false },
    ],
    rationale: "Changes in arterial PCO2 have a greater effect on the control of respiration than changes in arterial pH because the blood brain barrier is far more permeable to carbon dioxide than to hydrogen ions. Carbon dioxide diffuses in and then generates hydrogen ions on the brain side.", // source: Ch 42 p 11
    scene: "pulmonary",
    sceneCfg: { label: "CO2 PERMEABILITY ADVANTAGE" },
    metadata: { topic: "CO2 versus pH", priority: "high" },
  },

  {
    id: "pp2-w6r-018",
    type: "mcq",
    prompt: "During hypoxia the increase in ventilation is partly self limited by which resulting change?",
    setup: "",
    ans: [
      { t: "A fall in arterial PCO2", ok: true },
      { t: "A rise in arterial PCO2", ok: false },
      { t: "A rise in arterial oxygen", ok: false },
      { t: "A fall in blood hydrogen", ok: false },
    ],
    rationale: "Ventilation increases during hypoxia, but this effect is limited by the resultant fall in PCO2 caused by the hyperventilation. The lowered carbon dioxide reduces the central drive, blunting the overall ventilatory response to low oxygen.", // source: Ch 42 p 14
    scene: "pulmonary",
    sceneCfg: { label: "HYPOXIA BLUNTED BY HYPOCAPNIA" },
    metadata: { topic: "Hypoxic drive", priority: "high" },
  },

  {
    id: "pp2-w6r-019",
    type: "mcq",
    prompt: "On the carbon dioxide response curves under different conditions, which condition shifts the curve farthest toward depressed ventilation?",
    setup: "",
    ans: [
      { t: "Anesthesia", ok: true },
      { t: "Metabolic acidosis", ok: false },
      { t: "Normal wakefulness", ok: false },
      { t: "Light sleep", ok: false },
    ],
    rationale: "Anesthesia produces the lowest and flattest ventilation response to carbon dioxide, below narcotics, sleep, and normal. Metabolic acidosis shifts the curve in the opposite direction toward greater ventilation.", // source: Ch 42 p 16
    scene: "pulmonary",
    sceneCfg: { label: "ANESTHESIA DEPRESSES RESPONSE" },
    metadata: { topic: "CO2 response curve", priority: "medium" },
  },

  {
    id: "pp2-w6r-020",
    type: "mcq",
    prompt: "In a patient with severe COPD and chronic carbon dioxide retention, why can giving high flow oxygen be hazardous?",
    setup: "",
    ans: [
      { t: "It removes the hypoxic drive", ok: true },
      { t: "It raises blood pH sharply", ok: false },
      { t: "It triggers airway spasm", ok: false },
      { t: "It floods the renal buffers", ok: false },
    ],
    rationale: "In severe lung disease and COPD with hypoxemia and hypercapnia, the respiratory drive becomes dependent on low oxygen because the response to chronically high carbon dioxide is blunted. Treating with oxygen removes that hypoxic stimulus and inhibits the respiratory drive.", // source: Ch 42 p 18
    scene: "pulmonary",
    sceneCfg: { label: "OXYGEN INHIBITS HYPOXIC DRIVE" },
    metadata: { topic: "CO2 retention", priority: "high" },
  },

  {
    id: "pp2-w6r-021",
    type: "mcq",
    prompt: "During moderate exercise, how do arterial PO2, PCO2, and pH typically behave relative to the rise in ventilation?",
    setup: "",
    ans: [
      { t: "They stay near normal levels", ok: true },
      { t: "PO2 falls and drives breathing", ok: false },
      { t: "PCO2 climbs and drives breathing", ok: false },
      { t: "Blood pH drops steeply early", ok: false },
    ],
    rationale: "During exercise ventilation rises linearly with oxygen consumption, yet arterial PO2, PCO2, and pH do not change in the correct direction to explain the increased ventilation. PCO2 may even decrease slightly, so the chemical values stay close to normal.", // source: Ch 42 p 19
    scene: "pulmonary",
    sceneCfg: { label: "EXERCISE GASES STAY NORMAL" },
    metadata: { topic: "Exercise respiration", priority: "high" },
  },

  {
    id: "pp2-w6r-022",
    type: "mcq",
    prompt: "What underlies the oscillating waxing and waning pattern of Cheyne Stokes breathing?",
    setup: "",
    ans: [
      { t: "Delayed brain sensing of PCO2", ok: true },
      { t: "Fixed airway obstruction", ok: false },
      { t: "Loss of all chemoreceptors", ok: false },
      { t: "Constant high oxygen levels", ok: false },
    ],
    rationale: "Cheyne Stokes breathing arises from a delay between the respiratory response and blood flow to the brain. PCO2 increases, but the brain is delayed in sensing the rise, so the respiratory center then momentarily overcompensates, producing cycles of deep and absent breathing.", // source: Ch 42 p 24
    scene: "pulmonary",
    sceneCfg: { label: "CHEYNE STOKES FEEDBACK DELAY" },
    metadata: { topic: "Cheyne Stokes", priority: "medium" },
  },

  {
    id: "pp2-w6i-001",
    type: "mcq",
    prompt: "Peak Expiratory Flow Rate (PEFR) is defined as the maximum expiratory flow rate measured during which interval of a forceful expiration from completely full lungs?",
    setup: "",
    ans: [
      { t: "First 100 to 120 milliseconds", ok: true },
      { t: "Final 100 to 120 milliseconds", ok: false },
      { t: "First 1.0 to 1.2 full seconds", ok: false },
      { t: "Middle half of the breath out", ok: false },
    ],
    rationale: "PEFR is defined as the maximum expiratory flow rate during the first 100 to 120 milliseconds of forceful expiration from completely full lungs. It is the early, peak portion of the maneuver, not the final or middle segment, and the window is measured in milliseconds rather than seconds.", // source: Ch 43 p 3
    scene: "pulmonary",
    sceneCfg: { label: "PEFR TIMING WINDOW" },
    metadata: { topic: "Peak expiratory flow rate", priority: "medium" },
  },

  {
    id: "pp2-w6i-002",
    type: "mcq",
    prompt: "Maximum Expiratory Flow Rate (MEFR) is best described as the greatest amount of flow achievable during forceful expiration from lungs that are:",
    setup: "",
    ans: [
      { t: "Filled to a given volume", ok: true },
      { t: "Emptied to residual volume", ok: false },
      { t: "Held at functional capacity", ok: false },
      { t: "Relaxed at resting volume", ok: false },
    ],
    rationale: "MEFR is the greatest amount of flow that can be achieved during forceful expiration from lungs filled to a given volume. The other options describe end-expiratory or resting states rather than the defined starting condition of being filled to a given volume.", // source: Ch 43 p 2
    scene: "pulmonary",
    sceneCfg: { label: "MEFR DEFINITION" },
    metadata: { topic: "Maximum expiratory flow rate", priority: "medium" },
  },

  {
    id: "pp2-w6i-003",
    type: "mcq",
    prompt: "pulmonary pathology divide into two main categories. Which pairing correctly matches each category to its core mechanism?",
    setup: "",
    ans: [
      { t: "Obstructive, more flow resistance", ok: true },
      { t: "Obstructive, less lung expansion", ok: false },
      { t: "Restrictive, more flow resistance", ok: false },
      { t: "Restrictive, faster airway flow", ok: false },
    ],
    rationale: "increased resistance belongs to flow to obstructive disease and decreased expansion of the lungs to restrictive disease. Pairing obstruction with reduced expansion, or restriction with increased resistance, reverses the defining mechanisms taught.", // source: Ch 43 p 4
    scene: "pulmonary",
    sceneCfg: { label: "PULMONARY DISEASE CATEGORIES" },
    metadata: { topic: "Obstructive versus restrictive", priority: "high" },
  },

  {
    id: "pp2-w6i-004",
    type: "mcq",
    prompt: "Obstructive diseases most often arise from problems with which part of the respiratory system?",
    setup: "",
    ans: [
      { t: "The conducting airways", ok: true },
      { t: "The chest wall muscles", ok: false },
      { t: "The pleural fluid layer", ok: false },
      { t: "The pulmonary arteries", ok: false },
    ],
    rationale: "Obstructive diseases are often due to issues with the conducting airways, especially the bronchioles. Chest wall, pleura, and pulmonary vasculature are not named as the typical source of obstruction.", // source: Ch 43 p 4
    scene: "pulmonary",
    sceneCfg: { label: "OBSTRUCTION AIRWAY SITE" },
    metadata: { topic: "Obstructive disease site", priority: "medium" },
  },

  {
    id: "pp2-w6i-005",
    type: "mcq",
    prompt: "Destruction of lung parenchyma can increase airway resistance. What normal action of the parenchyma is lost when it is destroyed?",
    setup: "",
    ans: [
      { t: "It pulls airway walls outward", ok: true },
      { t: "It pushes airway walls inward", ok: false },
      { t: "It seals the airway mucosa", ok: false },
      { t: "It warms the inspired air", ok: false },
    ],
    rationale: "Lung parenchyma normally pulls outward on the walls of adjacent airways, helping hold them open. When parenchyma is destroyed this outward traction is lost, so airways narrow and resistance rises. The other actions are not the mechanism described.", // source: Ch 43 p 5
    scene: "pulmonary",
    sceneCfg: { label: "PARENCHYMA AIRWAY TRACTION" },
    metadata: { topic: "Parenchymal traction", priority: "medium" },
  },

  {
    id: "pp2-w6i-006",
    type: "mcq",
    prompt: "Several factors increase airway resistance. Which of the following would LEAST increase resistance to airflow?",
    setup: "",
    ans: [
      { t: "Outward pull on airway walls", ok: true },
      { t: "Smooth muscle contraction", ok: false },
      { t: "Excessive airway secretions", ok: false },
      { t: "Hypertrophy of bronchial wall", ok: false },
    ],
    rationale: "Outward traction on airway walls keeps airways open and lowers resistance, so it does not increase resistance and is the correct exception. Lumen blockage by secretions, lumen narrowing from smooth muscle contraction, and bronchial wall hypertrophy as genuine resistance-raising factors.", // source: Ch 43 p 5
    scene: "pulmonary",
    sceneCfg: { label: "RESISTANCE FACTOR EXCEPTION" },
    metadata: { topic: "Airway resistance factors", priority: "high" },
  },

  {
    id: "pp2-w6i-007",
    type: "mcq",
    prompt: "On the maximum expiratory flow volume diagram, the curve for airway obstruction is shifted in which direction relative to the normal curve?",
    setup: "",
    ans: [
      { t: "Left, toward higher volumes", ok: true },
      { t: "Right, toward lower volumes", ok: false },
      { t: "Down, with no volume shift", ok: false },
      { t: "Up, toward greater flow rates", ok: false },
    ],
    rationale: "Airway obstruction shifting the flow volume curve to the left toward higher lung volumes, reflecting air trapping. The rightward, low-volume shift belongs to restrictive disease, and vertical-only shifts are not the actual change.", // source: Ch 43 p 6
    scene: "pulmonary",
    sceneCfg: { label: "OBSTRUCTION LOOP SHIFT" },
    metadata: { topic: "Flow volume loop obstruction", priority: "high" },
  },

  {
    id: "pp2-w6i-008",
    type: "mcq",
    prompt: "On the flow volume loop, restrictive lung disease shows which pattern?",
    setup: "",
    ans: [
      { t: "Rightward shift, lower volumes", ok: true },
      { t: "Leftward shift, higher volumes", ok: false },
      { t: "Rightward shift, higher volumes", ok: false },
      { t: "Leftward shift, normal volumes", ok: false },
    ],
    rationale: "The restrictive loop shifts to the right with volumes that are less than normal, because total lung capacity and residual volume are reduced. A leftward shift with higher volumes describes obstruction, not restriction.", // source: Ch 43 p 10
    scene: "pulmonary",
    sceneCfg: { label: "RESTRICTIVE LOOP SHIFT" },
    metadata: { topic: "Flow volume loop restriction", priority: "high" },
  },

  {
    id: "pp2-w6i-009",
    type: "mcq",
    prompt: "Guyton and Hall label the restrictive flow volume curve. Which legacy term do they use for restrictive lungs?",
    setup: "",
    ans: [
      { t: "Constricted lungs", ok: true },
      { t: "Obstructed lungs", ok: false },
      { t: "Fully collapsed lungs", ok: false },
      { t: "Congested lungs", ok: false },
    ],
    rationale: "Guyton and Hall use the older institutional term constricted lungs for what modern practice calls restrictive lung disease. Obstructed, collapsed, and congested are not the label applied to that rightward shifted curve.", // source: Ch 43 p 7
    scene: "pulmonary",
    sceneCfg: { label: "CONSTRICTED LUNGS LABEL" },
    metadata: { topic: "Guyton terminology", priority: "medium" },
  },

  {
    id: "pp2-w6i-010",
    type: "mcq",
    prompt: "In obstructive disease, a characteristic change in the spirometry ratio. Which statement is correct?",
    setup: "",
    ans: [
      { t: "FEV1 falls more than FVC", ok: true },
      { t: "FVC falls more than FEV1", ok: false },
      { t: "FEV1 and FVC fall equally", ok: false },
      { t: "FEV1 rises above the FVC", ok: false },
    ],
    rationale: "In obstruction FEV1 decreases more than FVC, which lowers the FEV1/FVC ratio. Proportional falls describe restriction, and FEV1 can never exceed FVC because it is a fraction of that same forced breath.", // source: Ch 43 p 10
    scene: "pulmonary",
    sceneCfg: { label: "OBSTRUCTION FEV1 DROP" },
    metadata: { topic: "Obstructive spirometry ratio", priority: "high" },
  },

  {
    id: "pp2-w6i-011",
    type: "mcq",
    prompt: "A normal FEV1/FVC percentage and an obstructed value. Which pairing of normal versus obstructed values is correct?",
    setup: "",
    ans: [
      { t: "80 percent then 47 percent", ok: true },
      { t: "47 percent then 80 percent", ok: false },
      { t: "80 percent then 12 percent", ok: false },
      { t: "60 percent then 47 percent", ok: false },
    ],
    rationale: "A normal FEV1/FVC of about 80 percent and an obstructed value of about 47 percent. The reversed pairing and the alternative numbers do not match the actual values, where the ratio falls from 80 to 47 percent with obstruction.", // source: Ch 43 p 11
    scene: "pulmonary",
    sceneCfg: { label: "NORMAL VERSUS OBSTRUCTED RATIO" },
    metadata: { topic: "FEV1 over FVC values", priority: "medium" },
  },

  {
    id: "pp2-w6i-012",
    type: "mcq",
    prompt: "Forced Expiratory Volume in one second (FEV1) measures the amount of air a person can force out:",
    setup: "",
    ans: [
      { t: "In one second after full breath in", ok: true },
      { t: "In total after a full breath in", ok: false },
      { t: "In one second after a normal breath", ok: false },
      { t: "In total after a normal breath out", ok: false },
    ],
    rationale: "FEV1 is defined as the total amount of air forced out in one second after a maximal inhalation. FVC, by contrast, is the total air forced out with no time limit; both maneuvers begin from a maximal inhalation rather than a normal breath.", // source: Ch 43 p 11
    scene: "pulmonary",
    sceneCfg: { label: "FEV1 ONE SECOND VOLUME" },
    metadata: { topic: "FEV1 definition", priority: "medium" },
  },

  {
    id: "pp2-w6i-013",
    type: "mcq",
    prompt: "COPD is defined as a group of disorders involving what kind of damage to lung tissue?",
    setup: "",
    ans: [
      { t: "Progressive, permanent damage", ok: true },
      { t: "Sudden, fully reversible damage", ok: false },
      { t: "Mild, self-resolving damage", ok: false },
      { t: "Brief, intermittent damage", ok: false },
    ],
    rationale: "COPD involves progressive, longterm, permanent damage to lung tissue that results in air being trapped during exhalation. Reversible, self-resolving, or intermittent damage contradicts the permanent nature emphasized for COPD.", // source: Ch 43 p 12
    scene: "pulmonary",
    sceneCfg: { label: "COPD PERMANENT DAMAGE" },
    metadata: { topic: "COPD definition", priority: "high" },
  },

  {
    id: "pp2-w6i-014",
    type: "mcq",
    prompt: "What is the most common cause of chronic bronchitis?",
    setup: "",
    ans: [
      { t: "Smoking", ok: true },
      { t: "Allergens", ok: false },
      { t: "Bacteria", ok: false },
      { t: "Asbestos", ok: false },
    ],
    rationale: "Smoking is the most common cause of chronic bronchitis, although other irritants can cause it too. Allergens, bacteria, and asbestos are not named as the leading cause of chronic bronchitis.", // source: Ch 43 p 13
    scene: "pulmonary",
    sceneCfg: { label: "CHRONIC BRONCHITIS CAUSE" },
    metadata: { topic: "Chronic bronchitis cause", priority: "medium" },
  },

  {
    id: "pp2-w6i-015",
    type: "mcq",
    prompt: "Emphysema as the permanent destruction of which structural component of the alveoli?",
    setup: "",
    ans: [
      { t: "Elastic connective tissue", ok: true },
      { t: "Mucus producing gland cells", ok: false },
      { t: "The airway smooth muscle", ok: false },
      { t: "Pleural lining membrane", ok: false },
    ],
    rationale: "emphysema is defined as permanent destruction of the elastic connective tissue in the alveoli, which prevents the alveoli from adequately pushing air out during exhalation. Mucus glands, smooth muscle, and pleura are not the tissue destroyed in emphysema.", // source: Ch 43 p 12
    scene: "pulmonary",
    sceneCfg: { label: "EMPHYSEMA ELASTIC TISSUE" },
    metadata: { topic: "Emphysema pathology", priority: "high" },
  },

  {
    id: "pp2-w6i-016",
    type: "mcq",
    prompt: "Consequences of emphysema. Which of the following is NOT listed and would therefore be the exception?",
    setup: "",
    ans: [
      { t: "Increased diffusing capacity", ok: true },
      { t: "High airway resistance", ok: false },
      { t: "Decreased diffusing capacity", ok: false },
      { t: "Pulmonary hypertension", ok: false },
    ],
    rationale: "Emphysema reduces surface area and capillary networks, so diffusing capacity decreases rather than increases; the increased option is the false exception. High airway resistance, decreased diffusing capacity, and pulmonary hypertension from loss of pulmonary capillary networks as real consequences.", // source: Ch 43 p 14
    scene: "pulmonary",
    sceneCfg: { label: "EMPHYSEMA CONSEQUENCE EXCEPTION" },
    metadata: { topic: "Emphysema consequences", priority: "high" },
  },

  {
    id: "pp2-w6i-017",
    type: "mcq",
    prompt: "Pulmonary hypertension in emphysema develops because of the loss of large areas of which structures?",
    setup: "",
    ans: [
      { t: "Pulmonary capillary networks", ok: true },
      { t: "The conducting bronchiole walls", ok: false },
      { t: "Alveolar surfactant layers", ok: false },
      { t: "Pleural connective sheets", ok: false },
    ],
    rationale: "pulmonary hypertension in emphysema are attributed to the loss of large areas of pulmonary capillary networks. Losing capillary beds raises pulmonary vascular resistance and pressure; bronchiole walls, surfactant, and pleura are not the cause given.", // source: Ch 43 p 14
    scene: "pulmonary",
    sceneCfg: { label: "CAPILLARY LOSS HYPERTENSION" },
    metadata: { topic: "Emphysema pulmonary hypertension", priority: "medium" },
  },

  {
    id: "pp2-w6i-018",
    type: "mcq",
    prompt: "Asthma as an obstructive disorder with which key feature distinguishing it from COPD?",
    setup: "",
    ans: [
      { t: "Reversible airway narrowing", ok: true },
      { t: "Permanent fixed airway narrowing", ok: false },
      { t: "Fixed alveolar destruction", ok: false },
      { t: "Constant pleural scarring", ok: false },
    ],
    rationale: "asthma is defined as an obstructive disorder with reversible narrowing of the bronchial airways and label it Reversible. COPD by contrast features permanent damage; fixed alveolar destruction and pleural scarring are not the defining asthma feature.", // source: Ch 43 p 18
    scene: "pulmonary",
    sceneCfg: { label: "ASTHMA REVERSIBLE NARROWING" },
    metadata: { topic: "Asthma reversibility", priority: "high" },
  },

  {
    id: "pp2-w6i-019",
    type: "mcq",
    prompt: "inflammatory chemicals released during asthma from exposure to an allergen or irritant. Which pair is listed?",
    setup: "",
    ans: [
      { t: "Histamine and leukotrienes", ok: true },
      { t: "Surfactant and leukotrienes", ok: false },
      { t: "Histamine and erythropoietin", ok: false },
      { t: "Adenosine and bradykinin", ok: false },
    ],
    rationale: "Asthma results in the release of inflammatory chemicals such as histamine and leukotrienes. Surfactant and erythropoietin are not inflammatory mediators of asthma, and the adenosine bradykinin pair is not named.", // source: Ch 43 p 18
    scene: "pulmonary",
    sceneCfg: { label: "ASTHMA INFLAMMATORY MEDIATORS" },
    metadata: { topic: "Asthma mediators", priority: "medium" },
  },

  {
    id: "pp2-w6i-020",
    type: "mcq",
    prompt: "The gold standard spirometry threshold that confirms an asthma diagnosis after a fast acting bronchodilator. Which improvement in FEV1 confirms it?",
    setup: "",
    ans: [
      { t: "Over 12 percent and 200 mL", ok: true },
      { t: "Over 20 percent and 100 mL", ok: false },
      { t: "Over 12 percent and 400 mL", ok: false },
      { t: "Over 8 percent and 200 mL", ok: false },
    ],
    rationale: "Improvement in FEV1 by more than 12 percent AND 200 mL after a bronchodilator inhaler confirms the diagnosis of asthma. Both criteria must be met; the alternative percentages and volumes do not match the threshold.", // source: Ch 43 p 19
    scene: "pulmonary",
    sceneCfg: { label: "ASTHMA BRONCHODILATOR RESPONSE" },
    metadata: { topic: "Asthma diagnosis threshold", priority: "high" },
  },

  {
    id: "pp2-w6i-021",
    type: "mcq",
    prompt: "where fluid accumulates in pneumonia versus where collapse and scarring occur. In pneumonia, fluid and pus accumulate primarily:",
    setup: "",
    ans: [
      { t: "Within the alveoli", ok: true },
      { t: "Within the pleural sac", ok: false },
      { t: "Within the bronchi only", ok: false },
      { t: "Within the capillary bed", ok: false },
    ],
    rationale: "pneumonia is defined as an acute infection resulting in inflammation and the accumulation of fluid or pus within the alveoli. The pleural sac, bronchi, and capillary bed are not where pneumonia fluid accumulates.", // source: Ch 43 p 25
    scene: "pulmonary",
    sceneCfg: { label: "PNEUMONIA ALVEOLAR FLUID" },
    metadata: { topic: "Pneumonia pathology", priority: "high" },
  },

  {
    id: "pp2-w6i-022",
    type: "mcq",
    prompt: "On the hypoxia classification, which mechanism is listed under inadequate usage of oxygen by the tissue rather than under inadequate oxygenation of blood?",
    setup: "",
    ans: [
      { t: "Cyanide poisoning", ok: true },
      { t: "Low atmospheric oxygen", ok: false },
      { t: "Diffusion abnormalities", ok: false },
      { t: "Neuromuscular disorder", ok: false },
    ],
    rationale: "Cyanide and vitamin deficiencies under inadequate usage of oxygen by the tissue, because the tissue cannot use the oxygen delivered. Low atmospheric oxygen, diffusion abnormalities, and neuromuscular disorders fall under inadequate oxygenation of blood in the lungs.", // source: Ch 43 p 29
    scene: "pulmonary",
    sceneCfg: { label: "TISSUE OXYGEN USE FAILURE" },
    metadata: { topic: "Causes of hypoxia", priority: "high" },
  },

  /* coverage gap-fill (Ch 38 to 43) */

  {
    id: "pp2-w6r-023",
    type: "mcq",
    prompt: "On the integrated diagram of neural respiratory control, which group of inputs converges on the central respiratory cycle alongside the chemoreceptors and higher centers?",
    setup: "",
    ans: [
      { t: "Reflexes from lungs and airways", ok: true },
      { t: "Signals from the renal cortex", ok: false },
      { t: "Output from the spinal reflex arc", ok: false },
      { t: "Drive from the hepatic plexus", ok: false },
    ],
    rationale: "Three input streams feeding the cycle of inspiration and expiration: influences from higher centers, arterial and central chemoreceptors, and reflexes from the lungs, airways, cardiovascular system, muscles and joints, and skin. The renal cortex, a spinal reflex arc, and a hepatic plexus are not respiratory inputs.", // source: Ch 42 p 2
    scene: "pulmonary",
    sceneCfg: { label: "NEURAL INPUTS" },
    metadata: { topic: "Neural integration", priority: "medium" },
  },

  {
    id: "pp2-w6r-024",
    type: "mcq",
    prompt: "An unopposed center in the lower pons would drive prolonged inspiratory gasps; it with a question mark and shows it inhibited by the pneumotaxic center. Which center is this?",
    setup: "",
    ans: [
      { t: "Apneustic center", ok: true },
      { t: "Dorsal group", ok: false },
      { t: "Cardioinhibitory center", ok: false },
      { t: "Vasomotor center", ok: false },
    ],
    rationale: "The apneustic center in the pons with a question mark and an arrow showing the pneumotaxic center inhibits it. If unopposed it tends to produce apneustic breathing, sustained inspiratory effort. The dorsal group sets normal rhythm, while the cardioinhibitory and vasomotor centers are cardiovascular, not respiratory.", // source: Ch 42 p 3
    scene: "pulmonary",
    sceneCfg: { label: "APNEUSTIC" },
    metadata: { topic: "Apneustic center", priority: "high" },
  },

  {
    id: "pp2-w6r-025",
    type: "mcq",
    prompt: "Afferent signals are carried into the dorsal respiratory group mainly by which pair of cranial nerves?",
    setup: "",
    ans: [
      { t: "Vagus and glossopharyngeal", ok: true },
      { t: "Phrenic and intercostal pair", ok: false },
      { t: "Trigeminal and facial", ok: false },
      { t: "Hypoglossal and spinal", ok: false },
    ],
    rationale: "The vagus and glossopharyngeal nerves entering the dorsal respiratory group, carrying sensory input from lung receptors and peripheral chemoreceptors. The phrenic and intercostal nerves are motor outputs to breathing muscles, not the labeled afferents, and the other pairs are unrelated.", // source: Ch 42 p 3
    scene: "pulmonary",
    sceneCfg: { label: "CN AFFERENTS" },
    metadata: { topic: "Cranial nerve afferents", priority: "high" },
  },

  {
    id: "pp2-w6r-026",
    type: "mcq",
    prompt: "When more rapid lung filling is needed, how does the dorsal respiratory group change the inspiratory ramp signal?",
    setup: "",
    ans: [
      { t: "It makes the ramp steeper", ok: true },
      { t: "It flattens the ramp fully", ok: false },
      { t: "It inverts the ramp slope", ok: false },
      { t: "It removes the ramp signal", ok: false },
    ],
    rationale: "The ramp becomes steeper when more rapid lung filling is needed, so inspiration is faster and deeper. Flattening, inverting, or removing the ramp would slow or abolish inspiration rather than speed filling.", // source: Ch 42 p 4
    scene: "pulmonary",
    sceneCfg: { label: "RAMP SLOPE" },
    metadata: { topic: "Ramp slope control", priority: "medium" },
  },

  {
    id: "pp2-w6r-027",
    type: "mcq",
    prompt: "Where are the airway irritant receptors chiefly located according to the lung receptors?",
    setup: "",
    ans: [
      { t: "Nasal mucosa and upper airways", ok: true },
      { t: "Aortic arch wall only", ok: false },
      { t: "The carotid sinus adventitia layer", ok: false },
      { t: "Pulmonary venous lining", ok: false },
    ],
    rationale: "Irritant receptors in the nasal mucosa and upper airways, and possibly the alveoli. The aortic arch and carotid sinus house baroreceptors and chemoreceptors, and the pulmonary venous lining is not a listed site.", // source: Ch 42 p 7
    scene: "pulmonary",
    sceneCfg: { label: "IRRITANT SITE" },
    metadata: { topic: "Irritant receptors", priority: "medium" },
  },

  {
    id: "pp2-w6r-028",
    type: "mcq",
    prompt: "Stimulation of pulmonary J receptors by congestion or edema produces which breathing pattern?",
    setup: "",
    ans: [
      { t: "Rapid shallow breathing", ok: true },
      { t: "Slow deep breathing", ok: false },
      { t: "Prolonged breath holding", ok: false },
      { t: "Sustained forced exhaling", ok: false },
    ],
    rationale: "J receptors in the capillary wall and interstitium are stimulated by lung disease and edema and drive rapid shallow breathing, that is tachypnea. Slow deep breathing, breath holding, and sustained forced exhalation are not the J receptor response.", // source: Ch 42 p 7
    scene: "pulmonary",
    sceneCfg: { label: "J RECEPTOR" },
    metadata: { topic: "J receptors", priority: "medium" },
  },

  {
    id: "pp2-w6r-029",
    type: "mcq",
    prompt: "Stimulation of the arterial chemoreceptors produces which combination of systemic effects?",
    setup: "",
    ans: [
      { t: "Hyperpnea and higher pressure", ok: true },
      { t: "Apnea and lower pressure", ok: false },
      { t: "Brief apnea and bronchodilation", ok: false },
      { t: "Slow rate and lower pressure", ok: false },
    ],
    rationale: "The other reflexes include hyperpnea and increased blood pressure as the response to arterial chemoreceptor stimulation. Apnea with bronchodilation is instead the arterial baroreceptor response to elevated pressure, so the distractors mix or reverse these reflexes.", // source: Ch 42 p 8
    scene: "pulmonary",
    sceneCfg: { label: "ARTERIAL CHEMO" },
    metadata: { topic: "Arterial chemoreflex", priority: "high" },
  },

  {
    id: "pp2-w6r-030",
    type: "mcq",
    prompt: "Receptors in skeletal muscles, joints, and tendons contribute to respiratory control mainly by doing what?",
    setup: "",
    ans: [
      { t: "Adjusting ventilation to workload", ok: true },
      { t: "Setting the resting arterial blood pH", ok: false },
      { t: "Fixing the apneic threshold", ok: false },
      { t: "Sensing the arterial oxygen", ok: false },
    ],
    rationale: "Receptors in the muscles of respiration and in skeletal muscles, joints, and tendons adjust ventilation to elevated workloads, a key proprioceptive contributor to exercise hyperpnea. They do not set resting pH, define the apneic threshold, or sense arterial oxygen.", // source: Ch 42 p 8
    scene: "pulmonary",
    sceneCfg: { label: "PROPRIOCEPTORS" },
    metadata: { topic: "Proprioceptor reflex", priority: "medium" },
  },

  {
    id: "pp2-w6r-031",
    type: "mcq",
    prompt: "In the carotid body glomus cell, a fall in arterial PO2 triggers the transduction cascade by first doing what to membrane channels?",
    setup: "",
    ans: [
      { t: "Closing potassium channels", ok: true },
      { t: "Opening potassium channels", ok: false },
      { t: "Closing calcium channels", ok: false },
      { t: "Blocking sodium channels", ok: false },
    ],
    rationale: "Low PO2 closing potassium channels in the glomus cell, which depolarizes the membrane, opens voltage gated calcium channels, raises intracellular calcium, and releases ATP and acetylcholine onto the afferent fiber. Opening potassium channels would hyperpolarize and silence the cell, and the other options are not the initiating step.", // source: Ch 42 p 13
    scene: "pulmonary",
    sceneCfg: { label: "GLOMUS CELL" },
    metadata: { topic: "Glomus cell mechanism", priority: "high" },
  },

  {
    id: "pp2-w6r-032",
    type: "mcq",
    prompt: "On the composite curves , how does lowering the PO2 change the ventilatory response to a given PCO2?",
    setup: "",
    ans: [
      { t: "It steepens the CO2 response", ok: true },
      { t: "It abolishes the CO2 response", ok: false },
      { t: "It flattens the CO2 response", ok: false },
      { t: "It reverses the CO2 response", ok: false },
    ],
    rationale: "the composite curves shows that at lower PO2 and lower pH the carbon dioxide response curve becomes steeper and is shifted, so each rise in PCO2 produces a larger ventilation increase. Low PO2 potentiates rather than abolishes, flattens, or reverses the CO2 response.", // source: Ch 42 p 15
    scene: "pulmonary",
    sceneCfg: { label: "GAS INTERACTION" },
    metadata: { topic: "Interrelated gases", priority: "high" },
  },

  {
    id: "pp2-w6r-033",
    type: "mcq",
    prompt: "How does metabolic acidosis shift the carbon dioxide response curve compared with the normal curve?",
    setup: "",
    ans: [
      { t: "Toward higher ventilation", ok: true },
      { t: "Toward lower ventilation", ok: false },
      { t: "Toward a flatter slope", ok: false },
      { t: "Toward no measurable shift", ok: false },
    ],
    rationale: "In these conditions the metabolic acidosis line sits up and to the left of normal, meaning ventilation is greater at any given PCO2 as the body blows off carbon dioxide to compensate. Sleep, narcotics, and anesthesia move the curve the opposite way toward lower ventilation.", // source: Ch 42 p 16
    scene: "pulmonary",
    sceneCfg: { label: "METAB ACIDOSIS" },
    metadata: { topic: "CO2 response conditions", priority: "high" },
  },

  {
    id: "pp2-w6r-034",
    type: "mcq",
    prompt: "Exercise and resting curves; at a normal arterial PCO2 of 40 mmHg, ventilation during exercise is best described as which of the following relative to rest?",
    setup: "",
    ans: [
      { t: "Far higher than at rest", ok: true },
      { t: "Slightly below resting", ok: false },
      { t: "About equal to resting value", ok: false },
      { t: "Near zero ventilation", ok: false },
    ],
    rationale: "The exercise curve is reset far above the resting curve, so at the normal PCO2 of 40 mmHg alveolar ventilation is roughly 120 L per min during exercise versus only a few L per min at rest. Ventilation is therefore far higher, not lower, equal, or near zero.", // source: Ch 42 p 21
    scene: "pulmonary",
    sceneCfg: { label: "EXERCISE SHIFT" },
    metadata: { topic: "Exercise curve shift", priority: "high" },
  },

  {
    id: "pp2-w6r-035",
    type: "mcq",
    prompt: "Because arterial blood gases stay near normal during exercise, which factor is proposed to drive the rise in ventilation?",
    setup: "",
    ans: [
      { t: "Overflow of cortical signals", ok: true },
      { t: "A large rise in PCO2", ok: false },
      { t: "A steep fall in the arterial pH", ok: false },
      { t: "A drop in core temperature", ok: false },
    ],
    rationale: "Overflow of signals from the cortex, body movements, increased body temperature, and a partially learned response as drivers, since blood gases do not change in a direction that would raise ventilation. A large PCO2 rise or steep pH fall does not occur, and core temperature rises rather than drops.", // source: Ch 42 p 22
    scene: "pulmonary",
    sceneCfg: { label: "EXERCISE DRIVE" },
    metadata: { topic: "Exercise drivers", priority: "high" },
  },

  {
    id: "pp2-w6r-036",
    type: "mcq",
    prompt: "Which statement about voluntary control of breathing, listed among other factors influencing respiration, is correct?",
    setup: "",
    ans: [
      { t: "It overrides breathing briefly", ok: true },
      { t: "It permanently halts breathing", ok: false },
      { t: "It replaces chemical control", ok: false },
      { t: "It only affects expiration", ok: false },
    ],
    rationale: "Voluntary control lets higher centers consciously override automatic breathing for a limited time, as in breath holding, before chemical drive forces resumption. It cannot stop breathing permanently, does not replace chemical control, and influences both phases of the breath.", // source: Ch 42 p 23
    scene: "pulmonary",
    sceneCfg: { label: "VOLUNTARY" },
    metadata: { topic: "Voluntary control", priority: "medium" },
  },

  {
    id: "pp2-w6r-037",
    type: "mcq",
    prompt: "By which two mechanisms does increased body temperature stimulate respiration, as listed on the other factors?",
    setup: "",
    ans: [
      { t: "More CO2 and a direct effect", ok: true },
      { t: "Less CO2 and renal cooling", ok: false },
      { t: "More oxygen and a baroreflex", ok: false },
      { t: "Less oxygen and a gut reflex", ok: false },
    ],
    rationale: "Two routes: increased carbon dioxide production from a higher metabolic rate, and a direct effect of warmth on the respiratory center. Lower carbon dioxide, renal cooling, oxygen changes, and gut reflexes are not the listed mechanisms.", // source: Ch 42 p 23
    scene: "pulmonary",
    sceneCfg: { label: "BODY TEMP" },
    metadata: { topic: "Body temperature", priority: "medium" },
  },

  {
    id: "pp2-w6r-038",
    type: "mcq",
    prompt: "Which central nervous structure, primarily cardiovascular, is listed as also influencing respiration on the other factors?",
    setup: "",
    ans: [
      { t: "Vasomotor center", ok: true },
      { t: "Hypothalamic nuclei", ok: false },
      { t: "Basal ganglia bodies", ok: false },
      { t: "Cerebellar vermis lobe", ok: false },
    ],
    rationale: "Activity from the vasomotor center as a factor influencing respiration, reflecting shared brainstem circuitry that links cardiovascular and respiratory control. The hypothalamic nuclei, basal ganglia, and cerebellar vermis are not the listed structure.", // source: Ch 42 p 23
    scene: "pulmonary",
    sceneCfg: { label: "VASOMOTOR" },
    metadata: { topic: "Vasomotor influence", priority: "medium" },
  },

  {
    id: "pp2-w6i-023",
    type: "mcq",
    prompt: "On the maximum expiratory flow curve, the lung volume axis runs between which two endpoints?",
    setup: "",
    ans: [
      { t: "Total lung capacity to residual volume", ok: true },
      { t: "Tidal volume up to the full vital capacity", ok: false },
      { t: "Vital capacity to the functional residual", ok: false },
      { t: "Tidal volume to the inspiratory reserve", ok: false },
    ],
    rationale: "Expiratory airflow against lung volume, with flow rising sharply from total lung capacity on the left and falling to zero at residual volume on the right, so the curve spans from total lung capacity down to residual volume.", // source: Ch 43 p 2
    scene: "pulmonary",
    sceneCfg: { label: "MEFR CURVE AXES" },
    metadata: { topic: "Maximum expiratory flow curve", priority: "medium" },
  },

  {
    id: "pp2-w6i-024",
    type: "mcq",
    prompt: "Obstructive and restrictive disease can coexist in one patient. Which statement about this is correct?",
    setup: "",
    ans: [
      { t: "A single person can have both at once", ok: true },
      { t: "The two categories can never coexist", ok: false },
      { t: "Obstruction must always precede restriction", ok: false },
      { t: "Restriction always blocks any obstruction", ok: false },
    ],
    rationale: "After defining obstructive and restrictive disease, someone can have both at the same time, so the categories are not mutually exclusive and frequently overlap in clinical practice.", // source: Ch 43 p 4
    scene: "pulmonary",
    sceneCfg: { label: "BOTH AT ONCE" },
    metadata: { topic: "Coexisting obstructive and restrictive disease", priority: "medium" },
  },

  {
    id: "pp2-w6i-025",
    type: "mcq",
    prompt: "Causes of increased airway resistance divide into blocked-lumen and narrowed-lumen groups. Which factor reflects a blocked rather than a narrowed lumen?",
    setup: "",
    ans: [
      { t: "Aspirated material in the lumen", ok: true },
      { t: "Airway smooth muscle contracting", ok: false },
      { t: "Bronchial wall growing thicker", ok: false },
      { t: "Loss of outward wall traction", ok: false },
    ],
    rationale: "Excessive secretions and obstruction due to aspiration under the lumen being blocked, while smooth muscle contraction and bronchial wall hypertrophy are listed under the lumen being narrowed; lost parenchymal traction is a separate outside-the-airway mechanism.", // source: Ch 43 p 5
    scene: "pulmonary",
    sceneCfg: { label: "BLOCKED LUMEN" },
    metadata: { topic: "Blocked versus narrowed lumen", priority: "medium" },
  },

  {
    id: "pp2-w6i-026",
    type: "mcq",
    prompt: "On the flow volume loop, how are the obstruction and restriction curves shifted relative to the normal curve?",
    setup: "",
    ans: [
      { t: "Obstruction left, restriction right", ok: true },
      { t: "Obstruction right, restriction left", ok: false },
      { t: "Both shift to the far left", ok: false },
      { t: "Both shift to the far right", ok: false },
    ],
    rationale: "The volume axis runs from high volume on the left to low volume on the right, so the airway obstruction curve sits at higher trapped volumes on the left while the restrictive or constricted curve sits at smaller volumes on the right.", // source: Ch 43 p 6
    scene: "pulmonary",
    sceneCfg: { label: "SHIFTS" },
    metadata: { topic: "Figure 43-2 curve shifts", priority: "high" },
  },

  {
    id: "pp2-w6i-027",
    type: "mcq",
    prompt: "Which pairing correctly defines FVC and FEV1?",
    setup: "",
    ans: [
      { t: "FVC all forced air, FEV1 first second", ok: true },
      { t: "FVC the first second, FEV1 all the air", ok: false },
      { t: "FVC the tidal air, FEV1 reserve air", ok: false },
      { t: "FVC residual air, FEV1 the tidal air", ok: false },
    ],
    rationale: "Forced vital capacity as the total air a person can force out after a maximal inhalation and forced expiratory volume in one second as the air forced out in the first second after a maximal inhalation, so FEV1 is a one second subset of the total FVC.", // source: Ch 43 p 11
    scene: "pulmonary",
    sceneCfg: { label: "FVC AND FEV1" },
    metadata: { topic: "FVC and FEV1 definitions", priority: "medium" },
  },

  {
    id: "pp2-w6i-028",
    type: "mcq",
    prompt: "Which description of the lung damage and its effect in COPD is correct?",
    setup: "",
    ans: [
      { t: "Permanent damage trapping air on exhale", ok: true },
      { t: "Reversible airway spasm clearing on exhale", ok: false },
      { t: "Sudden injury emptying the air on exhale", ok: false },
      { t: "Brief wall swelling trapping air on inhale", ok: false },
    ],
    rationale: "COPD as a group of disorders involving progressive, longterm, permanent damage to lung tissue that results in air being trapped in the lungs during exhalation, which distinguishes it from the reversible obstruction of asthma.", // source: Ch 43 p 12
    scene: "pulmonary",
    sceneCfg: { label: "COPD DEFINED" },
    metadata: { topic: "COPD definition", priority: "high" },
  },

  {
    id: "pp2-w6i-029",
    type: "mcq",
    prompt: "As parenchyma is lost in emphysema, which change occurs in the alveolar architecture?",
    setup: "",
    ans: [
      { t: "Alveoli merge into few large pockets", ok: true },
      { t: "Alveoli split into many tiny new sacs", ok: false },
      { t: "Alveoli fill with thick collagen bands", ok: false },
      { t: "Alveoli flood with fluid and thick pus", ok: false },
    ],
    rationale: "Figures 43-4 and 43-5 show emphysematous tissue in which many small alveoli merge into fewer large pockets of air, reducing surface area; collagen deposition typifies fibrosis and fluid filling typifies pneumonia, not emphysema.", // source: Ch 43 p 15
    scene: "pulmonary",
    sceneCfg: { label: "CONFLUENT ALVEOLI" },
    metadata: { topic: "Emphysema confluent alveoli", priority: "medium" },
  },

  {
    id: "pp2-w6i-030",
    type: "mcq",
    prompt: "Compared with a normal adult thorax, what change defines a barrel chest?",
    setup: "",
    ans: [
      { t: "Larger front to back chest diameter", ok: true },
      { t: "Smaller front to back chest diameter", ok: false },
      { t: "Sideways collapse of the rib cage", ok: false },
      { t: "Sharp forward bending of the spine", ok: false },
    ],
    rationale: "The barrel chest as an increased anteroposterior, front to back, diameter of the thorax from chronic air trapping and hyperinflation; forward spinal bending describes kyphosis, a different finding.", // source: Ch 43 p 17
    scene: "pulmonary",
    sceneCfg: { label: "BARREL CHEST" },
    metadata: { topic: "Barrel chest", priority: "medium" },
  },

  {
    id: "pp2-w6i-031",
    type: "mcq",
    prompt: "Which trio gives the three main physiological features of an asthma attack?",
    setup: "",
    ans: [
      { t: "Muscle spasm, wall swelling, mucus plug", ok: true },
      { t: "Alveolar loss, scarring, capillary loss", ok: false },
      { t: "Collagen deposits, granulomas, fibrosis", ok: false },
      { t: "Fluid filling, pus, alveolar edema", ok: false },
    ],
    rationale: "Bronchial smooth muscle contraction, bronchial soft tissue swelling, and mucus overproduction with plugging as the three features; alveolar destruction, collagen, and fluid filling belong to emphysema, fibrosis, and pneumonia respectively.", // source: Ch 43 p 18
    scene: "pulmonary",
    sceneCfg: { label: "ASTHMA FEATURES" },
    metadata: { topic: "Three features of asthma", priority: "high" },
  },

  {
    id: "pp2-w6i-032",
    type: "mcq",
    prompt: "Which set of symptoms occurs in an asthma attack?",
    setup: "",
    ans: [
      { t: "Wheeze, cough, and chest tightness", ok: true },
      { t: "Productive cough, fever, and chills", ok: false },
      { t: "Sharp pleuritic pain and hemoptysis", ok: false },
      { t: "Painless gradual weight loss only", ok: false },
    ],
    rationale: "Shortness of breath, wheeze, cough, and tightness in the chest as asthma symptoms; fever and chills with a productive cough point to pneumonia, and pleuritic pain points to pneumothorax.", // source: Ch 43 p 18
    scene: "pulmonary",
    sceneCfg: { label: "ASTHMA SYMPTOMS" },
    metadata: { topic: "Asthma symptoms and irritants", priority: "medium" },
  },

  {
    id: "pp2-w6i-033",
    type: "mcq",
    prompt: "In restrictive disease, how do the spirometry values behave? Which finding is correct?",
    setup: "",
    ans: [
      { t: "Low volumes but a normal ratio", ok: true },
      { t: "High volumes with a low ratio kept", ok: false },
      { t: "Low volumes with a low ratio too", ok: false },
      { t: "High volumes with a high ratio kept", ok: false },
    ],
    rationale: "Restrictive disease reduces total lung capacity and vital capacity but may still show normal resistance and a normal FEV1/FVC ratio, because FEV1 and FVC fall together; a low ratio with high volumes signals obstruction instead.", // source: Ch 43 p 20
    scene: "pulmonary",
    sceneCfg: { label: "RESTRICTIVE VOLUMES" },
    metadata: { topic: "Restrictive ratio and volumes", priority: "high" },
  },

  {
    id: "pp2-w6i-034",
    type: "mcq",
    prompt: "Restrictive disease causes divide into intrinsic and extrinsic. Which example is extrinsic?",
    setup: "",
    ans: [
      { t: "Kyphosis and scoliosis posture", ok: true },
      { t: "Diffuse interstitial fibrosis", ok: false },
      { t: "Sarcoidosis granuloma disease", ok: false },
      { t: "Asbestosis and silicosis dusts", ok: false },
    ],
    rationale: "Kyphosis, scoliosis, obesity hypoventilation, and neuromuscular disease as extrinsic restrictive causes acting outside the lung, while fibrosis, sarcoidosis, and asbestosis or silicosis are intrinsic lung tissue diseases.", // source: Ch 43 p 21
    scene: "pulmonary",
    sceneCfg: { label: "EXTRINSIC RESTRICTIVE" },
    metadata: { topic: "Extrinsic restrictive causes", priority: "high" },
  },

  {
    id: "pp2-w6i-035",
    type: "mcq",
    prompt: "Which set of mechanisms causes atelectasis?",
    setup: "",
    ans: [
      { t: "Low breathing, squeeze, block, stick", ok: true },
      { t: "Collagen, granulomas, scar, swelling", ok: false },
      { t: "Histamine, leukotrienes, edema, spasm", ok: false },
      { t: "Anemia, shunt, cyanide, thin oxygen", ok: false },
    ],
    rationale: "The atelectasis diagram lists hypoventilation, external compression, airway obstruction, and adhesions or lack of surfactant as causes of alveolar collapse; the other sets describe fibrosis, asthma mediators, and hypoxia causes.", // source: Ch 43 p 23
    scene: "pulmonary",
    sceneCfg: { label: "ATELECTASIS CAUSES" },
    metadata: { topic: "Causes of atelectasis", priority: "high" },
  },

  {
    id: "pp2-w6i-036",
    type: "mcq",
    prompt: "Which pairing gives the definition and most common cause of pneumonia?",
    setup: "",
    ans: [
      { t: "Fluid in alveoli, often Streptococcus", ok: true },
      { t: "Fluid around alveoli, often from a virus", ok: false },
      { t: "Loss of alveoli, often from smoking years", ok: false },
      { t: "Air in the pleura, often from chest trauma", ok: false },
    ],
    rationale: "Pneumonia as acute infection with inflammation and accumulation of fluid or pus within the alveoli, and names Streptococcus pneumoniae as the most common cause; loss of alveoli describes emphysema and pleural air describes pneumothorax.", // source: Ch 43 p 25
    scene: "pulmonary",
    sceneCfg: { label: "PNEUMONIA DEFINED" },
    metadata: { topic: "Pneumonia definition and cause", priority: "high" },
  },

  {
    id: "pp2-w6i-037",
    type: "mcq",
    prompt: "Comparing Figures 43-6 and 43-7, why does pneumonia lower arterial saturation much more than atelectasis?",
    setup: "",
    ans: [
      { t: "Blood still flows past flooded alveoli", ok: true },
      { t: "Blood flow halts within the bad lung", ok: false },
      { t: "Both lungs collapse together all at once", ok: false },
      { t: "The hemoglobin molecule itself turns bad", ok: false },
    ],
    rationale: "In pneumonia blood continues to flow past fluid filled unventilated alveoli and leaves poorly oxygenated, dropping mean saturation to 78%; in atelectasis blood is diverted away from the collapsed lung, so saturation falls only slightly to about 91%.", // source: Ch 43 p 27
    scene: "pulmonary",
    sceneCfg: { label: "PNEUMONIA SHUNT" },
    metadata: { topic: "Pneumonia versus atelectasis perfusion", priority: "high" },
  },

  {
    id: "pp2-w6i-038",
    type: "mcq",
    prompt: "For the microscopic histology of pneumonia versus emphysema, which pairing of changes is correct?",
    setup: "",
    ans: [
      { t: "Pneumonia fluid fills, emphysema loses alveoli", ok: true },
      { t: "Pneumonia loses alveoli, emphysema fluid fills", ok: false },
      { t: "Both show dense collagen scarring of walls", ok: false },
      { t: "Both show confluent enlarged air sacs", ok: false },
    ],
    rationale: "Normal tissue, pneumonia with inflammation and fluid filling the alveoli, and emphysema with loss of alveoli and confluent air spaces; the two processes are opposite, one filling and one destroying the alveoli.", // source: Ch 43 p 28
    scene: "pulmonary",
    sceneCfg: { label: "PNEUMONIA VS EMPHYSEMA" },
    metadata: { topic: "Pneumonia versus emphysema histology", priority: "medium" },
  },

  {
    id: "pp2-w6i-039",
    type: "mcq",
    prompt: "the hypoxia classification lists several categories. Which item is listed under inadequate oxygen transport by the blood?",
    setup: "",
    ans: [
      { t: "Anemia and tissue edema", ok: true },
      { t: "Cyanide poisoning of cells", ok: false },
      { t: "A V/Q mismatch in the lung", ok: false },
      { t: "Low atmospheric oxygen air", ok: false },
    ],
    rationale: "Under inadequate oxygen transport by the blood anemia, abnormal hemoglobin, abnormal or reduced blood flow, and tissue edema; cyanide is a usage problem, V/Q mismatch is pulmonary disease, and low atmospheric oxygen is inadequate oxygenation.", // source: Ch 43 p 29
    scene: "pulmonary",
    sceneCfg: { label: "HYPOXIA TRANSPORT" },
    metadata: { topic: "Hypoxia transport category", priority: "medium" },
  },

  {
    id: "pp2-w6i-040",
    type: "mcq",
    prompt: "Asthma is qualified as reversible. Which statement about its reversibility is correct?",
    setup: "",
    ans: [
      { t: "Severe chronic asthma can leave fixed change", ok: true },
      { t: "Asthma damage is always wholly permanent always", ok: false },
      { t: "Asthma never alters the airway structure at all", ok: false },
      { t: "Acute asthma attacks can simply never reverse", ok: false },
    ],
    rationale: "Asthma is reversible airway obstruction and acute exacerbations are typically fully reversible, but technically irreversible chronic changes may also occur from the chronic inflammation in long-term severe asthma, so some fixed remodeling is possible.", // source: Ch 43 p 19
    scene: "pulmonary",
    sceneCfg: { label: "ASTHMA REVERSIBILITY" },
    metadata: { topic: "Asthma reversibility caveat", priority: "medium" },
  },

  {
    id: "pp2-w6i-041",
    type: "mcq",
    prompt: "Each intrinsic restrictive disease has a characteristic feature. Which pairing is correct?",
    setup: "",
    ans: [
      { t: "Sarcoidosis with granulomas", ok: true },
      { t: "Sarcoidosis with thick collagen", ok: false },
      { t: "Fibrosis with bronchial spasm", ok: false },
      { t: "Silicosis with fluid filling", ok: false },
    ],
    rationale: "Diffuse interstitial pulmonary fibrosis with thick collagen deposits, sarcoidosis with chronic inflammatory granulomas, and asbestosis or silicosis with scarring from chronic irritant exposure, so sarcoidosis maps to granulomas.", // source: Ch 43 p 21
    scene: "pulmonary",
    sceneCfg: { label: "INTRINSIC RESTRICTIVE" },
    metadata: { topic: "Intrinsic restrictive features", priority: "high" },
  },

  {
    id: "pp2-w6i-042",
    type: "mcq",
    prompt: "Why does a pneumothorax on one side not collapse both lungs?",
    setup: "",
    ans: [
      { t: "The two pleural sides are separate", ok: true },
      { t: "The trachea seals off the bad side", ok: false },
      { t: "The diaphragm splits the two lungs", ok: false },
      { t: "The heart blocks air from crossing", ok: false },
    ],
    rationale: "That, fortunately, the two sides of the pleural cavity are separate, so air entering one side cannot reach the other; otherwise both lungs would collapse together when a pneumothorax occurs.", // source: Ch 43 p 22
    scene: "pulmonary",
    sceneCfg: { label: "SEPARATE PLEURA" },
    metadata: { topic: "Pneumothorax separate pleura", priority: "high" },
  },

  {
    id: "pp2-w6i-043",
    type: "mcq",
    prompt: "Why does atelectasis cause only a minimal fall in arterial saturation to a mean near 91%?",
    setup: "",
    ans: [
      { t: "Little blood flows past collapsed lung", ok: true },
      { t: "The collapsed lung still fully oxygenates", ok: false },
      { t: "Surfactant keeps every alveolus open", ok: false },
      { t: "The other lung shuts its blood flow", ok: false },
    ],
    rationale: "The atelectatic lung receives only about one fifth of normal blood flow because blood is diverted away, so the poorly saturated stream is a small fraction and the aortic mean falls only slightly to about 91%.", // source: Ch 43 p 24
    scene: "pulmonary",
    sceneCfg: { label: "ATELECTASIS SAT" },
    metadata: { topic: "Atelectasis minimal desaturation", priority: "high" },
  },

];
