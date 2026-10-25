
(()=>{'use strict';
const $=id=>document.getElementById(id);const canvas=$('game'),ctx=canvas.getContext('2d',{alpha:false});const shell=$('shell');const TAU=Math.PI*2;const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));const lerp=(a,b,t)=>a+(b-a)*t;const sign=x=>x<0?-1:1;let W=960,H=540,DPR=1,gameState='menu',prevGameState='menu',last=0,clock=0,worldTime=0,frame=0,camX=-170,camY=0,shake=0,flash=0,mode='endless',seed=1,rng=null,fxRng=null,ground=[],hazards=[],enemies=[],particles=[],sparks=[],labels=[],cursor=0,roadY=395,moduleCount=0,nextEnemyX=850,generatedUpTo=0,finishX=5100,player=null,score=0,kills=0,nearMisses=0,runTime=0,warningText='',warningUntil=0,toastText='',toastUntil=0,settings={god:false,slow:false,hitboxes:false,shake:true,sound:true},touchActive=false;
function hashSeed(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}function srand(n){let a=n>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=Math.imul(a^(a>>>15),1|a);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296}}function rand(a,b){return a+(b-a)*(fxRng?fxRng():Math.random())}function randTrack(a,b){return a+(b-a)*rng()}function pickTrack(a){return a[Math.floor(rng()*a.length)]}
function resize(){DPR=Math.min(window.devicePixelRatio||1,2);W=Math.max(320,shell.clientWidth);H=Math.max(200,shell.clientHeight);canvas.width=Math.floor(W*DPR);canvas.height=Math.floor(H*DPR)}window.addEventListener('resize',resize);resize();
let audioCtx=null,engineOsc=null,engineGain=null;function audioInit(){if(!settings.sound)return;try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();if(!engineOsc){engineOsc=audioCtx.createOscillator();let filter=audioCtx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=180;engineGain=audioCtx.createGain();engineGain.gain.value=.0001;engineOsc.type='sawtooth';engineOsc.connect(filter);filter.connect(engineGain);engineGain.connect(audioCtx.destination);engineOsc.start();engineOsc.frequency.value=60}}catch(e){settings.sound=false}}function fx(freq=190,secs=.13,type='sawtooth',gain=.07){if(!audioCtx||!settings.sound)return;try{const o=audioCtx.createOscillator(),v=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(freq,audioCtx.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(35,freq*.42),audioCtx.currentTime+secs);v.gain.setValueAtTime(gain,audioCtx.currentTime);v.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+secs);o.connect(v);v.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+secs+.01)}catch(e){}}
const pressed={gas:false,brake:false,back:false,forward:false,jump:false,attack:false,boost:false};const keyMap={ArrowUp:'gas',KeyW:'gas',ArrowDown:'brake',KeyS:'brake',ArrowLeft:'back',KeyA:'back',ArrowRight:'forward',KeyD:'forward',KeyZ:'jump',KeyJ:'jump',Space:'attack',KeyX:'boost',ShiftLeft:'boost',ShiftRight:'boost'};let justJump=false,justAttack=false;
function setControl(k,on){if(!(k in pressed))return;if(on&&!pressed[k]){if(k==='jump')justJump=true;if(k==='attack')justAttack=true}pressed[k]=on}function clearControls(){for(const k in pressed)pressed[k]=false;justJump=justAttack=false;document.querySelectorAll('.pad').forEach(e=>e.classList.remove('pressed'))}
window.addEventListener('keydown',e=>{if(e.ctrlKey&&e.shiftKey&&e.code==='KeyD'){e.preventDefault();toggleDev();return}if(e.code==='Escape'||e.code==='KeyP'){if(!$('devMenu').classList.contains('hidden')){closeDev();return}if(!$('manual').classList.contains('hidden')){closeManual();return}if(gameState==='play'||gameState==='pause'){pauseToggle();return}}if(keyMap[e.code]){if(['Space','ArrowUp','ArrowDown','ArrowRight','ArrowLeft'].includes(e.code))e.preventDefault();if(gameState==='play')setControl(keyMap[e.code],true)}if(gameState==='dead'&&e.code==='Enter')startGame(false)});window.addEventListener('keyup',e=>{if(keyMap[e.code])setControl(keyMap[e.code],false)});window.addEventListener('blur',()=>{clearControls();if(gameState==='play')pauseToggle()});document.querySelectorAll('.pad').forEach(el=>{const inp=el.dataset.input;el.addEventListener('pointerdown',e=>{e.preventDefault();touchActive=true;try{el.setPointerCapture(e.pointerId)}catch(_){}setControl(inp,true);el.classList.add('pressed')});const up=e=>{e.preventDefault();setControl(inp,false);el.classList.remove('pressed')};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('lostpointercapture',()=>{setControl(inp,false);el.classList.remove('pressed')})});
function gap(w){cursor+=w}function decorate(type,start,end){labels.push({start,end,type})}



function platformY(h){return h.y+Math.sin(worldTime*h.speed+h.phase)*h.amp}




function quit(){activeEvent=null;gameState='menu';clearControls();$('menu').classList.remove('hidden');$('pauseMenu').classList.add('hidden');$('endMenu').classList.add('hidden');$('hud').style.display='none';$('topButtons').style.display='none';$('controlsHelp').style.display='none';$('mobile').classList.remove('playing')}
function pauseToggle(){if(gameState==='play'){gameState='pause';clearControls();$('pauseStats').textContent=`${(player.x/1000).toFixed(2)} KM TRAVELED  •  ${kills} TAKEDOWNS  •  TRACK SEED ${seed}`;$('pauseMenu').classList.remove('hidden')}else if(gameState==='pause'){gameState='play';$('pauseMenu').classList.add('hidden');last=performance.now()}}
function showManual(){prevGameState=gameState;if(gameState==='play')gameState='pause';clearControls();$('manual').classList.remove('hidden');$('pauseMenu').classList.add('hidden')}
function closeManual(){$('manual').classList.add('hidden');if(prevGameState==='play'){gameState='play';last=performance.now()}else if(prevGameState==='pause'){$('pauseMenu').classList.remove('hidden');gameState='pause'}else gameState='menu'}
function toggleDev(){if(!$('devMenu').classList.contains('hidden')){closeDev();return}if(gameState!=='play'&&gameState!=='pause')return;prevGameState=gameState;gameState='pause';clearControls();$('pauseMenu').classList.add('hidden');$('devMenu').classList.remove('hidden');$('devSeed').textContent=String(seed);$('devGod').checked=settings.god;$('devSlow').checked=settings.slow;$('devHitboxes').checked=settings.hitboxes;$('devShake').checked=settings.shake;$('devCounts').textContent=`${enemies.length} / ${hazards.length}`}
function closeDev(){$('devMenu').classList.add('hidden');if(prevGameState==='play'){gameState='play';last=performance.now()}else{$('pauseMenu').classList.remove('hidden');gameState='pause'}}
function toast(str,duration=1.1){toastText=str;toastUntil=worldTime+duration}function warn(str,duration=1.4){warningText=str;warningUntil=worldTime+duration}
function smoke(x,y,count=12,power=100,hue='white'){count=Math.min(count,settings.fullFX?count:Math.ceil(count*.35));for(let i=0;i<count;i++){let a=rand(0,TAU),v=rand(15,power),life=rand(.18,.65);particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-25,life,maxLife:life,size:rand(1,4),hue,grav:rand(30,150)})}if(particles.length>550)particles.splice(0,particles.length-550)}
function trail(b){const chance=b.vx>360?.79:.32;if(Math.random()>chance)return;let x=b.x-24*Math.cos(b.angle)+9*Math.sin(b.angle),y=b.y-24*Math.sin(b.angle)+9*Math.cos(b.angle);let life=rand(.12,.35);particles.push({x,y,vx:-rand(45,150)-b.vx*.13,vy:rand(-20,20),life,maxLife:life,size:rand(1,3),hue:b.enemy?'dim':b.charge>0?'cyan':'white',grav:30})}
function boom(x,y,power=1){smoke(x,y,Math.floor(28*power),210*power,'white');smoke(x,y,Math.floor(18*power),160*power,'cyan');shake=Math.max(shake,7*power);flash=Math.max(flash,.16*power);fx(90,.35,'sawtooth',.095);for(const h of hazards){if(h.type==='barrel'&&!h.broken&&Math.hypot(h.x-x,h.y-y)<118*power){h.broken=true;setTimeoutSafeExplosion(h)} }for(const g of ground){if(g.fragile&&!g.dead){let mx=(g.x1+g.x2)/2,my=(g.y1+g.y2)/2;if(Math.hypot(mx-x,my-y)<80*power){g.dead=true;smoke(mx,my,15,90,'dim')}}}for(const b of [player,...enemies]){if(b.dead||b.gone)continue;let r=Math.hypot(b.x-x,b.y-y);if(r<105*power){damage(b,Math.round((1-r/(105*power))*31*power),'EXPLOSION');b.vy-=110;b.vx+=b.x>x?65:-70}}}
function setTimeoutSafeExplosion(h){h._explosionPending=true}function hurtFlash(){flash=Math.max(flash,.10);shake=Math.max(shake,4)}


function boomVisualOnly(x,y){smoke(x,y,38,250,'white');smoke(x,y,15,180,'cyan');shake=Math.max(shake,7);flash=Math.max(flash,.13)}







function fmtTime(t){let m=Math.floor(t/60),s=Math.floor(t%60);return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
function screenX(x){return x-camX}function drawLine(x1,y1,x2,y2,col='#e8f7ff',width=2){ctx.strokeStyle=col;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
function drawBackground(){ctx.fillStyle='#05070a';ctx.fillRect(0,0,W,H);const mid=390-camY;ctx.save();let cityShift=(camX*.11)%90;ctx.fillStyle='#0e1820';for(let i=-2;i<W/90+3;i++){const hx=80+(Math.sin((i+Math.floor(camX*.11/90))*17.49)+1)*78;let x=i*90-cityShift;ctx.fillRect(x,mid-hx-74,65,hx+125);for(let j=0;j<7;j++){const yy=mid-hx-65+j*19;ctx.fillStyle=(j+i)%4===0?'#25323d':'#101e27';ctx.fillRect(x+12,yy,3,5);ctx.fillRect(x+34,yy,3,5)}}ctx.strokeStyle='#1d2c33';ctx.lineWidth=1;for(let j=0;j<5;j++){let y=mid+46+j*33;drawLine(0,y,W,y,'#131b25',1)}const shift=(camX*.26)%125;for(let i=-1;i<W/125+2;i++){let x=i*125-shift;drawLine(x,mid-185,x+80,mid-185,'#101b24',1)}ctx.restore();let grad=ctx.createLinearGradient(0,mid-140,0,H);grad.addColorStop(0,'#05070a00');grad.addColorStop(1,'#11192744');ctx.fillStyle=grad;ctx.fillRect(0,mid-140,W,H)}
function drawRoad(){for(const g of ground){if(g.x2<camX-60||g.x1>camX+W+60||g.dead)continue;const x1=screenX(g.x1),x2=screenX(g.x2),y1=g.y1-camY,y2=g.y2-camY;ctx.fillStyle=g.fragile?'#1b2630':'#121c25';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.lineTo(x2,H+220);ctx.lineTo(x1,H+220);ctx.closePath();ctx.fill();drawLine(x1,y1,x2,y2,g.fragile?'#9faab5':'#e4faff',g.fragile?2:3);drawLine(x1,y1+8,x2,y2+8,'#324856',1);const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);if(g.fragile){for(let j=0;j<len/19;j++){const t=j*19/len;let x=lerp(x1,x2,t),y=lerp(y1,y2,t);drawLine(x-3,y+2,x+4,y+10,'#8eabb2',1)}}else{for(let j=0;j<len/42;j++){const t=j*42/len;let x=lerp(x1,x2,t),y=lerp(y1,y2,t);drawLine(x,y+19,x+7,y+19,'#243540',1)}}if(g.conveyor){for(let j=0;j<len/25;j++){const t=((j*25+worldTime*56)%Math.max(1,len))/Math.max(1,len);const px=lerp(x1,x2,t),py=lerp(y1,y2,t);drawLine(px-7,py+5,px+7,py+5,'#73eaf8',2)}}if(g.launch){const mx=lerp(x1,x2,.7),my=lerp(y1,y2,.7);drawLine(mx,my-3,mx+16,my-17,'#ffffff',2)}}for(const h of hazards)if(h.type==='platform'&&h.x+h.width>camX-80&&h.x<camX+W+80&&!h.broken){const x=screenX(h.x),y=platformY(h)-camY;ctx.fillStyle='#172431';ctx.fillRect(x,y,h.width,14);drawLine(x,y,x+h.width,y,'#f2ffff',3);drawLine(x+10,y+7,x+h.width-10,y+7,'#758f9e',1);drawLine(x+h.width/2,y+14,x+h.width/2,510-camY,'#344954',1);drawLine(x+h.width/2-12,510-camY,x+h.width/2+12,510-camY,'#344954',3)}}
function blade(x,y,r,t){ctx.save();ctx.translate(x,y);ctx.rotate(t);ctx.strokeStyle='#e4f6ff';ctx.fillStyle='#081018';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<16;i++){let a=i*TAU/16,r1=i%2===0?r+7:r-2;let xx=Math.cos(a)*r1,yy=Math.sin(a)*r1;if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy)}ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(0,0,r*.55,0,TAU);ctx.strokeStyle='#91a8b7';ctx.stroke();drawLine(-r*.6,0,r*.6,0,'#a6c8d3',1);drawLine(0,-r*.6,0,r*.6,'#a6c8d3',1);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,4,0,TAU);ctx.fill();ctx.restore()}
function drawHazards(){for(const h of hazards){let x=screenX(h.x),y=h.y-camY;if(x< -(h.length||220)||x>W+220||h._gone)continue;ctx.save();if(h.type==='magrail'){ctx.beginPath();for(let i=0;i<=60;i++){const xx=x+h.length*i/60,yy=y-h.rise*Math.sin(Math.PI*i/60);if(!i)ctx.moveTo(xx,yy+28);else ctx.lineTo(xx,yy+28)}ctx.lineWidth=9;ctx.strokeStyle='#203442';ctx.stroke();ctx.lineWidth=2;ctx.strokeStyle='#ac98ff';ctx.stroke();}
if(h.type==='loop'){
  ctx.beginPath();ctx.arc(x,y,h.radius,0,TAU);ctx.lineWidth=13;ctx.strokeStyle='#152c35';ctx.stroke();
  ctx.beginPath();ctx.arc(x,y,h.radius,0,TAU);ctx.lineWidth=3;ctx.strokeStyle='#d5faff';ctx.stroke();
  ctx.setLineDash([7,13]);ctx.beginPath();ctx.arc(x,y,h.radius-8,0,TAU);ctx.lineWidth=2;ctx.strokeStyle='#4ad5e5';ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#9df6ff';ctx.font='bold 12px monospace';ctx.textAlign='center';/* No floating hazard instruction: read the rail visually. */
 }
 if(h.type==='saw'){let yy=y+Math.sin(worldTime*1.7+h.phase)*9;drawLine(x,yy-87,x,yy-29,'#647884',3);blade(x,yy,h.radius,worldTime*6+h.phase)}
if(h.type==='spikes'){ctx.strokeStyle='#f5faff';ctx.fillStyle='#172532';ctx.lineWidth=2;for(let xx=0;xx<h.width;xx+=14){ctx.beginPath();ctx.moveTo(x+xx,y);ctx.lineTo(x+xx+7,y-19);ctx.lineTo(x+xx+14,y);ctx.closePath();ctx.fill();ctx.stroke()}}
if(h.relay&&!h.broken){drawLine(x,y-65,x,y-20,'#54f2ff',3);ctx.strokeStyle='#54f2ff';ctx.strokeRect(x-22,y-25,44,48);ctx.font='bold 10px monospace';ctx.fillStyle='#54f2ff';ctx.fillText('◆',x-5,y-43)}
if(h.type==='barrel'&&!h.broken){ctx.fillStyle='#17212a';ctx.fillRect(x-12,y-16,24,29);ctx.strokeStyle='#f7f7f7';ctx.lineWidth=2;ctx.strokeRect(x-12,y-16,24,29);drawLine(x-12,y-9,x+12,y-9,'#99acbb',2);drawLine(x-12,y+6,x+12,y+6,'#99acbb',2);ctx.font='bold 19px monospace';ctx.textAlign='center';ctx.fillStyle='#f7e5eb';ctx.fillText('!',x,y+5)}
if(h.type==='crusher'){let v=(Math.sin(worldTime*2.4+h.phase)+1)/2,by=y+v*105;drawLine(x,y-125,x,y-5,'#405765',7);ctx.fillStyle='#1e2d36';ctx.fillRect(x-31,by-21,62,40);ctx.strokeStyle='#ecfcff';ctx.lineWidth=2;ctx.strokeRect(x-31,by-21,62,40);for(let j=-22;j<30;j+=15){ctx.beginPath();ctx.moveTo(x+j,by+19);ctx.lineTo(x+j+7,by+28);ctx.lineTo(x+j+14,by+19);ctx.stroke()}}
if(h.type==='swing'){let a=Math.sin(worldTime*1.6+h.phase)*1.03,px=x+Math.sin(a)*h.length,py=y+Math.cos(a)*h.length;drawLine(x,y,px,py,'#8b9eae',3);ctx.fillStyle='#061018';ctx.strokeStyle='#eafaff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(px,py,h.radius,0,TAU);ctx.fill();ctx.stroke();for(let j=0;j<8;j++){let aa=j*TAU/8+worldTime;drawLine(px+Math.cos(aa)*(h.radius-10),py+Math.sin(aa)*(h.radius-10),px+Math.cos(aa)*(h.radius+6),py+Math.sin(aa)*(h.radius+6),'#eef9ff',2)}}
if(h.type==='laser'){let on=Math.sin(worldTime*2.6+h.phase)>.12;drawLine(x,y-10,x,y+110,on?'#edfaff':'#475b69',on?4:1);if(on){ctx.globalAlpha=.2;drawLine(x,y-10,x,y+110,'#54f2ff',14);ctx.globalAlpha=1}ctx.fillStyle='#192a37';ctx.strokeStyle='#bcd5de';ctx.fillRect(x-12,y-24,24,13);ctx.strokeRect(x-12,y-24,24,13)}
if(h.type==='gate'&&!h.broken){
  ctx.strokeStyle='#f5faff';ctx.lineWidth=3;
  ctx.fillStyle='#172532';ctx.fillRect(x-19,y-55,38,64);ctx.strokeRect(x-19,y-55,38,64);
  for(let k=0;k<5;k++){drawLine(x-16,y-48+k*12,x+16,y-33+k*12,'#87aabb',1.6)}
  ctx.fillStyle='#f6dbe2';ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.fillText('X',x,y-26)
 }
 if(h.type==='wheel'){
 const cx=x+Math.sin(worldTime*h.speed+h.phase)*36;
 blade(cx,y,h.radius,worldTime*1.45+h.phase);
 drawLine(x-80,y+17,x+80,y+17,'#455a69',2);
 drawLine(x,y-h.radius-58,x,y-h.radius-5,'#627987',3);
 }
 if(h.type==='boost'){ctx.fillStyle='#10242a';ctx.strokeStyle='#7efaff';ctx.fillRect(x-25,y-3,50,5);ctx.strokeRect(x-25,y-3,50,5);for(let k=-1;k<2;k++){drawLine(x+k*13-4,y-6,x+k*13+2,y-14,'#6cf7ff',2)}}
if(settings.hitboxes){ctx.strokeStyle='#ff657b';ctx.strokeRect(x-22,y-34,44,45)}ctx.restore()}}
function rider(b){if(b.gone)return;let x=screenX(b.x),y=b.y-camY;if(x< -100||x>W+100)return;ctx.save();ctx.translate(x,y);ctx.rotate(b.angle);const color=b.enemy?(b.archetype?.color||'#a9b9c9'):'#f4fbff';const hot=b.enemy?'#ff9fba':'#76f3ff';ctx.strokeStyle=color;ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=2.4;if(b.invuln>0&&Math.floor(worldTime*20)%2===0)ctx.globalAlpha=.47;let wh=b.wheel;for(const wx of [-22,22]){ctx.beginPath();ctx.arc(wx,17,11,0,TAU);ctx.stroke();ctx.strokeStyle='#5c788a';drawLine(wx-8*Math.cos(wh),17-8*Math.sin(wh),wx+8*Math.cos(wh),17+8*Math.sin(wh),'#79929e',1);ctx.strokeStyle=color}
ctx.beginPath();ctx.moveTo(-22,17);ctx.lineTo(-8,1);ctx.lineTo(5,17);ctx.lineTo(-22,17);ctx.moveTo(5,17);ctx.lineTo(22,17);ctx.lineTo(12,-4);ctx.lineTo(-8,1);ctx.stroke();ctx.lineWidth=3;drawLine(-12,-1,8,-1,color,3);drawLine(11,-5,24,-5,color,2);
// Engine block, gas tank, pipes, front suspension: not a bicycle.
ctx.fillStyle='#12212a';ctx.fillRect(-4,2,15,13);ctx.strokeStyle=color;ctx.lineWidth=2;ctx.strokeRect(-4,2,15,13);for(let j=0;j<3;j++)drawLine(-2,5+j*3,9,5+j*3,'#7d9caa',1);
ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(-11,-3);ctx.lineTo(-7,-11);ctx.lineTo(5,-13);ctx.lineTo(13,-5);ctx.closePath();ctx.fill();drawLine(9,-1,22,20,'#aac6d0',2);drawLine(-3,14,-18,13,'#abc2ca',3);drawLine(-13,8,-31,8,color,3);drawLine(16,5,30,6,'#b0c4cd',2);
// Rider in a low racing crouch, built from clear articulated strokes.
ctx.lineWidth=4;drawLine(-4,-4,-8,-21,color,4);drawLine(-8,-21,5,-26,color,4);drawLine(5,-26,18,-10,color,3);drawLine(18,-10,23,-6,color,3);drawLine(-6,-8,-15,7,color,3);drawLine(-15,7,-8,14,color,3);ctx.fillStyle=color;ctx.beginPath();ctx.arc(8,-33,8,0,TAU);ctx.fill();drawLine(8,-34,17,-31,'#101a22',2);if(!b.enemy){drawLine(-16,-12,-26,-12,'#76f3ff',2);if(b.charge>0){drawLine(-23,1,-43,2,'#65f5ff',3);drawLine(-23,8,-39,9,'#a5feff',2)}}else{ctx.fillStyle='#a9b9c9';ctx.fillRect(-11,-27,5,7)}
if(b.attackAnim>0){ctx.strokeStyle=hot;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(12,-25);ctx.lineTo(33,-25);ctx.lineTo(42,-10);ctx.stroke();ctx.beginPath();ctx.arc(27,-14,20,-.65,.75);ctx.stroke()}
if(b.enemy&&!b.dead){ctx.fillStyle=b.archetype?.color||'#b8d1df';ctx.font='8px monospace';ctx.textAlign='center';ctx.fillText(b.name||b.role,0,-62)}
if(b.enemy&&b.telegraph>0&&b.attackIntent){ctx.fillStyle='#ff718a';ctx.font='bold 14px monospace';ctx.textAlign='center';ctx.fillText('!',0,-55);ctx.strokeStyle='#ff718a';ctx.beginPath();ctx.arc(0,-33,14,0,TAU);ctx.stroke()}if(b.damageFlash>0){ctx.strokeStyle='#ff7183';ctx.globalAlpha=Math.min(1,b.damageFlash*3);ctx.beginPath();ctx.arc(0,-9,42,0,TAU);ctx.stroke();ctx.globalAlpha=1}ctx.restore();if(b.enemy&&b.hp<b.maxHp){ctx.fillStyle='#4f6270';ctx.fillRect(x-17,y-49,34,3);ctx.fillStyle='#d4edf4';ctx.fillRect(x-17,y-49,34*Math.max(0,b.hp)/b.maxHp,3)}if(settings.hitboxes){ctx.strokeStyle='#ff697b';ctx.strokeRect(x-32,y-44,64,68);for(const [side,c] of [[-1,b.contactR],[1,b.contactF]]){const wx=x+side*22*Math.cos(b.angle)-17*Math.sin(b.angle),wy=y+side*22*Math.sin(b.angle)+17*Math.cos(b.angle)+11;ctx.fillStyle=c?'#54f2ff':'#ff657b';ctx.fillRect(wx-3,wy-3,6,6)}}}
function drawParticles(){for(const p of particles){const a=clamp(p.life/p.maxLife,0,1),x=screenX(p.x),y=p.y-camY;ctx.globalAlpha=a;ctx.fillStyle=p.hue==='cyan'?'#7cfaff':p.hue==='dim'?'#879aa6':'#f4f7fa';ctx.fillRect(x,y,p.size*a+1,p.size*a+1)}ctx.globalAlpha=1}
function drawWorldLabels(){for(const l of labels){if(l.start>camX+W||l.end<camX)continue;const x=screenX(l.start+45);if(x<40||x>W-80)continue;ctx.fillStyle='#617887';ctx.font='bold 10px monospace';ctx.textAlign='left';ctx.fillText('// '+l.type,x,126-camY*.07)}}
function drawSpeedFX(){if(player.vx<410)return;ctx.save();const power=clamp((player.vx-400)/280,0,1);ctx.strokeStyle='#adf9ff';ctx.globalAlpha=.04+power*.2;ctx.lineWidth=1;for(let i=0;i<17;i++){let y=((i*93.47+worldTime*20)%H),x=((i*149+worldTime*player.vx*.6)%(W+200))-100;drawLine(x,y,x-65*power,y,'#a8f9ff',1)}ctx.restore()}

function drawHazardGuidance(){
 if(!player||gameState!=='play'||player.loopRide)return;
 const h=hazards.find(h=>!h.broken&&!h._gone&&h.type!=='boost'&&h.type!=='loop'&&h.x>player.x+55&&h.x<player.x+clamp(player.vx*.85,300,540));
 if(!h)return;
 const advice={spikes:'HOP / JUMP',saw:'JUMP OVER',wheel:'BRAKE + JUMP',crusher:'TIME THE PRESS',laser:'WAIT FOR OFF CYCLE',swing:'WATCH THE SWING',barrel:'JUMP / STRIKE',gate:'BOOST TO BREAK',platform:'LAND ON PLATFORM'}[h.type];
 if(!advice)return;
 const xx=clamp(screenX(h.x),120,W-110),yy=clamp(h.y-camY-125,95,H-145);
 ctx.save();ctx.textAlign='center';ctx.font='bold 12px monospace';ctx.fillStyle='#06151dcc';ctx.fillRect(xx-78,yy-20,156,32);
 ctx.strokeStyle='#73eaff';ctx.strokeRect(xx-78,yy-20,156,32);
 ctx.fillStyle='#bafaff';ctx.fillText(advice,xx,yy+1);ctx.restore();
}


function drawEmpty(){if(!player){camY=0}}
// -----------------------------------------------------------------------------
// DEATHWIRE // RIDECRAFT + DEATHWORKS integrated mechanical overhaul
// All values are in world pixels, seconds and radians. One game-world physics.
// -----------------------------------------------------------------------------
let hitLog=[],assemblies=[];
let seedKey='', spawnRng=null, lastCheckpoint=0, checkpointIndex=0, checkpoints=[],
    wreckPieces=[], wreckClock=0, crashReason='', comboCount=0, comboUntil=0,
    bestCombo=0, chainKills=0, riderSerial=0, stageMessage='', stageMessageUntil=0,
    sectionMetrics=[], recoveryCredits=0, gameResult='', gameDifficulty='normal';
let records={};
function loadRecords(){try{records=JSON.parse(localStorage.getItem('deathwire.records.v02')||'{}')||{}}catch(_){records={}}}
function saveRecords(){try{localStorage.setItem('deathwire.records.v02',JSON.stringify(records))}catch(_){}}
function showRecord(){const r=records[mode];const el=$('recordLine');if(el)el.textContent=r?`PERSONAL BEST // ${(r.distance/1000).toFixed(2)} KM • ${r.score} PTS • ${r.kills} KILLS`:'NO PERSONAL BEST YET // MAKE YOUR FIRST RUN'}
const ARCHETYPES=[
  {key:'SPRINTER',speed:440,hp:85,attack:12,tell:.58,color:'#dbe9f0'},
  {key:'BRUISER',speed:340,hp:135,attack:19,tell:.85,color:'#ffc3d3'},
  {key:'RAIDER',speed:385,hp:100,attack:15,tell:.65,color:'#b2e6e9'},
  {key:'SURVIVOR',speed:360,hp:100,attack:11,tell:.83,color:'#bfc5dc'}
];
function rngAI(a=0,b=1){return a+(b-a)*(spawnRng?spawnRng():Math.random())}
function getSegment(x){
 let best=null;
 for(const g of ground){if(g.dead||x<g.x1||x>g.x2)continue;
  const t=(x-g.x1)/Math.max(1,g.x2-g.x1),y=lerp(g.y1,g.y2,t);
  if(!best||y<best.y)best={y,slope:(g.y2-g.y1)/(g.x2-g.x1),road:g,vy:0};
 }
 for(const h of hazards){if(h.type!=='platform'||h.broken||x<h.x||x>h.x+h.width)continue;
  const y=platformY(h);
  if(!best||y<best.y)best={y,slope:0,platform:h,vy:Math.cos(worldTime*h.speed+h.phase)*h.speed*h.amp};
 }
 return best;
}
function groundAt(x){return getSegment(x)}
function bumpScore(label,points=80){
 if(!player||player.dead)return;
 if(worldTime>comboUntil)comboCount=0;
 comboCount++;bestCombo=Math.max(bestCombo,comboCount);comboUntil=worldTime+3.2;
 const factor=Math.min(5,1+Math.floor((comboCount-1)/3));score+=points*factor;
 if(label)toast(`${label} +${points*factor}${comboCount>2?'  //  x'+comboCount:''}`,1);
}
function road(w,dy=0,extra={}){
 // Road endpoints and maximum slope are constrained. Gaps are separate geometry.
 const y2=clamp(roadY+dy,280,437);
 ground.push({x1:cursor,x2:cursor+w,y1:roadY,y2,dead:false,fragile:false,trigger:0,breakDelay:.8,...extra});
 cursor+=w;roadY=y2;
}
function hz(type,x,y,opts={}){hazards.push({type,x,y,phase:randTrack(0,TAU),active:true,used:false,broken:false,damage:22,...opts})}
function generateModule(forced=null){
 const intensity=Math.min(1,moduleCount/17);
 const deck=moduleCount<4?['flow','ramp','loop','spikes','saws']:
  moduleCount%6===0?['flow','ramp','conveyor']:
  moduleCount%6===5?['gauntlet','cascade','wheel','barricade','jump','loop','doublejump']:
  ['flow','ramp','jump','spikes','saws','crusher','barrels','bridge','platform','laser','swing','conveyor','cascade','wheel','barricade','loop','doublejump','halfpipe','rocketjump'];
 const typ=forced||(activeEvent?activeEvent.modules[moduleCount%activeEvent.modules.length]:(moduleCount%5===4?pickTrack(['overdrive','foundry','datastream','orbital']):pickTrack(deck)));let x0=cursor;moduleCount++;

 if(['overdrive','foundry','datastream','orbital'].includes(typ)){
  const base=roadY;assemblies.push({type:typ,start:x0,end:0,y:base});
  road(280,0);
  if(typ==='overdrive'){
   road(460,0,{conveyor:1});for(const dx of [360,200,65])hz('boost',cursor-dx,roadY-3,{damage:0});
   road(180,-95,{launch:true,requiredSpeed:420});const lip=roadY;gap(300);roadY=clamp(lip+85,300,420);road(560,0);road(220,25);
  }
  if(typ==='foundry'){
   const sy=roadY;const start=cursor;road(780,0,{conveyor:1});
   for(let i=0;i<3;i++)hz('crusher',start+170+i*240,sy-145,{phase:i*2.1,damage:24});
   road(220,-45,{launch:true});const startBridge=cursor,yy=roadY;
   for(let i=0;i<4;i++)road(120,0,{fragile:true,breakDelay:2.6});
   ground.push({x1:startBridge,x2:cursor,y1:yy+65,y2:yy+65,dead:false});
   road(400,40);hz('boost',cursor-120,roadY-3,{damage:0});
  }
  if(typ==='datastream'){
   const start=cursor;hz('magrail',start+45,roadY-28,{length:900,rise:175,damage:0});road(1040,0);
   road(160,-55,{launch:true});const yy=roadY;gap(145);roadY=clamp(yy+60,300,420);road(450,0);
  }
  if(typ==='orbital'){
   for(let i=0;i<2;i++){road(220,0);hz('boost',cursor-100,roadY-3,{damage:0});road(280,0);hz('loop',cursor-130,roadY-101,{radius:101,damage:0})}
   road(260,0);hz('boost',cursor-70,roadY-3,{damage:0});road(180,-85,{launch:true,requiredSpeed:420});const yy=roadY;gap(280);roadY=clamp(yy+80,300,420);road(550,0);
  }
  assemblies[assemblies.length-1].end=cursor;
 }
 if(typ==='flow'){road(165,randTrack(-13,13));road(210,randTrack(-25,25));road(195,randTrack(-26,26));road(180,randTrack(-18,18))}
 if(typ==='ramp'){road(170,0);road(158,-68,{launch:true});road(158,57);road(200,0);hz('boost',cursor-138,roadY-2,{damage:0})}
 if(typ==='jump'){
  road(150,0);road(146,-59,{launch:true});const sy=roadY,start=cursor;
  const length=randTrack(105,147);gap(length);roadY=clamp(sy+58,300,430);road(270,8);road(140,0);
  // Platform underneath worst-case jumps: a potential rescue line, not free height snapping.
  if(length>135)hz('platform',start+32,sy+94,{width:length-27,height:12,amp:9,speed:1.1,damage:0});
  hz('boost',cursor-62,roadY-2,{damage:0});
 }
 if(typ==='loop'){
  road(235,0);hz('boost',cursor-75,roadY-3,{damage:0});const sx=cursor+115,yy=roadY;
  road(365,0);hz('loop',sx,yy-101,{radius:101,damage:0});
  road(205,-24,{launch:true});road(180,24);
 }
 if(typ==='halfpipe'){
  road(170,0);road(125,48);road(135,-76,{launch:true});road(190,-5);road(145,67);road(170,-34,{launch:true});road(190,0);
  hz('boost',cursor-155,roadY-4,{damage:0});
 }
 if(typ==='doublejump'){
  road(170,0);road(105,-37,{launch:true});const yy=roadY;
  gap(92);roadY=clamp(yy+43,300,432);road(125,-12,{launch:true});
  gap(95);roadY=clamp(roadY+45,300,432);road(270,0);road(165,-10);
  hz('boost',cursor-130,roadY-3,{damage:0});
 }
 if(typ==='rocketjump'){
  // Visual runway -> glowing launch pad -> steep ramp -> enormous gap.
  // The boost is placed BEFORE takeoff, never on the far landing.
  road(240,0);hz('boost',cursor-76,roadY-3,{damage:0});
  road(155,-80,{launch:true});const takeoffY=roadY;
  gap(178);roadY=clamp(takeoffY+76,305,420);
  road(330,0);road(200,-28,{launch:true});road(180,28);
 }
 if(typ==='spikes'){road(220,0);let sx=cursor+115;road(460,0);hz('spikes',sx,roadY-2,{width:58,damage:21});hz('spikes',sx+205,roadY-2,{width:49,damage:23});road(140,randTrack(-10,10))}
 if(typ==='saws'){road(190,0);const sx=cursor+95;road(395,0);hz('saw',sx,roadY-42,{radius:26,damage:24});hz('saw',sx+205,roadY-55,{radius:31,damage:28});road(165,0)}
 if(typ==='crusher'){road(200,0);const sx=cursor+115;road(360,0);hz('crusher',sx,roadY-133,{damage:28});hz('crusher',sx+210,roadY-137,{damage:30,phase:2.8});road(175,0)}
 if(typ==='barrels'){road(180,0);const sx=cursor+88;road(150,0,{fragile:true,breakDelay:1});road(145,0,{fragile:true,breakDelay:1});road(185,0);hz('barrel',sx,roadY-15,{damage:28});hz('barrel',sx+199,roadY-15,{damage:28});road(185,0)}
 if(typ==='bridge'){road(170,0);road(125,0,{fragile:true,breakDelay:1.1});road(120,0,{fragile:true,breakDelay:1.1});road(125,0,{fragile:true,breakDelay:1.1});road(175,0);hz('barrel',cursor-305,roadY-16,{damage:26});road(170,0)}
 if(typ==='platform'){
  road(175,-24,{launch:true});const sy=roadY,start=cursor;gap(174);
  hz('platform',start+10,sy+33,{width:165,height:14,amp:16,speed:1.22,damage:0});
  roadY=clamp(sy+43,300,420);road(250,0);road(160,10);
 }
 if(typ==='laser'){road(180,0);let sx=cursor+107;road(390,0);hz('laser',sx,roadY-75,{damage:23});hz('laser',sx+218,roadY-75,{damage:23,phase:2.7});road(200,0)}
 if(typ==='swing'){road(185,0);let sx=cursor+110;road(390,0);hz('swing',sx,roadY-182,{damage:29,length:128,radius:25});hz('swing',sx+210,roadY-188,{damage:29,length:129,radius:22,phase:2.7});road(175,0)}
 if(typ==='conveyor'){
  road(175,0);const sx=cursor;road(285,0,{conveyor:1});road(145,-32,{launch:true,conveyor:1});road(260,40);
  hz('boost',sx+55,roadY-17,{damage:0});hz('saw',sx+355,roadY-61,{radius:24,damage:25});road(170,0)
 }
 if(typ==='cascade'){
  road(190,0);const sx=cursor;road(175,0,{fragile:true,breakDelay:1.3});road(170,0,{fragile:true,breakDelay:1.3});road(235,0);
  hz('barrel',sx+92,roadY-17,{damage:26});hz('barrel',sx+256,roadY-17,{damage:26});
  hz('swing',sx+335,roadY-178,{damage:25,length:113,radius:20});road(180,0)
 }
 if(typ==='wheel'){
  road(190,0);const sx=cursor+177;road(435,0);
  hz('wheel',sx,roadY-38,{radius:48,damage:29,speed:1.05});
  hz('barrel',sx+189,roadY-18,{damage:27});road(235,-26)
 }
 if(typ==='barricade'){
  road(220,0);const sx=cursor;road(240,0);road(195,-34,{launch:true});road(215,39);
  hz('gate',sx+135,roadY-30,{damage:24,integrity:2});
  hz('barrel',sx+400,roadY-54,{damage:28});road(160,0)
 }
 if(typ==='gauntlet'){
  road(220,0);const sx=cursor;road(230,0,{fragile:true,breakDelay:1.25});road(160,-45,{launch:true});
  let y=roadY;gap(128);roadY=clamp(y+54,300,438);road(210,0);
  hz('saw',sx+124,roadY-81,{radius:27,damage:28});hz('barrel',sx+331,y-18,{damage:25});
  road(240,0);hz('crusher',cursor-92,roadY-130,{damage:30});road(150,0)
 }

 if(typ==='pressrun'){
  // Long assembly with an easy breathing space between pairs of machinery.
  road(260,0);const sx=cursor,sy=roadY;road(480,0,{conveyor:1});
  hz('crusher',sx+100,sy-138,{damage:26,phase:.4});hz('crusher',sx+340,sy-138,{damage:26,phase:2.7});
  road(170,-55,{launch:true});const lip=roadY;gap(135);roadY=clamp(lip+60,300,420);road(360,0);
  hz('barrel',cursor-130,roadY-16,{damage:25});road(220,0);
 }
 if(typ==='skyrail'){
  road(250,0);hz('boost',cursor-90,roadY-3,{damage:0});road(150,-75,{launch:true});
  const lip=roadY,start=cursor;gap(168);hz('platform',start+12,lip+65,{width:150,amp:12,speed:.9,damage:0});
  roadY=clamp(lip+60,300,420);road(300,0);road(130,-32,{launch:true});gap(100);roadY=clamp(roadY+40,300,420);road(350,0);
 }
 if(typ==='reactor'){
  road(260,0);hz('boost',cursor-110,roadY-3,{damage:0});const sy=roadY;
  road(300,0);hz('loop',cursor-130,sy-101,{radius:101,damage:0});
  road(180,-55,{launch:true});gap(155);roadY=clamp(roadY+65,300,420);road(360,0);
  hz('wheel',cursor-160,roadY-38,{radius:48,damage:28,speed:.8});road(260,0);
 }
 decorate({pressrun:'IRON CHOIR',skyrail:'SKYRAIL',reactor:'REACTOR',flow:'OPEN ROAD',ramp:'LAUNCH SYSTEM',jump:'BROKEN HIGHWAY',spikes:'SPIKE FIELD',saws:'SAW WORKS',crusher:'PRESS CHAMBER',barrels:'FUEL DUMP',bridge:'FRAGILE OVERPASS',platform:'LIFT BRIDGE',laser:'SECURITY GRID',swing:'PENDULUM YARD',conveyor:'VELOCITY FACTORY',cascade:'CHAIN REACTION',wheel:'TURBINE YARD',gauntlet:'DEATHWORKS GAUNTLET',barricade:'BLAST BARRICADE',loop:'FULL LOOP / HOLD THROTTLE',halfpipe:'RAVINE / LAUNCH',doublejump:'DOUBLE GAP / JUMP',rocketjump:'ROCKET LAUNCH'}[typ],x0,cursor);
 sectionMetrics.push({type:typ,start:x0,end:cursor,entrySpeed:['overdrive','orbital'].includes(typ)?420:250,pacing:['flow','overdrive','datastream','orbital'].includes(typ)?'release':'challenge'});
}
function initTrack(){
 ground=[];hazards=[];enemies=[];particles=[];sparks=[];labels=[];sectionMetrics=[];assemblies=[];
 cursor=-800;roadY=398;moduleCount=0;road(1000,0);decorate('START / DEAD CITY',0,200);
 generateModule('flow');generateModule('ramp');generateModule(activeEvent?.practice?'flow':'spikes');
 for(let i=0;i<3;i++)generateModule();generatedUpTo=cursor;nextEnemyX=680;
 checkpoints=[];lastCheckpoint=0;checkpointIndex=0;
}
function spawnEnemy(x,y,type=null){
 const a=type||ARCHETYPES[Math.floor(rngAI(0,ARCHETYPES.length))];
 const e=makeBike(x,y,true);e.id=++riderSerial;e.role=a.key;e.archetype=a;e.hp=e.maxHp=a.hp;
 e.vx=rngAI(a.speed-40,a.speed+15);e.targetSpeed=({SPRINTER:550,BRUISER:480,RAIDER:520,SURVIVOR:505}[a.key]||500)+rngAI(-12,12);
 e.name=['VEX','MOTHER IRON','NULL','SAINT'][ARCHETYPES.indexOf(a)]||a.key;e.ai=rngAI(0,100);e.attackIntent=0;e.telegraph=0;e.risk=rngAI(.15,.93);
 e.damageFlash=0;e.invuln=.5;e.finished=false;e.finTime=Infinity;
 enemies.push(e);return e
}
function makeBike(x,y,isEnemy=false){return{
 x,y,vx:isEnemy?300:250,vy:0,angle:0,angular:0,onGround:true,wasGround:true,
 coyote:0,suspension:0,contactF:null,contactR:null,groundSlope:0,
 jumpCooldown:0,attackCD:0,attackAnim:0,invuln:0,boost:1,hp:isEnemy?45:100,maxHp:isEnemy?45:100,
 dead:false,gone:false,enemy:isEnemy,damageFlash:0,wheel:0,side:1,ai:0,targetSpeed:isEnemy?355:360,
 lastX:x,lastY:y,fallTime:0,landings:0,combo:0,charge:0,airTime:0,flipRotation:0,
 airborneSpin:0,nearH:[],finished:false,finTime:Infinity,role:'PLAYER',attackIntent:0,telegraph:0,
 recovering:0,stagger:0,lastLanding:0,spawnX:x
}}
function startGame(newSeed=false){
 mode=$('modeSelect').value;loadRecords();showRecord();
 let entered=$('seedInput').value.trim();
 if(newSeed||!entered){entered=String(Math.floor(Math.random()*90000000)+10000000);$('seedInput').value=entered}
 seedKey=entered;seed=hashSeed(seedKey);rng=srand(seed);spawnRng=srand(seed^0x4d7a923b);fxRng=srand(seed^0x9e3779b9);
 warningText='';warningUntil=0;hitLog=[];runTime=0;worldTime=0;clock=0;frame=0;score=0;kills=0;nearMisses=0;shake=0;flash=0;camX=-180;camY=0;
 riderSerial=0;chainKills=0;comboCount=0;bestCombo=0;comboUntil=0;wreckPieces=[];wreckClock=0;gameResult='';
 finishX=activeEvent?activeEvent.length:(mode==='trial'?2950:5100);recoveryCredits=mode==='trial'?3:0;physicsAccumulator=0;
 initTrack();player=makeBike(0,370,false);player.y=370;player.onGround=true;player.vx=250;
 if(mode!=='endless'){while(cursor<finishX+1000)generateModule();nextEnemyX=finishX+1000;}
 ensureTrack();
 if(activeEvent){const part=PARTS[save.equipped];player.hp=player.maxHp=part.hp;}
 if(mode!=='endless'){while(!groundAt(finishX)?.road||groundAt(finishX)?.road?.fragile)finishX+=30;}
 if(activeEvent?.format==='demolition'){
  for(let i=1;i<=3;i++){const desired=finishX*i/4;let g=ground.find(g=>g.x1>desired&&g.x2-g.x1>200&&!g.fragile&&!g.launch);if(g){const x=(g.x1+g.x2)/2;hz('barrel',x,(g.y1+g.y2)/2-16,{relay:true,damage:18})}}
 }
 // Place starting grid close enough to actually race against rivals.
 if(mode==='sprint'){
  for(let i=0;i<4;i++){
   const pos=90+i*75,g=groundAt(pos);if(g)spawnEnemy(pos,g.y-29,ARCHETYPES[i]);
  }
 }
 gameState='play';clearControls();
 ['menu','pauseMenu','endMenu','manual','devMenu'].forEach(x=>$(x).classList.add('hidden'));
 $('hud').style.display='block';$('topButtons').style.display='flex';$('controlsHelp').style.display='block';$('mobile').classList.add('playing');
 $('stage').textContent=`SEED ${seedKey}`;audioInit();toast('RIDE // FIGHT // SURVIVE',1.8);last=performance.now();
}
function ensureTrack(){
 const ahead=player?player.x+Math.max(2250,W*1.9):2750;
 while(cursor<ahead){generateModule();if(mode!=='endless'&&cursor>finishX+1300)break}
 while(nextEnemyX<ahead-300 && nextEnemyX<(mode==='endless'?Infinity:finishX-120)){
  const xx=nextEnemyX;nextEnemyX+=rngAI(620,1080);
  if(mode!=='endless')continue;
  const g=groundAt(xx);if(g&&xx>600)spawnEnemy(xx,g.y-29);
 }
 if(mode==='endless'&&player&&player.x>1800){const pruneX=player.x-1650;
  assemblies=assemblies.filter(a=>a.end>pruneX);ground=ground.filter(g=>g.x2>pruneX);
  hazards=hazards.filter(h=>h.x>pruneX-210&&!h._gone);
  labels=labels.filter(l=>l.end>pruneX);
  enemies=enemies.filter(e=>(e.x>pruneX-450||e.finished)&&!e.gone);
 }
 if(mode==='trial'){
  while(checkpoints.length<2){
   const desired=finishX*(checkpoints.length===0?1/3:2/3);
   let picked=null;
   for(let d=0;d<500&&!picked;d+=25){
    for(const x of [desired+d,desired-d]){
     const g=groundAt(x);if(!g||g.road?.fragile||g.road?.launch||g.platform)continue;
     if(!groundAt(x-35)||!groundAt(x+35))continue;
     if(hazards.some(h=>h.x>x-110&&h.x<x+145&&h.type!=='boost'))continue;
     picked={x,y:g.y};break;
    }
   }
   if(!picked)break;checkpoints.push(picked)
  }
 }
}
function jumpBike(b,manual=false){
 if((!b.onGround&&b.coyote<=0)||b.jumpCooldown>0||b.dead)return false;
 b.vy=manual?-410:-315;b.y-=6;b.onGround=false;b.coyote=0;
 b.jumpCooldown=.25;b.angular=manual?b.angular*.4:0;b.suspension=10;
 smoke(b.x-15,b.y+25,9,70);if(!b.enemy&&manual)fx(310,.10,'triangle',.035);
 return true
}
function attack(){
 if(!player||player.attackCD>0||player.dead)return;
 player.attackCD=.43;player.attackAnim=.25;fx(360,.08,'square',.026);
 let hit=false;
 for(const e of enemies){
  if(e.dead||e.gone||e.finished)continue;
  const dx=e.x-player.x,dy=e.y-player.y;
  if(dx>5&&dx<93&&Math.abs(dy)<65){
   const impact=clamp((player.vx-e.vx)*.06+29+(activeEvent?PARTS[save.equipped].attack:0),24,48);
   damage(e,impact,'STRIKE');e.vx+=90;e.vy-=155;e.angular+=.9;
   e.stagger=.6;hit=true;smoke(e.x,e.y-12,13,125);
  }
 }
 for(const h of hazards){
  if((h.type==='barrel'||h.type==='gate')&&!h.broken&&h.x-player.x>3&&h.x-player.x<86&&Math.abs(h.y-player.y)<76){
   h.broken=true;boom(h.x,h.y,1.1);hit=true;
  }
 }
 if(hit){bumpScore('STRIKE',95);shake=Math.max(shake,2.8)}
}
function updateBike(b,dt){
 if(b.dead||b.gone||b.finished)return;
 // Guided high-speed loop: the circular rail carries the bike through a full inversion.
 // This is deliberately an arcade set-piece, not a claim of rigid-body loop physics.
 if(b.railRide){if((!b.enemy&&pressed.boost)&&b.boost>.025){b.vx+=200*dt;b.boost=Math.max(0,b.boost-dt*.44)}const h=b.railRide;b.lastX=b.x;b.lastY=b.y;b.vx=clamp(b.vx+(b.enemy||pressed.gas?90:-40)*dt,300,760);if(!b.enemy&&pressed.brake)b.vx=Math.max(250,b.vx-480*dt);b.x+=b.vx*dt;const t=clamp((b.x-h.x)/h.length,0,1);b.y=h.y-h.rise*Math.sin(Math.PI*t);b.angle=Math.atan(-h.rise*Math.PI/h.length*Math.cos(Math.PI*t));b.wheel+=b.vx*dt/11;b.onGround=false;if(t>=1){b.railRide=null;b.vy=120;b.angle=0;b.jumpCooldown=.2;if(!b.enemy)bumpScore('GHOST TRANSMISSION',220)}return}
 if(b.onGround&&!b.railRide){const rail=hazards.find(h=>h.type==='magrail'&&b.x>=h.x-18&&b.x<h.x+25);if(rail)b.railRide=rail;}
 if(b.loopRide){
  const h=b.loopRide;h.progress+=dt*clamp(b.vx/104,2.9,6.3);
  const a=h.progress;
  b.lastX=b.x;b.lastY=b.y;
  b.x=h.x+Math.sin(a)*h.radius;
  b.y=h.y+Math.cos(a)*h.radius-27;
  b.angle=-h.progress;b.vy=0;b.onGround=false;b.wheel+=b.vx*dt/11;
  b.invuln=Math.max(b.invuln,.12);
  if(h.progress>=TAU){b.loopRide=null;b.x=h.x+35;b.y=h.y+h.radius-27;b.angle=0;b.vy=0;b.onGround=true;b.invuln=.6;if(!b.enemy)bumpScore('FULL LOOP',280)}
  return;
 }
 if(b.onGround&&b.vx>215){
  const h=hazards.find(h=>h.type==='loop'&&!h.broken&&!h._gone&&!h.usedFor?.has(b)&&b.x>=h.x-32&&b.x<h.x+25&&Math.abs(b.y-(h.y+h.radius-27))<70);
  if(h){if(!h.usedFor)h.usedFor=new WeakSet();h.usedFor.add(b);b.loopRide={x:h.x,y:h.y,radius:h.radius,progress:0};return}
 }

 b.lastX=b.x;b.lastY=b.y;
 for(const k of ['invuln','attackCD','attackAnim','jumpCooldown','damageFlash','charge','stagger','telegraph'])b[k]=Math.max(0,b[k]-dt);
 b.wasGround=b.onGround;
 b.coyote=b.onGround?.09:Math.max(0,b.coyote-dt);
 let target=0,steer=0;
 if(!b.enemy){
  const boosting=pressed.boost&&b.boost>.025;
  target=(pressed.brake?105:pressed.gas?530:365)+(boosting?195:0);
  if(boosting){b.boost=Math.max(0,b.boost-dt*.44);b.charge=.17;
   if(Math.random()<.6)smoke(b.x-26,b.y+8,1,115,'cyan')
  }else b.boost=Math.min(1,b.boost+dt*(activeEvent?PARTS[save.equipped].regen:.11));
  if(justJump)jumpBike(b,true);if(justAttack)attack();
  steer=(pressed.back?-1:0)+(pressed.forward?1:0);
 }else{
  const now=groundAt(b.x);
  const trap=hazards.find(h=>!h.broken&&!h._gone&&['saw','spikes','wheel','barrel','laser','swing'].includes(h.type)&&h.x>b.x+25&&h.x<b.x+b.vx*(['laser','swing','wheel'].includes(h.type)?.38:.28));
  target=b.targetSpeed;
  // Allow the common ramp launch to fire: early AI hops used to miss entire landings.
  if(trap&&b.onGround&&!now?.road?.launch)jumpBike(b,true);
  const useBoost=b.boost>.15&&b.onGround&&!trap&&(b.role==='SPRINTER'||b.role==='RAIDER');
  if(useBoost){target+=150;b.boost=Math.max(0,b.boost-dt*.44);b.charge=.17}else b.boost=Math.min(1,b.boost+dt*.11);
  const dx=player.x-b.x;
  if(Math.abs(dx)<97&&Math.abs(player.y-b.y)<66&&b.attackCD<=0&&b.stagger<=0&&b.role!=='SURVIVOR'){
   b.telegraph=b.archetype.tell;
   b.attackCD=b.telegraph+1.25+rngAI(0,.45);
   b.attackIntent=1;
  }
  if(b.attackIntent&&b.telegraph<=0){
   b.attackIntent=0;b.attackAnim=.22;
   if(dx>-12&&dx<85&&Math.abs(player.y-b.y)<60){
    damage(player,b.archetype.attack,'RIVAL STRIKE');
    player.vx=Math.max(115,player.vx-44);player.angular-=.45;
    smoke(player.x,player.y-12,10,100);
   }
  }
  // Don't automatically restore enemies to upright during risky midair movements.
  if(!b.onGround){const landing=groundAt(b.x+b.vx*.2);const desired=Math.atan(landing?.slope||0);steer=clamp((desired-b.angle)*3-b.angular*.7,-1,1);}
 }
 const response=b.enemy?1.65:2.75;
 if(!b.enemy){target+=(activeEvent?PARTS[save.equipped].speed:0);if(b.charge>0)target=Math.max(target,b.vx-20);}
 b.vx+=clamp((target-b.vx)*response,-(pressed.brake&&!b.enemy?720:175),b.enemy?230:320)*dt;
 if(b.stagger>0)b.vx-=75*dt;
 const current=groundAt(b.x);
 if(b.onGround&&current?.road?.conveyor)b.vx+=current.road.conveyor*160*dt;
 b.vx=clamp(b.vx,90,850);
 if(b.onGround&&b.jumpCooldown<=0&&current?.road?.launch&&b.x>current.road.x2-47){
   jumpBike(b,false);b.vy-=clamp(b.vx*.17,35,96)
 }
 const priorVertical=b.vy;
 b.x+=b.vx*dt;b.wheel+=b.vx*dt/11;
 if(!b.onGround){b.vy+=925*dt;b.vy=clamp(b.vy,-640,800);b.y+=b.vy*dt;b.airTime+=dt;
  b.angular+=(steer*7.8-b.angular*.95)*dt;
  b.angular=clamp(b.angular,-5.4,5.4);
  const delta=b.angular*dt;b.angle+=delta;b.flipRotation+=delta;
 }else{
  b.vy+=925*dt;b.y+=b.vy*dt;
  b.angle+=steer*.82*dt;
 }
 // Sample the actual front and rear wheel bottoms. Contact must be approached
 // from above: no teleport onto elevated platforms from underneath.
 let contacts=[],under=[],hitPlatform=null;
 for(const side of [-1,1]){
   let wx=b.x+side*22*Math.cos(b.angle)-17*Math.sin(b.angle);
   let wy=b.y+side*22*Math.sin(b.angle)+17*Math.cos(b.angle)+11;
   let prevWy=b.lastY+side*22*Math.sin(b.angle)+17*Math.cos(b.angle)+11;
   const g=getSegment(wx);
   if(g){under.push(g);
    if(wy>=g.y-3&&prevWy<=g.y+Math.max(12,Math.abs(g.vy)*dt+7)&&b.vy>=-45){
      contacts.push({side,g,penetration:wy-g.y});
      if(g.platform)hitPlatform=g.platform;
    }
   }
 }
 b.contactF=contacts.find(c=>c.side===1)||null;b.contactR=contacts.find(c=>c.side===-1)||null;
 if(contacts.length){
  const hadGround=b.wasGround;
  let penetration=Math.max(...contacts.map(c=>c.penetration));
  b.y-=clamp(penetration,-10,52);
  const maxSlope=contacts.reduce((s,c)=>s+c.g.slope,0)/contacts.length;
  const surfaceVY=contacts.reduce((s,c)=>s+(c.g.vy||0),0)/contacts.length;
  const landingSpeed=Math.max(0,b.vy-surfaceVY);
  b.vy=surfaceVY;b.onGround=true;b.coyote=.09;b.fallTime=0;
  const targetAngle=clamp(Math.atan(maxSlope),-.74,.74);
  const deviation=Math.atan2(Math.sin(b.angle-targetAngle),Math.cos(b.angle-targetAngle));
  const spring=contacts.length===2?12:5.5;
  // Grounded pitch control: leaning back lifts the front wheel; forward
  // pressure plants it. Terrain spring restores neutral when released.
  const riderLean=!b.enemy?steer:0;
  const wheelieTarget=targetAngle+riderLean*.49;
  const restoring=contacts.length===2?9.5:5.0;
  b.angular+=(wheelieTarget-b.angle)*restoring*dt;
  b.angular*=Math.max(0,1-7.5*dt);
  b.angle+=clamp(wheelieTarget-b.angle,-(contacts.length===2?3.6:2.5)*dt,(contacts.length===2?3.6:2.5)*dt);
  if(!b.enemy&&riderLean<0&&b.vx>160){b.angle=Math.max(b.angle,-.75);}
  if(!b.enemy&&riderLean>0){b.angle=Math.min(b.angle,.53);}

  b.suspension=Math.min(11,b.suspension+Math.max(0,landingSpeed-140)*.018);
  if(!hadGround&&b.airTime>.14){
   const bad=Math.abs(deviation)>1.12&&landingSpeed>130;
   if(bad){damage(b,clamp(12+landingSpeed*.045,12,39),'HARD LANDING');b.vx*=.77;b.angular=0}
   else if(!b.enemy){
    if(b.airTime>.55)bumpScore('AIR TIME',Math.round(b.airTime*75));
    const flips=Math.floor(Math.abs(b.flipRotation)/ (TAU-.25));
    if(flips>0)bumpScore(`${flips}x FLIP`,flips*220);
    if(landingSpeed>300)shake=Math.max(shake,2);
   }
   smoke(b.x-10,b.y+19,8,72);
  }
  b.airTime=0;b.flipRotation=0;
 }else{
  b.onGround=false;b.fallTime+=dt;
  if(b.wasGround&&b.jumpCooldown<=0){b.vy=Math.min(b.vy,-8);b.angular*=.7}
 }
 b.suspension=Math.max(0,b.suspension-27*dt);
 if(b.angle>Math.PI)b.angle-=TAU;if(b.angle<-Math.PI)b.angle+=TAU;
 // Fracture ground consistently under every rider, not only the player.
 if(b.onGround){for(const g of under){if(g?.road?.fragile&&!g.road.dead&&g.road.trigger===0){g.road.trigger=worldTime+(g.road.breakDelay||.85)}}}
 if(b.y>805||(!b.enemy&&b.x< -650)){
   if(!b.enemy&&mode==='trial'&&recoveryCredits>0){recoverTrial('ABYSS');return}
   if(b.enemy){b.gone=true;return}b.invuln=0;damage(b,999,'FELL INTO THE ABYSS')
 }
 if(b.onGround&&Math.abs(b.angle)>2.8)damage(b,20,'WIPEOUT');
 if(Math.random()<.43&&b.onGround)trail(b)
}
function hazardCollision(h,b,dt){
 if(b.dead||b.gone||b.finished||b.loopRide||h._gone||h.broken||h.type==='loop'||h.type==='magrail')return;
 const dx=b.x-h.x,dy=b.y-h.y;
 let hit=false;
 if(h.type==='saw'){
  const yy=h.y+Math.sin(worldTime*1.7+h.phase)*9;
  hit=Math.hypot(dx,b.y-yy)<h.radius+12;
 }
 if(h.type==='wheel'){
  let cx=h.x+Math.sin(worldTime*h.speed+h.phase)*36;
  hit=Math.hypot(b.x-cx,b.y-h.y)<h.radius+13;
 }
 if(h.type==='spikes')hit=b.x>h.x-18&&b.x<h.x+h.width+16&&b.y>h.y-35&&b.y<h.y+8;
 if(h.type==='barrel'){
  hit=!h.broken&&Math.abs(dx)<27&&Math.abs(dy)<39;
  if(hit){h.broken=true;boom(h.x,h.y,1.1);return}
 }
 if(h.type==='gate'&&!h.broken&&Math.abs(dx)<31&&dy>-37&&dy<62){
  if(b.vx>500||b.charge>0){h.broken=true;boom(h.x,h.y,1.25);
    if(!b.enemy)bumpScore('BREACH',160)
  }else if(b.invuln<=0){damage(b,22,'BARRICADE');b.vx*=.68;b.vy-=130;h.integrity--;
    if(h.integrity<=0){h.broken=true;boom(h.x,h.y,.85)}
  }
  return;
 }
 if(h.type==='crusher'){
  const down=(Math.sin(worldTime*2.4+h.phase)+1)/2;
  const bottom=h.y+down*105;
  hit=Math.abs(dx)<39&&b.y>bottom-30&&b.y<bottom+34;
 }
 if(h.type==='swing'){
  const a=Math.sin(worldTime*1.6+h.phase)*1.03,px=h.x+Math.sin(a)*h.length,py=h.y+Math.cos(a)*h.length;
  hit=Math.hypot(b.x-px,b.y-py)<h.radius+18;
 }
 if(h.type==='laser'){
  const on=Math.sin(worldTime*2.6+h.phase)>.12;
  hit=on&&Math.abs(dx)<19&&b.y>h.y-25&&b.y<h.y+117;
 }
 if(h.type==='boost'&&Math.abs(dx)<34&&Math.abs(b.y-h.y)<64&&b.onGround&&b.charge<=0){
  b.vx=Math.min(850,b.vx+240);b.charge=.65;
  if(!b.enemy){bumpScore('VELOCITY PAD',45);fx(480,.17,'triangle',.06)}
  smoke(h.x,h.y,18,135,'cyan')
 }
 if(hit){
  const wasProtected=b.invuln>0;
  damage(b,h.damage,h.type.toUpperCase());
  if(!wasProtected&&!b.dead){b.vy=-185;b.vx=Math.max(115,b.vx*.78);b.angular+=dx>0?.55:-.55}
 }else if(!b.enemy&&!h.nearScored&&Math.abs(dx)<34&&Math.abs(dy)<90&&b.vx>260&&['saw','wheel','crusher','swing'].includes(h.type)){
  h.nearScored=true;nearMisses++;bumpScore('NEAR MISS',110);
 }
}
function handleBikes(){
 const active=enemies.filter(e=>!e.dead&&!e.gone&&!e.finished);
 for(const e of active){
  const dx=e.x-player.x,dy=e.y-player.y;
  if(Math.abs(dx)<38&&Math.abs(dy)<30){
   const speed=Math.abs(e.vx-player.vx);
   if(speed>65&&player.invuln<=0){damage(player,clamp(4+speed*.045,5,16),'COLLISION');player.vx=Math.max(125,player.vx-22);player.angular-=.16}
   if(speed>65&&e.invuln<=0){damage(e,clamp(4+speed*.045,5,16),'IMPACT');e.vy-=45;e.angular+=.36}
   const separation=(38-Math.abs(dx))*.6;const direction=dx>=0?1:-1;e.x+=direction*separation;player.x-=direction*separation*.4;
  }
 }
 for(let i=0;i<active.length;i++)for(let j=i+1;j<active.length;j++){
  const a=active[i],b=active[j];
  if(Math.abs(a.x-b.x)<30&&Math.abs(a.y-b.y)<28){const relative=Math.abs(a.vx-b.vx),front=a.x>=b.x?a:b,rear=a.x>=b.x?b:a;const overlap=32-Math.abs(a.x-b.x);front.x+=overlap*.5;rear.x-=overlap*.5;
   const avg=(front.vx+rear.vx)/2;front.vx=Math.max(front.vx,avg+15);rear.vx=Math.min(rear.vx,avg-15);
   if(relative>100){damage(a,8,'PILEUP');damage(b,8,'PILEUP');}
  }
 }
}
function damage(b,n,why='IMPACT'){
 if(!b||b.dead||b.invuln>0||n<=0||(settings.god&&!b.enemy))return;
 if(!b.enemy){hitLog.push({x:Math.round(b.x),time:worldTime,why,n});if(hitLog.length>40)hitLog.shift()}
 b.hp-=n;b.invuln=b.enemy?.36:.68;b.damageFlash=.25;
 smoke(b.x,b.y,9,100,b.enemy?'dim':'white');
 if(!b.enemy){hurtFlash();if(n>=15)warn(why,.72);fx(140,.13,'square',.06)}
 else fx(230,.09,'square',.035);
 if(b.hp<=0)destroyBike(b,why)
}
function destroyBike(b,why='WRECKED'){
 if(b.dead)return;
 b.reason=why;b.dead=true;boomVisualOnly(b.x,b.y);
 if(b.enemy){kills++;score+=200;b.gone=true;chainKills++;
  if(player&&!player.dead)bumpScore('RIVAL DESTROYED',250);
  fx(105,.26,'sawtooth',.085);
  for(let j=0;j<7;j++){const a=j*TAU/7;wreckPieces.push({x:b.x,y:b.y-8,vx:Math.cos(a)*rngAI(85,225)+b.vx*.25,vy:Math.sin(a)*rngAI(70,165)-85,spin:rngAI(-8,8),rot:0,life:1.15,kind:j<2?'wheel':'metal'})}
 }else{
  // A visible short wreck tableau is part of the death rather than instant UI.
  crashReason=why;gameState='crash';wreckClock=.82;clearControls();
  const x=b.x,y=b.y;
  for(let j=0;j<12;j++){const angle=j*TAU/12;
   wreckPieces.push({x:x+Math.cos(angle)*11,y:y+Math.sin(angle)*10,
    vx:Math.cos(angle)*rand(70,270)+b.vx*.38,vy:Math.sin(angle)*rand(80,240)-125,
    spin:rand(-8,8),rot:0,life:1.4,kind:j<2?'wheel':j<5?'frame':'metal'})}
 }
}
function recoverTrial(reason='CRASH'){
 if(mode!=='trial'||recoveryCredits<=0)return false;
 gameState='play';player.loopRide=null;player.railRide=null;recoveryCredits--;bumpScore('CHECKPOINT RESCUE',15);
 boomVisualOnly(player.x,player.y);
 const x=Math.max(0,lastCheckpoint);
 player.x=x;player.y=(groundAt(x)?.y||398)-29;
 player.vx=240;player.vy=0;player.angle=0;player.angular=0;player.dead=false;
 player.onGround=true;player.coyote=0;player.invuln=2.4;player.hp=Math.max(65,player.hp);
 player.airTime=0;player.flipRotation=0;player.jumpCooldown=.25;
 camX=x-W*.28;camY=0;toast(`CHECKPOINT RECOVERY // ${recoveryCredits} LEFT`,1.8);
 return true
}
function finish(win,reason){
 if(gameState!=='play'&&gameState!=='crash')return;
 player.finished=win;gameState='dead';gameResult=reason;clearControls();
 $('endMenu').classList.remove('hidden');
 $('endType').textContent=win?'COURSE COMPLETE':'RUN TERMINATED';
 $('endTitle').innerHTML=win?'FINISH<span class="slash">/</span>LINE':'TOTAL<span class="slash">/</span>LOSS';
 const rank=mode==='sprint'?' • <strong>PLACE '+racePosition()+' / '+(enemies.length+1)+'</strong>':'';
 $('endReport').innerHTML=`${reason}<br><br><strong>${(Math.max(0,player.x)/1000).toFixed(2)} KM</strong> • <strong>${kills}</strong> TAKEDOWNS • <strong>${fmtTime(runTime)}</strong> TIME${rank}<br>SCORE: <strong>${Math.round(score)}</strong> • BEST CHAIN: <strong>${bestCombo}</strong>`;
 $('seedReport').textContent=`TRACK SEED ${seedKey} // ${mode.toUpperCase()}`;
 const r={distance:Math.max(0,player.x),score:Math.round(score),kills,time:runTime,seed:seedKey};
 if(!records[mode]||r.distance>records[mode].distance){records[mode]=r;saveRecords()}
 showRecord();
 if(win)fx(620,.5,'triangle',.08);
 settleEvent(win);
}
function racePosition(){return 1+enemies.filter(e=>!e.dead&&!e.gone&&(e.finished||e.x>player.x)).length}
function update(dt){
 worldTime+=dt;runTime+=dt;clock+=dt;
 for(const g of ground){
  if(g.fragile&&g.trigger>0&&worldTime>g.trigger&&!g.dead){
   g.dead=true;smoke((g.x1+g.x2)/2,(g.y1+g.y2)/2,20,130,'dim');fx(90,.18,'triangle',.055)
  }
 }
 for(const h of hazards){
  if(h._explosionPending&&!h._gone){h._gone=true;boom(h.x,h.y,1.05)}
 }
 updateBike(player,dt);
 for(const e of enemies)if(!e.gone&&!e.dead&&(mode!=='endless'||Math.abs(e.x-player.x)<1950))updateBike(e,dt);
 justJump=false;justAttack=false;
 for(const h of hazards){
  if(mode==='endless'&&(h.x<player.x-950||h.x>player.x+1750))continue;
  hazardCollision(h,player,dt);
  for(const e of enemies)if(!e.dead&&!e.gone&&Math.abs(e.x-h.x)<155)hazardCollision(h,e,dt);
 }
 handleBikes();
 for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.grav*dt;p.life-=dt}
 particles=particles.filter(p=>p.life>0);if(particles.length>700)particles.splice(0,particles.length-700);
 for(const p of wreckPieces){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=840*dt;p.rot+=p.spin*dt;p.life-=dt}
 wreckPieces=wreckPieces.filter(p=>p.life>0);if(wreckPieces.length>110)wreckPieces.splice(0,wreckPieces.length-110);
 ensureTrack();
 if(mode==='trial'){
  for(let i=0;i<checkpoints.length;i++)if(checkpointIndex===i&&player.x>checkpoints[i].x){
   checkpointIndex=i+1;lastCheckpoint=checkpoints[i].x-60;toast('CHECKPOINT '+checkpointIndex+' / 2',1.6);bumpScore('SECTOR CLEAR',180)
  }
 }
 if(mode!=='endless'){
  for(const e of enemies)if(!e.dead&&!e.gone&&!e.finished&&e.x>=finishX){e.finished=true;e.finTime=runTime}
  if(player.x>=finishX&&!player.finished){
   if(activeEvent?.format==='demolition'&&hazards.some(h=>h.relay&&!h.broken)){finish(false,'RELAYS MISSED // STRIKE OR RAM ALL THREE');return;}
   const pos=racePosition();
   finish(true,mode==='sprint'?`FINISHED ${['1ST','2ND','3RD'][pos-1]||pos+'TH'} // ${pos===1?'VICTORY':'RACE COMPLETE'}`:'GAUNTLET COMPLETE');
  }
 }
 score+=dt*(player.vx/68);
 if(settings.god&&player.hp<=0)player.hp=100;
 if(player.hp<=0&&gameState==='play')destroyBike(player,'RIDER ELIMINATED');
 const desired=player.x-Math.min(W*.31,365)-clamp((player.vx-300)*.24,0,105);
 camX=lerp(camX,desired,clamp(dt*3.6,0,1));
 const roadAhead=groundAt(player.x+220);const focusY=player.loopRide?player.loopRide.y:Math.min(player.y,(roadAhead?.y||player.y)-28);
 camY=lerp(camY,clamp(focusY-Math.max(185,H*.62),-200,250),clamp(dt*3.2,0,1));
 shake=Math.max(0,shake-21*dt);flash=Math.max(0,flash-1.9*dt);
 updateHud();
 const next=labels.find(l=>l.start>player.x+30&&l.start-player.x<500);
 // Course geometry and machinery telegraph hazards; no floating instructions.
}
function updateHud(){
 $('speed').innerHTML=`${String(Math.round(player.vx*.57)).padStart(3,'0')}<span class="accent" style="font-size:.46em"> KM/H</span>`;
 $('dist').textContent=`${(Math.max(0,player.x)/1000).toFixed(2)} KM`;
 $('kills').textContent=String(kills).padStart(2,'0');$('timer').textContent=fmtTime(runTime);
 $('health').style.width=clamp(player.hp/player.maxHp*100,0,100)+'%';$('boostBar').style.width=(player.boost*100)+'%';$('health').style.background=player.hp<30?'#ff657b':'#e8faff';
 const stage=mode==='sprint'?`P${racePosition()}  //  ${Math.max(0,Math.round(finishX-player.x))} M TO FINISH`:
 mode==='trial'?`RETRIES ${recoveryCredits}  //  CP ${checkpointIndex}/2  //  ${Math.max(0,Math.round(finishX-player.x))} M`:`SEED ${seedKey}`;
 const objective=activeEvent?.format==='demolition'?`RELAYS ${hazards.filter(h=>h.relay&&h.broken).length}/3 // `:'';
 $('stage').textContent=objective+(activeEvent?(activeEvent.practice?'PRACTICE':activeEvent.title.toUpperCase())+' // '+stage:stage);
 $('warning').textContent=warningText;$('warning').style.opacity=worldTime<warningUntil?'1':'0';
 $('toasts').textContent=worldTime<toastUntil?toastText:'';
 $('flash').style.opacity=settings.flashes?flash.toFixed(2):'0';
 if(engineOsc&&engineGain&&audioCtx){engineOsc.frequency.setTargetAtTime(42+player.vx*.25,audioCtx.currentTime,.12);
  engineGain.gain.setTargetAtTime(settings.sound?.014:0,audioCtx.currentTime,.15)}
 const comboEl=$('comboHud');if(comboEl){comboEl.textContent=worldTime<comboUntil&&comboCount>1?`CHAIN ${comboCount}  /  SCORE ${Math.round(score)}`:`SCORE ${Math.round(score)}`}
}
function drawFinish(){
 if(mode==='endless')return;
 const x=screenX(finishX);if(x< -100||x>W+100)return;
 const g=groundAt(finishX),y=(g?g.y:395)-camY;
 drawLine(x,y-180,x,y+20,'#f4faff',4);drawLine(x+72,y-180,x+72,y+20,'#f4faff',4);
 ctx.fillStyle='#fafafa';ctx.fillRect(x,y-180,72,25);
 ctx.fillStyle='#05070a';ctx.font='bold 13px monospace';ctx.textAlign='center';ctx.fillText('FINISH',x+36,y-162)
}
function drawProgress(){
 if(mode==='endless'||gameState==='menu')return;
 ctx.save();ctx.globalAlpha=.8;
 const ww=Math.min(190,W*.24),x=W-ww-18,y=76;
 ctx.fillStyle='#1d303b';ctx.fillRect(x,y,ww,4);
 ctx.fillStyle='#bdefff';ctx.fillRect(x,y,ww*clamp(player.x/finishX,0,1),4);
 if(mode==='trial')for(const cp of checkpoints){ctx.fillStyle='#fff';ctx.fillRect(x+ww*cp.x/finishX-1,y-3,2,10)}
 ctx.restore()
}
function drawWreck(){
 for(const p of wreckPieces){const x=screenX(p.x),y=p.y-camY;
  ctx.save();ctx.translate(x,y);ctx.rotate(p.rot);ctx.strokeStyle=p.kind==='wheel'?'#f1f8ff':'#7cf3ff';ctx.lineWidth=2.5;
  if(p.kind==='wheel'){ctx.beginPath();ctx.arc(0,0,11,0,TAU);ctx.stroke()}
  else{drawLine(-8,0,8,0,p.kind==='frame'?'#f1f8ff':'#879ba5',2.5);drawLine(0,-7,2,7,'#879ba5',2)}ctx.restore()
 }
}
function drawTrialMarkers(){
 if(mode!=='trial')return;
 for(let i=0;i<checkpoints.length;i++){
  const cp=checkpoints[i],x=screenX(cp.x);if(x< -80||x>W+80)continue;
  const y=cp.y-camY;
  drawLine(x,y-112,x,y,'#7ee7f7',2);
  ctx.fillStyle=i<checkpointIndex?'#86f8ff':'#102d3a';ctx.fillRect(x,y-114,78,25);
  ctx.strokeStyle='#7ee7f7';ctx.strokeRect(x,y-114,78,25);
  ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillStyle=i<checkpointIndex?'#07121a':'#d8faff';ctx.fillText('CHECK '+(i+1),x+39,y-97)
 }
}
function render(){
 ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#05070a';ctx.fillRect(0,0,W,H);
 if(!player){drawBackground();return}
 ctx.save();if(settings.shake&&shake>0)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
 drawBackground();drawDistrict();drawAssemblies();drawRoad();drawFinish();drawTrialMarkers();drawHazards();
 for(const e of enemies)rider(e);if(!player.dead)rider(player);
 drawWreck();drawParticles();drawSpeedFX();drawProgress();ctx.restore();
 if(gameState==='crash'){ctx.fillStyle='#f16c8116';ctx.fillRect(0,0,W,H)}
}
function tick(t){
 let dt=Math.min(.1,Math.max(0,(t-last)/1000||.016));last=t;
 if(engineGain&&audioCtx&&gameState!=='play')engineGain.gain.setTargetAtTime(0,audioCtx.currentTime,.08);
 if(gameState==='play'){
  physicsAccumulator+=dt*(settings.slow?.4:1);
  while(physicsAccumulator>=FIXED_STEP&&gameState==='play'){update(FIXED_STEP);physicsAccumulator-=FIXED_STEP}
 }else if(gameState==='crash'){
  updateCrash(dt);
 }else if(!player){clock+=dt;camX=-180;drawEmpty()}
 render();requestAnimationFrame(tick)
}

function updateCrash(dt){
  wreckClock-=dt;
  for(const p of wreckPieces){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=800*dt;p.rot+=p.spin*dt;p.life-=dt}
  for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.grav*dt;p.life-=dt}
  particles=particles.filter(p=>p.life>0);
  if(wreckClock<=0){if(mode==='trial'&&recoveryCredits>0){gameState='play';recoverTrial(crashReason)}else finish(false,crashReason)}
}
function drawAssemblies(){
 for(const a of assemblies){if(a.end<camX-200||a.start>camX+W+200)continue;const x=screenX(a.start),len=a.end-a.start,y=a.y-camY;ctx.save();ctx.strokeStyle='#587581';ctx.fillStyle='#09131d';
 if(a.type==='overdrive'){for(let i=0;i<5;i++){const xx=x+260+i*115;ctx.strokeRect(xx,y-105,70,120);drawLine(xx,y-105,xx+70,y-105,'#54f2ff',3)}for(let i=0;i<4;i++){const xx=x+900+i*90;drawLine(xx,y+170,xx,y-230,'#283b49',5);drawLine(xx-30,y-230,xx+30,y-230,'#ff9fba',2)}ctx.font='bold 44px monospace';ctx.fillStyle='#24424c';ctx.fillText('OVR / DRV',x+350,y-145)}
 if(a.type==='foundry'){ctx.fillRect(x+180,y-250,1050,24);drawLine(x+180,y-250,x+1230,y-250,'#ff9fba',3);for(let i=0;i<7;i++){const xx=x+230+i*145;drawLine(xx,y-250,xx,y+180,'#344957',8);ctx.save();ctx.translate(xx,y-185);ctx.rotate(worldTime*(i%2?1:-1));blade(0,0,36,0);ctx.restore()}for(let i=0;i<5;i++){drawLine(x+1300+i*100,y-130,x+1350+i*100,y+80,'#425467',2)}}
 if(a.type==='datastream'){for(let i=0;i<11;i++){let xx=x+280+i*95;const yy=y-28-175*Math.sin(Math.PI*i/10);ctx.strokeStyle=i%2?'#a79af8':'#54f2ff';ctx.strokeRect(xx-8,yy-80,16,160);ctx.fillStyle='#0f172c';ctx.fillRect(xx-20,y+90,40,120)}ctx.globalAlpha=.3;for(let i=0;i<10;i++)drawLine(x+200,y-220+i*24,x+1300,y-220+i*24,'#7c75b6',1)}
 if(a.type==='orbital'){for(let i=0;i<2;i++){const xx=x+640+i*500;drawLine(xx,y+250,xx,y-280,'#43515e',8);ctx.beginPath();ctx.arc(xx,y-100,160,0,TAU);ctx.strokeStyle='#384658';ctx.lineWidth=2;ctx.stroke()}for(let i=0;i<5;i++){const xx=x+1550+i*120;drawLine(xx,y+220,xx,y-200,'#313f53',6);drawLine(xx,y-200,xx+80,y-220,'#f5e0a5',2)}}
 ctx.restore();
 }
}

function drawDistrict(){
 const ri=activeEvent?.region??Math.floor(Math.max(0,player.x)/6500)%4;const accent=REGIONS[ri]?.color||'#54f2ff';
 ctx.save();ctx.globalAlpha=.18;ctx.strokeStyle=accent;ctx.lineWidth=1;
 if(ri===2){ctx.globalAlpha=.2;for(let i=0;i<18;i++){const xx=((i*117-camX*.12)%(W+150)+W+150)%(W+150);ctx.strokeRect(xx,70+(i%4)*70,32,150);drawLine(xx,0,xx,H,'#a79af8',1)}}
 if(ri===3){ctx.globalAlpha=.2;for(let i=0;i<5;i++){const xx=i*390-camX*.12%390;ctx.beginPath();ctx.ellipse(xx,H*.45,150,35,0,0,TAU);ctx.stroke();drawLine(xx,H*.45,xx,H,'#f5e0a5',3)}}
 if(ri===1){ctx.globalAlpha=.2;for(let i=0;i<8;i++){const xx=i*230-camX*.2%230;ctx.fillRect(xx,H*.2,52,H);drawLine(xx,H*.2,xx+52,H*.2,'#ff9fba',3)}}
 for(let i=Math.floor(camX*.3/420)-1;i<Math.floor(camX*.3/420)+6;i++){const x=i*420-camX*.3,y=H*.58;drawLine(x,y,x,y-140,accent,2);drawLine(x,y-140,x+170,y-155,accent,2);drawLine(x+110,y-150,x+110,y-60,accent,1);ctx.beginPath();ctx.arc(x+110,y-58,6,0,TAU);ctx.stroke()}
 ctx.globalAlpha=.5;ctx.fillStyle=accent;ctx.font='10px monospace';ctx.textAlign='left';ctx.fillText(REGIONS[ri]?.name||'THE SPRAWL',20,H-38);ctx.restore();
}

function warpTo(distance){
 const dist=clamp(Number(distance)||0,0,99999);
 const first=ground.length?ground[0].x1:Infinity;
 if(dist<first+70){
  rng=srand(seed);spawnRng=srand(seed^0x4d7a923b);
  initTrack();
 }
 while(cursor<dist+Math.max(2200,W*1.9))generateModule();
 player.x=dist;player.y=(groundAt(dist)?.y||398)-29;
 player.vy=0;player.vx=300;player.angular=0;player.angle=0;player.dead=false;
 player.onGround=true;player.coyote=0;player.invuln=1.5;player.hp=100;
 player.airTime=0;player.flipRotation=0;player.attackIntent=0;
 nextEnemyX=Math.max(nextEnemyX,dist+800);
 camX=dist-W*.32;camY=0;
 return {distance:dist,regenerated:dist<first+70,ground:!!groundAt(dist)};
}
function auditTrack(){
 let gaps=[],invalid=[],prev=null;
 for(const g of [...ground].sort((a,b)=>a.x1-b.x1)){
  if(g.x2<=g.x1||Math.abs((g.y2-g.y1)/(g.x2-g.x1))>.75)invalid.push(`steep segment ${g.x1}`);
  if(prev&&g.x1>prev.x2+1){const length=g.x1-prev.x2;
   const approach=prev.requiredSpeed||250;const vy=315+Math.min(96,approach*.17),drop=g.y1-prev.y2;const flight=(vy+Math.sqrt(Math.max(0,vy*vy+2*925*drop)))/925;
   gaps.push({start:prev.x2,length,safeRange:approach*flight});if(!prev.launch||length>approach*flight)invalid.push(`launch envelope ${prev.x2}: ${length}`);if(length>340)invalid.push(`untraversable gap ${prev.x2}: ${length}`)}
  prev=g;
 }
 return {seed:seedKey,segments:ground.length,hazards:hazards.length,modules:sectionMetrics.length,gaps:gaps.length,maxGap:Math.max(0,...gaps.map(g=>g.length)),invalid};
}

/*__CIRCUIT__*/
$('startBtn').addEventListener('click',()=>{activeEvent=null;startGame(false)});$('howBtn').addEventListener('click',showManual);$('manualBack').addEventListener('click',closeManual);$('pauseBtn').addEventListener('click',pauseToggle);$('resumeBtn').addEventListener('click',pauseToggle);$('restartBtn').addEventListener('click',()=>startGame(false));$('quitBtn').addEventListener('click',quit);$('againBtn').addEventListener('click',()=>startGame(false));$('newBtn').addEventListener('click',()=>{activeEvent=null;startGame(true)});$('endQuitBtn').addEventListener('click',quit);$('helpBtn').addEventListener('click',showManual);$('soundBtn').addEventListener('click',()=>{settings.sound=!settings.sound;save.options.sound=settings.sound;persist();$('soundBtn').textContent=settings.sound?'SFX ON':'SFX OFF';if(settings.sound)audioInit()});$('devClose').addEventListener('click',closeDev);$('devAuditBtn').addEventListener('click',()=>{const r=auditTrack();$('devAudit').textContent=r.invalid.length?`${r.invalid.length} ISSUES | ${r.invalid[0]}`:`OK | ${r.modules} modules | ${r.maxGap.toFixed(0)}px max gap`});$('devGod').addEventListener('change',e=>settings.god=e.target.checked);$('devSlow').addEventListener('change',e=>settings.slow=e.target.checked);$('devHitboxes').addEventListener('change',e=>settings.hitboxes=e.target.checked);$('devShake').addEventListener('change',e=>settings.shake=e.target.checked);$('devHeal').addEventListener('click',()=>{player.hp=player.maxHp;player.boost=1});$('devSpawn').addEventListener('click',()=>{spawnEnemy(player.x+240,groundAt(player.x+240)?.y-19||350);$('devCounts').textContent=`${enemies.length} / ${hazards.length}`});$('devWarp').addEventListener('click',()=>warpTo(Number($('devDistance').value)||2500));
window.__deathwire={state:()=>({activeEvent:activeEvent?.id,angle:player?.angle,y:player?.y,grounded:player?.onGround,frontContact:!!player?.contactF,rearContact:!!player?.contactR,loop:!!player?.loopRide,finishX,checkpointIndex,lastCheckpoint,relays:hazards.filter(h=>h.relay&&h.broken).length,boost:player?.boost,gameState,seedKey,seed,mode,position:player?.x,speed:player?.vx,hp:player?.hp,kills,rank:player?racePosition():null,ground:ground.length,hazards:hazards.length,enemies:enemies.length,worldTime,comboCount,recoveries:recoveryCredits}),audit:auditTrack,modules:()=>sectionMetrics.slice(),advance:(seconds)=>{for(let i=0;i<Math.min(10000,Math.round(seconds/FIXED_STEP))&&gameState==='play';i++)update(FIXED_STEP);return {state:gameState,position:player?.x,hp:player?.hp,score}},start:(s)=>{if(s!==undefined)$('seedInput').value=String(s);startGame(false)},pause:pauseToggle,dev:toggleDev,controls:pressed,warp:warpTo,launch:launchEvent,hits:()=>hitLog,campaign:()=>JSON.parse(JSON.stringify(save)),events:EVENTS,validateSave,geometry:()=>({checkpoints:checkpoints.map(c=>({...c})),ground:ground.map(g=>({...g})),hazards:hazards.map(h=>({type:h.type,x:h.x,y:h.y,actualY:h.type==='platform'?platformY(h):h.y,radius:h.radius,width:h.width})),riders:enemies.map(e=>({time:e.finTime,boost:e.boost,id:e.id,x:e.x,y:e.y,hp:e.hp,dead:e.dead,gone:e.gone,finished:e.finished,role:e.role}))}),test:{encounter:(type,gear=0)=>{activeEvent=null;startGame(false);ground=[];hazards=[];enemies=[];assemblies=[];sectionMetrics=[];cursor=-500;roadY=398;road(1000,0);generateModule(type);finishX=cursor-120;mode='trial';activeEvent={practice:true,modules:['flow'],length:finishX};nextEnemyX=Infinity;save.equipped=gear;player.hp=player.maxHp=PARTS[gear].hp;return {finishX,modules:sectionMetrics.slice()};},render:()=>{updateHud();render()},assemblies:()=>assemblies.map(a=>({...a})),raceOut:()=>{for(let i=0;i<14400&&enemies.some(e=>!e.finished&&!e.dead&&!e.gone);i++)update(FIXED_STEP);return enemies.map(e=>({reason:e.reason,name:e.name,finished:e.finished,time:e.finTime,hp:e.hp,x:e.x,dead:e.dead||e.gone}))},setBike:(v)=>Object.assign(player,v),setRivals:(v)=>{enemies=v.map(x=>Object.assign(makeBike(x.x,x.y,true),x))},finish:(win)=>finish(win,'TEST FINISH'),jump:()=>jumpBike(player,true),hit:attack,damage:(n)=>damage(player,n,'TEST'),recover:recoverTrial,step:(n)=>{for(let i=0;i<n&&gameState==='play';i++)update(FIXED_STEP)},simulate:(n,auto=false,cruise=false)=>{let minHP=player.hp,crashes=0;for(let i=0;i<n;i++){if(gameState==='play'){if(auto){pressed.gas=!cruise;pressed.back=player.angle>.2;pressed.forward=player.angle<-.3;const trap=hazards.find(h=>!h.broken&&!h._gone&&['spikes','saw','barrel','wheel','swing','laser'].includes(h.type)&&h.x>player.x+30&&h.x<player.x+player.vx*(['laser','swing','wheel'].includes(h.type)?.38:.26));if(trap&&player.onGround)justJump=true;if(hazards.some(h=>h.type==='barrel'&&!h.broken&&h.x>player.x&&h.x-player.x<80&&Math.abs(h.y-player.y)<76))justAttack=true;if(enemies.some(e=>!e.dead&&e.x>player.x&&e.x-player.x<85&&Math.abs(e.y-player.y)<60))justAttack=true;}update(FIXED_STEP);minHP=Math.min(minHP,player.hp)}else if(gameState==='crash'){crashes++;updateCrash(FIXED_STEP)}else break;}return {state:gameState,x:player.x,hp:player.hp,time:runTime,minHP,crashes,recoveries:recoveryCredits}},resetProgress:()=>{save=freshSave();persist()}}};
last=performance.now();requestAnimationFrame(tick);
})();