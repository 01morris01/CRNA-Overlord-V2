/* ═══════════════════════════════════════════════════════════════════
   simRandom.js — faithful port of OperatingRoom.Simulation.SimRandom.
   SplitMix64 seeding → Mulberry32 stream. Deterministic across machines:
   output depends only on the seed. Value()/Range()/Jitter() return float32.
   ═══════════════════════════════════════════════════════════════════ */
import { f } from './float32.js';

const MASK64 = (1n << 64n) - 1n;
const INV_2P24 = f(1.0 / 16777216.0); // (1.0f/16777216.0f) == 2^-24

export class SimRandom {
  constructor(seed) {
    this._state = 0; // uint32
    this.seed = 0;
    this.reseed(seed);
  }

  reseed(seed) {
    this.seed = seed | 0;
    // (ulong)seed — negative ints sign-extend to 64 bits.
    let s = BigInt(this.seed);
    if (s < 0n) s = (s + (1n << 64n)) & MASK64;

    let z = (s * 0x9E3779B97F4A7C15n + 0x9E3779B97F4A7C15n) & MASK64;
    z = ((z ^ (z >> 30n)) * 0xBF58476D1CE4E5B9n) & MASK64;
    z = ((z ^ (z >> 27n)) * 0x94D049BB133111EBn) & MASK64;
    z = z ^ (z >> 31n);
    // (uint)(z ^ (z >> 32))
    this._state = Number((z ^ (z >> 32n)) & 0xFFFFFFFFn) >>> 0;
    if (this._state === 0) this._state = 0x6D2B79F5;
  }

  // Mulberry32 — raw next 32-bit value (matches C# NextUInt exactly).
  nextUInt() {
    this._state = (this._state + 0x6D2B79F5) >>> 0;
    let t = this._state;
    t = Math.imul(t ^ (t >>> 15), t | 1) >>> 0;
    const inner = (t + Math.imul(t ^ (t >>> 7), t | 61)) >>> 0;
    t = (t ^ inner) >>> 0;
    return (t ^ (t >>> 14)) >>> 0;
  }

  // Uniform float in [0,1) — 24-bit mantissa (C# returns float).
  value() {
    return f((this.nextUInt() >>> 8) * INV_2P24);
  }

  // Uniform float in [min,max) — C#: min + (max-min)*Value() returns float.
  range(min, max) {
    min = f(min); max = f(max);
    return f(min + (max - min) * this.value());
  }

  // Uniform int in [minInclusive, maxExclusive)
  rangeInt(minInclusive, maxExclusive) {
    if (maxExclusive <= minInclusive) return minInclusive;
    const span = (maxExclusive - minInclusive) >>> 0;
    return minInclusive + (this.nextUInt() % span >>> 0);
  }

  // Symmetric jitter in [-amplitude, +amplitude)
  jitter(amplitude) {
    amplitude = f(amplitude);
    return this.range(-amplitude, amplitude);
  }
}
