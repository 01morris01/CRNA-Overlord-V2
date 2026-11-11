#!/usr/bin/env python
"""Step 4b''. Numbers behind the exclusion rules: sheet-equivalent thickness (4 x mean inside-distance), HU contrast to the
surrounding shell, enclosed cavities, and the overlaps / seams between the airway lumen classes.
The thickness index over-reads thin slabs by about 1.5 mm (index 3.0 -> 1.5 mm, 4.0 -> 2.25, 4.5 -> 3.0, 5.4 -> 3.75).

    $HN_PY -I tools/headneck/13c_thickness_contrast_seams.py
"""
import os, json, numpy as np, nibabel as nib
from scipy import ndimage as ndi
W=os.environ['HN_WORK']; M=W+'/masks'
ct=nib.load(W+'/data/s0527/ct_075.nii.gz'); A=ct.affine; C=np.asanyarray(ct.dataobj).astype(np.float32)
labels=json.load(open(M+'/labels.json'))['tasks']
def L(task,name): return np.asanyarray(nib.load(f'{M}/{task}/{name}.nii.gz').dataobj)>0
cands={'head_glands_cavities':['nasopharynx','oropharynx','hypopharynx','soft_palate','hard_palate','submandibular_gland_left','submandibular_gland_right'],
'headneck_bones_vessels':['larynx_air','thyroid_cartilage','cricoid_cartilage','hyoid','internal_carotid_artery_left','internal_carotid_artery_right','internal_jugular_vein_left','internal_jugular_vein_right','styloid_process_left'],
'total':['trachea','esophagus','thyroid_gland','common_carotid_artery_left','common_carotid_artery_right','subclavian_artery_left','subclavian_artery_right','brachiocephalic_trunk','brachiocephalic_vein_left','brachiocephalic_vein_right'],
'headneck_muscles':['sternocleidomastoid_left','sternocleidomastoid_right','anterior_scalene_left','anterior_scalene_right','middle_scalene_left','middle_scalene_right','posterior_scalene_left','posterior_scalene_right','levator_scapulae_left','levator_scapulae_right','prevertebral_left','prevertebral_right','sterno_thyroid_left','sterno_thyroid_right','thyrohyoid_left','thyrohyoid_right','inferior_pharyngeal_constrictor','middle_pharyngeal_constrictor','superior_pharyngeal_constrictor','platysma_left','platysma_right'],
'head_muscles':['tongue','masseter_left','medial_pterygoid_left','lateral_pterygoid_left','digastric_left']}
print(f"{'structure':34} {'mL':>7} {'t_sheet':>7} {'p95 2*EDT':>9} {'cavities':>8} {'HU in':>6} {'HU shell':>8} {'contrast':>8}")
for task,names in cands.items():
    for n in names:
        m=L(task,n); ii,jj,kk=np.nonzero(m)
        sl=tuple(slice(max(a.min()-6,0),a.max()+7) for a in (ii,jj,kk))
        s=m[sl]; c=C[sl]
        edt=ndi.distance_transform_edt(s,sampling=0.75)
        ts=4*edt[s].mean(); p95=2*np.percentile(edt[s],95)
        filled=ndi.binary_fill_holes(s); cav=int((filled&~s).sum())
        shell=ndi.binary_dilation(s,iterations=3)&~ndi.binary_dilation(s,iterations=1)
        print(f"{n:34} {m.sum()*0.421875/1000:7.2f} {ts:7.2f} {p95:9.2f} {cav:8d} {c[s].mean():6.0f} {c[shell].mean():8.0f} {c[s].mean()-c[shell].mean():8.0f}")
# airway junctions
names=[('head_glands_cavities','nasopharynx'),('head_glands_cavities','oropharynx'),('head_glands_cavities','hypopharynx'),('headneck_bones_vessels','larynx_air'),('total','trachea')]
ms={n:L(t,n) for t,n in names}
print('\nairway overlaps / adjacency (voxels overlapping; touching after 1-voxel dilation):')
ks=list(ms)
for a in range(len(ks)):
    for b in range(a+1,len(ks)):
        ov=int((ms[ks[a]]&ms[ks[b]]).sum()); adj=int((ndi.binary_dilation(ms[ks[a]])&ms[ks[b]]).sum())
        if ov or adj: print(f'  {ks[a]} x {ks[b]}: overlap {ov}, touching {adj}')
for n in ks:
    kk=np.nonzero(ms[n])[2]; print(f'  {n}: S range {A[2,3]+0.75*kk.min():.1f} .. {A[2,3]+0.75*kk.max():.1f} mm; frac HU>=-400: {(C[ms[n]]>=-400).mean():.3f}; frac HU>=-200: {(C[ms[n]]>=-200).mean():.3f}')
union=np.zeros_like(ms['trachea'])
for n in ks: union|=ms[n]
lab,nc=ndi.label(union,structure=np.ones((3,3,3))); print('  union components',nc,sorted([int((lab==i).sum()) for i in range(1,nc+1)],reverse=True)[:5])
air=C<-400
u2=union&air; lab,nc=ndi.label(u2,structure=np.ones((3,3,3))); print('  union & HU<-400 components',nc,sorted([int((lab==i).sum()) for i in range(1,nc+1)],reverse=True)[:8])
