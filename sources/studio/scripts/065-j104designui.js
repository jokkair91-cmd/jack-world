
(()=>{'use strict';
const s=document.getElementById('cSpeed');if(s&&!s.getAttribute('aria-label'))s.setAttribute('aria-label','Vitesse du prompteur');
const title=document.querySelector('#mixer .orbitMixerName>div');if(title){title.replaceChildren(document.createTextNode('CONSOLE'),Object.assign(document.createElement('small'),{textContent:'JACK22 · MIXAGE'}));}
const entry=document.getElementById('j93Enter');if(entry)entry.textContent='Studio · espace de travail…';
window.JACK22_BUILD='JACK22-10.4-DESIGN-CANDIDATE';
})();
