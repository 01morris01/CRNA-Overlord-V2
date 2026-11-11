#!/usr/bin/env python
"""Step 7b. Picture check of the exported (defaced) slice volume: outer surface from anterior / left / right, and slices with the
blanked region outlined. Reads review/volume/ct_exported_hu.npy and blank_mask.npy written by 20_export_volume.py.

    $HN_PY -I tools/headneck/20b_deface_check.py $HN_WORK/review/volume/deface_check.png
"""
import os, sys, numpy as np, matplotlib
matplotlib.use('Agg'); import matplotlib.pyplot as plt
W=os.environ['HN_WORK']; C=W+'/review/volume'
v=np.load(C+'/ct_exported_hu.npy').astype(np.float32); blank=np.load(C+'/blank_mask.npy')
ni,nj,nk=v.shape
def depth(vol, axis, rev):
    body=vol>-300
    b=np.moveaxis(body,axis,0)
    if rev: b=b[::-1]
    first=np.argmax(b,axis=0).astype(np.float32); hit=b.any(axis=0)
    d=np.where(hit, first*1.5, np.nan)
    g0,g1=np.gradient(np.nan_to_num(d,nan=np.nanmax(d)))
    n=np.dstack([-g0,-g1,np.ones_like(g0)*1.5]); n/=np.linalg.norm(n,axis=2,keepdims=True)
    l=np.array([0.3,0.4,0.85]); l/=np.linalg.norm(l); sh=np.clip(n@l,0,1); sh[~hit]=0
    return sh
fig,axs=plt.subplots(2,4,figsize=(18,10),facecolor='black'); axs=axs.ravel()
a=depth(v,1,True)   # from anterior: axes (i,k)
axs[0].imshow(a[::-1].T,cmap='gray',origin='lower'); axs[0].set_title('exported volume: surface from ANTERIOR (patient R on viewer left)',color='w',fontsize=9)
a=depth(v,0,False)  # from patient left (i=0 side is patient left since i->R): looking from -R ... axes (j,k)
axs[1].imshow(a.T,cmap='gray',origin='lower'); axs[1].set_title('surface from patient LEFT (anterior to the right)',color='w',fontsize=9)
a=depth(v,0,True)
axs[2].imshow(a[::-1].T,cmap='gray',origin='lower'); axs[2].set_title('surface from patient RIGHT (anterior to the left)',color='w',fontsize=9)
w=lambda s:np.clip((s+160)/400,0,1)
i=int(round((5.12-(-66.8309))/1.5))
axs[3].imshow(w(v[i,:,:].T),cmap='gray',origin='lower'); axs[3].contour(blank[i,:,:].T.astype(float),levels=[0.5],colors=['red'],linewidths=0.6); axs[3].set_title(f'mid-sagittal i={i} (blanked region outlined)',color='w',fontsize=9)
for a_,k in zip(axs[4:],[122,140,158,178]):
    a_.imshow(w(v[::-1,:,k].T),cmap='gray',origin='lower'); a_.contour(blank[::-1,:,k].T.astype(float),levels=[0.5],colors=['red'],linewidths=0.6); a_.set_title(f'axial k={k} S={26.5901+1.5*k:.0f} mm (R on viewer left)',color='w',fontsize=9)
for a_ in axs: a_.axis('off')
fig.savefig(sys.argv[1],dpi=62,facecolor='black',bbox_inches='tight')
