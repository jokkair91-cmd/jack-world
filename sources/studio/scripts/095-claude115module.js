
(() => {
 'use strict';
 const $c=id=>document.getElementById(id),H=window.Jack22Vision8,K=window.JACK22_PACKS;
 const remember=()=>{try{H?.remember();}catch(e){}};
 const say=t=>{const s=$c('c93Status');if(s)s.textContent=t;try{setStatus(t);}catch(e){}};

 // ---------- Correctifs de la 11.5 ----------
 // « Mode Pro (fenêtres)… » du menu Projet ne faisait rien (les espaces utilisent déjà le mode Pro) : il ouvre les fenêtres libres.
 const enterBtn=$c('c92Enter');
 if(enterBtn)enterBtn.addEventListener('click',e=>{const P=window.JACK22_PRO;if(!P||!document.body.classList.contains('j93Workspace'))return;
  e.stopImmediatePropagation();const d=enterBtn.closest('details');if(d)d.open=false;P.enter();},true);
 // Quitter les fenêtres libres ramenait l'ancien écran (sans les espaces ni le synthé) : retour aux espaces.
 document.addEventListener('click',e=>{if(!(e.target instanceof Element)||!e.target.closest('#c92Bar .c92Exit'))return;const W=window.JACK22_WORKSPACE;
  if(W)setTimeout(()=>{if(!window.JACK22_PRO?.on&&!W.on)W.enter();},0);});

 // Un outil ouvert depuis les espaces (menu Outils) : « Retour au studio » ramenait l'ancien écran. On revient aux espaces.
 const drawer=$c('dockDrawer');
 if(drawer){   // les espaces (JACK22_WORKSPACE) s'installent après ce bloc : cherchés au moment du retour
  // Dernier instant où les espaces étaient affichés (au clic, avant que l'outil ne les ferme).
  let spacesAt=0,fromSpaces=false;const mark=()=>{if(document.body.classList.contains('j93Workspace'))spacesAt=Date.now();};
  document.addEventListener('pointerdown',mark,true);document.addEventListener('click',mark,true);document.addEventListener('keydown',mark,true);
  new MutationObserver(()=>{
   if(!drawer.hidden){if(Date.now()-spacesAt<2000||document.body.classList.contains('j93Workspace'))fromSpaces=true;return;}
   if(fromSpaces){fromSpaces=false;if(!window.JACK22_PRO?.on||!document.body.classList.contains('j93Workspace'))setTimeout(()=>{if(drawer.hidden&&!document.body.classList.contains('j93Workspace')&&!document.getElementById('c92Bar')?.offsetWidth)window.JACK22_WORKSPACE?.enter();},0);}
  }).observe(drawer,{attributes:true,attributeFilter:['hidden']});
 }

 // ---------- Son Guitare (synthé) ----------
 // Corde pincée : attaque brillante, filtre qui se referme vite, son qui s'éteint seul.
 if(typeof PRESETS==='object'&&!PRESETS.guitar){
  PRESETS.guitar={osc1:'sawtooth',osc2:'triangle',mix:[0.38,0.62],detune:4,cutoff:1800,q:1.2,attack:0.002,decay:0.9,sustain:0.1,release:0.35,level:0.4,octave:3,pluck:{from:5200,time:0.18}};
  for(const sel of document.querySelectorAll('select'))if([...sel.options].some(o=>o.value==='pluck')&&![...sel.options].some(o=>o.value==='guitar')){const o=document.createElement('option');o.value='guitar';o.textContent='Guitare';sel.append(o);}
  const install=window.J97InstallEngine;
  window.J97InstallEngine=function(E,S){
   if(install)install.apply(this,arguments);
   const start=E.startVoice;
   E.startVoice=function(source,key,octave,idx,t,opts){const v=start.apply(this,arguments);
    if(v&&v.f&&v.p&&v.p.pluck){const f=v.f.frequency,t0=v.t0;f.cancelScheduledValues(t0);f.setValueAtTime(v.p.pluck.from,t0);f.exponentialRampToValueAtTime(v.p.cutoff,t0+v.p.pluck.time);}
    return v;};
  };
 }

 // ---------- Mode afro : batterie, basse 808, guitare ----------
 // Batterie : 16 pas par ligne (KICK, SNARE, HI-HAT, CLAP). Basse et guitare : 2 mesures (32 pas), tonalité de la mineur.
 const steps=list=>{const r=Array(16).fill(false);for(const s of list)r[s]=true;return r;};
 const N=(start,dur,idx,octave,preset)=>({start,dur,preset,octave,idx});
 const A=9,B=11,C=0,D=2,E=4,F=5,G=7;
 const AFRO={
  afrobeats:{label:'Afrobeats',bpm:104,
   drums:[steps([0,6,10]),steps([4,12]),steps([0,2,4,6,7,8,10,12,14,15]),steps([3,11])],
   bass:[N(0,3,A,1),N(6,2,A,1),N(10,2,C,2),N(16,3,G,1),N(22,2,G,1),N(26,4,E,1)],
   guitar:[N(0,1,E,4),N(2,1,A,4),N(3,2,C,5),N(6,1,A,4),N(8,1,E,4),N(10,1,G,4),N(11,2,A,4),N(14,1,E,4),N(16,1,D,5),N(18,1,C,5),N(19,2,A,4),N(22,1,G,4),N(24,1,E,4),N(26,1,G,4),N(27,2,A,4),N(30,1,C,5)]},
  amapiano:{label:'Amapiano',bpm:112,
   drums:[steps([0,4,8,12]),steps([7,15]),steps([2,6,10,14]),steps([4,12])],
   bass:[N(0,1,A,1),N(3,2,A,1),N(6,2,E,2),N(10,2,A,1),N(13,2,G,1),N(16,1,A,1),N(19,2,A,1),N(22,2,C,2),N(26,2,A,1),N(29,2,E,1)],
   guitar:[N(2,1,A,4),N(6,1,C,5),N(10,1,E,5),N(14,1,C,5),N(18,1,G,4),N(22,1,C,5),N(26,1,E,5),N(30,1,D,5)]},
  coupe:{label:'Coupé-décalé',bpm:128,
   drums:[steps([0,4,8,12]),steps([4,12]),steps([0,2,3,4,6,7,8,10,11,12,14,15]),steps([6,14])],
   bass:[N(0,2,A,1),N(6,2,A,1),N(8,2,A,2),N(14,2,G,1),N(16,2,F,1),N(22,2,F,1),N(24,2,F,2),N(30,2,E,1)],
   guitar:[N(0,1,A,4),N(1,1,C,5),N(2,1,E,5),N(4,1,C,5),N(6,1,A,4),N(8,1,C,5),N(9,1,E,5),N(10,1,A,5),N(12,1,E,5),N(14,1,C,5),N(16,1,F,4),N(17,1,A,4),N(18,1,C,5),N(20,1,A,4),N(22,1,F,4),N(24,1,G,4),N(26,1,B,4),N(28,1,D,5),N(30,1,E,5)]},
  house:{label:'Afro house',bpm:122,
   drums:[steps([0,4,8,12]),steps([3,7,10,15]),steps([2,6,10,14]),steps([4,12])],
   bass:[N(2,2,A,1),N(6,2,A,1),N(10,2,A,1),N(14,2,C,2),N(18,2,F,1),N(22,2,F,1),N(26,2,G,1),N(30,2,G,1)],
   guitar:[N(0,2,A,4),N(4,1,E,5),N(7,1,C,5),N(10,2,A,4),N(14,1,G,4),N(16,2,F,4),N(20,1,C,5),N(23,1,A,4),N(26,2,G,4),N(30,1,E,4)]}
 };
 const busy=()=>persistBusy||exporting||rec.state!=='idle'||window.Jack22Voice?.state.active;
 function addPat(ti,name,fill){
  const tr=song.tracks[ti];if(tr.patterns.length>=32)throw Error('32 patterns au maximum sur la piste '+tr.label+'.');
  addPattern(ti);const p=tr.patterns[tr.patterns.length-1];
  let n=name,k=2;while(tr.patterns.some(x=>x!==p&&x.name===n))n=(name+' '+k++).slice(0,24);p.name=n.slice(0,24);fill(p);setActive(ti,tr.patterns.length-1);return p;
 }
 function applyAfro(key,opt){
  const s=AFRO[key];if(!s)return;
  if(busy())return say('Mode afro : attends la fin de l’opération en cours.');
  const need=[0,opt.bass?1:-1,opt.guitar?2:-1].filter(i=>i>=0);
  for(const i of need)if(song.tracks[i].patterns.length>=32)return say('Mode afro : la piste '+song.tracks[i].label+' a déjà 32 patterns.');
  remember();
  try{
   addPat(0,s.label,p=>{p.grid=s.drums.map(r=>r.slice());});
   if(opt.bass)addPat(1,s.label+' basse',p=>{p.bars=2;p.steps=32;p.notes=s.bass.map(n=>({...n,preset:'sub808'}));});
   if(opt.guitar)addPat(2,s.label+' guitare',p=>{p.bars=2;p.steps=32;p.notes=s.guitar.map(n=>({...n,preset:'guitar'}));});
   if(opt.tempo){const b=$c('bpm');b.value=String(s.bpm);b.dispatchEvent(new Event('input',{bubbles:true}));b.dispatchEvent(new Event('change',{bubbles:true}));}
   try{buildPatternUI();}catch(e){}try{tlBuild();}catch(e){}try{uiExp();}catch(e){}
  }catch(e){remember();return say('Mode afro : '+e.message);}
  remember();
  say('Mode afro « '+s.label+' » : patterns ajoutés et choisis'+(opt.tempo?', tempo '+s.bpm+' BPM':'')+'. Lance Play en mode PATTERN, ou pose-les dans l’arrangement. Ctrl+Z pour revenir.');
 }

 // ---------- Hardy Bay : égaliseur et compresseur par instrument (racks de la 11.5) ----------
 // Les racks de la 11.5 s'installent après le chargement : on les cherche au moment du clic.
 const racks=()=>{const R=window.JACK22_RACKS;return R&&typeof R.apply==='function'?R:null;},TAG='hb';
 const fx=(type,params)=>({id:TAG+type,type,on:true,params});
 const HB={
  equilibre:{drums:[fx('eq',{low:1,mid:0,high:1})],bass:[fx('eq',{low:1,mid:-2,high:-3})],melody:[fx('eq',{low:-3,mid:0,high:1})]},
  basses:{drums:[fx('eq',{low:0,mid:-1,high:0})],bass:[fx('eq',{low:3,mid:0,high:-2}),fx('comp',{threshold:-20,ratio:3,attack:10,release:150,makeup:2})],melody:[fx('eq',{low:-4,mid:-1,high:0})]},
  afro:{drums:[fx('eq',{low:1,mid:1,high:3}),fx('comp',{threshold:-18,ratio:3,attack:10,release:120,makeup:2})],bass:[fx('eq',{low:2,mid:-1,high:-3})],melody:[fx('eq',{low:-3,mid:1,high:1})]}
 };
 function hardy(key){
  const p=HB[key],R=racks();if(!p||!R)return'';
  R.apply(s=>{for(const ch of ['drums','bass','melody']){const mine=(s.chains[ch]||[]).filter(e=>!e.id.startsWith(TAG));const chain=[...mine,...(p[ch]||[]).map(e=>JSON.parse(JSON.stringify(e)))];if(chain.length>8)throw Error('Chaîne '+ch+' pleine (8 effets).');if(chain.length)s.chains[ch]=chain;else delete s.chains[ch];}});
  return' Égaliseur par instrument posé dans les racks (Batterie, 808 / Bass, Mélodie), sans toucher à tes propres effets.';
 }
 window.JACK22_PACKS_HOOKS=Object.assign(window.JACK22_PACKS_HOOKS||{},{hardy});
 const hbNote=[...document.querySelectorAll('#c93Packs .c93Note')].find(p=>/égaliseur par instrument/.test(p.textContent));
 if(hbNote)hbNote.textContent='Volumes du mixeur, plus un égaliseur (et un compresseur selon le preset) sur Batterie, 808 / Bass et Mélodie, visibles dans Chaînes d’effets & bus. Lecture arrêtée.';

 // ---------- Panneau : bloc AFRO dans les Packs, entrée dans le menu Outils ----------
 const panel=$c('c93Packs');
 if(panel){
  const b=document.createElement('div');b.className='c93Pack';b.id='c115Afro';
  const h=document.createElement('h3');h.textContent='MODE AFRO · RYTHMES';const sub=document.createElement('p');sub.className='c93Sub';sub.textContent='Ajoute un pattern de batterie, une basse 808 et un riff de guitare dans le style choisi (en la mineur). Tes patterns existants restent.';
  b.append(h,sub);
  const opts=document.createElement('div');opts.className='c115Opts';
  const box=(label,id,on)=>{const l=document.createElement('label');const i=document.createElement('input');i.type='checkbox';i.id=id;i.checked=on;l.append(i,document.createTextNode(label));opts.append(l);return i;};
  const oBass=box('Basse 808','c115Bass',true),oGtr=box('Guitare','c115Gtr',true),oTempo=box('Tempo du style','c115Tempo',true);
  const row=document.createElement('div');row.className='c93Row';
  for(const[k,s]of Object.entries(AFRO)){const x=document.createElement('button');x.type='button';x.textContent=s.label+' · '+s.bpm;x.dataset.c115Afro=k;x.addEventListener('click',()=>applyAfro(k,{bass:oBass.checked,guitar:oGtr.checked,tempo:oTempo.checked}));row.append(x);}
  const note=document.createElement('p');note.className='c93Note';note.textContent='Pour le son : Shire « Afro » sur la voix, Hardy Bay « Percussions afro » et Warlick « Master afro ». Le son Guitare est aussi dans le choix des sons du synthé.';
  b.append(row,opts,note);
  const hardyBlock=[...panel.querySelectorAll('.c93Pack')].pop();hardyBlock?hardyBlock.after(b):panel.append(b);
 }
 // Le menu « Outils ▾ » des espaces est créé après le chargement : l'entrée Packs est ajoutée à son ouverture.
 const isTools=d=>d instanceof HTMLDetailsElement&&/^Outils/.test(d.querySelector(':scope>summary')?.textContent.trim()||'');
 function menuEntry(menu){
  if(!panel||menu.querySelector('#c115PacksMenu'))return;const body=menu.querySelector('.j93Menu')||[...menu.querySelectorAll('button')].pop()?.parentElement;if(!body)return;
  const m=document.createElement('button');m.type='button';m.id='c115PacksMenu';m.textContent='Packs & mode afro';
  m.addEventListener('click',()=>{menu.open=false;openPacks();});
  body.prepend(m);
 }
 function openPacks(){window.JACK22_DOCK?.showPane('dockTools');window.JACK22_COMPACT?.choose($c('dockTools'),'packs');requestAnimationFrame(()=>panel.scrollIntoView({block:'start'}));}
 document.addEventListener('toggle',e=>{if(isTools(e.target)&&e.target.open)menuEntry(e.target);},true);
 for(const d of document.querySelectorAll('details'))if(isTools(d))menuEntry(d);
 window.JACK22_AFRO={version:'11.5-claude',AFRO,HB,applyAfro,hardy,openPacks};
})();
