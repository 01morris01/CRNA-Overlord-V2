// Atom-tier recall questions — ap1-wk-1 + ap1-wk-2 + ap1-wk-3
// Sprint B: 6 engine-proof atoms + 21 wk-1 content atoms + 14 wk-2 content atoms + 19 wk-3 content atoms (60 total)

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

  // ═══════════════════════════════════════════════════════════════════════════
  //  WEEK 3 ATOMS — Sympathomimetics, Antihypertensives, Vasodilators
  //  (Stoelting Ch 15, 18, 19, 20; Vandivier lectures)
  //  19 atoms feeding 10 synthesis questions
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Atoms feeding r-ap1-w3-1 (Catecholamine Selection in Shock) ──────────

  {
    id: 'atom-epi-dose-dependent-shift-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain why low-dose epinephrine produces vasodilation and increased heart rate while high-dose epinephrine produces intense vasoconstriction. Identify which adrenergic receptors dominate at each dose range and describe the clinical significance of this shift when titrating an epinephrine infusion.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'At low IV doses, beta-2 receptors on vascular smooth muscle are more sensitive than alpha-1 receptors, so beta-2 mediated vasodilation predominates; simultaneously, beta-1 stimulation increases heart rate and contractility; the net effect is increased cardiac output with decreased SVR' },  // source: ap1-w3-002
        { id: 'kp2', weight: 2, description: 'At high IV doses, alpha-1 vasoconstriction overwhelms beta-2 vasodilation because alpha-1 receptors become fully recruited; this produces intense peripheral vasoconstriction, markedly elevated SVR and MAP; the clinical shift means the same drug can either vasodilate or vasoconstrict depending entirely on dose' },  // source: ap1-w3-001, ap1-w3-002
        { id: 'kp3', weight: 1, description: 'Beta-2 activation also drives potassium intracellularly via the Na-K ATPase pump, causing hypokalemia; this is blunted by nonselective beta-blockers (propranolol) but NOT by beta-1 selective agents (atenolol, esmolol)' },  // source: ap1-w3-003, ap1-w3-004
      ],
      common_errors: [
        'Stating that epinephrine only vasoconstricts; at low doses, beta-2 vasodilation is the dominant vascular effect',
        'Confusing the dose-dependent receptor shift with different receptor subtypes being present at different locations; both alpha-1 and beta-2 are present on vasculature, but their sensitivity thresholds differ',
      ],
      minimum_passing_score: 60,
    },
    topic: 'catecholamine-selection',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 15, Vandivier lecture', topic: 'catecholamine-selection' },
  },

  {
    id: 'atom-ne-septic-first-line-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain why norepinephrine is the first-line vasopressor for septic shock by matching its receptor profile to the hemodynamic derangements of sepsis. State why phenylephrine and dopamine are inferior alternatives.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Norepinephrine receptor profile is strong alpha-1, moderate beta-1, minimal beta-2; septic shock features pathologic vasodilation (low SVR) with potential cardiac dysfunction; NE alpha-1 restores vascular tone while beta-1 supports contractility and cardiac output; this dual action matches the hemodynamic deficit' },  // source: ap1-w3-007, ap1-w3-008
        { id: 'kp2', weight: 1, description: 'Phenylephrine is inferior because it is a pure alpha-1 agonist with no beta-1 support; increasing afterload without inotropic augmentation may worsen tissue perfusion in sepsis where cardiac dysfunction coexists' },  // source: ap1-w3-025
        { id: 'kp3', weight: 1, description: 'Dopamine is inferior because it causes significantly more tachyarrhythmias than NE at the doses required for hemodynamic support; current Surviving Sepsis guidelines recommend NE first-line with vasopressin as a second agent' },  // source: ap1-w3-015
      ],
      common_errors: [
        'Recommending dopamine as first-line for septic shock based on older protocols; current evidence favors norepinephrine',
        'Stating that norepinephrine coronary arteries vasoconstrict; coronary arteries actually dilate via metabolic autoregulation despite systemic vasoconstriction',
      ],
      minimum_passing_score: 60,
    },
    topic: 'catecholamine-selection',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 15, Vandivier lecture', topic: 'catecholamine-selection' },
  },

  // ── Atom feeding r-ap1-w3-2 (Obstetric Vasopressors) ────────────────────

  {
    id: 'atom-phenylephrine-fetal-acidbase-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain why phenylephrine may better preserve fetal acid-base status during cesarean delivery under spinal anesthesia compared with ephedrine. Include the mechanism by which ephedrine affects the fetus differently and describe the typical phenylephrine dosing strategy.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Ephedrine crosses the placenta more readily than phenylephrine and stimulates fetal beta receptors, increasing fetal heart rate, metabolism, and oxygen consumption; this elevated metabolic demand can produce fetal lactic acidosis and lower umbilical artery pH values' },  // source: ap1-w3-023
        { id: 'kp2', weight: 2, description: 'Phenylephrine is a direct alpha-1 agonist (50 to 100 mcg bolus or 20 to 100 mcg/min infusion) that restores maternal blood pressure through vasoconstriction with minimal placental transfer and fetal metabolic stimulation; at appropriate doses it maintains uteroplacental perfusion while preserving fetal pH' },  // source: ap1-w3-024, ap1-w3-023
        { id: 'kp3', weight: 1, description: 'Phenylephrine commonly produces reflex bradycardia via the baroreceptor response; this is expected and generally well tolerated in healthy parturients' },  // source: ap1-w3-024
      ],
      common_errors: [
        'Claiming phenylephrine reduces uteroplacental blood flow dangerously; evidence shows it maintains perfusion at appropriate doses',
        'Stating that ephedrine is always the preferred obstetric vasopressor; current practice favors phenylephrine infusions as first-line',
      ],
      minimum_passing_score: 60,
    },
    topic: 'obstetric-vasopressors',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 15, Vandivier lecture', topic: 'obstetric-vasopressors' },
  },

  // ── Atoms feeding r-ap1-w3-3 (Inotrope Selection) ───────────────────────

  {
    id: 'atom-dobutamine-beta1-tachyphylaxis-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain the mechanism by which prolonged dobutamine infusion leads to tachyphylaxis. Describe the cellular process of beta-1 receptor downregulation, the typical timeline, and how this differs from the rapid NE store depletion that causes ephedrine tachyphylaxis.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Dobutamine tachyphylaxis occurs after approximately 72 hours of continuous infusion; chronic beta-1 stimulation triggers the cell to phosphorylate, internalize, and decrease synthesis of beta-1 receptors (receptor downregulation); fewer surface receptors means less adenylyl cyclase activation and less cAMP production per dose of dobutamine' },  // source: ap1-w3-020
        { id: 'kp2', weight: 2, description: 'This is fundamentally different from ephedrine tachyphylaxis: ephedrine depletes presynaptic NE stores within minutes to hours (a neurotransmitter supply problem), while dobutamine downregulates the receptor over days (a receptor density problem); the distinction determines management: switch to a direct agent for NE depletion, switch to a beta-independent agent (milrinone) for receptor downregulation' },  // source: ap1-w3-022, ap1-w3-020
      ],
      common_errors: [
        'Confusing beta-1 receptor downregulation (days) with NE store depletion (minutes); the two mechanisms operate on completely different timescales',
        'Stating that increasing the dobutamine dose indefinitely can overcome tachyphylaxis; at some point, switching to milrinone (which bypasses the receptor) is necessary',
      ],
      minimum_passing_score: 60,
    },
    topic: 'inotrope-selection',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 15, Vandivier lecture', topic: 'inotrope-selection' },
  },

  {
    id: 'atom-milrinone-camp-independence-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain why milrinone increases cardiac contractility even in patients on beta-blockers. Describe the specific intracellular signaling step where milrinone acts, why this bypasses beta-receptor blockade, and state why chronic oral PDE III inhibitor therapy is contraindicated despite acute hemodynamic benefits.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Milrinone inhibits phosphodiesterase III (PDE III), the enzyme that degrades cyclic AMP (cAMP) inside cardiac myocytes and vascular smooth muscle; by preventing cAMP breakdown, milrinone increases intracellular cAMP levels, which activates protein kinase A and increases calcium availability for contraction (inotropy) while simultaneously relaxing vascular smooth muscle (vasodilation)' },  // source: ap1-w3-033
        { id: 'kp2', weight: 2, description: 'This mechanism is completely independent of beta receptors because milrinone acts DOWNSTREAM of the receptor at the level of the second messenger (cAMP); beta-blockers prevent receptor activation of adenylyl cyclase, but milrinone preserves the cAMP that has already been produced; this is why milrinone works in beta-blocked, beta-downregulated, and catecholamine-resistant patients' },  // source: ap1-w3-034
        { id: 'kp3', weight: 1, description: 'Despite acute hemodynamic benefits, chronic oral PDE III inhibitor therapy (milrinone or amrinone) paradoxically increases morbidity and mortality in heart failure trials, restricting their use to short-term IV administration only' },  // source: ap1-w3-035
      ],
      common_errors: [
        'Stating that milrinone activates beta receptors or displaces beta-blockers; milrinone has zero interaction with any adrenergic receptor',
        'Confusing PDE III (cardiac/vascular, degrades cAMP) with PDE V (vascular, degrades cGMP, targeted by sildenafil)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'inotrope-selection',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 15, Vandivier lecture', topic: 'inotrope-selection' },
  },

  // ── Atoms feeding r-ap1-w3-4 (Digoxin Toxicity) ─────────────────────────

  {
    id: 'atom-digoxin-hypokalemia-toxicity-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain the molecular mechanism by which hypokalemia potentiates digoxin toxicity. Identify the specific enzyme where potassium and digoxin compete, describe the intracellular cascade that leads to toxic calcium accumulation, and explain why DC cardioversion is contraindicated during digoxin toxicity.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Potassium and digoxin compete for the SAME binding site on the extracellular face of the Na-K ATPase pump; when serum potassium is low, fewer potassium ions occupy this site, allowing more digoxin molecules to bind; increased digoxin binding means increased Na-K ATPase inhibition, leading to intracellular sodium accumulation that reverses the Na/Ca exchanger, flooding the cell with calcium and causing arrhythmias' },  // source: ap1-w3-031
        { id: 'kp2', weight: 2, description: 'DC cardioversion during digoxin toxicity can precipitate ventricular fibrillation because the already-elevated intracellular calcium creates a substrate for lethal reentrant arrhythmias when combined with the electrical energy of the shock; if cardioversion is absolutely necessary, use the lowest effective energy and optimize potassium and magnesium first' },  // source: ap1-w3-032
        { id: 'kp3', weight: 1, description: 'Diuretics that waste potassium (loop diuretics like furosemide, thiazides) are the most common precipitant of digoxin toxicity because they chronically lower serum potassium, increasing digoxin binding to the Na-K ATPase pump' },  // source: ap1-w3-031
      ],
      common_errors: [
        'Describing the potassium-digoxin interaction as affecting drug metabolism or renal clearance; the interaction is at the target enzyme binding site',
        'Stating that hyperkalemia potentiates digoxin toxicity; it is HYPOkalemia that increases toxicity by reducing competition for the binding site',
      ],
      minimum_passing_score: 60,
    },
    topic: 'digoxin-toxicity',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 15, Vandivier lecture', topic: 'digoxin-toxicity' },
  },

  {
    id: 'atom-ionized-calcium-transfusion-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain why ionized (free) calcium is the only biologically active form, describe how citrate preservative in stored blood products chelates ionized calcium during massive transfusion, and explain how changes in blood pH (acidosis versus alkalosis) shift the ratio of ionized to protein-bound calcium.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Only ionized (free) calcium (~45% of total serum calcium) is biologically active, directly affecting cardiac contractility, neuromuscular excitability, and coagulation; protein-bound calcium (~40%) and complexed calcium (~15%) are physiologically inert reservoirs' },  // source: ap1-w3-036
        { id: 'kp2', weight: 2, description: 'Citrate anticoagulant in stored blood products chelates (binds) ionized calcium in the recipient, reducing the active fraction; rapid or massive transfusion can overwhelm the liver capacity to metabolize citrate, causing symptomatic hypocalcemia with hypotension, decreased contractility, prolonged QT, and coagulopathy' },  // source: ap1-w3-037
        { id: 'kp3', weight: 1, description: 'Acidosis increases ionized calcium because hydrogen ions displace calcium from albumin binding sites; alkalosis decreases ionized calcium because fewer hydrogen ions allow more calcium to bind albumin; this means correcting acidosis in a transfused patient can unmask or worsen hypocalcemia' },  // source: ap1-w3-037
      ],
      common_errors: [
        'Monitoring total serum calcium instead of ionized calcium during massive transfusion; total calcium can appear normal while ionized fraction is dangerously low',
        'Forgetting that correcting acidosis (with bicarbonate) shifts calcium onto albumin, potentially dropping ionized calcium further',
      ],
      minimum_passing_score: 60,
    },
    topic: 'digoxin-toxicity',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 15, Vandivier lecture', topic: 'digoxin-toxicity' },
  },

  // ── Atoms feeding r-ap1-w3-5 (Beta-Blocker Pharmacology) ────────────────

  {
    id: 'atom-esmolol-rbc-esterase-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain why esmolol is the preferred beta-blocker for acute perioperative heart rate control. Describe its unique metabolism by red blood cell esterases, why this makes its clearance independent of hepatic and renal function, and state its pharmacokinetic parameters (half-life, onset, duration).',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Esmolol is a beta-1 selective blocker that is rapidly hydrolyzed by esterases located in red blood cells (not plasma cholinesterase and not hepatic enzymes) to an inactive acid metabolite; this means its clearance does not depend on hepatic or renal function, making it safe in patients with organ dysfunction' },  // source: ap1-w3-043
        { id: 'kp2', weight: 1, description: 'Pharmacokinetic parameters: half-life approximately 9 minutes, onset approximately 5 minutes, duration 10 to 30 minutes; this ultra-short profile allows precise titration for acute events like laryngoscopy-induced tachycardia, emergence hypertension, or intraoperative SVT' },  // source: ap1-w3-043
        { id: 'kp3', weight: 1, description: 'As a beta-1 selective agent, esmolol spares beta-2 bronchodilatory receptors at therapeutic doses, making it safer than propranolol in patients with reactive airway disease; however, selectivity is dose-dependent and can be lost at high doses' },  // source: ap1-w3-045
      ],
      common_errors: [
        'Stating that esmolol is metabolized by plasma cholinesterase (pseudocholinesterase); it is metabolized by a different esterase system in red blood cells',
        'Assuming esmolol is completely safe in asthmatics; beta-1 selectivity is dose-dependent and can be overwhelmed at high doses',
      ],
      minimum_passing_score: 60,
    },
    topic: 'beta-blocker-pharmacology',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 19, Vandivier lecture', topic: 'beta-blocker-pharmacology' },
  },

  {
    id: 'atom-cocaine-unopposed-alpha-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain why administering an isolated beta-blocker to a cocaine-intoxicated patient is dangerous. Describe how cocaine produces its sympathomimetic effects, explain the concept of unopposed alpha-mediated coronary vasospasm, and identify the safer alternative agents for managing cocaine-induced hypertension.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Cocaine blocks norepinephrine reuptake at sympathetic nerve terminals, producing simultaneous alpha-1 (vasoconstriction) and beta (tachycardia, vasodilation) adrenergic stimulation; giving an isolated beta-blocker removes the beta-2 vasodilatory component while leaving alpha-1 vasoconstriction completely unopposed; this worsens systemic hypertension and, critically, causes coronary artery vasospasm that can trigger acute myocardial infarction' },  // source: ap1-w3-044
        { id: 'kp2', weight: 1, description: 'Safe alternatives: labetalol (combined alpha-1 plus nonselective beta blocker) provides balanced blockade; benzodiazepines reduce central sympathetic drive; phentolamine provides alpha-blockade if needed; any of these avoid the unopposed alpha problem that isolated beta-blockade creates' },  // source: ap1-w3-044
        { id: 'kp3', weight: 1, description: 'The principle of unopposed alpha after beta-blockade applies beyond cocaine toxicity: it is the same reason alpha-blockade must precede beta-blockade in pheochromocytoma management' },  // source: ap1-w3-044, ap1-w3-047
      ],
      common_errors: [
        'Recommending propranolol or esmolol alone for cocaine hypertension; isolated beta-blockade is the MOST dangerous choice because it creates unopposed alpha',
        'Confusing cocaine mechanism with amphetamine mechanism; cocaine primarily blocks reuptake while amphetamines primarily release stored catecholamines',
      ],
      minimum_passing_score: 60,
    },
    topic: 'beta-blocker-pharmacology',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 19, Vandivier lecture', topic: 'beta-blocker-pharmacology' },
  },

  // ── Atoms feeding r-ap1-w3-6 (Alpha-2 Agonists) ─────────────────────────

  {
    id: 'atom-clonidine-rebound-htn-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain the receptor-level mechanism that produces rebound hypertension and tachycardia when clonidine is abruptly discontinued. Include the role of receptor upregulation during chronic therapy and describe the perioperative management strategy when oral clonidine cannot be continued.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Chronic clonidine therapy provides continuous alpha-2 agonism that suppresses central sympathetic outflow; the body compensates by upregulating adrenergic receptors (increasing receptor number and sensitivity); when clonidine is abruptly removed, the upregulated receptors are now exposed to normal circulating catecholamine levels, producing an exaggerated sympathetic response with severe hypertension and tachycardia' },  // source: ap1-w3-038
        { id: 'kp2', weight: 1, description: 'Clonidine has a half-life of 12 to 16 hours and is available in oral, IV, and transdermal formulations; perioperatively, if oral dosing is not possible (NPO, intubation), a transdermal patch (which takes 48 hours to reach therapeutic levels, so it should be applied preoperatively) must be used to prevent withdrawal' },  // source: ap1-w3-038
        { id: 'kp3', weight: 1, description: 'This withdrawal mechanism (receptor upregulation from chronic suppression) is conceptually identical to the receptor regulation principles from Week 1: chronic agonist exposure causes downregulation, chronic suppression of a pathway causes upregulation of receptors in that pathway' },  // cross-feed to wk-1 concepts
      ],
      common_errors: [
        'Attributing rebound to drug accumulation or direct toxicity; the mechanism is receptor upregulation following withdrawal of chronic suppression',
        'Assuming that skipping one dose is safe; the rebound can begin within 18 to 24 hours of the last dose',
      ],
      minimum_passing_score: 60,
    },
    topic: 'alpha2-agonists',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 19, Vandivier lecture', topic: 'alpha2-agonists' },
  },

  {
    id: 'atom-dex-1600-selectivity-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Compare the alpha-2 to alpha-1 selectivity ratios of dexmedetomidine and clonidine, and explain the paradoxical hypertension with bradycardia that occurs with a rapid IV bolus of dexmedetomidine. Identify the specific receptor subtype responsible and describe how to avoid this response clinically.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Dexmedetomidine has an alpha-2 to alpha-1 selectivity ratio of approximately 1600:1, which is about eight times more selective than clonidine at approximately 200:1; this high selectivity produces sedation, analgesia, and sympatholysis at therapeutic doses with notably minimal respiratory depression' },  // source: ap1-w3-039
        { id: 'kp2', weight: 2, description: 'Paradoxical response to rapid bolus: a fast IV bolus activates peripheral alpha-2B receptors on vascular smooth muscle, causing direct vasoconstriction and transient hypertension; the baroreceptor reflex then produces compensatory bradycardia; this is paradoxical because the expected steady-state effects are hypotension and sedation from central alpha-2A receptor activation' },  // source: ap1-w3-040
        { id: 'kp3', weight: 1, description: 'To avoid the paradoxical response: administer loading doses slowly over 10 minutes, or omit the loading dose entirely and begin a maintenance infusion at 0.2 to 0.7 mcg/kg/hr; the half-life is approximately 2 hours' },  // source: ap1-w3-040
      ],
      common_errors: [
        'Confusing the alpha-2B peripheral vascular receptor (vasoconstriction) with the alpha-2A central receptor (sedation and sympatholysis); the paradox occurs because two different receptor subtypes in different locations produce opposite vascular effects',
        'Stating that dexmedetomidine causes significant respiratory depression like opioids; it provides sedation with preserved respiratory drive, which is a key clinical advantage',
      ],
      minimum_passing_score: 60,
    },
    topic: 'alpha2-agonists',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 19, Vandivier lecture', topic: 'alpha2-agonists' },
  },

  // ── Atoms feeding r-ap1-w3-7 (CCB Classification) ───────────────────────

  {
    id: 'atom-verapamil-wpw-danger-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain why verapamil and other AV nodal blocking agents are contraindicated in Wolff-Parkinson-White syndrome with atrial fibrillation. Describe how blocking the AV node redirects impulses through the accessory pathway and identify the preferred antiarrhythmic alternative.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'In WPW, an accessory bypass tract (Bundle of Kent) connects the atria and ventricles outside the AV node; verapamil slows AV nodal conduction but does NOT slow the accessory pathway; during atrial fibrillation, blocking the AV node forces the rapid (300 to 600 per minute) atrial impulses to conduct preferentially through the unblocked accessory pathway to the ventricles' },  // source: ap1-w3-048
        { id: 'kp2', weight: 2, description: 'The accessory pathway can conduct much faster than the AV node, so unrestricted conduction can produce ventricular rates exceeding 250 per minute, degenerating into ventricular fibrillation and cardiac arrest; ALL AV nodal blockers are contraindicated in WPW with AF: verapamil, diltiazem, digoxin, and adenosine' },  // source: ap1-w3-048
        { id: 'kp3', weight: 1, description: 'Procainamide is the preferred antiarrhythmic because it slows conduction through the accessory pathway (not just the AV node), reducing the ventricular rate safely' },  // source: ap1-w3-048
      ],
      common_errors: [
        'Confusing rate control drugs (which slow the AV node and are dangerous in WPW) with rhythm control drugs (which slow the accessory pathway and are safe)',
        'Administering adenosine for SVT in a known WPW patient with atrial fibrillation; adenosine blocks the AV node and can trigger the same lethal pathway acceleration',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ccb-classification',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 19, Vandivier lecture', topic: 'ccb-classification' },
  },

  {
    id: 'atom-ccb-nmb-potentiation-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain how calcium channel blockers potentiate neuromuscular blocking agents during anesthesia. Describe the role of calcium in acetylcholine release at the neuromuscular junction, state whether both depolarizing and nondepolarizing agents are affected, and describe the monitoring implications.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Acetylcholine release at the neuromuscular junction requires calcium entry into the presynaptic motor nerve terminal; calcium triggers vesicle fusion with the presynaptic membrane and ACh exocytosis; calcium channel blockers reduce this calcium entry, decreasing ACh release and enhancing the neuromuscular block produced by NMB agents' },  // source: ap1-w3-050
        { id: 'kp2', weight: 1, description: 'BOTH depolarizing (succinylcholine) and nondepolarizing (rocuronium, vecuronium, cisatracurium) NMB agents are potentiated by CCBs; the reduced ACh release creates a lower baseline of neuromuscular transmission that the blocking agents further depress' },  // source: ap1-w3-050
        { id: 'kp3', weight: 1, description: 'Clinical implication: patients on chronic CCB therapy (verapamil, diltiazem, nifedipine) receiving NMB agents may exhibit deeper and longer-lasting neuromuscular block than expected; quantitative train-of-four monitoring (acceleromyography) is essential to detect residual paralysis before extubation' },  // source: ap1-w3-050
      ],
      common_errors: [
        'Stating that only nondepolarizing agents are potentiated; both NMB classes are affected because the mechanism (reduced ACh release) affects all neuromuscular transmission',
        'Confusing the CCB-NMB interaction (presynaptic calcium reduction) with the beta agonist reversal of CCB cardiovascular effects (via cAMP mechanism); these are different pathways',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ccb-classification',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 19, Vandivier lecture', topic: 'ccb-classification' },
  },

  // ── Atoms feeding r-ap1-w3-8 (Vasodilator Pharmacology) ─────────────────

  {
    id: 'atom-ino-hemoglobin-selective-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain the mechanism that makes inhaled nitric oxide a selective pulmonary vasodilator. Describe the intracellular signaling pathway it activates, how hemoglobin provides the selectivity, and state its half-life in blood and primary clinical indications.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Inhaled NO is delivered to ventilated alveoli, diffuses into adjacent pulmonary vascular smooth muscle, and activates soluble guanylate cyclase to increase cGMP, which relaxes smooth muscle via protein kinase G activation and calcium sequestration; NO activates the SAME pathway in ALL vascular beds, so selectivity does NOT come from lung-specific receptors' },  // source: ap1-w3-055
        { id: 'kp2', weight: 2, description: 'Selectivity comes from rapid hemoglobin inactivation: when NO diffuses from pulmonary smooth muscle into pulmonary capillary blood, hemoglobin binds it with extremely high affinity (forming methemoglobin and nitrate), inactivating it within seconds; the half-life of NO in blood is less than 5 seconds, preventing any systemic vasodilation' },  // source: ap1-w3-055
        { id: 'kp3', weight: 1, description: 'Clinical indications include persistent pulmonary hypertension of the newborn (PPHN), acute pulmonary hypertension in adults, and RV failure; limitations include methemoglobinemia with high concentrations and rebound pulmonary hypertension on abrupt discontinuation' },  // source: ap1-w3-055
      ],
      common_errors: [
        'Believing NO only activates receptors in the lungs; the guanylate cyclase pathway is identical in systemic vasculature, and selectivity comes entirely from the route of delivery plus hemoglobin inactivation',
        'Confusing inhaled NO (selective pulmonary vasodilator) with oral nitrates or nitroprusside (systemic vasodilators that also release NO)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'vasodilator-pharmacology',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 18, Vandivier lecture', topic: 'vasodilator-pharmacology' },
  },

  {
    id: 'atom-ntg-venous-preload-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain why nitroglycerin at standard therapeutic doses is described as primarily a venodilator rather than an arteriolar dilator. Describe how venous capacitance vessel dilation reduces cardiac preload and myocardial oxygen demand, and identify the two preload-dependent cardiac conditions where nitroglycerin is contraindicated.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'At standard therapeutic doses, nitroglycerin preferentially relaxes venous capacitance vessels (veins and venules) over arterioles; venodilation pools blood in the venous system, decreasing venous return to the heart and reducing left ventricular end-diastolic pressure (preload); lower preload decreases ventricular wall stress and myocardial oxygen demand via the LaPlace relationship' },  // source: ap1-w3-057
        { id: 'kp2', weight: 1, description: 'NTG also dilates coronary arteries, improving myocardial oxygen supply; this dual benefit (reduced demand plus improved supply) makes it the agent of choice for acute coronary syndromes and angina; at higher doses, arteriolar dilation also occurs, reducing afterload' },  // source: ap1-w3-057
        { id: 'kp3', weight: 2, description: 'Nitroglycerin is contraindicated in two preload-dependent conditions: (1) hypertrophic obstructive cardiomyopathy (HOCM), where reduced preload worsens left ventricular outflow tract obstruction by allowing the interventricular septum to move closer to the mitral valve; and (2) severe aortic stenosis, where maintaining adequate preload is essential to generate sufficient pressure gradient across the stenotic valve' },  // source: ap1-w3-057
      ],
      common_errors: [
        'Stating NTG primarily dilates arterioles; at standard doses the dominant effect is venodilation, and arteriolar dilation becomes significant only at higher doses',
        'Using NTG to lower blood pressure in a patient with known HOCM; the preload reduction can cause acute hemodynamic collapse from dynamic outflow obstruction',
      ],
      minimum_passing_score: 60,
    },
    topic: 'vasodilator-pharmacology',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 18, Vandivier lecture', topic: 'vasodilator-pharmacology' },
  },

  // ── Atoms feeding r-ap1-w3-9 (RAAS Perioperative) ───────────────────────

  {
    id: 'atom-ace-bradykinin-cough-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain the dual enzymatic function of angiotensin-converting enzyme, describe how ACE inhibition leads to bradykinin accumulation that causes dry cough and angioedema, and explain at the molecular level why switching to an ARB eliminates the cough while maintaining the antihypertensive effect.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'ACE has two critical functions: (1) it converts the inactive angiotensin I to the potent vasoconstrictor angiotensin II, which also stimulates aldosterone release; and (2) it degrades bradykinin, an inflammatory peptide that causes vasodilation, increased vascular permeability, and airway irritation; ACE inhibitors block BOTH functions simultaneously' },  // source: ap1-w3-052
        { id: 'kp2', weight: 1, description: 'When ACE is inhibited, bradykinin accumulates in the airways and lungs because its degradation pathway is blocked; this excess bradykinin stimulates C-fiber sensory nerves in the airway epithelium, producing a persistent dry cough in 5% to 20% of patients and rarely life-threatening angioedema' },  // source: ap1-w3-052
        { id: 'kp3', weight: 2, description: 'ARBs (losartan, valsartan) block the angiotensin II type 1 (AT1) receptor directly WITHOUT inhibiting ACE; because the ACE enzyme remains active, bradykinin is degraded normally and the cough does not occur; ARBs still provide the antihypertensive benefit by blocking the downstream vasoconstrictor and aldosterone effects of angiotensin II' },  // source: ap1-w3-053
      ],
      common_errors: [
        'Attributing ACE inhibitor cough to drug allergy or irritation rather than the specific molecular mechanism of bradykinin accumulation',
        'Stating that ARBs also cause cough; the cough is specific to ACE inhibitors because only they block bradykinin degradation',
      ],
      minimum_passing_score: 60,
    },
    topic: 'raas-perioperative',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 20, Vandivier lecture', topic: 'raas-perioperative' },
  },

  {
    id: 'atom-raas-periop-hypotension-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain why patients on ACE inhibitors or ARBs are at high risk for refractory intraoperative hypotension. Describe the normal role of the RAAS as a compensatory mechanism during anesthesia, why standard catecholamine vasopressors may fail, and identify the specific rescue agent that works through a non-adrenergic, non-RAAS pathway.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'During anesthesia, vasodilation and reduced preload normally activate the RAAS: renin converts angiotensinogen to angiotensin I, ACE converts it to angiotensin II (vasoconstrictor), and aldosterone retains sodium and water; ACE inhibitors and ARBs block this entire compensatory cascade, leaving the patient unable to mount a normal blood pressure recovery' },  // source: ap1-w3-054
        { id: 'kp2', weight: 1, description: 'Standard catecholamine vasopressors (phenylephrine, ephedrine, norepinephrine) may provide inadequate response because they work on adrenergic receptors, which is a separate pathway from the RAAS; the RAAS contribution to vascular tone is significant, and losing it creates a deficit that adrenergic stimulation alone may not fill' },  // source: ap1-w3-054
        { id: 'kp3', weight: 2, description: 'Vasopressin (V1 receptor agonist on vascular smooth muscle) works through a completely different mechanism (non-adrenergic, non-RAAS direct vasoconstriction) and is often the rescue agent that succeeds when catecholamines fail; many practitioners hold ACE inhibitors and ARBs 12 to 24 hours preoperatively to allow RAAS recovery before anesthesia' },  // source: ap1-w3-054
      ],
      common_errors: [
        'Simply giving more phenylephrine when it fails; recognizing the RAAS deficit and switching to vasopressin is the correct response',
        'Assuming perioperative hypotension from RAAS blockade is benign; it can be profound, refractory, and life-threatening without appropriate rescue',
      ],
      minimum_passing_score: 60,
    },
    topic: 'raas-perioperative',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 20, Vandivier lecture', topic: 'raas-perioperative' },
  },

  // ── Atoms feeding r-ap1-w3-10 (Labetalol / Sympathomimetic Classification) ──

  {
    id: 'atom-labetalol-alpha2-sparing-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain how labetalol lowers blood pressure while generally maintaining cardiac output. Identify which alpha receptor subtypes it blocks and which it spares, describe why preserving alpha-2 negative feedback prevents excessive reflex tachycardia, and state the IV beta-to-alpha blocking ratio.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Labetalol blocks alpha-1 receptors (producing arterial vasodilation and decreased SVR) AND nonselectively blocks beta receptors (reducing heart rate and contractility); cardiac output is maintained because alpha-1 vasodilation reduces afterload, offsetting the negative inotropic and chronotropic effects of beta blockade; the IV beta-to-alpha blocking ratio is approximately 7:1' },  // source: ap1-w3-046
        { id: 'kp2', weight: 2, description: 'Labetalol blocks alpha-1 but SPARES alpha-2 receptors; presynaptic alpha-2 receptors serve as a negative feedback loop that limits norepinephrine release from sympathetic nerve terminals; by preserving this feedback, labetalol prevents the excessive reflex tachycardia and NE surge seen with nonselective alpha blockers like phentolamine (which blocks both alpha-1 and alpha-2, removing the feedback brake)' },  // source: ap1-w3-047
        { id: 'kp3', weight: 1, description: 'Clinical uses include hypertensive emergencies (IV 20 to 80 mg every 10 minutes), perioperative hypertension, pheochromocytoma management, and clonidine withdrawal; labetalol half-life is 5 to 8 hours' },  // source: ap1-w3-046, ap1-w3-047
      ],
      common_errors: [
        'Stating that labetalol blocks both alpha-1 and alpha-2; it specifically spares alpha-2 presynaptic receptors to preserve the NE release feedback loop',
        'Confusing the alpha-2 sparing property (prevents reflex tachycardia) with alpha-2 agonism (direct sympatholysis, as with clonidine and dexmedetomidine)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'labetalol-sympathomimetic-classification',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 19, Vandivier lecture', topic: 'labetalol-sympathomimetic-classification' },
  },

  {
    id: 'atom-beta2-comt-resistance-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Explain why selective beta-2 agonists (albuterol, terbutaline) have a longer duration of action than endogenous catecholamines. Identify the structural difference that confers resistance to COMT, and describe two beta-2 mediated side effects that share the same mechanism as epinephrine-induced hypokalemia.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Selective beta-2 agonists are noncatecholamines: they lack the catechol ring (3,4-dihydroxyphenyl group) present in endogenous catecholamines; COMT (catechol-O-methyltransferase) requires the catechol ring as its substrate, so noncatecholamines are resistant to COMT degradation; this structural resistance prolongs the duration of action compared with epinephrine and norepinephrine, which are rapidly inactivated by both COMT and MAO' },  // source: ap1-w3-027
        { id: 'kp2', weight: 1, description: 'Beta-2 agonist hypokalemia: beta-2 receptor activation on skeletal muscle stimulates the Na-K ATPase pump, driving potassium intracellularly; this is the identical mechanism to epinephrine-induced hypokalemia; this side effect is clinically important in patients on digoxin because hypokalemia potentiates digoxin toxicity' },  // source: ap1-w3-029, ap1-w3-003
        { id: 'kp3', weight: 1, description: 'Beta-2 agonist skeletal muscle tremor: beta-2 receptors on skeletal muscle fibers directly enhance contractile protein activation, producing fine tremor; this is a separate mechanism from the Na-K ATPase hypokalemia effect, though both occur through beta-2 receptors on skeletal muscle' },  // source: ap1-w3-029
      ],
      common_errors: [
        'Confusing COMT resistance (structural, due to absent catechol ring) with MAO resistance (a separate metabolic pathway); both contribute to prolonged duration but through different mechanisms',
        'Attributing beta-2 agonist hypokalemia to renal potassium wasting; the mechanism is intracellular potassium shift via Na-K ATPase activation, not renal loss',
      ],
      minimum_passing_score: 60,
    },
    topic: 'labetalol-sympathomimetic-classification',
    chapter: 'ap1-wk-3',
    difficulty: 1,
    metadata: { priority: 'standard', source: 'Stoelting Ch 15, Vandivier lecture', topic: 'labetalol-sympathomimetic-classification' },
  },

  // ── Atoms for patho-node-15 (Urine Concentration & Electrolyte Regulation, Ch 29–30) ──

  {
    id: 'atom-p1n15-countercurrent-single-effect',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Describe the "single effect" of the countercurrent multiplier. Name the key transporter, its location, and explain how the hairpin geometry multiplies this effect to build the medullary gradient.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The NKCC2 (Na/K/2Cl) cotransporter on the luminal membrane of the thick ascending limb actively transports NaCl out of the tubular lumen into the medullary interstitium. Because the thick ascending limb is constitutively impermeable to water, solute removal without water loss creates a concentration difference of approximately 200 mOsm/L between the tubular fluid and the adjacent interstitium at each horizontal level. This concentration difference at a single level is called the "single effect."' },
        { id: 'kp2', weight: 1, description: 'The U-shaped (hairpin) geometry of the loop of Henle multiplies the single effect along its entire length. Concentrated interstitial fluid at one level draws water out of the adjacent descending limb (which is water permeable), concentrating that fluid further. As this more concentrated fluid rounds the bend and enters the ascending limb, more NaCl is pumped out, adding to the interstitial osmolarity at deeper levels. This cascading process builds a progressive corticomedullary gradient from 300 mOsm/L at the cortex to approximately 1200 mOsm/L at the papillary tip.' },
        { id: 'kp3', weight: 1, description: 'NKCC2 is the pharmacologic target of loop diuretics (furosemide, bumetanide, ethacrynic acid). Blocking NKCC2 abolishes the single effect, prevents medullary gradient formation, and severely impairs the kidney s ability to concentrate urine. This explains why patients on loop diuretics produce dilute, high volume urine regardless of their ADH status and are at risk for dehydration and electrolyte depletion.' },
      ],
      common_errors: [
        'Confusing the countercurrent multiplier (loop of Henle, active NaCl transport) with the countercurrent exchanger (vasa recta, passive equilibration)',
        'Stating that the ascending limb is permeable to water (it is constitutively impermeable)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'countercurrent-multiplier',
    chapter: 'patho-node-15',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 29', topic: 'countercurrent-multiplier' },
  },

  {
    id: 'atom-p1n15-adh-aqp2-mechanism',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Explain the cellular mechanism by which ADH increases water permeability in the collecting duct. Include the receptor, the intracellular signaling pathway, and the water channel involved.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'ADH (vasopressin) binds to V2 receptors on the basolateral membrane of principal cells in the late distal tubule and medullary collecting duct. V2 receptor activation stimulates adenylyl cyclase, increasing intracellular cyclic AMP (cAMP). The elevated cAMP activates protein kinase A, which phosphorylates aquaporin 2 (AQP2) water channels stored in intracellular vesicles and triggers their insertion (exocytic fusion) into the luminal (apical) membrane of the cell.' },
        { id: 'kp2', weight: 1, description: 'Once AQP2 channels are present in the luminal membrane, water moves by osmosis from the hypotonic tubular fluid into the cell and then exits through constitutively expressed AQP3 and AQP4 channels on the basolateral membrane into the hypertonic medullary interstitium. The rate of water reabsorption depends on the number of AQP2 channels inserted and the osmotic gradient across the epithelium. Without ADH, AQP2 channels are endocytosed back into vesicles and the collecting duct becomes virtually impermeable to water.' },
      ],
      common_errors: [
        'Stating ADH acts through V1 receptors in the kidney (V1 receptors mediate vasoconstriction; V2 receptors mediate the antidiuretic effect)',
        'Confusing AQP2 (ADH regulated, luminal) with AQP1 (constitutive, found in proximal tubule and descending limb)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'adh-aqp2-mechanism',
    chapter: 'patho-node-15',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 29', topic: 'adh-aqp2-mechanism' },
  },

  {
    id: 'atom-p1n15-osmotic-adh-stimulus',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Describe the osmotic pathway for ADH regulation. Where are osmoreceptors located, what threshold change triggers ADH release, and why is this the most sensitive stimulus for ADH secretion?',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Osmoreceptors are specialized neurons located in the anterior hypothalamus, near the supraoptic nucleus. They detect changes in plasma osmolarity by swelling (when osmolarity decreases) or shrinking (when osmolarity increases). When these cells shrink due to increased ECF osmolarity, their firing rate increases, which stimulates ADH release from the posterior pituitary. The osmotic threshold for ADH release is approximately 280 mOsm/L, and changes as small as 1 to 2% in plasma osmolarity (approximately 2 to 3 mOsm/L) significantly alter ADH secretion.' },
        { id: 'kp2', weight: 1, description: 'The osmotic pathway is the most sensitive ADH stimulus because it requires only a 1 to 2% change in osmolarity to produce measurable changes in ADH levels. In contrast, hemodynamic stimuli (decreased blood volume or blood pressure) require 5 to 10% changes before they significantly affect ADH secretion. This exquisite sensitivity allows the osmoreceptor-ADH system to maintain plasma osmolarity within a very narrow range (280 to 295 mOsm/L) under normal daily conditions.' },
      ],
      common_errors: [
        'Stating osmoreceptors are located in the posterior pituitary (they are in the anterior hypothalamus; the posterior pituitary is the site of ADH release)',
        'Claiming hemodynamic stimuli are more sensitive than osmotic stimuli for ADH release',
      ],
      minimum_passing_score: 60,
    },
    topic: 'osmoreceptor-adh-pathway',
    chapter: 'patho-node-15',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 29', topic: 'osmoreceptor-adh-pathway' },
  },

  {
    id: 'atom-p1n15-hemodynamic-adh-stimulus',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Explain how decreased blood volume and decreased blood pressure each stimulate ADH secretion. Identify the receptors involved and state the threshold magnitude of change required.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Decreased blood volume is detected by cardiopulmonary (low pressure) baroreceptors located in the cardiac atria and great veins (pulmonary vessels). These volume receptors send afferent signals via the vagus nerve to the hypothalamus. Normally, tonic vagal afferent input from stretched atria inhibits ADH release; when blood volume drops and atrial stretch decreases, this inhibitory input is removed, allowing ADH secretion to increase. Decreased blood pressure is sensed separately by arterial (high pressure) baroreceptors in the carotid sinus and aortic arch, which also signal the hypothalamus to increase ADH release.' },
        { id: 'kp2', weight: 1, description: 'Hemodynamic stimuli require a larger change (5 to 10% decrease in blood volume or blood pressure) before they significantly alter ADH levels, compared to only 1 to 2% for osmolarity changes. However, during severe hemorrhage or shock, the hemodynamic stimulus can produce extremely high ADH levels (much higher than osmotic stimuli alone), overriding the normal osmotic set point. This means that during hemorrhagic shock, the body will retain water and accept hyponatremia in order to defend blood volume.' },
      ],
      common_errors: [
        'Confusing cardiopulmonary baroreceptors (low pressure, sense volume) with arterial baroreceptors (high pressure, sense blood pressure)',
        'Stating that increased blood volume stimulates ADH (increased volume SUPPRESSES ADH by increasing atrial stretch)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'hemodynamic-adh-pathway',
    chapter: 'patho-node-15',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 29', topic: 'hemodynamic-adh-pathway' },
  },

  {
    id: 'atom-p1n15-adh-thirst-dominance',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Explain why the ADH-thirst osmoreceptor system, not the aldosterone system, is the dominant controller of plasma sodium concentration. Reference the experimental evidence from blocking studies.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The ADH-thirst osmoreceptor system controls plasma sodium concentration by adjusting water balance: when osmolarity rises, ADH increases water reabsorption (concentrating less water in the tubule) and thirst increases water intake, both of which dilute the ECF. Experimental blocking of this system causes plasma sodium to become highly sensitive to dietary sodium intake, with large swings in concentration as salt consumption varies. This proves that the ADH-thirst system is the primary defense against changes in sodium concentration.' },
        { id: 'kp2', weight: 1, description: 'The aldosterone system primarily controls sodium balance and ECF volume, not sodium concentration. Aldosterone adjusts both sodium and water reabsorption together (through its effects on the collecting duct), so it changes ECF volume without significantly altering the sodium concentration. Experimental blockade of aldosterone alone produces negligible changes in plasma sodium across a wide range of sodium intakes because the intact ADH-thirst system compensates. This demonstrates that water balance (controlled by ADH-thirst) determines concentration, while sodium balance (controlled by aldosterone) determines volume.' },
      ],
      common_errors: [
        'Stating aldosterone is the primary regulator of plasma sodium concentration (it regulates volume, not concentration)',
        'Confusing regulation of sodium concentration (osmolarity control, water balance) with regulation of total body sodium (volume control)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'adh-thirst-dominance',
    chapter: 'patho-node-15',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 29', topic: 'adh-thirst-dominance' },
  },

  {
    id: 'atom-p1n15-di-central-vs-nephrogenic',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Compare central and nephrogenic diabetes insipidus: the underlying defect, serum ADH levels, response to DDAVP, and one common cause of each type.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Central diabetes insipidus results from failure to produce or secrete ADH, usually due to damage to the hypothalamus or posterior pituitary from head trauma, pituitary surgery, tumors (craniopharyngioma), or autoimmune destruction. Serum ADH levels are low or undetectable. These patients respond to exogenous desmopressin (DDAVP, a synthetic V2 selective ADH analog) with a dramatic increase in urine osmolarity because their collecting duct V2 receptors and AQP2 machinery are intact and fully functional.' },
        { id: 'kp2', weight: 2, description: 'Nephrogenic diabetes insipidus occurs when the collecting duct fails to respond to ADH despite normal or elevated circulating ADH levels. The most common acquired cause is chronic lithium therapy, which interferes with AQP2 water channel expression and the V2 receptor signaling cascade. Genetic causes include mutations in the V2 receptor gene or the aquaporin 2 gene. Serum ADH is elevated because the intact hypothalamic-pituitary axis detects persistent dilute urine and attempts to compensate. DDAVP has little or no effect on urine concentration because the downstream signaling is impaired.' },
      ],
      common_errors: [
        'Confusing central DI (low ADH, responds to DDAVP) with nephrogenic DI (high ADH, does not respond to DDAVP)',
        'Forgetting that lithium is the single most common drug cause of nephrogenic diabetes insipidus',
      ],
      minimum_passing_score: 60,
    },
    topic: 'diabetes-insipidus',
    chapter: 'patho-node-15',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 29', topic: 'diabetes-insipidus' },
  },

  {
    id: 'atom-p1n15-k-distribution',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'State the normal distribution of potassium between intracellular and extracellular compartments, the normal plasma K+ range, and the pump that maintains this gradient. Explain why this distribution makes plasma K+ vulnerable to transcellular shifts.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Approximately 98% of total body potassium (about 3920 mEq) resides intracellularly at a concentration of approximately 140 mEq/L across 28 liters of intracellular fluid. Only about 2% (approximately 59 mEq) is in the extracellular fluid at a normal concentration of 3.5 to 5.0 mEq/L across 14 liters. The Na/K ATPase on cell membranes actively maintains this steep gradient by pumping 3 Na+ out and 2 K+ into the cell with each cycle, keeping intracellular K+ high and extracellular K+ low.' },
        { id: 'kp2', weight: 1, description: 'Because the extracellular K+ pool is extremely small (only 59 mEq), even minor transcellular shifts between the massive intracellular store and the tiny extracellular compartment can produce clinically dangerous changes in plasma K+ concentration. For example, releasing just 2% of the intracellular K+ store (about 78 mEq) into the ECF would more than double the extracellular K+ content, potentially causing fatal hyperkalemia. This vulnerability explains why factors like acidosis, beta blockade, cell lysis, and crush injuries can rapidly produce life-threatening K+ elevations.' },
      ],
      common_errors: [
        'Stating the normal plasma K+ range as 135 to 145 mEq/L (that is sodium; K+ is 3.5 to 5.0 mEq/L)',
        'Claiming K+ is evenly distributed between ICF and ECF (98% is intracellular)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'k-distribution',
    chapter: 'patho-node-15',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 30', topic: 'k-distribution' },
  },

  {
    id: 'atom-p1n15-k-shift-acidosis',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Explain the mechanism by which metabolic acidosis causes hyperkalemia. State the approximate quantitative relationship between pH change and K+ change, and describe what happens to K+ when the acidosis is corrected.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'In metabolic acidosis, excess H+ ions in the extracellular fluid move into cells to be buffered by intracellular proteins and phosphate buffer systems. To maintain electrical neutrality across the cell membrane, K+ ions are displaced from the intracellular compartment into the extracellular fluid. This transcellular shift raises plasma K+ without changing total body K+ stores. The approximate rule of thumb is that plasma K+ rises approximately 0.6 mEq/L for each 0.1 unit decrease in arterial pH (though this varies with the type and severity of the acidosis).' },
        { id: 'kp2', weight: 1, description: 'When the acidosis is corrected (for example, with bicarbonate infusion or treatment of the underlying cause), the reverse shift occurs: as pH rises, H+ exits cells and K+ returns to the intracellular compartment, lowering plasma K+. This is clinically important because a patient who appears to have normal or mildly elevated K+ during acidosis may actually be significantly total body K+ depleted (from renal losses, GI losses, etc.), and correcting the acidosis may unmask severe hypokalemia requiring aggressive K+ replacement. Conversely, alkalosis shifts K+ into cells and can worsen hypokalemia.' },
      ],
      common_errors: [
        'Stating that acidosis shifts K+ INTO cells (it shifts K+ OUT of cells, causing hyperkalemia)',
        'Forgetting that the transcellular shift is reversible and that correcting acidosis can unmask underlying K+ depletion',
      ],
      minimum_passing_score: 60,
    },
    topic: 'k-acid-base-shift',
    chapter: 'patho-node-15',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 30', topic: 'k-acid-base-shift' },
  },

  {
    id: 'atom-p1n15-principal-cell-k-secretion',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Describe the two-step mechanism by which principal cells in the cortical collecting duct secrete potassium into the tubular lumen. Name the channels on the luminal side and the pump on the basolateral side.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Step one: sodium enters the principal cell from the tubular lumen through the epithelial sodium channel (ENaC) on the apical (luminal) membrane. This Na+ entry is driven by the low intracellular Na+ concentration maintained by the basolateral Na/K ATPase. Na+ entry through ENaC makes the tubular lumen electrically negative relative to the cell interior, creating a favorable electrochemical gradient for K+ to exit the cell. Step two: K+ leaves the cell through ROMK (renal outer medullary K+) channels for basal K+ secretion and through BK (big conductance K+) channels that are specifically activated by increased tubular flow rate.' },
        { id: 'kp2', weight: 1, description: 'The basolateral Na/K ATPase is the energy source driving the entire process. It pumps 3 Na+ out of the cell and 2 K+ into the cell, simultaneously maintaining the low intracellular Na+ (which draws luminal Na+ through ENaC) and the high intracellular K+ (which provides the K+ available for luminal secretion through ROMK and BK channels). Aldosterone upregulates all three components: ENaC, Na/K ATPase, and ROMK channels, which is why aldosterone potently enhances K+ secretion.' },
      ],
      common_errors: [
        'Confusing principal cells (K+ secretion) with Type A intercalated cells (K+ reabsorption via H/K ATPase)',
        'Forgetting the role of luminal negativity created by ENaC mediated Na+ entry as the driving force for K+ secretion',
      ],
      minimum_passing_score: 60,
    },
    topic: 'principal-cell-k-secretion',
    chapter: 'patho-node-15',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 30', topic: 'principal-cell-k-secretion' },
  },

  {
    id: 'atom-p1n15-aldosterone-k-feedback',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Describe the negative feedback loop between plasma potassium and aldosterone. Explain how this feedback is independent of the renin-angiotensin system and what happens when this feedback fails (as in Addison disease).',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'When plasma K+ rises above normal (even by 1 to 2 mEq/L), the adrenal cortex zona glomerulosa cells directly sense the elevation and increase aldosterone synthesis and secretion. This is a direct effect of extracellular K+ on the adrenal gland, independent of the renin-angiotensin II pathway (which is the other major stimulus for aldosterone). The released aldosterone acts on principal cells to increase ENaC, Na/K ATPase, and ROMK expression, enhancing K+ secretion into the tubular lumen. As K+ secretion increases and plasma K+ returns to normal, the stimulus for aldosterone release diminishes, completing the negative feedback loop.' },
        { id: 'kp2', weight: 1, description: 'In Addison disease (primary adrenal insufficiency), the adrenal cortex is destroyed and cannot produce aldosterone regardless of the plasma K+ level. Without aldosterone, principal cells have reduced ENaC and Na/K ATPase expression, impairing K+ secretion. Plasma K+ rises progressively because the feedback loop is broken. This hyperkalemia can become life threatening if not treated with mineralocorticoid replacement (fludrocortisone). Addison disease also causes sodium wasting, hypotension, and metabolic acidosis due to loss of aldosterone and cortisol.' },
      ],
      common_errors: [
        'Stating that K+ stimulates renin release to trigger aldosterone (K+ acts directly on the adrenal cortex, independent of renin)',
        'Confusing Addison disease (adrenal insufficiency with hyperkalemia) with Conn syndrome (aldosterone excess with hypokalemia)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'aldosterone-k-feedback',
    chapter: 'patho-node-15',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 30', topic: 'aldosterone-k-feedback' },
  },

  {
    id: 'atom-p1n15-hyperkalemia-cardiac',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Describe the cardiac effects of severe hyperkalemia (>7.0 mEq/L). Explain the membrane potential mechanism and the classic ECG progression.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Severe hyperkalemia (>7.0 mEq/L) reduces the potassium concentration gradient across cardiac cell membranes. According to the Nernst equation, reducing this gradient makes the resting membrane potential less negative (partial depolarization). In normal cardiac cells the resting potential is approximately -90 mV; with severe hyperkalemia it may rise to -70 or -60 mV. This persistent depolarization progressively inactivates voltage-gated sodium channels (which require a negative resting potential to reset from their inactivated state), slowing conduction velocity and reducing action potential amplitude throughout the heart.' },
        { id: 'kp2', weight: 1, description: 'The ECG changes progress in a characteristic sequence as K+ rises: peaked/tented T waves (earliest sign, reflecting accelerated repolarization), prolonged PR interval, widened QRS complex (slowed ventricular conduction), loss of P waves (atrial standstill), and ultimately a sinusoidal (sine wave) pattern that degenerates into ventricular fibrillation or asystole. Calcium gluconate is the immediate treatment to stabilize the cardiac membrane by increasing the threshold potential, making the cell less excitable despite the depolarized resting potential.' },
      ],
      common_errors: [
        'Stating that hyperkalemia causes hyperpolarization (it causes depolarization by reducing the K+ gradient)',
        'Confusing the mechanism with hypokalemia, which hyperpolarizes cells and prolongs the QT interval',
      ],
      minimum_passing_score: 60,
    },
    topic: 'hyperkalemia-cardiac-effects',
    chapter: 'patho-node-15',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 30', topic: 'hyperkalemia-cardiac-effects' },
  },

  {
    id: 'atom-p1n15-hypokalemia-effects',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Describe the cardiac and neuromuscular effects of severe hypokalemia (<3.0 mEq/L). Explain the membrane potential mechanism and the key ECG findings.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Severe hypokalemia (<3.0 mEq/L) increases the K+ concentration gradient across cell membranes (more K+ inside relative to outside), making the resting membrane potential more negative (hyperpolarization). Hyperpolarized cells require a larger depolarizing stimulus to reach threshold for firing an action potential, making them less excitable. In skeletal muscle this produces weakness, fatigue, muscle cramps, and in severe cases respiratory muscle weakness leading to hypoventilation. In the most extreme cases, flaccid paralysis can occur.' },
        { id: 'kp2', weight: 1, description: 'Cardiac effects of severe hypokalemia include delayed ventricular repolarization (prolonged QT interval on ECG), flattened or inverted T waves, prominent U waves (a wave appearing after the T wave), ST segment depression, and increased susceptibility to arrhythmias including premature ventricular contractions and torsades de pointes (a polymorphic ventricular tachycardia associated with prolonged QT). Hypokalemia also increases sensitivity to digoxin toxicity because digoxin competes with K+ for binding to the Na/K ATPase.' },
      ],
      common_errors: [
        'Confusing hypokalemia effects (hyperpolarization, weakness, prolonged QT) with hyperkalemia effects (depolarization, peaked T waves)',
        'Attributing tetany to hypokalemia (tetany is caused by hypocalcemia; hypokalemia causes weakness)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'hypokalemia-effects',
    chapter: 'patho-node-15',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 30', topic: 'hypokalemia-effects' },
  },

  {
    id: 'atom-p1n15-pressure-natriuresis',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Define pressure natriuresis. Explain the mechanism by which increased arterial pressure increases renal sodium excretion and describe why the chronic curve is steeper than the acute curve.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Pressure natriuresis is the direct relationship between mean arterial pressure and renal sodium (and water) excretion: when arterial pressure rises, the kidney excretes more sodium and water. Acutely, the mechanism involves slightly increased GFR (despite autoregulatory buffering) and increased peritubular capillary hydrostatic pressure (which reduces the Starling forces favoring proximal tubule reabsorption). This feedback loop returns blood pressure toward normal by reducing ECF volume, blood volume, venous return, and cardiac output.' },
        { id: 'kp2', weight: 1, description: 'The chronic pressure natriuresis curve is substantially steeper than the acute curve because sustained increases in arterial pressure suppress the renin-angiotensin-aldosterone system. Decreased angiotensin II reduces Na/H exchanger activity in the proximal tubule (decreasing sodium reabsorption there), and decreased aldosterone reduces ENaC and Na/K ATPase expression in the collecting duct (decreasing distal sodium reabsorption). These hormonal changes amplify the direct pressure effect, making the chronic kidney far more responsive to pressure changes than the acute kidney.' },
      ],
      common_errors: [
        'Stating that renal autoregulation completely prevents GFR changes with pressure (autoregulation buffers but does not eliminate pressure effects)',
        'Forgetting that the chronic curve is steeper because RAAS suppression augments the direct pressure effect',
      ],
      minimum_passing_score: 60,
    },
    topic: 'pressure-natriuresis',
    chapter: 'patho-node-15',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 30', topic: 'pressure-natriuresis' },
  },

  {
    id: 'atom-p1n15-salt-sensitivity-shift',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Explain what a "rightward shift" of the pressure natriuresis curve means physiologically and how it causes salt-sensitive hypertension. Name two conditions that produce this shift.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'A rightward shift of the pressure natriuresis curve means the kidney requires a higher arterial pressure to excrete any given sodium load. At any given sodium intake, the equilibrium blood pressure (where the sodium intake line intersects the renal excretion curve) is higher than normal. When sodium intake increases in a person with a rightward-shifted curve, arterial pressure rises more than it would in a person with a normal curve, because a larger pressure increase is needed to drive sufficient sodium excretion. This is the definition of salt-sensitive hypertension.' },
        { id: 'kp2', weight: 1, description: 'Conditions that shift the curve rightward include loss of functional nephrons (chronic kidney disease from any cause, aging), because fewer nephrons must handle the same sodium load and require higher pressure to drive excretion. Elevated angiotensin II (as in renovascular hypertension from renal artery stenosis) shifts the curve rightward by increasing proximal tubule sodium reabsorption and stimulating aldosterone. Primary aldosteronism (Conn syndrome) also shifts the curve because autonomous aldosterone increases distal sodium reabsorption regardless of volume status.' },
      ],
      common_errors: [
        'Confusing a rightward shift (impaired excretion, hypertension) with a leftward shift (enhanced excretion, lower BP)',
        'Stating that salt sensitivity means the person simply eats too much salt (it is a renal excretory defect, not a dietary problem)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'salt-sensitivity',
    chapter: 'patho-node-15',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 30', topic: 'salt-sensitivity' },
  },

  {
    id: 'atom-p1n15-pth-three-actions',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'List and explain the three coordinated actions of parathyroid hormone (PTH) that raise plasma calcium. Include the target organ for each action.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Action 1 (kidney): PTH increases calcium reabsorption in the distal convoluted tubule, reducing urinary calcium loss and retaining more Ca2+ in the blood. Action 2 (bone): PTH stimulates osteoclast-mediated bone resorption, releasing calcium and phosphate from the mineralized bone matrix into the extracellular fluid. Action 3 (kidney then intestine): PTH activates renal 1-alpha-hydroxylase, which converts 25-hydroxyvitamin D (calcidiol) to active 1,25-dihydroxyvitamin D3 (calcitriol). Calcitriol then increases intestinal absorption of dietary calcium from the GI tract.' },
        { id: 'kp2', weight: 1, description: 'PTH also has a phosphaturic effect: it decreases phosphate reabsorption in the proximal tubule, increasing urinary phosphate excretion. This is physiologically important because bone resorption releases both calcium and phosphate; if phosphate levels rose along with calcium, the Ca2+ x PO4 product could exceed the solubility threshold and cause metastatic calcification (calcium phosphate deposition in soft tissues). By excreting phosphate while retaining calcium, PTH selectively raises calcium without risking ectopic calcification.' },
      ],
      common_errors: [
        'Stating PTH directly increases intestinal calcium absorption (PTH acts indirectly through vitamin D3 activation; it does not act on the intestine directly)',
        'Confusing PTH (raises calcium) with calcitonin (lowers calcium, released by thyroid C cells)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'pth-calcium-regulation',
    chapter: 'patho-node-15',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 30', topic: 'pth-calcium-regulation' },
  },

  {
    id: 'atom-p1n15-ckd-phosphate-cascade',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-1',
    nodeId: 'patho-node-15',
    prompt: 'Describe the pathophysiologic cascade in chronic kidney disease that leads from nephron loss to secondary hyperparathyroidism and renal osteodystrophy. Explain why vitamin D deficiency worsens this cascade.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'In CKD, progressive nephron loss impairs the kidneys ability to excrete phosphate, leading to hyperphosphatemia. Elevated serum phosphate complexes with ionized calcium in the blood, lowering plasma ionized Ca2+. The parathyroid glands detect this hypocalcemia via calcium-sensing receptors and increase PTH secretion in a compensatory response called secondary hyperparathyroidism. Chronically elevated PTH stimulates continuous osteoclastic bone resorption to maintain serum calcium, which over months to years leads to renal osteodystrophy (progressive weakening of bones with increased fracture risk, bone pain, and deformity).' },
        { id: 'kp2', weight: 1, description: 'CKD also impairs 1-alpha-hydroxylase activity in the remaining functional renal tubular cells, reducing conversion of 25-hydroxyvitamin D to active 1,25-dihydroxyvitamin D3 (calcitriol). Without adequate calcitriol, intestinal calcium absorption decreases, further worsening the hypocalcemia and amplifying the drive for PTH secretion. This creates a double insult: phosphate retention lowers calcium, and vitamin D deficiency prevents dietary calcium from being absorbed. The combination makes secondary hyperparathyroidism more severe and bone disease more progressive.' },
      ],
      common_errors: [
        'Confusing secondary hyperparathyroidism (compensatory PTH elevation from CKD) with primary hyperparathyroidism (autonomous PTH from parathyroid adenoma)',
        'Stating that PTH causes the hypocalcemia in CKD (PTH is the compensatory response TO hypocalcemia; phosphate retention is the initiating cause)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ckd-secondary-hyperparathyroidism',
    chapter: 'patho-node-15',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 30', topic: 'ckd-secondary-hyperparathyroidism' },
  },

  // ── Atoms feeding pp2-wk-1 synthesis questions (Ch 31–32 Acid-Base / Kidney) ──

  {
    id: 'atom-p2w1-bicarbonate-buffer-superiority',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Explain why the bicarbonate buffer system is the most important extracellular buffer despite having a pK of 6.1, which is far from the physiologic pH of 7.4. Identify which organ regulates each component.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The bicarbonate buffer system derives its power from the fact that both components are independently regulated by separate organ systems rather than from favorable chemical buffering properties. The lungs control the acid component (dissolved CO2) by adjusting alveolar ventilation within minutes, raising or lowering PCO2 as needed. The kidneys control the base component (HCO3-) by adjusting H+ secretion, HCO3- reabsorption, and new HCO3- generation over hours to days. This dual organ regulation makes the system far more powerful than any closed chemical buffer operating at pK 6.1 would predict.' },
        { id: 'kp2', weight: 1, description: 'A buffer normally works best within one pH unit of its pK, so at pH 7.4 the bicarbonate system would seem like a poor chemical buffer. However, because the lungs continuously remove CO2 (preventing product accumulation) and the kidneys continuously regenerate or excrete HCO3- (maintaining the numerator), the system operates as an open system rather than a closed one. The open system behavior vastly extends its effective buffering range beyond what the pK value alone would suggest, and is the primary reason it dominates extracellular acid-base defense.' },
      ],
      common_errors: [
        'Stating that pK 6.1 makes bicarbonate an inherently strong chemical buffer (it does not; its power comes from organ regulation)',
        'Attributing its importance solely to high plasma concentration without mentioning the lung and kidney regulation',
      ],
      minimum_passing_score: 60,
    },
    topic: 'bicarbonate-buffer-superiority',
    chapter: 'pp2-wk-1',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 31', topic: 'bicarbonate-buffer-superiority' },
  },

  {
    id: 'atom-p2w1-henderson-hasselbalch',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'State the Henderson-Hasselbalch equation for the bicarbonate buffer system with its specific constants. Calculate the normal pH from normal values of HCO3- and PCO2.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The Henderson-Hasselbalch equation for the bicarbonate system is pH = 6.1 + log([HCO3-] / 0.03 x PCO2). The pK value is 6.1, which is the negative log of the dissociation constant for carbonic acid. The solubility coefficient alpha equals 0.03 and converts PCO2 measured in mm Hg to dissolved CO2 concentration in mmol per liter. At normal values of HCO3- = 24 mEq/L and PCO2 = 40 mm Hg, dissolved CO2 = 0.03 x 40 = 1.2 mmol/L, giving a ratio of 24/1.2 = 20. The log of 20 is 1.3, so pH = 6.1 + 1.3 = 7.4.' },
        { id: 'kp2', weight: 1, description: 'The equation reveals that pH depends on the ratio of HCO3- to dissolved CO2, not on the absolute concentration of either alone. Any change that alters this 20:1 ratio will change pH. Respiratory disorders change the denominator (PCO2) first, while metabolic disorders change the numerator (HCO3-) first. Compensation by the other organ system attempts to restore the ratio toward 20:1 without correcting the primary variable, which is why compensation is always partial and pH rarely returns exactly to 7.4.' },
      ],
      common_errors: [
        'Forgetting the solubility coefficient of 0.03 or confusing it with 0.3',
        'Stating that the pK is 7.4 (7.4 is the normal pH, not the pK; the pK is 6.1)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'henderson-hasselbalch-equation',
    chapter: 'pp2-wk-1',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 31', topic: 'henderson-hasselbalch-equation' },
  },

  {
    id: 'atom-p2w1-proximal-tubule-nhe3',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Describe how the proximal tubule reabsorbs filtered bicarbonate using the NHE3 transporter. Include the percentage of filtered HCO3- handled, the role of carbonic anhydrase, and the net effect.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The proximal tubule reabsorbs approximately 85 percent of filtered HCO3- using the apical Na+/H+ exchanger NHE3. For each H+ secreted into the lumen via NHE3, one Na+ is reabsorbed into the cell. The secreted H+ combines with filtered HCO3- in the lumen to form carbonic acid (H2CO3), which is rapidly dehydrated to CO2 and H2O by brush border carbonic anhydrase IV. The CO2 diffuses freely into the proximal tubular cell where intracellular carbonic anhydrase II rehydrates it back to H2CO3, which dissociates into H+ (recycled to the lumen via NHE3) and HCO3- (exits the basolateral membrane via the Na+/HCO3- cotransporter NBC1).' },
        { id: 'kp2', weight: 1, description: 'This process is classified as HCO3- reabsorption, not net acid excretion, because the H+ secreted into the lumen is consumed by recombination with filtered bicarbonate rather than being excreted in the final urine. The net effect is that for every HCO3- that was filtered at the glomerulus, one HCO3- is returned to the peritubular blood. No new bicarbonate is generated by this mechanism. Carbonic anhydrase inhibitors such as acetazolamide block both the luminal CA IV and intracellular CA II, impairing this process and causing HCO3- to spill into the urine (bicarbonaturia and metabolic acidosis).' },
      ],
      common_errors: [
        'Stating that proximal tubule HCO3- reabsorption represents net acid excretion (it does not; it merely prevents loss of filtered base)',
        'Confusing NHE3 (proximal tubule) with H+ ATPase (collecting duct intercalated cells)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'proximal-tubule-nhe3-mechanism',
    chapter: 'pp2-wk-1',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 31', topic: 'proximal-tubule-nhe3-mechanism' },
  },

  {
    id: 'atom-p2w1-type-a-intercalated-cells',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Describe the two apical H+ secretion transporters in Type A intercalated cells of the collecting duct. Explain how these cells generate new bicarbonate and when they are most active.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Type A intercalated cells in the collecting duct secrete H+ into the tubular lumen using two apical pumps: the vacuolar H+ ATPase (the primary pump, which actively transports H+ against a steep concentration gradient) and the H+/K+ ATPase (the secondary pump, which secretes H+ while simultaneously reabsorbing K+). On the basolateral membrane, a Cl-/HCO3- exchanger (band 3 protein, AE1) returns newly generated HCO3- to the peritubular blood. When secreted H+ is buffered by luminal phosphate or ammonia (rather than recombining with filtered HCO3-), a net new HCO3- molecule is added to the blood for every H+ excreted.' },
        { id: 'kp2', weight: 1, description: 'Type A intercalated cells are most active during acidosis. Their activity is stimulated by elevated PCO2 (which increases intracellular H+ via carbonic anhydrase), decreased plasma HCO3- (signaling acidosis), increased aldosterone (which stimulates the H+ ATPase), and hypokalemia (which causes H+ to shift into cells, increasing intracellular H+ available for secretion). During alkalosis, Type A cell activity is suppressed and Type B intercalated cells become dominant, secreting HCO3- into the lumen via apical pendrin.' },
      ],
      common_errors: [
        'Placing NHE3 in the collecting duct (NHE3 is the proximal tubule H+ transporter)',
        'Stating that all H+ secreted by Type A cells is net acid excretion (H+ that recombines with filtered HCO3- is merely reclamation)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'type-a-intercalated-cell-h-secretion',
    chapter: 'pp2-wk-1',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 31', topic: 'type-a-intercalated-cell-h-secretion' },
  },

  {
    id: 'atom-p2w1-phosphate-tubular-buffering',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Explain how phosphate acts as a tubular buffer to generate new bicarbonate. Write the reaction and explain why this mechanism has a limited ceiling during acidosis.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Filtered NaHPO4- in the tubular lumen accepts a secreted H+ ion to form NaH2PO4 (monobasic phosphate), which is excreted in the urine as titratable acid. The term titratable acid refers to the amount of strong base (NaOH) needed to titrate the urine pH back to 7.4, and phosphate is the dominant contributor. For every H+ buffered by phosphate in the lumen, one new HCO3- is generated inside the tubular cell from CO2 and H2O via carbonic anhydrase. This new HCO3- exits the basolateral membrane into the blood via the Cl-/HCO3- exchanger, representing a net gain of base for the body.' },
        { id: 'kp2', weight: 1, description: 'Titratable acid excretion is normally approximately 30 mmol per day and increases only modestly to about 35 mmol per day during chronic acidosis. The ceiling is limited because phosphate buffer capacity depends on the filtered phosphate load (GFR times plasma phosphate concentration), which does not increase dramatically during acidosis. This is why ammonia buffering (not phosphate) provides the major adaptive increase in net acid excretion during prolonged metabolic acidosis, as ammonia production from glutamine can increase five to six fold.' },
      ],
      common_errors: [
        'Confusing titratable acid (H+ buffered by phosphate) with free H+ excretion (negligible at any urine pH)',
        'Stating that phosphate buffering increases dramatically during acidosis (it is limited by filtered phosphate load)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'phosphate-tubular-buffering',
    chapter: 'pp2-wk-1',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 31', topic: 'phosphate-tubular-buffering' },
  },

  {
    id: 'atom-p2w1-glutamine-ammonia-system',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Describe the renal ammonia buffering system from glutamine metabolism to NH4+ excretion. Explain the nonionic diffusion trapping mechanism in the collecting duct and the quantitative response to chronic acidosis.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'In proximal tubular cells, glutamine is metabolized by glutaminase to produce two NH4+ ions and two new HCO3- ions per glutamine molecule. The NH4+ is secreted into the lumen (substituting for H+ on the NHE3 exchanger) and travels through the loop of Henle into the medullary interstitium. In the collecting duct, uncharged NH3 diffuses freely from the interstitium into the acidic luminal fluid where it combines with H+ (secreted by the H+ ATPase) to form NH4+. Because NH4+ is charged, it cannot diffuse back across the membrane and is trapped in the lumen for urinary excretion. This mechanism is called nonionic diffusion trapping.' },
        { id: 'kp2', weight: 1, description: 'NH4+ excretion rises from approximately 30 mmol per day at baseline to 165 mmol per day or more during chronic metabolic acidosis, a five to six fold increase. This is the dominant adaptive mechanism for increasing net acid excretion because, unlike phosphate buffering (limited by filtered load), glutaminase activity and glutamine transport are directly upregulated by acidosis. During maximal compensation, total net acid excretion can reach approximately 500 mmol per day, with the ammonia pathway accounting for the vast majority of the adaptive increase over the modest rise in titratable acid.' },
      ],
      common_errors: [
        'Stating that ammonia buffering occurs entirely in the proximal tubule (NH4+ is produced there, but the critical trapping step occurs in the collecting duct)',
        'Forgetting that each glutamine molecule produces TWO NH4+ and TWO HCO3-',
      ],
      minimum_passing_score: 60,
    },
    topic: 'glutamine-ammonia-buffering',
    chapter: 'pp2-wk-1',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 31', topic: 'glutamine-ammonia-buffering' },
  },

  {
    id: 'atom-p2w1-abg-four-step-approach',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Describe the four-step systematic approach to interpreting an arterial blood gas result. For each step, state what the clinician evaluates and what conclusion is drawn.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Step 1: note whether the pH is below 7.4 (acidosis) or above 7.4 (alkalosis). Step 2: determine which variable, PCO2 or HCO3-, is out of the normal range in a direction that could be causing the observed pH change. For example, if pH is low and PCO2 is elevated, the elevated PCO2 could cause the acidemia. Step 3: classify the disorder. If the causative variable is PCO2 (a respiratory variable), the problem is respiratory. If the causative variable is HCO3- (a metabolic variable), the problem is metabolic. Step 4: examine the other variable to see if it has moved in a direction that would partially correct the pH, indicating that compensation is occurring. If it is within the normal range, no compensation is present.' },
        { id: 'kp2', weight: 1, description: 'The key principle is that the primary event is the variable whose change explains the direction of pH movement, while the compensatory response is the variable whose change opposes the pH change. The primary event is identified by the double arrows (largest magnitude change) in the classification table. Compensation never fully normalizes pH to exactly 7.4 in a simple disorder. If the pH is exactly 7.40 but both PCO2 and HCO3- are abnormal, a mixed acid-base disorder should be suspected rather than perfectly compensated simple disorder.' },
      ],
      common_errors: [
        'Confusing the primary event with the compensatory response by not identifying which variable drives the pH change',
        'Assuming a normal pH with abnormal PCO2 and HCO3- means perfect compensation rather than considering a mixed disorder',
      ],
      minimum_passing_score: 60,
    },
    topic: 'abg-four-step-interpretation',
    chapter: 'pp2-wk-1',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 31', topic: 'abg-four-step-interpretation' },
  },

  {
    id: 'atom-p2w1-acid-base-compensation-patterns',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'For each of the four primary acid-base disorders, state the primary variable change, the direction of pH shift, and the expected compensatory response including the organ responsible.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Respiratory acidosis: primary event is increased PCO2 (above 40 mm Hg) from hypoventilation; pH falls; kidneys compensate by increasing H+ excretion and HCO3- reabsorption, raising plasma HCO3- over 3 to 5 days. Respiratory alkalosis: primary event is decreased PCO2 (below 40 mm Hg) from hyperventilation; pH rises; kidneys compensate by decreasing H+ excretion and reducing HCO3- reabsorption, lowering plasma HCO3-. Metabolic acidosis: primary event is decreased HCO3- (below 24 mEq/L); pH falls; lungs compensate by hyperventilation that lowers PCO2 within hours. Metabolic alkalosis: primary event is increased HCO3- (above 24 mEq/L); pH rises; lungs compensate by hypoventilation that raises PCO2.' },
        { id: 'kp2', weight: 1, description: 'Respiratory compensation for metabolic disorders acts within minutes to hours (fast) but is limited. Renal compensation for respiratory disorders is more powerful but acts slowly over hours to days. Respiratory compensation for metabolic alkalosis is particularly limited because hypoventilation also causes hypoxemia, which stimulates peripheral chemoreceptors and limits the degree of CO2 retention. This is why metabolic alkalosis is often the hardest acid-base disorder to fully compensate. Compensation is always partial in simple disorders; the pH moves toward 7.4 but does not reach it.' },
      ],
      common_errors: [
        'Stating that respiratory compensation for metabolic alkalosis is hyperventilation (it is hypoventilation to retain CO2)',
        'Claiming that compensation fully corrects pH to 7.4 (it is always partial in simple disorders)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'acid-base-compensation-patterns',
    chapter: 'pp2-wk-1',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 31', topic: 'acid-base-compensation-patterns' },
  },

  {
    id: 'atom-p2w1-anion-gap-calculation',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Define the anion gap, state the formula and normal value, and explain the physiologic basis for why it exists. Calculate the anion gap from normal electrolyte values.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The anion gap equals Na+ minus (Cl- + HCO3-). Using normal values: 142 minus (108 + 24) = 10 mEq/L. The normal range is 8 to 16 mEq/L. The anion gap exists because body fluids must maintain electroneutrality (total cations = total anions) but the standard chemistry panel measures only some of them. The measured cation (Na+) exceeds the sum of measured anions (Cl- + HCO3-) because unmeasured anions (albumin at approximately 12 mEq/L, phosphate, sulfate, and organic acids collectively contributing about 6 mEq/L) are present but not included in the standard formula.' },
        { id: 'kp2', weight: 1, description: 'An elevated anion gap indicates accumulation of unmeasured anions beyond the normal background level. When an organic acid (such as lactic acid or a ketoacid) is added to the blood, it dissociates into H+ and an organic anion. The H+ is buffered by HCO3- (lowering HCO3-), and the new anion takes its place in the electroneutrality equation. Because this new anion is not measured in the Cl- or HCO3- assays, the gap widens. This pattern is called an increased anion gap metabolic acidosis and is a critical diagnostic finding in emergency medicine.' },
      ],
      common_errors: [
        'Using the wrong formula (stating Cl- minus Na+ or forgetting to subtract HCO3-)',
        'Claiming the anion gap is zero in a healthy person (it is approximately 10 mEq/L due to unmeasured anions)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'anion-gap-calculation',
    chapter: 'pp2-wk-1',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 31', topic: 'anion-gap-calculation' },
  },

  {
    id: 'atom-p2w1-anion-gap-differential',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Distinguish increased anion gap metabolic acidosis from normal anion gap (hyperchloremic) metabolic acidosis. List at least three causes of each type and explain why the chloride concentration differs.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'In increased anion gap metabolic acidosis, unmeasured organic anions accumulate and replace HCO3-. Chloride remains normal because the new anion (not Cl-) fills the gap left by lost bicarbonate. Causes include diabetic ketoacidosis (beta-hydroxybutyrate, acetoacetate), lactic acidosis (lactate from tissue hypoxia or sepsis), aspirin poisoning (salicylate), methanol poisoning (formate), ethylene glycol poisoning (oxalate), and starvation ketosis. The mnemonic MUDPILES can help recall these: Methanol, Uremia, DKA, Propylene glycol, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates.' },
        { id: 'kp2', weight: 1, description: 'In normal anion gap metabolic acidosis, HCO3- is lost directly without any new unmeasured anion appearing. To maintain electroneutrality, the kidneys retain Cl-, so chloride rises as bicarbonate falls. This is why it is called hyperchloremic metabolic acidosis. Causes include diarrhea (direct GI loss of HCO3- rich intestinal fluid), renal tubular acidosis types 1, 2, and 4 (impaired tubular H+ secretion or HCO3- reabsorption), Addison disease (aldosterone deficiency reducing distal H+ secretion), and carbonic anhydrase inhibitors such as acetazolamide.' },
      ],
      common_errors: [
        'Listing diarrhea as an increased anion gap cause (it is a classic normal anion gap cause)',
        'Failing to explain that Cl- rises in normal AG acidosis because it replaces lost HCO3- to maintain electroneutrality',
      ],
      minimum_passing_score: 60,
    },
    topic: 'anion-gap-differential-diagnosis',
    chapter: 'pp2-wk-1',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 31', topic: 'anion-gap-differential-diagnosis' },
  },

  {
    id: 'atom-p2w1-loop-diuretic-nkcc2-block',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Describe the mechanism of action of loop diuretics at NKCC2, the effect on transepithelial voltage, and why these agents impair both urine concentration and dilution simultaneously.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Loop diuretics (furosemide, bumetanide, torsemide) block the NKCC2 cotransporter (Na+/K+/2Cl-) on the apical membrane of thick ascending limb cells. Normally, K+ that enters the cell via NKCC2 recycles back to the lumen through apical ROMK channels, generating a lumen positive transepithelial voltage of approximately +8 mV. This positive voltage drives paracellular reabsorption of divalent cations (Ca2+ and Mg2+) and additional Na+ and K+. Loop diuretic blockade stops K+ recycling, collapses the +8 mV voltage, and abolishes paracellular cation reabsorption. This explains loop diuretic induced hypocalcemia, hypomagnesemia, and hypokalemia.' },
        { id: 'kp2', weight: 1, description: 'The thick ascending limb serves a dual function: it builds the hypertonic medullary interstitium (by depositing NaCl without water) needed for ADH dependent urine concentration, and it dilutes the tubular fluid (the diluting segment) needed for water diuresis when ADH is absent. By blocking NaCl reabsorption in this single segment, loop diuretics simultaneously wash out the medullary gradient (impairing concentration) and prevent tubular fluid from becoming hypotonic (impairing dilution). No other diuretic class causes this dual impairment because no other class targets the segment responsible for both functions.' },
      ],
      common_errors: [
        'Stating that loop diuretics only impair concentrating ability (they impair both concentration AND dilution)',
        'Confusing the +8 mV lumen positive voltage of the TAL with the -50 mV lumen negative voltage of the collecting duct',
      ],
      minimum_passing_score: 60,
    },
    topic: 'loop-diuretic-nkcc2-block',
    chapter: 'pp2-wk-1',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 32', topic: 'loop-diuretic-nkcc2-block' },
  },

  {
    id: 'atom-p2w1-k-sparing-diuretic-mechanism',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Describe the two subclasses of potassium-sparing diuretics with their mechanisms and explain why both reduce K+ secretion. Name one drug from each subclass.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Potassium-sparing diuretics are divided into aldosterone receptor antagonists (spironolactone and eplerenone) and epithelial sodium channel (ENaC) blockers (amiloride and triamterene). Both subclasses act in the cortical collecting duct where the normal transepithelial voltage is approximately -50 mV (lumen negative), created by Na+ reabsorption through ENaC. Aldosterone antagonists block the mineralocorticoid receptor in principal cells, reducing transcription of ENaC and ROMK channels. ENaC blockers directly occlude the sodium channel pore. Both mechanisms reduce Na+ reabsorption through ENaC, which decreases the lumen negative voltage and thereby reduces the electrochemical driving force for K+ secretion through ROMK channels.' },
        { id: 'kp2', weight: 1, description: 'The major adverse effect of both subclasses is hyperkalemia, because the reduced driving force for K+ secretion causes K+ to be retained. This risk is especially dangerous in patients with renal impairment, diabetes, or those taking ACE inhibitors or ARBs (which reduce aldosterone). Spironolactone has additional antiandrogenic side effects (gynecomastia) because it also binds androgen receptors. Eplerenone is more selective for the mineralocorticoid receptor and causes fewer hormonal side effects. These agents are often combined with loop or thiazide diuretics to offset the hypokalemia caused by those drugs.' },
      ],
      common_errors: [
        'Stating that potassium-sparing diuretics increase K+ reabsorption (they reduce K+ secretion by reducing the electrochemical gradient)',
        'Confusing spironolactone (aldosterone antagonist) with amiloride (ENaC blocker) in terms of mechanism',
      ],
      minimum_passing_score: 60,
    },
    topic: 'k-sparing-diuretic-mechanism',
    chapter: 'pp2-wk-1',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 32', topic: 'k-sparing-diuretic-mechanism' },
  },

  {
    id: 'atom-p2w1-aki-prerenal-causes',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Define prerenal AKI, list its major causes, and explain why it is rapidly reversible. Describe how urinary indices distinguish prerenal from intrarenal AKI.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Prerenal AKI results from inadequate renal perfusion while the kidney parenchyma remains structurally intact. It is the most common AKI category at 50 to 55 percent of cases. Causes include hemorrhagic shock, severe dehydration, cardiogenic shock (heart failure with low output), septic shock (vasodilatory), and any condition that reduces effective circulating volume or cardiac output below the renal autoregulatory threshold. It is rapidly reversible because restoring perfusion allows the structurally normal kidneys to resume filtration immediately.' },
        { id: 'kp2', weight: 1, description: 'Urinary indices help distinguish prerenal from intrarenal (ATN) AKI. In prerenal AKI, tubular function is intact, so the kidney avidly retains sodium: fractional excretion of sodium (FENa) is below 1 percent, urine sodium is below 20 mEq/L, urine osmolarity is high (above 500 mOsm/L), and BUN to creatinine ratio is elevated (above 20:1). In intrarenal AKI (acute tubular necrosis), damaged tubules cannot reabsorb sodium: FENa exceeds 2 percent, urine sodium exceeds 40 mEq/L, urine is isosthenuric (approximately 300 mOsm/L), and BUN to creatinine ratio is normal (10 to 15:1). These indices are most reliable when diuretics have not been administered.' },
      ],
      common_errors: [
        'Confusing prerenal AKI (underperfusion with intact kidneys) with intrarenal AKI (structural damage)',
        'Stating that FENa below 1 percent rules out intrarenal AKI in all cases (contrast nephropathy and myoglobin nephropathy can have low FENa)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'prerenal-aki-causes-and-indices',
    chapter: 'pp2-wk-1',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 32', topic: 'prerenal-aki-causes-and-indices' },
  },

  {
    id: 'atom-p2w1-aki-classification-frequencies',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'State the three etiologic categories of AKI with their approximate frequency percentages. List at least two causes of intrarenal and postrenal AKI.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'AKI is classified as prerenal (50 to 55 percent of cases), intrarenal (35 to 40 percent), or postrenal (approximately 5 percent). Intrarenal causes include acute tubular necrosis from prolonged ischemia or nephrotoxins (aminoglycosides, radiocontrast agents, cisplatin, myoglobin from rhabdomyolysis), acute glomerulonephritis (post-streptococcal, lupus nephritis, IgA nephropathy), acute interstitial nephritis (drug allergies, especially NSAIDs and penicillins), and renal vasculitis. The common feature is direct structural damage to the renal parenchyma.' },
        { id: 'kp2', weight: 1, description: 'Postrenal AKI results from obstruction of urinary outflow and accounts for approximately 5 percent of cases. It requires bilateral obstruction (or obstruction of a solitary kidney) to cause significant AKI. Causes include bilateral ureteral obstruction (kidney stones, retroperitoneal fibrosis, tumor compression), bladder outlet obstruction (benign prostatic hypertrophy, bladder cancer, neurogenic bladder), and urethral obstruction (stricture, posterior urethral valves in children). Postrenal AKI is important to identify quickly because relief of obstruction can rapidly restore kidney function if treatment occurs before permanent tubular damage develops.' },
      ],
      common_errors: [
        'Stating that postrenal AKI is the most common category (prerenal is most common at 50 to 55 percent)',
        'Forgetting that bilateral obstruction is required (unilateral obstruction rarely causes AKI if the contralateral kidney is functional)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'aki-classification-and-frequencies',
    chapter: 'pp2-wk-1',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 32', topic: 'aki-classification-and-frequencies' },
  },

  {
    id: 'atom-p2w1-ckd-vicious-cycle',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'Describe the vicious cycle of CKD progression from initial nephron loss through glomerular sclerosis and back to further nephron loss. Explain why systemic hypertension accelerates this cycle.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The CKD vicious cycle begins when primary kidney disease reduces the number of functional nephrons. Surviving nephrons undergo compensatory hypertrophy and afferent arteriolar vasodilation to increase their individual GFR and maintain total kidney function. While initially adaptive, this compensation chronically elevates glomerular capillary pressure and single nephron filtration rate. The sustained high pressure damages the glomerular capillary wall over months to years, causing glomerular sclerosis (scarring and fibrosis). Sclerosed glomeruli lose function entirely, reducing nephron number further and restarting the cycle with even more pressure on the remaining nephrons.' },
        { id: 'kp2', weight: 1, description: 'Systemic hypertension accelerates the vicious cycle because elevated arterial pressure is transmitted to the glomerular capillaries, amplifying the pressure injury beyond what compensatory hyperfiltration alone would cause. This is why blood pressure control (especially with ACE inhibitors or ARBs, which preferentially dilate the efferent arteriole and lower glomerular capillary pressure) is a cornerstone of CKD management. The cycle explains why CKD is progressive even after the initial insult resolves, because the compensatory mechanisms themselves become pathologic.' },
      ],
      common_errors: [
        'Stating that compensatory hypertrophy is purely protective (it is initially adaptive but eventually drives the sclerosis cycle)',
        'Forgetting that systemic hypertension accelerates the cycle by transmitting higher pressure to already stressed glomeruli',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ckd-vicious-cycle',
    chapter: 'pp2-wk-1',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 32', topic: 'ckd-vicious-cycle' },
  },

  {
    id: 'atom-p2w1-ckd-solute-groups',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-1',
    prompt: 'As GFR declines in CKD, plasma solutes follow three distinct patterns. Describe Groups A, B, and C, naming the representative solutes in each group and explaining why each pattern occurs.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Group A solutes (creatinine and urea) rise steeply and inversely proportional to GFR because they depend almost entirely on glomerular filtration for excretion and have no significant hormonal regulation of their tubular handling. When GFR drops by 50 percent, their plasma concentration approximately doubles. Group B solutes (phosphate and hydrogen ions) rise moderately because compensatory mechanisms partially offset the reduced filtration. For phosphate, PTH increases fractional excretion; for H+, increased ammonia production and HCO3- generation partially maintain acid-base balance. Group C solutes (Na+ and Cl-) remain nearly constant because the kidney adjusts fractional reabsorption precisely to match output with dietary intake.' },
        { id: 'kp2', weight: 1, description: 'The clinical significance of these patterns is that Group A solutes (creatinine, urea) are useful as GFR markers precisely because their plasma levels reflect filtration rate with minimal hormonal modification. However, creatinine is insensitive early in CKD because the rectangular hyperbolic relationship means large GFR drops at high baseline produce only small creatinine increases. Group B behavior explains why metabolic acidosis and hyperphosphatemia emerge as CKD progresses (the compensatory mechanisms have limits). Group C behavior explains why sodium and chloride concentrations are normal even in advanced CKD, which can mask the severity of disease.' },
      ],
      common_errors: [
        'Claiming that Na+ and Cl- rise dramatically in CKD (they remain nearly constant until very late stages)',
        'Stating that creatinine is a sensitive early marker (it is insensitive because of the hyperbolic curve)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ckd-solute-group-patterns',
    chapter: 'pp2-wk-1',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 32', topic: 'ckd-solute-group-patterns' },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  pp2-wk-2 ATOMS: Red Blood Cells / Resistance to Infection I & II
  //  Ch. 33–35, Guyton & Hall 14e — 16 atoms
  // ═══════════════════════════════════════════════════════════════════════

  // ── Atoms feeding r-p2-wk2-1 (EPO & Erythropoiesis Integration) ──────

  {
    id: 'atom-p2w2-epo-hypoxia-feedback',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe the oxygen sensing mechanism that regulates erythropoietin (EPO) production. Include the cellular site of EPO synthesis, the HIF pathway, and the magnitude of EPO increase during severe hypoxia.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'EPO is produced by peritubular interstitial fibroblasts in the renal cortex and outer medulla, accounting for approximately 90 percent of circulating EPO; the liver contributes the remaining 10 percent. Under normoxic conditions, prolyl hydroxylase domain (PHD) enzymes use molecular O2 as a co-substrate to hydroxylate hypoxia inducible factor alpha (HIF alpha) subunits. Hydroxylated HIF alpha is recognized by the von Hippel Lindau (VHL) E3 ubiquitin ligase complex, polyubiquitinated, and rapidly degraded by the proteasome, keeping EPO transcription at baseline levels.' },
        { id: 'kp2', weight: 2, description: 'During tissue hypoxia, reduced O2 availability impairs PHD enzymatic activity because O2 is a required co-substrate. HIF alpha escapes hydroxylation, accumulates in the cytoplasm, dimerizes with HIF beta (which is constitutively expressed), and the heterodimer translocates to the nucleus. There it binds hypoxia response elements (HREs) in the EPO gene promoter region, dramatically upregulating EPO transcription. Circulating EPO levels can increase 100 fold or more during severe anemia or hypoxia, providing a powerful stimulus for accelerated red blood cell production in the bone marrow.' },
        { id: 'kp3', weight: 1, description: 'This negative feedback loop is self-correcting: as new RBCs are produced and oxygen delivery improves, tissue PO2 rises, PHD activity resumes, HIF alpha is degraded again, and EPO production returns toward baseline. Conditions that trigger this pathway include hemorrhage, high altitude residence, chronic lung disease, and any cause of tissue hypoxia. The CRNA relevance is that exogenous recombinant EPO (epoetin alfa) is used perioperatively to stimulate erythropoiesis in patients who refuse transfusion or who have chronic kidney disease with inadequate endogenous EPO production.' },
      ],
      common_errors: [
        'Stating that EPO is produced primarily by the liver (the kidney produces 90 percent)',
        'Confusing HIF stabilization (hypoxia) with HIF degradation (normoxia)',
        'Forgetting that O2 is a required co-substrate for prolyl hydroxylase',
      ],
      minimum_passing_score: 60,
    },
    topic: 'epo-hypoxia-feedback',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 33', topic: 'epo-hypoxia-feedback' },
  },

  {
    id: 'atom-p2w2-erythropoiesis-maturation-stages',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'List the sequential maturation stages of erythropoiesis from the committed erythroid progenitor to the mature circulating red blood cell. For each stage, describe the key morphologic change occurring.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The maturation sequence begins with the committed erythroid progenitor (CFU-E, colony forming unit erythroid) that is the primary target of EPO. Under EPO stimulation, CFU-E differentiates into the proerythroblast (the first morphologically recognizable stage), which is a large cell with dispersed chromatin, visible nucleoli, and deep basophilic cytoplasm due to abundant ribosomes. The proerythroblast divides and matures through the basophilic erythroblast (intense RNA staining, beginning of hemoglobin mRNA production), then the polychromatic erythroblast (mixed basophilic RNA staining and eosinophilic hemoglobin staining giving a gray appearance), and finally the orthochromatic erythroblast (abundant hemoglobin, markedly condensed pyknotic nucleus that is about to be expelled).' },
        { id: 'kp2', weight: 2, description: 'The orthochromatic erythroblast expels its nucleus (enucleation) to become a reticulocyte, which retains residual ribosomal RNA visible as a reticular network with supravital stains (such as new methylene blue). Reticulocytes are released from the bone marrow into the circulation and mature into fully mature erythrocytes within 1 to 2 days as the remaining RNA is degraded. The entire process from proerythroblast to reticulocyte release takes approximately 5 days under normal conditions but can be shortened to 2 to 3 days under intense EPO stimulation (stress erythropoiesis). Normal reticulocyte count is 0.5 to 1.5 percent of circulating red cells.' },
        { id: 'kp3', weight: 1, description: 'Throughout maturation, cells progressively decrease in size, accumulate hemoglobin, condense their nuclear chromatin, and lose organelles (mitochondria, endoplasmic reticulum, ribosomes). The mature RBC is an anucleate biconcave disc approximately 7.8 micrometers in diameter with a 120 day circulatory lifespan. Loss of all organelles means the mature RBC cannot synthesize new proteins, perform oxidative phosphorylation, or divide; it relies entirely on anaerobic glycolysis for ATP production. Senescent RBCs are removed primarily by splenic macrophages that recognize changes in membrane phospholipid asymmetry and decreased deformability.' },
      ],
      common_errors: [
        'Skipping the polychromatic erythroblast stage between basophilic and orthochromatic',
        'Stating that reticulocytes have a nucleus (the nucleus is expelled at the orthochromatic stage)',
        'Claiming that mature RBCs use mitochondrial oxidative phosphorylation (they rely on anaerobic glycolysis)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'erythropoiesis-maturation-stages',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 33', topic: 'erythropoiesis-maturation-stages' },
  },

  // ── Atoms feeding r-p2-wk2-2 (Hemoglobin & RBC Deformability) ────────

  {
    id: 'atom-p2w2-hemoglobin-cooperative-binding',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe the molecular structure of adult hemoglobin A and explain how cooperative oxygen binding produces the sigmoid oxyhemoglobin dissociation curve. Include the T state to R state conformational transition.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Adult hemoglobin A (HbA) is a tetramer composed of two alpha globin chains and two beta globin chains (alpha2 beta2), with a total molecular weight of approximately 64,500 daltons. Each of the four globin subunits contains one heme group, which is a protoporphyrin IX ring coordinating a central ferrous iron atom (Fe2+). Each Fe2+ reversibly binds one O2 molecule, giving each hemoglobin tetramer a maximum carrying capacity of four O2 molecules. The iron must remain in the ferrous (Fe2+) state for O2 binding; oxidation to the ferric (Fe3+) state produces methemoglobin, which cannot bind O2.' },
        { id: 'kp2', weight: 2, description: 'Cooperative binding means that the binding of O2 to one heme subunit increases the O2 affinity of the remaining unoccupied subunits through conformational change. Deoxyhemoglobin exists in the tense (T) state, a low affinity conformation stabilized by salt bridges and hydrogen bonds between subunits. When O2 binds to one subunit, the iron atom moves into the plane of the porphyrin ring, pulling the proximal histidine and shifting the subunit interface. This disrupts constraining bonds and promotes transition to the relaxed (R) state, which has approximately 300 fold higher O2 affinity. This cooperativity produces the characteristic sigmoid (S shaped) dissociation curve; at alveolar PO2 (approximately 100 mm Hg) saturation is about 97 percent, while at tissue PO2 (approximately 40 mm Hg) saturation drops to about 75 percent, efficiently unloading O2 to tissues.' },
      ],
      common_errors: [
        'Stating that hemoglobin contains four alpha chains (it has two alpha and two beta in HbA)',
        'Describing the curve as hyperbolic (that is myoglobin; hemoglobin is sigmoid due to cooperativity)',
        'Confusing ferrous Fe2+ (functional) with ferric Fe3+ (methemoglobin, nonfunctional)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'hemoglobin-cooperative-binding',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 33', topic: 'hemoglobin-cooperative-binding' },
  },

  {
    id: 'atom-p2w2-rbc-biconcave-deformability',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Explain how the biconcave disc shape of the mature red blood cell optimizes oxygen delivery and allows passage through the microcirculation. Include the role of the spectrin cytoskeleton in maintaining deformability.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The mature RBC is a biconcave disc approximately 7.8 micrometers in diameter and 2.5 micrometers thick at the rim, with a central thickness of only about 1 micrometer. This geometry provides a surface area to volume ratio approximately 1.4 times greater than a sphere of equivalent volume, which minimizes the maximum intracellular diffusion distance for O2 from the membrane to any hemoglobin molecule. The result is extremely rapid O2 loading in the pulmonary capillaries (complete equilibration within 0.25 seconds of the 0.75 second transit time) and efficient O2 unloading at the tissue level. The excess membrane relative to cell volume also allows dramatic deformation without increasing surface tension to the point of membrane rupture.' },
        { id: 'kp2', weight: 2, description: 'Deformability is maintained by the spectrin based membrane cytoskeleton: spectrin alpha and beta heterodimers form a hexagonal lattice on the inner membrane surface, connected to the lipid bilayer through anchor proteins including ankyrin (linking spectrin to band 3, the anion exchanger) and protein 4.1 (linking spectrin to glycophorin C). This flexible scaffolding allows the RBC to deform reversibly when squeezing through capillaries as narrow as 3 micrometers (less than half the cell diameter) and through splenic sinusoidal slits of 1 to 3 micrometers. Defects in spectrin or ankyrin (as in hereditary spherocytosis) cause loss of membrane surface area, converting the disc to a rigid sphere that cannot traverse splenic slits, leading to splenic trapping and hemolysis.' },
      ],
      common_errors: [
        'Stating that the biconcave shape is maintained by an internal nucleus or organelle skeleton (RBCs lack organelles; the spectrin cytoskeleton maintains shape)',
        'Claiming that RBCs are rigid (their extreme deformability is essential for microcirculatory flow)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'rbc-biconcave-deformability',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 33', topic: 'rbc-biconcave-deformability' },
  },

  // ── Atoms feeding r-p2-wk2-3 (Iron & B12/Folate Anemias) ─────────────

  {
    id: 'atom-p2w2-iron-absorption-recycling',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe iron absorption, transport, storage, and recycling. Include the roles of DMT1, ferroportin, hepcidin, transferrin, and ferritin. State total body iron content and the fraction in hemoglobin.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Dietary iron absorption occurs primarily in the duodenum and upper jejunum. Non-heme ferric iron (Fe3+) in the intestinal lumen is reduced to ferrous iron (Fe2+) by duodenal cytochrome B (Dcytb) on the apical brush border membrane of enterocytes. Fe2+ enters the enterocyte through divalent metal transporter 1 (DMT1). Inside the cell, iron is either stored as ferritin (an intracellular storage protein that sequesters up to 4,500 iron atoms per molecule) or exported across the basolateral membrane into the blood by ferroportin, the only known cellular iron exporter. Exported Fe2+ is immediately oxidized to Fe3+ by hephaestin and loaded onto transferrin for plasma transport. Each transferrin molecule binds two Fe3+ atoms.' },
        { id: 'kp2', weight: 2, description: 'Hepcidin is a peptide hormone produced by hepatocytes that serves as the master regulator of systemic iron homeostasis. Hepcidin binds to ferroportin on enterocytes, macrophages, and hepatocytes, causing ferroportin internalization and degradation. This blocks iron export from cells into the plasma. Hepcidin production increases when iron stores are replete (to prevent iron overload) and during inflammation (via IL-6), and decreases during iron deficiency, hypoxia, and increased erythropoietic demand. Total body iron is approximately 4 to 5 grams in adults, with approximately 65 percent contained in hemoglobin, 15 to 30 percent stored as ferritin and hemosiderin (primarily in liver, spleen, and bone marrow), 4 percent in myoglobin, and less than 1 percent in iron containing enzymes and transferrin bound transport iron.' },
        { id: 'kp3', weight: 1, description: 'Iron recycling by splenic and hepatic macrophages is quantitatively the most important source of iron for daily erythropoiesis. Macrophages phagocytose senescent red blood cells (approximately 200 billion per day), digest hemoglobin, and release recycled iron back into the blood via ferroportin for transferrin loading and delivery to bone marrow erythroblasts. This recycling provides approximately 20 to 25 mg of iron per day, far exceeding the 1 to 2 mg per day absorbed from the diet, which merely replaces small daily losses through desquamation of skin and intestinal epithelial cells.' },
      ],
      common_errors: [
        'Confusing DMT1 (apical entry) with ferroportin (basolateral export)',
        'Stating that hepcidin increases iron absorption (it decreases absorption by degrading ferroportin)',
        'Claiming that dietary absorption is the main source of iron for daily erythropoiesis (macrophage recycling provides 20 to 25 mg per day versus 1 to 2 mg from diet)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'iron-absorption-recycling',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 33', topic: 'iron-absorption-recycling' },
  },

  {
    id: 'atom-p2w2-b12-folate-megaloblastic',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Compare vitamin B12 and folate in terms of absorption mechanism, metabolic role in DNA synthesis, the type of anemia caused by deficiency, and the key laboratory test that distinguishes B12 deficiency from folate deficiency.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Vitamin B12 (cobalamin) requires intrinsic factor (IF), a glycoprotein secreted by gastric parietal cells, for absorption. The B12 IF complex travels to the terminal ileum where it binds cubilin receptors and is absorbed by receptor mediated endocytosis. Hepatic B12 stores are large (2 to 5 mg), lasting 3 to 6 years before deficiency develops. B12 is a cofactor for methionine synthase, which converts homocysteine to methionine while simultaneously converting methyltetrahydrofolate (methyl THF) back to tetrahydrofolate (THF). Without B12, THF becomes trapped as methyl THF (the "methylfolate trap"), unavailable for thymidylate synthesis, thereby impairing DNA synthesis even when total folate levels are adequate.' },
        { id: 'kp2', weight: 2, description: 'Folate (vitamin B9) is absorbed in the jejunum via the proton coupled folate transporter without requiring intrinsic factor. Body folate stores are small (5 to 20 mg), lasting only 3 to 4 months before deficiency develops. Folate in the form of 5,10 methylene THF is the one carbon donor required by thymidylate synthase, which converts deoxyuridine monophosphate (dUMP) to deoxythymidine monophosphate (dTMP), an essential step for DNA synthesis. Both B12 and folate deficiency impair DNA synthesis while leaving RNA and protein synthesis relatively intact, causing nuclear maturation arrest while cytoplasmic hemoglobin accumulation continues. The result is megaloblastic anemia: abnormally large oval macrocytes (MCV above 100 fL) and hypersegmented neutrophils (6 or more nuclear lobes).' },
        { id: 'kp3', weight: 1, description: 'The key distinguishing laboratory test is serum methylmalonic acid (MMA). B12 is also a cofactor for methylmalonyl CoA mutase, which converts methylmalonyl CoA to succinyl CoA; B12 deficiency causes MMA to accumulate, so elevated serum MMA is specific for B12 deficiency and is normal in isolated folate deficiency. Serum homocysteine is elevated in both B12 and folate deficiency and therefore does not distinguish between them. B12 deficiency additionally causes subacute combined degeneration of the spinal cord (demyelination of posterior columns and lateral corticospinal tracts) because the methylmalonyl CoA mutase pathway is required for normal myelin maintenance, a function that folate does not share.' },
      ],
      common_errors: [
        'Stating that B12 is absorbed in the jejunum (B12 requires IF and is absorbed in the terminal ileum; folate is absorbed in the jejunum)',
        'Claiming that elevated homocysteine distinguishes B12 from folate deficiency (homocysteine is elevated in both; MMA is the distinguishing test)',
        'Claiming that folate deficiency causes neurologic damage (only B12 deficiency causes subacute combined degeneration)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'b12-folate-megaloblastic',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 33', topic: 'b12-folate-megaloblastic' },
  },

  // ── Atoms feeding r-p2-wk2-4 (Neutrophil Recruitment & Killing) ──────

  {
    id: 'atom-p2w2-neutrophil-margination-diapedesis',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe the multi-step adhesion cascade by which circulating neutrophils exit the blood and reach a site of tissue infection. Include the molecular mediators at each step: selectin mediated rolling, integrin mediated firm adhesion, and diapedesis.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The adhesion cascade begins with margination, in which neutrophils move from the central axial stream of blood flow to the vessel periphery in post-capillary venules near the site of infection. Step 1 (rolling): inflammatory cytokines (TNF alpha, IL-1) from activated macrophages stimulate endothelial cells to rapidly express P selectin (released from preformed Weibel Palade body stores within minutes) and later E selectin (transcriptionally upregulated over 1 to 2 hours). Selectins bind weakly to carbohydrate ligands on the neutrophil surface (sialyl Lewis X epitopes on PSGL-1), creating a transient "rolling" interaction that slows the neutrophil from blood flow velocity to a crawling pace along the endothelium.' },
        { id: 'kp2', weight: 2, description: 'Step 2 (firm adhesion): chemokines (primarily IL-8, also called CXCL8) are displayed on the endothelial luminal surface bound to glycosaminoglycans. As the rolling neutrophil encounters these chemokines, intracellular signaling activates neutrophil surface integrins (LFA-1 and Mac-1, both members of the beta-2 integrin family, CD11/CD18) from a low affinity "bent" conformation to a high affinity "extended" conformation. These activated integrins bind tightly to ICAM-1 (intercellular adhesion molecule 1) on the endothelium, arresting the neutrophil completely. Step 3 (diapedesis): the firmly adherent neutrophil extends pseudopods between endothelial cells and migrates through the paracellular junction, guided by PECAM-1 (CD31) homophilic interactions between the neutrophil and endothelial cell junctions. The neutrophil then crosses the basement membrane using secreted matrix metalloproteinases.' },
        { id: 'kp3', weight: 1, description: 'Step 4 (chemotaxis): once in the tissue, the neutrophil migrates along a concentration gradient of chemoattractants toward the site of maximal infection. Key chemoattractants include bacterial formylated peptides (fMLP), complement fragment C5a, leukotriene B4, and IL-8. The neutrophil detects these gradients through G protein coupled receptors on its surface and moves by extending pseudopods in the direction of highest chemoattractant concentration while retracting the trailing edge, a process requiring actin polymerization at the leading edge and myosin contraction at the rear.' },
      ],
      common_errors: [
        'Confusing selectin mediated rolling (loose, reversible, carbohydrate mediated) with integrin mediated firm adhesion (tight, activation dependent, protein to protein)',
        'Stating that ICAM-1 is on the neutrophil (ICAM-1 is on the endothelium; the integrins LFA-1 and Mac-1 are on the neutrophil)',
        'Forgetting that integrin activation requires chemokine signaling (integrins are expressed constitutively but in a low affinity state)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'neutrophil-margination-diapedesis',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 34', topic: 'neutrophil-margination-diapedesis' },
  },

  {
    id: 'atom-p2w2-oxidative-burst-mpo',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe the oxygen dependent respiratory burst in neutrophils, including the NADPH oxidase complex, superoxide generation, and the myeloperoxidase hydrogen peroxide halide system. Explain why chronic granulomatous disease patients are susceptible to catalase positive organisms.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Upon phagocytosis, the NADPH oxidase enzyme complex assembles on the phagosomal membrane. The complex consists of membrane bound cytochrome b558 (a heterodimer of gp91phox and p22phox) and cytosolic regulatory subunits (p47phox, p67phox, p40phox, and the small GTPase Rac2) that translocate to the membrane upon activation. NADPH oxidase transfers electrons from cytosolic NADPH across the membrane to molecular oxygen in the phagosome, generating superoxide anion (O2 minus). Superoxide is then converted to hydrogen peroxide (H2O2) by superoxide dismutase. H2O2 alone has moderate bactericidal activity but becomes far more potent when combined with the myeloperoxidase system.' },
        { id: 'kp2', weight: 2, description: 'Myeloperoxidase (MPO), stored in primary (azurophilic) granules, is released into the phagolysosome upon granule fusion. MPO catalyzes the reaction of H2O2 with halide ions, primarily chloride (Cl minus), to produce hypochlorous acid (HOCl). HOCl is the most potent oxidant in the neutrophil arsenal, approximately 50 times more bactericidal than H2O2 alone, and kills bacteria by oxidizing sulfhydryl groups and disrupting membrane integrity. Additional reactive oxygen species generated during the burst include hydroxyl radicals (OH dot) via the Fenton reaction (Fe2+ plus H2O2) and singlet oxygen. The oxygen independent killing mechanisms working in parallel include lysozyme (hydrolyzes peptidoglycan), defensins (form pores in bacterial membranes), lactoferrin (chelates iron from bacteria), and phagolysosomal acidification to pH 4.0.' },
        { id: 'kp3', weight: 1, description: 'In chronic granulomatous disease (CGD), genetic mutations in NADPH oxidase subunits (most commonly X linked recessive loss of gp91phox) abolish superoxide generation. The entire downstream oxidative cascade fails. Patients are especially vulnerable to catalase positive organisms (Staphylococcus aureus, Aspergillus, Serratia marcescens, Burkholderia cepacia) because catalase positive bacteria destroy the H2O2 that both the bacteria and the host might otherwise produce, eliminating any residual oxidative killing potential. Catalase negative organisms (such as streptococci) generate H2O2 during their own metabolism but cannot destroy it, so their endogenous H2O2 can partially substitute for the missing neutrophil burst, providing some defense.' },
      ],
      common_errors: [
        'Stating that the respiratory burst uses mitochondrial oxygen (it uses NADPH oxidase, which is separate from mitochondrial respiration)',
        'Confusing MPO (neutrophil enzyme using H2O2 plus Cl minus) with catalase (bacterial enzyme that destroys H2O2)',
        'Claiming that CGD patients lack neutrophils (neutrophil numbers and chemotaxis are normal; only the oxidative burst is absent)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'oxidative-burst-mpo',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 34', topic: 'oxidative-burst-mpo' },
  },

  // ── Atoms feeding r-p2-wk2-5 (WBC Differential & Macrophage System) ──

  {
    id: 'atom-p2w2-wbc-differential-counts',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'State the normal total WBC count and the differential percentage and absolute count range for each of the five major leukocyte types. Describe the bone marrow maturation sequence for granulocytes and the typical circulating half-life for neutrophils.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The normal total WBC count is 4,000 to 11,000 per microliter. The differential percentages are approximately: neutrophils 62 percent (absolute 1,800 to 7,700 per microliter), lymphocytes 30 percent (absolute 1,000 to 4,800), monocytes 5.3 percent (absolute 200 to 800), eosinophils 2.3 percent (absolute 0 to 450), and basophils 0.4 percent (absolute 0 to 200). Neutrophils are further subdivided into segmented neutrophils (mature, multilobed nucleus with 3 to 5 lobes) and band forms (immature, horseshoe shaped nucleus without segmentation). A "left shift" refers to an increased proportion of band forms in the circulation, indicating active bone marrow release in response to infection or stress.' },
        { id: 'kp2', weight: 2, description: 'Granulocyte maturation in the bone marrow follows a fixed developmental sequence: myeloblast (the first committed granulocyte precursor), promyelocyte (primary azurophilic granules appear containing MPO, defensins, and lysozyme), myelocyte (specific or secondary granules appear that define the cell type; this is the LAST stage capable of mitotic division), metamyelocyte (kidney or bean shaped indented nucleus, no further cell division), band cell (horseshoe shaped nucleus), and segmented mature granulocyte. The total time from myeloblast to mature segmented neutrophil is approximately 10 to 14 days. The bone marrow stores a reserve pool of mature granulocytes approximately 5 to 8 times the number circulating, which can be rapidly mobilized by cortisol, G-CSF, or bacterial endotoxin.' },
        { id: 'kp3', weight: 1, description: 'Mature neutrophils have a remarkably short circulating half-life of only 4 to 8 hours. Approximately half of the intravascular neutrophils are in the circulating pool (detectable on a CBC) and half are in the marginating pool (loosely adherent to endothelium, not counted). Epinephrine and exercise can demarginate neutrophils, causing a rapid "pseudoneutrophilia" without new production. After exiting the blood, neutrophils survive in tissues for 4 to 5 days before undergoing apoptosis. This short lifespan reflects their role as expendable first responders that sacrifice themselves during bacterial killing.' },
      ],
      common_errors: [
        'Stating that lymphocytes are the most numerous circulating WBC (neutrophils predominate at 62 percent in adults)',
        'Placing the myelocyte after the metamyelocyte in the maturation sequence (myelocyte comes first and is the last dividing stage)',
        'Confusing a left shift (increased bands from marrow release) with leukocytosis (increased total WBC count)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'wbc-differential-counts',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 34', topic: 'wbc-differential-counts' },
  },

  {
    id: 'atom-p2w2-monocyte-macrophage-system',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe how circulating monocytes transform into tissue macrophages. Compare monocyte and neutrophil lifespans, phagocytic capacities, and roles in the immune response. Explain the antigen presenting function of macrophages.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Monocytes circulate in the blood for 10 to 20 hours before migrating into tissues through the same adhesion cascade used by neutrophils (selectin rolling, integrin firm adhesion, diapedesis). Upon entering tissues, monocytes undergo a dramatic transformation: they enlarge 5 to 10 fold in diameter, markedly increase their content of lysosomes and hydrolytic enzymes (acid hydrolases, cathepsins, elastase, collagenase), develop extensive rough endoplasmic reticulum, and increase their mitochondrial number. This transformed cell is the tissue macrophage, which can survive for months to years in tissues, in stark contrast to neutrophils that survive only 4 to 5 days in tissues. Macrophages can also proliferate locally in response to inflammatory signals.' },
        { id: 'kp2', weight: 2, description: 'Tissue macrophages have far greater phagocytic capacity than neutrophils. A single macrophage can phagocytose approximately 100 bacteria before its own lysosomal contents accumulate to toxic levels and cause self destruction, compared to neutrophils which typically handle 3 to 20 bacteria before dying. Macrophages are also capable of phagocytosing much larger particles, including entire senescent red blood cells, dead neutrophils (efferocytosis), cellular debris, and even tumor cells. Unlike neutrophils, which are terminally differentiated and incapable of further specialization, macrophages can be activated by interferon gamma from Th1 cells to become "activated macrophages" with dramatically enhanced microbicidal and tumoricidal capability.' },
        { id: 'kp3', weight: 1, description: 'Macrophages serve as professional antigen presenting cells (APCs), bridging innate and adaptive immunity. After phagocytosing a pathogen, macrophages process ingested proteins into peptide fragments within endosomal compartments and load these peptides onto MHC class II molecules. The MHC II peptide complex is then displayed on the macrophage surface, where it can be recognized by CD4+ T helper cells bearing T cell receptors with matching specificity. Macrophages also provide co-stimulatory signals (B7 molecules binding CD28 on T cells) and secrete cytokines (IL-1, IL-12, TNF alpha) that further activate the adaptive immune response. This antigen presentation function is why macrophage depletion severely impairs adaptive immunity.' },
      ],
      common_errors: [
        'Stating that macrophages have a shorter lifespan than neutrophils (macrophages survive months to years; neutrophils only 4 to 5 days in tissue)',
        'Claiming that macrophages cannot present antigen (they are professional APCs that present on MHC class II)',
        'Confusing monocytes (blood) with macrophages (tissue); they are the same lineage at different stages',
      ],
      minimum_passing_score: 60,
    },
    topic: 'monocyte-macrophage-system',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 34', topic: 'monocyte-macrophage-system' },
  },

  // ── Atoms feeding r-p2-wk2-6 (Innate vs Acquired & Tissue Macrophages) ──

  {
    id: 'atom-p2w2-innate-vs-acquired-overview',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Compare innate and acquired immunity across four dimensions: specificity, speed of response, presence of memory, and the principal cell types involved. Explain why both systems are necessary for effective host defense.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Innate immunity provides a rapid, nonspecific first line of defense that is operational within minutes to hours of pathogen encounter. It does not generate immunologic memory, so the response is the same magnitude and speed with each exposure. Its components include: physical and chemical barriers (skin, mucosal epithelia, stomach acid, lysozyme in secretions), phagocytic cells (neutrophils and macrophages that recognize pathogens through pattern recognition receptors such as toll like receptors binding pathogen associated molecular patterns), natural killer (NK) cells (that kill virus infected and tumor cells by recognizing absence of MHC class I), the complement system (approximately 20 plasma proteins that opsonize, recruit inflammatory cells, and directly lyse pathogens via the membrane attack complex), and the acute inflammatory response.' },
        { id: 'kp2', weight: 2, description: 'Acquired (adaptive) immunity is slower on first exposure (requiring 5 to 7 days for the primary response) but is highly specific to individual antigenic epitopes, with each lymphocyte clone recognizing a single epitope shape. Its defining feature is immunologic memory: after initial activation, long lived memory B and T cells persist for years or decades, enabling a secondary response that is faster (1 to 2 days), larger (10 to 100 fold higher antibody titers), and more effective (higher affinity antibodies from affinity maturation). Acquired immunity has two branches: humoral immunity (B lymphocytes producing antibodies that neutralize extracellular pathogens and toxins) and cell mediated immunity (T lymphocytes, including CD4+ helper T cells that orchestrate the immune response and CD8+ cytotoxic T cells that kill intracellular pathogen infected cells).' },
      ],
      common_errors: [
        'Stating that innate immunity has immunologic memory (only acquired immunity generates memory)',
        'Claiming that acquired immunity responds within minutes (the primary response takes 5 to 7 days)',
        'Treating innate and acquired immunity as independent systems (innate immunity activates acquired immunity through antigen presentation)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'innate-vs-acquired-overview',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 35', topic: 'innate-vs-acquired-overview' },
  },

  {
    id: 'atom-p2w2-tissue-macrophage-specialization',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Name and locate at least five specialized tissue macrophage populations within the reticuloendothelial system (mononuclear phagocyte system). For each, describe its unique function in host defense or tissue homeostasis.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Kupffer cells line the hepatic sinusoids and constitute the largest population of fixed tissue macrophages in the body. They filter portal venous blood arriving from the gastrointestinal tract, clearing bacteria, endotoxin (lipopolysaccharide), immune complexes, and aged red blood cells before blood enters the systemic circulation. Alveolar macrophages reside within the pulmonary alveolar spaces and are the primary defense against inhaled pathogens, particulate matter, and environmental pollutants; they also clear excess surfactant to prevent pulmonary alveolar proteinosis. Splenic macrophages reside in the red pulp of the spleen, where they remove senescent or damaged erythrocytes (those with decreased deformability or altered membrane phospholipid asymmetry) and recycle iron from degraded hemoglobin back into the plasma via ferroportin for transferrin loading.' },
        { id: 'kp2', weight: 2, description: 'Microglia are the resident macrophages of the central nervous system (brain and spinal cord). They constantly survey the neural environment with motile processes, responding to injury, infection, or neurodegeneration by becoming activated phagocytes that clear debris and release inflammatory cytokines. Osteoclasts are large multinucleated cells derived from monocyte macrophage precursor fusion, residing on bone surfaces; they are the only cells capable of resorbing mineralized bone matrix through secretion of hydrochloric acid and cathepsin K into a sealed resorption lacuna. Additional specialized populations include peritoneal macrophages (defend the abdominal cavity), mesangial cells in the kidney glomerulus (clear immune complexes from the glomerular basement membrane), and Langerhans cells in the epidermis (dendritic cells of macrophage lineage that capture skin antigens and migrate to regional lymph nodes for antigen presentation to T cells).' },
      ],
      common_errors: [
        'Failing to identify Kupffer cells as the largest fixed macrophage population (they process all portal blood)',
        'Stating that osteoclasts are of osteoblast lineage (osteoclasts are derived from the monocyte macrophage lineage)',
        'Confusing Langerhans cells (epidermal dendritic antigen presenting cells) with the islets of Langerhans (endocrine pancreas)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'tissue-macrophage-specialization',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 34', topic: 'tissue-macrophage-specialization' },
  },

  // ── Atoms feeding r-p2-wk2-7 (B Cell Activation & Immunoglobulins) ───

  {
    id: 'atom-p2w2-b-cell-clonal-expansion',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe B cell activation by antigen and T helper cell co-stimulation. Explain clonal expansion, differentiation into plasma cells versus memory cells, and the kinetic differences between primary and secondary immune responses.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Each naive B cell expresses surface immunoglobulin (the B cell receptor, BCR) with a single unique antigen specificity generated by V(D)J recombination during development. When a matching antigen binds the BCR, the B cell internalizes the antigen-antibody complex by receptor mediated endocytosis, processes the antigen into peptide fragments within endosomes, and displays these fragments on MHC class II molecules. A CD4+ helper T cell (Th2) recognizing the same antigen peptide on MHC II delivers co-stimulatory signals: CD40 ligand on the T cell binds CD40 on the B cell, and the T cell secretes activating cytokines (IL-4 promotes proliferation and class switching, IL-5 promotes differentiation, IL-6 promotes plasma cell maturation). This two-signal requirement (antigen plus T cell help) prevents inappropriate B cell activation by self-antigens that lack T cell recognition.' },
        { id: 'kp2', weight: 2, description: 'After dual stimulation, the activated B cell undergoes clonal expansion, proliferating rapidly over approximately 3 to 5 days to generate a large population of cells with identical antigen specificity. Most daughter cells differentiate into plasma cells, which are antibody secreting factories with extensive rough endoplasmic reticulum that can produce and secrete approximately 2,000 antibody molecules per second. Plasma cells are short lived (days to weeks), residing primarily in the bone marrow and medullary cords of lymph nodes. A smaller but critical subset of daughter cells differentiates into memory B cells, which are long lived (years to decades), circulate through secondary lymphoid organs, and remain quiescent until re-encountering the same antigen.' },
        { id: 'kp3', weight: 1, description: 'The primary immune response (first antigen encounter) has a lag period of 5 to 7 days before detectable antibody appears, peaks at 10 to 14 days with predominantly IgM production, then declines over weeks. The secondary (anamnestic) response upon re-exposure to the same antigen is dramatically different: the lag period is only 1 to 2 days (memory cells are already present and more numerous), the peak antibody titer is 10 to 100 fold higher, the response is sustained for months, and the predominant class switches to IgG with higher binding affinity (the result of somatic hypermutation and affinity maturation in germinal centers during the primary response). This memory based enhancement is the immunologic basis of vaccination.' },
      ],
      common_errors: [
        'Stating that B cells can be fully activated by antigen alone without T cell co-stimulation (most B cell responses are T cell dependent)',
        'Claiming that all activated B cells become plasma cells (a critical subset becomes memory cells)',
        'Stating that IgG dominates the primary response (IgM is produced first; IgG dominates the secondary response)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'b-cell-clonal-expansion',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 35', topic: 'b-cell-clonal-expansion' },
  },

  {
    id: 'atom-p2w2-immunoglobulin-classes-functions',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe the basic structure of an immunoglobulin molecule (heavy chains, light chains, Fab and Fc regions). Then compare the five immunoglobulin classes (IgG, IgM, IgA, IgE, IgD) by their structure, relative serum abundance, location, and primary function.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The immunoglobulin monomer is a Y shaped molecule consisting of two identical heavy chains and two identical light chains (either kappa or lambda type), connected by disulfide bonds. Each heavy chain has one variable domain (VH) and three or four constant domains (CH1 through CH3 or CH4). Each light chain has one variable (VL) and one constant (CL) domain. The paired VH and VL domains at the two tips of the Y form the Fab (fragment antigen binding) regions, each containing a unique antigen binding site (paratope) that recognizes a specific epitope on the antigen. The Fc (fragment crystallizable) region at the stem of the Y, formed by the paired CH2 and CH3 domains of the heavy chains, determines the antibody class (isotype) and mediates effector functions including complement activation, binding to Fc receptors on phagocytes, and transplacental transport.' },
        { id: 'kp2', weight: 2, description: 'IgG (gamma heavy chain) constitutes approximately 75 percent of serum immunoglobulins and is the dominant antibody of the secondary immune response. It is the only class that crosses the placenta (providing neonatal passive immunity), has four subclasses (IgG1 through IgG4), is an effective opsonin (binds Fc gamma receptors on phagocytes), and activates the classical complement pathway. IgM (mu heavy chain) accounts for approximately 10 percent of serum immunoglobulins and exists as a pentamer in the secreted form (five monomers linked by J chain), giving it 10 antigen binding sites. IgM is the first antibody produced in a primary immune response, is highly efficient at agglutination (due to its 10 binding sites) and complement activation (one IgM pentamer can activate C1q, whereas two IgG molecules in close proximity are required). IgA (alpha heavy chain) accounts for approximately 15 percent of serum immunoglobulins and is the predominant antibody in mucosal secretions (saliva, tears, breast milk, intestinal and respiratory secretions) where it exists as a dimer linked by J chain and a secretory component that protects it from proteolytic degradation.' },
        { id: 'kp3', weight: 1, description: 'IgE (epsilon heavy chain) is present at extremely low serum concentrations (less than 0.01 percent of total immunoglobulins) but has powerful biologic effects. IgE binds with very high affinity to Fc epsilon RI receptors on mast cells and basophils; when antigen crosslinks two bound IgE molecules, the cell degranulates, releasing histamine, leukotrienes, and other mediators that cause type I immediate hypersensitivity (allergic) reactions. IgE also plays a protective role in defense against helminths (parasitic worms) by arming eosinophils for antibody dependent cellular cytotoxicity. IgD (delta heavy chain) is found primarily on the surface of naive mature B cells as a co-receptor alongside surface IgM, where it functions as part of the B cell receptor complex for antigen recognition; its precise signaling role is not fully defined and its serum concentration is negligible.' },
      ],
      common_errors: [
        'Confusing Fab (antigen binding at the tips) with Fc (effector functions at the stem) regions',
        'Stating that IgM is a dimer (IgM is a pentamer in secreted form; IgA is a dimer in secretory form)',
        'Claiming that IgE is the most abundant immunoglobulin (IgG is most abundant at 75 percent; IgE is less than 0.01 percent)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'immunoglobulin-classes-functions',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 35', topic: 'immunoglobulin-classes-functions' },
  },

  // ── Atoms feeding r-p2-wk2-8 (T Cell Maturation & Antibody Effectors) ──

  {
    id: 'atom-p2w2-thymic-selection-tolerance',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe positive and negative selection of T cells in the thymus. For each process, state the thymic region where it occurs, the selection criterion, and the consequence of failure. Explain how AIRE contributes to self-tolerance.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Immature thymocytes (double positive CD4+CD8+ cells) entering the thymic cortex undergo positive selection by cortical thymic epithelial cells. The selection criterion is whether the thymocyte T cell receptor (TCR) can bind self MHC molecules with at least moderate affinity. Thymocytes whose TCRs can bind MHC class I receive a survival signal and commit to the CD8+ single positive lineage (downregulating CD4). Those that bind MHC class II commit to the CD4+ single positive lineage (downregulating CD8). Thymocytes whose TCRs fail to recognize any self MHC molecule do not receive survival signals and undergo death by neglect (apoptosis within 3 to 4 days). This process ensures that all surviving T cells are "MHC restricted," meaning they can only recognize foreign antigen when it is presented on self MHC molecules. Approximately 90 percent of thymocytes die during positive selection.' },
        { id: 'kp2', weight: 2, description: 'Thymocytes that pass positive selection migrate to the thymic medulla for negative selection by medullary thymic epithelial cells and dendritic cells. The criterion is whether the TCR binds self-peptide presented on self-MHC with HIGH affinity. High affinity binding to self-antigen indicates that the T cell would be autoreactive and likely to attack the body own tissues if released. These self-reactive thymocytes are eliminated by apoptosis (clonal deletion). The transcription factor AIRE (autoimmune regulator) is expressed by medullary thymic epithelial cells and drives ectopic expression of tissue restricted antigens (proteins normally found only in specific organs such as insulin from pancreatic beta cells, thyroglobulin from the thyroid, and myelin basic protein from the nervous system). This allows the thymus to test T cells against a comprehensive sample of self-antigens from distant tissues, deleting those that would cause organ specific autoimmunity.' },
        { id: 'kp3', weight: 1, description: 'Together, positive and negative selection eliminate approximately 95 to 98 percent of all developing thymocytes. The small surviving fraction (2 to 5 percent) consists of T cells that are MHC restricted (can recognize antigen on self MHC) yet self-tolerant (do not react to self-antigens). Mutations in the AIRE gene cause autoimmune polyendocrinopathy candidiasis ectodermal dystrophy (APECED), in which failure to express tissue restricted antigens in the thymus allows self-reactive T cells to escape into the periphery, causing multi-organ autoimmune destruction. This demonstrates that thymic negative selection is essential for preventing autoimmune disease.' },
      ],
      common_errors: [
        'Reversing where each selection occurs (positive in cortex; negative in medulla)',
        'Stating that positive selection eliminates self-reactive cells (positive selection tests for MHC recognition; negative selection eliminates self-reactivity)',
        'Claiming that death by neglect occurs during negative selection (it occurs during positive selection when TCR cannot recognize MHC at all)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'thymic-selection-tolerance',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 35', topic: 'thymic-selection-tolerance' },
  },

  {
    id: 'atom-p2w2-antibody-effector-mechanisms',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe the four major antibody effector mechanisms by which immunoglobulins contribute to pathogen clearance: neutralization, opsonization, complement activation, and agglutination. For each, explain the molecular basis and physiologic significance.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Neutralization occurs when antibodies bind directly to functional sites on pathogens or toxins, physically blocking their interaction with host cell receptors. For example, antibodies against viral surface proteins (such as the influenza hemagglutinin) prevent viral attachment and entry into host cells, and antibodies against bacterial exotoxins (such as tetanus toxin or diphtheria toxin) prevent toxin binding to target cells. Neutralization requires only Fab binding and does not require Fc mediated effector functions, complement, or phagocytes. Opsonization occurs when antibodies (primarily IgG subclasses 1 and 3) coat a pathogen surface, and the exposed Fc regions are recognized by Fc gamma receptors on neutrophils and macrophages. This dramatically enhances phagocytic uptake (100 fold or more) because the Fc receptor provides a specific molecular handle for the phagocyte to grasp, overcoming the electrostatic repulsion between the negatively charged pathogen and phagocyte surfaces.' },
        { id: 'kp2', weight: 2, description: 'Complement activation via the classical pathway occurs when the C1q component of the first complement protein (C1) binds to the Fc regions of antibodies that are already bound to antigen on a pathogen surface. IgM is the most efficient complement activator (a single pentameric IgM molecule can activate C1q), while IgG requires at least two molecules in close proximity to create a platform for C1q binding. Classical pathway activation generates C3b (potent opsonin coating the pathogen), C3a and C5a (anaphylatoxins that trigger mast cell degranulation, vasodilation, and neutrophil chemotaxis), and the C5b-9 membrane attack complex (forms a transmembrane pore that directly lyses gram negative bacteria and enveloped viruses by disrupting membrane integrity).' },
        { id: 'kp3', weight: 1, description: 'Agglutination occurs when antibodies crosslink identical antigens on separate pathogens or cells, forming large insoluble clumps. This is most effective with IgM because its pentameric structure provides 10 antigen binding sites, allowing it to bridge many particles simultaneously. Agglutinated clumps are too large to disseminate through tissues, are cleared efficiently by phagocytes in the liver and spleen, and in the case of bacteria, are prevented from adhering to mucosal surfaces. A related mechanism, precipitation, occurs when antibodies crosslink soluble antigens (such as dissolved toxins) into insoluble immune complexes that are then cleared by phagocytes. These four mechanisms work synergistically: a single antibody molecule can simultaneously neutralize (blocking receptor binding), opsonize (presenting Fc for phagocyte binding), and activate complement (via Fc mediated C1q binding).' },
      ],
      common_errors: [
        'Stating that neutralization requires complement activation (neutralization works by Fab binding alone without complement or Fc effectors)',
        'Claiming that IgG is better at agglutination than IgM (IgM pentamer with 10 binding sites is far superior for crosslinking)',
        'Confusing opsonization (antibody coating enhancing phagocytosis via Fc receptors) with complement mediated lysis (MAC pore formation)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'antibody-effector-mechanisms',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 35', topic: 'antibody-effector-mechanisms' },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  pp2-wk-2 Ch 33 DEPTH EXPANSION ATOMS (6 atoms)
  //  RBC destruction, hemoglobin catabolism, anemia, polycythemia,
  //  hematopoietic regulation (Ch 33 slides 5-7, 22-29)
  // ═══════════════════════════════════════════════════════════════════════

  // ── Atoms feeding r-p2-wk2-9 (RBC Senescence & Bilirubin) ────────────

  {
    id: 'atom-p2w2-rbc-lifespan-splenic-destruction',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'State the normal red blood cell lifespan and explain why the mature RBC becomes fragile as it ages. Describe where and how senescent red blood cells are removed from the circulation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The mature red blood cell has a lifespan of approximately 120 days. It lacks a nucleus, mitochondria, and endoplasmic reticulum, so it cannot synthesize new proteins or carry out oxidative phosphorylation. It depends entirely on anaerobic glycolysis (the Embden Meyerhof pathway) to produce the small amounts of ATP needed to maintain membrane pliability, power the Na+/K+ ATPase that preserves cation gradients, and keep heme iron in the functional ferrous state. The pentose phosphate pathway supplies NADPH to regenerate reduced glutathione for antioxidant protection against oxidative membrane damage.' },
        { id: 'kp2', weight: 2, description: 'As the red cell ages, its metabolic enzyme systems progressively deplete, and it loses the ability to maintain membrane integrity and ion homeostasis. The cell becomes increasingly rigid, fragile, and spherical, losing the deformability required to traverse narrow microvascular passages. Such cells rupture preferentially in the splenic red pulp cords and sinusoidal slits (only 1 to 3 micrometers wide), making the spleen the primary site of senescent RBC removal. Splenic and hepatic macrophages recognize the altered membrane (including externalized phosphatidylserine) and phagocytose the cells. Approximately 200 billion red cells are removed and replaced each day.' },
      ],
      common_errors: [
        'Stating the RBC lifespan is much shorter or longer than 120 days',
        'Claiming mature RBCs perform oxidative phosphorylation (they have no mitochondria; they use anaerobic glycolysis)',
        'Identifying the liver rather than the spleen as the primary site of senescent RBC destruction',
      ],
      minimum_passing_score: 60,
    },
    topic: 'rbc-lifespan-splenic-destruction',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 33', topic: 'rbc-lifespan-splenic-destruction' },
  },

  {
    id: 'atom-p2w2-hemoglobin-catabolism-bilirubin',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Trace the catabolism of hemoglobin after a red blood cell is destroyed. Include the fate of globin, iron, and the porphyrin ring, and describe how bilirubin is processed and ultimately excreted.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'When red blood cells rupture, their hemoglobin is phagocytosed and degraded by macrophages, particularly the Kupffer cells of the liver and macrophages of the splenic red pulp. The globin chains are hydrolyzed to amino acids that re-enter the amino acid pool for reuse. The heme group is split: heme oxygenase opens the porphyrin ring, releasing the iron atom, which is returned to the blood and bound to transferrin for transport back to the bone marrow for new hemoglobin synthesis or stored as ferritin. The opened porphyrin ring is converted to biliverdin and then reduced to bilirubin.' },
        { id: 'kp2', weight: 2, description: 'The bilirubin formed in macrophages is unconjugated (lipid soluble) and is released into the blood where it travels bound to albumin. Hepatocytes take up the unconjugated bilirubin and conjugate it with glucuronic acid (via UDP glucuronosyltransferase), making it water soluble. The conjugated bilirubin is secreted into bile and enters the intestine, where bacteria convert it to urobilinogen; most is excreted as stercobilin in feces (giving stool its color), while a small fraction is reabsorbed and excreted as urobilin in the urine. Accumulation of bilirubin produces jaundice: hemolytic causes raise unconjugated bilirubin, while biliary obstruction raises conjugated bilirubin.' },
      ],
      common_errors: [
        'Stating that iron is excreted during hemoglobin breakdown (iron is conserved and recycled via transferrin or stored as ferritin)',
        'Reversing the bilirubin pattern (hemolysis raises unconjugated; obstruction raises conjugated)',
        'Omitting hepatic conjugation with glucuronic acid as the step that makes bilirubin water soluble for biliary excretion',
      ],
      minimum_passing_score: 60,
    },
    topic: 'hemoglobin-catabolism-bilirubin',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 33', topic: 'hemoglobin-catabolism-bilirubin' },
  },

  // ── Atoms feeding r-p2-wk2-10 (Anemia Classification & Circulation) ──

  {
    id: 'atom-p2w2-anemia-types-classification',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Define anemia and describe the four major etiologic categories: blood loss, aplastic, megaloblastic, and hemolytic. For each, state the mechanism and the characteristic red cell morphology.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Anemia is a deficiency of hemoglobin in the blood that reduces oxygen carrying capacity. Blood loss anemia follows hemorrhage: after acute blood loss, plasma volume is restored within 1 to 3 days while red cell concentration takes 3 to 6 weeks to recover, and cells are initially normocytic and normochromic; chronic blood loss depletes iron stores and produces hypochromic, microcytic cells. Aplastic anemia results from bone marrow failure (caused by radiation, chemotherapy, chemical toxins, autoimmune destruction, or idiopathic causes) leading to inadequate red cell production with normocytic cells; it is treated with transfusions and/or bone marrow transplantation.' },
        { id: 'kp2', weight: 2, description: 'Megaloblastic anemia results from deficiency of vitamin B12 and/or folic acid, which impairs DNA replication and causes nuclear maturation failure while cytoplasmic growth continues; the result is large, fragile, irregularly shaped macrocytes (MCV above 100 fL) that rupture easily and can cause profound anemia. Hemolytic anemia results from shortened red cell survival due either to hereditary defects of the membrane or hemoglobin that increase cellular fragility (hereditary spherocytosis, sickle cell anemia) or to immune mediated destruction (erythroblastosis fetalis, the hemolytic disease of the newborn). The four categories therefore span impaired production, increased loss, and increased destruction.' },
      ],
      common_errors: [
        'Classifying megaloblastic anemia as microcytic (it is macrocytic; iron deficiency from chronic blood loss is microcytic)',
        'Confusing aplastic anemia (production failure) with hemolytic anemia (increased destruction)',
        'Stating that red cell concentration recovers within days after hemorrhage (fluid volume recovers in 1 to 3 days, but RBC concentration takes 3 to 6 weeks)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'anemia-types-classification',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 33', topic: 'anemia-types-classification' },
  },

  {
    id: 'atom-p2w2-anemia-circulatory-effects',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Explain the circulatory consequences of anemia. Describe the two distinct reasons anemia produces a high cardiac output state and explain why exercise capacity is markedly reduced.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Anemia raises cardiac output through two independent mechanisms. First, decreased blood viscosity: a low hematocrit reduces the resistance of blood to flow through vessels, which lowers total peripheral resistance and increases venous return to the heart, thereby raising cardiac output. Second, decreased oxygen carrying capacity: the reduced hemoglobin produces tissue hypoxia, which triggers local vasodilation in the peripheral tissues; this vasodilation further decreases peripheral resistance and increases venous return. The combined effect can raise resting cardiac output to 2 to 3 times normal in severe anemia, a so called high output state.' },
        { id: 'kp2', weight: 2, description: 'Despite the markedly elevated resting cardiac output, exercise capacity in the anemic patient is severely reduced. Because so much of the cardiac reserve is already being used simply to meet resting oxygen demands, little additional pumping capacity remains. During exercise the tissues demand still more oxygen, but the heart is already near its maximal output, so it cannot increase delivery further. The result is acute tissue hypoxia, profound fatigue, and in severe cases acute cardiac failure. This is clinically important to the CRNA because anemic patients tolerate the added cardiovascular stress of anesthesia and surgery poorly and may unmask underlying cardiac disease.' },
      ],
      common_errors: [
        'Attributing the high cardiac output solely to hypoxia and omitting the decreased viscosity mechanism',
        'Stating that exercise capacity is preserved because resting cardiac output is high (the elevated resting output consumes the reserve, so exercise capacity is reduced)',
        'Claiming anemia decreases cardiac output (it increases cardiac output)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'anemia-circulatory-effects',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 33', topic: 'anemia-circulatory-effects' },
  },

  // ── Atoms feeding r-p2-wk2-11 (Polycythemia & Hematopoiesis) ─────────

  {
    id: 'atom-p2w2-polycythemia-hyperviscosity',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Distinguish secondary polycythemia from polycythemia vera, including the underlying cause, red cell count, hematocrit, and effect on blood volume. Explain the circulatory consequences of hyperviscosity.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Secondary polycythemia is an appropriate, erythropoietin driven increase in red cell mass, with the red cell count rising approximately 30 percent to 6 to 7 million per cubic millimeter. It occurs in response to chronic hypoxemia from heart or lung disease, or as physiologic polycythemia in people who reside at high altitude (14,000 to 17,000 feet), where the higher red cell mass markedly enhances exercise capacity. Polycythemia vera, by contrast, is a clonal myeloproliferative disorder in which a genetic abnormality of the hematopoietic stem cell drives autonomous, erythropoietin independent overproduction, usually involving all blood cell lineages.' },
        { id: 'kp2', weight: 2, description: 'In polycythemia vera the red cell count reaches 7 to 8 million per cubic millimeter, the hematocrit rises to 60 to 70 percent, and the blood volume increases almost twofold. Blood viscosity can rise to as much as 3 times normal (about 10 times the viscosity of water). This hyperviscosity slows blood flow through the vasculature, greatly increasing the risk of thrombosis and paradoxical tissue hypoxia, increasing cardiac workload, and contributing to hypertension. Treatment centers on therapeutic phlebotomy to lower the hematocrit. The anesthetic relevance is heightened thrombotic risk and altered hemodynamics in these patients.' },
      ],
      common_errors: [
        'Stating that polycythemia vera is erythropoietin driven (it is an autonomous clonal disorder; the secondary type is EPO driven)',
        'Forgetting that hyperviscosity increases the risk of thrombosis and increases cardiac workload',
        'Confusing the modest red cell rise of secondary polycythemia with the extreme hematocrit of 60 to 70 percent in polycythemia vera',
      ],
      minimum_passing_score: 60,
    },
    topic: 'polycythemia-hyperviscosity',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 33', topic: 'polycythemia-hyperviscosity' },
  },

  {
    id: 'atom-p2w2-hematopoiesis-lineages',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe the regulation of hematopoiesis. Include the sites of erythropoiesis across the lifespan, the role of growth and differentiation inducers, and the differentiation of the pluripotent hematopoietic stem cell into the major blood cell lineages.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The site of erythropoiesis shifts during development. During the first few weeks of gestation, primitive red cells are produced in the yolk sac. During mid gestation, the liver is the main site (with contributions from the spleen and lymph nodes). From the last month of gestation through adulthood, the bone marrow takes over; in adults the marrow of the axial skeleton (vertebrae, sternum, ribs, and pelvis) is the principal site. Hematopoiesis is driven by growth inducers (growth factors such as interleukin 3) and differentiation inducers, and it adjusts to physiologic demand: hypoxia stimulates erythropoiesis through erythropoietin, while infection and inflammation stimulate leukopoiesis.' },
        { id: 'kp2', weight: 2, description: 'The pluripotent (multipotent) hematopoietic stem cell gives rise sequentially to committed progenitor cells called colony forming units. In the myeloid pathway, these include CFU-E (committed to erythrocytes), CFU-GM (committed to granulocytes and monocytes), and CFU-M (committed to megakaryocytes, which fragment into platelets). The separate lymphoid pathway produces T lymphocytes and B lymphocytes. Because all of these lineages descend from a single pluripotent stem cell, a clonal stem cell disorder such as polycythemia vera typically elevates all cell lineages rather than red cells alone, which is a clue distinguishing it from secondary polycythemia.' },
      ],
      common_errors: [
        'Stating that adult erythropoiesis occurs mainly in the liver (the liver is the mid gestation site; the bone marrow is the adult site)',
        'Confusing the myeloid lineage progenitors (CFU-E, CFU-GM, CFU-M) with the separate lymphoid lineage (T and B lymphocytes)',
        'Forgetting that hematopoiesis is demand responsive (hypoxia drives erythropoiesis; infection drives leukopoiesis)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'hematopoiesis-lineages',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 33', topic: 'hematopoiesis-lineages' },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  pp2-wk-2 Ch 34 DEPTH EXPANSION ATOMS (6 atoms)
  //  Phagocytosis recognition and digestion, inflammation, the systemic
  //  marrow response, granulocyte specialization, and white cell disorders
  //  (Ch 34 slides 13-17, 24-37). These carve territory not already covered
  //  by the existing adhesion-cascade, oxidative-burst, differential-count,
  //  monocyte-macrophage, and tissue-macrophage atoms.
  // ═══════════════════════════════════════════════════════════════════════

  // ── Atoms feeding r-p2-wk2-12 (Phagocytosis: Recognition & Digestion) ──

  {
    id: 'atom-p2w2-phagocyte-recognition-opsonization',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Explain how phagocytes distinguish appropriate targets from the body\'s own cells, define opsonization, and describe how a particle is engulfed into a phagosome. Contrast the phagocytic capacity of neutrophils and macrophages.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Phagocytosis is the ingestion of particulate matter by a cell, and because indiscriminate ingestion would damage healthy tissue, phagocytes must distinguish foreign particles from the body\'s own cells. A particle is treated as an appropriate target when it has a rough surface, when it lacks the protective protein coat that normal host cells carry, and above all when it has been immunologically marked. This marking, called opsonization, occurs when antibodies and activated complement components (such as C3b) coat the microbe and are then recognized by specific receptors on the phagocyte surface, which greatly increases the rate and efficiency of ingestion.' },
        { id: 'kp2', weight: 2, description: 'To engulf a recognized particle, the phagocyte projects pseudopods that surround it and fuse on the far side, enclosing the particle within a membrane bound vesicle called a phagosome. Neutrophils are mature cells already circulating in the blood and can attack organisms immediately upon reaching infected tissue, but each handles only a limited number before dying. Monocytes that migrate into the tissues enlarge and mature into macrophages, which are far more powerful: a single activated macrophage can ingest as many as 100 bacteria, can engulf much larger particles such as damaged red blood cells and malarial parasites, and can extrude the debris and continue functioning for many months.' },
      ],
      common_errors: [
        'Stating that phagocytes ingest material indiscriminately (recognition depends on a rough surface, lack of a protein coat, and opsonization by antibody and complement)',
        'Defining opsonization as direct killing (it is the immunologic marking of a target with antibody and complement to promote its ingestion)',
        'Claiming the neutrophil ingests more organisms than the macrophage (the macrophage is far more powerful, ingesting up to about 100 bacteria)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'phagocyte-recognition-opsonization',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 34', topic: 'phagocyte-recognition-opsonization' },
  },

  {
    id: 'atom-p2w2-phagolysosome-digestion',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe what happens to a microbe after it has been enclosed within a phagosome. Include the vesicle that forms, the enzymes involved, the special role of lipases in macrophages, and how residual material is removed.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Once a particle has been ingested into a phagosome, the phagosome immediately fuses with one or more lysosomes and other cytoplasmic granules to form a single larger vesicle called a phagolysosome, or digestive vesicle. The lysosomal granules discharge their contents into this vesicle, where proteolytic enzymes break the ingested organism down into its constituent molecules. This intracellular digestion occurs in both neutrophils and macrophages and is the principal non oxidative means by which an ingested microbe is dismantled after it has been engulfed.' },
        { id: 'kp2', weight: 2, description: 'In macrophages the granules additionally contain large amounts of lipases, enzymes that digest the thick lipid membranes possessed by certain organisms; this lipase activity is especially important for killing the tuberculosis bacillus and some other lipid coated bacteria that resist ordinary proteolytic digestion. After the organism has been digested, the undigestible residual material is expelled from the cell by exocytosis. This proteolytic and lipolytic digestion works in parallel with the separate oxygen dependent respiratory burst, so that an ingested organism is usually both chemically digested and oxidatively killed.' },
      ],
      common_errors: [
        'Stating that the phagosome digests the microbe by itself (it must first fuse with lysosomes to form the phagolysosome that contains the digestive enzymes)',
        'Omitting the role of macrophage lipases in killing the tuberculosis bacillus',
        'Forgetting that residual debris is removed by exocytosis after digestion',
      ],
      minimum_passing_score: 60,
    },
    topic: 'phagolysosome-digestion',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 34', topic: 'phagolysosome-digestion' },
  },

  // ── Atoms feeding r-p2-wk2-13 (Inflammation & Marrow Response) ───────

  {
    id: 'atom-p2w2-inflammation-signs-mediators',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Define inflammation and list its four cardinal signs. Describe the physiologic tissue changes and chemical mediators that produce them, explain how an inflamed area is walled off, and state what pus is composed of.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Inflammation is a local tissue response driven by chemical mediators and recognized clinically by four cardinal signs: heat, redness, swelling, and pain. The underlying physiologic changes are vasodilation with increased local blood flow, which causes the heat and redness; increased capillary permeability, which lets plasma proteins and fluid leak into the interstitial spaces and produces the swelling; coagulation of the interstitial fluid; accumulation of granulocytes and monocytes at the site; and swelling of the tissue cells themselves. The principal mediators are histamine, bradykinin, serotonin, and prostaglandins, along with complement products, clotting system components, and lymphokines from sensitized lymphocytes.' },
        { id: 'kp2', weight: 2, description: 'An important effect of inflammation is to wall off the injured region from the surrounding tissue. Fibrinogen leaking from the permeable vessels clots in the interstitial spaces and tissue lymphatics, minimizing the movement of fluid and microbes into and out of the area and delaying the spread of infection. Different organisms are contained with differing success: staphylococci cause intense inflammation and are walled off effectively, whereas streptococci cause less intense walling and tend to spread. Pus is the accumulation of dead neutrophils, dead bacteria, dead macrophages, and protease digested necrotic tissue, mixed with tissue fluid, often within a cavity; over days to weeks it is gradually absorbed into the surrounding tissue and lymph.' },
      ],
      common_errors: [
        'Listing fewer than the four cardinal signs of inflammation (heat, redness, swelling, and pain) or omitting the vascular changes that cause them',
        'Stating that increased blood flow causes the swelling (the swelling is due to increased capillary permeability with fluid leak; increased flow causes heat and redness)',
        'Forgetting that fibrinogen clotting is the mechanism that walls off the inflamed area',
      ],
      minimum_passing_score: 60,
    },
    topic: 'inflammation-signs-mediators',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 34', topic: 'inflammation-signs-mediators' },
  },

  {
    id: 'atom-p2w2-neutrophilia-marrow-csf',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe the systemic response of the white cell system to a significant infection. Include neutrophilia, the signaling loop by which activated macrophages drive the bone marrow through colony stimulating factors, and the time course over which macrophages come to dominate the lesion.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Intense inflammation produces neutrophilia, a rise in the circulating neutrophil count from a normal value of about 4,000 to 5,000 up to 15,000 to 25,000 per cubic millimeter. The immediate increase comes from mobilization of mature neutrophils that are already stored in the bone marrow reserve, released into the blood by inflammatory mediators. This rapid, preformed response allows the number of available phagocytes to climb several fold within hours of a serious infection, long before the marrow can manufacture additional cells.' },
        { id: 'kp2', weight: 2, description: 'To sustain the elevated demand, activated macrophages release tumor necrosis factor and interleukin 1, which act on the macrophages themselves and on endothelial cells, fibroblasts, and lymphocytes to generate colony stimulating factors (GM-CSF, G-CSF, and M-CSF). These growth factors drive the bone marrow to increase production of granulocytes and monocytes by 20 to 50 fold, with the first newly made mature cells appearing after 3 to 4 days and the heightened output sustainable for months. Meanwhile circulating monocytes accumulate at the site and mature into macrophages, which over the following weeks become the dominant inflammatory cell, clearing residual bacteria and necrotic debris and directing tissue repair.' },
      ],
      common_errors: [
        'Stating that the immediate neutrophilia comes from new marrow production (the rapid rise is from mobilization of the stored reserve; colony stimulating factor driven production takes 3 to 4 days)',
        'Confusing the inflammatory cytokines TNF and IL-1 with the colony stimulating factors they induce (GM-CSF, G-CSF, M-CSF)',
        'Claiming neutrophils remain the dominant cell throughout (macrophages become dominant over the following weeks)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'neutrophilia-marrow-csf',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 34', topic: 'neutrophilia-marrow-csf' },
  },

  // ── Atoms feeding r-p2-wk2-14 (Granulocyte Specialization & Disorders) ──

  {
    id: 'atom-p2w2-eosinophil-basophil-mast',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe the defensive roles of eosinophils and of basophils and mast cells, naming the substances each releases, and explain at the cellular level how an immediate allergic or anaphylactic reaction is triggered.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Eosinophils are weak phagocytes that are particularly important in defending against parasitic infections such as schistosomiasis and trichinosis. They attach to the surface of the parasite and release killing substances, including hydrolytic enzymes, reactive oxygen species, and a larvicidal polypeptide called major basic protein. Eosinophils also accumulate in tissues affected by allergic reactions, partly in response to an eosinophil chemotactic factor released from basophils and mast cells, and they appear to help detoxify some of the inflammatory mediators that basophils release.' },
        { id: 'kp2', weight: 2, description: 'Basophils circulate in the blood and are functionally very similar to the mast cells that reside in the tissues; both cell types store and release histamine, bradykinin, serotonin, and heparin. They are the central effector cells of immediate (type I) hypersensitivity: they bind immunoglobulin E (IgE) antibody to receptors on their surface, and when a specific allergen cross links adjacent surface bound IgE molecules, the cells degranulate, releasing histamine, bradykinin, serotonin, heparin, leukotrienes, and lysosomal enzymes. These mediators produce the vasodilation, increased permeability, and bronchoconstriction of allergic and anaphylactic reactions, which is why perioperative anaphylaxis is a major anesthetic concern.' },
      ],
      common_errors: [
        'Confusing eosinophils (parasite defense and allergy) with basophils and mast cells (IgE mediated immediate hypersensitivity)',
        'Stating that mast cells are found in the blood and basophils in the tissues (it is the reverse: basophils circulate, mast cells are in tissues)',
        'Claiming degranulation is triggered by IgG or direct antigen contact (it requires allergen cross linking of surface bound IgE)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'eosinophil-basophil-mast',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 34', topic: 'eosinophil-basophil-mast' },
  },

  {
    id: 'atom-p2w2-leukopenia-leukemia',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe leukopenia and leukemia. For leukopenia, give the usual cause and the clinical danger. For leukemia, give the defining abnormality, the major classifications, and the clinical consequences.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Leukopenia is an abnormally low white blood cell count, usually resulting from decreased production in the bone marrow. Common causes include ionizing radiation, chemical toxins, and certain medications that suppress the marrow. Because the white cells provide the body\'s phagocytic defense, leukopenia removes protection against infection, so that organisms which are ordinarily harmless can cause clinically severe infections; mucous membrane ulceration and respiratory infection may appear within about two days of marrow shutdown. In most cases, with proper supportive care, the surviving marrow stem cells can eventually reconstitute normal blood cell counts.' },
        { id: 'kp2', weight: 2, description: 'Leukemia is the opposite disorder: an uncontrolled, clonal overproduction of abnormal white blood cells arising from a genetic mutation in a hematopoietic precursor. Leukemias are classified by lineage as lymphocytic or myelogenous, and by tempo as acute (immature, rapidly progressive cells) or chronic (more differentiated cells, sometimes evolving over 10 to 20 years). The proliferating leukemic cells replace normal bone marrow, causing infection, bleeding, and pathologic bone fractures; they infiltrate and enlarge the spleen, lymph nodes, and liver; and their high metabolic demand produces wasting. The combination of marrow failure and immune compromise makes these patients fragile in the perioperative period.' },
      ],
      common_errors: [
        'Confusing leukopenia (too few white cells from reduced marrow production) with leukemia (malignant overproduction of abnormal white cells)',
        'Stating that leukemia improves immune defense because white cell numbers are high (the cells are abnormal and nonfunctional, and they crowd out normal marrow, causing infection and bleeding)',
        'Forgetting that leukemic marrow replacement causes bleeding and pathologic fractures in addition to infection',
      ],
      minimum_passing_score: 60,
    },
    topic: 'leukopenia-leukemia',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 34', topic: 'leukopenia-leukemia' },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  pp2-wk-2 Ch 35 DEPTH EXPANSION ATOMS (6 atoms)
  //  Clinical & foundational immunology: hypersensitivity classification,
  //  allergic syndromes, autoimmunity, immunization, antigen/epitope/hapten,
  //  antibody diversity & clonal selection (Ch 35 slides 4, 10, 28-32)
  // ═══════════════════════════════════════════════════════════════════════

  // ── Atoms feeding r-p2-wk2-15 (Hypersensitivity & Allergic Disease) ──
  {
    id: 'atom-p2w2-hypersensitivity-classification',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Classify the hypersensitivity reactions using the Gell and Coombs system (types I through IV). For each type, state the immune mediator, the typical time course, and a representative clinical example, and explain the central distinction between immediate (antibody mediated) and delayed (T cell mediated) hypersensitivity.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Hypersensitivity reactions are exaggerated or inappropriate immune responses that damage host tissue, traditionally divided into four Gell and Coombs types. Types I, II, and III are antibody mediated and develop within minutes to hours (immediate). Type I (immediate or anaphylactic) is mediated by IgE bound to mast cells and basophils; allergen cross linking of surface IgE triggers degranulation within minutes, producing anaphylaxis, urticaria, hay fever, and allergic asthma. Type II (cytotoxic) is mediated by IgG or IgM directed against antigens fixed on a cell surface, causing destruction through complement activation, opsonized phagocytosis, or antibody dependent cellular cytotoxicity; examples include transfusion reactions, hemolytic disease of the newborn, autoimmune hemolytic anemia, and myasthenia gravis (antibodies against the acetylcholine receptor). Type III (immune complex) results from soluble antigen antibody complexes that deposit in vessel walls, glomeruli, and joints, where they activate complement and recruit neutrophils; examples include systemic lupus erythematosus, poststreptococcal glomerulonephritis, and serum sickness.' },
        { id: 'kp2', weight: 2, description: 'Type IV (delayed type) hypersensitivity is fundamentally different because it is mediated by sensitized T lymphocytes rather than by antibody, and therefore develops slowly, typically peaking at 48 to 72 hours after antigen exposure (hence delayed). On first contact the antigen is processed and presented on MHC, sensitizing antigen specific T cells; on re-exposure these memory T cells are reactivated. CD4 positive helper T cells release cytokines such as interferon gamma that recruit and activate macrophages, which cause most of the tissue damage, while CD8 positive cytotoxic T cells can directly kill antigen bearing cells. Classic examples include contact dermatitis from poison ivy and nickel, the tuberculin (PPD) skin test reaction, and granuloma formation in tuberculosis; these reactions are usually cutaneous but can occur in the lungs with airborne antigens. The key clinical distinction is timing and mediator: immediate reactions (types I to III) are antibody mediated and rapid, whereas delayed (type IV) reactions are T cell mediated and take one to three days to manifest.' },
      ],
      common_errors: [
        'Stating that type IV (delayed) hypersensitivity is antibody mediated (it is mediated by sensitized T cells and develops over 48 to 72 hours)',
        'Confusing type II cytotoxic reactions, in which antibody targets a cell bound antigen, with type III immune complex reactions, in which soluble antigen antibody complexes deposit in tissues',
        'Claiming that type I reactions take days to appear (IgE mediated reactions occur within minutes of allergen exposure)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'hypersensitivity-classification',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 35', topic: 'hypersensitivity-classification' },
  },

  {
    id: 'atom-p2w2-anaphylaxis-allergic-syndromes',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Describe the major clinical syndromes produced by immediate (IgE mediated) allergy: anaphylaxis, urticaria, hay fever (allergic rhinitis), and asthma. For each, give the principal mediators, the dominant pathophysiology, and the standard treatment, and identify the features most important to anesthetic management.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Anaphylaxis is the systemic, potentially fatal form of immediate hypersensitivity, caused by widespread mast cell and basophil degranulation that releases histamine and other mediators throughout the circulation. The result is generalized vasodilation (causing profound hypotension and distributive shock), greatly increased capillary permeability (causing intravascular volume loss, angioedema, and laryngeal edema), and leukotriene driven bronchospasm with wheezing. Because the cardiovascular and airway collapse can be fatal within minutes, the first line treatment is intramuscular epinephrine, which reverses vasodilation, supports blood pressure, and relieves bronchospasm, supported by antihistamines, intravenous fluids, and corticosteroids. This is a critical anesthetic concern because perioperative anaphylaxis to neuromuscular blocking drugs, antibiotics, or latex presents as sudden hypotension and bronchospasm. Urticaria (hives) is the localized cutaneous form: histamine release in the skin causes localized vasodilation with a red flare and increased permeability with wheals and swelling, and it is treated with antihistamines.' },
        { id: 'kp2', weight: 2, description: 'Hay fever (allergic rhinitis) is an immediate allergic reaction localized to the upper respiratory mucosa and conjunctiva. It is largely histamine mediated: inhaled allergen triggers vascular dilation in the nasal passages, sinuses, and eyes, with leakage of fluid producing congestion, rhinorrhea, and sneezing, and it is treated with antihistamines and local (intranasal) corticosteroids. Allergic asthma is the lower airway syndrome and is mediated largely by leukotrienes rather than by histamine; the leukotrienes cause sustained bronchospasm, airway edema, and mucus secretion, producing wheezing and airflow obstruction. Treatment targets these mechanisms with beta-2 adrenergic agonists for bronchodilation, inhaled corticosteroids to suppress airway inflammation, and leukotriene receptor antagonists, with attention to any coexisting upper airway component. Asthma is highly relevant to anesthesia because airway instrumentation and certain drugs can provoke intraoperative bronchospasm, and the leukotriene basis explains why beta agonists and steroids, rather than antihistamines, are the mainstays of treatment.' },
      ],
      common_errors: [
        'Stating that antihistamines are the first line treatment for anaphylaxis (intramuscular epinephrine is first line; antihistamines are adjuncts)',
        'Claiming that asthma is primarily histamine mediated (it is mediated largely by leukotrienes, which is why beta agonists, inhaled steroids, and leukotriene blockers are used)',
        'Confusing urticaria (localized skin wheals) with anaphylaxis (systemic vasodilation, volume loss, and bronchospasm that can be fatal)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'anaphylaxis-allergic-syndromes',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 35', topic: 'anaphylaxis-allergic-syndromes' },
  },

  // ── Atoms feeding r-p2-wk2-16 (Autoimmunity & Immunization) ──────────
  {
    id: 'atom-p2w2-autoimmunity-tolerance-failure',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Explain how failure of immunologic tolerance produces autoimmune disease, including the principal mechanisms by which self tolerance is lost. Then describe four classic autoimmune disorders named in the chapter (rheumatic fever, poststreptococcal glomerulonephritis, myasthenia gravis, and systemic lupus erythematosus), identifying the target and mechanism of each.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Immunologic tolerance normally prevents the immune system from attacking host tissue: self reactive T cell and B cell clones that bind self antigen with high affinity are deleted by apoptosis during clonal selection (central tolerance in the thymus and bone marrow), and additional peripheral mechanisms (anergy and regulatory T cells) restrain any that escape. Autoimmunity arises when these safeguards fail and self reactive clones become activated against self antigens. The principal mechanisms include molecular mimicry (a microbial antigen closely resembles a self antigen, so antibodies or T cells raised against the pathogen cross react with host tissue), exposure of previously sequestered self antigens after tissue injury, failure of clonal deletion or regulatory T cell control, and inappropriate expression of MHC class II on cells that do not normally present antigen. The resulting tissue injury is mediated either by autoantibodies (types II and III hypersensitivity) or by self reactive T cells (type IV hypersensitivity).' },
        { id: 'kp2', weight: 2, description: 'Rheumatic fever is the classic example of molecular mimicry: antibodies raised against the M protein of group A streptococci cross react with antigens in cardiac valves, myocardium, and joints, producing carditis and arthritis after a streptococcal pharyngitis. Poststreptococcal glomerulonephritis is a type III (immune complex) disease in which streptococcal antigen antibody complexes deposit in the glomerular basement membrane, activating complement and causing hematuria and renal impairment. Myasthenia gravis is a type II disorder in which autoantibodies are directed against the nicotinic acetylcholine receptors at the neuromuscular junction, reducing functional receptors and causing fatigable skeletal muscle weakness; it is profoundly important in anesthesia because affected patients are markedly sensitive to nondepolarizing neuromuscular blocking drugs and relatively resistant to succinylcholine. Systemic lupus erythematosus is a multisystem disease in which autoantibodies form against many self antigens (including antinuclear and anti double stranded DNA antibodies), producing widespread immune complex injury to skin, joints, kidneys, and serous membranes.' },
      ],
      common_errors: [
        'Stating that autoimmune disease is caused by foreign antigens rather than by loss of self tolerance (the immune attack is directed against self antigens of the host)',
        'Forgetting that myasthenia gravis patients are very sensitive to nondepolarizing neuromuscular blockers and resistant to succinylcholine (a key anesthetic implication)',
        'Confusing the mechanism of rheumatic fever (molecular mimicry with cross reactive antibodies) with that of poststreptococcal glomerulonephritis (immune complex deposition)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'autoimmunity-tolerance-failure',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 35', topic: 'autoimmunity-tolerance-failure' },
  },

  {
    id: 'atom-p2w2-active-passive-immunization',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Distinguish active from passive immunization. For active immunity, describe the main vaccine types (killed organisms, toxoids, and live attenuated organisms) with examples and explain why the protection is durable. For passive immunity, describe how it is conferred, give examples, and explain why its protection is immediate but short lived.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Active immunization stimulates the body to mount its own adaptive immune response and, critically, to generate immunologic memory, so protection develops slowly over one to several weeks but is long lasting and can be boosted. There are three main approaches. Killed (inactivated) vaccines introduce whole organisms that have been destroyed so they cannot replicate but still display their antigens, as in typhoid and whooping cough (pertussis) vaccines. Toxoid vaccines use chemically inactivated bacterial exotoxins that retain antigenicity but lose toxicity, teaching the body to neutralize the native toxin, as in diphtheria and tetanus toxoid. Live attenuated vaccines use organisms weakened so they replicate without causing disease, generating a strong and durable response that most closely mimics natural infection, as in smallpox, yellow fever, oral polio, and measles vaccines. Because active immunity creates memory B and T cells, re-exposure produces a rapid, amplified secondary response.' },
        { id: 'kp2', weight: 2, description: 'Passive immunization confers protection by transferring preformed antibodies, or less commonly activated T cells, from an immune donor to the recipient, rather than having the recipient generate them. Because the effector molecules are supplied ready made, protection is immediate, which is its main advantage in urgent situations. However, the recipient does not generate the response and no memory is created, so the protection is temporary: the transferred antibodies are gradually catabolized and typically last only about two to three weeks. Naturally occurring examples include maternal IgG crossing the placenta and IgA supplied in breast milk, both protecting the newborn until its own immune system matures. Clinical examples include antitoxins and antivenoms, pooled human immunoglobulin, and specific hyperimmune globulins (such as those given after exposure to tetanus, rabies, or hepatitis), all of which provide rapid but transient protection.' },
      ],
      common_errors: [
        'Stating that passive immunization generates immunologic memory (only active immunization creates memory; passive immunity is immediate but lasts only about two to three weeks)',
        'Confusing toxoid vaccines (inactivated toxin, as in tetanus and diphtheria) with live attenuated vaccines (weakened replicating organisms, as in measles and oral polio)',
        'Claiming that active immunization protects immediately (it requires one to several weeks to develop a response, unlike passive immunity which is immediate)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'active-passive-immunization',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 35', topic: 'active-passive-immunization' },
  },

  // ── Atoms feeding r-p2-wk2-17 (Antigen Recognition & Specificity) ────
  {
    id: 'atom-p2w2-antigen-epitope-hapten',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Define antigen, immunogen, epitope (antigenic determinant), and hapten. Explain the molecular properties that make a substance antigenic, and explain why haptens are clinically important in drug allergy.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'An antigen is any substance that can be specifically recognized and bound by an antibody or by a lymphocyte antigen receptor; an immunogen is an antigen that can also provoke an adaptive immune response on its own. Antigens are unique to each organism and are usually proteins or large polysaccharides bearing recurring molecular groups on their surfaces. Three properties make a substance strongly immunogenic: foreignness (it must be recognized as non self, since self antigens are normally tolerated), sufficient molecular size (generally a molecular weight above roughly 8,000 daltons, with the largest and most complex molecules being the most immunogenic), and chemical complexity. The specific small molecular region of an antigen that is actually recognized and bound by a given antibody or receptor is called the epitope, or antigenic determinant; a single large antigen typically carries many different epitopes, so it can be recognized by several different lymphocyte clones at once.' },
        { id: 'kp2', weight: 2, description: 'A hapten is a small molecule, usually well under 1,000 daltons, that is antigenic but not immunogenic by itself: it can be bound by an antibody once that antibody exists, but it is too small to provoke an immune response on its own. A hapten becomes immunogenic only after it binds covalently to a large carrier protein, so that the combined hapten carrier complex is large and complex enough to trigger a response; the resulting antibodies can then recognize the small molecule alone. This concept is clinically critical in anesthesia and pharmacology because many drugs and drug metabolites act as haptens: penicillins and other small reactive drugs covalently bind host proteins to form hapten carrier complexes, sensitizing the immune system and producing drug allergy and, on re-exposure, IgE mediated anaphylaxis. Recognizing the hapten mechanism explains why otherwise small, simple drug molecules can cause severe allergic reactions.' },
      ],
      common_errors: [
        'Stating that a hapten can induce an immune response by itself (a hapten is antigenic but not immunogenic until it conjugates to a carrier protein)',
        'Confusing the antigen (the whole molecule) with the epitope (the specific small region actually bound by the antibody or receptor)',
        'Claiming that small molecules are the most immunogenic (large, complex, foreign molecules above roughly 8,000 daltons are the most immunogenic)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'antigen-epitope-hapten',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 35', topic: 'antigen-epitope-hapten' },
  },

  {
    id: 'atom-p2w2-antibody-diversity-clonal-selection',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-2',
    prompt: 'Explain how the immune system generates an enormous diversity of antibody and T cell receptor specificities from a limited number of genes, and state the clonal selection principle. Include V(D)J recombination, combinatorial and junctional diversity, and the rule that each lymphocyte clone has a single specificity determined before antigen exposure.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The immune system must be able to recognize millions of different epitopes, yet the genome contains far too few genes to encode a separate receptor for each. The solution is somatic gene rearrangement: the genes for B cell receptors (immunoglobulins) and T cell receptors are not inherited as complete genes but as libraries of many small segments, called Variable (V), Diversity (D), and Joining (J) segments. As each lymphocyte develops, it randomly selects and splices together one segment from each library by V(D)J recombination, which is carried out by the RAG recombinase enzymes. Because there are many segments in each library, the number of possible combinations is very large (combinatorial diversity), and this is multiplied further by junctional diversity, the imprecise joining and random addition of nucleotides at the splice sites. The pairing of two independently rearranged chains (heavy with light, or the two T cell receptor chains) multiplies the total still further, generating on the order of billions of distinct possible specificities.' },
        { id: 'kp2', weight: 2, description: 'Each developing lymphocyte completes its rearrangement before it ever meets an antigen, and the result is that every lymphocyte, and its clonal descendants, expresses receptors of one single specificity, recognizing one epitope of one antigen. The body therefore generates, in advance and at random, an enormous repertoire of clones, each preformed and committed to a different specificity. This is the basis of the clonal selection principle: the antigen does not instruct or shape the receptor; instead it simply selects the rare preexisting clone whose receptor already fits it and drives that clone to proliferate (clonal expansion) and differentiate into effector and memory cells. Clonal selection explains the specificity of the adaptive response, the basis of immunologic memory (expanded memory clones persist), and self tolerance (clones that happen to recognize self antigen are deleted during development), and it accounts for the almost limitless antibody specificity described in the chapter.' },
      ],
      common_errors: [
        'Stating that antigen instructs or molds the antibody to fit it (clonal selection holds that the matching clone preexists and the antigen merely selects and expands it)',
        'Claiming a separate complete gene is inherited for every antibody specificity (diversity is generated somatically by V(D)J recombination of gene segments)',
        'Stating that a single lymphocyte clone can recognize many different epitopes (each clone has one specificity, fixed before antigen exposure)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'antibody-diversity-clonal-selection',
    chapter: 'pp2-wk-2',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 35', topic: 'antibody-diversity-clonal-selection' },
  },

  // ===== CH 37 / pp2-wk-3 (Hemostasis & Blood Coagulation) atoms =====

  {
    id: 'atom-p2w3-vascular-constriction-mechanisms',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'When a vessel is cut or ruptured, vascular constriction is the immediate first step of hemostasis. List and explain the mechanisms that produce this vasoconstriction, and describe how its intensity and duration relate to the severity of the trauma and to its role in limiting blood loss.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Immediately after a vessel is severed or traumatized the smooth muscle in its wall contracts and narrows the lumen, reducing blood flow and blood loss from the injured segment. Three mechanisms drive this constriction. First is local myogenic spasm, a direct contractile response of vascular smooth muscle to the injury itself, which accounts for most of the constriction. Second are local humoral factors released from the traumatized tissues and from activated platelets, including thromboxane A2 and serotonin, which are potent vasoconstrictors. Third are nervous reflexes initiated by pain and by sensory impulses arising from the injured vessel and surrounding tissue. In small vessels the constriction can reduce flow enough to stop bleeding entirely.' },
        { id: 'kp2', weight: 2, description: 'The degree of vascular spasm is proportional to the severity of the trauma: a vessel that is crushed or torn constricts far more forcefully than one cut cleanly, which is why sharply cut vessels often bleed more than crushed ones. In the smaller vessels the platelets are the main source of the vasoconstrictor thromboxane A2, which links vascular spasm directly to the platelet response. The spasm can last from many minutes up to several hours, buying time for the platelet plug and then the blood clot to form and seal the defect. Vascular constriction therefore works together with platelet plugging and coagulation as the first of the coordinated steps of hemostasis.' },
      ],
      common_errors: [
        'Stating that vasoconstriction by itself permanently stops bleeding (it is temporary and buys time for the platelet plug and clot to form)',
        'Claiming a cleanly cut vessel constricts more than a crushed vessel (greater trauma produces greater spasm, so crushed vessels often bleed less)',
        'Attributing the constriction only to nervous reflexes and omitting local myogenic spasm, which accounts for most of it',
      ],
      minimum_passing_score: 60,
    },
    topic: 'vascular-constriction-mechanisms',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 37', topic: 'vascular-constriction-mechanisms' },
  },

  {
    id: 'atom-p2w3-platelet-plug-formation',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe the formation of the platelet plug, the second step of hemostasis. Include the roles of exposed collagen and von Willebrand factor, platelet adhesion, activation and shape change, degranulation, and aggregation, and explain why the plug matters for sealing small vessel breaks and what pattern of bleeding appears when platelets are deficient.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'When the endothelium is damaged, platelets contact the exposed subendothelial collagen and basement membrane. Platelet surface glycoprotein Ib binds von Willebrand factor, which bridges the platelet to collagen and anchors it to the injured wall (adhesion). Adhesion activates the platelet: it swells, assumes an irregular form with long projecting pseudopods, and its contractile proteins contract forcefully, causing it to degranulate and release granule contents including adenosine diphosphate (ADP) and the enzymes that generate thromboxane A2. The released ADP and thromboxane A2 then activate nearby platelets and make their surfaces sticky, recruiting them to the site of injury.' },
        { id: 'kp2', weight: 2, description: 'The newly recruited platelets adhere to the already activated ones, so the process becomes a positive feedback cycle in which more and more platelets accumulate and aggregate into a platelet plug; aggregation is mediated by glycoprotein IIb/IIIa receptors that bind fibrinogen and cross link the platelets together. The loose plug can seal a small vascular break within seconds and is later reinforced by fibrin strands during coagulation. This mechanism is essential for closing the many minute ruptures that occur in small vessels every day. When platelets are deficient the mechanism fails, producing a characteristic pattern: petechiae and purpura in the skin, mucosal and gum bleeding, and a prolonged bleeding time.' },
      ],
      common_errors: [
        'Confusing adhesion (single platelets binding collagen and von Willebrand factor via glycoprotein Ib) with aggregation (platelets binding each other via glycoprotein IIb/IIIa and fibrinogen)',
        'Forgetting that von Willebrand factor is required to bridge platelets to exposed collagen, so its deficiency impairs platelet adhesion',
        'Stating that platelet deficiency causes deep joint and muscle bleeding (that pattern is typical of clotting factor disorders; low platelets cause petechiae, mucosal bleeding, and a prolonged bleeding time)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'platelet-plug-formation',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 37', topic: 'platelet-plug-formation' },
  },

  {
    id: 'atom-p2w3-platelet-structure-production',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe the structure, production, normal blood concentration, and lifespan of platelets (thrombocytes), including their cell of origin and how they are removed from the circulation, and note why these facts matter clinically.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Platelets, also called thrombocytes, are minute anucleate discs about 1 to 4 micrometers in diameter. They are not whole cells but cytoplasmic fragments pinched off from megakaryocytes, which are extremely large cells residing in the bone marrow; each megakaryocyte fragments into many thousands of platelets either within the marrow or immediately after entering the blood. The normal concentration of platelets in the blood is about 150,000 to 300,000 per microliter, and this number is closely regulated so the count remains relatively stable. Because platelets lack a nucleus they cannot divide, but they do contain functional cytoplasmic organelles that make them metabolically active.' },
        { id: 'kp2', weight: 2, description: 'Platelets have a functional half life in the blood of about 8 to 12 days, after which they are removed mainly by tissue macrophages, with a large fraction destroyed by the macrophages of the spleen as blood filters through its narrow meshwork. Knowing the normal count and lifespan matters clinically: a count below roughly 50,000 per microliter predisposes to bleeding and a count below about 10,000 to 20,000 per microliter risks spontaneous, potentially life threatening hemorrhage, while the short lifespan explains why platelet transfusions give only transient benefit and why drugs that irreversibly inhibit platelets, such as aspirin, impair the existing platelet pool for most of its remaining lifespan until new platelets are produced.' },
      ],
      common_errors: [
        'Calling platelets complete nucleated cells (they are anucleate cytoplasmic fragments of megakaryocytes and cannot divide)',
        'Misstating the normal platelet count (it is about 150,000 to 300,000 per microliter)',
        'Stating that platelets circulate for months (their functional lifespan is only about 8 to 12 days)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'platelet-structure-production',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 37', topic: 'platelet-structure-production' },
  },

  {
    id: 'atom-p2w3-platelet-functional-components',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe the functional internal components and membrane features that enable the platelet to participate in hemostasis, including its contractile proteins, its synthetic and storage organelles and their products, its energy sources, and the special properties of its cell membrane.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Although platelets have no nucleus, their cytoplasm is rich in structures that make them active hemostatic units. They contain the contractile proteins actin, myosin, and thrombosthenin, which allow the platelet to contract; this machinery drives the shape change of activation and, later, clot retraction. They retain residual endoplasmic reticulum and Golgi apparatus that synthesize various enzymes and store large quantities of calcium ions, and they synthesize prostaglandins (local hormones that include the precursors of thromboxane A2), a fibrin stabilizing factor, and platelet derived growth factor (PDGF), which stimulates vascular and other cells to grow and multiply and thereby helps repair the damaged vessel wall. Mitochondria and enzyme systems form adenosine triphosphate (ATP) and adenosine diphosphate (ADP) to power these functions.' },
        { id: 'kp2', weight: 2, description: 'The platelet cell membrane is specialized for hemostasis. Its surface carries a coat of glycoproteins that repels normal intact endothelium so platelets do not stick where they should not, yet causes them to adhere strongly to injured endothelial surfaces and especially to exposed collagen in the deeper vessel wall. The membrane also contains large amounts of phospholipids, including platelet factor 3 (a procoagulant phospholipid surface), that activate multiple steps of the blood clotting cascade by providing the surface on which clotting factor complexes assemble. Together these features mean the platelet is not merely a plug component but also a contractile element and a catalytic surface for coagulation, integrating primary and secondary hemostasis.' },
      ],
      common_errors: [
        'Stating that platelets can synthesize nothing because they lack a nucleus (their residual endoplasmic reticulum and Golgi synthesize enzymes, prostaglandins, and growth factors and store calcium)',
        'Forgetting that platelet membrane phospholipids (platelet factor 3) provide the catalytic surface that activates the clotting cascade',
        'Confusing platelet derived growth factor with a clotting factor (PDGF promotes repair of the vessel wall by stimulating cell growth, not coagulation)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'platelet-functional-components',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 37', topic: 'platelet-functional-components' },
  },

  {
    id: 'atom-p2w3-common-pathway-thrombin-fibrin',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe the common (final) pathway of coagulation that converts prothrombin to a stable fibrin clot. Include the role of prothrombin activator and calcium, the action of thrombin on fibrinogen, the polymerization of fibrin, and the role of fibrin stabilizing factor (factor XIII).',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The common pathway begins when prothrombin activator, formed by either the extrinsic or the intrinsic pathway, splits prothrombin (clotting factor II, a plasma protein made by the liver) into thrombin; this step absolutely requires calcium ions. Thrombin is a protein enzyme (a weak protease) that acts on fibrinogen, a large soluble plasma protein, by cleaving four small peptides from each fibrinogen molecule to form a fibrin monomer. Many fibrin monomers then polymerize spontaneously within seconds into long fibrin fibers that form the reticulum or meshwork of the clot, trapping platelets, blood cells, and plasma. Calcium is required throughout these reactions, which is why removing calcium with a chelator such as citrate prevents blood from clotting in a collection tube.' },
        { id: 'kp2', weight: 2, description: 'At first the fibrin fibers are held together only by weak noncovalent (hydrogen) bonds, so the meshwork is fragile and easily broken. It is strengthened by fibrin stabilizing factor (factor XIII), present in the plasma globulins and also released from platelets trapped in the clot. Thrombin activates fibrin stabilizing factor, and the activated factor, acting as a transglutaminase in the presence of calcium, forms covalent cross links between adjacent fibrin strands. This cross linking greatly increases the three dimensional strength and stability of the fibrin meshwork. Thrombin therefore both creates the fibrin and triggers its stabilization, and the final product is a strong cross linked fibrin clot that adheres to the vascular opening and prevents further blood loss.' },
      ],
      common_errors: [
        'Stating that thrombin acts on prothrombin (thrombin is formed from prothrombin by prothrombin activator; thrombin then acts on fibrinogen)',
        'Omitting calcium, which is required for the prothrombin to thrombin step and for fibrin cross linking (its removal by citrate prevents clotting in a tube)',
        'Forgetting that fibrin stabilizing factor (factor XIII) is needed to covalently cross link fibrin; without it the clot is weak and easily broken',
      ],
      minimum_passing_score: 60,
    },
    topic: 'common-pathway-thrombin-fibrin',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 37', topic: 'common-pathway-thrombin-fibrin' },
  },

  {
    id: 'atom-p2w3-clot-extension-retraction-feedback',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Explain two processes that follow initial fibrin formation: the positive feedback that extends and amplifies clot formation, and clot retraction. Describe how thrombin promotes its own further production, and describe the mechanism, timing, and purpose of clot retraction.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Once thrombin forms it initiates a powerful positive feedback that accelerates and extends clotting. Thrombin has a direct proteolytic effect on prothrombin, tending to convert it into still more thrombin, and it acts on several other clotting factors to generate additional prothrombin activator. Thrombin also strongly activates platelets, which release more procoagulant phospholipids and clotting factors. Because of this feedback, once a clot starts to form in a region of stagnant or slowly flowing blood it normally grows and propagates until the bleeding is sealed, with additional fibrin monomers and polymers deposited at the periphery of the existing clot. This explosive amplification is held in check only by the anticoagulant mechanisms that confine clotting to the area of injury.' },
        { id: 'kp2', weight: 2, description: 'Within about 20 to 60 minutes after it forms, the clot retracts and expresses most of the fluid trapped within it; the expressed fluid is serum, which is plasma with the fibrinogen and most other clotting factors removed, so serum cannot clot. Retraction is performed by the platelets entrapped in the clot: they bind to the many fibrin fibers, and their contractile proteins actin, myosin, and thrombosthenin contract in an active process that requires platelet ATP and calcium. As the platelets contract they pull the fibrin meshwork into a smaller denser mass and draw the broken edges of the vessel together, further sealing the defect. Effective retraction therefore depends on an adequate number of functioning platelets, which is why retraction is poor when the platelet count is low.' },
      ],
      common_errors: [
        'Stating that thrombin inhibits its own formation (thrombin drives a positive feedback that produces more thrombin and more prothrombin activator)',
        'Saying clot retraction does not require platelets (platelets supply the contractile proteins that perform retraction, so it fails when platelets are low)',
        'Confusing serum with plasma (serum is the fluid expressed during retraction and lacks fibrinogen and most clotting factors, so it cannot clot)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'clot-extension-retraction-feedback',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 37', topic: 'clot-extension-retraction-feedback' },
  },

  {
    id: 'atom-p2w3-extrinsic-pathway-tissue-factor',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe the extrinsic pathway for initiating coagulation. Include the trigger, the role of tissue factor (tissue thromboplastin), the activation of factor VII and factor X, the assembly of prothrombin activator, the requirement for calcium, why this pathway is rapid, and how it is assessed clinically.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The extrinsic pathway is triggered by trauma to the vessel wall and the surrounding tissues. Damaged tissues release tissue factor, also called tissue thromboplastin or factor III, a complex of lipoprotein and phospholipids. Tissue factor forms a complex with clotting factor VII, and in the presence of calcium ions this tissue factor and activated factor VII (VIIa) complex acts enzymatically on factor X to convert it to activated factor X (factor Xa). This is the point at which the extrinsic pathway hands off to the final common pathway. The pathway is named extrinsic because its initiating element, tissue factor, comes from outside the blood, from the traumatized tissue.' },
        { id: 'kp2', weight: 2, description: 'Activated factor X (Xa) then combines with tissue phospholipids and with clotting factor V to form the complex called prothrombin activator, with calcium ions again required. Prothrombin activator, in the presence of calcium, splits prothrombin into thrombin, after which the common pathway proceeds to fibrin. The extrinsic pathway is explosive and very fast because it involves few steps: once tissue factor is available, clotting can begin in as little as 15 seconds. Thrombin generated by the pathway then feeds back to activate factor V, accelerating the process further. The extrinsic pathway together with the final common pathway is assessed clinically by the prothrombin time and the international normalized ratio (INR).' },
      ],
      common_errors: [
        'Stating that the extrinsic pathway is triggered from within the blood (it is triggered by tissue factor released from traumatized tissue outside the blood)',
        'Forgetting that calcium ions are required at multiple steps of the pathway',
        'Claiming the extrinsic pathway is slow (it has few steps and is explosive, beginning clotting in as little as 15 seconds, and is assessed by the prothrombin time and INR)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'extrinsic-pathway-tissue-factor',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 37', topic: 'extrinsic-pathway-tissue-factor' },
  },

  {
    id: 'atom-p2w3-intrinsic-pathway-contact-activation',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe the intrinsic pathway for initiating coagulation. Include its trigger, the sequential activation of factors XII, XI, IX, and VIII, the role of platelet phospholipids and calcium, the activation of factor X and assembly of prothrombin activator, why this pathway is slower than the extrinsic pathway, and how it is assessed clinically.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The intrinsic pathway begins with trauma to the blood itself or with exposure of the blood to collagen in a damaged vessel wall. Contact with collagen or a wettable surface activates clotting factor XII to factor XIIa and simultaneously causes platelets to release phospholipids; high molecular weight kininogen and prekallikrein accelerate this contact activation. Factor XIIa then activates factor XI to factor XIa, which in turn activates factor IX to factor IXa. Activated factor IX (IXa) acts together with activated factor VIII, platelet phospholipids, and calcium to activate factor X. Factor VIII is the factor deficient in classic hemophilia A, and factor IX is the factor deficient in hemophilia B, so both deficiencies cripple this pathway.' },
        { id: 'kp2', weight: 2, description: 'Activated factor X (Xa) combines with factor V and with platelet and tissue phospholipids in the presence of calcium to form prothrombin activator, exactly as in the extrinsic pathway, so the two pathways converge at factor X and share the final common pathway from prothrombin activator to thrombin to fibrin. The intrinsic pathway is much slower than the extrinsic pathway, usually requiring 1 to 6 minutes to produce clotting, because it proceeds through many more sequential enzymatic steps. Clinically the intrinsic and common pathways are assessed by the activated partial thromboplastin time (aPTT), which is prolonged in hemophilia and is the test used to monitor unfractionated heparin therapy.' },
      ],
      common_errors: [
        'Stating that the two pathways never meet (both converge at the activation of factor X and share the common pathway to thrombin and fibrin)',
        'Confusing the factor deficiencies (hemophilia A lacks factor VIII and hemophilia B lacks factor IX, both intrinsic pathway factors)',
        'Claiming the intrinsic pathway is faster than the extrinsic (it has more steps and is slower, usually taking 1 to 6 minutes, and is assessed by the aPTT)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'intrinsic-pathway-contact-activation',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 37', topic: 'intrinsic-pathway-contact-activation' },
  },

  {
    id: 'atom-p2w3-endogenous-anticoagulants',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe the principal mechanisms that normally prevent unwanted clotting in intact vessels and confine clotting to sites of injury. Include the properties of the endothelial surface, the thrombomodulin and protein C system, antithrombin III, and the adsorption of thrombin by fibrin.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Several features keep blood fluid within normal intact vessels. The endothelial surface is smooth, which prevents contact activation of the intrinsic clotting system, and it is covered by a layer of glycocalyx, a mucopolysaccharide coat that repels platelets and clotting factors. Most important, the endothelial membrane carries thrombomodulin, a protein that binds thrombin. Binding to thrombomodulin both removes thrombin from the blood and changes thrombin so that the thrombomodulin and thrombin complex now activates a plasma protein called protein C. Activated protein C, with its cofactor protein S, is a proteolytic enzyme that inactivates activated factors V and VIII, thereby shutting down the amplifying steps of coagulation. Loss of these surface properties, as with endothelial damage or roughening, predisposes to clotting.' },
        { id: 'kp2', weight: 2, description: 'Two further mechanisms limit thrombin once it is formed. First, as a clot forms, about 85 to 90 percent of the thrombin produced is adsorbed onto the fibrin fibers as they polymerize; this localizes thrombin to the clot and keeps it from spreading clotting through the rest of the circulation. Second, the thrombin that does escape into the blood is bound and inactivated by a plasma protein called antithrombin III (antithrombin heparin cofactor), which blocks the active site of thrombin and inactivates it over the next 12 to 20 minutes and similarly inactivates other activated factors including Xa, IXa, XIa, and XIIa. Together, fibrin adsorption and antithrombin III ensure that even a vigorous clotting reaction stays confined to the region of vascular injury.' },
      ],
      common_errors: [
        'Stating that activated protein C inactivates factors II and X (it inactivates activated factors V and VIII)',
        'Forgetting that fibrin itself adsorbs the majority of thrombin (about 85 to 90 percent), which helps confine clotting to the injury',
        'Confusing antithrombin III with thrombomodulin (antithrombin III is a plasma inhibitor that neutralizes free thrombin and other factors, whereas thrombomodulin is an endothelial protein that binds thrombin and activates protein C)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'endogenous-anticoagulants',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 37', topic: 'endogenous-anticoagulants' },
  },

  {
    id: 'atom-p2w3-fibrinolysis-plasmin-tpa',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe the fibrinolytic system that dissolves blood clots. Include plasminogen and its incorporation into clots, tissue plasminogen activator (tPA), the formation and action of plasmin, and the physiologic and therapeutic significance of fibrinolysis.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The plasma contains a protein called plasminogen (profibrinolysin) that, when activated, becomes the active enzyme plasmin (fibrinolysin). When a clot forms, a large amount of plasminogen is trapped within it along with the other plasma proteins, but plasminogen by itself is inactive and will not dissolve the clot. Over the following days the injured tissues and the vascular endothelium slowly release a substance called tissue plasminogen activator (tPA), which converts the trapped plasminogen into plasmin. Because tPA is released slowly and acts on plasminogen already incorporated in the clot, plasmin tends to be generated inside the clot itself, which targets fibrinolysis to where it is needed and limits breakdown of useful clot elsewhere.' },
        { id: 'kp2', weight: 2, description: 'Plasmin is a proteolytic enzyme that digests the fibrin fibers of the clot and also destroys several clotting factors, including fibrinogen, factor V, factor VIII, prothrombin, and factor XII. By dissolving the fibrin meshwork, plasmin removes the clot once it is no longer needed and reopens (recanalizes) small vessels that had been occluded, restoring flow as the tissue heals; it also continuously removes the tiny clots that form in millions of small peripheral vessels, preventing them from becoming permanent. Therapeutically this is the basis of thrombolytic treatment: recombinant tPA and related agents are given to generate plasmin and dissolve pathologic clots in conditions such as acute ischemic stroke, massive pulmonary embolism, and myocardial infarction.' },
      ],
      common_errors: [
        'Confusing plasminogen (the inactive precursor) with plasmin (the active fibrin digesting enzyme)',
        'Stating that plasmin digests only fibrin (it also destroys fibrinogen and factors V, VIII, prothrombin, and XII)',
        'Forgetting that tissue plasminogen activator (tPA) is the physiologic activator and the basis of thrombolytic therapy',
      ],
      minimum_passing_score: 60,
    },
    topic: 'fibrinolysis-plasmin-tpa',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 37', topic: 'fibrinolysis-plasmin-tpa' },
  },

  {
    id: 'atom-p2w3-heparin-antithrombin-mechanism',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe heparin as an anticoagulant. Include its physical property and physiologic source, its mechanism of action through antithrombin III, the clotting factors it helps neutralize, its speed of onset and typical clinical uses, and how its effect is monitored and reversed.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Heparin is a highly negatively charged, strongly acidic conjugated polysaccharide. Physiologically it is produced by mast cells and basophils, which are especially abundant in the connective tissue around the capillaries of the liver and lungs, but the amount normally present in the blood is small, so heparin is used mainly as a pharmacologic anticoagulant. Heparin has little anticoagulant activity by itself; instead it works by binding to the plasma protein antithrombin III and increasing its effectiveness for removing thrombin by 100 to 1000 fold. The heparin and antithrombin III combination then removes free thrombin from the blood almost instantly, which is why heparin produces its effect immediately when it is given.' },
        { id: 'kp2', weight: 2, description: 'In addition to neutralizing thrombin, the heparin and antithrombin III complex inactivates several other activated clotting factors, including activated factors XII, XI, X, and IX, further blocking the coagulation cascade. Because heparin works rapidly it is used acutely, for example to prevent or treat venous thrombosis and pulmonary embolism, and it is used to keep blood from clotting in blood collection tubes, in cardiopulmonary bypass (heart and lung) machines, and in hemodialysis circuits. Its effect on the intrinsic and common pathways is monitored with the activated partial thromboplastin time (aPTT), and its action can be reversed rapidly by protamine, a positively charged protein that binds and neutralizes the negatively charged heparin molecule.' },
      ],
      common_errors: [
        'Stating that heparin directly inactivates thrombin on its own (it works by binding and potentiating antithrombin III, increasing its effect 100 to 1000 fold)',
        'Claiming heparin has a slow onset like warfarin (heparin acts almost immediately and is used acutely)',
        'Forgetting that heparin is monitored by the aPTT and reversed by protamine',
      ],
      minimum_passing_score: 60,
    },
    topic: 'heparin-antithrombin-mechanism',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 37', topic: 'heparin-antithrombin-mechanism' },
  },

  {
    id: 'atom-p2w3-warfarin-vitamin-k-mechanism',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe warfarin (a coumarin) as an anticoagulant and its relationship to vitamin K. Include the role of vitamin K in synthesizing clotting factors, the enzyme warfarin inhibits, which factors are depleted, the speed of onset and typical use, how it is monitored, and how it is reversed.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Vitamin K is required by the liver to synthesize functional forms of several clotting factors, namely prothrombin (factor II) and factors VII, IX, and X, as well as the anticoagulant proteins C and S. During the carboxylation reaction that activates these factors, vitamin K is oxidized and inactivated; the enzyme vitamin K epoxide reductase complex 1 (VKOR c1) then reduces and reactivates the vitamin so it can be reused. Warfarin and the other coumarins act by inhibiting VKOR c1. By blocking the recycling of vitamin K, warfarin depletes the active vitamin and therefore depletes the functional forms of prothrombin and factors VII, IX, and X, reducing the ability of the blood to clot.' },
        { id: 'kp2', weight: 2, description: 'Because warfarin only prevents the synthesis of new functional factors and does not affect factors already circulating, its effect appears slowly over several days as the existing factors are degraded, so warfarin is taken orally for long term anticoagulation rather than acute use. Its effect on the extrinsic and common pathways is monitored with the prothrombin time, reported as the international normalized ratio (INR); typical targets are an INR of about 2.0 to 3.0 for atrial fibrillation and for treating or preventing deep vein thrombosis and pulmonary embolism, and about 2.5 to 3.5 for mechanical heart valves, while a normal INR is near 1.0. Over anticoagulation or bleeding is reversed with vitamin K, which works slowly over hours, and, when reversal must be immediate, with fresh frozen plasma or prothrombin complex concentrate that supplies the missing factors directly.' },
      ],
      common_errors: [
        'Stating that warfarin acts quickly like heparin (it acts slowly over days because it only blocks synthesis of new factors and existing factors must be cleared first)',
        'Listing the wrong factors (warfarin depletes the vitamin K dependent factors II, VII, IX, and X plus proteins C and S)',
        'Confusing the reversal agents (warfarin is reversed with vitamin K and fresh frozen plasma, whereas protamine reverses heparin)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'warfarin-vitamin-k-mechanism',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 37', topic: 'warfarin-vitamin-k-mechanism' },
  },

  {
    id: 'atom-p2w3-hemophilia-factor-deficiencies',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe hemophilia, including the two main types and their specific factor deficiencies, the relative frequency of each, the mode of inheritance, the coagulation pathway affected, the characteristic clinical bleeding pattern, and the laboratory test that is abnormal.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Hemophilia is an inherited bleeding disorder caused by deficiency of a single clotting factor. Hemophilia A, the classic and most common form, accounts for about 85 percent of cases and results from deficiency or dysfunction of clotting factor VIII; it occurs in roughly 1 in 10,000 males. Hemophilia B (Christmas disease) accounts for about 15 percent of cases and results from deficiency of clotting factor IX, occurring in roughly 1 in 60,000 males. Both factor VIII and factor IX are components of the intrinsic pathway, so both forms of hemophilia impair activation of the intrinsic pathway and therefore slow the generation of prothrombin activator and thrombin, even though primary platelet hemostasis is intact.' },
        { id: 'kp2', weight: 2, description: 'The genes for both factor VIII and factor IX lie on the X chromosome, so hemophilia is inherited as an X linked recessive trait. Males have only one X chromosome, so a single defective gene produces disease, which is why hemophilia is expressed almost entirely in males, with females usually being unaffected carriers. Because secondary hemostasis is impaired but the platelet plug forms normally, patients bleed excessively after trauma that would be trivial in a normal person and characteristically develop deep bleeding into joints (hemarthrosis), muscles, and soft tissues rather than the superficial petechiae of platelet disorders. The intrinsic pathway defect prolongs the activated partial thromboplastin time (aPTT) while the prothrombin time remains normal, and treatment is replacement of the missing factor with factor concentrate.' },
      ],
      common_errors: [
        'Swapping the deficiencies (hemophilia A is factor VIII deficiency and is more common, whereas hemophilia B is factor IX deficiency)',
        'Calling hemophilia a platelet disorder (it is a clotting factor disorder that impairs the intrinsic pathway and prolongs the aPTT, with a normal platelet count)',
        'Forgetting the X linked recessive inheritance that makes the disease appear almost exclusively in males',
      ],
      minimum_passing_score: 60,
    },
    topic: 'hemophilia-factor-deficiencies',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 37', topic: 'hemophilia-factor-deficiencies' },
  },

  {
    id: 'atom-p2w3-vitamin-k-deficiency-coagulopathy',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Explain why vitamin K deficiency causes a bleeding tendency. Include the clotting factors that depend on vitamin K, the dietary and intestinal sources of vitamin K and why it must be absorbed with fat, the common causes of deficiency including the role of liver and biliary disease, the laboratory abnormality, and the treatment.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Vitamin K is an essential cofactor that the liver uses to synthesize functional prothrombin (factor II) and factors VII, IX, and X, as well as the natural anticoagulant protein C. Without vitamin K the liver still makes these proteins but cannot complete the carboxylation step that lets them bind calcium and participate in coagulation, so they are present but nonfunctional and the blood clots poorly. Vitamin K is supplied both by the diet and by synthesis from bacteria in the intestine, so a healthy person rarely becomes deficient from diet alone. Because vitamin K is fat soluble, it requires bile salts and normal fat absorption to be taken up from the gut.' },
        { id: 'kp2', weight: 2, description: 'Deficiency therefore commonly arises from conditions that impair fat absorption or factor synthesis: obstruction of the bile ducts or absence of bile, which prevents absorption of the fat soluble vitamin; generalized fat malabsorption; destruction of intestinal bacteria by broad spectrum antibiotics; and the newborn period before gut bacteria are established. Importantly, hepatocellular liver disease causes bleeding both because the diseased liver cannot synthesize the clotting factors and because associated biliary obstruction prevents vitamin K absorption. Vitamin K deficiency prolongs the prothrombin time first, because factor VII has the shortest half life. Treatment is administration of vitamin K, and in patients with liver or biliary disease vitamin K can be injected about 4 to 8 hours before surgery to let the liver make more functional clotting factors; when correction must be immediate, fresh frozen plasma is given.' },
      ],
      common_errors: [
        'Listing the wrong factors (the vitamin K dependent factors are prothrombin II, VII, IX, and X, plus protein C)',
        'Forgetting that vitamin K is fat soluble, so biliary obstruction and fat malabsorption are major causes of deficiency',
        'Assuming injected vitamin K corrects bleeding instantly (it takes hours for the liver to make new factors, so fresh frozen plasma is used when immediate correction is needed)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'vitamin-k-deficiency-coagulopathy',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 37', topic: 'vitamin-k-deficiency-coagulopathy' },
  },

  {
    id: 'atom-p2w3-thrombosis-embolism-disorders',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Define thrombus and embolus and explain the main conditions that promote abnormal intravascular clotting. Then describe pulmonary embolism, including its usual source and consequence, and the available treatments for thromboembolism.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'An abnormal clot that develops in an intact blood vessel is called a thrombus, and when a thrombus or a fragment of one breaks loose and travels in the bloodstream it is called an embolus. Two general conditions promote abnormal clotting. The first is a roughened or damaged endothelial surface, as occurs with atherosclerosis, infection, or trauma, which triggers platelet adhesion and the clotting cascade where they should not occur. The second is sluggish or stagnant blood flow, which lets small amounts of activated clotting factors accumulate locally instead of being washed away and diluted; stasis occurs with prolonged immobility such as long air travel, prolonged bed rest, and orthopedic immobilization. A hypercoagulable state of the blood is a third contributing factor.' },
        { id: 'kp2', weight: 2, description: 'A pulmonary embolus most commonly arises from a thrombus that forms in the deep veins of the legs (deep vein thrombosis); a piece breaks off, travels through the right heart, and lodges in and occludes one or more pulmonary arteries, which can be rapidly fatal when the obstruction is large. Treatment of acute thromboembolism is directed at dissolving or removing the clot and preventing new clot: tissue plasminogen activator (tPA) and related thrombolytic drugs can dissolve a clot and can be life saving in massive pulmonary embolism when appropriate, and surgical or catheter embolectomy can physically remove an obstructing clot. Anticoagulation with heparin and then warfarin or a direct oral anticoagulant prevents propagation and recurrence, and mechanical and pharmacologic prophylaxis is used in immobilized and postoperative patients.' },
      ],
      common_errors: [
        'Confusing thrombus and embolus (a thrombus forms and stays in place, whereas an embolus is a clot or fragment that has broken loose and travels)',
        'Forgetting that most pulmonary emboli originate from deep vein thrombosis in the legs',
        'Omitting stasis and endothelial roughening as the major predisposing conditions for abnormal clotting',
      ],
      minimum_passing_score: 60,
    },
    topic: 'thrombosis-embolism-disorders',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 37', topic: 'thrombosis-embolism-disorders' },
  },

  {
    id: 'atom-p2w3-dic-thrombocytopenia',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe two disorders of clotting regulation: disseminated intravascular coagulation (DIC) and thrombocytopenia. For DIC, give its triggers, what happens in the microvasculature, and why it paradoxically causes bleeding. For thrombocytopenia, give its definition, the bleeding pattern and signs, the platelet count thresholds for clinical significance, and the treatment.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Disseminated intravascular coagulation (DIC) occurs in the setting of massive tissue damage or overwhelming infection (sepsis), which floods the circulation with tissue factor and other procoagulants. This triggers widespread coagulation throughout the small vessels of the body, forming many microthrombi that can obstruct flow and damage organs. Paradoxically the dominant clinical problem is often bleeding rather than clotting: the widespread clotting consumes platelets and clotting factors faster than they can be replaced, so the blood is left depleted of the very components needed for hemostasis and the patient bleeds from multiple sites at once. DIC is thus a consumptive coagulopathy, and its management centers on treating the underlying cause and replacing the consumed platelets and factors.' },
        { id: 'kp2', weight: 2, description: 'Thrombocytopenia means an abnormally low number of platelets in the blood. Because platelets are required to seal the countless tiny breaks in small vessels, thrombocytopenic patients bleed from many small venules and capillaries, producing a characteristic pattern of small punctate skin hemorrhages called petechiae and larger areas of thrombocytopenic purpura, along with mucosal bleeding; the condition is often idiopathic (immune thrombocytopenic purpura). The platelet count predicts risk: a count below about 50,000 per microliter usually causes only modest bleeding with trauma or surgery, whereas a count below about 10,000 per microliter is life threatening because spontaneous hemorrhage can occur. Treatment of severe thrombocytopenic bleeding is transfusion of platelets, which is effective for only about 1 to 4 days each time because the transfused platelets are steadily removed.' },
      ],
      common_errors: [
        'Stating that DIC causes only clotting (the widespread microvascular clotting consumes platelets and factors, so it paradoxically causes bleeding from multiple sites)',
        'Confusing the platelet thresholds (below about 50,000 per microliter gives modest bleeding, whereas below about 10,000 per microliter is life threatening)',
        'Describing deep joint bleeding for thrombocytopenia (low platelets cause petechiae, purpura, and mucosal bleeding, whereas deep joint bleeding is typical of clotting factor disorders)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'dic-thrombocytopenia',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 37', topic: 'dic-thrombocytopenia' },
  },

  // ===== CH 38 / pp2-wk-3 (Pulmonary Ventilation) atoms =====

  {
    id: 'atom-p2w3v-boyle-pressure-volume',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'State the ideal gas law and the law of Boyle, and explain how they govern the movement of air into and out of the lungs. Define each term of PV = nRT, describe the inverse relationship between pressure and volume at constant temperature, and apply it to the changes in alveolar pressure during inspiration and expiration.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The ideal gas law states PV = nRT, where P is pressure, V is the volume the gas occupies, n is the number of moles of gas, R is the universal gas constant, and T is the absolute temperature in kelvin. Rearranged to P = nRT/V, it shows that for a fixed amount of gas at constant temperature the pressure is proportional to 1/V. This is the law of Boyle: at constant temperature and amount of gas, pressure and volume are inversely related, so P1 times V1 equals P2 times V2. Increasing the volume lowers the pressure, and decreasing the volume raises it.' },
        { id: 'kp2', weight: 2, description: 'Applied to breathing, the diaphragm and external intercostals enlarge the thorax during inspiration, which increases alveolar volume and, by the law of Boyle, lowers alveolar pressure to about negative 1 cm H2O, below atmospheric pressure, so air flows in down the pressure gradient. During expiration the thorax recoils, alveolar volume falls, and alveolar pressure rises to about positive 1 cm H2O, above atmospheric, so air flows out. Pleural pressure is more negative than alveolar pressure throughout, moving from about negative 5 cm H2O at rest to about negative 8 cm H2O at the height of inspiration.' },
      ],
      common_errors: [
        'Stating that pressure and volume are directly proportional (the law of Boyle is an inverse relationship)',
        'Saying air flows in because alveolar pressure rises above atmospheric (it falls below atmospheric during inspiration)',
        'Confusing pleural pressure with alveolar pressure, or giving alveolar pressure as the more negative of the two',
      ],
      minimum_passing_score: 60,
    },
    topic: 'gas-laws-boyle-ventilation',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'gas-laws-boyle-ventilation' },
  },

  {
    id: 'atom-p2w3v-dalton-fick-laws',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'State the law of Dalton of partial pressures and the law of Fick of diffusion, and explain how each applies to respiratory gases. Define partial pressure and how it is calculated from fractional concentration and total pressure, and identify the factors that determine the rate of gas diffusion across the respiratory membrane, including how the diffusion coefficient is computed.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The law of Dalton states that in a mixture each gas exerts a partial pressure independent of the other gases, and the total pressure equals the sum of those partial pressures. For atmospheric air, the total pressure equals the sum of the partial pressures of water vapor, oxygen, nitrogen, and trace gases. The partial pressure of any gas equals its fractional concentration multiplied by the total pressure, so as total pressure falls at altitude the partial pressure of oxygen falls in proportion even though its fractional concentration stays near 21 percent.' },
        { id: 'kp2', weight: 2, description: 'The law of Fick states that the rate of diffusion of a gas is directly proportional to the surface area available, to the partial pressure gradient across the membrane, and to the diffusion coefficient of the gas, and inversely proportional to the thickness or distance of the membrane. The diffusion coefficient equals the solubility of the gas divided by the square root of its molecular weight. Because carbon dioxide is about 20 times more soluble than oxygen, it diffuses far faster across the respiratory membrane despite a slightly higher molecular weight, which is why impaired diffusion limits oxygen uptake before it limits carbon dioxide removal.' },
      ],
      common_errors: [
        'Combining partial pressures by multiplication (the law of Dalton sums them)',
        'Saying diffusion rate falls as the partial pressure gradient rises (it rises with the gradient)',
        'Forgetting that the high solubility of carbon dioxide makes it diffuse faster than oxygen',
      ],
      minimum_passing_score: 60,
    },
    topic: 'gas-laws-dalton-fick',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'gas-laws-dalton-fick' },
  },

  {
    id: 'atom-p2w3v-respiratory-muscles',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Identify the muscles of inspiration and expiration and describe their actions during quiet and forced breathing. Explain why quiet inspiration is active while quiet expiration is passive, name the primary and the accessory muscles of inspiration, and name the muscles that drive forced expiration.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Quiet inspiration is an active process. The diaphragm contracts and descends, and the external intercostals contract to elevate the rib cage, together increasing the vertical and the anteroposterior diameters of the thorax. By enlarging thoracic volume these muscles lower alveolar pressure and draw air in. When ventilatory demand rises, the accessory muscles of inspiration assist: the sternocleidomastoid and the scalenes lift and fix the upper rib cage. Visible recruitment of these accessory muscles is a clinical sign of respiratory distress.' },
        { id: 'kp2', weight: 2, description: 'Quiet expiration is normally passive, powered by the elastic recoil of the lungs and chest wall once the inspiratory muscles relax, so no muscular effort is needed. Forced expiration becomes active: the abdominal muscles, including the rectus abdominis, the external and internal obliques, and the transversus abdominis, contract to raise intraabdominal pressure and push the diaphragm upward, while the internal intercostals pull the rib cage downward and inward. These actions raise pleural and alveolar pressure to expel air rapidly, as in coughing or exercise.' },
      ],
      common_errors: [
        'Stating that quiet expiration is active (it is passive, driven by elastic recoil)',
        'Listing the internal intercostals or abdominal muscles as inspiratory muscles (they are expiratory)',
        'Calling the scalenes and sternocleidomastoid expiratory muscles (they are accessory inspiratory muscles)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'respiratory-muscles',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'respiratory-muscles' },
  },

  {
    id: 'atom-p2w3v-pleural-alveolar-pressures',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Define pleural pressure, alveolar pressure, and transpulmonary pressure, and give their approximate values at rest and during inspiration and expiration. Explain why pleural pressure is normally subatmospheric and what transpulmonary pressure represents.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Pleural pressure is the pressure in the thin fluid space between the visceral and parietal pleura. It is normally subatmospheric because the elastic recoil of the lung pulls inward while the chest wall pulls outward, creating a slight suction; it is about negative 5 cm H2O at rest and becomes about negative 8 cm H2O at the height of inspiration as the thorax expands. Alveolar pressure is the pressure inside the alveoli: it is 0 cm H2O (equal to atmospheric) between breaths, falls to about negative 1 cm H2O during inspiration to draw air in, and rises to about positive 1 cm H2O during expiration to push air out.' },
        { id: 'kp2', weight: 2, description: 'Transpulmonary pressure is the difference between alveolar pressure and pleural pressure, that is alveolar minus pleural pressure. It is the distending pressure across the lung wall and is a measure of the elastic recoil force of the lungs that tends to collapse them at each degree of expansion. The negative pleural pressure is what holds the lungs expanded against the inner chest wall; if the chest wall or lung is breached, as in a pneumothorax, pleural pressure rises toward atmospheric, transpulmonary pressure falls, and the lung collapses.' },
      ],
      common_errors: [
        'Stating that pleural pressure is positive at rest (it is subatmospheric, about negative 5 cm H2O)',
        'Defining transpulmonary pressure as pleural minus alveolar pressure (it is alveolar minus pleural)',
        'Saying alveolar pressure stays at zero throughout the breath (it swings negative on inspiration and positive on expiration)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'pleural-alveolar-transpulmonary-pressure',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'pleural-alveolar-transpulmonary-pressure' },
  },

  {
    id: 'atom-p2w3v-bronchiolar-control',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Explain the nervous and the humoral control of bronchiolar diameter. Describe the effect of sympathetic and parasympathetic stimulation, identify the receptor responsible for sympathetic bronchodilation, and list the humoral mediators that constrict or dilate the airways, with the clinical relevance to bronchospasm.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Bronchiolar smooth muscle is controlled by the autonomic nervous system. Sympathetic stimulation acts on beta-2 adrenergic receptors in the bronchiolar smooth muscle to cause relaxation and bronchodilation, widening the airways and lowering resistance. Parasympathetic stimulation, carried by the vagus nerve, releases acetylcholine that acts on muscarinic receptors to cause contraction and bronchoconstriction. The balance of these inputs sets the resting airway caliber, and excess parasympathetic tone narrows the airways.' },
        { id: 'kp2', weight: 2, description: 'Humoral and locally released mediators also adjust airway diameter. Histamine and acetylcholine constrict the bronchioles, while circulating adrenergic beta agonists relax the smooth muscle and dilate the airways. This pharmacology underlies treatment of bronchospasm: beta-2 agonists such as albuterol dilate the airways, and anticholinergic agents block the constricting action of acetylcholine. In asthma and allergic responses, histamine released from mast cells contributes to bronchoconstriction, which beta-2 agonists reverse.' },
      ],
      common_errors: [
        'Stating that sympathetic beta-2 activation constricts the airway (it dilates the airway)',
        'Saying acetylcholine dilates the bronchioles (it constricts them)',
        'Listing histamine as a bronchodilator (it is a bronchoconstrictor)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'bronchiolar-diameter-control',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'bronchiolar-diameter-control' },
  },

  {
    id: 'atom-p2w3v-airway-resistance',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe where airway resistance is greatest in the bronchial tree and explain dynamic airway compression during forced expiration. Explain why the largest resistance lies in the medium sized bronchi rather than in the smallest bronchioles, and why a maximal expiratory effort can paradoxically limit expiratory flow.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Although each terminal bronchiole is very narrow, the bronchioles are so numerous that their combined cross sectional area is enormous, so they contribute little to total airway resistance. The greatest resistance is found in the medium sized and segmental bronchi, where the airways are still relatively few and not yet hugely branched. This is why small airway disease can be advanced before it greatly raises measured resistance, and why resistance is normally low across most of the respiratory tract.' },
        { id: 'kp2', weight: 2, description: 'During forced expiration the expiratory muscles raise pleural pressure to high positive values, for example about positive 25 cm H2O, and alveolar pressure rises even higher, for example about positive 35 cm H2O, because it equals pleural pressure plus the elastic recoil pressure. Partway along the airway the pressure inside the airway falls below the surrounding pleural pressure, so the airway is compressed (dynamic compression). Beyond this point further effort raises both the driving pressure and the compressing pressure equally, so expiratory flow becomes effort independent and is limited. In emphysema, loss of the elastic tissue that tethers airways open worsens this collapse and traps air.' },
      ],
      common_errors: [
        'Stating that the smallest bronchioles have the highest resistance (their huge total cross sectional area gives low resistance)',
        'Believing that greater expiratory effort always increases flow (dynamic compression limits flow once it begins)',
        'Ignoring the loss of airway tethering that worsens dynamic compression in emphysema',
      ],
      minimum_passing_score: 60,
    },
    topic: 'airway-resistance-dynamic-compression',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'medium', source: 'Guyton & Hall 14e, Ch 38', topic: 'airway-resistance-dynamic-compression' },
  },

  {
    id: 'atom-p2w3v-compliance-elastic-forces',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Define lung compliance, give its normal value, and identify the two elastic forces that determine it. Explain how compliance changes in emphysema and in fibrosis and what those changes mean for inflating the lung.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Lung compliance is the change in lung volume produced per unit change in distending (transpulmonary) pressure, written as the change in volume divided by the change in pressure, and is normally about 200 mL per cm H2O. It is determined by two elastic forces: the elastic recoil of the lung tissue itself, due to elastin and collagen fibers, and the surface tension of the fluid film lining the alveoli. Surface tension accounts for roughly two thirds of the recoil, which is shown by the fact that a saline filled lung, having no air to fluid interface, is far more compliant than an air filled one.' },
        { id: 'kp2', weight: 2, description: 'A more compliant lung accepts a larger volume for a given pressure. In emphysema, destruction of elastic lung tissue raises compliance, so the lung overdistends easily but recoils poorly, which traps air and increases the functional residual capacity. In pulmonary fibrosis, scarring stiffens the lung and lowers compliance, so a much larger transpulmonary pressure is needed to achieve the same volume change, increasing the work of breathing. On a pressure to volume curve, emphysema lies above the normal line and fibrosis below it.' },
      ],
      common_errors: [
        'Giving compliance as pressure divided by volume (it is volume divided by pressure)',
        'Stating that fibrosis raises compliance (it lowers compliance)',
        'Stating that emphysema lowers compliance (it raises compliance)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'lung-compliance-elastic-forces',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'lung-compliance-elastic-forces' },
  },

  {
    id: 'atom-p2w3v-surface-tension-surfactant',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Explain alveolar surface tension and the role of surfactant. Describe what causes surface tension, why it tends to collapse alveoli, which cells produce surfactant, how surfactant works, and the clinical consequence of surfactant deficiency.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Surface tension arises from the mutual attraction of water molecules at the air to fluid interface that lines the alveoli; this attraction tends to shrink the fluid surface and so tends to collapse the alveolus. By the relationship of Laplace, the collapsing pressure is higher in alveoli of smaller radius, so without a counteracting mechanism small alveoli would empty into larger ones. Surface tension is the larger of the two elastic forces opposing lung expansion, demonstrated by the much greater compliance of a saline filled lung in which the air to fluid interface, and therefore the surface tension, is absent.' },
        { id: 'kp2', weight: 2, description: 'Surfactant is a detergent like mixture of phospholipids and proteins secreted by type II alveolar epithelial cells. It adsorbs to the air to fluid interface and interferes with the hydrogen bonding between water molecules, sharply lowering surface tension. This raises compliance, reduces the work of breathing, prevents collapse of the smallest alveoli, and stabilizes alveoli of different sizes. Surfactant is produced late in fetal development, so premature infants may lack it and develop neonatal respiratory distress syndrome, with stiff lungs and widespread alveolar collapse.' },
      ],
      common_errors: [
        'Saying that surfactant raises surface tension (it lowers it)',
        'Attributing surfactant production to type I cells or to macrophages (type II alveolar cells make it)',
        'Stating that surface tension holds alveoli open (it tends to collapse them)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'surface-tension-surfactant',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'surface-tension-surfactant' },
  },

  {
    id: 'atom-p2w3v-lung-volumes',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Define the four lung volumes, namely tidal volume, inspiratory reserve volume, expiratory reserve volume, and residual volume, and give approximate normal values. Explain which volume cannot be measured by simple spirometry and why.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The four lung volumes do not overlap and together make up the total lung capacity. Tidal volume is the air moved in or out during a normal quiet breath, about 500 mL. Inspiratory reserve volume is the extra air that can be inhaled beyond a tidal breath, about 3000 to 3100 mL. Expiratory reserve volume is the extra air that can be forcibly exhaled after a normal expiration, about 1100 to 1200 mL. Residual volume is the air that remains in the lungs after a maximal forced expiration, about 1200 mL, and keeps the alveoli partly inflated.' },
        { id: 'kp2', weight: 2, description: 'Residual volume cannot be exhaled by definition, so it cannot be measured directly by a spirometer, which only records air that moves in and out at the mouth. It is measured indirectly by methods such as helium dilution, nitrogen washout, or body plethysmography. Because functional residual capacity and total lung capacity both include the residual volume, they too cannot be obtained by simple spirometry and require these indirect techniques.' },
      ],
      common_errors: [
        'Stating that residual volume can be measured by spirometry (it cannot be exhaled, so it is measured indirectly)',
        'Confusing tidal volume with vital capacity',
        'Interchanging the inspiratory and expiratory reserve volumes',
      ],
      minimum_passing_score: 60,
    },
    topic: 'lung-volumes',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'lung-volumes' },
  },

  {
    id: 'atom-p2w3v-lung-capacities',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Define the four lung capacities, namely inspiratory capacity, functional residual capacity, vital capacity, and total lung capacity, as sums of the lung volumes, and give approximate normal values.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'A capacity is the sum of two or more lung volumes. Inspiratory capacity is the tidal volume plus the inspiratory reserve volume, about 3600 mL, the most a person can inhale starting from the end of a quiet expiration. Functional residual capacity is the expiratory reserve volume plus the residual volume, about 2400 mL, the volume of air remaining in the lungs after a normal quiet expiration; it is the reservoir that buffers alveolar gas composition between breaths.' },
        { id: 'kp2', weight: 2, description: 'Vital capacity is the inspiratory reserve volume plus the tidal volume plus the expiratory reserve volume, about 4800 mL, the maximum volume that can be exhaled after a maximal inspiration. Total lung capacity is the vital capacity plus the residual volume, about 6000 mL, the volume in the lungs after the deepest possible inspiration. Because functional residual capacity and total lung capacity contain the residual volume, they cannot be measured by spirometry alone.' },
      ],
      common_errors: [
        'Defining vital capacity to include the residual volume (it does not include residual volume)',
        'Stating that functional residual capacity is fully exhaled (it includes the residual volume)',
        'Confusing inspiratory capacity with the inspiratory reserve volume',
      ],
      minimum_passing_score: 60,
    },
    topic: 'lung-capacities',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'lung-capacities' },
  },

  {
    id: 'atom-p2w3v-dead-space',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Define anatomic dead space, alveolar dead space, and physiologic dead space, give the approximate normal anatomic dead space, and explain what determines physiologic dead space. Explain why dead space ventilation is described as wasted ventilation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Anatomic dead space is the volume of the conducting airways, that is everything from the nose and mouth down to but not including the alveoli, where air is conducted but no gas exchange occurs. It is about 150 mL in an adult. Alveolar dead space is the volume of air that does reach alveoli but fails to exchange gas because those alveoli are poorly perfused or not perfused at all, so ventilation is wasted on them. In healthy lungs alveolar dead space is very small.' },
        { id: 'kp2', weight: 2, description: 'Physiologic dead space is the sum of the anatomic and the alveolar dead space, the total volume of each breath that does not take part in gas exchange. Its size depends on the matching of ventilation to perfusion, the ventilation to perfusion ratio: when regions are ventilated but not perfused, as in pulmonary embolism, alveolar and therefore physiologic dead space rise. Because dead space air never reaches functioning exchange surface, it is wasted ventilation and must be added on top of the air that actually refreshes the alveoli.' },
      ],
      common_errors: [
        'Including the alveoli in anatomic dead space (anatomic dead space is everything but the alveoli)',
        'Equating physiologic dead space with anatomic dead space in disease (alveolar dead space adds to it)',
        'Saying dead space air participates in gas exchange (by definition it does not)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'dead-space',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'dead-space' },
  },

  {
    id: 'atom-p2w3v-minute-alveolar-ventilation',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Write the formulas for minute respiratory volume and for alveolar ventilation, define respiratory rate, and explain why alveolar ventilation is always less than minute ventilation. Explain why alveolar ventilation, rather than minute ventilation, determines alveolar gas composition.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Respiratory rate is the number of breaths taken per minute. Minute respiratory volume, also called minute ventilation, is the total volume of air moved in and out of the respiratory system each minute and equals the tidal volume multiplied by the respiratory rate. Alveolar ventilation is the volume of fresh air that actually reaches the alveoli and takes part in gas exchange each minute, and it equals the tidal volume minus the dead space, multiplied by the respiratory rate.' },
        { id: 'kp2', weight: 2, description: 'Because the dead space, about 150 mL, is subtracted before multiplying, alveolar ventilation is always less than minute ventilation. At the same minute ventilation, rapid shallow breathing wastes a larger fraction of each breath in the dead space than slow deep breathing does, so it produces less alveolar ventilation. Alveolar ventilation, not minute ventilation, sets the alveolar and therefore the arterial partial pressures of oxygen and carbon dioxide, which is why it is the physiologically decisive quantity.' },
      ],
      common_errors: [
        'Equating alveolar ventilation with minute ventilation (the dead space must be subtracted first)',
        'Claiming rapid shallow breathing is as effective as slow deep breathing at the same minute volume (it wastes more in dead space)',
        'Using the full tidal volume rather than tidal volume minus dead space when computing alveolar ventilation',
      ],
      minimum_passing_score: 60,
    },
    topic: 'minute-alveolar-ventilation',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'minute-alveolar-ventilation' },
  },

  // ===== CH 39 to 43 / pp2-wk-4,5,6 (Respiratory) atoms =====

  {
    id: 'atom-p2w4s-pulmonary-pressures',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'State the normal pulmonary arterial systolic, diastolic, and mean pressures and the pulmonary capillary pressure, and describe how pressure falls from the pulmonary artery to the left atrium.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The pulmonary arterial pressures is about systolic 25 mm Hg, diastolic 8 mm Hg, and mean 15 mm Hg, with a pulmonary capillary pressure of 7 mm Hg. These are far lower than systemic arterial pressures, where systolic values reach about 120 mm Hg. The learner should be able to recite each pulmonary value precisely.' },
        { id: 'kp2', weight: 2, description: 'Pressure falls progressively from the pulmonary artery through the pulmonary capillaries near 7 mm Hg to the left atrium near 2 mm Hg. This declining gradient drives blood through the low pressure pulmonary circuit. The learner should describe the stepwise fall along the pathway.' },
      ],
      common_errors: [
        'Reporting the systolic 25 mm Hg as the mean pressure.',
        'Confusing pulmonary pressures with the much higher systemic values.',
        'Forgetting that left atrial pressure falls to about 2 mm Hg.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pulmonary arterial pressure',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Pulmonary arterial pressure' },
  },

  {
    id: 'atom-p2w4s-low-resistance',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Describe the pulmonary pressure drop and flow that give the pulmonary circulation its low resistance, and state how that resistance compares with the systemic circulation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'There is a pressure drop of approximately 12 mm Hg across the pulmonary circulation while it carries a flow of 5 L per minute. Because resistance equals pressure drop divided by flow, this small drop at full cardiac output reflects a very low resistance. The learner should cite both the 12 mm Hg drop and the 5 L per minute flow.' },
        { id: 'kp2', weight: 2, description: 'Pulmonary vascular resistance is approximately 1/7 that of the systemic circulation. This low resistance is a defining feature of the pulmonary bed and allows the lung to receive the entire cardiac output at low pressure. The learner should state the 1/7 comparison explicitly.' },
      ],
      common_errors: [
        'Saying pulmonary resistance equals or exceeds systemic resistance.',
        'Using a pressure drop other than about 12 mm Hg.',
        'Forgetting that pulmonary flow is about 5 L per minute at rest.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pulmonary vascular resistance',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Pulmonary vascular resistance' },
  },

  {
    id: 'atom-p2w4s-recruitment-distension',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Define recruitment and distension as the two mechanisms that lower pulmonary vascular resistance and explain how each reduces resistance when pulmonary pressure rises.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Recruitment is the opening of previously closed pulmonary capillaries when pulmonary pressure or flow increases. By bringing additional parallel channels into use, recruitment raises the total cross-sectional area for flow and lowers resistance. The learner should define recruitment as the opening of closed vessels.' },
        { id: 'kp2', weight: 2, description: 'Distension is the widening of already open pulmonary capillaries as transmural pressure rises. The increased diameter of these vessels further reduces resistance. The learner should distinguish distension from recruitment and recognize that both act passively.' },
      ],
      common_errors: [
        'Swapping the definitions of recruitment and distension.',
        'Describing these as active vasodilation rather than passive responses.',
        'Claiming they raise rather than lower resistance.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Recruitment and distension',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Recruitment and distension' },
  },

  {
    id: 'atom-p2w4s-pressure-output-curve',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Describe the relationship of pulmonary arterial pressure versus cardiac output, including the normal value and how pressure behaves as cardiac output increases greatly.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'the curve plots pulmonary arterial pressure against cardiac output, with the normal value near a cardiac output of 4 L per minute and a pulmonary pressure near 15 mm Hg. This point anchors the curve at resting conditions. The learner should identify the normal operating point.' },
        { id: 'kp2', weight: 2, description: 'As cardiac output increases severalfold, pulmonary arterial pressure rises only modestly rather than in proportion to flow. This nearly flat response reflects the falling resistance from recruitment and distension. The learner should state that pressure rises only a small amount with large flow increases.' },
      ],
      common_errors: [
        'Saying pulmonary pressure rises in direct proportion to cardiac output.',
        'Placing the normal value at a cardiac output far from 4 L per minute.',
        'Claiming pressure falls as cardiac output rises.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pressure and cardiac output',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Pressure and cardiac output' },
  },

  {
    id: 'atom-p2w4s-gravity-distribution',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Explain how gravity and hydrostatic pressure determine the top to bottom distribution of lung blood flow and how exercise affects that distribution.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Hydrostatic pressure differences due to gravity cause the bottom of each lung to receive more blood flow than the top. The lower regions are at higher intravascular hydrostatic pressure and therefore are better perfused per unit of tissue. The learner should attribute the pattern to gravity and state that the bottom receives more flow.' },
        { id: 'kp2', weight: 2, description: 'Exercise increases the overall blood flow to the lungs but maintains the same relative top to bottom distribution. Both the resting and exercise curves rise with the same general shape, so the bottom remains better perfused. The learner should note that exercise raises total flow without changing the relative pattern.' },
      ],
      common_errors: [
        'Saying the apex receives more flow than the base.',
        'Claiming exercise equalizes flow across all lung levels.',
        'Attributing the distribution to active vascular control rather than gravity.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Distribution of blood flow',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Distribution of blood flow' },
  },

  {
    id: 'atom-p2w4s-zones',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Describe the zone model of pulmonary blood flow and the relationship between alveolar pressure and pulmonary capillary pressure that defines zones 1, 2, and 3.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The lung is divided into zone 1, zone 2, and zone 3 based on hydrostatic pressure differences that occur due to gravity. The alveolar pressure is PALV and pulmonary capillary pressure as Ppc, and the balance between them determines flow in each zone. The learner should name the three zones and identify PALV and Ppc.' },
        { id: 'kp2', weight: 2, description: 'In the upper zone, alveolar pressure can equal or exceed capillary pressure and compress the vessel so flow is limited, while in the lower zone capillary pressure exceeds alveolar pressure so the vessel stays open and flow is continuous. This explains why areas near the bottom receive more blood flow than areas near the top. The learner should relate each zone to the PALV versus Ppc relationship.' },
      ],
      common_errors: [
        'Reversing which zone has the greatest flow.',
        'Ignoring the role of alveolar pressure in compressing the capillary.',
        'Confusing Ppc with systemic capillary pressure.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Hydrostatic effects and zones',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Hydrostatic effects and zones' },
  },

  {
    id: 'atom-p2w4s-hypoxic-vasoconstriction',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Explain hypoxic pulmonary vasoconstriction, including how decreased alveolar PO2 changes local vessel diameter and how this redirects blood flow.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Decreased alveolar PO2 leads to constriction of the local pulmonary vessels. This response is opposite to the systemic circulation, where hypoxia generally produces vasodilation. The learner should state that low alveolar oxygen causes pulmonary vasoconstriction.' },
        { id: 'kp2', weight: 2, description: 'The constriction directs blood flow away from poorly ventilated alveoli and toward well ventilated alveoli, improving the matching of perfusion to ventilation. In the normal alveolus O2 is at 100 mm Hg and CO2 at 40 mm Hg, and blood leaving the capillary reaches an O2 of 100 mm Hg. The learner should explain the redirection of flow toward ventilated alveoli.' },
      ],
      common_errors: [
        'Saying low alveolar PO2 causes pulmonary vasodilation.',
        'Forgetting that the purpose is to match perfusion to ventilation.',
        'Confusing the pulmonary response with the systemic vasodilatory response.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Hypoxic vasoconstriction',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Hypoxic vasoconstriction' },
  },

  {
    id: 'atom-p2w4s-po2-flow-curve',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Describe the curve relating alveolar PO2 to pulmonary blood flow as a percent of control, including the approximate PO2 at which flow nears 100 percent.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The curve relates blood flow to a percent of control on the vertical axis against alveolar PO2 on the horizontal axis. Flow reaches near 100 percent of control at an alveolar PO2 of about 70 and plateaus toward a PO2 of 200. The learner should identify 70 as the value where flow nears full control.' },
        { id: 'kp2', weight: 2, description: 'Below an alveolar PO2 of about 70, blood flow falls steeply as hypoxic vasoconstriction takes effect. This steep decline at low PO2 is what diverts flow away from poorly oxygenated regions. The learner should describe the steep fall in flow below 70 mm Hg.' },
      ],
      common_errors: [
        'Placing the flow threshold at a PO2 far from 70 mm Hg.',
        'Saying flow increases as alveolar PO2 falls.',
        'Confusing the percent of control axis with an absolute flow value.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Alveolar PO2 and flow',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Alveolar PO2 and flow' },
  },

  {
    id: 'atom-p2w4s-starling-forces',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'List the outward and inward Starling forces at the pulmonary capillary and state the resulting net filtration pressure.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The outward forces are pulmonary capillary pressure 7 mm Hg, interstitial osmotic pressure 14 mm Hg, and negative interstitial pressure 8 mm Hg, for a total of 29 mm Hg. The single inward force is plasma osmotic pressure at 28 mm Hg. The learner should list all outward forces with their values and the inward force.' },
        { id: 'kp2', weight: 2, description: 'The total outward force of 29 mm Hg minus the inward force of 28 mm Hg leaves a net filtration pressure of 1 mm Hg outward. This small outward pressure slowly filters fluid that is transferred to the lymphatics, and the negative interstitial pressure keeps the alveoli dry. The learner should compute and state the net 1 mm Hg outward result.' },
      ],
      common_errors: [
        'Listing plasma osmotic pressure as an outward force.',
        'Giving a net filtration pressure much larger than 1 mm Hg.',
        'Omitting the negative interstitial pressure of 8 mm Hg from the outward forces.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pulmonary capillary dynamics',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Pulmonary capillary dynamics' },
  },

  {
    id: 'atom-p2w4s-edema-causes',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'List the causes of pulmonary edema and explain how each disrupts the capillary force balance, including the edema safety factor threshold.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The four causes are: increased pulmonary venous and capillary pressure from left heart failure or mitral stenosis, which raises the outward force; increased capillary membrane permeability from infections or noxious gases such as chlorine and sulfur dioxide; decreased plasma osmotic pressure from liver failure, which lowers the inward force; and a large decrease in intrapleural pressure from inspiring heavily against a closed airway as in severe laryngeal spasm. The learner should name each cause and its effect.' },
        { id: 'kp2', weight: 2, description: 'The pulmonary edema safety factor provides protection against edema until pulmonary capillary pressure equals the capillary osmotic pressure. Below that point the inward osmotic force still keeps the alveoli dry, but once capillary pressure exceeds the osmotic value fluid accumulates rapidly. The learner should state the threshold at which protection is lost.' },
      ],
      common_errors: [
        'Saying an increase in plasma osmotic pressure causes edema rather than a decrease.',
        'Omitting the negative intrapleural pressure cause such as laryngeal spasm.',
        'Stating the safety factor is lost at a pressure unrelated to the capillary osmotic pressure.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Causes of pulmonary edema',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Causes of pulmonary edema' },
  },

  {
    id: 'atom-p2w4s-edema-safety-factors',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'List the safety factors that protect against pulmonary edema and explain how each helps keep the alveoli dry.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The three safety factors are: negative interstitial pressure, lymphatic pumping, and decreased interstitial osmotic pressure. Negative interstitial pressure pulls fluid out of the air spaces and is specifically credited with keeping the alveoli dry. The learner should name all three safety factors.' },
        { id: 'kp2', weight: 2, description: 'Lymphatic pumping removes the small amount of fluid that is normally filtered outward at the net 1 mm Hg pressure, and a decreased interstitial osmotic pressure lowers the outward pull on fluid. Together these mechanisms prevent fluid from accumulating until capillary pressure rises enough to overwhelm them. The learner should explain how each factor limits fluid buildup.' },
      ],
      common_errors: [
        'Omitting lymphatic pumping from the list of safety factors.',
        'Saying positive interstitial pressure protects against edema.',
        'Confusing the safety factors with the causes of edema.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Safety factors against edema',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Safety factors against edema' },
  },

  {
    id: 'atom-p2w4s-pleural-fluid',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Describe the thin pleural fluid layer, why the pleural space is kept at negative pressure, and the causes of a pleural effusion.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'A thin layer of mucoid fluid lies between the parietal and visceral pleurae to reduce friction between the lung, pleura, and chest wall during ventilation. Because the net Starling force is plus 1, fluid filters slowly but continuously out of the pulmonary capillaries, and the lymphatic system maintains a negative pressure of the pleural fluid and space that keeps the lungs from collapsing. The learner should explain the friction reducing role and the negative pressure maintained by lymphatics.' },
        { id: 'kp2', weight: 2, description: 'A pleural effusion is a collection of fluid in the pleural space. The its causes are lymphatic obstruction such as tumor, heart failure, reduced plasma osmotic pressure, infection or inflammation of capillary membranes causing increased permeability, or fluid production being greater than drainage. The learner should name the major causes of effusion.' },
      ],
      common_errors: [
        'Saying the pleural fluid carries oxygen or stores surfactant rather than reducing friction.',
        'Claiming the pleural space is normally at positive pressure.',
        'Forgetting that lymphatic obstruction such as tumor can cause an effusion.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pleural fluid and effusion',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Pleural fluid and effusion' },
  },

  {
    id: 'atom-p2w5g-partial-pressure-fraction',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State how the partial pressure of a gas is related to its fraction and to total pressure, and use a barometric pressure of 760 mm Hg to give the approximate dry atmospheric PO2. Explain what total pressure equals in a gas mixture.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Partial pressure is proportional to the fraction of the gas, as PP proportional to Patm times the fraction of gas, with Patm equal to 760 mm Hg. So a gas present at a given percentage contributes that percentage of the total pressure. For oxygen at about 0.21 in dry air, this yields a PO2 of roughly 149 to 159 mm Hg, and the alveolar air table lists dry atmospheric O2 as 159 mm Hg.' },
        { id: 'kp2', weight: 2, description: 'Total pressure is the sum of the partial pressures of each gas in the mixture, specifically O2, N2, CO2, and H2O. Each gas contributes to the total in direct proportion to its concentration, so the partial pressures must add up to the barometric total of 760 mm Hg. This additivity is the basis for partitioning the total into individual gas pressures.' },
      ],
      common_errors: [
        'Confusing percent concentration with partial pressure in mm Hg',
        'Forgetting that water vapor contributes to total pressure',
        'Assuming partial pressures need not sum to the barometric total',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Partial pressure concept',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Partial pressure concept' },
  },

  {
    id: 'atom-p2w5g-humidified-inspired-po2',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Calculate the PO2 of humidified inspired air, including the value subtracted for water vapor, the oxygen fraction used, and the final result. Explain why water vapor is subtracted before applying the oxygen fraction.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Inspired PO2 as (760 minus 47) times 0.21, which equals 713 times 0.21, or about 149 mm Hg. The 47 mm Hg is the water vapor pressure added by humidification in the airway, and 0.21 is the oxygen fraction. ' },
        { id: 'kp2', weight: 2, description: 'Water vapor pressure must be subtracted from the total barometric pressure before multiplying by the oxygen fraction because the humidified water vapor dilutes the dry gas mixture. If 760 were multiplied by 0.21 without subtracting 47, the inspired PO2 would be overestimated. Correctly accounting for the 47 mm Hg lowers the humidified inspired PO2 from about 159 in dry air to about 149 in the airway.' },
      ],
      common_errors: [
        'Skipping the subtraction of the 47 mm Hg water vapor term',
        'Using an oxygen fraction other than about 0.21',
        'Reporting 713 as the final PO2 rather than the intermediate value',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Humidified inspired oxygen',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Humidified inspired oxygen' },
  },

  {
    id: 'atom-p2w5g-respiratory-membrane-layers',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'List, in order from alveolar gas to the red blood cell, the layers of the respiratory membrane that a gas must cross.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The respiratory membrane layers in order are the surfactant and fluid layer, the alveolar epithelium, the epithelial basement membrane, the interstitial space, the capillary basement membrane, and the capillary endothelium. A gas molecule must traverse every one of these layers to move between alveolar air and blood. O2 diffusing inward and CO2 diffusing outward across this same stack.' },
        { id: 'kp2', weight: 2, description: 'Each of the six layers is a distinct diffusion barrier, and together they form the complete path for oxygen and carbon dioxide exchange. The surfactant and fluid layer lines the alveolus, while the capillary endothelium borders the blood, with the basement membranes and interstitial space sandwiched between the two cellular layers. Knowing the full sequence clarifies where pathology can add resistance to diffusion.' },
      ],
      common_errors: [
        'Omitting the surfactant and fluid layer or the interstitial space',
        'Listing only one basement membrane instead of two',
        'Reversing the order so blood-side layers come first',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Respiratory membrane layers',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Respiratory membrane layers' },
  },

  {
    id: 'atom-p2w5g-respiratory-membrane-thickness',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State the total thickness of the respiratory membrane and explain why this dimension matters for gas exchange.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The total respiratory membrane thickness is about 0.2 micrometers. This is the distance a gas molecule must diffuse across all six layers of the membrane. It is a very small distance, which is essential for rapid gas transfer.' },
        { id: 'kp2', weight: 2, description: 'Because diffusion is inversely related to distance, the extremely thin 0.2 micrometer membrane allows oxygen and carbon dioxide to equilibrate quickly during the brief time blood spends in the pulmonary capillary. This thickness should not be confused with the 0.2 mm average alveolar diameter, which is a thousand times larger and describes alveolar size rather than the diffusion path.' },
      ],
      common_errors: [
        'Confusing 0.2 micrometers with the 0.2 mm alveolar diameter',
        'Stating the thickness in millimeters instead of micrometers',
        'Assuming membrane thickness has no effect on diffusion rate',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Respiratory membrane thickness',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Respiratory membrane thickness' },
  },

  {
    id: 'atom-p2w5g-ficks-law',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State Fick\'s Law of diffusion, including every term in the numerator and denominator, and identify which terms are variable and which are fixed.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Fick\'s Law states that diffusion equals the pressure gradient (P1 minus P2) times area times solubility, all divided by distance times the square root of molecular weight. The numerator contains the pressure gradient, area, and solubility, and the denominator contains the distance and the square root of molecular weight. Diffusion therefore increases with a larger gradient, area, or solubility and decreases with greater distance or molecular weight.' },
        { id: 'kp2', weight: 2, description: 'Pressure gradient, area, and distance as the factors that can vary physiologically, while solubility and molecular weight are fixed properties of a given gas. This means that in the body, changes in diffusion are driven by altering the gradient, the available surface area, or the diffusion distance. The diffusing capacity DL is similarly expressed as area times the diffusion coefficient divided by thickness.' },
      ],
      common_errors: [
        'Placing solubility in the denominator instead of the numerator',
        'Treating solubility or molecular weight as adjustable variables',
        'Forgetting that molecular weight enters as a square root',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Fick\'s Law of diffusion',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Fick\'s Law of diffusion' },
  },

  {
    id: 'atom-p2w5g-co2-solubility',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State how the solubility of carbon dioxide compares with that of oxygen, and explain how this relates to the relative diffusing capacities of the two gases.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'CO2 is 20 times as soluble as O2. Because solubility is a numerator term in Fick\'s Law, this much greater solubility strongly favors carbon dioxide diffusion. It allows CO2 to cross the respiratory membrane easily even though its partial pressure gradient is smaller than that of oxygen.' },
        { id: 'kp2', weight: 2, description: 'As a direct consequence, the diffusing capacity of CO2 is about 20 times the diffusing capacity of O2, both at rest and during exercise. This high solubility and diffusing capacity mean carbon dioxide transfer is rarely limited by diffusion across the membrane. Oxygen, with much lower solubility, is the gas more likely to be diffusion limited.' },
      ],
      common_errors: [
        'Stating that oxygen is more soluble than carbon dioxide',
        'Confusing the 20 times solubility ratio with the partial pressure gradient',
        'Assuming the two gases have equal diffusing capacities',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Carbon dioxide solubility',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Carbon dioxide solubility' },
  },

  {
    id: 'atom-p2w5g-vq-definition',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Define the ventilation-perfusion ratio and compute the normal whole-lung value from 4 L/min ventilation and 5 L/min blood flow. State what equality of alveolar and end capillary gas pressures implies.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'V/Q is as the ratio between ventilation and blood flow, representing the relationship between adequate flow and adequate ventilation. Using whole-lung values of 4 L/min ventilation divided by 5 L/min blood flow gives a normal ratio of 0.8. This single number summarizes how well ventilation is matched to perfusion for the whole lung.' },
        { id: 'kp2', weight: 2, description: 'If there is no diffusion impairment, the PO2 between an alveolus and end capillary blood are usually the same, and the same is true for PCO2. This means that in a healthy lung, alveolar gas pressures reflect the gas pressures of blood leaving the capillary. The V/Q ratio thus governs both alveolar and arterial gas values.' },
      ],
      common_errors: [
        'Inverting the ratio to report 1.25 instead of 0.8',
        'Defining V/Q as blood flow over ventilation',
        'Assuming alveolar and end capillary gases differ even without diffusion impairment',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Ventilation-perfusion ratio',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Ventilation-perfusion ratio' },
  },

  {
    id: 'atom-p2w5g-regional-vq',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State the approximate V/Q ratios of the upper lung and lower lung, and explain what regional differences produce this variation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The upper lung Va/Q is normally approximately 3 and the lower lung Va/Q is normally approximately 0.5. The apex therefore has a much higher ventilation-perfusion ratio than the base. These regional values bracket the whole-lung average of 0.8.' },
        { id: 'kp2', weight: 2, description: 'Differences in airway and lung expansion produce uneven regional ventilation, and differences in vascular geometry and hydrostatic pressure produce uneven regional blood flow. Together these cause V/Q ratios to vary across regions even within a normal, healthy lung. The base is relatively underventilated and well perfused, while the apex is relatively overventilated and underperfused.' },
      ],
      common_errors: [
        'Assigning the high ratio of 3 to the lung base',
        'Assuming a uniform V/Q throughout the lung',
        'Confusing the regional values with the whole-lung average of 0.8',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Regional V/Q distribution',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Regional V/Q distribution' },
  },

  {
    id: 'atom-p2w5g-shunt-vs-deadspace',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Distinguish physiological shunt from physiological dead space, using how each compares with the normal V/Q and what each represents.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'A physiological shunt is as a unit with Va/Q below normal, corresponding to low ventilation relative to perfusion. Blood passes such a unit without being fully oxygenated because ventilation is inadequate. This is the low V/Q end of the mismatch spectrum.' },
        { id: 'kp2', weight: 2, description: 'A physiological dead space is defined as a unit with Va/Q above normal, representing wasted ventilation relative to perfusion. Ventilation reaches such a unit but is not matched by adequate blood flow, so that ventilation does not contribute effectively to gas exchange. This is the high V/Q end of the mismatch spectrum.' },
      ],
      common_errors: [
        'Defining a shunt as Va/Q above normal',
        'Calling dead space low ventilation rather than wasted ventilation',
        'Swapping the two definitions',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Shunt versus dead space',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Shunt versus dead space' },
  },

  {
    id: 'atom-p2w5g-vq-extreme-gases',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State the alveolar PO2 and PCO2 that a lung unit approaches at the two V/Q extremes, when V/Q equals zero and when V/Q approaches infinity.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'When V/Q equals zero, ventilation is absent and the alveolar gas equilibrates with mixed venous blood, approaching PO2 of about 40 and PCO2 of about 45 mm Hg. This is the shunt extreme. The unit takes on the gas composition of the blood that perfuses it.' },
        { id: 'kp2', weight: 2, description: 'When V/Q approaches infinity, perfusion is absent and the alveolar gas approaches inspired humidified air, with PO2 of about 150 and PCO2 of about 0 mm Hg. This is the dead space extreme. Normal alveolar air, at PO2 about 104 and PCO2 about 40, lies between these two extremes.' },
      ],
      common_errors: [
        'Assigning inspired air values to the zero V/Q shunt unit',
        'Forgetting that PCO2 falls toward zero in a high V/Q unit',
        'Confusing the extreme values with the normal alveolar values of 104 and 40',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Gas values at V/Q extremes',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Gas values at V/Q extremes' },
  },

  {
    id: 'atom-p2w5g-paco2-ventilation',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State the alveolar PCO2 equation, including the constant, and describe quantitatively how PCO2 changes when alveolar ventilation is doubled or halved.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Alveolar PCO2 as CO2 production times a constant K, divided by alveolar ventilation, where K is a multivariable correction factor equal to about 863 mm Hg. Because alveolar ventilation is in the denominator, PCO2 is inversely proportional to ventilation when CO2 production is constant. This equation links the metabolic CO2 load and ventilation to the resulting alveolar PCO2.' },
        { id: 'kp2', weight: 2, description: 'From this inverse relationship, if ventilation is doubled then PCO2 is halved, and if ventilation is halved then PCO2 is doubled. So alveolar ventilation is the primary controller of alveolar and arterial PCO2 at a fixed metabolic rate. Doubling effective alveolar ventilation cuts the carbon dioxide pressure in half.' },
      ],
      common_errors: [
        'Treating PCO2 as directly proportional to ventilation',
        'Omitting or misstating the constant K of about 863 mm Hg',
        'Forgetting that the relationship assumes constant CO2 production',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Alveolar PCO2 equation',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Alveolar PCO2 equation' },
  },

  {
    id: 'atom-p2w5g-hyper-hypoventilation',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State how to define hyperventilation and hypoventilation in terms of alveolar PCO2, and explain why these terms are defined relative to metabolic demand rather than a fixed breathing rate.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'hyperventilation is defined as PACO2 less than 40 and hypoventilation as PACO2 greater than 40. Hyperventilation is increased ventilation beyond metabolic need, which causes a drop in arterial CO2, while hypoventilation is ventilation below needs, which causes arterial CO2 to rise. Increasing V/Q produces a lower PACO2 and decreasing V/Q produces a higher PACO2.' },
        { id: 'kp2', weight: 2, description: 'These terms are defined relative to metabolic CO2 production, not to any fixed rate of breathing, because the adequacy of ventilation depends on the carbon dioxide load it must clear. one example is a CO2 excretion rate of 200 versus 800 mL per minute, a fourfold increase in metabolic rate, which requires greater ventilation just to keep PACO2 normal. Thus the same minute ventilation can be appropriate, hyperventilation, or hypoventilation depending on metabolic demand.' },
      ],
      common_errors: [
        'Reversing the thresholds so hyperventilation is PACO2 above 40',
        'Defining hyperventilation by breathing rate rather than by PACO2 relative to metabolic need',
        'Assuming a fixed minute ventilation is always adequate regardless of CO2 production',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Hyperventilation and hypoventilation',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Hyperventilation and hypoventilation' },
  },

  {
    id: 'atom-p2w5t-three-measures',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Define the three measurements used to describe oxygen in blood: partial pressure, saturation, and content. For each, state what it represents, its units, and its physiologic role as taught.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Partial pressure is measured in mm Hg, depends on the percentage of gas present, and is the driving force for diffusion. It reflects only the dissolved gas and not the amount bound to hemoglobin, so it determines the direction and rate of oxygen movement across membranes.' },
        { id: 'kp2', weight: 2, description: 'Saturation is the percent of hemoglobin that has oxygen bound, expressed as HbO2 divided by Hb plus HbO2, while content is the absolute quantity of oxygen in blood expressed in mL O2 per 100 mL blood. Saturation is a percentage and content is an absolute amount, so the two answer different questions.' },
      ],
      common_errors: [
        'Saying saturation and content are the same because both describe how much oxygen is present.',
        'Giving partial pressure in mL rather than mm Hg.',
        'Forgetting that partial pressure reflects only dissolved oxygen, not hemoglobin-bound oxygen.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Oxygen measurements',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Oxygen measurements' },
  },

  {
    id: 'atom-p2w5t-dissolved-vs-bound',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Compare dissolved oxygen and hemoglobin-bound oxygen as forms of oxygen carriage. State the dissolved oxygen relationship with its solubility coefficient, the hemoglobin carrying capacity per gram, the approximate normal content of each, and the fraction of transport each provides.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Dissolved oxygen equals solubility times PaO2, with a solubility of 0.003 mL O2 per dL plasma per mm Hg, giving only about 0.3 mL per dL at a PaO2 of 100 mm Hg. This small dissolved amount maintains partial pressure but provides little content.' },
        { id: 'kp2', weight: 2, description: 'Hemoglobin-bound oxygen equals about 1.34 to 1.39 mL O2 per gram of hemoglobin times grams of hemoglobin times percent saturation, giving roughly 20 mL per dL at 15 g per dL. About 97 percent of oxygen is transported bound to hemoglobin, which is why hemoglobin is essential.' },
      ],
      common_errors: [
        'Confusing the 0.003 solubility coefficient with the 1.34 to 1.39 carrying capacity.',
        'Believing dissolved oxygen carries a clinically significant amount of the total.',
        'Stating that hemoglobin carries only about half of blood oxygen rather than about 97 percent.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Oxygen carriage',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Oxygen carriage' },
  },

  {
    id: 'atom-p2w5t-pulmonary-gradient',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Describe the PO2 gradient along the pulmonary capillary. State the PO2 at the arterial and venous ends and the alveolar PO2 the blood equilibrates toward, and explain what drives oxygen uptake in the lungs.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Blood enters the pulmonary capillary at the arterial end with a PO2 of 40 mm Hg, which is the value of mixed venous blood returning to the lungs. Oxygen then diffuses from alveolus to blood down a pressure gradient.' },
        { id: 'kp2', weight: 2, description: 'By the venous end of the pulmonary capillary the blood PO2 has risen to about 104 mm Hg, equilibrating with the alveolar PO2 of about 104 mm Hg. The difference between alveolar and incoming blood PO2 is the driving force for oxygen uptake.' },
      ],
      common_errors: [
        'Reversing the ends and stating blood enters at 104 and leaves at 40.',
        'Confusing alveolar PO2 of 104 with the systemic arterial value of about 100 after shunt mixing.',
        'Stating that uptake occurs without any pressure gradient.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pulmonary uptake',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Pulmonary uptake' },
  },

  {
    id: 'atom-p2w5t-transit-safety',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Explain the pulmonary capillary transit time and the diffusion safety factor. State how long oxygen equilibration takes, how long a red cell stays in the pulmonary capillary, and why the difference matters during conditions such as exercise.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Oxygen equilibration between alveolus and pulmonary capillary blood normally completes within about 0.25 seconds. This is the time needed for blood PO2 to rise to the alveolar level.' },
        { id: 'kp2', weight: 2, description: 'Each red cell normally spends about 0.75 seconds in the pulmonary capillary, so equilibration finishes in roughly the first third of transit. This surplus is the safety factor that preserves oxygenation when transit time shortens, as during exercise when cardiac output rises.' },
      ],
      common_errors: [
        'Swapping the values and saying transit time is 0.25 seconds and equilibration takes 0.75 seconds.',
        'Concluding that shorter transit during exercise must cause desaturation.',
        'Ignoring the safety factor concept entirely.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pulmonary uptake',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Pulmonary uptake' },
  },

  {
    id: 'atom-p2w5t-tissue-po2-balance',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Explain what determines tissue PO2. State the arterial, interstitial tissue, and intracellular PO2 values and describe the balance that sets the tissue value.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Arterial blood has a PO2 of about 95 to 100 mm Hg, interstitial tissue about 30 to 40 mm Hg, and the value within cells is about 23 mm Hg. Oxygen diffuses down this falling gradient from blood into cells.' },
        { id: 'kp2', weight: 2, description: 'Tissue PO2 is determined by the balance of oxygen delivery and oxygen usage. Increasing consumption at a fixed delivery lowers tissue PO2, while increasing delivery at a fixed consumption raises it, reflected in the interstitial PO2 versus blood flow relationship.' },
      ],
      common_errors: [
        'Assuming tissue PO2 equals arterial PO2.',
        'Listing intracellular PO2 as 40 mm Hg, which is the interstitial value, rather than about 23 mm Hg.',
        'Considering only delivery and ignoring usage.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Tissue oxygen',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Tissue oxygen' },
  },

  {
    id: 'atom-p2w5t-flow-delivery',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Show how oxygen delivery is calculated as content times blood flow. using the values, compute delivery at normal flow and at high flow for a content of 20 mL O2 per 100 mL blood, and state the upper limit on interstitial PO2.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Oxygen delivery equals oxygen content times blood flow. At a content of 20 mL O2 per 100 mL blood and a normal flow of about 5000 mL per minute, delivery is about 1000 mL O2 per minute.' },
        { id: 'kp2', weight: 2, description: 'Raising blood flow to about 20000 mL per minute at the same content of 20 mL per 100 mL raises delivery to about 4000 mL O2 per minute. Higher flow raises interstitial PO2 but never above the upper limit set by arterial PO2.' },
      ],
      common_errors: [
        'Multiplying content by flow with inconsistent volume units and getting the wrong scale.',
        'Believing interstitial PO2 can exceed arterial PO2 at very high flow.',
        'Confusing oxygen delivery of about 1000 mL per minute with oxygen consumption of about 250 mL per minute.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Oxygen delivery',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Oxygen delivery' },
  },

  {
    id: 'atom-p2w5t-right-shift-factors',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'List the four factors that shift the hemoglobin oxygen dissociation curve to the right and state what a right shift does to oxygen affinity and to saturation at a given PO2.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The four right-shift factors taught are increased hydrogen ions, increased CO2 (the Bohr effect), increased temperature, and increased BPG (2,3 biphosphoglycerate). BPG is a metabolic phosphate compound that reduces the affinity of hemoglobin for oxygen.' },
        { id: 'kp2', weight: 2, description: 'A right shift means that for any given PO2 the percent saturation is lower, because the affinity of hemoglobin for oxygen is reduced. This favors release of oxygen to the tissues, which is helpful in hypoxia and exercise.' },
      ],
      common_errors: [
        'Including decreased temperature or decreased CO2 among right-shift factors.',
        'Stating that a right shift increases oxygen affinity.',
        'Forgetting that increased BPG is one of the four factors.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Curve shifts',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Curve shifts' },
  },

  {
    id: 'atom-p2w5t-bohr-tissue-lung',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Explain the directional shifts of the dissociation curve at the tissue and at the lungs. Describe how CO2 and hydrogen ions shift the curve at the tissue and how loss of CO2 shifts it at the lungs, and state the effect on affinity and on oxygen loading and unloading.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'At the metabolizing tissue, increased carbon dioxide in blood and increased hydrogen ions shift the curve to the right, decreasing affinity for oxygen and promoting oxygen unloading while helping maintain the partial pressure gradient that drives diffusion into cells.' },
        { id: 'kp2', weight: 2, description: 'At the lungs, loss of carbon dioxide shifts the curve to the left, increasing affinity for oxygen and favoring oxygen loading onto hemoglobin. The curve thus moves in opposite directions at the tissue and the lung to match the needs of each site.' },
      ],
      common_errors: [
        'Reversing the sites, placing the right shift at the lungs and the left shift at the tissue.',
        'Stating that the tissue shift increases oxygen affinity.',
        'Omitting that the tissue right shift helps maintain the partial pressure gradient.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Curve shifts',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Curve shifts' },
  },

  {
    id: 'atom-p2w5t-shunt-fio2',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Define a physiologic shunt and explain its response to increased FIO2. State the normal shunt fraction, the normal sources of that shunt, example pathologies, and why arterial PO2 changes little with supplemental oxygen in a true shunt.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'A shunt is blood that does not exchange gas. The normal shunt fraction is about 5 percent of blood flow, arising from bronchial venous return and the Thebesian veins of the heart, and pathologic causes include pneumonia, atelectasis, and intracardiac shunts.' },
        { id: 'kp2', weight: 2, description: 'With a shunt, arterial PO2 increases very little with increased FIO2 because the shunted blood never contacts alveolar gas and cannot take up the extra oxygen. This poor oxygen response is the hallmark of a true shunt.' },
      ],
      common_errors: [
        'Stating the normal shunt fraction is 0 percent instead of about 5 percent.',
        'Claiming a true shunt corrects fully with supplemental oxygen.',
        'Forgetting that bronchial and Thebesian venous drainage are the normal shunt sources.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Shunt',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Shunt' },
  },

  {
    id: 'atom-p2w5t-vq-mismatch',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Describe ventilation perfusion mismatch and its response to increased FIO2. State which regions contribute to hypoxemia, example pathologies, the normal alveolar to arterial oxygen difference, and how low V/Q regions respond to supplemental oxygen.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Regional V/Q ratios vary throughout the lung, and low V/Q regions contribute to hypoxemia, with pathologies including asthma, emphysema, and atelectasis. Regions with V/Q greater than 1.0 do not contribute to hypoxemia.' },
        { id: 'kp2', weight: 2, description: 'Hypoxemia from low V/Q regions is responsive to increasing FIO2 because the still-ventilated alveoli can deliver more oxygen, which differentiates it from a true shunt. The normal alveolar to arterial oxygen difference is about 10 mm Hg and increases with age.' },
      ],
      common_errors: [
        'Asserting that high V/Q regions cause hypoxemia.',
        'Claiming low V/Q hypoxemia does not respond to supplemental oxygen.',
        'Giving the normal alveolar to arterial oxygen difference as a value other than about 10 mm Hg.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'V/Q mismatch',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'V/Q mismatch' },
  },

  {
    id: 'atom-p2w5t-co2-forms',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'List the three forms in which carbon dioxide is transported in blood with their approximate percentages, and describe the role of carbonic anhydrase and the chloride shift inside the red cell.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Carbon dioxide is transported as bicarbonate at about 70 percent, as carbaminohemoglobin bound to hemoglobin at about 23 percent, and as dissolved CO2 at about 7 percent. Bicarbonate is therefore the dominant transport form.' },
        { id: 'kp2', weight: 2, description: 'Inside the red cell, carbonic anhydrase rapidly converts CO2 and water into carbonic acid, which dissociates into bicarbonate and hydrogen ions. Bicarbonate then moves out of the cell into plasma in exchange for chloride, the chloride shift, while hydrogen ions are buffered by hemoglobin.' },
      ],
      common_errors: [
        'Stating dissolved CO2 or carbaminohemoglobin is the major form rather than bicarbonate.',
        'Omitting carbonic anhydrase as the enzyme that speeds bicarbonate formation.',
        'Forgetting the chloride shift that balances bicarbonate leaving the red cell.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Carbon dioxide transport',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Carbon dioxide transport' },
  },

  {
    id: 'atom-p2w5t-haldane',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Define the Haldane effect. Explain how the oxygenation state of hemoglobin changes the amount of carbon dioxide the blood carries at a PO2 of 40 mm Hg versus 100 mm Hg, and why this aids carbon dioxide exchange.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The Haldane effect is the change in carbon dioxide carriage caused by the oxygenation state of hemoglobin. At a PO2 of 40 mm Hg (tissue conditions) the blood holds more CO2, while at a PO2 of 100 mm Hg (lung conditions) it holds less across the two conditions.' },
        { id: 'kp2', weight: 2, description: 'Deoxygenated hemoglobin binds carbon dioxide and hydrogen ions more readily, so unloading oxygen at the tissue promotes CO2 pickup, and loading oxygen at the lungs drives CO2 release into the alveoli. This makes oxygen and carbon dioxide transport mutually reinforcing.' },
      ],
      common_errors: [
        'Confusing the Haldane effect with the Bohr effect, which concerns oxygen affinity rather than CO2 carriage.',
        'Stating that oxygenated blood carries more CO2 than deoxygenated blood.',
        'Failing to connect the effect to improved CO2 loading at the tissue and unloading at the lung.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Carbon dioxide transport',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Carbon dioxide transport' },
  },

  {
    id: 'atom-p2w6r-dorsal-ramp',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe the dorsal respiratory group: where it is located, its role in the respiratory rhythm, and the nature and behavior of the inspiratory ramp signal it produces, including what happens at the end of the ramp.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The dorsal respiratory group is located in the medulla. It is mainly responsible for inspiration, is important for the basic rhythm of respiration, and has intrinsic nerve activity that generates that rhythm even without external input.' },
        { id: 'kp2', weight: 2, description: 'Its inspiratory output is a ramp signal: the signal progressively increases to the inspiratory muscles during inspiration and then abruptly stops, allowing passive expiration by elastic recoil. The ramp becomes steeper when more rapid lung filling is needed.' },
      ],
      common_errors: [
        'Placing the dorsal respiratory group in the pons rather than the medulla.',
        'Describing the inspiratory signal as a square wave or steady plateau instead of a progressive ramp.',
        'Believing expiration after the ramp is active rather than passive elastic recoil.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Dorsal respiratory group',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Dorsal respiratory group' },
  },

  {
    id: 'atom-p2w6r-pneumotaxic-pons',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe the pneumotaxic center: its location, the signal it sends to the dorsal respiratory group, its effect on the ramp signal, and the resulting changes in breath depth and respiratory rate.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The pneumotaxic center is located in the pons. It sends modulatory signals to the dorsal respiratory group that decrease the duration of the inspiratory ramp signal, effectively switching off inspiration earlier.' },
        { id: 'kp2', weight: 2, description: 'By shortening the ramp it limits inspiration and makes breaths shallower. Because each inspiration is cut short, more breaths occur per minute, so a strong pneumotaxic signal increases the respiratory rate.' },
      ],
      common_errors: [
        'Locating the pneumotaxic center in the medulla instead of the pons.',
        'Saying it deepens breaths rather than making them shallower.',
        'Stating it decreases respiratory rate instead of increasing it.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pneumotaxic center',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Pneumotaxic center' },
  },

  {
    id: 'atom-p2w6r-central-chemo',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe the central chemoreceptors: their location, the mediator they respond to directly, and the indirect mechanism by which carbon dioxide stimulates them through the formation of hydrogen ions.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The central chemoreceptors lie in the chemosensitive area of the brainstem. Their direct mediator is the hydrogen ion; an increase in hydrogen ion concentration at this area is the immediate stimulus that increases ventilation.' },
        { id: 'kp2', weight: 2, description: 'Carbon dioxide acts indirectly. It crosses into the cerebrospinal fluid and combines with water to form carbonic acid, which dissociates into hydrogen ions and bicarbonate. The liberated hydrogen ions excite the chemosensitive area, so the carbon dioxide effect is mediated through pH.' },
      ],
      common_errors: [
        'Saying central chemoreceptors sense oxygen.',
        'Claiming carbon dioxide stimulates the area directly rather than through generated hydrogen ions.',
        'Locating the central chemoreceptors outside the brainstem.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Central chemoreceptors',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Central chemoreceptors' },
  },

  {
    id: 'atom-p2w6r-peripheral-chemo',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe the peripheral chemoreceptors: where they are located, the primary mediator they respond to, the secondary mediators, and the oxygen level below which their effect becomes greatest.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The peripheral chemoreceptors are located in the carotid bodies, found at the bifurcation of the carotid arteries, and in the aortic bodies. Their main mediator is decreased oxygen, making them the principal sensors of low arterial oxygen.' },
        { id: 'kp2', weight: 2, description: 'They respond primarily to oxygen, with the greatest effect when arterial PO2 falls below 100 mm Hg, and they also respond to a lesser extent to carbon dioxide and hydrogen ion levels. Carotid body nerve impulses rise steeply only as PO2 drops well under 100 mm Hg.' },
      ],
      common_errors: [
        'Saying peripheral chemoreceptors respond mainly to carbon dioxide rather than oxygen.',
        'Forgetting that the oxygen effect becomes large only below a PO2 of 100 mm Hg.',
        'Omitting either the carotid bodies or the aortic bodies as locations.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Peripheral chemoreceptors',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Peripheral chemoreceptors' },
  },

  {
    id: 'atom-p2w6r-co2-vs-ph',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Explain why changes in arterial PCO2 have a greater effect on the control of respiration than equivalent changes in arterial pH, referencing the permeability of the blood brain barrier.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Changes in arterial PCO2 have a greater effect on the control of respiration than changes in arterial pH have. This is a central point of the carbon dioxide and pH control relationship on the response curve.' },
        { id: 'kp2', weight: 2, description: 'The reason is that the blood brain barrier is far more permeable to carbon dioxide than to hydrogen ions. Carbon dioxide diffuses readily into the brain and then forms hydrogen ions on the brain side, whereas blood hydrogen ions cross poorly, so a given carbon dioxide change influences the chemosensitive area more strongly.' },
      ],
      common_errors: [
        'Stating that hydrogen ions cross the blood brain barrier as easily as carbon dioxide.',
        'Saying pH changes affect respiration more than PCO2 changes.',
        'Ignoring the blood brain barrier as the reason for the difference.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'CO2 versus pH',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'CO2 versus pH' },
  },

  {
    id: 'atom-p2w6r-co2-major-stimulus',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Explain why carbon dioxide is described as the major stimulus for increased respiration, how it acts on the chemosensitive area, and what happens to the response after a few days of chronically high carbon dioxide.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Carbon dioxide is the major stimulus for increased respiration. It acts on the chemosensitive area through pH, meaning the rise in carbon dioxide generates hydrogen ions centrally that drive the increase in ventilation.' },
        { id: 'kp2', weight: 2, description: 'If PCO2 is held constant, low oxygen can become important as a stimulus. After a few days, however, there is less of a response to chronically high carbon dioxide, so the carbon dioxide drive is blunted over time.' },
      ],
      common_errors: [
        'Naming oxygen as the major everyday stimulus instead of carbon dioxide.',
        'Forgetting that carbon dioxide acts through pH at the chemosensitive area.',
        'Believing the carbon dioxide response stays fully intact during chronic hypercapnia.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'CO2 as major stimulus',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'CO2 as major stimulus' },
  },

  {
    id: 'atom-p2w6r-hypoxic-drive',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Explain how hypoxia increases ventilation and why this hypoxic ventilatory response is self limiting, referencing the change in PCO2 that results from the hyperventilation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Hypoxia stimulates the peripheral chemoreceptors and increases ventilation, so falling arterial oxygen raises the breathing response, especially as PO2 drops below 100 mm Hg.' },
        { id: 'kp2', weight: 2, description: 'This effect is limited by the resultant fall in PCO2 due to the hyperventilation. As ventilation rises, carbon dioxide is washed out, lowering PCO2 and reducing the central drive, so the net increase in ventilation from low oxygen alone stays modest.' },
      ],
      common_errors: [
        'Saying the hypoxic response is unlimited rather than self limiting.',
        'Stating that PCO2 rises during hypoxic hyperventilation instead of falling.',
        'Forgetting that the fall in carbon dioxide is what blunts the hypoxic drive.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Hypoxic drive',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Hypoxic drive' },
  },

  {
    id: 'atom-p2w6r-co2-retention',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Explain carbon dioxide retention in severe lung disease such as COPD: the blood gas disturbances present, what the respiratory drive becomes dependent on, the role of the kidneys, and why treating with oxygen can be harmful.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Severe lung disease and COPD result in hypoxemia and hypercapnia. Because the response to chronically high carbon dioxide is blunted, the respiratory drive becomes dependent on the low oxygen stimulus, and the kidneys provide renal control of acid base balance.' },
        { id: 'kp2', weight: 2, description: 'Because breathing is driven by low oxygen, treating with oxygen removes that hypoxic stimulus and inhibits the respiratory drive. Giving oxygen can therefore reduce ventilation and worsen carbon dioxide retention in these patients.' },
      ],
      common_errors: [
        'Saying oxygen therapy stimulates the respiratory drive in a chronic retainer.',
        'Forgetting the role of the kidneys in compensating acid base balance.',
        'Stating that the carbon dioxide response remains normal rather than blunted in chronic disease.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'CO2 retention',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'CO2 retention' },
  },

  {
    id: 'atom-p2w6r-exercise-linear',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe the relationship between ventilation and workload during exercise and how arterial PO2, PCO2, and pH behave relative to the rise in ventilation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'During exercise there is a linear increase in ventilation with increasing oxygen consumption and workload. Total ventilation rises in proportion to metabolic demand across moderate and severe exercise.' },
        { id: 'kp2', weight: 2, description: 'Arterial PO2, PCO2, and pH do not change in the correct direction to increase ventilation, and PCO2 may even decrease slightly. The arterial chemical values therefore stay close to normal despite the large rise in ventilation, so they cannot be the cause of the increased breathing.' },
      ],
      common_errors: [
        'Saying arterial PCO2 rises sharply during exercise to drive breathing.',
        'Claiming ventilation rises out of proportion to workload rather than linearly.',
        'Stating that arterial PO2 falls markedly during normal exercise.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Exercise ventilation',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Exercise ventilation' },
  },

  {
    id: 'atom-p2w6r-exercise-factors',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'List and explain the factors proposed to drive the increase in ventilation during exercise given that arterial blood gases stay near normal, including the apparent purpose of this response.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Many factors contribute to exercise hyperpnea, including overflow of signals from the cerebral cortex to the respiratory center, sensory input from body movements, increased body temperature, and a partially learned response.' },
        { id: 'kp2', weight: 2, description: 'These feedforward signals appear designed to control PCO2 by matching ventilation to carbon dioxide production. Because the response is partially learned, it anticipates the metabolic load and holds arterial gases nearly constant rather than reacting to them after they change.' },
      ],
      common_errors: [
        'Crediting only chemoreceptors and ignoring cortical, movement, temperature, and learned factors.',
        'Forgetting that the response is partially learned and feedforward.',
        'Saying the purpose is to raise PCO2 rather than to control it near normal.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Exercise factors',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Exercise factors' },
  },

  {
    id: 'atom-p2w6r-lung-stretch',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe pulmonary stretch receptors: where they are located, how they minimize the work of breathing, and the reflex they mediate to prevent lung overinflation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Stretch receptors are located in the smooth muscle of large and small airways. They minimize the work of breathing by inhibiting excessively large tidal volumes, providing negative feedback that limits each inspiration.' },
        { id: 'kp2', weight: 2, description: 'The reflex they mediate is the Hering Breuer reflex, which prevents overinflation of the lungs. When the lungs are stretched, these receptors signal to terminate inspiration before the lungs become overdistended.' },
      ],
      common_errors: [
        'Saying stretch receptors promote large tidal volumes rather than inhibiting them.',
        'Confusing stretch receptors with irritant receptors or J receptors.',
        'Forgetting that the Hering Breuer reflex prevents overinflation.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Stretch receptors',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Stretch receptors' },
  },

  {
    id: 'atom-p2w6r-cheyne-stokes',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Explain the mechanism of Cheyne Stokes breathing, including the role of the delay between the respiratory response and blood flow to the brain, the behavior of PCO2, and why the respiratory center overcompensates.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Cheyne Stokes breathing results from a delay between the respiratory response and blood flow to the brain. PCO2 in the lung blood increases, but the brain is delayed in seeing this increase because of the circulation time between the lungs and the brain.' },
        { id: 'kp2', weight: 2, description: 'When the brain finally senses the elevated PCO2, the respiratory center becomes strongly excited and momentarily overcompensates with deep breathing, which then overshoots and lowers carbon dioxide, producing the alternating waxing and waning pattern of deep breaths and apnea.' },
      ],
      common_errors: [
        'Attributing Cheyne Stokes breathing to airway obstruction rather than a feedback and circulatory delay.',
        'Forgetting that the brain lags in sensing the rise in PCO2.',
        'Omitting the overcompensation by the respiratory center as the cause of the oscillation.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Cheyne Stokes',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Cheyne Stokes' },
  },

  {
    id: 'atom-p2w6i-obstructive-mechanism',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Define obstructive lung disease as taught. State its fundamental mechanism, the anatomic site most often involved, the factors that increase airway resistance, and how lung volumes and the FEV1/FVC ratio behave.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Obstructive disease is fundamentally an increased resistance to airflow, most often due to issues with the conducting airways and especially the bronchioles. Resistance increases when the lumen is blocked by excessive secretions or aspiration, when the lumen is narrowed by smooth muscle contraction or hypertrophy of the bronchial wall, or when destruction of lung parenchyma removes the outward traction that normally holds airways open.' },
        { id: 'kp2', weight: 2, description: 'Because air cannot be expelled efficiently, obstruction traps air so lung volumes tend to be higher than normal and the expiratory flow volume loop shifts to the left. On spirometry FEV1 decreases more than FVC, which lowers the FEV1/FVC ratio, as illustrated by the drop from about 80 percent to about 47 percent.' },
      ],
      common_errors: [
        'Describing obstruction as decreased lung expansion, which is the restrictive mechanism.',
        'Saying the FEV1/FVC ratio is preserved or elevated in obstruction rather than lowered.',
        'Forgetting that loss of parenchymal traction is one of the listed ways resistance can rise.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Obstructive mechanism',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Obstructive mechanism' },
  },

  {
    id: 'atom-p2w6i-restrictive-mechanism',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Define restrictive lung disease as taught. State its fundamental mechanism, why the tissues behave this way, how total lung capacity and vital capacity change, and what happens to airway resistance and the FEV1/FVC ratio.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Restrictive disease is fundamentally a decreased expansion of the lungs, often because the lungs and surrounding tissues are stiff or rigid. The flow volume loop shifts to the right toward lower volumes because the lungs cannot fully expand.' },
        { id: 'kp2', weight: 2, description: 'The hallmark volume changes are reduced total lung capacity and reduced vital capacity. Airway resistance may still be normal, so FEV1 and FVC fall in proportion to each other, leaving the FEV1/FVC ratio normal or even elevated, the opposite of obstruction.' },
      ],
      common_errors: [
        'Calling restriction an increased resistance to flow, which is the obstructive mechanism.',
        'Claiming the FEV1/FVC ratio falls in restriction; it is normal or elevated.',
        'Saying total lung capacity is increased; restriction reduces it.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Restrictive mechanism',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Restrictive mechanism' },
  },

  {
    id: 'atom-p2w6i-chronic-bronchitis',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe chronic bronchitis as one of the two main types of COPD. Address mucus, cilia, the airway wall changes, why air is trapped, and the most common cause.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Chronic bronchitis is longterm inflammation and narrowing of the bronchi marked by excessive mucous production, ciliary dysfunction, and airway narrowing with permanent scarring and swelling of the airway walls. This narrowing causes air to get trapped in the areas supplied by those bronchi.' },
        { id: 'kp2', weight: 2, description: 'Smoking is the most common cause of chronic bronchitis, although other irritants can also cause it. As a form of COPD it represents progressive, longterm, permanent damage to lung tissue, and a person can have both chronic bronchitis and emphysema at the same time.' },
      ],
      common_errors: [
        'Confusing chronic bronchitis with emphysema by attributing alveolar elastic tissue destruction to it.',
        'Naming allergens or bacteria as the most common cause rather than smoking.',
        'Calling the airway changes temporary or reversible rather than permanent scarring and swelling.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Chronic bronchitis',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Chronic bronchitis' },
  },

  {
    id: 'atom-p2w6i-emphysema',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe emphysema as one of the two main types of COPD. Address the tissue destroyed, the merging of alveoli, the effects on elasticity and surface area, and the listed consequences including diffusing capacity and pulmonary hypertension.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Emphysema is the permanent destruction of the elastic connective tissue in the alveoli with loss of parenchyma, so alveoli merge into fewer large pockets of air instead of many small ones. This causes less elasticity, less surface area for gas exchange, and obstruction with trapping of air, which prevents the alveoli from adequately pushing air out during exhalation.' },
        { id: 'kp2', weight: 2, description: 'The listed consequences of emphysema are high airway resistance, decreased diffusing capacity, and pulmonary hypertension due to loss of large areas of pulmonary capillary networks. Diffusing capacity falls because surface area and capillary beds are reduced.' },
      ],
      common_errors: [
        'Attributing excess mucus production to emphysema rather than to chronic bronchitis.',
        'Stating diffusing capacity increases; it decreases with lost surface area and capillaries.',
        'Forgetting that pulmonary hypertension results from loss of pulmonary capillary networks.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Emphysema',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Emphysema' },
  },

  {
    id: 'atom-p2w6i-asthma-features',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe the pathophysiology of asthma as taught. Define it, name the trigger and mediators, list the three main physiological features, and state that the obstruction is reversible.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Asthma is an obstructive disorder with reversible narrowing of the bronchial airways, usually due to inflammation caused by exposure to an allergen or irritant, which releases inflammatory chemicals such as histamine and leukotrienes. Common irritants include smoke, pollen, mold, pet dander, dust, chemicals, very cold temperature, emotions, and exercise.' },
        { id: 'kp2', weight: 2, description: 'The three main physiological features of asthma are bronchial smooth muscle contraction, bronchial soft tissue swelling, and mucus overproduction with plugging. Symptoms include shortness of breath, wheeze, cough, and tightness in the chest, and the airway narrowing is reversible.' },
      ],
      common_errors: [
        'Naming surfactant or erythropoietin instead of histamine and leukotrienes as the mediators.',
        'Listing only smooth muscle contraction and omitting soft tissue swelling and mucus plugging.',
        'Calling asthma a fixed or irreversible obstruction like COPD.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Asthma features',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Asthma features' },
  },

  {
    id: 'atom-p2w6i-asthma-diagnosis',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe the gold standard diagnosis of asthma. State the test used, the drug given, and the exact FEV1 improvement threshold that confirms the diagnosis, noting both criteria.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The gold standard for diagnosing asthma is spirometry that measures FEV1 before and after administration of a fast acting bronchodilator inhaler such as albuterol. The test relies on the reversibility of asthma, since acute exacerbations are typically fully reversible.' },
        { id: 'kp2', weight: 2, description: 'An improvement in FEV1 by more than 12 percent AND more than 200 mL after the bronchodilator inhaler confirms the diagnosis. Both the percentage criterion and the volume criterion must be met together for confirmation.' },
      ],
      common_errors: [
        'Giving only one criterion, such as 12 percent or 200 mL, instead of both together.',
        'Using incorrect numbers such as 20 percent or 400 mL.',
        'Naming a test other than pre and post bronchodilator spirometry.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Asthma diagnosis',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Asthma diagnosis' },
  },

  {
    id: 'atom-p2w6i-restrictive-examples',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'List and classify the examples of restrictive lung disease into intrinsic and extrinsic groups, giving the representative cause or feature noted for each example.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Intrinsic restrictive examples include diffuse interstitial pulmonary fibrosis with thick collagen deposits, sarcoidosis with chronic inflammatory granulomas, and asbestosis or silicosis from tissue scarring due to chronic exposure to irritants.' },
        { id: 'kp2', weight: 2, description: 'Extrinsic restrictive examples include pneumothorax, kyphosis or scoliosis from posture changes affecting chest wall expansion, obesity hypoventilation syndrome, and muscular pathologies such as ALS, muscular dystrophy, and myasthenia gravis.' },
      ],
      common_errors: [
        'Classifying pneumothorax, scoliosis, or muscular pathologies as intrinsic.',
        'Classifying pulmonary fibrosis, sarcoidosis, or asbestosis as extrinsic.',
        'Confusing these restrictive causes with obstructive diseases.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Restrictive examples',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Restrictive examples' },
  },

  {
    id: 'atom-p2w6i-pneumothorax',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe pneumothorax as taught. State what happens to the pleural cavity, why the lung collapses, the usual causes, and why both lungs do not collapse together.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Pneumothorax occurs when air leaks into the pleural cavity and causes part of the lung to collapse due to pressure changes. It is usually caused by penetrating trauma to the chest but can also occur spontaneously, and current research is examining the association between vaping and spontaneous pneumothorax.' },
        { id: 'kp2', weight: 2, description: 'Symptoms include sudden sharp chest pain and shortness of breath. Because the two sides of the pleural cavity are separate, only the affected side collapses; otherwise both lungs would collapse together.' },
      ],
      common_errors: [
        'Saying a pneumothorax causes both lungs to collapse, ignoring that the pleural cavities are separate.',
        'Calling pneumothorax an obstructive disease rather than an extrinsic restrictive cause.',
        'Omitting that it can occur spontaneously and not only from trauma.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pneumothorax',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Pneumothorax' },
  },

  {
    id: 'atom-p2w6i-atelectasis',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe atelectasis and its effect on arterial saturation. Define it, list its causes, and explain why it produces only a minimal decrease in saturation, including the values for flow and mean saturation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Atelectasis is a lack of gas exchange within the alveoli due to collapse of that portion of the lung. The collapse can be caused by external compression by air or fluid in the pleural space, by airway obstruction, or by a lack of surfactant in the alveoli.' },
        { id: 'kp2', weight: 2, description: 'Atelectasis causes only a minimum decrease in percent saturation because less blood flows through the atelectatic lung. Although the left pulmonary veins are 60 percent saturated, flow is only one fifth of normal, so the aortic blood is five sixths at 97 percent and one sixth at 60 percent, giving a mean saturation of about 91 percent.' },
      ],
      common_errors: [
        'Saying atelectasis causes a large desaturation; the reduced flow keeps the mean near 91 percent.',
        'Forgetting that lack of surfactant is one of the listed causes.',
        'Ignoring that reduced blood flow through the collapsed lung is the reason saturation barely drops.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Atelectasis saturation',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Atelectasis saturation' },
  },

  {
    id: 'atom-p2w6i-pneumonia-saturation',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe pneumonia and its effect on arterial saturation. Define it, name the most common organism, and explain why it produces a significant decrease in saturation, including the mean saturation value.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Pneumonia is an acute infection of the lungs resulting in inflammation and the accumulation of fluid or pus within the alveoli. It may be viral, bacterial, or fungal, and Streptococcus pneumoniae is the most common cause.' },
        { id: 'kp2', weight: 2, description: 'The pneumonic lung remains well perfused, so half the blood leaves at 97 percent saturation and half at 60 percent saturation, giving an aortic mean saturation of about 78 percent. This is a significant decrease in arterial hemoglobin saturation, larger than in atelectasis because flow through the diseased alveoli is preserved.' },
      ],
      common_errors: [
        'Locating the fluid in the pleural space rather than within the alveoli.',
        'Giving the wrong mean saturation; the value is about 78 percent.',
        'Forgetting that maintained blood flow through poorly oxygenated alveoli is why saturation drops significantly.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pneumonia saturation',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Pneumonia saturation' },
  },

  {
    id: 'atom-p2w6i-hypoxia-causes',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'List the major categories of hypoxia and give representative examples within each category.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Hypoxia can result from inadequate oxygenation of blood in the lungs, including low atmospheric oxygen and neuromuscular disorders causing hypoventilation, and from pulmonary disease such as hypoventilation from increased airway resistance or decreased compliance, V/Q mismatch, and diffusion abnormalities. Venous-arterial shunts are also listed.' },
        { id: 'kp2', weight: 2, description: 'Hypoxia can also result from inadequate oxygen transport by the blood, including anemia, abnormal hemoglobin, abnormal or reduced blood flow, and tissue edema, and from inadequate usage of oxygen by the tissue, including vitamin deficiencies and cyanide.' },
      ],
      common_errors: [
        'Placing cyanide or vitamin deficiency under oxygen transport instead of inadequate tissue usage.',
        'Omitting venous-arterial shunts as a separate listed category.',
        'Listing anemia under lung oxygenation rather than inadequate oxygen transport by the blood.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Causes of hypoxia',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Causes of hypoxia' },
  },

  {
    id: 'atom-p2w6i-parenchyma-traction',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Explain how lung parenchyma normally affects adjacent airways and how its destruction increases airway resistance, as taught.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Lung parenchyma normally pulls outward on the walls of adjacent airways, and this outward traction helps hold the airways open. It is listed under factors outside the airways that affect resistance.' },
        { id: 'kp2', weight: 2, description: 'When the parenchyma is destroyed, as occurs in emphysema, the outward pull on the airway walls is lost, so the airways narrow and resistance to airflow increases. This is why parenchymal destruction is one of the listed causes of increased airway resistance.' },
      ],
      common_errors: [
        'Saying parenchyma pushes airways inward instead of pulling them outward.',
        'Believing parenchymal destruction lowers resistance rather than raising it.',
        'Failing to link the lost outward traction to airway narrowing.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Parenchymal traction',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Parenchymal traction' },
  },

  /* coverage gap-fill (Ch 38 to 43) atoms */

  {
    id: 'atom-p2w3v-respiratory-system-overview',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'State the primary goal of the respiratory system and list the four functions that accomplish it. Explain what each function contributes to overall gas exchange.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The primary goal of the respiratory system is to provide oxygen to the tissues and to remove carbon dioxide produced by metabolism. All of the structural and control features of the lungs exist to keep arterial oxygen and carbon dioxide tensions within the narrow range needed for normal cellular function, and to match gas exchange to the changing metabolic demand of the body.' },
        { id: 'kp2', weight: 2, description: 'Four functions accomplish this goal. Ventilation moves air between the atmosphere and the alveoli, and is itself tuned by the regulation of ventilation, the neural control that adjusts breathing to keep blood gases stable. Diffusion moves oxygen and carbon dioxide across the respiratory membrane down their partial pressure gradients. Finally, transport carries oxygen and carbon dioxide between the lungs and the tissues in the blood. Failure of any one of the four impairs overall gas exchange.' },
      ],
      common_errors: [
        'Listing only ventilation and diffusion while forgetting that transport in the blood and the regulation of ventilation are also required functions',
        'Saying the main purpose is only to take in oxygen, ignoring the equally important removal of carbon dioxide',
        'Confusing ventilation, the bulk movement of air, with diffusion, the passive movement of gas across the membrane',
      ],
      minimum_passing_score: 60,
    },
    topic: 'respiratory-system-overview',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'respiratory-system-overview' },
  },

  {
    id: 'atom-p2w3v-conducting-airway-anatomy',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Trace the conducting pathway of air from the nose and pharynx down to the alveoli, naming the major labeled structures including the carina and the main bronchi, and state the difference between the parietal and visceral pleura.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Air passes from the nasal cavity, with its conchae and paranasal sinuses, into the pharynx, then through the larynx, which contains the vocal cords and is guarded by the epiglottis and the glottis. It then enters the trachea, which bifurcates at the carina into the right and left main, or primary, bronchi. These divide into smaller bronchi and bronchioles and finally reach the alveoli, the thin walled sacs where gas exchange occurs. The esophagus lies behind the trachea and carries food, not air.' },
        { id: 'kp2', weight: 2, description: 'Each lung is enclosed by two serous layers. The visceral pleura is the inner layer that directly covers the lung surface, and the parietal pleura is the outer layer that lines the chest wall, diaphragm, and mediastinum. The thin film of fluid in the pleural space between them couples the lung to the chest wall and is where the subatmospheric pleural pressure is generated that keeps the lung expanded.' },
      ],
      common_errors: [
        'Placing the carina inside a lung lobe rather than at the bifurcation of the trachea into the two main bronchi',
        'Reversing the pleural layers and calling the chest wall lining the visceral pleura',
        'Confusing the air pathway through the larynx and trachea with the food pathway through the esophagus',
      ],
      minimum_passing_score: 60,
    },
    topic: 'conducting-airway-anatomy',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'conducting-airway-anatomy' },
  },

  {
    id: 'atom-p2w3v-respiratory-notation',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Define the standard respiratory notation symbols P, F, S, and C, and the location subscripts a, v, c, A, I, and E, giving an example such as PaCO2 and PAO2.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The primary symbols describe what is being measured. P is the partial pressure of a gas, for example PCO2. F is the fractional concentration of a gas, for example FIO2 the fraction of inspired oxygen. S is the saturation, usually the percent of hemoglobin bound with oxygen, written SO2. C is the content or concentration, the total amount of a gas carried, for example oxygen content. These symbols are combined with a gas name to specify the variable.' },
        { id: 'kp2', weight: 2, description: 'The location subscripts tell where the measurement was taken. Lowercase a means arterial blood, lowercase v means mixed venous blood, and lowercase c means pulmonary capillary blood. Uppercase A means alveolar gas, uppercase I means inspired gas, and uppercase E means mixed expired gas. Thus PaCO2 is the arterial carbon dioxide partial pressure and PAO2 is the alveolar oxygen partial pressure. The case of the subscript distinguishes blood from gas compartments.' },
      ],
      common_errors: [
        'Confusing uppercase A for alveolar with lowercase a for arterial, which reverses the meaning of PAO2 and PaO2',
        'Mixing up F, the fractional concentration, with S, the saturation',
        'Forgetting that lowercase v denotes mixed venous blood rather than simply any vein',
      ],
      minimum_passing_score: 60,
    },
    topic: 'respiratory-notation',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'respiratory-notation' },
  },

  {
    id: 'atom-p2w3v-alveolar-cell-types',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'List the cell types that make up the alveolar wall and state the function of each, identifying which cell forms the thin gas exchange surface and which secretes surfactant.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The alveolar wall is built for gas exchange. Capillary endothelial cells line the pulmonary capillaries and form one side of the respiratory membrane. Type I alveolar epithelial cells, also called type I pneumocytes, are flat and extremely thin and cover most of the alveolar surface, providing the short diffusion path for oxygen and carbon dioxide. Type II alveolar epithelial cells are cuboidal and secrete surfactant, the agent that lowers surface tension and prevents alveolar collapse.' },
        { id: 'kp2', weight: 2, description: 'Supporting cells are also present. Fibroblasts produce the elastin and collagen of the interstitium that give the lung its elastic recoil. Alveolar macrophages patrol the alveolar surface and phagocytose inhaled debris and microbes. Mast cells release histamine and other mediators that can constrict airways. Together these cells maintain a wall that is thin enough for diffusion yet structurally and immunologically protected.' },
      ],
      common_errors: [
        'Saying type I cells secrete surfactant when in fact the cuboidal type II cells produce it',
        'Forgetting the macrophages, fibroblasts, and mast cells and listing only the two pneumocyte types',
        'Believing the thick type II cells, rather than the flat type I cells, form the main gas exchange surface',
      ],
      minimum_passing_score: 60,
    },
    topic: 'alveolar-cell-types',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'alveolar-cell-types' },
  },

  {
    id: 'atom-p2w3v-thoracic-cage-mechanics',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe how the dimensions of the thoracic cavity change during inspiration, naming the diameters that increase and the role of the rib cage and diaphragm in producing those changes.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Inspiration enlarges the thorax in two main directions. Contraction of the external intercostals elevates the rib cage and swings the sternum upward and forward, which increases the anteroposterior diameter, the front to back dimension of the chest. This bucket handle and pump handle motion of the ribs widens the thoracic cavity from front to back and side to side.' },
        { id: 'kp2', weight: 2, description: 'At the same time, contraction of the diaphragm flattens its dome and pulls the floor of the thorax downward, which increases the vertical, or cephalocaudal, diameter. The combined increase in anteroposterior and vertical diameters raises thoracic volume, and by Boyle law this lowers alveolar pressure below atmospheric so that air flows in. During expiration these muscles relax, the diameters shrink, and the elastic recoil drives air out.' },
      ],
      common_errors: [
        'Stating that the diaphragm rises during inspiration, when it actually descends to lengthen the vertical diameter',
        'Mentioning only the vertical change from the diaphragm and ignoring the anteroposterior increase from rib elevation',
        'Confusing the active enlargement of inspiration with the passive recoil of quiet expiration',
      ],
      minimum_passing_score: 60,
    },
    topic: 'thoracic-cage-mechanics',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'thoracic-cage-mechanics' },
  },

  {
    id: 'atom-p2w3v-maximal-expiratory-flow',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Explain why maximal expiratory flow becomes effort independent over most of the vital capacity, and relate this to the maximal expiratory flow volume curve.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Once a modest expiratory effort is reached, increasing the effort no longer increases expiratory flow over most of the vital capacity. This is because greater effort raises the pleural pressure, which simultaneously increases the pressure driving air out of the alveoli and the pressure compressing the intrathoracic airways. The two effects offset, so flow reaches a ceiling that further effort cannot exceed. This ceiling is the maximal expiratory flow.' },
        { id: 'kp2', weight: 2, description: 'Because the maximal flow is set by dynamic compression rather than by muscle force, the descending limb of the maximal expiratory flow volume curve is highly reproducible and depends instead on lung elastic recoil and airway resistance. As lung volume falls, recoil and airway caliber decrease, so the maximal flow declines steadily toward residual volume. Diseases that lower recoil or narrow airways shift this effort independent portion of the curve downward.' },
      ],
      common_errors: [
        'Claiming that blowing harder always increases expiratory flow, ignoring the effort independent plateau',
        'Attributing the flow limit to inspiratory muscle weakness rather than to dynamic airway compression',
        'Confusing the effort dependent early peak of the curve with the effort independent descending limb',
      ],
      minimum_passing_score: 60,
    },
    topic: 'maximal-expiratory-flow',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'maximal-expiratory-flow' },
  },

  {
    id: 'atom-p2w3v-pressure-volume-hysteresis',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Define hysteresis of the lung pressure volume curve, explain why the inflation and deflation limbs differ, and state the main cause.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Hysteresis is the property that the inflation, or inspiratory, limb of the lung pressure volume curve does not retrace the deflation, or expiratory, limb. At any given transpulmonary or pleural pressure the lung contains more volume during deflation than during inflation, so the loop encloses an area. This means more pressure is needed to inflate the lung than is recovered when it deflates, reflecting energy lost in each breathing cycle.' },
        { id: 'kp2', weight: 2, description: 'The main cause of hysteresis is surface tension at the air liquid interface lining the alveoli, together with the behavior of surfactant, which lowers surface tension more effectively as the surface area shrinks during deflation. Because surface tension drives this loop, a lung filled with saline, which has no air liquid interface, shows almost no hysteresis and a nearly straight, much more compliant curve.' },
      ],
      common_errors: [
        'Confusing hysteresis with compliance; hysteresis is the difference between the two limbs, not the slope itself',
        'Attributing hysteresis to airway resistance rather than to surface tension and surfactant behavior',
        'Forgetting that a saline filled lung nearly abolishes hysteresis because there is no air liquid interface',
      ],
      minimum_passing_score: 60,
    },
    topic: 'pressure-volume-hysteresis',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'pressure-volume-hysteresis' },
  },

  {
    id: 'atom-p2w3v-saline-vs-air-compliance',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Explain why a lung filled with saline is far more compliant than the same lung filled with air, and what this experiment reveals about the contribution of surface tension to lung recoil.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'When a lung is inflated with air, two elastic forces oppose inflation: the elastin and collagen of the lung tissue, and the surface tension at the air liquid interface lining the alveoli. Surface tension is the larger of the two and accounts for roughly two thirds of the recoil, so an air filled lung is relatively stiff and requires a large pressure change for a given volume change.' },
        { id: 'kp2', weight: 2, description: 'Filling the lung with saline abolishes the air liquid interface, so surface tension disappears and only the tissue elastic force remains. The saline filled lung is therefore much more compliant, taking up the same volume for a far smaller pressure change, and its pressure volume curve is steeper and shows almost no hysteresis. This experiment demonstrates that surface tension, not tissue elasticity, is the dominant force resisting lung inflation.' },
      ],
      common_errors: [
        'Thinking saline makes the lung stiffer rather than more compliant',
        'Attributing the high compliance of the saline lung to dilution of surfactant rather than to loss of the air liquid interface',
        'Believing tissue elastic recoil, instead of surface tension, is the main force the saline experiment removes',
      ],
      minimum_passing_score: 60,
    },
    topic: 'saline-vs-air-compliance',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'saline-vs-air-compliance' },
  },

  {
    id: 'atom-p2w3v-laryngeal-vocalization',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Describe how the intrinsic laryngeal muscles control the vocal cords for breathing and for phonation, naming the muscle that abducts the cords and the cord position required to produce voice.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The vocal cords are stretched between the thyroid cartilage in front and the arytenoid cartilages behind, and their position is set by intrinsic laryngeal muscles. The posterior cricoarytenoid is the sole abductor; it rotates the arytenoids to pull the cords apart and widen the glottis for breathing. The lateral cricoarytenoid and the transverse, or interarytenoid, muscles adduct the cords, and the thyroarytenoid adjusts their tension and length.' },
        { id: 'kp2', weight: 2, description: 'Phonation requires the cords to be adducted toward the midline so that expired air forces its way through the narrowed glottis and sets the cords vibrating, producing voiced sound. Full abduction opens the airway for quiet breathing and makes no sound, while intermediate positions produce whispering. Pitch and loudness are then varied by changing cord tension, length, and the force of the airflow.' },
      ],
      common_errors: [
        'Naming the lateral cricoarytenoid as the abductor when the posterior cricoarytenoid is the only muscle that opens the cords',
        'Saying the cords are abducted, or held wide apart, during phonation when they must be adducted to vibrate',
        'Confusing the cartilages, placing the vocal cords between the cricoid and epiglottis rather than the thyroid and arytenoid cartilages',
      ],
      minimum_passing_score: 60,
    },
    topic: 'laryngeal-vocalization',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'laryngeal-vocalization' },
  },

  {
    id: 'atom-p2w3v-airway-radial-traction',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-3',
    prompt: 'Explain how negative pleural pressure during inspiration lowers the resistance of intrathoracic airways through radial traction, and contrast this with what happens during forced expiration.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The intrathoracic airways are embedded in lung tissue and surrounded by the pleural pressure. During inspiration the chest expands and pleural pressure becomes more subatmospheric, for example falling from about minus 5 to about minus 8 cm of water; note that respiratory pressures are quoted in cm of water because the values are small, and 1 cm of water is only about 0.7 mm Hg. This more negative pressure is transmitted around the airways and pulls their walls outward by radial traction from the attached lung parenchyma, widening the airways and lowering their resistance.' },
        { id: 'kp2', weight: 2, description: 'The opposite occurs during forced expiration. There the pleural pressure becomes strongly positive and is transmitted around the airways, so beyond a certain point the pressure outside the airway exceeds the pressure inside and the airway is dynamically compressed. Thus the same coupling between pleural pressure and airway caliber that widens airways during inspiration narrows them during forced expiration, which is why resistance is lowest at high lung volumes.' },
      ],
      common_errors: [
        'Thinking positive pleural pressure holds airways open, when it is the negative inspiratory pressure that widens them',
        'Confusing radial traction during inspiration with dynamic compression during forced expiration',
        'Believing airway caliber is fixed and unaffected by the surrounding pleural pressure',
      ],
      minimum_passing_score: 60,
    },
    topic: 'airway-radial-traction',
    chapter: 'pp2-wk-3',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 38', topic: 'airway-radial-traction' },
  },

  {
    id: 'atom-p2w4s-aortic-vs-pulmonary',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Contrast the aortic pressure curve with the pulmonary artery curve, giving the approximate systolic and diastolic values of each and explaining what the comparison demonstrates about the two circuits.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The aortic pressure curve peaks at about 120 mmHg systolic and falls to about 75 mmHg diastolic, the familiar systemic blood pressure. It is compared with the pulmonary artery curve so the learner can see the dramatic difference in scale between the two circulations at a glance.' },
        { id: 'kp2', weight: 2, description: 'The pulmonary artery curve peaks at only about 25 mmHg systolic and 8 mmHg diastolic, roughly one fifth of systemic pressure. The contrast demonstrates that the pulmonary circulation is a low pressure, low resistance system even though it carries the entire cardiac output, which protects the thin pulmonary capillaries from filtration injury.' },
      ],
      common_errors: [
        'Stating that pulmonary artery pressure is similar to aortic pressure because both receive the full cardiac output',
        'Confusing the pulmonary systolic value of 25 with the mean of 15 mmHg',
        'Assuming the aortic curve is as the main teaching point rather than as a contrast for the pulmonary curve',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Aortic versus pulmonary pressure',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Aortic versus pulmonary pressure' },
  },

  {
    id: 'atom-p2w4s-left-atrial-pressure',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Describe the downstream end of the pulmonary pressure gradient, stating the approximate left atrial pressure and how it relates to pulmonary capillary pressure and to the driving pressure for pulmonary flow.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Left atrial pressure is about 2 mmHg, the lowest point on the pulmonary pressure gradient. Pressure falls from the mean pulmonary arterial value of 15 mmHg to about 7 mmHg in the capillaries and then to 2 mmHg in the left atrium, showing that most of the pressure drop occurs before and across the capillaries.' },
        { id: 'kp2', weight: 2, description: 'The difference between mean pulmonary arterial pressure of 15 mmHg and left atrial pressure of 2 mmHg is the driving pressure of roughly 13 mmHg that moves blood through the lungs. Because left atrial pressure is so low, even modest elevations of it, as in mitral stenosis or left heart failure, are transmitted back to the capillaries and can provoke edema.' },
      ],
      common_errors: [
        'Giving left atrial pressure as 7 mmHg, which is actually the pulmonary capillary value',
        'Forgetting that elevated left atrial pressure is transmitted backward to the pulmonary capillaries',
        'Confusing left atrial pressure with the systemic central venous pressure',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Left atrial pressure',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Left atrial pressure' },
  },

  {
    id: 'atom-p2w4s-blood-reservoir',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Explain how the pulmonary circulation serves as a blood reservoir, including the approximate volume held and where that blood can be shifted when the body needs it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The pulmonary vessels hold about 500 mL of blood at any given moment, roughly 9 percent of total blood volume. This pool sits between the right and left heart and can expand or contract depending on intrathoracic pressure and the balance of right and left ventricular output.' },
        { id: 'kp2', weight: 2, description: 'Pulmonary blood can shift into the systemic circulation when needed, for example during hemorrhage or a sudden rise in intrathoracic pressure, making the lungs a useful reservoir. Conversely, systemic blood can shift into the lungs, which is why left heart failure or a Valsalva maneuver can change pulmonary blood volume substantially.' },
      ],
      common_errors: [
        'Stating the pulmonary blood volume as 5 liters, which is the per minute flow not the contained volume',
        'Claiming the reservoir shifts blood into the alveoli rather than into the systemic circulation',
        'Overlooking that the shift can go both directions between pulmonary and systemic compartments',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pulmonary blood reservoir',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Pulmonary blood reservoir' },
  },

  {
    id: 'atom-p2w4s-fick-principle',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'State the Fick principle as the method for measuring pulmonary blood flow and outline the quantities it relates.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The Fick principle measures blood flow, and therefore cardiac output and pulmonary flow, from oxygen uptake and the arteriovenous oxygen difference. Flow equals oxygen consumption divided by the difference between arterial and mixed venous oxygen content, so the same volume of blood that passes the lungs carries the oxygen taken up.' },
        { id: 'kp2', weight: 2, description: 'Because the entire cardiac output flows through the lungs, pulmonary blood flow equals systemic cardiac output, about 5 liters per minute at rest. The Fick principle specifically as the way this flow is quantified, linking oxygen exchange in the lung to the volume of blood moving through it.' },
      ],
      common_errors: [
        'Confusing the Fick principle with the Fick law of diffusion across the membrane',
        'Forgetting that the method requires the arteriovenous oxygen content difference, not just arterial oxygen',
        'Assuming pulmonary flow differs from systemic cardiac output when at steady state they are equal',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Fick principle',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Fick principle' },
  },

  {
    id: 'atom-p2w4s-pressure-buffer',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Explain how recruitment and distension buffer pulmonary arterial pressure as cardiac output rises, referring to the shape of the pressure versus cardiac output curve And its normal anchor point.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'As cardiac output increases, previously closed capillaries open by recruitment and already open capillaries widen by distension, both of which lower pulmonary vascular resistance. Because resistance falls as flow rises, pulmonary arterial pressure increases only slightly across a wide range of output rather than proportionally.' },
        { id: 'kp2', weight: 2, description: 'The normal value is about 15 mmHg at a resting output of 4 to 5 liters per minute, and the curve stays nearly flat as output climbs toward 16 to 20 liters per minute before turning steeply upward near maximal output when recruitment and distension are exhausted. This buffering protects the lung from edema during exercise.' },
      ],
      common_errors: [
        'Believing pulmonary pressure rises in direct proportion to cardiac output',
        'Placing the normal anchor point far from 15 mmHg at a resting output of 4 to 5 L per min',
        'Forgetting that the buffering eventually fails at very high outputs where the curve steepens',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pressure buffering with output',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Pressure buffering with output' },
  },

  {
    id: 'atom-p2w4s-zone1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Define zone 1 of the pulmonary blood flow model and state the relationship among alveolar, arterial, and venous pressures that produces it and why it is normally absent.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Zone 1 is a region with no blood flow at any point in the cardiac cycle because alveolar pressure exceeds both pulmonary arterial and venous pressure. The high alveolar pressure compresses the thin walled capillary shut, so no blood passes through that part of the lung.' },
        { id: 'kp2', weight: 2, description: 'Zone 1 does not normally exist because pulmonary arterial pressure, even at the apex, usually stays above alveolar pressure. It appears only when arterial pressure falls, as in severe hemorrhage, or when alveolar pressure rises, as during positive pressure ventilation, creating ventilated but unperfused alveolar dead space.' },
      ],
      common_errors: [
        'Describing zone 1 as having intermittent flow, which actually defines zone 2',
        'Believing zone 1 is normally present at the lung apex in a healthy upright person',
        'Forgetting that positive pressure ventilation or hemorrhage can create zone 1 conditions',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Lung zone 1',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Lung zone 1' },
  },

  {
    id: 'atom-p2w4s-zone2',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Define zone 2 of the pulmonary blood flow model and explain the pressure relationship that makes its flow intermittent.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Zone 2 has intermittent blood flow because alveolar pressure lies between pulmonary arterial and venous pressure. During systole arterial pressure rises above alveolar pressure and the capillary opens, but during diastole arterial pressure falls below alveolar pressure and the vessel collapses, so flow pulses with the heartbeat.' },
        { id: 'kp2', weight: 2, description: 'Zone 2 typically occupies the upper lung in a normal upright person at rest, where hydrostatic pressure has lowered arterial pressure toward the alveolar level. Here flow is driven by the difference between arterial and alveolar pressure rather than the usual arterial to venous difference, a so called waterfall or sluice condition.' },
      ],
      common_errors: [
        'Stating that zone 2 flow is continuous like zone 3',
        'Using the arterial minus venous difference as the driving pressure instead of arterial minus alveolar',
        'Placing zone 2 at the lung base rather than the middle to upper lung',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Lung zone 2',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Lung zone 2' },
  },

  {
    id: 'atom-p2w4s-zone3',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Define zone 3 of the pulmonary blood flow model, state the pressure relationship that gives continuous flow, and explain why it describes the base of the upright lung.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Zone 3 has continuous blood flow throughout the cardiac cycle because both pulmonary arterial and venous pressures exceed alveolar pressure, keeping the capillary open at all times. Flow here is governed by the normal arterial to venous pressure difference, as in most of the systemic circulation.' },
        { id: 'kp2', weight: 2, description: 'Zone 3 describes the base of the upright lung, where gravity adds hydrostatic pressure that raises both arterial and venous pressures well above alveolar pressure. This is why the lung base receives the greatest perfusion, and during exercise or lying down more of the lung converts to zone 3 conditions.' },
      ],
      common_errors: [
        'Confusing zone 3 with zone 1, which has no flow rather than continuous flow',
        'Forgetting that the lung base is zone 3 because of gravity adding hydrostatic pressure',
        'Thinking alveolar pressure exceeds vascular pressure in zone 3',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Lung zone 3',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Lung zone 3' },
  },

  {
    id: 'atom-p2w4s-alveolar-gas-values',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'State the normal alveolar oxygen and carbon dioxide partial pressures and the values of blood gas entering and leaving the pulmonary capillary, and describe how equilibration occurs.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Normal alveolar gas has an oxygen partial pressure of 100 mmHg and a carbon dioxide partial pressure of 40 mmHg. These alveolar values set the gradient that drives gas exchange across the respiratory membrane with the blood in the surrounding capillary.' },
        { id: 'kp2', weight: 2, description: 'Mixed venous blood enters the capillary with an oxygen partial pressure of about 40 mmHg and a carbon dioxide partial pressure of about 45 mmHg. By the venous end of the capillary the blood has equilibrated with alveolar gas, leaving at an oxygen partial pressure near 100 mmHg and a carbon dioxide partial pressure near 40 mmHg.' },
      ],
      common_errors: [
        'Reversing the entering values, giving capillary oxygen as 100 instead of 40 mmHg',
        'Stating alveolar carbon dioxide as 45 mmHg, which is actually the venous blood value',
        'Believing the blood does not fully equilibrate with alveolar gas under normal resting conditions',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Alveolar and capillary gas values',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Alveolar and capillary gas values' },
  },

  {
    id: 'atom-p2w4s-surface-tension-pore',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Explain the role of surface tension at the alveolar pore in the pulmonary capillary fluid balance, including its approximate magnitude and direction of effect.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Surface tension at the alveolar pore is about 8 mmHg and acts to pull fluid outward toward the alveolar surface. It arises from the air to liquid interface lining the alveolus and is one of several pressures tallied when computing fluid movement across the membrane.' },
        { id: 'kp2', weight: 2, description: 'Although surface tension favors moving fluid out of the capillary, the alveoli stay dry because the strongly negative interstitial pressure and active lymphatic drainage oppose flooding. Surfactant normally limits alveolar surface tension, and a loss of surfactant raises this outward pull and predisposes to alveolar fluid accumulation.' },
      ],
      common_errors: [
        'Treating the 8 mmHg surface tension as an inward force that holds fluid in the capillary',
        'Confusing surface tension at the pore with plasma osmotic pressure of 28 mmHg',
        'Forgetting that surfactant normally reduces alveolar surface tension',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Surface tension at pore',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Surface tension at pore' },
  },

  {
    id: 'atom-p2w4s-edema-definition',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Define pulmonary edema and describe the sequence by which interstitial fluid accumulation progresses to impaired gas exchange.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Pulmonary edema is the accumulation of fluid in the pulmonary interstitial space. It develops when the rate of fluid filtration out of the pulmonary capillaries exceeds the rate at which the lymphatics can remove it, overwhelming the normal safety factors.' },
        { id: 'kp2', weight: 2, description: 'As interstitial fluid increases it eventually spills across the alveolar epithelium into the alveoli themselves, where it widens the diffusion distance and dilutes surfactant. This impairs oxygen and carbon dioxide exchange and, when severe, fills the alveoli and produces life threatening hypoxemia.' },
      ],
      common_errors: [
        'Defining pulmonary edema as blood or air in the alveoli rather than fluid in the interstitium',
        'Assuming fluid appears in the alveoli first rather than accumulating in the interstitium first',
        'Ignoring that lymphatic capacity must be exceeded before edema forms',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pulmonary edema definition',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Pulmonary edema definition' },
  },

  {
    id: 'atom-p2w4s-edema-permeability-gases',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Explain how increased capillary membrane permeability causes pulmonary edema and name the specific noxious gases as examples.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Damage to the pulmonary capillary membrane increases its permeability, allowing both plasma proteins and fluid to leak into the interstitium. Because protein follows the fluid, the usual inward osmotic gradient is lost, so this mechanism floods the lung even without a rise in capillary hydrostatic pressure.' },
        { id: 'kp2', weight: 2, description: 'Infection and inhaled noxious gases, specifically chlorine and sulfur dioxide, as causes of this membrane damage. These agents injure the delicate respiratory membrane directly, and the resulting high permeability edema is harder to treat than pressure driven edema because protein has entered the interstitium.' },
      ],
      common_errors: [
        'Attributing noxious gas edema to increased capillary pressure rather than increased permeability',
        'Forgetting that protein leaks along with fluid, abolishing the protective osmotic gradient',
        'Naming the wrong gases instead of chlorine and sulfur dioxide',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Edema from permeability',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Edema from permeability' },
  },

  {
    id: 'atom-p2w4s-edema-intrapleural',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Explain how a large decrease in intrapleural pressure, such as severe laryngeal spasm, can cause pulmonary edema, describing the path by which the negative pressure produces filtration.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Inspiring forcefully against a closed or obstructed airway, as in severe laryngeal spasm, generates a strongly negative intrapleural pressure. This is sometimes called negative pressure pulmonary edema and can follow upper airway obstruction or laryngospasm during anesthesia emergence.' },
        { id: 'kp2', weight: 2, description: 'The markedly negative pleural pressure is transmitted to the interstitial and alveolar spaces, increasing the outward pressure gradient across the capillary wall and favoring fluid movement out of the pulmonary capillaries. The effect is essentially a rise in the transmural filtration pressure produced from the tissue side rather than from a high capillary pressure.' },
      ],
      common_errors: [
        'Thinking the negative pressure pulls air rather than fluid into the lung tissue',
        'Attributing this edema to low plasma protein instead of transmitted negative pressure',
        'Overlooking laryngospasm during anesthesia as a clinical trigger relevant to a CRNA',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Negative pressure edema',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Negative pressure edema' },
  },

  {
    id: 'atom-p2w4s-edema-threshold-curve',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Describe the relationship between left atrial pressure and the rate of pulmonary edema formation, including the approximate threshold and the behavior above it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The rate of edema formation, expressed as edema fluid per hour per dry lung weight, against left atrial pressure. The rate stays essentially zero across normal pressures up to about 23 mmHg, demonstrating the safety factor that protects the lung at ordinary filling pressures.' },
        { id: 'kp2', weight: 2, description: 'Above roughly 23 mmHg the curve turns sharply upward and edema accumulates rapidly as left atrial pressure climbs toward 40 to 50 mmHg. This threshold corresponds to the point where rising capillary pressure approaches plasma colloid osmotic pressure and overwhelms the lymphatic safety factor, so small further increases cause large increases in edema.' },
      ],
      common_errors: [
        'Stating that edema increases linearly from zero left atrial pressure rather than only above a threshold',
        'Placing the threshold near 7 or 15 mmHg instead of about 23 mmHg',
        'Forgetting that the threshold reflects capillary pressure approaching plasma osmotic pressure',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Edema pressure threshold',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Edema pressure threshold' },
  },

  {
    id: 'atom-p2w4s-lymphatic-safety',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Explain how lymphatic pumping acts as a safety factor against pulmonary edema, including what it removes and how its capacity relates to the edema threshold.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The pulmonary lymphatics actively pump filtered fluid and any leaked protein out of the interstitial space and return them to the circulation. This drainage keeps the interstitium relatively dry and contributes the negative interstitial pressure that holds the alveolar and capillary surfaces together.' },
        { id: 'kp2', weight: 2, description: 'Lymphatic flow can increase several fold above baseline when filtration rises, which is the main reason edema does not appear until capillary or left atrial pressure climbs well above normal. Once filtration exceeds the maximal lymphatic pumping capacity, fluid accumulates and edema forms, marking the safety factor threshold.' },
      ],
      common_errors: [
        'Believing the lymphatics only drain fluid and not protein',
        'Assuming lymphatic flow is fixed rather than able to increase several fold',
        'Forgetting that exceeding lymphatic capacity is what triggers edema formation',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Lymphatic safety factor',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Lymphatic safety factor' },
  },

  {
    id: 'atom-p2w4s-pleural-negative-pressure',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-4',
    prompt: 'Explain why a net Starling force of plus 1 mmHg at the pulmonary capillary means pleural fluid filters continuously, and how the pleural lymphatics keep the space at negative pressure so the lungs do not collapse.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Because the outward forces total 29 mmHg and the inward plasma osmotic force is 28 mmHg, the net filtration pressure is plus 1 mmHg outward, so fluid leaves the capillaries slowly but continuously into the interstitial and pleural spaces. This filtered fluid forms the thin mucoid layer that lubricates the pleural surfaces during breathing.' },
        { id: 'kp2', weight: 2, description: 'The pleural lymphatics remove this fluid at the same rate it forms, which keeps the pleural space at a slightly negative pressure. That negative pressure holds the visceral and parietal pleurae together and keeps the lungs expanded against the chest wall; if the lymphatics are overwhelmed, fluid collects as a pleural effusion.' },
      ],
      common_errors: [
        'Thinking a positive net force means fluid is reabsorbed rather than filtered out',
        'Forgetting that the lymphatics, not capillary reabsorption, clear the continuously filtered pleural fluid',
        'Believing the pleural space is at positive pressure rather than negative pressure',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pleural fluid and negative pressure',
    chapter: 'pp2-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 39', topic: 'Pleural fluid and negative pressure' },
  },

  {
    id: 'atom-p2w5g-net-diffusion',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Explain, , how gases diffuse in a fluid or across a membrane, including why molecules move in both directions yet produce net transfer, and state what the net direction depends on and how partial pressure relates to it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Dissolved gas molecules undergoing random motion in both directions. Diffusion occurs in response to a concentration gradient, and because pressure is proportional to concentration, it equivalently occurs in response to a pressure gradient. Although individual molecules move both ways, the net flux is from the region of higher concentration to the region of lower concentration.' },
        { id: 'kp2', weight: 2, description: 'Net diffusion direction is down the concentration or partial pressure gradient, from high to low. Across the respiratory membrane this means each gas moves according to its own partial pressure difference between the two sides, independent of the other gases present, which is why oxygen and carbon dioxide can diffuse in opposite directions at the same time.' },
      ],
      common_errors: [
        'Claiming molecules only move one direction during diffusion rather than randomly in both with a net gradient driven flux',
        'Saying net diffusion is driven by total pressure or absolute pressure rather than the partial pressure difference of that specific gas',
        'Confusing the gradient of concentration with a temperature or volume gradient',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Net diffusion and gradients',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Net diffusion and gradients' },
  },

  {
    id: 'atom-p2w5g-total-pressure-sum',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State the rule for total gas pressure in a mixture, name the four gases listed as contributing to the total pressure of air, and explain how each gas contributes relative to its concentration.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Total pressure is the sum of the partial pressures of each gas present, and they list those gases as oxygen, nitrogen, carbon dioxide, and water vapor. Each gas exerts a partial pressure independent of the others, and the partial pressures add to the total.' },
        { id: 'kp2', weight: 2, description: 'Each gas contributes to the total pressure in direct proportion to its concentration or fractional amount. one example is humidified air where nitrogen at about 74 percent contributes roughly 563 mm Hg, oxygen about 149 mm Hg, water vapor 47 mm Hg, and carbon dioxide a fraction of a mm Hg, summing to 760.' },
      ],
      common_errors: [
        'Listing carbon monoxide or helium instead of nitrogen or water vapor among the contributing gases',
        'Forgetting that water vapor contributes a partial pressure and must be counted in the total',
        'Thinking the partial pressures average rather than add to give the total',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Total pressure as sum of partials',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Total pressure as sum of partials' },
  },

  {
    id: 'atom-p2w5g-resp-unit-components',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'List, in order from the larger airway toward the gas exchange surface, the four components of the respiratory unit named, and state where in this sequence gas exchange occurs.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'the components of the respiratory unit as the terminal bronchiole, the respiratory bronchiole, the alveolar ducts, and the alveolar sacs, in that order from the conducting airway toward the alveoli. Smooth muscle and elastic fibers surround the proximal portions.' },
        { id: 'kp2', weight: 2, description: 'Gas exchange occurs in the alveolar sacs, which have very thin walls to aid diffusion. The progression from terminal bronchiole through respiratory bronchiole and alveolar ducts leads air to these terminal sacs where the respiratory membrane separates gas from capillary blood.' },
      ],
      common_errors: [
        'Reversing the order so that alveolar sacs come before the bronchioles',
        'Stating gas exchange occurs in the terminal bronchiole rather than the alveolar sacs',
        'Omitting the respiratory bronchiole or the alveolar ducts from the list',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Respiratory unit components',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Respiratory unit components' },
  },

  {
    id: 'atom-p2w5g-alveoli-number-size',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State the approximate number of alveoli in the two lungs and their average diameter, and explain why these figures matter for gas exchange.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'There are approximately 300 million alveoli in the two lungs, each with an average diameter of about 0.2 mm. The alveolar walls are described as very thin to aid in gas exchange.' },
        { id: 'kp2', weight: 2, description: 'The combination of a very large number of small alveoli creates an enormous total surface area for diffusion while keeping each diffusion distance short. A large area in the numerator of the diffusion relationship and thin walls in the denominator both favor rapid gas exchange.' },
      ],
      common_errors: [
        'Giving the diameter as 0.2 cm or 2 mm rather than 0.2 mm',
        'Confusing the number of alveoli with the number of respiratory units or stating millions versus the correct 300 million',
        'Thinking larger alveoli would improve exchange when small size maximizes surface area to volume',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Alveolar number and diameter',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Alveolar number and diameter' },
  },

  {
    id: 'atom-p2w5g-resp-unit-microanatomy',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Name the structures the respiratory unit microanatomy includes around the alveoli, and describe how this arrangement supports gas exchange and fluid handling.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The respiratory unit microanatomy includes pulmonary capillaries forming a dense network across the alveolar walls, the interstitial space, a lymphatic vessel, a vein and an artery, and the perivascular interstitial space. Multiple alveoli surround this shared capillary and vascular bed.' },
        { id: 'kp2', weight: 2, description: 'The dense capillary meshwork places blood in close contact with alveolar gas over a wide area, maximizing diffusion. The interstitial spaces and lymphatic vessel provide a route to drain fluid and keep the membrane thin, since accumulation of interstitial fluid would increase diffusion distance and impair exchange.' },
      ],
      common_errors: [
        'Confusing the perivascular interstitial space with the alveolar lumen',
        'Omitting the lymphatic vessel, which is important for clearing interstitial fluid',
        'Assuming each alveolus has its own isolated capillary rather than a shared network across many alveoli',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Respiratory unit microanatomy',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Respiratory unit microanatomy' },
  },

  {
    id: 'atom-p2w5g-alveolar-air-table',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Using the composition of alveolar air table, give the approximate partial pressures of N2, O2, CO2, and H2O for atmospheric, humidified, alveolar, and expired air, and explain the major shifts between columns.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'In mm Hg, the partial pressures are atmospheric air N2 597, O2 159, CO2 0.3, H2O 3.7; humidified air N2 563, O2 149, CO2 0.3, H2O 47; alveolar air N2 569, O2 104, CO2 40, H2O 47; and expired air N2 566, O2 120, CO2 27, H2O 47. Each column totals 760 mm Hg.' },
        { id: 'kp2', weight: 2, description: 'Humidification adds water vapor at 47 mm Hg and dilutes the other gases, dropping O2 from 159 to 149. In the alveoli oxygen is absorbed into blood and carbon dioxide is added, so O2 falls to 104 and CO2 rises to 40. Expired air is intermediate because it mixes alveolar gas with dead space air, giving O2 about 120 and CO2 about 27.' },
      ],
      common_errors: [
        'Using alveolar PO2 of 104 for expired air, when expired air is higher at about 120 due to dead space mixing',
        'Forgetting that humidification lowers O2 from 159 to 149 before alveolar exchange further lowers it',
        'Assuming CO2 in atmospheric and humidified air is appreciable rather than near 0.3 mm Hg',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Alveolar air composition table',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Alveolar air composition table' },
  },

  {
    id: 'atom-p2w5g-alveolar-gas-equation',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State the alveolar gas equation as written, define each term, and carry out the calculation of alveolar PO2 using PIO2 of 149, PCO2 of 40, and R of 0.8.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'the alveolar gas equation as PAO2 equals PIO2 minus PCO2 divided by R. PIO2 is the partial pressure of oxygen in humidified inspired air, PCO2 is the alveolar carbon dioxide partial pressure, and R is the respiratory exchange ratio.' },
        { id: 'kp2', weight: 2, description: 'Substituting gives PAO2 equals 149 minus (40 divided by 0.8), which is 149 minus 50, equal to 99 mm Hg. This computed value is close to the rounded alveolar PO2 of 104 used elsewhere, and it shows that a rising alveolar PCO2 directly lowers the alveolar PO2.' },
      ],
      common_errors: [
        'Dividing R by PCO2 instead of dividing PCO2 by R',
        'Using atmospheric PO2 of 159 in place of humidified inspired PO2 of 149',
        'Treating R as 1.0 and obtaining 109 rather than using 0.8 to get 99',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Alveolar gas equation',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Alveolar gas equation' },
  },

  {
    id: 'atom-p2w5g-exchange-ratio-r',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Define the respiratory exchange ratio R as used, state its normal value, and explain its role in relating inspired to alveolar oxygen and in linking alveolar to arterial gases in health.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'R is defined as the respiratory exchange ratio with a normal value of approximately 0.8. It reflects carbon dioxide output relative to oxygen uptake, and a value of 0.8 means about 8 carbon dioxide molecules leave for every 10 oxygen molecules taken up.' },
        { id: 'kp2', weight: 2, description: 'R appears in the alveolar gas equation as the divisor of PCO2, converting inspired PO2 to alveolar PO2. in a normal healthy person alveolar PO2 equals arterial PO2 and alveolar PCO2 equals arterial PCO2, so the computed alveolar values approximate the arterial values measured clinically.' },
      ],
      common_errors: [
        'Stating R equals 1.0 rather than about 0.8',
        'Describing R as airway resistance or the universal gas constant rather than the exchange ratio',
        'Forgetting that the alveolar equals arterial equality requires no diffusion impairment or shunt',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Respiratory exchange ratio and alveolar arterial equality',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Respiratory exchange ratio and alveolar arterial equality' },
  },

  {
    id: 'atom-p2w5g-pco2-constant-doubling',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State the alveolar PCO2 equation including the value of its constant, and describe quantitatively how alveolar PCO2 responds when alveolar ventilation is doubled or halved.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'alveolar PCO2 equals carbon dioxide production times K divided by alveolar ventilation, where K is a multivariable correction constant equal to 863 mm Hg. PCO2 is therefore directly proportional to carbon dioxide production and inversely proportional to alveolar ventilation.' },
        { id: 'kp2', weight: 2, description: 'Because of the inverse relationship, if ventilation is doubled then PCO2 is halved, and if ventilation is halved then PCO2 is doubled, assuming carbon dioxide production is constant. This makes alveolar ventilation the primary determinant of arterial carbon dioxide.' },
      ],
      common_errors: [
        'Giving K as 760 or 713 rather than 863 mm Hg',
        'Stating PCO2 is directly proportional to ventilation rather than inversely proportional',
        'Forgetting that the doubling and halving relationship assumes constant carbon dioxide production',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Alveolar PCO2 equation and constant',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Alveolar PCO2 equation and constant' },
  },

  {
    id: 'atom-p2w5g-control-alveolar-po2',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State the two factors  control alveolar PO2, and using the 250 versus 1000 mL O2 per min comparison explain how metabolic rate changes the ventilation needed to maintain arterial PO2.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Alveolar PO2 is controlled by two factors: the rate of oxygen absorption from the alveoli into the blood and the rate of oxygen entry into the alveoli by ventilation. The steady alveolar PO2 is the balance point between oxygen leaving into blood and oxygen arriving by ventilation.' },
        { id: 'kp2', weight: 2, description: 'Comparing metabolic rates of 250 and 1000 mL O2 per min, a higher metabolic rate increases oxygen absorption because of increased utilization, so increased ventilation is required to maintain arterial PO2. At 1000 mL O2 per min much greater alveolar ventilation is needed to reach the same alveolar PO2 that lower ventilation provides at 250.' },
      ],
      common_errors: [
        'Stating that less ventilation is needed at higher metabolic rate',
        'Listing membrane thickness or cardiac output as the controlling factors rather than absorption rate and ventilation entry rate',
        'Assuming alveolar PO2 is fixed regardless of metabolic demand',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Control of alveolar PO2 and metabolic rate',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Control of alveolar PO2 and metabolic rate' },
  },

  {
    id: 'atom-p2w5g-vent-defs-po2',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State how hyperventilation and hypoventilation are defined using alveolar PO2, contrast this with the carbon dioxide based definition, and explain why both describe the same physiological states.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Hyperventilation is ventilating above needs, giving alveolar PO2 greater than 100 mm Hg, and hypoventilation is ventilating below needs, giving alveolar PO2 less than 100 mm Hg. These thresholds are defined relative to metabolic demand rather than a fixed breathing rate.' },
        { id: 'kp2', weight: 2, description: 'The same states can be defined by carbon dioxide: hyperventilation is PACO2 below 40 and hypoventilation is PACO2 above 40. Because alveolar PO2 and PCO2 are inversely related through alveolar ventilation, a high PO2 accompanies a low PCO2 in hyperventilation and a low PO2 accompanies a high PCO2 in hypoventilation, so both definitions identify the same condition.' },
      ],
      common_errors: [
        'Mixing the thresholds, such as pairing hyperventilation with PAO2 below 100',
        'Treating the PO2 based and PCO2 based definitions as describing different conditions',
        'Defining hyper or hypoventilation by breathing rate alone rather than relative to metabolic need',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Hyper and hypoventilation defined by PO2',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Hyper and hypoventilation defined by PO2' },
  },

  {
    id: 'atom-p2w5g-vq-directional',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State how  alveolar PO2 and PCO2 change as the V/Q ratio increases and as it decreases, and explain the mechanism linking ventilation relative to perfusion to these shifts.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Increasing V/Q produces a higher alveolar PO2 and a lower alveolar PCO2, while decreasing V/Q produces a lower alveolar PO2 and a higher alveolar PCO2. PO2 and PCO2 move in opposite directions because they are inversely related through ventilation.' },
        { id: 'kp2', weight: 2, description: 'When ventilation is high relative to perfusion, fresh inspired gas dominates and alveolar values approach inspired air with high PO2 and near zero PCO2. When perfusion dominates over ventilation, alveolar gas is pulled toward mixed venous blood with low PO2 and high PCO2. The continuum runs from inspired values at high V/Q to venous values at low V/Q.' },
      ],
      common_errors: [
        'Stating both PO2 and PCO2 rise together when V/Q increases',
        'Reversing the direction so that higher V/Q lowers PO2',
        'Confusing the high V/Q limit with venous gas values rather than inspired gas values',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Directional effect of V/Q on alveolar gases',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Directional effect of V/Q on alveolar gases' },
  },

  {
    id: 'atom-p2w5g-airway-partial-pressures',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Describe what the partial airway pressure profile shows about the sequence of expired gas and the values of PO2 and PCO2 for dead space air versus alveolar air.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'PO2 and PCO2 against the volume of air expired. The first gas out is dead space air, which did not participate in exchange and so resembles humidified inspired air with PO2 near 150 and PCO2 near 0. This is followed by a transition zone of mixed dead space and alveolar air.' },
        { id: 'kp2', weight: 2, description: 'As expiration continues, pure alveolar air emerges with PO2 falling to about 100 and PCO2 rising to about 40. Thus across the expirate PO2 falls and PCO2 rises, reflecting that alveolar gas has given oxygen to and received carbon dioxide from pulmonary capillary blood while dead space gas has not.' },
      ],
      common_errors: [
        'Stating alveolar air leaves first and dead space air last',
        'Saying PO2 rises and PCO2 falls across the expirate, which is the reverse',
        'Assigning alveolar values of PO2 100 and PCO2 40 to the initial dead space portion',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Partial pressures along the airway',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Partial pressures along the airway' },
  },

  {
    id: 'atom-p2w5g-diffusing-capacity-formula',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State the diffusing capacity formula and the diffusion relationship as written, identify how area and thickness affect diffusing capacity, and state what happens to diffusing capacity during exercise.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The diffusing capacity is about the lung DL equal to area times the diffusion coefficient divided by thickness, and diffusion equal to the pressure gradient times DL. Therefore diffusing capacity increases with greater surface area and a higher diffusion coefficient and decreases as membrane thickness increases.' },
        { id: 'kp2', weight: 2, description: 'Diffusing capacity can change, such as during exercise, when it increases. During exercise additional pulmonary capillaries are recruited and distended, increasing the effective surface area, so DL rises for CO, O2, and CO2.' },
      ],
      common_errors: [
        'Inverting the formula so thickness is in the numerator and area in the denominator',
        'Stating diffusing capacity falls during exercise rather than rising',
        'Confusing diffusing capacity, a property of the membrane and gas, with the simple partial pressure gradient',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Diffusing capacity formula and exercise',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Diffusing capacity formula and exercise' },
  },

  {
    id: 'atom-p2w5g-vq-mismatch-causes',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State the normal causes of uneven regional ventilation and uneven regional perfusion, and give the two example pathologies and which component of V/Q each disturbs.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Differences in airway and lung expansion produce uneven regional ventilation, and differences in vascular geometry and hydrostatic pressures produce uneven regional blood flow. As a result V/Q ratios vary across regions even within a normal healthy lung.' },
        { id: 'kp2', weight: 2, description: 'Asthma as a pathology that causes regional changes in ventilation and pulmonary embolism as one that causes changes in perfusion, both of which increase V/Q mismatch. Asthma narrows airways to reduce ventilation, while an embolus obstructs blood flow to reduce perfusion in the affected region.' },
      ],
      common_errors: [
        'Attributing pulmonary embolism to reduced ventilation rather than reduced perfusion',
        'Saying asthma reduces perfusion rather than ventilation',
        'Assuming a healthy lung has uniform V/Q rather than regional variation',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Causes of V/Q mismatch',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Causes of V/Q mismatch' },
  },

  {
    id: 'atom-p2w5g-normal-blood-gas-values',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State the normal mixed venous and systemic arterial values of PO2 and PCO2 as blood enters and leaves the lung unit, and explain what exchange occurs across the pulmonary capillary to convert one to the other.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Mixed venous blood entering the pulmonary capillary has PO2 about 40 mm Hg and PCO2 about 45 mm Hg, while systemic arterial blood leaving has PO2 about 100 mm Hg and PCO2 about 40 mm Hg. Alveolar gas sits between at PO2 about 104 and PCO2 about 40, and the mixed venous values also serve as the low ventilation limit a unit drifts toward when V/Q falls to zero.' },
        { id: 'kp2', weight: 2, description: 'Across the pulmonary capillary, oxygen diffuses from alveolus into venous blood, raising PO2 from 40 toward the alveolar value, and carbon dioxide diffuses from blood into the alveolus, lowering PCO2 from 45 to about 40. The blood is thereby arterialized, and in a healthy person the leaving arterial values match the alveolar values.' },
      ],
      common_errors: [
        'Reversing the values so that venous PO2 is high and arterial PO2 is low',
        'Stating PCO2 changes dramatically across the capillary when it only falls from about 45 to 40',
        'Confusing mixed venous gas with inspired gas as the low ventilation limit',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Mixed venous and arterial gas values',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Mixed venous and arterial gas values' },
  },

  {
    id: 'atom-p2w5g-dilution-slow',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Describe  the dilution and replacement of alveolar gas with each breath, including how ventilation rate affects the speed of change and why a slow rate of change is physiologically protective.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Alveolar gas is diluted and replaced only gradually, since each breath exchanges just a fraction of the air already in the lungs; The falling fraction of original gas across the first, second, fourth, and later breaths. Increasing the ventilation rate increases the rate of dilution, and decreasing it slows the rate.' },
        { id: 'kp2', weight: 2, description: 'This slow rate of change is important because it prevents rapid swings in alveolar gas concentrations, stabilizing oxygen and carbon dioxide and therefore blood pH even if respiration is briefly interrupted. The buffering provided by the functional residual capacity keeps arterial gases steady between breaths.' },
      ],
      common_errors: [
        'Thinking a single breath completely replaces alveolar gas rather than only a fraction',
        'Stating that a faster ventilation rate slows dilution',
        'Missing that the slow change protects oxygen, carbon dioxide, and pH during brief apnea',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Slow dilution of alveolar gas',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Slow dilution of alveolar gas' },
  },

  {
    id: 'atom-p2w5g-schematic-lung-unit',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Identify the variables labeled In the lung unit model for the gas and blood phases, and explain what determines the alveolar gas composition of the unit.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The lung unit model includes alveolar ventilation VA with a dot in mL per min entering the gas space, the alveolar pressure PA, and blood flow Q with a dot in mL per min through the capillary. Mixed venous blood enters with its pressure and content, and arterial blood leaves with its pressure and content.' },
        { id: 'kp2', weight: 2, description: 'The composition of alveolar gas in the unit is set by the balance between ventilation, which delivers fresh inspired gas, and blood flow, which adds carbon dioxide and removes oxygen. The ratio of these two flows, ventilation over perfusion, therefore determines the alveolar PO2 and PCO2 of that unit.' },
      ],
      common_errors: [
        'Confusing VA with a dot for ventilation with Q with a dot for blood flow',
        'Thinking alveolar gas composition depends on ventilation alone and ignoring perfusion',
        'Treating mixed venous and arterial values as identical rather than the entering and leaving blood',
      ],
      minimum_passing_score: 60,
    },
    topic: 'lung unit model variables',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'lung unit model variables' },
  },

  {
    id: 'atom-p2w5g-co2-excretion-metabolic',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State how carbon dioxide excretion to metabolic rate using the two metabolic rate example, and explain what must happen to ventilation to keep alveolar PCO2 normal as production rises.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'carbon dioxide excretion at two metabolic rates, showing it rises from about 200 to about 800 mL per min when metabolic rate increases roughly fourfold. Carbon dioxide production scales with metabolic rate.' },
        { id: 'kp2', weight: 2, description: 'Because alveolar PCO2 equals carbon dioxide production times a constant over alveolar ventilation, a higher production would raise PCO2 unless ventilation increases proportionally. Therefore ventilation must increase to clear the extra carbon dioxide and hold alveolar PCO2 near its normal value.' },
      ],
      common_errors: [
        'Stating carbon dioxide excretion only doubles rather than rising fourfold from 200 to 800',
        'Forgetting that ventilation must rise in step with production to keep PCO2 constant',
        'Confusing carbon dioxide excretion rate with the oxygen consumption rate',
      ],
      minimum_passing_score: 60,
    },
    topic: 'CO2 excretion and metabolic rate',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'CO2 excretion and metabolic rate' },
  },

  {
    id: 'atom-p2w5g-diffusing-capacity-definition',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State the definition of the diffusing capacity of the lung exactly, including its units, and explain what it physically represents and that it can change with conditions.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Diffusing capacity as the volume of gas in mL that diffuses each minute for a pressure difference of 1 mm Hg across the respiratory membrane. It is expressed in mL per min per mm Hg and is a measure of how readily a gas crosses the alveolar membrane.' },
        { id: 'kp2', weight: 2, description: 'Diffusing capacity is a measure of the alveolar membrane and the specific gas together, and it can change, for example rising during exercise as more capillaries are recruited. A higher diffusing capacity means more gas transfer for the same partial pressure gradient.' },
      ],
      common_errors: [
        'Giving units of mL per min without normalizing to a 1 mm Hg pressure difference',
        'Treating diffusing capacity as fixed rather than able to increase during exercise',
        'Confusing the definition with the pressure gradient itself rather than transfer per unit gradient',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Diffusing capacity definition',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 40', topic: 'Diffusing capacity definition' },
  },

  {
    id: 'atom-p2w5t-gas-cascade',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Describe the oxygen partial pressure cascade from atmospheric air to the alveolus using The values, and state the alveolar PCO2.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Dry atmospheric air has a PO2 of 159 mm Hg with a PCO2 of essentially 0. As air is inspired and fully humidified in the airways, added water vapor dilutes the gas and lowers PO2 to 149 mm Hg while PCO2 stays 0. The fall reflects the partial pressure contributed by water vapor at body temperature, before any gas exchange has occurred.' },
        { id: 'kp2', weight: 2, description: 'In the alveolus PO2 drops further to 104 mm Hg (some sources round to 100 to make the math easier) because oxygen is continually taken up by pulmonary capillary blood while carbon dioxide is added, raising alveolar PCO2 to 40 mm Hg. End-capillary blood leaving the alveolus reaches about 100 mm Hg. This stepwise decline from 159 to 149 to 104 is the oxygen cascade that sets the diffusion gradients.' },
      ],
      common_errors: [
        'Using 159 mm Hg as the alveolar value instead of the atmospheric value',
        'Forgetting that humidification lowers PO2 before any gas exchange occurs',
        'Stating alveolar PCO2 as 0 rather than 40 mm Hg',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Gas cascade',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Gas cascade' },
  },

  {
    id: 'atom-p2w5t-no-rbc-plasma',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Explain what happens to oxygen partial pressure and content when blood contains no red cells, using The example, and why this proves hemoglobin is essential.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Even without red blood cells, a small amount of oxygen still diffuses from the alveolus into the plasma until the plasma PO2 equilibrates with the alveolar value (around 100 to 104 mm Hg). Partial pressure is therefore maintained because dissolved gas equilibrates by simple diffusion down its gradient and does not depend on hemoglobin.' },
        { id: 'kp2', weight: 2, description: 'However the oxygen content in that plasma is minimal because the solubility of oxygen is very low (0.003 mL O2 per dL per mm Hg), yielding only about 0.3 mL per dL. This dissociation between a normal partial pressure and a tiny content demonstrates why hemoglobin is essential: it multiplies carrying capacity many fold so that adequate oxygen can be delivered despite the same driving pressure.' },
      ],
      common_errors: [
        'Assuming partial pressure also collapses when red cells are absent',
        'Believing dissolved oxygen alone could meet tissue demand',
        'Confusing the maintained partial pressure with maintained content',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Oxygen carriage',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Oxygen carriage' },
  },

  {
    id: 'atom-p2w5t-tissue-pco2-gradient',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Describe the carbon dioxide partial pressure gradient across the tissue (systemic) capillary using The values.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Carbon dioxide is produced inside cells, so the intracellular PCO2 is highest at about 46 mm Hg. It diffuses down its gradient into the interstitial fluid, which sits at about 45 mm Hg, and then into the capillary blood. The direction of net CO2 movement is therefore from cell to interstitium to blood, the reverse of oxygen.' },
        { id: 'kp2', weight: 2, description: 'Arterial blood enters the tissue capillary at a PCO2 of 40 mm Hg and leaves the venous end at about 45 mm Hg after picking up CO2. The relatively small 5 mm Hg rise across the capillary, despite a large volume of CO2 transferred, reflects the high solubility and steep dissociation behavior of carbon dioxide compared with oxygen.' },
      ],
      common_errors: [
        'Reversing the gradient and sending CO2 from blood into cells at the tissue',
        'Stating venous PCO2 as 40 rather than 45 mm Hg',
        'Confusing the intracellular value of 46 with the arterial value of 40',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Tissue carbon dioxide',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Tissue carbon dioxide' },
  },

  {
    id: 'atom-p2w5t-metabolism-flow-pco2',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Explain how changes in tissue metabolism and blood flow affect tissue PCO2, and state the lower limit of tissue PCO2 at very high flow.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Tissue PCO2 reflects the balance between CO2 production by metabolism and CO2 removal by blood flow. If metabolism increases while blood flow stays constant, CO2 accumulates faster than it can be washed away and tissue PCO2 rises. At ten times normal metabolism the interstitial PCO2 curve sits far higher than at normal or one fourth normal metabolism.' },
        { id: 'kp2', weight: 2, description: 'Increasing blood flow clears CO2 more effectively and drives tissue PCO2 down toward the arterial value. A lower limit of infinite blood flow near 40 mm Hg, meaning that no matter how high flow rises, tissue PCO2 cannot fall below the incoming arterial PCO2 of about 40 mm Hg. This mirrors the oxygen delivery curve but in the opposite direction.' },
      ],
      common_errors: [
        'Thinking higher metabolism lowers tissue PCO2',
        'Believing tissue PCO2 can fall below arterial PCO2 with enough flow',
        'Ignoring blood flow and attributing tissue PCO2 to metabolism alone',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Tissue carbon dioxide',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Tissue carbon dioxide' },
  },

  {
    id: 'atom-p2w5t-exercise-uptake',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Explain how exercise improves pulmonary oxygen uptake despite a shorter capillary transit time, listing the mechanisms.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'During exercise cardiac output increases, which shortens the time each red cell spends in the pulmonary capillary (decreased transit time). At the same time diffusing capacity increases because previously closed pulmonary capillaries open up (recruitment) and ventilation perfusion matching improves across the lung, expanding the surface area available for gas exchange.' },
        { id: 'kp2', weight: 2, description: 'Despite the shorter transit time, oxygen equilibration still occurs because of the large diffusion safety factor: normally equilibration takes only about 0.25 seconds of the 0.75 second transit, so even when transit shortens there is still enough time to fully oxygenate the blood. This reserve is why a healthy person maintains arterial oxygenation at high workloads.' },
      ],
      common_errors: [
        'Claiming transit time lengthens during exercise',
        'Saying diffusing capacity falls rather than rises in exercise',
        'Thinking the shorter transit time causes incomplete oxygenation in healthy lungs',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Exercise uptake',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Exercise uptake' },
  },

  {
    id: 'atom-p2w5t-delivery-strategies',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'List the three ways the body can increase oxygen delivery to tissue and explain how each works.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The first two strategies are increased blood flow and increased oxygen extraction. Because delivery equals oxygen content times blood flow, raising cardiac output (for example from 5000 to 20000 mL per minute) multiplies the oxygen presented to the tissues. Increased extraction means the tissues pull a larger fraction of oxygen off the hemoglobin, lowering venous oxygen content and widening the arteriovenous oxygen difference.' },
        { id: 'kp2', weight: 2, description: 'The third strategy is a rightward shift of the hemoglobin oxygen dissociation curve. Increased CO2, hydrogen ions, temperature, and BPG lower hemoglobin affinity so that at any given tissue PO2 more oxygen is released. In exercise and hypoxia these shifts combine with greater flow and extraction so that delivery to active or oxygen starved tissue rises substantially.' },
      ],
      common_errors: [
        'Listing increased hemoglobin affinity instead of a rightward shift',
        'Forgetting that delivery is content times flow',
        'Confusing increased extraction with increased delivery of fresh blood',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Oxygen delivery',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Oxygen delivery' },
  },

  {
    id: 'atom-p2w5t-vq-spectrum',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Describe the ventilation perfusion spectrum from a V/Q of zero to a V/Q of infinity, naming the condition and alveolar gas at each extreme.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'A V/Q of zero is a shunt: the alveolar unit is perfused but not ventilated, so the gas in that unit equilibrates with incoming mixed venous blood, giving an alveolar O2 near 40 and CO2 near 45. Blood leaving such a unit is not oxygenated and contributes directly to hypoxemia. Pathologic examples include pneumonia and atelectasis.' },
        { id: 'kp2', weight: 2, description: 'A V/Q of infinity is deadspace: the unit is ventilated but not perfused, so alveolar gas equals inspired air with O2 about 150 and CO2 of 0. Between these extremes a normal unit has a V/Q near 1.0 with alveolar O2 about 100 and CO2 about 40. Low V/Q units (toward zero) cause hypoxemia that responds to oxygen, while high V/Q units (toward infinity) do not contribute to hypoxemia.' },
      ],
      common_errors: [
        'Swapping shunt and deadspace so that V/Q of zero is called deadspace',
        'Assigning inspired gas values to a shunt unit instead of venous values',
        'Thinking high V/Q regions lower arterial oxygen',
      ],
      minimum_passing_score: 60,
    },
    topic: 'V/Q spectrum',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'V/Q spectrum' },
  },

  {
    id: 'atom-p2w5t-five-causes-hypoxemia',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'List the five causes of hypoxemia, group them by alveolar to arterial oxygen difference, and identify which is most common.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The five causes of hypoxemia are hypoventilation, decreased barometric pressure (such as high altitude), right to left shunt, ventilation perfusion (V/Q) mismatch, and diffusion limitation. They can be grouped by their effect on the alveolar to arterial oxygen difference: hypoventilation and low barometric pressure leave the A-a difference normal, while shunt, V/Q mismatch, and diffusion limitation widen it.' },
        { id: 'kp2', weight: 2, description: 'V/Q mismatch is the most common cause of hypoxemia. Hypoventilation is characteristically associated with an increased PCO2 (CNS depression, obesity hypoventilation, muscular weakness); diffusion limitation includes interstitial lung disease, emphysema, and pulmonary vascular disease; shunt includes alveolar filling (blood, water, pus, protein), atelectasis, and intracardiac shunts. Only shunt fails to correct fully with 100 percent oxygen.' },
      ],
      common_errors: [
        'Listing increased BPG or anemia as a cause of hypoxemia',
        'Naming shunt rather than V/Q mismatch as the most common cause',
        'Forgetting decreased barometric pressure (altitude) as one of the five',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Causes of hypoxemia',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Causes of hypoxemia' },
  },

  {
    id: 'atom-p2w5t-aa-workup',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Describe how the alveolar to arterial oxygen difference and the response to 100 percent oxygen are used to work up the cause of hypoxemia, and give the clinical alveolar gas equation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The first branch point is the A-a oxygen difference. A normal A-a difference indicates the lung is exchanging gas properly, so the cause is hypoventilation or low inspired oxygen at altitude. An increased A-a difference indicates a gas exchange abnormality, narrowing the cause to shunt, V/Q mismatch, or diffusion limitation. The alveolar PO2 needed for the calculation is found with PAO2 equals FIO2 times (PB minus 47) minus PCO2 divided by 0.8.' },
        { id: 'kp2', weight: 2, description: 'When the A-a difference is increased, giving 100 percent inspired oxygen separates the causes: if the hypoxemia corrects (PO2 rises substantially) the problem is low V/Q (or diffusion limitation), because those units are still ventilated and can take up the extra oxygen. If the hypoxemia does not correct, the problem is a true shunt, because shunted blood never contacts the alveolar gas. This responsive versus non-responsive test is the key bedside discriminator.' },
      ],
      common_errors: [
        'Assigning shunt to a normal A-a difference',
        'Thinking hypoxemia from shunt corrects on 100 percent oxygen',
        'Reversing the altitude and hypoventilation branch with the gas exchange branch',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Hypoxemia workup',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Hypoxemia workup' },
  },

  {
    id: 'atom-p2w5t-co2-dissolved',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State how much more soluble carbon dioxide is than oxygen and give the dissolved CO2 quantities in venous and arterial blood and the fraction of total CO2 carried dissolved.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Carbon dioxide is roughly 20 times more soluble in plasma than oxygen, so a meaningful quantity travels simply dissolved rather than chemically bound. Dissolved CO2 measures about 2.7 mL per 100 mL in venous blood and about 2.4 mL per 100 mL in arterial blood, with the difference of about 0.3 mL per 100 mL representing the dissolved CO2 actually delivered to the lungs per pass.' },
        { id: 'kp2', weight: 2, description: 'That dissolved portion accounts for about 7 percent of total CO2 transport, the remainder being carried as bicarbonate (about 70 percent) and as carbaminohemoglobin (about 23 percent). The contrast with oxygen is striking: because CO2 is so much more soluble, its dissolved fraction is physiologically important, whereas dissolved oxygen (only about 0.3 mL per dL total) is negligible relative to hemoglobin bound oxygen.' },
      ],
      common_errors: [
        'Stating CO2 is less soluble than oxygen rather than about 20 times more soluble',
        'Reversing the venous (2.7) and arterial (2.4) dissolved values',
        'Claiming dissolved CO2 is negligible like dissolved oxygen',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Carbon dioxide transport',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Carbon dioxide transport' },
  },

  {
    id: 'atom-p2w5t-co2-curve-shape',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Describe the shape and normal operating range of the carbon dioxide dissociation curve and contrast it with the oxygen curve.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The carbon dioxide dissociation curve plots CO2 content (volumes percent) against PCO2 and is much more linear than the sigmoid oxygen curve over the physiologic range. Its normal operating range lies between about 40 mm Hg (arterial) and 45 mm Hg (venous), and within that narrow band the relationship is nearly straight, so CO2 content changes almost proportionally with PCO2.' },
        { id: 'kp2', weight: 2, description: 'This near-linear, steep behavior means blood can load and unload large amounts of CO2 for small changes in PCO2, which is important because total CO2 carriage far exceeds oxygen carriage. The contrast with the flat upper plateau of the oxygen curve explains why CO2 elimination is tightly coupled to ventilation while oxygen saturation stays high across a wide PO2 range.' },
      ],
      common_errors: [
        'Describing the CO2 curve as sigmoid and plateaued like the oxygen curve',
        'Placing the normal operating range far from 40 to 45 mm Hg',
        'Assuming CO2 content barely changes with PCO2 in the normal range',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Carbon dioxide transport',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Carbon dioxide transport' },
  },

  {
    id: 'atom-p2w5t-co-affinity-pulseox',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Explain why carbon monoxide is so dangerous based on its dissociation curve and why standard pulse oximetry fails to detect carbon monoxide poisoning.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Carbon monoxide binds hemoglobin with a much higher affinity than oxygen, so its dissociation curve is shifted far to the left and hemoglobin becomes fully saturated with CO at very low partial pressures (well under 1 mm Hg). Even trace concentrations of inhaled CO therefore displace oxygen from hemoglobin, forming carboxyhemoglobin and sharply reducing oxygen carrying capacity while the dissolved PaO2 may look normal.' },
        { id: 'kp2', weight: 2, description: 'A standard two wavelength pulse oximeter cannot distinguish carboxyhemoglobin from oxyhemoglobin because they absorb light similarly, so it reports a falsely reassuring saturation near 99 percent despite dangerous oxygen deprivation. This is why pulse oximetry is unreliable in suspected carbon monoxide poisoning and co-oximetry or direct carboxyhemoglobin measurement is required.' },
      ],
      common_errors: [
        'Saying carbon monoxide binds hemoglobin weakly or only at high pressure',
        'Believing pulse oximetry reads low in carbon monoxide poisoning',
        'Confusing carboxyhemoglobin with methemoglobin in pulse oximeter behavior',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Carbon monoxide',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Carbon monoxide' },
  },

  {
    id: 'atom-p2w6r-neural-integration',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe how the neural control of respiration integrates its inputs: name the three streams of input that converge on the central cycle of inspiration and expiration, give the categories of reflex input, and state where the final motor output is directed.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The central cycle of inspiration and expiration in the brainstem is driven by three converging input streams feeding the center. First, influences descend from higher centers such as the cortex. Second, chemoreceptor input arrives from both the arterial peripheral chemoreceptors and the central chemoreceptors. Third, a broad set of reflexes feeds in. These inputs are integrated each breath to set rate and depth, and the integrated command is then sent onward to the muscles of breathing as the motor output.' },
        { id: 'kp2', weight: 2, description: 'The reflex input stream comes from several body regions: the lungs and airways supply stretch, irritant, and J receptor signals; the cardiovascular system supplies baroreceptor and chemoreceptor signals; and the muscles, joints, and skin supply mechanoreceptor and proprioceptive signals. By blending higher center drive, chemical feedback, and these mechanical and reflex signals, the respiratory center can match ventilation to both conscious demands and the metabolic and mechanical state of the body.' },
      ],
      common_errors: [
        'Thinking the respiratory center receives only chemoreceptor input and ignoring the reflex and higher center streams',
        'Believing reflexes come only from the lungs and forgetting cardiovascular, muscle, joint, and skin receptors',
        'Confusing the motor output to the muscles of breathing with a sensory input',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Neural integration',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Neural integration' },
  },

  {
    id: 'atom-p2w6r-cn-afferents',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Using the respiratory center anatomy, describe how sensory information reaches the dorsal respiratory group and how motor commands leave the medullary center, naming the relevant nerves and pathways.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Afferent or sensory signals travel to the dorsal respiratory group mainly through the vagus and glossopharyngeal nerves. These cranial nerves carry information from peripheral sensors including the lung stretch, irritant, and J receptors and the peripheral chemoreceptors in the carotid and aortic bodies. They terminate in the region of the dorsal respiratory group, which lies near the tractus solitarius in the medulla, so that this group serves as the main receiving station for reflex respiratory input.' },
        { id: 'kp2', weight: 2, description: 'Motor output leaves the medullary respiratory center along respiratory motor pathways that descend to the spinal cord and ultimately drive the phrenic nerve to the diaphragm and the intercostal nerves to the chest wall muscles. This separates the incoming cranial nerve afferents, the vagus and glossopharyngeal, from the outgoing respiratory motor pathways, emphasizing that the medulla both receives reflex input and issues the commands that produce each breath.' },
      ],
      common_errors: [
        'Naming the phrenic or intercostal nerves as the afferents to the dorsal respiratory group when they are motor outputs',
        'Forgetting that the glossopharyngeal nerve, not only the vagus, carries respiratory afferents',
        'Assuming all sensory and motor traffic uses a single nerve rather than separate afferent and motor pathways',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Cranial nerve afferents',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Cranial nerve afferents' },
  },

  {
    id: 'atom-p2w6r-apneustic',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe the apneustic center: where it is located, the effect it would have on breathing if left unopposed, and how it is normally controlled by another pontine center.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The apneustic center is located in the lower pons and is marked with a question mark because its exact role in humans is uncertain. When unopposed, as in some experimental brainstem lesions, it promotes apneustic breathing, a pattern of prolonged sustained inspiratory gasps with only brief expirations. This reflects an excitatory drive that prevents the normal switch from inspiration to expiration, holding the lungs in a deeply inflated state.' },
        { id: 'kp2', weight: 2, description: 'Under normal conditions the apneustic center is held in check by the pneumotaxic center, which sits in the upper pons and inhibits it. The pneumotaxic center also shortens the inspiratory ramp from the dorsal respiratory group, and together these influences allow inspiration to terminate normally. Because the pneumotaxic center inhibits the apneustic center, loss of pneumotaxic input can release apneustic breathing, linking the two pontine centers in opposing roles.' },
      ],
      common_errors: [
        'Placing the apneustic center in the medulla rather than the lower pons',
        'Stating that the apneustic center shortens inspiration when unopposed it instead prolongs it',
        'Forgetting that the pneumotaxic center normally inhibits the apneustic center',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Apneustic center',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Apneustic center' },
  },

  {
    id: 'atom-p2w6r-ramp-slope',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Explain how the dorsal respiratory group can vary the slope of the inspiratory ramp and what changing the slope accomplishes for ventilation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The inspiratory signal from the dorsal respiratory group is a ramp that rises progressively during inspiration and then stops abruptly. Beyond simply turning on and off, the rate of rise or steepness of this ramp can be controlled. When more rapid lung filling is needed, such as during exercise or increased demand, the ramp becomes steeper so that the inspiratory muscles are recruited more quickly and the lungs fill faster within each breath.' },
        { id: 'kp2', weight: 2, description: 'Controlling the slope of the ramp is one of two main ways the center adjusts breathing; the other is controlling when the ramp stops, which sets inspiratory duration and rate. A steeper ramp increases the speed and depth of inspiration, raising tidal volume and minute ventilation, while a shallower ramp produces slower, gentler filling. This gives the respiratory center a graded way to match inspiratory effort to the level of ventilatory demand.' },
      ],
      common_errors: [
        'Thinking the ramp has a fixed slope and only its timing can change',
        'Confusing a steeper ramp with a longer ramp; steeper means faster filling, not necessarily longer inspiration',
        'Assuming slope control affects expiration, which is normally passive recoil',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Ramp slope control',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Ramp slope control' },
  },

  {
    id: 'atom-p2w6r-vrg',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe the ventral respiratory group: where it is located, its activity during quiet versus forceful breathing, the phases of respiration it serves, and where its drive originates.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The ventral respiratory group lies in the medulla and is essentially inactive during quiet, normal breathing, when the dorsal respiratory group alone can drive the diaphragm for inspiration with passive expiration. The ventral group is recruited during active or forceful respiration, such as during exercise or heavy breathing, when large volumes of ventilation are required and the extra muscle drive of this group is needed.' },
        { id: 'kp2', weight: 2, description: 'The ventral respiratory group contributes mainly to expiration, providing the active expiratory drive to abdominal and internal intercostal muscles, but it can also contribute to inspiration when demand is high. It does not generate the basic rhythm itself; instead it receives projections from the dorsal respiratory group, which sets the rhythm. Thus the ventral group acts as an overflow or amplifier system that adds power to both phases when quiet breathing is insufficient.' },
      ],
      common_errors: [
        'Stating the ventral respiratory group drives quiet breathing when it is inactive at rest',
        'Saying the ventral group serves only expiration; it mainly drives expiration but also aids inspiration',
        'Believing the ventral group generates the primary rhythm rather than receiving it from the dorsal group',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Ventral respiratory group',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Ventral respiratory group' },
  },

  {
    id: 'atom-p2w6r-irritant',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe the airway irritant receptors: where they are located, what stimulates them, and the protective reflex responses they produce.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Irritant receptors are located in the nasal mucosa, the upper airways, and possibly the alveoli. They are positioned in the lining of the conducting airways where inhaled particles, noxious gases, dust, smoke, and other irritants make contact. Their location at the airway surface lets them act as a rapid early warning system that detects potentially harmful inhaled material before it reaches and damages the gas exchange surfaces.' },
        { id: 'kp2', weight: 2, description: 'When stimulated, irritant receptors trigger protective reflexes: bronchoconstriction, which narrows the airways to limit penetration of the irritant, and the cough and sneeze reflexes, which forcefully expel the offending material. These responses defend the lungs from injury. Because bronchoconstriction is part of this reflex, irritant receptor activation is relevant to airway hyperreactivity and is distinct from the stretch and J receptor reflexes.' },
      ],
      common_errors: [
        'Placing irritant receptors in the pulmonary capillaries, which is where J receptors lie',
        'Forgetting that bronchoconstriction, not bronchodilation, is part of the irritant reflex',
        'Listing only cough and omitting sneeze and bronchoconstriction',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Irritant receptors',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Irritant receptors' },
  },

  {
    id: 'atom-p2w6r-j-receptors',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe the pulmonary J receptors: where they are located, the conditions that stimulate them, and the breathing pattern they produce.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'J receptors, or juxtacapillary receptors, are located in the alveolar wall in close apposition to the pulmonary capillaries, that is in the capillary wall and interstitium. Their position next to the capillaries lets them sense changes in the interstitial space, such as fluid accumulation. They are stimulated by lung disease and pulmonary edema, conditions that cause congestion and engorgement or swelling of the interstitium around the capillaries.' },
        { id: 'kp2', weight: 2, description: 'When stimulated, J receptors produce rapid shallow breathing, also called tachypnea. This pattern is characteristic of the sensation of breathlessness in conditions such as pulmonary edema, congestion, and interstitial lung disease. Because their stimulus is interstitial fluid and congestion and their output is tachypnea, J receptors link a fluid overloaded or diseased lung to the clinical picture of rapid shallow respiration.' },
      ],
      common_errors: [
        'Locating J receptors in the airway smooth muscle, which is the stretch receptor site',
        'Saying J receptors cause slow deep breathing rather than rapid shallow breathing',
        'Forgetting that pulmonary edema and congestion are the key stimuli',
      ],
      minimum_passing_score: 60,
    },
    topic: 'J receptors',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'J receptors' },
  },

  {
    id: 'atom-p2w6r-baroreflex',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe the respiratory effect of arterial baroreceptor stimulation by elevated blood pressure, including the changes in breathing and airway caliber.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Arterial baroreceptors in the carotid sinus and aortic arch are primarily pressure sensors for cardiovascular control, but they also influence respiration. When elevated blood pressure stretches and stimulates these baroreceptors, the reflex response includes a brief period of apnea, a transient pause or slowing of breathing. This illustrates that a rise in systemic pressure can momentarily inhibit the respiratory center through the baroreflex pathway.' },
        { id: 'kp2', weight: 2, description: 'Along with brief apnea, baroreceptor stimulation by high pressure produces bronchodilation, a widening of the airways. This pairing of apnea with bronchodilation is the opposite of the arterial chemoreceptor response, which produces hyperpnea and increased blood pressure. Keeping the two reflexes distinct is important: high pressure acting on baroreceptors quiets breathing and dilates airways, whereas low oxygen acting on chemoreceptors stimulates breathing.' },
      ],
      common_errors: [
        'Confusing the baroreceptor response with the chemoreceptor response and saying high pressure causes hyperpnea',
        'Stating that baroreceptor stimulation causes bronchoconstriction rather than bronchodilation',
        'Forgetting that the apnea produced is brief and transient, not sustained',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Arterial baroreflex',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Arterial baroreflex' },
  },

  {
    id: 'atom-p2w6r-proprioceptors',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe how receptors in the muscles, joints, and tendons contribute to the control of respiration and the situation in which this contribution matters most.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Receptors in the muscles of respiration themselves, as well as in skeletal muscles, joints, and tendons throughout the body, send signals to the respiratory center. These mechanoreceptors and proprioceptors detect movement and the mechanical state of the limbs and chest wall. By feeding this information forward, they allow ventilation to be adjusted to elevated workloads, matching breathing to the physical activity being performed.' },
        { id: 'kp2', weight: 2, description: 'This proprioceptive input is a major contributor to exercise hyperpnea. At the onset of movement, signals from moving joints and contracting muscles help drive the rapid rise in ventilation even before blood gases change, which is why ventilation can climb almost immediately with exercise. The joint and muscle receptors thus complement central cortical drive and account for part of the close matching of ventilation to the level of muscular work.' },
      ],
      common_errors: [
        'Believing chemoreceptors alone adjust ventilation during exercise and ignoring joint and muscle receptors',
        'Thinking proprioceptive input sets resting acid base balance rather than matching ventilation to workload',
        'Forgetting that these receptors help drive the immediate rise in ventilation at exercise onset',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Proprioceptor reflex',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Proprioceptor reflex' },
  },

  {
    id: 'atom-p2w6r-glomus',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe the proposed transduction mechanism by which a carotid body glomus cell converts a fall in arterial PO2 into an afferent nerve signal, listing the sequence of events and the transmitters released.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The oxygen sensing cells of the carotid body are the glomus cells. The accepted scheme begins when a fall in arterial PO2 causes potassium channels in the glomus cell membrane to close. Because potassium efflux normally keeps the cell hyperpolarized, closing these channels reduces the outward potassium current and depolarizes the membrane. This change in membrane voltage is the trigger that links the chemical signal of low oxygen to an electrical response in the cell.' },
        { id: 'kp2', weight: 2, description: 'The depolarization opens voltage gated calcium channels, allowing calcium to enter and raising the intracellular calcium concentration. The rise in calcium triggers exocytosis of neurotransmitters, releasing ATP and acetylcholine from the glomus cell. These transmitters excite the afferent nerve fiber, which carries the signal toward the central nervous system through the glossopharyngeal nerve. The mechanism is described as not fully understood but is thought to follow this potassium channel to calcium to transmitter pathway.' },
      ],
      common_errors: [
        'Saying low oxygen opens potassium channels when it closes them to depolarize the cell',
        'Omitting the rise in intracellular calcium as the trigger for transmitter release',
        'Forgetting that ATP and acetylcholine are the transmitters that excite the afferent fiber',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Glomus cell mechanism',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Glomus cell mechanism' },
  },

  {
    id: 'atom-p2w6r-interrelated-gases',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Explain the interrelated effects of PCO2, PO2, and pH on alveolar ventilation , focusing on how oxygen and pH modify the carbon dioxide response.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'the composite curves shows that the ventilatory response to carbon dioxide is not fixed but is modified by the simultaneous levels of oxygen and pH. As PCO2 rises, alveolar ventilation increases along a carbon dioxide response curve. When the PO2 is lowered, each of these curves becomes steeper and is shifted, so that any given PCO2 now drives a larger ventilation. Low oxygen therefore potentiates or sensitizes the response to carbon dioxide rather than acting only on its own.' },
        { id: 'kp2', weight: 2, description: 'Lowering the pH, for example from 7.4 to 7.3, similarly shifts the family of curves toward greater ventilation, reflecting added stimulation from acidosis. The practical message is that the three chemical stimuli interact: hypoxia and acidosis both amplify the drive produced by a given carbon dioxide level. This explains why a patient who is simultaneously hypoxic and acidotic ventilates far more at a given PCO2 than one with normal oxygen and pH.' },
      ],
      common_errors: [
        'Treating the carbon dioxide response as independent of oxygen and pH',
        'Thinking low oxygen flattens or abolishes the CO2 response rather than steepening it',
        'Assuming a lower pH reduces ventilation when it shifts the curves toward more ventilation',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Interrelated gases',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Interrelated gases' },
  },

  {
    id: 'atom-p2w6r-co2-conditions',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe how different physiological and pharmacological conditions shift the carbon dioxide response curve, contrasting the condition that increases ventilation with those that depress it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The carbon dioxide response curve plots alveolar ventilation against PCO2, and its position changes with the subject state. Metabolic acidosis shifts the curve up and to the left of normal, so ventilation is greater at any given PCO2; this reflects the body increasing ventilation to blow off carbon dioxide and partially correct the low pH. Metabolic acidosis is therefore the condition that raises the ventilatory response to carbon dioxide.' },
        { id: 'kp2', weight: 2, description: 'Several states depress the curve, shifting it down and to the right so that ventilation is lower at any given PCO2. Sleep causes mild depression, narcotics cause greater depression, and anesthesia depresses the response the most. This ordering shows a spectrum of respiratory depression and explains why sedatives, opioids, and anesthetics blunt the protective increase in breathing that a rising carbon dioxide would normally cause.' },
      ],
      common_errors: [
        'Thinking all listed conditions depress the curve and forgetting that metabolic acidosis increases ventilation',
        'Ranking sleep or narcotics as more depressing than anesthesia, which depresses the response most',
        'Assuming a rightward shift means more ventilation when it means less at a given PCO2',
      ],
      minimum_passing_score: 60,
    },
    topic: 'CO2 response conditions',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'CO2 response conditions' },
  },

  {
    id: 'atom-p2w6r-exercise-curve',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Explain how the relationship between ventilation and PCO2 is reset during exercise, using the comparison of the exercise and resting curves, and state what this implies about the cause of exercise hyperpnea.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'When ventilation is plotted against arterial PCO2, the exercise curve sits far above the resting curve. At a normal arterial PCO2 of about 40 mmHg, the resting curve gives only a few liters per minute of ventilation, whereas the exercise curve gives a much higher value, on the order of 120 liters per minute. The entire relationship is shifted upward, so ventilation is high even though PCO2 remains near its normal resting value.' },
        { id: 'kp2', weight: 2, description: 'This upward reset means the large rise in ventilation during exercise cannot be explained by a rise in PCO2, because PCO2 stays near normal or even falls slightly. Instead the curve is moved by other drivers such as cortical overflow, signals from moving muscles and joints, and increased body temperature. This therefore shows that exercise hyperpnea is driven largely by neurogenic and feedforward factors rather than by a chemical change in arterial carbon dioxide.' },
      ],
      common_errors: [
        'Concluding that PCO2 must rise during exercise to drive the higher ventilation',
        'Reading the exercise and resting curves as overlapping rather than the exercise curve being far higher',
        'Forgetting that the upward shift implies neurogenic rather than chemical drive',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Exercise curve shift',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Exercise curve shift' },
  },

  {
    id: 'atom-p2w6r-other-factors',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'List and explain the additional, nonchemoreceptor factors that influence respiration covered on the other factors, including voluntary control, the vasomotor center, and body temperature.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Breathing can be modified by voluntary control, in which higher cortical centers consciously override the automatic brainstem rhythm for a limited time, as during breath holding, speaking, or hyperventilating on purpose. Activity from the vasomotor center, a primarily cardiovascular brainstem region, can also influence respiration, reflecting the close anatomical and functional linkage between cardiovascular and respiratory control in the brainstem.' },
        { id: 'kp2', weight: 2, description: 'Body temperature stimulates respiration by two mechanisms: a higher temperature raises metabolic rate and therefore increases carbon dioxide production, indirectly driving ventilation, and warmth also has a direct stimulating effect on the respiratory center itself. Irritants and anesthesia are additional listed influences, irritants stimulating airway reflexes and anesthesia depressing the center. Together these show that respiration is shaped by conscious, cardiovascular, thermal, and pharmacological factors beyond the chemoreceptors.' },
      ],
      common_errors: [
        'Believing voluntary control can stop breathing indefinitely rather than only briefly',
        'Listing only one temperature mechanism instead of both increased CO2 production and a direct central effect',
        'Forgetting that the vasomotor center, a cardiovascular region, also influences breathing',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Other factors',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Other factors' },
  },

  {
    id: 'atom-p2w6i-mefr-pefr',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Distinguish maximum expiratory flow rate from peak expiratory flow rate, including the exact timing window for PEFR and the lung volume endpoints of the flow curve.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Maximum expiratory flow rate, MEFR, is the greatest amount of flow that can be achieved during a forceful expiration from lungs filled to a given volume. It is read off the maximum expiratory flow curve , which plots expiratory airflow in liters per minute against lung volume. That curve rises steeply from total lung capacity on the left, peaks near 400 liters per minute, then declines to zero at residual volume on the right, so the whole curve spans from total lung capacity down to residual volume.' },
        { id: 'kp2', weight: 2, description: 'Peak expiratory flow rate, PEFR, is the single maximum expiratory flow rate measured during the first 100 to 120 milliseconds of a forceful expiration that begins from completely full lungs. It is the peak of the same maximum expiratory flow curve. The key contrast is that MEFR is a flow defined at any given lung volume, whereas PEFR is specifically the highest flow occurring in that brief early window from full inflation.' },
      ],
      common_errors: [
        'Saying PEFR is measured over the first full second; 100 to 120 milliseconds.',
        'Claiming PEFR can start from any lung volume; it begins from completely full lungs.',
        'Misplacing the curve endpoints, for example starting at functional residual capacity instead of total lung capacity.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'MEFR versus PEFR',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'MEFR versus PEFR' },
  },

  {
    id: 'atom-p2w6i-coexist-categories',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'State the two main categories of pulmonary pathology with the one-line mechanism and usual site for each, and explain the two can occur together.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'pulmonary pathology divide into two main categories. Obstructive disease means increased resistance to airflow, most often from problems with the conducting airways, especially the bronchioles. Restrictive disease means decreased expansion of the lungs, most often because the lungs or the surrounding tissues are stiff or rigid. These are defined by opposite core problems, moving air through the airways versus expanding the lung.' },
        { id: 'kp2', weight: 2, description: 'Someone can have both obstructive and restrictive disease at the same time. The two categories are not mutually exclusive, so a single patient may simultaneously have narrowed high resistance airways and stiff poorly expanding lungs. Recognizing this overlap prevents the error of forcing every case into one box and explains mixed spirometry patterns.' },
      ],
      common_errors: [
        'Treating obstructive and restrictive as mutually exclusive since they can coexist.',
        'Swapping the mechanisms, for example calling restrictive disease an airway resistance problem.',
        'Forgetting that obstruction is centered on the conducting airways, especially the bronchioles.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Obstructive and restrictive overlap',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Obstructive and restrictive overlap' },
  },

  {
    id: 'atom-p2w6i-resistance-factors',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'List the factors that increase resistance to airflow organized by whether the lumen is blocked, the lumen is narrowed, or the cause is outside the airway.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Intraluminal causes into two buckets. The lumen being blocked is caused by excessive secretions and by obstruction due to aspiration. The lumen being narrowed is caused by contraction of smooth muscle in the airway walls and by hypertrophy of the bronchial wall. Both buckets reduce the effective cross section of the airway and thereby raise resistance to airflow.' },
        { id: 'kp2', weight: 2, description: 'The third group is a cause outside of the airways, namely destruction of lung parenchyma. Normally the lung parenchyma pulls outward on the walls of adjacent airways, holding them open. When parenchyma is destroyed, this outward radial traction is lost, the airways tend to collapse, and resistance rises even though nothing is inside or in the wall of the airway itself.' },
      ],
      common_errors: [
        'Listing a factor that lowers resistance, such as smooth muscle relaxation or bronchodilation, as a cause of increased resistance.',
        'Putting smooth muscle contraction in the blocked-lumen group instead of the narrowed-lumen group.',
        'Omitting the outside-the-airway mechanism of lost parenchymal traction.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Factors raising airway resistance',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Factors raising airway resistance' },
  },

  {
    id: 'atom-p2w6i-fig432-shifts',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe how the airway obstruction and restrictive curves are positioned on the maximum expiratory flow volume diagram relative to the normal curve, and explain what the shifts mean given the volume axis orientation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The horizontal axis is lung volume, plotted with high volume on the left and low volume on the right, near total lung capacity and residual volume markers. The airway obstruction curve is shifted to the left, sitting at higher lung volumes, because air is trapped and the lung is hyperinflated. Its peak flow is also much lower than normal, reflecting the high resistance to airflow.' },
        { id: 'kp2', weight: 2, description: 'The restrictive curve, which Guyton labels constricted lungs, is shifted to the right, sitting at smaller lung volumes, because the stiff lung cannot expand to normal total lung capacity. It is a miniaturized version of the normal curve. So obstruction shifts left toward larger volumes while restriction shifts right toward smaller volumes, a direct visual contrast on the same diagram.' },
      ],
      common_errors: [
        'Reversing the shifts, saying obstruction is on the right or restriction is on the left.',
        'Assuming a left shift means smaller volumes; on this axis left is higher volume.',
        'Forgetting that the obstruction curve also has a markedly reduced peak flow.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Figure 43-2 curve positions',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Figure 43-2 curve positions' },
  },

  {
    id: 'atom-p2w6i-flow-loop-directions',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe the flow volume loop findings for obstructive versus restrictive disease including loop direction, relative volumes, and the FEV1 to FVC relationship.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The obstructive loop shifts to the left, meaning toward higher lung volumes on the volume axis, and its volumes are greater than normal because air is trapped. FEV1 decreases more than FVC, so the FEV1/FVC ratio is lowered. The expiratory limb is scooped with a reduced peak flow because air leaves slowly through narrowed airways, and air trapping raises the residual volume.' },
        { id: 'kp2', weight: 2, description: 'The restrictive loop shifts to the right, toward lower lung volumes, and its volumes are smaller than normal because the lungs cannot fully expand. FEV1 and FVC decrease in proportion to one another, so the FEV1/FVC ratio is normal or even elevated. The loop keeps a roughly normal shape but is miniaturized, reflecting a reduced total lung capacity rather than slow airflow.' },
      ],
      common_errors: [
        'Reversing the directions, saying obstruction shifts right or restriction shifts left.',
        'Reporting a low FEV1/FVC ratio in restriction, when it is normal or elevated because both values fall together.',
        'Forgetting that obstructive volumes are larger than normal while restrictive volumes are smaller.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Flow volume loop directions',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Flow volume loop directions' },
  },

  {
    id: 'atom-p2w6i-fvc-fev1-values',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Define forced vital capacity and forced expiratory volume in one second, give the normal and obstructed FEV1/FVC percentages, and state how obstruction changes the time to exhale.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Forced vital capacity, FVC, is the total amount of air a person can force out of the lungs after a maximal inhalation. Forced expiratory volume in one second, FEV1, is the amount of that air forced out in the first one second after a maximal inhalation. FEV1 is therefore a subset of FVC, capturing how much of the vital capacity leaves in the opening second of a forced exhale.' },
        { id: 'kp2', weight: 2, description: 'In the normal panel  the FEV1/FVC percentage is 80%, whereas in the airway obstruction panel it falls to 47%. It takes longer to get the air out when there is obstruction, so a smaller fraction of the total volume escapes in the first second. The total FVC may eventually be exhaled but over a prolonged time, which is what lowers the ratio.' },
      ],
      common_errors: [
        'Confusing FEV1 and FVC, for example calling FVC the one second volume.',
        'Misremembering the values; normal is 80% and obstructed is 47%.',
        'Saying obstruction speeds up exhalation when it actually prolongs the time to empty the lungs.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'FVC, FEV1, and figure values',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'FVC, FEV1, and figure values' },
  },

  {
    id: 'atom-p2w6i-copd-definition',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Define COPD as taught, stating the nature and time course of the lung damage, its effect on exhalation, and naming its two main types and whether they can coexist.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'COPD, chronic obstructive pulmonary disease, is as a group of disorders involving progressive, longterm, permanent damage to lung tissue that results in air being trapped in the lungs during exhalation. The emphasis is that the damage is permanent and progressive, not reversible, which separates COPD from the reversible obstruction of asthma.' },
        { id: 'kp2', weight: 2, description: 'There are two main types of COPD, chronic bronchitis and emphysema, and that a person can have both of these at the same time. Chronic bronchitis is centered on longterm inflammation and narrowing of the bronchi, while emphysema is centered on permanent destruction of the elastic tissue of the alveoli; together they produce the air trapping that defines the disease group.' },
      ],
      common_errors: [
        'Describing COPD damage as reversible; it is progressive and permanent.',
        'Naming only one type, or adding asthma as a third type of COPD.',
        'Saying the two types cannot coexist since a person can have both.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'COPD definition and types',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'COPD definition and types' },
  },

  {
    id: 'atom-p2w6i-emphysema-confluent',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Explain the structural change to the alveoli in emphysema and link it to the loss of elasticity and surface area and to obstruction with air trapping.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'In emphysema the lung parenchyma is lost and the alveoli merge into fewer large pockets of air instead of many small ones. Histology shows this as confluent alveoli, large empty spaces replacing the fine normal honeycomb. The destruction is often driven by infection and secretions damaging the elastic connective tissue of the alveolar walls.' },
        { id: 'kp2', weight: 2, description: 'Merging of alveoli into large pockets has two direct consequences emphasized. There is less elasticity because the elastic tissue that recoils to push air out is destroyed, and there is less surface area for gas exchange. Combined with loss of parenchymal traction this produces obstruction and trapping of air during exhalation, the hallmark of the emphysematous lung.' },
      ],
      common_errors: [
        'Saying alveoli multiply or regenerate; they merge into fewer larger spaces.',
        'Attributing the change to fluid filling, which describes pneumonia rather than emphysema.',
        'Forgetting that the merged architecture reduces both elasticity and surface area.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Emphysema alveolar architecture',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Emphysema alveolar architecture' },
  },

  {
    id: 'atom-p2w6i-barrel-chest',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe the barrel chest finding, stating which chest dimension changes, the direction of the change, and the underlying process in chronic obstructive disease that produces it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'A barrel chest is contrasted with a normal adult thorax in cross section. In the normal adult the chest is wider side to side than front to back. In the barrel chest the anteroposterior, front to back, diameter is increased so the cross section becomes more rounded, like a barrel. The change is in the front to back dimension of the rib cage.' },
        { id: 'kp2', weight: 2, description: 'The barrel chest develops in chronic obstructive disease such as emphysema because air is chronically trapped and the lungs stay hyperinflated. The rib cage is held in a more expanded inspiratory position over time, permanently enlarging the anteroposterior diameter. It is therefore a physical sign of longstanding air trapping, distinct from spinal curvature deformities such as kyphosis.' },
      ],
      common_errors: [
        'Saying the side to side diameter increases; it is the front to back diameter that enlarges.',
        'Confusing barrel chest with kyphosis or scoliosis, which are spinal curvature problems.',
        'Treating barrel chest as a restrictive sign when it reflects obstructive air trapping.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Barrel chest',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Barrel chest' },
  },

  {
    id: 'atom-p2w6i-asthma-features-symptoms',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'List the three main physiological features of an asthma attack as named, the common triggers, and the listed symptoms, noting that asthma obstruction is reversible.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Three main physiological features of asthma: bronchial smooth muscle contraction, bronchial soft tissue swelling, and mucus overproduction with plugging. Together these narrow the bronchial airways from three directions, the muscle squeezing the wall, the inflamed wall thickening, and mucus filling the lumen, which is why an asthma attack produces marked airflow obstruction.' },
        { id: 'kp2', weight: 2, description: 'Common irritants listed include smoke, pollen, mold, pet dander, dust, chemicals, very cold temperature, emotions, and exercise. Symptoms listed are shortness of breath, wheeze, cough, and tightness in the chest. Crucially asthma is reversible, so unlike the permanent damage of COPD the narrowing can resolve, especially during acute exacerbations.' },
      ],
      common_errors: [
        'Listing alveolar destruction or capillary loss, which belong to emphysema, as features of asthma.',
        'Omitting one of the three features, especially mucus plugging or soft tissue swelling.',
        'Calling asthma obstruction permanent; it is reversible.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Asthma features, triggers, symptoms',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Asthma features, triggers, symptoms' },
  },

  {
    id: 'atom-p2w6i-asthma-reversibility',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Explain the reversibility of asthma contrasting acute exacerbations with severe long-term disease, and state how this relates to its place among obstructive diseases.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Asthma is considered reversible airway obstruction, and that acute exacerbations are typically fully reversible. This reversibility is the defining feature that distinguishes asthma from the permanent damage of COPD; after the trigger resolves or a bronchodilator is given, the narrowed airways open back up and airflow returns toward normal.' },
        { id: 'kp2', weight: 2, description: 'The caveat that technically irreversible chronic changes may also occur due to the chronic inflammation in long-term severe asthma. So while the typical acute episode reverses, repeated severe inflammation over years can produce some fixed airway remodeling, blurring the line between asthma and COPD in the most severe chronic cases.' },
      ],
      common_errors: [
        'Stating asthma is always fully and permanently reversible, ignoring the long-term remodeling caveat.',
        'Confusing the reversible acute exacerbation with the fixed changes of severe chronic asthma.',
        'Calling asthma irreversible like COPD, which contradicts asthma reversibility.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Asthma reversibility',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Asthma reversibility' },
  },

  {
    id: 'atom-p2w6i-restrictive-volumes',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'State how restrictive disease changes total lung capacity, vital capacity, airway resistance, and the FEV1/FVC ratio and explain why the ratio behaves that way.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Restrictive disease causes decreased expansion of the lungs, which reduces the total lung capacity and reduces the vital capacity. Because the lungs cannot fully expand, all of the static lung volumes are scaled down. This is the defining physiology of restriction, a smaller container, in contrast to obstruction where volumes are often increased by air trapping.' },
        { id: 'kp2', weight: 2, description: 'Restrictive disease may still have normal resistance and a normal FEV1/FVC ratio. Since the airways themselves are not narrowed, resistance stays normal, and because FEV1 and FVC fall together in proportion, their ratio is preserved. A normal or even elevated FEV1/FVC ratio with reduced volumes is the spirometric signature that points to restriction rather than obstruction.' },
      ],
      common_errors: [
        'Reporting a reduced FEV1/FVC ratio in restriction; it is preserved because both values fall together.',
        'Saying airway resistance is high in restriction when the airways are not the problem.',
        'Claiming total lung capacity rises; restriction reduces total lung capacity and vital capacity.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Restrictive lung volumes and ratio',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Restrictive lung volumes and ratio' },
  },

  {
    id: 'atom-p2w6i-restrictive-intrinsic',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'List the intrinsic restrictive lung diseases and give the characteristic feature or cause noted for each.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Intrinsic restrictive diseases as those arising within the lung tissue itself. Diffuse interstitial pulmonary fibrosis is characterized by thick collagen deposits in the interstitium. Sarcoidosis is characterized by chronic inflammatory granulomas. These intrinsic processes stiffen the lung parenchyma directly, reducing its ability to expand.' },
        { id: 'kp2', weight: 2, description: 'Asbestosis and silicosis are listed together as intrinsic restrictive diseases caused by tissue scarring due to chronic exposure to irritants, the inhaled mineral dusts of asbestos and silica. Like fibrosis and sarcoidosis, they replace compliant lung with stiff scarred tissue, so the common thread among the intrinsic group is direct stiffening or scarring of the lung itself.' },
      ],
      common_errors: [
        'Placing kyphosis, scoliosis, or obesity in the intrinsic group; those are extrinsic.',
        'Mismatching the feature, for example pairing sarcoidosis with collagen instead of granulomas.',
        'Forgetting that asbestosis and silicosis arise from chronic irritant exposure causing scarring.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Intrinsic restrictive diseases',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Intrinsic restrictive diseases' },
  },

  {
    id: 'atom-p2w6i-restrictive-extrinsic',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'List the extrinsic restrictive causes and explain how each restricts the lungs from outside, including the specific neuromuscular diseases named.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Extrinsic restrictive causes act from outside the lung tissue, limiting chest or lung expansion mechanically or neuromuscularly. Pneumothorax causes collapse of the lung due to pressure changes as air enters the pleural space. Kyphosis and scoliosis are posture changes that affect expansion of the chest wall. Obesity hypoventilation syndrome adds external weight that restricts ventilation.' },
        { id: 'kp2', weight: 2, description: 'Muscular pathologies are the neuromuscular extrinsic causes, listed specifically as ALS, muscular dystrophy, and myasthenia gravis. These weaken the respiratory muscles so the bellows cannot expand the lungs, even though the lung tissue itself may be normal. The unifying theme of the extrinsic group is that the restriction originates in the chest wall, pleura, or muscles rather than in the lung parenchyma.' },
      ],
      common_errors: [
        'Listing fibrosis, sarcoidosis, or asbestosis as extrinsic; those are intrinsic lung diseases.',
        'Naming the wrong neuromuscular diseases; ALS, muscular dystrophy, and myasthenia gravis.',
        'Forgetting pneumothorax and obesity hypoventilation as extrinsic restrictive causes.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Extrinsic restrictive causes',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Extrinsic restrictive causes' },
  },

  {
    id: 'atom-p2w6i-pneumothorax-symptoms',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe pneumothorax causes and symptoms, including the usual mechanism, the spontaneous variant and the association under study, and why both lungs do not collapse together.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Pneumothorax as air leaking into the pleural cavity, causing part of the lung to collapse due to pressure changes. It is usually caused by penetrating trauma to the chest but can also occur spontaneously. Current research into an association between vaping and the risk of a spontaneous pneumothorax. Listed symptoms are sudden sharp chest pain and shortness of breath.' },
        { id: 'kp2', weight: 2, description: 'That, fortunately, the two sides of the pleural cavity are separate, so a pneumothorax on one side does not spread to the other. Otherwise both lungs would collapse together. This independence of the right and left pleural spaces is why a unilateral pneumothorax collapses only the affected lung while the opposite lung continues to ventilate.' },
      ],
      common_errors: [
        'Saying both lungs collapse together; the separate pleural sides prevent this.',
        'Omitting the spontaneous variant and the vaping association.',
        'Listing fever and productive cough as symptoms; those belong to pneumonia, not pneumothorax.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pneumothorax causes and symptoms',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Pneumothorax causes and symptoms' },
  },

  {
    id: 'atom-p2w6i-atelectasis-causes',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Define atelectasis and list its four causes, explaining how each leads to collapse.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Atelectasis is as a lack of gas exchange within the alveoli due to the collapse of that portion of the lung. The collapse can be caused by external compression of the lung by air or fluid within the pleural space, by obstruction of airflow within the lung, or by a lack of surfactant in the alveoli. The end result in every case is an airless, non exchanging region of lung.' },
        { id: 'kp2', weight: 2, description: 'The Common Causes of Atelectasis diagram depicts four mechanisms. Hypoventilation lets alveoli gradually empty and collapse. Compression squeezes the lung from outside. Airway obstruction blocks air from reaching alveoli so trapped gas is absorbed and the unit collapses. Adhesions, linked to lack of surfactant, raise surface tension so alveoli cannot stay open. These four are the causes you should name.' },
      ],
      common_errors: [
        'Listing only airway obstruction and surfactant loss while omitting hypoventilation and compression.',
        'Confusing atelectasis causes with hypoxia categories such as anemia or shunt.',
        'Defining atelectasis as fluid filling the alveoli; it is collapse with absent gas exchange.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Atelectasis definition and causes',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Atelectasis definition and causes' },
  },

  {
    id: 'atom-p2w6i-pneumonia-definition-symptoms',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe pneumonia, including the location of fluid and pus, the most common causative organism, the range of possible pathogens, and the listed symptoms.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Pneumonia is as an acute infection of the lungs resulting in inflammation and the accumulation of fluid or pus within the alveoli. The word within is emphasized, locating the exudate inside the air sacs themselves. It may be viral, bacterial, or fungal, and Streptococcus pneumoniae, a bacterium, is the most common cause. It can also develop after another illness such as a cold or the flu.' },
        { id: 'kp2', weight: 2, description: 'Pneumonia symptoms as a cough that is usually a productive cough with phlegm, along with fever, chills, chest pain, and shortness of breath. The productive nature of the cough reflects the fluid and pus filling the alveoli. These constitutional and respiratory symptoms help distinguish pneumonia from the dry reversible wheeze of asthma or the traumatic sharp pain of pneumothorax.' },
      ],
      common_errors: [
        'Saying fluid collects outside the alveoli; it accumulates within the alveoli.',
        'Naming a virus as the most common cause; Streptococcus pneumoniae bacteria are most common.',
        'Describing the cough as dry; pneumonia typically causes a productive cough with phlegm.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pneumonia definition and symptoms',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Pneumonia definition and symptoms' },
  },

  {
    id: 'atom-p2w6i-pneumonia-vs-atelectasis-sat',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Contrast why pneumonia produces a large fall in arterial saturation while atelectasis produces only a small fall, using Figures 43-6 and 43-7 and the mean saturation values.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'In pneumonia, blood continues to flow at normal rate through the affected lung but the alveoli are filled with fluid and cannot oxygenate it, so that blood leaves only 60% saturated. With half the cardiac output from the good lung at 97% and half from the bad lung at 60%, the aortic mean saturation falls markedly to 78%. Flowing blood past unventilated alveoli is the key, a venous admixture effect.' },
        { id: 'kp2', weight: 2, description: 'In atelectasis, the collapsed lung receives much less blood flow, only about one fifth of normal, because the collapse and hypoxic vasoconstriction divert blood away. So although that small flow leaves 60% saturated, it is a tiny fraction. With five sixths of blood at 97% and one sixth at 60%, the mean saturation falls only slightly to 91%. Diverting blood away from the collapsed region is what limits the desaturation.' },
      ],
      common_errors: [
        'Reversing the values; pneumonia mean is 78% and atelectasis mean is 91%.',
        'Saying blood flow stops in pneumonia; it continues, which is why the saturation drops so much.',
        'Forgetting that atelectatic lung receives only about one fifth normal flow, limiting the desaturation.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pneumonia versus atelectasis saturation',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Pneumonia versus atelectasis saturation' },
  },

  {
    id: 'atom-p2w6i-constricted-terminology',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Explain why Guyton and Hall label the right side curve  as constricted lungs, how this legacy term maps to modern terminology, and what spirometric features the curve actually shows.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Guyton and Hall use the archaic word constricted as a literal physical description of a lung that is bound up or squeezed, whether from inside by fibrosis or silicosis or from outside by chest cage problems like scoliosis or kyphosis. The original text chose constricted to avoid confusion with airway obstruction such as asthma. This is institutional legacy phrasing unique to Guyton, not the modern clinical label.' },
        { id: 'kp2', weight: 2, description: 'The modern clinical translation is that the Guyton constricted lungs curve is simply a restrictive lung profile, equivalent to pulmonary fibrosis or scoliosis in the obstructive versus restrictive taxonomy. it sits shifted to the right because total lung capacity and residual volume are greatly reduced, so the smaller container moves the whole curve toward smaller volumes while keeping a near normal shape. Students should mentally cross out constricted and read restrictive.' },
      ],
      common_errors: [
        'Treating constricted lungs as a separate disease rather than Guyton legacy wording for restrictive lungs.',
        'Confusing constricted with airway constriction or obstruction such as asthma.',
        'Saying the constricted curve shifts left; it shifts right toward smaller reduced volumes.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Constricted lungs terminology',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Constricted lungs terminology' },
  },

  {
    id: 'atom-p2w6i-histology-contrast',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Contrast the microscopic appearance of normal lung, pneumonia, and emphysema, stating what fills or is lost in each.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Three panels. Normal lung is a fine even honeycomb of small alveoli. The pneumonia panel shows inflammation with the alveoli filled by fluid and blood cells and surrounding edema, so the air spaces are flooded rather than destroyed. Pneumonia as inflammation and fluid in the lungs, an additive filling process inside intact alveoli.' },
        { id: 'kp2', weight: 2, description: 'The emphysema panel shows confluent alveoli, where many small alveoli have merged into a few large empty spaces because the walls and parenchyma are destroyed. Emphysema as loss of alveoli, a subtractive destructive process. So the two diseases are microscopic opposites together, pneumonia filling the air sacs while emphysema destroys and merges them.' },
      ],
      common_errors: [
        'Swapping the panels, calling pneumonia loss of alveoli or emphysema fluid filling.',
        'Describing emphysema as scarring with collagen rather than confluent destroyed air spaces.',
        'Forgetting that in pneumonia the alveolar walls remain while the lumen fills with fluid.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pneumonia versus emphysema histology',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 43', topic: 'Pneumonia versus emphysema histology' },
  },

  /* audit gap-fill round 2 atoms */

  {
    id: 'atom-p2w5t-o2-quantities',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'State the normal whole body oxygen consumption and explain why dissolved oxygen alone is insufficient, then give the oxygen carrying capacity of hemoglobin and the normal and anemic arterial oxygen content. Explain how these quantities fit together.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The body consumes about 250 mL of oxygen per minute at rest. Oxygen physically dissolved in plasma is tiny, only about 0.003 mL of oxygen per 100 mL of blood per mm Hg of PO2, so at a normal arterial PO2 the dissolved fraction supplies nowhere near the 250 mL per minute the body needs. Dissolved oxygen alone would be insufficient, which is why hemoglobin is required; about 97 percent of the oxygen carried in blood is bound to hemoglobin and only about 3 percent is dissolved.' },
        { id: 'kp2', weight: 2, description: 'Each gram of fully saturated hemoglobin carries about 1.34 mL of oxygen. With a normal hemoglobin of about 15 g per 100 mL of blood, the oxygen content is about 20 mL of oxygen per 100 mL of blood when fully saturated. In anemia with hemoglobin about 10 g per 100 mL, the content falls to about 13 mL of oxygen per 100 mL even though arterial PO2 and saturation may be normal, which shows that oxygen content depends on the hemoglobin concentration, not on PO2 alone.' },
      ],
      common_errors: [
        'Assuming dissolved oxygen can meet the resting consumption of about 250 mL per minute (it cannot, hemoglobin is required)',
        'Confusing oxygen saturation, which can be normal in anemia, with oxygen content, which falls when hemoglobin is low',
        'Forgetting that each gram of hemoglobin carries about 1.34 mL of oxygen',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Oxygen carrying quantities',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Oxygen carrying quantities' },
  },

  {
    id: 'atom-p2w5t-dissociation-landmarks',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-5',
    prompt: 'Reproduce the landmark values of the oxygen hemoglobin dissociation curve and the memory rule used to recall them. Give the saturation and oxygen content at the key oxygen partial pressures, and state the rule that links three partial pressures to three saturations for a person with normal hemoglobin.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The values to remember on the dissociation curve, for a person with about 15 g per dL hemoglobin, are: at a PO2 of 0 the saturation is 0 percent and the content 0 mL per dL; at a PO2 of 20 the saturation is about 25 percent and the content about 5 mL per dL; at a PO2 of 40, the normal mixed venous point, the saturation is about 75 percent and the content about 15 mL per dL; and at a PO2 of 100, the normal arterial point, the saturation is about 100 percent and the content about 20 mL per dL.' },
        { id: 'kp2', weight: 2, description: 'The 4,5,6 to 7,8,9 rule summarizes the steep middle of the curve for normal hemoglobin: a PO2 of 40, 50, and 60 mm Hg corresponds to a saturation of about 70, 80, and 90 percent. The curve is sigmoid: nearly flat above a PO2 of about 70 to 100 mm Hg, where hemoglobin stays highly saturated and a high PO2 adds little, and steep between about 10 and 50 mm Hg, where small falls in PO2 unload large amounts of oxygen to the tissues. For example a PO2 of 60 still gives a saturation of about 89 to 90 percent.' },
      ],
      common_errors: [
        'Misreading the venous point: a PO2 of 40 gives about 75 percent saturation and 15 mL per dL content, not full saturation',
        'Stating the 4,5,6 to 7,8,9 rule backward; the partial pressures 40, 50, 60 map to saturations 70, 80, 90',
        'Treating the curve as a straight line rather than a sigmoid that is flat at high PO2 and steep in the middle',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Dissociation curve landmarks',
    chapter: 'pp2-wk-5',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 41', topic: 'Dissociation curve landmarks' },
  },

  {
    id: 'atom-p2w6r-chemoreflex-output',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-phys-path-2',
    nodeId: 'pp2-wk-6',
    prompt: 'Describe the systemic reflex response produced by stimulation of the arterial chemoreceptors, as distinct from where those receptors sit and what they sense. State the two main systemic effects and explain how they help defend oxygen delivery during hypoxemia.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Stimulation of the arterial chemoreceptors, the carotid and aortic bodies, by a fall in arterial oxygen produces a reflex hyperpnea, an increase in the rate and depth of breathing that raises alveolar ventilation and works to restore the arterial oxygen level. This is the ventilatory output of the peripheral chemoreceptor reflex, which is separate from the receptor location and from the low oxygen stimulus that triggers it.' },
        { id: 'kp2', weight: 2, description: 'Along with the increase in ventilation, arterial chemoreceptor stimulation also reflexly raises the blood pressure. The combined response, more ventilation plus a higher blood pressure, improves both the uptake of oxygen in the lungs and the delivery of oxygenated blood to the tissues, so the two effects work together to defend tissue oxygenation during hypoxemia.' },
      ],
      common_errors: [
        'Listing only the increase in ventilation and omitting the reflex rise in blood pressure',
        'Confusing the systemic reflex output with the receptor location or the low oxygen stimulus',
        'Attributing the hyperpnea and pressor response to the central chemoreceptors rather than the peripheral arterial chemoreceptors',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Chemoreceptor reflex output',
    chapter: 'pp2-wk-6',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Guyton & Hall 14e, Ch 42', topic: 'Chemoreceptor reflex output' },
  },

  // ===== ap1-wk-4 Anticoagulants atoms =====

  {
    id: 'atom-aca-three-phases',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Name the three overlapping phases of hemostasis in order and state the single defining event of the vascular phase.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Hemostasis is how the body stops bleeding and unfolds in three overlapping phases in this order: the vascular phase, primary hemostasis, and secondary hemostasis. They overlap rather than running strictly sequentially, but conceptually the vascular response comes first, the platelet plug second, and fibrin stabilization third.' },
        { id: 'kp2', weight: 2, description: 'The vascular phase is reflex vasoconstriction that reduces blood flow to the site of injury. By narrowing the vessel it limits blood loss immediately and slows delivery of blood to the wound, setting the stage for the platelet plug and the coagulation cascade that follow.' },
      ],
      common_errors: [
        'Listing fibrinolysis as one of the three hemostatic phases',
        'Calling the vascular phase vasodilation instead of vasoconstriction',
        'Putting secondary hemostasis before primary hemostasis',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Three phases of hemostasis',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Three phases of hemostasis' },
  },

  {
    id: 'atom-aca-primary-secondary-product',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Contrast primary and secondary hemostasis by what each produces and its approximate time course.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Primary hemostasis is platelets forming a soft plug, occurring on a timescale of seconds to minutes. It is the fast, first structural response that physically plugs the injury but is not yet a stable clot.' },
        { id: 'kp2', weight: 2, description: 'Secondary hemostasis is the coagulation cascade stabilizing that soft plug with fibrin, occurring over minutes. It is slower than primary hemostasis and its product is the fibrin mesh that converts the soft plug into a durable clot.' },
      ],
      common_errors: [
        'Saying secondary hemostasis forms the initial platelet plug',
        'Claiming primary hemostasis lays down fibrin',
        'Stating secondary hemostasis is faster than primary',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Primary versus secondary hemostasis',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Primary versus secondary hemostasis' },
  },

  {
    id: 'atom-aca-platelet-three-steps',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'List the three ordered actions platelets perform during primary hemostasis.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Platelets do three things in a strict order: adhere, then activate, then aggregate. This sequence is the backbone of primary hemostasis and each step has its own receptor biology and corresponding drug targets.' },
        { id: 'kp2', weight: 2, description: 'Adhesion anchors platelets to the injured wall, activation triggers granule release and shape change, and aggregation crosslinks platelets into the growing plug. Keeping the order straight matters because drugs are mapped onto specific steps.' },
      ],
      common_errors: [
        'Reversing activate and adhere in the sequence',
        'Putting aggregate before activate',
        'Omitting the activation step entirely',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Primary hemostasis steps',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Primary hemostasis steps' },
  },

  {
    id: 'atom-aca-adhesion-vwf',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain platelet adhesion: which molecule bridges the platelet to what surface, and through which receptor.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'During adhesion, von Willebrand factor bridges platelets to exposed subendothelial collagen. When endothelium is injured, the underlying collagen is exposed and vWF acts as the molecular glue linking the platelet to that collagen.' },
        { id: 'kp2', weight: 2, description: 'The platelet side of this bridge is the GP Ib receptor. vWF binds GP Ib on the platelet surface and collagen on the wall, which is why deficiency of vWF or GP Ib impairs adhesion and causes a bleeding tendency.' },
      ],
      common_errors: [
        'Attributing adhesion to fibrinogen and GP IIb/IIIa',
        'Saying platelets adhere directly to collagen without vWF',
        'Confusing GP Ib with GP IIb/IIIa',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Platelet adhesion',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Platelet adhesion' },
  },

  {
    id: 'atom-aca-granule-release',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Name the three mediators released from platelet granules upon activation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'When platelets activate, their granules release three mediators: adenosine diphosphate, thromboxane A2, and serotonin. These signals are released into the local environment to amplify the hemostatic response.' },
        { id: 'kp2', weight: 2, description: 'ADP recruits and activates additional platelets via P2Y12, thromboxane A2 amplifies platelet activation, and serotonin contributes to vasoconstriction and platelet effects. This release step is what antiplatelet drugs aim to blunt downstream.' },
      ],
      common_errors: [
        'Including tissue factor among the granule contents',
        'Listing fibrinogen as a released activation mediator',
        'Forgetting serotonin as one of the three',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Platelet granule release',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Platelet granule release' },
  },

  {
    id: 'atom-aca-aggregation-gp2b3a',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain platelet aggregation: which receptor is exposed and what molecule crosslinks platelets.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'During aggregation, activated platelets expose the GP IIb/IIIa receptor on their surface. This receptor is the platelet\'s binding site for fibrinogen and becomes available only after activation, which is why aggregation follows activation.' },
        { id: 'kp2', weight: 2, description: 'Fibrinogen crosslinks adjacent platelets by bridging their GP IIb/IIIa receptors, binding them together into the aggregate. This is the final common pathway of platelet aggregation and the target of GP IIb/IIIa antagonist drugs.' },
      ],
      common_errors: [
        'Saying GP Ib mediates aggregation',
        'Claiming collagen crosslinks platelets during aggregation',
        'Stating vWF is the aggregation crosslinker',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Platelet aggregation',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Platelet aggregation' },
  },

  {
    id: 'atom-aca-cox1-aspirin',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State what COX-1 produces, its role in platelets, and the drug that blocks it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Cyclooxygenase-1 makes thromboxane A2, which amplifies platelet activation. Thromboxane A2 is a positive-feedback signal that recruits and activates more platelets at the site of injury.' },
        { id: 'kp2', weight: 2, description: 'Aspirin blocks COX-1, shutting off thromboxane A2 production and therefore blunting platelet activation amplification. This is one of the three drug families mapped onto the activated platelet, each tied to a distinct receptor or enzyme.' },
      ],
      common_errors: [
        'Saying COX-1 makes ADP rather than thromboxane A2',
        'Attributing COX-1 blockade to clopidogrel',
        'Claiming aspirin blocks GP IIb/IIIa',
      ],
      minimum_passing_score: 60,
    },
    topic: 'COX-1 and aspirin',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'COX-1 and aspirin' },
  },

  {
    id: 'atom-aca-p2y12-drugs',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State what the P2Y12 receptor does and name the three drugs that block it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'P2Y12 is the ADP-driven platelet recruitment receptor. ADP released from activated platelets binds P2Y12 on adjacent platelets to recruit them, amplifying thrombosis in a positive-feedback loop.' },
        { id: 'kp2', weight: 2, description: 'Three drugs block P2Y12: clopidogrel, prasugrel, and ticagrelor. Blocking this receptor breaks the ADP recruitment loop, and this family is one of the three antiplatelet drug groups tied to a specific platelet target.' },
      ],
      common_errors: [
        'Saying P2Y12 responds to thromboxane rather than ADP',
        'Listing aspirin as a P2Y12 inhibitor',
        'Forgetting ticagrelor among the three agents',
      ],
      minimum_passing_score: 60,
    },
    topic: 'P2Y12 inhibitors',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'P2Y12 inhibitors' },
  },

  {
    id: 'atom-aca-gp2b3a-drugs',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State what GP IIb/IIIa does and name the three drugs that block it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'GP IIb/IIIa is the fibrinogen-crosslinking receptor and represents the final common pathway of platelet aggregation. Because every aggregation route funnels through this receptor, blocking it stops aggregation regardless of the upstream stimulus.' },
        { id: 'kp2', weight: 2, description: 'Three drugs block GP IIb/IIIa: abciximab, eptifibatide, and tirofiban. These are the third antiplatelet family, acting at the most downstream step of platelet aggregation.' },
      ],
      common_errors: [
        'Saying GP IIb/IIIa is upstream of P2Y12',
        'Listing aspirin or clopidogrel as a GP IIb/IIIa blocker',
        'Omitting tirofiban from the three agents',
      ],
      minimum_passing_score: 60,
    },
    topic: 'GP IIb/IIIa antagonists',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'GP IIb/IIIa antagonists' },
  },

  {
    id: 'atom-aca-intrinsic-pathway',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe the intrinsic pathway: its factor sequence, its trigger, and the lab that measures it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The intrinsic pathway runs factor XII to XI to IX, which then activates factor X. It is triggered by contact with foreign surfaces, which is why it is sometimes called the contact pathway.' },
        { id: 'kp2', weight: 2, description: 'The intrinsic pathway is measured by the activated partial thromboplastin time (aPTT). This makes the aPTT the relevant monitoring test for therapeutic heparin, which acts heavily on this pathway and the common pathway.' },
      ],
      common_errors: [
        'Saying the intrinsic pathway is measured by the prothrombin time',
        'Claiming tissue injury triggers the intrinsic pathway',
        'Reversing the XII to XI to IX order',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Intrinsic pathway',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Intrinsic pathway' },
  },

  {
    id: 'atom-aca-extrinsic-pathway',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe the extrinsic pathway: its components, its trigger, and the lab that measures it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The extrinsic pathway is tissue factor plus factor VII activating factor X. It is triggered by tissue injury, which exposes tissue factor to the blood and rapidly initiates coagulation.' },
        { id: 'kp2', weight: 2, description: 'The extrinsic pathway is measured by the prothrombin time. Because warfarin most strongly lowers factor VII, the PT and its derived INR are the standard warfarin monitoring tests.' },
      ],
      common_errors: [
        'Saying the extrinsic pathway is measured by the aPTT',
        'Claiming foreign-surface contact triggers the extrinsic pathway',
        'Omitting tissue factor as a required component',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Extrinsic pathway',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Extrinsic pathway' },
  },

  {
    id: 'atom-aca-convergence-x',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State where the intrinsic and extrinsic pathways converge and what marks the start of the common pathway.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Both the intrinsic and extrinsic pathways activate factor X, so factor X is the point of convergence. The two entry points of the cascade thus funnel into a single shared downstream route.' },
        { id: 'kp2', weight: 2, description: 'From factor X onward, the rest of the cascade is the common pathway. Once factor Xa is generated, the question of anticoagulation reduces to how to control Xa and thrombin, regardless of which pathway started the process.' },
      ],
      common_errors: [
        'Saying the pathways converge at factor II',
        'Claiming the common pathway starts at factor VII',
        'Listing factor XII as the convergence point',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pathway convergence',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Pathway convergence' },
  },

  {
    id: 'atom-aca-xa-to-thrombin',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the direct enzymatic conversion carried out by factor Xa in the common pathway.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Factor Xa converts prothrombin, which is factor II, into thrombin, which is factor IIa. This is the pivotal step that generates the central effector enzyme of coagulation.' },
        { id: 'kp2', weight: 2, description: 'Because Xa sits at the convergence point and drives thrombin generation, it is a prime anticoagulant target. Direct Xa inhibitors and heparin-amplified antithrombin both act to limit this Xa-to-thrombin step.' },
      ],
      common_errors: [
        'Saying Xa converts fibrinogen to fibrin',
        'Claiming Xa activates plasminogen',
        'Stating Xa converts factor XII to XI',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Common pathway Xa',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Common pathway Xa' },
  },

  {
    id: 'atom-aca-thrombin-to-fibrin',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the direct action of thrombin in the common pathway and what the product does.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Thrombin, factor IIa, converts fibrinogen into fibrin. This is the defining catalytic action of thrombin and the chemical step that produces the structural protein of the clot.' },
        { id: 'kp2', weight: 2, description: 'Fibrin stabilizes the platelet plug, turning the soft primary plug into a real, durable clot. Thrombin is thus the final amplifier of the cascade, which is why direct thrombin inhibitors are an important anticoagulant class.' },
      ],
      common_errors: [
        'Saying thrombin converts prothrombin to thrombin',
        'Claiming thrombin activates factor X',
        'Reversing the reaction to fibrin into fibrinogen',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Common pathway thrombin',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Common pathway thrombin' },
  },

  {
    id: 'atom-aca-three-mechanisms',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the three and only three things every clinically useful anticoagulant does.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Every clinically useful anticoagulant does one of three things: it blocks factor Xa, it blocks factor IIa (thrombin), or it stops the liver from making the clotting factors. This is the entire conceptual framework for the drug classes.' },
        { id: 'kp2', weight: 2, description: 'Crucially, anticoagulants do not dissolve an existing clot; dissolving fibrin is the job of the fibrinolytic system and thrombolytic drugs. Keeping anticoagulation separate from fibrinolysis prevents the common error of expecting an anticoagulant to lyse clot.' },
      ],
      common_errors: [
        'Listing direct clot dissolution as an anticoagulant action',
        'Adding platelet inhibition as a fourth core anticoagulant mechanism here',
        'Omitting the hepatic synthesis mechanism (warfarin)',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Anticoagulant framework',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Anticoagulant framework' },
  },

  {
    id: 'atom-aca-xa-iia-targets',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Identify the two molecules the common pathway reduces to and the role of each.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Factor Xa is the convergence point of both the intrinsic and extrinsic pathways. Because everything funnels through Xa, it is the upstream molecule that anticoagulants frequently target.' },
        { id: 'kp2', weight: 2, description: 'Factor IIa (thrombin) is the final amplifier that cleaves fibrinogen into fibrin. Reducing the cascade to just Xa and IIa gives a clean mental model: useful anticoagulants block one or both of these, or block their hepatic synthesis.' },
      ],
      common_errors: [
        'Naming factors XII and VII as the two key molecules',
        'Calling fibrinogen one of the two target molecules',
        'Confusing which of Xa and IIa is the convergence point versus final amplifier',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Two key molecules',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Two key molecules' },
  },

  {
    id: 'atom-aca-antithrombin-serpin',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Classify antithrombin and list the factors it inhibits on its own.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Antithrombin is a circulating serpin, a serine protease inhibitor, and is one of the body\'s own brakes on the coagulation cascade. It works by inhibiting active clotting enzymes rather than activating them.' },
        { id: 'kp2', weight: 2, description: 'On its own and slowly, antithrombin inhibits factors IIa, Xa, IXa, XIa, and XIIa. This broad set of serine-protease targets is why amplifying antithrombin with heparin produces such powerful anticoagulation.' },
      ],
      common_errors: [
        'Calling antithrombin a cofactor that activates clotting factors',
        'Limiting antithrombin targets to only IIa and Xa',
        'Describing antithrombin as a zymogen',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Antithrombin',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Antithrombin' },
  },

  {
    id: 'atom-aca-heparin-amplification',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State by how much heparin amplifies antithrombin and why an antithrombin-deficient patient resists heparin.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Heparin amplifies the antithrombin reaction by 1000 to 10000 fold. Heparin itself is not the direct inhibitor; it dramatically accelerates antithrombin\'s inhibition of clotting factors.' },
        { id: 'kp2', weight: 2, description: 'Because heparin works only through antithrombin, a patient who is antithrombin-deficient will not respond to heparin, a state called heparin resistance. The fix is to restore antithrombin with antithrombin concentrate or fresh frozen plasma.' },
      ],
      common_errors: [
        'Quoting only a 10 to 100 fold amplification',
        'Saying heparin directly inhibits factors without antithrombin',
        'Attributing heparin resistance to protein C deficiency',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Heparin and antithrombin',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Heparin and antithrombin' },
  },

  {
    id: 'atom-aca-protein-c-s',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe how proteins C and S are activated, what they inactivate, and their vitamin K dependence.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Protein C and protein S are activated by the thrombin-thrombomodulin complex. Once activated, they cleave and inactivate factors Va and VIIIa, removing key accelerators of the cascade and thus serving as a natural brake.' },
        { id: 'kp2', weight: 2, description: 'Both protein C and protein S are vitamin K dependent. This dependence is clinically pivotal because it means warfarin lowers these natural anticoagulants as well as the procoagulant factors, setting up warfarin\'s early procoagulant phase.' },
      ],
      common_errors: [
        'Saying proteins C and S inactivate factors IIa and Xa',
        'Claiming tissue factor VIIa activates protein C',
        'Stating proteins C and S are not vitamin K dependent',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Protein C and S',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Protein C and S' },
  },

  {
    id: 'atom-aca-tfpi',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State what tissue factor pathway inhibitor does.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Tissue factor pathway inhibitor shuts down the tissue factor / factor VIIa complex. By neutralizing this complex, TFPI brakes the extrinsic trigger of coagulation at its initiating step.' },
        { id: 'kp2', weight: 2, description: 'TFPI is one of the body\'s natural brake systems on the cascade, alongside antithrombin and the protein C / protein S system. Its target, the tissue factor VIIa complex, distinguishes it from antithrombin and from protein C, which act elsewhere.' },
      ],
      common_errors: [
        'Saying TFPI inhibits the thrombin-thrombomodulin complex',
        'Claiming TFPI inactivates factors Va and VIIIa',
        'Confusing TFPI\'s target with antithrombin\'s targets',
      ],
      minimum_passing_score: 60,
    },
    topic: 'TFPI',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'TFPI' },
  },

  {
    id: 'atom-aca-procoagulant-basis',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain why the vitamin K dependence of proteins C and S matters for warfarin.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Proteins C and S are vitamin K dependent natural anticoagulants. Warfarin, by interfering with vitamin K, lowers the levels of these anticoagulant proteins along with the procoagulant factors.' },
        { id: 'kp2', weight: 2, description: 'Because some natural anticoagulants fall early, warfarin has an initial procoagulant phase rather than producing immediate anticoagulation. This is the conceptual basis for warfarin-induced skin necrosis in protein C deficient patients and for heparin bridging.' },
      ],
      common_errors: [
        'Attributing warfarin\'s procoagulant phase to heparin resistance',
        'Saying the procoagulant phase comes from TFPI deficiency',
        'Claiming the effect prolongs the aPTT specifically',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Procoagulant phase basis',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Procoagulant phase basis' },
  },

  {
    id: 'atom-aca-vitk-six-proteins',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'List all six vitamin K dependent proteins, grouped as procoagulant and anticoagulant.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Six proteins require vitamin K dependent gamma-carboxylation to function. The procoagulant members are factors II, VII, IX, and X.' },
        { id: 'kp2', weight: 2, description: 'The anticoagulant vitamin K dependent proteins are protein C and protein S. Knowing the full set, II, VII, IX, X, C, and S, explains why warfarin affects both clotting and natural anticoagulant arms.' },
      ],
      common_errors: [
        'Including factor V or factor VIII as vitamin K dependent',
        'Including fibrinogen (factor I) in the list',
        'Listing only the four procoagulant factors and omitting proteins C and S',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Vitamin K dependent factors',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Vitamin K dependent factors' },
  },

  {
    id: 'atom-aca-gamma-carboxylation',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State what gamma-carboxylation adds to a clotting factor and the consequence of its absence.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Gamma-carboxylation adds a calcium-binding tail to the clotting factor. This post-translational modification is what allows the factor to bind calcium and anchor to phospholipid surfaces during the cascade.' },
        { id: 'kp2', weight: 2, description: 'Without gamma-carboxylation, the factor is still synthesized but cannot bind calcium and therefore cannot participate in the cascade. This explains why warfarin produces non-functional factors rather than simply reducing factor protein levels.' },
      ],
      common_errors: [
        'Saying gamma-carboxylation adds a heparin-binding site',
        'Claiming the un-carboxylated factor is never synthesized',
        'Stating the defect prevents fibrin binding rather than calcium binding',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Gamma-carboxylation',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Gamma-carboxylation' },
  },

  {
    id: 'atom-aca-vkor-warfarin',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the enzyme that recycles vitamin K and the drug that blocks it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Vitamin K epoxide reductase is the enzyme that recycles vitamin K, regenerating the active form needed for gamma-carboxylation. Without recycling, the supply of usable vitamin K is exhausted.' },
        { id: 'kp2', weight: 2, description: 'Warfarin blocks vitamin K epoxide reductase, and that single mechanism explains everything about warfarin, including its delayed onset and early procoagulant phase. Without recycled vitamin K, the liver cannot gamma-carboxylate the dependent factors.' },
      ],
      common_errors: [
        'Saying warfarin blocks cyclooxygenase-1',
        'Claiming warfarin inhibits antithrombin synthesis',
        'Stating warfarin blocks tissue plasminogen activator',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Warfarin target enzyme',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Warfarin target enzyme' },
  },

  {
    id: 'atom-aca-tpa-plasmin',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State where tPA comes from and the conversion it catalyzes in fibrinolysis.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Tissue plasminogen activator is released from the endothelium. It is the physiological initiator of fibrinolysis once a clot has formed, providing the machinery to dissolve clot.' },
        { id: 'kp2', weight: 2, description: 'tPA converts plasminogen, an inactive zymogen, into plasmin, the active enzyme. This activation step is the rate-limiting trigger of clot breakdown and is precisely the step that antifibrinolytic lysine analogs block.' },
      ],
      common_errors: [
        'Saying tPA converts plasmin back to plasminogen',
        'Claiming tPA converts fibrinogen to fibrin',
        'Stating tPA is released from platelets rather than endothelium',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Fibrinolysis mechanism',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Fibrinolysis mechanism' },
  },

  {
    id: 'atom-aca-plasmin-action',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the direct action of plasmin in fibrinolysis.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Plasmin cleaves fibrin and breaks the clot apart. It is the active effector enzyme of fibrinolysis, digesting the fibrin meshwork that holds a clot together.' },
        { id: 'kp2', weight: 2, description: 'Because plasmin is the enzyme that actually degrades fibrin, blocking its generation from plasminogen preserves an existing clot. This is why antifibrinolytic drugs act upstream at plasminogen activation rather than on plasmin clot digestion directly.' },
      ],
      common_errors: [
        'Saying plasmin builds fibrin from fibrinogen',
        'Claiming plasmin activates antithrombin',
        'Stating plasmin generates thrombin from prothrombin',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Plasmin action',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Plasmin action' },
  },

  {
    id: 'atom-aca-txa-mechanism',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain how tranexamic acid works at the molecular level and what it does to an existing clot.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Tranexamic acid is a lysine analog that competitively blocks the lysine-binding site on plasminogen. With that site occupied, plasminogen cannot bind fibrin and tissue plasminogen activator cannot convert it to plasmin.' },
        { id: 'kp2', weight: 2, description: 'The net result is less plasmin, therefore less fibrin breakdown and a preserved clot. TXA does not create new clot; it preserves the clot already present, which is the key concept for its use as an antifibrinolytic.' },
      ],
      common_errors: [
        'Saying TXA blocks the active site on thrombin',
        'Claiming TXA creates new clot rather than preserving existing clot',
        'Stating TXA blocks the fibrinogen receptor on platelets',
      ],
      minimum_passing_score: 60,
    },
    topic: 'TXA mechanism',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'TXA mechanism' },
  },

  {
    id: 'atom-aca-eaca-and-indications',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Compare epsilon-aminocaproic acid with tranexamic acid and list the clinical settings where TXA is used.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Epsilon-aminocaproic acid, also called Amicar, shares the same lysine-analog mechanism as tranexamic acid, blocking the plasminogen lysine-binding site, but it is weaker than TXA. Both are antifibrinolytics that preserve clot.' },
        { id: 'kp2', weight: 2, description: 'TXA is used in trauma, cardiac surgery, postpartum hemorrhage, and joint arthroplasty. These are bleeding-heavy settings where preserving formed clot reduces blood loss, which is why TXA features in massive transfusion and surgical bleeding protocols.' },
      ],
      common_errors: [
        'Saying EACA is more potent than TXA',
        'Claiming EACA has a different mechanism from TXA',
        'Listing pulmonary embolism dissolution as a TXA indication',
      ],
      minimum_passing_score: 60,
    },
    topic: 'EACA and TXA indications',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'EACA and TXA indications' },
  },

  {
    id: 'atom-acb-pt-inr-pathway',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State what pathway the prothrombin time and INR measure, which single factor the PT is most sensitive to, and which drug it monitors.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The prothrombin time and INR reflect the extrinsic plus common pathway. The extrinsic pathway is triggered by tissue factor activating factor VII, which then activates factor X into the shared common pathway. Because the PT samples this branch, it is the standard laboratory monitor for warfarin therapy, with the INR normalizing results across laboratories.' },
        { id: 'kp2', weight: 2, description: 'The PT is most sensitive to factor VII, the extrinsic factor with the shortest half-life. This sensitivity explains why the INR begins to rise early after warfarin is started, even before the patient is truly anticoagulated, because factor VII activity drops first while longer-lived factors like II persist.' },
      ],
      common_errors: [
        'Saying the PT measures the intrinsic pathway, which is actually the aPTT',
        'Claiming the PT is most sensitive to factor II or fibrinogen rather than factor VII',
        'Confusing PT/INR as the heparin monitor instead of the warfarin monitor',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Coagulation labs',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Coagulation labs' },
  },

  {
    id: 'atom-acb-aptt-pathway',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Identify which pathway the activated partial thromboplastin time measures and which therapeutic anticoagulant it is the classic test for.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The aPTT reflects the intrinsic plus common pathway. The intrinsic pathway proceeds from factor XII to XI to IX, which then activates factor X into the common pathway. The aPTT is sensitive to abnormalities anywhere along this combined route, which is why it is used to detect the effect of unfractionated heparin.' },
        { id: 'kp2', weight: 2, description: 'The aPTT is the classic therapeutic heparin test, appropriate for prophylactic and low-dose therapeutic ranges. It is distinct from the PT/INR which monitors warfarin, and from the ACT which is reserved for the very high heparin concentrations of cardiopulmonary bypass where the aPTT runs off-scale.' },
      ],
      common_errors: [
        'Stating the aPTT measures the extrinsic pathway, which is the PT instead',
        'Calling the aPTT the warfarin test rather than the heparin test',
        'Believing the aPTT remains useful at full bypass heparin concentrations',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Coagulation labs',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Coagulation labs' },
  },

  {
    id: 'atom-acb-act-bypass-lab',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe what the activated clotting time measures, the sample type it uses, and the clinical setting it is built for.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The activated clotting time measures whole-blood clotting at very high heparin concentrations. Unlike plasma-based tests, it uses whole blood so it can be run at the point of care, and it remains calibrated at heparin levels far above therapeutic, where plasma tests saturate.' },
        { id: 'kp2', weight: 2, description: 'The ACT is the cardiopulmonary bypass test. On bypass, heparin runs at concentrations several times therapeutic, and the ACT is the bedside measure that confirms adequate anticoagulation before and during the procedure. It is not used to fine-tune prophylactic or low-dose therapeutic heparin, which is the job of the aPTT.' },
      ],
      common_errors: [
        'Describing the ACT as a plasma-based test rather than whole-blood',
        'Using the ACT to monitor prophylactic low-dose heparin instead of bypass',
        'Confusing the ACT with the anti-Xa assay as the bypass monitor',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Coagulation labs',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Coagulation labs' },
  },

  {
    id: 'atom-acb-anti-xa-assay',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain what the anti-factor Xa assay measures directly and list the three drug categories it is used to monitor.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The anti-factor Xa assay is a direct measure of factor Xa inhibition. Rather than inferring anticoagulant effect from a clotting time, it quantifies how much factor Xa activity is being suppressed, which makes it the precise tool for agents whose primary action is on Xa.' },
        { id: 'kp2', weight: 2, description: 'It is used for low-molecular-weight heparin, fondaparinux, and the direct factor Xa inhibitors. These agents all act predominantly on factor Xa, so a Xa-specific assay is the rational monitor. For LMWH and fondaparinux this is the level used when monitoring is needed, and for the direct Xa inhibitors a drug-specific calibrated anti-Xa assay is required.' },
      ],
      common_errors: [
        'Saying the anti-Xa assay measures thrombin inhibition instead of Xa',
        'Using the anti-Xa assay for dabigatran, which needs a thrombin-based test',
        'Forgetting fondaparinux as one of the anti-Xa monitored drugs',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Direct inhibitor tests',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Direct inhibitor tests' },
  },

  {
    id: 'atom-acb-thrombin-ecarin-time',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State what the thrombin time and ecarin clotting time assess and which oral anticoagulant they are used for.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The thrombin time and ecarin clotting time assess direct thrombin inhibition. They are sensitive to agents that bind and inhibit thrombin (factor IIa) directly, so they reflect the activity of a direct thrombin inhibitor rather than a Xa-acting drug.' },
        { id: 'kp2', weight: 2, description: 'These tests are used for dabigatran, the oral direct thrombin inhibitor. When quantification of dabigatran effect is needed, thrombin-based assays such as the thrombin time, dilute thrombin time, or ecarin clotting time are appropriate, whereas the PT/INR is not useful for it.' },
      ],
      common_errors: [
        'Pairing thrombin time and ecarin time with a factor Xa inhibitor',
        'Using these assays for warfarin instead of PT/INR',
        'Believing the PT/INR is the right test for dabigatran',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Direct inhibitor tests',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Direct inhibitor tests' },
  },

  {
    id: 'atom-acb-lab-identifies-drug',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain the teaching principle that links each coagulation lab to the patient\'s drug class.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Each monitoring test maps to a specific drug class, so the lab identifies what the patient is on. PT/INR points to warfarin, aPTT to therapeutic heparin, the ACT to bypass-level heparin, the anti-Xa assay to LMWH, fondaparinux, or direct Xa inhibitors, and thrombin or ecarin time to dabigatran.' },
        { id: 'kp2', weight: 2, description: 'This mapping is a clinical shortcut: if you can identify the lab being followed, you can identify the drug class even without the medication list. It reframes the coagulation tests as a diagnostic decoder for the patient\'s anticoagulant, which is the practical payoff of memorizing the lab-to-drug pairings.' },
      ],
      common_errors: [
        'Assuming the lab gives an exact plasma drug concentration rather than a class',
        'Mismatching anti-Xa with dabigatran or thrombin time with a Xa inhibitor',
        'Thinking PT/INR identifies heparin rather than warfarin',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Direct inhibitor tests',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Direct inhibitor tests' },
  },

  {
    id: 'atom-acb-ufh-lmwh-ratio',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Contrast unfractionated heparin and low-molecular-weight heparin by their relative anti-Xa versus anti-IIa activity.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Both unfractionated heparin and low-molecular-weight heparin are antithrombin amplifiers, meaning they work by enhancing antithrombin rather than binding factors directly. They sit together as the antithrombin-amplifier class on the anticoagulant drug map.' },
        { id: 'kp2', weight: 2, description: 'Unfractionated heparin has roughly equal anti-Xa and anti-IIa activity, written Xa equals IIa, because its long chains can bridge antithrombin to thrombin. Low-molecular-weight heparin favors anti-Xa over anti-IIa, written Xa greater than IIa, because its shorter chains often cannot bridge to thrombin, which is why LMWH is followed by an anti-Xa level.' },
      ],
      common_errors: [
        'Reversing the ratio and saying UFH is Xa over IIa',
        'Claiming LMWH has no anti-IIa activity at all',
        'Grouping these as direct inhibitors rather than antithrombin amplifiers',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Anticoagulant drug map',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Anticoagulant drug map' },
  },

  {
    id: 'atom-acb-doac-targets',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'On the anticoagulant drug map, name which direct oral inhibitor targets thrombin and which three target factor Xa.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Among the direct oral inhibitors, dabigatran is the single direct thrombin inhibitor. It binds and inhibits factor IIa directly, independent of antithrombin, which distinguishes it mechanistically from the rest of the oral class.' },
        { id: 'kp2', weight: 2, description: 'Rivaroxaban, apixaban, and edoxaban are the three direct factor Xa inhibitors. They bind the active site of factor Xa directly. The split of one thrombin drug versus three Xa drugs is the anchoring framework for the direct oral anticoagulant class.' },
      ],
      common_errors: [
        'Calling rivaroxaban or apixaban a thrombin inhibitor',
        'Listing dabigatran as a factor Xa inhibitor',
        'Forgetting edoxaban as one of the three Xa inhibitors',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Anticoagulant drug map',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Anticoagulant drug map' },
  },

  {
    id: 'atom-acb-warfarin-map-factors',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'On the drug map, state warfarin\'s mechanism category and list all six vitamin K dependent proteins it impairs.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Warfarin sits in the vitamin K interference category on the anticoagulant drug map. Rather than amplifying antithrombin or directly binding a factor, it blocks the regeneration of vitamin K and thereby impairs the gamma-carboxylation that activates several clotting proteins.' },
        { id: 'kp2', weight: 2, description: 'The six vitamin K dependent proteins warfarin affects are the procoagulant factors II, VII, IX, and X plus the anticoagulant proteins C and S. Because proteins C and S are also vitamin K dependent and fall early, warfarin has an initial procoagulant phase, but on the drug map the key point is the full II, VII, IX, X, C, S set.' },
      ],
      common_errors: [
        'Listing fibrinogen or factor V among the vitamin K dependent proteins',
        'Omitting proteins C and S from warfarin\'s affected set',
        'Classifying warfarin as an antithrombin amplifier rather than vitamin K interference',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Anticoagulant drug map',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Anticoagulant drug map' },
  },

  {
    id: 'atom-acb-platelet-inhibitor-targets',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Name the three platelet receptor or enzyme targets on the antiplatelet map and the drug or drug group for each.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Aspirin acts on cyclooxygenase-1, and the P2Y12 receptor is blocked by clopidogrel, prasugrel, and ticagrelor. Aspirin removes thromboxane A2 amplification, while the P2Y12 agents block ADP-driven recruitment of additional platelets.' },
        { id: 'kp2', weight: 2, description: 'The GP IIb/IIIa fibrinogen receptor, the final common pathway of aggregation, is blocked by abciximab, eptifibatide, and tirofiban. Together these three targets, COX-1, P2Y12, and GP IIb/IIIa, organize the entire antiplatelet field into three drug families.' },
      ],
      common_errors: [
        'Assigning aspirin to P2Y12 instead of COX-1',
        'Placing clopidogrel at the GP IIb/IIIa receptor',
        'Listing a DOAC as an antiplatelet agent',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Antiplatelet drug map',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Antiplatelet drug map' },
  },

  {
    id: 'atom-acb-antifibrinolytic-procoagulants',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Identify the two antifibrinolytic procoagulant drugs on the drug map and the general class they belong to.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The two antifibrinolytic procoagulants on the map are tranexamic acid and epsilon-aminocaproic acid. They are grouped as procoagulants on the field map because, by blocking fibrinolysis, they preserve clot that has already formed rather than dissolving it.' },
        { id: 'kp2', weight: 2, description: 'Both are lysine analogs that work by the same mechanism of blocking plasminogen activation, with epsilon-aminocaproic acid being the weaker of the two. They contrast directly with fibrinolytics, which promote clot breakdown, placing TXA and aminocaproic acid on the procoagulant half of the drug map.' },
      ],
      common_errors: [
        'Listing a fibrinolytic such as alteplase as an antifibrinolytic',
        'Calling protamine or vitamin K an antifibrinolytic',
        'Forgetting that both agents share the same lysine-analog mechanism',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Procoagulant drug map',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Procoagulant drug map' },
  },

  {
    id: 'atom-acb-heparin-mechanism',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe heparin\'s mechanism, including its first molecular step, the magnitude of acceleration, and the additional factors inhibited.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Heparin binds circulating antithrombin and changes its conformation. This conformational change is the initiating step; heparin itself is not the enzyme that inactivates clotting factors, but rather a catalyst that supercharges antithrombin, the natural serpin.' },
        { id: 'kp2', weight: 2, description: 'The bound antithrombin accelerates its inhibition of thrombin (factor IIa) by roughly 1,000 to 10,000-fold, and also amplifies inhibition of factors XIIa, XIa, IXa, and Xa. This broad acceleration across the intrinsic proteases and the common pathway is what produces heparin\'s rapid, potent anticoagulant effect.' },
      ],
      common_errors: [
        'Saying heparin inhibits thrombin directly rather than via antithrombin',
        'Understating the acceleration as only a few-fold instead of thousands-fold',
        'Listing factors Va or VIIIa, which are protein C targets, among heparin\'s factors',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Heparin mechanism',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Heparin mechanism' },
  },

  {
    id: 'atom-acb-heparin-resistance',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain why antithrombin deficiency causes heparin resistance and how it is treated.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Heparin works only by amplifying antithrombin, so if the patient is antithrombin-deficient there is insufficient substrate for heparin to act on and the drug fails to anticoagulate despite escalating doses. This is the definition of heparin resistance, a recurring problem in patients on long-term heparin or with congenital deficiency.' },
        { id: 'kp2', weight: 2, description: 'The treatment is to replace antithrombin, using antithrombin concentrate (Thrombate III) or fresh frozen plasma, which supplies the missing serpin so heparin can again work. Simply giving more heparin does not help without antithrombin, and reversal agents like protamine are irrelevant to the deficiency.' },
      ],
      common_errors: [
        'Treating heparin resistance by escalating the heparin dose alone',
        'Forgetting fresh frozen plasma as an antithrombin source',
        'Confusing heparin resistance with heparin-induced thrombocytopenia',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Heparin mechanism',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Heparin mechanism' },
  },

  {
    id: 'atom-acb-heparin-units-halflife',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State why heparin is dosed in units rather than milligrams and give its approximate therapeutic half-life.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Heparin is dosed in units, not milligrams, because the biological activity varies between vials that contain equal milligrams. Units standardize the actual anticoagulant effect delivered, which is necessary because the mass of heparin does not reliably predict its activity.' },
        { id: 'kp2', weight: 2, description: 'Heparin has a half-life of approximately 1 hour at therapeutic doses. This short half-life, combined with the dose being expressed in activity units, informs the timing of reversal with protamine and the timing of neuraxial procedures after heparin administration.' },
      ],
      common_errors: [
        'Saying heparin is dosed in milligrams like most drugs',
        'Quoting the half-life as much longer than about one hour',
        'Believing units convert directly into a plasma drug level',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Heparin pharmacokinetics',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Heparin pharmacokinetics' },
  },

  {
    id: 'atom-acb-heparin-route-variability',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe heparin\'s onset by route and the magnitude of its nonlinear dose-response variability.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Intravenous heparin has immediate onset, while the subcutaneous route is suitable for prophylaxis only because subcutaneous bioavailability is too variable for reliable therapeutic anticoagulation. Heparin is not given orally. This is why therapeutic anticoagulation uses the intravenous route.' },
        { id: 'kp2', weight: 2, description: 'The dose-response is nonlinear, and patient sensitivity varies roughly fourfold while metabolism varies roughly threefold. This wide and nonlinear variability is the core reason heparin requires laboratory monitoring rather than fixed weight-based dosing for therapeutic effect.' },
      ],
      common_errors: [
        'Claiming subcutaneous heparin is reliable for therapeutic dosing',
        'Stating the dose-response is linear and predictable',
        'Swapping the figures so sensitivity is threefold and metabolism fourfold',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Heparin pharmacokinetics',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Heparin pharmacokinetics' },
  },

  {
    id: 'atom-acb-aptt-antixa-targets',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Match the aPTT and the anti-factor Xa assay to their heparin dosing roles and state each target value.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The aPTT is used for prophylactic and low-dose therapeutic heparin, with a target of 1.5 to 2.5 times baseline. It is the bedside therapeutic monitor for these lower heparin ranges and reports a clotting-time ratio rather than a concentration.' },
        { id: 'kp2', weight: 2, description: 'The anti-factor Xa assay is used for therapeutic heparin dosing, with a target of 0.3 to 0.7 units/mL. Because it directly measures Xa inhibition in concentration units, it is favored when precise therapeutic dosing is needed, distinct from the aPTT ratio.' },
      ],
      common_errors: [
        'Quoting the aPTT target in units per mL rather than a baseline multiple',
        'Stating an anti-Xa therapeutic target other than 0.3 to 0.7 units per mL',
        'Using the ACT for low-dose therapeutic heparin instead of the aPTT',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Heparin monitoring',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Heparin monitoring' },
  },

  {
    id: 'atom-acb-act-bypass-concentration',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain why the ACT, not the aPTT, is used on cardiopulmonary bypass and state the heparin concentration there relative to therapeutic.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'On cardiopulmonary bypass heparin runs at approximately 3 to 4 units/mL, which is about 5 to 10 times the therapeutic concentration. This deep level of anticoagulation is required to prevent clotting within the extracorporeal circuit.' },
        { id: 'kp2', weight: 2, description: 'At that concentration the aPTT runs off-scale and becomes uninformative, whereas the ACT stays calibrated. The ACT is therefore the monitor of choice on bypass; it does not mean the aPTT cannot detect heparin at all, only that it saturates at these very high levels.' },
      ],
      common_errors: [
        'Stating bypass heparin is at therapeutic concentration',
        'Claiming the aPTT works fine at bypass heparin levels',
        'Saying the aPTT detects no heparin rather than saturating off-scale',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Heparin monitoring',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Heparin monitoring' },
  },

  {
    id: 'atom-acb-act-components-values',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the two components of the ACT assay, its normal baseline range, and the usual bypass target.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The ACT is run on whole blood plus a contact activator, which is either celite or kaolin. The activator triggers the intrinsic pathway through contact activation, and using whole blood lets the test be performed at the point of care during surgery.' },
        { id: 'kp2', weight: 2, description: 'The normal baseline ACT is about 100 to 150 seconds, and the bypass target is at least 400 seconds at most centers. Reaching and maintaining the bypass threshold confirms adequate heparinization before going on pump, and a value below target calls for additional heparin.' },
      ],
      common_errors: [
        'Saying the ACT uses plasma plus thromboplastin rather than whole blood',
        'Quoting a baseline far from 100 to 150 seconds',
        'Using a bypass target other than at least 400 seconds',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ACT bypass test',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ACT bypass test' },
  },

  {
    id: 'atom-acb-act-check-timing',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'List the three time points at which the ACT is checked around cardiopulmonary bypass.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The ACT is checked at baseline before heparin, and again 3 to 5 minutes after the heparin bolus to confirm that the bolus achieved an adequate level before initiating bypass. These first two checks establish the starting point and the response to heparin.' },
        { id: 'kp2', weight: 2, description: 'On bypass the ACT is then rechecked every 30 minutes to ensure anticoagulation does not drift below target as heparin is metabolized and the circuit continues. This serial monitoring schedule prevents under-anticoagulation during the extracorporeal run.' },
      ],
      common_errors: [
        'Checking the ACT only once before bypass',
        'Stating the post-bolus check is immediate rather than 3 to 5 minutes',
        'Believing rechecks occur every 5 minutes rather than every 30',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ACT bypass test',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ACT bypass test' },
  },

  {
    id: 'atom-acb-act-confounders',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'List the confounders that prolong the ACT during bypass without representing more heparin, and state the activator fix for the aprotinin confounder.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'A long ACT does not always mean a lot of heparin. Hypothermia, hemodilution from the pump prime, thrombocytopenia, and fibrinogen deficiency all prolong the ACT independent of heparin. Each represents a non-heparin reason the clotting time is elevated, so every ACT must be read in the context of the patient.' },
        { id: 'kp2', weight: 2, description: 'Aprotinin is an additional confounder, but specifically when celite is the activator; it artifactually prolongs the celite-based ACT. The fix is to use kaolin as the activator instead, which avoids the aprotinin interference and gives a truer reflection of heparin effect.' },
      ],
      common_errors: [
        'Listing hyperthermia rather than hypothermia as a confounder',
        'Saying aprotinin prolongs the ACT regardless of activator',
        'Recommending celite instead of kaolin to avoid the aprotinin effect',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ACT confounders',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ACT confounders' },
  },

  {
    id: 'atom-acc-hit-type-1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe HIT type I: its immune status, timing relative to heparin start, and clinical significance.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'HIT type I is a benign, non-immune drop in platelet count that occurs within hours of starting heparin. It is caused by a direct, dose-dependent proaggregating effect of heparin on platelets rather than by any antibody, so it is sometimes called heparin-associated thrombocytopenia.' },
        { id: 'kp2', weight: 2, description: 'Type I is not clinically significant. The platelet count typically remains above 100,000, often recovers even with continued heparin, and is not associated with thrombosis. It requires no change in management and must be distinguished from the dangerous immune type II form.' },
      ],
      common_errors: [
        'Calling type I immune-mediated; it is non-immune',
        'Confusing the within-hours onset of type I with the day 4 to 14 onset of type II',
        'Believing type I causes thrombosis or needs treatment',
      ],
      minimum_passing_score: 60,
    },
    topic: 'HIT type I',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'HIT type I' },
  },

  {
    id: 'atom-acc-hit-type-2-overview',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe HIT type II: its immune status, why it is the dangerous form, and its incidence with unfractionated heparin versus low-molecular-weight heparin.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'HIT type II is immune-mediated and is the dangerous form because it produces thrombosis rather than bleeding despite a falling platelet count. It is the form that kills patients and must be acted on promptly once suspected.' },
        { id: 'kp2', weight: 2, description: 'Incidence is roughly 0.5 to 3% with unfractionated heparin and only about 0.2% with low-molecular-weight heparin. The smaller LMWH molecule forms fewer immunogenic heparin-PF4 complexes, so unfractionated heparin carries the higher HIT risk.' },
      ],
      common_errors: [
        'Stating LMWH has higher HIT risk than UFH',
        'Describing type II as a bleeding disorder',
        'Quoting incidence in the 10 to 15% range',
      ],
      minimum_passing_score: 60,
    },
    topic: 'HIT type II',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'HIT type II' },
  },

  {
    id: 'atom-acc-hit-mechanism',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Walk through the immune mechanism of HIT type II from heparin binding to platelet consumption.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Heparin binds platelet factor 4 on the platelet surface, and the resulting heparin-PF4 complex is recognized as foreign by IgG antibodies. The heparin-PF4 complex, not heparin alone, is the antigen that drives the immune response.' },
        { id: 'kp2', weight: 2, description: 'The IgG antibodies bind the complex and then crosslink platelet Fc receptors, which activates the platelets. The activated platelets are consumed in microthrombi, simultaneously lowering the platelet count and generating widespread clotting.' },
      ],
      common_errors: [
        'Saying complement lysis rather than Fc receptor crosslinking destroys platelets',
        'Naming antithrombin instead of PF4 as the heparin partner',
        'Forgetting that platelet activation, not just destruction, drives thrombosis',
      ],
      minimum_passing_score: 60,
    },
    topic: 'HIT mechanism',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'HIT mechanism' },
  },

  {
    id: 'atom-acc-hit-timing-threshold',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the typical onset window of HIT type II and the platelet-count criteria that define it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'HIT type II typically begins on day 4 to 14 of heparin exposure, reflecting the time needed to mount an IgG antibody response. Earlier exposure within the preceding 100 days can shorten this window through rapid-onset HIT, but the classic teaching window is day 4 to 14.' },
        { id: 'kp2', weight: 2, description: 'The platelet count falls by at least 50% from baseline or drops below 100,000. A 50% relative fall can be significant even if the absolute count is still above 100,000, which is why the relative drop is part of the criteria.' },
      ],
      common_errors: [
        'Using the within-hours timing of type I for type II',
        'Requiring an absolute count below 20,000 to diagnose HIT',
        'Ignoring the 50% relative drop criterion',
      ],
      minimum_passing_score: 60,
    },
    topic: 'HIT timing',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'HIT timing' },
  },

  {
    id: 'atom-acc-hit-paradox',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain the HIT paradox and list the thrombotic complications it produces.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The HIT paradox is that platelets fall yet thrombosis rises. Because the antibodies activate platelets rather than simply destroying them, the patient becomes prothrombotic even as the laboratory platelet count drops, so a low count does not protect against clotting.' },
        { id: 'kp2', weight: 2, description: 'The thrombotic complications include deep vein thrombosis, pulmonary embolism, arterial thrombosis, and limb ischemia. This is why stopping heparin alone is insufficient; the prothrombotic state persists and must be treated with active anticoagulation.' },
      ],
      common_errors: [
        'Expecting bleeding rather than clotting in HIT',
        'Assuming a low platelet count is protective',
        'Thinking HIT thrombosis is only venous',
      ],
      minimum_passing_score: 60,
    },
    topic: 'HIT paradox',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'HIT paradox' },
  },

  {
    id: 'atom-acc-4ts-score',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Name the four components of the 4Ts HIT score, how each is scored, and the action threshold.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The 4Ts are Thrombocytopenia, Timing of the platelet fall, Thrombosis, and oTher causes of thrombocytopenia. Each item is scored 0 to 2 points, giving a maximum total of 8, and the tool is a bedside pretest probability screen rather than a confirmatory test.' },
        { id: 'kp2', weight: 2, description: 'A total score of 4 or more should prompt you to send HIT antibodies, such as the anti-PF4 assay, and switch the patient off heparin to a non-heparin anticoagulant. The antibody titer is a separate confirmatory step and is not itself one of the 4Ts.' },
      ],
      common_errors: [
        'Listing antibody titer as a 4Ts component',
        'Using a cutoff of 2 instead of 4 to act',
        'Scoring each T from 0 to 3 rather than 0 to 2',
      ],
      minimum_passing_score: 60,
    },
    topic: '4Ts score',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: '4Ts score' },
  },

  {
    id: 'atom-acc-hit-stop-heparin',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the two essential management steps when HIT is diagnosed and why stopping heparin alone is inadequate.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Stop all heparin completely, including flushes and heparin-coated catheters, not just the therapeutic infusion. Hidden sources of heparin can perpetuate antibody-mediated platelet activation, so every source must be removed.' },
        { id: 'kp2', weight: 2, description: 'Start a non-heparin anticoagulant. Stopping heparin alone is not enough because these patients continue to clot, so the prothrombotic state must be actively treated. Prophylactic platelet transfusion is avoided as it can fuel thrombosis.' },
      ],
      common_errors: [
        'Stopping heparin but leaving the patient on no anticoagulation',
        'Forgetting hidden heparin in flushes and coated catheters',
        'Transfusing platelets prophylactically in HIT',
      ],
      minimum_passing_score: 60,
    },
    topic: 'HIT management',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'HIT management' },
  },

  {
    id: 'atom-acc-hit-dti',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Identify the standard non-heparin anticoagulant class for HIT and name representative agents.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Parenteral direct thrombin inhibitors are the standard choice in HIT because they inhibit thrombin directly, act independently of antithrombin, and do not cross-react with HIT antibodies. They directly counter the thrombin-driven thrombosis of HIT.' },
        { id: 'kp2', weight: 2, description: 'Representative agents are bivalirudin and argatroban. The choice between them turns on a renal-versus-hepatic clearance distinction that is covered in the cardiac anesthesia material; both avoid heparin and its cross-reacting antibodies.' },
      ],
      common_errors: [
        'Choosing LMWH, which cross-reacts with HIT antibodies',
        'Starting warfarin acutely before thrombin inhibition',
        'Naming a GP IIb/IIIa antagonist as HIT therapy',
      ],
      minimum_passing_score: 60,
    },
    topic: 'HIT management',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'HIT management' },
  },

  {
    id: 'atom-acc-protamine-mechanism',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain how protamine neutralizes heparin, including the relevant chemistry and the source of protamine.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Protamine is a polypeptide derived from salmon sperm and is about 70% arginine, which makes it strongly basic. Heparin is strongly acidic, and the two form an inactive complex through acid-base ionic binding rather than through enzymatic degradation.' },
        { id: 'kp2', weight: 2, description: 'Protamine reverses unfractionated heparin specifically. Its basic charge pairs with the acidic heparin molecule to neutralize anticoagulant activity, and its salmon-sperm origin underlies fish-allergy and prior-exposure anaphylaxis concerns.' },
      ],
      common_errors: [
        'Calling protamine acidic and heparin basic',
        'Describing enzymatic breakdown of heparin',
        'Forgetting the salmon-sperm origin',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Protamine mechanism',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Protamine mechanism' },
  },

  {
    id: 'atom-acc-protamine-clearance',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State how and how quickly the heparin-protamine complex is cleared and why that matters.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The inactive heparin-protamine complex is cleared by tissue macrophages of the reticuloendothelial system, located mostly in the liver and spleen, in about 20 minutes. Clearance is therefore reticuloendothelial rather than renal or biliary.' },
        { id: 'kp2', weight: 2, description: 'This roughly 20-minute macrophage clearance is faster than heparin elimination. Because protamine disappears before tissue-bound heparin does, the mismatch sets the stage for heparin rebound a few hours later.' },
      ],
      common_errors: [
        'Attributing clearance to renal filtration',
        'Quoting a clearance time of hours rather than about 20 minutes',
        'Missing the link between fast clearance and heparin rebound',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Protamine clearance',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Protamine clearance' },
  },

  {
    id: 'atom-acc-protamine-dose',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the empiric protamine dosing rule and explain why it is based on circulating rather than total heparin.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The empiric rule is about 1 mg of protamine per 100 units of circulating heparin. Because heparin has a half-life of roughly 1 hour, you must account for elimination since the last dose and estimate how much heparin is still circulating rather than how much was originally given.' },
        { id: 'kp2', weight: 2, description: 'Dosing on the total heparin given systematically overshoots, and excess protamine is itself coagulopathic. The dose must therefore track the residual circulating heparin, which shrinks over time as heparin is eliminated.' },
      ],
      common_errors: [
        'Dosing on total heparin administered rather than circulating heparin',
        'Using 10 mg per 100 units instead of 1 mg per 100 units',
        'Ignoring heparin elimination since the last dose',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Protamine dosing',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Protamine dosing' },
  },

  {
    id: 'atom-acc-protamine-titration',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain why many cardiac centers titrate protamine from measured heparin concentration and name the devices used.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Because empiric dosing on total heparin given systematically overshoots and excess protamine is coagulopathic, many cardiac centers titrate the protamine dose from measured heparin concentration rather than from a fixed formula. This individualizes the dose to the heparin actually present in the patient.' },
        { id: 'kp2', weight: 2, description: 'The heparin concentration is measured with point-of-care devices such as the Hemochron HMS or the HemoTec system. Concentration-guided titration gives just enough protamine to neutralize residual heparin, avoiding the overshoot and the second coagulopathy that excess protamine causes.' },
      ],
      common_errors: [
        'Believing all centers use the empiric 1 mg per 100 units formula',
        'Thinking concentration-guided dosing aims to give more protamine, not less',
        'Forgetting that overshoot causes a protamine coagulopathy',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Protamine dosing',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Protamine dosing' },
  },

  {
    id: 'atom-acc-protamine-overdose',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain the protamine overdose paradox, including its mechanism and its effect on the ACT.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'More protamine is not more reversal; excess protamine produces a second coagulopathy on top of the first. It inhibits platelets and also inhibits other serine proteases involved in coagulation, so giving more than needed actively impairs hemostasis.' },
        { id: 'kp2', weight: 2, description: 'Because of this anticoagulant effect of excess protamine, the activated clotting time actually rises with too much protamine rather than falling. A prolonging ACT after generous protamine should raise suspicion of overdose, not residual heparin alone.' },
      ],
      common_errors: [
        'Believing more protamine always deepens reversal',
        'Expecting the ACT to fall with excess protamine',
        'Forgetting that protamine inhibits platelets',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Protamine overdose',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Protamine overdose' },
  },

  {
    id: 'atom-acc-heparin-rebound',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe heparin rebound: its timing, mechanism, and the dose used to treat it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Heparin rebound appears about 2 to 3 hours after the initial protamine dose, when heparin levels climb again. Protamine is cleared by macrophages in roughly 20 minutes, faster than heparin, while heparin that had been sequestered in tissues re-enters the circulation unopposed.' },
        { id: 'kp2', weight: 2, description: 'Treat rebound with a small dose of 5 to 15 mg of protamine, not the original 50 mg. Only the re-emerged tissue heparin needs neutralizing, and repeating a large dose would risk a protamine-induced coagulopathy.' },
      ],
      common_errors: [
        'Repeating the full original protamine dose for rebound',
        'Confusing the 20-minute protamine clearance with the 2 to 3 hour rebound interval',
        'Attributing rebound bleeding to a surgical cause only',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Heparin rebound',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Heparin rebound' },
  },

  {
    id: 'atom-acc-protamine-anaphylaxis',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'List the patient groups at increased risk of protamine anaphylaxis and the approximate risk in NPH-insulin diabetics.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Diabetics on NPH (neutral protamine Hagedorn) insulin carry roughly a 1 in 50 anaphylaxis risk, compared with about 1 in 500 in others, because NPH insulin contains protamine and can sensitize the patient. This is the highest-risk group taught.' },
        { id: 'kp2', weight: 2, description: 'Other groups at increased risk include patients with fish allergy, reflecting protamine\'s salmon-sperm origin, those with prior protamine exposure, and post-vasectomy patients who may form antisperm antibodies. A history in any of these groups warrants caution and readiness to treat anaphylaxis.' },
      ],
      common_errors: [
        'Quoting equal risk across all patient groups',
        'Omitting the NPH insulin association',
        'Confusing the 1 in 50 and 1 in 500 figures',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Protamine adverse',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Protamine adverse' },
  },

  {
    id: 'atom-acc-protamine-pulmonary',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe the catastrophic pulmonary protamine reaction and its mediator.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Protamine can cause acute pulmonary vasoconstriction with right ventricular failure, which is catastrophic. The sudden rise in pulmonary vascular resistance overloads the right ventricle and can precipitate hemodynamic collapse during or just after reversal.' },
        { id: 'kp2', weight: 2, description: 'The reaction is driven by thromboxane release from pulmonary macrophages. Recognizing this mediator explains why the event is a pulmonary vasoconstrictive crisis rather than a simple histaminergic drop in systemic pressure.' },
      ],
      common_errors: [
        'Attributing the reaction to histamine rather than thromboxane',
        'Calling it left rather than right ventricular failure',
        'Treating it as benign transient hypotension',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Protamine adverse',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Protamine adverse' },
  },

  {
    id: 'atom-acc-protamine-hypotension',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain protamine-induced hypotension and how administration technique prevents it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Protamine can cause hypotension that is largely a rate-related effect of rapid administration rather than a true allergic reaction. Giving protamine too fast provokes an abrupt fall in systemic blood pressure.' },
        { id: 'kp2', weight: 2, description: 'The preventive measure is to administer protamine slowly, over about 5 to 10 minutes. Slow delivery blunts the hemodynamic response and is the simplest way to avoid the rapid-administration hypotension.' },
      ],
      common_errors: [
        'Giving protamine as a rapid IV push',
        'Confusing rate-related hypotension with anaphylaxis every time',
        'Using intramuscular or subcutaneous routes for reversal',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Protamine adverse',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Protamine adverse' },
  },

  {
    id: 'atom-acc-protamine-not-reverse',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'List the anticoagulants that protamine does NOT adequately reverse and the practical takeaway.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Protamine does not adequately reverse low-molecular-weight heparin, which gets only partial anti-thrombin reversal while the dominant anti-factor Xa effect persists. It also fails to reverse fondaparinux, the direct oral anticoagulants, and warfarin.' },
        { id: 'kp2', weight: 2, description: 'The practical takeaway is that protamine is a complete reversal agent for unfractionated heparin only. Outside of unfractionated heparin, reaching for protamine wastes time and may cause harm, so the right reversal strategy depends on the specific drug.' },
      ],
      common_errors: [
        'Believing protamine fully reverses LMWH',
        'Trying protamine for warfarin or DOAC bleeding',
        'Expecting protamine to neutralize fondaparinux',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Protamine limits',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Protamine limits' },
  },

  {
    id: 'atom-acc-lmwh-agents-weight',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Name the prototypical low-molecular-weight heparins and state their molecular weight relative to unfractionated heparin.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The prototypical low-molecular-weight heparins are enoxaparin (Lovenox) and dalteparin (Fragmin). These are fractionated derivatives of heparin and are distinct from fondaparinux and the direct thrombin inhibitors.' },
        { id: 'kp2', weight: 2, description: 'Their molecular weight is about 4,000 to 5,000 daltons, roughly two-thirds smaller than unfractionated heparin. This smaller size is the structural basis for their distinct anti-Xa-dominant activity and more predictable pharmacokinetics.' },
      ],
      common_errors: [
        'Listing fondaparinux or a DOAC as an LMWH',
        'Quoting the LMWH weight as similar to UFH',
        'Forgetting that LMWH is smaller than UFH',
      ],
      minimum_passing_score: 60,
    },
    topic: 'LMWH agents',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'LMWH agents' },
  },

  {
    id: 'atom-acc-lmwh-mechanism',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain why LMWH favors anti-factor Xa activity and give its anti-Xa to anti-thrombin ratio versus UFH.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Inactivating thrombin requires a heparin chain long enough, at least about 18 saccharides, to bridge antithrombin and thrombin at the same time. LMWH chains are too short to form this bridge, so they retain anti-factor Xa activity, which needs only antithrombin binding, while losing much of their anti-thrombin activity.' },
        { id: 'kp2', weight: 2, description: 'As a result, LMWH has an anti-factor Xa to anti-thrombin ratio of about 2:1 to 4:1, compared with 1:1 for unfractionated heparin. LMWH still works through antithrombin; it is not antithrombin-independent like the direct oral anticoagulants.' },
      ],
      common_errors: [
        'Saying LMWH acts independently of antithrombin',
        'Reversing the ratio so anti-thrombin dominates',
        'Giving UFH a ratio other than 1:1',
      ],
      minimum_passing_score: 60,
    },
    topic: 'LMWH mechanism',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'LMWH mechanism' },
  },

  {
    id: 'atom-acc-lmwh-advantages',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'List the pharmacokinetic advantages of LMWH that allow it to be given without routine monitoring.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'LMWH has more predictable pharmacokinetics and less protein binding than unfractionated heparin. Because the dose-response is consistent, fixed or weight-based dosing produces reliable anticoagulation without the fourfold sensitivity variability seen with unfractionated heparin.' },
        { id: 'kp2', weight: 2, description: 'These properties mean LMWH requires no routine laboratory monitoring in most patients. When monitoring is needed in special situations such as renal failure, obesity, or pregnancy, an anti-factor Xa assay is the appropriate test.' },
      ],
      common_errors: [
        'Attributing nonlinear pharmacokinetics to LMWH',
        'Saying LMWH needs routine aPTT monitoring',
        'Claiming LMWH has heavier protein binding than UFH',
      ],
      minimum_passing_score: 60,
    },
    topic: 'LMWH advantages',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'LMWH advantages' },
  },

  {
    id: 'atom-acc-lmwh-renal',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain why LMWH is problematic in renal failure and which agent is preferred instead.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'LMWH is cleared renally and therefore accumulates in renal failure, prolonging its effect and raising bleeding risk. Because its anticoagulant activity cannot be readily titrated or fully reversed, accumulation is dangerous in patients with poor renal function.' },
        { id: 'kp2', weight: 2, description: 'Unfractionated heparin is preferred instead in renal failure because it is not renally dependent for clearance, has a short half-life, and is fully reversible with protamine. This makes UFH the safer, more controllable choice when renal function is impaired.' },
      ],
      common_errors: [
        'Increasing the LMWH dose in renal failure',
        'Choosing fondaparinux, which is also renally cleared',
        'Forgetting that UFH clearance is not renally dependent',
      ],
      minimum_passing_score: 60,
    },
    topic: 'LMWH renal',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'LMWH renal' },
  },

  {
    id: 'atom-acc-lmwh-protamine-partial',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain why protamine only partially reverses LMWH at the level of anti-thrombin versus anti-factor Xa activity.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Protamine partially neutralizes only the anti-thrombin effect of LMWH. The dominant anti-factor Xa activity, which accounts for most of the LMWH anticoagulant effect given its 2:1 to 4:1 ratio, persists after protamine is given.' },
        { id: 'kp2', weight: 2, description: 'Because the major anti-Xa component is not reversed, protamine cannot be relied upon to control LMWH-related bleeding. This partial reversal is the reason LMWH appears on the list of drugs protamine does not adequately reverse.' },
      ],
      common_errors: [
        'Assuming protamine fully neutralizes LMWH',
        'Reversing which component, anti-Xa versus anti-IIa, persists',
        'Treating LMWH bleeding with protamine as a definitive fix',
      ],
      minimum_passing_score: 60,
    },
    topic: 'LMWH reversal',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'LMWH reversal' },
  },

  {
    id: 'atom-acc-lmwh-neuraxial',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the ASRA neuraxial timing intervals for prophylactic and therapeutic LMWH dosing.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'ASRA recommends waiting 12 hours after a prophylactic dose of LMWH before performing a neuraxial block or removing a catheter. This interval reflects the lower anticoagulant burden of prophylactic dosing.' },
        { id: 'kp2', weight: 2, description: 'After a therapeutic dose of LMWH, the interval is 24 hours. The longer wait accounts for the larger anticoagulant effect, and observing these intervals helps prevent the career-ending complication of epidural hematoma.' },
      ],
      common_errors: [
        'Swapping the 12-hour and 24-hour intervals',
        'Applying the 4 to 6 hour IV heparin interval to LMWH',
        'Using 72 hours, which belongs to oral factor Xa inhibitors',
      ],
      minimum_passing_score: 60,
    },
    topic: 'LMWH neuraxial',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'LMWH neuraxial' },
  },

  {
    id: 'atom-acd-warfarin-mechanism',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State warfarin\'s molecular mechanism: name the enzyme it inhibits, the post-translational modification that fails, and why the affected factors become nonfunctional.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Warfarin inhibits vitamin K epoxide reductase, the enzyme that recycles oxidized vitamin K epoxide back to the active reduced form. Without recycled vitamin K the liver cannot perform gamma-carboxylation, the reaction that adds carboxyl groups to glutamate residues on the vitamin K dependent factors. This is an upstream block on cofactor recycling rather than a direct action on the factors themselves.' },
        { id: 'kp2', weight: 2, description: 'Gamma-carboxylation creates a calcium-binding tail that lets a factor anchor to phospholipid membranes. Without it the factors are still synthesized and secreted but cannot bind calcium and cannot participate in the cascade, so they are functionally inert. Importantly, factors already carboxylated and circulating are unaffected; only newly produced factors are defective, which is why warfarin has a delayed onset.' },
      ],
      common_errors: [
        'Saying warfarin destroys or inactivates existing circulating factors rather than only newly made ones',
        'Confusing the target with CYP2C19 or with antithrombin',
        'Forgetting that the factors are synthesized but cannot bind calcium, instead claiming they are never made',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Warfarin mechanism',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Warfarin mechanism' },
  },

  {
    id: 'atom-acd-warfarin-factor-halflives',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'List the vitamin K dependent procoagulant factors in order of half-life with their approximate values, and explain why the INR rises before true anticoagulation is achieved.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The half-lives are factor VII about 6 hours, factor IX about 24 hours, factor X about 36 hours, and factor II (prothrombin) about 60 hours. Factor VII has the shortest half-life so it falls first, and because the prothrombin time is most sensitive to factor VII the INR rises early, within roughly 24 hours of starting warfarin.' },
        { id: 'kp2', weight: 2, description: 'An early rise in the INR does not equal real anticoagulation. Meaningful antithrombotic protection requires the longest-lived factor, prothrombin (factor II), to fall, which takes around 60 hours or several days. This dissociation between a rising INR and actual protection is why warfarin alone is not trusted for immediate anticoagulation and why bridging is considered when rapid effect is needed.' },
      ],
      common_errors: [
        'Assuming a therapeutic INR at 24 hours means the patient is fully anticoagulated',
        'Mixing up the order, for example calling factor II the shortest half-life',
        'Forgetting that factor VII drives the early INR rise',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Warfarin onset',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Warfarin onset' },
  },

  {
    id: 'atom-acd-warfarin-procoagulant-phase',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain warfarin\'s early procoagulant phase: which anticoagulant proteins are vitamin K dependent, the relevant half-life, and the clinical consequence in deficient patients.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Proteins C and S are vitamin K dependent anticoagulants, so warfarin lowers them along with the procoagulant factors. Protein C has a short half-life of about 8 hours, similar to factor VII, so it falls before prothrombin (factor II) at about 60 hours. For the first 24 to 48 hours the loss of protein C without a corresponding drop in prothrombin makes the net effect prothrombotic.' },
        { id: 'kp2', weight: 2, description: 'This transient hypercoagulable window explains warfarin-induced skin necrosis, which occurs especially in patients with underlying protein C deficiency because their already-low protein C plummets and causes dermal microthrombosis. It is also the pharmacologic rationale for overlapping heparin (bridging) when a rapid and safe anticoagulant effect is required at initiation.' },
      ],
      common_errors: [
        'Claiming warfarin is anticoagulant from the very first dose',
        'Attributing skin necrosis to factor VII deficiency instead of protein C deficiency',
        'Forgetting that proteins C and S are vitamin K dependent like the procoagulants',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Procoagulant phase',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Procoagulant phase' },
  },

  {
    id: 'atom-acd-warfarin-inr-targets',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe warfarin monitoring: name the test, how it is standardized across labs, and the INR targets for most indications versus mechanical mitral valves.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Warfarin is monitored with the prothrombin time reported as the INR. The INR uses the International Sensitivity Index to normalize results between laboratories that use different thromboplastin reagents, allowing comparable values regardless of where the test is run. The PT/INR is the warfarin test because the PT is most sensitive to factor VII.' },
        { id: 'kp2', weight: 2, description: 'The standard INR target for most indications, including atrial fibrillation and venous thromboembolism, is 2.0 to 3.0. Mechanical mitral valves are the highest thrombotic risk and require a more intense target of 2.5 to 3.5. Warfarin has hundreds of drug, food, and antibiotic interactions, so frequent monitoring and gradual titration are essential.' },
      ],
      common_errors: [
        'Using 2.5 to 3.5 for routine atrial fibrillation',
        'Applying the standard 2.0 to 3.0 range to a mechanical mitral valve',
        'Confusing the INR with the aPTT, which is the heparin test',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Warfarin monitoring',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Warfarin monitoring' },
  },

  {
    id: 'atom-acd-warfarin-perioperative',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Outline perioperative warfarin management: when to stop before elective surgery, what to do the day before if the INR is still elevated, and the INR threshold to operate.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Warfarin is stopped about 5 days before elective surgery to allow the INR to drift toward normal as the longer-lived factors are remade. The INR is then rechecked the day before surgery, and if it remains elevated a small dose of oral vitamin K, 1 to 2 mg, is given to nudge it down without causing resistance when warfarin resumes.' },
        { id: 'kp2', weight: 2, description: 'Surgery may proceed when the INR is below 1.5, which reflects near-normal coagulation factor activity and acceptable bleeding risk. The same threshold governs neuraxial procedures. Whether to bridge with heparin during the off-warfarin window is a separate decision driven by thrombotic risk, addressed by the BRIDGE trial.' },
      ],
      common_errors: [
        'Stopping warfarin only 1 day before major surgery',
        'Giving high-dose IV vitamin K preoperatively instead of low-dose oral',
        'Operating at an INR of 2 or higher for major surgery',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Perioperative warfarin',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Perioperative warfarin' },
  },

  {
    id: 'atom-acd-bridge-trial',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Summarize the BRIDGE trial: design and population, and the thromboembolism and major bleeding results comparing bridging to no bridging.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'BRIDGE (NEJM 2015) randomized 1884 atrial fibrillation patients on warfarin during interruption to either dalteparin bridging or no bridging in the off-warfarin window. It specifically studied typical AF patients, not mechanical valves or very recent thromboembolism, which matters when applying its conclusion.' },
        { id: 'kp2', weight: 2, description: 'At 30 days, thromboembolism was 0.3% with bridging versus 0.4% without, essentially identical with no benefit. Major bleeding was 3.2% with bridging versus 1.3% without, significantly worse with bridging, about 2.5 times the rate. The trial therefore showed bridging causes bleeding harm without preventing strokes in typical AF.' },
      ],
      common_errors: [
        'Believing bridging lowered stroke risk in BRIDGE',
        'Applying BRIDGE results to mechanical valve patients',
        'Reversing the bleeding numbers so that no-bridge appears worse',
      ],
      minimum_passing_score: 60,
    },
    topic: 'BRIDGE trial',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'BRIDGE trial' },
  },

  {
    id: 'atom-acd-bridging-exceptions',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the default bridging recommendation for typical atrial fibrillation patients and list the specific exceptions who should still be bridged.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'For typical atrial fibrillation patients, bridging causes bleeding without preventing strokes, so the default is not to bridge during warfarin interruption. This follows directly from the BRIDGE trial and applies to ordinary AF without the high-risk features listed below.' },
        { id: 'kp2', weight: 2, description: 'Exceptions who should still be bridged are mechanical heart valves, especially mitral, recent venous thromboembolism within 3 months, and the highest-risk CHA2DS2-VASc patients with prior stroke. These groups have a thrombotic risk high enough to justify accepting the bleeding risk of bridging.' },
      ],
      common_errors: [
        'Bridging every patient with atrial fibrillation',
        'Forgetting that recent VTE within 3 months is a bridging indication',
        'Omitting mechanical mitral valves from the exception list',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Who bridges',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Who bridges' },
  },

  {
    id: 'atom-acd-warfarin-nonurgent-reversal',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe non-urgent warfarin reversal for a high INR without bleeding, including the vitamin K dose and the danger of overcorrecting with high-dose or IV vitamin K.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'When the INR is high but there is no active bleeding, management is to hold warfarin and give oral vitamin K 5 to 10 mg. The INR comes down gradually over about 24 hours as endogenous carboxylation resumes. Prothrombin complex concentrate and plasma are not needed because there is no bleeding emergency.' },
        { id: 'kp2', weight: 2, description: 'High-dose or intravenous vitamin K overshoots the correction and saturates the recycling pathway, producing relative warfarin resistance when therapy resumes, making it difficult to re-establish a therapeutic INR. Low-dose oral vitamin K avoids this overcorrection while still lowering the INR safely.' },
      ],
      common_errors: [
        'Reaching for PCC or plasma when there is no bleeding',
        'Giving high-dose or rapid IV vitamin K and causing later resistance',
        'Expecting the INR to normalize within minutes rather than about 24 hours',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Non-urgent reversal',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Non-urgent reversal' },
  },

  {
    id: 'atom-acd-warfarin-urgent-reversal',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Detail urgent warfarin reversal: the contents of 4-factor PCC, its speed versus FFP, its volume and safety advantages, why IV vitamin K is added, and the FFP INR floor.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'For active bleeding or emergency surgery, 4-factor prothrombin complex concentrate (Kcentra) is first-line. It contains factors II, VII, IX, and X plus proteins C, S, and antithrombin, mirroring exactly what warfarin depletes. It restores the INR below 1.3 within about 30 minutes in roughly 55% of patients, compared with only about 10% for fresh frozen plasma.' },
        { id: 'kp2', weight: 2, description: 'PCC delivers the factors in about 100 mL versus 1 to 2 liters of FFP, with no crossmatch, no TRALI, and no TACO. Because its effect is transient at 6 to 8 hours, IV vitamin K 10 mg given slowly is added for durable correction. Fresh frozen plasma has its own INR of 1.4 to 1.6, so FFP alone cannot bring a patient below 1.5, another reason PCC is preferred.' },
      ],
      common_errors: [
        'Using FFP as first-line and expecting it to reach an INR below 1.5',
        'Giving PCC without adding vitamin K and missing the transient duration',
        'Forgetting that PCC contains proteins C, S, and antithrombin in addition to the four factors',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Urgent reversal',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Urgent reversal' },
  },

  {
    id: 'atom-acd-doac-rationale-mechanism',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain why DOACs were developed and their unifying mechanism: the warfarin limitations they address, the two mechanistic classes, and what antithrombin-independent means.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'DOACs were designed to do what warfarin does but without routine monitoring, the many food and drug interactions, and the slow onset dictated by factor half-lives. They provide predictable oral dosing, though they still require renal dose adjustment. This makes them easier to use in most patients than warfarin.' },
        { id: 'kp2', weight: 2, description: 'There are two mechanisms across four drugs: one direct thrombin inhibitor and three direct factor Xa inhibitors. All four are antithrombin-independent, meaning they bind the active site of thrombin or factor Xa directly rather than working through antithrombin the way heparin does. This direct binding gives them their predictable effect.' },
      ],
      common_errors: [
        'Saying DOACs work through antithrombin like heparin',
        'Claiming DOACs need no dose adjustment at all when they require renal adjustment',
        'Miscounting the split as anything other than one thrombin and three Xa inhibitors',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Why DOACs exist',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Why DOACs exist' },
  },

  {
    id: 'atom-acd-four-doacs',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Name the four DOACs with brand names, identify each one\'s target and dosing frequency, and state the shared dose-adjustment requirement.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Dabigatran (Pradaxa) is the direct thrombin inhibitor, dosed twice daily. The three direct factor Xa inhibitors are rivaroxaban (Xarelto) once daily, apixaban (Eliquis) twice daily, and edoxaban (Savaysa) once daily. So the twice-daily agents are dabigatran and apixaban, and the once-daily agents are rivaroxaban and edoxaban.' },
        { id: 'kp2', weight: 2, description: 'All four DOACs require renal dose adjustment. Dabigatran is the most renally dependent, but the factor Xa inhibitors also need modification in kidney disease, which is why renal function must be assessed before dosing and during perioperative interruption planning.' },
      ],
      common_errors: [
        'Calling rivaroxaban or edoxaban a thrombin inhibitor',
        'Assigning twice-daily dosing to rivaroxaban or edoxaban',
        'Stating that only dabigatran needs renal adjustment',
      ],
      minimum_passing_score: 60,
    },
    topic: 'The four DOACs',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'The four DOACs' },
  },

  {
    id: 'atom-acd-doac-monitoring',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe DOAC monitoring: the default, the specific assays for dabigatran, the assay for factor Xa inhibitors, and the test that is explicitly not useful.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'DOACs usually require no monitoring, which is a central selling point. When a level must be known, dabigatran is assessed with the thrombin time, dilute thrombin time, or ecarin clotting time; the aPTT gives only a qualitative signal of dabigatran presence and is not quantitative.' },
        { id: 'kp2', weight: 2, description: 'The direct factor Xa inhibitors are measured with a drug-specific calibrated anti-Xa assay. The prothrombin time and INR are explicitly not useful for the direct Xa inhibitors, a high-yield trap, so a normal INR does not mean the anticoagulant effect has cleared.' },
      ],
      common_errors: [
        'Using the PT or INR to assess a factor Xa inhibitor',
        'Treating the aPTT as a quantitative dabigatran level',
        'Applying the anti-Xa assay to dabigatran instead of a thrombin-based test',
      ],
      minimum_passing_score: 60,
    },
    topic: 'DOAC monitoring',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'DOAC monitoring' },
  },

  {
    id: 'atom-acd-pause-protocol',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Summarize the PAUSE perioperative protocol for DOACs: the trial, the stop and resume timing by bleeding risk, and why no bridging is needed.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'PAUSE (JAMA Internal Medicine 2019, n=3007 atrial fibrillation patients) established a simple stop-and-resume schedule. For low-bleeding-risk procedures the DOAC is stopped 1 day before and resumed 1 day after. For high-bleeding-risk procedures it is stopped 2 days before and resumed 2 to 3 days after, with adjustment for renal function.' },
        { id: 'kp2', weight: 2, description: 'Outcomes were favorable, with about 1% major bleeding and under 0.5% thromboembolism, and no bridging was used. Bridging is unnecessary because DOAC half-lives are short enough that simply stopping and resuming covers the perioperative window safely, unlike warfarin.' },
      ],
      common_errors: [
        'Bridging DOAC patients with heparin perioperatively',
        'Swapping the timing so high risk uses 1 day and low risk uses 2 days',
        'Ignoring the requirement to adjust timing for renal function',
      ],
      minimum_passing_score: 60,
    },
    topic: 'PAUSE protocol',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'PAUSE protocol' },
  },

  {
    id: 'atom-acd-doac-reversal',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Detail DOAC reversal: the agent and nature for dabigatran, the agent and nature for factor Xa inhibitors with the ANNEXA-I finding, and the practical default at US institutions.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Dabigatran, the direct thrombin inhibitor, is reversed by idarucizumab (Praxbind), a monoclonal antibody fragment that binds dabigatran with about 350 times the affinity dabigatran has for thrombin. This high-affinity capture rapidly neutralizes the drug.' },
        { id: 'kp2', weight: 2, description: 'The direct factor Xa inhibitors are reversed by andexanet alfa (Andexxa), a recombinant catalytically inactive factor Xa decoy that sequesters the inhibitor. ANNEXA-I in 2024 showed superior hemostasis versus usual care in intracranial hemorrhage but also more thrombotic events. Off-label 4-factor prothrombin complex concentrate remains the practical default at most US institutions.' },
      ],
      common_errors: [
        'Swapping the agents so idarucizumab is used for Xa inhibitors',
        'Forgetting that andexanet alfa increased thrombotic events in ANNEXA-I',
        'Not knowing that off-label 4-factor PCC is the common practical default',
      ],
      minimum_passing_score: 60,
    },
    topic: 'DOAC reversal',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'DOAC reversal' },
  },

  {
    id: 'atom-ace-aspirin-cox1',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State aspirin\'s molecular mechanism on the platelet, naming the enzyme, the type of inhibition, and the downstream mediator that is lost.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Aspirin irreversibly acetylates cyclooxygenase-1 (COX-1) by covalently modifying a serine residue, permanently inactivating the enzyme in that platelet. This is a covalent, irreversible block, distinguishing it from competitive or reversible inhibitors. Because the modification is permanent for the molecule, the platelet cannot restore COX-1 activity.' },
        { id: 'kp2', weight: 2, description: 'With COX-1 disabled, the platelet cannot synthesize thromboxane A2, and without thromboxane A2 there is no amplification of platelet activation. Thromboxane A2 normally serves as a positive feedback signal recruiting and activating additional platelets, so its loss blunts aggregation. This is why low-dose aspirin is an effective antiplatelet agent.' },
      ],
      common_errors: [
        'Saying aspirin blocks P2Y12 or the ADP receptor, which is the clopidogrel class',
        'Calling the COX-1 inhibition reversible or competitive rather than irreversible acetylation',
        'Confusing thromboxane A2 with prostacyclin or with fibrinogen crosslinking',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Aspirin mechanism',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Aspirin mechanism' },
  },

  {
    id: 'atom-ace-aspirin-pk',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain why aspirin\'s antiplatelet effect outlasts its 15 minute plasma half-life, and give the duration of the effect.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Aspirin\'s plasma half-life is only about 15 minutes, yet the platelet it touches is disabled for that platelet\'s entire 7 to 10 day lifespan. The platelet has no nucleus and cannot resynthesize COX-1, so the irreversible acetylation lasts for the life of the cell. A single dose therefore shuts down whatever platelets it contacts for the rest of their life.' },
        { id: 'kp2', weight: 2, description: 'Because only newly produced platelets carry functional COX-1, recovery of platelet function depends on platelet turnover rather than drug clearance. Roughly 10 to 12 percent of the platelet pool is replaced per day, which is the basis for the 7 to 10 day interruption window when aspirin must be fully reversed. This decoupling of drug half-life from effect duration is a defining feature of irreversible platelet inhibitors.' },
      ],
      common_errors: [
        'Attributing the long effect to a long-lived active metabolite rather than to irreversible enzyme block',
        'Stating the platelet lifespan as a few hours or as 30 days',
        'Assuming platelet function returns once the drug is cleared from plasma',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Aspirin pharmacokinetics',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Aspirin pharmacokinetics' },
  },

  {
    id: 'atom-ace-asa-primary',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe the perioperative management of aspirin taken for primary cardiovascular prevention, citing the supporting trial.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Aspirin taken for primary prevention is usually safe to stop before surgery because continuing it provides no proven benefit while adding bleeding risk. The first perioperative question is always what the patient is taking aspirin for, since primary and secondary prevention are managed differently. Stopping primary prevention aspirin is the default in most non-cardiac surgery.' },
        { id: 'kp2', weight: 2, description: 'POISE-2 showed no benefit to continuing aspirin for primary prevention in non-cardiac surgery, providing the evidence base for discontinuation. The trial did not demonstrate a reduction in cardiovascular events from continuation, so the bleeding risk is not offset by benefit. This is the key citation distinguishing primary prevention management from the continue-through-surgery rule for secondary prevention.' },
      ],
      common_errors: [
        'Claiming POISE-2 showed benefit to continuing aspirin',
        'Recommending heparin bridging for an antiplatelet agent',
        'Applying the primary prevention stop rule to post-stent or post-MI patients',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Aspirin perioperative primary prevention',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Aspirin perioperative primary prevention' },
  },

  {
    id: 'atom-ace-asa-secondary',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe the perioperative management of aspirin taken for secondary prevention and state whether aspirin contraindicates neuraxial anesthesia.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Aspirin for secondary prevention, meaning post-stent, post-myocardial-infarction, or post-stroke, is continued through most surgery, including cardiac surgery. These patients have established atherothrombotic disease where withdrawing aspirin risks ischemic events. The benefit of continued platelet inhibition outweighs the surgical bleeding risk in most settings.' },
        { id: 'kp2', weight: 2, description: 'Aspirin is not a contraindication to neuraxial anesthesia; a patient on aspirin alone can receive a spinal or epidural. This aligns with the ASRA position that aspirin alone carries no neuraxial restriction. If aspirin must be interrupted for other reasons it is stopped 7 to 10 days before and resumed the morning after surgery.' },
      ],
      common_errors: [
        'Stopping secondary prevention aspirin routinely before surgery',
        'Believing aspirin alone prohibits a spinal or epidural',
        'Confusing the secondary prevention continue rule with the primary prevention stop rule',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Aspirin perioperative secondary prevention',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Aspirin perioperative secondary prevention' },
  },

  {
    id: 'atom-ace-p2y12-receptor',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Identify the natural ligand of the platelet P2Y12 receptor and explain its role in thrombosis.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The P2Y12 receptor is the platelet\'s receptor for adenosine diphosphate (ADP). Activated platelets release ADP from their dense granules, and that ADP binds P2Y12 on adjacent platelets. This identifies P2Y12 specifically as an ADP receptor, distinct from the thromboxane and fibrinogen receptors.' },
        { id: 'kp2', weight: 2, description: 'ADP acting on P2Y12 recruits additional platelets, creating a positive feedback loop that amplifies thrombosis. Blocking P2Y12 breaks this loop, which is the shared mechanism of clopidogrel, prasugrel, and ticagrelor. The receptor thus sits at a key amplification step in primary hemostasis.' },
      ],
      common_errors: [
        'Naming thromboxane A2 or fibrinogen as the P2Y12 ligand',
        'Confusing P2Y12 with the GP IIb/IIIa fibrinogen receptor',
        'Forgetting that P2Y12 blockade interrupts a positive feedback amplification loop',
      ],
      minimum_passing_score: 60,
    },
    topic: 'P2Y12 receptor',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'P2Y12 receptor' },
  },

  {
    id: 'atom-ace-clopidogrel',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe clopidogrel\'s activation, the nature of its receptor binding, and the basis of clopidogrel resistance.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Clopidogrel is a prodrug that requires two CYP2C19-dependent activation steps in the liver before it can act, and once active it binds P2Y12 irreversibly. The irreversible binding means the effect persists for the platelet lifespan rather than the drug half-life. This combination of hepatic activation plus irreversible binding defines its pharmacology.' },
        { id: 'kp2', weight: 2, description: 'Because activation depends on CYP2C19, the 20 to 30 percent of patients carrying CYP2C19 loss-of-function variants underactivate the drug, producing so-called clopidogrel resistance with reduced antiplatelet effect. This pharmacogenetic variability is a major reason prasugrel and ticagrelor were developed. The ASRA neuraxial hold for clopidogrel is 7 days.' },
      ],
      common_errors: [
        'Calling clopidogrel direct-acting or reversibly bound',
        'Attributing resistance to renal clearance rather than CYP2C19 variants',
        'Giving the resistance prevalence as a tiny fraction rather than 20 to 30 percent',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Clopidogrel',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Clopidogrel' },
  },

  {
    id: 'atom-ace-prasugrel',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe prasugrel relative to clopidogrel, including activation, potency, resistance, and the ASRA neuraxial hold for this drug.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Prasugrel is a prodrug activated in a single step, in contrast to clopidogrel\'s two-step CYP2C19 activation. It is more potent than clopidogrel and resistance is rare, giving a more reliable antiplatelet effect. Like clopidogrel it binds the P2Y12 receptor irreversibly.' },
        { id: 'kp2', weight: 2, description: 'Because prasugrel is potent and irreversible, the recommended interruption before neuraxial anesthesia is 7 to 10 days, matching the ASRA neuraxial number. This longer window reflects the need to regenerate enough unblocked platelets. The 7 to 10 day figure distinguishes prasugrel from clopidogrel at 7 days and ticagrelor at 5 to 7 days.' },
      ],
      common_errors: [
        'Calling prasugrel direct-acting and reversible, which is ticagrelor',
        'Saying prasugrel is weaker than clopidogrel',
        'Giving the prasugrel hold as 5 to 7 days instead of 7 to 10 days',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Prasugrel',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Prasugrel' },
  },

  {
    id: 'atom-ace-ticagrelor',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe ticagrelor\'s mechanism, including how it binds P2Y12, what its effect duration tracks, and its ASRA neuraxial hold for this drug.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Ticagrelor is direct-acting and binds P2Y12 reversibly, so unlike the prodrugs clopidogrel and prasugrel it does not require hepatic activation. Because the binding is reversible, its antiplatelet effect tracks the drug half-life rather than the platelet lifespan. This is the defining contrast with the irreversible thienopyridine prodrugs.' },
        { id: 'kp2', weight: 2, description: 'Since the effect follows drug clearance, ticagrelor is interrupted 5 to 7 days before neuraxial anesthesia, the ASRA neuraxial number. This shorter window relative to prasugrel reflects reversible rather than irreversible binding. The 5 to 7 day figure separates ticagrelor from clopidogrel at 7 days and prasugrel at 7 to 10 days.' },
      ],
      common_errors: [
        'Calling ticagrelor a prodrug or irreversibly bound',
        'Saying its effect tracks platelet lifespan rather than drug half-life',
        'Giving the ticagrelor hold as 7 to 10 days instead of 5 to 7 days',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Ticagrelor',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Ticagrelor' },
  },

  {
    id: 'atom-ace-dapt-definition',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Define dual antiplatelet therapy after coronary stenting and explain why it is needed.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Dual antiplatelet therapy (DAPT) is aspirin plus a P2Y12 inhibitor given after stent placement. It combines two different antiplatelet mechanisms, COX-1 inhibition and ADP receptor blockade, rather than two drugs of the same class or an anticoagulant. This pairing is the standard regimen after percutaneous coronary intervention.' },
        { id: 'kp2', weight: 2, description: 'DAPT is needed because the stent is a thrombogenic foreign body until endothelium grows over it, a process that takes weeks to months. During that window the exposed metal can trigger platelet-mediated thrombosis, so dual inhibition protects the stent. Aspirin is then continued indefinitely in most patients even after the P2Y12 inhibitor is stopped.' },
      ],
      common_errors: [
        'Defining DAPT as aspirin plus warfarin or aspirin plus heparin',
        'Saying DAPT means two P2Y12 inhibitors together',
        'Forgetting that the rationale is endothelialization of a thrombogenic stent',
      ],
      minimum_passing_score: 60,
    },
    topic: 'DAPT definition',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'DAPT definition' },
  },

  {
    id: 'atom-ace-stent-duration',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the minimum DAPT duration for a bare-metal stent and the DAPT durations for a current-generation drug-eluting stent in stable disease versus acute coronary syndrome.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'A bare-metal stent requires a minimum of 30 days of dual antiplatelet therapy, the shortest of the stent durations because it endothelializes relatively quickly. This 30 day floor is the key bare-metal stent number. Aspirin continues indefinitely afterward in most patients.' },
        { id: 'kp2', weight: 2, description: 'A current-generation drug-eluting stent requires 3 months of DAPT for stable disease and 6 to 12 months for acute coronary syndrome. The longer durations reflect delayed endothelialization from the antiproliferative drug coating and higher thrombotic risk in ACS. These figures contrast with the 30 day bare-metal minimum.' },
      ],
      common_errors: [
        'Giving the bare-metal stent minimum as 6 or 12 months',
        'Swapping the stable disease and ACS drug-eluting durations',
        'Stating that DAPT is lifelong rather than aspirin alone continuing indefinitely',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Stent DAPT duration',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Stent DAPT duration' },
  },

  {
    id: 'atom-ace-operative-dapt',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the consequence of stopping the P2Y12 inhibitor early within the DAPT window and the resulting scheduling rule for elective surgery.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Stopping the P2Y12 inhibitor early during the DAPT window can precipitate in-stent thrombosis and ST-elevation myocardial infarction, with reported mortality of 20 to 40 percent. This is an acute catastrophic thrombotic event, not slow restenosis. The high mortality is what makes premature discontinuation so dangerous.' },
        { id: 'kp2', weight: 2, description: 'Because of this risk, elective surgery should be deferred until the DAPT window is complete rather than stopping the P2Y12 inhibitor to operate. Bridging strategies for genuinely urgent surgery exist but are taught in the cardiac anesthesia material and are not a license for elective cases. The governing principle is to wait out the window for anything elective.' },
      ],
      common_errors: [
        'Underestimating the mortality as under 1 percent',
        'Describing the harm as bleeding rather than stent thrombosis and STEMI',
        'Proceeding with elective surgery by stopping the P2Y12 inhibitor early',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Operative DAPT question',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Operative DAPT question' },
  },

  {
    id: 'atom-ace-gp2b3a-target',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the molecular target of glycoprotein IIb/IIIa antagonists and where this sits in platelet aggregation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Glycoprotein IIb/IIIa antagonists block the fibrinogen receptor on the activated platelet. Fibrinogen normally crosslinks adjacent activated platelets through this receptor, so blocking it prevents the bridging that holds the aggregate together. This is a distinct target from COX-1 and from P2Y12.' },
        { id: 'kp2', weight: 2, description: 'The fibrinogen receptor is the final common pathway of platelet aggregation, the convergence point downstream of both thromboxane and ADP signaling. Blocking it therefore inhibits aggregation regardless of the upstream activating stimulus, making these the most potent antiplatelet agents. This final-common-pathway position explains their potency and their bleeding risk.' },
      ],
      common_errors: [
        'Saying GP IIb/IIIa antagonists block P2Y12 or COX-1',
        'Confusing the GP IIb/IIIa fibrinogen receptor with the GP Ib von Willebrand receptor',
        'Forgetting that this is the final common pathway of aggregation',
      ],
      minimum_passing_score: 60,
    },
    topic: 'GP IIb/IIIa target',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'GP IIb/IIIa target' },
  },

  {
    id: 'atom-ace-gp2b3a-agents',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Distinguish the three glycoprotein IIb/IIIa antagonists by drug type and recovery, and name the adverse effect they share.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Abciximab is a monoclonal antibody with platelet recovery of 24 to 48 hours, the longest of the three. Eptifibatide is a peptide and tirofiban is a non-peptide, both with short half-lives and correspondingly faster recovery. The antibody versus small-molecule distinction explains the difference in recovery time.' },
        { id: 'kp2', weight: 2, description: 'All three agents can cause thrombocytopenia, which is the shared class adverse effect to watch for. The class has been largely supplanted by oral P2Y12 inhibitors plus cangrelor, an intravenous reversible P2Y12 agent. Recognizing thrombocytopenia and the modern shift away from these drugs are the two practical points.' },
      ],
      common_errors: [
        'Calling abciximab a peptide or giving it a short half-life',
        'Forgetting that all three can cause thrombocytopenia',
        'Confusing cangrelor, a P2Y12 inhibitor, with a GP IIb/IIIa antagonist',
      ],
      minimum_passing_score: 60,
    },
    topic: 'GP IIb/IIIa agents',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'GP IIb/IIIa agents' },
  },

  {
    id: 'atom-ace-asra-rationale',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Name the complication the ASRA neuraxial timing guidelines exist to prevent and cite the governing reference.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The ASRA neuraxial timing rules exist to prevent epidural hematoma in the anticoagulated patient, a rare but devastating and preventable complication that can end careers. It is the bleeding catastrophe of regional anesthesia, not a headache or transient neurologic symptom. The guiding clinical maxim is that if you cannot remember a number, you do not do the block.' },
        { id: 'kp2', weight: 2, description: 'The reference is the American Society of Regional Anesthesia and Pain Medicine guideline, 4th edition, by Horlocker and colleagues, published in 2018. Knowing the source anchors the specific timing numbers that follow. This edition is the standard cited authority for neuraxial anticoagulation timing.' },
      ],
      common_errors: [
        'Naming postdural puncture headache as the complication being prevented',
        'Citing a different society or an older edition than the 2018 4th edition',
        'Forgetting the rule to skip the block when a number is uncertain',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ASRA rationale',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ASRA rationale' },
  },

  {
    id: 'atom-ace-asra-aspirin',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the ASRA neuraxial recommendation for a patient on aspirin alone.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'ASRA places no neuraxial restriction on a patient taking aspirin alone, so a spinal or epidural may proceed without a hold. This is consistent with the broader teaching that aspirin is not a contraindication to neuraxial anesthesia. Aspirin alone is the one antiplatelet that requires no interruption for neuraxial procedures.' },
        { id: 'kp2', weight: 2, description: 'The no-restriction rule applies to aspirin as a single agent and not to aspirin combined with a P2Y12 inhibitor, where the P2Y12 hold governs. Aspirin is also not monitored by the prothrombin time, so no lab threshold gates the block. The contrast with the P2Y12 holds is the key testable distinction.' },
      ],
      common_errors: [
        'Imposing a 7 day or 24 hour hold for aspirin alone',
        'Applying the no-restriction rule when a P2Y12 inhibitor is also on board',
        'Believing a normal PT must be documented before neuraxial on aspirin',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ASRA aspirin',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ASRA aspirin' },
  },

  {
    id: 'atom-ace-asra-clopidogrel',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the ASRA neuraxial hold for clopidogrel and contrast it with prasugrel and ticagrelor.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'ASRA recommends holding clopidogrel for 7 days before a neuraxial procedure. This reflects its irreversible P2Y12 binding, which requires regeneration of unblocked platelets over roughly a week. Seven days is the specific clopidogrel number to memorize.' },
        { id: 'kp2', weight: 2, description: 'The clopidogrel 7 day hold sits between the other two P2Y12 numbers: prasugrel at 7 to 10 days and ticagrelor at 5 to 7 days. Prasugrel is longer because it is more potent and irreversible, and ticagrelor is shorter because it is reversible. Keeping these three numbers distinct is the high-yield point.' },
      ],
      common_errors: [
        'Giving the clopidogrel hold as 5 to 7 days or 7 to 10 days',
        'Holding clopidogrel only 24 hours',
        'Confusing clopidogrel timing with prasugrel or ticagrelor timing',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ASRA clopidogrel',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ASRA clopidogrel' },
  },

  {
    id: 'atom-ace-asra-prasugrel',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the ASRA neuraxial hold for prasugrel and explain why it is longer than for ticagrelor.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'ASRA recommends holding prasugrel for 7 to 10 days before a neuraxial procedure, the longest of the three P2Y12 windows. This reflects its high potency and irreversible binding to P2Y12. Seven to ten days is the specific prasugrel number.' },
        { id: 'kp2', weight: 2, description: 'Prasugrel requires a longer hold than ticagrelor because prasugrel binds irreversibly, so recovery depends on platelet turnover, whereas ticagrelor binds reversibly and clears with the drug, needing only 5 to 7 days. The mechanism therefore explains the timing difference. This contrast is a favored test point.' },
      ],
      common_errors: [
        'Giving the prasugrel hold as 7 days or 5 to 7 days',
        'Saying prasugrel is reversible and therefore needs a shorter hold',
        'Confusing prasugrel timing with clopidogrel timing',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ASRA prasugrel',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ASRA prasugrel' },
  },

  {
    id: 'atom-ace-asra-ticagrelor',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the ASRA neuraxial hold for ticagrelor and the ASRA restart timing for any P2Y12 inhibitor after catheter removal.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'ASRA recommends holding ticagrelor for 5 to 7 days before a neuraxial procedure, the shortest P2Y12 window because ticagrelor binds reversibly and its effect tracks drug clearance. Five to seven days is the specific ticagrelor number, distinct from clopidogrel at 7 days and prasugrel at 7 to 10 days. This shorter interval is a direct consequence of reversible binding.' },
        { id: 'kp2', weight: 2, description: 'After the neuraxial catheter is removed, any of the P2Y12 inhibitors may be restarted 6 hours later. This restart interval is uniform across clopidogrel, prasugrel, and ticagrelor and matches the 6 hour DOAC restart. The 6 hour figure provides margin around catheter manipulation before re-anticoagulating the platelets.' },
      ],
      common_errors: [
        'Giving the ticagrelor hold as 7 to 10 days instead of 5 to 7 days',
        'Stating the P2Y12 restart as 24 hours or immediately rather than 6 hours after catheter removal',
        'Confusing ticagrelor timing with prasugrel timing',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ASRA ticagrelor and restart',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ASRA ticagrelor and restart' },
  },

  {
    id: 'atom-ace-asra-subq-heparin',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the ASRA neuraxial holds for low-dose subcutaneous heparin prophylaxis versus higher-dose or TID subcutaneous heparin.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Low-dose subcutaneous heparin prophylaxis, dosed BID at 10000 units per day or less, requires a 4 to 6 hour hold before a neuraxial procedure. No aPTT documentation is mandated at this low prophylactic dose. The 4 to 6 hour figure is the low-dose subcutaneous number.' },
        { id: 'kp2', weight: 2, description: 'Higher-dose or TID subcutaneous heparin requires a longer 12 hour hold plus documentation of a normal aPTT before the block. The added time and the lab check reflect the greater and more variable anticoagulant effect at higher dosing. The contrast of 4 to 6 hours versus 12 hours plus a normal aPTT is the key distinction.' },
      ],
      common_errors: [
        'Applying the 12 hour rule to low-dose BID prophylaxis',
        'Omitting the normal aPTT requirement for higher-dose or TID dosing',
        'Confusing subcutaneous heparin timing with LMWH timing',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ASRA subcutaneous heparin',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ASRA subcutaneous heparin' },
  },

  {
    id: 'atom-ace-asra-iv-heparin',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the ASRA neuraxial requirement before a block for intravenous therapeutic heparin.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Intravenous therapeutic heparin requires a 4 to 6 hour hold before a neuraxial procedure, allowing the short heparin half-life of about 1 hour to elapse over several half-lives. This is the same 4 to 6 hour window as low-dose subcutaneous prophylaxis but applied to full IV therapy. The interval is dictated by heparin\'s rapid clearance.' },
        { id: 'kp2', weight: 2, description: 'In addition to the 4 to 6 hour hold, a normal aPTT must be documented before the block, because IV heparin produces a substantial and variable anticoagulant effect that must be confirmed resolved. The aPTT is the correct test for unfractionated heparin. Time plus a normal aPTT together gate the procedure.' },
      ],
      common_errors: [
        'Giving the IV heparin hold as 12 or 24 hours',
        'Omitting the requirement to document a normal aPTT',
        'Using the INR instead of the aPTT to confirm heparin resolution',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ASRA intravenous heparin',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ASRA intravenous heparin' },
  },

  {
    id: 'atom-ace-asra-lmwh',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the ASRA neuraxial holds for prophylactic versus therapeutic low-molecular-weight heparin.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Prophylactic low-molecular-weight heparin requires a 12 hour hold before a neuraxial procedure. This longer interval relative to unfractionated heparin reflects the longer half-life and predominant anti-factor Xa effect of LMWH. Twelve hours is the prophylactic LMWH number.' },
        { id: 'kp2', weight: 2, description: 'Therapeutic low-molecular-weight heparin requires a 24 hour hold, double the prophylactic interval, because the higher dose produces a greater and longer anti-Xa effect that protamine only partially reverses. The 12 versus 24 hour split is the key prophylactic versus therapeutic distinction. These numbers separate LMWH from the 4 to 6 hour unfractionated heparin windows.' },
      ],
      common_errors: [
        'Swapping the prophylactic and therapeutic intervals',
        'Giving the prophylactic LMWH hold as 4 to 6 hours',
        'Confusing LMWH timing with subcutaneous unfractionated heparin timing',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ASRA low-molecular-weight heparin',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ASRA low-molecular-weight heparin' },
  },

  {
    id: 'atom-ace-asra-warfarin',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the ASRA neuraxial requirement for warfarin, including the INR threshold for placing a block and for removing a catheter.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'ASRA requires warfarin be stopped until the INR is below 1.5 before a neuraxial block, which typically takes about 5 days. An INR below 1.5 indicates that enough functional vitamin K dependent clotting factors have recovered for safe neuraxial intervention. The 5 day estimate aligns with the standard preoperative warfarin stop.' },
        { id: 'kp2', weight: 2, description: 'Neuraxial catheters should likewise be pulled only when the INR is below 1.5, applying the same threshold to catheter removal as to block placement. This protects against bleeding during the high-risk catheter manipulation step. The single INR below 1.5 threshold for both placement and removal is the key warfarin number.' },
      ],
      common_errors: [
        'Using an INR threshold of 2.0 or 1.3 instead of below 1.5',
        'Applying the threshold only to placement and not to catheter removal',
        'Forgetting that reaching INR below 1.5 typically takes about 5 days',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ASRA warfarin',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ASRA warfarin' },
  },

  {
    id: 'atom-ace-asra-dabigatran',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the ASRA neuraxial hold for dabigatran and how renal function modifies it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'ASRA recommends holding dabigatran, the direct thrombin inhibitor among the DOACs, for 4 to 5 days before a neuraxial procedure. This is longer than the 72 hour window used for the oral factor Xa inhibitors. Four to five days is the dabigatran-specific number.' },
        { id: 'kp2', weight: 2, description: 'The hold must be extended beyond 4 to 5 days if renal function is impaired, because dabigatran is cleared predominantly by the kidney and accumulates in renal insufficiency. This renal dependence sets dabigatran apart from the factor Xa inhibitors in timing. Lengthening the interval for low creatinine clearance is the key safety point.' },
      ],
      common_errors: [
        'Giving the dabigatran hold as 72 hours like the factor Xa inhibitors',
        'Failing to extend the hold for renal impairment',
        'Confusing dabigatran, a thrombin inhibitor, with the oral factor Xa inhibitors',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ASRA dabigatran',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ASRA dabigatran' },
  },

  {
    id: 'atom-ace-asra-xa-doac',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the ASRA neuraxial hold for the oral direct factor Xa inhibitors and the restart timing for DOACs after catheter removal.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'ASRA recommends a 72 hour hold before a neuraxial procedure for the oral direct factor Xa inhibitors rivaroxaban, apixaban, and edoxaban. All three share the same 72 hour figure, distinct from dabigatran at 4 to 5 days. Seventy-two hours is the number for the oral Xa inhibitors.' },
        { id: 'kp2', weight: 2, description: 'After the neuraxial catheter is removed, a DOAC may be restarted 6 hours later, the same restart interval used for the P2Y12 inhibitors. This applies across both the factor Xa inhibitors and dabigatran once the procedure is complete. The 6 hour restart provides margin around catheter manipulation.' },
      ],
      common_errors: [
        'Giving the oral Xa inhibitor hold as 4 to 5 days like dabigatran',
        'Stating the DOAC restart as 72 hours or immediately rather than 6 hours after catheter removal',
        'Assuming the three oral Xa inhibitors have different preprocedure holds',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ASRA factor Xa inhibitors and restart',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ASRA factor Xa inhibitors and restart' },
  },

  {
    id: 'atom-acf-txa-mechanism',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Explain the molecular mechanism by which tranexamic acid (TXA) produces its antifibrinolytic effect, naming the target molecule and the binding site involved.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'TXA is a lysine analog that competitively occupies the lysine-binding site on plasminogen. Because plasminogen normally docks onto fibrin through these lysine-binding sites, blocking them prevents plasminogen from attaching to fibrin in the first place. This is the same mechanism as epsilon-aminocaproic acid (Amicar), only TXA is more potent.' },
        { id: 'kp2', weight: 2, description: 'With plasminogen unable to bind fibrin, tissue plasminogen activator (tPA) cannot efficiently convert plasminogen to plasmin on the clot surface. Less plasmin means less fibrin breakdown, so the existing clot is preserved. The drug does not create new clot, activate platelets, or boost thrombin generation; it simply shifts the balance away from fibrinolysis.' },
      ],
      common_errors: [
        'Saying TXA directly inhibits thrombin or factor Xa rather than blocking plasminogen',
        'Claiming TXA creates new clot instead of preserving the clot already present',
        'Confusing the lysine-binding site target with a serine protease active site',
      ],
      minimum_passing_score: 60,
    },
    topic: 'TXA mechanism',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'TXA mechanism' },
  },

  {
    id: 'atom-acf-crash2-trial',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Summarize the CRASH-2 trial of tranexamic acid: year and journal, population and size, the TXA dosing regimen and timing window, the all-cause mortality and death-from-bleeding results, and the CRASH-3 extension.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'CRASH-2 was published in the Lancet in 2010 and enrolled 20,211 trauma patients across 40 countries. TXA was given as 1 g over 10 minutes followed by 1 g over 8 hours, and it had to be started within 8 hours of injury versus placebo. This made it a large, pragmatic trial of a cheap, widely available drug.' },
        { id: 'kp2', weight: 2, description: 'All-cause mortality was 14.5% with TXA versus 16.0% with placebo, and death from bleeding was 4.9% versus 5.7%, both favoring TXA. The effect of a cheap drug was large enough that TXA is now in essentially every level-one trauma center\'s massive transfusion protocol. CRASH-3 in 2019 extended demonstrated benefit to isolated traumatic brain injury.' },
      ],
      common_errors: [
        'Citing a 3-hour entry window instead of the 8-hour CRASH-2 window',
        'Mixing up the 14.5 vs 16.0 all-cause mortality with the 4.9 vs 5.7 bleeding-death figures',
        'Attributing the CRASH-3 brain-injury extension to CRASH-2 itself',
      ],
      minimum_passing_score: 60,
    },
    topic: 'CRASH-2 trial',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'CRASH-2 trial' },
  },

  {
    id: 'atom-acf-atacas-trial',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Summarize the ATACAS trial of tranexamic acid in cardiac surgery: year and journal, population and size, the efficacy benefit on transfusion and reoperation, the seizure signal with its magnitude, and the proposed seizure mechanism.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'ATACAS was published in NEJM in 2017 and studied 4,631 CABG patients randomized to tranexamic acid versus placebo. TXA roughly halved transfusion and reduced reoperation for bleeding from 2.8% to 1.4%. These efficacy benefits are why most US cardiac centers now use a 1 g load plus 1 g infusion routinely.' },
        { id: 'kp2', weight: 2, description: 'The trade-off was a sevenfold increase in seizures, 0.7% with TXA versus 0.1% with placebo. The proposed mechanism is GABA-A receptor antagonism at high doses, which removes cortical inhibition and lowers the seizure threshold. The risk is greatest in elderly and open-chamber patients, so centers dose with that awareness.' },
      ],
      common_errors: [
        'Stating seizures fell rather than rose sevenfold with TXA',
        'Attributing TXA seizures to NMDA overactivation instead of GABA-A antagonism',
        'Confusing the ATACAS CABG cohort with the CRASH-2 trauma cohort',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ATACAS trial',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ATACAS trial' },
  },

  {
    id: 'atom-acf-ddavp-mechanism',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe the mechanism, receptor, source organelle, dose, and administration rate of desmopressin (DDAVP) when used for hemostasis, and explain why the infusion rate matters.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'DDAVP is 1-deamino-8-D-arginine vasopressin, a V2 vasopressin receptor analog. Acting on endothelial V2 receptors, it releases stored von Willebrand factor and factor VIII from Weibel-Palade bodies, the endothelial storage organelles. It works by mobilizing endogenous stores, not by supplying exogenous factor concentrate.' },
        { id: 'kp2', weight: 2, description: 'The dose is 0.3 mcg/kg intravenously given over 15 to 30 minutes. A slow infusion is non-negotiable because a rapid push releases other endothelial mediators that cause hypotension. Note the unit is micrograms per kilogram, not milligrams, and the slow rate is a safety requirement, not a convenience.' },
      ],
      common_errors: [
        'Writing the dose as milligrams per kilogram instead of 0.3 mcg/kg',
        'Saying DDAVP supplies exogenous factor VIII rather than releasing stored vWF and factor VIII',
        'Forgetting that a rapid push causes hypotension and giving it as a fast bolus',
      ],
      minimum_passing_score: 60,
    },
    topic: 'DDAVP mechanism',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'DDAVP mechanism' },
  },

  {
    id: 'atom-acf-ddavp-indications',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'List the genuine indications for desmopressin (DDAVP), name its strongest indication, and explain its limited role in routine cardiac surgery with the supporting evidence.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'DDAVP genuinely helps in type 1 von Willebrand disease, which is its strongest indication, as well as mild hemophilia A and uremic platelet dysfunction. These share a theme of releasable or dysfunctional vWF and factor VIII or a platelet-function defect that DDAVP can partly correct. It does nothing for warfarin or for factor-deficient bleeding that needs replacement.' },
        { id: 'kp2', weight: 2, description: 'DDAVP is not a routine cardiac surgery rescue. A meta-analysis of 18 trials and roughly 1,300 patients showed a median reduction in blood loss of only about 115 mL. That marginal benefit is why it is not reached for reflexively after bypass; targeted use in its true indications is where it earns its place.' },
      ],
      common_errors: [
        'Listing severe hemophilia B as a DDAVP indication instead of mild hemophilia A',
        'Treating DDAVP as a first-line routine post-bypass rescue agent',
        'Forgetting the ~115 mL blood-loss figure that defines its weak cardiac benefit',
      ],
      minimum_passing_score: 60,
    },
    topic: 'DDAVP indications',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'DDAVP indications' },
  },

  {
    id: 'atom-acf-fibrinogen-substrate',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe fibrinogen as a coagulation substrate: its role relative to thrombin, its molecular size and source, its half-life, its normal range, and how pregnancy and postpartum hemorrhage affect it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Fibrinogen is the substrate that thrombin cleaves into fibrin, the molecule that stabilizes the platelet plug into a real clot. It is a 340-kDa hepatic glycoprotein with a long half-life of about 3.7 days, fitting its role as an abundant structural precursor. It is not an enzyme and is not vitamin K dependent.' },
        { id: 'kp2', weight: 2, description: 'The normal fibrinogen range is 200 to 400 mg/dL. Pregnancy raises it above 400 in the third trimester, so a precipitous fibrinogen drop during postpartum hemorrhage is an early warning sign, sometimes before the absolute number even looks abnormal. Recognizing that elevated baseline is key to catching consumptive coagulopathy early.' },
      ],
      common_errors: [
        'Calling fibrinogen an enzyme or a vitamin K dependent factor',
        'Giving a normal range other than 200 to 400 mg/dL',
        'Saying pregnancy lowers fibrinogen rather than raising it above 400',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Fibrinogen substrate',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Fibrinogen substrate' },
  },

  {
    id: 'atom-acf-fibrinogen-repletion',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'State the fibrinogen replacement target in a bleeding patient and compare the options: cryoprecipitate dosing and expected rise, fibrinogen concentrate, and why fresh frozen plasma is a poor source.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'In a bleeding patient the target is to keep fibrinogen above roughly 150 to 200 mg/dL. Cryoprecipitate is standard US practice, dosed at 1 unit per 10 kg, which raises fibrinogen by about 50 to 70 mg/dL. Fibrinogen concentrate (RiaSTAP) is routine in European cardiac centers but used off-label in the US for acquired hypofibrinogenemia.' },
        { id: 'kp2', weight: 2, description: 'Fresh frozen plasma is a poor source for repleting fibrinogen because its own fibrinogen concentration is only about 200 mg/dL. To raise a low fibrinogen meaningfully with FFP would require a large, impractical volume, which is why concentrated products are preferred. The lesson is to use cryoprecipitate or fibrinogen concentrate, not FFP, when fibrinogen is the deficit.' },
      ],
      common_errors: [
        'Quoting a cryoprecipitate rise far above or below 50 to 70 mg/dL per 1 unit per 10 kg',
        'Treating FFP as a strong fibrinogen source despite its ~200 mg/dL content',
        'Forgetting the above 150 to 200 mg/dL bleeding target',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Fibrinogen repletion',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Fibrinogen repletion' },
  },

  {
    id: 'atom-acf-pcc-content-role',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe prothrombin complex concentrates: the contents and primary role of 4-factor PCC (Kcentra), how 3-factor PCCs differ, and what FEIBA is used for.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: '4-factor PCC (Kcentra) contains coagulation factors II, VII, IX, and X plus proteins C, S, and antithrombin. It is first-line for urgent warfarin reversal and is also used off-label for direct factor Xa inhibitor reversal when andexanet alfa is unavailable. Its concentrated, low-volume nature makes it superior to FFP for rapid correction.' },
        { id: 'kp2', weight: 2, description: '3-factor PCCs such as Profilnine and Bebulin are low in factor VII, making them less useful for warfarin reversal than 4-factor products. FEIBA is an activated PCC used in hemophilia patients with inhibitors, a distinct indication. Distinguishing 4-factor from 3-factor and from the activated FEIBA product is the key concept.' },
      ],
      common_errors: [
        'Listing only II, IX, X for 4-factor PCC, which is actually the 3-factor profile',
        'Forgetting that 4-factor PCC also carries proteins C, S, and antithrombin',
        'Confusing FEIBA, an activated PCC for inhibitors, with standard non-activated PCC',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Prothrombin complex concentrates',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Prothrombin complex concentrates' },
  },

  {
    id: 'atom-acf-rfviia',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Describe recombinant factor VIIa (NovoSeven): its approved indications, its thrombotic risk profile in non-hemophilia patients, and why its effect on the INR in warfarin patients is misleading.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Recombinant factor VIIa (NovoSeven) is approved for hemophilia A or B with inhibitors, factor VII deficiency, and Glanzmann thrombasthenia. Off-label use for refractory life-threatening hemorrhage is widespread but carries real thrombotic risk in non-hemophilia patients, with 54% of events arterial and 72% of associated deaths from thrombosis. This is why it should be reserved for true rescue.' },
        { id: 'kp2', weight: 2, description: 'In warfarin patients rFVIIa normalizes the INR without correcting the underlying multifactor defect, producing a misleading lab value that can give false reassurance. Because of this and its thrombotic risk, prothrombin complex concentrate is preferred for warfarin reversal. rFVIIa is a last-ditch rescue, not a routine reversal agent.' },
      ],
      common_errors: [
        'Claiming rFVIIa corrects the warfarin defect rather than just normalizing the INR cosmetically',
        'Stating rFVIIa carries no thrombotic risk in non-hemophilia patients',
        'Preferring rFVIIa over PCC for routine warfarin reversal',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Recombinant factor VIIa',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Recombinant factor VIIa' },
  },

  {
    id: 'atom-acf-case1-apixaban',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'For Case 1 (78-year-old, hip fracture, apixaban for atrial fibrillation, last dose 12 hours ago, CrCl 55, OR in 6 hours), state the neuraxial decision and its ASRA basis, the PAUSE surgical-timing point with the hip-fracture caveat, and the bleeding rescue plan.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'ASRA requires 72 hours off apixaban before neuraxial placement, so with only 12 hours elapsed a spinal is ruled out and the patient receives general anesthesia. The PAUSE protocol recommends stopping a DOAC 2 days before a high-bleeding-risk procedure, but a hip fracture cannot safely wait 48 hours given its own mortality conversation. The team therefore proceeds with general anesthesia, blood available, and monitoring for bleeding.' },
        { id: 'kp2', weight: 2, description: 'Because apixaban cannot be neutralized by protamine or vitamin K, the rescue plan if bleeding becomes life-threatening is off-label 4-factor PCC or andexanet alfa, the recombinant decoy factor Xa. The decision balances the urgency of the hip fracture against residual anticoagulant effect. Andexanet or PCC stands ready rather than being given prophylactically.' },
      ],
      common_errors: [
        'Allowing a spinal at 12 hours instead of honoring the 72-hour ASRA rule for apixaban',
        'Reaching for protamine or vitamin K to reverse the apixaban',
        'Forgetting that hip fractures cannot wait the full 48-hour PAUSE hold',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Case 1 apixaban hip fracture',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Case 1 apixaban hip fracture' },
  },

  {
    id: 'atom-acf-case3-bypass-bleeding',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'For Case 3 (off pump, ACT 180, platelets 95k, fibrinogen 110 mg/dL, chest tubes climbing), explain why more protamine is wrong, the targeted product for each deficit, the role of TXA, and the next diagnostic step for persistent bleeding.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'An ACT of 180 is back in range, so residual heparin is not driving the bleeding and more protamine would only add its own coagulopathy. The targeted corrections are to transfuse platelets for the count of 95k and to give cryoprecipitate or fibrinogen concentrate for the fibrinogen of 110, which is below the 150 threshold. Tranexamic acid should be added if it has not already been given.' },
        { id: 'kp2', weight: 2, description: 'If bleeding persists despite these targeted products, the next step is viscoelastic testing, thromboelastography or rotational thromboelastometry, to see what is actually broken rather than continuing to give blind product. This shifts management from empiric to data-driven. The case reinforces that an in-range ACT removes more protamine from the menu entirely.' },
      ],
      common_errors: [
        'Giving more protamine despite an in-range ACT of 180',
        'Using platelets to fix fibrinogen or cryoprecipitate to fix the platelet count',
        'Continuing empiric products instead of moving to TEG or ROTEM for persistent bleeding',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Case 3 post-bypass bleeding',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Case 3 post-bypass bleeding' },
  },

  {
    id: 'atom-acf-case5-warfarin-ich',
    type: 'recall',
    tier: 'atom',
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'For Case 5 (80-year-old on warfarin, INR 4.1, GCS 8, suspected intracranial hemorrhage), state the primary reversal agent and weight-based dose, the adjunct and its timing, the INR recheck interval, and why FFP is the wrong choice.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The primary reversal for warfarin-associated intracranial hemorrhage is weight-based 4-factor PCC at 25 to 50 units/kg, given with IV vitamin K 10 mg slowly as a durable adjunct because the PCC effect is transient. The INR is rechecked at 30 minutes and neurosurgery is called to the bedside. Speed matters because this is a life-threatening, time-critical bleed.' },
        { id: 'kp2', weight: 2, description: 'Fresh frozen plasma is the wrong tool here because it is too slow to thaw and infuse and requires too much volume in an elderly patient, and its own INR of 1.4 to 1.6 cannot even get below 1.5. The concentrated, rapidly acting, low-volume 4-factor PCC is exactly what this emergency demands. FFP would waste the narrow window for reversing an intracranial bleed.' },
      ],
      common_errors: [
        'Choosing FFP first despite its slow speed and large volume in warfarin ICH',
        'Omitting IV vitamin K, leaving only the transient PCC effect',
        'Quoting a PCC dose other than the weight-based 25 to 50 units/kg',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Case 5 warfarin trauma',
    chapter: 'ap1-wk-4',
    difficulty: 1,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Case 5 warfarin trauma' },
  },

];
