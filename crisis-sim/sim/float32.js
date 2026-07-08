/* ═══════════════════════════════════════════════════════════════════
   float32.js — C#/Mono float semantics in JS.

   EMPIRICALLY CALIBRATED MODEL (verified bit-for-bit against the Unity
   reference): Mono does NOT round every float operation to 32 bits. It
   keeps float sub-expressions in wider (double) precision and rounds to
   float32 only at BOUNDARIES:
     · assignment to a named float variable / field,
     · a float method's return, and
     · passing a value as a float argument (incl. every Mathf.* arg).

   So the raw arithmetic helpers below are plain double ops (no rounding).
   The Mathf.* helpers fround their float inputs AND their result. Ported
   code frounds explicitly (via `f`) at each C# float store; inline C#
   sub-expressions (no named temp) stay double.
   ═══════════════════════════════════════════════════════════════════ */

export const f = Math.fround;

// raw arithmetic — plain double (C# keeps float sub-expressions wide)
export const add = (a, b) => a + b;
export const sub = (a, b) => a - b;
export const mul = (a, b) => a * b;
export const div = (a, b) => a / b;
export const neg = (a) => -a;

// ── Mathf (fround float args + result) ────────────────────────────────
export const Abs = (a) => f(Math.abs(f(a)));

export function Clamp01(v) {
  v = f(v);
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

export function Clamp(v, lo, hi) {
  v = f(v); lo = f(lo); hi = f(hi);
  if (v < lo) return lo;
  if (v > hi) return hi;
  return v;
}

export function Max(a, b) { a = f(a); b = f(b); return a > b ? a : b; }
export function Min(a, b) { a = f(a); b = f(b); return a < b ? a : b; }

// C#: a + (b - a) * Clamp01(t)   [method: args + return frounded]
export function Lerp(a, b, t) {
  a = f(a); b = f(b);
  return f(a + (b - a) * Clamp01(t));
}

export const Exp = (x) => f(Math.exp(f(x)));
export const Pow = (x, y) => f(Math.pow(f(x), f(y)));
export const Sqrt = (x) => f(Math.sqrt(f(x)));
export const Sin = (x) => f(Math.sin(f(x)));
export const Cos = (x) => f(Math.cos(f(x)));
export const Log = (x) => f(Math.log(f(x)));

export const PI = f(Math.PI);

export function Sign(x) { x = f(x); return x >= 0 ? 1 : -1; }

// C#: if (Abs(target-current) <= maxDelta) return target; return current + Sign(target-current)*maxDelta
export function MoveTowards(current, target, maxDelta) {
  current = f(current); target = f(target); maxDelta = f(maxDelta);
  if (Abs(target - current) <= maxDelta) return target;
  return f(current + Sign(target - current) * maxDelta);
}

// Mathf.RoundToInt(f) == (int)Math.Round((double)f)  [banker's rounding]
export function RoundToInt(x) {
  x = f(x);
  const fl = Math.floor(x);
  const diff = x - fl;
  if (diff < 0.5) return fl;
  if (diff > 0.5) return fl + 1;
  return fl % 2 === 0 ? fl : fl + 1;
}

export function FloorToInt(x) { return Math.floor(f(x)); }
export function CeilToInt(x) { return Math.ceil(f(x)); }
