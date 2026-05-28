// Synthesis-tier recall questions — patho-node-15 (Urine Concentration & Dilution / Electrolyte Regulation)
// Course: adv-phys-path-1, Chapters 29–30, Guyton & Hall 14e
// 8 synthesis questions with feeder atom dependencies

export const RECALL_QUESTIONS_PATHOPHYSIOLOGY_1 = [

  // 1. Countercurrent Mechanism + ADH → Urine Concentration/Dilution
  {
    id: 'r-p1-n15-1',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p1n15-countercurrent-single-effect', 'atom-p1n15-adh-aqp2-mechanism'],
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'A healthy adult can produce urine ranging from 50 mOsm/L to 1200 mOsm/L. Explain the countercurrent multiplier mechanism that builds the medullary osmotic gradient and describe how ADH determines whether the final urine is dilute or concentrated. Include the key transporter in the thick ascending limb and the water channel ADH controls.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The thick ascending limb actively transports NaCl out of the tubular lumen via the NKCC2 (Na/K/2Cl) cotransporter while remaining completely impermeable to water. This creates a "single effect" of approximately 200 mOsm/L concentration difference between the tubular fluid and the medullary interstitium at each horizontal level. The hairpin geometry of the loop of Henle multiplies this single effect along its length, building a corticomedullary gradient from 300 mOsm/L at the cortex to 1200 mOsm/L at the papillary tip. Urea recycling through UT-A1 and UT-A3 transporters contributes approximately half of the inner medullary osmolarity.' },  // source: patho-n15-003, 004, 005, 023, 027
        { id: 'kp2', weight: 2, description: 'ADH (vasopressin) binds V2 receptors on the basolateral membrane of principal cells in the late distal tubule and collecting duct. This activates a cAMP signaling cascade that triggers insertion of aquaporin 2 (AQP2) water channels into the luminal membrane. When AQP2 channels are present, water moves by osmosis from the tubular lumen into the hypertonic medullary interstitium, concentrating the urine to a maximum of 1200 to 1400 mOsm/L. Without ADH, the collecting duct remains water impermeable and the dilute fluid from the ascending limb (approximately 100 mOsm/L) passes through, producing a minimum urine of approximately 50 mOsm/L.' },  // source: patho-n15-007, 001, 002
        { id: 'kp3', weight: 1, description: 'The descending thin limb is highly permeable to water (via aquaporin 1) but impermeable to NaCl. Water exits by osmosis into the hypertonic interstitium, concentrating the tubular fluid as it descends. The ascending limb is the opposite: impermeable to water but actively removes NaCl. This asymmetric permeability is essential for the countercurrent mechanism to function.' },  // source: patho-n15-004, 005
      ],
      common_errors: [
        'Stating that ADH acts on the proximal tubule or ascending limb (ADH receptors are on the late distal tubule and collecting duct only)',
        'Confusing the countercurrent multiplier (loop of Henle, active process) with the countercurrent exchanger (vasa recta, passive process that preserves the gradient)',
        'Attributing the entire medullary gradient to NaCl alone without mentioning the contribution of urea recycling',
      ],
      minimum_passing_score: 60,
    },
    topic: 'countercurrent-and-adh',
    chapter: 'patho-node-15',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 29',
      topic: 'countercurrent-and-adh',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 2. ADH Regulation — Osmotic vs Hemodynamic vs Pharmacologic
  {
    id: 'r-p1-n15-2',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p1n15-osmotic-adh-stimulus', 'atom-p1n15-hemodynamic-adh-stimulus'],
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Compare the three categories of stimuli that control ADH secretion: osmotic, hemodynamic (volume/pressure), and pharmacologic/non-osmotic. For each category, identify the receptor or pathway, the threshold sensitivity, and give clinically relevant examples. Explain which pathway is most sensitive and why this matters perioperatively.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The osmotic pathway is the most sensitive stimulus for ADH release. Hypothalamic osmoreceptors detect changes as small as 1 to 2% in plasma osmolarity (approximately 2 to 3 mOsm/L above the threshold of 280 mOsm/L). When osmolarity rises, osmoreceptors shrink and increase firing rate, stimulating ADH release from the posterior pituitary. This pathway provides fine, continuous control of extracellular osmolarity under normal conditions.' },  // source: patho-n15-010, 009, 030
        { id: 'kp2', weight: 1, description: 'The hemodynamic pathway requires larger changes (5 to 10% decrease in blood volume or blood pressure) to significantly alter ADH secretion. Decreased blood volume is sensed by cardiopulmonary (low pressure) baroreceptors in the atria and pulmonary vessels, while decreased blood pressure is sensed by arterial baroreceptors in the carotid sinus and aortic arch. However, when large hemodynamic changes occur (such as hemorrhagic shock), this pathway can produce very high ADH levels that override the osmotic set point.' },  // source: patho-n15-025, 030
        { id: 'kp3', weight: 1, description: 'Non-osmotic, non-hemodynamic stimuli include nausea (which can raise ADH up to 100 fold and is the most potent non-osmotic stimulus), morphine, nicotine, fear/pain (cerebral cortex input), and angiotensin II. Inhibitors of ADH include alcohol (ethanol), clonidine, haloperidol, increased blood volume, and decreased osmolarity. Perioperatively, morphine and nausea can both cause significant ADH release, contributing to oliguria and water retention that may be mistaken for hypovolemia.' },  // source: patho-n15-011, 012, 013, 024, 029
        { id: 'kp4', weight: 1, description: 'ADH is synthesized in magnocellular neurons of the supraoptic and paraventricular nuclei of the hypothalamus and transported down axons to the posterior pituitary (neurohypophysis) for storage in secretory vesicles and release into the systemic circulation. This anatomic detail is clinically important because damage to either the hypothalamus or posterior pituitary from trauma, surgery, or tumors can cause central diabetes insipidus with loss of ADH production.' },  // source: patho-n15-008
      ],
      common_errors: [
        'Stating that hemodynamic stimuli are more sensitive than osmotic stimuli (osmotic is far more sensitive at 1 to 2% vs 5 to 10%)',
        'Claiming alcohol stimulates ADH (it inhibits ADH, which is why it causes diuresis)',
        'Forgetting that morphine stimulates ADH and attributing all perioperative oliguria to hemodynamic factors alone',
      ],
      minimum_passing_score: 60,
    },
    topic: 'adh-regulation',
    chapter: 'patho-node-15',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 29',
      topic: 'adh-regulation',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 3. ADH-Thirst Dominance + Diabetes Insipidus
  {
    id: 'r-p1-n15-3',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p1n15-adh-thirst-dominance', 'atom-p1n15-di-central-vs-nephrogenic'],
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Explain why the ADH-thirst osmoreceptor system, not the aldosterone system, is the dominant controller of plasma sodium concentration and extracellular osmolarity. Then describe the two major types of diabetes insipidus (central and nephrogenic), their distinguishing features, and how the DDAVP test differentiates them.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The ADH-thirst osmoreceptor system controls plasma sodium concentration by adjusting water balance. When osmolarity rises, ADH increases collecting duct water permeability (concentrating urine and retaining water) while thirst drives water intake, both diluting the ECF back toward normal. Experimental blockade of this system causes plasma sodium to become highly sensitive to dietary sodium intake, swinging dramatically with changes in salt consumption. In contrast, blocking aldosterone alone causes negligible changes in plasma sodium because the intact ADH-thirst system compensates. Aldosterone primarily controls sodium balance and ECF volume rather than sodium concentration.' },  // source: patho-n15-020, 021, 022
        { id: 'kp2', weight: 1, description: 'Central diabetes insipidus results from failure to produce or release ADH, typically from damage to the hypothalamus or posterior pituitary (trauma, surgery, tumors, autoimmune destruction). Patients produce large volumes of very dilute urine (urine osmolarity well below plasma osmolarity) and develop hypernatremia if water intake is insufficient. Serum ADH levels are low or undetectable.' },  // source: patho-n15-015
        { id: 'kp3', weight: 1, description: 'Nephrogenic diabetes insipidus occurs when the collecting duct fails to respond to ADH despite normal or elevated ADH levels. Common causes include chronic lithium therapy (which impairs AQP2 expression), genetic mutations in V2 receptors or aquaporin 2 channels, and chronic kidney disease. Serum ADH levels are elevated because the feedback loop detects persistent dilute urine and attempts to compensate.' },  // source: patho-n15-016
        { id: 'kp4', weight: 1, description: 'The DDAVP (desmopressin) test differentiates the two types: in central DI, administering exogenous DDAVP (a synthetic ADH analog) produces a dramatic increase in urine osmolarity because the collecting duct receptors and AQP2 channels function normally. In nephrogenic DI, DDAVP has minimal effect on urine concentration because the tubular cells cannot respond to ADH signaling.' },  // source: patho-n15-015, 016
      ],
      common_errors: [
        'Stating aldosterone is the primary controller of plasma sodium concentration (aldosterone controls volume; ADH-thirst controls concentration)',
        'Confusing central DI (low ADH, responds to DDAVP) with nephrogenic DI (high ADH, does not respond to DDAVP)',
        'Forgetting that lithium is the most common drug cause of nephrogenic DI',
      ],
      minimum_passing_score: 60,
    },
    topic: 'adh-thirst-and-di',
    chapter: 'patho-node-15',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 29',
      topic: 'adh-thirst-and-di',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 4. Potassium Distribution + Transcellular Shifts
  {
    id: 'r-p1-n15-4',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p1n15-k-distribution', 'atom-p1n15-k-shift-acidosis'],
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Describe the distribution of potassium between intracellular and extracellular compartments, then explain the major factors that shift potassium between these compartments. For a patient with a pH of 7.15 and K+ of 6.2 mEq/L, explain the mechanism of the hyperkalemia and predict what will happen to the K+ level as the acidosis is corrected.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Approximately 98% of total body potassium (about 3920 mEq) resides intracellularly at a concentration of 140 mEq/L, while only 2% (about 59 mEq) is in the extracellular fluid at 4.2 mEq/L. The Na/K ATPase pump on cell membranes actively maintains this massive concentration gradient by pumping 3 Na+ out and 2 K+ in. Because the ECF K+ pool is so small, even minor shifts of K+ between compartments produce clinically significant changes in plasma concentration.' },  // source: patho-n15-032, 031
        { id: 'kp2', weight: 2, description: 'Factors that drive K+ INTO cells (lowering plasma K+) include insulin (stimulates Na/K ATPase activity), beta 2 adrenergic stimulation (activates Na/K ATPase in skeletal muscle), aldosterone (enhances Na/K ATPase), and alkalosis (H+ exits cells, K+ enters to maintain electroneutrality). Factors that drive K+ OUT of cells (raising plasma K+) include metabolic acidosis (H+ enters cells, K+ exits), cell lysis or tissue damage, beta adrenergic blockade, and exercise. The clinical significance is that these shift phenomena change plasma K+ independently of changes in total body potassium stores.' },  // source: patho-n15-033, 034, 060
        { id: 'kp3', weight: 2, description: 'In the acidotic patient (pH 7.15, K+ 6.2), the hyperkalemia is caused by transcellular shift: excess H+ ions move into cells to be buffered by intracellular proteins, and to maintain electroneutrality, K+ ions are displaced out of cells into the extracellular fluid. The approximate rule is that plasma K+ rises 0.6 mEq/L for each 0.1 unit decrease in pH. As the acidosis is corrected (pH rises back toward 7.40), H+ exits cells and K+ returns to the intracellular compartment, and the plasma K+ will fall. If the patient is also K+ depleted from renal losses, correcting the acidosis may unmask severe hypokalemia.' },  // source: patho-n15-034
      ],
      common_errors: [
        'Confusing the direction of the shift: acidosis moves K+ OUT of cells (hyperkalemia), alkalosis moves K+ INTO cells (hypokalemia)',
        'Forgetting that the transcellular shift changes plasma K+ without changing total body K+ stores',
        'Stating that insulin causes hyperkalemia (insulin drives K+ into cells and is used therapeutically to treat hyperkalemia)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'k-distribution-and-shifts',
    chapter: 'patho-node-15',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 30',
      topic: 'k-distribution-and-shifts',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 5. Renal K+ Handling + Principal Cells + Aldosterone Feedback
  {
    id: 'r-p1-n15-5',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p1n15-principal-cell-k-secretion', 'atom-p1n15-aldosterone-k-feedback'],
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Describe how principal cells in the cortical collecting duct secrete potassium, how aldosterone modulates this process through a negative feedback loop, and how tubular flow rate affects K+ excretion. Then explain why loop diuretics cause hypokalemia while potassium-sparing diuretics cause hyperkalemia.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Principal cells secrete K+ through a two-step mechanism. First, Na+ enters the cell from the tubular lumen through ENaC (epithelial sodium channel), driven by the low intracellular Na+ maintained by basolateral Na/K ATPase. Na+ entry makes the lumen electrically negative relative to the cell interior. Second, this favorable electrochemical gradient drives K+ exit from the cell into the lumen through ROMK (renal outer medullary K+) channels for basal secretion and BK (big conductance K+) channels that are activated by increased flow. The basolateral Na/K ATPase simultaneously pumps K+ into the cell from the interstitium, maintaining high intracellular K+ for continued secretion.' },  // source: patho-n15-035
        { id: 'kp2', weight: 1, description: 'Aldosterone creates a negative feedback loop for K+ homeostasis. When plasma K+ rises even slightly above 4.2 mEq/L, the adrenal cortex zona glomerulosa directly senses this elevation and increases aldosterone secretion. Aldosterone then acts on principal cells to upregulate ENaC (increasing Na+ entry and luminal negativity), increase Na/K ATPase expression (raising intracellular K+ and lowering intracellular Na+), and increase ROMK channel density. All three effects enhance K+ secretion into the tubular lumen, returning plasma K+ toward normal. This is independent of the angiotensin II pathway for aldosterone stimulation.' },  // source: patho-n15-036
        { id: 'kp3', weight: 1, description: 'Increased distal tubular flow rate promotes K+ loss because rapid fluid movement past principal cells washes away secreted K+ from the luminal surface. This maintains a steep concentration gradient from cell interior (high K+) to lumen (low K+), favoring continued K+ secretion. Flow also activates BK channels specifically. This flow dependent mechanism is why loop diuretics cause hypokalemia: by blocking NKCC2 in the ascending limb, they increase distal delivery volume and flow rate, and the resulting volume depletion activates aldosterone, both of which enhance K+ secretion.' },  // source: patho-n15-055, 038
        { id: 'kp4', weight: 1, description: 'Potassium-sparing diuretics cause hyperkalemia through two mechanisms. Spironolactone and eplerenone block the mineralocorticoid (aldosterone) receptor, preventing aldosterone from upregulating ENaC and Na/K ATPase. Amiloride and triamterene directly block ENaC. Both approaches reduce Na+ entry into principal cells, which reduces the electrochemical driving force for K+ secretion, causing K+ retention and hyperkalemia.' },  // source: patho-n15-037
      ],
      common_errors: [
        'Confusing principal cells (secrete K+) with Type A intercalated cells (reabsorb K+ via H/K ATPase)',
        'Stating that K+ directly stimulates renin release (K+ stimulates adrenal cortex aldosterone directly, independent of renin)',
        'Forgetting the flow rate component: loop diuretics cause K+ loss through both aldosterone activation AND increased distal flow',
      ],
      minimum_passing_score: 60,
    },
    topic: 'renal-k-handling',
    chapter: 'patho-node-15',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 30',
      topic: 'renal-k-handling',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 6. Potassium Disorders — Cardiac Effects + Clinical Causes
  {
    id: 'r-p1-n15-6',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p1n15-hyperkalemia-cardiac', 'atom-p1n15-hypokalemia-effects'],
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Describe the cardiac and neuromuscular effects of severe hyperkalemia (greater than 7.0 mEq/L) and severe hypokalemia (less than 3.0 mEq/L), explaining the membrane potential mechanism for each. Then list at least three causes of each disorder.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Severe hyperkalemia (>7.0 mEq/L) reduces the K+ concentration gradient across cell membranes, which depolarizes (makes less negative) the resting membrane potential. This persistent partial depolarization inactivates voltage-gated Na+ channels, slowing cardiac conduction velocity and reducing action potential amplitude. The ECG progression shows peaked T waves, prolonged PR interval, widened QRS complex, loss of P waves, and a sine wave pattern that can degenerate into ventricular fibrillation or asystole. Neuromuscularly, initial hyperexcitability may be followed by paralysis as Na+ channels become completely inactivated.' },  // source: patho-n15-039
        { id: 'kp2', weight: 2, description: 'Severe hypokalemia (<3.0 mEq/L) increases the K+ concentration gradient across cell membranes, which hyperpolarizes (makes more negative) the resting membrane potential. Hyperpolarized cells require a larger stimulus to reach the threshold for depolarization, making them less excitable. This produces skeletal muscle weakness, fatigue, cramping, and in severe cases respiratory muscle weakness causing hypoventilation. Cardiac effects include delayed ventricular repolarization (prolonged QT interval, prominent U waves, flattened T waves) and increased susceptibility to arrhythmias including torsades de pointes.' },  // source: patho-n15-040
        { id: 'kp3', weight: 1, description: 'Causes of hyperkalemia include renal failure (decreased excretion), potassium-sparing diuretics (spironolactone blocking aldosterone, amiloride blocking ENaC), Addison disease (aldosterone deficiency), metabolic acidosis (transcellular shift out of cells), massive tissue injury or hemolysis (intracellular K+ release), and beta-adrenergic blockade (impaired cellular uptake). Causes of hypokalemia include loop diuretics (increased distal flow and aldosterone activation), GI losses (diarrhea, vomiting), metabolic alkalosis (transcellular shift into cells), insulin excess, primary aldosteronism (Conn syndrome), and osmotic diuretics.' },  // source: patho-n15-037, 038, 059
      ],
      common_errors: [
        'Confusing the direction of membrane potential change: hyperkalemia DEPOLARIZES (less negative), hypokalemia HYPERPOLARIZES (more negative)',
        'Stating that hyperkalemia causes hyperpolarization and increased excitability (the opposite is true)',
        'Listing alkalosis as a cause of hyperkalemia (alkalosis shifts K+ INTO cells, causing hypokalemia)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'k-disorders-clinical',
    chapter: 'patho-node-15',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 30',
      topic: 'k-disorders-clinical',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 7. Pressure Natriuresis + Salt Sensitivity + Hypertension
  {
    id: 'r-p1-n15-7',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p1n15-pressure-natriuresis', 'atom-p1n15-salt-sensitivity-shift'],
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Explain the pressure natriuresis mechanism (both acute and chronic), how a rightward shift of the pressure natriuresis curve causes salt-sensitive hypertension, and describe at least three clinical conditions that produce this rightward shift. Include how angiotensin II affects the curve and the role of nephron loss.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Pressure natriuresis is the direct relationship between arterial pressure and renal sodium/water excretion. When arterial pressure rises, the kidney excretes more sodium and water, reducing ECF volume, blood volume, venous return, cardiac output, and ultimately returning arterial pressure toward normal. The acute mechanism involves slightly increased GFR and increased peritubular capillary hydrostatic pressure reducing proximal reabsorption. The chronic curve is much steeper because sustained pressure increases suppress the renin-angiotensin-aldosterone system: decreased angiotensin II reduces proximal tubule sodium reabsorption, and decreased aldosterone reduces distal sodium reabsorption, amplifying the direct pressure effect.' },  // source: patho-n15-045, 046
        { id: 'kp2', weight: 2, description: 'A rightward shift of the pressure natriuresis curve means the kidney requires a higher arterial pressure to excrete any given sodium load. At the intersection of the sodium intake line and the shifted excretion curve, the steady state blood pressure is elevated. The sequence is: impaired excretion at normal pressure causes sodium retention, ECF volume expansion, increased blood volume, increased mean circulatory filling pressure, increased venous return, increased cardiac output, and rising arterial pressure until excretion again equals intake at a new higher equilibrium pressure. This is volume-dependent hypertension.' },  // source: patho-n15-049, 052, 058
        { id: 'kp3', weight: 1, description: 'Clinical conditions that shift the curve rightward include loss of functional nephrons (CKD, aging), elevated angiotensin II (renovascular hypertension from renal artery stenosis stimulating renin), primary aldosteronism (autonomous aldosterone increasing distal Na+ reabsorption), diabetes mellitus (damaging renal vasculature), genetic conditions (Liddle syndrome with constitutively active ENaC), and older age (progressive age-related nephron loss). Angiotensin II specifically shifts the curve rightward by increasing proximal tubule Na+ reabsorption and stimulating aldosterone secretion.' },  // source: patho-n15-050, 051, 057
      ],
      common_errors: [
        'Confusing salt sensitivity (rightward shift) with salt resistance (normal steep curve that handles increased sodium intake without significant BP change)',
        'Stating that autoregulation prevents any change in GFR with pressure changes (autoregulation is imperfect and chronic changes in Ang II/aldosterone contribute more than GFR changes)',
        'Forgetting that the chronic natriuresis curve is steeper than the acute curve because of RAAS suppression',
      ],
      minimum_passing_score: 60,
    },
    topic: 'pressure-natriuresis-hypertension',
    chapter: 'patho-node-15',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 30',
      topic: 'pressure-natriuresis-hypertension',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 8. CKD Cascade + Integrated HF/Cirrhosis Na+ Retention
  {
    id: 'r-p1-n15-8',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p1n15-pth-three-actions', 'atom-p1n15-ckd-phosphate-cascade'],
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Describe the pathophysiologic cascade in chronic kidney disease that leads from nephron loss to secondary hyperparathyroidism and renal osteodystrophy. Include the three actions of PTH. Then compare the mechanisms of sodium retention in heart failure and hepatic cirrhosis, explaining why both conditions produce edema despite different primary pathology.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'In CKD, decreased nephron number impairs phosphate excretion, leading to hyperphosphatemia. Elevated phosphate complexes with ionized calcium in the blood, lowering plasma ionized Ca2+. The parathyroid glands detect this hypocalcemia via calcium-sensing receptors and increase PTH secretion (secondary hyperparathyroidism). Chronically elevated PTH promotes ongoing bone resorption to maintain serum calcium, leading to renal osteodystrophy (weakened, brittle bones with high fracture risk). CKD also impairs 1-alpha-hydroxylase activity in the kidney, reducing conversion of 25-hydroxyvitamin D to active 1,25-dihydroxyvitamin D3, further worsening hypocalcemia and reducing intestinal calcium absorption.' },  // source: patho-n15-042
        { id: 'kp2', weight: 1, description: 'PTH has three coordinated actions to raise plasma calcium: (1) increases renal Ca2+ reabsorption in the distal tubule (reducing urinary calcium loss), (2) stimulates osteoclast-mediated bone resorption (releasing Ca2+ and phosphate from bone mineral), and (3) activates renal 1-alpha-hydroxylase to produce active vitamin D3 (calcitriol), which increases intestinal Ca2+ absorption from dietary sources. PTH also has a phosphaturic effect (decreases renal phosphate reabsorption) that prevents the Ca2+ x PO4 product from rising to dangerous levels.' },  // source: patho-n15-041
        { id: 'kp3', weight: 1, description: 'In heart failure, decreased cardiac output reduces arterial pressure and renal perfusion. The kidneys interpret this as volume depletion and activate sodium-retaining mechanisms: RAAS activation (increased angiotensin II and aldosterone increase tubular Na+ reabsorption), increased sympathetic nerve activity to the kidney (vasoconstriction and enhanced proximal reabsorption), decreased GFR, and increased peritubular reabsorption from decreased peritubular capillary hydrostatic pressure. The retained sodium and water expand ECF volume, creating a vicious cycle because the failing heart cannot handle the additional preload.' },  // source: patho-n15-053
        { id: 'kp4', weight: 1, description: 'In hepatic cirrhosis, the liver produces less albumin, reducing plasma oncotic pressure. Fluid leaks from capillaries into the interstitium and peritoneal cavity (ascites). Simultaneously, portal hypertension causes splanchnic vasodilation, which increases total vascular capacity. Both mechanisms reduce effective circulating blood volume despite total body fluid overload. The kidneys sense this reduced effective volume and activate the same retention reflexes as heart failure (RAAS, sympathetic activation, ADH increase), creating a paradox of sodium and water retention in a patient who already has excess total body fluid.' },  // source: patho-n15-054
      ],
      common_errors: [
        'Stating that PTH causes hypocalcemia (PTH RAISES calcium through its three actions; the hypocalcemia in CKD is from phosphate retention)',
        'Confusing primary hyperparathyroidism (autonomous PTH secretion, usually adenoma) with secondary hyperparathyroidism (compensatory PTH elevation in response to chronic hypocalcemia)',
        'Assuming cirrhosis and heart failure have the same sodium retention mechanism (HF has decreased cardiac output; cirrhosis has decreased oncotic pressure and increased vascular capacity)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ckd-hf-cirrhosis-integration',
    chapter: 'patho-node-15',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 30',
      topic: 'ckd-hf-cirrhosis-integration',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

];
