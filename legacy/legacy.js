// ═══════════ THREE.JS ═══════════
const bgC=document.getElementById('bg'),R=new THREE.WebGLRenderer({canvas:bgC,antialias:true});
R.setSize(innerWidth,innerHeight);R.setPixelRatio(Math.min(devicePixelRatio,2));
R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=.8;
const Sc=new THREE.Scene();Sc.background=new THREE.Color(0x020510);Sc.fog=new THREE.FogExp2(0x020510,.065);
const cam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,100);cam.position.set(0,0,8);
Sc.add(new THREE.AmbientLight(0x0a0a22,1));
const hL=new THREE.PointLight(0xff2200,3.5,18);hL.position.set(0,0,2);Sc.add(hL);
const blPt=new THREE.PointLight(0x0033ff,1.5,20);blPt.position.set(-5,3,-1);Sc.add(blPt);
const hG=new THREE.Group();Sc.add(hG);
const hM=new THREE.MeshStandardMaterial({color:0xcc0020,emissive:0x880010,emissiveIntensity:.5,roughness:.3});
[{p:[-.54,.3,0],g:new THREE.SphereGeometry(1,28,28)},{p:[.54,.3,0],g:new THREE.SphereGeometry(1,28,28)},{p:[0,-.52,0],g:new THREE.ConeGeometry(.88,1.75,28),rz:Math.PI}].forEach(o=>{const m=new THREE.Mesh(o.g,hM);m.position.set(...o.p);if(o.rz)m.rotation.z=o.rz;hG.add(m);});
hG.position.set(0,0,-2);hG.rotation.z=.14;
const PN=500,pG=new THREE.BufferGeometry(),pp=new Float32Array(PN*3),pc=new Float32Array(PN*3),pvel=[];
for(let i=0;i<PN;i++){const th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1),r=1+Math.random()*5.5;pp[i*3]=r*Math.sin(ph)*Math.cos(th);pp[i*3+1]=r*Math.sin(ph)*Math.sin(th)-1;pp[i*3+2]=r*Math.cos(ph)-2;pvel.push({x:(Math.random()-.5)*.02,y:(Math.random()-.5)*.02,z:(Math.random()-.5)*.01});const rd=Math.random()>.3;pc[i*3]=rd?.8+Math.random()*.2:.08;pc[i*3+1]=rd?.04:.08;pc[i*3+2]=rd?.08:.7+Math.random()*.3;}
pG.setAttribute('position',new THREE.BufferAttribute(pp,3));pG.setAttribute('color',new THREE.BufferAttribute(pc,3));
const pMesh=new THREE.Points(pG,new THREE.PointsMaterial({size:.08,vertexColors:true,transparent:true,opacity:.7,sizeAttenuation:true}));Sc.add(pMesh);
let beatSpd=1,partSpd=1,flashHex=null,flashT=0,camRot=0,ecgFlat=false;
const ck=new THREE.Clock();
(function anim(){requestAnimationFrame(anim);const t=ck.getElapsedTime();
const b=1+.09*Math.abs(Math.sin(t*1.5*beatSpd))+.04*Math.abs(Math.sin(t*3*beatSpd));hG.scale.setScalar(b);hL.intensity=2+2.2*Math.abs(Math.sin(t*1.5*beatSpd));
const pa=pMesh.geometry.attributes.position.array;for(let i=0;i<PN;i++){pa[i*3]+=pvel[i].x*partSpd;pa[i*3+1]+=pvel[i].y*partSpd;pa[i*3+2]+=pvel[i].z*.5;if(Math.abs(pa[i*3])>9)pvel[i].x*=-1;if(Math.abs(pa[i*3+1]+1)>7)pvel[i].y*=-1;if(pa[i*3+2]>2)pa[i*3+2]=-4.5;if(pa[i*3+2]<-4.5)pa[i*3+2]=2;}pMesh.geometry.attributes.position.needsUpdate=true;
camRot+=.001;cam.position.x=Math.sin(camRot)*.5;cam.position.y=Math.cos(camRot*.7)*.3;cam.lookAt(0,0,-2);
if(flashHex!==null){flashT-=.04;hM.emissive.setHex(flashHex);hM.emissiveIntensity=Math.max(0,flashT);if(flashT<=0){flashHex=null;hM.emissive.setHex(0x880010);hM.emissiveIntensity=.5;}}
R.render(Sc,cam);})();
addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();R.setSize(innerWidth,innerHeight);});

// ═══════════ ECG ═══════════
const ecgCvs=document.getElementById('ecg'),ectx=ecgCvs.getContext('2d');ecgCvs.width=160;ecgCvs.height=42;
let ecgPts=[],ecgPh=0;const ECGW=[0,0,0,0,.04,.09,.04,0,-.12,.75,.35,-.26,0,-.08,-.04,.22,.17,.08,.03,0,0,0,0,0,0,0,0,0,0,0];
setInterval(()=>{ecgPh++;ecgPts.push(ecgFlat?0:ECGW[Math.floor(ecgPh/3)%ECGW.length]);if(ecgPts.length>150)ecgPts.shift();if(ecgPh%3===0){ectx.clearRect(0,0,160,42);ectx.strokeStyle=ecgFlat?'#f00':'#00ff88';ectx.lineWidth=1.4;ectx.shadowColor=ecgFlat?'#f00':'#00ff88';ectx.shadowBlur=4;ectx.beginPath();ecgPts.forEach((v,i)=>{const x=(i/ecgPts.length)*160,y=21-v*18;i?ectx.lineTo(x,y):ectx.moveTo(x,y);});ectx.stroke();}},40);

// ═══════════ SAVE SYSTEM ═══════════
const SAVE_KEY='hemodynamic_overlord_save';
function loadSave(){try{return JSON.parse(localStorage.getItem(SAVE_KEY))||null;}catch(e){return null;}}
function writeSave(data){try{localStorage.setItem(SAVE_KEY,JSON.stringify(data));}catch(e){}}
function getSave(){return loadSave()||{name:'',totalPts:0,bankedPts:0,equip:{vent:false,mac:false,vl:false,bougie:false},inv:{shield:0,skip:0,reveal:0,time:0},highScore:0,gamesPlayed:0,missedQuestionIds:[],questionStats:{},weakTopicIds:[]};}
function save(){const prev=getSave();
  const questionStats = ALL_QS.reduce((acc,q)=>{acc[q.id]={attempted:q.stats.attempted||0,correct:q.stats.correct||0,lastCorrect:q.stats.lastCorrect||0,repeatStreak:q.stats.repeatStreak||0};return acc;},{ });
  writeSave({
    name:playerName,
    totalPts:bankedPts,
    bankedPts:bankedPts,
    equip:equip,
    inv:inv,
    highScore:Math.max(prev.highScore||0,G?G.score:0),
    gamesPlayed:(prev.gamesPlayed||0),
    completed:prev.completed||{},
    bestScores:prev.bestScores||{},
    missedQuestionIds:missedQuestionIds,
    questionStats:questionStats,
    weakTopicIds:topicWeakness,
    // Preserve new-engine fields so legacy save() never wipes them
    nodeCompletion:prev.nodeCompletion||{},
    performanceByTopic:prev.performanceByTopic||{},
    lastSeen:prev.lastSeen||{}
  });}

let playerName='';let bankedPts=0;let missedQuestionIds=[];let topicWeakness=[];
// Load on startup
(function initSplash(){
  const s=getSave();
  if(s.name){document.getElementById('name-input').value=s.name;playerName=s.name;bankedPts=s.bankedPts||0;
  document.getElementById('saved-info').textContent='Welcome back, '+s.name+'! Banked: '+bankedPts.toLocaleString()+' pts';}
})();

// ═══════════ SRNA CHARACTER ═══════════
const srnaCvs=document.getElementById('srna-cvs'),sctx=srnaCvs.getContext('2d');
let equip={vent:false,mac:false,vl:false,bougie:false};
function drawSRNA(){
  const W=110,H=260;sctx.clearRect(0,0,W,H);
  sctx.fillStyle='rgba(5,5,20,.5)';sctx.fillRect(0,0,W,H);
  const cx=55,cy=120;
  sctx.fillStyle='#2266aa';sctx.fillRect(cx-14,cy-62,28,10);
  sctx.beginPath();sctx.arc(cx,cy-45,16,0,Math.PI*2);sctx.fillStyle='#ddaa88';sctx.fill();
  sctx.fillStyle='#333';sctx.fillRect(cx-7,cy-48,4,4);sctx.fillRect(cx+3,cy-48,4,4);
  sctx.fillStyle='#88bbdd';sctx.fillRect(cx-10,cy-40,20,8);
  sctx.fillStyle='#2266aa';sctx.fillRect(cx-18,cy-28,36,45);
  sctx.fillStyle='#1a5588';sctx.fillRect(cx-16,cy+17,14,35);sctx.fillRect(cx+2,cy+17,14,35);
  sctx.fillStyle='#333';sctx.fillRect(cx-16,cy+52,14,6);sctx.fillRect(cx+2,cy+52,14,6);
  sctx.fillStyle='#ddaa88';sctx.fillRect(cx-26,cy-25,10,30);sctx.fillRect(cx+16,cy-25,10,30);
  sctx.strokeStyle='#444';sctx.lineWidth=2;sctx.beginPath();sctx.arc(cx,cy-22,12,.2,Math.PI-.2);sctx.stroke();
  sctx.fillStyle='#666';sctx.beginPath();sctx.arc(cx,cy-10,4,0,Math.PI*2);sctx.fill();
  if(equip.vent){sctx.fillStyle='#334455';sctx.fillRect(78,cy-30,28,40);sctx.strokeStyle='#00ff88';sctx.lineWidth=1;sctx.strokeRect(78,cy-30,28,40);sctx.fillStyle='#00ff88';sctx.font='bold 6px Courier New';sctx.textAlign='center';sctx.fillText('VENT',92,cy-18);sctx.strokeStyle='#88aacc';sctx.lineWidth=1.5;sctx.beginPath();sctx.moveTo(78,cy-20);sctx.lineTo(cx+18,cy-28);sctx.stroke();}
  if(equip.mac){sctx.fillStyle='#aabbcc';sctx.save();sctx.translate(cx-28,cy-10);sctx.rotate(-.3);sctx.fillRect(0,0,5,22);sctx.fillRect(-3,18,11,6);sctx.restore();sctx.fillStyle='#ffdd00';sctx.font='bold 5px Courier New';sctx.textAlign='center';sctx.fillText('MAC',cx-30,cy+20);}
  if(equip.vl){sctx.fillStyle='#223344';sctx.fillRect(2,cy-10,22,30);sctx.strokeStyle='#4488ff';sctx.lineWidth=1;sctx.strokeRect(2,cy-10,22,30);sctx.fillStyle='#4488ff';sctx.fillRect(5,cy-7,16,10);sctx.fillStyle='#4488ff';sctx.font='bold 5px Courier New';sctx.textAlign='center';sctx.fillText('VL',13,cy+25);}
  if(equip.bougie){sctx.strokeStyle='#ff8844';sctx.lineWidth=2;sctx.beginPath();sctx.moveTo(cx+18,cy+10);sctx.quadraticCurveTo(cx+25,cy+30,cx+20,cy+45);sctx.stroke();sctx.fillStyle='#ff8844';sctx.font='bold 5px Courier New';sctx.textAlign='left';sctx.fillText('BOUGIE',cx+18,cy+50);}
  sctx.fillStyle='#6688aa';sctx.font='bold 7px Courier New';sctx.textAlign='center';
  sctx.fillText(playerName||'YOUR SRNA',cx,H-20);
  sctx.fillStyle='#445566';sctx.fillText(Object.values(equip).filter(Boolean).length+'/4 equipped',cx,H-8);
}
drawSRNA();

// ═══════════ SCENE CANVAS ═══════════
const scn=document.getElementById('scn'),ctx=scn.getContext('2d');
const SW=scn.width,SH=scn.height;
let clickTargets=[],sceneAnimId=null,sceneT=0;

function arrow(x1,y1,x2,y2,col,w=2){ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();const a=Math.atan2(y2-y1,x2-x1),hl=7;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-hl*Math.cos(a-Math.PI/6),y2-hl*Math.sin(a-Math.PI/6));ctx.lineTo(x2-hl*Math.cos(a+Math.PI/6),y2-hl*Math.sin(a+Math.PI/6));ctx.fill();ctx.restore();}
function txt(s,x,y,col='#fff',sz=11,al='center'){ctx.save();ctx.fillStyle=col;ctx.font=`bold ${sz}px Courier New`;ctx.textAlign=al;ctx.textBaseline='middle';ctx.fillText(s,x,y);ctx.restore();}
function hotspot(x,y,w,h,id,label,t){clickTargets.push({x:x-10,y:y-10,w:w+20,h:h+20,id});const a=.4+.6*Math.sin(t*3);ctx.save();ctx.shadowColor='#ffdd00';ctx.shadowBlur=18*a;ctx.strokeStyle=`rgba(255,221,0,${.3+.5*a})`;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(x+w/2,y+h/2,Math.max(w,h)/2+10,0,Math.PI*2);ctx.stroke();ctx.restore();txt(label,x+w/2,y-14,'#ffdd00',9);}

const SCENES={
vessel_cross(t,cfg){
  ctx.fillStyle='#06001a';ctx.fillRect(0,0,SW,SH);
  const cx=SW/2-50,cy=SH/2,r=cfg.radius||65,wall=cfg.wall||12,pulse=Math.sin(t*2)*2.5,rr=r+pulse;
  const grd=ctx.createRadialGradient(cx,cy,rr,cx,cy,rr+wall);grd.addColorStop(0,'#8B0000');grd.addColorStop(1,'#4a0000');
  ctx.beginPath();ctx.arc(cx,cy,rr+wall,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();
  ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.fillStyle='rgba(80,0,0,.5)';ctx.fill();
  for(let i=0;i<6;i++){const a=i*Math.PI/3+t*.3;arrow(cx+Math.cos(a)*(rr-6),cy+Math.sin(a)*(rr-6),cx+Math.cos(a)*(rr+wall+18),cy+Math.sin(a)*(rr+wall+18),'#ff8800',1.5);}
  ctx.save();ctx.strokeStyle='#ffff00';ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.beginPath();ctx.arc(cx,cy,rr+wall/2,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  ctx.save();ctx.strokeStyle='#00ddff';ctx.lineWidth=1.5;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+rr,cy);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  txt('r',cx+rr/2,cy-8,'#00ddff',10);txt(cfg.label||'',cx,cy+rr+wall+22,'#888',9);
  const px=SW-140,py=30;ctx.fillStyle='rgba(0,0,40,.7)';const el=cfg.eqLines||[];ctx.fillRect(px-8,py-8,155,el.length*22+16);
  el.forEach((l,i)=>txt(l,px+70,py+6+i*22,l.startsWith('!')?'#ff4444':'#00ddff',9));
},
capillary(t,cfg){
  ctx.fillStyle='#06001a';ctx.fillRect(0,0,SW,SH);
  const ly=SH/2-10,lx=40,rx=SW-40;
  const grd=ctx.createLinearGradient(lx,0,rx,0);grd.addColorStop(0,'#cc3322');grd.addColorStop(.5,'#884422');grd.addColorStop(1,'#3344aa');
  ctx.fillStyle=grd;ctx.beginPath();ctx.moveTo(lx,ly-16);ctx.lineTo(rx,ly-12);ctx.lineTo(rx,ly+12);ctx.lineTo(lx,ly+16);ctx.fill();
  for(let x=lx+25;x<rx-25;x+=30){ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(x,ly-16,2,32);}
  txt('ARTERIOLE END',lx+55,ly-28,'#ff6644',8);txt('VENOUS END',rx-55,ly-24,'#6688ff',8);
  const forces=[{x:lx+70,label:'Pc',dir:'down',col:'#ff8800',id:'pc'},{x:(lx+rx)/2-35,label:'πp',dir:'up',col:'#00ff88',id:'pip'},{x:(lx+rx)/2+40,label:'πif',dir:'down',col:'#ffaa00',id:'piif'},{x:rx-80,label:'Pif',dir:'down',col:'#ff6644',id:'pif'}];
  forces.forEach(f=>{const fy=f.dir==='down'?ly+18:ly-18,fy2=f.dir==='down'?ly+52:ly-52;
  arrow(f.x,fy,f.x,fy2,f.col,2);txt(f.label,f.x,f.dir==='down'?fy2+10:fy2-10,f.col,10);
  if(cfg.clickable)hotspot(f.x-25,Math.min(fy,fy2)-5,50,Math.abs(fy2-fy)+10,f.id,f.label==='πp'?'CLICK ME':'',t);});
  for(let i=0;i<3;i++){const dx=lx+60+i*25,dy=ly+18+Math.sin(t*2+i)*6+12;ctx.beginPath();ctx.arc(dx,dy,2.5,0,Math.PI*2);ctx.fillStyle='rgba(255,200,100,.5)';ctx.fill();}
  for(let i=0;i<3;i++){const dx=rx-70+i*18;arrow(dx,ly+40,dx,ly+16,'#00ff88',1.2);}
  ctx.save();ctx.strokeStyle='#44ff44';ctx.lineWidth=1.5;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(lx+40,ly+65);ctx.lineTo(rx-40,ly+65);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  txt('LYMPHATIC',SW/2,ly+76,'#44ff44',7);
  for(let i=0;i<7;i++){const ax=lx+40+i*55+Math.sin(t+i)*4;ctx.beginPath();ctx.arc(ax,ly+Math.cos(t*1.5+i)*5,4,0,Math.PI*2);ctx.fillStyle=cfg.lowAlbumin?'rgba(100,200,255,.1)':'rgba(100,200,255,.45)';ctx.fill();if(!cfg.lowAlbumin||i<2)txt('Alb',ax,ly+Math.cos(t*1.5+i)*5,'#88ddff',6);}
  txt(cfg.nfpLabel||'',SW/2,18,'#aaa',9);
},
patient(t,cfg){
  ctx.fillStyle='#06001a';ctx.fillRect(0,0,SW,SH);
  const cx=SW/2-(cfg.offset||0),cy=SH/2;
  ctx.fillStyle='#1a1a2a';ctx.fillRect(cx-80,cy+55,160,10);
  ctx.beginPath();ctx.arc(cx,cy-60,18,0,Math.PI*2);ctx.fillStyle='#ddaa88';ctx.fill();
  ctx.fillStyle='#333';ctx.fillRect(cx-7,cy-64,3,3);ctx.fillRect(cx+4,cy-64,3,3);
  ctx.beginPath();ctx.arc(cx,cy-51,5,0,Math.PI);ctx.strokeStyle='#333';ctx.lineWidth=1.2;ctx.stroke();
  ctx.fillStyle='#5588aa';ctx.fillRect(cx-25,cy-38,50,62);
  if(cfg.ascites){ctx.beginPath();ctx.ellipse(cx,cy-7,35+Math.sin(t)*2,26+Math.sin(t)*2,0,0,Math.PI*2);ctx.fillStyle='rgba(180,160,80,.55)';ctx.fill();ctx.strokeStyle='#aa9944';ctx.lineWidth=1;ctx.stroke();txt('🍺',cx-62,cy-18,'#fff',15);txt('🍺',cx-76,cy+6,'#fff',11);}
  ctx.fillStyle='#ddaa88';ctx.fillRect(cx-42,cy-34,14,28);ctx.fillRect(cx+28,cy-34,14,28);
  const lw=cfg.edema?20:13;ctx.fillStyle=cfg.edema?'#cc9977':'#ddaa88';ctx.fillRect(cx-18,cy+24,lw,40);ctx.fillRect(cx+18-lw,cy+24,lw,40);
  if(cfg.edema){txt('💧',cx-18,cy+42,'#fff',8);txt('💧',cx+10,cy+42,'#fff',8);}
  ctx.fillStyle='#aabbcc';ctx.fillRect(cx+70,cy-72,3,105);ctx.fillStyle='rgba(100,180,255,.55)';ctx.fillRect(cx+65,cy-72,13,22);
  ctx.strokeStyle='#88aacc';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx+71,cy-50);ctx.lineTo(cx+42,cy-28);ctx.stroke();
  if(cfg.showLiver){ctx.beginPath();ctx.ellipse(cx+8,cy-14,15,10,-.3,0,Math.PI*2);ctx.fillStyle='rgba(139,69,19,.65)';ctx.fill();ctx.strokeStyle='#8B4513';ctx.lineWidth=1;ctx.stroke();txt('LIVER',cx+8,cy-14,'#dda060',6);}
  if(cfg.hotspots)cfg.hotspots.forEach(h=>hotspot(cx+h.ox,cy+h.oy,h.w,h.h,h.id,h.label,t));
  if(cfg.kidney){const kx=cx+140,ky=cy-8;ctx.beginPath();ctx.ellipse(kx,ky,24,32,.1,0,Math.PI*2);const kg=ctx.createRadialGradient(kx,ky,4,kx,ky,32);kg.addColorStop(0,'#8B4513');kg.addColorStop(1,'#5a2d0c');ctx.fillStyle=kg;ctx.fill();ctx.strokeStyle='#aa6633';ctx.lineWidth=1.2;ctx.stroke();txt('KIDNEY',kx,ky-38,'#cc8844',8);
  const px2=cx+220,py2=cy+15;ctx.beginPath();ctx.arc(px2,py2-26,7,0,Math.PI*2);ctx.fillStyle='#ddaa88';ctx.fill();ctx.strokeStyle='#ddaa88';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(px2,py2-19);ctx.lineTo(px2,py2-2);ctx.stroke();ctx.beginPath();ctx.moveTo(px2,py2-12);ctx.lineTo(px2-10,py2-3);ctx.stroke();ctx.beginPath();ctx.moveTo(px2,py2-12);ctx.lineTo(px2+10,py2-3);ctx.stroke();ctx.beginPath();ctx.moveTo(px2,py2-2);ctx.lineTo(px2-8,py2+14);ctx.stroke();ctx.beginPath();ctx.moveTo(px2,py2-2);ctx.lineTo(px2+8,py2+14);ctx.stroke();
  const ps=Math.sin(t*4)*2.5;ctx.strokeStyle='#ffdd00';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(px2+3,py2-3);ctx.quadraticCurveTo(px2+16,py2+8+ps,px2+22,py2+26);ctx.stroke();for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(px2+22+Math.sin(t*5+i)*3,py2+28+i*2.5,1.8,0,Math.PI*2);ctx.fillStyle='#ffdd00';ctx.fill();}txt('DIURESIS',px2+5,py2+46,'#ffdd00',8);}
  if(cfg.infoPanel){const px3=12,py3=12;ctx.fillStyle='rgba(0,0,40,.7)';ctx.fillRect(px3,py3,170,cfg.infoPanel.length*18+12);cfg.infoPanel.forEach((l,i)=>txt(l,px3+85,py3+10+i*18,l.startsWith('!')?'#ff4444':'#00ddff',8));}
},
brainstem(t,cfg){
  ctx.fillStyle='#06001a';ctx.fillRect(0,0,SW,SH);
  const cx=SW/2,cy=SH/2;
  ctx.beginPath();ctx.ellipse(cx,cy,110,72,0,0,Math.PI*2);ctx.fillStyle='rgba(40,20,60,.65)';ctx.fill();ctx.strokeStyle='#8866aa';ctx.lineWidth=1.5;ctx.stroke();
  txt('MEDULLA',cx,cy-82,'#aa88cc',9);
  ctx.fillStyle='rgba(50,100,80,.45)';ctx.fillRect(cx-28,cy-42,56,22);ctx.strokeStyle='#00ff88';ctx.lineWidth=1;ctx.strokeRect(cx-28,cy-42,56,22);txt('NTS',cx,cy-31,'#00ff88',9);
  ctx.fillStyle=cfg.highlightVMC?'rgba(255,50,50,.25)':'rgba(100,30,30,.45)';ctx.fillRect(cx-48,cy-8,42,26);ctx.strokeStyle='#ff4444';ctx.strokeRect(cx-48,cy-8,42,26);txt('VMC',cx-27,cy+2,'#ff4444',7);
  ctx.fillStyle='rgba(30,30,100,.45)';ctx.fillRect(cx+6,cy-8,42,26);ctx.strokeStyle='#4488ff';ctx.strokeRect(cx+6,cy-8,42,26);txt('VMD',cx+27,cy+2,'#4488ff',7);
  ctx.fillStyle='rgba(30,80,30,.45)';ctx.fillRect(cx-22,cy+26,44,22);ctx.strokeStyle='#44cc44';ctx.strokeRect(cx-22,cy+26,44,22);txt('VAGAL',cx,cy+37,'#44cc44',8);
  ctx.strokeStyle='#ffaa00';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(cx-160,cy-68);ctx.quadraticCurveTo(cx-90,cy-52,cx-28,cy-35);ctx.stroke();txt("Hering→CN IX",cx-160,cy-76,'#ffaa00',7,'left');
  ctx.strokeStyle='#44cc44';ctx.beginPath();ctx.moveTo(cx-160,cy-35);ctx.quadraticCurveTo(cx-90,cy-30,cx-28,cy-33);ctx.stroke();txt('CN X Vagus',cx-160,cy-25,'#44cc44',7,'left');
  ctx.strokeStyle='#ff4444';ctx.beginPath();ctx.moveTo(cx-48,cy+5);ctx.lineTo(cx-150,cy+25);ctx.stroke();txt('Sympathetic→',cx-150,cy+35,'#ff4444',7,'left');
  ctx.strokeStyle='#44cc44';ctx.beginPath();ctx.moveTo(cx,cy+48);ctx.lineTo(cx,cy+85);ctx.stroke();txt('→Heart(↓HR)',cx,cy+94,'#44cc44',7);
  ctx.fillStyle='rgba(255,180,50,.15)';ctx.fillRect(cx+130,cy-60,90,25);ctx.strokeStyle='#ffaa00';ctx.strokeRect(cx+130,cy-60,90,25);txt('BARORECEPTORS',cx+175,cy-47,'#ffaa00',6);
  ctx.fillStyle='rgba(200,100,255,.15)';ctx.fillRect(cx+130,cy-25,90,25);ctx.strokeStyle='#cc66ff';ctx.strokeRect(cx+130,cy-25,90,25);txt('CHEMORECEPT.',cx+175,cy-12,'#cc66ff',6);
  if(cfg.co2)for(let i=0;i<5;i++){const bx=cx-35+Math.random()*70,by=cy-35+Math.random()*55;txt('CO₂',bx+Math.sin(t*2+i)*4,by+Math.cos(t*2+i)*3,`rgba(255,100,100,${.25+.25*Math.sin(t*3+i)})`,8);}
  if(cfg.firing)for(let i=0;i<6;i++){const sx=cx-45+Math.random()*90,sy=cy-35+Math.random()*60;ctx.beginPath();ctx.arc(sx+Math.sin(t*5+i)*2,sy+Math.cos(t*5+i)*2,1.2+Math.sin(t*8+i),0,Math.PI*2);ctx.fillStyle=`rgba(255,255,100,${.25+.25*Math.sin(t*4+i)})`;ctx.fill();}
  if(cfg.info)txt(cfg.info,cx,SH-14,'#777',8);
},
circulation(t,cfg){
  ctx.fillStyle='#06001a';ctx.fillRect(0,0,SW,SH);
  const cx=SW/2,cy=SH/2;
  ctx.beginPath();ctx.arc(cx,cy,26,0,Math.PI*2);const hg=ctx.createRadialGradient(cx,cy,4,cx,cy,26);hg.addColorStop(0,'#cc2222');hg.addColorStop(1,'#660011');ctx.fillStyle=hg;ctx.fill();ctx.strokeStyle='#ff4444';ctx.lineWidth=1.5;ctx.stroke();txt('❤️',cx,cy,'#fff',14);
  ctx.fillStyle='rgba(200,40,40,.25)';ctx.fillRect(cx-175,cy-22,120,44);ctx.strokeStyle='#cc3333';ctx.lineWidth=1;ctx.strokeRect(cx-175,cy-22,120,44);txt('ARTERIES ~15%',cx-115,cy,'#ff4444',8);
  arrow(cx-26,cy,cx-55,cy,'#ff4444',1.5);
  ctx.fillStyle='rgba(150,80,150,.18)';ctx.fillRect(cx-50,cy-100,100,35);ctx.strokeStyle='#aa66aa';ctx.strokeRect(cx-50,cy-100,100,35);txt('CAPILLARIES ~5%',cx,cy-82,'#cc88cc',7);
  const va=cfg.highlightVeins?.45:.25;ctx.fillStyle=`rgba(40,40,200,${va})`;ctx.fillRect(cx+55,cy-35,155,70);ctx.strokeStyle=cfg.highlightVeins?'#4488ff':'#3344aa';ctx.lineWidth=cfg.highlightVeins?2:1;ctx.strokeRect(cx+55,cy-35,155,70);txt('VEINS',cx+132,cy-12,cfg.highlightVeins?'#88bbff':'#6688ff',11);txt('60% OF BLOOD',cx+132,cy+5,cfg.highlightVeins?'#ffdd00':'#8888ff',8);
  if(cfg.highlightVeins)txt('"THE BALLOON" 🎈',cx+132,cy+20,'#aabbff',7);
  arrow(cx-155,cy-25,cx-80,cy-78,'#cc3333',1.2);arrow(cx+15,cy-78,cx+100,cy-35,'#6666cc',1.2);arrow(cx+90,cy+35,cx+26,cy+8,'#3355cc',1.2);
  if(cfg.squeeze){const sq=Math.sin(t*3)*.3+.7;ctx.save();ctx.globalAlpha=sq;for(let i=0;i<5;i++){arrow(cx+70+i*22,cy+37,cx+70+i*22,cy+28,'#ffdd00',1.2);arrow(cx+70+i*22,cy-37,cx+70+i*22,cy-28,'#ffdd00',1.2);}ctx.restore();txt('⚡SYMPATHETIC SQUEEZE⚡',cx+132,cy+48,'#ffdd00',7);}
  if(cfg.showCO)txt('CO = Venous Return (Ch.20)',cx,cy+75,'#888',8);
}};

let curScene=null,curSceneCfg={};
function animScene(){sceneAnimId=requestAnimationFrame(animScene);sceneT+=.016;clickTargets=[];if(curScene&&SCENES[curScene])SCENES[curScene](sceneT,curSceneCfg);}

scn.addEventListener('click',e=>{
  if(!G||G.done)return;const q=G.qs[G.q];if(!q||q.type!=='click')return;
  const rect=scn.getBoundingClientRect();
  const x=(e.clientX-rect.left)*(SW/rect.width),y=(e.clientY-rect.top)*(SH/rect.height);
  for(const t of clickTargets){if(x>=t.x&&x<=t.x+t.w&&y>=t.y&&y<=t.y+t.h){G.done=true;clearInterval(G.tid);setTimeout(()=>process(t.id===q.correctTarget),400);return;}}
});
scn.addEventListener('mousemove',e=>{const q=G?G.qs[G.q]:null;scn.style.cursor=(q&&q.type==='click'&&!G.done)?'crosshair':'default';});

// ═══════════ STORE ═══════════
const STORE_ITEMS=[
  {id:'shield',name:'Ventilator',icon:'🫁',cost:800,desc:'SHIELD — Next wrong answer costs no life. The vent breathes so your patient doesn\'t die from your stupidity.',equipKey:'vent'},
  {id:'skip',name:'MAC Blade',icon:'🔪',cost:1200,desc:'SKIP — Skip any question, no penalty. Because sometimes you just gotta intubate and move on.',equipKey:'mac'},
  {id:'reveal',name:'Video Laryngoscope',icon:'📺',cost:600,desc:'REVEAL — Eliminates one wrong MCQ answer or shows extra hint. Better view = better decisions.',equipKey:'vl'},
  {id:'time',name:'Bougie',icon:'🔧',cost:400,desc:'+TIME — Adds 15 seconds. Like a bougie, it buys you time when shit gets tight.',equipKey:'bougie'},
];
let inv={shield:0,skip:0,reveal:0,time:0};

function renderStore(){
  const g=document.getElementById('store-grid');g.innerHTML='';
  document.getElementById('store-pts-val').textContent=bankedPts.toLocaleString();
  STORE_ITEMS.forEach(item=>{
    const d=document.createElement('div');d.className='store-item';
    const canBuy=bankedPts>=item.cost;
    d.innerHTML=`<span class="si-icon">${item.icon}</span><div class="si-name">${item.name}</div><div class="si-desc">${item.desc}</div><div class="si-cost">${item.cost} pts</div><button class="si-buy" ${canBuy?'':'disabled'} onclick="buyItem('${item.id}')">BUY</button><div class="si-owned">Owned: ${inv[item.id]}</div>`;
    g.appendChild(d);
  });
}
function buyItem(id){
  const item=STORE_ITEMS.find(i=>i.id===id);if(!item||bankedPts<item.cost)return;
  bankedPts-=item.cost;inv[id]++;
  equip[item.equipKey]=true;drawSRNA();
  document.getElementById('scv').textContent=bankedPts.toLocaleString();
  renderStore();updatePwrBtns();save();
}
function openStore(){
  if(!inv)inv={shield:0,skip:0,reveal:0,time:0};
  document.getElementById('store-modal').classList.add('on');
  if(G&&G.tid&&!G.done){clearInterval(G.tid);G.storePaused=true;}
  renderStore();
}
function closeMapAndOpenStore(){
  const sel=document.getElementById('course-selector');
  if(sel){
    sel.style.display='none';
    lastScreen='course-selector';
  }
  openStore();
}
function closeStore(){
  document.getElementById('store-modal').classList.remove('on');
  if(G&&G.storePaused&&!G.done&&!G.paused){G.storePaused=false;startTimerFrom(G.tmr);}
  else if(G){G.storePaused=false;}
  else if(lastScreen==='course-selector'){
    document.getElementById('course-selector').style.display='flex';
    showCourseSelector();
    lastScreen=null;
  }
  else if(lastScreen==='topic-map'){
    document.getElementById('course-selector').style.display='flex';
    if(selectedCourseId)showTopicMap();
    lastScreen=null;
  }
  else if(lastScreen==='combined-study'){
    document.getElementById('course-selector').style.display='flex';
    showCombinedStudyScreen();
    lastScreen=null;
  }
}
function pauseGame(){
  if(!G||G.done)return;
  clearInterval(G.tid);G.paused=true;
  document.getElementById('pause-overlay').classList.add('on');
}
function resumeGame(){
  document.getElementById('pause-overlay').classList.remove('on');
  if(G&&G.paused&&!G.done){G.paused=false;startTimerFrom(G.tmr);}
}
function quitToMap(){
  document.getElementById('pause-overlay').classList.remove('on');
  if(G){clearInterval(G.tid);G.done=true;}
  document.getElementById('game').style.display='none';
  if(sceneAnimId)cancelAnimationFrame(sceneAnimId);
  save();
  if(selectedCourseId){
    lastScreen='topic-map';
    showTopicMap();
  } else {
    lastScreen='combined-study';
    showCombinedStudyScreen();
  }
}

function updatePwrBtns(){
  ['shield','skip','reveal','time'].forEach(p=>{
    document.getElementById('pw-'+p).classList.toggle('has',inv[p]>0);
    document.getElementById('pc-'+p).textContent=inv[p];
  });
}

function usePwr(type){
  if(G.done||inv[type]<=0)return;
  const q=G.qs[G.q];
  if(type==='skip'){inv.skip--;G.done=true;clearInterval(G.tid);showOV("Skipped. The MAC blade saves your ass... this time.");save();setTimeout(nextQ,1200);}
  else if(type==='time'){inv.time--;G.tmr=Math.min(100,G.tmr+25);showOV("Bougie bought you time. Don't waste it.");save();}
  else if(type==='reveal'){
    inv.reveal--;save();
    if(q.type==='mcq'){const btns=[0,1,2].map(i=>({i,btn:document.getElementById('b'+i),ai:parseInt(document.getElementById('b'+i).dataset.ai)}));
      const wrong=btns.filter(b=>!q.ans[b.ai].ok&&!b.btn.classList.contains('elim'));
      if(wrong.length>0){wrong[0].btn.classList.add('elim');wrong[0].btn.disabled=true;}
      showOV("VL deployed. One bullshit answer eliminated. You're welcome.");
    } else if(q.type==='type'){document.getElementById('type-hint').textContent='💡 HINT: '+q.revealHint;showOV("VL gives you a better view. Use it wisely.");
    } else {showOV("VL hint: Look for the glowing targets, genius.");}
  }
  else if(type==='shield'){showOV("🫁 Vent is primed. Next wrong answer won't kill the patient. Probably.");}
  updatePwrBtns();
}

// ═══════════ QUESTION BANK ═══════════
// Level 1: Definitions & basic concepts
// Level 2: Applied concepts & mechanisms
// Level 3: Clinical scenarios (easier)
// Level 4: Advanced integration & scenarios
// Level 5: Board-level synthesis
// Each q has: ch, scene, sceneCfg, type, setup, q, ans/accepted/correctTarget, hint, revealHint, win, lose, ex, difficulty (1-5)

const ALL_QS=[
// ═══ LEVEL 1: DEFINITIONS & FUNDAMENTALS ═══
{ch:"Ch.14 — Vascular Physics 101",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'BLOOD VESSEL CROSS-SECTION',eqLines:['Poiseuille: R ∝ 1/r⁴','Flow = ΔP / R']},
type:'mcq',difficulty:1,
setup:"Alright, let's see if you even know the basic damn vocabulary before we get into anything complicated. Every vessel in the body follows the same physics — and one type of vessel controls almost ALL the resistance.",
q:"Which vessel type is the PRIMARY site of peripheral vascular resistance in the systemic circulation?",
ans:[{t:"Arterioles — smooth muscle walls let them actively change radius, controlling resistance via r⁴",ok:true},{t:"Capillaries — smallest diameter means highest individual resistance per vessel segment",ok:false},{t:"Large arteries — thick walls and high pressure make them the main resistance barrier",ok:false}],
win:"ARTERIOLES. Not capillaries, not arteries — arterioles. They have thick smooth muscle walls relative to their lumen, and because R ∝ 1/r⁴, their small radii make them exquisitely sensitive resistance regulators. The sympathetic nervous system controls arteriolar tone throughout the body. This is THE foundational concept of vascular physics. Everything else in Ch. 14-20 builds on this.",
lose:"It's arterioles. Capillaries have tiny individual radii but their TOTAL cross-sectional area is massive (parallel resistance drops). Large arteries are conduits — low resistance. Arterioles have smooth muscle, small radius, and r⁴ physics. They're the resistance gate of the circulation.",
ex:"<strong>Arterioles = resistance vessels.</strong> R ∝ 1/r⁴ (Poiseuille). Small radius + smooth muscle = enormous control over resistance. Sympathetic innervation actively adjusts arteriolar tone → controls TPR → controls MAP."},

{ch:"Ch.14 — The Fourth Power",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'ARTERIOLE — RADIUS HALVES',eqLines:['Poiseuille: R ∝ 1/r⁴','Radius halved...','Resistance = ???']},
type:'type',difficulty:1,
setup:"Listen here, you scrub-wearing catastrophe. The sympathetic system just told your patient's renal arteriole to go fuck itself and constricted it to HALF its radius. Every pre-med thinks 'oh resistance doubles.' WRONG. Those idiots forgot the exponent.",
q:"Arteriole radius halves → resistance increases by what factor?",
accepted:['16','16x','sixteen','r to the fourth','1/r4','r4','fourth power','r^4'],
hint:"R ∝ 1/r⁴. What's (2)⁴?",revealHint:"It's 2 to the 4th power. The FOURTH power is the key.",
win:"SIXTEEN. Because resistance scales with 1/r to the FOURTH goddamn power. A tiny arteriolar twitch produces a CATASTROPHIC resistance change. A 50% radius change doesn't cut flow in half — it cuts it to 1/16th. That's the beauty and the terror of Poiseuille.",
lose:"It's 1/r⁴. FOURTH POWER. (1/0.5)⁴ = 2⁴ = 16. SIXTEEN TIMES the resistance. The reason arterioles are the 'resistance vessels' is BECAUSE of this fourth-power relationship. A tiny radius change obliterates flow.",
ex:"<strong>Poiseuille: Q=πΔPr⁴/8ηL → R∝1/r⁴.</strong> When r→r/2: R=(1/(r/2))⁴=<strong>16×</strong>. The fourth power makes arterioles incredibly sensitive resistance regulators."},

{ch:"Ch.15 — Vascular Compliance",scene:'circulation',sceneCfg:{highlightVeins:true},
type:'mcq',difficulty:1,
setup:"Basic definition time. The circulatory system has two fundamentally different types of vessels based on their wall properties. One stores pressure, the other stores volume. Know the goddamn difference.",
q:"What does 'vascular compliance' (distensibility × volume) measure in a blood vessel?",
ans:[{t:"The ability to resist changes in wall tension when transmural pressure rises sharply",ok:false},{t:"The total volume change per unit pressure change — how much blood a vessel stores per mmHg",ok:true},{t:"The velocity of blood flow through a vessel segment at a given driving pressure",ok:false}],
win:"Compliance = ΔVolume/ΔPressure. It tells you how much blood a vessel can STORE per mmHg of pressure change. Veins have 24× the compliance of arteries. That's why 60% of blood volume sits in the venous system at near-zero pressure. Arteries are stiff pressure tanks. Veins are stretchy volume reservoirs. This is the 'Tank vs Balloon' concept from Ch. 15.",
lose:"Compliance = ΔV/ΔP. Volume change per pressure change. Veins are 24× more compliant than arteries — they store massive volume at low pressure. This isn't about tension or velocity. It's about volume storage capacity per unit pressure.",
ex:"<strong>Compliance = ΔV/ΔP.</strong> Veins: 24× arterial compliance → store 60% of blood volume. Arteries: low compliance → maintain pressure. CONCEPT: 'Tank vs Balloon' — arteries maintain pressure (tank), veins store volume (balloon)."},

{ch:"Ch.16 — Starling Forces",scene:'capillary',sceneCfg:{clickable:false,nfpLabel:'Four Starling Forces: Pc, πp, Pif, πif'},
type:'mcq',difficulty:1,
setup:"The Starling equation has four forces that determine whether fluid stays in the capillary or leaks into the interstitium. Two push fluid OUT, two pull it back IN. You need to know which does what or your patient drowns in their own edema fluid.",
q:"Which Starling force is the PRIMARY force pulling fluid BACK into the capillary at the venous end?",
ans:[{t:"Interstitial fluid pressure (Pif) — tissue pressure squeezes fluid back into the capillary lumen",ok:false},{t:"Capillary hydrostatic pressure (Pc) — drives filtration outward at all points along the capillary",ok:false},{t:"Plasma colloid osmotic pressure (πp) — albumin creates an osmotic gradient favoring reabsorption",ok:true}],
win:"πp — plasma colloid osmotic pressure! Albumin is the MVP here — 75% of πp comes from albumin alone. At ~28 mmHg, it's the dominant inward force that reabsorbs fluid at the venous end. Without it (cirrhosis, nephrotic syndrome), fluid pours out everywhere. This is THE reabsorption engine of the capillary.",
lose:"It's πp — plasma colloid osmotic pressure. Albumin generates ~75% of this force at 28 mmHg. Pc pushes fluid OUT (that's filtration). Pif is normally slightly negative. πp is the big inward suction force that reabsorbs fluid.",
ex:"<strong>NFP = (Pc + πif) − (πp + Pif).</strong> πp ≈ 28 mmHg, 75% from albumin. It's the PRIMARY reabsorptive force. Without albumin → πp collapses → net filtration everywhere → edema."},

{ch:"Ch.17 — Local Blood Flow",scene:'vessel_cross',sceneCfg:{radius:55,wall:10,label:'LOCAL FLOW CONTROL',eqLines:['Metabolic theory:','Tissue needs → local signals','→ arteriolar dilation','→ ↑blood flow']},
type:'mcq',difficulty:1,
setup:"Every tissue in your body has a built-in system to match blood flow to metabolic demand. It doesn't need the brain, the hormones, or your permission. It just fucking does it. What's the molecule that the endothelium releases to dilate vessels locally?",
q:"What molecule does the vascular endothelium synthesize from L-arginine to cause local vasodilation?",
ans:[{t:"Nitric oxide (NO) — activates guanylyl cyclase in smooth muscle, producing cGMP and relaxation",ok:true},{t:"Prostacyclin (PGI2) — inhibits platelet aggregation and relaxes smooth muscle via cAMP pathway",ok:false},{t:"Endothelin-1 (ET-1) — most potent endothelium-derived vasoactive substance currently identified",ok:false}],
win:"NITRIC OXIDE. NO. Made from L-arginine by eNOS → diffuses to smooth muscle → activates guanylyl cyclase → ↑cGMP → vasodilation. It also inhibits platelet aggregation AND smooth muscle proliferation. Triple threat protector. Endothelin is The Bad — most potent vasoconstrictor known. PGI2 is a helper but NO is the star. Know your cast of characters.",
lose:"It's Nitric Oxide (NO). eNOS + L-arginine → NO → guanylyl cyclase → cGMP → relaxation. Endothelin is a vasoconstrictor (the enemy). PGI2 does dilate but via cAMP, not cGMP, and it's not the primary endothelial vasodilator Guyton emphasizes.",
ex:"<strong>NO (Nitric Oxide) = EDRF.</strong> eNOS + L-arginine → NO → guanylyl cyclase → ↑cGMP → vasodilation + anti-platelet + anti-proliferation. The endothelial guardian angel."},

{ch:"Ch.18 — Autonomic Wiring",scene:'brainstem',sceneCfg:{info:'Baroreceptor afferent pathway'},
type:'type',difficulty:1,
setup:"Quick concept check. Baroreceptors are your patient's first-line BP defense system. I need you to trace the SIGNAL PATH — from the carotid sinus receptor to the brainstem. Not the effect. The goddamn WIRING DIAGRAM.",
q:"Carotid sinus baroreceptor signal → travels via which nerve → to which brainstem nucleus? (nerve, nucleus)",
accepted:['hering glossopharyngeal nts','glossopharyngeal nts','cn ix nts','herings nerve nts','glossopharyngeal nucleus tractus solitarius','cn9 nts','heringsnerve nts','hering nts','glossopharyngeal to nts','cn ix to nts','cnix nts'],
hint:"The nerve has a name (Hering's), then joins a cranial nerve (CN IX), then reaches a brainstem nucleus.",revealHint:"Hering's nerve → joins CN IX (glossopharyngeal) → NTS",
win:"Hering's nerve → glossopharyngeal (CN IX) → NTS (Nucleus Tractus Solitarius). That's the afferent wiring. The NTS is the sensory processing hub of the VMC. The aortic arch uses CN X (vagus) → same NTS. Knowing the WIRING is what separates 'I read the chapter' from 'I understand the reflex.'",
lose:"The path is: Hering's nerve → CN IX (glossopharyngeal) → NTS. Three stops. Hering's nerve carries the signal from carotid sinus baroreceptors, joins CN IX, terminates in the Nucleus Tractus Solitarius. Aortic arch uses CN X instead. Same destination.",
ex:"<strong>Baroreceptor afferent:</strong> Carotid sinus → Hering's nerve → CN IX → NTS. Aortic arch → CN X → NTS. NTS is the sensory integration center of the VMC."},

{ch:"Ch.18 — Sympathetic Targets",scene:'brainstem',sceneCfg:{info:'Sympathetic nervous system innervation targets'},
type:'mcq',difficulty:1,
setup:"The sympathetic nervous system doesn't just innervate one thing — it has specific targets throughout the cardiovascular system. But there's one part of the vasculature it does NOT directly innervate. Know your anatomy or get wrecked.",
q:"Which vascular structure does the sympathetic nervous system NOT directly innervate with nerve fibers?",
ans:[{t:"Capillaries — no smooth muscle means no sympathetic nerve terminals on these exchange vessels",ok:true},{t:"Arterioles — these resistance vessels rely only on local metabolic autoregulation for tone",ok:false},{t:"Venules — these small venous vessels lack any autonomic nervous system innervation entirely",ok:false}],
win:"CAPILLARIES. They have NO smooth muscle in their walls — just a single endothelial cell layer with a basement membrane. No muscle = nothing to innervate = no sympathetic control. Arterioles, venules, and veins ALL have smooth muscle and sympathetic innervation. Capillaries are pure exchange vessels, controlled indirectly by precapillary sphincters and upstream arterioles.",
lose:"It's capillaries. Capillaries lack smooth muscle entirely — just endothelium + basement membrane. No muscle = no nerve terminals. Arterioles ARE heavily innervated (that's how sympathetics control TPR). Venules have some innervation too.",
ex:"<strong>Capillaries have NO smooth muscle → NO sympathetic innervation.</strong> They're pure exchange vessels. Flow through capillary beds is controlled indirectly by arteriolar tone and precapillary sphincters."},

// ═══ LEVEL 2: APPLIED CONCEPTS ═══
{ch:"Ch.14 — Velocity vs Resistance",scene:'vessel_cross',sceneCfg:{radius:55,wall:8,label:'VELOCITY vs RESISTANCE',eqLines:['v = Flow / CSA','','Aorta: 2.5 cm²','Capillaries: 2,500 cm²']},
type:'mcq',difficulty:2,
setup:"This separates people who understand flow physics from people who just memorize bullets. 40% of students get this wrong because they confuse RESISTANCE with VELOCITY. They are NOT the same. Think about WHY velocity is slow where it is.",
q:"Arterioles have the highest resistance, but where is blood velocity SLOWEST and why?",
ans:[{t:"Venae cavae — lowest pressure gradient in the entire circuit means the slowest forward movement",ok:false},{t:"Arterioles — highest resistance directly causes the greatest deceleration of flowing blood cells",ok:false},{t:"Capillaries — 2500 cm² total cross-sectional area means velocity crashes 1000× to maximize diffusion",ok:true}],
win:"CAPILLARIES. v = Flow/CSA. 2500 cm² total CSA = 1000× the aorta. Same cardiac output through 1000× more area = velocity crashes. But this isn't a bug — it's the FEATURE. Slow velocity = max transit time = max diffusion. People who pick arterioles are confusing resistance (pressure drop) with velocity (speed). Different quantities.",
lose:"Arterioles have the biggest pressure DROP (resistance) but NOT the lowest velocity. CAPILLARIES have the lowest velocity because total CSA = 2500 cm². v = Q/A. High resistance ≠ low velocity. Get that distinction tattooed on your brain.",
ex:"<strong>v = Q/CSA.</strong> Capillary bed: 2500 cm² → velocity 1000× slower than aorta. High resistance ≠ low velocity. Slow capillary flow is BY DESIGN to maximize diffusion exchange time."},

{ch:"Ch.16 — The Razor's Edge",scene:'capillary',sceneCfg:{clickable:false,nfpLabel:'Mean forces: Outward 28.3 — Inward 28.0 = ???'},
type:'type',difficulty:2,
setup:"Here's where I find out if you understand how CLOSE to disaster the Starling equilibrium normally operates. The mean net filtration pressure is a number so small it'll make you question how any of us are alive.",
q:"What is the mean NFP across the whole capillary (mmHg)? And is this margin wide or razor-thin?",
accepted:['0.3','0.3 razor','0.3 thin','0.3 razor-thin','.3','point three','0.3 narrow'],
hint:"28.3 minus 28.0 = ???",revealHint:"It's a fraction of a mmHg. Barely anything.",
win:"0.3 mmHg. POINT THREE. The entire Starling equilibrium balances on a margin so thin you could shave with it. ~2 mL/min of filtration across the ENTIRE body. Tilt πp down? Edema. Raise Pc? Edema. Damage lymphatics? Edema. Everything comes back to this razor's edge.",
lose:"0.3 mmHg. Outward (28.3) minus inward (28.0). The CONCEPT: razor-thin margin. Any small perturbation — ↓πp, ↑Pc, lymphatic failure — tips it into pathological net filtration (edema).",
ex:"<strong>Mean NFP = 0.3 mmHg.</strong> ~2 mL/min total filtration, handled by lymphatics. Any perturbation causes edema. The system operates on a razor-thin margin."},

{ch:"Ch.16 — Starling Force ID",scene:'capillary',sceneCfg:{clickable:true,nfpLabel:'Cirrhosis patient: albumin crashed. WHICH FORCE FAILS? CLICK IT.'},
type:'click',correctTarget:'pip',difficulty:2,
setup:"Your patient's liver said 'lmao peace' and bounced. Albumin production? Gone. Now every capillary bed in the body is leaking like a busted fire hydrant. The med student says 'it's probably the hydrostatic pressure.' I'm about to commit a HIPAA violation on their academic record.",
q:"👆 CLICK on the Starling force that COLLAPSES when albumin disappears",
win:"πp — plasma colloid osmotic pressure! Albumin is 75% of that force. Without it, there's literally nothing pulling fluid back in at the venous end. The entire capillary becomes a one-way exit for plasma. Lymphatics max out at maybe 50× normal and get absolutely steamrolled.",
lose:"The 'solute magnet' is πp — plasma colloid osmotic pressure. It's the INWARD force at 28 mmHg, 75% from albumin. Kill albumin = kill πp = kill reabsorption across the ENTIRE capillary. Not just the arteriole end — EVERYWHERE.",
ex:"<strong>NFP=(Pc+πif)−(πp+Pif).</strong> πp=28 mmHg, 75% from albumin. Lose albumin → πp crashes → reabsorption fails everywhere."},

{ch:"Ch.17 — Law of Laplace",scene:'vessel_cross',sceneCfg:{radius:85,wall:9,label:'ANEURYSM (r = 2× normal)',eqLines:['T = P × r','Same pressure.','Double radius.','WHY keep growing?']},
type:'mcq',difficulty:2,
setup:"6 cm aortic aneurysm. Same 120 mmHg as literally every other aorta. The OR nurse asks 'if the pressure is the same, why is THIS one about to blow?' and the intern just stares blankly. Don't be the intern.",
q:"Aneurysm radius is 2× normal at SAME pressure. WHY does it keep dilating without further pressure increase?",
ans:[{t:"T=P×r: bigger radius → higher wall tension → structural failure → more dilation (positive feedback loop, no myogenic brake)",ok:true},{t:"Higher turbulent flow velocity in the dilated segment continuously erodes and weakens the vessel wall",ok:false},{t:"Blood stagnation and recirculation zones trigger inflammatory cascades that dissolve wall collagen",ok:false}],
win:"T=P×r — wall tension INCREASES linearly with radius at the SAME pressure. And the myogenic response is GONE in aneurysmal tissue. Smooth muscle replaced by fibrosis. No brake pedal. Dilation → ↑tension → more dilation → RUPTURE. A self-reinforcing death spiral.",
lose:"T=P×r — Law of Laplace. Double r at same P = double T. The CONCEPT: positive feedback. ↑r → ↑T → wall failure → more ↑r. AND the myogenic brake is offline — smooth muscle replaced by fibrosis. Runaway loop → rupture.",
ex:"<strong>Laplace: T=P×r.</strong> Double r → double T at same pressure. Creates positive feedback. Myogenic response is absent in aneurysmal walls → no auto-brake → runaway loop → rupture."},

{ch:"Ch.19 — Renal BP Control",scene:'patient',sceneCfg:{kidney:true,offset:90,infoPanel:['Renal perfusion pressure↑','GFR↑ + ↓Na reabsorption','→ More urine output','→ BP normalizes']},
type:'mcq',difficulty:2,
setup:"Guyton says the kidney is the DOMINANT long-term BP controller. It uses a mechanism called 'pressure diuresis.' Most students can't explain WHY Guyton calls it 'infinite gain.' That phrase is the key to understanding chronic hypertension.",
q:"Why does Guyton call the renal-body fluid system 'infinite gain' for long-term BP control?",
ans:[{t:"Because the kidneys amplify baroreceptor signals infinitely through the renin-angiotensin cascade",ok:false},{t:"Because it NEVER stops adjusting — it keeps excreting salt and water until BP returns to the set point with zero residual error",ok:true},{t:"Because the juxtaglomerular apparatus has unlimited sensitivity to detect arterial pressure changes",ok:false}],
win:"INFINITE GAIN means the system will NOT STOP until BP returns to equilibrium. Zero residual error. Baroreceptors adapt in 1-2 days. Chemoreceptors fatigue. But the kidneys? They just keep pissing until the math works out. You CANNOT have chronic hypertension without shifting the renal function curve. TPR alone can't do it.",
lose:"'Infinite gain' = doesn't stop until equilibrium. Zero residual error. Other systems adapt and plateau. The kidneys never stop adjusting. That's why you must alter the renal function curve to sustain chronic HTN.",
ex:"<strong>'Infinite gain' = no adaptation, no plateau, zero steady-state error.</strong> The kidney keeps adjusting Na/H₂O excretion until BP = set point. This is WHY you can't have chronic HTN without shifting the renal function curve."},

{ch:"Ch.20 — Cardiac Output",scene:'circulation',sceneCfg:{showCO:true},
type:'mcq',difficulty:2,
setup:"Chapter 20 drops a truth bomb that breaks most students' brains: the heart is NOT the boss of cardiac output. The heart is a SERVANT. It pumps whatever the veins deliver. Let that sink in.",
q:"According to Guyton, what PRIMARILY determines cardiac output?",
ans:[{t:"Venous return — controlled by peripheral tissue metabolic needs; the heart is a demand pump via Frank-Starling",ok:true},{t:"Cardiac contractility and heart rate — the heart's intrinsic pumping power sets the maximum output",ok:false},{t:"Mean arterial pressure — higher driving pressure through the circuit means greater cardiac output",ok:false}],
win:"VENOUS RETURN. CONTROLLED BY THE PERIPHERY. The heart is a demand pump. Every tissue controls its own flow based on metabolic need (Ch.17). Sum of all local flows = total venous return = cardiac output. Heart adjusts via Frank-Starling. It doesn't DECIDE output — it FOLLOWS. This integrates Ch.14-20 into one unified picture.",
lose:"CO = venous return. VR is determined by peripheral tissue needs — each tissue regulates its own flow via local metabolic control. The heart uses Frank-Starling to match output to input. Contractility and HR are MODIFIERS, not primary determinants.",
ex:"<strong>CO = Venous Return.</strong> VR determined by peripheral tissue needs. Heart is a demand pump — Frank-Starling matches output to input. The periphery dictates CO, not the heart."},

// ═══ LEVEL 3: CLINICAL SCENARIOS (MODERATE) ═══
{ch:"Ch.15 — Hemorrhage Recovery",scene:'circulation',sceneCfg:{highlightVeins:true,squeeze:true,showCO:true},
type:'mcq',difficulty:3,
setup:"1.5L hemorrhage. MAP crashed to 70. NO IV fluids given. Then in 30 SECONDS — not minutes, SECONDS — MAP recovers to 85. The surgery resident says 'the heart compensated with contractility.' I want to slap the stethoscope off their neck.",
q:"MAP recovers in 30 seconds without fluids — what's the PRIMARY mechanism?",
ans:[{t:"Baroreceptor-mediated tachycardia rapidly increases heart rate to compensate for lost stroke volume",ok:false},{t:"Sympathetic venoconstriction squeezes the venous reservoir (60% of blood, 24× arterial compliance) → instant VR↑ → CO↑",ok:true},{t:"Beta-1 mediated increase in cardiac contractility rapidly augments stroke volume and systolic output",ok:false}],
win:"THE VEINS. 60% of blood volume — THREE LITERS — lives in the venous system. 24× the compliance of arteries. Sympathetics squeeze that balloon and dump HUNDREDS of mL centrally in SECONDS. VR↑ → Frank-Starling → SV↑ → CO↑ → MAP recovers. Contractility takes 30-60+ seconds to meaningfully kick in.",
lose:"The LEAD is the venous reservoir. 60% of blood in veins at 24× arterial compliance. Sympathetic venoconstriction mobilizes volume INSTANTLY → VR↑ → Frank-Starling → CO↑. The 30-second recovery mechanism. Contractility arrives late to the party.",
ex:"<strong>Veins hold ~60% of blood. Compliance = 24× arteries.</strong> Sympathetic venoconstriction → ↓venous volume → ↑VR → Frank-Starling → ↑SV → ↑CO. Fastest volume mobilization mechanism."},

{ch:"Ch.16 — Ascites Root Cause",scene:'patient',sceneCfg:{ascites:true,edema:true,showLiver:true,offset:40,hotspots:[{ox:-8,oy:-14,w:30,h:20,id:'liver',label:'LIVER'},{ox:-30,oy:24,w:60,h:40,id:'legs',label:'LEGS'},{ox:-35,oy:-22,w:70,h:38,id:'belly',label:'BELLY'}],infoPanel:['52M, alcoholic × 20 yrs','Albumin: 1.4 g/dL','!Ascites + peripheral edema','!Liver enzymes: ↑↑↑']},
type:'click',correctTarget:'liver',difficulty:3,
setup:"Look at this absolute unit. 52-year-old. Twenty years of drinking. Belly looks like he swallowed a keg. Legs are puffier than a marshmallow in a microwave. I need you to click on the ROOT CAUSE organ — not the symptom, the SOURCE of this whole shitshow.",
q:"👆 CLICK on the PRIMARY organ failure causing this entire disaster",
win:"THE LIVER. Cirrhosis → can't synthesize albumin → πp collapses → Starling forces tilt toward filtration EVERYWHERE → ascites + portal HTN raises splanchnic Pc → peripheral edema. The belly and legs are DOWNSTREAM. You traced it UPSTREAM. That's clinical reasoning.",
lose:"You clicked the symptom instead of the cause. The LIVER is ground zero. Alcohol → cirrhosis → can't make albumin (1.4 g/dL!) → πp collapses → every capillary bed shifts to net filtration. ALWAYS trace upstream.",
ex:"<strong>Chain:</strong> Alcohol → cirrhosis → ↓albumin → ↓πp → Starling forces favor filtration everywhere. Ascites = peritoneal flooding + portal HTN. Peripheral edema = systemic ↓πp."},

{ch:"Ch.19 — Pressure Diuresis",scene:'patient',sceneCfg:{kidney:true,offset:90,infoPanel:['2L NS bolus given','BP rising: 100→130','Kidneys responding...','UOP: ↑↑↑']},
type:'type',difficulty:3,
setup:"Your patient just got a 2L NS bolus. MAP climbing. Foley bag filling up fast. The student asks 'why is he peeing so much just because the BP went up?' This is the most elegant feedback system in the human body.",
q:"What is the term for increased urine output caused directly by elevated arterial pressure?",
accepted:['pressure diuresis','pressure natriuresis','diuresis','pressure-diuresis','pressurediuresis','renal pressure diuresis'],
hint:"Two-word term: [pressure] + [increased urine output]",revealHint:"Pressure ____esis. Starts with 'diur'",
win:"PRESSURE DIURESIS (and its partner, pressure natriuresis). MAP↑ → renal perfusion pressure↑ → GFR↑ + ↓tubular Na reabsorption → salt and water out → ECFV↓ → BP normalizes. This is the kidney's superpower. 'Infinite gain' because it never stops until equilibrium.",
lose:"It's pressure diuresis (and natriuresis). A DIRECT pressure effect on the kidneys. MAP↑ → GFR↑ + ↓Na reabsorption → more output → ECFV↓ → BP corrects. Not baroreceptor-mediated. Direct pressure effect.",
ex:"<strong>Pressure diuresis/natriuresis:</strong> MAP↑ → renal perfusion↑ → GFR↑ + ↓tubular Na reabsorption → ↑Na/H₂O excretion → ↓ECFV → ↓BP. Direct, non-neural mechanism with 'infinite gain.'"},

// ═══ LEVEL 4: ADVANCED INTEGRATION ═══
{ch:"Ch.18 — Cushing Triad",scene:'brainstem',sceneCfg:{highlightNTS:true,highlightVMC:true,co2:true,firing:true,info:'ICP↑ → CPP↓ → VMC ischemia → two reflexes FIGHTING'},
type:'mcq',difficulty:4,
setup:"Trauma bay. 22yo MVC. GCS dropping. BP 185/110 and CLIMBING. HR 42 and FALLING. Neurosurgery says 'Cushing Triad.' The intern reaches for nicardipine. I physically restrain them. Tell me WHY BP and HR are going in opposite directions.",
q:"Cushing Triad: BP↑↑ but HR↓↓. Why are two opposite responses happening simultaneously?",
ans:[{t:"The heart is failing from excessive afterload causing reflexive cardiogenic bradycardia and backup of pressure",ok:false},{t:"TWO COMPETING REFLEXES: VMC ischemia fires max sympathetics (→BP↑), baroreceptors sense extreme MAP and trigger vagal bradycardia (→HR↓)",ok:true},{t:"Peripheral chemoreceptors cause both responses — hypoxia raises BP and simultaneously decreases heart rate",ok:false}],
win:"A CIVIL WAR INSIDE THE BRAINSTEM. ICP↑ → CPP↓ → VMC ischemia → CO₂ builds locally → VMC fires MAXIMAL sympathetics → MAP 185. AT THE SAME TIME, baroreceptors get SLAPPED by 185 mmHg → Hering's → NTS → vagal surge → HR 42. Two reflexes. Opposite goals. Running simultaneously. And if some clown gives antihypertensives — that BP is COMPENSATORY. You'll kill them faster than the herniation will.",
lose:"Two reflexes running SIMULTANEOUSLY. (1) VMC ischemia → max sympathetics → BP↑↑. (2) Baroreceptors sense BP↑↑ → vagal → HR↓↓. They're COMPETING, not contradictory. And the HTN is compensatory — antihypertensives = death.",
ex:"<strong>Cushing Triad = two competing reflexes.</strong> (1) ICP↑ → VMC ischemia → max sympathetics → MAP↑↑. (2) Baroreceptors → vagal → HR↓↓. The HTN is compensatory. Antihypertensives = removing the brain's last-ditch perfusion attempt."},

{ch:"Ch.18 — Tiered Defense",scene:'brainstem',sceneCfg:{info:'Three tiers: Baroreceptors → Chemoreceptors → CNS Ischemic Response'},
type:'mcq',difficulty:4,
setup:"Your patient is hemorrhaging and MAP is in freefall. The body has THREE TIERED defense systems that activate at different thresholds. Each more desperate than the last. I need the CORRECT escalation order.",
q:"As MAP falls from 100 → 80 → 60 → 20, what is the CORRECT order of the three defense tiers?",
ans:[{t:"Baroreceptors (first, active 60-180 range) → Chemoreceptors (<80, O₂/CO₂/pH) → CNS Ischemic Response (<60, nuclear option)",ok:true},{t:"Chemoreceptors (first to detect falling oxygen) → Baroreceptors (activated by wall stretch changes) → CNS Ischemic (last resort)",ok:false},{t:"CNS Ischemic Response (brainstem detects it first) → Chemoreceptors (peripheral detection) → Baroreceptors (fine-tuning)",ok:false}],
win:"CORRECT: Baroreceptors → Chemoreceptors → CNS Ischemic Response. Escalating desperation. Baroreceptors are everyday buffers, always on. Below 80, chemoreceptors join — screaming about hypoxia, hypercapnia, acidosis. Below 60, the CNS ischemic response — the brainstem's nuclear option. Each tier is progressively more savage. The body's DEFCON system.",
lose:"Order: (1) Baroreceptors — first responders. (2) Chemoreceptors — activate below ~80. (3) CNS Ischemic Response — nuclear option, peaks 15-20 mmHg. Each tier more desperate and powerful.",
ex:"<strong>Tiered BP defense:</strong> (1) Baroreceptors: 60-180 mmHg, everyday buffer. (2) Chemoreceptors: <80, sense O₂↓/CO₂↑/pH↓. (3) CNS Ischemic Response: <60, most powerful sympathetic activator known."},

{ch:"Ch.17 — Myogenic Response",scene:'vessel_cross',sceneCfg:{radius:60,wall:12,label:'MYOGENIC RESPONSE',eqLines:['Pressure↑ → stretch','→ smooth muscle detects','→ contracts → ↓radius','→ stabilizes flow']},
type:'mcq',difficulty:4,
setup:"Blood pressure spikes transiently. The arteriole wall stretches. But instead of passively dilating like a sad balloon, the smooth muscle says 'nah fam' and CONTRACTS. This response protects capillary beds from pressure surges. What's it called?",
q:"When an arteriole's smooth muscle contracts in RESPONSE to being stretched by increased pressure, what is this called?",
ans:[{t:"Reactive hyperemia — the vessel dilates after a period of occlusion to restore blood flow to ischemic tissue",ok:false},{t:"The Bayliss myogenic response — stretch-activated channels in smooth muscle trigger contraction to stabilize flow",ok:true},{t:"Active hyperemia — increased metabolic demand signals the vessel to change tone and match local blood flow",ok:false}],
win:"THE MYOGENIC RESPONSE (Bayliss effect). Stretch → stretch-activated cation channels open → depolarization → Ca²⁺ influx → contraction. It's an INTRINSIC property of vascular smooth muscle — no nerves, no hormones needed. It stabilizes capillary pressure during BP fluctuations. And remember the aneurysm question? When this response is LOST (fibrosis), you get the runaway dilation death spiral.",
lose:"It's the myogenic response (Bayliss effect). Stretch-activated channels → depolarization → contraction. Reactive hyperemia is post-occlusion flow. Active hyperemia is metabolic demand. The myogenic response is pressure-induced contraction.",
ex:"<strong>Myogenic (Bayliss) response:</strong> Pressure↑ → stretch → stretch-activated channels → depolarization → Ca²⁺ → contraction → stabilizes capillary flow. Intrinsic to smooth muscle. Loss of this response = aneurysm progression."},

// ═══ LEVEL 5: BOARD-LEVEL SYNTHESIS ═══
{ch:"Ch.14-20 — Integration",scene:'circulation',sceneCfg:{highlightVeins:true,showCO:true,squeeze:true},
type:'mcq',difficulty:5,
setup:"Final boss. A patient gets a massive transfusion — 2 units packed RBCs. CO increases. MAP increases. But within 2 hours, MAP returns almost to normal WITHOUT any diuretics. Explain the integrated physiological response using concepts from AT LEAST three chapters.",
q:"After a 2-unit transfusion raises MAP, what integrated multi-system response returns MAP toward normal within hours?",
ans:[{t:"Baroreceptors detect MAP↑ → ↓sympathetics → vasodilation + ↓HR; kidneys sense pressure↑ → pressure diuresis excretes excess volume; veins absorb volume via compliance",ok:true},{t:"Chemoreceptors detect improved O₂ delivery → reduce sympathetic drive → vasodilation lowers TPR to normal baseline",ok:false},{t:"Cardiac muscle detects volume overload → releases ANP → directly blocks all sodium reabsorption in the kidneys",ok:false}],
win:"BEAUTIFUL INTEGRATION. (1) Ch.18: Baroreceptors → ↓sympathetics → vasodilation + venodilation + ↓HR. (2) Ch.15: Venous compliance absorbs extra volume at minimal pressure increase. (3) Ch.19: Pressure diuresis/natriuresis — kidneys excrete excess Na/H₂O until ECFV normalizes. (4) Ch.17: Local autoregulation adjusts tissue flows. Multiple systems layered and coordinated. This is what Guyton Ch.14-20 is about — not isolated facts, but an integrated control system.",
lose:"Three systems: (1) Baroreceptors (Ch.18): ↓sympathetics → vasodilation + ↓HR. (2) Venous compliance (Ch.15): absorbs extra volume. (3) Pressure diuresis (Ch.19): kidneys excrete excess volume. Integration across chapters is the whole point of Guyton.",
ex:"<strong>Multi-system integration:</strong> (1) Ch.18: Baroreceptor → ↓sympathetics → vasodilation. (2) Ch.15: Venous compliance buffers volume. (3) Ch.19: Pressure diuresis returns ECFV to normal. (4) Ch.17: Local autoregulation fine-tunes. Multiple overlapping control systems."},

{ch:"Ch.14-20 — Shock Cascade",scene:'patient',sceneCfg:{offset:0,infoPanel:['Hemorrhagic shock','MAP: 45 mmHg','!All defense tiers active','!Positive feedback risk']},
type:'type',difficulty:5,
setup:"MAP 45. All three defense tiers are firing. But at this point, Guyton warns about something terrifying — the transition from COMPENSATED to DECOMPENSATED shock. There's a specific term for when the body's compensation mechanisms start making things WORSE instead of better. What is it?",
q:"What type of feedback converts compensated shock into irreversible decompensated shock?",
accepted:['positive feedback','positive','positive feedback loop','positive-feedback'],
hint:"The opposite of the negative feedback that normally stabilizes physiology.",revealHint:"It starts with 'positive' — the kind of feedback that amplifies rather than corrects.",
win:"POSITIVE FEEDBACK. The most terrifying words in shock physiology. Cardiac ischemia → ↓CO → more ischemia → ↓CO further. Gut bacterial translocation → sepsis → vasodilation → ↓MAP → more ischemia. DIC → bleeding → ↓volume → ↓MAP. Each deterioration causes MORE deterioration. The point where negative feedback (compensatory) transitions to positive feedback (decompensatory) is the line between 'salvageable' and 'dead.' That's why aggressive early resuscitation matters — you're racing against the positive feedback clock.",
lose:"Positive feedback. When compensation mechanisms fail and each deterioration amplifies further deterioration. Cardiac ischemia → ↓CO → more ischemia. Gut translocation → sepsis → vasodilation → more ischemia. The transition from negative to positive feedback = the boundary of irreversible shock.",
ex:"<strong>Positive feedback in shock:</strong> Cardiac ischemia → ↓CO → more ischemia (loop). Gut translocation → sepsis → vasodilation (loop). DIC → bleeding → ↓volume (loop). The transition from negative (compensatory) to positive (decompensatory) feedback marks irreversible shock."},

{ch:"Ch.17 — Autoregulation",scene:'vessel_cross',sceneCfg:{radius:55,wall:10,label:'AUTOREGULATION',eqLines:['Two mechanisms:','1. Myogenic','2. Metabolic','Together = autoregulation']},
type:'mcq',difficulty:5,
setup:"Some organs maintain nearly constant blood flow despite wide swings in perfusion pressure. The brain and kidneys are especially good at this. There are two mechanisms working together. One is intrinsic to the muscle, one is driven by tissue chemistry. Name the concept.",
q:"The brain maintains stable blood flow from MAP 60-150. What are the TWO mechanisms of autoregulation and why does this fail below MAP 60?",
ans:[{t:"Baroreceptor reflex adjusts local sympathetic tone plus chemoreceptor input modifies vascular resistance dynamically",ok:false},{t:"Myogenic response (stretch→contract) + metabolic theory (waste products→dilate); below MAP 60 the arterioles are maximally dilated and cannot compensate further",ok:true},{t:"Endothelin and nitric oxide balance shifts plus local renin-angiotensin activation maintains steady arteriolar tone",ok:false}],
win:"MYOGENIC + METABOLIC. The myogenic response handles rapid pressure changes (stretch → contract). The metabolic theory handles demand matching (waste products → dilate). Together they maintain stable flow from MAP 60-150. Below 60? The arterioles are MAXIMALLY dilated — they've used every trick they have. No more reserve. Flow becomes pressure-dependent and drops linearly. That's why MAP <60 = organ ischemia. The autoregulatory floor has been breached.",
lose:"Autoregulation = myogenic + metabolic. Myogenic: pressure→stretch→contract. Metabolic: ↑waste→dilate, ↓waste→constrict. Below MAP 60, arterioles are maximally dilated — no reserve left. Flow becomes pressure-dependent. That's the autoregulatory floor.",
ex:"<strong>Autoregulation = Myogenic + Metabolic.</strong> Myogenic: intrinsic stretch→contract. Metabolic: waste products dictate tone. Together: stable flow MAP 60-150. Below 60: max dilation, no reserve → flow is pressure-dependent → ischemia."}
,

// ═══════════ NEW QUESTIONS FROM STUDY GUIDE ═══════════
// Ch.14 — Blood Volume Distribution
{ch:"Ch.14 — Blood Volume Distribution",scene:'circulation',sceneCfg:{info:'Systemic distribution'},
type:'mcq',difficulty:1,
setup:"Your attending asks where most of the blood is chilling and you say 'in the vibes.' Bruh.",
q:"What percentage of total blood volume is stored in the systemic veins and venules?",
ans:[{t:"64% — veins are the body's blood storage tanks",ok:true},{t:"13% — that's the arterial share of the pool",ok:false},{t:"9% — nah, that's the pulmonary circulation",ok:false}],
win:"Veins and venules hold roughly 64% of blood volume. They're basically the body's reservoir — low pressure, high compliance, maximum storage.",
lose:"Not quite. Arteries hold 13%, pulmonary holds 9%. The veins dominate at 64% because they're so compliant.",
ex:"<strong>Blood Volume Distribution:</strong> Systemic veins/venules 64%, arteries 13%, pulmonary 9%, heart 7%, arterioles/capillaries 7%."},

// Ch.14 — Vessel Functions
{ch:"Ch.14 — Vessel Functions",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'ARTERIOLE',eqLines:['R = 8ηL / πr⁴']},
type:'mcq',difficulty:1,
setup:"Arterioles said 'I control resistance around here' and honestly? No cap, they weren't lying.",
q:"Which vessels are called the 'resistance vessels' or 'stopcocks' of the circulation?",
ans:[{t:"Capillaries — the exchange vessels of the body",ok:false},{t:"Arterioles — they regulate flow via constriction",ok:true},{t:"Large veins — the storage reservoir vessels",ok:false}],
win:"Arterioles are the stopcocks. Their smooth muscle can dramatically change radius, and since resistance goes as r⁴, small changes = huge resistance shifts.",
lose:"Capillaries are exchange vessels, veins are storage tanks. Arterioles are the resistance vessels — they're the flow gatekeepers.",
ex:"<strong>Arterioles = resistance vessels.</strong> Aorta = conduit, capillaries = exchange, veins = storage, pulmonary = gas exchange."},

// Ch.14 — Poiseuille's Law
{ch:"Ch.14 — Poiseuille's Law",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'POISEUILLE',eqLines:['Q = πΔPr⁴ / 8ηL']},
type:'type',difficulty:2,
setup:"You halve the radius of a vessel and your preceptor asks what happens to flow. Time to pray to the r⁴ gods.",
q:"If vessel radius is halved, by what factor does flow decrease according to Poiseuille's law? (give the number)",
accepted:['16','sixteen','1/16','x16','16x','16 fold','16-fold'],
hint:"Think about r raised to the fourth power...",revealHint:"(1/2)⁴ = 1/16, so flow drops to 1/16th",
win:"Correct! Flow is proportional to r⁴. Halving the radius: (0.5)⁴ = 1/16. Flow drops 16-fold. The r⁴ relationship is why arteriolar tone is so powerful.",
lose:"Flow ∝ r⁴. Halving radius means (1/2)⁴ = 1/16 of original flow. A 16-fold decrease. That fourth power is brutal.",
ex:"<strong>Q = πΔPr⁴/8ηL.</strong> Radius is raised to the 4th power — the dominant variable. Small radius changes cause massive flow changes."},

// Ch.14 — Cross-Sectional Area
{ch:"Ch.14 — Cross-Sectional Area & Velocity",scene:'capillary',sceneCfg:{clickable:false,nfpLabel:'v = Q/A'},
type:'mcq',difficulty:2,
setup:"Capillaries are literally the slowest lane on the highway. It's giving 'school zone energy' fr fr.",
q:"Which vessels have the GREATEST total cross-sectional area, and therefore the slowest blood velocity?",
ans:[{t:"Capillaries — massive total area means slowest velocity",ok:true},{t:"The aorta — largest single vessel means slowest flow",ok:false},{t:"Large veins — big diameter means slow transit speed",ok:false}],
win:"Capillaries win by a mile. Their combined cross-sectional area is enormous, so v = Q/A gives you the slowest velocity — perfect for exchange.",
lose:"The aorta is one big pipe but has the smallest total cross-sectional area. Capillaries have the largest TOTAL area (billions of them), so velocity is lowest there.",
ex:"<strong>v = Q/A.</strong> Cross-sectional area ranking: Capillaries > Venules > Small Veins > Arterioles > Small Arteries > Aorta."},

// Ch.14 — Blood Flow Equation
{ch:"Ch.14 — Blood Flow Equation",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'OHM FLOW',eqLines:['Q = ΔP / R']},
type:'type',difficulty:1,
setup:"This equation is literally Ohm's law cosplaying as physiology. Electricity walked so hemodynamics could run.",
q:"Write the equation for blood flow (Q) in terms of pressure difference and resistance.",
accepted:['Q=ΔP/R','Q = ΔP/R','Q = delta P / R','Q=deltaP/R','Q = ΔP / R','q=dp/r','Q = DP/R','flow = pressure/resistance','Q equals delta P over R'],
hint:"Think of Ohm's law: V = IR, but for fluids...",revealHint:"Flow = Pressure gradient divided by Resistance",
win:"Q = ΔP/R. The hydraulic analog of Ohm's law. Pressure difference drives flow, resistance opposes it. Simple but foundational.",
lose:"The answer is Q = ΔP/R. Pressure difference (ΔP) drives flow (Q) against resistance (R). This is the most fundamental equation in hemodynamics.",
ex:"<strong>Q = ΔP/R.</strong> Analogous to Ohm's law (I = V/R). ΔP is the driving force, R is the opposition to flow."},

// Ch.14 — Resistance in Series
{ch:"Ch.14 — Series vs Parallel Resistance",scene:'circulation',sceneCfg:{info:'Resistance circuits'},
type:'mcq',difficulty:3,
setup:"Series vs parallel resistance? This is literally just circuits class but with blood. Your EE friend would be so proud rn.",
q:"Three vessels in parallel each have resistance of 12 mmHg·min/L. What is the total parallel resistance?",
ans:[{t:"36 mmHg·min/L — you add them in parallel circuits",ok:false},{t:"4 mmHg·min/L — reciprocals sum then invert result",ok:true},{t:"12 mmHg·min/L — parallel keeps resistance identical",ok:false}],
win:"1/Rt = 1/12 + 1/12 + 1/12 = 3/12 = 1/4, so Rt = 4. Parallel circuits always yield LESS total resistance than any single branch.",
lose:"In parallel: 1/Rt = 1/R1 + 1/R2 + 1/R3 = 1/12 + 1/12 + 1/12 = 3/12, so Rt = 4 mmHg·min/L. Not additive like series.",
ex:"<strong>Parallel: 1/R_total = 1/R1 + 1/R2 + 1/R3.</strong> Series: R_total = R1 + R2 + R3. Adding parallel paths always decreases total resistance."},

// Ch.14 — Hematocrit and Viscosity
{ch:"Ch.14 — Viscosity & Hematocrit",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'VISCOSITY',eqLines:['η ↑ → R ↑ → Q ↓']},
type:'mcq',difficulty:2,
setup:"Polycythemia vera patients have blood thicker than a protein shake. Their vessels are NOT having a good time.",
q:"A patient with polycythemia vera has a hematocrit of 65%. How does this affect blood flow?",
ans:[{t:"Flow decreases — higher hematocrit raises viscosity and resistance",ok:true},{t:"Flow increases — more RBCs means better oxygen delivery speed",ok:false},{t:"Flow is unchanged — hematocrit does not affect flow dynamics",ok:false}],
win:"Higher hematocrit = higher viscosity = higher resistance = lower flow. Poiseuille's law has viscosity (η) in the denominator. Thick blood flows slow.",
lose:"More RBCs = thicker blood = higher viscosity. Per Poiseuille (Q = πΔPr⁴/8ηL), higher η in the denominator means lower Q. Flow decreases.",
ex:"<strong>Higher hematocrit = higher viscosity = more resistance.</strong> Normal Hct ~40-45%. Polycythemia can double viscosity and significantly impair flow."},

// Ch.14 — Laminar vs Turbulent Flow
{ch:"Ch.14 — Laminar vs Turbulent Flow",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'FLOW TYPE',eqLines:['Re = ρvd/η']},
type:'type',difficulty:1,
setup:"Turbulent flow is basically blood doing parkour through your vessels instead of walking in a straight line. Chaotic energy.",
q:"What type of blood flow is smooth and orderly with concentric layers, as opposed to turbulent flow?",
accepted:['laminar','laminar flow','streamline','streamlined','parabolic'],
hint:"It's the opposite of turbulent — think smooth layers...",revealHint:"Starts with 'L', describes orderly concentric flow layers",
win:"Laminar flow! Smooth, orderly concentric layers with the fastest flow in the center. Turbulent flow is chaotic and actually increases effective resistance.",
lose:"The answer is laminar flow. Smooth concentric layers, parabolic velocity profile. Turbulence = chaotic flow that wastes energy and increases resistance.",
ex:"<strong>Laminar = smooth layered flow; Turbulent = chaotic.</strong> Turbulence increases effective resistance. High velocity, large diameter, and low viscosity promote turbulence."},

// Ch.14 — Tissue Blood Flow Ranking
{ch:"Ch.14 — Tissue Blood Flow",scene:'patient',sceneCfg:{info:'Organ perfusion'},
type:'mcq',difficulty:2,
setup:"Kidneys get 20% of CO despite being like 0.4% of body weight. Talk about being high-maintenance fr.",
q:"Which organ receives the highest blood flow PER GRAM of tissue weight?",
ans:[{t:"The liver — biggest total flow means highest per-gram flow",ok:false},{t:"The brain — highest metabolic demand per gram of tissue",ok:false},{t:"The kidneys — filtration demands enormous per-gram perfusion",ok:true}],
win:"Kidneys take the crown for flow per gram. They get ~1200 mL/min for ~300g of tissue. That's ~4 mL/min/g. Insane perfusion for filtration purposes.",
lose:"By total volume, liver wins. But per gram of tissue weight, kidneys dominate — they need massive flow for filtration, not just metabolism.",
ex:"<strong>By weight: Kidneys > Adrenals > Thyroid.</strong> By total volume: Liver > Kidneys > Muscle > Brain. Kidneys filter ~180 L/day."},

// Ch.14 — Three Functions of Circulation
{ch:"Ch.14 — Circulatory Functions",scene:'circulation',sceneCfg:{info:'Three main jobs'},
type:'mcq',difficulty:1,
setup:"The circulatory system is basically Amazon Prime, UPS, and waste management all in one. Delivering, shipping, and taking out the trash.",
q:"Which of the following is NOT one of the three main functions of the circulatory system?",
ans:[{t:"Transport of nutrients like O2 and glucose to tissues",ok:false},{t:"Mechanical support and structural scaffolding of organs",ok:true},{t:"Removal of metabolic waste products like CO2 and urea",ok:false}],
win:"Structural support is NOT a circulatory function. The three jobs: (1) transport nutrients/O2, (2) remove waste/CO2, (3) transport hormones for signaling.",
lose:"The three functions are: transport nutrients, remove waste, and transport hormones. Structural support is a connective tissue job, not the circulation's.",
ex:"<strong>3 functions:</strong> (1) Transport nutrients (O2, glucose), (2) Remove waste (CO2, urea), (3) Hormone transport for signaling."},

// Ch.14 — BP Profile
{ch:"Ch.14 — Pressure Drop Profile",scene:'circulation',sceneCfg:{info:'Pressure gradient'},
type:'mcq',difficulty:3,
setup:"Blood pressure's biggest drop happens at the arterioles and honestly it's giving main character energy. The resistance vessels said 'this is MY moment.'",
q:"Where does the largest single drop in blood pressure occur along the systemic circulation?",
ans:[{t:"Across the capillary beds during exchange processes",ok:false},{t:"Across the arterioles due to high resistance walls",ok:true},{t:"Across the aorta from elastic recoil dampening",ok:false}],
win:"The arterioles cause the biggest pressure drop. They're the resistance vessels — massive smooth muscle tone creates the steepest pressure gradient in the entire circuit.",
lose:"The biggest drop is at the arterioles. They're the 'stopcocks' with the most smooth muscle tone. Pressure falls from ~85 mmHg to ~30 mmHg across them.",
ex:"<strong>Largest pressure drop = arterioles.</strong> Aorta ~120/80, post-arteriolar ~30 mmHg, capillaries ~17-35, venous ~0 at vena cava."},

// Ch.14 — Conductance
{ch:"Ch.14 — Conductance",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'CONDUCTANCE',eqLines:['G = 1/R']},
type:'type',difficulty:1,
setup:"Conductance is just resistance doing a handstand. Same concept, flipped perspective. Your physics professor is crying somewhere.",
q:"What is the formula for vascular conductance (G) in terms of resistance (R)?",
accepted:['G=1/R','G = 1/R','1/R','G = 1 / R','conductance = 1/resistance','g=1/r'],
hint:"It's the reciprocal of resistance...",revealHint:"G equals one divided by R",
win:"G = 1/R. Conductance is just the inverse of resistance. High conductance = low resistance = easy flow. Simple reciprocal relationship.",
lose:"Conductance G = 1/R. It's the reciprocal of resistance. When resistance is high, conductance is low, and vice versa.",
ex:"<strong>G = 1/R.</strong> Conductance measures ease of flow. Doubling the radius increases conductance by 16× (r⁴ relationship)."},

// Ch.15 — Pulse Pressure
{ch:"Ch.15 — Pulse Pressure",scene:'patient',sceneCfg:{info:'BP = 120/80'},
type:'type',difficulty:1,
setup:"Bro really said 'what's pulse pressure' on rounds. The attending's disappointed face was a whole vibe. Skill issue detected.",
q:"If systolic pressure is 120 mmHg and diastolic is 80 mmHg, what is the pulse pressure?",
accepted:['40','40 mmHg','40mmHg','40 mm Hg'],
hint:"Pulse pressure = systolic minus diastolic...",revealHint:"120 - 80 = ?",
win:"40 mmHg! Pulse pressure = Systolic - Diastolic = 120 - 80 = 40. It reflects stroke volume and arterial compliance.",
lose:"Pulse pressure = Systolic - Diastolic = 120 - 80 = 40 mmHg. This is a basic vital sign calculation you absolutely must know.",
ex:"<strong>PP = Systolic - Diastolic.</strong> Normal PP ≈ 40 mmHg. Affected by stroke volume (↑SV = ↑PP) and arterial compliance (↓compliance = ↑PP)."},

// Ch.15 — MAP Calculation
{ch:"Ch.15 — Mean Arterial Pressure",scene:'patient',sceneCfg:{info:'MAP formula'},
type:'mcq',difficulty:2,
setup:"MAP is not the average of systolic and diastolic, and if you said that in clinical, your CRNA is about to roast you into next semester.",
q:"Calculate the MAP for a blood pressure of 150/90 mmHg.",
ans:[{t:"110 mmHg — MAP = Diastolic + 1/3(Pulse Pressure)",ok:true},{t:"120 mmHg — MAP = the average of systolic and diastolic",ok:false},{t:"100 mmHg — MAP = Systolic minus Pulse Pressure value",ok:false}],
win:"MAP = 90 + 1/3(150-90) = 90 + 1/3(60) = 90 + 20 = 110 mmHg. Weighted toward diastolic because diastole is ~2/3 of the cardiac cycle.",
lose:"MAP = Diastolic + 1/3(Pulse Pressure) = 90 + 1/3(60) = 90 + 20 = 110 mmHg. It's weighted toward diastolic, not a simple average.",
ex:"<strong>MAP = Diastolic + 1/3(PP).</strong> Or MAP ≈ DBP + 1/3(SBP - DBP). Weighted toward diastole because heart spends ~2/3 of cycle in diastole."},

// Ch.15 — Vein Compliance
{ch:"Ch.15 — Vascular Compliance",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'COMPLIANCE',eqLines:['C = ΔV / ΔP']},
type:'mcq',difficulty:1,
setup:"Veins are 24× more compliant than arteries. They're basically the yoga instructors of the vascular system — flexible queens.",
q:"Veins are approximately how many times more compliant than arteries?",
ans:[{t:"8 times — moderate difference between vein and artery",ok:false},{t:"24 times — veins are highly distensible storage vessels",ok:true},{t:"48 times — veins are almost infinitely more stretchy",ok:false}],
win:"24 times! Veins are thin-walled, highly compliant storage vessels. This is why they hold 64% of blood volume at low pressures.",
lose:"Veins are 24× more compliant than arteries. Their thin walls and large lumens make them excellent volume reservoirs at low pressures.",
ex:"<strong>Compliance = ΔV/ΔP.</strong> Veins 24× more compliant than arteries. Distensibility = ΔV/(ΔP × original V). Compliance = Distensibility × Volume."},

// Ch.15 — Arteriosclerosis Pulse
{ch:"Ch.15 — Abnormal Pulse Contours",scene:'patient',sceneCfg:{info:'Pulse waveform'},
type:'mcq',difficulty:3,
setup:"Grandpa's arteries are literally pipes at this point. Zero flex, all pressure. His pulse waveform is SCREAMING for help.",
q:"A patient with severe arteriosclerosis would most likely show which pulse pressure abnormality?",
ans:[{t:"Widened pulse pressure — stiff arteries can't absorb pulsation",ok:true},{t:"Narrowed pulse pressure — calcified walls restrict expansion",ok:false},{t:"Normal pulse pressure — arteriosclerosis doesn't change PP",ok:false}],
win:"Stiff pipes can't stretch to absorb systolic pressure, so systolic goes UP. They also can't recoil during diastole, so diastolic goes DOWN. Result: widened PP.",
lose:"Arteriosclerosis = stiff arteries = decreased compliance. Systolic rises (can't absorb), diastolic falls (can't recoil). Net effect: widened pulse pressure.",
ex:"<strong>Arteriosclerosis = wide PP.</strong> Also: Aortic stenosis = weak flat pulse, PDA = high systolic/low diastolic, Aortic regurg = no incisura, diastolic drops to ~0."},

// Ch.15 — Korotkoff Sounds
{ch:"Ch.15 — Korotkoff Sounds",scene:'patient',sceneCfg:{info:'BP measurement'},
type:'type',difficulty:2,
setup:"You're taking a manual BP and hear those tapping sounds. Quick — what are they called? Your clinical instructor is watching.",
q:"What are the sounds heard through a stethoscope during blood pressure measurement called?",
accepted:['korotkoff','korotkoff sounds','korotkov','korotkoff sound','korotkow'],
hint:"Named after a Russian surgeon who described them in 1905...",revealHint:"Starts with K, rhymes with 'core-OT-koff'",
win:"Korotkoff sounds! Caused by turbulent flow as the cuff partially compresses the artery. First sound = systolic, disappearance = diastolic.",
lose:"They're called Korotkoff sounds. Turbulent blood flow under a partially occluding cuff creates audible vibrations. Phase I = systolic, Phase V = diastolic.",
ex:"<strong>Korotkoff sounds = turbulent flow sounds during BP measurement.</strong> Appear when cuff pressure drops below systolic, disappear below diastolic."},

// Ch.15 — CVP
{ch:"Ch.15 — Central Venous Pressure",scene:'patient',sceneCfg:{info:'CVP monitoring'},
type:'mcq',difficulty:2,
setup:"CVP is basically the 'how backed up is the heart' meter. When it's high, something's not draining properly and that's not bussin.",
q:"Which of the following would INCREASE central venous pressure (CVP)?",
ans:[{t:"Hemorrhage and hypovolemia causing reduced blood volume",ok:false},{t:"Aggressive vasodilation decreasing systemic venous tone",ok:false},{t:"Heart failure causing blood to dam up behind the heart",ok:true}],
win:"Heart failure means the heart can't pump out what's coming in, so blood backs up → CVP rises. Also increased by hypervolemia and increased venous tone.",
lose:"Heart failure increases CVP because blood dams up behind the failing pump. Hemorrhage and vasodilation would DECREASE CVP by reducing volume/tone.",
ex:"<strong>CVP = RAP.</strong> Increased by: ↑blood volume, ↑venous tone, heart failure. CVP reflects right heart preload and volume status."},

// Ch.15 — Hydrostatic Pressure Standing
{ch:"Ch.15 — Gravitational Effects",scene:'patient',sceneCfg:{info:'Standing hemodynamics'},
type:'mcq',difficulty:3,
setup:"Standing up adds like +90 mmHg to your feet. Your ankles after a 12-hour clinical shift understand this on a spiritual level.",
q:"When standing, approximately what additional hydrostatic pressure is added to the venous pressure in the feet?",
ans:[{t:"+45 mmHg — moderate gravitational column effect on feet",ok:false},{t:"+90 mmHg — full gravitational column from heart to feet",ok:true},{t:"+120 mmHg — exceeds systolic pressure at foot level",ok:false}],
win:"+90 mmHg! The hydrostatic column from the heart to the feet adds about 90 mmHg. This is why dependent edema happens and why venous valves are so important.",
lose:"Standing adds +90 mmHg to foot venous pressure due to the gravitational column. The arterial side gets the same addition, maintaining the perfusion gradient.",
ex:"<strong>Standing: +90 mmHg in feet, negative pressure in head.</strong> Venous valves prevent backflow; failure of valves = varicose veins."},

// Ch.15 — Varicose Veins
{ch:"Ch.15 — Venous Valves",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'VENOUS VALVE',eqLines:['Valves prevent backflow']},
type:'type',difficulty:1,
setup:"When venous valves fail, gravity wins. Your veins turn into saggy balloons and everyone can see them. Varicose vibes only.",
q:"Failure of venous valves in the legs leads to what common condition?",
accepted:['varicose veins','varicose','varicosities','varicose vein','venous insufficiency','chronic venous insufficiency'],
hint:"Dilated, tortuous superficial veins in the legs...",revealHint:"Starts with 'varicose'",
win:"Varicose veins! When valves fail, blood pools in dependent veins under gravitational pressure, causing them to dilate and become tortuous.",
lose:"The answer is varicose veins. Failed valves can't prevent gravitational backflow, so venous pressure in the legs stays high, dilating the veins.",
ex:"<strong>Failed venous valves → varicose veins.</strong> Gravitational hydrostatic pressure (+90 mmHg standing) is normally broken into small segments by competent valves."},

// Ch.15 — Reservoir Organs
{ch:"Ch.15 — Blood Reservoirs",scene:'circulation',sceneCfg:{info:'Reservoir organs'},
type:'mcq',difficulty:2,
setup:"Some organs are literally just vibing as blood storage units. The spleen is basically a blood Costco — bulk storage energy.",
q:"Which of the following is NOT considered a major blood reservoir organ?",
ans:[{t:"The spleen — contracts to release stored blood quickly",ok:false},{t:"The kidneys — filtration organs not storage reservoirs",ok:true},{t:"The liver — hepatic sinusoids hold large blood volumes",ok:false}],
win:"Kidneys are filtration organs, not reservoirs. The major reservoirs are: spleen, liver, large abdominal veins, and venous plexus under the skin.",
lose:"Reservoirs: spleen, liver, large abdominal veins, subcutaneous venous plexus. Kidneys filter blood at high flow rates but don't serve as storage tanks.",
ex:"<strong>Blood reservoirs:</strong> Spleen, liver, large abdominal veins, subcutaneous venous plexus. Can mobilize blood during hemorrhage/exercise."},

// Ch.15 — Incisura
{ch:"Ch.15 — Aortic Pressure Waveform",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'AORTA',eqLines:['Pressure waveform']},
type:'type',difficulty:3,
setup:"There's a little notch in the aortic pressure waveform that tells you the aortic valve just slammed shut. It has a fancy name, bestie.",
q:"What is the name of the notch in the aortic pressure waveform caused by aortic valve closure?",
accepted:['incisura','dicrotic notch','incisura notch','the incisura','the dicrotic notch'],
hint:"Also called the dicrotic notch...",revealHint:"Starts with 'I', Latin for 'cut'",
win:"The incisura (dicrotic notch)! It marks the moment the aortic valve snaps shut at the end of systole. In aortic regurgitation, this notch disappears.",
lose:"It's called the incisura or dicrotic notch. Caused by brief backflow against the closing aortic valve. Absent in aortic regurgitation.",
ex:"<strong>Incisura (dicrotic notch) = aortic valve closure.</strong> Absent in aortic regurgitation because the valve never fully closes."},

// Ch.16 — Capillary Structure
{ch:"Ch.16 — Capillary Wall Structure",scene:'capillary',sceneCfg:{clickable:false,nfpLabel:'Single cell layer'},
type:'mcq',difficulty:1,
setup:"Capillary walls are literally one cell thick. That's like building a house with one layer of Saran wrap. Bold move, evolution.",
q:"What is the basic structural composition of a capillary wall?",
ans:[{t:"Single endothelial cell layer plus a basement membrane",ok:true},{t:"Three layers: intima, media, and adventitia combined",ok:false},{t:"Double endothelial layer with intervening smooth muscle",ok:false}],
win:"Capillaries are just a single endothelial cell layer + basement membrane. No smooth muscle, no adventitia. Thinnest possible wall for maximum exchange.",
lose:"Capillaries have the simplest wall: single endothelial cell layer + basement membrane. Three-layer structure is for arteries. No smooth muscle in capillaries.",
ex:"<strong>Capillary wall = single endothelial cell + basement membrane.</strong> This ultra-thin wall maximizes diffusion for nutrient/waste exchange."},

// Ch.16 — Starling Forces NFP
{ch:"Ch.16 — Net Filtration Pressure",scene:'capillary',sceneCfg:{clickable:false,nfpLabel:'NFP = (Pc + πif) − (πp + Pif)'},
type:'mcq',difficulty:3,
setup:"Starling forces are basically a tug-of-war between hydrostatic pressure pushing fluid out and osmotic pressure pulling it back. May the best force win.",
q:"In the Starling equation for capillary filtration, which force FAVORS filtration (fluid moving OUT of the capillary)?",
ans:[{t:"Plasma colloid osmotic pressure (πp) pulls fluid inward",ok:false},{t:"Capillary hydrostatic pressure (Pc) pushes fluid outward",ok:true},{t:"Interstitial hydrostatic pressure (Pif) pushes fluid out",ok:false}],
win:"Capillary hydrostatic pressure (Pc) pushes fluid OUT of the capillary. Along with interstitial oncotic pressure (πif), these are the two 'filtration' forces.",
lose:"Pc (capillary hydrostatic pressure) pushes fluid OUT. πp pulls fluid IN. NFP = (Pc + πif) − (πp + Pif). Pc and πif favor filtration.",
ex:"<strong>NFP = (Pc + πif) − (πp + Pif).</strong> Forces OUT: Pc, πif. Forces IN: πp, Pif. Overall NFP ≈ 0.3 mmHg (slight net filtration)."},

// Ch.16 — Plasma Proteins and Osmotic Pressure
{ch:"Ch.16 — Plasma Colloid Osmotic Pressure",scene:'capillary',sceneCfg:{clickable:false,nfpLabel:'πp from proteins'},
type:'type',difficulty:1,
setup:"One plasma protein is responsible for most of the oncotic pressure keeping fluid in your vessels. It's the MVP of your blood proteins and it ain't even close.",
q:"Which plasma protein contributes MOST to plasma colloid osmotic pressure?",
accepted:['albumin','albumen','serum albumin'],
hint:"Most abundant plasma protein, made by the liver...",revealHint:"Starts with 'A', ~60% of total plasma protein",
win:"Albumin! It provides about 70-80% of plasma oncotic pressure despite being smaller than globulins, because it's present in much higher concentration.",
lose:"Albumin is the answer. It's the most abundant plasma protein and generates the majority of oncotic pressure. Globulins and fibrinogen contribute less.",
ex:"<strong>Plasma colloid osmotic pressure from: Albumin (most) > Globulins > Fibrinogen.</strong> Low albumin (nephrotic syndrome, liver failure) → edema."},

// Ch.16 — Causes of Edema
{ch:"Ch.16 — Edema Formation",scene:'patient',sceneCfg:{info:'Edema pathophysiology'},
type:'mcq',difficulty:3,
setup:"Patient's legs look like they belong on the Michelin Man. Something's gone very wrong with the Starling forces and the lymphatics said 'not my problem.'",
q:"A patient with nephrotic syndrome develops severe edema. What is the PRIMARY mechanism?",
ans:[{t:"Increased capillary hydrostatic pressure from volume excess",ok:false},{t:"Blocked lymphatic drainage from protein accumulation",ok:false},{t:"Decreased plasma proteins lowering oncotic pressure inward",ok:true}],
win:"Nephrotic syndrome = massive proteinuria = low albumin = decreased plasma oncotic pressure. Less force pulling fluid back into capillaries = edema everywhere.",
lose:"Nephrotic syndrome causes massive protein loss in urine → low plasma albumin → decreased πp → less reabsorption force → fluid leaks into interstitium = edema.",
ex:"<strong>Edema causes: ↑Pc, ↓plasma proteins, ↑permeability, blocked lymphatics.</strong> Nephrotic syndrome primarily works through ↓πp (low albumin)."},

// Ch.16 — Lymphatic Function
{ch:"Ch.16 — Lymphatic System",scene:'capillary',sceneCfg:{clickable:false,nfpLabel:'Lymphatic drainage'},
type:'mcq',difficulty:2,
setup:"Lymphatics are the cleanup crew nobody appreciates. They scavenge leaked proteins and fluid like your roommate eating leftover pizza at 2am.",
q:"What are the TWO main substances that lymphatics return from the interstitium to the venous circulation?",
ans:[{t:"Fluid and proteins — leaked plasma components returned",ok:true},{t:"Red blood cells and platelets — recycled formed elements",ok:false},{t:"Lipids and fat-soluble vitamins only from intestines",ok:false}],
win:"Lymphatics scavenge fluid AND proteins from the interstitium and return them to venous blood. Without this, interstitial oncotic pressure would rise and cause massive edema.",
lose:"Lymphatics return fluid and proteins. Proteins that leak out of capillaries can't get back in directly — only lymphatics can retrieve them and return them to veins.",
ex:"<strong>Lymphatics: scavenge fluid + proteins, return to veins.</strong> Pump by: smooth muscle contraction when stretched + external compression (muscle, breathing)."},

// Ch.16 — BBB Permeability
{ch:"Ch.16 — Capillary Permeability",scene:'capillary',sceneCfg:{clickable:false,nfpLabel:'Tight junctions'},
type:'mcq',difficulty:2,
setup:"Brain capillaries are the bouncers of the vascular system. Tight junctions everywhere, no one's getting in without an invitation. VIP access only.",
q:"Which organ has the TIGHTEST capillary junctions forming a significant permeability barrier?",
ans:[{t:"Liver — sinusoidal capillaries with large fenestrations",ok:false},{t:"Brain — blood-brain barrier with extremely tight junctions",ok:true},{t:"Kidney — glomerular capillaries have open pore structure",ok:false}],
win:"The brain has the tightest capillaries — the blood-brain barrier (BBB). Only lipid-soluble substances and those with active transport cross easily. Liver is the opposite — wide open.",
lose:"Brain capillaries form the BBB with extremely tight junctions. Liver capillaries are the most permeable (wide fenestrations). Kidney glomeruli are fenestrated but selective.",
ex:"<strong>Permeability varies: Brain (BBB) = tightest, Liver = most permeable (wide open).</strong> Brain relies on lipid solubility and specific transporters."},

// Ch.16 — Interstitial Pressure
{ch:"Ch.16 — Interstitial Fluid Pressure",scene:'capillary',sceneCfg:{clickable:false,nfpLabel:'Pif is negative'},
type:'type',difficulty:3,
setup:"Interstitial pressure is actually slightly negative. The lymphatics are pulling so hard they create suction. Vacuum energy fr fr.",
q:"Why is interstitial fluid pressure slightly negative under normal conditions?",
accepted:['lymphatics','lymphatic pumping','lymphatic drainage','lymphatics pump fluid out','lymphatics constantly pump fluid out','lymphatic system'],
hint:"A drainage system is constantly removing fluid...",revealHint:"The lymphatic system actively pumps interstitial fluid away",
win:"Lymphatics constantly pump fluid out of the interstitium, creating slight negative pressure (about -3 mmHg). This actually favors filtration slightly.",
lose:"Lymphatics continuously pump fluid and protein from the interstitium back to veins, creating slight negative interstitial pressure (~-3 mmHg).",
ex:"<strong>Interstitial pressure is negative because lymphatics constantly pump fluid out.</strong> This slight suction helps keep tissues 'dry' and prevents edema."},

// Ch.16 — Filtration Coefficient
{ch:"Ch.16 — Filtration Coefficient",scene:'capillary',sceneCfg:{clickable:false,nfpLabel:'Filtration Rate = Kf × NFP'},
type:'type',difficulty:2,
setup:"There's a coefficient that tells you how leaky your capillaries are. It's like a permeability score — higher means your vessels are basically Swiss cheese.",
q:"What symbol represents the filtration coefficient in the capillary filtration equation?",
accepted:['Kf','kf','K_f','k_f','kF'],
hint:"It multiplies the net filtration pressure to give filtration rate...",revealHint:"Capital K, subscript f",
win:"Kf! The filtration coefficient represents capillary permeability and surface area. Filtration Rate = Kf × NFP. Higher Kf = leakier capillaries.",
lose:"It's Kf (filtration coefficient). Filtration Rate = Kf × NFP. Kf reflects both the permeability and the surface area of the capillary bed.",
ex:"<strong>Filtration Rate = Kf × NFP.</strong> Kf = how leaky the capillary is (permeability × surface area). Varies by organ — brain low, liver high."},

// Ch.17 — Vasodilator Metabolites
{ch:"Ch.17 — Local Blood Flow Control",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'VASODILATION',eqLines:['Metabolites → dilation']},
type:'mcq',difficulty:1,
setup:"Working muscles produce a cocktail of vasodilators that basically scream 'GIVE ME MORE BLOOD' and the vessels comply. Submissive vasculature energy.",
q:"Which of the following is a local vasodilator metabolite released by metabolically active tissue?",
ans:[{t:"Norepinephrine — the major sympathetic neurotransmitter",ok:false},{t:"Angiotensin II — a powerful systemic vasoconstrictor",ok:false},{t:"Adenosine — released during ATP breakdown in active tissue",ok:true}],
win:"Adenosine is a classic local vasodilator. When tissues are active, ATP breaks down → adenosine accumulates → vasodilation → more blood flow. Elegant feedback.",
lose:"Adenosine is the answer. NE and Ang II are vasoconstrictors. Local vasodilators include: adenosine, CO2, H+, K+, histamine, lactic acid, ADP.",
ex:"<strong>Local vasodilators: Adenosine, CO2, H+, K+, Histamine, Lactic acid, ADP.</strong> Released by metabolically active tissue to increase local blood flow."},

// Ch.17 — Autoregulation Range
{ch:"Ch.17 — Autoregulation",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'AUTOREGULATION',eqLines:['Plateau: 65–180 mmHg']},
type:'type',difficulty:2,
setup:"Your organs autoregulate flow over a huge BP range. Below that range though? It's a skill issue for your vessels — they literally cannot compensate anymore.",
q:"What is the approximate LOWER limit of the autoregulation plateau in mmHg?",
accepted:['65','60','60-65','65 mmHg','60 mmHg','~65'],
hint:"Autoregulation fails below this pressure (between 60-70 mmHg)...",revealHint:"It's in the 60s mmHg range",
win:"~65 mmHg! Below this, vessels are maximally dilated and can't compensate further. Flow becomes pressure-dependent. The upper limit is about 180 mmHg.",
lose:"The lower limit is approximately 65 mmHg (upper limit ~180 mmHg). Below 65, vessels are maximally dilated — flow becomes pressure-dependent.",
ex:"<strong>Autoregulation plateau: 65–180 mmHg.</strong> Maintained by myogenic (stretch response) and metabolic (vasodilator washout) mechanisms."},

// Ch.17 — Myogenic Theory
{ch:"Ch.17 — Myogenic Response",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'MYOGENIC',eqLines:['T = P × r (LaPlace)']},
type:'mcq',difficulty:3,
setup:"Blood vessel smooth muscle is basically like 'you stretched me? I'm going to contract harder out of SPITE.' The pettiest physiological response.",
q:"According to the myogenic theory of autoregulation, what happens when arterial pressure increases and stretches the vessel wall?",
ans:[{t:"Smooth muscle relaxes to accommodate the extra volume",ok:false},{t:"Smooth muscle contracts in response to the stretch stimulus",ok:true},{t:"Endothelium releases NO causing further vasodilation now",ok:false}],
win:"Stretch opens ion channels → Ca²⁺ entry → smooth muscle contracts → radius decreases → resistance increases → flow normalizes. LaPlace: T = P×r, so increased P increases wall tension, triggering contraction.",
lose:"Myogenic response: stretch → ion channels open → smooth muscle contracts → ↓radius → ↑resistance → normalized flow. It's an intrinsic property of vascular smooth muscle.",
ex:"<strong>Myogenic theory: Stretch → ion channels open → smooth muscle contracts.</strong> LaPlace: T = P × r. ↑P → ↑T → contraction (↓r) to normalize flow."},

// Ch.17 — Metabolic Theory
{ch:"Ch.17 — Metabolic Theory",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'METABOLIC',eqLines:['Washout theory']},
type:'mcq',difficulty:3,
setup:"High blood pressure literally washes away vasodilators like a power washer on a dirty sidewalk. Vessels constrict because the 'dilate me' signals got yeeted downstream.",
q:"According to the metabolic theory, how does increased arterial pressure lead to autoregulatory vasoconstriction?",
ans:[{t:"High pressure washes out vasodilator metabolites from tissues",ok:true},{t:"High pressure directly stimulates sympathetic vasoconstriction",ok:false},{t:"High pressure activates the renin-angiotensin system locally",ok:false}],
win:"Higher pressure → higher flow → washes out vasodilators (adenosine, CO2, etc.) → smooth muscle loses dilator stimulus → constriction → flow returns to normal. Clean and elegant.",
lose:"Metabolic theory: ↑BP → ↑flow → washout of vasodilator metabolites → vessels constrict → flow normalizes. Not neural, not RAAS — purely local metabolic feedback.",
ex:"<strong>Metabolic theory: High BP → washout vasodilators → vessel constricts → flow normalizes.</strong> Works alongside myogenic theory for autoregulation."},

// Ch.17 — Brain Flow Control
{ch:"Ch.17 — Organ-Specific Flow Control",scene:'brainstem',sceneCfg:{info:'Cerebral blood flow'},
type:'type',difficulty:2,
setup:"The brain doesn't care about adenosine for flow control like other basic organs. It's got its own preferred metabolites because it's ✨special✨.",
q:"What are the primary metabolites that control cerebral blood flow? (name two, separated by a comma)",
accepted:['CO2 and H+','CO2, H+','co2 and h+','co2,h+','CO2/H+','carbon dioxide and hydrogen ions','CO2 H+','h+ and co2','H+ and CO2','co2 h+','carbon dioxide, hydrogen ions','CO2 & H+'],
hint:"Think about what accumulates when neurons are active...",revealHint:"A gas and an ion — both related to acid-base status",
win:"CO2 and H+! The brain uses these acid-base markers to regulate its blood flow. Hypercapnia (high CO2) is one of the most potent cerebral vasodilators.",
lose:"CO2 and H+ are the primary regulators of cerebral blood flow. Rising CO2/H+ → vasodilation → more flow to wash them away. Kidneys use tubuloglomerular feedback instead.",
ex:"<strong>Brain uses CO2/H+ for flow control.</strong> Kidneys use tubuloglomerular feedback (macula densa). Each organ has specialized control mechanisms."},

// Ch.17 — Angiogenic Factors
{ch:"Ch.17 — Angiogenesis",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'ANGIOGENESIS',eqLines:['New vessel growth']},
type:'mcq',difficulty:2,
setup:"Ischemic tissue is literally sending out an SOS for new blood vessels. The angiogenic factors are the bat signal and VEGF is Batman in this scenario.",
q:"Which of the following is the most important angiogenic growth factor released by ischemic tissues?",
ans:[{t:"VEGF — vascular endothelial growth factor for new vessels",ok:true},{t:"TNF-alpha — tumor necrosis factor promotes vessel growth",ok:false},{t:"BNP — brain natriuretic peptide stimulates angiogenesis",ok:false}],
win:"VEGF (Vascular Endothelial Growth Factor) is the star player. Released by ischemic/hypoxic tissue, it stimulates endothelial cell proliferation and new vessel formation.",
lose:"VEGF is the primary angiogenic factor. TNF-alpha is inflammatory, BNP is natriuretic. Other angiogenic factors include FGF and angiogenin.",
ex:"<strong>Angiogenic factors: VEGF, FGF, Angiogenin.</strong> Released by ischemic tissue, rapidly growing tissue, and tissue with high metabolic rates."},

// Ch.17 — Vasoconstrictors List
{ch:"Ch.17 — Vasoconstrictors",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'VASOCONSTRICTION',eqLines:['↓r → ↑R → ↓Q']},
type:'mcq',difficulty:1,
setup:"Some molecules are out here squeezing blood vessels like they owe them money. Vasoconstrictors really said 'tighten up or else.'",
q:"Which of the following is a VASODILATOR rather than a vasoconstrictor?",
ans:[{t:"Angiotensin II — a potent systemic constriction agent",ok:false},{t:"Nitric oxide — endothelial relaxation factor for vessels",ok:true},{t:"Endothelin — most powerful endogenous constrictor known",ok:false}],
win:"Nitric oxide (NO) is the vasodilator! It's released by endothelium and causes smooth muscle relaxation. Ang II and Endothelin are both powerful vasoconstrictors.",
lose:"NO is a vasodilator. Vasoconstrictors: NE, Epi, Ang II, Vasopressin, Endothelin. Vasodilators: Bradykinin, Histamine, NO, Serotonin, Prostaglandins.",
ex:"<strong>Constrictors: NE, Epi, Ang II, Vasopressin, Endothelin.</strong> Dilators: Bradykinin, Histamine, NO, Serotonin, Prostaglandins."},

// Ch.17 — Long-term Remodeling
{ch:"Ch.17 — Vascular Remodeling",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'REMODELING',eqLines:['Long-term adaptation']},
type:'mcq',difficulty:4,
setup:"Blood vessels don't just dilate and constrict — they literally REMODEL over weeks. They're the HGTV renovation crew of your body.",
q:"In chronic hypertension, arterioles undergo inward eutrophic remodeling. What does this mean?",
ans:[{t:"Vessel wall thickens outward with increased cell numbers",ok:false},{t:"Wall rearranges inward — same mass, smaller lumen size",ok:true},{t:"Vessel dilates outward with decreased wall muscle mass",ok:false}],
win:"Inward eutrophic = wall material rearranges around a smaller lumen WITHOUT new cell growth. Same wall mass, smaller internal diameter. Increased wall-to-lumen ratio.",
lose:"Inward eutrophic: wall rearranges around a smaller lumen, same mass, no hypertrophy. Hypertrophic = new cell growth/thickening. Outward = larger lumen.",
ex:"<strong>Remodeling types: inward eutrophic, hypertrophic, outward, outward hypertrophic.</strong> Chronic HTN typically causes inward eutrophic remodeling in resistance vessels."},

// Ch.17 — LaPlace Law
{ch:"Ch.17 — Law of LaPlace",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'LAPLACE',eqLines:['T = P × r']},
type:'type',difficulty:2,
setup:"LaPlace said wall tension = pressure × radius. This is literally why aneurysms are a ticking time bomb — bigger radius = more tension = more expansion = boom.",
q:"Write the Law of LaPlace equation for wall tension (T) in a blood vessel.",
accepted:['T=Pr','T = P × r','T = Pxr','T=P*r','T = P * r','T = P·r','T equals P times r','wall tension = pressure times radius','T=P×r'],
hint:"Tension equals the product of two variables...",revealHint:"T = Pressure × radius",
win:"T = P × r. Wall tension increases with both pressure and radius. This explains why large aneurysms rupture (bigger r = more T) and why myogenic contraction (↓r) protects vessels.",
lose:"T = P × r. When pressure rises, tension rises, triggering myogenic contraction (↓r) to keep tension manageable. Also explains aneurysm progression.",
ex:"<strong>T = P × r (LaPlace).</strong> ↑P → ↑T → myogenic contraction (↓r). Aneurysms: ↑r → ↑T → more dilation → positive feedback → rupture risk."},

// Ch.18 — Sympathetic Innervation
{ch:"Ch.18 — Sympathetic Vascular Control",scene:'circulation',sceneCfg:{info:'Sympathetic innervation'},
type:'mcq',difficulty:1,
setup:"Sympathetics innervate almost everything vascular EXCEPT three types of vessels. They really said 'you three can manage yourselves.' Favoritism is real.",
q:"Which vessels do NOT receive sympathetic innervation?",
ans:[{t:"Arterioles — the major resistance vessels of circulation",ok:false},{t:"Capillaries, precapillary sphincters, and some metarterioles",ok:true},{t:"Large veins — the low-pressure capacitance vessel system",ok:false}],
win:"Capillaries, precapillary sphincters, and some metarterioles lack sympathetic innervation. They're controlled by local metabolic factors instead. Everything else gets sympathetic fibers.",
lose:"Sympathetics innervate almost all vessels EXCEPT capillaries, precapillary sphincters, and some metarterioles. Those are regulated by local metabolic factors.",
ex:"<strong>No sympathetic innervation: capillaries, precapillary sphincters, some metarterioles.</strong> Greatest sympathetic innervation: kidneys, gut, spleen, skin."},

// Ch.18 — Vasomotor Center
{ch:"Ch.18 — Vasomotor Center",scene:'brainstem',sceneCfg:{info:'Medullary centers'},
type:'mcq',difficulty:2,
setup:"The medulla is running the whole cardiovascular show from the brainstem like a DJ at a club. Vasoconstrictor area on the left, vasodilator area on the right. Absolute unit.",
q:"Where is the vasomotor center located?",
ans:[{t:"In the medulla oblongata of the brainstem region",ok:true},{t:"In the hypothalamus of the diencephalon structure",ok:false},{t:"In the cerebral cortex frontal lobe motor area",ok:false}],
win:"The vasomotor center lives in the medulla. It has three parts: vasoconstrictor area, vasodilator area, and sensory area (NTS). It's the CV command center.",
lose:"It's in the medulla oblongata. Three areas: vasoconstrictor area (lateral), vasodilator area (medial), sensory area (NTS receives baroreceptor input).",
ex:"<strong>Vasomotor center in medulla:</strong> Vasoconstrictor area, vasodilator area, sensory area (NTS). Lateral = sympathetic to heart, Medial = parasympathetic/vagus."},

// Ch.18 — Baroreceptor Pathway
{ch:"Ch.18 — Baroreceptor Reflex",scene:'brainstem',sceneCfg:{info:'Baroreceptor pathway'},
type:'mcq',difficulty:3,
setup:"The baroreceptor reflex is your body's auto-pilot for BP. When pressure goes up, it slams the brakes. When it drops, it floors the gas. No cap, elegant engineering.",
q:"Which cranial nerve carries baroreceptor signals from the CAROTID SINUS to the brainstem?",
ans:[{t:"CN X (Vagus) — carries signals from the aortic arch",ok:false},{t:"CN IX (Glossopharyngeal) via Hering's nerve to NTS",ok:true},{t:"CN VII (Facial) — carries taste and autonomic signals",ok:false}],
win:"Carotid sinus → Hering's nerve → CN IX (Glossopharyngeal) → NTS. The aortic arch baroreceptors use CN X (Vagus). Don't mix them up!",
lose:"Carotid sinus signals travel via Hering's nerve → CN IX → NTS in the medulla. CN X carries the aortic arch baroreceptor signals. Different receptors, different nerves.",
ex:"<strong>Carotid sinus → Hering's nerve → CN IX → NTS. Aortic arch → CN X → NTS.</strong> Both converge on NTS in the medulla to modulate sympathetic/parasympathetic output."},

// Ch.18 — Baroreceptor Response Range
{ch:"Ch.18 — Baroreceptor Sensitivity",scene:'brainstem',sceneCfg:{info:'60-180 mmHg range'},
type:'type',difficulty:2,
setup:"Baroreceptors have a sweet spot where they're most sensitive. Conveniently, it's right around normal MAP. Nature really said 'I'll optimize at the set point.'",
q:"At approximately what MAP (in mmHg) are the baroreceptors MOST sensitive to pressure changes?",
accepted:['100','100 mmHg','~100','about 100','100mmHg'],
hint:"It's the normal mean arterial pressure...",revealHint:"Normal MAP is approximately this value — the midpoint of the operating range",
win:"~100 mmHg, which is normal MAP. The sigmoid baroreceptor response curve is steepest here. Operating range is 60-180 mmHg.",
lose:"Baroreceptors are most sensitive at ~100 mmHg (normal MAP). Their response curve is steepest at this point. Range: 60-180 mmHg.",
ex:"<strong>Baroreceptors: range 60-180 mmHg, most sensitive at ~100 mmHg (normal MAP).</strong> ↑Pressure → ↑impulses → inhibit vasoconstrictor center + activate vagal center."},

// Ch.18 — Chemoreceptors
{ch:"Ch.18 — Chemoreceptor Reflex",scene:'brainstem',sceneCfg:{info:'Chemoreceptor activation'},
type:'mcq',difficulty:3,
setup:"Chemoreceptors are the emergency backup when baroreceptors have already given up. They're like 'BP is below 80? Guess it's MY time to shine now.'",
q:"Below what arterial pressure do peripheral chemoreceptors become significantly stimulated as a cardiovascular reflex?",
ans:[{t:"Below 80 mmHg — emergency backup for the baroreceptor reflex",ok:true},{t:"Below 120 mmHg — activated whenever BP dips below normal levels",ok:false},{t:"Below 60 mmHg — only activated during severe cardiovascular shock",ok:false}],
win:"Chemoreceptors (carotid/aortic bodies) sense low O2, high CO2, high H+, but they don't significantly affect CV control until pressure drops below ~80 mmHg.",
lose:"Chemoreceptors aren't significant CV regulators until BP < 80 mmHg. They primarily sense blood gas changes but also serve as emergency BP backup below 80.",
ex:"<strong>Chemoreceptors: sense O2↓/CO2↑/H+↑. Not stimulated until pressure < 80 mmHg.</strong> CNS ischemic response kicks in even later (< 60 mmHg)."},

// Ch.18 — CNS Ischemic Response
{ch:"Ch.18 — CNS Ischemic Response",scene:'brainstem',sceneCfg:{info:'Last resort BP defense'},
type:'mcq',difficulty:4,
setup:"The CNS ischemic response is your brain's absolute last resort. It's the cardiovascular equivalent of pulling the fire alarm when the building is actually on fire.",
q:"The CNS ischemic response is NOT activated until arterial pressure falls below approximately what value, and is greatest at what pressure?",
ans:[{t:"Below 60 mmHg, greatest at 15-20 mmHg — extreme emergency",ok:true},{t:"Below 80 mmHg, greatest at 40-50 mmHg — moderate emergency",ok:false},{t:"Below 100 mmHg, greatest at 60-70 mmHg — early activation",ok:false}],
win:"Not activated until < 60 mmHg, maximal at 15-20 mmHg. This is the 'last ditch' defense — massive sympathetic discharge to try to save cerebral perfusion.",
lose:"CNS ischemic response: not until < 60, greatest at 15-20 mmHg. It's the ultimate emergency response — only when the brain itself is dangerously ischemic.",
ex:"<strong>CNS Ischemic Response: activated < 60 mmHg, greatest at 15-20 mmHg.</strong> Produces massive sympathetic discharge. Cushing's reaction is a special case."},

// Ch.18 — Cushing's Reaction
{ch:"Ch.18 — Cushing's Reaction",scene:'brainstem',sceneCfg:{info:'Increased ICP'},
type:'type',difficulty:4,
setup:"Increased ICP crushes brain arteries, brain goes ischemic, and the CNS ischemic response fires. Blood pressure skyrockets to try to overcome the crushing. This whole sequence has a name, bestie.",
q:"What is the name of the reflex where increased CSF/intracranial pressure triggers massive sympathetic activation and hypertension?",
accepted:['cushing','cushing reaction','cushings reaction','cushing reflex','cushings reflex','cushing response','cushings response',"cushing's reaction","cushing's reflex","cushing's response"],
hint:"Named after a famous neurosurgeon...",revealHint:"Starts with 'C', associated with the Cushing triad (HTN, bradycardia, irregular respirations)",
win:"Cushing's Reaction! ↑ICP → compresses brain arteries → ischemia → CNS ischemic response → massive sympathetic discharge → ↑BP to try to overcome ICP. A neurosurgical emergency sign.",
lose:"It's Cushing's Reaction. ↑CSF pressure → crushes brain arteries → ischemia → CNS ischemic response → ↑BP to overcome CSF pressure. Named after Harvey Cushing.",
ex:"<strong>Cushing's Reaction: ↑ICP → brain artery compression → ischemia → CNS ischemic response → ↑BP.</strong> A late sign of dangerously elevated intracranial pressure."},

// Ch.18 — Vasovagal Syncope
{ch:"Ch.18 — Vasovagal Syncope",scene:'patient',sceneCfg:{info:'Fainting mechanism'},
type:'mcq',difficulty:2,
setup:"Student sees blood during OR observation, goes pale, hits the floor. Classic vasovagal syncope. The circulator barely looked up. 'Another one,' she muttered.",
q:"What is the mechanism of vasovagal syncope?",
ans:[{t:"Baroreceptor failure causing uncontrolled hypertension",ok:false},{t:"Massive parasympathetic activation plus sympathetic withdrawal",ok:true},{t:"Sympathetic hyperactivation causing cardiac tachyarrhythmias",ok:false}],
win:"Vasovagal syncope = massive parasympathetic (vagal) firing + loss of sympathetic tone. HR drops, vessels dilate, BP plummets, brain loses perfusion, you hit the floor.",
lose:"Vasovagal = massive parasympathetic discharge + sympathetic withdrawal. Bradycardia + vasodilation → profound hypotension → cerebral hypoperfusion → syncope.",
ex:"<strong>Vasovagal syncope: massive parasympathetic firing + loss of sympathetic tone.</strong> Result: bradycardia, vasodilation, hypotension, loss of consciousness."},

// Ch.18 — Bainbridge Reflex
{ch:"Ch.18 — Bainbridge Reflex",scene:'patient',sceneCfg:{info:'Atrial stretch reflex'},
type:'type',difficulty:3,
setup:"Rapid IV fluid bolus stretches the atria and suddenly HR goes up. There's a specific reflex for that, and no, it's not just 'the heart panicking.'",
q:"What reflex causes heart rate to increase when the atria are stretched by increased venous return?",
accepted:['bainbridge','bainbridge reflex','the bainbridge reflex','bainbridge response'],
hint:"Named after a British physiologist, not the island...",revealHint:"Starts with 'B', describes atrial stretch → ↑HR",
win:"The Bainbridge reflex! Atrial stretch → vagal afferents → medulla → increased HR. It prevents blood from damming up in the veins and atria during volume loading.",
lose:"It's the Bainbridge reflex. Atrial stretch → vagal afferents to medulla → ↑HR. Helps the heart handle sudden increases in venous return.",
ex:"<strong>Bainbridge reflex: atrial stretch → ↑HR via vagal afferents to medulla.</strong> Prevents venous congestion when venous return suddenly increases."},

// Ch.18 — Nervous System Speed
{ch:"Ch.18 — Neural BP Control",scene:'brainstem',sceneCfg:{info:'Rapid response'},
type:'mcq',difficulty:2,
setup:"The sympathetic nervous system can double your BP in 5-10 seconds. That's faster than you can Google 'why is my blood pressure high.' Absolute speedrun.",
q:"The nervous system can approximately double arterial pressure within 5-10 seconds by doing which THREE things simultaneously?",
ans:[{t:"Constrict arterioles (↑TPR), constrict veins (↑VR), stimulate heart (↑HR/contractility)",ok:true},{t:"Release renin (↑Ang II), release ADH (↑volume), release aldosterone (↑Na retention)",ok:false},{t:"Increase respirations (↑O2), release cortisol (↑glucose), increase GFR (↑filtration)",ok:false}],
win:"All three happen simultaneously: (1) Arteriolar constriction ↑TPR, (2) Large vessel/venous constriction ↑VR → ↑CO, (3) Direct cardiac stimulation ↑HR and contractility.",
lose:"The nervous system triples down: constrict arterioles (↑TPR), constrict large vessels/veins (↑VR→↑CO), directly ↑HR and contractility. RAAS is too slow (minutes-hours).",
ex:"<strong>Neural BP doubling in 5-10 sec:</strong> (1) Arteriolar constriction ↑TPR, (2) Venous constriction ↑VR/CO, (3) Direct cardiac ↑HR/contractility."},

// Ch.18 — ANP Reflex
{ch:"Ch.18 — Atrial Natriuretic Peptide",scene:'patient',sceneCfg:{info:'Low-pressure receptors'},
type:'mcq',difficulty:3,
setup:"When your atria stretch from too much volume, they release a peptide that says 'dump the sodium and water ASAP.' The kidneys are like 'say less fam.'",
q:"Atrial stretch triggers release of ANP, which causes all of the following EXCEPT:",
ans:[{t:"Decreased ADH secretion from the posterior pituitary gland",ok:false},{t:"Increased sodium reabsorption in the collecting duct tubules",ok:true},{t:"Increased glomerular filtration rate in the kidney nephrons",ok:false}],
win:"ANP DECREASES sodium reabsorption (natriuresis), not increases it. ANP's whole job is to reduce volume: ↓ADH, ↑GFR, ↓Na reabsorption.",
lose:"ANP does the opposite — it DECREASES Na reabsorption. ANP response to atrial stretch: ↓ADH, ↑GFR, ↓Na reabsorption. All aimed at reducing blood volume.",
ex:"<strong>Atrial stretch → ANP → ↓ADH, ↑GFR, ↓Na reabsorption.</strong> All mechanisms work to reduce blood volume and relieve the atrial stretch."},

// Ch.18 — Greatest Sympathetic Innervation
{ch:"Ch.18 — Sympathetic Distribution",scene:'circulation',sceneCfg:{info:'Sympathetic targets'},
type:'mcq',difficulty:2,
setup:"Some organs get way more sympathetic love than others. The kidneys and gut are basically drenched in sympathetic fibers. Talk about clingy innervation.",
q:"Which organs have the GREATEST density of sympathetic vasoconstrictor fibers?",
ans:[{t:"Heart and skeletal muscle — high metabolic demand organs",ok:false},{t:"Brain and lungs — critical organ perfusion territories",ok:false},{t:"Kidneys, gut, spleen, and skin — major constriction targets",ok:true}],
win:"Kidneys, gut, spleen, and skin have the densest sympathetic innervation. During fight-or-flight, blood is diverted FROM these organs TO muscles and brain.",
lose:"Greatest sympathetic vasoconstrictor fibers: kidneys, gut, spleen, skin. These organs are 'expendable' during emergencies — blood gets redistributed to muscles/brain.",
ex:"<strong>Greatest sympathetic innervation: kidneys, gut, spleen, skin.</strong> During stress, these vasoconstrict to redirect flow to exercising muscles and the brain."},

// Ch.19 — Infinite Gain
{ch:"Ch.19 — Renal-Body Fluid Mechanism",scene:'circulation',sceneCfg:{kidney:true,offset:90,infoPanel:['Infinite gain','Long-term BP control']},
type:'mcq',difficulty:3,
setup:"The kidney's BP control has 'infinite gain.' That means it will ALWAYS win in the long run. Baroreceptors may be fast but kidneys are inevitable. Thanos energy.",
q:"What does 'infinite gain' mean in the context of the renal-body fluid mechanism for long-term blood pressure control?",
ans:[{t:"Kidneys amplify every BP signal infinitely through RAAS cascade",ok:false},{t:"The kidney eventually returns BP precisely to its set point value",ok:true},{t:"Kidneys can raise BP to any level needed during emergencies",ok:false}],
win:"Infinite gain = the kidney ALWAYS brings BP back to the exact set point. Not 90% correction, not 99% — exactly 100%. It keeps adjusting until equilibrium is perfect.",
lose:"Infinite gain means the kidney forces BP precisely to its set point every single time. No other system does this. The kidney will keep adjusting pressure diuresis/natriuresis until BP is exactly right.",
ex:"<strong>Infinite gain: kidney forces BP precisely back to set point every time.</strong> No error signal remains. This is why the kidney is the ultimate long-term BP regulator."},

// Ch.19 — Pressure Natriuresis
{ch:"Ch.19 — Pressure Diuresis/Natriuresis",scene:'circulation',sceneCfg:{kidney:true,offset:90,infoPanel:['↑BP → ↑Na excretion','↑BP → ↑urine output']},
type:'type',difficulty:2,
setup:"When BP goes up, the kidneys pee out more sodium and water. When BP drops, they hold on to everything like a hoarder. Simple but effective long-term strategy.",
q:"What is the term for increased sodium excretion by the kidneys in response to increased arterial pressure?",
accepted:['pressure natriuresis','natriuresis','pressure-natriuresis'],
hint:"Pressure-induced sodium excretion...",revealHint:"Pressure ___uresis (think sodium = natrium)",
win:"Pressure natriuresis! Higher BP → more sodium excreted → water follows → blood volume decreases → BP comes back down. The kidney's infinite gain mechanism.",
lose:"Pressure natriuresis. ↑BP → ↑renal Na excretion → ↑water excretion → ↓blood volume → ↓BP. Paired with pressure diuresis (↑water excretion).",
ex:"<strong>Pressure natriuresis = ↑BP → ↑Na excretion.</strong> Pressure diuresis = ↑BP → ↑urine output. Together they form the kidney's long-term BP control mechanism."},

// Ch.19 — TPR and Long-term BP
{ch:"Ch.19 — TPR vs Long-term BP",scene:'circulation',sceneCfg:{kidney:true,offset:90,infoPanel:['Kidneys compensate']},
type:'mcq',difficulty:4,
setup:"Plot twist: changing TPR alone doesn't change long-term BP. The kidneys just compensate with pressure diuresis. TPR said 'I changed everything!' Kidneys said 'lol no you didn't.'",
q:"Why do isolated changes in total peripheral resistance (TPR) NOT cause long-term changes in arterial pressure?",
ans:[{t:"Because baroreceptors reset and normalize the pressure quickly",ok:false},{t:"Because kidneys compensate with pressure diuresis/natriuresis",ok:true},{t:"Because cardiac output adjusts inversely to maintain same BP",ok:false}],
win:"Even if TPR doubles, the kidney's pressure diuresis/natriuresis shifts to compensate. Only changes that alter the renal function curve itself can change long-term BP.",
lose:"Kidneys compensate! ↑TPR → transient ↑BP → ↑pressure diuresis → ↓volume → BP returns to set point. Must shift the RENAL FUNCTION CURVE to change long-term BP.",
ex:"<strong>TPR changes don't affect long-term BP — kidneys compensate.</strong> Only altering the renal function curve itself (shifting it) changes long-term arterial pressure."},

// Ch.19 — Salt Sensitivity
{ch:"Ch.19 — Salt Sensitivity",scene:'patient',sceneCfg:{info:'Salt-sensitive HTN'},
type:'mcq',difficulty:3,
setup:"Some people eat a bag of chips and their BP doesn't budge. Others eat one french fry and their MAP spikes 10 mmHg. Salt sensitivity is real and it's not fair.",
q:"What characterizes a 'salt-sensitive' individual in terms of blood pressure regulation?",
ans:[{t:"Their baroreceptors are hypersensitive to sodium fluctuations",ok:false},{t:"Their kidneys struggle to excrete sodium so BP spikes with salt",ok:true},{t:"Their taste receptors detect salt at lower thresholds than normal",ok:false}],
win:"Salt sensitive = kidneys can't efficiently excrete excess sodium. Salt load → volume expansion → BP rises significantly. Salt insensitive kidneys easily dump excess sodium.",
lose:"Salt sensitivity is a renal issue: kidneys struggle to excrete sodium, so salt intake causes volume expansion and BP spikes. Nothing to do with taste or baroreceptors.",
ex:"<strong>Salt insensitive: kidneys easily excrete salt. Salt sensitive: kidneys struggle → BP spikes with salt.</strong> Salt sensitivity predicts HTN risk."},

// Ch.19 — RAAS and Ang II
{ch:"Ch.19 — Renin-Angiotensin System",scene:'circulation',sceneCfg:{kidney:true,offset:90,infoPanel:['Ang II effects','Aldosterone release']},
type:'mcq',difficulty:2,
setup:"Angiotensin II is that overachiever who does EVERYTHING. Vasoconstriction? Check. Aldosterone? Check. Thirst? Check. Salt retention? Check. It's giving 'I don't need a team.'",
q:"Angiotensin II shifts the renal function curve rightward by doing which of the following?",
ans:[{t:"Vasodilation of renal arterioles plus blocking aldosterone",ok:false},{t:"Vasoconstriction plus stimulating aldosterone for Na retention",ok:true},{t:"Increasing GFR plus inhibiting sodium channel reabsorption",ok:false}],
win:"Ang II: (1) powerful vasoconstrictor, (2) stimulates aldosterone from adrenal cortex → salt/water retention. Both shift the renal function curve RIGHT (higher BP set point).",
lose:"Ang II = vasoconstriction + aldosterone release → salt/water hoarding → rightward shift of renal function curve → higher long-term BP set point.",
ex:"<strong>Ang II: vasoconstrictor + aldosterone release → salt/water hoarding → rightward shift of renal function curve.</strong> ACE inhibitors block this entire cascade."},

// Ch.19 — HTN Stages
{ch:"Ch.19 — Hypertension Classification",scene:'patient',sceneCfg:{info:'BP classification'},
type:'type',difficulty:1,
setup:"Your patient's BP is 145/95. The attending asks what stage of hypertension that is. You better know the AHA guidelines or it's gonna be embarrassing real quick.",
q:"A patient has BP of 145/95 mmHg. What stage of hypertension is this? (answer: stage 1 or stage 2)",
accepted:['stage 2','2','stage II','stage two','hypertension stage 2','HTN stage 2'],
hint:"Stage 2 starts at 140/90...",revealHint:"≥140 systolic OR ≥90 diastolic = Stage 2",
win:"Stage 2 HTN! Stage 2 = ≥140 systolic OR ≥90 diastolic. This patient has both. Stage 1 = 130-139/80-89. Elevated = 120-129/<80.",
lose:"Stage 2 HTN: ≥140/≥90. This patient (145/95) exceeds both thresholds. Normal <120/<80, Elevated 120-129/<80, Stage 1 = 130-139/80-89.",
ex:"<strong>HTN stages: Normal <120/<80, Elevated 120-129/<80, Stage 1: 130-139/80-89, Stage 2: ≥140/≥90.</strong>"},

// Ch.19 — Pheochromocytoma
{ch:"Ch.19 — Secondary Hypertension",scene:'patient',sceneCfg:{info:'Pheochromocytoma'},
type:'mcq',difficulty:4,
setup:"Episodic hypertensive crises with headache, diaphoresis, and palpitations. Your differential better include the adrenal medulla tumor or you're getting fired from the case. No pressure.",
q:"A patient has paroxysmal hypertension with headaches, sweating, and tachycardia. Elevated urinary metanephrines are found. What is the diagnosis?",
ans:[{t:"Primary hyperaldosteronism — Conn syndrome with hypokalemia",ok:false},{t:"Pheochromocytoma — catecholamine-secreting adrenal tumor mass",ok:true},{t:"Renal artery stenosis — renovascular hypertension from plaque",ok:false}],
win:"Pheochromocytoma! Adrenal medulla tumor secreting catecholamines (epi/NE). Diagnosed by metanephrines (catecholamine metabolites). Classic triad: headache, sweating, palpitations.",
lose:"Pheochromocytoma — catecholamine-secreting tumor of the adrenal medulla. Metanephrines are the diagnostic test. Hyperaldosteronism has hypokalemia and suppressed renin.",
ex:"<strong>Pheochromocytoma: ↑catecholamines from adrenal medulla, diagnosed by metanephrines.</strong> Episodic HTN, headaches, diaphoresis, palpitations."},

// Ch.19 — Adrenal Zones
{ch:"Ch.19 — Adrenal Cortex Zones",scene:'patient',sceneCfg:{info:'Adrenal gland layers'},
type:'type',difficulty:2,
setup:"The adrenal cortex zones go from outside to inside: GFR — Glomerulosa, Fasciculata, Reticularis. 'Go Find Rex' or 'Salt, Sugar, Sex' — pick your mnemonic.",
q:"Which zone of the adrenal cortex produces aldosterone?",
accepted:['glomerulosa','zona glomerulosa','the glomerulosa','zona glomerulosa layer'],
hint:"Outermost layer of the adrenal cortex...",revealHint:"Sounds like 'glomerulus' — starts with G, outermost zone",
win:"Zona Glomerulosa! The outermost cortical layer makes aldosterone (mineralocorticoid). GFR mnemonic: Glomerulosa=aldosterone, Fasciculata=cortisol, Reticularis=androgens.",
lose:"Zona Glomerulosa makes aldosterone. Fasciculata = cortisol. Reticularis = androgens. Medulla = catecholamines. Remember: Salt, Sugar, Sex from outside in.",
ex:"<strong>Adrenal zones (outside→in): Glomerulosa=aldosterone, Fasciculata=cortisol, Reticularis=androgens, Medulla=catecholamines.</strong>"},

// Ch.19 — Renal Artery Stenosis
{ch:"Ch.19 — Renovascular HTN",scene:'circulation',sceneCfg:{kidney:true,offset:90,infoPanel:['Renal artery stenosis','↑Renin → ↑Ang II']},
type:'mcq',difficulty:4,
setup:"Kidney sees low flow from a stenosed artery and thinks the WHOLE BODY is hypotensive. Releases renin like crazy. The kidney is literally lying to the rest of the circulation.",
q:"Why does renal artery stenosis cause systemic hypertension?",
ans:[{t:"Kidney detects ↓flow → ↑renin → ↑Ang II + aldosterone → ↑BP",ok:true},{t:"Stenosis directly increases systemic resistance upstream of kidney",ok:false},{t:"Reduced GFR causes acidosis which stimulates the vasomotor center",ok:false}],
win:"Stenosed renal artery → kidney senses low perfusion → releases renin → Ang II (vasoconstrictor) + aldosterone (Na/H2O retention) → BP rises systemically. Classic secondary HTN.",
lose:"The kidney senses low perfusion → ↑renin → ↑Ang II + aldosterone → vasoconstriction + salt/water retention → systemic HTN. The kidney is 'fooled' by low local flow.",
ex:"<strong>Renal artery stenosis: ↓renal flow → ↑renin → ↑Ang II + aldosterone → systemic HTN.</strong> Also seen in aortic coarctation (↓renal flow → same mechanism)."},

// Ch.19 — Primary Hyperaldosteronism
{ch:"Ch.19 — Conn Syndrome",scene:'patient',sceneCfg:{info:'Primary hyperaldosteronism'},
type:'mcq',difficulty:4,
setup:"HTN + hypokalemia + suppressed renin. This isn't your garden-variety essential hypertension — the adrenal is going rogue and pumping out aldosterone like it's going out of style.",
q:"A patient has hypertension, hypokalemia, and LOW renin. What is the most likely diagnosis?",
ans:[{t:"Pheochromocytoma — catecholamine excess from adrenal medulla",ok:false},{t:"Renal artery stenosis — would actually have HIGH renin levels",ok:false},{t:"Primary hyperaldosteronism — autonomous aldosterone, suppressed renin",ok:true}],
win:"Primary hyperaldosteronism (Conn syndrome)! Autonomous aldosterone secretion → Na/H2O retention → HTN + K wasting → hypokalemia. Renin is suppressed by negative feedback.",
lose:"Primary hyperaldosteronism: autonomous ↑aldo → Na retention → HTN, K wasting → hypokalemia, and renin is LOW (suppressed by the high aldo). Renal artery stenosis has HIGH renin.",
ex:"<strong>Primary hyperaldosteronism: ↑aldo, ↓renin, hypokalemia, HTN.</strong> vs Renal artery stenosis: ↑renin, ↑aldo. Key difference = renin level."},

// Ch.19 — ACE Inhibitor Effect
{ch:"Ch.19 — ACE Inhibitors",scene:'circulation',sceneCfg:{kidney:true,offset:90,infoPanel:['RAAS blockade']},
type:'mcq',difficulty:3,
setup:"Give a patient an ACE inhibitor and suddenly their BP swings wildly with salt intake. You just removed their RAAS buffer and now they're at sodium's mercy. Oops.",
q:"Why do patients on ACE inhibitors have exaggerated blood pressure responses to changes in salt intake?",
ans:[{t:"ACE inhibitors directly increase salt absorption in the gut",ok:false},{t:"ACE inhibitors block RAAS so it can't buffer salt-induced changes",ok:true},{t:"ACE inhibitors impair baroreceptor sensitivity to salt levels",ok:false}],
win:"ACE inhibitors block RAAS, removing the body's main buffer for salt/volume changes. Normally Ang II adjusts the renal function curve; without it, salt swings cause BP swings.",
lose:"Blocking RAAS removes the system that normally compensates for salt intake changes. Without Ang II/aldosterone adjustments, the renal function curve can't shift, so BP follows salt directly.",
ex:"<strong>ACE inhibitor blocks RAAS → can't buffer salt intake changes → large salt swings = large BP swings.</strong> This is why salt sensitivity increases on ACE inhibitors."},

// Ch.19 — ECFV Expansion
{ch:"Ch.19 — Sodium and Volume",scene:'circulation',sceneCfg:{kidney:true,offset:90,infoPanel:['Na+ → ECFV']},
type:'type',difficulty:1,
setup:"Sodium is the volume boss. Where sodium goes, water follows. It's like sodium is the popular kid and water molecules are all 'omg can I sit with you?'",
q:"Sodium expands extracellular fluid volume by two mechanisms: pulling water osmotically and stimulating what two things?",
accepted:['thirst and ADH','ADH and thirst','thirst/ADH','ADH/thirst','thirst, ADH','ADH, thirst','vasopressin and thirst','thirst and vasopressin'],
hint:"One makes you drink, one makes you retain water at the kidney...",revealHint:"Thirst + Anti-Diuretic Hormone",
win:"Thirst and ADH! Sodium directly pulls water (osmosis), stimulates thirst (drink more), and triggers ADH release (retain more water). Triple mechanism for volume expansion.",
lose:"Sodium stimulates thirst and ADH release. ↑Na → ↑osmolality → thirst + ADH → water intake + water retention → ECFV expansion → ↑blood volume → ↑BP.",
ex:"<strong>↑Na → pulls water + stimulates thirst + ADH → ↑ECFV → ↑blood volume → ↑VR → ↑CO → ↑AP.</strong>"},

// Ch.20 — Cardiac Output Factors
{ch:"Ch.20 — Cardiac Output",scene:'patient',sceneCfg:{info:'CO determinants'},
type:'mcq',difficulty:1,
setup:"CO = HR × SV. This is literally day one cardio physiology. If you don't know this, please close the textbook and go home. Actually no, keep studying.",
q:"Cardiac output is the product of which two variables?",
ans:[{t:"Heart rate multiplied by stroke volume per beat",ok:true},{t:"Mean arterial pressure times total peripheral resistance",ok:false},{t:"Venous return multiplied by ejection fraction percentage",ok:false}],
win:"CO = HR × SV. Simple multiplication: beats per minute × mL per beat = mL per minute (typically ~5,000 mL/min or 5 L/min at rest).",
lose:"CO = HR × SV. MAP = CO × TPR is the pressure equation. CO is determined by how fast the heart beats (HR) and how much it ejects per beat (SV).",
ex:"<strong>CO = HR × SV.</strong> Normal resting: ~72 bpm × ~70 mL = ~5 L/min. Also: CO = VR (Frank-Starling: heart pumps what it receives)."},

// Ch.20 — Frank-Starling Mechanism
{ch:"Ch.20 — Frank-Starling Law",scene:'patient',sceneCfg:{info:'Starling curve'},
type:'mcq',difficulty:2,
setup:"Frank-Starling basically says the heart is a 'you get what you give' kind of organ. More blood in = more blood out. The heart is literally an agreeable pump.",
q:"According to the Frank-Starling mechanism, what happens when venous return increases?",
ans:[{t:"Heart rate increases reflexively via baroreceptor activation",ok:false},{t:"Stroke volume increases due to greater preload stretching fibers",ok:true},{t:"Peripheral resistance increases to match the higher flow rate",ok:false}],
win:"More VR → more ventricular filling → more myocardial stretch → more forceful contraction → greater SV. The heart pumps whatever is returned to it. Intrinsic autoregulation.",
lose:"Frank-Starling: ↑VR → ↑preload → ↑myocardial stretch → ↑SV. The heart automatically matches its output to the venous return. No nervous system required.",
ex:"<strong>Frank-Starling: heart pumps whatever is returned to it.</strong> ↑VR → ↑preload → ↑stretch → ↑force → ↑SV → ↑CO. Intrinsic cardiac autoregulation."},

// Ch.20 — Cardiac Index Peak
{ch:"Ch.20 — Cardiac Index",scene:'patient',sceneCfg:{info:'CI by age'},
type:'type',difficulty:1,
setup:"Cardiac index peaks in childhood and it's all downhill from there. Literally everyone's cardiac performance peaks at age 10. We're all washed after that.",
q:"At approximately what age does the cardiac index (CI) peak?",
accepted:['10','10 years','age 10','~10','about 10','ten','10 years old'],
hint:"Still in elementary school...",revealHint:"Double digits, just barely — first year of double-digit age",
win:"Age 10! CI (CO per m² BSA) peaks in childhood around age 10, then steadily declines with age due to decreasing metabolic rate and cardiac reserve.",
lose:"CI peaks at approximately age 10, then progressively declines. By old age, CI is significantly lower due to reduced metabolic rate and cardiac reserve.",
ex:"<strong>CI peaks at age 10, then drops with age.</strong> CI = CO/BSA (L/min/m²). Normalizes CO for body size. Reflects declining metabolic needs with age."},

// Ch.20 — High CO Conditions
{ch:"Ch.20 — High Output States",scene:'patient',sceneCfg:{info:'High CO causes'},
type:'mcq',difficulty:3,
setup:"Some conditions make the heart pump like crazy. Beriberi, AV fistulas, hyperthyroidism — the heart's working overtime and nobody asked for this shift assignment.",
q:"Which of the following causes HIGH cardiac output heart failure?",
ans:[{t:"Coronary artery blockage reducing myocardial blood supply",ok:false},{t:"Beriberi (thiamine deficiency) causing systemic vasodilation",ok:true},{t:"Severe aortic stenosis causing outflow tract obstruction",ok:false}],
win:"Beriberi (thiamine deficiency) → systemic vasodilation → low TPR → high CO to maintain BP. The heart eventually fails from overwork. Classic high-output failure.",
lose:"Beriberi = thiamine deficiency → vasodilation → decreased TPR → compensatory high CO. Other high CO states: AV fistula, hyperthyroidism, Paget's disease.",
ex:"<strong>High CO causes: Beriberi, AV fistula, hyperthyroidism, pulmonary disease (hypoxic vasodilation), Paget's disease.</strong> All involve decreased peripheral resistance."},

// Ch.20 — Hypoeffective Heart Causes
{ch:"Ch.20 — Hypoeffective Heart",scene:'patient',sceneCfg:{info:'Decreased pump function'},
type:'mcq',difficulty:2,
setup:"Hypoeffective heart = your pump is trash. Could be from HTN, bad valves, MI, rhythm issues — basically all the ways the heart can say 'I'm not doing my job properly.'",
q:"Which of the following would cause a hypoeffective heart?",
ans:[{t:"Hyperthyroidism increasing metabolic rate system-wide",ok:false},{t:"Arteriovenous fistula decreasing peripheral resistance",ok:false},{t:"Severe valvular disease impairing forward flow mechanics",ok:true}],
win:"Severe valvular disease = hypoeffective heart. The pump can't efficiently move blood forward. Other causes: severe HTN, coronary blockage, abnormal rhythms, myocarditis.",
lose:"Hypoeffective heart causes: severe HTN, inhibited nervous excitation, abnormal rhythm, coronary blockage, valvular disease, congenital defects, myocarditis.",
ex:"<strong>Hypoeffective heart: severe HTN, abnormal rhythm, coronary blockage, valvular disease, congenital, myocarditis.</strong> Hyperthyroidism and AV fistula cause high-output states instead."},

// Ch.20 — VR Resistance Distribution
{ch:"Ch.20 — Venous Return Resistance",scene:'circulation',sceneCfg:{info:'VR resistance'},
type:'mcq',difficulty:3,
setup:"Two-thirds of venous return resistance is from the venous side. That means veins aren't just passive tubes — they actively contribute to how hard it is for blood to get home.",
q:"What fraction of total resistance to venous return comes from the venous side versus the arteriolar side?",
ans:[{t:"2/3 venous, 1/3 arteriolar — veins contribute more to VR resistance",ok:true},{t:"1/3 venous, 2/3 arteriolar — arterioles are the main resistance site",ok:false},{t:"Equal 50/50 split between venous and arteriolar contributions",ok:false}],
win:"2/3 venous, 1/3 arteriolar! Surprising since arterioles are the 'resistance vessels' for flow — but for VENOUS RETURN resistance, the venous side dominates.",
lose:"VR resistance: 2/3 from venous resistance, 1/3 from arteriolar resistance. Don't confuse this with total peripheral resistance where arterioles dominate.",
ex:"<strong>VR resistance: 2/3 venous, 1/3 arteriolar.</strong> Decreasing resistance to half doubles VR (curve rotates upward). Increasing resistance to 2× halves VR (curve rotates down)."},

// Ch.20 — Equilibrium Point
{ch:"Ch.20 — Guyton Equilibrium (Point A)",scene:'circulation',sceneCfg:{info:'CO = VR equilibrium'},
type:'type',difficulty:3,
setup:"On a Guyton diagram, there's one magical point where CO equals VR. It's called Point A and it's basically the hemodynamic equivalent of 'perfectly balanced, as all things should be.'",
q:"At the normal equilibrium point (Point A) on the Guyton diagram, what is the right atrial pressure (in mmHg) and cardiac output (in L/min)?",
accepted:['0 and 5','RAP 0, CO 5','0 mmHg and 5 L/min','RAP=0 CO=5','0, 5','0 mmhg 5 L/min','RAP 0 CO 5'],
hint:"Normal RAP and normal resting CO...",revealHint:"RAP is zero, CO is the normal resting value of 5",
win:"RAP = 0 mmHg, CO = 5 L/min! This is Point A — where the cardiac function curve and venous return curve intersect. The operating point of the normal circulation.",
lose:"Point A: RAP = 0 mmHg, CO = 5 L/min. This is where VR = CO on the Guyton diagram — the normal resting equilibrium of the cardiovascular system.",
ex:"<strong>Point A: VR = CO at RAP = 0 mmHg, CO = 5 L/min.</strong> Any change in cardiac function or VR curves shifts this equilibrium to a new operating point."},

// Ch.20 — Fick's Principle
{ch:"Ch.20 — Fick's Principle",scene:'patient',sceneCfg:{info:'O2 consumption method'},
type:'mcq',difficulty:4,
setup:"Fick said 'I can calculate your cardiac output with just O2 numbers.' And honestly? King behavior. No invasive measurements needed — just math and some blood gas values.",
q:"Using Fick's principle: O2 consumption is 250 mL/min, arterial O2 content is 200 mL/L, venous O2 content is 150 mL/L. What is the cardiac output?",
ans:[{t:"5.0 L/min — CO = O2 consumption ÷ arteriovenous O2 difference",ok:true},{t:"2.5 L/min — CO = O2 consumption ÷ arterial O2 content only",ok:false},{t:"1.25 L/min — CO = O2 consumption ÷ (arterial + venous content)",ok:false}],
win:"CO = 250/(200-150) = 250/50 = 5.0 L/min. Fick's principle: O2 consumption = blood flow × (arterial O2 - venous O2). Solve for flow = CO.",
lose:"Fick: CO = O2 consumption / (arterial O2 - venous O2) = 250/(200-150) = 250/50 = 5.0 L/min. Must use the A-V DIFFERENCE, not individual values.",
ex:"<strong>Fick's Principle: CO = O2 consumption / (CaO2 - CvO2).</strong> A non-invasive way to estimate cardiac output using oxygen consumption and arteriovenous O2 difference."},

// Ch.20 — Low CO Non-Cardiac
{ch:"Ch.20 — Low CO Non-Cardiac Causes",scene:'patient',sceneCfg:{info:'Non-cardiac low CO'},
type:'mcq',difficulty:3,
setup:"Not all low CO is from a broken heart. Sometimes it's because the venous return is just... not returning. The heart can only pump what it gets back, after all.",
q:"Which of the following is a NON-CARDIAC cause of low cardiac output?",
ans:[{t:"Severe valvular heart disease impeding forward flow",ok:false},{t:"Prolonged bed rest causing decreased venous return volume",ok:true},{t:"Acute myocardial infarction reducing contractile function",ok:false}],
win:"Prolonged bed rest reduces venous return (decreased muscle pump activity, loss of muscle mass) → decreased VR → decreased CO. The heart is fine but isn't receiving enough blood.",
lose:"Non-cardiac low CO: decreased VR from loss of tissue mass, hypothyroidism, decreased skeletal muscle activity, prolonged bed rest. Valvular disease and MI are cardiac causes.",
ex:"<strong>Low CO non-cardiac: ↓VR from loss of tissue mass, hypothyroidism, ↓skeletal muscle, prolonged bed rest.</strong> Heart works fine but receives inadequate VR."},

// Ch.20 — CO and Exercise
{ch:"Ch.20 — CO During Exercise",scene:'patient',sceneCfg:{info:'Exercise physiology'},
type:'mcq',difficulty:2,
setup:"During maximal exercise, CO can hit 25+ L/min in a trained athlete. That's 5× resting. Your heart goes from chill mode to absolute beast mode real quick.",
q:"Which factor is the PRIMARY reason cardiac output increases during exercise?",
ans:[{t:"Increased sympathetic stimulation of heart rate only",ok:false},{t:"Increased venous return from muscle pump and vasodilation",ok:true},{t:"Decreased peripheral resistance from arteriolar relaxation",ok:false}],
win:"Muscle pump + respiratory pump + vasodilation in exercising muscle → massively increased VR → Frank-Starling increases SV → combined with ↑HR → huge ↑CO. VR drives the engine.",
lose:"The primary driver is increased VR. Exercising muscles pump blood back, vasodilation in active tissue pulls blood through. Frank-Starling then amplifies SV. Sympathetics help with HR.",
ex:"<strong>Exercise ↑CO via: ↑VR (muscle pump, vasodilation) → ↑SV (Frank-Starling) + ↑HR (sympathetic).</strong> VR is the fundamental driver; CO = VR."},

// Ch.20 — CO Factors
{ch:"Ch.20 — CO Determinants",scene:'patient',sceneCfg:{info:'CO varies with...'},
type:'type',difficulty:1,
setup:"CO isn't just HR × SV on a test question. In real life it varies with your metabolism, age, size, and activity level. The body is more nuanced than your flashcards, bestie.",
q:"Besides HR and SV, name TWO factors that affect cardiac output level.",
accepted:['BMR and age','age and body size','exercise and body size','BMR and body size','metabolism and age','exercise and age','body size and age','BMR and exercise','age and exercise','metabolic rate and age','metabolic rate and body size'],
hint:"Think about what makes different people have different resting COs...",revealHint:"Basal metabolic rate, age, body size, and exercise level",
win:"CO varies with BMR, age, body size, and exercise level. A large young athlete has much higher CO than a small elderly sedentary person.",
lose:"CO is affected by: BMR (↑metabolism = ↑CO), age (CI peaks at 10), body size (larger = higher CO), and exercise (biggest acute modifier).",
ex:"<strong>CO factors: BMR, age, body size, exercise.</strong> CI (CO/BSA) normalizes for body size. CI peaks at age 10, then declines progressively."},

// Ch.20 — Resistance and VR Curve
{ch:"Ch.20 — VR Curve Shifts",scene:'circulation',sceneCfg:{info:'VR curve rotation'},
type:'mcq',difficulty:4,
setup:"The VR curve is like a see-saw — change resistance and it rotates. Halve the resistance and VR doubles at any given RAP. The math doesn't lie, even if your clinical skills do.",
q:"If resistance to venous return is decreased to half its normal value, what happens to the venous return curve?",
ans:[{t:"Curve shifts right along the x-axis without changing slope",ok:false},{t:"Curve rotates upward — double VR at every RAP value now",ok:true},{t:"Curve shifts upward in parallel without changing the slope",ok:false}],
win:"Halving resistance rotates the VR curve upward — at any given RAP, VR is now doubled. The Msf (mean systemic filling pressure) intercept stays the same, but the slope changes.",
lose:"Decreased resistance to half → VR curve rotates upward. Flow = ΔP/R, so halving R doubles flow at every pressure point. The curve pivots around the Msf intercept.",
ex:"<strong>↓resistance to half → 2× flow (curve rotates upward). ↑resistance to 2× → half flow (rotates down).</strong> Rotation occurs around the mean systemic filling pressure."},

// Ch.20 — AV Fistula High CO
{ch:"Ch.20 — AV Fistula",scene:'patient',sceneCfg:{info:'AV fistula hemodynamics'},
type:'mcq',difficulty:5,
setup:"An AV fistula bypasses the capillary bed entirely — arterial blood dumps straight into veins. TPR craters, VR skyrockets, and the heart has to work overtime. It's giving 'short circuit energy.'",
q:"A large arteriovenous fistula causes high-output cardiac failure by which mechanism?",
ans:[{t:"Direct shunt dramatically decreases TPR and increases VR",ok:true},{t:"Arterial steal phenomenon causes downstream tissue ischemia",ok:false},{t:"Increased blood viscosity from turbulent flow in the fistula",ok:false}],
win:"AV fistula = low-resistance shortcut → ↓TPR → ↑VR → heart must pump more → chronic volume overload → eventually high-output failure. The heart can't sustain the extra work.",
lose:"AV fistula creates a low-resistance shunt: blood bypasses capillaries → ↓TPR, ↑VR → heart increases CO to compensate → chronic overload → high-output failure.",
ex:"<strong>AV fistula: arterial→venous shunt → ↓TPR → ↑VR → ↑CO → eventual high-output failure.</strong> Also seen in Paget's disease (bone AV shunts) and beriberi."},

// Ch.20 — Fick Principle Setup
{ch:"Ch.20 — Fick's Principle",scene:'patient',sceneCfg:{info:'CO measurement'},
type:'type',difficulty:5,
setup:"Board question incoming: A patient consumes 300 mL O2/min. Arterial O2 = 200 mL/L. Mixed venous O2 = 140 mL/L. Calculate CO. You have 30 seconds. Go.",
q:"Using Fick's principle: O2 consumption 300 mL/min, CaO2 200 mL/L, CvO2 140 mL/L. What is CO in L/min?",
accepted:['5','5.0','5 L/min','5.0 L/min','5L/min'],
hint:"CO = O2 consumption / (CaO2 - CvO2)...",revealHint:"300 / (200 - 140) = 300/60 = ?",
win:"5.0 L/min! CO = 300/(200-140) = 300/60 = 5.0 L/min. Normal resting CO. The Fick principle works because all O2 consumed must have been delivered by the blood flow.",
lose:"CO = O2 consumption / (CaO2 - CvO2) = 300/(200-140) = 300/60 = 5.0 L/min. The A-V O2 difference is 60 mL/L.",
ex:"<strong>Fick's Principle: CO = VO2 / (CaO2 - CvO2).</strong> 300/60 = 5.0 L/min. Gold standard for CO measurement in catheterization lab."},

// Ch.14 — CO Control
{ch:"Ch.14 — Cardiac Output Control",scene:'circulation',sceneCfg:{info:'CO = sum of local flows'},
type:'mcq',difficulty:3,
setup:"Fun fact: CO is determined by the SUM of all local tissue flows. The heart doesn't decide how much to pump — the tissues collectively decide by controlling their own blood flow. Democracy in action.",
q:"According to Guyton, what primarily determines cardiac output?",
ans:[{t:"The heart's intrinsic contractile strength and rate alone",ok:false},{t:"The sum of all local tissue blood flows (venous return)",ok:true},{t:"The central nervous system's sympathetic outflow to heart",ok:false}],
win:"CO = VR = sum of all local flows. Each tissue controls its own flow based on metabolic needs. The heart simply pumps whatever returns to it (Frank-Starling). The periphery is in charge.",
lose:"The tissues control their own blood flow, and the sum of all local flows = venous return = cardiac output. The heart is a servant pump, not the dictator of flow.",
ex:"<strong>CO controlled by sum of local tissue flows (VR). AP controlled by nervous reflexes + kidneys.</strong> The periphery determines CO, not the heart."},

// Ch.16 — Crossing Capillary Walls
{ch:"Ch.16 — Transcapillary Transport",scene:'capillary',sceneCfg:{clickable:false,nfpLabel:'Transport routes'},
type:'mcq',difficulty:2,
setup:"Lipid-soluble molecules just walk right through the endothelial cell membrane like they own the place. Water-soluble molecules have to squeeze through tiny pores like it's a packed nightclub. Life isn't fair.",
q:"How do lipid-INSOLUBLE (water-soluble) substances cross the capillary wall?",
ans:[{t:"Directly through the endothelial cell lipid membrane freely",ok:false},{t:"Through intercellular clefts and slit pores between cells",ok:true},{t:"Exclusively via active transport pumps on cell membranes",ok:false}],
win:"Water-soluble molecules use intercellular clefts (slit pores) between endothelial cells. Some also use plasmalemmal vesicles. Lipid-soluble substances go directly through the cell membrane.",
lose:"Water-soluble substances cross via intercellular clefts/slit pores. Lipid-soluble go through the membrane. Some use plasmalemmal vesicles (transcytosis).",
ex:"<strong>Lipid-soluble: through membrane. Water-soluble: through intercellular clefts/slit pores. Also: plasmalemmal vesicles (transcytosis).</strong>"},

// Ch.17 — Hypoxic Vasodilation
{ch:"Ch.17 — Oxygen and Local Flow",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'HYPOXIA',eqLines:['Low O2 → vasodilation']},
type:'type',difficulty:1,
setup:"When tissues don't get enough oxygen, the vessels automatically dilate. It's like the tissue screaming 'I CAN'T BREATHE' and the arterioles finally listening.",
q:"What is the automatic vascular response to local tissue hypoxia?",
accepted:['vasodilation','dilation','dilate','vasodilate','vessels dilate','arteriolar dilation','arteriolar vasodilation'],
hint:"The opposite of vasoconstriction...",revealHint:"Vessels open up to increase blood flow",
win:"Vasodilation! Low O2 → smooth muscle relaxation → increased blood flow → more O2 delivery. This is one of the most important local flow control mechanisms.",
lose:"Hypoxia causes vasodilation — vessels relax to allow more blood flow and O2 delivery. Fundamental local autoregulatory response.",
ex:"<strong>Hypoxia → automatic vasodilation.</strong> Low O2 directly relaxes vascular smooth muscle and also promotes release of vasodilator metabolites (adenosine, etc.)."},

// Ch.18 — AP Equation
{ch:"Ch.18 — Arterial Pressure Equation",scene:'circulation',sceneCfg:{info:'AP = CO × TPR'},
type:'type',difficulty:1,
setup:"This is THE equation for understanding hemodynamics. AP = CO × TPR. If you don't know this, your anesthesia career will be very short and very embarrassing.",
q:"Write the equation for arterial pressure (AP) in terms of cardiac output and resistance.",
accepted:['AP=CO×TPR','AP = CO × TPR','AP = CO x TPR','MAP = CO × TPR','MAP = CO x TPR','AP=COxTPR','BP = CO × TPR','BP = CO x TPR','AP = CO * TPR','MAP = CO * TPR'],
hint:"Pressure = Flow × Resistance...",revealHint:"AP = Cardiac Output × Total Peripheral Resistance",
win:"AP = CO × TPR! The master hemodynamic equation. Want to raise BP? Increase CO (volume, contractility, HR) or increase TPR (vasoconstriction). Simple.",
lose:"AP = CO × TPR. This is derived from Ohm's law (V = IR → P = Q × R). Understanding this equation is fundamental to managing hemodynamics.",
ex:"<strong>AP = CO × TPR.</strong> Derived from Ohm's law. ↑CO or ↑TPR → ↑AP. Foundation of understanding and treating hypotension/hypertension."},

// Ch.19 — Aldosterone Stimuli
{ch:"Ch.19 — Aldosterone Control",scene:'circulation',sceneCfg:{kidney:true,offset:90,infoPanel:['Aldosterone triggers']},
type:'mcq',difficulty:3,
setup:"Aldosterone doesn't just respond to RAAS. High potassium also triggers it because hyperkalemia will literally stop your heart. The body has priorities.",
q:"Besides the RAAS pathway, what other stimulus directly triggers aldosterone release from the zona glomerulosa?",
ans:[{t:"Low serum calcium levels detected by parathyroid glands",ok:false},{t:"High serum potassium acting directly on adrenal cortex",ok:true},{t:"Elevated serum sodium detected by hypothalamic osmoreceptors",ok:false}],
win:"High K+ directly stimulates aldosterone release from the zona glomerulosa. Aldosterone then promotes K+ secretion in the collecting duct. Essential to prevent fatal hyperkalemia.",
lose:"High serum K+ directly stimulates aldosterone release. Aldosterone acts on collecting ducts to retain Na+ and excrete K+. This is independent of the RAAS pathway.",
ex:"<strong>Aldosterone controlled by: RAAS + high K+.</strong> Activated by dehydration, Na+ deficiency, hemorrhage (all via RAAS) and directly by hyperkalemia."},

// Ch.15 — Distensibility Formula
{ch:"Ch.15 — Vascular Distensibility",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'DISTENSIBILITY',eqLines:['D = ΔV/(ΔP × V₀)']},
type:'type',difficulty:2,
setup:"Distensibility and compliance sound the same but they're NOT. One accounts for original volume, one doesn't. Details matter, people.",
q:"What is the formula for vascular distensibility?",
accepted:['ΔV/(ΔP × V)','ΔV/(ΔP×V)','delta V / (delta P x V)','change in volume / (change in pressure x original volume)','ΔV / (ΔP × original V)','dV/(dP*V)'],
hint:"It's like compliance but normalized to original volume...",revealHint:"Distensibility = ΔV divided by (ΔP times original volume)",
win:"Distensibility = ΔV/(ΔP × original V). It normalizes compliance for vessel size. Compliance = ΔV/ΔP (no volume normalization). Both are important for different reasons.",
lose:"Distensibility = ΔV/(ΔP × V₀). Unlike compliance (ΔV/ΔP), distensibility normalizes for the original volume of the vessel.",
ex:"<strong>Distensibility = ΔV/(ΔP × V₀). Compliance = ΔV/ΔP.</strong> Veins are 24× more compliant than arteries."},

// Ch.16 — Overall NFP Value
{ch:"Ch.16 — Net Filtration Pressure",scene:'capillary',sceneCfg:{clickable:false,nfpLabel:'NFP ≈ 0.3 mmHg'},
type:'type',difficulty:3,
setup:"The overall NFP across the capillary bed is hilariously tiny. Just 0.3 mmHg. All those Starling forces and the net result is basically a rounding error. Nature is efficient.",
q:"What is the approximate overall net filtration pressure (NFP) across the entire capillary bed in mmHg?",
accepted:['0.3','0.3 mmHg','.3','0.3mmHg'],
hint:"It's less than 1 mmHg...",revealHint:"Zero point three",
win:"0.3 mmHg! Tiny but significant — this slight net outward filtration is balanced by lymphatic drainage. Arterial end has net filtration (+13), venous end has net reabsorption.",
lose:"Overall NFP ≈ 0.3 mmHg. Arterial end: net filtration. Venous end: net reabsorption. The small difference is handled by lymphatic drainage.",
ex:"<strong>Overall NFP = 0.3 mmHg (slight net filtration).</strong> Arterial end: +13 mmHg outward. Venous end: osmotic pressure takes over for reabsorption."},

// Ch.18 — Baroreceptor Effect on BP Increase
{ch:"Ch.18 — Baroreceptor Response",scene:'brainstem',sceneCfg:{info:'↑BP → baroreceptor response'},
type:'mcq',difficulty:2,
setup:"Baroreceptors detect high BP and immediately call the brainstem like 'yo, tone it down.' The medulla responds by chilling out the sympathetics and cranking the vagus. Teamwork.",
q:"When baroreceptors detect INCREASED arterial pressure, what is the efferent response?",
ans:[{t:"Inhibit vasoconstrictor center + activate vagal (parasympathetic) center",ok:true},{t:"Activate vasoconstrictor center + inhibit vagal parasympathetic center",ok:false},{t:"Simultaneously activate both sympathetic and parasympathetic centers",ok:false}],
win:"↑Pressure → ↑baroreceptor firing → inhibit sympathetic vasoconstrictor center + activate vagal center → vasodilation + ↓HR → BP comes back down. Negative feedback.",
lose:"↑BP → ↑baroreceptor impulses → inhibit vasoconstrictor area + activate vagal center → ↓TPR, ↓HR, ↓contractility → BP falls. It's a negative feedback loop.",
ex:"<strong>↑Pressure → ↑impulses → inhibit vasoconstrictor center + activate vagal center.</strong> Result: ↓HR, ↓contractility, vasodilation, ↓BP. Classic negative feedback."},

// Ch.19 — Sleep Apnea HTN
{ch:"Ch.19 — Secondary HTN Causes",scene:'patient',sceneCfg:{info:'Secondary HTN'},
type:'mcq',difficulty:4,
setup:"Your patient snores like a freight train, is always tired, has a BMI of 42, and their BP is 160/100. Connecting the dots yet? Sleep apnea is literally choking them into hypertension every night.",
q:"How does obstructive sleep apnea cause secondary hypertension?",
ans:[{t:"Chronic intermittent hypoxia increases sympathetic nervous tone",ok:true},{t:"Airway obstruction directly compresses the carotid baroreceptors",ok:false},{t:"Sleep fragmentation impairs renal sodium excretion mechanisms",ok:false}],
win:"Repeated hypoxic episodes during apneas → chronic sympathetic activation → sustained vasoconstriction + RAAS activation → hypertension even during daytime wakefulness.",
lose:"Sleep apnea → intermittent hypoxia → ↑sympathetic tone → sustained HTN. The chronic sympathetic overdrive persists even during waking hours.",
ex:"<strong>Sleep apnea → ↑sympathetic tone from chronic intermittent hypoxia → HTN.</strong> One of the most common and underdiagnosed causes of secondary HTN."},

// Ch.20 — Paget's Disease High CO
{ch:"Ch.20 — Paget's Disease",scene:'patient',sceneCfg:{info:'High-output state'},
type:'mcq',difficulty:5,
setup:"Paget's disease turns bones into vascular sponges with tons of AV shunts. The heart has to pump insane amounts of blood through these overactive bone beds. Orthopedic problem, cardiac consequence.",
q:"Why does Paget's disease of bone cause high cardiac output?",
ans:[{t:"Bone pain triggers sympathetic activation increasing heart rate",ok:false},{t:"Extensive AV shunts in pagetic bone lower total peripheral resistance",ok:true},{t:"Elevated alkaline phosphatase directly stimulates myocardial cells",ok:false}],
win:"Pagetic bone develops extensive AV shunting within the remodeled bone vasculature → ↓TPR → ↑VR → compensatory ↑CO. Same mechanism as an AV fistula but distributed across bones.",
lose:"Paget's disease creates extensive AV shunts in bone → decreased TPR → increased VR → high CO. Similar mechanism to AV fistula and beriberi (vasodilation).",
ex:"<strong>Paget's disease: AV shunts in bone → ↓TPR → ↑VR → high CO.</strong> High CO causes: Beriberi, AV fistula, hyperthyroidism, pulmonary disease, Paget's disease."},

// Ch.15 — PDA Pulse
{ch:"Ch.15 — Patent Ductus Arteriosus Pulse",scene:'patient',sceneCfg:{info:'PDA hemodynamics'},
type:'mcq',difficulty:5,
setup:"PDA gives you a bounding pulse — high systolic because the heart pumps hard, low diastolic because blood runs off into the pulmonary circulation through the ductus. That's a 'washing machine murmur' baby.",
q:"What is the characteristic blood pressure pattern in a patient with a patent ductus arteriosus (PDA)?",
ans:[{t:"Elevated systolic with decreased diastolic (widened PP)",ok:true},{t:"Decreased systolic with elevated diastolic (narrowed PP)",ok:false},{t:"Both systolic and diastolic equally elevated (normal PP)",ok:false}],
win:"PDA = aorta→pulm artery shunt → blood runs off during diastole → ↑systolic (volume overload), ↓diastolic (runoff) = widened pulse pressure. Bounding 'water-hammer' pulse.",
lose:"PDA: high systolic (volume overload), low diastolic (blood runs off through ductus during diastole) = widened pulse pressure. Classic bounding pulse finding.",
ex:"<strong>PDA = high systolic, low diastolic (widened PP).</strong> Aortic regurg is similar (diastolic drops to ~0, no incisura). Aortic stenosis = weak, flat (narrowed PP)."},

// Ch.17 — Endothelin
{ch:"Ch.17 — Endothelin",scene:'vessel_cross',sceneCfg:{radius:65,wall:12,label:'ENDOTHELIN',eqLines:['Most potent constrictor']},
type:'type',difficulty:2,
setup:"There's a vasoconstrictor so powerful it makes norepinephrine look like a gentle suggestion. It's made by the endothelium itself — talk about an inside job.",
q:"What is the name of the most potent endogenous vasoconstrictor, released by endothelial cells?",
accepted:['endothelin','endothelin-1','ET-1','endothelin 1'],
hint:"Named after where it comes from (the endothelium)...",revealHint:"Endothel-___",
win:"Endothelin! Specifically endothelin-1 (ET-1). The most powerful endogenous vasoconstrictor known. Released by damaged endothelium and implicated in pulmonary hypertension.",
lose:"Endothelin (ET-1) — the most potent endogenous vasoconstrictor. Released by endothelial cells. Plays roles in pulmonary HTN, heart failure, and renal disease.",
ex:"<strong>Endothelin = most potent endogenous vasoconstrictor.</strong> Released by endothelium. Vasoconstrictors: NE, Epi, Ang II, Vasopressin, Endothelin."},

// Ch.19 — Aortic Coarctation HTN
{ch:"Ch.19 — Coarctation of the Aorta",scene:'circulation',sceneCfg:{kidney:true,offset:90,infoPanel:['Coarctation','↓Renal flow']},
type:'mcq',difficulty:5,
setup:"Coarctation of the aorta gives you hypertension in the upper body and low pressure in the legs. The kidneys see low flow and release renin because they think the whole body is hypotensive. Kidney got played.",
q:"Why does aortic coarctation cause hypertension in the upper extremities?",
ans:[{t:"Mechanical obstruction alone raises upstream pressure",ok:false},{t:"Reduced renal perfusion activates RAAS causing volume expansion",ok:true},{t:"Baroreceptor resetting from chronic pressure differential",ok:false}],
win:"Coarctation → ↓flow to kidneys → ↑renin → ↑Ang II + aldosterone → salt/water retention → systemic HTN (especially above the coarctation). Same mechanism as renal artery stenosis.",
lose:"The kidneys sense low flow below the coarctation → activate RAAS → Ang II + aldosterone → volume expansion → HTN. Upper body sees the elevated pressure; legs see low pressure.",
ex:"<strong>Aortic coarctation: ↓renal flow → ↑renin → RAAS activation → HTN.</strong> BP higher in arms than legs. Same mechanism as renovascular HTN."}


];

// ═══════════ LEVELS & MAP ═══════════
const LEVELS=[
  {id:'l1',name:'VITAL SIGNS CHECK',label:'LEVEL 1: DEFINITIONS',icon:'💉',difficulty:1,desc:'Basic vocab & definitions',stars:1},
  {id:'l2',name:'CONCEPT APPLICATION',label:'LEVEL 2: CONCEPTS',icon:'🧠',difficulty:2,desc:'Mechanisms & relationships',stars:2},
  {id:'l3',name:'CLINICAL ROTATION',label:'LEVEL 3: CLINICAL',icon:'🏥',difficulty:3,desc:'Patient scenarios (moderate)',stars:3},
  {id:'l4',name:'ADVANCED INTEGRATION',label:'LEVEL 4: INTEGRATION',icon:'⚡',difficulty:4,desc:'Multi-system integration',stars:4},
  {id:'l5',name:'BOARD EXAM FROM HELL',label:'LEVEL 5: BOARDS',icon:'💀',difficulty:5,desc:'Synthesis across all chapters',stars:5},
];
const SPECIAL_MODES=[
  {id:'hard',name:'HARD MODE',icon:'🔥',desc:'Difficulty 4-5 only. Slower timer. 5 lives. 2× points.',special:true},
  {id:'blitz',name:'ALL QUESTIONS BLITZ',icon:'⚡',desc:'Every question. Shuffled. No mercy.',special:true},
];

// === COURSE / CLASS STRUCTURE ===
// === COURSES: NEW STRUCTURE ===
const COURSES = [
  {
    id:'adv-phys-path-1',
    title:'Advanced Physiology & Pathophysiology I',
    topics:[
      {id:'adv1-t01',title:'Organization of the Human Body and The Cell',chapters:'1-2',order:1,type:'topic'},
      {id:'adv1-t02',title:'Genetic Control / Transport through Cell Membranes',chapters:'3-4',order:2,type:'topic'},
      {id:'adv1-t03',title:'Membrane Potentials and Action Potentials / Contraction of Skeletal Muscle',chapters:'5-6',order:3,type:'topic'},
      {id:'adv1-t04',title:'Excitation of Skeletal Muscle and Smooth Muscle',chapters:'7-8',order:4,type:'topic'},
      {id:'adv1-t05',title:'Cardiac Muscle and Rhythmic Excitation',chapters:'9-10',order:5,type:'topic'},
      {id:'adv1-t06',title:'Fundamentals of ECG / Vectorial Analysis',chapters:'11-12',order:6,type:'topic'},
      {id:'adv1-t07',title:'Cardiac Arrhythmias and Overview of Circulation',chapters:'13-14',order:7,type:'topic'},
      {id:'adv1-t08',title:'Vascular Distensibility and Lymphatics',chapters:'15-16',order:8,type:'topic'},
      {id:'adv1-t09',title:'Local and Humoral Control of Blood Flow / Nervous Regulation of ABP',chapters:'17-18',order:9,type:'topic'},
      {id:'adv1-t10',title:'Role of the Kidneys in Long-Term Control of ABP / Cardiac Output',chapters:'19-20',order:10,type:'topic'},
      {id:'adv1-t11',title:'Muscle Blood Flow / Cardiac Failure',chapters:'21-22',order:11,type:'topic'},
      {id:'adv1-t12',title:'Heart Valves / Circulatory Shock',chapters:'23-24',order:12,type:'topic'},
      {id:'adv1-t13',title:'Regulation of Body Fluid Compartments / The Urinary System',chapters:'25-26',order:13,type:'topic'},
      {id:'adv1-t14',title:'Glomerular Filtration / Renal Tubular Reabsorption and Secretion',chapters:'27-28',order:14,type:'topic'},
      {id:'adv1-t15',title:'Urine Concentration and Dilution / Renal Regulation of Electrolytes',chapters:'29-30',order:15,type:'topic'},
      {id:'adv1-synth',title:'Pathophysiology Synthesis',chapters:'',order:16,type:'synthesis'},
      {id:'adv1-mastery',title:'🧠 Mastery Challenge',chapters:'',order:17,type:'mastery'},
    ]
  },
  {
    id:'basics-anesthesia',
    title:'Basics of Anesthesia',
    topics:[
      {id:'ba-t01',title:'Scope and Clinician Well-Being',chapters:'1-3',order:1,type:'topic'},
      {id:'ba-t02',title:'Airway Foundations',chapters:'16',order:2,type:'topic'},
      {id:'ba-t03',title:'Airway Advanced',chapters:'16',order:3,type:'topic'},
      {id:'ba-t04',title:'Basic Pharmacologic Principles',chapters:'4',order:4,type:'topic'},
      {id:'ba-t05',title:'Cardiac and Pulmonary Physiology',chapters:'5',order:5,type:'topic'},
      {id:'ba-t06',title:'Autonomic Nervous System',chapters:'6',order:6,type:'topic'},
      {id:'ba-t07',title:'Inhaled Anesthetics',chapters:'7',order:7,type:'topic'},
      {id:'ba-t08',title:'Intravenous Anesthetics',chapters:'8',order:8,type:'topic'},
      {id:'ba-t09',title:'Opioids',chapters:'9',order:9,type:'topic'},
      {id:'ba-t10',title:'Neuromuscular Blocking and Reversal Agents / Neurotoxicity',chapters:'11-12',order:10,type:'topic'},
      {id:'ba-t12',title:'Anesthesia Delivery Systems',chapters:'15',order:11,type:'topic'},
      {id:'ba-t13',title:'Positioning',chapters:'19',order:12,type:'topic'},
      {id:'ba-t14',title:'Monitoring',chapters:'20',order:13,type:'topic'},
      {id:'ba-t15',title:'Fluid Management / Blood Therapy',chapters:'24-25',order:14,type:'topic'},
      {id:'ba-synth',title:'Anesthesia Synthesis',chapters:'',order:15,type:'synthesis'},
    ]
  },
  {
    id:'chem-phys-anesthesia',
    title:'Chemistry and Physics for Anesthesia Practice',
    topics:[
      {id:'cp-t01',title:'Smart Sheets Foundations',chapters:'',order:1,type:'topic'},
      {id:'cp-t02',title:'Measurement and Chemistry',chapters:'1-2',order:2,type:'topic'},
      {id:'cp-t03',title:'Physics I',chapters:'3',order:3,type:'topic'},
      {id:'cp-t04',title:'Physics II',chapters:'4',order:4,type:'topic'},
      {id:'cp-t05',title:'Fluids',chapters:'5',order:5,type:'topic'},
      {id:'cp-t06',title:'Gas Laws',chapters:'6',order:6,type:'topic'},
      {id:'cp-t07',title:'States of Matter',chapters:'7',order:7,type:'topic'},
      {id:'cp-t08',title:'Solutions',chapters:'8',order:8,type:'topic'},
      {id:'cp-t09',title:'Acids, Bases, and Buffers',chapters:'9',order:9,type:'topic'},
      {id:'cp-t10',title:'Electricity',chapters:'10',order:10,type:'topic'},
      {id:'cp-t11',title:'Organic and Biochemistry',chapters:'11-12',order:11,type:'topic'},
      {id:'cp-t12',title:'Radiation',chapters:'13',order:12,type:'topic'},
      {id:'cp-synth',title:'Chemistry and Physics Synthesis',chapters:'',order:13,type:'synthesis'},
      {id:'cp-mastery',title:'🧠 Mastery Challenge',chapters:'',order:14,type:'mastery'},
    ]
  },
  {
    id:'adv-health-assess',
    title:'Advanced Health Assessment',
    topics:[
      {id:'ha-t01',title:'Clinical Encounter and Interview',chapters:'1-2',order:1,type:'topic'},
      {id:'ha-t02',title:'Health History Essentials',chapters:'3',order:2,type:'topic'},
      {id:'ha-t03',title:'Physical Examination Essentials',chapters:'4',order:3,type:'topic'},
      {id:'ha-t04',title:'Skin, Hair, and Nails',chapters:'10',order:4,type:'topic'},
      {id:'ha-t05',title:'Cognition, Behavior, and Mental Status',chapters:'9',order:5,type:'topic'},
      {id:'ha-t06',title:'Head and Neck / Throat / Oral Cavity / Airway',chapters:'11,14',order:6,type:'topic'},
      {id:'ha-t07',title:'Eyes, Ears, and Nose',chapters:'12-13',order:7,type:'topic'},
      {id:'ha-t08',title:'Thorax and Lungs',chapters:'15',order:8,type:'topic'},
      {id:'ha-t09',title:'Cardiovascular System',chapters:'16',order:9,type:'topic'},
      {id:'ha-t10',title:'Peripheral Vascular / Breast / Axillae / Genitalia',chapters:'17-18,20-21',order:10,type:'topic'},
      {id:'ha-t11',title:'Abdomen / Anus / Rectum / Prostate',chapters:'19,22',order:11,type:'topic'},
      {id:'ha-t12',title:'Musculoskeletal System',chapters:'23',order:12,type:'topic'},
      {id:'ha-t13',title:'Nervous System',chapters:'24',order:13,type:'topic'},
      {id:'ha-synth',title:'Comprehensive Assessment Synthesis',chapters:'',order:14,type:'synthesis'},
      {id:'ha-mastery',title:'🧠 Mastery Challenge',chapters:'',order:15,type:'mastery'},
    ]
  }
];

function getCourseById(courseId){
  return COURSES.find(c=>c.id===courseId);
}

function getTopicsByCourse(courseId){
  const course=getCourseById(courseId);
  return course ? course.topics : [];
}

// Generate short label from full title for compact node display
function getTopicShortLabel(title, topicType){
  if(topicType==='synthesis') return '🧬 Synth';
  if(topicType==='mastery') return '🧠 Master';
  if(topicType==='store') return '🛒 Store';
  
  // Extract key words from title
  const keywords = title.split(/[\s\/\-,&]+/).filter(w=>w.length>2);
  if(keywords.length===0) return title.substring(0,8);
  
  // Return first meaningful keyword or first 2 words combined
  let label = keywords[0];
  if(label.length < 5 && keywords[1] && (label+keywords[1]).length <= 12){
    label += ' ' + keywords[1];
  }
  return label.substring(0, 14);
}

// Predefined spatial world layouts for each course (Mario-inspired)
const WORLD_LAYOUTS = {
  'adv-phys-path-1': [
    // Advanced Physiology pathophysiology world: 17 nodes aligned to glowing path
    {order:1, x:80, y:280},       // 1. Cell - left, bottom (cell region)
    {order:2, x:160, y:275},      // 2. Transport - moving right, slightly up
    {order:3, x:240, y:270},      // 3. APs - center-left, continuing upward
    {order:4, x:320, y:265},      // 4. Muscle - moving right, path curves
    {order:5, x:400, y:260},      // 5. Cardiac - center, heart region
    {order:6, x:480, y:245},      // 6. ECG - monitor equipment, elevated
    {order:7, x:560, y:245},      // 7. Arrhythmia - right of monitors, same level
    {order:8, x:640, y:260},      // 8. Vascular - continuing right, back down
    {order:9, x:720, y:270},      // 9. Flow Control - path curves down more
    {order:10, x:740, y:184},     // 10. Kidney BP - rotated to 11's position
    {order:11, x:620, y:148},     // 11. Failure - rotated to 12's position
    {order:12, x:500, y:112},     // 12. Shock - rotated to 13's position
    {order:13, x:380, y:76},      // 13. Body Fluids - rotated to 14's position
    {order:14, x:260, y:40},      // 14. GFR - rotated to 15's position
    {order:15, x:800, y:160},     // 15. Electrolytes - rotated to 10's position
    // Synthesis & Mastery nodes off main path
    {order:16, x:1050, y:180, type:'synthesis'},  // 16. Synth - synthesis tower (red)
    {order:17, x:1100, y:240, type:'mastery'},    // 17. Mastery - mastery fortress (green, endpoint)
  ],
  'basics-anesthesia': [
    {order:1, x:100, y:200},
    {order:2, x:180, y:150},
    {order:3, x:260, y:120},
    {order:4, x:340, y:150},
    {order:5, x:420, y:200},
    {order:6, x:500, y:250},
    {order:7, x:580, y:280},
    {order:8, x:660, y:270},
    {order:9, x:740, y:240},
    {order:10, x:820, y:200},
    {order:11, x:900, y:150},
    {order:12, x:950, y:100},
    {order:13, x:1000, y:80},
    {order:14, x:1050, y:120},
    {order:15, x:1100, y:180},
    {order:16, x:1100, y:280, type:'synthesis'},
    {order:17, x:1000, y:320, type:'mastery'},
  ],
  'chem-phys-anesthesia': [
    {order:1, x:120, y:180},
    {order:2, x:200, y:160},
    {order:3, x:280, y:140},
    {order:4, x:360, y:160},
    {order:5, x:440, y:200},
    {order:6, x:520, y:240},
    {order:7, x:600, y:260},
    {order:8, x:680, y:250},
    {order:9, x:760, y:220},
    {order:10, x:840, y:180},
    {order:11, x:920, y:140},
    {order:12, x:980, y:120},
    {order:13, x:1050, y:200, type:'synthesis'},
    {order:14, x:1100, y:280, type:'mastery'},
  ],
  'adv-health-assess': [
    {order:1, x:110, y:220},
    {order:2, x:190, y:200},
    {order:3, x:270, y:180},
    {order:4, x:350, y:160},
    {order:5, x:430, y:150},
    {order:6, x:510, y:160},
    {order:7, x:590, y:180},
    {order:8, x:670, y:210},
    {order:9, x:750, y:250},
    {order:10, x:830, y:280},
    {order:11, x:910, y:290},
    {order:12, x:990, y:270},
    {order:13, x:1050, y:220},
    {order:14, x:1100, y:150, type:'synthesis'},
    {order:15, x:1100, y:300, type:'mastery'},
  ]
};

// Helper to get world layout for a course
function getWorldLayout(courseId, topicCount){
  return WORLD_LAYOUTS[courseId] || [];
}

const COURSE_MODEL = {
  id:'hemodynamic-overlord',
  name:'Hemodynamic Overlord',
  description:'SRNA physiology course for hemodynamics and cardiovascular exam mastery',
  sections:[
    {id:'vascular-physics',name:'Vascular Physics',lessons:['definitions','applied','clinical']},
    {id:'capillaries-flow',name:'Capillaries & Flow',lessons:['starling','autoregulation','shock']},
    {id:'autonomic-control',name:'Autonomic Control',lessons:['baroreceptors','chemoreceptors','cushing']},
    {id:'renal-body-fluid',name:'Renal and Volume Control',lessons:['pressure-diuresis','raas','hypertension']},
  ],
  topics:['resistance','compliance','starling','myogenic','baroreceptor','RAAS','shock','CO'],
  examBlocks:[
    {id:'fundamentals',name:'Fundamentals',questionFilter:q=>q.difficulty<=2},
    {id:'applied',name:'Applied',questionFilter:q=>q.difficulty<=3},
    {id:'integration',name:'Integration',questionFilter:q=>q.difficulty>=4},
  ],
};

function inferSectionFromChapter(chapter){
  if(!chapter)return 'vascular-physics';
  const c=chapter.toLowerCase();
  if(c.includes('ch.14')||c.includes('vascular')||c.includes('vessel'))return 'vascular-physics';
  if(c.includes('ch.16')||c.includes('capillary')||c.includes('starling'))return 'capillaries-flow';
  if(c.includes('ch.18')||c.includes('brainstem')||c.includes('baroreceptor'))return 'autonomic-control';
  if(c.includes('ch.19')||c.includes('renal')||c.includes('pressure'))return 'renal-body-fluid';
  return 'vascular-physics';
}

function initializeCourseQuestionMetadata(){
  ALL_QS.forEach((q,i)=>{
    if(!q.id) q.id = 'q_'+(i+1);
    if(!q.sectionId) q.sectionId = inferSectionFromChapter(q.ch);
    if(!q.lessonId) q.lessonId = q.sectionId + '_base';
    if(!q.topicId){
      q.topicId = q.ch ? q.ch.toLowerCase().replace(/[^a-z0-9]/g,'_') : 'general';
    }
    if(!q.examBlockId) q.examBlockId = 'fundamentals';
    if(q.difficulty>=4) q.examBlockId='integration';
    if(q.difficulty===3) q.examBlockId='applied';
    q.stats = q.stats || {attempted:0,correct:0,lastCorrect:0,repeatStreak:0};
  });
}

function getQuestionPool(opts={}){
  let pool=ALL_QS.slice();
  if(opts.sectionId) pool=pool.filter(q=>q.sectionId===opts.sectionId);
  if(opts.lessonId) pool=pool.filter(q=>q.lessonId===opts.lessonId);
  if(opts.topicId) pool=pool.filter(q=>q.topicId===opts.topicId);
  if(opts.examBlockId){
    pool=pool.filter(q=>q.examBlockId===opts.examBlockId);
  }
  if(opts.missedOnly){
    const save = getSave();
    const missed = (save.missedQuestionIds||[]);
    pool=pool.filter(q=>missed.includes(q.id));
  }
  if(opts.weakOnly){
    pool=pool.sort((a,b)=>{
      const aRate=(a.stats.correct/Math.max(a.stats.attempted,1));
      const bRate=(b.stats.correct/Math.max(b.stats.attempted,1));
      return aRate-bRate;
    });
  }
  if(opts.shuffle!==false){pool=shuffle(pool);}
  return pool;
}

function getWeakTopicIds(){
  const topicStats={};
  ALL_QS.forEach(q=>{
    if(!q.topicId)return;
    const t=topicStats[q.topicId]||{attempted:0,correct:0};
    t.attempted += q.stats.attempted||0;
    t.correct += q.stats.correct||0;
    topicStats[q.topicId]=t;
  });
  return Object.entries(topicStats)
    .map(([topicId,s])=>({topicId,accuracy: s.attempted? s.correct/s.attempted : 1 }))
    .sort((a,b)=>a.accuracy-b.accuracy)
    .map(o=>o.topicId);
}

function updateWeakTopicRatings(){
  topicWeakness = getWeakTopicIds().slice(0,4);
}

function applySavedProgress(){
  const s=getSave();
  missedQuestionIds = s.missedQuestionIds || [];
  topicWeakness = s.weakTopicIds || [];
  const stats = s.questionStats || {};
  ALL_QS.forEach(q=>{
    if(stats[q.id]){q.stats = Object.assign({}, q.stats, stats[q.id]);}
  });
  updateWeakTopicRatings();
}

function updateQuestionStats(question,isCorrect){
  question.stats.attempted++;
  if(isCorrect){question.stats.correct++;question.stats.repeatStreak++;}
  else{question.stats.repeatStreak=0;}
  question.stats.lastCorrect = isCorrect ? Date.now() : question.stats.lastCorrect;
}

initializeCourseQuestionMetadata();
applySavedProgress();

let gameMode='campaign'; // 'campaign','hard','blitz'
let activeLevelIdx=0; // which level is being played
let timerSpeed=.28; // decrements per tick
let pointMult=1;

function shuffle(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}

function buildQsForDifficulty(diff){
  const pool=ALL_QS.filter(q=>q.difficulty===diff).map(q=>({...q}));
  return shuffle(pool);
}
function buildHardQs(){return shuffle(ALL_QS.filter(q=>q.difficulty>=4).map(q=>({...q})));}
function buildBlitzQs(){return shuffle(ALL_QS.map(q=>({...q})));}

function getSaveData(){
  const s=getSave();
  return {completed:s.completed||{},bestScores:s.bestScores||{}};
}
function saveLevelComplete(levelId,score){
  const s=getSave();
  if(!s.completed)s.completed={};
  if(!s.bestScores)s.bestScores={};
  s.completed[levelId]=true;
  s.bestScores[levelId]=Math.max(s.bestScores[levelId]||0,score);
  s.bankedPts=bankedPts;s.inv=inv;s.equip=equip;s.name=playerName;
  s.highScore=Math.max(s.highScore||0,score);
  writeSave(s);
}

// ═══════════ LEVEL MAP ═══════════
function showMap(){
  document.getElementById('splash').style.display='none';
  document.getElementById('game').style.display='none';
  document.getElementById('go').classList.remove('on');
  document.getElementById('lvl-screen').classList.remove('on');
  document.getElementById('level-map').classList.add('on');
  renderMap();
}

function renderMap(){
  const sd=getSaveData();
  document.getElementById('map-player').innerHTML=playerName+' — Banked: <b>'+bankedPts.toLocaleString()+' pts</b>';
  const path=document.getElementById('map-path');path.innerHTML='';

  LEVELS.forEach((lvl,i)=>{
    if(i>0){const c=document.createElement('div');c.className='map-connector'+(isLevelUnlocked(i,sd)?' ':' locked');path.appendChild(c);}
    const unlocked=isLevelUnlocked(i,sd);
    const completed=!!sd.completed[lvl.id];
    const node=document.createElement('div');
    node.className='map-node'+(completed?' map-completed':unlocked?' map-available':' map-locked');
    const best=sd.bestScores[lvl.id]||0;
    node.innerHTML=`<div class="mn-icon">${lvl.icon}</div><div class="mn-info"><div class="mn-name">${lvl.name}</div><div class="mn-desc">${lvl.desc}</div><div class="mn-stars">${'⭐'.repeat(lvl.stars)}</div></div><div class="mn-status">${completed?'<div class="mn-check">✅</div><div class="mn-best">Best: '+best.toLocaleString()+'</div>':unlocked?'<div style="color:#ffaa00;font-size:.6rem;">▶ PLAY</div>':'<div class="mn-lock">🔒</div>'}</div>`;
    if(unlocked)node.onclick=()=>startLevel(i);
    path.appendChild(node);
  });

  // Special modes
  const sep=document.createElement('div');sep.style.cssText='width:100%;text-align:center;font-size:.5rem;color:#555;letter-spacing:.2em;margin:.5rem 0;';sep.textContent='— SPECIAL MODES —';path.appendChild(sep);

  SPECIAL_MODES.forEach(mode=>{
    const node=document.createElement('div');
    node.className='map-node map-special map-available';
    node.innerHTML=`<div class="mn-icon">${mode.icon}</div><div class="mn-info"><div class="mn-name">${mode.name}</div><div class="mn-desc">${mode.desc}</div></div><div class="mn-status"><div style="color:#ff4444;font-size:.6rem;">▶ PLAY</div></div>`;
    node.onclick=()=>startSpecial(mode.id);
    path.appendChild(node);
  });
}

function isLevelUnlocked(idx,sd){
  if(idx===0)return true;
  return !!sd.completed[LEVELS[idx-1].id];
}

// ═══════════ GAME ENGINE ═══════════
let G=null;
let levelHistory=[];
let missedQs=[];

const OV_WIN=["Sympathetic system just slapped your ass in approval.","Not mid. Actually based af. NTS approves.","Patient's still breathing DESPITE your presence.","Your cortex is giving main character energy rn.","That answer was bussin no cap fr fr.","Holy shit you actually studied. The VMC is shook.","Even the baroreceptors are vibing with that answer.","Sheeeesh, the medulla just orgasmed at that response."];
const OV_LOSE=["Patient coded. Your CRNA career lasted 3 minutes. Speedrun any%.","That answer was giving braindead NPC energy.","The medulla filed a restraining order against your judgment.","L + ratio + your patient died + skill issue.","The Foley bag has more clinical knowledge than you.","You just killed someone with ignorance. Program director notified.","Your patient's ghost is writing a bad Yelp review.","The pathophysiology waited for nobody, especially not your dumbass."];
const OV_STREAK=["3 IN A ROW. The VMC is tingling. Keep going.","Streak! Your SRNA is actually cracking at this shit.","Triple kill! Sympathetic system doing a victory lap.","On a ROLL — baroreceptors vibing, NTS popping off."];
function rand(a){return a[Math.floor(Math.random()*a.length)];}

function startGame(){
  playerName=document.getElementById('name-input').value.trim()||'ROOKIE';
  const s=getSave();bankedPts=s.bankedPts||0;inv=s.inv||{shield:0,skip:0,reveal:0,time:0};equip=s.equip||{vent:false,mac:false,vl:false,bougie:false};
  save();
  document.getElementById('splash').style.display='none';
  document.getElementById('level-map').style.display='none';
  showCourseSelector();
}

// === COURSE SELECTOR & STORE STATE ===
let selectedCourseId=null;
let selectedTopicId=null;
let lastScreen=null; // Track which screen to return to from store
let combinedStudyDifficulty=null; // Track selected difficulty for combined study

function updateStartSessionButton(){
  const btn=document.getElementById('start-session-btn');
  if(!btn)return;
  if(selectedTopicId){
    btn.style.display='block';
    btn.disabled=false;
  } else {
    btn.style.display='none';
    btn.disabled=true;
  }
}

function startCombinedStudy(){
  // Show the combined study difficulty selection screen
  showCombinedStudyScreen();
}

function showCombinedStudyScreen(){
  const sel=document.getElementById('course-selector');
  if(!sel)return;
  
  selectedCourseId=null;
  selectedTopicId=null;
  combinedStudyDifficulty=null;
  lastScreen='combined-study';
  
  const worldMap=document.getElementById('world-map');
  if(worldMap)worldMap.style.display='none';
  
  const topicMapNavBtns=document.querySelector('.topic-map-nav-buttons');
  if(topicMapNavBtns)topicMapNavBtns.style.display='none';
  
  let combinedContainer=document.getElementById('combined-study-container');
  if(!combinedContainer){
    combinedContainer=document.createElement('div');
    combinedContainer.id='combined-study-container';
    const courseSelectionContainer=document.getElementById('course-selection-container');
    if(courseSelectionContainer){
      courseSelectionContainer.parentNode.insertBefore(combinedContainer, courseSelectionContainer);
    }
  }
  
  combinedContainer.innerHTML='';
  combinedContainer.style.cssText=`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    width: 100%;
    flex: 1;
    overflow: auto;
    padding: 1rem;
  `;
  
  const title=document.createElement('div');
  title.style.cssText='grid-column:1/-1;font-size:1.3rem;color:#ffaa00;text-shadow:0 0 10px #ff8800;text-align:center;margin-bottom:0.5rem;font-weight:bold;';
  title.textContent='🧠 COMBINED STUDY';
  combinedContainer.appendChild(title);
  
  const subtitle=document.createElement('div');
  subtitle.style.cssText='grid-column:1/-1;font-size:0.75rem;color:#88ccff;text-align:center;margin-bottom:1rem;';
  subtitle.textContent='Cross-Course Synthesis Review — NCE-Style Integrated Assessment';
  combinedContainer.appendChild(subtitle);
  
  const diffLabel=document.createElement('div');
  diffLabel.style.cssText='grid-column:1/-1;font-size:0.8rem;color:#ff8888;letter-spacing:.1em;text-transform:uppercase;margin-bottom:0.5rem;font-weight:bold;';
  diffLabel.textContent='SELECT DIFFICULTY LEVEL';
  combinedContainer.appendChild(diffLabel);
  
  const difficulties=['Standard','Hard','Adaptive','NCE Mode'];
  const diffGrid=document.createElement('div');
  diffGrid.style.cssText='grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:0.8rem;margin-bottom:1rem;';
  
  difficulties.forEach(diff=>{
    const btn=document.createElement('button');
    btn.className='big-btn';
    btn.textContent=diff;
    btn.style.cssText=`
      padding: 1rem;
      font-size: 0.85rem;
      text-align: center;
      white-space: normal;
      line-height: 1.3;
      min-height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    `;
    btn.onclick=()=>{
      combinedStudyDifficulty=diff;
      updateCombinedStudyDifficultySelection();
    };
    btn.dataset.difficulty=diff;
    diffGrid.appendChild(btn);
  });
  
  combinedContainer.appendChild(diffGrid);
  
  const startBtn=document.createElement('button');
  startBtn.className='big-btn green';
  startBtn.textContent='⚡ START COMBINED STUDY ⚡';
  startBtn.style.cssText='grid-column:1/-1;font-size:0.85rem;padding:1rem;margin-bottom:1rem;';
  startBtn.onclick=()=>{
    launchCombinedStudy();
  };
  startBtn.id='combined-start-btn';
  combinedContainer.appendChild(startBtn);
  
  const footerDiv=document.createElement('div');
  footerDiv.style.cssText='grid-column:1/-1;display:flex;gap:0.5rem;';
  
  const storeBtn=document.createElement('button');
  storeBtn.className='big-btn';
  storeBtn.textContent='🛒 STORE';
  storeBtn.style.cssText='flex:1;font-size:0.75rem;';
  storeBtn.onclick=()=>{
    lastScreen='combined-study';
    openStore();
  };
  footerDiv.appendChild(storeBtn);
  
  const backBtn=document.createElement('button');
  backBtn.className='big-btn';
  backBtn.textContent='← BACK';
  backBtn.style.cssText='flex:1;font-size:0.75rem;';
  backBtn.onclick=()=>{
    showCourseSelector();
  };
  footerDiv.appendChild(backBtn);
  
  combinedContainer.appendChild(footerDiv);
  combinedContainer.style.display='grid';
  
  const courseContainer=document.getElementById('course-selection-container');
  if(courseContainer)courseContainer.style.display='none';
  const sessionBtn=document.getElementById('start-session-btn');
  if(sessionBtn)sessionBtn.style.display='none';
  
  sel.style.display='flex';
}

function updateCombinedStudyDifficultySelection(){
  const buttons=document.querySelectorAll('[data-difficulty]');
  buttons.forEach(btn=>{
    if(btn.dataset.difficulty===combinedStudyDifficulty){
      btn.classList.add('green');
    } else {
      btn.classList.remove('green');
    }
  });
}

function launchCombinedStudy(){
  if(!combinedStudyDifficulty){
    showOV('Please select a difficulty level.');
    return;
  }
  
  const allTopicIds = COURSES.flatMap(course => 
    course.topics.filter(t => t.type === 'topic').map(t => t.id)
  );
  const regex = new RegExp(allTopicIds.join('|'));
  let qs = ALL_QS.filter(q => regex.test(q.topicId||'')).map(q => ({...q}));
  
  if(qs.length === 0){
    showOV('No questions available yet. Complete some topics first.');
    return;
  }
  
  qs = shuffle(qs);
  let count=140;
  if(combinedStudyDifficulty==='Hard')count=160;
  else if(combinedStudyDifficulty==='Adaptive')count=150;
  else if(combinedStudyDifficulty==='NCE Mode')count=170;
  
  qs = qs.slice(0, count);
  
  const label = `🧠 COMBINED STUDY (${combinedStudyDifficulty}) - Multi-Course Assessment`;
  
  document.getElementById('course-selector').style.display='none';
  launchGame(qs, label, 3);
}

function showCourseSelector(){
  const sel=document.getElementById('course-selector');
  if(!sel)return;
  
  selectedTopicId=null;
  selectedCourseId=null;
  lastScreen='course-selector';
  
  // Hide world map, show course selector content
  const worldMap=document.getElementById('world-map');
  if(worldMap)worldMap.style.display='none';
  
  // Get or create course selection container
  let courseContainer=document.getElementById('course-selection-container');
  if(!courseContainer){
    courseContainer=document.createElement('div');
    courseContainer.id='course-selection-container';
    const worldMapParent=worldMap.parentNode;
    if(worldMapParent){
      worldMapParent.insertBefore(courseContainer, worldMap);
    }
  }
  
  // Clear and fill with course buttons
  courseContainer.innerHTML='';
  courseContainer.style.cssText=`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    width: 100%;
    flex: 1;
    overflow: auto;
    padding: 1rem;
  `;
  
  // Player info header
  const header=document.createElement('div');
  header.style.cssText='grid-column:1/-1;font-size:0.75rem;color:#4488ff;text-align:center;margin-bottom:0.5rem;font-weight:bold;';
  // Read bankedPts fresh from localStorage so new-engine session earnings are visible
  const _freshPts=(loadSave()||{}).bankedPts||bankedPts||0;
  header.innerHTML=`${playerName} — Banked: ${_freshPts.toLocaleString()} pts`;
  courseContainer.appendChild(header);
  
  // Create course buttons
  COURSES.forEach(course=>{
    const btn=document.createElement('button');
    btn.className='big-btn';
    btn.textContent=course.title;
    btn.style.cssText=`
      width: 100%;
      padding: 1rem;
      font-size: 0.85rem;
      text-align: center;
      white-space: normal;
      line-height: 1.3;
      min-height: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    btn.onclick=()=>{
      selectedCourseId=course.id;
      showTopicMap();
    };
    courseContainer.appendChild(btn);
  });
  
  // Combined Study button spanning full width
  const combinedBtn=document.createElement('button');
  combinedBtn.className='big-btn';
  combinedBtn.textContent='🧠 COMBINED STUDY';
  combinedBtn.style.cssText=`
    grid-column: 1/-1;
    font-size: 0.85rem;
    background: rgba(100,200,255,.1);
    border-color: rgba(100,200,255,.4);
    color: #88ccff;
    padding: 1rem;
  `;
  combinedBtn.onclick=()=>{
    startCombinedStudy();
  };
  courseContainer.appendChild(combinedBtn);
  
  // Footer buttons: Store and Back
  const footerDiv=document.createElement('div');
  footerDiv.style.cssText='grid-column:1/-1;display:flex;gap:0.5rem;margin-top:1rem;';
  
  const storeBtn=document.createElement('button');
  storeBtn.className='big-btn';
  storeBtn.textContent='🛒 STORE';
  storeBtn.style.cssText='flex:1;font-size:0.75rem;';
  storeBtn.onclick=()=>{
    lastScreen='course-selector';
    openStore();
  };
  footerDiv.appendChild(storeBtn);
  
  const backBtn=document.createElement('button');
  backBtn.className='big-btn';
  backBtn.textContent='← BACK';
  backBtn.style.cssText='flex:1;font-size:0.75rem;';
  backBtn.onclick=()=>{
    showSplash();
  };
  footerDiv.appendChild(backBtn);
  
  courseContainer.appendChild(footerDiv);
  courseContainer.style.display='grid';
  
  // Hide topic-map nav buttons (we're showing course selector)
  const topicMapNavBtns=document.querySelector('.topic-map-nav-buttons');
  if(topicMapNavBtns)topicMapNavBtns.style.display='none';
  
  // Hide other screen containers (mutual exclusive views)
  const combinedContainer=document.getElementById('combined-study-container');
  if(combinedContainer)combinedContainer.style.display='none';
  
  // Hide other UI elements
  const sessionBtn=document.getElementById('start-session-btn');
  if(sessionBtn)sessionBtn.style.display='none';
  
  // Show selector
  sel.style.display='flex';
}

// Generate positions for topic nodes in a world map pattern
function generateNodePositions(topicCount, containerWidth, containerHeight){
  const positions=[];
  const w=containerWidth||1000;
  const h=containerHeight||800;
  const padding=120;
  const usableW=w-(2*padding);
  const usableH=h-(2*padding);
  
  // Arrange in a branching grid pattern that spreads across the space
  const cols=Math.ceil(Math.sqrt(topicCount*0.6)); // Slightly wider than tall
  const rows=Math.ceil(topicCount/cols);
  
  const colWidth=usableW/(cols+1);
  const rowHeight=usableH/(rows+1);
  
  for(let i=0;i<topicCount;i++){
    const row=Math.floor(i/cols);
    const col=i%cols;
    const jitterX=(Math.random()-0.5)*colWidth*0.3;
    const jitterY=(Math.random()-0.5)*rowHeight*0.3;
    const x=padding+((col+0.5)*colWidth)+jitterX;
    const y=padding+((row+0.5)*rowHeight)+jitterY;
    positions.push({x:Math.round(x),y:Math.round(y),idx:i});
  }
  
  return positions;
}

// Draw connector lines between nodes with bezier curves
function drawConnectors(positions, containerWidth, containerHeight){
  const svg=document.getElementById('map-connectors');
  if(!svg)return;
  svg.innerHTML='';
  svg.setAttribute('width',containerWidth||1000);
  svg.setAttribute('height',containerHeight||800);
  
  if(positions.length<2)return;
  
  // Draw curved path connecting sequential topics
  for(let i=0;i<positions.length-1;i++){
    const p1=positions[i];
    const p2=positions[i+1];
    
    // Use quadratic bezier curve for smoother, more organic paths
    const ctrlX=(p1.x+p2.x)/2+((Math.random()-0.5)*120);
    const ctrlY=(p1.y+p2.y)/2+((Math.random()-0.5)*100);
    
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d',`M ${p1.x+50} ${p1.y+50} Q ${ctrlX} ${ctrlY} ${p2.x+50} ${p2.y+50}`);
    path.setAttribute('stroke','rgba(100,200,255,0.25)');
    path.setAttribute('stroke-width','1.5');
    path.setAttribute('fill','none');
    path.setAttribute('stroke-dasharray','6,2');
    svg.appendChild(path);
    
    // Add directional indicator at midpoint
    const t=0.5;
    const mx=Math.pow(1-t,2)*p1.x+2*(1-t)*t*ctrlX+Math.pow(t,2)*p2.x;
    const my=Math.pow(1-t,2)*p1.y+2*(1-t)*t*ctrlY+Math.pow(t,2)*p2.y;
    const circle=document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('cx',mx);
    circle.setAttribute('cy',my);
    circle.setAttribute('r','3');
    circle.setAttribute('fill','rgba(100,200,255,0.5)');
    svg.appendChild(circle);
  }
}

function showTopicMap(){
  if(!selectedCourseId)return;
  const course=getCourseById(selectedCourseId);
  if(!course)return;
  
  selectedTopicId=null;
  lastScreen='topic-map';
  
  // Hide course selector UI
  const courseContainer=document.getElementById('course-selection-container');
  if(courseContainer)courseContainer.style.display='none';
  
  // Show world map
  const worldMapDiv=document.getElementById('world-map');
  if(worldMapDiv)worldMapDiv.style.display='block';
  
  // Update course title in map
  const mapTitle=document.getElementById('map-course-title');
  if(mapTitle)mapTitle.textContent=course.title.toUpperCase();
  
  // Get world layout for this course
  const layout = getWorldLayout(selectedCourseId, course.topics.length);
  
  // Initialize Leaflet world map with background image and markers
  // This replaces the old SVG-based rendering
  if(typeof initLeafletWorldMap !== 'undefined'){
    initLeafletWorldMap(selectedCourseId, course, layout);
  } else {
    console.warn('⚠️  world-map.js not loaded - Leaflet map unavailable');
  }
  
  // Hide start session button on topic map (show it only when topic selected)
  updateStartSessionButton();
  
  // Show topic-map nav buttons (we're showing topic map)
  const navBtnsDiv=document.querySelector('.topic-map-nav-buttons');
  if(navBtnsDiv)navBtnsDiv.style.display='flex';
  
  // Hide other screen containers (mutual exclusive views)
  const combinedStudyContainer=document.getElementById('combined-study-container');
  if(combinedStudyContainer)combinedStudyContainer.style.display='none';
  
  // Show course selector container (it contains the whole UI now)
  const sel=document.getElementById('course-selector');
  if(sel)sel.style.display='flex';
}

function selectTopic(topicId){
  selectedTopicId=topicId;
  updateStartSessionButton();
  
  // Update visual state of all topic buttons
  const btns=document.querySelectorAll('button[data-topic-id]');
  btns.forEach(btn=>{
    if(btn.dataset.topicId===topicId){
      btn.classList.add('green');
      // Enhance glow for selected landmark
      const currentShadow = btn.style.boxShadow;
      btn.style.boxShadow = currentShadow.replace('0 0 15px', '0 0 30px').replace('0 0 20px', '0 0 35px');
    } else {
      btn.classList.remove('green');
      // Restore original shadow
      if(btn.getAttribute('data-default-shadow')){
        btn.style.boxShadow = btn.getAttribute('data-default-shadow');
      }
    }
  });
}

function startStudySession(){
  if(!selectedCourseId || !selectedTopicId)return;
  const course=getCourseById(selectedCourseId);
  const topic=course.topics.find(t=>t.id===selectedTopicId);
  if(!topic)return;

  // Route Basics of Anesthesia - Opioids (ba-t09) to the new engine + opioid question bank
  if(selectedCourseId==='basics-anesthesia' && selectedTopicId==='ba-t09'){
    const opioidQs = window.opioidsQuestions;
    if(opioidQs && opioidQs.length > 0 && typeof window.startGameWithQuestions === 'function'){
      console.log('COURSE:', selectedCourseId, '→ routing to basics-of-anesthesia / node-9');
      console.log('NODE: node-9 (Opioids Chapter 9)');
      console.log('QUESTION COUNT:', opioidQs.length);
      console.log('FIRST QUESTION:', opioidQs[0]);
      const shuffled = opioidQs.slice().sort(()=>Math.random()-0.5);
      window.currentSession = { courseId:'basics-of-anesthesia', nodeId:'node-9', questions:shuffled };
      const sel=document.getElementById('course-selector');
      if(sel)sel.style.display='none';
      window.startGameWithQuestions(shuffled);
      return;
    }
  }

  let qs=[];

  if(topic.type==='mastery'){
    // Mastery mode: placeholder for now
    showOV('🧠 Mastery mode coming soon! Keep mastering the topics to unlock.');
    return;
  } else if(topic.type==='synthesis'){
    // Synthesis: all questions from all topics in the course
    const topicIds = course.topics.filter(t=>t.type==='topic').map(t=>t.id);
    const regex = new RegExp(topicIds.join('|'));
    qs = ALL_QS.filter(q=>regex.test(q.topicId||'')).map(q=>({...q}));
    qs = shuffle(qs);
  } else {
    // Regular topic: questions matching this topicId
    qs=getQuestionPool({topicId:selectedTopicId});
  }

  if(qs.length===0){
    qs=shuffle(ALL_QS.slice()).slice(0,10);
  }

  const label=`${course.title} • ${topic.title}`;
  const sel=document.getElementById('course-selector');
  if(sel)sel.style.display='none';
  launchGame(qs,label,3);
}

function showSplash(){
  document.getElementById('course-selector').style.display='none';
  document.getElementById('splash').style.display='flex';
  selectedCourseId=null;
  selectedTopicId=null;
}

function hideCourseSelector(){
  const sel=document.getElementById('course-selector');
  if(sel)sel.style.display='none';
  selectedCourseId=null;
  selectedTopicId=null;
  showMap();
}

// confirmTopicSelection is now called startStudySession
function confirmTopicSelection(){
  // Deprecated - use startStudySession() instead
  startStudySession();
}

function startLevel(idx){
  // This is called from the old level map; now show course selector
  showCourseSelector();
}

function startSpecial(mode){
  gameMode=mode;activeLevelIdx=-1;
  if(mode==='hard'){timerSpeed=.14;pointMult=2;launchGame(buildHardQs(),'🔥 HARD MODE',5);}
  else if(mode==='blitz'){timerSpeed=.28;pointMult=1;launchGame(buildBlitzQs(),'⚡ BLITZ MODE',3);}
}

function launchGame(qs,label,lives){
  // Ensure legacy engine flag is set
  if(typeof window !== 'undefined') window.usingNewEngine = false;
  document.getElementById('level-map').classList.remove('on');
  document.getElementById('game').style.display='flex';
  G={q:0,score:0,lives:lives,maxLives:lives,streak:0,tmr:100,tid:null,done:false,qs:qs,shieldActive:false,label:label};
  levelHistory=[];missedQs=[];
  // Build dynamic hearts
  const livesEl=document.getElementById('lives');livesEl.innerHTML='';
  for(let i=1;i<=lives;i++){const s=document.createElement('span');s.className='hlf';s.id='l'+i;s.textContent='♥';livesEl.appendChild(s);}
  drawSRNA();updatePwrBtns();updateLives();
  document.getElementById('scv').textContent=bankedPts.toLocaleString();
  document.getElementById('qt').textContent=G.qs.length;
  document.getElementById('lvl-b').textContent=label;
  setTimeout(loadQ,400);
  setTimeout(()=>showOV(G.qs.length+' challenges. '+label+'. Don\'t kill the patient, '+playerName+'.'),1200);
}

function loadQ(){
  if(G.q>=G.qs.length){
    if(missedQs.length>0){
      const retry=missedQs.splice(0,Math.min(3,missedQs.length));
      retry.forEach(rq=>{rq.setup='🔄 RETRY — You missed this before. '+rq.setup;});
      G.qs.push(...retry);
      document.getElementById('qt').textContent=G.qs.length;
    }
    if(G.q>=G.qs.length){endGame(true);return;}
  }
  const q=G.qs[G.q];
  document.getElementById('qn').textContent=G.q+1;
  document.getElementById('prog-fill').style.width=((G.q/G.qs.length)*100)+'%';
  document.getElementById('chb').textContent='📚 '+q.ch;
  document.getElementById('ovs').textContent=q.setup;
  document.getElementById('qtxt').textContent=q.q;
  curScene=q.scene;curSceneCfg=q.sceneCfg||{};sceneT=0;
  if(sceneAnimId)cancelAnimationFrame(sceneAnimId);animScene();
  const ag=document.getElementById('ans-grid'),ta=document.getElementById('type-area'),ci=document.getElementById('click-inst');
  ag.style.display='none';ta.style.display='none';ci.style.display='none';
  if(q.type==='mcq'){
    ag.style.display='grid';
    const order=[0,1,2];for(let i=2;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
    for(let i=0;i<3;i++){const b=document.getElementById('b'+i);b.textContent=q.ans[order[i]].t;b.dataset.ai=order[i];b.className='abtn';b.disabled=false;b.onclick=()=>pickMCQ(i);}
  }
  else if(q.type==='type'){ta.style.display='block';document.getElementById('type-input').value='';document.getElementById('type-hint').textContent=q.hint||'';setTimeout(()=>document.getElementById('type-input').focus(),100);}
  else if(q.type==='click'){ci.style.display='block';}
  G.done=false;G.shieldActive=inv.shield>0;
  const ro=document.getElementById('result');ro.className='';ro.style.opacity='0';ro.style.visibility='hidden';
  document.getElementById('ch-wrap').classList.add('on');
  updatePwrBtns();startTimer();
}

function startTimer(){startTimerFrom(100);}
function startTimerFrom(val){G.tmr=val;clearInterval(G.tid);document.getElementById('tmr-fill').style.width=G.tmr+'%';document.getElementById('tmr-fill').style.background=G.tmr<25?'#ff2200':'linear-gradient(90deg,#ff2200,#ff8800)';
G.tid=setInterval(()=>{G.tmr-=timerSpeed;document.getElementById('tmr-fill').style.width=G.tmr+'%';if(G.tmr<25)document.getElementById('tmr-fill').style.background='#ff2200';if(G.tmr<=0){clearInterval(G.tid);if(!G.done)timeout();}},120);}
function timeout(){G.done=true;process(false);}

function pickMCQ(bi){if(G.done)return;G.done=true;clearInterval(G.tid);const q=G.qs[G.q],b=document.getElementById('b'+bi),ai=parseInt(b.dataset.ai),ok=q.ans[ai].ok;
for(let i=0;i<3;i++){const btn=document.getElementById('b'+i);btn.disabled=true;if(q.ans[parseInt(btn.dataset.ai)].ok)setTimeout(()=>btn.classList.add('correct'),120);else if(i===bi&&!ok)btn.classList.add('wrong');}
setTimeout(()=>process(ok),850);}

function submitType(){if(G.done)return;G.done=true;clearInterval(G.tid);const q=G.qs[G.q],val=document.getElementById('type-input').value.trim().toLowerCase().replace(/[^a-z0-9\s.-]/g,'');
const ok=q.accepted.some(a=>val.includes(a.toLowerCase())||val.replace(/\s/g,'').includes(a.toLowerCase().replace(/\s/g,'')));
document.getElementById('type-input').style.borderColor=ok?'#00ff88':'#ff2200';document.getElementById('type-input').style.color=ok?'#00ff88':'#ff2200';
setTimeout(()=>process(ok),600);}
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&document.getElementById('type-area').style.display==='block'&&G&&!G.done)submitType();});

function process(ok){const q=G.qs[G.q];
updateQuestionStats(q, ok);
const correctAns=q.type==='mcq'?q.ans.find(a=>a.ok).t:(q.accepted?q.accepted[0]:'');
levelHistory.push({qText:q.q,correct:ok,correctAns:correctAns,ex:q.ex});

if(ok){G.streak++;const mult=(1+Math.floor(G.streak/3))*pointMult;const pts=Math.max(1,Math.floor(G.tmr/6))*mult;G.score+=pts*100;
bankedPts+=pts*100;save();
flashHex=0x00ff44;flashT=1.8;beatSpd=2.2;partSpd=2.2;setTimeout(()=>{beatSpd=1;partSpd=1;},1800);
scorePop('+'+(pts*100));document.getElementById('skv').textContent='🔥×'+mult;
if([3,6,9].includes(G.streak))showOV(rand(OV_STREAK));else showOV(rand(OV_WIN));vitalsOK();}
else{G.streak=0;
if(!q.setup.startsWith('🔄'))missedQs.push({...q});
if(!missedQuestionIds.includes(q.id)) missedQuestionIds.push(q.id);
if(G.shieldActive&&inv.shield>0){inv.shield--;G.shieldActive=false;showOV("🫁 VENT SAVED YOUR ASS. Wrong answer but no life lost. Shield gone.");flashHex=0xffaa00;flashT=1.5;updatePwrBtns();}
else{G.lives--;flashHex=0xff2200;flashT=2.2;beatSpd=.25;ecgFlat=true;setTimeout(()=>{beatSpd=1;ecgFlat=false;},2200);
document.getElementById('app').classList.add('shaking');setTimeout(()=>document.getElementById('app').classList.remove('shaking'),450);
vitalsBAD();updateLives();showOV(rand(OV_LOSE));if(G.lives<=0){showResult(ok,q);document.getElementById('scv').textContent=bankedPts.toLocaleString();setTimeout(()=>endGame(false),4000);return;}}
document.getElementById('skv').textContent='🔥×1';}
if(ok && missedQuestionIds.includes(q.id)) missedQuestionIds=missedQuestionIds.filter(id=>id!==q.id);
updateWeakTopicRatings();
save();
document.getElementById('scv').textContent=bankedPts.toLocaleString();showResult(ok,q);}

function showResult(ok,q){const ro=document.getElementById('result');ro.className='on '+(ok?'win-bg':'lose-bg');ro.style.opacity='1';ro.style.visibility='visible';
document.getElementById('r-v').textContent=ok?'⚡ CORRECT ⚡':'💀 WRONG 💀';document.getElementById('r-q').textContent=ok?q.win:q.lose;document.getElementById('r-ex').innerHTML='<strong>THE PHYSICS:</strong> '+q.ex;
document.querySelector('.nxt-btn').style.display=(G.lives<=0)?'none':'';}

function nextQ(){G.q++;const ro=document.getElementById('result');ro.style.opacity='0';ro.style.visibility='hidden';ro.className='';document.getElementById('ch-wrap').classList.remove('on');setTimeout(loadQ,500);}

function updateLives(){const ml=G?G.maxLives:3;for(let i=1;i<=ml;i++){const el=document.getElementById('l'+i);if(el){if(G&&G.lives>=i)el.classList.remove('dead');else el.classList.add('dead');}}}
function vitalsOK(){['vhr','vbp','vsp','vmap'].forEach(id=>{document.getElementById(id).className='vv';});document.getElementById('vhr').textContent=68+Math.floor(Math.random()*10);document.getElementById('vbp').textContent='118/76';document.getElementById('vsp').textContent=98+Math.floor(Math.random()*2);document.getElementById('vmap').textContent='90';}
function vitalsBAD(){document.getElementById('vhr').textContent=125+Math.floor(Math.random()*25);document.getElementById('vhr').className='vv warn';document.getElementById('vbp').textContent='78/42';document.getElementById('vbp').className='vv bad';document.getElementById('vsp').textContent=84+Math.floor(Math.random()*6);document.getElementById('vsp').className='vv bad';document.getElementById('vmap').textContent='54';document.getElementById('vmap').className='vv bad';setTimeout(vitalsOK,3500);}
function showOV(t){const b=document.getElementById('ovb');b.textContent=t;b.classList.add('show');setTimeout(()=>b.classList.remove('show'),5500);}
function scorePop(t){const p=document.createElement('div');p.className='score-pop';p.textContent=t;p.style.right='20px';p.style.top='90px';document.getElementById('app').appendChild(p);setTimeout(()=>p.remove(),1600);}

function endGame(won){
  if(sceneAnimId)cancelAnimationFrame(sceneAnimId);
  // Save level completion
  if(won&&gameMode==='campaign'&&activeLevelIdx>=0){
    saveLevelComplete(LEVELS[activeLevelIdx].id,G.score);
  }
  save();
  // Always show level review (wins and losses)
  showLevelReview(won);
}

function showLevelReview(won){
  document.getElementById('game').style.display='none';
  document.getElementById('go').classList.remove('on');
  const rev=document.getElementById('lvl-review');rev.innerHTML='';
  const correct=levelHistory.filter(h=>h.correct).length;
  const total=levelHistory.length;
  // Status banner
  const banner=document.createElement('div');
  if(won){
    banner.style.cssText='font-size:1.1rem;color:#00ff88;font-weight:900;text-align:center;margin-bottom:.4rem;text-shadow:0 0 20px #00ff88;';
    banner.textContent='✅ LEVEL COMPLETE';
  }else{
    banner.style.cssText='font-size:1.1rem;color:#ff2200;font-weight:900;text-align:center;margin-bottom:.4rem;text-shadow:0 0 20px #ff0000;';
    banner.textContent='💀 PATIENT DECEASED';
  }
  rev.appendChild(banner);
  const hdr=document.createElement('div');hdr.style.cssText='font-size:.7rem;color:#ffaa00;font-weight:700;margin-bottom:.5rem;text-align:center;letter-spacing:.1em;';
  hdr.textContent='📋 LEVEL REVIEW — '+correct+'/'+total+' CORRECT';
  rev.appendChild(hdr);
  levelHistory.forEach((h,idx)=>{
    const d=document.createElement('div');d.className='rev-item '+(h.correct?'rev-correct':'rev-wrong');
    let inner='<div class="rev-q">'+h.qText+'</div><div class="rev-a">'+(h.correct?'✅ Correct':'❌ Wrong — '+h.correctAns)+'</div>';
    if(!h.correct){
      inner+='<div class="rev-tap">👆 Tap to see explanation</div>';
      inner+='<div class="rev-ex" id="rev-ex-'+idx+'">'+h.ex+'</div>';
    }
    d.innerHTML=inner;
    if(!h.correct)d.onclick=()=>{const el=document.getElementById('rev-ex-'+idx);el.classList.toggle('open');};
    rev.appendChild(d);
  });
  document.getElementById('lvl-t').textContent=won?(G.label||'LEVEL COMPLETE'):'GAME OVER';
  document.getElementById('lvl-n').textContent=won?(correct===total?'PERFECT SCORE! 🎉':'Review your answers below'):'You flatlined. Review what went wrong:';
  document.getElementById('lvl-sc').textContent='Earned: '+G.score.toLocaleString()+' pts | Banked: '+bankedPts.toLocaleString()+' pts';
  document.getElementById('lvl-continue-btn').style.display='none';
  document.getElementById('lvl-screen').classList.add('on');
}

function closeLvl(){document.getElementById('lvl-screen').classList.remove('on');document.getElementById('lvl-continue-btn').style.display='';showCourseSelector();}
function backToMap(){document.getElementById('lvl-screen').classList.remove('on');document.getElementById('lvl-continue-btn').style.display='';showCourseSelector();}

function restart(){
  document.getElementById('go').classList.remove('on');document.getElementById('go-t').style.color='';document.getElementById('go-t').style.textShadow='';
  showCourseSelector();
}

// Allow new engine to cancel legacy #scn canvas animation
window.stopLegacyScene = function() {
  if (sceneAnimId) { cancelAnimationFrame(sceneAnimId); sceneAnimId = null; }
  curScene = null;
  curSceneCfg = {};
};
