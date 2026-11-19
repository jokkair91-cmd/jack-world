
/* M6 (Claude) : pads échantillonnés (jusqu'à 8), lignes de batterie jouées par un pad, groupes de choke, banques,
   et décroissance / maintien / début / fin pour le sampler mélodique de Production.
   Réglages enregistrés avec le projet (bloc « sampler130 »). Sans pad affecté, rien ne change : un ancien projet exporte le même WAV.
   Écoute et WAV utilisent les mêmes fonctions ; le rendu hors ligne lit une photo des réglages et des sources prise à l'export. */
(()=>{'use strict';
const $=id=>document.getElementById(id),copy=o=>JSON.parse(JSON.stringify(o)),num=(v,a,b)=>Number.isFinite(v)&&v>=a&&v<=b;
const ROWS=['KICK','SNARE','HI-HAT','CLAP'],MAXPADS=8,MAXBANKS=8;
const defaults=()=>({version:1,main:{decay:0,sustain:1,start:0,end:0},pads:[],drums:[null,null,null,null],banks:[]});
function padOk(p){return p&&typeof p.name==='string'&&p.name.trim()&&p.name.length<=40&&(p.clipId===null||Number.isInteger(p.clipId))&&num(p.gain,0,150)&&num(p.start,0,600)&&num(p.end,0,600)&&(p.end===0||p.end>p.start)&&num(p.attack,0,2)&&num(p.decay,0,5)&&num(p.sustain,0,1)&&num(p.release,0,5)&&Number.isInteger(p.choke)&&p.choke>=0&&p.choke<=4&&Number.isInteger(p.tune)&&p.tune>=-24&&p.tune<=24;}
function drumsOk(d,n){return Array.isArray(d)&&d.length===4&&d.every(x=>x===null||(Number.isInteger(x)&&x>=0&&x<n));}
function validate(v){if(v===undefined)return defaults();if(!v||v.version!==1||!v.main||!num(v.main.decay,0,5)||!num(v.main.sustain,0,1)||!num(v.main.start,0,600)||!num(v.main.end,0,600)||(v.main.end!==0&&v.main.end<=v.main.start)||!Array.isArray(v.pads)||v.pads.length>MAXPADS||!v.pads.every(padOk)||!drumsOk(v.drums,v.pads.length)||!Array.isArray(v.banks)||v.banks.length>MAXBANKS||!v.banks.every(b=>b&&typeof b.name==='string'&&b.name.trim()&&b.name.length<=40&&Array.isArray(b.pads)&&b.pads.length<=MAXPADS&&b.pads.every(padOk)&&drumsOk(b.drums,b.pads.length)))throw Error('Réglages du sampler invalides.');return copy(v);}
let cfg=defaults();
// Sauvegarde avec le projet (même chaîne que les autres réglages : sauvegarde locale, projet portable, historique).
const cap=VoiceStore.capture,par=VoiceStore.parse,set=VoiceStore.setText;
VoiceStore.capture=function(){return {...cap.call(this),sampler130:copy(cfg)};};
VoiceStore.parse=function(v){const r=par.call(this,v);if(!r)return r;try{return {...r,sampler130:validate(v.sampler130)};}catch(e){return false;}};
VoiceStore.setText=function(v){const next=validate(v?.sampler130);const r=set.call(this,v);cfg=next;return r;};
for(const k of ['applyLoaded','applyImported']){const old=VoiceStore[k];VoiceStore[k]=function(v){if(!v)cfg=defaults();return old.call(this,v);};}
// Photo pour le rendu hors ligne : réglages et sources (mêmes objets audio que l'écoute).
function snapshot(){const buffers={};for(const p of cfg.pads){const c=audioClips.find(x=>x.id===p.clipId&&x.buffer);if(c)buffers[p.clipId]=c.buffer;}return{cfg:copy(cfg),buffers};}
const cs0=currentSettings;currentSettings=function(){return {...cs0(),sampler130:snapshot()};};
const ed0=exportData;exportData=function(){const d=ed0();d.settings.sampler130=snapshot();return d;};
const ce0=createEngine;createEngine=function(ctx,S,...rest){const E=ce0.call(this,ctx,S,...rest);E.sampler130=S&&S.sampler130?S.sampler130:null;E.c130Choke={};return E;};
const live=E=>typeof audio!=='undefined'&&E.ctx===audio;
const cfgOf=E=>live(E)||!E.sampler130?cfg:E.sampler130.cfg;
const bufOf=(E,id)=>{if(live(E)||!E.sampler130)return audioClips.find(c=>c.id===id&&c.buffer)?.buffer||null;return E.sampler130.buffers[id]||null;};
window.J22SampleMain=E=>cfgOf(E).main;
// Un coup de pad : source découpée, enveloppe ADSR (maintien jusqu'à la fin de la découpe), choke dans son groupe.
function playPad(E,p,t,dest){const b=bufOf(E,p.clipId);if(!b)return false;const ctx=E.ctx,src=ctx.createBufferSource(),g=ctx.createGain(),rate=Math.pow(2,p.tune/12),s0=Math.min(p.start,Math.max(0,b.duration-.01)),e0=p.end>0?Math.min(p.end,b.duration):b.duration,len=Math.max(.01,(e0-s0)/rate),lv=p.gain/100;
 src.buffer=b;src.playbackRate.value=rate;src.connect(g);g.connect(dest);
 const a=Math.min(p.attack,len),d=Math.min(p.decay,Math.max(0,len-a)),r=Math.min(p.release,len),relAt=Math.max(t+a+d,t+len-r);
 g.gain.setValueAtTime(a>0?0:lv,t);if(a>0)g.gain.linearRampToValueAtTime(lv,t+a);if(d>0)g.gain.linearRampToValueAtTime(lv*p.sustain,t+a+d);else if(p.sustain<1)g.gain.setValueAtTime(lv*p.sustain,t+a);
 if(r>0){g.gain.setValueAtTime(lv*(d>0||p.sustain<1?p.sustain:1),relAt);g.gain.linearRampToValueAtTime(0,t+len);}
 if(p.choke>0){const ch=E.c130Choke||(E.c130Choke={}),list=ch[p.choke]||(ch[p.choke]=[]);for(const o of list)if(o.t0<t&&o.end>t){try{o.g.gain.cancelScheduledValues(t);o.g.gain.setTargetAtTime(0,t,.004);o.src.stop(t+.03);}catch(e){}o.end=t;}list.push({src,g,t0:t,end:t+len});if(list.length>32)list.splice(0,list.length-32);}
 src.start(t,s0,e0-s0);src.onended=()=>{try{g.disconnect();}catch(e){}};
 if(window.J22SamplerTrace)window.J22SamplerTrace.push({live:live(E),t,clip:p.clipId,choke:p.choke,len});
 return true;}
window.J22DrumSample=(E,r,t,dest)=>{const c=cfgOf(E),i=c.drums[r];if(i===null||i===undefined)return false;const p=c.pads[i];return p?playPad(E,p,t,dest):false;};
// Interface : Projet → « Sampler, pads et batterie… ».
const dlg=document.createElement('dialog');dlg.id='c130Dlg';dlg.innerHTML='<header><h2>Sampler, pads et batterie</h2><button type="button" id="c130Close">Fermer</button></header><div id="c130Body"></div><p id="c130Status" role="status" aria-live="polite"></p>';document.body.append(dlg);
const body=dlg.querySelector('#c130Body'),status=dlg.querySelector('#c130Status');dlg.querySelector('#c130Close').onclick=()=>dlg.close();dlg.addEventListener('keydown',e=>{if(e.code==='Space')e.stopPropagation();});
const say=t=>{status.textContent=t;};
function locked(){return state!=='stopped'||persistBusy||exporting||rec.state!=='idle'||!!window.Jack22Voice?.state.active||!!window.Jack22Lot3?.pending;}
function change(fn){if(locked())throw Error('Arrête la lecture ou attends la fin de l’opération.');const H=window.Jack22Vision8,old=copy(cfg);H?.remember();try{fn();cfg=validate(cfg);}catch(e){cfg=old;throw e;}H?.remember();}
const el=(tag,props={},kids=[])=>{const e=Object.assign(document.createElement(tag),props);e.append(...kids);return e;};
const row=parent=>{const r=el('div',{className:'c130Row'});(parent||body).append(r);return r;};
const field=(r,text,type,value,attrs={})=>{const i=el('input',{type,value:String(value),...attrs});i.setAttribute('aria-label',text);r.append(el('label',{},[document.createTextNode(text),i]));return i;};
const pick=(r,text,options,value)=>{const s=el('select');s.setAttribute('aria-label',text);for(const [v,t] of options)s.append(el('option',{value:String(v),textContent:t}));s.value=String(value);r.append(el('label',{},[document.createTextNode(text),s]));return s;};
const btn=(r,text,fn)=>{const b=el('button',{type:'button',textContent:text});b.onclick=()=>{try{const m=fn();if(typeof m==='string')say(m);}catch(e){say(e.message);}};r.append(b);return b;};
const sources=()=>audioClips.filter(c=>c.buffer).map(c=>[c.id,c.name]);
const newPad=()=>{const s=sources()[0];return{name:'Pad '+(cfg.pads.length+1),clipId:s?s[0]:null,gain:100,start:0,end:0,attack:0,decay:0,sustain:1,release:.02,choke:0,tune:0};};
function audition(p){if(locked())return;initAudio();const t=audio.currentTime+.03;if(!playPad(engine,p,t,engine.mixBus))say('Source introuvable : choisis un fichier audio importé.');}
function render(){body.replaceChildren();
 body.append(el('h3',{textContent:'Sampler mélodique (Production → Sampler)'}));
 {const r=row(),m=cfg.main,d=field(r,'Décroissance (s)','number',m.decay,{min:0,max:5,step:.01}),s=field(r,'Maintien (%)','number',Math.round(m.sustain*100),{min:0,max:100,step:1}),a=field(r,'Début dans la source (s)','number',m.start,{min:0,step:.001}),b=field(r,'Fin (s, 0 = jusqu’au bout)','number',m.end,{min:0,step:.001});
  btn(r,'Appliquer',()=>{change(()=>{cfg.main={decay:Number(d.value),sustain:Number(s.value)/100,start:Number(a.value),end:Number(b.value)};});return 'Sampler mélodique réglé (écoute et WAV). Attaque, relâchement, source et note racine restent dans Production → Sampler.';});}
 body.append(el('h3',{textContent:'Pads de la banque active ('+cfg.pads.length+'/'+MAXPADS+')'}));
 cfg.pads.forEach((p,i)=>{const r=row(),nm=field(r,'Nom','text',p.name,{maxLength:40}),src=pick(r,'Source',[['','(aucune)'],...sources()],p.clipId??''),g=field(r,'Gain %','number',p.gain,{min:0,max:150}),tu=field(r,'Accord (½ tons)','number',p.tune,{min:-24,max:24}),st=field(r,'Début (s)','number',p.start,{min:0,step:.001}),en=field(r,'Fin (s)','number',p.end,{min:0,step:.001}),at=field(r,'A','number',p.attack,{min:0,max:2,step:.001}),de=field(r,'D','number',p.decay,{min:0,max:5,step:.01}),su=field(r,'S %','number',Math.round(p.sustain*100),{min:0,max:100}),re=field(r,'R','number',p.release,{min:0,max:5,step:.01}),ch=pick(r,'Choke',[[0,'aucun'],[1,'groupe 1'],[2,'groupe 2'],[3,'groupe 3'],[4,'groupe 4']],p.choke);
  const read=()=>({name:nm.value.trim(),clipId:src.value===''?null:Number(src.value),gain:Number(g.value),tune:Number(tu.value),start:Number(st.value),end:Number(en.value),attack:Number(at.value),decay:Number(de.value),sustain:Number(su.value)/100,release:Number(re.value),choke:Number(ch.value)});
  btn(r,'Appliquer',()=>{change(()=>{cfg.pads[i]=read();});render();return 'Pad « '+cfg.pads[i].name+' » réglé.';});btn(r,'Écouter',()=>{const q=read();if(!padOk(q))throw Error('Réglages du pad invalides.');audition(q);});
  btn(r,'Supprimer',()=>{change(()=>{cfg.pads.splice(i,1);cfg.drums=cfg.drums.map(x=>x===null?null:x===i?null:x>i?x-1:x);});render();return 'Pad supprimé (les lignes de batterie qui l’utilisaient reprennent le son de synthèse).';});});
 {const r=row();btn(r,'Ajouter un pad',()=>{if(cfg.pads.length>=MAXPADS)throw Error('Maximum '+MAXPADS+' pads.');if(!sources().length)throw Error('Importe d’abord un fichier audio (ou ajoute la voix de démo).');change(()=>{cfg.pads.push(newPad());});render();return 'Pad ajouté : choisis sa source et règle-le.';});}
 body.append(el('h3',{textContent:'Batterie : son de chaque ligne'}));
 {const r=row(),sel=ROWS.map((n,k)=>pick(r,n,[['','synthé (comme avant)'],...cfg.pads.map((p,i)=>[i,p.name])],cfg.drums[k]??''));btn(r,'Appliquer',()=>{change(()=>{cfg.drums=sel.map(s=>s.value===''?null:Number(s.value));});return 'Batterie mise à jour : les lignes avec un pad jouent l’échantillon (écoute, WAV, volumes de ligne, console, swing).';});}
 body.append(el('h3',{textContent:'Banques ('+cfg.banks.length+'/'+MAXBANKS+')'}));
 {const r=row(),nm=field(r,'Nom de la banque','text','Banque '+(cfg.banks.length+1),{maxLength:40});btn(r,'Enregistrer les pads actuels comme banque',()=>{if(!nm.value.trim())throw Error('Donne un nom à la banque.');change(()=>{const i=cfg.banks.findIndex(b=>b.name===nm.value.trim()),b={name:nm.value.trim(),pads:copy(cfg.pads),drums:copy(cfg.drums)};if(i>=0)cfg.banks[i]=b;else{if(cfg.banks.length>=MAXBANKS)throw Error('Maximum '+MAXBANKS+' banques.');cfg.banks.push(b);}});render();return 'Banque enregistrée dans le projet.';});}
 cfg.banks.forEach((b,i)=>{const r=row();r.append(el('span',{textContent:b.name+' · '+b.pads.length+' pad(s)'}));btn(r,'Charger',()=>{change(()=>{cfg.pads=copy(b.pads);cfg.drums=copy(b.drums);});render();return 'Banque « '+b.name+' » chargée.';});btn(r,'Supprimer',()=>{change(()=>{cfg.banks.splice(i,1);});render();return 'Banque supprimée.';});});
 body.append(el('p',{textContent:'Les pads lisent les fichiers audio du projet (importés ou voix) : ils sont enregistrés avec lui, comme les clips. Choke : un pad coupe le pad du même groupe qui sonne encore (hi-hat ouvert / fermé). Le time-stretch (durée sans changer la hauteur) reste à venir : l’accord change la hauteur et la durée ensemble. Tout est annulable (Ctrl+Z).'}));}
function open(){render();say('');if(!dlg.open)dlg.showModal();}
const menu=document.querySelector('.dockProject .dockPopupBody');if(menu){const b=el('button',{type:'button',textContent:'Sampler, pads et batterie…'});b.onclick=()=>{const d=document.querySelector('.dockProject');if(d)d.open=false;open();};menu.append(b);}
window.JACK22_SAMPLER130={open,validate,get config(){return copy(cfg);},set:(next)=>change(()=>{cfg=validate(next);}),playPad,defaults};
})();
