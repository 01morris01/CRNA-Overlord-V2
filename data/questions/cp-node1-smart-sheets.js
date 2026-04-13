/**
 * Chemistry & Physics for Anesthesia — Node 1
 * Smart Sheets & Course Foundations
 *
 * Source: SS #1 (1).pdf — the master clinical reference sheet covering
 * induction agents, NMBs, opioids, vasopressors, anticholinergics, reversal
 * agents, antihypertensives, antiemetics, hemodynamic normals, MAC values,
 * inhaled anesthetic properties, OHD curve shifts, MH protocol, lung volumes,
 * local anesthetic max doses, and catecholamine dose ranges.
 *
 * This node is TIMED normally (NOT untimed). It tests recall of the reference
 * data that SRNAs are expected to have memorized.
 */

export const CP_NODE1_QUESTIONS = [

  // ═══════════════════════════════════════════════════════════════════════════
  // IV INDUCTION AGENTS — doses and key facts
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n1-001",
    type: "mcq",
    prompt: "What is the standard IV induction dose of propofol?",
    setup: "",
    ans: [
      { t: "1–2.5 mg/kg IV — supplied as 10 mg/mL",  ok: true  },
      { t: "0.2–0.4 mg/kg IV — that is the etomidate range",  ok: false },
      { t: "1–2 mg/kg IV — that is the ketamine IV induction range", ok: false },
      { t: "0.1 mg/kg IV — that is the midazolam dose range", ok: false },
    ],
    rationale: "Propofol induction: 1–2.5 mg/kg IV (supplied 10 mg/mL). Onset 30–60 sec. Duration 3–8 min. Pain on injection is common; allergy caution with egg/soy. Causes ↓CV (↓SVR) and respiratory depression.",
    scene: null,
    metadata: { topic: "Induction Agents", priority: "high" },
  },

  {
    id: "cp-n1-002",
    type: "mcq",
    prompt: "Etomidate is chosen for hemodynamically unstable patients because it is 'CV stable.' What is its induction dose?",
    setup: "",
    ans: [
      { t: "0.2–0.4 mg/kg IV — supplied as 2 mg/mL",  ok: true  },
      { t: "1–2.5 mg/kg IV — that is the propofol induction dose",  ok: false },
      { t: "1–2 mg/kg IV — that is the ketamine IV induction range",  ok: false },
      { t: "1 mg/kg IV — that is the methohexital induction dose",  ok: false },
    ],
    rationale: "Etomidate 0.2–0.4 mg/kg IV (2 mg/mL). Onset 30 sec, duration 3–10 min. CV stable. Side effects: myoclonus, pain on injection, adrenal suppression (↓cortisol), epileptiform EEG. Avoid in porphyria/asthma.",
    scene: null,
    metadata: { topic: "Induction Agents", priority: "high" },
  },

  {
    id: "cp-n1-003",
    type: "mcq",
    prompt: "What is the IV induction dose of ketamine, and what unique property distinguishes it from other induction agents?",
    setup: "",
    ans: [
      { t: "1–2 mg/kg IV — it is the only IV induction agent that INCREASES HR and BP",  ok: true  },
      { t: "0.2–0.4 mg/kg IV — it causes hypotension like propofol during induction",  ok: false },
      { t: "3–5 mg/kg IV — that is the thiopental IV induction dose, not ketamine",  ok: false },
      { t: "0.1 mg/kg IV — that is midazolam dosing, not ketamine IV induction",  ok: false },
    ],
    rationale: "Ketamine 1–2 mg/kg IV (also 4–6 mg/kg IM for uncooperative patients). Unique: ↑↑HR, ↑↑CO, ↑BP (sympathomimetic). Provides analgesia. Emergence delirium risk. Hallucinations. ↑ICP, ↑IOP. Preserves spontaneous respiration.",
    scene: null,
    metadata: { topic: "Induction Agents", priority: "high" },
  },

  {
    id: "cp-n1-004",
    type: "mcq",
    prompt: "Dexmedetomidine (Precedex) loading dose and maintenance infusion rate are:",
    setup: "",
    ans: [
      { t: "Load: 1 mcg/kg over 10 min; Maint: 0.2–0.7 mcg/kg/hr; bolus doses 4–8 mcg",  ok: true  },
      { t: "Load: 0.5 mg/kg IV push; Maint: 50–100 mcg/kg/min continuous infusion",  ok: false },
      { t: "Load: 2 mg/kg over 30 min; Maint: 1–2 mg/kg/hr continuous infusion",  ok: false },
      { t: "Load: 0.1 mg/kg IV push; Maint: 0.01–0.05 mg/kg/hr continuous infusion",  ok: false },
    ],
    rationale: "Dexmedetomidine: α₂ agonist. Load 1 mcg/kg over 10 min → maint 0.2–0.7 mcg/kg/hr. Supplied 100 mcg/mL (4 mcq/mL diluted). Onset 5–10 min, peak 15–30 min. Bradycardia and hypotension are main side effects. Inhibits NE release (Locus coeruleus). Cytochrome P450 metabolism.",
    scene: null,
    metadata: { topic: "Induction Agents", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NMBs — doses, onset, metabolism
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n1-005",
    type: "mcq",
    prompt: "What is the intubating dose of succinylcholine (Anectine), and what enzyme metabolizes it?",
    setup: "",
    ans: [
      { t: "1–1.5 mg/kg IV (or 3–4 mg/kg IM); metabolized by plasma pseudocholinesterase",  ok: true  },
      { t: "0.6–1.2 mg/kg IV; metabolized primarily by hepatic cytochrome P450 enzymes",  ok: false },
      { t: "0.1 mg/kg IV; metabolized by Hofmann elimination (organ-independent pathway)",  ok: false },
      { t: "0.15 mg/kg IV; metabolized by ester hydrolysis in the plasma compartment",  ok: false },
    ],
    rationale: "Succinylcholine: 1–1.5 mg/kg IV, onset ~60 sec, duration 5–10 min. Short-acting depolarizing NMB. Metabolized by plasma cholinesterase (pseudocholinesterase). Supplied 20 mg/mL. Atypical cholinesterase (1/3200) → prolonged block 60–180 min.",
    scene: null,
    metadata: { topic: "Neuromuscular Blockers", priority: "high" },
  },

  {
    id: "cp-n1-006",
    type: "mcq",
    prompt: "The intubating dose of rocuronium (Zemuron) is:",
    setup: "",
    ans: [
      { t: "0.6–1.2 mg/kg IV — onset 1–2 min, intermediate-acting NDMR (liver/kidney clearance)",  ok: true  },
      { t: "0.1 mg/kg IV — that is the vecuronium or pancuronium intubating dose range",  ok: false },
      { t: "0.4–0.5 mg/kg IV — that is the atracurium intubating dose for histamine-safe use",  ok: false },
      { t: "0.15 mg/kg IV — that is the cisatracurium intubating dose with Hofmann elimination",  ok: false },
    ],
    rationale: "Rocuronium 0.6–1.2 mg/kg IV (10 mg/mL). Onset 1–2 min at 0.6 mg/kg. Duration 20–35 min. Intermediate-acting NDMR. Clearance: 50–70% hepatic biliary, 10–25% renal. Painful injection. Can be reversed by sugammadex.",
    scene: null,
    metadata: { topic: "Neuromuscular Blockers", priority: "high" },
  },

  {
    id: "cp-n1-007",
    type: "multi",
    prompt: "Select the THREE neuromuscular blocking agents that undergo Hofmann elimination or ester hydrolysis (organ-independent clearance):",
    setup: "",
    choices: [
      "Atracurium (Tracrium) — Hofmann + ester hydrolysis, histamine release",
      "Cisatracurium (Nimbex) — Hofmann + ester hydrolysis, no histamine",
      "Mivacurium (Mivacron) — plasma cholinesterase (butyrylcholinesterase)",
      "Rocuronium (Zemuron) — hepatic/biliary excretion, 50–70% unchanged",
      "Vecuronium (Norcuron) — hepatic metabolism with renal clearance",
    ],
    correctAnswers: [
      "Atracurium (Tracrium) — Hofmann + ester hydrolysis, histamine release",
      "Cisatracurium (Nimbex) — Hofmann + ester hydrolysis, no histamine",
      "Mivacurium (Mivacron) — plasma cholinesterase (butyrylcholinesterase)",
    ],
    selectCount: 3,
    rationale: "Atracurium and cisatracurium both undergo Hofmann elimination (pH/temperature-dependent) + ester hydrolysis — making them organ-independent. Mivacurium is metabolized by plasma cholinesterase (like succinylcholine). Rocuronium is liver/biliary; vecuronium is liver/kidney.",
    scene: null,
    metadata: { topic: "NMB Metabolism", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OPIOIDS — doses, concentrations, onset
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n1-008",
    type: "mcq",
    prompt: "Fentanyl is supplied at what concentration, and what is its induction dose range?",
    setup: "",
    ans: [
      { t: "50 mcg/mL; induction dose 1–2 mcg/kg (onset 5–15 min, peak 30–60 min)",  ok: true  },
      { t: "100 mcg/mL; induction dose 5–10 mcg/kg (onset 1 min, peak 5 min)",  ok: false },
      { t: "10 mcg/mL; induction dose 0.1–0.5 mcg/kg (onset 15 min, peak 60 min)", ok: false },
      { t: "1 mg/mL; induction dose 0.01 mg/kg (onset 1–3 min, peak 5–15 min)",  ok: false },
    ],
    rationale: "Fentanyl: 50 mcg/mL. Induction 1–2 mcg/kg. Pulmonary first-pass uptake. Causes chest wall rigidity at high doses. Duration 30–60 min after single dose. Approximately 100× more potent than morphine.",
    scene: null,
    metadata: { topic: "Opioids", priority: "high" },
  },

  {
    id: "cp-n1-009",
    type: "mcq",
    prompt: "Remifentanil (Ultiva) has what unique pharmacologic property among opioids?",
    setup: "",
    ans: [
      { t: "Ultrashort-acting — ester hydrolysis by nonspecific tissue esterases, context-insensitive t½",  ok: true  },
      { t: "Longest-acting opioid — hepatic metabolism with 24-hour elimination half-life",  ok: false },
      { t: "Only opioid with significant oral bioavailability — no first-pass hepatic metabolism",  ok: false },
      { t: "Only opioid metabolized exclusively by plasma pseudocholinesterase like succinylcholine",  ok: false },
    ],
    rationale: "Remifentanil: supplied 1–2 mg/mL (dilute), infused 0.5–1 mcg/kg/min. Onset ~30 sec, duration 5–10 min. Metabolized by nonspecific esterases in blood and tissue — NOT pseudocholinesterase. Context-insensitive half-time makes it ideal for TIVA.",
    scene: null,
    metadata: { topic: "Opioids", priority: "high" },
  },

  {
    id: "cp-n1-010",
    type: "mcq",
    prompt: "Morphine is dosed at 0.1 mg/kg IV. Which side effect profile distinguishes it from fentanyl?",
    setup: "",
    ans: [
      { t: "Histamine release → hypotension, bronchospasm, pruritis; and biliary spasm",  ok: true  },
      { t: "No respiratory depression — morphine uniquely spares ventilatory drive",  ok: false },
      { t: "Chest wall rigidity at any dose — more common than with fentanyl",  ok: false },
      { t: "Context-sensitive half-time — morphine clears faster than remifentanil",  ok: false },
    ],
    rationale: "Morphine 0.1 mg/kg IV (1–10 mg/mL). Significant histamine release → vasodilation, hypotension, bronchospasm. Biliary spasm. N/V most potent among opioids. Active metabolite M6G (renal). Slow onset (5–20 min), long duration (2–7 hrs).",
    scene: null,
    metadata: { topic: "Opioids", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VASOPRESSORS — dose ranges, concentrations, receptor profiles
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n1-011",
    type: "mcq",
    prompt: "Phenylephrine (Neo-Synephrine) is a pure α₁ agonist. What is the standard IV bolus dose?",
    setup: "",
    ans: [
      { t: "50–100 mcg IV push — diluted to 100 mcg/mL from stock 10 mg/mL",  ok: true  },
      { t: "5–15 mg IV push — that is the ephedrine bolus dose range for adults",  ok: false },
      { t: "2–30 mcg/kg/min — that is the epinephrine infusion range, not a bolus",  ok: false },
      { t: "0.5–1 mg IV push — that is far above the safe phenylephrine bolus range",  ok: false },
    ],
    rationale: "Phenylephrine: stock 10 mg/mL diluted to 100 mcg/mL. Bolus 50–100 mcg IV. Onset 30 sec, duration 15–20 min. Pure α₁ → ↑SVR → ↑MAP. Reflex bradycardia. No β activity. Use for hypotension with adequate CO.",
    scene: null,
    metadata: { topic: "Vasopressors", priority: "high" },
  },

  {
    id: "cp-n1-012",
    type: "mcq",
    prompt: "Ephedrine acts through which mechanism, and what is its adult bolus dose?",
    setup: "",
    ans: [
      { t: "5–15 mg IV — direct/indirect mixed α and β agonist that also ↓ uterine blood flow",  ok: true  },
      { t: "50–100 mcg IV — pure α₁ agonist with no β activity, causing reflex bradycardia",  ok: false },
      { t: "2–20 mcg/kg/min infusion — selective β₁ inotrope with no α activity at all",  ok: false },
      { t: "0.04–0.4 mg IV — opioid antagonist acting at mu, delta, and kappa receptors",  ok: false },
    ],
    rationale: "Ephedrine: 50 mg/mL diluted to 5 or 10 mg/mL. 5–15 mg bolus (Peds: 0.1 mg/kg). Direct + indirect (releases NE from stores). α + β agonist. Onset 30 sec, duration 10–60 min. Tachyphylaxis with repeated doses.",
    scene: null,
    metadata: { topic: "Vasopressors", priority: "high" },
  },

  {
    id: "cp-n1-013",
    type: "mcq",
    prompt: "Norepinephrine (Levophed) infusion range and standard bag concentration are:",
    setup: "",
    ans: [
      { t: "0.01–0.1 mcg/kg/min; standard mix is 4 mg in 250 mL (16 mcg/mL)",  ok: true  },
      { t: "2–20 mcg/kg/min; standard mix is 400 mg in 250 mL (1,600 mcg/mL)",  ok: false },
      { t: "0.5–1 mcg/kg/min; standard mix is 2 mg in 40 mL (50 mcg/mL)",  ok: false },
      { t: "5–15 mg bolus IV; supplied as 50 mg/mL diluted to 5 mg/mL solution",  ok: false },
    ],
    rationale: "Norepinephrine: 4 mg/250 mL = 16 mcg/mL. Dose 0.01–0.1 mcg/kg/min. Potent α₁ (+++SVR) with some β₁ (+CO). Minimal β₂. ↑↑MAP, ↑↑SVR. HR unchanged or ↓ (reflex). First-line vasopressor in septic shock.",
    scene: null,
    metadata: { topic: "Vasopressors", priority: "high" },
  },

  {
    id: "cp-n1-014",
    type: "mcq",
    prompt: "Dopamine's dose-dependent receptor activation progresses through which receptor types as the dose increases?",
    setup: "",
    ans: [
      { t: "Low dose (1–3): D₁ renal; moderate (3–10): β₁ cardiac; high (>10): α₁ vasoconstriction",  ok: true  },
      { t: "Low dose: α₁ vasoconstriction; moderate: β₂ bronchodilation; high: D₁ renal vasodilation",  ok: false },
      { t: "All doses activate only β₁ cardiac receptors without any α or dopaminergic effects",  ok: false },
      { t: "Low dose: β₂ vasodilation; moderate: α₂ sedation; high: muscarinic bradycardia effect",  ok: false },
    ],
    rationale: "Dopamine: 200 (800 mcg/mL) or 400 mg/250 mL (1,600 mcg/mL). Dose 2–20 mcg/kg/min. At low doses (1–3) → D₁ renal vasodilation. Moderate (3–10) → β₁ ↑CO, ↑HR. High (>10) → α₁ vasoconstriction. Arrhythmogenic.",
    scene: null,
    metadata: { topic: "Vasopressors", priority: "high" },
  },

  {
    id: "cp-n1-015",
    type: "mcq",
    prompt: "Epinephrine is supplied in two concentrations. Which is correct?",
    setup: "",
    ans: [
      { t: "1:10,000 = 0.1 mg/mL (cardiac arrest IV) and 1:1,000 = 1 mg/mL (IM for anaphylaxis)",  ok: true  },
      { t: "1:10,000 = 1 mg/mL (IM) and 1:1,000 = 0.1 mg/mL (IV for cardiac arrest resuscitation)",  ok: false },
      { t: "Both concentrations are 0.1 mg/mL — the naming refers to packaging size, not dilution",  ok: false },
      { t: "1:10,000 = 10 mg/mL (IV push) and 1:1,000 = 0.01 mg/mL (subcutaneous injection use)",  ok: false },
    ],
    rationale: "Epi 1:1,000 = 1 mg/mL (for IM anaphylaxis, nebulization). Epi 1:10,000 = 0.1 mg/mL (for IV ACLS — 1 mg in 10 mL). Infusion: 1 mg/250 mL (4 mcg/mL). Dose: 0.01–0.15 mcg/kg/min (or 2–30 mcg/kg/min per smart sheet). Direct β₁β₂ + α₁.",
    scene: null,
    metadata: { topic: "Vasopressors", priority: "high" },
  },

  {
    id: "cp-n1-016",
    type: "mcq",
    prompt: "Dobutamine (Dobutrex) is classified as a selective β₁ inotrope. What is its infusion range?",
    setup: "",
    ans: [
      { t: "2–20 mcg/kg/min; standard mix 250 mg in 20 mL (1,000 mcg/mL); selective β₁ = ↑ inotropy",  ok: true  },
      { t: "0.01–0.1 mcg/kg/min; standard mix 4 mg/250 mL (16 mcg/mL); pure α₁ vasoconstriction",  ok: false },
      { t: "5–15 mg IV bolus; direct/indirect mixed α + β agonist releasing stored norepinephrine",  ok: false },
      { t: "50–100 mcg IV bolus; pure α₁ agonist causing reflex bradycardia and SVR increase only",  ok: false },
    ],
    rationale: "Dobutamine: 250 mg/20 mL (1,000 mcg/mL). 2–20 mcg/kg/min. Selective β₁ + some β₂ → ↑CO, ↑contractility, mild ↓SVR. Used in cardiogenic shock and HF when CO is the problem, not SVR.",
    scene: null,
    metadata: { topic: "Vasopressors", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ANTICHOLINERGICS & REVERSAL
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n1-017",
    type: "mcq",
    prompt: "Glycopyrrolate (Robinul) is preferred over atropine for NMB reversal pairing because it:",
    setup: "",
    ans: [
      { t: "Does NOT cross the BBB (quaternary amine) → no CNS effects, no mydriasis/cycloplegia",  ok: true  },
      { t: "Crosses the BBB freely and provides superior sedation as an added benefit of reversal",  ok: false },
      { t: "Has a much shorter duration of action than atropine, lasting only 5–10 minutes total",  ok: false },
      { t: "Causes more tachycardia than atropine, which provides better hemodynamic protection",  ok: false },
    ],
    rationale: "Glycopyrrolate: 0.2 mg/mL, 5–8 mcg/kg. Quaternary amine → does NOT cross BBB. Paired with neostigmine for NMB reversal. Atropine (0.4 mg/mL, 7 mcg/kg w/ edrophonium, 1–2 mg IV) DOES cross BBB → CNS effects, mydriasis, cycloplegia, tachycardia.",
    scene: null,
    metadata: { topic: "Anticholinergics", priority: "high" },
  },

  {
    id: "cp-n1-018",
    type: "mcq",
    prompt: "Sugammadex (Bridion) 100 mg/mL reverses aminosteroid NMBs. What dose is given at PTC ≥ 1–2 (deep block)?",
    setup: "",
    ans: [
      { t: "4 mg/kg at PTC ≥ 1–2; 2 mg/kg at TOF ≥ 2 twitches; 16 mg/kg for immediate reversal",  ok: true  },
      { t: "0.05 mg/kg at PTC ≥ 1–2; max dose 5 mg — that is neostigmine dosing, not sugammadex",  ok: false },
      { t: "0.2 mg IV every 15 sec — that is flumazenil (benzodiazepine antagonist) dosing",  ok: false },
      { t: "0.04–0.4 mg IV — that is naloxone (opioid antagonist) dosing for respiratory depression",  ok: false },
    ],
    rationale: "Sugammadex: directly encapsulates aminosteroid NMBs (rocuronium > vecuronium > pancuronium). PTC-based: 4 mg/kg (deep). TOF-based: 2 mg/kg (moderate). Immediate reversal: 16 mg/kg. Can also decrease effectiveness of hormonal birth control. Most notified to females.",
    scene: null,
    metadata: { topic: "Reversal Agents", priority: "high" },
  },

  {
    id: "cp-n1-019",
    type: "mcq",
    prompt: "Neostigmine max dose for NMB reversal is:",
    setup: "",
    ans: [
      { t: "0.05 mg/kg IV; maximum 5 mg total — always paired with glycopyrrolate for anticholinergic cover",  ok: true  },
      { t: "4 mg/kg IV; no maximum — that is the sugammadex deep-block reversal dose for aminosteroids",  ok: false },
      { t: "0.5–1.0 mg IV; paired with physostigmine — for tertiary amine central anticholinergic syndrome",  ok: false },
      { t: "10 mg IV push; no anticholinergic needed — that far exceeds the safe maximum neostigmine dose",  ok: false },
    ],
    rationale: "Neostigmine: 1 mg/mL, 0.05 mg/kg, max 5 mg. Cholinergic syndrome risk (bradycardia, salivation, bronchospasm) → always give with glycopyrrolate or atropine. Onset 3–5 min, peak 7–11 min. Hepatic metabolism.",
    scene: null,
    metadata: { topic: "Reversal Agents", priority: "high" },
  },

  {
    id: "cp-n1-020",
    type: "mcq",
    prompt: "Naloxone (Narcan) dose for opioid reversal and its primary risk are:",
    setup: "",
    ans: [
      { t: "0.04–0.4 mg IV (titrate); risk is acute reversal of analgesia → HTN, tachycardia, pulmonary edema",  ok: true  },
      { t: "4 mg/kg IV (weight-based); risk is prolonged sedation lasting 24 hours after administration",  ok: false },
      { t: "0.2 mg IV every 15 sec; risk is seizure activity from GABA-A receptor inverse agonism",  ok: false },
      { t: "2 mg IM single dose; risk is malignant hyperthermia from ryanodine receptor activation",  ok: false },
    ],
    rationale: "Naloxone: 0.4 mg/mL. Dose 0.04–0.4 mg IV (titrate in 40 mcg increments to avoid total reversal). Duration 1–3 min onset, 30–60 min (shorter than most opioids → may need redosing). Mu/delta/kappa antagonist.",
    scene: null,
    metadata: { topic: "Reversal Agents", priority: "high" },
  },

  {
    id: "cp-n1-021",
    type: "mcq",
    prompt: "Flumazenil (Romazicon) reverses benzodiazepines. What is its dosing protocol?",
    setup: "",
    ans: [
      { t: "0.2 mg IV every 15 sec (0.1 mg/mL); max 3 mg/hr — repeat if resedation occurs",  ok: true  },
      { t: "0.04–0.4 mg IV titrated — that is the naloxone (opioid antagonist) dosing protocol",  ok: false },
      { t: "4 mg/kg IV as a single bolus — that is sugammadex for deep NMB reversal dosing",  ok: false },
      { t: "0.05 mg/kg with max 5 mg — that is neostigmine for NMB reversal with glycopyrrolate",  ok: false },
    ],
    rationale: "Flumazenil: 0.1 mg/mL, 0.2 mg every 15 sec. Competitive benzodiazepine antagonist at GABA-A. Risk of seizures in chronic benzo users. Duration 45–90 min (shorter than most benzos → resedation risk). Max 3 mg/hr.",
    scene: null,
    metadata: { topic: "Reversal Agents", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HEMODYNAMIC NORMALS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n1-022",
    type: "mcq",
    prompt: "Normal CVP (central venous pressure) range is:",
    setup: "",
    ans: [
      { t: "2–8 mmHg — measured at the phlebostatic axis (4th ICS, midaxillary line)",  ok: true  },
      { t: "15–30 mmHg — that is the normal pulmonary artery systolic (PAS) range",  ok: false },
      { t: "9–16 mmHg — that is the normal pulmonary artery mean (PAM) pressure range",  ok: false },
      { t: "4–12 mmHg — that is the normal PCWP (pulmonary capillary wedge pressure) range",  ok: false },
    ],
    rationale: "Normal hemodynamic values: CVP 2–8 mmHg, PAS 15–30, PAD 4–12, PAM 9–16, PCWP 4–12. High CVP (>12) suggests volume overload or RV failure. Pathologic CVP >18 mmHg.",
    scene: null,
    metadata: { topic: "Hemodynamic Normals", priority: "high" },
  },

  {
    id: "cp-n1-023",
    type: "mcq",
    prompt: "Normal PCWP (pulmonary capillary wedge pressure) is:",
    setup: "",
    ans: [
      { t: "4–12 mmHg — estimates left atrial pressure and LV preload",  ok: true  },
      { t: "2–8 mmHg — that is the normal CVP range for right-sided filling",  ok: false },
      { t: "15–30 mmHg — that is the normal PA systolic pressure, not wedge",  ok: false },
      { t: "60–80 mmHg — that is normal systemic MAP, not pulmonary wedge",  ok: false },
    ],
    rationale: "PCWP 4–12 mmHg normally. High (>12) → suggests LV failure or volume overload. Pathologic (>20) → pulmonary edema risk. PCWP approximates LAP which approximates LVEDP.",
    scene: null,
    metadata: { topic: "Hemodynamic Normals", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INHALATIONAL ANESTHETICS — MAC, properties
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n1-024",
    type: "mcq",
    prompt: "Which volatile anesthetic has the LOWEST blood:gas partition coefficient (fastest onset)?",
    setup: "",
    ans: [
      { t: "Desflurane — blood:gas 0.45 (N₂O is 0.46; sevoflurane is 0.65; isoflurane is 1.46)",  ok: true  },
      { t: "Isoflurane — blood:gas 1.46 (actually the HIGHEST, so slowest onset among moderns)",  ok: false },
      { t: "Sevoflurane — blood:gas 0.65 (fast but not the fastest; desflurane is lower at 0.45)",  ok: false },
      { t: "Halothane — blood:gas 2.54 (the highest of all volatiles, extremely slow equilibration)",  ok: false },
    ],
    rationale: "Lower blood:gas coefficient → faster equilibration → faster onset/offset. Desflurane 0.45 < N₂O 0.46 < Sevoflurane 0.65 < Isoflurane 1.46 < Halothane 2.54. This is why desflurane has the fastest recovery. Xenon (0.14) would be fastest but is rarely used.",
    scene: null,
    metadata: { topic: "Inhaled Anesthetics", priority: "high" },
  },

  {
    id: "cp-n1-025",
    type: "mcq",
    prompt: "MAC (minimum alveolar concentration) for sevoflurane at age 40 is approximately:",
    setup: "",
    ans: [
      { t: "2.05% — making it less potent than isoflurane (1.28%) or desflurane (6.0%)",  ok: true  },
      { t: "0.75% — that is the MAC for halothane, the most potent volatile anesthetic",  ok: false },
      { t: "6.0% — that is the MAC for desflurane, the least potent modern volatile agent",  ok: false },
      { t: "104% — that is the MAC for nitrous oxide (>100%, so cannot achieve 1 MAC alone)",  ok: false },
    ],
    rationale: "MAC values (age 40): Halothane 0.75, Isoflurane 1.28, Sevoflurane 2.05, Desflurane 6.0, N₂O 104. Higher MAC = less potent (need more gas). N₂O cannot produce anesthesia alone (MAC > 100%). Xenon MAC 71%.",
    scene: null,
    metadata: { topic: "MAC Values", priority: "high" },
  },

  {
    id: "cp-n1-026",
    type: "multi",
    prompt: "Select THREE factors that INCREASE MAC (increase anesthetic requirement):",
    setup: "",
    choices: [
      "Amphetamine (acute use) — increases CNS catecholamines and arousal",
      "Hyperthermia — increased metabolic rate raises anesthetic requirement",
      "Young age (highest MAC at 6 months) — infants require more volatile",
      "Hypothermia — decreased metabolic rate lowers anesthetic requirement",
      "Opioids, propofol, benzodiazepines — all co-administered agents lower MAC",
    ],
    correctAnswers: [
      "Amphetamine (acute use) — increases CNS catecholamines and arousal",
      "Hyperthermia — increased metabolic rate raises anesthetic requirement",
      "Young age (highest MAC at 6 months) — infants require more volatile",
    ],
    selectCount: 3,
    rationale: "Factors ↑ MAC: amphetamine/cocaine/ephedrine (acute), hyperthermia, hypernatremia, young age (peak at 6 mo), red hair, chronic ethanol use. Factors ↓ MAC: hypothermia, hyponatremia, elderly, pregnancy, opioids, propofol, benzos, α₂ agonists, lithium, hypoxia, anemia (Hgb <5).",
    scene: null,
    metadata: { topic: "MAC Modifiers", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OHD CURVE, LUNG VOLUMES, MH PROTOCOL
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n1-027",
    type: "multi",
    prompt: "Select THREE conditions that cause a RIGHT shift of the oxyhemoglobin dissociation curve (↑ P50, easier O₂ unloading):",
    setup: "",
    choices: [
      "Acidosis (lower pH) — Bohr effect promotes O₂ release to tissues",
      "Hyperthermia — fever shifts the curve right, releasing more O₂",
      "Increased 2,3-DPG (chronic hypoxia, anemia) — decreases Hb-O₂ affinity",
      "Alkalosis (higher pH) — shifts the curve left, increasing Hb-O₂ affinity",
      "Hypothermia — shifts the curve left, Hb holds O₂ more tightly in cold",
    ],
    correctAnswers: [
      "Acidosis (lower pH) — Bohr effect promotes O₂ release to tissues",
      "Hyperthermia — fever shifts the curve right, releasing more O₂",
      "Increased 2,3-DPG (chronic hypoxia, anemia) — decreases Hb-O₂ affinity",
    ],
    selectCount: 3,
    rationale: "Right shift (↑P50 >26.8): acidosis, hyperthermia, ↑2,3-DPG, hypercarbia. Left shift (↓P50 <26.8): alkalosis, hypothermia, ↓2,3-DPG (stored blood), CO poisoning, fetal hemoglobin, methemoglobin.",
    scene: "oxygen_dissociation",
    sceneCfg: { label: "OHD CURVE — RIGHT SHIFT", shift: 'right' },
    metadata: { topic: "OHD Curve", priority: "high" },
  },

  {
    id: "cp-n1-028",
    type: "short",
    prompt: "What is the formula for functional residual capacity (FRC)?",
    setup: "",
    acceptedAnswers: ["ERV + RV", "FRC = ERV + RV", "ERV+RV"],
    canonicalAnswer: "FRC = ERV + RV",
    rationale: "Lung volume formulas: VC = IRV + VT + ERV. VC = IC + ERV. TLC = VC + RV. TLC = IC + FRC. FRC = ERV + RV. FRC is the volume remaining after a normal tidal expiration — it is the lung's 'oxygen reserve' and is reduced under GA, obesity, and supine positioning.",
    scene: null,
    metadata: { topic: "Lung Volumes", priority: "high" },
  },

  {
    id: "cp-n1-029",
    type: "mcq",
    prompt: "In a malignant hyperthermia crisis, the initial dantrolene dose is:",
    setup: "",
    ans: [
      { t: "2.5 mg/kg IV initial dose — repeat every 10–15 min until acidosis, rigidity, and temp resolve",  ok: true  },
      { t: "0.5 mg/kg IV single dose — that is the dexamethasone pediatric antiemetic dosing range",  ok: false },
      { t: "25 mg IV flat dose — that is far too low; dantrolene is weight-based at 2.5 mg/kg per dose",  ok: false },
      { t: "10 mg/kg IV bolus once — that dose would be appropriate only for a second recrudescence event",  ok: false },
    ],
    rationale: "MH protocol: STOP volatiles + SCh. Turn off vaporizers, insert charcoal filters. ↑ minute ventilation to ↓ ETCO₂. Dantrolene 2.5 mg/kg every 10–15 min. Cool if >41.5°C (106.7°F). Stop cooling at 38.5°C (101.3°F). Amiodarone first-line for arrhythmias. Continue dantrolene 1 mg/kg every 4–8 hr for 24–48 hr. ICU admit ≥24 hr.",
    scene: null,
    metadata: { topic: "MH Protocol", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ANTIHYPERTENSIVES, ANTIEMETICS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n1-030",
    type: "mcq",
    prompt: "Labetalol is used for acute hypertension in anesthesia. What is its α:β blockade ratio?",
    setup: "",
    ans: [
      { t: "α:β ratio is 1:7 IV — 0.1–0.5 mg/kg in 5 mg/mL solution; ↓HR → give slow",  ok: true  },
      { t: "Pure α₁ blocker with no β activity — 10–30 mg IV increments for rate control",  ok: false },
      { t: "Pure β₁ selective blocker — 0.5 mg/kg loading dose then 50–200 mcg/kg/min infusion",  ok: false },
      { t: "α:β ratio is 7:1 IV — predominantly α blockade with minimal β activity component",  ok: false },
    ],
    rationale: "Labetalol: 5 mg/mL, 0.1–0.5 mg/kg, α:β ratio 1:7 IV. Combined α + β blockade → ↓HR, ↓SVR, ↓BP. Esmolol (10 mg/mL, 10–30 mg increments) is selective β₁ with ultra-short duration (plasma esterase metabolism, t½ 9 min). Hydralazine (20 mg/mL, 2.5–10 mg) is a direct arteriolar vasodilator (VD → ↑cGMP ↓SVR).",
    scene: null,
    metadata: { topic: "Antihypertensives", priority: "medium" },
  },

  {
    id: "cp-n1-031",
    type: "mcq",
    prompt: "Ondansetron (Zofran) dose for PONV prophylaxis is:",
    setup: "",
    ans: [
      { t: "4 mg IV (Peds: 0.15 mg/kg) — 5-HT₃ antagonist; give 30 min before end of case",  ok: true  },
      { t: "0.625–1.25 mg IV — that is droperidol (butyrophenone) PONV prophylaxis dosing",  ok: false },
      { t: "0.5 mg/kg IV — that is dexamethasone pediatric antiemetic dose, not ondansetron",  ok: false },
      { t: "8 mg IV — double the standard adult dose; risk of QTc prolongation at higher doses",  ok: false },
    ],
    rationale: "Ondansetron: 2 mg/mL, 4 mg IV adult (Peds 0.15 mg/kg). 5-HT₃ antagonist. Give near end of surgery. Droperidol: 2.5 mg/mL, 0.625–1.25 mg (QTc risk — black box warning). Dexamethasone: 4 mg/mL, 4 mg IV (Peds 0.5 mg/kg) — give at induction. PONV risk factors: female, nonsmoker, hx of motion sickness, volatile agent, duration.",
    scene: null,
    metadata: { topic: "Antiemetics", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LOCAL ANESTHETICS — max doses
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n1-032",
    type: "mcq",
    prompt: "Maximum dose of lidocaine WITHOUT epinephrine for infiltration is:",
    setup: "",
    ans: [
      { t: "4.5 mg/kg without epi; 7 mg/kg with epinephrine — amide, medium duration (60–120 min)",  ok: true  },
      { t: "2 mg/kg without epi; 3 mg/kg with epi — that is the bupivacaine maximum dose range",  ok: false },
      { t: "7 mg/kg without epi; 10 mg/kg with epi — those doses exceed safe lidocaine guidelines",  ok: false },
      { t: "1 mg/kg without epi; 1.4 mg/kg with epi — that is chloroprocaine max for ester class",  ok: false },
    ],
    rationale: "Lidocaine: amide, pKa 7.9, 24% nonionized at pH 7.4. Max 4.5 mg/kg (300 mg) without epi, 7 mg/kg with epi. Medium duration 60–120 min. Bupivacaine: max 2 mg/kg (175 mg) without epi, 3 mg/kg with epi. Long duration 240–480 min. Cardiotoxic — avoid IV bolus.",
    scene: null,
    metadata: { topic: "Local Anesthetics", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // N₂O CONTRAINDICATIONS, VOLATILE PROPERTIES
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n1-033",
    type: "multi",
    prompt: "Select THREE absolute contraindications to nitrous oxide use:",
    setup: "",
    choices: [
      "Pneumothorax — N₂O diffuses into closed air space faster than N₂ can leave",
      "Bowel obstruction — gas expansion in trapped loops worsens distension/ischemia",
      "Methionine synthase deficiency — N₂O oxidizes cobalt in vitamin B₁₂, blocks enzyme",
      "Mild postoperative nausea history — N₂O increases PONV but this is not absolute",
      "Pulmonary hypertension — relative contraindication, not absolute per current guidelines",
    ],
    correctAnswers: [
      "Pneumothorax — N₂O diffuses into closed air space faster than N₂ can leave",
      "Bowel obstruction — gas expansion in trapped loops worsens distension/ischemia",
      "Methionine synthase deficiency — N₂O oxidizes cobalt in vitamin B₁₂, blocks enzyme",
    ],
    selectCount: 3,
    rationale: "Absolute N₂O contraindications: known methionine synthase/B₁₂ pathway deficiency, expansion of gas-filled spaces (pneumothorax, emphysema, middle ear surgery, pneumocephalus, air embolus, bowel obstruction), ↑ICP. Relative: pulmonary HTN, prolonged anesthesia (>6 hr), PONV risk, first trimester pregnancy.",
    scene: null,
    metadata: { topic: "Nitrous Oxide", priority: "high" },
  },

  {
    id: "cp-n1-034",
    type: "mcq",
    prompt: "Desflurane requires a specially heated vaporizer (Tec 6) because:",
    setup: "",
    ans: [
      { t: "Its vapor pressure (~669 mmHg at 20°C) is nearly 1 atm — it would boil in a standard vaporizer",  ok: true  },
      { t: "It is too viscous for standard wicks and must be electrically heated to flow into the circuit",  ok: false },
      { t: "Its blood:gas coefficient is too high for passive vaporization at room temperature to work",  ok: false },
      { t: "It reacts with soda lime at room temperature and must be heated to prevent compound A buildup",  ok: false },
    ],
    rationale: "Desflurane VP = ~669 mmHg at 20°C (boiling point 22.8°C). Near 1 atm at room temp → would uncontrollably boil in a standard variable-bypass vaporizer. The Tec 6 heats desflurane to 39°C (pressurizes it to ~2 atm) and injects a metered amount into the fresh gas flow. Sevoflurane (not desflurane) reacts with soda lime to form compound A.",
    scene: null,
    metadata: { topic: "Inhaled Anesthetics", priority: "high" },
  },

  {
    id: "cp-n1-035",
    type: "mcq",
    prompt: "Which volatile anesthetic is most associated with sevoflurane specifically? (Not applicable to desflurane or isoflurane.)",
    setup: "",
    ans: [
      { t: "Reaction with soda lime to produce Compound A — a nephrotoxic vinyl ether in rats at high flows",  ok: true  },
      { t: "Airway irritation and coughing on induction — that is desflurane, not sevoflurane, which is smooth",  ok: false },
      { t: "Pungent odor making it unsuitable for mask induction — sevoflurane is actually the least pungent",  ok: false },
      { t: "Seizure activity on EEG at all concentrations — sevoflurane may cause epileptiform activity at high MAC",  ok: false },
    ],
    rationale: "Sevoflurane + soda lime → Compound A (fluoromethyl-2,2-difluoro-1-vinyl ether). Nephrotoxic in rats at high concentrations. Clinical significance debated. Recommendation: use fresh gas flow ≥2 L/min to minimize accumulation. Sevoflurane also produces inorganic fluoride but nephrotoxicity from fluoride is not clinically seen. Sevoflurane can cause seizure-like EEG activity at >2 MAC.",
    scene: null,
    metadata: { topic: "Inhaled Anesthetics", priority: "medium" },
  },

];

export const CP_NODE1_METADATA = {
  nodeId:   "cp-node-1",
  courseId: "chem-phys-anesthesia",
  chapter:  "Smart Sheets",
  title:    "Smart Sheets — Drug Doses & Clinical Reference",
  totalQuestions: CP_NODE1_QUESTIONS.length,
  questionTypes: {
    mcq:   CP_NODE1_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: CP_NODE1_QUESTIONS.filter(q => q.type === 'multi').length,
    short: CP_NODE1_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
