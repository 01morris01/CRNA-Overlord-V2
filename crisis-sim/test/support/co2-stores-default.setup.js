/* EXPERIMENT ONLY. Used by vitest.co2-stores.config.js to answer one question: if the 'stores' rule were made the
   default, which EXISTING tests would change? Nothing in the app or the normal test run loads this file. */
import { VentilatorSystem } from '../../sim/ventilatorSystem.js';
const update = VentilatorSystem.prototype.updateCO2;
VentilatorSystem.prototype.updateCO2 = function (dt) { this.co2Kinetics = 'stores'; return update.call(this, dt); };
