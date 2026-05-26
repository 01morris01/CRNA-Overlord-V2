# Atom Candidates — ap1-wk-1

**Generated:** 2025-05-25
**Scope:** Load-bearing atom proposals for the 12 synthesis questions on ap1-wk-1 that currently lack atoms
**Excluded:** r-ap1-w1-1b (3 atoms done), r-ap1-w1-3a (3 atoms done)

---

## Summary

| Synthesis Q | Topic | Atoms proposed | IDs |
|---|---|---|---|
| r-ap1-w1-1a | receptor-theory | 2 | atom-partial-agonist-ceiling-1, atom-partial-agonist-competition-1 |
| r-ap1-w1-2 | receptor-regulation | 2 | atom-bidirectional-regulation-1, atom-extrajunctional-achr-1 |
| r-ap1-w1-3b | pk-compartment-model | 2 | atom-peripheral-saturation-1, atom-pulmonary-uptake-1 |
| r-ap1-w1-4 | protein-binding | 2 | atom-aag-acute-phase-1, atom-displacement-criteria-1 |
| r-ap1-w1-5 | absorption-bioavailability | 1 | atom-ionization-membrane-1 |
| r-ap1-w1-6a | drug-metabolism | 1 | atom-cyp3a4-1 |
| r-ap1-w1-6b | drug-metabolism | 2 | atom-remifentanil-ester-1, atom-cyp2d6-prodrug-1 |
| r-ap1-w1-7 | pharmacogenetics | 2 | atom-atypical-bche-1, atom-ryr1-mh-1 |
| r-ap1-w1-8 | dose-response | 2 | atom-potency-vs-efficacy-1, atom-synergy-additivity-1 |
| r-ap1-w1-9a | elimination-kinetics | 1 | atom-first-zero-order-1 |
| r-ap1-w1-9b | clearance-dose-adjustment | 2 | atom-flow-limited-clearance-1, atom-ion-trapping-renal-1 |
| r-ap1-w1-9c | elimination-kinetics | 2 | atom-michaelis-menten-1, atom-three-phase-curve-1 |

**Totals:** 21 new atoms across 12 synthesis questions (avg 1.75/question).
**Cross-feeds:** atom-cyp2d6-prodrug-1 feeds both r-ap1-w1-6b AND r-ap1-w1-7.

---

## r-ap1-w1-1a — Agonist Spectrum / Buprenorphine

**Synthesis asks:** Walk through the agonist spectrum (full → partial) and explain why buprenorphine complicates pain management alongside a full agonist.

**What students freeze on:** (1) Why a partial agonist has a ceiling even at 100% occupancy — the concept of intrinsic efficacy independent of affinity. (2) Why giving a partial agonist WITH a full agonist REDUCES the response — the competitive displacement/functional antagonist paradox.

**What is NOT load-bearing:** Full agonist definition (kp1) is foundational; most students have it cold. The buprenorphine/withdrawal clinical application is synthesis-level, not atom-level.

### Atom 1: atom-partial-agonist-ceiling-1

**Proposed prompt:** Explain why a partial agonist cannot produce the same maximal response as a full agonist, even when it occupies 100% of available receptors. Identify the property that distinguishes partial from full agonist activation.

**Load-bearing because:** Students chronically confuse affinity (how tightly a drug binds) with efficacy (how strongly it activates once bound). Without separating these, they cannot explain ceiling effects or the partial agonist paradox. The synthesis question's common_errors explicitly flag this confusion.

**Source MCQs:** ap1-w1-006 (partial agonist intrinsic efficacy), ap1-w1-002 (agonist = binds + activates)

**Topic:** receptor-theory

### Atom 2: atom-partial-agonist-competition-1

**Proposed prompt:** A receptor population is fully occupied by a full agonist producing maximal response. A partial agonist with equal affinity is now introduced. Explain what happens to the net maximal response and why.

**Load-bearing because:** The partial agonist acting as a functional antagonist in the presence of a full agonist is the mechanism underlying the synthesis question's CRITICAL key point (kp3, weight 2). Students who understand partial agonism in isolation still freeze on this competitive displacement scenario — the idea that an agonist can REDUCE a response is counterintuitive.

**Source MCQs:** ap1-w1-061 (partial agonist reduces maximal response by competing for receptors), ap1-w1-007 (butorphanol as agonist-antagonist at mu receptor)

**Topic:** receptor-theory

---

## r-ap1-w1-2 — Receptor Regulation (SCI, Pheo, Terbutaline)

**Synthesis asks:** Explain receptor regulation mechanisms across three clinical scenarios: SCI/succinylcholine danger, pheochromocytoma/post-resection hypotension, terbutaline tachyphylaxis.

**What students freeze on:** (1) The bidirectional principle itself — that chronic agonist causes downregulation while chronic blockade/denervation causes upregulation. (2) The specific mechanism of extrajunctional AChR proliferation after denervation, which is why succinylcholine becomes lethal (not just generic "upregulation").

**What is NOT load-bearing:** Corticosteroid reversal of beta-receptor tachyphylaxis (kp4) is a supporting detail. Terbutaline tachyphylaxis (kp3) is the downregulation half of the bidirectional principle, already covered by atom 1.

### Atom 1: atom-bidirectional-regulation-1

**Proposed prompt:** Explain the bidirectional nature of receptor regulation: what happens to receptor number and sensitivity during chronic agonist stimulation, and what happens during chronic antagonist exposure or denervation? Identify the cellular mechanisms (phosphorylation, internalization, altered gene transcription) that drive each direction.

**Load-bearing because:** This principle is the conceptual backbone of all three clinical scenarios in the synthesis question. Without it, the student cannot reason about ANY of the three cases. All five key points are applications of this single bidirectional mechanism.

**Source MCQs:** ap1-w1-009 (chronic agonist → downregulation/desensitization), ap1-w1-010 (denervation → upregulation of extrajunctional AChRs)

**Topic:** receptor-regulation

### Atom 2: atom-extrajunctional-achr-1

**Proposed prompt:** After denervation injury (e.g. spinal cord transection), describe the specific change in nicotinic acetylcholine receptor distribution across the muscle membrane. Explain why this change makes the muscle response to depolarizing agents qualitatively different from normal.

**Load-bearing because:** The SCI/succinylcholine scenario is the CRITICAL key point (kp1, weight 2). Generic "upregulation" is insufficient — the specific mechanism is proliferation of fetal-type extrajunctional AChRs across the ENTIRE muscle membrane (not just the neuromuscular junction), creating a massive surface area for simultaneous depolarization and potassium efflux. Students who know "upregulation" but miss this specificity cannot explain why the hyperkalemia is lethal.

**Source MCQs:** ap1-w1-010 (SCI → extrajunctional AChR proliferation → succinylcholine hyperkalemia)

**Topic:** receptor-regulation

---

## r-ap1-w1-3b — Compartment Model: Prolonged Infusion

**Synthesis asks:** Explain why emergence takes longer after prolonged TIVA infusion vs single bolus, the role of pulmonary uptake in buffering peak concentrations, and why elderly/hypovolemic patients need dose reduction.

**What students freeze on:** (1) WHY prolonged infusion changes the recovery mechanism — peripheral compartment saturation eliminates the redistribution gradient, making recovery metabolism-dependent. (2) First-pass pulmonary uptake as a drug reservoir — most students don't know the lungs buffer arterial peak concentration.

**What is NOT load-bearing:** Elderly/hypovolemic dose reduction (kp6) — the concept "smaller volume = higher concentration" is straightforward PK reasoning most students own.

### Atom 1: atom-peripheral-saturation-1

**Proposed prompt:** During a prolonged IV infusion, peripheral tissue compartments (muscle, fat) progressively accumulate drug. Explain how this accumulation changes the recovery mechanism compared to a single bolus, and why emergence time increases with infusion duration.

**Load-bearing because:** This is the central mechanism distinguishing single-bolus from prolonged-infusion pharmacokinetics. Students who understand redistribution (already atomized for r-ap1-w1-3a) still freeze when asked WHY the same mechanism stops working during long infusions. The insight — that peripheral compartments saturate, eliminating the concentration gradient that drives redistribution — is the key that unlocks kp4.

**Source MCQs:** ap1-w1-022 (CSHT accounts for infusion duration effects), ap1-w1-054 (CSHT differs from elimination half-life because it incorporates redistribution saturation)

**Topic:** pk-compartment-model

### Atom 2: atom-pulmonary-uptake-1

**Proposed prompt:** Explain first-pass pulmonary uptake of lipophilic drugs. Describe how the lungs act as a temporary drug reservoir, what fraction of a fentanyl bolus is sequestered on first pass, and why this matters for peak arterial concentration.

**Load-bearing because:** Most students do not know the lungs serve as a major drug buffer. Without this concept, they cannot explain kp5 or understand why rapid IV injection of lipophilic drugs does not produce the peak arterial concentration predicted by simple dilution in blood volume. This is a mechanism retrieval, not trivia — the student must explain the buffering function.

**Source MCQs:** ap1-w1-019 (fentanyl 65-75% first-pass pulmonary uptake)

**Topic:** pk-compartment-model

---

## r-ap1-w1-4 — Protein Binding

**Synthesis asks:** Explain why lidocaine loses efficacy in sepsis (AAG rises), why sulfonamides cause neonatal kernicterus (bilirubin displacement), and the criteria for clinically significant displacement.

**What students freeze on:** (1) AAG as an acute-phase reactant — students know albumin but typically don't know AAG, that it RISES in stress states (not falls), or that it binds basic drugs. (2) The three criteria for clinically significant displacement — students either overstate ("all displacement is dangerous") or miss it entirely.

**What is NOT load-bearing:** Free fraction = active fraction (kp1) is foundational. Acidic→albumin / basic→AAG (kp2) falls out of the AAG atom. Kernicterus specifics (kp5) are synthesis-level clinical application.

### Atom 1: atom-aag-acute-phase-1

**Proposed prompt:** Alpha-1 acid glycoprotein (AAG) is the primary binding protein for basic drugs. Explain what happens to AAG levels during surgery, sepsis, or trauma, and describe how this change alters the pharmacologic effect of a basic drug like lidocaine at the same total dose.

**Load-bearing because:** The CRITICAL key point (kp3, weight 2) requires understanding that AAG rises 2-5 fold in inflammation, increasing binding capacity and reducing the free active fraction of basic drugs. The common_errors explicitly flag the directional confusion (students who think AAG falls in sepsis). Without this mechanism, the lidocaine-in-sepsis scenario is unanswerable.

**Source MCQs:** ap1-w1-027 (AAG increases in inflammation), ap1-w1-023 (basic drugs bind AAG, acidic drugs bind albumin)

**Topic:** protein-binding

### Atom 2: atom-displacement-criteria-1

**Proposed prompt:** Drug displacement from protein binding sites is often discussed but rarely clinically significant. State the three criteria that must ALL be present for displacement to produce a meaningful change in drug effect, and explain why each criterion matters.

**Load-bearing because:** Students commonly overstate or understate displacement significance. Without the three criteria (>90% bound, narrow TI, small Vd), they cannot assess whether a given displacement scenario is dangerous. This is needed for kp4 and informs reasoning about the kernicterus scenario.

**Source MCQs:** ap1-w1-025 (displacement significant only with high binding + narrow TI + small Vd)

**Topic:** protein-binding

---

## r-ap1-w1-5 — Absorption and Bioavailability

**Synthesis asks:** Explain why local anesthetic fails in an abscess (ionization), why oral morphine dose exceeds IV dose (first-pass metabolism), and which routes bypass first-pass.

**What students freeze on:** The ionization/Henderson-Hasselbalch mechanism — specifically, that weak bases in acidic environments become ionized and cannot cross membranes. This is the mechanism behind the CRITICAL key point (kp2, weight 2).

**What is NOT load-bearing:** First-pass metabolism (kp3) and sublingual/rectal bypass (kp4-5) are foundational PK concepts most CRNA students have solid. The clinical application of ionization to the abscess scenario is synthesis-level.

### Atom 1: atom-ionization-membrane-1

**Proposed prompt:** Only one ionic form of a drug can passively cross lipid cell membranes. Identify which form crosses and explain, using Henderson-Hasselbalch reasoning, what happens to a weak base drug when the local tissue pH drops significantly below its pKa.

**Load-bearing because:** This is the single mechanism underlying the synthesis question's CRITICAL point. Students who cannot apply Henderson-Hasselbalch to predict the ionization state of a weak base in acid cannot explain abscess block failure. The common_errors show that students reach for wrong explanations (pus protein binding, bacterial degradation) when they lack this mechanism.

**Source MCQs:** ap1-w1-046 (nonionized form crosses membranes), ap1-w1-048 (LA in abscess — acidic pH ionizes weak base)

**Topic:** absorption-bioavailability

---

## r-ap1-w1-6a — Hepatic Drug Metabolism: Phase I, Phase II, CYP3A4

**Synthesis asks:** Walk through Phase I and Phase II reactions, identify CYP3A4 as the most important isoenzyme, and give clinically significant inhibitors/inducers.

**What students freeze on:** CYP3A4 — that it handles ~50% of drug metabolism, that it's THE isoenzyme for fentanyl/midazolam, and that specific inhibitors (ketoconazole) and inducers (rifampin) dramatically alter clearance.

**What is NOT load-bearing:** Phase I vs Phase II distinction (kp1-2) is foundational classification taught in every pharmacology course. Students generally know "oxidation/reduction/hydrolysis → conjugation."

### Atom 1: atom-cyp3a4-1

**Proposed prompt:** CYP3A4 is called the most clinically important cytochrome P450 isoenzyme. Explain what fraction of all drug metabolism it handles, name the anesthesia drugs it metabolizes, and identify one potent inhibitor and one potent inducer with their clinical consequences.

**Load-bearing because:** The CRITICAL key point (kp3, weight 2) requires specific CYP3A4 knowledge — substrate drugs, inhibitors, inducers, and quantitative importance. Students who know "liver enzymes metabolize drugs" but cannot name the dominant isoenzyme or its interactions cannot answer this question. Drug interactions via CYP3A4 are a daily clinical concern.

**Source MCQs:** ap1-w1-031 (CYP3A4 = ~50%, most abundant), ap1-w1-032 (grapefruit inhibits intestinal CYP3A4), ap1-w1-076 (CYP3A4 is the most abundant hepatic CYP)

**Topic:** drug-metabolism

---

## r-ap1-w1-6b — Remifentanil, Halothane, Codeine Pathways

**Synthesis asks:** Explain remifentanil's unique metabolism, halothane hepatitis mechanism, and codeine's prodrug activation via CYP2D6.

**What students freeze on:** (1) Remifentanil's metabolic pathway — students confuse which esterase (nonspecific tissue esterases, NOT pseudocholinesterase, NOT CYP450). (2) CYP2D6 and codeine — that codeine requires metabolic ACTIVATION (prodrug concept) and genetic variation determines whether you get analgesia, nothing, or toxicity.

**What is NOT load-bearing:** Halothane hepatitis (kp5) — reductive metabolism → trifluoroacetyl chloride → immune-mediated destruction. This is specific factual knowledge, not a mechanism students plausibly freeze on as a retrieval bottleneck.

### Atom 1: atom-remifentanil-ester-1

**Proposed prompt:** Remifentanil has a uniquely short and predictable duration regardless of infusion length. Explain the specific metabolic pathway responsible, identify the enzyme class (and distinguish it from the enzyme that metabolizes succinylcholine), and explain why this pathway is called organ-independent.

**Load-bearing because:** The CRITICAL key point (kp4, weight 2) hinges on understanding ester hydrolysis by nonspecific tissue esterases — NOT pseudocholinesterase, NOT CYP450. The common_errors explicitly flag the pseudocholinesterase confusion. Without this mechanism, students cannot explain remifentanil's flat CSHT or why it works normally in hepatic/renal failure.

**Source MCQs:** ap1-w1-035 (remifentanil → nonspecific tissue/plasma esterases, not pseudocholinesterase), ap1-w1-034 (ester hydrolysis is organ-independent, does not require CYP450)

**Topic:** drug-metabolism

### Atom 2: atom-cyp2d6-prodrug-1

**Proposed prompt:** Codeine requires metabolic activation to produce analgesia. Identify the specific CYP enzyme responsible, name the active metabolite, and explain why genetic variation in this enzyme's activity creates a spectrum from therapeutic failure to life-threatening toxicity.

**Load-bearing because:** The prodrug activation concept — that a drug can be INACTIVE as administered and require enzymatic conversion to work — is distinct from the usual "metabolism = deactivation" mental model. Students who lack this concept cannot explain kp6 or the CRITICAL kp1 in r-ap1-w1-7. This atom cross-feeds both synthesis questions.

**Source MCQs:** ap1-w1-029 (codeine = prodrug, CYP2D6 → morphine, poor vs ultrarapid metabolizers)

**Topic:** drug-metabolism

**Cross-feeds:** r-ap1-w1-6b (kp6) AND r-ap1-w1-7 (kp1, CRITICAL)

---

## r-ap1-w1-7 — Pharmacogenetics

**Synthesis asks:** Explain five pharmacogenetic scenarios: CYP2D6/codeine toxicity, atypical pseudocholinesterase/prolonged block, MH/RyR1, chronic alcohol tolerance, G6PD/methylene blue failure.

**What students freeze on:** (1) Atypical pseudocholinesterase — the enzyme variant, prolonged block mechanism, and the dibucaine number as the diagnostic. (2) MH/RyR1 — the specific receptor defect, the calcium release mechanism, and dantrolene's target.

**What is NOT load-bearing:** CYP2D6/codeine is covered by atom-cyp2d6-prodrug-1 (cross-feed from r-ap1-w1-6b). Chronic alcohol tolerance (kp4) and G6PD/methylene blue (kp5) are specific factual items, not retrieval bottlenecks — students either know the fact or they don't, but neither concept blocks reasoning about the other scenarios.

### Atom 1: atom-atypical-bche-1

**Proposed prompt:** A patient receives succinylcholine for rapid-sequence intubation and the expected 3-5 minute block extends to hours. Explain the enzyme defect responsible, describe how the dibucaine number distinguishes normal from atypical enzyme variants, and state the expected duration ranges for each genotype.

**Load-bearing because:** The pseudocholinesterase/dibucaine number mechanism is highly specific to anesthesia and not intuitive from general pharmacology. Students need to retrieve: (1) what atypical BChE is, (2) why it prolongs block, and (3) how dibucaine number quantifies the defect. Without this, kp2 is inaccessible.

**Source MCQs:** ap1-w1-066 (atypical pseudocholinesterase → prolonged block, dibucaine number), ap1-w1-080 (pseudocholinesterase hydrolyzes succinylcholine/mivacurium)

**Topic:** pharmacogenetics

### Atom 2: atom-ryr1-mh-1

**Proposed prompt:** Malignant hyperthermia results from a mutation in a specific calcium channel on the skeletal muscle sarcoplasmic reticulum. Identify the receptor, explain the mechanism by which triggering agents cause uncontrolled calcium release, and name the drug that treats MH by acting at this same receptor.

**Load-bearing because:** MH is a must-know emergency for CRNAs. The mechanism — RyR1 mutation → uncontrolled SR calcium release → sustained contraction/hypermetabolism — is the foundation for understanding triggers, signs, and treatment. Students who know "MH = dantrolene" but not the RyR1/calcium mechanism cannot explain WHY dantrolene works or WHY volatiles and succinylcholine are the triggers.

**Source MCQs:** ap1-w1-067 (MH = RyR1 mutation, autosomal dominant, calcium release), ap1-w1-068 (dantrolene blocks RyR1 calcium release)

**Topic:** pharmacogenetics

---

## r-ap1-w1-8 — Dose-Response Relationships

**Synthesis asks:** Compare potency vs efficacy on dose-response curves, define therapeutic index, and explain synergistic vs additive drug interactions in anesthesia.

**What students freeze on:** (1) Potency vs efficacy — which corresponds to the curve's POSITION (horizontal) vs its HEIGHT (vertical). This confusion is the most common exam error in pharmacodynamics. (2) Synergy vs additivity — why opioid+volatile is synergistic (different mechanisms at different sites) while volatile+volatile is additive.

**What is NOT load-bearing:** ED50/TI definition (kp3) is formulaic. MAC additivity (kp5) is the contrast case for synergy and follows naturally if synergy is understood.

### Atom 1: atom-potency-vs-efficacy-1

**Proposed prompt:** Define potency and efficacy as separate pharmacodynamic properties. Explain which property corresponds to the horizontal position of a dose-response curve and which corresponds to the vertical maximum, and state which property is more clinically important.

**Load-bearing because:** This confusion is explicitly flagged in the synthesis question's common_errors. Students who conflate potency and efficacy cannot interpret dose-response curves (kp1, kp2) or understand why a more potent drug is not necessarily a better drug. This is the single most frequently tested pharmacodynamic distinction.

**Source MCQs:** ap1-w1-058 (potency = EC50, horizontal position), ap1-w1-059 (efficacy = Emax, vertical maximum)

**Topic:** dose-response

### Atom 2: atom-synergy-additivity-1

**Proposed prompt:** Distinguish synergistic (supra-additive) from additive drug interactions. Explain why two drugs acting through different receptor mechanisms can produce a combined effect greater than the sum of their individual effects, and give one example of each interaction type from anesthesia practice.

**Load-bearing because:** The CRITICAL key point (kp4, weight 2) requires understanding synergy as a mechanistic phenomenon — different drugs at different receptor systems producing supra-additive effects. Students who cannot distinguish synergy from additivity will incorrectly classify all beneficial drug combinations as synergistic (flagged in common_errors).

**Source MCQs:** ap1-w1-063 (opioid + volatile MAC reduction = synergy), ap1-w1-065 (volatile + volatile MAC = additive)

**Topic:** dose-response

---

## r-ap1-w1-9a — Elimination Kinetics: First-Order, Zero-Order, Half-Life

**Synthesis asks:** Define first-order and zero-order kinetics, give examples, derive half-life, and explain why half-life applies only to first-order.

**What students freeze on:** The first-order vs zero-order distinction — "constant fraction" vs "constant amount." This is THE retrieval target. Everything else in the question (half-life formula, decay pattern, ethanol example) follows from getting this distinction right.

**What is NOT load-bearing:** Half-life derivation (kp3) is mathematical and follows from first-order understanding. The 50% → 25% → 12.5% decay pattern is a standard calculation most students can perform.

### Atom 1: atom-first-zero-order-1

**Proposed prompt:** Compare first-order and zero-order elimination kinetics. Define each in terms of whether a constant fraction or constant amount is removed per unit time, explain what condition causes a drug to follow zero-order kinetics, and give the classic clinical example of each.

**Load-bearing because:** This distinction is the foundation of ALL elimination kinetics reasoning. Students who confuse "constant fraction" (first-order) with "constant amount" (zero-order) cannot interpret half-life, predict drug accumulation, or understand Michaelis-Menten transitions. The synthesis question builds everything on this single concept.

**Source MCQs:** ap1-w1-041 (first-order = constant fraction), ap1-w1-051 (zero-order = constant amount, ethanol example)

**Topic:** elimination-kinetics

---

## r-ap1-w1-9b — Hepatic & Renal Clearance, Dose Adjustment

**Synthesis asks:** Explain flow-limited clearance in cardiogenic shock (lidocaine accumulation), misleading creatinine in the elderly, renal excretion mechanisms, ion trapping, and glutathione/NAPQI.

**What students freeze on:** (1) High extraction ratio = flow-limited clearance — the concept that for drugs like lidocaine, hepatic BLOOD FLOW (not enzyme activity or binding) determines clearance. (2) Ion trapping in renal excretion — alkalinizing urine traps weak acids; acidic fetal blood traps weak bases.

**What is NOT load-bearing:** Renal excretion basics (filtration + secretion − reabsorption) are foundational. Elderly creatinine masking (kp3) is a clinical pearl. Glutathione/NAPQI (kp5) is a specific fact.

### Atom 1: atom-flow-limited-clearance-1

**Proposed prompt:** For drugs with a high hepatic extraction ratio (>0.7), clearance is described as "flow-limited." Explain what this means, why changes in hepatic enzyme activity or protein binding have minimal effect on clearance of these drugs, and what clinical condition directly reduces their clearance.

**Load-bearing because:** The CRITICAL key point (kp1, weight 2) requires understanding that lidocaine clearance tracks hepatic blood flow, NOT enzyme capacity. Students who think "induce enzymes → faster clearance" for ALL drugs cannot explain why lidocaine accumulates in cardiogenic shock. The common_errors flag the misconception that enzyme induction can increase clearance beyond the flow-limited ceiling.

**Source MCQs:** ap1-w1-039 (high ER drugs = flow-limited clearance, determined by hepatic blood flow)

**Topic:** clearance-dose-adjustment

### Atom 2: atom-ion-trapping-renal-1

**Proposed prompt:** Explain the ion trapping mechanism used to accelerate renal drug excretion. Describe how changing urine pH traps a weakly acidic drug in the tubular lumen, and then explain how the same principle (at a different pH boundary) causes ion trapping of weak base local anesthetics in fetal circulation.

**Load-bearing because:** Ion trapping requires applying Henderson-Hasselbalch in the opposite direction from the absorption context — here it's about PREVENTING reabsorption rather than preventing absorption. Students freeze on the directional logic: alkaline urine traps weak ACIDS (not bases); acidic fetal blood traps weak BASES (not acids). The common_errors explicitly flag this directional confusion.

**Source MCQs:** ap1-w1-043 (alkalinize urine → trap weak acid phenobarbital), ap1-w1-044 (fetal ion trapping — lower fetal pH ionizes weak base LA)

**Topic:** clearance-dose-adjustment

---

## r-ap1-w1-9c — Steady State, Phenytoin Kinetics, Three-Phase Curve

**Synthesis asks:** Explain the 5-half-life rule for steady state, why phenytoin is uniquely dangerous to dose (Michaelis-Menten kinetics), and the three-phase concentration-time curve with ke0/hysteresis.

**What students freeze on:** (1) Michaelis-Menten (saturable) kinetics — the transition from first-order to zero-order as enzymes saturate, making small dose increases produce disproportionate concentration jumps. (2) The three-phase curve and ke0 — understanding alpha/beta/gamma phases and why peak clinical effect lags behind peak plasma concentration.

**What is NOT load-bearing:** The 5-half-life rule (kp4) is a numerical fact derived from first-order kinetics — most students either know it or can derive it from the geometric decay covered in r-ap1-w1-9a.

### Atom 1: atom-michaelis-menten-1

**Proposed prompt:** Phenytoin is described as following "Michaelis-Menten" or "saturable" kinetics. Explain how a drug can appear to follow first-order kinetics at low concentrations but shift to zero-order at higher concentrations, and describe the clinical consequence of this transition for dose adjustments.

**Load-bearing because:** Saturable kinetics is the mechanism behind phenytoin's notorious dosing danger (kp5). Students who only know first-order and zero-order as separate categories freeze when confronted with a drug that TRANSITIONS between them. The insight — that enzyme saturation causes the switch and makes small dose increases unpredictable — is the key mechanism.

**Source MCQs:** ap1-w1-040 (phenytoin = saturable Michaelis-Menten, capacity-limited), ap1-w1-077 (phenytoin = classic example of saturable kinetics)

**Topic:** elimination-kinetics

### Atom 2: atom-three-phase-curve-1

**Proposed prompt:** After an IV bolus, the plasma concentration-time curve shows three distinct phases. Name each phase in order, identify what pharmacokinetic process dominates during each, and explain what ke0 measures and why peak clinical effect does not coincide with peak plasma concentration.

**Load-bearing because:** The three-phase model (alpha/beta/gamma) and ke0/effect-site equilibration are the framework for interpreting PK/PD data and understanding hysteresis (kp6). Students who cannot distinguish distribution from redistribution from elimination phases cannot reason about onset/offset timing, and without ke0, they cannot explain the clinical lag between blood level and brain effect. This is foundational for TCI and titration reasoning.

**Source MCQs:** ap1-w1-055 (three phases: rapid distribution, redistribution, terminal elimination), ap1-w1-056 (ke0 = effect-site equilibration rate), ap1-w1-057 (hysteresis = temporal lag between plasma concentration and effect)

**Topic:** elimination-kinetics

---

## Cross-Feed Map

Atoms can feed multiple synthesis questions when the same mechanism is load-bearing for more than one scenario.

| Atom ID | Primary synthesis Q | Also feeds |
|---|---|---|
| atom-cyp2d6-prodrug-1 | r-ap1-w1-6b (kp6) | r-ap1-w1-7 (kp1, CRITICAL) |

All other atoms are single-feed. The existing 6 atoms remain as-is:
- atom-competitive-antag-1, atom-noncompetitive-antag-1, atom-inverse-agonism-1 → r-ap1-w1-1b
- atom-central-compartment-1, atom-redistribution-1, atom-csht-1 → r-ap1-w1-3a

---

## Atoms NOT Proposed — Concepts Ruled Out

For transparency, the following rubric key points were evaluated and determined NOT to warrant atoms:

| Synthesis Q | Key Point | Why no atom |
|---|---|---|
| r-ap1-w1-1a | kp1 (full agonist definition) | Foundational — most students have this cold |
| r-ap1-w1-2 | kp4 (corticosteroids reverse tachyphylaxis) | Supporting detail, not a retrieval bottleneck |
| r-ap1-w1-3b | kp6 (elderly smaller Vc) | Straightforward "less volume = higher concentration" |
| r-ap1-w1-4 | kp1 (free fraction = active) | Foundational PK principle |
| r-ap1-w1-4 | kp5 (kernicterus mechanism) | Clinical application, stays in synthesis |
| r-ap1-w1-5 | kp3 (first-pass metabolism) | Foundational PK — oral → portal → liver |
| r-ap1-w1-5 | kp4-5 (sublingual/rectal bypass) | Anatomical facts, not mechanism retrievals |
| r-ap1-w1-6a | kp1-2 (Phase I vs Phase II) | Standard classification, not a freeze point |
| r-ap1-w1-6b | kp5 (halothane hepatitis) | Specific niche mechanism, not a retrieval bottleneck |
| r-ap1-w1-7 | kp4 (alcohol tolerance) | Dual mechanism is factual, not a blocking retrieval |
| r-ap1-w1-7 | kp5 (G6PD/methylene blue) | Specific niche mechanism, not a blocking retrieval |
| r-ap1-w1-8 | kp3 (ED50/TI definitions) | Formulaic definitions |
| r-ap1-w1-8 | kp5 (MAC additivity) | Follows naturally as contrast to synergy atom |
| r-ap1-w1-9a | kp3 (half-life formula/decay) | Mathematical derivation from first-order concept |
| r-ap1-w1-9b | kp2 (renal excretion mechanisms) | Foundational — filtration + secretion − reabsorption |
| r-ap1-w1-9b | kp3 (elderly creatinine masking) | Clinical pearl, not mechanism retrieval |
| r-ap1-w1-9b | kp5 (glutathione/NAPQI) | Specific factual knowledge |
| r-ap1-w1-9c | kp4 (5 half-lives to steady state) | Numerical rule, most students have it |

---

## Flagged: No Source MCQ Gaps

Every proposed atom traces to at least one MCQ in the ap1-wk1 bank. No atom required content outside the existing 80 MCQs. No MCQ source gaps to flag.
