#!/usr/bin/env python
"""Step 2d'. Axial montage of one candidate CT (exploratory helper used while choosing the scan).

    $HN_PY -I tools/headneck/07b_axial_montage.py ct.nii.gz out.png k0 k1 step [level width] [crop_mm]
"""
import sys, numpy as np, nibabel as nib, matplotlib
matplotlib.use('Agg'); import matplotlib.pyplot as plt
path,out,k0,k1,step=sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4]),int(sys.argv[5])
lv=float(sys.argv[6]) if len(sys.argv)>6 else 40; wd=float(sys.argv[7]) if len(sys.argv)>7 else 400
crop=float(sys.argv[8]) if len(sys.argv)>8 else 0
im=nib.as_closest_canonical(nib.load(path)); v=np.asanyarray(im.dataobj).astype(np.float32); zx,zy,zz=im.header.get_zooms()[:3]
ks=list(range(k0,k1,step)); n=len(ks); cols=min(6,n); rows=(n+cols-1)//cols
fig,axs=plt.subplots(rows,cols,figsize=(cols*3.6,rows*3.6),facecolor='black'); axs=np.atleast_1d(axs).ravel()
for a in axs: a.axis('off')
for a,k in zip(axs,ks):
    s=v[::-1,:,k].T
    if crop>0:
        body=s>-300
        if body.sum()>0:
            ys,xs=np.nonzero(body); cy,cx=int(ys.mean()),int(xs.mean())
            hy=int(crop/2/zy); hx=int(crop/2/zx)
            s=s[max(cy-hy,0):cy+hy, max(cx-hx,0):cx+hx]
    a.imshow(np.clip((s-(lv-wd/2))/wd,0,1),cmap='gray',origin='lower',aspect=zy/zx,vmin=0,vmax=1)
    a.set_title(f'k={k} z={k*zz:.0f}mm',color='w',fontsize=9); a.text(0.02,0.5,'R',color='yellow',transform=a.transAxes)
fig.savefig(out,dpi=60,facecolor='black',bbox_inches='tight'); print('wrote',out)
