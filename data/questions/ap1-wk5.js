/**
 * Advanced Pharmacology I, Week 5 (Lipid-Lowering Drugs)
 * Stoelting Ch 23 (Whybrew lecture)
 * Concept-complete, concept-first coverage. Answer options length-balanced; dash-free.
 */
export const AP1_WK5_QUESTIONS = [

  {
    id: "ap1-w5l-001",
    type: "mcq",
    prompt: "Which lipoprotein is the largest and least dense, carrying dietary fat absorbed from the gut?",
    setup: "",
    ans: [
      { t: "Chylomicron", ok: true },
      { t: "Low-density lipoprotein", ok: false },
      { t: "High-density lipoprotein", ok: false },
      { t: "Intermediate-density type", ok: false },
    ],
    rationale: "Chylomicrons are the largest and lightest particles because their high triglyceride content from dietary fat lowers their density. LDL and IDL are denser cholesterol-richer remnants formed later, and HDL is the smallest and densest particle. Pearl: density rises and size falls as you move from chylomicron to VLDL to IDL to LDL to HDL.", // source: Lipid deck slide 4
    scene: "pharmacology",
    sceneCfg: { label: "CHYLOMICRON DENSITY" },
    metadata: { topic: "Lipoprotein particles", priority: "high" },
  },

  {
    id: "ap1-w5l-002",
    type: "mcq",
    prompt: "As lipoprotein particles are ordered from chylomicron toward HDL, which trend is correct?",
    setup: "",
    ans: [
      { t: "Density rises, size falls", ok: true },
      { t: "Density falls, size rises", ok: false },
      { t: "Both density and size rise", ok: false },
      { t: "Both density and size fall", ok: false },
    ],
    rationale: "Moving chylomicron to VLDL to IDL to LDL to HDL, triglyceride is progressively shed and protein fraction climbs, so density increases while particle diameter shrinks. HDL is therefore the smallest and densest. Pearl: the densest particle, HDL, is also the smallest.", // source: Lipid deck slide 4
    scene: "pharmacology",
    sceneCfg: { label: "DENSITY SIZE TREND" },
    metadata: { topic: "Lipoprotein particles", priority: "medium" },
  },

  {
    id: "ap1-w5l-003",
    type: "mcq",
    prompt: "Which lipoprotein is the most atherogenic and delivers cholesterol to peripheral tissues?",
    setup: "",
    ans: [
      { t: "Low-density lipoprotein", ok: true },
      { t: "High-density lipoprotein", ok: false },
      { t: "Chylomicron particle", ok: false },
      { t: "Nascent VLDL particle", ok: false },
    ],
    rationale: "LDL is cholesterol-rich and deposits cholesterol into arterial walls, making it the chief atherogenic particle. HDL is protective and removes cholesterol, while chylomicrons and VLDL mainly carry triglyceride. Pearl: LDL is the bad cholesterol that drives plaque, HDL is the good cholesterol that clears it.", // source: Lipid deck slide 4
    scene: "pharmacology",
    sceneCfg: { label: "LDL ATHEROGENIC" },
    metadata: { topic: "LDL versus HDL", priority: "high" },
  },

  {
    id: "ap1-w5l-004",
    type: "mcq",
    prompt: "Higher levels of which lipoprotein are associated with reduced atherosclerotic cardiovascular risk?",
    setup: "",
    ans: [
      { t: "The HDL particle", ok: true },
      { t: "The LDL particle", ok: false },
      { t: "Chylomicron remnant", ok: false },
      { t: "Very-low-density type", ok: false },
    ],
    rationale: "HDL performs reverse cholesterol transport, returning excess cholesterol to the liver, so higher HDL correlates with lower cardiovascular risk. Elevated LDL and VLDL remnants instead promote atherosclerosis. Pearl: HDL is the good cholesterol because it inversely tracks with cardiovascular events.", // source: Lipid deck slide 4
    scene: "pharmacology",
    sceneCfg: { label: "HDL PROTECTIVE" },
    metadata: { topic: "LDL versus HDL", priority: "medium" },
  },

  {
    id: "ap1-w5l-005",
    type: "mcq",
    prompt: "Which organ synthesizes and secretes VLDL into the bloodstream?",
    setup: "",
    ans: [
      { t: "Liver", ok: true },
      { t: "Small intestine", ok: false },
      { t: "Adipose tissue", ok: false },
      { t: "Vascular endothelium", ok: false },
    ],
    rationale: "Hepatocytes assemble cholesterol, lipids, and proteins into triglyceride-rich VLDL and secrete it into plasma, where it is later remodeled into IDL and LDL. The intestine makes chylomicrons, adipose stores fat, and endothelium hosts LPL but does not make VLDL. Pearl: VLDL, IDL, and LDL all originate from the liver in the endogenous pathway.", // source: Lipid deck slide 5
    scene: "pharmacology",
    sceneCfg: { label: "HEPATIC VLDL" },
    metadata: { topic: "Endogenous pathway", priority: "high" },
  },

  {
    id: "ap1-w5l-006",
    type: "mcq",
    prompt: "Endothelial lipoprotein lipase acts on circulating VLDL primarily to do what?",
    setup: "",
    ans: [
      { t: "Hydrolyze triglyceride", ok: true },
      { t: "Esterify the cholesterol", ok: false },
      { t: "Attach apoprotein B to it", ok: false },
      { t: "Oxidize its phospholipid", ok: false },
    ],
    rationale: "LPL on the capillary endothelium hydrolyzes the triglyceride core of VLDL, releasing free fatty acids to tissues and shrinking the particle into IDL and then LDL. It does not esterify cholesterol or add apolipoproteins. Pearl: LPL strips triglyceride, converting VLDL to IDL to LDL.", // source: Lipid deck slide 5
    scene: "pharmacology",
    sceneCfg: { label: "LPL HYDROLYSIS" },
    metadata: { topic: "LPL processing", priority: "high" },
  },

  {
    id: "ap1-w5l-007",
    type: "mcq",
    prompt: "As lipoprotein lipase removes triglyceride from VLDL, the particle is converted in which sequence?",
    setup: "",
    ans: [
      { t: "VLDL to IDL to LDL", ok: true },
      { t: "VLDL to LDL to IDL", ok: false },
      { t: "LDL to IDL to VLDL", ok: false },
      { t: "VLDL to HDL to LDL", ok: false },
    ],
    rationale: "Triglyceride hydrolysis by LPL shrinks VLDL into intermediate-density IDL, which is further processed into cholesterol-rich LDL. IDL is the obligate intermediate, and HDL is a separate particle not formed in this chain. Pearl: the endogenous chain runs VLDL to IDL to LDL.", // source: Lipid deck slide 5
    scene: "pharmacology",
    sceneCfg: { label: "VLDL IDL LDL" },
    metadata: { topic: "LPL processing", priority: "medium" },
  },

  {
    id: "ap1-w5l-008",
    type: "mcq",
    prompt: "Plasma LDL is cleared from the circulation mainly by which mechanism?",
    setup: "",
    ans: [
      { t: "Hepatic LDL receptors", ok: true },
      { t: "Renal glomerular filtration", ok: false },
      { t: "Splenic macrophage uptake", ok: false },
      { t: "Biliary direct secretion", ok: false },
    ],
    rationale: "LDL receptors on hepatocytes bind and internalize LDL, making them the principal route for removing LDL cholesterol from plasma. LDL is not filtered by the kidney, and splenic or direct biliary clearance is not the main pathway. Pearl: upregulating hepatic LDL receptors is how statins and many agents lower plasma LDL.", // source: Lipid deck slide 5
    scene: "pharmacology",
    sceneCfg: { label: "LDL RECEPTOR" },
    metadata: { topic: "LDL receptor clearance", priority: "high" },
  },

  {
    id: "ap1-w5l-009",
    type: "mcq",
    prompt: "Reverse cholesterol transport describes the movement of cholesterol in which direction?",
    setup: "",
    ans: [
      { t: "Tissues to liver via HDL", ok: true },
      { t: "Liver to tissues via LDL", ok: false },
      { t: "Gut to tissues via VLDL", ok: false },
      { t: "Liver to gut via IDL", ok: false },
    ],
    rationale: "In reverse cholesterol transport, HDL collects excess cholesterol from peripheral tissues and delivers it to the liver for excretion in bile. LDL moves cholesterol outward toward tissues, the opposite direction. Pearl: HDL carries cholesterol from the periphery back to the liver, which is why it is protective.", // source: Lipid deck slide 5
    scene: "pharmacology",
    sceneCfg: { label: "REVERSE TRANSPORT" },
    metadata: { topic: "Reverse cholesterol transport", priority: "high" },
  },

  {
    id: "ap1-w5l-010",
    type: "mcq",
    prompt: "After HDL returns excess cholesterol to the liver, how is that cholesterol primarily eliminated?",
    setup: "",
    ans: [
      { t: "Excreted in the bile", ok: true },
      { t: "Exhaled by the lungs", ok: false },
      { t: "Filtered into the urine", ok: false },
      { t: "Stored in adipocytes", ok: false },
    ],
    rationale: "The liver disposes of cholesterol delivered by HDL by excreting it into bile, either as cholesterol or after conversion to bile acids. Cholesterol is not meaningfully cleared by lungs, kidney, or fat storage. Pearl: biliary excretion is the body's main exit route for cholesterol.", // source: Lipid deck slide 5
    scene: "pharmacology",
    sceneCfg: { label: "BILIARY EXCRETION" },
    metadata: { topic: "Reverse cholesterol transport", priority: "medium" },
  },

  {
    id: "ap1-w5l-011",
    type: "mcq",
    prompt: "Which description correctly pairs a cholesterol transport pathway with its starting point?",
    setup: "",
    ans: [
      { t: "Exogenous begins in gut", ok: true },
      { t: "Exogenous begins in liver", ok: false },
      { t: "Endogenous begins in the gut", ok: false },
      { t: "Endogenous begins in fat", ok: false },
    ],
    rationale: "The exogenous pathway starts with dietary fat in the gut packaged as chylomicrons, whereas the endogenous pathway starts in the liver with VLDL. Both ultimately route remnants back to the liver. Pearl: exogenous equals dietary and gut-derived, endogenous equals hepatic-derived.", // source: Lipid deck slide 6
    scene: "pharmacology",
    sceneCfg: { label: "PATHWAY ORIGINS" },
    metadata: { topic: "Pathway overview", priority: "medium" },
  },

  {
    id: "ap1-w5l-012",
    type: "mcq",
    prompt: "In the exogenous pathway, dietary triglyceride is first digested by which combination before absorption?",
    setup: "",
    ans: [
      { t: "Bile and pancreatic lipase", ok: true },
      { t: "Gastric acid plus pepsin enzyme", ok: false },
      { t: "Hepatic LPL and apoB", ok: false },
      { t: "Brush-border NPC1L1 only", ok: false },
    ],
    rationale: "Bile emulsifies dietary fat and pancreatic lipase hydrolyzes triglyceride so enterocytes can absorb it and assemble chylomicrons. Gastric acid and pepsin handle protein, and LPL acts later on circulating particles. Pearl: bile plus pancreatic lipase digest dietary triglyceride at the start of the exogenous pathway.", // source: Lipid deck slide 7
    scene: "pharmacology",
    sceneCfg: { label: "DIETARY FAT DIGESTION" },
    metadata: { topic: "Exogenous pathway", priority: "medium" },
  },

  {
    id: "ap1-w5l-013",
    type: "mcq",
    prompt: "Newly assembled chylomicrons enter the circulation by which route before reaching tissues?",
    setup: "",
    ans: [
      { t: "Thoracic duct lymphatics", ok: true },
      { t: "Hepatic portal venous system", ok: false },
      { t: "Splenic venous sinuses", ok: false },
      { t: "Pulmonary capillary bed", ok: false },
    ],
    rationale: "Enterocytes release chylomicrons into intestinal lymph, which drains through the thoracic duct into the systemic circulation, bypassing the portal vein. Endothelial LPL then hydrolyzes their triglyceride, delivering free fatty acids to tissues and returning remnants to the liver. Pearl: chylomicrons take the lymphatic thoracic duct route, not the portal vein.", // source: Lipid deck slide 7
    scene: "pharmacology",
    sceneCfg: { label: "THORACIC DUCT" },
    metadata: { topic: "Exogenous pathway", priority: "medium" },
  },

  {
    id: "ap1-w5l-014",
    type: "mcq",
    prompt: "Why is VLDL described as triglyceride-rich when it leaves the liver in the endogenous pathway?",
    setup: "",
    ans: [
      { t: "It carries hepatic triglyceride", ok: true },
      { t: "It carries dietary triglyceride", ok: false },
      { t: "It is pure cholesterol ester", ok: false },
      { t: "It holds only free fatty acid", ok: false },
    ],
    rationale: "VLDL is loaded by the liver with endogenously made triglyceride, so it leaves triglyceride-rich and becomes progressively cholesterol-rich as LPL strips that triglyceride toward LDL. Dietary triglyceride travels instead in chylomicrons via the exogenous pathway. Pearl: VLDL carries hepatic-source triglyceride, chylomicrons carry dietary triglyceride.", // source: Lipid deck slide 8
    scene: "pharmacology",
    sceneCfg: { label: "VLDL TRIGLYCERIDE" },
    metadata: { topic: "Endogenous pathway", priority: "medium" },
  },

  {
    id: "ap1-w5l-015",
    type: "mcq",
    prompt: "Under the ACC AHA framework, which patient is a recognized statin benefit group?",
    setup: "",
    ans: [
      { t: "Adult with established ASCVD", ok: true },
      { t: "Adult with isolated low HDL", ok: false },
      { t: "Adult with mild hypertension", ok: false },
      { t: "Adult with high fasting glucose", ok: false },
    ],
    rationale: "Established clinical ASCVD is one of the four major statin benefit groups, alongside LDL at or above 190, diabetes at age 40 to 75, and intermediate-to-high estimated risk at age 40 to 75. Isolated low HDL, mild hypertension, or impaired glucose alone are not the defining groups. Pearl: clinical ASCVD automatically places a patient in a statin benefit group.", // source: Lipid deck slide 10
    scene: "pharmacology",
    sceneCfg: { label: "ASCVD GROUP" },
    metadata: { topic: "Statin benefit groups", priority: "high" },
  },

  {
    id: "ap1-w5l-016",
    type: "mcq",
    prompt: "An LDL cholesterol at or above which threshold defines a statin benefit group and should prompt evaluation for familial hypercholesterolemia?",
    setup: "",
    ans: [
      { t: "190 mg per dL", ok: true },
      { t: "130 mg per dL", ok: false },
      { t: "100 mg per dL", ok: false },
      { t: "160 mg per dL", ok: false },
    ],
    rationale: "An LDL at or above 190 mg per dL is a standalone statin benefit group and is high enough to raise concern for familial hypercholesterolemia. Lower cutoffs such as 130 or 160 do not define this group. Pearl: LDL at or above 190 means statin therapy and a look for a genetic cause.", // source: Lipid deck slide 10
    scene: "pharmacology",
    sceneCfg: { label: "LDL 190 THRESHOLD" },
    metadata: { topic: "Statin benefit groups", priority: "high" },
  },

  {
    id: "ap1-w5l-017",
    type: "mcq",
    prompt: "For a patient aged 40 to 75 with diabetes, what does the ACC AHA framework recommend regarding statins?",
    setup: "",
    ans: [
      { t: "They qualify for a statin", ok: true },
      { t: "Statins should be avoided", ok: false },
      { t: "Defer until ASCVD occurs", ok: false },
      { t: "Only treat if HDL is low", ok: false },
    ],
    rationale: "Diabetes in the 40 to 75 age range is itself a statin benefit group, independent of whether overt ASCVD has occurred. Waiting for an event or requiring a low HDL is not the recommendation. Pearl: diabetes between ages 40 and 75 is a standalone reason to start a statin.", // source: Lipid deck slide 10
    scene: "pharmacology",
    sceneCfg: { label: "DIABETES GROUP" },
    metadata: { topic: "Statin benefit groups", priority: "medium" },
  },

  {
    id: "ap1-w5l-018",
    type: "mcq",
    prompt: "Familial hypercholesterolemia most directly results from a defect in which protein?",
    setup: "",
    ans: [
      { t: "LDL receptor", ok: true },
      { t: "Lipoprotein lipase", ok: false },
      { t: "Apolipoprotein A1", ok: false },
      { t: "NPC1L1 transporter", ok: false },
    ],
    rationale: "Familial hypercholesterolemia is classically caused by a defective LDL receptor, so LDL is not cleared and plasma levels rise markedly. LPL defects raise triglycerides instead, and apoA1 and NPC1L1 are not the classic cause. Pearl: a broken LDL receptor leaves LDL stranded in plasma, the hallmark of familial hypercholesterolemia.", // source: Lipid deck slide 11
    scene: "pharmacology",
    sceneCfg: { label: "FH LDL RECEPTOR" },
    metadata: { topic: "Familial hypercholesterolemia", priority: "high" },
  },

  {
    id: "ap1-w5l-019",
    type: "mcq",
    prompt: "Approximately how common is heterozygous familial hypercholesterolemia in the general population?",
    setup: "",
    ans: [
      { t: "About 1 in 500", ok: true },
      { t: "About 1 in 50", ok: false },
      { t: "About 1 in 5000", ok: false },
      { t: "About 1 in 50000", ok: false },
    ],
    rationale: "Heterozygous familial hypercholesterolemia affects roughly 1 in 500 people, making it a relatively common single-gene disorder. Estimates of 1 in 50 overstate and 1 in 5000 or rarer understate its prevalence. Pearl: heterozygous familial hypercholesterolemia runs about 1 in 500.", // source: Lipid deck slide 11
    scene: "pharmacology",
    sceneCfg: { label: "FH PREVALENCE" },
    metadata: { topic: "Familial hypercholesterolemia", priority: "medium" },
  },

  {
    id: "ap1-w5l-020",
    type: "mcq",
    prompt: "Which of the following is NOT a recognized secondary cause of hyperlipidemia?",
    setup: "",
    ans: [
      { t: "Hyperthyroidism", ok: true },
      { t: "Uncontrolled diabetes", ok: false },
      { t: "Hypothyroidism", ok: false },
      { t: "Glucocorticoid excess", ok: false },
    ],
    rationale: "It is hypothyroidism, not hyperthyroidism, that raises lipids, so hyperthyroidism is the exception here. Diabetes, hypothyroidism, glucocorticoid excess, obesity, alcohol, and hepatic or renal disease are all recognized secondary contributors. Pearl: low thyroid, not high thyroid, drives secondary hyperlipidemia.", // source: Lipid deck slide 11
    scene: "pharmacology",
    sceneCfg: { label: "SECONDARY CAUSES" },
    metadata: { topic: "Secondary hyperlipidemia", priority: "medium" },
  },

  {
    id: "ap1-w5l-021",
    type: "mcq",
    prompt: "Large cholesterol treatment meta-analyses support which principle for LDL cholesterol management?",
    setup: "",
    ans: [
      { t: "Lower LDL is better", ok: true },
      { t: "A higher LDL is better", ok: false },
      { t: "A mid-range LDL is best", ok: false },
      { t: "The LDL level is irrelevant", ok: false },
    ],
    rationale: "Pooled meta-analyses from the Cholesterol Treatment Trialists found that the greater the absolute reduction in LDL, the greater the reduction in cardiovascular events, summarized as lower is better. There is no demonstrated benefit to keeping LDL higher or merely mid-range, and LDL is far from irrelevant. Pearl: across trials, driving LDL lower yields proportionally fewer cardiovascular events.", // source: Lipid deck slide 11
    scene: "pharmacology",
    sceneCfg: { label: "LOWER IS BETTER" },
    metadata: { topic: "Lower is better principle", priority: "medium" },
  },

  {
    id: "ap1-w5l-022",
    type: "mcq",
    prompt: "By which action do statins lower plasma LDL?",
    setup: "",
    ans: [
      { t: "Competitive HMG-CoA block", ok: true },
      { t: "Bind circulating LDL particles", ok: false },
      { t: "Block intestinal NPC1L1 uptake", ok: false },
      { t: "Activate peripheral PPAR alpha", ok: false },
    ],
    rationale: "Statins competitively inhibit HMG-CoA reductase, the rate-limiting enzyme of hepatic cholesterol synthesis; the resulting fall in intracellular cholesterol upregulates LDL receptors and increases LDL clearance from plasma. They do not bind LDL particles directly, do not act on the intestinal NPC1L1 transporter (that is ezetimibe), and do not activate PPAR alpha (that is fibrates). Pearl: statins work upstream by starving the hepatocyte of cholesterol so it pulls more LDL from blood.", // source: Lipid deck slide 12
    scene: "pharmacology",
    sceneCfg: { label: "HMG-COA BLOCK" },
    metadata: { topic: "Statin mechanism", priority: "high" },
  },

  {
    id: "ap1-w5l-023",
    type: "mcq",
    prompt: "Statin inhibition of HMG-CoA reductase most directly triggers which hepatic change?",
    setup: "",
    ans: [
      { t: "Upregulated LDL receptors", ok: true },
      { t: "Reduced bile acid synthesis", ok: false },
      { t: "Increased VLDL secretion", ok: false },
      { t: "Suppressed LDL receptors", ok: false },
    ],
    rationale: "Lower intracellular cholesterol from blocked synthesis upregulates, not suppresses, hepatic LDL receptors, which pull LDL out of plasma. Bile acid synthesis is not the driving step, and VLDL secretion is not increased by statins. Pearl: more LDL receptors equals more LDL clearance, the core of statin efficacy.", // source: Lipid deck slide 12
    scene: "pharmacology",
    sceneCfg: { label: "LDL RECEPTOR UP" },
    metadata: { topic: "Statin mechanism", priority: "medium" },
  },

  {
    id: "ap1-w5l-024",
    type: "mcq",
    prompt: "Which approximate lipid change best characterizes statin therapy?",
    setup: "",
    ans: [
      { t: "LDL down 20 to 60 percent", ok: true },
      { t: "TG fall of 40 to 50 percent", ok: false },
      { t: "HDL rise of 20 to 30 percent", ok: false },
      { t: "LDL down 8 to 22 percent", ok: false },
    ],
    rationale: "Statins lower LDL roughly 20 to 60 percent, their dominant effect, with only modest HDL rise near 10 percent and TG reduction of about 10 to 20 percent. A 40 to 50 percent TG drop describes fibrates, a 20 to 30 percent HDL rise describes niacin, and an 8 to 22 percent LDL drop describes ezetimibe monotherapy. Pearl: statins are first and foremost powerful LDL-lowering agents.", // source: Lipid deck slide 12
    scene: "pharmacology",
    sceneCfg: { label: "LDL DROP RANGE" },
    metadata: { topic: "Statin lipid effects", priority: "high" },
  },

  {
    id: "ap1-w5l-025",
    type: "mcq",
    prompt: "Which statin effect on HDL and triglycerides is expected?",
    setup: "",
    ans: [
      { t: "HDL up about 10 percent", ok: true },
      { t: "HDL up about 30 percent", ok: false },
      { t: "TG down about 45 percent", ok: false },
      { t: "TG unchanged from baseline", ok: false },
    ],
    rationale: "Statins raise HDL only modestly, on the order of 10 percent, and lower triglycerides about 10 to 20 percent, so neither a 30 percent HDL rise nor a 45 percent TG fall applies, and TG do change. Larger HDL gains belong to niacin and larger TG drops to fibrates. Pearl: statins nudge HDL and TG but their headline action is LDL.", // source: Lipid deck slide 12
    scene: "pharmacology",
    sceneCfg: { label: "HDL TG SHIFT" },
    metadata: { topic: "Statin lipid effects", priority: "medium" },
  },

  {
    id: "ap1-w5l-026",
    type: "mcq",
    prompt: "Which two statins provide the most potent LDL lowering?",
    setup: "",
    ans: [
      { t: "Atorvastatin, rosuvastatin", ok: true },
      { t: "Pravastatin, fluvastatin", ok: false },
      { t: "Lovastatin, simvastatin", ok: false },
      { t: "Fluvastatin and pitavastatin", ok: false },
    ],
    rationale: "Atorvastatin and rosuvastatin achieve the greatest LDL reductions of the class. Pravastatin and fluvastatin are lower-intensity, lovastatin and simvastatin are prodrugs of moderate potency, and pitavastatin is also not in the top potency tier. Pearl: reach for atorvastatin or rosuvastatin when large LDL reductions are required.", // source: Lipid deck slide 13
    scene: "pharmacology",
    sceneCfg: { label: "MOST POTENT" },
    metadata: { topic: "Statin agents", priority: "high" },
  },

  {
    id: "ap1-w5l-027",
    type: "mcq",
    prompt: "Which statin undergoes minimal hepatic metabolism and is cleared renally?",
    setup: "",
    ans: [
      { t: "Pravastatin is the agent", ok: true },
      { t: "Simvastatin is the agent", ok: false },
      { t: "Atorvastatin is the agent", ok: false },
      { t: "Lovastatin is the agent", ok: false },
    ],
    rationale: "Pravastatin is not significantly metabolized by the liver and relies on renal clearance, which makes it attractive when CYP-mediated interactions are a concern. Simvastatin and lovastatin are prodrugs needing hepatic activation and are CYP3A4 substrates, and atorvastatin is also CYP3A4 metabolized. Pearl: pravastatin sidesteps CYP3A4, a useful trait in polypharmacy.", // source: Lipid deck slide 13
    scene: "pharmacology",
    sceneCfg: { label: "RENAL CLEARED" },
    metadata: { topic: "Statin agents", priority: "medium" },
  },

  {
    id: "ap1-w5l-028",
    type: "mcq",
    prompt: "Which statins are prodrugs requiring hepatic activation?",
    setup: "",
    ans: [
      { t: "Lovastatin and simvastatin", ok: true },
      { t: "Rosuvastatin and pravastatin", ok: false },
      { t: "Atorvastatin and fluvastatin", ok: false },
      { t: "Pravastatin and pitavastatin", ok: false },
    ],
    rationale: "Lovastatin and simvastatin are administered as inactive lactone prodrugs that must be activated in the liver. Rosuvastatin, pravastatin, atorvastatin, fluvastatin, and pitavastatin are given in active form. Pearl: lovastatin and simvastatin are the classic statin prodrugs.", // source: Lipid deck slide 13
    scene: "pharmacology",
    sceneCfg: { label: "STATIN PRODRUGS" },
    metadata: { topic: "Statin agents", priority: "medium" },
  },

  {
    id: "ap1-w5l-029",
    type: "mcq",
    prompt: "A patient misses a single evening statin dose before surgery. The therapeutic effect persists mainly because:",
    setup: "",
    ans: [
      { t: "Effect lasts about 24 hours", ok: true },
      { t: "Plasma half-life exceeds 24 hours", ok: false },
      { t: "Active drug is protein bound", ok: false },
      { t: "Enterohepatic recycling refills it", ok: false },
    ],
    rationale: "The pharmacodynamic effect of statins lasts roughly 24 hours regardless of the often short plasma half-life, because the durable change is enzyme inhibition and LDL receptor upregulation rather than circulating drug level. Most statins do not have a half-life beyond 24 hours, and neither protein binding nor enterohepatic recycling explains the sustained effect. Pearl: one missed statin dose does not meaningfully lose effect.", // source: Lipid deck slide 13
    scene: "pharmacology",
    sceneCfg: { label: "24 HOUR EFFECT" },
    metadata: { topic: "Statin 24 hour effect", priority: "high" },
  },

  {
    id: "ap1-w5l-030",
    type: "mcq",
    prompt: "Which is a pleiotropic statin effect rather than direct LDL lowering?",
    setup: "",
    ans: [
      { t: "Stabilizing arterial plaque", ok: true },
      { t: "Increased LDL receptor density", ok: false },
      { t: "Reduced cholesterol synthesis", ok: false },
      { t: "Higher hepatic LDL clearance", ok: false },
    ],
    rationale: "Plaque stabilization is a pleiotropic benefit, alongside reduced vascular inflammation, antioxidant activity, and modest vasodilation, that is separate from the lipid-lowering pathway. Increased LDL receptor density, reduced cholesterol synthesis, and higher LDL clearance are all part of the direct cholesterol-lowering mechanism. Pearl: pleiotropic effects are vascular benefits beyond simply dropping LDL.", // source: Lipid deck slide 14
    scene: "pharmacology",
    sceneCfg: { label: "PLEIOTROPIC EFFECT" },
    metadata: { topic: "Statin pleiotropic effects", priority: "high" },
  },

  {
    id: "ap1-w5l-031",
    type: "mcq",
    prompt: "Which statin action is LEAST accurately described as pleiotropic?",
    setup: "",
    ans: [
      { t: "Raising hepatic LDL receptors", ok: true },
      { t: "Reducing vascular inflammation", ok: false },
      { t: "Stabilizing existing plaques", ok: false },
      { t: "Producing modest vasodilation", ok: false },
    ],
    rationale: "Raising hepatic LDL receptors is the core lipid-lowering mechanism, not a pleiotropic effect. Reducing vascular inflammation, stabilizing plaques, and modest vasodilation are the classic pleiotropic actions thought to contribute to perioperative benefit. Pearl: pleiotropic equals the extra vascular effects, not the LDL receptor pathway.", // source: Lipid deck slide 14
    scene: "pharmacology",
    sceneCfg: { label: "NOT PLEIOTROPIC" },
    metadata: { topic: "Statin pleiotropic effects", priority: "medium" },
  },

  {
    id: "ap1-w5l-032",
    type: "mcq",
    prompt: "Statin muscle toxicity is attributed to depletion of which molecule?",
    setup: "",
    ans: [
      { t: "Ubiquinone, that is CoQ10", ok: true },
      { t: "Creatine kinase in myocytes", ok: false },
      { t: "Carnitine for fat transport", ok: false },
      { t: "Myoglobin within muscle", ok: false },
    ],
    rationale: "By blocking the mevalonate pathway, statins reduce ubiquinone (CoQ10) synthesis, impairing mitochondrial energy production in muscle and producing the myopathy spectrum. Creatine kinase is a marker released during injury rather than the depleted cause, and neither carnitine nor myoglobin is the implicated molecule. Pearl: less CoQ10 means stressed muscle mitochondria.", // source: Lipid deck slide 15
    scene: "pharmacology",
    sceneCfg: { label: "COQ10 DEPLETION" },
    metadata: { topic: "Statin muscle effects", priority: "high" },
  },

  {
    id: "ap1-w5l-033",
    type: "mcq",
    prompt: "Which sequence orders statin muscle effects from most to least common?",
    setup: "",
    ans: [
      { t: "Myalgia, myositis, rhabdomyolysis", ok: true },
      { t: "Rhabdomyolysis, myositis, myalgia", ok: false },
      { t: "Myositis, myalgia, rhabdomyolysis", ok: false },
      { t: "Rhabdomyolysis, myalgia, myositis", ok: false },
    ],
    rationale: "Myalgias are common, myositis with mild creatine kinase rise is rare, and rhabdomyolysis is very rare, so frequency runs myalgia then myositis then rhabdomyolysis. The other orderings misplace the very rare and rare entities ahead of simple muscle aches. Pearl: aches are frequent, frank rhabdomyolysis is exceptional.", // source: Lipid deck slide 15
    scene: "pharmacology",
    sceneCfg: { label: "MUSCLE SPECTRUM" },
    metadata: { topic: "Statin muscle effects", priority: "medium" },
  },

  {
    id: "ap1-w5l-034",
    type: "mcq",
    prompt: "Which patient feature LEAST increases statin myopathy risk?",
    setup: "",
    ans: [
      { t: "Male sex and high BMI", ok: true },
      { t: "Age over 80 years", ok: false },
      { t: "Uncontrolled hypothyroidism", ok: false },
      { t: "SLCO1B1 polymorphism", ok: false },
    ],
    rationale: "Risk rises with female sex and low BMI, so male sex with high BMI is the least risky profile of these. Advanced age over 80, uncontrolled hypothyroidism, and SLCO1B1 polymorphisms all elevate myopathy risk, along with Asian ethnicity, renal or hepatic failure, low vitamin D, diabetes, and neuromuscular disease. Pearl: small, older, hypothyroid, or SLCO1B1-variant patients are the vulnerable ones.", // source: Lipid deck slide 16
    scene: "pharmacology",
    sceneCfg: { label: "LEAST RISK" },
    metadata: { topic: "Statin myopathy risk", priority: "high" },
  },

  {
    id: "ap1-w5l-035",
    type: "mcq",
    prompt: "Which genetic factor specifically raises statin myopathy susceptibility?",
    setup: "",
    ans: [
      { t: "SLCO1B1 uptake variant", ok: true },
      { t: "CYP2D6 poor metabolizer", ok: false },
      { t: "HLA B5701 positive status", ok: false },
      { t: "Factor V Leiden mutation", ok: false },
    ],
    rationale: "SLCO1B1 polymorphisms impair hepatic statin uptake, raising systemic exposure and myopathy risk. CYP2D6 status, HLA B5701, and Factor V Leiden relate to other drug responses and thrombosis, not statin muscle injury. Pearl: SLCO1B1 is the pharmacogenetic flag for statin muscle trouble.", // source: Lipid deck slide 16
    scene: "pharmacology",
    sceneCfg: { label: "SLCO1B1 GENE" },
    metadata: { topic: "Statin myopathy risk", priority: "medium" },
  },

  {
    id: "ap1-w5l-036",
    type: "mcq",
    prompt: "Which comedication is most likely to raise simvastatin levels via CYP3A4?",
    setup: "",
    ans: [
      { t: "Clarithromycin macrolide", ok: true },
      { t: "Rifampin enzyme inducer", ok: false },
      { t: "Metformin oral agent", ok: false },
      { t: "Lisinopril ACE inhibitor", ok: false },
    ],
    rationale: "Clarithromycin is a potent CYP3A4 inhibitor that raises levels of CYP3A4-metabolized statins such as simvastatin, atorvastatin, and lovastatin, increasing myopathy risk. Rifampin induces CYP3A4 and would lower statin levels, while metformin and lisinopril are not significant CYP3A4 inhibitors. Pearl: macrolides plus a CYP3A4 statin is a classic dangerous pairing.", // source: Lipid deck slide 17
    scene: "pharmacology",
    sceneCfg: { label: "CYP3A4 INHIBITOR" },
    metadata: { topic: "Statin CYP3A4 interactions", priority: "high" },
  },

  {
    id: "ap1-w5l-037",
    type: "mcq",
    prompt: "For a patient needing chronic CYP3A4 inhibitors, which statin is preferred?",
    setup: "",
    ans: [
      { t: "Pravastatin over simvastatin", ok: true },
      { t: "Simvastatin at a higher dose", ok: false },
      { t: "Lovastatin with grapefruit", ok: false },
      { t: "Atorvastatin plus a macrolide", ok: false },
    ],
    rationale: "Switching to pravastatin, fluvastatin, or pitavastatin avoids the CYP3A4 pathway and lowers interaction risk. Higher-dose simvastatin, lovastatin with grapefruit juice, and atorvastatin plus a macrolide all increase exposure of CYP3A4-dependent statins and the chance of myopathy. Pearl: in CYP3A4-heavy regimens, pick a CYP3A4-sparing statin.", // source: Lipid deck slide 17
    scene: "pharmacology",
    sceneCfg: { label: "SAFER SWITCH" },
    metadata: { topic: "Statin CYP3A4 interactions", priority: "medium" },
  },

  {
    id: "ap1-w5l-038",
    type: "mcq",
    prompt: "At which creatine kinase level should a statin be discontinued?",
    setup: "",
    ans: [
      { t: "Above 10 times the ULN", ok: true },
      { t: "Above 2 times the ULN", ok: false },
      { t: "Above 3 times the ULN", ok: false },
      { t: "Any value over the ULN", ok: false },
    ],
    rationale: "A creatine kinase above 10 times the upper limit of normal warrants stopping the statin, reflecting significant muscle injury. Thresholds of 2 or 3 times or any elevation above normal are too low and would halt therapy unnecessarily, though the 3 times threshold applies to transaminases instead. Pearl: CK over 10 times ULN is the muscle stop line.", // source: Lipid deck slide 18
    scene: "pharmacology",
    sceneCfg: { label: "CK STOP LINE" },
    metadata: { topic: "Statin discontinuation", priority: "high" },
  },

  {
    id: "ap1-w5l-039",
    type: "mcq",
    prompt: "Statin-related transaminitis severe enough to discontinue is defined as AST or ALT above what level?",
    setup: "",
    ans: [
      { t: "Over 3 times the limit", ok: true },
      { t: "Over 10 times the limit", ok: false },
      { t: "Over 2 times the limit", ok: false },
      { t: "Any rise above the limit", ok: false },
    ],
    rationale: "AST or ALT greater than 3 times the upper limit of normal is the hepatic threshold for discontinuation; transaminitis typically appears in the first 3 months and progression to liver failure is extremely rare. The 10 times cutoff is the creatine kinase muscle threshold, while 2 times or any elevation is too sensitive for stopping. Pearl: transaminases over 3 times ULN is the liver stop line, distinct from CK over 10 times.", // source: Lipid deck slide 18
    scene: "pharmacology",
    sceneCfg: { label: "LIVER STOP LINE" },
    metadata: { topic: "Statin discontinuation", priority: "medium" },
  },

  {
    id: "ap1-w5l-040",
    type: "mcq",
    prompt: "What is the recommended perioperative handling of a patient's statin?",
    setup: "",
    ans: [
      { t: "Continue through the surgery", ok: true },
      { t: "Hold five days preoperatively", ok: false },
      { t: "Stop on the morning of surgery", ok: false },
      { t: "Switch to an IV formulation", ok: false },
    ],
    rationale: "Statins should be continued through the perioperative period because observational data link continuation to fewer complications and the pleiotropic vascular benefits persist. Holding for days, stopping the morning of surgery, or switching to an IV form is unnecessary and may forfeit benefit. Pearl: keep statins on board around surgery.", // source: Lipid deck slide 19
    scene: "pharmacology",
    sceneCfg: { label: "CONTINUE PERIOP" },
    metadata: { topic: "Statin perioperative pearls", priority: "high" },
  },

  {
    id: "ap1-w5l-041",
    type: "mcq",
    prompt: "A postoperative patient on simvastatin has an unexplained creatine kinase rise. The best first question is:",
    setup: "",
    ans: [
      { t: "Any new CYP3A4 inhibitor added?", ok: true },
      { t: "Did succinylcholine get given?", ok: false },
      { t: "Was a volatile agent used?", ok: false },
      { t: "Has the statin been stopped long?", ok: false },
    ],
    rationale: "An unexplained perioperative creatine kinase rise on a CYP3A4-metabolized statin should prompt asking about a newly added CYP3A4 inhibitor that could have raised statin levels. Succinylcholine and volatile anesthetics do not increase statin myopathy, and a recently stopped statin would not be the culprit. Pearl: new CK rise plus a CYP3A4 statin equals hunt for an interacting inhibitor.", // source: Lipid deck slide 19
    scene: "pharmacology",
    sceneCfg: { label: "CK RISE WORKUP" },
    metadata: { topic: "Statin perioperative pearls", priority: "high" },
  },

  {
    id: "ap1-w5l-042",
    type: "mcq",
    prompt: "Which statement about statins and anesthesia is correct?",
    setup: "",
    ans: [
      { t: "Succinylcholine adds no myopathy", ok: true },
      { t: "Statins are safe in pregnancy", ok: false },
      { t: "One missed dose ends effect", ok: false },
      { t: "Volatiles trigger rhabdomyolysis", ok: false },
    ],
    rationale: "Anesthetic agents including succinylcholine do not increase statin myopathy, so co-administration is not a concern for muscle injury. Statins are teratogenic and must be avoided in pregnancy, a single missed oral dose does not lose effect given the 24 hour pharmacodynamics, and volatiles do not trigger statin rhabdomyolysis. Pearl: succinylcholine is fine with statins, but statins are off limits in pregnancy.", // source: Lipid deck slide 19
    scene: "pharmacology",
    sceneCfg: { label: "ANESTHESIA SAFETY" },
    metadata: { topic: "Statin perioperative pearls", priority: "medium" },
  },

  {
    id: "ap1-w5l-043",
    type: "mcq",
    prompt: "How do the monoclonal antibodies evolocumab and alirocumab lower LDL cholesterol?",
    setup: "",
    ans: [
      { t: "Bind PCSK9, sparing LDL receptors", ok: true },
      { t: "Block HMG-CoA reductase strongly", ok: false },
      { t: "Sequester gut bile acids tightly", ok: false },
      { t: "Inhibit intestinal NPC1L1 transport", ok: false },
    ],
    rationale: "PCSK9 normally marks hepatic LDL receptors for degradation; antibodies that bind circulating PCSK9 preserve those receptors so more LDL is cleared from plasma. Statins act on HMG-CoA reductase, resins bind bile acids, and ezetimibe blocks NPC1L1, so those mechanisms are wrong. Pearl: PCSK9 inhibitors work by rescuing LDL receptors from destruction.", // source: Lipid deck slide 20
    scene: "pharmacology",
    sceneCfg: { label: "PCSK9 MECHANISM" },
    metadata: { topic: "PCSK9 inhibitors", priority: "high" },
  },

  {
    id: "ap1-w5l-044",
    type: "mcq",
    prompt: "Which lipid-lowering class produces the single largest reduction in LDL cholesterol?",
    setup: "",
    ans: [
      { t: "PCSK9 inhibitors", ok: true },
      { t: "Bile acid resins", ok: false },
      { t: "Fibrate derivatives", ok: false },
      { t: "Nicotinic acid", ok: false },
    ],
    rationale: "PCSK9 inhibitors lower LDL by roughly 38 to 72 percent, exceeding any other class including high-intensity statins. Resins drop LDL about 15 to 30 percent, fibrates have a variable LDL effect, and niacin lowers LDL about 15 to 30 percent. Pearl: PCSK9 inhibitors give the deepest LDL reduction available.", // source: Lipid deck slide 20
    scene: "pharmacology",
    sceneCfg: { label: "LARGEST LDL DROP" },
    metadata: { topic: "PCSK9 inhibitors", priority: "high" },
  },

  {
    id: "ap1-w5l-045",
    type: "mcq",
    prompt: "How are PCSK9 inhibitors such as evolocumab typically administered?",
    setup: "",
    ans: [
      { t: "Subcutaneously every two weeks", ok: true },
      { t: "Orally once every single morning", ok: false },
      { t: "Intravenously every six hours", ok: false },
      { t: "Sublingually before each meal", ok: false },
    ],
    rationale: "Because they are monoclonal antibodies, PCSK9 inhibitors cannot be given orally and are injected subcutaneously about every two weeks. Daily oral, frequent IV, and sublingual dosing do not apply to these large protein agents. Pearl: PCSK9 inhibitors are injectable biologics, not pills.", // source: Lipid deck slide 20
    scene: "pharmacology",
    sceneCfg: { label: "PCSK9 DOSING" },
    metadata: { topic: "PCSK9 inhibitors", priority: "medium" },
  },

  {
    id: "ap1-w5l-046",
    type: "mcq",
    prompt: "In a post-acute coronary syndrome patient, which trial showed alirocumab reduced major cardiac events and all-cause mortality?",
    setup: "",
    ans: [
      { t: "ODYSSEY OUTCOMES", ok: true },
      { t: "FOURIER evolocumab", ok: false },
      { t: "IMPROVE-IT simvastatin", ok: false },
      { t: "Cholesterol Trialists set", ok: false },
    ],
    rationale: "ODYSSEY OUTCOMES studied alirocumab after acute coronary syndrome and showed reduced major adverse events plus a mortality signal. FOURIER tested evolocumab and lowered events but is a different agent, IMPROVE-IT studied ezetimibe added to simvastatin, and the Trialists meta-analyses addressed statins broadly. Pearl: ODYSSEY OUTCOMES links alirocumab after ACS to fewer events and lower mortality.", // source: Lipid deck slide 21
    scene: "pharmacology",
    sceneCfg: { label: "ODYSSEY OUTCOMES" },
    metadata: { topic: "PCSK9 trials", priority: "medium" },
  },

  {
    id: "ap1-w5l-047",
    type: "mcq",
    prompt: "Which patient is the BEST candidate for adding a PCSK9 inhibitor?",
    setup: "",
    ans: [
      { t: "ASCVD on max statin, LDL high", ok: true },
      { t: "Isolated severe triglyceride rise", ok: false },
      { t: "Mild LDL, no risk factors", ok: false },
      { t: "Pure low HDL, normal LDL", ok: false },
    ],
    rationale: "PCSK9 inhibitors are indicated for established ASCVD on maximally tolerated statin therapy, familial hypercholesterolemia, and statin intolerance. They are not triglyceride drugs, are not used for low-risk mild LDL, and do not target isolated low HDL. Pearl: reserve PCSK9 inhibitors for high-risk patients who need more LDL lowering beyond statins.", // source: Lipid deck slide 21
    scene: "pharmacology",
    sceneCfg: { label: "PCSK9 INDICATION" },
    metadata: { topic: "PCSK9 inhibitors", priority: "medium" },
  },

  {
    id: "ap1-w5l-048",
    type: "mcq",
    prompt: "Bile acid resins lower LDL cholesterol primarily by which downstream mechanism?",
    setup: "",
    ans: [
      { t: "Upregulating hepatic LDL receptors", ok: true },
      { t: "Blocking cholesterol synthesis enzyme", ok: false },
      { t: "Degrading circulating PCSK9 protein", ok: false },
      { t: "Raising lipoprotein lipase output", ok: false },
    ],
    rationale: "Resins bind bile acids in the gut and interrupt enterohepatic recirculation, so the liver consumes cholesterol to make new bile salts and upregulates LDL receptors, lowering plasma LDL. They do not inhibit HMG-CoA reductase, do not degrade PCSK9, and do not act through lipoprotein lipase. Pearl: diverting cholesterol into bile acid synthesis drives LDL receptor upregulation.", // source: Lipid deck slide 22
    scene: "pharmacology",
    sceneCfg: { label: "RESIN MECHANISM" },
    metadata: { topic: "Bile acid resins", priority: "high" },
  },

  {
    id: "ap1-w5l-049",
    type: "mcq",
    prompt: "Which change in the lipid panel is most expected with bile acid resin therapy?",
    setup: "",
    ans: [
      { t: "Triglycerides may rise modestly", ok: true },
      { t: "Triglycerides drop by nearly half", ok: false },
      { t: "HDL climbs higher than niacin", ok: false },
      { t: "LDL is left entirely unchanged", ok: false },
    ],
    rationale: "Resins lower LDL roughly 15 to 30 percent but tend to raise triglycerides about 5 to 20 percent, which limits their use in hypertriglyceridemia. They do not halve triglycerides, do not raise HDL more than niacin, and clearly do change LDL. Pearl: resins drop LDL but can nudge triglycerides upward.", // source: Lipid deck slide 22
    scene: "pharmacology",
    sceneCfg: { label: "RESIN LIPID EFFECT" },
    metadata: { topic: "Bile acid resins", priority: "medium" },
  },

  {
    id: "ap1-w5l-050",
    type: "mcq",
    prompt: "What is the most common dose-limiting side effect of bile acid resins?",
    setup: "",
    ans: [
      { t: "Constipation", ok: true },
      { t: "Cutaneous flushing", ok: false },
      { t: "Skeletal myopathy", ok: false },
      { t: "Symptomatic gallstones", ok: false },
    ],
    rationale: "Constipation is the number one factor limiting resin use, along with bloating and poor palatability. Flushing belongs to niacin, myopathy to statins and gemfibrozil, and gallstones to fibrates. Pearl: constipation is the chief reason patients stop bile acid resins.", // source: Lipid deck slide 23
    scene: "pharmacology",
    sceneCfg: { label: "RESIN CONSTIPATION" },
    metadata: { topic: "Bile acid resins", priority: "high" },
  },

  {
    id: "ap1-w5l-051",
    type: "mcq",
    prompt: "How should oral medications such as digoxin or levothyroxine be timed relative to a bile acid resin?",
    setup: "",
    ans: [
      { t: "One hour before or four after", ok: true },
      { t: "Always alongside the resin dose", ok: false },
      { t: "Only at the very same moment", ok: false },
      { t: "Within ten minutes of resin", ok: false },
    ],
    rationale: "Resins bind many co-administered drugs and fat-soluble vitamins, so other medications should be given at least one hour before or at least four hours after the resin. Taking them together or within minutes would impair absorption of the partner drug. Pearl: separate other oral drugs from resins to protect their absorption.", // source: Lipid deck slide 23
    scene: "pharmacology",
    sceneCfg: { label: "RESIN DRUG TIMING" },
    metadata: { topic: "Bile acid resins", priority: "high" },
  },

  {
    id: "ap1-w5l-052",
    type: "mcq",
    prompt: "Which bile acid resin can produce hyperchloremic metabolic acidosis in some patients?",
    setup: "",
    ans: [
      { t: "Cholestyramine", ok: true },
      { t: "Colesevelam tablets", ok: false },
      { t: "Fenofibrate", ok: false },
      { t: "Ezetimibe", ok: false },
    ],
    rationale: "Cholestyramine is formulated as a chloride salt and can release chloride to cause a hyperchloremic acidosis in a small number of patients. Colesevelam is a resin but is not the classic culprit, while fenofibrate and ezetimibe are not resins at all. Pearl: the chloride form of cholestyramine can drive a hyperchloremic acidosis.", // source: Lipid deck slide 23
    scene: "pharmacology",
    sceneCfg: { label: "CHLORIDE ACIDOSIS" },
    metadata: { topic: "Bile acid resins", priority: "medium" },
  },

  {
    id: "ap1-w5l-053",
    type: "mcq",
    prompt: "Which agent raises HDL cholesterol the most among the lipid-lowering classes?",
    setup: "",
    ans: [
      { t: "Niacin", ok: true },
      { t: "Ezetimibe", ok: false },
      { t: "Cholestyramine", ok: false },
      { t: "Pravastatin", ok: false },
    ],
    rationale: "Niacin raises HDL roughly 20 to 30 percent, the strongest HDL effect of any class, while also lowering triglycerides and LDL. Ezetimibe has minimal HDL effect, resins do not meaningfully raise HDL, and statins raise it only about 5 to 10 percent. Pearl: niacin is the most potent HDL-raising agent.", // source: Lipid deck slide 24
    scene: "pharmacology",
    sceneCfg: { label: "NIACIN BEST HDL" },
    metadata: { topic: "Niacin", priority: "high" },
  },

  {
    id: "ap1-w5l-054",
    type: "mcq",
    prompt: "Niacin lowers VLDL and triglycerides chiefly through which action?",
    setup: "",
    ans: [
      { t: "Inhibiting hepatic VLDL synthesis", ok: true },
      { t: "Binding bile acids within the gut", ok: false },
      { t: "Activating PPAR-alpha receptors", ok: false },
      { t: "Preserving the LDL receptor pool", ok: false },
    ],
    rationale: "Niacin inhibits hepatic VLDL synthesis and adipocyte free fatty acid release while increasing lipoprotein lipase activity, lowering triglycerides. Bile acid binding describes resins, PPAR-alpha activation describes fibrates, and LDL receptor preservation describes PCSK9 inhibitors. Pearl: niacin cuts triglycerides by curbing hepatic VLDL production.", // source: Lipid deck slide 24
    scene: "pharmacology",
    sceneCfg: { label: "NIACIN MECHANISM" },
    metadata: { topic: "Niacin", priority: "medium" },
  },

  {
    id: "ap1-w5l-055",
    type: "mcq",
    prompt: "Cutaneous flushing from niacin is best prevented by pretreating with which drug?",
    setup: "",
    ans: [
      { t: "Aspirin before the dose", ok: true },
      { t: "Acetaminophen with the dose", ok: false },
      { t: "Diphenhydramine at bedtime", ok: false },
      { t: "Ondansetron before meals", ok: false },
    ],
    rationale: "Niacin flushing is prostaglandin-mediated, so aspirin given about 30 minutes before the dose blunts it, and alcohol should be avoided because it worsens flushing. Acetaminophen lacks the antiprostaglandin effect, and antihistamines or antiemetics do not target the prostaglandin pathway. Pearl: aspirin pretreatment tames prostaglandin-driven niacin flushing.", // source: Lipid deck slide 25
    scene: "pharmacology",
    sceneCfg: { label: "NIACIN FLUSH ASPIRIN" },
    metadata: { topic: "Niacin", priority: "high" },
  },

  {
    id: "ap1-w5l-056",
    type: "mcq",
    prompt: "All of the following are recognized adverse effects of niacin EXCEPT:",
    setup: "",
    ans: [
      { t: "Constipation as top complaint", ok: true },
      { t: "Hyperglycemia and glucose rise", ok: false },
      { t: "Hyperuricemia provoking gout", ok: false },
      { t: "Cutaneous prostaglandin flushing", ok: false },
    ],
    rationale: "Niacin causes flushing, hyperglycemia, hyperuricemia with gout flares, and hepatic dysfunction at high doses, but constipation is the hallmark of bile acid resins rather than niacin. Glucose intolerance, gout, and flushing are all genuine niacin effects. Pearl: think flushing, sugar, and uric acid with niacin, not constipation.", // source: Lipid deck slide 25
    scene: "pharmacology",
    sceneCfg: { label: "NIACIN ADVERSE" },
    metadata: { topic: "Niacin", priority: "medium" },
  },

  {
    id: "ap1-w5l-057",
    type: "mcq",
    prompt: "Fibrates such as gemfibrozil and fenofibrate lower triglycerides by activating which target?",
    setup: "",
    ans: [
      { t: "PPAR-alpha nuclear receptor", ok: true },
      { t: "NPC1L1 intestinal transporter", ok: false },
      { t: "HMG-CoA reductase enzyme", ok: false },
      { t: "Circulating PCSK9 protein", ok: false },
    ],
    rationale: "Fibrates activate PPAR-alpha, increasing lipoprotein lipase, fatty acid oxidation, and HDL synthesis, which lowers triglycerides by 40 to 50 percent. NPC1L1 is the ezetimibe target, HMG-CoA reductase is the statin target, and PCSK9 is the antibody target. Pearl: fibrates are PPAR-alpha agonists and the most potent triglyceride-lowering class.", // source: Lipid deck slide 26
    scene: "pharmacology",
    sceneCfg: { label: "FIBRATE PPAR ALPHA" },
    metadata: { topic: "Fibrates", priority: "high" },
  },

  {
    id: "ap1-w5l-058",
    type: "mcq",
    prompt: "For a patient with severe hypertriglyceridemia, which class lowers triglycerides the most?",
    setup: "",
    ans: [
      { t: "Fibrate derivatives", ok: true },
      { t: "Bile acid sequestrants", ok: false },
      { t: "Ezetimibe therapy", ok: false },
      { t: "PCSK9 inhibitors", ok: false },
    ],
    rationale: "Fibrates lower triglycerides about 40 to 50 percent, the greatest of any class, making them first choice for severe hypertriglyceridemia. Resins may even raise triglycerides, ezetimibe has minimal triglyceride effect, and PCSK9 inhibitors mainly cut LDL. Pearl: fibrates dominate triglyceride lowering and treat severe hypertriglyceridemia.", // source: Lipid deck slide 26
    scene: "pharmacology",
    sceneCfg: { label: "FIBRATE TG POTENT" },
    metadata: { topic: "Fibrates", priority: "high" },
  },

  {
    id: "ap1-w5l-059",
    type: "mcq",
    prompt: "Combining a statin with which fibrate most increases the risk of myopathy and rhabdomyolysis?",
    setup: "",
    ans: [
      { t: "Gemfibrozil", ok: true },
      { t: "Fenofibrate", ok: false },
      { t: "Ezetimibe", ok: false },
      { t: "Colesevelam", ok: false },
    ],
    rationale: "Gemfibrozil added to a statin sharply raises myopathy and rhabdomyolysis risk and is the fibrate to avoid with statins. Fenofibrate carries less of this interaction, while ezetimibe and colesevelam are not fibrates. Pearl: gemfibrozil plus a statin is the dangerous muscle-toxicity pairing.", // source: Lipid deck slide 27
    scene: "pharmacology",
    sceneCfg: { label: "GEMFIBROZIL MYOPATHY" },
    metadata: { topic: "Fibrates", priority: "high" },
  },

  {
    id: "ap1-w5l-060",
    type: "mcq",
    prompt: "A patient on warfarin starts gemfibrozil. What effect on coagulation should be anticipated?",
    setup: "",
    ans: [
      { t: "Higher INR from displacement", ok: true },
      { t: "Lower INR from enzyme induction", ok: false },
      { t: "No measurable change in INR", ok: false },
      { t: "Reduced bleeding tendency", ok: false },
    ],
    rationale: "Gemfibrozil displaces warfarin from albumin, raising free warfarin and the INR, which increases bleeding risk and warrants closer monitoring. It does not induce metabolism to lower the INR, does not leave coagulation unchanged, and does not reduce bleeding. Pearl: gemfibrozil potentiates warfarin and pushes the INR up.", // source: Lipid deck slide 27
    scene: "pharmacology",
    sceneCfg: { label: "GEMFIBROZIL WARFARIN" },
    metadata: { topic: "Fibrates", priority: "medium" },
  },

  {
    id: "ap1-w5l-061",
    type: "mcq",
    prompt: "Long-term gemfibrozil therapy predisposes to which complication by altering bile composition?",
    setup: "",
    ans: [
      { t: "Cholesterol gallstones", ok: true },
      { t: "Acute pancreatitis attacks", ok: false },
      { t: "Peptic ulceration", ok: false },
      { t: "Renal calculi", ok: false },
    ],
    rationale: "Gemfibrozil increases cholesterol content in bile, promoting cholesterol gallstone formation. It is not classically tied to pancreatitis, ulcers, or kidney stones through this mechanism. Pearl: fibrates raise biliary cholesterol and predispose to gallstones.", // source: Lipid deck slide 27
    scene: "pharmacology",
    sceneCfg: { label: "FIBRATE GALLSTONES" },
    metadata: { topic: "Fibrates", priority: "medium" },
  },

  {
    id: "ap1-w5l-062",
    type: "mcq",
    prompt: "After surgery, when is it appropriate to restart a fibrate such as gemfibrozil?",
    setup: "",
    ans: [
      { t: "When hydrated and tolerating PO", ok: true },
      { t: "Immediately in the recovery room", ok: false },
      { t: "Before any oral intake resumes", ok: false },
      { t: "Only after full wound healing", ok: false },
    ],
    rationale: "Fibrates should be resumed only once the patient is well-hydrated and tolerating oral intake, which limits myopathy and renal stress in the recovery period. Restarting immediately or before oral intake is premature, and waiting for complete wound healing is unnecessarily long. Pearl: hold fibrates postoperatively until the patient is hydrated and taking PO.", // source: Lipid deck slide 27
    scene: "pharmacology",
    sceneCfg: { label: "FIBRATE RESTART" },
    metadata: { topic: "Fibrates", priority: "medium" },
  },

  {
    id: "ap1-w5l-063",
    type: "mcq",
    prompt: "Ezetimibe lowers LDL cholesterol by inhibiting which intestinal target?",
    setup: "",
    ans: [
      { t: "NPC1L1 cholesterol transporter", ok: true },
      { t: "Pancreatic lipase enzyme action", ok: false },
      { t: "Bile acid binding sites", ok: false },
      { t: "Hepatic VLDL assembly line", ok: false },
    ],
    rationale: "Ezetimibe blocks the NPC1L1 transporter on small intestine enterocytes, reducing cholesterol absorption and secondarily upregulating hepatic LDL receptors. It does not inhibit pancreatic lipase, does not bind bile acids, and does not act on hepatic VLDL assembly. Pearl: ezetimibe targets NPC1L1 to cut intestinal cholesterol absorption.", // source: Lipid deck slide 28
    scene: "pharmacology",
    sceneCfg: { label: "EZETIMIBE NPC1L1" },
    metadata: { topic: "Ezetimibe", priority: "high" },
  },

  {
    id: "ap1-w5l-064",
    type: "mcq",
    prompt: "Which trial demonstrated an outcome benefit when ezetimibe was added to simvastatin after acute coronary syndrome?",
    setup: "",
    ans: [
      { t: "IMPROVE-IT", ok: true },
      { t: "FOURIER", ok: false },
      { t: "ODYSSEY OUTCOMES", ok: false },
      { t: "Familial cohort", ok: false },
    ],
    rationale: "IMPROVE-IT showed that adding ezetimibe to simvastatin after acute coronary syndrome further reduced events, supporting combination therapy. FOURIER and ODYSSEY OUTCOMES tested PCSK9 inhibitors, not ezetimibe. Pearl: IMPROVE-IT validated ezetimibe added to a statin after ACS.", // source: Lipid deck slide 28
    scene: "pharmacology",
    sceneCfg: { label: "IMPROVE-IT TRIAL" },
    metadata: { topic: "Ezetimibe", priority: "medium" },
  },

  {
    id: "ap1-w5l-065",
    type: "mcq",
    prompt: "Why is ezetimibe particularly useful in a statin-intolerant patient?",
    setup: "",
    ans: [
      { t: "Placebo-like adverse profile", ok: true },
      { t: "Strongest triglyceride drop", ok: false },
      { t: "Raises HDL the most", ok: false },
      { t: "Reverses statin myopathy fast", ok: false },
    ],
    rationale: "Ezetimibe is very well tolerated with a placebo-like adverse event profile, so it helps avoid high-dose statins and suits statin-intolerant patients. It is not a strong triglyceride or HDL agent and does not reverse myopathy. Pearl: ezetimibe is a gentle add-on or substitute when statins are not tolerated.", // source: Lipid deck slide 29
    scene: "pharmacology",
    sceneCfg: { label: "EZETIMIBE TOLERABILITY" },
    metadata: { topic: "Ezetimibe", priority: "medium" },
  },

  {
    id: "ap1-w5l-066",
    type: "mcq",
    prompt: "Which newer lipid agent carries a boxed warning for hepatotoxicity and is used in homozygous familial hypercholesterolemia?",
    setup: "",
    ans: [
      { t: "Lomitapide", ok: true },
      { t: "Inclisiran", ok: false },
      { t: "Bempedoic acid", ok: false },
      { t: "Colesevelam", ok: false },
    ],
    rationale: "Lomitapide is reserved for homozygous familial hypercholesterolemia and carries a boxed hepatotoxicity warning. Inclisiran and bempedoic acid are emerging options without that specific warning, and colesevelam is an older resin. Pearl: lomitapide treats homozygous FH but carries a boxed liver-toxicity warning.", // source: Lipid deck slide 29
    scene: "pharmacology",
    sceneCfg: { label: "LOMITAPIDE WARNING" },
    metadata: { topic: "Newer agents", priority: "medium" },
  },

  {
    id: "ap1-w5l-067",
    type: "mcq",
    prompt: "Omega-3 fish oil supplements primarily improve which part of the lipid profile?",
    setup: "",
    ans: [
      { t: "Lower triglyceride levels", ok: true },
      { t: "Lower LDL cholesterol most", ok: false },
      { t: "Raise HDL the strongest", ok: false },
      { t: "Block cholesterol uptake gut", ok: false },
    ],
    rationale: "Marine omega-3 fatty acids mainly lower triglycerides and are not primarily an LDL or HDL therapy. They do not block intestinal cholesterol uptake, which is the ezetimibe action. Pearl: fish oil is chiefly a triglyceride-lowering supplement.", // source: Lipid deck slide 30
    scene: "pharmacology",
    sceneCfg: { label: "FISH OIL TG" },
    metadata: { topic: "Omega-3 fish oil", priority: "medium" },
  },

  {
    id: "ap1-w5l-068",
    type: "mcq",
    prompt: "When should high-dose fish oil ideally be held before elective surgery, especially with planned neuraxial anesthesia?",
    setup: "",
    ans: [
      { t: "One to two weeks before", ok: true },
      { t: "On the morning of surgery", ok: false },
      { t: "Six full months before", ok: false },
      { t: "No need to hold it", ok: false },
    ],
    rationale: "High-dose fish oil increases bleeding risk, so it should be stopped one to two weeks before elective surgery, particularly when neuraxial blockade is planned. Stopping the morning of surgery is too late, six months is excessive, and continuing ignores the bleeding concern. Pearl: hold high-dose fish oil one to two weeks ahead of elective or neuraxial procedures.", // source: Lipid deck slide 30
    scene: "pharmacology",
    sceneCfg: { label: "FISH OIL HOLD" },
    metadata: { topic: "Omega-3 fish oil", priority: "high" },
  },

  {
    id: "ap1-w5l-069",
    type: "mcq",
    prompt: "Across the lipid-lowering classes, which pairing of strongest effect to class is correct?",
    setup: "",
    ans: [
      { t: "Best HDL rise is niacin", ok: true },
      { t: "Best LDL drop is niacin", ok: false },
      { t: "Best TG drop is ezetimibe", ok: false },
      { t: "Best HDL rise is ezetimibe", ok: false },
    ],
    rationale: "Niacin raises HDL the most at about 20 to 30 percent, while PCSK9 inhibitors give the deepest LDL reduction and fibrates lower triglycerides the most. Niacin is not the strongest LDL agent, and ezetimibe has minimal effect on triglycerides or HDL. Pearl: niacin leads for HDL, PCSK9 inhibitors for LDL, fibrates for triglycerides.", // source: Lipid deck slide 31
    scene: "pharmacology",
    sceneCfg: { label: "CLASS EFFECT MATCH" },
    metadata: { topic: "Comparative profile", priority: "medium" },
  },

  {
    id: "ap1-w5l-070",
    type: "mcq",
    prompt: "A patient needs aggressive LDL lowering and primary cardiovascular prevention. Which class is first line?",
    setup: "",
    ans: [
      { t: "Statin therapy", ok: true },
      { t: "Fibrate therapy", ok: false },
      { t: "Bile acid resin", ok: false },
      { t: "Fish oil capsules", ok: false },
    ],
    rationale: "Statins are first line for both primary and secondary cardiovascular prevention given their LDL lowering and outcome data. Fibrates target triglycerides, resins are adjuncts, and fish oil is not a primary prevention drug. Pearl: start with a statin for cardiovascular prevention and LDL control.", // source: Lipid deck slide 32
    scene: "pharmacology",
    sceneCfg: { label: "STATIN FIRST LINE" },
    metadata: { topic: "Drug selection", priority: "high" },
  },

  {
    id: "ap1-w5l-071",
    type: "mcq",
    prompt: "A statin-treated patient needs further LDL lowering but cannot escalate the statin. What is the best add-on first step?",
    setup: "",
    ans: [
      { t: "Add ezetimibe to the statin", ok: true },
      { t: "Add a fibrate to lower the LDL", ok: false },
      { t: "Add fish oil to lower LDL", ok: false },
      { t: "Add niacin for LDL drop", ok: false },
    ],
    rationale: "When more LDL lowering is needed on a statin, adding ezetimibe is the well-tolerated next step with proven outcome benefit. Fibrates and fish oil mainly target triglycerides, and niacin is a weaker, poorly tolerated LDL option. Pearl: ezetimibe is the go-to add-on when a statin alone is not enough for LDL.", // source: Lipid deck slide 32
    scene: "pharmacology",
    sceneCfg: { label: "ADD EZETIMIBE" },
    metadata: { topic: "Drug selection", priority: "medium" },
  },

];

export const AP1_WK5_METADATA = {
  nodeId: "ap1-wk-5",
  courseId: "adv-pharmacology-1",
  chapter: "Stoelting Ch 19, 21, 22, 23, 37",
  title: "Lipid Lowering, Antidysrhythmics, Diuretics",
  totalQuestions: 71,
  questionTypes: { mcq: 71, multi: 0, short: 0 },
};
