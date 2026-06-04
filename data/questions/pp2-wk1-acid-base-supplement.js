/**
 * BIOL-510-A Adv Phys & Pathophys II — Week 1 SUPPLEMENT
 * Acid-Base Regulation (Ch. 31) / Diuretics & Kidney Diseases (Ch. 32)
 * Guyton & Hall 14e
 * Sourced from lecture slides and textbook.
 */

export const PP2_WK1_SUPPLEMENT_QUESTIONS = [

  /* ───────── Ch 31  Acid-Base Regulation ───────── */

  {
    id: "pp2-w1s-001",
    type: "mcq",
    prompt: "Metabolism of dietary protein and other substrates generates approximately how many millimoles of non-volatile acid per day?",
    setup: "",
    ans: [
      { t: "10 to 20 mmol per day", ok: false },
      { t: "60 to 80 mmol per day", ok: true },
      { t: "200 to 300 mmol per day", ok: false },
      { t: "500 to 600 mmol per day", ok: false },
    ],
    rationale: "Non-volatile (fixed) acid production is approximately 60 to 80 mmol per day, arising mainly from sulfur containing amino acid oxidation (yielding sulfuric acid) and incomplete oxidation of carbohydrates and fats. These acids cannot be excreted by the lungs and must be eliminated by the kidneys. Options C and D overestimate normal production by several fold. Option A is below physiologic output.", // source: slide Ch31 non-volatile acid production
    scene: "renal",
    sceneCfg: { label: "NON-VOLATILE ACID PRODUCTION" },
    metadata: { topic: "Non-volatile acid production", priority: "high" },
  },

  {
    id: "pp2-w1s-002",
    type: "mcq",
    prompt: "Which three lines of defense protect body pH against acid-base disturbances, listed from fastest to slowest?",
    setup: "",
    ans: [
      { t: "Renal excretion, respiratory compensation, chemical buffers", ok: false },
      { t: "Chemical buffers, respiratory compensation, renal excretion", ok: true },
      { t: "Respiratory compensation, chemical buffers, renal excretion", ok: false },
      { t: "Chemical buffers, renal excretion, respiratory compensation", ok: false },
    ],
    rationale: "Chemical buffer systems react within a fraction of a second to bind or release H+ ions, making them the first line of defense. Respiratory compensation (adjusting CO2 by changing ventilation) acts within minutes. Renal excretion of acid or base is the most powerful mechanism but the slowest, requiring hours to days to reach full effect. Option A reverses the fastest and slowest mechanisms. Options C and D misordered the middle tier.", // source: slide Ch31 three lines of defense
    scene: "renal",
    sceneCfg: { label: "THREE LINES OF pH DEFENSE" },
    metadata: { topic: "Three lines of pH defense", priority: "high" },
  },

  {
    id: "pp2-w1s-003",
    type: "mcq",
    prompt: "In the Henderson-Hasselbalch equation for the bicarbonate buffer system, what is the pK value and what does the solubility coefficient (alpha) of 0.03 convert?",
    setup: "",
    ans: [
      { t: "pK is 6.1; alpha converts PCO2 in mm Hg to dissolved CO2 in mmol per liter", ok: true },
      { t: "pK is 7.4; alpha converts PCO2 in mm Hg to total CO2 in mmol per liter", ok: false },
      { t: "pK is 6.1; alpha converts HCO3 concentration to dissolved CO2", ok: false },
      { t: "pK is 7.1; alpha converts PCO2 in mm Hg to carbonic acid in mmol per liter", ok: false },
    ],
    rationale: "The Henderson-Hasselbalch equation is pH = 6.1 + log([HCO3-] / 0.03 x PCO2). The pK of the carbonic acid/bicarbonate system is 6.1. The coefficient 0.03 (mmol/L per mm Hg) converts PCO2 measured in mm Hg to the concentration of dissolved CO2 in millimoles per liter. At a normal PCO2 of 40 mm Hg, dissolved CO2 = 0.03 x 40 = 1.2 mmol/L. Option B gives pH (the set point, not the pK). Options C and D misidentify what the coefficient converts.", // source: slide Ch31 Henderson-Hasselbalch
    scene: "renal",
    sceneCfg: { label: "HENDERSON-HASSELBALCH EQUATION" },
    metadata: { topic: "Henderson-Hasselbalch equation", priority: "high" },
  },

  {
    id: "pp2-w1s-004",
    type: "mcq",
    prompt: "Why is the bicarbonate buffer system the most important extracellular buffer despite having a pK of 6.1, which is far from physiologic pH of 7.4?",
    setup: "",
    ans: [
      { t: "Its plasma concentration far exceeds every other buffer", ok: false },
      { t: "Lungs regulate CO2 and kidneys regulate HCO3- separately", ok: true },
      { t: "Carbonic acid dissociates faster than any other weak acid", ok: false },
      { t: "A pK of 6.1 makes it most effective at a pH of 7.4", ok: false },
    ],
    rationale: "A buffer normally works best within one pH unit of its pK, so at pH 7.4 the bicarbonate system would seem like a poor chemical buffer. Its power comes from the fact that lungs can rapidly adjust PCO2 (the acid component) and kidneys can independently adjust HCO3- (the base component). This dual organ regulation makes the effective buffering capacity far greater than that predicted by the pK alone. Option A is partially true but does not explain why pK 6.1 still works. Options C and D are factually incorrect.", // source: slide Ch31 why bicarbonate is best ECF buffer
    scene: "renal",
    sceneCfg: { label: "WHY BICARBONATE IS BEST ECF BUFFER" },
    metadata: { topic: "Bicarbonate buffer superiority", priority: "high" },
  },

  {
    id: "pp2-w1s-005",
    type: "mcq",
    prompt: "What percentage of total body buffering capacity is provided by intracellular buffers (proteins and organic phosphates)?",
    setup: "",
    ans: [
      { t: "10 to 20 percent", ok: false },
      { t: "30 to 40 percent", ok: false },
      { t: "60 to 70 percent", ok: true },
      { t: "90 to 95 percent", ok: false },
    ],
    rationale: "Intracellular buffers, primarily proteins and organic phosphates, account for 60 to 70 percent of total body chemical buffering. This large contribution reflects the enormous mass of intracellular protein (hemoglobin alone contributes significantly) and the high concentration of organic phosphates inside cells. Extracellular buffers (bicarbonate, plasma proteins, phosphate) handle the remaining 30 to 40 percent. Options A and B underestimate the intracellular contribution.", // source: slide Ch31 intracellular buffer 60-70%
    scene: "renal",
    sceneCfg: { label: "INTRACELLULAR BUFFERING CAPACITY" },
    metadata: { topic: "Intracellular buffering capacity", priority: "high" },
  },

  {
    id: "pp2-w1s-006",
    type: "mcq",
    prompt: "The kidneys secrete approximately how many millimoles of hydrogen ions per day into the tubular fluid?",
    setup: "",
    ans: [
      { t: "80 mmol per day", ok: false },
      { t: "440 mmol per day", ok: false },
      { t: "4,400 mmol per day", ok: true },
      { t: "44,000 mmol per day", ok: false },
    ],
    rationale: "Total renal H+ secretion is approximately 4,400 mmol per day. Of this, roughly 4,320 mmol is used to reabsorb an equal amount of filtered HCO3- (preventing bicarbonate loss). The remaining approximately 80 mmol represents the net excretion of new acid, which matches the daily non-volatile acid production. Option A confuses net acid excretion with total H+ secretion. Option B is one tenth the actual value.", // source: slide Ch31 renal H+ secretion 4400 mmol/day
    scene: "renal",
    sceneCfg: { label: "TOTAL RENAL H+ SECRETION" },
    metadata: { topic: "Total renal H+ secretion", priority: "high" },
  },

  {
    id: "pp2-w1s-007",
    type: "mcq",
    prompt: "Of the approximately 4,320 mmol of HCO3- filtered daily at the glomerulus, how much is normally reabsorbed and how much new HCO3- is produced?",
    setup: "",
    ans: [
      { t: "About 4,000 reabsorbed with 320 new HCO3- produced", ok: false },
      { t: "About 4,319 reabsorbed with 80 new HCO3- produced", ok: true },
      { t: "About 3,800 reabsorbed with 520 new HCO3- produced", ok: false },
      { t: "About 4,320 reabsorbed with 0 new HCO3- produced", ok: false },
    ],
    rationale: "Nearly all filtered HCO3- (approximately 4,319 of 4,320 mmol) is reabsorbed, preventing catastrophic bicarbonate loss in the urine. In addition, the kidneys generate approximately 80 mmol of new HCO3- per day by excreting H+ bound to phosphate buffer (titratable acid) and ammonia. This new bicarbonate replaces what was consumed by non-volatile acid production. Option D denies new HCO3- production, which would leave the body unable to replenish bicarbonate lost to acid buffering.", // source: slide Ch31 HCO3 filtration and reabsorption
    scene: "renal",
    sceneCfg: { label: "HCO3- FILTRATION AND REABSORPTION" },
    metadata: { topic: "Bicarbonate filtration and reabsorption", priority: "high" },
  },

  {
    id: "pp2-w1s-008",
    type: "mcq",
    prompt: "What percentage of filtered bicarbonate is reabsorbed in the proximal tubule, and which transporter mediates the apical H+ secretion there?",
    setup: "",
    ans: [
      { t: "50 percent; H+ ATPase pump", ok: false },
      { t: "85 percent; Na+/H+ exchanger (NHE3)", ok: true },
      { t: "85 percent; H+/K+ ATPase", ok: false },
      { t: "65 percent; Na+/H+ exchanger (NHE3)", ok: false },
    ],
    rationale: "The proximal tubule reabsorbs approximately 85 percent of filtered HCO3-. The dominant apical transporter is the sodium/hydrogen exchanger NHE3, which secretes H+ into the lumen in exchange for Na+ reabsorption. Secreted H+ combines with filtered HCO3- to form CO2 and water (catalyzed by brush border carbonic anhydrase IV), and CO2 diffuses into the cell where intracellular carbonic anhydrase II regenerates HCO3- for basolateral exit. The H+ ATPase pump (option A) and H+/K+ ATPase (option C) are important in the collecting duct, not the proximal tubule.", // source: slide Ch31 PT 85% NHE3
    scene: "renal",
    sceneCfg: { label: "PROXIMAL TUBULE HCO3- REABSORPTION" },
    metadata: { topic: "Proximal tubule HCO3 reabsorption", priority: "high" },
  },

  {
    id: "pp2-w1s-009",
    type: "mcq",
    prompt: "After the proximal tubule reabsorbs 85% of filtered HCO3-, what percentages are reabsorbed in the thick ascending limb and the distal nephron respectively?",
    setup: "",
    ans: [
      { t: "5 percent in the thick ascending limb, rest excreted", ok: false },
      { t: "10 percent in the thick limb, over 4.9 percent distally", ok: true },
      { t: "15 percent in the thick ascending limb, 0 percent distal", ok: false },
      { t: "3 percent in the thick ascending limb, 12 percent distal", ok: false },
    ],
    rationale: "The thick ascending limb of the loop of Henle reabsorbs approximately 10 percent of filtered HCO3-. The distal tubule and collecting duct together reabsorb the remaining fraction, which is greater than 4.9 percent. Under normal conditions, essentially no HCO3- appears in the final urine (less than 1 mmol per day is excreted). This segmental arrangement ensures nearly complete HCO3- recovery before tubular fluid reaches the collecting duct.", // source: slide Ch31 segmental HCO3 reabsorption
    scene: "renal",
    sceneCfg: { label: "SEGMENTAL HCO3- REABSORPTION" },
    metadata: { topic: "Segmental HCO3 reabsorption", priority: "high" },
  },

  {
    id: "pp2-w1s-010",
    type: "mcq",
    prompt: "Type A intercalated cells in the collecting duct secrete H+ into the lumen by which two transporters?",
    setup: "",
    ans: [
      { t: "NHE3 and the Na+/K+ ATPase pump", ok: false },
      { t: "H+ ATPase and H+/K+ ATPase pump", ok: true },
      { t: "NKCC2 cotransporter and H+ ATPase", ok: false },
      { t: "Na+/H+ and Cl-/HCO3- exchangers", ok: false },
    ],
    rationale: "Type A intercalated cells have two apical H+ secretion mechanisms. The primary pump is a vacuolar H+ ATPase that actively transports H+ into the lumen. The secondary pump is an H+/K+ ATPase that secretes H+ while reabsorbing K+. On the basolateral side, a Cl-/HCO3- exchanger returns newly generated HCO3- to the blood. NHE3 (options A and D) is the proximal tubule transporter, not the intercalated cell mechanism. NKCC2 (option C) is found in the thick ascending limb.", // source: slide Ch31 Type A intercalated cells
    scene: "renal",
    sceneCfg: { label: "TYPE A INTERCALATED CELL H+ SECRETION" },
    metadata: { topic: "Type A intercalated cell H+ secretion", priority: "high" },
  },

  {
    id: "pp2-w1s-011",
    type: "mcq",
    prompt: "How does a Type B intercalated cell differ functionally from a Type A intercalated cell?",
    setup: "",
    ans: [
      { t: "They secrete HCO3- and reabsorb H+, opposite of Type A", ok: true },
      { t: "They secrete both H+ and K+ faster than Type A cells do", ok: false },
      { t: "They work only in acidosis to maximize total acid output", ok: false },
      { t: "They sit only in the proximal tubule, not collecting duct", ok: false },
    ],
    rationale: "Type B intercalated cells have reversed transporter polarity compared to Type A cells. Type B cells place the H+ ATPase on the basolateral membrane (secreting H+ into blood) and the Cl-/HCO3- exchanger (pendrin) on the apical membrane (secreting HCO3- into the lumen). This arrangement allows the kidney to excrete excess base during alkalosis. Type A cells dominate during acidosis (secreting H+ into the lumen) while Type B cells dominate during alkalosis.", // source: slide Ch31 Type B intercalated cells
    scene: "renal",
    sceneCfg: { label: "TYPE B INTERCALATED CELLS" },
    metadata: { topic: "Type B intercalated cells", priority: "high" },
  },

  {
    id: "pp2-w1s-012",
    type: "mcq",
    prompt: "The minimum urine pH the human kidney can achieve is approximately 4.5. Without tubular buffers, excreting 60 mmol of non-volatile acid at this pH would require how much urine per day?",
    setup: "",
    ans: [
      { t: "20 liters", ok: false },
      { t: "200 liters", ok: false },
      { t: "2,000 liters", ok: true },
      { t: "20,000 liters", ok: false },
    ],
    rationale: "At a minimum urine pH of 4.5, the maximal free H+ concentration is 0.03 mmol per liter (10 to the negative 4.5 power). To excrete 60 mmol of acid as free H+ would require 60 mmol divided by 0.03 mmol per liter, which equals 2,000 liters per day. This calculation demonstrates why tubular buffers (phosphate and ammonia) are essential. They allow acid excretion in far smaller urine volumes by binding secreted H+ ions.", // source: slide Ch31 importance of renal tubular buffers
    scene: "renal",
    sceneCfg: { label: "IMPORTANCE OF TUBULAR BUFFERS" },
    metadata: { topic: "Importance of tubular buffers", priority: "high" },
  },

  {
    id: "pp2-w1s-013",
    type: "mcq",
    prompt: "Which reaction occurs when secreted H+ is buffered by phosphate in the tubular fluid, and what does this generate?",
    setup: "",
    ans: [
      { t: "NaHPO4- plus H+ forms NaH2PO4, and a new HCO3- is returned to the blood", ok: true },
      { t: "Na2HPO4 plus H+ forms Na3PO4 plus water, consuming bicarbonate", ok: false },
      { t: "HPO4 2- plus 2H+ forms H3PO4, which is excreted as titratable acid only", ok: false },
      { t: "NaHPO4- plus H+ forms free phosphoric acid with no net HCO3- gain", ok: false },
    ],
    rationale: "In the tubular lumen, filtered NaHPO4- accepts a secreted H+ to form NaH2PO4 (titratable acid). For every H+ that is buffered by phosphate instead of recombining with filtered HCO3-, a new bicarbonate molecule is generated inside the tubular cell and transported to the blood via the basolateral Cl-/HCO3- exchanger. This is net new HCO3- because the H+ was generated from CO2 and water inside the cell, not from filtered bicarbonate.", // source: slide Ch31 phosphate buffer NaHPO4 + H+ = NaH2PO4
    scene: "renal",
    sceneCfg: { label: "PHOSPHATE TUBULAR BUFFERING" },
    metadata: { topic: "Phosphate tubular buffering", priority: "high" },
  },

  {
    id: "pp2-w1s-014",
    type: "mcq",
    prompt: "In the proximal tubule, glutamine is metabolized to produce which two products that are critical for acid-base balance?",
    setup: "",
    ans: [
      { t: "Two NH4+ ions and two new HCO3- ions", ok: true },
      { t: "One NH3 molecule and one H2CO3 molecule", ok: false },
      { t: "Two urea molecules and two H+ ions", ok: false },
      { t: "One NH4+ ion and one phosphate ion", ok: false },
    ],
    rationale: "Each glutamine molecule metabolized in the proximal tubular cell yields two ammonium (NH4+) ions and two new bicarbonate (HCO3-) ions. The NH4+ is secreted into the tubular lumen (substituting for H+ on the NHE3 exchanger) and eventually excreted in the urine. The two new HCO3- molecules are transported across the basolateral membrane into the blood, representing a net gain of base. This is the most important mechanism for increasing new HCO3- production during chronic acidosis.", // source: slide Ch31 glutamine NH4+ and HCO3- production
    scene: "renal",
    sceneCfg: { label: "GLUTAMINE AMMONIA PRODUCTION" },
    metadata: { topic: "Glutamine ammonia production", priority: "high" },
  },

  {
    id: "pp2-w1s-015",
    type: "mcq",
    prompt: "In the collecting duct, how does NH3 contribute to acid excretion?",
    setup: "",
    ans: [
      { t: "NH3 enters the lumen, binds H+ to NH4+, and is trapped", ok: true },
      { t: "NH3 is pumped into the lumen by the H+ ATPase with H+", ok: false },
      { t: "NH3 becomes urea in the duct, carrying acid out of blood", ok: false },
      { t: "NH3 neutralizes luminal H+ without forming any compound", ok: false },
    ],
    rationale: "NH3 (ammonia gas) diffuses freely across cell membranes from the medullary interstitium into the collecting duct lumen. There it combines with H+ secreted by the H+ ATPase to form NH4+ (ammonium). Because NH4+ is charged, it cannot diffuse back across the membrane and is trapped in the lumen for excretion. Each NH4+ excreted represents one H+ eliminated from the body and one new HCO3- added to the blood. This trapping mechanism is called nonionic diffusion trapping.", // source: slide Ch31 NH3 buffering in collecting tubules
    scene: "renal",
    sceneCfg: { label: "AMMONIA BUFFERING IN COLLECTING DUCT" },
    metadata: { topic: "Ammonia buffering in collecting duct", priority: "high" },
  },

  {
    id: "pp2-w1s-016",
    type: "mcq",
    prompt: "During chronic metabolic acidosis, the kidney's total net acid excretion can increase from a baseline of approximately 80 mmol per day to what maximum?",
    setup: "",
    ans: [
      { t: "120 mmol per day", ok: false },
      { t: "200 mmol per day", ok: false },
      { t: "500 mmol per day", ok: true },
      { t: "1,000 mmol per day", ok: false },
    ],
    rationale: "During acidosis, total renal net acid excretion can rise to approximately 500 mmol per day. Titratable acid increases modestly from 30 to about 35 mmol per day (limited by filtered phosphate). The major increase comes from NH4+ excretion, which can rise from a baseline of 30 mmol per day to 165 mmol per day or more through upregulated glutamine metabolism. Urinary HCO3- excretion drops to zero. This adaptation takes several days to reach full capacity.", // source: slide Ch31 renal compensation for acidosis 500 mmol/day
    scene: "renal",
    sceneCfg: { label: "MAXIMAL RENAL ACID EXCRETION" },
    metadata: { topic: "Maximal renal acid excretion", priority: "high" },
  },

  {
    id: "pp2-w1s-017",
    type: "mcq",
    prompt: "During metabolic acidosis, which component of net acid excretion shows the greatest absolute increase?",
    setup: "",
    ans: [
      { t: "Titratable acid as phosphate buffered H+", ok: false },
      { t: "Ammonium (NH4+) excretion in the urine", ok: true },
      { t: "Free hydrogen ion (H+) excretion", ok: false },
      { t: "Urinary inorganic sulfate excretion", ok: false },
    ],
    rationale: "NH4+ excretion shows the greatest increase during acidosis, rising from a baseline of approximately 30 mmol per day to 165 mmol per day or higher. Titratable acid increases only modestly from 30 to 35 mmol per day because it is limited by the amount of filtered phosphate buffer. Free H+ excretion is negligible even at minimum urine pH. The kidney upregulates glutaminase activity and glutamine transport to drive NH4+ production in response to chronic acidosis.", // source: slide Ch31 NH4 excretion 30 to 165 mmol/day
    scene: "renal",
    sceneCfg: { label: "NH4+ EXCRETION IN ACIDOSIS" },
    metadata: { topic: "NH4+ excretion in acidosis", priority: "high" },
  },

  {
    id: "pp2-w1s-018",
    type: "mcq",
    prompt: "During metabolic alkalosis, how does the kidney adjust net acid excretion?",
    setup: "",
    ans: [
      { t: "Titratable acid and NH4+ fall to zero, HCO3- rises near 80", ok: true },
      { t: "Titratable acid doubles and NH4+ triples to dump excess base", ok: false },
      { t: "Only NH4+ excretion falls while titratable acid stays the same", ok: false },
      { t: "The kidney cannot help, so only respiratory change corrects it", ok: false },
    ],
    rationale: "In alkalosis, the kidney reduces H+ secretion so that titratable acid and NH4+ excretion both drop to essentially zero. Simultaneously, the kidney fails to reabsorb all filtered HCO3-, allowing approximately 80 mmol per day of bicarbonate to spill into the urine. This net loss of base from the body helps correct the alkalosis. Type B intercalated cells become more active, directly secreting HCO3- into the lumen. The kidney is an effective compensator for alkalosis, contrary to option D.", // source: slide Ch31 renal compensation for alkalosis
    scene: "renal",
    sceneCfg: { label: "RENAL COMPENSATION FOR ALKALOSIS" },
    metadata: { topic: "Renal compensation for alkalosis", priority: "high" },
  },

  {
    id: "pp2-w1s-019",
    type: "mcq",
    prompt: "A patient has pH 7.30, PCO2 55 mm Hg, and HCO3- 26 mEq per liter. Which primary acid-base disorder is present?",
    setup: "",
    ans: [
      { t: "Metabolic acidosis", ok: false },
      { t: "Respiratory acidosis", ok: true },
      { t: "Metabolic alkalosis", ok: false },
      { t: "Respiratory alkalosis", ok: false },
    ],
    rationale: "The pH is low (acidosis). The primary event is identified by which variable moved in the direction that would cause the pH change. PCO2 is elevated (55, normal 40), which drives pH down. HCO3- is slightly elevated (26, normal 24), which would push pH up. Since the HCO3- change opposes the pH change, it represents compensation, not the primary disorder. The primary disturbance is the elevated PCO2, making this respiratory acidosis with partial renal compensation (HCO3- rising from 24 toward higher values).", // source: slide Ch31 acid-base disorder classification
    scene: "renal",
    sceneCfg: { label: "ABG INTERPRETATION: RESPIRATORY ACIDOSIS" },
    metadata: { topic: "ABG interpretation respiratory acidosis", priority: "high" },
  },

  {
    id: "pp2-w1s-020",
    type: "mcq",
    prompt: "In the four-step approach to ABG interpretation, after noting whether pH is low or high, what is the next step?",
    setup: "",
    ans: [
      { t: "Calculate the serum anion gap value here", ok: false },
      { t: "See whether PCO2 or HCO3- drove the pH", ok: true },
      { t: "Check the PaO2 to assess oxygenation", ok: false },
      { t: "Get the A-a gradient for lung pathology", ok: false },
    ],
    rationale: "Step 1 is to note whether pH is low (acidosis) or high (alkalosis). Step 2 is to decide which variable, PCO2 or HCO3-, is abnormal in a direction that could cause the observed pH shift. Step 3 labels the disorder: if PCO2 is the cause, it is respiratory; if HCO3- is the cause, it is metabolic. Step 4 checks whether the other variable has moved in the opposite direction indicating compensation. Anion gap (option A) is a subsequent analysis step for metabolic acidosis specifically.", // source: slide Ch31 4-step ABG algorithm
    scene: "renal",
    sceneCfg: { label: "ABG FOUR-STEP APPROACH" },
    metadata: { topic: "ABG four-step approach", priority: "high" },
  },

  {
    id: "pp2-w1s-021",
    type: "mcq",
    prompt: "In respiratory acidosis, the primary event is an increase in PCO2. Which compensatory mechanism is activated?",
    setup: "",
    ans: [
      { t: "Kidneys raise H+ excretion and HCO3-, lifting plasma HCO3-", ok: true },
      { t: "Lungs raise the ventilation rate to blow off excess CO2", ok: false },
      { t: "Kidneys dump extra HCO3- to lower the plasma bicarbonate", ok: false },
      { t: "Peripheral chemoreceptors suppress all aldosterone release", ok: false },
    ],
    rationale: "When the primary problem is elevated PCO2 (respiratory acidosis), the lungs are the source of the problem and cannot be the compensatory organ. The kidneys compensate by increasing H+ secretion, increasing HCO3- reabsorption, and producing new HCO3- via ammonia and titratable acid excretion. This raises plasma HCO3-, which partially restores the HCO3-/CO2 ratio toward normal, nudging pH back up. Full renal compensation takes 3 to 5 days. Option B describes correction, not compensation.", // source: slide Ch31 respiratory acidosis compensation table
    scene: "renal",
    sceneCfg: { label: "RESPIRATORY ACIDOSIS COMPENSATION" },
    metadata: { topic: "Respiratory acidosis compensation", priority: "high" },
  },

  {
    id: "pp2-w1s-022",
    type: "mcq",
    prompt: "In metabolic acidosis, the primary event is a decrease in plasma HCO3-. What is the expected respiratory compensation?",
    setup: "",
    ans: [
      { t: "Hypoventilation to retain CO2 and raise PCO2", ok: false },
      { t: "Hyperventilation to blow off CO2 and lower PCO2", ok: true },
      { t: "No respiratory change, only renal compensation acts", ok: false },
      { t: "Higher tidal volume with unchanged respiratory rate", ok: false },
    ],
    rationale: "When plasma HCO3- drops (metabolic acidosis), pH falls. Peripheral and central chemoreceptors detect the low pH and stimulate hyperventilation, which increases CO2 elimination and lowers PCO2. This partially restores the HCO3-/CO2 ratio toward normal. Respiratory compensation begins within minutes and reaches maximum within 12 to 24 hours. Kussmaul breathing (deep, rapid respirations) is the clinical sign of respiratory compensation for severe metabolic acidosis such as diabetic ketoacidosis.", // source: slide Ch31 metabolic acidosis compensation
    scene: "renal",
    sceneCfg: { label: "METABOLIC ACIDOSIS RESPIRATORY COMPENSATION" },
    metadata: { topic: "Metabolic acidosis respiratory compensation", priority: "high" },
  },

  {
    id: "pp2-w1s-023",
    type: "mcq",
    prompt: "Which formula correctly calculates the anion gap, and what is the normal range?",
    setup: "",
    ans: [
      { t: "Na+ minus (Cl- plus HCO3-); normal is 8 to 16 mEq per liter", ok: true },
      { t: "Na+ plus K+ minus (Cl- plus HCO3-); normal is 12 to 20 mEq per liter", ok: false },
      { t: "Cl- minus (Na+ plus HCO3-); normal is 4 to 8 mEq per liter", ok: false },
      { t: "Na+ minus Cl- minus K+; normal is 20 to 30 mEq per liter", ok: false },
    ],
    rationale: "The anion gap equals Na+ minus (Cl- + HCO3-). Using normal values: 142 minus (108 + 24) = 10 mEq per liter. The normal range is 8 to 16 mEq per liter. This gap represents unmeasured anions (mainly albumin, phosphate, sulfate, and organic acids). Some formulas include K+ (option B), but the standard clinical formula uses Na+ alone. An elevated anion gap indicates accumulation of unmeasured anions such as ketoacids, lactate, or toxic alcohol metabolites.", // source: slide Ch31 anion gap formula 142-108-24=10
    scene: "renal",
    sceneCfg: { label: "ANION GAP CALCULATION" },
    metadata: { topic: "Anion gap calculation", priority: "high" },
  },

  {
    id: "pp2-w1s-024",
    type: "mcq",
    prompt: "A patient with diabetic ketoacidosis has a metabolic acidosis. Which pattern of anion gap and chloride is expected?",
    setup: "",
    ans: [
      { t: "Increased anion gap with normal chloride", ok: true },
      { t: "Normal anion gap with increased chloride", ok: false },
      { t: "Decreased anion gap with decreased chloride", ok: false },
      { t: "Increased anion gap with increased chloride", ok: false },
    ],
    rationale: "In diabetic ketoacidosis, unmeasured anions (acetoacetate and beta-hydroxybutyrate) accumulate in the blood. These new anions replace HCO3- in the electroneutrality equation without increasing Cl-. This produces an elevated anion gap with a normal serum chloride. In contrast, diarrhea causes HCO3- loss that is replaced by Cl- retention, producing a normal anion gap (hyperchloremic) metabolic acidosis. The distinction between these two patterns is a key diagnostic tool.", // source: slide Ch31 increased AG: DKA, normal Cl-
    scene: "renal",
    sceneCfg: { label: "ANION GAP IN DKA" },
    metadata: { topic: "Anion gap in DKA", priority: "high" },
  },

  {
    id: "pp2-w1s-025",
    type: "mcq",
    prompt: "Which conditions cause a normal anion gap (hyperchloremic) metabolic acidosis?",
    setup: "",
    ans: [
      { t: "Diabetic ketoacidosis, lactic acidosis, methanol poisoning", ok: false },
      { t: "Diarrhea, renal tubular acidosis, carbonic anhydrase inhibitors", ok: true },
      { t: "Aspirin poisoning, starvation, ethylene glycol ingestion", ok: false },
      { t: "Chronic kidney disease, rhabdomyolysis, sepsis", ok: false },
    ],
    rationale: "Normal anion gap metabolic acidosis occurs when HCO3- is lost and replaced by Cl-. Classic causes include diarrhea (direct GI loss of HCO3-), renal tubular acidosis (impaired tubular H+ secretion or HCO3- reabsorption), Addison disease (aldosterone deficiency reduces H+ secretion), and carbonic anhydrase inhibitors (impair H+ secretion). All the conditions in options A and C produce unmeasured anions that raise the anion gap.", // source: slide Ch31 normal AG: diarrhea, RTA, Addison, CAI
    scene: "renal",
    sceneCfg: { label: "NORMAL ANION GAP METABOLIC ACIDOSIS" },
    metadata: { topic: "Normal anion gap metabolic acidosis", priority: "high" },
  },

  {
    id: "pp2-w1s-026",
    type: "mcq",
    prompt: "Which of the following is a common cause of metabolic alkalosis?",
    setup: "",
    ans: [
      { t: "Diarrhea", ok: false },
      { t: "Vomiting of gastric acid", ok: true },
      { t: "Diabetic ketoacidosis", ok: false },
      { t: "Chronic kidney disease", ok: false },
    ],
    rationale: "Vomiting removes gastric HCl from the body. For each H+ ion secreted into the stomach lumen, one HCO3- is generated and returned to the blood (the alkaline tide). Normally this HCO3- is neutralized when gastric acid reaches the duodenum and stimulates pancreatic HCO3- secretion. With vomiting, the gastric H+ never reaches the duodenum, so the HCO3- is never offset, producing metabolic alkalosis. Diarrhea (option A) causes metabolic acidosis through HCO3- loss.", // source: slide Ch31 metabolic alkalosis causes: vomiting
    scene: "renal",
    sceneCfg: { label: "METABOLIC ALKALOSIS CAUSES" },
    metadata: { topic: "Metabolic alkalosis causes", priority: "high" },
  },

  {
    id: "pp2-w1s-027",
    type: "mcq",
    prompt: "Common causes of respiratory acidosis include all of the following EXCEPT:",
    setup: "",
    ans: [
      { t: "Pneumonia with impaired gas exchange", ok: false },
      { t: "Emphysema with chronic air trapping", ok: false },
      { t: "Anxiety driven hyperventilation spell", ok: true },
      { t: "Brain injury to the respiratory center", ok: false },
    ],
    rationale: "Respiratory acidosis results from hypoventilation (decreased CO2 elimination). Pneumonia, emphysema, airway obstruction, and brain damage affecting the respiratory center all impair ventilation and cause CO2 retention. Hyperventilation due to anxiety causes excess CO2 elimination, lowering PCO2 and producing respiratory alkalosis, not acidosis. Other respiratory acidosis causes include chest wall deformity, neuromuscular disease, and respiratory depressant drugs.", // source: slide Ch31 respiratory acidosis causes
    scene: "renal",
    sceneCfg: { label: "RESPIRATORY ACIDOSIS CAUSES" },
    metadata: { topic: "Respiratory acidosis causes", priority: "high" },
  },

  {
    id: "pp2-w1s-028",
    type: "mcq",
    prompt: "Overuse of diuretics can produce metabolic alkalosis through which pathway?",
    setup: "",
    ans: [
      { t: "They expand blood volume, diluting the plasma H+ load", ok: false },
      { t: "Volume loss raises aldosterone and drops K+, raising HCO3-", ok: true },
      { t: "They directly make new HCO3- in the collecting duct lumen", ok: false },
      { t: "They block carbonic anhydrase, halting tubular H+ secretion", ok: false },
    ],
    rationale: "Diuretic overuse produces volume contraction, which activates the renin-angiotensin-aldosterone system. Elevated angiotensin II and aldosterone both stimulate tubular H+ secretion. Simultaneously, diuretics cause K+ depletion, which independently stimulates H+ secretion (as K+ exits cells, H+ enters cells to maintain charge balance). The combined effect is increased HCO3- reabsorption and production, raising plasma bicarbonate and causing metabolic alkalosis. Option D describes carbonic anhydrase inhibitors, which cause metabolic acidosis.", // source: slide Ch31 diuretic-induced metabolic alkalosis pathway
    scene: "renal",
    sceneCfg: { label: "DIURETIC-INDUCED METABOLIC ALKALOSIS" },
    metadata: { topic: "Diuretic induced metabolic alkalosis", priority: "high" },
  },

  {
    id: "pp2-w1s-029",
    type: "mcq",
    prompt: "Which conditions produce an increased anion gap metabolic acidosis?",
    setup: "",
    ans: [
      { t: "Diarrhea, renal tubular acidosis, and Addison disease", ok: false },
      { t: "Ketoacidosis, lactic acidosis, aspirin and methanol", ok: true },
      { t: "Vomiting, mineralocorticoid excess, and diuretic overuse", ok: false },
      { t: "Hyperventilation, anxiety, and high altitude exposure", ok: false },
    ],
    rationale: "Increased anion gap metabolic acidosis results from accumulation of unmeasured anions. The classic causes include diabetic ketoacidosis (beta-hydroxybutyrate and acetoacetate), lactic acidosis (lactate), aspirin poisoning (salicylate), methanol poisoning (formate), ethylene glycol poisoning (oxalate), and starvation ketosis. Option A lists normal anion gap causes. Option C lists metabolic alkalosis causes. Option D lists respiratory alkalosis causes.", // source: slide Ch31 increased AG causes: DKA, lactic, aspirin, methanol
    scene: "renal",
    sceneCfg: { label: "INCREASED ANION GAP CAUSES" },
    metadata: { topic: "Increased anion gap causes", priority: "high" },
  },

  {
    id: "pp2-w1s-030",
    type: "mcq",
    prompt: "A patient has pH 7.50, PCO2 48 mm Hg, and HCO3- 36 mEq per liter. What is the primary disorder and what is the compensation?",
    setup: "",
    ans: [
      { t: "Metabolic alkalosis with hypoventilation raising PCO2", ok: true },
      { t: "Respiratory alkalosis with slower renal HCO3- handling", ok: false },
      { t: "Metabolic alkalosis with no compensation present yet", ok: false },
      { t: "Mixed respiratory and metabolic alkalosis together", ok: false },
    ],
    rationale: "The pH is elevated (alkalosis). HCO3- is markedly elevated at 36 (normal 24), which is the primary cause driving pH up. PCO2 is also elevated at 48 (normal 40), which would push pH down and therefore represents compensation, not a primary disorder. The respiratory compensation for metabolic alkalosis is hypoventilation, which retains CO2 and partially offsets the pH rise. Since PCO2 is abnormal, compensation is present, ruling out option C.", // source: slide Ch31 acid-base disorder analysis
    scene: "renal",
    sceneCfg: { label: "ABG: METABOLIC ALKALOSIS WITH COMPENSATION" },
    metadata: { topic: "ABG metabolic alkalosis with compensation", priority: "high" },
  },

  {
    id: "pp2-w1s-031",
    type: "mcq",
    prompt: "Which factors increase renal H+ secretion? Select the answer that lists only correct stimulators.",
    setup: "",
    ans: [
      { t: "Increased PCO2, decreased HCO3-, increased aldosterone, hypokalemia", ok: true },
      { t: "Decreased PCO2, increased HCO3-, decreased aldosterone, hyperkalemia", ok: false },
      { t: "Increased PCO2, increased HCO3-, decreased aldosterone, hypokalemia", ok: false },
      { t: "Decreased PCO2, decreased HCO3-, increased aldosterone, hypokalemia", ok: false },
    ],
    rationale: "Increased PCO2 drives more intracellular H+ formation (via carbonic anhydrase). Decreased filtered HCO3- load (reflecting low plasma HCO3-) signals acidosis and upregulates H+ secretion. Increased aldosterone stimulates H+ ATPase activity in intercalated cells. Hypokalemia causes K+ to leave cells with H+ entering, increasing intracellular H+ and driving more secretion. Option B lists the exact opposite of each stimulator. Options C and D mix stimulators with inhibitors.", // source: slide Ch31 factors increasing H+ secretion
    scene: "renal",
    sceneCfg: { label: "FACTORS INCREASING H+ SECRETION" },
    metadata: { topic: "Factors increasing H+ secretion", priority: "high" },
  },

  /* ───────── Ch 32  Diuretics & Kidney Diseases ───────── */

  {
    id: "pp2-w1s-032",
    type: "mcq",
    prompt: "Acetazolamide acts by inhibiting which enzyme, and what acid-base disturbance does it characteristically cause?",
    setup: "",
    ans: [
      { t: "Carbonic anhydrase; metabolic acidosis", ok: true },
      { t: "Na+/K+ ATPase; metabolic alkalosis", ok: false },
      { t: "Angiotensin converting enzyme; hyperkalemia", ok: false },
      { t: "Carbonic anhydrase; respiratory alkalosis", ok: false },
    ],
    rationale: "Acetazolamide inhibits carbonic anhydrase in the proximal tubule. This enzyme is essential for generating intracellular H+ (from CO2 + H2O) for secretion via NHE3, and for converting luminal H2CO3 to CO2 + H2O (brush border CA IV). Without carbonic anhydrase activity, H+ secretion falls, HCO3- reabsorption is impaired, and bicarbonate is lost in the urine, producing metabolic acidosis with bicarbonaturia. This limits its long term diuretic utility.", // source: slide Ch32 acetazolamide mechanism
    scene: "renal",
    sceneCfg: { label: "ACETAZOLAMIDE MECHANISM" },
    metadata: { topic: "Acetazolamide mechanism", priority: "high" },
  },

  {
    id: "pp2-w1s-033",
    type: "mcq",
    prompt: "Loop diuretics block NKCC2 in the thick ascending limb. What is the normal transepithelial voltage in this segment, and how does loop diuretic blockade affect it?",
    setup: "",
    ans: [
      { t: "Normal voltage is +8 mV (lumen positive); blockade abolishes this positive voltage", ok: true },
      { t: "Normal voltage is -10 mV (lumen negative); blockade makes it more negative", ok: false },
      { t: "Normal voltage is 0 mV; blockade creates a negative lumen potential", ok: false },
      { t: "Normal voltage is -50 mV (lumen negative); blockade reverses it to positive", ok: false },
    ],
    rationale: "In the thick ascending limb, NKCC2 transports 1 Na+, 1 K+, and 2 Cl- from lumen to cell. K+ recycles back to the lumen through ROMK channels, creating a lumen positive voltage of approximately +8 mV. This positive voltage drives paracellular reabsorption of Ca2+, Mg2+, Na+, and K+. When loop diuretics block NKCC2, K+ recycling stops, the lumen positive voltage collapses, and paracellular cation reabsorption ceases. This explains why loop diuretics cause calcium and magnesium wasting.", // source: slide Ch32 loop diuretics +8mV lumen
    scene: "renal",
    sceneCfg: { label: "LOOP DIURETIC LUMEN VOLTAGE EFFECT" },
    metadata: { topic: "Loop diuretic lumen voltage effect", priority: "high" },
  },

  {
    id: "pp2-w1s-034",
    type: "mcq",
    prompt: "Why do loop diuretics impair the kidney's ability to both concentrate and dilute urine?",
    setup: "",
    ans: [
      { t: "They block TAL NaCl uptake, the key to both gradient and dilution", ok: true },
      { t: "They block collecting duct water uptake, stopping both processes", ok: false },
      { t: "They raise ADH, locking the kidney at one fixed urine osmolarity", ok: false },
      { t: "They kill medullary cells making prostaglandins for both tasks", ok: false },
    ],
    rationale: "The thick ascending limb serves dual roles. By reabsorbing NaCl without water, it both builds the hypertonic medullary interstitium (needed for concentration with ADH) and dilutes the tubular fluid entering the distal nephron (the diluting segment). Loop diuretics block NKCC2 in this segment, abolishing both functions simultaneously. The medullary gradient washes out (impairing concentration) and tubular fluid remains iso-osmotic (impairing dilution). No other single nephron segment has this dual capability.", // source: slide Ch32 loop diuretics impair concentration
    scene: "renal",
    sceneCfg: { label: "LOOP DIURETICS: DUAL IMPAIRMENT" },
    metadata: { topic: "Loop diuretics dual impairment", priority: "high" },
  },

  {
    id: "pp2-w1s-035",
    type: "mcq",
    prompt: "Thiazide diuretics block NCC in the distal convoluted tubule. What is the normal transepithelial voltage in this segment?",
    setup: "",
    ans: [
      { t: "+8 mV (lumen positive)", ok: false },
      { t: "-10 mV (lumen negative)", ok: true },
      { t: "0 mV (no voltage)", ok: false },
      { t: "-50 mV (lumen negative)", ok: false },
    ],
    rationale: "The distal convoluted tubule normally has a lumen negative voltage of approximately -10 mV. The NCC cotransporter (Na+/Cl- cotransporter) is electroneutral, but basolateral Na+/K+ ATPase activity and Cl- exit through basolateral channels create the negative lumen potential. This is distinct from the thick ascending limb (+8 mV, lumen positive) and the cortical collecting duct (-50 mV via ENaC). The -10 mV voltage helps drive Ca2+ reabsorption in this segment.", // source: slide Ch32 thiazides -10mV lumen
    scene: "renal",
    sceneCfg: { label: "THIAZIDE LUMEN VOLTAGE" },
    metadata: { topic: "Thiazide lumen voltage", priority: "high" },
  },

  {
    id: "pp2-w1s-036",
    type: "mcq",
    prompt: "What are the primary clinical indications for thiazide diuretics?",
    setup: "",
    ans: [
      { t: "Pulmonary edema and acute heart failure flares", ok: false },
      { t: "Hypertension, mild heart failure, calcium stones", ok: true },
      { t: "Hyperkalemia together with metabolic acidosis", ok: false },
      { t: "Cerebral edema along with acute angle glaucoma", ok: false },
    ],
    rationale: "Thiazides are first line agents for essential hypertension because of their sustained mild natriuretic effect. They are useful in mild heart failure as well. Unlike loop diuretics, thiazides enhance calcium reabsorption in the distal tubule (blocking NCC shifts voltage more negative, favoring Ca2+ entry through TRPV5). This makes them protective against calcium kidney stones. For severe edema or acute pulmonary edema (option A), loop diuretics are preferred because of their greater potency.", // source: slide Ch32 thiazides HTN, HF, stones
    scene: "renal",
    sceneCfg: { label: "THIAZIDE CLINICAL INDICATIONS" },
    metadata: { topic: "Thiazide clinical indications", priority: "high" },
  },

  {
    id: "pp2-w1s-037",
    type: "mcq",
    prompt: "Potassium-sparing diuretics are divided into two subclasses. Which answer correctly identifies both subclasses with an example of each?",
    setup: "",
    ans: [
      { t: "Aldosterone blockers (spironolactone) and ENaC blockers (amiloride)", ok: true },
      { t: "Loop agents (furosemide) and thiazide agents (hydrochlorothiazide)", ok: false },
      { t: "Carbonic anhydrase blockers (acetazolamide) and osmotics (mannitol)", ok: false },
      { t: "NKCC2 blockers (bumetanide) and NCC blockers (chlorthalidone here)", ok: false },
    ],
    rationale: "Potassium-sparing diuretics reduce K+ loss by two distinct mechanisms. Aldosterone receptor antagonists (spironolactone and eplerenone) block mineralocorticoid receptors in principal cells, reducing ENaC and ROMK expression. ENaC blockers (amiloride and triamterene) directly block the epithelial sodium channel. Both mechanisms reduce lumen negative voltage in the collecting duct (normally about -50 mV), which decreases the driving force for K+ secretion. The major risk with both subclasses is hyperkalemia.", // source: slide Ch32 K-sparing: spironolactone/eplerenone and amiloride/triamterene
    scene: "renal",
    sceneCfg: { label: "K-SPARING DIURETIC SUBCLASSES" },
    metadata: { topic: "K-sparing diuretic subclasses", priority: "high" },
  },

  {
    id: "pp2-w1s-038",
    type: "mcq",
    prompt: "The 'diuretic braking phenomenon' refers to which clinical observation?",
    setup: "",
    ans: [
      { t: "The natriuretic effect fades over days as Na+ retention rises", ok: true },
      { t: "The drug triggers rebound hypertension the moment it is stopped", ok: false },
      { t: "Loop agents steadily damage the nephron with each repeat dose", ok: false },
      { t: "Two diuretic classes always cancel out one another completely", ok: false },
    ],
    rationale: "Diuretic braking refers to the progressive blunting of a diuretic's natriuretic effect with continued use. After the initial sodium and water loss, the resulting volume contraction activates compensatory mechanisms including the renin-angiotensin-aldosterone system, sympathetic nervous system, and structural remodeling of distal tubule cells (hypertrophy with increased Na+/K+ ATPase expression). These mechanisms increase sodium reabsorption in segments not blocked by the diuretic, offsetting its effect.", // source: slide Ch32 diuretic braking phenomenon
    scene: "renal",
    sceneCfg: { label: "DIURETIC BRAKING PHENOMENON" },
    metadata: { topic: "Diuretic braking phenomenon", priority: "high" },
  },

  {
    id: "pp2-w1s-039",
    type: "mcq",
    prompt: "Osmotic diuretics such as mannitol produce diuresis by which mechanism?",
    setup: "",
    ans: [
      { t: "They block proximal tubule sodium transporters directly", ok: false },
      { t: "They are filtered but not reabsorbed, holding water in lumen", ok: true },
      { t: "They raise ADH, sending more water into the collecting duct", ok: false },
      { t: "They open aquaporin channels directly in the collecting duct", ok: false },
    ],
    rationale: "Mannitol is freely filtered at the glomerulus but cannot be reabsorbed by any tubular transporter. As sodium and water are reabsorbed around it, mannitol concentration rises in the tubular fluid, creating an osmotic force that holds water in the lumen and opposes further water reabsorption. This increases urine volume. Clinical uses include reducing intracranial pressure and intraocular pressure. Mannitol must be given intravenously because it is poorly absorbed from the GI tract.", // source: slide Ch32 osmotic diuretics mannitol
    scene: "renal",
    sceneCfg: { label: "OSMOTIC DIURETIC MECHANISM" },
    metadata: { topic: "Osmotic diuretic mechanism", priority: "high" },
  },

  {
    id: "pp2-w1s-040",
    type: "mcq",
    prompt: "Acute kidney injury is classified by etiology into three categories. Which answer gives the correct categories with their approximate frequencies?",
    setup: "",
    ans: [
      { t: "Prerenal (50 to 55%), intrarenal (35 to 40%), postrenal (5%)", ok: true },
      { t: "Prerenal (25%), intrarenal (25%), postrenal (50%)", ok: false },
      { t: "Intrarenal (70%), prerenal (20%), postrenal (10%)", ok: false },
      { t: "Prerenal (35%), intrarenal (55%), postrenal (10%)", ok: false },
    ],
    rationale: "Prerenal AKI (inadequate renal perfusion from hemorrhage, heart failure, or sepsis) is the most common category at 50 to 55 percent. Intrarenal AKI (direct parenchymal damage from nephrotoxins, ischemia, or glomerulonephritis) accounts for 35 to 40 percent. Postrenal AKI (urinary tract obstruction from kidney stones, tumors, or prostatic hypertrophy) is the least common at approximately 5 percent. Recognizing the category guides treatment because prerenal and postrenal causes are often reversible.", // source: slide Ch32 AKI classification 50-55% prerenal
    scene: "renal",
    sceneCfg: { label: "AKI CLASSIFICATION" },
    metadata: { topic: "AKI classification", priority: "high" },
  },

  {
    id: "pp2-w1s-041",
    type: "mcq",
    prompt: "Which of the following is a prerenal cause of acute kidney injury?",
    setup: "",
    ans: [
      { t: "Aminoglycoside drug nephrotoxicity", ok: false },
      { t: "Bilateral ureteral stone blockage", ok: false },
      { t: "Severe hemorrhage with hypovolemia", ok: true },
      { t: "Acute glomerulonephritis flare", ok: false },
    ],
    rationale: "Prerenal AKI results from inadequate blood flow to the kidneys before the renal parenchyma itself. Severe hemorrhage causes hypovolemic shock, reducing renal perfusion pressure below the autoregulatory range and dropping GFR. The kidneys are structurally normal but underperfused. Aminoglycoside toxicity (option A) and glomerulonephritis (option D) are intrarenal causes. Bilateral ureteral stones (option B) cause postrenal (obstructive) AKI.", // source: slide Ch32 prerenal AKI causes
    scene: "renal",
    sceneCfg: { label: "PRERENAL AKI" },
    metadata: { topic: "Prerenal AKI causes", priority: "high" },
  },

  {
    id: "pp2-w1s-042",
    type: "mcq",
    prompt: "The vicious cycle of chronic kidney disease progression involves nephron loss leading to which sequence of events?",
    setup: "",
    ans: [
      { t: "Lower GFR, lower blood pressure, then more nephron loss", ok: false },
      { t: "Nephron hypertrophy, higher glomerular pressure, sclerosis", ok: true },
      { t: "Less tubular secretion, low blood volume, artery stenosis", ok: false },
      { t: "Nephron regrowth, excess filtration, then tubule blockage", ok: false },
    ],
    rationale: "When nephrons are lost, the surviving nephrons undergo compensatory hypertrophy and vasodilation to maintain total GFR. This adaptation increases single nephron GFR by raising glomerular capillary pressure. Over time, the elevated pressure damages glomerular capillaries, causing glomerular sclerosis. Sclerosed glomeruli stop functioning, further reducing nephron number and perpetuating the cycle. Systemic hypertension accelerates this cycle by transmitting higher pressure to the glomeruli.", // source: slide Ch32 CKD vicious cycle
    scene: "renal",
    sceneCfg: { label: "CKD VICIOUS CYCLE" },
    metadata: { topic: "CKD vicious cycle", priority: "high" },
  },

  {
    id: "pp2-w1s-043",
    type: "mcq",
    prompt: "According to the staging system for chronic kidney disease, what GFR range defines Stage 3 (moderately reduced function)?",
    setup: "",
    ans: [
      { t: "60 to 89 mL per min per 1.73 m2", ok: false },
      { t: "30 to 59 mL per min per 1.73 m2", ok: true },
      { t: "15 to 29 mL per min per 1.73 m2", ok: false },
      { t: "Less than 15 mL per min per 1.73 m2", ok: false },
    ],
    rationale: "CKD Stage 3 is defined by a GFR of 30 to 59 mL/min/1.73 m2, representing moderately reduced kidney function. Stage 1 is GFR 90 or more (with evidence of kidney damage). Stage 2 is 60 to 89. Stage 4 is 15 to 29 (severe reduction, preparation for dialysis). Stage 5 is less than 15 (established kidney failure requiring dialysis or transplant). Stage 3 is the point at which many complications of CKD (anemia, bone disease, electrolyte disturbances) begin to manifest clinically.", // source: slide Ch32 CKD stages
    scene: "renal",
    sceneCfg: { label: "CKD STAGE 3 GFR" },
    metadata: { topic: "CKD stage 3 GFR", priority: "high" },
  },

  {
    id: "pp2-w1s-044",
    type: "mcq",
    prompt: "Stage 5 CKD (end-stage kidney disease) is defined by a GFR below what threshold, and what treatment is required?",
    setup: "",
    ans: [
      { t: "Below 30 mL per min; ACE inhibitor therapy", ok: false },
      { t: "Below 15 mL per min; dialysis or kidney transplant", ok: true },
      { t: "Below 60 mL per min; dietary protein restriction alone", ok: false },
      { t: "Below 5 mL per min; supportive care only", ok: false },
    ],
    rationale: "Stage 5 CKD is established kidney failure with GFR below 15 mL/min/1.73 m2. At this level, the kidneys cannot maintain adequate excretion of metabolic waste, fluid balance, or electrolyte homeostasis. Patients require renal replacement therapy in the form of dialysis (hemodialysis or peritoneal dialysis) or kidney transplantation. Without treatment, uremic toxins accumulate and death follows within days to weeks.", // source: slide Ch32 Stage 5 <15 mL/min dialysis or transplant
    scene: "renal",
    sceneCfg: { label: "STAGE 5 CKD DEFINITION" },
    metadata: { topic: "Stage 5 CKD definition", priority: "high" },
  },

  {
    id: "pp2-w1s-045",
    type: "mcq",
    prompt: "In chronic kidney disease, plasma solutes fall into three categories based on how their concentrations change as GFR declines. Which category includes creatinine and urea?",
    setup: "",
    ans: [
      { t: "Group A: levels climb steeply because excretion needs filtration", ok: true },
      { t: "Group B: levels climb only mildly as tubular secretion offsets it", ok: false },
      { t: "Group C: levels hold steady as intake matches extrarenal losses", ok: false },
      { t: "Group D: levels fall because muscle wasting cuts their production", ok: false },
    ],
    rationale: "Group A solutes (creatinine and urea) have plasma concentrations that are inversely proportional to GFR because they rely almost exclusively on glomerular filtration for excretion. As GFR falls by half, their plasma concentrations approximately double. Group B solutes (phosphate and H+) rise moderately because regulatory hormones (PTH for phosphate, ammonia adaptation for H+) partially compensate. Group C solutes (Na+ and Cl-) remain nearly constant because the kidney adjusts fractional reabsorption.", // source: slide Ch32 CKD solute groups A/B/C
    scene: "renal",
    sceneCfg: { label: "CKD SOLUTE GROUPS" },
    metadata: { topic: "CKD solute groups", priority: "high" },
  },

  {
    id: "pp2-w1s-046",
    type: "mcq",
    prompt: "Why is serum creatinine an insensitive early marker of GFR decline?",
    setup: "",
    ans: [
      { t: "It is secreted by tubules, so secretion hides the GFR drop", ok: false },
      { t: "The curve means big early GFR drops barely move creatinine", ok: true },
      { t: "It is filtered only when GFR stays above 60 mL per minute", ok: false },
      { t: "Its production climbs in CKD, falsely lowering the ratio", ok: false },
    ],
    rationale: "The creatinine versus GFR relationship is a rectangular hyperbola. At normal GFR (120 mL/min), a 50 percent GFR drop (to 60 mL/min) only doubles creatinine from 1.0 to 2.0 mg/dL, a change that may still fall within the normal lab range. Additionally, creatinine production depends on muscle mass, so a cachectic patient with low muscle mass may have a deceptively low creatinine despite significantly reduced GFR. Diet (meat intake) and tubular secretion add further variability.", // source: slide Ch32 creatinine in CKD: large GFR changes → small creatinine changes
    scene: "renal",
    sceneCfg: { label: "CREATININE AS GFR MARKER" },
    metadata: { topic: "Creatinine as early GFR marker", priority: "high" },
  },

  {
    id: "pp2-w1s-047",
    type: "mcq",
    prompt: "Isosthenuria in advanced CKD refers to which finding?",
    setup: "",
    ans: [
      { t: "Urine osmolarity is fixed near plasma, losing both abilities", ok: true },
      { t: "Urine output is fixed at one liter a day whatever the intake", ok: false },
      { t: "Urine protein concentration matches the plasma protein level", ok: false },
      { t: "Urine pH is locked at 7.0 and cannot be shifted in any way", ok: false },
    ],
    rationale: "As nephron number declines in CKD, each surviving nephron handles a larger obligatory solute load, limiting dilution. Simultaneously, the medullary gradient is washed out by increased per nephron blood flow, limiting concentration. The result is that urine specific gravity converges toward 1.010 (approximately 300 mOsm/L, near plasma osmolarity) regardless of whether the patient is volume depleted or volume loaded. This loss of both concentrating and diluting ability is called isosthenuria.", // source: slide Ch32 isosthenuria SG converges to 1.010
    scene: "renal",
    sceneCfg: { label: "ISOSTHENURIA IN CKD" },
    metadata: { topic: "Isosthenuria in CKD", priority: "high" },
  },

  {
    id: "pp2-w1s-048",
    type: "mcq",
    prompt: "Complete kidney shutdown (anuria) leads to which constellation of physiologic derangements?",
    setup: "",
    ans: [
      { t: "Fluid retention, edema, hypertension, metabolic acidosis, hyperkalemia, and uremia", ok: true },
      { t: "Dehydration, hypotension, metabolic alkalosis, hypokalemia, and low BUN", ok: false },
      { t: "Normal fluid balance maintained by extrarenal excretion for 30 days", ok: false },
      { t: "Isolated hyperkalemia with no other electrolyte or acid-base disturbance", ok: false },
    ],
    rationale: "Without renal excretory function, all renally cleared substances accumulate. Water and sodium retention cause edema and hypertension. Failure to excrete non-volatile acid causes progressive metabolic acidosis. Potassium accumulates (hyperkalemia), which is the most immediately life threatening consequence due to cardiac arrhythmia risk. Nitrogenous waste (urea, creatinine) accumulates causing uremia with mental status changes. Without treatment, death occurs in 8 to 14 days.", // source: slide Ch32 kidney failure effects: 8-14 days death
    scene: "renal",
    sceneCfg: { label: "COMPLETE KIDNEY SHUTDOWN EFFECTS" },
    metadata: { topic: "Complete kidney shutdown effects", priority: "high" },
  },

  {
    id: "pp2-w1s-049",
    type: "mcq",
    prompt: "Hemodialysis works by passing blood across a semipermeable membrane in contact with dialysate. Which principle drives waste removal?",
    setup: "",
    ans: [
      { t: "Active transport driven by membrane pumps", ok: false },
      { t: "Diffusion down gradients from blood to dialysate", ok: true },
      { t: "Filtration under high hydrostatic blood pressure", ok: false },
      { t: "Pinocytosis of waste molecules by membrane pores", ok: false },
    ],
    rationale: "Hemodialysis relies primarily on diffusion. Waste products (urea, creatinine, K+, H+) have higher concentrations in the blood than in the dialysate, so they diffuse across the semipermeable membrane into the dialysate. Conversely, substances with higher concentration in the dialysate (such as HCO3-) diffuse into the blood. Some convective removal (ultrafiltration) also occurs when a pressure gradient is applied to remove excess fluid, but the principal mechanism for solute clearance is diffusion.", // source: slide Ch32 dialysis semipermeable membrane diffusion
    scene: "renal",
    sceneCfg: { label: "HEMODIALYSIS PRINCIPLE" },
    metadata: { topic: "Hemodialysis principle", priority: "high" },
  },

  {
    id: "pp2-w1s-050",
    type: "mcq",
    prompt: "Hypertension and diabetes mellitus together account for what percentage of all end-stage renal disease cases?",
    setup: "",
    ans: [
      { t: "Approximately 30 percent", ok: false },
      { t: "Approximately 50 percent", ok: false },
      { t: "Greater than 70 percent", ok: true },
      { t: "Greater than 95 percent", ok: false },
    ],
    rationale: "Hypertension and diabetes mellitus are the two leading causes of ESRD, together accounting for more than 70 percent of all cases. Diabetes (primarily type 2, which represents over 90 percent of diabetes cases) causes ESRD through diabetic nephropathy with progressive glomerulosclerosis. Hypertension causes ESRD through hypertensive nephrosclerosis. Obesity is a major driver of both conditions, and 76 to 75 percent of the risk for hypertension is attributable to excess weight gain.", // source: slide Ch32 HTN + DM >70% ESRD
    scene: "renal",
    sceneCfg: { label: "HTN AND DM IN ESRD" },
    metadata: { topic: "HTN and DM in ESRD", priority: "high" },
  },

  {
    id: "pp2-w1s-051",
    type: "mcq",
    prompt: "In the metabolic alkalosis compensation table, what is the expected respiratory response?",
    setup: "",
    ans: [
      { t: "Hyperventilation acting to lower the PCO2", ok: false },
      { t: "Hypoventilation acting to raise the PCO2", ok: true },
      { t: "No ventilation change, only renal compensation", ok: false },
      { t: "Bigger tidal volume, slower rate, flat net PCO2", ok: false },
    ],
    rationale: "Metabolic alkalosis raises plasma pH. Chemoreceptors detect the elevated pH and reduce respiratory drive, causing hypoventilation. This retains CO2, raising PCO2, which partially corrects pH back toward normal. However, respiratory compensation for metabolic alkalosis is limited because hypoventilation also causes hypoxemia, which eventually stimulates ventilation through peripheral chemoreceptors. This is why respiratory compensation for metabolic alkalosis is typically incomplete compared to the vigorous hyperventilation seen in metabolic acidosis.", // source: slide Ch31 acid-base compensation table: met alkalosis → ↓ventilation
    scene: "renal",
    sceneCfg: { label: "METABOLIC ALKALOSIS RESPIRATORY COMPENSATION" },
    metadata: { topic: "Metabolic alkalosis respiratory compensation", priority: "high" },
  },

  {
    id: "pp2-w1s-052",
    type: "mcq",
    prompt: "A patient has pH 7.48, PCO2 30 mm Hg, and HCO3- 22 mEq per liter. What is the primary disorder?",
    setup: "",
    ans: [
      { t: "Primary metabolic alkalosis here", ok: false },
      { t: "Primary respiratory alkalosis", ok: true },
      { t: "Metabolic acidosis with resp comp", ok: false },
      { t: "Mixed metabolic and resp alkalosis", ok: false },
    ],
    rationale: "The pH is elevated (alkalosis). PCO2 is low (30, normal 40), which drives pH up and is therefore the primary disturbance. HCO3- is slightly low (22, normal 24), which would push pH down and therefore represents renal compensation (the kidney reduces HCO3- reabsorption to offset the alkalosis). This is respiratory alkalosis with partial renal compensation. Common causes include hyperventilation from anxiety, high altitude, pulmonary embolism, or pregnancy.", // source: slide Ch31 acid-base classification
    scene: "renal",
    sceneCfg: { label: "ABG: RESPIRATORY ALKALOSIS" },
    metadata: { topic: "ABG respiratory alkalosis interpretation", priority: "high" },
  },

  {
    id: "pp2-w1s-053",
    type: "mcq",
    prompt: "Which solute group in CKD maintains a nearly normal plasma concentration even with significantly reduced GFR?",
    setup: "",
    ans: [
      { t: "Creatinine and urea (Group A)", ok: false },
      { t: "Phosphate and hydrogen ions (Group B)", ok: false },
      { t: "Sodium and chloride (Group C)", ok: true },
      { t: "Potassium and magnesium", ok: false },
    ],
    rationale: "Group C solutes (Na+ and Cl-) maintain nearly constant plasma concentrations even with severely reduced GFR. This occurs because sodium intake is typically matched by sodium output. As GFR falls, each surviving nephron reabsorbs a smaller fraction of filtered Na+ (fractional excretion increases), maintaining sodium balance. This adaptability fails only at very low GFR (less than 5 to 10 percent of normal) or with sudden changes in intake. Creatinine and urea (Group A) rise steeply; phosphate and H+ (Group B) rise moderately.", // source: slide Ch32 Group C: Na+, Cl- flat
    scene: "renal",
    sceneCfg: { label: "CKD GROUP C SOLUTES" },
    metadata: { topic: "CKD group C solutes Na Cl", priority: "high" },
  },

  {
    id: "pp2-w1s-054",
    type: "mcq",
    prompt: "Which feature distinguishes postrenal AKI from prerenal and intrarenal AKI?",
    setup: "",
    ans: [
      { t: "It comes from outflow tract obstruction below the kidneys", ok: true },
      { t: "It comes from direct toxic injury to the renal tubule cells", ok: false },
      { t: "It comes from low cardiac output cutting renal blood flow", ok: false },
      { t: "It always causes complete anuria right from its very onset", ok: false },
    ],
    rationale: "Postrenal AKI results from obstruction of urine flow anywhere downstream of the kidneys, including ureters, bladder, or urethra. Common causes include kidney stones, prostatic hypertrophy, tumors compressing the urinary tract, and urethral strictures. The obstruction must be bilateral (or involve a solitary kidney) to cause significant AKI. Postrenal AKI is the least common form (approximately 5 percent) but is important because it is often reversible with relief of obstruction. It does not always cause complete anuria; partial obstruction can produce oliguria.", // source: slide Ch32 postrenal AKI obstruction
    scene: "renal",
    sceneCfg: { label: "POSTRENAL AKI" },
    metadata: { topic: "Postrenal AKI", priority: "high" },
  },

  {
    id: "pp2-w1s-055",
    type: "mcq",
    prompt: "Normal aging causes progressive loss of nephrons. What is the approximate number of glomeruli present per kidney at birth, and what happens by age 80?",
    setup: "",
    ans: [
      { t: "500,000 at birth, about 300,000 remain by age 80", ok: false },
      { t: "1,000,000 at birth, about 500,000 remain by age 80", ok: true },
      { t: "2,000,000 at birth, all preserved through age 80", ok: false },
      { t: "100,000 at birth, about 10,000 remain by age 80", ok: false },
    ],
    rationale: "Each kidney contains approximately 1 million (1,000,000) glomeruli at birth, totaling roughly 2 million for both kidneys. Normal aging results in a gradual decline, with approximately half of glomeruli lost by age 80. Superimposed kidney disease (diabetes, hypertension) accelerates nephron loss dramatically. The surviving nephrons undergo compensatory hypertrophy and increase their single nephron GFR, which maintains total GFR within functional limits until the reserve is exhausted.", // source: slide Ch32 aging nephron loss figure 32-3
    scene: "renal",
    sceneCfg: { label: "AGING AND NEPHRON LOSS" },
    metadata: { topic: "Aging and nephron loss", priority: "high" },
  },

  {
    id: "pp2-w1s-056",
    type: "mcq",
    prompt: "When GFR drops by 50 percent acutely, what happens to serum creatinine concentration over the following days?",
    setup: "",
    ans: [
      { t: "It doubles at once and then immediately stabilizes", ok: false },
      { t: "It climbs over 1 to 3 days to roughly double baseline", ok: true },
      { t: "It stays flat because tubular secretion fully offsets it", ok: false },
      { t: "It jumps to ten times baseline within the first 24 hours", ok: false },
    ],
    rationale: "After an acute 50 percent GFR drop, creatinine excretion initially falls below creatinine production (which remains constant). This creates a positive creatinine balance. Plasma creatinine rises gradually until the new higher concentration restores excretion to match production (because excretion equals GFR times plasma creatinine). This new steady state, at approximately double the baseline creatinine, is reached over approximately 1 to 3 days. The delay means serum creatinine lags behind acute GFR changes.", // source: slide Ch32 creatinine steady state after 50% GFR drop
    scene: "renal",
    sceneCfg: { label: "CREATININE RISE AFTER GFR DROP" },
    metadata: { topic: "Creatinine rise after acute GFR drop", priority: "high" },
  },

  {
    id: "pp2-w1s-057",
    type: "mcq",
    prompt: "Which acid-base disorder is caused by diarrhea, and what is the mechanism?",
    setup: "",
    ans: [
      { t: "Normal anion gap acidosis from HCO3- lost in the stool", ok: true },
      { t: "Increased anion gap acidosis from lactic acid buildup", ok: false },
      { t: "Metabolic alkalosis from H+ ions lost into the stool", ok: false },
      { t: "Respiratory acidosis from a low central ventilatory drive", ok: false },
    ],
    rationale: "Intestinal fluid distal to the stomach is rich in HCO3- (secreted by the pancreas and intestinal epithelium). Diarrhea causes direct loss of this bicarbonate rich fluid, lowering plasma HCO3-. The lost HCO3- is replaced by Cl- (renal retention), producing hyperchloremic (normal anion gap) metabolic acidosis. No unmeasured anions accumulate, so the anion gap remains normal. This contrasts with metabolic acidosis from ketoacidosis or lactic acidosis, where unmeasured anions elevate the gap.", // source: slide Ch31 diarrhea → normal AG metabolic acidosis
    scene: "renal",
    sceneCfg: { label: "DIARRHEA AND METABOLIC ACIDOSIS" },
    metadata: { topic: "Diarrhea and metabolic acidosis", priority: "high" },
  },

  {
    id: "pp2-w1s-058",
    type: "mcq",
    prompt: "Mineralocorticoid excess (such as primary aldosteronism) causes metabolic alkalosis by which mechanism?",
    setup: "",
    ans: [
      { t: "Aldosterone drives duct H+ ATPase secretion and K+ loss", ok: true },
      { t: "Aldosterone makes HCO3- in the adrenal cortex for the blood", ok: false },
      { t: "Aldosterone blocks carbonic anhydrase, cutting H+ secretion", ok: false },
      { t: "Aldosterone depresses breathing, leading to CO2 retention", ok: false },
    ],
    rationale: "Aldosterone acts on principal cells to increase ENaC mediated Na+ reabsorption (creating lumen negative voltage) and on Type A intercalated cells to stimulate H+ ATPase activity. The increased H+ secretion generates new HCO3- that enters the blood. Simultaneously, aldosterone promotes K+ secretion through ROMK channels. The resulting hypokalemia further stimulates H+ secretion (as H+ shifts into cells to replace lost K+). Both mechanisms drive HCO3- overproduction and metabolic alkalosis.", // source: slide Ch31 metabolic alkalosis: mineralocorticoid excess
    scene: "renal",
    sceneCfg: { label: "MINERALOCORTICOID EXCESS ALKALOSIS" },
    metadata: { topic: "Mineralocorticoid excess alkalosis", priority: "high" },
  },

  {
    id: "pp2-w1s-059",
    type: "mcq",
    prompt: "Renal tubular acidosis (RTA) causes metabolic acidosis by which general mechanism, and what type of anion gap does it produce?",
    setup: "",
    ans: [
      { t: "Poor tubular H+ secretion or HCO3- uptake, normal anion gap", ok: true },
      { t: "Tubular cells overmake lactic acid, raising the anion gap", ok: false },
      { t: "Excess chloride reabsorption that lowers the anion gap", ok: false },
      { t: "Only impaired ammoniagenesis, with normal H+ secretion", ok: false },
    ],
    rationale: "Renal tubular acidosis encompasses a group of disorders in which the kidney fails to adequately secrete H+ (distal/Type 1 RTA), reabsorb HCO3- (proximal/Type 2 RTA), or both. HCO3- is lost in the urine without accumulation of any unmeasured anion. The kidney compensates by retaining Cl-, producing hyperchloremic (normal anion gap) metabolic acidosis. This distinguishes RTA from high anion gap causes such as DKA or lactic acidosis, where unmeasured organic anions accumulate.", // source: slide Ch31 RTA → normal AG metabolic acidosis
    scene: "renal",
    sceneCfg: { label: "RENAL TUBULAR ACIDOSIS" },
    metadata: { topic: "Renal tubular acidosis", priority: "high" },
  },

  {
    id: "pp2-w1s-060",
    type: "mcq",
    prompt: "In the four primary acid-base disorders, which one has decreased PCO2 as the primary event and decreased HCO3- as the compensatory response?",
    setup: "",
    ans: [
      { t: "Respiratory acidosis", ok: false },
      { t: "Respiratory alkalosis", ok: true },
      { t: "Metabolic acidosis", ok: false },
      { t: "Metabolic alkalosis", ok: false },
    ],
    rationale: "In respiratory alkalosis, the primary event is hyperventilation causing decreased PCO2 (below 35 to 40 mm Hg), which drives pH up. The compensatory response is renal: the kidney decreases H+ excretion and reduces HCO3- reabsorption, allowing plasma HCO3- to fall. This partially offsets the pH elevation. Common causes include anxiety, high altitude, pulmonary embolism, and early sepsis. In respiratory acidosis (option A), PCO2 rises and HCO3- rises as compensation. In the metabolic disorders, HCO3- is the primary variable.", // source: slide Ch31 acid-base table: resp alkalosis ↓↓PCO2, ↓HCO3
    scene: "renal",
    sceneCfg: { label: "RESPIRATORY ALKALOSIS TABLE ENTRY" },
    metadata: { topic: "Respiratory alkalosis primary and compensatory changes", priority: "high" },
  },

];

export const PP2_WK1_SUPPLEMENT_METADATA = {
  nodeId: "pp2-wk-1",
  courseId: "adv-phys-path-2",
  chapter: "Ch. 31-32",
  title: "Acid-Base Regulation / Diuretics & Kidney Diseases (Supplement)",
  totalQuestions: PP2_WK1_SUPPLEMENT_QUESTIONS.length,
  questionTypes: { mcq: 60, multi: 0, short: 0 },
};
