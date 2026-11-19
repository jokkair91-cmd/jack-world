
(() => {
 'use strict';
 const $d=id=>document.getElementById(id);
 const q=(s,root=document)=>[...root.querySelectorAll(s)];
 const paneButtons=q('[data-dock-pane]'),panes=q('.dockPane');
 let active='studio',bank='instruments',fxTab=0;
 const sectionPane={patterns:'dockComposer',recorder:'dockComposer',roll:'dockComposer',dockBeat:'dockComposer',cVoices:'dockVoices',l3Editor:'dockVoices',cWords:'dockWords',export:'dockExport',v8Edit:'dockTools',v8Mix:'dockTools',v8Sounds:'dockTools',v8Overview:'dockMore',v8Diagnostics:'dockMore',pwaPanel:'dockMore',v8Release:'dockMore'};
 function showPane(id,focus=false){
  if(id!=='studio'&&!panes.some(p=>p.id===id))return;
  active=id;$d('dockStage').hidden=id!=='studio';$d('dockDrawer').hidden=id==='studio';
  panes.forEach(p=>p.hidden=p.id!==id);paneButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.dockPane===id)));
  if(focus){const target=id==='studio'?$d('tlWrap'):$d(id).querySelector('button,input,textarea,select');target?.focus({preventScroll:true});}
 }
 paneButtons.forEach(button=>button.addEventListener('click',()=>showPane(button.dataset.dockPane)));
 q('[data-dock-close]').forEach(button=>button.addEventListener('click',()=>showPane('studio',true)));
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');if(!link)return;
  const id=link.getAttribute('href').slice(1),pane=sectionPane[id];
  if(pane){event.preventDefault();showPane(pane);$d(id)?.scrollIntoView({block:'start',behavior:'instant'});}
  else if(['timeline','mixer','synth'].includes(id)){event.preventDefault();showPane('studio');}
 });
 function selectFx(index){
  fxTab=index;q('[data-dock-fx-card]').forEach(card=>card.hidden=Number(card.dataset.dockFxCard)!==index);
  q('[data-dock-fx]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.dockFx)===index)));
 }
 q('[data-dock-fx]').forEach(button=>button.addEventListener('click',()=>selectFx(Number(button.dataset.dockFx))));
 function selectBank(value){
  bank=value;$d('dockInstrumentBank').hidden=value!=='instruments';$d('dockVoiceBank').hidden=value!=='voices';
  q('[data-dock-bank]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.dockBank===value)));syncVoices();
 }
 q('[data-dock-bank]').forEach(button=>button.addEventListener('click',()=>selectBank(button.dataset.dockBank)));
 const original=(slot,action)=>$d('cVoice'+slot)?.querySelector('[data-action="'+action+'"]');
 function sendInput(input,value){if(!input||input.disabled)return false;input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));return true;}
 q('[data-dock-voice-level]').forEach(input=>input.addEventListener('input',()=>sendInput(original(input.dataset.dockVoiceLevel,'level'),input.value)));
 q('[data-dock-voice-mute]').forEach(button=>button.addEventListener('click',()=>{const target=original(button.dataset.dockVoiceMute,'mute');if(target&&!target.disabled)target.click();syncVoices();}));
 q('[data-dock-voice-record]').forEach(button=>button.addEventListener('click',()=>{const target=original(button.dataset.dockVoiceRecord,'record');if(!target||target.disabled)return;showPane('dockVoices');target.click();}));
 function syncVoices(){
  q('[data-dock-voice-level]').forEach(input=>{const target=original(input.dataset.dockVoiceLevel,'level');if(target){input.value=target.value;input.disabled=target.disabled;$d('dockVoiceValue'+input.dataset.dockVoiceLevel).textContent=target.disabled?'—':target.value+' %';}});
  q('[data-dock-voice-mute]').forEach(button=>{const target=original(button.dataset.dockVoiceMute,'mute');if(target){button.disabled=target.disabled;button.setAttribute('aria-pressed',target.getAttribute('aria-pressed')||'false');}});
  q('[data-dock-voice-record]').forEach(button=>{const target=original(button.dataset.dockVoiceRecord,'record');button.disabled=!target||target.disabled;});
 }
 const colors=['#d0a054','#a088cf','#6cb89c','#66afc1','#8096ce','#bd89b0'];
 function enhanceRows(){
  const rows=q('#tlRows>.tl-row');let voices=new Set();
  rows.forEach(row=>{
   const label=row.querySelector('.tl-label'),lane=row.querySelector('.tl-lane');if(!label||!lane)return;
   const title=label.querySelector('b')?.textContent||'';const match=title.match(/^VOIX\s+(\d)/);const ti=lane.dataset.ti;
   const slot=match?Number(match[1]):0;if(slot)voices.add(slot);
   if(title==='AUDIO')row.classList.toggle('dockEmptyAudio',!lane.querySelector('.tl-aud'));
   const color=colors[slot?slot+2:ti!==undefined?Number(ti):3];label.style.borderLeft='3px solid '+color;
   if(label.querySelector('.dockRowMute'))return;
   const button=document.createElement('button');button.type='button';button.className='dockRowMute';button.textContent='M';button.setAttribute('aria-label','Mute '+title);
   function target(){
    {const hook=window.J22RowSource&&window.J22RowSource(row);if(hook)return hook;}if(slot)return original(slot,'mute');
    if(ti!==undefined)return document.querySelector('.mute[data-track-key="'+((typeof song!=='undefined'&&song.tracks[Number(ti)])||{}).key+'"]');
    return $d('audioMute');
   }
   const source=target();button.disabled=!source||source.disabled;button.setAttribute('aria-pressed',source?.getAttribute('aria-pressed')||'false');
   button.addEventListener('click',event=>{event.stopPropagation();const control=target();if(control&&!control.disabled)control.click();});label.append(button);
  });
  for(let slot=1;slot<=3;slot++){
   if(voices.has(slot)||$d('dockEmptyVoice'+slot))continue;
   const row=document.createElement('div');row.className='tl-row dockEmptyVoice';row.id='dockEmptyVoice'+slot;
   const label=document.createElement('div');label.className='tl-label';label.style.borderLeft='3px solid '+colors[slot+2];
   const name=document.createElement('b');name.textContent='VOIX '+slot;
   const button=document.createElement('button');button.type='button';button.textContent='Prise voix';button.addEventListener('click',()=>{showPane('dockVoices');original(slot,'record')?.focus();});
   const lane=document.createElement('div');lane.className='tl-lane';lane.style.width=(document.querySelector('#tlRows .tl-lane')?.style.width||'3584px');
   label.append(name,button);row.append(label,lane);$d('tlRows').append(row);
  }
 }
 let rowPending=false;
 const observer=new MutationObserver(()=>{if(rowPending)return;rowPending=true;queueMicrotask(()=>{rowPending=false;enhanceRows();});});
 observer.observe($d('tlRows'),{childList:true});enhanceRows();
 // Preset planets are shortcuts for the existing sound selector, not new engines.
 q('[data-dock-preset]').forEach(button=>button.addEventListener('click',()=>{
  const input=$d('preset');if(input.disabled)return;
  input.value=button.dataset.dockPreset;input.dispatchEvent(new Event('change',{bubbles:true}));sync();
 }));
 function syncEq(){
  const vals=['fxLow','fxMid','fxHigh'].map(id=>Number($d(id)?.value)||0);
  ['dockEqLow','dockEqMid','dockEqHigh'].forEach((id,i)=>$d(id)?.setAttribute('cy',String(60-vals[i]*3)));
  $d('dockEqCurve')?.setAttribute('d','M0 '+(60-vals[0]*3)+' Q75 '+(60-vals[0]*3)+' 150 '+(60-vals[1]*3)+' T300 '+(60-vals[2]*3));
 }
 function sync(){
  const value=$d('preset')?.value;q('[data-dock-preset]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.dockPreset===value)));
  if(bank==='voices')syncVoices();syncEq();
 }
 document.addEventListener('input',sync);document.addEventListener('change',sync);
 let timer=setInterval(()=>{if(!document.hidden)sync();},300);
 window.addEventListener('pagehide',()=>{clearInterval(timer);timer=null;});
 window.addEventListener('pageshow',()=>{if(timer===null)timer=setInterval(()=>{if(!document.hidden)sync();},300);});
 window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(sectionPane[id])showPane(sectionPane[id]);});
 // L'accueil affiche toujours le Studio complet, même si l'URL contient une ancienne ancre.
 showPane('studio');
 sync();window.JACK22_DOCK={version:'8.9-ORBITE',showPane,selectFx,selectBank,syncVoices,syncEq,enhanceRows,sendInput,get active(){return active},get bank(){return bank},get fxTab(){return fxTab}};
})();

