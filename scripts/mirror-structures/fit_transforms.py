"""Step 1: decode the mirror page's own skull and muscle meshes and fit BodyParts3D 4.0 and 3.0 onto them.
Writes T_v4.npz and T_v3.npz (scale, rotation, translation) into the work folder."""
import os, sys, re, json, base64
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from meshio_ import WORK, load_obj, load_stl, by_name
page = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../world/mirror/x-ray-mirror.html')
s = open(page).read()
meta = json.loads(re.search(r'<script id="meshmeta" type="application/json">(.*?)</script>', s, re.S).group(1))
b = base64.b64decode(re.search(r'<script id="meshdata" type="application/octet-stream">(.*?)</script>', s, re.S).group(1).strip())
out = {}
for m in meta['meshes']:
    q = np.frombuffer(b, dtype='<u2', count=m['nv'] * 3, offset=m['offV']).reshape(-1, 3).astype(np.float64)
    out[m['name'] + '_v'] = np.array(m['min']) + q / 65535 * np.array(m['size'])
    out[m['name'] + '_f'] = np.frombuffer(b, dtype='<u2', count=m['ni'], offset=m['offI']).reshape(-1, 3)
np.savez(os.path.join(WORK, 'mirror_meshes.npz'), **out)
from align import icp
bones = '^(frontal bone|occipital bone|sphenoid bone|ethmoid|vomer|(right|left) (parietal bone|temporal bone|nasal bone|maxilla|zygomatic bone|lacrimal bone|palatine bone))$'
src = np.vstack([load_obj(k)[0] for k in by_name(bones)])
s4, R4, t4, d4 = icp(src, out['cranium_v'])
np.savez(os.path.join(WORK, 'T_v4.npz'), s=s4, R=R4, t=t4)
print('BodyParts3D 4.0 skull onto mirror cranium: median residual %.2f mm' % (np.median(d4) * 10))
ids = ['FMA49007', 'FMA49008', 'FMA49001', 'FMA49002', 'FMA46759', 'FMA46760', 'FMA46841', 'FMA46835', 'FMA46836']
src = np.vstack([load_stl(k)[0] for k in ids])
s3, R3, t3, d3 = icp(src, out['muscles_v'])
np.savez(os.path.join(WORK, 'T_v3.npz'), s=s3, R=R3, t=t3)
print('BodyParts3D 3.0 face muscles onto mirror muscles: median residual %.2f mm' % (np.median(d3) * 10))
