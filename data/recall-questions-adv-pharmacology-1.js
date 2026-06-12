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

  // ═══════════════════════════════════════════════════════════════════════════
  //  WEEK 3 — Sympathomimetics, Antihypertensives, Vasodilators, Heart Failure
  //           (Stoelting Ch 15, 18, 19, 20; Vandivier lectures)
  // ═══════════════════════════════════════════════════════════════════════════

  // 1. Catecholamine Selection in Shock States — ap1-wk-3
  {
    id: 'r-ap1-w3-1',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-epi-dose-dependent-shift-1', 'atom-ne-septic-first-line-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'You are called to manage three critically ill patients in the ICU: (1) a septic shock patient with MAP 52 despite fluid resuscitation, (2) a post-cardiac-surgery patient with low cardiac output and adequate SVR, and (3) an anaphylaxis patient with bronchospasm and cardiovascular collapse. For each patient, identify the first-line catecholamine, state which adrenergic receptors it activates and at what relative potency, and explain how the receptor profile of that drug matches the hemodynamic deficit in each shock state.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Septic shock patient: norepinephrine is first-line because it has strong alpha-1 activity that restores vascular tone lost to pathologic vasodilation, plus moderate beta-1 activity that supports cardiac output; its receptor profile is strong alpha-1, moderate beta-1, minimal beta-2; the student must state that NE increases SVR and MAP through alpha-1 vasoconstriction while maintaining cardiac output through beta-1 inotropy' },  // source: ap1-w3-007, ap1-w3-008
        { id: 'kp2', weight: 1, description: 'Post-cardiac-surgery patient: epinephrine at low to moderate doses is appropriate because low-dose epinephrine activates beta-1 (increased contractility and heart rate) and beta-2 (mild vasodilation reducing afterload), which increases cardiac output without excessively increasing SVR; at high doses alpha-1 predominates, which would worsen the situation by increasing afterload against a weak heart' },  // source: ap1-w3-001, ap1-w3-002
        { id: 'kp3', weight: 2, description: 'Anaphylaxis patient: epinephrine is the ONLY first-line drug because it uniquely addresses all three pathologies simultaneously: alpha-1 reverses vasodilation and restores blood pressure, beta-1 increases cardiac contractility and rate, and beta-2 causes bronchodilation to relieve bronchospasm and stabilizes mast cell membranes to reduce further mediator release; no other single catecholamine provides this complete receptor coverage' },  // source: ap1-w3-001, ap1-w3-002 (CRITICAL)
        { id: 'kp4', weight: 1, description: 'Dopamine is NOT preferred for cardiogenic shock because it causes more tachyarrhythmias than dobutamine or milrinone; dopamine dose-dependent receptor activation (low = D1/D2 renal, moderate = beta-1 cardiac, high = alpha-1 vascular) is not matched to the hemodynamic needs as precisely as targeted agents' },  // source: ap1-w3-015, ap1-w3-011, ap1-w3-012
      ],
      common_errors: [
        'Recommending phenylephrine for septic shock as first-line; phenylephrine is a pure alpha-1 agonist that increases afterload without inotropic support, potentially worsening tissue perfusion in sepsis',  // from ap1-w3-025
        'Confusing low-dose epinephrine effects (beta-predominant vasodilation) with high-dose effects (alpha-predominant vasoconstriction)',  // from ap1-w3-002
        'Recommending dopamine for cardiogenic shock despite its higher arrhythmia risk compared to dobutamine',  // from ap1-w3-015
      ],
      minimum_passing_score: 60,
    },
    topic: 'catecholamine-selection',
    chapter: 'ap1-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 15, 18; Vandivier lecture',
      topic: 'catecholamine-selection',
      ladder_tier_appropriate: 'maintenance',
    },
  },

  // 2. Vasopressor Selection in Obstetric Anesthesia — ap1-wk-3
  {
    id: 'r-ap1-w3-2',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ephedrine-tachyphylaxis-1', 'atom-phenylephrine-fetal-acidbase-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'You are managing spinal anesthesia for a cesarean delivery. After intrathecal injection, the patient develops hypotension to 78/42. You administer ephedrine 10 mg IV, which raises the blood pressure temporarily. Five minutes later the blood pressure drops again, you give a second ephedrine dose, and the response is noticeably weaker. Explain ephedrine mechanism of action (both direct and indirect components), why repeated doses produce tachyphylaxis, what alternative vasopressor you would switch to and why it may better preserve fetal acid-base status, and the mechanism of that alternative drug.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Ephedrine is a mixed-acting sympathomimetic: it directly stimulates alpha and beta adrenergic receptors AND indirectly releases stored norepinephrine from presynaptic sympathetic nerve terminal vesicles; it is a noncatecholamine resistant to MAO degradation; typical dose is 5 to 10 mg IV bolus' },  // source: ap1-w3-021
        { id: 'kp2', weight: 2, description: 'Tachyphylaxis occurs because repeated doses progressively deplete the finite norepinephrine stores in the presynaptic vesicles; each subsequent dose releases less NE, producing a weaker indirect effect; the direct component remains but is insufficient alone to maintain blood pressure; switching to a direct-acting agent bypasses the depleted NE stores entirely' },  // source: ap1-w3-022 (CRITICAL)
        { id: 'kp3', weight: 2, description: 'Phenylephrine is the preferred switch: it is a direct-acting selective alpha-1 agonist (50 to 100 mcg bolus or 20 to 100 mcg/min infusion) that does not depend on NE stores; evidence shows phenylephrine better preserves fetal acid-base status because ephedrine crosses the placenta more readily and stimulates fetal beta receptors, increasing fetal metabolism and oxygen consumption, which can produce fetal acidosis' },  // source: ap1-w3-023, ap1-w3-024 (CRITICAL)
        { id: 'kp4', weight: 1, description: 'Phenylephrine commonly produces reflex bradycardia through the baroreceptor response to increased arterial pressure; this is expected and usually benign in obstetric patients with adequate heart rate reserves' },  // source: ap1-w3-024
      ],
      common_errors: [
        'Attributing ephedrine tachyphylaxis to receptor downregulation rather than norepinephrine store depletion; receptor downregulation requires prolonged exposure (hours to days), not repeated acute boluses',  // from ap1-w3-022
        'Stating that phenylephrine is dangerous in obstetrics because it reduces uteroplacental blood flow; at appropriate doses, phenylephrine maintains uteroplacental perfusion while better preserving fetal pH',  // from ap1-w3-023
      ],
      minimum_passing_score: 60,
    },
    topic: 'obstetric-vasopressors',
    chapter: 'ap1-wk-3',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 15; Vandivier lecture',
      topic: 'obstetric-vasopressors',
      ladder_tier_appropriate: 'maintenance',
    },
  },

  // 3. Inotrope Selection: Beta-Dependent vs Beta-Independent Pathways — ap1-wk-3
  {
    id: 'r-ap1-w3-3',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-dobutamine-beta1-tachyphylaxis-1', 'atom-milrinone-camp-independence-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'A patient with severe heart failure and reduced ejection fraction has been on a dobutamine infusion for 4 days and is showing diminishing hemodynamic response. The patient is also on metoprolol for rate control. The attending asks you to explain why the dobutamine is losing effectiveness, propose an alternative inotrope that will work despite the beta-blocker, and compare the two drugs at the intracellular signaling level. Walk through each point.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Dobutamine is primarily a beta-1 agonist (racemic mixture derived from isoproterenol) that increases contractility, stroke volume, and cardiac output through beta-1 receptor activation, which stimulates adenylyl cyclase to produce cAMP; its typical dose range is 2 to 10 mcg/kg/min with a half-life of approximately 2 minutes' },  // source: ap1-w3-018, ap1-w3-019
        { id: 'kp2', weight: 2, description: 'Dobutamine tachyphylaxis occurs after approximately 72 hours of continuous infusion because chronic beta-1 receptor stimulation triggers receptor downregulation: the cell reduces beta-1 receptor density on its surface through phosphorylation, internalization, and decreased receptor synthesis; fewer surface receptors means less cAMP production per dose, requiring escalating doses for the same effect' },  // source: ap1-w3-020 (CRITICAL)
        { id: 'kp3', weight: 2, description: 'Milrinone (a PDE III inhibitor, classified as an inodilator) works DOWNSTREAM of the beta receptor by inhibiting phosphodiesterase III, the enzyme that degrades cAMP; this preserves intracellular cAMP levels regardless of whether beta receptors are blocked by metoprolol or downregulated by tachyphylaxis; milrinone is effective in beta-blocked and catecholamine-resistant patients precisely because it bypasses the receptor entirely' },  // source: ap1-w3-033, ap1-w3-034 (CRITICAL)
        { id: 'kp4', weight: 1, description: 'Milrinone also produces vasodilation (decreasing preload, afterload, and PVR), making it an inodilator rather than a pure inotrope; this combination is particularly beneficial in RV failure and pulmonary hypertension; however, chronic oral PDE III inhibitor therapy paradoxically increases mortality, restricting use to short-term IV administration' },  // source: ap1-w3-033, ap1-w3-035
      ],
      common_errors: [
        'Stating that milrinone works by directly activating beta receptors or displacing the beta-blocker; milrinone has zero interaction with beta receptors',  // from ap1-w3-034
        'Confusing dobutamine tachyphylaxis (receptor downregulation over days) with ephedrine tachyphylaxis (norepinephrine store depletion over minutes)',  // from ap1-w3-020 vs ap1-w3-022
        'Recommending chronic oral milrinone therapy for outpatient heart failure; oral PDE III inhibitors increase morbidity and mortality',  // from ap1-w3-035
      ],
      minimum_passing_score: 60,
    },
    topic: 'inotrope-selection',
    chapter: 'ap1-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 15; Vandivier lecture',
      topic: 'inotrope-selection',
      ladder_tier_appropriate: 'maintenance',
    },
  },

  // 4. Digoxin Pharmacology: Mechanism, Toxicity, and Electrolyte Interactions — ap1-wk-3
  {
    id: 'r-ap1-w3-4',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-digoxin-hypokalemia-toxicity-1', 'atom-ionized-calcium-transfusion-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'A patient with atrial fibrillation on chronic digoxin therapy is admitted for emergency surgery. Lab work shows potassium of 2.9 mEq/L (the patient is on furosemide). The surgeon asks if you can cardiovert the atrial fibrillation before going to the OR. Explain how digoxin controls ventricular rate, why the low potassium puts this patient at risk for digoxin toxicity (describe the specific molecular mechanism of the potassium-digoxin interaction), and why DC cardioversion is dangerous in this clinical scenario.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Digoxin controls ventricular rate in atrial fibrillation by enhancing vagal (parasympathomimetic) tone to the AV node, slowing AV nodal conduction and reducing the number of atrial impulses that reach the ventricles; it does NOT suppress ectopic atrial foci or convert the rhythm; it reduces HF hospitalizations but does NOT reduce mortality' },  // source: ap1-w3-030
        { id: 'kp2', weight: 2, description: 'Digoxin inhibits the Na-K ATPase pump on cardiac myocytes; potassium and digoxin compete for the SAME binding site on this pump; when serum potassium is low (2.9 mEq/L from furosemide use), there is less potassium to compete with digoxin for the binding site, so more digoxin molecules bind and inhibit more pumps; this excessive inhibition leads to increased intracellular sodium, which reverses the Na/Ca exchanger, flooding the cell with calcium and causing arrhythmias including ventricular tachycardia and fibrillation' },  // source: ap1-w3-031 (CRITICAL)
        { id: 'kp3', weight: 2, description: 'DC cardioversion in a patient with digoxin toxicity (or in this case, high toxicity risk from hypokalemia) is dangerous because the electrical shock can precipitate ventricular fibrillation; the already-elevated intracellular calcium from excessive Na-K ATPase inhibition creates a substrate for lethal reentrant arrhythmias when combined with the electrical energy of cardioversion' },  // source: ap1-w3-032 (CRITICAL)
        { id: 'kp4', weight: 1, description: 'The correct management sequence is to first correct the hypokalemia aggressively (IV potassium replacement to restore the competitive binding), check the digoxin level, and hold cardioversion until potassium and magnesium are optimized; if cardioversion becomes absolutely necessary, use the lowest effective energy setting' },  // source: ap1-w3-031, ap1-w3-032
      ],
      common_errors: [
        'Stating that digoxin converts atrial fibrillation to sinus rhythm; digoxin is a rate-control agent, not a rhythm-control agent',  // from ap1-w3-030
        'Describing the digoxin-potassium interaction as affecting hepatic metabolism or renal excretion rather than competitive binding at the Na-K ATPase pump',  // from ap1-w3-031
        'Confusing the mechanism: it is not that hypokalemia increases digoxin absorption or decreases digoxin clearance; the interaction is at the target enzyme binding site',  // from ap1-w3-031
      ],
      minimum_passing_score: 60,
    },
    topic: 'digoxin-toxicity',
    chapter: 'ap1-wk-3',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 15; Vandivier lecture',
      topic: 'digoxin-toxicity',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 5. Beta-Blocker Pharmacology: Selectivity, Perioperative Implications, and Cocaine Toxicity — ap1-wk-3
  {
    id: 'r-ap1-w3-5',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-esmolol-rbc-esterase-1', 'atom-cocaine-unopposed-alpha-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'Three patients present in the preoperative area: (1) an asthmatic patient with a heart rate of 110 needing emergency surgery, (2) a patient receiving timolol eye drops who develops a heart rate of 42 that does not respond to atropine, and (3) a cocaine-intoxicated trauma patient with severe hypertension and chest pain. For each patient, explain the relevant beta-blocker pharmacology: why selectivity matters for the asthmatic, why timolol bradycardia resists atropine, and why isolated beta-blockade is contraindicated in cocaine toxicity. Include the specific alternative drug for the cocaine patient.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Asthmatic patient: nonselective beta-blockers (propranolol, timolol) block beta-2 receptors on bronchial smooth muscle, removing bronchodilatory tone and allowing unopposed parasympathetic bronchoconstriction; beta-1 selective agents (esmolol, metoprolol) spare beta-2 receptors at therapeutic doses and are safer in reactive airway disease; esmolol is ideal for perioperative use because it is metabolized by RBC esterases independent of liver and kidney, producing an ultra-short half-life of approximately 9 minutes' },  // source: ap1-w3-045, ap1-w3-043
        { id: 'kp2', weight: 2, description: 'Timolol patient: timolol ophthalmic drops are a nonselective beta-blocker that can be systemically absorbed through the nasolacrimal duct and nasal mucosa; the resulting bradycardia is characteristically RESISTANT to atropine because the mechanism is direct beta-1 receptor blockade on cardiac pacemaker cells, NOT enhanced vagal tone; atropine blocks muscarinic receptors (vagal pathway) but cannot overcome direct beta-1 blockade; treatment requires a beta-agonist (isoproterenol) or transcutaneous pacing' },  // source: ap1-w3-042 (CRITICAL)
        { id: 'kp3', weight: 2, description: 'Cocaine patient: cocaine blocks norepinephrine reuptake at sympathetic nerve terminals, producing simultaneous alpha-1 and beta adrenergic stimulation; giving an isolated beta-blocker removes the beta-2 mediated vasodilation while leaving alpha-1 vasoconstriction completely unopposed; this causes worsened hypertension and, critically, coronary vasospasm that can trigger myocardial infarction; the safe alternative is labetalol (combined alpha-1 plus nonselective beta blocker) or benzodiazepines' },  // source: ap1-w3-044 (CRITICAL)
      ],
      common_errors: [
        'Stating that beta-1 selectivity is absolute; selectivity is dose-dependent, and at high doses even selective agents can block beta-2',  // from ap1-w3-045
        'Giving more atropine for timolol-induced bradycardia; the mechanism is not vagal, so atropine will not work regardless of dose',  // from ap1-w3-042
        'Recommending propranolol for cocaine toxicity because it is a powerful beta-blocker; nonselective beta-blockade is the worst choice because it blocks vasodilatory beta-2 while leaving alpha-1 unopposed',  // from ap1-w3-044
      ],
      minimum_passing_score: 60,
    },
    topic: 'beta-blocker-pharmacology',
    chapter: 'ap1-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 19; Vandivier lecture',
      topic: 'beta-blocker-pharmacology',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 6. Alpha-2 Agonists as Anesthetic Adjuncts — ap1-wk-3
  {
    id: 'r-ap1-w3-6',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-clonidine-rebound-htn-1', 'atom-dex-1600-selectivity-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'A patient on chronic clonidine therapy is scheduled for a lengthy spinal surgery. The surgeon also requests dexmedetomidine sedation for the case. Explain why clonidine must not be abruptly discontinued perioperatively (include the receptor-level mechanism of rebound), compare the alpha-2 selectivity ratios of clonidine and dexmedetomidine, and describe why a rapid IV bolus of dexmedetomidine can produce the paradoxical combination of hypertension with bradycardia.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Clonidine withdrawal syndrome: chronic alpha-2 agonism suppresses central sympathetic outflow, which causes compensatory upregulation of adrenergic receptors; abrupt discontinuation removes the suppressive effect, exposing the upregulated (more numerous and more sensitive) receptors to normal circulating catecholamines; this produces rebound hypertension, tachycardia, and diaphoresis that can be life-threatening; perioperatively, if oral dosing is not possible, a transdermal clonidine patch must be applied' },  // source: ap1-w3-038 (CRITICAL)
        { id: 'kp2', weight: 1, description: 'Dexmedetomidine has an alpha-2 to alpha-1 selectivity ratio of approximately 1600:1, making it eight times more selective than clonidine (approximately 200:1); this high selectivity produces sedation, analgesia, and sympatholysis at therapeutic doses with minimal alpha-1 vasoconstriction and notably without significant respiratory depression' },  // source: ap1-w3-039
        { id: 'kp3', weight: 2, description: 'Paradoxical dexmedetomidine bolus response: a rapid IV bolus activates peripheral alpha-2B receptors on vascular smooth muscle, causing direct vasoconstriction and transient hypertension; the acute blood pressure rise triggers the baroreceptor reflex, producing bradycardia; this is paradoxical because the expected steady-state effect of dexmedetomidine is hypotension and sedation; to avoid this response, loading doses should be given over 10 minutes or omitted entirely' },  // source: ap1-w3-040 (CRITICAL)
      ],
      common_errors: [
        'Attributing clonidine rebound to drug accumulation or toxicity rather than receptor upregulation following withdrawal',  // from ap1-w3-038
        'Confusing the alpha-2B vascular receptor (which causes vasoconstriction with rapid dexmedetomidine bolus) with the central alpha-2A receptor (which mediates sedation and sympatholysis)',  // from ap1-w3-040
        'Stating that dexmedetomidine causes respiratory depression comparable to opioids; dexmedetomidine provides sedation with preserved respiratory drive',  // from ap1-w3-040
      ],
      minimum_passing_score: 60,
    },
    topic: 'alpha2-agonists',
    chapter: 'ap1-wk-3',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 19; Vandivier lecture',
      topic: 'alpha2-agonists',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 7. Calcium Channel Blocker Classification and Anesthetic Interactions — ap1-wk-3
  {
    id: 'r-ap1-w3-7',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-verapamil-wpw-danger-1', 'atom-ccb-nmb-potentiation-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'A patient with a history of Wolff-Parkinson-White syndrome and chronic atrial fibrillation presents for surgery. The cardiologist has been controlling the rate with diltiazem. You also plan to use rocuronium for intubation. Explain the three classes of calcium channel blockers (name one drug from each class and its primary cardiovascular effect), why verapamil is specifically contraindicated in WPW with atrial fibrillation, and how calcium channel blockers interact with neuromuscular blocking agents during anesthesia.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'Three CCB classes: (1) Phenylalkylamines (verapamil) primarily decrease AV nodal conduction, heart rate, and myocardial contractility; (2) Dihydropyridines (nifedipine, nicardipine) are potent arterial vasodilators with minimal cardiac nodal effects, causing reflex tachycardia; (3) Benzothiazepines (diltiazem) decrease AV conduction with less contractility depression than verapamil, making it safer to combine with beta-blockers' },  // source: ap1-w3-048, ap1-w3-049, ap1-w3-051
        { id: 'kp2', weight: 2, description: 'WPW contraindication: verapamil (and all AV nodal blockers including diltiazem, digoxin, and adenosine) slows conduction through the AV node but does NOT slow conduction through the accessory bypass pathway; during atrial fibrillation, blocking the AV node redirects the rapid atrial impulses through the unblocked accessory pathway, which can conduct at dangerously fast rates and degenerate into ventricular fibrillation; procainamide is the preferred antiarrhythmic for WPW with AF' },  // source: ap1-w3-048 (CRITICAL)
        { id: 'kp3', weight: 2, description: 'CCB-NMB interaction: calcium channel blockers potentiate BOTH depolarizing (succinylcholine) AND nondepolarizing (rocuronium) neuromuscular blocking agents; the mechanism is that calcium is required for acetylcholine vesicle fusion and release at the neuromuscular junction; blocking calcium entry reduces ACh release, enhancing the neuromuscular block; patients on chronic CCBs need quantitative train-of-four monitoring because the block may be deeper and longer than expected' },  // source: ap1-w3-050 (CRITICAL)
      ],
      common_errors: [
        'Stating that only nondepolarizing NMB agents are potentiated by CCBs; both depolarizing and nondepolarizing agents are affected',  // from ap1-w3-050
        'Confusing verapamil (nodal effects) with nifedipine (vascular effects); dihydropyridines cause reflex tachycardia, not bradycardia',  // from ap1-w3-049
        'Recommending verapamil for rate control in WPW; this is a potentially lethal error',  // from ap1-w3-048
      ],
      minimum_passing_score: 60,
    },
    topic: 'ccb-classification',
    chapter: 'ap1-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 19; Vandivier lecture',
      topic: 'ccb-classification',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 8. Vasodilator Pharmacology for Acute Hypertension Management — ap1-wk-3
  {
    id: 'r-ap1-w3-8',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ino-hemoglobin-selective-1', 'atom-ntg-venous-preload-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'You are managing four different patients with acute hypertensive emergencies: (1) a cardiac surgery patient with pulmonary hypertension and RV failure, (2) a neurosurgical patient needing rapid precise BP control, (3) a patient with unstable angina and elevated filling pressures, and (4) a pregnant patient with severe preeclampsia. For each patient, identify the most appropriate vasodilator, explain its mechanism of action at the molecular level, and state its most important toxicity or limitation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Pulmonary HTN/RV failure: inhaled nitric oxide (iNO) is the agent of choice because it selectively dilates pulmonary vasculature; iNO is delivered to ventilated alveoli where it diffuses into adjacent pulmonary vascular smooth muscle and activates soluble guanylate cyclase, increasing cGMP to relax smooth muscle; selectivity occurs because hemoglobin in pulmonary capillary blood rapidly binds and inactivates NO (half-life less than 5 seconds), preventing any systemic vasodilation; limitation: abrupt discontinuation can cause rebound pulmonary hypertension, and it can produce methemoglobinemia' },  // source: ap1-w3-055 (CRITICAL)
        { id: 'kp2', weight: 1, description: 'Neurosurgical patient: sodium nitroprusside provides rapid, titratable BP control (dilates both arteries and veins) through release of nitric oxide; the critical toxicity is cyanide poisoning because each nitroprusside molecule releases five cyanide ions during metabolism; signs of cyanide toxicity include tachyphylaxis (increasing dose requirement), metabolic acidosis, and elevated mixed venous oxygen saturation; treatment includes sodium thiosulfate and hydroxocobalamin' },  // source: ap1-w3-056
        { id: 'kp3', weight: 1, description: 'Unstable angina patient: nitroglycerin is preferred because it PRIMARILY dilates venous capacitance vessels (reducing preload and ventricular wall stress) AND dilates coronary arteries, directly reducing myocardial oxygen demand while improving coronary perfusion; NTG is contraindicated in HOCM and severe aortic stenosis because these preload-dependent conditions worsen with reduced venous return; tolerance develops with continuous use' },  // source: ap1-w3-057
        { id: 'kp4', weight: 1, description: 'Preeclampsia patient: hydralazine is a direct arteriolar vasodilator with an established safety profile in pregnancy; it lowers maternal blood pressure without the teratogenic risks of ACE inhibitors and ARBs; limitations include reflex tachycardia, sodium and water retention, and drug-induced lupus erythematosus with prolonged use (especially in slow acetylators)' },  // source: ap1-w3-058
      ],
      common_errors: [
        'Confusing the selectivity mechanism of inhaled NO (hemoglobin inactivation in blood) with selective receptor expression in the lungs; NO activates the same guanylate cyclase in all vascular beds',  // from ap1-w3-055
        'Stating that nitroglycerin primarily dilates arterioles; at standard doses NTG is predominantly a venodilator that reduces preload, with arteriolar dilation occurring mainly at higher doses',  // from ap1-w3-057
        'Using ACE inhibitors or ARBs in pregnancy; these are teratogenic and contraindicated',  // from ap1-w3-058
      ],
      minimum_passing_score: 60,
    },
    topic: 'vasodilator-pharmacology',
    chapter: 'ap1-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 18, 20; Vandivier lecture',
      topic: 'vasodilator-pharmacology',
      ladder_tier_appropriate: 'maintenance',
    },
  },

  // 9. RAAS Blockade and Perioperative Hypotension — ap1-wk-3
  {
    id: 'r-ap1-w3-9',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ace-bradykinin-cough-1', 'atom-raas-periop-hypotension-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'A 62 year old patient on lisinopril (an ACE inhibitor) and losartan (an ARB, recently added because of persistent cough on lisinopril) presents for hip replacement. During induction, the blood pressure drops to 68/38 and does not respond to phenylephrine or ephedrine boluses. Explain why ACE inhibitors cause cough at the molecular level, why the switch to an ARB eliminates the cough, and why this patient developed refractory intraoperative hypotension. Include the specific rescue agents that may restore blood pressure when catecholamines fail.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 1, description: 'ACE inhibitors block angiotensin-converting enzyme, which normally serves two functions: (1) converting angiotensin I to angiotensin II (a potent vasoconstrictor that also stimulates aldosterone release), and (2) degrading bradykinin; when ACE is inhibited, bradykinin accumulates in the airways, producing a persistent dry cough in 5% to 20% of patients and rarely angioedema' },  // source: ap1-w3-052
        { id: 'kp2', weight: 1, description: 'ARBs (losartan) block the angiotensin II type 1 (AT1) receptor directly WITHOUT inhibiting ACE; because ACE enzyme activity is preserved, bradykinin is still degraded normally, eliminating the cough and angioedema; however, ARBs produce the same degree of RAAS suppression as ACE inhibitors by blocking the downstream receptor' },  // source: ap1-w3-053
        { id: 'kp3', weight: 2, description: 'Refractory perioperative hypotension: both ACE inhibitors and ARBs suppress the renin-angiotensin-aldosterone system, which is a critical compensatory mechanism for maintaining blood pressure during anesthesia; when anesthetic agents cause vasodilation and reduce preload, the RAAS normally produces angiotensin II to vasoconstrict and aldosterone to retain sodium and water; with RAAS blocked, this compensation is absent, resulting in hypotension that is resistant to standard catecholamine vasopressors (phenylephrine and ephedrine)' },  // source: ap1-w3-054 (CRITICAL)
        { id: 'kp4', weight: 2, description: 'Rescue for RAAS-blocked refractory hypotension: vasopressin (V1 receptor agonist) works through a completely different pathway (non-adrenergic, non-RAAS vasoconstriction) and is often effective when catecholamines fail; IV fluid boluses expand intravascular volume to compensate for the absent aldosterone effect; many practitioners hold ACE inhibitors and ARBs 12 to 24 hours preoperatively to prevent this scenario' },  // source: ap1-w3-054 (CRITICAL)
      ],
      common_errors: [
        'Stating that ARBs also cause cough; the cough is specific to ACE inhibitors because of bradykinin accumulation, which ARBs do not produce',  // from ap1-w3-053
        'Attributing ACE inhibitor cough to drug allergy rather than bradykinin accumulation',  // from ap1-w3-052
        'Simply giving more phenylephrine for refractory hypotension; the problem is loss of a hormonal compensatory cascade, requiring a non-adrenergic rescue pathway like vasopressin',  // from ap1-w3-054
      ],
      minimum_passing_score: 60,
    },
    topic: 'raas-perioperative',
    chapter: 'ap1-wk-3',
    difficulty: 2,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 20; Vandivier lecture',
      topic: 'raas-perioperative',
      ladder_tier_appropriate: 'pre-induction',
    },
  },

  // 10. Labetalol Mechanism and Sympathomimetic Classification by Mechanism — ap1-wk-3
  {
    id: 'r-ap1-w3-10',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-labetalol-alpha2-sparing-1', 'atom-beta2-comt-resistance-1'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-3',
    prompt: 'A hypertensive emergency patient arrives with blood pressure 240/130. You administer IV labetalol. Meanwhile, a second patient in the ICU on albuterol nebulizers develops hypokalemia and tremor. Explain how labetalol lowers blood pressure while maintaining cardiac output (include which alpha receptor subtypes it blocks and which it spares, and why this matters), and then compare the three categories of sympathomimetic mechanism (direct, indirect, and mixed) using specific drugs from this week as examples. For the albuterol patient, explain why selective beta-2 agonists have a longer duration than endogenous catecholamines.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Labetalol combines alpha-1 blockade (producing arterial vasodilation and SVR reduction) with nonselective beta blockade (reducing heart rate and contractility); the IV beta-to-alpha blocking ratio is approximately 7:1; cardiac output is generally maintained because the alpha-1 vasodilation offsets the negative inotropic and chronotropic effects of beta blockade; critically, labetalol blocks alpha-1 but SPARES alpha-2 receptors, preserving the presynaptic alpha-2 negative feedback loop that limits excessive norepinephrine release from sympathetic nerve terminals; this is why labetalol produces less reflex tachycardia than nonselective alpha blockers like phentolamine' },  // source: ap1-w3-046, ap1-w3-047 (CRITICAL)
        { id: 'kp2', weight: 1, description: 'Sympathomimetic classification: DIRECT acting agents (phenylephrine, isoproterenol) bind and activate adrenergic receptors directly without depending on endogenous NE stores; INDIRECT acting agents release stored norepinephrine from presynaptic vesicles (amphetamine is the classic example); MIXED acting agents (ephedrine) both directly stimulate receptors AND release stored NE; indirect and mixed agents exhibit tachyphylaxis from NE store depletion with repeated dosing' },  // source: ap1-w3-021, ap1-w3-024, ap1-w3-016
        { id: 'kp3', weight: 1, description: 'Selective beta-2 agonists (albuterol, terbutaline) are noncatecholamines that lack the catechol ring structure (3,4-dihydroxyphenyl group), making them resistant to degradation by catechol-O-methyltransferase (COMT); endogenous catecholamines (epinephrine, norepinephrine) are rapidly metabolized by both COMT and MAO; COMT resistance gives synthetic beta-2 agonists a longer duration of action suitable for inhaler-based bronchodilator therapy' },  // source: ap1-w3-027
        { id: 'kp4', weight: 1, description: 'The albuterol side effects (hypokalemia and tremor) both result from beta-2 receptor activation: hypokalemia occurs because beta-2 stimulates the Na-K ATPase pump on skeletal muscle, driving potassium intracellularly (the same mechanism as epinephrine-induced hypokalemia); tremor is a separate direct effect of beta-2 stimulation on skeletal muscle contractile proteins' },  // source: ap1-w3-029, ap1-w3-003
      ],
      common_errors: [
        'Stating that labetalol blocks both alpha-1 and alpha-2; it specifically spares alpha-2 to preserve the negative feedback loop on NE release',  // from ap1-w3-047
        'Confusing COMT resistance (structural: no catechol ring) with MAO resistance (different mechanism); both contribute to prolonged duration but through different mechanisms',  // from ap1-w3-027
        'Attributing beta-2 agonist hypokalemia to renal potassium wasting; the mechanism is intracellular potassium shift via Na-K ATPase, not renal loss',  // from ap1-w3-029
      ],
      minimum_passing_score: 60,
    },
    topic: 'labetalol-sympathomimetic-classification',
    chapter: 'ap1-wk-3',
    difficulty: 3,
    metadata: {
      priority: 'high',
      source: 'Stoelting Ch 15, 19; Vandivier lecture',
      topic: 'labetalol-sympathomimetic-classification',
      ladder_tier_appropriate: 'maintenance',
    },
  },

  // ===== ap1-wk-4 Anticoagulants synthesis =====

  {
    id: 'r-ap1-w4-1',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-aca-three-phases', 'atom-aca-primary-secondary-product'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the three phases of hemostasis with the distinct product and time course of primary versus secondary hemostasis into one coherent timeline.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Hemostasis unfolds in three overlapping phases: the vascular phase of vasoconstriction reduces blood flow first, primary hemostasis forms a soft platelet plug, and secondary hemostasis stabilizes that plug with fibrin. The phases overlap but conceptually proceed in this order.' },
        { id: 'kp2', weight: 2, description: 'Primary hemostasis produces the soft platelet plug on a seconds-to-minutes timescale, making it the fast first structural response. Secondary hemostasis is slower, occurring over minutes, and its product is fibrin, which converts the soft plug into a durable clot.' },
        { id: 'kp3', weight: 1, description: 'Distinguishing product from timing prevents the classic confusion of thinking fibrin appears in the primary phase or that the cascade is faster than the platelet plug. Vasoconstriction, soft plug, then fibrin stabilization is the clean sequence.' },
      ],
      common_errors: [
        'Calling fibrinolysis one of the three hemostatic phases',
        'Saying fibrin is laid down during primary hemostasis',
        'Claiming secondary hemostasis is faster than the platelet plug',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Hemostasis timeline',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Hemostasis timeline', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-2',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-aca-platelet-three-steps', 'atom-aca-adhesion-vwf'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the ordered three-step model of platelet behavior with the specific molecular machinery of the adhesion step.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Platelets perform three ordered actions in primary hemostasis: adhere, then activate, then aggregate. Each step has distinct receptor biology, and the strict order is the backbone for mapping drugs onto platelet function.' },
        { id: 'kp2', weight: 2, description: 'The first step, adhesion, is mediated by von Willebrand factor bridging the platelet to exposed subendothelial collagen through the GP Ib receptor. vWF binds GP Ib on the platelet and collagen on the injured wall.' },
        { id: 'kp3', weight: 1, description: 'Anchoring adhesion as step one via vWF and GP Ib clarifies why deficiency of either causes a bleeding tendency, and it sets up activation and aggregation as the subsequent steps with their own machinery.' },
      ],
      common_errors: [
        'Reversing the adhere and activate steps',
        'Attributing adhesion to fibrinogen and GP IIb/IIIa',
        'Saying platelets bind collagen directly without von Willebrand factor',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Platelet adhesion within the three steps',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Platelet adhesion within the three steps', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-3',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-aca-granule-release', 'atom-aca-aggregation-gp2b3a'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the activation-phase granule release with the aggregation-phase receptor biology to explain how activated platelets recruit and bind one another.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Upon activation, platelet granules release adenosine diphosphate, thromboxane A2, and serotonin. These mediators amplify the response: ADP recruits more platelets, thromboxane A2 amplifies activation, and serotonin adds vasoconstriction and platelet effects.' },
        { id: 'kp2', weight: 2, description: 'In the aggregation step, activated platelets expose GP IIb/IIIa, and fibrinogen crosslinks adjacent platelets by bridging their GP IIb/IIIa receptors. This is the final common pathway of aggregation.' },
        { id: 'kp3', weight: 1, description: 'Linking release to aggregation shows the logic: activation signals recruit platelets and expose the receptor that fibrinogen uses to bind them together. This sequence is exactly where antiplatelet drug families intervene.' },
      ],
      common_errors: [
        'Including tissue factor among the granule contents',
        'Saying GP Ib rather than GP IIb/IIIa mediates aggregation',
        'Claiming collagen crosslinks platelets during aggregation',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Activation release and aggregation',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Activation release and aggregation', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-4',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-aca-cox1-aspirin', 'atom-aca-p2y12-drugs'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the COX-1 and P2Y12 antiplatelet targets, naming the mediator or signal each controls and the drugs that block each.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Cyclooxygenase-1 makes thromboxane A2, which amplifies platelet activation, and aspirin blocks COX-1 to shut off that thromboxane A2 signal. This is the first of the antiplatelet drug families tied to a platelet target.' },
        { id: 'kp2', weight: 2, description: 'P2Y12 is the ADP-driven platelet recruitment receptor, and it is blocked by clopidogrel, prasugrel, and ticagrelor. Blocking P2Y12 breaks the ADP positive-feedback recruitment loop.' },
        { id: 'kp3', weight: 1, description: 'Pairing these shows two distinct amplification routes on the activated platelet: a thromboxane arm hit by aspirin and an ADP arm hit by the P2Y12 inhibitors, which is why dual antiplatelet therapy combines an aspirin with a P2Y12 inhibitor.' },
      ],
      common_errors: [
        'Saying aspirin blocks P2Y12 or that clopidogrel blocks COX-1',
        'Stating P2Y12 responds to thromboxane rather than ADP',
        'Forgetting ticagrelor among the P2Y12 agents',
      ],
      minimum_passing_score: 60,
    },
    topic: 'COX-1 and P2Y12 targets',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'COX-1 and P2Y12 targets', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-5',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-aca-gp2b3a-drugs', 'atom-aca-convergence-x'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the concept of a final common pathway in platelet aggregation with the concept of a convergence point in the coagulation cascade.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'GP IIb/IIIa is the fibrinogen-crosslinking receptor and the final common pathway of platelet aggregation, blocked by abciximab, eptifibatide, and tirofiban. Because all aggregation routes funnel through it, blocking it stops aggregation regardless of upstream stimulus.' },
        { id: 'kp2', weight: 2, description: 'In the coagulation cascade, both the intrinsic and extrinsic pathways converge by activating factor X, which begins the common pathway. Factor X is the single funnel point of the two cascade entry routes.' },
        { id: 'kp3', weight: 1, description: 'Both ideas use the same logic of a bottleneck: GP IIb/IIIa is the downstream bottleneck of platelet aggregation, and factor X is the bottleneck where the two coagulation pathways merge. Recognizing the parallel clarifies why these are high-value drug targets.' },
      ],
      common_errors: [
        'Saying the coagulation pathways converge at factor II rather than X',
        'Listing aspirin or clopidogrel as a GP IIb/IIIa blocker',
        'Confusing the platelet final common pathway with the cascade convergence',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Final common pathways',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Final common pathways', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-6',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-aca-intrinsic-pathway', 'atom-aca-extrinsic-pathway'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the intrinsic and extrinsic pathways by contrasting their components, triggers, and monitoring labs.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The intrinsic pathway runs factor XII to XI to IX, which activates factor X, is triggered by contact with foreign surfaces, and is measured by the activated partial thromboplastin time. This makes the aPTT the therapeutic heparin test.' },
        { id: 'kp2', weight: 2, description: 'The extrinsic pathway is tissue factor plus factor VII activating factor X, is triggered by tissue injury, and is measured by the prothrombin time. Because warfarin most affects factor VII, the PT and INR are the warfarin tests.' },
        { id: 'kp3', weight: 1, description: 'Both pathways activate factor X, so they share the common pathway downstream. The clean mapping of intrinsic to foreign surface to aPTT and extrinsic to tissue injury to PT lets you read a coagulation panel and infer the drug.' },
      ],
      common_errors: [
        'Swapping the labs so that intrinsic maps to PT and extrinsic to aPTT',
        'Reversing the triggers of foreign-surface contact and tissue injury',
        'Forgetting that both pathways converge on factor X',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Intrinsic versus extrinsic pathways',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Intrinsic versus extrinsic pathways', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-7',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-aca-xa-to-thrombin', 'atom-aca-thrombin-to-fibrin'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the two sequential enzymatic conversions of the common pathway from factor Xa through to a stabilized clot.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Factor Xa converts prothrombin, factor II, into thrombin, factor IIa. This step generates the central effector enzyme of coagulation from its inactive precursor.' },
        { id: 'kp2', weight: 2, description: 'Thrombin then converts fibrinogen into fibrin, and that fibrin stabilizes the platelet plug into a real clot. Thrombin is therefore the final amplifier of the cascade.' },
        { id: 'kp3', weight: 1, description: 'Reading the two steps in sequence, Xa makes thrombin and thrombin makes fibrin, explains why anticoagulants target either Xa or thrombin: hitting either node interrupts the march toward a stabilized fibrin clot.' },
      ],
      common_errors: [
        'Saying Xa converts fibrinogen directly to fibrin',
        'Claiming thrombin converts prothrombin to thrombin',
        'Reversing fibrin and fibrinogen in thrombin\'s reaction',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Common pathway conversions',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Common pathway conversions', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-8',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-aca-three-mechanisms', 'atom-aca-xa-iia-targets'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the two-molecule reduction of the common pathway with the three-mechanism framework that defines every clinically useful anticoagulant.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The common pathway reduces to two molecules: factor Xa, the convergence point of both pathways, and factor IIa or thrombin, the final amplifier that cleaves fibrinogen into fibrin. These are the two nodes that matter.' },
        { id: 'kp2', weight: 2, description: 'Every clinically useful anticoagulant does one of three things: it blocks factor Xa, it blocks factor IIa, or it stops the liver from making the factors. Anticoagulants do not dissolve existing clot; that is the fibrinolytic system.' },
        { id: 'kp3', weight: 1, description: 'Mapping the framework onto the two molecules gives the whole conceptual model: drugs hit the Xa node, the IIa node, or upstream hepatic synthesis. Everything else about specific agents is detail layered on this skeleton.' },
      ],
      common_errors: [
        'Listing clot dissolution as an anticoagulant mechanism',
        'Naming factors XII and VII as the two key molecules',
        'Omitting the hepatic synthesis mechanism that warfarin represents',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Anticoagulant framework and targets',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Anticoagulant framework and targets', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-9',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-aca-antithrombin-serpin', 'atom-aca-heparin-amplification'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate antithrombin\'s identity and target set with the way heparin amplifies it and the basis for heparin resistance.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Antithrombin is a circulating serpin that on its own slowly inhibits factors IIa, Xa, IXa, XIa, and XIIa. It is one of the body\'s natural brakes, acting by inhibiting active clotting enzymes.' },
        { id: 'kp2', weight: 2, description: 'Heparin binds antithrombin and amplifies its inhibitory reaction by 1000 to 10000 fold. Heparin is not itself the inhibitor; it accelerates antithrombin, which is why heparin works so powerfully and rapidly.' },
        { id: 'kp3', weight: 1, description: 'Because heparin acts only through antithrombin, an antithrombin-deficient patient resists heparin, showing little anticoagulant effect, and is treated by restoring antithrombin with concentrate or fresh frozen plasma.' },
      ],
      common_errors: [
        'Calling antithrombin a cofactor that activates clotting factors',
        'Quoting only a 10 to 100 fold heparin amplification',
        'Attributing heparin resistance to protein C deficiency rather than antithrombin deficiency',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Antithrombin and heparin',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Antithrombin and heparin', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-10',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-aca-protein-c-s', 'atom-aca-tfpi'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the protein C and S brake system with the TFPI brake system, contrasting their activators and targets.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Protein C and protein S are activated by the thrombin-thrombomodulin complex and then cleave and inactivate factors Va and VIIIa. Both are vitamin K dependent, which ties them to warfarin pharmacology.' },
        { id: 'kp2', weight: 2, description: 'Tissue factor pathway inhibitor shuts down the tissue factor / factor VIIa complex, braking the extrinsic trigger at its initiating step. Its target is upstream at the very start of the extrinsic pathway.' },
        { id: 'kp3', weight: 1, description: 'Both are natural brakes alongside antithrombin, but they act at different points: protein C and S remove the Va and VIIIa accelerators downstream, while TFPI silences the tissue factor VIIa initiator. Distinguishing the targets prevents conflating the two systems.' },
      ],
      common_errors: [
        'Saying proteins C and S inactivate IIa and Xa instead of Va and VIIIa',
        'Claiming TFPI inhibits the thrombin-thrombomodulin complex',
        'Stating proteins C and S are not vitamin K dependent',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Natural anticoagulant brake systems',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Natural anticoagulant brake systems', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-11',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-aca-procoagulant-basis', 'atom-aca-vitk-six-proteins'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the full list of vitamin K dependent proteins with the reason warfarin has an early procoagulant phase.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Six proteins require vitamin K dependent gamma-carboxylation: procoagulant factors II, VII, IX, and X, plus anticoagulant proteins C and S. Warfarin therefore affects both the clotting factors and the natural anticoagulant proteins.' },
        { id: 'kp2', weight: 2, description: 'Because proteins C and S are vitamin K dependent anticoagulants, warfarin lowers them too, and their early fall makes the net effect of early warfarin prothrombotic rather than anticoagulant. This is warfarin\'s procoagulant phase.' },
        { id: 'kp3', weight: 1, description: 'Tying the list to the procoagulant phase explains clinical phenomena such as warfarin-induced skin necrosis in protein C deficient patients and the rationale for heparin bridging when rapid anticoagulation is required.' },
      ],
      common_errors: [
        'Including factor V or VIII among the vitamin K dependent proteins',
        'Attributing the procoagulant phase to heparin resistance',
        'Omitting proteins C and S from the vitamin K dependent list',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Vitamin K dependence and procoagulant phase',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Vitamin K dependence and procoagulant phase', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-12',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-aca-gamma-carboxylation', 'atom-aca-vkor-warfarin'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the biochemical role of gamma-carboxylation with the enzyme warfarin blocks to explain how warfarin produces non-functional factors.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Gamma-carboxylation adds a calcium-binding tail to a clotting factor; without it the factor is synthesized but cannot bind calcium and cannot participate in the cascade. The defect is functional, not a failure to make the protein.' },
        { id: 'kp2', weight: 2, description: 'Vitamin K epoxide reductase recycles vitamin K, and warfarin blocks this enzyme. Without recycled vitamin K, the liver cannot perform gamma-carboxylation, so it produces factors that lack the calcium-binding tail.' },
        { id: 'kp3', weight: 1, description: 'Combining the two points explains warfarin\'s hallmark: it does not destroy existing functional factors, it only prevents production of newly functional ones, which underlies the delayed onset governed by factor half-lives and the early procoagulant phase.' },
      ],
      common_errors: [
        'Saying gamma-carboxylation adds a heparin-binding site rather than a calcium-binding tail',
        'Claiming warfarin blocks cyclooxygenase-1 instead of vitamin K epoxide reductase',
        'Stating warfarin inactivates already-circulating functional factors',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Gamma-carboxylation and warfarin',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Gamma-carboxylation and warfarin', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-13',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-aca-tpa-plasmin', 'atom-aca-plasmin-action'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the two steps of physiologic fibrinolysis from endothelial tPA release through clot breakdown.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Tissue plasminogen activator is released from the endothelium and converts plasminogen, an inactive zymogen, into plasmin, the active enzyme. This activation is the trigger step of fibrinolysis.' },
        { id: 'kp2', weight: 2, description: 'Plasmin then cleaves fibrin and breaks the clot apart. Plasmin is the effector enzyme that actually digests the fibrin meshwork holding a clot together.' },
        { id: 'kp3', weight: 1, description: 'Seeing the two steps together, tPA makes plasmin and plasmin digests fibrin, clarifies why antifibrinolytic drugs act upstream at plasminogen activation: blocking the trigger step prevents plasmin generation and preserves the clot.' },
      ],
      common_errors: [
        'Saying tPA converts plasmin back to plasminogen',
        'Claiming plasmin builds fibrin rather than digesting it',
        'Stating tPA is released from platelets rather than endothelium',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Fibrinolysis cascade',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Fibrinolysis cascade', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-14',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-aca-txa-mechanism', 'atom-aca-eaca-and-indications'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the molecular mechanism of tranexamic acid with how epsilon-aminocaproic acid compares and the clinical settings where these antifibrinolytics are used.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Tranexamic acid is a lysine analog that competitively blocks the lysine-binding site on plasminogen, so plasminogen cannot bind fibrin and tPA cannot convert it to plasmin. Less plasmin means less fibrin breakdown and a preserved clot; TXA preserves existing clot rather than creating new clot.' },
        { id: 'kp2', weight: 2, description: 'Epsilon-aminocaproic acid, Amicar, uses the identical lysine-analog mechanism on the plasminogen lysine-binding site but is weaker than tranexamic acid. Both are antifibrinolytics working at the same molecular site.' },
        { id: 'kp3', weight: 1, description: 'TXA is used in trauma, cardiac surgery, postpartum hemorrhage, and joint arthroplasty, all bleeding-heavy settings where preserving formed clot reduces blood loss. Because the mechanism preserves rather than lyses clot, these agents are not used to dissolve an established thrombus.' },
      ],
      common_errors: [
        'Saying TXA blocks thrombin or creates new clot',
        'Claiming EACA is more potent than TXA or has a different mechanism',
        'Listing dissolution of an existing pulmonary embolus as a TXA indication',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Lysine analogs and indications',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Lysine analogs and indications', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-15',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acb-pt-inr-pathway', 'atom-acb-aptt-pathway'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the PT/INR and the aPTT by contrasting the pathway each measures and the anticoagulant each monitors.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The PT/INR measures the extrinsic plus common pathway and is most sensitive to factor VII, making it the warfarin monitor. The aPTT measures the intrinsic plus common pathway and is the classic therapeutic heparin test. The two tests therefore split coverage of the cascade between the extrinsic and intrinsic limbs while sharing the common pathway.' },
        { id: 'kp2', weight: 2, description: 'Clinically the pairing is PT/INR for warfarin and aPTT for heparin. This one-to-one mapping is the core of bedside anticoagulant monitoring and is the reason factor VII sensitivity makes the INR rise early on warfarin while the aPTT tracks unfractionated heparin effect.' },
        { id: 'kp3', weight: 1, description: 'Both tests share the common pathway, so an isolated common-pathway defect can prolong either one, but the distinguishing feature is which upstream limb each test interrogates and which drug it is conventionally used to follow.' },
      ],
      common_errors: [
        'Swapping the drugs so PT monitors heparin and aPTT monitors warfarin',
        'Forgetting that both tests share the common pathway',
        'Misassigning factor VII sensitivity to the aPTT instead of the PT',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Coagulation labs',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Coagulation labs', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-16',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acb-anti-xa-assay', 'atom-acb-thrombin-ecarin-time'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the anti-factor Xa assay and the thrombin/ecarin clotting time by stating what each measures and which drugs each follows.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The anti-factor Xa assay directly measures factor Xa inhibition and is used for low-molecular-weight heparin, fondaparinux, and the direct factor Xa inhibitors. The thrombin time and ecarin clotting time measure direct thrombin inhibition and are used for dabigatran. The two assays therefore cleanly separate Xa-acting drugs from thrombin-acting drugs.' },
        { id: 'kp2', weight: 2, description: 'This division mirrors the two molecular targets of the common pathway: factor Xa and thrombin (factor IIa). Choosing the assay follows directly from knowing the drug\'s target, so a Xa drug is followed by anti-Xa and a thrombin drug is followed by thrombin or ecarin time.' },
        { id: 'kp3', weight: 1, description: 'The PT/INR is not useful for the direct factor Xa inhibitors, and the aPTT is only qualitative for dabigatran, which is why these dedicated direct-inhibitor assays exist rather than relying on the classic clotting times.' },
      ],
      common_errors: [
        'Using the anti-Xa assay to follow dabigatran',
        'Using thrombin or ecarin time to follow a factor Xa inhibitor',
        'Relying on PT/INR to quantify direct Xa inhibitor effect',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Direct inhibitor tests',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Direct inhibitor tests', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-17',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acb-lab-identifies-drug', 'atom-acb-act-bypass-lab'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the lab-identifies-the-drug principle with the role of the ACT to explain how a coagulation chart reveals both the drug class and the clinical setting.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Each monitoring test maps to a drug class, so identifying the lab identifies the drug: PT/INR for warfarin, aPTT for therapeutic heparin, anti-Xa for Xa-acting drugs, and thrombin or ecarin time for dabigatran. The ACT extends this by signaling not just heparin but the very high heparin concentrations of cardiopulmonary bypass.' },
        { id: 'kp2', weight: 2, description: 'Because the ACT is a whole-blood test that stays calibrated where the aPTT saturates, seeing the ACT on a chart points to a bypass-level heparin context specifically. The lab thus encodes both the agent and the intensity of anticoagulation in use.' },
        { id: 'kp3', weight: 1, description: 'This makes the coagulation panel a diagnostic decoder: the presence of a particular test narrows both the drug class and, in the case of the ACT versus aPTT, the dosing intensity and care setting without needing the medication list.' },
      ],
      common_errors: [
        'Assuming the lab gives an exact drug concentration rather than a class',
        'Treating the ACT as interchangeable with the aPTT for any heparin dose',
        'Mapping the ACT to warfarin or to low-dose prophylactic heparin',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Direct inhibitor tests',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Direct inhibitor tests', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-18',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acb-ufh-lmwh-ratio', 'atom-acb-doac-targets'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the antithrombin amplifiers with the direct oral inhibitors to map how anticoagulants act on factor Xa versus thrombin.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Unfractionated heparin and LMWH are antithrombin amplifiers: UFH has balanced anti-Xa and anti-IIa activity while LMWH favors anti-Xa. The direct oral inhibitors act without antithrombin, with dabigatran hitting thrombin and rivaroxaban, apixaban, and edoxaban hitting factor Xa. The two groups differ in whether they need antithrombin as an intermediary.' },
        { id: 'kp2', weight: 2, description: 'Both groups ultimately converge on the same two targets of the common pathway, factor Xa and thrombin. LMWH and the three Xa-inhibitor DOACs emphasize Xa, while UFH and dabigatran provide strong anti-thrombin effect, organizing the anticoagulants by their molecular endpoint.' },
        { id: 'kp3', weight: 1, description: 'The mechanistic split also drives monitoring: antithrombin-dependent agents can be followed by aPTT or anti-Xa, the direct Xa DOACs by calibrated anti-Xa, and dabigatran by thrombin or ecarin time, tying the drug map back to the lab map.' },
      ],
      common_errors: [
        'Calling the direct oral inhibitors antithrombin-dependent',
        'Reversing the UFH and LMWH anti-Xa to anti-IIa relationship',
        'Listing dabigatran among the factor Xa inhibitors',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Anticoagulant drug map',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Anticoagulant drug map', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-19',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acb-warfarin-map-factors', 'atom-acb-platelet-inhibitor-targets'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate warfarin\'s vitamin K interference with the three antiplatelet targets to contrast anticoagulant versus antiplatelet mechanisms on the drug map.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Warfarin acts by vitamin K interference, impairing the vitamin K dependent factors II, VII, IX, X plus proteins C and S, thereby reducing coagulation factor function. The antiplatelet agents instead target platelet activation through three sites: aspirin at COX-1, the P2Y12 agents at the ADP receptor, and abciximab, eptifibatide, and tirofiban at GP IIb/IIIa.' },
        { id: 'kp2', weight: 2, description: 'These represent the two arms of hemostasis the drug map addresses: warfarin works on secondary hemostasis by lowering clotting factor activity, while the antiplatelet families work on primary hemostasis by blocking platelet plug formation. The contrast clarifies why their monitoring and reversal differ.' },
        { id: 'kp3', weight: 1, description: 'Warfarin is monitored by PT/INR and its effect depends on synthesis of new factors over days, whereas antiplatelet effect depends on platelet receptor blockade and turnover, underscoring that the two arms operate on different biology and timescales.' },
      ],
      common_errors: [
        'Including fibrinogen among warfarin\'s vitamin K dependent proteins',
        'Assigning aspirin to the P2Y12 receptor',
        'Treating antiplatelet agents and warfarin as acting on the same hemostasis arm',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Drug map',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Drug map', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-20',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acb-antifibrinolytic-procoagulants', 'atom-acb-heparin-mechanism'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the antifibrinolytic procoagulants with heparin\'s mechanism to contrast a clot-preserving strategy against a clot-preventing one.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Tranexamic acid and epsilon-aminocaproic acid are antifibrinolytic procoagulants that preserve existing clot by blocking plasminogen activation. Heparin is an anticoagulant that prevents new clot by binding antithrombin, changing its conformation, and accelerating inhibition of thrombin 1,000 to 10,000-fold plus factors XIIa, XIa, IXa, and Xa. The two act in opposite directions on hemostasis.' },
        { id: 'kp2', weight: 2, description: 'The antifibrinolytics work downstream on the fibrinolytic system to keep clot intact, whereas heparin works upstream on the coagulation cascade to stop clot from forming. Understanding both ends explains how the procoagulant and anticoagulant halves of the field counterbalance each other.' },
        { id: 'kp3', weight: 1, description: 'Mechanistically heparin requires antithrombin as an intermediary and will fail if antithrombin is deficient, while the lysine analogs act directly on plasminogen, so their efficacy does not depend on a circulating cofactor in the same way.' },
      ],
      common_errors: [
        'Describing tranexamic acid as creating new clot rather than preserving it',
        'Saying heparin inhibits thrombin directly instead of through antithrombin',
        'Confusing the fibrinolytic target of TXA with the coagulation target of heparin',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Mechanisms overview',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Mechanisms overview', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-21',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acb-heparin-resistance', 'atom-acb-heparin-units-halflife'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate heparin resistance from antithrombin deficiency with heparin\'s dosing in units and short half-life to summarize practical heparin handling.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Heparin depends entirely on antithrombin, so antithrombin deficiency produces heparin resistance treated by giving antithrombin concentrate or fresh frozen plasma. Heparin is dosed in units because biological activity varies between equal-milligram vials, and it has a half-life of about 1 hour at therapeutic doses. Together these facts define how heparin is dosed, monitored, and troubleshot.' },
        { id: 'kp2', weight: 2, description: 'Because activity rather than mass is what matters, dosing in units and confirming effect by lab are necessary, and because the half-life is short, the effect is titratable and reversible on a roughly hourly scale. When effect is absent despite adequate units, antithrombin deficiency rather than dosing error should be suspected.' },
        { id: 'kp3', weight: 1, description: 'The short half-life also means that replacing antithrombin restores heparin responsiveness promptly once substrate is available, and that timing of procedures or reversal can be planned around the roughly one-hour decay of effect.' },
      ],
      common_errors: [
        'Fixing heparin resistance with more heparin instead of antithrombin',
        'Saying heparin is dosed in milligrams',
        'Overstating the heparin half-life well beyond one hour',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Heparin pharmacokinetics',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Heparin pharmacokinetics', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-22',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acb-heparin-route-variability', 'atom-acb-aptt-antixa-targets'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate heparin\'s route-dependent onset and dose-response variability with the aPTT and anti-Xa monitoring targets to justify why heparin is monitored.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Intravenous heparin has immediate onset while subcutaneous is prophylaxis only, and the dose-response is nonlinear with sensitivity varying fourfold and metabolism threefold. This variability is why heparin is monitored, using the aPTT at 1.5 to 2.5 times baseline for prophylactic and low-dose therapeutic ranges and the anti-Xa assay at 0.3 to 0.7 units/mL for therapeutic dosing.' },
        { id: 'kp2', weight: 2, description: 'The nonlinear, patient-variable response means a fixed dose cannot be trusted to land in the therapeutic window, so the matched monitoring test and target close the loop. The route choice and the monitoring choice together ensure reliable therapeutic anticoagulation.' },
        { id: 'kp3', weight: 1, description: 'Selecting the right test follows the dosing intensity: the aPTT ratio for lower-dose therapeutic and prophylactic heparin and the anti-Xa concentration for therapeutic dosing, with each target value tied to its specific assay.' },
      ],
      common_errors: [
        'Claiming subcutaneous heparin is reliable for therapeutic anticoagulation',
        'Stating the heparin dose-response is linear',
        'Quoting the aPTT target in units per mL or the anti-Xa target as a baseline multiple',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Heparin monitoring',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Heparin monitoring', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-23',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acb-act-bypass-concentration', 'atom-acb-act-components-values'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate why the ACT replaces the aPTT on bypass with the ACT\'s components and target values to describe bypass anticoagulation monitoring.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'On bypass heparin runs at about 3 to 4 units/mL, roughly 5 to 10 times therapeutic, a level at which the aPTT runs off-scale while the ACT stays calibrated. The ACT is run on whole blood plus a celite or kaolin activator, has a baseline of 100 to 150 seconds, and requires at least 400 seconds for bypass. These facts together describe how anticoagulation is confirmed on pump.' },
        { id: 'kp2', weight: 2, description: 'The whole-blood, point-of-care design and the high target threshold are precisely what make the ACT suitable for the deep anticoagulation of bypass, whereas the plasma-based aPTT saturates. The test choice is driven by the heparin concentration in use.' },
        { id: 'kp3', weight: 1, description: 'A bypass ACT below the 400-second threshold signals inadequate heparinization and calls for additional heparin, linking the numeric target back to a concrete intraoperative action.' },
      ],
      common_errors: [
        'Saying bypass heparin is at therapeutic concentration',
        'Describing the ACT as plasma-based rather than whole-blood',
        'Using an ACT bypass target other than at least 400 seconds',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ACT bypass test',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ACT bypass test', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-24',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acb-act-check-timing', 'atom-acb-act-confounders'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the ACT checking schedule with its confounders to explain how the ACT is interpreted safely during bypass.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The ACT is checked at baseline, 3 to 5 minutes after the heparin bolus, and every 30 minutes on bypass. Each value must be interpreted knowing that hypothermia, hemodilution, thrombocytopenia, and fibrinogen deficiency can all prolong the ACT without representing more heparin. The schedule provides the data and the confounder list provides the caveats.' },
        { id: 'kp2', weight: 2, description: 'Because a long ACT does not always mean a lot of heparin, serial values are read in the context of the patient\'s temperature, dilution, platelets, and fibrinogen rather than taken as pure heparin readouts. This prevents under-dosing heparin when the ACT is falsely elevated by a confounder.' },
        { id: 'kp3', weight: 1, description: 'Aprotinin is a special confounder that prolongs the celite-based ACT, and the remedy is to use a kaolin activator instead, an example of selecting the assay setup to remove a known interference during serial monitoring.' },
      ],
      common_errors: [
        'Treating every prolonged ACT as proof of adequate heparin',
        'Listing hyperthermia instead of hypothermia among the confounders',
        'Forgetting that kaolin, not celite, avoids the aprotinin artifact',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ACT confounders',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ACT confounders', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-25',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acc-hit-type-1', 'atom-acc-hit-type-2-overview'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Contrast HIT type I and type II across immune status, timing, clinical significance, and incidence by heparin type.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Type I is non-immune and benign, with platelets dropping within hours of starting heparin from direct platelet aggregation, and it requires no intervention. Type II is immune-mediated, the dangerous form, and is the one that kills patients.' },
        { id: 'kp2', weight: 2, description: 'Type II is prothrombotic rather than benign and develops on a delayed timeline as IgG antibodies form, unlike the immediate, self-limited type I drop. Distinguishing them at the bedside prevents both overreaction to type I and underreaction to type II.' },
        { id: 'kp3', weight: 1, description: 'Type II incidence is roughly 0.5 to 3% with unfractionated heparin and only about 0.2% with low-molecular-weight heparin, because LMWH forms fewer immunogenic heparin-PF4 complexes.' },
      ],
      common_errors: [
        'Treating a benign type I drop as if it were type II',
        'Claiming LMWH carries higher HIT risk than UFH',
        'Describing type II as a bleeding rather than clotting disorder',
      ],
      minimum_passing_score: 60,
    },
    topic: 'HIT comparison',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'HIT comparison', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-26',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acc-hit-mechanism', 'atom-acc-hit-timing-threshold'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the immune mechanism of HIT type II with its characteristic onset window and platelet criteria.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Heparin binds platelet factor 4, the heparin-PF4 complex is recognized by IgG, and antibody crosslinking of platelet Fc receptors activates platelets that are then consumed in microthrombi. The antigen is the heparin-PF4 complex, not heparin alone.' },
        { id: 'kp2', weight: 2, description: 'Because mounting an IgG response takes time, the onset is delayed to day 4 to 14, with platelets falling at least 50% from baseline or below 100,000. The mechanism explains the timing: antibodies must first form before platelet activation and the count drop occur.' },
        { id: 'kp3', weight: 1, description: 'A 50% relative fall can matter even when the absolute count remains above 100,000, so the relative drop is part of the diagnostic criteria alongside the day 4 to 14 window.' },
      ],
      common_errors: [
        'Expecting an immediate platelet drop despite the antibody-mediated mechanism',
        'Naming antithrombin instead of PF4 as the heparin partner',
        'Requiring a very low absolute count and ignoring the 50% fall',
      ],
      minimum_passing_score: 60,
    },
    topic: 'HIT mechanism and timing',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'HIT mechanism and timing', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-27',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acc-hit-paradox', 'atom-acc-4ts-score'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Connect the HIT paradox of thrombosis despite thrombocytopenia to how the 4Ts score guides bedside action.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'In HIT, platelets fall yet thrombosis rises, producing deep vein thrombosis, pulmonary embolism, arterial thrombosis, and limb ischemia. The activated platelets drive clotting, so the low count does not protect the patient.' },
        { id: 'kp2', weight: 2, description: 'The 4Ts score quantifies suspicion using Thrombocytopenia, Timing, Thrombosis, and oTher causes, each scored 0 to 2. A total of 4 or more prompts sending HIT antibodies and switching off heparin, linking the clinical paradox to a concrete decision rule.' },
        { id: 'kp3', weight: 1, description: 'The Thrombosis component of the 4Ts directly captures the paradox, and the antibody titer is a separate confirmatory test rather than one of the four Ts.' },
      ],
      common_errors: [
        'Assuming a falling platelet count protects against clotting',
        'Acting only at a 4Ts score of 6 or higher',
        'Counting the anti-PF4 titer as a 4Ts component',
      ],
      minimum_passing_score: 60,
    },
    topic: 'HIT recognition',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'HIT recognition', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-28',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acc-hit-stop-heparin', 'atom-acc-hit-dti'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the two pillars of HIT management: removing all heparin and selecting the correct replacement anticoagulant.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'All heparin must be stopped, including flushes and heparin-coated catheters, because any source can perpetuate antibody-mediated platelet activation. Removing the trigger is necessary but not sufficient.' },
        { id: 'kp2', weight: 2, description: 'Because these patients continue to clot, a non-heparin anticoagulant must be started, and parenteral direct thrombin inhibitors such as bivalirudin and argatroban are the standard choice since they act independently of antithrombin and do not cross-react with HIT antibodies.' },
        { id: 'kp3', weight: 1, description: 'LMWH cross-reacts and is unsafe, prophylactic platelet transfusion can worsen thrombosis, and warfarin is not started acutely before adequate thrombin inhibition is established.' },
      ],
      common_errors: [
        'Stopping heparin but providing no replacement anticoagulation',
        'Substituting LMWH, which cross-reacts with HIT antibodies',
        'Leaving hidden heparin in flushes or coated catheters',
      ],
      minimum_passing_score: 60,
    },
    topic: 'HIT management',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'HIT management', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-29',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acc-protamine-mechanism', 'atom-acc-protamine-clearance'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate how protamine neutralizes heparin chemically with how the resulting complex is cleared.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Protamine, a strongly basic salmon-sperm polypeptide about 70% arginine, binds strongly acidic heparin through acid-base ionic binding to form an inactive complex. The neutralization is electrostatic, not enzymatic.' },
        { id: 'kp2', weight: 2, description: 'That inactive complex is then cleared by reticuloendothelial macrophages, mostly in liver and spleen, in about 20 minutes. The chemistry creates the complex and the macrophage system disposes of it.' },
        { id: 'kp3', weight: 1, description: 'Because macrophage clearance of the complex is faster than heparin elimination, this pairing of fast clearance with slowly released tissue heparin foreshadows the phenomenon of heparin rebound.' },
      ],
      common_errors: [
        'Reversing the acid-base roles of protamine and heparin',
        'Attributing clearance to renal rather than reticuloendothelial routes',
        'Quoting clearance in hours rather than about 20 minutes',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Protamine pharmacology',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Protamine pharmacology', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-30',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acc-protamine-dose', 'atom-acc-protamine-titration'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Connect the empiric protamine dosing rule to the concentration-guided titration many cardiac centers use instead.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The empiric rule is about 1 mg of protamine per 100 units of circulating heparin, estimated after accounting for the roughly 1 hour heparin half-life rather than the total heparin given. Dosing on total heparin systematically overshoots.' },
        { id: 'kp2', weight: 2, description: 'Because overshoot gives excess protamine, which is itself coagulopathic, many cardiac centers titrate from measured heparin concentration using devices such as the Hemochron HMS or HemoTec. Concentration-guided dosing delivers just enough protamine for the residual heparin.' },
        { id: 'kp3', weight: 1, description: 'Both approaches share the same goal of matching protamine to the heparin actually present; the empiric formula estimates it from elimination, while concentration-guided titration measures it directly to avoid overshoot.' },
      ],
      common_errors: [
        'Dosing protamine on total heparin given',
        'Assuming every center uses the empiric formula',
        'Thinking concentration-guided dosing aims to give more protamine',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Protamine dosing',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Protamine dosing', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-31',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acc-protamine-overdose', 'atom-acc-heparin-rebound'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the protamine overdose paradox with heparin rebound to explain a prolonging ACT hours after reversal.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Excess protamine is itself coagulopathic; it inhibits platelets and other serine proteases, so the activated clotting time actually rises with too much protamine. More protamine is not more reversal but a second coagulopathy.' },
        { id: 'kp2', weight: 2, description: 'Heparin rebound appears about 2 to 3 hours after the dose, when protamine cleared by macrophages in roughly 20 minutes is gone while tissue-sequestered heparin re-enters the circulation; it is treated with a small 5 to 15 mg dose, not the original 50 mg.' },
        { id: 'kp3', weight: 1, description: 'A prolonging ACT after reversal can therefore reflect either too much protamine or returning heparin, and the distinction matters: piling on more protamine for what is actually rebound would worsen, not fix, the coagulopathy.' },
      ],
      common_errors: [
        'Expecting the ACT to fall when excess protamine is given',
        'Repeating the full original protamine dose for rebound',
        'Confusing the 20-minute clearance with the 2 to 3 hour rebound timing',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Protamine pitfalls',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Protamine pitfalls', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-32',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acc-protamine-anaphylaxis', 'atom-acc-protamine-pulmonary'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the allergic and pulmonary catastrophic adverse reactions to protamine, including their risk factors and mediator.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Anaphylaxis risk is highest in diabetics on NPH insulin at roughly 1 in 50 versus about 1 in 500 in others, and is also raised by fish allergy, prior protamine exposure, and post-vasectomy status. These reflect prior protamine sensitization or salmon-sperm cross-reactivity.' },
        { id: 'kp2', weight: 2, description: 'Separately, protamine can cause acute pulmonary vasoconstriction with right ventricular failure, a catastrophic event driven by thromboxane release from pulmonary macrophages. This is a pulmonary vasoconstrictive crisis, not a systemic allergic drop in pressure.' },
        { id: 'kp3', weight: 1, description: 'Recognizing whether a reaction is allergic anaphylaxis or a thromboxane-mediated pulmonary crisis guides whether to treat with anaphylaxis measures or to support the failing right ventricle and lower pulmonary pressures.' },
      ],
      common_errors: [
        'Quoting equal anaphylaxis risk across all patients',
        'Attributing the pulmonary reaction to histamine rather than thromboxane',
        'Calling the pulmonary event left rather than right ventricular failure',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Protamine reactions',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Protamine reactions', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-33',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acc-protamine-hypotension', 'atom-acc-protamine-not-reverse'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate how protamine should be administered safely with the anticoagulants for which protamine is the wrong tool entirely.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'When protamine is appropriate, it should be given slowly over about 5 to 10 minutes, because the hypotension it can cause is largely a rate-related effect of rapid administration rather than a true allergic reaction.' },
        { id: 'kp2', weight: 2, description: 'Protamine is a complete reversal agent for unfractionated heparin only; it does not adequately reverse low-molecular-weight heparin, fondaparinux, the direct oral anticoagulants, or warfarin. Outside unfractionated heparin, reaching for protamine wastes time and may cause harm.' },
        { id: 'kp3', weight: 1, description: 'The combined lesson is to reserve protamine for unfractionated heparin and then administer it slowly; giving it fast risks hypotension, and giving it for the wrong drug exposes the patient to its risks without benefit.' },
      ],
      common_errors: [
        'Giving protamine as a rapid push and causing hypotension',
        'Believing protamine fully reverses LMWH or fondaparinux',
        'Reaching for protamine to treat warfarin or DOAC bleeding',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Protamine use and limits',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Protamine use and limits', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-34',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acc-lmwh-agents-weight', 'atom-acc-lmwh-mechanism'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the identity and size of LMWH agents with the mechanistic reason their anti-Xa activity dominates.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Enoxaparin and dalteparin are the prototypical LMWHs, with a molecular weight of about 4,000 to 5,000 daltons, roughly two-thirds smaller than unfractionated heparin. Their smaller size is the structural starting point for their distinct activity.' },
        { id: 'kp2', weight: 2, description: 'Because chains shorter than about 18 saccharides cannot bridge antithrombin and thrombin simultaneously, the short LMWH chains lose much anti-thrombin activity while retaining anti-factor Xa activity, yielding an anti-Xa to anti-thrombin ratio of 2:1 to 4:1 versus 1:1 for UFH.' },
        { id: 'kp3', weight: 1, description: 'LMWH still acts through antithrombin and is not antithrombin-independent like the direct oral anticoagulants, so the difference from UFH is one of ratio, not of mechanism class.' },
      ],
      common_errors: [
        'Quoting an LMWH weight similar to UFH',
        'Saying LMWH works independently of antithrombin',
        'Reversing the anti-Xa to anti-thrombin ratio',
      ],
      minimum_passing_score: 60,
    },
    topic: 'LMWH mechanism',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'LMWH mechanism', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-35',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acc-lmwh-advantages', 'atom-acc-lmwh-renal'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the pharmacokinetic advantages of LMWH with the renal limitation that restricts its use.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'LMWH offers more predictable pharmacokinetics and less protein binding than unfractionated heparin, allowing fixed or weight-based dosing without routine monitoring. This convenience is the main reason LMWH is widely used outside critical care.' },
        { id: 'kp2', weight: 2, description: 'That convenience reverses in renal failure, where renally cleared LMWH accumulates and cannot be easily titrated or fully reversed. In that setting unfractionated heparin is preferred because its clearance is not renally dependent and it is reversible with protamine.' },
        { id: 'kp3', weight: 1, description: 'When monitoring of LMWH is required in special populations such as renal impairment, obesity, or pregnancy, the appropriate test is an anti-factor Xa assay rather than the aPTT.' },
      ],
      common_errors: [
        'Assuming LMWH is safe without adjustment in renal failure',
        'Monitoring LMWH with an aPTT instead of an anti-Xa assay',
        'Choosing fondaparinux, which is also renally cleared, in renal failure',
      ],
      minimum_passing_score: 60,
    },
    topic: 'LMWH practice',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'LMWH practice', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-36',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acc-lmwh-protamine-partial', 'atom-acc-lmwh-neuraxial'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate why protamine cannot reliably reverse LMWH with the ASRA neuraxial timing intervals that compensate for that limitation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Protamine partially neutralizes only the anti-thrombin effect of LMWH, while the dominant anti-factor Xa activity persists. Because anti-Xa drives most of the LMWH effect given its 2:1 to 4:1 ratio, there is no dependable on-demand reversal agent for LMWH.' },
        { id: 'kp2', weight: 2, description: 'Because reversal is unreliable, safe neuraxial practice depends on waiting out the drug: ASRA requires 12 hours after a prophylactic LMWH dose and 24 hours after a therapeutic dose before block or catheter removal, since an epidural hematoma is a career-ending complication.' },
        { id: 'kp3', weight: 1, description: 'The connection is that you cannot rescue a poorly timed block with protamine, so the timing intervals exist precisely because the anti-Xa effect of LMWH cannot be reversed in a hurry.' },
      ],
      common_errors: [
        'Assuming protamine can rescue a poorly timed LMWH block',
        'Swapping the 12-hour and 24-hour LMWH intervals',
        'Reversing which LMWH effect, anti-Xa versus anti-IIa, persists',
      ],
      minimum_passing_score: 60,
    },
    topic: 'LMWH timing and reversal',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'LMWH timing and reversal', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-37',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acd-warfarin-mechanism', 'atom-acd-warfarin-factor-halflives'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate warfarin\'s molecular mechanism with the factor half-life ladder to explain why the INR rises within 24 hours yet true anticoagulation is delayed for several days.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Warfarin inhibits vitamin K epoxide reductase, blocking gamma-carboxylation so that newly made factors II, VII, IX, and X cannot bind calcium and are nonfunctional, while already-circulating carboxylated factors are unaffected. The drug therefore acts only by attrition as existing factors are cleared and replaced by defective ones.' },
        { id: 'kp2', weight: 2, description: 'Because the prothrombin time is most sensitive to factor VII and factor VII has the shortest half-life at about 6 hours, the INR rises early, within roughly 24 hours. This early rise reflects loss of factor VII, not full anticoagulation.' },
        { id: 'kp3', weight: 1, description: 'True antithrombotic protection requires the longest-lived factor, prothrombin (factor II) at about 60 hours, to fall, which takes several days. The gap between a rising INR and real protection is precisely why warfarin is slow in onset and why bridging is considered when rapid effect is needed.' },
      ],
      common_errors: [
        'Treating an INR in range at 24 hours as proof of full anticoagulation',
        'Forgetting that only newly synthesized factors are nonfunctional',
        'Attributing the early INR rise to factor II rather than factor VII',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Warfarin onset',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Warfarin onset', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-38',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acd-warfarin-procoagulant-phase', 'atom-acd-warfarin-inr-targets'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Connect warfarin\'s early procoagulant phase with its monitoring and INR targets to justify both heparin bridging at initiation and the specific target chosen for a mechanical mitral valve.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Proteins C and S are vitamin K dependent anticoagulants, and protein C has a short half-life of about 8 hours, so it falls before prothrombin. For the first 24 to 48 hours the net effect is prothrombotic, which underlies warfarin-induced skin necrosis in protein C deficiency and the rationale for overlapping heparin (bridging) when rapid safe effect is needed.' },
        { id: 'kp2', weight: 2, description: 'Warfarin is monitored by the PT/INR, normalized across labs by the International Sensitivity Index. The standard target is 2.0 to 3.0 for most indications, while mechanical mitral valves require a more intense 2.5 to 3.5 because they carry the highest thrombotic risk.' },
        { id: 'kp3', weight: 1, description: 'Putting these together, a patient with a mechanical mitral valve both needs the higher 2.5 to 3.5 target and is a classic bridging exception, since the early procoagulant window plus a high-risk prosthesis makes an uncovered initiation dangerous.' },
      ],
      common_errors: [
        'Assuming warfarin is protective from the first dose despite the procoagulant phase',
        'Using a 2.0 to 3.0 target for a mechanical mitral valve',
        'Forgetting that protein C deficiency drives warfarin skin necrosis',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Warfarin initiation',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Warfarin initiation', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-39',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acd-warfarin-perioperative', 'atom-acd-bridge-trial'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Combine perioperative warfarin timing with the BRIDGE trial results to construct a complete plan for interrupting warfarin in a typical atrial fibrillation patient before elective surgery.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Warfarin is stopped about 5 days before elective surgery, the INR is rechecked the day before with 1 to 2 mg oral vitamin K given if still elevated, and surgery proceeds when the INR is below 1.5. This timing exploits the recovery of factor function once the drug is held.' },
        { id: 'kp2', weight: 2, description: 'BRIDGE (NEJM 2015) randomized 1884 AF patients and found thromboembolism essentially identical at 0.3% versus 0.4% but major bleeding more than doubled with bridging at 3.2% versus 1.3%. Bridging caused bleeding harm without preventing strokes in typical AF.' },
        { id: 'kp3', weight: 1, description: 'The combined plan for a typical AF patient is to stop warfarin 5 days out, confirm an INR below 1.5, and not bridge, because the BRIDGE data show no thrombotic benefit and clear bleeding harm from bridging this population.' },
      ],
      common_errors: [
        'Bridging a typical AF patient and accepting the bleeding harm for no benefit',
        'Operating before confirming an INR below 1.5',
        'Stopping warfarin too late to allow the INR to normalize',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Perioperative warfarin',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Perioperative warfarin', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-40',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acd-bridging-exceptions', 'atom-acd-warfarin-urgent-reversal'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the bridging exceptions with urgent warfarin reversal to manage a high-thrombotic-risk warfarin patient who presents with major bleeding or needs emergency surgery.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Bridging exceptions are mechanical valves especially mitral, recent venous thromboembolism within 3 months, and highest-risk CHA2DS2-VASc patients with prior stroke. These patients have the thrombotic risk that justifies bridging, but they also bleed and may need emergent reversal.' },
        { id: 'kp2', weight: 2, description: 'For active bleeding or emergency surgery, 4-factor PCC (Kcentra) containing factors II, VII, IX, X plus proteins C, S, and antithrombin restores the INR below 1.3 in about 30 minutes in roughly 55% of patients, versus 10% for FFP, in only about 100 mL with no crossmatch, TRALI, or TACO. IV vitamin K 10 mg slowly is added because the PCC effect is transient at 6 to 8 hours.' },
        { id: 'kp3', weight: 1, description: 'FFP has its own INR of 1.4 to 1.6 and cannot bring a patient below 1.5, so it is the wrong first-line tool. In a high-risk patient who is bleeding, the right approach is rapid PCC plus vitamin K, then restart anticoagulation as soon as hemostasis allows given the high thrombotic risk.' },
      ],
      common_errors: [
        'Choosing FFP first-line and being unable to get below an INR of 1.5',
        'Omitting vitamin K and missing the transient duration of PCC',
        'Failing to recognize the patient as a high-risk group needing prompt re-anticoagulation',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Urgent reversal',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Urgent reversal', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-41',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acd-warfarin-nonurgent-reversal', 'atom-acd-doac-reversal'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Contrast non-urgent warfarin reversal with the targeted DOAC reversal agents to choose the correct strategy based on which anticoagulant the patient is taking and whether there is bleeding.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'For a high INR on warfarin without bleeding, the answer is to hold warfarin and give oral vitamin K 5 to 10 mg, with the INR falling over about 24 hours; high-dose or IV vitamin K overshoots and causes warfarin resistance on resumption. This is a slow, gentle correction appropriate when there is no emergency.' },
        { id: 'kp2', weight: 2, description: 'DOACs have targeted antidotes rather than vitamin K. Dabigatran is reversed by idarucizumab (Praxbind), an antibody fragment binding with about 350 times its affinity for thrombin, while factor Xa inhibitors are reversed by andexanet alfa (Andexxa), a recombinant inactive Xa decoy; ANNEXA-I in 2024 showed superior hemostasis in intracranial hemorrhage but more thrombotic events.' },
        { id: 'kp3', weight: 1, description: 'The unifying principle is that vitamin K reverses warfarin but does nothing for DOACs, while the DOAC antidotes do nothing for warfarin. Off-label 4-factor PCC is the practical default for DOAC bleeding at most US institutions, and the choice always depends on identifying the drug and the urgency.' },
      ],
      common_errors: [
        'Giving vitamin K to reverse a DOAC',
        'Using a DOAC antidote for warfarin reversal',
        'Treating a non-bleeding high INR with aggressive IV vitamin K and causing resistance',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Reversal strategy',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Reversal strategy', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-42',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acd-doac-rationale-mechanism', 'atom-acd-four-doacs'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the rationale and unifying mechanism of the DOACs with the identities of the four agents to map each drug to its target, dosing frequency, and shared requirements.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'DOACs replace warfarin without monitoring, interactions, or slow onset, and all are antithrombin-independent, binding the active site of their target directly. The class splits into one direct thrombin inhibitor and three direct factor Xa inhibitors, a framework that organizes the four drugs.' },
        { id: 'kp2', weight: 2, description: 'Dabigatran (Pradaxa) is the thrombin inhibitor dosed twice daily, while rivaroxaban (Xarelto, once daily), apixaban (Eliquis, twice daily), and edoxaban (Savaysa, once daily) are the factor Xa inhibitors. The twice-daily drugs are dabigatran and apixaban; the once-daily drugs are rivaroxaban and edoxaban.' },
        { id: 'kp3', weight: 1, description: 'All four require renal dose adjustment, with dabigatran the most renally dependent. This shared requirement matters because renal function drives both routine dosing and the perioperative interruption timing under the PAUSE protocol.' },
      ],
      common_errors: [
        'Calling a factor Xa inhibitor a thrombin inhibitor or vice versa',
        'Misassigning once-daily versus twice-daily dosing among the Xa inhibitors',
        'Claiming DOACs work through antithrombin or need no renal adjustment',
      ],
      minimum_passing_score: 60,
    },
    topic: 'The four DOACs',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'The four DOACs', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-43',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acd-doac-monitoring', 'atom-acd-pause-protocol'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Combine DOAC monitoring principles with the PAUSE perioperative protocol to manage a DOAC patient before surgery, including why a normal INR is reassuring or not.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'DOACs usually need no monitoring; when required, dabigatran is measured with thrombin-based assays such as the thrombin time, dilute thrombin time, or ecarin clotting time, and factor Xa inhibitors with a drug-specific calibrated anti-Xa assay. Critically, the PT/INR is not useful for the direct Xa inhibitors, so a normal INR does not prove the drug has cleared.' },
        { id: 'kp2', weight: 2, description: 'PAUSE (JAMA Internal Medicine 2019, n=3007 AF) directs stopping the DOAC 1 day before low-bleeding-risk procedures and 2 days before high-bleeding-risk procedures, resuming 1 day or 2 to 3 days after respectively, with renal adjustment. Outcomes were about 1% major bleeding and under 0.5% thromboembolism with no bridging.' },
        { id: 'kp3', weight: 1, description: 'Putting these together, perioperative DOAC management relies on time and renal function rather than a reassuring INR, because the INR cannot confirm clearance of a factor Xa inhibitor. The short half-lives are exactly why a timed stop-and-resume works and bridging is unnecessary.' },
      ],
      common_errors: [
        'Clearing a patient for surgery based on a normal INR while on a factor Xa inhibitor',
        'Bridging a DOAC patient instead of using the timed PAUSE approach',
        'Ignoring renal function when setting the stop time',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Perioperative DOAC',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Perioperative DOAC', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-44',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ace-aspirin-cox1', 'atom-ace-aspirin-pk'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate aspirin\'s irreversible COX-1 mechanism with its pharmacokinetics to explain why a 15 minute plasma half-life produces a 7 to 10 day antiplatelet effect.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Aspirin irreversibly acetylates cyclooxygenase-1, covalently and permanently disabling the enzyme so the platelet can no longer make thromboxane A2 and can no longer amplify activation. The covalent, irreversible nature of the block is the molecular root of the prolonged effect.' },
        { id: 'kp2', weight: 2, description: 'Because the platelet lacks a nucleus and cannot resynthesize COX-1, the acetylation lasts for that platelet\'s 7 to 10 day lifespan even though aspirin itself clears from plasma in about 15 minutes. Effect duration is therefore set by platelet turnover, not drug clearance.' },
        { id: 'kp3', weight: 1, description: 'This decoupling explains the clinical 7 to 10 day interruption window when full reversal is required, since only newly produced platelets carry functional enzyme. It also underlies why a single dose can affect hemostasis for days.' },
      ],
      common_errors: [
        'Attributing the long effect to a long-lived metabolite rather than irreversible enzyme block',
        'Saying platelet function returns once aspirin is cleared from plasma',
        'Confusing the 15 minute drug half-life with the 7 to 10 day platelet lifespan',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Aspirin mechanism and pharmacokinetics',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Aspirin mechanism and pharmacokinetics', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-45',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ace-asa-primary', 'atom-ace-asa-secondary'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the primary and secondary prevention rules for perioperative aspirin, naming the supporting trial and stating whether aspirin contraindicates neuraxial anesthesia.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The first question is what the patient takes aspirin for. Primary prevention aspirin is usually safe to stop before surgery, supported by POISE-2, which showed no benefit to continuing it in non-cardiac surgery.' },
        { id: 'kp2', weight: 2, description: 'Secondary prevention aspirin, meaning post-stent, post-myocardial-infarction, or post-stroke, is continued through most surgery including cardiac surgery, because withdrawal in established atherothrombotic disease risks ischemic events.' },
        { id: 'kp3', weight: 1, description: 'Aspirin is not a contraindication to neuraxial anesthesia, and if it must be interrupted it is stopped 7 to 10 days before and resumed the morning after surgery.' },
      ],
      common_errors: [
        'Claiming POISE-2 showed benefit to continuing aspirin',
        'Routinely stopping secondary prevention aspirin before surgery',
        'Believing aspirin alone prohibits a spinal or epidural',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Aspirin perioperative management',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Aspirin perioperative management', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-46',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ace-p2y12-receptor', 'atom-ace-clopidogrel'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the function of the P2Y12 receptor with clopidogrel\'s pharmacology to explain how the drug acts and why response varies between patients.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'P2Y12 is the platelet ADP receptor; activated platelets release ADP that binds P2Y12 on neighbors to recruit more platelets in a positive feedback loop that amplifies thrombosis. Blocking P2Y12 breaks this loop.' },
        { id: 'kp2', weight: 2, description: 'Clopidogrel is a prodrug requiring two CYP2C19-dependent hepatic activation steps and then binds P2Y12 irreversibly, so its effect persists for the platelet lifespan. This is the mechanistic basis for its antiplatelet action at the receptor.' },
        { id: 'kp3', weight: 1, description: 'Because activation depends on CYP2C19, the 20 to 30 percent of patients with loss-of-function variants underactivate the drug, the basis of clopidogrel resistance; the ASRA neuraxial hold is 7 days.' },
      ],
      common_errors: [
        'Naming thromboxane or fibrinogen as the P2Y12 ligand',
        'Calling clopidogrel direct-acting or reversibly bound',
        'Attributing resistance to renal clearance rather than CYP2C19 variants',
      ],
      minimum_passing_score: 60,
    },
    topic: 'P2Y12 receptor and clopidogrel',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'P2Y12 receptor and clopidogrel', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-47',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ace-prasugrel', 'atom-ace-ticagrelor'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Contrast prasugrel and ticagrelor by activation, reversibility, what their effect duration tracks, and their ASRA neuraxial holds.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Prasugrel is a single-step prodrug, more potent than clopidogrel with rare resistance, and binds P2Y12 irreversibly, so its effect persists for the platelet lifespan; its ASRA hold is 7 to 10 days.' },
        { id: 'kp2', weight: 2, description: 'Ticagrelor is direct-acting and reversibly bound, requiring no hepatic activation, so its effect tracks the drug half-life rather than platelet turnover; its ASRA hold is 5 to 7 days.' },
        { id: 'kp3', weight: 1, description: 'The reversibility difference explains the timing difference: irreversible prasugrel needs the longer 7 to 10 day window for platelet regeneration, while reversible ticagrelor needs only 5 to 7 days for drug clearance.' },
      ],
      common_errors: [
        'Calling prasugrel reversible or ticagrelor a prodrug',
        'Swapping the 7 to 10 day and 5 to 7 day holds',
        'Saying ticagrelor\'s effect tracks platelet lifespan rather than drug half-life',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Prasugrel versus ticagrelor',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Prasugrel versus ticagrelor', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-48',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ace-dapt-definition', 'atom-ace-stent-duration'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the definition and rationale of dual antiplatelet therapy with the recommended durations for bare-metal and drug-eluting stents.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Dual antiplatelet therapy is aspirin plus a P2Y12 inhibitor after stenting, needed because the stent is a thrombogenic foreign body until endothelium grows over it. The two mechanisms together protect the stent during endothelialization.' },
        { id: 'kp2', weight: 2, description: 'A bare-metal stent requires a minimum of 30 days of DAPT, while a current-generation drug-eluting stent requires 3 months for stable disease and 6 to 12 months for acute coronary syndrome, reflecting slower endothelialization and higher thrombotic risk.' },
        { id: 'kp3', weight: 1, description: 'Aspirin is continued indefinitely in most patients even after the P2Y12 inhibitor is stopped, so DAPT itself is time-limited but single antiplatelet therapy persists.' },
      ],
      common_errors: [
        'Defining DAPT as aspirin plus warfarin or two P2Y12 inhibitors',
        'Giving the bare-metal minimum as 6 or 12 months',
        'Swapping the stable disease and ACS drug-eluting durations',
      ],
      minimum_passing_score: 60,
    },
    topic: 'DAPT definition and stent durations',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'DAPT definition and stent durations', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-49',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ace-operative-dapt', 'atom-ace-gp2b3a-target'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the danger of early P2Y12 discontinuation within the DAPT window with the mechanism of glycoprotein IIb/IIIa antagonists at the final common pathway of aggregation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Stopping the P2Y12 inhibitor early in the DAPT window risks in-stent thrombosis and ST-elevation myocardial infarction with mortality of 20 to 40 percent, so elective surgery is deferred until the window is complete.' },
        { id: 'kp2', weight: 2, description: 'Glycoprotein IIb/IIIa antagonists block the fibrinogen receptor, the final common pathway of platelet aggregation downstream of both thromboxane and ADP signaling, making them the most potent platelet inhibitors.' },
        { id: 'kp3', weight: 1, description: 'Both concepts highlight platelet-mediated thrombosis as the threat around stents and procedures; the P2Y12 timing rule manages risk over time, while the final-common-pathway target explains why GP IIb/IIIa blockade is so potent.' },
      ],
      common_errors: [
        'Underestimating stent thrombosis mortality as under 1 percent',
        'Proceeding with elective surgery by stopping the P2Y12 inhibitor early',
        'Confusing the GP IIb/IIIa fibrinogen receptor with P2Y12 or COX-1',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Operative DAPT and GP IIb/IIIa target',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Operative DAPT and GP IIb/IIIa target', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-50',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ace-gp2b3a-agents', 'atom-ace-asra-rationale'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the three glycoprotein IIb/IIIa antagonists and their shared adverse effect with the purpose and reference of the ASRA neuraxial timing guidelines.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Abciximab is a monoclonal antibody with 24 to 48 hour platelet recovery, while eptifibatide (a peptide) and tirofiban (a non-peptide) have short half-lives; all three can cause thrombocytopenia and have been largely supplanted by oral P2Y12 inhibitors plus cangrelor.' },
        { id: 'kp2', weight: 2, description: 'The ASRA neuraxial timing rules exist to prevent epidural hematoma in the anticoagulated patient, a rare but devastating and preventable complication; the maxim is that if you cannot remember a number you do not do the block.' },
        { id: 'kp3', weight: 1, description: 'The governing reference is the ASRA guideline, 4th edition, Horlocker and colleagues, 2018, which anchors the specific antiplatelet, heparin, warfarin, and DOAC timing numbers.' },
      ],
      common_errors: [
        'Calling abciximab a peptide or giving it a short half-life',
        'Forgetting that all three GP IIb/IIIa antagonists can cause thrombocytopenia',
        'Naming postdural puncture headache rather than epidural hematoma as the prevented complication',
      ],
      minimum_passing_score: 60,
    },
    topic: 'GP IIb/IIIa agents and ASRA rationale',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'GP IIb/IIIa agents and ASRA rationale', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-51',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ace-asra-aspirin', 'atom-ace-asra-clopidogrel'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the ASRA neuraxial recommendations for aspirin alone and clopidogrel, contrasting clopidogrel with prasugrel and ticagrelor.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'ASRA places no neuraxial restriction on aspirin alone, consistent with aspirin not being a contraindication to neuraxial anesthesia; the no-restriction rule applies only when aspirin is the sole antiplatelet.' },
        { id: 'kp2', weight: 2, description: 'Clopidogrel must be held 7 days before neuraxial because it binds P2Y12 irreversibly, requiring regeneration of unblocked platelets over about a week.' },
        { id: 'kp3', weight: 1, description: 'The clopidogrel 7 day hold sits between prasugrel at 7 to 10 days and ticagrelor at 5 to 7 days, with prasugrel longer for potency and irreversibility and ticagrelor shorter for reversibility.' },
      ],
      common_errors: [
        'Imposing a hold for aspirin alone',
        'Giving the clopidogrel hold as 5 to 7 days or 7 to 10 days',
        'Applying the aspirin no-restriction rule when a P2Y12 inhibitor is also on board',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ASRA aspirin and clopidogrel',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ASRA aspirin and clopidogrel', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-52',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ace-asra-prasugrel', 'atom-ace-asra-ticagrelor'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the ASRA neuraxial holds for prasugrel and ticagrelor, explain why they differ, and state the shared restart timing after catheter removal.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Prasugrel is held 7 to 10 days before neuraxial, the longest P2Y12 window, because it is potent and binds irreversibly so recovery depends on platelet turnover.' },
        { id: 'kp2', weight: 2, description: 'Ticagrelor is held only 5 to 7 days because it binds reversibly and its effect tracks drug clearance rather than platelet lifespan; mechanism therefore explains the shorter interval.' },
        { id: 'kp3', weight: 1, description: 'After catheter removal, any P2Y12 inhibitor may be restarted 6 hours later, a uniform interval that also matches the 6 hour DOAC restart.' },
      ],
      common_errors: [
        'Swapping the 7 to 10 day prasugrel and 5 to 7 day ticagrelor holds',
        'Saying prasugrel is reversible and needs a shorter hold',
        'Stating the P2Y12 restart as 24 hours or immediately rather than 6 hours',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ASRA prasugrel and ticagrelor',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ASRA prasugrel and ticagrelor', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-53',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ace-asra-subq-heparin', 'atom-ace-asra-iv-heparin'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the ASRA neuraxial requirements for subcutaneous heparin (low-dose versus higher-dose or TID) and for intravenous therapeutic heparin.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Low-dose subcutaneous heparin prophylaxis (BID, 10000 units per day or less) needs a 4 to 6 hour hold with no required aPTT, while higher-dose or TID subcutaneous heparin needs 12 hours plus a documented normal aPTT.' },
        { id: 'kp2', weight: 2, description: 'Intravenous therapeutic heparin needs a 4 to 6 hour hold plus a documented normal aPTT, the same time window as low-dose subcutaneous prophylaxis but with the lab confirmation that full IV therapy demands.' },
        { id: 'kp3', weight: 1, description: 'The correct monitoring test for unfractionated heparin throughout is the aPTT, not the INR, and these short windows reflect heparin\'s roughly 1 hour half-life.' },
      ],
      common_errors: [
        'Applying the 12 hour rule to low-dose BID prophylaxis',
        'Omitting the normal aPTT for IV therapeutic heparin or higher-dose subcutaneous heparin',
        'Using the INR rather than the aPTT to confirm heparin resolution',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ASRA subcutaneous and intravenous heparin',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ASRA subcutaneous and intravenous heparin', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-54',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ace-asra-lmwh', 'atom-ace-asra-warfarin'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the ASRA neuraxial holds for prophylactic and therapeutic low-molecular-weight heparin with the warfarin INR threshold for block placement and catheter removal.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Prophylactic low-molecular-weight heparin requires a 12 hour hold and therapeutic LMWH requires 24 hours before neuraxial, the doubling reflecting the greater and longer anti-factor Xa effect at therapeutic dosing.' },
        { id: 'kp2', weight: 2, description: 'Warfarin must be stopped until the INR is below 1.5, typically about 5 days, both to place a neuraxial block and to remove a catheter, applying one INR threshold to both steps.' },
        { id: 'kp3', weight: 1, description: 'These figures separate the longer-acting agents from unfractionated heparin: LMWH at 12 or 24 hours and warfarin gated by an INR below 1.5 rather than a fixed short hold.' },
      ],
      common_errors: [
        'Swapping the 12 hour prophylactic and 24 hour therapeutic LMWH intervals',
        'Using an INR threshold of 2.0 or 1.3 instead of below 1.5',
        'Applying the warfarin INR threshold only to placement and not to catheter removal',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ASRA LMWH and warfarin',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ASRA LMWH and warfarin', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-55',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-ace-asra-dabigatran', 'atom-ace-asra-xa-doac'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the ASRA neuraxial holds for dabigatran and the oral direct factor Xa inhibitors, including how renal function and the restart timing apply.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Dabigatran, the direct thrombin inhibitor, is held 4 to 5 days before neuraxial and longer if renal function is impaired, because it is cleared predominantly by the kidney and accumulates in renal insufficiency.' },
        { id: 'kp2', weight: 2, description: 'The oral direct factor Xa inhibitors rivaroxaban, apixaban, and edoxaban are each held 72 hours before neuraxial, a single shared figure distinct from dabigatran\'s 4 to 5 days.' },
        { id: 'kp3', weight: 1, description: 'After catheter removal, any DOAC may be restarted 6 hours later, the same restart interval used for the P2Y12 inhibitors.' },
      ],
      common_errors: [
        'Giving the oral Xa inhibitors a 4 to 5 day hold or dabigatran a 72 hour hold',
        'Failing to extend the dabigatran hold for renal impairment',
        'Stating the DOAC restart as 72 hours or immediately rather than 6 hours after catheter removal',
      ],
      minimum_passing_score: 60,
    },
    topic: 'ASRA dabigatran and factor Xa inhibitors',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'ASRA dabigatran and factor Xa inhibitors', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-56',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acf-txa-mechanism', 'atom-acf-crash2-trial'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the molecular mechanism of tranexamic acid with the CRASH-2 evidence to explain why a drug that only preserves existing clot produces a measurable mortality benefit in trauma, and connect the dosing and timing to the mechanism.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'TXA is a lysine analog that blocks the lysine-binding site on plasminogen, so plasminogen cannot bind fibrin and tPA cannot generate plasmin, sparing the clot already formed. In trauma, where hyperfibrinolysis prematurely dissolves hemostatic clot, preserving that clot directly reduces ongoing hemorrhage. The drug adds no new clot, it simply stops the existing one from being torn down.' },
        { id: 'kp2', weight: 2, description: 'CRASH-2 (Lancet 2010, 20,211 patients) showed all-cause mortality 14.5% versus 16.0% and death from bleeding 4.9% versus 5.7% when TXA was given within 8 hours of injury as 1 g over 10 minutes then 1 g over 8 hours. The early window matters because the antifibrinolytic effect is only useful while clot is actively forming and being lysed. Give it too late and there is no fresh clot left to protect.' },
        { id: 'kp3', weight: 1, description: 'CRASH-3 in 2019 extended the benefit to isolated traumatic brain injury, reinforcing that early antifibrinolysis helps where bleeding is clot-dependent.' },
      ],
      common_errors: [
        'Claiming TXA helps by forming new clot rather than preserving existing clot',
        'Stating the CRASH-2 window was 3 hours instead of within 8 hours of injury',
        'Swapping the 14.5 vs 16.0 mortality figures with the 4.9 vs 5.7 bleeding-death figures',
      ],
      minimum_passing_score: 60,
    },
    topic: 'TXA mechanism and CRASH-2',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'TXA mechanism and CRASH-2', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-57',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acf-atacas-trial', 'atom-acf-ddavp-indications'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Contrast tranexamic acid (per ATACAS) and desmopressin as procoagulant adjuncts in cardiac surgery, integrating their respective efficacy magnitudes and their main risks or limitations to explain why TXA is routine and DDAVP is not.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'ATACAS (NEJM 2017, 4,631 CABG patients) showed TXA roughly halved transfusion and cut reoperation for bleeding from 2.8% to 1.4%, a robust efficacy signal that drives routine use of a 1 g load plus 1 g infusion. The cost is a sevenfold rise in seizures, 0.7% versus 0.1%, from GABA-A antagonism at high doses, so it is used with caution in elderly and open-chamber patients. The benefit is large and broadly applicable across cardiac cases.' },
        { id: 'kp2', weight: 2, description: 'DDAVP, by contrast, is not a routine cardiac rescue: a meta-analysis of 18 trials and ~1,300 patients found only about a 115 mL median reduction in blood loss. Its genuine value is targeted, in type 1 von Willebrand disease (strongest indication), mild hemophilia A, and uremic platelet dysfunction, where it mobilizes vWF and factor VIII. Used outside those niches it adds little.' },
        { id: 'kp3', weight: 1, description: 'The synthesis is that TXA earns routine cardiac use through a large transfusion benefit despite seizure risk, whereas DDAVP is reserved for specific factor or platelet-function defects because its general cardiac benefit is marginal.' },
      ],
      common_errors: [
        'Treating DDAVP as a routine post-bypass rescue equivalent to TXA',
        'Forgetting the TXA seizure signal of 0.7 vs 0.1 percent from GABA-A antagonism',
        'Listing severe hemophilia B rather than mild hemophilia A as a DDAVP indication',
      ],
      minimum_passing_score: 60,
    },
    topic: 'TXA and DDAVP in cardiac surgery',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'TXA and DDAVP in cardiac surgery', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-58',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acf-ddavp-mechanism', 'atom-acf-fibrinogen-substrate'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the desmopressin mechanism with fibrinogen biology to distinguish two fundamentally different ways to support hemostasis: mobilizing a stored factor versus repleting a consumed structural substrate, and tie each to its source and key numbers.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'DDAVP, a V2 receptor analog dosed at 0.3 mcg/kg IV over 15 to 30 minutes, supports hemostasis by releasing stored von Willebrand factor and factor VIII from endothelial Weibel-Palade bodies. This is mobilization of an endogenous store rather than replacement, and it is rate-sensitive because a fast push causes hypotension. It boosts platelet adhesion and the factor VIII carrier function without adding any structural clot material.' },
        { id: 'kp2', weight: 2, description: 'Fibrinogen, in contrast, is the structural substrate that thrombin cleaves into fibrin; it is a 340-kDa hepatic glycoprotein with a normal range of 200 to 400 mg/dL and a half-life of about 3.7 days. When it is consumed in hemorrhage it must be repleted, not merely mobilized, since there is no rapidly releasable endothelial store of fibrinogen. Pregnancy raises it above 400, so a sharp drop in postpartum hemorrhage is an early warning.' },
        { id: 'kp3', weight: 1, description: 'The unifying idea is that DDAVP mobilizes a releasable endothelial store of vWF and factor VIII, whereas fibrinogen must be physically replaced once depleted, which is why the management strategies differ.' },
      ],
      common_errors: [
        'Saying DDAVP repletes fibrinogen or that fibrinogen can be released from Weibel-Palade bodies',
        'Giving the DDAVP dose in milligrams or as a fast push',
        'Quoting a fibrinogen normal range other than 200 to 400 mg/dL',
      ],
      minimum_passing_score: 60,
    },
    topic: 'DDAVP release versus fibrinogen repletion',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'DDAVP release versus fibrinogen repletion', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-59',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acf-fibrinogen-repletion', 'atom-acf-pcc-content-role'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate fibrinogen repletion options with prothrombin complex concentrates to build a product-selection framework: which deficit each product addresses, why FFP is a poor choice for both fibrinogen and factor repletion, and the niche of 3-factor PCC and FEIBA.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'For a low fibrinogen in a bleeding patient, target above 150 to 200 mg/dL using cryoprecipitate (1 unit per 10 kg raises fibrinogen 50 to 70 mg/dL) or fibrinogen concentrate (RiaSTAP). For an urgent warfarin-related multifactor deficit, the answer is 4-factor PCC (Kcentra), which supplies factors II, VII, IX, X plus proteins C, S, and antithrombin and is first-line for warfarin reversal. Matching the product to the specific deficit is the core skill.' },
        { id: 'kp2', weight: 2, description: 'Fresh frozen plasma is a poor choice for both jobs: its fibrinogen is only about 200 mg/dL, so it cannot efficiently raise a low fibrinogen, and as a dilute, large-volume product it is inferior to concentrated 4-factor PCC for rapid factor repletion. Concentrated products win on speed and volume. The recurring lesson is to avoid FFP when a targeted concentrate exists.' },
        { id: 'kp3', weight: 1, description: '3-factor PCCs (Profilnine, Bebulin) are low in factor VII and thus weaker for warfarin, while FEIBA is an activated PCC reserved for hemophilia with inhibitors, distinct from routine reversal use.' },
      ],
      common_errors: [
        'Using FFP as the primary fix for either low fibrinogen or urgent warfarin reversal',
        'Assigning the II, IX, X only profile to 4-factor PCC rather than to 3-factor PCC',
        'Confusing FEIBA, an activated PCC for inhibitors, with standard reversal products',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Fibrinogen products and PCCs',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Fibrinogen products and PCCs', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-60',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acf-rfviia', 'atom-acf-case5-warfarin-ich'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate the properties of recombinant factor VIIa with the management of warfarin-associated intracranial hemorrhage in Case 5 to justify why 4-factor PCC plus IV vitamin K, rather than rFVIIa or FFP, is the right reversal strategy.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'In warfarin-associated intracranial hemorrhage (Case 5: INR 4.1, GCS 8), the reversal is weight-based 4-factor PCC at 25 to 50 units/kg plus IV vitamin K 10 mg slowly, with an INR recheck at 30 minutes and neurosurgery at the bedside. 4-factor PCC replaces the actual deficient vitamin K dependent factors rapidly and in low volume, while vitamin K provides durable correction after the transient PCC effect wears off. This directly fixes the warfarin lesion.' },
        { id: 'kp2', weight: 2, description: 'Recombinant factor VIIa is a poor substitute here because in warfarin patients it normalizes the INR without correcting the underlying multifactor defect, a misleading lab, and it carries real arterial thrombotic risk (54% of events arterial, 72% of associated deaths thrombotic). PCC is explicitly preferred over rFVIIa for warfarin reversal. rFVIIa is reserved for true refractory rescue, not first-line ICH reversal.' },
        { id: 'kp3', weight: 1, description: 'Fresh frozen plasma is also wrong because it is too slow and too high-volume and its own INR of 1.4 to 1.6 cannot get below 1.5, so the concentrated PCC remains the correct, time-critical tool.' },
      ],
      common_errors: [
        'Selecting rFVIIa first and being reassured by a normalized but cosmetic INR',
        'Choosing FFP despite its slow speed, large volume, and floor INR of 1.4 to 1.6',
        'Omitting IV vitamin K and relying only on the transient PCC effect',
      ],
      minimum_passing_score: 60,
    },
    topic: 'rFVIIa versus PCC in warfarin ICH',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'rFVIIa versus PCC in warfarin ICH', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w4-61',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-acf-case1-apixaban', 'atom-acf-case3-bypass-bleeding'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-4',
    prompt: 'Integrate Case 1 (apixaban hip fracture) and Case 3 (post-bypass bleeding) to contrast how anticoagulant identity and lab context drive management: when to proceed without neuraxial and hold a reversal agent in reserve, versus when the lab value itself tells you to stop reaching for a reversal agent.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'In Case 1, apixaban dictates the plan: ASRA\'s 72-hour rule rules out a spinal at 12 hours so general anesthesia is chosen, PAUSE would hold the DOAC 2 days but the hip fracture cannot wait 48 hours, and off-label 4-factor PCC or andexanet alfa is held in reserve for life-threatening bleeding rather than given prophylactically. The drug class drives both the neuraxial decision and the rescue strategy. Proceeding with blood available and vigilance balances fracture urgency against residual anticoagulation.' },
        { id: 'kp2', weight: 2, description: 'In Case 3, the lab context drives management: an ACT of 180 is in range, so more protamine is wrong and would add coagulopathy, while platelets of 95k call for platelet transfusion and a fibrinogen of 110 calls for cryoprecipitate or fibrinogen concentrate, with TXA added if not already given. Persistent bleeding then prompts viscoelastic testing (TEG or ROTEM) to target therapy. Here the number, the in-range ACT, actively removes a reversal agent from the menu.' },
        { id: 'kp3', weight: 1, description: 'The shared principle is that the specific agent and the specific lab value, not reflex, determine whether a reversal agent is held in reserve, given, or explicitly avoided.' },
      ],
      common_errors: [
        'Giving protamine in Case 3 despite an in-range ACT, or trying to reverse apixaban with protamine in Case 1',
        'Allowing a spinal in Case 1 at 12 hours instead of honoring the 72-hour apixaban rule',
        'Continuing empiric products in Case 3 instead of moving to TEG or ROTEM',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Apixaban hip fracture and post-bypass bleeding',
    chapter: 'ap1-wk-4',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 29, 30; Foster lecture', topic: 'Apixaban hip fracture and post-bypass bleeding', ladder_tier_appropriate: 'pre-induction' },
  },

  // ===== ap1-wk-5 Lipid-Lowering synthesis =====

  {
    id: 'r-ap1-w5l-1',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipa-five-particles', 'atom-lipa-ldl-hdl-roles'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Integrate the density ordering of the lipoprotein particles with the opposing roles of LDL and HDL in atherosclerosis and cardiovascular risk.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Ordered by rising density the particles are chylomicron, VLDL, IDL, LDL, HDL, with size falling as density rises.' },
        { id: 'kp2', weight: 2, description: 'Cholesterol-rich LDL is the atherogenic bad cholesterol that delivers cholesterol to tissues.' },
        { id: 'kp3', weight: 1, description: 'The densest particle HDL is protective, and higher HDL tracks with lower cardiovascular risk.' },
      ],
      common_errors: [
        'Calling LDL the largest and least dense particle',
        'Swapping the atherogenic and protective roles of LDL and HDL',
        'Saying higher LDL is associated with lower cardiovascular risk',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Lipoprotein particles and risk',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'Lipoprotein particles and risk', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-2',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipa-hepatic-origin', 'atom-lipa-lpl-conversion'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Explain how the liver launches the endogenous pathway and how lipoprotein lipase remodels the secreted particle into LDL.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Hepatocytes assemble triglyceride-rich VLDL and secrete it into plasma.' },
        { id: 'kp2', weight: 2, description: 'Endothelial LPL hydrolyzes VLDL triglyceride, releasing free fatty acids to tissues.' },
        { id: 'kp3', weight: 1, description: 'Triglyceride loss shrinks VLDL to IDL then to cholesterol-rich LDL.' },
      ],
      common_errors: [
        'Saying the intestine secretes VLDL',
        'Claiming LPL esterifies cholesterol instead of hydrolyzing triglyceride',
        'Omitting IDL as the intermediate between VLDL and LDL',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Endogenous pathway processing',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'Endogenous pathway processing', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-3',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipa-ldl-receptor', 'atom-lipa-reverse-transport'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Combine the clearance of plasma LDL by hepatic receptors with HDL-driven reverse cholesterol transport to explain how cholesterol leaves the body.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Hepatic LDL receptors internalize most plasma LDL, the principal LDL clearance route.' },
        { id: 'kp2', weight: 2, description: 'HDL collects peripheral cholesterol and delivers it to the liver in reverse cholesterol transport.' },
        { id: 'kp3', weight: 1, description: 'The liver excretes that cholesterol into bile, the main exit route from the body.' },
      ],
      common_errors: [
        'Saying LDL is cleared by the kidney',
        'Assigning reverse cholesterol transport to LDL',
        'Claiming cholesterol is eliminated in urine rather than bile',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Cholesterol clearance and elimination',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'Cholesterol clearance and elimination', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-4',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipa-two-pathways', 'atom-lipa-exogenous-mechanics'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Relate the high-level split between exogenous and endogenous pathways to the detailed mechanics of dietary fat handling.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The exogenous pathway begins in the gut with dietary fat and the endogenous pathway begins in the liver with VLDL.' },
        { id: 'kp2', weight: 2, description: 'Bile and pancreatic lipase digest dietary triglyceride so enterocytes assemble chylomicrons.' },
        { id: 'kp3', weight: 1, description: 'Chylomicrons travel via the thoracic duct, LPL delivers free fatty acids to tissues, and remnants return to the liver.' },
      ],
      common_errors: [
        'Saying the exogenous pathway starts in the liver',
        'Routing chylomicrons through the portal vein',
        'Forgetting both pathways converge on the liver',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Pathways and dietary fat',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'Pathways and dietary fat', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-5',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipa-endogenous-mechanics', 'atom-lipa-benefit-groups'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Connect why LDL becomes the dominant cholesterol carrier in the endogenous pathway to the LDL-based criteria that define statin benefit groups.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'The liver secretes triglyceride-rich VLDL that LPL converts to IDL then cholesterol-rich LDL delivering cholesterol to tissues.' },
        { id: 'kp2', weight: 2, description: 'Established ASCVD and an LDL at or above 190 mg per dL are standalone statin benefit groups.' },
        { id: 'kp3', weight: 1, description: 'Age 40 to 75 with diabetes or with risk factors at intermediate-to-high ASCVD risk also qualify.' },
      ],
      common_errors: [
        'Saying VLDL carries dietary triglyceride',
        'Using an LDL cutoff below 190 mg per dL for a benefit group',
        'Restricting the diabetes group outside ages 40 to 75',
      ],
      minimum_passing_score: 60,
    },
    topic: 'LDL biology and statin eligibility',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'LDL biology and statin eligibility', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-6',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipa-fh-secondary', 'atom-lipa-lower-better'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Connect the causes that elevate LDL, both genetic and secondary, with the lower is better principle that justifies reducing it.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Familial hypercholesterolemia is an LDL receptor defect in roughly 1 in 500 heterozygotes that markedly raises LDL.' },
        { id: 'kp2', weight: 2, description: 'Secondary causes such as hypothyroidism, diabetes, alcohol, and glucocorticoid excess also raise LDL, and most adult disease is multifactorial.' },
        { id: 'kp3', weight: 1, description: 'Pooled meta-analyses show greater LDL reduction yields fewer cardiovascular events, summarized as lower is better.' },
      ],
      common_errors: [
        'Attributing familial hypercholesterolemia to an LPL defect',
        'Listing hyperthyroidism as a secondary cause instead of hypothyroidism',
        'Claiming a higher LDL target is protective',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Causes of high LDL and the case for lowering it',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'Causes of high LDL and the case for lowering it', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-7',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipb-hmgcoa-mechanism', 'atom-lipb-lipid-effects'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Connect the statin mechanism at HMG-CoA reductase to the resulting changes in LDL, HDL, and triglycerides.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Competitive HMG-CoA reductase inhibition lowers hepatic cholesterol synthesis and upregulates LDL receptors to clear plasma LDL.' },
        { id: 'kp2', weight: 2, description: 'This yields the dominant LDL fall of roughly 20 to 60 percent.' },
        { id: 'kp3', weight: 1, description: 'HDL rises only about 10 percent and triglycerides fall about 10 to 20 percent, so statins are primarily LDL drugs.' },
      ],
      common_errors: [
        'Claiming statins bind LDL directly instead of upregulating receptors.',
        'Attributing a large triglyceride or HDL change to statins.',
        'Reversing receptor regulation by saying LDL receptors are downregulated.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Statin mechanism and lipid effects',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'Statin mechanism and lipid effects', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-8',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipb-agents', 'atom-lipb-24hr-effect'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Relate the pharmacokinetic differences among statins to the 24 hour duration of effect and a single missed dose.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Statins differ in potency and metabolism, with atorvastatin and rosuvastatin most potent and pravastatin renally cleared.' },
        { id: 'kp2', weight: 2, description: 'Regardless of these kinetics and a short plasma half-life, the pharmacodynamic effect lasts about 24 hours.' },
        { id: 'kp3', weight: 1, description: 'Therefore a single missed oral dose does not meaningfully lose efficacy.' },
      ],
      common_errors: [
        'Thinking the longest half-life statin is needed for 24 hour effect.',
        'Believing one missed dose abolishes the effect.',
        'Assuming potency and metabolism are identical across all statins.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Statin agents and duration',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'Statin agents and duration', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-9',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipb-pleiotropic', 'atom-lipb-perioperative'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Explain how statin pleiotropic effects support the perioperative recommendation to continue therapy.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Pleiotropic effects include plaque stabilization, reduced vascular inflammation, antioxidant activity, and modest vasodilation.' },
        { id: 'kp2', weight: 2, description: 'These vascular benefits underlie observational data that continuing statins perioperatively reduces complications, so statins are continued through surgery.' },
        { id: 'kp3', weight: 1, description: 'A single missed dose is tolerated, but statins remain teratogenic and are avoided in pregnancy.' },
      ],
      common_errors: [
        'Calling LDL receptor upregulation a pleiotropic effect.',
        'Recommending holding statins for days before surgery.',
        'Continuing a statin in a pregnant patient.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Statin pleiotropy and perioperative care',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'Statin pleiotropy and perioperative care', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-10',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipb-muscle-coq10', 'atom-lipb-myopathy-risk'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Integrate the statin muscle injury mechanism with the patient factors that raise myopathy risk.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Reduced CoQ10 synthesis causes mitochondrial dysfunction, driving a spectrum from common myalgias to very rare rhabdomyolysis.' },
        { id: 'kp2', weight: 2, description: 'Risk rises with age over 80, female sex, low BMI, Asian ethnicity, renal or hepatic failure, uncontrolled hypothyroidism, low vitamin D, diabetes, and neuromuscular disease.' },
        { id: 'kp3', weight: 1, description: 'SLCO1B1 polymorphisms add pharmacogenetic risk by impairing hepatic statin uptake.' },
      ],
      common_errors: [
        'Ranking rhabdomyolysis as a common event.',
        'Thinking male sex and high BMI increase risk.',
        'Omitting SLCO1B1 as a genetic contributor.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Statin muscle injury and risk factors',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'Statin muscle injury and risk factors', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-11',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipb-cyp3a4', 'atom-lipb-discontinue'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Connect CYP3A4 statin interactions to the laboratory thresholds that prompt discontinuation.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'CYP3A4 inhibitors such as macrolides, azoles, and grapefruit juice raise levels of atorvastatin, simvastatin, and lovastatin and the risk of muscle injury.' },
        { id: 'kp2', weight: 2, description: 'A creatine kinase above 10 times the upper limit of normal prompts discontinuation, reflecting that exposure-driven muscle injury.' },
        { id: 'kp3', weight: 1, description: 'AST or ALT above 3 times the upper limit also prompts discontinuation, and switching to pravastatin, fluvastatin, or pitavastatin avoids CYP3A4.' },
      ],
      common_errors: [
        'Swapping the CK and transaminase thresholds.',
        'Raising the statin dose rather than switching to a CYP3A4-sparing agent.',
        'Forgetting grapefruit juice or amiodarone as CYP3A4 offenders.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Statin interactions and discontinuation',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'Statin interactions and discontinuation', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-12',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipc-pcsk9-mechanism', 'atom-lipc-pcsk9-effect-dosing'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'For PCSK9 inhibitors, connect how the antibody mechanism explains both the depth of LDL lowering and the need for injectable dosing.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Evolocumab and alirocumab bind circulating PCSK9 so hepatic LDL receptors are spared from degradation and clear more LDL.' },
        { id: 'kp2', weight: 2, description: 'Preserving LDL receptors yields a 38 to 72 percent LDL drop, the largest of any class.' },
        { id: 'kp3', weight: 1, description: 'Being monoclonal antibodies, they must be given subcutaneously about every two weeks rather than orally.' },
      ],
      common_errors: [
        'Confusing PCSK9 inhibition with HMG-CoA reductase inhibition.',
        'Claiming statins lower LDL more than PCSK9 inhibitors.',
        'Stating PCSK9 inhibitors are taken as daily oral tablets.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'PCSK9 inhibitors',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'PCSK9 inhibitors', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-13',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipc-pcsk9-trials', 'atom-lipc-pcsk9-indications'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Integrate the PCSK9 inhibitor outcome trials with the patient populations in whom these agents are indicated.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'FOURIER showed evolocumab plus statin cut events in ASCVD, supporting use in high-risk patients on maximal statin.' },
        { id: 'kp2', weight: 2, description: 'ODYSSEY OUTCOMES showed alirocumab after acute coronary syndrome reduced events and all-cause mortality.' },
        { id: 'kp3', weight: 1, description: 'Indications include familial hypercholesterolemia and statin intolerance, with very good tolerability limited mainly to injection-site reactions.' },
      ],
      common_errors: [
        'Crediting IMPROVE-IT to a PCSK9 inhibitor.',
        'Using PCSK9 inhibitors as primary triglyceride therapy.',
        'Expecting frequent serious systemic toxicity.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'PCSK9 inhibitors',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'PCSK9 inhibitors', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-14',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipc-resin-mechanism', 'atom-lipc-resin-absorption'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Tie the bile acid resin mechanism to its characteristic side effects and the rule for timing co-administered medications.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Resins bind bile acids and interrupt enterohepatic recirculation, prompting LDL receptor upregulation and an LDL drop of 15 to 30 percent with possible triglyceride rise.' },
        { id: 'kp2', weight: 2, description: 'Constipation is the chief limiting effect, and resins impair absorption of fat-soluble vitamins and many drugs.' },
        { id: 'kp3', weight: 1, description: 'Other oral drugs such as digoxin, levothyroxine, and warfarin must be given at least one hour before or four hours after the resin.' },
      ],
      common_errors: [
        'Saying resins inhibit cholesterol synthesis directly.',
        'Naming flushing instead of constipation as the limiting effect.',
        'Dosing interacting drugs at the same time as the resin.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Bile acid resins',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'Bile acid resins', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-15',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipc-cholestyramine-acidosis', 'atom-lipc-niacin-flushing'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Contrast a distinctive metabolic complication of cholestyramine with the distinctive cutaneous and metabolic effects of niacin.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Cholestyramine is a chloride salt that can cause hyperchloremic metabolic acidosis in a small number of patients.' },
        { id: 'kp2', weight: 2, description: 'Niacin flushing is prostaglandin-mediated and prevented by aspirin given about 30 minutes before the dose.' },
        { id: 'kp3', weight: 1, description: 'Niacin also causes hyperglycemia and hyperuricemia with gout flares, distinct from the resin acidosis.' },
      ],
      common_errors: [
        'Calling the cholestyramine effect an anion-gap acidosis.',
        'Using acetaminophen rather than aspirin to prevent niacin flushing.',
        'Thinking niacin flushing is histamine-mediated.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Drug side effects',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'Drug side effects', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-16',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipc-niacin-mechanism', 'atom-lipc-class-profile'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Place niacin within the comparative lipid-effect landscape, noting which lipid it raises most and how other classes lead for LDL and triglycerides.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Niacin inhibits hepatic VLDL synthesis and raises HDL about 20 to 30 percent, the most of any class.' },
        { id: 'kp2', weight: 2, description: 'PCSK9 inhibitors give the deepest LDL reduction and fibrates lower triglycerides most.' },
        { id: 'kp3', weight: 1, description: 'Ezetimibe contributes mainly LDL lowering with minimal HDL or triglyceride effect.' },
      ],
      common_errors: [
        'Crediting niacin with the strongest LDL reduction.',
        'Naming statins for the single largest LDL drop.',
        'Choosing niacin over fibrates for triglyceride lowering.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Comparative profile',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'Comparative profile', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-17',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipc-fibrate-mechanism', 'atom-lipc-fibrate-cautions'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Connect the fibrate mechanism and triglyceride efficacy with the perioperative and interaction cautions that govern their use.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Fibrates activate PPAR-alpha to raise lipoprotein lipase and lower triglycerides about 40 to 50 percent, best for severe hypertriglyceridemia.' },
        { id: 'kp2', weight: 2, description: 'Gemfibrozil plus a statin raises myopathy and rhabdomyolysis risk and displaces warfarin from albumin to raise the INR.' },
        { id: 'kp3', weight: 1, description: 'Gemfibrozil promotes gallstones and should be restarted postoperatively only when the patient is well-hydrated and tolerating PO.' },
      ],
      common_errors: [
        'Thinking fibrates are primarily LDL drugs.',
        'Naming fenofibrate as the high-risk statin partner instead of gemfibrozil.',
        'Restarting fibrates before oral intake and hydration return.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Fibrates',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'Fibrates', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-18',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipc-ezetimibe-mechanism', 'atom-lipc-ezetimibe-newer'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Integrate the ezetimibe mechanism and outcome data with its tolerability and the place of newer lipid agents.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Ezetimibe blocks intestinal NPC1L1 to cut cholesterol absorption and lower LDL, with IMPROVE-IT confirming benefit added to simvastatin after ACS.' },
        { id: 'kp2', weight: 2, description: 'Its placebo-like tolerability makes it useful for avoiding high-dose statin and for statin-intolerant patients.' },
        { id: 'kp3', weight: 1, description: 'Newer agents include lomitapide for homozygous FH with a boxed hepatotoxicity warning, plus bempedoic acid and inclisiran.' },
      ],
      common_errors: [
        'Confusing the NPC1L1 target with bile acid binding.',
        'Attributing IMPROVE-IT to a PCSK9 inhibitor.',
        'Assigning the boxed hepatotoxicity warning to inclisiran instead of lomitapide.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Ezetimibe',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'Ezetimibe', ladder_tier_appropriate: 'pre-induction' },
  },

  {
    id: 'r-ap1-w5l-19',
    type: 'recall',
    tier: 'synthesis',
    feeder_atoms: ['atom-lipc-fishoil-periop', 'atom-lipc-drug-selection'],
    courseId: 'adv-pharmacology-1',
    nodeId: 'ap1-wk-5',
    prompt: 'Combine omega-3 fish oil perioperative handling with the broader logic of choosing a lipid drug by clinical scenario.',
    rubric: {
      key_points: [
        { id: 'kp1', weight: 2, description: 'Fish oil mainly lowers triglycerides and high-dose use should be held one to two weeks before elective surgery, especially with neuraxial anesthesia, for bleeding risk.' },
        { id: 'kp2', weight: 2, description: 'Statins are first line for prevention, fibrates for severe hypertriglyceridemia, and PCSK9 inhibitors or ezetimibe for statin intolerance.' },
        { id: 'kp3', weight: 1, description: 'Residual LDL on a statin is best addressed by adding ezetimibe.' },
      ],
      common_errors: [
        'Continuing high-dose fish oil up to the day of surgery.',
        'Choosing a fibrate for LDL-driven prevention.',
        'Adding fish oil rather than ezetimibe for residual LDL on a statin.',
      ],
      minimum_passing_score: 60,
    },
    topic: 'Drug selection',
    chapter: 'ap1-wk-5',
    difficulty: 2,
    metadata: { priority: 'high', source: 'Stoelting Ch 23; Whybrew lecture', topic: 'Drug selection', ladder_tier_appropriate: 'pre-induction' },
  },

];
