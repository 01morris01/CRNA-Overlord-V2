import {
  f, Clamp, Clamp01, Pow,
} from './float32.js';

const ROCURONIUM_EC50 = f(0.13);
const ROCURONIUM_HILL = 4;
const MAX_INVERTIBLE_BLOCKADE = f(0.9999);

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

/**
 * Invert the rocuronium Hill curve to a finite float32 effect-site
 * concentration. Complete blockade is represented by the finite 0.9999
 * endpoint because the mathematical inverse at 1 is infinite.
 */
export function rocuroniumCeFromBlockade(blockade) {
  const numeric = Number(blockade) || 0;
  const b = Clamp(numeric, 0, MAX_INVERTIBLE_BLOCKADE);
  if (b <= 0) return 0;
  const odds = f(b / f(1 - b));
  return f(ROCURONIUM_EC50 * Pow(odds, 1 / ROCURONIUM_HILL));
}
