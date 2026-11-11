#!/usr/bin/env python
"""Step 2d''. Screening sheet (sagittal + coronal per candidate) used to compare the 17 Zenodo neck candidates.

    $HN_PY -I tools/headneck/07c_screening_sheet.py out.png <cand>/ct.nii.gz [...]
"""
import sys, glob, os, numpy as np, nibabel as nib, matplotlib
matplotlib.use('Agg'); import matplotlib.pyplot as plt
files=sys.argv[2:]; out=sys.argv[1]
n=len(files); cols=6; rows=(n*2+cols-1)//cols
fig,axs=plt.subplots(rows,cols,figsize=(cols*3.4,rows*3.6),facecolor='black'); axs=axs.ravel()
for a in axs: a.axis('off')
i=0
for f in files:
    sid=f.split('/')[-2]
    im=nib.as_closest_canonical(nib.load(f)); v=np.asanyarray(im.dataobj).astype(np.float32); z=im.header.get_zooms()[:3]
    nx,ny,nz=v.shape
    body=v>-300
    # midline from bone (>300 HU) centroid in x
    bone=v>300
    cx=int(round((bone.sum(axis=(1,2))*np.arange(nx)).sum()/max(bone.sum(),1)))
    cy=int(round((body.sum(axis=(0,2))*np.arange(ny)).sum()/max(body.sum(),1)))
    w=lambda s:(np.clip((s-(-160))/400,0,1))
    axs[i].imshow(w(v[cx,:,:].T),cmap='gray',origin='lower',vmin=0,vmax=1); axs[i].set_title(f'{sid} sag x={cx} {nz*z[2]:.0f}mm',color='w',fontsize=9); i+=1
    axs[i].imshow(w(v[::-1,cy,:].T),cmap='gray',origin='lower',vmin=0,vmax=1); axs[i].set_title(f'{sid} cor y={cy}',color='w',fontsize=9); i+=1
fig.savefig(out,dpi=55,facecolor='black',bbox_inches='tight'); print('wrote',out)
