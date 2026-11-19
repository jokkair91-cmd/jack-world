
(() => {
 'use strict';
 const $c=id=>document.getElementById(id),stage=$c('dockStage');if(!stage)return;
 const el=(tag,props={},kids=[])=>{const e=document.createElement(tag);Object.assign(e,props);e.append(...kids);return e;};
 const W=()=>window.JACK22_WORKSPACE;

 // ---------- Barre de transport en bas (comme la maquette) : relais des vrais boutons du studio ----------
 const bar=el('div',{id:'c119Bar',role:'toolbar',ariaLabel:'Transport'});
 const btn=(txt,label,fn,cls='c119Btn')=>{const b=el('button',{type:'button',className:cls,textContent:txt,title:label});b.setAttribute('aria-label',label);b.addEventListener('click',fn);return b;};
 const restart=btn('⏮','Retour au début',()=>{const r=[...document.querySelectorAll('#roll button')].find(b=>(b.title||b.textContent).trim()==='Retour au début');if(r)r.click();else{$c('stop')?.click();}});
 const play=btn('▶','Lecture / pause (Espace)',()=>$c('play')?.click());
 const stop=btn('■','Stop',()=>$c('stop')?.click());
 const rec=btn('●','Enregistrer une prise de notes au synthé',()=>$c('recRec')?.click(),'c119Btn c119Rec');
 const loop=btn('⟲ Boucle','Boucle : rejouer le pattern en continu (mode PATTERN)',()=>{const p=$c('modePattern'),s=$c('modeSong');(loopOn()?s:p)?.click();},'c119Toggle');
 const loopOn=()=>typeof playMode==='string'?playMode==='pattern':$c('modePattern')?.getAttribute('aria-pressed')==='true';
 const pos=el('div',{id:'c119Pos',textContent:'1.1.1.000',title:'Position : mesure . temps . double-croche'});
 const tempo=el('input',{type:'number',min:'40',max:'240',step:'1',ariaLabel:'Tempo'});
 tempo.addEventListener('change',()=>{const o=$c('bpm');if(!o)return;o.value=tempo.value;o.dispatchEvent(new Event('input',{bubbles:true}));o.dispatchEvent(new Event('change',{bubbles:true}));});
 const sig=el('select',{ariaLabel:'Signature',title:'Le studio compte en 4/4'},[el('option',{value:'4/4',textContent:'4 / 4'})]);
 const save=btn('Sauvegarder','Sauvegarder (Ctrl+S)',()=>$c('save')?.click(),'c119Toggle c119Save');
 const sep=()=>el('span',{className:'c119Sep',ariaHidden:'true'});
 // « Grand Piano Roll » (bloc 118) : ici dans la barre du bas, visible dans le Piano Roll.
 const big=btn('⤢ Grand Piano Roll','Replier le clavier du bas pour agrandir la grille',()=>window.JACK22_ECRAN?.setBig(!document.body.classList.contains('c118Big')),'c119Toggle');big.id='c119Big';
 bar.append(restart,play,stop,rec,loop,sep(),pos,sep(),el('label',{},['Tempo :',tempo]),el('label',{},['Signature :',sig]),big,save);
 document.body.append(bar);
 function syncBar(){
  const playing=/pause/i.test($c('play')?.textContent||'');play.textContent=playing?'❚❚':'▶';
  const r=$c('recRec');rec.disabled=!r||r.disabled;rec.style.opacity=rec.disabled?.4:1;
  loop.setAttribute('aria-pressed',String(loopOn()));
  if(document.activeElement!==tempo&&$c('bpm'))tempo.value=$c('bpm').value;
  save.textContent=/●/.test($c('save')?.textContent||'')?'Sauvegarder ●':'Sauvegarder';
  document.body.classList.toggle('c119Notes',stage.classList.contains('j108Notes'));
  const isBig=document.body.classList.contains('c118Big');big.textContent=isBig?'⤡ Afficher le clavier':'⤢ Grand Piano Roll';big.setAttribute('aria-pressed',String(isBig));
  // Position de lecture : mesure . temps . double-croche (16 pas par mesure).
  let s=0;try{if(typeof state==='string'&&state!=='stopped'&&typeof absStep==='number')s=Math.max(0,absStep-1);}catch(e){}
  pos.textContent=(Math.floor(s/16)+1)+'.'+(Math.floor(s%16/4)+1)+'.'+(s%4+1)+'.000';
 }

 // ---------- En-tête « Composition » : titre + bascule Batterie / Piano Roll ----------
 const head=el('span',{id:'c119Head'}),segBeat=el('button',{type:'button',textContent:'▦ Batterie'}),segRoll=el('button',{type:'button',textContent:'▥ Piano Roll'});
 segBeat.addEventListener('click',()=>W()?.choose('compose','beat'));segRoll.addEventListener('click',()=>W()?.choose('compose','roll'));
 head.append(el('strong',{textContent:'Composition'}),el('span',{className:'c119Seg'},[segBeat,segRoll]));
 document.addEventListener('j105view',e=>{
  const d=e.detail||{},ed=$c('j105EditorBar');
  if(ed&&head.parentElement!==ed)ed.prepend(head);
  segBeat.setAttribute('aria-pressed',String(d.group==='compose'&&d.view==='beat'));segRoll.setAttribute('aria-pressed',String(d.group==='compose'&&d.view==='roll'));
  // Panneau Samples : fermé au départ pour laisser toute la place au Piano Roll (demande de Bob) ; le bouton « Samples » l'ouvre,
  // et s'il l'ouvre lui-même, il reste ouvert aux passages suivants.
  if(d.group==='compose'&&d.view==='roll'){let closed=true;try{closed=localStorage.getItem('jack22.samples.ferme')!=='0';}catch(x){}
   const lib=$c('j93Library'),b=$c('j111Samples')||[...document.querySelectorAll('#j93Nav button')].find(x=>x.textContent.trim()==='Samples');
   if(!closed&&b&&!(lib&&lib.offsetWidth))setTimeout(()=>{if(!($c('j93Library')?.offsetWidth))b.click();},0);}
 });
 document.addEventListener('click',e=>{const b=e.target instanceof Element&&e.target.closest('#j93Nav button');if(!b||b.textContent.trim()!=='Samples'||!e.isTrusted)return;
  setTimeout(()=>{try{localStorage.setItem('jack22.samples.ferme',$c('j93Library')?.offsetWidth?'0':'1');}catch(x){}},50);},true);

 // ---------- Barre « Clavier » : libellé « Preset : » devant le choix du son ----------
 const preset=$c('preset');if(preset&&!preset.previousElementSibling?.classList?.contains('c119Lbl'))preset.before(el('span',{className:'c119Lbl',textContent:'Preset :'}));

 // Boutons « Lecture du pattern » et « Retour au début » : doublons de ▶ et ⏮ en bas, masqués (toujours utilisés par ⏮).
 const markDup=()=>{for(const b of document.querySelectorAll('#roll .roll-bar button')){const t=(b.title||b.textContent).trim();if(/^(Lecture du pattern|Retour au début|Pause du pattern)/.test(t)||/^(▶ Pattern|⏮ Début)$/.test(b.textContent.trim()))b.classList.add('c119Dup');}};
 setInterval(()=>{if(!document.hidden&&document.body.classList.contains('c118Compact')){syncBar();markDup();}},100);
 window.JACK22_MAQUETTE={version:'11.5-claude-maquette'};
})();
