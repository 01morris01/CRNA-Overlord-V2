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
    prompt: "Charles's law states V/T = constant at constant pressure. A gas occupies 2 L at 273 K. What is its volume at 546 K (same pressure)?",
    setup: "Temperature must be in Kelvin for gas law calculations.",
    ans: [
      { t: "4.0 L — doubling absolute temperature doubles the volume (direct relationship)", ok: true  },
      { t: "1.0 L — volume is inversely proportional to temperature in Charles's law",      ok: false },
      { t: "2.0 L — volume does not change because the pressure was already held constant",  ok: false },
      { t: "8.0 L — volume increases with the square of the absolute temperature increase",  ok: false },
    ],
    rationale: "Charles's law: V₁/T₁ = V₂/T₂ at constant P. V₂ = V₁ × (T₂/T₁) = 2 × (546/273) = 4 L. Temperature MUST be in Kelvin (K = °C + 273). Using Celsius gives nonsensical results — for example, 0°C would imply zero volume. Warming inspired gases increases their volume, which is relevant to delivered tidal volumes.",
    scene: "gas_piston",
    sceneCfg: { label: "CHARLES — V/T = CONST" },
    metadata: { topic: "Charles's Law", priority: "high" },
  },

  {
    id: "cp-n6-005",
    type: "mcq",
    prompt: "Gay-Lussac's law states P/T = constant at constant volume. A sealed O₂ E-cylinder at 20°C reads 750 psi. If temperature rises to 40°C, what is the approximate new pressure?",
    setup: "Convert to Kelvin first: 20°C = 293 K, 40°C = 313 K.",
    ans: [
      { t: "~801 psi — P₂ = 750 × (313/293), pressure rises with temperature in a rigid container", ok: true  },
      { t: "~1500 psi — pressure doubles when the Celsius temperature doubles from 20 to 40 degrees", ok: false },
      { t: "~750 psi — pressure is unchanged because the cylinder volume remains rigidly constant",   ok: false },
      { t: "~702 psi — pressure decreases as molecules slow down at the higher measured temperature",  ok: false },
    ],
    rationale: "Gay-Lussac: P₁/T₁ = P₂/T₂ at constant V. P₂ = 750 × (313/293) ≈ 801 psi. This is why compressed gas cylinders must be stored away from heat sources — temperature increases in a rigid container directly increase pressure. The relationship is direct and linear when using absolute (Kelvin) temperature.",
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
    prompt: "Avogadro's law states V/n = constant (at constant T and P). A fresh gas flow of 2 L/min O₂ is combined with 2 L/min air (21% O₂). What is the approximate FiO₂ of the mixture?",
    setup: "Air contributes both O₂ and N₂ to the total volume.",
    ans: [
      { t: "~60% — 2 L pure O₂ + 0.42 L O₂ from air = 2.42 L O₂ in 4 L total volume", ok: true  },
      { t: "~50% — simply averaging 100% O₂ and 21% O₂ gives exactly half of the sum",  ok: false },
      { t: "~75% — the O₂ flow dominates and the air contributes negligible oxygen volume", ok: false },
      { t: "~40% — air dilutes the pure O₂ more than expected due to nitrogen's density",  ok: false },
    ],
    rationale: "By Avogadro's law, equal volumes of gas at the same T and P contain equal numbers of molecules, so volumes are additive. O₂ from the flowmeter: 2.0 L. O₂ from air: 2.0 × 0.21 = 0.42 L. Total O₂ = 2.42 L in 4.0 L total flow → FiO₂ = 2.42/4.0 = 60.5%. This is NOT simply 50% — the air itself contributes additional oxygen.",
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
    prompt: "A vaporizer set to 2% sevoflurane in Denver (barometric pressure ~630 mmHg) delivers the SAME dial percentage as in New Orleans (~760 mmHg). How does the partial pressure of sevoflurane compare?",
    setup: "",
    ans: [
      { t: "Lower in Denver — partial pressure = 2% × 630 = 12.6 mmHg vs 2% × 760 = 15.2 mmHg",     ok: true  },
      { t: "Higher in Denver — the vaporizer compensates by increasing output concentration at altitude", ok: false },
      { t: "Identical in both cities — vaporizers deliver a fixed partial pressure regardless of altitude", ok: false },
      { t: "Cannot be determined — barometric pressure does not affect volatile anesthetic partial pressures", ok: false },
    ],
    rationale: "Conventional variable-bypass vaporizers deliver a set percentage (vol%). Partial pressure = fraction × barometric pressure. At altitude (lower Patm), the same dial setting produces a lower partial pressure. Since anesthetic potency depends on partial pressure (not percentage), the clinical effect is reduced in Denver. Modern vaporizers maintain the concentration percentage, but the partial pressure — and therefore the brain effect — is lower.",
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
    prompt: "Dalton's law states that the total pressure of a gas mixture equals the sum of the partial pressures of each component. In dry air at sea level (760 mmHg), what is the approximate partial pressure of oxygen?",
    setup: "O₂ constitutes approximately 21% of dry atmospheric air.",
    ans: [
      { t: "Approximately 160 mmHg — calculated as 0.21 × 760 mmHg per Dalton's law of partial pressures", ok: true  },
      { t: "Approximately 760 mmHg — oxygen provides all of the atmospheric pressure at sea level altitude", ok: false },
      { t: "Approximately 100 mmHg — this is the alveolar partial pressure, not the atmospheric value",     ok: false },
      { t: "Approximately 40 mmHg — this is the mixed venous partial pressure of oxygen, not atmospheric",   ok: false },
    ],
    rationale: "Dalton's law: P_total = P₁ + P₂ + ... Each component contributes pressure proportional to its fraction. PO₂ = FiO₂ × Patm = 0.21 × 760 = 159.6 ≈ 160 mmHg. This is the inspired PO₂ in dry air. In the trachea, water vapor pressure (47 mmHg at 37°C) must be subtracted: PiO₂ = 0.21 × (760 − 47) = 149.7 mmHg.",
    scene: null,
    sceneCfg: {},
    metadata: { topic: "Dalton's Law", priority: "high" },
  },

  {
    id: "cp-n6-014",
    type: "mcq",
    prompt: "At an altitude where barometric pressure is 500 mmHg, what is the approximate partial pressure of inspired oxygen in dry air (FiO₂ = 21%)?",
    setup: "",
    ans: [
      { t: "105 mmHg — calculated as 0.21 × 500 mmHg using Dalton's law of partial pressures",    ok: true  },
      { t: "160 mmHg — the partial pressure of oxygen does not change regardless of altitude",      ok: false },
      { t: "250 mmHg — oxygen constitutes 50% of the gas mixture at altitudes above 3000 meters",  ok: false },
      { t: "21 mmHg — the percentage value equals the partial pressure in mmHg at any altitude",    ok: false },
    ],
    rationale: "At altitude: PO₂ = FiO₂ × Patm = 0.21 × 500 = 105 mmHg. The fraction of O₂ in air (21%) stays constant with altitude, but lower Patm means lower PO₂. After humidification at body temperature: PiO₂ = 0.21 × (500 − 47) = 95.1 mmHg — significantly hypoxic. This is why supplemental oxygen is required at high altitude.",
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
    prompt: "At 37°C with fully saturated inspired gas, water vapor pressure is 47 mmHg. At sea level (760 mmHg), what is the effective atmospheric pressure available for other gases in the trachea?",
    setup: "",
    ans: [
      { t: "713 mmHg — subtracting water vapor pressure from barometric pressure (760 − 47 = 713)", ok: true  },
      { t: "760 mmHg — water vapor does not reduce the space available for oxygen and other gases",   ok: false },
      { t: "807 mmHg — water vapor pressure adds to barometric pressure in the humidified trachea",  ok: false },
      { t: "47 mmHg — only water vapor exerts pressure inside the fully saturated tracheal airway",    ok: false },
    ],
    rationale: "By Dalton's law, total pressure = sum of partial pressures. In the trachea at 37°C with 100% humidity, water vapor contributes 47 mmHg. The remaining pressure available for O₂, N₂, and CO₂ is 760 − 47 = 713 mmHg. This affects the alveolar gas equation: PAO₂ = FiO₂ × (Patm − PH₂O) − (PaCO₂/RQ). Ignoring PH₂O overestimates available oxygen.",
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
    prompt: "A fresh gas flow of 3 L/min O₂ and 1 L/min N₂O is set on the anesthesia machine. What is the total fresh gas flow and the percentage of O₂ in the mixture?",
    setup: "",
    ans: [
      { t: "4 L/min total with 75% O₂ — oxygen makes up three-quarters of the total fresh gas flow volume", ok: true  },
      { t: "4 L/min total with 50% O₂ — both gases contribute equally to the oxygen fraction of the mix",   ok: false },
      { t: "3 L/min total with 100% O₂ — N₂O does not contribute to total flow volume on the flowmeter",    ok: false },
      { t: "4 L/min total with 25% O₂ — N₂O dilutes the oxygen more than its fractional volume suggests",   ok: false },
    ],
    rationale: "Total FGF = 3 + 1 = 4 L/min. O₂ fraction = 3/4 = 75%. By Avogadro's principle, volumes are additive for ideal gases. The anesthesia machine's minimum O₂ ratio device (hypoxic guard) ensures that the O₂ fraction never falls below ~25% when N₂O is in use, preventing hypoxic gas delivery. At 75% O₂, this patient has a generous safety margin.",
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
