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


  // ═══════════════════════════════════════════════════════════════════════
  //  pp2-wk-2: Red Blood Cells / Resistance to Infection I & II (Ch. 33–35)
  //  8 synthesis questions with feeder atom dependencies
  // ═══════════════════════════════════════════════════════════════════════

  // 1. EPO Regulation & Erythropoiesis Integration
  {
    id: 'r-p2-wk2-1',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w2-epo-hypoxia-feedback', 'atom-p2w2-erythropoiesis-maturation-stages'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Explain the complete pathway from tissue hypoxia to mature red blood cell release. Begin with the oxygen sensing mechanism in the kidney that triggers EPO production, describe how EPO acts on erythroid progenitors in the bone marrow, then trace the maturation stages from proerythroblast through reticulocyte release into the circulation. Include the normal reticulocyte count, what an elevated count signifies clinically, and the time frame required for the marrow to mount a full erythropoietic response after acute blood loss.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Tissue hypoxia is detected by peritubular interstitial fibroblasts in the renal cortex and outer medulla, which produce approximately 90 percent of circulating EPO; the liver contributes the remaining 10 percent. Under normoxic conditions, prolyl hydroxylase enzymes hydroxylate hypoxia inducible factor (HIF) alpha subunits, targeting them for proteasomal degradation via the von Hippel Lindau (VHL) ubiquitin ligase. During hypoxia, prolyl hydroxylase activity decreases because O2 is a required co-substrate; HIF alpha accumulates, dimerizes with HIF beta, translocates to the nucleus, and binds hypoxia response elements on the EPO gene promoter, dramatically increasing EPO transcription. EPO levels can rise 100 fold or more during severe hypoxia. The student must identify the renal site, the HIF pathway, and the magnitude of EPO increase.' },
        { id: 'kp2', weight: 2, description: 'EPO binds to EPO receptors on committed erythroid progenitor cells (colony forming unit erythroid, CFU-E) in the bone marrow, activating the JAK2 STAT5 signaling cascade. This promotes cell survival by upregulating anti-apoptotic proteins (Bcl-xL), stimulates proliferation, and accelerates differentiation. The maturation sequence proceeds through distinct morphologically identifiable stages: proerythroblast (large cell with dispersed chromatin and visible nucleoli), basophilic erythroblast (intense RNA staining, beginning hemoglobin synthesis), polychromatic erythroblast (mixed RNA and hemoglobin staining), orthochromatic erythroblast (condensed pyknotic nucleus, abundant hemoglobin), reticulocyte (nucleus expelled, residual RNA visible with supravital stain), and finally the mature erythrocyte. The entire process from proerythroblast to reticulocyte release takes approximately 5 days under normal conditions.' },
        { id: 'kp3', weight: 1, description: 'The normal reticulocyte count is 0.5 to 1.5 percent of circulating red cells (absolute count approximately 25,000 to 75,000 per microliter). An elevated reticulocyte count indicates that the bone marrow is actively producing and releasing immature red cells at an accelerated rate, which is the expected compensatory response to anemia, hemolysis, or acute blood loss. After acute hemorrhage, the reticulocyte count begins rising within 1 to 2 days, peaks at 6 to 10 days, and the marrow requires 2 to 3 weeks to achieve maximal erythropoietic output (up to 7 to 8 times normal production rate). A low reticulocyte count in the setting of anemia suggests marrow failure or inadequate EPO stimulation.' },
      ],
      common_errors: [
        'Stating that EPO is produced primarily by the liver (the kidney produces 90 percent)',
        'Confusing HIF stabilization with HIF degradation (hypoxia stabilizes HIF; normoxia degrades it)',
        'Claiming that the marrow can fully compensate within 24 to 48 hours of acute blood loss (maximal output takes 2 to 3 weeks)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'epo-erythropoiesis-integration',
    chapter: 'pp2-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 33',
      topic: 'epo-erythropoiesis-integration',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 2. Hemoglobin Structure, Cooperative O2 Binding & RBC Deformability
  {
    id: 'r-p2-wk2-2',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w2-hemoglobin-cooperative-binding', 'atom-p2w2-rbc-biconcave-deformability'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe the molecular structure of adult hemoglobin (HbA) including its quaternary arrangement, heme group composition, and the mechanism of cooperative oxygen binding that produces the sigmoid oxyhemoglobin dissociation curve. Then explain how the biconcave disc shape of the mature RBC optimizes oxygen delivery at the tissue level. Finally, describe how alterations in hemoglobin structure (as in sickle cell disease) or loss of membrane flexibility (as in hereditary spherocytosis or stored blood) impair microcirculatory perfusion.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Adult hemoglobin A is a tetramer consisting of two alpha and two beta globin chains arranged in a quaternary structure. Each globin chain contains one heme group, which is a protoporphyrin IX ring with a central ferrous (Fe2+) iron atom that reversibly binds one molecule of O2, giving each Hb molecule a total carrying capacity of four O2 molecules. Cooperative binding means that the binding of O2 to one heme group induces conformational changes (T state to R state transition) in adjacent subunits that increase their oxygen affinity. This cooperativity produces the characteristic sigmoid (S shaped) oxyhemoglobin dissociation curve rather than a hyperbolic curve, which has critical physiologic significance: Hb loads O2 efficiently at high alveolar PO2 (flat upper portion) while unloading O2 efficiently at lower tissue PO2 (steep middle portion).' },
        { id: 'kp2', weight: 2, description: 'The mature RBC is a biconcave disc approximately 7.8 micrometers in diameter and 2.5 micrometers thick at the edges, with a central thickness of only about 1 micrometer. This shape provides a surface area to volume ratio of approximately 1.4 times greater than a sphere of equivalent volume. The high ratio minimizes the maximum diffusion distance from the cell membrane to interior hemoglobin molecules, ensuring rapid O2 loading and unloading. The biconcave shape also provides excess membrane surface area relative to cell volume, allowing the RBC to deform dramatically when passing through capillaries as narrow as 3 micrometers and through splenic sinusoidal slits of approximately 1 to 3 micrometers without rupturing. This deformability is maintained by the spectrin actin cytoskeletal network anchored to the inner membrane.' },
        { id: 'kp3', weight: 1, description: 'In sickle cell disease, a single amino acid substitution (valine replacing glutamic acid at position 6 of the beta chain) creates hemoglobin S, which polymerizes under deoxygenated conditions into rigid rod like fibers that distort the RBC into a sickle shape. Sickled cells lose deformability, obstruct microcapillaries, cause vaso-occlusive crises, and have shortened lifespans (approximately 10 to 20 days versus the normal 120 days). In hereditary spherocytosis, cytoskeletal protein defects cause loss of membrane surface area, converting the biconcave disc to a sphere that cannot deform adequately for splenic passage. Stored blood (storage lesion) progressively loses 2,3 DPG and membrane lipids, reducing both O2 unloading capacity and deformability, which is relevant to the CRNA managing massive transfusion protocols.' },
      ],
      common_errors: [
        'Stating that hemoglobin contains four alpha chains (it contains two alpha and two beta chains in HbA)',
        'Confusing the ferrous (Fe2+, functional) form with the ferric (Fe3+, methemoglobin) form of heme iron',
        'Describing the oxyhemoglobin dissociation curve as hyperbolic rather than sigmoid (hyperbolic is myoglobin, not hemoglobin)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'hemoglobin-rbc-deformability',
    chapter: 'pp2-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 33',
      topic: 'hemoglobin-rbc-deformability',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 3. Iron Homeostasis & B12/Folate Deficiency Anemias
  {
    id: 'r-p2-wk2-3',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w2-iron-absorption-recycling', 'atom-p2w2-b12-folate-megaloblastic'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Compare iron deficiency anemia with vitamin B12 deficiency anemia and folate deficiency anemia. For each, describe the absorption site and mechanism, the transport or storage form, the specific metabolic step disrupted by deficiency, the resulting RBC morphology (microcytic versus macrocytic), and the key distinguishing laboratory findings. Explain why B12 deficiency can cause neurologic symptoms (subacute combined degeneration) while folate deficiency does not.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Iron is absorbed primarily in the duodenum and upper jejunum. Dietary ferric iron (Fe3+) is reduced to ferrous iron (Fe2+) by duodenal cytochrome B (Dcytb) on the apical brush border, then transported into the enterocyte via divalent metal transporter 1 (DMT1). Inside the enterocyte, iron is either stored as ferritin or exported to the blood via ferroportin on the basolateral membrane. Hepcidin, produced by the liver, is the master regulator: it binds to and degrades ferroportin, blocking iron export when stores are adequate. In the blood, iron is carried by transferrin (each molecule binds two Fe3+ atoms) to the bone marrow for hemoglobin synthesis. Total body iron is approximately 4 to 5 grams, with about 65 percent in hemoglobin. Iron deficiency impairs heme synthesis, producing small, pale (microcytic, hypochromic) red cells. Laboratory findings include low serum ferritin, low serum iron, elevated total iron binding capacity (TIBC), and low transferrin saturation.' },
        { id: 'kp2', weight: 2, description: 'Vitamin B12 (cobalamin) absorption requires intrinsic factor (IF), a glycoprotein secreted by gastric parietal cells. B12 binds IF in the duodenum, and the B12 IF complex is absorbed in the terminal ileum via cubilin receptors. B12 is stored in the liver (stores last 3 to 6 years). B12 serves as a cofactor for methionine synthase (which converts homocysteine to methionine and simultaneously regenerates tetrahydrofolate from methyltetrahydrofolate) and for methylmalonyl CoA mutase. Deficiency impairs DNA synthesis (because tetrahydrofolate cannot be regenerated, creating a functional folate trap), producing large, oval macrocytes (megaloblastic anemia with MCV above 100 fL) and hypersegmented neutrophils. Neurologic damage (subacute combined degeneration of the spinal cord) occurs because B12 is independently required for myelin synthesis via the methylmalonyl CoA mutase pathway; elevated methylmalonic acid is the distinguishing lab marker of B12 deficiency.' },
        { id: 'kp3', weight: 1, description: 'Folate (vitamin B9) is absorbed in the jejunum without requiring intrinsic factor. Folate is essential for thymidylate synthase, which converts deoxyuridine monophosphate (dUMP) to deoxythymidine monophosphate (dTMP) for DNA synthesis. Deficiency produces megaloblastic anemia morphologically identical to B12 deficiency (macrocytic RBCs, hypersegmented neutrophils). However, folate deficiency does NOT cause neurologic damage because folate is not involved in the methylmalonyl CoA mutase pathway that maintains myelin integrity. Folate stores in the body are limited (lasting only 3 to 4 months), so deficiency develops much faster than B12 deficiency. Key distinguishing tests: serum methylmalonic acid is elevated in B12 deficiency but normal in folate deficiency; serum homocysteine is elevated in both conditions.' },
      ],
      common_errors: [
        'Stating that B12 is absorbed in the jejunum (it is absorbed in the terminal ileum)',
        'Claiming that folate deficiency causes neurologic symptoms (only B12 deficiency causes subacute combined degeneration)',
        'Confusing microcytic anemia (iron deficiency) with macrocytic anemia (B12 or folate deficiency)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'iron-b12-folate-anemias',
    chapter: 'pp2-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 33',
      topic: 'iron-b12-folate-anemias',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 4. Neutrophil Recruitment Cascade & Bacterial Killing
  {
    id: 'r-p2-wk2-4',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w2-neutrophil-margination-diapedesis', 'atom-p2w2-oxidative-burst-mpo'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe the complete sequence of events from neutrophil margination in post-capillary venules to intracellular bacterial destruction. For each step in the recruitment cascade, identify the specific molecular mediators involved (selectins, integrins, chemokines). Then describe the two major intracellular killing systems: the oxygen dependent respiratory burst and the oxygen independent mechanisms. Explain why patients with chronic granulomatous disease suffer recurrent life threatening infections despite having normal neutrophil counts and normal chemotaxis.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Neutrophil recruitment follows a multi-step adhesion cascade. Step 1 (margination and rolling): inflammatory cytokines (TNF alpha, IL-1) induce endothelial cells to express P selectin (from Weibel Palade bodies within minutes) and E selectin (transcriptionally upregulated over hours). Neutrophil surface ligands (sialyl Lewis X, PSGL-1) bind selectins loosely, causing the neutrophil to roll along the endothelium at reduced velocity. Step 2 (firm adhesion): chemokines displayed on the endothelial surface (IL-8, CXCL8) activate neutrophil integrins (LFA-1 and Mac-1, both beta-2 integrins) from a low affinity to high affinity conformation. Activated integrins bind tightly to ICAM-1 on the endothelium, arresting the neutrophil. Step 3 (diapedesis): the neutrophil squeezes between endothelial cells through paracellular junctions (involving PECAM-1/CD31) or transcellularly, entering the tissue. Step 4 (chemotaxis): the neutrophil migrates along a concentration gradient of chemoattractants (bacterial products like fMLP, complement fragment C5a, leukotriene B4) toward the infection site.' },
        { id: 'kp2', weight: 2, description: 'The oxygen dependent killing system (respiratory burst) is the primary bactericidal mechanism. Upon phagocytosis, the NADPH oxidase complex (composed of membrane bound cytochrome b558 and cytosolic components p47phox and p67phox) assembles on the phagosomal membrane and transfers electrons from NADPH to molecular O2, generating superoxide anion (O2 minus). Superoxide dismutase converts superoxide to hydrogen peroxide (H2O2). The myeloperoxidase (MPO) halide system then combines H2O2 with chloride ions (Cl minus) to produce hypochlorous acid (HOCl), which is the most potent bactericidal agent in the neutrophil arsenal. Additional reactive oxygen species include hydroxyl radicals and singlet oxygen. The oxygen independent system includes lysozyme (cleaves peptidoglycan in bacterial cell walls), defensins (membrane disrupting antimicrobial peptides that form pores in bacterial membranes), lactoferrin (sequesters iron from bacteria), and acidification of the phagolysosome to pH 4.0.' },
        { id: 'kp3', weight: 1, description: 'Chronic granulomatous disease (CGD) is caused by genetic defects in NADPH oxidase subunits (most commonly X linked recessive mutation in gp91phox, the larger subunit of cytochrome b558). Neutrophils in CGD patients can perform chemotaxis, phagocytosis, and degranulation normally, but they cannot generate the respiratory burst. Without superoxide production, the entire oxidative killing cascade fails: no H2O2, no HOCl, no hydroxyl radicals. Patients suffer recurrent severe infections with catalase positive organisms (Staphylococcus aureus, Aspergillus species, Serratia marcescens, Burkholderia cepacia) because these bacteria produce catalase that destroys whatever small amounts of H2O2 the bacteria themselves generate, eliminating the last potential oxidative killing mechanism. Catalase negative organisms (such as streptococci) generate H2O2 but lack catalase, so the neutrophil can borrow that bacterial H2O2 for some degree of killing.' },
      ],
      common_errors: [
        'Confusing selectin mediated rolling (loose, reversible) with integrin mediated firm adhesion (tight, activation dependent)',
        'Stating that the respiratory burst uses mitochondrial oxygen consumption (it uses NADPH oxidase, not mitochondria)',
        'Claiming that CGD patients have low neutrophil counts (counts are normal; the defect is in NADPH oxidase function)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'neutrophil-recruitment-killing',
    chapter: 'pp2-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 34',
      topic: 'neutrophil-recruitment-killing',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 5. WBC Differential & Monocyte-Macrophage System
  {
    id: 'r-p2-wk2-5',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w2-wbc-differential-counts', 'atom-p2w2-monocyte-macrophage-system'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'State the normal total white blood cell count and the differential percentages for each of the five major leukocyte types. Describe the granulocyte maturation sequence in the bone marrow and compare the circulating half-life of neutrophils versus monocytes. Then explain the concept of the monocyte-macrophage system (mononuclear phagocyte system) by describing how circulating monocytes differentiate into tissue macrophages, and name at least five specialized tissue macrophage populations with their anatomic locations and unique functions.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The normal total WBC count ranges from 4,000 to 11,000 per microliter. The differential is approximately: neutrophils 62 percent (absolute count 1,800 to 7,700), lymphocytes 30 percent, monocytes 5.3 percent, eosinophils 2.3 percent, and basophils 0.4 percent. Granulocyte development in the bone marrow follows the sequence: myeloblast (committed granulocyte precursor) to promyelocyte (primary azurophilic granules appear) to myelocyte (specific/secondary granules appear; this is the last stage capable of cell division) to metamyelocyte (kidney shaped nucleus, no further division) to band cell (horseshoe shaped nucleus) to segmented mature granulocyte (multi-lobed nucleus with 3 to 5 lobes in neutrophils). The entire maturation process takes approximately 10 to 14 days. The bone marrow maintains a large storage pool of mature granulocytes that can be mobilized rapidly during infection, approximately 5 to 8 times the number in circulation.' },
        { id: 'kp2', weight: 2, description: 'Neutrophils have a circulating half-life of only 4 to 8 hours before migrating into tissues, where they survive an additional 4 to 5 days. Monocytes circulate for 10 to 20 hours before entering tissues and transforming into macrophages that can survive for months to years. Upon entering tissues, monocytes enlarge 5 to 10 fold, dramatically increase their lysosomal enzyme content (acid hydrolases, cathepsins, elastase) and phagocytic capacity, and develop extensive rough endoplasmic reticulum for cytokine production. Tissue macrophages can phagocytose approximately 100 bacteria before their own lysosomal contents cause self destruction, compared to neutrophils which typically can phagocytose 3 to 20 bacteria. Macrophages also serve as antigen presenting cells by processing ingested antigens and displaying peptide fragments on MHC class II molecules to activate CD4+ T helper lymphocytes, bridging innate and adaptive immunity.' },
        { id: 'kp3', weight: 2, description: 'The mononuclear phagocyte system (formerly called the reticuloendothelial system) consists of tissue macrophages distributed strategically throughout the body. Key populations include: Kupffer cells in the hepatic sinusoids (the largest population, responsible for clearing portal venous blood of bacteria and endotoxin from the gut), alveolar macrophages in the pulmonary alveoli (clear inhaled particulates, pathogens, and surfactant), splenic macrophages in the red pulp (remove senescent or damaged red blood cells and recycle iron from hemoglobin), microglia in the central nervous system (respond to neural injury and neuroinflammation), osteoclasts in bone (multinucleated macrophage derivatives that resorb mineralized bone matrix), peritoneal macrophages in the abdominal cavity, and Langerhans cells in the epidermis (dendritic cells of macrophage lineage that capture skin antigens and migrate to lymph nodes for antigen presentation).' },
      ],
      common_errors: [
        'Stating that lymphocytes are the most abundant circulating WBC (neutrophils are most abundant at 62 percent)',
        'Confusing the myelocyte stage (last dividing stage) with the metamyelocyte stage (which cannot divide)',
        'Claiming that neutrophils survive for weeks in tissues (they survive only 4 to 5 days before undergoing apoptosis)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'wbc-differential-macrophage-system',
    chapter: 'pp2-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 34',
      topic: 'wbc-differential-macrophage-system',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 6. Innate vs Acquired Immunity & Tissue Macrophage Roles
  {
    id: 'r-p2-wk2-6',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w2-innate-vs-acquired-overview', 'atom-p2w2-tissue-macrophage-specialization'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Compare and contrast innate and acquired immunity across five dimensions: specificity, speed of initial response, presence of immunologic memory, principal cell types, and key molecular mediators. Then explain the critical bridging role that macrophages and dendritic cells play as antigen presenting cells (APCs) connecting innate to acquired immunity. Describe the antigen presentation process including MHC class I versus MHC class II pathways and explain why this distinction determines whether CD4+ or CD8+ T cells are activated.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Innate immunity provides a rapid (minutes to hours), nonspecific first line of defense that does not improve with repeated exposure (no immunologic memory). Its components include physical barriers (skin, mucous membranes, stomach acid), cellular defenses (neutrophils, macrophages, natural killer cells, eosinophils, basophils), soluble proteins (complement system, acute phase proteins like C reactive protein, interferons), and the inflammatory response. Acquired (adaptive) immunity is slower on first exposure (days to weeks for primary response) but is highly specific to individual antigenic epitopes and generates immunologic memory that enables a faster and larger secondary response. Acquired immunity is divided into humoral immunity (B lymphocytes producing antibodies) and cell mediated immunity (T lymphocytes). Key molecular mediators of innate immunity include pattern recognition receptors (toll like receptors recognizing PAMPs), complement proteins (C3b opsonization, C5a chemotaxis, C5b-9 membrane attack complex), and pro-inflammatory cytokines (TNF alpha, IL-1, IL-6).' },
        { id: 'kp2', weight: 2, description: 'Macrophages and dendritic cells serve as the critical bridge between innate and acquired immunity through antigen presentation. After phagocytosing a pathogen, these cells process its proteins into small peptide fragments (8 to 20 amino acids) inside endosomal compartments. Exogenous antigens (from phagocytosed extracellular pathogens) are loaded onto MHC class II molecules and displayed on the APC surface. MHC class II presentation activates CD4+ helper T cells, which then orchestrate the broader adaptive response by secreting cytokines that activate B cells (for antibody production) and enhance CD8+ T cell killing. Endogenous antigens (from intracellular pathogens such as viruses, or from abnormal self proteins in tumor cells) are processed in the proteasome and loaded onto MHC class I molecules for surface display. MHC class I presentation activates CD8+ cytotoxic T cells, which kill the infected cell directly using perforin and granzymes.' },
        { id: 'kp3', weight: 1, description: 'The MHC class distinction determines which T cell subset responds because of co-receptor binding specificity. CD4 on helper T cells binds exclusively to the beta-2 domain of MHC class II molecules, while CD8 on cytotoxic T cells binds exclusively to the alpha-3 domain of MHC class I molecules. MHC class I is expressed on virtually all nucleated cells in the body, allowing CD8+ T cells to survey any cell for evidence of intracellular infection or malignant transformation. MHC class II is expressed only on professional antigen presenting cells (macrophages, dendritic cells, B lymphocytes), restricting CD4+ T cell activation to sites of deliberate antigen presentation. This dual system ensures that extracellular threats are handled by antibody based humoral responses (CD4+ helper mediated B cell activation) while intracellular threats are handled by direct cell killing (CD8+ cytotoxic T cell mediated).' },
      ],
      common_errors: [
        'Stating that innate immunity has memory (only acquired immunity generates immunologic memory via memory B and T cells)',
        'Confusing MHC class I (all nucleated cells, activates CD8+) with MHC class II (APCs only, activates CD4+)',
        'Claiming that neutrophils are part of acquired immunity (they are innate immune cells)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'innate-acquired-immunity-comparison',
    chapter: 'pp2-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 34-35',
      topic: 'innate-acquired-immunity-comparison',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 7. B Cell Activation, Clonal Expansion & Immunoglobulin Classes
  {
    id: 'r-p2-wk2-7',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w2-b-cell-clonal-expansion', 'atom-p2w2-immunoglobulin-classes-functions'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Trace the complete pathway from initial antigen encounter to antibody secretion. Describe how a naive B cell is activated by antigen binding to its surface immunoglobulin (B cell receptor) and the role of CD4+ T helper cell co-stimulation. Explain clonal expansion, the differentiation of activated B cells into plasma cells versus memory cells, and the kinetic differences between the primary and secondary immune responses. Then describe the basic structure of an immunoglobulin molecule and compare the five immunoglobulin classes (IgG, IgM, IgA, IgE, IgD) by their structure, location, and primary function.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'B cell activation begins when antigen binds to surface immunoglobulin (the B cell receptor, BCR) on a naive B cell that possesses the matching specificity (one B cell clone, one specificity). The B cell internalizes the antigen, processes it, and displays peptide fragments on MHC class II molecules. A CD4+ helper T cell that recognizes the same antigen via the MHC II peptide complex provides co-stimulatory signals (CD40 ligand binding to CD40 on the B cell, plus cytokines including IL-4, IL-5, and IL-6). This dual signal (antigen plus T cell help) triggers the B cell to undergo clonal expansion, proliferating rapidly over 3 to 5 days to produce a large population of cells with identical antigen specificity. Most daughter cells differentiate into plasma cells (antibody secreting factories producing up to 2,000 antibody molecules per second per cell) while a smaller subset becomes long lived memory B cells.' },
        { id: 'kp2', weight: 2, description: 'The primary immune response occurs on first antigen exposure. After a lag period of 5 to 7 days (required for clonal expansion and plasma cell differentiation), antibody levels rise slowly, peak at approximately 10 to 14 days, and then decline. The initial antibody produced is predominantly IgM. The secondary (anamnestic) immune response occurs upon re-exposure to the same antigen. Memory B cells are activated much more rapidly, producing a response within 1 to 2 days (shorter lag). The antibody titer rises faster, reaches a much higher peak (10 to 100 fold greater than primary response), and is sustained for a longer duration. The predominant antibody class switches from IgM to IgG (class switching), which has higher affinity due to affinity maturation (somatic hypermutation and selection of high affinity B cell clones in germinal centers).' },
        { id: 'kp3', weight: 2, description: 'The immunoglobulin monomer consists of two identical heavy chains and two identical light chains (kappa or lambda), joined by disulfide bonds to form a Y shaped molecule. The Fab (fragment antigen binding) regions at the two tips contain the variable domains that confer antigen specificity. The Fc (fragment crystallizable) region at the stem mediates effector functions (complement activation, opsonization receptor binding, placental transfer). The five classes differ by heavy chain type: IgG (gamma heavy chain) is the most abundant serum antibody at 75 percent, crosses the placenta, is the primary antibody of the secondary response, and mediates opsonization and complement activation. IgM (mu heavy chain) is a pentamer in secreted form, the first antibody produced in a primary response, and is the most efficient at complement activation and agglutination. IgA (alpha heavy chain) is a dimer in secretory form found in mucosal secretions (saliva, tears, breast milk, gut), protecting mucosal surfaces. IgE (epsilon heavy chain) binds to mast cells and basophils via Fc receptors, mediating type I hypersensitivity (allergic) reactions and anti-parasitic defense. IgD (delta heavy chain) is found primarily on naive B cell surfaces as a co-receptor alongside IgM and its exact function remains incompletely understood.' },
      ],
      common_errors: [
        'Stating that IgG is the first antibody class produced in the primary response (IgM is produced first; IgG dominates the secondary response)',
        'Confusing Fab (antigen binding) with Fc (effector/crystallizable) regions of the immunoglobulin molecule',
        'Claiming that all activated B cells become plasma cells (a critical subset becomes memory cells that enable the secondary response)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'b-cell-activation-immunoglobulins',
    chapter: 'pp2-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 35',
      topic: 'b-cell-activation-immunoglobulins',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 8. T Cell Thymic Education & Antibody Effector Mechanisms
  {
    id: 'r-p2-wk2-8',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w2-thymic-selection-tolerance', 'atom-p2w2-antibody-effector-mechanisms'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe the process of T cell maturation in the thymus including positive selection in the thymic cortex and negative selection in the thymic medulla. Explain why these two selection processes are essential for generating a T cell repertoire that is both MHC restricted and self-tolerant. Then distinguish between the effector functions of CD4+ helper T cells and CD8+ cytotoxic T cells. Finally, describe the four major antibody effector mechanisms (neutralization, opsonization, complement activation, and agglutination) and explain their physiologic importance in pathogen clearance.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Immature T cell precursors (thymocytes) migrate from the bone marrow to the thymus, where they undergo a rigorous two-stage selection process that eliminates approximately 95 to 98 percent of developing thymocytes. Positive selection occurs in the thymic cortex: thymocytes whose T cell receptors (TCRs) can bind self MHC molecules (class I or class II) with moderate affinity receive survival signals and continue development. Thymocytes that cannot recognize self MHC at all die by neglect (apoptosis). This process ensures that all surviving T cells are MHC restricted (capable of recognizing antigen only when presented by self MHC). Thymocytes that bind MHC class I commit to the CD8+ lineage; those that bind MHC class II commit to the CD4+ lineage. Negative selection occurs primarily in the thymic medulla: thymocytes whose TCRs bind self peptide plus self MHC complexes with high affinity are eliminated by apoptosis. The transcription factor AIRE (autoimmune regulator) drives expression of tissue specific antigens in medullary thymic epithelial cells, ensuring that T cells reactive to self proteins from distant organs are deleted. This process establishes central self-tolerance.' },
        { id: 'kp2', weight: 2, description: 'CD4+ helper T cells are activated when their TCR recognizes a foreign peptide presented on MHC class II by a professional APC. Upon activation, CD4+ cells differentiate into effector subtypes including Th1 (secrete interferon gamma, activate macrophages and CD8+ cells for intracellular pathogen defense), Th2 (secrete IL-4, IL-5, IL-13; promote B cell class switching to IgE and eosinophil activation for parasitic defense and allergic responses), and Th17 (secrete IL-17; recruit neutrophils for extracellular bacterial and fungal defense). CD8+ cytotoxic T lymphocytes (CTLs) are activated when their TCR recognizes foreign peptide on MHC class I (found on all nucleated cells). CTLs kill target cells by releasing perforin (forms pores in the target cell membrane) and granzymes (serine proteases that enter through perforin pores and activate the caspase cascade to induce apoptosis). CTLs can also induce apoptosis through Fas ligand binding to Fas (CD95) on the target cell.' },
        { id: 'kp3', weight: 1, description: 'Antibodies eliminate pathogens through four major effector mechanisms. Neutralization: antibodies bind to pathogen surface molecules (viral attachment proteins, bacterial toxins), physically blocking them from interacting with host cell receptors; this prevents infection without requiring any other immune component. Opsonization: antibodies (especially IgG) coat pathogen surfaces, and phagocytes (neutrophils, macrophages) bearing Fc gamma receptors bind the Fc region to enhance phagocytic uptake, increasing killing efficiency by 100 fold or more. Complement activation: antigen-antibody complexes (IgG or IgM) activate the classical complement pathway (C1q binds to the Fc region), generating C3b for opsonization, C3a and C5a for inflammation and chemotaxis, and the C5b-9 membrane attack complex for direct lysis. Agglutination: antibodies (especially pentameric IgM with 10 binding sites) crosslink multiple antigens on different pathogens or cells, creating large clumps that are efficiently cleared by phagocytes and that are too large to disseminate through tissues.' },
      ],
      common_errors: [
        'Reversing positive and negative selection (positive selects for MHC recognition in the cortex; negative eliminates self-reactive T cells in the medulla)',
        'Stating that CD8+ T cells kill by phagocytosis (they kill by perforin and granzyme mediated apoptosis)',
        'Claiming that IgG is the best agglutinator (IgM, with 10 binding sites as a pentamer, is far more effective at agglutination)',
      ],
      minimum_passing_score: 60,
    },
    topic: 't-cell-maturation-antibody-effectors',
    chapter: 'pp2-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 35',
      topic: 't-cell-maturation-antibody-effectors',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  pp2-wk-2 Ch 33 DEPTH EXPANSION: RBC destruction, anemia, polycythemia
  //  3 additional synthesis questions covering chapter sections previously
  //  represented only in the MCQ bank (slides 22-29, 5-7).
  // ═══════════════════════════════════════════════════════════════════════

  // 9. RBC Senescence, Destruction & Bilirubin Metabolism
  {
    id: 'r-p2-wk2-9',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w2-rbc-lifespan-splenic-destruction', 'atom-p2w2-hemoglobin-catabolism-bilirubin'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe the lifespan and metabolic limitations of the mature red blood cell, the mechanism and primary site of senescent RBC removal, and the complete catabolic pathway of hemoglobin once a red blood cell is destroyed. Explain how iron is recycled, how the porphyrin ring is converted to bilirubin, and how bilirubin is ultimately processed and excreted. Finally, explain why hemolysis versus biliary obstruction produces different patterns of jaundice and why this distinction matters in perioperative assessment.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The mature red blood cell has a lifespan of approximately 120 days. Because it lacks a nucleus, mitochondria, and endoplasmic reticulum, it cannot synthesize new proteins or perform oxidative phosphorylation; it relies entirely on anaerobic glycolysis (the Embden Meyerhof pathway) to generate ATP. This ATP maintains membrane pliability, powers the Na+/K+ ATPase to preserve cation gradients, and keeps heme iron in the functional ferrous state. The pentose phosphate pathway generates NADPH to maintain reduced glutathione for antioxidant defense. As these enzyme systems progressively deplete with cell age, the RBC loses the ability to maintain its membrane and becomes rigid, fragile, and increasingly spherical.' },
        { id: 'kp2', weight: 2, description: 'Aged, fragile red cells can no longer deform to squeeze through narrow passages and rupture preferentially in the splenic red pulp cords and sinusoidal slits (1 to 3 micrometers wide), making the spleen the primary site of RBC removal (approximately 200 billion cells per day). Macrophages (splenic macrophages and hepatic Kupffer cells) phagocytose the released hemoglobin and degrade it: globin chains are hydrolyzed to amino acids and recycled; heme is split by heme oxygenase to release iron, which is returned to transferrin for reuse in the bone marrow or stored as ferritin; and the porphyrin ring is opened and converted first to biliverdin and then reduced to bilirubin (unconjugated, lipid soluble).' },
        { id: 'kp3', weight: 1, description: 'Unconjugated bilirubin travels in the blood bound to albumin, is taken up by hepatocytes, conjugated with glucuronic acid to become water soluble, and secreted into bile; intestinal bacteria convert it to urobilinogen, most of which is excreted as stercobilin in feces while a small fraction is reabsorbed and excreted as urobilin in urine. Excess bilirubin causes jaundice: prehepatic (hemolytic) jaundice elevates unconjugated bilirubin because excessive RBC breakdown overwhelms hepatic conjugation, whereas posthepatic (obstructive) jaundice elevates conjugated bilirubin because biliary outflow is blocked. Perioperative relevance includes hemolysis from transfusion reactions, mechanical heart valves, and cardiopulmonary bypass, which the CRNA must recognize.' },
      ],
      common_errors: [
        'Stating that mature RBCs use mitochondrial oxidative phosphorylation (they have no mitochondria and rely on anaerobic glycolysis)',
        'Claiming the liver is the primary site of senescent RBC destruction (the spleen is the primary graveyard; the liver assists)',
        'Confusing hemolytic jaundice (unconjugated bilirubin elevation) with obstructive jaundice (conjugated bilirubin elevation)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'rbc-senescence-bilirubin',
    chapter: 'pp2-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 33',
      topic: 'rbc-senescence-bilirubin',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 10. Anemia Classification & Circulatory Compensation
  {
    id: 'r-p2-wk2-10',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w2-anemia-types-classification', 'atom-p2w2-anemia-circulatory-effects'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Define anemia and classify the four major etiologic categories taught in this chapter (blood loss, aplastic, megaloblastic, and hemolytic), giving the underlying mechanism and the characteristic red cell morphology for each. Then describe the circulatory consequences of anemia, explaining the two distinct reasons anemia produces a high cardiac output state and why exercise capacity is markedly reduced. Include the time course of recovery after acute hemorrhage.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Anemia is a deficiency of hemoglobin that reduces the oxygen carrying capacity of blood. Blood loss anemia: after acute hemorrhage, plasma fluid volume is restored within 1 to 3 days while red cell concentration takes 3 to 6 weeks to recover, and the cells are initially normocytic; chronic blood loss depletes iron stores and produces hypochromic, microcytic cells. Aplastic anemia results from bone marrow failure caused by radiation, chemotherapy, chemical toxins, autoimmune destruction, or idiopathic causes; the cells are typically normocytic, and treatment requires transfusion and/or bone marrow transplantation.' },
        { id: 'kp2', weight: 2, description: 'Megaloblastic (macrocytic) anemia results from vitamin B12 and/or folate deficiency, which impairs DNA replication and causes nuclear maturation failure while cytoplasmic growth continues; the result is large, fragile, irregularly shaped macrocytes (MCV above 100 fL) that rupture easily and can produce profound anemia. Hemolytic anemia results from shortened red cell survival, caused either by hereditary defects of the membrane or hemoglobin (hereditary spherocytosis, sickle cell anemia) producing increased cellular fragility, or by immune mediated destruction (erythroblastosis fetalis, also called hemolytic disease of the newborn).' },
        { id: 'kp3', weight: 1, description: 'Anemia produces a high cardiac output state through two mechanisms. First, decreased blood viscosity (a low hematocrit lowers resistance to flow) increases venous return and therefore cardiac output. Second, decreased oxygen carrying capacity causes tissue hypoxia that triggers peripheral vasodilation, further increasing venous return and cardiac output. Despite this elevated resting output (often 2 to 3 times normal in severe anemia), exercise capacity is markedly decreased because the cardiac reserve is largely consumed at rest, leaving little additional output available to meet the increased oxygen demand of exercise, which can precipitate fatigue or high output cardiac failure.' },
      ],
      common_errors: [
        'Confusing the rapid restoration of fluid volume (1 to 3 days) with the slow restoration of RBC concentration (3 to 6 weeks) after hemorrhage',
        'Attributing the high cardiac output of anemia only to hypoxia, omitting the decreased viscosity mechanism',
        'Classifying megaloblastic anemia as microcytic (it is macrocytic; iron deficiency is microcytic)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'anemia-classification-circulation',
    chapter: 'pp2-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 33',
      topic: 'anemia-classification-circulation',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 11. Polycythemia, Hyperviscosity & Hematopoietic Regulation
  {
    id: 'r-p2-wk2-11',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w2-polycythemia-hyperviscosity', 'atom-p2w2-hematopoiesis-lineages'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Distinguish secondary polycythemia from polycythemia vera, including the underlying cause, the typical red cell count and hematocrit, and the effect on blood volume and viscosity. Explain the circulatory consequences of hyperviscosity. Then describe the regulation of hematopoiesis, including the sites of erythropoiesis across the lifespan, the role of growth and differentiation inducers, and the differentiation of the pluripotent hematopoietic stem cell into the major blood cell lineages.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Secondary polycythemia is an appropriate, erythropoietin driven increase in red cell mass (RBC count rising about 30 percent to 6 to 7 million per cubic millimeter) in response to chronic hypoxemia from heart or lung disease, or as physiologic polycythemia in people residing at high altitude (14,000 to 17,000 feet), where it markedly enhances exercise capacity. Polycythemia vera, in contrast, is a clonal myeloproliferative disorder in which a genetic abnormality of the hematopoietic stem cell drives autonomous, erythropoietin independent proliferation, usually of all blood cell lineages simultaneously.' },
        { id: 'kp2', weight: 2, description: 'In polycythemia vera the red cell count reaches 7 to 8 million per cubic millimeter, the hematocrit rises to 60 to 70 percent, the blood volume increases almost twofold, and blood viscosity can rise to as much as 3 times normal (approximately 10 times the viscosity of water). This hyperviscosity slows blood flow through vessels, dramatically increases the risk of thrombosis and tissue hypoxia, raises cardiac workload, and can contribute to hypertension. Treatment centers on therapeutic phlebotomy to lower the hematocrit and reduce viscosity. The CRNA must anticipate increased thrombotic risk and altered drug distribution in these patients.' },
        { id: 'kp3', weight: 1, description: 'The site of erythropoiesis shifts across the lifespan: the yolk sac during the first few weeks of gestation, the liver (with spleen and lymph nodes) during mid gestation, and the bone marrow from the last month of gestation through adulthood. Hematopoiesis is driven by growth inducers (growth factors such as interleukin 3) and differentiation inducers, and responds to physiologic demand (hypoxia stimulates erythropoiesis; infection stimulates leukopoiesis). The pluripotent hematopoietic stem cell differentiates through committed colony forming units: the myeloid pathway yields CFU-E (erythrocytes), CFU-GM (granulocytes and monocytes), and CFU-M (megakaryocytes and platelets), while the lymphoid pathway yields T and B lymphocytes. This single stem cell origin explains why polycythemia vera typically elevates all lineages.' },
      ],
      common_errors: [
        'Stating that polycythemia vera is erythropoietin driven (it is an autonomous clonal disorder; secondary polycythemia is the EPO driven type)',
        'Forgetting that hyperviscosity increases thrombosis risk and cardiac workload',
        'Claiming that adult erythropoiesis occurs primarily in the liver (the liver is the mid gestation site; bone marrow is the adult site)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'polycythemia-hematopoiesis',
    chapter: 'pp2-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 33',
      topic: 'polycythemia-hematopoiesis',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  pp2-wk-2 Ch 34 DEPTH EXPANSION: phagocytosis, inflammation, granulocyte
  //  specialization, and white cell disorders.
  //  3 additional synthesis questions covering chapter sections previously
  //  absent from the recall ladder (Ch 34 slides 13-17, 24-37).
  // ═══════════════════════════════════════════════════════════════════════

  // 12. Phagocytosis: Recognition, Opsonization & Intracellular Digestion
  {
    id: 'r-p2-wk2-12',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w2-phagocyte-recognition-opsonization', 'atom-p2w2-phagolysosome-digestion'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Define phagocytosis and explain how a neutrophil or macrophage distinguishes an appropriate target from the body\'s own healthy cells, including the role of opsonization. Trace the events from target recognition through engulfment, intracellular digestion, and disposal of the residual debris, naming the vesicles and enzymes involved. Contrast the phagocytic power of the neutrophil and the macrophage, and comment on why phagocyte function matters for a patient facing surgery.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Phagocytosis is the ingestion of particulate matter by a cell. Because unrestrained ingestion would injure healthy host tissue, phagocytes must distinguish foreign particles from the body\'s own cells. Three features mark a particle as an appropriate target: a rough surface, the absence of the protective protein coat that normal host cells display, and recognition by the immune system. The last and most powerful mechanism is opsonization, in which antibodies and activated complement components (such as C3b) coat the microbe; specific receptors on the phagocyte then bind this opsonin coat, greatly accelerating and increasing the rate of ingestion.' },
        { id: 'kp2', weight: 2, description: 'Once a target is recognized, the phagocyte projects pseudopods that surround the particle and fuse on the far side, enclosing it within a membrane bound vesicle called a phagosome. Neutrophils are mature cells already present in the blood that respond immediately upon reaching infected tissue, but each can ingest only a limited number of organisms before it dies. Monocytes that enter the tissues enlarge and mature into macrophages, which are far more powerful phagocytes: a single activated macrophage can ingest as many as 100 bacteria, can engulf much larger particles such as damaged red blood cells and malarial parasites, and can extrude the residual debris and survive to function for many months.' },
        { id: 'kp3', weight: 1, description: 'After the phagosome forms, it fuses with lysosomes and other cytoplasmic granules to create a phagolysosome, or digestive vesicle. The granules empty proteolytic enzymes into the vesicle to digest the ingested organism, and in macrophages they also release lipases that break down the lipid membranes of certain microbes, a step especially important for killing the tuberculosis bacillus. The undigestible residue is then expelled from the cell by exocytosis. This intracellular digestion works alongside the separate oxidative respiratory burst, so that ingested organisms are usually both chemically digested and oxidatively killed. Impaired phagocyte number or function leaves a surgical patient dangerously vulnerable to infection.' },
      ],
      common_errors: [
        'Stating that phagocytes ingest particles indiscriminately (recognition depends on a rough surface, lack of a protein coat, and opsonization by antibody and complement)',
        'Confusing the phagosome (the vesicle formed at engulfment) with the phagolysosome (formed after lysosomal fusion, where digestion occurs)',
        'Claiming the neutrophil is a more powerful phagocyte than the macrophage (the macrophage ingests far more, up to about 100 bacteria, and survives much longer)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'phagocytosis-recognition-digestion',
    chapter: 'pp2-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 34',
      topic: 'phagocytosis-recognition-digestion',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 13. The Inflammatory Response & the Bone Marrow's Systemic Reaction
  {
    id: 'r-p2-wk2-13',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w2-inflammation-signs-mediators', 'atom-p2w2-neutrophilia-marrow-csf'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Define inflammation, list its four cardinal signs, and describe the physiologic tissue changes and chemical mediators that produce them. Explain how an inflamed area is walled off and what pus is. Then describe the systemic, amplifying response to a significant infection: the development of neutrophilia and the signaling loop by which activated macrophages drive the bone marrow to increase leukocyte production. Note the time course over which neutrophils and then macrophages dominate the lesion.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Inflammation is a local tissue response to injury or infection, driven by chemical mediators and characterized by four cardinal signs: heat, redness, swelling, and pain. Physiologically it involves vasodilation with increased local blood flow (producing the heat and redness), increased capillary permeability that allows plasma proteins and fluid to leak into the interstitium (producing the swelling), coagulation of the interstitial fluid, accumulation of granulocytes and monocytes, and swelling of the tissue cells themselves. The chemical mediators responsible include histamine, bradykinin, serotonin, and prostaglandins, together with complement products, clotting system components, and lymphokines released by sensitized lymphocytes.' },
        { id: 'kp2', weight: 2, description: 'A key purpose of inflammation is to wall off the injured area from the surrounding tissues. Fibrinogen that has leaked from the permeable vessels clots within the interstitial spaces and the tissue lymphatics, which minimizes the flow of fluid and microbes into and out of the inflamed region and delays spread of the infection. Organisms vary in how readily they are contained: staphylococci provoke intense local inflammation and are walled off quickly, whereas streptococci provoke less intense walling and are more likely to spread. Pus is the accumulation of dead neutrophils, dead bacteria, dead macrophages, and necrotic tissue digested by proteases, together with tissue fluid, usually within a cavity at the site; over days to weeks it is gradually absorbed into the surrounding tissue and lymph.' },
        { id: 'kp3', weight: 1, description: 'A significant infection triggers a systemic, amplifying response. Intense inflammation produces neutrophilia, with the circulating neutrophil count rising from about 4,000 to 5,000 up to 15,000 to 25,000 per cubic millimeter, initially from mobilization of mature neutrophils already stored in the marrow. To sustain the supply, activated macrophages release tumor necrosis factor and interleukin 1, which act on the macrophages themselves and on endothelial cells, fibroblasts, and lymphocytes to produce colony stimulating factors (GM-CSF, G-CSF, and M-CSF); these drive the bone marrow to increase production of granulocytes and monocytes by 20 to 50 fold, with the first new mature cells appearing after 3 to 4 days. Resident and newly arriving macrophages provide the immediate first defense and then, over the following weeks, become the dominant inflammatory cell, clearing residual bacteria and necrotic debris.' },
      ],
      common_errors: [
        'Listing fewer than the four cardinal signs of inflammation (heat, redness, swelling, and pain) or omitting the vascular changes that cause them',
        'Stating that neutrophilia reflects new marrow production within minutes (the immediate rise is from mobilization of the stored marrow reserve; new production via colony stimulating factors takes 3 to 4 days)',
        'Forgetting that fibrinogen clotting is the mechanism that walls off the inflamed area',
      ],
      minimum_passing_score: 60,
    },
    topic: 'inflammation-mediators-marrow-response',
    chapter: 'pp2-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 34',
      topic: 'inflammation-mediators-marrow-response',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 14. Granulocyte Specialization & White Blood Cell Disorders
  {
    id: 'r-p2-wk2-14',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w2-eosinophil-basophil-mast', 'atom-p2w2-leukopenia-leukemia'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe the specialized defensive roles of eosinophils and of basophils and mast cells, including the substances they release and the immune reactions in which they participate, and explain at the cellular level how an immediate allergic or anaphylactic reaction is triggered. Then describe leukopenia and leukemia: the cause and clinical danger of leukopenia, and the classification and clinical consequences of leukemia. Highlight the points most relevant to anesthetic care.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Eosinophils are weak phagocytes that are particularly important in defense against parasitic infections such as schistosomiasis and trichinosis; they attach to the parasite and release killing agents including hydrolytic enzymes, reactive oxygen species, and a larvicidal polypeptide called major basic protein. Eosinophils also accumulate at sites of allergic reactions, partly in response to an eosinophil chemotactic factor released by basophils and mast cells, and they help detoxify some mediators. Basophils circulate in the blood and are functionally similar to the mast cells that reside in the tissues; both store and release histamine, bradykinin, serotonin, and heparin.' },
        { id: 'kp2', weight: 2, description: 'Mast cells and basophils are the central effector cells of immediate (type I) hypersensitivity. They bind immunoglobulin E (IgE) antibody to high affinity receptors on their surface; when a specific allergen cross links adjacent surface bound IgE molecules, the cells rapidly degranulate, releasing histamine, bradykinin, serotonin, heparin, leukotrienes, and several lysosomal enzymes. These mediators produce vasodilation, increased capillary permeability, bronchoconstriction, and the other manifestations of allergic and anaphylactic reactions. This mechanism is of direct concern in anesthesia, because perioperative anaphylaxis (for example to neuromuscular blocking drugs, antibiotics, or latex) is produced by exactly this IgE triggered mast cell and basophil degranulation, and can cause life threatening hypotension and bronchospasm.' },
        { id: 'kp3', weight: 1, description: 'Leukopenia is an abnormally low white blood cell count, usually caused by decreased production in the bone marrow from radiation, chemical toxins, or certain medications. Because it strips away phagocytic defense, ordinarily harmless organisms can cause severe infection, and mucous membrane ulceration or respiratory infection may appear within about two days of marrow shutdown; with supportive care the marrow stem cells can often reconstitute normal counts. Leukemia is the opposite disorder: an uncontrolled, clonal overproduction of abnormal white blood cells caused by a genetic mutation, classified as lymphocytic or myelogenous and as acute or chronic. The proliferating leukemic cells replace normal marrow (causing infection, bleeding, and pathologic fractures), infiltrate the spleen, lymph nodes, and liver, and produce metabolic wasting.' },
      ],
      common_errors: [
        'Confusing the roles of eosinophils (parasite defense and allergy) with those of basophils and mast cells (IgE mediated immediate hypersensitivity)',
        'Stating that allergic degranulation requires IgG or direct antigen contact (it is triggered by allergen cross linking of surface bound IgE)',
        'Confusing leukopenia (too few white cells from marrow failure) with leukemia (uncontrolled malignant overproduction of white cells)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'granulocyte-specialization-wbc-disorders',
    chapter: 'pp2-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 34',
      topic: 'granulocyte-specialization-wbc-disorders',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  pp2-wk-2 Ch 35 DEPTH EXPANSION: clinical & foundational immunology
  //  3 additional synthesis questions covering hypersensitivity & allergy,
  //  autoimmunity & immunization, and antigen recognition & immune
  //  specificity (Ch 35 slides 4, 10, 28-32).
  // ═══════════════════════════════════════════════════════════════════════

  // 15. Hypersensitivity Reactions & Clinical Allergic Disease
  {
    id: 'r-p2-wk2-15',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w2-hypersensitivity-classification', 'atom-p2w2-anaphylaxis-allergic-syndromes'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Classify the hypersensitivity reactions using the Gell and Coombs system (types I through IV), giving for each type the immune mediator, the typical time course, and a representative example, and explain the central distinction between immediate antibody mediated and delayed T cell mediated hypersensitivity. Then describe the major clinical syndromes of immediate (IgE mediated) allergy (anaphylaxis, urticaria, hay fever, and asthma), giving the principal mediators and standard treatment of each. Throughout, highlight the features most important to anesthetic management.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Hypersensitivity reactions are exaggerated immune responses that injure host tissue, divided into four Gell and Coombs types. Types I to III are antibody mediated and develop within minutes to hours (immediate). Type I (anaphylactic) is mediated by IgE bound to mast cells and basophils, which degranulate within minutes when allergen cross links surface IgE, producing anaphylaxis, urticaria, hay fever, and allergic asthma. Type II (cytotoxic) is mediated by IgG or IgM against antigens fixed on cell surfaces, causing destruction by complement, opsonized phagocytosis, or antibody dependent cytotoxicity (examples: transfusion reactions, autoimmune hemolytic anemia, myasthenia gravis). Type III (immune complex) results from soluble antigen antibody complexes depositing in vessels, glomeruli, and joints, activating complement and recruiting neutrophils (examples: systemic lupus erythematosus, poststreptococcal glomerulonephritis, serum sickness). Type IV (delayed) is fundamentally different: it is mediated by sensitized T cells rather than antibody, so it develops slowly and peaks at 48 to 72 hours (examples: contact dermatitis from poison ivy and nickel, the tuberculin skin test).' },
        { id: 'kp2', weight: 2, description: 'Anaphylaxis is the systemic, life threatening form of immediate hypersensitivity, caused by widespread mast cell and basophil degranulation. Histamine and other mediators produce generalized vasodilation (profound hypotension and distributive shock), greatly increased capillary permeability (intravascular volume loss, angioedema, and laryngeal edema), and leukotriene driven bronchospasm with wheezing. Because collapse can occur within minutes, the first line treatment is intramuscular epinephrine (reversing vasodilation and bronchospasm and supporting blood pressure), supported by antihistamines, fluids, and corticosteroids. This is a central anesthetic concern because perioperative anaphylaxis to neuromuscular blocking drugs, antibiotics, or latex presents as sudden hypotension and bronchospasm. Allergic asthma, the lower airway syndrome, is mediated largely by leukotrienes rather than primarily by histamine, causing sustained bronchospasm, airway edema, and mucus secretion; it is treated with beta-2 agonists, inhaled corticosteroids, and leukotriene receptor antagonists. Its leukotriene basis explains why beta agonists and steroids, rather than antihistamines, are the mainstays, and why airway instrumentation can provoke intraoperative bronchospasm in asthmatic patients.' },
        { id: 'kp3', weight: 1, description: 'The remaining immediate allergic syndromes are localized and milder. Urticaria (hives) is the cutaneous form: histamine release in the skin causes localized vasodilation with a red flare and increased permeability producing wheals and swelling, and it responds to antihistamines. Hay fever (allergic rhinitis) is localized to the upper respiratory mucosa and conjunctiva and is largely histamine mediated: inhaled allergen causes vascular dilation in the nasal passages, sinuses, and eyes with fluid leakage, producing congestion, rhinorrhea, and sneezing, and it is treated with antihistamines and local (intranasal) corticosteroids. The contrast among these syndromes illustrates the general rule that histamine driven reactions (urticaria, hay fever, and the early phase of anaphylaxis) respond to antihistamines, whereas leukotriene driven bronchoconstriction (asthma and the bronchospasm of anaphylaxis) requires bronchodilators, corticosteroids, and, for anaphylaxis, epinephrine.' },
      ],
      common_errors: [
        'Stating that type IV (delayed) hypersensitivity is antibody mediated (it is mediated by sensitized T cells and peaks at 48 to 72 hours)',
        'Claiming antihistamines are the first line treatment for anaphylaxis (intramuscular epinephrine is first line; antihistamines are adjuncts)',
        'Claiming asthma is primarily histamine mediated (it is mediated largely by leukotrienes, hence the use of beta agonists, inhaled steroids, and leukotriene blockers)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'hypersensitivity-allergic-disease',
    chapter: 'pp2-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 35',
      topic: 'hypersensitivity-allergic-disease',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 16. Autoimmunity (Failure of Tolerance) & Immunization
  {
    id: 'r-p2-wk2-16',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w2-autoimmunity-tolerance-failure', 'atom-p2w2-active-passive-immunization'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Explain how the loss of immunologic tolerance produces autoimmune disease, including the main mechanisms by which self tolerance fails, and describe four classic autoimmune disorders (rheumatic fever, poststreptococcal glomerulonephritis, myasthenia gravis, and systemic lupus erythematosus) with the target and mechanism of each. Then contrast active and passive immunization: describe the main vaccine types used for active immunity and why its protection is durable, and describe how passive immunity is conferred and why it is immediate but short lived. Note the points most relevant to anesthetic care.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Immunologic tolerance normally prevents attack on host tissue: self reactive clones that bind self antigen with high affinity are deleted during clonal selection (central tolerance), with anergy and regulatory T cells restraining any that escape (peripheral tolerance). Autoimmunity arises when these safeguards fail. The principal mechanisms are molecular mimicry (a microbial antigen resembles a self antigen, so the antipathogen response cross reacts with host tissue), exposure of sequestered self antigens after injury, and failure of clonal deletion or regulatory control. Rheumatic fever exemplifies molecular mimicry: antibodies against streptococcal M protein cross react with cardiac valve and joint antigens, producing carditis and arthritis. Poststreptococcal glomerulonephritis is a type III immune complex disease, with streptococcal antigen antibody complexes depositing in the glomerulus and activating complement. Systemic lupus erythematosus is a multisystem disease driven by autoantibodies against many self antigens (antinuclear and anti double stranded DNA antibodies), causing immune complex injury to skin, joints, kidneys, and serous membranes.' },
        { id: 'kp2', weight: 2, description: 'Active immunization stimulates the body to mount its own immune response and to generate memory B and T cells, so protection develops over one to several weeks but is durable and boostable. The main vaccine types are killed (inactivated) organisms (typhoid, whooping cough), toxoids (chemically inactivated exotoxins that retain antigenicity, such as diphtheria and tetanus toxoid), and live attenuated organisms (weakened so they replicate without causing disease, giving the strongest and most durable response, as in smallpox, yellow fever, oral polio, and measles). Because memory is created, re-exposure triggers a rapid, amplified secondary response. Passive immunization instead transfers preformed antibodies (or activated T cells) from an immune donor, giving immediate protection but engaging no memory, so it is temporary, lasting only about two to three weeks as the transferred antibody is catabolized. Examples include maternal IgG across the placenta, IgA in breast milk, antitoxins, antivenoms, and pooled or specific human immunoglobulin given after exposure to agents such as tetanus or rabies.' },
        { id: 'kp3', weight: 1, description: 'Myasthenia gravis is the fourth classic autoimmune disorder and the one most important in anesthesia: it is a type II disease in which autoantibodies are directed against the nicotinic acetylcholine receptors at the neuromuscular junction, reducing the number of functional receptors and causing fatigable skeletal muscle weakness. Affected patients are markedly sensitive to nondepolarizing neuromuscular blocking drugs (so doses must be greatly reduced) and relatively resistant to succinylcholine, making neuromuscular monitoring essential. Autoimmunity and immunization are conceptually linked as two faces of acquired immunity governed by tolerance and memory: autoimmunity is a breakdown of self tolerance that turns the adaptive response against the host, whereas immunization is the deliberate, beneficial harnessing of the same memory generating machinery to protect against pathogens. Both ultimately depend on the specificity and memory of clonally selected lymphocytes.' },
      ],
      common_errors: [
        'Stating that passive immunization generates lasting immunity or memory (it gives immediate but temporary protection lasting about two to three weeks)',
        'Forgetting that myasthenia gravis patients are very sensitive to nondepolarizing neuromuscular blockers and resistant to succinylcholine',
        'Confusing the mechanism of rheumatic fever (molecular mimicry) with that of poststreptococcal glomerulonephritis (immune complex deposition)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'autoimmunity-immunization',
    chapter: 'pp2-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 35',
      topic: 'autoimmunity-immunization',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 17. Antigen Recognition, Haptens & the Molecular Basis of Specificity
  {
    id: 'r-p2-wk2-17',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w2-antigen-epitope-hapten', 'atom-p2w2-antibody-diversity-clonal-selection'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Define antigen, immunogen, epitope, and hapten, and state the molecular properties that make a substance antigenic, including why haptens matter in drug allergy. Then explain how the immune system generates an enormous diversity of antibody and T cell receptor specificities from a limited number of genes (V(D)J recombination, combinatorial and junctional diversity), and state the clonal selection principle, including the rule that each lymphocyte clone has a single specificity fixed before antigen exposure. Note any points relevant to anesthetic drug allergy.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'An antigen is any substance specifically recognized and bound by an antibody or lymphocyte receptor, and an immunogen is an antigen that can also provoke an adaptive response on its own. Antigens are usually proteins or large polysaccharides bearing recurring surface groups, and strong immunogenicity requires foreignness (recognition as non self), sufficient molecular size (generally above roughly 8,000 daltons), and chemical complexity. The specific small region actually bound by a given antibody or receptor is the epitope (antigenic determinant); one large antigen carries many epitopes and can engage several clones at once. A hapten is a small molecule (well under 1,000 daltons) that is antigenic but not immunogenic alone: it becomes immunogenic only after binding covalently to a carrier protein. This is clinically critical because many drugs act as haptens, covalently binding host proteins to form hapten carrier complexes that sensitize the immune system; penicillins and other small reactive drugs cause allergy and IgE mediated anaphylaxis by exactly this mechanism.' },
        { id: 'kp2', weight: 2, description: 'The immune system must recognize millions of epitopes despite having far too few genes to encode a unique receptor for each. The solution is somatic gene rearrangement: immunoglobulin and T cell receptor genes exist as libraries of small Variable (V), Diversity (D), and Joining (J) segments, and each developing lymphocyte randomly splices together one segment from each library by V(D)J recombination (performed by the RAG enzymes). The many possible segment combinations give combinatorial diversity, which is multiplied by junctional diversity (imprecise joining and random nucleotide addition at the splice sites) and by the pairing of two independently rearranged chains, generating on the order of billions of distinct specificities. This explains the statement in the chapter that the receptor genes have hundreds of smaller portions combined in varying ways to produce millions of possible specificities, and it is the molecular basis of the almost limitless antibody specificity of acquired immunity.' },
        { id: 'kp3', weight: 1, description: 'Each lymphocyte completes its gene rearrangement before encountering any antigen, so every lymphocyte and its clonal descendants express receptors of one single specificity, recognizing one epitope of one antigen. The body thus generates in advance, at random, an enormous repertoire of preformed clones each committed to a different specificity. This underlies the clonal selection principle: the antigen does not instruct or mold the receptor; it simply selects the rare preexisting clone whose receptor already fits it and drives that clone to proliferate and differentiate into effector and memory cells. Clonal selection accounts for the specificity of the adaptive response, for immunologic memory (expanded memory clones persist and respond faster on re-exposure), and for self tolerance (clones recognizing self antigen are deleted during development), tying together antigen recognition, diversity, and the behavior of B and T cells described throughout the chapter.' },
      ],
      common_errors: [
        'Stating that antigen instructs or molds the antibody to fit it (clonal selection holds the matching clone preexists and antigen merely selects and expands it)',
        'Stating that a hapten can provoke an immune response by itself (it is antigenic but becomes immunogenic only after conjugating to a carrier protein)',
        'Claiming a separate inherited gene encodes each antibody specificity (diversity is generated somatically by V(D)J recombination of gene segments)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'antigen-recognition-immune-specificity',
    chapter: 'pp2-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 35',
      topic: 'antigen-recognition-immune-specificity',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // ===== CH 37 / pp2-wk-3 (Hemostasis & Blood Coagulation) synthesis =====

  // CH 37 / pp2-wk-3 — Synthesis 1: Primary hemostasis (vasoconstriction + platelet plug)
  {
    id: 'r-p2-wk3-1',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3-vascular-constriction-mechanisms', 'atom-p2w3-platelet-plug-formation'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe primary hemostasis, the immediate response to vascular injury that occurs before the coagulation cascade produces fibrin. Explain the mechanisms of vascular constriction and how its intensity relates to the severity of trauma. Then describe the formation of the platelet plug, including the roles of exposed collagen and von Willebrand factor, platelet adhesion, activation, degranulation, and aggregation. Finally, explain how these two steps work together to limit blood loss and describe the bleeding pattern that appears when platelets are deficient.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'When a vessel is cut or ruptured the first response is immediate constriction of its wall, which narrows the lumen and reduces blood loss. Three mechanisms drive this: local myogenic spasm, a direct contractile response of vascular smooth muscle to injury that accounts for most of the constriction; local humoral vasoconstrictors released from traumatized tissue and from activated platelets, including thromboxane A2 and serotonin; and nervous reflexes triggered by pain and sensory impulses. The degree of spasm is proportional to the severity of trauma, so a crushed vessel constricts more forcefully than a cleanly cut one and often bleeds less. The spasm can last from minutes to hours, buying time for the platelet plug and clot to form.' },
        { id: 'kp2', weight: 2, description: 'Within seconds, platelets contact the exposed subendothelial collagen and adhere through glycoprotein Ib binding to von Willebrand factor, which bridges the platelet to collagen. Adhesion activates the platelet, which changes shape, extends pseudopods, and degranulates, releasing adenosine diphosphate (ADP) and thromboxane A2. These mediators activate and recruit additional passing platelets, and the recruited platelets aggregate by linking to one another through glycoprotein IIb/IIIa receptors that bind fibrinogen. This positive feedback builds a platelet plug that can seal a small break within seconds, and the plug is later reinforced by fibrin during secondary hemostasis (coagulation).' },
        { id: 'kp3', weight: 1, description: 'Vascular constriction and platelet plugging together constitute primary hemostasis and are sufficient to seal the many minute vascular breaks that occur daily; the slower coagulation cascade then deposits fibrin to make the seal permanent (secondary hemostasis). When platelets are deficient or dysfunctional, primary hemostasis fails and a characteristic pattern appears: petechiae and purpura in the skin, mucosal and gum bleeding, and a prolonged bleeding time, in contrast to the deep joint and tissue bleeding of clotting factor disorders. This distinction is clinically central, because preoperative assessment of bleeding risk depends on recognizing whether a defect lies in primary (platelet and vessel) or secondary (coagulation factor) hemostasis.' },
      ],
      common_errors: [
        'Confusing platelet adhesion (single platelets binding collagen via glycoprotein Ib and von Willebrand factor) with aggregation (platelets binding one another via glycoprotein IIb/IIIa and fibrinogen)',
        'Stating that a cleanly cut vessel constricts more than a crushed one (greater trauma produces greater spasm)',
        'Attributing petechiae and mucosal bleeding to clotting factor deficiency (that superficial pattern is the hallmark of platelet or primary hemostatic failure)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'primary-hemostasis-vasoconstriction-platelet-plug',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 37',
      topic: 'primary-hemostasis-vasoconstriction-platelet-plug',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // CH 37 / pp2-wk-3 — Synthesis 2: Platelet biology (structure + function)
  {
    id: 'r-p2-wk3-2',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3-platelet-structure-production', 'atom-p2w3-platelet-functional-components'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Explain how the structure, production, and internal composition of platelets equip them for their hemostatic roles. Describe the origin, size, normal concentration, and lifespan of platelets and how they are cleared. Then describe their functional components, including contractile proteins, synthetic and storage organelles and their products, energy sources, and the special properties of the platelet membrane. Finally, integrate these facts to explain how a platelet without a nucleus can adhere, change shape, degranulate, retract a clot, and provide a surface for coagulation, and note one clinical implication.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Platelets (thrombocytes) are anucleate cytoplasmic fragments about 1 to 4 micrometers in diameter, pinched off in the thousands from giant megakaryocytes in the bone marrow. The normal blood concentration is about 150,000 to 300,000 per microliter, and because they lack a nucleus they cannot divide. Their functional lifespan is only about 8 to 12 days, after which they are removed by tissue macrophages, particularly in the spleen. These numbers matter clinically: counts below roughly 50,000 per microliter increase bleeding risk and counts below about 10,000 per microliter risk spontaneous hemorrhage, while the short lifespan explains the transient benefit of platelet transfusion and the prolonged effect of irreversible platelet inhibitors such as aspirin.' },
        { id: 'kp2', weight: 2, description: 'Despite having no nucleus, platelets are metabolically active. They contain the contractile proteins actin, myosin, and thrombosthenin that drive shape change and clot retraction; residual endoplasmic reticulum and Golgi that synthesize enzymes, prostaglandins (including thromboxane A2 precursors), a fibrin stabilizing factor, and platelet derived growth factor, and that store calcium; and mitochondria that make ATP and ADP. The membrane is specialized: a surface glycoprotein coat repels normal intact endothelium but binds injured surfaces and exposed collagen, and membrane phospholipids (platelet factor 3) provide a procoagulant surface on which clotting factor complexes assemble.' },
        { id: 'kp3', weight: 1, description: 'These components explain how a fragment with no nucleus performs complex hemostatic work: the glycoprotein coat and von Willebrand factor mediate adhesion, the contractile proteins produce the activation shape change and later clot retraction, the granules supply ADP and thromboxane A2 to recruit more platelets, and the membrane phospholipids catalyze the coagulation cascade, so the platelet bridges primary and secondary hemostasis. Clinically, because platelets cannot make new protein from a nucleus and the cyclooxygenase that forms thromboxane A2 is blocked irreversibly by aspirin, a single dose of aspirin impairs platelet function for the remaining lifespan of the existing platelets, which is why aspirin is often held before surgery.' },
      ],
      common_errors: [
        'Calling platelets complete nucleated cells that divide (they are anucleate megakaryocyte fragments with a lifespan of about 8 to 12 days)',
        'Forgetting that platelet membrane phospholipids (platelet factor 3) provide the catalytic surface for the clotting cascade',
        'Confusing platelet derived growth factor with a clotting factor (it promotes vessel wall repair, not coagulation)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'platelet-biology-structure-function',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 37',
      topic: 'platelet-biology-structure-function',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // CH 37 / pp2-wk-3 — Synthesis 3: Common pathway and clot maturation
  {
    id: 'r-p2-wk3-3',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3-common-pathway-thrombin-fibrin', 'atom-p2w3-clot-extension-retraction-feedback'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe the final common pathway of coagulation and the maturation of the clot. Explain how prothrombin activator and calcium generate thrombin, how thrombin converts fibrinogen to fibrin, and how fibrin stabilizing factor (factor XIII) strengthens the meshwork. Then explain the positive feedback by which thrombin amplifies its own formation, and describe the mechanism, timing, and purpose of clot retraction. Finally, integrate these into the overall picture of secondary hemostasis and explain why calcium and platelets are each indispensable.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The common pathway begins when prothrombin activator, produced by either the extrinsic or intrinsic pathway, splits prothrombin (factor II) into thrombin in a reaction that requires calcium. Thrombin, a protease, cleaves small peptides from fibrinogen to form fibrin monomers, which polymerize spontaneously within seconds into fibrin fibers that form the reticulum of the clot and trap platelets and blood cells. Initially the fibrin is held by weak noncovalent bonds; thrombin also activates fibrin stabilizing factor (factor XIII), which, with calcium, forms covalent cross links between fibrin strands, converting the fragile meshwork into a strong stable clot. Calcium is required at multiple steps, which is why citrate, by chelating calcium, prevents stored blood from clotting.' },
        { id: 'kp2', weight: 2, description: 'Once formed, thrombin drives a powerful positive feedback: it acts on prothrombin and on other clotting factors to generate still more thrombin and prothrombin activator, and it activates platelets, so the clot grows and propagates at its periphery until bleeding is sealed. Within about 20 to 60 minutes the clot retracts: platelets bound to the fibrin fibers contract using actin, myosin, and thrombosthenin (an active process needing ATP and calcium), squeezing out serum and pulling the broken vessel edges together. Serum is plasma from which fibrinogen and most clotting factors have been removed, so unlike plasma it cannot clot. Effective retraction therefore requires an adequate number of functioning platelets.' },
        { id: 'kp3', weight: 1, description: 'Together these steps are secondary hemostasis: prothrombin activator gives thrombin, thrombin gives cross linked fibrin, positive feedback amplifies the response, and platelet driven retraction consolidates and seals the wound. The system depends absolutely on calcium (so calcium chelators such as citrate are anticoagulant in a collection tube) and on platelets (which supply both the phospholipid surface for the cascade and the contractile force for retraction), illustrating how primary and secondary hemostasis are interdependent rather than separate. The same dependence explains why massive transfusion of citrated blood can lower ionized calcium and impair clotting, a point of practical importance during large volume resuscitation.' },
      ],
      common_errors: [
        'Saying thrombin acts on prothrombin to make fibrin (thrombin is made from prothrombin by prothrombin activator, then thrombin acts on fibrinogen to make fibrin)',
        'Omitting fibrin stabilizing factor XIII, which covalently cross links and strengthens the otherwise weak fibrin meshwork',
        'Confusing serum with plasma, or forgetting that clot retraction requires platelets',
      ],
      minimum_passing_score: 60,
    },
    topic: 'common-pathway-clot-formation-retraction',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 37',
      topic: 'common-pathway-clot-formation-retraction',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // CH 37 / pp2-wk-3 — Synthesis 4: Extrinsic vs intrinsic pathways and their convergence
  {
    id: 'r-p2-wk3-4',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3-extrinsic-pathway-tissue-factor', 'atom-p2w3-intrinsic-pathway-contact-activation'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Compare and contrast the extrinsic and intrinsic pathways that generate prothrombin activator. For each, give the trigger, the key clotting factors in sequence, the role of calcium and phospholipid, and the speed of clotting. Explain where and how the two pathways converge on the common pathway. Finally, relate each pathway to the laboratory test that assesses it and to the bleeding disorders and anticoagulants that affect it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The extrinsic pathway is triggered by trauma to the vessel wall and surrounding tissue, which releases tissue factor (tissue thromboplastin, factor III), a lipoprotein and phospholipid complex. Tissue factor complexes with factor VII to form tissue factor and VIIa, which, with calcium, activates factor X to Xa. Activated factor X combines with factor V, tissue phospholipid, and calcium to form prothrombin activator. Because it has few steps, the extrinsic pathway is explosive and can produce clotting in as little as 15 seconds. The extrinsic and common pathways are assessed by the prothrombin time, reported as the INR, which is the test used to monitor warfarin.' },
        { id: 'kp2', weight: 2, description: 'The intrinsic pathway begins with trauma to the blood itself or contact with collagen, which activates factor XII (aided by high molecular weight kininogen and prekallikrein) and causes platelets to release phospholipid. Factor XIIa activates XI, XIa activates IX, and IXa together with activated factor VIII, platelet phospholipid, and calcium activates factor X to Xa. The intrinsic pathway is slower, usually taking 1 to 6 minutes, because it has many more steps. Deficiency of factor VIII or IX (hemophilia A or B) cripples it. The intrinsic and common pathways are assessed by the activated partial thromboplastin time (aPTT), which is prolonged in hemophilia and used to monitor heparin.' },
        { id: 'kp3', weight: 1, description: 'Both pathways converge at the activation of factor X: from Xa onward they share the identical common pathway (Xa plus factor V and phospholipid forms prothrombin activator, which makes thrombin, which makes fibrin), so the two routes are alternative ways of reaching the same endpoint, and in the body they act together, with tissue factor initiating clotting and the intrinsic pathway amplifying it. Clinically the two tests map onto the two pathways: a prolonged PT or INR points to the extrinsic or common pathway (warfarin, factor VII deficiency, vitamin K deficiency, liver disease), while a prolonged aPTT points to the intrinsic or common pathway (heparin, hemophilia A and B), and this pattern guides diagnosis of a bleeding patient.' },
      ],
      common_errors: [
        'Stating the pathways never meet (both converge at factor X and share the common pathway to thrombin and fibrin)',
        'Matching the wrong test to the pathway (PT and INR assess the extrinsic and common pathways and monitor warfarin; aPTT assesses the intrinsic and common pathways and monitors heparin)',
        'Claiming the intrinsic pathway is faster than the extrinsic (the extrinsic pathway is explosive at under 15 seconds, whereas the intrinsic takes 1 to 6 minutes)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'extrinsic-intrinsic-pathways-convergence',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 37',
      topic: 'extrinsic-intrinsic-pathways-convergence',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // CH 37 / pp2-wk-3 — Synthesis 5: Limiting and dissolving the clot
  {
    id: 'r-p2-wk3-5',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3-endogenous-anticoagulants', 'atom-p2w3-fibrinolysis-plasmin-tpa'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Explain how the body keeps clotting localized and then dissolves clots once they are no longer needed. Describe the endothelial and plasma mechanisms that prevent and limit clotting (endothelial surface properties, thrombomodulin and protein C, antithrombin III, and adsorption of thrombin by fibrin). Then describe the fibrinolytic system (plasminogen, tissue plasminogen activator, and plasmin). Finally, integrate these opposing systems with the procoagulant cascade and note the therapeutic agents that exploit each.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Intact endothelium resists clotting because its surface is smooth (preventing contact activation) and coated with a glycocalyx that repels platelets and factors, and because it carries thrombomodulin, which binds thrombin; the thrombomodulin and thrombin complex activates protein C, which, with protein S, inactivates activated factors V and VIII. Once thrombin is formed it is further controlled in two ways: the polymerizing fibrin adsorbs about 85 to 90 percent of the thrombin, localizing it to the clot, and antithrombin III binds and inactivates the thrombin that escapes (over 12 to 20 minutes) as well as activated factors Xa, IXa, XIa, and XIIa. Together these mechanisms confine clotting to the site of injury.' },
        { id: 'kp2', weight: 2, description: 'Clot removal is the job of the fibrinolytic system. Plasma plasminogen (profibrinolysin) is trapped within a forming clot but is inactive. Over the following days injured tissue and endothelium release tissue plasminogen activator (tPA), which converts the trapped plasminogen into plasmin (fibrinolysin), so plasmin is generated mainly inside the clot. Plasmin is a protease that digests the fibrin fibers and also destroys fibrinogen and factors V, VIII, prothrombin, and XII, dissolving the clot, reopening (recanalizing) occluded small vessels, and clearing the microscopic clots that constantly form in small vessels throughout the body.' },
        { id: 'kp3', weight: 1, description: 'Hemostasis is thus a balance between procoagulant forces (the cascade and platelet plug) and anticoagulant and fibrinolytic forces; in health these are tuned so a clot forms exactly where and when it is needed and is removed afterward, and disease or drugs shift the balance. Therapeutically, several agents map onto these natural systems: heparin potentiates antithrombin III; warfarin depletes the vitamin K dependent procoagulant factors; and recombinant tPA and related thrombolytics drive plasmin generation to dissolve pathologic clots. Recognizing which arm of the system an agent acts on clarifies its onset, the laboratory test used to follow it, and how it is reversed, which is the basis of rational perioperative anticoagulation management.' },
      ],
      common_errors: [
        'Stating that activated protein C inactivates factors II and X (it inactivates activated factors V and VIII)',
        'Confusing plasminogen with plasmin, or forgetting that tPA is the physiologic activator and the basis of thrombolytic therapy',
        'Confusing antithrombin III (a circulating inhibitor of thrombin and other factors, potentiated by heparin) with thrombomodulin (an endothelial protein that activates protein C)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'clot-limitation-anticoagulants-fibrinolysis',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 37',
      topic: 'clot-limitation-anticoagulants-fibrinolysis',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // CH 37 / pp2-wk-3 — Synthesis 6: Pharmacologic anticoagulation (heparin + warfarin)
  {
    id: 'r-p2-wk3-6',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3-heparin-antithrombin-mechanism', 'atom-p2w3-warfarin-vitamin-k-mechanism'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Compare heparin and warfarin as anticoagulants. For each, describe the mechanism of action, the clotting factors or proteins affected, the speed of onset and route, the typical clinical use, the laboratory test used for monitoring, and the method of reversal. Then integrate the two by explaining why they are often started together and how vitamin K links warfarin to the clotting factors, and note the relevant INR targets.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Heparin is a highly negatively charged polysaccharide that works by binding antithrombin III and increasing its activity 100 to 1000 fold; the potentiated antithrombin III then rapidly inactivates thrombin and activated factors XII, XI, X, and IX. Because it acts on existing plasma proteins, heparin works almost immediately and is given parenterally for acute anticoagulation, such as treatment of venous thrombosis and pulmonary embolism, and to prevent clotting in cardiopulmonary bypass and hemodialysis circuits. Its effect on the intrinsic and common pathways is monitored with the activated partial thromboplastin time (aPTT), and it is reversed rapidly by protamine, which binds and neutralizes the heparin molecule.' },
        { id: 'kp2', weight: 2, description: 'Warfarin (a coumarin) inhibits vitamin K epoxide reductase complex 1 (VKOR c1), the enzyme that recycles vitamin K. Vitamin K is needed by the liver to make functional prothrombin (II) and factors VII, IX, and X (and proteins C and S), so by depleting active vitamin K warfarin depletes these factors. Because it blocks only the synthesis of new factors and existing factors must be cleared first, warfarin acts slowly over days and is taken orally for long term anticoagulation. It is monitored by the prothrombin time as the INR, with targets near 2.0 to 3.0 for atrial fibrillation and deep vein thrombosis or pulmonary embolism and 2.5 to 3.5 for mechanical heart valves; it is reversed by vitamin K (slow) and by fresh frozen plasma or prothrombin complex (immediate).' },
        { id: 'kp3', weight: 1, description: 'The two drugs are complementary in onset, which is why anticoagulation is often begun with heparin for immediate effect while warfarin is started at the same time and continued once its slow effect develops, after which heparin is stopped (bridging). They also illustrate the two laboratory axes: heparin prolongs the aPTT (intrinsic and common pathways) and warfarin prolongs the PT and INR (extrinsic and common pathways), and each has a specific antidote (protamine for heparin, vitamin K and plasma for warfarin). Understanding these differences is essential for perioperative management, because the timing of stopping and restarting each agent, and the choice of reversal, depends directly on their mechanisms.' },
      ],
      common_errors: [
        'Stating heparin and warfarin act on the same timescale (heparin acts immediately, whereas warfarin acts over days because existing factors must be cleared)',
        'Mismatching the antidotes (protamine reverses heparin, whereas vitamin K and fresh frozen plasma reverse warfarin)',
        'Listing the wrong monitored test (heparin is followed by the aPTT, warfarin by the PT and INR)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'pharmacologic-anticoagulation-heparin-warfarin',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 37',
      topic: 'pharmacologic-anticoagulation-heparin-warfarin',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // CH 37 / pp2-wk-3 — Synthesis 7: Coagulation factor bleeding disorders
  {
    id: 'r-p2-wk3-7',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3-hemophilia-factor-deficiencies', 'atom-p2w3-vitamin-k-deficiency-coagulopathy'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Explain how deficiencies of coagulation factors cause excessive bleeding, contrasting hemophilia with vitamin K deficiency. For hemophilia, describe the two types and their factor deficiencies, the inheritance, the pathway affected, the bleeding pattern, and the abnormal test. For vitamin K deficiency, describe the dependent factors, why fat absorption and the liver matter, the common causes, the abnormal test, and treatment. Then integrate the two and explain how the bleeding pattern together with the PT and aPTT helps distinguish factor deficiencies from platelet disorders.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Hemophilia is an inherited deficiency of a single intrinsic pathway factor. Hemophilia A (about 85 percent of cases, roughly 1 in 10,000 males) is deficiency of factor VIII; hemophilia B (about 15 percent, roughly 1 in 60,000 males) is deficiency of factor IX. Both genes are on the X chromosome, so inheritance is X linked recessive and the disease is expressed almost entirely in males, with females usually carriers. Because the platelet plug forms normally but the cascade is slowed, patients bleed excessively after minor trauma and characteristically into joints, muscles, and deep tissues. The intrinsic pathway defect prolongs the aPTT with a normal PT, and treatment is replacement of the missing factor.' },
        { id: 'kp2', weight: 2, description: 'Vitamin K is needed by the liver to make functional prothrombin (II) and factors VII, IX, and X (and protein C). Because it is fat soluble, vitamin K requires bile and normal fat absorption, and it comes from diet and from intestinal bacteria. Deficiency arises from biliary obstruction or absence of bile, fat malabsorption, broad spectrum antibiotics, and the newborn period, and hepatocellular disease causes bleeding both by failing to synthesize factors and by impairing bile dependent absorption. Deficiency prolongs the PT first because factor VII has the shortest half life. Treatment is vitamin K, which acts over hours, with fresh frozen plasma when immediate correction is needed.' },
        { id: 'kp3', weight: 1, description: 'Both disorders impair secondary hemostasis, so both produce deep tissue bleeding rather than the petechiae and mucosal bleeding of platelet disorders, but they differ in test pattern: hemophilia isolates the intrinsic pathway and prolongs only the aPTT, whereas vitamin K deficiency and liver disease prolong the PT (and eventually the aPTT) because they affect factors of both the extrinsic and common pathways. Reading the bleeding pattern together with the PT, aPTT, and platelet count is the practical way to localize a bleeding defect: an isolated long aPTT with deep bleeding suggests hemophilia, a long PT suggests vitamin K deficiency or liver disease, and petechiae with a low platelet count or long bleeding time suggests a platelet problem. This localization is central to preoperative bleeding assessment.' },
      ],
      common_errors: [
        'Swapping the hemophilia deficiencies (A is factor VIII, B is factor IX) or calling hemophilia a platelet disorder',
        'Forgetting that vitamin K is fat soluble, so biliary obstruction and fat malabsorption are major causes of deficiency',
        'Mixing up the test patterns (hemophilia prolongs only the aPTT, whereas vitamin K deficiency and liver disease prolong the PT)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'coagulation-factor-bleeding-disorders',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 37',
      topic: 'coagulation-factor-bleeding-disorders',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // CH 37 / pp2-wk-3 — Synthesis 8: Thrombosis and consumptive coagulopathy
  {
    id: 'r-p2-wk3-8',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3-thrombosis-embolism-disorders', 'atom-p2w3-dic-thrombocytopenia'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe disorders at the opposite ends of the hemostatic balance: excessive pathologic clotting and consumptive failure of clotting. Define thrombus and embolus, give the conditions that promote abnormal clotting, and describe pulmonary embolism and its treatment. Then describe disseminated intravascular coagulation (DIC) and thrombocytopenia, including why DIC paradoxically causes bleeding and the platelet thresholds that make thrombocytopenia dangerous. Finally, integrate these to show how the same hemostatic system produces both thrombosis and hemorrhage depending on the balance, and note the relevant treatments.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'A thrombus is an abnormal clot in an intact vessel; an embolus is a thrombus or fragment that has broken loose and travels. Abnormal clotting is promoted by a roughened or damaged endothelial surface (atherosclerosis, infection, trauma) and by sluggish or stagnant flow, which lets activated factors accumulate; stasis occurs with prolonged air travel, bed rest, and orthopedic immobilization, and a hypercoagulable state of the blood adds a third factor. A pulmonary embolus usually arises from deep vein thrombosis in the legs, travels through the right heart, and occludes pulmonary arteries, which can be rapidly fatal. Treatment includes thrombolytics such as tPA, embolectomy, and anticoagulation to prevent recurrence, with prophylaxis in immobilized patients.' },
        { id: 'kp2', weight: 2, description: 'Disseminated intravascular coagulation follows massive tissue damage or sepsis, which floods the blood with procoagulants and causes widespread microvascular clotting; paradoxically this consumes platelets and clotting factors faster than they are replaced, leaving the patient bleeding from many sites at once, so DIC is a consumptive coagulopathy treated by correcting the cause and replacing platelets and factors. Thrombocytopenia is a low platelet count that causes bleeding from small venules and capillaries with petechiae and thrombocytopenic purpura, often idiopathic; a count below about 50,000 per microliter gives modest bleeding while a count below about 10,000 per microliter is life threatening, and severe cases are treated with platelet transfusion that lasts only days.' },
        { id: 'kp3', weight: 1, description: 'These disorders show that the hemostatic system can fail in opposite directions: too much clotting causes thrombosis and embolism, while consumption of clotting elements (DIC) or a low platelet count causes hemorrhage, and DIC remarkably produces both at once, microvascular clotting together with diffuse bleeding. The same tools that treat one extreme can worsen the other, so therapy depends on reading the balance: thrombolytics and anticoagulants for thrombosis, but replacement of platelets and factors plus treatment of the underlying trigger for consumptive bleeding. For the anesthetist this balance is a constant perioperative concern, since surgery, immobility, sepsis, and massive transfusion can each tip a patient toward thrombosis or toward bleeding.' },
      ],
      common_errors: [
        'Stating DIC causes only clotting (its consumption of platelets and factors paradoxically causes bleeding from multiple sites)',
        'Confusing thrombus and embolus, or forgetting that most pulmonary emboli arise from deep vein thrombosis of the legs',
        'Mixing up the platelet thresholds (below about 50,000 per microliter gives modest bleeding, whereas below about 10,000 per microliter is life threatening)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'thrombosis-consumptive-coagulopathy',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 37',
      topic: 'thrombosis-consumptive-coagulopathy',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // ===== CH 38 / pp2-wk-3 (Pulmonary Ventilation) synthesis =====

  // CH 38 / pp2-wk-3 — Synthesis 9: Gas laws governing ventilation and diffusion
  {
    id: 'r-p2-wk3-9',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3v-boyle-pressure-volume', 'atom-p2w3v-dalton-fick-laws'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Integrate the physical gas laws that govern pulmonary ventilation and gas exchange. State the ideal gas law and the law of Boyle and apply them to the pressure and volume changes that drive air into and out of the lungs. Then state the law of Dalton and the law of Fick, explain partial pressure and how the rate of diffusion across the respiratory membrane is determined, and explain why carbon dioxide diffuses much faster than oxygen. Finally, connect these laws to one clinical situation such as ascent to high altitude or a thickened diffusion barrier.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The ideal gas law, PV = nRT, relates pressure, volume, moles of gas, the gas constant, and absolute temperature. Holding amount and temperature constant gives the law of Boyle, in which pressure and volume are inversely related, so P1 times V1 equals P2 times V2. This governs bulk airflow: when the diaphragm and external intercostals enlarge the thorax, alveolar volume rises and alveolar pressure falls to about negative 1 cm H2O, below atmospheric, so air flows in; during expiration volume falls and alveolar pressure rises to about positive 1 cm H2O, so air flows out.' },
        { id: 'kp2', weight: 2, description: 'The law of Dalton states that each gas in a mixture exerts an independent partial pressure and the total equals their sum, with the partial pressure of a gas equal to its fractional concentration times the total pressure. The law of Fick states that diffusion rate is proportional to surface area, to the partial pressure gradient, and to the diffusion coefficient, and inversely proportional to membrane thickness. The diffusion coefficient equals solubility divided by the square root of molecular weight, so carbon dioxide, being about 20 times more soluble than oxygen, diffuses far faster despite its higher molecular weight.' },
        { id: 'kp3', weight: 1, description: 'These laws explain clinical gas behavior. On ascent to high altitude the total atmospheric pressure falls, so by the law of Dalton the inspired and alveolar partial pressures of oxygen fall in proportion and hypoxemia results, even though oxygen still makes up about 21 percent of the air. When the respiratory membrane is thickened by fibrosis or pulmonary edema, the law of Fick predicts slowed diffusion; oxygenation is impaired before carbon dioxide elimination because carbon dioxide diffuses roughly 20 times faster. Bulk flow by the law of Boyle delivers air to the alveoli, while the alveolar to capillary step is diffusion described by the law of Fick.' },
      ],
      common_errors: [
        'Treating airflow into the lung as diffusion rather than bulk flow driven by the pressure changes of the law of Boyle',
        'Saying the fractional concentration of oxygen falls at altitude (it is the total pressure, and therefore the partial pressure, that falls)',
        'Claiming carbon dioxide elimination fails before oxygenation in a diffusion defect (oxygen is affected first because carbon dioxide diffuses much faster)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'gas-laws-of-ventilation',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 38',
      topic: 'gas-laws-of-ventilation',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // CH 38 / pp2-wk-3 — Synthesis 10: Mechanics of a breath (muscles and pressures)
  {
    id: 'r-p2-wk3-10',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3v-respiratory-muscles', 'atom-p2w3v-pleural-alveolar-pressures'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe the mechanics of a single breath, integrating the muscles and the pressures involved. Name the muscles of quiet and forced inspiration and expiration and explain why quiet inspiration is active while quiet expiration is passive. Then define pleural, alveolar, and transpulmonary pressure, give their approximate values through the breath, and explain how the muscle actions produce these pressure changes and therefore airflow. Finally, explain what a pneumothorax does to these pressures and to the lung.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Quiet inspiration is active: the diaphragm contracts and descends and the external intercostals raise the rib cage, increasing the vertical and anteroposterior diameters of the thorax. The sternocleidomastoid and scalenes are accessory inspiratory muscles recruited when demand is high. Quiet expiration is passive, driven by the elastic recoil of the lungs and chest wall. Forced expiration is active, using the abdominal muscles to push the diaphragm up and the internal intercostals to pull the rib cage down.' },
        { id: 'kp2', weight: 2, description: 'Pleural pressure is subatmospheric because the lung recoils inward while the chest wall pulls outward; it is about negative 5 cm H2O at rest and about negative 8 cm H2O at peak inspiration. Alveolar pressure is 0 between breaths, falls to about negative 1 cm H2O during inspiration, and rises to about positive 1 cm H2O during expiration. Transpulmonary pressure is alveolar minus pleural pressure, the distending pressure across the lung. The inspiratory muscles enlarge the thorax, making pleural pressure more negative, which by the law of Boyle lowers alveolar pressure and draws air in.' },
        { id: 'kp3', weight: 1, description: 'A pneumothorax demonstrates why the negative pleural pressure matters. If air enters the pleural space through the chest wall or the lung surface, pleural pressure rises toward atmospheric, transpulmonary pressure falls, and the unopposed elastic recoil collapses the lung on that side. In a tension pneumothorax, a one way leak progressively raises pressure, collapsing the lung and shifting the mediastinum, which impairs venous return and is a life threatening emergency. This links the normal pressure relationships directly to a clinical crisis.' },
      ],
      common_errors: [
        'Stating that quiet expiration requires muscular effort (it is passive, powered by elastic recoil)',
        'Defining transpulmonary pressure as pleural minus alveolar pressure (it is alveolar minus pleural)',
        'Forgetting that loss of negative pleural pressure in a pneumothorax allows the lung to collapse',
      ],
      minimum_passing_score: 60,
    },
    topic: 'mechanics-of-breathing',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 38',
      topic: 'mechanics-of-breathing',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // CH 38 / pp2-wk-3 — Synthesis 11: Airway caliber and resistance
  {
    id: 'r-p2-wk3-11',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3v-bronchiolar-control', 'atom-p2w3v-airway-resistance'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Explain what controls airway caliber and where resistance to airflow resides, integrating autonomic, humoral, and mechanical factors. Describe sympathetic and parasympathetic control and the humoral mediators that constrict or dilate the bronchioles, identify the receptor targeted by bronchodilator drugs, and explain where in the bronchial tree resistance is greatest. Then describe dynamic airway compression during forced expiration and explain why expiratory flow becomes effort independent, with relevance to obstructive disease such as asthma and emphysema.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Airway caliber is set by autonomic and humoral inputs to bronchiolar smooth muscle. Sympathetic stimulation acts on beta-2 adrenergic receptors to dilate the bronchioles, while parasympathetic acetylcholine constricts them. Humoral histamine and acetylcholine constrict, and adrenergic beta agonists dilate. This pharmacology guides therapy: beta-2 agonists such as albuterol relieve bronchospasm, and anticholinergics block the constricting action of acetylcholine, while histamine from mast cells drives constriction in asthma and allergy.' },
        { id: 'kp2', weight: 2, description: 'Resistance is not uniform along the tree. Each terminal bronchiole is narrow, but they are so numerous that their combined cross sectional area is enormous, so they contribute little resistance. The greatest resistance lies in the medium sized and segmental bronchi. A consequence is that considerable small airway disease can accumulate before total measured airway resistance rises appreciably, so early small airway obstruction can be clinically silent on simple resistance measurements.' },
        { id: 'kp3', weight: 1, description: 'During forced expiration the expiratory muscles drive pleural pressure to high positive values, for example about positive 25 cm H2O, and alveolar pressure higher still, for example about positive 35 cm H2O, because it equals pleural pressure plus elastic recoil pressure. At a point along the airway the intraluminal pressure falls below the surrounding pleural pressure and the airway is compressed; beyond that point greater effort raises driving and compressing pressures equally, so flow is limited and becomes effort independent. Emphysema, by destroying the elastic tissue that tethers airways open, worsens this collapse and traps air, while asthma narrows airways through constriction and inflammation.' },
      ],
      common_errors: [
        'Stating that the smallest bronchioles carry the highest resistance (their huge combined cross sectional area makes resistance low)',
        'Saying acetylcholine dilates and beta-2 stimulation constricts (the reverse is true)',
        'Believing that more forceful effort always increases expiratory flow (dynamic compression limits it)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'airway-caliber-and-resistance',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 38',
      topic: 'airway-caliber-and-resistance',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // CH 38 / pp2-wk-3 — Synthesis 12: Compliance, surface tension, and surfactant
  {
    id: 'r-p2-wk3-12',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3v-compliance-elastic-forces', 'atom-p2w3v-surface-tension-surfactant'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Integrate lung compliance with the two elastic forces that determine it. Define compliance and give its normal value, name the two elastic forces, and explain the experiment with saline filled versus air filled lungs that reveals their relative size. Then explain surface tension and how surfactant, produced by type II alveolar cells, lowers it to stabilize alveoli and raise compliance. Finally, explain how compliance and surfactant are altered in emphysema, in fibrosis, and in neonatal respiratory distress syndrome.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Compliance is the change in lung volume per unit change in distending pressure, the change in volume divided by the change in pressure, normally about 200 mL per cm H2O. It is set by two elastic forces: the elastic recoil of the lung tissue and the surface tension of the fluid lining the alveoli. Filling a lung with saline abolishes the air to fluid interface and therefore the surface tension, and such a lung is far more compliant than an air filled one, showing that surface tension accounts for roughly two thirds of normal recoil.' },
        { id: 'kp2', weight: 2, description: 'Surface tension arises from the attraction of water molecules at the air to fluid interface and tends to collapse alveoli, more strongly in alveoli of smaller radius. Surfactant, a detergent like phospholipid secreted by type II alveolar epithelial cells, adsorbs to the interface and interferes with hydrogen bonding between water molecules, lowering surface tension. This raises compliance, reduces the work of breathing, prevents collapse of small alveoli, and stabilizes alveoli of different sizes so they do not empty into one another.' },
        { id: 'kp3', weight: 1, description: 'Disease shifts these properties. Emphysema destroys elastic tissue, raising compliance so the lung overdistends and traps air but recoils poorly. Fibrosis stiffens the lung, lowering compliance so a much larger pressure is needed to inflate it and the work of breathing rises. In premature infants, type II cells may not yet make enough surfactant, so surface tension is high, alveoli collapse, and neonatal respiratory distress syndrome results, with stiff lungs and widespread atelectasis treated with exogenous surfactant and respiratory support.' },
      ],
      common_errors: [
        'Giving compliance as pressure divided by volume rather than volume divided by pressure',
        'Saying surfactant raises surface tension or is made by type I cells (it lowers tension and is made by type II cells)',
        'Reversing the compliance changes of emphysema and fibrosis',
      ],
      minimum_passing_score: 60,
    },
    topic: 'compliance-surface-tension-surfactant',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 38',
      topic: 'compliance-surface-tension-surfactant',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // CH 38 / pp2-wk-3 — Synthesis 13: Lung volumes and capacities
  {
    id: 'r-p2-wk3-13',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3v-lung-volumes', 'atom-p2w3v-lung-capacities'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Integrate the lung volumes with the capacities they combine to form. Define the four non overlapping lung volumes with approximate values, then define the four capacities as sums of those volumes with values. Explain which volumes and capacities cannot be measured by simple spirometry and why, and name the methods used instead. Finally, explain how functional residual capacity and vital capacity change in obstructive disease such as emphysema and in restrictive disease such as fibrosis.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The four non overlapping lung volumes are tidal volume, about 500 mL, the air of a normal quiet breath; inspiratory reserve volume, about 3000 to 3100 mL, the extra air inhaled beyond a tidal breath; expiratory reserve volume, about 1100 to 1200 mL, the extra air forcibly exhaled after a normal expiration; and residual volume, about 1200 mL, the air remaining after a maximal forced expiration that keeps the alveoli partly inflated.' },
        { id: 'kp2', weight: 2, description: 'Capacities are sums of volumes. Inspiratory capacity is tidal plus inspiratory reserve volume, about 3600 mL. Functional residual capacity is expiratory reserve plus residual volume, about 2400 mL, the air left after a quiet expiration. Vital capacity is inspiratory reserve plus tidal plus expiratory reserve volume, about 4800 mL, the most that can be exhaled after a maximal inspiration. Total lung capacity is vital capacity plus residual volume, about 6000 mL.' },
        { id: 'kp3', weight: 1, description: 'Because the residual volume cannot be exhaled, it and any capacity that contains it, namely functional residual capacity and total lung capacity, cannot be measured by simple spirometry; they require helium dilution, nitrogen washout, or body plethysmography. Disease changes the pattern: obstructive disease such as emphysema traps air and raises residual volume, functional residual capacity, and total lung capacity while reducing vital capacity, whereas restrictive disease such as fibrosis reduces essentially all volumes, including vital capacity and total lung capacity.' },
      ],
      common_errors: [
        'Including the residual volume within the vital capacity (vital capacity excludes residual volume)',
        'Stating that residual volume can be measured by spirometry (it must be obtained indirectly)',
        'Saying that emphysema lowers total lung capacity (it raises it through air trapping and hyperinflation)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'lung-volumes-and-capacities',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 38',
      topic: 'lung-volumes-and-capacities',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // CH 38 / pp2-wk-3 — Synthesis 14: Dead space and alveolar ventilation
  {
    id: 'r-p2-wk3-14',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3v-dead-space', 'atom-p2w3v-minute-alveolar-ventilation'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Integrate dead space with the calculation of ventilation. Define anatomic, alveolar, and physiologic dead space and give the normal anatomic value, and explain what sets physiologic dead space. Then write the formulas for minute respiratory volume and alveolar ventilation and explain why alveolar ventilation is always less than minute ventilation. Finally, use these ideas to explain why rapid shallow breathing is inefficient and why alveolar ventilation, not minute ventilation, controls the arterial carbon dioxide.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Anatomic dead space is the volume of the conducting airways, everything but the alveoli, about 150 mL, where air is conducted but no gas exchange occurs. Alveolar dead space is air that reaches alveoli that are ventilated but poorly perfused or unperfused, so gas exchange does not take place there. Physiologic dead space is the sum of anatomic and alveolar dead space, and its size depends on the matching of ventilation to perfusion; in healthy lungs alveolar dead space is small, so physiologic and anatomic dead space are nearly equal.' },
        { id: 'kp2', weight: 2, description: 'Minute respiratory volume, or minute ventilation, equals tidal volume multiplied by respiratory rate, the total air moved per minute. Alveolar ventilation equals tidal volume minus dead space, multiplied by respiratory rate, the fresh air that actually reaches the alveoli. Because the dead space is subtracted before multiplying, alveolar ventilation is always less than minute ventilation, and the fixed dead space penalizes every breath.' },
        { id: 'kp3', weight: 1, description: 'Because the dead space per breath is fixed, rapid shallow breathing wastes a larger fraction of each breath in dead space than slow deep breathing does, so at the same minute ventilation rapid shallow breathing produces less alveolar ventilation. Alveolar ventilation, not minute ventilation, determines the alveolar and therefore the arterial partial pressures of oxygen and carbon dioxide. Arterial carbon dioxide is inversely proportional to alveolar ventilation, so hypoventilation raises the arterial carbon dioxide and hyperventilation lowers it, a relationship central to interpreting blood gases.' },
      ],
      common_errors: [
        'Equating physiologic dead space with anatomic dead space when alveolar dead space is increased',
        'Using the full tidal volume instead of tidal volume minus dead space in the alveolar ventilation formula',
        'Stating that minute ventilation, rather than alveolar ventilation, sets the arterial carbon dioxide',
      ],
      minimum_passing_score: 60,
    },
    topic: 'dead-space-and-alveolar-ventilation',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Guyton & Hall 14e, Ch 38',
      topic: 'dead-space-and-alveolar-ventilation',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // ===== CH 39 to 43 / pp2-wk-4,5,6 (Respiratory) synthesis =====

  {
    id: 'r-p2-wk4-1',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w4s-pulmonary-pressures', 'atom-p2w4s-low-resistance'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Integrate the normal pulmonary pressure profile with the low resistance nature of the pulmonary circuit. State the systolic, diastolic, mean, and capillary pulmonary pressures, then explain how the small pressure drop of about 12 mm Hg across a flow of 5 L per minute produces a resistance only about 1/7 that of the systemic circulation. Explain why operating at these low pressures matters for the lung.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The pulmonary pressures is about systolic 25 mm Hg, diastolic 8 mm Hg, mean 15 mm Hg, and capillary 7 mm Hg, with the left atrium near 2 mm Hg. These values are far lower than systemic arterial pressures. The learner should be able to recite all four pulmonary values and recognize the steep pressure fall from the pulmonary artery through the capillaries to the left atrium.' },
        { id: 'kp2', weight: 2, description: 'The pressure drop across the lung is only about 12 mm Hg while carrying a flow of 5 L per minute, which yields a pulmonary resistance about 1/7 of the systemic value. Because resistance equals pressure drop divided by flow, the small drop at full cardiac output demonstrates the very low resistance. The learner should connect the 12 mm Hg drop and 5 L per minute flow to the 1/7 resistance statement.' },
        { id: 'kp3', weight: 1, description: 'Operating at low pressure protects the thin pulmonary capillaries and keeps capillary hydrostatic pressure low, which limits fluid filtration into the alveoli and helps keep them dry. The low capillary pressure of 7 mm Hg is central to preventing pulmonary edema.' },
      ],
      common_errors: [
        'Stating the mean pulmonary pressure as 25 mm Hg, which is actually the systolic value.',
        'Claiming pulmonary resistance is higher than systemic rather than about 1/7 as great.',
        'Confusing the pulmonary capillary pressure of 7 mm Hg with the systemic capillary pressure.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pulmonary pressures and resistance',
    chapter: 'pp2-wk-4',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Pulmonary pressures and resistance', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk4-2',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w4s-recruitment-distension', 'atom-p2w4s-pressure-output-curve'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Integrate the two passive mechanisms that lower pulmonary resistance with the shape of the pulmonary pressure versus cardiac output curve. Define recruitment and distension, then explain how these mechanisms cause pulmonary arterial pressure to rise only modestly even when cardiac output increases severalfold above the normal value near 4 to 5 L per minute. Explain the physiological advantage of this behavior during exercise.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Recruitment is the opening of previously closed pulmonary capillaries and distension is the widening of already open capillaries. Both increase the total cross-sectional area available for blood flow and therefore lower vascular resistance as pulmonary pressure and flow rise. The learner should distinguish the two and recognize that both reduce resistance.' },
        { id: 'kp2', weight: 2, description: 'the curve of pulmonary arterial pressure versus cardiac output shows pressure rising only a small amount above the normal value near 15 mm Hg even when cardiac output increases severalfold. This flat response occurs precisely because recruitment and distension lower resistance as flow climbs. The learner should link the curve shape to the two mechanisms.' },
        { id: 'kp3', weight: 1, description: 'This buffering allows large increases in pulmonary blood flow during exercise without a large rise in pulmonary pressure, which protects the right heart and the capillaries while still increasing gas exchange capacity.' },
      ],
      common_errors: [
        'Saying pulmonary pressure rises in direct proportion to cardiac output.',
        'Confusing recruitment, the opening of closed vessels, with distension, the widening of open vessels.',
        'Attributing the low pressure rise to active vasodilation rather than passive recruitment and distension.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Resistance mechanisms and pressure curve',
    chapter: 'pp2-wk-4',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Resistance mechanisms and pressure curve', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk4-3',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w4s-gravity-distribution', 'atom-p2w4s-zones'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Integrate the gravity dependent distribution of lung blood flow with the zone model of pulmonary perfusion. Explain why the bottom of the upright lung receives more flow than the top, how hydrostatic pressure differences create zones 1, 2, and 3, and how exercise changes overall flow while preserving the relative distribution. Reference the relationship between alveolar pressure and pulmonary capillary pressure in the zones.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Hydrostatic pressure differences due to gravity cause the bottom of each lung to receive more blood flow than the top. The lower regions sit at higher intravascular hydrostatic pressure, which favors greater perfusion per unit of tissue. The learner should state that the bottom is better perfused and that gravity is the cause.' },
        { id: 'kp2', weight: 2, description: 'The zone model divides the lung into zone 1, zone 2, and zone 3 based on the relationship between alveolar pressure (PALV) and pulmonary capillary pressure (Ppc). In higher regions alveolar pressure can exceed capillary pressure and limit or stop flow, while in lower regions capillary pressure exceeds alveolar pressure so flow is continuous. The learner should connect each zone to the balance of PALV and Ppc.' },
        { id: 'kp3', weight: 1, description: 'Exercise increases overall blood flow to the lungs but maintains the same relative top to bottom distribution, so the bottom still receives proportionally more flow even as total perfusion rises.' },
      ],
      common_errors: [
        'Saying the top of the lung receives more flow than the bottom.',
        'Claiming exercise reverses or equalizes the regional distribution of flow.',
        'Ignoring the role of alveolar pressure versus capillary pressure in defining the zones.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Gravity distribution and lung zones',
    chapter: 'pp2-wk-4',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Gravity distribution and lung zones', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk4-4',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w4s-hypoxic-vasoconstriction', 'atom-p2w4s-po2-flow-curve'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Integrate the mechanism of hypoxic pulmonary vasoconstriction with the alveolar PO2 versus blood flow relationship. Explain how decreased alveolar PO2 leads to local vascular constriction, why this redirects flow toward ventilated alveoli, and how the curve shows flow falling steeply below an alveolar PO2 near 70. Contrast this pulmonary response with the systemic vascular response to hypoxia.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Decreased alveolar PO2 causes local pulmonary vessels to constrict, which directs blood flow away from poorly ventilated alveoli and toward well ventilated alveoli. This improves the matching of perfusion to ventilation and optimizes oxygenation of the blood. The learner should describe both the constriction and its redirecting effect.' },
        { id: 'kp2', weight: 2, description: 'the curve of blood flow as a percent of control versus alveolar PO2 shows flow near 100 percent at a PO2 of about 70 and falling steeply as PO2 drops below that level. The plateau above 70 and the steep decline below it define the threshold for hypoxic vasoconstriction. The learner should read the curve and identify the 70 mm Hg region.' },
        { id: 'kp3', weight: 1, description: 'This pulmonary response is opposite to the systemic circulation, where hypoxia generally causes vasodilation; the lung uniquely constricts to preserve ventilation perfusion matching.' },
      ],
      common_errors: [
        'Saying low alveolar PO2 causes pulmonary vasodilation like the systemic vessels.',
        'Misreading the relationship and placing the flow threshold far from 70 mm Hg.',
        'Forgetting that the purpose is to redirect blood toward ventilated alveoli.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Hypoxic vasoconstriction and PO2 curve',
    chapter: 'pp2-wk-4',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Hypoxic vasoconstriction and PO2 curve', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk4-5',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w4s-starling-forces', 'atom-p2w4s-edema-causes'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Integrate the Starling force balance at the pulmonary capillary with the causes of pulmonary edema. List the outward forces totaling 29 mm Hg and the inward plasma osmotic force of 28 mm Hg that yield a net filtration of 1 mm Hg outward, then explain how each listed cause of edema disrupts this balance. Explain the edema safety factor and the value at which protection is lost.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The outward forces at the pulmonary capillary are pulmonary capillary pressure 7 mm Hg, interstitial osmotic pressure 14 mm Hg, and negative interstitial pressure 8 mm Hg, totaling 29 mm Hg. The single inward force is plasma osmotic pressure at 28 mm Hg, leaving a net filtration pressure of 1 mm Hg outward that lymphatics normally clear. The learner should reproduce these values and the net result.' },
        { id: 'kp2', weight: 2, description: 'Pulmonary edema arises when this balance is disrupted: increased pulmonary venous and capillary pressure from left heart failure or mitral stenosis raises the outward force, increased capillary membrane permeability from infections or noxious gases such as chlorine and sulfur dioxide lets fluid leak, decreased plasma osmotic pressure from liver failure lowers the inward force, and a large decrease in intrapleural pressure from inspiring against a closed airway favors fluid movement outward. The learner should map each cause to its effect on the force balance.' },
        { id: 'kp3', weight: 1, description: 'The pulmonary edema safety factor provides protection until pulmonary capillary pressure equals the capillary osmotic pressure; beyond that point fluid accumulates rapidly and edema develops.' },
      ],
      common_errors: [
        'Listing plasma osmotic pressure as an outward force rather than the inward force.',
        'Saying the net filtration pressure is large rather than only about 1 mm Hg outward.',
        'Claiming an increase in plasma osmotic pressure causes edema instead of a decrease.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Starling balance and edema causes',
    chapter: 'pp2-wk-4',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Starling balance and edema causes', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk4-6',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w4s-edema-safety-factors', 'atom-p2w4s-pleural-fluid'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Integrate the safety factors that protect against pulmonary edema with the dynamics of pleural fluid and pleural effusion. List the safety factors that keep the alveoli dry, then explain how the same lymphatic and pressure principles govern the thin pleural fluid layer, why the pleural space is normally kept at a negative pressure, and what causes a pleural effusion. Explain how a net Starling force of plus 1 relates to continuous filtration in both settings.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The safety factors against pulmonary edema are negative interstitial pressure, lymphatic pumping, and decreased interstitial osmotic pressure. Together these remove excess filtered fluid and keep the alveoli dry until pulmonary capillary pressure rises high enough to overwhelm them. The learner should name all three safety factors.' },
        { id: 'kp2', weight: 2, description: 'A thin layer of mucoid fluid lies between the parietal and visceral pleurae to reduce friction during ventilation, and the lymphatic system maintains a negative pressure in the pleural space that keeps the lungs from collapsing. Because the net Starling force is plus 1, fluid filters slowly but continuously out of the pulmonary capillaries and is then cleared by lymphatics. The learner should connect the negative pleural pressure and continuous filtration to lymphatic clearance.' },
        { id: 'kp3', weight: 1, description: 'A pleural effusion is a collection of fluid in the pleural space caused by lymphatic obstruction such as tumor, heart failure, reduced plasma osmotic pressure, infection or inflammation increasing permeability, or fluid production exceeding drainage.' },
      ],
      common_errors: [
        'Omitting lymphatic pumping when listing the safety factors against edema.',
        'Saying the pleural space is normally at positive pressure rather than negative.',
        'Failing to recognize that the same net plus 1 filtration drives slow continuous fluid movement in both the alveolar and pleural settings.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Edema safety factors and pleural fluid',
    chapter: 'pp2-wk-4',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Edema safety factors and pleural fluid', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-1',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5g-partial-pressure-fraction', 'atom-p2w5g-humidified-inspired-po2'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate how partial pressure is generated from the fraction of a gas and total pressure with how inspired oxygen is calculated after humidification. Starting from a barometric pressure of 760 mm Hg and an oxygen fraction of about 0.21, explain why dry atmospheric PO2 is about 159 mm Hg, then show how subtracting the alveolar water vapor pressure of 47 mm Hg before multiplying by 0.21 yields a humidified inspired PO2 of about 149 mm Hg. State why the water vapor term must be removed first and what this implies for the oxygen actually delivered to the alveoli.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Partial pressure is proportional to the fraction of the gas times total pressure, so with a barometric pressure of 760 mm Hg, oxygen at about 0.21 in dry air gives roughly 159 mm Hg. Total pressure is the sum of the partial pressures of O2, N2, CO2, and H2O, so the gas fractions must add to one. This proportionality is the basis for converting any gas percentage into a partial pressure in mm Hg.' },
        { id: 'kp2', weight: 2, description: 'Once air reaches the alveoli it is humidified to a water vapor pressure of 47 mm Hg, which occupies part of the 760 mm Hg total. Therefore inspired PO2 is computed as (760 minus 47) times 0.21, which equals 713 times 0.21, or about 149 mm Hg. The water vapor must be subtracted first because it dilutes the dry gas mixture before the oxygen fraction is applied.' },
        { id: 'kp3', weight: 1, description: 'Humidification lowers the effective inspired PO2 from about 159 mm Hg in dry air to about 149 mm Hg in the airway, reducing the oxygen pressure available to drive diffusion into blood even before alveolar gas exchange further lowers it toward 104 mm Hg.' },
      ],
      common_errors: [
        'Multiplying 760 by 0.21 without first subtracting the 47 mm Hg water vapor pressure',
        'Confusing the dry atmospheric PO2 of about 159 with the humidified inspired value of about 149',
        'Forgetting that total pressure is the sum of all partial pressures including water vapor',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Partial pressure and humidification',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Partial pressure and humidification', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-2',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5g-respiratory-membrane-layers', 'atom-p2w5g-respiratory-membrane-thickness'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the layered structure of the respiratory membrane with its measured thickness to explain why this barrier permits rapid gas exchange. List the six layers in order from the alveolar gas to the red blood cell, state the total membrane thickness, and explain how a thin, layered barrier supports diffusion. Then describe how thickening of any layer would be expected to change the diffusion rate based on the relationship between diffusion and distance.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The respiratory membrane consists, in order, of the surfactant and fluid layer, the alveolar epithelium, the epithelial basement membrane, the interstitial space, the capillary basement membrane, and the capillary endothelium. Gas must cross all of these layers to move between alveolar air and the red blood cell. Each layer is a potential site where disease can add diffusion resistance.' },
        { id: 'kp2', weight: 2, description: 'Despite having six layers, the total respiratory membrane thickness is only about 0.2 micrometers. This very short diffusion distance, combined with a large total surface area, allows oxygen and carbon dioxide to equilibrate rapidly during the brief capillary transit. The thinness of the barrier is a key structural feature enabling efficient gas exchange.' },
        { id: 'kp3', weight: 1, description: 'Because diffusion is inversely related to distance, thickening any layer, for example by interstitial edema or fibrosis, increases the diffusion path and reduces the rate of gas transfer across the membrane.' },
      ],
      common_errors: [
        'Confusing the 0.2 micrometer membrane thickness with the 0.2 mm alveolar diameter',
        'Omitting the interstitial space or one of the basement membranes from the layer list',
        'Assuming a thicker membrane would speed diffusion rather than slow it',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Respiratory membrane structure',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Respiratory membrane structure', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-3',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5g-ficks-law', 'atom-p2w5g-co2-solubility'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate Fick\'s Law of diffusion with the relative solubilities of oxygen and carbon dioxide to explain why carbon dioxide diffuses so readily across the respiratory membrane. State the Fick\'s Law relationship, identify which terms are variable and which are fixed, and then explain how the 20 times greater solubility of CO2 relative to O2 fits into that equation. Conclude by relating this to the statement that CO2 diffusing capacity is about 20 times that of O2.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Fick\'s Law states that diffusion equals the pressure gradient times area times solubility, divided by distance times the square root of molecular weight. The pressure gradient, area, and distance can vary physiologically, while solubility and molecular weight are fixed properties of a given gas. Diffusion therefore rises with larger gradient or area and falls with greater distance or molecular weight.' },
        { id: 'kp2', weight: 2, description: 'CO2 is 20 times as soluble as O2. Because solubility appears in the numerator of Fick\'s Law, this much higher solubility greatly increases the diffusion of carbon dioxide for any given pressure gradient. This is the dominant reason CO2 crosses the respiratory membrane so easily despite a smaller partial pressure gradient than oxygen.' },
        { id: 'kp3', weight: 1, description: 'Combining the solubility term with Fick\'s Law explains why the CO2 diffusing capacity is about 20 times the diffusing capacity of O2, so carbon dioxide transfer is rarely diffusion limited.' },
      ],
      common_errors: [
        'Placing solubility in the denominator of Fick\'s Law instead of the numerator',
        'Treating solubility or molecular weight as variable rather than fixed',
        'Assuming oxygen diffuses faster than carbon dioxide because its gradient is larger',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Fick\'s Law and solubility',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Fick\'s Law and solubility', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-4',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5g-vq-definition', 'atom-p2w5g-regional-vq'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the definition of the whole-lung ventilation-perfusion ratio with the regional variation in V/Q across the upright lung. State how V/Q is defined and compute the normal whole-lung value from 4 L/min ventilation and 5 L/min blood flow, then describe how the upper lung and lower lung V/Q ratios differ from this average. Explain how regional differences in ventilation and blood flow produce these regional ratios and why the whole-lung value of 0.8 is an average of unequal regions.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'V/Q is defined as the ratio between ventilation and blood flow and represents the relationship between adequate ventilation and adequate flow. Using whole-lung values of 4 L/min ventilation and 5 L/min blood flow, the normal ratio is 4 divided by 5, or 0.8. When there is no diffusion impairment, alveolar and end capillary PO2 and PCO2 are usually equal.' },
        { id: 'kp2', weight: 2, description: 'Upper lung Va/Q is normally approximately 3 while lower lung Va/Q is normally approximately 0.5. Differences in airway and lung expansion produce uneven regional ventilation, and differences in vascular geometry and hydrostatic pressure produce uneven regional blood flow. As a result V/Q ratios vary across regions even within a normal, healthy lung.' },
        { id: 'kp3', weight: 1, description: 'The whole-lung ratio of 0.8 is an average of these unequal regions, with the overventilated, underperfused apex near 3 and the relatively underventilated, well perfused base near 0.5.' },
      ],
      common_errors: [
        'Inverting the ratio and reporting a normal V/Q of 1.25',
        'Reversing the regions by assigning the high ratio to the lung base',
        'Assuming V/Q is uniform throughout a healthy lung',
      ],
      minimum_passing_score: 60,
    },
    topic: 'V/Q ratio and regional distribution',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'V/Q ratio and regional distribution', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-5',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5g-shunt-vs-deadspace', 'atom-p2w5g-vq-extreme-gases'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the definitions of physiological shunt and physiological dead space with the alveolar gas values at the two V/Q extremes. Define physiological shunt and physiological dead space in terms of how their V/Q compares with normal, then state the alveolar PO2 and PCO2 that a unit approaches when V/Q equals zero and when V/Q approaches infinity. Explain how a shunt unit drifts toward mixed venous values while a dead space unit drifts toward inspired air values.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'A physiological shunt is a unit with Va/Q below normal, reflecting low ventilation relative to perfusion. A physiological dead space is a unit with Va/Q above normal, reflecting wasted ventilation relative to perfusion. These two patterns are the opposite extremes of ventilation-perfusion mismatch.' },
        { id: 'kp2', weight: 2, description: 'When V/Q equals zero, the alveolar gas equilibrates with mixed venous blood, approaching PO2 of about 40 and PCO2 of about 45 mm Hg. When V/Q approaches infinity, the alveolar gas approaches inspired humidified air, with PO2 of about 150 and PCO2 of about 0 mm Hg. These endpoints define the V/Q extremes.' },
        { id: 'kp3', weight: 1, description: 'A shunt unit drifts toward mixed venous values because blood flow continues without ventilation, while a dead space unit drifts toward inspired air values because ventilation continues without effective perfusion.' },
      ],
      common_errors: [
        'Swapping the gas endpoints so that a shunt approaches inspired air values',
        'Defining a shunt as Va/Q above normal instead of below normal',
        'Believing carbon dioxide rises in a high V/Q dead space unit',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Shunt and dead space extremes',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Shunt and dead space extremes', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-6',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5g-paco2-ventilation', 'atom-p2w5g-hyper-hypoventilation'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the relationship between alveolar PCO2 and alveolar ventilation with the definitions of hyperventilation and hypoventilation. State the alveolar PCO2 equation and the value of its constant, explain quantitatively what happens to PCO2 when ventilation is doubled or halved, and then connect this to the definitions of hyperventilation as PACO2 below 40 and hypoventilation as PACO2 above 40. Explain why hyperventilation and hypoventilation are defined relative to metabolic needs rather than to any fixed breathing rate.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Alveolar PCO2 as CO2 production times a constant K, divided by alveolar ventilation, where K is about 863 mm Hg. Because ventilation is in the denominator, PCO2 is inversely proportional to alveolar ventilation. Thus doubling ventilation halves PCO2, and halving ventilation doubles PCO2, when CO2 production is constant.' },
        { id: 'kp2', weight: 2, description: 'hyperventilation is defined as PACO2 less than 40 and hypoventilation as PACO2 greater than 40, because increasing V/Q lowers alveolar PCO2 and decreasing V/Q raises it. Hyperventilation is increased ventilation beyond metabolic demand, which drops arterial CO2, while hypoventilation is ventilation below needs, which raises arterial CO2.' },
        { id: 'kp3', weight: 1, description: 'These terms are defined relative to metabolic CO2 production rather than to a fixed rate, so the same minute ventilation can be hyperventilation at a low metabolic rate but inadequate when CO2 production rises, for example with a fourfold increase from 200 to 800 mL per minute.' },
      ],
      common_errors: [
        'Stating that PCO2 rises when ventilation increases because they assume a direct relationship',
        'Reversing the thresholds so hyperventilation is defined as PACO2 above 40',
        'Defining hyperventilation by a fixed breathing rate rather than relative to metabolic demand',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Alveolar ventilation and CO2',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Alveolar ventilation and CO2', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-7',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5t-three-measures', 'atom-p2w5t-dissolved-vs-bound'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the three measurements of blood oxygen with the two physical forms in which oxygen travels in blood. Define partial pressure, saturation, and content and state the units of each. Then explain how dissolved oxygen (using the 0.003 mL per dL per mm Hg solubility) and hemoglobin-bound oxygen (using 1.34 to 1.39 mL O2 per gram and about 97 percent of transport) each contribute to total content. Explain why partial pressure can be normal while content is very low when hemoglobin is absent or reduced.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Partial pressure in mm Hg is the diffusion driving force and reflects only dissolved oxygen; saturation is the percent of hemoglobin carrying oxygen, expressed as HbO2 over Hb plus HbO2; content is the absolute quantity in mL O2 per 100 mL blood. These three are distinct and a learner must keep them separate.' },
        { id: 'kp2', weight: 2, description: 'Dissolved oxygen equals solubility times PaO2, where solubility is 0.003 mL O2 per dL per mm Hg, giving only about 0.3 mL per dL at a PaO2 of 100. Hemoglobin-bound oxygen equals 1.34 to 1.39 mL O2 per gram times grams of hemoglobin times percent saturation, giving about 20 mL per dL normally and accounting for roughly 97 percent of transport.' },
        { id: 'kp3', weight: 1, description: 'Because partial pressure tracks only the dissolved fraction, it can read normal even when hemoglobin is low or absent; without red cells the plasma partial pressure is maintained but content is minimal, which is why hemoglobin is essential for meeting the 250 mL per minute oxygen demand.' },
      ],
      common_errors: [
        'Treating partial pressure and content as interchangeable and assuming a normal PaO2 guarantees adequate oxygen content.',
        'Forgetting that dissolved oxygen is only about 0.3 mL per dL and cannot meet metabolic needs alone.',
        'Confusing the 1.34 to 1.39 carrying capacity per gram of hemoglobin with the 0.003 plasma solubility coefficient.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Oxygen measurement and carriage',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Oxygen measurement and carriage', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-8',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5t-pulmonary-gradient', 'atom-p2w5t-transit-safety'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the pulmonary capillary PO2 gradient with the concept of transit time and the diffusion safety factor. Describe the PO2 values at the arterial and venous ends of the pulmonary capillary and the alveolar PO2 the blood equilibrates toward. State the time required for equilibration versus the time a red cell spends in the capillary, and explain why this margin is called a safety factor. Then explain how exercise shortens transit time yet equilibration still occurs.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Blood enters the pulmonary capillary at a PO2 of 40 mm Hg and rises to about 104 mm Hg by the venous end, equilibrating with the alveolar PO2 of about 104 mm Hg. This rising gradient is the basis of oxygen uptake in the lungs.' },
        { id: 'kp2', weight: 2, description: 'Oxygen equilibration normally completes within about 0.25 seconds, but each red cell spends about 0.75 seconds in the pulmonary capillary, leaving a large reserve of time. This surplus a safety factor that protects oxygenation when conditions are not ideal.' },
        { id: 'kp3', weight: 1, description: 'During exercise, increased cardiac output decreases transit time, yet equilibration still occurs because the safety factor provides spare time and because increased diffusing capacity from recruited capillaries and better ventilation perfusion matching speeds uptake.' },
      ],
      common_errors: [
        'Reversing the gradient and stating blood enters the pulmonary capillary at 104 and leaves at 40.',
        'Claiming exercise causes desaturation because transit time falls, ignoring the safety factor.',
        'Confusing the 0.25 second equilibration time with the 0.75 second capillary transit time.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pulmonary oxygen uptake',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Pulmonary oxygen uptake', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-9',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5t-tissue-po2-balance', 'atom-p2w5t-flow-delivery'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the determinants of tissue PO2 with the calculation of oxygen delivery as flow times content. Explain that tissue PO2 reflects the balance of oxygen delivery and oxygen usage, citing the arterial, tissue, and intracellular PO2 values. Then show using the values how delivery equals content times blood flow, comparing normal flow (about 5000 mL per minute) with high flow (about 20000 mL per minute) at a content of 20 mL per 100 mL. Conclude by explaining how raising flow raises interstitial PO2 toward the upper limit set by arterial blood.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Tissue PO2 is set by the balance of delivery and usage: arterial blood is about 95 to 100 mm Hg, interstitial tissue about 30 to 40 mm Hg, and intracellular about 23 mm Hg. Greater consumption lowers tissue PO2 while greater delivery raises it.' },
        { id: 'kp2', weight: 2, description: 'Oxygen delivery equals content times blood flow; at 20 mL O2 per 100 mL and 5000 mL per minute delivery is about 1000 mL O2 per minute, and raising flow to 20000 mL per minute raises delivery to about 4000 mL O2 per minute. Flow is therefore a powerful lever on delivery.' },
        { id: 'kp3', weight: 1, description: 'As the curve shows, raising blood flow pushes interstitial PO2 upward but never above the upper limit set by arterial PO2, and for a fixed flow higher oxygen consumption shifts the whole relationship downward.' },
      ],
      common_errors: [
        'Stating tissue PO2 depends only on delivery while ignoring oxygen usage by the cells.',
        'Multiplying content by flow with mismatched units and omitting the per 100 mL basis.',
        'Believing interstitial PO2 can rise above arterial PO2 with very high flow.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Tissue oxygenation and delivery',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Tissue oxygenation and delivery', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-10',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5t-right-shift-factors', 'atom-p2w5t-bohr-tissue-lung'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the four factors that shift the dissociation curve to the right with the physiologic role of the Bohr effect at the tissues and lungs. List the four right-shift factors and state what a right shift does to affinity and saturation at a given PO2. Then explain how increased CO2 and hydrogen ions at the metabolizing tissue shift the curve right to unload oxygen, while loss of CO2 at the lungs shifts the curve left to load oxygen, and why this preserves the partial pressure gradient.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The four right-shift factors are increased hydrogen ions, increased CO2 (the Bohr effect), increased temperature, and increased BPG. A right shift lowers hemoglobin affinity for oxygen so that at any given PO2 the saturation is lower and oxygen is released more readily.' },
        { id: 'kp2', weight: 2, description: 'At the tissue, increased CO2 and hydrogen ions shift the curve right, decreasing affinity and promoting oxygen unloading while helping maintain the partial pressure gradient that drives diffusion into cells. At the lungs, loss of CO2 shifts the curve left, increasing affinity and favoring oxygen loading.' },
        { id: 'kp3', weight: 1, description: 'These shifts are physiologically helpful: in exercise, higher temperature and hydrogen ions force oxygen release at the exercising muscle capillary, and in hypoxia increased BPG keeps the curve right shifted to increase oxygen release.' },
      ],
      common_errors: [
        'Listing decreased temperature or decreased CO2 as right-shift factors.',
        'Stating a right shift increases hemoglobin affinity for oxygen.',
        'Assigning the right shift to the lungs and the left shift to the tissues, reversing the physiology.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Dissociation curve shifts',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Dissociation curve shifts', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-11',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5t-shunt-fio2', 'atom-p2w5t-vq-mismatch'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the behavior of a true shunt with the behavior of a low V/Q region, using the response to increased FIO2 as the distinguishing test. Define a shunt and a V/Q mismatch, give the normal shunt fraction and example pathologies for each, and explain why both cause hypoxemia. Then explain why increasing FIO2 corrects hypoxemia from low V/Q but barely changes arterial PO2 in a true shunt, and how this difference is used clinically to tell them apart.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'A shunt is blood that does not exchange gas; the normal shunt fraction is about 5 percent and pathologic causes include pneumonia, atelectasis, and intracardiac shunts. A V/Q mismatch reflects regional variation in ventilation relative to perfusion, with low V/Q regions seen in asthma, emphysema, and atelectasis contributing to hypoxemia.' },
        { id: 'kp2', weight: 2, description: 'Increasing FIO2 corrects hypoxemia from a low V/Q region because the still-ventilated alveoli raise the oxygen available, but it barely raises arterial PO2 in a true shunt because the shunted blood never contacts alveolar gas and cannot take up the extra oxygen. The response to FIO2 therefore separates the two.' },
        { id: 'kp3', weight: 1, description: 'Regions with V/Q greater than 1.0 do not contribute to hypoxemia, and the normal alveolar to arterial oxygen difference is about 10 mm Hg, a value that increases with age as small airways close and V/Q mismatch increases.' },
      ],
      common_errors: [
        'Claiming a true shunt corrects fully with supplemental oxygen like a V/Q mismatch does.',
        'Stating the normal shunt fraction is 0 percent rather than about 5 percent.',
        'Asserting that high V/Q regions contribute to hypoxemia.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Shunt versus V/Q mismatch',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Shunt versus V/Q mismatch', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-12',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5t-co2-forms', 'atom-p2w5t-haldane'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the three transport forms of carbon dioxide with the Haldane effect. State the three forms of CO2 carriage with their approximate percentages and the role of carbonic anhydrase and the chloride shift inside the red cell. Then define the Haldane effect, explaining how oxygenation of hemoglobin at the lungs (PO2 rising toward 100 mm Hg) lowers CO2 carriage and how deoxygenation at the tissue (PO2 near 40 mm Hg) raises CO2 carriage, and why this aids CO2 loading and unloading.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Carbon dioxide is carried as bicarbonate at about 70 percent, as carbaminohemoglobin bound to hemoglobin at about 23 percent, and as dissolved CO2 at about 7 percent. Carbonic anhydrase inside the red cell converts CO2 and water to carbonic acid that dissociates into bicarbonate and hydrogen ions, and bicarbonate leaving the cell is balanced by the chloride shift.' },
        { id: 'kp2', weight: 2, description: 'The Haldane effect describes how the oxygenation state of hemoglobin changes CO2 carriage: at a PO2 of 40 mm Hg (tissue) blood holds more CO2, and at a PO2 of 100 mm Hg (lung) it holds less. Deoxygenated hemoglobin binds CO2 and hydrogen ions more readily, so unloading oxygen promotes CO2 pickup at the tissue.' },
        { id: 'kp3', weight: 1, description: 'At the lungs, loading oxygen onto hemoglobin drives CO2 off the blood and promotes its release into the alveoli, while at the tissue the reverse improves CO2 uptake; this cooperative behavior makes oxygen and CO2 transport mutually reinforcing.' },
      ],
      common_errors: [
        'Stating that most CO2 travels dissolved or bound to hemoglobin rather than as bicarbonate.',
        'Defining the Haldane effect as an oxygen affinity change rather than a CO2 carriage change driven by oxygenation.',
        'Omitting carbonic anhydrase and the chloride shift from the bicarbonate pathway.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Carbon dioxide transport',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Carbon dioxide transport', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-1',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6r-dorsal-ramp', 'atom-p2w6r-pneumotaxic-pons'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the function of the dorsal respiratory group with the function of the pneumotaxic center to explain how inspiratory depth and respiratory rate are jointly set. Describe the location and intrinsic activity of the dorsal respiratory group, the nature and behavior of its ramp signal, then explain how pneumotaxic signals from the pons modulate the duration of that ramp and the resulting changes in breath depth and frequency.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The dorsal respiratory group lies in the medulla, has intrinsic nerve activity, and generates the basic rhythm. Its inspiratory output is a ramp signal that progressively increases to the inspiratory muscles and then abruptly stops so expiration occurs passively by elastic recoil. The ramp becomes steeper when faster lung filling is required.' },
        { id: 'kp2', weight: 2, description: 'The pneumotaxic center is located in the pons and sends modulatory signals to the dorsal respiratory group that decrease the duration of the ramp signal. By cutting the ramp short it limits inspiration and makes breaths shallower.' },
        { id: 'kp3', weight: 1, description: 'Because a strong pneumotaxic signal shortens each inspiration, more breaths fit into each minute, so respiratory rate increases. The two centers therefore work together: the dorsal group sets the rhythm and ramp while the pneumotaxic center tunes how long the ramp lasts, balancing depth against rate.' },
      ],
      common_errors: [
        'Placing the pneumotaxic center in the medulla instead of the pons.',
        'Saying a strong pneumotaxic signal deepens breaths rather than making them shallower and faster.',
        'Describing the inspiratory signal as a sudden square wave rather than a progressive ramp that abruptly terminates.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Neural rhythm control',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Neural rhythm control', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-2',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6r-central-chemo', 'atom-p2w6r-peripheral-chemo', 'atom-p2w6r-chemoreflex-output'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Compare central and peripheral chemoreceptors as a single integrated chemical control system. State where each is located, the primary mediator each responds to, and how carbon dioxide and hydrogen ions act at the central site versus how oxygen acts at the peripheral site. Explain how the two together cover both carbon dioxide and oxygen disturbances. Finally, describe the systemic reflex output of arterial chemoreceptor stimulation, namely hyperpnea together with a rise in blood pressure.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Central chemoreceptors are in the brainstem and respond directly to hydrogen ions. Carbon dioxide acts indirectly: it diffuses into the cerebrospinal fluid, combines with water to form carbonic acid, and liberates hydrogen ions that excite the chemosensitive area, so the central response to carbon dioxide is mediated through pH.' },
        { id: 'kp2', weight: 2, description: 'Peripheral chemoreceptors are located in the carotid bodies at the carotid bifurcation and in the aortic bodies. Their main mediator is decreased oxygen, with the greatest effect when arterial PO2 falls below 100 mm Hg. They also respond to a lesser degree to carbon dioxide and hydrogen ions.' },
        { id: 'kp3', weight: 1, description: 'Together the two systems provide complementary coverage: the central receptors give the dominant moment to moment drive from carbon dioxide and pH, while the peripheral receptors supply the main response to low oxygen that the central receptors cannot sense.' },
        { id: 'kp4', weight: 1, description: 'Beyond sensing, the arterial peripheral chemoreceptors drive a systemic reflex output when arterial oxygen falls: they produce hyperpnea, an increase in the rate and depth of breathing, together with a reflex rise in blood pressure. These two effects act together to raise oxygen uptake in the lungs and improve delivery of oxygenated blood to the tissues during hypoxemia.' },
      ],
      common_errors: [
        'Claiming central chemoreceptors sense oxygen, or that peripheral chemoreceptors are the main carbon dioxide sensors.',
        'Saying carbon dioxide stimulates the central area directly rather than through generated hydrogen ions.',
        'Forgetting that the peripheral oxygen effect is greatest only once PO2 drops below 100 mm Hg.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Chemical control',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Chemical control', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-3',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6r-co2-vs-ph', 'atom-p2w6r-co2-major-stimulus'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the dominance of carbon dioxide as the major respiratory stimulus with the reason arterial PCO2 influences breathing more than arterial pH. Explain why carbon dioxide is the major stimulus, how it acts through pH at the chemosensitive area, and why a change in PCO2 has a greater ventilatory effect than an equivalent change in blood pH given blood brain barrier permeability.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Carbon dioxide is the major stimulus for increased respiration and acts on the chemosensitive area through pH. A rise in carbon dioxide generates hydrogen ions centrally, which is the proximate excitatory signal for ventilation.' },
        { id: 'kp2', weight: 2, description: 'Changes in arterial PCO2 have a greater effect on respiratory control than changes in arterial pH because the blood brain barrier is far more permeable to carbon dioxide than to hydrogen ions. Carbon dioxide crosses readily and then forms hydrogen ions on the brain side, whereas blood hydrogen ions penetrate poorly.' },
        { id: 'kp3', weight: 1, description: 'Consequently, although both carbon dioxide and pH influence the same chemosensitive area, carbon dioxide dominates because of its easy access; the central pH change it produces is the final common pathway, and after a few days the response to chronically high carbon dioxide is blunted.' },
      ],
      common_errors: [
        'Stating that blood hydrogen ions cross the blood brain barrier as easily as carbon dioxide.',
        'Forgetting that carbon dioxide ultimately works by changing pH at the chemosensitive area.',
        'Naming oxygen rather than carbon dioxide as the major everyday stimulus for respiration.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'CO2 dominance',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'CO2 dominance', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-4',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6r-hypoxic-drive', 'atom-p2w6r-co2-retention'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the hypoxic ventilatory drive with the clinical danger of oxygen therapy in chronic carbon dioxide retainers. Explain why the hypoxic drive normally has limited power because of falling PCO2, then explain how chronic carbon dioxide retention in severe lung disease makes a patient dependent on low oxygen and why supplemental oxygen can inhibit the respiratory drive.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Ventilation increases during hypoxia, but the response is self limiting because the resulting hyperventilation lowers PCO2, and that fall in carbon dioxide reduces the central drive, so low oxygen alone produces only a modest sustained increase in ventilation.' },
        { id: 'kp2', weight: 2, description: 'In severe lung disease and COPD with hypoxemia and hypercapnia, the response to chronically high carbon dioxide is blunted after a few days, and the kidneys adjust acid base balance. The patient comes to rely on the low oxygen stimulus to drive breathing.' },
        { id: 'kp3', weight: 1, description: 'Because such patients depend on the hypoxic drive, treating them with oxygen removes the low oxygen stimulus and inhibits the respiratory drive, which can worsen carbon dioxide retention. This links the normally weak hypoxic drive to its outsized importance once the carbon dioxide response is blunted.' },
      ],
      common_errors: [
        'Saying oxygen therapy stimulates rather than inhibits the respiratory drive in a chronic retainer.',
        'Forgetting that the hypoxic drive is normally limited by the fall in PCO2 from hyperventilation.',
        'Assuming the carbon dioxide response stays fully intact in chronic hypercapnia rather than becoming blunted.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Hypoxic drive and retention',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Hypoxic drive and retention', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-5',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6r-exercise-linear', 'atom-p2w6r-exercise-factors'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the observation that exercise ventilation rises while arterial blood gases stay near normal with the proposed mechanisms that drive exercise hyperpnea. Describe the linear relationship between ventilation and workload and the behavior of arterial PO2, PCO2, and pH, then explain the contributing factors such as cortical overflow, body movements, temperature, and a partially learned response.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'During exercise ventilation increases linearly with oxygen consumption and workload, yet arterial PO2, PCO2, and pH do not change in the correct direction to explain the increased ventilation, and PCO2 may even decrease slightly, so the chemical values remain close to normal.' },
        { id: 'kp2', weight: 2, description: 'Because the blood gases do not drive it, exercise hyperpnea is attributed to other factors: overflow of signals from the cerebral cortex to the respiratory center, sensory signals from body movements, increased body temperature, and a partially learned response.' },
        { id: 'kp3', weight: 1, description: 'The response appears designed to control PCO2 by matching ventilation to metabolic carbon dioxide production. Feedforward neural and learned mechanisms anticipate the metabolic load so that ventilation rises in step with workload and arterial gases are held nearly constant.' },
      ],
      common_errors: [
        'Attributing exercise hyperpnea to a large rise in arterial PCO2 or a fall in PO2.',
        'Ignoring the neural and learned feedforward factors and crediting only chemoreceptors.',
        'Stating that ventilation rises out of proportion to workload instead of linearly with it.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Exercise hyperpnea',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Exercise hyperpnea', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-6',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6r-lung-stretch', 'atom-p2w6r-cheyne-stokes'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the protective role of pulmonary stretch receptors with the unstable feedback loop that produces Cheyne Stokes breathing. Explain how stretch receptors and the Hering Breuer reflex limit inspiration to prevent overinflation, then explain how a delay between respiratory output and the brain sensing PCO2 destabilizes feedback and produces the waxing and waning pattern of Cheyne Stokes breathing.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Pulmonary stretch receptors lie in the smooth muscle of large and small airways and minimize the work of breathing by inhibiting excessively large tidal volumes. The Hering Breuer reflex they mediate prevents overinflation of the lungs, providing negative feedback that limits each inspiration.' },
        { id: 'kp2', weight: 2, description: 'Cheyne Stokes breathing results from a delay between the respiratory response and blood flow to the brain. PCO2 rises in the lung blood, but the brain is delayed in seeing the increase, so when it finally responds the respiratory center is strongly excited and momentarily overcompensates.' },
        { id: 'kp3', weight: 1, description: 'The two illustrate opposite ends of feedback control: stretch receptors give prompt within breath negative feedback that stabilizes tidal volume, whereas the long circulatory delay in Cheyne Stokes turns chemical feedback into oscillation, producing alternating deep breathing and apnea.' },
      ],
      common_errors: [
        'Saying stretch receptors promote large tidal volumes rather than inhibiting overinflation.',
        'Attributing Cheyne Stokes breathing to airway obstruction instead of a feedback and circulatory delay.',
        'Forgetting that the brain lags in sensing the rise in PCO2, which causes the overcompensation.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Feedback stability',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Feedback stability', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-7',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6i-obstructive-mechanism', 'atom-p2w6i-restrictive-mechanism'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the two core categories of pulmonary pathology by contrasting obstructive and restrictive disease. Define the fundamental mechanism of each (increased resistance to flow versus decreased expansion of the lungs), name the typical anatomic site or tissue problem for each, explain how lung volumes such as total lung capacity behave in each, and state whether the FEV1/FVC ratio falls or is preserved in each. Conclude by noting that a single patient can have both processes at once.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Obstructive disease is fundamentally increased resistance to flow, usually from problems in the conducting airways and especially the bronchioles. Resistance rises because the lumen is blocked by secretions or aspiration, the lumen is narrowed by smooth muscle contraction or bronchial wall hypertrophy, or parenchymal destruction removes the outward traction that normally holds airways open. Because emptying is impaired, air is trapped and lung volumes tend to be higher than normal.' },
        { id: 'kp2', weight: 2, description: 'Restrictive disease is fundamentally decreased expansion of the lungs because the lungs or surrounding tissues are stiff or rigid. The hallmark on volumes is reduced total lung capacity and reduced vital capacity, so the loop shifts toward lower volumes. Because airflow resistance can still be normal, FEV1 and FVC fall together in proportion, leaving the FEV1/FVC ratio normal or even elevated, which is the opposite of the lowered ratio seen in obstruction.' },
        { id: 'kp3', weight: 1, description: 'The two categories are not mutually exclusive; someone can have both an obstructive and a restrictive process at the same time, so a learner should not treat the spirometric patterns as forcing a single diagnosis.' },
      ],
      common_errors: [
        'Swapping the mechanisms, for example calling obstruction a problem of decreased expansion or calling restriction a problem of increased resistance.',
        'Claiming the FEV1/FVC ratio falls in restriction; in restriction the ratio is normal or elevated because FEV1 and FVC drop proportionally.',
        'Assuming a patient can only have one category at a time rather than recognizing that both can coexist.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Obstructive versus restrictive disease',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Obstructive versus restrictive disease', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-8',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6i-chronic-bronchitis', 'atom-p2w6i-emphysema'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the two main types of COPD by comparing chronic bronchitis and emphysema. For chronic bronchitis address mucus, cilia, and airway wall changes and the most common cause; for emphysema address the loss of elastic connective tissue and parenchyma, the merging of alveoli, and the listed consequences including diffusing capacity and pulmonary hypertension. Explain the unifying COPD theme of permanent damage and air trapping during exhalation, and note that a person can have both types simultaneously.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Chronic bronchitis is characterized by excessive mucous production, ciliary dysfunction, and airway narrowing with permanent scarring and swelling of the airway walls. This longterm inflammation and narrowing of the bronchi causes air to get trapped in the areas supplied by those bronchi. Smoking is the most common cause, although other irritants can also produce it.' },
        { id: 'kp2', weight: 2, description: 'Emphysema is the permanent destruction of the elastic connective tissue in the alveoli and loss of parenchyma, so alveoli merge into fewer large pockets of air instead of many small ones. This produces less elasticity, less surface area for gas exchange, and obstruction with trapping of air. The listed consequences are high airway resistance, decreased diffusing capacity, and pulmonary hypertension due to loss of large areas of pulmonary capillary networks.' },
        { id: 'kp3', weight: 1, description: 'Both types share the COPD definition of progressive, longterm, permanent damage to lung tissue that traps air during exhalation, and someone can have both chronic bronchitis and emphysema at the same time.' },
      ],
      common_errors: [
        'Attributing emphysema to excess mucus or attributing chronic bronchitis to destruction of alveolar elastic tissue, which mixes up the two mechanisms.',
        'Saying diffusing capacity increases in emphysema; it decreases because surface area and capillary networks are lost.',
        'Describing COPD damage as reversible; the defining feature is permanent, progressive damage with air trapping.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'COPD types',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'COPD types', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-9',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6i-asthma-features', 'atom-p2w6i-asthma-diagnosis'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the pathophysiology and diagnosis of asthma. First explain the three main physiological features of an asthma attack and the inflammatory trigger and mediators involved, emphasizing that the airway narrowing is reversible. Then explain how the gold standard spirometry test uses a fast acting bronchodilator and state the exact FEV1 improvement threshold that confirms the diagnosis. Tie the reversibility concept to why the bronchodilator response is diagnostic.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Asthma is an obstructive disorder with reversible narrowing of the bronchial airways, usually from inflammation triggered by an allergen or irritant that releases chemicals such as histamine and leukotrienes. Its three main physiological features are bronchial smooth muscle contraction, bronchial soft tissue swelling, and mucus overproduction with plugging, producing shortness of breath, wheeze, cough, and chest tightness.' },
        { id: 'kp2', weight: 2, description: 'The gold standard for diagnosis is spirometry measuring FEV1 before and after administration of a fast acting bronchodilator inhaler such as albuterol. An improvement in FEV1 by more than 12 percent AND more than 200 mL after the bronchodilator confirms the diagnosis. Both the percentage and the volume criteria must be satisfied together.' },
        { id: 'kp3', weight: 1, description: 'The bronchodilator response is diagnostic precisely because asthma is reversible airway obstruction; acute exacerbations are typically fully reversible, though long-term severe asthma can produce some technically irreversible chronic changes from chronic inflammation.' },
      ],
      common_errors: [
        'Listing only smooth muscle contraction and forgetting the soft tissue swelling and mucus plugging features.',
        'Stating only one threshold, such as 12 percent or 200 mL, instead of requiring both more than 12 percent and more than 200 mL.',
        'Describing asthma obstruction as fixed or irreversible like COPD, which contradicts the reversibility that makes the bronchodilator test work.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Asthma features and diagnosis',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Asthma features and diagnosis', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-10',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6i-restrictive-examples', 'atom-p2w6i-pneumothorax'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate restrictive lung disease examples with the specific example of pneumothorax. First classify restrictive causes into intrinsic and extrinsic groups and give representative examples of each. Then explain the mechanism of pneumothorax, why it causes lung collapse, its usual causes, and why both lungs do not collapse together. Explain how an extrinsic problem like pneumothorax fits the restrictive theme of decreased lung expansion.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Restrictive diseases are grouped into intrinsic causes such as diffuse interstitial pulmonary fibrosis with thick collagen deposits, sarcoidosis with chronic inflammatory granulomas, and asbestosis or silicosis from chronic irritant exposure, and extrinsic causes such as pneumothorax, kyphosis or scoliosis, obesity hypoventilation syndrome, and muscular pathologies including ALS, muscular dystrophy, and myasthenia gravis.' },
        { id: 'kp2', weight: 2, description: 'Pneumothorax occurs when air leaks into the pleural cavity and causes part of the lung to collapse due to pressure changes. It is usually caused by penetrating trauma to the chest but can also occur spontaneously, with current research examining a link between vaping and spontaneous pneumothorax. Because the two sides of the pleural cavity are separate, one lung can collapse while the other does not.' },
        { id: 'kp3', weight: 1, description: 'Pneumothorax is an extrinsic restrictive cause because the collapse reduces the lung volume that can expand, fitting the restrictive theme of decreased expansion of the lungs even though the lung tissue itself may be normal.' },
      ],
      common_errors: [
        'Classifying pneumothorax or scoliosis as intrinsic, or classifying pulmonary fibrosis as extrinsic.',
        'Stating that a pneumothorax collapses both lungs; the pleural cavities are separate so only the affected side collapses.',
        'Calling pneumothorax an obstructive process rather than a restrictive one that decreases lung expansion.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Restrictive causes and pneumothorax',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Restrictive causes and pneumothorax', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-11',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6i-atelectasis', 'atom-p2w6i-pneumonia-saturation'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the saturation consequences of atelectasis and pneumonia using Figures 43-6 and 43-7. Define each condition, then explain why atelectasis produces only a minimal fall in arterial saturation while pneumonia produces a significant fall. using the values: state the mean aortic saturation given for each condition and explain the role of blood flow through the affected lung in each case.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Atelectasis is a lack of gas exchange within the alveoli due to collapse of that portion of the lung, caused by airway obstruction, lack of surfactant, or external compression by air or fluid in the pleural space. It causes only a minimal decrease in percent saturation; although the left pulmonary veins are 60 percent saturated, flow through the atelectatic lung is only one fifth of normal, so the aortic mean saturation falls only modestly to about 91 percent.' },
        { id: 'kp2', weight: 2, description: 'Pneumonia is an acute infection causing inflammation and accumulation of fluid or pus within the alveoli. The affected lung is still well perfused, so half the cardiac output passes through 60 percent saturated blood and half through 97 percent saturated blood, dropping the aortic mean saturation significantly to about 78 percent. This is a significant decrease in arterial hemoglobin saturation.' },
        { id: 'kp3', weight: 1, description: 'The key distinction is blood flow: atelectasis reduces flow through the collapsed lung so little desaturated blood reaches the aorta, whereas pneumonia maintains flow through poorly oxygenated alveoli, sending much more desaturated blood into the systemic circulation and causing a larger drop in saturation.' },
      ],
      common_errors: [
        'Reversing the saturations, for example assigning 78 percent to atelectasis and 91 percent to pneumonia.',
        'Saying atelectasis causes a large desaturation; the reduced flow through the collapsed lung limits the drop to roughly 91 percent.',
        'Ignoring blood flow and assuming both conditions desaturate equally just because both involve poorly oxygenated alveoli.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Atelectasis versus pneumonia saturation',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Atelectasis versus pneumonia saturation', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-12',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6i-hypoxia-causes', 'atom-p2w6i-parenchyma-traction'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the general causes of hypoxia with the specific mechanism by which loss of lung parenchyma raises airway resistance. First list the major categories of hypoxia and give examples in each. Then explain how destruction of lung parenchyma removes the outward pull on adjacent airway walls and raises resistance, and identify which hypoxia category this mechanism belongs to. Connect parenchymal destruction in emphysema to the pulmonary disease pathway of hypoxia.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'causes of hypoxia into inadequate oxygenation of blood in the lungs such as low atmospheric oxygen or neuromuscular hypoventilation, pulmonary disease such as hypoventilation from increased airway resistance or decreased compliance, V/Q mismatch, and diffusion abnormalities, venous-arterial shunts, inadequate oxygen transport by the blood such as anemia, abnormal hemoglobin, reduced blood flow, or tissue edema, and inadequate usage of oxygen by the tissue such as vitamin deficiencies or cyanide.' },
        { id: 'kp2', weight: 2, description: 'Lung parenchyma normally pulls outward on the walls of adjacent airways, helping hold them open. When parenchyma is destroyed, as in emphysema, this outward traction is lost so airways narrow and resistance to airflow rises. Higher airway resistance promotes hypoventilation of the affected regions.' },
        { id: 'kp3', weight: 1, description: 'This parenchymal mechanism belongs to the pulmonary disease category of hypoxia, specifically hypoventilation due to increased airway resistance, linking the destruction of parenchyma in emphysema directly to the inadequate oxygenation pathway.' },
      ],
      common_errors: [
        'Placing cyanide or vitamin deficiency under inadequate oxygenation of blood instead of inadequate tissue usage of oxygen.',
        'Saying parenchyma pushes airways inward; it pulls them outward, and losing that traction is what raises resistance.',
        'Failing to connect increased airway resistance from parenchymal loss to the pulmonary disease category of hypoxia.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Hypoxia causes and parenchymal traction',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Hypoxia causes and parenchymal traction', ladder_tier_appropriate: 'pre-induction' },
  },

  /* coverage gap-fill (Ch 38 to 43) synthesis */

  {
    id: 'r-p2-wk3-15',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3v-pressure-volume-hysteresis', 'atom-p2w3v-saline-vs-air-compliance'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Integrate hysteresis of the lung pressure volume curve with the saline versus air filled lung experiment to explain how surface tension shapes lung compliance. Explain why both phenomena point to surface tension as the dominant elastic force and what changes when the air liquid interface is removed.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Both observations arise from the air liquid interface lining the alveoli. Hysteresis, the failure of the inflation and deflation limbs of the pressure volume loop to coincide, is driven by surface tension and by surfactant, which lowers tension more as the surface shrinks during deflation. The air filled lung therefore needs more pressure to inflate than it returns on deflation, producing the open loop.' },
        { id: 'kp2', weight: 2, description: 'Filling the lung with saline abolishes the air liquid interface, removing surface tension and leaving only the tissue elastic force. The saline filled lung is far more compliant, its curve is much steeper, and it shows almost no hysteresis. The disappearance of both the stiffness and the loop when the interface is removed demonstrates that surface tension, not tissue elasticity, is the larger of the two elastic forces, accounting for about two thirds of lung recoil.' },
        { id: 'kp3', weight: 1, description: 'Clinically this is why surfactant matters. Surfactant from type II cells reduces surface tension, increasing compliance and stabilizing alveoli, and its deficiency, as in neonatal respiratory distress syndrome, produces stiff lungs with exaggerated surface tension effects.' },
      ],
      common_errors: [
        'Treating hysteresis and compliance as the same quantity rather than recognizing hysteresis as the gap between the two limbs',
        'Attributing the stiffness of the air filled lung mainly to tissue elastin rather than to surface tension',
        'Forgetting that the saline experiment works by removing the air liquid interface, not by diluting surfactant',
      ],
      minimum_passing_score: 60,
    },
    topic: 'surface-tension-and-the-pressure-volume-curve',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'surface-tension-and-the-pressure-volume-curve', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk3-16',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3v-maximal-expiratory-flow', 'atom-p2w3v-airway-radial-traction'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Integrate radial traction during inspiration with effort independent maximal expiratory flow to explain how the pleural pressure acting on intrathoracic airways changes their caliber across the breathing cycle. Explain why resistance is lowest at high lung volume and why harder expiratory effort fails to raise flow.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The intrathoracic airways are surrounded by pleural pressure, so their caliber tracks that pressure. During inspiration pleural pressure becomes more subatmospheric and exerts radial traction that pulls the airways open, widening them and lowering resistance. This is why airway resistance is lowest at high lung volumes near full inspiration, where the airways are maximally tethered open.' },
        { id: 'kp2', weight: 2, description: 'During a forced expiration the same coupling works in reverse. Strongly positive pleural pressure is transmitted around the airways, and at a downstream point the outside pressure exceeds the inside pressure, dynamically compressing the airway. Because greater effort raises both the driving pressure and the compressing pressure equally, expiratory flow reaches a ceiling and becomes effort independent over most of the vital capacity.' },
        { id: 'kp3', weight: 1, description: 'Together these explain the maximal expiratory flow volume curve. Flow is highest near total lung capacity, where recoil is large and airways are widely tethered, and declines toward residual volume as recoil falls and dynamic compression dominates, a pattern exaggerated in obstructive disease.' },
      ],
      common_errors: [
        'Assuming positive pleural pressure widens airways, when it is negative inspiratory pressure that does so',
        'Believing that maximal expiratory flow can always be raised by blowing harder',
        'Confusing the inspiratory radial traction phase with the expiratory dynamic compression phase',
      ],
      minimum_passing_score: 60,
    },
    topic: 'pleural-pressure-and-airway-caliber',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'pleural-pressure-and-airway-caliber', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk3-17',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3v-conducting-airway-anatomy', 'atom-p2w3v-laryngeal-vocalization'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Integrate the anatomy of the conducting airways with the laryngeal control of the vocal cords to explain the dual role of the larynx as both an air conduit and the organ of voice. Trace the air pathway and explain how cord position switches between breathing and phonation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The larynx sits in the conducting pathway between the pharynx above and the trachea below, which bifurcates at the carina into the main bronchi. As a conduit it must stay open for airflow, and this is achieved by the posterior cricoarytenoid, the sole abductor, which pulls the vocal cords apart to widen the glottis during breathing. The epiglottis and glottis also protect this opening during swallowing.' },
        { id: 'kp2', weight: 2, description: 'The same structure also generates voice. For phonation the lateral cricoarytenoid and interarytenoid muscles adduct the cords toward the midline, and expired air driven up from the trachea forces through the narrowed glottis and sets the cords vibrating. Thus the larynx alternates between an abducted, open configuration for ventilation and an adducted, vibrating configuration for speech, using the same intrinsic muscles and cartilages.' },
        { id: 'kp3', weight: 1, description: 'This dual role explains the clinical danger of bilateral posterior cricoarytenoid or recurrent laryngeal nerve injury, which leaves the cords adducted and can obstruct the airway even though phonation may be partly preserved.' },
      ],
      common_errors: [
        'Forgetting that the larynx is part of the conducting airway and treating it only as a voice box',
        'Reversing the muscle roles by naming an adductor as the abductor that opens the airway',
        'Confusing the order of the air pathway, for example placing the carina above the larynx',
      ],
      minimum_passing_score: 60,
    },
    topic: 'larynx-as-conduit-and-voice-organ',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'larynx-as-conduit-and-voice-organ', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk3-18',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3v-respiratory-system-overview', 'atom-p2w3v-alveolar-cell-types'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Integrate the overall purpose and functions of the respiratory system with the cellular structure of the alveolar wall to explain how the alveolus is built to carry out the diffusion function. Connect each relevant function to a feature of the alveolar cells.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The primary goal of the respiratory system is to deliver oxygen and remove carbon dioxide, accomplished by ventilation, regulation of ventilation, diffusion, and transport. The diffusion step occurs at the alveolus, and Fick law tells us its rate depends on a large surface area and a short diffusion distance. The alveolar wall is built precisely to meet these demands.' },
        { id: 'kp2', weight: 2, description: 'Flat type I pneumocytes cover most of the alveolar surface and, together with the capillary endothelial cells, form an extremely thin respiratory membrane that minimizes diffusion distance, while the vast number of alveoli provides the huge area. Type II pneumocytes secrete surfactant that keeps the alveoli open so the surface area is preserved. Macrophages, mast cells, and fibroblasts protect and support the wall without thickening the diffusion path.' },
        { id: 'kp3', weight: 1, description: 'Thus the structural design directly serves the functional goal: ventilation delivers fresh gas, the thin type I and endothelial barrier and the large surfactant stabilized area maximize diffusion, and the blood then transports the gases, with neural regulation matching all of this to metabolic need.' },
      ],
      common_errors: [
        'Failing to connect the diffusion function to the thinness and large area provided by the type I cells and capillary endothelium',
        'Crediting type II cells with forming the gas exchange surface rather than with secreting surfactant',
        'Listing the four functions without explaining which one the alveolar wall is specialized to perform',
      ],
      minimum_passing_score: 60,
    },
    topic: 'alveolar-structure-serves-gas-exchange',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'alveolar-structure-serves-gas-exchange', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk3-19',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w3v-respiratory-notation', 'atom-p2w3v-thoracic-cage-mechanics'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Integrate the standard respiratory notation with the mechanics of inspiration to describe and quantify what happens during a breath. Use the notation conventions and sign conventions to express the pressures that result from the thoracic dimension changes.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Inspiration enlarges the thorax in two dimensions: external intercostal contraction elevates the rib cage and increases the anteroposterior diameter, while diaphragmatic descent increases the vertical diameter. The rise in thoracic volume, by Boyle law, lowers the alveolar pressure below atmospheric, and the resulting pressure difference drives air inward until the alveoli refill.' },
        { id: 'kp2', weight: 2, description: 'Standard notation lets us express the results precisely. Partial pressures use P with a gas name, and location subscripts identify the compartment: A for alveolar gas, a for arterial blood, I for inspired gas. Thus during inspiration the alveolar pressure becomes slightly subatmospheric, freshly inspired gas with a known FIO2 enters, and over the cycle this maintains the arterial PaO2 and PaCO2. The case of the subscript distinguishes alveolar gas, A, from arterial blood, a.' },
        { id: 'kp3', weight: 1, description: 'The sign convention is also key: pleural pressure is reported as negative, about minus 5 at rest and minus 8 during inspiration, while alveolar pressure swings slightly negative on inspiration and slightly positive on expiration. Keeping the symbols and signs straight is what allows clinicians to read blood gas and airway pressure data correctly.' },
      ],
      common_errors: [
        'Mislabeling alveolar pressure as PaO2 or otherwise confusing the uppercase A alveolar subscript with the lowercase a arterial subscript',
        'Forgetting that the diaphragm descends, and that this increases the vertical rather than the anteroposterior diameter',
        'Reporting pleural pressure as positive at rest instead of about minus 5 cm of water',
      ],
      minimum_passing_score: 60,
    },
    topic: 'notation-applied-to-inspiratory-mechanics',
    chapter: 'pp2-wk-3',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'notation-applied-to-inspiratory-mechanics', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk4-7',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w4s-aortic-vs-pulmonary', 'atom-p2w4s-left-atrial-pressure'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Integrate the aortic versus pulmonary pressure contrast with the downstream left atrial pressure to trace the full pressure profile of the pulmonary circuit and explain why it is a low pressure system and how that protects the capillaries.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The aortic curve peaks near 120 over 75 mmHg whereas the pulmonary artery peaks at only 25 over 8 mmHg, about one fifth of systemic, showing the pulmonary circuit is a low pressure system despite carrying the full cardiac output.' },
        { id: 'kp2', weight: 2, description: 'Pressure falls from a mean of 15 mmHg in the pulmonary artery to about 7 mmHg in the capillaries and 2 mmHg in the left atrium, so the driving pressure across the lung is only about 13 mmHg and most of the drop is upstream of the capillaries.' },
        { id: 'kp3', weight: 1, description: 'The low capillary pressure keeps net filtration small and the alveoli dry, but because left atrial pressure is so low even modest backward rises from mitral stenosis or left heart failure are transmitted to the capillaries and can cause edema.' },
      ],
      common_errors: [
        'Claiming pulmonary and systemic pressures are similar because both carry the whole cardiac output',
        'Giving left atrial pressure as 7 mmHg or placing most of the pressure drop downstream of the capillaries',
        'Forgetting that a low capillary pressure is what normally keeps filtration minimal and the alveoli dry',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pulmonary pressure profile',
    chapter: 'pp2-wk-4',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Pulmonary pressure profile', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk4-8',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w4s-blood-reservoir', 'atom-p2w4s-fick-principle'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Integrate the pulmonary blood reservoir with the Fick principle to explain how the lungs both hold and transmit the cardiac output and how that flow is quantified.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The pulmonary vessels hold about 500 mL of blood that can shift to or from the systemic circulation, acting as a reservoir buffered between the right and left heart.' },
        { id: 'kp2', weight: 2, description: 'Despite holding a reservoir, the lungs transmit the entire cardiac output, so pulmonary blood flow equals systemic output at about 5 liters per minute at rest in the steady state.' },
        { id: 'kp3', weight: 1, description: 'The Fick principle quantifies that flow as oxygen consumption divided by the arteriovenous oxygen content difference, linking the volume of blood passing the lungs to the oxygen it picks up.' },
      ],
      common_errors: [
        'Confusing the 500 mL reservoir volume with the 5 liter per minute flow',
        'Treating pulmonary flow as different from systemic cardiac output at steady state',
        'Mixing up the Fick principle for flow with the Fick law of diffusion',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pulmonary reservoir and flow measurement',
    chapter: 'pp2-wk-4',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Pulmonary reservoir and flow measurement', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk4-9',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w4s-pressure-buffer', 'atom-p2w4s-zone3'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Integrate the recruitment and distension pressure buffering with the zone 3 condition at the lung base to explain how the lung accommodates large increases in flow during exercise without a large pressure rise.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Recruitment of closed capillaries and distension of open ones lower pulmonary vascular resistance as output rises, so pulmonary arterial pressure climbs only slightly from its resting anchor of about 15 mmHg at 4 to 5 liters per minute.' },
        { id: 'kp2', weight: 2, description: 'During exercise or recumbency more of the lung enters zone 3, where arterial and venous pressures both exceed alveolar pressure and flow is continuous, so additional capillary surface is recruited at the base and middle of the lung.' },
        { id: 'kp3', weight: 1, description: 'Together these mechanisms let the lung accept several times the resting output while keeping capillary pressure low, protecting against exercise induced edema until the buffering is exhausted at very high outputs.' },
      ],
      common_errors: [
        'Believing pulmonary pressure rises in proportion to output instead of being buffered',
        'Forgetting that increased flow converts more lung to zone 3 by recruiting capillaries',
        'Assuming the buffering never fails, when at maximal output the pressure curve steepens',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pressure buffering and zone 3',
    chapter: 'pp2-wk-4',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Pressure buffering and zone 3', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk4-10',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w4s-zone1', 'atom-p2w4s-zone2'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Integrate zone 1 and zone 2 of the lung to contrast absent versus intermittent perfusion, stating the pressure relationships and the conditions or regions in which each occurs.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Zone 1 has no flow because alveolar pressure exceeds both arterial and venous pressure and collapses the capillary, whereas zone 2 has intermittent flow because alveolar pressure lies between arterial and venous pressure.' },
        { id: 'kp2', weight: 2, description: 'In zone 2 the capillary opens during systole when arterial pressure rises above alveolar pressure and closes in diastole, so flow is driven by the arterial minus alveolar difference rather than the usual arterial minus venous difference.' },
        { id: 'kp3', weight: 1, description: 'Zone 1 is normally absent because apical arterial pressure stays above alveolar pressure, appearing only with hemorrhage or positive pressure ventilation, while zone 2 occupies the upper lung at rest.' },
      ],
      common_errors: [
        'Swapping the definitions so zone 1 is described as intermittent and zone 2 as absent',
        'Using the arterial minus venous difference for zone 2 driving pressure',
        'Believing zone 1 is normally present at the apex of a healthy upright lung',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Lung zones 1 and 2',
    chapter: 'pp2-wk-4',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Lung zones 1 and 2', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk4-11',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w4s-alveolar-gas-values', 'atom-p2w4s-surface-tension-pore'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Integrate the normal alveolar and capillary gas values with the surface tension at the alveolar pore to explain how a healthy alveolus both exchanges gas fully and stays dry.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'In a normal alveolus with oxygen at 100 mmHg and carbon dioxide at 40 mmHg, blood entering at oxygen 40 and carbon dioxide 45 equilibrates to oxygen near 100 and carbon dioxide near 40 by the venous end, achieving complete gas exchange.' },
        { id: 'kp2', weight: 2, description: 'Surface tension at the alveolar pore adds about 8 mmHg of outward pull on fluid, one of the outward forces tallied in the capillary balance, and surfactant normally keeps this tension low.' },
        { id: 'kp3', weight: 1, description: 'Even though surface tension favors fluid movement outward, the alveolus stays thin and dry because negative interstitial pressure and lymphatic drainage clear the small filtered volume, preserving the short diffusion path needed for full equilibration.' },
      ],
      common_errors: [
        'Reversing the entering capillary gas values or giving alveolar carbon dioxide as 45 mmHg',
        'Treating surface tension as an inward force instead of an outward pull',
        'Forgetting that surfactant and lymphatic drainage are what keep the gas exchange surface dry',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Alveolar gas exchange and dryness',
    chapter: 'pp2-wk-4',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Alveolar gas exchange and dryness', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk4-12',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w4s-edema-definition', 'atom-p2w4s-edema-threshold-curve'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Integrate the definition of pulmonary edema with the left atrial pressure threshold curve to explain why edema is absent at normal pressures and accelerates sharply once a critical pressure is crossed.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Pulmonary edema is fluid accumulation in the interstitial space that spills into the alveoli once the filtration rate exceeds lymphatic removal, widening the diffusion distance and impairing gas exchange.' },
        { id: 'kp2', weight: 2, description: 'The rate of edema formation stays near zero until left atrial pressure rises above about 23 mmHg, then climbs steeply toward 40 to 50 mmHg, illustrating the safety factor at normal filling pressures.' },
        { id: 'kp3', weight: 1, description: 'The threshold marks where rising capillary pressure approaches plasma colloid osmotic pressure and overwhelms maximal lymphatic pumping, so small further pressure rises cause large increases in interstitial and alveolar fluid.' },
      ],
      common_errors: [
        'Defining edema as alveolar fluid first rather than interstitial accumulation first',
        'Drawing edema as a linear function from zero pressure rather than appearing above a threshold',
        'Placing the threshold near normal capillary pressure instead of about 23 mmHg',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Edema definition and threshold',
    chapter: 'pp2-wk-4',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Edema definition and threshold', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk4-13',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w4s-edema-permeability-gases', 'atom-p2w4s-edema-intrapleural'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Integrate increased membrane permeability from noxious gases with negative pressure edema from laryngeal spasm to contrast two non pressure overload routes to pulmonary edema and their mechanisms.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Inhaled chlorine or sulfur dioxide and infection damage the capillary membrane and raise its permeability, letting protein and fluid leak into the interstitium and abolishing the protective inward osmotic gradient.' },
        { id: 'kp2', weight: 2, description: 'A large decrease in intrapleural pressure from inspiring against a closed airway, as in severe laryngeal spasm, is transmitted to the interstitial and alveolar spaces and raises the transmural filtration pressure from the tissue side.' },
        { id: 'kp3', weight: 1, description: 'Both routes cause edema without a primary rise in pulmonary venous pressure, but permeability edema carries protein into the interstitium and is harder to treat, while negative pressure edema often resolves once the airway obstruction is relieved.' },
      ],
      common_errors: [
        'Attributing noxious gas edema to high capillary pressure rather than permeability',
        'Thinking the negative intrapleural pressure pulls air rather than fluid into the tissue',
        'Overlooking that neither mechanism requires elevated pulmonary venous pressure',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Permeability and negative pressure edema',
    chapter: 'pp2-wk-4',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Permeability and negative pressure edema', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk4-14',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w4s-lymphatic-safety', 'atom-p2w4s-pleural-negative-pressure'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Integrate the lymphatic safety factor against alveolar edema with the role of pleural lymphatics in maintaining negative pleural pressure to explain how lymphatic drainage protects both the interstitium and the pleural space.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Pulmonary lymphatics pump filtered fluid and leaked protein out of the interstitium and can increase flow several fold, which is why alveolar edema does not appear until capillary or left atrial pressure rises well above normal.' },
        { id: 'kp2', weight: 2, description: 'Because the net Starling force is plus 1 mmHg, fluid filters continuously into the pleural space, and the pleural lymphatics remove it at the same rate, keeping the pleural space at a slightly negative pressure that holds the lungs expanded.' },
        { id: 'kp3', weight: 1, description: 'In both the interstitium and the pleural space, edema or effusion appears only when filtration exceeds the maximal lymphatic pumping capacity, so adequate lymphatic drainage is the common safety factor protecting the lung from fluid accumulation.' },
      ],
      common_errors: [
        'Assuming lymphatic flow is fixed rather than able to rise several fold before fluid accumulates',
        'Believing the pleural space is at positive pressure rather than negative pressure',
        'Forgetting that both alveolar edema and pleural effusion reflect filtration exceeding lymphatic capacity',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Lymphatic drainage of interstitium and pleura',
    chapter: 'pp2-wk-4',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Lymphatic drainage of interstitium and pleura', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-13',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5g-net-diffusion', 'atom-p2w5g-total-pressure-sum'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate net diffusion down a gradient with the rule that total pressure is the sum of partial pressures to explain how each gas in a mixture diffuses across the respiratory membrane independently and why oxygen and carbon dioxide can move in opposite directions simultaneously.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Total pressure is the sum of the partial pressures of oxygen, nitrogen, carbon dioxide, and water vapor, with each gas exerting a partial pressure proportional to its concentration. Each gas therefore has its own partial pressure on each side of the respiratory membrane.' },
        { id: 'kp2', weight: 2, description: 'Net diffusion of each gas is driven by its own partial pressure difference, down its own gradient, independent of the other gases. This is why oxygen can diffuse from alveolus to blood while carbon dioxide diffuses from blood to alveolus at the same time and place.' },
        { id: 'kp3', weight: 1, description: 'Molecules of every gas move randomly in both directions, but the net flux for each follows its partial pressure gradient, so the additive total pressure does not by itself drive net transfer of any single gas.' },
      ],
      common_errors: [
        'Thinking the total pressure gradient, rather than each gas partial pressure gradient, drives diffusion',
        'Assuming all gases must diffuse in the same direction across the membrane',
        'Treating partial pressures as averaging instead of summing to the total',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Partial pressures and independent diffusion',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Partial pressures and independent diffusion', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-14',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5g-resp-unit-components', 'atom-p2w5g-resp-unit-microanatomy'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the named components of the respiratory unit with its capillary and interstitial microanatomy to describe the full path from terminal bronchiole to the gas exchange surface and how the surrounding structures support efficient diffusion.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The respiratory unit runs from the terminal bronchiole through the respiratory bronchiole and alveolar ducts to the alveolar sacs, where gas exchange occurs across very thin alveolar walls. Air is delivered sequentially through these components to the terminal sacs.' },
        { id: 'kp2', weight: 2, description: 'At the alveolar sacs, the microanatomy shows a dense pulmonary capillary network spread over the alveolar walls, with interstitial spaces, a lymphatic vessel, and perivascular interstitial space. This places blood in intimate contact with alveolar gas over a wide area.' },
        { id: 'kp3', weight: 1, description: 'The lymphatic vessel and interstitial drainage keep the membrane thin by clearing fluid, preserving the short diffusion distance that, together with the large capillary surface area, makes exchange rapid.' },
      ],
      common_errors: [
        'Placing gas exchange in the bronchioles rather than the alveolar sacs',
        'Ignoring the role of lymphatics and interstitial drainage in keeping the membrane thin',
        'Reversing the airway sequence from sacs back toward the bronchioles',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Respiratory unit structure and microanatomy',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Respiratory unit structure and microanatomy', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-15',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5g-alveoli-number-size', 'atom-p2w5g-diffusing-capacity-formula'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the number and size of alveoli with the diffusing capacity formula to explain how alveolar geometry and membrane thickness set the diffusing capacity and how exercise changes it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'About 300 million alveoli, each roughly 0.2 mm in diameter with very thin walls, create an enormous total surface area and a short diffusion distance. These anatomical features map directly onto the area and thickness terms of the diffusing capacity formula.' },
        { id: 'kp2', weight: 2, description: 'Diffusing capacity DL equals area times diffusion coefficient divided by thickness, so the large alveolar surface area raises DL while any increase in membrane thickness lowers it. The huge surface from many small alveoli is therefore a structural basis for a high diffusing capacity.' },
        { id: 'kp3', weight: 1, description: 'During exercise, capillary recruitment and distension increase the effective surface area, so diffusing capacity rises further, consistent with area appearing in the numerator of the formula.' },
      ],
      common_errors: [
        'Thinking fewer, larger alveoli would improve diffusing capacity',
        'Placing thickness in the numerator so that a thicker membrane appears to raise DL',
        'Stating diffusing capacity falls during exercise',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Alveolar geometry and diffusing capacity',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Alveolar geometry and diffusing capacity', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-16',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5g-alveolar-air-table', 'atom-p2w5g-airway-partial-pressures'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the composition of alveolar air table with the partial airway pressure profile to explain why expired air values are intermediate between alveolar and inspired air and how dead space accounts for this.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'alveolar air PO2 about 104 and PCO2 about 40, while expired air is PO2 about 120 and PCO2 about 27, intermediate between alveolar and humidified inspired air. Each air column still totals 760 mm Hg.' },
        { id: 'kp2', weight: 2, description: 'this is explained: dead space air leaves first with PO2 near 150 and PCO2 near 0 because it never exchanged with blood, then alveolar air follows with PO2 near 100 and PCO2 near 40. Mixing these two streams produces the intermediate expired values.' },
        { id: 'kp3', weight: 1, description: 'Because expired gas is a blend of unexchanged dead space air and true alveolar air, expired PO2 exceeds alveolar PO2 and expired PCO2 is below alveolar PCO2, which is why expired values cannot be read directly as alveolar values.' },
      ],
      common_errors: [
        'Equating expired air PO2 with alveolar PO2 of 104 rather than the higher 120',
        'Assuming alveolar air exits before dead space air',
        'Forgetting that dead space air keeps inspired like values because it did not exchange',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Alveolar versus expired air and dead space',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Alveolar versus expired air and dead space', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-17',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5g-alveolar-gas-equation', 'atom-p2w5g-exchange-ratio-r'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the alveolar gas equation with the meaning of the respiratory exchange ratio R to compute alveolar PO2 and explain how alveolar values relate to arterial values in a healthy person.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The alveolar gas equation PAO2 equals PIO2 minus PCO2 divided by R uses humidified inspired PO2 of 149, alveolar PCO2 of 40, and R of 0.8 to give 149 minus 50 equal to 99 mm Hg, close to the rounded alveolar PO2 of 104.' },
        { id: 'kp2', weight: 2, description: 'R is the respiratory exchange ratio of about 0.8, reflecting carbon dioxide output relative to oxygen uptake. As the divisor of PCO2 in the equation, R determines how much a given alveolar PCO2 lowers alveolar PO2 below inspired PO2.' },
        { id: 'kp3', weight: 1, description: 'In a normal healthy person alveolar PO2 equals arterial PO2 and alveolar PCO2 equals arterial PCO2, so the computed alveolar PO2 approximates the value found in arterial blood when there is no diffusion impairment or shunt.' },
      ],
      common_errors: [
        'Using R equal to 1.0 and getting 109 instead of 99',
        'Substituting atmospheric PO2 of 159 rather than humidified 149 for PIO2',
        'Forgetting the alveolar equals arterial equality requires healthy lungs without shunt',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Alveolar gas equation and exchange ratio',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Alveolar gas equation and exchange ratio', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-18',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5g-pco2-constant-doubling', 'atom-p2w5g-control-alveolar-po2'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the alveolar PCO2 equation with the two factors controlling alveolar PO2 to explain how a change in metabolic rate forces a matching change in ventilation to keep both arterial PO2 and PCO2 normal.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Alveolar PCO2 equals carbon dioxide production times K over alveolar ventilation with K equal to 863, so PCO2 rises with production and falls with ventilation; doubling ventilation halves PCO2. Alveolar PO2 meanwhile is set by the balance of oxygen absorption and oxygen entry by ventilation.' },
        { id: 'kp2', weight: 2, description: 'Raising metabolic rate increases both oxygen absorption and carbon dioxide production. To keep alveolar PO2 from falling and PCO2 from rising, alveolar ventilation must increase proportionally, which is why much higher ventilation is required at 1000 than at 250 mL O2 per min.' },
        { id: 'kp3', weight: 1, description: 'Both equations point to alveolar ventilation as the regulated variable that matches gas exchange to metabolic demand, holding arterial PO2 and PCO2 near their normal values across a wide range of activity.' },
      ],
      common_errors: [
        'Thinking higher metabolism allows lower ventilation while keeping gases normal',
        'Treating PCO2 as directly proportional to ventilation rather than inversely',
        'Listing factors other than oxygen absorption and ventilation entry as controlling alveolar PO2',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Ventilation matching to metabolic demand',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Ventilation matching to metabolic demand', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-19',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5g-vent-defs-po2', 'atom-p2w5g-vq-directional'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the PO2 and PCO2 based definitions of hyperventilation and hypoventilation with the directional effect of V/Q on alveolar gases to explain how a change in V/Q moves a lung unit between hyperventilated and hypoventilated states.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Hyperventilation gives alveolar PO2 above 100 and PCO2 below 40, while hypoventilation gives alveolar PO2 below 100 and PCO2 above 40. These are defined relative to metabolic need, and PO2 and PCO2 always move oppositely because they are inversely related through ventilation.' },
        { id: 'kp2', weight: 2, description: 'Increasing V/Q raises alveolar PO2 and lowers alveolar PCO2, pushing a unit toward the hyperventilated pattern, while decreasing V/Q lowers PO2 and raises PCO2, pushing toward the hypoventilated pattern. The directional V/Q effect therefore underlies the gas based definitions.' },
        { id: 'kp3', weight: 1, description: 'At the high V/Q extreme alveolar gas approaches inspired values, the most hyperventilated case, and at the low V/Q extreme it approaches mixed venous values, the most hypoventilated case, bounding the continuum.' },
      ],
      common_errors: [
        'Pairing hyperventilation with a low PO2 or a high PCO2',
        'Saying increasing V/Q raises both PO2 and PCO2',
        'Treating the PO2 and PCO2 definitions of ventilation status as contradictory rather than equivalent',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Ventilation status and V/Q direction',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Ventilation status and V/Q direction', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-20',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5g-vq-mismatch-causes', 'atom-p2w5g-normal-blood-gas-values'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the causes of V/Q mismatch with the normal mixed venous and systemic arterial gas values to explain how asthma and pulmonary embolism shift a lung unit toward the venous or inspired end of the gas spectrum.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Normally mixed venous blood entering the lung has PO2 about 40 and PCO2 about 45, and after exchange systemic arterial blood leaves with PO2 about 100 and PCO2 about 40. These end points bracket what a lung unit can produce depending on its V/Q.' },
        { id: 'kp2', weight: 2, description: 'Asthma narrows airways, reducing ventilation and lowering V/Q, which drives that unit toward the mixed venous values of PO2 40 and PCO2 45. Pulmonary embolism obstructs perfusion, raising V/Q, which drives the unit toward inspired values of high PO2 and near zero PCO2.' },
        { id: 'kp3', weight: 1, description: 'Both pathologies worsen V/Q mismatch and pull regional alveolar gas away from the normal 104 and 40, so blood leaving a low V/Q unit resembles mixed venous blood while a high V/Q unit adds little oxygen because it has little blood to oxygenate.' },
      ],
      common_errors: [
        'Swapping the effects so that asthma reduces perfusion and embolism reduces ventilation',
        'Confusing mixed venous values of 40 and 45 with arterial values of 100 and 40',
        'Believing a normal lung has uniform V/Q with no regional mismatch',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pathologic V/Q mismatch and alveolar gas',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Pathologic V/Q mismatch and alveolar gas', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-21',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5g-dilution-slow', 'atom-p2w5g-schematic-lung-unit'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the slow dilution of alveolar gas with the variables of the lung unit model to explain how ventilation and blood flow together set and stabilize the alveolar gas composition of a lung unit.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'In the lung unit model, alveolar ventilation delivers fresh inspired gas while blood flow adds carbon dioxide and removes oxygen, and the balance of these two flows sets the alveolar PO2 and PCO2. The alveolar gas the unit holds is the running result of gas coming in by ventilation and gas exchanged with capillary blood.' },
        { id: 'kp2', weight: 2, description: 'Because each breath replaces only a fraction of the gas in the unit, alveolar composition changes slowly; raising ventilation speeds the approach to a new steady state while lowering it slows the change. This slow dilution buffers the unit so its PO2 and PCO2 do not swing abruptly between breaths.' },
        { id: 'kp3', weight: 1, description: 'Together these ideas show why a unit holds a stable alveolar PO2 and PCO2: a large resident gas volume diluted gradually, continuously refreshed by ventilation and drawn upon by perfusion, keeps arterial gases and pH steady even if a breath is briefly skipped.' },
      ],
      common_errors: [
        'Assuming a single breath fully replaces the gas in a lung unit',
        'Setting alveolar composition by ventilation alone and ignoring the perfusion limb',
        'Thinking faster ventilation slows rather than speeds the approach to steady state',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Lung unit gas dynamics and stability',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Lung unit gas dynamics and stability', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-22',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5g-co2-excretion-metabolic', 'atom-p2w5g-diffusing-capacity-definition'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the rise in carbon dioxide excretion with metabolic rate and the definition of diffusing capacity to explain how the lung moves much more gas per minute during exercise and how both ventilation and the membrane accommodate it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Carbon dioxide excretion rises from about 200 to about 800 mL per min as metabolic rate increases roughly fourfold, and oxygen uptake rises in parallel, so the volume of gas crossing the membrane each minute climbs steeply during exercise.' },
        { id: 'kp2', weight: 2, description: 'Diffusing capacity is the volume of gas crossing the membrane each minute per 1 mm Hg of partial pressure difference, and it increases during exercise as more capillaries are recruited. A higher diffusing capacity lets the membrane carry the larger gas load without needing a larger partial pressure gradient.' },
        { id: 'kp3', weight: 1, description: 'Thus exercise raises gas transfer through two complementary changes: increased ventilation removes the extra carbon dioxide and supplies oxygen, while the rising diffusing capacity moves more gas per unit gradient across the respiratory membrane.' },
      ],
      common_errors: [
        'Thinking diffusing capacity stays fixed while gas transfer rises sharply in exercise',
        'Expressing diffusing capacity per minute without referencing the 1 mm Hg gradient',
        'Assuming only ventilation changes in exercise while the membrane capacity is unchanged',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Gas load and diffusing capacity in exercise',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Gas load and diffusing capacity in exercise', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-23',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5t-gas-cascade', 'atom-p2w5t-no-rbc-plasma'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the oxygen cascade from atmosphere to alveolus with the no red cell example to explain how partial pressure is established by diffusion while content depends on hemoglobin.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The oxygen cascade falls stepwise from atmospheric 159 mm Hg to humidified 149 mm Hg to alveolar 104 mm Hg as humidification dilutes the gas and alveolar exchange adds CO2 (PCO2 40) and removes oxygen. This sets the alveolar partial pressure that becomes the driving force for diffusion into blood.' },
        { id: 'kp2', weight: 2, description: 'Even with no red cells, plasma PO2 still equilibrates upward toward the alveolar value (about 100 mm Hg) by simple diffusion, demonstrating that partial pressure is a function of the pressure gradient and does not require hemoglobin. Partial pressure is maintained purely by gas equilibration.' },
        { id: 'kp3', weight: 1, description: 'Content in that same plasma is minimal (about 0.3 mL per dL) because oxygen solubility is only 0.003 mL per dL per mm Hg, so although the cascade fixes a normal partial pressure, hemoglobin is required to convert that pressure into adequate carried content.' },
      ],
      common_errors: [
        'Assuming the cascade values represent content rather than partial pressure',
        'Believing plasma PO2 cannot rise without red cells',
        'Conflating the maintained partial pressure with adequate content',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Gas cascade and carriage',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Gas cascade and carriage', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-24',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5t-tissue-pco2-gradient', 'atom-p2w5t-metabolism-flow-pco2'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the tissue capillary CO2 gradient with the effect of metabolism and blood flow to explain what sets tissue PCO2 and its limits.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Carbon dioxide moves down its gradient from the cell interior (about 46 mm Hg) through interstitial fluid (about 45 mm Hg) into capillary blood, which enters at an arterial PCO2 of 40 and leaves the venous end at about 45 mm Hg. This gradient is the route by which metabolically produced CO2 reaches the blood.' },
        { id: 'kp2', weight: 2, description: 'The actual tissue PCO2 reflects a balance between production and removal: raising metabolism with constant flow makes CO2 accumulate and tissue PCO2 climb, while raising blood flow washes CO2 out and lowers tissue PCO2 toward the arterial value.' },
        { id: 'kp3', weight: 1, description: 'There is a floor: even at infinite blood flow tissue PCO2 cannot fall below the incoming arterial PCO2 of about 40 mm Hg, just as the gradient shows blood never dropping below 40 at the arterial end. Flow can approach but not breach this lower limit.' },
      ],
      common_errors: [
        'Sending CO2 from blood into the cell at the tissue capillary',
        'Claiming tissue PCO2 can be driven below arterial 40 mm Hg with enough flow',
        'Attributing tissue PCO2 to metabolism while ignoring blood flow',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Tissue carbon dioxide',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Tissue carbon dioxide', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-25',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5t-exercise-uptake', 'atom-p2w5t-delivery-strategies'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the mechanisms of improved pulmonary uptake during exercise with the three strategies for increasing tissue oxygen delivery to explain how the body meets a high oxygen demand.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'At the lung, exercise raises cardiac output (shortening transit time) yet uptake stays complete because diffusing capacity rises through capillary recruitment and better V/Q matching, and the large diffusion safety factor (0.25 of 0.75 seconds) guarantees equilibration. This keeps arterial oxygen content high even at high workloads.' },
        { id: 'kp2', weight: 2, description: 'At the tissue, delivery (content times flow) is augmented three ways: increased blood flow multiplies the oxygen presented, increased extraction pulls more oxygen off hemoglobin and widens the arteriovenous difference, and a rightward curve shift from increased CO2, hydrogen ions, temperature, and BPG lowers affinity to release more oxygen at a given PO2.' },
        { id: 'kp3', weight: 1, description: 'The lung and tissue mechanisms are complementary: the same increased cardiac output that shortens pulmonary transit also drives the higher flow that boosts tissue delivery, while the right shift that unloads oxygen at exercising muscle does not impair loading because the lung still fully saturates the blood.' },
      ],
      common_errors: [
        'Thinking shorter pulmonary transit causes desaturation in healthy lungs',
        'Listing increased hemoglobin affinity rather than a right shift as a delivery strategy',
        'Treating pulmonary uptake and tissue delivery as unrelated during exercise',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Oxygen uptake and delivery',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Oxygen uptake and delivery', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-26',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5t-vq-spectrum', 'atom-p2w5t-five-causes-hypoxemia'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the V/Q spectrum with the five causes of hypoxemia to explain where shunt and V/Q mismatch sit and which extreme does not cause hypoxemia.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The V/Q spectrum runs from zero (shunt, perfused but not ventilated, alveolar gas equal to venous blood) through normal (about 1.0, alveolar O2 100 and CO2 40) to infinity (deadspace, ventilated but not perfused, alveolar gas equal to inspired air). Hypoxemia arises from the low V/Q end, while high V/Q deadspace does not lower arterial oxygen.' },
        { id: 'kp2', weight: 2, description: 'Two of the five causes of hypoxemia map directly onto this spectrum: a right to left shunt is the V/Q of zero extreme, and V/Q mismatch is the spread of low V/Q units and is the single most common cause of hypoxemia. The other three causes are hypoventilation, decreased barometric pressure at altitude, and diffusion limitation.' },
        { id: 'kp3', weight: 1, description: 'The spectrum also explains the bedside distinction: low V/Q units stay ventilated and their hypoxemia corrects with supplemental oxygen, whereas a true shunt (V/Q zero) bypasses ventilation and does not correct, which is why shunt is the only one of the five causes that fails to respond fully to 100 percent oxygen.' },
      ],
      common_errors: [
        'Placing deadspace rather than shunt at the V/Q of zero extreme',
        'Naming shunt instead of V/Q mismatch as the most common cause of hypoxemia',
        'Believing high V/Q deadspace regions cause hypoxemia',
      ],
      minimum_passing_score: 60,
    },
    topic: 'V/Q and hypoxemia',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'V/Q and hypoxemia', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-27',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5t-aa-workup', 'atom-p2w5t-co-affinity-pulseox'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the A-a difference and oxygen challenge workup with carbon monoxide and pulse oximetry to explain two distinct ways that bedside assessment of arterial oxygenation can mislead.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The hypoxemia workup uses the A-a oxygen difference first: a normal difference points to hypoventilation or altitude, an increased difference points to shunt, V/Q mismatch, or diffusion limitation, with the alveolar PO2 found from FIO2 times (PB minus 47) minus PCO2 divided by 0.8. Giving 100 percent oxygen then separates a correcting low V/Q from a non-correcting true shunt.' },
        { id: 'kp2', weight: 2, description: 'Carbon monoxide misleads in a different way: it binds hemoglobin with very high affinity and saturates it at trace partial pressures, slashing oxygen content, yet a standard pulse oximeter cannot tell carboxyhemoglobin from oxyhemoglobin and reports a falsely normal value near 99 percent. The measured saturation reassures while delivery is failing.' },
        { id: 'kp3', weight: 1, description: 'Both pitfalls share a lesson: arterial oxygenation must be judged by more than one number. A shunt is unmasked by the A-a difference and the failure to respond to oxygen, while carbon monoxide poisoning is unmasked by co-oximetry rather than pulse oximetry, because each routine reading can be deceptively normal.' },
      ],
      common_errors: [
        'Assuming a normal pulse oximeter reading rules out carbon monoxide poisoning',
        'Expecting a true shunt to correct fully with 100 percent oxygen',
        'Placing shunt in the normal A-a difference branch of the workup',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pitfalls in oxygenation assessment',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Pitfalls in oxygenation assessment', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk5-28',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5t-co2-dissolved', 'atom-p2w5t-co2-curve-shape'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the dissolved carbon dioxide fraction with the shape of the carbon dioxide dissociation curve to explain why blood carries and unloads large amounts of CO2 across a narrow pressure range.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Because CO2 is about 20 times more soluble than oxygen, a real dissolved pool exists (about 2.7 mL per 100 mL venous and 2.4 mL per 100 mL arterial), accounting for roughly 7 percent of total CO2 transport, with bicarbonate carrying about 70 percent and carbaminohemoglobin about 23 percent. The dissolved fraction sets the PCO2 that drives loading and unloading.' },
        { id: 'kp2', weight: 2, description: 'The CO2 dissociation curve is much more linear than the sigmoid oxygen curve, with a normal operating range of 40 to 45 mm Hg. Over that narrow band the near-straight, steep relationship lets blood take up or release a large quantity of CO2 for only a few mm Hg change in PCO2.' },
        { id: 'kp3', weight: 1, description: 'Together these explain efficient CO2 exchange: the high solubility provides a meaningful dissolved pool and feeds the bicarbonate system, while the linear curve means the small arterial to venous PCO2 difference of about 5 mm Hg moves a large total CO2 load, so CO2 elimination stays tightly coupled to ventilation.' },
      ],
      common_errors: [
        'Treating the dissolved CO2 fraction as negligible the way dissolved oxygen is',
        'Describing the CO2 curve as sigmoid and flat like the oxygen curve',
        'Assuming a large PCO2 change is needed to move significant CO2',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Carbon dioxide transport',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Carbon dioxide transport', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-13',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6r-apneustic', 'atom-p2w6r-vrg'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the roles of the apneustic center and the ventral respiratory group to explain how brainstem regions beyond the dorsal respiratory group and pneumotaxic center shape the pattern and power of breathing, and how each is normally regulated.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The apneustic center in the lower pons would, if unopposed, promote prolonged inspiratory gasps known as apneustic breathing, holding the lungs deeply inflated. It is normally inhibited by the pneumotaxic center in the upper pons, which allows inspiration to terminate at the appropriate time. The apneustic center therefore acts on the timing or pattern of the breath, specifically on the switch from inspiration to expiration.' },
        { id: 'kp2', weight: 2, description: 'The ventral respiratory group in the medulla acts on the power of breathing rather than its basic timing. It is silent during quiet respiration and is recruited during forceful breathing such as exercise, contributing mainly to active expiration but also to inspiration. It does not create the rhythm but receives projections from the dorsal respiratory group, so it functions as an amplifier added on top of the primary rhythm generator.' },
        { id: 'kp3', weight: 1, description: 'Together these regions show a layered design: the dorsal group sets the basic rhythm, the pneumotaxic center limits inspiration and restrains the apneustic center to refine pattern, and the ventral group is called in to add expiratory and inspiratory force when demand is high. Both the apneustic center and the ventral group are dependent on or regulated by other centers rather than acting autonomously.' },
      ],
      common_errors: [
        'Treating the apneustic center and ventral group as the primary rhythm generators rather than modulators or amplifiers',
        'Saying the ventral group is active at rest or that the apneustic center shortens inspiration',
        'Forgetting that the pneumotaxic center inhibits the apneustic center while the dorsal group drives the ventral group',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Brainstem respiratory centers',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Brainstem respiratory centers', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-14',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6r-irritant', 'atom-p2w6r-j-receptors'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Compare the irritant receptors and the J receptors with respect to their locations, the stimuli that activate them, and the reflex responses they produce, and explain how each protects or signals the lung.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Irritant receptors lie at the airway surface in the nasal mucosa and upper airways and possibly the alveoli, positioned to detect inhaled noxious material. When activated by irritants they produce bronchoconstriction to limit penetration and the cough and sneeze reflexes to expel the material. They thus serve as a frontline defense that responds to substances entering the airway lumen.' },
        { id: 'kp2', weight: 2, description: 'J receptors lie deeper, in the capillary wall and interstitium of the alveolar region, positioned to sense the fluid state around the pulmonary capillaries. They are stimulated by lung disease, pulmonary edema, and congestion, and they produce rapid shallow breathing or tachypnea. They therefore signal a problem within the lung tissue and circulation rather than an inhaled irritant in the airway.' },
        { id: 'kp3', weight: 1, description: 'The contrast highlights two different sensory systems of the lung: a luminal irritant detection system in the conducting airways that triggers expulsive and constrictive reflexes, and an interstitial congestion detection system near the capillaries that triggers tachypnea. Both relay through vagal afferents to the respiratory center but report on distinct threats, inhaled irritants versus fluid overload or disease.' },
      ],
      common_errors: [
        'Swapping the locations, putting irritant receptors at the capillary and J receptors in the airway',
        'Assigning cough and bronchoconstriction to J receptors or tachypnea to irritant receptors',
        'Forgetting that J receptors signal edema and congestion while irritant receptors signal inhaled material',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Lung sensory receptors',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Lung sensory receptors', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-15',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6r-baroreflex', 'atom-p2w6r-proprioceptors'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the arterial baroreceptor reflex and the muscle, joint, and tendon proprioceptor reflex to show how nonchemical reflexes adjust breathing, contrasting a reflex that inhibits breathing with one that augments it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Arterial baroreceptors in the carotid sinus and aortic arch sense blood pressure, and when elevated pressure stimulates them the respiratory response is brief apnea together with bronchodilation. This is an inhibitory respiratory reflex driven by a cardiovascular signal, momentarily quieting breathing and widening airways when systemic pressure rises.' },
        { id: 'kp2', weight: 2, description: 'Receptors in the muscles of respiration and in skeletal muscles, joints, and tendons sense movement and mechanical load, and they adjust ventilation to elevated workloads. This is an augmenting reflex that helps drive the rapid rise in ventilation at the onset of exercise, even before blood gases change, matching breathing to physical activity.' },
        { id: 'kp3', weight: 1, description: 'Taken together these illustrate that mechanical and pressure signals, not just chemistry, shape ventilation: a pressure rise sensed by baroreceptors transiently suppresses breathing, while movement sensed by proprioceptors stimulates it. Both feed into the same respiratory center, allowing breathing to respond appropriately to the cardiovascular state and to muscular activity in addition to the chemical drive from carbon dioxide and oxygen.' },
      ],
      common_errors: [
        'Stating that baroreceptor stimulation augments breathing like the chemoreceptors instead of causing brief apnea',
        'Believing proprioceptors set blood pH rather than matching ventilation to workload',
        'Forgetting that baroreceptors also cause bronchodilation while proprioceptors aid the immediate exercise rise',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Nonchemical reflexes',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Nonchemical reflexes', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-16',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6r-glomus', 'atom-p2w6r-interrelated-gases'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the glomus cell transduction mechanism with the interrelated effects of PCO2, PO2, and pH to explain how the body detects low oxygen and how that low oxygen interacts with carbon dioxide to set ventilation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'At the cellular level, a fall in arterial PO2 is detected by carotid body glomus cells, where low oxygen closes potassium channels, depolarizes the cell, opens calcium channels, raises intracellular calcium, and releases ATP and acetylcholine onto the afferent fiber. This converts the chemical signal of hypoxia into nerve impulses that reach the respiratory center through the glossopharyngeal nerve and increase ventilation.' },
        { id: 'kp2', weight: 2, description: 'At the whole body level, the composite curves show that low PO2 does more than add its own drive; it steepens the carbon dioxide response curve, so each given PCO2 produces a larger ventilation when oxygen is low. A lower pH similarly shifts the curves toward greater ventilation. Thus hypoxia both directly excites the peripheral chemoreceptors and potentiates the central response to carbon dioxide.' },
        { id: 'kp3', weight: 1, description: 'Linking the two scales explains integrated control: the glomus cell provides the molecular sensor for oxygen, while the interaction of PO2, PCO2, and pH on the response curves describes how that oxygen signal combines with carbon dioxide and acidosis to determine final ventilation. A patient who is both hypoxic and hypercapnic therefore ventilates more than the carbon dioxide level alone would predict.' },
      ],
      common_errors: [
        'Saying low oxygen opens rather than closes glomus cell potassium channels',
        'Treating the oxygen and carbon dioxide stimuli as independent rather than oxygen potentiating the CO2 response',
        'Forgetting that the glomus cell signal travels by the glossopharyngeal nerve to raise ventilation',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Oxygen sensing and gas interaction',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Oxygen sensing and gas interaction', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-17',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6r-co2-conditions', 'atom-p2w6r-other-factors'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the conditions that shift the carbon dioxide response curve with the other nonchemoreceptor factors influencing respiration to give a unified account of how ventilatory drive is raised or lowered beyond the moment to moment chemoreceptor response.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The carbon dioxide response curve is shifted by the subject state: metabolic acidosis moves it up and to the left so ventilation is greater at any PCO2, whereas sleep, narcotics, and anesthesia move it down and to the right, depressing ventilation, with anesthesia depressing it the most. These shifts show that the same arterial carbon dioxide can produce very different ventilation depending on metabolic and pharmacological context.' },
        { id: 'kp2', weight: 2, description: 'Other nonchemoreceptor factors also modulate breathing: voluntary control lets the cortex override the rhythm briefly, the vasomotor center exerts a cardiovascular influence, and increased body temperature stimulates respiration both by raising carbon dioxide production and by a direct effect on the respiratory center. Irritants stimulate airway reflexes while anesthesia depresses the center, paralleling its effect on the response curve.' },
        { id: 'kp3', weight: 1, description: 'Combined, these show that ventilatory drive is set by far more than the instantaneous chemoreceptor signal. Acid base status, sedative and anesthetic drugs, conscious effort, temperature, and brainstem cardiovascular activity all bias the system. Clinically this means a normal carbon dioxide does not guarantee normal ventilation if the patient is sedated, anesthetized, acidotic, or febrile.' },
      ],
      common_errors: [
        'Thinking only chemoreceptors set ventilatory drive and ignoring drugs, temperature, and conscious control',
        'Forgetting that metabolic acidosis raises the curve while anesthesia depresses it most',
        'Listing one temperature mechanism instead of both increased CO2 production and a direct central effect',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Modulators of ventilatory drive',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Modulators of ventilatory drive', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-18',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6r-exercise-curve', 'atom-p2w6r-ramp-slope'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the upward reset of the carbon dioxide response curve during exercise with the control of the inspiratory ramp slope to explain, at both the whole body and the single breath level, how the respiratory center delivers a large increase in ventilation during exercise.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'At the whole body level, exercise resets the relationship between ventilation and PCO2 far upward, so that at a normal arterial PCO2 of about 40 mmHg ventilation is roughly 120 liters per minute compared with only a few liters at rest. Because PCO2 stays near normal or falls slightly, this large rise reflects an upward shift of the entire response, not an increase in arterial carbon dioxide, and is driven by neurogenic and feedforward factors such as cortical overflow and signals from moving muscles.' },
        { id: 'kp2', weight: 2, description: 'At the single breath level, that higher ventilation is produced in part by steepening the inspiratory ramp from the dorsal respiratory group. When more rapid lung filling is needed, the ramp rises more steeply, so the inspiratory muscles are recruited faster and each breath fills the lungs more quickly and deeply, raising tidal volume. Controlling ramp slope thus translates the elevated central drive into faster, deeper inspirations.' },
        { id: 'kp3', weight: 1, description: 'Linking the two levels shows how exercise hyperpnea is implemented: feedforward drivers shift the whole ventilation to PCO2 curve upward while arterial gases stay nearly constant, and the steepened ramp plus an increased rate carry out that elevated demand breath by breath. The chemoreceptors then fine tune the result rather than initiate the large rise.' },
      ],
      common_errors: [
        'Attributing the exercise rise in ventilation to a rise in PCO2 when PCO2 stays near normal',
        'Thinking the ramp has a fixed slope so the center cannot speed up inspiration during exercise',
        'Believing the chemoreceptors initiate exercise hyperpnea rather than fine tuning an upward shifted curve',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Exercise hyperpnea mechanics',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Exercise hyperpnea mechanics', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-19',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6r-cn-afferents', 'atom-p2w6r-neural-integration'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the cranial nerve afferent and motor wiring of the medullary respiratory center with the overall scheme of input integration to describe how signals enter, are combined, and leave the respiratory control system.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Sensory information enters the dorsal respiratory group chiefly through the vagus and glossopharyngeal nerves, which carry signals from lung stretch, irritant, and J receptors and from the peripheral chemoreceptors. Motor commands leave the medullary center along respiratory motor pathways that ultimately drive the phrenic and intercostal nerves. The medulla thus serves as both the receiving station for reflex afferents and the source of the motor output.' },
        { id: 'kp2', weight: 2, description: 'The overview scheme adds that these cranial nerve afferents are only one of three input streams converging on the central cycle of inspiration and expiration. The others are influences from higher centers and input from the central chemoreceptors. Reflex input itself spans the lungs, airways, cardiovascular system, muscles, joints, and skin, all of which must be blended each breath.' },
        { id: 'kp3', weight: 1, description: 'Putting the wiring and the scheme together gives a complete loop: diverse sensors report through specific afferent nerves, mainly the vagus and glossopharyngeal, into the dorsal respiratory group; the center integrates these with descending and chemical drive; and the integrated command is sent out through the respiratory motor pathways to the muscles of breathing. This closed loop lets ventilation respond to mechanical, chemical, and voluntary demands at once.' },
      ],
      common_errors: [
        'Confusing the afferent vagus and glossopharyngeal nerves with the motor phrenic and intercostal pathways',
        'Reducing the inputs to chemoreceptors only and omitting higher centers and the broad reflex stream',
        'Failing to describe a complete loop from sensors through integration to the muscles of breathing',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Respiratory control wiring',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Respiratory control wiring', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-20',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6i-mefr-pefr', 'atom-p2w6i-fvc-fev1-values'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the four core spirometry measurements: explain how MEFR and PEFR from the flow curve relate to FVC and FEV1 And how each characterizes expiratory airflow and obstruction.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'MEFR is the greatest flow at a given lung volume and PEFR is the single highest flow in the first 100 to 120 milliseconds from full lungs; both come from the maximum expiratory flow curve , which runs from total lung capacity to residual volume. They describe instantaneous flow rates along the exhalation.' },
        { id: 'kp2', weight: 2, description: 'FVC is the total volume forced out after a maximal inhalation and FEV1 is the volume forced out in the first second; these are volumes accumulated over time. Their ratio is 80% normally and 47% in obstruction, because obstruction prolongs the time to empty the lungs so less of the FVC escapes in the first second.' },
        { id: 'kp3', weight: 1, description: 'Together flow measures and volume measures both fall in obstruction; peak and maximum flows drop as the airways narrow, and the FEV1/FVC ratio drops as exhalation slows, so the flow curve and the timed spirogram tell a consistent story about resistance to airflow.' },
      ],
      common_errors: [
        'Confusing instantaneous flow measures, MEFR and PEFR, with the timed volume measures FVC and FEV1.',
        'Misstating PEFR timing as one second instead of 100 to 120 milliseconds.',
        'Reporting the obstructed FEV1/FVC as anything other than 47% against a normal 80%.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Spirometry flow and volume measures',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Spirometry flow and volume measures', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-21',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6i-coexist-categories', 'atom-p2w6i-flow-loop-directions'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the definitions of obstructive and restrictive disease with their flow volume loop signatures, explaining how loop direction, volumes, and FEV1/FVC distinguish the two and why a patient may show a mixed pattern.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Obstructive disease is increased airway resistance centered on the bronchioles; on the loop it shifts left toward higher volumes, volumes are greater than normal from air trapping, FEV1 falls more than FVC, and the FEV1/FVC ratio is lowered. The defining problem is getting air out through narrowed airways.' },
        { id: 'kp2', weight: 2, description: 'Restrictive disease is decreased lung expansion from stiff lung or chest tissue; on the loop it shifts right toward lower volumes, volumes are smaller than normal, FEV1 and FVC fall in proportion, and the FEV1/FVC ratio is normal or elevated. The defining problem is a smaller container that cannot fully expand.' },
        { id: 'kp3', weight: 1, description: 'Because a patient can have both at once, a mixed loop is possible, combining reduced volumes with a reduced ratio; the loop direction and the FEV1/FVC ratio are the two discriminators that let you separate or recognize the overlap of the two categories.' },
      ],
      common_errors: [
        'Reversing loop directions, since obstruction shifts left and restriction shifts right.',
        'Assigning a low FEV1/FVC ratio to restriction when it is preserved or elevated.',
        'Treating the two categories as mutually exclusive since they can coexist.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Obstructive versus restrictive loops',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Obstructive versus restrictive loops', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-22',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6i-resistance-factors', 'atom-p2w6i-fig432-shifts'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the factors that raise airway resistance with the flow volume diagram, explaining how the obstructive mechanism produces the leftward shifted low peak curve and how restriction differs.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Resistance rises from a blocked lumen, a narrowed lumen, or loss of outward parenchymal traction on the airways. These mechanisms slow expiratory airflow, which produces the airway obstruction curve, shifted left to higher trapped volumes with a markedly reduced peak flow because air cannot leave quickly.' },
        { id: 'kp2', weight: 2, description: 'The restrictive curve on the same diagram is shifted right to smaller volumes because the stiff lung cannot expand to a normal total lung capacity. Its problem is expansion, not resistance, so it is a miniaturized but otherwise normal shaped curve rather than the slow scooped curve of obstruction.' },
        { id: 'kp3', weight: 1, description: 'A left shift with low peak flow signals high resistance obstruction, while a right shift with preserved shape signals reduced volume restriction; the resistance factors explain why the obstructive curve looks the way it does and why the two curves sit on opposite sides of normal.' },
      ],
      common_errors: [
        'Reversing the curve positions, placing obstruction on the right or restriction on the left.',
        'Forgetting that the obstruction curve has a reduced peak flow, not just a shift.',
        'Attributing the restrictive curve to high resistance rather than reduced expansion.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Resistance factors and Figure 43-2',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Resistance factors and Figure 43-2', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-23',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6i-copd-definition', 'atom-p2w6i-emphysema-confluent'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the definition of COPD with the alveolar changes of emphysema, explaining how emphysema fits the COPD definition of permanent damage that traps air on exhalation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'COPD is defined as progressive, longterm, permanent damage to lung tissue that traps air during exhalation, with two coexisting types, chronic bronchitis and emphysema. The permanence of the damage is the defining feature separating COPD from reversible asthma.' },
        { id: 'kp2', weight: 2, description: 'Emphysema is the type in which alveoli merge into fewer large pockets as elastic connective tissue is destroyed, reducing elasticity and surface area. The lost elastic recoil and lost parenchymal traction cause airways to collapse on exhalation, producing exactly the air trapping the COPD definition describes.' },
        { id: 'kp3', weight: 1, description: 'So emphysema is a structural embodiment of the COPD definition: permanent destruction yielding obstruction and trapped air, with the added consequences of decreased diffusing capacity from lost surface area and pulmonary hypertension from lost capillaries.' },
      ],
      common_errors: [
        'Calling emphysema reversible, contradicting the permanent COPD definition.',
        'Describing the alveolar change as fluid filling rather than confluence of air spaces.',
        'Forgetting that lost elastic recoil and traction are why air is trapped on exhalation.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'COPD definition and emphysema',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'COPD definition and emphysema', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-24',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6i-asthma-features-symptoms', 'atom-p2w6i-asthma-reversibility'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the physiological features and symptoms of asthma with its reversibility, explaining how the three features produce the symptoms and how reversibility distinguishes asthma from COPD while allowing chronic exceptions.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The three features, bronchial smooth muscle contraction, soft tissue swelling, and mucus plugging, narrow the airways from three directions during an attack triggered by allergens or irritants. This narrowing produces the listed symptoms of shortness of breath, wheeze, cough, and chest tightness.' },
        { id: 'kp2', weight: 2, description: 'Asthma is labeled reversible airway obstruction, and acute exacerbations are typically fully reversible, so the narrowing and symptoms resolve when the trigger clears or a bronchodilator is given. This reversibility is the key contrast with the permanent damage of COPD.' },
        { id: 'kp3', weight: 1, description: 'Long-term severe asthma may cause technically irreversible chronic changes from sustained inflammation, so the usual reversible episodes can, over years, give way to some fixed remodeling, narrowing the gap between severe asthma and COPD.' },
      ],
      common_errors: [
        'Omitting one of the three features or attributing emphysema findings to asthma.',
        'Saying asthma is fully and permanently reversible, ignoring the chronic remodeling caveat.',
        'Confusing the reversible acute attack with the fixed changes of severe chronic asthma.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Asthma features and reversibility',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Asthma features and reversibility', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-25',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6i-restrictive-volumes', 'atom-p2w6i-restrictive-intrinsic'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the spirometric profile of restrictive disease with its intrinsic causes, explaining how diseases that stiffen the lung tissue produce reduced volumes with a preserved FEV1/FVC ratio.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Restrictive disease reduces total lung capacity and vital capacity because lung expansion is decreased, yet airway resistance stays normal and the FEV1/FVC ratio remains normal or elevated since FEV1 and FVC fall together. The signature is small volumes with a preserved ratio.' },
        { id: 'kp2', weight: 2, description: 'Intrinsic causes stiffen the lung tissue itself: diffuse interstitial pulmonary fibrosis through thick collagen deposits, sarcoidosis through inflammatory granulomas, and asbestosis or silicosis through scarring from chronic irritant exposure. Each replaces compliant lung with stiff tissue, directly limiting expansion.' },
        { id: 'kp3', weight: 1, description: 'Because the stiffening is in the parenchyma and not the airways, these intrinsic diseases produce the classic restrictive spirometry, reduced total lung capacity and vital capacity with a normal or high FEV1/FVC ratio, so a preserved ratio with low volumes should prompt a search for an intrinsic restrictive cause.' },
      ],
      common_errors: [
        'Reporting a low FEV1/FVC ratio for intrinsic restriction; the ratio is preserved.',
        'Mismatching an intrinsic disease with its feature, such as sarcoidosis with collagen rather than granulomas.',
        'Classifying kyphosis or obesity as intrinsic when they are extrinsic causes.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Restrictive profile and intrinsic causes',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Restrictive profile and intrinsic causes', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-26',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6i-restrictive-extrinsic', 'atom-p2w6i-pneumothorax-symptoms'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the extrinsic restrictive causes with pneumothorax as a specific example, explaining how each restricts ventilation from outside the lung tissue and why pneumothorax fits this group.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Extrinsic restrictive causes act outside the lung parenchyma: kyphosis and scoliosis alter chest wall posture and expansion, obesity hypoventilation adds external load, and neuromuscular diseases listed as ALS, muscular dystrophy, and myasthenia gravis weaken the respiratory muscles so the bellows cannot expand the lung.' },
        { id: 'kp2', weight: 2, description: 'Pneumothorax is the extrinsic cause where air leaks into the pleural cavity and collapses part of the lung through pressure changes, usually from penetrating trauma but also spontaneously, with a studied vaping association. It restricts by abolishing the negative pleural pressure that normally holds the lung expanded.' },
        { id: 'kp3', weight: 1, description: 'All these extrinsic causes share that the lung tissue may be intrinsically normal yet cannot expand because the chest wall, muscles, or pleural space fail; pneumothorax illustrates this because the separate pleural sides mean only the affected lung collapses while the other keeps ventilating.' },
      ],
      common_errors: [
        'Classifying pneumothorax or obesity as intrinsic lung disease rather than extrinsic.',
        'Listing the wrong neuromuscular diseases instead of ALS, muscular dystrophy, and myasthenia gravis.',
        'Saying a pneumothorax collapses both lungs, ignoring the separate pleural sides.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Extrinsic restriction and pneumothorax',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Extrinsic restriction and pneumothorax', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-27',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6i-atelectasis-causes', 'atom-p2w6i-pneumonia-vs-atelectasis-sat'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the causes of atelectasis with the contrasting saturation effects of atelectasis and pneumonia, explaining why collapse and consolidation affect arterial saturation so differently.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Atelectasis is collapse of a lung portion with absent gas exchange, caused by hypoventilation, external compression, airway obstruction, or adhesions and lack of surfactant. Because the region is collapsed, blood flow to it falls to about one fifth of normal as blood is diverted away.' },
        { id: 'kp2', weight: 2, description: 'That diversion limits desaturation: Only one sixth of aortic blood is the 60% saturated stream and five sixths is 97%, giving a mean of 91%, a minimal drop. The collapse protects saturation by reducing perfusion of the non exchanging region.' },
        { id: 'kp3', weight: 1, description: 'Pneumonia is the opposite case: blood keeps flowing at full rate past fluid filled alveoli, so half the aortic blood is only 60% saturated and the mean falls sharply to 78%. The difference is perfusion, atelectasis diverts blood away while pneumonia perfuses unventilated alveoli, producing a much larger shunt effect.' },
      ],
      common_errors: [
        'Listing only two atelectasis causes and omitting hypoventilation or compression.',
        'Reversing the means; atelectasis is 91% and pneumonia is 78%.',
        'Saying atelectasis perfuses the collapsed lung normally, which would predict a large drop it does not cause.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Atelectasis causes and saturation contrast',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Atelectasis causes and saturation contrast', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-28',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6i-barrel-chest', 'atom-p2w6i-pneumonia-definition-symptoms'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the barrel chest sign of chronic obstruction with the definition and symptoms of pneumonia, contrasting a chronic structural sign of trapped air against an acute alveolar filling infection.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Barrel chest is a chronic sign of obstructive disease such as emphysema, an increased anteroposterior chest diameter from years of trapped air and hyperinflation holding the rib cage in an expanded position. It reflects a long standing structural change in the chest wall, not an acute event.' },
        { id: 'kp2', weight: 2, description: 'Pneumonia is an acute infection filling the alveoli with fluid or pus, most often from Streptococcus pneumoniae, producing a productive cough with phlegm, fever, chills, chest pain, and shortness of breath. It is an acute alveolar filling process rather than a chronic air trapping one.' },
        { id: 'kp3', weight: 1, description: 'The contrast is instructive: barrel chest comes from chronic obstruction with too much trapped air enlarging the thorax, while pneumonia comes from acute filling of the air sacs with fluid; one is a slow structural deformity and the other an acute infectious consolidation, and their symptoms and time courses differ accordingly.' },
      ],
      common_errors: [
        'Calling barrel chest an acute finding or a sign of pneumonia rather than chronic obstruction.',
        'Naming a virus as the most common cause of pneumonia instead of Streptococcus pneumoniae.',
        'Saying pneumonia fluid is outside the alveoli rather than within them.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Barrel chest versus pneumonia',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Barrel chest versus pneumonia', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-p2-wk6-29',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w6i-constricted-terminology', 'atom-p2w6i-histology-contrast'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Integrate the Guyton constricted lungs terminology with the histology, distinguishing a naming convention for restrictive disease from the microscopic appearances of pneumonia and emphysema, so the right vocabulary is matched to the right tissue change.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Guyton labels the right side  constricted lungs, which is legacy wording for a restrictive lung profile, a lung bound up by fibrosis, silicosis, scoliosis, or kyphosis. It is a naming convention about reduced expansion and shifted volumes, not a statement about microscopic tissue, and modern readers should translate constricted to restrictive.' },
        { id: 'kp2', weight: 2, description: 'histology instead shows microscopic tissue: pneumonia as inflammation with alveoli filled by fluid, and emphysema as confluent alveoli from loss of alveolar walls. These are opposite microscopic processes, additive filling versus subtractive destruction, summarized as fluid in the lungs versus loss of alveoli.' },
        { id: 'kp3', weight: 1, description: 'The integration is to keep two different axes straight: the constricted versus normal versus obstructed naming describes the spirometric flow volume curves and their volumes, while the panels describe what the tissue actually looks like; matching each piece of vocabulary to the correct level prevents conflating a restrictive curve label with an emphysematous or pneumonic tissue change.' },
      ],
      common_errors: [
        'Equating Guyton constricted lungs with airway constriction or with an emphysematous tissue change.',
        'Swapping the panels, calling pneumonia loss of alveoli or emphysema fluid filling.',
        'Mixing the spirometric curve labels with the histology panels as if they described the same thing.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Constricted terminology and histology',
    chapter: 'pp2-wk-6',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Constricted terminology and histology', ladder_tier_appropriate: 'pre-induction' },
  },

  /* audit gap-fill round 2 synthesis */

  {
    id: 'r-p2-wk5-29',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-p2w5t-o2-quantities', 'atom-p2w5t-dissociation-landmarks'],
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Integrate the quantitative basis of oxygen transport with the landmarks of the oxygen hemoglobin dissociation curve. Explain how much oxygen the body consumes, why hemoglobin is needed, and the oxygen carrying capacity and content of normal and anemic blood; then connect these to the saturation and content values at the key partial pressures of the dissociation curve and the memory rule for them. Explain why a person can have a normal saturation yet a low oxygen content.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The resting body consumes about 250 mL of oxygen per minute, far more than the roughly 0.003 mL per 100 mL per mm Hg of physically dissolved oxygen could supply, so about 97 percent of transported oxygen is carried bound to hemoglobin. Each gram of hemoglobin binds about 1.34 mL of oxygen, so a normal 15 g per dL gives about 20 mL of oxygen per 100 mL of fully saturated blood, while an anemic 10 g per dL gives only about 13 mL per 100 mL.' },
        { id: 'kp2', weight: 2, description: 'The dissociation curve relates PO2 to saturation and content. The values to remember for normal hemoglobin are PO2 0, 20, 40, and 100 mm Hg giving saturations of about 0, 25, 75, and 100 percent and contents of about 0, 5, 15, and 20 mL per dL. The 4,5,6 to 7,8,9 rule captures the steep middle: PO2 40, 50, 60 give saturations of about 70, 80, 90 percent. The curve is flat at high PO2, keeping arterial blood nearly fully saturated, and steep in the middle, where it unloads oxygen to the tissues.' },
        { id: 'kp3', weight: 1, description: 'Putting these together explains why saturation and content are not the same thing: saturation is the percent of available hemoglobin binding sites that are filled, while content is the absolute amount of oxygen per volume of blood, which also depends on how much hemoglobin is present. In anemia the saturation can read a normal 97 to 100 percent yet the content is low because there is less hemoglobin, so a pulse oximeter reading can look reassuring while oxygen delivery is actually reduced.' },
      ],
      common_errors: [
        'Equating a normal saturation with a normal oxygen content; content also depends on the hemoglobin concentration',
        'Forgetting that dissolved oxygen alone cannot meet the resting demand of about 250 mL per minute',
        'Reversing the 4,5,6 to 7,8,9 rule or placing the venous point at full saturation rather than about 75 percent',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Quantitative oxygen transport',
    chapter: 'pp2-wk-5',
    difficulty: 3,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Quantitative oxygen transport', ladder_tier_appropriate: 'pre-induction' },
  },

];
