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

];
