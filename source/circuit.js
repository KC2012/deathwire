// Black Circuit campaign. Kept in source for editing; embedded by tools/build.mjs.
const FIXED_STEP=1/120;
let physicsAccumulator=0,activeEvent=null,storageAvailable=true;
const REGIONS=[
 {name:'01 / THE SPRAWL',crew:'No sponsors. No safety net. Take a machine and make a name.',color:'#54f2ff'},
 {name:'02 / IRON CHOIR',crew:'Foundry crews race beneath the presses. The factory never sleeps.',color:'#ff9fba'},
 {name:'03 / GHOST GRID',crew:'The security network went dark. Its machines did not.',color:'#c2b5ff'},
 {name:'04 / SKY BURIAL',crew:'Above the smog, the last crew guards the city’s exit.',color:'#f5e0a5'}
];
const EVENTS=[
 ['First current','trial',6200,['flow','ramp','spikes','jump'],'Find your line. Finish with three checkpoint recoveries.',22],
 ['Street teeth','sprint',7600,['flow','barrels','spikes','loop'],'Race the four local crew riders. Finish to claim your license.',24],
 ['Exit wound','sprint',8800,['ramp','bridge','loop','rocketjump'],'The Sprawl qualifier. Speed earns gold; survival earns passage.',27],
 ['Choir practice','trial',8400,['crusher','flow','cascade','ramp'],'Ride the working foundry. Watch the stroke of the presses.',27],
 ['Heavy metal','sprint',10000,['barrels','crusher','conveyor','flow'],'The foundry crew fights dirty. A strike can buy breathing room.',30],
 ['Assembly line','trial',10800,['pressrun','bridge','rocketjump','flow'],'The entire plant is your course. Keep the wheels moving.',34],
 ['Dead signal','trial',9800,['laser','flow','platform','loop'],'Broken surveillance and suspended decks. Trust the road.',31],
 ['Ghost protocol','sprint',11500,['laser','swing','skyrail','flow'],'The Ghosts ride light and fast. Save boost for the straights.',35],
 ['Blackout','trial',12200,['skyrail','wheel','doublejump','flow'],'Cross the grid before it takes another rider.',38],
 ['Above the static','trial',12800,['rocketjump','loop','halfpipe','flow'],'Rocket rails carry you above the city. Land with the road.',40],
 ['Last light','sprint',13800,['skyrail','cascade','loop','flow'],'One crew left. One road out. Race the skyline.',42],
 ['DEATHWIRE','sprint',15400,['reactor','rocketjump','loop','flow'],'The final circuit. Finish the run and own the road.',46]
].map((e,id)=>({id,title:e[0],mode:e[1],length:e[2],modules:e[3],brief:e[4],par:[11,14.5,15.5,15.5,17,19,19,20,20,23,24,29][id],seed:'BLACK-'+(id+1)+'-CIRCUIT',region:Math.floor(id/3)}));
const PARTS=[
 {name:'STOCK / Wireframe',desc:'Balanced, agile, unbreakable spirit. The complete circuit is built for this machine.',cost:0,hp:100,speed:0,regen:.11,attack:0},
 {name:'ENGINE / Redline',desc:'+35 top speed. Lighter armor: 85 integrity. Faster lines demand cleaner riding.',cost:200,hp:85,speed:35,regen:.11,attack:0},
 {name:'FRAME / Ironclad',desc:'135 integrity and heavier strikes. Top speed reduced by 25. Built for the crowd.',cost:200,hp:135,speed:-25,regen:.1,attack:9},
 {name:'CELL / Afterimage',desc:'Boost regenerates 75% faster. 90 integrity. Chain short bursts into long flights.',cost:250,hp:90,speed:0,regen:.195,attack:0}
];
const SAVE_KEY='deathwire.circuit.v1';
function freshSave(){return {version:1,credits:0,medals:Array(12).fill(0),times:Array(12).fill(null),owned:[0],equipped:0,options:{sound:true,shake:!matchMedia('(prefers-reduced-motion: reduce)').matches,flashes:!matchMedia('(prefers-reduced-motion: reduce)').matches,fullFX:true}}}
function validateSave(raw){
 const clean=freshSave();if(!raw||raw.version!==1)return clean;
 if(Array.isArray(raw.medals))clean.medals=clean.medals.map((_,i)=>Number.isInteger(raw.medals[i])?clamp(raw.medals[i],0,3):0);
 // Progress is a contiguous chain: malformed saves cannot create unreachable islands.
 let locked=false;clean.medals=clean.medals.map(m=>{if(locked)return 0;if(!m)locked=true;return m});
 if(Array.isArray(raw.times))clean.times=clean.times.map((_,i)=>Number.isFinite(raw.times[i])&&raw.times[i]>0?raw.times[i]:null);
 clean.credits=Number.isFinite(raw.credits)?clamp(Math.floor(raw.credits),0,100000):0;
 if(Array.isArray(raw.owned))clean.owned=[...new Set([0,...raw.owned.filter(n=>Number.isInteger(n)&&n>0&&n<PARTS.length)])];
 if(clean.owned.includes(raw.equipped))clean.equipped=raw.equipped;
 for(const k of Object.keys(clean.options))if(typeof raw.options?.[k]==='boolean')clean.options[k]=raw.options[k];return clean;
}
function loadCampaign(){let raw;try{raw=localStorage.getItem(SAVE_KEY)}catch(_){storageAvailable=false;return freshSave()}try{return validateSave(JSON.parse(raw))}catch(_){return freshSave()}}
let save=loadCampaign();Object.assign(settings,save.options);$('soundBtn').textContent=settings.sound?'SFX ON':'SFX OFF';
function persist(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));storageAvailable=true}catch(_){storageAvailable=false}updateStorageWarning()}
function updateStorageWarning(){const e=$('storageWarning');if(e)e.textContent=storageAvailable?'Progress is saved locally in this browser.':'Storage unavailable: this session is playable, but progress cannot be retained. Keep this tab open.'}
function unlocked(id){return id===0||save.medals[id-1]>0}
function showCircuit(){
 $('menu').classList.add('hidden');$('endMenu').classList.add('hidden');$('circuit').classList.remove('hidden');
 const completed=save.medals.filter(Boolean).length;
 $('campaignStatus').textContent=completed===12?'CIRCUIT COMPLETE // The road is yours. Revisit any event for gold.':`${completed} / 12 EVENTS CLEARED  //  ${save.credits} SCRAP  //  ${PARTS[save.equipped].name}`;
 $('regions').replaceChildren();
 REGIONS.forEach((r,ri)=>{const col=document.createElement('div');col.className='region';col.style.borderColor=r.color;const title=document.createElement('h3');title.textContent=r.name;col.append(title);const lore=document.createElement('p');lore.textContent=r.crew;col.append(lore);
  EVENTS.filter(e=>e.region===ri).forEach(e=>{const b=document.createElement('button');b.className='event'+(save.medals[e.id]?' done':'');b.disabled=!unlocked(e.id);b.title=e.brief+' Gold: '+e.par+' seconds'+(e.mode==='sprint'?' and first place.':'.');b.innerHTML=`<small>${e.mode==='trial'?'CHECKPOINT RUN':'CREW RACE'} / ${(e.length/1000).toFixed(1)} KM</small><b>${e.title}</b><small class="medal">${save.medals[e.id]?'◆'.repeat(save.medals[e.id])+' '+(save.times[e.id]?.toFixed(1)||'—')+'s':unlocked(e.id)?'RIDE →':'LOCKED'}</small>`;b.addEventListener('click',()=>launchEvent(e.id));col.append(b)});$('regions').append(col)});
}
function launchEvent(id){if(!unlocked(id))return false;activeEvent=EVENTS[id];$('circuit').classList.add('hidden');$('modeSelect').value=activeEvent.mode;$('seedInput').value=activeEvent.seed;startGame(false);toast(activeEvent.title.toUpperCase(),2);return true}
function settleEvent(win){
 $('nextEventBtn').classList.toggle('hidden',!activeEvent);$('newBtn').classList.toggle('hidden',!!activeEvent);
 if(!activeEvent)return;
 if(activeEvent.practice){$('endReport').innerHTML+='<br><br>PRACTICE COMPLETE // Ready when you are.';return}
 if(!win){$('endReport').innerHTML+='<br><br>No progress lost. Retry the same course.';return}
 const id=activeEvent.id,old=save.medals[id];
 const medal=runTime<=activeEvent.par&&(mode!=='sprint'||racePosition()===1)?3:runTime<=activeEvent.par*1.4&&(mode!=='sprint'||racePosition()<=3)?2:1;
 const reward=(old?0:200)+Math.max(0,medal-old)*50;
 save.medals[id]=Math.max(old,medal);save.times[id]=Math.min(save.times[id]||Infinity,runTime);save.credits+=reward;persist();
 $('endReport').innerHTML+=`<br><br><span style="color:#54f2ff">${['','BRONZE','SILVER','GOLD'][medal]} // +${reward} SCRAP</span><br>${id===11?'THE BLACK CIRCUIT IS YOURS. CAMPAIGN COMPLETE.':old?'Personal best recorded.':'NEXT EVENT UNLOCKED.'}`;
}
function showGarage(){
 $('menu').classList.add('hidden');$('garage').classList.remove('hidden');$('wallet').textContent=`${save.credits} SCRAP // EQUIPPED: ${PARTS[save.equipped].name}`;$('parts').replaceChildren();
 PARTS.forEach((p,id)=>{const d=document.createElement('div');d.className='part';d.innerHTML=`<h3 style="font-size:13px">${p.name}</h3><p>${p.desc}</p>`;const b=document.createElement('button');b.className=id===save.equipped?'primary':'secondary';b.textContent=id===save.equipped?'EQUIPPED':save.owned.includes(id)?'EQUIP':`${p.cost} SCRAP / BUILD`;b.disabled=!save.owned.includes(id)&&save.credits<p.cost;b.onclick=()=>{if(!save.owned.includes(id)){if(save.credits<p.cost)return;save.credits-=p.cost;save.owned.push(id)}save.equipped=id;persist();showGarage()};d.append(b);$('parts').append(d)})
}
function training(){activeEvent={practice:true,id:-1,title:'Open Circuit',mode:'trial',seed:'PRACTICE',length:5200,modules:['flow','ramp','loop','rocketjump','flow']};$('modeSelect').value='trial';$('seedInput').value='PRACTICE';startGame(false);toast('PRACTICE // THREE RECOVERIES',2)}
function closeFrontPanel(id){$(id).classList.add('hidden');$('menu').classList.remove('hidden');gameState='menu'}
$('campaignBtn').onclick=showCircuit;$('garageBtn').onclick=showGarage;$('trainingBtn').onclick=training;
$('circuitBack').onclick=()=>closeFrontPanel('circuit');$('garageBack').onclick=()=>closeFrontPanel('garage');$('nextEventBtn').onclick=()=>{activeEvent=null;gameState='menu';$('hud').style.display='none';$('topButtons').style.display='none';$('mobile').classList.remove('playing');showCircuit()};
const optionsBtn=document.createElement('button');optionsBtn.className='secondary';optionsBtn.textContent='SETTINGS';$('howBtn').after(optionsBtn);optionsBtn.onclick=()=>{for(const k of ['Sound','Shake','Flash','FX'])$('opt'+k).checked=settings[{Sound:'sound',Shake:'shake',Flash:'flashes',FX:'fullFX'}[k]];$('options').classList.remove('hidden');updateStorageWarning()};
$('optionsBack').onclick=()=>{for(const [id,key] of Object.entries({Sound:'sound',Shake:'shake',Flash:'flashes',FX:'fullFX'}))settings[key]=$('opt'+id).checked;save.options={sound:settings.sound,shake:settings.shake,flashes:settings.flashes,fullFX:settings.fullFX};$('soundBtn').textContent=settings.sound?'SFX ON':'SFX OFF';persist();$('options').classList.add('hidden')};
// Visibility changes must release held keyboard and pointer input.
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearControls();if(gameState==='play')pauseToggle()}});
window.addEventListener('keydown',e=>{if(e.code==='KeyR'&&!e.ctrlKey&&!e.metaKey&&['play','dead','crash','pause'].includes(gameState)&&$('devMenu').classList.contains('hidden')){e.preventDefault();startGame(false)}});


// Extended engineering tools: session-safe unlocks and confirmed destructive reset.
const devTools=document.createElement('div');devTools.className='devbuttons';
devTools.innerHTML='<input class="picker" id="devSeedInput" aria-label="New track seed" placeholder="SEED"><button class="secondary" id="devRegenerate">REGENERATE SEED</button><select class="picker" id="devModule" aria-label="Track module"></select><button class="secondary" id="devModuleWarp">GO TO MODULE</button><button class="secondary" id="devUnlock">UNLOCK CIRCUIT</button><button class="secondary" id="devReset">RESET PROGRESS</button>';
$('devMenu').querySelector('.panel').append(devTools);
$('devRegenerate').onclick=()=>{const v=$('devSeedInput').value.trim();if(v)$('seedInput').value=v;startGame(false)};
$('devModuleWarp').onclick=()=>{const m=sectionMetrics[Number($('devModule').value)];if(m)warpTo(m.start+30);closeDev()};
$('devUnlock').onclick=()=>{save.medals=save.medals.map(m=>Math.max(1,m));persist();toast('DEV // CIRCUIT UNLOCKED')};
$('devReset').onclick=()=>{if(confirm('Erase campaign medals, parts and credits? This cannot be undone.')){save=freshSave();persist();toast('PROGRESS RESET')}};
const devObserver=new MutationObserver(()=>{if($('devMenu').classList.contains('hidden'))return;$('devModule').replaceChildren();sectionMetrics.forEach((m,i)=>{const o=document.createElement('option');o.value=i;o.textContent=i+' / '+m.type+' / '+Math.round(m.start)+'m';$('devModule').append(o)})});devObserver.observe($('devMenu'),{attributes:true,attributeFilter:['class']});
