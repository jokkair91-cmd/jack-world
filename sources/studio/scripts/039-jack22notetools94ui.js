
(()=>{'use strict';const panel=document.getElementById('roll'),bar=panel?.querySelector('.roll-bar'),T=window.JACK22_NOTE_TOOLS;if(!bar||!T)return;
const box=document.createElement('details');box.id='j94Tools';const summary=document.createElement('summary');summary.textContent='Éditer les notes ▾';box.append(summary);const menu=document.createElement('div');menu.className='j94Menu';menu.setAttribute('aria-label','Édition des notes');box.append(menu);bar.append(box);
const label=(text,values)=>{const l=document.createElement('label');l.append(document.createTextNode(text));const s=document.createElement('select');s.setAttribute('aria-label',text);for(const[v,t]of values){const o=document.createElement('option');o.value=v;o.textContent=t;s.append(o)}l.append(s);menu.append(l);return s};
const scope=label('Cible',[['selection','Note sélectionnée'],['all','Tout le pattern']]);
const status=document.createElement('p');status.className='j94Status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
const buttons=[];function row(){const r=document.createElement('div');r.className='j94Row';menu.append(r);return r}
function button(text,action,value,parent){const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',()=>apply(action,typeof value==='function'?value():value));parent.append(b);buttons.push(b)}
const trans=row();button('− octave','transpose',-12,trans);button('− ½ ton','transpose',-1,trans);button('+ ½ ton','transpose',1,trans);button('+ octave','transpose',12,trans);
const grid=label('Grille',[['1','1/16'],['2','1/8'],['4','1/4'],['8','1/2'],['16','1 mesure']]);grid.value='2';button('Recaler sur la grille','quantize',()=>Number(grid.value),row());
const offset=label('Décaler la copie',[['1','1 pas'],['2','2 pas'],['4','1 temps'],['8','2 temps'],['16','1 mesure']]);offset.value='4';button('Dupliquer','duplicate',()=>Number(offset.value),row());
const force=label('Force',[['1','100 %'],['0.75','75 %'],['0.5','50 %'],['0.25','25 %']]);button('Rapprocher de la grille','quantizeSoft',()=>({grid:Number(grid.value),strength:Number(force.value)}),row());
const hum=label('Humaniser : placement',[['5','± 5 ms'],['10','± 10 ms'],['20','± 20 ms'],['35','± 35 ms']]);hum.value='10';const hv=label('Humaniser : vélocité',[['0','inchangée'],['5','± 5'],['10','± 10'],['20','± 20']]);hv.value='10';button('Humaniser','humanize',()=>({timing:Math.min(.45,Number(hum.value)/1000/stepSec()),velocity:Number(hv.value),seed:Math.floor(Math.random()*2147483647)}),row());
{const fine=row(),fin=t=>{const l=document.createElement('label');l.append(document.createTextNode(t));const i=document.createElement('input');i.type='number';i.style.width='64px';i.setAttribute('aria-label',t);l.append(i);fine.append(l);return i;},fStart=fin('Début (pas)'),fOff=fin('Décalage (ms)'),fDur=fin('Durée (pas)'),fVel=fin('Vélocité'),fb=document.createElement('button');fOff.step='0.1';fb.type='button';fb.textContent='Appliquer à la note sélectionnée';fb.addEventListener('click',()=>{const prev=scope.value;scope.value='selection';const n=rollSel,ms=Number(fOff.value),same=n&&Math.abs(ms-Math.round((n.off||0)*stepSec()*10000)/10)<0.05;apply('set',{start:Number(fStart.value),off:same?(n.off||0):ms/1000/stepSec(),dur:Number(fDur.value),velocity:Number(fVel.value)});scope.value=prev;});fine.append(fb);buttons.push(fb);
 window.C129Fill=()=>{const n=rollSel;for(const i of [fStart,fOff,fDur,fVel])i.disabled=!n;fb.disabled=!n||locked();if(!n){fStart.value=fOff.value=fDur.value=fVel.value='';return;}fStart.value=n.start;fOff.value=Math.round((n.off||0)*stepSec()*10000)/10;fDur.value=n.dur;fVel.value=n.velocity??100;};
 box.addEventListener('toggle',()=>{if(box.open)window.C129Fill();});}
menu.append(status);
function locked(){return state!=='stopped'||persistBusy||exporting||rec.state!=='idle'||!!rollDrag||!!window.Jack22Voice?.state?.active||!!window.Jack22Lot3?.pending}
function place(){if(!box.open)return;const r=summary.getBoundingClientRect();menu.style.left=Math.max(8,Math.min(innerWidth-menu.offsetWidth-8,r.right-menu.offsetWidth))+'px';const room=innerHeight-r.bottom-12;menu.style.top=(room>=180?r.bottom+5:Math.max(8,r.top-menu.offsetHeight-5))+'px'}
box.addEventListener('toggle',()=>{if(box.open){status.textContent='';for(const b of buttons)b.disabled=locked();place()}});window.addEventListener('resize',place);window.addEventListener('scroll',place,true);
function commit(r,action,ids=[]){
 if(locked()){status.textContent='Arrête la lecture ou l’opération en cours avant de modifier les notes.';return false}
 if(!r.ok){status.textContent=r.error;return false}if(!r.changed){status.textContent='Aucun changement nécessaire.';return false}
 const H=window.Jack22Vision8;H?.remember();const snap=rollSnap(),oldNotes=roll.notes,oldSel=rollSel;rollPush(snap);
 const selectedIds=r.selectionIndices||(action==='duplicate'?ids.map((_,i)=>oldNotes.length+i):ids);
 const chosen=selectedIds.map(i=>r.notes[i]).filter(Boolean);
 try{roll.notes=r.notes;rollSel=scope.value==='all'?null:chosen[0]||null;rollChanged();window.JACK22_MULTI_NOTES?.replace(chosen);H?.remember();status.textContent=({duplicate:'Copie ajoutée.',quantize:'Notes recalées.',transpose:'Transposition appliquée.',length:'Longueurs réglées.',move:'Notes déplacées.',delete:'Notes supprimées.',paste:'Notes collées.',humanize:'Notes humanisées (placement et vélocité). Ctrl+Z pour revenir.',quantizeSoft:'Notes rapprochées de la grille.',set:'Note modifiée.'})[action]||'Notes modifiées.';window.C129Fill?.();return true}
 catch(e){roll.notes=oldNotes;rollSel=oldSel;rollUndoStack.pop();rollChanged();status.textContent='Modification annulée : '+e.message;return false}
}
function apply(action,value){
 if(locked()){status.textContent='Arrête la lecture ou l’opération en cours avant de modifier les notes.';return false}
 const index=roll.notes.indexOf(rollSel),ids=scope.value==='all'?roll.notes.map((_,i)=>i):scope.value==='multi'?(window.JACK22_MULTI_NOTES?.indices()||[]):index<0?[]:[index];
 return commit(T.transform(roll.notes,roll.steps,ids,action,value),action,ids);
}
document.addEventListener('pointerdown',e=>{if(box.open&&!box.contains(e.target))box.open=false});box.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();box.open=false;summary.focus()}});
window.JACK22_NOTE_EDITOR={version:'9.5-candidate',apply,commit,open(){box.open=true;place()}};
})();
