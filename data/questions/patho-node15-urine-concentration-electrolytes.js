/**
 * Question bank for patho-node-15: Urine Concentration & Dilution / Electrolyte Regulation
 * Course: adv-phys-path-1
 * Chapters 29–30, Guyton & Hall 14e
 * 60 MCQs sourced from lecture slides.
 */

export const PATHO_NODE15_QUESTIONS = [

  // ── Ch. 29 — Urine Concentration & Dilution, ADH, Osmolarity ─────────────

  {
    id: "patho-n15-001",
    type: "mcq",
    prompt: "A healthy adult with maximal ADH stimulation can concentrate urine to approximately what osmolarity?",
    setup: "",
    ans: [
      { t: "1200 to 1400 mOsm/L, set by the maximal medullary interstitial gradient", ok: true },
      { t: "300 to 500 mOsm/L, reflecting isosmotic proximal tubule fluid", ok: false },
      { t: "2000 to 2500 mOsm/L, achieved by maximal urea recycling alone", ok: false },
      { t: "600 to 800 mOsm/L, the limit imposed by collecting duct aquaporins", ok: false },
    ],
    rationale: "Maximal human urine concentration is 1200 to 1400 mOsm/L. This ceiling is determined by the maximal osmolarity of the medullary interstitium, which is built and maintained by the countercurrent multiplier system (active NaCl transport in the thick ascending limb plus urea recycling). ADH increases aquaporin 2 insertion in the collecting duct, allowing water to equilibrate with this hypertonic medulla. The 300 mOsm/L option reflects isotonic fluid, not concentrated urine. Values above 1400 exceed normal human medullary capacity.", // source: Ch 29 slide — Changes in Osmolarity Based on ADH Levels
    scene: "renal",
    sceneCfg: { label: "MAXIMAL URINE CONCENTRATION" },
    metadata: { topic: "Urine Concentration Range", priority: "high" },
  },

  {
    id: "patho-n15-002",
    type: "mcq",
    prompt: "With ADH fully suppressed during a water load, the minimum urine osmolarity a healthy kidney can achieve is closest to which value?",
    setup: "",
    ans: [
      { t: "50 mOsm/L, because the thick ascending limb continues to dilute tubular fluid even without ADH", ok: true },
      { t: "150 mOsm/L, representing half of normal plasma osmolarity", ok: false },
      { t: "0 mOsm/L, because the kidney can produce pure water when ADH is absent", ok: false },
      { t: "300 mOsm/L, because tubular fluid always equilibrates with plasma in the proximal tubule", ok: false },
    ],
    rationale: "When ADH is absent, the late distal tubule and collecting duct are impermeable to water, so the dilute fluid generated in the thick ascending limb (the diluting segment) passes through without concentrating. Minimum urine osmolarity is approximately 50 mOsm/L. The kidney cannot produce pure water (0 mOsm/L) because obligatory solute excretion always carries some osmoles. The 300 mOsm/L option describes isosmotic proximal tubular fluid before dilution occurs.", // source: Ch 29 slide — Changes in Osmolarity Based on ADH Levels
    scene: "renal",
    sceneCfg: { label: "MINIMAL URINE OSMOLARITY" },
    metadata: { topic: "Urine Concentration Range", priority: "high" },
  },

  {
    id: "patho-n15-003",
    type: "mcq",
    prompt: "Which nephron segment is called the 'diluting segment' because it actively reabsorbs NaCl but is impermeable to water, thereby reducing tubular fluid osmolarity?",
    setup: "",
    ans: [
      { t: "Thick ascending limb of the loop of Henle", ok: true },
      { t: "Descending thin limb of the loop of Henle", ok: false },
      { t: "Proximal convoluted tubule", ok: false },
      { t: "Medullary collecting duct", ok: false },
    ],
    rationale: "The thick ascending limb actively transports NaCl out of the tubular lumen via the Na/K/2Cl cotransporter while remaining impermeable to water. This reduces tubular fluid osmolarity to approximately 100 mOsm/L, earning it the name 'diluting segment.' The descending thin limb is permeable to water but not NaCl, so it concentrates rather than dilutes. The proximal tubule reabsorbs isosmotically. The collecting duct permeability depends on ADH.", // source: Ch 29 slide — Countercurrent Flow; Summary of Water Reabsorption
    scene: "renal",
    sceneCfg: { label: "DILUTING SEGMENT" },
    metadata: { topic: "Countercurrent Multiplier", priority: "high" },
  },

  {
    id: "patho-n15-004",
    type: "mcq",
    prompt: "In the countercurrent multiplier, the descending thin limb of the loop of Henle is characterized by which permeability pattern?",
    setup: "",
    ans: [
      { t: "Highly permeable to water, poorly permeable to NaCl; fluid concentrates as it descends", ok: true },
      { t: "Highly permeable to NaCl, poorly permeable to water; solute exits and fluid dilutes", ok: false },
      { t: "Impermeable to both water and NaCl; osmolarity remains unchanged throughout", ok: false },
      { t: "Permeable to both water and NaCl equally; fluid equilibrates isosmotically", ok: false },
    ],
    rationale: "The descending thin limb is highly permeable to water (via aquaporin 1) but relatively impermeable to NaCl. As tubular fluid descends into the progressively hypertonic medullary interstitium, water exits by osmosis and the tubular fluid concentrates, reaching approximately 1200 mOsm/L at the papillary tip. NaCl remains trapped in the lumen. This is the passive, water loss arm of the countercurrent multiplier.", // source: Ch 29 slide — Countercurrent Flow; reabsorption summary
    scene: "renal",
    sceneCfg: { label: "DESCENDING LIMB PERMEABILITY" },
    metadata: { topic: "Countercurrent Multiplier", priority: "high" },
  },

  {
    id: "patho-n15-005",
    type: "mcq",
    prompt: "The ascending limb of the loop of Henle reabsorbs NaCl but 0% of filtered water. The osmolarity of tubular fluid therefore does what as it ascends?",
    setup: "",
    ans: [
      { t: "Decreases progressively, because solute removal without water loss dilutes the fluid", ok: true },
      { t: "Increases progressively, because water exits into the hypertonic medulla", ok: false },
      { t: "Remains constant at 1200 mOsm/L, matching the medullary interstitium", ok: false },
      { t: "Oscillates depending on ADH levels in the ascending limb epithelium", ok: false },
    ],
    rationale: "The ascending limb is impermeable to water. Active NaCl reabsorption (thick segment) and passive NaCl diffusion (thin segment) remove solute from the lumen without any water following. This progressively dilutes the tubular fluid from approximately 1200 mOsm/L at the bend to approximately 100 mOsm/L at the cortical end. ADH does not act on the ascending limb; its water impermeability is constitutive.", // source: Ch 29 slide — Summary of Water Reabsorption and Osmolarity
    scene: "renal",
    sceneCfg: { label: "ASCENDING LIMB — SOLUTE WITHOUT WATER" },
    metadata: { topic: "Countercurrent Multiplier", priority: "high" },
  },

  {
    id: "patho-n15-006",
    type: "mcq",
    prompt: "The proximal tubule reabsorbs approximately what percentage of the filtered water, and does so isosmotically?",
    setup: "",
    ans: [
      { t: "65%, because water follows solute reabsorption in a 1:1 osmotic ratio", ok: true },
      { t: "15%, representing only the small fraction removed in the early nephron", ok: false },
      { t: "85%, leaving only a tiny residual volume for the loop of Henle", ok: false },
      { t: "40%, with the remaining 60% handled entirely by the collecting duct", ok: false },
    ],
    rationale: "The proximal tubule reabsorbs approximately 65% of filtered water isosmotically, meaning both solute and water are removed in equal osmotic proportions so that the tubular fluid remains at approximately 300 mOsm/L. The 15% figure corresponds to the descending loop of Henle. The proximal tubule handles the bulk of reabsorption by volume, but it does not concentrate or dilute the fluid.", // source: Ch 29 slide — Summary of Water Reabsorption
    scene: "renal",
    sceneCfg: { label: "PROXIMAL TUBULE — 65% ISOSMOTIC" },
    metadata: { topic: "Segmental Water Reabsorption", priority: "high" },
  },

  {
    id: "patho-n15-007",
    type: "mcq",
    prompt: "Water reabsorption in the late distal tubule and collecting duct is described as 'ADH dependent' because these segments require ADH to do what?",
    setup: "",
    ans: [
      { t: "Insert aquaporin 2 channels into the luminal membrane, making the epithelium permeable to water", ok: true },
      { t: "Activate the Na/K/2Cl cotransporter, which drives secondary water reabsorption", ok: false },
      { t: "Open paracellular tight junctions, allowing bulk water flow between cells", ok: false },
      { t: "Stimulate Na/K ATPase on the basolateral membrane, pulling water osmotically", ok: false },
    ],
    rationale: "ADH (vasopressin) binds V2 receptors on the basolateral membrane of principal cells in the late distal tubule and collecting duct. This triggers cAMP mediated insertion of aquaporin 2 (AQP2) water channels into the luminal membrane. Without ADH, these segments are virtually impermeable to water and dilute urine is excreted. The Na/K/2Cl cotransporter is located in the thick ascending limb and is the target of loop diuretics, not ADH.", // source: Ch 29 slide — Summary of Water Reabsorption; ADH mechanism
    scene: "renal",
    sceneCfg: { label: "ADH — AQUAPORIN 2 INSERTION" },
    metadata: { topic: "ADH Mechanism", priority: "high" },
  },

  {
    id: "patho-n15-008",
    type: "mcq",
    prompt: "ADH (vasopressin) is synthesized in which brain structure and released from which endocrine gland?",
    setup: "",
    ans: [
      { t: "Synthesized in magnocellular neurons of the hypothalamus; released from the posterior pituitary", ok: true },
      { t: "Synthesized in the anterior pituitary; released directly into the systemic circulation from there", ok: false },
      { t: "Synthesized in the adrenal cortex; released alongside aldosterone during volume depletion", ok: false },
      { t: "Synthesized in the juxtaglomerular cells of the kidney; released with renin", ok: false },
    ],
    rationale: "ADH is a peptide hormone produced by magnocellular neurons located in the supraoptic and paraventricular nuclei of the hypothalamus. It is transported down axons to the posterior pituitary (neurohypophysis), where it is stored in vesicles and released into the bloodstream in response to osmotic and hemodynamic stimuli. The anterior pituitary produces different hormones (GH, ACTH, TSH). Aldosterone comes from the adrenal cortex zona glomerulosa. Renin comes from juxtaglomerular cells.", // source: Ch 29 slide — ADH Synthesis and Release
    scene: "renal",
    sceneCfg: { label: "ADH — HYPOTHALAMUS TO POSTERIOR PITUITARY" },
    metadata: { topic: "ADH Synthesis and Release", priority: "high" },
  },

  {
    id: "patho-n15-009",
    type: "mcq",
    prompt: "The osmoreceptor-ADH feedback mechanism is triggered by a water deficit. Place the steps in correct physiologic order: (1) increased H2O reabsorption, (2) increased extracellular osmolarity, (3) increased ADH secretion from posterior pituitary, (4) increased H2O permeability in distal tubules and collecting ducts.",
    setup: "",
    ans: [
      { t: "Water deficit -> 2 -> 3 -> 4 -> 1 -> decreased H2O excretion", ok: true },
      { t: "Water deficit -> 3 -> 2 -> 1 -> 4 -> decreased H2O excretion", ok: false },
      { t: "Water deficit -> 4 -> 1 -> 2 -> 3 -> decreased H2O excretion", ok: false },
      { t: "Water deficit -> 1 -> 4 -> 3 -> 2 -> decreased H2O excretion", ok: false },
    ],
    rationale: "The correct sequence begins with a water deficit that raises extracellular osmolarity (step 2). Osmoreceptors in the hypothalamus detect this increase and stimulate ADH secretion from the posterior pituitary (step 3). ADH then increases water permeability of the distal tubules and collecting ducts by inserting aquaporin 2 channels (step 4). This increased permeability allows water reabsorption from the tubular lumen (step 1), which ultimately decreases water excretion. The negative feedback loop corrects the original water deficit.", // source: Ch 29 slide — Osmoreceptor-ADH Feedback Mechanism (Figure 29-9)
    scene: "renal",
    sceneCfg: { label: "OSMORECEPTOR-ADH FEEDBACK SEQUENCE" },
    metadata: { topic: "Osmoreceptor-ADH Feedback", priority: "high" },
  },

  {
    id: "patho-n15-010",
    type: "mcq",
    prompt: "Which of the following is the MOST potent physiologic stimulus for ADH release?",
    setup: "",
    ans: [
      { t: "Increased plasma osmolarity, detected by hypothalamic osmoreceptors", ok: true },
      { t: "Increased blood volume, detected by cardiopulmonary baroreceptors", ok: false },
      { t: "Increased blood pressure, detected by arterial baroreceptors", ok: false },
      { t: "Decreased angiotensin II, sensed by the subfornical organ", ok: false },
    ],
    rationale: "Increased plasma osmolarity is the primary and most sensitive stimulus for ADH release. As little as a 1% increase in plasma osmolarity can trigger ADH secretion via hypothalamic osmoreceptors. Decreased (not increased) blood volume and decreased blood pressure also stimulate ADH release as secondary stimuli through cardiopulmonary and arterial baroreceptors respectively, but these require larger changes (5 to 10%) before they significantly alter ADH. Increased (not decreased) angiotensin II stimulates ADH release.", // source: Ch 29 slides — Stimuli for ADH Secretion
    scene: "renal",
    sceneCfg: { label: "PRIMARY ADH STIMULUS — OSMOLARITY" },
    metadata: { topic: "ADH Regulation", priority: "high" },
  },

  {
    id: "patho-n15-011",
    type: "mcq",
    prompt: "Which of the following factors STIMULATES ADH secretion?",
    setup: "",
    ans: [
      { t: "Nausea, which can produce a potent increase in ADH even without osmolarity changes", ok: true },
      { t: "Alcohol consumption, which is a well known ADH stimulant", ok: false },
      { t: "Increased blood volume, which triggers cardiopulmonary reflexes to raise ADH", ok: false },
      { t: "Haloperidol administration, which enhances posterior pituitary ADH release", ok: false },
    ],
    rationale: "Nausea is a potent non-osmotic stimulus for ADH release and can raise ADH levels 100 fold. This explains the water retention and hyponatremia sometimes seen with nausea and vomiting. Alcohol INHIBITS ADH release, which is why it causes diuresis. Increased blood volume SUPPRESSES ADH via cardiopulmonary stretch receptors (decreased volume stimulates ADH). Haloperidol DECREASES ADH secretion. Other ADH stimulants include morphine, nicotine, angiotensin II, and decreased blood pressure.", // source: Ch 29 slides — Stimuli for ADH Secretion; Factors That Decrease ADH
    scene: "renal",
    sceneCfg: { label: "NON-OSMOTIC ADH STIMULANTS" },
    metadata: { topic: "ADH Regulation", priority: "high" },
  },

  {
    id: "patho-n15-012",
    type: "mcq",
    prompt: "Which substance INHIBITS ADH secretion and thereby promotes diuresis?",
    setup: "",
    ans: [
      { t: "Alcohol (ethanol), which suppresses posterior pituitary ADH release", ok: true },
      { t: "Morphine, which enhances ADH release and reduces urine output", ok: false },
      { t: "Angiotensin II, which stimulates both ADH and thirst simultaneously", ok: false },
      { t: "Nicotine, which activates hypothalamic neurons that secrete ADH", ok: false },
    ],
    rationale: "Alcohol inhibits ADH secretion from the posterior pituitary, reducing water reabsorption in the collecting duct and producing dilute, high volume urine. This explains the diuretic effect of alcoholic beverages. Morphine, angiotensin II, and nicotine all STIMULATE ADH release. Other factors that decrease ADH include decreased osmolarity, increased blood volume, increased blood pressure, clonidine, and haloperidol.", // source: Ch 29 slides — Factors That Decrease ADH Secretion
    scene: "renal",
    sceneCfg: { label: "ALCOHOL INHIBITS ADH" },
    metadata: { topic: "ADH Regulation", priority: "high" },
  },

  {
    id: "patho-n15-013",
    type: "mcq",
    prompt: "Clonidine, an antihypertensive drug, affects ADH secretion in which direction?",
    setup: "",
    ans: [
      { t: "Decreases ADH secretion, which can contribute to increased urine output", ok: true },
      { t: "Increases ADH secretion, which helps lower blood pressure by retaining water", ok: false },
      { t: "Has no effect on ADH; its antihypertensive action is purely through alpha 2 agonism", ok: false },
      { t: "Increases ADH secretion only at high doses, producing SIADH like effects", ok: false },
    ],
    rationale: "Clonidine, a central alpha 2 adrenergic agonist used as an antihypertensive, decreases ADH secretion. This contributes to its mild diuretic effect. Other factors that decrease ADH include decreased osmolarity, increased blood volume, increased blood pressure, alcohol, and haloperidol. Clonidine's primary antihypertensive mechanism is through central sympatholytic effects, but its ADH suppression is a recognized ancillary action.", // source: Ch 29 slide — Factors That Decrease ADH Secretion
    scene: "renal",
    sceneCfg: { label: "CLONIDINE DECREASES ADH" },
    metadata: { topic: "ADH Regulation", priority: "medium" },
  },

  {
    id: "patho-n15-014",
    type: "mcq",
    prompt: "Thirst is stimulated by all of the following EXCEPT:",
    setup: "",
    ans: [
      { t: "Gastric distention, which actually suppresses the thirst drive", ok: true },
      { t: "Increased plasma osmolarity, the strongest physiologic thirst stimulus", ok: false },
      { t: "Decreased blood volume, sensed by cardiopulmonary baroreceptors", ok: false },
      { t: "Increased angiotensin II, which acts on circumventricular organs", ok: false },
    ],
    rationale: "Gastric distention is a factor that DECREASES thirst, not stimulates it. This is why drinking water reduces thirst before the absorbed water has actually corrected plasma osmolarity. Stimuli that increase thirst include increased osmolarity (the most potent), decreased blood volume via cardiopulmonary reflexes, decreased blood pressure via arterial baroreceptors, increased angiotensin II, and dry mouth. Decreased angiotensin II decreases thirst.", // source: Ch 29 slides — Stimuli for Thirst; Factors That Decrease Thirst
    scene: "renal",
    sceneCfg: { label: "THIRST REGULATION" },
    metadata: { topic: "Thirst Regulation", priority: "high" },
  },

  {
    id: "patho-n15-015",
    type: "mcq",
    prompt: "A patient cannot produce ADH due to posterior pituitary damage. Which type of diabetes insipidus does this represent?",
    setup: "",
    ans: [
      { t: "Central diabetes insipidus, caused by failure to produce or secrete ADH", ok: true },
      { t: "Nephrogenic diabetes insipidus, caused by renal tubule unresponsiveness to ADH", ok: false },
      { t: "Gestational diabetes insipidus, caused by placental vasopressinase degradation of ADH", ok: false },
      { t: "Dipsogenic diabetes insipidus, caused by excessive water intake suppressing ADH", ok: false },
    ],
    rationale: "Central diabetes insipidus results from failure to produce or release ADH, typically due to damage to the hypothalamus or posterior pituitary from trauma, surgery, tumors, or autoimmune destruction. These patients produce large volumes of dilute urine and respond to exogenous desmopressin (DDAVP). Nephrogenic diabetes insipidus involves normal ADH production but the collecting duct cells fail to respond, often due to lithium therapy or genetic mutations in V2 receptors or aquaporin 2.", // source: Ch 29 slide — Disorders of Urine Concentrating Ability
    scene: "renal",
    sceneCfg: { label: "CENTRAL DIABETES INSIPIDUS" },
    metadata: { topic: "Diabetes Insipidus", priority: "high" },
  },

  {
    id: "patho-n15-016",
    type: "mcq",
    prompt: "A patient on chronic lithium therapy presents with polyuria and polydipsia. Serum ADH levels are elevated. What is the most likely diagnosis?",
    setup: "",
    ans: [
      { t: "Nephrogenic diabetes insipidus, because lithium impairs the collecting duct response to ADH", ok: true },
      { t: "Central diabetes insipidus, because lithium damages the posterior pituitary", ok: false },
      { t: "SIADH, because lithium stimulates inappropriate ADH release", ok: false },
      { t: "Primary polydipsia, because lithium stimulates the thirst center", ok: false },
    ],
    rationale: "Lithium is the most common drug cause of nephrogenic diabetes insipidus. It interferes with ADH signaling in the collecting duct by impairing aquaporin 2 channel expression. The kidneys cannot respond to ADH despite its presence (hence elevated serum ADH). Central DI would show LOW ADH levels. SIADH would produce concentrated urine and hyponatremia, not polyuria. The key distinguishing feature is elevated ADH with dilute urine output.", // source: Ch 29 slide — Disorders of Urine Concentrating Ability
    scene: "renal",
    sceneCfg: { label: "NEPHROGENIC DI — LITHIUM" },
    metadata: { topic: "Diabetes Insipidus", priority: "high" },
  },

  {
    id: "patho-n15-017",
    type: "mcq",
    prompt: "The vasa recta serve as countercurrent EXCHANGERS in the renal medulla. They preserve the medullary osmotic gradient by doing what?",
    setup: "",
    ans: [
      { t: "Equilibrating slowly with the interstitium as blood descends and ascends, so that net solute removal is minimized", ok: true },
      { t: "Actively pumping NaCl into the medullary interstitium like the thick ascending limb does", ok: false },
      { t: "Blocking all water movement across their walls to prevent gradient washout", ok: false },
      { t: "Carrying only 50% of total renal blood flow, which limits medullary perfusion", ok: false },
    ],
    rationale: "The vasa recta are U shaped capillary loops that run parallel to the loops of Henle. As blood descends, it loses water and gains solute, equilibrating with the hypertonic medulla. As it ascends, the reverse occurs. This countercurrent exchange means solute picked up during descent is returned during ascent, so the net removal of medullary solute is minimized. The vasa recta carry only 1 to 2% (not 50%) of renal blood flow. They are passive exchangers, not active transporters.", // source: Ch 29 PDF — vasa recta countercurrent exchangers
    scene: "renal",
    sceneCfg: { label: "VASA RECTA — COUNTERCURRENT EXCHANGE" },
    metadata: { topic: "Countercurrent Multiplier", priority: "high" },
  },

  {
    id: "patho-n15-018",
    type: "mcq",
    prompt: "If a patient excretes 600 mOsm of solute per day and can only concentrate urine to 300 mOsm/L due to kidney disease, what is the obligatory urine volume?",
    setup: "",
    ans: [
      { t: "2 liters per day, calculated as 600 mOsm divided by 300 mOsm/L", ok: true },
      { t: "0.5 liters per day, calculated as 600 mOsm divided by 1200 mOsm/L", ok: false },
      { t: "1 liter per day, which is the standard daily urine output regardless of concentration", ok: false },
      { t: "4 liters per day, because kidney disease doubles the excretory requirement", ok: false },
    ],
    rationale: "Obligatory urine volume equals daily solute load divided by maximal urine concentration: 600 mOsm / 300 mOsm/L = 2.0 L/day. In a healthy person who can concentrate to 1200 mOsm/L, the obligatory volume would be only 0.5 L/day (600/1200). Kidney disease reduces maximal concentrating ability, which increases obligatory urine volume and makes the patient susceptible to dehydration if water intake is insufficient.", // source: Ch 29 PDF — obligatory urine volume concept
    scene: "renal",
    sceneCfg: { label: "OBLIGATORY URINE VOLUME" },
    metadata: { topic: "Obligatory Urine Volume", priority: "high" },
  },

  {
    id: "patho-n15-019",
    type: "mcq",
    prompt: "The descending loop of Henle reabsorbs approximately what percentage of filtered water?",
    setup: "",
    ans: [
      { t: "15%, as water exits osmotically into the hypertonic medullary interstitium", ok: true },
      { t: "65%, representing the majority of filtered water reabsorption", ok: false },
      { t: "0%, because the descending limb is impermeable to water", ok: false },
      { t: "8%, similar to the collecting tubule in the absence of ADH", ok: false },
    ],
    rationale: "The descending thin limb reabsorbs approximately 15% of filtered water. Water leaves by osmosis as the tubular fluid travels through the progressively hypertonic medullary interstitium. The 65% figure applies to the proximal tubule. The ascending limb reabsorbs 0% water (it is water impermeable). The 8 mL figure from the slides refers to the volume reaching the collecting tubule from a starting 125 mL GFR.", // source: Ch 29 slide — Summary of Water Reabsorption; Changes in Osmolarity figure
    scene: "renal",
    sceneCfg: { label: "DESCENDING LOOP — 15% WATER" },
    metadata: { topic: "Segmental Water Reabsorption", priority: "medium" },
  },

  {
    id: "patho-n15-020",
    type: "mcq",
    prompt: "According to the ADH-thirst osmoreceptor system, what is the dominant controller of extracellular osmolarity and sodium concentration?",
    setup: "",
    ans: [
      { t: "The ADH-thirst feedback mechanism, which adjusts water balance to regulate osmolarity", ok: true },
      { t: "The aldosterone system, which primarily adjusts sodium excretion to regulate osmolarity", ok: false },
      { t: "The atrial natriuretic peptide system, which controls sodium excretion directly", ok: false },
      { t: "The sympathetic nervous system, which adjusts renal blood flow to control osmolarity", ok: false },
    ],
    rationale: "The ADH-thirst osmoreceptor system is the dominant regulator of extracellular osmolarity and sodium concentration. When osmolarity rises, ADH increases water reabsorption and thirst drives water intake, both of which dilute the ECF back toward normal. The aldosterone system primarily regulates sodium balance and ECF volume but has relatively little effect on sodium concentration because it adjusts both sodium and water together. Blocking the ADH-thirst system causes large swings in plasma sodium with changes in sodium intake, whereas blocking aldosterone has minimal effect.", // source: Ch 29 slides — Control of ECF Osmolarity; Effect of Sodium Intake figures
    scene: "renal",
    sceneCfg: { label: "ADH-THIRST DOMINATES OSMOLARITY" },
    metadata: { topic: "ADH-Thirst Osmoreceptor System", priority: "high" },
  },

  {
    id: "patho-n15-021",
    type: "mcq",
    prompt: "When the ADH-thirst system is experimentally blocked, what happens to plasma sodium concentration as dietary sodium intake increases?",
    setup: "",
    ans: [
      { t: "Plasma sodium rises steeply, because the body cannot increase water retention or intake to compensate", ok: true },
      { t: "Plasma sodium remains stable, because aldosterone fully compensates for the missing ADH response", ok: false },
      { t: "Plasma sodium falls, because sodium is excreted more rapidly without ADH water retention", ok: false },
      { t: "Plasma sodium oscillates unpredictably, because multiple systems compete for control", ok: false },
    ],
    rationale: "Experimental blockade of the ADH-thirst system reveals that plasma sodium concentration becomes highly sensitive to sodium intake. Without ADH to increase water reabsorption and without thirst to drive water intake, the body cannot dilute the added sodium. Plasma sodium rises steeply with increasing sodium intake. In contrast, with an intact ADH-thirst system, plasma sodium remains remarkably stable (approximately 142 mEq/L) across a wide range of sodium intakes because water balance adjusts to maintain concentration.", // source: Ch 29 slide — Effect of Sodium Intake on Plasma Sodium After Blocking ADH-Thirst System
    scene: "renal",
    sceneCfg: { label: "ADH-THIRST BLOCK — Na+ SENSITIVITY" },
    metadata: { topic: "ADH-Thirst Osmoreceptor System", priority: "high" },
  },

  {
    id: "patho-n15-022",
    type: "mcq",
    prompt: "When the aldosterone system alone is blocked, what effect does varying sodium intake have on plasma sodium concentration?",
    setup: "",
    ans: [
      { t: "Plasma sodium changes very little, because the ADH-thirst system maintains osmolarity independently of aldosterone", ok: true },
      { t: "Plasma sodium rises dramatically, because aldosterone is the primary defense against hypernatremia", ok: false },
      { t: "Plasma sodium falls to dangerously low levels, because aldosterone is required for sodium retention", ok: false },
      { t: "Plasma sodium becomes completely unregulated, oscillating between 120 and 160 mEq/L", ok: false },
    ],
    rationale: "Blocking the aldosterone system has minimal impact on plasma sodium concentration because the ADH-thirst osmoreceptor system is the dominant controller of osmolarity. Aldosterone primarily regulates ECF volume and potassium balance rather than sodium concentration. The experimental comparison shows that blocking ADH-thirst causes large plasma sodium swings, whereas blocking aldosterone causes negligible changes. This demonstrates that water balance (ADH-thirst), not sodium balance (aldosterone), controls plasma sodium concentration.", // source: Ch 29 slide — Effect of Sodium Intake After Blocking Aldosterone System
    scene: "renal",
    sceneCfg: { label: "ALDOSTERONE BLOCK — MINIMAL Na+ CHANGE" },
    metadata: { topic: "ADH-Thirst Osmoreceptor System", priority: "high" },
  },

  {
    id: "patho-n15-023",
    type: "mcq",
    prompt: "In the countercurrent multiplier, which transporter in the thick ascending limb is responsible for the 'single effect' that creates the osmotic gradient?",
    setup: "",
    ans: [
      { t: "The Na/K/2Cl cotransporter (NKCC2), which actively pumps NaCl out of the tubular lumen", ok: true },
      { t: "The epithelial sodium channel (ENaC), which passively absorbs sodium in the collecting duct", ok: false },
      { t: "Aquaporin 2, which inserts into the luminal membrane under ADH stimulation", ok: false },
      { t: "The Na/H exchanger (NHE3), which drives proximal tubule sodium reabsorption", ok: false },
    ],
    rationale: "The Na/K/2Cl cotransporter (NKCC2) on the luminal membrane of the thick ascending limb is the key transporter that creates the 'single effect' of the countercurrent multiplier. By actively transporting NaCl out of the water impermeable ascending limb, it creates a concentration difference (about 200 mOsm/L) between the tubular fluid and the interstitium at each horizontal level. This single effect is multiplied along the length of the loop to build the 300 to 1200 mOsm/L corticomedullary gradient. NKCC2 is also the target of loop diuretics (furosemide).", // source: Ch 29 slide — Countercurrent Flow; ascending limb NaCl reabsorption
    scene: "renal",
    sceneCfg: { label: "NKCC2 — SINGLE EFFECT" },
    metadata: { topic: "Countercurrent Multiplier", priority: "high" },
  },

  {
    id: "patho-n15-024",
    type: "mcq",
    prompt: "Morphine administration in the perioperative setting can affect ADH levels in which direction?",
    setup: "",
    ans: [
      { t: "Increases ADH secretion, which may contribute to postoperative oliguria and water retention", ok: true },
      { t: "Decreases ADH secretion, which explains the diuresis commonly seen with opioid use", ok: false },
      { t: "Has no effect on ADH; morphine's renal effects are entirely through hemodynamic changes", ok: false },
      { t: "Decreases ADH at low doses but increases it at high doses in a biphasic pattern", ok: false },
    ],
    rationale: "Morphine is listed among the stimuli for ADH secretion. It stimulates ADH release from the posterior pituitary, contributing to water retention and potentially oliguria in the postoperative period. This is clinically relevant for CRNA practice because patients receiving opioids may have reduced urine output partially due to ADH stimulation rather than solely from hemodynamic factors. Other drugs that stimulate ADH include nicotine. Alcohol and clonidine decrease ADH.", // source: Ch 29 slide — Stimuli for ADH Secretion
    scene: "renal",
    sceneCfg: { label: "MORPHINE STIMULATES ADH" },
    metadata: { topic: "ADH Regulation", priority: "high" },
  },

  {
    id: "patho-n15-025",
    type: "mcq",
    prompt: "Decreased blood volume stimulates ADH secretion through which receptor pathway?",
    setup: "",
    ans: [
      { t: "Cardiopulmonary (low pressure) baroreceptors in the atria and pulmonary vessels", ok: true },
      { t: "Hypothalamic osmoreceptors that detect the associated hemoconcentration", ok: false },
      { t: "Carotid body chemoreceptors that sense decreased oxygen delivery", ok: false },
      { t: "Renal juxtaglomerular cells that release renin directly to the posterior pituitary", ok: false },
    ],
    rationale: "Decreased blood volume is detected by cardiopulmonary (low pressure) baroreceptors located in the cardiac atria and great veins. These volume receptors send signals via vagal afferents to the hypothalamus, stimulating ADH release. Decreased blood pressure (as opposed to volume) is detected by arterial baroreceptors. Although hemoconcentration may raise osmolarity slightly, the primary volume sensing pathway is through the low pressure baroreceptors, not osmoreceptors. This hemodynamic regulation of ADH requires larger changes (5 to 10%) than the osmotic pathway (1 to 2%).", // source: Ch 29 slides — Stimuli for ADH Secretion
    scene: "renal",
    sceneCfg: { label: "VOLUME — CARDIOPULMONARY BARORECEPTORS" },
    metadata: { topic: "ADH Regulation", priority: "medium" },
  },

  {
    id: "patho-n15-026",
    type: "mcq",
    prompt: "A patient presents with concentrated urine, hyponatremia, and euvolemia. Serum ADH is inappropriately elevated despite low plasma osmolarity. What is the most likely diagnosis?",
    setup: "",
    ans: [
      { t: "Syndrome of inappropriate ADH secretion (SIADH)", ok: true },
      { t: "Central diabetes insipidus with dehydration", ok: false },
      { t: "Primary aldosteronism causing sodium retention", ok: false },
      { t: "Nephrogenic diabetes insipidus with compensatory polydipsia", ok: false },
    ],
    rationale: "SIADH is characterized by continued ADH secretion despite low plasma osmolarity. The persistent ADH causes excessive water reabsorption, diluting plasma sodium (hyponatremia) while producing inappropriately concentrated urine. Patients are typically euvolemic because excess water distributes across body compartments. Central DI would produce dilute urine with hypernatremia. Primary aldosteronism causes hypertension and hypokalemia, not hyponatremia. Nephrogenic DI produces dilute urine despite elevated ADH.", // source: Ch 29 PDF — SIADH discussion
    scene: "renal",
    sceneCfg: { label: "SIADH" },
    metadata: { topic: "ADH Disorders", priority: "high" },
  },

  {
    id: "patho-n15-027",
    type: "mcq",
    prompt: "Urea recycling contributes to the medullary osmotic gradient. Through which specialized transporters does urea enter the inner medullary interstitium from the collecting duct?",
    setup: "",
    ans: [
      { t: "UT-A1 and UT-A3 urea transporters, which are stimulated by ADH", ok: true },
      { t: "Aquaporin 1 channels, which transport both water and urea in the proximal tubule", ok: false },
      { t: "NKCC2 cotransporters, which handle urea along with sodium and chloride", ok: false },
      { t: "ENaC channels in principal cells, which have a secondary urea conductance", ok: false },
    ],
    rationale: "Urea recycling is critical for building the inner medullary osmotic gradient. ADH stimulates UT-A1 urea transporters in the inner medullary collecting duct, allowing urea to move from the concentrated tubular fluid into the medullary interstitium. UT-A3 transporters on the basolateral side facilitate this transfer. Urea accounts for approximately half of the medullary interstitial osmolarity at the papillary tip. Aquaporin 1 transports water, not urea. NKCC2 and ENaC do not transport urea.", // source: Ch 29 PDF — urea recirculation, UT-A1/A2/A3 transporters
    scene: "renal",
    sceneCfg: { label: "UREA TRANSPORTERS — UT-A1/A3" },
    metadata: { topic: "Countercurrent Multiplier", priority: "medium" },
  },

  {
    id: "patho-n15-028",
    type: "mcq",
    prompt: "Plasma osmolarity can be estimated using which formula?",
    setup: "",
    ans: [
      { t: "Approximately 2 times the plasma sodium concentration (in mEq/L)", ok: true },
      { t: "Plasma sodium plus plasma potassium divided by 2", ok: false },
      { t: "Plasma sodium times plasma chloride divided by 100", ok: false },
      { t: "Plasma albumin times 10 plus plasma glucose in mg/dL", ok: false },
    ],
    rationale: "Because sodium and its accompanying anions (primarily chloride and bicarbonate) account for approximately 94% of extracellular osmolarity, plasma osmolarity can be estimated as 2.1 times the plasma sodium concentration. The full formula is 2 x [Na+] + [glucose]/18 + [BUN]/2.8, but sodium is by far the dominant contributor. For a normal Na+ of 142 mEq/L, estimated osmolarity is approximately 284 to 298 mOsm/L (normal range 280 to 295 mOsm/L). The other formulas are not physiologically valid estimations.", // source: Ch 29 PDF — Posm = 2.1 × plasma [Na]
    scene: "renal",
    sceneCfg: { label: "PLASMA OSMOLARITY ESTIMATION" },
    metadata: { topic: "Plasma Osmolarity", priority: "high" },
  },

  {
    id: "patho-n15-029",
    type: "mcq",
    prompt: "Fear (cerebral cortex input) acts on ADH secretion in which direction?",
    setup: "",
    ans: [
      { t: "Stimulates ADH release, contributing to perioperative water retention during stress", ok: true },
      { t: "Inhibits ADH release, which explains stress related diuresis before surgery", ok: false },
      { t: "Has no effect on ADH; emotional states only affect cortisol and catecholamines", ok: false },
      { t: "Stimulates ADH at rest but inhibits it during the fight or flight response", ok: false },
    ],
    rationale: "Input from the cerebral cortex, including fear and pain, stimulates ADH secretion. This is clinically relevant because perioperative stress and anxiety can contribute to water retention through ADH stimulation, independent of volume status changes. This is listed alongside other non-osmotic stimuli including nausea, morphine, and nicotine. Cortisol and catecholamines are also released during stress but through separate hypothalamic-pituitary-adrenal and sympathetic pathways.", // source: Ch 29 slide — Stimuli for ADH Secretion (cerebral cortex input listed)
    scene: "renal",
    sceneCfg: { label: "FEAR/STRESS STIMULATES ADH" },
    metadata: { topic: "ADH Regulation", priority: "medium" },
  },

  {
    id: "patho-n15-030",
    type: "mcq",
    prompt: "Compared to the osmotic stimulus for ADH release, the hemodynamic (volume/pressure) stimulus requires what magnitude of change to significantly alter ADH levels?",
    setup: "",
    ans: [
      { t: "A larger change (5 to 10% decrease in volume or pressure) compared to only 1 to 2% change in osmolarity", ok: true },
      { t: "A smaller change (0.5% decrease in volume) because hemodynamic reflexes are more sensitive", ok: false },
      { t: "An identical magnitude of change, because both pathways converge on the same hypothalamic neurons", ok: false },
      { t: "No threshold; any decrease in blood pressure immediately maximizes ADH release", ok: false },
    ],
    rationale: "The osmotic pathway for ADH regulation is exquisitely sensitive; a 1 to 2% increase in plasma osmolarity significantly increases ADH secretion. In contrast, hemodynamic stimuli (decreased blood volume via cardiopulmonary baroreceptors and decreased blood pressure via arterial baroreceptors) require 5 to 10% changes before they significantly affect ADH levels. However, when large hemodynamic changes occur (such as hemorrhagic shock), the volume/pressure stimulus can produce very high ADH levels, overriding the osmotic set point.", // source: Ch 29 slide — Stimuli for ADH graph showing isovolemic osmotic vs isotonic volume depletion
    scene: "renal",
    sceneCfg: { label: "OSMOTIC vs HEMODYNAMIC ADH SENSITIVITY" },
    metadata: { topic: "ADH Regulation", priority: "high" },
  },

  // ── Ch. 30 — Potassium, Calcium, Body Fluid Regulation, Pressure Natriuresis ──

  {
    id: "patho-n15-031",
    type: "mcq",
    prompt: "Normal plasma potassium concentration is maintained within what range?",
    setup: "",
    ans: [
      { t: "3.5 to 5.0 mEq/L", ok: true },
      { t: "1.5 to 2.5 mEq/L", ok: false },
      { t: "6.0 to 8.0 mEq/L", ok: false },
      { t: "135 to 145 mEq/L", ok: false },
    ],
    rationale: "Normal plasma (extracellular) potassium concentration is tightly regulated between 3.5 and 5.0 mEq/L. This narrow range is critical for maintaining normal cardiac rhythm and neuromuscular function. The 135 to 145 mEq/L range describes plasma sodium, not potassium. Intracellular potassium concentration is much higher at approximately 140 mEq/L. Even small deviations from the normal extracellular range can have significant cardiac and neuromuscular consequences.", // source: Ch 30 slide — Normal Plasma [K+] = 3.5-5.0 mEq/L
    scene: "renal",
    sceneCfg: { label: "NORMAL PLASMA K+ RANGE" },
    metadata: { topic: "Potassium Homeostasis", priority: "high" },
  },

  {
    id: "patho-n15-032",
    type: "mcq",
    prompt: "Approximately what percentage of total body potassium resides in the intracellular fluid compartment?",
    setup: "",
    ans: [
      { t: "98%, with only about 2% in the extracellular fluid", ok: true },
      { t: "50%, evenly distributed between intracellular and extracellular compartments", ok: false },
      { t: "70%, with 30% in the extracellular fluid for rapid exchange", ok: false },
      { t: "85%, with the remaining 15% bound to plasma proteins", ok: false },
    ],
    rationale: "Approximately 98% of total body potassium (about 3920 mEq out of approximately 3979 mEq total) resides in the intracellular compartment at a concentration of 140 mEq/L across 28 liters of ICF. Only about 2% (approximately 59 mEq) is in the extracellular fluid at 4.2 mEq/L across 14 liters. This massive ICF reservoir means that even small shifts of K+ between compartments can dramatically change plasma K+ concentration.", // source: Ch 30 PDF — K+ distribution: ECF 4.2 mEq/L × 14L = 59 mEq; ICF 140 mEq/L × 28L = 3920 mEq
    scene: "renal",
    sceneCfg: { label: "K+ DISTRIBUTION — 98% INTRACELLULAR" },
    metadata: { topic: "Potassium Homeostasis", priority: "high" },
  },

  {
    id: "patho-n15-033",
    type: "mcq",
    prompt: "Which of the following factors drives potassium INTO cells (promotes hypokalemia if excessive)?",
    setup: "",
    ans: [
      { t: "Insulin, which stimulates Na/K ATPase activity and K+ uptake into cells", ok: true },
      { t: "Metabolic acidosis, which causes H+ to enter cells and K+ to exit", ok: false },
      { t: "Cell lysis, which releases intracellular K+ stores into the plasma", ok: false },
      { t: "Beta adrenergic blockade, which inhibits cellular K+ uptake", ok: false },
    ],
    rationale: "Insulin stimulates Na/K ATPase activity, driving K+ into cells and lowering plasma K+. This is why insulin (with glucose) is used therapeutically to treat hyperkalemia. Other factors that promote intracellular K+ shift include aldosterone, beta adrenergic stimulation, and alkalosis. Metabolic acidosis shifts K+ OUT of cells (H+ enters cells, K+ exits to maintain electroneutrality). Cell lysis releases K+ from cells. Beta blockade impairs cellular K+ uptake.", // source: Ch 30 PDF — factors driving K+ intracellular
    scene: "renal",
    sceneCfg: { label: "INSULIN DRIVES K+ INTO CELLS" },
    metadata: { topic: "Potassium Homeostasis", priority: "high" },
  },

  {
    id: "patho-n15-034",
    type: "mcq",
    prompt: "A patient with severe metabolic acidosis (pH 7.15) has a plasma K+ of 6.2 mEq/L. What mechanism explains this hyperkalemia?",
    setup: "",
    ans: [
      { t: "H+ ions enter cells to be buffered, displacing K+ ions into the extracellular fluid to maintain electroneutrality", ok: true },
      { t: "Acidosis directly stimulates aldosterone release, which paradoxically increases K+ secretion", ok: false },
      { t: "Low pH inhibits renal Na/K/2Cl cotransporter, blocking all K+ reabsorption in the loop", ok: false },
      { t: "Acidosis causes massive cell lysis, releasing intracellular K+ stores", ok: false },
    ],
    rationale: "In metabolic acidosis, excess H+ ions move into cells where intracellular proteins buffer them. To maintain electrical neutrality, K+ ions move out of cells into the extracellular fluid. This transcellular shift can raise plasma K+ by approximately 0.6 mEq/L for each 0.1 unit decrease in pH. This is a shift phenomenon, not a change in total body K+. The reverse occurs in alkalosis: K+ moves into cells as H+ exits, causing hypokalemia. Acidosis actually decreases (not increases) aldosterone's effectiveness.", // source: Ch 30 PDF — acidosis shifts K+ extracellularly
    scene: "renal",
    sceneCfg: { label: "ACIDOSIS SHIFTS K+ OUT OF CELLS" },
    metadata: { topic: "Potassium Homeostasis", priority: "high" },
  },

  {
    id: "patho-n15-035",
    type: "mcq",
    prompt: "In the collecting duct, which cell type is primarily responsible for potassium SECRETION into the tubular lumen?",
    setup: "",
    ans: [
      { t: "Principal cells, which secrete K+ through ROMK and BK channels after Na+ entry via ENaC", ok: true },
      { t: "Type A intercalated cells, which secrete K+ through H/K ATPase pumps", ok: false },
      { t: "Type B intercalated cells, which secrete both K+ and HCO3 into the lumen", ok: false },
      { t: "Macula densa cells, which regulate K+ secretion through tubuloglomerular feedback", ok: false },
    ],
    rationale: "Principal cells in the cortical collecting duct are responsible for K+ secretion. Na+ enters the cell from the lumen through ENaC (epithelial sodium channel), which is driven by the basolateral Na/K ATPase. This creates a favorable electrochemical gradient for K+ to exit into the lumen through ROMK (renal outer medullary K+) channels and BK (big conductance K+) channels. Aldosterone enhances this process by upregulating both ENaC and Na/K ATPase. Type A intercalated cells REABSORB K+ via H/K ATPase. Macula densa cells sense NaCl delivery for TGF.", // source: Ch 30 PDF — principal cell K+ secretion
    scene: "renal",
    sceneCfg: { label: "PRINCIPAL CELLS — K+ SECRETION" },
    metadata: { topic: "Renal Potassium Handling", priority: "high" },
  },

  {
    id: "patho-n15-036",
    type: "mcq",
    prompt: "Aldosterone regulates potassium balance through a feedback loop. When plasma K+ rises, what sequence of events occurs?",
    setup: "",
    ans: [
      { t: "Increased K+ stimulates adrenal cortex aldosterone release, which increases renal K+ secretion, restoring K+ to normal", ok: true },
      { t: "Increased K+ inhibits aldosterone, causing sodium retention that dilutes plasma K+", ok: false },
      { t: "Increased K+ stimulates ADH release, which increases water reabsorption and dilutes K+", ok: false },
      { t: "Increased K+ stimulates renin release from juxtaglomerular cells, triggering the full RAAS cascade", ok: false },
    ],
    rationale: "Elevated plasma K+ directly stimulates the adrenal cortex zona glomerulosa to release aldosterone. Aldosterone then acts on principal cells of the collecting duct to increase ENaC expression (enhancing Na+ reabsorption) and Na/K ATPase activity, both of which promote K+ secretion into the tubular lumen. This negative feedback loop returns plasma K+ toward normal. This is an independent aldosterone stimulus separate from angiotensin II. K+ does not directly stimulate renin release; renin release is driven by decreased renal perfusion, decreased NaCl delivery to macula densa, or sympathetic stimulation.", // source: Ch 30 PDF — aldosterone-K+ feedback
    scene: "renal",
    sceneCfg: { label: "ALDOSTERONE-K+ FEEDBACK LOOP" },
    metadata: { topic: "Renal Potassium Handling", priority: "high" },
  },

  {
    id: "patho-n15-037",
    type: "mcq",
    prompt: "All of the following are recognized causes of hyperkalemia EXCEPT:",
    setup: "",
    ans: [
      { t: "Metabolic alkalosis, which shifts K+ INTO cells and tends to lower plasma K+", ok: true },
      { t: "Renal failure, which decreases the kidney's ability to excrete K+", ok: false },
      { t: "Potassium sparing diuretics (e.g., spironolactone), which block K+ secretion in the collecting duct", ok: false },
      { t: "Addison disease (adrenal insufficiency), which reduces aldosterone mediated K+ secretion", ok: false },
    ],
    rationale: "Metabolic alkalosis shifts K+ INTO cells (as H+ exits cells, K+ enters to maintain electroneutrality), which tends to LOWER plasma K+ (hypokalemia, not hyperkalemia). All other options are established causes of hyperkalemia. Renal failure reduces K+ excretion. K+ sparing diuretics (spironolactone blocks aldosterone receptors; amiloride blocks ENaC) impair collecting duct K+ secretion. Addison disease causes aldosterone deficiency, reducing K+ secretion. Metabolic acidosis (not alkalosis) causes hyperkalemia.", // source: Ch 30 PDF — causes of hyperkalemia; Ch 30 slide — effects of acid-base on K+
    scene: "renal",
    sceneCfg: { label: "CAUSES OF HYPERKALEMIA" },
    metadata: { topic: "Potassium Disorders", priority: "high" },
  },

  {
    id: "patho-n15-038",
    type: "mcq",
    prompt: "Which of the following is a cause of hypokalemia?",
    setup: "",
    ans: [
      { t: "Loop diuretics, which increase distal tubular flow rate and K+ secretion", ok: true },
      { t: "Renal failure, which impairs all tubular secretory mechanisms", ok: false },
      { t: "Beta adrenergic blockade, which prevents cellular K+ uptake", ok: false },
      { t: "Metabolic acidosis, which shifts K+ out of cells into plasma", ok: false },
    ],
    rationale: "Loop diuretics (furosemide, bumetanide) cause hypokalemia through two mechanisms: they increase distal tubular flow rate (which enhances K+ secretion by washing away luminal K+) and they cause volume depletion that activates aldosterone (which further promotes K+ secretion). Other causes of hypokalemia include low K+ intake, GI losses (diarrhea), metabolic alkalosis, excess insulin, osmotic diuretics, excess aldosterone or mineralocorticoids, and salt wasting nephropathies. Renal failure and beta blockade cause hyperkalemia. Acidosis shifts K+ out of cells, raising plasma K+.", // source: Ch 30 slide — Causes of Hypokalemia
    scene: "renal",
    sceneCfg: { label: "LOOP DIURETICS CAUSE HYPOKALEMIA" },
    metadata: { topic: "Potassium Disorders", priority: "high" },
  },

  {
    id: "patho-n15-039",
    type: "mcq",
    prompt: "Severe hyperkalemia (greater than 7.0 mEq/L) produces which dangerous cardiac effect?",
    setup: "",
    ans: [
      { t: "Partial depolarization of cell membranes leading to cardiac toxicity, including ventricular fibrillation or asystole", ok: true },
      { t: "Hyperpolarization of cardiac cells leading to bradycardia and increased automaticity", ok: false },
      { t: "Accelerated conduction velocity through the AV node causing supraventricular tachycardia", ok: false },
      { t: "Prolonged action potential plateau phase causing torsades de pointes", ok: false },
    ],
    rationale: "Severe hyperkalemia (greater than 7.0 mEq/L) reduces the resting membrane potential (partial depolarization) by decreasing the K+ concentration gradient across cell membranes. This inactivates sodium channels, slows conduction, and can produce widened QRS complexes, peaked T waves, loss of P waves, sine wave pattern, and ultimately ventricular fibrillation or asystole. Hyperpolarization occurs with hypokalemia, not hyperkalemia. Hyperkalemia slows conduction rather than accelerating it. Torsades de pointes is associated with QT prolongation from hypokalemia or drug effects.", // source: Ch 30 slide — Effects of severe hyperkalemia (>7.0 mEq/L)
    scene: "renal",
    sceneCfg: { label: "HYPERKALEMIA — CARDIAC TOXICITY" },
    metadata: { topic: "Potassium Disorders", priority: "high" },
  },

  {
    id: "patho-n15-040",
    type: "mcq",
    prompt: "Severe hypokalemia (less than 3.0 mEq/L) can produce which neuromuscular effect?",
    setup: "",
    ans: [
      { t: "Hyperpolarization of cell membranes causing muscle weakness, fatigue, and hypoventilation", ok: true },
      { t: "Depolarization of cell membranes causing tetany and muscle spasms", ok: false },
      { t: "Direct skeletal muscle fiber necrosis (rhabdomyolysis) as the primary presentation", ok: false },
      { t: "Peripheral nerve demyelination causing progressive sensory loss", ok: false },
    ],
    rationale: "Severe hypokalemia increases the K+ concentration gradient across cell membranes, hyperpolarizing them. Hyperpolarized cells require a larger stimulus to reach threshold, leading to muscle weakness, fatigue, and in severe cases, respiratory muscle weakness causing hypoventilation. Cardiac effects include delayed ventricular repolarization (prolonged QT interval, U waves) and increased risk of arrhythmias. Tetany is associated with hypocalcemia, not hypokalemia. While rhabdomyolysis can occur with extreme hypokalemia, it is not the primary or earliest manifestation.", // source: Ch 30 slide — Effects of severe hypokalemia (<3.0 mEq/L)
    scene: "renal",
    sceneCfg: { label: "HYPOKALEMIA — MUSCLE WEAKNESS" },
    metadata: { topic: "Potassium Disorders", priority: "high" },
  },

  {
    id: "patho-n15-041",
    type: "mcq",
    prompt: "When plasma ionized calcium decreases, parathyroid hormone (PTH) is released. PTH restores calcium through which THREE simultaneous actions?",
    setup: "",
    ans: [
      { t: "Increases renal Ca2+ reabsorption, increases bone Ca2+ release, and activates vitamin D3 which increases intestinal Ca2+ absorption", ok: true },
      { t: "Increases renal Ca2+ excretion, decreases bone Ca2+ release, and inhibits vitamin D3 activation", ok: false },
      { t: "Increases renal Ca2+ reabsorption, increases bone Ca2+ storage, and activates calcitonin release", ok: false },
      { t: "Decreases renal phosphate reabsorption only; bone and intestinal effects are mediated by calcitonin", ok: false },
    ],
    rationale: "PTH has three coordinated actions to raise plasma calcium: (1) it increases Ca2+ reabsorption in the distal tubule of the kidney, (2) it stimulates osteoclast activity to release Ca2+ from bone, and (3) it activates 1 alpha hydroxylase in the kidney to convert 25 hydroxyvitamin D to active 1,25 dihydroxyvitamin D3 (calcitriol), which increases intestinal Ca2+ absorption. PTH also decreases renal phosphate reabsorption (phosphaturic effect), which prevents Ca2+ x PO4 product from rising. Calcitonin has the opposite effect (lowers calcium) but is physiologically less important.", // source: Ch 30 slide — Compensatory Responses to Decreased Plasma Ionized Calcium (Figure 30-11)
    scene: "renal",
    sceneCfg: { label: "PTH — THREE ACTIONS TO RAISE Ca2+" },
    metadata: { topic: "Calcium Regulation", priority: "high" },
  },

  {
    id: "patho-n15-042",
    type: "mcq",
    prompt: "In chronic kidney disease, nephron loss leads to phosphate retention. What cascade does this trigger regarding calcium and bone?",
    setup: "",
    ans: [
      { t: "Phosphate retention decreases plasma Ca2+, which increases PTH, which increases bone Ca2+ release, leading to osteoporosis", ok: true },
      { t: "Phosphate retention increases plasma Ca2+, which suppresses PTH and protects bone mass", ok: false },
      { t: "Phosphate retention has no effect on calcium because they are regulated by independent pathways", ok: false },
      { t: "Phosphate retention directly dissolves bone matrix without any hormonal mediator", ok: false },
    ],
    rationale: "In CKD, decreased nephron number impairs phosphate excretion, leading to hyperphosphatemia. Elevated phosphate complexes with calcium, lowering ionized Ca2+ in plasma. The calcium sensing receptor on parathyroid glands detects this hypocalcemia and increases PTH secretion (secondary hyperparathyroidism). Chronically elevated PTH promotes ongoing bone resorption to maintain serum calcium, leading to renal osteodystrophy and osteoporosis with brittle bones. Additionally, CKD impairs 1 alpha hydroxylase activity, reducing active vitamin D3 production and further worsening hypocalcemia.", // source: Ch 30 slide — Hormonal Response to Chronic Renal Disease PTH cascade
    scene: "renal",
    sceneCfg: { label: "CKD — SECONDARY HYPERPARATHYROIDISM" },
    metadata: { topic: "Calcium Regulation", priority: "high" },
  },

  {
    id: "patho-n15-043",
    type: "mcq",
    prompt: "The body maintains fluid balance through a hierarchy of mechanisms. Which category includes changes in GFR, tubular reabsorption, and tubular secretion?",
    setup: "",
    ans: [
      { t: "Local renal mechanisms, which operate intrinsically within the kidney", ok: true },
      { t: "Systemic mechanisms, which involve hormones and the sympathetic nervous system", ok: false },
      { t: "Neural mechanisms, which involve baroreceptor reflex arcs exclusively", ok: false },
      { t: "Humoral mechanisms, which involve circulating peptide hormones only", ok: false },
    ],
    rationale: "The hierarchy of responses to body fluid disturbances includes two levels. Local renal mechanisms are intrarenal and include changes in GFR, tubular reabsorption, and tubular secretion (including glomerulotubular balance and tubuloglomerular feedback). Systemic mechanisms involve hormones (aldosterone, ADH, ANP), sympathetic activity, blood pressure, and blood composition changes that affect renal function from outside the kidney. In steady state, intake must equal output; these mechanisms adjust renal output to match.", // source: Ch 30 slide — Hierarchy of Responses to Disturbances of Body Fluid Regulation
    scene: "renal",
    sceneCfg: { label: "LOCAL RENAL MECHANISMS" },
    metadata: { topic: "Body Fluid Regulation", priority: "medium" },
  },

  {
    id: "patho-n15-044",
    type: "mcq",
    prompt: "Tubuloglomerular feedback (TGF) operates through which anatomic structure to regulate GFR?",
    setup: "",
    ans: [
      { t: "The macula densa, which senses NaCl delivery to the early distal tubule and signals the afferent arteriole", ok: true },
      { t: "The proximal tubule brush border, which senses glucose concentration and adjusts efferent tone", ok: false },
      { t: "The vasa recta, which detect medullary interstitial pressure and modulate cortical blood flow", ok: false },
      { t: "The collecting duct principal cells, which signal the juxtaglomerular apparatus via prostaglandins", ok: false },
    ],
    rationale: "Tubuloglomerular feedback (TGF) is mediated by the macula densa, a specialized group of cells in the wall of the thick ascending limb at the point where it contacts the afferent arteriole of its own glomerulus (the juxtaglomerular apparatus). When NaCl delivery to the macula densa increases (indicating excessive GFR), the macula densa signals the afferent arteriole to constrict, reducing GFR. Conversely, decreased NaCl delivery triggers afferent vasodilation. This creates a negative feedback loop that stabilizes GFR and distal NaCl delivery.", // source: Ch 30 slide — Local Renal Mechanisms showing TGF
    scene: "renal",
    sceneCfg: { label: "TUBULOGLOMERULAR FEEDBACK — MACULA DENSA" },
    metadata: { topic: "Body Fluid Regulation", priority: "high" },
  },

  {
    id: "patho-n15-045",
    type: "mcq",
    prompt: "The renal-body fluid feedback system links arterial pressure to sodium and water excretion. When arterial pressure rises, what is the renal response?",
    setup: "",
    ans: [
      { t: "Increased sodium and water excretion (pressure natriuresis and diuresis), which reduces ECF volume and returns BP toward normal", ok: true },
      { t: "Decreased sodium excretion due to increased proximal tubule reabsorption from higher perfusion pressure", ok: false },
      { t: "No change in sodium excretion, because autoregulation keeps GFR constant across a wide pressure range", ok: false },
      { t: "Increased renin release, which raises angiotensin II and further elevates blood pressure", ok: false },
    ],
    rationale: "Pressure natriuresis is the direct renal mechanism by which increased arterial pressure increases sodium and water excretion. When pressure rises, several mechanisms increase excretion: slightly increased GFR (despite autoregulation), increased peritubular capillary hydrostatic pressure (reducing reabsorption), and decreased angiotensin II and aldosterone (which reduce tubular reabsorption). This is a key negative feedback loop: increased pressure raises excretion, reduces ECF volume, reduces blood volume, reduces venous return and cardiac output, and returns arterial pressure toward normal.", // source: Ch 30 slides — Renal-Body Fluid Feedback; Renal Pressure Natriuresis
    scene: "renal",
    sceneCfg: { label: "PRESSURE NATRIURESIS" },
    metadata: { topic: "Pressure Natriuresis", priority: "high" },
  },

  {
    id: "patho-n15-046",
    type: "mcq",
    prompt: "The chronic pressure natriuresis curve is much steeper than the acute curve. Which of the following contributes to the enhanced chronic natriuresis when arterial pressure rises?",
    setup: "",
    ans: [
      { t: "Decreased angiotensin II and decreased aldosterone, which reduce tubular sodium reabsorption", ok: true },
      { t: "Increased ADH secretion, which concentrates urine and increases sodium excretion per liter", ok: false },
      { t: "Increased sympathetic nerve activity to the kidney, which inhibits proximal reabsorption", ok: false },
      { t: "Decreased renal blood flow due to autoregulatory vasoconstriction", ok: false },
    ],
    rationale: "The chronic pressure natriuresis curve is steeper than the acute curve because sustained increases in arterial pressure suppress the renin angiotensin aldosterone system. Decreased angiotensin II reduces proximal tubule sodium reabsorption and reduces aldosterone, which further reduces collecting duct sodium reabsorption. These hormonal changes amplify the direct pressure effect. The four mechanisms of chronic pressure natriuresis include increased glomerular pressure (slight GFR increase), increased peritubular pressure, decreased angiotensin II, and decreased aldosterone.", // source: Ch 30 slides — Renal Pressure Natriuresis; Mechanisms of Chronic Pressure Natriuresis
    scene: "renal",
    sceneCfg: { label: "CHRONIC NATRIURESIS — Ang II AND ALDOSTERONE" },
    metadata: { topic: "Pressure Natriuresis", priority: "high" },
  },

  {
    id: "patho-n15-047",
    type: "mcq",
    prompt: "Despite large variations in daily fluid intake (1 to 8 L/day), blood volume in a healthy person remains remarkably stable at approximately what value?",
    setup: "",
    ans: [
      { t: "5 liters, because the renal-body fluid feedback mechanism adjusts excretion to match intake", ok: true },
      { t: "3 liters, because excess fluid distributes primarily to the interstitial space rather than blood", ok: false },
      { t: "7 liters, because the cardiovascular system can accommodate large volume loads", ok: false },
      { t: "Blood volume varies proportionally with fluid intake, increasing 1 liter for each liter consumed", ok: false },
    ],
    rationale: "Blood volume is maintained at approximately 5 liters across a wide range of fluid intakes. The renal-body fluid feedback mechanism is responsible: when intake exceeds output, ECF volume expands slightly, blood volume and arterial pressure increase, and pressure natriuresis increases sodium and water excretion until a new steady state is reached. The system is so effective that blood volume changes very little even with dramatically different intakes. Only at very low intakes (below about 0.5 L/day) does blood volume fall significantly.", // source: Ch 30 slide — Effect of Changes in Fluid Intake on Blood Volume (Figure 30-15)
    scene: "renal",
    sceneCfg: { label: "BLOOD VOLUME STABILITY — 5 LITERS" },
    metadata: { topic: "Body Fluid Regulation", priority: "medium" },
  },

  {
    id: "patho-n15-048",
    type: "mcq",
    prompt: "What is the relationship between extracellular fluid (ECF) volume and blood volume when ECF volume expands beyond normal?",
    setup: "",
    ans: [
      { t: "Blood volume increases modestly, but most excess fluid distributes to the interstitium, producing edema", ok: true },
      { t: "Blood volume increases proportionally with ECF, maintaining a constant blood to interstitial ratio", ok: false },
      { t: "Blood volume remains completely fixed; all excess ECF goes to the interstitial space", ok: false },
      { t: "Blood volume actually decreases because the expanded interstitium pulls fluid out of vessels", ok: false },
    ],
    rationale: "When ECF volume expands beyond normal (approximately 15 L), blood volume increases initially. However, once ECF exceeds about 20 L, the compliance of the interstitial space increases dramatically, and most additional fluid accumulates in the interstitial compartment rather than the vascular space. This produces edema. Blood volume may increase from 5 to 6 or 7 liters, but it does not increase proportionally. The interstitial compliance changes explain why patients with severe fluid overload develop massive edema while maintaining blood volumes that are only moderately elevated.", // source: Ch 30 slide — ECF Volume and Blood Volume relationship; Edema threshold
    scene: "renal",
    sceneCfg: { label: "ECF EXPANSION — EDEMA THRESHOLD" },
    metadata: { topic: "Body Fluid Regulation", priority: "medium" },
  },

  {
    id: "patho-n15-049",
    type: "mcq",
    prompt: "A 'salt sensitive' individual requires a greater increase in arterial pressure to excrete a given sodium load compared to a normal person. What does this indicate about their pressure natriuresis curve?",
    setup: "",
    ans: [
      { t: "The curve is shifted to the right, meaning a higher pressure is needed to achieve the same level of sodium excretion", ok: true },
      { t: "The curve is shifted to the left, meaning sodium is excreted at lower than normal pressures", ok: false },
      { t: "The curve is unchanged; salt sensitivity affects only the thirst mechanism, not renal excretion", ok: false },
      { t: "The curve is steeper than normal, indicating an exaggerated natriuretic response", ok: false },
    ],
    rationale: "In salt sensitive individuals, the pressure natriuresis curve is shifted to the right (or has a decreased slope), meaning they require a higher arterial pressure to excrete a given sodium load. At normal sodium intake, their blood pressure is at the intersection of the intake line and their shifted excretion curve, which means a higher equilibrium pressure. Increasing sodium intake in these individuals causes a disproportionately large rise in blood pressure. This is the mechanism of salt sensitive hypertension.", // source: Ch 30 slide — Effectiveness of Pressure Natriuresis Determines Salt-Sensitivity
    scene: "renal",
    sceneCfg: { label: "SALT SENSITIVITY — RIGHTWARD SHIFT" },
    metadata: { topic: "Salt Sensitivity and Hypertension", priority: "high" },
  },

  {
    id: "patho-n15-050",
    type: "mcq",
    prompt: "Which of the following is a major cause of salt sensitive blood pressure?",
    setup: "",
    ans: [
      { t: "Loss of functional nephrons (kidney disease), which impairs the kidney's ability to excrete sodium at normal pressures", ok: true },
      { t: "Excessive ADH secretion, which concentrates urine and retains free water without affecting sodium", ok: false },
      { t: "Hyperaldosteronism with intact feedback, which increases sodium excretion capacity", ok: false },
      { t: "Increased cardiac output from exercise training, which enhances renal perfusion", ok: false },
    ],
    rationale: "Loss of functional nephrons (from any cause of CKD) reduces the total number of glomeruli available to excrete sodium, shifting the pressure natriuresis curve rightward. Other major causes include an inability of the renin angiotensin system to respond appropriately: low renin/angiotensin II states, fixed high renin/angiotensin II (non-modulators), and fixed aldosterone (primary aldosteronism). In primary aldosteronism, aldosterone does NOT have intact feedback; it is autonomously elevated, causing persistent sodium retention and requiring higher pressure for excretion.", // source: Ch 30 slide — Major Causes of Salt-Sensitive Blood Pressure
    scene: "renal",
    sceneCfg: { label: "CAUSES OF SALT SENSITIVITY" },
    metadata: { topic: "Salt Sensitivity and Hypertension", priority: "high" },
  },

  {
    id: "patho-n15-051",
    type: "mcq",
    prompt: "High levels of angiotensin II shift the pressure natriuresis curve in which direction?",
    setup: "",
    ans: [
      { t: "To the right, requiring higher arterial pressure to achieve sodium balance; this mechanism underlies renovascular hypertension", ok: true },
      { t: "To the left, allowing sodium excretion at lower pressures; this is how ACE inhibitors cause hypotension", ok: false },
      { t: "The curve becomes vertical (infinitely steep), preventing any pressure mediated sodium excretion", ok: false },
      { t: "Angiotensin II does not affect pressure natriuresis; it only acts on vascular smooth muscle", ok: false },
    ],
    rationale: "High angiotensin II shifts the pressure natriuresis curve to the right by increasing proximal tubule sodium reabsorption (via Na/H exchanger stimulation) and by stimulating aldosterone secretion (further increasing distal sodium reabsorption). This means a higher arterial pressure is required to excrete any given sodium load. Conversely, angiotensin blockade shifts the curve to the left, allowing sodium excretion at lower pressures. This is the theoretical basis for renovascular hypertension and why ACE inhibitors and ARBs are effective antihypertensives.", // source: Ch 30 slide — Effect of Angiotensin II on Renal Pressure Natriuresis (Figure 30-17)
    scene: "renal",
    sceneCfg: { label: "Ang II SHIFTS NATRIURESIS RIGHTWARD" },
    metadata: { topic: "Salt Sensitivity and Hypertension", priority: "high" },
  },

  {
    id: "patho-n15-052",
    type: "mcq",
    prompt: "When impaired kidney function shifts the pressure natriuresis curve rightward, what happens to mean arterial pressure and urinary sodium excretion over the following days?",
    setup: "",
    ans: [
      { t: "Arterial pressure rises to a new steady state where sodium excretion again equals intake, but at a higher pressure", ok: true },
      { t: "Arterial pressure falls because the kidney retains sodium, expanding volume and reducing peripheral resistance", ok: false },
      { t: "Sodium excretion drops permanently because the kidney can never compensate for the rightward shift", ok: false },
      { t: "Both pressure and sodium excretion oscillate indefinitely without reaching equilibrium", ok: false },
    ],
    rationale: "When the pressure natriuresis curve shifts rightward (e.g., due to reduced nephron mass), sodium excretion initially decreases, causing sodium retention, ECF volume expansion, increased blood volume, increased cardiac output, and rising arterial pressure. The elevated pressure then drives sodium excretion back up (pressure natriuresis) until a new steady state is reached where intake equals output. However, this balance occurs at a higher mean arterial pressure. This is the fundamental mechanism of volume dependent hypertension.", // source: Ch 30 slide — Effect of Hypertensive Shift on Sodium Excretion and Arterial Pressure
    scene: "renal",
    sceneCfg: { label: "HYPERTENSIVE SHIFT — NEW STEADY STATE" },
    metadata: { topic: "Salt Sensitivity and Hypertension", priority: "high" },
  },

  {
    id: "patho-n15-053",
    type: "mcq",
    prompt: "In heart failure, the kidneys retain sodium and water. Which integrated response explains this retention?",
    setup: "",
    ans: [
      { t: "Decreased cardiac output lowers arterial pressure, triggering decreased GFR and increased Na+ reabsorption via angiotensin II, aldosterone, and sympathetic activity", ok: true },
      { t: "The failing heart releases a natriuretic factor that paradoxically causes sodium retention at the proximal tubule", ok: false },
      { t: "Heart failure directly damages the glomerular basement membrane, making it impermeable to sodium filtration", ok: false },
      { t: "Venous congestion from heart failure compresses the kidneys, physically blocking urine output", ok: false },
    ],
    rationale: "In heart failure, reduced cardiac output decreases renal perfusion and arterial pressure. The kidneys respond as if the body is volume depleted: GFR decreases slightly, and multiple hormonal systems (increased angiotensin II, increased aldosterone, increased sympathetic activity) increase tubular sodium reabsorption. Decreased peritubular capillary pressure also enhances proximal reabsorption. The net effect is sodium and water retention, which expands ECF volume in an attempt to restore cardiac output and blood pressure. This creates a vicious cycle of volume overload worsening heart failure.", // source: Ch 30 slide — Integrated Responses to Heart Failure
    scene: "renal",
    sceneCfg: { label: "HEART FAILURE — RENAL Na+ RETENTION" },
    metadata: { topic: "Integrated Responses", priority: "high" },
  },

  {
    id: "patho-n15-054",
    type: "mcq",
    prompt: "In hepatic cirrhosis, reduced plasma protein synthesis and increased vascular capacity affect the renal-body fluid feedback system by doing what?",
    setup: "",
    ans: [
      { t: "Decreasing plasma oncotic pressure and increasing venous capacitance, both of which reduce effective circulating volume and trigger renal sodium retention", ok: true },
      { t: "Increasing plasma oncotic pressure, which pulls fluid into the vascular space and causes hypertension", ok: false },
      { t: "Directly stimulating ADH release from damaged hepatocytes", ok: false },
      { t: "Increasing GFR through hepatorenal reflex vasodilation of the afferent arteriole", ok: false },
    ],
    rationale: "In cirrhosis, the diseased liver produces less albumin, reducing plasma oncotic pressure. Fluid leaks into the peritoneal cavity (ascites) and interstitium. Simultaneously, portal hypertension and splanchnic vasodilation increase vascular capacity. Both effects reduce effective circulating blood volume, which triggers the same retention reflexes as heart failure: decreased renal perfusion leads to RAAS activation, increased sympathetic tone, and increased ADH, all promoting sodium and water retention. Despite total body fluid overload, the effective arterial volume is reduced.", // source: Ch 30 slide — Renal-Body Fluid Feedback with Cirrhosis (decreased plasma proteins, increased vascular capacity)
    scene: "renal",
    sceneCfg: { label: "CIRRHOSIS — DECREASED EFFECTIVE VOLUME" },
    metadata: { topic: "Integrated Responses", priority: "high" },
  },

  {
    id: "patho-n15-055",
    type: "mcq",
    prompt: "Increased distal tubular flow rate promotes potassium loss because it does what at the principal cell level?",
    setup: "",
    ans: [
      { t: "Washes away secreted K+ from the luminal surface, maintaining a favorable concentration gradient for continued K+ secretion", ok: true },
      { t: "Dilutes luminal Na+ below the threshold for ENaC activation, shutting down the driving force for K+ secretion", ok: false },
      { t: "Directly stimulates aldosterone release from the adrenal cortex via a tubular paracrine signal", ok: false },
      { t: "Increases Type A intercalated cell activity, which secretes K+ through H/K ATPase", ok: false },
    ],
    rationale: "Increased tubular flow rate past the principal cells of the collecting duct rapidly removes secreted K+ from the luminal fluid, keeping the luminal K+ concentration low. This maintains a steep concentration gradient from cell interior (high K+) to lumen (low K+), favoring continued K+ secretion through ROMK and BK channels. This flow dependent effect explains why loop diuretics and osmotic diuretics cause significant K+ wasting. Additionally, flow activates BK (big conductance K+) channels specifically. Type A intercalated cells REABSORB K+, not secrete it.", // source: Ch 30 PDF — tubular flow rate effects on K+ secretion
    scene: "renal",
    sceneCfg: { label: "FLOW RATE PROMOTES K+ SECRETION" },
    metadata: { topic: "Renal Potassium Handling", priority: "high" },
  },

  {
    id: "patho-n15-056",
    type: "mcq",
    prompt: "Glomerulotubular balance refers to which intrarenal compensatory mechanism?",
    setup: "",
    ans: [
      { t: "When GFR increases, proximal tubule reabsorption increases proportionally, so the fraction of filtrate reabsorbed stays approximately constant", ok: true },
      { t: "When GFR increases, the glomerulus automatically constricts its afferent arteriole to restore GFR to normal", ok: false },
      { t: "When tubular reabsorption increases, GFR increases by the same amount to prevent volume depletion", ok: false },
      { t: "The balance between afferent and efferent arteriolar resistance that determines filtration fraction", ok: false },
    ],
    rationale: "Glomerulotubular balance ensures that the proximal tubule reabsorbs a constant fraction (approximately 65%) of the filtered load regardless of changes in GFR. If GFR rises, proximal reabsorption rises proportionally. This prevents large fluctuations in distal delivery that could overwhelm downstream segments. The mechanism involves changes in peritubular Starling forces: increased GFR raises peritubular capillary oncotic pressure (from increased filtration fraction) and lowers peritubular hydrostatic pressure, both favoring increased reabsorption. This is distinct from tubuloglomerular feedback (TGF), which adjusts GFR based on distal NaCl delivery.", // source: Ch 30 slide — Local Renal Mechanisms (glomerulotubular balance shown)
    scene: "renal",
    sceneCfg: { label: "GLOMERULOTUBULAR BALANCE" },
    metadata: { topic: "Body Fluid Regulation", priority: "high" },
  },

  {
    id: "patho-n15-057",
    type: "mcq",
    prompt: "Clinical factors associated with salt sensitive blood pressure include all of the following EXCEPT:",
    setup: "",
    ans: [
      { t: "Young age, which is actually associated with LESS salt sensitivity due to higher nephron reserve", ok: true },
      { t: "Older age, because age related nephron loss impairs sodium excretion capacity", ok: false },
      { t: "Diabetes mellitus, which damages renal vasculature and reduces functional nephron mass", ok: false },
      { t: "Kidney diseases such as glomerulonephritis, which destroy nephrons and shift the natriuresis curve", ok: false },
    ],
    rationale: "Older age is associated with increased salt sensitivity because of progressive nephron loss (normal aging reduces nephron number). Young age is associated with greater nephron reserve and less salt sensitivity. Other clinical factors that increase salt sensitivity include African American race (greater prevalence than Caucasians), genetic or familial conditions (Liddle syndrome), kidney diseases (glomerulonephritis), diabetes mellitus, and renin angiotensin aldosterone abnormalities.", // source: Ch 30 slide — Clinical Factors Associated With Salt-Sensitive Blood Pressure
    scene: "renal",
    sceneCfg: { label: "SALT SENSITIVITY — CLINICAL FACTORS" },
    metadata: { topic: "Salt Sensitivity and Hypertension", priority: "medium" },
  },

  {
    id: "patho-n15-058",
    type: "mcq",
    prompt: "In the renal-body fluid feedback loop, the step between blood volume and cardiac output involves which intermediate variables (in order)?",
    setup: "",
    ans: [
      { t: "Blood volume increases mean circulatory filling pressure, which increases venous return, which increases cardiac output", ok: true },
      { t: "Blood volume directly increases heart rate through the Bainbridge reflex, which increases cardiac output", ok: false },
      { t: "Blood volume increases arterial pressure first, which then drives cardiac output through the Frank-Starling mechanism", ok: false },
      { t: "Blood volume acts on the adrenal medulla to release catecholamines, which increase cardiac contractility", ok: false },
    ],
    rationale: "In the renal-body fluid feedback system, increased blood volume raises the mean circulatory filling pressure (the pressure that exists in the vasculature when the heart is stopped, determined by vascular volume relative to capacity). Increased MCFP increases the pressure gradient for venous return to the right atrium, increasing venous return. By the Frank-Starling mechanism, increased venous return (preload) increases stroke volume and cardiac output. This is distinct from the Bainbridge reflex (which does increase heart rate with atrial stretch but is not the primary pathway in this feedback loop).", // source: Ch 30 slide — Renal-Body Fluid Feedback (Figure 30-14)
    scene: "renal",
    sceneCfg: { label: "BLOOD VOLUME → MCFP → VR → CO" },
    metadata: { topic: "Body Fluid Regulation", priority: "high" },
  },

  {
    id: "patho-n15-059",
    type: "mcq",
    prompt: "Excess aldosterone or other mineralocorticoids is listed as a cause of which electrolyte disturbance?",
    setup: "",
    ans: [
      { t: "Hypokalemia, because aldosterone increases K+ secretion by principal cells in the collecting duct", ok: true },
      { t: "Hyperkalemia, because aldosterone stimulates K+ reabsorption through Type A intercalated cells", ok: false },
      { t: "Hypercalcemia, because aldosterone enhances calcium reabsorption in the distal tubule", ok: false },
      { t: "Hyponatremia, because aldosterone promotes sodium excretion in exchange for potassium reabsorption", ok: false },
    ],
    rationale: "Excess aldosterone causes hypokalemia by enhancing K+ secretion in the collecting duct. Aldosterone upregulates ENaC (increasing Na+ reabsorption and creating a more negative luminal potential), Na/K ATPase (increasing intracellular K+ in principal cells), and ROMK channels (increasing luminal K+ secretion). The combined effect is increased K+ wasting in the urine. Primary aldosteronism (Conn syndrome) classically presents with hypertension, hypokalemia, and metabolic alkalosis. Aldosterone does not significantly affect calcium handling; that is PTH/vitamin D territory.", // source: Ch 30 slide — Causes of Hypokalemia (excess aldosterone or other mineralocorticoids listed)
    scene: "renal",
    sceneCfg: { label: "ALDOSTERONE EXCESS — HYPOKALEMIA" },
    metadata: { topic: "Potassium Disorders", priority: "high" },
  },

  {
    id: "patho-n15-060",
    type: "mcq",
    prompt: "Beta adrenergic stimulation affects potassium distribution by doing what?",
    setup: "",
    ans: [
      { t: "Driving K+ into cells by stimulating Na/K ATPase, which can lower plasma K+", ok: true },
      { t: "Driving K+ out of cells by opening voltage gated K+ channels on skeletal muscle", ok: false },
      { t: "Blocking renal K+ secretion at the principal cell, causing hyperkalemia", ok: false },
      { t: "Increasing aldosterone release directly from the adrenal cortex via beta 1 receptors", ok: false },
    ],
    rationale: "Beta 2 adrenergic stimulation activates Na/K ATPase in skeletal muscle and other tissues, driving K+ into cells and lowering plasma K+ concentration. This is clinically relevant: epinephrine administration and beta agonist nebulizer treatments (albuterol) can lower serum K+. Conversely, beta adrenergic blockade (propranolol, esmolol) impairs this cellular K+ uptake and can contribute to hyperkalemia, particularly in patients with renal insufficiency or those receiving exogenous K+. While beta 1 stimulation of juxtaglomerular cells releases renin (which indirectly increases aldosterone), the direct K+ shift effect is through beta 2 mediated Na/K ATPase stimulation.", // source: Ch 30 PDF — beta-adrenergic stimulation drives K+ intracellular; beta-blockade shifts K+ extracellular
    scene: "renal",
    sceneCfg: { label: "BETA AGONISTS DRIVE K+ INTO CELLS" },
    metadata: { topic: "Potassium Homeostasis", priority: "high" },
  },

];

export const PATHO_NODE15_METADATA = {
  nodeId:    "patho-node-15",
  courseId:   "adv-phys-path-1",
  title:     "Urine Concentration & Dilution / Electrolyte Regulation",
  chapter:   "Ch. 29–30, Guyton & Hall 14e",
  totalQs:   60,
};
