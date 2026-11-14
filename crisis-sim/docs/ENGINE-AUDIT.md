# CRNA Overlord engine audit

Scope: `crisis-sim/sim/` as found on branch `omni/engine-audit`.

Method: code review plus direct engine runs with `node --input-type=module` in `crisis-sim/`. I did not change engine code. Where I report numbers, they are values I observed from this checkout.

Known-item verdicts up front:

- **(a) spontaneous respiratory rate ignores neuromuscular block**: **confirmed** in the default engine.
- **(b) VO2/VCO2 scaled to total body weight**: **confirmed** in the default engine.
- **(c) dead space 2.2 mL/kg of total body weight**: **confirmed** in the default engine.
- **(d) propofol–opioid interaction applied to BIS but not to ventilation**: **confirmed in substance**. BIS has an explicit interaction term; ventilation applies separate propofol and fentanyl depressant terms without a response-surface interaction.
- **(e) supplemental O2 delaying the SpO2 fall during hypoventilation**: **yes**. The engine does delay the fall, but with a very coarse FiO2 delivery model on the natural airway.

## Main findings

### EA-001 — Severe neuromuscular block leaves respiratory rate unchanged
**Severity:** High

**Code:** `sim/patientPhysiology.js:219-223`, `sim/patientPhysiology.js:425-431`

> `get spontaneousRespiratoryRate() { return f(this.baselineRR * this.centralDrive); }`
>
> `return f(f(7 * this.weightKg) * this.respiratoryMuscleCapability);`
>
> `: Clamp(this.baselineRR * this._rrModifier * this.respiratoryDriveFactor, 0, 40);`

**What the code does:**
The default model lets neuromuscular block shrink tidal volume through `respiratoryMuscleCapability`, but it does not let the block reduce spontaneous rate unless some other driver also reduces `centralDrive`.

Observed run on a 70 kg adult after forcing TOF ratio to about 0.08:

- TOF ratio: **0.0804**
- TOF count: **0**
- respiratory muscle capability: **0.0894**
- spontaneous RR: **14/min**
- spontaneous TV: **43.8 mL**
- spontaneous MV: **0.613 L/min**
- `isBreathingSpontaneously`: **true**

So the engine teaches “same rate, microscopic breaths” even at profound block.

**Why it looks unrealistic (needs source):**
Profound residual or near-complete nondepolarizing block does not behave like a perfectly preserved central respiratory rhythm with only a linear tidal-volume shrink. Real patients develop impaired inspiratory force, upper-airway weakness, altered patterning, and often inadequate or absent effective spontaneous ventilation before TOF 0.9. The model’s fixed-rate behavior at TOF about 0.08 is not a believable teaching simplification.

**What source would settle it:**
A study of spontaneous minute ventilation, tidal volume, and respiratory rate versus TOF ratio in partially and profoundly paralyzed adults recovering from nondepolarizing block.

---

### EA-002 — Resting metabolism, spontaneous tidal volume, and dead space all scale to total body weight
**Severity:** High

**Code:** `sim/patientPhysiology.js:223`, `sim/patientPhysiology.js:285-291`, `sim/patientPhysiology.js:478-480`

> `return f(f(7 * this.weightKg) * this.respiratoryMuscleCapability);`
>
> `const perKg = this.ageYears < 12 ? 6.0 : 3.5;`
>
> `return Max(20, perKg * this.weightKg);`
>
> `return Max(15, f(2.8) * this.weightKg);`
>
> `const deadspace = Max(60, f(2.2) * this.weightKg);`

**What the code does:**
The default engine uses **total body weight** for all of these:

- spontaneous tidal volume = `7 mL/kg * total weight`
- VO2 = `3.5 mL/kg/min * total weight`
- VCO2 = `2.8 mL/kg/min * total weight`
- dead space = `2.2 mL/kg * total weight`

Observed run for a 139.4 kg, 178 cm adult:

- VO2: **487.9 mL/min**
- VCO2: **390.3 mL/min**
- spontaneous TV: **975.8 mL**
- dead space: **306.7 mL**
- spontaneous MV: **13.66 L/min**
- after 2 h with `stores` CO2 kinetics, PaCO2: **36.0 mmHg**

This is a very large “resting awake” breath size and minute ventilation for a teaching-simulator baseline.

**Why it looks unrealistic (needs source):**
In obesity, resting metabolic rate, anatomic dead space, and spontaneous tidal volume do not all scale linearly with total body weight. Using total weight everywhere can create implausibly large breaths and minute ventilation, and it bakes one particular obesity assumption into every baseline and every ventilation consequence.

**What source would settle it:**
A review or physiologic study on which body-size scalar best predicts adult resting VO2/VCO2, spontaneous tidal volume, and anatomic dead space in obesity.

---

### EA-003 — The default spontaneous-breathing controller has no hypercapnic ventilatory response
**Severity:** High

**Code:** `sim/patientPhysiology.js:425-428`

> `const targetRR = procedureOrForcedApnea`
> `  ? 0`
> `  : sed ? Clamp(this.baselineRR * sedDrive, 0, 40)`
> `    : Clamp(this.baselineRR * this._rrModifier * this.respiratoryDriveFactor, 0, 40);`

**What the code does:**
Outside the experimental sedation layer, respiratory rate depends on baseline RR, drug depression, and complication drive. PaCO2 is not part of the spontaneous controller.

Observed run on an awake 70 kg adult with `stores` CO2 kinetics after tripling VCO2 for 10 minutes:

- before: RR **14/min**, TV **490 mL**, MV **6.86 L/min**, PaCO2 **40.53 mmHg**
- after: RR **14/min**, TV **490 mL**, MV **6.86 L/min**, PaCO2 **82.63 mmHg**

The patient retains CO2 massively without increasing breathing at all.

**Why it looks unrealistic (needs source):**
A spontaneously breathing adult should show some ventilatory response to rising PaCO2 unless that response is intentionally blunted by anesthetics, neuromuscular weakness, or pathology. A model with no CO2 feedback in the default spontaneous controller will mis-teach common sedation and recovery physiology.

**What source would settle it:**
A standard respiratory physiology source, or a study quantifying ventilatory response to hypercapnia in awake and anesthetized adults.

---

### EA-004 — The default CO2 update rule can make partial breathing worse than apnea
**Severity:** High

**Code:** `sim/ventilatorSystem.js:322-345`

> `const spontaneousTv = this.co2Kinetics === 'stores' && this.patient.spontaneousTidalVolume > 0 ? this.patient.spontaneousTidalVolume : 400;`
>
> `} else if (vaLMin > 0.3) {`
> `  const targetPaCO2 = Clamp(f(0.863) * this.patient.vco2MlMin / vaLMin, 10, 130);`
> `  this.patient.paCO2 = Lerp(this.patient.paCO2, targetPaCO2, Clamp01(dt / 25));`
> `} else {`
> `  const rise = f(f(0.06) * (this.patient.vco2MlMin / 200));`

**What the code does:**
In legacy mode, the CO2 model switches behavior at alveolar ventilation 0.3 L/min. Above that threshold it jumps toward a target PaCO2; below it, it uses a fixed apnea-like rise. It also assumes a hard-coded **400 mL** spontaneous tidal volume unless `stores` kinetics are enabled.

Existing tests already document the defect, and my end-to-end run reproduced its consequence after unsupported induction:

- after fentanyl 100 mcg + propofol 140 mg + rocuronium 42 mg, at **90 s** with legacy kinetics:
  - PaCO2 **98.36 mmHg**
  - EtCO2 **95.36 mmHg**
  - RR **5.70/min**
  - spontaneous MV **0.175 L/min**

The repo’s own `test/co2-kinetics.test.js` also states that legacy mode lets a patient breathing 6/min accumulate CO2 much faster than true apnea and creates a jump at the 0.3 L/min boundary.

**Why it looks unrealistic (needs source):**
By mass balance, some alveolar ventilation should not make arterial CO2 rise faster than zero alveolar ventilation. A discontinuity at an arbitrary threshold is not physiologic. This can teach learners that weak spontaneous efforts are more dangerous for CO2 than apnea itself.

**What source would settle it:**
A physiology source deriving the alveolar ventilation equation and a compartment/store model for transient PaCO2 behavior during hypoventilation and apnea.

---

### EA-005 — Propofol–opioid interaction is explicit for BIS but not for ventilation
**Severity:** Medium

**Code:** `sim/patientPhysiology.js:319-330`, `sim/patientPhysiology.js:507-515`

> `let opioidRespEffect = Clamp01(this.fentanylCe / f(1.2));`
> `...`
> `this._rrModifier = f(this._rrModifier - opioidRespEffect * f(1.1));`
>
> `const alpha = 3;`
> `const U = f(up + uo + alpha * up * uo);`
> `return f(93 / (1 + Pow(U, gamma)));`

**What the code does:**
The BIS model has an explicit interaction term (`alpha * up * uo`) for propofol plus fentanyl. Ventilatory depression does not: propofol and fentanyl simply subtract their own separate terms from `_rrModifier`.

Observed values:

- BIS function alone at age 45:
  - propofol Ce 4, fentanyl Ce 0 → **BIS 32.7**
  - propofol Ce 4, fentanyl Ce 2 → **BIS 12.6**
- whole-engine run at 180 s after dosing a 70 kg adult:
  - propofol 140 mg only → propofol Ce **3.47**, RR **6.73/min**, MV **3.29 L/min**, BIS **38.7**
  - propofol 140 mg + fentanyl 100 mcg → propofol Ce **3.47**, fentanyl Ce **0.236**, RR **3.71/min**, MV **1.81 L/min**, BIS **34.2**

So ventilation does worsen when both drugs are present, but by independent additive terms, not by the same kind of interaction used for depth.

**Why it looks unrealistic (needs source):**
Propofol–opioid interaction is a classic response-surface problem, and the interaction for hypnosis is not necessarily the same as the interaction for ventilatory depression. Using a sophisticated interaction for BIS but a separate additive rule for breathing risks mismatching “how asleep” and “how hypoventilated” the same patient is supposed to be.

**What source would settle it:**
A response-surface study or review of propofol–opioid interaction for ventilatory depression, apnea, or CO2 response in adults.

---

### EA-006 — Supplemental oxygen on the natural airway is modeled as machine FiO2, which overstates delivery
**Severity:** Medium

**Code:** `sim/ventilatorSystem.js:92-100`, `sim/ventilatorSystem.js:293-295`

> `const totalFlow = f(this.o2FlowLPerMin + this.airFlowLPerMin + this.n2oFlowLPerMin);`
> `...`
> `this.measuredFiO2 = Clamp(totalO2 / totalFlow, 0.21, 1);`
> `if (this.mode !== VentMode.Manual) this.measuredFiO2 = this.setFiO2;`
>
> `if (this.patient.sedation && this.patient.sedation.active && this.patient.airwayDeviceState !== 'intubated') this.patient.fiO2 = this.patient.sedation.inspiredO2For(this.measuredFiO2);`

**What the code does:**
In the default engine, any oxygen flow on the natural airway becomes the patient’s `fiO2` directly. There is no cannula/mask entrainment model unless the experimental sedation layer is enabled.

Evidence:

- the repo already has a reproduction test (`test/sedation-evidence.test.js:44-47`) showing **4 L/min O2 → FiO2 > 0.99** in the default spontaneous-breathing model
- in my hypoventilation run (intubated to isolate oxygenation behavior), severe under-ventilation reached SpO2 <90 at:
  - **48 s** on room air
  - **71 s** on FiO2 1.0

So the answer to known item (e) is yes: supplemental oxygen does delay desaturation. The problem is that, on the natural airway, the default engine delivers that oxygen with a very coarse “all oxygen flow is inspired oxygen” assumption.

**Why it looks unrealistic (needs source):**
For nasal cannula or loosely held mask oxygen, inspired oxygen fraction depends on device, leak, minute ventilation, inspiratory flow, and mouth breathing. A default model that turns 4 L/min oxygen into nearly 100% inspired oxygen can overstate preoxygenation and delay desaturation too much in common sedation cases.

**What source would settle it:**
A clinical or respiratory-therapy source on expected inspired oxygen fractions for nasal cannula and simple mask oxygen across adult breathing patterns.

---

### EA-007 — Weight-based drug boluses use total body weight for every drug path I checked
**Severity:** Medium

**Code:** `sim/drugSystem.js:84-87`, `sim/scenario/scenarioManager.js:468-481`

> `const totalDose = f(dosePerKg * this.patient.weightKg);`
> `this.administerBolus(drugName, totalDose);`
>
> `case 'Succinylcholine': this.drugSystem.administerWeightBasedBolus('Succinylcholine', 1.0); return true;`
> `case 'Midazolam': this.drugSystem.administerWeightBasedBolus('Midazolam', f(0.03)); return true;`
> `...`
> `case 'Dantrolene': this.drugSystem.administerWeightBasedBolus('Dantrolene', 2.5); return true;`

**What the code does:**
Every route through `administerWeightBasedBolus()` multiplies dose-per-kg by total body weight. I did not find alternate ideal-, lean-, or adjusted-weight dosing paths in the engine.

For a 139.4 kg patient, the engine would calculate:

- propofol 2.5 mg/kg → **348.5 mg**
- rocuronium 0.6 mg/kg → **83.64 mg**
- midazolam 0.03 mg/kg → **4.182 mg**
- dantrolene 2.5 mg/kg → **348.5 mg**

**Why it looks unrealistic (needs source):**
Different anesthetic drugs use different body-size scalars in obesity. Applying total body weight uniformly is not a neutral simplification; it can systematically overdose some agents and mis-teach induction and rescue dosing in obese adults.

**What source would settle it:**
An anesthesia dosing review or guideline covering body-weight scalar choice for common induction drugs, opioids, neuromuscular blockers, reversal agents, and emergency drugs in obese adults.

## Light audit of `sim/sedationExperimental.js`

I only checked this file lightly because the task said it is being edited elsewhere.

What it appears to do:

- it fixes several problems in the default engine directionally, including:
  - ideal-body-weight dead space (`sim/sedationExperimental.js:75`)
  - a CO2 drive term (`sim/sedationExperimental.js:95-99`)
  - natural-airway obstruction and device-dependent oxygen delivery (`sim/sedationExperimental.js:100-123`)
- it also explicitly marks many parameters as `unsourced`

Example lines:

> `deadSpaceMlPerKgIbw: P(2.2, 'source', ... )`
>
> `metabolicWeight: P('ideal body weight + 0.4 x (total - ideal)', 'unsourced', ... )`
>
> `cannulaFio2: P('0.20 + 0.04 per L/min, 1-6 L/min (24-44 %)', 'unsourced', ... )`

My read is: this experimental layer is already trying to correct the most visible default-engine problems, but many of the actual parameter choices are still provisional and not yet ready to be treated as validated physiology.

## Findings sorted by severity

| ID | Severity | Title | Confirmed known item? |
| --- | --- | --- | --- |
| EA-001 | High | Severe neuromuscular block leaves respiratory rate unchanged | a |
| EA-002 | High | Resting metabolism, spontaneous tidal volume, and dead space all scale to total body weight | b, c |
| EA-003 | High | The default spontaneous-breathing controller has no hypercapnic ventilatory response | no |
| EA-004 | High | The default CO2 update rule can make partial breathing worse than apnea | no |
| EA-005 | Medium | Propofol–opioid interaction is explicit for BIS but not for ventilation | d |
| EA-006 | Medium | Supplemental oxygen on the natural airway is modeled as machine FiO2, which overstates delivery | e |
| EA-007 | Medium | Weight-based drug boluses use total body weight for every drug path I checked | no |

## What the existing tests do not cover well

- Default-engine spontaneous breathing under **severe neuromuscular block**: tests check `respiratoryMuscleCapability`, but I did not find a test asserting that RR/pattern should change with TOF.
- Default-engine **hypercapnic ventilatory response**: the repo contains a pinned failing reproduction in `test/sedation-evidence.test.js`, but the passing suite does not require the default model to respond to rising PaCO2.
- Default-engine **obesity scaling**: I did not find a test of awake baseline VO2/VCO2, tidal volume, dead space, or PaCO2 in obese adults.
- **Weight scalar choice by drug** in obesity: I did not find tests asserting IBW/LBW/AdjBW vs TBW for propofol, opioids, NMBs, or reversal agents.
- **Natural-airway oxygen delivery** outside the experimental sedation layer: there is a reproduction test showing the current unrealistic behavior, but not a passing requirement for device-specific FiO2.
- **Consistency between BIS interaction and ventilatory interaction** for propofol plus opioid: I did not find tests comparing those two domains.
- **Unit provenance / comments for hard-coded constants**: there are many numeric constants, but I did not find tests that would catch a units mix-up or an undocumented body-size scalar.
