
/* Lot 3 prototype: non-destructive, rendered voice chains shared by playback and WAV. */
(() => {
'use strict';
const D=window.Jack22Lot3DSP,$l=id=>document.getElementById(id),cache=new WeakMap();
let pending=false,generation=0,queueTimer=null,errorText='',slot=1;
const say=t=>{$l('l3Status').textContent=t;window.Jack22Feedback?.publish('voice',t);};
const clip=i=>audioClips.find(c=>c.voice?.slot===i);
const settings=c=>D.validate(c?.voice?.processing||D.defaults());
const key=c=>JSON.stringify(settings(c));
/* M2 : la copie traitée est rangée sous la prise d'origine (et ses réglages), pas sous l'objet clip : Annuler/Rétablir recrée les clips mais retrouve le son déjà calculé. Deux réglages gardés par prise. */
const prepared=c=>{const m=c.buffer?cache.get(c.buffer):null;return m&&m.get(key(c))||null;};
const needs=c=>c.buffer&&c.voice&&D.active(settings(c))&&!prepared(c);
window.l3ReadBuffer=c=>c.voice&&D.active(settings(c))?(prepared(c)||c.buffer):c.buffer;
window.l3Duration=c=>{const s=c.voice?settings(c):null;return c.buffer?(prepared(c)?.duration??(Math.max(.05,c.duration-(s&&!s.bypass?s.edit.start+s.edit.end:0))+(s&&D.active(s)?D.tail(s):0))):c.duration;};
window.l3Ready=()=>!pending&&!audioClips.some(needs);
function guard(){if(!window.l3Ready()){say(errorText||'Préparation des voix en cours. Attends la fin ou réessaie les traitements.');return false;}return true;}
const oldLoad=ProjectPersistence.load,oldSave=ProjectPersistence.save,oldApply=ProjectPersistence.applyLoaded;
ProjectPersistence.load=function(){if(pending)return say('Préparation des voix : chargement momentanément indisponible.');return oldLoad.apply(this,arguments);};
ProjectPersistence.save=function(){if(pending)return say('Attends la fin du traitement avant de sauvegarder.');return oldSave.apply(this,arguments);};
ProjectPersistence.applyLoaded=function(){const r=oldApply.apply(this,arguments);schedule();return r;};
const importApply=VoiceStore.applyImported;
VoiceStore.applyImported=function(){const r=importApply.apply(this,arguments);schedule();return r;};
const oldPExport=ProjectTransfer.exportProject,oldPImport=ProjectTransfer.importFile;
ProjectTransfer.exportProject=function(){if(pending){say('Attends la fin du traitement avant d’exporter le projet.');return Promise.resolve();}return oldPExport.apply(this,arguments);};
ProjectTransfer.importFile=function(){if(pending){say('Attends la fin du traitement avant d’importer.');return Promise.resolve();}return oldPImport.apply(this,arguments);};
const oldStart=start;start=function(){if(!guard())return;return oldStart.apply(this,arguments);};
const oldWav=exportWav;exportWav=function(){if(!guard()){setExp('Export suspendu : traitements voix non prêts.');return;}return oldWav.apply(this,arguments);};$('expBtn').onclick=exportWav;
const oldData=audioExportData;audioExportData=function(){const d=oldData();if(!d)return null;const originals=audioClips.filter(c=>c.buffer);d.clips.forEach((entry,i)=>{const c=originals[i];entry.buffer=window.l3ReadBuffer(c);entry.duration=window.l3Duration(c);});return d;};
function busy(on){const global=$l('l3GlobalCancel');if(global){global.hidden=!on;global.disabled=!on;}pending=on;persistBusy=on;setPersistBusy(on);$l('l3Cancel').disabled=!on;$l('l3Retry').disabled=on;document.body.classList.toggle('l3Busy',on);}
function schedule(){if(queueTimer)clearTimeout(queueTimer);queueTimer=setTimeout(()=>{queueTimer=null;if(window.Jack22Voice.state.active||persistBusy&&!pending){schedule();return;}if(audioClips.some(needs))rebuild();sync();},80);}
/* M3 : retard propre à la chaîne d'effets voix (compresseur 6 ms, saturation…), mesuré par une impulsion dans une chaîne identique, puis retiré du rendu : la voix traitée reste à sa place. */
async function fxLatency(cfg,sr,slot){const n=Math.round(sr*.2),ctx=new OfflineAudioContext(2,n,sr),b=ctx.createBuffer(1,n,sr),at=Math.round(sr*.01);b.getChannelData(0)[at]=.05;const src=ctx.createBufferSource(),input=ctx.createGain();src.buffer=b;let route=src;if(cfg.pan!==0){const pan=ctx.createStereoPanner();pan.pan.value=cfg.pan;route.connect(pan);route=pan;}if(cfg.drive.on&&cfg.drive.amount>0){const shaper=ctx.createWaveShaper();shaper.curve=D.driveCurve(cfg.drive.amount);shaper.oversample='2x';route.connect(shaper);route=shaper;}route.connect(input);withSeed(3100+slot,()=>buildFxChain(ctx,input,ctx.destination,{...cfg,eq:cfg.eq.on?cfg.eq:{low:0,mid:0,high:0}}));src.start(0);const y=await ctx.startRendering(),L=y.getChannelData(0),R=y.getChannelData(1);let pk=0;for(let i=0;i<n;i++)pk=Math.max(pk,Math.abs(L[i]),Math.abs(R[i]));if(!pk)return 0;for(let i=0;i<n;i++)if(Math.abs(L[i])>=pk*.25||Math.abs(R[i])>=pk*.25)return Math.max(0,Math.min(Math.round(sr*.05),i-at));return 0;}
async function rebuild(){
 if(pending)return;const token=++generation;errorText='';stop();busy(true);say('Préparation des effets et de J-Tune…');
 try{
  initAudio();await abortable(timeoutP(audio.resume(),10000,'activation audio trop longue : clique Play puis réessaie'),token);
  for(const c of audioClips.filter(needs)){
   const cfg=settings(c),signature=key(c),raw=c.buffer;
   if(raw.duration-cfg.edit.start-cfg.edit.end>180||raw.sampleRate>96000)throw Error('Traitement limité aux prises de 180 s et 96 kHz maximum.');
   const used=audioClips.filter(x=>x!==c).reduce((n,x)=>{const b=x.buffer&&x.buffer!==c.buffer?prepared(x):null;return n+(b?b.length*b.numberOfChannels*4:0);},0),estimate=Math.ceil((Math.max(.05,raw.duration-cfg.edit.start-cfg.edit.end)+D.tail(cfg))*raw.sampleRate)*8;
   if(used+estimate>256*1048576)throw Error('Limite de mémoire des copies traitées atteinte (256 Mo). Contourne des traitements ou utilise des prises plus courtes.');
   say('VOIX '+c.voice.slot+' · analyse et rendu des traitements…');
   let source=raw;
   source=await D.editBufferAsync(raw,cfg.edit,(ch,n,sr)=>audio.createBuffer(ch,n,sr),()=>new Promise(r=>setTimeout(r,0)),()=>token!==generation);
   const work=source;
   if(cfg.tune.on&&cfg.tune.amount>0){const mono=new Float32Array(work.length);for(let ch=0;ch<work.numberOfChannels;ch++){const data=work.getChannelData(ch);for(let i=0;i<mono.length;i++)mono[i]+=data[i]/work.numberOfChannels;}
    let lastPercent=-1;const r=await D.tune(mono,raw.sampleRate,cfg.tune,()=>new Promise(r=>setTimeout(r,0)),()=>token!==generation,progress=>{const percent=Math.round(progress*100);if(percent===lastPercent)return;lastPercent=percent;const text='VOIX '+c.voice.slot+' · J-Tune '+percent+' %';$l('l3Status').textContent=text;const latest=$l('feedbackLatest');if(latest){latest.textContent='Voix — '+text;latest.dataset.kind='info';}});
    source=audio.createBuffer(1,r.samples.length,raw.sampleRate);source.copyToChannel(r.samples,0);
   }
   if(token!==generation)throw Error('Traitement annulé');
   const hasFx=(cfg.deess&&cfg.deess.on&&cfg.deess.amount>0)||cfg.pan!==0||cfg.drive.on&&cfg.drive.amount>0||cfg.comp.on||cfg.reverb.on&&cfg.reverb.mix||cfg.delay.on&&cfg.delay.mix||cfg.eq.on&&[cfg.eq.low,cfg.eq.mid,cfg.eq.high].some(x=>x);
   let rendered=source;
   if(hasFx){const ctx=new OfflineAudioContext(2,Math.ceil((Math.max(.05,raw.duration-cfg.edit.start-cfg.edit.end)+D.tail(cfg))*raw.sampleRate),raw.sampleRate),src=ctx.createBufferSource(),input=ctx.createGain();src.buffer=source;let route=src;if(cfg.pan!==0){const pan=ctx.createStereoPanner();pan.pan.value=cfg.pan;route.connect(pan);route=pan;}if(cfg.drive.on&&cfg.drive.amount>0){const shaper=ctx.createWaveShaper();shaper.curve=D.driveCurve(cfg.drive.amount);shaper.oversample='2x';route.connect(shaper);route=shaper;}route.connect(input);
    withSeed(3100+c.voice.slot,()=>buildFxChain(ctx,input,ctx.destination,{...cfg,eq:cfg.eq.on?cfg.eq:{low:0,mid:0,high:0}}));src.start(0);
    rendered=await abortable(timeoutP(ctx.startRendering(),120000,'rendu des effets voix trop long'),token);
    {const lat=await fxLatency(cfg,raw.sampleRate,c.voice.slot);if(lat>0&&lat<rendered.length-1){const t=audio.createBuffer(rendered.numberOfChannels,rendered.length-lat,rendered.sampleRate);for(let ch=0;ch<rendered.numberOfChannels;ch++)t.copyToChannel(rendered.getChannelData(ch).subarray(lat),ch);rendered=t;}}
   }
   if(token!==generation||!audioClips.includes(c)||c.buffer!==raw||key(c)!==signature)throw Error('Projet modifié pendant le traitement : réessaie.');
   {let m=cache.get(raw);if(!m){m=new Map();cache.set(raw,m);}m.delete(signature);m.set(signature,rendered);while(m.size>2)m.delete(m.keys().next().value);}
   await new Promise(r=>setTimeout(r,0));
  }
  say('Traitements prêts. L’écoute et l’export WAV utilisent le même son traité. Les prises originales sont conservées.');
 }catch(e){errorText=e.message;say('Traitement non appliqué : '+e.message+' · réessaie ou active « Tout contourner » pour retrouver le son brut.');}
 finally{busy(false);sync();uiExp();if(typeof CustomEvent!=='undefined')document.dispatchEvent(new CustomEvent('jack22:processed'));}
}
async function abortable(p,token){let t;try{return await Promise.race([p,new Promise((_,rej)=>{t=setInterval(()=>{if(token!==generation)rej(Error('Traitement annulé'));},50);})]);}finally{clearInterval(t);}}
function sync(){const c=clip(slot),s=settings(c);$l('l3TrackInfo').textContent=c?'VOIX '+slot+' · source '+fmtDur(c.duration)+' · rendu '+fmtDur(window.l3Duration(c)):'Enregistre d’abord cette voix.';
 document.querySelectorAll('[data-l3]').forEach(e=>{const [a,b]=e.dataset.l3.split('.'),v=b?s[a][b]:s[a];if(e.type==='checkbox')e.checked=v;else e.value=String(v);e.disabled=!c||pending||window.Jack22Voice.state.active||persistBusy||exporting;});
 $l('l3Reset').disabled=!c||pending||persistBusy||exporting||window.Jack22Voice.state.active;$l('l3Dry').disabled=$l('l3Reset').disabled;$l('l3Dry').setAttribute('aria-pressed',String(s.bypass));
 $l('l3Dry').textContent=s.bypass?'Son brut actif · réactiver les traitements':'Original intégral · contourner traitements et découpe';
}
function change(el){const c=clip(slot);if(!c||pending||window.Jack22Voice.state.active||exporting||persistBusy){sync();return;}const s=settings(c),[a,b]=el.dataset.l3.split('.');const value=el.type==='checkbox'?el.checked:el.tagName==='SELECT'&&el.dataset.l3==='tune.scale'?el.value:Number(el.value);
 if(b)s[a][b]=value;else s[a]=value;
 try{const checked=D.validate(s);if(checked.edit.start+checked.edit.end>=c.duration-.05)throw Error('Découpe trop courte : conserve au moins 50 ms.');c.voice.processing=checked;audioKill(c);sync();uiExp();schedule();}catch(e){say(e.message);sync();}
}
$l('l3Editor').addEventListener('change',e=>{if(e.target.dataset.l3)change(e.target);});
$l('l3Slot').onchange=()=>{slot=Number($l('l3Slot').value);sync();};
$l('l3Reset').onclick=()=>{if(pending||persistBusy||exporting||window.Jack22Voice.state.active)return;const c=clip(slot);if(c&&confirm('Remettre les traitements de cette voix à zéro ? La prise originale reste intacte.')){c.voice.processing=D.defaults();audioKill(c);sync();uiExp();}};
$l('l3Dry').onclick=()=>{if(pending||persistBusy||exporting||window.Jack22Voice.state.active)return;const c=clip(slot);if(c){const s=settings(c);s.bypass=!s.bypass;c.voice.processing=s;audioKill(c);sync();schedule();uiExp();}};
$l('l3Demo').onclick=async()=>{
 if(pending||persistBusy||window.Jack22Voice.state.active||exporting)return;
 const target=[1,2,3].find(i=>!clip(i));if(!target||audioClips.length>=AUDIO_MAX_FILES){say('Il faut un emplacement voix libre pour la démo. Aucune prise remplacée.');return;}
 try{initAudio();await timeoutP(audio.resume(),10000,'activation audio trop longue : clique Play puis réessaie');const sr=22050,n=Math.round(sr*3.6),x=new Float32Array(n);
 for(let i=0;i<n;i++){const t=i/sr,part=Math.floor(t/1.2),local=t-part*1.2,f=[225,335,447][Math.min(2,part)],env=Math.min(1,local/.04,(1.2-local)/.08);x[i]=Math.max(0,env)*(.17*Math.sin(2*Math.PI*f*t)+.06*Math.sin(4*Math.PI*f*t)+.025*Math.sin(6*Math.PI*f*t));}
 const b=audio.createBuffer(1,n,sr);b.copyToChannel(x,0);const bytes=window.Jack22Voice.wavMono(x,sr),blob=new Blob([bytes],{type:'audio/wav'});
 audioClips.push({id:audioNextId++,name:'VOIX '+target+' · démo synthétique',duration:b.duration,buffer:b,startBar:0,peaks:audioPeaks(b,800),blob,type:'wav',size:blob.size,fileId:newFileId(),hash:null,stored:false,missing:false,why:null,voice:{slot:target,level:100,mute:false,latencyMs:0,trimMs:0,processing:D.defaults()}});
 slot=target;$l('l3Slot').value=String(target);setMode('song');tlBuild();sync();say('Démo synthétique ajoutée à VOIX '+target+' (ce n’est pas une voix humaine). Lance Play, puis essaie les effets et J-Tune.');
 }catch(e){say('Démo indisponible : '+e.message);}
};
$l('l3Retry').onclick=()=>{if(!pending)rebuild();};
$l('l3Cancel').onclick=()=>{if(!pending)return;++generation;say('Annulation demandée… Les prises originales sont conservées.');};
// Keep cancellation reachable from any pane, including keyboard focus.
const cancelTarget=target=>['l3Cancel','l3GlobalCancel'].includes(target?.closest('button,input,select,textarea')?.id);
if($l('l3GlobalCancel'))$l('l3GlobalCancel').onclick=()=>{if(pending){++generation;say('Annulation demandée… Les prises originales sont conservées.');}};
document.addEventListener('click',e=>{if(pending&&e.isTrusted&&!cancelTarget(e.target)){e.preventDefault();e.stopImmediatePropagation();}},true);
document.addEventListener('pointerdown',e=>{if(pending&&!cancelTarget(e.target)){e.preventDefault();e.stopImmediatePropagation();}},true);
document.addEventListener('keydown',e=>{if(pending&&e.key==='Escape'){++generation;e.preventDefault();e.stopImmediatePropagation();}else if(pending&&e.key!=='Tab'&&!(cancelTarget(e.target)&&['Enter',' '].includes(e.key))){e.preventDefault();e.stopImmediatePropagation();}},true);
new MutationObserver(()=>{sync();schedule();}).observe($('tlRows'),{childList:true});
let lastUiLock=false;
const oldVoiceTail=audioEndStep; // extended duration is already incorporated by the base duration hook.
setInterval(()=>{
 const locked=pending||window.Jack22Voice.state.active||persistBusy||exporting;if(locked!==lastUiLock){lastUiLock=locked;sync();}
 for(let i=1;i<=3;i++){const meter=$l('l3Meter'+i),a=audioPlaying.find(x=>x.c.voice?.slot===i&&x.meter);let peak=0;if(a){const b=new Float32Array(a.meter.fftSize);a.meter.getFloatTimeDomainData(b);for(const x of b)peak=Math.max(peak,Math.abs(x));}meter.value=Math.min(1,peak);$l('l3Peak'+i).textContent=peak>=.99?'Niveau élevé':peak>0?(20*Math.log10(peak)).toFixed(1)+' dBFS':'—';}

},150);
window.Jack22Lot3={rebuild,schedule,settings,prepared,sync,get pending(){return pending;},get error(){return errorText;}};
window.JACK22_BUILD='VISION8.9-ORBITE';sync();schedule();
})();

