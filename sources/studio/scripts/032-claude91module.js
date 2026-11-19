
(() => {
 'use strict';
 const $c=id=>document.getElementById(id);
 // Nom de chaque note du Piano Roll, repris de son info-bulle (« E6 · 2 pas » → « E6 »).
 const grid=$c('rollGrid'),keyCol=$c('rollKeyCol');
 function label(){if(!grid)return;for(const n of grid.querySelectorAll('.rn')){const t=(n.getAttribute('title')||'').split('·')[0].trim();if(t&&n.dataset.note!==t)n.dataset.note=t;}}
 if(grid){new MutationObserver(label).observe(grid,{childList:true,subtree:true,attributes:true,attributeFilter:['title']});label();}
 // Survol de la grille : la ligne de la note pointée s'allume dans la colonne des notes.
 let lit=null;
 function light(el){if(lit===el)return;lit?.classList.remove('c91Row');lit=el;el?.classList.add('c91Row');}
 if(grid&&keyCol&&typeof rollPos==='function'&&typeof ROLL_RH==='number'){
  grid.addEventListener('pointermove',e=>{try{const{y}=rollPos(e);light(keyCol.children[Math.floor(y/ROLL_RH)]||null);}catch(x){}});
  grid.addEventListener('pointerleave',()=>light(null));
 }
 // Survol d'un pas de batterie : son numéro s'affiche dans la règle.
 const tracks=$c('tracks'),legend=document.querySelector('#dockBeat .legend');let col=null;
 function mark(el){if(col===el)return;col?.classList.remove('c91Col');col=el;el?.classList.add('c91Col');}
 if(tracks&&legend){
  tracks.addEventListener('pointerover',e=>{const s=e.target.closest('.step');if(!s){mark(null);return;}const i=[...s.parentElement.querySelectorAll('.step')].indexOf(s);mark(legend.children[i+1]||null);});
  tracks.addEventListener('pointerleave',()=>mark(null));
 }
 window.JACK22_C91={version:'9.1',label};
})();
