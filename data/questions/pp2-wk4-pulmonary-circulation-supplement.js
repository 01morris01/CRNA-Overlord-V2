/**
 * BIOL-510-A Adv Phys and Pathophys II SUPPLEMENT
 * Pulmonary Circulation, Edema, Pleural Fluid (Guyton and Hall 14e, Ch. 39)
 * Sourced from the chapter slides; every MCQ cites its source page.
 * Authoring conventions: periods, commas, semicolons only (no dashes as punctuation); ranges with the word "to"; answer options kept approximately equal length.
 */

export const PP2_WK4_SUPPLEMENT_QUESTIONS = [

  {
    id: "pp2-w4s-001",
    type: "mcq",
    prompt: "What is the normal mean pulmonary arterial pressure?",
    setup: "",
    ans: [
      { t: "15 mm Hg", ok: true },
      { t: "25 mm Hg", ok: false },
      { t: "30 mm Hg", ok: false },
      { t: "45 mm Hg", ok: false },
    ],
    rationale: "The slides list pulmonary arterial pressures as systolic 25 mm Hg, diastolic 8 mm Hg, and mean 15 mm Hg. The value 25 mm Hg is the systolic value, not the mean. The pulmonary circulation operates at much lower pressures than the systemic circulation.", // source: Ch 39 p 2
    scene: "pulmonary",
    sceneCfg: { label: "MEAN PULMONARY ARTERIAL PRESSURE" },
    metadata: { topic: "Pulmonary arterial pressure", priority: "high" },
  },

  {
    id: "pp2-w4s-002",
    type: "mcq",
    prompt: "According to the slides, what is the normal pulmonary capillary pressure?",
    setup: "",
    ans: [
      { t: "7 mm Hg", ok: true },
      { t: "2 mm Hg", ok: false },
      { t: "15 mm Hg", ok: false },
      { t: "25 mm Hg", ok: false },
    ],
    rationale: "The slides give a pulmonary capillary pressure of 7 mm Hg, with the left atrial pressure falling to about 2 mm Hg. The mean pulmonary arterial pressure is 15 mm Hg and the systolic value is 25 mm Hg. This low capillary pressure helps keep fluid from filtering into the alveoli.", // source: Ch 39 p 2
    scene: "pulmonary",
    sceneCfg: { label: "PULMONARY CAPILLARY PRESSURE VALUE" },
    metadata: { topic: "Pulmonary capillary pressure", priority: "high" },
  },

  {
    id: "pp2-w4s-003",
    type: "mcq",
    prompt: "How does pulmonary vascular resistance compare with systemic vascular resistance?",
    setup: "",
    ans: [
      { t: "About 1/7 as great", ok: true },
      { t: "About 7 times greater", ok: false },
      { t: "About equal to it", ok: false },
      { t: "About 1/2 as great", ok: false },
    ],
    rationale: "The slides state that pulmonary resistance is approximately 1/7 that of the systemic circulation. This reflects a pressure drop of only about 12 mm Hg across the lungs while carrying a flow of 5 L per minute. The low resistance is a defining feature of the pulmonary vascular bed.", // source: Ch 39 p 3
    scene: "pulmonary",
    sceneCfg: { label: "PULMONARY VERSUS SYSTEMIC RESISTANCE" },
    metadata: { topic: "Pulmonary vascular resistance", priority: "high" },
  },

  {
    id: "pp2-w4s-004",
    type: "mcq",
    prompt: "Approximately what pressure drop occurs across the pulmonary circulation?",
    setup: "",
    ans: [
      { t: "12 mm Hg", ok: true },
      { t: "2 mm Hg", ok: false },
      { t: "25 mm Hg", ok: false },
      { t: "50 mm Hg", ok: false },
    ],
    rationale: "The slides state the pulmonary pressure drop is approximately 12 mm Hg while carrying a flow of 5 L per minute. This small drop across a normal cardiac output is why pulmonary resistance is only about 1/7 of the systemic value. The systemic circulation has a far larger pressure drop.", // source: Ch 39 p 3
    scene: "pulmonary",
    sceneCfg: { label: "PULMONARY CIRCUIT PRESSURE DROP" },
    metadata: { topic: "Pulmonary pressure drop", priority: "medium" },
  },

  {
    id: "pp2-w4s-005",
    type: "mcq",
    prompt: "Which two mechanisms lower pulmonary vascular resistance when pulmonary pressure rises?",
    setup: "",
    ans: [
      { t: "Recruitment and distension", ok: true },
      { t: "Recruitment and constriction", ok: false },
      { t: "Collapse and distension", ok: false },
      { t: "Recoil and constriction", ok: false },
    ],
    rationale: "The slides identify recruitment, the opening of previously closed capillaries, and distension, the widening of already open capillaries. Both mechanisms increase the cross-sectional area available for flow and thereby lower resistance. This allows the lung to accept large increases in flow with little pressure rise.", // source: Ch 39 p 4
    scene: "pulmonary",
    sceneCfg: { label: "RESISTANCE LOWERING LUNG MECHANISMS" },
    metadata: { topic: "Recruitment and distension", priority: "high" },
  },

  {
    id: "pp2-w4s-006",
    type: "mcq",
    prompt: "Approximately how much blood is in the pulmonary circulation at any given moment?",
    setup: "",
    ans: [
      { t: "500 mL", ok: true },
      { t: "50 mL", ok: false },
      { t: "2000 mL", ok: false },
      { t: "5000 mL", ok: false },
    ],
    rationale: "The slides state the pulmonary blood volume is approximately 500 mL at any given moment. This volume can shift to the systemic circulation when needed. The slides also note that pulmonary flow can be measured using the Fick principle.", // source: Ch 39 p 5
    scene: "pulmonary",
    sceneCfg: { label: "PULMONARY BLOOD VOLUME AMOUNT" },
    metadata: { topic: "Pulmonary blood volume", priority: "medium" },
  },

  {
    id: "pp2-w4s-007",
    type: "mcq",
    prompt: "Which principle did the slides cite for measuring pulmonary blood flow?",
    setup: "",
    ans: [
      { t: "The Fick principle", ok: true },
      { t: "The Frank principle", ok: false },
      { t: "The Bohr principle", ok: false },
      { t: "The Henry principle", ok: false },
    ],
    rationale: "The slides state that pulmonary flow can be measured using the Fick principle. They also note the pulmonary blood volume is about 500 mL and can shift to the systemic circulation. The Fick principle relates flow to oxygen uptake divided by an arteriovenous oxygen difference.", // source: Ch 39 p 5
    scene: "pulmonary",
    sceneCfg: { label: "FICK PRINCIPLE FLOW MEASUREMENT" },
    metadata: { topic: "Measurement of flow", priority: "medium" },
  },

  {
    id: "pp2-w4s-008",
    type: "mcq",
    prompt: "As cardiac output rises greatly, how does pulmonary arterial pressure respond?",
    setup: "",
    ans: [
      { t: "Rises only modestly", ok: true },
      { t: "Rises proportionally", ok: false },
      { t: "Falls below baseline", ok: false },
      { t: "Stays exactly fixed", ok: false },
    ],
    rationale: "The slide graph shows that even when cardiac output increases severalfold, pulmonary arterial pressure rises only a small amount above the normal value near 15 mm Hg. This buffering occurs because recruitment and distension lower resistance as flow increases. The lung can therefore handle large flow increases with little pressure change.", // source: Ch 39 p 6
    scene: "pulmonary",
    sceneCfg: { label: "PRESSURE RESPONSE TO OUTPUT" },
    metadata: { topic: "Pressure and cardiac output", priority: "medium" },
  },

  {
    id: "pp2-w4s-009",
    type: "mcq",
    prompt: "Which part of the upright lung normally receives the greatest blood flow?",
    setup: "",
    ans: [
      { t: "The bottom", ok: true },
      { t: "The upper top", ok: false },
      { t: "The high apex", ok: false },
      { t: "The hilum", ok: false },
    ],
    rationale: "The slides state the bottom part of each lung receives more perfusion than the top because of hydrostatic pressure differences from gravity. Areas near the bottom receive more blood flow than areas near the top. Exercise increases overall flow but keeps the same relative distribution.", // source: Ch 39 p 8
    scene: "pulmonary",
    sceneCfg: { label: "REGIONAL LUNG PERFUSION PATTERN" },
    metadata: { topic: "Distribution of blood flow", priority: "high" },
  },

  {
    id: "pp2-w4s-010",
    type: "mcq",
    prompt: "What causes the uneven top to bottom distribution of lung blood flow?",
    setup: "",
    ans: [
      { t: "Gravity hydrostatic pressure", ok: true },
      { t: "Active arteriolar vasodilation", ok: false },
      { t: "Differences in alveolar size", ok: false },
      { t: "Sympathetic nerve outflow", ok: false },
    ],
    rationale: "The slides attribute the regional differences to hydrostatic pressure differences that occur due to gravity. The lower regions sit at higher hydrostatic pressure and therefore receive more flow. This forms the basis of the zone model of lung perfusion.", // source: Ch 39 p 7
    scene: "pulmonary",
    sceneCfg: { label: "CAUSE OF FLOW DISTRIBUTION" },
    metadata: { topic: "Hydrostatic effects", priority: "medium" },
  },

  {
    id: "pp2-w4s-011",
    type: "mcq",
    prompt: "How does exercise affect the distribution of blood flow within the lungs?",
    setup: "",
    ans: [
      { t: "Same relative distribution", ok: true },
      { t: "Reverses to favor the very top", ok: false },
      { t: "Becomes perfectly uniform", ok: false },
      { t: "Shifts flow up to the apex", ok: false },
    ],
    rationale: "The slides state that exercise increases overall blood flow to the lungs while keeping the same relative distribution. The bottom continues to receive more flow than the top. The graph shows both curves rising with the same general shape during exercise.", // source: Ch 39 p 8
    scene: "pulmonary",
    sceneCfg: { label: "EXERCISE EFFECT ON DISTRIBUTION" },
    metadata: { topic: "Exercise and distribution", priority: "medium" },
  },

  {
    id: "pp2-w4s-012",
    type: "mcq",
    prompt: "When alveolar PO2 falls, how do the local pulmonary vessels respond?",
    setup: "",
    ans: [
      { t: "They constrict", ok: true },
      { t: "They dilate", ok: false },
      { t: "They rupture", ok: false },
      { t: "They collapse open", ok: false },
    ],
    rationale: "The slides show that decreased alveolar PO2 leads to vascular constriction. This response is opposite to that of systemic vessels, which dilate with hypoxia. The constriction redirects blood away from poorly ventilated alveoli.", // source: Ch 39 p 10
    scene: "pulmonary",
    sceneCfg: { label: "VESSEL RESPONSE TO LOW OXYGEN" },
    metadata: { topic: "Hypoxic vasoconstriction", priority: "high" },
  },

  {
    id: "pp2-w4s-013",
    type: "mcq",
    prompt: "What is the functional benefit of hypoxic pulmonary vasoconstriction?",
    setup: "",
    ans: [
      { t: "Sends flow to ventilated alveoli", ok: true },
      { t: "Lowers total pulmonary pressure", ok: false },
      { t: "Greatly increases lung blood volume", ok: false },
      { t: "Cools the warm inspired air", ok: false },
    ],
    rationale: "The slides state that decreased alveolar PO2 leads to vascular constriction that directs blood flow to ventilated alveoli. By shunting blood away from poorly ventilated regions, the lung improves matching of blood flow to ventilation. This optimizes oxygenation of the blood.", // source: Ch 39 p 12
    scene: "pulmonary",
    sceneCfg: { label: "BENEFIT OF HYPOXIC VASOCONSTRICTION" },
    metadata: { topic: "Hypoxic vasoconstriction", priority: "high" },
  },

  {
    id: "pp2-w4s-014",
    type: "mcq",
    prompt: "On the slide graph, alveolar blood flow is near 100 percent of control at what alveolar PO2?",
    setup: "",
    ans: [
      { t: "70 mm Hg", ok: true },
      { t: "20 mm Hg", ok: false },
      { t: "200 mm Hg", ok: false },
      { t: "10 mm Hg", ok: false },
    ],
    rationale: "The slide graph plots blood flow as a percent of control against alveolar PO2, showing flow reaching near 100 percent at a PO2 of about 70. Below that value flow falls steeply as vasoconstriction sets in. Above 70 the curve plateaus toward 200.", // source: Ch 39 p 9
    scene: "pulmonary",
    sceneCfg: { label: "PO2 THRESHOLD FOR FLOW" },
    metadata: { topic: "Alveolar PO2 and flow", priority: "medium" },
  },

  {
    id: "pp2-w4s-015",
    type: "mcq",
    prompt: "In the normal alveolus on the slide, what is the alveolar oxygen partial pressure?",
    setup: "",
    ans: [
      { t: "100 mm Hg", ok: true },
      { t: "About 40 mm Hg", ok: false },
      { t: "45 mm Hg", ok: false },
      { t: "25 mm Hg", ok: false },
    ],
    rationale: "The slide depicts a normal alveolus with O2 at 100 mm Hg and CO2 at 40 mm Hg. Blood entering the capillary has O2 of 40 and CO2 of 45, and leaving has O2 of 100 and CO2 of 40. Equilibration with alveolar gas raises capillary oxygen to the alveolar value.", // source: Ch 39 p 11
    scene: "pulmonary",
    sceneCfg: { label: "NORMAL ALVEOLAR OXYGEN VALUE" },
    metadata: { topic: "Alveolar gas values", priority: "medium" },
  },

  {
    id: "pp2-w4s-016",
    type: "mcq",
    prompt: "Per the slides, which is an OUTWARD force at the pulmonary capillary?",
    setup: "",
    ans: [
      { t: "Negative interstitial pressure", ok: true },
      { t: "Plasma colloid osmotic pressure", ok: false },
      { t: "Alveolar surface tension inward", ok: false },
      { t: "Capillary wall recoil pressure", ok: false },
    ],
    rationale: "The slides list the outward forces as pulmonary capillary pressure 7, interstitial osmotic pressure 14, and negative interstitial pressure 8, totaling 29 mm Hg. The plasma colloid osmotic pressure of 28 is the lone inward force. The negative interstitial pressure pulls fluid outward into the interstitium.", // source: Ch 39 p 14
    scene: "pulmonary",
    sceneCfg: { label: "OUTWARD PULMONARY CAPILLARY FORCE" },
    metadata: { topic: "Capillary dynamics forces", priority: "high" },
  },

  {
    id: "pp2-w4s-017",
    type: "mcq",
    prompt: "According to the slides, what is the net filtration pressure at the pulmonary capillary?",
    setup: "",
    ans: [
      { t: "1 mm Hg outward", ok: true },
      { t: "7 mm Hg outward", ok: false },
      { t: "14 mm Hg inward", ok: false },
      { t: "28 mm Hg inward", ok: false },
    ],
    rationale: "The slides give total outward forces of 29 mm Hg and an inward plasma osmotic pressure of 28 mm Hg, leaving a net filtration pressure of 1 mm Hg outward. This small outward pressure slowly filters fluid that is then carried away by lymphatics. The balance keeps the alveoli essentially dry.", // source: Ch 39 p 14
    scene: "pulmonary",
    sceneCfg: { label: "NET PULMONARY FILTRATION PRESSURE" },
    metadata: { topic: "Net filtration pressure", priority: "high" },
  },

  {
    id: "pp2-w4s-018",
    type: "mcq",
    prompt: "Per the slides, the plasma osmotic pressure acting inward at the pulmonary capillary is what value?",
    setup: "",
    ans: [
      { t: "28 mm Hg", ok: true },
      { t: "14 mm Hg", ok: false },
      { t: "8 mm Hg", ok: false },
      { t: "29 mm Hg", ok: false },
    ],
    rationale: "The slides list plasma osmotic pressure as the single inward force at 28 mm Hg. This opposes the total outward force of 29 mm Hg made up of capillary pressure, interstitial osmotic pressure, and negative interstitial pressure. The result is a net outward pressure of only 1 mm Hg.", // source: Ch 39 p 14
    scene: "pulmonary",
    sceneCfg: { label: "INWARD PLASMA OSMOTIC VALUE" },
    metadata: { topic: "Plasma osmotic pressure", priority: "medium" },
  },

  {
    id: "pp2-w4s-019",
    type: "mcq",
    prompt: "Which factor on the slides helps keep the alveoli dry?",
    setup: "",
    ans: [
      { t: "Negative interstitial pressure", ok: true },
      { t: "High pulmonary venous pressure", ok: false },
      { t: "Increased capillary permeability", ok: false },
      { t: "Reduced plasma protein level", ok: false },
    ],
    rationale: "The slides state that negative interstitial pressure keeps the alveoli dry. Along with lymphatic pumping and a low capillary pressure, it pulls excess fluid out of the air spaces. The opposing factors listed are instead causes of pulmonary edema.", // source: Ch 39 p 14
    scene: "pulmonary",
    sceneCfg: { label: "FACTOR KEEPING ALVEOLI DRY" },
    metadata: { topic: "Keeping alveoli dry", priority: "high" },
  },

  {
    id: "pp2-w4s-020",
    type: "mcq",
    prompt: "Which is NOT listed on the slides as a cause of pulmonary edema?",
    setup: "",
    ans: [
      { t: "Raised plasma osmotic pressure", ok: true },
      { t: "Left sided heart failure", ok: false },
      { t: "Increased capillary permeability", ok: false },
      { t: "Severe acute laryngeal spasm", ok: false },
    ],
    rationale: "The slides list a DECREASE in plasma osmotic pressure, as in liver failure, as a cause of edema because it lowers the inward force. An increase in plasma osmotic pressure would instead protect against edema, so it is the exception. Left heart failure, increased permeability, and laryngeal spasm are all listed causes.", // source: Ch 39 p 15
    scene: "pulmonary",
    sceneCfg: { label: "NOT A CAUSE OF EDEMA" },
    metadata: { topic: "Causes of pulmonary edema", priority: "high" },
  },

  {
    id: "pp2-w4s-021",
    type: "mcq",
    prompt: "Per the slides, the pulmonary edema safety factor protects until capillary pressure equals what?",
    setup: "",
    ans: [
      { t: "Capillary osmotic pressure", ok: true },
      { t: "Mean systemic arterial pressure", ok: false },
      { t: "Alveolar surface tension", ok: false },
      { t: "Right atrial filling pressure", ok: false },
    ],
    rationale: "The slides state the pulmonary edema safety factor provides protection against edema until pulmonary capillary pressure equals the capillary osmotic pressure. Below that point the inward osmotic force still outweighs the outward forces. Once capillary pressure exceeds the osmotic value, fluid accumulates rapidly.", // source: Ch 39 p 15
    scene: "pulmonary",
    sceneCfg: { label: "EDEMA SAFETY FACTOR THRESHOLD" },
    metadata: { topic: "Edema safety factor", priority: "high" },
  },

  {
    id: "pp2-w4s-022",
    type: "mcq",
    prompt: "Per the slides, what is the main function of the thin pleural fluid layer?",
    setup: "",
    ans: [
      { t: "Reduce friction in breathing", ok: true },
      { t: "Carry oxygen to the pleura", ok: false },
      { t: "Warm the air entering the lungs", ok: false },
      { t: "Store surfactant for the alveoli", ok: false },
    ],
    rationale: "The slides state a thin layer of mucoid fluid lies between the parietal and visceral pleurae to reduce friction between lung, pleura, and chest wall during ventilation. The lymphatic system keeps this space at a negative pressure that prevents lung collapse. A pleural effusion is an abnormal collection of fluid in this space.", // source: Ch 39 p 18
    scene: "pulmonary",
    sceneCfg: { label: "FUNCTION OF PLEURAL FLUID" },
    metadata: { topic: "Pleural fluid", priority: "medium" },
  },

  /* coverage gap-fill (Ch 38 to 43) */

  {
    id: "pp2-w4s-023",
    type: "mcq",
    prompt: "On Figure 39-1 the aortic pressure curve is shown mainly to contrast systemic pressure with the much lower pulmonary artery curve. What is its approximate systolic peak?",
    setup: "",
    ans: [
      { t: "120 mmHg", ok: true },
      { t: "near 75 mmHg", ok: false },
      { t: "25 mmHg", ok: false },
      { t: "15 mmHg", ok: false },
    ],
    rationale: "The aortic curve peaks near 120 mmHg systolic and falls to about 75 mmHg diastolic. It is plotted beside the pulmonary artery curve, which peaks at only 25 mmHg, to emphasize that the pulmonary circuit is a low pressure system; 25 and 15 are pulmonary systolic and mean values.", // source: Ch 39 p 2
    scene: "pulmonary",
    sceneCfg: { label: "AORTIC CURVE" },
    metadata: { topic: "Aortic versus pulmonary pressure", priority: "medium" },
  },

  {
    id: "pp2-w4s-024",
    type: "mcq",
    prompt: "According to the slides, what is the normal pulmonary artery systolic pressure?",
    setup: "",
    ans: [
      { t: "25 mmHg", ok: true },
      { t: "8 mmHg", ok: false },
      { t: "15 mmHg", ok: false },
      { t: "120 mmHg", ok: false },
    ],
    rationale: "Pulmonary artery systolic pressure is about 25 mmHg, far below the 120 mmHg aortic systolic value. The 8 mmHg figure is pulmonary diastolic and 15 mmHg is the mean pulmonary arterial pressure.", // source: Ch 39 p 2
    scene: "pulmonary",
    sceneCfg: { label: "PA SYSTOLIC" },
    metadata: { topic: "Pulmonary arterial pressure", priority: "high" },
  },

  {
    id: "pp2-w4s-025",
    type: "mcq",
    prompt: "According to the slides, what is the normal pulmonary artery diastolic pressure?",
    setup: "",
    ans: [
      { t: "8 mmHg", ok: true },
      { t: "25 mmHg", ok: false },
      { t: "15 mmHg", ok: false },
      { t: "2 mmHg", ok: false },
    ],
    rationale: "Pulmonary artery diastolic pressure is about 8 mmHg. The 25 mmHg value is systolic, 15 mmHg is the mean, and 2 mmHg is the left atrial pressure at the far end of the gradient.", // source: Ch 39 p 2
    scene: "pulmonary",
    sceneCfg: { label: "PA DIASTOLIC" },
    metadata: { topic: "Pulmonary arterial pressure", priority: "high" },
  },

  {
    id: "pp2-w4s-026",
    type: "mcq",
    prompt: "On Figure 39-2 the pulmonary pressure falls steadily from the pulmonary artery to the left atrium. What is the approximate left atrial pressure at the end of that gradient?",
    setup: "",
    ans: [
      { t: "2 mmHg", ok: true },
      { t: "7 mmHg", ok: false },
      { t: "15 mmHg", ok: false },
      { t: "25 mmHg", ok: false },
    ],
    rationale: "Left atrial pressure is about 2 mmHg, the lowest point on the pulmonary gradient. Pulmonary capillary pressure is 7 mmHg, mean arterial pressure is 15 mmHg, and the systolic peak is 25 mmHg.", // source: Ch 39 p 2
    scene: "pulmonary",
    sceneCfg: { label: "LA PRESSURE" },
    metadata: { topic: "Left atrial pressure", priority: "medium" },
  },

  {
    id: "pp2-w4s-027",
    type: "mcq",
    prompt: "Per the slides, what is the approximate rate of blood flow through the pulmonary circulation at rest?",
    setup: "",
    ans: [
      { t: "5 L per min", ok: true },
      { t: "1 L per min", ok: false },
      { t: "12 L per min", ok: false },
      { t: "25 L per min", ok: false },
    ],
    rationale: "Pulmonary flow equals cardiac output, about 5 liters per minute at rest, since the entire output passes through the lungs. The 12 figure on that slide is the pressure drop in mmHg, not a flow.", // source: Ch 39 p 3
    scene: "pulmonary",
    sceneCfg: { label: "PULM FLOW" },
    metadata: { topic: "Pulmonary blood flow", priority: "medium" },
  },

  {
    id: "pp2-w4s-028",
    type: "mcq",
    prompt: "Per the slides, the pulmonary circulation can act as a blood reservoir. Where can pulmonary blood shift when needed?",
    setup: "",
    ans: [
      { t: "To systemic circulation", ok: true },
      { t: "Into the alveolar spaces", ok: false },
      { t: "Into pleural fluid", ok: false },
      { t: "Into lymph channels", ok: false },
    ],
    rationale: "About 500 mL is held in the pulmonary vessels and can shift to the systemic circulation, for example during hemorrhage or when intrathoracic pressure changes. Shifts into the alveoli, pleura, or lymph would be pathologic, not a normal reservoir function.", // source: Ch 39 p 5
    scene: "pulmonary",
    sceneCfg: { label: "BLOOD SHIFT" },
    metadata: { topic: "Pulmonary blood reservoir", priority: "medium" },
  },

  {
    id: "pp2-w4s-029",
    type: "mcq",
    prompt: "Per Figure 39-6, recruitment and distension buffer the pulmonary pressure. As cardiac output quadruples from rest, what happens to pulmonary arterial pressure?",
    setup: "",
    ans: [
      { t: "It rises only slightly", ok: true },
      { t: "It rises proportionally", ok: false },
      { t: "It falls toward zero", ok: false },
      { t: "It stays exactly fixed", ok: false },
    ],
    rationale: "Recruitment of closed capillaries and distension of open ones drop pulmonary resistance as flow rises, so pressure climbs only slightly over a wide output range before steepening at very high output. It does not rise proportionally, fall, or stay perfectly constant.", // source: Ch 39 p 6
    scene: "pulmonary",
    sceneCfg: { label: "PRESSURE BUFFER" },
    metadata: { topic: "Pressure buffering with output", priority: "medium" },
  },

  {
    id: "pp2-w4s-030",
    type: "mcq",
    prompt: "In the zone model on Figure 39-5, which zone has NO blood flow during the cardiac cycle?",
    setup: "",
    ans: [
      { t: "Zone 1", ok: true },
      { t: "Zone 2", ok: false },
      { t: "Zone 3", ok: false },
      { t: "The lung base", ok: false },
    ],
    rationale: "Zone 1 has no flow because alveolar pressure exceeds both arterial and venous pressure, collapsing the capillary. Zone 2 has intermittent flow, zone 3 has continuous flow, and the base of the lung behaves as zone 3.", // source: Ch 39 p 7
    scene: "pulmonary",
    sceneCfg: { label: "ZONE 1" },
    metadata: { topic: "Lung zones", priority: "high" },
  },

  {
    id: "pp2-w4s-031",
    type: "mcq",
    prompt: "In the zone model on Figure 39-5, what defines zone 2, where flow is intermittent?",
    setup: "",
    ans: [
      { t: "Palv between Pa and Pv", ok: true },
      { t: "Palv above Pa and Pv", ok: false },
      { t: "Pa and Pv above the Palv", ok: false },
      { t: "Pa equals Pv exactly", ok: false },
    ],
    rationale: "In zone 2 alveolar pressure lies between arterial and venous pressure, so the vessel opens only during systole when arterial pressure rises above alveolar pressure. Alveolar pressure above both defines zone 1, and both pressures above alveolar defines zone 3.", // source: Ch 39 p 7
    scene: "pulmonary",
    sceneCfg: { label: "ZONE 2" },
    metadata: { topic: "Lung zones", priority: "high" },
  },

  {
    id: "pp2-w4s-032",
    type: "mcq",
    prompt: "In the zone model on Figure 39-5, which zone has continuous blood flow and normally describes the base of the upright lung?",
    setup: "",
    ans: [
      { t: "Zone 3", ok: true },
      { t: "Zone 1", ok: false },
      { t: "Zone 2", ok: false },
      { t: "The lung apex", ok: false },
    ],
    rationale: "Zone 3 has continuous flow because both arterial and venous pressures exceed alveolar pressure, keeping the capillary open throughout the cycle; this describes the lung base. Zone 1 has no flow and zone 2 has intermittent flow, and the apex behaves as zone 1 or 2.", // source: Ch 39 p 7
    scene: "pulmonary",
    sceneCfg: { label: "ZONE 3" },
    metadata: { topic: "Lung zones", priority: "high" },
  },

  {
    id: "pp2-w4s-033",
    type: "mcq",
    prompt: "On the slide, the normal alveolus has an oxygen partial pressure of 100 mmHg. What is its normal carbon dioxide partial pressure?",
    setup: "",
    ans: [
      { t: "40 mmHg", ok: true },
      { t: "45 mmHg", ok: false },
      { t: "100 mmHg", ok: false },
      { t: "28 mmHg", ok: false },
    ],
    rationale: "Normal alveolar gas is O2 of 100 mmHg and CO2 of 40 mmHg. The 45 mmHg value is the CO2 of mixed venous blood entering the capillary, and 100 mmHg is the alveolar and end capillary O2.", // source: Ch 39 p 11
    scene: "pulmonary",
    sceneCfg: { label: "ALV CO2" },
    metadata: { topic: "Alveolar gas values", priority: "medium" },
  },

  {
    id: "pp2-w4s-034",
    type: "mcq",
    prompt: "On the slide, blood entering the pulmonary capillary carries an oxygen partial pressure of about what value before it equilibrates with alveolar gas?",
    setup: "",
    ans: [
      { t: "40 mmHg", ok: true },
      { t: "100 mmHg", ok: false },
      { t: "45 mmHg", ok: false },
      { t: "70 mmHg", ok: false },
    ],
    rationale: "Mixed venous blood enters the capillary at O2 of 40 mmHg and CO2 of 45 mmHg, then equilibrates to O2 of 100 and CO2 of 40 by the venous end. The 100 mmHg value is the equilibrated O2 and 45 is the entering CO2.", // source: Ch 39 p 11
    scene: "pulmonary",
    sceneCfg: { label: "CAP O2 IN" },
    metadata: { topic: "Capillary gas equilibration", priority: "medium" },
  },

  {
    id: "pp2-w4s-035",
    type: "mcq",
    prompt: "On Figure 39-7, surface tension at the alveolar pore contributes which approximate force toward fluid movement out of the capillary?",
    setup: "",
    ans: [
      { t: "8 mmHg", ok: true },
      { t: "28 mmHg", ok: false },
      { t: "14 mmHg", ok: false },
      { t: "1 mmHg", ok: false },
    ],
    rationale: "Surface tension at the alveolar pore is shown as about 8 mmHg, contributing to the outward pull on fluid. The 28 mmHg value is plasma osmotic pressure, 14 mmHg is interstitial osmotic pressure, and 1 mmHg is the net filtration pressure.", // source: Ch 39 p 13
    scene: "pulmonary",
    sceneCfg: { label: "PORE TENSION" },
    metadata: { topic: "Surface tension at pore", priority: "medium" },
  },

  {
    id: "pp2-w4s-036",
    type: "mcq",
    prompt: "Per the slides, how is pulmonary edema defined?",
    setup: "",
    ans: [
      { t: "Interstitial fluid", ok: true },
      { t: "Blood in the alveoli", ok: false },
      { t: "Air in the pleural space", ok: false },
      { t: "Pus around the pleura", ok: false },
    ],
    rationale: "Pulmonary edema is fluid accumulation in the pulmonary interstitial space, which can then spill into the alveoli. Blood in alveoli is hemorrhage, air in the pleura is pneumothorax, and pus around the pleura is empyema.", // source: Ch 39 p 15
    scene: "pulmonary",
    sceneCfg: { label: "EDEMA DEF" },
    metadata: { topic: "Pulmonary edema definition", priority: "high" },
  },

  {
    id: "pp2-w4s-037",
    type: "mcq",
    prompt: "Per the slides, which edema cause raises the outward filtration force through elevated pulmonary capillary pressure?",
    setup: "",
    ans: [
      { t: "Mitral valve stenosis", ok: true },
      { t: "Liver failure", ok: false },
      { t: "Chlorine gas inhaling", ok: false },
      { t: "Severe laryngeal spasm", ok: false },
    ],
    rationale: "Left heart failure and mitral valve stenosis raise pulmonary venous and capillary pressure, increasing the outward force. Liver failure lowers plasma osmotic pressure, chlorine damages the membrane raising permeability, and laryngeal spasm lowers intrapleural pressure.", // source: Ch 39 p 15
    scene: "pulmonary",
    sceneCfg: { label: "EDEMA PRESSURE" },
    metadata: { topic: "Edema cause pressure", priority: "high" },
  },

  {
    id: "pp2-w4s-038",
    type: "mcq",
    prompt: "Per the slides, inhaling noxious gases such as chlorine or sulfur dioxide causes pulmonary edema mainly by which mechanism?",
    setup: "",
    ans: [
      { t: "Raising membrane permeability", ok: true },
      { t: "Raising plasma osmotic pressure", ok: false },
      { t: "Lowering capillary pressure", ok: false },
      { t: "Blocking lung lymphatics", ok: false },
    ],
    rationale: "Chlorine and sulfur dioxide damage the capillary membrane and increase its permeability, letting plasma proteins and fluid leak into the interstitium. They do not raise plasma osmotic pressure, lower capillary pressure, or primarily block lymphatics.", // source: Ch 39 p 15
    scene: "pulmonary",
    sceneCfg: { label: "NOXIOUS GAS" },
    metadata: { topic: "Edema cause permeability", priority: "high" },
  },

  {
    id: "pp2-w4s-039",
    type: "mcq",
    prompt: "Per the slides, liver failure promotes pulmonary edema by which mechanism?",
    setup: "",
    ans: [
      { t: "Lowering plasma osmotic force", ok: true },
      { t: "Raising capillary pressure", ok: false },
      { t: "Damaging the membrane", ok: false },
      { t: "Raising alveolar surface tension", ok: false },
    ],
    rationale: "Liver failure reduces plasma protein production, lowering plasma colloid osmotic pressure and the inward force that holds fluid in the capillary. It does not raise capillary pressure, damage the membrane, or change alveolar surface tension as the primary route.", // source: Ch 39 p 15
    scene: "pulmonary",
    sceneCfg: { label: "LIVER FAILURE" },
    metadata: { topic: "Edema cause osmotic", priority: "high" },
  },

  {
    id: "pp2-w4s-040",
    type: "mcq",
    prompt: "Per the slides, how does a large decrease in intrapleural pressure, as in severe laryngeal spasm, cause pulmonary edema?",
    setup: "",
    ans: [
      { t: "Negative pressure pulls fluid out", ok: true },
      { t: "It raises the plasma protein level", ok: false },
      { t: "It thickens the membrane", ok: false },
      { t: "It speeds lymph drainage", ok: false },
    ],
    rationale: "Inspiring hard against a closed airway makes intrapleural pressure strongly negative; that negativity is transmitted to the interstitial and alveolar spaces, favoring fluid movement out of the capillaries. It does not raise plasma proteins, thicken the membrane, or speed lymph flow.", // source: Ch 39 p 15
    scene: "pulmonary",
    sceneCfg: { label: "LARYNGEAL SPASM" },
    metadata: { topic: "Edema cause intrapleural", priority: "high" },
  },

  {
    id: "pp2-w4s-041",
    type: "mcq",
    prompt: "On Figure 39-8, the rate of pulmonary edema formation stays near zero until left atrial pressure rises above approximately what value?",
    setup: "",
    ans: [
      { t: "23 mmHg", ok: true },
      { t: "7 mmHg", ok: false },
      { t: "15 mmHg", ok: false },
      { t: "50 mmHg", ok: false },
    ],
    rationale: "Edema formation is flat until left atrial pressure climbs above roughly 23 mmHg, then rises steeply; this threshold is the safety factor against edema. The 7 and 15 values are normal capillary and mean arterial pressures, and 50 is the top of the plotted axis.", // source: Ch 39 p 16
    scene: "pulmonary",
    sceneCfg: { label: "EDEMA THRESHOLD" },
    metadata: { topic: "Edema pressure threshold", priority: "high" },
  },

  {
    id: "pp2-w4s-042",
    type: "mcq",
    prompt: "Per the slides, which trio is listed as the safety factors that protect against pulmonary edema?",
    setup: "",
    ans: [
      { t: "Negative pressure, lymph, low osmotic", ok: true },
      { t: "Surfactant, cough, and bronchodilation", ok: false },
      { t: "Recruitment, distension, hypoxia", ok: false },
      { t: "High plasma protein, heat, gravity", ok: false },
    ],
    rationale: "The listed safety factors are negative interstitial pressure, lymphatic pumping, and decreased interstitial osmotic pressure from protein washout. Surfactant and bronchial reflexes, the vascular resistance mechanisms, and unrelated factors are not the edema safety factors named here.", // source: Ch 39 p 17
    scene: "pulmonary",
    sceneCfg: { label: "SAFETY TRIO" },
    metadata: { topic: "Edema safety factors", priority: "high" },
  },

  {
    id: "pp2-w4s-043",
    type: "mcq",
    prompt: "Per the slides, which is listed as a safety factor that removes filtered fluid and helps prevent alveolar flooding?",
    setup: "",
    ans: [
      { t: "Lymphatic pumping", ok: true },
      { t: "Hypoxic vasoconstriction", ok: false },
      { t: "Mitral valve stenosis", ok: false },
      { t: "Surfactant secretion", ok: false },
    ],
    rationale: "Lymphatic pumping carries filtered fluid and protein out of the interstitium, a key safety factor along with negative interstitial pressure. Hypoxic vasoconstriction matches perfusion to ventilation, mitral stenosis causes edema, and surfactant lowers surface tension rather than draining fluid.", // source: Ch 39 p 17
    scene: "pulmonary",
    sceneCfg: { label: "LYMPH PUMP" },
    metadata: { topic: "Edema safety factor lymph", priority: "high" },
  },

  {
    id: "pp2-w4s-044",
    type: "mcq",
    prompt: "Per the slides, because the net Starling force at the pulmonary capillary is plus 1, how does fluid behave at the pleural surface?",
    setup: "",
    ans: [
      { t: "It filters out slowly", ok: true },
      { t: "It is reabsorbed completely", ok: false },
      { t: "It never crosses the wall", ok: false },
      { t: "It pours out rapidly", ok: false },
    ],
    rationale: "A net force of plus 1 mmHg outward means fluid filters slowly but continuously into the pleural space, where lymphatics remove it. Complete reabsorption or no movement would contradict a positive net force, and rapid pouring would require a much larger imbalance.", // source: Ch 39 p 18
    scene: "pulmonary",
    sceneCfg: { label: "PLEURAL FILTER" },
    metadata: { topic: "Pleural fluid filtration", priority: "medium" },
  },

  {
    id: "pp2-w4s-045",
    type: "mcq",
    prompt: "Per the slides, what role do the pleural lymphatics serve besides draining fluid?",
    setup: "",
    ans: [
      { t: "Keep pleural pressure negative", ok: true },
      { t: "Add surfactant to alveoli", ok: false },
      { t: "Raise the plasma osmotic pressure", ok: false },
      { t: "Constrict hypoxic vessels", ok: false },
    ],
    rationale: "Lymphatics maintain a negative pleural pressure that keeps the lungs expanded against the chest wall and prevents collapse. They do not secrete surfactant, change plasma osmotic pressure, or mediate hypoxic vasoconstriction.", // source: Ch 39 p 18
    scene: "pulmonary",
    sceneCfg: { label: "PLEURAL VACUUM" },
    metadata: { topic: "Pleural negative pressure", priority: "medium" },
  },

  {
    id: "pp2-w4s-046",
    type: "mcq",
    prompt: "Per the slides, which is listed as a cause of pleural effusion?",
    setup: "",
    ans: [
      { t: "Lymphatic obstruction by tumor", ok: true },
      { t: "Hypoxic vasoconstriction", ok: false },
      { t: "Recruitment of lung capillaries", ok: false },
      { t: "Distension of capillaries", ok: false },
    ],
    rationale: "Pleural effusion results from blocked lymphatics such as tumor, heart failure, low plasma osmotic pressure, infection raising permeability, or fluid production exceeding drainage. Hypoxic vasoconstriction, recruitment, and distension are normal vascular responses that do not cause effusion.", // source: Ch 39 p 18
    scene: "pulmonary",
    sceneCfg: { label: "EFFUSION CAUSE" },
    metadata: { topic: "Pleural effusion causes", priority: "medium" },
  },

];
