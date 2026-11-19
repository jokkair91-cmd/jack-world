
/* Transformations de notes : fonctions pures, sans audio, sans accès au projet. */
(function(root){'use strict';
const clone=n=>Object.assign({},n),pitch=n=>(n.octave+1)*12+n.idx;
function error(message){return{ok:false,error:message}}
function check(notes,steps){
 if(!Number.isInteger(steps)||steps<1||!Array.isArray(notes)||notes.length>1000)return error('Pattern invalide ou limite de 1 000 notes dépassée.');
 const seen=new Set();for(const n of notes){if(!n||typeof n!=='object')return error('Note invalide.');const m=pitch(n);if(!Number.isInteger(n.start)||!Number.isInteger(n.dur)||n.dur<1||n.start<0||n.start+n.dur>steps||!Number.isInteger(n.octave)||!Number.isInteger(n.idx)||n.idx<0||n.idx>11||m<24||m>95||typeof n.preset!=='string')return error('Une note dépasse les limites du pattern.');const k=n.start+':'+m+':'+n.preset;if(seen.has(k))return error('Deux notes identiques se retrouveraient au même endroit.');seen.add(k)}return{ok:true}}
function targets(notes,indices){if(!Array.isArray(indices)||!indices.length)return null;const set=new Set(indices);if([...set].some(i=>!Number.isInteger(i)||i<0||i>=notes.length))return null;return[...set]}
function transform(notes,steps,indices,action,value){
 const valid=check(notes,steps);if(!valid.ok)return valid;const ids=targets(notes,indices);if(!ids)return error('Sélectionne une note, ou choisis « Tout le pattern ».');const next=notes.map(clone);let selected=ids[0];
 if(action==='transpose'){
  if(!Number.isInteger(value)||![-12,-1,1,12].includes(value))return error('Transposition invalide.');
  if(ids.some(i=>pitch(next[i])+value<24||pitch(next[i])+value>95))return error('Transposition refusée : une note sortirait de C1–B6.');
  for(const i of ids){const m=pitch(next[i])+value;next[i].octave=Math.floor(m/12)-1;next[i].idx=m%12}
 }else if(action==='quantize'){
  if(![1,2,4,8,16].includes(value))return error('Grille de quantification invalide.');
  for(const i of ids){const n=next[i],last=Math.floor((steps-n.dur)/value)*value;n.start=Math.max(0,Math.min(last,Math.round(n.start/value)*value));delete n.off}
 }else if(action==='duplicate'){
  if(!Number.isInteger(value)||value<1||value>steps)return error('Décalage de duplication invalide.');
  if(notes.length+ids.length>1000)return error('Duplication refusée : limite de 1 000 notes.');
  selected=next.length;for(const i of ids){const n=clone(notes[i]);n.start+=value;next.push(n)}
 }else if(action==='humanize'){
  /* M5 : placement (en fraction de pas) et vélocité varient au hasard, mais d'un tirage fixé (graine) : l'écoute, le WAV et la sauvegarde reprennent exactement les mêmes valeurs. */
  const t=value&&value.timing,v=value&&value.velocity,seed=value&&value.seed;if(!Number.isFinite(t)||t<0||t>0.45||!Number.isInteger(v)||v<0||v>40||!Number.isInteger(seed))return error('Humanisation invalide.');
  let s=seed>>>0;const rnd=()=>{s=(s+0x6D2B79F5)>>>0;let x=Math.imul(s^s>>>15,1|s);x=x+Math.imul(x^x>>>7,61|x)^x;return((x^x>>>14)>>>0)/4294967296*2-1};
  for(const i of ids){const n=next[i];let o=Math.max(-0.49,Math.min(0.49,(n.off||0)+rnd()*t));if(n.start+o<0)o=-n.start;o=Math.round(o*1e4)/1e4;if(Math.abs(o)<1e-4)delete n.off;else n.off=o;const dv=rnd()*v;if(v>0)n.velocity=Math.max(1,Math.min(127,Math.round((n.velocity??100)+dv)));}
 }else if(action==='quantizeSoft'){
  const g=value&&value.grid,k=value&&value.strength;if(![1,2,4,8,16].includes(g)||!(k>0&&k<=1))return error('Quantification invalide.');
  for(const i of ids){const n=next[i],e=n.start+(n.off||0),ne=e+(Math.round(e/g)*g-e)*k;let st=Math.round(ne),o=ne-st;const last=steps-n.dur;if(st>last){st=last;o=Math.min(o,0)}if(st<0){st=0;o=Math.max(o,0)}n.start=st;o=Math.round(Math.max(-0.49,Math.min(0.49,o))*1e4)/1e4;if(Math.abs(o)<1e-4)delete n.off;else n.off=o;}
 }else if(action==='set'){
  if(ids.length!==1)return error('Sélectionne une seule note pour l’édition fine.');const n=next[ids[0]],x=value||{};
  if(x.start!==undefined){if(!Number.isInteger(x.start))return error('Début : un nombre entier de pas.');n.start=x.start}
  if(x.dur!==undefined){if(!Number.isInteger(x.dur)||x.dur<1)return error('Durée : au moins 1 pas.');n.dur=x.dur}
  if(x.off!==undefined){if(!Number.isFinite(x.off)||Math.abs(x.off)>0.49)return error('Décalage : moins d’un demi-pas ('+Math.floor(0.49*stepSec()*1000)+' ms à ce tempo).');const o=Math.round(x.off*1e4)/1e4;if(Math.abs(o)<1e-4)delete n.off;else n.off=o}
  if(x.velocity!==undefined){if(!Number.isInteger(x.velocity)||x.velocity<1||x.velocity>127)return error('Vélocité : 1 à 127.');n.velocity=x.velocity}
  if(n.start+(n.off||0)<0)return error('La note commencerait avant le début du pattern.');
 }else return error('Commande inconnue.');
 const result=check(next,steps);if(!result.ok)return result;
 return{ok:true,notes:next,selected,changed:JSON.stringify(next)!==JSON.stringify(notes)};
}
const api={transform,validate:check};root.JACK22_NOTE_TOOLS=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

