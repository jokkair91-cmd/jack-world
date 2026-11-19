
(()=>{'use strict';const W=window.JACK22_WORKSPACE;if(!W)return;function sync(){const on=W.on&&W.group==='compose'&&W.view==='roll';document.body.classList.toggle('j107Instrument',on);const patternBar=document.getElementById('j105EditorBar');if(patternBar)patternBar.setAttribute('aria-label',on?'Jouer et enregistrer au clavier':'Piano Roll, batterie et patterns');}
document.addEventListener('j105view',sync);new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});sync();
// Library choice edits the active pattern sound in the Piano Roll; in the
// performance room it continues to select the live keyboard's preset.
document.addEventListener('click',e=>{const b=e.target.closest('#j93Library .j93LibraryList button');if(!b||!b.getAttribute('aria-label')?.startsWith('Choisir le son '))return;if(W.on&&W.group==='compose'&&W.view==='roll'){const s=document.getElementById('rollSound'),preset=document.getElementById('preset');if([...s.options].some(o=>o.value===preset.value)){s.value=preset.value;s.dispatchEvent(new Event('change',{bubbles:true}));}}});
const shortcut=document.querySelector('#c92Bar [data-win="synth"]');if(shortcut){shortcut.textContent='Clavier & REC…';shortcut.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();W.choose('compose','rec');},true);}
window.JACK22_BUILD='JACK22-10.7-ORGANISATION-CANDIDATE';window.JACK22_ORGANIZATION={sync};})();
