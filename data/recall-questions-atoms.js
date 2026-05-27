// Atom-tier recall questions — ap1-wk-1 + ap1-wk-2
// Sprint B: 6 engine-proof atoms + 21 wk-1 content atoms + 14 wk-2 content atoms (41 total)

export const RECALL_QUESTIONS_ATOMS = [

  // ── Atoms feeding r-ap1-w1-1b (Antagonist Types) ──────────────────────

  {
    id: 'atom-competitive-antag-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Define competitive antagonism. Explain how increasing agonist concentration overcomes it and give one clinical example.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Competitive antagonists bind reversibly to the same (orthosteric) site as the agonist; they can be overcome (surmounted) by increasing agonist concentration' },
        { id: 'kp2', weight: 1, description: 'The dose-response curve shifts rightward (higher agonist dose needed) but Emax is preserved' },
        { id: 'kp3', weight: 1, description: 'Clinical example: naloxone competitively antagonizes opioids at mu receptors; high-dose fentanyl can partially overcome low-dose naloxone' },
      ],
      common_errors: [
        'Stating competitive antagonism is insurmountable (it is surmountable by definition)',
        'Confusing a rightward shift (competitive) with a downward shift of Emax (noncompetitive)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'receptor-theory',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'medium', source: 'Stoelting Ch 2', topic: 'receptor-theory' },
  },

  {
    id: 'atom-noncompetitive-antag-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Define noncompetitive antagonism. Explain why increasing the agonist dose cannot restore the full response and name the classic preoperative example.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Noncompetitive antagonists bind irreversibly or at an allosteric site, reducing the maximum achievable response (Emax) regardless of agonist dose' },
        { id: 'kp2', weight: 1, description: 'The dose-response curve shows a depressed maximum (downward shift of Emax), not just a rightward shift' },
        { id: 'kp3', weight: 1, description: 'Clinical example: phenoxybenzamine irreversibly blocks alpha receptors before pheochromocytoma resection, providing sustained alpha blockade that cannot be overcome by catecholamine surges during tumor manipulation' },
      ],
      common_errors: [
        'Confusing noncompetitive with competitive — the key distinction is whether increasing agonist dose can restore full response',
        'Stating that all noncompetitive antagonists are allosteric (some are irreversible orthosteric binders)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'receptor-theory',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'medium', source: 'Stoelting Ch 2', topic: 'receptor-theory' },
  },

  {
    id: 'atom-inverse-agonism-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Define inverse agonism. Explain how it differs from simple antagonism at a constitutively active receptor and give one example.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Inverse agonists stabilize the inactive receptor conformation (R), reducing constitutive (baseline) receptor activity below the resting level — this is a negative efficacy, not zero efficacy' },
        { id: 'kp2', weight: 1, description: 'A neutral antagonist blocks agonist access but does not alter constitutive activity; an inverse agonist actively suppresses it' },
        { id: 'kp3', weight: 1, description: 'Example: some beta-blockers (e.g., carvedilol) and certain benzodiazepine-site ligands act as inverse agonists at constitutively active receptors' },
      ],
      common_errors: [
        'Equating inverse agonism with competitive antagonism — inverse agonists reduce baseline activity, antagonists merely block agonist binding',
        'Stating inverse agonists have no clinical relevance (the distinction matters for constitutively active receptor systems)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'receptor-theory',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'medium', source: 'Stoelting Ch 2', topic: 'receptor-theory' },
  },

  // ── Atoms feeding r-ap1-w1-3a (Compartment Model — Bolus) ────────────

  {
    id: 'atom-central-compartment-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Define the central compartment in pharmacokinetic modeling. Identify which organ group it represents and explain why it receives drug first after an IV bolus.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The central compartment represents blood and the vessel-rich group (brain, heart, kidneys, liver) — organs receiving approximately 75% of cardiac output despite comprising only about 10% of body mass' },
        { id: 'kp2', weight: 1, description: 'After IV bolus, high blood flow delivers drug to the central compartment within one circulation time (arm-brain ~30-45 seconds for most IV anesthetics), producing rapid onset of effect' },
        { id: 'kp3', weight: 1, description: 'The volume of the central compartment (Vc) determines initial peak plasma concentration: a smaller Vc produces higher peak concentration from the same dose' },
      ],
      common_errors: [
        'Confusing the central compartment with the total volume of distribution (Vd)',
        'Stating muscle and fat are part of the central compartment (they are peripheral compartments)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'pk-compartment-model',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'medium', source: 'Stoelting Ch 2', topic: 'pk-compartment-model' },
  },

  {
    id: 'atom-redistribution-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Explain why a patient wakes up within minutes after a single IV bolus of propofol despite the drug not being significantly metabolized in that time. Name the mechanism and describe where the drug goes.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Redistribution: drug moves down the concentration gradient from the highly perfused brain to less-perfused tissues (muscle first, then fat), causing brain concentration to fall below the threshold for unconsciousness' },
        { id: 'kp2', weight: 1, description: 'Redistribution, not metabolism, is the primary mechanism of single-bolus recovery for lipophilic IV anesthetics — hepatic clearance is too slow to account for rapid awakening' },
        { id: 'kp3', weight: 1, description: 'Muscle receives drug next after the VRG due to moderate blood flow; fat equilibrates slowest despite high lipid solubility because of low blood flow' },
      ],
      common_errors: [
        'Attributing rapid awakening to hepatic metabolism rather than redistribution',
        'Stating that fat is the primary redistribution sink (muscle equilibrates before fat due to higher blood flow)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'pk-compartment-model',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'medium', source: 'Stoelting Ch 2', topic: 'pk-compartment-model' },
  },

  {
    id: 'atom-csht-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Define context-sensitive half-time. Explain what the "context" refers to and why CSHT is more clinically useful than elimination half-life for predicting recovery after an infusion.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Context-sensitive half-time (CSHT) is the time for plasma concentration to fall by 50% after stopping an infusion of a given duration — the "context" is the infusion duration' },
        { id: 'kp2', weight: 1, description: 'Elimination half-life only reflects terminal-phase kinetics and can be misleading; CSHT incorporates the complex interplay of redistribution and metabolism that changes with infusion length' },
        { id: 'kp3', weight: 1, description: 'Clinically, CSHT predicts recovery time: remifentanil has a flat CSHT (~3-5 min) regardless of infusion duration, while fentanyl CSHT rises steeply with longer infusions' },
      ],
      common_errors: [
        'Confusing CSHT with elimination half-life — they measure different things',
        'Stating that "context" refers to clinical context rather than infusion duration',
      ],
      minimum_passing_score: 60,
    },
    topic: 'pk-compartment-model',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'medium', source: 'Stoelting Ch 2', topic: 'pk-compartment-model' },
  },

  // ── Atoms feeding r-ap1-w1-1a (Agonist Spectrum / Buprenorphine) ──────

  {
    id: 'atom-partial-agonist-ceiling-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Explain why a partial agonist cannot produce the same maximal response as a full agonist, even when it occupies 100% of available receptors. Identify the property that distinguishes partial from full agonist activation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Partial agonists have lower intrinsic efficacy — they produce submaximal receptor activation even at 100% occupancy because they cannot fully stabilize the active (R*) receptor conformation' },
        { id: 'kp2', weight: 1, description: 'Intrinsic efficacy is independent of affinity — a partial agonist can have higher affinity than a full agonist yet still produce a lower ceiling effect; affinity describes binding strength, efficacy describes activation capacity' },
      ],
      common_errors: [
        'Confusing affinity with efficacy — stating that partial agonists must have lower affinity (affinity is independent of intrinsic activity)',
        'Stating that increasing the dose of a partial agonist can eventually reach full agonist Emax (the ceiling cannot be overcome by increasing dose)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'receptor-theory',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'receptor-theory' },
  },

  {
    id: 'atom-partial-agonist-competition-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'A receptor population is fully occupied by a full agonist producing maximal response. A partial agonist with equal affinity is now introduced. Explain what happens to the net maximal response and why.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The partial agonist competes for receptors and displaces some full agonist molecules; because it activates receptors submaximally, the net response is reduced — the partial agonist acts as a functional antagonist in the presence of a full agonist' },
        { id: 'kp2', weight: 1, description: 'Clinical example: buprenorphine (partial mu agonist) displaces morphine/fentanyl from mu receptors, reducing analgesia and potentially precipitating withdrawal in opioid-dependent patients' },
      ],
      common_errors: [
        'Stating that adding any agonist always increases the response (a partial agonist REDUCES the response when a full agonist is present)',
        'Confusing the partial agonist competitive displacement with noncompetitive antagonism (it is competitive at the same orthosteric site)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'receptor-theory',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'receptor-theory' },
  },

  // ── Atoms feeding r-ap1-w1-2 (Receptor Regulation) ───────────────────

  {
    id: 'atom-bidirectional-regulation-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Explain the bidirectional nature of receptor regulation: what happens to receptor number and sensitivity during chronic agonist stimulation, and what happens during chronic antagonist exposure or denervation? Identify the cellular mechanisms (phosphorylation, internalization, altered gene transcription) that drive each direction.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Chronic agonist stimulation causes receptor downregulation and desensitization through receptor phosphorylation, internalization (endocytosis), and decreased receptor gene transcription — the cell reduces responsiveness to protect against overstimulation' },
        { id: 'kp2', weight: 1, description: 'Chronic antagonist exposure or denervation causes receptor upregulation — increased receptor density and sensitivity due to removal of tonic stimulation, making the tissue hypersensitive to agonists when reintroduced' },
        { id: 'kp3', weight: 1, description: 'These are opposite directions of the same adaptive mechanism: the cell adjusts receptor number toward a homeostatic set point based on the level of stimulation it receives' },
      ],
      common_errors: [
        'Stating chronic agonist exposure causes upregulation (it causes downregulation; upregulation occurs with chronic blockade or denervation)',
        'Confusing receptor regulation with changes in drug metabolism (regulation is a pharmacodynamic receptor-level phenomenon, not pharmacokinetic)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'receptor-regulation',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'receptor-regulation' },
  },

  {
    id: 'atom-extrajunctional-achr-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'After denervation injury (e.g. spinal cord transection), describe the specific change in nicotinic acetylcholine receptor distribution across the muscle membrane. Explain why this change makes the muscle response to depolarizing agents qualitatively different from normal.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Denervation triggers proliferation of fetal-type (extrajunctional) nicotinic AChRs across the entire muscle membrane surface, not just the neuromuscular junction — these receptors have longer open times and lower conductance than adult junctional receptors' },
        { id: 'kp2', weight: 1, description: 'When succinylcholine depolarizes this massively expanded receptor population simultaneously, exaggerated potassium efflux from the entire muscle surface can produce fatal hyperkalemia (plasma K+ may rise >6 mEq/L)' },
        { id: 'kp3', weight: 1, description: 'The risk window begins approximately 48 hours after denervation injury and persists for 6 months or longer; succinylcholine is contraindicated during this period' },
      ],
      common_errors: [
        'Attributing succinylcholine hyperkalemia to rhabdomyolysis rather than extrajunctional receptor proliferation',
        'Stating the hyperkalemia risk begins immediately after spinal cord injury (receptor proliferation requires ~48 hours to develop)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'receptor-regulation',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'receptor-regulation' },
  },

  // ── Atoms feeding r-ap1-w1-3b (Compartment Model — Prolonged Infusion) ─

  {
    id: 'atom-peripheral-saturation-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'During a prolonged IV infusion, peripheral tissue compartments (muscle, fat) progressively accumulate drug. Explain how this accumulation changes the recovery mechanism compared to a single bolus, and why emergence time increases with infusion duration.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'During prolonged infusion, drug continuously enters peripheral compartments (muscle, then fat), progressively saturating them and eliminating the concentration gradient that normally drives redistribution away from the brain' },
        { id: 'kp2', weight: 1, description: 'Once peripheral compartments are saturated, recovery can no longer rely on redistribution — the brain concentration must fall via slower hepatic metabolism, explaining why emergence takes longer after prolonged infusion' },
        { id: 'kp3', weight: 1, description: 'This is why context-sensitive half-time (CSHT) increases with infusion duration for most drugs — the longer the infusion, the more saturated the redistribution sinks become, and the more recovery depends on metabolism' },
      ],
      common_errors: [
        'Stating that all IV drugs accumulate equally with prolonged infusion (remifentanil has a flat CSHT of ~3-5 min regardless of duration because organ-independent ester hydrolysis outpaces redistribution effects)',
        'Confusing peripheral compartment saturation with hepatic enzyme saturation (the issue is loss of redistribution gradient, not metabolic pathway saturation)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'pk-compartment-model',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'pk-compartment-model' },
  },

  {
    id: 'atom-pulmonary-uptake-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Explain first-pass pulmonary uptake of lipophilic drugs. Describe how the lungs act as a temporary drug reservoir, what fraction of a fentanyl bolus is sequestered on first pass, and why this matters for peak arterial concentration.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The lungs serve as a large first-pass reservoir for lipophilic drugs — fentanyl undergoes approximately 65-75% first-pass pulmonary uptake, temporarily sequestering the drug in pulmonary tissue before gradual release into the systemic arterial circulation' },
        { id: 'kp2', weight: 1, description: 'This pulmonary buffering attenuates the initial peak arterial concentration delivered to the brain and heart, protecting against acute concentration spikes after rapid IV injection of lipophilic drugs' },
      ],
      common_errors: [
        'Stating that pulmonary uptake is a form of drug metabolism (it is temporary sequestration/storage, not biotransformation — the drug is released unchanged)',
        'Claiming that first-pass pulmonary uptake is negligible for all drugs (it is significant specifically for lipophilic, basic drugs like fentanyl, lidocaine, and propranolol)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'pk-compartment-model',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'pk-compartment-model' },
  },

  // ── Atoms feeding r-ap1-w1-4 (Protein Binding) ───────────────────────

  {
    id: 'atom-aag-acute-phase-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Alpha-1 acid glycoprotein (AAG) is the primary binding protein for basic drugs. Explain what happens to AAG levels during surgery, sepsis, or trauma, and describe how this change alters the pharmacologic effect of a basic drug like lidocaine at the same total dose.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'AAG is an acute-phase reactant that rises 2-5 fold during surgery, sepsis, trauma, myocardial infarction, and cancer — this increased AAG raises binding capacity for basic drugs, reducing the free (active) fraction and diminishing pharmacologic effect despite the same total dose' },
        { id: 'kp2', weight: 1, description: 'AAG preferentially binds basic drugs (lidocaine, propranolol, bupivacaine) while albumin preferentially binds acidic drugs (warfarin, phenytoin, NSAIDs) — knowing which protein binds which drug class predicts the direction of binding changes in disease states' },
        { id: 'kp3', weight: 1, description: 'Clinical consequence: a septic patient on a lidocaine infusion may lose analgesic effect as AAG rises; the total drug level appears adequate, but the free active fraction is reduced' },
      ],
      common_errors: [
        'Confusing the direction of AAG change — stating AAG falls in inflammation (it rises; albumin is the protein that falls in critical illness)',
        'Assuming protein binding changes affect all drugs equally (only drugs with high baseline binding to the specific protein are significantly affected)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'protein-binding',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'protein-binding' },
  },

  {
    id: 'atom-displacement-criteria-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Drug displacement from protein binding sites is often discussed but rarely clinically significant. State the three criteria that must ALL be present for displacement to produce a meaningful change in drug effect, and explain why each criterion matters.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Drug displacement is clinically significant only when THREE criteria ALL coincide: (1) >90% protein bound (so a small absolute change in binding produces a proportionally large increase in free fraction), (2) narrow therapeutic index (so the increased free drug can produce toxicity), and (3) small volume of distribution (so the displaced drug remains in the plasma rather than distributing into tissues)' },
        { id: 'kp2', weight: 1, description: 'Warfarin is the classic example meeting all three criteria (99% bound, narrow TI, Vd ~8L); sulfonamide displacement of warfarin can cause hemorrhage — most displacement scenarios do NOT meet all three criteria and are clinically insignificant' },
      ],
      common_errors: [
        'Assuming all drug displacement is clinically dangerous (the vast majority is not — only the triple criterion makes it significant)',
        'Forgetting the volume of distribution criterion (even with high binding and narrow TI, a large Vd dilutes the displaced drug into tissues, blunting the plasma concentration rise)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'protein-binding',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'protein-binding' },
  },

  // ── Atoms feeding r-ap1-w1-5 (Absorption & Bioavailability) ──────────

  {
    id: 'atom-ionization-membrane-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Only one ionic form of a drug can passively cross lipid cell membranes. Identify which form crosses and explain, using Henderson-Hasselbalch reasoning, what happens to a weak base drug when the local tissue pH drops significantly below its pKa.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Only the nonionized (uncharged) form of a drug can passively diffuse across lipid cell membranes; when local pH drops well below the pKa of a weak base, the Henderson-Hasselbalch equation predicts the equilibrium shifts overwhelmingly toward the ionized (protonated) form, which is trapped by the lipid bilayer' },
        { id: 'kp2', weight: 1, description: 'Clinical application: local anesthetics are weak bases (pKa 7.6-8.9); in the acidic environment of an abscess (pH 5-6), most molecules become ionized and cannot penetrate the nerve membrane to reach the intracellular sodium channel binding site, explaining why infiltration into infected tissue fails' },
      ],
      common_errors: [
        'Attributing abscess block failure to drug binding by pus proteins or bacterial degradation (the mechanism is pH-driven ionization trapping)',
        'Confusing the direction: for weak bases, LOWER pH means MORE ionized (not less); for weak acids, the relationship is reversed',
      ],
      minimum_passing_score: 60,
    },
    topic: 'absorption-bioavailability',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'absorption-bioavailability' },
  },

  // ── Atoms feeding r-ap1-w1-6a (Hepatic Drug Metabolism — CYP3A4) ─────

  {
    id: 'atom-cyp3a4-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'CYP3A4 is called the most clinically important cytochrome P450 isoenzyme. Explain what fraction of all drug metabolism it handles, name the anesthesia drugs it metabolizes, and identify one potent inhibitor and one potent inducer with their clinical consequences.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'CYP3A4 is the most abundant hepatic CYP isoenzyme, responsible for metabolizing approximately 50% of all clinically used drugs including fentanyl, sufentanil, alfentanil, and midazolam' },
        { id: 'kp2', weight: 1, description: 'Potent inhibitors (ketoconazole, erythromycin, grapefruit juice) reduce CYP3A4 activity, causing substrate drugs to accumulate — grapefruit juice irreversibly inhibits intestinal CYP3A4, increasing oral midazolam bioavailability and potentially causing excessive sedation' },
        { id: 'kp3', weight: 1, description: 'Potent inducers (rifampin, phenytoin, carbamazepine) increase CYP3A4 enzyme synthesis, accelerating substrate metabolism and potentially causing therapeutic failure if doses are not increased' },
      ],
      common_errors: [
        'Claiming CYP3A4 metabolizes remifentanil (remifentanil is metabolized by nonspecific tissue esterases, not CYP450 enzymes)',
        'Confusing enzyme inhibition with enzyme induction (inhibitors decrease metabolism/increase drug levels; inducers increase metabolism/decrease drug levels)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'drug-metabolism',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'drug-metabolism' },
  },

  // ── Atoms feeding r-ap1-w1-6b (Remifentanil, Codeine Pathways) ───────

  {
    id: 'atom-remifentanil-ester-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Remifentanil has a uniquely short and predictable duration regardless of infusion length. Explain the specific metabolic pathway responsible, identify the enzyme class (and distinguish it from the enzyme that metabolizes succinylcholine), and explain why this pathway is called organ-independent.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Remifentanil contains a methyl ester linkage hydrolyzed by nonspecific tissue and plasma esterases (NOT pseudocholinesterase/butyrylcholinesterase, NOT CYP450) — this gives it a context-sensitive half-time of approximately 3-5 minutes regardless of infusion duration' },
        { id: 'kp2', weight: 1, description: 'The pathway is called organ-independent because the esterases are ubiquitous in blood and tissues — remifentanil clearance does not depend on hepatic or renal function, making it ideal for patients with organ failure' },
        { id: 'kp3', weight: 1, description: 'Pseudocholinesterase (butyrylcholinesterase) is a different enzyme that metabolizes succinylcholine and mivacurium — atypical pseudocholinesterase does NOT affect remifentanil metabolism' },
      ],
      common_errors: [
        'Stating remifentanil is metabolized by pseudocholinesterase (pseudocholinesterase handles succinylcholine/mivacurium; remifentanil uses nonspecific tissue esterases)',
        'Claiming remifentanil is metabolized by CYP3A4 (CYP3A4 metabolizes fentanyl, sufentanil, alfentanil — not remifentanil)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'drug-metabolism',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'drug-metabolism' },
  },

  // ── Cross-feed atom: feeds r-ap1-w1-6b AND r-ap1-w1-7 ───────────────

  {
    id: 'atom-cyp2d6-prodrug-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Codeine requires metabolic activation to produce analgesia. Identify the specific CYP enzyme responsible, name the active metabolite, and explain why genetic variation in this enzyme\'s activity creates a spectrum from therapeutic failure to life-threatening toxicity.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Codeine is a prodrug requiring CYP2D6 O-demethylation to morphine for its primary analgesic effect — codeine itself has minimal activity; the CYP2D6 enzyme converts it to the pharmacologically active metabolite' },
        { id: 'kp2', weight: 1, description: 'Genetic polymorphisms in CYP2D6 create a clinical spectrum: poor metabolizers produce little morphine and get no analgesia; ultrarapid metabolizers produce excess morphine, risking respiratory depression — this is why codeine is restricted in children post-tonsillectomy' },
      ],
      common_errors: [
        'Assuming codeine is active as administered and metabolism only deactivates it (codeine is a prodrug that REQUIRES metabolic activation)',
        'Confusing CYP2D6 with CYP3A4 (CYP2D6 activates codeine; CYP3A4 metabolizes fentanyl)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'drug-metabolism',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'drug-metabolism' },
  },

  // ── Atoms feeding r-ap1-w1-7 (Pharmacogenetics) ──────────────────────

  {
    id: 'atom-atypical-bche-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'A patient receives succinylcholine for rapid-sequence intubation and the expected 3-5 minute block extends to hours. Explain the enzyme defect responsible, describe how the dibucaine number distinguishes normal from atypical enzyme variants, and state the expected duration ranges for each genotype.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Atypical pseudocholinesterase (butyrylcholinesterase) has drastically reduced affinity for succinylcholine — the normal 3-5 minute block extends to 4-8 hours because the enzyme cannot hydrolyze the drug efficiently; the defect is qualitative (abnormal enzyme), not quantitative (low enzyme levels)' },
        { id: 'kp2', weight: 1, description: 'The dibucaine number quantifies enzyme quality: dibucaine inhibits normal enzyme ~80% (dibucaine number 80), heterozygous atypical 40-60%, and homozygous atypical <20% — a lower dibucaine number indicates more atypical enzyme and greater susceptibility to prolonged block' },
        { id: 'kp3', weight: 1, description: 'Management of prolonged block: maintain sedation and mechanical ventilation until neuromuscular function recovers; do NOT administer anticholinesterases (they inhibit the very enzyme needed for recovery)' },
      ],
      common_errors: [
        'Confusing pseudocholinesterase deficiency with malignant hyperthermia (prolonged paralysis vs hypermetabolic crisis are completely different entities with different mechanisms)',
        'Stating that low dibucaine number means normal enzyme (low number = atypical enzyme = greater susceptibility)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'pharmacogenetics',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'pharmacogenetics' },
  },

  {
    id: 'atom-ryr1-mh-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Malignant hyperthermia results from a mutation in a specific calcium channel on the skeletal muscle sarcoplasmic reticulum. Identify the receptor, explain the mechanism by which triggering agents cause uncontrolled calcium release, and name the drug that treats MH by acting at this same receptor.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Malignant hyperthermia is caused by mutations in the RyR1 (type 1 ryanodine receptor) gene encoding the calcium release channel on the skeletal muscle sarcoplasmic reticulum; triggering agents (all volatile anesthetics, succinylcholine) cause the mutant channel to remain open, flooding the myoplasm with calcium' },
        { id: 'kp2', weight: 1, description: 'Uncontrolled calcium release produces sustained muscle contraction, massively increased oxygen consumption, CO2 production, lactic acidosis, hyperthermia, rhabdomyolysis, and hyperkalemia — MH is autosomal dominant with variable penetrance' },
        { id: 'kp3', weight: 1, description: 'Dantrolene treats MH by directly blocking calcium release through the RyR1 receptor on the sarcoplasmic reticulum, reducing intracellular calcium and stopping the hypermetabolic cascade (dose: 2.5 mg/kg IV, repeated until symptoms resolve)' },
      ],
      common_errors: [
        'Stating that prior uneventful anesthetics exclude MH susceptibility (MH is autosomal dominant with variable penetrance — prior safe exposures do not guarantee future safety)',
        'Claiming dantrolene works by blocking the neuromuscular junction (it acts at the sarcoplasmic reticulum RyR1 receptor, not at the NMJ)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'pharmacogenetics',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'pharmacogenetics' },
  },

  // ── Atoms feeding r-ap1-w1-8 (Dose-Response Relationships) ───────────

  {
    id: 'atom-potency-vs-efficacy-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Define potency and efficacy as separate pharmacodynamic properties. Explain which property corresponds to the horizontal position of a dose-response curve and which corresponds to the vertical maximum, and state which property is more clinically important.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Potency is represented by EC50 (or ED50) — the dose producing 50% of maximal effect — and corresponds to the horizontal position of the dose-response curve; a leftward shift means greater potency (less drug needed for the same effect)' },
        { id: 'kp2', weight: 1, description: 'Efficacy (Emax) is the maximum effect a drug can produce regardless of dose and corresponds to the vertical height of the dose-response curve; a partial agonist has lower efficacy than a full agonist by definition' },
        { id: 'kp3', weight: 1, description: 'Efficacy is more clinically important than potency — a more potent drug simply requires a smaller dose, but efficacy determines whether the drug can achieve the desired therapeutic outcome at any dose' },
      ],
      common_errors: [
        'Confusing potency with efficacy — stating that a more potent drug is necessarily more effective or safer (potency is the dose required, efficacy is the maximal achievable effect)',
        'Equating a leftward curve shift with higher efficacy (leftward shift = greater potency, not efficacy; efficacy is the curve HEIGHT)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'dose-response',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'dose-response' },
  },

  {
    id: 'atom-synergy-additivity-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Distinguish synergistic (supra-additive) from additive drug interactions. Explain why two drugs acting through different receptor mechanisms can produce a combined effect greater than the sum of their individual effects, and give one example of each interaction type from anesthesia practice.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Synergy (supra-additive interaction) occurs when two drugs acting through different receptor mechanisms produce a combined effect greater than the arithmetic sum of their individual effects — opioids reduce volatile MAC by 50-75% at relatively low doses because they suppress pain at spinal/supraspinal mu receptors while volatiles act on cortical pathways' },
        { id: 'kp2', weight: 1, description: 'Additive interaction means the combined effect equals the sum of individual effects — volatile + volatile MAC follows simple additivity (0.5 MAC sevoflurane + 0.5 MAC N2O = 1.0 MAC equivalent) because both agents act through similar mechanisms' },
      ],
      common_errors: [
        'Labeling all beneficial drug combinations as synergistic (volatile + volatile is additive, not synergistic)',
        'Confusing synergy with potentiation (potentiation technically means one drug alone has no effect but enhances the other; synergy means both have effects that sum to more than expected)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'dose-response',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'dose-response' },
  },

  // ── Atoms feeding r-ap1-w1-9a (Elimination Kinetics — First/Zero) ────

  {
    id: 'atom-first-zero-order-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Compare first-order and zero-order elimination kinetics. Define each in terms of whether a constant fraction or constant amount is removed per unit time, explain what condition causes a drug to follow zero-order kinetics, and give the classic clinical example of each.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'First-order kinetics: a constant FRACTION (percentage) of drug is eliminated per unit time — the rate of elimination is proportional to concentration; most drugs follow first-order kinetics at therapeutic concentrations' },
        { id: 'kp2', weight: 1, description: 'Zero-order kinetics: a constant AMOUNT of drug is eliminated per unit time regardless of concentration — this occurs when metabolic enzymes are fully saturated; the rate is fixed at the maximum enzyme capacity (Vmax)' },
        { id: 'kp3', weight: 1, description: 'Classic examples: ethanol follows zero-order kinetics at intoxicating concentrations (~15-20 mg/dL/hr constant rate); most other drugs (opioids, propofol, benzodiazepines) follow first-order kinetics within their therapeutic range' },
      ],
      common_errors: [
        'Reversing the definitions: stating first-order means constant amount and zero-order means constant fraction (it is the opposite)',
        'Stating that half-life is meaningful during zero-order elimination (half-life is constant only during first-order kinetics; it has no fixed value during zero-order)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'elimination-kinetics',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'elimination-kinetics' },
  },

  // ── Atoms feeding r-ap1-w1-9b (Clearance & Dose Adjustment) ──────────

  {
    id: 'atom-flow-limited-clearance-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'For drugs with a high hepatic extraction ratio (>0.7), clearance is described as "flow-limited." Explain what this means, why changes in hepatic enzyme activity or protein binding have minimal effect on clearance of these drugs, and what clinical condition directly reduces their clearance.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'High hepatic extraction ratio drugs (>0.7: lidocaine, propofol, morphine) have flow-limited clearance — the liver removes the drug so efficiently on each pass that clearance is determined almost entirely by hepatic blood flow, not by enzyme activity or protein binding' },
        { id: 'kp2', weight: 1, description: 'Changes in enzyme activity (induction/inhibition) or protein binding have minimal effect because even bound drug is stripped from protein during passage through the liver — the enzyme capacity already far exceeds the drug delivery rate, so flow is the bottleneck' },
        { id: 'kp3', weight: 1, description: 'Clinical condition: any state that reduces hepatic blood flow — cardiogenic shock, heart failure, cirrhosis with portal hypertension — directly reduces clearance and causes drug accumulation' },
      ],
      common_errors: [
        'Assuming enzyme induction can increase clearance of high-extraction drugs beyond the flow-limited ceiling (it cannot — flow, not enzyme capacity, is the rate-limiting step)',
        'Confusing high-extraction (flow-limited) with low-extraction (capacity-limited) drugs where enzyme activity and protein binding DO matter',
      ],
      minimum_passing_score: 60,
    },
    topic: 'clearance-dose-adjustment',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'clearance-dose-adjustment' },
  },

  {
    id: 'atom-ion-trapping-renal-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Explain the ion trapping mechanism used to accelerate renal drug excretion. Describe how changing urine pH traps a weakly acidic drug in the tubular lumen, and then explain how the same principle (at a different pH boundary) causes ion trapping of weak base local anesthetics in fetal circulation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Renal ion trapping: alkalinizing urine with sodium bicarbonate ionizes weakly acidic drugs (phenobarbital, salicylates) in the tubular lumen — the ionized form cannot diffuse back across the lipid tubular membrane, trapping it in the lumen for excretion' },
        { id: 'kp2', weight: 1, description: 'Fetal ion trapping: fetal blood pH is normally lower than maternal pH; nonionized weak base local anesthetic crosses the placenta freely, then becomes ionized (protonated) in the more acidic fetal blood and cannot diffuse back — in fetal acidosis/distress, trapping is dramatically worsened' },
        { id: 'kp3', weight: 1, description: 'The directional rule: alkaline environments trap weak ACIDS (ionize them); acidic environments trap weak BASES (protonate them) — the same Henderson-Hasselbalch principle applied at different pH boundaries' },
      ],
      common_errors: [
        'Reversing the direction: stating alkaline urine traps weak bases (alkaline urine traps weak ACIDS; acidic environments trap weak BASES)',
        'Confusing ion trapping with active tubular secretion (ion trapping works by preventing passive REABSORPTION, not by enhancing secretion)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'clearance-dose-adjustment',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'clearance-dose-adjustment' },
  },

  // ── Atoms feeding r-ap1-w1-9c (Steady State, Phenytoin, Three-Phase) ─

  {
    id: 'atom-michaelis-menten-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Phenytoin is described as following "Michaelis-Menten" or "saturable" kinetics. Explain how a drug can appear to follow first-order kinetics at low concentrations but shift to zero-order at higher concentrations, and describe the clinical consequence of this transition for dose adjustments.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Michaelis-Menten (saturable) kinetics: at low concentrations, metabolic enzymes are unsaturated and elimination appears first-order (constant fraction removed); as concentration rises and enzymes approach saturation (Km), elimination transitions to zero-order (constant amount at Vmax) — the same dose increase produces a disproportionately larger concentration jump at higher levels' },
        { id: 'kp2', weight: 1, description: 'Phenytoin is the classic clinical example: small dose increases near the saturating range cause unpredictable, disproportionately large jumps in serum concentration, narrowing the margin between therapeutic (10-20 mcg/mL) and toxic levels — this makes empirical dosing uniquely dangerous' },
      ],
      common_errors: [
        'Treating first-order and zero-order as mutually exclusive for a given drug (Michaelis-Menten drugs transition between the two depending on concentration relative to Km)',
        'Forgetting that phenytoin danger is specifically the TRANSITION from first-order to zero-order (not simply that it follows zero-order kinetics at all times)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'elimination-kinetics',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'elimination-kinetics' },
  },

  {
    id: 'atom-three-phase-curve-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'After an IV bolus, the plasma concentration-time curve shows three distinct phases. Name each phase in order, identify what pharmacokinetic process dominates during each, and explain what ke0 measures and why peak clinical effect does not coincide with peak plasma concentration.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The three phases are: (1) rapid distribution (alpha phase) — drug distributes from blood to the vessel-rich group; (2) redistribution (beta phase) — drug moves from VRG to muscle and lean tissues; (3) terminal elimination (gamma phase) — drug is cleared from the deep (fat) compartment by metabolism' },
        { id: 'kp2', weight: 1, description: 'ke0 is the effect-site elimination rate constant describing the rate of drug equilibration between plasma and the effect site (biophase); a higher ke0 means faster equilibration and a shorter lag between plasma peak and clinical effect' },
        { id: 'kp3', weight: 1, description: 'Hysteresis: peak clinical effect does not coincide with peak plasma concentration because the effect site must equilibrate with plasma — during the rising phase, effect lags behind; during the declining phase, effect persists after plasma levels fall' },
      ],
      common_errors: [
        'Confusing the alpha (rapid distribution) phase with the gamma (terminal elimination) phase when interpreting plasma concentration curves',
        'Assuming peak clinical effect occurs at the same time as peak plasma concentration (the effect-site lag described by ke0 creates a temporal dissociation)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'elimination-kinetics',
    chapter: 'ap1-wk-1',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 2, Vandivier lecture', topic: 'elimination-kinetics' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  ap1-wk-2 atoms — PNS, Autonomic Pharmacology, Thermoregulation
  //  Sprint B Stage 4: 14 content atoms
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Atom feeding r-ap1-w2-1 (ANS Architecture) ─────────────────────────

  {
    id: 'atom-autonomic-tone-baseline-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'Explain the concept of residual autonomic tone. Why are both the sympathetic and parasympathetic divisions described as continuously active, and what is the clinical consequence of blocking one division pharmacologically or with neuraxial anesthesia?',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Both the sympathetic and parasympathetic nervous systems maintain continuous baseline activity (autonomic tone) at rest; changes in tone in either direction allow fine regulation of organ function' },  // source: ap1-w2-029
        { id: 'kp2', weight: 1, description: 'Sympathetic vascular tone normally keeps blood vessels at approximately 50% constriction; this baseline allows the body to increase or decrease vascular resistance bidirectionally' },  // source: ap1-w2-028
        { id: 'kp3', weight: 1, description: 'Blocking one division unmasks the opposing division: neuraxial anesthesia removes sympathetic vasoconstrictor tone below the block level causing hypotension; beta blockers unmask vagal tone causing bradycardia' },  // source: ap1-w2-028, ap1-w2-029
      ],
      common_errors: [
        'Stating that the ANS is silent at rest and activated only by stimulation (both divisions are continuously active)',
        'Assuming sympathetic and parasympathetic activity alternate in 24 hour cycles rather than operating simultaneously',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ans-architecture',
    chapter: 'ap1-wk-2',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 3, Vandivier lecture', topic: 'ans-architecture' },
  },

  // ── Atoms feeding r-ap1-w2-2 (Neurotransmitter Pathways) ──────────────

  {
    id: 'atom-preganglionic-ach-nicotinic-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'Identify the neurotransmitter and receptor type used by ALL preganglionic autonomic neurons, regardless of whether they are sympathetic or parasympathetic. Explain why this shared preganglionic transmitter means that ganglionic blocking drugs inhibit both divisions simultaneously.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'All preganglionic autonomic neurons (both sympathetic and parasympathetic) release acetylcholine that activates nicotinic receptors (NN subtype) on postganglionic cell bodies in autonomic ganglia' },  // source: ap1-w2-009, ap1-w2-010
        { id: 'kp2', weight: 1, description: 'Because both divisions share ACh/nicotinic ganglionic transmission, ganglionic blockers (e.g., trimethaphan) inhibit sympathetic and parasympathetic pathways simultaneously' },  // source: ap1-w2-009
        { id: 'kp3', weight: 1, description: 'Ganglionic nicotinic receptors (NN) differ pharmacologically from neuromuscular junction nicotinic receptors (NM), which is why ganglion blockers do not cause skeletal muscle paralysis' },  // source: ap1-w2-010
      ],
      common_errors: [
        'Assuming sympathetic preganglionic neurons release norepinephrine (NE is the postganglionic sympathetic transmitter, not the preganglionic one)',
        'Confusing ganglionic nicotinic (NN) with neuromuscular nicotinic (NM) receptor subtypes',
      ],
      minimum_passing_score: 60,
    },
    topic: 'neurotransmitter-pathways',
    chapter: 'ap1-wk-2',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 3, Vandivier lecture', topic: 'neurotransmitter-pathways' },
  },

  {
    id: 'atom-postganglionic-divergence-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'Explain the postganglionic neurotransmitter divergence between the sympathetic and parasympathetic divisions: what transmitter and receptor type does each use at the target organ? Identify the notable exception where sympathetic postganglionic fibers release acetylcholine and state its clinical significance.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Postganglionic sympathetic fibers are adrenergic: they release norepinephrine that acts on alpha and beta adrenergic receptors at target organs' },  // source: ap1-w2-011
        { id: 'kp2', weight: 1, description: 'Postganglionic parasympathetic fibers are cholinergic: they release acetylcholine that acts on muscarinic receptors at target organs' },  // source: ap1-w2-012
        { id: 'kp3', weight: 2, description: 'Exception: sympathetic postganglionic fibers innervating sweat glands release acetylcholine instead of norepinephrine (sympathetic cholinergic fibers); anticholinergic drugs like atropine can therefore reduce sweating' },  // source: ap1-w2-013
      ],
      common_errors: [
        'Overgeneralizing that all sympathetic postganglionic fibers are adrenergic without recognizing the sweat gland exception',
        'Confusing the postganglionic receptor types: sympathetic targets use adrenergic receptors (not nicotinic), parasympathetic targets use muscarinic receptors (not nicotinic)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'neurotransmitter-pathways',
    chapter: 'ap1-wk-2',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 3, Vandivier lecture', topic: 'neurotransmitter-pathways' },
  },

  // ── Atoms feeding r-ap1-w2-3 (NE Lifecycle) ───────────────────────────

  {
    id: 'atom-ne-synthesis-pathway-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'Trace the complete norepinephrine synthesis pathway from its amino acid precursor to the finished neurotransmitter. Identify the rate limiting enzyme, state which steps occur in the cytoplasm versus inside the synaptic vesicle, and name the enzyme that catalyzes the final intravesicular conversion.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The synthesis sequence is Tyrosine to DOPA to Dopamine to Norepinephrine; the rate limiting step is the conversion of tyrosine to DOPA by tyrosine hydroxylase' },  // source: ap1-w2-014
        { id: 'kp2', weight: 1, description: 'The first two steps (tyrosine to DOPA, DOPA to dopamine) occur in the cytoplasm of the nerve terminal' },  // source: ap1-w2-014, ap1-w2-015
        { id: 'kp3', weight: 1, description: 'Dopamine is transported into the synaptic vesicle where dopamine beta hydroxylase converts it to norepinephrine; this final step occurs exclusively inside the vesicle' },  // source: ap1-w2-015
      ],
      common_errors: [
        'Placing the dopamine to norepinephrine conversion in the cytoplasm rather than inside the synaptic vesicle',
        'Misidentifying the rate limiting enzyme as dopamine beta hydroxylase (it is tyrosine hydroxylase)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ne-lifecycle',
    chapter: 'ap1-wk-2',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 3, Vandivier lecture', topic: 'ne-lifecycle' },
  },

  {
    id: 'atom-ne-reuptake-dominance-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'Identify the three mechanisms that terminate norepinephrine action at the synapse. Which mechanism accounts for approximately 80% of NE removal, and why does blocking this single mechanism (as cocaine and tricyclic antidepressants do) produce such potent sympathomimetic effects?',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Reuptake into the presynaptic nerve terminal accounts for approximately 80% of NE removal from the synapse; the recaptured NE is recycled back into synaptic vesicles for reuse' },  // source: ap1-w2-020, ap1-w2-021
        { id: 'kp2', weight: 1, description: 'The remaining NE is metabolized by monoamine oxidase (MAO, intraneuronal) and catechol O methyltransferase (COMT, extraneuronal), or diffuses away from receptors' },  // source: ap1-w2-019
        { id: 'kp3', weight: 1, description: 'Blocking the reuptake transporter (cocaine, tricyclic antidepressants) eliminates the dominant termination mechanism, dramatically increasing synaptic NE concentration and producing tachycardia, hypertension, and vasoconstriction' },  // source: ap1-w2-022
      ],
      common_errors: [
        'Stating that enzymatic degradation (MAO/COMT) is the primary NE termination mechanism (reuptake accounts for approximately 80%)',
        'Confusing NE termination (reuptake, MAO, COMT) with ACh termination (acetylcholinesterase hydrolysis)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ne-lifecycle',
    chapter: 'ap1-wk-2',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 3, Vandivier lecture', topic: 'ne-lifecycle' },
  },

  // ── Atom feeding r-ap1-w2-4 (Indirect Sympathomimetics) ───────────────

  {
    id: 'atom-ephedrine-tachyphylaxis-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'Ephedrine is an indirect acting sympathomimetic. Explain how it produces its pressor effect, why repeated boluses cause a progressively weaker response (tachyphylaxis), and what class of vasopressor you should switch to when tachyphylaxis occurs.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Ephedrine causes norepinephrine release from synaptic vesicles in sympathetic nerve terminals; the released NE activates postsynaptic adrenergic receptors producing vasoconstriction and increased heart rate' },  // source: ap1-w2-017, ap1-w2-018
        { id: 'kp2', weight: 2, description: 'Repeated ephedrine doses progressively deplete the releasable NE stores in synaptic vesicles, producing tachyphylaxis (diminished pressor response); this is neurotransmitter depletion, not receptor failure' },  // source: ap1-w2-018
        { id: 'kp3', weight: 1, description: 'When tachyphylaxis occurs, switching to a direct acting vasopressor such as phenylephrine (alpha 1 agonist) bypasses the depleted vesicular stores by binding postsynaptic receptors directly' },  // source: ap1-w2-018
      ],
      common_errors: [
        'Attributing ephedrine tachyphylaxis to receptor downregulation rather than depletion of releasable NE stores',
        'Confusing indirect acting sympathomimetics (release stored NE) with direct acting agents (bind receptors directly)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ne-drug-interactions',
    chapter: 'ap1-wk-2',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 3, Vandivier lecture', topic: 'ne-drug-interactions' },
  },

  // ── Atom feeding r-ap1-w2-5 (ACh Pharmacology) ────────────────────────

  {
    id: 'atom-ach-synthesis-hydrolysis-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'Trace acetylcholine from synthesis to termination at the parasympathetic neuroeffector junction. Name the synthetic enzyme and its two substrates, identify the enzyme that terminates ACh action, name the hydrolysis products, and explain how choline is conserved for resynthesis.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Choline acetyltransferase (ChAT) synthesizes acetylcholine from choline and acetyl coenzyme A in the nerve terminal' },  // source: ap1-w2-023, ap1-w2-024
        { id: 'kp2', weight: 2, description: 'Acetylcholinesterase (AChE) rapidly hydrolyzes ACh into choline and acetate at the synapse, providing fast and precise control of cholinergic transmission' },  // source: ap1-w2-025, ap1-w2-026
        { id: 'kp3', weight: 1, description: 'Choline produced by hydrolysis is actively transported back into the presynaptic nerve terminal and recycled for new ACh synthesis, conserving this essential substrate' },  // source: ap1-w2-026
      ],
      common_errors: [
        'Confusing acetylcholinesterase (degrades ACh) with choline acetyltransferase (synthesizes ACh); they catalyze opposite reactions',
        'Stating that ACh is terminated by reuptake like norepinephrine (ACh is hydrolyzed enzymatically; only the choline product is recycled)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'acetylcholine-pharmacology',
    chapter: 'ap1-wk-2',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 3, Vandivier lecture', topic: 'acetylcholine-pharmacology' },
  },

  // ── Atom feeding r-ap1-w2-6 (Autonomic Dysfunction) ───────────────────

  {
    id: 'atom-hrv-autonomic-marker-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'Explain what heart rate variability (HRV) measures at the physiologic level, state the relationship between HRV magnitude and parasympathetic activity, and describe why reduced HRV in a diabetic patient is an early warning sign for cardiac autonomic neuropathy with prognostic significance.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'HRV reflects the dynamic interplay between sympathetic and parasympathetic inputs to the SA node; greater beat to beat variability generally indicates healthy parasympathetic (vagal) activity' },  // source: ap1-w2-031
        { id: 'kp2', weight: 1, description: 'Reduced HRV indicates impaired vagal tone or sympathetic dominance and is an early marker of cardiac autonomic neuropathy in diabetic patients' },  // source: ap1-w2-031
        { id: 'kp3', weight: 1, description: 'Reduced HRV independently predicts increased cardiovascular morbidity; patients with low HRV are at higher risk for hemodynamic instability during anesthesia' },  // source: ap1-w2-031
      ],
      common_errors: [
        'Stating that greater HRV indicates sympathetic dominance (greater HRV generally indicates healthy parasympathetic activity)',
        'Claiming HRV directly measures catecholamine levels (it is an indirect measure of autonomic input to the heart)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'autonomic-dysfunction',
    chapter: 'ap1-wk-2',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 3, Vandivier lecture', topic: 'autonomic-dysfunction' },
  },

  // ── Atom feeding r-ap1-w2-7 (Pheochromocytoma) ────────────────────────

  {
    id: 'atom-alpha-before-beta-pheo-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'A patient with pheochromocytoma requires preoperative pharmacologic preparation. Explain why alpha adrenergic blockade must be established before beta blockade is initiated. What specific hemodynamic catastrophe occurs if beta blockade is started first, and what is the mechanism?',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Alpha blockade must precede beta blockade; initiating beta blockade first removes beta 2 mediated vasodilation in skeletal muscle vasculature, leaving alpha mediated vasoconstriction completely unopposed' },  // source: ap1-w2-035
        { id: 'kp2', weight: 1, description: 'Unopposed alpha stimulation in the setting of catecholamine excess produces severe hypertensive crisis that can cause stroke, myocardial infarction, or death' },  // source: ap1-w2-035
        { id: 'kp3', weight: 1, description: 'Once adequate alpha blockade is established (typically with phenoxybenzamine or doxazosin), beta blockade can be safely added to control reflex tachycardia' },  // source: ap1-w2-035
      ],
      common_errors: [
        'Starting beta blockade before alpha blockade is adequately established',
        'Confusing the reason for the sequence: the danger is not beta blockade itself but the loss of beta 2 vasodilation that partially offsets alpha vasoconstriction',
      ],
      minimum_passing_score: 60,
    },
    topic: 'pheochromocytoma-management',
    chapter: 'ap1-wk-2',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 3, Vandivier lecture', topic: 'pheochromocytoma-management' },
  },

  // ── Atoms feeding r-ap1-w2-8 (Adrenal Medulla) ────────────────────────

  {
    id: 'atom-adrenal-modified-ganglion-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'Explain why the adrenal medulla is described as a modified sympathetic ganglion rather than a typical endocrine gland. Identify the type of nerve fiber that innervates it, the receptor type on chromaffin cells, and the signaling cascade from preganglionic stimulation to catecholamine release into the bloodstream.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The adrenal medulla receives preganglionic sympathetic fibers directly (no postganglionic neuron is interposed); chromaffin cells function as modified postganglionic neurons that release catecholamines into the bloodstream instead of across a synapse' },  // source: ap1-w2-037, ap1-w2-038
        { id: 'kp2', weight: 1, description: 'Preganglionic fibers release acetylcholine that activates nicotinic receptors on chromaffin cells, triggering calcium influx and exocytosis of catecholamine containing vesicles' },  // source: ap1-w2-042
        { id: 'kp3', weight: 1, description: 'This nicotinic receptor mediated release is the same signaling mechanism used at all autonomic ganglia; the adrenal medulla simply uses the bloodstream as the distribution pathway instead of a synapse' },  // source: ap1-w2-042
      ],
      common_errors: [
        'Stating the adrenal medulla receives postganglionic sympathetic fibers (it receives preganglionic fibers because chromaffin cells replace the postganglionic neuron)',
        'Claiming the adrenal medulla receives parasympathetic innervation (it is exclusively sympathetic)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'adrenal-medulla',
    chapter: 'ap1-wk-2',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 3, Vandivier lecture', topic: 'adrenal-medulla' },
  },

  {
    id: 'atom-pnmt-cortisol-epi-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'Name the enzyme that converts norepinephrine to epinephrine in the adrenal medulla, state the approximate ratio of epinephrine to norepinephrine in adrenal medullary output, and explain how cortisol from the adjacent adrenal cortex regulates this enzyme to link the HPA stress axis to catecholamine production.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Phenylethanolamine N methyltransferase (PNMT) catalyzes the N methylation of norepinephrine to produce epinephrine; this is the final step beyond the standard NE synthesis pathway' },  // source: ap1-w2-040
        { id: 'kp2', weight: 2, description: 'The adrenal medulla releases approximately 80% epinephrine and 20% norepinephrine; cortisol from the adjacent adrenal cortex upregulates PNMT enzyme activity, directly linking HPA axis stress activation to increased epinephrine synthesis' },  // source: ap1-w2-039, ap1-w2-041
        { id: 'kp3', weight: 1, description: 'The anatomic proximity of cortex and medulla has functional significance: high local cortisol concentrations in the portal blood flowing from cortex to medulla are essential for maintaining PNMT activity and the 80:20 epinephrine to norepinephrine ratio' },  // source: ap1-w2-041
      ],
      common_errors: [
        'Confusing PNMT (converts NE to epinephrine) with dopamine beta hydroxylase (converts dopamine to NE); they catalyze different steps in the pathway',
        'Stating that the adrenal medulla produces 100% epinephrine (norepinephrine accounts for approximately 20% of output)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'adrenal-medulla',
    chapter: 'ap1-wk-2',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 3, Vandivier lecture', topic: 'adrenal-medulla' },
  },

  // ── Atoms feeding r-ap1-w2-9 (Thermoregulation Phases) ────────────────

  {
    id: 'atom-three-phase-hypothermia-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'Describe the three phases of perioperative hypothermia that occur during general anesthesia: name each phase, state the timeframe, quantify the temperature change where applicable, and explain the mechanism driving each phase. Specifically distinguish the mechanism of Phase 1 from Phase 2.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Phase 1 (redistribution hypothermia): a 0.5 to 1.5 degree C core temperature drop in the first hour caused by anesthesia induced vasodilation that redistributes warm core blood to the cooler periphery; this is internal heat redistribution, not environmental heat loss' },  // source: ap1-w2-055
        { id: 'kp2', weight: 1, description: 'Phase 2 (linear heat loss): after redistribution is largely complete, core temperature decreases more slowly because ongoing heat loss to the cold operating environment exceeds the reduced metabolic heat production' },  // source: ap1-w2-056
        { id: 'kp3', weight: 1, description: 'Phase 3 (plateau, after 3 to 5 hours): thermoregulatory vasoconstriction is triggered (at a lower threshold under anesthesia), reducing peripheral blood flow and establishing equilibrium between heat loss and production' },  // source: ap1-w2-057
      ],
      common_errors: [
        'Attributing the rapid first hour temperature drop to environmental heat loss rather than internal core to peripheral heat redistribution',
        'Confusing Phase 2 (environmental heat loss exceeds production) with Phase 1 (internal redistribution)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'perioperative-thermoregulation',
    chapter: 'ap1-wk-2',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 3, Vandivier lecture', topic: 'perioperative-thermoregulation' },
  },

  {
    id: 'atom-nonshivering-thermogenesis-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'Explain nonshivering thermogenesis: identify the tissue responsible, the molecular mechanism by which it generates heat, the receptor system that activates it, and state whether it is present or absent during general anesthesia. Contrast it with shivering thermogenesis in terms of mechanism and metabolic cost.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Nonshivering thermogenesis occurs in brown adipose tissue; uncoupling protein 1 (UCP 1) in brown fat mitochondria uncouples oxidative phosphorylation, generating heat instead of ATP; it is activated by the sympathetic nervous system via beta adrenergic receptors' },  // source: ap1-w2-049
        { id: 'kp2', weight: 1, description: 'Nonshivering thermogenesis is absent during general anesthesia, removing an important heat production mechanism and accelerating hypothermia' },  // source: ap1-w2-054
        { id: 'kp3', weight: 1, description: 'Shivering thermogenesis generates heat through involuntary skeletal muscle contraction controlled by the posterior hypothalamus; it increases oxygen consumption by 200 to 300% above baseline, which is metabolically costly and can be treated with meperidine' },  // source: ap1-w2-050
      ],
      common_errors: [
        'Confusing nonshivering thermogenesis (brown fat, UCP 1) with shivering (skeletal muscle contraction); they are distinct mechanisms',
        'Attributing nonshivering thermogenesis to white adipose tissue (it occurs in brown fat which expresses UCP 1)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'perioperative-thermoregulation',
    chapter: 'ap1-wk-2',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 3, Vandivier lecture', topic: 'perioperative-thermoregulation' },
  },

  // ── Atom feeding r-ap1-w2-10 (Thermoregulation + Anesthesia) ──────────

  {
    id: 'atom-regional-thermoreg-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'Explain why regional anesthesia (spinal or epidural) increases the risk of perioperative hypothermia beyond what general anesthesia alone produces. Specifically describe which thermoregulatory defense mechanism is blocked, which phase of perioperative hypothermia may fail to develop, and why combined general plus regional anesthesia is the highest risk combination.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Regional anesthesia blocks sympathetic vasoconstriction below the level of the block; the Phase 3 plateau requires thermoregulatory vasoconstriction to establish equilibrium, so it may never develop when the sympathetic block prevents vasoconstriction in the affected segments' },  // source: ap1-w2-058
        { id: 'kp2', weight: 1, description: 'Combined general plus regional anesthesia is the highest risk combination because GA abolishes central thermoregulatory defenses (widened interthreshold range, loss of shivering, loss of nonshivering thermogenesis) while regional abolishes the peripheral vasoconstriction needed for the Phase 3 plateau' },  // source: ap1-w2-058
        { id: 'kp3', weight: 1, description: 'Even mild hypothermia (1 to 2 degrees C below normal) causes clinically significant consequences including delayed drug metabolism, prolonged recovery, impaired coagulation, increased wound infection rates, and increased oxygen demand during rewarming' },  // source: ap1-w2-060
      ],
      common_errors: [
        'Assuming the Phase 3 temperature plateau will occur under regional anesthesia (sympathetic blockade prevents the vasoconstriction needed for equilibrium)',
        'Stating that hypothermia enhances coagulation (it impairs coagulation and platelet function, increasing bleeding risk)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'thermoregulation-anesthesia',
    chapter: 'ap1-wk-2',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 3, Vandivier lecture', topic: 'thermoregulation-anesthesia' },
  },

];
