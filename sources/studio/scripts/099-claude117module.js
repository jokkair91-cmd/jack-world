
(() => {
 'use strict';
 const $c=id=>document.getElementById(id);
 const el=(tag,props={},kids=[])=>{const e=document.createElement(tag);Object.assign(e,props);e.append(...kids);return e;};

 // ---------- Niveau d'entrée : lecture seule du flux du micro (rien n'est branché sur la sortie, la prise ne change pas) ----------
 let analyser=null,meterCtx=null,stream=null;
 const md=navigator.mediaDevices;
 if(md&&typeof md.getUserMedia==='function'){
  const gum=md.getUserMedia.bind(md);
  md.getUserMedia=function(c){return gum(c).then(s=>{try{if(s.getAudioTracks().length)watch(s);}catch(e){}return s;});};
 }
 const streams=new Set();
 function watch(s){
  stream=s;streams.add(s);try{meterCtx=meterCtx||new (window.AudioContext||window.webkitAudioContext)();if(meterCtx.state==='suspended')meterCtx.resume();
   const src=meterCtx.createMediaStreamSource(s);analyser=meterCtx.createAnalyser();analyser.fftSize=1024;src.connect(analyser);}catch(e){analyser=null;}
 }
 // Test du niveau : ouvre le micro choisi sans enregistrer ; « Couper » le referme. Le micro d'une prise n'est jamais coupé d'ici.
 let testStream=null;
 const isLive=s=>!!s&&s.getAudioTracks().some(t=>t.readyState==='live');
 window.JACK22_MIC={
  get live(){for(const s of streams){if(isLive(s))return true;streams.delete(s);}return false;},
  get testing(){return isLive(testStream);},
  async test(){
   if(!navigator.mediaDevices?.getUserMedia)throw Error('Micro indisponible ici : ouvre le studio dans Edge.');
   if(isLive(testStream))return;
   testStream=await navigator.mediaDevices.getUserMedia({audio:Object.assign({},window.JACK22_INPUT?.constraints?.()||{}),video:false});
  },
  stop(){if(testStream){testStream.getTracks().forEach(t=>t.stop());testStream=null;}}
 };
 // ---------- Ligne des messages seulement dans Studio (vue Arrangement) ; ailleurs, un message s'affiche 4 s en bulle ----------
 const stage=$c('dockStage'),status=$c('status'),toast=el('div',{id:'c117Toast',role:'status',ariaLive:'polite'});document.body.append(toast);
 let toastTimer=null;
 function msgLine(){
  const hide=document.body.classList.contains('j93Workspace')&&!!stage&&!stage.classList.contains('j108Arrange');
  if(document.body.classList.contains('c117NoMsg')!==hide){document.body.classList.toggle('c117NoMsg',hide);dispatchEvent(new Event('resize'));}
 }
 if(stage){new MutationObserver(msgLine).observe(stage,{attributes:true,attributeFilter:['class']});new MutationObserver(msgLine).observe(document.body,{attributes:true,attributeFilter:['class']});msgLine();}
 if(status)new MutationObserver(()=>{
  if(!document.body.classList.contains('c117NoMsg'))return;const t=status.textContent.trim();if(!t||/^Prêt\.?$/.test(t))return;
  if($c('cVoiceFeedback')?.offsetWidth)return;   // écran Voix : le message s'affiche déjà dans la colonne Prises voix
  // En bas à droite, juste au-dessus de la barre de transport : la bulle ne couvre aucun bouton du haut.
  const low=parseFloat(getComputedStyle(document.body).getPropertyValue('--c119Bottom'))||0;toast.style.top='auto';toast.style.bottom=Math.round(low+10)+'px';toast.textContent=t;toast.classList.add('on');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('on'),4000);
 }).observe(status,{childList:true,characterData:true,subtree:true});
 // Les panneaux de l'écran Voix & texte sont créés par la 11.5 après ce bloc : on attend qu'ils existent.
 const wait=setInterval(()=>{if($c('j109Mic')&&$c('cVoices')&&$c('cWords')){clearInterval(wait);init();}},250);
 setTimeout(()=>clearInterval(wait),60000);
 function init(){
 const mic=$c('j109Mic'),voices=$c('cVoices'),words=$c('cWords');
 const live=()=>analyser&&isLive(stream);
 const buf=new Float32Array(1024);
 function levelDb(){if(!live())return null;analyser.getFloatTimeDomainData(buf);let p=0;for(const v of buf)p=Math.max(p,Math.abs(v));return p>0?Math.max(-60,20*Math.log10(p)):-60;}
 const meter=el('div',{id:'c117Meter'});
 const head=el('div',{className:'c117Head'},[el('strong',{textContent:'Niveau d’entrée'}),el('span',{id:'c117Db',textContent:'micro fermé'})]);
 const fill=el('div',{className:'c117Fill'}),barEl=el('div',{className:'c117Bar',role:'meter',ariaLabel:'Niveau d’entrée du micro'},[fill]);
 const scale=el('div',{className:'c117Scale'},['-60','-48','-36','-24','-12','-6','0 dB'].map(t=>el('span',{textContent:t})));
 meter.append(head,barEl,scale);
 mic.append(meter);
 // Libellé « Entrée (micro) » au-dessus du choix du micro.
 const dev=$c('j106Device');if(dev&&!dev.previousElementSibling?.classList?.contains('c117Label'))dev.closest('.j106Row')?.before(el('span',{className:'c117Label',textContent:'Entrée (micro)'}));

 // ---------- Prises voix : chrono, nom de la prise, petit vumètre ----------
 const transport=$c('j113VoiceTransport');
 const clock=el('span',{id:'c117Clock',textContent:'00:00,000'}),take=el('span',{id:'c117Take'}),mini=el('span',{id:'c117Mini',ariaHidden:'true'});
 for(let i=0;i<5;i++){const b=el('i');b.style.height=(5+i*2.6)+'px';mini.append(b);}
 transport?.append(clock,take,mini);
 const tabName=()=>[...document.querySelectorAll('#j109VoiceTabs button')].find(b=>b.getAttribute('aria-pressed')==='true')?.textContent.trim()||'Lead';
 let recStart=0;
 const fmt=ms=>{const m=Math.floor(ms/60000),s=Math.floor(ms/1000)%60,r=Math.floor(ms%1000);return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')+','+String(r).padStart(3,'0');};
 // Règle de temps sous chaque forme d'onde (durée lue dans l'info de la voix : « 0:04 · … »).
 function rulers(){
  for(const card of voices.querySelectorAll('.cVoice')){
   const cv=card.querySelector('canvas');if(!cv)continue;const m=/^(\d+):(\d\d)/.exec(card.querySelector('.cVoiceInfo')?.textContent.trim()||'');
   const total=m?Number(m[1])*60+Number(m[2]):0;let r=cv.nextElementSibling;
   if(!r||!r.classList.contains('c117Ruler')){r=el('div',{className:'c117Ruler',ariaHidden:'true'});cv.after(r);}
   const key=String(total);if(r.dataset.t===key)continue;r.dataset.t=key;r.replaceChildren(...Array.from({length:7},(_,i)=>{const t=total*i/6;return el('span',{textContent:Math.floor(t/60)+':'+String(Math.round(t%60)).padStart(2,'0')});}));
  }
 }

 // ---------- Paroles : lignes numérotées (vue), le texte reste modifiable d'un clic ----------
 const area=$c('cLyrics'),grid=words.querySelector('.cLyricsGrid');
 const lines=el('div',{id:'c117Lines',role:'list',ariaLabel:'Paroles, lignes numérotées : clique une ligne pour la modifier'});
 grid?.append(lines);
 let curLine=0,lastText=null,tallest=0;
 function caretLine(){if(!area)return 0;return area.value.slice(0,area.selectionStart||0).split('\n').length-1;}
 function renderLines(){
  if(!area)return;const text=area.value;
  const show=text.trim().length>0&&document.activeElement!==area;
  if(area.offsetHeight>tallest)tallest=area.offsetHeight;if(show)lines.style.setProperty('--c117H',Math.max(tallest,300)+'px');
  lines.hidden=!show;grid.classList.toggle('c117Show',show);if(!show)return;
  const key=text+'|'+curLine;if(key===lastText)return;lastText=key;
  let n=0;lines.replaceChildren(...text.split('\n').map((t,i)=>{
   const sec=/^\s*\[.*\]\s*$/.test(t),row=el('div',{className:'c117L'+(sec?' sec':'')+(i===curLine?' cur':''),role:'listitem'});
   if(!sec&&t.trim())n++;
   row.append(el('b',{textContent:sec||!t.trim()?'':String(n)}),el('span',{textContent:sec?t.trim().replace(/^\[|\]$/g,''):t||' '}));
   row.addEventListener('click',()=>{const pos=text.split('\n').slice(0,i).join('\n').length+(i?1:0);curLine=i;lines.hidden=true;grid.classList.remove('c117Show');area.focus();area.setSelectionRange(pos+t.length,pos+t.length);});
   return row;}));
 }
 // Ligne en cours = ligne du curseur, relevée tant qu'on écrit (la vue numérotée revient quand on quitte le texte).
 if(area){const note=()=>{curLine=caretLine();lastText=null;};['blur','input','keyup','click','select'].forEach(t=>area.addEventListener(t,note));}
 lines.addEventListener('click',e=>{if(e.target===lines){lines.hidden=true;grid.classList.remove('c117Show');area?.focus();}});

 // ---------- Vitesse du prompteur : − 100 % + (100 % = vitesse d'origine) ----------
 const speed=$c('cSpeed');
 if(speed){
  const base=Number(speed.defaultValue||speed.value)||24,out=el('output',{ariaLive:'polite'});
  const set=d=>{const v=Math.min(Number(speed.max),Math.max(Number(speed.min),Number(speed.value)+d));speed.value=String(v);speed.dispatchEvent(new Event('input',{bubbles:true}));speed.dispatchEvent(new Event('change',{bubbles:true}));show();};
  const show=()=>{out.textContent=Math.round(Number(speed.value)/base*100)+' %';};
  const minus=el('button',{type:'button',textContent:'−',title:'Plus lent',ariaLabel:'Prompteur plus lent'}),plus=el('button',{type:'button',textContent:'+',title:'Plus rapide',ariaLabel:'Prompteur plus rapide'});
  minus.addEventListener('click',()=>set(-2));plus.addEventListener('click',()=>set(2));speed.addEventListener('input',show);
  const box=el('span',{className:'c117Speed'},[out,minus,plus]);speed.after(box);show();
 }

 // ---------- Boucle d'affichage (uniquement quand l'écran Voix & texte est visible) ----------
 let wasRec=false;
 function tick(){
  if(!document.hidden&&voices.offsetWidth){
   if(mic.lastElementChild!==meter)mic.append(meter);   // la 11.5 range ses réglages après coup : le niveau reste dessous
   const db=levelDb(),pct=db==null?0:Math.round((db+60)/60*100);
   fill.style.clipPath='inset(0 '+(100-pct)+'% 0 0)';$c('c117Db').textContent=db==null?'micro fermé':db.toFixed(1)+' dB';
   [...mini.children].forEach((b,i)=>{b.className=pct>(i+1)*18?(i>=4?'hot':'on'):'';});
   const st=window.Jack22Voice?.state||{},rec=!!st.active&&/rec|count|run|take/i.test(String(st.phase||'rec'));
   if(rec&&!wasRec)recStart=performance.now();wasRec=rec;
   clock.textContent=rec?fmt(performance.now()-recStart):'00:00,000';clock.classList.toggle('c117Rec',rec);
   if(rec||!window.JACK22_VOIX_MAQUETTE)take.textContent=tabName()+(rec?' – enregistrement':'');   // hors prise, le bloc 120 écrit « Lead – Prise N »
   rulers();renderLines();
  }
 }
 setInterval(tick,60);
 window.JACK22_VOIX={version:'11.5-claude-voix',levelDb,renderLines};
 }
})();
