#!/usr/bin/env python
"""Step 2d'''. Shaded depth map of the anterior skin surface of a CT (to judge whether the publisher's face blurring left a recognisable face).
Output stays in the work area.

    $HN_PY -I tools/headneck/07d_anterior_surface.py ct.nii.gz out.png [threshold_HU]
"""
import sys, numpy as np, nibabel as nib, matplotlib
matplotlib.use('Agg'); import matplotlib.pyplot as plt
im=nib.load(sys.argv[1]); v=np.asanyarray(im.dataobj).astype(np.float32); vox=im.header.get_zooms()[0]
thr=float(sys.argv[3]) if len(sys.argv)>3 else -300
body=v>thr
ny=v.shape[1]
# first hit from anterior (j max) going posterior
rev=body[:,::-1,:]
first=np.argmax(rev,axis=1).astype(np.float32); hit=rev.any(axis=1)
depth=np.where(hit, first*vox, np.nan)   # mm from anterior image edge
# shading from gradient
gx,gz=np.gradient(np.nan_to_num(depth,nan=np.nanmax(depth)))
n=np.dstack([-gx,-gz,np.ones_like(gx)*1.5]); n/=np.linalg.norm(n,axis=2,keepdims=True)
light=np.array([0.3,0.4,0.85]); light/=np.linalg.norm(light)
sh=np.clip((n@light),0,1); sh[~hit]=0
fig,axs=plt.subplots(1,2,figsize=(10,10),facecolor='black')
axs[0].imshow(sh[::-1].T,cmap='gray',origin='lower'); axs[0].set_title('anterior surface (shaded)  patient R on viewer left',color='w')
axs[1].imshow(depth[::-1].T,cmap='viridis_r',origin='lower'); axs[1].set_title('depth mm',color='w')
for a in axs: a.axis('off')
fig.savefig(sys.argv[2],dpi=80,facecolor='black',bbox_inches='tight'); print('wrote',sys.argv[2])
