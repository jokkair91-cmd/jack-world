(() => {
  'use strict';
  const script = document.currentScript;
  const base = new URL('.', script.src);
  const relative = decodeURIComponent(location.pathname.slice(base.pathname.length));
  const current = relative.startsWith('newduc/') ? 'nd' : relative.startsWith('studio/') ? 'studio' : relative.startsWith('j-dj/') ? 'dj' : relative.startsWith('radio/') ? 'radio' : relative.startsWith('blabla/') ? 'blabla' : 'home';
  const preserve = /^(studio\/studio\/|j-dj\/console\.html|radio\/studio\.html|blabla\/app\/)/.test(relative);
  const destinations = [['home','Accueil Jack World','index.html'],['nd','NEW DUC','newduc/index.html'],['studio','JACK22 Studio','studio/studio/index.html'],['dj','J-DJ','j-dj/console.html'],['radio','Jack Radio','radio/studio.html'],['blabla','Jack Blabla','blabla/app/index.html']];
  const host = document.createElement('div');
  host.id = 'jack-world-navigation';
  host.style.cssText = 'position:fixed!important;left:12px!important;bottom:12px!important;z-index:2147483000!important;width:auto!important;height:auto!important;display:block!important;';
  const shadow = host.attachShadow({mode:'open'});
  shadow.innerHTML = '<style>:host{font:14px/1.5 system-ui,sans-serif;color:#f4f4f6}*{box-sizing:border-box}button{font:inherit;cursor:pointer;border:1px solid #ffd166;border-radius:24px;background:#15151d;color:#fff;padding:10px 16px;box-shadow:0 3px 16px #0008}button:hover{background:#292936}button:focus-visible,a:focus-visible{outline:3px solid #ffd166;outline-offset:3px}.panel{position:absolute;bottom:54px;left:0;width:280px;max-width:calc(100vw - 24px);max-height:calc(100dvh - 90px);overflow:auto;background:#15151d;border:1px solid #777;border-radius:16px;padding:14px;box-shadow:0 8px 30px #0009}.panel[hidden]{display:none}h2{font-size:16px;margin:0 0 10px}a{display:block;color:#f4f4f6;text-decoration:none;padding:10px 12px;border-radius:8px;min-height:44px}a:hover{background:#30303c}a[aria-current]{background:#513f16;color:#ffe09a;font-weight:700}small{display:block;color:#c0c0cb;font-size:12px;margin-top:10px}button span{color:#ffd166}</style><button type="button" aria-expanded="false" aria-controls="destinations"><span aria-hidden="true">↔</span> Changer de site</button><section class="panel" id="destinations" hidden><h2>Les sites Jack World</h2><nav aria-label="Navigation entre les sites"></nav><small></small></section>';
  const button = shadow.querySelector('button'), panel = shadow.querySelector('.panel'), nav = shadow.querySelector('nav');
  destinations.filter(([id]) => id !== 'home' || current === 'home' || current === 'nd').forEach(([id,label,url]) => {
    const a = document.createElement('a');
    a.href = new URL(url,base).href;
    a.textContent = label;
    if(id === current) a.setAttribute('aria-current','true');
    if(preserve && id !== current){a.target='_blank';a.rel='noopener';a.textContent+=' ↗';a.setAttribute('aria-label',label+' — nouvel onglet');}
    nav.append(a);
  });
  shadow.querySelector('small').textContent = preserve ? 'Les autres sites s’ouvrent dans un nouvel onglet. Cette application reste ouverte.' : 'Le site actuel est surligné.';
  const close = () => {panel.hidden=true;button.setAttribute('aria-expanded','false');};
  button.addEventListener('click',() => {const open=panel.hidden;panel.hidden=!open;button.setAttribute('aria-expanded',String(open));});
  shadow.addEventListener('keydown',e => {if(e.key==='Escape'){close();button.focus();e.stopPropagation();}});
  nav.addEventListener('click',e => {const a=e.target.closest('a');if(!a)return;if(a.getAttribute('aria-current') && preserve){e.preventDefault();}close();});
  document.addEventListener('pointerdown',e => {if(!e.composedPath().includes(host))close();});
  document.body.append(host);
})();
