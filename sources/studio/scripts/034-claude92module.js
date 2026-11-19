
(() => {
 'use strict';
 const $c=id=>document.getElementById(id),stage=$c('dockStage'),body=document.body,messages=$c('dockMessages');
 if(!stage||!messages)return;
 const KEY='jack22.pro.layout.v1';
 // Fenêtres : panneau réel, titre, position par défaut (fractions du bureau), ouverte au départ.
 const WINS=[
  {id:'timeline',title:'Arrangement',x:0,y:0,w:.64,h:.47,open:true},
  {id:'c92Inspector',title:'Inspecteur',x:.65,y:0,w:.35,h:.22,open:true},
  {id:'fx',title:'Effets master',x:.65,y:.23,w:.35,h:.24,open:true},
  {id:'mixer',title:'Mixeur',x:0,y:.48,w:.40,h:.52,open:true},
  {id:'synth',title:'Synthé Orbite',x:.41,y:.48,w:.59,h:.52,open:true},
  {id:'roll',title:'Piano Roll',x:.08,y:.06,w:.76,h:.62,open:false},
  {id:'dockBeat',title:'Batterie',x:.10,y:.12,w:.70,h:.42,open:false},
  {id:'patterns',title:'Patterns',x:.12,y:.08,w:.62,h:.40,open:false},
  {id:'recorder',title:'Prise de notes',x:.14,y:.16,w:.60,h:.40,open:false},
  {id:'cVoices',title:'Voix',x:.06,y:.08,w:.80,h:.70,open:false},
  {id:'l3Editor',title:'Effets voix',x:.10,y:.10,w:.78,h:.72,open:false}
 ];
 const MINW=240,MINH=96;
 let on=false,zTop=30,layout={};
 try{layout=JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(e){layout={};}
 const store=()=>{try{localStorage.setItem(KEY,JSON.stringify(layout));}catch(e){}};
 const conf=w=>Object.assign({x:w.x,y:w.y,w:w.w,h:w.h,open:w.open,z:0},layout[w.id]||{});

 // Barre du mode Pro, sous la ligne des messages (cachée hors mode Pro).
 const bar=document.createElement('div');bar.id='c92Bar';bar.setAttribute('role','toolbar');bar.setAttribute('aria-label','Mode Pro');
 const mk=(text,fn,cls)=>{const b=document.createElement('button');b.type='button';b.textContent=text;if(cls)b.className=cls;b.addEventListener('click',fn);return b;};
 const label=document.createElement('strong');label.textContent='MODE PRO';bar.append(label);
 const toggles=new Map();
 for(const w of WINS){const b=mk(w.title,()=>setOpen(w,!conf(w).open,true));b.dataset.win=w.id;toggles.set(w.id,b);bar.append(b);}
 const sep=()=>{const s=document.createElement('span');s.className='c92Sep';s.setAttribute('aria-hidden','true');return s;};
 const undo=mk('Annuler',()=>$c('j90Undo')?.click()),redo=mk('Rétablir',()=>$c('j90Redo')?.click());
 bar.append(sep(),undo,redo,sep(),mk('Disposition par défaut',resetLayout),mk('Quitter le mode Pro',()=>exit(),'c92Exit'));
 messages.after(bar);

 // Inspecteur : description de la sélection + vraies commandes de la barre de sélection de l'arrangement.
 const insp=document.createElement('section');insp.id='c92Inspector';insp.className='panel';insp.setAttribute('aria-label','Inspecteur');
 const info=document.createElement('div');info.setAttribute('aria-live','polite');
 const detail=mk('Modifier en détail…',()=>window.JACK22_WORKFLOW?.inspect());
 insp.append(info);
 function describe(){
  try{
   if(typeof tlSelAudio!=='undefined'&&tlSelAudio!=null){const c=audioClips.find(c=>c.id===tlSelAudio);if(c)return['Clip audio',[['Nom',c.name],['Début','mesure '+(c.startBar+1)],['Durée',typeof fmtDur==='function'?fmtDur(c.duration):Math.round(c.duration)+' s'],['Piste',c.voice?'Voix':'Audio importé']]];}
   const b=typeof tlBlock==='function'?tlBlock():null;
   if(b){const ti=trackIdx(b.trackKey),p=patternById(ti,b.patternId);return['Bloc',[['Piste',song.tracks[ti]?.label||b.trackKey],['Pattern',p?p.name:'(supprimé)'],['Début','mesure '+(b.startBar+1)],['Longueur',b.lengthBars+' mesure'+(b.lengthBars>1?'s':'')]]];}
  }catch(e){}
  return null;
 }
 let lastInfo='';
 function renderInfo(){
  const d=describe(),key=JSON.stringify(d);if(key===lastInfo)return;lastInfo=key;info.replaceChildren();
  if(!d){const p=document.createElement('p');p.className='c92Empty';p.textContent='Clique un bloc ou un clip dans l’arrangement pour voir et modifier ses réglages.';info.append(p);return;}
  const dl=document.createElement('dl');for(const[k,v]of d[1]){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;dl.append(dt,dd);}info.append(dl);
 }

 // Fenêtres : barre de titre (déplacement, fermeture), redimensionnement natif, mise au premier plan.
 const chrome=new Map(),saved=new Map(),homes=new Map();
 function deskRect(){return{width:stage.clientWidth,height:stage.clientHeight};}
 // Géométrie d'une fenêtre en pixels (variables CSS) ; la poignée suit le coin bas-droit.
 function geo(panel){return{x:panel.offsetLeft,y:panel.offsetTop,w:panel.offsetWidth,h:panel.offsetHeight};}
 function setGeo(panel,g){
  const d=deskRect(),w=Math.round(Math.max(MINW,Math.min(d.width,g.w))),h=Math.round(Math.max(MINH,Math.min(d.height,g.h)));
  const x=Math.round(Math.max(-(w-80),Math.min(d.width-80,g.x))),y=Math.round(Math.max(0,Math.min(d.height-28,g.y)));
  panel.style.setProperty('--x',x+'px');panel.style.setProperty('--y',y+'px');panel.style.setProperty('--w',w+'px');panel.style.setProperty('--h',h+'px');
  const grip=chrome.get(panel.id)?.grip;if(grip){grip.style.left=(x+w-17)+'px';grip.style.top=(y+h-17)+'px';}
 }
 function front(panel){
  stage.querySelectorAll(':scope>.c92Front').forEach(p=>p.classList.remove('c92Front'));panel.classList.add('c92Front');
  panel.style.zIndex=String(++zTop);const grip=chrome.get(panel.id)?.grip;if(grip)grip.style.zIndex=panel.style.zIndex;
 }
 function remember(w,panel){
  if(!on||innerWidth<900||panel.classList.contains('c92Closed')||!panel.offsetWidth)return;
  const d=deskRect(),g=geo(panel);layout[w.id]=Object.assign(conf(w),{x:g.x/d.width,y:g.y/d.height,w:g.w/d.width,h:g.h/d.height,z:Number(panel.style.zIndex)||0});store();
 }
 function place(w,panel){
  const c=conf(w),d=deskRect();setGeo(panel,{x:c.x*d.width,y:c.y*d.height,w:c.w*d.width,h:c.h*d.height});
  if(c.z){panel.style.zIndex=String(c.z);zTop=Math.max(zTop,c.z);const grip=chrome.get(panel.id)?.grip;if(grip)grip.style.zIndex=String(c.z);}
 }
 function setOpen(w,open,save){
  const panel=$c(w.id);if(!panel)return;panel.classList.toggle('c92Closed',!open);chrome.get(w.id)?.grip.classList.toggle('c92Closed',!open);
  toggles.get(w.id)?.setAttribute('aria-pressed',String(open));
  if(open&&on){place(w,panel);front(panel);}
  if(save){layout[w.id]=Object.assign(conf(w),{open});store();}
  if(open&&on&&w.id==='timeline'&&typeof tlBuild==='function')requestAnimationFrame(()=>{try{tlBuild();}catch(e){}});
 }
 function addChrome(w,panel){
  const winBar=document.createElement('div');winBar.className='c92WinBar';winBar.tabIndex=0;
  winBar.setAttribute('aria-label','Fenêtre '+w.title+' : glisser pour déplacer ; flèches pour déplacer, Maj+flèches pour la taille');
  const t=document.createElement('span');t.className='c92WinTitle';t.textContent=w.title;
  const x=document.createElement('button');x.type='button';x.className='c92WinClose';x.textContent='×';x.setAttribute('aria-label','Fermer la fenêtre '+w.title);
  x.addEventListener('click',e=>{e.stopPropagation();setOpen(w,false,true);});
  winBar.append(t,x);panel.prepend(winBar);
  const grip=document.createElement('div');grip.className='c92Grip';grip.tabIndex=-1;grip.setAttribute('aria-hidden','true');grip.title='Redimensionner';stage.append(grip);
  chrome.set(w.id,{winBar,grip});
  // Déplacement (barre de titre) et redimensionnement (poignée) à la souris ou au doigt.
  const track=(el,start,move)=>{let s=null;
   el.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('button')||innerWidth<900)return;front(panel);s={x:e.clientX,y:e.clientY,g:geo(panel)};try{el.setPointerCapture(e.pointerId);}catch(x){}e.preventDefault();});
   el.addEventListener('pointermove',e=>{if(s)move(s.g,e.clientX-s.x,e.clientY-s.y);});
   const end=()=>{if(!s)return;s=null;remember(w,panel);};el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);};
  track(winBar,null,(g,dx,dy)=>setGeo(panel,{x:g.x+dx,y:g.y+dy,w:g.w,h:g.h}));
  track(grip,null,(g,dx,dy)=>setGeo(panel,{x:g.x,y:g.y,w:g.w+dx,h:g.h+dy}));
  // Au clavier : flèches = déplacer, Maj+flèches = taille.
  winBar.addEventListener('keydown',e=>{const k={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!k||innerWidth<900)return;e.preventDefault();e.stopPropagation();const g=geo(panel),s=16;
   setGeo(panel,e.shiftKey?{x:g.x,y:g.y,w:g.w+k[0]*s,h:g.h+k[1]*s}:{x:g.x+k[0]*s,y:g.y+k[1]*s,w:g.w,h:g.h});remember(w,panel);});
  panel.addEventListener('pointerdown',()=>{if(on)front(panel);},true);
 }
 // Menus déroulants d'une fenêtre : affichés par-dessus, sans être coupés par le bord de la fenêtre.
 const fixed=new Map();
 document.addEventListener('toggle',e=>{
  const d=e.target;if(!(d instanceof HTMLDetailsElement)||!stage.contains(d))return;
  const pop=d.querySelector(':scope>.dockPopupBody');if(!pop)return;
  if(d.open&&on){const win=d.closest('#dockStage>.panel');if(win)front(win);
   if(!fixed.has(pop))fixed.set(pop,pop.getAttribute('style'));const s=d.querySelector('summary').getBoundingClientRect();
   Object.assign(pop.style,{position:'fixed',zIndex:'60',right:'auto',top:Math.round(s.bottom+4)+'px',maxHeight:Math.max(160,innerHeight-s.bottom-12)+'px',overflow:'auto'});
   const width=pop.offsetWidth;pop.style.left=Math.round(Math.max(8,Math.min(s.right-width,innerWidth-width-8)))+'px';}
  else if(fixed.has(pop)){const st=fixed.get(pop);st===null?pop.removeAttribute('style'):pop.setAttribute('style',st);fixed.delete(pop);}
 },true);

 // Hauteur du bureau : sous l'en-tête, les messages et la barre du mode Pro.
 function deskTop(){if(on)body.style.setProperty('--c92Top',Math.round(bar.getBoundingClientRect().bottom+6)+'px');}
 function relayout(){if(!on)return;deskTop();if(innerWidth<900)return;for(const w of WINS){const p=$c(w.id);if(p&&!p.classList.contains('c92Closed'))place(w,p);}}
 let timer=null,scrolls=[];

 function enter(){
  if(on)return;
  window.JACK22_COMPACT?.studioView?.('all');window.JACK22_DOCK?.showPane('studio');
  // Défilements de l'accueil retrouvés tels quels à la sortie.
  scrolls=[['tlWrap'],['rollWrap']].map(([id])=>{const el=$c(id);return el?[el,el.scrollLeft,el.scrollTop]:null;}).filter(Boolean);
  document.querySelectorAll('details.dockPopup[open]').forEach(d=>d.open=false);
  stage.append(insp);
  const sel=document.querySelector('#timeline .dockSelection');
  if(sel){const mark=document.createComment('c92:dockSelection');sel.before(mark);homes.set(sel,mark);insp.append(sel,detail);}
  for(const w of WINS){
   const panel=$c(w.id);if(!panel)continue;
   saved.set(w.id,{style:panel.getAttribute('style'),hidden:panel.hidden,cls:panel.className});
   if(panel.parentElement!==stage){const mark=document.createComment('c92:'+w.id);panel.before(mark);homes.set(panel,mark);stage.append(panel);}
   panel.hidden=false;panel.classList.remove('compact88Folded','compact88Focused');
   addChrome(w,panel);
  }
  body.classList.add('c92Pro');on=true;deskTop();
  for(const w of WINS){const p=$c(w.id);if(!p)continue;place(w,p);setOpen(w,conf(w).open,false);}
  const top=WINS.map(w=>$c(w.id)).filter(p=>p&&!p.classList.contains('c92Closed')).sort((a,b)=>(Number(b.style.zIndex)||0)-(Number(a.style.zIndex)||0))[0];if(top)front(top);
  renderInfo();timer=setInterval(()=>{renderInfo();const u=$c('j90Undo'),r=$c('j90Redo');undo.disabled=!u||u.disabled;redo.disabled=!r||r.disabled;},300);
  try{tlBuild();}catch(e){}
  window.dispatchEvent(new Event('resize'));
 }
 function exit(){
  if(!on)return;
  document.querySelectorAll('details.dockPopup[open]').forEach(d=>d.open=false);
  clearInterval(timer);timer=null;
  for(const w of WINS){
   const panel=$c(w.id);if(!panel)continue;const c=chrome.get(w.id);
   if(c){c.winBar.remove();c.grip.remove();chrome.delete(w.id);}
   const s=saved.get(w.id);if(s){s.style===null?panel.removeAttribute('style'):panel.setAttribute('style',s.style);panel.hidden=s.hidden;panel.className=s.cls;}
   const mark=homes.get(panel);if(mark){mark.replaceWith(panel);homes.delete(panel);}
  }
  for(const[el,mark]of [...homes]){mark.replaceWith(el);homes.delete(el);}
  detail.remove();insp.remove();
  body.classList.remove('c92Pro');body.style.removeProperty('--c92Top');on=false;
  try{tlBuild();}catch(e){}
  window.dispatchEvent(new Event('resize'));
  // Les lignes de l'arrangement sont redessinées juste après : on rétablit aussi après ce redessin.
  const back=scrolls;scrolls=[];const restore=()=>{for(const[el,l,t]of back){el.scrollLeft=l;el.scrollTop=t;}};
  restore();requestAnimationFrame(()=>requestAnimationFrame(restore));setTimeout(restore,120);
 }
 function resetLayout(){layout={};store();zTop=30;relayout();for(const w of WINS)setOpen(w,w.open,false);}
 addEventListener('resize',()=>{if(on)requestAnimationFrame(relayout);});
 new ResizeObserver(()=>deskTop()).observe(document.getElementById('dockHeader'));
 // Entrée : menu Projet (l'accueil n'a aucun bouton en plus).
 const menu=document.querySelector('.dockProject .dockPopupBody');
 if(menu){const go=mk('Mode Pro (fenêtres)…',()=>{const d=menu.closest('details');if(d)d.open=false;enter();});go.id='c92Enter';menu.prepend(go);}
 window.JACK22_PRO={version:'9.2',enter,exit,resetLayout,get on(){return on;},get layout(){return JSON.parse(JSON.stringify(layout));},WINS:WINS.map(w=>w.id)};
})();
