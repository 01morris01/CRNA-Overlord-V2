/**
 * Advanced Pharmacology I, Week 2
 * Peripheral Nervous System, Autonomic Pharmacology, and Thermoregulation
 * Stoelting Ch 3 pp 76–94, Vandivier lecture
 */
export const AP1_WK2_QUESTIONS = [

  // ═══════════════════════════════════════════════════════════════════════
  //  PNS OVERVIEW  (slides 4–6)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w2-001",
    type: "mcq",
    prompt: "The peripheral nervous system (PNS) serves as the communication link between the:",  // source: slide 4, slide 5
    setup: "",
    ans: [
      { t: "Central nervous system and the rest of the body", ok: true },
      { t: "Right and left hemispheres of the brain", ok: false },
      { t: "Sympathetic and parasympathetic ganglia exclusively", ok: false },
      { t: "Spinal cord and the brainstem only", ok: false },
    ],
    rationale: "The PNS connects the central nervous system (brain and spinal cord) to all body tissues and organs via sensory (afferent) and motor (efferent) nerves. (B) is wrong because interhemispheric communication occurs via the corpus callosum, a CNS structure. (C) is wrong because the PNS encompasses much more than autonomic ganglia. (D) is wrong because the PNS extends to peripheral tissues, not just between CNS structures. Pearl: Regional anesthesia techniques (spinal, epidural, peripheral nerve blocks) target PNS structures to interrupt sensory and motor transmission.",
    scene: "pharmacology",
    sceneCfg: { label: "PNS OVERVIEW" },
    metadata: { topic: "PNS Overview", priority: "high" },
  },

  {
    id: "ap1-w2-002",
    type: "mcq",
    prompt: "Peripheral nerves are the primary targets for which anesthetic techniques?",  // source: slide 6
    setup: "",
    ans: [
      { t: "General inhalation anesthesia for surgery", ok: false },
      { t: "Regional, peripheral nerve block, and neuraxial", ok: true },
      { t: "Total intravenous anesthesia using propofol", ok: false },
      { t: "Monitored anesthesia care with sedation", ok: false },
    ],
    rationale: "Peripheral nerves are the key targets for regional anesthesia, peripheral nerve blocks, and neuraxial (epidural and spinal) techniques. Understanding PNS anatomy improves block accuracy, pain management, and patient safety. (A) is wrong because inhaled agents primarily act on the CNS. (C) is wrong because TIVA acts centrally. (D) is wrong because MAC relies on sedation, not peripheral nerve blockade. Pearl: Detailed knowledge of peripheral nerve anatomy allows anesthesia providers to place blocks precisely and minimize complications.",
    scene: "pharmacology",
    sceneCfg: { label: "PNS OVERVIEW" },
    metadata: { topic: "PNS Overview", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ANS DIVISIONS AND ORGAN EFFECTS  (slides 7–10)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w2-003",
    type: "mcq",
    prompt: "The autonomic nervous system (ANS) primarily controls:",  // source: slide 7, slide 8
    setup: "",
    ans: [
      { t: "Voluntary skeletal muscle contraction", ok: false },
      { t: "Involuntary visceral function and homeostasis", ok: true },
      { t: "Conscious sensory perception of stimuli", ok: false },
      { t: "Cerebellar coordination of movement", ok: false },
    ],
    rationale: "The ANS controls involuntary visceral body functions and maintains physiologic homeostasis, including heart rate, blood pressure, bronchial tone, gastrointestinal motility, bladder function, and temperature control. (A) is wrong because voluntary muscle is controlled by the somatic nervous system. (C) is wrong because conscious perception is a cortical function. (D) is wrong because cerebellar coordination is a CNS function. Pearl: Many anesthesia drugs act directly on autonomic receptors, making ANS physiology essential to predicting hemodynamic and organ responses during cases.",
    scene: "pharmacology",
    sceneCfg: { label: "ANS DIVISIONS" },
    metadata: { topic: "ANS Divisions", priority: "high" },
  },

  {
    id: "ap1-w2-004",
    type: "mcq",
    prompt: "The autonomic nervous system is divided into which three divisions?",  // source: slide 7, slide 10
    setup: "",
    ans: [
      { t: "Sympathetic, parasympathetic, and enteric", ok: true },
      { t: "Sensory, motor, and reflex", ok: false },
      { t: "Somatic, visceral, and cranial", ok: false },
      { t: "Central, peripheral, and autonomic", ok: false },
    ],
    rationale: "The ANS comprises the sympathetic nervous system (fight or flight), parasympathetic nervous system (rest and digest), and enteric nervous system (independent GI regulation). (B) is wrong because sensory/motor/reflex describes functional categories of the entire nervous system. (C) is wrong because somatic/visceral/cranial is not the standard ANS classification. (D) is wrong because those are divisions of the entire nervous system, not the ANS specifically. Pearl: The enteric nervous system operates relatively independently within the GI tract via the myenteric and submucosal plexuses.",
    scene: "pharmacology",
    sceneCfg: { label: "ANS DIVISIONS" },
    metadata: { topic: "ANS Divisions", priority: "high" },
  },

  {
    id: "ap1-w2-005",
    type: "mcq",
    prompt: "Activation of the sympathetic nervous system produces all of the following EXCEPT:",  // source: slide 9
    setup: "",
    ans: [
      { t: "Increased heart rate and contractility", ok: false },
      { t: "Bronchodilation of the airways", ok: false },
      { t: "Increased GI motility and secretions", ok: true },
      { t: "Increased systemic blood pressure", ok: false },
    ],
    rationale: "The sympathetic (fight or flight) response increases heart rate, contractility, blood pressure, and causes bronchodilation while DECREASING gastrointestinal activity. Increased GI motility and secretions are parasympathetic effects. (A) is a classic sympathetic effect. (B) occurs via beta 2 receptor activation in bronchial smooth muscle. (D) results from increased cardiac output and vasoconstriction. Pearl: Sympathetic activation diverts blood flow away from the GI tract to skeletal muscles, heart, and brain for the fight or flight response.",
    scene: "pharmacology",
    sceneCfg: { label: "ANS DIVISIONS" },
    metadata: { topic: "ANS Divisions", priority: "high" },
  },

  {
    id: "ap1-w2-006",
    type: "mcq",
    prompt: "Parasympathetic nervous system stimulation produces which combination of effects?",  // source: slide 9
    setup: "",
    ans: [
      { t: "Faster heart rate with bronchodilation", ok: false },
      { t: "Slower heart rate, more GI motility, bronchoconstriction", ok: true },
      { t: "Pupil dilation with higher blood pressure", ok: false },
      { t: "Skeletal muscle vasodilation and sweating", ok: false },
    ],
    rationale: "The parasympathetic (rest and digest) response decreases heart rate, increases gastrointestinal motility and secretions, promotes bladder emptying, and causes bronchoconstriction. (A) is wrong because increased heart rate and bronchodilation are sympathetic effects. (C) is wrong because pupil dilation (mydriasis) and increased blood pressure are sympathetic. (D) is wrong because sweating is mediated by sympathetic cholinergic fibers. Pearl: During anesthesia, unopposed parasympathetic tone (vagal stimulation) can cause profound bradycardia, requiring treatment with atropine or glycopyrrolate.",
    scene: "pharmacology",
    sceneCfg: { label: "ANS DIVISIONS" },
    metadata: { topic: "ANS Divisions", priority: "high" },
  },

  {
    id: "ap1-w2-007",
    type: "mcq",
    prompt: "The enteric nervous system independently regulates digestive activity through which plexuses?",  // source: slide 10
    setup: "",
    ans: [
      { t: "Myenteric plexus and submucosal plexus", ok: true },
      { t: "Celiac plexus and mesenteric plexus", ok: false },
      { t: "Brachial plexus and lumbar plexus", ok: false },
      { t: "Choroid plexus and cardiac plexus", ok: false },
    ],
    rationale: "The enteric nervous system, located within the GI tract, regulates digestive function through the myenteric (Auerbach) plexus and the submucosal (Meissner) plexus. (B) is wrong because the celiac and mesenteric plexuses are extrinsic sympathetic structures. (C) is wrong because brachial and lumbar plexuses are somatic nerve networks. (D) is wrong because the choroid plexus produces CSF and the cardiac plexus is an autonomic plexus of the heart. Pearl: The enteric nervous system contains enough neurons to function independently, sometimes called the 'second brain' of the GI tract.",
    scene: "pharmacology",
    sceneCfg: { label: "ANS DIVISIONS" },
    metadata: { topic: "ANS Divisions", priority: "high" },
  },

  {
    id: "ap1-w2-008",
    type: "mcq",
    prompt: "Atropine produces its clinical effects by acting as a:",  // source: slide 10
    setup: "",
    ans: [
      { t: "Muscarinic receptor antagonist", ok: true },
      { t: "Alpha 1 adrenergic agonist", ok: false },
      { t: "Alpha 2 adrenergic agonist", ok: false },
      { t: "Nicotinic receptor agonist", ok: false },
    ],
    rationale: "Atropine is a muscarinic receptor antagonist that blocks acetylcholine at muscarinic receptors, producing tachycardia, bronchodilation, decreased secretions, and mydriasis. (B) describes phenylephrine (alpha 1 agonist). (C) describes dexmedetomidine (alpha 2 agonist). (D) is wrong because atropine does not activate nicotinic receptors. Pearl: Atropine is used perioperatively to treat symptomatic bradycardia, reduce secretions, and reverse muscarinic side effects of cholinesterase inhibitors.",
    scene: "pharmacology",
    sceneCfg: { label: "ANS DIVISIONS" },
    metadata: { topic: "ANS Divisions", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ANS PHYSIOLOGY — NEUROTRANSMITTER PATHWAYS  (slide 11)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w2-009",
    type: "mcq",
    prompt: "The neurotransmitter released by ALL preganglionic autonomic neurons (both sympathetic and parasympathetic) is:",  // source: slide 11
    setup: "",
    ans: [
      { t: "Norepinephrine", ok: false },
      { t: "Acetylcholine", ok: true },
      { t: "Dopamine", ok: false },
      { t: "Epinephrine", ok: false },
    ],
    rationale: "Both sympathetic and parasympathetic preganglionic neurons release acetylcholine, which activates nicotinic receptors in the autonomic ganglia. The two divisions diverge only at the postganglionic level. (A) is wrong because norepinephrine is the postganglionic sympathetic neurotransmitter. (C) is wrong because dopamine is a precursor to norepinephrine, not the ganglionic transmitter. (D) is wrong because epinephrine is primarily a hormone from the adrenal medulla. Pearl: This shared preganglionic transmitter means ganglionic blocking drugs (e.g., trimethaphan) inhibit both sympathetic and parasympathetic transmission simultaneously.",
    scene: "pharmacology",
    sceneCfg: { label: "ANS PHYSIOLOGY" },
    metadata: { topic: "ANS Physiology", priority: "high" },
  },

  {
    id: "ap1-w2-010",
    type: "mcq",
    prompt: "Preganglionic acetylcholine activates which receptor type in the autonomic ganglia?",  // source: slide 11
    setup: "",
    ans: [
      { t: "Muscarinic receptors", ok: false },
      { t: "Beta adrenergic receptors", ok: false },
      { t: "Nicotinic receptors", ok: true },
      { t: "Alpha adrenergic receptors", ok: false },
    ],
    rationale: "Acetylcholine released from preganglionic fibers activates nicotinic receptors (specifically the neuronal NN subtype) on postganglionic neuron cell bodies in autonomic ganglia. (A) is wrong because muscarinic receptors are the target of postganglionic parasympathetic fibers at end organs. (B) and (D) are wrong because adrenergic receptors bind norepinephrine and epinephrine, not acetylcholine. Pearl: Nicotinic ganglionic receptors differ pharmacologically from nicotinic receptors at the neuromuscular junction (NM subtype), which is why ganglion blockers do not cause skeletal muscle paralysis.",
    scene: "pharmacology",
    sceneCfg: { label: "ANS PHYSIOLOGY" },
    metadata: { topic: "ANS Physiology", priority: "high" },
  },

  {
    id: "ap1-w2-011",
    type: "mcq",
    prompt: "Postganglionic sympathetic nerve fibers are called adrenergic because they primarily release:",  // source: slide 11
    setup: "",
    ans: [
      { t: "Acetylcholine", ok: false },
      { t: "Norepinephrine", ok: true },
      { t: "Epinephrine", ok: false },
      { t: "Dopamine", ok: false },
    ],
    rationale: "Most postganglionic sympathetic neurons release norepinephrine as their neurotransmitter and are therefore called adrenergic fibers. (A) is wrong because acetylcholine is the postganglionic parasympathetic transmitter (cholinergic fibers). (C) is wrong because epinephrine is primarily released from the adrenal medulla into the bloodstream as a hormone. (D) is wrong because dopamine, while a norepinephrine precursor, is not the primary postganglionic sympathetic transmitter. Pearl: The distinction between adrenergic (sympathetic) and cholinergic (parasympathetic) postganglionic fibers is fundamental to understanding autonomic pharmacology.",
    scene: "pharmacology",
    sceneCfg: { label: "ANS PHYSIOLOGY" },
    metadata: { topic: "ANS Physiology", priority: "high" },
  },

  {
    id: "ap1-w2-012",
    type: "mcq",
    prompt: "Postganglionic parasympathetic nerve fibers are classified as cholinergic because they release:",  // source: slide 11
    setup: "",
    ans: [
      { t: "Norepinephrine at target organs", ok: false },
      { t: "Epinephrine at target organs", ok: false },
      { t: "Acetylcholine at target organs", ok: true },
      { t: "Dopamine at target organs", ok: false },
    ],
    rationale: "Postganglionic parasympathetic neurons release acetylcholine at the target organ, acting on muscarinic receptors. This is why they are termed cholinergic fibers. (A) is wrong because norepinephrine is the postganglionic sympathetic transmitter. (B) is wrong because epinephrine is a hormone from the adrenal medulla. (D) is wrong because dopamine is not the parasympathetic postganglionic transmitter. Pearl: Both pre and postganglionic parasympathetic neurons use acetylcholine, but they act on different receptor subtypes: nicotinic (ganglionic) and muscarinic (end organ).",
    scene: "pharmacology",
    sceneCfg: { label: "ANS PHYSIOLOGY" },
    metadata: { topic: "ANS Physiology", priority: "high" },
  },

  {
    id: "ap1-w2-013",
    type: "mcq",
    prompt: "An important exception to the rule that postganglionic sympathetic fibers release norepinephrine is that sympathetic nerves supplying which structure release acetylcholine instead?",  // source: slide 11
    setup: "",
    ans: [
      { t: "Cardiac muscle", ok: false },
      { t: "Sweat glands", ok: true },
      { t: "Bronchial smooth muscle", ok: false },
      { t: "Pupillary dilator muscle", ok: false },
    ],
    rationale: "Sympathetic nerves supplying sweat glands (and some blood vessels) release acetylcholine instead of norepinephrine, making them sympathetic cholinergic fibers. This is the notable exception to the general rule. (A) is wrong because sympathetic cardiac innervation is adrenergic. (C) is wrong because bronchial sympathetic innervation is adrenergic (beta 2). (D) is wrong because the pupillary dilator is innervated by adrenergic fibers. Pearl: This anatomic exception means that anticholinergic drugs like atropine can reduce sweating by blocking these sympathetic cholinergic fibers.",
    scene: "pharmacology",
    sceneCfg: { label: "ANS PHYSIOLOGY" },
    metadata: { topic: "ANS Physiology", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  NOREPINEPHRINE SYNTHESIS  (slides 12–13)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w2-014",
    type: "mcq",
    prompt: "The correct sequence for norepinephrine synthesis in sympathetic nerve endings is:",  // source: slide 12
    setup: "",
    ans: [
      { t: "Tyrosine → DOPA → Dopamine → Norepinephrine", ok: true },
      { t: "Dopamine → DOPA → Tyrosine → Norepinephrine", ok: false },
      { t: "Phenylalanine → Norepinephrine → Dopamine → DOPA", ok: false },
      { t: "DOPA → Tyrosine → Norepinephrine → Dopamine", ok: false },
    ],
    rationale: "Norepinephrine synthesis begins in the cytoplasm with tyrosine, which is converted to DOPA, then to dopamine. Dopamine enters the synaptic vesicle where dopamine beta hydroxylase converts it to norepinephrine. (B), (C), and (D) present the steps in incorrect order. Pearl: The rate limiting step is the conversion of tyrosine to DOPA by tyrosine hydroxylase. Understanding this pathway explains why drugs targeting specific enzymatic steps alter catecholamine levels.",
    scene: "pharmacology",
    sceneCfg: { label: "NE SYNTHESIS" },
    metadata: { topic: "Norepinephrine Synthesis", priority: "high" },
  },

  {
    id: "ap1-w2-015",
    type: "mcq",
    prompt: "The enzyme dopamine beta hydroxylase converts dopamine to norepinephrine. This final conversion step occurs:",  // source: slide 12
    setup: "",
    ans: [
      { t: "In the cytoplasm of the nerve terminal", ok: false },
      { t: "Inside the synaptic vesicle", ok: true },
      { t: "In the synaptic cleft after release", ok: false },
      { t: "In the postsynaptic cell", ok: false },
    ],
    rationale: "Dopamine is transported into the synaptic vesicle, where dopamine beta hydroxylase (located within the vesicle) converts it to norepinephrine. The earlier synthesis steps (tyrosine to DOPA to dopamine) occur in the cytoplasm. (A) is wrong because the cytoplasmic steps end at dopamine. (C) is wrong because synthesis is complete before release. (D) is wrong because conversion happens presynaptically. Pearl: Dopamine beta hydroxylase is essential for norepinephrine production; its altered activity is associated with Alzheimer disease, PTSD, and major depressive disorder.",
    scene: "pharmacology",
    sceneCfg: { label: "NE SYNTHESIS" },
    metadata: { topic: "Norepinephrine Synthesis", priority: "high" },
  },

  {
    id: "ap1-w2-016",
    type: "mcq",
    prompt: "Alpha methyldopa lowers blood pressure by a mechanism that involves:",  // source: slide 13
    setup: "",
    ans: [
      { t: "Direct blockade of peripheral alpha receptors", ok: false },
      { t: "A false transmitter that cuts central sympathetic outflow", ok: true },
      { t: "Inhibition of synaptic acetylcholinesterase", ok: false },
      { t: "Beta 2 receptor stimulation causing vasodilation", ok: false },
    ],
    rationale: "Alpha methyldopa enters the catecholamine synthesis pathway and is converted to alpha methylnorepinephrine, a false neurotransmitter. When released from nerve terminals, it acts as a central alpha 2 agonist, reducing sympathetic outflow and lowering blood pressure. (A) is wrong because the mechanism is central, not peripheral alpha blockade. (C) is wrong because methyldopa does not inhibit cholinesterase. (D) is wrong because it does not directly stimulate beta 2 receptors. Pearl: Alpha methyldopa is commonly used for hypertension in pregnancy because of its established safety profile for the fetus.",
    scene: "pharmacology",
    sceneCfg: { label: "NE SYNTHESIS" },
    metadata: { topic: "Norepinephrine Synthesis", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  NE STORAGE, RELEASE, AND TACHYPHYLAXIS  (slide 14)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w2-017",
    type: "mcq",
    prompt: "Norepinephrine is stored in the sympathetic nerve terminal within:",  // source: slide 14
    setup: "",
    ans: [
      { t: "Synaptic vesicles", ok: true },
      { t: "Mitochondria", ok: false },
      { t: "The nuclear envelope", ok: false },
      { t: "Free in the cytoplasm", ok: false },
    ],
    rationale: "Norepinephrine is stored in synaptic vesicles within the nerve terminal. An action potential triggers vesicle fusion with the membrane (exocytosis), releasing norepinephrine into the synaptic cleft. (B) is wrong because mitochondria produce ATP, not store neurotransmitters. (C) is wrong because the nuclear envelope is not a storage site. (D) is wrong because cytoplasmic norepinephrine is rapidly degraded by MAO; vesicular storage protects it. Pearl: The vesicular storage system allows sympathetic nerves to sustain norepinephrine release during prolonged stimulation.",
    scene: "pharmacology",
    sceneCfg: { label: "NE STORAGE AND RELEASE" },
    metadata: { topic: "Norepinephrine Storage", priority: "high" },
  },

  {
    id: "ap1-w2-018",
    type: "mcq",
    prompt: "Repeated doses of ephedrine (an indirect acting sympathomimetic) may produce a diminished pressor response. This phenomenon is called:",  // source: slide 14
    setup: "",
    ans: [
      { t: "Denervation hypersensitivity", ok: false },
      { t: "Tachyphylaxis", ok: true },
      { t: "Receptor upregulation", ok: false },
      { t: "Competitive antagonism", ok: false },
    ],
    rationale: "Ephedrine causes norepinephrine release from sympathetic nerve terminals. With repeated doses, the releasable norepinephrine stores become depleted, producing a diminished response (tachyphylaxis). This is due to neurotransmitter depletion rather than receptor failure. (A) is wrong because denervation hypersensitivity is an increased (not decreased) response after chronic denervation. (C) is wrong because upregulation increases sensitivity. (D) is wrong because competitive antagonism involves receptor blockade. Pearl: When ephedrine tachyphylaxis occurs intraoperatively, switching to a direct acting vasopressor like phenylephrine bypasses the depleted stores.",
    scene: "pharmacology",
    sceneCfg: { label: "NE STORAGE AND RELEASE" },
    metadata: { topic: "Norepinephrine Storage", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  NE TERMINATION AND REUPTAKE  (slides 15–16)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w2-019",
    type: "mcq",
    prompt: "Norepinephrine action at the synapse is terminated by all of the following mechanisms EXCEPT:",  // source: slide 15
    setup: "",
    ans: [
      { t: "Reuptake into the presynaptic nerve ending", ok: false },
      { t: "Metabolism by monoamine oxidase (MAO)", ok: false },
      { t: "Hydrolysis by acetylcholinesterase", ok: true },
      { t: "Metabolism by catechol O methyltransferase (COMT)", ok: false },
    ],
    rationale: "Norepinephrine action is terminated by reuptake into the nerve terminal, diffusion away from receptors, and enzymatic metabolism by MAO and COMT. Acetylcholinesterase hydrolyzes acetylcholine, not norepinephrine. (A) is the most important mechanism (accounts for about 80% of NE removal). (B) and (D) are enzymatic degradation pathways for catecholamines. Pearl: The distinction between NE termination (reuptake, MAO, COMT) and ACh termination (acetylcholinesterase hydrolysis) is clinically important because drugs targeting each pathway have very different effects.",
    scene: "pharmacology",
    sceneCfg: { label: "NE TERMINATION" },
    metadata: { topic: "Norepinephrine Termination", priority: "high" },
  },

  {
    id: "ap1-w2-020",
    type: "mcq",
    prompt: "The single most important mechanism for terminating norepinephrine action at the synapse is:",  // source: slide 16
    setup: "",
    ans: [
      { t: "Enzymatic degradation by MAO", ok: false },
      { t: "Enzymatic degradation by COMT", ok: false },
      { t: "Reuptake into the presynaptic nerve ending", ok: true },
      { t: "Diffusion into the bloodstream", ok: false },
    ],
    rationale: "Reuptake (uptake 1) into the presynaptic nerve terminal accounts for approximately 80% of norepinephrine removal from the synapse. The recaptured norepinephrine is recycled back into synaptic vesicles for reuse. (A) and (B) are secondary mechanisms; MAO degrades cytoplasmic NE and COMT acts on extraneuronal NE. (D) contributes minimally to termination. Pearl: The dominance of reuptake explains why drugs that block this transporter (cocaine, tricyclic antidepressants) produce such potent sympathomimetic effects.",
    scene: "pharmacology",
    sceneCfg: { label: "NE TERMINATION" },
    metadata: { topic: "Norepinephrine Termination", priority: "high" },
  },

  {
    id: "ap1-w2-021",
    type: "mcq",
    prompt: "Approximately what percentage of released norepinephrine is reabsorbed into the presynaptic nerve terminal?",  // source: slide 16
    setup: "",
    ans: [
      { t: "20%", ok: false },
      { t: "50%", ok: false },
      { t: "80%", ok: true },
      { t: "99%", ok: false },
    ],
    rationale: "Up to 80% of released norepinephrine is reabsorbed into the presynaptic nerve ending via the norepinephrine transporter. This efficient reuptake allows recycling, storage, and reuse of the neurotransmitter. (A) and (B) are too low. (D) is too high; some NE is metabolized or diffuses away. Pearl: The reuptake system uses two sequential transport mechanisms: one moves NE from the cleft into the cytoplasm, and a second moves it from the cytoplasm back into synaptic vesicles.",
    scene: "pharmacology",
    sceneCfg: { label: "NE TERMINATION" },
    metadata: { topic: "Norepinephrine Termination", priority: "high" },
  },

  {
    id: "ap1-w2-022",
    type: "mcq",
    prompt: "Cocaine produces its sympathomimetic cardiovascular effects primarily by:",  // source: slide 16
    setup: "",
    ans: [
      { t: "Direct stimulation of adrenergic receptors", ok: false },
      { t: "Blocking norepinephrine reuptake at the synapse", ok: true },
      { t: "Inhibition of synaptic monoamine oxidase", ok: false },
      { t: "Releasing epinephrine from the adrenal gland", ok: false },
    ],
    rationale: "Cocaine blocks the norepinephrine transporter, preventing reuptake of norepinephrine into the presynaptic nerve terminal. This increases norepinephrine concentration at postsynaptic receptors, producing tachycardia, hypertension, and vasoconstriction. (A) is wrong because cocaine acts indirectly by preventing reuptake, not by direct receptor activation. (C) is wrong because MAO inhibition is the mechanism of MAOIs, not cocaine. (D) is wrong because cocaine does not directly trigger adrenal medullary release. Pearl: Tricyclic antidepressants share a similar mechanism, blocking norepinephrine reuptake, which explains their cardiovascular side effects.",
    scene: "pharmacology",
    sceneCfg: { label: "NE TERMINATION" },
    metadata: { topic: "Norepinephrine Termination", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ACETYLCHOLINE  (slide 17)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w2-023",
    type: "mcq",
    prompt: "Acetylcholine is synthesized in parasympathetic nerve endings by the enzyme:",  // source: slide 17
    setup: "",
    ans: [
      { t: "Acetylcholinesterase", ok: false },
      { t: "Choline acetyltransferase", ok: true },
      { t: "Dopamine beta hydroxylase", ok: false },
      { t: "Catechol O methyltransferase", ok: false },
    ],
    rationale: "Choline acetyltransferase (ChAT) catalyzes the synthesis of acetylcholine by combining choline with acetyl coenzyme A. (A) is wrong because acetylcholinesterase is the enzyme that DEGRADES acetylcholine (the opposite function). (C) is wrong because dopamine beta hydroxylase converts dopamine to norepinephrine. (D) is wrong because COMT metabolizes catecholamines. Pearl: Choline acetyltransferase is the rate limiting factor in ACh synthesis; the availability of choline (taken up by the nerve terminal from the extracellular space) is the key substrate.",
    scene: "pharmacology",
    sceneCfg: { label: "ACETYLCHOLINE" },
    metadata: { topic: "Acetylcholine", priority: "high" },
  },

  {
    id: "ap1-w2-024",
    type: "mcq",
    prompt: "The two substrates required for acetylcholine synthesis are:",  // source: slide 17
    setup: "",
    ans: [
      { t: "Tyrosine and DOPA", ok: false },
      { t: "Choline and acetyl coenzyme A", ok: true },
      { t: "Dopamine and norepinephrine", ok: false },
      { t: "Acetate and coenzyme Q", ok: false },
    ],
    rationale: "Acetylcholine is synthesized from choline and acetyl coenzyme A by the enzyme choline acetyltransferase. After synthesis, ACh is stored in synaptic vesicles until released by an action potential. (A) is wrong because tyrosine and DOPA are precursors in the catecholamine synthesis pathway. (C) is wrong because dopamine and norepinephrine are catecholamines. (D) is wrong because coenzyme Q is involved in the electron transport chain, not ACh synthesis. Pearl: Choline is recycled from ACh hydrolysis products and actively transported back into the nerve terminal, conserving this essential substrate.",
    scene: "pharmacology",
    sceneCfg: { label: "ACETYLCHOLINE" },
    metadata: { topic: "Acetylcholine", priority: "high" },
  },

  {
    id: "ap1-w2-025",
    type: "mcq",
    prompt: "Acetylcholine action is terminated rapidly because it is hydrolyzed by:",  // source: slide 17
    setup: "",
    ans: [
      { t: "Monoamine oxidase", ok: false },
      { t: "Catechol O methyltransferase", ok: false },
      { t: "Acetylcholinesterase", ok: true },
      { t: "Dopamine beta hydroxylase", ok: false },
    ],
    rationale: "Acetylcholinesterase (AChE) rapidly hydrolyzes acetylcholine into choline and acetate at the synapse. This enzymatic hydrolysis is extremely fast, allowing brief, precisely controlled cholinergic transmission. (A) is wrong because MAO metabolizes catecholamines. (B) is wrong because COMT also metabolizes catecholamines. (D) is wrong because dopamine beta hydroxylase synthesizes norepinephrine. Pearl: Cholinesterase inhibitors (neostigmine, edrophonium) block AChE, allowing ACh to accumulate and prolong its action; this is the basis for reversal of nondepolarizing neuromuscular blockade.",
    scene: "pharmacology",
    sceneCfg: { label: "ACETYLCHOLINE" },
    metadata: { topic: "Acetylcholine", priority: "high" },
  },

  {
    id: "ap1-w2-026",
    type: "mcq",
    prompt: "Hydrolysis of acetylcholine by acetylcholinesterase produces which two products?",  // source: slide 17
    setup: "",
    ans: [
      { t: "Choline and acetate", ok: true },
      { t: "Dopamine and DOPA", ok: false },
      { t: "Norepinephrine and epinephrine", ok: false },
      { t: "Tyrosine and acetyl coenzyme A", ok: false },
    ],
    rationale: "Acetylcholinesterase cleaves acetylcholine into choline and acetate. The choline is then actively recycled back into the presynaptic nerve ending to synthesize new acetylcholine, conserving this essential substrate. (B) is wrong because dopamine and DOPA are catecholamine pathway intermediates. (C) is wrong because NE and epi are catecholamines. (D) is wrong because tyrosine is a catecholamine precursor. Pearl: The recycling of choline is a critical efficiency mechanism; without it, the rate of ACh production would be limited by de novo choline synthesis.",
    scene: "pharmacology",
    sceneCfg: { label: "ACETYLCHOLINE" },
    metadata: { topic: "Acetylcholine", priority: "high" },
  },

  {
    id: "ap1-w2-027",
    type: "mcq",
    prompt: "Plasma cholinesterase (pseudocholinesterase) is clinically significant in anesthesia because it metabolizes:",  // source: slide 17
    setup: "",
    ans: [
      { t: "Norepinephrine and epinephrine", ok: false },
      { t: "Propofol and thiopental", ok: false },
      { t: "Succinylcholine and mivacurium", ok: true },
      { t: "Fentanyl and morphine", ok: false },
    ],
    rationale: "Plasma cholinesterase (butyrylcholinesterase) metabolizes succinylcholine and mivacurium. Deficiency or genetic variants of this enzyme can dramatically prolong the neuromuscular block produced by these drugs. (A) is wrong because NE and epi are metabolized by MAO and COMT. (B) is wrong because propofol and thiopental are metabolized by hepatic enzymes. (D) is wrong because fentanyl is metabolized by CYP3A4 and morphine by glucuronidation. Pearl: The dibucaine number identifies atypical pseudocholinesterase variants; patients with low dibucaine numbers may experience prolonged paralysis after succinylcholine.",
    scene: "pharmacology",
    sceneCfg: { label: "ACETYLCHOLINE" },
    metadata: { topic: "Acetylcholine", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  AUTONOMIC TONE  (slide 18)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w2-028",
    type: "mcq",
    prompt: "Sympathetic tone normally keeps systemic blood vessels at approximately what degree of constriction?",  // source: slide 18
    setup: "",
    ans: [
      { t: "10% constricted", ok: false },
      { t: "25% constricted", ok: false },
      { t: "50% constricted", ok: true },
      { t: "90% constricted", ok: false },
    ],
    rationale: "Sympathetic vascular tone normally maintains blood vessels at approximately 50% constriction. This baseline tone allows the body to increase or decrease systemic vascular resistance by adjusting sympathetic activity in either direction. (A) and (B) are too low. (D) is too high; vessels at 90% constriction would impede tissue perfusion. Pearl: Spinal or epidural anesthesia that blocks sympathetic tone produces vasodilation and hypotension because this baseline constriction is lost below the block level.",
    scene: "pharmacology",
    sceneCfg: { label: "AUTONOMIC TONE" },
    metadata: { topic: "Autonomic Tone", priority: "high" },
  },

  {
    id: "ap1-w2-029",
    type: "mcq",
    prompt: "The concept of residual autonomic tone means that the sympathetic and parasympathetic nervous systems are:",  // source: slide 18
    setup: "",
    ans: [
      { t: "Active only during periods of stress or sleep", ok: false },
      { t: "Continuously active at a baseline resting level", ok: true },
      { t: "Silent at rest and switched on only by stimuli", ok: false },
      { t: "Active in alternating cycles across each day", ok: false },
    ],
    rationale: "Both the sympathetic and parasympathetic nervous systems maintain continuous baseline activity (autonomic tone) that allows fine regulation of organ function. Changes in tone in either direction adjust the balance. (A) is wrong because tone is continuous, not situational. (C) is wrong because the systems are never silent at rest. (D) is wrong because autonomic activity is continuous, not cyclic. Pearl: This continuous tone explains why drugs that block one division (e.g., beta blockers) unmask the opposing division's effect, and why autonomic failure produces such devastating hemodynamic instability.",
    scene: "pharmacology",
    sceneCfg: { label: "AUTONOMIC TONE" },
    metadata: { topic: "Autonomic Tone", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  AUTONOMIC DYSFUNCTION  (slides 19–21)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w2-030",
    type: "mcq",
    prompt: "Which of the following is a recognized cause of autonomic nervous system dysfunction?",  // source: slide 19, slide 21
    setup: "",
    ans: [
      { t: "Aging, diabetes mellitus, and autonomic neuropathy", ok: true },
      { t: "Young age, hyperthyroidism, and muscle hypertrophy", ok: false },
      { t: "Elevated hemoglobin and polycythemia", ok: false },
      { t: "Chronic exercise and athletic conditioning", ok: false },
    ],
    rationale: "Aging, diabetes mellitus, and autonomic neuropathy are recognized causes of autonomic dysfunction that can impair compensatory cardiovascular and thermoregulatory responses. (B) is wrong because young age is protective, and hyperthyroidism increases sympathetic activity rather than causing dysfunction. (C) is wrong because elevated hemoglobin does not cause autonomic dysfunction. (D) is wrong because chronic exercise enhances autonomic function. Pearl: Patients with autonomic dysfunction are at increased risk for hemodynamic instability, hypotension, and cardiac complications during anesthesia.",
    scene: "pharmacology",
    sceneCfg: { label: "AUTONOMIC DYSFUNCTION" },
    metadata: { topic: "Autonomic Dysfunction", priority: "high" },
  },

  {
    id: "ap1-w2-031",
    type: "mcq",
    prompt: "Heart rate variability (HRV) on an ECG is used to evaluate autonomic function because:",  // source: slide 20
    setup: "",
    ans: [
      { t: "Higher HRV usually reflects healthy vagal tone", ok: true },
      { t: "Higher HRV reflects sympathetic dominance", ok: false },
      { t: "Lower HRV reflects optimal vagal tone", ok: false },
      { t: "HRV measures plasma catecholamines directly", ok: false },
    ],
    rationale: "Heart rate variability reflects the dynamic interplay between sympathetic and parasympathetic inputs to the SA node. Greater beat to beat variability generally indicates healthy parasympathetic (vagal) activity, while reduced HRV may indicate sympathetic dominance or autonomic neuropathy. (B) is wrong because the relationship is reversed. (C) is wrong because low HRV suggests impaired vagal tone. (D) is wrong because HRV is an indirect measure, not a direct catecholamine assay. Pearl: Reduced HRV in diabetic patients is an early marker of cardiac autonomic neuropathy and independently predicts increased cardiovascular morbidity.",
    scene: "pharmacology",
    sceneCfg: { label: "AUTONOMIC DYSFUNCTION" },
    metadata: { topic: "Autonomic Dysfunction", priority: "high" },
  },

  {
    id: "ap1-w2-032",
    type: "mcq",
    prompt: "The preferred method for diagnosing pheochromocytoma is:",  // source: slide 20
    setup: "",
    ans: [
      { t: "A single random plasma catecholamine level", ok: false },
      { t: "A 24 hour urine catecholamine and metanephrine test", ok: true },
      { t: "Beat to beat heart rate variability analysis", ok: false },
      { t: "A single morning plasma cortisol level", ok: false },
    ],
    rationale: "Plasma catecholamine levels vary significantly with stress and activity, making single measurements unreliable. A 24 hour urine collection for catecholamines and metanephrines provides a more accurate integrated assessment of catecholamine production and is the preferred diagnostic method for pheochromocytoma. (A) is unreliable due to moment to moment variation. (C) assesses autonomic function but does not diagnose the tumor. (D) measures adrenocortical function, not catecholamine excess. Pearl: Fractionated plasma free metanephrines are now also widely used as a highly sensitive screening test.",
    scene: "pharmacology",
    sceneCfg: { label: "AUTONOMIC DYSFUNCTION" },
    metadata: { topic: "Autonomic Dysfunction", priority: "high" },
  },

  {
    id: "ap1-w2-033",
    type: "mcq",
    prompt: "Diabetic autonomic neuropathy may present with all of the following EXCEPT:",  // source: slide 21
    setup: "",
    ans: [
      { t: "Gastroparesis with delayed gastric emptying", ok: false },
      { t: "Orthostatic hypotension on standing up", ok: false },
      { t: "Abnormal patterns of sweating onset", ok: false },
      { t: "Strong hypertensive response to blood loss", ok: true },
    ],
    rationale: "Diabetic autonomic neuropathy impairs the body's compensatory reflexes, producing gastroparesis, postural hypotension, and sweating abnormalities. It does NOT cause an exaggerated hypertensive response; rather, it impairs compensatory responses, increasing the risk of hemodynamic instability. (A), (B), and (C) are well recognized manifestations. Pearl: Gastroparesis in diabetic patients increases aspiration risk during induction of anesthesia and should prompt consideration of rapid sequence intubation.",
    scene: "pharmacology",
    sceneCfg: { label: "AUTONOMIC DYSFUNCTION" },
    metadata: { topic: "Autonomic Dysfunction", priority: "high" },
  },

  {
    id: "ap1-w2-034",
    type: "mcq",
    prompt: "Denervation hypersensitivity refers to the phenomenon in which prolonged loss of nerve input to a tissue causes:",  // source: slide 21
    setup: "",
    ans: [
      { t: "Fewer receptors and weaker responses to transmitters", ok: false },
      { t: "More receptors and exaggerated responses to catecholamines", ok: true },
      { t: "Total loss of tissue responsiveness to every drug", ok: false },
      { t: "Compensatory parasympathetic reinnervation of tissue", ok: false },
    ],
    rationale: "When sympathetic innervation is lost for a prolonged period, the denervated tissue upregulates receptor density, resulting in denervation hypersensitivity with exaggerated responses to circulating catecholamines. (A) describes the opposite (downregulation). (C) is wrong because the tissue becomes more responsive, not less. (D) is wrong because parasympathetic nerves do not compensatorily innervate sympathetic targets. Pearl: This principle explains why transplanted (denervated) hearts show exaggerated sensitivity to exogenous catecholamines and why spinal cord injury patients develop autonomic hyperreflexia.",
    scene: "pharmacology",
    sceneCfg: { label: "AUTONOMIC DYSFUNCTION" },
    metadata: { topic: "Autonomic Dysfunction", priority: "high" },
  },

  {
    id: "ap1-w2-035",
    type: "mcq",
    prompt: "Preoperative management of a patient with pheochromocytoma requires pharmacologic control with:",  // source: slide 21
    setup: "",
    ans: [
      { t: "Beta blockade started first, then alpha blockade", ok: false },
      { t: "Alpha blockade started first, then beta blockade", ok: true },
      { t: "Cholinesterase inhibitor therapy used alone", ok: false },
      { t: "Calcium channel blocker therapy used alone", ok: false },
    ],
    rationale: "Pheochromocytoma causes excessive catecholamine release producing severe hypertension and tachycardia. Preoperative management requires alpha blockade (typically phenoxybenzamine or doxazosin) to control hypertension, followed by beta blockade once alpha blockade is established. (A) is wrong because initiating beta blockade first can cause unopposed alpha stimulation and hypertensive crisis. (C) is wrong because cholinesterase inhibitors do not address catecholamine excess. (D) is wrong because calcium channel blockers may be adjunctive but are not the primary treatment. Pearl: Alpha blockade MUST precede beta blockade to prevent unopposed alpha mediated vasoconstriction.",
    scene: "pharmacology",
    sceneCfg: { label: "AUTONOMIC DYSFUNCTION" },
    metadata: { topic: "Autonomic Dysfunction", priority: "high" },
  },

  {
    id: "ap1-w2-036",
    type: "mcq",
    prompt: "Elderly patients may have impaired cardiovascular responses to catecholamines during anesthesia. This is primarily due to:",  // source: slide 21
    setup: "",
    ans: [
      { t: "Excessive catecholamine production at rest", ok: false },
      { t: "Reduced catecholamine response and reserve", ok: true },
      { t: "Enhanced resting parasympathetic outflow tone", ok: false },
      { t: "Increased adrenal medullary tissue mass", ok: false },
    ],
    rationale: "Aging produces decreased responsiveness to catecholamines and reduced autonomic reserve, impairing the cardiovascular compensatory mechanisms. Elderly patients cannot mount the same hemodynamic response to stress or vasopressor administration. (A) is wrong because the issue is impaired responsiveness, not overproduction. (C) is wrong because enhanced parasympathetic tone does not explain reduced catecholamine responsiveness. (D) is wrong because adrenal medullary mass decreases with aging. Pearl: The combination of reduced autonomic reserve and decreased baroreceptor sensitivity in elderly patients explains their vulnerability to hemodynamic instability during anesthesia.",
    scene: "pharmacology",
    sceneCfg: { label: "AUTONOMIC DYSFUNCTION" },
    metadata: { topic: "Autonomic Dysfunction", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ADRENAL MEDULLA  (slides 22–23)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w2-037",
    type: "mcq",
    prompt: "The adrenal medulla is innervated directly by which type of nerve fiber?",  // source: slide 22
    setup: "",
    ans: [
      { t: "Postganglionic sympathetic fibers", ok: false },
      { t: "Preganglionic sympathetic fibers", ok: true },
      { t: "Postganglionic parasympathetic fibers", ok: false },
      { t: "Somatic motor fibers", ok: false },
    ],
    rationale: "The adrenal medulla is innervated directly by preganglionic sympathetic fibers, which is unique because most sympathetic targets receive postganglionic innervation. The adrenal medullary cells function as modified postganglionic neurons. (A) is wrong because there is no postganglionic neuron interposed. (C) is wrong because the adrenal medulla does not receive parasympathetic innervation. (D) is wrong because somatic motor fibers innervate skeletal muscle. Pearl: This direct preganglionic innervation explains why the adrenal medulla is described as a modified sympathetic ganglion.",
    scene: "pharmacology",
    sceneCfg: { label: "ADRENAL MEDULLA" },
    metadata: { topic: "Adrenal Medulla", priority: "high" },
  },

  {
    id: "ap1-w2-038",
    type: "mcq",
    prompt: "The adrenal medulla functions as a modified sympathetic ganglion because:",  // source: slide 22
    setup: "",
    ans: [
      { t: "Chromaffin cells get preganglionic input and release catecholamines to blood", ok: true },
      { t: "It produces cortisol in direct response to pituitary ACTH release", ok: false },
      { t: "It is innervated only by direct vagal parasympathetic fibers", ok: false },
      { t: "It secretes acetylcholine as its primary circulating hormone", ok: false },
    ],
    rationale: "The adrenal medulla receives preganglionic sympathetic fibers (releasing ACh at nicotinic receptors), and its chromaffin cells release catecholamines (primarily epinephrine) directly into the bloodstream rather than across a synapse. (B) is wrong because cortisol production is an adrenal cortex function. (C) is wrong because the adrenal medulla receives sympathetic, not parasympathetic, innervation. (D) is wrong because the adrenal medulla secretes catecholamines, not acetylcholine. Pearl: The adrenal medulla effectively replaces the missing postganglionic neuron, with the bloodstream serving as the distribution pathway instead of a synapse.",
    scene: "pharmacology",
    sceneCfg: { label: "ADRENAL MEDULLA" },
    metadata: { topic: "Adrenal Medulla", priority: "high" },
  },

  {
    id: "ap1-w2-039",
    type: "mcq",
    prompt: "The adrenal medulla releases approximately what percentage of its catecholamine output as epinephrine?",  // source: slide 22
    setup: "",
    ans: [
      { t: "20%", ok: false },
      { t: "50%", ok: false },
      { t: "80%", ok: true },
      { t: "100%", ok: false },
    ],
    rationale: "The adrenal medulla releases approximately 80% epinephrine and the remainder as norepinephrine. This makes epinephrine the dominant circulating catecholamine released during the stress response. (A) and (B) are too low. (D) is wrong because norepinephrine is also released. Pearl: The 80:20 ratio of epinephrine to norepinephrine output from the adrenal medulla is maintained by cortisol's induction of PNMT, the enzyme that converts norepinephrine to epinephrine.",
    scene: "pharmacology",
    sceneCfg: { label: "ADRENAL MEDULLA" },
    metadata: { topic: "Adrenal Medulla", priority: "high" },
  },

  {
    id: "ap1-w2-040",
    type: "mcq",
    prompt: "The enzyme phenylethanolamine N methyltransferase (PNMT) is responsible for converting:",  // source: slide 22
    setup: "",
    ans: [
      { t: "Tyrosine to DOPA", ok: false },
      { t: "Dopamine to norepinephrine", ok: false },
      { t: "Norepinephrine to epinephrine", ok: true },
      { t: "Epinephrine to metanephrine", ok: false },
    ],
    rationale: "PNMT catalyzes the N methylation of norepinephrine to produce epinephrine. This enzyme is concentrated in the adrenal medulla, which is why epinephrine is primarily an adrenal medullary hormone rather than a typical postganglionic sympathetic transmitter. (A) is wrong because tyrosine to DOPA is catalyzed by tyrosine hydroxylase. (B) is wrong because dopamine to NE is catalyzed by dopamine beta hydroxylase. (D) is wrong because epinephrine to metanephrine is catalyzed by COMT. Pearl: Cortisol from the adjacent adrenal cortex upregulates PNMT activity, linking the stress response (HPA axis) to increased epinephrine production.",
    scene: "pharmacology",
    sceneCfg: { label: "ADRENAL MEDULLA" },
    metadata: { topic: "Adrenal Medulla", priority: "high" },
  },

  {
    id: "ap1-w2-041",
    type: "mcq",
    prompt: "Cortisol increases adrenal medullary epinephrine production by:",  // source: slide 22
    setup: "",
    ans: [
      { t: "Increasing the activity of the PNMT enzyme", ok: true },
      { t: "Stimulating nicotinic receptors on chromaffin cells", ok: false },
      { t: "Blocking norepinephrine reuptake in the adrenal", ok: false },
      { t: "Inhibiting monoamine oxidase in the medulla", ok: false },
    ],
    rationale: "Cortisol released from the adrenal cortex directly increases PNMT activity in the adjacent medulla, promoting the conversion of norepinephrine to epinephrine. Stress increases glucocorticoid release, which amplifies epinephrine synthesis. (B) is wrong because cortisol does not activate nicotinic receptors. (C) is wrong because cortisol does not block NE reuptake. (D) is wrong because cortisol does not inhibit MAO. Pearl: The anatomic proximity of adrenal cortex and medulla has functional significance: high local cortisol concentrations in the portal blood flowing from cortex to medulla are essential for maintaining PNMT activity.",
    scene: "pharmacology",
    sceneCfg: { label: "ADRENAL MEDULLA" },
    metadata: { topic: "Adrenal Medulla", priority: "high" },
  },

  {
    id: "ap1-w2-042",
    type: "mcq",
    prompt: "Catecholamine release from the adrenal medulla is triggered when preganglionic fibers release acetylcholine, which activates:",  // source: slide 22
    setup: "",
    ans: [
      { t: "Muscarinic receptors located on chromaffin cells", ok: false },
      { t: "Beta adrenergic receptors on chromaffin cells", ok: false },
      { t: "Nicotinic receptors, driving calcium influx and exocytosis", ok: true },
      { t: "GABA receptors located on chromaffin cells", ok: false },
    ],
    rationale: "Preganglionic sympathetic fibers release acetylcholine that activates nicotinic receptors on adrenal medullary chromaffin cells. This triggers calcium influx, which causes exocytosis of catecholamine containing vesicles into the bloodstream. (A) is wrong because the ganglionic type receptor is nicotinic, not muscarinic. (B) is wrong because beta adrenergic receptors are not the trigger. (D) is wrong because GABA receptors are not involved. Pearl: This nicotinic receptor mediated release mechanism is the same principle that operates at all autonomic ganglia; the adrenal medulla simply releases hormones into the blood rather than transmitter across a synapse.",
    scene: "pharmacology",
    sceneCfg: { label: "ADRENAL MEDULLA" },
    metadata: { topic: "Adrenal Medulla", priority: "high" },
  },

  {
    id: "ap1-w2-043",
    type: "mcq",
    prompt: "Compared to norepinephrine, epinephrine is distinguished by its ability to produce:",  // source: slide 23
    setup: "",
    ans: [
      { t: "Stronger cardiac drive plus low dose beta 2 muscle vasodilation", ok: true },
      { t: "More potent vasoconstriction with no cardiac effect", ok: false },
      { t: "Responses mediated only through alpha receptors", ok: false },
      { t: "A markedly longer duration than norepinephrine", ok: false },
    ],
    rationale: "Epinephrine produces stronger cardiac stimulation (beta 1), greater metabolic effects, and skeletal muscle vasodilation at low doses through beta 2 receptor activation. Norepinephrine primarily causes vasoconstriction and cardiac stimulation but lacks significant beta 2 mediated vasodilation. (B) is wrong because epinephrine has potent cardiac effects. (C) is wrong because epinephrine activates both alpha and beta receptors. (D) is wrong because both are metabolized by COMT and MAO with similar durations (~10 to 30 seconds for circulating effects). Pearl: This beta 2 vasodilatory effect of epinephrine at low doses explains why low dose epinephrine infusions can decrease mean arterial pressure despite increasing cardiac output.",
    scene: "pharmacology",
    sceneCfg: { label: "ADRENAL MEDULLA" },
    metadata: { topic: "Adrenal Medulla", priority: "high" },
  },

  {
    id: "ap1-w2-044",
    type: "mcq",
    prompt: "Circulating catecholamines released from the adrenal medulla are metabolized by:",  // source: slide 23
    setup: "",
    ans: [
      { t: "Acetylcholinesterase", ok: false },
      { t: "COMT and MAO", ok: true },
      { t: "Plasma cholinesterase", ok: false },
      { t: "Dopamine beta hydroxylase", ok: false },
    ],
    rationale: "Circulating epinephrine and norepinephrine are metabolized by catechol O methyltransferase (COMT) and monoamine oxidase (MAO), with a circulating duration of approximately 10 to 30 seconds. (A) is wrong because acetylcholinesterase metabolizes acetylcholine. (C) is wrong because plasma cholinesterase metabolizes succinylcholine and mivacurium. (D) is wrong because dopamine beta hydroxylase is a synthetic enzyme, not a degradative one. Pearl: The metabolic products (metanephrines and vanillylmandelic acid) are measured in urine to diagnose catecholamine excess states such as pheochromocytoma.",
    scene: "pharmacology",
    sceneCfg: { label: "ADRENAL MEDULLA" },
    metadata: { topic: "Adrenal Medulla", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  THERMOREGULATION  (slides 24–30)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w2-045",
    type: "mcq",
    prompt: "Normal core body temperature is maintained within the range of:",  // source: slide 24
    setup: "",
    ans: [
      { t: "34.0°C to 35.5°C", ok: false },
      { t: "36.0°C to 37.5°C", ok: true },
      { t: "38.0°C to 39.5°C", ok: false },
      { t: "35.0°C to 38.5°C", ok: false },
    ],
    rationale: "Normal body temperature is maintained between 36°C and 37.5°C through thermoregulatory mechanisms controlled by the hypothalamus. (A) describes hypothermia. (C) describes fever. (D) is too broad a range for normal thermoregulation. Pearl: In the operating room, anesthetized patients are especially prone to heat loss and can rapidly drift below the normal range, making temperature monitoring essential.",
    scene: "pharmacology",
    sceneCfg: { label: "THERMOREGULATION" },
    metadata: { topic: "Thermoregulation", priority: "high" },
  },

  {
    id: "ap1-w2-046",
    type: "mcq",
    prompt: "The primary thermoregulatory center in the body is the:",  // source: slide 25
    setup: "",
    ans: [
      { t: "Cerebral cortex", ok: false },
      { t: "Hypothalamus", ok: true },
      { t: "Thalamus", ok: false },
      { t: "Medulla oblongata", ok: false },
    ],
    rationale: "The hypothalamus is the primary thermoregulatory center, integrating temperature information from thermoreceptors in the skin, spinal cord, and deep tissues to coordinate heat production and heat loss responses. (A) is wrong because the cerebral cortex handles conscious processes. (C) is wrong because the thalamus is a sensory relay center. (D) is wrong because the medulla controls cardiovascular and respiratory centers. Pearl: General anesthesia impairs hypothalamic thermoregulation by widening the interthreshold range (the temperature range over which no active responses occur).",
    scene: "pharmacology",
    sceneCfg: { label: "THERMOREGULATION" },
    metadata: { topic: "Thermoregulation", priority: "high" },
  },

  {
    id: "ap1-w2-047",
    type: "mcq",
    prompt: "Heat is lost from the body through which four mechanisms?",  // source: slide 24
    setup: "",
    ans: [
      { t: "Radiation, conduction, convection, and evaporation", ok: true },
      { t: "Shivering, sweating, vasodilation, and piloerection", ok: false },
      { t: "Filtration, secretion, reabsorption, and excretion", ok: false },
      { t: "Oxidation, reduction, hydrolysis, and conjugation", ok: false },
    ],
    rationale: "The four mechanisms of heat loss are radiation (electromagnetic energy transfer to cooler surroundings), conduction (direct contact with cooler surfaces), convection (heat transfer via air or fluid currents), and evaporation (heat consumed as water vaporizes from skin and respiratory tract). (B) describes thermoregulatory responses, not heat loss mechanisms. (C) describes renal processes. (D) describes drug metabolism reactions. Pearl: In the operating room, radiation is the largest source of heat loss, which is why forced air warming blankets (which reduce the radiant gradient) are the most effective warming strategy.",
    scene: "pharmacology",
    sceneCfg: { label: "THERMOREGULATION" },
    metadata: { topic: "Thermoregulation", priority: "high" },
  },

  {
    id: "ap1-w2-048",
    type: "mcq",
    prompt: "The body's responses to cold exposure include all of the following EXCEPT:",  // source: slide 25
    setup: "",
    ans: [
      { t: "Peripheral vasoconstriction", ok: false },
      { t: "Shivering", ok: false },
      { t: "Nonshivering thermogenesis", ok: false },
      { t: "Peripheral vasodilation", ok: true },
    ],
    rationale: "Cold responses include vasoconstriction (to reduce heat loss from the skin), piloerection, shivering (to generate heat via muscle contraction), and nonshivering thermogenesis (heat from brown fat). Peripheral vasodilation is a heat DISSIPATION response triggered by warmth, not cold. (A), (B), and (C) are correct cold responses. Pearl: General anesthesia abolishes these protective cold responses, leaving patients vulnerable to progressive hypothermia.",
    scene: "pharmacology",
    sceneCfg: { label: "THERMOREGULATION" },
    metadata: { topic: "Thermoregulation", priority: "high" },
  },

  {
    id: "ap1-w2-049",
    type: "mcq",
    prompt: "Nonshivering thermogenesis produces heat through metabolic activity in:",  // source: slide 26
    setup: "",
    ans: [
      { t: "White adipose tissue acting through lipolysis", ok: false },
      { t: "Brown adipose tissue acting through UCP 1", ok: true },
      { t: "Skeletal muscle through repeated contraction", ok: false },
      { t: "The liver acting through gluconeogenesis", ok: false },
    ],
    rationale: "Nonshivering thermogenesis occurs in brown adipose tissue, stimulated by the sympathetic nervous system and catecholamines acting through beta adrenergic receptors. UCP 1 (uncoupling protein 1) in brown fat mitochondria uncouples oxidative phosphorylation, generating heat instead of ATP. (A) is wrong because white fat does not express UCP 1. (C) describes shivering, not nonshivering thermogenesis. (D) is wrong because hepatic gluconeogenesis is not the primary nonshivering mechanism. Pearl: Nonshivering thermogenesis is absent during general anesthesia, removing an important heat production mechanism and accelerating hypothermia.",
    scene: "pharmacology",
    sceneCfg: { label: "THERMOREGULATION" },
    metadata: { topic: "Thermoregulation", priority: "high" },
  },

  {
    id: "ap1-w2-050",
    type: "mcq",
    prompt: "Shivering during hypothermia is controlled by the posterior hypothalamus and increases:",  // source: slide 26
    setup: "",
    ans: [
      { t: "Oxygen consumption and metabolic demand", ok: true },
      { t: "Core temperature with no rise in metabolism", ok: false },
      { t: "Peripheral vasodilation and total heat loss", ok: false },
      { t: "Parasympathetic outflow activity only", ok: false },
    ],
    rationale: "Shivering increases heat production through involuntary skeletal muscle contraction but at the cost of significantly increased oxygen consumption (up to 200 to 300% above baseline) and metabolic demand. (B) is wrong because shivering always increases metabolic rate. (C) is wrong because shivering does not cause vasodilation. (D) is wrong because shivering involves somatic motor activity, not parasympathetic. Pearl: Postoperative shivering is distressing and metabolically costly; it can be treated with meperidine (25 mg IV), which is more effective than other opioids for this specific indication.",
    scene: "pharmacology",
    sceneCfg: { label: "THERMOREGULATION" },
    metadata: { topic: "Thermoregulation", priority: "high" },
  },

  {
    id: "ap1-w2-051",
    type: "mcq",
    prompt: "General anesthesia impairs thermoregulation through which mechanisms?",  // source: slide 25, slide 27
    setup: "",
    ans: [
      { t: "Drug induced vasodilation and muscle relaxation", ok: true },
      { t: "Increased metabolic rate and enhanced shivering", ok: false },
      { t: "Stimulation of nonshivering thermogenesis", ok: false },
      { t: "Activation of the hypothalamic heat conservation center", ok: false },
    ],
    rationale: "General anesthesia impairs thermoregulation by causing vasodilation (allowing core to peripheral heat redistribution), producing muscle relaxation (abolishing shivering), and widening the interthreshold range so the body does not initiate compensatory responses. (B) is wrong because GA decreases metabolic rate and abolishes shivering. (C) is wrong because nonshivering thermogenesis is absent during GA. (D) is wrong because GA impairs, not activates, hypothalamic responses. Pearl: Anesthetized patients become relatively poikilothermic, meaning their body temperature drifts toward the ambient environmental temperature.",
    scene: "pharmacology",
    sceneCfg: { label: "THERMOREGULATION" },
    metadata: { topic: "Thermoregulation", priority: "high" },
  },

  {
    id: "ap1-w2-052",
    type: "mcq",
    prompt: "An anesthetized patient is described as 'poikilothermic' because:",  // source: slide 27
    setup: "",
    ans: [
      { t: "Body temperature stays constant regardless of surroundings", ok: false },
      { t: "Temperature control is lost and core drifts toward ambient", ok: true },
      { t: "Core temperature is actively raised by anesthetic drugs", ok: false },
      { t: "The patient makes excessive metabolic heat in surgery", ok: false },
    ],
    rationale: "Under anesthesia, thermoregulatory mechanisms are impaired and the patient becomes relatively poikilothermic, meaning body temperature tends to equilibrate with the environment rather than being actively maintained. (A) describes normal homeothermic function, the opposite. (C) is wrong because most anesthetics lower, not raise, temperature. (D) is wrong because metabolic heat production decreases under anesthesia. Pearl: Operating room temperatures below 21°C combined with poikilothermic status creates a strong gradient for heat loss, making active warming essential.",
    scene: "pharmacology",
    sceneCfg: { label: "THERMOREGULATION" },
    metadata: { topic: "Thermoregulation", priority: "high" },
  },

  {
    id: "ap1-w2-053",
    type: "mcq",
    prompt: "Which anesthetic drugs are specifically identified as lowering thermoregulatory thresholds?",  // source: slide 28
    setup: "",
    ans: [
      { t: "Succinylcholine and neostigmine", ok: false },
      { t: "Propofol and alfentanil", ok: true },
      { t: "Phenylephrine and vasopressin", ok: false },
      { t: "Ondansetron and dexamethasone", ok: false },
    ],
    rationale: "Propofol and alfentanil are specifically identified as drugs that lower thermoregulatory thresholds, meaning the body tolerates a lower core temperature before initiating compensatory responses like vasoconstriction and shivering. Volatile agents (isoflurane, desflurane) also impair thermoregulation. (A) is wrong because these are neuromuscular drugs. (C) is wrong because these are vasopressors. (D) is wrong because these are antiemetics. Pearl: By lowering the vasoconstriction and shivering thresholds, these drugs widen the interthreshold range, creating a zone where the body makes no attempt to correct falling temperature.",
    scene: "pharmacology",
    sceneCfg: { label: "THERMOREGULATION" },
    metadata: { topic: "Thermoregulation", priority: "high" },
  },

  {
    id: "ap1-w2-054",
    type: "mcq",
    prompt: "Nonshivering thermogenesis during general anesthesia is:",  // source: slide 28
    setup: "",
    ans: [
      { t: "Enhanced to make up for ongoing heat loss", ok: false },
      { t: "Left unaffected by the anesthetic agents", ok: false },
      { t: "Absent during general anesthesia", ok: true },
      { t: "The main mechanism that prevents hypothermia", ok: false },
    ],
    rationale: "Nonshivering thermogenesis is absent during general anesthesia. The sympathetic activation of brown adipose tissue that normally drives heat production through UCP 1 mediated uncoupling is suppressed. (A) is wrong because GA abolishes, not enhances, this mechanism. (B) is wrong because anesthetics directly suppress nonshivering thermogenesis. (D) is wrong because it is absent and therefore cannot prevent hypothermia. Pearl: The loss of nonshivering thermogenesis is one reason perioperative hypothermia develops so readily; patients lose a significant heat production pathway.",
    scene: "pharmacology",
    sceneCfg: { label: "THERMOREGULATION" },
    metadata: { topic: "Thermoregulation", priority: "high" },
  },

  {
    id: "ap1-w2-055",
    type: "mcq",
    prompt: "Phase 1 of perioperative hypothermia (redistribution hypothermia) typically occurs during the first hour of anesthesia and is characterized by:",  // source: slide 29
    setup: "",
    ans: [
      { t: "A 0.5 to 1.5 degree C drop as vasodilation shifts heat outward", ok: true },
      { t: "A 4 to 5 degree C drop caused by metabolic failure", ok: false },
      { t: "A rise in core temperature from surgical stimulation", ok: false },
      { t: "A stable core temperature with peripheral warming", ok: false },
    ],
    rationale: "Redistribution hypothermia is the most rapid phase of perioperative heat loss. Anesthesia induced vasodilation allows warm blood from the core (head, chest, abdomen) to flow to the cooler periphery (skin and extremities), dropping core temperature by approximately 0.5°C to 1.5°C within the first hour. (B) is too extreme a drop for Phase 1. (C) is wrong because core temperature falls, not rises. (D) is wrong because core temperature decreases. Pearl: Early active warming before induction (prewarming) reduces the core to peripheral temperature gradient, mitigating redistribution hypothermia.",
    scene: "pharmacology",
    sceneCfg: { label: "THERMOREGULATION" },
    metadata: { topic: "Thermoregulation", priority: "high" },
  },

  {
    id: "ap1-w2-056",
    type: "mcq",
    prompt: "During Phase 2 of perioperative hypothermia, core temperature decreases because:",  // source: slide 30
    setup: "",
    ans: [
      { t: "Heat loss to the environment exceeds metabolic heat production", ok: true },
      { t: "Core to peripheral redistribution is still the dominant mechanism", ok: false },
      { t: "Vasoconstriction has been established, trapping heat centrally", ok: false },
      { t: "Active rewarming systems are ineffective during this phase", ok: false },
    ],
    rationale: "After the initial redistribution phase, Phase 2 (linear heat loss) occurs because ongoing heat loss to the cold operating environment exceeds the body's reduced metabolic heat production. Temperature decreases more slowly and linearly during this phase. (B) is wrong because redistribution is largely complete after the first hour. (C) describes the plateau phase, not Phase 2. (D) is wrong because active warming is effective during all phases. Pearl: Reducing environmental heat loss (raising OR temperature, warming blankets, fluid warmers) is the primary intervention during Phase 2.",
    scene: "pharmacology",
    sceneCfg: { label: "THERMOREGULATION" },
    metadata: { topic: "Thermoregulation", priority: "high" },
  },

  {
    id: "ap1-w2-057",
    type: "mcq",
    prompt: "The plateau phase (Phase 3) of perioperative temperature change usually occurs after 3 to 5 hours and results from:",  // source: slide 30
    setup: "",
    ans: [
      { t: "A complete shutdown of metabolic heat production", ok: false },
      { t: "Vasoconstriction that preserves core heat by limiting loss", ok: true },
      { t: "Intense shivering that makes enough heat to halt cooling", ok: false },
      { t: "External rewarming applied by the surgical team", ok: false },
    ],
    rationale: "After 3 to 5 hours, core temperature typically stabilizes because thermoregulatory vasoconstriction is triggered (even under anesthesia, though at a lower threshold), reducing blood flow to the periphery and preserving core heat. Heat loss then equals heat production. (A) is wrong because metabolic activity continues. (C) is wrong because shivering is typically suppressed during general anesthesia. (D) is wrong because the plateau is a physiologic phenomenon, not dependent on external warming. Pearl: Under regional anesthesia, sympathetic blockade prevents vasoconstriction below the block level, so the plateau phase may not occur, leading to continued heat loss.",
    scene: "pharmacology",
    sceneCfg: { label: "THERMOREGULATION" },
    metadata: { topic: "Thermoregulation", priority: "high" },
  },

  {
    id: "ap1-w2-058",
    type: "mcq",
    prompt: "Regional anesthesia increases the risk of perioperative hypothermia because it:",  // source: slide 30
    setup: "",
    ans: [
      { t: "Blocks sympathetic vasoconstriction and may impair shivering", ok: true },
      { t: "Directly stimulates brown fat thermogenesis", ok: false },
      { t: "Raises metabolic rate within the blocked segments", ok: false },
      { t: "Enhances hypothalamic thermoregulatory responses", ok: false },
    ],
    rationale: "Regional anesthesia (spinal, epidural) blocks sympathetic vasoconstriction below the level of the block, preventing the peripheral vasoconstriction needed to conserve core heat. The shivering response may also be impaired. Combined regional and general anesthesia increases hypothermia risk further. (B) is wrong because regional anesthesia does not stimulate brown fat. (C) is wrong because metabolic rate is not increased. (D) is wrong because hypothalamic responses are impaired, not enhanced. Pearl: The plateau phase (Phase 3) may never develop under regional anesthesia because the vasoconstriction required to achieve equilibrium cannot occur below the block.",
    scene: "pharmacology",
    sceneCfg: { label: "THERMOREGULATION" },
    metadata: { topic: "Thermoregulation", priority: "high" },
  },

  {
    id: "ap1-w2-059",
    type: "mcq",
    prompt: "Factors contributing to perioperative heat loss include all of the following EXCEPT:",  // source: slide 28
    setup: "",
    ans: [
      { t: "A cool operating room environment", ok: false },
      { t: "Giving unwarmed intravenous fluids", ok: false },
      { t: "Drug induced peripheral vasodilation", ok: false },
      { t: "Preoperative forced air warming of patient", ok: true },
    ],
    rationale: "Cool OR temperature, unwarmed IV fluids, drug induced vasodilation, decreased metabolic rate, reduced shivering, exposure of internal organs, and humidification of dry inhaled gases all contribute to heat loss. Preoperative forced air warming (prewarming) is a heat PRESERVATION strategy, not a cause of heat loss. (A), (B), and (C) are established contributors to perioperative hypothermia. Pearl: Prewarming for 30 to 60 minutes before induction narrows the core to peripheral temperature gradient and significantly reduces Phase 1 redistribution hypothermia.",
    scene: "pharmacology",
    sceneCfg: { label: "THERMOREGULATION" },
    metadata: { topic: "Thermoregulation", priority: "high" },
  },

  {
    id: "ap1-w2-060",
    type: "mcq",
    prompt: "Perioperative hypothermia can lead to which clinically significant consequence?",  // source: slide 28, slide 32
    setup: "",
    ans: [
      { t: "Accelerated drug metabolism and shorter emergence times", ok: false },
      { t: "Delayed drug metabolism and prolonged recovery from anesthesia", ok: true },
      { t: "Decreased oxygen demand and reduced risk of myocardial ischemia", ok: false },
      { t: "Enhanced coagulation and reduced surgical bleeding", ok: false },
    ],
    rationale: "Hypothermia delays hepatic drug metabolism, prolongs the duration of neuromuscular blocking agents and other anesthetics, increases oxygen demand (especially during rewarming with shivering), and can prolong recovery. (A) is wrong because hypothermia slows metabolism. (C) is wrong because rewarming and shivering increase oxygen demand. (D) is wrong because hypothermia impairs coagulation and platelet function, increasing bleeding risk. Pearl: Even mild hypothermia (1 to 2°C below normal) increases wound infection rates, transfusion requirements, and length of hospital stay.",
    scene: "pharmacology",
    sceneCfg: { label: "THERMOREGULATION" },
    metadata: { topic: "Thermoregulation", priority: "high" },
  },

];

export const AP1_WK2_METADATA = {
  nodeId: "ap1-wk-2",
  courseId: "adv-pharmacology-1",
  chapter: "Stoelting Ch 3 pp 76–94",
  title: "Peripheral Nervous System, Autonomic Pharmacology, and Thermoregulation",
  totalQuestions: AP1_WK2_QUESTIONS.length,
  questionTypes: { mcq: 60, multi: 0, short: 0 },
};
