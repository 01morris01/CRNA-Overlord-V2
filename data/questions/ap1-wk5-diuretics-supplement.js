/**
 * Advanced Pharmacology I, Week 5 SUPPLEMENT (Diuretics)
 * Stoelting Ch 22 (Whybrew lecture)
 * Concept-complete, concept-first coverage. Answer options length-balanced; dash-free.
 */
export const AP1_WK5_DIURETICS_QUESTIONS = [

  {
    id: "ap1-w5d-001",
    type: "mcq",
    prompt: "A patient calls a newly prescribed agent their water pill. Which effect best explains why it relieves their ankle edema and breathlessness?",
    setup: "",
    ans: [
      { t: "Removes salt and water in urine", ok: true },
      { t: "Raises plasma oncotic pressure", ok: false },
      { t: "Dilates bronchi to ease breathing", ok: false },
      { t: "Strengthens cardiac contraction", ok: false },
    ],
    rationale: "Diuretics increase urinary excretion of sodium and water, which shrinks intravascular and interstitial volume so peripheral edema and pulmonary congestion improve and blood pressure falls. They do not act as bronchodilators or inotropes. Pearl: a water pill works by dumping salt and water into the urine.", // source: Diuretics deck slide 3
    scene: "pharmacology",
    sceneCfg: { label: "WATER PILL ROLE" },
    metadata: { topic: "Diuretic basics", priority: "high" },
  },

  {
    id: "ap1-w5d-002",
    type: "mcq",
    prompt: "The U-shaped segment of the nephron that fine-tunes salt and water handling, and the target of the most powerful diuretics, is the:",
    setup: "",
    ans: [
      { t: "Loop of Henle", ok: true },
      { t: "Glomerular capsule", ok: false },
      { t: "Collecting duct", ok: false },
      { t: "Afferent arteriole", ok: false },
    ],
    rationale: "The loop of Henle is the U-shaped tubular segment that regulates salt and water reabsorption, and its thick ascending limb is where the strongest diuretics act. Different diuretic classes work at distinct tubular sites, which predicts their potency and electrolyte effects. Pearl: the loop of Henle is the U-tube that sets the stage for the most potent diuresis.", // source: Diuretics deck slide 5
    scene: "pharmacology",
    sceneCfg: { label: "LOOP OF HENLE" },
    metadata: { topic: "Nephron sites", priority: "medium" },
  },

  {
    id: "ap1-w5d-003",
    type: "mcq",
    prompt: "Acetazolamide produces diuresis mainly by inhibiting carbonic anhydrase at which tubular site?",
    setup: "",
    ans: [
      { t: "Proximal tubule", ok: true },
      { t: "Thick ascending limb", ok: false },
      { t: "Distal convoluted tubule", ok: false },
      { t: "Medullary collecting duct", ok: false },
    ],
    rationale: "Acetazolamide is a sulfonamide derivative that inhibits carbonic anhydrase predominantly in the proximal tubule, blocking conversion of carbonic acid to carbon dioxide and water. This reduces reabsorption of sodium, bicarbonate, and water at that site. Pearl: carbonic anhydrase inhibitors work mainly in the proximal tubule.", // source: Diuretics deck slide 7
    scene: "pharmacology",
    sceneCfg: { label: "CAI SITE" },
    metadata: { topic: "Carbonic anhydrase inhibitors", priority: "high" },
  },

  {
    id: "ap1-w5d-004",
    type: "mcq",
    prompt: "Sustained use of acetazolamide most characteristically produces which acid-base disturbance?",
    setup: "",
    ans: [
      { t: "Metabolic acidosis", ok: true },
      { t: "Metabolic alkalosis", ok: false },
      { t: "Respiratory acidosis", ok: false },
      { t: "Respiratory alkalosis", ok: false },
    ],
    rationale: "By blocking carbonic anhydrase, acetazolamide increases urinary bicarbonate loss, which depletes plasma bicarbonate and causes a metabolic acidosis along with alkaline urine. The diuresis itself is only mild. Pearl: carbonic anhydrase inhibitors waste bicarbonate and drive a metabolic acidosis.", // source: Diuretics deck slide 7
    scene: "pharmacology",
    sceneCfg: { label: "CAI ACID BASE" },
    metadata: { topic: "Carbonic anhydrase inhibitors", priority: "high" },
  },

  {
    id: "ap1-w5d-005",
    type: "mcq",
    prompt: "Acetazolamide is most commonly used clinically for all of the following EXCEPT:",
    setup: "",
    ans: [
      { t: "Strong rapid diuresis", ok: true },
      { t: "Glaucoma management", ok: false },
      { t: "Acute altitude sickness", ok: false },
      { t: "Edema in heart failure", ok: false },
    ],
    rationale: "Acetazolamide, available orally and intravenously, is used for glaucoma, altitude sickness, and edema associated with heart failure. It is only a mild diuretic, so it is not the drug for rapid potent diuresis, which is a role for loop agents. Pearl: think acetazolamide for glaucoma and altitude, not for powerful diuresis.", // source: Diuretics deck slide 8
    scene: "pharmacology",
    sceneCfg: { label: "ACETAZOLAMIDE USES" },
    metadata: { topic: "Carbonic anhydrase inhibitors", priority: "medium" },
  },

  {
    id: "ap1-w5d-006",
    type: "mcq",
    prompt: "Loop diuretics produce their effect by inhibiting which transporter in the thick ascending limb?",
    setup: "",
    ans: [
      { t: "Na-K-2Cl cotransporter", ok: true },
      { t: "Na-Cl cotransporter", ok: false },
      { t: "Epithelial sodium channel", ok: false },
      { t: "Na-K-ATPase pump", ok: false },
    ],
    rationale: "Loop diuretics block the sodium-potassium-two chloride cotransporter in the thick ascending limb of the loop of Henle, preventing reabsorption of sodium, potassium, and chloride. This segment is impermeable to water, so blocking salt uptake there leaves a large solute load to be excreted. Pearl: loops hit the Na-K-2Cl carrier in the thick ascending limb.", // source: Diuretics deck slide 9
    scene: "pharmacology",
    sceneCfg: { label: "LOOP TRANSPORTER" },
    metadata: { topic: "Loop mechanism", priority: "high" },
  },

  {
    id: "ap1-w5d-007",
    type: "mcq",
    prompt: "Why are loop diuretics the most potent class of diuretic?",
    setup: "",
    ans: [
      { t: "Block a high-capacity sodium site", ok: true },
      { t: "Act on the entire nephron length", ok: false },
      { t: "Pull water osmotically into blood", ok: false },
      { t: "Raise glomerular filtration sharply", ok: false },
    ],
    rationale: "The thick ascending limb normally reabsorbs about 20 to 30 percent of filtered sodium, so blocking transport there produces a large dose-dependent natriuresis that no other site can match. This makes loops first-line for fluid overload in heart failure. Pearl: loops are strongest because their target segment reclaims a big fraction of filtered sodium.", // source: Diuretics deck slide 9
    scene: "pharmacology",
    sceneCfg: { label: "LOOP POTENCY" },
    metadata: { topic: "Loop potency", priority: "high" },
  },

  {
    id: "ap1-w5d-008",
    type: "mcq",
    prompt: "Which agent is NOT a loop diuretic?",
    setup: "",
    ans: [
      { t: "Acetazolamide", ok: true },
      { t: "Ethacrynic acid", ok: false },
      { t: "Bumetanide", ok: false },
      { t: "Torsemide", ok: false },
    ],
    rationale: "The loop diuretic class comprises furosemide, bumetanide, torsemide, and ethacrynic acid. Acetazolamide is a carbonic anhydrase inhibitor acting in the proximal tubule, not a loop agent. Pearl: the loop quartet is furosemide, bumetanide, torsemide, and ethacrynic acid.", // source: Diuretics deck slide 10
    scene: "pharmacology",
    sceneCfg: { label: "LOOP AGENTS" },
    metadata: { topic: "Loop agents", priority: "medium" },
  },

  {
    id: "ap1-w5d-009",
    type: "mcq",
    prompt: "A patient needs potent loop diuresis but has a documented severe sulfonamide allergy. The safest choice is:",
    setup: "",
    ans: [
      { t: "Ethacrynic acid", ok: true },
      { t: "Bumetanide bolus", ok: false },
      { t: "Oral furosemide", ok: false },
      { t: "Oral torsemide", ok: false },
    ],
    rationale: "Ethacrynic acid is the only loop diuretic that is not a sulfonamide, making it the preferred loop agent when a true sulfa allergy is present. Its potency is roughly 70 percent that of furosemide and it remains dose-dependently ototoxic. Pearl: sulfa allergy plus a need for loop diuresis equals ethacrynic acid.", // source: Diuretics deck slide 11
    scene: "pharmacology",
    sceneCfg: { label: "SULFA ALLERGY LOOP" },
    metadata: { topic: "Ethacrynic acid", priority: "high" },
  },

  {
    id: "ap1-w5d-010",
    type: "mcq",
    prompt: "Which statement about furosemide pharmacokinetics is correct?",
    setup: "",
    ans: [
      { t: "About 90% is protein bound", ok: true },
      { t: "Half-life is roughly 12 hours", ok: false },
      { t: "It is available only orally", ok: false },
      { t: "IV onset is about 2 hours", ok: false },
    ],
    rationale: "Furosemide is roughly 90 percent protein bound with an elimination half-life of one to two hours, and it is given orally or intravenously. After IV dosing the onset is 5 to 10 minutes, peak near 30 minutes, and duration 2 to 6 hours. Pearl: furosemide is highly protein bound, short-acting, and works within minutes IV.", // source: Diuretics deck slide 12
    scene: "pharmacology",
    sceneCfg: { label: "FUROSEMIDE PK" },
    metadata: { topic: "Furosemide pharmacokinetics", priority: "high" },
  },

  {
    id: "ap1-w5d-011",
    type: "mcq",
    prompt: "In a patient with normal renal function, which intravenous furosemide dose generally achieves maximal natriuresis?",
    setup: "",
    ans: [
      { t: "20 to 40 mg", ok: true },
      { t: "1 to 5 mg", ok: false },
      { t: "80 to 120 mg", ok: false },
      { t: "160 to 200 mg", ok: false },
    ],
    rationale: "With normal kidneys, 20 to 40 mg of intravenous furosemide typically produces maximal natriuresis, whereas chronic renal insufficiency needs higher doses near 160 to 200 mg to reach the tubular site. Rapid administration risks tinnitus, so larger doses are given slowly. Pearl: 20 to 40 mg IV maxes out natriuresis in normal kidneys.", // source: Diuretics deck slide 13
    scene: "pharmacology",
    sceneCfg: { label: "FUROSEMIDE DOSE" },
    metadata: { topic: "Furosemide dosing", priority: "high" },
  },

  {
    id: "ap1-w5d-012",
    type: "mcq",
    prompt: "Bumetanide differs from furosemide chiefly in that bumetanide:",
    setup: "",
    ans: [
      { t: "Is far more potent by weight", ok: true },
      { t: "Lacks any oral formulation", ok: false },
      { t: "Spares potassium more strongly", ok: false },
      { t: "Has negligible oral absorption", ok: false },
    ],
    rationale: "Bumetanide is roughly 40 times more potent than furosemide on a milligram basis, with high oral bioavailability of 80 to 100 percent and availability by oral, intravenous, and intramuscular routes. Its potassium-wasting effect is similar to other loops. Pearl: bumetanide is the most potent-per-milligram loop, about 40 times furosemide.", // source: Diuretics deck slide 14
    scene: "pharmacology",
    sceneCfg: { label: "BUMETANIDE POTENCY" },
    metadata: { topic: "Bumetanide", priority: "medium" },
  },

  {
    id: "ap1-w5d-013",
    type: "mcq",
    prompt: "Torsemide is most accurately described as a loop diuretic that:",
    setup: "",
    ans: [
      { t: "Is cleared mainly by the liver", ok: true },
      { t: "Is eliminated almost entirely renally", ok: false },
      { t: "Has the shortest action of loops", ok: false },
      { t: "Is weaker than ethacrynic acid", ok: false },
    ],
    rationale: "Torsemide is about three times more potent than furosemide, has a half-life of 3 to 4 hours allowing once-daily dosing, and undergoes primarily hepatic metabolism. In liver failure more drug is delivered to the kidney. Pearl: torsemide is the long-acting, hepatically cleared loop given once daily.", // source: Diuretics deck slide 14
    scene: "pharmacology",
    sceneCfg: { label: "TORSEMIDE PROFILE" },
    metadata: { topic: "Torsemide", priority: "medium" },
  },

  {
    id: "ap1-w5d-014",
    type: "mcq",
    prompt: "For lowering blood pressure, loop diuretics are considered first-line specifically in patients with:",
    setup: "",
    ans: [
      { t: "Renal insufficiency", ok: true },
      { t: "Normal kidney function", ok: false },
      { t: "Mild hypertension", ok: false },
      { t: "Systolic hypertension", ok: false },
    ],
    rationale: "Loops lower blood pressure by reducing intravascular volume and sodium retention and are first-line antihypertensives when renal insufficiency is present, where thiazides lose efficacy. In uncomplicated hypertension with normal kidneys, other classes are usually preferred. Pearl: loops are the go-to antihypertensive when the kidneys are impaired.", // source: Diuretics deck slide 15
    scene: "pharmacology",
    sceneCfg: { label: "LOOP HTN" },
    metadata: { topic: "Loops in hypertension", priority: "medium" },
  },

  {
    id: "ap1-w5d-015",
    type: "mcq",
    prompt: "In acute decompensated heart failure, loops relieve pulmonary edema partly through which vascular mechanism beyond diuresis?",
    setup: "",
    ans: [
      { t: "Prostaglandin venodilation", ok: true },
      { t: "Direct arteriolar constriction", ok: false },
      { t: "Beta receptor mediated inotropy", ok: false },
      { t: "Aldosterone receptor blockade", ok: false },
    ],
    rationale: "Loops are first-line for acute decompensated heart failure, lowering ventricular filling pressure and pulmonary edema both by diuresis and by prostaglandin-mediated venodilation. Torsemide has been associated with fewer readmissions than furosemide in heart failure. Pearl: loops unload the failing heart partly via prostaglandin-driven venodilation.", // source: Diuretics deck slide 15
    scene: "pharmacology",
    sceneCfg: { label: "LOOP HEART FAILURE" },
    metadata: { topic: "Loops in heart failure", priority: "high" },
  },

  {
    id: "ap1-w5d-016",
    type: "mcq",
    prompt: "Furosemide is sometimes used to lower intracranial pressure. An advantage it holds over mannitol is that furosemide:",
    setup: "",
    ans: [
      { t: "Causes no rebound rise in ICP", ok: true },
      { t: "Acts only when the BBB is open", ok: false },
      { t: "Expands plasma volume first", ok: false },
      { t: "Raises serum osmolality sharply", ok: false },
    ],
    rationale: "Furosemide at 0.5 to 1 mg/kg IV lowers intracranial pressure through systemic diuresis and reduced cerebrospinal fluid production, and unlike mannitol it does not produce rebound intracranial hypertension when the blood-brain barrier is disrupted. The two can be combined for greater effect at the cost of more dehydration and electrolyte loss. Pearl: furosemide lowers ICP without the rebound seen with mannitol.", // source: Diuretics deck slide 16
    scene: "pharmacology",
    sceneCfg: { label: "LOOP ICP" },
    metadata: { topic: "Loops and ICP", priority: "medium" },
  },

  {
    id: "ap1-w5d-017",
    type: "mcq",
    prompt: "Loop diuretics are useful in the management of symptomatic hypercalcemia because they:",
    setup: "",
    ans: [
      { t: "Increase urinary calcium loss", ok: true },
      { t: "Block intestinal calcium uptake", ok: false },
      { t: "Drive calcium into bone stores", ok: false },
      { t: "Suppress parathyroid hormone", ok: false },
    ],
    rationale: "Loop diuretics promote urinary calcium excretion, which helps lower serum calcium in symptomatic hypercalcemia, typically alongside adequate volume repletion. This calciuric effect contrasts with thiazides, which retain calcium. Pearl: loops lose calcium in the urine and help treat hypercalcemia.", // source: Diuretics deck slide 16
    scene: "pharmacology",
    sceneCfg: { label: "LOOP HYPERCALCEMIA" },
    metadata: { topic: "Loops and hypercalcemia", priority: "medium" },
  },

  {
    id: "ap1-w5d-018",
    type: "mcq",
    prompt: "A patient on digoxin is started on furosemide. Which loop-induced electrolyte change most increases the danger of digoxin toxicity?",
    setup: "",
    ans: [
      { t: "Hypokalemia", ok: true },
      { t: "Hypercalcemia", ok: false },
      { t: "Hypernatremia", ok: false },
      { t: "Hyperchloremia", ok: false },
    ],
    rationale: "Loops waste potassium, and the resulting hypokalemia sensitizes the myocardium to digoxin and increases the risk of digoxin toxicity. Loops also cause hypovolemia, dose-dependent ototoxicity, raise lithium and aminoglycoside levels, add to aminoglycoside nephrotoxicity, potentiate nondepolarizing neuromuscular blockers, and reduce uric acid excretion. Pearl: loop-induced hypokalemia is what tips a digoxin patient toward toxicity.", // source: Diuretics deck slide 17
    scene: "pharmacology",
    sceneCfg: { label: "LOOP SIDE EFFECTS" },
    metadata: { topic: "Loop side effects", priority: "high" },
  },

  {
    id: "ap1-w5d-019",
    type: "mcq",
    prompt: "A patient receiving a loop diuretic also requires a nondepolarizing neuromuscular blocker for surgery. The expected interaction is that the loop will:",
    setup: "",
    ans: [
      { t: "Prolong the blockade", ok: true },
      { t: "Shorten the blockade", ok: false },
      { t: "Reverse the blockade", ok: false },
      { t: "Have no net effect", ok: false },
    ],
    rationale: "Loop diuretics potentiate nondepolarizing neuromuscular blocking agents and can prolong muscle relaxation, an effect compounded by loop-induced electrolyte shifts. This matters perioperatively when planning relaxant dosing and reversal. Pearl: loops can prolong nondepolarizing neuromuscular blockade.", // source: Diuretics deck slide 17
    scene: "pharmacology",
    sceneCfg: { label: "LOOP NMB INTERACTION" },
    metadata: { topic: "Loop side effects", priority: "high" },
  },

  {
    id: "ap1-w5d-020",
    type: "mcq",
    prompt: "Which agent class is considered first-line for the long-term management of essential hypertension?",
    setup: "",
    ans: [
      { t: "Thiazide diuretics", ok: true },
      { t: "Osmotic diuretics", ok: false },
      { t: "Carbonic anhydrase agents", ok: false },
      { t: "Vasopressin antagonists", ok: false },
    ],
    rationale: "Thiazides lower blood pressure through an initial reduction in extracellular fluid volume followed by sustained reductions in systemic vascular resistance from vasodilation. This durable vasodilatory effect makes them a preferred long-term oral antihypertensive. Pearl: Thiazides are the workhorse first-line drug for chronic hypertension.", // source: Diuretics deck slide 20
    scene: "pharmacology",
    sceneCfg: { label: "THIAZIDE HTN" },
    metadata: { topic: "Thiazide first-line use", priority: "high" },
  },

  {
    id: "ap1-w5d-021",
    type: "mcq",
    prompt: "At which nephron segment do thiazide diuretics primarily block sodium reabsorption?",
    setup: "",
    ans: [
      { t: "Distal convoluted tubule", ok: true },
      { t: "Thick ascending limb", ok: false },
      { t: "Cortical collecting duct", ok: false },
      { t: "Proximal convoluted tubule", ok: false },
    ],
    rationale: "Thiazides inhibit the sodium chloride cotransporter in the distal convoluted tubule. Increased sodium delivery to the downstream collecting duct then drives potassium secretion, producing hypokalemia. Pearl: Thiazides work at the distal convoluted tubule and waste potassium downstream.", // source: Diuretics deck slide 21
    scene: "pharmacology",
    sceneCfg: { label: "DCT SITE" },
    metadata: { topic: "Thiazide site of action", priority: "high" },
  },

  {
    id: "ap1-w5d-022",
    type: "mcq",
    prompt: "Compared with loop diuretics, thiazides have which distinctive effect on calcium handling?",
    setup: "",
    ans: [
      { t: "Increase calcium reabsorption", ok: true },
      { t: "Increase calcium excretion", ok: false },
      { t: "Bind calcium in the gut lumen", ok: false },
      { t: "No effect on calcium", ok: false },
    ],
    rationale: "Thiazides enhance distal calcium reabsorption, reducing urinary calcium and tending to raise serum calcium. This is the opposite of loop diuretics, which promote calcium excretion and are used to treat hypercalcemia. Pearl: thiazides retain calcium and can unmask hypercalcemia, while loops dump it.", // source: Diuretics deck slide 21
    scene: "pharmacology",
    sceneCfg: { label: "CALCIUM RETENTION" },
    metadata: { topic: "Thiazide calcium handling", priority: "high" },
  },

  {
    id: "ap1-w5d-023",
    type: "mcq",
    prompt: "Which oral antihypertensive is favored in resistant hypertension because of its very long duration of action near 50 to 60 hours?",
    setup: "",
    ans: [
      { t: "Chlorthalidone", ok: true },
      { t: "Hydrochlorothiazide", ok: false },
      { t: "Indapamide drug", ok: false },
      { t: "Acetazolamide", ok: false },
    ],
    rationale: "Chlorthalidone has a half-life of roughly 50 to 60 hours, far longer than the 8 to 12 hours of hydrochlorothiazide, giving sustained blood pressure control useful in resistant hypertension. Pearl: Chlorthalidone is the long-acting thiazide-type agent for tough hypertension.", // source: Diuretics deck slide 22
    scene: "pharmacology",
    sceneCfg: { label: "CHLORTHALIDONE" },
    metadata: { topic: "Chlorthalidone pharmacokinetics", priority: "medium" },
  },

  {
    id: "ap1-w5d-024",
    type: "mcq",
    prompt: "Which thiazide-type agent is eliminated mainly by hepatic metabolism rather than the kidney?",
    setup: "",
    ans: [
      { t: "Indapamide", ok: true },
      { t: "Hydrochlorothiazide", ok: false },
      { t: "Chlorthalidone", ok: false },
      { t: "Metolazone", ok: false },
    ],
    rationale: "Most thiazides are cleared renally, but indapamide is the exception with predominantly hepatic elimination. Because the others depend on renal delivery, their efficacy falls in renal insufficiency. Pearl: Indapamide is the hepatically cleared outlier among thiazides.", // source: Diuretics deck slide 22
    scene: "pharmacology",
    sceneCfg: { label: "INDAPAMIDE" },
    metadata: { topic: "Thiazide elimination", priority: "low" },
  },

  {
    id: "ap1-w5d-025",
    type: "mcq",
    prompt: "When a thiazide is added to a loop diuretic to overcome diuretic resistance in renal insufficiency, which agent is typically chosen?",
    setup: "",
    ans: [
      { t: "Metolazone", ok: true },
      { t: "Spironolactone", ok: false },
      { t: "Acetazolamide", ok: false },
      { t: "Triamterene", ok: false },
    ],
    rationale: "Metolazone is combined with a loop diuretic to produce sequential nephron blockade, restoring diuresis when a loop alone fails in renal insufficiency. The thiazide blocks distal sodium reabsorption that escapes the loop. Pearl: Metolazone plus a loop gives sequential nephron blockade for refractory edema.", // source: Diuretics deck slide 23
    scene: "pharmacology",
    sceneCfg: { label: "METOLAZONE COMBO" },
    metadata: { topic: "Sequential nephron blockade", priority: "medium" },
  },

  {
    id: "ap1-w5d-026",
    type: "mcq",
    prompt: "Thiazides are useful for preventing which type of recurrent kidney stone?",
    setup: "",
    ans: [
      { t: "Calcium-containing stones", ok: true },
      { t: "Uric acid purine stones", ok: false },
      { t: "Cystine amino acid stones", ok: false },
      { t: "Magnesium struvite stones", ok: false },
    ],
    rationale: "By enhancing distal calcium reabsorption, thiazides lower urinary calcium and reduce formation of calcium-containing stones. The same calcium retention that helps stones can raise serum calcium. Pearl: Thiazides cut urinary calcium and help prevent calcium stones.", // source: Diuretics deck slide 23
    scene: "pharmacology",
    sceneCfg: { label: "CALCIUM STONES" },
    metadata: { topic: "Thiazide stone prevention", priority: "medium" },
  },

  {
    id: "ap1-w5d-027",
    type: "mcq",
    prompt: "Which metabolic abnormality is consistent with the thiazide side effect profile?",
    setup: "",
    ans: [
      { t: "Hyperglycemia", ok: true },
      { t: "Hypoglycemic states", ok: false },
      { t: "Low serum calcium", ok: false },
      { t: "High serum potassium", ok: false },
    ],
    rationale: "Thiazides produce a cluster of H disturbances including hypokalemia, hypomagnesemia, hyperuricemia, hyperglycemia, hyperlipidemia, hypercalcemia, and metabolic alkalosis. Hyperglycemia and worsened lipids are recognized metabolic effects. Pearl: Remember the thiazide H list and that glucose goes up, not down.", // source: Diuretics deck slide 24
    scene: "pharmacology",
    sceneCfg: { label: "THIAZIDE H LIST" },
    metadata: { topic: "Thiazide metabolic effects", priority: "high" },
  },

  {
    id: "ap1-w5d-028",
    type: "mcq",
    prompt: "Which acid-base and potassium pattern does a thiazide typically produce?",
    setup: "",
    ans: [
      { t: "Hypokalemic metabolic alkalosis", ok: true },
      { t: "Hyperkalemic metabolic acidosis", ok: false },
      { t: "Hypokalemic metabolic acidosis", ok: false },
      { t: "Hyperkalemic mild alkalosis", ok: false },
    ],
    rationale: "Because thiazides act upstream of the collecting duct, increased distal sodium delivery drives potassium and hydrogen loss, yielding hypokalemia with metabolic alkalosis. Hypomagnesemia can make the hypokalemia refractory until magnesium is replaced. Pearl: Upstream diuretics give low potassium plus alkalosis.", // source: Diuretics deck slide 24
    scene: "pharmacology",
    sceneCfg: { label: "HYPOK ALKALOSIS" },
    metadata: { topic: "Thiazide electrolyte fingerprint", priority: "high" },
  },

  {
    id: "ap1-w5d-029",
    type: "mcq",
    prompt: "How do osmotic diuretics increase urine output?",
    setup: "",
    ans: [
      { t: "Filtered solute holds tubular water", ok: true },
      { t: "They block the NaK2Cl carrier protein", ok: false },
      { t: "They antagonize aldosterone receptors", ok: false },
      { t: "They inhibit luminal carbonic anhydrase", ok: false },
    ],
    rationale: "Osmotic agents are freely filtered and poorly reabsorbed, so they raise tubular fluid osmolality and hold water within the tubule at water-permeable segments such as the proximal tubule and descending loop. The retained water is then excreted as osmotic diuresis. Pearl: Osmotic diuresis works by filtered solute that water cannot leave behind.", // source: Diuretics deck slide 25
    scene: "pharmacology",
    sceneCfg: { label: "OSMOTIC MECH" },
    metadata: { topic: "Osmotic diuretic mechanism", priority: "high" },
  },

  {
    id: "ap1-w5d-030",
    type: "mcq",
    prompt: "By what mechanism does mannitol lower intracranial pressure when the blood-brain barrier is intact?",
    setup: "",
    ans: [
      { t: "Pulls brain water into the vasculature", ok: true },
      { t: "Constricts cerebral arterioles directly", ok: false },
      { t: "Blocks cerebral aquaporin channels", ok: false },
      { t: "Lowers cerebral metabolic rate", ok: false },
    ],
    rationale: "Mannitol raises plasma osmolality and, with an intact barrier, draws water from brain tissue into the intravascular space, reducing brain volume and intracranial pressure. It is also a free radical scavenger. Pearl: Mannitol shrinks the brain osmotically only when the barrier keeps it out.", // source: Diuretics deck slide 26
    scene: "pharmacology",
    sceneCfg: { label: "MANNITOL ICP" },
    metadata: { topic: "Mannitol ICP mechanism", priority: "high" },
  },

  {
    id: "ap1-w5d-031",
    type: "mcq",
    prompt: "Why can mannitol cause a rebound rise in intracranial pressure?",
    setup: "",
    ans: [
      { t: "It enters brain across a broken barrier", ok: true },
      { t: "It is reabsorbed by the proximal tubule", ok: false },
      { t: "It stimulates cerebral aquaporin insertion", ok: false },
      { t: "It directly dilates the cerebral venules", ok: false },
    ],
    rationale: "Mannitol depends on an intact blood-brain barrier; if the barrier is disrupted, mannitol crosses into brain tissue and pulls water in, producing rebound intracranial hypertension. This is a key contrast with loop diuretics, which do not cause rebound. Pearl: A broken barrier turns mannitol from helper to rebound hazard.", // source: Diuretics deck slide 27
    scene: "pharmacology",
    sceneCfg: { label: "REBOUND ICP" },
    metadata: { topic: "Mannitol BBB dependence", priority: "high" },
  },

  {
    id: "ap1-w5d-032",
    type: "mcq",
    prompt: "Why is mannitol considered ineffective and potentially harmful in established renal failure?",
    setup: "",
    ans: [
      { t: "It is not filtered so it accumulates", ok: true },
      { t: "It is rapidly metabolized to water", ok: false },
      { t: "It binds plasma proteins tightly", ok: false },
      { t: "It is secreted by the proximal tubule", ok: false },
    ],
    rationale: "Mannitol works only when filtered at the glomerulus, so in renal failure it is not filtered, fails to produce diuresis, and accumulates in plasma. The resulting hyperosmolar state and volume expansion can precipitate pulmonary edema. Pearl: No filtration means no mannitol diuresis and dangerous accumulation.", // source: Diuretics deck slide 28
    scene: "pharmacology",
    sceneCfg: { label: "RENAL FAILURE" },
    metadata: { topic: "Mannitol renal failure caution", priority: "high" },
  },

  {
    id: "ap1-w5d-033",
    type: "mcq",
    prompt: "Shortly after a mannitol infusion, which early hemodynamic effect is most expected?",
    setup: "",
    ans: [
      { t: "Intravascular volume expansion", ok: true },
      { t: "Immediate intravascular depletion", ok: false },
      { t: "Direct myocardial depression", ok: false },
      { t: "Sustained reflex bradycardia", ok: false },
    ],
    rationale: "Mannitol initially pulls water into the vasculature, expanding intravascular volume and raising preload, which is poorly tolerated in left ventricular dysfunction and can cause pulmonary edema. Diuresis and possible hypovolemia follow later. Pearl: Mannitol first fills the tank, threatening the failing heart before it empties it.", // source: Diuretics deck slide 28
    scene: "pharmacology",
    sceneCfg: { label: "VOLUME EXPANSION" },
    metadata: { topic: "Mannitol hemodynamic effects", priority: "medium" },
  },

  {
    id: "ap1-w5d-034",
    type: "mcq",
    prompt: "Amiloride and triamterene reduce sodium reabsorption by which action?",
    setup: "",
    ans: [
      { t: "Blocking epithelial sodium channels", ok: true },
      { t: "Antagonizing aldosterone receptors fully", ok: false },
      { t: "Inhibiting the distal NaCl cotransporter", ok: false },
      { t: "Antagonizing vasopressin V2 receptors", ok: false },
    ],
    rationale: "Amiloride and triamterene directly block the epithelial sodium channel in the collecting duct, reducing sodium uptake and sparing potassium without needing aldosterone receptors. Because the collecting duct reclaims little sodium, diuresis is mild. Pearl: ENaC blockers spare potassium directly at the channel, not the aldosterone receptor.", // source: Diuretics deck slide 29
    scene: "pharmacology",
    sceneCfg: { label: "ENAC BLOCKERS" },
    metadata: { topic: "ENaC blocker mechanism", priority: "high" },
  },

  {
    id: "ap1-w5d-035",
    type: "mcq",
    prompt: "What is the primary clinical role of potassium-sparing diuretics when paired with a loop or thiazide?",
    setup: "",
    ans: [
      { t: "To offset potassium loss", ok: true },
      { t: "To provide potent diuresis", ok: false },
      { t: "To increase calcium excretion", ok: false },
      { t: "To alkalinize the urine", ok: false },
    ],
    rationale: "Because the collecting duct handles only a small fraction of sodium, these agents cause mild diuresis and are mainly combined with kaliuretic loops or thiazides to counter hypokalemia. They are seldom used alone for blood pressure control. Pearl: Potassium-sparing agents are added to protect potassium, not to drive diuresis.", // source: Diuretics deck slide 29
    scene: "pharmacology",
    sceneCfg: { label: "K SPARING ROLE" },
    metadata: { topic: "Potassium-sparing combination role", priority: "medium" },
  },

  {
    id: "ap1-w5d-036",
    type: "mcq",
    prompt: "How do spironolactone and eplerenone reduce sodium reabsorption in the collecting duct?",
    setup: "",
    ans: [
      { t: "Competitive mineralocorticoid blockade", ok: true },
      { t: "Direct epithelial sodium channel blockade", ok: false },
      { t: "Luminal carbonic anhydrase inhibition", ok: false },
      { t: "Vasopressin V2 receptor antagonism", ok: false },
    ],
    rationale: "These agents competitively antagonize the mineralocorticoid receptor from the plasma side, reducing aldosterone-driven sodium reabsorption and potassium secretion. They do not need to enter the tubular lumen to act. Pearl: Aldosterone antagonists block the receptor from the blood, sparing potassium.", // source: Diuretics deck slide 30
    scene: "pharmacology",
    sceneCfg: { label: "MR BLOCKADE" },
    metadata: { topic: "Aldosterone antagonist mechanism", priority: "high" },
  },

  {
    id: "ap1-w5d-037",
    type: "mcq",
    prompt: "Beyond diuresis, which additional benefit do aldosterone antagonists provide in heart failure?",
    setup: "",
    ans: [
      { t: "Block cardiac fibrosis and remodeling", ok: true },
      { t: "Raise myocardial contractility directly", ok: false },
      { t: "Increase renal calcium excretion", ok: false },
      { t: "Promote free water clearance", ok: false },
    ],
    rationale: "Aldosterone antagonists blunt aldosterone-mediated cardiac remodeling and fibrosis, a mechanism that contributes to their mortality benefit in heart failure with reduced ejection fraction. This antifibrotic action is independent of their modest diuretic effect. Pearl: In heart failure these drugs help by stopping fibrosis, not by emptying volume.", // source: Diuretics deck slide 30
    scene: "pharmacology",
    sceneCfg: { label: "ANTI FIBROSIS" },
    metadata: { topic: "Aldosterone antagonist antifibrotic effect", priority: "medium" },
  },

  {
    id: "ap1-w5d-038",
    type: "mcq",
    prompt: "Which landmark trial established a mortality benefit for spironolactone in heart failure with reduced ejection fraction?",
    setup: "",
    ans: [
      { t: "The RALES trial", ok: true },
      { t: "The SOLVD trial", ok: false },
      { t: "The CONSENSUS trial", ok: false },
      { t: "The PARADIGM trial", ok: false },
    ],
    rationale: "RALES demonstrated reduced morbidity and mortality with spironolactone added to standard therapy in heart failure with reduced ejection fraction. Eplerenone separately improved survival after myocardial infarction with left ventricular dysfunction. Pearl: RALES is the spironolactone survival trial in reduced ejection fraction heart failure.", // source: Diuretics deck slide 31
    scene: "pharmacology",
    sceneCfg: { label: "RALES TRIAL" },
    metadata: { topic: "RALES trial", priority: "high" },
  },

  {
    id: "ap1-w5d-039",
    type: "mcq",
    prompt: "Aldosterone antagonists are particularly useful in which form of hypertension?",
    setup: "",
    ans: [
      { t: "Low-renin hypertension", ok: true },
      { t: "High-renin hypertension", ok: false },
      { t: "Isolated systolic in youth", ok: false },
      { t: "White-coat hypertension", ok: false },
    ],
    rationale: "Mineralocorticoid receptor antagonists are especially effective in low-renin and resistant hypertension and in primary hyperaldosteronism, where aldosterone excess drives sodium retention. They also counter aldosterone escape during renin-angiotensin therapy. Pearl: Think aldosterone antagonist for low-renin and resistant hypertension.", // source: Diuretics deck slide 31
    scene: "pharmacology",
    sceneCfg: { label: "LOW RENIN HTN" },
    metadata: { topic: "Aldosterone antagonist hypertension uses", priority: "medium" },
  },

  {
    id: "ap1-w5d-040",
    type: "mcq",
    prompt: "Which adverse effect is the most serious concern with chronic aldosterone antagonist therapy, especially before surgery?",
    setup: "",
    ans: [
      { t: "Hyperkalemia", ok: true },
      { t: "Hypokalemia", ok: false },
      { t: "Hypercalcemia", ok: false },
      { t: "Hypoglycemia", ok: false },
    ],
    rationale: "Because these drugs spare potassium, hyperkalemia is the most dangerous effect and is worsened by ACE inhibitors, ARBs, and renal impairment. Potassium should be checked in any chronic spironolactone patient, especially preoperatively. Pearl: Always check potassium before surgery in a spironolactone patient.", // source: Diuretics deck slide 32
    scene: "pharmacology",
    sceneCfg: { label: "HYPERKALEMIA" },
    metadata: { topic: "Aldosterone antagonist hyperkalemia", priority: "high" },
  },

  {
    id: "ap1-w5d-041",
    type: "mcq",
    prompt: "Which agent is most likely to cause gynecomastia and breast tenderness?",
    setup: "",
    ans: [
      { t: "Spironolactone", ok: true },
      { t: "Selective eplerenone", ok: false },
      { t: "Amiloride therapy", ok: false },
      { t: "Triamterene agent", ok: false },
    ],
    rationale: "Spironolactone is nonselective and blocks androgen and progesterone receptors in addition to mineralocorticoid receptors, causing gynecomastia and breast tenderness. The selective agent eplerenone largely avoids these endocrine effects. Pearl: Gynecomastia points to spironolactone, not eplerenone.", // source: Diuretics deck slide 32
    scene: "pharmacology",
    sceneCfg: { label: "GYNECOMASTIA" },
    metadata: { topic: "Spironolactone endocrine effects", priority: "medium" },
  },

  {
    id: "ap1-w5d-042",
    type: "mcq",
    prompt: "Which agent is metabolized by CYP3A4 such that strong inhibitors raise its blood levels and hyperkalemia risk?",
    setup: "",
    ans: [
      { t: "Eplerenone", ok: true },
      { t: "Amiloride", ok: false },
      { t: "Triamterene", ok: false },
      { t: "Hydrochlorothiazide", ok: false },
    ],
    rationale: "Eplerenone undergoes hepatic metabolism through CYP3A4, so strong CYP3A4 inhibitors increase its concentration and the danger of hyperkalemia. Spironolactone has a longer half-life near 20 hours and active metabolites. Pearl: Watch CYP3A4 inhibitors with eplerenone to avoid dangerous potassium rises.", // source: Diuretics deck slide 32
    scene: "pharmacology",
    sceneCfg: { label: "CYP3A4 EPLERENONE" },
    metadata: { topic: "Aldosterone antagonist pharmacokinetics", priority: "low" },
  },

  {
    id: "ap1-w5d-043",
    type: "mcq",
    prompt: "Tolvaptan increases free water excretion by antagonizing which receptor?",
    setup: "",
    ans: [
      { t: "Vasopressin V2 receptor", ok: true },
      { t: "Mineralocorticoid receptor", ok: false },
      { t: "Epithelial sodium channel", ok: false },
      { t: "Angiotensin receptor type", ok: false },
    ],
    rationale: "Tolvaptan is a selective V2 antagonist that prevents aquaporin-2 insertion in the collecting duct, producing aquaresis, the excretion of dilute urine without major loss of sodium or potassium. It is used for hyponatremia of SIADH, heart failure, and cirrhosis. Pearl: Tolvaptan blocks V2 to dump free water while keeping electrolytes.", // source: Diuretics deck slide 33
    scene: "pharmacology",
    sceneCfg: { label: "V2 ANTAGONIST" },
    metadata: { topic: "Tolvaptan mechanism", priority: "high" },
  },

  {
    id: "ap1-w5d-044",
    type: "mcq",
    prompt: "What is the black-box safety concern with tolvaptan when treating hyponatremia?",
    setup: "",
    ans: [
      { t: "Osmotic demyelination from fast rise", ok: true },
      { t: "Severe hyperkalemia from potassium loss", ok: false },
      { t: "Rebound intracranial hypertension danger", ok: false },
      { t: "Profound hypocalcemia with overt tetany", ok: false },
    ],
    rationale: "Tolvaptan can raise serum sodium too rapidly, and overly fast correction of hyponatremia risks osmotic demyelination, the basis of its black-box warning. Initiation is done where sodium can be monitored closely. Pearl: Correct sodium slowly with tolvaptan to avoid osmotic demyelination.", // source: Diuretics deck slide 33
    scene: "pharmacology",
    sceneCfg: { label: "DEMYELINATION" },
    metadata: { topic: "Tolvaptan demyelination warning", priority: "high" },
  },

  {
    id: "ap1-w5d-045",
    type: "mcq",
    prompt: "At which receptor do dopamine and fenoldopam act to produce natriuresis and renal vasodilation?",
    setup: "",
    ans: [
      { t: "D1 dopamine receptor", ok: true },
      { t: "Beta1 adrenergic receptor", ok: false },
      { t: "Alpha1 adrenergic receptor", ok: false },
      { t: "V2 vasopressin receptor", ok: false },
    ],
    rationale: "Both agents stimulate D1 receptors in the proximal tubule and loop of Henle, causing natriuresis, increased renal blood flow, and a mild rise in GFR. Beta1 and alpha1 effects belong to higher dopamine doses, not the renal-vasodilating action. Pearl: D1 activation is the renal-vasodilating signal shared by dopamine and fenoldopam.", // source: Diuretics deck slide 34
    scene: "pharmacology",
    sceneCfg: { label: "D1 RECEPTOR ACTION" },
    metadata: { topic: "Dopamine agonists", priority: "5" },
  },

  {
    id: "ap1-w5d-046",
    type: "mcq",
    prompt: "Which renal effect follows D1 receptor activation by a dopamine agonist?",
    setup: "",
    ans: [
      { t: "Natriuresis with higher flow", ok: true },
      { t: "Sodium retention with low flow", ok: false },
      { t: "Potassium retention and acidosis", ok: false },
      { t: "Free water retention everywhere", ok: false },
    ],
    rationale: "D1 stimulation in the proximal tubule and loop of Henle promotes sodium excretion while dilating renal vasculature, raising renal blood flow and mildly raising GFR. It does not cause sodium or potassium retention. Pearl: D1 agonism yields natriuresis plus increased renal perfusion.", // source: Diuretics deck slide 34
    scene: "pharmacology",
    sceneCfg: { label: "D1 RENAL EFFECT" },
    metadata: { topic: "Dopamine agonists", priority: "4" },
  },

  {
    id: "ap1-w5d-047",
    type: "mcq",
    prompt: "As an infusion of dopamine is titrated upward, which sequence of receptor activation occurs?",
    setup: "",
    ans: [
      { t: "D1 then beta1 then alpha1", ok: true },
      { t: "Alpha1 then beta1 then D1", ok: false },
      { t: "Beta1 then D1 then alpha1", ok: false },
      { t: "D1 then alpha1 then beta1", ok: false },
    ],
    rationale: "Low-dose dopamine favors D1 renal vasodilation, moderate doses recruit beta1 to raise inotropy, cardiac output, and blood pressure, and high doses recruit alpha1 to cause vasoconstriction. The progression moves from dopaminergic to beta to alpha as the dose climbs. Pearl: dopamine climbs D1 to beta1 to alpha1 with increasing dose.", // source: Diuretics deck slide 35
    scene: "pharmacology",
    sceneCfg: { label: "DOSE DEPENDENT DOPAMINE" },
    metadata: { topic: "Dopamine agonists", priority: "5" },
  },

  {
    id: "ap1-w5d-048",
    type: "mcq",
    prompt: "At a moderate dopamine infusion rate, which receptor predominates and what is the effect?",
    setup: "",
    ans: [
      { t: "Beta1 raising contractility", ok: true },
      { t: "Alpha1 raising renal flow only", ok: false },
      { t: "D1 causing brisk vasoconstriction", ok: false },
      { t: "Beta2 causing slow bradycardia", ok: false },
    ],
    rationale: "Moderate doses recruit beta1 receptors, increasing contractility, cardiac output, and blood pressure. Renal vasodilation is the low-dose D1 effect, and vasoconstriction is the high-dose alpha1 effect. Pearl: moderate dopamine is the beta1 inotropy and cardiac output range.", // source: Diuretics deck slide 35
    scene: "pharmacology",
    sceneCfg: { label: "MODERATE DOSE BETA1" },
    metadata: { topic: "Dopamine agonists", priority: "4" },
  },

  {
    id: "ap1-w5d-049",
    type: "mcq",
    prompt: "What is the best current evidence for using low-dose renal dopamine to protect the kidneys?",
    setup: "",
    ans: [
      { t: "Outcomes are not improved", ok: true },
      { t: "It reliably prevents failure", ok: false },
      { t: "It reverses established injury", ok: false },
      { t: "It replaces dialysis fully", ok: false },
    ],
    rationale: "Although low-dose dopamine causes D1 renal vasodilation, the bulk of evidence shows clinical outcomes are not changed, so it is not recommended for renal protection. Increased urine output does not translate into preserved renal function. Pearl: low-dose renal dopamine boosts flow but does not improve outcomes.", // source: Diuretics deck slide 35
    scene: "pharmacology",
    sceneCfg: { label: "LOW DOSE OUTCOMES" },
    metadata: { topic: "Dopamine agonists", priority: "5" },
  },

  {
    id: "ap1-w5d-050",
    type: "mcq",
    prompt: "Which description best fits fenoldopam?",
    setup: "",
    ans: [
      { t: "Selective D1 agonist cutting SVR", ok: true },
      { t: "Mixed alpha and beta agonist drug", ok: false },
      { t: "Selective beta1 receptor agonist", ok: false },
      { t: "Nonselective alpha blocker agent", ok: false },
    ],
    rationale: "Fenoldopam is a selective D1 agonist with no alpha1 or beta activity, so it lowers systemic vascular resistance and dilates renal vessels. Its half-life is roughly 10 minutes and it is given intravenously only. Pearl: fenoldopam is pure D1, dropping SVR without alpha or beta effects.", // source: Diuretics deck slide 36
    scene: "pharmacology",
    sceneCfg: { label: "FENOLDOPAM PROFILE" },
    metadata: { topic: "Dopamine agonists", priority: "5" },
  },

  {
    id: "ap1-w5d-051",
    type: "mcq",
    prompt: "What is the approximate elimination half-life and route of fenoldopam?",
    setup: "",
    ans: [
      { t: "About 10 minutes, IV only", ok: true },
      { t: "About 10 hours, oral only", ok: false },
      { t: "About 2 hours, IM only", ok: false },
      { t: "About 20 hours, IV only", ok: false },
    ],
    rationale: "Fenoldopam has a short half-life near 10 minutes and is administered only by intravenous infusion, which allows rapid titration for blood pressure control. Its brevity suits acute settings rather than oral maintenance. Pearl: fenoldopam is a short-acting IV-only D1 agonist near 10 minutes.", // source: Diuretics deck slide 36
    scene: "pharmacology",
    sceneCfg: { label: "FENOLDOPAM KINETICS" },
    metadata: { topic: "Dopamine agonists", priority: "4" },
  },

  {
    id: "ap1-w5d-052",
    type: "mcq",
    prompt: "Fenoldopam is particularly useful for severe hypertension because it lowers pressure while doing what?",
    setup: "",
    ans: [
      { t: "Avoiding reflex tachycardia", ok: true },
      { t: "Provoking marked tachycardia", ok: false },
      { t: "Causing renal vasoconstriction", ok: false },
      { t: "Raising vascular resistance", ok: false },
    ],
    rationale: "Because fenoldopam acts purely at D1 without beta activity, it provides renal vasodilation and blood pressure reduction without the tachycardia seen with many vasodilators. This makes it attractive in severe or resistant hypertension. Pearl: fenoldopam lowers pressure and dilates renal vessels without driving heart rate up.", // source: Diuretics deck slide 37
    scene: "pharmacology",
    sceneCfg: { label: "FENOLDOPAM USE" },
    metadata: { topic: "Dopamine agonists", priority: "4" },
  },

  {
    id: "ap1-w5d-053",
    type: "mcq",
    prompt: "For which scenario is a dopamine infusion classically chosen over fenoldopam?",
    setup: "",
    ans: [
      { t: "Cardiogenic shock with low SVR", ok: true },
      { t: "Resistant essential hypertension", ok: false },
      { t: "Routine renal protection surgery", ok: false },
      { t: "Chronic oral blood pressure care", ok: false },
    ],
    rationale: "Dopamine supports cardiac output and perfusion in cardiogenic shock with low or normal SVR through its beta1 and dose-dependent effects. Fenoldopam, a pure vasodilator, is reserved for severe or resistant hypertension. Pearl: dopamine props up the failing low-resistance circulation while fenoldopam treats hypertension.", // source: Diuretics deck slide 37
    scene: "pharmacology",
    sceneCfg: { label: "DOPAMINE INDICATION" },
    metadata: { topic: "Dopamine agonists", priority: "4" },
  },

  {
    id: "ap1-w5d-054",
    type: "mcq",
    prompt: "How should a chronic diuretic user be expected to behave around the perioperative period for volume?",
    setup: "",
    ans: [
      { t: "Depleted preop, retains fluid later", ok: true },
      { t: "Overloaded preop, then diureses fast", ok: false },
      { t: "Euvolemic through the whole course", ok: false },
      { t: "Hypervolemic at every single point", ok: false },
    ],
    rationale: "Long-term diuretic therapy often leaves patients relatively volume depleted before surgery, yet the endocrine stress response activates sodium and water retaining hormones afterward, producing postoperative fluid retention. Diuretics must therefore be balanced against hypovolemia, electrolyte shifts, and renal hypoperfusion. Pearl: chronic diuretic users arrive dry but retain fluid once stress hormones surge.", // source: Diuretics deck slide 38
    scene: "pharmacology",
    sceneCfg: { label: "PERIOP VOLUME STATUS" },
    metadata: { topic: "Perioperative diuretics", priority: "5" },
  },

  {
    id: "ap1-w5d-055",
    type: "mcq",
    prompt: "Which class is correctly paired with its primary tubule site of action?",
    setup: "",
    ans: [
      { t: "Loops act at the thick ascending limb", ok: true },
      { t: "Thiazides act at the proximal tubule too", ok: false },
      { t: "Carbonic inhibitors act at the loop", ok: false },
      { t: "Aldosterone blockers act at the loop", ok: false },
    ],
    rationale: "Loop diuretics block the Na-K-2Cl cotransporter in the thick ascending limb, making them the most potent class. Thiazides act in the distal convoluted tubule, carbonic anhydrase inhibitors in the proximal tubule, and aldosterone antagonists in the collecting duct. Pearl: match the class to its segment, loops own the thick ascending limb.", // source: Diuretics deck slide 43
    scene: "pharmacology",
    sceneCfg: { label: "CLASS BY SITE" },
    metadata: { topic: "Diuretic sites", priority: "5" },
  },

  {
    id: "ap1-w5d-056",
    type: "mcq",
    prompt: "Each pairing of class and site is correct EXCEPT which one?",
    setup: "",
    ans: [
      { t: "Thiazides at the collecting duct", ok: true },
      { t: "Loops at the thick ascending limb", ok: false },
      { t: "Spironolactone at the collecting duct", ok: false },
      { t: "Acetazolamide at the proximal tubule", ok: false },
    ],
    rationale: "Thiazides act in the distal convoluted tubule, not the collecting duct, so that pairing is the false one. Loops work at the thick ascending limb, spironolactone at the collecting duct mineralocorticoid receptor, and acetazolamide at the proximal tubule. Pearl: thiazides are distal convoluted tubule drugs, not collecting duct drugs.", // source: Diuretics deck slide 43
    scene: "pharmacology",
    sceneCfg: { label: "SITE EXCEPTION" },
    metadata: { topic: "Diuretic sites", priority: "4" },
  },

  {
    id: "ap1-w5d-057",
    type: "mcq",
    prompt: "Why does blocking sodium reabsorption upstream lead to hypokalemia?",
    setup: "",
    ans: [
      { t: "More distal Na drives K secretion", ok: true },
      { t: "Less distal Na drives K secretion", ok: false },
      { t: "Direct blockade of K channels", ok: false },
      { t: "Aldosterone falls and spares K", ok: false },
    ],
    rationale: "When an upstream diuretic blocks sodium reabsorption, more sodium reaches the collecting duct, and its uptake there creates a lumen-negative voltage that drives potassium secretion into the urine. The increased distal sodium delivery is the engine of the potassium loss. Pearl: upstream sodium blockade dumps sodium distally, and that sodium pulls potassium out into the urine.", // source: Diuretics deck slide 42
    scene: "pharmacology",
    sceneCfg: { label: "DISTAL NA K LINK" },
    metadata: { topic: "Electrolyte effects", priority: "5" },
  },

  {
    id: "ap1-w5d-058",
    type: "mcq",
    prompt: "A diuretic acting upstream of the collecting duct produces which electrolyte and acid-base fingerprint?",
    setup: "",
    ans: [
      { t: "Low potassium with alkalosis", ok: true },
      { t: "High potassium with acidosis", ok: false },
      { t: "Low potassium with acidosis", ok: false },
      { t: "High potassium with alkalosis", ok: false },
    ],
    rationale: "Drugs acting upstream of the collecting duct deliver extra sodium distally, driving potassium and hydrogen loss, so they lower potassium and cause metabolic alkalosis. Collecting duct agents do the opposite, raising potassium with acidosis. Pearl: upstream means low potassium and alkalosis, collecting duct means high potassium and acidosis.", // source: Diuretics deck slide 44
    scene: "pharmacology",
    sceneCfg: { label: "UNIVERSAL RULE" },
    metadata: { topic: "Electrolyte effects", priority: "5" },
  },

  {
    id: "ap1-w5d-059",
    type: "mcq",
    prompt: "A drug acting at the collecting duct on sodium channels or aldosterone receptors produces which fingerprint?",
    setup: "",
    ans: [
      { t: "High potassium with acidosis", ok: true },
      { t: "Low potassium with alkalosis", ok: false },
      { t: "High potassium with alkalosis", ok: false },
      { t: "Low potassium with acidosis", ok: false },
    ],
    rationale: "Collecting duct agents reduce sodium uptake at the very site where potassium and hydrogen are normally secreted, so they retain potassium and hydrogen, producing hyperkalemia with metabolic acidosis. Upstream agents instead lower potassium with alkalosis. Pearl: the collecting duct is where potassium-sparing agents trade natriuresis for hyperkalemia and acidosis.", // source: Diuretics deck slide 44
    scene: "pharmacology",
    sceneCfg: { label: "COLLECTING DUCT FINGERPRINT" },
    metadata: { topic: "Electrolyte effects", priority: "4" },
  },

  {
    id: "ap1-w5d-060",
    type: "mcq",
    prompt: "When refractory hypokalemia persists in a diuretic-treated patient, which step is essential?",
    setup: "",
    ans: [
      { t: "Replace magnesium first", ok: true },
      { t: "Replace serum calcium first", ok: false },
      { t: "Withhold all potassium fully", ok: false },
      { t: "Add another loop diuretic", ok: false },
    ],
    rationale: "Hypomagnesemia promotes renal potassium wasting and makes hypokalemia resistant to potassium replacement, so magnesium must be corrected first. Without restoring magnesium, the potassium deficit will not resolve. Pearl: chase the magnesium before the potassium when hypokalemia refuses to budge.", // source: Diuretics deck slide 45
    scene: "pharmacology",
    sceneCfg: { label: "MAGNESIUM FIRST" },
    metadata: { topic: "Perioperative diuretics", priority: "5" },
  },

  {
    id: "ap1-w5d-061",
    type: "mcq",
    prompt: "Which perioperative interaction of loop and thiazide diuretics is most relevant to neuromuscular blockade?",
    setup: "",
    ans: [
      { t: "They potentiate nondepolarizing NMB", ok: true },
      { t: "They shorten nondepolarizing NMB action", ok: false },
      { t: "They reverse depolarizing NMB action", ok: false },
      { t: "They fully block all NMB drug action", ok: false },
    ],
    rationale: "Loop and thiazide diuretics can potentiate nondepolarizing neuromuscular blockers, partly through electrolyte effects, prolonging paralysis. This warrants careful monitoring of recovery. Pearl: loops and thiazides deepen and lengthen nondepolarizing blockade.", // source: Diuretics deck slide 45
    scene: "pharmacology",
    sceneCfg: { label: "NMB POTENTIATION" },
    metadata: { topic: "Perioperative diuretics", priority: "4" },
  },

  {
    id: "ap1-w5d-062",
    type: "mcq",
    prompt: "Why is mannitol a poor choice in established renal failure?",
    setup: "",
    ans: [
      { t: "No filtration causes accumulation", ok: true },
      { t: "Rapid filtration causes diuresis", ok: false },
      { t: "It is destroyed by the liver", ok: false },
      { t: "It binds tubular potassium tightly", ok: false },
    ],
    rationale: "Mannitol works only after being filtered at the glomerulus, so in renal failure it is not filtered, accumulates in plasma, and expands intravascular volume rather than producing diuresis. This accumulation can precipitate pulmonary edema. Pearl: no glomerular filtration means mannitol piles up instead of working.", // source: Diuretics deck slide 45
    scene: "pharmacology",
    sceneCfg: { label: "MANNITOL IN FAILURE" },
    metadata: { topic: "Perioperative diuretics", priority: "4" },
  },

  {
    id: "ap1-w5d-063",
    type: "mcq",
    prompt: "In a patient taking lithium, which perioperative diuretic effect raises toxicity concern?",
    setup: "",
    ans: [
      { t: "Reduced lithium clearance", ok: true },
      { t: "Increased lithium clearance", ok: false },
      { t: "Direct lithium receptor block", ok: false },
      { t: "Faster lithium hepatic metabolism", ok: false },
    ],
    rationale: "Diuretics decrease renal clearance of lithium, raising serum levels toward the toxic range, a hazard heightened by perioperative volume shifts. Lithium concentrations should be watched in these patients. Pearl: diuretics hold onto lithium, pushing levels toward toxicity perioperatively.", // source: Diuretics deck slide 45
    scene: "pharmacology",
    sceneCfg: { label: "LITHIUM CLEARANCE" },
    metadata: { topic: "Perioperative diuretics", priority: "4" },
  },

];
