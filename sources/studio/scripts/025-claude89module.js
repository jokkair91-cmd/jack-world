
(()=>{'use strict';const $=id=>document.getElementById(id),save=$('save'),warn=$('storeWarn');
// Original header, separate messages, and seven original tabs remain in place.
if(save){save.textContent='Sauvegarder';const dot=document.createElement('span');dot.className='claude89Dot';dot.textContent='●';dot.setAttribute('aria-hidden','true');save.append(dot);save.title='Enregistrer dans ce navigateur (Ctrl+S)';}
function syncDirty(){let dirty=false;try{dirty=ProjectPersistence.isDirty()}catch(e){}if(save){save.classList.toggle('claude89Dirty',dirty);save.setAttribute('aria-label',dirty?'Sauvegarder — modifications non enregistrées':'Sauvegarder')}}
setInterval(()=>{if(!document.hidden)syncDirty()},800);syncDirty();
const latest=$('feedbackLatest');if(latest){const sync=()=>latest.title=latest.textContent;new MutationObserver(sync).observe(latest,{childList:true,characterData:true,subtree:true});sync()}
// Warning remains visible initially; its optional reduction remains accessible.
const menu=document.querySelector('.dockProject .dockPopupBody');let reopen;
function setWarn(open){if(warn)warn.hidden=!open;if(reopen)reopen.hidden=open}
if(warn&&menu){const reduce=document.createElement('button');reduce.type='button';reduce.className='claude89Reduce';reduce.textContent='Réduire';reduce.addEventListener('click',()=>setWarn(false));warn.append(reduce);reopen=document.createElement('button');reopen.type='button';reopen.textContent='Afficher l’avertissement de sauvegarde';reopen.hidden=true;reopen.addEventListener('click',()=>setWarn(true));menu.append(reopen)}
if(menu){const views=document.createElement('button');views.type='button';views.textContent='Afficher les vues détaillées du Studio';views.setAttribute('aria-pressed','false');views.addEventListener('click',()=>{const on=document.body.classList.toggle('referenceViews');views.setAttribute('aria-pressed',String(on));views.textContent=on?'Masquer les vues détaillées du Studio':'Afficher les vues détaillées du Studio'});menu.append(views)}
for(const[from,to,label]of[['dockVoices','dockWords','Paroles & prompteur ›'],['dockWords','dockVoices','‹ Prises & effets voix']]){const sub=$(from)?.querySelector('.compact88Subnav');if(!sub)continue;const b=document.createElement('button');b.type='button';b.className='claude89Link';b.textContent=label;b.addEventListener('click',()=>window.JACK22_DOCK.showPane(to));sub.append(b)}
window.JACK22_C89={version:'8.9-reference',setWarn,syncDirty};
})();
