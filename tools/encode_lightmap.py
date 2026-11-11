"""encode_lightmap.py LIGHTMAP.npy OUT_DIR: turn the baked light (linear float, top row first) into the images the browser loads.
Encoding: value / RANGE through the sRGB curve into 8 bits, with a half-step of noise before rounding so that slow gradients
do not band. The browser's texture sampler undoes the curve; the material multiplies by RANGE * pi (irradiance for a white surface)."""
import sys, os, json, numpy as np
from PIL import Image
src, out = sys.argv[1], sys.argv[2]; RANGE = 6.0
a = np.load(src).astype(np.float32); H, W, _ = a.shape; rng = np.random.default_rng(7)
def enc(x):
    v = np.clip(x / RANGE, 0, 1); s = np.where(v <= 0.0031308, v * 12.92, 1.055 * np.power(np.maximum(v, 1e-8), 1 / 2.4) - 0.055)
    return np.clip(np.floor(s * 255 + rng.random(s.shape, dtype=np.float32)), 0, 255).astype(np.uint8)
def dec(b):
    s = b.astype(np.float32) / 255; return np.where(s <= 0.04045, s / 12.92, np.power((s + 0.055) / 1.055, 2.4)) * RANGE
full = enc(a); Image.fromarray(full, 'RGB').save(os.path.join(out, 'lightmap.jpg'), quality=94, subsampling=0)
half = a.reshape(H // 2, 2, W // 2, 2, 3).mean(axis=(1, 3)); Image.fromarray(enc(half), 'RGB').save(os.path.join(out, 'lightmap-2k.jpg'), quality=93, subsampling=0)
back = dec(np.asarray(Image.open(os.path.join(out, 'lightmap.jpg')).convert('RGB'))); err = np.abs(back - np.clip(a, 0, RANGE))
Image.fromarray(enc(a.reshape(H // 8, 8, W // 8, 8, 3).mean(axis=(1, 3)) * 3.0), 'RGB').save(os.path.join(out, '_lightmap_preview.png'))
info = {'range': RANGE, 'size': W, 'clipped_fraction': float((a.max(axis=2) > RANGE).mean()), 'mean_abs_error': float(err.mean()), 'p99_abs_error': float(np.percentile(err, 99)), 'empty_fraction': float((a.max(axis=2) <= 0).mean())}
print(json.dumps(info)); print({f: os.path.getsize(os.path.join(out, f)) for f in ('lightmap.jpg', 'lightmap-2k.jpg')})
