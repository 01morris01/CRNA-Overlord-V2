/**
 * Advanced Physiology & Pathophysiology — Node 8
 * Chapters 15–16: Vascular Distensibility / Microcirculation & Lymphatics
 * Source: Guyton & Hall 14e (local extracted text)
 */

export const PATHO_NODE8_QUESTIONS = [

  {
    id: "patho-n8-001",
    type: "mcq",
    prompt: "Guyton defines vascular COMPLIANCE as:",
    setup: "",
    ans: [
      { t: "ΔVolume / ΔPressure — volume change accepted for a given pressure change",  ok: true  },
      { t: "ΔPressure / ΔVolume — the elastic recoil pressure of a distended vessel wall", ok: false },
      { t: "Flow divided by resistance across the segment of interest in the circulation",  ok: false },
      { t: "Volume multiplied by pressure — a measure of stored hydraulic energy in vessels", ok: false },
    ],
    rationale: "Compliance = ΔV/ΔP. Distensibility is the fractional volume change per unit pressure change. Veins have ~8× the distensibility of arteries and hold about 20× as much volume per mmHg of transmural pressure — hence their role as the body's blood reservoir.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "COMPLIANCE = ΔV / ΔP", radius: 70, wall: 6 },
    metadata: { topic: "Compliance", priority: "high" },
  },

  {
    id: "patho-n8-002",
    type: "mcq",
    prompt: "A patient with chronic hypertension develops left ventricular hypertrophy. What adaptive benefit does LVH confer, and what is its principal harm?",
    setup: "",
    ans: [
      { t: "Benefit: thicker wall lowers wall tension per Laplace (T = P·r/h); harm: rising myocardial O₂ demand and impaired subendocardial perfusion", ok: true  },
      { t: "Benefit: more contractile mass to eject blood with no cost; harm: essentially none, because increased muscle mass simply improves pumping",     ok: false },
      { t: "Benefit: LVH lowers resting heart rate by a mass effect; harm: atrial and ventricular arrhythmias from scar and fiber disarray in the wall",    ok: false },
      { t: "Benefit: greater preload reserve for filling; harm: a chronically low ejection fraction despite preserved stroke volume and normal CO",         ok: false },
    ],
    rationale: "Laplace: T = P·r/h (tension = pressure × radius / wall thickness). When a ventricle must generate higher pressures, the initial adaptation is concentric hypertrophy — increasing h to keep wall tension constant. The cost is a thicker wall that is harder to perfuse during diastole, leading to subendocardial ischemia, diastolic dysfunction, and eventually heart failure with preserved ejection fraction.",
    scene: "vessel_cross_section",
    sceneCfg: { label: "LAPLACE: T = P·r/h", radius: 70, wall: 26,
      eqLines: ["T = (P × r) / h", "thicker wall → lower T"],
    },
    metadata: { topic: "Laplace Law", priority: "high" },
  },

  {
    id: "patho-n8-003",
    type: "mcq",
    prompt: "What is the primary determinant of CAPILLARY filtration across the wall under Starling's hypothesis?",
    setup: "",
    ans: [
      { t: "Starling equation: Net flux = Kf × [(Pc − Pif) − σ(πc − πif)]", ok: true  },
      { t: "Cardiac output determined by Frank-Starling length-tension law", ok: false },
      { t: "Systemic vascular resistance set by the arteriolar smooth muscle", ok: false },
      { t: "Arterial blood pressure at the aortic root transmitted to tissues", ok: false },
    ],
    rationale: "Starling: Net flux = Kf × [(Pc − Pif) − σ(πc − πif)], where Pc is capillary hydrostatic pressure, Pif is interstitial hydrostatic pressure (normally slightly negative), πc is capillary oncotic pressure (from plasma proteins, mainly albumin, ~25 mmHg), and πif is interstitial oncotic pressure. Kf is the filtration coefficient and σ is the reflection coefficient for protein. Edema results whenever this equation favors outward flux.",
    scene: "starling_forces",
    sceneCfg: { label: "STARLING EQUATION", Pc: "+32", piC: "−25", Pif: "−3", piIf: "+8", net: "+2" },
    metadata: { topic: "Starling Forces", priority: "high" },
  },

  {
    id: "patho-n8-004",
    type: "multi",
    prompt: "Select the THREE mechanisms that can cause peripheral edema:",
    setup: "",
    choices: [
      "Increased capillary hydrostatic pressure from venous obstruction or right-sided heart failure",
      "Decreased plasma oncotic pressure from nephrotic syndrome, cirrhosis, or severe malnutrition",
      "Lymphatic obstruction from filariasis, lymph node dissection, or chronic lymphedema processes",
      "Decreased interstitial hydrostatic pressure as the primary driver of fluid shift into tissues",
      "Increased plasma oncotic pressure pulling fluid from the interstitium into the vasculature",
    ],
    correctAnswers: [
      "Increased capillary hydrostatic pressure from venous obstruction or right-sided heart failure",
      "Decreased plasma oncotic pressure from nephrotic syndrome, cirrhosis, or severe malnutrition",
      "Lymphatic obstruction from filariasis, lymph node dissection, or chronic lymphedema processes",
    ],
    selectCount: 3,
    rationale: "Edema develops whenever the Starling balance is shifted outward AND lymphatics cannot keep up. The classic triad is ↑Pc, ↓πc, or impaired lymph drainage. Capillary leak (sepsis, burns) — by lowering σ — is a fourth mechanism. High plasma oncotic pressure would pull fluid INTO the vasculature, reducing edema.",
    scene: "starling_forces",
    sceneCfg: { label: "EDEMA — STARLING FAILURE", Pc: "+40↑", piC: "−15↓", Pif: "−3", piIf: "+15" },
    metadata: { topic: "Edema Mechanisms", priority: "high" },
  },

  {
    id: "patho-n8-005",
    type: "mcq",
    prompt: "Why does a patient with cirrhosis develop ascites in addition to peripheral edema?",
    setup: "",
    ans: [
      { t: "Portal hypertension raises hepatic capillary hydrostatic pressure AND impaired albumin synthesis lowers oncotic pressure, driving transudation", ok: true  },
      { t: "Increased aldosterone from secondary hyperaldosteronism directly causes peritoneal fluid accumulation independent of any Starling-force mechanism", ok: false },
      { t: "Cirrhosis causes isolated lymphatic obstruction of the cisterna chyli, blocking thoracic duct return and leading to chylous ascites formation",      ok: false },
      { t: "Cirrhosis actually raises capillary oncotic pressure, which paradoxically pulls fluid out of vessels into the peritoneum during advanced disease",    ok: false },
    ],
    rationale: "Cirrhosis causes ascites via a double Starling hit: portal hypertension elevates hepatic sinusoidal hydrostatic pressure, and impaired hepatic albumin synthesis reduces plasma oncotic pressure. Secondary hyperaldosteronism (from effective arterial blood volume sensing as 'low') amplifies sodium and water retention, worsening the whole process.",
    scene: "starling_forces",
    sceneCfg: { label: "CIRRHOSIS — ↑Pc + ↓πc", Pc: "+40", piC: "−12", Pif: "0", piIf: "+10" },
    metadata: { topic: "Ascites", priority: "high" },
  },

  {
    id: "patho-n8-006",
    type: "mcq",
    prompt: "Under Guyton's framework, normal lymphatic flow for the whole body is approximately:",
    setup: "",
    ans: [
      { t: "~120 mL/hour — roughly 2–3 L/day",  ok: true  },
      { t: "~1 mL/hour — trivial resting flow",  ok: false },
      { t: "~20 L/day — near total plasma volume", ok: false },
      { t: "~0.1 mL/day — essentially no flow",    ok: false },
    ],
    rationale: "Guyton estimates ~120 mL/hr of lymph flow (2–3 L/day) under resting conditions. Lymph returns filtered protein and fluid from the interstitium to the thoracic duct, which empties into the left subclavian vein. Lymph flow can rise 10–20× with exercise or high interstitial pressure. When filtration outruns this reserve (the 'safety factor'), edema develops.",
    scene: null,
    metadata: { topic: "Lymphatic Flow", priority: "low" },
  },

  {
    id: "patho-n8-007",
    type: "mcq",
    prompt: "Interstitial hydrostatic pressure in loose subcutaneous tissue under NORMAL conditions is:",
    setup: "",
    ans: [
      { t: "Slightly negative, approximately −3 to −5 mmHg",   ok: true  },
      { t: "Very close to 0 mmHg under resting conditions",     ok: false },
      { t: "Slightly positive, approximately +5 mmHg normally", ok: false },
      { t: "Markedly positive, approximately +20 mmHg normally", ok: false },
    ],
    rationale: "Guyton's classic measurement: resting interstitial hydrostatic pressure is about −3 mmHg. This slightly negative pressure keeps the interstitium 'tight' and helps hold cells together. When Pif rises toward zero and then positive, tissues begin to pit and edema becomes clinically evident. This is part of the 'safety factor' against edema.",
    scene: "starling_forces",
    sceneCfg: { label: "Pif ≈ −3 mmHg (Guyton)", Pc: "+32", piC: "−25", Pif: "−3", piIf: "+8" },
    metadata: { topic: "Interstitial Pressure", priority: "medium" },
  },

  {
    id: "patho-n8-008",
    type: "mcq",
    prompt: "Why is plasma ALBUMIN more important for capillary oncotic pressure than equal concentrations of other plasma proteins?",
    setup: "",
    ans: [
      { t: "Albumin has the highest molar concentration — small MW (~69 kDa) at ~4.5 g/dL means more particles per gram than globulins",  ok: true  },
      { t: "Albumin has the highest molecular weight of any plasma protein, so each molecule exerts the most osmotic pull on water",        ok: false },
      { t: "Albumin is actively transported across the capillary wall by specialized endothelial carriers, maintaining a steep gradient",     ok: false },
      { t: "Albumin binds water molecules more tightly than any other plasma protein, effectively holding water inside the capillary lumen",  ok: false },
    ],
    rationale: "Oncotic pressure depends on number of particles, not mass. Albumin has a smaller MW (~69,000) than globulins (~150,000–900,000) but is present in much higher concentration, giving it ~80% of total plasma oncotic pressure despite being only ~60% of total plasma protein mass. Hypoalbuminemia thus disproportionately reduces πc.",
    scene: "starling_forces",
    sceneCfg: { label: "ALBUMIN DOMINATES πc", Pc: "+32", piC: "−25", Pif: "−3", piIf: "+8" },
    metadata: { topic: "Oncotic Pressure", priority: "high" },
  },

  {
    id: "patho-n8-009",
    type: "short",
    prompt: "Which specific capillary wall protein (lateral cell gap) largely determines solute permeability in continuous capillaries — named after the structure that closes the cleft?",
    setup: "",
    acceptedAnswers: ["tight junction", "tight junctions", "intercellular cleft", "intercellular clefts"],
    canonicalAnswer: "Intercellular cleft / tight junction",
    rationale: "Continuous capillaries (muscle, skin, lung) have endothelial cells joined by tight junctions that leave narrow intercellular clefts. Water and small solutes pass through clefts; larger molecules (like albumin) mostly cannot. Fenestrated capillaries (kidney, gut, endocrine) have pores; sinusoidal capillaries (liver, spleen) have large gaps that allow even protein exchange.",
    scene: null,
    metadata: { topic: "Capillary Structure", priority: "medium" },
  },

  {
    id: "patho-n8-010",
    type: "mcq",
    prompt: "A 60-year-old with right heart failure has bilateral pitting leg edema. What is the dominant Starling abnormality?",
    setup: "",
    ans: [
      { t: "Elevated capillary hydrostatic pressure from increased venous pressure transmitted retrograde into the systemic veins",  ok: true  },
      { t: "Decreased capillary oncotic pressure from protein loss across the glomerular filtration barrier in nephrotic syndrome",    ok: false },
      { t: "Increased interstitial oncotic pressure pulling water into the tissues from the capillary lumen along Starling gradients",  ok: false },
      { t: "Obstruction of lymphatic return from the lower extremities caused by pelvic malignancy or lymph node dissection",            ok: false },
    ],
    rationale: "Right HF raises central venous pressure, which transmits back into systemic veins and then capillaries, elevating Pc. The Starling balance shifts outward and fluid accumulates in dependent tissues. Protein is not lost (πc is usually normal), so reabsorption at the venous end of the capillary fails and pitting edema develops.",
    scene: "starling_forces",
    sceneCfg: { label: "RHF — ↑Pc PITTING EDEMA", Pc: "+42", piC: "−25", Pif: "+2", piIf: "+8" },
    metadata: { topic: "Right HF Edema", priority: "high" },
  },

  {
    id: "patho-n8-011",
    type: "mcq",
    prompt: "Pulse pressure is increased in all of these EXCEPT:",
    setup: "",
    ans: [
      { t: "Aortic stenosis — narrows pulse pressure", ok: true  },
      { t: "Aortic regurgitation — widens pulse pressure", ok: false },
      { t: "Patent ductus arteriosus — widens pulse pressure", ok: false },
      { t: "Hyperthyroidism — high-output state widens pulse pressure", ok: false },
    ],
    rationale: "Wide pulse pressure occurs when stroke volume is ejected into a stiff/open circulation that can't hold diastolic pressure — aortic regurgitation (runs off into LV), PDA (runs off into pulmonary circuit), hyperthyroidism (high SV + vasodilation), and arteriosclerosis (stiff aorta). Aortic STENOSIS NARROWS pulse pressure because the fixed outflow obstruction limits peak systolic pressure and lengthens ejection time (pulsus parvus et tardus).",
    scene: null,
    metadata: { topic: "Pulse Pressure", priority: "high" },
  },

  {
    id: "patho-n8-012",
    type: "mcq",
    prompt: "Which mechanism best explains the 'cold and clammy' skin of a hemorrhaging patient?",
    setup: "",
    ans: [
      { t: "Baroreflex-driven α₁ sympathetic vasoconstriction of cutaneous arterioles shifts blood to vital organs", ok: true  },
      { t: "Direct cooling of the skin by the loss of circulating blood volume during an acute hemorrhage episode",    ok: false },
      { t: "Acute release of histamine from circulating basophils triggered by the stress response after blood loss",   ok: false },
      { t: "Parasympathetic vagal discharge from the medullary vasomotor center constricting peripheral vascular beds",  ok: false },
    ],
    rationale: "Hemorrhage → baroreflex → massive sympathetic outflow → α₁ vasoconstriction in skin, gut, and kidney to shunt blood to heart and brain. Cutaneous vasoconstriction leaves the skin pale, cool, and diaphoretic (sweat from sympathetic cholinergic fibers). This is one of the earliest visible signs of compensated shock.",
    scene: "patient",
    sceneCfg: { label: "HEMORRHAGE — COMPENSATED SHOCK", heartRate: 118 },
    metadata: { topic: "Shock Compensation", priority: "medium" },
  },

];

export const PATHO_NODE8_METADATA = {
  nodeId:   "patho-node-8",
  courseId: "adv-phys-path-1",
  chapter:  "Chapters 15–16",
  title:    "Vascular Distensibility & Microcirculation",
  totalQuestions: PATHO_NODE8_QUESTIONS.length,
  questionTypes: {
    mcq:   PATHO_NODE8_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: PATHO_NODE8_QUESTIONS.filter(q => q.type === 'multi').length,
    short: PATHO_NODE8_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
