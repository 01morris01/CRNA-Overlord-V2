/**
 * Advanced Physiology & Pathophysiology — Node 4
 * Chapters 7–8: Excitation of Skeletal Muscle / Smooth Muscle
 * Source: Guyton & Hall 14e (local extracted text)
 */

export const PATHO_NODE4_QUESTIONS = [

  {
    id: "patho-n4-001",
    type: "mcq",
    prompt: "At the neuromuscular junction, acetylcholine binds a nicotinic receptor on the motor end plate. What is the most proximate cause of the end-plate potential?",
    setup: "",
    ans: [
      { t: "Opening of a non-selective cation channel — net Na⁺ influx depolarizes the end plate",  ok: true  },
      { t: "Opening of a K⁺-selective channel that hyperpolarizes the end plate below resting Vm",    ok: false },
      { t: "Direct ligand activation of L-type voltage-gated Ca²⁺ channels on the sarcolemma surface", ok: false },
      { t: "Release of Ca²⁺ from the sarcoplasmic reticulum through DHPR/RyR mechanical coupling",      ok: false },
    ],
    rationale: "Nicotinic AChR at the NMJ is a ligand-gated nonselective cation channel. Na⁺ and K⁺ flow through it, but because the electrochemical driving force on Na⁺ is much larger at resting Vm, net Na⁺ influx dominates. This depolarizes the end plate (EPP) to threshold and launches an action potential that propagates through the sarcolemma, then triggers EC coupling via DHP/RyR.",
    scene: "action_potential",
    sceneCfg: { label: "NMJ — EPP → AP → CONTRACTION", phase: 'depol' },
    metadata: { topic: "Neuromuscular Junction", priority: "high" },
  },

  {
    id: "patho-n4-002",
    type: "mcq",
    prompt: "A patient with myasthenia gravis has fluctuating weakness that worsens with use and improves with edrophonium. Which cellular defect best explains this?",
    setup: "",
    ans: [
      { t: "Autoantibodies against post-synaptic nicotinic ACh receptors reduce functional receptor density", ok: true  },
      { t: "Defective voltage-gated Ca²⁺ channels at the pre-synaptic motor nerve terminal (Lambert-Eaton)",   ok: false },
      { t: "Inherited mutation in the sarcoplasmic reticulum RyR1 Ca²⁺ release channel of skeletal muscle",     ok: false },
      { t: "Failure of synaptic acetylcholinesterase to clear ACh from the neuromuscular junction cleft",       ok: false },
    ],
    rationale: "Myasthenia gravis is an autoimmune disease in which IgG antibodies bind and internalize post-synaptic nicotinic AChRs at the motor end plate. Fewer receptors means a smaller EPP for the same ACh release, so fatigability develops. Edrophonium (a short-acting AChE inhibitor) transiently raises cleft ACh and improves strength. Lambert-Eaton, by contrast, is pre-synaptic (antibodies to VGCCs).",
    scene: "action_potential",
    sceneCfg: { label: "MYASTHENIA — POST-SYNAPTIC AChR LOSS", phase: 'rest' },
    metadata: { topic: "Myasthenia Gravis", priority: "high" },
  },

  {
    id: "patho-n4-003",
    type: "multi",
    prompt: "Select the THREE features that distinguish SMOOTH muscle contraction from skeletal/cardiac contraction:",
    setup: "",
    choices: [
      "Ca²⁺ binds calmodulin rather than binding troponin C on the thin filament",
      "Calmodulin–Ca²⁺ activates myosin light chain kinase (MLCK) to phosphorylate MLC",
      "Has a 'latch state' that maintains tone with minimal ATP expenditure over time",
      "Troponin T couples Ca²⁺ release to cross-bridge activation via tropomyosin shift",
      "Tetanic fusion in smooth muscle requires MLCK to phosphorylate actin directly",
    ],
    correctAnswers: [
      "Ca²⁺ binds calmodulin rather than binding troponin C on the thin filament",
      "Calmodulin–Ca²⁺ activates myosin light chain kinase (MLCK) to phosphorylate MLC",
      "Has a 'latch state' that maintains tone with minimal ATP expenditure over time",
    ],
    selectCount: 3,
    rationale: "Smooth muscle has no troponin — Ca²⁺ binds calmodulin, which activates MLCK. MLCK phosphorylates myosin light chain, enabling cross-bridge cycling. The latch state lets smooth muscle hold tension over long periods at very low ATP cost, which is why arterioles can sustain tone 24/7 without fatiguing.",
    scene: "sarcomere",
    sceneCfg: { label: "SMOOTH MUSCLE — Ca²⁺–CaM–MLCK", state: 'contracted' },
    metadata: { topic: "Smooth Muscle", priority: "high" },
  },

  {
    id: "patho-n4-004",
    type: "mcq",
    prompt: "Succinylcholine causes initial muscle fasciculations followed by flaccid paralysis. What is the underlying receptor pharmacology?",
    setup: "",
    ans: [
      { t: "Depolarizing blockade — SCh is a nicotinic AChR agonist that persistently depolarizes the end plate, inactivating adjacent Na⁺ channels", ok: true  },
      { t: "Competitive antagonism at post-synaptic nicotinic AChRs without any receptor activation, as seen with non-depolarizing NMBs at the NMJ",    ok: false },
      { t: "Irreversible inhibition of synaptic acetylcholinesterase causing ACh accumulation in the neuromuscular junction cleft over time",            ok: false },
      { t: "Blockade of pre-synaptic voltage-gated Ca²⁺ channels in the motor terminal, preventing quantal ACh vesicle release into the cleft",          ok: false },
    ],
    rationale: "Succinylcholine is a nicotinic AChR AGONIST. Initial binding fires muscle fibers (fasciculations), then the end plate is held depolarized because SCh is not rapidly hydrolyzed. Na⁺ channels adjacent to the end plate become inactivated (just like hyperkalemia-induced paralysis), and the muscle cannot repolarize or contract. Non-depolarizing NMBs, by contrast, competitively block AChR without activation.",
    scene: "action_potential",
    sceneCfg: { label: "SUCCINYLCHOLINE — DEPOLARIZING BLOCK", phase: 'depol' },
    metadata: { topic: "Succinylcholine", priority: "high" },
  },

  {
    id: "patho-n4-005",
    type: "mcq",
    prompt: "In skeletal muscle EC coupling, the DHP receptor in the T-tubule membrane couples to the RyR1 on the sarcoplasmic reticulum by what mechanism?",
    setup: "",
    ans: [
      { t: "Direct mechanical (voltage-sensor) coupling — DHPR conformational change physically pulls open RyR1",  ok: true  },
      { t: "Calcium-induced calcium release — a small Ca²⁺ influx through DHPR triggers RyR1 to open on the SR",    ok: false },
      { t: "cAMP-mediated PKA phosphorylation of RyR1 following β-adrenergic activation at the sarcolemma surface",  ok: false },
      { t: "IP₃ generation via Gq signaling activating IP₃ receptor channels on the SR membrane near the T-tubule",   ok: false },
    ],
    rationale: "SKELETAL muscle uses mechanical coupling: the DHPR acts as a voltage sensor, and its conformational change physically pulls open RyR1 on the SR. No extracellular Ca²⁺ entry is required. CARDIAC muscle, by contrast, uses calcium-induced Ca²⁺ release — a small amount of extracellular Ca²⁺ entering through the DHPR triggers RyR2 to release SR stores.",
    scene: "sarcomere",
    sceneCfg: { label: "SKELETAL EC COUPLING — MECHANICAL", state: 'contracted' },
    metadata: { topic: "EC Coupling", priority: "high" },
  },

  {
    id: "patho-n4-006",
    type: "mcq",
    prompt: "Which cellular event ENDS smooth muscle contraction at the myofilament level?",
    setup: "",
    ans: [
      { t: "Myosin light chain phosphatase (MLCP) dephosphorylates the myosin light chain",  ok: true  },
      { t: "Calcium rebinds to troponin C and tropomyosin re-blocks the actin cross-bridges", ok: false },
      { t: "Actin filaments are degraded by activated caspase-3 during the relaxation phase", ok: false },
      { t: "Titin springs stretched half-sarcomeres back to their resting length passively",    ok: false },
    ],
    rationale: "Smooth muscle relaxation requires dephosphorylation of myosin light chain by MLCP. Clinically, NO activates guanylate cyclase → cGMP → MLCP activation → vasodilation. Drugs that block cGMP breakdown (sildenafil) prolong smooth muscle relaxation in penile and pulmonary vasculature.",
    scene: "sarcomere",
    sceneCfg: { label: "MLCP — ENDS CONTRACTION", state: 'relaxed' },
    metadata: { topic: "Smooth Muscle Relaxation", priority: "high" },
  },

  {
    id: "patho-n4-007",
    type: "mcq",
    prompt: "A single-unit (visceral) smooth muscle is characterized by which feature?",
    setup: "",
    ans: [
      { t: "Gap junctions coupling adjacent cells so they contract synchronously as a syncytium",   ok: true  },
      { t: "Each smooth muscle cell is innervated by its own motor neuron like skeletal muscle",     ok: false },
      { t: "Voluntary cortical control via the corticospinal tract and motor unit recruitment",      ok: false },
      { t: "Striated sarcomeres arranged in register across adjacent cells like cardiac tissue",     ok: false },
    ],
    rationale: "Single-unit (visceral) smooth muscle — found in GI tract, uterus, bladder — has gap junctions joining cells electrically, so the whole mass contracts as one syncytium. Multi-unit smooth muscle (iris, piloerector, large airways) has each cell separately innervated and contracts more discretely.",
    scene: null,
    metadata: { topic: "Smooth Muscle Types", priority: "medium" },
  },

  {
    id: "patho-n4-008",
    type: "short",
    prompt: "What enzyme rapidly clears acetylcholine from the neuromuscular junction synaptic cleft and terminates the end-plate potential?",
    setup: "",
    acceptedAnswers: [
      "acetylcholinesterase", "AChE", "acetyl cholinesterase",
      "acetylcholinesterase (AChE)",
    ],
    canonicalAnswer: "Acetylcholinesterase (AChE)",
    rationale: "AChE hydrolyzes ACh into acetate and choline within milliseconds, sharpening the EPP and preventing sustained depolarization. Organophosphates and neostigmine inhibit AChE and prolong ACh action — useful for reversing non-depolarizing NMBs, dangerous as nerve agents.",
    scene: null,
    metadata: { topic: "NMJ Pharmacology", priority: "medium" },
  },

  {
    id: "patho-n4-009",
    type: "mcq",
    prompt: "Which statement about smooth muscle tone during vascular relaxation is correct?",
    setup: "",
    ans: [
      { t: "NO → guanylate cyclase → cGMP → MLCP activation → MLC dephosphorylation → vascular relaxation", ok: true  },
      { t: "NO directly blocks L-type voltage-gated Ca²⁺ channels in the smooth muscle sarcolemma membrane",  ok: false },
      { t: "NO activates adenylate cyclase to raise cAMP, which phosphorylates MLCK and drives contraction",  ok: false },
      { t: "NO triggers Ca²⁺ release from the sarcoplasmic reticulum via ryanodine receptor channels (RyR2)", ok: false },
    ],
    rationale: "Endothelium-derived NO diffuses into the smooth muscle cell and activates soluble guanylate cyclase, which produces cGMP. cGMP activates MLCP (which dephosphorylates myosin light chain) and also reduces cytosolic Ca²⁺. The net effect is vasodilation. This is the mechanism of nitroglycerin, sodium nitroprusside, and endogenous flow-mediated dilation.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "NO–cGMP–MLCP CASCADE", radius: 70, wall: 10 },
    metadata: { topic: "NO-cGMP Pathway", priority: "high" },
  },

  {
    id: "patho-n4-010",
    type: "mcq",
    prompt: "Which receptor/channel transduces the action potential from the T-tubule to calcium release from the sarcoplasmic reticulum?",
    setup: "",
    ans: [
      { t: "T-tubule DHP receptor (voltage sensor) mechanically coupled to the SR RyR1 Ca²⁺ release channel", ok: true  },
      { t: "IP₃ receptor on the SR working with the SERCA pump to control cytosolic Ca²⁺ during contraction",  ok: false },
      { t: "Nicotinic ACh receptor in the sarcolemma coupled to RyR2 via G-protein signaling on the SR wall",   ok: false },
      { t: "Voltage-gated Na⁺ channel in the T-tubule that phosphorylates troponin C directly via kinase",       ok: false },
    ],
    rationale: "The T-tubule dihydropyridine receptor is a voltage-gated Ca²⁺ channel that also acts as the voltage sensor mechanically coupled to RyR1 on the SR. When the T-tubule depolarizes, DHPR pulls RyR1 open and Ca²⁺ floods out of the SR to trigger contraction. SERCA is the SR pump that RE-fills stores during relaxation.",
    scene: null,
    metadata: { topic: "EC Coupling", priority: "medium" },
  },

  {
    id: "patho-n4-011",
    type: "mcq",
    prompt: "Which of the following makes smooth muscle contraction far more energetically efficient than skeletal muscle contraction for maintaining tone?",
    setup: "",
    ans: [
      { t: "The 'latch state' — slowly cycling dephosphorylated cross-bridges maintain tension at minimal ATP cost", ok: true  },
      { t: "More abundant mitochondria per unit cell volume than in fast twitch skeletal muscle fibers",              ok: false },
      { t: "A faster intrinsic cross-bridge cycling rate compared to skeletal muscle myosin heads",                    ok: false },
      { t: "Dependence on anaerobic glycolysis for nearly all contraction energy in visceral tissues",                  ok: false },
    ],
    rationale: "In the 'latch' state, dephosphorylated myosin heads remain attached to actin and bear load at very slow detachment rates. The cell thus holds tension for minutes to hours at roughly 1% of the ATP cost of skeletal tetanic contraction — essential for vascular tone, sphincters, and hollow viscera.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "LATCH STATE — EFFICIENT TONE", radius: 55, wall: 14 },
    metadata: { topic: "Latch State", priority: "medium" },
  },

  {
    id: "patho-n4-012",
    type: "mcq",
    prompt: "Non-depolarizing neuromuscular blockers (e.g., rocuronium, vecuronium) produce paralysis by which mechanism?",
    setup: "",
    ans: [
      { t: "Competitive antagonism of post-synaptic nicotinic AChRs — they bind without opening the channel",  ok: true  },
      { t: "Persistent agonism at nicotinic AChRs that inactivates Na⁺ channels near the end plate (like SCh)", ok: false },
      { t: "Irreversible inhibition of pre-synaptic choline reuptake, depleting ACh vesicles over time",        ok: false },
      { t: "Cleavage of synaptobrevin to prevent ACh vesicle fusion with the pre-synaptic membrane (botulinum)", ok: false },
    ],
    rationale: "Non-depolarizing NMBs competitively antagonize the nicotinic AChR — they bind but do not open the channel. No EPP develops and the muscle cannot be activated. Neostigmine and sugammadex reverse them (neostigmine by raising cleft ACh; sugammadex by encapsulating the aminosteroid NMB).",
    scene: null,
    metadata: { topic: "NMB Pharmacology", priority: "high" },
  },

];

export const PATHO_NODE4_METADATA = {
  nodeId:   "patho-node-4",
  courseId: "adv-phys-path-1",
  chapter:  "Chapters 7–8",
  title:    "Muscle Excitation — Skeletal & Smooth",
  totalQuestions: PATHO_NODE4_QUESTIONS.length,
  questionTypes: {
    mcq:   PATHO_NODE4_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: PATHO_NODE4_QUESTIONS.filter(q => q.type === 'multi').length,
    short: PATHO_NODE4_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
