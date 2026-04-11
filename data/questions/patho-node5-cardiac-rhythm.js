/**
 * Advanced Physiology & Pathophysiology — Node 5
 * Chapters 9–10: Cardiac Muscle / Rhythmic Excitation of the Heart
 * Source: Guyton & Hall 14e (local extracted text)
 */

export const PATHO_NODE5_QUESTIONS = [

  {
    id: "patho-n5-001",
    type: "mcq",
    prompt: "Which feature of the cardiac ventricular action potential is ABSENT in a skeletal muscle action potential, and what ion is responsible?",
    setup: "",
    ans: [
      { t: "Phase 2 plateau — sustained by slow L-type Ca²⁺ influx", ok: true  },
      { t: "Phase 0 upstroke — fast Na⁺ channels",                    ok: false },
      { t: "Phase 4 resting potential — K⁺ leak",                     ok: false },
      { t: "Hyperpolarization afterpotential — delayed K⁺",           ok: false },
    ],
    rationale: "The plateau (Phase 2) is a defining feature of cardiac action potentials, lasting 0.2–0.3 sec in ventricular muscle. L-type Ca²⁺ channels open slowly and sustain depolarization against K⁺ efflux. Skeletal muscle lacks this plateau because it has minimal sarcolemmal L-type Ca²⁺ current — its action potential ends in ~2 ms.",
    scene: "action_potential",
    sceneCfg: { label: "CARDIAC PLATEAU — L-TYPE Ca²⁺", phase: 'repol' },
    metadata: { topic: "Cardiac AP", priority: "high" },
  },

  {
    id: "patho-n5-002",
    type: "mcq",
    prompt: "The SA nodal cells have NO fast Na⁺ channels at rest (they're inactivated at their RMP of −55 to −60 mV). What ion channel generates the Phase 0 upstroke in the SA node?",
    setup: "",
    ans: [
      { t: "Slow Na⁺/Ca²⁺ channels activated at ~−40 mV", ok: true  },
      { t: "Fast Na⁺ channels as in ventricular muscle",   ok: false },
      { t: "Inward rectifier K⁺ channels",                  ok: false },
      { t: "HCN (funny current) channels",                  ok: false },
    ],
    rationale: "SA nodal Phase 0 is a slow upstroke carried by L-type Ca²⁺ channels (and some slow Na⁺ channels), activated when the cell drifts to threshold (~−40 mV). Because the upstroke is Ca²⁺-mediated rather than fast Na⁺, it is slower and the conduction velocity through the node is low. HCN channels (the 'funny' current) depolarize Phase 4, bringing the cell to threshold — but they don't generate Phase 0.",
    scene: "action_potential",
    sceneCfg: { label: "SA NODE — SLOW Ca²⁺ UPSTROKE", phase: 'depol' },
    metadata: { topic: "SA Node", priority: "high" },
  },

  {
    id: "patho-n5-003",
    type: "mcq",
    prompt: "Intrinsic rates per Guyton: SA node, AV node, and Purkinje fibers — which is correct?",
    setup: "",
    ans: [
      { t: "SA 70–80 • AV 40–60 • Purkinje 15–40",  ok: true  },
      { t: "SA 40–60 • AV 70–80 • Purkinje 100+",   ok: false },
      { t: "SA 100+ • AV 70–80 • Purkinje 40–60",   ok: false },
      { t: "All three fire at the same intrinsic rate", ok: false },
    ],
    rationale: "The fastest pacemaker drives the heart. SA dominance at 70–80/min keeps slower pacemakers electrically suppressed by overdrive suppression. If SA fails, AV escape at 40–60 takes over; if AV fails too, Purkinje ventricular escape at 15–40 becomes the backup. Bradycardia to 40 often represents loss of SA control and emergence of an AV rhythm.",
    scene: "ecg_waveform",
    sceneCfg: { label: "HIERARCHY OF PACEMAKERS", rhythm: 'sinus', rate: 75 },
    metadata: { topic: "Pacemaker Hierarchy", priority: "high" },
  },

  {
    id: "patho-n5-004",
    type: "mcq",
    prompt: "What is the physiologic PURPOSE of the AV nodal delay (approximately 0.09 sec)?",
    setup: "",
    ans: [
      { t: "To allow atrial contraction to fully empty into the ventricles before ventricular systole begins", ok: true  },
      { t: "To synchronize ventricular depolarization with the aortic valve opening",                          ok: false },
      { t: "To prolong diastole for coronary perfusion",                                                        ok: false },
      { t: "To give the bundle of His time to recover from refractoriness",                                     ok: false },
    ],
    rationale: "The AV nodal delay (plus AV bundle delay of ~0.04 sec) allows the atria to complete their contraction and deposit the final ~20% of ventricular filling (the 'atrial kick') before ventricular systole closes the AV valves. Atrial fibrillation eliminates coordinated atrial contraction and typically reduces CO by 10–20%.",
    scene: "ecg_waveform",
    sceneCfg: { label: "AV NODAL DELAY — ATRIAL KICK", rhythm: 'sinus', rate: 75 },
    metadata: { topic: "AV Node", priority: "high" },
  },

  {
    id: "patho-n5-005",
    type: "multi",
    prompt: "Select the THREE structural/functional features that make cardiac muscle behave as a 'functional syncytium':",
    setup: "",
    choices: [
      "Low-resistance gap junctions in intercalated discs (1/400 the resistance of sarcolemma)",
      "Direct cell-to-cell transmission of action potentials",
      "Fibrous AV insulator that electrically separates atrial and ventricular syncytia",
      "Continuous cytoplasm between every myocyte (true syncytium)",
      "Shared SR across all cells of the ventricle",
    ],
    correctAnswers: [
      "Low-resistance gap junctions in intercalated discs (1/400 the resistance of sarcolemma)",
      "Direct cell-to-cell transmission of action potentials",
      "Fibrous AV insulator that electrically separates atrial and ventricular syncytia",
    ],
    selectCount: 3,
    rationale: "Cardiac muscle is a FUNCTIONAL — not true — syncytium. Each myocyte is its own cell, but gap junctions in intercalated discs allow current to spread from cell to cell with very low resistance (~1/400 of the sarcolemma). The heart has two syncytia (atrial and ventricular) electrically separated by a fibrous AV insulator; conduction passes between them only via the AV node/bundle.",
    scene: null,
    metadata: { topic: "Cardiac Syncytium", priority: "medium" },
  },

  {
    id: "patho-n5-006",
    type: "mcq",
    prompt: "Cardiac excitation-contraction coupling depends on BOTH extracellular Ca²⁺ entry AND SR Ca²⁺ release. Why is this different from skeletal muscle?",
    setup: "",
    ans: [
      { t: "Cardiac uses Ca²⁺-induced Ca²⁺ release — a small influx through the L-type (DHP) channel triggers SR release via RyR2", ok: true  },
      { t: "Cardiac T-tubules are too small to carry an action potential",                                                             ok: false },
      { t: "SR stores in cardiac muscle are too small to sustain contraction alone",                                                    ok: false },
      { t: "Cardiac DHPR is not voltage-sensitive",                                                                                       ok: false },
    ],
    rationale: "Cardiac muscle relies on calcium-induced Ca²⁺ release (CICR): a small Ca²⁺ influx through the sarcolemmal L-type channel activates RyR2 on the SR, releasing SR stores into the cytosol. Because the trigger is extracellular Ca²⁺ influx, cardiac contractility is acutely sensitive to serum Ca²⁺ and to L-type Ca²⁺ channel blockers (verapamil, diltiazem). Skeletal muscle does not require extracellular Ca²⁺ — DHPR mechanically pulls RyR1 open without any Ca²⁺ flux.",
    scene: "action_potential",
    sceneCfg: { label: "CICR — CARDIAC EC COUPLING", phase: 'repol' },
    metadata: { topic: "CICR", priority: "high" },
  },

  {
    id: "patho-n5-007",
    type: "mcq",
    prompt: "Phase 4 depolarization in the SA node — the spontaneous drift to threshold — is driven primarily by what current?",
    setup: "",
    ans: [
      { t: "If (funny current) — inward Na⁺ through HCN channels, with declining K⁺ efflux", ok: true  },
      { t: "Inward Cl⁻ current through CLIC channels",                                         ok: false },
      { t: "Electrogenic contribution of the Na⁺/K⁺-ATPase alone",                             ok: false },
      { t: "Ca²⁺ efflux via the Na⁺/Ca²⁺ exchanger",                                          ok: false },
    ],
    rationale: "The 'funny' current (If) through HCN channels carries inward Na⁺ at hyperpolarized potentials, slowly depolarizing the SA nodal cell toward threshold. Simultaneously, K⁺ efflux wanes. β₁ agonism accelerates If (faster rate); vagal tone slows it. Ivabradine is a clinical HCN blocker that slows heart rate without negative inotropy.",
    scene: "ecg_waveform",
    sceneCfg: { label: "SA NODE PHASE 4 — FUNNY CURRENT", rhythm: 'sinus', rate: 70 },
    metadata: { topic: "SA Pacemaker", priority: "medium" },
  },

  {
    id: "patho-n5-008",
    type: "mcq",
    prompt: "Which change in membrane potential best explains the increased rate of SA nodal firing after administration of isoproterenol?",
    setup: "",
    ans: [
      { t: "Steeper slope of Phase 4 (faster diastolic depolarization) reaching threshold sooner", ok: true  },
      { t: "More negative maximum diastolic potential",                                             ok: false },
      { t: "Higher threshold potential",                                                             ok: false },
      { t: "Longer refractory period",                                                                ok: false },
    ],
    rationale: "β₁ stimulation increases If (via cAMP → PKA → HCN), accelerating Phase 4 diastolic depolarization. Steeper slope = reach threshold faster = faster firing rate. Vagal stimulation does the opposite: it hyperpolarizes max diastolic potential and flattens the Phase 4 slope, slowing the rate.",
    scene: "action_potential",
    sceneCfg: { label: "β₁ STIM — STEEPER PHASE 4", phase: 'depol' },
    metadata: { topic: "Autonomic Modulation", priority: "high" },
  },

  {
    id: "patho-n5-009",
    type: "short",
    prompt: "What carries impulses from the left atrium so that both atria depolarize nearly simultaneously? (eponymous structure)",
    setup: "",
    acceptedAnswers: ["Bachmann's bundle", "Bachmanns bundle", "Bachmann bundle", "anterior interatrial band", "Bachmann"],
    canonicalAnswer: "Bachmann's bundle",
    rationale: "Bachmann's bundle (the anterior interatrial band) conducts impulses from the right atrium to the left atrium, ensuring simultaneous atrial depolarization. Disruption is one mechanism for interatrial block seen on ECG.",
    scene: null,
    metadata: { topic: "Atrial Conduction", priority: "low" },
  },

  {
    id: "patho-n5-010",
    type: "mcq",
    prompt: "Complete (third-degree) heart block most commonly causes syncope when the ventricular escape rhythm is too slow. What syndrome describes transient loss of consciousness from these pauses?",
    setup: "",
    ans: [
      { t: "Stokes-Adams syndrome",        ok: true  },
      { t: "Wolff-Parkinson-White",        ok: false },
      { t: "Wellens syndrome",             ok: false },
      { t: "Brugada syndrome",             ok: false },
    ],
    rationale: "Stokes-Adams: the delay between loss of SA conduction and emergence of a slower escape pacemaker causes 5–20 sec of brain hypoperfusion and transient loss of consciousness. Guyton names this specifically because it illustrates why heart block can be lethal even when an escape rhythm eventually emerges.",
    scene: "ecg_waveform",
    sceneCfg: { label: "STOKES-ADAMS — CB HEART BLOCK", rhythm: 'sinus', rate: 35 },
    metadata: { topic: "Heart Block", priority: "medium" },
  },

  {
    id: "patho-n5-011",
    type: "mcq",
    prompt: "Why does cardiac muscle not tetanize like skeletal muscle?",
    setup: "",
    ans: [
      { t: "Its absolute refractory period is nearly as long as the contraction itself, so no summation is possible",  ok: true  },
      { t: "It lacks troponin C",                                                                                        ok: false },
      { t: "Its cross-bridges are irreversibly attached",                                                                  ok: false },
      { t: "Its sarcoplasmic reticulum cannot release Ca²⁺ more than once per minute",                                     ok: false },
    ],
    rationale: "Cardiac ARP (~0.25–0.30 sec) overlaps almost the entire mechanical contraction. A second stimulus during the plateau phase cannot re-excite the cell, so twitches cannot summate into tetanus. This is a critical design feature — tetanic cardiac contraction would stop cardiac output instantly.",
    scene: "action_potential",
    sceneCfg: { label: "NO CARDIAC TETANUS — LONG ARP", phase: 'repol' },
    metadata: { topic: "Refractoriness", priority: "medium" },
  },

  {
    id: "patho-n5-012",
    type: "mcq",
    prompt: "The ECG 'QRS time' (normal <0.12 sec, usually ~0.06 sec) corresponds primarily to which conduction interval?",
    setup: "",
    ans: [
      { t: "Transmission from the common AV bundle through the Purkinje system to the last ventricular fibers",  ok: true  },
      { t: "Delay within the AV node",                                                                            ok: false },
      { t: "Spread of depolarization across both atria",                                                           ok: false },
      { t: "Repolarization of ventricles through the T wave",                                                      ok: false },
    ],
    rationale: "QRS duration reflects time for the impulse to travel from the AV bundle/His through the left and right bundles and Purkinje system to complete ventricular depolarization. Widening of QRS (>0.12 sec) indicates abnormal conduction — bundle branch block, ventricular escape beats, hyperkalemia, or sodium channel blockade (e.g., TCA overdose).",
    scene: "ecg_waveform",
    sceneCfg: { label: "QRS = PURKINJE TRANSIT TIME", rhythm: 'sinus', rate: 75 },
    metadata: { topic: "QRS Interval", priority: "medium" },
  },

];

export const PATHO_NODE5_METADATA = {
  nodeId:   "patho-node-5",
  courseId: "adv-phys-path-1",
  chapter:  "Chapters 9–10",
  title:    "Cardiac Muscle & Rhythmic Excitation",
  totalQuestions: PATHO_NODE5_QUESTIONS.length,
  questionTypes: {
    mcq:   PATHO_NODE5_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: PATHO_NODE5_QUESTIONS.filter(q => q.type === 'multi').length,
    short: PATHO_NODE5_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
