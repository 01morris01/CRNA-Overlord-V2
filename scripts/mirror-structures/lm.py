import sys; import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *
AX={'x':0,'y':1,'z':2}
def pick(pat,fix,along,mode='min',r=3.0,mesh=None):
    """fix: dict of two axis values; returns point on mesh verts within r of the line, extreme along `along`"""
    v=mesh if mesh is not None else concept(pat)[0]
    m=np.ones(len(v),bool)
    for k,val in fix.items(): pass
    d=np.zeros(len(v))
    for k,val in fix.items(): d+= (v[:,AX[k]]-val)**2
    sel=v[np.sqrt(d)<r]
    if len(sel)==0: raise ValueError(f'no verts near {fix} on {pat}')
    i=AX[along]
    if mode=='min': p=sel[np.argmin(sel[:,i])]
    elif mode=='max': p=sel[np.argmax(sel[:,i])]
    else: p=np.median(sel,0)
    out=np.array([0.,0,0]); 
    for k,val in fix.items(): out[AX[k]]=val
    out[i]=p[i] if mode!='med' else p[i]
    return out
def ext(pat,mask_fn,along,mode='min'):
    v=concept(pat)[0]; s=v[mask_fn(v)]; i=AX[along]
    return s[np.argmin(s[:,i])] if mode=='min' else s[np.argmax(s[:,i])]
MID=-0.5
def mirror(p): p=np.array(p,float).copy(); p[0]=2*MID-p[0]; return p
