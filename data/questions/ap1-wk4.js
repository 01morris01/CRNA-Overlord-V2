/**
 * Advanced Pharmacology I, Week 4
 * Anticoagulants and Procoagulants
 * Stoelting Ch 29, 30 (Foster lecture deck)
 * Concept-complete coverage; every MCQ cites its source slide. Answer options length-balanced; dash-free.
 */
export const AP1_WK4_QUESTIONS = [

  {
    id: "ap1-w4-001",
    type: "mcq",
    prompt: "Hemostasis proceeds in three overlapping phases. Which phase is the immediate response that reduces blood flow to the injury?",
    setup: "",
    ans: [
      { t: "Vascular phase vasoconstriction", ok: true },
      { t: "Primary hemostasis platelet plug", ok: false },
      { t: "Secondary hemostasis fibrin step", ok: false },
      { t: "Fibrinolytic phase plasmin lysis", ok: false },
    ],
    rationale: "The vascular phase is reflex vasoconstriction that reduces blood flow to the injured vessel. Primary hemostasis forms the soft platelet plug; secondary hemostasis stabilizes it with fibrin; fibrinolysis later dissolves the clot. Pearl: vascular phase first, then primary, then secondary.", // source: Anticoagulants deck slide 3
    scene: "pharmacology",
    sceneCfg: { label: "VASCULAR PHASE" },
    metadata: { topic: "Three phases of hemostasis", priority: "medium" },
  },

  {
    id: "ap1-w4-002",
    type: "mcq",
    prompt: "How does the timing and product of primary hemostasis differ from secondary hemostasis?",
    setup: "",
    ans: [
      { t: "Soft platelet plug in seconds to minutes", ok: true },
      { t: "Fibrin mesh laid down within seconds flat", ok: false },
      { t: "Reflex vasoconstriction over many minutes", ok: false },
      { t: "Plasmin driven clot lysis within minutes", ok: false },
    ],
    rationale: "Primary hemostasis forms a soft platelet plug in seconds to minutes. Secondary hemostasis (the coagulation cascade) stabilizes that plug with fibrin over minutes, so it is slower and produces fibrin, not the initial plug. Vasoconstriction is the separate vascular phase, and plasmin lysis is fibrinolysis. Pearl: primary makes the fast soft plug, secondary lays down fibrin.", // source: Anticoagulants deck slide 3
    scene: "pharmacology",
    sceneCfg: { label: "PRIMARY VS SECONDARY" },
    metadata: { topic: "Primary versus secondary timing", priority: "medium" },
  },

  {
    id: "ap1-w4-003",
    type: "mcq",
    prompt: "Platelets perform three actions in order during primary hemostasis. What is the correct sequence?",
    setup: "",
    ans: [
      { t: "Adhere, then activate, then aggregate", ok: true },
      { t: "Activate, then adhere, then aggregate", ok: false },
      { t: "Aggregate, then adhere, then activate", ok: false },
      { t: "Adhere, then aggregate, then activate", ok: false },
    ],
    rationale: "Platelets first adhere to exposed collagen, then activate and release granule contents, then aggregate via GP IIb/IIIa and fibrinogen. The other sequences scramble this order. Pearl: adhere, activate, aggregate, in that exact order.", // source: Anticoagulants deck slide 4
    scene: "pharmacology",
    sceneCfg: { label: "ADHERE ACTIVATE AGGREGATE" },
    metadata: { topic: "Primary hemostasis steps", priority: "high" },
  },

  {
    id: "ap1-w4-004",
    type: "mcq",
    prompt: "During platelet adhesion, which molecule bridges the platelet to exposed subendothelial collagen, and through which receptor?",
    setup: "",
    ans: [
      { t: "von Willebrand factor via GP Ib", ok: true },
      { t: "Plasma fibrinogen via GP IIb/IIIa", ok: false },
      { t: "Platelet thromboxane A2 via GP Ib", ok: false },
      { t: "Exposed tissue factor via GP IIb", ok: false },
    ],
    rationale: "von Willebrand factor bridges platelets to subendothelial collagen through the GP Ib receptor during adhesion. Fibrinogen and GP IIb/IIIa mediate aggregation, not adhesion, and thromboxane and tissue factor are not adhesion bridges. Pearl: vWF plus GP Ib equals adhesion to collagen.", // source: Anticoagulants deck slide 4
    scene: "pharmacology",
    sceneCfg: { label: "VWF GP IB ADHESION" },
    metadata: { topic: "Platelet adhesion", priority: "high" },
  },

  {
    id: "ap1-w4-005",
    type: "mcq",
    prompt: "When activated platelet granules degranulate, which set of mediators do they release?",
    setup: "",
    ans: [
      { t: "ADP, thromboxane A2, and serotonin", ok: true },
      { t: "ADP, tissue factor, and serotonin", ok: false },
      { t: "Fibrinogen, thromboxane A2, and ADP", ok: false },
      { t: "von Willebrand factor and serotonin", ok: false },
    ],
    rationale: "Activated platelet granules release adenosine diphosphate, thromboxane A2, and serotonin to amplify activation and recruit more platelets. Tissue factor, fibrinogen, and von Willebrand factor are not the released granule trio described. Pearl: ADP, TXA2, and serotonin are the activation signals.", // source: Anticoagulants deck slide 4
    scene: "pharmacology",
    sceneCfg: { label: "GRANULE CONTENTS" },
    metadata: { topic: "Platelet granule release", priority: "medium" },
  },

  {
    id: "ap1-w4-006",
    type: "mcq",
    prompt: "Platelet aggregation depends on which receptor and crosslinking molecule?",
    setup: "",
    ans: [
      { t: "GP IIb/IIIa crosslinked by fibrinogen", ok: true },
      { t: "GP Ib receptor crosslinked by fibrinogen", ok: false },
      { t: "GP IIb/IIIa crosslinked by wall collagen", ok: false },
      { t: "GP Ib receptor crosslinked by vWF factor", ok: false },
    ],
    rationale: "Activated platelets expose GP IIb/IIIa, and fibrinogen crosslinks adjacent platelets to aggregate them. GP Ib mediates adhesion via vWF, not aggregation, and collagen is the adhesion substrate, not the aggregation bridge. Pearl: GP IIb/IIIa plus fibrinogen equals aggregation.", // source: Anticoagulants deck slide 4
    scene: "pharmacology",
    sceneCfg: { label: "GP IIB IIIA AGGREGATION" },
    metadata: { topic: "Platelet aggregation", priority: "high" },
  },

  {
    id: "ap1-w4-007",
    type: "mcq",
    prompt: "Aspirin produces its antiplatelet effect by acting on which enzyme, blocking production of which mediator?",
    setup: "",
    ans: [
      { t: "COX-1, blocking thromboxane A2", ok: true },
      { t: "P2Y12, blocking ADP signaling", ok: false },
      { t: "COX-1, blocking serotonin release", ok: false },
      { t: "GP IIb/IIIa, blocking fibrinogen", ok: false },
    ],
    rationale: "Aspirin blocks cyclooxygenase-1, which makes thromboxane A2, the amplifier of platelet activation. P2Y12 is the target of clopidogrel-class drugs, and GP IIb/IIIa is blocked by abciximab-class agents. Pearl: aspirin hits COX-1 to shut off thromboxane A2.", // source: Anticoagulants deck slide 5
    scene: "pharmacology",
    sceneCfg: { label: "ASPIRIN COX-1" },
    metadata: { topic: "Aspirin target", priority: "high" },
  },

  {
    id: "ap1-w4-008",
    type: "mcq",
    prompt: "Clopidogrel, prasugrel, and ticagrelor share which platelet receptor target?",
    setup: "",
    ans: [
      { t: "The P2Y12 receptor for ADP", ok: true },
      { t: "The cyclooxygenase-1 enzyme", ok: false },
      { t: "The GP IIb/IIIa fibrinogen site", ok: false },
      { t: "The GP Ib von Willebrand site", ok: false },
    ],
    rationale: "Clopidogrel, prasugrel, and ticagrelor all block the P2Y12 receptor, the ADP-driven recruitment pathway. COX-1 is the aspirin target, and GP IIb/IIIa is blocked by abciximab-class drugs. Pearl: the thienopyridine-type agents share the P2Y12 target.", // source: Anticoagulants deck slide 5
    scene: "pharmacology",
    sceneCfg: { label: "P2Y12 BLOCKERS" },
    metadata: { topic: "P2Y12 inhibitors", priority: "high" },
  },

  {
    id: "ap1-w4-009",
    type: "mcq",
    prompt: "Abciximab, eptifibatide, and tirofiban block which receptor, described as the final common pathway of aggregation?",
    setup: "",
    ans: [
      { t: "GP IIb/IIIa fibrinogen receptor", ok: true },
      { t: "P2Y12 adenosine diphosphate receptor", ok: false },
      { t: "COX-1 thromboxane synthase enzyme", ok: false },
      { t: "GP Ib subendothelial collagen receptor", ok: false },
    ],
    rationale: "Abciximab, eptifibatide, and tirofiban block GP IIb/IIIa, the fibrinogen-crosslinking receptor that is the final common pathway of aggregation. P2Y12 and COX-1 are upstream targets of other drug families, and GP Ib mediates adhesion. Pearl: GP IIb/IIIa blockers stop the final crosslinking step.", // source: Anticoagulants deck slide 5
    scene: "pharmacology",
    sceneCfg: { label: "GP IIB IIIA DRUGS" },
    metadata: { topic: "GP IIb/IIIa antagonists", priority: "medium" },
  },

  {
    id: "ap1-w4-010",
    type: "mcq",
    prompt: "The intrinsic coagulation pathway is triggered by contact with foreign surfaces and is monitored by which lab?",
    setup: "",
    ans: [
      { t: "Activated partial thromboplastin time", ok: true },
      { t: "Prothrombin time and the INR value", ok: false },
      { t: "Activated clotting time used on bypass", ok: false },
      { t: "Anti-factor Xa drug calibrated assay", ok: false },
    ],
    rationale: "The intrinsic pathway (XII to XI to IX activating X) is triggered by foreign-surface contact and measured by the aPTT. The prothrombin time tracks the extrinsic pathway, while ACT and anti-Xa serve other monitoring roles. Pearl: intrinsic pathway equals foreign surface equals aPTT.", // source: Anticoagulants deck slide 6
    scene: "pharmacology",
    sceneCfg: { label: "INTRINSIC APTT" },
    metadata: { topic: "Intrinsic pathway", priority: "high" },
  },

  {
    id: "ap1-w4-011",
    type: "mcq",
    prompt: "The extrinsic pathway is triggered by tissue injury through tissue factor plus factor VII. Which lab measures it?",
    setup: "",
    ans: [
      { t: "Prothrombin time, the PT assay", ok: true },
      { t: "Partial thromboplastin time", ok: false },
      { t: "Activated clotting time on pump", ok: false },
      { t: "Thrombin clotting time assay", ok: false },
    ],
    rationale: "The extrinsic pathway uses tissue factor plus factor VII to activate factor X and is measured by the prothrombin time. The aPTT measures the intrinsic pathway, and ACT and thrombin time serve other purposes. Pearl: extrinsic pathway equals tissue factor equals PT.", // source: Anticoagulants deck slide 6
    scene: "pharmacology",
    sceneCfg: { label: "EXTRINSIC PT" },
    metadata: { topic: "Extrinsic pathway", priority: "high" },
  },

  {
    id: "ap1-w4-012",
    type: "mcq",
    prompt: "The intrinsic and extrinsic pathways converge at which shared factor that begins the common pathway?",
    setup: "",
    ans: [
      { t: "Factor X, start of common pathway", ok: true },
      { t: "Factor II, the prothrombin step", ok: false },
      { t: "Factor VII, the extrinsic trigger", ok: false },
      { t: "Factor XII, the contact activator", ok: false },
    ],
    rationale: "Both pathways activate factor X, the start of the common pathway. Factor II is downstream prothrombin, factor VII is part of the extrinsic trigger, and factor XII initiates the intrinsic pathway. Pearl: both roads meet at factor X.", // source: Anticoagulants deck slide 6
    scene: "pharmacology",
    sceneCfg: { label: "CONVERGE AT X" },
    metadata: { topic: "Pathway convergence", priority: "high" },
  },

  {
    id: "ap1-w4-013",
    type: "mcq",
    prompt: "In the common pathway, what is the direct enzymatic action of factor Xa?",
    setup: "",
    ans: [
      { t: "Converts prothrombin to thrombin", ok: true },
      { t: "Converts fibrinogen to fibrin", ok: false },
      { t: "Converts plasminogen to plasmin", ok: false },
      { t: "Converts factor XII to factor XI", ok: false },
    ],
    rationale: "Factor Xa converts prothrombin (factor II) to thrombin (IIa). Thrombin, not Xa, converts fibrinogen to fibrin; tPA converts plasminogen to plasmin; and factor XII activation is part of the intrinsic cascade. Pearl: Xa makes thrombin.", // source: Anticoagulants deck slide 7
    scene: "pharmacology",
    sceneCfg: { label: "XA MAKES THROMBIN" },
    metadata: { topic: "Common pathway Xa", priority: "high" },
  },

  {
    id: "ap1-w4-014",
    type: "mcq",
    prompt: "What is the direct action of thrombin (factor IIa) in the common pathway?",
    setup: "",
    ans: [
      { t: "Converts fibrinogen to fibrin", ok: true },
      { t: "Converts prothrombin to thrombin", ok: false },
      { t: "Converts factor X to factor Xa", ok: false },
      { t: "Converts plasmin to plasminogen", ok: false },
    ],
    rationale: "Thrombin cleaves fibrinogen into fibrin, which stabilizes the platelet plug into a real clot. Xa converts prothrombin to thrombin, the pathways converge to activate X upstream, and plasmin direction is reversed and belongs to fibrinolysis. Pearl: thrombin turns fibrinogen into fibrin.", // source: Anticoagulants deck slide 7
    scene: "pharmacology",
    sceneCfg: { label: "THROMBIN MAKES FIBRIN" },
    metadata: { topic: "Common pathway thrombin", priority: "high" },
  },

  {
    id: "ap1-w4-015",
    type: "mcq",
    prompt: "Stripped to essentials, every clinically useful anticoagulant does one of three things. Which is NOT one of them?",
    setup: "",
    ans: [
      { t: "Dissolves existing fibrin clot", ok: true },
      { t: "Blocks circulating factor Xa", ok: false },
      { t: "Blocks factor IIa thrombin", ok: false },
      { t: "Stops hepatic factor synthesis", ok: false },
    ],
    rationale: "Anticoagulants block Xa, block IIa, or stop the liver from making the factors; none directly dissolve existing fibrin, which is the job of fibrinolytics like tPA. The other three options are exactly the framework. Pearl: anticoagulants hit Xa, IIa, or hepatic synthesis, not the existing clot.", // source: Anticoagulants deck slide 8
    scene: "pharmacology",
    sceneCfg: { label: "WHERE DRUGS HIT" },
    metadata: { topic: "Anticoagulant framework", priority: "high" },
  },

  {
    id: "ap1-w4-016",
    type: "mcq",
    prompt: "Within the common pathway, which two molecules are the convergence and final amplifier targets that anticoagulants aim at?",
    setup: "",
    ans: [
      { t: "Factor Xa and factor IIa", ok: true },
      { t: "Factor XII and factor VII", ok: false },
      { t: "Factor IX and factor XI", ok: false },
      { t: "Fibrinogen and plasminogen", ok: false },
    ],
    rationale: "Factor Xa is the convergence point of both pathways and factor IIa (thrombin) is the final amplifier that cleaves fibrinogen, so these are the two molecules that matter. Factors XII, VII, IX, and XI are upstream pathway-specific, and fibrinogen and plasminogen are substrates. Pearl: reduce the cascade to Xa and IIa.", // source: Anticoagulants deck slide 8
    scene: "pharmacology",
    sceneCfg: { label: "XA AND IIA" },
    metadata: { topic: "Two key molecules", priority: "medium" },
  },

  {
    id: "ap1-w4-017",
    type: "mcq",
    prompt: "Antithrombin is best classified as which type of molecule, and it inhibits which group of factors?",
    setup: "",
    ans: [
      { t: "A serpin inhibiting IIa, Xa, IXa, XIa", ok: true },
      { t: "A serpin that inhibits only IIa and Xa", ok: false },
      { t: "A cofactor that activates IIa and Xa", ok: false },
      { t: "A zymogen that cleaves fibrin and Va", ok: false },
    ],
    rationale: "Antithrombin is a circulating serpin (serine protease inhibitor) that on its own slowly inhibits factors IIa, Xa, IXa, XIa, and XIIa. It inhibits more than just IIa and Xa, it inhibits rather than activates, and it is not a zymogen. Pearl: antithrombin is a serpin that brakes IIa, Xa, IXa, XIa, and XIIa.", // source: Anticoagulants deck slide 9
    scene: "pharmacology",
    sceneCfg: { label: "ANTITHROMBIN SERPIN" },
    metadata: { topic: "Antithrombin", priority: "high" },
  },

  {
    id: "ap1-w4-018",
    type: "mcq",
    prompt: "By approximately what magnitude does heparin amplify antithrombin's inhibitory activity?",
    setup: "",
    ans: [
      { t: "Roughly 1000 to 10000 fold faster", ok: true },
      { t: "Roughly 10 to 100 fold faster only", ok: false },
      { t: "Roughly 100 to 500 fold faster only", ok: false },
      { t: "Roughly 2 to 4 fold faster at most", ok: false },
    ],
    rationale: "Heparin binds antithrombin and accelerates its inhibition of clotting factors by 1000 to 10000 fold. The smaller multiples understate the dramatic acceleration heparin produces. Pearl: heparin speeds antithrombin roughly 1000 to 10000 times.", // source: Anticoagulants deck slide 9
    scene: "pharmacology",
    sceneCfg: { label: "1000 TO 10000 FOLD" },
    metadata: { topic: "Heparin amplification", priority: "high" },
  },

  {
    id: "ap1-w4-019",
    type: "mcq",
    prompt: "A patient gets no rise in aPTT despite escalating heparin doses. Which mechanism best explains this heparin resistance?",
    setup: "",
    ans: [
      { t: "Antithrombin deficiency", ok: true },
      { t: "Protein C deficiency state", ok: false },
      { t: "Excess tissue factor inhibitor", ok: false },
      { t: "Vitamin K excess from diet", ok: false },
    ],
    rationale: "Heparin works only by amplifying antithrombin, so an antithrombin-deficient patient shows heparin resistance with little anticoagulant effect. Protein C deficiency, TFPI excess, and dietary vitamin K do not explain failure of heparin to act. Pearl: no antithrombin means no heparin effect.", // source: Anticoagulants deck slide 9
    scene: "pharmacology",
    sceneCfg: { label: "HEPARIN RESISTANCE" },
    metadata: { topic: "Heparin resistance", priority: "high" },
  },

  {
    id: "ap1-w4-020",
    type: "mcq",
    prompt: "Activated protein C, with protein S, inactivates which clotting factors, and what activates the system?",
    setup: "",
    ans: [
      { t: "Va and VIIIa via thrombin-thrombomodulin", ok: true },
      { t: "IIa and Xa via the thrombomodulin complex", ok: false },
      { t: "Va and VIIIa via the tissue factor VIIa", ok: false },
      { t: "VIIa and Xa via the platelet GP Ib site", ok: false },
    ],
    rationale: "The thrombin-thrombomodulin complex activates protein C, which with protein S cleaves and inactivates factors Va and VIIIa. It does not target IIa or Xa directly, and tissue factor VIIa is the target of TFPI, not the activator of protein C. Pearl: protein C plus S inactivate Va and VIIIa after thrombin-thrombomodulin turns them on.", // source: Anticoagulants deck slide 10
    scene: "pharmacology",
    sceneCfg: { label: "PROTEIN C INACTIVATES VA VIIIA" },
    metadata: { topic: "Protein C and S", priority: "high" },
  },

  {
    id: "ap1-w4-021",
    type: "mcq",
    prompt: "Tissue factor pathway inhibitor exerts its anticoagulant brake by shutting down which complex?",
    setup: "",
    ans: [
      { t: "Tissue factor and factor VIIa complex", ok: true },
      { t: "The thrombin and thrombomodulin complex", ok: false },
      { t: "The antithrombin and heparin complex", ok: false },
      { t: "The factor Va and factor VIIIa complex", ok: false },
    ],
    rationale: "Tissue factor pathway inhibitor shuts down the tissue factor / factor VIIa complex, braking the extrinsic trigger. The thrombin-thrombomodulin complex activates protein C, the antithrombin-heparin pairing is a different brake, and Va plus VIIIa are the targets of protein C, not TFPI. Pearl: TFPI silences the tissue factor VIIa complex.", // source: Anticoagulants deck slide 10
    scene: "pharmacology",
    sceneCfg: { label: "TFPI TARGET" },
    metadata: { topic: "TFPI", priority: "medium" },
  },

  {
    id: "ap1-w4-022",
    type: "mcq",
    prompt: "Why does protein C and protein S being vitamin K dependent matter clinically?",
    setup: "",
    ans: [
      { t: "It creates warfarin's procoagulant phase", ok: true },
      { t: "It causes slow onset heparin resistance", ok: false },
      { t: "It explains the TFPI deficiency bleeding", ok: false },
      { t: "It prolongs the aPTT in any deficiency", ok: false },
    ],
    rationale: "Because proteins C and S are vitamin K dependent, warfarin lowers them too, and their early fall produces warfarin's initial procoagulant phase. This is unrelated to heparin resistance, TFPI deficiency, or aPTT prolongation. Pearl: vitamin K dependent natural anticoagulants explain warfarin's early prothrombotic window.", // source: Anticoagulants deck slide 10
    scene: "pharmacology",
    sceneCfg: { label: "WARFARIN PROCOAGULANT BASIS" },
    metadata: { topic: "Procoagulant phase basis", priority: "high" },
  },

  {
    id: "ap1-w4-023",
    type: "mcq",
    prompt: "Which grouping correctly lists all six vitamin K dependent proteins?",
    setup: "",
    ans: [
      { t: "II, VII, IX, X plus proteins C and S", ok: true },
      { t: "II, VII, IX, X plus proteins S and Z", ok: false },
      { t: "I, II, V, X plus proteins C and S", ok: false },
      { t: "VII, VIII, IX, X plus proteins C, S", ok: false },
    ],
    rationale: "The vitamin K dependent proteins are procoagulant factors II, VII, IX, and X plus anticoagulant proteins C and S. Factors I, V, and VIII are not vitamin K dependent, so the other lists are wrong. Pearl: remember 2, 7, 9, 10 and proteins C and S.", // source: Anticoagulants deck slide 11
    scene: "pharmacology",
    sceneCfg: { label: "VITAMIN K FACTORS" },
    metadata: { topic: "Vitamin K dependent factors", priority: "high" },
  },

  {
    id: "ap1-w4-024",
    type: "mcq",
    prompt: "What does gamma-carboxylation add to a clotting factor, and what happens without it?",
    setup: "",
    ans: [
      { t: "A calcium-binding tail; loses calcium binding", ok: true },
      { t: "A heparin-binding site; loses heparin binding", ok: false },
      { t: "A fibrin-binding domain; loses fibrin binding", ok: false },
      { t: "A phospholipid head; cannot exit the liver", ok: false },
    ],
    rationale: "Gamma-carboxylation adds a calcium-binding tail; without it the factor is still synthesized but cannot bind calcium and cannot participate in the cascade. The modification is not about heparin, fibrin, or phospholipid binding. Pearl: no gamma-carboxylation means no calcium binding and a non-functional factor.", // source: Anticoagulants deck slide 11
    scene: "pharmacology",
    sceneCfg: { label: "CALCIUM BINDING TAIL" },
    metadata: { topic: "Gamma-carboxylation", priority: "high" },
  },

  {
    id: "ap1-w4-025",
    type: "mcq",
    prompt: "Warfarin works by blocking which enzyme, with what downstream consequence?",
    setup: "",
    ans: [
      { t: "Epoxide reductase; vitamin K not recycled", ok: true },
      { t: "Cyclooxygenase-1; no thromboxane A2 made", ok: false },
      { t: "Antithrombin synthesis; no serpin activity", ok: false },
      { t: "Plasminogen activator; no plasmin formed", ok: false },
    ],
    rationale: "Warfarin blocks vitamin K epoxide reductase, the enzyme that recycles vitamin K, so gamma-carboxylation of factors stops. It does not touch COX-1, antithrombin, or tPA. Pearl: warfarin blocks VKOR and starves the cell of recycled vitamin K.", // source: Anticoagulants deck slide 11
    scene: "pharmacology",
    sceneCfg: { label: "WARFARIN BLOCKS VKOR" },
    metadata: { topic: "Warfarin target enzyme", priority: "high" },
  },

  {
    id: "ap1-w4-026",
    type: "mcq",
    prompt: "During fibrinolysis, tissue plasminogen activator from endothelium performs which conversion?",
    setup: "",
    ans: [
      { t: "Plasminogen zymogen to active plasmin", ok: true },
      { t: "Plasmin enzyme to inactive plasminogen", ok: false },
      { t: "Fibrinogen substrate to fibrin strands", ok: false },
      { t: "Prothrombin factor II to thrombin IIa", ok: false },
    ],
    rationale: "Endothelial tPA converts the inactive zymogen plasminogen into active plasmin. The reverse direction is wrong, fibrinogen to fibrin is thrombin's job, and prothrombin to thrombin is Xa's job. Pearl: tPA activates plasminogen into plasmin.", // source: Anticoagulants deck slide 12
    scene: "pharmacology",
    sceneCfg: { label: "TPA MAKES PLASMIN" },
    metadata: { topic: "Fibrinolysis mechanism", priority: "high" },
  },

  {
    id: "ap1-w4-027",
    type: "mcq",
    prompt: "What is the direct action of plasmin once it is generated?",
    setup: "",
    ans: [
      { t: "Cleaves fibrin and breaks the clot apart", ok: true },
      { t: "Cleaves fibrinogen into stable fibrin", ok: false },
      { t: "Activates antithrombin against thrombin", ok: false },
      { t: "Converts prothrombin into active thrombin", ok: false },
    ],
    rationale: "Plasmin cleaves fibrin and breaks the clot apart, completing fibrinolysis. It degrades rather than builds fibrin, does not activate antithrombin, and does not generate thrombin. Pearl: plasmin is the enzyme that digests the fibrin clot.", // source: Anticoagulants deck slide 12
    scene: "pharmacology",
    sceneCfg: { label: "PLASMIN CLEAVES FIBRIN" },
    metadata: { topic: "Plasmin action", priority: "high" },
  },

  {
    id: "ap1-w4-028",
    type: "mcq",
    prompt: "Tranexamic acid preserves an existing clot by competitively blocking what, on which molecule?",
    setup: "",
    ans: [
      { t: "The lysine-binding site on plasminogen", ok: true },
      { t: "The active site on circulating thrombin", ok: false },
      { t: "The fibrinogen-binding site on platelets", ok: false },
      { t: "The catalytic site on tissue factor", ok: false },
    ],
    rationale: "Tranexamic acid is a lysine analog that competitively blocks plasminogen's lysine-binding site, preventing it from binding fibrin and being converted to plasmin. It does not target thrombin's active site, platelet fibrinogen binding, or tissue factor. Pearl: TXA occupies plasminogen's lysine-binding site to preserve the clot.", // source: Anticoagulants deck slide 13
    scene: "pharmacology",
    sceneCfg: { label: "TXA LYSINE SITE" },
    metadata: { topic: "TXA mechanism", priority: "high" },
  },

  {
    id: "ap1-w4-029",
    type: "mcq",
    prompt: "How does epsilon-aminocaproic acid (Amicar) compare with tranexamic acid?",
    setup: "",
    ans: [
      { t: "Same lysine-site mechanism but weaker", ok: true },
      { t: "Different mechanism and more potent", ok: false },
      { t: "Blocks thrombin rather than plasminogen", ok: false },
      { t: "Same mechanism and equally potent", ok: false },
    ],
    rationale: "Epsilon-aminocaproic acid shares the lysine-analog mechanism of blocking the plasminogen lysine-binding site but is weaker than tranexamic acid. It is not a thrombin blocker, not more potent, and not equipotent. Pearl: EACA is the weaker lysine-analog sibling of TXA.", // source: Anticoagulants deck slide 13
    scene: "pharmacology",
    sceneCfg: { label: "EACA WEAKER" },
    metadata: { topic: "EACA versus TXA", priority: "medium" },
  },

  {
    id: "ap1-w4-030",
    type: "mcq",
    prompt: "Tranexamic acid has demonstrated benefit in all of the following settings EXCEPT which?",
    setup: "",
    ans: [
      { t: "Dissolving an established lung embolus", ok: true },
      { t: "Major trauma with active hemorrhage now", ok: false },
      { t: "Bleeding during open cardiac surgery", ok: false },
      { t: "Control of postpartum hemorrhage now", ok: false },
    ],
    rationale: "TXA preserves clot and is used in trauma, cardiac surgery, postpartum hemorrhage, and joint arthroplasty; it does not dissolve clot, so treating a pulmonary embolus is the wrong setting. The other three are established TXA indications. Pearl: TXA stops bleeding by preserving clot, it never lyses an existing thrombus.", // source: Anticoagulants deck slide 13
    scene: "pharmacology",
    sceneCfg: { label: "TXA INDICATIONS" },
    metadata: { topic: "TXA indications", priority: "medium" },
  },

  {
    id: "ap1-w4-031",
    type: "mcq",
    prompt: "Which coagulation test reflects the extrinsic plus common pathway and is the standard warfarin monitor?",
    setup: "",
    ans: [
      { t: "Prothrombin time and INR", ok: true },
      { t: "Activated partial thromboplastin time", ok: false },
      { t: "Activated clotting time assay", ok: false },
      { t: "Thrombin time clotting assay", ok: false },
    ],
    rationale: "The prothrombin time and INR test the extrinsic and common pathways and are most sensitive to factor VII, making it the standard warfarin monitor. The aPTT tracks the intrinsic and common pathways and monitors therapeutic heparin. The ACT measures whole-blood clotting at very high heparin levels for bypass. Thrombin time reflects direct thrombin activity. Pearl: PT/INR equals warfarin, aPTT equals heparin.", // source: Anticoagulants deck slide 14
    scene: "pharmacology",
    sceneCfg: { label: "PT INR WARFARIN TEST" },
    metadata: { topic: "Coagulation labs", priority: "high" },
  },

  {
    id: "ap1-w4-032",
    type: "mcq",
    prompt: "The prothrombin time is described as most sensitive to which single clotting factor?",
    setup: "",
    ans: [
      { t: "Factor VII of extrinsic pathway", ok: true },
      { t: "Factor IX within the intrinsic pathway", ok: false },
      { t: "Factor XII of contact activation", ok: false },
      { t: "Factor II of final common step", ok: false },
    ],
    rationale: "The PT is most sensitive to factor VII, the short half-life extrinsic factor, which is why the INR rises early after warfarin is started. Factors IX and XII sit in the intrinsic pathway measured by aPTT. Factor II is common to both pathways but is not the PT sentinel factor. Pearl: factor VII drives the early INR rise.", // source: Anticoagulants deck slide 14
    scene: "pharmacology",
    sceneCfg: { label: "PT SENSITIVE FACTOR VII" },
    metadata: { topic: "Coagulation labs", priority: "medium" },
  },

  {
    id: "ap1-w4-033",
    type: "mcq",
    prompt: "Which test specifically monitors therapeutic unfractionated heparin by reflecting the intrinsic plus common pathway?",
    setup: "",
    ans: [
      { t: "Activated partial thromboplastin time", ok: true },
      { t: "Prothrombin time reported as the INR", ok: false },
      { t: "Bleeding time measured at the bedside", ok: false },
      { t: "Ecarin clotting time done by titration", ok: false },
    ],
    rationale: "The aPTT reflects the intrinsic and common pathways and is the therapeutic heparin test for prophylactic and low-dose therapeutic ranges. PT/INR is the warfarin test. Bleeding time assesses platelet function, not heparin. Ecarin clotting time measures direct thrombin inhibitors such as dabigatran. Pearl: aPTT is the bedside therapeutic heparin monitor.", // source: Anticoagulants deck slide 14
    scene: "pharmacology",
    sceneCfg: { label: "APTT HEPARIN TEST" },
    metadata: { topic: "Coagulation labs", priority: "high" },
  },

  {
    id: "ap1-w4-034",
    type: "mcq",
    prompt: "Which test is designed for whole-blood clotting at the very high heparin concentrations of cardiopulmonary bypass?",
    setup: "",
    ans: [
      { t: "Activated clotting time", ok: true },
      { t: "Activated partial thromboplastin time", ok: false },
      { t: "Prothrombin time with INR", ok: false },
      { t: "Anti-factor Xa chromogenic assay", ok: false },
    ],
    rationale: "The ACT measures whole-blood clotting and stays calibrated at the very high heparin concentrations used on bypass, where the aPTT runs off-scale. PT/INR monitors warfarin. The anti-Xa assay covers therapeutic heparin and Xa inhibitors but is not the bedside bypass test. Pearl: ACT is the cardiopulmonary bypass clotting test.", // source: Anticoagulants deck slide 14
    scene: "pharmacology",
    sceneCfg: { label: "ACT BYPASS TEST" },
    metadata: { topic: "Coagulation labs", priority: "high" },
  },

  {
    id: "ap1-w4-035",
    type: "mcq",
    prompt: "The anti-factor Xa assay provides a direct measure of inhibition of which factor?",
    setup: "",
    ans: [
      { t: "Factor Xa in the common pathway", ok: true },
      { t: "Factor IIa driving thrombin output", ok: false },
      { t: "Factor VIIa in extrinsic complex", ok: false },
      { t: "Factor XIIa of contact activation", ok: false },
    ],
    rationale: "The anti-factor Xa assay directly quantifies factor Xa inhibition, which is why it is used for LMWH, fondaparinux, and direct Xa inhibitors. Thrombin (IIa) inhibition is captured by thrombin time and ecarin clotting time. Factors VIIa and XIIa are not what this assay measures. Pearl: anti-Xa assay measures factor Xa inhibition directly.", // source: Anticoagulants deck slide 15
    scene: "pharmacology",
    sceneCfg: { label: "ANTI XA ASSAY TARGET" },
    metadata: { topic: "Direct inhibitor tests", priority: "high" },
  },

  {
    id: "ap1-w4-036",
    type: "mcq",
    prompt: "For which group of drugs is the anti-factor Xa assay the appropriate monitoring test?",
    setup: "",
    ans: [
      { t: "LMWH, fondaparinux, Xa inhibitors", ok: true },
      { t: "Warfarin, aspirin, clopidogrel", ok: false },
      { t: "Dabigatran, argatroban, bivalirudin", ok: false },
      { t: "Alteplase, urokinase, reteplase", ok: false },
    ],
    rationale: "The anti-Xa assay is used for low-molecular-weight heparin, fondaparinux, and the direct factor Xa inhibitors because all act on factor Xa. Warfarin and aspirin are monitored or judged differently, and antiplatelets are not measured by anti-Xa. Dabigatran and parenteral thrombin inhibitors need thrombin-based assays. Pearl: anti-Xa fits the Xa-acting drug family.", // source: Anticoagulants deck slide 15
    scene: "pharmacology",
    sceneCfg: { label: "ANTI XA DRUG CLASS" },
    metadata: { topic: "Direct inhibitor tests", priority: "medium" },
  },

  {
    id: "ap1-w4-037",
    type: "mcq",
    prompt: "Thrombin time and ecarin clotting time are used to assess the direct inhibition of thrombin by which drug?",
    setup: "",
    ans: [
      { t: "Dabigatran the thrombin inhibitor", ok: true },
      { t: "Rivaroxaban the oral Xa inhibitor", ok: false },
      { t: "Enoxaparin the low-weight heparin", ok: false },
      { t: "Warfarin the vitamin K antagonist", ok: false },
    ],
    rationale: "Thrombin time and ecarin clotting time reflect direct thrombin inhibition and are used for dabigatran. Rivaroxaban acts on factor Xa and is followed by a calibrated anti-Xa assay. Enoxaparin is an anti-Xa drug, and warfarin is followed by PT/INR. Pearl: thrombin or ecarin time equals dabigatran.", // source: Anticoagulants deck slide 15
    scene: "pharmacology",
    sceneCfg: { label: "THROMBIN TIME DABIGATRAN" },
    metadata: { topic: "Direct inhibitor tests", priority: "high" },
  },

  {
    id: "ap1-w4-038",
    type: "mcq",
    prompt: "On a coagulation chart, identifying which test is in use is most directly useful because it tells you the:",
    setup: "",
    ans: [
      { t: "Drug class the patient is on", ok: true },
      { t: "Exact plasma drug concentration", ok: false },
      { t: "Patient renal clearance status", ok: false },
      { t: "Time since the last dose given", ok: false },
    ],
    rationale: "Each monitoring test maps to a drug class, so identifying the lab on the chart lets you identify what the patient is taking. The tests do not by themselves give exact plasma concentration, renal status, or last-dose timing. PT/INR points to warfarin, aPTT to heparin, anti-Xa to Xa drugs, thrombin time to dabigatran. Pearl: the lab names the drug class.", // source: Anticoagulants deck slide 15
    scene: "pharmacology",
    sceneCfg: { label: "LAB IDENTIFIES DRUG CLASS" },
    metadata: { topic: "Direct inhibitor tests", priority: "medium" },
  },

  {
    id: "ap1-w4-039",
    type: "mcq",
    prompt: "How do unfractionated heparin and low-molecular-weight heparin differ in their anti-Xa versus anti-IIa activity?",
    setup: "",
    ans: [
      { t: "UFH Xa equals IIa, LMWH Xa over IIa", ok: true },
      { t: "UFH Xa over IIa, LMWH Xa equals IIa", ok: false },
      { t: "Both have pure anti-IIa activity only", ok: false },
      { t: "Both have pure anti-Xa activity only", ok: false },
    ],
    rationale: "Unfractionated heparin inhibits factor Xa and thrombin about equally, while LMWH favors anti-Xa over anti-IIa because its shorter chains cannot bridge antithrombin to thrombin. Neither agent is purely anti-IIa or purely anti-Xa. This ratio difference underlies why LMWH is followed by anti-Xa levels. Pearl: UFH is balanced, LMWH leans anti-Xa.", // source: Anticoagulants deck slide 16
    scene: "pharmacology",
    sceneCfg: { label: "UFH VS LMWH RATIO" },
    metadata: { topic: "Anticoagulant drug map", priority: "high" },
  },

  {
    id: "ap1-w4-040",
    type: "mcq",
    prompt: "Among the direct oral anticoagulants, which one is a direct thrombin inhibitor rather than a factor Xa inhibitor?",
    setup: "",
    ans: [
      { t: "Dabigatran the thrombin inhibitor", ok: true },
      { t: "Rivaroxaban a factor Xa inhibitor", ok: false },
      { t: "Apixaban a factor Xa inhibitor", ok: false },
      { t: "Edoxaban a factor Xa inhibitor", ok: false },
    ],
    rationale: "Dabigatran is the lone direct thrombin inhibitor among the DOACs, while rivaroxaban, apixaban, and edoxaban all directly inhibit factor Xa. Recognizing the split between one thrombin drug and three Xa drugs anchors the entire class. Pearl: dabigatran is the only thrombin DOAC.", // source: Anticoagulants deck slide 16
    scene: "pharmacology",
    sceneCfg: { label: "DABIGATRAN THROMBIN DOAC" },
    metadata: { topic: "Anticoagulant drug map", priority: "high" },
  },

  {
    id: "ap1-w4-041",
    type: "mcq",
    prompt: "Warfarin interferes with vitamin K to impair which complete set of coagulation proteins?",
    setup: "",
    ans: [
      { t: "Factors II, VII, IX, X, proteins C and S", ok: true },
      { t: "Factors II, VII, IX, X plus fibrinogen", ok: false },
      { t: "Factors V, VIII, XI, and XII together", ok: false },
      { t: "Antithrombin together with proteins C, S", ok: false },
    ],
    rationale: "Warfarin blocks vitamin K recycling and impairs the vitamin K dependent procoagulants II, VII, IX, X plus the anticoagulants proteins C and S. Fibrinogen and factors V, VIII, XI, XII are not vitamin K dependent. Antithrombin is also not vitamin K dependent. Pearl: vitamin K factors are 2, 7, 9, 10 and proteins C and S.", // source: Anticoagulants deck slide 16
    scene: "pharmacology",
    sceneCfg: { label: "WARFARIN VITAMIN K FACTORS" },
    metadata: { topic: "Anticoagulant drug map", priority: "high" },
  },

  {
    id: "ap1-w4-042",
    type: "mcq",
    prompt: "On the antiplatelet map, which drug acts by inhibiting cyclooxygenase-1?",
    setup: "",
    ans: [
      { t: "Aspirin acting on COX-1", ok: true },
      { t: "Clopidogrel acting on P2Y12", ok: false },
      { t: "Tirofiban acting on GP IIb IIIa", ok: false },
      { t: "Ticagrelor acting on P2Y12", ok: false },
    ],
    rationale: "Aspirin is the COX-1 inhibitor on the antiplatelet map, blocking thromboxane A2 production. Clopidogrel and ticagrelor act at the P2Y12 ADP receptor. Tirofiban blocks the GP IIb/IIIa fibrinogen receptor. Pearl: aspirin equals COX-1 on the map.", // source: Anticoagulants deck slide 17
    scene: "pharmacology",
    sceneCfg: { label: "ASPIRIN COX1 TARGET" },
    metadata: { topic: "Antiplatelet drug map", priority: "medium" },
  },

  {
    id: "ap1-w4-043",
    type: "mcq",
    prompt: "Which set of agents represents the P2Y12 receptor inhibitors on the antiplatelet map?",
    setup: "",
    ans: [
      { t: "Clopidogrel, prasugrel, ticagrelor", ok: true },
      { t: "Abciximab, eptifibatide, tirofiban", ok: false },
      { t: "Aspirin, dipyridamole, cilostazol", ok: false },
      { t: "Rivaroxaban, apixaban, edoxaban", ok: false },
    ],
    rationale: "Clopidogrel, prasugrel, and ticagrelor are the P2Y12 inhibitors that block ADP-driven platelet recruitment. Abciximab, eptifibatide, and tirofiban are the GP IIb/IIIa antagonists. Aspirin works at COX-1, and the Xa inhibitors are anticoagulants, not antiplatelets. Pearl: the P2Y12 trio is clopidogrel, prasugrel, ticagrelor.", // source: Anticoagulants deck slide 17
    scene: "pharmacology",
    sceneCfg: { label: "P2Y12 INHIBITOR TRIO" },
    metadata: { topic: "Antiplatelet drug map", priority: "medium" },
  },

  {
    id: "ap1-w4-044",
    type: "mcq",
    prompt: "Which group of agents blocks the GP IIb/IIIa fibrinogen receptor, the final common platelet pathway?",
    setup: "",
    ans: [
      { t: "Abciximab, eptifibatide, tirofiban", ok: true },
      { t: "Clopidogrel, prasugrel, ticagrelor", ok: false },
      { t: "Aspirin, ticlopidine, dipyridamole", ok: false },
      { t: "Dabigatran, rivaroxaban, apixaban", ok: false },
    ],
    rationale: "Abciximab, eptifibatide, and tirofiban antagonize the GP IIb/IIIa receptor that crosslinks fibrinogen, the final common step of aggregation. The P2Y12 trio and aspirin act upstream. The DOACs are anticoagulants targeting thrombin or Xa, not platelet receptors. Pearl: the GP IIb/IIIa trio ends in -mab and -fiban agents.", // source: Anticoagulants deck slide 17
    scene: "pharmacology",
    sceneCfg: { label: "GP IIB IIIA TRIO" },
    metadata: { topic: "Antiplatelet drug map", priority: "medium" },
  },

  {
    id: "ap1-w4-045",
    type: "mcq",
    prompt: "Which two drugs are classified as antifibrinolytic procoagulants on the drug map?",
    setup: "",
    ans: [
      { t: "Tranexamic acid and aminocaproic acid", ok: true },
      { t: "Alteplase with tenecteplase as agents", ok: false },
      { t: "Protamine paired with vitamin K agents", ok: false },
      { t: "Desmopressin with cryoprecipitate units", ok: false },
    ],
    rationale: "Tranexamic acid and epsilon-aminocaproic acid are the antifibrinolytic procoagulants, blocking plasminogen activation to preserve clot. Alteplase and tenecteplase are fibrinolytics that do the opposite. Protamine and vitamin K are reversal agents but not antifibrinolytics. Pearl: the lysine analogs TXA and Amicar preserve clot.", // source: Anticoagulants deck slide 17
    scene: "pharmacology",
    sceneCfg: { label: "ANTIFIBRINOLYTIC AGENTS" },
    metadata: { topic: "Procoagulant drug map", priority: "medium" },
  },

  {
    id: "ap1-w4-046",
    type: "mcq",
    prompt: "What is the initiating molecular step in heparin's anticoagulant mechanism?",
    setup: "",
    ans: [
      { t: "Binds antithrombin and shifts its shape", ok: true },
      { t: "Binds thrombin and cleaves it directly", ok: false },
      { t: "Blocks the vitamin K epoxide reductase", ok: false },
      { t: "Acetylates platelet cyclooxygenase fully", ok: false },
    ],
    rationale: "Heparin binds circulating antithrombin and induces a conformational change that dramatically accelerates antithrombin's inhibition of clotting factors. It does not cleave thrombin directly, which describes direct thrombin inhibitors. Blocking vitamin K epoxide reductase is warfarin, and acetylating COX-1 is aspirin. Pearl: heparin works through antithrombin, not directly.", // source: Anticoagulants deck slide 18
    scene: "pharmacology",
    sceneCfg: { label: "HEPARIN BINDS ANTITHROMBIN" },
    metadata: { topic: "Heparin mechanism", priority: "high" },
  },

  {
    id: "ap1-w4-047",
    type: "mcq",
    prompt: "By approximately what magnitude does heparin accelerate antithrombin's inhibition of thrombin?",
    setup: "",
    ans: [
      { t: "About 1,000 to 10,000-fold", ok: true },
      { t: "About 2 to 4-fold increase", ok: false },
      { t: "About 10 to 50-fold increase", ok: false },
      { t: "About 100 to 200-fold increase", ok: false },
    ],
    rationale: "Heparin amplifies antithrombin's inhibition of thrombin roughly 1,000 to 10,000-fold, converting a slow natural brake into a rapid one. The smaller multiples understate this dramatic catalytic effect. This explains why heparin acts immediately by intravenous route. Pearl: heparin boosts antithrombin a thousand to ten thousand times.", // source: Anticoagulants deck slide 18
    scene: "pharmacology",
    sceneCfg: { label: "HEPARIN AMPLIFICATION FOLD" },
    metadata: { topic: "Heparin mechanism", priority: "high" },
  },

  {
    id: "ap1-w4-048",
    type: "mcq",
    prompt: "Besides thrombin and factor Xa, heparin-bound antithrombin also amplifies inhibition of which factors?",
    setup: "",
    ans: [
      { t: "Factors XIIa, XIa, and IXa", ok: true },
      { t: "Factors Va, VIIIa, and VIIa", ok: false },
      { t: "Factors V, VII, and fibrinogen", ok: false },
      { t: "Proteins C, S, and antithrombin", ok: false },
    ],
    rationale: "Heparin-antithrombin also amplifies inhibition of the intrinsic serine proteases XIIa, XIa, and IXa in addition to thrombin and Xa. Factors Va and VIIIa are inactivated by activated protein C, not antithrombin. Factors V and VII and fibrinogen are not antithrombin targets. Pearl: antithrombin hits the intrinsic proteases 12a, 11a, 9a too.", // source: Anticoagulants deck slide 18
    scene: "pharmacology",
    sceneCfg: { label: "HEPARIN OTHER FACTORS" },
    metadata: { topic: "Heparin mechanism", priority: "medium" },
  },

  {
    id: "ap1-w4-049",
    type: "mcq",
    prompt: "A patient fails to respond to escalating heparin doses due to antithrombin deficiency. What is the appropriate treatment?",
    setup: "",
    ans: [
      { t: "Antithrombin concentrate or plasma", ok: true },
      { t: "Protamine sulfate by a slow infusion", ok: false },
      { t: "A higher heparin bolus with vitamin K", ok: false },
      { t: "Idarucizumab antibody fragment dosing", ok: false },
    ],
    rationale: "Antithrombin deficiency causes heparin resistance because heparin needs antithrombin to work; the fix is to supply it with antithrombin concentrate (Thrombate III) or fresh frozen plasma. Protamine reverses heparin rather than enabling it. More heparin will not help without substrate, and idarucizumab reverses dabigatran. Pearl: heparin resistance is treated by replacing antithrombin.", // source: Anticoagulants deck slide 18
    scene: "pharmacology",
    sceneCfg: { label: "HEPARIN RESISTANCE TREATMENT" },
    metadata: { topic: "Heparin mechanism", priority: "high" },
  },

  {
    id: "ap1-w4-050",
    type: "mcq",
    prompt: "Why is heparin dosed in units rather than milligrams?",
    setup: "",
    ans: [
      { t: "Activity varies between equal-mass vials", ok: true },
      { t: "Units convert straight to anti-Xa levels", ok: false },
      { t: "Milligram dosing exceeds safe limits fast", ok: false },
      { t: "Renal clearance is computed only in units", ok: false },
    ],
    rationale: "Heparin is dosed in units because biological activity varies between vials containing equal milligrams, so units standardize the actual anticoagulant effect. Units do not map directly to plasma anti-Xa levels, nor is the choice about weight limits or renal math. This variability is a recurring theme in heparin pharmacology. Pearl: units capture activity that milligrams cannot.", // source: Anticoagulants deck slide 19
    scene: "pharmacology",
    sceneCfg: { label: "HEPARIN DOSED IN UNITS" },
    metadata: { topic: "Heparin pharmacokinetics", priority: "medium" },
  },

  {
    id: "ap1-w4-051",
    type: "mcq",
    prompt: "What is the approximate elimination half-life of heparin at therapeutic doses?",
    setup: "",
    ans: [
      { t: "About 1 hour at therapeutic doses", ok: true },
      { t: "About 20 minutes at therapeutic doses", ok: false },
      { t: "About 4 hours at therapeutic doses", ok: false },
      { t: "About 12 hours at therapeutic doses", ok: false },
    ],
    rationale: "Heparin has a half-life of roughly 1 hour at therapeutic doses, which guides timing of protamine reversal and neuraxial procedures. Twenty minutes is far too short, and 4 or 12 hours overstate its persistence. The nonlinear dose-response means higher doses prolong this somewhat. Pearl: think one hour for therapeutic heparin half-life.", // source: Anticoagulants deck slide 19
    scene: "pharmacology",
    sceneCfg: { label: "HEPARIN HALF LIFE" },
    metadata: { topic: "Heparin pharmacokinetics", priority: "high" },
  },

  {
    id: "ap1-w4-052",
    type: "mcq",
    prompt: "Which statement best describes heparin's onset by route of administration?",
    setup: "",
    ans: [
      { t: "IV immediate; subcutaneous prophylactic", ok: true },
      { t: "IV delayed; subcutaneous immediate onset", ok: false },
      { t: "Both routes give an equally rapid onset", ok: false },
      { t: "Oral route preferred for therapeutic use", ok: false },
    ],
    rationale: "Intravenous heparin has immediate onset, while the subcutaneous route is reserved for prophylaxis because bioavailability is too variable for reliable therapeutic anticoagulation. Subcutaneous onset is not immediate, and the routes are not equivalent. Heparin is not given orally. Pearl: IV heparin is immediate, SC is prophylaxis only.", // source: Anticoagulants deck slide 19
    scene: "pharmacology",
    sceneCfg: { label: "HEPARIN ROUTE ONSET" },
    metadata: { topic: "Heparin pharmacokinetics", priority: "medium" },
  },

  {
    id: "ap1-w4-053",
    type: "mcq",
    prompt: "Heparin dose-response is nonlinear. Roughly how much does patient sensitivity vary?",
    setup: "",
    ans: [
      { t: "Fourfold, metabolism varying threefold", ok: true },
      { t: "Twofold, with metabolism varying twofold", ok: false },
      { t: "Tenfold, with metabolism varying fivefold", ok: false },
      { t: "Identical across all adult patients alike", ok: false },
    ],
    rationale: "Patient sensitivity to heparin varies about fourfold and metabolism about threefold, which together with the nonlinear dose-response mandates monitoring. The twofold and tenfold figures misstate the spread, and response is clearly not uniform between patients. This variability is why fixed dosing is unreliable. Pearl: sensitivity fourfold, metabolism threefold.", // source: Anticoagulants deck slide 19
    scene: "pharmacology",
    sceneCfg: { label: "HEPARIN VARIABILITY RANGE" },
    metadata: { topic: "Heparin pharmacokinetics", priority: "medium" },
  },

  {
    id: "ap1-w4-054",
    type: "mcq",
    prompt: "Which test and target are correct for monitoring prophylactic and low-dose therapeutic heparin?",
    setup: "",
    ans: [
      { t: "aPTT at 1.5 to 2.5 times baseline", ok: true },
      { t: "aPTT at 0.3 to 0.7 anti-Xa units per mL", ok: false },
      { t: "ACT held at 1.5 to 2.5 times baseline", ok: false },
      { t: "Anti-Xa kept at 4 times control value", ok: false },
    ],
    rationale: "The aPTT monitors prophylactic and low-dose therapeutic heparin with a target of 1.5 to 2.5 times baseline. Units per mL is the anti-Xa target, not an aPTT target. The ACT is for bypass, not low-dose heparin. Pearl: aPTT goal is 1.5 to 2.5 times baseline.", // source: Anticoagulants deck slide 20
    scene: "pharmacology",
    sceneCfg: { label: "APTT HEPARIN TARGET" },
    metadata: { topic: "Heparin monitoring", priority: "high" },
  },

  {
    id: "ap1-w4-055",
    type: "mcq",
    prompt: "What is the therapeutic anti-factor Xa target range when this assay is used to monitor heparin?",
    setup: "",
    ans: [
      { t: "0.3 to 0.7 units per mL", ok: true },
      { t: "1.5 to 2.5 units per mL", ok: false },
      { t: "3.0 to 4.0 units per mL", ok: false },
      { t: "0.01 to 0.05 units per mL", ok: false },
    ],
    rationale: "The therapeutic anti-Xa target for heparin is 0.3 to 0.7 units/mL. The 1.5 to 2.5 figure belongs to the aPTT as a multiple of baseline, not anti-Xa units. The 3 to 4 units/mL range describes bypass concentrations measured by ACT. Pearl: therapeutic anti-Xa is 0.3 to 0.7 units per mL.", // source: Anticoagulants deck slide 20
    scene: "pharmacology",
    sceneCfg: { label: "ANTI XA HEPARIN TARGET" },
    metadata: { topic: "Heparin monitoring", priority: "high" },
  },

  {
    id: "ap1-w4-056",
    type: "mcq",
    prompt: "On cardiopulmonary bypass heparin runs near 3 to 4 units/mL. Why is the ACT used instead of the aPTT there?",
    setup: "",
    ans: [
      { t: "At that level the aPTT runs off-scale", ok: true },
      { t: "The aPTT cannot detect any heparin effect", ok: false },
      { t: "The ACT measures platelet function instead", ok: false },
      { t: "The aPTT requires plasma separation first", ok: false },
    ],
    rationale: "At bypass concentrations of about 3 to 4 units/mL, roughly 5 to 10 times therapeutic, the aPTT runs off-scale and becomes uninformative, while the ACT stays calibrated. The aPTT does detect heparin at lower levels, so it is not blind to the drug; it simply saturates. The ACT measures whole-blood clotting, not platelet function specifically. Pearl: ACT stays calibrated where aPTT saturates.", // source: Anticoagulants deck slide 20
    scene: "pharmacology",
    sceneCfg: { label: "ACT VERSUS APTT BYPASS" },
    metadata: { topic: "Heparin monitoring", priority: "high" },
  },

  {
    id: "ap1-w4-057",
    type: "mcq",
    prompt: "What two ingredients define the activated clotting time assay used on bypass?",
    setup: "",
    ans: [
      { t: "Whole blood plus celite or kaolin activator", ok: true },
      { t: "Plasma plus a tissue thromboplastin reagent", ok: false },
      { t: "Plasma plus calcium and a phospholipid mix", ok: false },
      { t: "Whole blood plus ecarin snake venom reagent", ok: false },
    ],
    rationale: "The ACT combines whole blood with a contact activator, either celite or kaolin, to measure clotting at high heparin levels. Tissue thromboplastin defines the PT, and calcium with phospholipid defines plasma-based clotting tests like the aPTT. Ecarin venom is used for direct thrombin inhibitor assays. Pearl: ACT equals whole blood plus celite or kaolin.", // source: Anticoagulants deck slide 21
    scene: "pharmacology",
    sceneCfg: { label: "ACT COMPONENTS" },
    metadata: { topic: "ACT bypass test", priority: "high" },
  },

  {
    id: "ap1-w4-058",
    type: "mcq",
    prompt: "What are the typical ACT baseline and the usual cardiopulmonary bypass target?",
    setup: "",
    ans: [
      { t: "Baseline 100 to 150, bypass at least 400", ok: true },
      { t: "Baseline 300 to 350, bypass at least 600", ok: false },
      { t: "Baseline 30 to 40, bypass at least 200", ok: false },
      { t: "Baseline 200 to 250, bypass at least 800", ok: false },
    ],
    rationale: "Baseline ACT is about 100 to 150 seconds and most centers require at least 400 seconds before initiating bypass. The other ranges misstate either the baseline or the threshold. Falling below the target on bypass mandates more heparin. Pearl: baseline 100 to 150, bypass goal at least 400 seconds.", // source: Anticoagulants deck slide 21
    scene: "pharmacology",
    sceneCfg: { label: "ACT BASELINE TARGET" },
    metadata: { topic: "ACT bypass test", priority: "high" },
  },

  {
    id: "ap1-w4-059",
    type: "mcq",
    prompt: "When should the ACT be checked around cardiopulmonary bypass?",
    setup: "",
    ans: [
      { t: "Baseline, after the bolus, every 30 min", ok: true },
      { t: "Only once just before going on bypass", ok: false },
      { t: "Every 5 minutes throughout the whole case", ok: false },
      { t: "Baseline and then only after protamine", ok: false },
    ],
    rationale: "The ACT is checked at baseline, 3 to 5 minutes after the heparin bolus, and every 30 minutes on bypass to confirm adequate anticoagulation. Checking only once or only after protamine would miss intraoperative drift. Every 5 minutes is unnecessarily frequent. Pearl: baseline, post-bolus, then every 30 minutes.", // source: Anticoagulants deck slide 21
    scene: "pharmacology",
    sceneCfg: { label: "ACT CHECK TIMING" },
    metadata: { topic: "ACT bypass test", priority: "medium" },
  },

  {
    id: "ap1-w4-060",
    type: "mcq",
    prompt: "All of the following can prolong the ACT during bypass WITHOUT extra heparin EXCEPT:",
    setup: "",
    ans: [
      { t: "Hyperthermia from rewarming overshoot", ok: true },
      { t: "Hemodilution from the pump prime", ok: false },
      { t: "Thrombocytopenia lowering platelet count", ok: false },
      { t: "Fibrinogen deficiency in the patient", ok: false },
    ],
    rationale: "Hypothermia, not hyperthermia, prolongs the ACT, so hyperthermia is the exception that does not falsely elevate it. Hemodilution from pump prime, thrombocytopenia, and fibrinogen deficiency all prolong the ACT independent of heparin. Aprotinin with celite is another confounder, mitigated by using kaolin. Pearl: a long ACT is not always a lot of heparin.", // source: Anticoagulants deck slide 22
    scene: "pharmacology",
    sceneCfg: { label: "ACT CONFOUNDERS EXCEPT" },
    metadata: { topic: "ACT confounders", priority: "high" },
  },

  {
    id: "ap1-w4-061",
    type: "mcq",
    prompt: "Aprotinin artifactually prolongs the ACT with one activator. Which activator avoids this confounder?",
    setup: "",
    ans: [
      { t: "Kaolin instead of celite activator", ok: true },
      { t: "Celite instead of kaolin activator", ok: false },
      { t: "Tissue factor instead of celite", ok: false },
      { t: "Ecarin instead of kaolin activator", ok: false },
    ],
    rationale: "Aprotinin prolongs the celite-based ACT artifactually, so switching to a kaolin activator avoids the confounder. Celite is the problematic activator here, not the solution. Tissue factor and ecarin are reagents for other assays, not the ACT fix. Pearl: with aprotinin, use kaolin not celite for the ACT.", // source: Anticoagulants deck slide 22
    scene: "pharmacology",
    sceneCfg: { label: "APROTININ KAOLIN FIX" },
    metadata: { topic: "ACT confounders", priority: "medium" },
  },

  {
    id: "ap1-w4-062",
    type: "mcq",
    prompt: "Which feature best describes heparin-induced thrombocytopenia type I?",
    setup: "",
    ans: [
      { t: "Benign non-immune early drop", ok: true },
      { t: "Immune IgG mediated clotting", ok: false },
      { t: "Delayed onset day 4 to 14", ok: false },
      { t: "Life-threatening limb ischemia", ok: false },
    ],
    rationale: "Type I HIT is a benign, non-immune fall in platelets within hours of starting heparin, driven by direct heparin platelet aggregation, and it is not clinically significant. The immune IgG mechanism, the day 4 to 14 onset, and the thrombotic complications all belong to type II. Type I requires no intervention and heparin may often be continued. Pearl: type I is early, mild, and benign; type II is the one that kills.", // source: Anticoagulants deck slide 23
    scene: "pharmacology",
    sceneCfg: { label: "HIT TYPE I" },
    metadata: { topic: "HIT type I", priority: "medium" },
  },

  {
    id: "ap1-w4-063",
    type: "mcq",
    prompt: "Heparin-induced thrombocytopenia type II is best characterized as which of the following?",
    setup: "",
    ans: [
      { t: "Immune-mediated, the dangerous form", ok: true },
      { t: "Non-immune and clinically benign drop", ok: false },
      { t: "Bleeding-predominant platelet loss", ok: false },
      { t: "Onset within hours of starting heparin", ok: false },
    ],
    rationale: "Type II HIT is immune-mediated and is the dangerous form, producing thrombosis rather than bleeding despite the low platelet count. It is not benign and does not begin within hours; its onset is delayed to day 4 to 14 as antibodies develop. The non-immune, benign, early-onset description fits type I. Pearl: type II HIT is immune, delayed, and prothrombotic.", // source: Anticoagulants deck slide 23
    scene: "pharmacology",
    sceneCfg: { label: "HIT TYPE II" },
    metadata: { topic: "HIT type II", priority: "high" },
  },

  {
    id: "ap1-w4-064",
    type: "mcq",
    prompt: "Approximately what is the incidence of type II HIT with unfractionated heparin versus low-molecular-weight heparin?",
    setup: "",
    ans: [
      { t: "0.5 to 3% UFH, 0.2% LMWH", ok: true },
      { t: "0.2% UFH, 0.5 to 3% LMWH", ok: false },
      { t: "10 to 15% UFH, 5% LMWH", ok: false },
      { t: "Equal risk with UFH and LMWH", ok: false },
    ],
    rationale: "Type II HIT occurs in roughly 0.5 to 3% of patients on unfractionated heparin and only about 0.2% on low-molecular-weight heparin, so UFH carries the higher risk. The reversed and inflated figures are incorrect, and the two heparins are not equal in risk. The smaller LMWH molecule generates fewer immunogenic heparin-PF4 complexes. Pearl: UFH carries several-fold higher HIT risk than LMWH.", // source: Anticoagulants deck slide 23
    scene: "pharmacology",
    sceneCfg: { label: "HIT INCIDENCE" },
    metadata: { topic: "HIT incidence", priority: "medium" },
  },

  {
    id: "ap1-w4-065",
    type: "mcq",
    prompt: "What is the central antigenic complex that triggers the immune response in type II HIT?",
    setup: "",
    ans: [
      { t: "Heparin bound to platelet factor 4", ok: true },
      { t: "Heparin bound to circulating antithrombin", ok: false },
      { t: "Thrombin bound to fibrinogen", ok: false },
      { t: "IgG bound to von Willebrand factor", ok: false },
    ],
    rationale: "In type II HIT, heparin binds platelet factor 4 on the platelet surface, and this heparin-PF4 complex is recognized as foreign by IgG antibodies. Heparin binding antithrombin is the normal anticoagulant action, not the antigen. Thrombin-fibrinogen and IgG-vWF complexes are unrelated to HIT. Pearl: the HIT antigen is the heparin-PF4 complex.", // source: Anticoagulants deck slide 24
    scene: "pharmacology",
    sceneCfg: { label: "HEPARIN PF4" },
    metadata: { topic: "HIT mechanism", priority: "high" },
  },

  {
    id: "ap1-w4-066",
    type: "mcq",
    prompt: "After IgG antibodies bind the heparin-PF4 complex in type II HIT, what is the next pathological step?",
    setup: "",
    ans: [
      { t: "Crosslink Fc receptors and activate", ok: true },
      { t: "Lyse platelets through complement holes", ok: false },
      { t: "Block the platelet GP IIb/IIIa receptor", ok: false },
      { t: "Inhibit thrombin at its active site", ok: false },
    ],
    rationale: "The bound antibodies crosslink platelet Fc receptors, which activates the platelets; the activated platelets are then consumed in microthrombi, producing both thrombocytopenia and thrombosis. Complement-mediated lysis, GP IIb/IIIa blockade, and direct thrombin inhibition are not the HIT mechanism. The thrombosis arises from platelet activation, not simple destruction. Pearl: Fc receptor crosslinking activates platelets and drives the HIT clots.", // source: Anticoagulants deck slide 24
    scene: "pharmacology",
    sceneCfg: { label: "FC CROSSLINK" },
    metadata: { topic: "HIT mechanism", priority: "high" },
  },

  {
    id: "ap1-w4-067",
    type: "mcq",
    prompt: "What is the characteristic onset and platelet change defining type II HIT?",
    setup: "",
    ans: [
      { t: "Day 4 to 14, drop at least 50%", ok: true },
      { t: "Within hours, drop at least 50%", ok: false },
      { t: "Day 4 to 14, rise above 400,000", ok: false },
      { t: "After 30 days, mild 10% drop", ok: false },
    ],
    rationale: "Type II HIT typically begins on day 4 to 14 of heparin exposure, with platelets falling at least 50% from baseline or below 100,000. An onset within hours describes type I, not type II. Platelets fall rather than rise, and the change is substantial, not a mild late drop. Pearl: think HIT when platelets fall by half around days 4 to 14.", // source: Anticoagulants deck slide 24
    scene: "pharmacology",
    sceneCfg: { label: "HIT TIMING" },
    metadata: { topic: "HIT timing", priority: "high" },
  },

  {
    id: "ap1-w4-068",
    type: "mcq",
    prompt: "The paradox of type II HIT is best summarized by which statement?",
    setup: "",
    ans: [
      { t: "Falling platelets, rising thrombosis", ok: true },
      { t: "Falling platelets, rising bleeding risk", ok: false },
      { t: "Rising platelets, falling thrombosis", ok: false },
      { t: "Stable platelets, falling thrombosis risk", ok: false },
    ],
    rationale: "The HIT paradox is that platelets fall yet thrombosis rises, manifesting as deep vein thrombosis, pulmonary embolism, arterial thrombosis, and limb ischemia. Despite the low count, bleeding is not the dominant problem. The other options invert or flatten the relationship between platelets and clotting. Pearl: in HIT the patient clots even as the platelet count drops.", // source: Anticoagulants deck slide 25
    scene: "pharmacology",
    sceneCfg: { label: "HIT PARADOX" },
    metadata: { topic: "HIT paradox", priority: "high" },
  },

  {
    id: "ap1-w4-069",
    type: "mcq",
    prompt: "The 4Ts bedside score for HIT includes all of the following components EXCEPT:",
    setup: "",
    ans: [
      { t: "Titer of anti-PF4 antibody", ok: true },
      { t: "Thrombocytopenia severity", ok: false },
      { t: "Timing of the platelet fall", ok: false },
      { t: "Thrombosis and oTher causes", ok: false },
    ],
    rationale: "The 4Ts are Thrombocytopenia, Timing, Thrombosis, and oTher causes, each scored 0 to 2; the antibody titer is a confirmatory lab test, not a 4Ts component. A total of 4 or more prompts you to send antibodies and switch off heparin. The other three options name genuine 4Ts elements. Pearl: the 4Ts are clinical; the anti-PF4 assay is the separate confirmatory step.", // source: Anticoagulants deck slide 25
    scene: "pharmacology",
    sceneCfg: { label: "4TS SCORE" },
    metadata: { topic: "4Ts score", priority: "high" },
  },

  {
    id: "ap1-w4-070",
    type: "mcq",
    prompt: "At what 4Ts score should you send HIT antibodies and switch anticoagulants?",
    setup: "",
    ans: [
      { t: "A total score of 4 or more", ok: true },
      { t: "A total score of 2 or more points", ok: false },
      { t: "A total score of exactly 6 only", ok: false },
      { t: "Any single component scoring 2", ok: false },
    ],
    rationale: "A 4Ts total of 4 or more is the threshold to send anti-PF4 antibodies and switch to a non-heparin anticoagulant. A cutoff of 2, a single point of 6, or one isolated component does not match the rule taught. Each of the four items is scored 0 to 2 for a maximum of 8. Pearl: 4Ts of 4 or more means test and switch.", // source: Anticoagulants deck slide 25
    scene: "pharmacology",
    sceneCfg: { label: "4TS CUTOFF" },
    metadata: { topic: "4Ts score", priority: "medium" },
  },

  {
    id: "ap1-w4-071",
    type: "mcq",
    prompt: "A patient is diagnosed with type II HIT. After stopping all heparin, what is the essential next step?",
    setup: "",
    ans: [
      { t: "Start a non-heparin anticoagulant", ok: true },
      { t: "Observe off all anticoagulation", ok: false },
      { t: "Transfuse platelets prophylactically", ok: false },
      { t: "Switch to low-molecular-weight heparin", ok: false },
    ],
    rationale: "Stopping heparin alone is not enough because these patients continue to clot, so a non-heparin anticoagulant must be started. Mere observation leaves the prothrombotic state untreated. Prophylactic platelet transfusion can worsen thrombosis and is avoided, and LMWH cross-reacts and is contraindicated. Pearl: in HIT, do not just stop heparin, replace it with a non-heparin agent.", // source: Anticoagulants deck slide 26
    scene: "pharmacology",
    sceneCfg: { label: "HIT MANAGEMENT" },
    metadata: { topic: "HIT management", priority: "high" },
  },

  {
    id: "ap1-w4-072",
    type: "mcq",
    prompt: "Which drug class is the standard non-heparin choice for anticoagulating a patient with HIT?",
    setup: "",
    ans: [
      { t: "Parenteral direct thrombin inhibitor", ok: true },
      { t: "A low-molecular-weight heparin product", ok: false },
      { t: "The vitamin K antagonist warfarin", ok: false },
      { t: "A glycoprotein IIb/IIIa antagonist", ok: false },
    ],
    rationale: "Parenteral direct thrombin inhibitors such as bivalirudin and argatroban are the standard choice in HIT because they act independently of antithrombin and do not cross-react with HIT antibodies. LMWH cross-reacts and is unsafe. Warfarin acutely can precipitate venous limb gangrene and is not the initial agent, and GP IIb/IIIa antagonists do not treat the thrombin-driven clotting. Pearl: treat HIT with a parenteral direct thrombin inhibitor.", // source: Anticoagulants deck slide 26
    scene: "pharmacology",
    sceneCfg: { label: "DTI FOR HIT" },
    metadata: { topic: "HIT management", priority: "high" },
  },

  {
    id: "ap1-w4-073",
    type: "mcq",
    prompt: "Which property of protamine underlies its ability to neutralize heparin?",
    setup: "",
    ans: [
      { t: "Strongly basic, binds acidic heparin", ok: true },
      { t: "Strongly acidic, binds basic heparin", ok: false },
      { t: "Enzymatically degrades the heparin chain", ok: false },
      { t: "Restores antithrombin conformation", ok: false },
    ],
    rationale: "Protamine is a strongly basic polypeptide, roughly 70% arginine, and it binds strongly acidic heparin through acid-base ionic binding to form an inactive complex. Heparin, not protamine, is the acidic partner. Protamine neither digests the heparin chain enzymatically nor works through antithrombin. Pearl: basic protamine ion-pairs with acidic heparin to inactivate it.", // source: Anticoagulants deck slide 27
    scene: "pharmacology",
    sceneCfg: { label: "PROTAMINE BASIC" },
    metadata: { topic: "Protamine mechanism", priority: "high" },
  },

  {
    id: "ap1-w4-074",
    type: "mcq",
    prompt: "Protamine is a polypeptide derived from which source?",
    setup: "",
    ans: [
      { t: "Salmon sperm protein", ok: true },
      { t: "Bovine lung tissue extract", ok: false },
      { t: "Porcine intestinal mucosa", ok: false },
      { t: "Pooled human donor plasma", ok: false },
    ],
    rationale: "Protamine is a polypeptide derived from salmon sperm, which is the basis of its fish-related allergy concerns. Bovine lung and porcine intestine are classic sources of heparin itself, not protamine. Human plasma pools yield products such as prothrombin complex concentrate, not protamine. Pearl: protamine comes from salmon sperm, hence the fish-allergy caution.", // source: Anticoagulants deck slide 27
    scene: "pharmacology",
    sceneCfg: { label: "SALMON SPERM" },
    metadata: { topic: "Protamine source", priority: "medium" },
  },

  {
    id: "ap1-w4-075",
    type: "mcq",
    prompt: "Roughly how, and how fast, is the heparin-protamine complex cleared?",
    setup: "",
    ans: [
      { t: "Macrophages clear it in about 20 min", ok: true },
      { t: "Renal filtration over roughly 12 hours", ok: false },
      { t: "Plasma esterases over about 4 hours", ok: false },
      { t: "Biliary excretion over roughly 6 hours", ok: false },
    ],
    rationale: "The inactive heparin-protamine complex is cleared by tissue macrophages of the reticuloendothelial system, mostly liver and spleen, in about 20 minutes. It is not cleared primarily by renal filtration, plasma esterases, or the biliary route. This rapid macrophage clearance is faster than heparin elimination and sets up heparin rebound. Pearl: macrophages remove the complex in roughly 20 minutes.", // source: Anticoagulants deck slide 27
    scene: "pharmacology",
    sceneCfg: { label: "RES CLEARANCE" },
    metadata: { topic: "Protamine clearance", priority: "medium" },
  },

  {
    id: "ap1-w4-076",
    type: "mcq",
    prompt: "What is the correct empiric protamine dose to reverse heparin?",
    setup: "",
    ans: [
      { t: "1 mg per 100 units circulating heparin", ok: true },
      { t: "1 mg per 100 units of total heparin", ok: false },
      { t: "10 mg per 100 units circulating heparin", ok: false },
      { t: "1 mg per 1000 units circulating heparin", ok: false },
    ],
    rationale: "Protamine is dosed at about 1 mg per 100 units of circulating heparin, estimated after accounting for the roughly 1 hour heparin half-life. Dosing on total heparin given systematically overshoots, and excess protamine is itself coagulopathic. The tenfold and one-tenth ratios are simply wrong. Pearl: dose protamine on remaining circulating heparin, not the total given.", // source: Anticoagulants deck slide 28
    scene: "pharmacology",
    sceneCfg: { label: "PROTAMINE DOSE" },
    metadata: { topic: "Protamine dosing", priority: "high" },
  },

  {
    id: "ap1-w4-077",
    type: "mcq",
    prompt: "Why do many cardiac centers titrate protamine from heparin concentration assays rather than empiric formulas?",
    setup: "",
    ans: [
      { t: "Empiric total dosing tends to overshoot", ok: true },
      { t: "Concentration assays are cheaper to perform", ok: false },
      { t: "Protamine has no coagulopathic ceiling", ok: false },
      { t: "Heparin half-life is fixed at 6 hours", ok: false },
    ],
    rationale: "Dosing on total heparin given systematically overshoots, and because excess protamine is itself coagulopathic, centers titrate from heparin concentration measurements using devices such as the Hemochron HMS or HemoTec. Cost is not the rationale, protamine clearly does have a coagulopathic ceiling, and heparin half-life is about 1 hour, not 6. Concentration-guided dosing avoids giving more protamine than needed. Pearl: measured heparin concentration prevents the overshoot of empiric total dosing.", // source: Anticoagulants deck slide 28
    scene: "pharmacology",
    sceneCfg: { label: "PROTAMINE TITRATION" },
    metadata: { topic: "Protamine dosing", priority: "medium" },
  },

  {
    id: "ap1-w4-078",
    type: "mcq",
    prompt: "What happens when too much protamine is administered?",
    setup: "",
    ans: [
      { t: "It is coagulopathic and the ACT rises", ok: true },
      { t: "It deepens reversal and the ACT falls", ok: false },
      { t: "It has no effect once heparin is gone", ok: false },
      { t: "It activates platelets and shortens ACT", ok: false },
    ],
    rationale: "Excess protamine is itself coagulopathic; it inhibits platelets and other serine proteases involved in coagulation, so the activated clotting time actually rises rather than falls. More protamine does not mean more reversal, and it is not inert once heparin is neutralized. It inhibits, rather than activates, platelets. Pearl: too much protamine prolongs the ACT and causes a second coagulopathy.", // source: Anticoagulants deck slide 29
    scene: "pharmacology",
    sceneCfg: { label: "OVERDOSE PARADOX" },
    metadata: { topic: "Protamine overdose", priority: "high" },
  },

  {
    id: "ap1-w4-079",
    type: "mcq",
    prompt: "Heparin rebound after protamine reversal typically appears in what time frame?",
    setup: "",
    ans: [
      { t: "About 2 to 3 hours after the dose", ok: true },
      { t: "About 20 minutes after the protamine", ok: false },
      { t: "About 12 hours after the dose", ok: false },
      { t: "About 24 hours after the dose", ok: false },
    ],
    rationale: "Heparin rebound occurs about 2 to 3 hours after the initial protamine dose, when protamine, cleared by macrophages in roughly 20 minutes, is gone while tissue-sequestered heparin re-enters the circulation. The 20-minute figure is protamine clearance, not the rebound interval, and 12 or 24 hours is too late. Recognizing rebound prevents unexplained late bleeding. Pearl: watch for heparin rebound 2 to 3 hours after protamine.", // source: Anticoagulants deck slide 30
    scene: "pharmacology",
    sceneCfg: { label: "HEPARIN REBOUND" },
    metadata: { topic: "Heparin rebound", priority: "high" },
  },

  {
    id: "ap1-w4-080",
    type: "mcq",
    prompt: "How should heparin rebound be treated after an original 50 mg protamine dose?",
    setup: "",
    ans: [
      { t: "Give 5 to 15 mg of protamine", ok: true },
      { t: "Repeat the full 50 mg of protamine", ok: false },
      { t: "Give 100 mg of protamine", ok: false },
      { t: "Give fresh frozen plasma instead", ok: false },
    ],
    rationale: "Rebound is treated with a small 5 to 15 mg dose of protamine, not the original 50 mg, because only the re-emerged tissue heparin needs neutralizing and excess protamine is coagulopathic. Repeating the full dose or escalating to 100 mg risks a protamine-induced coagulopathy. Fresh frozen plasma does not neutralize heparin. Pearl: treat rebound with a small protamine dose, not the original full dose.", // source: Anticoagulants deck slide 30
    scene: "pharmacology",
    sceneCfg: { label: "REBOUND DOSE" },
    metadata: { topic: "Heparin rebound", priority: "medium" },
  },

  {
    id: "ap1-w4-081",
    type: "mcq",
    prompt: "Which patient group carries the highest anaphylaxis risk with protamine, roughly 1 in 50?",
    setup: "",
    ans: [
      { t: "Diabetics on NPH insulin", ok: true },
      { t: "Patients with penicillin allergy", ok: false },
      { t: "Patients on chronic warfarin", ok: false },
      { t: "Patients with latex sensitivity", ok: false },
    ],
    rationale: "Diabetics on NPH insulin, which contains protamine, carry roughly a 1 in 50 anaphylaxis risk, versus about 1 in 500 in others; fish allergy, prior protamine exposure, and post-vasectomy status also raise risk. Penicillin allergy, chronic warfarin, and latex sensitivity are not the protamine-specific risk groups taught here. The NPH link comes from prior protamine sensitization. Pearl: NPH-treated diabetics have the highest protamine anaphylaxis risk.", // source: Anticoagulants deck slide 31
    scene: "pharmacology",
    sceneCfg: { label: "NPH ANAPHYLAXIS" },
    metadata: { topic: "Protamine adverse", priority: "high" },
  },

  {
    id: "ap1-w4-082",
    type: "mcq",
    prompt: "The catastrophic protamine reaction of acute pulmonary vasoconstriction with right ventricular failure is driven by what mediator?",
    setup: "",
    ans: [
      { t: "Thromboxane from pulmonary macrophages", ok: true },
      { t: "Histamine from circulating basophils", ok: false },
      { t: "Bradykinin from contact activation", ok: false },
      { t: "Nitric oxide from the vascular endothelium", ok: false },
    ],
    rationale: "The catastrophic protamine reaction is pulmonary vasoconstriction with right ventricular failure, caused by thromboxane release from pulmonary macrophages. Histamine and bradykinin are not the named driver, and nitric oxide is a vasodilator that would lower, not raise, pulmonary pressure. The acute rise in pulmonary vascular resistance can collapse the right ventricle. Pearl: protamine pulmonary hypertension is a thromboxane-mediated catastrophe.", // source: Anticoagulants deck slide 31
    scene: "pharmacology",
    sceneCfg: { label: "PULMONARY VASOSPASM" },
    metadata: { topic: "Protamine adverse", priority: "high" },
  },

  {
    id: "ap1-w4-083",
    type: "mcq",
    prompt: "How should protamine be given to avoid hypotension?",
    setup: "",
    ans: [
      { t: "Slowly over 5 to 10 minutes", ok: true },
      { t: "Rapid IV push over 30 seconds", ok: false },
      { t: "As a single intramuscular dose", ok: false },
      { t: "Diluted subcutaneously over 1 hour", ok: false },
    ],
    rationale: "Hypotension from protamine is a rate-related effect of rapid administration, so it should be given slowly over 5 to 10 minutes. A rapid push provokes the hypotension you are trying to avoid. Intramuscular and subcutaneous routes are not used for heparin reversal. Slow administration blunts the hemodynamic response. Pearl: push protamine slowly over 5 to 10 minutes to prevent hypotension.", // source: Anticoagulants deck slide 31
    scene: "pharmacology",
    sceneCfg: { label: "SLOW PUSH" },
    metadata: { topic: "Protamine adverse", priority: "medium" },
  },

  {
    id: "ap1-w4-084",
    type: "mcq",
    prompt: "Protamine fully reverses which of the following anticoagulants?",
    setup: "",
    ans: [
      { t: "Unfractionated heparin fully", ok: true },
      { t: "Low-molecular-weight heparin", ok: false },
      { t: "The pentasaccharide fondaparinux", ok: false },
      { t: "The oral agent warfarin", ok: false },
    ],
    rationale: "Protamine fully reverses unfractionated heparin only. It gives only partial anti-thrombin reversal of LMWH while the dominant anti-factor Xa effect persists, and it does nothing for fondaparinux, the direct oral anticoagulants, or warfarin. Reaching for protamine outside UFH wastes time and may cause harm. Pearl: protamine is a complete reversal agent for UFH and essentially nothing else.", // source: Anticoagulants deck slide 32
    scene: "pharmacology",
    sceneCfg: { label: "PROTAMINE LIMITS" },
    metadata: { topic: "Protamine limits", priority: "high" },
  },

  {
    id: "ap1-w4-085",
    type: "mcq",
    prompt: "Which two agents are the prototypical low-molecular-weight heparins?",
    setup: "",
    ans: [
      { t: "Enoxaparin and dalteparin", ok: true },
      { t: "Fondaparinux and bivalirudin", ok: false },
      { t: "Dabigatran and argatroban", ok: false },
      { t: "Rivaroxaban and apixaban", ok: false },
    ],
    rationale: "Enoxaparin, brand name Lovenox, and dalteparin, brand name Fragmin, are the prototypical low-molecular-weight heparins. Fondaparinux is a synthetic pentasaccharide and bivalirudin and argatroban are direct thrombin inhibitors. Dabigatran, rivaroxaban, and apixaban are direct oral anticoagulants, not heparins. Pearl: enoxaparin and dalteparin are the classic LMWHs.", // source: Anticoagulants deck slide 33
    scene: "pharmacology",
    sceneCfg: { label: "LMWH AGENTS" },
    metadata: { topic: "LMWH agents", priority: "medium" },
  },

  {
    id: "ap1-w4-086",
    type: "mcq",
    prompt: "The molecular weight of low-molecular-weight heparin is approximately which range?",
    setup: "",
    ans: [
      { t: "About 4,000 to 5,000 daltons", ok: true },
      { t: "About 12,000 to 15,000 daltons", ok: false },
      { t: "About 340,000 daltons", ok: false },
      { t: "About 500 to 1,000 daltons", ok: false },
    ],
    rationale: "LMWH has a molecular weight of about 4,000 to 5,000 daltons, roughly two-thirds smaller than unfractionated heparin. The 12,000 to 15,000 dalton range is closer to unfractionated heparin, 340,000 daltons is fibrinogen, and 500 to 1,000 daltons is far too small. The smaller size explains why LMWH chains cannot bridge antithrombin and thrombin. Pearl: LMWH is about 4,000 to 5,000 daltons, much smaller than UFH.", // source: Anticoagulants deck slide 33
    scene: "pharmacology",
    sceneCfg: { label: "LMWH WEIGHT" },
    metadata: { topic: "LMWH weight", priority: "medium" },
  },

  {
    id: "ap1-w4-087",
    type: "mcq",
    prompt: "Why does low-molecular-weight heparin favor anti-factor Xa over anti-thrombin activity?",
    setup: "",
    ans: [
      { t: "Chains too short to bridge to thrombin", ok: true },
      { t: "It binds thrombin but never factor Xa", ok: false },
      { t: "It acts entirely independent of antithrombin", ok: false },
      { t: "It irreversibly acetylates the thrombin", ok: false },
    ],
    rationale: "Inactivating thrombin requires heparin long enough, at least 18 saccharides, to bridge antithrombin and thrombin simultaneously; LMWH chains are too short to form that bridge, so anti-thrombin activity falls while anti-Xa persists, giving a ratio of 2:1 to 4:1 versus UFH at 1:1. LMWH still works through antithrombin, so it is not antithrombin-independent, and it does not acetylate thrombin. It does inhibit Xa. Pearl: short LMWH chains cannot bridge to thrombin, so anti-Xa dominates.", // source: Anticoagulants deck slide 33
    scene: "pharmacology",
    sceneCfg: { label: "LMWH RATIO" },
    metadata: { topic: "LMWH mechanism", priority: "high" },
  },

  {
    id: "ap1-w4-088",
    type: "mcq",
    prompt: "Which set of properties explains why low-molecular-weight heparin needs no routine monitoring?",
    setup: "",
    ans: [
      { t: "Predictable PK, less protein binding", ok: true },
      { t: "Nonlinear PK, heavy protein binding", ok: false },
      { t: "Hepatic clearance, fourfold variability", ok: false },
      { t: "Immediate IV onset, units-based dosing", ok: false },
    ],
    rationale: "LMWH has more predictable pharmacokinetics and less protein binding than unfractionated heparin, which is why it needs no routine monitoring. Nonlinear pharmacokinetics with heavy protein binding and fourfold sensitivity variability describe unfractionated heparin, which does require monitoring. Units-based IV dosing is also a UFH feature. Predictable dosing is the practical advantage of LMWH. Pearl: predictable LMWH pharmacokinetics remove the need for routine lab monitoring.", // source: Anticoagulants deck slide 33
    scene: "pharmacology",
    sceneCfg: { label: "NO MONITORING" },
    metadata: { topic: "LMWH advantages", priority: "medium" },
  },

  {
    id: "ap1-w4-089",
    type: "mcq",
    prompt: "In a patient with significant renal failure, which agent is preferred over low-molecular-weight heparin?",
    setup: "",
    ans: [
      { t: "Unfractionated heparin", ok: true },
      { t: "Higher-dose enoxaparin", ok: false },
      { t: "Fondaparinux instead", ok: false },
      { t: "Dalteparin every 12 hours", ok: false },
    ],
    rationale: "LMWH is renally cleared and accumulates in renal failure, so unfractionated heparin, which is not renally dependent, is preferred in these patients. Increasing the enoxaparin dose worsens accumulation, fondaparinux is also renally cleared and contraindicated in renal failure, and dalteparin remains an LMWH with the same problem. UFH offers titratable, reversible anticoagulation regardless of renal function. Pearl: in renal failure, switch from LMWH to unfractionated heparin.", // source: Anticoagulants deck slide 34
    scene: "pharmacology",
    sceneCfg: { label: "LMWH RENAL" },
    metadata: { topic: "LMWH renal", priority: "high" },
  },

  {
    id: "ap1-w4-090",
    type: "mcq",
    prompt: "Per ASRA, how long after a THERAPEUTIC dose of LMWH should neuraxial block be delayed?",
    setup: "",
    ans: [
      { t: "24 hours after a therapeutic dose", ok: true },
      { t: "12 hours after a therapeutic dose", ok: false },
      { t: "4 to 6 hours after a therapeutic dose", ok: false },
      { t: "72 hours after a therapeutic dose", ok: false },
    ],
    rationale: "ASRA recommends waiting 24 hours after a therapeutic LMWH dose before neuraxial block, versus 12 hours after a prophylactic dose. The 12-hour figure is the prophylactic interval, 4 to 6 hours applies to IV therapeutic unfractionated heparin, and 72 hours applies to oral factor Xa inhibitors. The longer therapeutic interval reflects the larger anticoagulant burden. Pearl: LMWH neuraxial timing is 12 hours prophylactic and 24 hours therapeutic.", // source: Anticoagulants deck slide 34
    scene: "pharmacology",
    sceneCfg: { label: "LMWH ASRA" },
    metadata: { topic: "LMWH neuraxial", priority: "high" },
  },

  {
    id: "ap1-w4-091",
    type: "mcq",
    prompt: "What enzyme does warfarin inhibit to produce its anticoagulant effect?",
    setup: "",
    ans: [
      { t: "Vitamin K epoxide reductase", ok: true },
      { t: "Gamma-glutamyl transpeptidase", ok: false },
      { t: "Cytochrome P450 2C19", ok: false },
      { t: "Tissue factor pathway inhibitor", ok: false },
    ],
    rationale: "Warfarin blocks vitamin K epoxide reductase, the enzyme that recycles vitamin K back to its active reduced form. Without recycled vitamin K the liver cannot gamma-carboxylate the vitamin K dependent factors. CYP2C19 activates clopidogrel, not warfarin, and TFPI is a natural anticoagulant rather than a warfarin target. Pearl: warfarin works upstream by starving the carboxylation reaction of recycled vitamin K.", // source: Anticoagulants deck slide 35
    scene: "pharmacology",
    sceneCfg: { label: "WARFARIN ENZYME TARGET" },
    metadata: { topic: "Warfarin mechanism", priority: "high" },
  },

  {
    id: "ap1-w4-092",
    type: "mcq",
    prompt: "Which set of clotting factors loses function during warfarin therapy?",
    setup: "",
    ans: [
      { t: "Factors II, VII, IX, and X", ok: true },
      { t: "Factors V, VIII, XI, and XII", ok: false },
      { t: "Factors I, V, VIII, and XIII", ok: false },
      { t: "Factors VII, VIII, IX, and XI", ok: false },
    ],
    rationale: "Warfarin impairs gamma-carboxylation of the vitamin K dependent procoagulants, which are factors II, VII, IX, and X. Factors V and VIII are not vitamin K dependent and are not directly affected. Factor XII and XI belong to the contact pathway and are likewise spared. Pearl: the vitamin K dependent procoagulants are 2, 7, 9, 10.", // source: Anticoagulants deck slide 35
    scene: "pharmacology",
    sceneCfg: { label: "VITAMIN K FACTORS" },
    metadata: { topic: "Warfarin mechanism", priority: "high" },
  },

  {
    id: "ap1-w4-093",
    type: "mcq",
    prompt: "On warfarin, why are clotting factors made by the liver initially nonfunctional?",
    setup: "",
    ans: [
      { t: "They cannot bind calcium", ok: true },
      { t: "They are never synthesized", ok: false },
      { t: "They are cleaved by plasmin", ok: false },
      { t: "They lack a signal peptide", ok: false },
    ],
    rationale: "Without gamma-carboxylation the factors are still synthesized and secreted but lack the calcium-binding tail needed to assemble on phospholipid surfaces, so they cannot bind calcium or participate in the cascade. They are not unsynthesized and they are not destroyed by plasmin. Pearl: warfarin makes decarboxylated factors that are present but cannot bind calcium.", // source: Anticoagulants deck slide 35
    scene: "pharmacology",
    sceneCfg: { label: "NONFUNCTIONAL FACTORS" },
    metadata: { topic: "Warfarin mechanism", priority: "medium" },
  },

  {
    id: "ap1-w4-094",
    type: "mcq",
    prompt: "Which vitamin K dependent clotting factor has the shortest half-life and falls first on warfarin?",
    setup: "",
    ans: [
      { t: "Factor VII", ok: true },
      { t: "Factor IX (Christmas)", ok: false },
      { t: "Factor II", ok: false },
      { t: "Factor X", ok: false },
    ],
    rationale: "Factor VII has roughly a 6 hour half-life, the shortest of the group, so it falls first and drives the early rise in the INR. Factor IX is about 24 hours, factor X about 36 hours, and factor II about 60 hours. Pearl: factor VII falls first and lifts the INR before true anticoagulation exists.", // source: Anticoagulants deck slide 36
    scene: "pharmacology",
    sceneCfg: { label: "FACTOR VII FIRST" },
    metadata: { topic: "Warfarin onset", priority: "high" },
  },

  {
    id: "ap1-w4-095",
    type: "mcq",
    prompt: "Approximately how long is the half-life of factor IX?",
    setup: "",
    ans: [
      { t: "24 hours", ok: true },
      { t: "6 hours", ok: false },
      { t: "60 hours", ok: false },
      { t: "36 hours", ok: false },
    ],
    rationale: "Factor IX has a half-life of approximately 24 hours, intermediate between factor VII at 6 hours and factor X at 36 hours. Factor II is the longest at about 60 hours. Knowing the ladder explains the delay between a rising INR and real anticoagulation. Pearl: factor IX sits in the middle at about 24 hours.", // source: Anticoagulants deck slide 36
    scene: "pharmacology",
    sceneCfg: { label: "FACTOR IX HALF-LIFE" },
    metadata: { topic: "Warfarin onset", priority: "medium" },
  },

  {
    id: "ap1-w4-096",
    type: "mcq",
    prompt: "Which factor must fall before a warfarin patient is truly anticoagulated, despite an INR that rises within 24 hours?",
    setup: "",
    ans: [
      { t: "Factor II at about 60 hours", ok: true },
      { t: "Factor VII at about 6 hours", ok: false },
      { t: "Factor IX at about 24 hours", ok: false },
      { t: "Factor X at about 36 hours", ok: false },
    ],
    rationale: "Factor II (prothrombin) has the longest half-life at roughly 60 hours, so meaningful antithrombotic effect is not present until prothrombin levels fall, even though the early drop in factor VII raises the INR within a day. Factors VII, IX, and X fall sooner but do not confer full anticoagulation. Pearl: the INR rises on factor VII but protection waits on factor II.", // source: Anticoagulants deck slide 36
    scene: "pharmacology",
    sceneCfg: { label: "FACTOR II GOVERNS ONSET" },
    metadata: { topic: "Warfarin onset", priority: "high" },
  },

  {
    id: "ap1-w4-097",
    type: "mcq",
    prompt: "Which natural anticoagulants are vitamin K dependent and therefore fall during early warfarin therapy?",
    setup: "",
    ans: [
      { t: "Proteins C and S", ok: true },
      { t: "Antithrombin and TFPI", ok: false },
      { t: "Plasmin and tPA", ok: false },
      { t: "Thrombomodulin and heparin", ok: false },
    ],
    rationale: "Proteins C and S are vitamin K dependent anticoagulants, so warfarin lowers them alongside the procoagulant factors. Antithrombin and tissue factor pathway inhibitor are not vitamin K dependent, and plasmin and tPA belong to fibrinolysis. The fall in protein C is what creates the transient prothrombotic state. Pearl: warfarin lowers the brakes (proteins C and S) too, not just the procoagulants.", // source: Anticoagulants deck slide 37
    scene: "pharmacology",
    sceneCfg: { label: "PROTEIN C AND S" },
    metadata: { topic: "Procoagulant phase", priority: "high" },
  },

  {
    id: "ap1-w4-098",
    type: "mcq",
    prompt: "Why does warfarin create a transient prothrombotic state in the first 24 to 48 hours?",
    setup: "",
    ans: [
      { t: "Protein C falls before factor II", ok: true },
      { t: "Factor II falls before protein C", ok: false },
      { t: "Antithrombin is consumed early", ok: false },
      { t: "Plasminogen drops before factor X", ok: false },
    ],
    rationale: "Protein C has a short half-life of about 8 hours, similar to factor VII, so it falls well before prothrombin (factor II) at 60 hours. With the anticoagulant gone but prothrombin still present, the net early effect is prothrombotic, which is the basis of warfarin-induced skin necrosis in protein C deficient patients. Pearl: short-lived protein C drops first, so warfarin is briefly procoagulant.", // source: Anticoagulants deck slide 37
    scene: "pharmacology",
    sceneCfg: { label: "PROCOAGULANT PHASE" },
    metadata: { topic: "Procoagulant phase", priority: "high" },
  },

  {
    id: "ap1-w4-099",
    type: "mcq",
    prompt: "Warfarin-induced skin necrosis is classically associated with a deficiency of which factor?",
    setup: "",
    ans: [
      { t: "Protein C", ok: true },
      { t: "Factor VIII", ok: false },
      { t: "Antithrombin", ok: false },
      { t: "Fibrinogen", ok: false },
    ],
    rationale: "Protein C deficiency exaggerates the early prothrombotic window because protein C falls fastest, producing microthrombosis in the skin known as warfarin-induced skin necrosis. Factor VIII and fibrinogen are not vitamin K dependent and are not the cause. Pearl: protein C deficiency plus the early procoagulant phase yields warfarin skin necrosis.", // source: Anticoagulants deck slide 37
    scene: "pharmacology",
    sceneCfg: { label: "WARFARIN SKIN NECROSIS" },
    metadata: { topic: "Procoagulant phase", priority: "medium" },
  },

  {
    id: "ap1-w4-100",
    type: "mcq",
    prompt: "Which laboratory test is used to monitor warfarin therapy?",
    setup: "",
    ans: [
      { t: "Prothrombin time and INR", ok: true },
      { t: "Activated partial thromboplastin time", ok: false },
      { t: "Drug-specific anti-Xa assay", ok: false },
      { t: "Ecarin clotting time", ok: false },
    ],
    rationale: "Warfarin is monitored by the prothrombin time reported as the INR, which uses the International Sensitivity Index to standardize results across laboratories. The aPTT tracks therapeutic heparin, the anti-Xa assay tracks LMWH and Xa inhibitors, and ecarin clotting time tracks direct thrombin inhibitors. Pearl: PT/INR is the warfarin test, normalized by the ISI.", // source: Anticoagulants deck slide 38
    scene: "pharmacology",
    sceneCfg: { label: "INR MONITORS WARFARIN" },
    metadata: { topic: "Warfarin monitoring", priority: "high" },
  },

  {
    id: "ap1-w4-101",
    type: "mcq",
    prompt: "What is the usual INR target for most warfarin indications such as atrial fibrillation?",
    setup: "",
    ans: [
      { t: "2.0 to 3.0", ok: true },
      { t: "1.0 to 1.5", ok: false },
      { t: "2.5 to 3.5", ok: false },
      { t: "3.5 to 4.5", ok: false },
    ],
    rationale: "Most warfarin indications, including atrial fibrillation and venous thromboembolism, target an INR of 2.0 to 3.0. A range of 2.5 to 3.5 is reserved for mechanical mitral valves, and ranges below 2 or above 3.5 are not standard targets. Pearl: 2 to 3 for most, higher only for mechanical mitral valves.", // source: Anticoagulants deck slide 38
    scene: "pharmacology",
    sceneCfg: { label: "STANDARD INR TARGET" },
    metadata: { topic: "Warfarin monitoring", priority: "high" },
  },

  {
    id: "ap1-w4-102",
    type: "mcq",
    prompt: "A mechanical mitral valve warrants which INR target?",
    setup: "",
    ans: [
      { t: "2.5 to 3.5", ok: true },
      { t: "2.0 to 3.0", ok: false },
      { t: "1.5 to 2.0", ok: false },
      { t: "3.5 to 4.5", ok: false },
    ],
    rationale: "Mechanical mitral valves are the highest thrombotic risk and require a more intense INR target of 2.5 to 3.5. The standard 2.0 to 3.0 range is insufficient for this prosthesis, and targets above 3.5 add bleeding risk without benefit. Pearl: mechanical mitral valve means 2.5 to 3.5.", // source: Anticoagulants deck slide 38
    scene: "pharmacology",
    sceneCfg: { label: "MITRAL VALVE INR" },
    metadata: { topic: "Warfarin monitoring", priority: "medium" },
  },

  {
    id: "ap1-w4-103",
    type: "mcq",
    prompt: "How many days before elective surgery should warfarin be stopped?",
    setup: "",
    ans: [
      { t: "5 days", ok: true },
      { t: "1 day", ok: false },
      { t: "10 days", ok: false },
      { t: "14 days", ok: false },
    ],
    rationale: "Warfarin is held about 5 days before elective surgery to let the INR drift toward normal as the longer-lived factors recover. Stopping only 1 day before leaves the INR elevated, while 10 to 14 days is unnecessarily long. Pearl: stop warfarin 5 days out, then recheck the INR.", // source: Anticoagulants deck slide 39
    scene: "pharmacology",
    sceneCfg: { label: "STOP FIVE DAYS" },
    metadata: { topic: "Perioperative warfarin", priority: "high" },
  },

  {
    id: "ap1-w4-104",
    type: "mcq",
    prompt: "If the INR is still elevated the day before surgery, what is the appropriate step?",
    setup: "",
    ans: [
      { t: "Give 1 to 2 mg oral vitamin K", ok: true },
      { t: "Give 10 mg IV vitamin K", ok: false },
      { t: "Transfuse two units of plasma", ok: false },
      { t: "Proceed regardless of the INR", ok: false },
    ],
    rationale: "A small dose of oral vitamin K, 1 to 2 mg, gently lowers a persistently elevated INR the day before surgery without causing resistance when warfarin resumes. High-dose or IV vitamin K overshoots, and plasma is reserved for active bleeding. Pearl: low-dose oral vitamin K nudges a stubborn preoperative INR down.", // source: Anticoagulants deck slide 39
    scene: "pharmacology",
    sceneCfg: { label: "PREOP VITAMIN K" },
    metadata: { topic: "Perioperative warfarin", priority: "medium" },
  },

  {
    id: "ap1-w4-105",
    type: "mcq",
    prompt: "At what INR is it generally safe to proceed with surgery?",
    setup: "",
    ans: [
      { t: "Below 1.5", ok: true },
      { t: "Below 2.5", ok: false },
      { t: "Below 3.0", ok: false },
      { t: "Below 2.0", ok: false },
    ],
    rationale: "An INR below 1.5 reflects near-normal coagulation factor activity and is the accepted threshold to operate. Values of 2.0 or higher carry meaningful bleeding risk for major surgery. The same threshold guides neuraxial procedures. Pearl: operate when the INR is under 1.5.", // source: Anticoagulants deck slide 39
    scene: "pharmacology",
    sceneCfg: { label: "OPERATE UNDER 1.5" },
    metadata: { topic: "Perioperative warfarin", priority: "high" },
  },

  {
    id: "ap1-w4-106",
    type: "mcq",
    prompt: "The BRIDGE trial randomized which population during warfarin interruption?",
    setup: "",
    ans: [
      { t: "Atrial fibrillation patients", ok: true },
      { t: "Mechanical valve patients", ok: false },
      { t: "Acute pulmonary embolism patients", ok: false },
      { t: "Recent ischemic stroke patients", ok: false },
    ],
    rationale: "BRIDGE (NEJM 2015) enrolled 1884 atrial fibrillation patients on warfarin and randomized them to dalteparin bridging or no bridging during the interruption. It deliberately excluded mechanical valves and very recent thromboembolism, so its conclusion not to bridge applies to typical AF patients. Pearl: BRIDGE studied AF, not valves or acute clots.", // source: Anticoagulants deck slide 40
    scene: "pharmacology",
    sceneCfg: { label: "BRIDGE POPULATION" },
    metadata: { topic: "BRIDGE trial", priority: "high" },
  },

  {
    id: "ap1-w4-107",
    type: "mcq",
    prompt: "In the BRIDGE trial, how did bridging affect major bleeding?",
    setup: "",
    ans: [
      { t: "It more than doubled the bleeding", ok: true },
      { t: "It abolished major bleeding entirely", ok: false },
      { t: "It had no measurable effect at all", ok: false },
      { t: "It modestly lowered the bleeding rate", ok: false },
    ],
    rationale: "Bridging raised major bleeding to 3.2% versus 1.3% without bridging, about 2.5 times the rate, while thromboembolism was statistically identical at 0.3% versus 0.4%. So bridging caused harm without a stroke benefit in typical AF. Pearl: in BRIDGE, bridging more than doubled bleeding and prevented no strokes.", // source: Anticoagulants deck slide 40
    scene: "pharmacology",
    sceneCfg: { label: "BRIDGE BLEEDING HARM" },
    metadata: { topic: "BRIDGE trial", priority: "high" },
  },

  {
    id: "ap1-w4-108",
    type: "mcq",
    prompt: "In the BRIDGE trial, the thromboembolism rates with and without bridging were best described as which of the following?",
    setup: "",
    ans: [
      { t: "Essentially the same", ok: true },
      { t: "Far lower with bridging", ok: false },
      { t: "Far higher with bridging", ok: false },
      { t: "Doubled by no bridging", ok: false },
    ],
    rationale: "Thromboembolism occurred in 0.3% of bridged and 0.4% of non-bridged patients, essentially the same and not statistically different. Bridging did not lower stroke risk, which is the key negative finding. Meanwhile bleeding was clearly worse with bridging. Pearl: bridging did not change clot risk in BRIDGE.", // source: Anticoagulants deck slide 40
    scene: "pharmacology",
    sceneCfg: { label: "NO CLOT BENEFIT" },
    metadata: { topic: "BRIDGE trial", priority: "medium" },
  },

  {
    id: "ap1-w4-109",
    type: "mcq",
    prompt: "Based on BRIDGE, how should a typical atrial fibrillation patient be managed during warfarin interruption?",
    setup: "",
    ans: [
      { t: "Do not bridge with heparin", ok: true },
      { t: "Always bridge with dalteparin", ok: false },
      { t: "Bridge only if INR is high", ok: false },
      { t: "Bridge with unfractionated heparin", ok: false },
    ],
    rationale: "For typical AF patients bridging causes bleeding without preventing strokes, so the evidence-based choice is not to bridge. Routine bridging, conditional bridging on INR, or switching the heparin type all reintroduce the bleeding harm shown in BRIDGE. Pearl: the default for ordinary AF is no bridge.", // source: Anticoagulants deck slide 41
    scene: "pharmacology",
    sceneCfg: { label: "DEFAULT NO BRIDGE" },
    metadata: { topic: "Who bridges", priority: "high" },
  },

  {
    id: "ap1-w4-110",
    type: "mcq",
    prompt: "Which patient is an EXCEPTION who should still be bridged during warfarin interruption?",
    setup: "",
    ans: [
      { t: "Mechanical mitral valve patient", ok: true },
      { t: "Stable chronic atrial fibrillation", ok: false },
      { t: "Remote stroke more than a year ago", ok: false },
      { t: "Low-risk single-risk-factor AF", ok: false },
    ],
    rationale: "Mechanical heart valves, especially mitral, remain a bridging indication along with venous thromboembolism within 3 months and the highest-risk CHA2DS2-VASc patients with prior stroke. Stable AF, remote stroke, and low-risk AF should not be bridged per BRIDGE. Pearl: bridge valves, recent clots, and prior-stroke high-risk patients only.", // source: Anticoagulants deck slide 41
    scene: "pharmacology",
    sceneCfg: { label: "BRIDGING EXCEPTIONS" },
    metadata: { topic: "Who bridges", priority: "high" },
  },

  {
    id: "ap1-w4-111",
    type: "mcq",
    prompt: "For a high INR with no active bleeding, what is the appropriate non-urgent reversal?",
    setup: "",
    ans: [
      { t: "Hold warfarin, oral vitamin K 5 to 10 mg", ok: true },
      { t: "4-factor PCC with slow IV vitamin K push", ok: false },
      { t: "Two large units of fresh frozen plasma", ok: false },
      { t: "Rapid intravenous vitamin K 10 mg bolus", ok: false },
    ],
    rationale: "With a high INR but no bleeding, simply holding warfarin and giving oral vitamin K 5 to 10 mg brings the INR down over about 24 hours. Prothrombin complex concentrate and plasma are for active bleeding or emergency surgery, and rapid high-dose IV vitamin K risks overcorrection and later resistance. Pearl: no bleeding means hold the drug and give oral vitamin K.", // source: Anticoagulants deck slide 42
    scene: "pharmacology",
    sceneCfg: { label: "NON-URGENT REVERSAL" },
    metadata: { topic: "Non-urgent reversal", priority: "high" },
  },

  {
    id: "ap1-w4-112",
    type: "mcq",
    prompt: "What is the risk of using high-dose or IV vitamin K to reverse a high INR without bleeding?",
    setup: "",
    ans: [
      { t: "Warfarin resistance when resumed", ok: true },
      { t: "Immediate anaphylaxis every time", ok: false },
      { t: "Permanent loss of factor VII", ok: false },
      { t: "Rebound supratherapeutic INR", ok: false },
    ],
    rationale: "Excess vitamin K overshoots the correction and saturates the recycling pathway, producing relative warfarin resistance when therapy resumes and making it hard to re-establish a therapeutic INR. It does not destroy factor VII or invariably cause anaphylaxis. Pearl: too much vitamin K makes warfarin hard to restart.", // source: Anticoagulants deck slide 42
    scene: "pharmacology",
    sceneCfg: { label: "VITAMIN K OVERSHOOT" },
    metadata: { topic: "Non-urgent reversal", priority: "medium" },
  },

  {
    id: "ap1-w4-113",
    type: "mcq",
    prompt: "Which components are contained in 4-factor prothrombin complex concentrate (Kcentra)?",
    setup: "",
    ans: [
      { t: "Factors II, VII, IX, X with proteins C and S", ok: true },
      { t: "Factors V, VIII, XI, XIII with fibrinogen", ok: false },
      { t: "Factor VIII complexed with von Willebrand factor", ok: false },
      { t: "Fibrinogen with factor XIII concentrate", ok: false },
    ],
    rationale: "4-factor PCC replaces the vitamin K dependent factors II, VII, IX, and X along with proteins C, S, and antithrombin, which makes it the targeted reversal for warfarin. It does not contain factor V, factor VIII, or fibrinogen as its active components. Pearl: 4-factor PCC mirrors exactly what warfarin depletes.", // source: Anticoagulants deck slide 43
    scene: "pharmacology",
    sceneCfg: { label: "PCC COMPONENTS" },
    metadata: { topic: "Urgent reversal", priority: "high" },
  },

  {
    id: "ap1-w4-114",
    type: "mcq",
    prompt: "How quickly and in how many patients does 4-factor PCC restore an INR below 1.3?",
    setup: "",
    ans: [
      { t: "About 30 minutes in 55 percent", ok: true },
      { t: "About 6 hours in 90 percent", ok: false },
      { t: "About 30 minutes in 10 percent", ok: false },
      { t: "About 2 hours in 80 percent", ok: false },
    ],
    rationale: "4-factor PCC drives the INR below 1.3 within roughly 30 minutes in about 55% of patients, compared with only 10% for fresh frozen plasma. The speed and reliability are why PCC is first-line for urgent warfarin reversal. Pearl: PCC corrects fast, FFP corrects rarely.", // source: Anticoagulants deck slide 43
    scene: "pharmacology",
    sceneCfg: { label: "PCC SPEED" },
    metadata: { topic: "Urgent reversal", priority: "high" },
  },

  {
    id: "ap1-w4-115",
    type: "mcq",
    prompt: "Which is an advantage of 4-factor PCC over fresh frozen plasma for urgent reversal?",
    setup: "",
    ans: [
      { t: "Low volume with no crossmatch needed", ok: true },
      { t: "Longer lasting effect than vitamin K", ok: false },
      { t: "Provides durable correction by itself", ok: false },
      { t: "Reliably lowers the INR below 1.0", ok: false },
    ],
    rationale: "PCC delivers the factors in about 100 mL versus 1 to 2 liters of plasma, requires no crossmatch, and avoids TRALI and TACO. Its effect is actually transient at 6 to 8 hours, so it does not provide durable correction by itself and IV vitamin K must be added. Pearl: PCC wins on volume and safety, but vitamin K supplies the durability.", // source: Anticoagulants deck slide 43
    scene: "pharmacology",
    sceneCfg: { label: "PCC ADVANTAGES" },
    metadata: { topic: "Urgent reversal", priority: "medium" },
  },

  {
    id: "ap1-w4-116",
    type: "mcq",
    prompt: "Why is IV vitamin K added to PCC during urgent warfarin reversal?",
    setup: "",
    ans: [
      { t: "PCC effect is transient at 6 to 8 hours", ok: true },
      { t: "PCC by itself cannot lower the INR at all", ok: false },
      { t: "Vitamin K also reverses heparin activity", ok: false },
      { t: "Vitamin K prevents thrombosis from PCC", ok: false },
    ],
    rationale: "PCC provides immediate but short-lived factor replacement lasting only 6 to 8 hours, so IV vitamin K 10 mg given slowly is added to restore endogenous carboxylation for durable correction. PCC alone does lower the INR, just not durably, and vitamin K does not reverse heparin. Pearl: PCC for speed, vitamin K for staying power.", // source: Anticoagulants deck slide 43
    scene: "pharmacology",
    sceneCfg: { label: "ADD VITAMIN K" },
    metadata: { topic: "Urgent reversal", priority: "medium" },
  },

  {
    id: "ap1-w4-117",
    type: "mcq",
    prompt: "Why can fresh frozen plasma not reliably correct the INR below 1.5?",
    setup: "",
    ans: [
      { t: "Its own INR is 1.4 to 1.6", ok: true },
      { t: "It lacks factor IX entirely", ok: false },
      { t: "It contains active warfarin", ok: false },
      { t: "It is rich in protein C only", ok: false },
    ],
    rationale: "Fresh frozen plasma has an intrinsic INR of about 1.4 to 1.6, so transfusing it cannot push a patient below that floor and it dilutes rather than concentrates the factors. It does contain factor IX and no warfarin. This floor is a major reason PCC is preferred. Pearl: you cannot beat FFP own INR of about 1.5.", // source: Anticoagulants deck slide 43
    scene: "pharmacology",
    sceneCfg: { label: "FFP INR FLOOR" },
    metadata: { topic: "Urgent reversal", priority: "medium" },
  },

  {
    id: "ap1-w4-118",
    type: "mcq",
    prompt: "The direct oral anticoagulants were designed to overcome which warfarin limitations?",
    setup: "",
    ans: [
      { t: "Monitoring, interactions, and slow onset", ok: true },
      { t: "Renal clearance and a very short half-life", ok: false },
      { t: "Parenteral route and prohibitive cost", ok: false },
      { t: "Complete lack of any available antidote", ok: false },
    ],
    rationale: "DOACs aim to do what warfarin does but without routine monitoring, the many food and drug interactions, and the slow onset tied to factor half-lives. They are oral and antithrombin-independent, binding the active site of their target directly. They still require renal dose adjustment, so renal clearance is a feature not a problem they solved. Pearl: DOACs trade warfarin monitoring and interactions for predictable oral dosing.", // source: Anticoagulants deck slide 44
    scene: "pharmacology",
    sceneCfg: { label: "WHY DOACS EXIST" },
    metadata: { topic: "Why DOACs exist", priority: "high" },
  },

  {
    id: "ap1-w4-119",
    type: "mcq",
    prompt: "Across the four DOACs, how are the two mechanisms distributed?",
    setup: "",
    ans: [
      { t: "One thrombin and three Xa inhibitors", ok: true },
      { t: "Three thrombin and one factor Xa inhibitor", ok: false },
      { t: "Two thrombin and two factor Xa inhibitors", ok: false },
      { t: "Four direct factor Xa inhibitors total", ok: false },
    ],
    rationale: "There is a single direct thrombin inhibitor, dabigatran, and three direct factor Xa inhibitors, rivaroxaban, apixaban, and edoxaban. All four bind the active site directly and work independently of antithrombin. Pearl: one anti-IIa, three anti-Xa.", // source: Anticoagulants deck slide 44
    scene: "pharmacology",
    sceneCfg: { label: "ONE IIA THREE XA" },
    metadata: { topic: "Why DOACs exist", priority: "high" },
  },

  {
    id: "ap1-w4-120",
    type: "mcq",
    prompt: "Which DOAC is the direct thrombin inhibitor and how is it dosed?",
    setup: "",
    ans: [
      { t: "Dabigatran, twice daily", ok: true },
      { t: "Rivaroxaban, once daily", ok: false },
      { t: "Apixaban, twice daily", ok: false },
      { t: "Edoxaban, once daily", ok: false },
    ],
    rationale: "Dabigatran (Pradaxa) is the lone direct thrombin inhibitor among the DOACs and is dosed twice daily. Rivaroxaban and edoxaban are once-daily factor Xa inhibitors, and apixaban is a twice-daily factor Xa inhibitor. Pearl: dabigatran is the anti-thrombin DOAC, dosed twice daily.", // source: Anticoagulants deck slide 45
    scene: "pharmacology",
    sceneCfg: { label: "DABIGATRAN DTI" },
    metadata: { topic: "The four DOACs", priority: "high" },
  },

  {
    id: "ap1-w4-121",
    type: "mcq",
    prompt: "Which grouping of DOAC dosing frequencies is correct?",
    setup: "",
    ans: [
      { t: "Apixaban BID, rivaroxaban and edoxaban daily", ok: true },
      { t: "Apixaban daily, rivaroxaban and edoxaban BID", ok: false },
      { t: "All three factor Xa inhibitors are daily", ok: false },
      { t: "All three factor Xa inhibitors are BID", ok: false },
    ],
    rationale: "Apixaban (Eliquis) is dosed twice daily, while rivaroxaban (Xarelto) and edoxaban (Savaysa) are once daily; all three are direct factor Xa inhibitors. The other groupings misassign the frequencies. Pearl: apixaban twice daily, rivaroxaban and edoxaban once daily.", // source: Anticoagulants deck slide 45
    scene: "pharmacology",
    sceneCfg: { label: "XA DOSING FREQUENCY" },
    metadata: { topic: "The four DOACs", priority: "medium" },
  },

  {
    id: "ap1-w4-122",
    type: "mcq",
    prompt: "Which statement about dose adjustment is true for the DOACs?",
    setup: "",
    ans: [
      { t: "All four need renal dose adjustment", ok: true },
      { t: "Only dabigatran needs adjustment", ok: false },
      { t: "None require any dose adjustment", ok: false },
      { t: "Only the Xa inhibitors are adjusted", ok: false },
    ],
    rationale: "All four DOACs require renal dose adjustment, with dabigatran the most renally dependent but the Xa inhibitors also needing modification in kidney disease. It is not limited to dabigatran or the Xa inhibitors alone. Pearl: every DOAC is renally dose-adjusted.", // source: Anticoagulants deck slide 45
    scene: "pharmacology",
    sceneCfg: { label: "RENAL ADJUSTMENT" },
    metadata: { topic: "The four DOACs", priority: "medium" },
  },

  {
    id: "ap1-w4-123",
    type: "mcq",
    prompt: "Which assays specifically measure dabigatran effect when monitoring is truly needed?",
    setup: "",
    ans: [
      { t: "Thrombin time and ecarin clotting time", ok: true },
      { t: "Prothrombin time and INR", ok: false },
      { t: "Drug-specific calibrated anti-Xa assay", ok: false },
      { t: "Activated clotting time on bypass", ok: false },
    ],
    rationale: "Dabigatran, a thrombin inhibitor, is quantified by thrombin time, dilute thrombin time, or ecarin clotting time, with the aPTT giving only a qualitative signal. The anti-Xa assay is for factor Xa inhibitors, and PT/INR is not useful for either DOAC class. Pearl: thrombin-based assays track the thrombin inhibitor.", // source: Anticoagulants deck slide 46
    scene: "pharmacology",
    sceneCfg: { label: "DABIGATRAN ASSAYS" },
    metadata: { topic: "DOAC monitoring", priority: "medium" },
  },

  {
    id: "ap1-w4-124",
    type: "mcq",
    prompt: "Which test is appropriate when quantifying a direct factor Xa inhibitor?",
    setup: "",
    ans: [
      { t: "Drug-specific calibrated anti-Xa assay", ok: true },
      { t: "Prothrombin time reported as the INR", ok: false },
      { t: "Thrombin time or the ecarin clotting time", ok: false },
      { t: "Activated partial thromboplastin time", ok: false },
    ],
    rationale: "A drug-specific calibrated anti-Xa assay is required to measure rivaroxaban, apixaban, or edoxaban; the PT/INR is explicitly not useful and is a classic trap. Thrombin time and ecarin clotting time are for dabigatran. Pearl: calibrated anti-Xa for the Xa inhibitors, and never trust the INR there.", // source: Anticoagulants deck slide 46
    scene: "pharmacology",
    sceneCfg: { label: "ANTI-XA ASSAY" },
    metadata: { topic: "DOAC monitoring", priority: "high" },
  },

  {
    id: "ap1-w4-125",
    type: "mcq",
    prompt: "Under the PAUSE protocol, how is a DOAC managed for a high-bleeding-risk procedure?",
    setup: "",
    ans: [
      { t: "Stop 2 days before, resume 2 to 3 days after", ok: true },
      { t: "Stop 1 day before and resume 1 day afterward", ok: false },
      { t: "Bridge with low-molecular-weight heparin", ok: false },
      { t: "Stop 5 days before, resume the next morning", ok: false },
    ],
    rationale: "PAUSE (JAMA Internal Medicine 2019, n=3007 AF) had patients stop the DOAC 2 days before high-bleeding-risk procedures and resume 2 to 3 days after, adjusting for renal function, with about 1% major bleeding and under 0.5% thromboembolism and no bridging. Low-risk procedures used a 1-day stop. The short half-lives make stop-and-resume safe without heparin. Pearl: high risk means 2 days off, no bridge.", // source: Anticoagulants deck slide 47
    scene: "pharmacology",
    sceneCfg: { label: "PAUSE HIGH RISK" },
    metadata: { topic: "PAUSE protocol", priority: "high" },
  },

  {
    id: "ap1-w4-126",
    type: "mcq",
    prompt: "Why does the PAUSE protocol require no heparin bridging for DOAC interruption?",
    setup: "",
    ans: [
      { t: "DOAC half-lives are short", ok: true },
      { t: "DOACs have no thrombotic risk", ok: false },
      { t: "Bridging is reversed by idarucizumab", ok: false },
      { t: "DOACs are cleared only hepatically", ok: false },
    ],
    rationale: "DOAC half-lives are short enough that simply stopping and resuming covers the perioperative window, so bridging is unnecessary; PAUSE confirmed low bleeding and thromboembolism rates without it. Patients still carry thrombotic risk and the drugs are largely renally cleared, so those options are wrong. Pearl: short half-lives make bridging pointless for DOACs.", // source: Anticoagulants deck slide 47
    scene: "pharmacology",
    sceneCfg: { label: "NO DOAC BRIDGING" },
    metadata: { topic: "PAUSE protocol", priority: "medium" },
  },

  {
    id: "ap1-w4-127",
    type: "mcq",
    prompt: "Which agent specifically reverses dabigatran?",
    setup: "",
    ans: [
      { t: "Idarucizumab, an antibody fragment", ok: true },
      { t: "Andexanet alfa, a factor Xa decoy", ok: false },
      { t: "Protamine sulfate by acid-base binding", ok: false },
      { t: "Vitamin K with prothrombin complex", ok: false },
    ],
    rationale: "Idarucizumab (Praxbind) is a monoclonal antibody fragment that binds dabigatran with about 350 times the affinity dabigatran has for thrombin, reversing it. Andexanet alfa reverses the factor Xa inhibitors, protamine reverses heparin, and vitamin K reverses warfarin. Pearl: idarucizumab is the dabigatran antidote.", // source: Anticoagulants deck slide 48
    scene: "pharmacology",
    sceneCfg: { label: "IDARUCIZUMAB FOR DABIGATRAN" },
    metadata: { topic: "DOAC reversal", priority: "high" },
  },

  {
    id: "ap1-w4-128",
    type: "mcq",
    prompt: "Which statement about andexanet alfa for factor Xa inhibitor reversal is correct?",
    setup: "",
    ans: [
      { t: "It is an inactive factor Xa decoy", ok: true },
      { t: "It is an antibody to dabigatran", ok: false },
      { t: "It durably lowers the INR alone", ok: false },
      { t: "It reduced thrombotic events overall", ok: false },
    ],
    rationale: "Andexanet alfa (Andexxa) is a recombinant catalytically inactive factor Xa decoy that sequesters the Xa inhibitor; ANNEXA-I in 2024 showed superior hemostasis versus usual care in intracranial hemorrhage but more thrombotic events. It is not an antibody to dabigatran and did not reduce thrombosis. Off-label 4-factor PCC is the practical default at most US sites. Pearl: andexanet is a decoy Xa with a thrombosis tradeoff.", // source: Anticoagulants deck slide 48
    scene: "pharmacology",
    sceneCfg: { label: "ANDEXANET ALFA" },
    metadata: { topic: "DOAC reversal", priority: "high" },
  },

  {
    id: "ap1-w4-129",
    type: "mcq",
    prompt: "How does aspirin inhibit platelet thromboxane A2 production?",
    setup: "",
    ans: [
      { t: "Irreversible acetylation of COX-1", ok: true },
      { t: "Reversible blockade of the P2Y12 site", ok: false },
      { t: "Competitive antagonism at COX-2", ok: false },
      { t: "Direct chelation of platelet calcium", ok: false },
    ],
    rationale: "Aspirin covalently acetylates a serine residue on cyclooxygenase-1, permanently disabling the enzyme so the platelet can no longer make thromboxane A2. P2Y12 blockade describes clopidogrel, not aspirin. Aspirin does affect COX-2 but the antiplatelet effect is COX-1 and is irreversible, not competitive, and it does not chelate calcium. Pearl: aspirin equals irreversible COX-1 acetylation.", // source: Anticoagulants deck slide 49
    scene: "pharmacology",
    sceneCfg: { label: "ASPIRIN COX-1" },
    metadata: { topic: "Aspirin mechanism", priority: "high" },
  },

  {
    id: "ap1-w4-130",
    type: "mcq",
    prompt: "Aspirin's plasma half-life is only 15 minutes, yet its antiplatelet effect lasts far longer. Why?",
    setup: "",
    ans: [
      { t: "Platelet disabled for its 7 to 10 day life", ok: true },
      { t: "An active metabolite circulates for many days", ok: false },
      { t: "It is stored within endothelial granules", ok: false },
      { t: "It slowly drives ongoing loss of new P2Y12", ok: false },
    ],
    rationale: "The platelet has no nucleus and cannot resynthesize COX-1, so a single dose disables each platelet it touches for that platelet's entire 7 to 10 day lifespan. There is no long-lived active metabolite, and aspirin is not stored in endothelium. The effect is on COX-1, not P2Y12. Pearl: short drug half-life, long platelet effect, because the enzyme block is permanent.", // source: Anticoagulants deck slide 49
    scene: "pharmacology",
    sceneCfg: { label: "PLATELET LIFESPAN" },
    metadata: { topic: "Aspirin pharmacokinetics", priority: "high" },
  },

  {
    id: "ap1-w4-131",
    type: "mcq",
    prompt: "A patient takes aspirin only for primary cardiovascular prevention and needs non-cardiac surgery. What does the evidence support?",
    setup: "",
    ans: [
      { t: "Stop it; POISE-2 showed no benefit", ok: true },
      { t: "Continue it; POISE-2 showed clear benefit", ok: false },
      { t: "Bridge with heparin during the gap", ok: false },
      { t: "Switch to clopidogrel before surgery", ok: false },
    ],
    rationale: "POISE-2 found no benefit to continuing aspirin for primary prevention in non-cardiac surgery, so it is usually safe to stop. Continuing offers no proven benefit and adds bleeding risk. Antiplatelet drugs are not bridged with heparin, and switching to clopidogrel would only add bleeding. Pearl: primary prevention aspirin can usually be stopped perioperatively.", // source: Anticoagulants deck slide 50
    scene: "pharmacology",
    sceneCfg: { label: "PRIMARY PREVENTION" },
    metadata: { topic: "Aspirin perioperative", priority: "high" },
  },

  {
    id: "ap1-w4-132",
    type: "mcq",
    prompt: "A patient on aspirin for secondary prevention after a coronary stent presents for surgery. What is the recommended approach?",
    setup: "",
    ans: [
      { t: "Continue it through most surgery", ok: true },
      { t: "Stop it 7 days before every case", ok: false },
      { t: "Hold it only for cardiac surgery", ok: false },
      { t: "Replace it with a IIb/IIIa drug", ok: false },
    ],
    rationale: "For secondary prevention, post-stent, post-myocardial-infarction, or post-stroke, aspirin is continued through most surgery, including cardiac surgery. Routinely stopping it risks thrombotic events. There is no rule to swap aspirin for a glycoprotein IIb/IIIa antagonist preoperatively. Pearl: secondary prevention aspirin generally stays on.", // source: Anticoagulants deck slide 50
    scene: "pharmacology",
    sceneCfg: { label: "SECONDARY PREVENTION" },
    metadata: { topic: "Aspirin perioperative", priority: "high" },
  },

  {
    id: "ap1-w4-133",
    type: "mcq",
    prompt: "If aspirin must be interrupted before surgery, what is the recommended timing?",
    setup: "",
    ans: [
      { t: "Stop 7 to 10 days, resume next morning", ok: true },
      { t: "Stop 24 hours, resume in one week", ok: false },
      { t: "Stop 3 days, resume after 30 days", ok: false },
      { t: "Stop 14 days, resume at suture removal", ok: false },
    ],
    rationale: "Because aspirin disables platelets for their lifespan, interrupting it requires stopping 7 to 10 days before surgery to allow enough new platelets to circulate, then resuming the morning after. A 24 hour hold is too short, and resuming a week or a month later leaves the patient unprotected too long. Pearl: aspirin off 7 to 10 days, back on the next morning.", // source: Anticoagulants deck slide 50
    scene: "pharmacology",
    sceneCfg: { label: "INTERRUPTING ASA" },
    metadata: { topic: "Aspirin perioperative", priority: "medium" },
  },

  {
    id: "ap1-w4-134",
    type: "mcq",
    prompt: "The P2Y12 receptor on platelets is the receptor for which agonist?",
    setup: "",
    ans: [
      { t: "Adenosine diphosphate", ok: true },
      { t: "Thromboxane A2", ok: false },
      { t: "Fibrinogen", ok: false },
      { t: "von Willebrand factor", ok: false },
    ],
    rationale: "P2Y12 is the platelet receptor for adenosine diphosphate, which activated platelets release to recruit more platelets in a positive feedback loop. Thromboxane A2 acts through its own receptor downstream of COX-1. Fibrinogen binds GP IIb/IIIa, and von Willebrand factor bridges GP Ib. Pearl: P2Y12 is the ADP receptor.", // source: Anticoagulants deck slide 51
    scene: "pharmacology",
    sceneCfg: { label: "P2Y12 LIGAND" },
    metadata: { topic: "P2Y12 receptor", priority: "high" },
  },

  {
    id: "ap1-w4-135",
    type: "mcq",
    prompt: "Why is clopidogrel subject to variable response and so-called clopidogrel resistance?",
    setup: "",
    ans: [
      { t: "Prodrug needing CYP2C19 activation", ok: true },
      { t: "Reversible binding cleared by liver", ok: false },
      { t: "Renal excretion of the active form", ok: false },
      { t: "Direct action with no metabolism", ok: false },
    ],
    rationale: "Clopidogrel is a prodrug that requires two CYP2C19-dependent activation steps in the liver, so the 20 to 30 percent of patients with CYP2C19 loss-of-function variants underactivate the drug. Its binding is irreversible once active, not reversible. It is not renally excreted as the issue, and it is not direct-acting; ticagrelor is the direct-acting agent. Pearl: clopidogrel resistance is a CYP2C19 activation problem.", // source: Anticoagulants deck slide 52
    scene: "pharmacology",
    sceneCfg: { label: "CLOPIDOGREL PRODRUG" },
    metadata: { topic: "Clopidogrel", priority: "high" },
  },

  {
    id: "ap1-w4-136",
    type: "mcq",
    prompt: "Which P2Y12 inhibitor is direct-acting and binds its receptor reversibly?",
    setup: "",
    ans: [
      { t: "Ticagrelor", ok: true },
      { t: "Clopidogrel", ok: false },
      { t: "Prasugrel", ok: false },
      { t: "Abciximab", ok: false },
    ],
    rationale: "Ticagrelor is direct-acting and reversibly bound, so its antiplatelet effect tracks the drug half-life rather than platelet turnover. Clopidogrel and prasugrel are prodrugs that bind irreversibly. Abciximab is a GP IIb/IIIa monoclonal antibody, not a P2Y12 inhibitor. Pearl: ticagrelor is the reversible, direct-acting P2Y12 drug.", // source: Anticoagulants deck slide 53
    scene: "pharmacology",
    sceneCfg: { label: "REVERSIBLE P2Y12" },
    metadata: { topic: "Ticagrelor", priority: "high" },
  },

  {
    id: "ap1-w4-137",
    type: "mcq",
    prompt: "Which statement best describes prasugrel relative to clopidogrel?",
    setup: "",
    ans: [
      { t: "Single-step prodrug, more potent", ok: true },
      { t: "Direct-acting and reversibly bound", ok: false },
      { t: "Two-step prodrug, weaker effect", ok: false },
      { t: "Antibody against GP IIb/IIIa", ok: false },
    ],
    rationale: "Prasugrel is a prodrug activated in a single step, is more potent than clopidogrel, and resistance is rare. Ticagrelor, not prasugrel, is direct-acting and reversible. Clopidogrel is the two-step, more variable prodrug. Prasugrel is not an antibody. Pearl: prasugrel is the potent single-step prodrug with rare resistance.", // source: Anticoagulants deck slide 53
    scene: "pharmacology",
    sceneCfg: { label: "PRASUGREL POTENCY" },
    metadata: { topic: "Prasugrel", priority: "medium" },
  },

  {
    id: "ap1-w4-138",
    type: "mcq",
    prompt: "What does dual antiplatelet therapy after coronary stenting consist of?",
    setup: "",
    ans: [
      { t: "Aspirin plus a P2Y12 inhibitor", ok: true },
      { t: "Aspirin plus a vitamin K blocker", ok: false },
      { t: "Two P2Y12 inhibitors together", ok: false },
      { t: "Heparin plus a P2Y12 inhibitor", ok: false },
    ],
    rationale: "Dual antiplatelet therapy is aspirin plus a P2Y12 inhibitor, given because the stent is a thrombogenic foreign body until endothelium grows over it. It does not combine aspirin with warfarin, two P2Y12 drugs, or heparin. Pearl: DAPT equals aspirin plus one P2Y12 inhibitor.", // source: Anticoagulants deck slide 54
    scene: "pharmacology",
    sceneCfg: { label: "DAPT COMPONENTS" },
    metadata: { topic: "DAPT definition", priority: "high" },
  },

  {
    id: "ap1-w4-139",
    type: "mcq",
    prompt: "What is the minimum recommended duration of dual antiplatelet therapy after a bare-metal stent?",
    setup: "",
    ans: [
      { t: "30 days", ok: true },
      { t: "6 months", ok: false },
      { t: "12 months", ok: false },
      { t: "3 days", ok: false },
    ],
    rationale: "A bare-metal stent requires a minimum of 30 days of dual antiplatelet therapy while endothelium covers the stent. Drug-eluting stents need longer courses, 3 months for stable disease and 6 to 12 months for acute coronary syndrome. Three days is far too short to be protective. Pearl: bare-metal stent equals at least 30 days of DAPT.", // source: Anticoagulants deck slide 54
    scene: "pharmacology",
    sceneCfg: { label: "BMS DURATION" },
    metadata: { topic: "Bare-metal stent DAPT", priority: "high" },
  },

  {
    id: "ap1-w4-140",
    type: "mcq",
    prompt: "For a current-generation drug-eluting stent placed for acute coronary syndrome, what is the recommended DAPT duration?",
    setup: "",
    ans: [
      { t: "6 to 12 months", ok: true },
      { t: "30 days minimum", ok: false },
      { t: "2 to 3 weeks", ok: false },
      { t: "Lifelong dual therapy", ok: false },
    ],
    rationale: "A drug-eluting stent placed for acute coronary syndrome warrants 6 to 12 months of dual antiplatelet therapy, versus 3 months for stable disease. The 30 day minimum applies to bare-metal stents. A few weeks is inadequate, and DAPT is not lifelong; aspirin alone continues indefinitely. Pearl: drug-eluting stent for ACS equals 6 to 12 months of DAPT.", // source: Anticoagulants deck slide 54
    scene: "pharmacology",
    sceneCfg: { label: "DES ACS DURATION" },
    metadata: { topic: "Drug-eluting stent DAPT", priority: "high" },
  },

  {
    id: "ap1-w4-141",
    type: "mcq",
    prompt: "What is the consequence of stopping the P2Y12 inhibitor too early during the DAPT window?",
    setup: "",
    ans: [
      { t: "In-stent thrombosis, mortality 20 to 40", ok: true },
      { t: "Slow restenosis, mortality under 1 percent", ok: false },
      { t: "A benign transient rise in platelet count", ok: false },
      { t: "Reversible bleeding carrying no death risk", ok: false },
    ],
    rationale: "Premature P2Y12 discontinuation in the DAPT window can cause acute in-stent thrombosis and ST-elevation myocardial infarction, with reported mortality of 20 to 40 percent. This is a catastrophic thrombotic event, not slow restenosis or a benign platelet change, and it is the opposite of a bleeding problem. Pearl: early P2Y12 stop equals stent thrombosis with 20 to 40 percent mortality.", // source: Anticoagulants deck slide 55
    scene: "pharmacology",
    sceneCfg: { label: "STENT THROMBOSIS" },
    metadata: { topic: "Operative DAPT question", priority: "high" },
  },

  {
    id: "ap1-w4-142",
    type: "mcq",
    prompt: "How should elective surgery be scheduled relative to the DAPT window after stenting?",
    setup: "",
    ans: [
      { t: "Defer surgery until the window ends", ok: true },
      { t: "Proceed and stop both drugs early", ok: false },
      { t: "Operate during the window with bridging", ok: false },
      { t: "Schedule surgery in the first week", ok: false },
    ],
    rationale: "Elective surgery should be deferred until the DAPT window is complete, because stopping the P2Y12 inhibitor early risks fatal stent thrombosis. Proceeding while stopping both drugs is exactly what causes the problem. Bridging strategies are reserved for urgent surgery and are taught separately, not used to permit elective cases. Pearl: elective surgery waits out the DAPT window.", // source: Anticoagulants deck slide 55
    scene: "pharmacology",
    sceneCfg: { label: "DEFER ELECTIVE" },
    metadata: { topic: "Operative DAPT question", priority: "medium" },
  },

  {
    id: "ap1-w4-143",
    type: "mcq",
    prompt: "Glycoprotein IIb/IIIa antagonists act on the platelet by blocking which target?",
    setup: "",
    ans: [
      { t: "The fibrinogen receptor", ok: true },
      { t: "The ADP receptor P2Y12", ok: false },
      { t: "Cyclooxygenase-1 enzyme", ok: false },
      { t: "The von Willebrand receptor", ok: false },
    ],
    rationale: "GP IIb/IIIa antagonists block the fibrinogen receptor, the final common pathway where fibrinogen crosslinks activated platelets. P2Y12 is blocked by clopidogrel and its class, COX-1 by aspirin, and GP Ib binds von Willebrand factor. Pearl: GP IIb/IIIa is the fibrinogen receptor at the final common pathway.", // source: Anticoagulants deck slide 56
    scene: "pharmacology",
    sceneCfg: { label: "FIBRINOGEN RECEPTOR" },
    metadata: { topic: "GP IIb/IIIa target", priority: "high" },
  },

  {
    id: "ap1-w4-144",
    type: "mcq",
    prompt: "Which GP IIb/IIIa antagonist is a monoclonal antibody with platelet recovery of 24 to 48 hours?",
    setup: "",
    ans: [
      { t: "Abciximab", ok: true },
      { t: "Eptifibatide", ok: false },
      { t: "Tirofiban", ok: false },
      { t: "Cangrelor", ok: false },
    ],
    rationale: "Abciximab is the monoclonal antibody in this class, and platelet function recovers over 24 to 48 hours. Eptifibatide is a peptide and tirofiban a non-peptide, both with short half-lives and faster recovery. Cangrelor is an intravenous P2Y12 inhibitor, not a GP IIb/IIIa antagonist. Pearl: abciximab is the antibody with the long 24 to 48 hour recovery.", // source: Anticoagulants deck slide 56
    scene: "pharmacology",
    sceneCfg: { label: "ABCIXIMAB ANTIBODY" },
    metadata: { topic: "Abciximab", priority: "medium" },
  },

  {
    id: "ap1-w4-145",
    type: "mcq",
    prompt: "Which adverse effect is shared by all three GP IIb/IIIa antagonists?",
    setup: "",
    ans: [
      { t: "Thrombocytopenia", ok: true },
      { t: "Hyperkalemia", ok: false },
      { t: "Hepatic necrosis", ok: false },
      { t: "Pulmonary fibrosis", ok: false },
    ],
    rationale: "Abciximab, eptifibatide, and tirofiban can all cause thrombocytopenia, and the class has been largely supplanted by oral P2Y12 inhibitors plus cangrelor. They are not characteristically linked to hyperkalemia, hepatic necrosis, or pulmonary fibrosis. Pearl: watch for thrombocytopenia with any GP IIb/IIIa antagonist.", // source: Anticoagulants deck slide 56
    scene: "pharmacology",
    sceneCfg: { label: "IIB IIIA THROMBOCYTOPENIA" },
    metadata: { topic: "GP IIb/IIIa adverse effect", priority: "medium" },
  },

  {
    id: "ap1-w4-146",
    type: "mcq",
    prompt: "Which catastrophic complication of neuraxial anesthesia in the anticoagulated patient do the ASRA timing rules exist to prevent?",
    setup: "",
    ans: [
      { t: "Epidural hematoma", ok: true },
      { t: "Postdural puncture headache", ok: false },
      { t: "Transient neurologic symptoms", ok: false },
      { t: "Local anesthetic systemic toxicity", ok: false },
    ],
    rationale: "ASRA timing exists to prevent epidural hematoma, a rare but devastating and preventable complication that can end careers. Postdural puncture headache and transient neurologic symptoms are not the bleeding catastrophe at issue, and local anesthetic systemic toxicity is unrelated to anticoagulation timing. Pearl: the ASRA numbers exist to prevent epidural hematoma.", // source: Anticoagulants deck slide 57
    scene: "pharmacology",
    sceneCfg: { label: "EPIDURAL HEMATOMA" },
    metadata: { topic: "ASRA rationale", priority: "high" },
  },

  {
    id: "ap1-w4-147",
    type: "mcq",
    prompt: "Per ASRA, what neuraxial restriction applies to a patient on aspirin alone?",
    setup: "",
    ans: [
      { t: "No restriction", ok: true },
      { t: "Hold 7 days first", ok: false },
      { t: "Hold 24 hours first", ok: false },
      { t: "Hold until normal PT", ok: false },
    ],
    rationale: "ASRA places no restriction on neuraxial procedures for patients on aspirin alone, consistent with aspirin not being a contraindication to neuraxial anesthesia. There is no required 7 day or 24 hour hold, and aspirin is not monitored by the prothrombin time. Pearl: aspirin alone equals no ASRA neuraxial restriction.", // source: Anticoagulants deck slide 58
    scene: "pharmacology",
    sceneCfg: { label: "ASA NO RESTRICTION" },
    metadata: { topic: "ASRA aspirin", priority: "high" },
  },

  {
    id: "ap1-w4-148",
    type: "mcq",
    prompt: "Per ASRA, how long before a neuraxial procedure should clopidogrel be held?",
    setup: "",
    ans: [
      { t: "7 days", ok: true },
      { t: "24 hours", ok: false },
      { t: "5 to 7 days", ok: false },
      { t: "7 to 10 days", ok: false },
    ],
    rationale: "ASRA recommends holding clopidogrel for 7 days before a neuraxial procedure. The 5 to 7 day window is ticagrelor and the 7 to 10 day window is prasugrel, while 24 hours is far too short for an irreversible P2Y12 prodrug. Pearl: clopidogrel equals 7 days before neuraxial.", // source: Anticoagulants deck slide 58
    scene: "pharmacology",
    sceneCfg: { label: "CLOPIDOGREL 7 DAYS" },
    metadata: { topic: "ASRA clopidogrel", priority: "high" },
  },

  {
    id: "ap1-w4-149",
    type: "mcq",
    prompt: "Per ASRA, what is the recommended hold before neuraxial for prasugrel?",
    setup: "",
    ans: [
      { t: "7 to 10 days", ok: true },
      { t: "7 days exactly", ok: false },
      { t: "5 to 7 days", ok: false },
      { t: "24 to 48 hours", ok: false },
    ],
    rationale: "Prasugrel should be held 7 to 10 days before a neuraxial procedure, reflecting its potent irreversible effect. Clopidogrel is 7 days and ticagrelor is 5 to 7 days, while 24 to 48 hours is inadequate for an irreversible agent. Pearl: prasugrel equals 7 to 10 days before neuraxial.", // source: Anticoagulants deck slide 58
    scene: "pharmacology",
    sceneCfg: { label: "PRASUGREL 7 TO 10" },
    metadata: { topic: "ASRA prasugrel", priority: "high" },
  },

  {
    id: "ap1-w4-150",
    type: "mcq",
    prompt: "Per ASRA, what is the recommended hold before neuraxial for ticagrelor?",
    setup: "",
    ans: [
      { t: "5 to 7 days", ok: true },
      { t: "7 days exactly", ok: false },
      { t: "7 to 10 days", ok: false },
      { t: "24 hours only", ok: false },
    ],
    rationale: "Ticagrelor is held 5 to 7 days before neuraxial; because it binds reversibly, its effect tracks drug clearance. Clopidogrel is 7 days and prasugrel is 7 to 10 days, both irreversible prodrugs. A 24 hour hold is too short. Pearl: ticagrelor equals 5 to 7 days before neuraxial.", // source: Anticoagulants deck slide 58
    scene: "pharmacology",
    sceneCfg: { label: "TICAGRELOR 5 TO 7" },
    metadata: { topic: "ASRA ticagrelor", priority: "high" },
  },

  {
    id: "ap1-w4-151",
    type: "mcq",
    prompt: "Per ASRA, when may a P2Y12 inhibitor be restarted after the neuraxial catheter is removed?",
    setup: "",
    ans: [
      { t: "6 hours after catheter removal", ok: true },
      { t: "Immediately at the time of removal", ok: false },
      { t: "A full 24 hours after removal", ok: false },
      { t: "Only after a further 7 days", ok: false },
    ],
    rationale: "ASRA allows restarting a P2Y12 inhibitor 6 hours after catheter removal. Restarting immediately leaves no margin around catheter manipulation, while waiting 24 hours or 7 days is unnecessarily long. Pearl: restart P2Y12 inhibitors 6 hours after catheter removal.", // source: Anticoagulants deck slide 58
    scene: "pharmacology",
    sceneCfg: { label: "RESTART 6 HOURS" },
    metadata: { topic: "ASRA restart P2Y12", priority: "medium" },
  },

  {
    id: "ap1-w4-152",
    type: "mcq",
    prompt: "Per ASRA, what is the hold before neuraxial for subcutaneous prophylactic heparin dosed BID at 10000 units per day or less?",
    setup: "",
    ans: [
      { t: "4 to 6 hours", ok: true },
      { t: "12 hours plus normal aPTT", ok: false },
      { t: "24 hours always", ok: false },
      { t: "No hold needed", ok: false },
    ],
    rationale: "Low-dose subcutaneous heparin prophylaxis (BID, at most 10000 units per day) requires a 4 to 6 hour hold before neuraxial. The 12 hour plus normal aPTT rule is for higher-dose or TID subcutaneous heparin, and 24 hours is the LMWH therapeutic figure. A hold is needed. Pearl: subcutaneous prophylactic heparin equals 4 to 6 hours.", // source: Anticoagulants deck slide 59
    scene: "pharmacology",
    sceneCfg: { label: "SUBQ PROPHYLAXIS" },
    metadata: { topic: "ASRA subQ heparin prophylaxis", priority: "high" },
  },

  {
    id: "ap1-w4-153",
    type: "mcq",
    prompt: "Per ASRA, what is required before neuraxial for higher-dose or TID subcutaneous heparin?",
    setup: "",
    ans: [
      { t: "12 hours plus a normal aPTT", ok: true },
      { t: "4 to 6 hours, no aPTT", ok: false },
      { t: "24 hours plus a normal INR", ok: false },
      { t: "72 hours regardless of aPTT", ok: false },
    ],
    rationale: "Higher-dose or TID subcutaneous heparin requires waiting 12 hours and documenting a normal aPTT. The 4 to 6 hour, no-test rule applies only to low-dose BID prophylaxis. The relevant test here is the aPTT, not the INR, and 72 hours is a DOAC figure. Pearl: higher-dose subcutaneous heparin equals 12 hours plus a normal aPTT.", // source: Anticoagulants deck slide 59
    scene: "pharmacology",
    sceneCfg: { label: "SUBQ TID 12H" },
    metadata: { topic: "ASRA subQ heparin high dose", priority: "high" },
  },

  {
    id: "ap1-w4-154",
    type: "mcq",
    prompt: "Per ASRA, what is required before neuraxial for intravenous therapeutic heparin?",
    setup: "",
    ans: [
      { t: "4 to 6 hours plus a normal aPTT", ok: true },
      { t: "A full 12 hours plus a normal aPTT", ok: false },
      { t: "A full 24 hours plus a normal aPTT", ok: false },
      { t: "1 hour, with no aPTT required", ok: false },
    ],
    rationale: "Intravenous therapeutic heparin requires a 4 to 6 hour hold plus a documented normal aPTT before neuraxial. Twelve hours applies to higher-dose subcutaneous dosing and 24 hours to therapeutic LMWH. A 1 hour hold with no test is unsafe given heparin's variable effect. Pearl: IV therapeutic heparin equals 4 to 6 hours plus a normal aPTT.", // source: Anticoagulants deck slide 59
    scene: "pharmacology",
    sceneCfg: { label: "IV HEPARIN 4 TO 6" },
    metadata: { topic: "ASRA IV heparin", priority: "high" },
  },

  {
    id: "ap1-w4-155",
    type: "mcq",
    prompt: "Per ASRA, what is the hold before neuraxial for prophylactic low-molecular-weight heparin?",
    setup: "",
    ans: [
      { t: "12 hours", ok: true },
      { t: "24 hours", ok: false },
      { t: "4 to 6 hours", ok: false },
      { t: "72 hours", ok: false },
    ],
    rationale: "Prophylactic LMWH requires a 12 hour hold before neuraxial. Therapeutic LMWH requires 24 hours, the 4 to 6 hour window belongs to low-dose subcutaneous heparin or IV heparin, and 72 hours is a factor Xa inhibitor figure. Pearl: prophylactic LMWH equals 12 hours.", // source: Anticoagulants deck slide 59
    scene: "pharmacology",
    sceneCfg: { label: "LMWH PROPHYLAXIS 12H" },
    metadata: { topic: "ASRA LMWH prophylactic", priority: "high" },
  },

  {
    id: "ap1-w4-156",
    type: "mcq",
    prompt: "Per ASRA, what is the hold before neuraxial for therapeutic low-molecular-weight heparin?",
    setup: "",
    ans: [
      { t: "24 hours", ok: true },
      { t: "12 hours", ok: false },
      { t: "4 to 6 hours", ok: false },
      { t: "5 days", ok: false },
    ],
    rationale: "Therapeutic LMWH requires a 24 hour hold before neuraxial, double the 12 hour prophylactic interval. The 4 to 6 hour window is for subcutaneous or IV unfractionated heparin, and 5 days is the warfarin figure. Pearl: therapeutic LMWH equals 24 hours.", // source: Anticoagulants deck slide 59
    scene: "pharmacology",
    sceneCfg: { label: "LMWH THERAPEUTIC 24H" },
    metadata: { topic: "ASRA LMWH therapeutic", priority: "high" },
  },

  {
    id: "ap1-w4-157",
    type: "mcq",
    prompt: "Per ASRA, what INR threshold should be reached before neuraxial block or catheter removal in a warfarin patient?",
    setup: "",
    ans: [
      { t: "INR below 1.5", ok: true },
      { t: "INR below 2.0", ok: false },
      { t: "INR below 1.3", ok: false },
      { t: "INR below 3.0", ok: false },
    ],
    rationale: "ASRA requires warfarin be stopped until the INR is below 1.5, typically about 5 days, and catheters are pulled when the INR is below 1.5. An INR of 2.0 or 3.0 still reflects meaningful anticoagulation, and below 1.3 is a stricter target used in some reversal contexts, not the ASRA neuraxial threshold. Pearl: warfarin neuraxial threshold is INR below 1.5.", // source: Anticoagulants deck slide 60
    scene: "pharmacology",
    sceneCfg: { label: "WARFARIN INR 1.5" },
    metadata: { topic: "ASRA warfarin", priority: "high" },
  },

  {
    id: "ap1-w4-158",
    type: "mcq",
    prompt: "Per ASRA, what is the recommended hold before neuraxial for dabigatran with normal renal function?",
    setup: "",
    ans: [
      { t: "4 to 5 days", ok: true },
      { t: "72 hours flat", ok: false },
      { t: "24 hours flat", ok: false },
      { t: "12 hours flat", ok: false },
    ],
    rationale: "Dabigatran, a direct thrombin inhibitor cleared largely by the kidney, is held 4 to 5 days before neuraxial, and longer if renal function is impaired. The 72 hour rule applies to the direct factor Xa inhibitors rivaroxaban, apixaban, and edoxaban, not dabigatran. Shorter 12 or 24 hour holds are inadequate. Pearl: dabigatran equals 4 to 5 days, longer if renal impaired.", // source: Anticoagulants deck slide 61
    scene: "pharmacology",
    sceneCfg: { label: "DABIGATRAN 4 TO 5" },
    metadata: { topic: "ASRA dabigatran", priority: "high" },
  },

  {
    id: "ap1-w4-159",
    type: "mcq",
    prompt: "Per ASRA, what is the hold before neuraxial for the direct factor Xa inhibitors rivaroxaban, apixaban, and edoxaban?",
    setup: "",
    ans: [
      { t: "72 hours", ok: true },
      { t: "24 hours", ok: false },
      { t: "4 to 5 days", ok: false },
      { t: "6 hours", ok: false },
    ],
    rationale: "ASRA recommends a 72 hour hold before neuraxial for rivaroxaban, apixaban, and edoxaban. The 4 to 5 day interval is for dabigatran, and 6 hours is the restart interval after catheter removal, not the preprocedure hold. Twenty-four hours is too short. Pearl: the oral factor Xa inhibitors equal 72 hours before neuraxial.", // source: Anticoagulants deck slide 61
    scene: "pharmacology",
    sceneCfg: { label: "XA INHIBITORS 72H" },
    metadata: { topic: "ASRA factor Xa inhibitors", priority: "high" },
  },

  {
    id: "ap1-w4-160",
    type: "mcq",
    prompt: "Per ASRA, when may a DOAC be restarted after the neuraxial catheter is removed?",
    setup: "",
    ans: [
      { t: "6 hours after catheter removal", ok: true },
      { t: "A full 72 hours after removal", ok: false },
      { t: "Immediately at the time of removal", ok: false },
      { t: "Not until 4 to 5 days after removal", ok: false },
    ],
    rationale: "ASRA allows restarting a DOAC 6 hours after catheter removal, the same restart interval used for the P2Y12 inhibitors. The 72 hour and 4 to 5 day figures are preprocedure holds, not restart times, and restarting immediately gives no margin. Pearl: restart DOACs 6 hours after catheter removal.", // source: Anticoagulants deck slide 61
    scene: "pharmacology",
    sceneCfg: { label: "DOAC RESTART 6H" },
    metadata: { topic: "ASRA restart DOAC", priority: "medium" },
  },

  {
    id: "ap1-w4-161",
    type: "mcq",
    prompt: "Tranexamic acid produces its antifibrinolytic effect by acting on which molecule?",
    setup: "",
    ans: [
      { t: "Plasminogen lysine-binding site", ok: true },
      { t: "Thrombin active site directly", ok: false },
      { t: "Antithrombin conformation change", ok: false },
      { t: "GP IIb/IIIa fibrinogen receptor", ok: false },
    ],
    rationale: "TXA is a lysine analog that competitively occupies the lysine-binding site on plasminogen, so plasminogen cannot dock onto fibrin and tPA cannot convert it to plasmin. It does not bind thrombin, alter antithrombin, or block the platelet GP IIb/IIIa receptor. Pearl: TXA blocks plasminogen's lysine site, preserving clot rather than making new clot.", // source: Anticoagulants deck slide 62
    scene: "pharmacology",
    sceneCfg: { label: "TXA LYSINE BLOCK" },
    metadata: { topic: "TXA mechanism", priority: "high" },
  },

  {
    id: "ap1-w4-162",
    type: "mcq",
    prompt: "What is the net hemostatic effect of tranexamic acid?",
    setup: "",
    ans: [
      { t: "Preserves clot already present", ok: true },
      { t: "Generates brand new fibrin clot", ok: false },
      { t: "Activates platelet aggregation", ok: false },
      { t: "Boosts thrombin generation rate", ok: false },
    ],
    rationale: "By blocking plasmin formation TXA slows fibrin breakdown, so the clot that is already in place is protected. It does not create new clot, activate platelets, or increase thrombin generation; those are properties of other agents. Pearl: TXA preserves the clot you have, it does not build a new one.", // source: Anticoagulants deck slide 62
    scene: "pharmacology",
    sceneCfg: { label: "PRESERVES EXISTING CLOT" },
    metadata: { topic: "TXA effect", priority: "medium" },
  },

  {
    id: "ap1-w4-163",
    type: "mcq",
    prompt: "In the CRASH-2 trial, within what window from injury was tranexamic acid given?",
    setup: "",
    ans: [
      { t: "Within 8 hours of injury", ok: true },
      { t: "Within 3 hours of injury", ok: false },
      { t: "Within 24 hours of injury", ok: false },
      { t: "Within 1 hour of injury", ok: false },
    ],
    rationale: "CRASH-2 enrolled trauma patients and dosed TXA within 8 hours of injury as 1 g over 10 minutes then 1 g over 8 hours. The 3-hour figure reflects later subgroup teaching about earliest benefit, not the trial entry window; 24 hours and 1 hour are wrong. Pearl: CRASH-2 dosed TXA within 8 hours of injury, 1 g load then 1 g infusion.", // source: Anticoagulants deck slide 63
    scene: "pharmacology",
    sceneCfg: { label: "CRASH-2 EIGHT HOUR WINDOW" },
    metadata: { topic: "CRASH-2 timing", priority: "high" },
  },

  {
    id: "ap1-w4-164",
    type: "mcq",
    prompt: "CRASH-2 reported which all-cause mortality result for tranexamic acid versus placebo?",
    setup: "",
    ans: [
      { t: "14.5 percent vs 16.0 percent", ok: true },
      { t: "4.9 versus 5.7 percent overall", ok: false },
      { t: "0.7 percent vs 0.1 percent", ok: false },
      { t: "1.4 percent vs 2.8 percent", ok: false },
    ],
    rationale: "All-cause mortality in CRASH-2 was 14.5% with TXA versus 16.0% with placebo across 20,211 patients. The 4.9 vs 5.7 figure is death from bleeding within the same trial; 0.7 vs 0.1 is ATACAS seizures and 1.4 vs 2.8 is ATACAS reoperation. Pearl: CRASH-2 cut all-cause mortality from 16.0% to 14.5% with a cheap drug.", // source: Anticoagulants deck slide 63
    scene: "pharmacology",
    sceneCfg: { label: "CRASH-2 MORTALITY" },
    metadata: { topic: "CRASH-2 mortality", priority: "high" },
  },

  {
    id: "ap1-w4-165",
    type: "mcq",
    prompt: "CRASH-3 (2019) extended the demonstrated benefit of tranexamic acid to which population?",
    setup: "",
    ans: [
      { t: "Isolated traumatic brain injury", ok: true },
      { t: "Elective hip arthroplasty cases", ok: false },
      { t: "Postpartum hemorrhage patients", ok: false },
      { t: "On-pump cardiac surgery cases", ok: false },
    ],
    rationale: "CRASH-3 in 2019 extended the CRASH-2 trauma findings specifically to isolated traumatic brain injury. Arthroplasty, postpartum hemorrhage, and cardiac surgery are real TXA uses but were not the CRASH-3 population. Pearl: CRASH-3 carried TXA benefit into isolated traumatic brain injury.", // source: Anticoagulants deck slide 63
    scene: "pharmacology",
    sceneCfg: { label: "CRASH-3 BRAIN INJURY" },
    metadata: { topic: "CRASH-3 scope", priority: "medium" },
  },

  {
    id: "ap1-w4-166",
    type: "mcq",
    prompt: "In the ATACAS trial of CABG patients, tranexamic acid most notably increased which adverse event?",
    setup: "",
    ans: [
      { t: "Seizures, 0.7 vs 0.1 percent", ok: true },
      { t: "Reoperation, 1.4 vs 2.8 percent", ok: false },
      { t: "Stroke, 4.9 vs 5.7 percent", ok: false },
      { t: "Death, 14.5 vs 16.0 percent", ok: false },
    ],
    rationale: "ATACAS showed a sevenfold rise in seizures with TXA, 0.7% versus 0.1%. Reoperation for bleeding was actually reduced by TXA (1.4 vs 2.8), and the 4.9 vs 5.7 and 14.5 vs 16.0 figures belong to CRASH-2. Pearl: ATACAS halved transfusion but raised seizures sevenfold, from 0.1% to 0.7%.", // source: Anticoagulants deck slide 64
    scene: "pharmacology",
    sceneCfg: { label: "ATACAS SEIZURE SIGNAL" },
    metadata: { topic: "ATACAS seizures", priority: "high" },
  },

  {
    id: "ap1-w4-167",
    type: "mcq",
    prompt: "The seizures seen with high-dose tranexamic acid are attributed to which mechanism?",
    setup: "",
    ans: [
      { t: "GABA-A receptor antagonism", ok: true },
      { t: "NMDA receptor overactivation", ok: false },
      { t: "Sodium channel blockade", ok: false },
      { t: "Glycine receptor stimulation", ok: false },
    ],
    rationale: "High-dose TXA antagonizes the inhibitory GABA-A receptor, removing cortical inhibition and lowering the seizure threshold. It does not work by NMDA overactivation, sodium channel blockade, or glycine stimulation. Pearl: TXA seizures come from GABA-A antagonism and loss of cortical inhibition.", // source: Anticoagulants deck slide 64
    scene: "pharmacology",
    sceneCfg: { label: "TXA GABA-A ANTAGONISM" },
    metadata: { topic: "TXA seizure mechanism", priority: "medium" },
  },

  {
    id: "ap1-w4-168",
    type: "mcq",
    prompt: "How does desmopressin (DDAVP) improve hemostasis at the molecular level?",
    setup: "",
    ans: [
      { t: "Releases stored vWF and factor VIII", ok: true },
      { t: "Replaces depleted clotting factors now", ok: false },
      { t: "Blocks plasminogen lysine binding", ok: false },
      { t: "Inhibits antithrombin directly", ok: false },
    ],
    rationale: "DDAVP is a V2 receptor analog that releases stored von Willebrand factor and factor VIII from endothelial Weibel-Palade bodies. It does not supply exogenous factors, block plasminogen, or inhibit antithrombin. Pearl: DDAVP empties Weibel-Palade bodies of vWF and factor VIII.", // source: Anticoagulants deck slide 65
    scene: "pharmacology",
    sceneCfg: { label: "DDAVP RELEASES VWF" },
    metadata: { topic: "DDAVP mechanism", priority: "high" },
  },

  {
    id: "ap1-w4-169",
    type: "mcq",
    prompt: "What is the correct dose and administration of desmopressin for hemostasis?",
    setup: "",
    ans: [
      { t: "0.3 mcg/kg IV over 15 to 30 min", ok: true },
      { t: "0.3 mg/kg IV as a rapid bolus push", ok: false },
      { t: "3 mcg/kg IV over 5 minutes", ok: false },
      { t: "0.3 mcg/kg subcutaneous daily", ok: false },
    ],
    rationale: "DDAVP is dosed at 0.3 mcg/kg intravenously over 15 to 30 minutes; the slow infusion is non-negotiable because a rapid push causes hypotension from other endothelial mediators. The unit is micrograms not milligrams, the rate is not a fast bolus, and it is given IV here. Pearl: DDAVP is 0.3 mcg/kg IV slowly over 15 to 30 minutes.", // source: Anticoagulants deck slide 65
    scene: "pharmacology",
    sceneCfg: { label: "DDAVP DOSE AND RATE" },
    metadata: { topic: "DDAVP dosing", priority: "high" },
  },

  {
    id: "ap1-w4-170",
    type: "mcq",
    prompt: "Which condition is the strongest indication for desmopressin?",
    setup: "",
    ans: [
      { t: "Type 1 von Willebrand disease", ok: true },
      { t: "Severe hemophilia B disease", ok: false },
      { t: "Routine post-bypass bleeding", ok: false },
      { t: "Warfarin-associated hemorrhage", ok: false },
    ],
    rationale: "Type 1 von Willebrand disease is the strongest DDAVP indication because functional vWF can be released from stores. DDAVP helps mild hemophilia A, not hemophilia B, is not a routine bypass rescue, and does nothing for warfarin. Pearl: DDAVP shines in type 1 vWD, plus mild hemophilia A and uremic platelets.", // source: Anticoagulants deck slide 66
    scene: "pharmacology",
    sceneCfg: { label: "DDAVP TYPE 1 VWD" },
    metadata: { topic: "DDAVP indications", priority: "high" },
  },

  {
    id: "ap1-w4-171",
    type: "mcq",
    prompt: "Which statement about desmopressin in cardiac surgery is most accurate?",
    setup: "",
    ans: [
      { t: "Not routine; tiny blood loss benefit", ok: true },
      { t: "First-line rescue for any bleeding case", ok: false },
      { t: "Reverses heparin after bypass", ok: false },
      { t: "Replaces fibrinogen in the patient", ok: false },
    ],
    rationale: "A meta-analysis of 18 trials and 1,300 patients showed DDAVP gives only about a 115 mL median reduction in blood loss, so it is not a routine cardiac rescue. It does not reverse heparin or replete fibrinogen. Pearl: DDAVP is no routine bypass rescue; expect only ~115 mL less blood loss.", // source: Anticoagulants deck slide 66
    scene: "pharmacology",
    sceneCfg: { label: "DDAVP WEAK IN CARDIAC" },
    metadata: { topic: "DDAVP limits", priority: "medium" },
  },

  {
    id: "ap1-w4-172",
    type: "mcq",
    prompt: "What is the normal plasma fibrinogen concentration range?",
    setup: "",
    ans: [
      { t: "200 to 400 mg/dL in plasma", ok: true },
      { t: "50 to 150 mg/dL in plasma", ok: false },
      { t: "400 to 600 mg/dL in plasma", ok: false },
      { t: "150 to 250 mg/dL in plasma", ok: false },
    ],
    rationale: "Normal fibrinogen runs 200 to 400 mg/dL; pregnancy pushes it above 400 in the third trimester. The other ranges are either too low or too narrow to be the accepted normal interval. Pearl: Normal fibrinogen is 200 to 400 mg/dL, higher in late pregnancy.", // source: Anticoagulants deck slide 67
    scene: "pharmacology",
    sceneCfg: { label: "FIBRINOGEN NORMAL RANGE" },
    metadata: { topic: "Fibrinogen normal range", priority: "high" },
  },

  {
    id: "ap1-w4-173",
    type: "mcq",
    prompt: "Which best describes fibrinogen as a coagulation substrate?",
    setup: "",
    ans: [
      { t: "Thrombin cleaves it into fibrin", ok: true },
      { t: "Plasmin assembles it from fibrin", ok: false },
      { t: "Factor Xa converts it to thrombin", ok: false },
      { t: "Vitamin K activates it in liver", ok: false },
    ],
    rationale: "Fibrinogen is a 340-kDa hepatic glycoprotein that thrombin cleaves into fibrin, the final clot scaffold. Plasmin breaks fibrin down rather than building it, Xa converts prothrombin not fibrinogen, and fibrinogen is not vitamin K dependent. Pearl: Thrombin turns fibrinogen into fibrin; fibrinogen is the substrate, not an enzyme.", // source: Anticoagulants deck slide 67
    scene: "pharmacology",
    sceneCfg: { label: "FIBRINOGEN TO FIBRIN" },
    metadata: { topic: "Fibrinogen substrate", priority: "medium" },
  },

  {
    id: "ap1-w4-174",
    type: "mcq",
    prompt: "In a bleeding patient, what is the usual fibrinogen replacement target?",
    setup: "",
    ans: [
      { t: "Above 150 to 200 mg/dL", ok: true },
      { t: "Above 50 to 100 mg/dL", ok: false },
      { t: "Above 300 to 400 mg/dL", ok: false },
      { t: "Above 400 to 500 mg/dL", ok: false },
    ],
    rationale: "The target in active bleeding is to keep fibrinogen above roughly 150 to 200 mg/dL. Below 150 Repletion is directed; targets of 50 to 100 are too low and 300 to 500 are unnecessarily high. Pearl: Replete fibrinogen to keep it above 150 to 200 mg/dL when bleeding.", // source: Anticoagulants deck slide 68
    scene: "pharmacology",
    sceneCfg: { label: "FIBRINOGEN REPLETION TARGET" },
    metadata: { topic: "Fibrinogen target", priority: "high" },
  },

  {
    id: "ap1-w4-175",
    type: "mcq",
    prompt: "How much does cryoprecipitate raise fibrinogen, per standard US dosing?",
    setup: "",
    ans: [
      { t: "1 unit per 10 kg, up 50 to 70", ok: true },
      { t: "1 unit per 10 kg, up 10 to 20", ok: false },
      { t: "1 unit per 50 kg, up 50 to 70", ok: false },
      { t: "1 unit per 10 kg, up 150 to 200", ok: false },
    ],
    rationale: "Standard US practice is cryoprecipitate 1 unit per 10 kg, which raises fibrinogen by about 50 to 70 mg/dL. A 10 to 20 rise understates it, dosing per 50 kg is wrong, and a 150 to 200 jump overstates it. Pearl: Cryo 1 unit per 10 kg lifts fibrinogen 50 to 70 mg/dL.", // source: Anticoagulants deck slide 68
    scene: "pharmacology",
    sceneCfg: { label: "CRYO FIBRINOGEN DOSE" },
    metadata: { topic: "Cryoprecipitate dosing", priority: "high" },
  },

  {
    id: "ap1-w4-176",
    type: "mcq",
    prompt: "Why is fresh frozen plasma a poor source for repleting fibrinogen?",
    setup: "",
    ans: [
      { t: "Its fibrinogen is only about 200", ok: true },
      { t: "It contains no fibrinogen at all", ok: false },
      { t: "It chelates circulating calcium", ok: false },
      { t: "It directly inhibits thrombin", ok: false },
    ],
    rationale: "FFP carries a fibrinogen concentration of only about 200 mg/dL, so large volumes are needed to raise a low level, making it a poor source. It does contain fibrinogen, does not meaningfully chelate calcium in this context, and does not inhibit thrombin. Pearl: FFP fibrinogen is only ~200 mg/dL, so it is a weak repletion source.", // source: Anticoagulants deck slide 68
    scene: "pharmacology",
    sceneCfg: { label: "FFP WEAK FIBRINOGEN" },
    metadata: { topic: "FFP fibrinogen", priority: "medium" },
  },

  {
    id: "ap1-w4-177",
    type: "mcq",
    prompt: "Which factors and proteins does 4-factor prothrombin complex concentrate (Kcentra) contain?",
    setup: "",
    ans: [
      { t: "II, VII, IX, X plus C, S, AT", ok: true },
      { t: "II, IX, X only, low in VII", ok: false },
      { t: "VII alone in high concentration", ok: false },
      { t: "Fibrinogen plus factor XIII", ok: false },
    ],
    rationale: "4-factor PCC contains coagulation factors II, VII, IX, and X plus proteins C, S, and antithrombin. The II, IX, X only profile describes 3-factor PCC, isolated VII is recombinant factor VIIa, and fibrinogen plus XIII is cryoprecipitate territory. Pearl: 4-factor PCC carries II, VII, IX, X with proteins C, S, and antithrombin.", // source: Anticoagulants deck slide 69
    scene: "pharmacology",
    sceneCfg: { label: "FOUR FACTOR PCC CONTENT" },
    metadata: { topic: "4-factor PCC content", priority: "high" },
  },

  {
    id: "ap1-w4-178",
    type: "mcq",
    prompt: "Which agent is an activated prothrombin complex concentrate used in hemophilia with inhibitors?",
    setup: "",
    ans: [
      { t: "FEIBA, an activated PCC", ok: true },
      { t: "Kcentra, a 4-factor PCC", ok: false },
      { t: "Profilnine, a 3-factor PCC", ok: false },
      { t: "RiaSTAP, a fibrinogen product", ok: false },
    ],
    rationale: "FEIBA is an activated PCC used in hemophilia patients who have developed inhibitors. Kcentra and Profilnine are non-activated 4-factor and 3-factor PCCs, and RiaSTAP is fibrinogen concentrate. Pearl: FEIBA is the activated PCC for hemophilia with inhibitors.", // source: Anticoagulants deck slide 69
    scene: "pharmacology",
    sceneCfg: { label: "FEIBA ACTIVATED PCC" },
    metadata: { topic: "PCC types", priority: "medium" },
  },

  {
    id: "ap1-w4-179",
    type: "mcq",
    prompt: "Which statement about recombinant factor VIIa (NovoSeven) in warfarin patients is correct?",
    setup: "",
    ans: [
      { t: "Normalizes INR but not the defect", ok: true },
      { t: "Corrects the underlying defect fully", ok: false },
      { t: "Carries no thrombotic risk at all", ok: false },
      { t: "Is preferred over PCC for warfarin", ok: false },
    ],
    rationale: "In warfarin patients rFVIIa drives the INR to normal without actually correcting the multifactor deficiency, a misleading lab. It does not fix the underlying defect, it carries real arterial thrombotic risk, and PCC is preferred for warfarin reversal. Pearl: rFVIIa normalizes the INR cosmetically; reserve it for rescue and prefer PCC for warfarin.", // source: Anticoagulants deck slide 70
    scene: "pharmacology",
    sceneCfg: { label: "RFVIIA MISLEADING INR" },
    metadata: { topic: "rFVIIa caveats", priority: "high" },
  },

  {
    id: "ap1-w4-180",
    type: "mcq",
    prompt: "For which condition is recombinant factor VIIa an approved (on-label) therapy?",
    setup: "",
    ans: [
      { t: "Hemophilia A or B with inhibitors", ok: true },
      { t: "Routine warfarin reversal when urgent", ok: false },
      { t: "Type 1 von Willebrand disease", ok: false },
      { t: "Uremic platelet dysfunction", ok: false },
    ],
    rationale: "rFVIIa is approved for hemophilia A or B with inhibitors, factor VII deficiency, and Glanzmann thrombasthenia. Warfarin reversal and the platelet or vWF conditions listed are not its labeled indications; warfarin reversal with rFVIIa is off-label. Pearl: rFVIIa is on-label for hemophilia with inhibitors, factor VII deficiency, and Glanzmann.", // source: Anticoagulants deck slide 70
    scene: "pharmacology",
    sceneCfg: { label: "RFVIIA APPROVED USES" },
    metadata: { topic: "rFVIIa indications", priority: "medium" },
  },

  {
    id: "ap1-w4-181",
    type: "mcq",
    prompt: "Case 1: a hip-fracture patient took apixaban 12 hours ago. Why is a spinal anesthetic ruled out?",
    setup: "",
    ans: [
      { t: "ASRA requires 72 hours off apixaban", ok: true },
      { t: "ASRA requires only 24 hours off the drug", ok: false },
      { t: "INR must first fall below 1.5", ok: false },
      { t: "Platelet count is below 100k", ok: false },
    ],
    rationale: "ASRA mandates 72 hours off apixaban before neuraxial placement, so 12 hours is far too short and the case proceeds under general anesthesia. The 24-hour figure is wrong for apixaban, and INR and platelet thresholds are not the governing rule for a DOAC. Pearl: ASRA wants 72 hours off apixaban before a spinal, so use general anesthesia here.", // source: Anticoagulants deck slide 71
    scene: "pharmacology",
    sceneCfg: { label: "APIXABAN NO SPINAL" },
    metadata: { topic: "Case 1 neuraxial", priority: "high" },
  },

  {
    id: "ap1-w4-182",
    type: "mcq",
    prompt: "Case 1: if the apixaban patient develops life-threatening intraoperative bleeding, what is the rescue plan?",
    setup: "",
    ans: [
      { t: "Off-label 4-factor PCC or andexanet", ok: true },
      { t: "Protamine given to reverse the apixaban", ok: false },
      { t: "Vitamin K with fresh frozen plasma", ok: false },
      { t: "Idarucizumab to bind the apixaban", ok: false },
    ],
    rationale: "For life-threatening apixaban bleeding the plan is off-label 4-factor PCC or andexanet alfa. Protamine does not touch a factor Xa inhibitor, vitamin K is for warfarin, and idarucizumab reverses dabigatran not apixaban. Pearl: Reverse a bleeding Xa-inhibitor patient with andexanet alfa or off-label 4-factor PCC.", // source: Anticoagulants deck slide 71
    scene: "pharmacology",
    sceneCfg: { label: "APIXABAN BLEEDING RESCUE" },
    metadata: { topic: "Case 1 rescue", priority: "high" },
  },

  {
    id: "ap1-w4-183",
    type: "mcq",
    prompt: "Case 3: coming off bypass with an ACT of 180 seconds and rising chest-tube output, what is the LEAST appropriate next step?",
    setup: "",
    ans: [
      { t: "Give more protamine for the ACT", ok: true },
      { t: "Transfuse platelets at 95k", ok: false },
      { t: "Give cryoprecipitate for fibrinogen", ok: false },
      { t: "Add tranexamic acid if not given", ok: false },
    ],
    rationale: "An ACT of 180 is back in range, so residual heparin is not the problem and extra protamine only adds its own coagulopathy, making it the least appropriate move. Transfusing platelets at 95k, giving cryo for a fibrinogen of 110, and adding TXA are all reasonable. Pearl: When the ACT is in range, more protamine worsens bleeding rather than fixing it.", // source: Anticoagulants deck slide 72
    scene: "pharmacology",
    sceneCfg: { label: "ACT IN RANGE NO PROTAMINE" },
    metadata: { topic: "Case 3 protamine", priority: "high" },
  },

  {
    id: "ap1-w4-184",
    type: "mcq",
    prompt: "Case 3: after blood-product correction the patient keeps bleeding. What is the next diagnostic step?",
    setup: "",
    ans: [
      { t: "Viscoelastic testing, TEG or ROTEM", ok: true },
      { t: "Repeat an empiric protamine dose now", ok: false },
      { t: "Send a routine aPTT and PT", ok: false },
      { t: "Give recombinant factor VIIa now", ok: false },
    ],
    rationale: "Persistent bleeding after initial correction should go to viscoelastic testing, thromboelastography or rotational thromboelastometry, to show what is actually broken. Repeat protamine is harmful with an in-range ACT, conventional aPTT and PT lag and are less informative, and rFVIIa is a last-ditch rescue not a diagnostic. Pearl: Map ongoing surgical-field bleeding with TEG or ROTEM before reaching for more products.", // source: Anticoagulants deck slide 72
    scene: "pharmacology",
    sceneCfg: { label: "VISCOELASTIC TESTING" },
    metadata: { topic: "Case 3 diagnostics", priority: "medium" },
  },

  {
    id: "ap1-w4-185",
    type: "mcq",
    prompt: "Case 5: an 80-year-old on warfarin has INR 4.1, GCS 8, and suspected intracranial hemorrhage. What is the primary reversal?",
    setup: "",
    ans: [
      { t: "4-factor PCC, 25 to 50 units/kg", ok: true },
      { t: "Fresh frozen plasma, 2 to 4 units", ok: false },
      { t: "Recombinant factor VIIa bolus", ok: false },
      { t: "Protamine, 1 mg per 100 units", ok: false },
    ],
    rationale: "Warfarin-associated intracranial hemorrhage is reversed with weight-based 4-factor PCC at 25 to 50 units/kg plus slow IV vitamin K, then recheck INR at 30 minutes. FFP is too slow and too much volume, rFVIIa gives a misleading INR without fixing the defect, and protamine does not reverse warfarin. Pearl: Warfarin ICH gets 4-factor PCC 25 to 50 units/kg plus IV vitamin K, not FFP.", // source: Anticoagulants deck slide 73
    scene: "pharmacology",
    sceneCfg: { label: "WARFARIN ICH PCC DOSE" },
    metadata: { topic: "Case 5 reversal", priority: "high" },
  },

  {
    id: "ap1-w4-186",
    type: "mcq",
    prompt: "Case 5: why is fresh frozen plasma the wrong choice for this warfarin-associated intracranial hemorrhage?",
    setup: "",
    ans: [
      { t: "Too slow and too much volume", ok: true },
      { t: "Lacks factors II, IX, and X", ok: false },
      { t: "Raises the INR even higher", ok: false },
      { t: "Requires no crossmatch first", ok: false },
    ],
    rationale: "FFP is the wrong tool in this emergency because it is too slow to thaw and infuse and demands a large volume in an elderly patient. FFP does contain II, IX, and X, it does not raise the INR, and not requiring crossmatch would be a point in its favor, not against. Pearl: In warfarin ICH, FFP is too slow and too voluminous; reach for PCC instead.", // source: Anticoagulants deck slide 73
    scene: "pharmacology",
    sceneCfg: { label: "FFP WRONG TOOL ICH" },
    metadata: { topic: "Case 5 FFP", priority: "medium" },
  },

  {
    id: "ap1-w4-187",
    type: "mcq",
    prompt: "Case 1: the PAUSE protocol recommends what for this high-bleeding-risk hip procedure on apixaban?",
    setup: "",
    ans: [
      { t: "Stop apixaban 2 days before surgery", ok: true },
      { t: "Stop apixaban 5 days before surgery", ok: false },
      { t: "Bridge with heparin until surgery", ok: false },
      { t: "Continue apixaban through surgery", ok: false },
    ],
    rationale: "PAUSE directs stopping a DOAC 2 days before a high-bleeding-risk procedure, though a hip fracture cannot safely wait the full 48 hours so the team proceeds with general anesthesia and blood ready. Five days is a warfarin number, DOACs are not bridged, and continuing through surgery is unsafe. Pearl: PAUSE stops the DOAC 2 days before high-risk surgery, but hip fractures will not wait 48 hours.", // source: Anticoagulants deck slide 71
    scene: "pharmacology",
    sceneCfg: { label: "PAUSE TWO DAY HOLD" },
    metadata: { topic: "Case 1 surgery timing", priority: "high" },
  },

  {
    id: "ap1-w4-188",
    type: "mcq",
    prompt: "How does pregnancy alter the fibrinogen level, and why does this matter in postpartum hemorrhage?",
    setup: "",
    ans: [
      { t: "Rises above 400; a drop warns early", ok: true },
      { t: "Falls below 200; rise warns early", ok: false },
      { t: "Stays 200 to 400; unchanged value", ok: false },
      { t: "Rises above 400; never falls in PPH", ok: false },
    ],
    rationale: "Pregnancy raises fibrinogen above 400 mg/dL by the third trimester, so a precipitous fall during postpartum hemorrhage is an early warning sign even before the level looks abnormal. Fibrinogen rises rather than falls in pregnancy, it does not stay unchanged, and it certainly can fall in PPH. Pearl: Late-pregnancy fibrinogen exceeds 400, so any rapid drop in PPH is an early red flag.", // source: Anticoagulants deck slide 67
    scene: "pharmacology",
    sceneCfg: { label: "PREGNANCY FIBRINOGEN RISE" },
    metadata: { topic: "Fibrinogen in pregnancy", priority: "medium" },
  },

  {
    id: "ap1-w4-189",
    type: "mcq",
    prompt: "Which is true of the thrombotic risk profile of recombinant factor VIIa in non-hemophilia patients?",
    setup: "",
    ans: [
      { t: "Most events arterial; deaths thrombotic", ok: true },
      { t: "Most events venous; deaths from bleeding", ok: false },
      { t: "No excess events; deaths from allergy", ok: false },
      { t: "Most events venous; deaths cardiac arrest", ok: false },
    ],
    rationale: "In non-hemophilia patients rFVIIa carries real thrombotic risk, with 54% of events arterial and 72% of associated deaths from thrombosis. The risk is not predominantly venous, it is not negligible, and the deaths are thrombotic rather than allergic. Pearl: rFVIIa thrombosis skews arterial; most associated deaths are thrombotic, so reserve it for true rescue.", // source: Anticoagulants deck slide 70
    scene: "pharmacology",
    sceneCfg: { label: "RFVIIA ARTERIAL RISK" },
    metadata: { topic: "rFVIIa thrombosis", priority: "medium" },
  },

  {
    id: "ap1-w4-190",
    type: "mcq",
    prompt: "What is the primary clinical role of 4-factor prothrombin complex concentrate?",
    setup: "",
    ans: [
      { t: "First-line urgent warfarin reversal", ok: true },
      { t: "First-line dabigatran reversal agent", ok: false },
      { t: "Routine fibrinogen replacement", ok: false },
      { t: "Standard heparin neutralization", ok: false },
    ],
    rationale: "4-factor PCC is first-line for urgent warfarin reversal and is used off-label for factor Xa inhibitor reversal when andexanet is unavailable. Dabigatran is reversed by idarucizumab, fibrinogen is replaced by cryoprecipitate, and heparin is neutralized by protamine. Pearl: 4-factor PCC is the go-to for urgent warfarin reversal, off-label for Xa inhibitors.", // source: Anticoagulants deck slide 69
    scene: "pharmacology",
    sceneCfg: { label: "PCC WARFARIN FIRST LINE" },
    metadata: { topic: "PCC role", priority: "high" },
  },

  {
    id: "ap1-w4-191",
    type: "mcq",
    prompt: "The CRASH-2 trial of tranexamic acid enrolled approximately how many patients, and in what setting?",
    setup: "",
    ans: [
      { t: "About 20,000 trauma patients", ok: true },
      { t: "About 4,600 cardiac surgery cases", ok: false },
      { t: "About 1,300 cardiac surgery cases", ok: false },
      { t: "About 3,000 atrial fibrillation cases", ok: false },
    ],
    rationale: "CRASH-2 enrolled 20,211 trauma patients across 40 countries. The 4,600 figure is ATACAS in CABG, 1,300 is the DDAVP cardiac meta-analysis, and 3,000 evokes the PAUSE DOAC cohort. Pearl: CRASH-2 was a roughly 20,000-patient trauma trial of tranexamic acid.", // source: Anticoagulants deck slide 63
    scene: "pharmacology",
    sceneCfg: { label: "CRASH-2 TRAUMA COHORT" },
    metadata: { topic: "CRASH-2 size", priority: "medium" },
  },

  {
    id: "ap1-w4-192",
    type: "mcq",
    prompt: "ATACAS demonstrated which efficacy benefit of tranexamic acid in CABG patients?",
    setup: "",
    ans: [
      { t: "Transfusion roughly halved", ok: true },
      { t: "Mortality roughly halved", ok: false },
      { t: "Seizures roughly halved", ok: false },
      { t: "Stroke rate roughly halved", ok: false },
    ],
    rationale: "ATACAS showed TXA roughly halved transfusion and cut reoperation for bleeding from 2.8% to 1.4%. It did not halve mortality or stroke, and seizures actually rose rather than fell. Pearl: ATACAS halved transfusion and reoperation for bleeding, at the cost of more seizures.", // source: Anticoagulants deck slide 64
    scene: "pharmacology",
    sceneCfg: { label: "ATACAS HALVES TRANSFUSION" },
    metadata: { topic: "ATACAS efficacy", priority: "medium" },
  },

  {
    id: "ap1-w4-193",
    type: "mcq",
    prompt: "From which endothelial storage organelle does desmopressin mobilize von Willebrand factor?",
    setup: "",
    ans: [
      { t: "Weibel-Palade bodies", ok: true },
      { t: "Platelet alpha granules", ok: false },
      { t: "Platelet dense granules", ok: false },
      { t: "Hepatic rough endoplasmic reticulum", ok: false },
    ],
    rationale: "DDAVP acts on endothelial V2 receptors to release vWF and factor VIII from Weibel-Palade bodies, the endothelial storage organelles. Platelet alpha and dense granules and hepatic endoplasmic reticulum are not the source DDAVP taps. Pearl: DDAVP releases vWF from endothelial Weibel-Palade bodies.", // source: Anticoagulants deck slide 65
    scene: "pharmacology",
    sceneCfg: { label: "WEIBEL PALADE BODIES" },
    metadata: { topic: "DDAVP storage site", priority: "medium" },
  },

  {
    id: "ap1-w4-194",
    type: "mcq",
    prompt: "Case 3 presents ACT 180, platelets 95k, and fibrinogen 110 mg/dL. Which product targets the low fibrinogen?",
    setup: "",
    ans: [
      { t: "Cryoprecipitate or fibrinogen concentrate", ok: true },
      { t: "Platelet concentrate transfused right away", ok: false },
      { t: "Additional protamine sulfate dose", ok: false },
      { t: "Idarucizumab monoclonal fragment", ok: false },
    ],
    rationale: "A fibrinogen of 110 is below the 150 threshold, so the right product is cryoprecipitate or fibrinogen concentrate. Platelets fix the count not the fibrinogen, protamine is wrong with an in-range ACT, and idarucizumab is a dabigatran reversal agent. Pearl: For fibrinogen under 150 in a bleeding bypass patient, give cryoprecipitate or fibrinogen concentrate.", // source: Anticoagulants deck slide 72
    scene: "pharmacology",
    sceneCfg: { label: "CRYO FOR LOW FIBRINOGEN" },
    metadata: { topic: "Case 3 fibrinogen", priority: "medium" },
  },

  {
    id: "ap1-w4-195",
    type: "mcq",
    prompt: "Which best characterizes 3-factor prothrombin complex concentrates such as Profilnine and Bebulin?",
    setup: "",
    ans: [
      { t: "Low in factor VII; weaker for warfarin", ok: true },
      { t: "Rich in factor VII; ideal for warfarin", ok: false },
      { t: "Contain activated factors for inhibitors", ok: false },
      { t: "Contain fibrinogen for hypofibrinogenemia", ok: false },
    ],
    rationale: "3-factor PCCs are low in factor VII, which makes them less useful for warfarin reversal than 4-factor products. They are not VII-rich, they are non-activated unlike FEIBA, and they do not supply fibrinogen. Pearl: 3-factor PCCs skimp on factor VII, so 4-factor PCC is better for warfarin.", // source: Anticoagulants deck slide 69
    scene: "pharmacology",
    sceneCfg: { label: "THREE FACTOR PCC GAP" },
    metadata: { topic: "3-factor PCC", priority: "medium" },
  },

  {
    id: "ap1-w4-196",
    type: "mcq",
    prompt: "What is the half-life of plasma fibrinogen?",
    setup: "",
    ans: [
      { t: "About 3.7 days in circulation", ok: true },
      { t: "About 3.7 hours in circulation", ok: false },
      { t: "About 6 hours in circulation", ok: false },
      { t: "About 60 hours in circulation", ok: false },
    ],
    rationale: "Fibrinogen has a long half-life of about 3.7 days, fitting its role as an abundant structural substrate. A 3.7-hour or 6-hour value is far too short, and 60 hours is the half-life of factor II, not fibrinogen. Pearl: Fibrinogen half-life is roughly 3.7 days.", // source: Anticoagulants deck slide 67
    scene: "pharmacology",
    sceneCfg: { label: "FIBRINOGEN HALF LIFE" },
    metadata: { topic: "Fibrinogen half-life", priority: "medium" },
  },

];

export const AP1_WK4_METADATA = {
  nodeId: "ap1-wk-4",
  courseId: "adv-pharmacology-1",
  chapter: "Stoelting Ch 29, 30",
  title: "Anticoagulants and Procoagulants",
  totalQuestions: 196,
  questionTypes: { mcq: 196, multi: 0, short: 0 },
};
