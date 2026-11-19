(() => {
  'use strict';
  // « Changer de site » : une petite languette ronde collée au bord gauche, avec le logo du site où l'on est.
  // Elle dépasse à peine, sort un peu de temps en temps pour se faire remarquer, et s'ouvre au clic
  // sur la liste des sites (logo + nom). Elle mène toujours aux SITES, jamais directement aux applis :
  // c'est depuis le site qu'on ouvre l'appli. Jack World n'est proposé que depuis NEW DUC.
  const script = document.currentScript;
  const base = new URL('.', script.src);
  const relative = decodeURIComponent(location.pathname.slice(base.pathname.length));
  const current = relative.startsWith('newduc/') ? 'nd' : relative.startsWith('studio/') ? 'studio' : relative.startsWith('j-dj/') ? 'dj' : relative.startsWith('radio/') ? 'radio' : relative.startsWith('blabla/') ? 'blabla' : relative.startsWith('fusion/') ? 'fusion' : relative.startsWith('finance/') ? 'finance' : relative.startsWith('bours/') ? 'bours' : relative.startsWith('batiment/') ? 'batiment' : 'home';
  // Pages d'appli : les sites s'ouvrent dans un nouvel onglet pour ne pas fermer l'appli
  const preserve = /^(studio\/studio\/|j-dj\/console\.html|radio\/studio\.html|blabla\/app\/|fusion\/app\/|finance\/app\/|bours\/app\/|batiment\/app\/)/.test(relative);
  // Pour ajouter un projet (Jack Bourse…) : une ligne [id, nom, site, logo], + son dossier dans « current » et « preserve »
  const destinations = [
    ['home','Accueil Jack World','index.html','jack-world-logo.svg'],
    ['nd','NEW DUC','newduc/index.html','newduc/assets/nd/nd-sillage.png'],
    ['studio','JACK22 Studio','studio/index.html','newduc/assets/nd/j22-logo-jack.png'],
    ['dj','J-DJ','j-dj/index.html','newduc/assets/nd/jdj-bot.png'],
    ['radio','Jack Radio','radio/index.html','radio/radio-192.png'],
    ['blabla','Jack Blabla','blabla/index.html','blabla/icon-192.png'],
    ['fusion','Jack Fusion','fusion/index.html','fusion/apple-touch-icon.png'],
    ['finance','Jack Finance','finance/index.html','finance/favicon.svg'],
    ['bours','Jack Bours','bours/index.html','bours/app/images/icone.svg'],
    ['batiment','Jack Bâtiment','batiment/index.html','batiment/app/images/castor.svg'],
  ];
  const ici = destinations.find(([id]) => id === current) || destinations[0];
  const host = document.createElement('div');
  host.id = 'jack-world-navigation';
  host.style.cssText = 'position:fixed!important;left:0!important;top:62%!important;z-index:2147483000!important;width:0!important;height:0!important;display:block!important;overflow:visible!important;';
  const shadow = host.attachShadow({mode:'open'});
  shadow.innerHTML = `<style>
:host{font:14px/1.4 system-ui,"Segoe UI",sans-serif;color:#f4f4f6}
*{box-sizing:border-box}
.tab{position:absolute;left:0;top:0;transform:translate(-14px,-50%);width:52px;height:52px;padding:5px;border:2px solid #ffd166;border-left:0;border-radius:0 26px 26px 0;background:#15151dee;cursor:pointer;box-shadow:0 3px 14px #0008;display:grid;place-items:center end;transition:transform .25s ease,background .2s;animation:coucou 7s ease-in-out 2s infinite}
.tab img{width:36px;height:36px;object-fit:contain;border-radius:50%;background:#fff1;display:block}
.tab:hover,.tab:focus-visible,.tab[aria-expanded="true"]{transform:translate(0,-50%);animation:none;background:#1f1f2a}
.tab:focus-visible{outline:3px solid #ffd166;outline-offset:3px}
@keyframes coucou{0%,82%,100%{transform:translate(-14px,-50%)}88%{transform:translate(-2px,-50%) rotate(-6deg)}94%{transform:translate(-6px,-50%) rotate(4deg)}}
.panel{position:absolute;left:60px;top:0;transform:translateY(-50%);width:250px;max-width:calc(100vw - 72px);max-height:calc(100dvh - 24px);overflow:auto;background:#15151df7;border:1px solid #ffd16688;border-radius:16px;padding:12px;box-shadow:0 8px 30px #0009;animation:entre .2s ease-out}
.panel[hidden]{display:none}
@keyframes entre{from{opacity:0;transform:translate(-10px,-50%)}}
h2{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#ffd166;margin:2px 4px 8px}
a{display:flex;align-items:center;gap:10px;color:#f4f4f6;text-decoration:none;padding:6px 8px;border-radius:10px;min-height:44px}
a img{width:30px;height:30px;object-fit:contain;border-radius:8px;flex:none}
a:hover{background:#30303c}
a:focus-visible{outline:3px solid #ffd166;outline-offset:1px}
a[aria-current]{background:#513f16;color:#ffe09a;font-weight:700}
small{display:block;color:#c0c0cb;font-size:12px;margin:8px 4px 0}
@media (prefers-reduced-motion:reduce){.tab{animation:none;transition:none}.panel{animation:none}}
</style><button class="tab" type="button" aria-expanded="false" aria-controls="destinations" aria-label="Changer de site" title="Changer de site"><img alt=""></button><section class="panel" id="destinations" hidden><h2>Les sites Jack World</h2><nav aria-label="Navigation entre les sites"></nav><small></small></section>`;
  const button = shadow.querySelector('.tab'), panel = shadow.querySelector('.panel'), nav = shadow.querySelector('nav');
  button.querySelector('img').src = new URL(ici[3], base).href;
  destinations.filter(([id]) => id !== 'home' || current === 'home' || current === 'nd').forEach(([id,label,url,logo]) => {
    const a = document.createElement('a');
    a.href = new URL(url,base).href;
    const img = document.createElement('img');
    img.src = new URL(logo,base).href; img.alt = ''; img.width = 30; img.height = 30;
    const nom = document.createElement('span');
    nom.textContent = label;
    a.append(img, nom);
    if(id === current && !preserve) a.setAttribute('aria-current','true'); // depuis une appli, son site reste cliquable
    if(preserve && id !== current){a.target='_blank';a.rel='noopener';nom.textContent+=' ↗';a.setAttribute('aria-label',label+' — nouvel onglet');}
    nav.append(a);
  });
  shadow.querySelector('small').textContent = preserve ? 'Les autres sites s’ouvrent dans un nouvel onglet. Cette application reste ouverte.' : 'Le site actuel est surligné. L’appli s’ouvre depuis chaque site.';
  const close = () => {panel.hidden=true;button.setAttribute('aria-expanded','false');};
  button.addEventListener('click',() => {const open=panel.hidden;panel.hidden=!open;button.setAttribute('aria-expanded',String(open));if(open){const a=nav.querySelector('a');if(a)a.focus({preventScroll:true});}});
  shadow.addEventListener('keydown',e => {if(e.key==='Escape'){close();button.focus();e.stopPropagation();}});
  nav.addEventListener('click',e => {const a=e.target.closest('a');if(!a)return;if(a.getAttribute('aria-current')){e.preventDefault();}close();});
  document.addEventListener('pointerdown',e => {if(!e.composedPath().includes(host))close();});
  document.body.append(host);
})();
