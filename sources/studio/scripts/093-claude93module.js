
(() => {
 'use strict';
 const $c=id=>document.getElementById(id),D=window.Jack22Lot3DSP;
 if(!D||typeof buildFxChain!=='function')return;
 const num=(v,lo,hi)=>typeof v==='number'&&isFinite(v)&&v>=lo&&v<=hi;

 // ---------- De-esser (voix) : présent dans les réglages d'une voix seulement s'il est actif ----------
 const vValidate=D.validate,vDefaults=D.defaults,vActive=D.active;
 D.validate=s=>{
  let de;if(s&&typeof s==='object'&&s.deess!==undefined){de=s.deess;if(!de||typeof de!=='object'||typeof de.on!=='boolean'||!num(de.amount,0,100)||!num(de.freq,3000,12000))throw Error('De-esser invalide');}
  const out=vValidate(s);delete out.deess;if(de&&de.on)out.deess={on:true,amount:de.amount,freq:de.freq};return out;
 };
 D.active=s=>vActive(s)||(!!s&&!s.bypass&&!!s.deess&&s.deess.on&&s.deess.amount>0);
 const DEESS={on:false,amount:50,freq:6500};
 // Séparation en deux bandes (Linkwitz-Riley 4e ordre : somme à plat) ; seule la bande aiguë est compressée.
 function deesser(ctx,input,output,d){
  const bq=(type,f)=>{const b=ctx.createBiquadFilter();b.type=type;b.frequency.value=f;b.Q.value=Math.SQRT1_2;return b;};
  const l1=bq('lowpass',d.freq),l2=bq('lowpass',d.freq),h1=bq('highpass',d.freq),h2=bq('highpass',d.freq);
  const c=ctx.createDynamicsCompressor(),mk=ctx.createGain();
  const thr=-12-0.3*d.amount,ratio=4+0.08*d.amount;
  c.threshold.value=thr;c.ratio.value=ratio;c.knee.value=3;c.attack.value=0.001;c.release.value=0.06;mk.gain.value=1/compMakeup(thr,ratio,3);
  input.connect(l1);l1.connect(l2);l2.connect(output);input.connect(h1);h1.connect(h2);h2.connect(c);c.connect(mk);mk.connect(output);
 }

 // ---------- Limiteur (master) : éteint, le son passe par un chemin direct et reste identique ----------
 let LIMIT={on:false,ceiling:-1,drive:0};
 const live=new Set();
 function limiter(ctx,input,output){
  const G=v=>{const g=ctx.createGain();g.gain.value=v;return g;},dry=G(1),wet=G(0),drive=G(1),c=ctx.createDynamicsCompressor(),mk=G(1);
  c.knee.value=0;c.ratio.value=20;c.attack.value=0.002;c.release.value=0.08;
  input.connect(dry);dry.connect(output);input.connect(drive);drive.connect(c);c.connect(mk);mk.connect(wet);wet.connect(output);
  return(st,instant)=>{const put=(p,v)=>{if(instant)p.value=v;else p.setTargetAtTime(v,ctx.currentTime,0.02);};
   put(c.threshold,st.ceiling);put(drive.gain,Math.pow(10,st.drive/20));put(mk.gain,1/compMakeup(st.ceiling,20,0));put(dry.gain,st.on?0:1);put(wet.gain,st.on?1:0);};
 }
 const baseChain=buildFxChain;
 buildFxChain=function(ctx,input,output,init){
  if(init&&Object.prototype.hasOwnProperty.call(init,'bypass')){              // chaîne d'une voix
   const d=init.deess;if(d&&d.on&&d.amount>0){const mid=ctx.createGain();deesser(ctx,input,mid,d);return baseChain.call(this,ctx,mid,output,init);}
   return baseChain.call(this,ctx,input,output,init);
  }
  const pre=ctx.createGain(),chain=baseChain.call(this,ctx,input,pre,init),set=limiter(ctx,pre,output);   // chaîne master
  set(LIMIT,true);chain.setLimit=st=>set(st,false);
  if(typeof OfflineAudioContext==='undefined'||!(ctx instanceof OfflineAudioContext))live.add({ctx,chain});
  return chain;
 };
 function setLimit(st){LIMIT=Object.assign({},LIMIT,st);for(const l of [...live]){if(l.ctx.state==='closed'){live.delete(l);continue;}try{l.chain.setLimit(LIMIT);}catch(e){}}syncPanel();}
 // Sauvegarde : bloc « limit » ajouté aux effets master (ignoré sans danger par les versions précédentes).
 const baseSave=currentFxSave,baseParse=parseFxSave,baseApply=applyFxSave;
 currentFxSave=function(){const f=baseSave.apply(this,arguments);if(LIMIT.on||LIMIT.drive||LIMIT.ceiling!==-1)f.limit={on:LIMIT.on,ceiling:LIMIT.ceiling,drive:LIMIT.drive};return f;};
 parseFxSave=function(f){const out=baseParse.apply(this,arguments);if(out&&f&&f.limit!==undefined){const l=f.limit;if(!l||typeof l.on!=='boolean'||!num(l.ceiling,-12,0)||!num(l.drive,0,12))return null;out.limit={on:l.on,ceiling:l.ceiling,drive:l.drive};}return out;};
 applyFxSave=function(fx){const r=baseApply.apply(this,arguments);setLimit(fx&&fx.limit?fx.limit:{on:false,ceiling:-1,drive:0});return r;};

 // ---------- Packs ----------
 const H=window.Jack22Vision8,remember=()=>{try{H?.remember();}catch(e){}};
 const say=t=>{const s=$c('c93Status');if(s)s.textContent=t;try{setStatus(t);}catch(e){}};
 const WARLICK={
  neutre:{label:'Neutre',eq:{low:0,mid:0,high:0},comp:{on:false},limit:{on:false,ceiling:-1,drive:0}},
  mix:{label:'Mix',eq:{low:1,mid:0,high:1},comp:{on:true,thr:-18,ratio:2,attack:20,release:200,makeup:1},limit:{on:false,ceiling:-1,drive:0}},
  master:{label:'Master',eq:{low:2,mid:-1,high:2},comp:{on:true,thr:-14,ratio:2,attack:30,release:250,makeup:2},limit:{on:true,ceiling:-1,drive:3}},
  afro:{label:'Master afro',eq:{low:2,mid:0,high:2},comp:{on:true,thr:-16,ratio:2.5,attack:25,release:180,makeup:2},limit:{on:true,ceiling:-1,drive:2}}
 };
 const SHIRE={
  rap:{label:'Rap',eq:{on:true,low:-2,mid:1,high:3},comp:{on:true,thr:-20,ratio:4,attack:5,release:120,makeup:3},deess:{on:true,amount:60,freq:6500},reverb:{on:true,mix:8,decay:0.8},delay:{on:false,time:0.25,fb:25,mix:15}},
  chant:{label:'Chant',eq:{on:true,low:-1,mid:0,high:2},comp:{on:true,thr:-18,ratio:3,attack:10,release:250,makeup:2},deess:{on:true,amount:45,freq:7000},reverb:{on:true,mix:18,decay:1.6},delay:{on:true,time:0.25,fb:20,mix:10}},
  afro:{label:'Afro',eq:{on:true,low:-2,mid:2,high:3},comp:{on:true,thr:-22,ratio:4,attack:8,release:150,makeup:3},deess:{on:true,amount:55,freq:6500},reverb:{on:true,mix:14,decay:1.2},delay:{on:true,time:0.18,fb:15,mix:12}}
 };
 const HARDY={
  equilibre:{label:'Équilibré',mix:{mixKick:100,mixSnare:85,mixHat:65,mixClap:75,mixSynth:80}},
  basses:{label:'Basses en avant',mix:{mixKick:100,mixSnare:75,mixHat:55,mixClap:65,mixSynth:90}},
  afro:{label:'Percussions afro',mix:{mixKick:90,mixSnare:70,mixHat:85,mixClap:85,mixSynth:75}}
 };
 function applyWarlick(key){
  const p=WARLICK[key];if(!p)return;remember();
  const f=parseFxSave(currentFxSave())||{};
  f.eq=Object.assign({},f.eq,p.eq);f.comp=Object.assign({},f.comp,p.comp);f.limit=Object.assign({},p.limit);
  applyFxSave(f);remember();say('Warlick « '+p.label+' » appliqué au master (écoute et export). Ctrl+Z pour revenir.');
 }
 const voiceClip=()=>audioClips.find(c=>c.voice&&c.voice.slot===Number($c('l3Slot')?.value||1));
 function voiceBusy(){return window.Jack22Lot3?.pending||window.Jack22Voice?.state.active||persistBusy||exporting;}
 function setVoice(c,s){const checked=D.validate(s);if(checked.edit.start+checked.edit.end>=c.duration-.05)throw Error('Découpe trop courte.');c.voice.processing=checked;try{audioKill(c);}catch(e){}window.Jack22Lot3?.sync();window.Jack22Lot3?.schedule();}
 function applyShire(key){
  const p=SHIRE[key],c=voiceClip();if(!p)return;
  if(!c)return say('Shire : sélectionne d’abord une voix enregistrée (Voix → Effets voix → Piste).');
  if(voiceBusy())return say('Shire : attends la fin de l’opération en cours.');
  remember();const s=window.Jack22Lot3.settings(c);
  try{setVoice(c,Object.assign({},s,{bypass:false,eq:p.eq,comp:p.comp,reverb:p.reverb,delay:p.delay,deess:p.deess}));}catch(e){return say('Shire : '+e.message);}
  remember();say('Shire « '+p.label+' » appliqué à VOIX '+c.voice.slot+' (J-Tune, découpe et panoramique conservés). Calcul en cours…');
 }
 function applyHardy(key){
  const p=HARDY[key];if(!p)return;remember();
  for(const[id,v]of Object.entries(p.mix)){const el=$c(id);if(!el)continue;el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}
  let extra='';try{extra=window.JACK22_PACKS_HOOKS?.hardy?.(key)||'';}catch(e){extra=' '+e.message;}
  remember();say('Hardy Bay « '+p.label+' » appliqué au mixeur.'+extra);
 }

 // Panneau Packs (onglet Outils ; fenêtre « Packs » du mode Pro).
 const panel=document.createElement('section');panel.className='panel';panel.id='c93Packs';panel.setAttribute('aria-label','Packs');
 const h2=document.createElement('h2');h2.textContent='PACKS JACK22';panel.append(h2);
 const block=(title,sub)=>{const b=document.createElement('div');b.className='c93Pack';const t=document.createElement('h3');t.textContent=title;const s=document.createElement('p');s.className='c93Sub';s.textContent=sub;b.append(t,s);panel.append(b);return b;};
 const row=parent=>{const r=document.createElement('div');r.className='c93Row';parent.append(r);return r;};
 const btn=(parent,text,fn,attrs={})=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',fn);for(const[k,v]of Object.entries(attrs))b.setAttribute(k,v);parent.append(b);return b;};
 const field=(parent,label,attrs)=>{const l=document.createElement('label');l.textContent=label;const i=document.createElement('input');for(const[k,v]of Object.entries(attrs))i.setAttribute(k,v);l.append(i);parent.append(l);return i;};
 const w=block('WARLICK · MIXAGE & MASTERING','Pour tout le morceau : égaliseur et compresseur master, limiteur pour sonner fort sans saturer.');
 const wr=row(w);for(const[k,p]of Object.entries(WARLICK))btn(wr,p.label,()=>applyWarlick(k),{'data-c93-warlick':k});
 const lr=row(w);const limOn=field(lr,'Limiteur actif',{type:'checkbox',id:'c93LimOn'}),limCeil=field(lr,'Plafond (dB)',{type:'number',id:'c93LimCeil',min:'-12',max:'0',step:'0.5'}),limDrive=field(lr,'Gain d’entrée (dB)',{type:'number',id:'c93LimDrive',min:'0',max:'12',step:'0.5'});
 const limChange=()=>{const ceiling=Number(limCeil.value),drive=Number(limDrive.value);if(!num(ceiling,-12,0)||!num(drive,0,12)){syncPanel();return say('Limiteur : plafond de −12 à 0 dB, gain de 0 à 12 dB.');}remember();setLimit({on:limOn.checked,ceiling,drive});remember();say('Limiteur '+(limOn.checked?'actif, plafond '+ceiling+' dB':'désactivé')+'.');};
 [limOn,limCeil,limDrive].forEach(i=>i.addEventListener('change',limChange));
 const wn=document.createElement('p');wn.className='c93Note';wn.textContent='« Neutre » remet l’égaliseur à zéro et coupe compresseur et limiteur. Réverb et delay master ne sont pas touchés.';w.append(wn);
 const sh=block('SHIRE · VOIX','Chaîne voix complète : égaliseur, compresseur, de-esser, réverb, delay. Appliquée à la voix choisie dans Voix → Effets voix.');
 const sr=row(sh);for(const[k,p]of Object.entries(SHIRE))btn(sr,p.label,()=>applyShire(k),{'data-c93-shire':k});
 const target=document.createElement('p');target.className='c93Note';target.id='c93ShireTarget';sh.append(target);
 const hb=block('HARDY BAY · INSTRUMENTS','Dosage du mixeur : batterie (Kick, Snare, Hi-hat, Clap) et synthé (mélodie, basse, 808).');
 const hr=row(hb);for(const[k,p]of Object.entries(HARDY))btn(hr,p.label,()=>applyHardy(k),{'data-c93-hardy':k});
 const hn=document.createElement('p');hn.className='c93Note';hn.textContent='Volumes seulement : un égaliseur par instrument viendra plus tard.';hb.append(hn);
 const st=document.createElement('p');st.id='c93Status';st.setAttribute('role','status');st.setAttribute('aria-live','polite');panel.append(st);
 const tools=$c('dockTools'),grid=tools?.querySelector('.compact88Grid');
 if(grid){grid.prepend(panel);const sub=tools.querySelector('.compact88Subnav');if(sub){const b=document.createElement('button');b.type='button';b.dataset.c88View='packs';b.dataset.c88Targets='c93Packs';b.setAttribute('aria-pressed','false');b.textContent='Packs';b.addEventListener('click',()=>window.JACK22_COMPACT?.choose(tools,'packs'));const after=sub.querySelector('[data-c88-view="all"]');after?after.after(b):sub.append(b);}}

 // De-esser dans Voix → Effets voix (onglet « De-esser » à côté de J-Tune).
 const l3grid=document.querySelector('#l3Editor .l3Grid');let de=null;
 if(l3grid){
  de=document.createElement('fieldset');de.id='c93Deess';const lg=document.createElement('legend');lg.textContent='De-esser';de.append(lg);
  const on=field(de,'De-esser actif',{type:'checkbox','data-c93-deess':'on'}),amt=field(de,'Intensité (%)',{type:'number','data-c93-deess':'amount',min:'0',max:'100',step:'1'}),fq=field(de,'Fréquence (Hz)',{type:'number','data-c93-deess':'freq',min:'3000',max:'12000',step:'100'});
  const p=document.createElement('p');p.className='cFine';p.textContent='Adoucit les « s », « ch » et « z » trop sifflants : seuls les aigus au-dessus de la fréquence choisie sont compressés quand ils dépassent.';de.append(p);
  const tabs=document.querySelector('#l3Editor .compact88FxTabs');if(tabs){const n=String(tabs.querySelectorAll('[data-c88-fx]').length);de.dataset.c88FxCard=n;de.hidden=true;const b=document.createElement('button');b.type='button';b.dataset.c88Fx=n;b.setAttribute('aria-pressed','false');b.textContent='De-esser';b.addEventListener('click',()=>window.JACK22_COMPACT?.fx(Number(n)));tabs.append(b);}
  l3grid.append(de);
  const change=()=>{const c=voiceClip();if(!c||voiceBusy()){syncDeess();return;}const a=Number(amt.value),f=Number(fq.value);if(!num(a,0,100)||!num(f,3000,12000)){say('De-esser : intensité de 0 à 100 %, fréquence de 3000 à 12000 Hz.');syncDeess();return;}
   remember();const s=window.Jack22Lot3.settings(c);s.deess={on:on.checked,amount:a,freq:f};if(!on.checked)delete s.deess;
   try{setVoice(c,s);}catch(e){say(e.message);}remember();syncDeess();};
  [on,amt,fq].forEach(i=>i.addEventListener('change',e=>{e.stopPropagation();change();}));
 }
 function syncDeess(){if(!de)return;const c=voiceClip(),s=c?window.Jack22Lot3.settings(c):null,d=s?.deess||DEESS,ref=document.querySelector('[data-l3="eq.on"]');
  for(const i of de.querySelectorAll('[data-c93-deess]')){const k=i.dataset.c93Deess;if(i.type==='checkbox')i.checked=!!(s?.deess?.on);else if(document.activeElement!==i)i.value=String(d[k]);i.disabled=!c||!!ref?.disabled;}}
 function syncPanel(){
  const limOnEl=$c('c93LimOn');if(limOnEl){limOnEl.checked=LIMIT.on;if(document.activeElement!==$c('c93LimCeil'))$c('c93LimCeil').value=String(LIMIT.ceiling);if(document.activeElement!==$c('c93LimDrive'))$c('c93LimDrive').value=String(LIMIT.drive);}
  const c=voiceClip(),t=$c('c93ShireTarget');if(t)t.textContent=c?'Voix choisie : VOIX '+c.voice.slot+(c.name?' · '+c.name:''):'Aucune voix enregistrée sur la piste choisie : enregistre une prise ou ajoute la voix de démo.';
  document.querySelectorAll('[data-c93-shire]').forEach(b=>b.disabled=!c);
 }
 $c('l3Slot')?.addEventListener('change',()=>{syncDeess();syncPanel();});
 document.addEventListener('jack22:processed',()=>{syncDeess();syncPanel();});
 setInterval(()=>{if(!document.hidden){syncDeess();syncPanel();}},600);syncDeess();syncPanel();
 window.JACK22_PACKS={version:'9.3',WARLICK,SHIRE,HARDY,applyWarlick,applyShire,applyHardy,setLimit,get limit(){return Object.assign({},LIMIT);}};
})();
