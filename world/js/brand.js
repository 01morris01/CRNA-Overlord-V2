// brand.js: Overlord's identity as drawn things. One idea, used sparingly: a form cut by a section plane, with the part
// below the plane shifted a little along it. It is the O of the wordmark, the mark, the hairline under headings, the
// wipe between walking and examining, the plates beside doors and the patch on a sleeve.
import * as THREE from 'three';

export const TOKENS = { stone: '#EAE6DF', concrete: '#C9C5BD', charcoal: '#16181B', ink: '#0B0C0E', paper: '#F4F4F2', brass: '#C89B55', coral: '#FF5A3C', bone: '#DDD3BD' };
let uid = 0;
const LETTERS = [   // monoline capitals on a 40-unit cap height; [path or circle, advance]
  ['<circle cx="20" cy="32" r="18.7"/>', 40], ['<path d="M0 12 L17 52 L34 12"/>', 34], ['<path d="M24 12 H0 V52 H24 M0 32 H19"/>', 24], ['<path d="M0 52 V12 H15 A10 10 0 0 1 15 32 H0 M14 32 L27 52"/>', 28],
  ['<path d="M0 12 V52 H22"/>', 22], ['<circle cx="20" cy="32" r="18.7"/>', 40], ['<path d="M0 52 V12 H15 A10 10 0 0 1 15 32 H0 M14 32 L27 52"/>', 28], ['<path d="M0 12 H10 A20 20 0 0 1 10 52 H0 Z"/>', 30],
];
function cut(inner, w, { ink, accent, weight, line = true }) {
  const id = 'ov' + (uid++);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 64" fill="none" stroke="${ink}" stroke-width="${weight}" stroke-linecap="square" stroke-linejoin="miter" role="img" aria-label="Overlord">`
    + `<defs><clipPath id="${id}a"><rect x="-12" y="0" width="${w + 24}" height="36.2"/></clipPath><clipPath id="${id}b"><rect x="-12" y="38.2" width="${w + 24}" height="26"/></clipPath><g id="${id}w">${inner}</g></defs>`
    + `<use href="#${id}w" clip-path="url(#${id}a)"/><g clip-path="url(#${id}b)"><use href="#${id}w" transform="translate(3 0)"/></g>`
    + (line ? `<line x1="0" y1="37.2" x2="${w}" y2="37.2" stroke="${accent}" stroke-width="1"/>` : '') + '</svg>';
}
/** The wordmark: OVERLORD, cut at one height, the lower part shifted along the cut. */
export function wordmarkSVG({ ink = TOKENS.paper, accent = TOKENS.coral, weight = 2.6 } = {}) {
  let x = 10, g = ''; for (const [d, adv] of LETTERS) { g += `<g transform="translate(${x} 0)">${d}</g>`; x += adv + 11; }
  return cut(g, x - 1, { ink, accent, weight });
}
/** The mark: the wordmark's O on its own. */
export function markSVG({ ink = TOKENS.paper, accent = TOKENS.coral, weight = 3 } = {}) { return cut('<g transform="translate(12 0)"><circle cx="20" cy="32" r="18.7"/></g>', 64, { ink, accent, weight }); }
/** A sleeve patch: the mark in a rounded field. `series` adds one short tick per completed series (none yet = plain). */
export function patchSVG({ field = TOKENS.charcoal, ink = TOKENS.paper, accent = TOKENS.coral, series = 0 } = {}) {
  const ticks = Array.from({ length: Math.min(series, 4) }, (_, i) => `<rect x="${24 + i * 9}" y="80" width="5" height="2.4" fill="${accent}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect x="3" y="3" width="90" height="90" rx="22" fill="${field}" stroke="${ink}" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="2.2 2.2"/><g transform="translate(16 14)">${markSVG({ ink, accent }).replace(/^<svg[^>]*>/, '<g fill="none" stroke="' + ink + '" stroke-width="3" stroke-linecap="square">').replace(/<\/svg>$/, '</g>')}</g>${ticks}</svg>`;
}
const img = (svg) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });
function tex(canvas, srgb = true) { const t = new THREE.CanvasTexture(canvas); t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.anisotropy = 8; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; return t; }
/** Words engraved on a brass plate: dark, slightly soft, over nothing (the plate itself is modeled). */
export async function plateTexture(text, w, h, { px = 1024, color = 'rgba(20,14,6,.9)' } = {}) {
  await document.fonts.load('500 40px "Inter Tight"').catch(() => {}); const c = document.createElement('canvas'); c.width = px; c.height = Math.max(32, Math.round(px * h / w)); const g = c.getContext('2d'), H = c.height;
  const fs = Math.min(H * 0.5, px / (text.length * 0.78)); g.font = `500 ${fs}px "Inter Tight", system-ui, sans-serif`; g.fillStyle = color; g.textBaseline = 'middle'; if ('letterSpacing' in g) g.letterSpacing = (fs * 0.2) + 'px';
  const tw = g.measureText(text).width; g.fillText(text, (px - tw) / 2 + fs * 0.1, H * 0.5); g.fillRect(H * 0.3, H * 0.86, px - H * 0.6, Math.max(1, H * 0.018));
  return tex(c);
}
/** The wordmark as raised brass letters for the façade: color map with alpha. */
export async function wordmarkTexture(px = 2048) { const svg = wordmarkSVG({ ink: '#ffffff', accent: '#ffffff', weight: 3.1 }), i = await img(svg), c = document.createElement('canvas'); c.width = px; c.height = Math.round(px * 64 / 342); c.getContext('2d').drawImage(i, 0, 0, c.width, c.height); return tex(c); }
/** Any drawing made by a function, as a texture (signs, the lightbox, the case rail). */
export function drawTexture(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return tex(c); }
export const svgImage = img;
