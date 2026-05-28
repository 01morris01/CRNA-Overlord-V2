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

];
