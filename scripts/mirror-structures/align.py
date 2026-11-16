import sys; import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from meshio_ import *
import numpy as np
from scipy.spatial import cKDTree
from meshio_ import WORK
M=np.load(os.path.join(WORK,'mirror_meshes.npz')) if os.path.exists(os.path.join(WORK,'mirror_meshes.npz')) else None
def init(P): return np.c_[P[:,0],P[:,2],-P[:,1]]*0.1
def umeyama(A,B):  # find s,R,t: B ~ s R A + t
    ma,mb=A.mean(0),B.mean(0); a,b=A-ma,B-mb
    U,S,Vt=np.linalg.svd(b.T@a/len(A)); D=np.eye(3)
    if np.linalg.det(U@Vt)<0: D[2,2]=-1
    R=U@D@Vt; s=np.trace(np.diag(S)@D)/(a**2).sum(1).mean(); t=mb-s*R@ma; return s,R,t
def icp(src,tgt,iters=60,trim=0.85):
    tree=cKDTree(tgt); P=init(src); P=P-P.mean(0)+tgt.mean(0)  # rough center
    # total transform from init space
    T_s,T_R,T_t=1.0,np.eye(3),tgt.mean(0)-init(src).mean(0)
    for i in range(iters):
        Q=T_s*(init(src)@T_R.T)+T_t
        d,j=tree.query(Q); keep=d<=np.quantile(d,trim)
        s,R,t=umeyama(init(src)[keep],tgt[j[keep]])
        T_s,T_R,T_t=s,R,t
    Q=T_s*(init(src)@T_R.T)+T_t; d,_=tree.query(Q)
    return T_s,T_R,T_t,d
