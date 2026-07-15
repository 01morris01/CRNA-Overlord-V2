/* ═══════════════════════════════════════════════════════════════════
   simulationCore.js — faithful port of OperatingRoom.Simulation.SimulationCore.
   Owns the shared deterministic RNG and the fixed-timestep tick loop.
   Deterministic subsystem order: drugs → Lidocaine → ventilator → physiology → alarms
   → scenario. One SimRandom instance is shared across every subsystem, so
   the global RNG-consumption order per tick is fixed.
   ═══════════════════════════════════════════════════════════════════ */
import { RoundToInt, div } from './float32.js';
import { SimRandom } from './simRandom.js';

export class SimulationCore {
  constructor() {
    this.patient = null;
    this.drugSystem = null;
    this.lidocaineSystem = null;
    this.ventilator = null;
    this.airwayProcedure = null;
    this.alarmSystem = null;
    this.scenario = null;

    this.seed = 12345;
    this.fixedStep = Math.fround(0.02); // 50 Hz — must equal the C# SimulationCore.fixedStep (0.02f)
    this.speed = 1;
    this.autoDrive = false;

    this.rng = null;
    this.simTime = 0;
    this.tickCount = 0;
    this._accumulator = 0;
    this._initialized = false;
  }

  initialize(withSeed) {
    this.seed = withSeed;
    this.rng = new SimRandom(this.seed);
    this.simTime = 0;
    this.tickCount = 0;
    this._accumulator = 0;

    if (this.patient) { this.patient.rng = this.rng; this.patient.drivenExternally = true; }
    if (this.drugSystem) { this.drugSystem.rng = this.rng; this.drugSystem.drivenExternally = true; }
    if (this.ventilator) { this.ventilator.rng = this.rng; this.ventilator.drivenExternally = true; }
    if (this.airwayProcedure) this.airwayProcedure.drivenExternally = true;
    if (this.alarmSystem) { this.alarmSystem.drivenExternally = true; }
    if (this.scenario) { this.scenario.rng = this.rng; this.scenario.drivenExternally = true; }

    this._initialized = true;
  }

  resetSim(withSeed) {
    if (this.drugSystem && this.drugSystem.resetReversalState) this.drugSystem.resetReversalState();
    if (this.lidocaineSystem?.reset) this.lidocaineSystem.reset();
    if (this.airwayProcedure) this.airwayProcedure.reset();
    if (this.patient) this.patient.resetToBaseline();
    this.initialize(withSeed);
  }

  stepOnce(dt) {
    if (this.drugSystem) this.drugSystem.tick(dt);
    if (this.lidocaineSystem) this.lidocaineSystem.tick(dt);
    if (this.airwayProcedure?.prepareTick) this.airwayProcedure.prepareTick(dt);
    if (this.ventilator) this.ventilator.tick(dt);
    if (this.patient) this.patient.tick(dt);
    if (this.airwayProcedure) this.airwayProcedure.tick(dt);
    if (this.alarmSystem) this.alarmSystem.tick(dt);
    if (this.scenario) this.scenario.tick(dt);

    this.simTime += dt;
    this.tickCount++;
  }

  stepFor(seconds) {
    const steps = RoundToInt(div(seconds, this.fixedStep));
    for (let i = 0; i < steps; i++) this.stepOnce(this.fixedStep);
  }
}
