/**
 * AUTONOMIC NERVOUS SYSTEM QUESTION BANK - Chapter 6
 * Course: Basics of Anesthesia
 * Node: node-6
 * Topic: Autonomic Nervous System
 *
 * Question Types:
 * - mcq:   Multiple choice (single best answer) — ans array of {t, ok}
 * - multi:  Select multiple (choices + correctAnswers + selectCount)
 * - short:  Free response (acceptedAnswers array)
 *
 * Tags: node-6, chapter-6, autonomic-nervous-system, nbcrna-style
 */

export const AUTONOMIC_NS_QUESTIONS = [

  // ─── FOUNDATION / ANS OVERVIEW ───────────────────────────────────────────────

  {
    id: "n6c6-q001",
    type: "multi",
    prompt: "Which of the following visceral functions are directly controlled by the autonomic nervous system?",
    setup: "",
    choices: [
      "Gastrointestinal motility",
      "Body temperature regulation",
      "Systemic blood pressure",
      "Voluntary skeletal movements",
      "Complex cognitive processes",
    ],
    correctAnswers: [
      "Gastrointestinal motility",
      "Body temperature regulation",
      "Systemic blood pressure",
    ],
    selectCount: 3,
    rationale: "The autonomic nervous system controls most visceral functions of the body, specifically including blood pressure, gastrointestinal motility, and body temperature.",
    metadata: { topic: "ANS Foundation", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "foundation", "multi-select", "high-yield"] }
  },

  {
    id: "n6c6-q002",
    type: "multi",
    prompt: "Which specific central nervous system structures are primarily responsible for the direct activation of the autonomic nervous system?",
    setup: "",
    choices: [
      "Spinal cord",
      "Brain stem",
      "Hypothalamus",
      "Occipital lobe",
      "Cerebellum",
    ],
    correctAnswers: ["Spinal cord", "Brain stem", "Hypothalamus"],
    selectCount: 3,
    rationale: "The autonomic nervous system is activated mainly by the spinal cord, the brain stem, and the hypothalamus, and only to some extent by the cerebral cortex.",
    metadata: { topic: "ANS Foundation", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "foundation", "multi-select"] }
  },

  // ─── SYMPATHETIC NERVOUS SYSTEM ──────────────────────────────────────────────

  {
    id: "n6c6-q003",
    type: "mcq",
    prompt: "Where do the preganglionic fibers of the sympathetic nervous system specifically originate within the human spinal cord?",
    setup: "",
    ans: [
      { t: "They strictly arise from the thoracolumbar segments from T1 to L3.", ok: true },
      { t: "They strictly arise from the craniosacral segments from C1 to S4.", ok: false },
      { t: "They strictly arise from the cervical and thoracic segments C1 to T1.", ok: false },
      { t: "They strictly arise from the lumbar and sacral segments from L1 to L5.", ok: false },
    ],
    rationale: "Preganglionic fibers of the sympathetic nervous system originate in the intermediolateral column of the thoracic spine and the first three lumbar segments.",
    metadata: { topic: "SNS Anatomy", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "sns", "single-choice", "high-yield"] }
  },

  {
    id: "n6c6-q004",
    type: "mcq",
    prompt: "What specific neurotransmitter is strictly released by all preganglionic fibers of the sympathetic nervous system?",
    setup: "",
    ans: [
      { t: "The neurotransmitter utilized is exactly acetylcholine.", ok: true },
      { t: "The neurotransmitter utilized is exactly norepinephrine.", ok: false },
      { t: "The neurotransmitter utilized is exactly epinephrine.", ok: false },
      { t: "The neurotransmitter utilized is exactly dopamine.", ok: false },
    ],
    rationale: "Acetylcholine is the primary neurotransmitter for the preganglionic fibers of the sympathetic nervous system.",
    metadata: { topic: "SNS Neurotransmitters", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "sns", "neurotransmitters", "single-choice"] }
  },

  {
    id: "n6c6-q005",
    type: "mcq",
    prompt: "Which specific anatomical organ represents a physiological exception by receiving sympathetic preganglionic fibers directly rather than postganglionic fibers?",
    setup: "",
    ans: [
      { t: "The anatomical structure known strictly as the adrenal gland.", ok: true },
      { t: "The anatomical structure known strictly as the thyroid gland.", ok: false },
      { t: "The anatomical structure known strictly as the pineal gland.", ok: false },
      { t: "The anatomical structure known strictly as the pituitary gland.", ok: false },
    ],
    rationale: "An exception in the sympathetic nervous system is the adrenal gland, which receives preganglionic fibers directly where they interact with chromaffin cells.",
    metadata: { topic: "SNS Exceptions", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "sns", "adrenal", "single-choice", "high-yield"] }
  },

  {
    id: "n6c6-q006",
    type: "mcq",
    prompt: "While norepinephrine is the usual postganglionic neurotransmitter for the sympathetic nervous system, what is the specific physiological exception where acetylcholine is released instead?",
    setup: "",
    ans: [
      { t: "The specific tissues identified as the eccrine sweat glands.", ok: true },
      { t: "The specific tissues identified as the cardiac muscle cells.", ok: false },
      { t: "The specific tissues identified as the adrenal medulla.", ok: false },
      { t: "The specific tissues identified as the bronchial smooth muscle.", ok: false },
    ],
    rationale: "A notable exception to sympathetic postganglionic transmission is the release of acetylcholine at the sweat glands.",
    metadata: { topic: "SNS Exceptions", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "sns", "exceptions", "single-choice"] }
  },

  {
    id: "n6c6-q007",
    type: "mcq",
    prompt: "In eighty percent of the human population, the stellate ganglion is formed by the anatomical fusion of which two specific nerve structures?",
    setup: "",
    ans: [
      { t: "The inferior cervical ganglion and first thoracic ganglion.", ok: true },
      { t: "The superior cervical ganglion and first thoracic ganglion.", ok: false },
      { t: "The inferior thoracic ganglion and first cervical ganglion.", ok: false },
      { t: "The superior thoracic ganglion and first cervical ganglion.", ok: false },
    ],
    rationale: "In most people, the stellate ganglion is formed by fusion of the inferior cervical ganglion with the first thoracic ganglion on each side.",
    metadata: { topic: "SNS Anatomy", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "sns", "anatomy", "single-choice"] }
  },

  {
    id: "n6c6-q008",
    type: "mcq",
    prompt: "How do the anatomical lengths of the preganglionic and postganglionic fibers in the sympathetic nervous system specifically compare to each other?",
    setup: "",
    ans: [
      { t: "The preganglionic fibers are short, and the postganglionic fibers are long.", ok: true },
      { t: "The preganglionic fibers are long, and the postganglionic fibers are short.", ok: false },
      { t: "The preganglionic fibers are long, and the postganglionic fibers are long.", ok: false },
      { t: "The preganglionic fibers are short, and the postganglionic fibers are short.", ok: false },
    ],
    rationale: "Sympathetic preganglionic fibers are short because they remain close to the central nervous system, while postganglionic fibers travel longer distances to effector organs.",
    metadata: { topic: "SNS Anatomy", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "sns", "anatomy", "single-choice"] }
  },

  {
    id: "n6c6-q009",
    type: "multi",
    prompt: "Which of the following specific effector organs receive strictly sympathetic nervous system innervation with absolutely no parasympathetic input?",
    setup: "",
    choices: [
      "Blood vessels",
      "Spleen",
      "Piloerector muscles",
      "Cardiac myocytes",
      "Bronchial tree",
    ],
    correctAnswers: ["Blood vessels", "Spleen", "Piloerector muscles"],
    selectCount: 3,
    rationale: "The blood vessels, spleen, and piloerector muscles are examples where only sympathetic nervous system innervation occurs.",
    metadata: { topic: "SNS Innervation", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "sns", "innervation", "multi-select"] }
  },

  // ─── PARASYMPATHETIC NERVOUS SYSTEM ──────────────────────────────────────────

  {
    id: "n6c6-q010",
    type: "multi",
    prompt: "Which specific cranial nerves carry the parasympathetic nervous system cell bodies arising directly from the human brainstem?",
    setup: "",
    choices: [
      "Cranial Nerve III",
      "Cranial Nerve VII",
      "Cranial Nerve IX",
      "Cranial Nerve X",
      "Cranial Nerve V",
      "Cranial Nerve XII",
    ],
    correctAnswers: [
      "Cranial Nerve III",
      "Cranial Nerve VII",
      "Cranial Nerve IX",
      "Cranial Nerve X",
    ],
    selectCount: 4,
    rationale: "Parasympathetic cell bodies in the brainstem arise specifically from cranial nerves III, VII, IX, and X.",
    metadata: { topic: "PNS Anatomy", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "pns", "cranial-nerves", "multi-select", "high-yield"] }
  },

  {
    id: "n6c6-q011",
    type: "mcq",
    prompt: "Which specific cranial nerve transmits approximately seventy-five percent of all parasympathetic nervous system traffic in the human body?",
    setup: "",
    ans: [
      { t: "The anatomical cranial structure known strictly as the Vagus nerve.", ok: true },
      { t: "The anatomical cranial structure known strictly as the Facial nerve.", ok: false },
      { t: "The anatomical cranial structure known strictly as the Optic nerve.", ok: false },
      { t: "The anatomical cranial structure known strictly as the Spinal nerve.", ok: false },
    ],
    rationale: "The Vagus nerve is the most important of the parasympathetic nervous system and transmits fully three-quarters of the traffic.",
    metadata: { topic: "PNS Anatomy", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "pns", "vagus", "single-choice", "high-yield"] }
  },

  {
    id: "n6c6-q012",
    type: "mcq",
    prompt: "How do the anatomical lengths of the preganglionic and postganglionic fibers in the parasympathetic nervous system specifically compare to each other?",
    setup: "",
    ans: [
      { t: "The preganglionic fibers are long, and the postganglionic fibers are short.", ok: true },
      { t: "The preganglionic fibers are short, and the postganglionic fibers are long.", ok: false },
      { t: "The preganglionic fibers are long, and the postganglionic fibers are long.", ok: false },
      { t: "The preganglionic fibers are short, and the postganglionic fibers are short.", ok: false },
    ],
    rationale: "Preganglionic fibers of the parasympathetic system are long, while postganglionic fibers are short because the ganglia are close to or within the target organ.",
    metadata: { topic: "PNS Anatomy", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "pns", "anatomy", "single-choice"] }
  },

  {
    id: "n6c6-q013",
    type: "multi",
    prompt: "Which of the following physiological effects are strictly mediated by the generalized activation of the parasympathetic nervous system?",
    setup: "",
    choices: [
      "Slowing the heart rate",
      "Slowing cardiac conduction",
      "Stimulating GI peristalsis",
      "Emptying the urinary bladder",
      "Dilating the bronchial tree",
      "Increasing cardiac inotropy",
    ],
    correctAnswers: [
      "Slowing the heart rate",
      "Slowing cardiac conduction",
      "Stimulating GI peristalsis",
      "Emptying the urinary bladder",
    ],
    selectCount: 4,
    rationale: "The parasympathetic system generally slows the heart rate, slows cardiac conduction time, stimulates GI peristalsis and secretion, and empties the urinary bladder and rectum.",
    metadata: { topic: "PNS Physiology", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "pns", "physiology", "multi-select", "high-yield"] }
  },

  // ─── ACETYLCHOLINE & RECEPTORS ───────────────────────────────────────────────

  {
    id: "n6c6-q014",
    type: "mcq",
    prompt: "What specific neurotransmitter is the principal chemical released at the postganglionic fibers of the parasympathetic nervous system?",
    setup: "",
    ans: [
      { t: "The precise neurotransmitter released is exclusively acetylcholine.", ok: true },
      { t: "The precise neurotransmitter released is exclusively norepinephrine.", ok: false },
      { t: "The precise neurotransmitter released is exclusively epinephrine.", ok: false },
      { t: "The precise neurotransmitter released is exclusively dopamine.", ok: false },
    ],
    rationale: "Acetylcholine is the principal neurotransmitter released at the postganglionic fibers of the parasympathetic nervous system.",
    metadata: { topic: "Acetylcholine", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "pns", "neurotransmitters", "single-choice"] }
  },

  {
    id: "n6c6-q015",
    type: "mcq",
    prompt: "What two specific types of postsynaptic receptor sites are directly activated by the release of acetylcholine in the human nervous system?",
    setup: "",
    ans: [
      { t: "Nicotinic receptors and muscarinic receptors.", ok: true },
      { t: "Adrenergic receptors and dopaminergic receptors.", ok: false },
      { t: "Glutamate receptors and serotonin receptors.", ok: false },
      { t: "Histamine receptors and cholinergic receptors.", ok: false },
    ],
    rationale: "Postsynaptic receptor sites for acetylcholine are classified as either nicotinic or muscarinic.",
    metadata: { topic: "Acetylcholine", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "acetylcholine", "receptors", "single-choice", "high-yield"] }
  },

  {
    id: "n6c6-q016",
    type: "mcq",
    prompt: "By what exact mechanism is the clinical action of acetylcholine rapidly terminated at the synaptic cleft?",
    setup: "",
    ans: [
      { t: "It is terminated by acetylcholinesterase enzymes.", ok: true },
      { t: "It is terminated by pseudocholinesterase enzymes.", ok: false },
      { t: "It is terminated by monoamine oxidase enzymes.", ok: false },
      { t: "It is terminated by methyltransferase enzymes.", ok: false },
    ],
    rationale: "The action of acetylcholine at the synaptic site is terminated by acetylcholinesterase.",
    metadata: { topic: "Acetylcholine", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "acetylcholine", "termination", "single-choice"] }
  },

  {
    id: "n6c6-q017",
    type: "mcq",
    prompt: "What specific physiological role does plasma pseudocholinesterase play in the termination of acetylcholine action at the nerve synapse?",
    setup: "",
    ans: [
      { t: "It possesses zero physiologically important functions.", ok: true },
      { t: "It possesses huge physiologically important functions.", ok: false },
      { t: "It possesses primary physiologically important functions.", ok: false },
      { t: "It possesses direct physiologically important functions.", ok: false },
    ],
    rationale: "Pseudocholinesterase is present in plasma but does not appear to be physiologically important in terminating the action of acetylcholine.",
    metadata: { topic: "Acetylcholine", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "acetylcholine", "pseudocholinesterase", "single-choice"] }
  },

  // ─── MUSCARINIC TONE / RECEPTOR REGULATION ───────────────────────────────────

  {
    id: "n6c6-q018",
    type: "mcq",
    prompt: "The systemic administration of atropine blocks resting muscarinic tone and reveals what specific unmasked physiological response?",
    setup: "",
    ans: [
      { t: "Unopposed sympathetic tone causing an intense tachycardia.", ok: true },
      { t: "Unopposed sympathetic tone causing an intense bradycardia.", ok: false },
      { t: "Unopposed parasympathetic tone causing an intense tachycardia.", ok: false },
      { t: "Unopposed parasympathetic tone causing an intense bradycardia.", ok: false },
    ],
    rationale: "Atropine blocks the resting muscarinic tone, and the unopposed sympathetic tone then causes tachycardia.",
    metadata: { topic: "Muscarinic Receptors", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "atropine", "muscarinic", "single-choice", "high-yield"] }
  },

  {
    id: "n6c6-q019",
    type: "mcq",
    prompt: "The phenomenon of receptor upregulation typically occurs within 30 minutes of adrenergic blockade and is responsible for what specific clinical event upon the abrupt discontinuation of a beta-blocker?",
    setup: "",
    ans: [
      { t: "Severe rebound tachycardia and increased myocardial ischemia.", ok: true },
      { t: "Severe rebound bradycardia and increased myocardial ischemia.", ok: false },
      { t: "Severe rebound hypotension and increased syncopal occurrence.", ok: false },
      { t: "Severe rebound bronchospasm and increased pulmonary ischemia.", ok: false },
    ],
    rationale: "Upregulation explains why sudden discontinuation of beta-adrenergic receptor blocking drugs causes rebound tachycardia and increases the incidence of myocardial infarction and ischemia.",
    metadata: { topic: "Receptor Regulation", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "upregulation", "beta-blockers", "single-choice", "high-yield"] }
  },

  {
    id: "n6c6-q020",
    type: "mcq",
    prompt: "What specific molecular mechanism is responsible for the clinical downregulation of adrenergic receptors during prolonged exposure to an agonist?",
    setup: "",
    ans: [
      { t: "The destabilization of messenger RNA molecules.", ok: true },
      { t: "The hyperstabilization of messenger RNA molecules.", ok: false },
      { t: "The destruction of all existing DNA transcription.", ok: false },
      { t: "The construction of all existing DNA transcription.", ok: false },
    ],
    rationale: "Downregulation involves a decrease in receptor synthesis due to cAMP-dependent destabilization of messenger RNA after prolonged exposure to an agonist.",
    metadata: { topic: "Receptor Regulation", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "downregulation", "adrenergic", "single-choice"] }
  },

  {
    id: "n6c6-q021",
    type: "mcq",
    prompt: "What specific clinical diagnostic criteria confirm the presence of autonomic nervous system dysfunction during a standard orthostatic evaluation?",
    setup: "",
    ans: [
      { t: "Systolic drops over thirty mmHg without any heart rate increase.", ok: true },
      { t: "Systolic drops over fifteen mmHg without any heart rate increase.", ok: false },
      { t: "Diastolic drops over thirty mmHg without any heart rate increase.", ok: false },
      { t: "Diastolic drops over fifteen mmHg without any heart rate increase.", ok: false },
    ],
    rationale: "Autonomic nervous system dysfunction is suggested by a decrease in systolic blood pressure of more than 30 mmHg and the absence of an increase in heart rate upon assuming an upright posture.",
    metadata: { topic: "ANS Dysfunction", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "orthostatic", "diagnosis", "single-choice"] }
  },

  // ─── SYMPATHOMIMETICS ────────────────────────────────────────────────────────

  {
    id: "n6c6-q022",
    type: "multi",
    prompt: "Which of the following definitions correctly describes an indirect-acting sympathomimetic drug?",
    setup: "",
    choices: [
      "A drug that releases endogenous catecholamines from nerve endings.",
      "A drug that inhibits the reuptake of catecholamines into neurons.",
      "A drug that inhibits enzymes such as MAO and COMT.",
      "A drug that couples directly with the receptor to bring effective changes.",
      "A drug that blocks the postsynaptic receptor from endogenous ligands.",
    ],
    correctAnswers: [
      "A drug that releases endogenous catecholamines from nerve endings.",
      "A drug that inhibits the reuptake of catecholamines into neurons.",
      "A drug that inhibits enzymes such as MAO and COMT.",
    ],
    selectCount: 3,
    rationale: "Indirect-acting sympathomimetics release endogenous catecholamines, inhibit their reuptake, or inhibit metabolizing enzymes like MAO and COMT.",
    metadata: { topic: "Sympathomimetics", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "sympathomimetics", "indirect-acting", "multi-select", "high-yield"] }
  },

  // ─── CATECHOLAMINE SYNTHESIS ─────────────────────────────────────────────────

  {
    id: "n6c6-q023",
    type: "mcq",
    prompt: "High levels of adrenal cortisol actively enhance the synthesis of the enzyme phenylethanolamine-N-methyltransferase, which specifically performs what physiological conversion?",
    setup: "",
    ans: [
      { t: "It converts circulating norepinephrine directly into epinephrine.", ok: true },
      { t: "It converts circulating epinephrine directly into norepinephrine.", ok: false },
      { t: "It converts circulating dopamine directly into norepinephrine.", ok: false },
      { t: "It converts circulating tyrosine directly into norepinephrine.", ok: false },
    ],
    rationale: "High levels of cortisol enhance the synthesis of PNMT, which converts norepinephrine to epinephrine.",
    metadata: { topic: "Catecholamine Synthesis", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "catecholamines", "pnmt", "single-choice", "high-yield"] }
  },

  {
    id: "n6c6-q024",
    type: "mcq",
    prompt: "Which of the following lists correctly orders the complete biochemical synthesis pathway of endogenous catecholamines?",
    setup: "",
    ans: [
      { t: "Phenylalanine to Tyrosine to DOPA to Dopamine to Norepinephrine to Epinephrine.", ok: true },
      { t: "Phenylalanine to DOPA to Tyrosine to Dopamine to Epinephrine to Norepinephrine.", ok: false },
      { t: "Tyrosine to Phenylalanine to DOPA to Dopamine to Norepinephrine to Epinephrine.", ok: false },
      { t: "Tyrosine to DOPA to Phenylalanine to Dopamine to Epinephrine to Norepinephrine.", ok: false },
    ],
    rationale: "Synthesis begins with phenylalanine, then tyrosine, then DOPA, then dopamine, then norepinephrine, and finally epinephrine.",
    metadata: { topic: "Catecholamine Synthesis", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "catecholamines", "synthesis", "single-choice", "high-yield"] }
  },

  {
    id: "n6c6-q025",
    type: "mcq",
    prompt: "What specific synthesis enzyme is exclusively responsible for converting the amino acid tyrosine into DOPA?",
    setup: "",
    ans: [
      { t: "The enzyme known as Tyrosine hydroxylase.", ok: true },
      { t: "The enzyme known as DOPA decarboxylase.", ok: false },
      { t: "The enzyme known as Dopamine hydroxylase.", ok: false },
      { t: "The enzyme known as N-methyltransferase.", ok: false },
    ],
    rationale: "Tyrosine hydroxylase is the enzyme that converts tyrosine into DOPA.",
    metadata: { topic: "Catecholamine Synthesis", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "catecholamines", "enzymes", "single-choice"] }
  },

  {
    id: "n6c6-q026",
    type: "mcq",
    prompt: "What specific synthesis enzyme is exclusively responsible for converting DOPA into the neurotransmitter dopamine?",
    setup: "",
    ans: [
      { t: "The enzyme known as DOPA decarboxylase.", ok: true },
      { t: "The enzyme known as Tyrosine hydroxylase.", ok: false },
      { t: "The enzyme known as Dopamine hydroxylase.", ok: false },
      { t: "The enzyme known as N-methyltransferase.", ok: false },
    ],
    rationale: "DOPA decarboxylase is the enzyme that converts DOPA to dopamine.",
    metadata: { topic: "Catecholamine Synthesis", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "catecholamines", "enzymes", "single-choice"] }
  },

  {
    id: "n6c6-q027",
    type: "mcq",
    prompt: "What specific synthesis enzyme is exclusively responsible for converting dopamine directly into norepinephrine?",
    setup: "",
    ans: [
      { t: "The enzyme known as Dopamine beta-hydroxylase.", ok: true },
      { t: "The enzyme known as Tyrosine beta-hydroxylase.", ok: false },
      { t: "The enzyme known as DOPA beta-decarboxylase.", ok: false },
      { t: "The enzyme known as N-methyl beta-transferase.", ok: false },
    ],
    rationale: "Dopamine beta-hydroxylase is the enzyme that produces norepinephrine from dopamine.",
    metadata: { topic: "Catecholamine Synthesis", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "catecholamines", "enzymes", "single-choice"] }
  },

  {
    id: "n6c6-q028",
    type: "mcq",
    prompt: "In what specific cellular location does the biochemical synthesis of epinephrine strictly take place?",
    setup: "",
    ans: [
      { t: "It occurs within the chromaffin cells of the adrenal medulla.", ok: true },
      { t: "It occurs within the presynaptic axon terminals of the spinal cord.", ok: false },
      { t: "It occurs within the postsynaptic axon terminals of the spinal cord.", ok: false },
      { t: "It occurs within the chromaffin cells of the thyroid medulla.", ok: false },
    ],
    rationale: "The synthesis of epinephrine occurs only in the adrenal medulla, and catecholamines are stored in its chromaffin cells.",
    metadata: { topic: "Catecholamine Synthesis", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "catecholamines", "adrenal", "single-choice"] }
  },

  {
    id: "n6c6-q029",
    type: "mcq",
    prompt: "How does the molecular chemical structure of norepinephrine precisely differ from the structure of epinephrine?",
    setup: "",
    ans: [
      { t: "Norepinephrine strictly lacks one specific methyl group.", ok: true },
      { t: "Norepinephrine strictly adds one specific methyl group.", ok: false },
      { t: "Norepinephrine strictly lacks one specific hydroxyl group.", ok: false },
      { t: "Norepinephrine strictly adds one specific hydroxyl group.", ok: false },
    ],
    rationale: "Norepinephrine differs structurally from epinephrine only in its lack of a methyl group.",
    metadata: { topic: "Catecholamine Structure", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "catecholamines", "structure", "single-choice"] }
  },

  // ─── MAO / COMT METABOLISM ───────────────────────────────────────────────────

  {
    id: "n6c6-q030",
    type: "multi",
    prompt: "Which of the following specific catecholamines are actively deaminated by the Monoamine oxidase A enzyme?",
    setup: "",
    choices: ["Epinephrine", "Norepinephrine", "Dopamine", "Tyrosine", "Phenylalanine"],
    correctAnswers: ["Epinephrine", "Norepinephrine", "Dopamine"],
    selectCount: 3,
    rationale: "Monoamine oxidase A deaminates epinephrine, norepinephrine, and dopamine.",
    metadata: { topic: "Catecholamine Metabolism", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "mao", "catecholamines", "multi-select"] }
  },

  {
    id: "n6c6-q031",
    type: "mcq",
    prompt: "Which specific metabolic enzyme is exclusively responsible for the deamination of dopamine, while having no effect on epinephrine or norepinephrine?",
    setup: "",
    ans: [
      { t: "The enzyme known as Monoamine oxidase B.", ok: true },
      { t: "The enzyme known as Monoamine oxidase A.", ok: false },
      { t: "The enzyme known as Catechol transferase.", ok: false },
      { t: "The enzyme known as Tyrosine hydroxylase.", ok: false },
    ],
    rationale: "Monoamine oxidase B deaminates only dopamine.",
    metadata: { topic: "Catecholamine Metabolism", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "mao", "dopamine", "single-choice"] }
  },

  {
    id: "n6c6-q032",
    type: "mcq",
    prompt: "What specific chemical compound serves as the eventual end product of epinephrine and norepinephrine metabolism after degradation by COMT and MAO?",
    setup: "",
    ans: [
      { t: "The chemical compound known as Vanillylmandelic acid.", ok: true },
      { t: "The chemical compound known as Homovanillic acid.", ok: false },
      { t: "The chemical compound known as Acetoacetic acid.", ok: false },
      { t: "The chemical compound known as Hydroxybutyric acid.", ok: false },
    ],
    rationale: "The eventual end product of epinephrine and norepinephrine metabolism is vanillylmandelic acid.",
    metadata: { topic: "Catecholamine Metabolism", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "metabolism", "vma", "single-choice"] }
  },

  {
    id: "n6c6-q033",
    type: "mcq",
    prompt: "What specific chemical compound serves as the eventual end product of dopamine metabolism after degradation by COMT and MAO-B?",
    setup: "",
    ans: [
      { t: "The chemical compound known as Homovanillic acid.", ok: true },
      { t: "The chemical compound known as Vanillylmandelic acid.", ok: false },
      { t: "The chemical compound known as Acetoacetic acid.", ok: false },
      { t: "The chemical compound known as Hydroxybutyric acid.", ok: false },
    ],
    rationale: "COMT metabolizes dopamine to homovanillic acid, as does MAO-B.",
    metadata: { topic: "Catecholamine Metabolism", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "metabolism", "hva", "single-choice"] }
  },

  {
    id: "n6c6-q034",
    type: "mcq",
    prompt: "What specific physiological function does Catechol-O-methyl transferase perform in the extraneuronal tissues?",
    setup: "",
    ans: [
      { t: "It causes the metabolic methylation of circulating catecholamines.", ok: true },
      { t: "It causes the metabolic demethylation of circulating catecholamines.", ok: false },
      { t: "It causes the metabolic deamination of circulating catecholamines.", ok: false },
      { t: "It causes the metabolic amination of circulating catecholamines.", ok: false },
    ],
    rationale: "COMT causes methylation of catecholamines in the extraneuronal tissues.",
    metadata: { topic: "Catecholamine Metabolism", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "comt", "single-choice"] }
  },

  // ─── ADRENERGIC RECEPTORS ────────────────────────────────────────────────────

  {
    id: "n6c6-q035",
    type: "multi",
    prompt: "Which of the following specific physiological effects are strictly mediated by the stimulation of Beta-1 adrenergic receptors?",
    setup: "",
    choices: [
      "Increased cardiac contractility",
      "Increased renin secretion",
      "Intestinal muscle relaxation",
      "Increased heart rate",
      "Increased insulin secretion",
      "Bronchial smooth relaxation",
    ],
    correctAnswers: [
      "Increased cardiac contractility",
      "Increased renin secretion",
      "Intestinal muscle relaxation",
      "Increased heart rate",
    ],
    selectCount: 4,
    rationale: "Beta-1 effects include an increase in heart rate, contractility, excitability, and conduction; increased renin secretion; and relaxation of intestinal muscles.",
    metadata: { topic: "Beta-1 Receptors", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "beta-1", "receptors", "multi-select", "high-yield"] }
  },

  {
    id: "n6c6-q036",
    type: "multi",
    prompt: "Which of the following specific physiological effects are strictly mediated by the stimulation of Beta-2 adrenergic receptors?",
    setup: "",
    choices: [
      "Relaxation of bronchial smooth muscle",
      "Relaxation of vascular smooth muscle",
      "Increased insulin release",
      "Decreased insulin release",
      "Contraction of intestinal muscle",
    ],
    correctAnswers: [
      "Relaxation of bronchial smooth muscle",
      "Relaxation of vascular smooth muscle",
      "Increased insulin release",
    ],
    selectCount: 3,
    rationale: "Beta-2 effects include relaxation of bronchial, vascular, and other smooth muscle, along with increased insulin release.",
    metadata: { topic: "Beta-2 Receptors", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "beta-2", "receptors", "multi-select", "high-yield"] }
  },

  {
    id: "n6c6-q037",
    type: "mcq",
    prompt: "What specific adrenergic receptor possesses a significantly greater affinity for epinephrine than for norepinephrine?",
    setup: "",
    ans: [
      { t: "The Beta-2 adrenergic receptor.", ok: true },
      { t: "The Beta-1 adrenergic receptor.", ok: false },
      { t: "The Alpha-1 adrenergic receptor.", ok: false },
      { t: "The Alpha-2 adrenergic receptor.", ok: false },
    ],
    rationale: "Beta-2 receptors have a greater affinity for epinephrine than for norepinephrine and are more sensitive to epinephrine.",
    metadata: { topic: "Beta-2 Receptors", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "beta-2", "epinephrine", "single-choice"] }
  },

  {
    id: "n6c6-q038",
    type: "mcq",
    prompt: "By what specific cellular mechanism do Beta-2 receptors produce smooth muscle relaxation?",
    setup: "",
    ans: [
      { t: "It is driven by membrane hyperpolarization and decreased calcium flux.", ok: true },
      { t: "It is driven by membrane depolarization and increased calcium flux.", ok: false },
      { t: "It is driven by membrane hyperpolarization and increased sodium flux.", ok: false },
      { t: "It is driven by membrane depolarization and decreased sodium flux.", ok: false },
    ],
    rationale: "Beta-2 relaxation reflects hyperpolarization of cell membranes and decreased inward calcium ion flux.",
    metadata: { topic: "Beta-2 Receptors", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "beta-2", "mechanism", "single-choice"] }
  },

  {
    id: "n6c6-q039",
    type: "multi",
    prompt: "Which of the following specific physiological effects are strictly mediated by the stimulation of Alpha-1 adrenergic receptors?",
    setup: "",
    choices: [
      "Vascular smooth muscle vasoconstriction",
      "Contraction of bladder neck muscles",
      "Pupil dilatation",
      "Platelet aggregation",
      "Decreased insulin release",
      "Presynaptic transmission inhibition",
    ],
    correctAnswers: [
      "Vascular smooth muscle vasoconstriction",
      "Contraction of bladder neck muscles",
      "Pupil dilatation",
      "Platelet aggregation",
    ],
    selectCount: 4,
    rationale: "Alpha-1 effects include vascular smooth muscle contraction, contraction of bladder neck and prostate smooth muscle, pupil dilatation, and platelet aggregation.",
    metadata: { topic: "Alpha-1 Receptors", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "alpha-1", "receptors", "multi-select", "high-yield"] }
  },

  {
    id: "n6c6-q040",
    type: "mcq",
    prompt: "How does the direct stimulation of Alpha-1 adrenergic receptors specifically influence the release of endogenous insulin?",
    setup: "",
    ans: [
      { t: "It directly inhibits the release of insulin.", ok: true },
      { t: "It directly stimulates the release of insulin.", ok: false },
      { t: "It completely destroys stored insulin.", ok: false },
      { t: "It completely replicates stored insulin.", ok: false },
    ],
    rationale: "Alpha-1 receptor stimulation inhibits the release of insulin.",
    metadata: { topic: "Alpha-1 Receptors", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "alpha-1", "insulin", "single-choice"] }
  },

  {
    id: "n6c6-q041",
    type: "multi",
    prompt: "Which of the following specific physiological effects are strictly mediated by the stimulation of Alpha-2 adrenergic receptors?",
    setup: "",
    choices: [
      "Presynaptic signal inhibition",
      "Decreased insulin release",
      "Venous vasoconstriction",
      "Thrombus stabilization",
      "Pupil dilatation",
      "Increased renin secretion",
    ],
    correctAnswers: [
      "Presynaptic signal inhibition",
      "Decreased insulin release",
      "Venous vasoconstriction",
      "Thrombus stabilization",
    ],
    selectCount: 4,
    rationale: "Alpha-2 effects include presynaptic inhibition, decreased insulin release, venous constriction, and platelet aggregation with thrombus stabilization.",
    metadata: { topic: "Alpha-2 Receptors", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "alpha-2", "receptors", "multi-select", "high-yield"] }
  },

  // ─── EPINEPHRINE / NOREPINEPHRINE ─────────────────────────────────────────────

  {
    id: "n6c6-q042",
    type: "mcq",
    prompt: "During cardiopulmonary resuscitation, what specific physiological mechanism of epinephrine is considered the single most important determinant of patient survival?",
    setup: "",
    ans: [
      { t: "Alpha-one vasoconstriction significantly increasing aortic diastolic pressure.", ok: true },
      { t: "Beta-one inotropy significantly increasing myocardial contraction force.", ok: false },
      { t: "Beta-two bronchodilation significantly improving pulmonary oxygenation.", ok: false },
      { t: "Alpha-two agonism significantly decreasing peripheral sympathetic outflow.", ok: false },
    ],
    rationale: "Epinephrine's alpha-1 vasoconstriction increases aortic diastolic pressure, promoting coronary flow during cardiac arrest, which may be the single most important determinant of survival.",
    metadata: { topic: "Epinephrine", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "epinephrine", "cpr", "single-choice", "high-yield"] }
  },

  // ─── DOPAMINE ────────────────────────────────────────────────────────────────

  {
    id: "n6c6-q043",
    type: "mcq",
    prompt: "Why must the specific medication L-dopa be administered to Parkinson's patients instead of administering a direct intravenous dopamine infusion?",
    setup: "",
    ans: [
      { t: "Dopamine cannot cross the blood-brain barrier to reach the CNS.", ok: true },
      { t: "Dopamine cannot cross the gastric mucosa to reach the bloodstream.", ok: false },
      { t: "Dopamine causes immediate and profound systemic hypertension.", ok: false },
      { t: "Dopamine is instantly metabolized by plasma pseudocholinesterase.", ok: false },
    ],
    rationale: "Because dopamine cannot cross the blood-brain barrier, it does not directly affect the central nervous system. L-dopa is given because it can cross the blood-brain barrier.",
    metadata: { topic: "Dopamine", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "dopamine", "parkinsons", "single-choice"] }
  },

  {
    id: "n6c6-q044",
    type: "multi",
    prompt: "Which of the following unique physiological effects are simultaneously produced by the administration of intravenous dopamine?",
    setup: "",
    choices: [
      "Increased cardiac contractility",
      "Increased renal blood flow",
      "Increased sodium excretion",
      "Increased glomerular filtration",
      "Decreased urine output",
      "Decreased sodium excretion",
    ],
    correctAnswers: [
      "Increased cardiac contractility",
      "Increased renal blood flow",
      "Increased sodium excretion",
      "Increased glomerular filtration",
    ],
    selectCount: 4,
    rationale: "Dopamine is unique in its ability to simultaneously increase myocardial contractility, renal blood flow, glomerular filtration, and sodium excretion.",
    metadata: { topic: "Dopamine", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "dopamine", "renal-effects", "multi-select", "high-yield"] }
  },

  {
    id: "n6c6-q045",
    type: "mcq",
    prompt: "What is the approximate elimination half-life of intravenous dopamine due to its rapid metabolism by MAO and COMT?",
    setup: "",
    ans: [
      { t: "The approximate clinical half-life is one minute.", ok: true },
      { t: "The approximate clinical half-life is ten minutes.", ok: false },
      { t: "The approximate clinical half-life is one second.", ok: false },
      { t: "The approximate clinical half-life is thirty minutes.", ok: false },
    ],
    rationale: "Dopamine is rapidly metabolized by MAO and COMT with a half-life of about one minute.",
    metadata: { topic: "Dopamine", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "dopamine", "pharmacokinetics", "single-choice"] }
  },

  // ─── CLONIDINE / ALPHA-2 AGONISTS ────────────────────────────────────────────

  {
    id: "n6c6-q046",
    type: "multi",
    prompt: "Which of the following are recognized clinical uses for the Alpha-2 agonist medication clonidine?",
    setup: "",
    choices: [
      "Treating symptoms of opioid withdrawal",
      "Treating diabetic diarrhea",
      "Treating emesis in cancer chemotherapy",
      "Treating acute systemic hypotension",
      "Treating acute systemic bradycardia",
    ],
    correctAnswers: [
      "Treating symptoms of opioid withdrawal",
      "Treating diabetic diarrhea",
      "Treating emesis in cancer chemotherapy",
    ],
    selectCount: 3,
    rationale: "Clonidine is used to treat withdrawal symptoms, emesis in chemotherapy, and diabetic diarrhea, among other indications.",
    metadata: { topic: "Clonidine", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "clonidine", "alpha-2", "multi-select"] }
  },

  {
    id: "n6c6-q047",
    type: "mcq",
    prompt: "The systemic administration of the Alpha-2 agonist clonidine can potentially increase a patient's blood glucose levels via what specific mechanism?",
    setup: "",
    ans: [
      { t: "By directly inhibiting the normal release of endogenous insulin.", ok: true },
      { t: "By directly stimulating the normal release of endogenous insulin.", ok: false },
      { t: "By directly inhibiting the normal release of endogenous glucagon.", ok: false },
      { t: "By directly stimulating the normal release of endogenous glucagon.", ok: false },
    ],
    rationale: "Clonidine may increase blood glucose by inhibiting the release of insulin.",
    metadata: { topic: "Clonidine", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "clonidine", "insulin", "single-choice"] }
  },

  // ─── ISOPROTERENOL ───────────────────────────────────────────────────────────

  {
    id: "n6c6-q048",
    type: "mcq",
    prompt: "Which specific synthetic catecholamine is widely considered the most potent sympathomimetic at both the Beta-1 and Beta-2 receptors?",
    setup: "",
    ans: [
      { t: "The synthetic medication recognized as Isoproterenol.", ok: true },
      { t: "The synthetic medication recognized as Dobutamine.", ok: false },
      { t: "The synthetic medication recognized as Ephedrine.", ok: false },
      { t: "The synthetic medication recognized as Phenylephrine.", ok: false },
    ],
    rationale: "Isoproterenol is the most potent of all the sympathomimetics at the beta-1 and beta-2 receptors.",
    metadata: { topic: "Isoproterenol", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "isoproterenol", "beta-agonist", "single-choice"] }
  },

  {
    id: "n6c6-q049",
    type: "mcq",
    prompt: "Why is the synthetic catecholamine Isoproterenol primarily utilized as a chronotropic agent in patients following a successful heart transplantation?",
    setup: "",
    ans: [
      { t: "The divided sympathetic fibers prevent the heart from generating endogenous responses.", ok: true },
      { t: "The divided parasympathetic fibers prevent the heart from generating endogenous responses.", ok: false },
      { t: "The transplanted cardiac myocytes lack alpha-one receptors.", ok: false },
      { t: "The transplanted cardiac myocytes lack beta-two receptors.", ok: false },
    ],
    rationale: "Isoproterenol is used as a chronotropic agent after heart transplantation because those patients are unable to generate an endogenous sympathetic response, as the sympathetic fibers are divided when the native heart is removed.",
    metadata: { topic: "Isoproterenol", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "isoproterenol", "transplant", "single-choice"] }
  },

  // ─── DOBUTAMINE ──────────────────────────────────────────────────────────────

  {
    id: "n6c6-q050",
    type: "mcq",
    prompt: "To strictly avoid the dangerous inactivation of the catecholamine structure, dobutamine must be specifically dissolved in what type of solution?",
    setup: "",
    ans: [
      { t: "It must be dissolved in D5W fluids to avoid alkaline inactivation.", ok: true },
      { t: "It must be dissolved in D5W fluids to avoid acidic inactivation.", ok: false },
      { t: "It must be dissolved in NaCl fluids to avoid alkaline inactivation.", ok: false },
      { t: "It must be dissolved in NaCl fluids to avoid acidic inactivation.", ok: false },
    ],
    rationale: "Dobutamine needs to be dissolved in D5W to avoid inactivation of the catecholamine that may occur in an alkaline solution.",
    metadata: { topic: "Dobutamine", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "dobutamine", "preparation", "single-choice"] }
  },

  // ─── EPHEDRINE ───────────────────────────────────────────────────────────────

  {
    id: "n6c6-q051",
    type: "mcq",
    prompt: "How do the specific cardiovascular effects of ephedrine clinically compare directly to the cardiovascular effects of epinephrine administration?",
    setup: "",
    ans: [
      { t: "The blood pressure increase is less intense but lasts exactly ten times longer.", ok: true },
      { t: "The blood pressure increase is more intense but lasts exactly ten times shorter.", ok: false },
      { t: "The blood pressure increase is exactly equal but lasts exactly ten times longer.", ok: false },
      { t: "The blood pressure increase is exactly equal but lasts exactly ten times shorter.", ok: false },
    ],
    rationale: "The cardiovascular effects of ephedrine resemble those of epinephrine, but the blood pressure increase is less intense and lasts about ten times longer.",
    metadata: { topic: "Ephedrine", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "ephedrine", "epinephrine", "single-choice"] }
  },

  // ─── PHENYLEPHRINE ───────────────────────────────────────────────────────────

  {
    id: "n6c6-q052",
    type: "mcq",
    prompt: "Which specific synthetic noncatecholamine primarily stimulates alpha-1 receptors, causing a profound venoconstriction that is much greater than its arterial constriction?",
    setup: "",
    ans: [
      { t: "The medication recognized as Phenylephrine.", ok: true },
      { t: "The medication recognized as Ephedrine.", ok: false },
      { t: "The medication recognized as Dobutamine.", ok: false },
      { t: "The medication recognized as Isoproterenol.", ok: false },
    ],
    rationale: "Phenylephrine primarily stimulates alpha-1 receptors, resulting in venoconstriction that is greater than its arterial constriction.",
    metadata: { topic: "Phenylephrine", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "phenylephrine", "alpha-1", "single-choice", "high-yield"] }
  },

  {
    id: "n6c6-q053",
    type: "mcq",
    prompt: "According to standard clinical guidelines, the treatment of hypotension with sympathomimetics is explicitly not recommended for patients suffering from what specific condition?",
    setup: "",
    ans: [
      { t: "The systemic condition recognized as profound untreated hypovolemia.", ok: true },
      { t: "The systemic condition recognized as profound untreated bradycardia.", ok: false },
      { t: "The systemic condition recognized as profound untreated anaphylaxis.", ok: false },
      { t: "The systemic condition recognized as profound untreated hypervolemia.", ok: false },
    ],
    rationale: "Treatment of hypotension with sympathomimetics is not recommended for hypovolemia.",
    metadata: { topic: "Sympathomimetics", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "hypotension", "vasopressors", "single-choice", "high-yield"] }
  },

  // ─── DRUG CLASSIFICATION ─────────────────────────────────────────────────────

  {
    id: "n6c6-q054",
    type: "multi",
    prompt: "Which of the following medications are explicitly classified as naturally occurring endogenous catecholamines?",
    setup: "",
    choices: [
      "Epinephrine",
      "Norepinephrine",
      "Dopamine",
      "Isoproterenol",
      "Dobutamine",
    ],
    correctAnswers: ["Epinephrine", "Norepinephrine", "Dopamine"],
    selectCount: 3,
    rationale: "Naturally occurring catecholamines include epinephrine, norepinephrine, and dopamine.",
    metadata: { topic: "Drug Classification", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "catecholamines", "classification", "multi-select"] }
  },

  {
    id: "n6c6-q055",
    type: "multi",
    prompt: "Which of the following medications are explicitly classified as synthetic noncatecholamines?",
    setup: "",
    choices: [
      "Ephedrine",
      "Phenylephrine",
      "Amphetamine",
      "Isoproterenol",
      "Dobutamine",
    ],
    correctAnswers: ["Ephedrine", "Phenylephrine", "Amphetamine"],
    selectCount: 3,
    rationale: "Synthetic noncatecholamines include ephedrine, phenylephrine, amphetamine, and metaraminol.",
    metadata: { topic: "Drug Classification", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "classification", "noncatecholamines", "multi-select"] }
  },

  // ─── DEXMEDETOMIDINE ─────────────────────────────────────────────────────────

  {
    id: "n6c6-q056",
    type: "mcq",
    prompt: "What unique clinical feature makes the administration of the Alpha-2 agonist Dexmedetomidine highly attractive for patients weaning from a ventilator or undergoing neurosurgical procedures?",
    setup: "",
    ans: [
      { t: "It provides a deeply rousable sedation allowing verbal interaction.", ok: true },
      { t: "It provides a deeply paralytic sedation preventing verbal interaction.", ok: false },
      { t: "It provides a deeply amnesic sedation eliminating surgical memories.", ok: false },
      { t: "It provides a deeply hyperalgesic sedation heightening local stimuli.", ok: false },
    ],
    rationale: "Dexmedetomidine is attractive for its rousable sedation, as patients will awaken from apparently deep states of sedation to verbal commands or light tactile stimulation.",
    metadata: { topic: "Dexmedetomidine", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "dexmedetomidine", "alpha-2", "single-choice"] }
  },

  {
    id: "n6c6-q057",
    type: "mcq",
    prompt: "Which specific adrenergic agonist medication produces dose-dependent increases in cardiac output and decreases in atrial filling pressures without causing significant increases in blood pressure or heart rate?",
    setup: "",
    ans: [
      { t: "The medication recognized as Dobutamine.", ok: true },
      { t: "The medication recognized as Epinephrine.", ok: false },
      { t: "The medication recognized as Phenylephrine.", ok: false },
      { t: "The medication recognized as Isoproterenol.", ok: false },
    ],
    rationale: "Dobutamine produces dose-dependent increases in cardiac output and decreases in atrial filling pressures without significant increases in blood pressure and heart rate.",
    metadata: { topic: "Dobutamine", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "dobutamine", "hemodynamics", "single-choice", "high-yield"] }
  },

  {
    id: "n6c6-q058",
    type: "mcq",
    prompt: "By what dual pharmacological mechanism does the synthetic noncatecholamine Ephedrine specifically produce its clinical effects?",
    setup: "",
    ans: [
      { t: "It acts both directly on receptors and indirectly by releasing norepinephrine.", ok: true },
      { t: "It acts both directly on receptors and indirectly by releasing acetylcholine.", ok: false },
      { t: "It acts both directly on enzymes and indirectly by blocking norepinephrine.", ok: false },
      { t: "It acts both directly on enzymes and indirectly by blocking acetylcholine.", ok: false },
    ],
    rationale: "Ephedrine's effects are due in part to endogenous release of norepinephrine along with direct stimulant effects on adrenergic receptors.",
    metadata: { topic: "Ephedrine", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "ephedrine", "mechanism", "single-choice"] }
  },

  {
    id: "n6c6-q059",
    type: "mcq",
    prompt: "What is the specific physiological effect of circulating epinephrine on the blood vessels located within the body's skeletal muscle beds?",
    setup: "",
    ans: [
      { t: "It causes vascular relaxation due to a predominance of beta-over-alpha effects.", ok: true },
      { t: "It causes vascular contraction due to a predominance of alpha-over-beta effects.", ok: false },
      { t: "It causes vascular spasm due to a complete absence of localized beta receptors.", ok: false },
      { t: "It causes vascular stasis due to a complete absence of localized alpha receptors.", ok: false },
    ],
    rationale: "Circulating epinephrine causes relaxation of blood vessels in skeletal muscle, reflecting a predominance of beta-over-alpha effects at low concentrations.",
    metadata: { topic: "Epinephrine", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "epinephrine", "vascular", "single-choice"] }
  },

  {
    id: "n6c6-q060",
    type: "mcq",
    prompt: "Which of the following specific physiological functions are explicitly inhibited by circulating levels of endogenous norepinephrine?",
    setup: "",
    ans: [
      { t: "The general motility and function of the entire gastrointestinal tract.", ok: true },
      { t: "The general motility and function of the entire cardiovascular system.", ok: false },
      { t: "The general motility and function of the entire central nervous system.", ok: false },
      { t: "The general motility and function of the entire somatic motor system.", ok: false },
    ],
    rationale: "Circulating norepinephrine causes vasoconstriction, inhibition of the gastrointestinal tract, increased cardiac activity, and dilation of pupils.",
    metadata: { topic: "Norepinephrine", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "norepinephrine", "gi", "single-choice"] }
  },

  // ─── SNS ANATOMY (REPEAT / VARIANT) ─────────────────────────────────────────

  {
    id: "n6c6-q061",
    type: "mcq",
    prompt: "Where do the preganglionic fibers of the sympathetic nervous system specifically originate within the human spinal cord?",
    setup: "",
    ans: [
      { t: "Intermediolateral column of T1 to T12 and L1 to L3.", ok: true },
      { t: "Intermediolateral column of C1 to C7 and S1 to S5.", ok: false },
      { t: "Intermediolateral column of T5 to T12 and L1 to L5.", ok: false },
      { t: "Intermediolateral column of C5 to T1 and L3 to S3.", ok: false },
    ],
    rationale: "Preganglionic fibers of the sympathetic nervous system originate in the intermediolateral column of the thoracic spine and the first three lumbar segments.",
    metadata: { topic: "SNS Anatomy", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "sns", "anatomy", "single-choice"] }
  },

  {
    id: "n6c6-q062",
    type: "mcq",
    prompt: "In 80% of people, the stellate ganglion is formed by the anatomical fusion of which two specific nerve structures?",
    setup: "",
    ans: [
      { t: "The inferior cervical ganglion and first thoracic ganglion.", ok: true },
      { t: "The superior cervical ganglion and first thoracic ganglion.", ok: false },
      { t: "The inferior thoracic ganglion and first cervical ganglion.", ok: false },
      { t: "The superior thoracic ganglion and first cervical ganglion.", ok: false },
    ],
    rationale: "In most people, the stellate ganglion is formed by fusion of the inferior cervical ganglion with the first thoracic ganglion on each side.",
    metadata: { topic: "SNS Anatomy", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "stellate", "anatomy", "single-choice"] }
  },

  // ─── CHOLINERGIC CRISIS ──────────────────────────────────────────────────────

  {
    id: "n6c6-q063",
    type: "multi",
    prompt: "Which of the following clinical signs are explicitly included in the SLUDGE acronym representing a cholinergic crisis?",
    setup: "",
    choices: [
      "Salivation",
      "Lacrimation",
      "Urination",
      "Emesis",
      "Tachycardia",
      "Mydriasis",
    ],
    correctAnswers: ["Salivation", "Lacrimation", "Urination", "Emesis"],
    selectCount: 4,
    rationale: "The SLUDGE acronym represents salivation, lacrimation, urination, diarrhea, gastrointestinal cramps, and emesis during a cholinergic crisis.",
    metadata: { topic: "Cholinergic Crisis", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "sludge", "cholinergic-crisis", "multi-select", "high-yield"] }
  },

  // ─── PNS ANATOMY (VARIANT) ───────────────────────────────────────────────────

  {
    id: "n6c6-q064",
    type: "multi",
    prompt: "Which specific cranial nerves carry the parasympathetic nervous system cell bodies arising directly from the brainstem?",
    setup: "",
    choices: [
      "Cranial Nerve III",
      "Cranial Nerve VII",
      "Cranial Nerve IX",
      "Cranial Nerve X",
      "Cranial Nerve V",
      "Cranial Nerve XII",
    ],
    correctAnswers: [
      "Cranial Nerve III",
      "Cranial Nerve VII",
      "Cranial Nerve IX",
      "Cranial Nerve X",
    ],
    selectCount: 4,
    rationale: "Cell bodies in the brainstem arise from cranial nerves III, VII, IX, and X.",
    metadata: { topic: "PNS Anatomy", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "pns", "cranial-nerves", "multi-select"] }
  },

  {
    id: "n6c6-q065",
    type: "multi",
    prompt: "The preganglionic fibers of the parasympathetic nervous system originate in which three specific areas of the central nervous system?",
    setup: "",
    choices: [
      "Midbrain",
      "Medulla oblongata",
      "Sacral part of the spinal cord",
      "Lumbar part of the spinal cord",
      "Cervical part of the spinal cord",
    ],
    correctAnswers: [
      "Midbrain",
      "Medulla oblongata",
      "Sacral part of the spinal cord",
    ],
    selectCount: 3,
    rationale: "Preganglionic fibers of the parasympathetic nervous system originate in the midbrain, medulla oblongata, and sacral spinal cord.",
    metadata: { topic: "PNS Anatomy", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "pns", "anatomy", "multi-select"] }
  },

  {
    id: "n6c6-q066",
    type: "mcq",
    prompt: "Which specific cranial nerve transmits approximately 75 percent of all parasympathetic nervous system traffic in the human body?",
    setup: "",
    ans: [
      { t: "The Vagus nerve.", ok: true },
      { t: "The Facial nerve.", ok: false },
      { t: "The Optic nerve.", ok: false },
      { t: "The Spinal nerve.", ok: false },
    ],
    rationale: "The Vagus nerve is the most important of the parasympathetic system and transmits fully three-quarters of the traffic.",
    metadata: { topic: "PNS Anatomy", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "vagus", "pns", "single-choice"] }
  },

  {
    id: "n6c6-q067",
    type: "mcq",
    prompt: "How is a sympathomimetic medication explicitly defined in autonomic pharmacology?",
    setup: "",
    ans: [
      { t: "A drug that produces the same effects as catecholamines on various organs.", ok: true },
      { t: "A drug that blocks the normal effects of catecholamines on various organs.", ok: false },
      { t: "A drug that strictly depletes endogenous catecholamines from the organs.", ok: false },
      { t: "A drug that permanently destroys receptors for catecholamines on organs.", ok: false },
    ],
    rationale: "Sympathomimetics are drugs that produce the same effects as catecholamines on various organs of the body.",
    metadata: { topic: "Sympathomimetics", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "sympathomimetics", "definition", "single-choice"] }
  },

  // ─── RECEPTOR REGULATION (VARIANT) ───────────────────────────────────────────

  {
    id: "n6c6-q068",
    type: "mcq",
    prompt: "The phenomenon of receptor upregulation typically occurs within 30 minutes of adrenergic blockade and causes what specific clinical event upon abrupt beta-blocker discontinuation?",
    setup: "",
    ans: [
      { t: "Rebound tachycardia and increased incidence of myocardial ischemia.", ok: true },
      { t: "Rebound bradycardia and increased incidence of myocardial ischemia.", ok: false },
      { t: "Rebound hypotension and increased incidence of syncopal episodes.", ok: false },
      { t: "Rebound bronchospasm and increased incidence of pulmonary edema.", ok: false },
    ],
    rationale: "Upregulation explains why sudden discontinuation of beta-adrenergic receptor blocking drugs causes rebound tachycardia and increases the incidence of myocardial infarction and ischemia.",
    metadata: { topic: "Receptor Regulation", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "beta-blockers", "upregulation", "single-choice"] }
  },

  {
    id: "n6c6-q069",
    type: "mcq",
    prompt: "What specific molecular mechanism is responsible for the downregulation of adrenergic receptors after prolonged exposure to an agonist?",
    setup: "",
    ans: [
      { t: "The cAMP-dependent destabilization of messenger RNA.", ok: true },
      { t: "The cAMP-dependent hyperstabilization of messenger RNA.", ok: false },
      { t: "The cGMP-dependent destabilization of transfer RNA.", ok: false },
      { t: "The cGMP-dependent hyperstabilization of transfer RNA.", ok: false },
    ],
    rationale: "Prolonged exposure to an agonist results in cAMP-dependent destabilization of messenger RNA, leading to decreased synthesis of beta-adrenergic receptors.",
    metadata: { topic: "Receptor Regulation", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "downregulation", "adrenergic", "single-choice"] }
  },

  {
    id: "n6c6-q070",
    type: "mcq",
    prompt: "What specific clinical diagnostic criteria confirm the presence of autonomic nervous system dysfunction during an orthostatic evaluation?",
    setup: "",
    ans: [
      { t: "A decrease in systolic blood pressure of more than 30 mmHg without an increase in heart rate.", ok: true },
      { t: "A decrease in systolic blood pressure of more than 15 mmHg without an increase in heart rate.", ok: false },
      { t: "A decrease in diastolic blood pressure of more than 30 mmHg without an increase in heart rate.", ok: false },
      { t: "A decrease in diastolic blood pressure of more than 15 mmHg without an increase in heart rate.", ok: false },
    ],
    rationale: "Autonomic nervous system dysfunction is suggested by a decrease in systolic blood pressure of more than 30 mmHg and the absence of an increase in heart rate on assuming an upright posture.",
    metadata: { topic: "ANS Dysfunction", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "orthostatic", "diagnosis", "single-choice"] }
  },

  {
    id: "n6c6-q071",
    type: "mcq",
    prompt: "According to clinical guidelines, the treatment of hypotension with sympathomimetics is explicitly not recommended for patients suffering from what specific condition?",
    setup: "",
    ans: [
      { t: "Untreated hypovolemia.", ok: true },
      { t: "Untreated bradycardia.", ok: false },
      { t: "Untreated anaphylaxis.", ok: false },
      { t: "Untreated hypervolemia.", ok: false },
    ],
    rationale: "Treatment of hypotension with sympathomimetics is not recommended for hypovolemia.",
    metadata: { topic: "Sympathomimetics", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "hypotension", "vasopressors", "single-choice"] }
  },

  // ─── RECEPTOR PHYSIOLOGY (VARIANT) ───────────────────────────────────────────

  {
    id: "n6c6-q072",
    type: "multi",
    prompt: "Which of the following physiological effects are strictly mediated by the stimulation of Beta-1 adrenergic receptors?",
    setup: "",
    choices: [
      "Increased heart rate",
      "Increased renin secretion",
      "Enhanced lipolysis",
      "Relaxation of intestinal muscles",
      "Contraction of bronchial muscles",
      "Decreased cardiac conduction",
    ],
    correctAnswers: [
      "Increased heart rate",
      "Increased renin secretion",
      "Enhanced lipolysis",
      "Relaxation of intestinal muscles",
    ],
    selectCount: 4,
    rationale: "Beta-1 effects include increased heart rate, increased renin secretion, enhanced lipolysis, and relaxation of intestinal muscles.",
    metadata: { topic: "Beta-1 Receptors", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "beta-1", "multi-select"] }
  },

  {
    id: "n6c6-q073",
    type: "mcq",
    prompt: "By what specific cellular mechanism do Beta-2 receptors produce smooth muscle relaxation in the vasculature and bronchial tree?",
    setup: "",
    ans: [
      { t: "Membrane hyperpolarization and decreased inward calcium ion flux.", ok: true },
      { t: "Membrane depolarization and increased inward calcium ion flux.", ok: false },
      { t: "Membrane hyperpolarization and increased inward sodium ion flux.", ok: false },
      { t: "Membrane depolarization and decreased inward sodium ion flux.", ok: false },
    ],
    rationale: "Beta-2 effects reflect hyperpolarization of the cell membranes and decreased inward calcium ion flux.",
    metadata: { topic: "Beta-2 Receptors", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "beta-2", "mechanism", "single-choice"] }
  },

  {
    id: "n6c6-q074",
    type: "multi",
    prompt: "Which of the following physiological effects are strictly mediated by the stimulation of Alpha-1 adrenergic receptors?",
    setup: "",
    choices: [
      "Vascular smooth muscle contraction",
      "Contraction of bladder neck",
      "Relaxation of intestinal smooth muscle",
      "Pupil dilatation",
      "Decreased insulin release",
      "Presynaptic transmission inhibition",
    ],
    correctAnswers: [
      "Vascular smooth muscle contraction",
      "Contraction of bladder neck",
      "Relaxation of intestinal smooth muscle",
      "Pupil dilatation",
    ],
    selectCount: 4,
    rationale: "Alpha-1 effects include vascular smooth muscle contraction, contraction of the bladder neck, relaxation of intestinal smooth muscle, and pupil dilatation.",
    metadata: { topic: "Alpha-1 Receptors", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "alpha-1", "multi-select"] }
  },

  {
    id: "n6c6-q075",
    type: "multi",
    prompt: "Which of the following physiological effects are strictly mediated by the stimulation of Alpha-2 adrenergic receptors?",
    setup: "",
    choices: [
      "Presynaptic inhibition of adrenergic transmission",
      "Decreased insulin release",
      "Arterial and venous vasoconstriction",
      "Platelet aggregation",
      "Increased renin secretion",
      "Pupil dilatation",
    ],
    correctAnswers: [
      "Presynaptic inhibition of adrenergic transmission",
      "Decreased insulin release",
      "Arterial and venous vasoconstriction",
      "Platelet aggregation",
    ],
    selectCount: 4,
    rationale: "Alpha-2 effects include presynaptic inhibition of adrenergic transmission, decreased insulin release, arterial and venous constriction, and platelet aggregation.",
    metadata: { topic: "Alpha-2 Receptors", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "alpha-2", "multi-select"] }
  },

  {
    id: "n6c6-q076",
    type: "mcq",
    prompt: "Why must the synthetic catecholamine dobutamine be specifically dissolved in a D5W solution?",
    setup: "",
    ans: [
      { t: "To avoid the dangerous inactivation of the catecholamine in an alkaline solution.", ok: true },
      { t: "To avoid the dangerous inactivation of the catecholamine in an acidic solution.", ok: false },
      { t: "To enhance the rapid systemic absorption of the catecholamine in the blood.", ok: false },
      { t: "To prevent the rapid systemic absorption of the catecholamine in the blood.", ok: false },
    ],
    rationale: "Dobutamine needs to be dissolved in D5W to avoid inactivation of the catecholamine that may occur in an alkaline solution.",
    metadata: { topic: "Dobutamine", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "dobutamine", "preparation", "single-choice"] }
  },

  {
    id: "n6c6-q077",
    type: "mcq",
    prompt: "What are the primary cardiovascular effects of a dobutamine infusion?",
    setup: "",
    ans: [
      { t: "Dose-dependent increases in cardiac output and decreases in atrial filling pressures without significant blood pressure or heart rate increases.", ok: true },
      { t: "Dose-dependent decreases in cardiac output and increases in atrial filling pressures without significant blood pressure or heart rate increases.", ok: false },
      { t: "Dose-dependent increases in blood pressure and heart rate without significant changes to cardiac output or atrial filling pressures.", ok: false },
      { t: "Dose-dependent decreases in blood pressure and heart rate without significant changes to cardiac output or atrial filling pressures.", ok: false },
    ],
    rationale: "Dobutamine produces dose-dependent increases in cardiac output and decreases in atrial filling pressures without associated significant increases in blood pressure and heart rate.",
    metadata: { topic: "Dobutamine", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "dobutamine", "hemodynamics", "single-choice"] }
  },

  // ─── SHORT ANSWER ─────────────────────────────────────────────────────────────

  {
    id: "n6c6-q078",
    type: "short",
    prompt: "The term viscus refers to any large interior organ located within the abdominal, thoracic, or what other specific body cavity?",
    setup: "",
    acceptedAnswers: [
      "Pelvic cavity",
      "Pelvis",
      "pelvic",
      "pelvic space",
      "the pelvic cavity",
    ],
    rationale: "A viscus is defined as any large interior organ within the abdominal, thoracic, or pelvic cavities.",
    metadata: { topic: "ANS Foundation", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "foundation", "short-answer"] }
  },

  {
    id: "n6c6-q079",
    type: "short",
    prompt: "In the adrenal glands, sympathetic preganglionic fibers bypass postganglionic neurons to interact directly with what specific cells?",
    setup: "",
    acceptedAnswers: [
      "Chromaffin cells",
      "Chromaffin cell",
      "Chromaffin",
      "chromaffin cells of adrenal",
      "adrenal chromaffin cells",
      "chromaffin cells of the adrenal medulla",
    ],
    rationale: "In the adrenal glands, preganglionic fibers interact directly with chromaffin cells, which release norepinephrine and epinephrine.",
    metadata: { topic: "SNS Anatomy", priority: "high", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "adrenal", "chromaffin", "short-answer"] }
  },

  {
    id: "n6c6-q080",
    type: "short",
    prompt: "To maintain systemic homeostasis, the autonomic nervous system relies extensively on what type of regulatory loop?",
    setup: "",
    acceptedAnswers: [
      "Negative feedback",
      "negative feedback loop",
      "negative feedback system",
      "negative-feedback",
      "negative feedback control",
    ],
    rationale: "The autonomic nervous system makes extensive use of a negative feedback system.",
    metadata: { topic: "ANS Foundation", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "homeostasis", "short-answer"] }
  },

  {
    id: "n6c6-q081",
    type: "short",
    prompt: "Which specific division of the autonomic nervous system is responsible for protecting the retina from excessive light?",
    setup: "",
    acceptedAnswers: [
      "Parasympathetic system",
      "Parasympathetic nervous system",
      "PNS",
      "Parasympathetic",
      "parasympathetic division",
      "parasympathetic ns",
      "the parasympathetic system",
    ],
    rationale: "In general, the parasympathetic system protects the retina from excessive light.",
    metadata: { topic: "PNS Physiology", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "pns", "retina", "short-answer"] }
  },

  {
    id: "n6c6-q082",
    type: "short",
    prompt: "After degradation by MAO and COMT, what specific chemical compound is the eventual metabolic end product of epinephrine and norepinephrine?",
    setup: "",
    acceptedAnswers: [
      "Vanillylmandelic acid",
      "VMA",
      "vanilylmandelic acid",
      "vanillyl mandelic acid",
      "vanillylmandelate",
      "vanillylmandelic",
      "vma acid",
    ],
    rationale: "The end product of epinephrine and norepinephrine metabolism is vanillylmandelic acid.",
    metadata: { topic: "Catecholamine Metabolism", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "metabolism", "vma", "short-answer"] }
  },

  {
    id: "n6c6-q083",
    type: "short",
    prompt: "All endogenous catecholamines are fundamentally synthesized as chemical derivatives of what specific amino acid?",
    setup: "",
    acceptedAnswers: [
      "Phenylalanine",
      "phenylalanine amino acid",
      "L-phenylalanine",
      "phenyl alanine",
    ],
    rationale: "Catecholamines are derivatives of phenylalanine amino acids.",
    metadata: { topic: "Catecholamine Synthesis", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "catecholamines", "short-answer"] }
  },

  {
    id: "n6c6-q084",
    type: "short",
    prompt: "According to its pharmacological profile, epinephrine is described as having what specific level of lipid solubility?",
    setup: "",
    acceptedAnswers: [
      "Poorly soluble",
      "Poor lipid solubility",
      "poorly lipid soluble",
      "low lipid solubility",
      "poorly lipid-soluble",
      "low solubility",
      "poor solubility",
      "poorly soluble in lipids",
    ],
    rationale: "Epinephrine is poorly lipid soluble.",
    metadata: { topic: "Epinephrine", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "epinephrine", "short-answer"] }
  },

  {
    id: "n6c6-q085",
    type: "short",
    prompt: "The direct stimulation of Alpha-1 adrenergic receptors specifically inhibits the systemic release of what endocrine hormone?",
    setup: "",
    acceptedAnswers: [
      "Insulin",
      "insulin hormone",
      "endogenous insulin",
    ],
    rationale: "Alpha-1 receptor stimulation inhibits release of insulin.",
    metadata: { topic: "Alpha-1 Receptors", priority: "medium", category: "autonomic-ns", source: "node-6-chapter-6", tags: ["node-6", "chapter-6", "autonomic-ns", "alpha-1", "insulin", "short-answer"] }
  },

];

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const AUTONOMIC_NS_METADATA = {
  nodeId:         "node-6",
  courseId:       "basics-of-anesthesia",
  chapter:        6,
  title:          "Autonomic Nervous System",
  totalQuestions: 85,
  tags:           ["basics-of-anesthesia", "node-6", "chapter-6", "autonomic-nervous-system", "nbcrna-style"],
};
