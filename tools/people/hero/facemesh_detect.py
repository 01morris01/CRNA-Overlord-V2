"""facemesh_detect.py IMAGE OUT.json: MediaPipe Face Mesh (Apache-2.0) on one image; writes 478 landmarks as pixel
coordinates. Run with: uv run --python 3.12 --with mediapipe==0.10.14 --with numpy --with pillow python facemesh_detect.py ...
Used only as a measuring tool on our own clay renders: nothing from it ships in the asset."""
import sys, json
import numpy as np
from PIL import Image
import mediapipe as mp
img = np.asarray(Image.open(sys.argv[1]).convert('RGB'))
fm = mp.solutions.face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True, min_detection_confidence=0.15)
res = fm.process(img)
out = {'size': [img.shape[1], img.shape[0]], 'found': bool(res.multi_face_landmarks)}
if res.multi_face_landmarks:
    lm = res.multi_face_landmarks[0].landmark
    out['points'] = [[p.x * img.shape[1], p.y * img.shape[0], p.z * img.shape[1]] for p in lm]
json.dump(out, open(sys.argv[2], 'w'))
print('facemesh', sys.argv[1], 'found' if out['found'] else 'NOT FOUND', len(out.get('points', [])))
