/**
 * Chemistry & Physics for Anesthesia — Node 6
 * The Gas Laws
 *
 * Topics: Boyle, Charles, Gay-Lussac, Avogadro, Ideal Gas Law,
 * real vs ideal gases, altitude effects on anesthetics,
 * gas density and heliox, cylinder storage.
 *
 * Source: NAS 510 Gas Laws Lecture
 */

export const CP_NODE6_QUESTIONS = [

  // ═══════════════════════════════════════════════════════════════════════════
  // GAS LAW TRIANGLE & BOYLE'S LAW
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n6-001",
    type: "mcq",
    prompt: "The 'gas law triangle' places Boyle, Charles, and Gay-Lussac at the three angles, with P, V, and T on the sides. Which law occupies the angle OPPOSITE the temperature side (i.e., T is held constant)?",
    setup: "",
    ans: [
      { t: "Boyle's law — P × V = constant when temperature is held constant",       ok: true  },
      { t: "Charles's law — V / T = constant when pressure is held constant",         ok: false },
      { t: "Gay-Lussac's law — P / T = constant when volume is held constant",        ok: false },
      { t: "Avogadro's law — V / n = constant when temperature and pressure are held", ok: false },
    ],
    rationale: "In the gas law triangle, each law sits at the angle opposite the variable it holds constant. Boyle's law holds temperature constant (opposite T), relating pressure and volume inversely. Charles holds pressure constant (opposite P). Gay-Lussac holds volume constant (opposite V). This triangle is a useful mnemonic for organizing the three classical gas laws.",
    scene: "gas_piston",
    sceneCfg: { label: "GAS LAW TRIANGLE — BOYLE AT T" },
    metadata: { topic: "Gas Law Triangle", priority: "medium" },
  },

  {
    id: "cp-n6-002",
    type: "mcq",
    prompt: "Boyle's law states P × V = constant (at constant T). A 50 mL syringe of gas is compressed to 25 mL. What happens to the pressure?",
    setup: "",
    ans: [
      { t: "Pressure doubles — halving volume at constant T doubles P (inverse relationship)", ok: true  },
      { t: "Pressure is halved — reducing volume proportionally reduces the gas pressure too",  ok: false },
      { t: "Pressure remains unchanged — only temperature affects pressure inside a syringe",   ok: false },
      { t: "Pressure quadruples — pressure varies with the square of the volume reduction",     ok: false },
    ],
    rationale: "Boyle's law describes an inverse relationship between P and V at constant temperature. P₁V₁ = P₂V₂. If V is halved (50 → 25 mL), P must double. The 'backwards B' mnemonic reminds us Boyle = backwards (inverse). This principle explains why gas in closed body spaces (pneumothorax, air emboli) expands when ambient pressure decreases.",
    scene: "gas_piston",
    sceneCfg: { label: "BOYLE — P × V = CONST" },
    metadata: { topic: "Boyle's Law", priority: "high" },
  },

  {
    id: "cp-n6-003",
    type: "mcq",
    prompt: "A patient with a small pneumothorax is induced for general anesthesia using nitrous oxide. Based on Boyle's law principles, what is the concern?",
    setup: "",
    ans: [
      { t: "N₂O diffuses into the closed gas space faster than N₂ leaves, expanding the pneumothorax volume", ok: true  },
      { t: "N₂O increases atmospheric pressure inside the OR which compresses the pneumothorax further down",  ok: false },
      { t: "N₂O decreases the patient's total lung compliance, making the pneumothorax clinically irrelevant",  ok: false },
      { t: "N₂O is fully absorbed by the pleural membrane, so the pneumothorax actually shrinks during use",    ok: false },
    ],
    rationale: "Nitrous oxide is 34 times more soluble in blood than nitrogen. It diffuses into closed gas-filled spaces much faster than nitrogen can diffuse out. In a pneumothorax, this causes rapid volume expansion (Boyle's law framework: more gas molecules in a compliant space increases volume). N₂O is contraindicated in pneumothorax, bowel obstruction, middle ear surgery, and air embolism.",
    scene: "gas_piston",
    sceneCfg: { label: "N₂O → CLOSED SPACE EXPANSION" },
    metadata: { topic: "Boyle's Law", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHARLES'S LAW & GAY-LUSSAC'S LAW
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n6-004",
    type: "mcq",
    prompt: "Charles's law states V/T = constant at constant pressure. What does this law predict when a gas is heated?",
    setup: "",
    ans: [
      { t: "Volume increases in direct proportion to absolute temperature — heating a gas makes it expand",  ok: true  },
      { t: "Volume decreases as temperature rises because hot gas molecules occupy less space per molecule",   ok: false },
      { t: "Volume remains constant regardless of temperature changes as long as pressure is held constant",   ok: false },
      { t: "Volume increases with the square of temperature because molecular speed scales quadratically",     ok: false },
    ],
    rationale: "Charles's law describes a direct, linear relationship between volume and absolute temperature (Kelvin) at constant pressure. Doubling the absolute temperature doubles the volume. Temperature must be in Kelvin — using Celsius gives nonsensical results (0°C would falsely imply zero volume). Clinically, warming inspired gases increases their volume, which affects delivered tidal volumes.",
    scene: "gas_piston",
    sceneCfg: { label: "CHARLES — V/T = CONST" },
    metadata: { topic: "Charles's Law", priority: "high" },
  },

  {
    id: "cp-n6-005",
    type: "mcq",
    prompt: "Gay-Lussac's law states P/T = constant at constant volume. Why must compressed gas cylinders be stored away from heat sources?",
    setup: "",
    ans: [
      { t: "Heating a sealed rigid cylinder increases internal pressure — risk of rupture or valve failure",  ok: true  },
      { t: "Heating a cylinder decreases internal pressure which can cause the gas to condense into liquid",   ok: false },
      { t: "Temperature has no effect on pressure inside a sealed rigid cylinder at any temperature range",    ok: false },
      { t: "Heating causes the metal cylinder walls to expand, which decreases the internal gas pressure",     ok: false },
    ],
    rationale: "Gay-Lussac: P/T = constant at fixed volume. In a rigid cylinder, raising temperature raises pressure proportionally (must use Kelvin). This is why gas cylinders must be stored away from heat, flames, and direct sunlight. The pressure increase is direct and linear with absolute temperature.",
    scene: "gas_piston",
    sceneCfg: { label: "GAY-LUSSAC — P/T = CONST" },
    metadata: { topic: "Gay-Lussac's Law", priority: "high" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AVOGADRO'S LAW & IDEAL GAS LAW
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n6-006",
    type: "mcq",
    prompt: "On an anesthesia machine, you set equal flows of pure O₂ and air (21% O₂). Why is the resulting FiO₂ approximately 60% and NOT 50%?",
    setup: "",
    ans: [
      { t: "Air itself contains 21% oxygen — so it contributes additional O₂ molecules beyond just dilution",  ok: true  },
      { t: "The anesthesia machine concentrates O₂ from the air flow, enriching it above the set percentage",   ok: false },
      { t: "The FiO₂ is exactly 50% — it is always the simple average of the two gas source concentrations",    ok: false },
      { t: "Nitrogen is absorbed by the CO₂ absorber, leaving a higher fraction of oxygen in the gas mixture",  ok: false },
    ],
    rationale: "By Avogadro's law, equal volumes at equal T and P have equal molecule counts, so volumes add. If you mix 2 L O₂ (100%) with 2 L air (21% O₂), the air contributes 0.42 L of O₂ on top of the 2 L pure O₂ — so total O₂ is 2.42 L in 4 L, which is ~60%, not 50%. This is a common conceptual trap on exams.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Avogadro's Law", priority: "high" },
  },

  {
    id: "cp-n6-007",
    type: "mcq",
    prompt: "The ideal gas law is PV = nRT. What is the standard molar volume of an ideal gas at STP (0°C, 1 atm)?",
    setup: "",
    ans: [
      { t: "22.7 L per mole — derived from PV = nRT using standard temperature and pressure values", ok: true  },
      { t: "8.314 L per mole — this is the value of the universal gas constant R, not the volume",   ok: false },
      { t: "44.8 L per mole — this would be the volume at double the standard atmospheric pressure",  ok: false },
      { t: "11.2 L per mole — this is the molar volume at STP divided by two, a common calculation error", ok: false },
    ],
    rationale: "At STP (273.15 K, 101.325 kPa), one mole of any ideal gas occupies approximately 22.7 L. This value comes directly from PV = nRT: V = nRT/P = (1)(8.314)(273.15)/101,325 ≈ 0.0224 m³ = 22.4 L (the slight difference to 22.7 depends on the exact STP definition used). R = 8.314 J/(mol·K) is the universal gas constant.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Ideal Gas Law", priority: "medium" },
  },

  {
    id: "cp-n6-008",
    type: "short",
    prompt: "In the ideal gas law PV = nRT, what does the letter R represent and what is its value in SI units?",
    setup: "",
    acceptedAnswers: [
      "universal gas constant 8.314",
      "gas constant 8.314",
      "8.314 J/(mol·K)",
      "8.314",
      "universal gas constant",
      "gas constant",
    ],
    canonicalAnswer: "Universal gas constant, R = 8.314 J/(mol·K)",
    rationale: "R is the universal (ideal) gas constant with a value of 8.314 J/(mol·K). It relates pressure, volume, temperature, and amount of substance for an ideal gas. This constant appears throughout thermodynamics and physical chemistry and is the same for all ideal gases regardless of their molecular identity.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Ideal Gas Law", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // REAL vs IDEAL, ALTITUDE, GAS DENSITY, CYLINDERS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n6-009",
    type: "mcq",
    prompt: "Under what conditions do real gases BEST approximate ideal gas behavior?",
    setup: "",
    ans: [
      { t: "At moderate temperatures and low pressures where intermolecular forces are minimal", ok: true  },
      { t: "At extremely high pressures where molecules are forced into close contact with each other", ok: false },
      { t: "At very low temperatures near the condensation point of the gas being studied",     ok: false },
      { t: "Only in a perfect vacuum where no other gas molecules are present to interact with", ok: false },
    ],
    rationale: "Ideal gas behavior assumes no intermolecular forces and negligible molecular volume. Real gases approximate this best at moderate temperatures (molecules have enough kinetic energy to overcome attractions) and low pressures (molecules are far apart, so their volume and forces are negligible). At high pressures or very low temperatures, real gases deviate significantly from ideal predictions.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Real vs Ideal Gases", priority: "medium" },
  },

  {
    id: "cp-n6-010",
    type: "mcq",
    prompt: "At higher altitude, barometric pressure is lower. If a vaporizer is set to the same dial percentage, what happens to the partial pressure of the delivered volatile anesthetic?",
    setup: "",
    ans: [
      { t: "The partial pressure is lower — because partial pressure equals fraction times the reduced barometric pressure", ok: true  },
      { t: "The partial pressure is higher — the vaporizer compensates by increasing output concentration at altitude",      ok: false },
      { t: "The partial pressure is identical — vaporizers deliver a fixed partial pressure regardless of altitude",          ok: false },
      { t: "The partial pressure cannot be predicted — barometric pressure does not affect anesthetic partial pressures",     ok: false },
    ],
    rationale: "Conventional variable-bypass vaporizers deliver a set percentage (vol%). Partial pressure = fraction × barometric pressure. At altitude (lower Patm), the same dial setting produces a lower partial pressure. Since anesthetic potency depends on partial pressure at the brain (not percentage), the clinical effect is reduced at higher altitude even though the dial reads the same percentage.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Altitude & Anesthetics", priority: "high" },
  },

  {
    id: "cp-n6-011",
    type: "mcq",
    prompt: "Heliox (helium-oxygen mixture) is used for patients with severe upper airway obstruction. What gas property makes heliox beneficial?",
    setup: "",
    ans: [
      { t: "Helium's low density reduces turbulent flow resistance through narrowed airways significantly", ok: true  },
      { t: "Helium has a higher oxygen content than nitrogen, increasing the FiO₂ delivered to the lungs",  ok: false },
      { t: "Helium is a bronchodilator that relaxes airway smooth muscle at the level of the bronchioles",  ok: false },
      { t: "Helium's high viscosity promotes laminar flow through the large conducting airways more easily", ok: false },
    ],
    rationale: "Helium is approximately one-seventh the density of nitrogen. In turbulent flow (common in obstructed airways), resistance is proportional to gas density. Replacing nitrogen with helium dramatically reduces the density of the inspired gas, lowering turbulent resistance and reducing the work of breathing. Heliox does NOT increase FiO₂ — it simply replaces nitrogen. It is most effective where flow is turbulent (large airways, fixed obstructions).",
    scene: "vessel_cross_section",
    sceneCfg: { label: "HELIOX — LOW DENSITY → LESS TURBULENCE" },
    metadata: { topic: "Gas Density & Heliox", priority: "high" },
  },

  {
    id: "cp-n6-012",
    type: "multi",
    prompt: "Select the TWO correct statements about compressed gas cylinders used in anesthesia:",
    setup: "",
    choices: [
      "E-cylinders are the small portable tanks mounted on the anesthesia machine as backup supply",
      "H-cylinders are large tanks typically stored in a central gas supply room for piped delivery",
      "E-cylinders contain more total gas than H-cylinders due to their higher compression pressure",
      "Both E and H cylinders are color-coded identically — green for O₂ and blue for N₂O in the US",
      "H-cylinders are smaller bedside units designed for patient transport between hospital floors",
    ],
    correctAnswers: [
      "E-cylinders are the small portable tanks mounted on the anesthesia machine as backup supply",
      "H-cylinders are large tanks typically stored in a central gas supply room for piped delivery",
    ],
    selectCount: 2,
    rationale: "E-cylinders are small, portable tanks that attach to the anesthesia machine yoke via a pin-index safety system (PISS). They serve as backup when the pipeline supply fails. H-cylinders are large tanks (about 5 feet tall) stored in central supply rooms and connected to the hospital's piped gas distribution system. H-cylinders hold far more gas than E-cylinders. Both use standard color coding (green = O₂, blue = N₂O in the US).",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Gas Cylinders", priority: "medium" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEW QUESTIONS 13–25
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "cp-n6-013",
    type: "mcq",
    prompt: "What does Dalton's law of partial pressures state?",
    setup: "",
    ans: [
      { t: "The total pressure of a gas mixture equals the sum of the partial pressures of each individual component gas", ok: true  },
      { t: "The total pressure of a gas mixture is determined solely by the gas with the highest molecular weight present", ok: false },
      { t: "Each gas in a mixture exerts a pressure equal to the total pressure regardless of its fractional concentration", ok: false },
      { t: "The partial pressure of a gas is inversely proportional to its percentage in the mixture at constant volume",   ok: false },
    ],
    rationale: "Dalton's law: P_total = P₁ + P₂ + P₃ + ... Each component gas contributes a partial pressure proportional to its fractional concentration. For example, oxygen (21% of air) contributes 21% of the total atmospheric pressure. This principle is fundamental to calculating inspired oxygen partial pressure, understanding the alveolar gas equation, and predicting anesthetic partial pressures at different altitudes.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Dalton's Law", priority: "high" },
  },

  {
    id: "cp-n6-014",
    type: "mcq",
    prompt: "At high altitude, barometric pressure is reduced but the fractional concentration of oxygen in air remains 21%. What happens to the inspired partial pressure of oxygen?",
    setup: "",
    ans: [
      { t: "It decreases — lower barometric pressure reduces the partial pressure even though the O₂ fraction is unchanged", ok: true  },
      { t: "It stays the same — as long as the oxygen fraction is 21%, partial pressure is independent of barometric pressure", ok: false },
      { t: "It increases — the body compensates at altitude by concentrating oxygen in the inspired gas mixture automatically", ok: false },
      { t: "It depends on humidity only — barometric pressure has no effect on oxygen partial pressure at any altitude",        ok: false },
    ],
    rationale: "By Dalton's law, PO₂ = FiO₂ × Patm. Although the fraction of O₂ in air stays at 21% regardless of altitude, the lower barometric pressure at altitude means the partial pressure of inspired oxygen decreases proportionally. This reduced PiO₂ leads to hypoxemia, which is why supplemental oxygen and acclimatization are required at high altitude.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Dalton's Law", priority: "high" },
  },

  {
    id: "cp-n6-015",
    type: "mcq",
    prompt: "Henry's law states that the amount of gas dissolved in a liquid is proportional to the partial pressure of that gas above the liquid. Which clinical scenario directly applies Henry's law?",
    setup: "",
    ans: [
      { t: "Increased PaO₂ with hyperbaric oxygen therapy increases dissolved oxygen in plasma significantly", ok: true  },
      { t: "Increasing ventilator tidal volume directly increases the amount of dissolved nitrogen in blood",   ok: false },
      { t: "Heating IV fluids causes more gas to dissolve in the solution before it is infused intravenously",  ok: false },
      { t: "Lowering atmospheric pressure causes more oxygen to dissolve in the blood at higher altitude sites", ok: false },
    ],
    rationale: "Henry's law: dissolved gas concentration = solubility coefficient × partial pressure. In hyperbaric oxygen therapy (2–3 atm of 100% O₂), the very high PO₂ dissolves enough O₂ in plasma (~6 mL/dL at 3 atm) to support tissue oxygenation even without hemoglobin. This is used for carbon monoxide poisoning, decompression sickness, and gas gangrene.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Henry's Law", priority: "high" },
  },

  {
    id: "cp-n6-016",
    type: "mcq",
    prompt: "Graham's law states that the rate of diffusion of a gas is inversely proportional to the square root of its molecular weight. Compared to O₂ (MW 32), how does CO₂ (MW 44) diffuse?",
    setup: "",
    ans: [
      { t: "CO₂ diffuses more slowly by Graham's law alone, but its much higher solubility makes it faster overall", ok: true  },
      { t: "CO₂ diffuses faster than O₂ because its higher molecular weight gives it greater kinetic energy",         ok: false },
      { t: "CO₂ and O₂ diffuse at identical rates because both are small molecules in the respiratory gas mixture",   ok: false },
      { t: "CO₂ cannot diffuse across the alveolar membrane and requires active transport by carbonic anhydrase",      ok: false },
    ],
    rationale: "By Graham's law alone, heavier CO₂ (MW 44) diffuses slower than O₂ (MW 32): rate ∝ 1/√MW. However, Fick's law of diffusion also considers solubility. CO₂ is ~20 times more soluble in plasma than O₂, which more than compensates for its higher MW. Net result: CO₂ diffuses across the alveolar membrane about 20 times faster than O₂.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Graham's Law", priority: "medium" },
  },

  {
    id: "cp-n6-017",
    type: "mcq",
    prompt: "Fick's law of diffusion states that gas transfer across a membrane depends on area, thickness, partial pressure gradient, and the diffusion coefficient. Which change would MOST impair alveolar gas exchange?",
    setup: "",
    ans: [
      { t: "Thickening of the alveolar membrane due to pulmonary fibrosis increasing the diffusion distance", ok: true  },
      { t: "Increasing the alveolar surface area by recruiting collapsed lung units with positive pressure",   ok: false },
      { t: "Raising the FiO₂ to increase the partial pressure gradient for oxygen across the alveolar wall",  ok: false },
      { t: "Maintaining normal pulmonary blood flow to preserve the perfusion side of the exchange surface",    ok: false },
    ],
    rationale: "Fick's law: Diffusion ∝ (Area × Solubility × ΔP) / (Thickness × √MW). Increasing membrane thickness (as in pulmonary fibrosis, edema, or ARDS) directly reduces gas transfer by lengthening the diffusion path. This manifests as impaired DLCO on pulmonary function testing and hypoxemia, especially during exercise when transit time through the pulmonary capillary shortens.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Fick's Law", priority: "high" },
  },

  {
    id: "cp-n6-018",
    type: "mcq",
    prompt: "The critical temperature of N₂O is 36.5°C. The critical temperature of O₂ is −118°C. At room temperature (20°C), why is O₂ stored only as a compressed gas while N₂O can be stored as a liquid?",
    setup: "",
    ans: [
      { t: "Room temperature exceeds O₂'s critical temp, so it cannot be liquefied; N₂O is below its critical temp", ok: true  },
      { t: "O₂ molecules are smaller than N₂O and cannot be compressed into liquid form at any temperature or pressure", ok: false },
      { t: "N₂O spontaneously liquefies at room temperature without requiring any additional pressure in the cylinder",   ok: false },
      { t: "O₂ is more volatile than N₂O, which means it always remains in the gas phase under all storage conditions",  ok: false },
    ],
    rationale: "Critical temperature is the temperature above which a gas cannot be liquefied by pressure alone. O₂ has a critical temperature of −118°C, so at room temperature (20°C) — far above its critical temp — no amount of pressure can liquefy it. N₂O has a critical temperature of 36.5°C, so at 20°C (below critical temp), sufficient pressure (745 psi) maintains it as a liquid-gas mixture in the cylinder.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Critical Temperature", priority: "high" },
  },

  {
    id: "cp-n6-019",
    type: "mcq",
    prompt: "An O₂ E-cylinder reads 1000 psi (full = 2000 psi). A N₂O E-cylinder reads 745 psi. Which cylinder has a more reliable pressure gauge for estimating remaining contents?",
    setup: "",
    ans: [
      { t: "The O₂ cylinder — its pressure decreases linearly as gas is used, directly reflecting remaining volume", ok: true  },
      { t: "The N₂O cylinder — its constant pressure reading of 745 psi accurately reflects the remaining liquid",   ok: false },
      { t: "Both cylinders are equally reliable because pressure gauges measure contents identically for all gases",   ok: false },
      { t: "Neither is reliable — cylinder contents must always be estimated by calculating fresh gas flow duration", ok: false },
    ],
    rationale: "O₂ is stored entirely as gas, so pressure drops linearly as gas is consumed — the gauge reliably estimates remaining volume. N₂O exists as liquid + gas below its critical temperature; pressure remains constant at ~745 psi until ALL liquid evaporates. Only then does pressure drop rapidly. For N₂O, weighing the cylinder is the only reliable way to estimate remaining contents.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Gas Cylinders", priority: "high" },
  },

  {
    id: "cp-n6-020",
    type: "mcq",
    prompt: "The filling ratio for N₂O cylinders in temperate climates is 0.75. What does this mean?",
    setup: "",
    ans: [
      { t: "The weight of N₂O in the cylinder is 0.75 times the weight of water the cylinder could hold", ok: true  },
      { t: "The cylinder is filled to 75% of its maximum pressure rating to prevent explosive rupture",    ok: false },
      { t: "Exactly 75% of the cylinder volume is liquid N₂O and the remaining 25% is gaseous N₂O",       ok: false },
      { t: "The N₂O flow rate is limited to 0.75 L/min to prevent excessive cooling of the cylinder",      ok: false },
    ],
    rationale: "The filling ratio is the ratio of the mass of N₂O in the cylinder to the mass of water that would fill the same cylinder. In temperate climates, 0.75 is used; in tropical climates, 0.67 (lower fill to accommodate thermal expansion). Overfilling risks hydrostatic pressure from liquid expansion that could rupture the cylinder. The filling ratio is a safety margin, not a volume fraction.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Gas Cylinders", priority: "medium" },
  },

  {
    id: "cp-n6-021",
    type: "mcq",
    prompt: "When an O₂ cylinder valve is opened rapidly, the gas cools as it expands through the regulator. What thermodynamic process explains this cooling?",
    setup: "",
    ans: [
      { t: "Adiabatic expansion — rapid gas expansion without heat exchange from surroundings lowers temperature", ok: true  },
      { t: "Isothermal compression — the gas is compressed through the regulator which absorbs heat and cools it", ok: false },
      { t: "Endothermic chemical reaction — oxygen reacts with the metal regulator and absorbs heat energy",       ok: false },
      { t: "Radiative heat loss — the high-pressure gas emits infrared radiation as it exits through the valve",   ok: false },
    ],
    rationale: "When compressed gas expands rapidly, it does work on the surrounding gas without time to absorb heat from the environment (adiabatic process). The internal energy decreases, so temperature drops. This is why frost can form on cylinder regulators during high-flow use. The Joule-Thomson effect (gas cooling on expansion through a valve) is a specific manifestation of this principle.",
    scene: "gas_piston",
    sceneCfg: { label: "ADIABATIC EXPANSION → COOLING" },
    metadata: { topic: "Adiabatic Processes", priority: "medium" },
  },

  {
    id: "cp-n6-022",
    type: "mcq",
    prompt: "In the alveolar gas equation, water vapor pressure (47 mmHg at 37°C) is subtracted from barometric pressure. Why must we account for water vapor pressure?",
    setup: "",
    ans: [
      { t: "Water vapor occupies part of the total gas pressure, reducing the pressure available for oxygen and other gases", ok: true  },
      { t: "Water vapor chemically reacts with oxygen in the trachea, consuming a portion of the inspired oxygen molecules",  ok: false },
      { t: "Water vapor increases total barometric pressure in the airways, so it must be subtracted to get the true value",   ok: false },
      { t: "Water vapor has no physiologic effect — it is subtracted only as a mathematical convention without clinical basis", ok: false },
    ],
    rationale: "By Dalton's law, total pressure equals the sum of all partial pressures. In the fully humidified trachea at 37°C, water vapor exerts 47 mmHg. This 'displaces' other gases — the pressure available for O₂, N₂, and CO₂ equals barometric pressure minus 47 mmHg. The alveolar gas equation (PAO₂ = FiO₂ × (Patm − PH₂O) − PaCO₂/RQ) accounts for this. Ignoring water vapor pressure overestimates the available oxygen.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Dalton's Law", priority: "high" },
  },

  {
    id: "cp-n6-023",
    type: "mcq",
    prompt: "High humidity in the breathing circuit reduces the effective FiO₂ delivered to the patient. Why?",
    setup: "",
    ans: [
      { t: "Water vapor displaces a fraction of the gas mixture, reducing the partial pressure of oxygen available", ok: true  },
      { t: "Humidity chemically reacts with oxygen molecules, converting them to water and reducing free O₂ levels", ok: false },
      { t: "Moist gas is denser than dry gas, which impairs laminar flow and reduces oxygen delivery to the alveoli", ok: false },
      { t: "The vaporizer output increases in humid conditions, diluting the oxygen with excess anesthetic vapor",    ok: false },
    ],
    rationale: "By Dalton's law, adding water vapor to a gas mixture at constant total pressure means water vapor 'displaces' other gases. At 100% humidity (37°C), PH₂O = 47 mmHg. If total pressure is 760 mmHg, only 713 mmHg is available for O₂ and other gases. PiO₂ drops from 160 mmHg (dry) to 0.21 × 713 = 149.7 mmHg (humidified). This 10 mmHg difference matters in critically hypoxic patients.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Dalton's Law", priority: "medium" },
  },

  {
    id: "cp-n6-024",
    type: "mcq",
    prompt: "A Thorpe tube (rotameter) on the anesthesia machine measures fresh gas flow. Gas flows upward through a tapered tube, lifting a bobbin. What physical principle governs the bobbin's equilibrium position?",
    setup: "",
    ans: [
      { t: "The bobbin floats where the upward force from gas flow equals the downward gravitational force on it", ok: true  },
      { t: "The bobbin rises to a height determined solely by gas pressure regardless of the flow rate through it", ok: false },
      { t: "Magnetic levitation between the bobbin and the tube wall determines the equilibrium reading position",  ok: false },
      { t: "Electronic sensors measure the bobbin's position and adjust flow to match the set dial value precisely", ok: false },
    ],
    rationale: "In a rotameter, gas flows upward through a vertically oriented tapered tube. The bobbin rises until the annular space between it and the tube wall is large enough that the pressure drop across the bobbin exactly supports its weight. At equilibrium, upward drag force = downward gravity. Higher flow lifts the bobbin higher where the taper is wider. Flow is read at the top of the bobbin (or center of a ball float).",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Gas Flow Measurement", priority: "medium" },
  },

  {
    id: "cp-n6-025",
    type: "mcq",
    prompt: "By Avogadro's law, equal volumes of ideal gases at the same temperature and pressure contain equal numbers of molecules. How does this principle apply to fresh gas flow mixing on the anesthesia machine?",
    setup: "",
    ans: [
      { t: "Gas volumes from different flowmeters can be added directly to determine total flow and fractional concentrations", ok: true  },
      { t: "Heavier gas molecules occupy more volume, so N₂O flow volumes must be adjusted by molecular weight before adding",  ok: false },
      { t: "Gas mixing is unpredictable because different gases have different molar volumes at clinical temperatures",           ok: false },
      { t: "Only gases with the same molecular weight can be mixed predictably on the anesthesia machine flowmeter bank",        ok: false },
    ],
    rationale: "Avogadro's law (V/n = constant at constant T and P) means that equal volumes of any ideal gas contain the same number of molecules. On the anesthesia machine, this allows simple volume-based mixing: the total fresh gas flow is the sum of individual flowmeter readings, and each gas's fractional concentration equals its flow divided by total flow. The hypoxic guard system uses this principle to ensure O₂ never falls below approximately 25%.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Gas Flow Measurement", priority: "medium" },
  },

];

export const CP_NODE6_METADATA = {
  nodeId:   "cp-node-6",
  courseId: "chem-phys-anesthesia",
  chapter:  "The Gas Laws",
  title:    "The Gas Laws",
  totalQuestions: CP_NODE6_QUESTIONS.length,
  questionTypes: {
    mcq:   CP_NODE6_QUESTIONS.filter(q => q.type === 'mcq').length,
    multi: CP_NODE6_QUESTIONS.filter(q => q.type === 'multi').length,
    short: CP_NODE6_QUESTIONS.filter(q => q.type === 'short').length,
  },
};
