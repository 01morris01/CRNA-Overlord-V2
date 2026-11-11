#!/usr/bin/env python
"""Step 4b'. Zoomed axial slices with mask outlines (targeted look at a doubtful region, e.g. the left IJV gap).

    $HN_PY -I tools/headneck/13b_zoom_overlay.py out.png k0 k1 step ci cj half level width task:class:colour [...]
    e.g. ... review/raw/ijv_left_gap.png 146 184 2 45 150 34 90 260 headneck_bones_vessels:internal_jugular_vein_left:yellow total:common_carotid_artery_left:red headneck_muscles:sternocleidomastoid_left:cyan
"""
import os, sys, numpy as np, nibabel as nib, matplotlib
matplotlib.use('Agg'); import matplotlib.pyplot as plt
from scipy import ndimage as ndi
W=os.environ['HN_WORK']; M=W+'/masks'
ct=nib.load(W+'/data/s0527/ct_075.nii.gz'); A=ct.affine; C=np.asanyarray(ct.dataobj).astype(np.float32)
def L(task,name): return np.asanyarray(nib.load(f'{M}/{task}/{name}.nii.gz').dataobj)>0
specs=json_specs=sys.argv[2:]
# args: out  k0 k1 step  ci cj half  level width  task:name[:color] ...
out=sys.argv[1]; k0,k1,step=int(sys.argv[2]),int(sys.argv[3]),int(sys.argv[4]); ci,cj,half=int(sys.argv[5]),int(sys.argv[6]),int(sys.argv[7]); lv,wd=float(sys.argv[8]),float(sys.argv[9])
masks=[]
for s in sys.argv[10:]:
    t,n,c=s.split(':'); masks.append((n,L(t,n),c))
ks=list(range(k0,k1+1,step)); cols=min(6,len(ks)); rows=(len(ks)+cols-1)//cols
fig,axs=plt.subplots(rows,cols,figsize=(cols*3.3,rows*3.3),facecolor='black'); axs=np.atleast_1d(axs).ravel()
for a in axs: a.axis('off')
for a,k in zip(axs,ks):
    i0,i1,j0,j1=max(ci-half,0),min(ci+half,C.shape[0]),max(cj-half,0),min(cj+half,C.shape[1])
    s=C[i0:i1,j0:j1,k][::-1].T   # flip i so patient right is on viewer left
    a.imshow(np.clip((s-(lv-wd/2))/wd,0,1),cmap='gray',origin='lower',vmin=0,vmax=1,interpolation='bilinear')
    for n,m,c in masks:
        mm=m[i0:i1,j0:j1,k][::-1].T
        if mm.any(): a.contour(mm.astype(float),levels=[0.5],colors=[c],linewidths=1.0)
    a.set_title(f'k={k} S={A[2,3]+0.75*k:.1f}',color='w',fontsize=9)
fig.savefig(out,dpi=62,facecolor='black',bbox_inches='tight'); print('wrote',out)
