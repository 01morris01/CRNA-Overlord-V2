# Atom Candidates — ap1-wk-2

**Generated:** 2026-05-27
**Scope:** Load-bearing atom proposals for the 10 synthesis questions on ap1-wk-2
**Source:** Stoelting Ch 3 pp 76-94, Vandivier PNS lecture (slides 4-30)

---

## Summary

| Synthesis Q | Topic | New atoms | IDs | Cross-feeds (existing) |
|---|---|---|---|---|
| r-ap1-w2-1 | ans-architecture | 1 | atom-autonomic-tone-baseline-1 | |
| r-ap1-w2-2 | neurotransmitter-pathways | 2 | atom-preganglionic-ach-nicotinic-1, atom-postganglionic-divergence-1 | |
| r-ap1-w2-3 | ne-lifecycle | 2 | atom-ne-synthesis-pathway-1, atom-ne-reuptake-dominance-1 | |
| r-ap1-w2-4 | ne-drug-interactions | 1 | atom-ephedrine-tachyphylaxis-1 | atom-ne-reuptake-dominance-1 (from r-ap1-w2-3) |
| r-ap1-w2-5 | acetylcholine-pharmacology | 1 | atom-ach-synthesis-hydrolysis-1 | atom-atypical-bche-1 (from wk-1) |
| r-ap1-w2-6 | autonomic-dysfunction | 1 | atom-hrv-autonomic-marker-1 | atom-bidirectional-regulation-1 (from wk-1) |
| r-ap1-w2-7 | pheochromocytoma-management | 1 | atom-alpha-before-beta-pheo-1 | |
| r-ap1-w2-8 | adrenal-medulla | 2 | atom-adrenal-modified-ganglion-1, atom-pnmt-cortisol-epi-1 | |
| r-ap1-w2-9 | perioperative-thermoregulation | 2 | atom-three-phase-hypothermia-1, atom-nonshivering-thermogenesis-1 | |
| r-ap1-w2-10 | thermoregulation-anesthesia | 1 | atom-regional-thermoreg-1 | |

**Totals:** 14 new atoms across 10 synthesis questions (avg 1.4 new/question).
**Cross-feeds (new):** atom-ne-reuptake-dominance-1 feeds both r-ap1-w2-3 AND r-ap1-w2-4.
**Cross-feeds (existing wk-1 atoms):** atom-atypical-bche-1 feeds r-ap1-w2-5; atom-bidirectional-regulation-1 feeds r-ap1-w2-6.

---

## r-ap1-w2-1 — ANS Architecture and Organ Effects

**Synthesis asks:** Explain the three ANS divisions, their opposing effects on target organs, and why peritoneal traction triggers vagal bradycardia reversed by atropine.

**What students freeze on:** The concept of continuous autonomic tone. Students understand fight-or-flight vs rest-and-digest in isolation but do not grasp that BOTH divisions are always active at a baseline level, and that blocking one unmasks the other. This is why neuraxial anesthesia causes hypotension (loss of sympathetic vasoconstrictor tone) and why beta-blockers can unmask vagal bradycardia.

**What is NOT load-bearing:** The three-division taxonomy (sympathetic, parasympathetic, enteric) is taught in every A&P course. The organ-by-organ effects table is memorization, not conceptual. Atropine as a muscarinic antagonist is a single drug fact.

### Atom 1: atom-autonomic-tone-baseline-1

**Proposed prompt:** Explain the concept of residual autonomic tone. Why are both the sympathetic and parasympathetic nervous systems described as continuously active, and what is the clinical consequence of blocking one division pharmacologically or with neuraxial anesthesia?

**Load-bearing because:** The CRITICAL key point (kp2, weight 2) requires understanding that sympathetic and parasympathetic effects are always in dynamic balance, not activated situationally. Without this, students cannot explain why spinal anesthesia causes hypotension (loss of 50% baseline vasoconstriction), why beta-blockers unmask vagal tone, or why anticholinergics unmask sympathetic tachycardia. This is the conceptual bridge between pharmacology and clinical anesthesia hemodynamics.

**Source MCQs:** ap1-w2-028 (sympathetic tone keeps vessels ~50% constricted), ap1-w2-029 (both divisions continuously active)

**Topic:** ans-architecture

---

## r-ap1-w2-2 — Autonomic Neurotransmitter Pathways

**Synthesis asks:** Walk through the complete neurotransmitter scheme at every autonomic synapse and identify the sweat gland exception.

**What students freeze on:** (1) The fact that ALL preganglionic fibers (both divisions) release the same neurotransmitter (ACh at nicotinic receptors) — students often assume the sympathetic preganglionic transmitter is NE. (2) The postganglionic divergence pattern and its exception.

**What is NOT load-bearing:** Ganglionic blocker pharmacology (trimethaphan) is a clinical extension. The nicotinic NN vs NM distinction is a detail that builds on the foundational concept.

### Atom 1: atom-preganglionic-ach-nicotinic-1

**Proposed prompt:** Identify the neurotransmitter and receptor type used by ALL preganglionic autonomic neurons, regardless of whether they are sympathetic or parasympathetic. Explain why this shared preganglionic transmitter means that ganglionic blocking drugs inhibit both divisions simultaneously.

**Load-bearing because:** Students chronically misattribute NE to sympathetic preganglionic fibers, confusing the postganglionic transmitter with the preganglionic one. This error cascades into misunderstanding ganglionic pharmacology, adrenal medullary signaling, and autonomic drug targets. The synthesis question cannot be answered without this foundation.

**Source MCQs:** ap1-w2-009 (all preganglionic = ACh), ap1-w2-010 (nicotinic receptors in ganglia)

**Topic:** neurotransmitter-pathways

### Atom 2: atom-postganglionic-divergence-1

**Proposed prompt:** Explain the postganglionic neurotransmitter divergence between the sympathetic and parasympathetic divisions: what transmitter and receptor type does each use at the target organ? Identify the notable exception where sympathetic postganglionic fibers release acetylcholine and state its clinical significance.

**Load-bearing because:** The CRITICAL key point (kp2, weight 2) hinges on this divergence. The adrenergic (NE) vs cholinergic (ACh at muscarinic receptors) distinction is the pharmacologic basis for every autonomic drug. The sweat gland exception is a high-yield exam target that students miss when they overgeneralize the rule "sympathetic = adrenergic." Without this atom, students also cannot explain why atropine reduces sweating.

**Source MCQs:** ap1-w2-011 (postganglionic sympathetic = NE = adrenergic), ap1-w2-012 (postganglionic parasympathetic = ACh = cholinergic), ap1-w2-013 (sweat gland exception)

**Topic:** neurotransmitter-pathways

---

## r-ap1-w2-3 — NE Lifecycle: Synthesis to Termination

**Synthesis asks:** Trace NE from synthesis through termination and explain why MAOI therapy makes indirect sympathomimetics dangerous.

**What students freeze on:** (1) The synthesis pathway sequence and where each step occurs (cytoplasm vs vesicle). (2) The dominance of reuptake (80%) over enzymatic degradation for NE termination; without this, the mechanism of cocaine, TCAs, and MAOIs cannot be explained.

**What is NOT load-bearing:** Alpha methyldopa as false neurotransmitter (kp3) is an interesting drug mechanism but not the gateway concept. MAOI danger is a clinical application of the termination principles.

### Atom 1: atom-ne-synthesis-pathway-1

**Proposed prompt:** Trace the complete norepinephrine synthesis pathway from its amino acid precursor to the finished neurotransmitter. Identify the rate-limiting enzyme, state which steps occur in the cytoplasm versus inside the synaptic vesicle, and name the enzyme that catalyzes the final intravesicular conversion.

**Load-bearing because:** Students routinely scramble the synthesis steps or place the final conversion (dopamine to NE) in the wrong compartment. The rate-limiting step (tyrosine hydroxylase) and the intravesicular location of dopamine beta hydroxylase are high-yield facts that anchor the entire catecholamine pharmacology framework.

**Source MCQs:** ap1-w2-014 (Tyr -> DOPA -> DA -> NE sequence, rate-limiting), ap1-w2-015 (dopamine beta hydroxylase inside vesicle)

**Topic:** ne-lifecycle

### Atom 2: atom-ne-reuptake-dominance-1

**Proposed prompt:** Identify the three mechanisms that terminate norepinephrine action at the synapse. Which mechanism accounts for approximately 80% of NE removal, and why does blocking this single mechanism (as cocaine and tricyclic antidepressants do) produce such potent sympathomimetic effects?

**Load-bearing because:** The CRITICAL key point (kp2, weight 2) rests entirely on understanding that reuptake is the dominant termination mechanism. Students who think enzymatic degradation (MAO, COMT) is primary cannot reason about reuptake blockers, MAOI drug interactions, or the pharmacologic difference between cocaine and MAOIs. This is the gateway concept for all NE drug interactions in the Week 2 curriculum.

**Source MCQs:** ap1-w2-019 (three termination mechanisms), ap1-w2-020 (reuptake = most important, ~80%), ap1-w2-021 (80% figure), ap1-w2-022 (cocaine blocks reuptake)

**Topic:** ne-lifecycle

**Cross-feed:** Also feeds r-ap1-w2-4 (cocaine mechanism in the tachyphylaxis question).

---

## r-ap1-w2-4 — Indirect Sympathomimetics: Tachyphylaxis and Reuptake Blockade

**Synthesis asks:** Explain ephedrine tachyphylaxis, the switch to phenylephrine, and cocaine cardiovascular toxicity.

**What students freeze on:** The mechanism of tachyphylaxis. Students know ephedrine "raises blood pressure" but do not understand that it works indirectly by depleting stored NE. When the stores are gone, the drug stops working — and the rescue is to bypass the depleted stores entirely with a direct-acting agent.

**What is NOT load-bearing:** NE vesicular storage (kp1) is foundational; most students know it. Cocaine reuptake blockade is covered by atom-ne-reuptake-dominance-1 from r-ap1-w2-3.

### Atom 1: atom-ephedrine-tachyphylaxis-1

**Proposed prompt:** Ephedrine is an indirect acting sympathomimetic. Explain how it produces its pressor effect, why repeated boluses cause a progressively weaker response (tachyphylaxis), and what class of vasopressor you should switch to when tachyphylaxis occurs.

**Load-bearing because:** The CRITICAL key point (kp2, weight 2) depends on understanding depletion-based tachyphylaxis. This is a daily clinical decision in anesthesia: when to abandon ephedrine and switch to phenylephrine. Students who do not understand the indirect/direct mechanism distinction will not make this switch at the right time. The depletion model (not receptor failure) is the key insight.

**Source MCQs:** ap1-w2-017 (NE stored in vesicles), ap1-w2-018 (tachyphylaxis from store depletion, switch to direct-acting)

**Topic:** ne-drug-interactions

**Also fed by:** atom-ne-reuptake-dominance-1 (cross-feed from r-ap1-w2-3, for cocaine mechanism in kp3).

---

## r-ap1-w2-5 — Acetylcholine Pharmacology and Pseudocholinesterase

**Synthesis asks:** Walk through ACh synthesis and hydrolysis, explain neostigmine reversal of NMB, and explain prolonged succinylcholine paralysis from pseudocholinesterase variants.

**What students freeze on:** The ACh synthesis/hydrolysis cycle. Students know AChE breaks down ACh but cannot name the synthetic enzyme (ChAT) or the substrates (choline + acetyl-CoA), and do not realize that choline is recycled. Without this, the mechanism of cholinesterase inhibitors becomes opaque.

**What is NOT load-bearing:** Pseudocholinesterase variant pharmacogenetics is already covered by atom-atypical-bche-1 from Week 1 (r-ap1-w1-7). No new atom needed for that concept.

### Atom 1: atom-ach-synthesis-hydrolysis-1

**Proposed prompt:** Trace acetylcholine from synthesis to termination at the parasympathetic neuroeffector junction. Name the synthetic enzyme and its two substrates, identify the enzyme that terminates ACh action, name the hydrolysis products, and explain how choline is conserved for resynthesis.

**Load-bearing because:** The ACh lifecycle is the cholinergic counterpart to the NE lifecycle (r-ap1-w2-3). Without it, students cannot explain how neostigmine reverses NMB (AChE inhibition allows ACh accumulation), why glycopyrrolate is coadministered (muscarinic side effects from excess ACh), or why plasma cholinesterase deficiency prolongs succinylcholine (different enzyme, different substrate). The synthesis question's CRITICAL key point (kp2) depends on understanding what AChE does to reason about what happens when it is blocked.

**Source MCQs:** ap1-w2-023 (ChAT), ap1-w2-024 (choline + acetyl-CoA), ap1-w2-025 (AChE hydrolysis), ap1-w2-026 (choline + acetate, recycling)

**Topic:** acetylcholine-pharmacology

**Also fed by:** atom-atypical-bche-1 (existing wk-1 cross-feed for pseudocholinesterase variant in kp3).

---

## r-ap1-w2-6 — Autonomic Dysfunction: Perioperative Implications

**Synthesis asks:** Explain diabetic autonomic neuropathy findings, HRV as a diagnostic marker, and denervation hypersensitivity in a transplanted heart.

**What students freeze on:** (1) HRV as a clinical tool. Students have heard of HRV but cannot explain what it measures (vagal input to SA node) or what reduced HRV predicts. (2) Denervation hypersensitivity in the transplanted heart. However, the denervation/upregulation mechanism is the same principle covered by atom-bidirectional-regulation-1 from Week 1; a new atom is not needed for the mechanism itself.

**What is NOT load-bearing:** The list of diabetic autonomic neuropathy manifestations (gastroparesis, orthostatic hypotension, sweating abnormalities) is a fact set that students can memorize without a separate atom. The concept that aging reduces autonomic reserve (kp1 content from ap1-w2-036) is foundational.

### Atom 1: atom-hrv-autonomic-marker-1

**Proposed prompt:** Explain what heart rate variability (HRV) measures at the physiologic level, state the relationship between HRV magnitude and parasympathetic activity, and describe why reduced HRV in a diabetic patient is an early warning sign for cardiac autonomic neuropathy with prognostic significance.

**Load-bearing because:** The CRITICAL key point (kp2, weight 2) identifies reduced HRV as the early marker that predicts cardiovascular morbidity. Students who cannot interpret HRV will miss this diagnostic sign during preoperative evaluation. The concept that HRV reflects vagal input to the SA node (not sympathetic activity, not catecholamine levels) is the specific point students confuse.

**Source MCQs:** ap1-w2-031 (HRV reflects parasympathetic/vagal activity, reduced HRV = early marker)

**Topic:** autonomic-dysfunction

**Also fed by:** atom-bidirectional-regulation-1 (existing wk-1 cross-feed for denervation hypersensitivity in kp3).

---

## r-ap1-w2-7 — Pheochromocytoma Perioperative Pharmacology

**Synthesis asks:** Explain diagnosis, the alpha-before-beta blockade sequence, and predict post-resection hemodynamics.

**What students freeze on:** The alpha-before-beta sequence. Students know both blockers are needed but do not understand WHY the sequence matters. The mechanism (beta blockade removes beta-2 vasodilation, leaving alpha vasoconstriction unopposed) is the single concept that prevents a potentially fatal error.

**What is NOT load-bearing:** The 24-hour urine collection as diagnostic method (kp1) is a specific fact. Post-resection hypotension (kp3) is a clinical prediction that follows logically from understanding catecholamine physiology once the alpha/beta concept is mastered.

### Atom 1: atom-alpha-before-beta-pheo-1

**Proposed prompt:** A patient with pheochromocytoma requires preoperative pharmacologic preparation. Explain why alpha adrenergic blockade must be established before beta blockade is initiated. What specific hemodynamic catastrophe occurs if beta blockade is started first, and what is the mechanism?

**Load-bearing because:** The CRITICAL key point (kp2, weight 2) is the blockade sequence rule. Getting this wrong in clinical practice causes a hypertensive crisis that can be fatal. The mechanism (beta-2 vasodilation removed, alpha vasoconstriction unopposed) is a single concept that requires understanding receptor subtype pharmacology. This is the highest-stakes clinical decision point in the Week 2 curriculum.

**Source MCQs:** ap1-w2-035 (alpha before beta, unopposed alpha crisis)

**Topic:** pheochromocytoma-management

---

## r-ap1-w2-8 — Adrenal Medulla as Modified Sympathetic Ganglion

**Synthesis asks:** Explain the modified ganglion anatomy, PNMT/cortisol relationship, and epinephrine vs NE pharmacology.

**What students freeze on:** (1) Why the adrenal medulla is a "modified ganglion" and not just a gland. Students cannot trace the signaling chain from preganglionic fiber to catecholamine release into the bloodstream. (2) The PNMT/cortisol link. Students know cortisol is a stress hormone but do not connect it to epinephrine production.

**What is NOT load-bearing:** Epinephrine vs NE receptor profiles (kp3) are pharmacology facts that build on the foundational concept but do not gate understanding of the adrenal medulla itself.

### Atom 1: atom-adrenal-modified-ganglion-1

**Proposed prompt:** Explain why the adrenal medulla is described as a modified sympathetic ganglion rather than a typical endocrine gland. Identify the type of nerve fiber that innervates it, the receptor type on chromaffin cells, and the signaling cascade from preganglionic stimulation to catecholamine release into the bloodstream.

**Load-bearing because:** The modified ganglion concept (preganglionic fiber -> nicotinic receptor -> chromaffin cell -> exocytosis into blood) is the structural framework for understanding adrenal catecholamine physiology. Without it, students cannot explain why sympathomimetic drugs, ganglionic blockers, or cholinergic agents affect adrenal output. The synthesis question's kp1 (weight 1) depends entirely on this anatomy.

**Source MCQs:** ap1-w2-037 (preganglionic sympathetic innervation), ap1-w2-038 (chromaffin cells = modified postganglionic neurons), ap1-w2-042 (nicotinic receptors, calcium influx, exocytosis)

**Topic:** adrenal-medulla

### Atom 2: atom-pnmt-cortisol-epi-1

**Proposed prompt:** Name the enzyme that converts norepinephrine to epinephrine in the adrenal medulla, state the approximate ratio of epinephrine to norepinephrine in adrenal medullary output, and explain how cortisol from the adjacent adrenal cortex regulates this enzyme to link the HPA stress axis to catecholamine production.

**Load-bearing because:** The CRITICAL key point (kp2, weight 2) rests on understanding the PNMT/cortisol relationship. This is the molecular link between the hypothalamic-pituitary-adrenal stress response and the adrenal medullary catecholamine surge. Students who do not know PNMT cannot explain why the adrenal medulla produces mostly epinephrine (not NE) or why cortisol deficiency alters the catecholamine ratio.

**Source MCQs:** ap1-w2-039 (80% epi), ap1-w2-040 (PNMT converts NE to epi), ap1-w2-041 (cortisol upregulates PNMT)

**Topic:** adrenal-medulla

---

## r-ap1-w2-9 — Perioperative Thermoregulation: Three Phases

**Synthesis asks:** Walk through the three phases of perioperative hypothermia, heat loss mechanisms, cold defense responses, and why GA abolishes them.

**What students freeze on:** (1) The three-phase model. Students know "patients get cold in the OR" but cannot explain WHY the first hour produces the steepest drop (redistribution, not environmental loss) or why the curve eventually plateaus (vasoconstriction). (2) Nonshivering thermogenesis. Students confuse it with shivering or do not know it involves brown fat and UCP-1.

**What is NOT load-bearing:** Heat loss physics (radiation, conduction, convection, evaporation) is foundational A&P. The hypothalamus as thermoregulatory center is universally known. The fact that GA abolishes cold defenses is a synthesis-level integration, not a single concept.

### Atom 1: atom-three-phase-hypothermia-1

**Proposed prompt:** Describe the three phases of perioperative hypothermia that occur during general anesthesia: name each phase, state the timeframe, quantify the temperature change where applicable, and explain the mechanism driving each phase. Specifically distinguish the mechanism of Phase 1 from Phase 2.

**Load-bearing because:** The CRITICAL key point (kp2, weight 2) is the three-phase model. Students who attribute the first-hour temperature drop to environmental heat loss (rather than internal core-to-peripheral redistribution) will fail to understand why prewarming is effective (it narrows the redistribution gradient) and why the Phase 3 plateau depends on vasoconstriction. This conceptual framework is the backbone of perioperative temperature management.

**Source MCQs:** ap1-w2-055 (Phase 1 redistribution, 0.5-1.5 C), ap1-w2-056 (Phase 2 linear, heat loss exceeds production), ap1-w2-057 (Phase 3 plateau, vasoconstriction)

**Topic:** perioperative-thermoregulation

### Atom 2: atom-nonshivering-thermogenesis-1

**Proposed prompt:** Explain nonshivering thermogenesis: identify the tissue responsible, the molecular mechanism by which it generates heat, the receptor system that activates it, and state whether it is present or absent during general anesthesia. Contrast it with shivering thermogenesis in terms of mechanism and metabolic cost.

**Load-bearing because:** Students consistently confuse nonshivering thermogenesis (brown fat, UCP-1, sympathetic beta-adrenergic activation) with shivering (skeletal muscle contraction). The synthesis question's kp3 (weight 1) requires knowing that both defenses are abolished by GA but for different reasons (NST is absent, shivering is blocked by muscle relaxants). The metabolic cost of shivering (200-300% increase in O2 consumption) is a high-yield anesthesia fact.

**Source MCQs:** ap1-w2-049 (brown fat, UCP-1, beta-adrenergic), ap1-w2-050 (shivering increases O2 consumption 200-300%), ap1-w2-054 (NST absent during GA)

**Topic:** perioperative-thermoregulation

---

## r-ap1-w2-10 — Thermoregulation: Anesthetic Effects, Regional Anesthesia, and Prevention

**Synthesis asks:** Identify drugs that lower thermoregulatory thresholds, explain why combined GA+regional creates the highest hypothermia risk, and describe consequences and prevention.

**What students freeze on:** Why regional anesthesia specifically prevents the Phase 3 plateau. Students understand that spinal/epidural causes vasodilation, but they do not connect this to the thermoregulation framework: the Phase 3 plateau requires vasoconstriction below a certain core temperature threshold, and the sympathetic block prevents this vasoconstriction from occurring in the blocked segments.

**What is NOT load-bearing:** The specific drug names (propofol, alfentanil) are facts. Consequences of hypothermia (delayed drug metabolism, impaired coagulation) are a fact set. Prewarming is a strategy that follows logically from the redistribution concept (atom-three-phase-hypothermia-1).

### Atom 1: atom-regional-thermoreg-1

**Proposed prompt:** Explain why regional anesthesia (spinal or epidural) increases the risk of perioperative hypothermia beyond what general anesthesia alone produces. Specifically describe which thermoregulatory defense mechanism is blocked, which phase of perioperative hypothermia may fail to develop, and why combined general plus regional anesthesia is the highest-risk combination.

**Load-bearing because:** The CRITICAL key point (kp2, weight 2) depends on understanding that regional anesthesia blocks sympathetic vasoconstriction below the level of the block, preventing the Phase 3 plateau from developing. This is the reason combined GA+regional is the worst-case scenario: GA abolishes central thermoregulatory defenses while regional abolishes the peripheral vasoconstriction needed for equilibrium. Students who do not understand this cannot predict which patients need the most aggressive warming.

**Source MCQs:** ap1-w2-058 (regional blocks vasoconstriction, Phase 3 may not develop, combined = highest risk)

**Topic:** thermoregulation-anesthesia

---

## Planned feeder_atoms wiring (Stage 4)

After atom authoring, the following feeder_atoms arrays will be populated:

| Synthesis Q | feeder_atoms |
|---|---|
| r-ap1-w2-1 | atom-autonomic-tone-baseline-1 |
| r-ap1-w2-2 | atom-preganglionic-ach-nicotinic-1, atom-postganglionic-divergence-1 |
| r-ap1-w2-3 | atom-ne-synthesis-pathway-1, atom-ne-reuptake-dominance-1 |
| r-ap1-w2-4 | atom-ephedrine-tachyphylaxis-1, atom-ne-reuptake-dominance-1 |
| r-ap1-w2-5 | atom-ach-synthesis-hydrolysis-1, atom-atypical-bche-1 |
| r-ap1-w2-6 | atom-hrv-autonomic-marker-1, atom-bidirectional-regulation-1 |
| r-ap1-w2-7 | atom-alpha-before-beta-pheo-1 |
| r-ap1-w2-8 | atom-adrenal-modified-ganglion-1, atom-pnmt-cortisol-epi-1 |
| r-ap1-w2-9 | atom-three-phase-hypothermia-1, atom-nonshivering-thermogenesis-1 |
| r-ap1-w2-10 | atom-regional-thermoreg-1 |
