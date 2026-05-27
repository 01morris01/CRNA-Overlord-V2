/**
 * Advanced Pharmacology I, Week 3
 * Sympathomimetics, Antihypertensives, Vasodilators, Heart Failure
 * Stoelting Ch 15, 18, 19, 20
 * Source decks: Sympathomimetics_ch_18_VandivierCN.pptx (deck 1, 58 slides)
 *               antagonist_hypertensives_CN_Vandivier.pptx (deck 2, 47 slides)
 * 60 MCQs: 37 from deck 1, 23 from deck 2
 */
export const AP1_WK3_QUESTIONS = [

  // ═══════════════════════════════════════════════════════════════════════
  //  EPINEPHRINE  (deck 1, slides 3–8)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-001",
    type: "mcq",
    prompt: "Epinephrine activates which combination of adrenergic receptors?",  // source: deck 1, slide 3
    setup: "",
    ans: [
      { t: "Alpha-1, beta-1, and beta-2", ok: true },
      { t: "Alpha-1 and alpha-2 only", ok: false },
      { t: "Beta-1 and beta-2 only", ok: false },
      { t: "Alpha-1 and beta-1 only", ok: false },
    ],
    rationale: "Epinephrine is a nonselective adrenergic agonist that activates alpha-1, beta-1, and beta-2 receptors. This broad profile produces vasoconstriction (alpha-1), increased heart rate and contractility (beta-1), and bronchodilation with skeletal muscle vasodilation (beta-2). (B) is wrong because epinephrine has potent beta activity, not just alpha. (C) is wrong because epinephrine also activates alpha-1 receptors, producing vasoconstriction at higher doses. (D) is wrong because epinephrine has significant beta-2 activity causing bronchodilation and vasodilation in skeletal muscle beds. Pearl: The relative balance of alpha and beta effects is dose dependent; low doses favor beta effects while high doses produce predominantly alpha-mediated vasoconstriction.",
    scene: "pharmacology",
    sceneCfg: { label: "EPINEPHRINE" },
    metadata: { topic: "Epinephrine", priority: "high" },
  },

  {
    id: "ap1-w3-002",
    type: "mcq",
    prompt: "At low intravenous doses, epinephrine produces predominantly which cardiovascular effect?",  // source: deck 1, slide 4
    setup: "",
    ans: [
      { t: "Intense peripheral vasoconstriction with elevated SVR", ok: false },
      { t: "Beta-mediated vasodilation and increased heart rate", ok: true },
      { t: "Selective coronary artery vasospasm", ok: false },
      { t: "Reflex bradycardia with decreased cardiac output", ok: false },
    ],
    rationale: "At low intravenous doses, beta-2 vasodilatory effects predominate over alpha-1 vasoconstriction, resulting in decreased SVR along with beta-1 stimulation of heart rate and contractility. (A) is wrong because intense vasoconstriction with elevated SVR occurs at higher doses where alpha-1 effects dominate. (C) is wrong because epinephrine causes coronary vasodilation through metabolic autoregulation, not vasospasm. (D) is wrong because epinephrine increases heart rate through beta-1 stimulation; reflex bradycardia is characteristic of pure alpha agonists like phenylephrine. Pearl: The dose-dependent shift from beta to alpha predominance is a classic exam topic; remember low dose equals beta, high dose equals alpha.",
    scene: "pharmacology",
    sceneCfg: { label: "EPINEPHRINE" },
    metadata: { topic: "Epinephrine", priority: "high" },
  },

  {
    id: "ap1-w3-003",
    type: "mcq",
    prompt: "Epinephrine-induced hypokalemia results from activation of which receptor?",  // source: deck 1, slide 5
    setup: "",
    ans: [
      { t: "Alpha-1 on vascular smooth muscle", ok: false },
      { t: "Beta-1 on cardiac myocytes", ok: false },
      { t: "Beta-2 on skeletal muscle cells", ok: true },
      { t: "Dopamine D1 on renal tubules", ok: false },
    ],
    rationale: "Beta-2 receptor activation on skeletal muscle cells stimulates the Na-K ATPase pump, driving potassium intracellularly and producing hypokalemia. This is a significant clinical effect during epinephrine infusions. (A) is wrong because alpha-1 receptors mediate vasoconstriction, not potassium shifts. (B) is wrong because beta-1 receptors increase heart rate and contractility but do not directly drive intracellular potassium uptake. (D) is wrong because epinephrine does not activate dopamine receptors. Pearl: Propranolol (nonselective beta-blocker) blunts epinephrine-induced hypokalemia because it blocks beta-2, but atenolol (beta-1 selective) does not.",
    scene: "pharmacology",
    sceneCfg: { label: "EPINEPHRINE" },
    metadata: { topic: "Epinephrine", priority: "high" },
  },

  {
    id: "ap1-w3-004",
    type: "mcq",
    prompt: "Which beta-blocker blunts epinephrine-induced hypokalemia?",  // source: deck 1, slide 5
    setup: "",
    ans: [
      { t: "Atenolol", ok: false },
      { t: "Metoprolol", ok: false },
      { t: "Propranolol", ok: true },
      { t: "Esmolol", ok: false },
    ],
    rationale: "Propranolol is a nonselective beta-blocker that blocks both beta-1 and beta-2. Because epinephrine-induced hypokalemia is mediated by beta-2 activation of the Na-K ATPase pump, only a nonselective blocker prevents this effect. (A) is wrong because atenolol is beta-1 selective and does not block beta-2 receptors. (B) is wrong because metoprolol is beta-1 selective at therapeutic doses. (D) is wrong because esmolol is beta-1 selective. Pearl: This distinction between selective and nonselective beta-blockade is clinically relevant when managing patients on catecholamine infusions who develop electrolyte shifts.",
    scene: "pharmacology",
    sceneCfg: { label: "EPINEPHRINE" },
    metadata: { topic: "Epinephrine", priority: "high" },
  },

  {
    id: "ap1-w3-005",
    type: "mcq",
    prompt: "Epinephrine produces hyperglycemia primarily through which metabolic mechanism?",  // source: deck 1, slide 5
    setup: "",
    ans: [
      { t: "Inhibition of insulin secretion from pancreatic beta cells", ok: false },
      { t: "Stimulation of hepatic glycogenolysis", ok: true },
      { t: "Increased intestinal glucose absorption", ok: false },
      { t: "Decreased renal glucose excretion", ok: false },
    ],
    rationale: "Epinephrine stimulates hepatic glycogenolysis (breakdown of glycogen to glucose), producing hyperglycemia. This is primarily a beta-2 mediated hepatic effect. (A) is wrong because while alpha-2 receptors on pancreatic beta cells can suppress insulin, the dominant mechanism is direct hepatic glucose production through glycogenolysis. (C) is wrong because epinephrine does not significantly affect intestinal glucose absorption. (D) is wrong because renal glucose handling is not the primary mechanism. Pearl: Stress-induced hyperglycemia in surgical and critically ill patients is partly attributable to endogenous catecholamine release driving glycogenolysis.",
    scene: "pharmacology",
    sceneCfg: { label: "EPINEPHRINE" },
    metadata: { topic: "Epinephrine", priority: "medium" },
  },

  {
    id: "ap1-w3-006",
    type: "mcq",
    prompt: "Epinephrine causes mydriasis by stimulating which receptor on the iris?",  // source: deck 1, slide 6
    setup: "",
    ans: [
      { t: "Beta-1 on the ciliary muscle", ok: false },
      { t: "Alpha-1 on the radial (dilator) muscle", ok: true },
      { t: "Beta-2 on the sphincter muscle", ok: false },
      { t: "Muscarinic receptors on the constrictor fibers", ok: false },
    ],
    rationale: "Epinephrine activates alpha-1 receptors on the radial (dilator) muscle of the iris, causing contraction and pupil dilation (mydriasis). (A) is wrong because beta-1 receptors on ciliary muscle affect aqueous humor, not pupil size. (C) is wrong because the iris sphincter is controlled by parasympathetic (muscarinic) innervation, not beta-2 receptors. (D) is wrong because muscarinic stimulation causes miosis (constriction), not mydriasis. Pearl: Systemically administered epinephrine can dilate pupils, which could confound neurologic assessments relying on pupillary examination.",
    scene: "pharmacology",
    sceneCfg: { label: "EPINEPHRINE" },
    metadata: { topic: "Epinephrine", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  NOREPINEPHRINE  (deck 1, slides 9–12)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-007",
    type: "mcq",
    prompt: "Norepinephrine is characterized by which receptor activity profile?",  // source: deck 1, slide 9
    setup: "",
    ans: [
      { t: "Strong alpha-1, moderate beta-1, minimal beta-2", ok: true },
      { t: "Strong beta-1, strong beta-2, minimal alpha-1", ok: false },
      { t: "Equal alpha-1, beta-1, and beta-2 activity", ok: false },
      { t: "Selective alpha-2 with no beta activity", ok: false },
    ],
    rationale: "Norepinephrine has potent alpha-1 agonism (vasoconstriction), moderate beta-1 agonism (cardiac stimulation), and minimal beta-2 activity. This produces intense vasoconstriction with increased SVR and MAP. (B) is wrong because that profile more closely describes isoproterenol. (C) is wrong because norepinephrine has very unequal receptor activation, with alpha-1 predominating. (D) is wrong because norepinephrine activates alpha-1, not selectively alpha-2, and does have beta-1 activity. Pearl: The minimal beta-2 activity means norepinephrine lacks the vasodilatory and bronchodilatory effects that epinephrine provides.",
    scene: "pharmacology",
    sceneCfg: { label: "NOREPINEPHRINE" },
    metadata: { topic: "Norepinephrine", priority: "high" },
  },

  {
    id: "ap1-w3-008",
    type: "mcq",
    prompt: "Norepinephrine is considered the first-line vasopressor for which type of shock?",  // source: deck 1, slide 10
    setup: "",
    ans: [
      { t: "Cardiogenic shock", ok: false },
      { t: "Hypovolemic shock", ok: false },
      { t: "Septic and distributive shock", ok: true },
      { t: "Obstructive shock from cardiac tamponade", ok: false },
    ],
    rationale: "Norepinephrine is recommended first-line for septic and distributive shock because its strong alpha-1 activity restores vascular tone while its moderate beta-1 activity supports cardiac output. (A) is wrong because cardiogenic shock management focuses on inotropes and afterload reduction, not primarily vasoconstriction. (B) is wrong because hypovolemic shock requires volume resuscitation as the primary intervention. (D) is wrong because obstructive shock from tamponade requires definitive treatment (pericardiocentesis). Pearl: Surviving Sepsis guidelines recommend norepinephrine first, with vasopressin as a second-line agent.",
    scene: "pharmacology",
    sceneCfg: { label: "NOREPINEPHRINE" },
    metadata: { topic: "Norepinephrine", priority: "high" },
  },

  {
    id: "ap1-w3-009",
    type: "mcq",
    prompt: "During norepinephrine administration, coronary artery blood flow typically:",  // source: deck 1, slide 10
    setup: "",
    ans: [
      { t: "Decreases due to intense alpha-1 vasoconstriction", ok: false },
      { t: "Increases despite systemic vasoconstriction", ok: true },
      { t: "Remains completely unchanged from baseline", ok: false },
      { t: "Fluctuates unpredictably", ok: false },
    ],
    rationale: "Coronary arteries dilate during norepinephrine administration despite systemic vasoconstriction. Increased myocardial work and oxygen consumption trigger local vasodilatory mediators (metabolic autoregulation) that override adrenergic vasoconstriction. (A) is wrong because coronary circulation is protected by metabolic autoregulation. (C) is wrong because coronary flow increases in response to elevated myocardial oxygen demand. (D) is wrong because the coronary flow change is a predictable autoregulatory response. Pearl: This coronary vasodilation explains why norepinephrine can increase MAP without causing myocardial ischemia in most patients.",
    scene: "pharmacology",
    sceneCfg: { label: "NOREPINEPHRINE" },
    metadata: { topic: "Norepinephrine", priority: "high" },
  },

  {
    id: "ap1-w3-010",
    type: "mcq",
    prompt: "A potential adverse effect of norepinephrine at high doses is decreased cardiac output caused by:",  // source: deck 1, slide 11
    setup: "",
    ans: [
      { t: "Direct myocardial depression from beta-2 blockade", ok: false },
      { t: "Excessive increase in afterload from alpha-1 vasoconstriction", ok: true },
      { t: "Profound vasodilation reducing venous return", ok: false },
      { t: "Vagal stimulation slowing the sinoatrial node", ok: false },
    ],
    rationale: "At high doses, intense alpha-1 vasoconstriction excessively increases afterload, making it harder for the ventricle to eject blood. This increased impedance can reduce stroke volume and cardiac output, particularly in a failing heart. (A) is wrong because norepinephrine does not block beta-2 or directly depress the myocardium. (C) is wrong because norepinephrine causes vasoconstriction, not vasodilation. (D) is wrong because any heart rate reduction is a baroreceptor reflex, not direct vagal stimulation. Pearl: This afterload mismatch is why clinicians may add an inodilator (dobutamine or milrinone) alongside norepinephrine in septic patients with concurrent cardiac dysfunction.",
    scene: "pharmacology",
    sceneCfg: { label: "NOREPINEPHRINE" },
    metadata: { topic: "Norepinephrine", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  DOPAMINE  (deck 1, slides 13–22)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-011",
    type: "mcq",
    prompt: "At low doses (0.5 to 3 mcg/kg/min), dopamine primarily stimulates which receptors?",  // source: deck 1, slide 14
    setup: "",
    ans: [
      { t: "Beta-1 cardiac receptors", ok: false },
      { t: "Alpha-1 vascular receptors", ok: false },
      { t: "D1 and D2 receptors in renal and mesenteric beds", ok: true },
      { t: "Muscarinic receptors in the GI tract", ok: false },
    ],
    rationale: "At low doses (0.5 to 3 mcg/kg/min), dopamine preferentially activates D1 and D2 receptors in the renal and mesenteric vascular beds, causing local vasodilation. (A) is wrong because beta-1 cardiac stimulation occurs at moderate doses (3 to 10 mcg/kg/min). (B) is wrong because alpha-1 vasoconstriction predominates at high doses (greater than 10 mcg/kg/min). (D) is wrong because dopamine does not activate muscarinic receptors. Pearl: The dose-dependent receptor activation of dopamine (low = D1/D2, moderate = beta-1, high = alpha-1) is a high-yield pharmacology exam topic.",
    scene: "pharmacology",
    sceneCfg: { label: "DOPAMINE" },
    metadata: { topic: "Dopamine", priority: "high" },
  },

  {
    id: "ap1-w3-012",
    type: "mcq",
    prompt: "At moderate infusion rates (3 to 10 mcg/kg/min), the predominant cardiovascular effect of dopamine is:",  // source: deck 1, slide 15
    setup: "",
    ans: [
      { t: "Renal vasodilation with diuresis", ok: false },
      { t: "Beta-1 mediated cardiac stimulation with increased contractility", ok: true },
      { t: "Alpha-1 mediated vasoconstriction with elevated SVR", ok: false },
      { t: "D2-mediated vasodilation with hypotension", ok: false },
    ],
    rationale: "At moderate doses (3 to 10 mcg/kg/min), dopamine activates beta-1 receptors, increasing contractility, heart rate, and cardiac output. (A) is wrong because renal vasodilation via D1/D2 predominates at lower doses. (C) is wrong because alpha-1 vasoconstriction predominates at higher doses (greater than 10 mcg/kg/min). (D) is wrong because dopaminergic vasodilation is a low-dose effect. Pearl: Individual variation in receptor activation thresholds means dose ranges overlap; clinical response must guide titration.",
    scene: "pharmacology",
    sceneCfg: { label: "DOPAMINE" },
    metadata: { topic: "Dopamine", priority: "high" },
  },

  {
    id: "ap1-w3-013",
    type: "mcq",
    prompt: "Low-dose (renal-dose) dopamine for renal protection in critically ill patients is:",  // source: deck 1, slide 16
    setup: "",
    ans: [
      { t: "Strongly recommended as standard of care", ok: false },
      { t: "Effective only in elderly patients", ok: false },
      { t: "Not recommended; evidence shows no benefit", ok: true },
      { t: "Effective only when combined with furosemide", ok: false },
    ],
    rationale: "Despite the theoretical rationale of D1-mediated renal vasodilation, clinical evidence does not support low-dose dopamine for renal protection. Randomized trials failed to demonstrate reduction in acute kidney injury, dialysis need, or mortality. (A) is wrong because professional guidelines do not recommend it. (B) is wrong because no subgroup has shown reliable benefit. (D) is wrong because combining with furosemide has not changed outcomes. Pearl: The renal-dose dopamine concept persists in clinical lore but should be abandoned per current evidence.",
    scene: "pharmacology",
    sceneCfg: { label: "DOPAMINE" },
    metadata: { topic: "Dopamine", priority: "high" },
  },

  {
    id: "ap1-w3-014",
    type: "mcq",
    prompt: "Dopamine suppresses the ventilatory drive by acting on which peripheral structure?",  // source: deck 1, slide 20
    setup: "",
    ans: [
      { t: "Pulmonary stretch receptors", ok: false },
      { t: "Medullary chemoreceptors", ok: false },
      { t: "Carotid body chemoreceptors", ok: true },
      { t: "Aortic baroreceptors", ok: false },
    ],
    rationale: "Dopamine inhibits the carotid body chemoreceptors through D2 receptor activation, blunting the peripheral ventilatory response to hypoxia. (A) is wrong because pulmonary stretch receptors mediate the Hering-Breuer reflex and are not dopamine targets. (B) is wrong because central medullary chemoreceptors regulate ventilation, but dopamine suppresses ventilation peripherally at the carotid body. (D) is wrong because aortic baroreceptors sense blood pressure, not chemical stimuli. Pearl: This effect can be clinically significant in ICU patients on dopamine who are being weaned from mechanical ventilation.",
    scene: "pharmacology",
    sceneCfg: { label: "DOPAMINE" },
    metadata: { topic: "Dopamine", priority: "medium" },
  },

  {
    id: "ap1-w3-015",
    type: "mcq",
    prompt: "Dopamine is NOT preferred as first-line for cardiogenic shock primarily because it:",  // source: deck 1, slide 16
    setup: "",
    ans: [
      { t: "Has no beta-1 activity at any dose", ok: false },
      { t: "Causes more tachyarrhythmias than alternative inotropes", ok: true },
      { t: "Produces excessive renal vasodilation", ok: false },
      { t: "Cannot be administered intravenously", ok: false },
    ],
    rationale: "Dopamine is associated with higher incidence of tachyarrhythmias compared with dobutamine or milrinone when used for inotropic support. (A) is wrong because dopamine does have beta-1 activity at moderate doses. (C) is wrong because renal vasodilation at low doses is not harmful; the issue is cardiac arrhythmogenicity at higher doses. (D) is wrong because dopamine is routinely given IV. Pearl: Current guidelines favor dobutamine or milrinone over dopamine for cardiogenic shock, reserving dopamine primarily for hypotension with bradycardia.",
    scene: "pharmacology",
    sceneCfg: { label: "DOPAMINE" },
    metadata: { topic: "Dopamine", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ISOPROTERENOL  (deck 1, slides 23–25)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-016",
    type: "mcq",
    prompt: "Isoproterenol is classified as a pure beta agonist because it:",  // source: deck 1, slide 23
    setup: "",
    ans: [
      { t: "Activates beta-1 and beta-2 with no alpha activity", ok: true },
      { t: "Activates only beta-1 receptors selectively", ok: false },
      { t: "Activates alpha-1 and beta-1 equally", ok: false },
      { t: "Activates only beta-2 receptors selectively", ok: false },
    ],
    rationale: "Isoproterenol activates both beta-1 and beta-2 adrenergic receptors with no alpha receptor activity, producing chronotropy, inotropy (beta-1), and peripheral vasodilation with bronchodilation (beta-2). (B) is wrong because isoproterenol is nonselective between beta subtypes. (C) is wrong because isoproterenol has no alpha-1 activity. (D) is wrong because isoproterenol has significant beta-1 activity. Pearl: Isoproterenol has been largely replaced by dobutamine and PDE inhibitors but remains useful for refractory bradycardia before pacing.",
    scene: "pharmacology",
    sceneCfg: { label: "ISOPROTERENOL" },
    metadata: { topic: "Isoproterenol", priority: "medium" },
  },

  {
    id: "ap1-w3-017",
    type: "mcq",
    prompt: "Isoproterenol would be CONTRAINDICATED in which clinical situation?",  // source: deck 1, slide 24
    setup: "",
    ans: [
      { t: "Symptomatic bradycardia awaiting pacemaker placement", ok: false },
      { t: "Septic shock requiring vasopressor support", ok: true },
      { t: "Pharmacologic cardiac stress testing", ok: false },
      { t: "Complete heart block with hemodynamic instability", ok: false },
    ],
    rationale: "Isoproterenol is contraindicated in septic shock because its potent beta-2 vasodilation would worsen the pathologic hypotension, and it lacks the alpha-1 vasoconstriction needed to restore vascular tone. (A) is wrong because bradycardia before pacing is a recognized use. (C) is wrong because pharmacologic stress testing is an established application. (D) is wrong because isoproterenol can temporize heart block when pacing is unavailable. Pearl: Think of isoproterenol as a chronotrope and vasodilator; any situation requiring vasoconstriction or blood pressure support is a contraindication.",
    scene: "pharmacology",
    sceneCfg: { label: "ISOPROTERENOL" },
    metadata: { topic: "Isoproterenol", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  DOBUTAMINE  (deck 1, slides 26–29)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-018",
    type: "mcq",
    prompt: "Dobutamine's primary hemodynamic effect is to increase:",  // source: deck 1, slide 26
    setup: "",
    ans: [
      { t: "SVR through alpha-1 stimulation", ok: false },
      { t: "Contractility, stroke volume, and cardiac output through beta-1 stimulation", ok: true },
      { t: "Renal blood flow through D1 receptor activation", ok: false },
      { t: "Venous capacitance through beta-2 vasodilation", ok: false },
    ],
    rationale: "Dobutamine is primarily a beta-1 agonist that increases myocardial contractility (positive inotropy), stroke volume, and cardiac output. (A) is wrong because dobutamine typically decreases SVR slightly due to mild beta-2 vasodilation. (C) is wrong because dobutamine does not activate dopamine receptors. (D) is wrong because mild beta-2 vasodilation occurs but is not the primary effect. Pearl: Dobutamine is the inotrope of choice when the goal is to increase cardiac output without significantly increasing SVR.",
    scene: "pharmacology",
    sceneCfg: { label: "DOBUTAMINE" },
    metadata: { topic: "Dobutamine", priority: "high" },
  },

  {
    id: "ap1-w3-019",
    type: "mcq",
    prompt: "Dobutamine is a racemic mixture derived from structural modification of which parent compound?",  // source: deck 1, slide 27
    setup: "",
    ans: [
      { t: "Norepinephrine", ok: false },
      { t: "Isoproterenol", ok: true },
      { t: "Dopamine", ok: false },
      { t: "Ephedrine", ok: false },
    ],
    rationale: "Dobutamine was derived from isoproterenol to create a predominantly beta-1 selective inotrope. The (+) enantiomer provides beta-1 and beta-2 agonism; the (−) enantiomer provides alpha-1 agonism. (A) is wrong because dobutamine was not synthesized from norepinephrine. (C) is wrong because dopamine is a separate catecholamine. (D) is wrong because ephedrine is a noncatecholamine with a different structural backbone. Pearl: The combined enantiomers produce net inotropy (beta-1 and alpha-1) with mild vasodilation (beta-2 slightly exceeds alpha-1), explaining the typical hemodynamic profile.",
    scene: "pharmacology",
    sceneCfg: { label: "DOBUTAMINE" },
    metadata: { topic: "Dobutamine", priority: "medium" },
  },

  {
    id: "ap1-w3-020",
    type: "mcq",
    prompt: "Prolonged continuous dobutamine infusion is associated with which pharmacologic phenomenon?",  // source: deck 1, slide 28
    setup: "",
    ans: [
      { t: "Cumulative toxicity requiring dose reduction", ok: false },
      { t: "Tachyphylaxis requiring escalating doses", ok: true },
      { t: "Irreversible receptor binding preventing discontinuation", ok: false },
      { t: "Conversion to a pure alpha agonist profile", ok: false },
    ],
    rationale: "Dobutamine exhibits tachyphylaxis (tolerance) with prolonged infusion, typically after 72 hours or more. Beta-1 receptor downregulation requires dose escalation to maintain the same hemodynamic effect. (A) is wrong because tachyphylaxis results in decreased effect, not toxicity. (C) is wrong because dobutamine binds receptors reversibly with a half-life of approximately 2 minutes. (D) is wrong because the receptor profile does not change; beta-1 receptor density decreases. Pearl: Tachyphylaxis to dobutamine is one reason PDE III inhibitors (milrinone) are used as alternatives, since they act downstream of the beta receptor.",
    scene: "pharmacology",
    sceneCfg: { label: "DOBUTAMINE" },
    metadata: { topic: "Dobutamine", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  EPHEDRINE  (deck 1, slides 30–33)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-021",
    type: "mcq",
    prompt: "Ephedrine produces sympathomimetic effects through which mechanism?",  // source: deck 1, slide 30
    setup: "",
    ans: [
      { t: "Direct alpha-1 receptor activation only", ok: false },
      { t: "Mixed direct receptor activation and indirect norepinephrine release", ok: true },
      { t: "Pure indirect release of dopamine from nerve terminals", ok: false },
      { t: "Inhibition of monoamine oxidase enzymes", ok: false },
    ],
    rationale: "Ephedrine is a mixed-acting sympathomimetic that both directly stimulates adrenergic receptors and indirectly releases norepinephrine from presynaptic nerve terminals. It is also resistant to MAO because it is a noncatecholamine. (A) is wrong because ephedrine has both direct and indirect components and activates beta receptors as well. (C) is wrong because ephedrine releases norepinephrine, not dopamine. (D) is wrong because ephedrine is resistant to MAO but does not inhibit MAO. Pearl: Ephedrine 5 to 10 mg IV is a common first-line bolus vasopressor for anesthesia-induced hypotension because of its dual mechanism and rapid onset.",
    scene: "pharmacology",
    sceneCfg: { label: "EPHEDRINE" },
    metadata: { topic: "Ephedrine", priority: "high" },
  },

  {
    id: "ap1-w3-022",
    type: "mcq",
    prompt: "Repeated bolus doses of ephedrine show diminishing effect (tachyphylaxis) because:",  // source: deck 1, slide 31
    setup: "",
    ans: [
      { t: "Hepatic metabolism accelerates with each dose", ok: false },
      { t: "Norepinephrine stores in sympathetic nerve terminals become depleted", ok: true },
      { t: "Alpha-1 receptors develop rapid downregulation", ok: false },
      { t: "Renal clearance increases after the first dose", ok: false },
    ],
    rationale: "Ephedrine's indirect component relies on releasing stored norepinephrine from presynaptic vesicles. With repeated dosing, these stores become progressively depleted, and subsequent doses release less norepinephrine. (A) is wrong because tachyphylaxis is from neurotransmitter depletion, not accelerated metabolism. (C) is wrong because receptor downregulation requires longer exposure. (D) is wrong because renal clearance does not change significantly between doses. Pearl: When ephedrine tachyphylaxis occurs, switching to a direct-acting agent like phenylephrine bypasses the depleted norepinephrine stores.",
    scene: "pharmacology",
    sceneCfg: { label: "EPHEDRINE" },
    metadata: { topic: "Ephedrine", priority: "high" },
  },

  {
    id: "ap1-w3-023",
    type: "mcq",
    prompt: "During obstetric anesthesia, which vasopressor may better preserve fetal acid-base status compared with ephedrine?",  // source: deck 1, slide 33
    setup: "",
    ans: [
      { t: "Norepinephrine", ok: false },
      { t: "Dopamine", ok: false },
      { t: "Phenylephrine", ok: true },
      { t: "Isoproterenol", ok: false },
    ],
    rationale: "Evidence suggests phenylephrine better preserves fetal acid-base status during cesarean delivery under neuraxial anesthesia. Ephedrine crosses the placenta more readily and stimulates fetal metabolism, potentially leading to fetal acidosis. (A) is wrong because norepinephrine is not the standard alternative vasopressor in obstetric anesthesia. (B) is wrong because dopamine is not routinely used for spinal hypotension in obstetrics. (D) is wrong because isoproterenol would worsen hypotension through vasodilation. Pearl: Phenylephrine infusions have become standard practice for preventing and treating spinal-induced hypotension during cesarean delivery.",
    scene: "pharmacology",
    sceneCfg: { label: "EPHEDRINE" },
    metadata: { topic: "Ephedrine", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  PHENYLEPHRINE  (deck 1, slides 34–37)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-024",
    type: "mcq",
    prompt: "Phenylephrine is a direct-acting sympathomimetic that primarily activates which receptor?",  // source: deck 1, slide 34
    setup: "",
    ans: [
      { t: "Beta-1 cardiac receptors", ok: false },
      { t: "Beta-2 vascular receptors", ok: false },
      { t: "Alpha-1 vascular receptors", ok: true },
      { t: "D1 renal receptors", ok: false },
    ],
    rationale: "Phenylephrine is a selective, direct-acting alpha-1 agonist with minimal beta activity. It increases SVR and blood pressure through arterial vasoconstriction and commonly produces reflex bradycardia via the baroreceptor response. (A) is wrong because phenylephrine has minimal beta-1 activity. (B) is wrong because it has no clinically significant beta-2 activity. (D) is wrong because it does not activate dopamine receptors. Pearl: Typical IV dosing is 50 to 100 mcg bolus or an infusion of 20 to 100 mcg/min.",
    scene: "pharmacology",
    sceneCfg: { label: "PHENYLEPHRINE" },
    metadata: { topic: "Phenylephrine", priority: "high" },
  },

  {
    id: "ap1-w3-025",
    type: "mcq",
    prompt: "Phenylephrine is NOT considered first-line for septic shock because it:",  // source: deck 1, slide 35
    setup: "",
    ans: [
      { t: "Lacks any vasoconstrictive properties", ok: false },
      { t: "Increases afterload without providing inotropic support", ok: true },
      { t: "Has a half-life too short for continuous infusion", ok: false },
      { t: "Causes severe bronchospasm", ok: false },
    ],
    rationale: "Phenylephrine is a pure vasoconstrictor (alpha-1) without inotropic support (minimal beta-1). In septic shock, where cardiac dysfunction often coexists, increasing afterload without augmenting cardiac output may worsen tissue perfusion. (A) is wrong because phenylephrine is a potent vasoconstrictor. (C) is wrong because phenylephrine can be infused continuously. (D) is wrong because phenylephrine does not cause bronchospasm. Pearl: Phenylephrine may be considered in septic shock only when tachyarrhythmias preclude norepinephrine use.",
    scene: "pharmacology",
    sceneCfg: { label: "PHENYLEPHRINE" },
    metadata: { topic: "Phenylephrine", priority: "high" },
  },

  {
    id: "ap1-w3-026",
    type: "mcq",
    prompt: "Overdose of phenylephrine producing severe hypertension should be treated with:",  // source: deck 1, slide 36
    setup: "",
    ans: [
      { t: "A beta-blocker to reduce heart rate", ok: false },
      { t: "Phentolamine, an alpha receptor antagonist", ok: true },
      { t: "Atropine to increase heart rate", ok: false },
      { t: "A higher dose of phenylephrine to induce tachyphylaxis", ok: false },
    ],
    rationale: "Phentolamine is a nonselective alpha receptor antagonist that directly reverses alpha-1 mediated vasoconstriction from phenylephrine overdose. (A) is wrong because beta-blockers do not reverse alpha-1 vasoconstriction and would remove any compensatory cardiac output. (C) is wrong because atropine increases heart rate but does not address the underlying vasoconstriction. (D) is wrong because more phenylephrine would worsen the crisis. Pearl: Phentolamine is the specific reversal agent for alpha-agonist toxicity, also useful when local anesthetic with epinephrine is accidentally injected intra-arterially.",
    scene: "pharmacology",
    sceneCfg: { label: "PHENYLEPHRINE" },
    metadata: { topic: "Phenylephrine", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  SELECTIVE BETA-2 AGONISTS  (deck 1, slides 38–45)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-027",
    type: "mcq",
    prompt: "Selective beta-2 agonists such as albuterol and terbutaline are resistant to degradation by:",  // source: deck 1, slide 39
    setup: "",
    ans: [
      { t: "Plasma cholinesterase", ok: false },
      { t: "Monoamine oxidase", ok: false },
      { t: "Catechol-O-methyltransferase (COMT)", ok: true },
      { t: "Hepatic cytochrome P450 enzymes", ok: false },
    ],
    rationale: "Selective beta-2 agonists are noncatecholamines that lack the catechol ring, making them resistant to COMT degradation. This gives them a longer duration of action than endogenous catecholamines. (A) is wrong because plasma cholinesterase metabolizes ester-based drugs, not beta-2 agonists. (B) is wrong because the primary distinguishing feature is COMT resistance rather than MAO resistance. (D) is wrong because while hepatic metabolism contributes to clearance, the key structural advantage is COMT resistance. Pearl: The prolonged duration from COMT resistance is what makes inhaled beta-2 agonists practical for outpatient bronchodilator therapy.",
    scene: "pharmacology",
    sceneCfg: { label: "SELECTIVE BETA-2 AGONISTS" },
    metadata: { topic: "Selective Beta-2 Agonists", priority: "medium" },
  },

  {
    id: "ap1-w3-028",
    type: "mcq",
    prompt: "Delivery of a metered-dose inhaler (MDI) through an endotracheal tube reduces drug delivery to the lungs by approximately:",  // source: deck 1, slide 40
    setup: "",
    ans: [
      { t: "10% to 20%", ok: false },
      { t: "30% to 40%", ok: false },
      { t: "50% to 70%", ok: true },
      { t: "90% to 100%", ok: false },
    ],
    rationale: "An endotracheal tube reduces MDI drug delivery by 50% to 70% due to aerosol deposition on tube walls, turbulent airflow, and loss of drug in the circuit. Intubated patients may need higher doses or repeated actuations. (A) is wrong because the reduction is much greater. (B) is wrong because 30% to 40% underestimates the actual loss. (D) is wrong because some drug does reach the lower airways despite significant loss. Pearl: In-line spacers and coordination with inspiratory flow can improve delivery, but drug losses remain significant in intubated patients.",
    scene: "pharmacology",
    sceneCfg: { label: "SELECTIVE BETA-2 AGONISTS" },
    metadata: { topic: "Selective Beta-2 Agonists", priority: "medium" },
  },

  {
    id: "ap1-w3-029",
    type: "mcq",
    prompt: "Which side effect of beta-2 agonists results from the same Na-K ATPase mechanism as epinephrine-induced hypokalemia?",  // source: deck 1, slide 42
    setup: "",
    ans: [
      { t: "Skeletal muscle tremor", ok: false },
      { t: "Lactic acidosis", ok: false },
      { t: "Hypokalemia", ok: true },
      { t: "Reflex tachycardia", ok: false },
    ],
    rationale: "Beta-2 agonists activate the Na-K ATPase pump on skeletal muscle, driving potassium intracellularly. This is the same mechanism by which epinephrine produces hypokalemia. (A) is wrong because tremor is a direct beta-2 effect on muscle contractile proteins, not the Na-K pump. (B) is wrong because lactic acidosis results from beta-2 stimulation of glycolysis, a separate pathway. (D) is wrong because reflex tachycardia is a baroreceptor response to vasodilation, not a potassium shift mechanism. Pearl: Beta-2 agonist hypokalemia is particularly dangerous in patients on digoxin, as low potassium potentiates digoxin toxicity.",
    scene: "pharmacology",
    sceneCfg: { label: "SELECTIVE BETA-2 AGONISTS" },
    metadata: { topic: "Selective Beta-2 Agonists", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  CARDIAC GLYCOSIDES / DIGOXIN  (deck 1, slides 46–49)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-030",
    type: "mcq",
    prompt: "Digoxin controls the ventricular rate in atrial fibrillation primarily by:",  // source: deck 1, slide 46
    setup: "",
    ans: [
      { t: "Slowing conduction through the AV node", ok: true },
      { t: "Suppressing ectopic atrial foci directly", ok: false },
      { t: "Accelerating sinoatrial node discharge", ok: false },
      { t: "Blocking sodium channels in the atrial myocardium", ok: false },
    ],
    rationale: "Digoxin slows AV nodal conduction via vagotonic (parasympathomimetic) effects, decreasing the number of atrial impulses conducted to the ventricles. This controls ventricular rate in atrial fibrillation and flutter. (B) is wrong because digoxin does not suppress atrial ectopic foci; it controls ventricular rate, not rhythm. (C) is wrong because vagotonic effects slow the SA node rate slightly, not accelerate it. (D) is wrong because digoxin inhibits the Na-K ATPase pump, not sodium channels. Pearl: Digoxin reduces heart failure hospitalizations but does NOT reduce mortality.",
    scene: "pharmacology",
    sceneCfg: { label: "CARDIAC GLYCOSIDES" },
    metadata: { topic: "Cardiac Glycosides", priority: "high" },
  },

  {
    id: "ap1-w3-031",
    type: "mcq",
    prompt: "Hypokalemia potentiates digoxin toxicity because potassium and digoxin:",  // source: deck 1, slide 47
    setup: "",
    ans: [
      { t: "Share the same hepatic metabolic pathway", ok: false },
      { t: "Compete for the same binding site on the Na-K ATPase pump", ok: true },
      { t: "Both activate the vagus nerve simultaneously", ok: false },
      { t: "Are both excreted by the same renal transporter", ok: false },
    ],
    rationale: "Potassium and digoxin compete for the same binding site on the Na-K ATPase pump. When serum potassium is low, less competition allows more digoxin to bind and inhibit the pump, increasing intracellular calcium to toxic levels and producing arrhythmias. (A) is wrong because the interaction is at the receptor level, not hepatic metabolism. (C) is wrong because the toxicity mechanism is Na-K ATPase binding site competition, not vagal activation. (D) is wrong because the interaction occurs at the target enzyme, not during renal excretion. Pearl: Always check potassium before and during digoxin therapy; diuretics that waste potassium are a common precipitant of digoxin toxicity.",
    scene: "pharmacology",
    sceneCfg: { label: "CARDIAC GLYCOSIDES" },
    metadata: { topic: "Cardiac Glycosides", priority: "high" },
  },

  {
    id: "ap1-w3-032",
    type: "mcq",
    prompt: "DC cardioversion in a patient with digoxin toxicity is dangerous because it may precipitate:",  // source: deck 1, slide 48
    setup: "",
    ans: [
      { t: "Asystole from complete AV block", ok: false },
      { t: "Ventricular fibrillation", ok: true },
      { t: "Atrial flutter with 1:1 conduction", ok: false },
      { t: "Torsades de pointes", ok: false },
    ],
    rationale: "DC cardioversion during digoxin toxicity risks precipitating ventricular fibrillation. The electrical shock combined with elevated intracellular calcium from Na-K ATPase inhibition creates conditions for lethal ventricular arrhythmias. (A) is wrong because the specific risk of cardioversion is VF, not asystole. (C) is wrong because 1:1 flutter is associated with class IC antiarrhythmics, not cardioversion in digoxin toxicity. (D) is wrong because torsades de pointes is associated with QT prolongation, not specifically with cardioversion during digoxin toxicity. Pearl: If cardioversion is absolutely necessary in a digitalized patient, use the lowest effective energy and optimize potassium and magnesium first.",
    scene: "pharmacology",
    sceneCfg: { label: "CARDIAC GLYCOSIDES" },
    metadata: { topic: "Cardiac Glycosides", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  PDE III INHIBITORS  (deck 1, slides 50–54)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-033",
    type: "mcq",
    prompt: "Milrinone and amrinone are classified as inodilators because they:",  // source: deck 1, slide 50
    setup: "",
    ans: [
      { t: "Block beta receptors while dilating coronary arteries", ok: false },
      { t: "Increase contractility while reducing preload and afterload", ok: true },
      { t: "Stimulate alpha-1 receptors while relaxing bronchial smooth muscle", ok: false },
      { t: "Inhibit calcium channels while increasing heart rate", ok: false },
    ],
    rationale: "PDE III inhibitors increase contractility (inotropy) by preventing cAMP breakdown while simultaneously causing vasodilation that decreases both preload and afterload. This dual action defines the inodilator class. (A) is wrong because PDE III inhibitors do not block beta receptors; they work downstream by preserving intracellular cAMP. (C) is wrong because they do not stimulate alpha-1 receptors. (D) is wrong because they do not inhibit calcium channels. Pearl: The combination of increased contractility with decreased preload, afterload, and PVR makes milrinone particularly valuable in right heart failure and pulmonary hypertension.",
    scene: "pharmacology",
    sceneCfg: { label: "PDE III INHIBITORS" },
    metadata: { topic: "PDE III Inhibitors", priority: "high" },
  },

  {
    id: "ap1-w3-034",
    type: "mcq",
    prompt: "PDE III inhibitors are effective in beta-blocked patients because they:",  // source: deck 1, slide 51
    setup: "",
    ans: [
      { t: "Directly activate beta-1 receptors to bypass the blockade", ok: false },
      { t: "Work downstream of the beta receptor by preventing cAMP degradation", ok: true },
      { t: "Convert to metabolites that displace beta-blockers from receptors", ok: false },
      { t: "Stimulate alpha-1 receptors as an alternative inotropic pathway", ok: false },
    ],
    rationale: "PDE III inhibitors act independently of the beta receptor by inhibiting the enzyme that breaks down cAMP. Preserving cAMP increases contractility regardless of whether beta receptors are blocked or downregulated. (A) is wrong because PDE III inhibitors do not interact with beta receptors. (C) is wrong because they do not displace beta-blockers. (D) is wrong because alpha-1 stimulation is not their mechanism. Pearl: This beta-receptor independence makes milrinone the preferred inotrope in catecholamine-resistant or beta-blocked patients.",
    scene: "pharmacology",
    sceneCfg: { label: "PDE III INHIBITORS" },
    metadata: { topic: "PDE III Inhibitors", priority: "high" },
  },

  {
    id: "ap1-w3-035",
    type: "mcq",
    prompt: "Compared with amrinone, milrinone is preferred in clinical practice because milrinone:",  // source: deck 1, slide 53
    setup: "",
    ans: [
      { t: "Is more potent and has fewer side effects", ok: true },
      { t: "Can be given orally for chronic heart failure", ok: false },
      { t: "Has a longer half-life requiring less frequent dosing", ok: false },
      { t: "Does not require a loading dose", ok: false },
    ],
    rationale: "Milrinone is more potent than amrinone with fewer adverse effects, including lower incidence of thrombocytopenia. (B) is wrong because chronic oral PDE III inhibitor use increases morbidity and mortality; they are restricted to acute IV use. (C) is wrong because a longer half-life is not the distinguishing advantage. (D) is wrong because milrinone is typically given with a loading dose followed by continuous infusion. Pearl: Despite acute hemodynamic benefits, chronic oral PDE III inhibitor therapy paradoxically increases mortality, restricting their use to short-term IV administration.",
    scene: "pharmacology",
    sceneCfg: { label: "PDE III INHIBITORS" },
    metadata: { topic: "PDE III Inhibitors", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  CALCIUM  (deck 1, slides 55–56)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-036",
    type: "mcq",
    prompt: "The biologically active form of calcium that determines physiologic effects is:",  // source: deck 1, slide 55
    setup: "",
    ans: [
      { t: "Total serum calcium", ok: false },
      { t: "Protein-bound calcium", ok: false },
      { t: "Ionized (free) calcium", ok: true },
      { t: "Calcium complexed with citrate", ok: false },
    ],
    rationale: "Ionized (free) calcium is the biologically active fraction that affects cardiac contractility, neuromuscular function, and coagulation. Only about 45% of total serum calcium is ionized under normal conditions. (A) is wrong because total calcium includes inactive protein-bound and complexed fractions. (B) is wrong because protein-bound calcium (~40%) is a reservoir, not physiologically active. (D) is wrong because citrate-complexed calcium is also inactive. Pearl: During massive transfusion, monitor ionized calcium directly; citrate chelation can lower the active fraction while total calcium appears normal.",
    scene: "pharmacology",
    sceneCfg: { label: "CALCIUM" },
    metadata: { topic: "Calcium", priority: "high" },
  },

  {
    id: "ap1-w3-037",
    type: "mcq",
    prompt: "During massive blood transfusion, ionized calcium decreases because:",  // source: deck 1, slide 56
    setup: "",
    ans: [
      { t: "Stored blood is depleted of calcium entirely", ok: false },
      { t: "Citrate preservative chelates ionized calcium", ok: true },
      { t: "Hypothermia from cold blood increases albumin binding", ok: false },
      { t: "Hemodilution lowers total protein and calcium equally", ok: false },
    ],
    rationale: "Citrate anticoagulant in stored blood chelates ionized calcium in the recipient, lowering the active fraction. This can cause hypotension, impaired contractility, and coagulopathy. (A) is wrong because stored blood contains calcium, but citrate shifts the equilibrium toward the bound form. (C) is wrong because while hypothermia can affect binding, the primary mechanism is citrate chelation. (D) is wrong because simple hemodilution does not specifically target ionized calcium. Pearl: Acidosis increases ionized calcium (H+ displaces Ca2+ from albumin) and alkalosis decreases it; this is relevant when correcting acid-base status in a transfused patient.",
    scene: "pharmacology",
    sceneCfg: { label: "CALCIUM" },
    metadata: { topic: "Calcium", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ALPHA-2 AGONISTS  (deck 2, slides 3–7)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-038",
    type: "mcq",
    prompt: "Abrupt discontinuation of clonidine can produce which dangerous clinical syndrome?",  // source: deck 2, slide 5
    setup: "",
    ans: [
      { t: "Severe hypotension and syncope", ok: false },
      { t: "Rebound hypertension and tachycardia", ok: true },
      { t: "Malignant hyperthermia", ok: false },
      { t: "Serotonin syndrome", ok: false },
    ],
    rationale: "Abrupt clonidine withdrawal produces rebound hypertension and tachycardia. Chronic alpha-2 mediated sympathetic suppression causes adrenergic receptor upregulation; when the drug is suddenly removed, upregulated receptors are exposed to normal catecholamine levels, producing an exaggerated sympathetic response. (A) is wrong because withdrawal causes hypertension, not hypotension. (C) is wrong because malignant hyperthermia is triggered by volatile anesthetics and succinylcholine. (D) is wrong because serotonin syndrome involves serotonergic drugs. Pearl: Perioperatively, always continue clonidine; if oral dosing is impossible, a transdermal patch should be applied.",
    scene: "pharmacology",
    sceneCfg: { label: "ALPHA-2 AGONISTS" },
    metadata: { topic: "Alpha-2 Agonists", priority: "high" },
  },

  {
    id: "ap1-w3-039",
    type: "mcq",
    prompt: "Dexmedetomidine has an alpha-2 to alpha-1 selectivity ratio of approximately:",  // source: deck 2, slide 6
    setup: "",
    ans: [
      { t: "8:1", ok: false },
      { t: "200:1", ok: false },
      { t: "1600:1", ok: true },
      { t: "10,000:1", ok: false },
    ],
    rationale: "Dexmedetomidine has an alpha-2 to alpha-1 selectivity ratio of approximately 1600:1, making it significantly more selective than clonidine (~200:1). This high selectivity produces sedation, analgesia, and sympatholysis with minimal alpha-1 effects at therapeutic doses. (A) is wrong because 8:1 would represent almost no selectivity. (B) is wrong because 200:1 is the approximate selectivity of clonidine, not dexmedetomidine. (D) is wrong because 10,000:1 overestimates the ratio. Pearl: Despite high selectivity, a rapid IV bolus can still cause transient hypertension from peripheral alpha-2B receptor activation on vascular smooth muscle.",
    scene: "pharmacology",
    sceneCfg: { label: "ALPHA-2 AGONISTS" },
    metadata: { topic: "Alpha-2 Agonists", priority: "high" },
  },

  {
    id: "ap1-w3-040",
    type: "mcq",
    prompt: "A rapid intravenous bolus of dexmedetomidine can paradoxically cause:",  // source: deck 2, slide 7
    setup: "",
    ans: [
      { t: "Tachycardia and hypotension", ok: false },
      { t: "Hypertension and bradycardia", ok: true },
      { t: "Bronchospasm and respiratory depression", ok: false },
      { t: "Seizures and hyperthermia", ok: false },
    ],
    rationale: "A rapid bolus produces paradoxical transient hypertension accompanied by bradycardia. The hypertension results from peripheral alpha-2B receptor activation on vascular smooth muscle (vasoconstriction), and the bradycardia is a baroreceptor reflex response. (A) is wrong because the initial response is hypertension, not hypotension. (C) is wrong because dexmedetomidine provides sedation without significant respiratory depression. (D) is wrong because seizures and hyperthermia are not dexmedetomidine effects. Pearl: To avoid this paradox, loading doses should be given slowly over 10 minutes or omitted entirely in favor of starting a maintenance infusion.",
    scene: "pharmacology",
    sceneCfg: { label: "ALPHA-2 AGONISTS" },
    metadata: { topic: "Alpha-2 Agonists", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  BETA BLOCKERS  (deck 2, slides 8–19)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-041",
    type: "mcq",
    prompt: "Propranolol increases peripheral vascular resistance because it blocks:",  // source: deck 2, slide 9
    setup: "",
    ans: [
      { t: "Alpha-1 receptors on vascular smooth muscle", ok: false },
      { t: "Beta-1 receptors on cardiac myocytes", ok: false },
      { t: "Beta-2 receptors on vascular smooth muscle", ok: true },
      { t: "D1 receptors on renal vasculature", ok: false },
    ],
    rationale: "Propranolol blocks beta-2 receptors on vascular smooth muscle, removing vasodilatory influence and allowing unopposed alpha-1 vasoconstriction, which increases PVR. (A) is wrong because propranolol does not block alpha-1. (B) is wrong because beta-1 blockade reduces HR and contractility but does not directly increase PVR. (D) is wrong because propranolol does not interact with dopamine receptors. Pearl: This PVR increase is why nonselective beta-blockers are avoided in peripheral vascular disease or Raynaud phenomenon.",
    scene: "pharmacology",
    sceneCfg: { label: "BETA BLOCKERS" },
    metadata: { topic: "Beta Blockers", priority: "high" },
  },

  {
    id: "ap1-w3-042",
    type: "mcq",
    prompt: "Timolol ophthalmic drops can produce systemic bradycardia that is characteristically:",  // source: deck 2, slide 11
    setup: "",
    ans: [
      { t: "Easily reversed with atropine", ok: false },
      { t: "Resistant to atropine treatment", ok: true },
      { t: "Self-limiting within 30 seconds", ok: false },
      { t: "Only seen in pediatric patients", ok: false },
    ],
    rationale: "Timolol is a nonselective beta-blocker systemically absorbed via the nasolacrimal duct. The resulting bradycardia is resistant to atropine because the mechanism is beta-1 blockade, not enhanced vagal tone. Atropine blocks muscarinic receptors but cannot overcome direct beta-1 blockade. (A) is wrong because this atropine resistance is the defining clinical feature. (C) is wrong because timolol's long half-life means effects persist much longer. (D) is wrong because adults are affected too, though neonates are at particular risk for apnea. Pearl: Always check for ophthalmic beta-blockers preoperatively; nasolacrimal duct occlusion after instillation reduces systemic absorption.",
    scene: "pharmacology",
    sceneCfg: { label: "BETA BLOCKERS" },
    metadata: { topic: "Beta Blockers", priority: "high" },
  },

  {
    id: "ap1-w3-043",
    type: "mcq",
    prompt: "Esmolol is ideal for perioperative heart rate control because it is metabolized by:",  // source: deck 2, slide 14
    setup: "",
    ans: [
      { t: "Hepatic cytochrome P450 enzymes", ok: false },
      { t: "Renal tubular secretion", ok: false },
      { t: "Red blood cell esterases independent of hepatic and renal function", ok: true },
      { t: "Erythrocyte carbonic anhydrase", ok: false },
    ],
    rationale: "Esmolol is rapidly hydrolyzed by RBC esterases to an inactive metabolite, independent of liver and kidney function. This produces an ultra-short half-life of ~9 minutes, allowing precise titration. (A) is wrong because esmolol is not metabolized by cytochrome P450. (B) is wrong because renal excretion clears the inactive metabolite, not the parent drug. (D) is wrong because carbonic anhydrase catalyzes CO2 hydration, not ester hydrolysis. Pearl: Esmolol's onset is ~5 minutes with a duration of 10 to 30 minutes, making it excellent for acute rate control during laryngoscopy or emergence hypertension.",
    scene: "pharmacology",
    sceneCfg: { label: "BETA BLOCKERS" },
    metadata: { topic: "Beta Blockers", priority: "high" },
  },

  {
    id: "ap1-w3-044",
    type: "mcq",
    prompt: "In cocaine toxicity, isolated beta-blockade is avoided because it may cause:",  // source: deck 2, slide 15
    setup: "",
    ans: [
      { t: "Excessive tachycardia from reflex activation", ok: false },
      { t: "Unopposed alpha-mediated coronary vasospasm and worsened hypertension", ok: true },
      { t: "Serotonin syndrome from drug interaction", ok: false },
      { t: "Acute kidney injury from renal vasoconstriction", ok: false },
    ],
    rationale: "Cocaine blocks norepinephrine reuptake, producing alpha and beta stimulation. A beta-blocker alone removes beta-2 vasodilation while alpha-1 vasoconstriction remains unopposed, worsening coronary vasospasm and hypertension. (A) is wrong because beta-blockade reduces tachycardia; the concern is vascular. (C) is wrong because this combination does not produce serotonin syndrome. (D) is wrong because the primary danger is coronary vasospasm and myocardial ischemia. Pearl: Labetalol (combined alpha and beta blocker) or benzodiazepines are safer alternatives for cocaine-induced hypertension.",
    scene: "pharmacology",
    sceneCfg: { label: "BETA BLOCKERS" },
    metadata: { topic: "Beta Blockers", priority: "high" },
  },

  {
    id: "ap1-w3-045",
    type: "mcq",
    prompt: "Nonselective beta-blockers may precipitate bronchoconstriction in asthmatic patients because they block:",  // source: deck 2, slide 17
    setup: "",
    ans: [
      { t: "Alpha-1 receptors on bronchial smooth muscle", ok: false },
      { t: "Muscarinic receptors on airway glands", ok: false },
      { t: "Beta-2 receptors on bronchial smooth muscle", ok: true },
      { t: "Beta-1 receptors on pulmonary vascular endothelium", ok: false },
    ],
    rationale: "Beta-2 receptors on bronchial smooth muscle mediate bronchodilation. Nonselective beta-blockers (propranolol, timolol) block these, removing bronchodilatory tone and allowing unopposed parasympathetic bronchoconstriction. (A) is wrong because alpha-1 on bronchial muscle is not the mechanism. (B) is wrong because beta-blockers do not block muscarinic receptors. (D) is wrong because pulmonary endothelial beta-1 is not responsible for airway tone. Pearl: Beta-1 selective blockers (metoprolol, atenolol, esmolol) are safer for asthmatic patients because they spare beta-2 at therapeutic doses, though selectivity is dose-dependent.",
    scene: "pharmacology",
    sceneCfg: { label: "BETA BLOCKERS" },
    metadata: { topic: "Beta Blockers", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  LABETALOL  (deck 2, slides 20–21)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-046",
    type: "mcq",
    prompt: "Labetalol generally maintains cardiac output during blood pressure reduction because it combines:",  // source: deck 2, slide 20
    setup: "",
    ans: [
      { t: "Alpha-1 blockade (vasodilation) with nonselective beta blockade", ok: true },
      { t: "Alpha-2 agonism (sympatholysis) with selective beta-1 blockade", ok: false },
      { t: "Calcium channel blockade with beta-2 agonism", ok: false },
      { t: "PDE III inhibition with alpha-1 agonism", ok: false },
    ],
    rationale: "Labetalol blocks alpha-1 receptors (vasodilation, decreased SVR) and nonselectively blocks beta receptors (reduced HR and contractility). The alpha-1 vasodilation offsets beta-mediated cardiac depression, so cardiac output is generally maintained. (B) is wrong because labetalol is an antagonist and blocks alpha-1, not stimulates alpha-2. (C) is wrong because labetalol does not block calcium channels. (D) is wrong because labetalol does not inhibit PDE III. Pearl: The IV beta-to-alpha blocking ratio is ~7:1; beta blockade predominates, but alpha-1 blockade is sufficient to preserve cardiac output.",
    scene: "pharmacology",
    sceneCfg: { label: "LABETALOL" },
    metadata: { topic: "Labetalol", priority: "high" },
  },

  {
    id: "ap1-w3-047",
    type: "mcq",
    prompt: "Labetalol preserves the alpha-2 negative feedback loop on norepinephrine release because it:",  // source: deck 2, slide 21
    setup: "",
    ans: [
      { t: "Blocks alpha-1 receptors but does not block alpha-2 receptors", ok: true },
      { t: "Stimulates alpha-2 receptors directly", ok: false },
      { t: "Blocks both alpha-1 and alpha-2 receptors equally", ok: false },
      { t: "Has no effect on any alpha receptor subtype", ok: false },
    ],
    rationale: "Labetalol selectively blocks alpha-1 while sparing alpha-2. Presynaptic alpha-2 receptors provide negative feedback limiting norepinephrine release. By preserving this feedback, labetalol avoids the excessive reflex tachycardia seen with nonselective alpha-blockers like phentolamine. (B) is wrong because labetalol does not stimulate alpha-2; it simply does not block them. (C) is wrong because blocking alpha-2 would disrupt feedback, increasing tachycardia. (D) is wrong because labetalol clearly blocks alpha-1. Pearl: This alpha-2 sparing property makes labetalol useful for pheochromocytoma management and clonidine withdrawal.",
    scene: "pharmacology",
    sceneCfg: { label: "LABETALOL" },
    metadata: { topic: "Labetalol", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  CALCIUM CHANNEL BLOCKERS  (deck 2, slides 22–29)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-048",
    type: "mcq",
    prompt: "Verapamil is contraindicated in Wolff-Parkinson-White (WPW) syndrome with atrial fibrillation because it may:",  // source: deck 2, slide 22
    setup: "",
    ans: [
      { t: "Abolish the accessory pathway permanently", ok: false },
      { t: "Accelerate conduction through the accessory pathway", ok: true },
      { t: "Cause severe bronchoconstriction", ok: false },
      { t: "Produce extreme hypertension from alpha-1 stimulation", ok: false },
    ],
    rationale: "Verapamil slows AV nodal conduction but does not slow the accessory pathway. Rapid atrial impulses are redirected through the unblocked pathway, potentially degenerating into ventricular fibrillation. (A) is wrong because verapamil does not ablate the pathway. (C) is wrong because verapamil does not cause bronchoconstriction. (D) is wrong because verapamil causes vasodilation, not hypertension. Pearl: All AV nodal blocking agents (verapamil, diltiazem, digoxin, adenosine) are contraindicated in WPW with atrial fibrillation; procainamide is preferred.",
    scene: "pharmacology",
    sceneCfg: { label: "CALCIUM CHANNEL BLOCKERS" },
    metadata: { topic: "Calcium Channel Blockers", priority: "high" },
  },

  {
    id: "ap1-w3-049",
    type: "mcq",
    prompt: "Nifedipine frequently causes reflex tachycardia because it is a potent:",  // source: deck 2, slide 24
    setup: "",
    ans: [
      { t: "Venous dilator that pools blood peripherally", ok: false },
      { t: "Arterial vasodilator with minimal cardiac nodal effects", ok: true },
      { t: "AV nodal depressant triggering compensatory mechanisms", ok: false },
      { t: "Beta-1 agonist directly stimulating the SA node", ok: false },
    ],
    rationale: "Nifedipine is a dihydropyridine that produces potent arterial vasodilation with minimal SA and AV node effects. The rapid blood pressure drop triggers baroreceptor-mediated reflex sympathetic activation, producing tachycardia. (A) is wrong because nifedipine is primarily arterial, not venous. (C) is wrong because AV nodal depression characterizes verapamil and diltiazem, not nifedipine. (D) is wrong because nifedipine does not stimulate beta-1 receptors. Pearl: Reflex tachycardia from dihydropyridines is problematic in coronary artery disease because increased heart rate raises myocardial oxygen demand.",
    scene: "pharmacology",
    sceneCfg: { label: "CALCIUM CHANNEL BLOCKERS" },
    metadata: { topic: "Calcium Channel Blockers", priority: "high" },
  },

  {
    id: "ap1-w3-050",
    type: "mcq",
    prompt: "Calcium channel blockers potentiate the effects of which drugs used during anesthesia?",  // source: deck 2, slide 28
    setup: "",
    ans: [
      { t: "Inhaled anesthetic agents exclusively", ok: false },
      { t: "Both depolarizing and nondepolarizing neuromuscular blocking agents", ok: true },
      { t: "Opioid analgesics exclusively", ok: false },
      { t: "Local anesthetics exclusively", ok: false },
    ],
    rationale: "CCBs potentiate both depolarizing and nondepolarizing NMB agents. Calcium is essential for acetylcholine release at the neuromuscular junction; blocking calcium entry reduces neurotransmitter release and enhances the block. (A) is wrong because while CCBs may cause additive cardiovascular depression with inhaled agents, the specific potentiation applies to NMB agents. (C) is wrong because CCBs do not specifically potentiate opioids. (D) is wrong because the interaction is with NMB agents, not local anesthetics. Pearl: Patients on chronic CCB therapy receiving NMB agents require close quantitative train-of-four monitoring for prolonged block.",
    scene: "pharmacology",
    sceneCfg: { label: "CALCIUM CHANNEL BLOCKERS" },
    metadata: { topic: "Calcium Channel Blockers", priority: "high" },
  },

  {
    id: "ap1-w3-051",
    type: "mcq",
    prompt: "Diltiazem is often preferred over verapamil when combined with a beta-blocker because diltiazem produces:",  // source: deck 2, slide 27
    setup: "",
    ans: [
      { t: "More potent AV nodal blockade", ok: false },
      { t: "Less myocardial contractility depression", ok: true },
      { t: "Stronger arterial vasodilation", ok: false },
      { t: "Complete beta-receptor antagonism as an additive effect", ok: false },
    ],
    rationale: "Diltiazem (benzothiazepine) produces less contractility depression than verapamil (phenylalkylamine) when combined with beta-blockers, making the combination safer. (A) is wrong because stronger AV blockade would increase risk, not make it preferable. (C) is wrong because diltiazem is not a more potent vasodilator. (D) is wrong because diltiazem does not block beta receptors. Pearl: Combining verapamil with a beta-blocker carries higher risk of severe bradycardia, heart block, and acute heart failure than the diltiazem combination.",
    scene: "pharmacology",
    sceneCfg: { label: "CALCIUM CHANNEL BLOCKERS" },
    metadata: { topic: "Calcium Channel Blockers", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ACE INHIBITORS AND ARBs  (deck 2, slides 31–37)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-052",
    type: "mcq",
    prompt: "The dry cough and angioedema associated with ACE inhibitors are caused by accumulation of:",  // source: deck 2, slide 33
    setup: "",
    ans: [
      { t: "Angiotensin II", ok: false },
      { t: "Aldosterone", ok: false },
      { t: "Bradykinin", ok: true },
      { t: "Renin", ok: false },
    ],
    rationale: "ACE normally degrades bradykinin. When inhibited, bradykinin accumulates in the lungs and airways, causing persistent dry cough (5% to 20% of patients) and rarely angioedema. (A) is wrong because ACE inhibitors decrease angiotensin II, not increase it. (B) is wrong because aldosterone is reduced, not accumulated. (D) is wrong because while renin increases via feedback, it does not cause cough. Pearl: Switching to an ARB eliminates the cough because ARBs block angiotensin II receptors without affecting bradykinin metabolism.",
    scene: "pharmacology",
    sceneCfg: { label: "ACE INHIBITORS AND ARBs" },
    metadata: { topic: "ACE Inhibitors and ARBs", priority: "high" },
  },

  {
    id: "ap1-w3-053",
    type: "mcq",
    prompt: "Angiotensin receptor blockers (ARBs) differ from ACE inhibitors in that ARBs:",  // source: deck 2, slide 34
    setup: "",
    ans: [
      { t: "Block bradykinin degradation more completely", ok: false },
      { t: "Do not increase bradykinin levels, avoiding cough", ok: true },
      { t: "Activate the angiotensin II receptor directly", ok: false },
      { t: "Increase aldosterone secretion as a side effect", ok: false },
    ],
    rationale: "ARBs block the AT1 receptor directly without inhibiting ACE, so bradykinin is degraded normally and cough does not occur. (A) is wrong because ARBs do not affect bradykinin at all. (C) is wrong because ARBs block (antagonize) the receptor, not activate it. (D) is wrong because ARBs decrease aldosterone by blocking angiotensin II signaling. Pearl: Despite avoiding bradykinin side effects, ARBs share the same perioperative concern as ACE inhibitors: risk of refractory intraoperative hypotension.",
    scene: "pharmacology",
    sceneCfg: { label: "ACE INHIBITORS AND ARBs" },
    metadata: { topic: "ACE Inhibitors and ARBs", priority: "high" },
  },

  {
    id: "ap1-w3-054",
    type: "mcq",
    prompt: "The primary perioperative concern with ACE inhibitors and ARBs is:",  // source: deck 2, slide 36
    setup: "",
    ans: [
      { t: "Severe hyperkalemia requiring emergent dialysis", ok: false },
      { t: "Refractory intraoperative hypotension", ok: true },
      { t: "Malignant hypertension during induction", ok: false },
      { t: "Prolonged neuromuscular blockade", ok: false },
    ],
    rationale: "These drugs impair the renin-angiotensin system's ability to compensate for anesthesia-induced vasodilation and reduced preload, leading to refractory intraoperative hypotension. (A) is wrong because hyperkalemia is rarely that severe perioperatively. (C) is wrong because these drugs lower blood pressure, not raise it. (D) is wrong because they do not affect neuromuscular blockade. Pearl: Many practitioners hold ACE inhibitors and ARBs 12 to 24 hours preoperatively; intraoperative hypotension may respond to fluids, catecholamines, or vasopressin.",
    scene: "pharmacology",
    sceneCfg: { label: "ACE INHIBITORS AND ARBs" },
    metadata: { topic: "ACE Inhibitors and ARBs", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  VASODILATORS  (deck 2, slides 39–44)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-055",
    type: "mcq",
    prompt: "Inhaled nitric oxide acts as a selective pulmonary vasodilator because it:",  // source: deck 2, slide 40
    setup: "",
    ans: [
      { t: "Is rapidly inactivated by hemoglobin in the blood", ok: true },
      { t: "Only activates receptors unique to the pulmonary endothelium", ok: false },
      { t: "Is converted to an active form exclusively in lung tissue", ok: false },
      { t: "Requires alveolar surfactant for activation", ok: false },
    ],
    rationale: "Inhaled NO reaches ventilated alveoli, diffuses into adjacent pulmonary vascular smooth muscle, and activates guanylate cyclase to produce cGMP-mediated vasodilation. When NO enters the bloodstream, hemoglobin rapidly binds and inactivates it, preventing systemic vasodilation. (B) is wrong because NO activates the same guanylate cyclase in all vascular beds; selectivity comes from delivery route and rapid inactivation. (C) is wrong because NO acts directly without conversion. (D) is wrong because surfactant is not involved. Pearl: Uses include PPHN, acute pulmonary HTN, and RV failure; NO half-life in blood is less than 5 seconds.",
    scene: "pharmacology",
    sceneCfg: { label: "VASODILATORS" },
    metadata: { topic: "Vasodilators", priority: "high" },
  },

  {
    id: "ap1-w3-056",
    type: "mcq",
    prompt: "The most dangerous toxicity specific to sodium nitroprusside is:",  // source: deck 2, slide 41
    setup: "",
    ans: [
      { t: "Methemoglobinemia from nitrate formation", ok: false },
      { t: "Cyanide toxicity from release of cyanide ions", ok: true },
      { t: "Bradykinin accumulation causing angioedema", ok: false },
      { t: "Serotonin syndrome from monoamine interaction", ok: false },
    ],
    rationale: "Nitroprusside contains five cyanide groups that are released during metabolism to produce NO. With prolonged infusion or high doses, cyanide can accumulate, inhibiting cytochrome oxidase and halting cellular respiration. (A) is wrong because methemoglobinemia is more associated with nitroglycerin. (C) is wrong because bradykinin accumulation is an ACE inhibitor effect. (D) is wrong because nitroprusside does not interact with serotonin. Pearl: Signs of cyanide toxicity include tachyphylaxis, metabolic acidosis, and elevated mixed venous O2 saturation; treat with sodium thiosulfate or hydroxocobalamin.",
    scene: "pharmacology",
    sceneCfg: { label: "VASODILATORS" },
    metadata: { topic: "Vasodilators", priority: "high" },
  },

  {
    id: "ap1-w3-057",
    type: "mcq",
    prompt: "Nitroglycerin reduces cardiac preload primarily by dilating:",  // source: deck 2, slide 42
    setup: "",
    ans: [
      { t: "Arterioles, decreasing afterload", ok: false },
      { t: "Venous capacitance vessels, reducing venous return", ok: true },
      { t: "Pulmonary arteries, reducing RV afterload", ok: false },
      { t: "Coronary arteries exclusively", ok: false },
    ],
    rationale: "At therapeutic doses, nitroglycerin preferentially dilates venous capacitance vessels, pooling blood in the venous system and reducing venous return (preload). This decreases wall stress and myocardial oxygen demand. (A) is wrong because arteriolar dilation is a higher-dose effect; the predominant low-dose effect is venodilation. (C) is wrong because pulmonary arterial dilation is secondary. (D) is wrong because while nitroglycerin dilates coronary arteries, the preload reduction is from systemic venodilation. Pearl: Avoid nitroglycerin in HOCM and severe aortic stenosis; these preload-dependent conditions worsen with reduced venous return.",
    scene: "pharmacology",
    sceneCfg: { label: "VASODILATORS" },
    metadata: { topic: "Vasodilators", priority: "high" },
  },

  {
    id: "ap1-w3-058",
    type: "mcq",
    prompt: "Hydralazine is commonly used in pregnancy-related hypertension because it:",  // source: deck 2, slide 43
    setup: "",
    ans: [
      { t: "Crosses the placenta to lower fetal blood pressure", ok: false },
      { t: "Is a direct arterial vasodilator with an established safety profile in pregnancy", ok: true },
      { t: "Blocks angiotensin receptors without affecting the fetus", ok: false },
      { t: "Inhibits catecholamine synthesis in the adrenal medulla", ok: false },
    ],
    rationale: "Hydralazine is a direct arteriolar vasodilator with a long history of safe use in pregnancy hypertension including preeclampsia. It effectively lowers blood pressure without the teratogenic risks of ACE inhibitors and ARBs. (A) is wrong because lowering fetal blood pressure is not the goal. (C) is wrong because hydralazine is not an ARB; ARBs are contraindicated in pregnancy. (D) is wrong because hydralazine does not affect catecholamine synthesis. Pearl: Reflex tachycardia and fluid retention are common side effects; prolonged use can cause drug-induced lupus, especially in slow acetylators.",
    scene: "pharmacology",
    sceneCfg: { label: "VASODILATORS" },
    metadata: { topic: "Vasodilators", priority: "high" },
  },

  {
    id: "ap1-w3-059",
    type: "mcq",
    prompt: "Fenoldopam lowers blood pressure and improves renal perfusion by selectively activating:",  // source: deck 2, slide 44
    setup: "",
    ans: [
      { t: "Beta-1 cardiac receptors", ok: false },
      { t: "Alpha-2 presynaptic receptors", ok: false },
      { t: "D1 dopamine receptors", ok: true },
      { t: "Endothelin-B receptors", ok: false },
    ],
    rationale: "Fenoldopam is a selective D1 agonist that produces systemic and renal vasodilation, increasing renal blood flow, sodium excretion, and urine output. It is given as a continuous IV infusion (half-life ~10 minutes) for hypertensive emergencies. (A) is wrong because fenoldopam does not activate beta-1. (B) is wrong because alpha-2 activation describes clonidine and dexmedetomidine. (D) is wrong because fenoldopam does not act on endothelin receptors. Pearl: Fenoldopam increases intraocular pressure and should be used with caution in patients with glaucoma.",
    scene: "pharmacology",
    sceneCfg: { label: "VASODILATORS" },
    metadata: { topic: "Vasodilators", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  DIURETICS  (deck 2, slide 45)
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: "ap1-w3-060",
    type: "mcq",
    prompt: "Thiazide diuretics are recommended as first-line pharmacotherapy for:",  // source: deck 2, slide 45
    setup: "",
    ans: [
      { t: "Acute decompensated heart failure", ok: false },
      { t: "Systemic hypertension", ok: true },
      { t: "Acute pulmonary edema requiring urgent diuresis", ok: false },
      { t: "Hyperkalemia in renal failure", ok: false },
    ],
    rationale: "Thiazide diuretics are first-line for systemic hypertension based on trials demonstrating reduction in cardiovascular events and mortality. (A) is wrong because acute heart failure requires loop diuretics (furosemide), which are more potent. (C) is wrong because acute pulmonary edema also requires loop diuretics. (D) is wrong because thiazides do not directly treat hyperkalemia; they can actually worsen hypokalemia. Pearl: In renal insufficiency (GFR below 30), thiazides become ineffective and loop diuretics are substituted; potassium-sparing diuretics and aldosterone antagonists (spironolactone) provide additional benefit in chronic heart failure.",
    scene: "pharmacology",
    sceneCfg: { label: "DIURETICS" },
    metadata: { topic: "Diuretics", priority: "medium" },
  },

];

export const AP1_WK3_METADATA = {
  nodeId: "ap1-wk-3",
  courseId: "adv-pharmacology-1",
  chapter: "Stoelting Ch 15, 18, 19, 20",
  title: "Sympathomimetics, Antihypertensives, Vasodilators, Heart Failure",
  totalQuestions: 60,
  questionTypes: { mcq: 60, multi: 0, short: 0 },
};
