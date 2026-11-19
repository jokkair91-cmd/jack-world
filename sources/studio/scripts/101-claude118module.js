
(() => {
 'use strict';
 const $c=id=>document.getElementById(id),stage=$c('dockStage');if(!stage)return;
 const el=(tag,props={},kids=[])=>{const e=document.createElement(tag);Object.assign(e,props);e.append(...kids);return e;};
 // Studio = vue Arrangement des espaces : là, en-tête complet ; ailleurs, en-tête caché.
 const spaces=()=>document.body.classList.contains('j93Workspace');
 function mode(){
  const compact=spaces()&&!stage.classList.contains('j108Arrange');
  if(document.body.classList.contains('c118Compact')!==compact){document.body.classList.toggle('c118Compact',compact);fit();}
 }
 // Hauteur de l'espace de travail = hauteur de la fenêtre sous la barre des espaces (jamais de page à faire défiler).
 function fit(){
  // Écran étroit (téléphone) : les panneaux s'empilent et la page défile, comme avant.
  if(!spaces()||!stage.offsetParent||innerWidth<900){document.body.style.removeProperty('--c118H');return;}
  const bottom=parseFloat(getComputedStyle(document.body).getPropertyValue('--c119Bottom'))||0;   // barre de transport du bas (bloc 119)
  const top=stage.getBoundingClientRect().top+window.scrollY,h=Math.max(300,Math.floor(innerHeight-top-12-bottom));
  document.body.style.setProperty('--c118H',h+'px');
  if(document.documentElement.scrollHeight>innerHeight+1&&window.scrollY)window.scrollTo(0,0);
 }
 new MutationObserver(mode).observe(stage,{attributes:true,attributeFilter:['class']});
 new MutationObserver(mode).observe(document.body,{attributes:true,attributeFilter:['class']});
 addEventListener('resize',()=>requestAnimationFrame(fit));
 new ResizeObserver(()=>requestAnimationFrame(fit)).observe(document.body);
 // Mini-transport : relais des vrais boutons (Play, Stop, BPM, Sauvegarder, Arrêter la prise).
 const mini=el('span',{id:'c118Mini',role:'group',ariaLabel:'Transport'});
 const relay=(id,cls,label)=>{const b=el('button',{type:'button',className:cls||''});b.dataset.for=id;b.title=label;b.addEventListener('click',()=>$c(id)?.click());return b;};
 const play=relay('play','c118Play','Lecture / pause (Espace)'),stop=relay('stop','','Stop'),save=relay('save','','Sauvegarder (Ctrl+S)'),recStop=relay('cRecordStop','c118Rec','Arrêter la prise');
 const bpm=el('input',{type:'number',min:'40',max:'240',ariaLabel:'Tempo (BPM)',title:'Tempo (BPM)'});
 bpm.addEventListener('change',()=>{const o=$c('bpm');if(!o)return;o.value=bpm.value;o.dispatchEvent(new Event('input',{bubbles:true}));o.dispatchEvent(new Event('change',{bubbles:true}));});
 mini.append(play,stop,el('label',{},[bpm,el('span',{textContent:'BPM'})]),save,recStop);
 function syncMini(){
  // Icônes courtes : la barre des espaces reste sur une ligne.
  const playing=/pause/i.test($c('play')?.textContent||'');play.textContent=playing?'❚❚':'▶';play.setAttribute('aria-label',playing?'Pause':'Lecture');
  stop.textContent='■';stop.setAttribute('aria-label','Stop');
  const dirty=/●/.test($c('save')?.textContent||'');save.textContent=dirty?'Sauver ●':'Sauver';save.setAttribute('aria-label','Sauvegarder');
  const r=$c('cRecordStop');recStop.textContent='■ Prise';recStop.hidden=!r||r.disabled;
  const o=$c('bpm');if(o&&document.activeElement!==bpm)bpm.value=o.value;
 }
 // La barre des espaces est créée après ce bloc : on attend qu'elle existe.
 const wait=setInterval(()=>{const nav=$c('j93Nav');if(!nav)return;clearInterval(wait);nav.prepend(mini);mode();fit();},250);
 setTimeout(()=>clearInterval(wait),60000);
 setInterval(()=>{if(!document.hidden){syncMini();mode();fit();}},300);
 // ---------- Console dans Composition : une vue de plus à côté d'Arrangement, Batterie, Piano Roll ----------
 // (les mêmes panneaux que l'espace Console : mixeur et effets master, sans quitter Composition)
 document.addEventListener('j105view',e=>{
  const d=e.detail||{},W=window.JACK22_WORKSPACE,subs=document.querySelector('#j93Nav .j93Subs');
  const isConsole=d.group==='compose'&&d.view==='mixer';
  stage.classList.toggle('c118Console',isConsole);
  if(d.group==='compose'&&subs&&W&&!subs.querySelector('[data-c118-console]')){
   const b=el('button',{type:'button',textContent:'Console'});b.dataset.c118Console='1';b.addEventListener('click',()=>W.choose('compose','mixer'));subs.append(b);
  }
  subs?.querySelector('[data-c118-console]')?.setAttribute('aria-pressed',String(isConsole));
  if(isConsole){
   stage.classList.add('j93Mix');
   for(const[id,area]of[['mixer','left'],['fx','right']]){const p=$c(id);if(!p)continue;p.dataset.j93Visible='true';p.dataset.j93Area=area;p.hidden=false;}
   requestAnimationFrame(fit);
  }
 });
 // ---------- Piano Roll : boutons de lecture dans la barre d'outils, bouton « Grand Piano Roll » ----------
 const BIG='jack22.pianoRoll.grand';
 let big=false;try{big=localStorage.getItem(BIG)==='1';}catch(e){}
 const bigBtn=el('button',{type:'button',id:'c118BigBtn',textContent:'⤢ Grand Piano Roll',title:'Replier le clavier du bas pour agrandir la grille (cliquer encore pour le rouvrir)'});
 const setBig=v=>{big=v;document.body.classList.toggle('c118Big',v);bigBtn.setAttribute('aria-pressed',String(v));bigBtn.textContent=v?'⤡ Clavier':'⤢ Grand';bigBtn.setAttribute('aria-label',v?'Afficher le clavier du bas':'Grand Piano Roll : replier le clavier du bas');try{localStorage.setItem(BIG,v?'1':'0');}catch(e){}requestAnimationFrame(fit);setTimeout(()=>{try{rollPos?.();}catch(e){}dispatchEvent(new Event('resize'));},60);};
 bigBtn.addEventListener('click',()=>setBig(!big));setBig(big);
 const rollWait=setInterval(()=>{
  const roll=$c('roll'),bar=roll?.querySelector('.roll-bar');if(!bar)return;clearInterval(rollWait);
  const row=[...roll.children].find(c=>c.tagName==='DIV'&&!c.id&&!c.className&&c.querySelector('button'));
  // Libellés courts (le nom complet reste en info-bulle et pour les lecteurs d'écran).
  const SHORT={'Lecture du pattern':'▶ Pattern','Retour au début':'⏮ Début'};
  if(row){for(const b of [...row.querySelectorAll('button')]){const full=b.textContent.trim();if(SHORT[full]){b.title=full;b.setAttribute('aria-label',full);b.textContent=SHORT[full];}bar.append(b);}row.classList.add('c118Empty');}
  bar.append(bigBtn);
 },250);
 setTimeout(()=>clearInterval(rollWait),60000);
 window.JACK22_ECRAN={version:'11.5-claude-ecran',fit,mode,setBig};
})();
