
/* M4 (Claude) : tête de lecture rouge déplaçable, lecture depuis sa position, déplacement fin au clavier,
   et section « Montage non destructif » dans Pistes audio & montage précis. */
(()=>{'use strict';
const $=id=>document.getElementById(id),E=()=>window.JACK22_AUDIO_EDIT;
let cursor=0,focus=false,rulerDrag=false;
window.C128Focus=()=>{focus=true;};
document.addEventListener('pointerdown',e=>{focus=!!e.target.closest?.('#timeline');if(focus&&!e.target.closest('.tl-aud')&&!e.ctrlKey&&!e.shiftKey&&!e.metaKey)E()?.clearSelection();},true);
// Tête de lecture : visible à l'arrêt (mode SONG), elle marque où Play reprend.
function showCursor(){const h=$('tlHead');if(!h||state==='playing')return;if(playMode!=='song'){h.style.display='none';h.classList.remove('c128Cursor');return;}h.classList.add('c128Cursor');h.style.display='block';const lane=document.querySelector('#tlRows .tl-lane'),inner=$('tlInner'),num=document.querySelector('#tlRows .tl-ruler .tl-num'),lr=lane&&lane.getBoundingClientRect(),ir=inner&&inner.getBoundingClientRect(),bw=num&&num.getBoundingClientRect().width||TL_BAR_W,x0=lr&&lr.width?lr.left-ir.left:TL_LABEL_W;h.style.left=(x0+cursor/16*bw)+'px';}
const move0=tlMoveHead,hide0=tlHideHead;
tlMoveHead=function(abs){const h=$('tlHead');if(state!=='playing'){showCursor();return;}h?.classList.remove('c128Cursor');return move0(abs);};
tlHideHead=function(){hide0();showCursor();};
function setCursor(abs,jump){cursor=Math.max(0,Math.min(song.bars*16-1,Math.round(abs)));if(state==='paused')resumeAbs=cursor;showCursor();try{setStatus('Tête de lecture : mesure '+(Math.floor(cursor/16)+1)+', pas '+(cursor%16+1)+' ('+(cursor*stepSec()).toFixed(2)+' s). Play part d’ici.');}catch(e){}if(jump&&state==='playing'){stop();start(cursor);}}
function rulerAbs(e){const n=document.querySelector('#tlRows .tl-ruler .tl-num');if(!n)return null;const nr=n.getBoundingClientRect();return (e.clientX-nr.left)/(nr.width||TL_BAR_W)*16;}
$('tlRows').addEventListener('pointerdown',e=>{if(e.button!==0||!e.target.closest('.tl-ruler')||e.target.closest('.tl-label'))return;const a=rulerAbs(e);if(a===null)return;if(playMode!=='song')setMode('song');rulerDrag=true;try{e.target.setPointerCapture(e.pointerId);}catch(x){}setCursor(a,false);e.preventDefault();});
$('tlRows').addEventListener('pointermove',e=>{if(!rulerDrag)return;const a=rulerAbs(e);if(a!==null)setCursor(a,false);});
for(const ev of ['pointerup','pointercancel'])$('tlRows').addEventListener(ev,e=>{if(!rulerDrag)return;rulerDrag=false;const a=rulerAbs(e);setCursor(a===null?cursor:a,true);});
$('play').onclick=()=>{if(state==='playing')pause();else if(playMode==='song'&&!song.arrangement.length&&!audioClips.some(c=>c.buffer))setStatus('Timeline vide : place un bloc, ou repasse en mode PATTERN');else start(state==='paused'?resumeAbs:(playMode==='song'?cursor:0));};
// Clavier dans la timeline : ←/→ = 1/16, Maj = 1 mesure, Alt = 10 ms ; S = couper à la tête de lecture.
document.addEventListener('keydown',e=>{if(!focus||e.ctrlKey||e.metaKey||e.target.closest?.('input,textarea,select,[contenteditable="true"],dialog'))return;const ed=E();if(!ed)return;const sel=ed.selection;if(!sel.length)return;
 if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();e.stopImmediatePropagation();const d=(e.key==='ArrowLeft'?-1:1)*(e.altKey?.01:(e.shiftKey?16:1)*stepSec());try{ed.nudge(sel,d);audioMsg(sel.length+' clip(s) déplacé(s) de '+(d*1000).toFixed(0)+' ms.');}catch(err){audioMsg(err.message);}return;}
 if((e.key==='s'||e.key==='S')&&!e.altKey&&sel.length===1){e.preventDefault();e.stopImmediatePropagation();ed.splitAt(sel[0],cursor*stepSec()).then(()=>audioMsg('Clip coupé en deux à la tête de lecture, sans toucher au fichier.')).catch(err=>audioMsg(err.message));}
},true);
// Section de la fenêtre « Pistes audio & montage précis ».
window.C128Section=(body,c,say,rerender)=>{const ed=E();if(!ed)return;const box=document.createElement('div');box.id='c128Box';const h=document.createElement('h3');h.textContent='Montage non destructif';box.append(h);body.append(box);
 const row=()=>{const r=document.createElement('div');r.className='j99Row';box.append(r);return r;},num=(text,v,r)=>{const l=document.createElement('label');l.append(document.createTextNode(text));const i=document.createElement('input');i.type='number';i.min=0;i.step=.001;i.value=String(+(+v).toFixed(3));l.append(i);r.append(l);return i;},btn=(text,fn,r)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=async()=>{try{await fn();}catch(e){say(e.message);}};r.append(b);return b;};
 if(c){const e=ed.editOf(c.id),k=ed.clipEdit(c.id),r=row(),a=num('Début retiré (s)',e.trimIn,r),b=num('Fin retirée (s)',e.trimOut,r),fi=num('Fondu d’entrée (s)',e.fadeIn,r),fo=num('Fondu de sortie (s)',e.fadeOut,r);
  btn('Appliquer le montage',()=>{ed.setEdit(c.id,{trimIn:Number(a.value),trimOut:Number(b.value),fadeIn:Number(fi.value),fadeOut:Number(fo.value)});rerender();say('Montage appliqué (écoute et WAV). Le fichier d’origine reste entier.');},r);
  btn('Tout remettre',()=>{ed.setEdit(c.id,{trimIn:0,trimOut:0,fadeIn:0,fadeOut:0});rerender();say('Clip remis entier, sans fondu.');},r);
  const r2=row(),info=document.createElement('span');info.textContent='Durée jouée : '+k.len.toFixed(3)+' s'+(k.cut?' (raccourci par le clip suivant)':'')+' · tête de lecture à '+(cursor*stepSec()).toFixed(3)+' s';r2.append(info);
  btn('Couper à la tête de lecture',async()=>{await ed.splitAt(c.id,cursor*stepSec());rerender();say('Clip coupé en deux à la tête de lecture.'+(c.voice?' Voix : les deux parties sont rendues dans de nouveaux fichiers (la prise reste conservée).':' Les deux parties lisent le même fichier.'));},r2);}
 const r3=row(),l=document.createElement('label');l.append(document.createTextNode('Chevauchements sur une même piste '));const s=document.createElement('select');for(const [v,t] of [['mix','les clips se mélangent'],['cut','le clip suivant coupe le précédent']]){const o=document.createElement('option');o.value=v;o.textContent=t;s.append(o);}s.value=ed.overlap;l.append(s);r3.append(l);btn('Appliquer la règle',()=>{ed.setOverlap(s.value);rerender();say('Règle des chevauchements enregistrée dans le projet (écoute et WAV).');},r3);
 const ov=ed.overlaps(),p=document.createElement('p');p.textContent=ov.length?'Chevauchements actuels : '+ov.map(o=>'« '+(audioClips.find(x=>x.id===o.a)?.name||'?')+' » / « '+(audioClips.find(x=>x.id===o.b)?.name||'?')+' » ('+o.sec.toFixed(2)+' s)').join(' ; ')+'. Ils sont entourés de pointillés sur la timeline.':'Aucun chevauchement entre clips d’une même piste.';box.append(p);
 const p2=document.createElement('p');p2.textContent='Timeline : clic ou glisser sur la règle des mesures = tête de lecture rouge (Play part d’ici). Clip sélectionné : ←/→ = 1/16, Maj = 1 mesure, Alt = 10 ms ; S = couper à la tête de lecture. Tout est annulable (Ctrl+Z) et enregistré avec le projet.';box.append(p2);};
window.JACK22_C128={get cursor(){return cursor;},setCursor:a=>setCursor(a,true),version:'11.5-claude-m4'};
showCursor();
})();
