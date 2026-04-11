/**
 * Advanced Physiology & Pathophysiology — Node 7
 * Chapters 13–14: Cardiac Arrhythmias / Overview of the Circulation
 * Source: Guyton & Hall 14e (local extracted text)
 */

export const PATHO_NODE7_QUESTIONS = [

  {
    id: "patho-n7-001",
    type: "mcq",
    prompt: "A patient has a PR interval of 0.28 sec that is constant beat-to-beat, with every P followed by a QRS. What degree of heart block is this?",
    setup: "",
    ans: [
      { t: "First-degree AV block — constant prolonged PR",    ok: true  },
      { t: "Second-degree Mobitz type I (Wenckebach pattern)",  ok: false },
      { t: "Second-degree Mobitz type II with dropped beats",   ok: false },
      { t: "Third-degree (complete) heart block, AV dissociated", ok: false },
    ],
    rationale: "Normal PR is 0.12–0.20 sec. A constant PR >0.20 sec with every P followed by a QRS is first-degree AV block — delay in the AV node but every impulse conducts. Usually benign. Wenckebach progressively lengthens PR until a beat is dropped; Mobitz II drops beats without warning; complete heart block has no P–QRS relationship at all.",
    scene: "ecg_waveform",
    sceneCfg: { label: "1° AV BLOCK — PR >0.20 SEC", rhythm: 'sinus', rate: 70 },
    metadata: { topic: "AV Blocks", priority: "high" },
  },

  {
    id: "patho-n7-002",
    type: "mcq",
    prompt: "Which component of the systemic circulation holds the LARGEST percentage of total blood volume at any moment?",
    setup: "",
    ans: [
      { t: "Systemic veins and venules — about 60% of total blood volume",    ok: true  },
      { t: "Systemic arteries and large conduit vessels — roughly 15% of volume", ok: false },
      { t: "Pulmonary arteries, veins, and capillaries — roughly 9% of volume",   ok: false },
      { t: "Systemic capillaries at the microcirculatory exchange level — ~5%",   ok: false },
    ],
    rationale: "About 60% of total blood volume sits in the systemic venous capacitance vessels; arteries hold ~15%, heart ~7%, pulmonary circuit ~9%, capillaries ~5%. Veins are highly compliant (capacitance ~20× arteries), making them the body's blood reservoir. Sympathetic venoconstriction squeezes blood from the venous pool into effective circulating volume — a key compensation in hemorrhage.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "VENOUS CAPACITANCE ≈ 60% OF BLOOD VOLUME", radius: 80, wall: 6 },
    metadata: { topic: "Distribution of Blood Volume", priority: "high" },
  },

  {
    id: "patho-n7-003",
    type: "mcq",
    prompt: "In which segment of the circulation is total cross-sectional area GREATEST, and what consequence does this have for flow velocity?",
    setup: "",
    ans: [
      { t: "Capillaries — huge aggregate area → slowest linear velocity → maximal diffusion transit time", ok: true  },
      { t: "Aorta — the largest single vessel in the body, producing fastest linear flow velocity",          ok: false },
      { t: "Arterioles — greatest resistance vessels, so slowest linear flow velocity in the circulation",    ok: false },
      { t: "Venae cavae — draining all systemic blood back to the right atrium, so the slowest velocity",     ok: false },
    ],
    rationale: "Flow velocity = cardiac output / total cross-sectional area. The aorta has the smallest area (~2.5 cm²) and fastest velocity (~33 cm/sec). Capillaries collectively have ~2500 cm² and velocity drops to ~0.3 mm/sec — long enough transit for O₂, CO₂, nutrients, and waste to diffuse. This is the anatomic reason capillaries are the exchange vessels.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "CAPILLARIES — MAX AREA, MIN VELOCITY", radius: 30, wall: 4 },
    metadata: { topic: "Cross-sectional Area", priority: "high" },
  },

  {
    id: "patho-n7-004",
    type: "mcq",
    prompt: "Which vessel type is the PRIMARY determinant of systemic vascular resistance?",
    setup: "",
    ans: [
      { t: "Arterioles — the 'stopcocks' of the circulation",  ok: true  },
      { t: "Capillaries — the thin-walled exchange vessels",     ok: false },
      { t: "Large systemic veins holding venous capacitance",    ok: false },
      { t: "Aorta — the largest-diameter conduit vessel",        ok: false },
    ],
    rationale: "Resistance is inversely proportional to the fourth power of radius (Poiseuille). Arterioles (the 'stopcocks of the circulation') are small-bore, heavily muscled, and densely innervated by sympathetic fibers, so they dominate systemic vascular resistance. Tiny changes in arteriolar tone produce huge changes in pressure — which is why SVR is the main target of vasoactive drug therapy.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "ARTERIOLE — RESISTANCE VESSEL", radius: 40, wall: 18,
      eqLines: ["R ∝ 1/r⁴ (Poiseuille)", "ΔP = Q × R"]
    },
    metadata: { topic: "Resistance", priority: "high" },
  },

  {
    id: "patho-n7-005",
    type: "multi",
    prompt: "Select the THREE properties that make veins behave differently from arteries:",
    setup: "",
    choices: [
      "High compliance — large volume change for a small change in transmural pressure",
      "Serve as the body's main blood volume reservoir holding about 60% of total volume",
      "Thinner walls with less smooth muscle relative to lumen diameter than arteries",
      "Greater contribution to systemic vascular resistance than arterioles under normal tone",
      "Higher elastic recoil pressure than the aorta during normal systolic ventricular ejection",
    ],
    correctAnswers: [
      "High compliance — large volume change for a small change in transmural pressure",
      "Serve as the body's main blood volume reservoir holding about 60% of total volume",
      "Thinner walls with less smooth muscle relative to lumen diameter than arteries",
    ],
    selectCount: 3,
    rationale: "Veins are ~20× more compliant than arteries: thin walls, large lumen, relatively little smooth muscle. They store ~60% of total blood volume and respond to sympathetic tone by squeezing that reservoir toward the heart. Resistance is overwhelmingly an arteriolar property; elastic recoil is an arterial property.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "VEIN — CAPACITANCE VESSEL", radius: 85, wall: 3 },
    metadata: { topic: "Venous Function", priority: "high" },
  },

  {
    id: "patho-n7-006",
    type: "mcq",
    prompt: "A 72-year-old with chronic AFib presents in ventricular tachycardia that terminates spontaneously. Which pathophysiologic mechanism MOST commonly underlies monomorphic VT in a patient with prior MI?",
    setup: "",
    ans: [
      { t: "Reentrant circuit around a scar — slow-conducting border zone with unidirectional block", ok: true  },
      { t: "Enhanced automaticity of Purkinje fibers near the scar edge, firing faster than the SA",   ok: false },
      { t: "Triggered activity from early afterdepolarizations during a prolonged Phase 2 plateau",     ok: false },
      { t: "AV nodal reentry with anterograde slow and retrograde fast conduction across the AV node",   ok: false },
    ],
    rationale: "Reentry around a fixed scar from prior infarction is the most common mechanism of monomorphic VT in structural heart disease. Two conditions are required: unidirectional block in one limb and slow conduction in another, so the wavefront can re-enter previously excited tissue that has recovered excitability. AV nodal reentry causes SVT, not VT. EADs cause torsades (polymorphic VT in long QT).",
    scene: "ecg_waveform",
    sceneCfg: { label: "REENTRY VT — FIXED SCAR CIRCUIT", rhythm: 'vtach', rate: 180 },
    metadata: { topic: "VT Mechanisms", priority: "high" },
  },

  {
    id: "patho-n7-007",
    type: "mcq",
    prompt: "Which arrhythmia is typically caused by EARLY afterdepolarizations (EADs) in the setting of long QT?",
    setup: "",
    ans: [
      { t: "Torsades de pointes — polymorphic VT with a twisting QRS axis",   ok: true  },
      { t: "Atrial fibrillation — chaotic atrial activity and irregular RR",    ok: false },
      { t: "Monomorphic VT — a scar-based reentrant circuit post-infarct",      ok: false },
      { t: "Ventricular fibrillation from a single fixed reentrant circuit",     ok: false },
    ],
    rationale: "EADs occur during Phase 2 or Phase 3 of the action potential when IKr is reduced (acquired long QT from drugs like quinolones, haloperidol, methadone; or hereditary LQT1–3). The EAD triggers a PVC that lands on the relative refractory period (the 'R on T' phenomenon) and initiates torsades de pointes. Treatment: IV magnesium, correct K⁺, remove offending drugs, overdrive pace.",
    scene: "ecg_waveform",
    sceneCfg: { label: "TORSADES — EAD + LONG QT", rhythm: 'vtach', rate: 260 },
    metadata: { topic: "EAD / Torsades", priority: "high" },
  },

  {
    id: "patho-n7-008",
    type: "mcq",
    prompt: "The 'P × V = constant' relationship across the systemic circulation is effectively what clinical law?",
    setup: "",
    ans: [
      { t: "Ohm's law applied to flow: ΔP = Q × R (driving pressure equals flow times resistance)", ok: true  },
      { t: "Boyle's law for ideal gases at constant temperature — pressure inversely with volume",    ok: false },
      { t: "Laplace's law for a curved surface — wall tension scales with pressure times radius",      ok: false },
      { t: "Bernoulli's principle relating pressure and velocity in an incompressible fluid stream",    ok: false },
    ],
    rationale: "The cardiovascular analog of Ohm's law: pressure drop = flow × resistance (ΔP = Q × R). Substituting: MAP − CVP ≈ CO × SVR. Because CVP is typically small, MAP ≈ CO × SVR — the single most-used equation at the bedside for reasoning about hypotension.",
    scene: null,
    metadata: { topic: "Ohm's Law of Circulation", priority: "high" },
  },

  {
    id: "patho-n7-009",
    type: "mcq",
    prompt: "Why is atrial fibrillation particularly dangerous in a patient with severe mitral stenosis?",
    setup: "",
    ans: [
      { t: "Loss of atrial kick cuts ~30% of diastolic filling across the stenotic valve, causing pulmonary edema", ok: true  },
      { t: "AFib causes rapid ectopic depolarization of the sinoatrial node and overdrives the normal pacemaker",    ok: false },
      { t: "AFib mechanically ruptures the stiffened mitral leaflets and causes acute regurgitant flow reversal",    ok: false },
      { t: "AFib directly causes complete AV nodal block with no escape rhythm from ventricular myocytes at all",      ok: false },
    ],
    rationale: "In mitral stenosis, left ventricular filling already depends heavily on the high-pressure gradient driven by the atrial kick across the narrow valve. When AFib removes coordinated atrial contraction, LV filling plummets, pulmonary venous pressure climbs, and acute pulmonary edema can ensue. This is one reason mitral-stenosis patients are anticoagulated and aggressively rate-controlled or cardioverted.",
    scene: "ecg_waveform",
    sceneCfg: { label: "AFib + MS = BAD FILL", rhythm: 'afib', rate: 130 },
    metadata: { topic: "AFib & Valve Disease", priority: "high" },
  },

  {
    id: "patho-n7-010",
    type: "short",
    prompt: "What term describes the brief period of brain hypoperfusion during the delay between SA failure and emergence of an AV or ventricular escape rhythm, producing transient loss of consciousness?",
    setup: "",
    acceptedAnswers: ["Stokes-Adams", "Stokes Adams", "Stokes-Adams syndrome", "Stokes-Adams attack"],
    canonicalAnswer: "Stokes-Adams syndrome",
    rationale: "Stokes-Adams attacks are syncopal episodes during 5–20 sec of ventricular asystole that precede an escape rhythm. A pacemaker is indicated because future episodes are unpredictable and potentially lethal.",
    scene: null,
    metadata: { topic: "Stokes-Adams", priority: "medium" },
  },

  {
    id: "patho-n7-011",
    type: "mcq",
    prompt: "Which fluid flow regime describes blood in the aorta during the peak of systolic ejection, and what happens to it clinically?",
    setup: "",
    ans: [
      { t: "It can become turbulent — audible flow murmurs and increased endothelial shear stress can occur", ok: true  },
      { t: "It is always strictly laminar in the healthy adult aorta under normal resting cardiac output",     ok: false },
      { t: "It is exclusively pulsatile but never turbulent regardless of ejection velocity or flow rate",      ok: false },
      { t: "It is governed by free-surface hydraulics similar to open channel gravitational fluid mechanics",    ok: false },
    ],
    rationale: "Turbulence is predicted by Reynolds number (Re = ρvd/η). At peak aortic flow Re exceeds the critical threshold of ~2000 and flow becomes turbulent — audible as physiologic murmurs, especially in high-output states, anemia, or aortic valve disease. Turbulence is energetically costly (pressure drop ∝ v²) and is why stenotic valves dramatically raise afterload.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "TURBULENCE — HIGH Re", radius: 75, wall: 10 },
    metadata: { topic: "Flow Regimes", priority: "medium" },
  },

  {
    id: "patho-n7-012",
    type: "mcq",
    prompt: "A patient with long-standing hypertension has increasing systolic pressure but falling diastolic pressure, widening pulse pressure. Which vessel-wall change explains this pattern?",
    setup: "",
    ans: [
      { t: "Loss of aortic compliance (stiffening) — less elastic recoil, higher systolic peak, lower diastolic trough", ok: true  },
      { t: "Widespread peripheral arteriolar vasodilation lowering SVR and reducing both systolic and diastolic pressures", ok: false },
      { t: "Increased whole-blood viscosity from polycythemia, altering flow characteristics throughout the arterial tree",  ok: false },
      { t: "Reduced intravascular blood volume from chronic diuretic therapy, flattening the arterial pressure waveform",     ok: false },
    ],
    rationale: "In healthy aorta, elastic recoil during diastole propels blood forward and maintains diastolic pressure (the Windkessel effect). As the aorta stiffens with age and hypertension, systolic pressure rises because the stiff aorta can't buffer ejection, and diastolic pressure falls because recoil is lost. The widening pulse pressure is a hallmark of isolated systolic hypertension in the elderly.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "STIFF AORTA → WIDE PULSE PRESSURE", radius: 72, wall: 22 },
    metadata: { topic: "Compliance", priority: "high" },
  },

];

export const PATHO_NODE7_METADATA = {
  nodeId:   "patho-node-7",
  courseId: "adv-phys-path-1",
  chapter:  "Chapters 13–14",
  title:    "Arrhythmias & Overview of the Circulation",
  totalQuestions: PATHO_NODE7_QUESTIONS.length,
  questionTypes: {
    mcq:   PATHO_NODE7_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: PATHO_NODE7_QUESTIONS.filter(q => q.type === 'multi').length,
    short: PATHO_NODE7_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
