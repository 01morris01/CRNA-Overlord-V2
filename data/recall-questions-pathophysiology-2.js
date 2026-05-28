// Synthesis-tier recall questions — pp2-wk-1 (Acid-Base Regulation / Diuretics & Kidney Diseases)
// Course: adv-phys-path-2, Chapters 31–32, Guyton & Hall 14e
// 8 synthesis questions with feeder atom dependencies

export const RECALL_QUESTIONS_PATHOPHYSIOLOGY_2 = [

  // 1. Buffer Systems & Henderson-Hasselbalch Integration
  {
    id: 'r-p2-wk1-1',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w1-bicarbonate-buffer-superiority', 'atom-p2w1-henderson-hasselbalch'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Explain why the bicarbonate buffer system is considered the most important extracellular buffer despite its pK of 6.1 being far from physiologic pH. Include the Henderson-Hasselbalch equation with its specific constants, describe how lungs and kidneys independently regulate the two components, and explain why intracellular buffers still handle the majority of total body buffering.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The Henderson-Hasselbalch equation for the bicarbonate system is pH = 6.1 + log([HCO3-] / 0.03 x PCO2). The pK is 6.1 and the solubility coefficient alpha of 0.03 converts PCO2 in mm Hg to dissolved CO2 concentration in mmol per liter. At normal values (HCO3- = 24 mEq/L, PCO2 = 40 mm Hg), the ratio of HCO3- to dissolved CO2 is 20:1, yielding a pH of 7.4. The student must state the equation with correct constants to earn full credit on this point.' },
        { id: 'kp2', weight: 2, description: 'The bicarbonate buffer system derives its power not from its pK (which is far from 7.4) but from the fact that both components are independently regulated by separate organ systems. The lungs control the denominator (dissolved CO2) by adjusting ventilation within minutes, while the kidneys control the numerator (HCO3-) by adjusting H+ secretion and bicarbonate reabsorption over hours to days. This dual organ regulation makes the effective buffering capacity far greater than any closed chemical system operating at pK 6.1 would predict.' },
        { id: 'kp3', weight: 1, description: 'Despite the importance of extracellular bicarbonate buffering, intracellular buffers (primarily proteins, hemoglobin, and organic phosphates) account for 60 to 70 percent of total body chemical buffering capacity. The remaining 30 to 40 percent occurs extracellularly. This large intracellular contribution reflects the enormous mass of intracellular protein and the high concentration of organic phosphates inside cells.' },
      ],
      common_errors: [
        'Stating that the pK of 6.1 makes bicarbonate an inherently good chemical buffer at pH 7.4 (it does not; its power comes from organ regulation, not chemical properties)',
        'Forgetting the solubility coefficient of 0.03 or confusing it with a different constant',
        'Claiming that extracellular buffers handle the majority of total body buffering (intracellular buffers handle 60 to 70 percent)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'buffer-systems-and-hh',
    chapter: 'pp2-wk-1',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 31',
      topic: 'buffer-systems-and-hh',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 2. Renal H+ Secretion Mechanisms (Segmental)
  {
    id: 'r-p2-wk1-2',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w1-proximal-tubule-nhe3', 'atom-p2w1-type-a-intercalated-cells'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'The kidneys secrete approximately 4,400 mmol of H+ per day. Describe the segmental distribution of H+ secretion along the nephron, identifying the primary transporter at each segment. Distinguish between H+ secretion that reclaims filtered HCO3- and H+ secretion that generates new HCO3-. Explain the role of Type A versus Type B intercalated cells.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Total renal H+ secretion is approximately 4,400 mmol per day. The vast majority (about 4,320 mmol) is used to reabsorb filtered HCO3-, which is not net acid excretion but rather prevention of bicarbonate loss. Only approximately 80 mmol per day represents net new acid excretion, matching daily non-volatile acid production. The proximal tubule reabsorbs 85 percent of filtered HCO3- via the Na+/H+ exchanger NHE3, the thick ascending limb reabsorbs 10 percent, and the distal nephron handles the remaining fraction greater than 4.9 percent.' },
        { id: 'kp2', weight: 2, description: 'Type A intercalated cells in the collecting duct secrete H+ into the lumen using two apical pumps: a vacuolar H+ ATPase (primary) and an H+/K+ ATPase (secondary, which also reabsorbs K+). The basolateral side has a Cl-/HCO3- exchanger that returns newly generated bicarbonate to the blood. Type A cells dominate during acidosis and are responsible for fine tuning of final urine pH. They are stimulated by elevated PCO2, low HCO3-, aldosterone, and hypokalemia.' },
        { id: 'kp3', weight: 1, description: 'Type B intercalated cells have the opposite transporter polarity compared to Type A cells. Type B cells place the H+ ATPase on the basolateral membrane (secreting H+ into blood) and the Cl-/HCO3- exchanger (pendrin) on the apical membrane (secreting HCO3- into the lumen). Type B cells dominate during alkalosis, allowing the kidney to excrete excess bicarbonate and correct the alkalotic state.' },
        { id: 'kp4', weight: 1, description: 'In the proximal tubule, H+ secreted by NHE3 combines with filtered HCO3- in the lumen to form carbonic acid (H2CO3), which is rapidly dehydrated to CO2 and H2O by brush border carbonic anhydrase IV. The CO2 diffuses into the cell where intracellular carbonic anhydrase II regenerates H+ and HCO3-. The H+ is recycled to the lumen and the HCO3- exits basolaterally via Na+/HCO3- cotransporter (NBC1). This indirect process reclaims filtered bicarbonate rather than generating new base.' },
      ],
      common_errors: [
        'Confusing total H+ secretion (4,400 mmol/day) with net acid excretion (only 80 mmol/day)',
        'Placing NHE3 in the collecting duct instead of the proximal tubule',
        'Stating that Type B intercalated cells secrete H+ into the lumen (they secrete HCO3- into the lumen)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'renal-h-secretion-mechanisms',
    chapter: 'pp2-wk-1',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 31',
      topic: 'renal-h-secretion-mechanisms',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 3. New HCO3- Generation: Phosphate & Ammonia Buffering
  {
    id: 'r-p2-wk1-3',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w1-phosphate-tubular-buffering', 'atom-p2w1-glutamine-ammonia-system'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Explain how the kidney generates new bicarbonate through phosphate buffering (titratable acid) and ammonia buffering. For each pathway, describe the reaction, the nephron segment involved, and the net effect on acid-base balance. Explain why ammonia excretion is the dominant adaptive mechanism during chronic acidosis and include specific quantitative changes.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Phosphate buffering: filtered NaHPO4- in the tubular lumen accepts a secreted H+ to form NaH2PO4 (titratable acid). For every H+ buffered by phosphate, one new HCO3- is generated inside the tubular cell (from CO2 + H2O via carbonic anhydrase) and returned to the blood via the basolateral Cl-/HCO3- exchanger. Normal titratable acid excretion is approximately 30 mmol per day, rising modestly to about 35 mmol per day during acidosis. The limited increase is because titratable acid production is constrained by the filtered phosphate load, which does not increase dramatically.' },
        { id: 'kp2', weight: 2, description: 'Ammonia buffering: proximal tubular cells metabolize glutamine to produce two NH4+ ions and two new HCO3- ions per glutamine molecule. NH4+ is secreted into the lumen (substituting for H+ on NHE3) and eventually reaches the collecting duct where NH3 diffuses from the medullary interstitium into the lumen and combines with secreted H+ to form NH4+, which is trapped by nonionic diffusion trapping and excreted. The two new HCO3- are transported to the blood. NH4+ excretion rises from approximately 30 mmol per day at baseline to 165 mmol per day or more during chronic acidosis.' },
        { id: 'kp3', weight: 1, description: 'Ammonia excretion is the dominant adaptive mechanism because glutaminase activity and glutamine transport into proximal tubular cells are upregulated by chronic acidosis, allowing a five to six fold increase in NH4+ production. In contrast, titratable acid can only increase modestly because it is limited by the filtered phosphate load. During maximal compensation for acidosis, total net acid excretion reaches approximately 500 mmol per day, with NH4+ accounting for the vast majority of that increase.' },
      ],
      common_errors: [
        'Confusing titratable acid (phosphate buffered H+) with free H+ excretion',
        'Stating that ammonia buffering occurs only in the proximal tubule (NH4+ is produced there, but NH3 trapping occurs in the collecting duct)',
        'Failing to explain nonionic diffusion trapping as the mechanism that prevents NH4+ from diffusing back out of the lumen',
      ],
      minimum_passing_score: 60,
    },
    topic: 'new-hco3-generation',
    chapter: 'pp2-wk-1',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 31',
      topic: 'new-hco3-generation',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 4. Acid-Base Disorder Classification & ABG Interpretation
  {
    id: 'r-p2-wk1-4',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w1-abg-four-step-approach', 'atom-p2w1-acid-base-compensation-patterns'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Describe the four-step approach to interpreting an arterial blood gas. Then for each of the four primary acid-base disorders (respiratory acidosis, respiratory alkalosis, metabolic acidosis, metabolic alkalosis), identify the primary event, the direction of pH, PCO2, and HCO3- changes, and the expected compensatory mechanism.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The four-step ABG approach: Step 1, note whether pH is low (acidosis) or high (alkalosis). Step 2, determine which variable (PCO2 or HCO3-) is out of the normal range in a direction that could cause the observed pH change. Step 3, if the cause is a change in PCO2, the problem is respiratory; if the cause is a change in HCO3-, the problem is metabolic. Step 4, examine the other variable to see if it has moved in the direction that would partially correct the pH (indicating compensation is present); if it is within normal range, there is no compensation.' },
        { id: 'kp2', weight: 2, description: 'For respiratory acidosis: primary event is increased PCO2 (above 40 mm Hg); pH decreases; compensation is renal with increased HCO3- reabsorption and new HCO3- production. For respiratory alkalosis: primary event is decreased PCO2 (below 40 mm Hg); pH increases; compensation is renal with decreased H+ excretion and decreased HCO3- reabsorption, lowering plasma HCO3-. For metabolic acidosis: primary event is decreased HCO3- (below 24 mEq/L); pH decreases; compensation is respiratory with hyperventilation lowering PCO2. For metabolic alkalosis: primary event is increased HCO3- (above 24 mEq/L); pH increases; compensation is respiratory with hypoventilation raising PCO2.' },
        { id: 'kp3', weight: 1, description: 'The primary event in each disorder is identified by the double arrow (the variable that changed most dramatically and in the direction that explains the pH shift). Respiratory disorders are initiated by changes in PCO2 (a respiratory variable), while metabolic disorders are initiated by changes in HCO3- (a metabolic variable). Compensation never fully corrects pH to 7.4; if the pH is normal with abnormal PCO2 and HCO3-, a mixed disorder should be suspected.' },
      ],
      common_errors: [
        'Confusing the primary event with the compensatory response (the primary event drives the pH change; compensation opposes it)',
        'Stating that respiratory compensation for metabolic alkalosis involves hyperventilation (it involves hypoventilation to retain CO2)',
        'Forgetting that compensation is always partial and never returns pH completely to 7.4',
      ],
      minimum_passing_score: 60,
    },
    topic: 'acid-base-disorder-classification',
    chapter: 'pp2-wk-1',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 31',
      topic: 'acid-base-disorder-classification',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 5. Anion Gap Differential Diagnosis
  {
    id: 'r-p2-wk1-5',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w1-anion-gap-calculation', 'atom-p2w1-anion-gap-differential'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Define the anion gap, state its formula and normal range, and explain the pathophysiologic basis for why it exists. Then distinguish between increased anion gap metabolic acidosis and normal anion gap (hyperchloremic) metabolic acidosis, listing at least three causes of each type and explaining why the chloride concentration differs between the two patterns.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The anion gap equals Na+ minus (Cl- + HCO3-), with a normal value of approximately 10 mEq/L (range 8 to 16 mEq/L). It represents unmeasured anions in the plasma, primarily albumin, phosphate, sulfate, and organic acids. Electroneutrality requires total cations to equal total anions. Because the routinely measured cation (Na+, 142 mEq/L) exceeds the sum of routinely measured anions (Cl- 108 + HCO3- 24 = 132 mEq/L), the difference of 10 mEq/L reflects the unmeasured anion pool.' },
        { id: 'kp2', weight: 2, description: 'In increased anion gap metabolic acidosis, unmeasured organic anions accumulate and replace HCO3- in the electroneutrality equation. Chloride remains normal because no Cl- is needed to replace the lost bicarbonate. Causes include diabetic ketoacidosis (beta-hydroxybutyrate and acetoacetate), lactic acidosis (lactate), aspirin poisoning (salicylate), methanol poisoning (formate), ethylene glycol poisoning (oxalate), and starvation ketosis. In each case, the new anion widens the gap while Cl- stays at its baseline level.' },
        { id: 'kp3', weight: 1, description: 'In normal anion gap (hyperchloremic) metabolic acidosis, HCO3- is lost directly without accumulation of any unmeasured anion. The kidney retains Cl- to maintain electroneutrality, so chloride rises as bicarbonate falls, keeping the anion gap normal. Causes include diarrhea (direct GI loss of HCO3-), renal tubular acidosis (impaired tubular H+ secretion or HCO3- reabsorption), Addison disease (aldosterone deficiency), and carbonic anhydrase inhibitors like acetazolamide.' },
      ],
      common_errors: [
        'Using the wrong formula (including K+ is less common but acceptable in some references; stating it as Cl- minus Na+ is wrong)',
        'Failing to explain that normal AG acidosis is hyperchloremic because Cl- replaces lost HCO3-',
        'Listing diarrhea as an increased anion gap cause (it is a normal anion gap cause)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'anion-gap-differential',
    chapter: 'pp2-wk-1',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 31',
      topic: 'anion-gap-differential',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 6. Diuretic Mechanisms, Voltage Effects, and Complications
  {
    id: 'r-p2-wk1-6',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w1-loop-diuretic-nkcc2-block', 'atom-p2w1-k-sparing-diuretic-mechanism'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Compare the mechanisms of action, nephron segment targets, and transepithelial voltage effects of loop diuretics, thiazide diuretics, and potassium-sparing diuretics. Explain why loop and thiazide diuretics cause hypokalemia while potassium-sparing agents cause hyperkalemia. Include the braking phenomenon.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Loop diuretics (furosemide, bumetanide) block NKCC2 in the thick ascending limb. Normally, K+ recycling through ROMK channels creates a +8 mV lumen positive voltage that drives paracellular Ca2+, Mg2+, and Na+ reabsorption. Loop diuretic blockade collapses this voltage, causing Ca2+ and Mg2+ wasting. Loop diuretics also impair both urine concentration (medullary gradient washout) and dilution (no NaCl extraction from TAL) simultaneously, which is a unique dual impairment.' },
        { id: 'kp2', weight: 2, description: 'Thiazide diuretics block NCC (Na+/Cl- cotransporter) in the distal convoluted tubule, which normally has a -10 mV lumen negative voltage. Thiazides are first line for hypertension and have the additional benefit of reducing calcium excretion (promoting Ca2+ reabsorption via TRPV5), making them useful for preventing calcium kidney stones. Potassium-sparing diuretics include aldosterone receptor antagonists (spironolactone, eplerenone) and ENaC blockers (amiloride, triamterene), both acting in the collecting duct where the normal lumen voltage is approximately -50 mV. By reducing Na+ reabsorption through ENaC, they reduce the lumen negative voltage that drives K+ secretion through ROMK.' },
        { id: 'kp3', weight: 1, description: 'Loop and thiazide diuretics cause hypokalemia because increased Na+ delivery to the collecting duct (from upstream blockade) stimulates Na+ reabsorption through ENaC, which increases the lumen negative voltage and drives more K+ secretion through ROMK. Additionally, volume contraction from diuresis activates aldosterone, which further stimulates ENaC and ROMK. Potassium-sparing diuretics cause hyperkalemia by the opposite mechanism: reducing ENaC activity directly (amiloride) or indirectly (spironolactone blocking aldosterone), which decreases the electrochemical gradient for K+ secretion.' },
        { id: 'kp4', weight: 1, description: 'The diuretic braking phenomenon refers to the progressive blunting of the natriuretic response with continued diuretic use. Volume contraction from initial diuresis activates the renin-angiotensin-aldosterone system and the sympathetic nervous system. Distal tubular cells undergo structural hypertrophy with increased Na+/K+ ATPase expression, enhancing sodium reabsorption in segments not affected by the diuretic. These compensatory mechanisms offset the diuretic effect over days.' },
      ],
      common_errors: [
        'Confusing the lumen voltage of the thick ascending limb (+8 mV, positive) with the collecting duct (-50 mV, negative)',
        'Stating that thiazides waste calcium (they actually promote calcium retention)',
        'Attributing diuretic-induced hypokalemia solely to K+ loss in the urine without explaining the ENaC and voltage mechanism',
      ],
      minimum_passing_score: 60,
    },
    topic: 'diuretic-mechanisms-and-complications',
    chapter: 'pp2-wk-1',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 32',
      topic: 'diuretic-mechanisms-and-complications',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 7. AKI Classification
  {
    id: 'r-p2-wk1-7',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w1-aki-prerenal-causes', 'atom-p2w1-aki-classification-frequencies'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Classify acute kidney injury into its three etiologic categories, state the approximate frequency of each, and list at least two causes per category. Explain the pathophysiologic distinction between prerenal and intrarenal AKI and why this distinction matters for treatment. Describe the major physiologic consequences of complete kidney shutdown.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'AKI is classified as prerenal (50 to 55 percent), intrarenal (35 to 40 percent), or postrenal (approximately 5 percent). Prerenal causes include hemorrhage, severe dehydration, cardiogenic shock, septic shock, and any condition that reduces renal perfusion while the kidney parenchyma remains structurally intact. Intrarenal causes include acute tubular necrosis from ischemia or nephrotoxins (aminoglycosides, contrast dye, myoglobin), acute glomerulonephritis, and vasculitis. Postrenal causes include bilateral ureteral obstruction (kidney stones, tumor compression), bladder outlet obstruction (prostatic hypertrophy), and urethral obstruction.' },
        { id: 'kp2', weight: 2, description: 'The distinction between prerenal and intrarenal AKI is critical because prerenal AKI is rapidly reversible if perfusion is restored (the kidneys are structurally normal but underperfused), whereas intrarenal AKI involves structural damage that may take weeks to heal or may become permanent. In prerenal AKI, the kidney avidly retains sodium (fractional excretion of Na+ below 1 percent) and concentrates urine (high osmolarity), demonstrating intact tubular function. In intrarenal AKI (particularly ATN), tubular damage impairs sodium reabsorption (FENa above 2 percent) and concentrating ability (isosthenuric urine).' },
        { id: 'kp3', weight: 1, description: 'Complete kidney shutdown produces fluid retention with edema and hypertension, progressive metabolic acidosis from inability to excrete non-volatile acid, hyperkalemia (the most immediately life threatening consequence due to cardiac arrhythmia), accumulation of nitrogenous waste (uremia with elevated BUN and creatinine causing mental status decline), and accumulation of phosphate, sulfate, phenols, and other toxins. Without treatment, death occurs in 8 to 14 days primarily from hyperkalemia, acidosis, and uremic encephalopathy.' },
      ],
      common_errors: [
        'Stating that postrenal AKI is the most common category (prerenal is most common at 50 to 55 percent)',
        'Confusing prerenal AKI (underperfusion, intact kidneys) with intrarenal AKI (structural damage)',
        'Forgetting that hyperkalemia is the most immediately dangerous consequence of kidney failure',
      ],
      minimum_passing_score: 60,
    },
    topic: 'aki-classification-and-consequences',
    chapter: 'pp2-wk-1',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 32',
      topic: 'aki-classification-and-consequences',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 8. CKD Progression, Solute Behavior, and ESRD
  {
    id: 'r-p2-wk1-8',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w1-ckd-vicious-cycle', 'atom-p2w1-ckd-solute-groups'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Describe the vicious cycle of chronic kidney disease progression from initial nephron loss to end-stage renal disease. Explain the three categories of solute behavior as GFR declines (Groups A, B, and C), why creatinine is an insensitive early marker, the concept of isosthenuria, and why hypertension and diabetes account for the majority of ESRD cases.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The CKD vicious cycle begins with primary kidney disease causing nephron loss. Surviving nephrons undergo compensatory hypertrophy and afferent arteriolar vasodilation to maintain total GFR. This adaptation increases single-nephron glomerular pressure and filtration rate. The chronically elevated glomerular capillary pressure damages the glomerular membrane, leading to glomerular sclerosis. Sclerosed glomeruli stop functioning, reducing nephron number further and perpetuating the cycle. Systemic hypertension accelerates the cycle by transmitting higher pressure to the glomerular capillaries. CKD stages: Stage 1 (GFR 90 or more with damage markers), Stage 2 (60 to 89), Stage 3 (30 to 59), Stage 4 (15 to 29), Stage 5 (less than 15, ESRD requiring dialysis or transplant).' },
        { id: 'kp2', weight: 2, description: 'As GFR declines, plasma solutes follow three patterns. Group A (creatinine, urea): concentrations rise steeply because they depend almost entirely on glomerular filtration for excretion; a 50 percent GFR drop approximately doubles their plasma levels. Group B (phosphate, H+): concentrations rise moderately because hormonal adaptations (PTH for phosphate, increased ammoniagenesis for H+) partially compensate. Group C (Na+, Cl-): concentrations remain nearly constant because the kidney adjusts fractional reabsorption to match output to intake, even with significantly reduced nephron mass.' },
        { id: 'kp3', weight: 1, description: 'Creatinine is insensitive as an early GFR marker because the creatinine versus GFR relationship is a rectangular hyperbola: large GFR drops at high baseline GFR produce only small creatinine increases (a 50 percent GFR drop from 120 to 60 mL/min merely doubles creatinine from 1.0 to 2.0 mg/dL). Additionally, creatinine depends on muscle mass, so sarcopenic patients may have deceptively normal creatinine despite reduced GFR. Isosthenuria (urine specific gravity fixed near 1.010 regardless of hydration) occurs in advanced CKD because each surviving nephron handles a larger solute load, limiting dilution, while the medullary gradient washes out from increased per-nephron blood flow, limiting concentration.' },
        { id: 'kp4', weight: 1, description: 'Hypertension and diabetes mellitus together account for more than 70 percent of all ESRD cases. Diabetes causes progressive glomerulosclerosis through glycation products, mesangial expansion, and hyperfiltration injury. Hypertension causes nephrosclerosis by transmitting elevated pressure directly to glomerular capillaries. Obesity is a major driver of both conditions; 76 to 75 percent of hypertension risk is attributable to excess weight, and type 2 diabetes (over 90 percent of all diabetes) is primarily driven by obesity. Total U.S. costs for ESRD alone exceeded 50 billion dollars annually.' },
      ],
      common_errors: [
        'Stating that compensatory hypertrophy is protective long term (it is initially adaptive but eventually accelerates nephron loss through the vicious cycle)',
        'Claiming that Na+ and Cl- rise dramatically as GFR falls (they remain nearly constant because fractional reabsorption adjusts)',
        'Confusing isosthenuria (fixed near 1.010) with either maximal concentration or maximal dilution',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ckd-progression-and-esrd',
    chapter: 'pp2-wk-1',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 32',
      topic: 'ckd-progression-and-esrd',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

];
