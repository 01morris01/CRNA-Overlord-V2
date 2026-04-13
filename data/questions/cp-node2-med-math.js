/**
 * Chemistry & Physics for Anesthesia — Node 2
 * Measurement, Math & Chemistry — THE MATH/DRIP NODE
 *
 * ADAPTIVE / UNTIMED — this entire node skips the 35-sec timer.
 * Questions use the 3-step framework from the NAS 510 exam:
 *   Step 1: Concentration (what's in the bag, match units)
 *   Step 2: Dose (weight-based rate × patient mass)
 *   Step 3: Rate (convert to mL/hr for the pump)
 *
 * Source: NAS 510 Medical Math Homework (95 Qs) + Exam 1 Answer Key (63 worked)
 * 40 questions: multiple variants per drug, forward + reverse + titration + mixing
 */

export const CP_NODE2_QUESTIONS = [

  // ═════════════════════════════════════════════════════════════════
  // BOLUS DOSE → VOLUME (5 drugs × different weights)
  // ═════════════════════════════════════════════════════════════════

  { id: "cp-n2-001", type: "mcq",
    prompt: "Rocuronium 0.6 mg/kg for a 75 kg patient. Concentration 10 mg/mL. How many mL?",
    setup: "Show all work using dimensional analysis.",
    ans: [
      { t: "4.5 mL — 0.6 × 75 = 45 mg; 45 mg ÷ 10 mg/mL = 4.5 mL",  ok: true  },
      { t: "7.5 mL — incorrectly used 0.6 × 75 ÷ 6 instead of ÷ 10 mg/mL", ok: false },
      { t: "0.45 mL — forgot to multiply dose by weight (used 0.6 mg alone)", ok: false },
      { t: "45 mL — forgot to divide by concentration (reported mg as mL)", ok: false },
    ],
    rationale: "Step 1 — Dose: 0.6 mg/kg × 75 kg = 45 mg.\nStep 2 — Volume: 45 mg ÷ 10 mg/mL = 4.5 mL.\n\nUnit check: mg ÷ (mg/mL) = mL ✓\nCommon error: reporting 45 mg as 45 mL (forgetting the concentration division) → 10× overdose.",
    scene: "iv_drip_calc", sceneCfg: { label: "ROCURONIUM BOLUS", drug: "ROC 10mg/mL", concentration: "10 mg/mL", dose: "0.6 × 75 = 45 mg", rate: "45 ÷ 10 = 4.5 mL" },
    metadata: { topic: "Bolus Calculation", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-002", type: "mcq",
    prompt: "Rocuronium 1.2 mg/kg RSI dose for a 90 kg patient. Concentration 10 mg/mL. How many mL?",
    setup: "",
    ans: [
      { t: "10.8 mL — 1.2 × 90 = 108 mg; 108 ÷ 10 = 10.8 mL",  ok: true  },
      { t: "5.4 mL — used 0.6 mg/kg (standard) instead of 1.2 mg/kg RSI dose", ok: false },
      { t: "108 mL — forgot to divide by 10 mg/mL concentration",  ok: false },
      { t: "1.08 mL — divided by 100 instead of 10 mg/mL by mistake", ok: false },
    ],
    rationale: "RSI dose is DOUBLED (1.2 mg/kg vs routine 0.6 mg/kg).\nStep 1 — Dose: 1.2 mg/kg × 90 kg = 108 mg.\nStep 2 — Volume: 108 mg ÷ 10 mg/mL = 10.8 mL.\n\nClinical note: 1.2 mg/kg provides onset in ~60 sec (vs 1–2 min at 0.6), but duration extends to 60+ min.",
    scene: "iv_drip_calc", sceneCfg: { label: "ROCURONIUM RSI DOSE", drug: "ROC 10mg/mL", concentration: "10 mg/mL", dose: "1.2 × 90 = 108 mg", rate: "108 ÷ 10 = 10.8 mL" },
    metadata: { topic: "Bolus Calculation", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-003", type: "mcq",
    prompt: "Fentanyl 3 mcg/kg for a 70 kg patient. Concentration 50 mcg/mL. How many mL?",
    setup: "",
    ans: [
      { t: "4.2 mL — 3 × 70 = 210 mcg; 210 ÷ 50 = 4.2 mL",  ok: true  },
      { t: "0.42 mL — divided by 500 mcg/mL instead of 50 mcg/mL", ok: false },
      { t: "2.1 mL — used 100 mcg/mL concentration by mistake",  ok: false },
      { t: "210 mL — reported mcg as mL without dividing by concentration", ok: false },
    ],
    rationale: "Step 1 — Dose: 3 mcg/kg × 70 kg = 210 mcg.\nStep 2 — Volume: 210 mcg ÷ 50 mcg/mL = 4.2 mL.\n\nFentanyl is always 50 mcg/mL. Unit check: mcg ÷ (mcg/mL) = mL ✓",
    scene: "iv_drip_calc", sceneCfg: { label: "FENTANYL BOLUS", drug: "FENT 50mcg/mL", concentration: "50 mcg/mL", dose: "3 × 70 = 210 mcg", rate: "210 ÷ 50 = 4.2 mL" },
    metadata: { topic: "Bolus Calculation", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-004", type: "mcq",
    prompt: "Atropine 0.02 mg/kg for a 25 kg child. Vial is 0.4 mg/mL. How many mL?",
    setup: "",
    ans: [
      { t: "1.25 mL — 0.02 × 25 = 0.5 mg; 0.5 ÷ 0.4 = 1.25 mL",  ok: true  },
      { t: "0.125 mL — divided by 4 mg/mL instead of 0.4 mg/mL",  ok: false },
      { t: "12.5 mL — multiplied dose × conc instead of dividing by it",  ok: false },
      { t: "0.5 mL — used the wrong weight (used 10 kg not 25 kg)", ok: false },
    ],
    rationale: "Step 1 — Dose: 0.02 mg/kg × 25 kg = 0.5 mg.\nStep 2 — Volume: 0.5 mg ÷ 0.4 mg/mL = 1.25 mL.\n\nMinimum atropine dose is 0.1 mg (to avoid paradoxical bradycardia). At 0.5 mg this child is well above that floor.",
    scene: "iv_drip_calc", sceneCfg: { label: "ATROPINE PEDS", drug: "ATROPINE 0.4mg/mL", concentration: "0.4 mg/mL", dose: "0.02 × 25 = 0.5 mg", rate: "0.5 ÷ 0.4 = 1.25 mL" },
    metadata: { topic: "Pediatric Bolus", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-005", type: "mcq",
    prompt: "Phenylephrine 100 mcg/mL. How many mL deliver 250 mcg?",
    setup: "",
    ans: [
      { t: "2.5 mL — 250 mcg ÷ 100 mcg/mL = 2.5 mL (no weight needed)",  ok: true  },
      { t: "25 mL — divided by 10 mcg/mL instead of 100 mcg/mL in the syringe",  ok: false },
      { t: "0.25 mL — divided by 1,000 instead of 100 mcg/mL concentration",  ok: false },
      { t: "250 mL — forgot to divide entirely (reported mcg as mL directly)", ok: false },
    ],
    rationale: "No weight step — this is a flat-dose order.\n250 mcg ÷ 100 mcg/mL = 2.5 mL.\n\nPhenylephrine is commonly diluted from stock 10 mg/mL → 100 mcg/mL by adding 1 mL to 99 mL diluent. Bolus 50–100 mcg typical; 250 mcg is a larger rescue dose.",
    scene: "iv_drip_calc", sceneCfg: { label: "PHENYLEPHRINE BOLUS", drug: "PHE 100mcg/mL", concentration: "100 mcg/mL", dose: "250 mcg flat dose", rate: "250 ÷ 100 = 2.5 mL" },
    metadata: { topic: "Bolus Calculation", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  // ═════════════════════════════════════════════════════════════════
  // 3-STEP INFUSION RATE (10 different drugs)
  // ═════════════════════════════════════════════════════════════════

  { id: "cp-n2-006", type: "mcq",
    prompt: "Norepinephrine 4 mg/250 mL. Patient 80 kg. Order 0.05 mcg/kg/min. Calculate mL/hr.",
    setup: "3-step: Concentration → Dose → Rate",
    ans: [
      { t: "15.0 mL/hr — conc 16 mcg/mL; dose 4 mcg/min; rate 0.25 mL/min × 60",  ok: true  },
      { t: "0.25 mL/hr — forgot ×60 min→hr conversion at the end of the calculation",  ok: false },
      { t: "4.0 mL/hr — used 1 mcg/mL concentration instead of the correct 16 mcg/mL",  ok: false },
      { t: "240 mL/hr — multiplied ×60 twice by mistake (double time conversion error)",  ok: false },
    ],
    rationale: "Step 1 — Concentration: 4 mg = 4,000 mcg ÷ 250 mL = 16 mcg/mL.\nStep 2 — Dose: 0.05 × 80 = 4 mcg/min.\nStep 3 — Rate: 4 ÷ 16 = 0.25 mL/min × 60 = 15.0 mL/hr.\n\n16 mcg/mL is a standard norepi concentration. Memorize it — saves Step 1 on titration questions.",
    scene: "iv_drip_calc", sceneCfg: { label: "NOREPI INFUSION", drug: "NOREPI 4mg/250mL", concentration: "16 mcg/mL", dose: "0.05 × 80 = 4 mcg/min", rate: "4 ÷ 16 × 60 = 15 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-007", type: "mcq",
    prompt: "Same norepi bag (16 mcg/mL). Patient 80 kg. Increase to 0.10 mcg/kg/min. New mL/hr?",
    setup: "Skip Step 1 — bag unchanged.",
    ans: [
      { t: "30.0 mL/hr — dose doubled to 8 mcg/min; 8 ÷ 16 = 0.5 × 60 = 30 mL/hr",  ok: true  },
      { t: "15.0 mL/hr — didn't update the dose, left the original rate unchanged",  ok: false },
      { t: "60.0 mL/hr — multiplied ×60 twice by mistake in the rate conversion step",  ok: false },
      { t: "0.5 mL/hr — forgot ×60 entirely, reported mL/min instead of mL/hr value",  ok: false },
    ],
    rationale: "Step 1 — same bag, still 16 mcg/mL.\nStep 2 — 0.10 × 80 = 8 mcg/min (exactly double).\nStep 3 — 8 ÷ 16 = 0.5 × 60 = 30.0 mL/hr.\n\nSanity check: dose doubled → rate doubles. 15 × 2 = 30 ✓",
    scene: "iv_drip_calc", sceneCfg: { label: "NOREPI TITRATION", drug: "same bag", concentration: "16 mcg/mL", dose: "0.10 × 80 = 8 mcg/min", rate: "8 ÷ 16 × 60 = 30 mL/hr" },
    metadata: { topic: "Rate Titration", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-008", type: "mcq",
    prompt: "Epinephrine 1 mg/100 mL. Patient 100 kg. Order 0.04 mcg/kg/min. Calculate mL/hr.",
    setup: "",
    ans: [
      { t: "24.0 mL/hr — conc 10 mcg/mL; dose 4 mcg/min; 0.4 mL/min × 60 = 24",  ok: true  },
      { t: "0.4 mL/hr — forgot ×60 min→hr conversion at the final step of the calculation",  ok: false },
      { t: "240 mL/hr — used 1 mcg/mL instead of 10 mcg/mL (forgot mg→mcg × 1,000)",  ok: false },
      { t: "4.0 mL/hr — divided dose by concentration in mg instead of mcg units first",  ok: false },
    ],
    rationale: "Step 1 — 1 mg = 1,000 mcg. 1,000 ÷ 100 mL = 10 mcg/mL.\nStep 2 — 0.04 × 100 = 4 mcg/min.\nStep 3 — 4 ÷ 10 = 0.4 mL/min × 60 = 24.0 mL/hr.",
    scene: "iv_drip_calc", sceneCfg: { label: "EPI INFUSION", drug: "EPI 1mg/100mL", concentration: "10 mcg/mL", dose: "0.04 × 100 = 4 mcg/min", rate: "4 ÷ 10 × 60 = 24 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-009", type: "mcq",
    prompt: "Dopamine 400 mg/250 mL. Patient 50 kg. Order 5 mcg/kg/min. Calculate mL/hr.",
    setup: "",
    ans: [
      { t: "9.4 mL/hr — conc 1,600 mcg/mL; dose 250 mcg/min; 0.15625 × 60 = 9.375 → 9.4",  ok: true  },
      { t: "15.6 mL/hr — used patient weight of 100 kg instead of 50 kg in the calculation",  ok: false },
      { t: "0.16 mL/hr — forgot ×60 min→hr conversion at the final step of the calculation",  ok: false },
      { t: "93.8 mL/hr — used 160 mcg/mL instead of 1,600 mcg/mL (dropped a zero in Step 1)",  ok: false },
    ],
    rationale: "Step 1 — 400 mg × 1,000 = 400,000 mcg. 400,000 ÷ 250 = 1,600 mcg/mL.\nStep 2 — 5 × 50 = 250 mcg/min.\nStep 3 — 250 ÷ 1,600 = 0.15625 mL/min × 60 = 9.375 → round to 9.4 mL/hr.\n\nRounding rule: carry extra decimals during work. Round ONLY at the final pump setting (0.1 mL/hr).",
    scene: "iv_drip_calc", sceneCfg: { label: "DOPAMINE INFUSION", drug: "DOPA 400mg/250mL", concentration: "1,600 mcg/mL", dose: "5 × 50 = 250 mcg/min", rate: "250 ÷ 1600 × 60 = 9.4 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-010", type: "mcq",
    prompt: "Propofol 10 mg/mL. Patient 60 kg. Order 50 mcg/kg/min. Calculate mL/hr.",
    setup: "",
    ans: [
      { t: "18.0 mL/hr — conc 10,000 mcg/mL; dose 3,000 mcg/min; 0.3 × 60 = 18",  ok: true  },
      { t: "3.0 mL/hr — divided by 1,000 instead of 10,000 mcg/mL concentration",  ok: false },
      { t: "0.3 mL/hr — forgot ×60 conversion from mL/min to mL/hr at the final step",  ok: false },
      { t: "180 mL/hr — multiplied ×60 twice in the final calculation (double conversion)",  ok: false },
    ],
    rationale: "Step 1 — 10 mg/mL × 1,000 = 10,000 mcg/mL.\nStep 2 — 50 × 60 = 3,000 mcg/min.\nStep 3 — 3,000 ÷ 10,000 = 0.3 mL/min × 60 = 18.0 mL/hr.\n\nPropofol is ALWAYS 10 mg/mL = 10,000 mcg/mL. Memorize this — saves a conversion step every time.",
    scene: "iv_drip_calc", sceneCfg: { label: "PROPOFOL INFUSION", drug: "PROP 10mg/mL", concentration: "10,000 mcg/mL", dose: "50 × 60 = 3,000 mcg/min", rate: "3000 ÷ 10000 × 60 = 18 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-011", type: "mcq",
    prompt: "Propofol 10 mg/mL. Patient 60 kg. Increase to 75 mcg/kg/min. New mL/hr?",
    setup: "",
    ans: [
      { t: "27.0 mL/hr — dose 4,500 mcg/min; 4,500 ÷ 10,000 = 0.45 × 60 = 27",  ok: true  },
      { t: "18.0 mL/hr — didn't update the dose, used the previous 50 mcg/kg/min rate",  ok: false },
      { t: "4.5 mL/hr — forgot ×60 or divided by 1,000 instead of 10,000 mcg/mL",  ok: false },
      { t: "45 mL/hr — used mg/mL (10) instead of mcg/mL (10,000) for concentration",  ok: false },
    ],
    rationale: "Same concentration: 10,000 mcg/mL.\nStep 2 — 75 × 60 = 4,500 mcg/min.\nStep 3 — 4,500 ÷ 10,000 = 0.45 × 60 = 27.0 mL/hr.",
    scene: "iv_drip_calc", sceneCfg: { label: "PROPOFOL TITRATION", drug: "PROP 10mg/mL", concentration: "10,000 mcg/mL", dose: "75 × 60 = 4,500 mcg/min", rate: "4500 ÷ 10000 × 60 = 27 mL/hr" },
    metadata: { topic: "Rate Titration", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-012", type: "mcq",
    prompt: "Phenylephrine 10 mg/250 mL. Patient 100 kg. Order 0.5 mcg/kg/min. Calculate mL/hr.",
    setup: "",
    ans: [
      { t: "75.0 mL/hr — conc 40 mcg/mL; dose 50 mcg/min; 1.25 × 60 = 75",  ok: true  },
      { t: "7.5 mL/hr — used 400 mcg/mL instead of 40 mcg/mL (extra zero in Step 1)",  ok: false },
      { t: "1.25 mL/hr — forgot ×60 conversion from mL/min to mL/hr at the final step",  ok: false },
      { t: "750 mL/hr — used 4 mcg/mL instead of 40 mcg/mL (missed a zero in Step 1)",  ok: false },
    ],
    rationale: "Step 1 — 10 mg × 1,000 = 10,000 mcg. 10,000 ÷ 250 = 40 mcg/mL.\nStep 2 — 0.5 × 100 = 50 mcg/min.\nStep 3 — 50 ÷ 40 = 1.25 mL/min × 60 = 75.0 mL/hr.",
    scene: "iv_drip_calc", sceneCfg: { label: "PHENYLEPHRINE INFUSION", drug: "PHE 10mg/250mL", concentration: "40 mcg/mL", dose: "0.5 × 100 = 50 mcg/min", rate: "50 ÷ 40 × 60 = 75 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-013", type: "mcq",
    prompt: "Remifentanil 2 mg/40 mL. Patient 100 kg. Order 0.1 mcg/kg/min. Calculate mL/hr.",
    setup: "",
    ans: [
      { t: "12.0 mL/hr — conc 50 mcg/mL; dose 10 mcg/min; 0.2 × 60 = 12",  ok: true  },
      { t: "0.2 mL/hr — forgot ×60 conversion from mL/min to mL/hr in the final step",  ok: false },
      { t: "120 mL/hr — used 5 mcg/mL instead of 50 mcg/mL (forgot mg→mcg × 1,000)",  ok: false },
      { t: "6.0 mL/hr — used 100 mcg/mL instead of 50 mcg/mL for the concentration",  ok: false },
    ],
    rationale: "Step 1 — 2 mg × 1,000 = 2,000 mcg. 2,000 ÷ 40 = 50 mcg/mL.\nStep 2 — 0.1 × 100 = 10 mcg/min.\nStep 3 — 10 ÷ 50 = 0.2 mL/min × 60 = 12.0 mL/hr.",
    scene: "iv_drip_calc", sceneCfg: { label: "REMIFENTANIL INFUSION", drug: "REMI 2mg/40mL", concentration: "50 mcg/mL", dose: "0.1 × 100 = 10 mcg/min", rate: "10 ÷ 50 × 60 = 12 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-014", type: "mcq",
    prompt: "Same remifentanil bag (50 mcg/mL). Increase to 0.2 mcg/kg/min. Patient 100 kg. New mL/hr?",
    setup: "",
    ans: [
      { t: "24.0 mL/hr — dose 20 mcg/min; 20 ÷ 50 = 0.4 × 60 = 24.0 mL/hr",  ok: true  },
      { t: "12.0 mL/hr — didn't update dose from the previous 0.1 mcg/kg/min setting",  ok: false },
      { t: "0.4 mL/hr — forgot ×60 for the min→hr conversion at the end of the calculation",  ok: false },
      { t: "48.0 mL/hr — multiplied ×60 twice by mistake during the final rate conversion",  ok: false },
    ],
    rationale: "Same bag: 50 mcg/mL.\nStep 2 — 0.2 × 100 = 20 mcg/min.\nStep 3 — 20 ÷ 50 = 0.4 × 60 = 24.0 mL/hr.\n\nSanity: dose doubled (0.1→0.2), rate doubles (12→24). ✓",
    scene: "iv_drip_calc", sceneCfg: { label: "REMI TITRATION", drug: "same bag", concentration: "50 mcg/mL", dose: "0.2 × 100 = 20 mcg/min", rate: "20 ÷ 50 × 60 = 24 mL/hr" },
    metadata: { topic: "Rate Titration", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-015", type: "mcq",
    prompt: "Dexmedetomidine 200 mcg/50 mL. Patient 100 kg. Order 0.5 mcg/kg/hr. Calculate mL/hr.",
    setup: "Note: order is per HOUR — no ×60 needed.",
    ans: [
      { t: "12.5 mL/hr — conc 4 mcg/mL; dose 50 mcg/hr; 50 ÷ 4 = 12.5 mL/hr",  ok: true  },
      { t: "750 mL/hr — multiplied ×60 when the order was already per hour (not per min)",  ok: false },
      { t: "0.21 mL/hr — divided by 240 instead of 4 mcg/mL for the concentration step",  ok: false },
      { t: "1.25 mL/hr — divided by 40 mcg/mL instead of the correct 4 mcg/mL value",  ok: false },
    ],
    rationale: "Step 1 — 200 mcg ÷ 50 mL = 4 mcg/mL.\nStep 2 — 0.5 mcg/kg/hr × 100 = 50 mcg/hr.\nStep 3 — 50 ÷ 4 = 12.5 mL/hr.\n\nCRITICAL: order is per HOUR — no ×60. Common mistake: multiplying by 60 when the order doesn't need it.",
    scene: "iv_drip_calc", sceneCfg: { label: "DEX INFUSION", drug: "DEX 200mcg/50mL", concentration: "4 mcg/mL", dose: "0.5 × 100 = 50 mcg/hr", rate: "50 ÷ 4 = 12.5 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-016", type: "mcq",
    prompt: "Midazolam 50 mg/50 mL. Patient 80 kg. Order 0.05 mg/kg/hr. Calculate mL/hr.",
    setup: "Note: order is in mg, not mcg — no mg→mcg conversion needed.",
    ans: [
      { t: "4.0 mL/hr — conc 1 mg/mL; dose 4 mg/hr; 4 ÷ 1 = 4.0 mL/hr",  ok: true  },
      { t: "240 mL/hr — converted mg→mcg unnecessarily and then multiplied ×60 on top of that",  ok: false },
      { t: "0.05 mL/hr — forgot to multiply by patient weight (used 0.05 mg/hr alone)",  ok: false },
      { t: "40 mL/hr — used 0.1 mg/mL concentration instead of 1 mg/mL for the bag",  ok: false },
    ],
    rationale: "Step 1 — 50 mg ÷ 50 mL = 1 mg/mL. Order is in mg, conc is mg/mL — units match.\nStep 2 — 0.05 × 80 = 4 mg/hr.\nStep 3 — 4 ÷ 1 = 4.0 mL/hr.\n\nNo ×60 needed (order is already per hour). No mg→mcg needed (both are mg).",
    scene: "iv_drip_calc", sceneCfg: { label: "MIDAZOLAM INFUSION", drug: "MIDAZ 50mg/50mL", concentration: "1 mg/mL", dose: "0.05 × 80 = 4 mg/hr", rate: "4 ÷ 1 = 4.0 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-017", type: "mcq",
    prompt: "Cisatracurium 2 mg/mL. Patient 60 kg. Order 1 mcg/kg/min. Calculate mL/hr.",
    setup: "",
    ans: [
      { t: "1.8 mL/hr — conc 2,000 mcg/mL; dose 60 mcg/min; 0.03 × 60 = 1.8",  ok: true  },
      { t: "0.03 mL/hr — forgot ×60 conversion from mL/min to mL/hr at the final step",  ok: false },
      { t: "18 mL/hr — used 200 mcg/mL instead of 2,000 mcg/mL (forgot one zero in Step 1)",  ok: false },
      { t: "180 mL/hr — used 2 mcg/mL instead of 2,000 mcg/mL (forgot mg→mcg conversion)",  ok: false },
    ],
    rationale: "Step 1 — 2 mg/mL × 1,000 = 2,000 mcg/mL.\nStep 2 — 1 × 60 = 60 mcg/min.\nStep 3 — 60 ÷ 2,000 = 0.03 × 60 = 1.8 mL/hr.",
    scene: "iv_drip_calc", sceneCfg: { label: "CISATRACURIUM INFUSION", drug: "CIS 2mg/mL", concentration: "2,000 mcg/mL", dose: "1 × 60 = 60 mcg/min", rate: "60 ÷ 2000 × 60 = 1.8 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-018", type: "mcq",
    prompt: "Vecuronium 20 mg/20 mL. Patient 80 kg. Order 1 mcg/kg/min. Calculate mL/hr.",
    setup: "",
    ans: [
      { t: "4.8 mL/hr — conc 1,000 mcg/mL; dose 80 mcg/min; 0.08 × 60 = 4.8",  ok: true  },
      { t: "0.08 mL/hr — forgot ×60 conversion from mL/min to mL/hr at the end step",  ok: false },
      { t: "48 mL/hr — used 100 mcg/mL instead of 1,000 mcg/mL (dropped a zero conversion)",  ok: false },
      { t: "480 mL/hr — used 1 mcg/mL instead of 1,000 mcg/mL (forgot mg→mcg entirely)",  ok: false },
    ],
    rationale: "Step 1 — 20 mg ÷ 20 mL = 1 mg/mL → × 1,000 = 1,000 mcg/mL.\nStep 2 — 1 × 80 = 80 mcg/min.\nStep 3 — 80 ÷ 1,000 = 0.08 × 60 = 4.8 mL/hr.",
    scene: "iv_drip_calc", sceneCfg: { label: "VECURONIUM INFUSION", drug: "VEC 20mg/20mL", concentration: "1,000 mcg/mL", dose: "1 × 80 = 80 mcg/min", rate: "80 ÷ 1000 × 60 = 4.8 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-019", type: "mcq",
    prompt: "Phenylephrine 100 mcg/mL. Order 100 mcg/min (flat rate, no weight). Calculate mL/hr.",
    setup: "",
    ans: [
      { t: "60.0 mL/hr — 100 ÷ 100 = 1 mL/min × 60 = 60 mL/hr",  ok: true  },
      { t: "1.0 mL/hr — forgot ×60 conversion from mL/min to mL/hr at the end",  ok: false },
      { t: "100 mL/hr — used 60 mcg/mL instead of 100 mcg/mL for the syringe concentration",  ok: false },
      { t: "6.0 mL/hr — divided by 1,000 mcg/mL instead of the correct 100 mcg/mL concentration",  ok: false },
    ],
    rationale: "Step 1 — already 100 mcg/mL.\nStep 2 — 100 mcg/min (flat order, no weight).\nStep 3 — 100 ÷ 100 = 1 mL/min × 60 = 60.0 mL/hr.\n\nFast-check: 1 mL/min = 60 mL/hr. This is a high phenylephrine rate — clinical concern.",
    scene: "iv_drip_calc", sceneCfg: { label: "PHE FLAT-RATE", drug: "PHE 100mcg/mL", concentration: "100 mcg/mL", dose: "100 mcg/min flat", rate: "100 ÷ 100 × 60 = 60 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-020", type: "mcq",
    prompt: "Phenylephrine 100 mcg/mL. Order 60 mcg/min. Calculate mL/hr.",
    setup: "",
    ans: [
      { t: "36.0 mL/hr — 60 ÷ 100 = 0.6 mL/min × 60 = 36 mL/hr",  ok: true  },
      { t: "0.6 mL/hr — forgot ×60 conversion from mL/min to mL/hr at the final step",  ok: false },
      { t: "6.0 mL/hr — divided by 600 mcg/mL instead of 100 mcg/mL concentration",  ok: false },
      { t: "360 mL/hr — multiplied ×60 twice by mistake (double time conversion error)",  ok: false },
    ],
    rationale: "Step 1 — 100 mcg/mL given.\nStep 2 — 60 mcg/min.\nStep 3 — 60 ÷ 100 = 0.6 × 60 = 36.0 mL/hr.",
    scene: "iv_drip_calc", sceneCfg: { label: "PHE 60 mcg/min", drug: "PHE 100mcg/mL", concentration: "100 mcg/mL", dose: "60 mcg/min", rate: "60 ÷ 100 × 60 = 36 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-021", type: "mcq",
    prompt: "Epinephrine 1 mg/250 mL. Patient 75 kg. Order 0.03 mcg/kg/min. Calculate mL/hr.",
    setup: "",
    ans: [
      { t: "33.8 mL/hr — conc 4 mcg/mL; dose 2.25 mcg/min; 0.5625 × 60 = 33.75 → 33.8",  ok: true  },
      { t: "0.56 mL/hr — forgot ×60 min→hr conversion at the final step of the calculation",  ok: false },
      { t: "3.38 mL/hr — used 40 mcg/mL instead of 4 mcg/mL (extra zero in Step 1 concentration)",  ok: false },
      { t: "338 mL/hr — used 0.4 mcg/mL instead of 4 mcg/mL (forgot mg→mcg × 1,000 conversion)",  ok: false },
    ],
    rationale: "Step 1 — 1 mg = 1,000 mcg. 1,000 ÷ 250 = 4 mcg/mL.\nStep 2 — 0.03 × 75 = 2.25 mcg/min.\nStep 3 — 2.25 ÷ 4 = 0.5625 × 60 = 33.75 → round to 33.8 mL/hr.",
    scene: "iv_drip_calc", sceneCfg: { label: "EPI LOW-DOSE", drug: "EPI 1mg/250mL", concentration: "4 mcg/mL", dose: "0.03 × 75 = 2.25 mcg/min", rate: "2.25 ÷ 4 × 60 = 33.8 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-022", type: "mcq",
    prompt: "Fentanyl 2,500 mcg/250 mL. Patient 100 kg. Order 2 mcg/kg/hr. Calculate mL/hr.",
    setup: "Note: order is per HOUR.",
    ans: [
      { t: "20.0 mL/hr — conc 10 mcg/mL; dose 200 mcg/hr; 200 ÷ 10 = 20 mL/hr (no ×60)",  ok: true  },
      { t: "1,200 mL/hr — multiplied ×60 when the order was already per hour (not per minute)",  ok: false },
      { t: "0.33 mL/hr — divided by 600 instead of 10 mcg/mL for the fentanyl concentration",  ok: false },
      { t: "200 mL/hr — used 1 mcg/mL instead of 10 mcg/mL (dropped a zero in Step 1 math)",  ok: false },
    ],
    rationale: "Step 1 — 2,500 ÷ 250 = 10 mcg/mL.\nStep 2 — 2 × 100 = 200 mcg/hr. ORDER IS /HR → no ×60.\nStep 3 — 200 ÷ 10 = 20.0 mL/hr.\n\nCommon mistake from Exam 1 key: multiplying by 60 when the order is already per hour.",
    scene: "iv_drip_calc", sceneCfg: { label: "FENTANYL INFUSION", drug: "FENT 2500mcg/250mL", concentration: "10 mcg/mL", dose: "2 × 100 = 200 mcg/hr", rate: "200 ÷ 10 = 20 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-023", type: "mcq",
    prompt: "Lidocaine infusion 1.5 mg/kg/hr for a 90 kg patient. Calculate mg/hr.",
    setup: "Simple weight-based rate — no concentration step needed.",
    ans: [
      { t: "135 mg/hr — 1.5 × 90 = 135 mg/hr (straightforward multiplication)",  ok: true  },
      { t: "13.5 mg/hr — divided by 10 somewhere in the calculation by mistake",  ok: false },
      { t: "1,350 mg/hr — multiplied by 10 (perhaps trying ×60 when order is already /hr)",  ok: false },
      { t: "67.5 mg/hr — used 45 kg instead of 90 kg (halved the patient weight by error)",  ok: false },
    ],
    rationale: "1.5 mg/kg/hr × 90 kg = 135 mg/hr. This is a simple rate × weight problem.\n\nLidocaine infusion: antiarrhythmic or analgesic adjunct. Range typically 1–4 mg/min IV or 1–3 mg/kg/hr.",
    scene: null,
    metadata: { topic: "Simple Rate", priority: "medium", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-024", type: "mcq",
    prompt: "Dopamine at 5 mcg/kg/min for a 70 kg patient. Calculate total mcg/min.",
    setup: "",
    ans: [
      { t: "350 mcg/min — 5 × 70 = 350 mcg/min (simple weight multiplication)",  ok: true  },
      { t: "35 mcg/min — divided by 10 somewhere in the weight × dose calculation",  ok: false },
      { t: "3,500 mcg/min — multiplied by 10 (perhaps trying ×60 on the dose/min result)",  ok: false },
      { t: "500 mcg/min — used 100 kg instead of 70 kg for the patient weight value",  ok: false },
    ],
    rationale: "5 mcg/kg/min × 70 kg = 350 mcg/min. This is Step 2 only — testing whether you can extract the weight-based dose correctly before proceeding to mL/hr.",
    scene: null,
    metadata: { topic: "Dose Calculation", priority: "medium", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  // ═════════════════════════════════════════════════════════════════
  // REVERSE CALCULATIONS (pump → dose)
  // ═════════════════════════════════════════════════════════════════

  { id: "cp-n2-025", type: "mcq",
    prompt: "Propofol 10 mg/mL. Pump at 30 mL/hr. Patient 100 kg. What mcg/kg/min is being delivered?",
    setup: "Work backwards: mL/hr → mcg/hr → mcg/min → mcg/kg/min.",
    ans: [
      { t: "50 mcg/kg/min — 30 × 10,000 = 300,000 mcg/hr; ÷ 60 = 5,000; ÷ 100 = 50",  ok: true  },
      { t: "5 mcg/kg/min — forgot to convert mg/mL → mcg/mL (used 1,000 instead of 10,000)",  ok: false },
      { t: "300 mcg/kg/min — forgot to divide by 60 (reported mcg/hr not mcg/min at the end)",  ok: false },
      { t: "500 mcg/kg/min — multiplied by 10 instead of dividing by weight at the last step",  ok: false },
    ],
    rationale: "Step 1 — 10 mg/mL = 10,000 mcg/mL.\nStep 2 — 30 mL/hr × 10,000 = 300,000 mcg/hr.\nStep 3 — ÷ 60 = 5,000 mcg/min.\nStep 4 — ÷ 100 kg = 50 mcg/kg/min.\n\nReverse calcs verify what the pump is actually delivering — critical safety check.",
    scene: "iv_drip_calc", sceneCfg: { label: "PROPOFOL REVERSE", drug: "PROP 10mg/mL", concentration: "10,000 mcg/mL", dose: "30 × 10,000 ÷ 60 = 5,000 mcg/min", rate: "5,000 ÷ 100 = 50 mcg/kg/min" },
    metadata: { topic: "Reverse Calculation", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-026", type: "mcq",
    prompt: "Dopamine 400 mg/250 mL. Pump at 12.5 mL/hr. Patient 50 kg. What mcg/kg/min is delivered?",
    setup: "",
    ans: [
      { t: "6.7 mcg/kg/min — 12.5 × 1,600 = 20,000 mcg/hr; ÷ 60 = 333; ÷ 50 ≈ 6.7",  ok: true  },
      { t: "0.67 mcg/kg/min — used 160 mcg/mL instead of 1,600 mcg/mL (dropped a zero)",  ok: false },
      { t: "66.7 mcg/kg/min — forgot to divide by patient weight in the final step result",  ok: false },
      { t: "400 mcg/kg/min — divided pump rate by weight without multiplying by concentration",  ok: false },
    ],
    rationale: "Step 1 — 400 mg = 400,000 mcg ÷ 250 = 1,600 mcg/mL.\nStep 2 — 12.5 × 1,600 = 20,000 mcg/hr.\nStep 3 — ÷ 60 = 333.3 mcg/min.\nStep 4 — ÷ 50 = 6.67 → 6.7 mcg/kg/min.\n\nThis is in the β₁ range (5–10 mcg/kg/min → ↑CO, ↑HR).",
    scene: "iv_drip_calc", sceneCfg: { label: "DOPAMINE REVERSE", drug: "DOPA 400mg/250mL", concentration: "1,600 mcg/mL", dose: "12.5 × 1600 ÷ 60 = 333 mcg/min", rate: "333 ÷ 50 = 6.7 mcg/kg/min" },
    metadata: { topic: "Reverse Calculation", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-027", type: "mcq",
    prompt: "Dexmedetomidine 200 mcg/50 mL. Pump at 10 mL/hr. Patient 100 kg. What mcg/kg/hr is delivered?",
    setup: "",
    ans: [
      { t: "0.4 mcg/kg/hr — 10 × 4 = 40 mcg/hr; ÷ 100 = 0.4 mcg/kg/hr",  ok: true  },
      { t: "4.0 mcg/kg/hr — forgot to divide by patient weight at the final step",  ok: false },
      { t: "0.04 mcg/kg/hr — divided by 1,000 instead of 100 for the patient weight",  ok: false },
      { t: "24 mcg/kg/hr — multiplied ×60 when dex is already dosed per hour, not per min",  ok: false },
    ],
    rationale: "Step 1 — 200 ÷ 50 = 4 mcg/mL.\nStep 2 — 10 × 4 = 40 mcg/hr.\nStep 3 — 40 ÷ 100 = 0.4 mcg/kg/hr.\n\nThis is within the typical dex maintenance range (0.2–0.7 mcg/kg/hr).",
    scene: "iv_drip_calc", sceneCfg: { label: "DEX REVERSE", drug: "DEX 200mcg/50mL", concentration: "4 mcg/mL", dose: "10 × 4 = 40 mcg/hr", rate: "40 ÷ 100 = 0.4 mcg/kg/hr" },
    metadata: { topic: "Reverse Calculation", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  // ═════════════════════════════════════════════════════════════════
  // BOLUS + INFUSION COMBO
  // ═════════════════════════════════════════════════════════════════

  { id: "cp-n2-028", type: "mcq",
    prompt: "Esmolol 10 mg/mL. Patient 100 kg. Bolus 0.5 mg/kg, then infusion 100 mcg/kg/min. Calculate (a) bolus mL and (b) infusion mL/hr.",
    setup: "",
    ans: [
      { t: "(a) 5 mL bolus; (b) 60.0 mL/hr infusion",  ok: true  },
      { t: "(a) 50 mL bolus; (b) 60.0 mL/hr — used wrong concentration unit for the bolus", ok: false },
      { t: "(a) 5 mL bolus; (b) 1.0 mL/hr — forgot ×60 on infusion conversion at the end", ok: false },
      { t: "(a) 5 mL bolus; (b) 600 mL/hr — used mg/mL instead of mcg/mL for the infusion", ok: false },
    ],
    rationale: "BOLUS: 0.5 × 100 = 50 mg. 50 ÷ 10 = 5 mL.\nINFUSION: 10 mg/mL × 1,000 = 10,000 mcg/mL. 100 × 100 = 10,000 mcg/min. 10,000 ÷ 10,000 = 1 mL/min × 60 = 60 mL/hr.\n\nBolus stays in mg; infusion switches to mcg. Always match units to the order.",
    scene: "iv_drip_calc", sceneCfg: { label: "ESMOLOL BOLUS + INF", drug: "ESMOLOL 10mg/mL", concentration: "Bolus: mg | Inf: 10,000 mcg/mL", dose: "Bolus 50mg | Inf 10,000 mcg/min", rate: "5 mL | 60 mL/hr" },
    metadata: { topic: "Bolus + Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-029", type: "mcq",
    prompt: "Propofol 10 mg/mL. Patient 80 kg. Bolus 1 mg/kg then infusion 40 mcg/kg/min. Calculate (a) bolus mL and (b) infusion mL/hr.",
    setup: "",
    ans: [
      { t: "(a) 8 mL bolus; (b) 19.2 mL/hr infusion",  ok: true  },
      { t: "(a) 80 mL bolus; (b) 19.2 mL/hr — forgot to divide bolus by 10 mg/mL concentration",  ok: false },
      { t: "(a) 8 mL bolus; (b) 192 mL/hr — multiplied ×60 twice (double time conversion error)",  ok: false },
      { t: "(a) 8 mL bolus; (b) 0.32 mL/hr — forgot ×60 conversion from mL/min to mL/hr value",  ok: false },
    ],
    rationale: "BOLUS: 1 × 80 = 80 mg. 80 ÷ 10 = 8 mL.\nINFUSION: 10,000 mcg/mL. 40 × 80 = 3,200 mcg/min. 3,200 ÷ 10,000 = 0.32 × 60 = 19.2 mL/hr.",
    scene: "iv_drip_calc", sceneCfg: { label: "PROPOFOL BOLUS + INF", drug: "PROP 10mg/mL", concentration: "10,000 mcg/mL", dose: "Bolus 80mg | Inf 3,200 mcg/min", rate: "8 mL | 19.2 mL/hr" },
    metadata: { topic: "Bolus + Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  // ═════════════════════════════════════════════════════════════════
  // TOTAL DRUG DELIVERED
  // ═════════════════════════════════════════════════════════════════

  { id: "cp-n2-030", type: "mcq",
    prompt: "Propofol 10 mg/mL. Patient 100 kg. 60 mcg/kg/min for 30 minutes. Total mg delivered?",
    setup: "",
    ans: [
      { t: "180 mg — 6,000 mcg/min × 30 = 180,000 mcg ÷ 1,000 = 180 mg",  ok: true  },
      { t: "6 mg — confused mcg with mg without converting (off by 1,000×)",  ok: false },
      { t: "18 mg — divided by 10,000 instead of 1,000 for mcg→mg conversion",  ok: false },
      { t: "1,800 mg — multiplied by 10 instead of dividing by 1,000 for conversion",  ok: false },
    ],
    rationale: "Step 1 — 60 × 100 = 6,000 mcg/min.\nStep 2 — 6,000 × 30 min = 180,000 mcg.\nStep 3 — 180,000 ÷ 1,000 = 180 mg.\n\nTracking cumulative drug delivery is essential for documenting total anesthetic doses.",
    scene: null,
    metadata: { topic: "Total Drug Delivered", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-031", type: "mcq",
    prompt: "Propofol 10 mg/mL. Patient 100 kg. 50 mcg/kg/min for 20 min, then 25 mcg/kg/min for 40 min. Total mg?",
    setup: "Two-segment calculation.",
    ans: [
      { t: "200 mg — segment 1: 100,000 mcg + segment 2: 100,000 mcg = 200,000 mcg = 200 mg",  ok: true  },
      { t: "100 mg — only calculated one segment and forgot to add the second segment total to it",  ok: false },
      { t: "300 mg — added time (60 min) × 50 mcg/kg/min × 100 kg without reducing for segment 2",  ok: false },
      { t: "20 mg — divided by 10,000 instead of 1,000 for the final mcg→mg conversion step",  ok: false },
    ],
    rationale: "Segment 1: 50 × 100 = 5,000 mcg/min × 20 = 100,000 mcg.\nSegment 2: 25 × 100 = 2,500 mcg/min × 40 = 100,000 mcg.\nTotal: 200,000 mcg ÷ 1,000 = 200 mg.",
    scene: null,
    metadata: { topic: "Total Drug Delivered", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-032", type: "mcq",
    prompt: "Norepi 4 mg/250 mL. Patient 100 kg. 0.1 mcg/kg/min for 15 min. Total mcg delivered?",
    setup: "",
    ans: [
      { t: "150 mcg — dose 10 mcg/min × 15 min = 150 mcg total delivered",  ok: true  },
      { t: "1,500 mcg — multiplied by 150 instead of 15 minutes for the total duration",  ok: false },
      { t: "15 mcg — forgot to multiply by patient weight (used 0.1 × 15 alone = 1.5, then ×10)",  ok: false },
      { t: "0.15 mcg — divided by 1,000 and forgot to multiply by 15 minutes at the end step",  ok: false },
    ],
    rationale: "Dose: 0.1 × 100 = 10 mcg/min.\nTotal: 10 × 15 = 150 mcg.",
    scene: null,
    metadata: { topic: "Total Drug Delivered", priority: "medium", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  // ═════════════════════════════════════════════════════════════════
  // MULTI-SEGMENT INFUSION
  // ═════════════════════════════════════════════════════════════════

  { id: "cp-n2-033", type: "mcq",
    prompt: "1,000 mL NS over 12 hours. Rate doubled for the first 2 hours, then reduced for the remaining 10 hours. What is the reduced rate?",
    setup: "Total volume must equal 1,000 mL across both segments.",
    ans: [
      { t: "66.7 mL/hr — base 83.3; doubled 166.7 × 2hr = 333; remainder 667 ÷ 10 = 66.7",  ok: true  },
      { t: "83.3 mL/hr — divided 1,000 by 12 without accounting for the doubled first 2 hours",  ok: false },
      { t: "100 mL/hr — divided 1,000 by 10 and ignored the first-segment volume contribution",  ok: false },
      { t: "50 mL/hr — halved the base rate without computing first-segment volume subtraction",  ok: false },
    ],
    rationale: "Base rate: 1,000 ÷ 12 = 83.33 mL/hr.\nDoubled: 166.67 mL/hr × 2 hr = 333.3 mL.\nRemaining: 1,000 − 333.3 = 666.7 mL ÷ 10 hr = 66.7 mL/hr.\n\nKey: subtract first-segment volume from total, then divide remainder by remaining time.",
    scene: null,
    metadata: { topic: "Multi-Segment Rate", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  // ═════════════════════════════════════════════════════════════════
  // RECONSTITUTION / MIXING
  // ═════════════════════════════════════════════════════════════════

  { id: "cp-n2-034", type: "mcq",
    prompt: "Cefazolin 2 g reconstituted to 10 mL total. Concentration in mg/mL?",
    setup: "",
    ans: [
      { t: "200 mg/mL — convert 2 g to 2,000 mg; 2,000 ÷ 10 = 200 mg/mL",  ok: true  },
      { t: "2 mg/mL — forgot to convert grams to milligrams before dividing by volume",  ok: false },
      { t: "20 mg/mL — divided by 100 instead of 10 mL for the total volume in the vial",  ok: false },
      { t: "0.2 mg/mL — inverted the division (divided volume by mass instead of mass by volume)",  ok: false },
    ],
    rationale: "2 g × 1,000 = 2,000 mg. 2,000 ÷ 10 = 200 mg/mL.\n\nConversion trap: 1 g = 1,000 mg. If the question asks mg/mL, CONVERT FIRST.",
    scene: null,
    metadata: { topic: "Reconstitution", priority: "medium", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-035", type: "mcq",
    prompt: "Prepare phenylephrine 100 mcg/mL in 100 mL from stock 10 mg/mL. How many mL of stock?",
    setup: "",
    ans: [
      { t: "1 mL — need 10,000 mcg total; stock is 10,000 mcg/mL; 10,000 ÷ 10,000 = 1 mL",  ok: true  },
      { t: "10 mL — forgot to convert mg→mcg for the stock concentration (10 vs 10,000 mcg/mL)",  ok: false },
      { t: "0.1 mL — divided by 100,000 instead of 10,000 mcg/mL for the stock concentration",  ok: false },
      { t: "100 mL — used the target concentration as the volume needed (mixed up the formula)",  ok: false },
    ],
    rationale: "Target: 100 mcg/mL × 100 mL = 10,000 mcg needed.\nStock: 10 mg/mL = 10,000 mcg/mL.\nVolume: 10,000 ÷ 10,000 = 1 mL.\n\nAdd 1 mL of stock to 99 mL diluent = 100 mL at 100 mcg/mL.",
    scene: null,
    metadata: { topic: "Drug Preparation", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-036", type: "mcq",
    prompt: "Mix norepi 8 mg in 250 mL. What is the concentration in mcg/mL?",
    setup: "",
    ans: [
      { t: "32 mcg/mL — 8 mg × 1,000 = 8,000 mcg; 8,000 ÷ 250 = 32 mcg/mL",  ok: true  },
      { t: "0.032 mcg/mL — forgot mg→mcg × 1,000 conversion (divided 8 mg ÷ 250 directly)",  ok: false },
      { t: "320 mcg/mL — divided by 25 instead of 250 mL (missed a zero in the volume divisor)",  ok: false },
      { t: "3.2 mcg/mL — divided by 2,500 instead of 250 mL (added an extra zero to volume)",  ok: false },
    ],
    rationale: "8 mg × 1,000 = 8,000 mcg.\n8,000 ÷ 250 = 32 mcg/mL.\n\nThis is double the standard 4 mg/250 mL = 16 mcg/mL concentration. Some ICUs use 8 mg/250 mL for septic shock patients requiring high doses.",
    scene: null,
    metadata: { topic: "Drug Preparation", priority: "medium", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  // ═════════════════════════════════════════════════════════════════
  // HEPARIN / INSULIN (unit-based)
  // ═════════════════════════════════════════════════════════════════

  { id: "cp-n2-037", type: "mcq",
    prompt: "Heparin 25,000 units/250 mL. Order 1,400 units/hr. Calculate mL/hr.",
    setup: "",
    ans: [
      { t: "14.0 mL/hr — conc 100 units/mL; 1,400 ÷ 100 = 14.0 mL/hr",  ok: true  },
      { t: "140 mL/hr — used 10 units/mL instead of 100 units/mL (dropped a zero)",  ok: false },
      { t: "1.4 mL/hr — used 1,000 units/mL instead of 100 units/mL (added a zero)",  ok: false },
      { t: "56 mL/hr — multiplied by 4 instead of dividing by concentration for the rate",  ok: false },
    ],
    rationale: "Step 1 — 25,000 ÷ 250 = 100 units/mL.\nStep 2 — 1,400 units/hr (not weight-based).\nStep 3 — 1,400 ÷ 100 = 14.0 mL/hr.\n\nNo ×60 needed — order is already per hour. No weight involved.",
    scene: "iv_drip_calc", sceneCfg: { label: "HEPARIN DRIP", drug: "HEP 25,000u/250mL", concentration: "100 units/mL", dose: "1,400 units/hr", rate: "1400 ÷ 100 = 14 mL/hr" },
    metadata: { topic: "Unit-Based Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-038", type: "mcq",
    prompt: "Insulin 100 units/100 mL NS. Run 4 units/hr for 3 hours. (a) mL infused? (b) units delivered?",
    setup: "",
    ans: [
      { t: "(a) 12 mL infused; (b) 12 units delivered — 1 unit/mL × 4 u/hr × 3 hr",  ok: true  },
      { t: "(a) 4 mL; (b) 4 units — forgot to multiply by 3 hours for the total infusion time",  ok: false },
      { t: "(a) 12 mL; (b) 100 units — used the total bag contents instead of the infused amount",  ok: false },
      { t: "(a) 1.2 mL; (b) 1.2 units — divided by 10 instead of using 1 unit/mL concentration",  ok: false },
    ],
    rationale: "Conc: 100 ÷ 100 = 1 unit/mL.\nTotal: 4 u/hr × 3 hr = 12 units.\nVolume: 12 ÷ 1 = 12 mL.\n\n100 units in 100 mL = 1 unit/mL by design — so mL infused = units delivered.",
    scene: null,
    metadata: { topic: "Unit-Based Infusion", priority: "medium", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  // ═════════════════════════════════════════════════════════════════
  // SIMPLE IV RATE + UNIT CONVERSIONS
  // ═════════════════════════════════════════════════════════════════

  { id: "cp-n2-039", type: "mcq",
    prompt: "1,000 mL IV fluid over 8 hours. Pump rate in mL/hr?",
    setup: "",
    ans: [
      { t: "125 mL/hr — 1,000 ÷ 8 = 125 mL/hr (simple division, no other steps)",  ok: true  },
      { t: "83.3 mL/hr — divided by 12 hours instead of the ordered 8 hours duration",  ok: false },
      { t: "250 mL/hr — divided by 4 hours instead of 8 hours (halved the infusion time)",  ok: false },
      { t: "8 mL/hr — inverted division (divided hours by volume instead of volume by hours)",  ok: false },
    ],
    rationale: "1,000 ÷ 8 = 125 mL/hr. Simplest calculation type — no weight, no concentration, no unit conversion.",
    scene: null,
    metadata: { topic: "Simple IV Rate", priority: "medium", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-040", type: "mcq",
    prompt: "The essential unit conversion for all anesthesia drug math is:",
    setup: "",
    ans: [
      { t: "1 mg = 1,000 mcg — the mg-to-mcg bridge used in virtually every infusion calculation",  ok: true  },
      { t: "1 g = 100 mg — incorrect; the actual correct conversion is 1 g = 1,000 mg for metric",  ok: false },
      { t: "1 L = 100 mL — incorrect; the correct metric conversion is 1 L = 1,000 mL standard",  ok: false },
      { t: "1 mcg = 1,000 ng — true statement, but rarely used in clinical anesthesia drug math",  ok: false },
    ],
    rationale: "NAS 510 answer key opens with: 'Conversions you must know: 1 mg = 1,000 mcg. 60 minutes = 1 hour.' Confusing mg and mcg → 1,000-fold dosing error, the most dangerous arithmetic mistake in anesthesia.",
    scene: null,
    metadata: { topic: "Unit Conversions", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

];

export const CP_NODE2_METADATA = {
  nodeId:   "cp-node-2",
  courseId: "chem-phys-anesthesia",
  chapter:  "Measurement, Math & Chemistry",
  title:    "Medical Math & Drip Calculations",
  totalQuestions: CP_NODE2_QUESTIONS.length,
  questionTypes: {
    mcq:   CP_NODE2_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: CP_NODE2_QUESTIONS.filter(q => q.type === 'multi').length,
    short: CP_NODE2_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
