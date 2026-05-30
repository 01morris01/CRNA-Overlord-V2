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

];
