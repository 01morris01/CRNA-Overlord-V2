/**
 * BIOL-510-A Adv Phys and Pathophys II SUPPLEMENT
 * Gas Exchange and Transport of O2 and CO2 (Guyton and Hall 14e, Ch. 40 to 41)
 * Sourced from the chapter slides; every MCQ cites its source page.
 * Authoring conventions: periods, commas, semicolons only (no dashes as punctuation); ranges with the word "to"; answer options kept approximately equal length.
 */

export const PP2_WK5_SUPPLEMENT_QUESTIONS = [

  {
    id: "pp2-w5g-001",
    type: "mcq",
    prompt: "According to the slides, the diffusion of a gas across the respiratory membrane is driven primarily by what?",
    setup: "",
    ans: [
      { t: "Its partial pressure gap", ok: true },
      { t: "Active membrane transport", ok: false },
      { t: "The total barometric load", ok: false },
      { t: "Bulk convective airflow", ok: false },
    ],
    rationale: "The slides state that diffusion occurs in response to a concentration gradient and that diffusion of gases across a membrane is proportional to the partial pressure gradient across that membrane. Gas movement here is passive diffusion, not active transport or bulk airflow.", // source: Ch 40 p 17
    scene: "pulmonary",
    sceneCfg: { label: "GAS DIFFUSION DRIVING FORCE" },
    metadata: { topic: "Diffusion driving force", priority: "high" },
  },

  {
    id: "pp2-w5g-002",
    type: "mcq",
    prompt: "The slides give atmospheric pressure as 760 mm Hg and state that partial pressure is proportional to the fraction of a gas. What is the approximate partial pressure of oxygen in dry atmospheric air?",
    setup: "",
    ans: [
      { t: "About 159 mm Hg", ok: true },
      { t: "About 104 mm Hg", ok: false },
      { t: "About 47 mm Hg", ok: false },
      { t: "About 563 mm Hg", ok: false },
    ],
    rationale: "The slides compute partial pressure as 760 times the gas fraction, so oxygen at roughly 20 percent gives about 149 to 159 mm Hg, and the alveolar air table lists atmospheric O2 as 159 mm Hg. The value 104 is alveolar PO2, 47 is the water vapor pressure, and 563 is humidified nitrogen.", // source: Ch 40 p 18
    scene: "pulmonary",
    sceneCfg: { label: "ATMOSPHERIC OXYGEN PRESSURE" },
    metadata: { topic: "Partial pressure of oxygen", priority: "high" },
  },

  {
    id: "pp2-w5g-003",
    type: "mcq",
    prompt: "The slides state that once inspired air reaches the alveoli it is humidified. What water vapor pressure does this humidification produce?",
    setup: "",
    ans: [
      { t: "47 mm Hg", ok: true },
      { t: "40 mm Hg", ok: false },
      { t: "104 mm Hg", ok: false },
      { t: "27 mm Hg", ok: false },
    ],
    rationale: "The slides state that air is humidified, yielding a vapor pressure of 47 mm Hg once it reaches the alveoli, and the alveolar air table lists H2O at 47 mm Hg. The value 40 is alveolar PCO2, 104 is alveolar PO2, and 27 is expired CO2.", // source: Ch 40 p 14
    scene: "pulmonary",
    sceneCfg: { label: "ALVEOLAR WATER VAPOR PRESSURE" },
    metadata: { topic: "Water vapor pressure", priority: "high" },
  },

  {
    id: "pp2-w5g-004",
    type: "mcq",
    prompt: "Compared with oxygen, how soluble is carbon dioxide according to the slides?",
    setup: "",
    ans: [
      { t: "About 20 times more", ok: true },
      { t: "About half as soluble", ok: false },
      { t: "About equally soluble", ok: false },
      { t: "About 5 times as much", ok: false },
    ],
    rationale: "The slides explicitly state that CO2 is 20 times as soluble as O2. This high solubility is one reason carbon dioxide moves so readily across the respiratory membrane despite a smaller partial pressure gradient than oxygen.", // source: Ch 40 p 14
    scene: "pulmonary",
    sceneCfg: { label: "CARBON DIOXIDE SOLUBILITY" },
    metadata: { topic: "CO2 solubility", priority: "high" },
  },

  {
    id: "pp2-w5g-005",
    type: "mcq",
    prompt: "The slides compute PO2 of humidified air as (760 minus 47) times 0.21. What value does this calculation yield?",
    setup: "",
    ans: [
      { t: "149 mm Hg", ok: true },
      { t: "104 mm Hg", ok: false },
      { t: "99 mm Hg", ok: false },
      { t: "713 mm Hg", ok: false },
    ],
    rationale: "The slides show PO2 equals (760 minus 47) times 0.21, which is 713 times 0.21, equaling 149 mm Hg. The slide notes the water vapor pressure of 47 is subtracted first; 713 is that intermediate value, while 104 and 99 are later alveolar oxygen values.", // source: Ch 40 p 23
    scene: "pulmonary",
    sceneCfg: { label: "HUMIDIFIED INSPIRED OXYGEN" },
    metadata: { topic: "Humidified PO2 calculation", priority: "high" },
  },

  {
    id: "pp2-w5g-006",
    type: "mcq",
    prompt: "Per the alveolar air composition table on the slides, what is the partial pressure of oxygen in alveolar air?",
    setup: "",
    ans: [
      { t: "104 mm Hg", ok: true },
      { t: "159 mm Hg", ok: false },
      { t: "120 mm Hg", ok: false },
      { t: "149 mm Hg", ok: false },
    ],
    rationale: "The alveolar air table on the slides lists O2 at 104 mm Hg in alveolar air. The value 159 is atmospheric O2, 120 is expired O2, and 149 is humidified inspired O2; alveolar PO2 is lower because oxygen is continuously absorbed into pulmonary capillary blood.", // source: Ch 40 p 22
    scene: "pulmonary",
    sceneCfg: { label: "ALVEOLAR AIR OXYGEN" },
    metadata: { topic: "Alveolar oxygen pressure", priority: "medium" },
  },

  {
    id: "pp2-w5g-007",
    type: "mcq",
    prompt: "Per the alveolar air composition table on the slides, what is the partial pressure of carbon dioxide in alveolar air?",
    setup: "",
    ans: [
      { t: "40 mm Hg", ok: true },
      { t: "27 mm Hg", ok: false },
      { t: "45 mm Hg", ok: false },
      { t: "0.3 mm Hg", ok: false },
    ],
    rationale: "The alveolar air table on the slides lists CO2 at 40 mm Hg in alveolar air. Expired air CO2 is 27 (diluted by dead space gas), mixed venous blood is about 45, and atmospheric CO2 is only 0.3 mm Hg.", // source: Ch 40 p 22
    scene: "pulmonary",
    sceneCfg: { label: "ALVEOLAR AIR CARBON DIOXIDE" },
    metadata: { topic: "Alveolar carbon dioxide", priority: "medium" },
  },

  {
    id: "pp2-w5g-008",
    type: "mcq",
    prompt: "The slides describe the dilution of alveolar gases with each breath. How is this process best characterized?",
    setup: "",
    ans: [
      { t: "Slow and gradual", ok: true },
      { t: "Instant and complete", ok: false },
      { t: "Fully halted at rest", ok: false },
      { t: "Reversed during exhaling", ok: false },
    ],
    rationale: "The slides title this concept Dilution of Alveolar Gases Is Slow and show gas being replaced only gradually over many breaths. This slow turnover stabilizes O2 and CO2, and hence pH, if respiration is temporarily interrupted.", // source: Ch 40 p 19
    scene: "pulmonary",
    sceneCfg: { label: "SLOW ALVEOLAR GAS DILUTION" },
    metadata: { topic: "Alveolar gas turnover", priority: "medium" },
  },

  {
    id: "pp2-w5g-009",
    type: "mcq",
    prompt: "According to the slides, why is the slow rate of alveolar gas replacement physiologically important?",
    setup: "",
    ans: [
      { t: "It stabilizes O2, CO2, and pH", ok: true },
      { t: "It speeds carbon dioxide loss", ok: false },
      { t: "It raises the diffusing capacity", ok: false },
      { t: "It widens the V/Q spread", ok: false },
    ],
    rationale: "The slides state that the slow rate of change is important in preventing rapid changes in gas concentrations and stabilizes O2 and CO2, and hence pH, if respiration is temporarily interrupted. It is a buffering effect, not a way to speed gas exchange.", // source: Ch 40 p 20
    scene: "pulmonary",
    sceneCfg: { label: "STABILITY OF ALVEOLAR GASES" },
    metadata: { topic: "Alveolar gas stability", priority: "medium" },
  },

  {
    id: "pp2-w5g-010",
    type: "mcq",
    prompt: "The slides list the components of the respiratory unit. Which of the following is NOT named as a component of the respiratory unit?",
    setup: "",
    ans: [
      { t: "Segmental bronchus", ok: true },
      { t: "Terminal bronchiole", ok: false },
      { t: "Alveolar ducts", ok: false },
      { t: "Alveolar sacs", ok: false },
    ],
    rationale: "The slides list the respiratory unit components as terminal bronchiole, respiratory bronchiole, alveolar ducts, and alveolar sacs. A segmental bronchus is a conducting airway and is not listed; this is the exception, so it is the correct choice for a NOT stem.", // source: Ch 40 p 12
    scene: "pulmonary",
    sceneCfg: { label: "RESPIRATORY UNIT COMPONENTS" },
    metadata: { topic: "Respiratory unit anatomy", priority: "medium" },
  },

  {
    id: "pp2-w5g-011",
    type: "mcq",
    prompt: "According to the slides, approximately how many alveoli are present in the two lungs, and where does gas exchange occur?",
    setup: "",
    ans: [
      { t: "300 million; alveolar sacs", ok: true },
      { t: "30 million; alveolar ducts", ok: false },
      { t: "3 billion; terminal bronchi", ok: false },
      { t: "300 million; the bronchi", ok: false },
    ],
    rationale: "The slides state there are 300 million alveoli in the two lungs and that gas exchange occurs in the alveolar sacs. The average alveolar diameter is given as 0.2 mm, and the thin alveolar walls aid gas exchange.", // source: Ch 40 p 12
    scene: "pulmonary",
    sceneCfg: { label: "ALVEOLAR NUMBER AND SITE" },
    metadata: { topic: "Alveolar number", priority: "medium" },
  },

  {
    id: "pp2-w5g-012",
    type: "mcq",
    prompt: "The slides list the layers of the respiratory membrane. Which layer is NOT among those listed?",
    setup: "",
    ans: [
      { t: "Pleural mesothelium", ok: true },
      { t: "Alveolar epithelium", ok: false },
      { t: "Interstitial space", ok: false },
      { t: "Capillary endothelium", ok: false },
    ],
    rationale: "The slides list the respiratory membrane layers as surfactant and fluid, alveolar epithelium, epithelial basement membrane, interstitial space, capillary basement membrane, and capillary endothelium. The pleural mesothelium is not part of this barrier, so it is the exception for a NOT stem.", // source: Ch 40 p 15
    scene: "pulmonary",
    sceneCfg: { label: "RESPIRATORY MEMBRANE LAYERS" },
    metadata: { topic: "Respiratory membrane layers", priority: "high" },
  },

  {
    id: "pp2-w5g-013",
    type: "mcq",
    prompt: "What total thickness of the respiratory membrane is given on the slides?",
    setup: "",
    ans: [
      { t: "About 0.2 micrometers", ok: true },
      { t: "About 0.2 millimeters", ok: false },
      { t: "About 2.0 micrometers", ok: false },
      { t: "About 20 micrometers", ok: false },
    ],
    rationale: "The slides label the respiratory membrane thickness as 0.2 micrometers, which keeps the diffusion distance very short. Note that 0.2 mm is instead the average alveolar diameter, not the membrane thickness.", // source: Ch 40 p 15
    scene: "pulmonary",
    sceneCfg: { label: "RESPIRATORY MEMBRANE THICKNESS" },
    metadata: { topic: "Membrane thickness", priority: "medium" },
  },

  {
    id: "pp2-w5g-014",
    type: "mcq",
    prompt: "Based on Fick's Law as shown on the slides, increasing which factor would increase the rate of gas diffusion?",
    setup: "",
    ans: [
      { t: "Surface area", ok: true },
      { t: "Diffusion distance", ok: false },
      { t: "Molecular weight", ok: false },
      { t: "Membrane fibrosis", ok: false },
    ],
    rationale: "The Fick's Law slide shows diffusion equals pressure gradient times area times solubility, divided by distance times the square root of molecular weight. Area is in the numerator, so increasing it increases diffusion, whereas increasing distance or molecular weight decreases it.", // source: Ch 40 p 16
    scene: "pulmonary",
    sceneCfg: { label: "FICK LAW DIFFUSION FACTORS" },
    metadata: { topic: "Fick's Law factors", priority: "high" },
  },

  {
    id: "pp2-w5g-015",
    type: "mcq",
    prompt: "In the Fick's Law expression on the slides, which two factors are described as fixed?",
    setup: "",
    ans: [
      { t: "Solubility and weight", ok: true },
      { t: "Area and diffusion distance", ok: false },
      { t: "Pressure gradient and area", ok: false },
      { t: "Distance and the gradient", ok: false },
    ],
    rationale: "The Fick's Law slide states that solubility and MW are fixed, while pressure gradient, area, and distance can vary. Because solubility and molecular weight are constants for a given gas, only the other three terms change diffusion physiologically.", // source: Ch 40 p 16
    scene: "pulmonary",
    sceneCfg: { label: "FIXED FICK LAW TERMS" },
    metadata: { topic: "Fick's Law constants", priority: "medium" },
  },

  {
    id: "pp2-w5g-016",
    type: "mcq",
    prompt: "How do the slides define the diffusing capacity of the lung?",
    setup: "",
    ans: [
      { t: "mL gas per minute per 1 mm Hg", ok: true },
      { t: "mL gas per breath per 1 percent", ok: false },
      { t: "Liters of air moved each minute", ok: false },
      { t: "Pressure drop across the wall", ok: false },
    ],
    rationale: "The slides define diffusing capacity as the milliliters of gas diffusing each minute for a pressure difference of 1 mm Hg. It is a measure of the alveolar membrane and gas, and it can change, for example during exercise.", // source: Ch 40 p 3
    scene: "pulmonary",
    sceneCfg: { label: "DIFFUSING CAPACITY DEFINITION" },
    metadata: { topic: "Diffusing capacity definition", priority: "high" },
  },

  {
    id: "pp2-w5g-017",
    type: "mcq",
    prompt: "According to the slides, how does the diffusing capacity of carbon dioxide compare with that of oxygen?",
    setup: "",
    ans: [
      { t: "About 20 times greater", ok: true },
      { t: "About 20 times smaller", ok: false },
      { t: "About equal to it", ok: false },
      { t: "About 2 times greater", ok: false },
    ],
    rationale: "The slides state that the CO2 diffusing capacity is 20 times the diffusing capacity of O2, shown in the bar graph at rest and during exercise. This reflects the much higher solubility of carbon dioxide across the respiratory membrane.", // source: Ch 40 p 4
    scene: "pulmonary",
    sceneCfg: { label: "CO2 VERSUS O2 DIFFUSION" },
    metadata: { topic: "CO2 diffusing capacity", priority: "high" },
  },

  {
    id: "pp2-w5g-018",
    type: "mcq",
    prompt: "The slides give the normal whole-lung ventilation-perfusion ratio using 4 L/min ventilation and 5 L/min blood flow. What is this V/Q ratio?",
    setup: "",
    ans: [
      { t: "0.8", ok: true },
      { t: "1.25", ok: false },
      { t: "1.0", ok: false },
      { t: "0.5", ok: false },
    ],
    rationale: "The slides define V/Q as the ratio of ventilation to blood flow and compute (4 L/min) divided by (5 L/min) equals 0.8. The value 1.25 would result from inverting the ratio, and 0.5 is the approximate lower lung value, not the whole-lung average.", // source: Ch 40 p 5
    scene: "pulmonary",
    sceneCfg: { label: "NORMAL VENTILATION PERFUSION RATIO" },
    metadata: { topic: "Normal V/Q ratio", priority: "high" },
  },

  {
    id: "pp2-w5g-019",
    type: "mcq",
    prompt: "On the slides, a lung unit with a V/Q of zero (no ventilation) has alveolar gas values approaching which of the following?",
    setup: "",
    ans: [
      { t: "PO2 40, PCO2 45 mm Hg", ok: true },
      { t: "PO2 150, PCO2 0 mm Hg", ok: false },
      { t: "PO2 104, PCO2 40 mm Hg", ok: false },
      { t: "PO2 100, PCO2 27 mm Hg", ok: false },
    ],
    rationale: "The Decreased V/Q slide shows a unit with V/Q of zero, a physiological shunt, where alveolar gas equilibrates with mixed venous blood at PO2 40 and PCO2 45 mm Hg. The 150 and 0 values describe the opposite extreme of dead space, and 104 and 40 are normal alveolar values.", // source: Ch 40 p 10
    scene: "pulmonary",
    sceneCfg: { label: "ZERO V/Q SHUNT VALUES" },
    metadata: { topic: "Low V/Q shunt", priority: "high" },
  },

  {
    id: "pp2-w5g-020",
    type: "mcq",
    prompt: "On the slides, a lung unit with a V/Q approaching infinity (no perfusion) has alveolar gas values approaching which of the following?",
    setup: "",
    ans: [
      { t: "PO2 150, PCO2 0 mm Hg", ok: true },
      { t: "PO2 40, PCO2 45 mm Hg", ok: false },
      { t: "PO2 104, PCO2 40 mm Hg", ok: false },
      { t: "PO2 100, PCO2 27 mm Hg", ok: false },
    ],
    rationale: "The Increased V/Q slide shows a unit with V/Q of infinity, a physiological dead space, where alveolar gas approaches inspired humidified air at PO2 about 150 and PCO2 of 0 mm Hg. The 40 and 45 values describe a shunt, and 104 and 40 are normal alveolar values.", // source: Ch 40 p 9
    scene: "pulmonary",
    sceneCfg: { label: "INFINITE V/Q DEAD SPACE" },
    metadata: { topic: "High V/Q dead space", priority: "high" },
  },

  {
    id: "pp2-w5g-021",
    type: "mcq",
    prompt: "According to the slides, how do the upper lung and lower lung V/Q ratios compare in a normal upright person?",
    setup: "",
    ans: [
      { t: "Upper about 3, lower about 0.5", ok: true },
      { t: "Upper about 0.5, lower about 3", ok: false },
      { t: "Both equal to about 0.8", ok: false },
      { t: "Upper about 1, lower about 1", ok: false },
    ],
    rationale: "The slides state that upper lung Va/Q is normally approximately 3 and lower lung Va/Q is normally approximately 0.5. The apex is relatively overventilated and underperfused, giving a higher ratio than the base.", // source: Ch 40 p 11
    scene: "pulmonary",
    sceneCfg: { label: "UPPER VERSUS LOWER LUNG V/Q" },
    metadata: { topic: "Regional V/Q distribution", priority: "medium" },
  },

  {
    id: "pp2-w5g-022",
    type: "mcq",
    prompt: "The slides define hypoventilation in terms of alveolar carbon dioxide. Hypoventilation is defined as which of the following?",
    setup: "",
    ans: [
      { t: "PACO2 greater than 40", ok: true },
      { t: "PACO2 less than 40", ok: false },
      { t: "PAO2 greater than 100", ok: false },
      { t: "V/Q greater than 0.8", ok: false },
    ],
    rationale: "The slides define hypoventilation as PACO2 greater than 40 and hyperventilation as PACO2 less than 40, because decreasing V/Q produces a higher alveolar PCO2. The PAO2 greater than 100 statement instead describes hyperventilation on the oxygen slide.", // source: Ch 40 p 24
    scene: "pulmonary",
    sceneCfg: { label: "HYPOVENTILATION CO2 THRESHOLD" },
    metadata: { topic: "Hypoventilation definition", priority: "high" },
  },

  {
    id: "pp2-w5t-001",
    type: "mcq",
    prompt: "Which measurement of blood oxygen serves as the driving force for diffusion?",
    setup: "",
    ans: [
      { t: "Partial pressure", ok: true },
      { t: "Percent content", ok: false },
      { t: "Total saturation", ok: false },
      { t: "Bound fraction", ok: false },
    ],
    rationale: "The slides define partial pressure (in mm Hg) as the driving force for diffusion, and it depends on the percentage of gas present. Saturation is the percent of hemoglobin with oxygen bound, and content is the absolute quantity of oxygen carried.", // source: Ch 41 p 3
    scene: "pulmonary",
    sceneCfg: { label: "DRIVING FORCE FOR DIFFUSION" },
    metadata: { topic: "Oxygen measurements", priority: "high" },
  },

  {
    id: "pp2-w5t-002",
    type: "mcq",
    prompt: "Percent oxygen saturation of hemoglobin is best expressed by which relationship?",
    setup: "",
    ans: [
      { t: "HbO2 over (Hb plus HbO2)", ok: true },
      { t: "HbO2 over dissolved oxygen", ok: false },
      { t: "Hb over (Hb plus HbO2)", ok: false },
      { t: "HbO2 over total blood content", ok: false },
    ],
    rationale: "The slides define percent saturation as HbO2 divided by the sum of Hb plus HbO2, meaning the fraction of all hemoglobin that has oxygen bound. It is not a ratio involving dissolved oxygen or total content, and using Hb in the numerator would describe the unsaturated fraction.", // source: Ch 41 p 3
    scene: "pulmonary",
    sceneCfg: { label: "PERCENT SATURATION FORMULA" },
    metadata: { topic: "Saturation", priority: "medium" },
  },

  {
    id: "pp2-w5t-003",
    type: "mcq",
    prompt: "Along the pulmonary capillary, what is the PO2 of blood at the arterial (incoming) end?",
    setup: "",
    ans: [
      { t: "40 mm Hg", ok: true },
      { t: "60 mm Hg", ok: false },
      { t: "95 mm Hg", ok: false },
      { t: "104 mm Hg", ok: false },
    ],
    rationale: "The slides show the pulmonary capillary diffusion gradient runs from 40 mm Hg at the arterial (incoming, deoxygenated) end up to 104 mm Hg at the venous (outgoing) end, matching alveolar PO2. The value 104 mm Hg is the outgoing end, not the incoming end.", // source: Ch 41 p 4
    scene: "pulmonary",
    sceneCfg: { label: "PULMONARY CAPILLARY INLET PO2" },
    metadata: { topic: "Pulmonary uptake", priority: "high" },
  },

  {
    id: "pp2-w5t-004",
    type: "mcq",
    prompt: "Oxygen equilibration in the pulmonary capillary normally takes about 0.25 seconds while each red cell spends about 0.75 seconds there. This difference represents what?",
    setup: "",
    ans: [
      { t: "A safety factor", ok: true },
      { t: "A diffusion block", ok: false },
      { t: "A shunt fraction", ok: false },
      { t: "A perfusion deficit", ok: false },
    ],
    rationale: "The slides state that O2 equilibration occurs within 0.25 seconds even though each red cell is in the pulmonary capillary for about 0.75 seconds, and explicitly label this surplus time a safety factor. It is not a block, a shunt, or a perfusion deficit; it is reserve transit time.", // source: Ch 41 p 4
    scene: "pulmonary",
    sceneCfg: { label: "PULMONARY TRANSIT SAFETY FACTOR" },
    metadata: { topic: "Pulmonary uptake", priority: "high" },
  },

  {
    id: "pp2-w5t-005",
    type: "mcq",
    prompt: "Why does systemic arterial PO2 fall slightly to about 100 mm Hg even though pulmonary capillary blood reaches about 104 mm Hg?",
    setup: "",
    ans: [
      { t: "Mixing with shunt blood", ok: true },
      { t: "Loss to tissue cells", ok: false },
      { t: "Slow capillary transit", ok: false },
      { t: "Low alveolar oxygen tension", ok: false },
    ],
    rationale: "The slides show oxygenated pulmonary capillary blood at about 104 mm Hg is diluted by pulmonary shunt blood, lowering systemic arterial PO2 to roughly 100 mm Hg. Tissue extraction occurs later in the systemic capillaries, not before the arterial blood is sampled.", // source: Ch 41 p 5
    scene: "pulmonary",
    sceneCfg: { label: "SHUNT DILUTION OF ARTERIAL PO2" },
    metadata: { topic: "Circulatory oxygen", priority: "high" },
  },

  {
    id: "pp2-w5t-006",
    type: "mcq",
    prompt: "On the slides, what is the alveolar PCO2 used in the gas diagrams?",
    setup: "",
    ans: [
      { t: "40 mm Hg", ok: true },
      { t: "0 mm Hg", ok: false },
      { t: "45 mm Hg", ok: false },
      { t: "104 mm Hg", ok: false },
    ],
    rationale: "The alveolar gas diagrams list alveolar PO2 at 104 mm Hg and alveolar PCO2 at 40 mm Hg. A PCO2 of 0 applies to inspired atmospheric and humidified tracheal gas, while 45 mm Hg is venous blood PCO2.", // source: Ch 41 p 6
    scene: "pulmonary",
    sceneCfg: { label: "ALVEOLAR CARBON DIOXIDE PRESSURE" },
    metadata: { topic: "Alveolar gases", priority: "medium" },
  },

  {
    id: "pp2-w5t-007",
    type: "mcq",
    prompt: "With no red cells present, oxygen still diffuses into plasma. What does the slide say about this situation?",
    setup: "",
    ans: [
      { t: "Content stays minimal", ok: true },
      { t: "Content rises sharply", ok: false },
      { t: "Pressure falls to zero", ok: false },
      { t: "Pressure cannot form", ok: false },
    ],
    rationale: "The slide explains that even without red blood cells a small amount of oxygen diffuses into plasma, so the partial pressure is maintained but the content remains minimal. Hemoglobin is required to carry a large oxygen content, so without it content stays low.", // source: Ch 41 p 7
    scene: "pulmonary",
    sceneCfg: { label: "PLASMA OXYGEN WITHOUT CELLS" },
    metadata: { topic: "Dissolved oxygen", priority: "medium" },
  },

  {
    id: "pp2-w5t-008",
    type: "mcq",
    prompt: "According to the slides, the intracellular PO2 within tissue cells is about what value?",
    setup: "",
    ans: [
      { t: "23 mm Hg", ok: true },
      { t: "40 mm Hg", ok: false },
      { t: "46 mm Hg", ok: false },
      { t: "95 mm Hg", ok: false },
    ],
    rationale: "The slides give arterial PO2 of 95 to 100 mm Hg, tissue PO2 of 30 to 40 mm Hg, and an intracellular value of about 23 mm Hg within the cells. The 46 figure on a later slide refers to intracellular PCO2, not PO2.", // source: Ch 41 p 8
    scene: "pulmonary",
    sceneCfg: { label: "INTRACELLULAR OXYGEN PRESSURE" },
    metadata: { topic: "Tissue oxygen", priority: "medium" },
  },

  {
    id: "pp2-w5t-009",
    type: "mcq",
    prompt: "What two opposing factors determine tissue PO2 according to the slides?",
    setup: "",
    ans: [
      { t: "Delivery and usage", ok: true },
      { t: "Diffusion and shunting", ok: false },
      { t: "Affinity and content", ok: false },
      { t: "Solubility and binding", ok: false },
    ],
    rationale: "The slides state directly that tissue PO2 is determined by the balance of delivery and usage. The figure reinforces this by showing interstitial PO2 rise with blood flow and fall with higher oxygen consumption.", // source: Ch 41 p 8
    scene: "pulmonary",
    sceneCfg: { label: "BALANCE OF DELIVERY AND USAGE" },
    metadata: { topic: "Tissue oxygen", priority: "high" },
  },

  {
    id: "pp2-w5t-010",
    type: "mcq",
    prompt: "In the tissue capillary, what is the approximate PCO2 inside the cells?",
    setup: "",
    ans: [
      { t: "46 mm Hg", ok: true },
      { t: "40 mm Hg", ok: false },
      { t: "23 mm Hg", ok: false },
      { t: "59 mm Hg", ok: false },
    ],
    rationale: "The slide diagram lists intracellular PCO2 at 46 mm Hg, interstitial 45 mm Hg, arterial end 40 mm Hg, and venous end 45 mm Hg. CO2 thus diffuses down a gradient from cell to capillary, and 40 is the incoming arterial value.", // source: Ch 41 p 10
    scene: "pulmonary",
    sceneCfg: { label: "INTRACELLULAR CARBON DIOXIDE" },
    metadata: { topic: "Tissue carbon dioxide", priority: "medium" },
  },

  {
    id: "pp2-w5t-011",
    type: "mcq",
    prompt: "Using the dissolved oxygen relationship on the slides, what is the solubility coefficient of oxygen in plasma?",
    setup: "",
    ans: [
      { t: "0.003 mL per mm Hg", ok: true },
      { t: "0.03 mL per mm Hg", ok: false },
      { t: "1.34 mL per mm Hg", ok: false },
      { t: "1.39 mL per gram Hb", ok: false },
    ],
    rationale: "The slide gives dissolved oxygen as solubility times PaO2, with a solubility of 0.003 mL O2 per dL plasma per mm Hg, yielding about 0.3 mL per dL at a PaO2 of 100. The values 1.34 and 1.39 are the oxygen carrying capacities per gram of hemoglobin, not solubilities.", // source: Ch 41 p 12
    scene: "pulmonary",
    sceneCfg: { label: "OXYGEN SOLUBILITY COEFFICIENT" },
    metadata: { topic: "Dissolved oxygen", priority: "high" },
  },

  {
    id: "pp2-w5t-012",
    type: "mcq",
    prompt: "What is the normal whole-body oxygen consumption stated on the slides?",
    setup: "",
    ans: [
      { t: "250 mL per minute", ok: true },
      { t: "100 mL per minute", ok: false },
      { t: "500 mL per minute", ok: false },
      { t: "1000 mL per minute", ok: false },
    ],
    rationale: "The slide on transport of oxygen in blood lists normal oxygen consumption as 250 mL O2 per minute and notes that dissolved oxygen alone would not be enough without hemoglobin. The 1000 mL value on another slide is delivery at normal flow, not consumption.", // source: Ch 41 p 14
    scene: "pulmonary",
    sceneCfg: { label: "NORMAL OXYGEN CONSUMPTION RATE" },
    metadata: { topic: "Oxygen consumption", priority: "medium" },
  },

  {
    id: "pp2-w5t-013",
    type: "mcq",
    prompt: "Approximately what percentage of oxygen in blood is transported bound to hemoglobin rather than dissolved?",
    setup: "",
    ans: [
      { t: "97 percent", ok: true },
      { t: "70 percent", ok: false },
      { t: "50 percent", ok: false },
      { t: "23 percent", ok: false },
    ],
    rationale: "The slides state that 97 percent of oxygen is transported bound to hemoglobin, with only a small dissolved fraction. The value 70 percent describes bicarbonate transport of carbon dioxide, and 23 percent describes carbaminohemoglobin.", // source: Ch 41 p 14
    scene: "pulmonary",
    sceneCfg: { label: "HEMOGLOBIN BOUND OXYGEN FRACTION" },
    metadata: { topic: "Hemoglobin transport", priority: "high" },
  },

  {
    id: "pp2-w5t-014",
    type: "mcq",
    prompt: "Using 1.34 mL O2 per gram, a normal person with 15 g Hb per 100 mL blood carries about how much hemoglobin-bound oxygen?",
    setup: "",
    ans: [
      { t: "20 mL per 100 mL", ok: true },
      { t: "13 mL per 100 mL", ok: false },
      { t: "10 mL per 100 mL", ok: false },
      { t: "5 mL per 100 mL", ok: false },
    ],
    rationale: "The slide gives 1.34 mL O2 per gram of hemoglobin, so 15 g per 100 mL yields about 20 mL O2 per 100 mL blood. An anemic person with 10 g per 100 mL carries only about 13 mL per 100 mL, and 5 mL per 100 mL is the typical tissue extraction.", // source: Ch 41 p 15
    scene: "pulmonary",
    sceneCfg: { label: "NORMAL HEMOGLOBIN OXYGEN CAPACITY" },
    metadata: { topic: "Oxygen content", priority: "high" },
  },

  {
    id: "pp2-w5t-015",
    type: "mcq",
    prompt: "From the values to remember, a PO2 of 40 mm Hg corresponds to what hemoglobin saturation?",
    setup: "",
    ans: [
      { t: "75 percent", ok: true },
      { t: "25 percent", ok: false },
      { t: "90 percent", ok: false },
      { t: "100 percent", ok: false },
    ],
    rationale: "The slide table lists PO2 40 mm Hg at 75 percent saturation and 15 mL per dL content, which is the typical mixed venous point. A PO2 of 20 gives 25 percent and a PO2 of 100 gives 100 percent.", // source: Ch 41 p 18
    scene: "pulmonary",
    sceneCfg: { label: "VENOUS POINT SATURATION VALUE" },
    metadata: { topic: "Dissociation curve", priority: "high" },
  },

  {
    id: "pp2-w5t-016",
    type: "mcq",
    prompt: "The 4,5,6 to 7,8,9 rule on the slides pairs which PO2 values with which saturations for a person with 15 g per dL hemoglobin?",
    setup: "",
    ans: [
      { t: "40,50,60 to 70,80,90", ok: true },
      { t: "45,55,65 to 70,80,90", ok: false },
      { t: "40,50,60 to 75,85,95", ok: false },
      { t: "50,60,70 to 80,90,95", ok: false },
    ],
    rationale: "The slide gives the memory aid as PO2 of 40, 50, and 60 mm Hg corresponding to saturations of 70, 80, and 90 percent. The other pairings shift either the pressures or the saturations away from the stated rule.", // source: Ch 41 p 18
    scene: "pulmonary",
    sceneCfg: { label: "FOUR FIVE SIX RULE" },
    metadata: { topic: "Dissociation curve", priority: "medium" },
  },

  {
    id: "pp2-w5t-017",
    type: "mcq",
    prompt: "A rightward shift of the hemoglobin oxygen dissociation curve produces which effect at any given PO2?",
    setup: "",
    ans: [
      { t: "Lower saturation", ok: true },
      { t: "Higher saturation", ok: false },
      { t: "Higher affinity", ok: false },
      { t: "Greater content", ok: false },
    ],
    rationale: "The slides state that with a right shift, for any given PO2 the percent saturation is lower because oxygen affinity for hemoglobin is reduced, which favors oxygen release at the tissues. A left shift would raise saturation and affinity.", // source: Ch 41 p 26
    scene: "pulmonary",
    sceneCfg: { label: "RIGHT SHIFT LOWERS SATURATION" },
    metadata: { topic: "Curve shifts", priority: "high" },
  },

  {
    id: "pp2-w5t-018",
    type: "mcq",
    prompt: "Which of the following does NOT shift the hemoglobin oxygen dissociation curve to the right?",
    setup: "",
    ans: [
      { t: "Decreased temperature", ok: true },
      { t: "Increased hydrogen ions", ok: false },
      { t: "Increased carbon dioxide", ok: false },
      { t: "Increased BPG levels", ok: false },
    ],
    rationale: "The slides list four causes of a right shift: increased hydrogen ions, increased CO2 (the Bohr effect), increased temperature, and increased BPG. A decrease in temperature shifts the curve left, so it is the exception and is the correct choice here.", // source: Ch 41 p 25
    scene: "pulmonary",
    sceneCfg: { label: "FACTOR NOT CAUSING RIGHT SHIFT" },
    metadata: { topic: "Curve shifts", priority: "high" },
  },

  {
    id: "pp2-w5t-019",
    type: "mcq",
    prompt: "On the slides, what does BPG (2,3 biphosphoglycerate) do to hemoglobin?",
    setup: "",
    ans: [
      { t: "Reduces oxygen affinity", ok: true },
      { t: "Raises oxygen affinity", ok: false },
      { t: "Blocks carbon dioxide binding", ok: false },
      { t: "Binds the iron site", ok: false },
    ],
    rationale: "The slide defines BPG as a metabolic phosphate compound that reduces the affinity of hemoglobin for oxygen, shifting the curve right. In hypoxia, increased BPG keeps the curve shifted right and increases oxygen release to tissues.", // source: Ch 41 p 26
    scene: "pulmonary",
    sceneCfg: { label: "BPG REDUCES OXYGEN AFFINITY" },
    metadata: { topic: "Curve shifts", priority: "medium" },
  },

  {
    id: "pp2-w5t-020",
    type: "mcq",
    prompt: "What is the normal physiologic shunt fraction stated on the slides?",
    setup: "",
    ans: [
      { t: "About 5 percent", ok: true },
      { t: "About 1 percent", ok: false },
      { t: "About 10 percent", ok: false },
      { t: "About 25 percent", ok: false },
    ],
    rationale: "The slides give a normal shunt fraction of about 5 percent of blood flow, arising from bronchial venous return and the Thebesian veins of the heart. The 10 figure on the slides is the normal alveolar to arterial oxygen difference in mm Hg, not the shunt percentage.", // source: Ch 41 p 29
    scene: "pulmonary",
    sceneCfg: { label: "NORMAL PHYSIOLOGIC SHUNT FRACTION" },
    metadata: { topic: "Shunt", priority: "high" },
  },

  {
    id: "pp2-w5t-021",
    type: "mcq",
    prompt: "How does arterial PO2 respond when a true shunt is the cause of hypoxemia and FIO2 is increased?",
    setup: "",
    ans: [
      { t: "Increases very little", ok: true },
      { t: "Increases substantially", ok: false },
      { t: "Falls below baseline", ok: false },
      { t: "Normalizes completely", ok: false },
    ],
    rationale: "The slides emphasize that with a shunt, arterial PO2 increases very little with increased FIO2 because shunted blood never contacts alveolar gas to take up the extra oxygen. This poor response distinguishes shunt from V/Q mismatch, which does respond to supplemental oxygen.", // source: Ch 41 p 31
    scene: "pulmonary",
    sceneCfg: { label: "SHUNT RESPONSE TO OXYGEN" },
    metadata: { topic: "Shunt", priority: "high" },
  },

  {
    id: "pp2-w5t-022",
    type: "mcq",
    prompt: "According to the carbon dioxide transport slide, what fraction of CO2 is carried as bicarbonate?",
    setup: "",
    ans: [
      { t: "70 percent", ok: true },
      { t: "23 percent", ok: false },
      { t: "7 percent", ok: false },
      { t: "50 percent", ok: false },
    ],
    rationale: "The slide lists CO2 transported as bicarbonate at 70 percent, as carbaminohemoglobin (Hgb-CO2) at 23 percent, and as dissolved CO2 at 7 percent. Carbonic anhydrase inside the red cell drives bicarbonate formation, making it the dominant form.", // source: Ch 41 p 38
    scene: "pulmonary",
    sceneCfg: { label: "BICARBONATE FRACTION OF CARBON DIOXIDE" },
    metadata: { topic: "Carbon dioxide transport", priority: "high" },
  },

  /* coverage gap-fill (Ch 38 to 43) */

  {
    id: "pp2-w5g-023",
    type: "mcq",
    prompt: "On the gas exchange diagram of the slides, dissolved molecules are shown moving in both directions. What does the slides say determines the NET direction of diffusion?",
    setup: "",
    ans: [
      { t: "Down the concentration gradient", ok: true },
      { t: "Toward the higher pressure side", ok: false },
      { t: "Toward the lower temperature side", ok: false },
      { t: "Toward the larger fluid volume", ok: false },
    ],
    rationale: "The slides show molecules diffusing randomly in both directions, but net diffusion proceeds from the region of higher concentration to the region of lower concentration, that is down the concentration gradient. Pressure is proportional to concentration, so net movement is from high partial pressure to low.", // source: Ch 40 p 4
    scene: "pulmonary",
    sceneCfg: { label: "NET DIFFUSION" },
    metadata: { topic: "Net diffusion direction", priority: "medium" },
  },

  {
    id: "pp2-w5g-024",
    type: "mcq",
    prompt: "The slides state that total pressure of a gas mixture is the sum of the partial pressures. Which set of gases do the slides list as making up the total pressure of air?",
    setup: "",
    ans: [
      { t: "O2, N2, CO2, and H2O", ok: true },
      { t: "O2, N2, CO, and H2O", ok: false },
      { t: "O2, CO2, argon, and H2O", ok: false },
      { t: "O2, N2, CO2, and helium", ok: false },
    ],
    rationale: "The slides state total pressure is the sum of the partial pressure of each gas and list oxygen, nitrogen, carbon dioxide, and water vapor. Nitrogen contributes the largest share at about 563 mm Hg of humidified air.", // source: Ch 40 p 8
    scene: "pulmonary",
    sceneCfg: { label: "TOTAL PRESSURE" },
    metadata: { topic: "Dalton's law components", priority: "medium" },
  },

  {
    id: "pp2-w5g-025",
    type: "mcq",
    prompt: "According to the slides, diffusion of gases across a membrane is proportional to what?",
    setup: "",
    ans: [
      { t: "Partial pressure gradient across it", ok: true },
      { t: "Absolute pressure on the gas phase side", ok: false },
      { t: "Total pressure of the gas mixture", ok: false },
      { t: "Square of the membrane area", ok: false },
    ],
    rationale: "The slides state diffusion of gases across a membrane is proportional to the partial pressure gradient across the membrane. It is the difference in partial pressure between the two sides, not the absolute or total pressure, that drives net transfer.", // source: Ch 40 p 8
    scene: "pulmonary",
    sceneCfg: { label: "GRADIENT DRIVE" },
    metadata: { topic: "Pressure gradient and diffusion", priority: "medium" },
  },

  {
    id: "pp2-w5g-026",
    type: "mcq",
    prompt: "The slides list the components of the respiratory unit. Which sequence correctly orders them from larger airway toward the gas exchange surface?",
    setup: "",
    ans: [
      { t: "Terminal bronchiole, respiratory bronchiole, ducts, sacs", ok: true },
      { t: "Respiratory bronchiole, terminal bronchiole, sacs, ducts", ok: false },
      { t: "Alveolar sacs, ducts, respiratory and terminal bronchioles", ok: false },
      { t: "Alveolar ducts, sacs, terminal and respiratory bronchioles", ok: false },
    ],
    rationale: "The slides list the respiratory unit as terminal bronchiole, then respiratory bronchiole, then alveolar ducts, then alveolar sacs. Air passes through these in order toward the alveolar sacs where gas exchange occurs.", // source: Ch 40 p 2
    scene: "pulmonary",
    sceneCfg: { label: "RESP UNIT ORDER" },
    metadata: { topic: "Respiratory unit components", priority: "medium" },
  },

  {
    id: "pp2-w5g-027",
    type: "mcq",
    prompt: "What average alveolar diameter do the slides give for the roughly 300 million alveoli of the two lungs?",
    setup: "",
    ans: [
      { t: "0.2 mm", ok: true },
      { t: "0.2 cm", ok: false },
      { t: "2.0 mm", ok: false },
      { t: "0.02 mm", ok: false },
    ],
    rationale: "The slides state there are about 300 million alveoli in the two lungs with an average diameter of 0.2 mm. The very small size and large number create an enormous surface area for gas exchange.", // source: Ch 40 p 2
    scene: "pulmonary",
    sceneCfg: { label: "ALVEOLAR SIZE" },
    metadata: { topic: "Alveolar number and size", priority: "medium" },
  },

  {
    id: "pp2-w5g-028",
    type: "mcq",
    prompt: "The respiratory unit microanatomy figure on the slides labels structures surrounding the alveoli. Which structure is NOT labeled there?",
    setup: "",
    ans: [
      { t: "Bronchial smooth muscle", ok: true },
      { t: "Pulmonary capillary network", ok: false },
      { t: "Interstitial space", ok: false },
      { t: "Lymphatic vessel", ok: false },
    ],
    rationale: "The microanatomy figure labels capillaries, interstitial space, a lymphatic vessel, vein, artery, and the perivascular interstitial space around the alveoli. A bronchial smooth muscle band is not labeled on that figure; smooth muscle appears on the separate respiratory unit airway figure.", // source: Ch 40 p 3
    scene: "pulmonary",
    sceneCfg: { label: "ALVEOLAR SURROUND" },
    metadata: { topic: "Respiratory unit microanatomy", priority: "medium" },
  },

  {
    id: "pp2-w5g-029",
    type: "mcq",
    prompt: "Per the composition of alveolar air table on the slides, how does the PO2 of expired air compare with that of alveolar air?",
    setup: "",
    ans: [
      { t: "Higher, about 120 versus 104", ok: true },
      { t: "Lower, about 90 versus 104", ok: false },
      { t: "Equal at about 104", ok: false },
      { t: "Higher, near 149 like humidified", ok: false },
    ],
    rationale: "The table gives expired air PO2 about 120 and alveolar PO2 about 104, so expired PO2 is higher. Expired air is a mixture of dead space air, which retains a high PO2 close to humidified inspired air, and true alveolar air, so it does not reach the 149 of humidified air.", // source: Ch 40 p 13
    scene: "pulmonary",
    sceneCfg: { label: "EXPIRED AIR" },
    metadata: { topic: "Expired versus alveolar air", priority: "medium" },
  },

  {
    id: "pp2-w5g-030",
    type: "mcq",
    prompt: "The slides explain why alveolar PO2 of about 104 is lower than the humidified inspired PO2 of 149. What accounts for the difference?",
    setup: "",
    ans: [
      { t: "Oxygen is absorbed into the blood", ok: true },
      { t: "Water vapor is added in alveoli", ok: false },
      { t: "Nitrogen displaces the oxygen", ok: false },
      { t: "Oxygen is destroyed in the alveoli", ok: false },
    ],
    rationale: "Humidified inspired air has a PO2 of about 149, but in the alveoli oxygen is continuously absorbed into pulmonary capillary blood and carbon dioxide is added, lowering alveolar PO2 to about 104. Water vapor was already accounted for during humidification.", // source: Ch 40 p 13
    scene: "pulmonary",
    sceneCfg: { label: "ALVEOLAR PO2 DROP" },
    metadata: { topic: "Why alveolar PO2 is lower", priority: "high" },
  },

  {
    id: "pp2-w5g-031",
    type: "mcq",
    prompt: "Using the alveolar gas equation on the slides, PAO2 equals PIO2 minus PCO2 divided by R. With PIO2 of 149, PCO2 of 40, and R of 0.8, what is PAO2?",
    setup: "",
    ans: [
      { t: "About 99 mm Hg", ok: true },
      { t: "About 109 mm Hg", ok: false },
      { t: "About 89 mm Hg", ok: false },
      { t: "About 120 mm Hg", ok: false },
    ],
    rationale: "The slides compute PAO2 as 149 minus (40 divided by 0.8), which is 149 minus 50, equal to 99 mm Hg. This is close to the rounded alveolar PO2 of 104 used elsewhere in the chapter.", // source: Ch 40 p 16
    scene: "pulmonary",
    sceneCfg: { label: "ALVEOLAR GAS EQ" },
    metadata: { topic: "Alveolar gas equation", priority: "high" },
  },

  {
    id: "pp2-w5g-032",
    type: "mcq",
    prompt: "In the alveolar gas equation on the slides, what does the symbol R represent?",
    setup: "",
    ans: [
      { t: "Respiratory exchange ratio", ok: true },
      { t: "Airway resistance of the lung", ok: false },
      { t: "Renal correction constant", ok: false },
      { t: "Universal gas law constant", ok: false },
    ],
    rationale: "The slides define R as the respiratory exchange ratio, with a normal value of about 0.8. It represents carbon dioxide produced relative to oxygen consumed and is used to correct inspired PO2 down to alveolar PO2.", // source: Ch 40 p 16
    scene: "pulmonary",
    sceneCfg: { label: "EXCHANGE RATIO R" },
    metadata: { topic: "Respiratory exchange ratio", priority: "high" },
  },

  {
    id: "pp2-w5g-033",
    type: "mcq",
    prompt: "The slides state a key equality for a normal healthy person regarding alveolar and arterial gases. Which statement is correct?",
    setup: "",
    ans: [
      { t: "Alveolar PO2 equals arterial PO2", ok: true },
      { t: "Alveolar PO2 exceeds arterial by 40", ok: false },
      { t: "Arterial PO2 exceeds alveolar PO2", ok: false },
      { t: "Alveolar PCO2 is twice arterial", ok: false },
    ],
    rationale: "The slides state that in a normal healthy person alveolar PO2 equals arterial PO2 and alveolar PCO2 equals arterial PCO2. This equality holds when there is no diffusion impairment or shunt.", // source: Ch 40 p 19
    scene: "pulmonary",
    sceneCfg: { label: "ALVEOLAR ARTERIAL" },
    metadata: { topic: "Alveolar equals arterial", priority: "medium" },
  },

  {
    id: "pp2-w5g-034",
    type: "mcq",
    prompt: "In the alveolar PCO2 equation on the slides, PCO2 equals CO2 production times K over alveolar ventilation. What value of K is given?",
    setup: "",
    ans: [
      { t: "863 mm Hg", ok: true },
      { t: "About 760 mm Hg", ok: false },
      { t: "About 47 mm Hg", ok: false },
      { t: "About 713 mm Hg", ok: false },
    ],
    rationale: "The slides give K as a multivariable correction constant equal to 863 mm Hg. Because PCO2 is inversely proportional to alveolar ventilation, doubling ventilation halves PCO2 and halving ventilation doubles PCO2.", // source: Ch 40 p 17
    scene: "pulmonary",
    sceneCfg: { label: "PCO2 CONSTANT" },
    metadata: { topic: "Alveolar PCO2 constant", priority: "medium" },
  },

  {
    id: "pp2-w5g-035",
    type: "mcq",
    prompt: "According to the slides, what two factors control the alveolar PO2 at a given moment?",
    setup: "",
    ans: [
      { t: "Oxygen absorption and ventilation rates", ok: true },
      { t: "Water vapor pressure and nitrogen fraction", ok: false },
      { t: "Membrane thickness and surface area", ok: false },
      { t: "Cardiac output and blood viscosity", ok: false },
    ],
    rationale: "The slides state alveolar PO2 is controlled by the rate of oxygen absorption into the blood and the rate of oxygen entry into the alveoli by ventilation. A balance of these two determines the steady alveolar PO2.", // source: Ch 40 p 20
    scene: "pulmonary",
    sceneCfg: { label: "PO2 CONTROL" },
    metadata: { topic: "Control of alveolar PO2", priority: "medium" },
  },

  {
    id: "pp2-w5g-036",
    type: "mcq",
    prompt: "The slides show alveolar PO2 at metabolic rates of 250 versus 1000 mL O2 per min. What do the slides conclude about a higher metabolic rate?",
    setup: "",
    ans: [
      { t: "More ventilation is needed for PO2", ok: true },
      { t: "Less ventilation is needed for the same PO2", ok: false },
      { t: "Alveolar PO2 becomes independent of flow", ok: false },
      { t: "Oxygen absorption falls as demand rises", ok: false },
    ],
    rationale: "The slides state that increasing metabolic rate raises oxygen absorption due to increased utilization, so increased ventilation is required to maintain arterial PO2. At 1000 mL O2 per min much higher ventilation is needed to reach the same alveolar PO2 than at 250.", // source: Ch 40 p 20
    scene: "pulmonary",
    sceneCfg: { label: "METABOLIC RATE" },
    metadata: { topic: "Metabolic rate and ventilation", priority: "high" },
  },

  {
    id: "pp2-w5g-037",
    type: "mcq",
    prompt: "On the Figure 40-4 slide, hyperventilation and hypoventilation are defined using alveolar PO2. Hyperventilation corresponds to which value?",
    setup: "",
    ans: [
      { t: "PAO2 above 100 mm Hg", ok: true },
      { t: "PAO2 below 100 mm Hg", ok: false },
      { t: "PAO2 equal to 40 mm Hg", ok: false },
      { t: "PAO2 below 60 mm Hg", ok: false },
    ],
    rationale: "On this slide hyperventilation is defined as ventilating above needs, giving PAO2 greater than 100 mm Hg, while hypoventilation is ventilating below needs, giving PAO2 less than 100 mm Hg. This complements the carbon dioxide based definition on other slides.", // source: Ch 40 p 20
    scene: "pulmonary",
    sceneCfg: { label: "VENT BY PO2" },
    metadata: { topic: "Hyper and hypoventilation by PO2", priority: "medium" },
  },

  {
    id: "pp2-w5g-038",
    type: "mcq",
    prompt: "The slides define hyperventilation in terms of alveolar carbon dioxide. Hyperventilation is defined as which of the following?",
    setup: "",
    ans: [
      { t: "PACO2 below 40 mm Hg", ok: true },
      { t: "PACO2 above 40 mm Hg", ok: false },
      { t: "PACO2 equal to 45 mm Hg", ok: false },
      { t: "PACO2 above 60 mm Hg", ok: false },
    ],
    rationale: "The slides define hyperventilation as PACO2 less than 40, reflecting ventilation in excess of metabolic carbon dioxide production. Hypoventilation by contrast is PACO2 greater than 40.", // source: Ch 40 p 15
    scene: "pulmonary",
    sceneCfg: { label: "HYPERVENT CO2" },
    metadata: { topic: "Hyperventilation by CO2", priority: "medium" },
  },

  {
    id: "pp2-w5g-039",
    type: "mcq",
    prompt: "According to the slides, how does increasing the V/Q ratio change alveolar gas partial pressures?",
    setup: "",
    ans: [
      { t: "Raises PAO2 and lowers PACO2", ok: true },
      { t: "Lowers the PAO2 and raises PACO2", ok: false },
      { t: "Raises both PAO2 and PACO2", ok: false },
      { t: "Lowers both PAO2 and PACO2", ok: false },
    ],
    rationale: "The slides state that increasing V/Q produces higher alveolar PO2 and lower alveolar PCO2 because more ventilation relative to perfusion drives alveolar gas toward inspired values. Decreasing V/Q does the opposite.", // source: Ch 40 p 15
    scene: "pulmonary",
    sceneCfg: { label: "VQ DIRECTION" },
    metadata: { topic: "V/Q directional effect", priority: "high" },
  },

  {
    id: "pp2-w5g-040",
    type: "mcq",
    prompt: "On the partial pressures along the airway figure, which portion of expired gas leaves the airway first?",
    setup: "",
    ans: [
      { t: "Dead space air", ok: true },
      { t: "Pure alveolar air", ok: false },
      { t: "Mixed venous gas", ok: false },
      { t: "Humidified tracheal air", ok: false },
    ],
    rationale: "The figure shows dead space air, with a high PO2 near 150 and PCO2 near 0, exiting first, followed by a mixture of dead space and alveolar air, then alveolar air with PO2 near 100 and PCO2 near 40. Dead space gas did not participate in exchange so it resembles inspired air.", // source: Ch 40 p 22
    scene: "pulmonary",
    sceneCfg: { label: "DEAD SPACE FIRST" },
    metadata: { topic: "Airway partial pressures", priority: "medium" },
  },

  {
    id: "pp2-w5g-041",
    type: "mcq",
    prompt: "On the partial pressures along the airway figure, how do PO2 and PCO2 change as expiration proceeds from dead space air to alveolar air?",
    setup: "",
    ans: [
      { t: "PO2 falls and PCO2 rises", ok: true },
      { t: "PO2 rises while PCO2 falls", ok: false },
      { t: "Both PO2 and PCO2 rise", ok: false },
      { t: "Both PO2 and PCO2 fall", ok: false },
    ],
    rationale: "As expired gas shifts from dead space air to alveolar air, PO2 falls from about 150 to about 100 and PCO2 rises from about 0 to about 40. Alveolar air has given up oxygen to and received carbon dioxide from the blood.", // source: Ch 40 p 22
    scene: "pulmonary",
    sceneCfg: { label: "AIRWAY TRENDS" },
    metadata: { topic: "Airway gas trends", priority: "medium" },
  },

  {
    id: "pp2-w5g-042",
    type: "mcq",
    prompt: "The slides give the diffusing capacity formula. Which expression matches what is shown?",
    setup: "",
    ans: [
      { t: "DL is area times coefficient over thickness", ok: true },
      { t: "DL equals thickness times area over coefficient", ok: false },
      { t: "DL equals coefficient over area times thickness", ok: false },
      { t: "DL equals thickness over area times coefficient", ok: false },
    ],
    rationale: "The slides give DL equal to area times the diffusion coefficient divided by thickness, and diffusion equal to the pressure gradient times DL. Diffusing capacity therefore rises with surface area and falls as the membrane thickens.", // source: Ch 40 p 23
    scene: "pulmonary",
    sceneCfg: { label: "DL FORMULA" },
    metadata: { topic: "Diffusing capacity formula", priority: "medium" },
  },

  {
    id: "pp2-w5g-043",
    type: "mcq",
    prompt: "According to the slides, what happens to the diffusing capacity of the lung during exercise?",
    setup: "",
    ans: [
      { t: "It increases", ok: true },
      { t: "It decreases", ok: false },
      { t: "It stays unchanged", ok: false },
      { t: "It falls then stops", ok: false },
    ],
    rationale: "The slides state diffusing capacity can change, such as during exercise, and the figure shows higher diffusing capacity values during exercise for CO, O2, and CO2. Increased capillary recruitment and surface area during exercise raise the diffusing capacity.", // source: Ch 40 p 23
    scene: "pulmonary",
    sceneCfg: { label: "DL EXERCISE" },
    metadata: { topic: "Diffusing capacity in exercise", priority: "medium" },
  },

  {
    id: "pp2-w5g-044",
    type: "mcq",
    prompt: "The slides describe causes of ventilation perfusion mismatch. Which pairing of pathology to mechanism matches the slides?",
    setup: "",
    ans: [
      { t: "Pulmonary embolism reduces perfusion", ok: true },
      { t: "Pulmonary embolism reduces ventilation", ok: false },
      { t: "Asthma reduces regional perfusion", ok: false },
      { t: "Asthma blocks pulmonary blood flow", ok: false },
    ],
    rationale: "The slides list asthma as a pathology that changes regional ventilation and pulmonary embolism as one that changes perfusion, both increasing V/Q mismatch. An embolus obstructs blood flow, reducing perfusion to the affected region.", // source: Ch 40 p 26
    scene: "pulmonary",
    sceneCfg: { label: "VQ MISMATCH" },
    metadata: { topic: "V/Q mismatch causes", priority: "high" },
  },

  {
    id: "pp2-w5g-045",
    type: "mcq",
    prompt: "The slides attribute uneven regional ventilation and uneven regional perfusion in a normal lung to which factors?",
    setup: "",
    ans: [
      { t: "Airway expansion and vessel geometry", ok: true },
      { t: "Surfactant loss and capillary rupture", ok: false },
      { t: "Bronchospasm with local clot formation", ok: false },
      { t: "Alveolar collapse and venous pooling", ok: false },
    ],
    rationale: "The slides state that differences in airway and lung expansion produce uneven regional ventilation, while differences in vascular geometry and hydrostatic pressures produce uneven regional blood flow. These normal regional differences make V/Q vary across a healthy lung.", // source: Ch 40 p 26
    scene: "pulmonary",
    sceneCfg: { label: "REGIONAL CAUSES" },
    metadata: { topic: "Regional ventilation and perfusion", priority: "medium" },
  },

  {
    id: "pp2-w5g-046",
    type: "mcq",
    prompt: "On the schematic lung unit slide, blood entering the unit is labeled mixed venous. What does Q with a dot over it represent on that figure?",
    setup: "",
    ans: [
      { t: "Blood flow in mL per min", ok: true },
      { t: "Alveolar pressure in mm Hg", ok: false },
      { t: "Oxygen content of blood", ok: false },
      { t: "Ventilation in mL per min", ok: false },
    ],
    rationale: "On the schematic lung unit, Q with a dot denotes blood flow in mL per min while VA with a dot denotes alveolar ventilation in mL per min. Mixed venous blood enters and arterial blood leaves the unit.", // source: Ch 40 p 11
    scene: "pulmonary",
    sceneCfg: { label: "LUNG UNIT Q" },
    metadata: { topic: "Schematic lung unit variables", priority: "medium" },
  },

  {
    id: "pp2-w5g-047",
    type: "mcq",
    prompt: "According to the slides on slow dilution of alveolar gas, how does changing the ventilation rate affect the rate at which alveolar gas is diluted or replaced?",
    setup: "",
    ans: [
      { t: "Higher rate speeds dilution", ok: true },
      { t: "Higher rate slows dilution", ok: false },
      { t: "Rate has no effect on it", ok: false },
      { t: "Dilution stops at high rates", ok: false },
    ],
    rationale: "The slides state that increasing the ventilation rate increases the rate of dilution of alveolar gas, and decreasing the rate slows it. Even so, replacement is gradual because each breath exchanges only a fraction of the functional residual capacity.", // source: Ch 40 p 10
    scene: "pulmonary",
    sceneCfg: { label: "VENT RATE DILUTION" },
    metadata: { topic: "Ventilation rate and dilution", priority: "medium" },
  },

  {
    id: "pp2-w5g-048",
    type: "mcq",
    prompt: "On the graph relating alveolar partial pressures to alveolar ventilation, how are alveolar PO2 and PCO2 related as ventilation changes?",
    setup: "",
    ans: [
      { t: "Inversely, by way of ventilation", ok: true },
      { t: "Directly, both rise with ventilation", ok: false },
      { t: "Unrelated to each other entirely", ok: false },
      { t: "Directly, both fall with ventilation", ok: false },
    ],
    rationale: "The slides show alveolar PO2 and PCO2 are inversely related through alveolar ventilation; as ventilation rises, PO2 climbs toward a plateau while PCO2 falls. They move oppositely because ventilation adds oxygen and removes carbon dioxide together.", // source: Ch 40 p 12
    scene: "pulmonary",
    sceneCfg: { label: "INVERSE RELATION" },
    metadata: { topic: "Inverse PO2 PCO2 relationship", priority: "high" },
  },

  {
    id: "pp2-w5g-049",
    type: "mcq",
    prompt: "Using the alveolar PCO2 relationship on the slides, what happens to alveolar PCO2 if alveolar ventilation is doubled while CO2 production stays constant?",
    setup: "",
    ans: [
      { t: "It falls to one half", ok: true },
      { t: "It rises to about double", ok: false },
      { t: "It stays nearly unchanged", ok: false },
      { t: "It rises by about 863", ok: false },
    ],
    rationale: "Because alveolar PCO2 is inversely proportional to alveolar ventilation, doubling ventilation halves PCO2 and halving ventilation doubles it, assuming carbon dioxide production is constant. This makes alveolar ventilation the main control of arterial carbon dioxide.", // source: Ch 40 p 17
    scene: "pulmonary",
    sceneCfg: { label: "VENT DOUBLES PCO2" },
    metadata: { topic: "Ventilation doubling and PCO2", priority: "high" },
  },

  {
    id: "pp2-w5g-050",
    type: "mcq",
    prompt: "On the slides, mixed venous blood enters the pulmonary capillary before exchange. What are its approximate PO2 and PCO2?",
    setup: "",
    ans: [
      { t: "PO2 40 and PCO2 45", ok: true },
      { t: "PO2 100 and PCO2 40", ok: false },
      { t: "PO2 104 and PCO2 40", ok: false },
      { t: "PO2 149 and PCO2 0", ok: false },
    ],
    rationale: "The slides give mixed venous blood as PO2 about 40 and PCO2 about 45. After gas exchange the blood is arterialized to PO2 about 100 and PCO2 about 40, the systemic arterial values.", // source: Ch 40 p 18
    scene: "pulmonary",
    sceneCfg: { label: "MIXED VENOUS" },
    metadata: { topic: "Mixed venous gas values", priority: "medium" },
  },

  {
    id: "pp2-w5g-051",
    type: "mcq",
    prompt: "The slides compare CO2 excretion at two metabolic rates. What change in CO2 excretion accompanies a fourfold rise in metabolic rate?",
    setup: "",
    ans: [
      { t: "Rises from 200 to 800", ok: true },
      { t: "Rises from 200 to 400 mL per min", ok: false },
      { t: "Falls from 800 to 200 mL per min", ok: false },
      { t: "Stays near 200 mL per min", ok: false },
    ],
    rationale: "The slides show carbon dioxide excretion rising from 200 to 800 mL per min as metabolic rate increases fourfold. Ventilation must increase in step to keep alveolar PCO2 from rising as production climbs.", // source: Ch 40 p 21
    scene: "pulmonary",
    sceneCfg: { label: "CO2 EXCRETION" },
    metadata: { topic: "CO2 excretion and metabolic rate", priority: "medium" },
  },

  {
    id: "pp2-w5g-052",
    type: "mcq",
    prompt: "The slides state that when there is no diffusion impairment, what is true of alveolar and end capillary gas partial pressures?",
    setup: "",
    ans: [
      { t: "They are essentially equal", ok: true },
      { t: "Alveolar greatly exceeds end capillary", ok: false },
      { t: "End capillary exceeds alveolar", ok: false },
      { t: "They differ by the value of R", ok: false },
    ],
    rationale: "The slides state that with no diffusion impairment the PO2 between an alveolus and end capillary blood are usually the same, and the same holds for PCO2. Complete equilibration occurs because blood spends enough time in the capillary to match alveolar gas.", // source: Ch 40 p 25
    scene: "pulmonary",
    sceneCfg: { label: "END CAPILLARY" },
    metadata: { topic: "Alveolar end capillary equilibration", priority: "high" },
  },

  {
    id: "pp2-w5t-023",
    type: "mcq",
    prompt: "Oxygen content is best described as which of the following?",
    setup: "",
    ans: [
      { t: "Total oxygen amount per 100 mL blood", ok: true },
      { t: "Pressure that oxygen exerts in the plasma", ok: false },
      { t: "Percent of hemoglobin with oxygen bound", ok: false },
      { t: "Diffusion driving force for the oxygen", ok: false },
    ],
    rationale: "Content is the total quantity of oxygen carried, expressed as mL O2 per 100 mL blood (dissolved plus hemoglobin bound). Partial pressure is the driving force for diffusion, and saturation is the percent of hemoglobin occupied by oxygen; neither states an absolute amount.", // source: Ch 41 p 2
    scene: "pulmonary",
    sceneCfg: { label: "O2 CONTENT" },
    metadata: { topic: "Oxygen measurements", priority: "high" },
  },

  {
    id: "pp2-w5t-024",
    type: "mcq",
    prompt: "On the slides, percent oxygen saturation equals HbO2 divided by which quantity?",
    setup: "",
    ans: [
      { t: "Hb plus HbO2", ok: true },
      { t: "Total dissolved oxygen", ok: false },
      { t: "Hb minus HbO2", ok: false },
      { t: "Arterial oxygen content", ok: false },
    ],
    rationale: "Saturation equals oxygenated hemoglobin divided by the sum of deoxygenated and oxygenated hemoglobin, HbO2 over (Hb plus HbO2). It is a ratio of bound sites to total sites and does not involve dissolved oxygen or content.", // source: Ch 41 p 3
    scene: "pulmonary",
    sceneCfg: { label: "SAT FORMULA" },
    metadata: { topic: "Oxygen measurements", priority: "medium" },
  },

  {
    id: "pp2-w5t-025",
    type: "mcq",
    prompt: "Why does systemic arterial PO2 fall to about 100 mm Hg when pulmonary capillary blood reaches 104 mm Hg?",
    setup: "",
    ans: [
      { t: "Venous admixture from physiologic shunt", ok: true },
      { t: "Carbon dioxide displacing oxygen in plasma", ok: false },
      { t: "Slow diffusion across the alveolar wall", ok: false },
      { t: "Hemoglobin releasing oxygen in arteries", ok: false },
    ],
    rationale: "End-pulmonary-capillary blood at 104 mm Hg mixes with a small amount of deoxygenated blood from the normal physiologic shunt (bronchial and Thebesian venous return), lowering arterial PO2 to about 100 mm Hg. It is not from CO2, diffusion delay, or arterial unloading.", // source: Ch 41 p 5
    scene: "pulmonary",
    sceneCfg: { label: "ARTERIAL DROP" },
    metadata: { topic: "Blood oxygen", priority: "medium" },
  },

  {
    id: "pp2-w5t-026",
    type: "mcq",
    prompt: "According to the slides, alveolar gas has what PO2 and PCO2?",
    setup: "",
    ans: [
      { t: "PO2 104, CO2 40", ok: true },
      { t: "PO2 159, PCO2 0", ok: false },
      { t: "PO2 149, PCO2 0", ok: false },
      { t: "PO2 40, PCO2 45", ok: false },
    ],
    rationale: "Alveolar PO2 is 104 mm Hg (some sources round to 100 to ease the math) with an alveolar PCO2 of 40 mm Hg. Dry atmospheric air is 159, humidified tracheal air is 149, and 40 over 45 describes tissue capillary CO2.", // source: Ch 41 p 6
    scene: "pulmonary",
    sceneCfg: { label: "ALVEOLAR GAS" },
    metadata: { topic: "Gas cascade", priority: "high" },
  },

  {
    id: "pp2-w5t-027",
    type: "mcq",
    prompt: "With no red cells present, oxygen still diffuses into plasma. What does the slide conclude about this?",
    setup: "",
    ans: [
      { t: "Partial pressure holds but content is tiny", ok: true },
      { t: "Both partial pressure and content collapse", ok: false },
      { t: "Content stays normal without hemoglobin", ok: false },
      { t: "Oxygen can no longer enter the plasma", ok: false },
    ],
    rationale: "Dissolved oxygen equilibrates by diffusion, so plasma partial pressure is maintained near the alveolar value, but because oxygen solubility is low the content is minimal (about 0.3 mL per dL). This shows hemoglobin is needed for adequate content, not for partial pressure.", // source: Ch 41 p 7
    scene: "pulmonary",
    sceneCfg: { label: "NO RED CELLS" },
    metadata: { topic: "Oxygen carriage", priority: "medium" },
  },

  {
    id: "pp2-w5t-028",
    type: "mcq",
    prompt: "On the slides, the intracellular PO2 within tissue cells is about what value?",
    setup: "",
    ans: [
      { t: "23 mm Hg", ok: true },
      { t: "40 mm Hg", ok: false },
      { t: "95 mm Hg", ok: false },
      { t: "5 mm Hg", ok: false },
    ],
    rationale: "Intracellular PO2 is about 23 mm Hg, lower than the interstitial 30 to 40 and the arterial 95 to 100 because oxygen is consumed by mitochondria. This low value still supports oxidative metabolism with a margin to spare.", // source: Ch 41 p 8
    scene: "pulmonary",
    sceneCfg: { label: "INTRACELLULAR PO2" },
    metadata: { topic: "Tissue oxygen", priority: "high" },
  },

  {
    id: "pp2-w5t-029",
    type: "mcq",
    prompt: "On the slides, what two opposing factors set tissue PO2?",
    setup: "",
    ans: [
      { t: "Oxygen delivery and oxygen usage", ok: true },
      { t: "Oxygen delivery and CO2 removal", ok: false },
      { t: "Ventilation rate and perfusion rate", ok: false },
      { t: "Hemoglobin level and plasma volume", ok: false },
    ],
    rationale: "Tissue PO2 reflects the balance of oxygen delivery (content times blood flow) against oxygen usage by the cells. When delivery exceeds usage tissue PO2 rises, and when usage outpaces delivery it falls.", // source: Ch 41 p 8
    scene: "pulmonary",
    sceneCfg: { label: "TISSUE BALANCE" },
    metadata: { topic: "Tissue oxygen", priority: "medium" },
  },

  {
    id: "pp2-w5t-030",
    type: "mcq",
    prompt: "On the slides, the upper limit of interstitial fluid PO2 even at infinitely high blood flow is about what value?",
    setup: "",
    ans: [
      { t: "About 95 mm Hg", ok: true },
      { t: "About 40 mm Hg", ok: false },
      { t: "About 23 mm Hg", ok: false },
      { t: "About 159 mm Hg", ok: false },
    ],
    rationale: "Interstitial PO2 can rise toward the arterial value of about 95 mm Hg as flow increases without limit, but it cannot exceed it. Higher oxygen consumption shifts the whole curve downward.", // source: Ch 41 p 9
    scene: "pulmonary",
    sceneCfg: { label: "INFINITE FLOW LIMIT" },
    metadata: { topic: "Tissue oxygen", priority: "medium" },
  },

  {
    id: "pp2-w5t-031",
    type: "mcq",
    prompt: "In the tissue capillary diagram, what is the PCO2 at the venous end of the capillary?",
    setup: "",
    ans: [
      { t: "45 mm Hg", ok: true },
      { t: "40 mm Hg", ok: false },
      { t: "46 mm Hg", ok: false },
      { t: "60 mm Hg", ok: false },
    ],
    rationale: "Blood enters the tissue capillary at a PCO2 of 40 and leaves the venous end at 45 mm Hg after picking up CO2. The cell interior is highest at 46 and the interstitial fluid is 45.", // source: Ch 41 p 10
    scene: "pulmonary",
    sceneCfg: { label: "VENOUS PCO2" },
    metadata: { topic: "Tissue carbon dioxide", priority: "medium" },
  },

  {
    id: "pp2-w5t-032",
    type: "mcq",
    prompt: "Per the slide, how does increased tissue metabolism with unchanged blood flow affect tissue PCO2?",
    setup: "",
    ans: [
      { t: "It raises tissue PCO2", ok: true },
      { t: "It lowers tissue PCO2", ok: false },
      { t: "It leaves PCO2 unchanged", ok: false },
      { t: "It raises the tissue PO2", ok: false },
    ],
    rationale: "When metabolism rises but flow does not increase to clear it, CO2 accumulates and tissue PCO2 rises. Greater blood flow would wash out CO2 and lower tissue PCO2 toward the arterial value.", // source: Ch 41 p 11
    scene: "pulmonary",
    sceneCfg: { label: "METABOLISM PCO2" },
    metadata: { topic: "Tissue carbon dioxide", priority: "medium" },
  },

  {
    id: "pp2-w5t-033",
    type: "mcq",
    prompt: "Using the dissolved oxygen relationship on the slides, what is the solubility coefficient of oxygen in plasma?",
    setup: "",
    ans: [
      { t: "0.003 mL per dL per mm Hg", ok: true },
      { t: "1.34 mL O2 per gram of the Hgb", ok: false },
      { t: "0.3 mL O2 per dL of the plasma", ok: false },
      { t: "20 mL O2 per dL of the blood", ok: false },
    ],
    rationale: "The solubility coefficient is 0.003 mL O2 per dL of plasma per mm Hg, which at a PaO2 of 100 yields about 0.3 mL per dL dissolved. The 1.34 figure is hemoglobin capacity per gram and 20 mL per dL is total bound content.", // source: Ch 41 p 14
    scene: "pulmonary",
    sceneCfg: { label: "O2 SOLUBILITY" },
    metadata: { topic: "Oxygen carriage", priority: "high" },
  },

  {
    id: "pp2-w5t-034",
    type: "mcq",
    prompt: "What is the normal whole-body oxygen consumption stated on the slides?",
    setup: "",
    ans: [
      { t: "250 mL O2 per minute", ok: true },
      { t: "1000 mL O2 per minute", ok: false },
      { t: "20 mL O2 per minute", ok: false },
      { t: "5000 mL O2 per minute", ok: false },
    ],
    rationale: "Normal resting oxygen consumption is about 250 mL O2 per minute. The slide notes this could not be met by dissolved oxygen alone, which is why hemoglobin is essential.", // source: Ch 41 p 14
    scene: "pulmonary",
    sceneCfg: { label: "O2 CONSUMPTION" },
    metadata: { topic: "Oxygen consumption", priority: "medium" },
  },

  {
    id: "pp2-w5t-035",
    type: "mcq",
    prompt: "Approximately what percentage of oxygen in blood is carried bound to hemoglobin rather than dissolved?",
    setup: "",
    ans: [
      { t: "About 97 percent", ok: true },
      { t: "About 70 percent", ok: false },
      { t: "About 50 percent", ok: false },
      { t: "About 23 percent", ok: false },
    ],
    rationale: "About 97 percent of transported oxygen is bound to hemoglobin, with only about 3 percent dissolved. This dominance is why hemoglobin concentration largely determines oxygen content.", // source: Ch 41 p 14
    scene: "pulmonary",
    sceneCfg: { label: "PERCENT BOUND" },
    metadata: { topic: "Oxygen carriage", priority: "medium" },
  },

  {
    id: "pp2-w5t-036",
    type: "mcq",
    prompt: "Using 1.34 mL O2 per gram and 15 g Hb per 100 mL, about how much hemoglobin-bound oxygen is carried?",
    setup: "",
    ans: [
      { t: "About 20 mL per 100 mL", ok: true },
      { t: "About 13 mL per 100 mL", ok: false },
      { t: "About 0.3 mL per 100 mL", ok: false },
      { t: "About 5 mL per 100 mL", ok: false },
    ],
    rationale: "1.34 mL per gram times 15 g per dL at full saturation gives about 20 mL O2 per 100 mL blood. An anemic patient with 10 g per dL carries only about 13 mL per dL.", // source: Ch 41 p 15
    scene: "pulmonary",
    sceneCfg: { label: "BOUND CONTENT" },
    metadata: { topic: "Oxygen carriage", priority: "high" },
  },

  {
    id: "pp2-w5t-037",
    type: "mcq",
    prompt: "On the slides, anemia with 10 g Hb per dL gives an oxygen carrying capacity of about what value?",
    setup: "",
    ans: [
      { t: "13 mL O2 per 100 mL", ok: true },
      { t: "20 mL O2 per 100 mL", ok: false },
      { t: "5 mL O2 per 100 mL", ok: false },
      { t: "0.3 mL O2 per 100 mL", ok: false },
    ],
    rationale: "With 10 g Hb per dL and 1.34 mL O2 per gram, capacity is about 13 mL O2 per 100 mL, compared with 20 mL at the normal 15 g per dL. Saturation can stay normal while content falls.", // source: Ch 41 p 15
    scene: "pulmonary",
    sceneCfg: { label: "ANEMIA CONTENT" },
    metadata: { topic: "Oxygen carriage", priority: "medium" },
  },

  {
    id: "pp2-w5t-038",
    type: "mcq",
    prompt: "On the slides, what is the approximate PO2 of mixed venous blood during exercise?",
    setup: "",
    ans: [
      { t: "About 15 mm Hg", ok: true },
      { t: "About 40 mm Hg", ok: false },
      { t: "About 60 mm Hg", ok: false },
      { t: "About 95 mm Hg", ok: false },
    ],
    rationale: "Exercising tissue extracts far more oxygen, dropping venous PO2 to about 15 mm Hg on the steep part of the curve. Normal resting venous blood is 40 mm Hg and normal arterial blood is 95 mm Hg.", // source: Ch 41 p 18
    scene: "pulmonary",
    sceneCfg: { label: "EXERCISE VENOUS PO2" },
    metadata: { topic: "Dissociation curve", priority: "medium" },
  },

  {
    id: "pp2-w5t-039",
    type: "mcq",
    prompt: "On the curve values to remember, a PO2 of 40 mm Hg corresponds to what saturation and content?",
    setup: "",
    ans: [
      { t: "75 percent, 15 mL per dL", ok: true },
      { t: "25 percent, 5 mL per dL", ok: false },
      { t: "90 percent, 18 mL per dL", ok: false },
      { t: "100 percent, 20 mL per dL", ok: false },
    ],
    rationale: "At a PO2 of 40 mm Hg, which is normal mixed venous blood, saturation is 75 percent and content is 15 mL per dL. A PO2 of 20 gives 25 percent and 5 mL per dL, and a PO2 of 100 gives full saturation and 20 mL per dL.", // source: Ch 41 p 19
    scene: "pulmonary",
    sceneCfg: { label: "PO2 40 VALUES" },
    metadata: { topic: "Dissociation curve values", priority: "high" },
  },

  {
    id: "pp2-w5t-040",
    type: "mcq",
    prompt: "The 4,5,6 to 7,8,9 rule pairs which PO2 values with which saturations for 15 g per dL Hgb?",
    setup: "",
    ans: [
      { t: "40, 50, 60 give 70, 80, 90", ok: true },
      { t: "40, 50, 60 give 75, 85, 95", ok: false },
      { t: "20, 40, 60 give 70, 80, 90", ok: false },
      { t: "50, 60, 70 give 80, 90, 95", ok: false },
    ],
    rationale: "The rule maps PO2 of 40, 50, 60 mm Hg to saturations of 70, 80, 90 percent for a person with 15 g per dL hemoglobin, a quick bedside estimate of the steep part of the curve.", // source: Ch 41 p 19
    scene: "pulmonary",
    sceneCfg: { label: "456 789 RULE" },
    metadata: { topic: "Dissociation curve values", priority: "medium" },
  },

  {
    id: "pp2-w5t-041",
    type: "mcq",
    prompt: "At an alveolar PO2 of 60 mm Hg, what is the approximate hemoglobin saturation per the slides?",
    setup: "",
    ans: [
      { t: "89 percent", ok: true },
      { t: "75 percent", ok: false },
      { t: "98 percent", ok: false },
      { t: "60 percent", ok: false },
    ],
    rationale: "A PO2 of 60 mm Hg still yields about 89 percent saturation, illustrating that over a wide range of alveolar PO2 the hemoglobin remains highly saturated because of the flat upper plateau of the curve.", // source: Ch 41 p 20
    scene: "pulmonary",
    sceneCfg: { label: "PO2 60 SAT" },
    metadata: { topic: "Dissociation curve", priority: "medium" },
  },

  {
    id: "pp2-w5t-042",
    type: "mcq",
    prompt: "On the slides, why does oxygen uptake stay complete during exercise despite a shorter capillary transit time?",
    setup: "",
    ans: [
      { t: "Equilibration still occurs in the time", ok: true },
      { t: "Transit time actually lengthens then", ok: false },
      { t: "Diffusing capacity falls during exercise", ok: false },
      { t: "Alveolar PO2 drops to match the blood", ok: false },
    ],
    rationale: "Even though increased cardiac output shortens transit time, the large diffusion safety factor means equilibration still occurs within the available time, aided by increased diffusing capacity from opening capillaries and better V/Q matching.", // source: Ch 41 p 21
    scene: "pulmonary",
    sceneCfg: { label: "EXERCISE EQUIL" },
    metadata: { topic: "Exercise uptake", priority: "medium" },
  },

  {
    id: "pp2-w5t-043",
    type: "mcq",
    prompt: "On the slides, what is oxygen delivery at normal output when content is 20 mL per 100 mL and flow is 5000 mL per min?",
    setup: "",
    ans: [
      { t: "1000 mL O2 per min", ok: true },
      { t: "4000 mL O2 per min", ok: false },
      { t: "250 mL O2 per min", ok: false },
      { t: "100 mL O2 per min", ok: false },
    ],
    rationale: "Delivery equals content times flow, so 20 mL per 100 mL times 5000 mL per min equals 1000 mL O2 per min. Raising flow to 20000 mL per min raises delivery to 4000 mL per min.", // source: Ch 41 p 23
    scene: "pulmonary",
    sceneCfg: { label: "DELIVERY CALC" },
    metadata: { topic: "Oxygen delivery", priority: "medium" },
  },

  {
    id: "pp2-w5t-044",
    type: "mcq",
    prompt: "On the slides, the right shift labeled the Bohr effect is driven mainly by which change?",
    setup: "",
    ans: [
      { t: "Increased carbon dioxide", ok: true },
      { t: "Increased carbon monoxide", ok: false },
      { t: "Decreased temperature", ok: false },
      { t: "Decreased hydrogen ions", ok: false },
    ],
    rationale: "The slide names increased CO2 as the Bohr effect, which along with increased hydrogen ions, increased temperature, and increased BPG shifts the curve right. Lower temperature and fewer hydrogen ions shift it left, and carbon monoxide is unrelated to the Bohr effect.", // source: Ch 41 p 24
    scene: "pulmonary",
    sceneCfg: { label: "BOHR EFFECT" },
    metadata: { topic: "Curve shifts", priority: "medium" },
  },

  {
    id: "pp2-w5t-045",
    type: "mcq",
    prompt: "On the dissociation curve, which pH value lies farthest to the right?",
    setup: "",
    ans: [
      { t: "pH 7.2", ok: true },
      { t: "pH 7.4", ok: false },
      { t: "pH 7.6", ok: false },
      { t: "pH 7.5", ok: false },
    ],
    rationale: "Lower pH shifts the curve right, so pH 7.2 sits farthest right, pH 7.4 is the normal middle curve, and pH 7.6 sits left. A more acidic environment lowers oxygen affinity and aids unloading.", // source: Ch 41 p 24
    scene: "pulmonary",
    sceneCfg: { label: "PH SHIFT" },
    metadata: { topic: "Curve shifts", priority: "medium" },
  },

  {
    id: "pp2-w5t-046",
    type: "mcq",
    prompt: "A rightward shift of the dissociation curve indicates which change in hemoglobin behavior?",
    setup: "",
    ans: [
      { t: "Reduced oxygen affinity", ok: true },
      { t: "Increased oxygen affinity", ok: false },
      { t: "Higher saturation at low PO2", ok: false },
      { t: "Greater oxygen loading in lungs", ok: false },
    ],
    rationale: "A right shift means that for any given PO2 the percent saturation is lower, so hemoglobin holds oxygen less tightly. This reduced affinity favors oxygen release at the tissues; it does not raise saturation or improve loading.", // source: Ch 41 p 25
    scene: "pulmonary",
    sceneCfg: { label: "RIGHT SHIFT AFFINITY" },
    metadata: { topic: "Curve shifts", priority: "high" },
  },

  {
    id: "pp2-w5t-047",
    type: "mcq",
    prompt: "On the slides, BPG (2,3 biphosphoglycerate) has which effect on hemoglobin?",
    setup: "",
    ans: [
      { t: "Lowers oxygen affinity", ok: true },
      { t: "Raises oxygen affinity", ok: false },
      { t: "Shifts the curve leftward", ok: false },
      { t: "Blocks carbon dioxide carriage", ok: false },
    ],
    rationale: "BPG is a metabolic phosphate compound that reduces the affinity of hemoglobin for oxygen, shifting the curve right and promoting oxygen release; in hypoxia rising BPG enhances tissue oxygen delivery.", // source: Ch 41 p 25
    scene: "pulmonary",
    sceneCfg: { label: "BPG EFFECT" },
    metadata: { topic: "Curve shifts", priority: "medium" },
  },

  {
    id: "pp2-w5t-048",
    type: "mcq",
    prompt: "Why does a rightward shift of the curve at the tissue aid oxygen unloading?",
    setup: "",
    ans: [
      { t: "It keeps the pressure gradient", ok: true },
      { t: "It raises the hemoglobin affinity", ok: false },
      { t: "It increases the blood flow rate", ok: false },
      { t: "It lowers the tissue oxygen demand", ok: false },
    ],
    rationale: "At the tissue, increased CO2 lowers oxygen affinity and a right shift keeps the partial pressure gradient favorable for oxygen to leave hemoglobin and diffuse into cells. It does not raise affinity, alter flow, or change demand.", // source: Ch 41 p 26
    scene: "pulmonary",
    sceneCfg: { label: "TISSUE RIGHT SHIFT" },
    metadata: { topic: "Curve shifts", priority: "medium" },
  },

  {
    id: "pp2-w5t-049",
    type: "mcq",
    prompt: "In the V/Q diagram, which condition corresponds to a ventilation perfusion ratio of zero?",
    setup: "",
    ans: [
      { t: "Shunt", ok: true },
      { t: "Deadspace", ok: false },
      { t: "Normal alveolus", ok: false },
      { t: "Diffusion block", ok: false },
    ],
    rationale: "A V/Q of zero means perfusion without ventilation, which is a shunt; the alveolar gas equals incoming venous blood (O2 40, CO2 45). Deadspace is V/Q of infinity, and a normal alveolus has O2 100 and CO2 40.", // source: Ch 41 p 27
    scene: "pulmonary",
    sceneCfg: { label: "V/Q ZERO" },
    metadata: { topic: "V/Q spectrum", priority: "high" },
  },

  {
    id: "pp2-w5t-050",
    type: "mcq",
    prompt: "According to the slides, what is the normal physiologic shunt fraction?",
    setup: "",
    ans: [
      { t: "About 5 percent", ok: true },
      { t: "About 25 percent", ok: false },
      { t: "About 50 percent", ok: false },
      { t: "About 0 percent", ok: false },
    ],
    rationale: "The normal physiologic shunt is about 5 percent of blood flow, from bronchial venous return and Thebesian veins. This blood does not exchange gas and slightly lowers arterial oxygen.", // source: Ch 41 p 28
    scene: "pulmonary",
    sceneCfg: { label: "SHUNT FRACTION" },
    metadata: { topic: "Shunt", priority: "high" },
  },

  {
    id: "pp2-w5t-051",
    type: "mcq",
    prompt: "On the slides, which pair of normal physiologic shunt sources accounts for the 5 percent shunt fraction?",
    setup: "",
    ans: [
      { t: "Bronchial and Thebesian veins", ok: true },
      { t: "The coronary and renal veins", ok: false },
      { t: "The portal and hepatic veins", ok: false },
      { t: "The pulmonary and azygos veins", ok: false },
    ],
    rationale: "The normal 5 percent physiologic shunt comes from venous return of the bronchial circulation and the Thebesian veins draining directly into the left heart. These deoxygenated additions slightly lower arterial PO2.", // source: Ch 41 p 29
    scene: "pulmonary",
    sceneCfg: { label: "SHUNT SOURCES" },
    metadata: { topic: "Shunt", priority: "medium" },
  },

  {
    id: "pp2-w5t-052",
    type: "mcq",
    prompt: "On the slides, what is the normal alveolar to arterial oxygen difference, and how does it change with age?",
    setup: "",
    ans: [
      { t: "About 10 mm Hg, widens with age", ok: true },
      { t: "About 10 mm Hg, narrows with age", ok: false },
      { t: "About 40 mm Hg, fixed lifelong", ok: false },
      { t: "About 0 mm Hg, widens with age", ok: false },
    ],
    rationale: "The normal A-a oxygen difference is about 10 mm Hg and widens with age as lungs lose elastic recoil and diffusing capacity and small airways close, increasing V/Q mismatch.", // source: Ch 41 p 29
    scene: "pulmonary",
    sceneCfg: { label: "A-A DIFFERENCE" },
    metadata: { topic: "Shunt", priority: "high" },
  },

  {
    id: "pp2-w5t-053",
    type: "mcq",
    prompt: "How does arterial PO2 respond when a true shunt causes hypoxemia and FIO2 is increased?",
    setup: "",
    ans: [
      { t: "It increases very little", ok: true },
      { t: "It increases substantially", ok: false },
      { t: "It rises to normal quickly", ok: false },
      { t: "It falls below the baseline", ok: false },
    ],
    rationale: "Shunted blood bypasses ventilated alveoli, so it never contacts the extra inspired oxygen and arterial PO2 rises only slightly even at high FIO2. Larger shunt fractions respond even less.", // source: Ch 41 p 30
    scene: "pulmonary",
    sceneCfg: { label: "SHUNT FIO2" },
    metadata: { topic: "Shunt", priority: "high" },
  },

  {
    id: "pp2-w5t-054",
    type: "mcq",
    prompt: "On the slides, regions of the lung with a V/Q ratio greater than 1.0 have what effect on arterial oxygenation?",
    setup: "",
    ans: [
      { t: "Do not contribute to hypoxemia", ok: true },
      { t: "Are the main cause of hypoxemia", ok: false },
      { t: "Behave exactly like a shunt", ok: false },
      { t: "Always raise the arterial PCO2", ok: false },
    ],
    rationale: "High V/Q regions are over-ventilated relative to perfusion and cannot drive hypoxemia; it is the low V/Q regions that lower arterial oxygen. High V/Q is not a shunt and does not raise PCO2.", // source: Ch 41 p 32
    scene: "pulmonary",
    sceneCfg: { label: "HIGH VQ" },
    metadata: { topic: "V/Q mismatch", priority: "medium" },
  },

  {
    id: "pp2-w5t-055",
    type: "mcq",
    prompt: "Which of the following is NOT one of the five causes of hypoxemia listed on the slides?",
    setup: "",
    ans: [
      { t: "Increased BPG level", ok: true },
      { t: "Hypoventilation", ok: false },
      { t: "Right to left shunt", ok: false },
      { t: "Diffusion limitation", ok: false },
    ],
    rationale: "The five listed causes are hypoventilation, decreased barometric pressure, shunt, V/Q mismatch, and diffusion limitation. Increased BPG shifts the dissociation curve but is not a listed cause of hypoxemia, so it is the exception.", // source: Ch 41 p 33
    scene: "pulmonary",
    sceneCfg: { label: "FIVE CAUSES" },
    metadata: { topic: "Causes of hypoxemia", priority: "high" },
  },

  {
    id: "pp2-w5t-056",
    type: "mcq",
    prompt: "In the hypoxemia workup, a NORMAL alveolar to arterial oxygen difference points to which causes?",
    setup: "",
    ans: [
      { t: "Hypoventilation or altitude", ok: true },
      { t: "A shunt or a V/Q mismatch", ok: false },
      { t: "Diffusion block or a shunt", ok: false },
      { t: "Anemia or the carbon monoxide", ok: false },
    ],
    rationale: "A normal A-a difference indicates the lung is exchanging gas properly, so the low oxygen comes from hypoventilation or low inspired oxygen at altitude. An increased A-a difference instead points to shunt, V/Q mismatch, or diffusion limitation.", // source: Ch 41 p 34
    scene: "pulmonary",
    sceneCfg: { label: "NORMAL A-A" },
    metadata: { topic: "Hypoxemia workup", priority: "high" },
  },

  {
    id: "pp2-w5t-057",
    type: "mcq",
    prompt: "On the slides, which mechanism is identified as a cause of hypoventilation with an increased PCO2?",
    setup: "",
    ans: [
      { t: "CNS depression", ok: true },
      { t: "Atelectasis collapse", ok: false },
      { t: "Pulmonary embolism", ok: false },
      { t: "Interstitial fibrosis", ok: false },
    ],
    rationale: "Hypoventilation is associated with increased PCO2, and listed causes include CNS depression (such as narcotic overdose or brainstem stroke), obesity hypoventilation, and muscular weakness. Atelectasis is a shunt cause and fibrosis is a diffusion cause.", // source: Ch 41 p 35
    scene: "pulmonary",
    sceneCfg: { label: "HYPOVENTILATION CAUSE" },
    metadata: { topic: "Hypoxemia workup", priority: "medium" },
  },

  {
    id: "pp2-w5t-058",
    type: "mcq",
    prompt: "According to the slides, what is the most common cause of hypoxemia?",
    setup: "",
    ans: [
      { t: "V/Q mismatch", ok: true },
      { t: "Right to left shunt", ok: false },
      { t: "Alveolar hypoventilation", ok: false },
      { t: "Diffusion impairment", ok: false },
    ],
    rationale: "The slides label V/Q mismatch as the most common cause of hypoxemia. Shunt, hypoventilation, and diffusion impairment also cause hypoxemia but are less common.", // source: Ch 41 p 35
    scene: "pulmonary",
    sceneCfg: { label: "COMMONEST CAUSE" },
    metadata: { topic: "Causes of hypoxemia", priority: "medium" },
  },

  {
    id: "pp2-w5t-059",
    type: "mcq",
    prompt: "On the slides, dissolved carbon dioxide is approximately how soluble compared with oxygen?",
    setup: "",
    ans: [
      { t: "About 20 times more", ok: true },
      { t: "About 20 times less", ok: false },
      { t: "About the same as O2", ok: false },
      { t: "About 100 times more", ok: false },
    ],
    rationale: "CO2 is roughly 20 times more soluble than oxygen, which is why a meaningful amount travels dissolved (about 7 percent of total CO2) even though dissolved oxygen is negligible.", // source: Ch 41 p 36
    scene: "pulmonary",
    sceneCfg: { label: "CO2 SOLUBILITY" },
    metadata: { topic: "Carbon dioxide transport", priority: "medium" },
  },

  {
    id: "pp2-w5t-060",
    type: "mcq",
    prompt: "According to the carbon dioxide transport slide, what fraction of CO2 is carried as carbaminohemoglobin?",
    setup: "",
    ans: [
      { t: "23 percent", ok: true },
      { t: "7 percent", ok: false },
      { t: "70 percent", ok: false },
      { t: "45 percent", ok: false },
    ],
    rationale: "About 23 percent of CO2 binds hemoglobin as carbaminohemoglobin, 70 percent travels as bicarbonate, and 7 percent stays dissolved in plasma.", // source: Ch 41 p 37
    scene: "pulmonary",
    sceneCfg: { label: "CARBAMINO FRACTION" },
    metadata: { topic: "Carbon dioxide transport", priority: "medium" },
  },

  {
    id: "pp2-w5t-061",
    type: "mcq",
    prompt: "Inside the red blood cell, which enzyme catalyzes the reaction of carbon dioxide with water?",
    setup: "",
    ans: [
      { t: "Carbonic anhydrase", ok: true },
      { t: "Carboxypeptidase", ok: false },
      { t: "Adenylate cyclase", ok: false },
      { t: "Lactate dehydrogenase", ok: false },
    ],
    rationale: "Carbonic anhydrase rapidly converts CO2 and water into carbonic acid, which dissociates into bicarbonate and hydrogen ion. This reaction underlies the 70 percent of CO2 carried as bicarbonate and drives the chloride shift.", // source: Ch 41 p 37
    scene: "pulmonary",
    sceneCfg: { label: "CARBONIC ANHYDRASE" },
    metadata: { topic: "Carbon dioxide transport", priority: "high" },
  },

  {
    id: "pp2-w5t-062",
    type: "mcq",
    prompt: "As bicarbonate leaves the red cell, what does the chloride shift accomplish?",
    setup: "",
    ans: [
      { t: "Keeps electrical neutrality", ok: true },
      { t: "Speeds up carbonic anhydrase", ok: false },
      { t: "Raises the intracellular oxygen", ok: false },
      { t: "Removes hydrogen from the blood", ok: false },
    ],
    rationale: "Chloride moves into the red cell to balance the negative charge lost when bicarbonate diffuses out, preserving electrical neutrality. It does not catalyze the enzyme, change oxygen, or remove hydrogen ion, which is buffered by hemoglobin.", // source: Ch 41 p 37
    scene: "pulmonary",
    sceneCfg: { label: "CHLORIDE SHIFT" },
    metadata: { topic: "Carbon dioxide transport", priority: "high" },
  },

  {
    id: "pp2-w5t-063",
    type: "mcq",
    prompt: "Compared with the oxygen dissociation curve, the carbon dioxide dissociation curve is which of the following?",
    setup: "",
    ans: [
      { t: "More linear over normal range", ok: true },
      { t: "Steeply sigmoid and flat", ok: false },
      { t: "Identical to the oxygen curve", ok: false },
      { t: "Flat across all pressures", ok: false },
    ],
    rationale: "The CO2 curve is more linear than the sigmoid oxygen curve, with a normal operating range of about 40 to 45 mm Hg, so CO2 content changes more proportionally with PCO2.", // source: Ch 41 p 38
    scene: "pulmonary",
    sceneCfg: { label: "CO2 CURVE SHAPE" },
    metadata: { topic: "Carbon dioxide transport", priority: "medium" },
  },

  {
    id: "pp2-w5t-064",
    type: "mcq",
    prompt: "On the slides, what makes carbon monoxide so dangerous on its dissociation curve?",
    setup: "",
    ans: [
      { t: "Saturates Hb at low pressure", ok: true },
      { t: "Cannot bind any hemoglobin at all", ok: false },
      { t: "Raises dissolved oxygen greatly", ok: false },
      { t: "Needs a high pressure to bind", ok: false },
    ],
    rationale: "Carbon monoxide fully saturates hemoglobin at very low partial pressures because of its extremely high affinity, so even trace amounts displace oxygen and the curve sits far to the left.", // source: Ch 41 p 40
    scene: "pulmonary",
    sceneCfg: { label: "CO AFFINITY" },
    metadata: { topic: "Carbon monoxide", priority: "high" },
  },

  {
    id: "pp2-w5t-065",
    type: "mcq",
    prompt: "Why does a standard pulse oximeter fail to detect carbon monoxide poisoning?",
    setup: "",
    ans: [
      { t: "It reads a falsely normal value", ok: true },
      { t: "It cannot detect any hemoglobin", ok: false },
      { t: "It only measures dissolved oxygen", ok: false },
      { t: "It reads zero saturation falsely", ok: false },
    ],
    rationale: "A pulse oximeter cannot distinguish carboxyhemoglobin from oxyhemoglobin, so it displays a reassuring value near 99 percent even when oxygen carriage is severely impaired by carbon monoxide.", // source: Ch 41 p 41
    scene: "pulmonary",
    sceneCfg: { label: "PULSE OX CO" },
    metadata: { topic: "Carbon monoxide", priority: "high" },
  },

  {
    id: "pp2-w5t-066",
    type: "mcq",
    prompt: "On the slides, the alveolar gas equation for PAO2 includes which subtracted term?",
    setup: "",
    ans: [
      { t: "PACO2 divided by R", ok: true },
      { t: "PACO2 times the value R", ok: false },
      { t: "Dissolved oxygen content", ok: false },
      { t: "The water vapor content", ok: false },
    ],
    rationale: "The alveolar gas equation is PAO2 equals 0.21 times (PB minus PH2O) minus PACO2 divided by R, so alveolar CO2 divided by the respiratory quotient is subtracted. Multiplying rather than dividing by R, or subtracting content terms, is incorrect.", // source: Ch 41 p 12
    scene: "pulmonary",
    sceneCfg: { label: "GAS EQUATION" },
    metadata: { topic: "Alveolar gas equation", priority: "medium" },
  },

  {
    id: "pp2-w5t-067",
    type: "mcq",
    prompt: "On the slides, how does the oxygen dissociation curve differ in shape from dissolved plasma oxygen?",
    setup: "",
    ans: [
      { t: "Curve is sigmoid, plasma is linear", ok: true },
      { t: "Curve is linear, plasma is sigmoid", ok: false },
      { t: "Both rise in a sigmoid manner", ok: false },
      { t: "Both rise in a linear manner", ok: false },
    ],
    rationale: "Hemoglobin saturation follows a sigmoid (S shaped) curve against PO2, while oxygen physically dissolved in plasma rises linearly with PO2. The plateau of the sigmoid curve is why saturation stays high over a wide range.", // source: Ch 41 p 16
    scene: "pulmonary",
    sceneCfg: { label: "CURVE SHAPE" },
    metadata: { topic: "Dissociation curve", priority: "medium" },
  },

  {
    id: "pp2-w5t-068",
    type: "mcq",
    prompt: "On the dissociation curve, where does blood leaving the lungs lie relative to blood returning from tissues?",
    setup: "",
    ans: [
      { t: "On the flat upper plateau", ok: true },
      { t: "On the steep lower portion", ok: false },
      { t: "Below the venous reference", ok: false },
      { t: "At the very origin point", ok: false },
    ],
    rationale: "Oxygenated blood leaving the lungs sits on the flat upper plateau where saturation is near maximal, while reduced blood returning from the tissues sits on the steep portion where small PO2 changes unload large amounts of oxygen.", // source: Ch 41 p 17
    scene: "pulmonary",
    sceneCfg: { label: "CURVE REGIONS" },
    metadata: { topic: "Dissociation curve", priority: "medium" },
  },

  {
    id: "pp2-w5t-069",
    type: "mcq",
    prompt: "On the slides, which is NOT one of the three ways to increase oxygen delivery to tissue?",
    setup: "",
    ans: [
      { t: "Left shift of the curve", ok: true },
      { t: "Increased blood flow", ok: false },
      { t: "Increased oxygen extraction", ok: false },
      { t: "Right shift of the curve", ok: false },
    ],
    rationale: "The three listed strategies are increased flow, increased extraction, and a rightward curve shift that releases more oxygen. A left shift raises affinity and impairs unloading, so it is the exception.", // source: Ch 41 p 22
    scene: "pulmonary",
    sceneCfg: { label: "DELIVERY WAYS" },
    metadata: { topic: "Oxygen delivery", priority: "medium" },
  },

  {
    id: "pp2-w5t-070",
    type: "mcq",
    prompt: "On the slides, how is a V/Q mismatch distinguished from a true shunt at the bedside?",
    setup: "",
    ans: [
      { t: "Response to increasing FIO2", ok: true },
      { t: "Response to lowering the FIO2", ok: false },
      { t: "Measuring the venous oxygen", ok: false },
      { t: "Counting the respiratory rate", ok: false },
    ],
    rationale: "V/Q mismatch corrects with increasing FIO2 because the low V/Q units are still ventilated, while a true shunt does not, since shunted blood never contacts the extra oxygen. The discriminator is the response to a rise in inspired oxygen.", // source: Ch 41 p 31
    scene: "pulmonary",
    sceneCfg: { label: "VQ VS SHUNT" },
    metadata: { topic: "V/Q mismatch", priority: "high" },
  },

  {
    id: "pp2-w5t-071",
    type: "mcq",
    prompt: "On the Haldane effect figure, blood at a PO2 of 40 mm Hg carries how much CO2 versus blood at a PO2 of 100 mm Hg?",
    setup: "",
    ans: [
      { t: "More CO2 at the lower PO2", ok: true },
      { t: "Less CO2 at the lower PO2", ok: false },
      { t: "The same CO2 at both values", ok: false },
      { t: "No CO2 at either of them", ok: false },
    ],
    rationale: "The Haldane effect: at a PO2 of 40 (deoxygenated) hemoglobin carries more CO2 for a given PCO2 than at a PO2 of 100 (oxygenated), because deoxyhemoglobin binds CO2 and hydrogen ion better. This aids CO2 loading at the tissues and unloading at the lungs.", // source: Ch 41 p 39
    scene: "pulmonary",
    sceneCfg: { label: "HALDANE EFFECT" },
    metadata: { topic: "Carbon dioxide transport", priority: "medium" },
  },

  /* audit gap-fill round 2 */
  {
    id: "pp2-w5g-053",
    type: "mcq",
    prompt: "How does the slide classify a physiological shunt versus a physiological dead space by the ventilation-perfusion ratio?",
    setup: "",
    ans: [
      { t: "Shunt is a low Va/Q with poor ventilation; dead space is a high Va/Q with wasted ventilation", ok: true },
      { t: "Shunt is a high Va/Q with poor perfusion; dead space is a low Va/Q with wasted ventilation", ok: false },
      { t: "Shunt is a low Va/Q with extra ventilation; dead space is a high Va/Q with extra perfusion", ok: false },
      { t: "Shunt and dead space are both a high Va/Q with equally wasted ventilation and perfusion", ok: false },
    ],
    rationale: "A physiological shunt is a region with a ventilation to perfusion ratio below normal: ventilation is low relative to blood flow, so some blood passes underventilated alveoli and is not fully oxygenated (wasted perfusion, venous admixture). A physiological dead space is a region with a ratio above normal: ventilation is high relative to blood flow, so that ventilation is wasted on poorly perfused alveoli. Source: Chapter 40, Guyton and Hall 14e.", // source: Ch 40 p 31
    scene: "pulmonary",
    sceneCfg: { label: "SHUNT VERSUS DEAD SPACE" },
    metadata: { topic: "Ventilation Perfusion", priority: "high" },
  },

];
