/**
 * Cardiac Physiology — Chapter 4 (Node 4)
 * Basics of Anesthesia course
 * 100 questions: MCQ + multi-select
 */

export const CARDIAC_QUESTIONS = [

  // ── boa-node4-cardiac-001 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-001",
    type: "mcq",
    prompt: "Which cellular structure allows cardiac action potentials to travel easily from one muscle cell to the next?",
    setup: "",
    ans: [
      { t: "Permeable gap junctions.", ok: true },
      { t: "Impermeable tight junctions.", ok: false },
      { t: "Actin filaments.", ok: false },
      { t: "Myosin filaments.", ok: false },
    ],
    rationale: "Gap junctions allow rapid diffusion of ions and electrical activity between cardiac muscle cells.",
    metadata: { topic: "Cellular Structure", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "cellular structure", "gap junctions", "conduction"] }
  },

  // ── boa-node4-cardiac-002 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-002",
    type: "multi",
    prompt: "Cardiac muscle tissue is characterized by which structural features? Select 3.",
    setup: "",
    choices: [
      "Myofibrils containing actin and myosin.",
      "Intercalated discs.",
      "Permeable gap junctions.",
      "Complete absence of striations.",
      "Impermeable barrier discs.",
    ],
    correctAnswers: [
      "Myofibrils containing actin and myosin.",
      "Intercalated discs.",
      "Permeable gap junctions.",
    ],
    selectCount: 3,
    rationale: "Cardiac muscle is striated and contains actin, myosin, intercalated discs, and gap junctions.",
    metadata: { topic: "Cellular Structure", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "histology", "intercalated discs"] }
  },

  // ── boa-node4-cardiac-003 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-003",
    type: "mcq",
    prompt: "Because cardiac cells are highly interconnected, the heart operates as what physiological entity?",
    setup: "",
    ans: [
      { t: "A functional syncytium.", ok: true },
      { t: "A functional isolation.", ok: false },
      { t: "An unstriated muscle.", ok: false },
      { t: "A somatic motor unit.", ok: false },
    ],
    rationale: "The heart behaves as a functional syncytium because excitation spreads between interconnected cells.",
    metadata: { topic: "Cellular Structure", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "syncytium", "conduction"] }
  },

  // ── boa-node4-cardiac-004 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-004",
    type: "mcq",
    prompt: "Which order correctly lists the heart wall layers from outermost to innermost?",
    setup: "",
    ans: [
      { t: "Pericardium, Epicardium, Myocardium, Endocardium.", ok: true },
      { t: "Endocardium, Myocardium, Epicardium, Pericardium.", ok: false },
      { t: "Epicardium, Pericardium, Myocardium, Endocardium.", ok: false },
      { t: "Myocardium, Endocardium, Pericardium, Epicardium.", ok: false },
    ],
    rationale: "From outermost to innermost: pericardium, epicardium, myocardium, then endocardium.",
    metadata: { topic: "Heart Wall Anatomy", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "anatomy", "heart wall"] }
  },

  // ── boa-node4-cardiac-005 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-005",
    type: "mcq",
    prompt: "Which heart layer contains the contractile machinery?",
    setup: "",
    ans: [
      { t: "Myocardium.", ok: true },
      { t: "Endocardium.", ok: false },
      { t: "Epicardium.", ok: false },
      { t: "Pericardium.", ok: false },
    ],
    rationale: "The myocardium is the thick muscular layer that performs contraction.",
    metadata: { topic: "Heart Wall Anatomy", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "myocardium", "anatomy"] }
  },

  // ── boa-node4-cardiac-006 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-006",
    type: "mcq",
    prompt: "The epicardium is anatomically synonymous with which structure?",
    setup: "",
    ans: [
      { t: "Visceral pericardium.", ok: true },
      { t: "Parietal pericardium.", ok: false },
      { t: "Visceral endocardium.", ok: false },
      { t: "Parietal endocardium.", ok: false },
    ],
    rationale: "The epicardium is the visceral layer of the pericardium.",
    metadata: { topic: "Heart Wall Anatomy", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "epicardium", "pericardium"] }
  },

  // ── boa-node4-cardiac-007 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-007",
    type: "mcq",
    prompt: "What specialized structure rapidly activates the left atrium from the right atrium?",
    setup: "",
    ans: [
      { t: "Bachmann's bundle.", ok: true },
      { t: "Bundle of His.", ok: false },
      { t: "Purkinje fibers.", ok: false },
      { t: "AV nodal fibers.", ok: false },
    ],
    rationale: "Bachmann's bundle conducts impulses from the right atrium to the left atrium.",
    metadata: { topic: "Cardiac Conduction", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "conduction", "atria"] }
  },

  // ── boa-node4-cardiac-008 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-008",
    type: "mcq",
    prompt: "What event directly follows myocardial cell depolarization?",
    setup: "",
    ans: [
      { t: "Calcium release allowing contraction.", ok: true },
      { t: "Potassium release allowing contraction.", ok: false },
      { t: "Calcium reuptake causing relaxation.", ok: false },
      { t: "Sodium reuptake causing relaxation.", ok: false },
    ],
    rationale: "Depolarization triggers calcium release and excitation-contraction coupling.",
    metadata: { topic: "Cardiac Conduction", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "excitation-contraction coupling", "calcium"] }
  },

  // ── boa-node4-cardiac-009 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-009",
    type: "mcq",
    prompt: "During the initial depolarization phase of a cardiac cell membrane, which ion rapidly moves into the cell?",
    setup: "",
    ans: [
      { t: "Sodium.", ok: true },
      { t: "Potassium.", ok: false },
      { t: "Chloride.", ok: false },
      { t: "Magnesium.", ok: false },
    ],
    rationale: "Rapid sodium influx initiates depolarization.",
    metadata: { topic: "Cardiac Conduction", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "action potential", "sodium"] }
  },

  // ── boa-node4-cardiac-010 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-010",
    type: "mcq",
    prompt: "During repolarization of a cardiac cell membrane, which ionic movement occurs?",
    setup: "",
    ans: [
      { t: "Potassium moves out of the cell.", ok: true },
      { t: "Potassium moves into the cell.", ok: false },
      { t: "Sodium moves out of the cell.", ok: false },
      { t: "Sodium moves into the cell.", ok: false },
    ],
    rationale: "Repolarization occurs as potassium exits the cell.",
    metadata: { topic: "Cardiac Conduction", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "action potential", "potassium"] }
  },

  // ── boa-node4-cardiac-011 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-011",
    type: "mcq",
    prompt: "During Phase 4 of the cardiac action potential, what movement restores the gradient according to this source set?",
    setup: "",
    ans: [
      { t: "Potassium goes back into the cell.", ok: true },
      { t: "Potassium leaves the cell.", ok: false },
      { t: "Sodium enters the cell.", ok: false },
      { t: "Calcium leaves the cell.", ok: false },
    ],
    rationale: "This source set describes Phase 4 as restoration of the gradient with potassium returning into the cell.",
    metadata: { topic: "Cardiac Conduction", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "action potential", "phase 4"] }
  },

  // ── boa-node4-cardiac-012 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-012",
    type: "multi",
    prompt: "Which structures are part of the normal cardiac conductive system? Select 4.",
    setup: "",
    choices: [
      "SA node.",
      "Internodal tracts.",
      "AV node.",
      "Purkinje system.",
      "Chordae tendineae.",
      "Papillary muscles.",
    ],
    correctAnswers: [
      "SA node.",
      "Internodal tracts.",
      "AV node.",
      "Purkinje system.",
    ],
    selectCount: 4,
    rationale: "The cardiac conductive system includes the SA node, internodal pathways, AV node, and Purkinje system.",
    metadata: { topic: "Cardiac Conduction", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "conduction system"] }
  },

  // ── boa-node4-cardiac-013 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-013",
    type: "mcq",
    prompt: "Which structures tension the chordae tendineae and prevent atrioventricular valve prolapse?",
    setup: "",
    ans: [
      { t: "Papillary muscles.", ok: true },
      { t: "Semilunar leaflets.", ok: false },
      { t: "Purkinje fibers.", ok: false },
      { t: "Myocardial septa.", ok: false },
    ],
    rationale: "Papillary muscles maintain tension on the chordae tendineae to prevent valve prolapse.",
    metadata: { topic: "Valve Anatomy", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "valves", "papillary muscles"] }
  },

  // ── boa-node4-cardiac-014 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-014",
    type: "multi",
    prompt: "Which valves are semilunar valves? Select 2.",
    setup: "",
    choices: [
      "Aortic valve.",
      "Pulmonic valve.",
      "Mitral valve.",
      "Tricuspid valve.",
    ],
    correctAnswers: [
      "Aortic valve.",
      "Pulmonic valve.",
    ],
    selectCount: 2,
    rationale: "The semilunar valves are the aortic and pulmonic valves.",
    metadata: { topic: "Valve Anatomy", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "valves", "semilunar"] }
  },

  // ── boa-node4-cardiac-015 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-015",
    type: "multi",
    prompt: "Which valves are atrioventricular valves? Select 2.",
    setup: "",
    choices: [
      "Mitral valve.",
      "Tricuspid valve.",
      "Aortic valve.",
      "Pulmonic valve.",
    ],
    correctAnswers: [
      "Mitral valve.",
      "Tricuspid valve.",
    ],
    selectCount: 2,
    rationale: "The atrioventricular valves are the mitral and tricuspid valves.",
    metadata: { topic: "Valve Anatomy", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "valves", "atrioventricular"] }
  },

  // ── boa-node4-cardiac-016 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-016",
    type: "mcq",
    prompt: "Through which valve does blood flow immediately after exiting the right atrium?",
    setup: "",
    ans: [
      { t: "Tricuspid valve.", ok: true },
      { t: "Mitral valve.", ok: false },
      { t: "Pulmonic valve.", ok: false },
      { t: "Aortic valve.", ok: false },
    ],
    rationale: "Blood flows from the right atrium through the tricuspid valve into the right ventricle.",
    metadata: { topic: "Blood Flow Through the Heart", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "blood flow", "valves"] }
  },

  // ── boa-node4-cardiac-017 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-017",
    type: "mcq",
    prompt: "Through which valve does blood flow immediately after exiting the left atrium?",
    setup: "",
    ans: [
      { t: "Mitral valve.", ok: true },
      { t: "Tricuspid valve.", ok: false },
      { t: "Pulmonic valve.", ok: false },
      { t: "Aortic valve.", ok: false },
    ],
    rationale: "Blood flows from the left atrium through the mitral valve into the left ventricle.",
    metadata: { topic: "Blood Flow Through the Heart", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "blood flow", "valves"] }
  },

  // ── boa-node4-cardiac-018 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-018",
    type: "mcq",
    prompt: "Where do the right and left coronary arteries originate?",
    setup: "",
    ans: [
      { t: "At the coronary ostia at the base of the aorta.", ok: true },
      { t: "At the coronary ostia at the base of the pulmonary artery.", ok: false },
      { t: "At the distal arch of the ascending aorta.", ok: false },
      { t: "At the distal arch of the descending aorta.", ok: false },
    ],
    rationale: "The coronary arteries originate at the coronary ostia at the base of the aorta.",
    metadata: { topic: "Coronary Circulation", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "coronary circulation", "anatomy"] }
  },

  // ── boa-node4-cardiac-019 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-019",
    type: "mcq",
    prompt: "Which branch of the left coronary artery primarily supplies the anterior wall and anterior two-thirds of the septum?",
    setup: "",
    ans: [
      { t: "Left anterior descending artery.", ok: true },
      { t: "Left circumflex artery.", ok: false },
      { t: "Right coronary artery.", ok: false },
      { t: "Posterior descending artery.", ok: false },
    ],
    rationale: "The LAD supplies the anterior left ventricle and much of the septum.",
    metadata: { topic: "Coronary Circulation", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "coronary circulation", "LAD"] }
  },

  // ── boa-node4-cardiac-020 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-020",
    type: "mcq",
    prompt: "Which branch of the left coronary artery primarily supplies the lateral wall of the left ventricle?",
    setup: "",
    ans: [
      { t: "Left circumflex artery.", ok: true },
      { t: "Left anterior descending artery.", ok: false },
      { t: "Right coronary artery.", ok: false },
      { t: "Posterior descending artery.", ok: false },
    ],
    rationale: "The left circumflex artery primarily supplies the lateral wall of the left ventricle.",
    metadata: { topic: "Coronary Circulation", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "coronary circulation", "circumflex"] }
  },

  // ── boa-node4-cardiac-021 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-021",
    type: "mcq",
    prompt: "What percentage of SA node blood supply is typically provided by the left circumflex artery?",
    setup: "",
    ans: [
      { t: "40 to 50 percent.", ok: true },
      { t: "90 percent.", ok: false },
      { t: "Less than 10 percent.", ok: false },
      { t: "100 percent.", ok: false },
    ],
    rationale: "The left circumflex artery supplies approximately 40 to 50 percent of SA node blood flow.",
    metadata: { topic: "Coronary Circulation", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "coronary circulation", "SA node"] }
  },

  // ── boa-node4-cardiac-022 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-022",
    type: "mcq",
    prompt: "Which artery primarily supplies the right ventricle and the inferior-posterior wall of the left ventricle?",
    setup: "",
    ans: [
      { t: "Right coronary artery.", ok: true },
      { t: "Left anterior descending artery.", ok: false },
      { t: "Left circumflex artery.", ok: false },
      { t: "Coronary sinus artery.", ok: false },
    ],
    rationale: "The RCA supplies most of the right ventricle and the posterior-inferior left ventricle.",
    metadata: { topic: "Coronary Circulation", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "coronary circulation", "RCA"] }
  },

  // ── boa-node4-cardiac-023 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-023",
    type: "mcq",
    prompt: "What percentage of AV node blood supply is typically provided by the right coronary artery?",
    setup: "",
    ans: [
      { t: "90 percent.", ok: true },
      { t: "10 percent.", ok: false },
      { t: "40 percent.", ok: false },
      { t: "50 percent.", ok: false },
    ],
    rationale: "The RCA supplies about 90 percent of AV node blood flow.",
    metadata: { topic: "Coronary Circulation", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "coronary circulation", "AV node"] }
  },

  // ── boa-node4-cardiac-024 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-024",
    type: "multi",
    prompt: "Which venous systems drain the heart? Select 3.",
    setup: "",
    choices: [
      "Coronary sinus.",
      "Anterior cardiac veins.",
      "Thebesian veins.",
      "Superior vena cava.",
      "Inferior vena cava.",
    ],
    correctAnswers: [
      "Coronary sinus.",
      "Anterior cardiac veins.",
      "Thebesian veins.",
    ],
    selectCount: 3,
    rationale: "The coronary sinus, anterior cardiac veins, and Thebesian veins are the major venous drainage systems of the heart.",
    metadata: { topic: "Coronary Circulation", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "coronary circulation", "venous drainage"] }
  },

  // ── boa-node4-cardiac-025 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-025",
    type: "mcq",
    prompt: "The coronary sinus drains what percentage of venous blood returning from the left ventricle?",
    setup: "",
    ans: [
      { t: "75 percent.", ok: true },
      { t: "50 percent.", ok: false },
      { t: "25 percent.", ok: false },
      { t: "10 percent.", ok: false },
    ],
    rationale: "The coronary sinus drains about 75 percent of venous blood from the left ventricle.",
    metadata: { topic: "Coronary Circulation", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "coronary sinus", "venous drainage"] }
  },

  // ── boa-node4-cardiac-026 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-026",
    type: "mcq",
    prompt: "Through which vessels does venous blood from the right ventricle return to the right atrium?",
    setup: "",
    ans: [
      { t: "Anterior cardiac veins.", ok: true },
      { t: "Thebesian veins.", ok: false },
      { t: "Coronary sinus.", ok: false },
      { t: "Superior vena cava.", ok: false },
    ],
    rationale: "Venous blood from the right ventricle returns via the anterior cardiac veins.",
    metadata: { topic: "Coronary Circulation", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "venous drainage", "right ventricle"] }
  },

  // ── boa-node4-cardiac-027 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-027",
    type: "mcq",
    prompt: "Which equation correctly calculates coronary perfusion pressure?",
    setup: "",
    ans: [
      { t: "Arterial diastolic pressure minus LVEDP.", ok: true },
      { t: "Arterial systolic pressure minus LVEDP.", ok: false },
      { t: "MAP minus CVP.", ok: false },
      { t: "MAP minus LVEDP.", ok: false },
    ],
    rationale: "CPP equals arterial diastolic pressure minus left ventricular end-diastolic pressure.",
    metadata: { topic: "Coronary Perfusion Pressure", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "coronary perfusion pressure", "equations"] }
  },

  // ── boa-node4-cardiac-028 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-028",
    type: "mcq",
    prompt: "During which phase is the left ventricle predominantly perfused?",
    setup: "",
    ans: [
      { t: "Diastole.", ok: true },
      { t: "Systole.", ok: false },
      { t: "Both systole and diastole equally.", ok: false },
      { t: "Late systole only.", ok: false },
    ],
    rationale: "Left ventricular perfusion occurs mainly during diastole because systolic wall tension limits subendocardial flow.",
    metadata: { topic: "LV vs RV Perfusion Timing", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "coronary perfusion", "diastole"] }
  },

  // ── boa-node4-cardiac-029 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-029",
    type: "mcq",
    prompt: "During which phase is the right ventricle perfused?",
    setup: "",
    ans: [
      { t: "During both systole and diastole.", ok: true },
      { t: "Diastole only.", ok: false },
      { t: "Systole only.", ok: false },
      { t: "Early systole only.", ok: false },
    ],
    rationale: "Because RV intramural pressure is lower, perfusion occurs during both systole and diastole.",
    metadata: { topic: "LV vs RV Perfusion Timing", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "coronary perfusion", "right ventricle"] }
  },

  // ── boa-node4-cardiac-030 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-030",
    type: "mcq",
    prompt: "What percentage of oxygen does the coronary circulation extract at rest?",
    setup: "",
    ans: [
      { t: "60 to 70 percent.", ok: true },
      { t: "25 percent.", ok: false },
      { t: "80 to 90 percent.", ok: false },
      { t: "Less than 10 percent.", ok: false },
    ],
    rationale: "The coronary circulation extracts a very high fraction of oxygen at baseline, around 60 to 70 percent.",
    metadata: { topic: "Oxygen Extraction by the Heart", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "coronary circulation", "oxygen extraction"] }
  },

  // ── boa-node4-cardiac-031 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-031",
    type: "mcq",
    prompt: "Because the heart already extracts a high amount of oxygen at rest, how does it primarily meet increased oxygen demand?",
    setup: "",
    ans: [
      { t: "By vasodilation to increase blood flow.", ok: true },
      { t: "By vasoconstriction to increase blood pressure.", ok: false },
      { t: "By extracting much more oxygen per hemoglobin.", ok: false },
      { t: "By reducing heart rate.", ok: false },
    ],
    rationale: "The heart meets increased oxygen demand mainly by increasing coronary blood flow through vasodilation.",
    metadata: { topic: "Oxygen Extraction by the Heart", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "coronary blood flow", "oxygen supply-demand"] }
  },

  // ── boa-node4-cardiac-032 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-032",
    type: "multi",
    prompt: "Which are endogenous regulators of coronary blood flow? Select 3.",
    setup: "",
    choices: [
      "Adenosine.",
      "Nitric oxide.",
      "Adrenergic stimulation.",
      "Acetylcholinesterase.",
      "Exogenous epinephrine.",
    ],
    correctAnswers: [
      "Adenosine.",
      "Nitric oxide.",
      "Adrenergic stimulation.",
    ],
    selectCount: 3,
    rationale: "Adenosine, nitric oxide, and adrenergic stimulation regulate coronary blood flow.",
    metadata: { topic: "Coronary Circulation", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "coronary blood flow", "regulation"] }
  },

  // ── boa-node4-cardiac-033 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-033",
    type: "mcq",
    prompt: "Intraoperative hypotension lasting for as little as what duration is associated with increased postoperative morbidity and mortality?",
    setup: "",
    ans: [
      { t: "5 minutes.", ok: true },
      { t: "15 minutes.", ok: false },
      { t: "30 minutes.", ok: false },
      { t: "60 minutes.", ok: false },
    ],
    rationale: "The source set identifies even 5 minutes of hypotension as clinically important.",
    metadata: { topic: "Hypotension", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "hypotension", "perioperative risk"] }
  },

  // ── boa-node4-cardiac-034 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-034",
    type: "mcq",
    prompt: "What hemodynamic threshold defined critical hypotension in the retrospective study referenced here?",
    setup: "",
    ans: [
      { t: "SBP less than 70 mmHg and MAP less than 50 mmHg.", ok: true },
      { t: "SBP less than 90 mmHg and MAP less than 65 mmHg.", ok: false },
      { t: "SBP less than 80 mmHg and MAP less than 60 mmHg.", ok: false },
      { t: "SBP less than 100 mmHg and MAP less than 70 mmHg.", ok: false },
    ],
    rationale: "This source defines critical hypotension as SBP below 70 mmHg and MAP below 50 mmHg.",
    metadata: { topic: "Hypotension", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "hypotension", "MAP"] }
  },

  // ── boa-node4-cardiac-035 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-035",
    type: "mcq",
    prompt: "Which formula represents mean arterial pressure in this source set?",
    setup: "",
    ans: [
      { t: "MAP = SVR × CO.", ok: true },
      { t: "MAP = SVR / CO.", ok: false },
      { t: "MAP = CO × HR.", ok: false },
      { t: "MAP = SV × SVR.", ok: false },
    ],
    rationale: "This question set presents MAP as SVR multiplied by cardiac output.",
    metadata: { topic: "MAP and SVR Equations", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "MAP", "equations"] }
  },

  // ── boa-node4-cardiac-036 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-036",
    type: "mcq",
    prompt: "Which formula correctly represents systemic vascular resistance?",
    setup: "",
    ans: [
      { t: "SVR = 80 × (MAP − CVP) / CO.", ok: true },
      { t: "SVR = (MAP − CVP) / 80.", ok: false },
      { t: "SVR = 80 × (CO − CVP) / MAP.", ok: false },
      { t: "SVR = (CO − CVP) × 80.", ok: false },
    ],
    rationale: "Systemic vascular resistance is calculated as 80 times the pressure gradient divided by cardiac output.",
    metadata: { topic: "MAP and SVR Equations", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "SVR", "equations"] }
  },

  // ── boa-node4-cardiac-037 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-037",
    type: "mcq",
    prompt: "Most general and regional anesthetic drugs cause hypotension primarily through what mechanism?",
    setup: "",
    ans: [
      { t: "Decreased systemic vascular resistance.", ok: true },
      { t: "Increased systemic vascular resistance.", ok: false },
      { t: "Heart rate falling to zero.", ok: false },
      { t: "Artificial increase in stroke volume.", ok: false },
    ],
    rationale: "Most anesthetic drugs produce hypotension primarily by decreasing SVR.",
    metadata: { topic: "Hypotension", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "hypotension", "SVR", "anesthesia"] }
  },

  // ── boa-node4-cardiac-038 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-038",
    type: "mcq",
    prompt: "Which invasive monitoring device can be used to obtain SVR?",
    setup: "",
    ans: [
      { t: "Pulmonary artery catheter.", ok: true },
      { t: "Peripheral IV line.", ok: false },
      { t: "Noninvasive blood pressure cuff.", ok: false },
      { t: "ECG strip.", ok: false },
    ],
    rationale: "A pulmonary artery catheter can be used to obtain the measurements needed for SVR.",
    metadata: { topic: "MAP and SVR Equations", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "SVR", "monitoring"] }
  },

  // ── boa-node4-cardiac-039 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-039",
    type: "multi",
    prompt: "When a pulmonary artery catheter is unavailable, which physical findings suggest inadequate perfusion and low SVR? Select 2.",
    setup: "",
    choices: [
      "Cold extremities.",
      "Difficulty obtaining a pulse oximeter waveform.",
      "Warm extremities.",
      "Excellent pulse oximeter waveform.",
    ],
    correctAnswers: [
      "Cold extremities.",
      "Difficulty obtaining a pulse oximeter waveform.",
    ],
    selectCount: 2,
    rationale: "The source set pairs cold extremities and poor pulse oximeter waveform pickup with inadequate perfusion.",
    metadata: { topic: "Hypotension", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "perfusion", "SVR", "physical exam"] }
  },

  // ── boa-node4-cardiac-040 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-040",
    type: "mcq",
    prompt: "Which hemodynamic problem is generally more difficult to treat as a cause of hypotension?",
    setup: "",
    ans: [
      { t: "Decreased cardiac output.", ok: true },
      { t: "Decreased systemic vascular resistance.", ok: false },
      { t: "Increased heart rate.", ok: false },
      { t: "Decreased heart rate.", ok: false },
    ],
    rationale: "The source set notes that low cardiac output is often harder to treat than low SVR.",
    metadata: { topic: "Hypotension", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "hypotension", "cardiac output"] }
  },

  // ── boa-node4-cardiac-041 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-041",
    type: "mcq",
    prompt: "Hyperdynamic states such as sepsis and liver failure usually present with which profile?",
    setup: "",
    ans: [
      { t: "Decreased systemic blood pressure and possible confusion that low SVR is the only issue.", ok: true },
      { t: "Increased systemic blood pressure and isolated high SVR.", ok: false },
      { t: "Profound bradycardia with high SVR.", ok: false },
      { t: "Profound hypertension with low CO.", ok: false },
    ],
    rationale: "These states often have low blood pressure and may mislead clinicians into assuming the problem is only low SVR.",
    metadata: { topic: "Hypotension", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "hemodynamics", "sepsis", "liver failure"] }
  },

  // ── boa-node4-cardiac-042 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-042",
    type: "mcq",
    prompt: "According to Poiseuille's law, resistance is inversely proportional to what power of radius?",
    setup: "",
    ans: [
      { t: "Fourth power.", ok: true },
      { t: "Third power.", ok: false },
      { t: "Second power.", ok: false },
      { t: "Square root.", ok: false },
    ],
    rationale: "Poiseuille's law shows that resistance varies inversely with the fourth power of radius.",
    metadata: { topic: "Poiseuille's Law", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "Poiseuille", "flow", "resistance"] }
  },

  // ── boa-node4-cardiac-043 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-043",
    type: "mcq",
    prompt: "In Poiseuille's law, what does Q represent?",
    setup: "",
    ans: [
      { t: "Flow rate.", ok: true },
      { t: "Fluid viscosity.", ok: false },
      { t: "Pressure gradient.", ok: false },
      { t: "Vessel length.", ok: false },
    ],
    rationale: "Q represents flow rate, the volume of fluid passing per unit time.",
    metadata: { topic: "Poiseuille's Law", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "Poiseuille", "equations"] }
  },

  // ── boa-node4-cardiac-044 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-044",
    type: "mcq",
    prompt: "In Poiseuille's law, what does eta represent?",
    setup: "",
    ans: [
      { t: "Fluid viscosity.", ok: true },
      { t: "Pressure gradient.", ok: false },
      { t: "Vessel length.", ok: false },
      { t: "Vessel radius.", ok: false },
    ],
    rationale: "Eta represents viscosity, a fluid's resistance to flow.",
    metadata: { topic: "Poiseuille's Law", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "Poiseuille", "viscosity"] }
  },

  // ── boa-node4-cardiac-045 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-045",
    type: "mcq",
    prompt: "How does vessel length affect flow according to Poiseuille's law?",
    setup: "",
    ans: [
      { t: "A longer vessel increases resistance and reduces flow.", ok: true },
      { t: "A longer vessel lowers resistance and increases flow.", ok: false },
      { t: "A longer vessel eliminates resistance.", ok: false },
      { t: "A longer vessel eliminates flow entirely.", ok: false },
    ],
    rationale: "Increasing length increases resistance and therefore decreases flow.",
    metadata: { topic: "Poiseuille's Law", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "Poiseuille", "resistance"] }
  },

  // ── boa-node4-cardiac-046 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-046",
    type: "mcq",
    prompt: "If airway radius decreases by 25 percent, what happens to resistance according to this source set?",
    setup: "",
    ans: [
      { t: "Resistance increases by 300 percent of baseline.", ok: true },
      { t: "Resistance increases by 25 percent.", ok: false },
      { t: "Resistance decreases by 300 percent.", ok: false },
      { t: "Resistance decreases by 25 percent.", ok: false },
    ],
    rationale: "Because resistance depends heavily on radius, modest narrowing can produce a dramatic rise in resistance.",
    metadata: { topic: "Poiseuille's Law", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "Poiseuille", "airway resistance"] }
  },

  // ── boa-node4-cardiac-047 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-047",
    type: "mcq",
    prompt: "Which formula correctly calculates cardiac output?",
    setup: "",
    ans: [
      { t: "CO = HR × SV.", ok: true },
      { t: "CO = HR / SV.", ok: false },
      { t: "CO = SV − ESV.", ok: false },
      { t: "CO = EDV − ESV.", ok: false },
    ],
    rationale: "Cardiac output equals heart rate multiplied by stroke volume.",
    metadata: { topic: "Cardiac Output", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "cardiac output", "equations"] }
  },

  // ── boa-node4-cardiac-048 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-048",
    type: "mcq",
    prompt: "Which size-adjusted value is often used to compare cardiac output between patients?",
    setup: "",
    ans: [
      { t: "Cardiac index.", ok: true },
      { t: "Ejection fraction.", ok: false },
      { t: "Stroke volume.", ok: false },
      { t: "Mean arterial pressure.", ok: false },
    ],
    rationale: "Cardiac index adjusts cardiac output for body surface area.",
    metadata: { topic: "Cardiac Output", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "cardiac output", "cardiac index"] }
  },

  // ── boa-node4-cardiac-049 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-049",
    type: "mcq",
    prompt: "Which formula correctly calculates stroke volume?",
    setup: "",
    ans: [
      { t: "SV = EDV − ESV.", ok: true },
      { t: "SV = ESV − EDV.", ok: false },
      { t: "SV = CO / SVR.", ok: false },
      { t: "SV = HR × CO.", ok: false },
    ],
    rationale: "Stroke volume equals end-diastolic volume minus end-systolic volume.",
    metadata: { topic: "Stroke Volume", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "stroke volume", "equations"] }
  },

  // ── boa-node4-cardiac-050 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-050",
    type: "multi",
    prompt: "Which parameters determine stroke volume? Select 3.",
    setup: "",
    choices: [
      "Preload.",
      "Afterload.",
      "Contractility.",
      "Systemic temperature.",
      "Respiratory rate.",
    ],
    correctAnswers: [
      "Preload.",
      "Afterload.",
      "Contractility.",
    ],
    selectCount: 3,
    rationale: "Stroke volume is determined by preload, afterload, and contractility.",
    metadata: { topic: "Stroke Volume", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "stroke volume", "preload", "afterload", "contractility"] }
  },

  // ── boa-node4-cardiac-051 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-051",
    type: "multi",
    prompt: "Which devices can be used to measure cardiac output? Select 4.",
    setup: "",
    choices: [
      "Pulmonary artery catheter.",
      "Transesophageal echocardiography.",
      "Esophageal Doppler monitor.",
      "Pulse contour analysis devices.",
      "Automated blood pressure cuff.",
      "Single-lead ECG.",
    ],
    correctAnswers: [
      "Pulmonary artery catheter.",
      "Transesophageal echocardiography.",
      "Esophageal Doppler monitor.",
      "Pulse contour analysis devices.",
    ],
    selectCount: 4,
    rationale: "Several invasive and semi-invasive methods can be used to estimate or measure cardiac output.",
    metadata: { topic: "Cardiac Output", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "cardiac output", "monitoring"] }
  },

  // ── boa-node4-cardiac-052 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-052",
    type: "mcq",
    prompt: "What happens with extreme bradycardia in a patient with a stiff ventricle?",
    setup: "",
    ans: [
      { t: "Cardiac output becomes inadequate because it is highly heart-rate dependent.", ok: true },
      { t: "Cardiac output becomes excessive because stroke volume rises massively.", ok: false },
      { t: "SVR falls profoundly.", ok: false },
      { t: "Action potentials accelerate.", ok: false },
    ],
    rationale: "In a stiff ventricle, extreme bradycardia may not be compensated by filling and can reduce cardiac output.",
    metadata: { topic: "Cardiac Output", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "bradycardia", "cardiac output", "diastolic dysfunction"] }
  },

  // ── boa-node4-cardiac-053 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-053",
    type: "mcq",
    prompt: "How does extreme tachycardia affect ventricular hemodynamics and cardiac output?",
    setup: "",
    ans: [
      { t: "It shortens filling time, lowering cardiac output and causing hypotension.", ok: true },
      { t: "It increases filling time, raising cardiac output and causing hypertension.", ok: false },
      { t: "It raises stroke volume without affecting blood pressure.", ok: false },
      { t: "It lowers SVR while maintaining cardiac output.", ok: false },
    ],
    rationale: "Very rapid heart rate reduces diastolic filling time and can decrease cardiac output.",
    metadata: { topic: "Cardiac Output", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "tachycardia", "cardiac output", "hypotension"] }
  },

  // ── boa-node4-cardiac-054 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-054",
    type: "mcq",
    prompt: "Which formula correctly calculates left ventricular ejection fraction?",
    setup: "",
    ans: [
      { t: "LVEF = (SV / EDV) × 100.", ok: true },
      { t: "LVEF = (EDV / SV) × 100.", ok: false },
      { t: "LVEF = (SV / ESV) × 100.", ok: false },
      { t: "LVEF = (ESV / SV) × 100.", ok: false },
    ],
    rationale: "Ejection fraction is the proportion of end-diastolic volume ejected with each beat.",
    metadata: { topic: "Ejection Fraction", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "ejection fraction", "equations"] }
  },

  // ── boa-node4-cardiac-055 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-055",
    type: "mcq",
    prompt: "What ejection fraction range is considered normal in this source set?",
    setup: "",
    ans: [
      { t: "60 to 70 percent.", ok: true },
      { t: "40 to 50 percent.", ok: false },
      { t: "80 to 90 percent.", ok: false },
      { t: "20 to 30 percent.", ok: false },
    ],
    rationale: "A normal EF is presented here as approximately 60 to 70 percent.",
    metadata: { topic: "Ejection Fraction", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "ejection fraction"] }
  },

  // ── boa-node4-cardiac-056 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-056",
    type: "mcq",
    prompt: "How is preload best defined clinically?",
    setup: "",
    ans: [
      { t: "End-diastolic volume.", ok: true },
      { t: "End-systolic volume.", ok: false },
      { t: "Systemic vascular resistance.", ok: false },
      { t: "Pulmonary vascular resistance.", ok: false },
    ],
    rationale: "Preload is best defined clinically as end-diastolic volume.",
    metadata: { topic: "Preload", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "preload", "filling"] }
  },

  // ── boa-node4-cardiac-057 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-057",
    type: "multi",
    prompt: "Which measurements can be used to estimate cardiac filling pressures? Select 4.",
    setup: "",
    choices: [
      "Left atrial pressure.",
      "Pulmonary capillary wedge pressure.",
      "Pulmonary artery diastolic pressure.",
      "Central venous pressure.",
      "Mean arterial pressure.",
      "Systemic vascular resistance.",
    ],
    correctAnswers: [
      "Left atrial pressure.",
      "Pulmonary capillary wedge pressure.",
      "Pulmonary artery diastolic pressure.",
      "Central venous pressure.",
    ],
    selectCount: 4,
    rationale: "Common measurements used to estimate filling pressures include LA pressure, PCWP, PAD, and CVP.",
    metadata: { topic: "Filling Pressures", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "preload", "filling pressures", "monitoring"] }
  },

  // ── boa-node4-cardiac-058 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-058",
    type: "mcq",
    prompt: "Central venous pressure correlates with left-sided filling pressures only under which conditions?",
    setup: "",
    ans: [
      { t: "When there is no pulmonary disease and cardiac function is normal.", ok: true },
      { t: "When severe pulmonary disease is present and cardiac function is poor.", ok: false },
      { t: "Only under deep general anesthesia.", ok: false },
      { t: "Only with severe pulmonary hypertension.", ok: false },
    ],
    rationale: "CVP correlates better with left-sided filling when pulmonary disease is absent and cardiac function is normal.",
    metadata: { topic: "CVP, PAD, PCWP, LA Pressure", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "CVP", "filling pressures"] }
  },

  // ── boa-node4-cardiac-059 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-059",
    type: "mcq",
    prompt: "When a pulmonary artery catheter balloon is inflated, PCWP becomes nearly equivalent to what pressure?",
    setup: "",
    ans: [
      { t: "Left atrial pressure.", ok: true },
      { t: "Right atrial pressure.", ok: false },
      { t: "Central venous pressure.", ok: false },
      { t: "Systemic arterial pressure.", ok: false },
    ],
    rationale: "Wedging the catheter allows distal pressure to equilibrate with left atrial pressure.",
    metadata: { topic: "CVP, PAD, PCWP, LA Pressure", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "PCWP", "left atrial pressure", "monitoring"] }
  },

  // ── boa-node4-cardiac-060 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-060",
    type: "mcq",
    prompt: "Ventricular compliance curves show the relationship between which variables during diastole?",
    setup: "",
    ans: [
      { t: "Ventricular pressure and volume.", ok: true },
      { t: "Systemic resistance and volume.", ok: false },
      { t: "Ventricular pressure and heart rate.", ok: false },
      { t: "Systemic resistance and heart rate.", ok: false },
    ],
    rationale: "Compliance curves describe how ventricular pressure changes with filling volume.",
    metadata: { topic: "Ventricular Compliance", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "ventricular compliance", "diastole"] }
  },

  // ── boa-node4-cardiac-061 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-061",
    type: "mcq",
    prompt: "What can happen when a stiff left ventricle is filled to a normal volume?",
    setup: "",
    ans: [
      { t: "Intracardiac and pulmonary capillary pressures may rise excessively.", ok: true },
      { t: "Intracardiac and pulmonary capillary pressures may fall excessively.", ok: false },
      { t: "Heart rate rises without pressure change.", ok: false },
      { t: "Heart rate falls without pressure change.", ok: false },
    ],
    rationale: "A poorly compliant ventricle can generate abnormally high filling pressures for a given volume.",
    metadata: { topic: "Ventricular Compliance", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "ventricular compliance", "diastolic dysfunction"] }
  },

  // ── boa-node4-cardiac-062 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-062",
    type: "mcq",
    prompt: "How is the Frank-Starling mechanism defined?",
    setup: "",
    ans: [
      { t: "The heart changes force of contraction and stroke volume in response to venous return.", ok: true },
      { t: "The heart changes chronotropic rate in response to venous return.", ok: false },
      { t: "The heart changes electrical conductivity in response to venous return.", ok: false },
      { t: "The heart changes valve function in response to venous return.", ok: false },
    ],
    rationale: "Frank-Starling describes how increased venous return can increase stroke volume via increased stretch.",
    metadata: { topic: "Frank-Starling Mechanism", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "Frank-Starling", "stroke volume"] }
  },

  // ── boa-node4-cardiac-063 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-063",
    type: "mcq",
    prompt: "What happens immediately to cardiac output when a healthy person stands up?",
    setup: "",
    ans: [
      { t: "Cardiac output falls because CVP falls and stroke volume decreases.", ok: true },
      { t: "Cardiac output rises because CVP rises and stroke volume increases.", ok: false },
      { t: "Cardiac output remains unchanged.", ok: false },
      { t: "Cardiac output falls because CVP rises and stroke volume decreases.", ok: false },
    ],
    rationale: "Standing reduces venous return and CVP, which lowers stroke volume and cardiac output initially.",
    metadata: { topic: "Frank-Starling Mechanism", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "Frank-Starling", "venous return"] }
  },

  // ── boa-node4-cardiac-064 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-064",
    type: "mcq",
    prompt: "On a Frank-Starling curve, decreasing afterload and increasing inotropy shift the curve in which direction?",
    setup: "",
    ans: [
      { t: "Up and to the left.", ok: true },
      { t: "Down and to the right.", ok: false },
      { t: "Down and to the left.", ok: false },
      { t: "Up and to the right.", ok: false },
    ],
    rationale: "Improved contractility and reduced afterload shift performance upward and leftward.",
    metadata: { topic: "Frank-Starling Mechanism", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "Frank-Starling", "afterload", "inotropy"] }
  },

  // ── boa-node4-cardiac-065 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-065",
    type: "mcq",
    prompt: "On a Frank-Starling curve, increasing afterload or decreasing inotropy shifts the curve in which direction?",
    setup: "",
    ans: [
      { t: "Down and to the right.", ok: true },
      { t: "Up and to the left.", ok: false },
      { t: "Down and to the left.", ok: false },
      { t: "Up and to the right.", ok: false },
    ],
    rationale: "Higher afterload or worse contractility depresses performance and shifts the curve down and right.",
    metadata: { topic: "Frank-Starling Mechanism", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "Frank-Starling", "afterload", "contractility"] }
  },

  // ── boa-node4-cardiac-066 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-066",
    type: "mcq",
    prompt: "Hypovolemia represents which category of low preload?",
    setup: "",
    ans: [
      { t: "Absolute low preload.", ok: true },
      { t: "Relative low preload.", ok: false },
      { t: "Obstructive low preload.", ok: false },
      { t: "Contractile low preload.", ok: false },
    ],
    rationale: "Hypovolemia is an absolute reduction in preload.",
    metadata: { topic: "Low Preload States", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "preload", "hypovolemia"] }
  },

  // ── boa-node4-cardiac-067 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-067",
    type: "multi",
    prompt: "Which are causes of relative low preload? Select 2.",
    setup: "",
    choices: [
      "Systemic venodilation.",
      "Obstruction to flow.",
      "Hemorrhagic blood loss.",
      "Severe dehydration.",
    ],
    correctAnswers: [
      "Systemic venodilation.",
      "Obstruction to flow.",
    ],
    selectCount: 2,
    rationale: "Relative low preload refers to venodilation or obstruction impairing effective filling without absolute volume loss.",
    metadata: { topic: "Low Preload States", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "preload", "venodilation", "obstruction"] }
  },

  // ── boa-node4-cardiac-068 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-068",
    type: "mcq",
    prompt: "Why do tension pneumothorax and pericardial tamponade cause relative low preload?",
    setup: "",
    ans: [
      { t: "They raise pressure around the heart, obstructing flow and limiting filling.", ok: true },
      { t: "They lower pressure around the heart and over-distend flow.", ok: false },
      { t: "They cause massive active bleeding into the pleural space.", ok: false },
      { t: "They cause severe vasodilation of SVR.", ok: false },
    ],
    rationale: "Both conditions impede venous return and ventricular filling by increasing surrounding pressure.",
    metadata: { topic: "Low Preload States", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "tamponade", "tension pneumothorax", "preload"] }
  },

  // ── boa-node4-cardiac-069 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-069",
    type: "mcq",
    prompt: "Cardiac tamponade may obstruct filling despite which misleading hemodynamic finding?",
    setup: "",
    ans: [
      { t: "Normal or increased CVP.", ok: true },
      { t: "Absent CVP.", ok: false },
      { t: "Normal or increased cardiac output.", ok: false },
      { t: "Normal or increased stroke volume.", ok: false },
    ],
    rationale: "Tamponade can be present even when CVP is normal or elevated.",
    metadata: { topic: "Low Preload States", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "tamponade", "CVP"] }
  },

  // ── boa-node4-cardiac-070 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-070",
    type: "mcq",
    prompt: "What is the term for systolic blood pressure changes with tidal breathing in low preload states?",
    setup: "",
    ans: [
      { t: "Systolic pressure variation.", ok: true },
      { t: "Pulse pressure variation.", ok: false },
      { t: "Mean arterial variation.", ok: false },
      { t: "Diastolic pressure variation.", ok: false },
    ],
    rationale: "Low preload can manifest as systolic pressure variation with tidal breathing.",
    metadata: { topic: "Low Preload States", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "preload", "SPV"] }
  },

  // ── boa-node4-cardiac-071 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-071",
    type: "mcq",
    prompt: "How is pulsus paradoxus defined?",
    setup: "",
    ans: [
      { t: "A marked decrease in systolic blood pressure during inspiration.", ok: true },
      { t: "A marked increase in systolic blood pressure during inspiration.", ok: false },
      { t: "A marked decrease in systolic blood pressure during expiration.", ok: false },
      { t: "A marked increase in systolic blood pressure during expiration.", ok: false },
    ],
    rationale: "Pulsus paradoxus is an exaggerated inspiratory fall in systolic blood pressure.",
    metadata: { topic: "Low Preload States", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "pulsus paradoxus", "tamponade", "preload"] }
  },

  // ── boa-node4-cardiac-072 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-072",
    type: "multi",
    prompt: "Which conditions or agents are associated with decreased myocardial contractility as a cause of hypotension? Select 5.",
    setup: "",
    choices: [
      "Myocardial ischemia.",
      "Anesthetic drugs.",
      "Cardiomyopathy.",
      "Previous myocardial infarction.",
      "Valvular heart disease.",
      "Systemic hyperthermia.",
      "Extreme pain stimuli.",
    ],
    correctAnswers: [
      "Myocardial ischemia.",
      "Anesthetic drugs.",
      "Cardiomyopathy.",
      "Previous myocardial infarction.",
      "Valvular heart disease.",
    ],
    selectCount: 5,
    rationale: "These structural or pharmacologic causes can reduce contractility and contribute to hypotension.",
    metadata: { topic: "Contractility", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "contractility", "hypotension"] }
  },

  // ── boa-node4-cardiac-073 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-073",
    type: "mcq",
    prompt: "How is contractility defined in relation to loading conditions?",
    setup: "",
    ans: [
      { t: "The inotropic state, independent of preload and afterload.", ok: true },
      { t: "The chronotropic state, independent of preload and afterload.", ok: false },
      { t: "The volume state, independent of pressure.", ok: false },
      { t: "The resistance state, independent of volume.", ok: false },
    ],
    rationale: "Contractility is the intrinsic force of contraction independent of loading conditions.",
    metadata: { topic: "Contractility", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "contractility", "inotropy"] }
  },

  // ── boa-node4-cardiac-074 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-074",
    type: "mcq",
    prompt: "How is afterload defined?",
    setup: "",
    ans: [
      { t: "Resistance to ejection of blood from the left ventricle.", ok: true },
      { t: "Volume in the left ventricle before contraction.", ok: false },
      { t: "Blood returned to the right atrium.", ok: false },
      { t: "Heart rate multiplied by stroke volume.", ok: false },
    ],
    rationale: "Afterload is the resistance the ventricle must overcome to eject blood.",
    metadata: { topic: "Afterload", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "afterload"] }
  },

  // ── boa-node4-cardiac-075 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-075",
    type: "mcq",
    prompt: "Which expression represents the Law of Laplace for ventricular wall stress in this source set?",
    setup: "",
    ans: [
      { t: "Wall stress = P × r / 2T or related thickness form.", ok: true },
      { t: "Wall stress = P / r × 2T.", ok: false },
      { t: "Wall stress = P × r × T.", ok: false },
      { t: "Wall stress = P / r / T.", ok: false },
    ],
    rationale: "This source set presents wall stress as depending on pressure, radius, and wall thickness.",
    metadata: { topic: "Law of Laplace", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "Laplace", "wall stress"] }
  },

  // ── boa-node4-cardiac-076 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-076",
    type: "mcq",
    prompt: "In the provided Laplace expression, what does T represent?",
    setup: "",
    ans: [
      { t: "Ventricular wall thickness.", ok: true },
      { t: "Total ventricular tension.", ok: false },
      { t: "Thoracic pressure.", ok: false },
      { t: "Transmural volume.", ok: false },
    ],
    rationale: "This source set defines T in its wall-stress expression as ventricular wall thickness.",
    metadata: { topic: "Law of Laplace", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "Laplace", "wall thickness"] }
  },

  // ── boa-node4-cardiac-077 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-077",
    type: "mcq",
    prompt: "What happens when systemic vascular resistance becomes severely increased?",
    setup: "",
    ans: [
      { t: "The heart empties less completely, lowering SV, EF, and CO.", ok: true },
      { t: "The heart empties more completely, raising SV, EF, and CO.", ok: false },
      { t: "The heart fills less completely but EF rises.", ok: false },
      { t: "The heart overfills and SV rises while EF and CO fall.", ok: false },
    ],
    rationale: "Excess afterload impairs ejection and lowers stroke volume, ejection fraction, and cardiac output.",
    metadata: { topic: "Afterload", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "afterload", "SVR"] }
  },

  // ── boa-node4-cardiac-078 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-078",
    type: "mcq",
    prompt: "What can dangerously low SVR falsely suggest because filling pressures may also fall?",
    setup: "",
    ans: [
      { t: "That preload rather than afterload is causing the hypotension.", ok: true },
      { t: "That heart rate rather than afterload is the cause.", ok: false },
      { t: "That contractility rather than preload is causing hypertension.", ok: false },
      { t: "That contractility rather than preload is causing arrhythmias.", ok: false },
    ],
    rationale: "Low afterload can reduce filling pressures and mimic a low-preload state.",
    metadata: { topic: "Afterload", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "afterload", "SVR", "hypotension"] }
  },

  // ── boa-node4-cardiac-079 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-079",
    type: "mcq",
    prompt: "Which system acts as the central integratory system for reflexes affecting the autonomic nervous system?",
    setup: "",
    ans: [
      { t: "Brainstem.", ok: true },
      { t: "Spinal cord.", ok: false },
      { t: "Cerebral cortex.", ok: false },
      { t: "Cerebellum.", ok: false },
    ],
    rationale: "The brainstem integrates reflex input and coordinates autonomic output.",
    metadata: { topic: "ANS Control of the Heart", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "autonomic nervous system", "brainstem"] }
  },

  // ── boa-node4-cardiac-080 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-080",
    type: "mcq",
    prompt: "Sympathetic stimulation increases heart rate through activation of which receptors?",
    setup: "",
    ans: [
      { t: "Beta-1 adrenergic receptors.", ok: true },
      { t: "Alpha-1 adrenergic receptors.", ok: false },
      { t: "Muscarinic acetylcholine receptors.", ok: false },
      { t: "Nicotinic acetylcholine receptors.", ok: false },
    ],
    rationale: "Beta-1 receptor activation increases heart rate and contractility.",
    metadata: { topic: "ANS Control of the Heart", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "ANS", "sympathetic", "beta-1"] }
  },

  // ── boa-node4-cardiac-081 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-081",
    type: "mcq",
    prompt: "Parasympathetic stimulation slows heart rate through activation of which receptors in the SA and AV nodes?",
    setup: "",
    ans: [
      { t: "Muscarinic acetylcholine receptors.", ok: true },
      { t: "Nicotinic acetylcholine receptors.", ok: false },
      { t: "Beta-1 adrenergic receptors.", ok: false },
      { t: "Alpha-1 adrenergic receptors.", ok: false },
    ],
    rationale: "Parasympathetic slowing of heart rate occurs via muscarinic receptors in nodal tissue.",
    metadata: { topic: "ANS Control of the Heart", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "ANS", "parasympathetic", "muscarinic"] }
  },

  // ── boa-node4-cardiac-082 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-082",
    type: "mcq",
    prompt: "What is the major effect of parasympathetic stimulation on the heart compared with its effect on contractility?",
    setup: "",
    ans: [
      { t: "It may slightly decrease contractility, but its major effect is lowering heart rate.", ok: true },
      { t: "It drops contractility to zero.", ok: false },
      { t: "It slightly increases contractility.", ok: false },
      { t: "It has no effect at all.", ok: false },
    ],
    rationale: "The dominant parasympathetic effect is heart-rate reduction, with only slight effect on contractility.",
    metadata: { topic: "ANS Control of the Heart", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "ANS", "parasympathetic"] }
  },

  // ── boa-node4-cardiac-083 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-083",
    type: "multi",
    prompt: "Where are the baroreceptor stretch receptors located? Select 2.",
    setup: "",
    choices: [
      "Carotid sinus.",
      "Aortic arch.",
      "Pulmonary vein.",
      "Superior vena cava.",
    ],
    correctAnswers: [
      "Carotid sinus.",
      "Aortic arch.",
    ],
    selectCount: 2,
    rationale: "The main baroreceptors are located in the carotid sinus and aortic arch.",
    metadata: { topic: "Baroreceptor Reflex", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "baroreceptor reflex"] }
  },

  // ── boa-node4-cardiac-084 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-084",
    type: "multi",
    prompt: "Which cranial nerves carry inhibitory baroreceptor signals to the CNS when blood pressure rises? Select 2.",
    setup: "",
    choices: [
      "Vagus nerve.",
      "Glossopharyngeal nerve.",
      "Facial nerve.",
      "Trigeminal nerve.",
    ],
    correctAnswers: [
      "Vagus nerve.",
      "Glossopharyngeal nerve.",
    ],
    selectCount: 2,
    rationale: "Baroreceptor afferents travel through the vagus and glossopharyngeal nerves.",
    metadata: { topic: "Baroreceptor Reflex", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "baroreceptor reflex", "cranial nerves"] }
  },

  // ── boa-node4-cardiac-085 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-085",
    type: "multi",
    prompt: "What responses occur when baroreceptors are activated by acute hypertension? Select 3.",
    setup: "",
    choices: [
      "Increased parasympathetic tone decreasing heart rate.",
      "Increased vagal stimulation decreasing myocardial contractility.",
      "Increased vagal stimulation causing reflex vasodilation.",
      "Decreased parasympathetic tone increasing heart rate.",
      "Decreased vagal stimulation causing reflex vasoconstriction.",
    ],
    correctAnswers: [
      "Increased parasympathetic tone decreasing heart rate.",
      "Increased vagal stimulation decreasing myocardial contractility.",
      "Increased vagal stimulation causing reflex vasodilation.",
    ],
    selectCount: 3,
    rationale: "Activation of baroreceptors in hypertension increases vagal effects and lowers heart rate, contractility, and vascular tone.",
    metadata: { topic: "Baroreceptor Reflex", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "baroreceptor reflex", "hypertension"] }
  },

  // ── boa-node4-cardiac-086 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-086",
    type: "mcq",
    prompt: "How is the Bainbridge reflex defined?",
    setup: "",
    ans: [
      { t: "Atrial stretch increases heart rate to help match cardiac output to venous return.", ok: true },
      { t: "Atrial stretch decreases heart rate to prevent overload.", ok: false },
      { t: "Ventricular stretch increases contractility.", ok: false },
      { t: "Ventricular stretch decreases contractility.", ok: false },
    ],
    rationale: "The Bainbridge reflex links atrial stretch with increased heart rate.",
    metadata: { topic: "Bainbridge Reflex", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "Bainbridge reflex", "venous return"] }
  },

  // ── boa-node4-cardiac-087 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-087",
    type: "mcq",
    prompt: "What hemodynamic change occurs with the oculocardiac reflex during eye traction?",
    setup: "",
    ans: [
      { t: "A rapid drop in heart rate.", ok: true },
      { t: "A rapid increase in heart rate.", ok: false },
      { t: "A rapid rise in blood pressure.", ok: false },
      { t: "A rapid increase in cardiac output.", ok: false },
    ],
    rationale: "The oculocardiac reflex classically produces bradycardia.",
    metadata: { topic: "Oculocardiac Reflex", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "oculocardiac reflex", "bradycardia"] }
  },

  // ── boa-node4-cardiac-088 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-088",
    type: "mcq",
    prompt: "How is the Cushing reflex defined in this source set?",
    setup: "",
    ans: [
      { t: "Bradycardia in response to increased intracranial pressure.", ok: true },
      { t: "Tachycardia in response to increased intracranial pressure.", ok: false },
      { t: "Bradycardia in response to decreased intracranial pressure.", ok: false },
      { t: "Tachycardia in response to decreased intracranial pressure.", ok: false },
    ],
    rationale: "This source set defines the Cushing reflex as bradycardia occurring with increased intracranial pressure.",
    metadata: { topic: "Cushing Reflex", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "Cushing reflex", "ICP"] }
  },

  // ── boa-node4-cardiac-089 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-089",
    type: "mcq",
    prompt: "Based on the coronary perfusion pressure equation, which pressure dropping too low most directly predisposes the heart to ischemia?",
    setup: "",
    ans: [
      { t: "Arterial diastolic pressure.", ok: true },
      { t: "Arterial systolic pressure.", ok: false },
      { t: "Central venous pressure.", ok: false },
      { t: "Pulmonary artery pressure.", ok: false },
    ],
    rationale: "Since CPP depends on diastolic pressure minus LVEDP, low arterial diastolic pressure threatens myocardial perfusion.",
    metadata: { topic: "Coronary Perfusion Pressure", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "coronary perfusion pressure", "ischemia"] }
  },

  // ── boa-node4-cardiac-090 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-090",
    type: "multi",
    prompt: "Which tissues are found in the epicardium? Select 3.",
    setup: "",
    choices: [
      "Mesothelium.",
      "Connective tissue.",
      "Adipose tissue.",
      "Contractile myofibrils.",
      "Fibrous valve skeleton.",
    ],
    correctAnswers: [
      "Mesothelium.",
      "Connective tissue.",
      "Adipose tissue.",
    ],
    selectCount: 3,
    rationale: "The epicardium contains mesothelium, connective tissue, and fat.",
    metadata: { topic: "Heart Wall Anatomy", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "epicardium", "anatomy"] }
  },

  // ── boa-node4-cardiac-091 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-091",
    type: "mcq",
    prompt: "Because pacemaker cells lack a stable resting phase, what capability do they have?",
    setup: "",
    ans: [
      { t: "They can depolarize spontaneously over and over.", ok: true },
      { t: "They remain hyperpolarized indefinitely.", ok: false },
      { t: "They contract without calcium.", ok: false },
      { t: "They only conduct backward into the atrium.", ok: false },
    ],
    rationale: "Pacemaker cells have spontaneous automaticity.",
    metadata: { topic: "Cardiac Conduction", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "pacemaker cells", "automaticity"] }
  },

  // ── boa-node4-cardiac-092 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-092",
    type: "mcq",
    prompt: "What size are myocardial cells according to this source set?",
    setup: "",
    ans: [
      { t: "50 to 100 micrometers long.", ok: true },
      { t: "10 to 20 micrometers long.", ok: false },
      { t: "200 to 300 micrometers long.", ok: false },
      { t: "1 to 5 millimeters long.", ok: false },
    ],
    rationale: "The source set describes myocardial cells as approximately 50 to 100 micrometers long.",
    metadata: { topic: "Cardiac Cellular Structure", priority: "low", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "myocardial cells", "anatomy"] }
  },

  // ── boa-node4-cardiac-093 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-093",
    type: "mcq",
    prompt: "Compared with pacemaker cells, myocardial cells depolarize how?",
    setup: "",
    ans: [
      { t: "More slowly.", ok: true },
      { t: "More quickly.", ok: false },
      { t: "At the same speed.", ok: false },
      { t: "They cannot depolarize.", ok: false },
    ],
    rationale: "The source set states myocardial cells depolarize more slowly than pacemaker cells.",
    metadata: { topic: "Cardiac Cellular Structure", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "myocardial cells", "pacemaker cells"] }
  },

  // ── boa-node4-cardiac-094 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-094",
    type: "mcq",
    prompt: "When calculating stroke volume, what is subtracted from end-diastolic volume?",
    setup: "",
    ans: [
      { t: "End-systolic volume.", ok: true },
      { t: "Ejection fraction.", ok: false },
      { t: "Cardiac output.", ok: false },
      { t: "Cardiac index.", ok: false },
    ],
    rationale: "Stroke volume equals EDV minus ESV.",
    metadata: { topic: "Stroke Volume", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "stroke volume", "equations"] }
  },

  // ── boa-node4-cardiac-095 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-095",
    type: "mcq",
    prompt: "Severe mitral regurgitation affects which class of valve?",
    setup: "",
    ans: [
      { t: "Atrioventricular valve.", ok: true },
      { t: "Semilunar valve.", ok: false },
      { t: "Venous ostial valve.", ok: false },
      { t: "Aortic arch valve.", ok: false },
    ],
    rationale: "The mitral valve is one of the atrioventricular valves.",
    metadata: { topic: "Valve Anatomy", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "mitral regurgitation", "valves"] }
  },

  // ── boa-node4-cardiac-096 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-096",
    type: "mcq",
    prompt: "What structure supports and provides attachment points for the heart valves?",
    setup: "",
    ans: [
      { t: "Fibrous cardiac skeleton.", ok: true },
      { t: "Myocardial septum.", ok: false },
      { t: "Epicardial fat.", ok: false },
      { t: "Visceral pericardial sac.", ok: false },
    ],
    rationale: "The valves are attached to and supported by the fibrous cardiac skeleton.",
    metadata: { topic: "Valve Anatomy", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "valves", "fibrous skeleton"] }
  },

  // ── boa-node4-cardiac-097 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-097",
    type: "mcq",
    prompt: "Using a larger gauge IV needle increases flow mainly by changing which variable in Poiseuille's law?",
    setup: "",
    ans: [
      { t: "Radius.", ok: true },
      { t: "Pressure gradient.", ok: false },
      { t: "Viscosity.", ok: false },
      { t: "Length.", ok: false },
    ],
    rationale: "A larger gauge needle increases effective radius, which markedly increases flow.",
    metadata: { topic: "Poiseuille's Law", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "Poiseuille", "IV flow"] }
  },

  // ── boa-node4-cardiac-098 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-098",
    type: "mcq",
    prompt: "In Poiseuille's law, which symbol represents the pressure difference between the two ends of a pipe?",
    setup: "",
    ans: [
      { t: "Delta P.", ok: true },
      { t: "Q.", ok: false },
      { t: "Eta.", ok: false },
      { t: "L.", ok: false },
    ],
    rationale: "Delta P is the pressure gradient driving flow.",
    metadata: { topic: "Poiseuille's Law", priority: "medium", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "Poiseuille", "pressure gradient"] }
  },

  // ── boa-node4-cardiac-099 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-099",
    type: "mcq",
    prompt: "Which reflex protects the brain when intracranial pressure becomes dangerously high by increasing blood pressure and slowing heart rate?",
    setup: "",
    ans: [
      { t: "Cushing reflex.", ok: true },
      { t: "Bainbridge reflex.", ok: false },
      { t: "Baroreceptor reflex.", ok: false },
      { t: "Oculocardiac reflex.", ok: false },
    ],
    rationale: "The Cushing reflex is the classic response to dangerous intracranial pressure elevation.",
    metadata: { topic: "Cushing Reflex", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "Cushing reflex", "ICP"] }
  },

  // ── boa-node4-cardiac-100 ────────────────────────────────────────────────────
  {
    id: "boa-node4-cardiac-100",
    type: "mcq",
    prompt: "Into which chamber does the great coronary sinus empty?",
    setup: "",
    ans: [
      { t: "Right atrium.", ok: true },
      { t: "Right ventricle.", ok: false },
      { t: "Left atrium.", ok: false },
      { t: "Left ventricle.", ok: false },
    ],
    rationale: "The coronary sinus empties into the right atrium.",
    metadata: { topic: "Coronary Circulation", priority: "high", category: "cardiac-physiology", source: "node-4-chapter-4", tags: ["cardiac physiology", "coronary sinus", "anatomy"] }
  },

];

// ── Metadata (auto-computed) ─────────────────────────────────────────────────
export const CARDIAC_METADATA = {
  nodeId:    "node-4",
  courseId:  "basics-of-anesthesia",
  chapter:   "Chapter 4",
  title:     "Cardiac Physiology",
  totalQuestions: CARDIAC_QUESTIONS.length,
  questionTypes: {
    mcq:   CARDIAC_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: CARDIAC_QUESTIONS.filter(q => q.type === 'multi').length,
    short: CARDIAC_QUESTIONS.filter(q => q.type === 'short').length,
  }
};
