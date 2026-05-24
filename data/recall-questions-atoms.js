// PLACEHOLDER ATOMS — engine proof only.
// Real atom content authored in a later content sprint.

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

];
