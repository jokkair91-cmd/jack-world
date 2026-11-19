
(()=>{'use strict';
// Only static editorial copy is hidden. Status nodes, controls and warnings are preserved.
const phrases=/Première automation|Ce prototype rassemble|Importer audio\s*:|24 états maximum|Développement non testé|Candidate de développement|Cette version rassemble|plafonnés en mémoire/;
for(const p of document.querySelectorAll('p')){
 if(p.id||p.getAttribute('role')||p.querySelector('button,input,select,a')||p.closest('[role=alert]'))continue;
 const t=p.textContent.trim();
 if(phrases.test(t)||(t.length>150&&p.matches('.hint,.cFine')))p.classList.add('j103Editorial');
}
window.JACK22_BUILD='JACK22-10.3-NETTOYAGE-CANDIDATE';
})();
