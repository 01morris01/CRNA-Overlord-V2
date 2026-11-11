#!/usr/bin/env python
"""Step 4b'''. Does the image support bridging the 8 mm gap in the left internal jugular vein mask? (It does not: HU along the
interpolated path falls to muscle level.)

    $HN_PY -I tools/headneck/13d_ijv_gap_test.py
"""
import os, numpy as np, nibabel as nib
from scipy import ndimage as ndi
W=os.environ['HN_WORK']; M=W+'/masks'
ct=nib.load(W+'/data/s0527/ct_075.nii.gz'); C=np.asanyarray(ct.dataobj).astype(np.float32)
def L(task,name): return np.asanyarray(nib.load(f'{M}/{task}/{name}.nii.gz').dataobj)>0
ijv=L('headneck_bones_vessels','internal_jugular_vein_left'); cca=L('total','common_carotid_artery_left'); scm=L('headneck_muscles','sternocleidomastoid_left')
print('IJV HU in mask: mean',C[ijv].mean(),'p10,p50,p90',np.percentile(C[ijv],[10,50,90]))
print('SCM HU: p10,p50,p90',np.percentile(C[scm],[10,50,90]))
# HU along interpolated centre line
p0=np.array([56.6,160.5,160.0]); p1=np.array([48.1,151.3,172.0])
for t in np.linspace(-0.4,1.4,10):
    p=p0+t*(p1-p0); i,j,k=[int(round(x)) for x in p]
    box=C[i-3:i+4,j-3:j+4,k]
    print(f't={t:+.2f} k={k} centre HU {C[i,j,k]:.0f} box mean {box.mean():.0f} max {box.max():.0f}  inIJV {bool(ijv[i,j,k])}')
# candidate bridge: voxels in a 12mm-radius tube around the line, 65<HU<140, not CCA(dilated), connected to both IJV parts
ii,jj,kk=np.mgrid[0:C.shape[0],0:C.shape[1],0:C.shape[2]]
sl=(slice(25,85),slice(125,190),slice(150,185))
sub=C[sl]; cand=(sub>66)&(sub<140)&~ndi.binary_dilation(cca[sl],iterations=2)
seed=ijv[sl]
lab,n=ndi.label(cand|seed)
labs_low=set(np.unique(lab[:,:,:11][seed[:,:,:11]]))-{0}; labs_high=set(np.unique(lab[:,:,22:][seed[:,:,22:]]))-{0}
print('components touching lower part',labs_low,'upper part',labs_high,'common',labs_low&labs_high)
for l in labs_low&labs_high:
    comp=lab==l; print(' connected candidate component size',int(comp.sum()),'vs IJV voxels in box',int(seed.sum()))
