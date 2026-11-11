// voxel.js: the island as blocks. One metre per block, 96 x 60 x 100. Deterministic: the same island every visit.
//
// COMPOSITION (x east, z south). A floating island, wider than deep, thick in the middle and jagged underneath.
//   north   a grass hill with a rock crown and conifers; a spring rises on its east flank
//   centre  Anatomy Hall on a raised stone terrace, its glass lantern tower the tallest thing on the island;
//           six wide steps down to a round plaza with the fountain
//   east    the OR, low and white, across a plank bridge over the stream
//   west    Review, timber and plaster under a stepped terracotta roof
//   south-east  one step down: your plot behind a low hedge, and the workshop beside it
//   south-west  the regional pavilion, a building site
//   south   the landing: a stone pier out over open air, where you arrive
//   the stream runs from the spring along the foot of the terrace, under the bridge, into a pond, and off the east edge
import * as THREE from 'three';

export const W = 96, H = 60, D = 100, G = 30;      // G = top block of the plaza level; you stand at y = G + 1
export const GROUND = G;
export const B = { AIR: 0, GRASS: 1, DIRT: 2, STONE: 3, STONE2: 4, STONE3: 5, PAVE: 6, LOG: 7, LEAF: 8, PLANK: 9, WALL: 10, GLASS: 11, ROOF: 12, CORAL: 13, LAMP: 14, HEDGE: 15, DARK: 16, TILE: 17, LEAF2: 18, BIRCH: 19, PLINTH: 20, SCAF: 21, BLOSSOM: 22, PINE: 23, MOSS: 24, SAND: 25, CRYSTAL: 26, BRICK: 27, AWNING: 28 };
export const PLACEABLE = { plank: B.PLANK, glass: B.GLASS, lamp: B.LAMP, hedge: B.HEDGE, coral: B.CORAL, plexus: B.PLINTH };
const C = (h) => new THREE.Color(h);
export const COL = {
  [B.GRASS]: { top: C('#86c95a'), side: C('#6daf4c') }, [B.DIRT]: { top: C('#8a6846'), side: C('#80603f') },
  [B.STONE]: { top: C('#a8adb0'), side: C('#989ea2') }, [B.STONE2]: { top: C('#8b8f96'), side: C('#7c8189') }, [B.STONE3]: { top: C('#b3a493'), side: C('#a39483') },
  [B.MOSS]: { top: C('#7fa262'), side: C('#8e9a84') }, [B.SAND]: { top: C('#ecdcaa'), side: C('#dfcc93') }, [B.PAVE]: { top: C('#e4dfd2'), side: C('#cfc9ba') },
  [B.LOG]: { top: C('#a98459'), side: C('#74543a') }, [B.BIRCH]: { top: C('#ece7d9'), side: C('#ddd8c9') }, [B.PLANK]: { top: C('#cfa672'), side: C('#b98f5d') }, [B.SCAF]: { top: C('#d8b27a'), side: C('#c49a62') },
  [B.LEAF]: { top: C('#62b250'), side: C('#4f9f48') }, [B.LEAF2]: { top: C('#3f9a6b'), side: C('#34885d') }, [B.BLOSSOM]: { top: C('#f6b8cf'), side: C('#ee9fbd') }, [B.PINE]: { top: C('#2f7a52'), side: C('#276945') }, [B.HEDGE]: { top: C('#4a9a55'), side: C('#3f8a4a') },
  [B.WALL]: { top: C('#f4f1ea'), side: C('#efebe2') }, [B.BRICK]: { top: C('#d9cdbd'), side: C('#cbbfae') }, [B.GLASS]: { top: C('#bfe3f2'), side: C('#bfe3f2') }, [B.ROOF]: { top: C('#2f6f7c'), side: C('#285f6b') }, [B.TILE]: { top: C('#c9603c'), side: C('#b45232') },
  [B.CORAL]: { top: C('#ff5a3c'), side: C('#f04f33') }, [B.AWNING]: { top: C('#fff4ea'), side: C('#ff5a3c') }, [B.LAMP]: { top: C('#ffe9b8'), side: C('#ffdf9c') }, [B.CRYSTAL]: { top: C('#9fe8ff'), side: C('#7fd4f2') }, [B.DARK]: { top: C('#3a4048'), side: C('#30353c') }, [B.PLINTH]: { top: C('#3a4048'), side: C('#30353c') },
};
const rng = (seed) => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
export const hash = (x, y, z) => { let n = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 2147483647); n = Math.imul(n ^ n >>> 13, 1274126177); return ((n ^ n >>> 16) >>> 0) / 4294967296; };
function noise2(x, z) { const xi = Math.floor(x), zi = Math.floor(z), fx = x - xi, fz = z - zi, s = (t) => t * t * (3 - 2 * t), a = hash(xi, 0, zi), b = hash(xi + 1, 0, zi), c = hash(xi, 0, zi + 1), d = hash(xi + 1, 0, zi + 1); return a + (b - a) * s(fx) + (c - a) * s(fz) + (a - b - c + d) * s(fx) * s(fz); }

export const PLOT = { x0: 58, x1: 67, z0: 64, z1: 73, y: G - 1 };
export const SITES = {
  spawn: { x: 48, z: 89.5, yaw: 0 },
  hall: { x: 48, z: 32.4, name: 'Anatomy Hall', sign: 'ANATOMY HALL', signAt: [48, G + 10.4, 31.06], signYaw: 0 },
  or: { x: 64.4, z: 48.5, name: 'The OR', sign: 'THE OR', signAt: [65.94, G + 5.45, 48.5], signYaw: -Math.PI / 2 },
  review: { x: 31.6, z: 48.5, name: 'Review', sign: 'REVIEW', signAt: [31.06, G + 4.5, 48.5], signYaw: Math.PI / 2 },
  plot: { ...PLOT, name: 'Your plot', sign: 'YOUR PLOT', signAt: [57.2, G + 1.7, 62.6], signYaw: -Math.PI * 0.75 },
  workshop: { x: 69.4, z: 68, name: 'The workshop', sign: 'WORKSHOP', signAt: [69.94, G + 3.5, 68], signYaw: -Math.PI / 2 },
  regional: { x: 27.5, z: 62.4, name: 'Regional pavilion', sign: 'REGIONAL · BEING BUILT', signAt: [27.5, G + 5.5, 63.94], signYaw: Math.PI },
  board: { x: 42.5, z: 43.5 }, booth: { x: 54.6, z: 45.8 }, cart: { x: 56, z: 44 }, bench: { x: 69.4, z: 68 }, fountain: { x: 48, z: 48 }, pond: { x: 64, z: 57 },
  notes: [{ x: 48, z: 8, id: 'hill' }, { x: 82, z: 60, id: 'east' }, { x: 14, z: 40, id: 'west' }, { x: 48, z: 94, id: 'dock' }],
};
export const LAMPS = [[45.5, 38.5], [50.5, 38.5], [45.5, 58.5], [50.5, 58.5], [45.5, 70.5], [50.5, 70.5], [45.5, 82.5], [50.5, 82.5], [57.5, 46.5], [57.5, 50.5], [38.5, 46.5], [38.5, 50.5], [44.5, 36.5], [51.5, 36.5], [56.5, 61.5], [35.5, 60.5], [63.5, 46.5], [33.5, 50.5]];
export const BENCHES = [[42.5, 54.6, 2.5], [53.5, 54.6, -2.5], [41.3, 41.6, 0.7], [33.4, 53.2, 1.57]];

export function generate(plot = []) {
  const data = new Uint8Array(W * H * D), I = (x, y, z) => x + W * (z + D * y);
  const inb = (x, y, z) => x >= 0 && x < W && y >= 0 && y < H && z >= 0 && z < D;
  const set = (x, y, z, t) => { if (inb(x, y, z)) data[I(x, y, z)] = t; }, get = (x, y, z) => inb(x, y, z) ? data[I(x, y, z)] : 0;
  const fill = (x0, y0, z0, x1, y1, z1, t) => { for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) set(x, y, z, t); };
  const R = rng(20261110), FI = (x, z) => x + W * z, level = new Int16Array(W * D).fill(-99), paved = new Uint8Array(W * D);
  const flat = (x0, z0, x1, z1, lv = G, pave = false) => { for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) if (x >= 0 && x < W && z >= 0 && z < D) { level[FI(x, z)] = lv; if (pave) paved[FI(x, z)] = 1; } };
  // ----- the ground plan -----
  flat(34, 15, 62, 33, G + 3); flat(36, 17, 60, 33, G + 3, true);                               // Hall terrace
  for (let i = 0; i < 3; i++) flat(44, 34 + i, 51, 34 + i, G + 2 - i, true);                    // the steps
  for (let x = 38; x <= 58; x++) for (let z = 38; z <= 58; z++) { const d = Math.hypot(x - 47.5, z - 48); if (d < 9.6) { level[FI(x, z)] = G; if (d < 8.6) paved[FI(x, z)] = 1; } }   // plaza
  flat(46, 37, 49, 40, G, true); flat(46, 56, 49, 86, G, true);                                  // steps to plaza; plaza to landing
  flat(44, 84, 51, 96, G, true);                                                                 // the landing
  flat(56, 47, 65, 50, G, true); flat(31, 47, 39, 50, G, true);                                  // east and west paths
  flat(64, 40, 80, 56, G); flat(16, 40, 32, 56, G);                                              // OR and Review pads
  for (let i = 0; i <= 7; i++) { flat(52 + i, 55 + i, 54 + i, 56 + i, G, true); flat(42 - i, 55 + i, 44 - i, 56 + i, G, true); }   // diagonals south-east and south-west
  flat(56, 62, 80, 76, G - 1); flat(60, 62, 62, 63, G - 1, true);                                // plot and workshop terrace, one step down
  flat(20, 62, 35, 77, G); flat(33, 61, 36, 63, G, true);                                        // pavilion site
  const mask = (x, z) => Math.hypot((x - 48) / 41, (z - 50) / 45) + (noise2(x * 0.07, z * 0.07) - 0.5) * 0.22 + (noise2(x * 0.21, z * 0.21) - 0.5) * 0.07;
  const natural = (x, z) => G + (noise2(x * 0.13 + 9, z * 0.13) - 0.42) * 2.4 + 10 * Math.exp(-((x - 48) ** 2 + (z - 8) ** 2) / 110) + 4 * Math.exp(-((x - 16) ** 2 + (z - 30) ** 2) / 70) + 4.5 * Math.exp(-((x - 80) ** 2 + (z - 28) ** 2) / 60) + 2.5 * Math.exp(-((x - 30) ** 2 + (z - 86) ** 2) / 60);
  const top = new Int16Array(W * D).fill(-1), rr = new Float32Array(W * D);
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) { const r = mask(x, z), lv = level[FI(x, z)]; rr[FI(x, z)] = r; if (r >= 1 && lv === -99) continue; top[FI(x, z)] = lv !== -99 ? lv : Math.round(natural(x, z) - Math.max(0, r - 0.86) * 9); }
  for (let pass = 0; pass < 50; pass++) for (let x = 1; x < W - 1; x++) for (let z = 1; z < D - 1; z++) { const i = FI(x, z); if (top[i] < 0 || level[i] !== -99) continue; let m = 999; for (const j of [i - 1, i + 1, i - W, i + W]) if (top[j] >= 0) m = Math.min(m, top[j]); if (m < 999 && top[i] > m + 1) top[i] = m + 1; }
  // ----- the body of the island: soil, then layered rock, thick in the middle, jagged underneath -----
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) { const i = FI(x, z), h = top[i]; if (h < 0) continue; const r = Math.min(1, rr[i]);
    const spike = Math.max(0, noise2(x * 0.33 + 3, z * 0.33) - 0.5) * 30 * (1.15 - r), depth = 3 + 24 * Math.pow(Math.max(0, 1 - r), 0.62) * (0.75 + 0.5 * noise2(x * 0.11, z * 0.11)) + spike, bot = Math.max(2, Math.round(h - depth));
    const rocky = h >= G + 8 || (h >= G + 6 && hash(x, 3, z) > 0.5);
    for (let y = bot; y <= h; y++) { let t;
      if (y === h) t = rocky ? (hash(x, 5, z) > 0.6 ? B.MOSS : B.STONE) : paved[i] ? B.PAVE : B.GRASS;
      else if (y > h - 3 && !rocky) t = B.DIRT;
      else { const band = Math.floor((y + (noise2(x * 0.09, z * 0.09) - 0.5) * 5 + 300) / 3) % 3; t = [B.STONE, B.STONE2, B.STONE3][band]; if (y === bot && hash(x, y, z) > 0.965) t = B.CRYSTAL; }
      set(x, y, z, t); }
    if (r > 0.84 && !paved[i] && get(x, h, z) === B.GRASS && hash(x, 9, z) > 0.55) for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (inb(x + dx, 0, z + dz) && top[FI(x + dx, z + dz)] < 0) { const n = 1 + Math.floor(hash(x + dx, 2, z + dz) * 6); for (let k = 0; k < n; k++) if (!get(x + dx, h - k, z + dz)) set(x + dx, h - k, z + dz, B.LEAF2); }
  }
  // terrace retaining wall, in brick, so the Hall reads as standing on a plinth
  for (let x = 34; x <= 62; x++) for (let z = 15; z <= 33; z++) if (x === 34 || x === 62 || z === 33) for (let y = G; y <= G + 2; y++) if (get(x, y, z) && !(z === 33 && x >= 44 && x <= 51)) set(x, y, z, B.BRICK);
  // ----- water: spring -> stream along the terrace foot -> under the bridge -> pond -> east edge -----
  const water = [], wet = new Set(), falls = [];
  const carve = (x, z, depth = 1) => { const i = FI(x, z); if (top[i] < 0 || wet.has(i)) return; const h = top[i]; for (let k = 0; k < depth; k++) set(x, h - k, z, B.AIR); set(x, h - depth, z, B.SAND); top[i] = h - depth; wet.add(i); water.push({ x, z, y: h - 0.22 }); };
  const course = [[63, 14], [63, 34], [61, 40], [61, 55]]; for (let s = 0; s < course.length - 1; s++) { const [ax, az] = course[s], [bx, bz] = course[s + 1], n = Math.max(Math.abs(bx - ax), Math.abs(bz - az)); for (let k = 0; k <= n; k++) { const x = Math.round(ax + (bx - ax) * k / n), z = Math.round(az + (bz - az) * k / n); carve(x, z); carve(x + 1, z); } }
  for (let x = 58; x <= 70; x++) for (let z = 52; z <= 62; z++) { const d = Math.hypot(x - SITES.pond.x, z - SITES.pond.z); if (d < 4.6 && level[FI(x, z)] !== G - 1) carve(x, z, d < 2.6 ? 2 : 1); }
  for (let x = 68; x < W; x++) { for (const z of [58, 59]) { if (top[FI(x, z)] >= 0) carve(x, z); else if (!falls.some((f) => f.z === z)) falls.push({ x: x - 0.5, z, y: G - 0.3 }); } }
  fill(60, G, 47, 63, G, 50, B.PLANK); for (const z of [47, 50]) for (const x of [60, 63]) set(x, G + 1, z, B.LOG);                       // the bridge
  const A = G + 1;
  // ----- plaza fountain -----
  for (let x = 44; x <= 51; x++) for (let z = 44; z <= 51; z++) { const d = Math.hypot(x - 47.5, z - 47.5); if (d < 3.4 && d > 2.2) set(x, A, z, B.DARK); if (d <= 2.2) set(x, G, z, B.DARK); }
  // ----- Anatomy Hall: brick plinth, white piers, tall glass bays, teal roof, glass lantern tower, coral portal -----
  { const x0 = 39, x1 = 57, z0 = 18, z1 = 30, y0 = G + 4, y1 = G + 10;
    fill(x0, y0, z0, x1, y1, z1, B.WALL); fill(x0 + 1, y0, z0 + 1, x1 - 1, y1, z1 - 1, B.AIR);
    for (let x = x0 + 1; x < x1; x++) if ((x - x0) % 4 !== 0) { fill(x, y0 + 1, z1, x, y1 - 1, z1, B.GLASS); fill(x, y0 + 1, z0, x, y1 - 2, z0, B.GLASS); }
    for (let z = z0 + 1; z < z1; z++) if ((z - z0) % 4 !== 0) { fill(x0, y0 + 1, z, x0, y1 - 1, z, B.GLASS); fill(x1, y0 + 1, z, x1, y1 - 1, z, B.GLASS); }
    fill(x0, y0, z0, x1, y0, z1, B.BRICK); fill(x0 + 1, y0, z0 + 1, x1 - 1, y0, z1 - 1, B.AIR); fill(x0 + 1, y0 - 1, z0 + 1, x1 - 1, y0 - 1, z1 - 1, B.PAVE);
    fill(45, y0, z1, 50, y0 + 5, z1 + 1, B.CORAL); fill(46, y0, z1, 49, y0 + 4, z1 + 1, B.AIR);                                    // the portal
    fill(x0 - 1, y1 + 1, z0 - 1, x1 + 1, y1 + 1, z1 + 2, B.ROOF); fill(x0 + 1, y1 + 2, z0 + 1, x1 - 1, y1 + 2, z1 - 1, B.ROOF); fill(x0 - 1, y1 + 1, z1 + 2, x1 + 1, y1 + 1, z1 + 2, B.DARK);
    fill(44, y1 + 1, 21, 51, y1 + 9, 28, B.GLASS); fill(45, y1 + 1, 22, 50, y1 + 9, 27, B.AIR); for (const [x, z] of [[44, 21], [51, 21], [44, 28], [51, 28]]) fill(x, y1 + 2, z, x, y1 + 9, z, B.WALL);       // lantern tower
    fill(43, y1 + 10, 20, 52, y1 + 10, 29, B.ROOF); fill(45, y1 + 11, 22, 50, y1 + 11, 27, B.ROOF); fill(47, y1 + 12, 24, 48, y1 + 15, 25, B.DARK);
    fill(46, y0, 22, 49, y0, 26, B.DARK); fill(47, y0 + 1, 23, 48, y0 + 1, 25, B.DARK);                                              // the plinth inside
    for (const x of [42, 54]) { fill(x, y0 - 1 + 1, z1 + 2, x, y0 + 4, z1 + 2, B.CORAL); }                                          // banners
    for (const x of [37, 38, 58, 59]) for (const z of [31, 32]) set(x, G + 4, z, B.HEDGE); for (const x of [41, 55]) { set(x, y0, 20, B.PLANK); set(x, y0, 27, B.PLANK); } }
  // ----- The OR -----
  { const x0 = 66, x1 = 78, z0 = 42, z1 = 54, y0 = A, y1 = A + 4;
    fill(x0, G, z0, x1, G, z1, B.PAVE); fill(x0, y0, z0, x1, y1, z1, B.WALL); fill(x0 + 1, y0, z0 + 1, x1 - 1, y1, z1 - 1, B.AIR);
    fill(x0, y0 + 1, z0 + 2, x0, y0 + 2, z1 - 2, B.GLASS); fill(x0 + 2, y0 + 1, z1, x1 - 2, y0 + 2, z1, B.GLASS); fill(x0 + 2, y0 + 1, z0, x1 - 2, y0 + 2, z0, B.GLASS); fill(x1, y0 + 1, z0 + 2, x1, y0 + 2, z1 - 2, B.GLASS);
    fill(x0, y0, 47, x0, y0 + 2, 49, B.AIR); fill(x0 - 2, y0 + 3, 46, x0 - 1, y0 + 3, 50, B.CORAL); fill(x0, y1, z0, x1, y1, z1, B.BRICK);
    fill(x0 - 1, y1 + 1, z0 - 1, x1 + 1, y1 + 1, z1 + 1, B.ROOF); fill(x0 + 3, y1 + 2, z0 + 3, x0 + 5, y1 + 2, z0 + 5, B.DARK); fill(x1 - 4, y1 + 2, z1 - 5, x1 - 3, y1 + 3, z1 - 4, B.DARK);
    fill(70, y0, 47, 73, y0, 49, B.WALL); fill(70, y0 + 1, 47, 73, y0 + 1, 49, B.ROOF); set(72, y0 + 3, 48, B.LAMP); }
  // ----- Review -----
  { const x0 = 18, x1 = 30, z0 = 42, z1 = 54, y0 = A, y1 = A + 3;
    fill(x0, G, z0, x1, G, z1, B.PLANK); fill(x0, y0, z0, x1, y1, z1, B.WALL); fill(x0 + 1, y0, z0 + 1, x1 - 1, y1, z1 - 1, B.AIR);
    for (const [x, z] of [[x0, z0], [x1, z0], [x0, z1], [x1, z1], [x1, 46], [x1, 50], [24, z1], [24, z0]]) fill(x, y0, z, x, y1, z, B.LOG); fill(x0, y1, z0, x1, y1, z1, B.LOG); fill(x0 + 1, y1, z0 + 1, x1 - 1, y1, z1 - 1, B.AIR);
    fill(x1, y0 + 1, z0 + 2, x1, y0 + 2, 45, B.GLASS); fill(x1, y0 + 1, 51, x1, y0 + 2, z1 - 2, B.GLASS); fill(x0 + 2, y0 + 1, z1, x1 - 2, y0 + 2, z1, B.GLASS); fill(24, y0, z1, 24, y1, z1, B.LOG); fill(x1, y0, 47, x1, y0 + 2, 49, B.AIR);
    for (let i = 0; i < 6; i++) fill(x0 - 1 + i, y1 + 1 + i, z0 - 1, x1 + 1 - i, y1 + 1 + i, z1 + 1, B.TILE);
    for (let z = z0 + 2; z <= z1 - 2; z += 2) { set(x0 + 1, y0, z, B.PLANK); set(x0 + 1, y0 + 1, z, [B.CORAL, B.ROOF, B.LAMP, B.HEDGE][z % 4]); set(x0 + 1, y0 + 2, z, B.PLANK); }
    fill(x1 - 3, y1 + 4, z0 + 2, x1 - 2, y1 + 8, z0 + 3, B.BRICK); }                                                                 // chimney
  // ----- your plot (one step down) and the workshop beside it -----
  { const p = PLOT, y = p.y + 1; for (let x = p.x0 - 1; x <= p.x1 + 1; x++) for (let z = p.z0 - 1; z <= p.z1 + 1; z++) if ((x === p.x0 - 1 || x === p.x1 + 1 || z === p.z0 - 1 || z === p.z1 + 1) && !(z === p.z0 - 1 && x >= 60 && x <= 62)) set(x, y, z, B.HEDGE);
    for (const x of [59, 63]) fill(x, y, p.z0 - 1, x, y + 1, p.z0 - 1, B.LOG);
    const x0 = 70, x1 = 78, z0 = 63, z1 = 73; fill(x0, p.y, z0, x1, p.y, z1, B.PLANK);
    fill(x1, y, z0, x1, y + 3, z1, B.PLANK); fill(x0, y, z0, x1, y + 3, z0, B.PLANK); fill(x0, y, z1, x1, y + 3, z1, B.PLANK); fill(x0 + 1, y, z0, x0 + 1, y + 3, z0, B.AIR); fill(x0 + 1, y, z1, x0 + 1, y + 3, z1, B.AIR);
    for (const z of [z0, 68, z1]) fill(x0, y, z, x0, y + 3, z, B.LOG); fill(x0, y + 3, z0, x0, y + 3, z1, B.LOG); fill(x1, y + 1, z0 + 2, x1, y + 2, z1 - 2, B.GLASS);
    for (let i = 0; i < 5; i++) fill(x0 - 1 + i * 2, y + 4 + (i > 2 ? 4 - i : i), z0 - 1, x0 + i * 2, y + 4 + (i > 2 ? 4 - i : i), z1 + 1, B.TILE);
    fill(x1 - 1, y, z0 + 1, x1 - 1, y, z1 - 1, B.PLANK); fill(x1 - 1, y + 1, z0 + 1, x1 - 1, y + 2, z0 + 1, B.DARK); set(x1 - 1, y + 1, z1 - 1, B.LAMP);          // bench along the back wall
    fill(x1 - 2, y + 4, z1 - 2, x1 - 1, y + 9, z1 - 1, B.BRICK); set(x0 + 2, y, z0 + 1, B.PLANK); set(x0 + 2, y + 1, z0 + 1, B.PLANK); set(x0 + 3, y, z0 + 1, B.LOG); set(x0 + 2, y, z1 - 1, B.LOG); }
  // ----- regional pavilion: a slab, posts, scaffolding. Honestly unfinished. -----
  { fill(22, G, 65, 33, G, 75, B.PAVE); for (const [x, z] of [[22, 65], [33, 65], [22, 75], [33, 75], [27, 65]]) fill(x, A, z, x, A + 5, z, B.SCAF); fill(22, A + 5, 65, 33, A + 5, 65, B.SCAF); fill(22, A + 5, 75, 33, A + 5, 75, B.SCAF); fill(22, A + 2, 65, 22, A + 2, 75, B.SCAF); fill(22, A + 5, 65, 22, A + 5, 75, B.SCAF);
    fill(25, A, 69, 27, A, 70, B.PLANK); fill(25, A + 1, 69, 26, A + 1, 70, B.PLANK); set(30, A, 72, B.BRICK); set(31, A, 72, B.BRICK); set(30, A + 1, 72, B.BRICK); fill(34, A, 74, 34, A + 9, 74, B.DARK); fill(30, A + 9, 74, 37, A + 9, 74, B.DARK); }
  // ----- the landing: stone pier with timber edge and posts, out over open air -----
  { for (let z = 84; z <= 97; z++) for (let x = 44; x <= 51; x++) { if (!get(x, G, z)) { set(x, G, z, (x === 44 || x === 51 || z === 97) ? B.PLANK : B.PAVE); set(x, G - 1, z, B.STONE2); if ((x + z) % 3 === 0) set(x, G - 2, z, B.STONE3); } }
    for (const z of [86, 91, 96]) for (const x of [44, 51]) { set(x, A, z, B.LOG); } set(44, A + 1, 96, B.LAMP); set(51, A + 1, 96, B.LAMP); }
  // ----- the coffee cart by the plaza -----
  { const x = 56, z = 43; fill(x, A, z, x + 1, A, z, B.PLANK); fill(x, A + 2, z - 1, x + 1, A + 2, z + 1, B.AWNING); set(x, A + 1, z, B.AIR); for (const [a, c] of [[x, z - 1], [x + 1, z - 1]]) { /* open front */ } set(x - 1, A + 1, z, B.AIR); set(x + 1, A + 1, z, B.DARK); }
  // ----- trees: broadleaf in the meadows, blossom by the steps, conifers on the hill -----
  const tree = (x, z, kind) => { const h = top[FI(x, z)]; if (h < 0) return; if (kind === 'pine') { const th = 6 + Math.floor(R() * 3); fill(x, h + 1, z, x, h + th, z, B.LOG); for (let k = 0; k < th; k++) { const rad = k < 2 ? 0 : Math.max(0, 3 - Math.floor((k - 1) / 2)), y = h + 1 + k; for (let a = -rad; a <= rad; a++) for (let b = -rad; b <= rad; b++) if (Math.abs(a) + Math.abs(b) <= rad + (k % 2 ? 0 : 1) && (a || b) && !get(x + a, y, z + b)) set(x + a, y, z + b, B.PINE); } set(x, h + th + 1, z, B.PINE); return; }
    const th = 3 + Math.floor(R() * 3), lt = kind === 'blossom' ? B.BLOSSOM : R() < 0.3 ? B.LEAF2 : B.LEAF, lg = kind === 'blossom' || R() > 0.8 ? B.BIRCH : B.LOG; fill(x, h + 1, z, x, h + th, z, lg); const cy = h + th + 1, r2 = 2 + (R() > 0.55 ? 1 : 0);
    for (let a = -r2; a <= r2; a++) for (let b = -r2; b <= r2; b++) for (let c = -1; c <= 2; c++) if (Math.hypot(a, b, c * 1.35) < r2 - 0.2 + hash(x + a, cy + c, z + b) * 0.9 && !get(x + a, cy + c, z + b)) set(x + a, cy + c, z + b, lt); };
  for (const [x, z] of [[42, 36], [53, 36], [40, 39], [55, 39]]) tree(x, z, 'blossom');
  const spots = [];
  for (let n = 0; n < 2400 && spots.length < 70; n++) { const x = 4 + Math.floor(R() * (W - 8)), z = 4 + Math.floor(R() * (D - 8)), i = FI(x, z), h = top[i];
    if (h < 0 || level[i] !== -99 || wet.has(i) || get(x, h, z) !== B.GRASS && get(x, h, z) !== B.MOSS || rr[i] > 0.9 || spots.some((t) => Math.hypot(t[0] - x, t[1] - z) < 4.4)) continue;
    let near = false; for (let a = -3; a <= 3 && !near; a++) for (let b = -3; b <= 3; b++) { const j = FI(Math.min(W - 1, Math.max(0, x + a)), Math.min(D - 1, Math.max(0, z + b))); if (level[j] !== -99 || wet.has(j)) { near = true; break; } } if (near) continue;
    spots.push([x, z]); tree(x, z, h >= G + 4 ? 'pine' : 'leaf'); }
  for (let n = 0; n < 400; n++) { const x = 4 + Math.floor(R() * (W - 8)), z = 4 + Math.floor(R() * (D - 8)), i = FI(x, z), h = top[i]; if (h < 0 || level[i] !== -99 || wet.has(i) || get(x, h, z) !== B.GRASS || get(x, h + 1, z)) continue; const k = R(); if (k < 0.12) set(x, h + 1, z, B.HEDGE); else if (k < 0.16) set(x, h + 1, z, B.STONE2); }
  // ----- what the player has built -----
  for (const [x, y, z, t] of plot) if (x >= PLOT.x0 && x <= PLOT.x1 && z >= PLOT.z0 && z <= PLOT.z1 && y > PLOT.y && y < PLOT.y + 10) set(x, y, z, t);
  const topSolid = (x, z) => { x = Math.floor(x); z = Math.floor(z); for (let y = H - 1; y >= 0; y--) { const t = get(x, y, z); if (t && t !== B.LEAF && t !== B.LEAF2 && t !== B.BLOSSOM && t !== B.PINE) return y; } return -1; };
  return { data, get, set, top: topSolid, water, falls, wetAt: (x, z) => wet.has(FI(Math.floor(x), Math.floor(z))), grassAt: (x, z) => { const i = FI(x, z); return top[i] >= 0 && level[i] === -99 && !wet.has(i) && get(x, top[i], z) === B.GRASS && !get(x, top[i] + 1, z) ? top[i] : -1; }, edge: (x, z) => rr[FI(Math.max(0, Math.min(W - 1, Math.floor(x))), Math.max(0, Math.min(D - 1, Math.floor(z))))] };
}
const seeThrough = (t) => t === B.AIR || t === B.GLASS;
const LEAFY = new Set([B.LEAF, B.LEAF2, B.HEDGE, B.BLOSSOM, B.PINE]), GLOWY = new Set([B.LAMP, B.CORAL, B.CRYSTAL]);
const FACES = [
  { d: [1, 0, 0], c: [[1, 0, 1], [1, 0, 0], [1, 1, 0], [1, 1, 1]] }, { d: [-1, 0, 0], c: [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]] },
  { d: [0, 1, 0], c: [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]] }, { d: [0, -1, 0], c: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]] },
  { d: [0, 0, 1], c: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]] }, { d: [0, 0, -1], c: [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]] },
];
/** Blocks -> geometry. Hidden faces are never built; each corner carries baked ambient occlusion; four buckets by material. */
export function mesh(world) {
  const { get } = world, out = { solid: bucket(), leaf: bucket(), glass: bucket(), glow: bucket() }, col = new THREE.Color();
  function bucket() { return { p: [], n: [], c: [], i: [] }; }
  for (let y = 0; y < H; y++) for (let z = 0; z < D; z++) for (let x = 0; x < W; x++) {
    const t = get(x, y, z); if (!t) continue;
    const b = t === B.GLASS ? out.glass : LEAFY.has(t) ? out.leaf : GLOWY.has(t) ? out.glow : out.solid;
    for (let f = 0; f < 6; f++) {
      const F = FACES[f], nb = get(x + F.d[0], y + F.d[1], z + F.d[2]);
      if (t === B.GLASS ? nb !== B.AIR : !seeThrough(nb)) continue;
      const base = COL[t][f === 2 ? 'top' : 'side'], patch = 0.94 + 0.12 * noise2(x * 0.19 + 40, z * 0.19 + y * 0.31), v = (0.955 + hash(x, y, z) * 0.09) * (t === B.GRASS || LEAFY.has(t) ? patch : 1), chk = t === B.PAVE && ((x + z) & 1) ? 0.955 : 1, strip = t === B.AWNING && f !== 2 && (x & 1) ? 1 : 1;
      const ao = [], start = b.p.length / 3, ax = F.d[0] ? 0 : F.d[1] ? 1 : 2, u = (ax + 1) % 3, w = (ax + 2) % 3;
      for (let k = 0; k < 4; k++) {
        const c = F.c[k]; b.p.push(x + c[0], y + c[1], z + c[2]); b.n.push(F.d[0], F.d[1], F.d[2]);
        const o = [x + F.d[0], y + F.d[1], z + F.d[2]], su = c[u] ? 1 : -1, sw = c[w] ? 1 : -1, A = [...o], Bn = [...o], Cn = [...o]; A[u] += su; Bn[w] += sw; Cn[u] += su; Cn[w] += sw;
        const s1 = !seeThrough(get(A[0], A[1], A[2])), s2 = !seeThrough(get(Bn[0], Bn[1], Bn[2])), cc = !seeThrough(get(Cn[0], Cn[1], Cn[2])), a = s1 && s2 ? 0 : 3 - (s1 + s2 + cc);
        ao.push(a); col.copy(base).multiplyScalar((0.66 + 0.113 * a) * v * chk * strip); b.c.push(col.r, col.g, col.b);
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
  while (t < maxDist) { if (world.get(x, y, z)) return { hit: [x, y, z], before: prev, type: world.get(x, y, z), dist: t }; prev = [x, y, z]; const a = tM[0] < tM[1] ? (tM[0] < tM[2] ? 0 : 2) : (tM[1] < tM[2] ? 1 : 2); t = tM[a]; tM[a] += tD[a]; if (a === 0) x += st[0]; else if (a === 1) y += st[1]; else z += st[2]; if (y < -4 || y >= H + 30) break; }
  return null;
}
