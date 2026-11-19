
/* Vision 8 workbench: preliminary editing/automation/sampler/distribution tools. */
(() => {
'use strict';
const $8=id=>document.getElementById(id),D=window.Jack22Lot3DSP,copy=o=>JSON.parse(JSON.stringify(o));
const empty=()=>({version:1,swing:0,automation:{on:false,points:[{bar:1,level:70},{bar:5,level:70}]},sections:[],presets:[],loop:{on:false,start:1,end:5},sampler:{name:'',size:0}});
let state8=empty(),undo=[],redo=[],current=null,last='',restore=false,commitTimer=null;
const message=t=>{$8('v8Status').textContent=t;window.Jack22Feedback?.publish('project',t);};
function parse(o){if(o===undefined)return empty();if(!o||o.version!==1||!Number.isFinite(o.swing)||o.swing<0||o.swing>100||!o.automation||typeof o.automation.on!=='boolean'||!Array.isArray(o.automation.points)||o.automation.points.length<1||o.automation.points.length>16||!Array.isArray(o.sections)||o.sections.length>16||!Array.isArray(o.presets)||o.presets.length>16||!o.loop||typeof o.loop.on!=='boolean'||!Number.isInteger(o.loop.start)||!Number.isInteger(o.loop.end)||o.loop.start<1||o.loop.end<=o.loop.start||o.loop.end>129||!o.sampler||typeof o.sampler.name!=='string'||o.sampler.name.length>120||!Number.isInteger(o.sampler.size)||o.sampler.size<0)throw Error('Réglages Vision 8 invalides');
 let prev=0;for(const p of o.automation.points){if(!Number.isInteger(p.bar)||p.bar<1||p.bar>128||p.bar<=prev||!Number.isFinite(p.level)||p.level<0||p.level>100)throw Error('Courbe invalide');prev=p.bar;}
 for(const s of o.sections)if(!s||typeof s.name!=='string'||!s.name.trim()||s.name.length>40||!Number.isInteger(s.start)||!Number.isInteger(s.end)||s.start<1||s.end<=s.start||s.end>129)throw Error('Section invalide');
 for(const p of o.presets){if(!p||typeof p.name!=='string'||!p.name.trim()||p.name.length>40)throw Error('Preset invalide');D.validate(p.settings);}
 return copy(o);
}
const cap=VoiceStore.capture,par=VoiceStore.parse,set=VoiceStore.setText;
VoiceStore.capture=function(){return {...cap.call(this),workbench:copy(state8)};};
VoiceStore.parse=function(b){const v=par.call(this,b);if(!v)return v;try{return {...v,workbench:parse(b.workbench)};}catch(e){return false;}};
VoiceStore.setText=function(v){if(v?.workbench)state8=parse(v.workbench);set.call(this,v);sync();};
const wrap=ProjectPersistence.wrapper;ProjectPersistence.wrapper=function(a){const w=wrap.call(this,a);w.version='2.0-prototype';return w;};
const data0=exportData;exportData=function(){return {...data0(),workbench:copy(state8)};};
function at(points,bar){if(bar<=points[0].bar)return points[0].level;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];if(bar<=b.bar)return a.level+(b.level-a.level)*(bar-a.bar)/(b.bar-a.bar);}return points.at(-1).level;}
function automate(E,when,offset,stepLen,config){if(!config?.on)return;const p=E.masterGain.gain,bar=1+offset/16;p.cancelScheduledValues(when);p.setValueAtTime(at(config.points.map(q=>({bar:q.bar,level:volumeToGain(q.level)})),bar),when);for(const q of config.points)if(q.bar>bar)p.linearRampToValueAtTime(volumeToGain(q.level),when+((q.bar-1)*16-offset)*stepLen);}
window.L8Swing=(step,len)=>step%2?state8.swing/100*len*.45:0;
function restoreMaster(E,when){if(!E)return;const p=E.masterGain.gain;p.cancelScheduledValues(when);E.setMaster(Number($('master').value));}
window.L8PrepareLive=(E,when,offset)=>{if(state8.automation.on)automate(E,when,offset,stepSec(),state8.automation);else restoreMaster(E,when);};
const stop8=stop;stop=function(){const r=stop8.apply(this,arguments);if(typeof engine!=='undefined'&&engine&&typeof audio!=='undefined'&&audio)restoreMaster(engine,audio.currentTime);return r;};
$('stop').onclick=stop;
const pause8=typeof pause==='function'?pause:null;if(pause8)pause=function(){const r=pause8.apply(this,arguments);if(typeof engine!=='undefined'&&engine&&audio)restoreMaster(engine,audio.currentTime);return r;};
document.addEventListener('input',event=>{
 const id=event.target.id;
 if((id==='master'||id==='mixMaster')&&state8.automation.on){
  state8.automation.on=false;
  if(typeof engine!=='undefined'&&engine&&typeof audio!=='undefined'&&audio)restoreMaster(engine,audio.currentTime);
  $8('v8AutoOn').checked=false;later();message('Réglage manuel du master : automation désactivée. Réapplique la courbe pour la réactiver.');
 }
 if(id==='bpm'&&state8.automation.on&&typeof engine!=='undefined'&&engine&&typeof state!=='undefined'&&state==='playing'&&typeof nextTime!=='undefined'&&typeof absStep!=='undefined')automate(engine,nextTime,absStep,stepSec(),state8.automation);
},true);
window.L8PrepareOffline=(E,data)=>{const swing=data.workbench?.swing||0,hit0=E.hit;E.hit=function(r,t,b){const step=Math.round(t/data.stepLen);return hit0.call(E,r,t+(step%2?swing/100*data.stepLen*.45:0),b);};automate(E,0,0,data.stepLen,data.workbench?.automation);};
function fingerprint(){return JSON.stringify({p:ProjectPersistence.wrapper(null),a:audioClips.map(c=>[c.fileId,c.startBar,c.name,c.missing]),level:audioLevel,mute:audioMute});}
function snap(){const p=ProjectTransfer.snapshot();p.clips=p.clips.map(c=>({...c,voice:c.voice?copy(c.voice):null}));p.take=p.take?copy(p.take):null;return p;}
function pruneHistory(){const live=new Set(audioClips.map(c=>c.buffer).filter(Boolean));function extra(){const seen=new Set(live);let bytes=0;for(const p of [...undo,...redo])for(const c of p.clips){if(c.buffer&&!seen.has(c.buffer)){seen.add(c.buffer);bytes+=c.buffer.length*c.buffer.numberOfChannels*4;}}return bytes;}while(undo.length&&extra()>256*1048576)undo.shift();while(redo.length&&extra()>256*1048576)redo.shift();}
function remember(){if(restore||persistBusy||window.Jack22Voice.state.active)return;const f=fingerprint();if(f===last)return;if(current){undo.push(current);if(undo.length>24)undo.shift();redo=[];pruneHistory();}current=snap();last=f;syncHistory();}
/* M2 : un geste (glisser, fader tenu) = une seule étape, enregistrée au relâchement ; un clic ou une validation = une étape tout de suite. */
let held=false,queued=[],queueTimer=null;
function later(){if(commitTimer)clearTimeout(commitTimer);commitTimer=setTimeout(()=>{commitTimer=null;if(held)return later();remember();},180);}
/* M2 : Annuler/Rétablir n'est plus ignoré en silence. Pendant la préparation des voix, l'action attend et s'applique ensuite, dans l'ordre. */
function travelBlock(){if(window.Jack22Voice.state.active)return 'Prise voix en cours : Annuler et Rétablir attendent la fin de la prise.';if(state!=='stopped'||rec.state!=='idle')return 'Arrête la lecture ou l’enregistrement avant d’annuler ou de rétablir.';if(exporting)return 'Export en cours : attends la fin avant d’annuler ou de rétablir.';if(window.Jack22Lot3.pending)return 'wait';if(persistBusy)return 'Opération en cours (sauvegarde, chargement, import ou export) : attends la fin avant d’annuler ou de rétablir.';return '';}
function queueTravel(back){if(queued.length<24)queued.push(!!back);message('Préparation des voix en cours : '+queued.length+' action(s) Annuler/Rétablir en attente, appliquée(s) dès la fin.');if(queueTimer)return;queueTimer=setInterval(()=>{const why=travelBlock();if(why==='wait')return;if(why){clearInterval(queueTimer);queueTimer=null;queued=[];message(why+' Les actions en attente sont abandonnées.');return;}const b=queued.shift();if(!queued.length){clearInterval(queueTimer);queueTimer=null;}travel(b,true);},120);}
function syncHistory(){$8('v8Undo').disabled=!undo.length;$8('v8Redo').disabled=!redo.length;$8('v8History').textContent=undo.length+' annulation(s) · '+redo.length+' rétablissement(s)';}
function travel(back,fromQueue){
 if(!fromQueue&&queued.length){queueTravel(back);return;}
 {const why=travelBlock();if(why==='wait'){queueTravel(back);return;}if(why){message(why);return;}}
 if(commitTimer){clearTimeout(commitTimer);commitTimer=null;}
 remember();
 const from=back?undo:redo,to=back?redo:undo;if(!from.length)return;
 const previous=snap(),target=from.at(-1);restore=true;stop();
 try{
  const errors=ProjectTransfer.rollback(target);if(errors.length)throw Error('Restauration incomplète : '+errors.join(', '));
  from.pop();to.push(previous);current=snap();last=fingerprint();window.Jack22Lot3.schedule();message(back?'Édition annulée.':'Édition rétablie.');
 }catch(e){
  let recovery=[];try{recovery=ProjectTransfer.rollback(previous);}catch(failure){recovery=[failure.message];}current=previous;last=fingerprint();
  message(e.message+(recovery.length?' · Retour à l’état précédent incomplet : '+recovery.join(', '):' · État précédent rétabli, historique conservé.'));
 }finally{restore=false;syncHistory();}
}
$8('v8Undo').onclick=()=>travel(true);$8('v8Redo').onclick=()=>travel(false);
document.addEventListener('pointerdown',()=>{held=true;},true);addEventListener('blur',()=>{held=false;});
for(const ev of ['change','input','pointerup','pointercancel','keyup'])document.addEventListener(ev,e=>{if(e.target?.closest?.('#v8Diagnostics'))return;if(ev==='pointerup'||ev==='pointercancel'){held=false;remember();}else if(ev==='change')remember();later();});
document.addEventListener('click',e=>{if(e.target?.closest?.('#v8Undo,#v8Redo,#v8DownloadDiag,#v8Shortcut,#j90Undo,#j90Redo'))return;remember();later();});
document.addEventListener('jack22:processed',later);
new MutationObserver(()=>{samplerOptions();later();}).observe($('tlRows'),{childList:true});
$8('v8AddSection').onclick=()=>{try{const n={name:$8('v8SectionName').value.trim(),start:Number($8('v8SectionStart').value),end:Number($8('v8SectionEnd').value)};if(n.end>song.bars+1)throw Error('La section dépasse la longueur du morceau : allonge la timeline.');const next=copy(state8);next.sections.push(n);state8=parse(next);sync();later();message('Repère de section ajouté.');}catch(e){message(e.message);}};
function syncSections(){const box=$8('v8Sections');box.replaceChildren();for(const s of state8.sections){const row=document.createElement('div');row.className='v8Line';const label=document.createElement('span');label.textContent=s.name+' · mesures '+s.start+' à '+(s.end-1);const play=document.createElement('button');play.textContent='Écouter cette zone';play.onclick=()=>{if(!window.l3Ready())return message('Attends les traitements voix.');state8.loop={on:true,start:s.start,end:s.end};setMode('song');stop();start((s.start-1)*16);sync();};const dup=document.createElement('button');dup.textContent='Dupliquer les blocs instruments';dup.onclick=()=>{const length=s.end-s.start,blocks=song.arrangement.filter(b=>b.startBar>=s.start-1&&b.startBar+b.lengthBars<=s.end-1),want=blocks.map(b=>({...b,id:song.nextId++,startBar:b.startBar+length}));if(!want.length)return message('Aucun bloc instrument complet dans cette section.');if(want.some(b=>!canPlace(b.trackKey,b.startBar,b.lengthBars)))return message('Duplication refusée : place occupée ou fin du morceau.');song.arrangement.push(...want);tlBuild();later();message('Blocs instruments dupliqués après la section. Les clips audio restent à leur place.');};row.append(label,play,dup);box.append(row);}}
$8('v8StopLoop').onclick=()=>{state8.loop.on=false;stop();sync();later();};
setInterval(()=>{if(!window.Jack22Voice?.state.active&&state8.loop.on&&state==='playing'&&audio&&absNow()!==null&&absNow()>=(state8.loop.end-1)*16){stop();start((state8.loop.start-1)*16);}},35);
$8('v8ApplyAuto').onclick=()=>{try{const points=$8('v8Curve').value.trim().split('\n').filter(Boolean).map(l=>{const parts=l.split(/[,;:]/).map(v=>v.trim());if(parts.length!==2||parts.some(v=>v===''))throw Error('Courbe invalide : écris mesure, pourcentage sur chaque ligne.');const[bar,level]=parts.map(Number);return {bar,level};});const next=copy(state8);next.automation={on:$8('v8AutoOn').checked,points};state8=parse(next);stop();later();message('Courbe master enregistrée. Elle sera appliquée au prochain Play et au WAV.');}catch(e){message(e.message);}};
$8('v8Swing').oninput=()=>{state8.swing=Number($8('v8Swing').value);$8('v8SwingValue').textContent=state8.swing+' %';};
function samplerOptions(){const select=$8('v8Sample'),previous=select.value;select.replaceChildren();for(const c of audioClips.filter(c=>c.buffer)){const o=document.createElement('option');o.value=c.fileId;o.textContent=c.name;select.append(o);}if([...select.options].some(x=>x.value===previous))select.value=previous;else if(state8.sampler.name){const c=audioClips.find(c=>c.buffer&&c.name===state8.sampler.name&&c.size===state8.sampler.size);if(c)select.value=c.fileId;}}
$8('v8Sample').onchange=()=>{const c=audioClips.find(c=>c.fileId===$8('v8Sample').value);if(c)state8.sampler={name:c.name,size:c.size};};
let previews=[];
function samplerNote(semitones){const c=audioClips.find(c=>c.fileId===$8('v8Sample').value);if(!c?.buffer)return message('Importe un son ou ajoute une voix de démo pour le sampler.');if(persistBusy||window.Jack22Voice.state.active)return;initAudio();if(previews.length>=8){try{previews.shift().stop();}catch(e){}}const src=audio.createBufferSource(),g=audio.createGain();src.buffer=c.buffer;src.playbackRate.value=Math.pow(2,semitones/12);const time=audio.currentTime,duration=Math.min(2,c.duration/src.playbackRate.value);g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(.25,time+.015);g.gain.setValueAtTime(.25,time+Math.max(.015,duration-.1));g.gain.linearRampToValueAtTime(0,time+duration);src.connect(g);g.connect(engine.mixBus);previews.push(src);src.onended=()=>{try{g.disconnect();}catch(e){}previews=previews.filter(x=>x!==src)};src.start();src.stop(time+duration+.02);}
for(const b of document.querySelectorAll('[data-sample-note]'))b.onclick=()=>samplerNote(Number(b.dataset.sampleNote));
$8('v8SavePreset').onclick=()=>{try{const c=audioClips.find(c=>c.voice?.slot===Number($('l3Slot').value));if(!c)return message('Sélectionne une voix enregistrée.');const next=copy(state8);next.presets.push({name:$8('v8PresetName').value.trim(),settings:window.Jack22Lot3.settings(c)});state8=parse(next);syncPresets();later();message('Preset voix enregistré dans le projet.');}catch(e){message(e.message);}};
function syncPresets(){const box=$8('v8Presets');box.replaceChildren();for(const p of state8.presets){const b=document.createElement('button');b.textContent=p.name;b.onclick=()=>{const c=audioClips.find(c=>c.voice?.slot===Number($('l3Slot').value));if(!c)return message('Choisis une voix dans les effets.');if(persistBusy||window.Jack22Voice.state.active)return;const checked=D.validate(p.settings);if(checked.edit.start+checked.edit.end>=c.duration-.05)return message('Ce preset découperait toute la prise : choisis une prise plus longue ou un autre preset.');c.voice.processing=checked;audioKill(c);window.Jack22Lot3.sync();window.Jack22Lot3.schedule();later();};box.append(b);}}
function sync(){$8('v8Swing').value=state8.swing;$8('v8SwingValue').textContent=state8.swing+' %';$8('v8AutoOn').checked=state8.automation.on;$8('v8Curve').value=state8.automation.points.map(p=>p.bar+', '+p.level).join('\n');$8('v8LoopStatus').textContent=state8.loop.on?'Zone en boucle : mesures '+state8.loop.start+' à '+(state8.loop.end-1):'Boucle de zone arrêtée';syncSections();syncPresets();samplerOptions();syncHistory();}
function diagnostics(){return {build:'JACK22-11.5-CLAUDE-7.9',time:new Date().toISOString(),available:{microAPI:!!navigator.mediaDevices?.getUserMedia,audioWorklet:typeof AudioWorkletNode!=='undefined',offlineRenderer:typeof OfflineAudioContext!=='undefined',storage:typeof indexedDB!=='undefined'},state:{clips:audioClips.length,voices:audioClips.filter(c=>c.voice).length,sourceSeconds:audioClips.reduce((n,c)=>n+c.duration,0),prepared:window.l3Ready(),dirty:ProjectPersistence.isDirty()},validation:{realBrowserTests:false,meaning:'Capacités détectées et état courant, pas une certification de fonctionnement.'}};}
function download(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),30000);}
$8('v8Check').onclick=()=>{$8('v8Diag').textContent=JSON.stringify(diagnostics(),null,2);};
$8('v8DownloadDiag').onclick=()=>download(new Blob([JSON.stringify(diagnostics(),null,2)],{type:'application/json'}),'JACK22-diagnostic.json');
$8('v8Shortcut').onclick=()=>{if(!location.href.startsWith('file:'))return message('Depuis un site hébergé, utilise les favoris du navigateur.');download(new Blob(['[InternetShortcut]\r\nURL='+location.href+'\r\n'],{type:'application/octet-stream'}),'JACK22-STUDIO.url');message('Raccourci Windows téléchargé. Il pointera vers ce fichier : recrée-le si tu déplaces le studio.');};
$8('v8Export').onclick=()=>ProjectTransfer.exportProject();
window.Jack22Vision8={parse,at,automate,diagnostics,get state(){return copy(state8)},remember,travel,get history(){return {undo:undo.length,redo:redo.length,queued:queued.length,held};}};
window.JACK22_BUILD='VISION8.9-ORBITE';sync();current=snap();last=fingerprint();if(ProjectPersistence.markClean)ProjectPersistence.markClean();
})();

