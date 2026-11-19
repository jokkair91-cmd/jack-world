
(() => {
 'use strict';
 const $c=id=>document.getElementById(id);
 const typing=el=>!!el&&(/^(INPUT|SELECT|TEXTAREA|BUTTON|SUMMARY|A)$/.test(el.tagName)||el.isContentEditable);
 // Raccourcis : Espace = Play / Pause, Ctrl+S = Sauvegarder. Jamais pendant la saisie ni sur un bouton focalisé.
 document.addEventListener('keydown',event=>{
  if(event.defaultPrevented)return;
  if((event.ctrlKey||event.metaKey)&&!event.altKey&&!event.shiftKey&&event.key.toLowerCase()==='s'){event.preventDefault();const save=$c('save');if(save&&!save.disabled)save.click();return;}
  if(event.code!=='Space'||event.repeat||event.ctrlKey||event.altKey||event.metaKey||typing(document.activeElement))return;
  const play=$c('play');if(!play||play.disabled)return;event.preventDefault();play.click();
 });
 // Les raccourcis sont annoncés au survol, sans ajouter d'élément à l'interface.
 const tips={play:'Lecture / pause (barre d’espace)',stop:'Arrêter et revenir au début',save:'Enregistrer dans ce navigateur (Ctrl+S)'};
 for(const[id,tip]of Object.entries(tips)){const el=$c(id);if(el&&!el.title)el.title=tip;}
 // Sampler : touches désactivées tant qu'aucune source n'est disponible.
 const sample=$c('v8Sample'),keys=[...document.querySelectorAll('[data-sample-note]')];
 if(sample&&keys.length){
  const hint=document.createElement('p');hint.className='claude88SampleHint';hint.textContent='Importe un son (Importer audio) ou ajoute une voix de démo pour jouer du sampler.';
  keys[0].parentElement.after(hint);
  const sync=()=>{const empty=!sample.options.length;keys.forEach(k=>{k.disabled=empty;});hint.hidden=!empty;};
  new MutationObserver(sync).observe(sample,{childList:true});sync();
 }
 window.JACK22_EASE={version:'8.9',by:'Claude'};
})();
