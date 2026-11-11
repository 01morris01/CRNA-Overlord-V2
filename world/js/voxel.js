// voxel.js: the island as blocks. One metre per block, 72 x 28 x 72. Everything here is deterministic: the same island
// every visit, so what you build and where you left things still makes sense when you come back.
// Layout (x east, z south, centre 36,36):   dock (south)  ->  plaza  ->  Anatomy Hall (north, under the hill)
//   The OR (east) links to the existing simulator. Review (west) links to the existing question modes.
//   Your plot (south-east) is where you build. The regional pavilion (south-west) is a building site, on purpose.
import * as THREE from 'three';

export const W = 72, H = 28, D = 72, SEA = 3.86;
export const B = { AIR: 0, GRASS: 1, DIRT: 2, STONE: 3, SAND: 4, PAVE: 5, LOG: 6, LEAF: 7, PLANK: 8, WALL: 9, GLASS: 10, ROOF: 11, CORAL: 12, LAMP: 13, HEDGE: 14, DARK: 15, TILE: 16, LEAF2: 17, BIRCH: 18, PLINTH: 19, SCAF: 20 };
export const PLACEABLE = { plank: B.PLANK, glass: B.GLASS, lamp: B.LAMP, hedge: B.HEDGE, plexus: B.PLINTH };
const C = (h) => new THREE.Color(h);
const COL = {
  [B.GRASS]: { top: C('#84c95c'), side: C('#6cae4c') }, [B.DIRT]: { top: C('#8d6b49'), side: C('#84633f') }, [B.STONE]: { top: C('#a3abb2'), side: C('#8f989f') },
  [B.SAND]: { top: C('#f0dfa9'), side: C('#e2cd92') }, [B.PAVE]: { top: C('#e2ddcf'), side: C('#cfc9b9') }, [B.LOG]: { top: C('#a98459'), side: C('#74543a') },
  [B.LEAF]: { top: C('#5fae4e'), side: C('#4e9c47') }, [B.LEAF2]: { top: C('#3f9a6b'), side: C('#34885d') }, [B.BIRCH]: { top: C('#e9e4d6'), side: C('#ddd8c9') },
  [B.PLANK]: { top: C('#cfa672'), side: C('#b98f5d') }, [B.WALL]: { top: C('#f4f1ea'), side: C('#efebe2') }, [B.GLASS]: { top: C('#bfe3f2'), side: C('#bfe3f2') },
  [B.ROOF]: { top: C('#2f6f7c'), side: C('#285f6b') }, [B.TILE]: { top: C('#c9603c'), side: C('#b45232') }, [B.CORAL]: { top: C('#ff5a3c'), side: C('#f04f33') },
  [B.LAMP]: { top: C('#ffe9b8'), side: C('#ffdf9c') }, [B.HEDGE]: { top: C('#4a9a55'), side: C('#3f8a4a') }, [B.DARK]: { top: C('#3a4048'), side: C('#30353c') },
  [B.PLINTH]: { top: C('#3a4048'), side: C('#30353c') }, [B.SCAF]: { top: C('#d8b27a'), side: C('#c49a62') },
};
const rng = (seed) => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const hash = (x, y, z) => { let n = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 2147483647); n = Math.imul(n ^ n >>> 13, 1274126177); return ((n ^ n >>> 16) >>> 0) / 4294967296; };
function noise2(x, z) { const xi = Math.floor(x), zi = Math.floor(z), fx = x - xi, fz = z - zi, s = (t) => t * t * (3 - 2 * t), a = hash(xi, 0, zi), b = hash(xi + 1, 0, zi), c = hash(xi, 0, zi + 1), d = hash(xi + 1, 0, zi + 1); return a + (b - a) * s(fx) + (c - a) * s(fz) + (a - b - c + d) * s(fx) * s(fz); }

export const SITES = {
  spawn: { x: 37, z: 63.6, yaw: 0 },
  hall: { x: 37, z: 24.9, name: 'Anatomy Hall', sign: 'ANATOMY HALL', signAt: [37, 12.5, 24.06], signYaw: 0 },
  or: { x: 47.9, z: 38.5, name: 'The OR', sign: 'THE OR', signAt: [48.94, 11.45, 38.5], signYaw: -Math.PI / 2 },
  review: { x: 25.1, z: 38.5, name: 'Review', sign: 'REVIEW', signAt: [24.06, 10.5, 38.5], signYaw: Math.PI / 2 },
  plot: { x0: 44, x1: 53, z0: 48, z1: 57, name: 'Your plot', sign: 'YOUR PLOT', signAt: [43.2, 8.7, 47.0], signYaw: -Math.PI * 0.75 },
  regional: { x: 20.5, z: 47.6, name: 'Regional pavilion', sign: 'REGIONAL · BEING BUILT', signAt: [20.5, 11.5, 48.94], signYaw: Math.PI },
  board: { x: 39.6, z: 42.4 }, booth: { x: 40.4, z: 41.2 },
  notes: [{ x: 37.5, z: 6.5, id: 'hill' }, { x: 63.5, z: 37.5, id: 'east' }, { x: 8.5, z: 30.5, id: 'west' }, { x: 37, z: 68.6, id: 'dock' }],
};
export const LAMPS = [[34.5, 30.5], [39.5, 30.5], [34.5, 50.5], [39.5, 50.5], [43.5, 36.5], [43.5, 41.5], [30.5, 36.5], [30.5, 41.5], [34.5, 57.5], [39.5, 57.5], [46.5, 46.5], [27.5, 46.5]];
export const BENCHES = [[32.5, 33.2, 0.5], [41.5, 33.4, -0.5], [31.6, 44.4, 2.4], [42.6, 44.6, -2.4]];
export const GROUND = 6;   // top block index of the flat ground; you stand at y = 7

export function generate(plot = []) {
  const data = new Uint8Array(W * H * D), I = (x, y, z) => x + W * (z + D * y);
  const inb = (x, y, z) => x >= 0 && x < W && y >= 0 && y < H && z >= 0 && z < D;
  const set = (x, y, z, t) => { if (inb(x, y, z)) data[I(x, y, z)] = t; }, get = (x, y, z) => inb(x, y, z) ? data[I(x, y, z)] : 0;
  const fill = (x0, y0, z0, x1, y1, z1, t) => { for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) set(x, y, z, t); };
  const R = rng(20261110), flat = new Uint8Array(W * D), paved = new Uint8Array(W * D), FI = (x, z) => x + W * z;
  const markFlat = (x0, z0, x1, z1, pave = false) => { for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) if (x >= 0 && x < W && z >= 0 && z < D) { flat[FI(x, z)] = 1; if (pave) paved[FI(x, z)] = 1; } };
  // plaza (round), paths, building pads, plot
  for (let x = 28; x <= 45; x++) for (let z = 30; z <= 47; z++) { const d = Math.hypot(x - 36.5, z - 38.5); if (d < 7.6) { flat[FI(x, z)] = 1; if (d < 6.6) paved[FI(x, z)] = 1; } }
  markFlat(35, 24, 38, 60, true); markFlat(36, 60, 37, 60, true);                        // dock -> plaza -> hall
  markFlat(42, 37, 48, 40, true); markFlat(25, 37, 31, 40, true);                         // east to the OR, west to Review
  for (let i = 0; i <= 9; i++) { markFlat(41 + i, 43 + i, 43 + i, 44 + i, i < 6); markFlat(29 - i, 43 + i, 31 - i, 44 + i, i < 6); }   // diagonals to the plot and the pavilion
  markFlat(27, 11, 45, 25); markFlat(47, 31, 61, 45); markFlat(11, 31, 25, 45); markFlat(42, 46, 55, 59); markFlat(14, 46, 27, 59);
  const height = (x, z) => {
    if (flat[FI(x, z)]) return GROUND;
    const dx = (x - 36) / 31, dz = (z - 37) / 31, r = Math.hypot(dx, dz) + (noise2(x * 0.09, z * 0.09) - 0.5) * 0.22;
    const hill = 7.5 * Math.exp(-((x - 37) ** 2 + (z - 5) ** 2) / 70) + 3.2 * Math.exp(-((x - 12) ** 2 + (z - 22) ** 2) / 50) + 2.6 * Math.exp(-((x - 60) ** 2 + (z - 24) ** 2) / 46);
    const land = GROUND + (noise2(x * 0.16 + 9, z * 0.16) - 0.45) * 1.7 + hill;
    const bay = THREE.MathUtils.smoothstep(z, 58.5, 62.5) * (1 - THREE.MathUtils.smoothstep(Math.abs(x - 37), 5, 12));
    const edge = Math.max(THREE.MathUtils.smoothstep(r, 0.8, 1.02), bay);
    return Math.round(land * (1 - edge) + 1.2 * edge + (r > 1.02 ? (noise2(x * 0.2, z * 0.2) - 0.5) : 0));
  };
  const top = new Int8Array(W * D);
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) top[FI(x, z)] = Math.max(1, Math.min(H - 10, height(x, z)));
  // every slope is at most one block per step, so anywhere you can see, you can walk to
  for (let pass = 0; pass < 40; pass++) for (let x = 1; x < W - 1; x++) for (let z = 1; z < D - 1; z++) { if (flat[FI(x, z)]) continue; const m = Math.min(top[FI(x - 1, z)], top[FI(x + 1, z)], top[FI(x, z - 1)], top[FI(x, z + 1)]); if (top[FI(x, z)] > m + 1) top[FI(x, z)] = m + 1; }
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) { const h = top[FI(x, z)];
    for (let y = 0; y <= h; y++) { const beach = h <= 4, rocky = h >= 12 || (h >= 10 && hash(x, 3, z) > 0.55); set(x, y, z, y === h ? (beach ? B.SAND : rocky ? B.STONE : paved[FI(x, z)] ? B.PAVE : B.GRASS) : y > h - 3 ? (beach ? B.SAND : rocky ? B.STONE : B.DIRT) : B.STONE); }
  }
  const G = GROUND + 1;   // first air layer above flat ground
  // --- plaza fountain: a dark basin, water in it, the Overlord dot in the middle
  for (let x = 34; x <= 39; x++) for (let z = 36; z <= 41; z++) { const d = Math.hypot(x - 36.5, z - 38.5); if (d < 3 && d > 1.9) set(x, G, z, B.DARK); if (d <= 1.9) set(x, GROUND, z, B.DARK); }
  // --- Anatomy Hall: white, glass-fronted, teal roof, coral door frame; a lit plinth inside you can see from the path
  { const x0 = 29, x1 = 44, z0 = 13, z1 = 23, y0 = G, y1 = G + 5;
    fill(x0, GROUND, z0, x1, GROUND, z1, B.PAVE); fill(x0, y0, z0, x1, y1, z1, B.WALL); fill(x0 + 1, y0, z0 + 1, x1 - 1, y1, z1 - 1, B.AIR);
    fill(x0 + 2, y0 + 1, z1, x1 - 2, y1 - 1, z1, B.GLASS); fill(x0, y0 + 1, z0 + 2, x0, y1 - 1, z1 - 2, B.GLASS); fill(x1, y0 + 1, z0 + 2, x1, y1 - 1, z1 - 2, B.GLASS);
    for (const x of [33, 40]) fill(x, y0, z1, x, y1, z1, B.WALL);
    fill(35, y0, z1, 38, y0 + 3, z1, B.AIR); fill(34, y0, z1, 34, y0 + 4, z1, B.CORAL); fill(39, y0, z1, 39, y0 + 4, z1, B.CORAL); fill(34, y0 + 4, z1, 39, y0 + 4, z1, B.CORAL);
    fill(x0 - 1, y1 + 1, z0 - 1, x1 + 1, y1 + 1, z1 + 2, B.ROOF); fill(x0 + 2, y1 + 2, z0 + 2, x1 - 2, y1 + 2, z1 - 2, B.ROOF); fill(x0 + 5, y1 + 2, z0 + 4, x1 - 5, y1 + 2, z1 - 4, B.GLASS);
    fill(35, y0, 17, 38, y0, 19, B.DARK); fill(36, y0 + 1, 18, 37, y0 + 1, 18, B.LAMP);
    for (const x of [31, 42]) { set(x, y0, 15, B.PLANK); set(x, y0, 20, B.PLANK); } }
  // --- The OR: a low clinical block with a long window and a coral canopy over the door
  { const x0 = 49, x1 = 60, z0 = 33, z1 = 44, y0 = G, y1 = G + 4;
    fill(x0, GROUND, z0, x1, GROUND, z1, B.PAVE); fill(x0, y0, z0, x1, y1, z1, B.WALL); fill(x0 + 1, y0, z0 + 1, x1 - 1, y1, z1 - 1, B.AIR);
    fill(x0, y0 + 1, z0 + 2, x0, y0 + 2, z1 - 2, B.GLASS); fill(x0 + 2, y0 + 1, z1, x1 - 2, y0 + 2, z1, B.GLASS); fill(x0 + 2, y0 + 1, z0, x1 - 2, y0 + 2, z0, B.GLASS);
    fill(x0, y0, 37, x0, y0 + 2, 39, B.AIR); fill(x0 - 2, y0 + 3, 36, x0 - 1, y0 + 3, 40, B.CORAL);
    fill(x0 - 1, y1 + 1, z0 - 1, x1 + 1, y1 + 1, z1 + 1, B.ROOF); fill(x0 + 3, y1 + 2, z0 + 3, x0 + 5, y1 + 2, z0 + 5, B.DARK);
    fill(53, y0, 37, 56, y0, 39, B.WALL); fill(53, y0 + 1, 37, 56, y0 + 1, 39, B.ROOF); }   // the table, seen through the door
  // --- Review: timber and plaster with a stepped terracotta roof, shelves of colour in the window
  { const x0 = 12, x1 = 23, z0 = 33, z1 = 44, y0 = G, y1 = G + 3;
    fill(x0, GROUND, z0, x1, GROUND, z1, B.PLANK); fill(x0, y0, z0, x1, y1, z1, B.WALL); fill(x0 + 1, y0, z0 + 1, x1 - 1, y1, z1 - 1, B.AIR);
    for (const [x, z] of [[x0, z0], [x1, z0], [x0, z1], [x1, z1]]) fill(x, y0, z, x, y1, z, B.LOG);
    fill(x1, y0 + 1, z0 + 2, x1, y0 + 2, z1 - 2, B.GLASS); fill(x0 + 2, y0 + 1, z1, x1 - 2, y0 + 2, z1, B.GLASS); fill(x1, y0, 37, x1, y0 + 2, 39, B.AIR);
    for (let i = 0; i < 5; i++) fill(x0 - 1 + i, y1 + 1 + i, z0 - 1, x1 + 1 - i, y1 + 1 + i, z1 + 1, B.TILE);
    for (let z = z0 + 2; z <= z1 - 2; z += 2) { set(x0 + 1, y0, z, B.PLANK); set(x0 + 1, y0 + 1, z, [B.CORAL, B.ROOF, B.LAMP, B.HEDGE][z % 4]); set(x0 + 1, y0 + 2, z, B.PLANK); } }
  // --- your plot: a hedge you can step over, one gap, and whatever you have built
  { const p = SITES.plot; for (let x = p.x0 - 1; x <= p.x1 + 1; x++) for (let z = p.z0 - 1; z <= p.z1 + 1; z++) if ((x === p.x0 - 1 || x === p.x1 + 1 || z === p.z0 - 1 || z === p.z1 + 1) && !(z === p.z0 - 1 && x >= 44 && x <= 46) && !(x === p.x0 - 1 && z >= 48 && z <= 50)) set(x, G, z, B.HEDGE); }
  // --- regional pavilion: honestly unfinished. A slab, four posts, scaffolding.
  { fill(15, GROUND, 49, 26, GROUND, 58, B.PAVE); for (const [x, z] of [[15, 49], [26, 49], [15, 58], [26, 58]]) fill(x, G, z, x, G + 4, z, B.SCAF); fill(15, G + 4, 49, 26, G + 4, 49, B.SCAF); fill(15, G + 4, 58, 26, G + 4, 58, B.SCAF); fill(15, G + 2, 49, 15, G + 2, 58, B.SCAF); fill(18, G, 52, 20, G, 53, B.PLANK); set(22, G, 55, B.STONE); set(23, G, 55, B.STONE); set(22, G + 1, 55, B.STONE); }
  // --- dock: one step down from the path, then a timber pier out over the water
  fill(34, 5, 61, 39, H - 1, 70, B.AIR); fill(35, 0, 61, 38, 4, 61, B.STONE); fill(35, 5, 61, 38, 5, 61, B.PAVE); fill(35, 4, 62, 38, 4, 69, B.PLANK);
  for (const z of [63, 66, 69]) for (const x of [35, 38]) fill(x, 0, z, x, 3, z, B.LOG);
  // --- trees: only on grass, never on anything flat
  const trees = [];
  for (let n = 0; n < 900 && trees.length < 46; n++) {
    const x = 3 + Math.floor(R() * (W - 6)), z = 3 + Math.floor(R() * (D - 6)), h = top[FI(x, z)];
    if (get(x, h, z) !== B.GRASS || flat[FI(x, z)] || trees.some((t) => Math.hypot(t[0] - x, t[1] - z) < 4.2)) continue;
    let nearFlat = false; for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) if (flat[FI(Math.min(W - 1, Math.max(0, x + a)), Math.min(D - 1, Math.max(0, z + b)))]) nearFlat = true; if (nearFlat) continue;
    trees.push([x, z]); const kind = R(), th = 3 + Math.floor(R() * 3), lt = kind < 0.2 ? B.LEAF2 : B.LEAF, lg = kind > 0.82 ? B.BIRCH : B.LOG;
    fill(x, h + 1, z, x, h + th, z, lg); const cy = h + th + 1, rr = 2 + (R() > 0.6 ? 1 : 0);
    for (let a = -rr; a <= rr; a++) for (let b = -rr; b <= rr; b++) for (let c = -1; c <= 2; c++) { const d = Math.hypot(a, b, c * 1.35); if (d < rr - 0.2 + hash(x + a, cy + c, z + b) * 0.9 && !get(x + a, cy + c, z + b)) set(x + a, cy + c, z + b, lt); }
  }
  // --- what the player has built
  const p = SITES.plot; for (const [x, y, z, t] of plot) if (x >= p.x0 && x <= p.x1 && z >= p.z0 && z <= p.z1 && y > GROUND && y < GROUND + 9) set(x, y, z, t);
  return { data, get, set, top: (x, z) => { x = Math.floor(x); z = Math.floor(z); for (let y = H - 1; y >= 0; y--) if (get(x, y, z) && get(x, y, z) !== B.LEAF && get(x, y, z) !== B.LEAF2) return y; return 0; }, flat: (x, z) => !!flat[FI(Math.floor(x), Math.floor(z))], grassAt: (x, z) => get(x, top[FI(x, z)], z) === B.GRASS && !flat[FI(x, z)] ? top[FI(x, z)] : -1 };
}
export const solid = (t) => t !== B.AIR;
const seeThrough = (t) => t === B.AIR || t === B.GLASS;

const FACES = [
  { d: [1, 0, 0], c: [[1, 0, 1], [1, 0, 0], [1, 1, 0], [1, 1, 1]] }, { d: [-1, 0, 0], c: [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]] },
  { d: [0, 1, 0], c: [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]] }, { d: [0, -1, 0], c: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]] },
  { d: [0, 0, 1], c: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]] }, { d: [0, 0, -1], c: [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]] },
];
/** Turn the block grid into four meshes' worth of geometry: solid, leaves (they sway), glass, and things that glow. */
export function mesh(world) {
  const { get } = world, out = { solid: bucket(), leaf: bucket(), glass: bucket(), glow: bucket() }, col = new THREE.Color();
  function bucket() { return { p: [], n: [], c: [], i: [] }; }
  for (let y = 0; y < H; y++) for (let z = 0; z < D; z++) for (let x = 0; x < W; x++) {
    const t = get(x, y, z); if (!t) continue;
    const b = t === B.GLASS ? out.glass : (t === B.LEAF || t === B.LEAF2 || t === B.HEDGE) ? out.leaf : (t === B.LAMP || t === B.CORAL) ? out.glow : out.solid;
    for (let f = 0; f < 6; f++) {
      const F = FACES[f], nb = get(x + F.d[0], y + F.d[1], z + F.d[2]);
      if (t === B.GLASS ? nb !== B.AIR : !seeThrough(nb)) continue;
      if (y === 0 && f === 3) continue;
      const base = COL[t][f === 2 ? 'top' : 'side']; const v = 0.95 + hash(x, y, z) * 0.1, chk = t === B.PAVE && ((x + z) & 1) ? 0.955 : 1, low = t === B.GRASS && f !== 2 && get(x, y + 1, z) ? 1 : 1;
      const ao = [], start = b.p.length / 3, ax = F.d[0] ? 0 : F.d[1] ? 1 : 2, u = (ax + 1) % 3, w = (ax + 2) % 3;
      for (let k = 0; k < 4; k++) {
        const c = F.c[k]; b.p.push(x + c[0], y + c[1], z + c[2]); b.n.push(F.d[0], F.d[1], F.d[2]);
        const o = [x + F.d[0], y + F.d[1], z + F.d[2]], su = c[u] ? 1 : -1, sw = c[w] ? 1 : -1, A = [...o], Bn = [...o], Cn = [...o]; A[u] += su; Bn[w] += sw; Cn[u] += su; Cn[w] += sw;
        const s1 = !seeThrough(get(A[0], A[1], A[2])), s2 = !seeThrough(get(Bn[0], Bn[1], Bn[2])), cc = !seeThrough(get(Cn[0], Cn[1], Cn[2])), a = s1 && s2 ? 0 : 3 - (s1 + s2 + cc);
        ao.push(a); const shade = (0.7 + 0.1 * a) * v * chk * low; col.copy(base).multiplyScalar(shade); b.c.push(col.r, col.g, col.b);
      }
      if (ao[0] + ao[2] > ao[1] + ao[3]) b.i.push(start, start + 1, start + 2, start, start + 2, start + 3); else b.i.push(start + 1, start + 2, start + 3, start + 1, start + 3, start);
    }
  }
  const geo = (b) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(b.p, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(b.n, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(b.c, 3)); g.setIndex(b.i); return g; };
  return { solid: geo(out.solid), leaf: geo(out.leaf), glass: geo(out.glass), glow: geo(out.glow), quads: (out.solid.i.length + out.leaf.i.length + out.glass.i.length + out.glow.i.length) / 6 };
}
/** First solid block along a ray, and the empty cell in front of it. Used for building. */
export function castBlock(world, origin, dir, maxDist = 60) {
  let x = Math.floor(origin.x), y = Math.floor(origin.y), z = Math.floor(origin.z); const st = [Math.sign(dir.x), Math.sign(dir.y), Math.sign(dir.z)];
  const tD = [Math.abs(1 / dir.x), Math.abs(1 / dir.y), Math.abs(1 / dir.z)], fr = (o, d) => d > 0 ? 1 - (o - Math.floor(o)) : o - Math.floor(o);
  const tM = [fr(origin.x, dir.x) * tD[0], fr(origin.y, dir.y) * tD[1], fr(origin.z, dir.z) * tD[2]]; let prev = null, t = 0;
  while (t < maxDist) { if (world.get(x, y, z)) return { hit: [x, y, z], before: prev, type: world.get(x, y, z), dist: t }; prev = [x, y, z]; const a = tM[0] < tM[1] ? (tM[0] < tM[2] ? 0 : 2) : (tM[1] < tM[2] ? 1 : 2); t = tM[a]; tM[a] += tD[a]; if (a === 0) x += st[0]; else if (a === 1) y += st[1]; else z += st[2]; if (y < 0 || y >= H + 20) break; }
  return null;
}
