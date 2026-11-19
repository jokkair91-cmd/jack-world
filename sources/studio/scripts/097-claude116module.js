
(() => {
 'use strict';
 // Touches lumineuses : la touche jouée prend la couleur de la note (couleur de son, comme dans le Piano Roll). Le son ne change pas.
 const col=document.getElementById('rollKeyCol'),piano=document.getElementById('piano'),preset=document.getElementById('preset');
 if(!col&&!piano)return;
 // Couleur d'un son : celle de ses notes dans le Piano Roll (lue dans les styles), sinon une couleur de secours.
 const FALLBACK={lead:'#22d3ee',bass:'#a78bfa',pad:'#34d399',pluck:'#fbbf24',sub808:'#f87171',guitar:'#fb7185'},cache={};
 function colorOf(key){
  if(cache[key])return cache[key];
  let c=FALLBACK[key]||'#f5a623';
  try{const probe=document.createElement('div');probe.className='rn p-'+key;probe.style.cssText='position:absolute;left:-99px;top:-99px;width:4px;height:4px';(document.getElementById('rollGrid')||document.body).append(probe);const bg=getComputedStyle(probe).backgroundColor;probe.remove();if(bg&&!/rgba\(0, 0, 0, 0\)|transparent/.test(bg))c=bg;}catch(e){}
  return cache[key]=c;
 }
 // Hauteur de la barre « Clavier » (jusqu'au haut du piano) et message des prises au repos.
 const synth=document.getElementById('synth'),recStatus=document.getElementById('recStatus');
 const bar=()=>{if(synth&&piano&&piano.offsetWidth)synth.style.setProperty('--c116Bar',Math.max(30,piano.getBoundingClientRect().top-synth.getBoundingClientRect().top-4)+'px');};
 const idle=()=>{if(recStatus)recStatus.classList.toggle('c116Idle',/^\s*Prêt/.test(recStatus.textContent)&&!/enregistre/i.test(recStatus.textContent));};
 if(synth&&piano){new ResizeObserver(()=>requestAnimationFrame(bar)).observe(synth);addEventListener('resize',bar);document.addEventListener('click',()=>setTimeout(bar,50),true);setInterval(()=>{if(!document.hidden)bar();},1500);bar();}
 if(recStatus){new MutationObserver(idle).observe(recStatus,{childList:true,characterData:true,subtree:true});idle();}
 const syncDown=()=>{if(piano&&preset)piano.style.setProperty('--c116C',colorOf(preset.value));};
 preset?.addEventListener('change',syncDown);syncDown();
 const lit=new Map();
 function light(midi,on,color){
  const els=[];
  if(col&&typeof ROLL_HI==='number'){const k=col.children[ROLL_HI-midi];if(k&&k.classList.contains('roll-key'))els.push(k);}
  if(piano&&typeof octave==='number'){const i=midi-(octave+1)*12,k=piano.querySelector('.key[data-i="'+i+'"]');if(k)els.push(k);}
  for(const el of els){const n=(lit.get(el)||0)+(on?1:-1);
   if(n>0){lit.set(el,n);if(color)el.style.setProperty('--c116C',color);el.classList.add('c116Lit');}
   else{lit.delete(el);el.classList.remove('c116Lit');el.style.removeProperty('--c116C');}}
 }
 const install=window.J97InstallEngine;
 window.J97InstallEngine=function(E,S){
  if(install)install.apply(this,arguments);
  const ctx=E.ctx;if(!ctx||(typeof OfflineAudioContext!=='undefined'&&ctx instanceof OfflineAudioContext))return;   // export WAV : rien à allumer
  const schedule=E.scheduleNote;if(typeof schedule!=='function')return;
  E.scheduleNote=function(key,oct,idx,tStart,tEnd){
   const v=schedule.apply(this,arguments);
   const midi=(oct+1)*12+idx,now=ctx.currentTime,on=Math.max(0,(tStart-now)*1000),off=Math.max(on+60,(tEnd-now)*1000),c=colorOf(key);
   if(off<20000){setTimeout(()=>light(midi,true,c),on);setTimeout(()=>light(midi,false),off);}
   return v;
  };
 };
 // Arrêt : on éteint tout ce qui reste allumé.
 document.getElementById('stop')?.addEventListener('click',()=>{for(const el of lit.keys()){el.classList.remove('c116Lit');el.style.removeProperty('--c116C');}lit.clear();});
 window.JACK22_PIANO={version:'11.5-claude-piano-maquette',light,colorOf};
})();
