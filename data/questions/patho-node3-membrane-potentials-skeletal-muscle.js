/**
 * Advanced Physiology & Pathophysiology — Node 3
 * Chapters 5–6: Membrane Potentials & Action Potentials / Contraction of Skeletal Muscle
 * Source: Guyton & Hall 14e (local extracted text)
 */

export const PATHO_NODE3_QUESTIONS = [

  {
    id: "patho-n3-001",
    type: "mcq",
    prompt: "In a ventricular myocyte at rest, the membrane is far more permeable to K⁺ than Na⁺, so Vm sits near EK. Approximately what is the resting membrane potential?",
    setup: "",
    ans: [
      { t: "−85 to −95 mV — the ventricular myocyte range",  ok: true  },
      { t: "−55 to −60 mV — typical of SA nodal pacemaker cells", ok: false },
      { t: "−40 mV — threshold level for slow Ca²⁺ channels",     ok: false },
      { t: "+20 mV — near the peak of Phase 0 overshoot",          ok: false },
    ],
    rationale: "Guyton states the resting membrane potential of ventricular muscle is −85 to −95 mV. This sits close to EK (~−90 mV) because K⁺ permeability dominates at rest. SA nodal cells, in contrast, rest at −55 to −60 mV because their 'funny' Na⁺ leak continually depolarizes them.",
    scene: "action_potential",
    sceneCfg: { label: "VENTRICULAR RMP ≈ −85 mV", phase: 'rest' },
    metadata: { topic: "Resting Membrane Potential", priority: "high" },
  },

  {
    id: "patho-n3-002",
    type: "mcq",
    prompt: "A patient with severe hyperkalemia (K⁺ 7.8 mEq/L) becomes paradoxically weak with wide QRS. What is the mechanism of inexcitability?",
    setup: "",
    ans: [
      { t: "Sustained depolarization closes voltage-gated Na⁺ inactivation gates, which cannot reset until the membrane repolarizes", ok: true  },
      { t: "Hyperpolarization pushes Vm below the activation threshold of Na⁺ channels, so they cannot be opened by any stimulus",      ok: false },
      { t: "Hyperkalemia directly inhibits the Na⁺/K⁺-ATPase and immediately halts all sarcolemmal electrical conduction",              ok: false },
      { t: "ENa shifts far more positive, increasing driving force until the available intracellular Na⁺ stores are exhausted",         ok: false },
    ],
    rationale: "Elevated extracellular K⁺ brings resting Vm closer to threshold (depolarizes the cell). Prolonged depolarization closes the Na⁺ channel inactivation gates, which only reset after repolarization. With inactivation gates stuck closed, the cell is paradoxically inexcitable — hence muscle weakness and wide, slow QRS complexes.",
    scene: "action_potential",
    sceneCfg: { label: "HYPERKALEMIA → Na⁺ INACTIVATION", phase: 'depol' },
    metadata: { topic: "Hyperkalemia", priority: "high" },
  },

  {
    id: "patho-n3-003",
    type: "mcq",
    prompt: "During the Phase 0 upstroke of a ventricular action potential, Vm races toward ~+40 mV. Why?",
    setup: "",
    ans: [
      { t: "Voltage-gated Na⁺ channels open; Na⁺ permeability dominates and drives Vm toward ENa at roughly +60 mV", ok: true  },
      { t: "K⁺ permeability transiently exceeds Na⁺ permeability during Phase 0, driving Vm rapidly toward EK",      ok: false },
      { t: "The Na⁺/K⁺-ATPase directly moves charge fast enough to create a positive intracellular membrane potential", ok: false },
      { t: "Ca²⁺ influx via L-type channels during Phase 2 drives the initial positive overshoot of the upstroke",     ok: false },
    ],
    rationale: "The ion with the highest instantaneous permeability dominates Vm. During Phase 0, voltage-gated Na⁺ channels open en masse and Na⁺ permeability spikes, pulling Vm toward ENa (~+60 mV). Ca²⁺ entry sustains the Phase 2 plateau AFTER the overshoot. Na⁺/K⁺-ATPase contributes <10% of Vm.",
    scene: "action_potential",
    sceneCfg: { label: "PHASE 0 — FAST Na⁺ UPSTROKE", phase: 'depol', showEna: true },
    metadata: { topic: "Action Potential", priority: "high" },
  },

  {
    id: "patho-n3-004",
    type: "multi",
    prompt: "During the cross-bridge cycle in skeletal muscle, select the TWO bands that shorten as the sarcomere contracts:",
    setup: "",
    choices: [
      "I band (the thin-filament-only region flanking each Z-line)",
      "H zone (central region of the A band containing only thick myosin)",
      "A band (the full length of the thick myosin filament)",
      "Thin actin filaments themselves shorten along their length",
      "Thick myosin filaments themselves shorten along their length",
    ],
    correctAnswers: [
      "I band (the thin-filament-only region flanking each Z-line)",
      "H zone (central region of the A band containing only thick myosin)",
    ],
    selectCount: 2,
    rationale: "The sliding-filament model: actin and myosin filaments retain their own lengths; they slide past each other. The I band (thin-only region) and H zone (thick-only region) both shrink as Z-lines draw inward. The A band (myosin length) does NOT change because thick filaments are not shortened.",
    scene: "sarcomere",
    sceneCfg: { label: "SLIDING FILAMENT — I & H SHORTEN", state: 'cycle' },
    metadata: { topic: "Sarcomere", priority: "high" },
  },

  {
    id: "patho-n3-005",
    type: "mcq",
    prompt: "What ion binds troponin C to initiate skeletal muscle contraction, and from where does it come?",
    setup: "",
    ans: [
      { t: "Ca²⁺ released from the sarcoplasmic reticulum through RyR1 ryanodine receptors",  ok: true  },
      { t: "Ca²⁺ entering through DHP receptors from ECF — the primary source in skeletal muscle", ok: false },
      { t: "Na⁺ entering through voltage-gated Na⁺ channels during Phase 0 depolarization",   ok: false },
      { t: "Mg²⁺ released from the sarcoplasmic reticulum via MgATP-sensitive channels",       ok: false },
    ],
    rationale: "In SKELETAL muscle, the T-tubule DHP receptor is mechanically coupled to the RyR1 ryanodine receptor on the SR. Depolarization triggers RyR opening and Ca²⁺ floods out of the SR into the cytoplasm (calcium-induced calcium release is minor here). Ca²⁺ then binds troponin C to expose actin binding sites. In CARDIAC muscle, by contrast, extracellular Ca²⁺ entry is required to trigger SR release (Ca²⁺-induced Ca²⁺ release).",
    scene: "sarcomere",
    sceneCfg: { label: "Ca²⁺–TROPONIN C COUPLING", state: 'contracted' },
    metadata: { topic: "Excitation-Contraction Coupling", priority: "high" },
  },

  {
    id: "patho-n3-006",
    type: "mcq",
    prompt: "Under Guyton's framework, the Nernst equation for K⁺ at 37 °C is E_K = −61 × log([K⁺]_i / [K⁺]_o). If intracellular K⁺ is 140 mM and extracellular is 4.5 mM, E_K ≈ ?",
    setup: "",
    ans: [
      { t: "≈ −91 mV — near the typical RMP",  ok: true  },
      { t: "≈ −61 mV — the temperature constant",  ok: false },
      { t: "≈ +91 mV — sign mirror of the result",  ok: false },
      { t: "≈ −30 mV — a partial log estimate",     ok: false },
    ],
    rationale: "−61 × log(140/4.5) = −61 × log(31.1) = −61 × 1.49 ≈ −91 mV. This is why the resting membrane potential of most cells sits near −90 mV — K⁺ permeability dominates at rest, pulling Vm toward EK.",
    scene: "ion_gradient_bars",
    sceneCfg: {
      label: "NERNST — K⁺ DRIVES RMP",
      ions: [
        { name: 'K⁺', ecf: 4.5, icf: 140, unit: 'mEq/L', highlight: true },
        { name: 'Na⁺', ecf: 142, icf: 14, unit: 'mEq/L' },
      ],
    },
    metadata: { topic: "Nernst Equation", priority: "high" },
  },

  {
    id: "patho-n3-007",
    type: "mcq",
    prompt: "A poison selectively blocks the Na⁺/K⁺-ATPase. Which effect on the resting membrane potential develops over seconds to minutes?",
    setup: "",
    ans: [
      { t: "RMP depolarizes only a few mV acutely, then progressively more as Na⁺/K⁺ gradients run down",  ok: true  },
      { t: "RMP immediately hyperpolarizes because K⁺ accumulates in the extracellular fluid",              ok: false },
      { t: "No effect at any time — the Na⁺/K⁺-ATPase contributes essentially zero to the membrane potential", ok: false },
      { t: "RMP crashes to 0 mV within seconds as the electrogenic pump contribution is lost acutely",       ok: false },
    ],
    rationale: "The Na⁺/K⁺-ATPase itself contributes less than 10% of Vm directly (via its electrogenicity). So blocking it only depolarizes Vm by a few mV acutely. But over time intracellular Na⁺ rises and extracellular K⁺ falls — gradients that K⁺ leak currents depend on — so the diffusion potential also collapses and RMP depolarizes substantially. That progressive drift is the slow but clinically important lethal step.",
    scene: "cell_membrane",
    sceneCfg: { label: "PUMP BLOCK — SLOW RMP COLLAPSE", channels: [{ kind: 'pump' }], highlight: 'pump' },
    metadata: { topic: "Na/K-ATPase", priority: "high" },
  },

  {
    id: "patho-n3-008",
    type: "short",
    prompt: "What cytoskeletal protein spans the half-sarcomere and contributes to passive elasticity, acting like a molecular spring?",
    setup: "",
    acceptedAnswers: ["titin", "connectin", "titin (connectin)"],
    canonicalAnswer: "Titin (connectin)",
    rationale: "Titin — also called connectin — runs from the Z-line to the M-line along the thick filament and is the main source of passive tension when muscle is stretched beyond resting length. Loss of titin integrity underlies several forms of cardiomyopathy.",
    scene: "sarcomere",
    sceneCfg: { label: "TITIN — MOLECULAR SPRING", state: 'relaxed' },
    metadata: { topic: "Sarcomere Proteins", priority: "medium" },
  },

  {
    id: "patho-n3-009",
    type: "mcq",
    prompt: "Which statement about the absolute refractory period in cardiac ventricular muscle is correct?",
    setup: "",
    ans: [
      { t: "It lasts about 0.25–0.30 sec, preventing tetanic contraction and allowing full ventricular filling",  ok: true  },
      { t: "It lasts roughly 2 ms, the same brief duration as a fast skeletal muscle fiber twitch",                 ok: false },
      { t: "It is essentially absent in cardiac muscle because gap junctions allow continuous re-excitation",       ok: false },
      { t: "It is determined entirely by Ca²⁺ ATPase (SERCA) recovery time back to diastolic levels",               ok: false },
    ],
    rationale: "Guyton: cardiac ventricular ARP lasts ~0.25–0.30 sec, followed by a brief ~0.05 sec relative refractory period. This long refractory period is a direct consequence of the plateau phase and Na⁺ channel inactivation — and it protects the heart from tetanic contraction, which would be lethal.",
    scene: "action_potential",
    sceneCfg: { label: "ARP — 0.25–0.30 SEC", phase: 'repol' },
    metadata: { topic: "Refractory Period", priority: "medium" },
  },

  {
    id: "patho-n3-010",
    type: "mcq",
    prompt: "A researcher hyperpolarizes a neuron from −70 mV to −90 mV. What is the immediate effect on excitability?",
    setup: "",
    ans: [
      { t: "Decreased excitability — Vm is farther from threshold, so a larger depolarization is required to fire",  ok: true  },
      { t: "Increased excitability — hyperpolarization always makes a cell easier to fire regardless of threshold",    ok: false },
      { t: "No effect on excitability because firing threshold is independent of the starting membrane potential",     ok: false },
      { t: "The cell becomes spontaneously active at a pacemaker rate driven by its funny current channels",            ok: false },
    ],
    rationale: "Threshold is typically around −55 mV. Hyperpolarizing from −70 to −90 mV puts Vm further from threshold, so a larger stimulus is required to reach firing threshold. Conversely, modest depolarization (as in mild hyperkalemia) moves the cell closer to threshold and increases excitability — until the point that Na⁺ channel inactivation takes over.",
    scene: "action_potential",
    sceneCfg: { label: "HYPERPOLARIZATION — ↓ EXCITABILITY", phase: 'hyper' },
    metadata: { topic: "Excitability", priority: "medium" },
  },

  {
    id: "patho-n3-011",
    type: "mcq",
    prompt: "Which structural feature of cardiac muscle, absent in skeletal muscle, lets an action potential spread from one myocyte to the next and makes the heart a functional syncytium?",
    setup: "",
    ans: [
      { t: "Gap junctions within intercalated discs between myocytes",  ok: true  },
      { t: "Sarcoplasmic reticulum storing Ca²⁺ for contraction",        ok: false },
      { t: "T-tubules carrying the action potential into fiber interiors", ok: false },
      { t: "Neuromuscular junctions innervating each individual myocyte", ok: false },
    ],
    rationale: "Intercalated discs contain gap junctions (connexons) that are 1/400 the resistance of the sarcolemma. They allow electrical current to flow directly from one cardiomyocyte to the next, so the atrial and ventricular masses each behave as a single functional syncytium. Skeletal muscle has no gap junctions — each fiber is triggered by its own motor neuron at an NMJ.",
    scene: "cell_membrane",
    sceneCfg: { label: "INTERCALATED DISC — GAP JUNCTIONS", channels: [{ kind: 'leak' }] },
    metadata: { topic: "Cardiac Syncytium", priority: "medium" },
  },

  {
    id: "patho-n3-012",
    type: "mcq",
    prompt: "Which phase of the cardiac ventricular action potential is dominated by calcium influx through L-type channels and distinguishes it from a skeletal muscle action potential?",
    setup: "",
    ans: [
      { t: "Phase 2 — the calcium-driven plateau phase",  ok: true  },
      { t: "Phase 0 — the fast Na⁺ upstroke of the AP",   ok: false },
      { t: "Phase 3 — final K⁺-driven repolarization",    ok: false },
      { t: "Phase 4 — the resting membrane potential",    ok: false },
    ],
    rationale: "Phase 2 is the plateau, maintained by slow L-type Ca²⁺ influx balanced against K⁺ efflux. It lasts 0.2–0.3 sec and is why cardiac muscle has such a long absolute refractory period. Skeletal muscle has no plateau because it lacks the prominent L-type Ca²⁺ current on its sarcolemma; its action potential is over in ~2 ms.",
    scene: "action_potential",
    sceneCfg: { label: "PLATEAU — L-TYPE Ca²⁺", phase: 'repol' },
    metadata: { topic: "Cardiac AP Phases", priority: "high" },
  },

];

export const PATHO_NODE3_METADATA = {
  nodeId:   "patho-node-3",
  courseId: "adv-phys-path-1",
  chapter:  "Chapters 5–6",
  title:    "Membrane Potentials & Skeletal Muscle Contraction",
  totalQuestions: PATHO_NODE3_QUESTIONS.length,
  questionTypes: {
    mcq:   PATHO_NODE3_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: PATHO_NODE3_QUESTIONS.filter(q => q.type === 'multi').length,
    short: PATHO_NODE3_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
