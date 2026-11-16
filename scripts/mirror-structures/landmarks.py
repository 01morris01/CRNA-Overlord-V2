import sys; import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lm import *
L={}  # name -> list of points (right side first; both sides auto-mirrored when 'bi')
def bi(name,p): L[name]=[np.array(p,float),mirror(p)]
def one(name,p): L[name]=[np.array(p,float)]
skull='^(Frontal bone|Occipital bone|Sphenoid bone|Ethmoid|Vomer|(Right|Left) (temporal bone|parietal bone|maxilla|zygomatic bone|nasal bone|lacrimal bone|palatine bone))$'
SK=concept(skull)[0]
# ---- frontal / face (surface picks from the front: min y)
bi('Supraorbital foramen', pick('^Frontal bone$',{'x':-24,'z':1541},'y','min',r=2.5))
bi('Infraorbital foramen', pick('^Right maxilla$',{'x':-27,'z':1497},'y','min',r=2.5))
on=concept('^Right optic nerve$')[0]; s=on[np.abs(on[:,1]+122)<2]; bi('Optic canal', s.mean(0))
sph=concept('^Sphenoid bone$')[0]
def inner(x,z,ylo,yhi,mesh=sph):
    s=mesh[(np.abs(mesh[:,0]-x)<3)&(np.abs(mesh[:,2]-z)<3)&(mesh[:,1]>ylo)&(mesh[:,1]<yhi)]
    return np.array([x, np.median(s[:,1]) if len(s) else (ylo+yhi)/2, z])
bi('Superior orbital fissure', inner(-27,1529,-135,-110))
bi('Inferior orbital fissure', np.array([-30,-132,1508.]))
bi('Foramen rotundum', inner(-17,1520,-130,-110))
def below(x,y,r=3.0,mesh=SK,zmax=1530):
    s=mesh[(np.hypot(mesh[:,0]-x,mesh[:,1]-y)<r)&(mesh[:,2]<zmax)]
    return np.array([x,y,np.median(s[:,2]) if len(s) else np.nan])
def rim(x,y,r=5.0,mesh=SK):     # hole: median z of nearby rim vertices
    d=np.hypot(mesh[:,0]-x,mesh[:,1]-y); s=mesh[(d<r)&(mesh[:,2]<1530)]
    return np.array([x,y,np.percentile(s[:,2],30)])
bi('Foramen ovale', rim(-24,-102))
bi('Foramen spinosum', rim(-29.5,-98))
bi('Foramen lacerum', rim(-14,-99))
bi('Carotid canal', rim(-30,-88))
bi('Jugular foramen', rim(-33,-78))
bi('Hypoglossal canal', rim(-25,-70))
one('Foramen magnum', rim(-0.5,-60,r=22))
occ=concept('^Occipital bone$')[0]; s=occ[(occ[:,0]<-8)&(occ[:,0]>-35)&(occ[:,1]>-85)&(occ[:,1]<-45)]
bi('Occipital condyles', s[np.argmin(s[:,2])])
tb=concept('^Right temporal bone$')[0]
bi('Styloid process', tb[np.argmin(tb[:,2])])
s=tb[(tb[:,1]>-78)&(tb[:,0]<-40)]; bi('Mastoid process', s[np.argmin(s[:,2])])
bi('External auditory meatus', pick('^Right temporal bone$',{'y':-80,'z':1507},'x','min',r=3))
bi('Zygomatic process', pick('^Right temporal bone$',{'y':-110,'z':1503},'x','min',r=3))
eth=concept('^Ethmoid$')[0]; cg=eth[np.argmax(eth[:,2])]; one('Crista galli', cg)
bi('Cribriform plate', np.array([-5, cg[1]+6, cg[2]-9]))
# sinuses (inside bones)
fb=concept('^Frontal bone$')[0]; f0=pick('^Frontal bone$',{'x':-12,'z':1548},'y','min',r=3); bi('Frontal sinus', f0+np.array([0,9,0]))
bi('Ethmoid sinus', np.array([-12,-143,1515.]))
mx=concept('^Right maxilla$')[0]; bi('Maxillary sinus', np.array([-27,-150,1493.]))
sb=sph[np.abs(sph[:,0]+0.5)<10]; one('Sphenoid sinus', np.array([-0.5,-114,1508.]))
# palate
pal=concept('^(Right|Left) (maxilla|palatine bone)$')[0]
one('Hard palate', below(-0.5,-150,r=6,mesh=pal,zmax=1490))
# mandible
md=concept('^Mandible$')[0]; R=md[md[:,0]<-20]
bi('Mandibular condyle', R[R[:,1]>-102][np.argmax(R[R[:,1]>-102][:,2])])
bi('Coronoid process', R[(R[:,1]<-125)][np.argmax(R[(R[:,1]<-125)][:,2])])
bi('Mandibular notch', np.array([-45,-119,1485.]))
k=np.argmax(R[:,1]-R[:,2]); bi('Mandibular angle', R[k])
bi('Mental foramen', pick('^Mandible$',{'y':-162,'z':1442},'x','min',r=3))
bi('Ramus', pick('^Mandible$',{'y':-110,'z':1470},'x','min',r=3))
bi('Body of mandible', pick('^Mandible$',{'y':-145,'z':1440},'x','min',r=3))
bi('Mandibular foramen', pick('^Mandible$',{'y':-112,'z':1468},'x','max',r=3,mesh=R))
bi('Mylohyoid line', pick('^Mandible$',{'y':-140,'z':1444},'x','max',r=5,mesh=md[md[:,0]<-12]))
hy=concept('^Hyoid bone$')[0]
one('Hyoid body', hy[np.argmin(hy[:,1])])
bi('Greater horns', hy[np.argmin(hy[:,0])])
bi('Lesser horns', np.array([-9,-118,1440.]))

tc=concept('^Thyroid cartilage$')[0]; Rt=tc[tc[:,0]<-0.5]
bi('Superior horn', Rt[np.argmax(Rt[:,2])])
q=Rt[Rt[:,1]>-105]; bi('Inferior horn', q[np.argmin(q[:,2])])
one('Laryngeal prominence', tc[np.argmin(tc[:,1])])
