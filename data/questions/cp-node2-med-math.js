/**
 * Chemistry & Physics for Anesthesia — Node 2
 * Measurement, Math & Chemistry — THE MATH/DRIP NODE
 *
 * ADAPTIVE / UNTIMED — this entire node skips the 60-sec timer.
 * Answer choices are SHORT: number + unit only (e.g. "4.5 mL", "15.0 mL/hr").
 * The expanded stepwise rationale lives in the rationale field.
 *
 * Source: NAS 510 Medical Math Homework + Exam 1 Answer Key (63 worked)
 */

export const CP_NODE2_QUESTIONS = [

  // ═══════════════════════════════════════════════════════════════
  // BOLUS DOSE → VOLUME
  // ═══════════════════════════════════════════════════════════════

  { id: "cp-n2-001", type: "mcq",
    prompt: "Rocuronium 0.6 mg/kg for a 75 kg patient. Concentration 10 mg/mL. How many mL?",
    setup: "", ans: [
      { t: "4.5 mL",   ok: true  },
      { t: "7.5 mL",   ok: false },
      { t: "0.45 mL",  ok: false },
      { t: "45 mL",    ok: false },
    ],
    rationale: "Dose: 0.6 mg/kg × 75 kg = 45 mg.\nVolume: 45 mg ÷ 10 mg/mL = 4.5 mL.\n\n7.5 mL = used ÷6 instead of ÷10. 0.45 mL = forgot ×75. 45 mL = reported mg as mL.",
    scene: "iv_drip_calc", sceneCfg: { label: "ROCURONIUM BOLUS", drug: "ROC 10mg/mL", concentration: "10 mg/mL", dose: "0.6 × 75 = 45 mg", rate: "45 ÷ 10 = 4.5 mL" },
    metadata: { topic: "Bolus Calculation", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-002", type: "mcq",
    prompt: "Rocuronium 1.2 mg/kg RSI dose for a 90 kg patient. Concentration 10 mg/mL. How many mL?",
    setup: "", ans: [
      { t: "10.8 mL",  ok: true  },
      { t: "5.4 mL",   ok: false },
      { t: "108 mL",   ok: false },
      { t: "1.08 mL",  ok: false },
    ],
    rationale: "RSI dose doubled: 1.2 × 90 = 108 mg. 108 ÷ 10 = 10.8 mL.\n\n5.4 = used 0.6 mg/kg. 108 = forgot ÷10. 1.08 = divided by 100.",
    scene: "iv_drip_calc", sceneCfg: { label: "ROCURONIUM RSI", drug: "ROC 10mg/mL", concentration: "10 mg/mL", dose: "1.2 × 90 = 108 mg", rate: "108 ÷ 10 = 10.8 mL" },
    metadata: { topic: "Bolus Calculation", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-003", type: "mcq",
    prompt: "Fentanyl 3 mcg/kg for a 70 kg patient. Concentration 50 mcg/mL. How many mL?",
    setup: "", ans: [
      { t: "4.2 mL",   ok: true  },
      { t: "0.42 mL",  ok: false },
      { t: "2.1 mL",   ok: false },
      { t: "210 mL",   ok: false },
    ],
    rationale: "Dose: 3 × 70 = 210 mcg. Volume: 210 ÷ 50 = 4.2 mL.\n\n0.42 = ÷500. 2.1 = ÷100. 210 = forgot ÷ conc.",
    scene: "iv_drip_calc", sceneCfg: { label: "FENTANYL BOLUS", drug: "FENT 50mcg/mL", concentration: "50 mcg/mL", dose: "3 × 70 = 210 mcg", rate: "210 ÷ 50 = 4.2 mL" },
    metadata: { topic: "Bolus Calculation", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-004", type: "mcq",
    prompt: "Atropine 0.02 mg/kg for a 25 kg child. Vial 0.4 mg/mL. How many mL?",
    setup: "", ans: [
      { t: "1.25 mL",  ok: true  },
      { t: "0.125 mL", ok: false },
      { t: "12.5 mL",  ok: false },
      { t: "0.5 mL",   ok: false },
    ],
    rationale: "Dose: 0.02 × 25 = 0.5 mg. Volume: 0.5 ÷ 0.4 = 1.25 mL.\n\n0.125 = ÷4 instead of ÷0.4. 12.5 = ×conc instead of ÷. 0.5 = wrong weight.",
    scene: "iv_drip_calc", sceneCfg: { label: "ATROPINE PEDS", drug: "ATROPINE 0.4mg/mL", concentration: "0.4 mg/mL", dose: "0.02 × 25 = 0.5 mg", rate: "0.5 ÷ 0.4 = 1.25 mL" },
    metadata: { topic: "Pediatric Bolus", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-005", type: "mcq",
    prompt: "Phenylephrine 100 mcg/mL. How many mL deliver 250 mcg?",
    setup: "", ans: [
      { t: "2.5 mL",   ok: true  },
      { t: "25 mL",    ok: false },
      { t: "0.25 mL",  ok: false },
      { t: "250 mL",   ok: false },
    ],
    rationale: "250 mcg ÷ 100 mcg/mL = 2.5 mL. No weight step — flat dose.\n\n25 = ÷10. 0.25 = ÷1,000. 250 = forgot ÷ conc.",
    scene: "iv_drip_calc", sceneCfg: { label: "PHE BOLUS", drug: "PHE 100mcg/mL", concentration: "100 mcg/mL", dose: "250 mcg", rate: "250 ÷ 100 = 2.5 mL" },
    metadata: { topic: "Bolus Calculation", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  // ═══════════════════════════════════════════════════════════════
  // 3-STEP INFUSION RATE
  // ═══════════════════════════════════════════════════════════════

  { id: "cp-n2-006", type: "mcq",
    prompt: "Norepinephrine 4 mg/250 mL. Patient 80 kg. Order 0.05 mcg/kg/min. Calculate mL/hr.",
    setup: "3-step: Concentration → Dose → Rate", ans: [
      { t: "15.0 mL/hr",  ok: true  },
      { t: "0.25 mL/hr",  ok: false },
      { t: "4.0 mL/hr",   ok: false },
      { t: "240 mL/hr",   ok: false },
    ],
    rationale: "Step 1: 4 mg = 4,000 mcg ÷ 250 = 16 mcg/mL.\nStep 2: 0.05 × 80 = 4 mcg/min.\nStep 3: 4 ÷ 16 = 0.25 mL/min × 60 = 15.0 mL/hr.\n\n0.25 = forgot ×60. 4.0 = used 1 mcg/mL. 240 = ×60 twice.",
    scene: "iv_drip_calc", sceneCfg: { label: "NOREPI INFUSION", drug: "NOREPI 4mg/250mL", concentration: "16 mcg/mL", dose: "0.05 × 80 = 4 mcg/min", rate: "4 ÷ 16 × 60 = 15 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-007", type: "mcq",
    prompt: "Same norepi bag (16 mcg/mL). Patient 80 kg. Increase to 0.10 mcg/kg/min. New mL/hr?",
    setup: "Skip Step 1 — bag unchanged.", ans: [
      { t: "30.0 mL/hr",  ok: true  },
      { t: "15.0 mL/hr",  ok: false },
      { t: "60.0 mL/hr",  ok: false },
      { t: "0.5 mL/hr",   ok: false },
    ],
    rationale: "Same conc 16 mcg/mL. Dose: 0.10 × 80 = 8 mcg/min. Rate: 8 ÷ 16 = 0.5 × 60 = 30.0.\n\nSanity: dose doubled → rate doubles (15→30). 15 = didn't update. 60 = ×60 twice. 0.5 = forgot ×60.",
    scene: "iv_drip_calc", sceneCfg: { label: "NOREPI TITRATION", drug: "same bag", concentration: "16 mcg/mL", dose: "0.10 × 80 = 8 mcg/min", rate: "8 ÷ 16 × 60 = 30 mL/hr" },
    metadata: { topic: "Rate Titration", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-008", type: "mcq",
    prompt: "Epinephrine 1 mg/100 mL. Patient 100 kg. Order 0.04 mcg/kg/min. Calculate mL/hr.",
    setup: "", ans: [
      { t: "24.0 mL/hr",  ok: true  },
      { t: "0.4 mL/hr",   ok: false },
      { t: "240 mL/hr",   ok: false },
      { t: "4.0 mL/hr",   ok: false },
    ],
    rationale: "Step 1: 1,000 mcg ÷ 100 = 10 mcg/mL. Step 2: 0.04 × 100 = 4 mcg/min. Step 3: 4 ÷ 10 = 0.4 × 60 = 24.0.\n\n0.4 = forgot ×60. 240 = used 1 mcg/mL. 4.0 = divided in mg not mcg.",
    scene: "iv_drip_calc", sceneCfg: { label: "EPI INFUSION", drug: "EPI 1mg/100mL", concentration: "10 mcg/mL", dose: "0.04 × 100 = 4 mcg/min", rate: "4 ÷ 10 × 60 = 24 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-009", type: "mcq",
    prompt: "Dopamine 400 mg/250 mL. Patient 50 kg. Order 5 mcg/kg/min. Calculate mL/hr.",
    setup: "", ans: [
      { t: "9.4 mL/hr",   ok: true  },
      { t: "15.6 mL/hr",  ok: false },
      { t: "0.16 mL/hr",  ok: false },
      { t: "93.8 mL/hr",  ok: false },
    ],
    rationale: "Step 1: 400,000 mcg ÷ 250 = 1,600 mcg/mL. Step 2: 5 × 50 = 250 mcg/min. Step 3: 250 ÷ 1,600 = 0.15625 × 60 = 9.375 → 9.4.\n\n15.6 = used 100 kg. 0.16 = forgot ×60. 93.8 = used 160 mcg/mL.",
    scene: "iv_drip_calc", sceneCfg: { label: "DOPAMINE INFUSION", drug: "DOPA 400mg/250mL", concentration: "1,600 mcg/mL", dose: "5 × 50 = 250 mcg/min", rate: "250 ÷ 1600 × 60 = 9.4 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-010", type: "mcq",
    prompt: "Propofol 10 mg/mL. Patient 60 kg. Order 50 mcg/kg/min. Calculate mL/hr.",
    setup: "", ans: [
      { t: "18.0 mL/hr",  ok: true  },
      { t: "3.0 mL/hr",   ok: false },
      { t: "0.3 mL/hr",   ok: false },
      { t: "180 mL/hr",   ok: false },
    ],
    rationale: "Step 1: 10 mg/mL × 1,000 = 10,000 mcg/mL. Step 2: 50 × 60 = 3,000 mcg/min. Step 3: 3,000 ÷ 10,000 = 0.3 × 60 = 18.0.\n\n3.0 = ÷1,000 not ÷10,000. 0.3 = forgot ×60. 180 = ×60 twice.",
    scene: "iv_drip_calc", sceneCfg: { label: "PROPOFOL INFUSION", drug: "PROP 10mg/mL", concentration: "10,000 mcg/mL", dose: "50 × 60 = 3,000 mcg/min", rate: "3000 ÷ 10000 × 60 = 18 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-011", type: "mcq",
    prompt: "Propofol 10 mg/mL. Patient 60 kg. Increase to 75 mcg/kg/min. New mL/hr?",
    setup: "", ans: [
      { t: "27.0 mL/hr",  ok: true  },
      { t: "18.0 mL/hr",  ok: false },
      { t: "4.5 mL/hr",   ok: false },
      { t: "45 mL/hr",    ok: false },
    ],
    rationale: "Same conc 10,000 mcg/mL. Dose: 75 × 60 = 4,500 mcg/min. Rate: 4,500 ÷ 10,000 = 0.45 × 60 = 27.0.\n\n18 = old dose. 4.5 = forgot ×60. 45 = used mg/mL.",
    scene: "iv_drip_calc", sceneCfg: { label: "PROPOFOL TITRATION", drug: "PROP 10mg/mL", concentration: "10,000 mcg/mL", dose: "75 × 60 = 4,500 mcg/min", rate: "4500 ÷ 10000 × 60 = 27 mL/hr" },
    metadata: { topic: "Rate Titration", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-012", type: "mcq",
    prompt: "Phenylephrine 10 mg/250 mL. Patient 100 kg. Order 0.5 mcg/kg/min. Calculate mL/hr.",
    setup: "", ans: [
      { t: "75.0 mL/hr",  ok: true  },
      { t: "7.5 mL/hr",   ok: false },
      { t: "1.25 mL/hr",  ok: false },
      { t: "750 mL/hr",   ok: false },
    ],
    rationale: "Step 1: 10,000 mcg ÷ 250 = 40 mcg/mL. Step 2: 0.5 × 100 = 50 mcg/min. Step 3: 50 ÷ 40 = 1.25 × 60 = 75.0.\n\n7.5 = used 400 mcg/mL. 1.25 = forgot ×60. 750 = used 4 mcg/mL.",
    scene: "iv_drip_calc", sceneCfg: { label: "PHE INFUSION", drug: "PHE 10mg/250mL", concentration: "40 mcg/mL", dose: "0.5 × 100 = 50 mcg/min", rate: "50 ÷ 40 × 60 = 75 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-013", type: "mcq",
    prompt: "Remifentanil 2 mg/40 mL. Patient 100 kg. Order 0.1 mcg/kg/min. Calculate mL/hr.",
    setup: "", ans: [
      { t: "12.0 mL/hr",  ok: true  },
      { t: "0.2 mL/hr",   ok: false },
      { t: "120 mL/hr",   ok: false },
      { t: "6.0 mL/hr",   ok: false },
    ],
    rationale: "Step 1: 2,000 mcg ÷ 40 = 50 mcg/mL. Step 2: 0.1 × 100 = 10 mcg/min. Step 3: 10 ÷ 50 = 0.2 × 60 = 12.0.\n\n0.2 = forgot ×60. 120 = used 5 mcg/mL. 6.0 = used 100 mcg/mL.",
    scene: "iv_drip_calc", sceneCfg: { label: "REMI INFUSION", drug: "REMI 2mg/40mL", concentration: "50 mcg/mL", dose: "0.1 × 100 = 10 mcg/min", rate: "10 ÷ 50 × 60 = 12 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-014", type: "mcq",
    prompt: "Same remi bag (50 mcg/mL). Patient 100 kg. Increase to 0.2 mcg/kg/min. New mL/hr?",
    setup: "", ans: [
      { t: "24.0 mL/hr",  ok: true  },
      { t: "12.0 mL/hr",  ok: false },
      { t: "0.4 mL/hr",   ok: false },
      { t: "48.0 mL/hr",  ok: false },
    ],
    rationale: "Dose: 0.2 × 100 = 20 mcg/min. Rate: 20 ÷ 50 = 0.4 × 60 = 24.0.\n\nDose doubled → rate doubles (12→24). 12 = old rate. 0.4 = forgot ×60. 48 = ×60 twice.",
    scene: "iv_drip_calc", sceneCfg: { label: "REMI TITRATION", drug: "same bag", concentration: "50 mcg/mL", dose: "0.2 × 100 = 20 mcg/min", rate: "20 ÷ 50 × 60 = 24 mL/hr" },
    metadata: { topic: "Rate Titration", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-015", type: "mcq",
    prompt: "Dexmedetomidine 200 mcg/50 mL. Patient 100 kg. Order 0.5 mcg/kg/hr. Calculate mL/hr.",
    setup: "Note: order is per HOUR — no ×60 needed.", ans: [
      { t: "12.5 mL/hr",  ok: true  },
      { t: "750 mL/hr",   ok: false },
      { t: "0.21 mL/hr",  ok: false },
      { t: "1.25 mL/hr",  ok: false },
    ],
    rationale: "Step 1: 200 ÷ 50 = 4 mcg/mL. Step 2: 0.5 × 100 = 50 mcg/hr. Step 3: 50 ÷ 4 = 12.5.\n\nNo ×60 — order is already /hr. 750 = ×60 when not needed. 1.25 = ÷40.",
    scene: "iv_drip_calc", sceneCfg: { label: "DEX INFUSION", drug: "DEX 200mcg/50mL", concentration: "4 mcg/mL", dose: "0.5 × 100 = 50 mcg/hr", rate: "50 ÷ 4 = 12.5 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-016", type: "mcq",
    prompt: "Midazolam 50 mg/50 mL. Patient 80 kg. Order 0.05 mg/kg/hr. Calculate mL/hr.",
    setup: "Order is in mg, not mcg.", ans: [
      { t: "4.0 mL/hr",   ok: true  },
      { t: "240 mL/hr",   ok: false },
      { t: "0.05 mL/hr",  ok: false },
      { t: "40 mL/hr",    ok: false },
    ],
    rationale: "Step 1: 50 ÷ 50 = 1 mg/mL. Step 2: 0.05 × 80 = 4 mg/hr. Step 3: 4 ÷ 1 = 4.0.\n\nNo ×60, no mg→mcg. 240 = converted + ×60. 0.05 = forgot ×weight. 40 = ÷0.1.",
    scene: "iv_drip_calc", sceneCfg: { label: "MIDAZOLAM INFUSION", drug: "MIDAZ 50mg/50mL", concentration: "1 mg/mL", dose: "0.05 × 80 = 4 mg/hr", rate: "4 ÷ 1 = 4 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-017", type: "mcq",
    prompt: "Cisatracurium 2 mg/mL. Patient 60 kg. Order 1 mcg/kg/min. Calculate mL/hr.",
    setup: "", ans: [
      { t: "1.8 mL/hr",   ok: true  },
      { t: "0.03 mL/hr",  ok: false },
      { t: "18 mL/hr",    ok: false },
      { t: "180 mL/hr",   ok: false },
    ],
    rationale: "Step 1: 2 mg/mL × 1,000 = 2,000 mcg/mL. Step 2: 1 × 60 = 60 mcg/min. Step 3: 60 ÷ 2,000 = 0.03 × 60 = 1.8.\n\n0.03 = forgot ×60. 18 = used 200 mcg/mL. 180 = used 2 mcg/mL.",
    scene: "iv_drip_calc", sceneCfg: { label: "CIS INFUSION", drug: "CIS 2mg/mL", concentration: "2,000 mcg/mL", dose: "1 × 60 = 60 mcg/min", rate: "60 ÷ 2000 × 60 = 1.8 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-018", type: "mcq",
    prompt: "Vecuronium 20 mg/20 mL. Patient 80 kg. Order 1 mcg/kg/min. Calculate mL/hr.",
    setup: "", ans: [
      { t: "4.8 mL/hr",   ok: true  },
      { t: "0.08 mL/hr",  ok: false },
      { t: "48 mL/hr",    ok: false },
      { t: "480 mL/hr",   ok: false },
    ],
    rationale: "Step 1: 20 ÷ 20 = 1 mg/mL = 1,000 mcg/mL. Step 2: 1 × 80 = 80 mcg/min. Step 3: 80 ÷ 1,000 = 0.08 × 60 = 4.8.\n\n0.08 = forgot ×60. 48 = used 100 mcg/mL. 480 = used 1 mcg/mL.",
    scene: "iv_drip_calc", sceneCfg: { label: "VEC INFUSION", drug: "VEC 20mg/20mL", concentration: "1,000 mcg/mL", dose: "1 × 80 = 80 mcg/min", rate: "80 ÷ 1000 × 60 = 4.8 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-019", type: "mcq",
    prompt: "Phenylephrine 100 mcg/mL. Order 100 mcg/min (flat rate). Calculate mL/hr.",
    setup: "", ans: [
      { t: "60.0 mL/hr",  ok: true  },
      { t: "1.0 mL/hr",   ok: false },
      { t: "100 mL/hr",   ok: false },
      { t: "6.0 mL/hr",   ok: false },
    ],
    rationale: "100 ÷ 100 = 1 mL/min × 60 = 60.0 mL/hr.\n\n1.0 = forgot ×60. 100 = used 60 mcg/mL. 6.0 = ÷1,000.",
    scene: "iv_drip_calc", sceneCfg: { label: "PHE FLAT-RATE", drug: "PHE 100mcg/mL", concentration: "100 mcg/mL", dose: "100 mcg/min", rate: "100 ÷ 100 × 60 = 60 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-020", type: "mcq",
    prompt: "Phenylephrine 100 mcg/mL. Order 60 mcg/min. Calculate mL/hr.",
    setup: "", ans: [
      { t: "36.0 mL/hr",  ok: true  },
      { t: "0.6 mL/hr",   ok: false },
      { t: "6.0 mL/hr",   ok: false },
      { t: "360 mL/hr",   ok: false },
    ],
    rationale: "60 ÷ 100 = 0.6 mL/min × 60 = 36.0.\n\n0.6 = forgot ×60. 6.0 = ÷600. 360 = ×60 twice.",
    scene: "iv_drip_calc", sceneCfg: { label: "PHE 60 mcg/min", drug: "PHE 100mcg/mL", concentration: "100 mcg/mL", dose: "60 mcg/min", rate: "60 ÷ 100 × 60 = 36 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-021", type: "mcq",
    prompt: "Epinephrine 1 mg/250 mL. Patient 75 kg. Order 0.03 mcg/kg/min. Calculate mL/hr.",
    setup: "", ans: [
      { t: "33.8 mL/hr",  ok: true  },
      { t: "0.56 mL/hr",  ok: false },
      { t: "3.38 mL/hr",  ok: false },
      { t: "338 mL/hr",   ok: false },
    ],
    rationale: "Step 1: 1,000 ÷ 250 = 4 mcg/mL. Step 2: 0.03 × 75 = 2.25 mcg/min. Step 3: 2.25 ÷ 4 = 0.5625 × 60 = 33.75 → 33.8.\n\n0.56 = forgot ×60. 3.38 = used 40 mcg/mL. 338 = used 0.4 mcg/mL.",
    scene: "iv_drip_calc", sceneCfg: { label: "EPI LOW-DOSE", drug: "EPI 1mg/250mL", concentration: "4 mcg/mL", dose: "0.03 × 75 = 2.25 mcg/min", rate: "2.25 ÷ 4 × 60 = 33.8 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-022", type: "mcq",
    prompt: "Fentanyl 2,500 mcg/250 mL. Patient 100 kg. Order 2 mcg/kg/hr. Calculate mL/hr.",
    setup: "Order is per HOUR.", ans: [
      { t: "20.0 mL/hr",  ok: true  },
      { t: "1,200 mL/hr", ok: false },
      { t: "0.33 mL/hr",  ok: false },
      { t: "200 mL/hr",   ok: false },
    ],
    rationale: "Step 1: 2,500 ÷ 250 = 10 mcg/mL. Step 2: 2 × 100 = 200 mcg/hr (already /hr!). Step 3: 200 ÷ 10 = 20.0.\n\n1,200 = ×60 when not needed. 200 = used 1 mcg/mL.",
    scene: "iv_drip_calc", sceneCfg: { label: "FENTANYL INFUSION", drug: "FENT 2500mcg/250mL", concentration: "10 mcg/mL", dose: "2 × 100 = 200 mcg/hr", rate: "200 ÷ 10 = 20 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-023", type: "mcq",
    prompt: "Lidocaine infusion 1.5 mg/kg/hr for a 90 kg patient. Calculate mg/hr.",
    setup: "", ans: [
      { t: "135 mg/hr",   ok: true  },
      { t: "13.5 mg/hr",  ok: false },
      { t: "1,350 mg/hr", ok: false },
      { t: "67.5 mg/hr",  ok: false },
    ],
    rationale: "1.5 × 90 = 135 mg/hr. Simple rate × weight.\n\n13.5 = ÷10. 1,350 = ×10. 67.5 = used 45 kg.",
    scene: null,
    metadata: { topic: "Simple Rate", priority: "medium", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-024", type: "mcq",
    prompt: "Dopamine at 5 mcg/kg/min for a 70 kg patient. Total mcg/min?",
    setup: "", ans: [
      { t: "350 mcg/min",   ok: true  },
      { t: "35 mcg/min",    ok: false },
      { t: "3,500 mcg/min", ok: false },
      { t: "500 mcg/min",   ok: false },
    ],
    rationale: "5 × 70 = 350 mcg/min.\n\n35 = ÷10. 3,500 = ×10. 500 = used 100 kg.",
    scene: null,
    metadata: { topic: "Dose Calculation", priority: "medium", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  // ═══════════════════════════════════════════════════════════════
  // REVERSE CALCULATIONS (pump → dose)
  // ═══════════════════════════════════════════════════════════════

  { id: "cp-n2-025", type: "mcq",
    prompt: "Propofol 10 mg/mL. Pump at 30 mL/hr. Patient 100 kg. What mcg/kg/min is being delivered?",
    setup: "", ans: [
      { t: "50 mcg/kg/min",    ok: true  },
      { t: "5 mcg/kg/min",     ok: false },
      { t: "300 mcg/kg/min",   ok: false },
      { t: "3,000 mcg/kg/min", ok: false },
    ],
    rationale: "30 × 10,000 mcg/mL = 300,000 mcg/hr ÷ 60 = 5,000 mcg/min ÷ 100 kg = 50.\n\n5 = used 1,000 not 10,000. 300 = forgot ÷60. 3,000 = forgot ÷weight.",
    scene: "iv_drip_calc", sceneCfg: { label: "PROPOFOL REVERSE", drug: "PROP 10mg/mL", concentration: "10,000 mcg/mL", dose: "30 × 10,000 ÷ 60 = 5,000 mcg/min", rate: "5,000 ÷ 100 = 50 mcg/kg/min" },
    metadata: { topic: "Reverse Calculation", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-026", type: "mcq",
    prompt: "Dopamine 400 mg/250 mL. Pump at 12.5 mL/hr. Patient 50 kg. What mcg/kg/min?",
    setup: "", ans: [
      { t: "6.7 mcg/kg/min",   ok: true  },
      { t: "0.67 mcg/kg/min",  ok: false },
      { t: "66.7 mcg/kg/min",  ok: false },
      { t: "400 mcg/kg/min",   ok: false },
    ],
    rationale: "Conc: 1,600 mcg/mL. 12.5 × 1,600 = 20,000 mcg/hr ÷ 60 = 333.3 mcg/min ÷ 50 = 6.67 → 6.7.\n\n0.67 = used 160. 66.7 = forgot ÷weight. 400 = ÷rate by weight only.",
    scene: "iv_drip_calc", sceneCfg: { label: "DOPAMINE REVERSE", drug: "DOPA 400mg/250mL", concentration: "1,600 mcg/mL", dose: "12.5 × 1600 ÷ 60 = 333 mcg/min", rate: "333 ÷ 50 = 6.7 mcg/kg/min" },
    metadata: { topic: "Reverse Calculation", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-027", type: "mcq",
    prompt: "Dexmedetomidine 200 mcg/50 mL. Pump at 10 mL/hr. Patient 100 kg. What mcg/kg/hr?",
    setup: "", ans: [
      { t: "0.4 mcg/kg/hr",   ok: true  },
      { t: "4.0 mcg/kg/hr",   ok: false },
      { t: "0.04 mcg/kg/hr",  ok: false },
      { t: "24 mcg/kg/hr",    ok: false },
    ],
    rationale: "Conc: 4 mcg/mL. 10 × 4 = 40 mcg/hr ÷ 100 = 0.4 mcg/kg/hr.\n\n4.0 = forgot ÷weight. 0.04 = ÷1,000. 24 = ×60 when already /hr.",
    scene: "iv_drip_calc", sceneCfg: { label: "DEX REVERSE", drug: "DEX 200mcg/50mL", concentration: "4 mcg/mL", dose: "10 × 4 = 40 mcg/hr", rate: "40 ÷ 100 = 0.4 mcg/kg/hr" },
    metadata: { topic: "Reverse Calculation", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  // ═══════════════════════════════════════════════════════════════
  // BOLUS + INFUSION COMBO
  // ═══════════════════════════════════════════════════════════════

  { id: "cp-n2-028", type: "mcq",
    prompt: "Esmolol 10 mg/mL. Patient 100 kg. Bolus 0.5 mg/kg then infusion 100 mcg/kg/min. Bolus mL and infusion mL/hr?",
    setup: "", ans: [
      { t: "5 mL bolus; 60.0 mL/hr",   ok: true  },
      { t: "50 mL bolus; 60.0 mL/hr",  ok: false },
      { t: "5 mL bolus; 1.0 mL/hr",    ok: false },
      { t: "5 mL bolus; 600 mL/hr",    ok: false },
    ],
    rationale: "Bolus: 0.5 × 100 = 50 mg ÷ 10 = 5 mL.\nInfusion: 10,000 mcg/mL. 100 × 100 = 10,000 mcg/min. 10,000 ÷ 10,000 = 1 × 60 = 60.\n\n50 mL = forgot ÷conc. 1.0 = forgot ×60. 600 = used mg/mL.",
    scene: "iv_drip_calc", sceneCfg: { label: "ESMOLOL BOLUS+INF", drug: "ESMOLOL 10mg/mL", concentration: "10,000 mcg/mL", dose: "Bolus 50mg | Inf 10,000 mcg/min", rate: "5 mL | 60 mL/hr" },
    metadata: { topic: "Bolus + Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-029", type: "mcq",
    prompt: "Propofol 10 mg/mL. Patient 80 kg. Bolus 1 mg/kg then infusion 40 mcg/kg/min. Bolus mL and infusion mL/hr?",
    setup: "", ans: [
      { t: "8 mL bolus; 19.2 mL/hr",   ok: true  },
      { t: "80 mL bolus; 19.2 mL/hr",  ok: false },
      { t: "8 mL bolus; 192 mL/hr",    ok: false },
      { t: "8 mL bolus; 0.32 mL/hr",   ok: false },
    ],
    rationale: "Bolus: 80 mg ÷ 10 = 8 mL.\nInfusion: 40 × 80 = 3,200 mcg/min. 3,200 ÷ 10,000 = 0.32 × 60 = 19.2.\n\n80 mL = forgot ÷conc. 192 = ×60 twice. 0.32 = forgot ×60.",
    scene: "iv_drip_calc", sceneCfg: { label: "PROPOFOL BOLUS+INF", drug: "PROP 10mg/mL", concentration: "10,000 mcg/mL", dose: "Bolus 80mg | Inf 3,200 mcg/min", rate: "8 mL | 19.2 mL/hr" },
    metadata: { topic: "Bolus + Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  // ═══════════════════════════════════════════════════════════════
  // TOTAL DRUG DELIVERED
  // ═══════════════════════════════════════════════════════════════

  { id: "cp-n2-030", type: "mcq",
    prompt: "Propofol 10 mg/mL. Patient 100 kg. 60 mcg/kg/min for 30 min. Total mg delivered?",
    setup: "", ans: [
      { t: "180 mg",    ok: true  },
      { t: "6 mg",      ok: false },
      { t: "18 mg",     ok: false },
      { t: "1,800 mg",  ok: false },
    ],
    rationale: "6,000 mcg/min × 30 = 180,000 mcg ÷ 1,000 = 180 mg.\n\n6 = mcg as mg. 18 = ÷10,000. 1,800 = ×10.",
    scene: null,
    metadata: { topic: "Total Drug Delivered", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-031", type: "mcq",
    prompt: "Propofol. Patient 100 kg. 50 mcg/kg/min for 20 min, then 25 mcg/kg/min for 40 min. Total mg?",
    setup: "Two-segment calculation.", ans: [
      { t: "200 mg",   ok: true  },
      { t: "100 mg",   ok: false },
      { t: "300 mg",   ok: false },
      { t: "20 mg",    ok: false },
    ],
    rationale: "Seg 1: 5,000 mcg/min × 20 = 100,000. Seg 2: 2,500 × 40 = 100,000. Total: 200,000 ÷ 1,000 = 200 mg.\n\n100 = one segment only. 300 = 50 × 60 min. 20 = ÷10,000.",
    scene: null,
    metadata: { topic: "Total Drug Delivered", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-032", type: "mcq",
    prompt: "Norepi 4 mg/250 mL. Patient 100 kg. 0.1 mcg/kg/min for 15 min. Total mcg delivered?",
    setup: "", ans: [
      { t: "150 mcg",   ok: true  },
      { t: "1,500 mcg", ok: false },
      { t: "15 mcg",    ok: false },
      { t: "10 mcg",    ok: false },
    ],
    rationale: "Dose: 0.1 × 100 = 10 mcg/min × 15 = 150 mcg.\n\n1,500 = ×150 not ×15. 15 = forgot ×weight. 10 = forgot ×time.",
    scene: null,
    metadata: { topic: "Total Drug Delivered", priority: "medium", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  // ═══════════════════════════════════════════════════════════════
  // MULTI-SEGMENT INFUSION
  // ═══════════════════════════════════════════════════════════════

  { id: "cp-n2-033", type: "mcq",
    prompt: "1,000 mL NS over 12 hr. Rate doubled for first 2 hr, then reduced for remaining 10 hr. What is the reduced rate?",
    setup: "", ans: [
      { t: "66.7 mL/hr",  ok: true  },
      { t: "83.3 mL/hr",  ok: false },
      { t: "100 mL/hr",   ok: false },
      { t: "50 mL/hr",    ok: false },
    ],
    rationale: "Base: 1,000 ÷ 12 = 83.33. Doubled: 166.67 × 2 = 333.3 mL. Remain: 666.7 ÷ 10 = 66.7.\n\n83.3 = ignored doubling. 100 = 1,000÷10. 50 = halved base.",
    scene: null,
    metadata: { topic: "Multi-Segment Rate", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  // ═══════════════════════════════════════════════════════════════
  // RECONSTITUTION / MIXING
  // ═══════════════════════════════════════════════════════════════

  { id: "cp-n2-034", type: "mcq",
    prompt: "Cefazolin 2 g reconstituted to 10 mL. Concentration in mg/mL?",
    setup: "", ans: [
      { t: "200 mg/mL",   ok: true  },
      { t: "2 mg/mL",     ok: false },
      { t: "20 mg/mL",    ok: false },
      { t: "0.2 mg/mL",   ok: false },
    ],
    rationale: "2 g = 2,000 mg. 2,000 ÷ 10 = 200 mg/mL.\n\n2 = forgot g→mg. 20 = ÷100. 0.2 = inverted.",
    scene: null,
    metadata: { topic: "Reconstitution", priority: "medium", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-035", type: "mcq",
    prompt: "Prepare phenylephrine 100 mcg/mL in 100 mL from stock 10 mg/mL. How many mL of stock?",
    setup: "", ans: [
      { t: "1 mL",    ok: true  },
      { t: "10 mL",   ok: false },
      { t: "0.1 mL",  ok: false },
      { t: "100 mL",  ok: false },
    ],
    rationale: "Need: 100 mcg/mL × 100 mL = 10,000 mcg. Stock: 10 mg/mL = 10,000 mcg/mL. Volume: 10,000 ÷ 10,000 = 1 mL.\n\n10 = forgot mg→mcg. 0.1 = ÷100,000.",
    scene: null,
    metadata: { topic: "Drug Preparation", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-036", type: "mcq",
    prompt: "Mix norepi 8 mg in 250 mL. Concentration in mcg/mL?",
    setup: "", ans: [
      { t: "32 mcg/mL",   ok: true  },
      { t: "0.032 mcg/mL", ok: false },
      { t: "320 mcg/mL",  ok: false },
      { t: "3.2 mcg/mL",  ok: false },
    ],
    rationale: "8 × 1,000 = 8,000 mcg. 8,000 ÷ 250 = 32 mcg/mL.\n\n0.032 = forgot ×1,000. 320 = ÷25. 3.2 = ÷2,500.",
    scene: null,
    metadata: { topic: "Drug Preparation", priority: "medium", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  // ═══════════════════════════════════════════════════════════════
  // HEPARIN / INSULIN (unit-based)
  // ═══════════════════════════════════════════════════════════════

  { id: "cp-n2-037", type: "mcq",
    prompt: "Heparin 25,000 units/250 mL. Order 1,400 units/hr. Calculate mL/hr.",
    setup: "", ans: [
      { t: "14.0 mL/hr",  ok: true  },
      { t: "140 mL/hr",   ok: false },
      { t: "1.4 mL/hr",   ok: false },
      { t: "56 mL/hr",    ok: false },
    ],
    rationale: "Conc: 25,000 ÷ 250 = 100 units/mL. 1,400 ÷ 100 = 14.0 mL/hr.\n\nNo ×60 — already /hr. 140 = used 10 u/mL. 1.4 = used 1,000 u/mL.",
    scene: "iv_drip_calc", sceneCfg: { label: "HEPARIN DRIP", drug: "HEP 25,000u/250mL", concentration: "100 units/mL", dose: "1,400 units/hr", rate: "1400 ÷ 100 = 14 mL/hr" },
    metadata: { topic: "Unit-Based Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-038", type: "mcq",
    prompt: "Insulin 100 units/100 mL NS. Run 4 units/hr for 3 hr. (a) mL infused? (b) units delivered?",
    setup: "", ans: [
      { t: "12 mL; 12 units",    ok: true  },
      { t: "4 mL; 4 units",      ok: false },
      { t: "12 mL; 100 units",   ok: false },
      { t: "1.2 mL; 1.2 units",  ok: false },
    ],
    rationale: "Conc: 1 unit/mL. Total: 4 × 3 = 12 units = 12 mL.\n\n4 = forgot ×3 hr. 100 = total bag. 1.2 = ÷10.",
    scene: null,
    metadata: { topic: "Unit-Based Infusion", priority: "medium", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  // ═══════════════════════════════════════════════════════════════
  // SIMPLE IV RATE + UNIT CONVERSION
  // ═══════════════════════════════════════════════════════════════

  { id: "cp-n2-039", type: "mcq",
    prompt: "1,000 mL IV fluid over 8 hours. Pump rate?",
    setup: "", ans: [
      { t: "125 mL/hr",   ok: true  },
      { t: "83.3 mL/hr",  ok: false },
      { t: "250 mL/hr",   ok: false },
      { t: "8 mL/hr",     ok: false },
    ],
    rationale: "1,000 ÷ 8 = 125 mL/hr.\n\n83.3 = ÷12. 250 = ÷4. 8 = inverted division.",
    scene: null,
    metadata: { topic: "Simple IV Rate", priority: "medium", untimed: true, adaptive: true, rationale_mode: "expanded" },
  },

  { id: "cp-n2-040", type: "mcq",
    prompt: "Norepi 4 mg/250 mL. Patient 90 kg. Order 0.06 mcg/kg/min. Calculate mL/hr.",
    setup: "", ans: [
      { t: "20.3 mL/hr",  ok: true  },
      { t: "0.34 mL/hr",  ok: false },
      { t: "2.03 mL/hr",  ok: false },
      { t: "203 mL/hr",   ok: false },
    ],
    rationale: "Conc: 16 mcg/mL. Dose: 0.06 × 90 = 5.4 mcg/min. Rate: 5.4 ÷ 16 = 0.3375 × 60 = 20.25 → 20.3.\n\n0.34 = forgot ×60. 2.03 = used 160 mcg/mL. 203 = used 1.6 mcg/mL.",
    scene: "iv_drip_calc", sceneCfg: { label: "NOREPI VARIANT", drug: "NOREPI 4mg/250mL", concentration: "16 mcg/mL", dose: "0.06 × 90 = 5.4 mcg/min", rate: "5.4 ÷ 16 × 60 = 20.3 mL/hr" },
    metadata: { topic: "3-Step Infusion", priority: "high", untimed: true, adaptive: true, rationale_mode: "expanded" },
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
