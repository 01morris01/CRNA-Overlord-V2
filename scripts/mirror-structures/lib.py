import sys; import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from meshio_ import *
import numpy as np, re, functools
import fast_simplification
@functools.lru_cache(None)
def concept(pat):
    """union of all v4 elements whose name matches pat"""
    ks=by_name(pat); V=[];F=[];o=0
    for k in sorted(ks):
        v,f=load_obj(k); V.append(v); F.append(f+o); o+=len(v)
    if not V: raise KeyError(pat)
    return np.vstack(V),np.vstack(F)
def deci(v,f,target=3000):
    if len(f)<=target: return v,f
    import trimesh
    m=trimesh.Trimesh(v,f,process=True); v,f=np.asarray(m.vertices),np.asarray(m.faces)
    if len(f)<=target: return v,f
    vv,ff=fast_simplification.simplify(v.astype(np.float32),f.astype(np.int32),target_reduction=1-target/len(f))
    return vv,ff
def render(meshes,pins=(),views=('right','front','below','above','back'),out='r.png',size=4,lines=()):
    import matplotlib; matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    from mpl_toolkits.mplot3d.art3d import Poly3DCollection
    VW={'right':(0,180),'left':(0,0),'front':(0,-90),'back':(0,90),'below':(-89,-90),'above':(89,-90),'rfb':(-35,-150)}
    fig=plt.figure(figsize=(size*len(views),size))
    allv=np.vstack([m[0] for m in meshes]+[np.array(p).reshape(-1,3) for p in pins] if pins else [m[0] for m in meshes])
    c=(allv.min(0)+allv.max(0))/2; r=(allv.max(0)-allv.min(0)).max()/2
    for i,vw in enumerate(views):
        ax=fig.add_subplot(1,len(views),i+1,projection='3d'); ax.set_proj_type('ortho')
        for m in meshes:
            v,f=deci(m[0],m[1],m[3] if len(m)>3 else 2500)
            ax.add_collection3d(Poly3DCollection(v[f],facecolor=m[2],edgecolor='none',alpha=0.35))
        for p in pins:
            p=np.array(p).reshape(-1,3); ax.scatter(p[:,0],p[:,1],p[:,2],c='red',s=40,depthshade=False)
        for ln in lines:
            ln=np.array(ln); ax.plot(ln[:,0],ln[:,1],ln[:,2],c='red',lw=2)
        ax.set_xlim(c[0]-r,c[0]+r); ax.set_ylim(c[1]-r,c[1]+r); ax.set_zlim(c[2]-r,c[2]+r)
        ax.view_init(*VW[vw]); ax.set_title(vw); ax.axis('off')
    plt.tight_layout(); plt.savefig(out,dpi=70); plt.close()
def view2d(meshes,axes=('x','y'),zsel=None,out='v.png',pins=(),grid=5,size=9,lim=None,label_pins=True):
    """orthographic 2D projection with grid in mm; meshes drawn as triangles sorted by depth"""
    import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
    from matplotlib.collections import PolyCollection
    ai={'x':0,'y':1,'z':2}; a,b=ai[axes[0]],ai[axes[1]]; d=3-a-b
    fig,ax=plt.subplots(figsize=(size,size))
    polys=[];cols=[];depth=[]
    for m in meshes:
        v,f=deci(m[0],m[1],m[3] if len(m)>3 else 6000)
        n=np.cross(v[f[:,1]]-v[f[:,0]],v[f[:,2]]-v[f[:,0]]); n/=np.linalg.norm(n,axis=1,keepdims=True)+1e-9
        shade=0.45+0.55*np.abs(n[:,d])
        import matplotlib.colors as mc; base=np.array(mc.to_rgb(m[2]))
        for t,s in zip(f,shade):
            polys.append(v[t][:,[a,b]]); cols.append((*(base*s),0.9)); depth.append(v[t][:,d].mean())
    sign=1 if len(axes)<3 else axes[2]
    o=np.argsort(np.array(depth)*sign)
    ax.add_collection(PolyCollection([polys[i] for i in o],facecolors=[cols[i] for i in o],edgecolors='none'))
    for i,p in enumerate(pins):
        p=np.array(p); ax.plot(p[a],p[b],'r+',ms=14,mew=2)
        if label_pins: ax.text(p[a]+1,p[b]+1,str(i),color='red',fontsize=11,weight='bold')
    allv=np.vstack([m[0] for m in meshes])
    if lim: ax.set_xlim(lim[0]); ax.set_ylim(lim[1])
    else: ax.set_xlim(allv[:,a].min()-3,allv[:,a].max()+3); ax.set_ylim(allv[:,b].min()-3,allv[:,b].max()+3)
    import matplotlib.ticker as tk
    ax.xaxis.set_major_locator(tk.MultipleLocator(grid*2)); ax.yaxis.set_major_locator(tk.MultipleLocator(grid*2))
    ax.xaxis.set_minor_locator(tk.MultipleLocator(grid)); ax.yaxis.set_minor_locator(tk.MultipleLocator(grid))
    ax.grid(which='both',lw=0.3,alpha=0.6); ax.set_aspect('equal'); ax.set_xlabel(axes[0]); ax.set_ylabel(axes[1])
    ax.tick_params(labelsize=7)
    plt.tight_layout(); plt.savefig(out,dpi=80); plt.close()
