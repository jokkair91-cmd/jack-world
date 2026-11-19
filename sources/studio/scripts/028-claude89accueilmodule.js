
(() => {
 'use strict';
 const stage=document.getElementById('dockStage'),body=document.body;
 if(!stage)return;
 // Studio complet affiché : mise en page 8.6 (sans le mode compact). Autres onglets et vues détaillées : mode compact de ChatGPT.
 function sync(){
  const accueil=!stage.hidden&&!stage.classList.contains('compact88StudioFocus');
  body.classList.toggle('c89Accueil',accueil);body.classList.toggle('compact88',!accueil);
 }
 new MutationObserver(sync).observe(stage,{attributes:true,attributeFilter:['hidden','class']});sync();
 // Masquer l'avertissement : depuis le menu Projet, à côté de « Afficher l'avertissement ».
 const menu=document.querySelector('.dockProject .dockPopupBody'),warn=document.getElementById('storeWarn');
 if(menu&&warn&&window.JACK22_C89){
  const hide=document.createElement('button');hide.type='button';hide.className='claude89HideWarn';hide.textContent='Masquer l’avertissement de sauvegarde';
  hide.addEventListener('click',()=>window.JACK22_C89.setWarn(false));
  const show=[...menu.querySelectorAll('button')].find(b=>/Afficher l.avertissement/.test(b.textContent));
  (show||menu.lastChild)?.before(hide);
  const syncHide=()=>{hide.hidden=warn.hidden;};new MutationObserver(syncHide).observe(warn,{attributes:true,attributeFilter:['hidden']});syncHide();
 }
 window.JACK22_ACCUEIL={version:'8.9',reference:'8.6',sync};
})();
