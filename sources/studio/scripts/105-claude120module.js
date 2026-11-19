
(() => {
 'use strict';
 const $c=id=>document.getElementById(id);
 const el=(tag,props={},kids=[])=>{const e=document.createElement(tag);Object.assign(e,props);e.append(...kids);return e;};
 // Un seul numéro de version partout (celui de la page, posé à l'assemblage).
 const build=document.querySelector('meta[name=jack22-build]')?.content;
 if(build){window.JACK22_BUILD=build;setTimeout(()=>{window.JACK22_BUILD=build;},3000);}
 const wait=setInterval(()=>{if($c('j109Mic')&&$c('cVoices')&&$c('cCount')){clearInterval(wait);init();}},250);
 setTimeout(()=>clearInterval(wait),60000);
 function init(){
  const mic=$c('j109Mic'),voices=$c('cVoices');
  // ---------- Gauche : compte à rebours en boutons, Click et Beat ----------
  const count=$c('cCount'),countLabel=count.closest('label');countLabel?.classList.add('c120Hidden');
  const segOff=el('button',{type:'button',textContent:'Désactivé'}),segOn=el('button',{type:'button',textContent:'4 temps'});
  const setCount=v=>{if(count.checked!==v){count.checked=v;count.dispatchEvent(new Event('input',{bubbles:true}));count.dispatchEvent(new Event('change',{bubbles:true}));}syncSeg();};
  const syncSeg=()=>{segOff.setAttribute('aria-pressed',String(!count.checked));segOn.setAttribute('aria-pressed',String(count.checked));};
  segOff.addEventListener('click',()=>setCount(false));segOn.addEventListener('click',()=>setCount(true));
  const countBox=el('div',{className:'c120Count'},[el('span',{className:'c117Label',textContent:'Compte à rebours (avant enregistrement)'}),el('div',{className:'c120Seg',role:'group',ariaLabel:'Compte à rebours'},[segOff,segOn])]);
  countLabel?.parentElement?.before(countBox);syncSeg();
  // Libellés de la maquette (les cases de ChatGPT restent les mêmes).
  const relabel=(id,text)=>{const l=$c(id)?.closest('label');if(!l)return;for(const n of [...l.childNodes])if(n.nodeType===3&&n.textContent.trim())n.textContent=' '+text;};
  relabel('cMetroTake','Click (métronome) pendant la prise');relabel('cMetro','Click du décompte');relabel('cWithBeat','Beat (référence rythmique)');
  // ---------- État du micro : autorisation, actif / coupé, tester le niveau, couper ----------
  const M=window.JACK22_MIC;
  const permEl=el('span',{className:'perm ask'}),dot=el('span',{className:'dot'},[el('i'),el('span',{textContent:'Micro coupé'})]);
  const testBtn=el('button',{type:'button',textContent:'Tester le niveau',title:'Ouvre le micro choisi sans enregistrer, pour régler le niveau'});
  const stopBtn=el('button',{type:'button',textContent:'Couper le micro',title:'Referme le micro ouvert pour le test'});
  const help=el('p',{className:'help',hidden:true,textContent:'Accès refusé : clique le cadenas à gauche de l’adresse → Microphone → Autoriser, puis recharge la page. Sinon : Windows → Confidentialité → Microphone.'});
  // « Autoriser le micro » de la 11.5 ouvrait puis refermait le micro aussitôt : « Tester le niveau » fait la même demande et montre le niveau.
  [...($c('j106Input')?.querySelectorAll('button')||[])].find(b=>/Autoriser le micro/.test(b.textContent))?.classList.add('c120Hidden');
  const micBox=el('div',{id:'c120MicState',role:'group',ariaLabel:'État du micro'},[el('div',{className:'row'},[dot,el('span',{textContent:'Autorisation :'}),permEl]),el('div',{className:'row'},[testBtn,stopBtn]),help]);
  $c('j106Input')?.after(micBox);
  let perm='prompt';
  const showPerm=()=>{const txt={granted:'accordée',denied:'refusée',prompt:'à demander (clique Tester le niveau)'}[perm]||'inconnue';permEl.className='perm '+(perm==='granted'?'ok':perm==='denied'?'no':'ask');permEl.replaceChildren(el('b',{textContent:txt}));help.hidden=perm!=='denied';};
  try{navigator.permissions?.query({name:'microphone'}).then(p=>{perm=p.state;showPerm();p.onchange=()=>{perm=p.state;showPerm();};}).catch(()=>{});}catch(e){}
  showPerm();
  testBtn.addEventListener('click',async()=>{try{await M?.test();perm='granted';showPerm();say('Micro ouvert pour le test : parle ou chante, la barre de niveau bouge. Clique « Couper le micro » quand c’est réglé.');}
   catch(e){if(e&&(e.name==='NotAllowedError'||e.name==='SecurityError')){perm='denied';showPerm();say('Accès au micro refusé : voir l’aide sous le voyant.');}else say('Micro : '+(e.message||e.name));}});
  stopBtn.addEventListener('click',()=>{M?.stop();say('Micro coupé.');});
  // État de la prise à côté de REC / STOP.
  const recState=el('span',{id:'c120RecState',textContent:'Prêt'});$c('j113VoiceTransport')?.querySelector('#c117Clock')?.before(recState);
  function syncMic(){
   const on=!!M?.live,st=window.Jack22Voice?.state||{};
   dot.className='dot'+(on?' on':'');dot.lastChild.textContent=on?'Micro actif':'Micro coupé';
   testBtn.disabled=!!M?.testing||!!st.active;stopBtn.disabled=!M?.testing;
   const phase=String(st.phase||'');
   if(st.active&&/count|décompte|pre/i.test(phase)){recState.textContent='Décompte…';recState.className='count';}
   else if(st.active){recState.textContent='● Enregistrement';recState.className='rec';}
   else{recState.textContent='Prêt';recState.className='';}
  }
  // ---------- Milieu : liste « Prises & assemblage » de la voix choisie ----------
  const tabs=()=>[...document.querySelectorAll('#j109VoiceTabs button')];
  const slot=()=>{const i=tabs().findIndex(b=>b.getAttribute('aria-pressed')==='true');return i<0?1:i+1;};
  const tabName=()=>tabs()[slot()-1]?.textContent.trim()||'Lead';
  const list=el('ul',{ariaLabel:'Prises de la voix choisie'}),openTakes=()=>window.JACK22_TAKES?.open();
  const replaceBtn=el('button',{type:'button',textContent:'Remplacer sur la piste',title:'Utiliser la prise cochée sur la piste ; l’autre est gardée, muette'});
  replaceBtn.addEventListener('click',()=>{try{useTake(picked);}catch(e){say(e.message);}});
  const box=el('section',{id:'c120Takes',ariaLabel:'Prises et assemblage'},[el('h4',{textContent:'Prises & assemblage'}),list,el('div',{className:'c120Btns'},[
   Object.assign(el('button',{type:'button',textContent:'Assembler…',title:'Assembler les meilleurs passages (fenêtre Prises & assemblage)'}),{onclick:openTakes}),
   Object.assign(el('button',{type:'button',textContent:'Créer un comp…',title:'Enregistrer plusieurs passes ou une reprise ciblée (fenêtre Prises & assemblage)'}),{onclick:openTakes}),
   replaceBtn])]);
  const say=t=>{try{setStatus(t);}catch(e){}const f=$c('cVoiceFeedback');if(f)f.textContent=t;};
  let picked=null;
  // ---------- Remplacer sur la piste : la prise choisie devient la voix de la piste, l'ancienne est gardée muette ----------
  // Même méthode que la 11.5 après une prise en plusieurs passes : prise de côté = muette + réglages de voix gardés (archivedVoice).
  const copy=o=>JSON.parse(JSON.stringify(o));
  function setProduction(next){const v=VoiceStore.capture();v.production97=next;VoiceStore.setText(v);}
  function busy(){return persistBusy||exporting||(typeof rec!=='undefined'&&rec.state!=='idle')||window.Jack22Voice?.state.active||window.Jack22Lot3?.pending||(typeof state==='string'&&state!=='stopped');}
  function useTake(id){
   const n=slot(),target=audioClips.find(c=>c.id===id&&c.buffer);
   if(!target)throw Error('Coche d’abord une prise de la liste.');
   if(target.voice&&target.voice.slot===n)throw Error('Cette prise est déjà sur la piste.');
   if(busy())throw Error('Arrête la lecture ou attends la fin de l’opération en cours.');
   const A=window.JACK22_PRODUCTION,prod=A.config,arch=prod.clips?.[id]?.archivedVoice;
   if(!arch||arch.slot!==n)throw Error('Cette prise n’appartient pas à '+tabName()+'.');
   const H=window.Jack22Vision8,active=audioClips.find(c=>c.voice&&c.voice.slot===n);
   const previous=ProjectTransfer.snapshot();previous.clips=previous.clips.map(c=>({...c,voice:c.voice?copy(c.voice):null}));
   H?.remember();
   try{
    prod.clips=prod.clips||{};
    if(active){prod.clips[active.id]={...(prod.clips[active.id]||{}),mute:true,archivedVoice:copy(active.voice)};try{audioKill(active);}catch(e){}active.voice=null;}
    const rest={...prod.clips[id]};delete rest.archivedVoice;rest.mute=false;prod.clips[id]=rest;target.voice=copy(arch);
    setProduction(prod);tlBuild();window.Jack22Lot3?.sync?.();window.Jack22Lot3?.schedule();
   }catch(e){const errors=ProjectTransfer.rollback(previous);if(errors.length)e.message+=' · restauration incomplète : '+errors.join(', ');throw e;}
   H?.remember();picked=null;lastKey='';render();
   say(tabName()+' : « '+target.name+' » est maintenant sur la piste. L’ancienne prise est gardée, muette (Annuler pour revenir).');
  }
  const grid=voices.querySelector('.cVoiceGrid');(grid||voices.lastElementChild)?.after(box);
  const fmt=s=>{const m=Math.floor(s/60),r=s-m*60;return m+':'+String(Math.floor(r)).padStart(2,'0')+','+String(Math.round((r%1)*1000)).padStart(3,'0');};
  let lastKey='';
  // Prises d'une voix : la prise sur la piste (voice.slot) et les prises gardées muettes (archivedVoice.slot), dans l'ordre d'enregistrement.
  function takes(){
   const n=slot(),cfg=window.JACK22_PRODUCTION?.config?.clips||{};
   return (typeof audioClips!=='undefined'?audioClips:[]).filter(c=>c.buffer&&((c.voice&&c.voice.slot===n)||cfg[c.id]?.archivedVoice?.slot===n))
    .sort((a,b)=>a.id-b.id).map((c,i)=>({id:c.id,name:tabName()+' – Prise '+(i+1),dur:c.duration,active:!!(c.voice&&c.voice.slot===n)}));
  }
  function render(){
   const t=takes(),take=$c('c117Take');
   // Nom de la prise à côté du chrono (bloc 117) : « Lead – Prise N », sauf pendant un enregistrement.
   if(take&&!/enregistrement/.test(take.textContent))take.textContent=tabName()+' – Prise '+Math.max(1,t.length);
   if(picked!=null&&!t.some(x=>x.id===picked&&!x.active))picked=null;
   replaceBtn.disabled=picked==null;
   const key=slot()+'|'+picked+'|'+JSON.stringify(t);if(key===lastKey)return;lastKey=key;
   // Cocher une prise gardée la prépare ; « Remplacer sur la piste » l'utilise.
   list.replaceChildren(...(t.length?t.slice().reverse().map(x=>{
    const cb=el('input',{type:'checkbox',checked:x.active||x.id===picked,disabled:x.active,title:x.active?'Prise utilisée sur la piste':'Cocher pour la mettre sur la piste'});
    cb.setAttribute('aria-label',x.name);
    cb.addEventListener('change',()=>{picked=cb.checked?x.id:null;lastKey='';render();});
    const li=el('li',{className:x.active?'sel':(x.id===picked?'pick':'')},[cb,el('span',{textContent:x.name}),el('span',{className:'dur',textContent:fmt(x.dur)}),el('span',{className:'badge'+(x.active?'':' off'),textContent:'SÉLECTIONNÉE'})]);
    if(!x.active)li.addEventListener('dblclick',()=>{try{useTake(x.id);}catch(e){say(e.message);}});
    return li;
   }):[el('li',{className:'c120Empty',textContent:'Aucune prise sur '+tabName()+' : appuie sur REC.'})]));
  }
  const fb=$c('cVoiceFeedback');
  setInterval(()=>{if(!document.hidden&&voices.offsetWidth){syncSeg();render();syncMic();if(fb)fb.title=fb.textContent.trim();}},300);render();syncMic();
  // Changement d'espace : le micro de test se referme (il ne reste jamais ouvert en arrière-plan).
  setInterval(()=>{if(M?.testing&&!voices.offsetWidth)M.stop();},1000);
  window.JACK22_VOIX_MAQUETTE={version:'11.5-claude-voix-maquette',takes,useTake};
 }
})();
