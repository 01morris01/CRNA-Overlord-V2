export const RECALL_QUESTIONS_ADV_PHARMACOLOGY_1 = [

  // 1a. Receptor Theory — Agonist Spectrum and Buprenorphine — ap1-wk-1
  {
    id: 'r-ap1-w1-1a',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-partial-agonist-ceiling-1', 'atom-partial-agonist-competition-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'A patient on chronic buprenorphine therapy presents for emergency surgery requiring potent opioid analgesia. Explain the agonist spectrum from full agonist through partial agonist, and describe why buprenorphine complicates pain management when a full agonist like fentanyl is administered.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Full agonists bind and maximally activate receptors (stabilize R* conformation), producing the ceiling of pharmacologic response' },  // source: ap1-w1-002, ap1-w1-001
        { id: 'kp2', weight: 1, description: 'Partial agonists have lower intrinsic efficacy — they activate receptors submaximally even at 100% occupancy, producing a ceiling effect below full agonist Emax' },  // source: ap1-w1-006
        { id: 'kp3', weight: 2, description: 'In the presence of a full agonist, a partial agonist competes for receptors and displaces the full agonist, reducing the net maximal response — buprenorphine can precipitate withdrawal by displacing morphine/fentanyl from mu receptors' },  // source: ap1-w1-007, ap1-w1-061 (CRITICAL)
      ],
      common_errors: [
        'Confusing affinity (how tightly a drug binds) with efficacy (capacity to activate once bound) — some antagonists have very high affinity',  // from ap1-w1-006 rationale
        'Stating that partial agonists always have lower affinity than full agonists (affinity is independent of intrinsic activity)',  // from ap1-w1-006 wrong answer B
      ],
      minimum_passing_score: 60,
    },
    topic: 'receptor-theory',
    chapter: 'ap1-wk-1',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 2, Vandivier lecture',
      topic: 'receptor-theory',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 1b. Receptor Theory — Antagonist Types — ap1-wk-1
  {
    id: 'r-ap1-w1-1b',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-competitive-antag-1', 'atom-noncompetitive-antag-1', 'atom-inverse-agonism-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Describe the three types of receptor antagonism: competitive, noncompetitive, and inverse agonism. For each, explain the mechanism and give a clinical example relevant to anesthesia.',
    rubric: {
      key_points: [
        { id: 'kp4', weight: 1, description: 'Competitive antagonists bind R and R* equally without shifting baseline activity; they can be overcome by increasing agonist concentration (surmountable)' },  // source: ap1-w1-004, ap1-w1-008
        { id: 'kp5', weight: 1, description: 'Inverse agonists stabilize the inactive R conformation and reduce constitutive receptor activity below resting baseline' },  // source: ap1-w1-003, ap1-w1-005
        { id: 'kp6', weight: 2, description: 'Noncompetitive antagonism (allosteric or irreversible binding) depresses the maximum of the dose-response curve and cannot be overcome by increasing agonist dose; phenoxybenzamine before pheochromocytoma resection is the clinical example' },  // source: ap1-w1-008
      ],
      common_errors: [
        'Claiming competitive antagonism is insurmountable (it is surmountable by increasing agonist concentration)',  // from ap1-w1-004, ap1-w1-008
        'Confusing inverse agonists with competitive antagonists — inverse agonists reduce baseline activity, antagonists merely block agonist access',  // from ap1-w1-003 rationale
      ],
      minimum_passing_score: 60,
    },
    topic: 'receptor-theory',
    chapter: 'ap1-wk-1',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 2, Vandivier lecture',
      topic: 'receptor-theory',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 2. Receptor Regulation — ap1-wk-1
  {
    id: 'r-ap1-w1-2',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-bidirectional-regulation-1', 'atom-extrajunctional-achr-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'You are called to provide anesthesia for three patients in sequence: (1) a spinal cord injury patient 3 weeks post-injury needing debridement, (2) a pheochromocytoma resection after chronic catecholamine excess, and (3) a preterm labor patient who stopped responding to terbutaline after 48 hours of continuous infusion. For each patient, explain the receptor regulation mechanism responsible for the clinical problem and describe how it changes your anesthetic approach.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'SCI patient: denervation causes upregulation and proliferation of extrajunctional (fetal-type) nicotinic AChRs across the entire muscle membrane; succinylcholine depolarizes all these receptors simultaneously, causing massive potassium efflux and potentially fatal hyperkalemia — succinylcholine is contraindicated from ~48 hours to 6+ months after injury' },  // source: ap1-w1-010 (CRITICAL)
        { id: 'kp2', weight: 1, description: 'Pheochromocytoma patient: chronic catecholamine excess drives alpha-adrenergic receptor downregulation and desensitization through phosphorylation and internalization; after tumor removal, loss of high catecholamines combined with downregulated receptors produces profound refractory hypotension' },  // source: ap1-w1-011
        { id: 'kp3', weight: 1, description: 'Terbutaline patient: continuous beta-agonist exposure triggers receptor downregulation (tachyphylaxis/desensitization) via receptor phosphorylation, internalization, and decreased synthesis — the cell reduces responsiveness to protect against overstimulation' },  // source: ap1-w1-009, ap1-w1-071
        { id: 'kp4', weight: 1, description: 'Corticosteroids reverse beta-receptor tachyphylaxis by promoting beta-receptor gene transcription and restoring receptor density on the cell surface' },  // source: ap1-w1-012
        { id: 'kp5', weight: 1, description: 'The bidirectional principle: chronic agonist stimulation causes downregulation; chronic antagonist exposure or denervation causes upregulation — opposite directions of the same adaptive mechanism' },  // source: ap1-w1-009, ap1-w1-010
      ],
      common_errors: [
        'Stating succinylcholine hyperkalemia risk begins immediately after SCI (risk begins at ~48 hours when receptor proliferation starts)',  // from ap1-w1-010 rationale
        'Confusing the mechanism with rhabdomyolysis rather than extrajunctional receptor proliferation',  // from ap1-w1-010 wrong answers
        'Claiming that chronic agonist exposure causes receptor upregulation (it causes downregulation; upregulation occurs with chronic blockade or denervation)',  // from ap1-w1-011 wrong answer A
      ],
      minimum_passing_score: 60,
    },
    topic: 'receptor-regulation',
    chapter: 'ap1-wk-1',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 2, Vandivier lecture',
      topic: 'receptor-regulation',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 3a. Compartment Model — Bolus Distribution and Redistribution — ap1-wk-1
  {
    id: 'r-ap1-w1-3a',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-central-compartment-1', 'atom-redistribution-1', 'atom-csht-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'A 72-year-old patient receives a single IV bolus of propofol for induction and wakes up in 8 minutes. Using the pharmacokinetic compartment model, explain where the drug goes immediately after injection, why the patient wakes up so quickly despite minimal hepatic metabolism, and what context-sensitive half-time measures.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'After IV bolus, drug initially distributes into the central compartment (blood and vessel-rich group: brain, heart, kidneys, liver), which receives ~75% of cardiac output despite being only ~10% of body mass' },  // source: ap1-w1-018, ap1-w1-021
        { id: 'kp2', weight: 2, description: 'Single-bolus awakening is due to redistribution: propofol rapidly moves from the highly perfused brain to less-perfused peripheral tissues (muscle, then fat), causing brain concentration to fall below the threshold for unconsciousness — hepatic metabolism is too slow to account for rapid awakening' },  // source: ap1-w1-020 (CRITICAL)
        { id: 'kp3', weight: 1, description: 'Context-sensitive half-time (CSHT) is the time for plasma concentration to fall 50% after stopping an infusion of a given duration; it accounts for the complex interplay of redistribution and elimination that changes with infusion length' },  // source: ap1-w1-022, ap1-w1-054
      ],
      common_errors: [
        'Attributing rapid single-bolus awakening to fast hepatic metabolism rather than redistribution',  // from ap1-w1-020 wrong answer A
        'Confusing the central compartment with the effect site (biophase) compartment',  // from ap1-w1-018 wrong answers
      ],
      minimum_passing_score: 60,
    },
    topic: 'pk-compartment-model',
    chapter: 'ap1-wk-1',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 2, Vandivier lecture',
      topic: 'pk-compartment-model',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 3b. Compartment Model — Prolonged Infusion, Pulmonary Uptake, Special Populations — ap1-wk-1
  {
    id: 'r-ap1-w1-3b',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-peripheral-saturation-1', 'atom-pulmonary-uptake-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'A patient on a 4-hour propofol TIVA infusion takes 25 minutes to emerge despite the same drug producing 8-minute awakening after a single bolus. Explain the compartment model mechanism behind prolonged emergence after extended infusions, the role of first-pass pulmonary uptake in buffering peak concentrations of lipophilic drugs, and why elderly and hypovolemic patients require dose reduction.',
    rubric: {
      key_points: [
        { id: 'kp4', weight: 1, description: 'After prolonged infusion, peripheral compartments (muscle, fat) progressively saturate with drug, eliminating the redistribution gradient; recovery now depends on slower hepatic metabolism, explaining the longer emergence' },  // source: ap1-w1-022, ap1-w1-054
        { id: 'kp5', weight: 1, description: 'First-pass pulmonary uptake buffers peak arterial concentration of lipophilic drugs — fentanyl undergoes 65-75% first-pass pulmonary uptake, protecting the brain and heart from acute concentration spikes' },  // source: ap1-w1-019
        { id: 'kp6', weight: 1, description: 'Elderly and hypovolemic patients have smaller effective central compartments, producing higher initial peak concentrations from the same bolus dose — dose reduction is required' },  // source: ap1-w1-073
      ],
      common_errors: [
        'Stating that all IV drugs accumulate equally with prolonged infusion (remifentanil has a flat CSHT of ~3-5 min regardless of duration)',  // from ap1-w1-022 rationale
        'Assuming elderly sensitivity is purely pharmacodynamic when a major component is the pharmacokinetic reduction in central compartment volume',  // from ap1-w1-073 rationale
      ],
      minimum_passing_score: 60,
    },
    topic: 'pk-compartment-model',
    chapter: 'ap1-wk-1',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 2, Vandivier lecture',
      topic: 'pk-compartment-model',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 4. Protein Binding — ap1-wk-1
  {
    id: 'r-ap1-w1-4',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-aag-acute-phase-1', 'atom-displacement-criteria-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'A postoperative patient with sepsis is receiving a lidocaine infusion for visceral pain. The surgical team asks why the same dose that controlled pain yesterday is now inadequate. A second patient — a neonate — develops kernicterus after receiving sulfonamides. Walk through the protein binding principles that explain both scenarios, including the criteria for clinically significant drug displacement.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Only the free (unbound) fraction of a drug can cross membranes, bind receptors, and produce pharmacologic effect; protein-bound drug is pharmacologically inert and serves as a circulating reservoir' },  // source: ap1-w1-024, ap1-w1-075
        { id: 'kp2', weight: 1, description: 'Acidic drugs (warfarin, phenytoin, NSAIDs) bind primarily to albumin; basic drugs (lidocaine, propranolol) bind primarily to alpha-1 acid glycoprotein (AAG)' },  // source: ap1-w1-023
        { id: 'kp3', weight: 2, description: 'AAG is an acute-phase reactant that rises 2-5 fold during sepsis, surgery, and inflammation; increased AAG raises lidocaine binding capacity, reducing the free active fraction and diminishing analgesic effect despite same total dose' },  // source: ap1-w1-027 (CRITICAL)
        { id: 'kp4', weight: 1, description: 'Drug displacement is clinically significant only when three criteria coincide: >90% protein bound, narrow therapeutic index, AND small volume of distribution — warfarin is the classic example' },  // source: ap1-w1-025
        { id: 'kp5', weight: 1, description: 'Neonatal kernicterus: sulfonamides displace unconjugated bilirubin from albumin binding sites; free bilirubin crosses the immature blood-brain barrier and deposits in basal ganglia — this is why sulfonamides are contraindicated in neonates' },  // source: ap1-w1-026
      ],
      common_errors: [
        'Assuming all drug displacement is clinically significant (only relevant with high binding + narrow TI + small Vd)',  // from ap1-w1-025 wrong answers
        'Confusing AAG direction in inflammation — AAG rises (not falls) in sepsis/surgery/trauma',  // from ap1-w1-027 wrong answer A
        'Stating that protein-bound drug is pharmacologically active (only the free fraction is active)',  // from ap1-w1-024 wrong answer B
      ],
      minimum_passing_score: 60,
    },
    topic: 'protein-binding',
    chapter: 'ap1-wk-1',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 2, Vandivier lecture',
      topic: 'protein-binding',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 5. Drug Absorption and Bioavailability — ap1-wk-1
  {
    id: 'r-ap1-w1-5',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ionization-membrane-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'A patient with an infected finger abscess reports that local anesthetic infiltration at the abscess site provided no relief. The surgeon also notes that oral morphine dose is much higher than the IV morphine dose for equivalent analgesia. Explain the pharmacologic principles of absorption, ionization, and first-pass metabolism that account for both observations, and identify which routes of administration bypass first-pass effect.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Only the nonionized (uncharged) form of a drug can passively diffuse across lipid cell membranes; the ionized form is trapped by the lipid bilayer' },  // source: ap1-w1-046, ap1-w1-074
        { id: 'kp2', weight: 2, description: 'Local anesthetics are weak bases — in the acidic environment of an abscess (pH 5-6), Henderson-Hasselbalch shifts equilibrium toward the ionized (protonated) form, preventing membrane penetration to reach intracellular sodium channel binding sites' },  // source: ap1-w1-048 (CRITICAL)
        { id: 'kp3', weight: 1, description: 'IV bioavailability is 100% by definition; oral morphine bioavailability is only ~25-30% because extensive first-pass hepatic metabolism degrades the drug before it reaches systemic circulation' },  // source: ap1-w1-049, ap1-w1-050
        { id: 'kp4', weight: 1, description: 'Sublingual absorption bypasses first-pass metabolism because sublingual veins drain into the superior vena cava via the internal jugular system, not into the portal circulation; nitroglycerin uses this route because its oral bioavailability is <1%' },  // source: ap1-w1-050
        { id: 'kp5', weight: 1, description: 'Lower-third rectal absorption also partially bypasses first-pass metabolism via inferior rectal veins draining into the systemic circulation rather than the portal system' },  // source: ap1-w1-050
      ],
      common_errors: [
        'Claiming the drug binds to pus proteins rather than identifying ionization as the mechanism of abscess block failure',  // from ap1-w1-048 wrong answer A
        'Stating that bacteria metabolize the local anesthetic rather than recognizing the pH-ionization shift',  // from ap1-w1-048 wrong answer C
        'Confusing bioavailability with potency — bioavailability is the fraction reaching systemic circulation, not a measure of drug effect',  // from ap1-w1-049 rationale
      ],
      minimum_passing_score: 60,
    },
    topic: 'absorption-bioavailability',
    chapter: 'ap1-wk-1',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 2, Vandivier lecture',
      topic: 'absorption-bioavailability',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 6a. Hepatic Drug Metabolism — Phase I, Phase II, and CYP3A4 — ap1-wk-1
  {
    id: 'r-ap1-w1-6a',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-cyp3a4-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Walk through the two phases of hepatic drug metabolism. Explain the function of Phase I reactions and Phase II conjugation, identify the single most important cytochrome P450 isoenzyme for anesthesia drugs, and give examples of clinically significant inhibitors and inducers that alter its activity.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Phase I reactions (oxidation, reduction, hydrolysis) expose or introduce functional groups, preparing the molecule for conjugation; these may produce active or toxic metabolites' },  // source: ap1-w1-030
        { id: 'kp2', weight: 1, description: 'Phase II reactions are conjugation reactions (most commonly glucuronidation by UDP-glucuronosyltransferase); they attach polar groups producing highly water-soluble, usually inactive metabolites for renal/biliary excretion' },  // source: ap1-w1-037
        { id: 'kp3', weight: 2, description: 'CYP3A4 is the most abundant hepatic CYP isoenzyme (~50% of all drug metabolism); it metabolizes fentanyl, sufentanil, alfentanil, and midazolam; inhibitors (ketoconazole, grapefruit juice) and inducers (rifampin) dramatically alter clearance' },  // source: ap1-w1-031, ap1-w1-032, ap1-w1-076
      ],
      common_errors: [
        'Confusing Phase I (functionalization) with Phase II (conjugation) — glucuronidation is Phase II, not Phase I',  // from ap1-w1-030 wrong answer D
        'Claiming that CYP3A4 metabolizes remifentanil (CYP3A4 handles fentanyl/sufentanil, not remifentanil)',  // from ap1-w1-035 wrong answer A
      ],
      minimum_passing_score: 60,
    },
    topic: 'drug-metabolism',
    chapter: 'ap1-wk-1',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 2, Vandivier lecture',
      topic: 'drug-metabolism',
      ladder_tier_appropriate: 'maintenance',
    },
  },

  // 6b. Drug Metabolism — Remifentanil, Halothane, and Codeine Pathways — ap1-wk-1
  {
    id: 'r-ap1-w1-6b',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-remifentanil-ester-1', 'atom-cyp2d6-prodrug-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Your patient is receiving a remifentanil infusion for a 6-hour spine case. At handoff, the incoming CRNA asks why you chose remifentanil over fentanyl for this long case. Explain remifentanil\'s unique metabolic pathway, describe the mechanism behind halothane hepatitis, and explain why codeine produces dangerously variable responses across the population.',
    rubric: {
      key_points: [
        { id: 'kp4', weight: 2, description: 'Remifentanil contains a methyl ester linkage hydrolyzed by nonspecific tissue and plasma esterases (not pseudocholinesterase, not CYP450) — this organ-independent metabolism gives it a CSHT of ~3-5 minutes regardless of infusion duration or hepatic/renal function' },  // source: ap1-w1-035, ap1-w1-034 (CRITICAL)
        { id: 'kp5', weight: 1, description: 'Halothane hepatitis occurs via reductive (anaerobic) Phase I metabolism producing reactive trifluoroacetyl chloride intermediates that trigger immune-mediated hepatocyte destruction' },  // source: ap1-w1-033
        { id: 'kp6', weight: 1, description: 'Codeine is a prodrug requiring CYP2D6 O-demethylation to morphine for analgesic effect; poor metabolizers get no relief, ultrarapid metabolizers may produce dangerous morphine levels' },  // source: ap1-w1-029
      ],
      common_errors: [
        'Stating that remifentanil is metabolized by pseudocholinesterase (it is hydrolyzed by nonspecific tissue esterases; pseudocholinesterase metabolizes succinylcholine and mivacurium)',  // from ap1-w1-035 wrong answer B
        'Confusing halothane hepatitis with direct hepatotoxicity — it is immune-mediated via trifluoroacetylated protein neoantigen formation',  // from ap1-w1-033 rationale
      ],
      minimum_passing_score: 60,
    },
    topic: 'drug-metabolism',
    chapter: 'ap1-wk-1',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 2, Vandivier lecture',
      topic: 'drug-metabolism',
      ladder_tier_appropriate: 'maintenance',
    },
  },

  // 7. Pharmacogenetics — ap1-wk-1
  {
    id: 'r-ap1-w1-7',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-cyp2d6-prodrug-1', 'atom-atypical-bche-1', 'atom-ryr1-mh-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'A child receives codeine after tonsillectomy and develops respiratory arrest. A second patient receives succinylcholine for rapid-sequence intubation and remains paralyzed for 6 hours. For each case, explain the pharmacogenetic mechanism, identify the specific enzyme or receptor defect, and describe how preoperative screening could have prevented the adverse outcome.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Codeine case: the child is a CYP2D6 ultrarapid metabolizer — excess CYP2D6 enzyme activity converts codeine to morphine at a dangerous rate, producing respiratory depression; CYP2D6 poor metabolizers get no relief, ultrarapid metabolizers risk toxicity' },  // source: ap1-w1-029, ap1-w1-066 (CRITICAL)
        { id: 'kp2', weight: 1, description: 'Succinylcholine case: atypical pseudocholinesterase (butyrylcholinesterase) has drastically reduced affinity for succinylcholine — normal block of 3-5 minutes extends to 4-8 hours; the dibucaine number identifies the variant (normal ~80, heterozygous 40-60, homozygous atypical <20)' },  // source: ap1-w1-066, ap1-w1-080
        { id: 'kp3', weight: 1, description: 'Malignant hyperthermia susceptibility: autosomal dominant mutation in the RyR1 ryanodine receptor on skeletal muscle sarcoplasmic reticulum causes uncontrolled calcium release with volatile anesthetics or succinylcholine; dantrolene blocks RyR1 calcium release' },  // source: ap1-w1-067, ap1-w1-068
        { id: 'kp4', weight: 1, description: 'Chronic alcohol use causes both CYP2E1 enzyme induction (pharmacokinetic tolerance) and CNS receptor adaptation (NMDA upregulation, GABA downregulation = pharmacodynamic tolerance), requiring increased anesthetic doses' },  // source: ap1-w1-070
        { id: 'kp5', weight: 1, description: 'G6PD deficiency renders methylene blue ineffective for methemoglobinemia treatment because the drug requires NADPH from the G6PD-dependent hexose monophosphate shunt to function; ascorbic acid is the slow alternative' },  // source: ap1-w1-069
      ],
      common_errors: [
        'Confusing pseudocholinesterase deficiency with malignant hyperthermia — prolonged paralysis vs hypermetabolic crisis are completely different entities',  // from ap1-w1-066 wrong answer D
        'Stating that prior uneventful anesthetics exclude MH susceptibility (MH is autosomal dominant with variable penetrance)',  // from ap1-w1-067 rationale
        'Claiming methylene blue directly hemolyzes G6PD-deficient RBCs rather than identifying the NADPH pathway failure',  // from ap1-w1-069 wrong answer B
      ],
      minimum_passing_score: 60,
    },
    topic: 'pharmacogenetics',
    chapter: 'ap1-wk-1',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 2, Vandivier lecture',
      topic: 'pharmacogenetics',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 8. Dose-Response Relationships — ap1-wk-1
  {
    id: 'r-ap1-w1-8',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-potency-vs-efficacy-1', 'atom-synergy-additivity-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'An attending shows you two overlaid dose-response curves for Drug A and Drug B used for the same clinical endpoint. Drug A\'s curve is shifted to the left; Drug B has a higher maximum response. The attending asks you to compare the two drugs and then to explain the therapeutic index concept and how synergistic drug interactions are exploited daily in TIVA. Walk through each concept.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Potency is defined by ED50 (or EC50) — the dose producing 50% of maximal effect; a leftward curve means lower ED50, therefore greater potency; Drug A is more potent than Drug B' },  // source: ap1-w1-058, ap1-w1-060
        { id: 'kp2', weight: 1, description: 'Efficacy (Emax) is the maximum effect achievable regardless of dose — determined by the height of the curve; Drug B has greater efficacy; a partial agonist has lower efficacy than a full agonist by definition' },  // source: ap1-w1-059, ap1-w1-061
        { id: 'kp3', weight: 1, description: 'ED50 is a quantal (population) measure — the dose at which 50% of a study population exhibits the specified all-or-none effect; therapeutic index = LD50/ED50, where a higher TI indicates a wider safety margin' },  // source: ap1-w1-062, ap1-w1-079
        { id: 'kp4', weight: 2, description: 'Synergy (supra-additive interaction): opioids reduce volatile MAC by 50-75% at relatively low doses, exceeding simple additive prediction because they suppress pain at spinal/supraspinal mu receptors while volatiles act on cortical pathways — propofol + alfentanil for loss of consciousness is also synergistic' },  // source: ap1-w1-063, ap1-w1-064 (CRITICAL)
        { id: 'kp5', weight: 1, description: 'MAC additivity: combining 0.5 MAC sevoflurane + 0.5 MAC N2O yields 1.0 MAC equivalent — volatile agents combined with each other follow simple additive interaction, not synergy' },  // source: ap1-w1-065
      ],
      common_errors: [
        'Confusing potency with efficacy — potency is the dose required (horizontal axis), efficacy is the maximal effect achievable (vertical axis)',  // from ap1-w1-058 wrong answer A
        'Stating that a more potent drug is necessarily a better or safer drug (potency is clinically less important than efficacy and safety)',  // from ap1-w1-058 rationale
        'Labeling all beneficial drug combinations as synergistic when volatile + volatile is additive, not synergistic',  // from ap1-w1-065 wrong answer B
      ],
      minimum_passing_score: 60,
    },
    topic: 'dose-response',
    chapter: 'ap1-wk-1',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 2, Vandivier lecture',
      topic: 'dose-response',
      ladder_tier_appropriate: 'maintenance',
    },
  },

  // 9a. Elimination Kinetics — First-Order, Zero-Order, and Half-Life — ap1-wk-1
  {
    id: 'r-ap1-w1-9a',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-first-zero-order-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'Compare first-order and zero-order elimination kinetics: define each, explain how the rate of drug removal differs between them, give a clinical example of each, and define the pharmacokinetic half-life including its mathematical derivation and why it only applies to one of these kinetic orders.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'First-order kinetics: a constant fraction (percentage) of drug is eliminated per unit time — the rate of elimination is proportional to concentration; most drugs follow first-order kinetics at therapeutic concentrations' },  // source: ap1-w1-041
        { id: 'kp2', weight: 1, description: 'Zero-order kinetics: a constant amount of drug is eliminated per unit time regardless of concentration — metabolic enzymes are fully saturated; ethanol is the classic example (~15-20 mg/dL/hr)' },  // source: ap1-w1-051
        { id: 'kp3', weight: 2, description: 'Half-life = 0.693/ke; after each half-life, 50% of remaining drug is eliminated (50% → 25% → 12.5% → 6.25% → 3.1%); half-life is constant only during first-order elimination' },  // source: ap1-w1-052, ap1-w1-053
      ],
      common_errors: [
        'Confusing first-order (constant fraction) with zero-order (constant amount) elimination',  // from ap1-w1-041 wrong answer A, ap1-w1-051 wrong answer A
        'Stating that half-life is variable during first-order kinetics (it is constant during first-order but meaningless during zero-order)',  // from ap1-w1-052 rationale
      ],
      minimum_passing_score: 60,
    },
    topic: 'elimination-kinetics',
    chapter: 'ap1-wk-1',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 2, Vandivier lecture',
      topic: 'elimination-kinetics',
      ladder_tier_appropriate: 'maintenance',
    },
  },

  // 9c. Elimination Kinetics — Steady State, Phenytoin Kinetics, and the Three-Phase Curve — ap1-wk-1
  {
    id: 'r-ap1-w1-9c',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-michaelis-menten-1', 'atom-three-phase-curve-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'You start a continuous IV infusion of a drug with a half-life of 4 hours. The nurse asks how long until the infusion reaches a stable therapeutic level. A different patient is on phenytoin, and a small dose increase causes a disproportionate jump in serum levels. Explain the clinical rule for reaching steady state, why phenytoin is uniquely dangerous to dose, and describe the three phases of the concentration-time curve after an IV bolus including the concept of effect-site equilibration.',
    rubric: {
      key_points: [
        { id: 'kp4', weight: 2, description: 'Approximately 5 half-lives are required to reach steady state during a constant infusion (and to eliminate ~97% of drug after discontinuation); for a drug with t1/2 of 4 hours, steady state is reached at ~20 hours' },  // source: ap1-w1-052, ap1-w1-053 (CRITICAL)
        { id: 'kp5', weight: 1, description: 'Phenytoin exhibits saturable (Michaelis-Menten) kinetics: at low concentrations it appears first-order, but as enzymes saturate it shifts to zero-order — small dose increases then produce disproportionately large concentration jumps, narrowing the margin between therapeutic and toxic levels' },  // source: ap1-w1-040, ap1-w1-077
        { id: 'kp6', weight: 1, description: 'The three-phase concentration-time curve after IV bolus: rapid distribution (alpha phase to VRG), slower redistribution (beta phase to muscle/fat), and terminal elimination (gamma phase) — ke0 describes the rate of effect-site equilibration with plasma, and hysteresis reflects the temporal lag between plasma concentration and clinical effect' },  // source: ap1-w1-055, ap1-w1-056, ap1-w1-057
      ],
      common_errors: [
        'Forgetting that phenytoin transitions between kinetic orders as concentration rises, making it uniquely dangerous to dose empirically',  // from ap1-w1-040 wrong answer A
        'Confusing the alpha (distribution) phase with the gamma (elimination) phase when interpreting plasma concentration curves',  // from ap1-w1-055 rationale
      ],
      minimum_passing_score: 60,
    },
    topic: 'elimination-kinetics',
    chapter: 'ap1-wk-1',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 2, Vandivier lecture',
      topic: 'elimination-kinetics',
      ladder_tier_appropriate: 'maintenance',
    },
  },

  // 9b. Hepatic and Renal Clearance with Dose Adjustment — ap1-wk-1 (split from candidate 1-9)
  {
    id: 'r-ap1-w1-9b',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-flow-limited-clearance-1', 'atom-ion-trapping-renal-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-1',
    prompt: 'You are managing two patients in the ICU: a 68-year-old in cardiogenic shock receiving a lidocaine infusion, and a frail 82-year-old with CKD stage 4 (GFR 22 mL/min) whose serum creatinine is "normal" at 1.0 mg/dL. The attending asks you to explain why the lidocaine is accumulating and why the creatinine is misleading. Walk through the principles of hepatic extraction ratio and renal clearance that guide dose adjustment in organ failure.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'High hepatic extraction ratio drugs (>0.7: lidocaine, propofol, morphine) have flow-limited clearance — their clearance is determined primarily by hepatic blood flow, not enzyme activity or protein binding; cardiogenic shock reduces hepatic blood flow, directly causing drug accumulation' },  // source: ap1-w1-039 (CRITICAL)
        { id: 'kp2', weight: 1, description: 'Renal drug excretion involves three mechanisms: glomerular filtration (passive, unbound drug), tubular secretion (active transport into lumen), and tubular reabsorption (passive return to blood); net excretion = filtration + secretion − reabsorption' },  // source: ap1-w1-042
        { id: 'kp3', weight: 1, description: 'In the elderly, decreased muscle mass produces less creatinine, masking GFR decline — serum creatinine can appear normal despite significantly reduced renal clearance; Cockcroft-Gault or CKD-EPI equations estimate true GFR for drug dosing' },  // source: ap1-w1-045
        { id: 'kp4', weight: 1, description: 'Ion trapping: alkalinizing urine with sodium bicarbonate ionizes weakly acidic drugs (phenobarbital, salicylates) in the tubular lumen, preventing reabsorption and accelerating excretion; fetal ion trapping occurs because fetal blood pH is lower than maternal pH, trapping weak base local anesthetics in fetal circulation' },  // source: ap1-w1-043, ap1-w1-044
        { id: 'kp5', weight: 1, description: 'Glutathione conjugation detoxifies NAPQI (the hepatotoxic metabolite of acetaminophen); in overdose or glutathione depletion, NAPQI accumulates causing centrilobular hepatic necrosis — N-acetylcysteine replenishes glutathione stores' },  // source: ap1-w1-038
      ],
      common_errors: [
        'Stating that enzyme induction can increase clearance of high-extraction drugs beyond the flow-limited ceiling (it cannot — flow is the bottleneck)',  // from ap1-w1-039 wrong answer C
        'Relying on serum creatinine alone in elderly patients to assess renal function (decreased muscle mass masks true GFR)',  // from ap1-w1-045 wrong answer A
        'Confusing ion trapping direction: alkaline urine traps weak acids (not bases); acidic fetal blood traps weak bases (local anesthetics)',  // from ap1-w1-043, ap1-w1-044
      ],
      minimum_passing_score: 60,
    },
    topic: 'clearance-dose-adjustment',
    chapter: 'ap1-wk-1',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 2, Vandivier lecture',
      topic: 'clearance-dose-adjustment',
      ladder_tier_appropriate: 'maintenance',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  WEEK 2 — Peripheral Nervous System, Autonomic Pharmacology,
  //           and Thermoregulation  (Stoelting Ch 3, Vandivier PNS lecture)
  // ═══════════════════════════════════════════════════════════════════════════

  // 1. ANS Architecture and Organ Effects — ap1-wk-2
  {
    id: 'r-ap1-w2-1',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-autonomic-tone-baseline-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'You are providing anesthesia for a healthy 45 year old undergoing laparoscopic cholecystectomy. During peritoneal insufflation the patient develops sudden bradycardia to 38 bpm with hypotension. Explain the three divisions of the autonomic nervous system, describe the opposing effects of the sympathetic and parasympathetic divisions on heart rate, blood pressure, bronchial tone, and GI motility, and walk through why peritoneal traction triggers this vagal response and how atropine reverses it at the receptor level.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'The ANS comprises sympathetic (fight or flight), parasympathetic (rest and digest), and enteric (independent GI regulation via myenteric and submucosal plexuses) divisions; it controls involuntary visceral functions and homeostasis' },  // source: ap1-w2-003, ap1-w2-004, ap1-w2-007
        { id: 'kp2', weight: 2, description: 'Sympathetic activation increases heart rate, contractility, blood pressure, and causes bronchodilation while decreasing GI motility; parasympathetic activation decreases heart rate, causes bronchoconstriction, and increases GI motility and secretions; these divisions maintain continuous baseline tone that allows bidirectional adjustment' },  // source: ap1-w2-005, ap1-w2-006, ap1-w2-029 (CRITICAL)
        { id: 'kp3', weight: 1, description: 'Peritoneal traction stimulates vagal afferents, producing unopposed parasympathetic discharge to the SA node via muscarinic receptors, causing profound bradycardia; atropine is a muscarinic receptor antagonist that blocks ACh at cardiac muscarinic receptors, restoring heart rate' },  // source: ap1-w2-008, ap1-w2-006
      ],
      common_errors: [
        'Confusing enteric nervous system plexuses (myenteric/Auerbach and submucosal/Meissner) with extrinsic autonomic plexuses such as the celiac plexus',  // from ap1-w2-007 wrong answer B
        'Stating that sympathetic activation increases GI motility (it decreases GI activity and diverts blood to skeletal muscle)',  // from ap1-w2-005
      ],
      minimum_passing_score: 60,
    },
    topic: 'ans-architecture',
    chapter: 'ap1-wk-2',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 3, Vandivier lecture',
      topic: 'ans-architecture',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 2. Autonomic Neurotransmitter Pathways — ap1-wk-2
  {
    id: 'r-ap1-w2-2',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-preganglionic-ach-nicotinic-1', 'atom-postganglionic-divergence-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'A first year SRNA asks you to explain the "wiring diagram" of the autonomic nervous system. Walk through the complete neurotransmitter scheme: identify the neurotransmitter and receptor type at every synapse for both sympathetic and parasympathetic pathways (preganglionic to ganglionic, postganglionic to end organ), identify the key exception where sympathetic postganglionic fibers release acetylcholine instead of norepinephrine, and explain the clinical significance of this exception.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'All preganglionic autonomic neurons (both sympathetic and parasympathetic) release acetylcholine that activates nicotinic receptors (NN subtype) on postganglionic cell bodies in autonomic ganglia' },  // source: ap1-w2-009, ap1-w2-010
        { id: 'kp2', weight: 2, description: 'Postganglionic divergence: sympathetic postganglionic fibers are adrenergic (release norepinephrine); parasympathetic postganglionic fibers are cholinergic (release acetylcholine at muscarinic receptors on target organs); this is the fundamental pharmacologic distinction between the two divisions' },  // source: ap1-w2-011, ap1-w2-012 (CRITICAL)
        { id: 'kp3', weight: 1, description: 'Exception: sympathetic postganglionic fibers innervating sweat glands release acetylcholine instead of norepinephrine (sympathetic cholinergic fibers); this means anticholinergic drugs like atropine can reduce sweating by blocking these fibers' },  // source: ap1-w2-013
      ],
      common_errors: [
        'Confusing nicotinic ganglionic receptors (NN) with nicotinic receptors at the neuromuscular junction (NM); they differ pharmacologically, which is why ganglion blockers do not cause skeletal muscle paralysis',  // from ap1-w2-010 rationale
        'Stating that all postganglionic sympathetic fibers are adrenergic without recognizing the sweat gland exception',  // from ap1-w2-013
      ],
      minimum_passing_score: 60,
    },
    topic: 'neurotransmitter-pathways',
    chapter: 'ap1-wk-2',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 3, Vandivier lecture',
      topic: 'neurotransmitter-pathways',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 3. Norepinephrine Lifecycle — Synthesis to Termination — ap1-wk-2
  {
    id: 'r-ap1-w2-3',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ne-synthesis-pathway-1', 'atom-ne-reuptake-dominance-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'A patient taking a monoamine oxidase inhibitor (MAOI) for depression presents for emergency surgery. The attending warns you that sympathomimetic drugs could trigger a life threatening hypertensive crisis. Trace norepinephrine from its synthesis in the nerve terminal through storage, release, and termination. Identify the rate limiting enzyme, explain where in the nerve terminal each step occurs, describe all three termination mechanisms, and explain why MAOI therapy makes indirect acting sympathomimetics especially dangerous.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'NE synthesis pathway: Tyrosine to DOPA to Dopamine occurs in the cytoplasm; Dopamine enters the synaptic vesicle where dopamine beta hydroxylase converts it to NE; the rate limiting step is tyrosine hydroxylase (tyrosine to DOPA)' },  // source: ap1-w2-014, ap1-w2-015
        { id: 'kp2', weight: 2, description: 'NE termination: reuptake into the presynaptic terminal accounts for approximately 80% of removal (most important mechanism); the remainder is metabolized by MAO (intraneuronal) and COMT (extraneuronal); MAOI therapy blocks the MAO degradation pathway, increasing cytoplasmic NE stores and prolonging synaptic NE action' },  // source: ap1-w2-019, ap1-w2-020, ap1-w2-021 (CRITICAL)
        { id: 'kp3', weight: 1, description: 'Alpha methyldopa enters the synthesis pathway and is converted to alpha methylnorepinephrine, a false neurotransmitter that acts as a central alpha 2 agonist reducing sympathetic outflow; this demonstrates how drugs can hijack the NE synthesis pathway' },  // source: ap1-w2-016
      ],
      common_errors: [
        'Confusing NE termination mechanisms with ACh termination; NE is terminated by reuptake, MAO, and COMT while ACh is terminated by acetylcholinesterase hydrolysis',  // from ap1-w2-019
        'Stating that the final NE synthesis step (dopamine to NE) occurs in the cytoplasm rather than inside the synaptic vesicle',  // from ap1-w2-015 wrong answer A
      ],
      minimum_passing_score: 60,
    },
    topic: 'ne-lifecycle',
    chapter: 'ap1-wk-2',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 3, Vandivier lecture',
      topic: 'ne-lifecycle',
      ladder_tier_appropriate: 'maintenance',
    },
  },

  // 4. Indirect Sympathomimetics — Tachyphylaxis and Reuptake Blockade — ap1-wk-2
  {
    id: 'r-ap1-w2-4',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ephedrine-tachyphylaxis-1', 'atom-ne-reuptake-dominance-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'During a general anesthetic, your patient becomes hypotensive and you administer three sequential boluses of ephedrine. The first bolus raises the blood pressure appropriately, but the second and third boluses produce progressively weaker responses. At the same time, you learn that a trauma patient arriving shortly has a history of cocaine abuse and is severely hypertensive. Explain the mechanism of ephedrine tachyphylaxis, why switching to phenylephrine is the appropriate rescue, and how cocaine produces its cardiovascular toxicity through a different mechanism acting on the same neurotransmitter system.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'NE is stored in synaptic vesicles; ephedrine is an indirect acting sympathomimetic that causes NE release from these vesicles; with repeated doses, the releasable NE stores become progressively depleted' },  // source: ap1-w2-017, ap1-w2-018
        { id: 'kp2', weight: 2, description: 'Tachyphylaxis: diminished pressor response with repeated ephedrine doses due to neurotransmitter depletion, not receptor failure; switching to phenylephrine (a direct acting alpha 1 agonist) bypasses the depleted vesicular stores by acting directly on postsynaptic receptors' },  // source: ap1-w2-018 (CRITICAL)
        { id: 'kp3', weight: 1, description: 'Cocaine blocks the NE reuptake transporter, preventing the primary termination mechanism (80% of NE removal); this dramatically increases synaptic NE concentration, producing tachycardia, hypertension, and vasoconstriction; tricyclic antidepressants share this mechanism' },  // source: ap1-w2-022, ap1-w2-020
      ],
      common_errors: [
        'Attributing ephedrine tachyphylaxis to receptor downregulation rather than depletion of releasable NE stores',  // from ap1-w2-018 wrong answer A and C
        'Confusing indirect acting (ephedrine, releases stored NE) with direct acting (phenylephrine, binds receptor directly) sympathomimetics',  // from ap1-w2-018 rationale
      ],
      minimum_passing_score: 60,
    },
    topic: 'ne-drug-interactions',
    chapter: 'ap1-wk-2',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 3, Vandivier lecture',
      topic: 'ne-drug-interactions',
      ladder_tier_appropriate: 'maintenance',
    },
  },

  // 5. Acetylcholine Pharmacology and Pseudocholinesterase — ap1-wk-2
  {
    id: 'r-ap1-w2-5',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ach-synthesis-hydrolysis-1', 'atom-atypical-bche-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'You administer neostigmine with glycopyrrolate to reverse residual neuromuscular blockade at the end of a case. Five minutes later your next patient receives succinylcholine for rapid sequence intubation but remains paralyzed for 4 hours. Walk through acetylcholine synthesis and hydrolysis, explain how neostigmine reverses nondepolarizing blockade by inhibiting acetylcholinesterase, distinguish acetylcholinesterase from plasma cholinesterase (pseudocholinesterase), and explain the pharmacogenetic mechanism behind prolonged succinylcholine paralysis.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'ACh is synthesized from choline and acetyl coenzyme A by choline acetyltransferase; after release, acetylcholinesterase rapidly hydrolyzes ACh into choline and acetate; choline is actively recycled back into the nerve terminal for resynthesis' },  // source: ap1-w2-023, ap1-w2-024, ap1-w2-025, ap1-w2-026
        { id: 'kp2', weight: 2, description: 'Neostigmine inhibits acetylcholinesterase, allowing ACh to accumulate at the neuromuscular junction and outcompete the nondepolarizing agent; however, ACh also accumulates at muscarinic sites causing bradycardia, salivation, and bronchospasm, which is why glycopyrrolate (antimuscarinic) is coadministered' },  // source: ap1-w2-025 (CRITICAL)
        { id: 'kp3', weight: 1, description: 'Plasma cholinesterase (butyrylcholinesterase) is a separate enzyme that metabolizes succinylcholine and mivacurium; atypical genetic variants have drastically reduced affinity, extending a normal 3 to 5 minute block to 4 to 8 hours; the dibucaine number identifies the variant (normal approximately 80, homozygous atypical less than 20)' },  // source: ap1-w2-027
      ],
      common_errors: [
        'Confusing acetylcholinesterase (synaptic enzyme that degrades ACh) with plasma cholinesterase (circulating enzyme that metabolizes succinylcholine); they are different proteins with different substrates',  // from ap1-w2-025, ap1-w2-027
        'Stating that neostigmine directly activates nicotinic receptors rather than recognizing it works indirectly by preserving endogenous ACh',  // from ap1-w2-025 rationale
      ],
      minimum_passing_score: 60,
    },
    topic: 'acetylcholine-pharmacology',
    chapter: 'ap1-wk-2',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 3, Vandivier lecture',
      topic: 'acetylcholine-pharmacology',
      ladder_tier_appropriate: 'emergence',
    },
  },

  // 6. Autonomic Dysfunction — Perioperative Implications — ap1-wk-2
  {
    id: 'r-ap1-w2-6',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-hrv-autonomic-marker-1', 'atom-bidirectional-regulation-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'A 70 year old patient with a 25 year history of insulin dependent diabetes presents for hip replacement. Preoperative evaluation reveals gastroparesis, orthostatic hypotension, and resting heart rate that does not change with deep breathing. A second patient, status post cardiac transplant 6 months ago, is having a minor procedure. Explain the autonomic dysfunction mechanisms in the diabetic patient and how each finding changes your anesthetic plan. Then explain why the transplanted heart shows an exaggerated response to small doses of exogenous epinephrine.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Diabetic autonomic neuropathy produces gastroparesis (increased aspiration risk requiring rapid sequence intubation), orthostatic hypotension (impaired baroreceptor reflex), sweating abnormalities, and inability to mount compensatory cardiovascular responses under anesthesia' },  // source: ap1-w2-033, ap1-w2-030
        { id: 'kp2', weight: 2, description: 'Reduced heart rate variability with deep breathing is an early marker of cardiac autonomic neuropathy; it reflects impaired vagal input to the SA node and independently predicts increased cardiovascular morbidity; these patients are at high risk for hemodynamic instability during anesthesia' },  // source: ap1-w2-031, ap1-w2-036 (CRITICAL)
        { id: 'kp3', weight: 1, description: 'The transplanted heart is denervated; prolonged loss of sympathetic innervation causes receptor upregulation (denervation hypersensitivity), producing exaggerated responses to circulating catecholamines; this is the same principle seen in spinal cord injury patients who develop autonomic hyperreflexia' },  // source: ap1-w2-034
      ],
      common_errors: [
        'Expecting diabetic autonomic neuropathy to produce an exaggerated hypertensive response to blood loss (it impairs compensatory responses, increasing instability)',  // from ap1-w2-033 wrong answer D
        'Confusing denervation hypersensitivity (increased response due to receptor upregulation) with denervation causing decreased responsiveness',  // from ap1-w2-034 wrong answer A
      ],
      minimum_passing_score: 60,
    },
    topic: 'autonomic-dysfunction',
    chapter: 'ap1-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 3, Vandivier lecture',
      topic: 'autonomic-dysfunction',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 7. Pheochromocytoma — Perioperative Pharmacology — ap1-wk-2
  {
    id: 'r-ap1-w2-7',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-alpha-before-beta-pheo-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'A patient with newly diagnosed pheochromocytoma is scheduled for adrenalectomy in two weeks. The surgeon asks you to coordinate the preoperative pharmacologic preparation. Explain the preferred diagnostic test for pheochromocytoma and why a single plasma catecholamine level is unreliable. Then describe the required sequence of alpha and beta adrenergic blockade for preoperative preparation, explain why reversing this sequence is dangerous, and predict the hemodynamic event you must be prepared for immediately after tumor removal.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: '24 hour urine catecholamine and metanephrine testing is the preferred diagnostic method because plasma levels fluctuate with stress and activity, making single measurements unreliable' },  // source: ap1-w2-032
        { id: 'kp2', weight: 2, description: 'Alpha adrenergic blockade (phenoxybenzamine or doxazosin) must be established FIRST to control hypertension; beta blockade is added only after alpha blockade is in place; initiating beta blockade first removes beta 2 mediated vasodilation, leaving alpha mediated vasoconstriction unopposed and risking hypertensive crisis' },  // source: ap1-w2-035 (CRITICAL)
        { id: 'kp3', weight: 1, description: 'After tumor removal, the sudden loss of catecholamine excess combined with chronically downregulated adrenergic receptors produces profound refractory hypotension requiring aggressive volume resuscitation and vasopressor support' },  // source: ap1-w2-035
      ],
      common_errors: [
        'Initiating beta blockade before establishing adequate alpha blockade, which causes unopposed alpha mediated vasoconstriction',  // from ap1-w2-035 wrong answer A
        'Using a single random plasma catecholamine measurement for diagnosis rather than a 24 hour integrated urine collection',  // from ap1-w2-032 wrong answer A
      ],
      minimum_passing_score: 60,
    },
    topic: 'pheochromocytoma-management',
    chapter: 'ap1-wk-2',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 3, Vandivier lecture',
      topic: 'pheochromocytoma-management',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 8. Adrenal Medulla — Modified Sympathetic Ganglion — ap1-wk-2
  {
    id: 'r-ap1-w2-8',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-adrenal-modified-ganglion-1', 'atom-pnmt-cortisol-epi-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'During a prolonged abdominal surgery, the patient develops a robust catecholamine surge with hypertension and tachycardia in response to surgical stimulation. Explain why the adrenal medulla is described as a modified sympathetic ganglion, trace the signaling pathway from preganglionic fiber to catecholamine release into the bloodstream, describe the role of PNMT and cortisol in determining the ratio of epinephrine to norepinephrine output, and compare the receptor profiles and clinical effects of circulating epinephrine versus norepinephrine.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'The adrenal medulla receives preganglionic sympathetic fibers directly (no postganglionic neuron); chromaffin cells are modified postganglionic neurons; ACh activates nicotinic receptors on chromaffin cells, causing calcium influx and exocytosis of catecholamine containing vesicles into the bloodstream' },  // source: ap1-w2-037, ap1-w2-038, ap1-w2-042
        { id: 'kp2', weight: 2, description: 'The adrenal medulla releases approximately 80% epinephrine and 20% norepinephrine; PNMT converts NE to epinephrine; cortisol from the adjacent adrenal cortex upregulates PNMT activity, linking the HPA stress axis to catecholamine production' },  // source: ap1-w2-039, ap1-w2-040, ap1-w2-041 (CRITICAL)
        { id: 'kp3', weight: 1, description: 'Epinephrine produces stronger cardiac stimulation (beta 1) and skeletal muscle vasodilation at low doses via beta 2 receptors; NE primarily causes vasoconstriction via alpha receptors with less beta 2 activity; both are metabolized by COMT and MAO with a circulating duration of approximately 10 to 30 seconds' },  // source: ap1-w2-043, ap1-w2-044
      ],
      common_errors: [
        'Stating that the adrenal medulla receives postganglionic sympathetic innervation (it receives preganglionic fibers directly because chromaffin cells serve as the modified postganglionic element)',  // from ap1-w2-037 wrong answer A
        'Confusing PNMT (converts NE to epinephrine) with dopamine beta hydroxylase (converts dopamine to NE); they catalyze different steps',  // from ap1-w2-040 wrong answers A and B
      ],
      minimum_passing_score: 60,
    },
    topic: 'adrenal-medulla',
    chapter: 'ap1-wk-2',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 3, Vandivier lecture',
      topic: 'adrenal-medulla',
      ladder_tier_appropriate: 'maintenance',
    },
  },

  // 9. Perioperative Thermoregulation — Three Phases — ap1-wk-2
  {
    id: 'r-ap1-w2-9',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-three-phase-hypothermia-1', 'atom-nonshivering-thermogenesis-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'You are providing general anesthesia for a 4 hour open abdominal case. The esophageal temperature probe shows core temperature dropping from 36.8 degrees C to 35.2 degrees C during the first hour, then declining more slowly over the next 2 hours, before stabilizing at 34.8 degrees C. Walk through the three phases of perioperative hypothermia (redistribution, linear heat loss, and plateau), explain the mechanism driving each phase, identify the four physical mechanisms of heat loss, describe the normal cold defense responses, and explain why general anesthesia abolishes each of these defenses.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Normal core temperature is maintained between 36 and 37.5 degrees C by the hypothalamus; heat is lost through radiation (largest OR source), conduction, convection, and evaporation; cold responses include vasoconstriction, shivering (increases O2 consumption 200 to 300%), and nonshivering thermogenesis in brown fat via UCP 1' },  // source: ap1-w2-045, ap1-w2-046, ap1-w2-047, ap1-w2-048, ap1-w2-049, ap1-w2-050
        { id: 'kp2', weight: 2, description: 'Phase 1 (redistribution): 0.5 to 1.5 degree C drop in the first hour from anesthesia induced vasodilation redistributing warm core blood to the cooler periphery; Phase 2 (linear): heat loss to the cold environment exceeds reduced metabolic heat production; Phase 3 (plateau after 3 to 5 hours): thermoregulatory vasoconstriction is triggered even under anesthesia (at a lower threshold), reducing peripheral blood flow and stabilizing core temperature' },  // source: ap1-w2-055, ap1-w2-056, ap1-w2-057 (CRITICAL)
        { id: 'kp3', weight: 1, description: 'General anesthesia abolishes all cold defenses: vasodilation prevents vasoconstriction, muscle relaxation prevents shivering, nonshivering thermogenesis is absent, and the interthreshold range is widened so the body does not initiate compensatory responses; the patient becomes relatively poikilothermic' },  // source: ap1-w2-051, ap1-w2-052, ap1-w2-054
      ],
      common_errors: [
        'Attributing the rapid first hour temperature drop to environmental heat loss rather than internal core to peripheral redistribution',  // from ap1-w2-055 wrong answer B
        'Confusing nonshivering thermogenesis (brown fat, UCP 1, sympathetically mediated) with shivering (skeletal muscle contraction controlled by posterior hypothalamus)',  // from ap1-w2-049 wrong answer C, ap1-w2-050
      ],
      minimum_passing_score: 60,
    },
    topic: 'perioperative-thermoregulation',
    chapter: 'ap1-wk-2',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 3, Vandivier lecture',
      topic: 'perioperative-thermoregulation',
      ladder_tier_appropriate: 'maintenance',
    },
  },

  // 10. Thermoregulation — Anesthetic Effects, Regional Anesthesia, and Prevention — ap1-wk-2
  {
    id: 'r-ap1-w2-10',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-regional-thermoreg-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-2',
    prompt: 'A 58 year old patient is scheduled for a 5 hour colon resection under combined general and epidural anesthesia. You plan active warming strategies. Identify the specific anesthetic drugs that lower thermoregulatory thresholds, explain why combined general plus regional anesthesia creates a uniquely high risk for hypothermia compared to either technique alone, describe why the Phase 3 plateau may never develop under regional anesthesia, list the clinically significant consequences of even mild perioperative hypothermia, and describe the prewarming strategy that mitigates redistribution hypothermia.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Propofol and alfentanil specifically lower thermoregulatory thresholds, widening the interthreshold range so the body tolerates a lower core temperature before initiating vasoconstriction or shivering; volatile agents also impair thermoregulation' },  // source: ap1-w2-053
        { id: 'kp2', weight: 2, description: 'Regional anesthesia blocks sympathetic vasoconstriction below the level of the block, preventing the peripheral vasoconstriction needed for the Phase 3 plateau; combined GA plus regional eliminates both central thermoregulatory defenses (GA) and peripheral vasoconstriction capacity (regional), producing the highest hypothermia risk' },  // source: ap1-w2-058 (CRITICAL)
        { id: 'kp3', weight: 1, description: 'Even mild hypothermia (1 to 2 degrees C) causes delayed drug metabolism, prolonged recovery, impaired coagulation and platelet function (increased bleeding), increased wound infection rates, and increased oxygen demand during rewarming with shivering; prewarming for 30 to 60 minutes before induction narrows the core to peripheral gradient and significantly reduces Phase 1 redistribution hypothermia' },  // source: ap1-w2-059, ap1-w2-060
      ],
      common_errors: [
        'Assuming the Phase 3 plateau will occur under regional anesthesia (sympathetic blockade prevents the vasoconstriction required to achieve equilibrium below the block level)',  // from ap1-w2-058 rationale, ap1-w2-057
        'Stating that hypothermia enhances coagulation and reduces bleeding (hypothermia impairs coagulation and increases bleeding risk)',  // from ap1-w2-060 wrong answer D
      ],
      minimum_passing_score: 60,
    },
    topic: 'thermoregulation-anesthesia',
    chapter: 'ap1-wk-2',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 3, Vandivier lecture',
      topic: 'thermoregulation-anesthesia',
      ladder_tier_appropriate: 'maintenance',
    },
  },

];
