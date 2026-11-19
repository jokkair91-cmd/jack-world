
(() => {
 'use strict';
 const $c=id=>document.getElementById(id);
 // 1. Accueil identique : les outils de l'arrangement passent dans « Réglages ▾ » (ligne ÉDITION). Ctrl+Z / Ctrl+Y restent globaux.
 const settings=document.querySelector('#timeline .dockTimelineSettings'),tools=['j90Inspect','j90Undo','j90Redo','j90Zoom'].map($c);
 if(settings&&tools.every(Boolean)){
  const row=document.createElement('div');row.className='tl-bar claude90Edit';
  const lbl=document.createElement('span');lbl.className='tl-lbl';lbl.textContent='ÉDITION';
  row.append(lbl,...tools);settings.prepend(row);
  // Deux « 100 % » côte à côte prêtaient à confusion : le bouton devient « Taille normale ».
  const normal=[...$c('j90Zoom').querySelectorAll('button')].find(b=>b.textContent.trim()==='100 %');
  if(normal){normal.textContent='Taille normale';normal.title='Zoom de l’arrangement à 100 %';}
  $c('j90Inspect').title='Modifier le bloc ou le clip sélectionné dans l’arrangement';
 }
 // 2. Annuler / Rétablir de l'arrangement : recalculés aussi après la lecture ou une opération, pas seulement quand l'historique change.
 const locked=()=>{try{return persistBusy||exporting||rec.state!=='idle'||window.Jack22Voice.state.active||window.Jack22Lot3.pending||state!=='stopped';}catch(e){return false;}};
 function syncHistory(){const u=$c('j90Undo'),r=$c('j90Redo'),vu=$c('v8Undo'),vr=$c('v8Redo');if(!u||!r||!vu||!vr)return;const on=locked();u.disabled=on||vu.disabled;r.disabled=on||vr.disabled;}
 setInterval(()=>{if(!document.hidden)syncHistory();},400);
 document.addEventListener('click',()=>setTimeout(syncHistory,0));document.addEventListener('keyup',()=>setTimeout(syncHistory,0));syncHistory();
 // 3. Fenêtre ouverte : la barre d'espace ne lance plus la lecture derrière elle (sauf sur un bouton ou un champ de la fenêtre).
 window.addEventListener('keydown',e=>{
  if(e.code!=='Space'||!document.querySelector('dialog[open]'))return;
  const t=e.target;if(t&&(/^(INPUT|SELECT|TEXTAREA|BUTTON|SUMMARY|A)$/.test(t.tagName)||t.isContentEditable))return;
  e.preventDefault();
 },true);
 // 4. Bibliothèque : le curseur va dans le champ de recherche dès l'ouverture.
 const dialog=$c('j90Dialog');
 if(dialog)new MutationObserver(()=>{if(!dialog.open)return;setTimeout(()=>{const s=dialog.querySelector('#j90Body input[type=search]');if(s&&dialog.open&&document.activeElement!==s)s.focus();},0);}).observe(dialog,{attributes:true,attributeFilter:['open']});
 window.JACK22_C90={version:'9.0-claude',syncHistory};
})();
