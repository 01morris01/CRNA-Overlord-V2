import { f, Clamp01, Pow } from './float32.js';

const ROCURONIUM_EC50 = f(0.13);
const ROCURONIUM_HILL = 4;

/**
 * Convert rocuronium effect-site concentration into fractional twitch block.
 * The single mapping is calibrated to the labeled 0.6 mg/kg adult onset and
 * clinical-duration anchors; all stores and returned values are float32.
 */
export function rocuroniumBlockFromCe(effectSiteConcentration) {
  const ce = f(Math.max(0, Number(effectSiteConcentration) || 0));
  const cePower = f(Pow(ce, ROCURONIUM_HILL));
  const ec50Power = f(Pow(ROCURONIUM_EC50, ROCURONIUM_HILL));
  const denominator = f(cePower + ec50Power);
  if (denominator <= 0) return 0;
  return f(Clamp01(f(cePower / denominator)));
}
