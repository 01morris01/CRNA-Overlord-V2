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
      { t: "Phase 2 plateau — sustained by slow L-type Ca²⁺ influx against K⁺ efflux", ok: true  },
      { t: "Phase 0 upstroke — carried by fast voltage-gated Na⁺ channels",             ok: false },
      { t: "Phase 4 resting potential — stabilized by inward-rectifier K⁺ leak",        ok: false },
      { t: "Hyperpolarization afterpotential — driven by delayed rectifier K⁺ current", ok: false },
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
      { t: "L-type Ca²⁺ and slow Na⁺/Ca²⁺ channels activated near ~−40 mV threshold", ok: true  },
      { t: "Fast voltage-gated Na⁺ channels, identical to ventricular working muscle",  ok: false },
      { t: "Inward rectifier K⁺ channels stabilizing the maximum diastolic potential",   ok: false },
      { t: "HCN 'funny current' channels producing the upstroke of the action potential", ok: false },
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
      { t: "SA 70–80 / AV 40–60 / Purkinje 15–40 bpm (normal hierarchy)", ok: true  },
      { t: "SA 40–60 / AV 70–80 / Purkinje 100+ bpm (inverted hierarchy)", ok: false },
      { t: "SA 100+ / AV 70–80 / Purkinje 40–60 bpm (SA supranormal rate)", ok: false },
      { t: "All three pacemakers fire at the same intrinsic rate of 60 bpm", ok: false },
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
      { t: "To synchronize ventricular depolarization with the opening of the aortic semilunar valve outflow",   ok: false },
      { t: "To prolong diastole so the coronary arteries can perfuse the left ventricular myocardium longer",    ok: false },
      { t: "To give the bundle of His time to fully recover from its absolute refractory period between beats",   ok: false },
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
      "Direct cell-to-cell transmission of action potentials through the intercalated discs",
      "Fibrous AV insulator electrically separating atrial and ventricular functional syncytia",
      "Continuous cytoplasm between every myocyte, forming a true multinucleate syncytium",
      "A single shared sarcoplasmic reticulum spanning all ventricular myocytes together",
    ],
    correctAnswers: [
      "Low-resistance gap junctions in intercalated discs (1/400 the resistance of sarcolemma)",
      "Direct cell-to-cell transmission of action potentials through the intercalated discs",
      "Fibrous AV insulator electrically separating atrial and ventricular functional syncytia",
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
      { t: "Cardiac uses Ca²⁺-induced Ca²⁺ release — small influx through L-type DHPR triggers RyR2 SR release", ok: true  },
      { t: "Cardiac T-tubules are too small to carry the propagating action potential to the cell interior",     ok: false },
      { t: "Sarcoplasmic reticulum stores in cardiac muscle are too small to sustain contraction on their own",  ok: false },
      { t: "Cardiac DHP receptor is not voltage-sensitive and therefore cannot mechanically open RyR1 channels",  ok: false },
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
      { t: "Inward Cl⁻ current through CLIC channels, slowly depolarizing the cell to threshold", ok: false },
      { t: "The electrogenic contribution of the Na⁺/K⁺-ATPase acting alone on the cell membrane", ok: false },
      { t: "Ca²⁺ efflux via the Na⁺/Ca²⁺ exchanger working in forward mode during diastole",         ok: false },
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
      { t: "Steeper slope of Phase 4 diastolic depolarization — threshold is reached sooner", ok: true  },
      { t: "More negative maximum diastolic potential, hyperpolarizing the nodal cell",        ok: false },
      { t: "Higher firing threshold potential, so the cell must depolarize further to fire",    ok: false },
      { t: "Longer absolute refractory period, limiting the interval between action potentials", ok: false },
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
      { t: "Stokes-Adams syndrome — transient LOC from an AV block escape pause",      ok: true  },
      { t: "Wolff-Parkinson-White — pre-excitation via an accessory AV conduction path", ok: false },
      { t: "Wellens syndrome — biphasic T waves in V2–V3 signaling proximal LAD stenosis", ok: false },
      { t: "Brugada syndrome — coved ST elevation in V1–V2 with sudden cardiac death risk", ok: false },
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
      { t: "Its absolute refractory period is nearly as long as the contraction itself, preventing twitch summation", ok: true  },
      { t: "It lacks troponin C, so Ca²⁺ cannot bind the thin filament to expose actin binding sites for myosin",       ok: false },
      { t: "Its actin-myosin cross-bridges become irreversibly attached during each contraction and cannot detach",     ok: false },
      { t: "Its sarcoplasmic reticulum is incapable of releasing Ca²⁺ more than once per minute under any condition",    ok: false },
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
      { t: "Transit of the impulse from the AV bundle through the Purkinje system to the last ventricular fibers",  ok: true  },
      { t: "Conduction delay within the AV node between atrial input and bundle of His entry, roughly 0.09 sec",      ok: false },
      { t: "Spread of depolarization across both atria from the SA node to the AV node input during normal sinus",    ok: false },
      { t: "Repolarization of the ventricles during the K⁺-driven T wave following the plateau phase of the AP",        ok: false },
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
