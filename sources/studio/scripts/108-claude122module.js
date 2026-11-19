
/* Claude — ouvrir un écran depuis l'adresse, pour les captures (Edge sans fenêtre ne peut pas cliquer).
   #studio, #batterie, #pianoroll, #voix, #console ; ajouter « -demo » (ex. #pianoroll-demo) pose un pattern afro et la voix
   de démo pour que l'écran ne soit pas vide. Sans adresse spéciale, rien ne change. */
(() => {
 'use strict';
 const m=/^#(studio|batterie|pianoroll|voix|console|coller)(-demo)?$/.exec(location.hash);if(!m)return;
 const VIEWS={studio:['compose','arrange'],batterie:['compose','beat'],pianoroll:['compose','roll'],voix:['voice','record'],console:['mix','mixer'],coller:['compose','roll']};
 const wait=setInterval(async()=>{
  const W=window.JACK22_WORKSPACE;if(!W||!W.on)return;clearInterval(wait);
  if(m[2]){
   try{window.JACK22_AFRO?.applyAfro('afrobeats',{bass:true,guitar:true,tempo:true});}catch(e){}
   // Arrangement de démonstration : les patterns posés sur les mesures 1 à 16.
   try{if(!song.arrangement.length){for(let ti=0;ti<3;ti++){const tr=song.tracks[ti],p=tr.patterns[tr.active];for(const b of (ti===2?[4,8,12]:[0,4,8,12]))song.arrangement.push({id:song.nextId++,trackKey:tr.key,patternId:p.id,startBar:b,lengthBars:4});}tlBuild();}}catch(e){}
   try{if(!audioClips.some(c=>c.voice))document.getElementById('l3Demo')?.click();}catch(e){}
   const lyr=document.getElementById('cLyrics');if(lyr&&!lyr.value){lyr.value='[Couplet 1]\nEncore une nuit à chercher des réponses\nDans le silence, mes doutes résonnent\nJ’avance, même si la route est longue\nEt dans ma tête, la musique prolonge\n\n[Refrain]\nC’est plus fort que moi, ça me ramène à toi\nMême quand tout s’efface, je garde ta voix';lyr.dispatchEvent(new Event('input',{bubbles:true}));}
  }
  W.choose(...VIEWS[m[1]]);
  // #coller : la fenêtre « Coller des notes » ouverte avec une réponse d'IA en exemple.
  if(m[1]==='coller'&&window.JACK22_COLLER){setTimeout(()=>{window.JACK22_COLLER.open();const ta=document.querySelector('#c124Dlg textarea');if(ta){ta.value='Voici une mélodie afro en la mineur sur 2 mesures :\n```json\n[\n  {"midi":69,"time":0,"duration":0.5,"velocity":0.9},\n  {"midi":72,"time":0.75,"duration":0.25},\n  {"midi":76,"time":1,"duration":1},\n  {"midi":74,"time":2.5,"duration":0.5},\n  {"midi":72,"time":3,"duration":1},\n  {"midi":69,"time":4,"duration":0.5},\n  {"midi":67,"time":4.75,"duration":0.25},\n  {"midi":69,"time":5,"duration":2}\n]\n```';ta.dispatchEvent(new Event('input'));}},400);}
  if(m[1]==='pianoroll'){const w=document.getElementById('rollWrap');if(w&&typeof ROLL_RH==='number')setTimeout(()=>{w.scrollTop=(95-78)*ROLL_RH;},300);}
 },200);
 setTimeout(()=>clearInterval(wait),20000);
})();
