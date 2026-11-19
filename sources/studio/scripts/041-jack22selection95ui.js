
(()=>{'use strict';const grid=document.getElementById('rollGrid'),box=document.getElementById('j94Tools'),menu=box?.querySelector('.j94Menu'),E=window.JACK22_NOTE_EDITOR,T=window.JACK22_NOTE_TOOLS;if(!grid||!menu||!E||!T)return;
let selected=new Set(),context=null,clipboard=[],lasso=null;
const info=document.createElement('p');info.className='j95SelectionStatus';info.setAttribute('aria-live','polite');menu.prepend(info);
const scopes=menu.querySelector('select[aria-label="Cible"]');const option=document.createElement('option');option.value='multi';option.textContent='Sélection multiple';scopes.append(option);
function current(){return activePat(rollTrack)}
function update(){const now=current();if(context!==now){selected.clear();context=now}selected=new Set([...selected].filter(n=>roll.notes.includes(n)));for(const el of grid.querySelectorAll('.rn'))el.classList.toggle('j95Selected',selected.has(roll.notes[Number(el.dataset.i)]));info.textContent=selected.size+' note'+(selected.size>1?'s':'')+' sélectionnée'+(selected.size>1?'s':'')}
function replace(notes){context=current();selected=new Set(notes.filter(n=>roll.notes.includes(n)));update()}
function indices(){update();return [...selected].map(n=>roll.notes.indexOf(n)).sort((a,b)=>a-b)}
function all(){replace(roll.notes);scopes.value='multi'}
function clear(){replace([]);rollSel=null;rollDraw()}
function locked(){return state!=='stopped'||persistBusy||exporting||rec.state!=='idle'||!!rollDrag||!!window.Jack22Voice?.state?.active||!!window.Jack22Lot3?.pending}
function copy(){const ix=indices();const r=T.copy(roll.notes,roll.steps,ix.length?ix:roll.notes.includes(rollSel)?[roll.notes.indexOf(rollSel)]:[]);if(!r.ok){info.textContent=r.error;return false}clipboard=r.notes;info.textContent=clipboard.length+' note(s) copiée(s), dans cette session.';return true}
function paste(){if(locked()){info.textContent='Arrête la lecture ou l’opération en cours.';return false}const bar=Number(at.value);if(!Number.isInteger(bar)||bar<1||bar>roll.bars){info.textContent='Choisis une mesure du pattern actif.';return false}const r=T.paste(roll.notes,roll.steps,clipboard,(bar-1)*16);return E.commit(r,'paste',r.selectionIndices||[])}
function button(text,fn,parent){const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',fn);parent.append(b);return b}
function row(){const el=document.createElement('div');el.className='j94Row';menu.append(el);return el}
let r=row();button('Tout sélectionner',all,r);button('Désélectionner',clear,r);
r=row();button('Copier',copy,r);button('Coller',paste,r);
const atLabel=document.createElement('label');atLabel.append(document.createTextNode('Coller à la mesure'));const at=document.createElement('input');at.type='number';at.min='1';at.max=String(roll.bars);at.step='1';at.value='1';at.style.width='65px';at.setAttribute('aria-label','Mesure de collage');atLabel.append(at);menu.append(atLabel);
const duration=document.createElement('select');duration.setAttribute('aria-label','Longueur des notes');for(const[v,t]of[[1,'1/16'],[2,'1/8'],[4,'1/4'],[8,'1/2'],[16,'1 mesure']]){const o=document.createElement('option');o.value=String(v);o.textContent=t;duration.append(o)}duration.value='2';const lab=document.createElement('label');lab.append(document.createTextNode('Longueur'),duration);menu.append(lab);button('Appliquer la longueur',()=>E.apply('length',Number(duration.value)),row());
r=row();button('← 1 pas',()=>E.apply('move',-1),r);button('1 pas →',()=>E.apply('move',1),r);button('Supprimer',()=>E.apply('delete',0),row());
box.addEventListener('toggle',()=>{if(box.open){at.max=String(roll.bars);update()}});
// Ctrl/Cmd-clic ou Maj-clic : sélection sans déplacer ni préécouter une note.
grid.addEventListener('pointerdown',e=>{
 if(e.button!==0)return;update();const el=e.target.closest('.rn'),n=el?roll.notes[Number(el.dataset.i)]:null;
 if(e.shiftKey||e.ctrlKey||e.metaKey){
  if(locked())return;e.preventDefault();e.stopImmediatePropagation();grid.focus({preventScroll:true});scopes.value='multi';
  if(n){selected.has(n)?selected.delete(n):selected.add(n);rollSel=selected.has(n)?n:null;update();return}
  const p=rollPos(e);lasso={x:p.x,y:p.y,keep:e.ctrlKey||e.metaKey?new Set(selected):new Set(),id:e.pointerId};const rect=document.createElement('div');rect.className='j95Lasso';lasso.el=rect;grid.append(rect);try{grid.setPointerCapture(e.pointerId)}catch{}return;
 }
 selected.clear();if(n)selected.add(n);scopes.value='selection';update();
},true);
grid.addEventListener('pointermove',e=>{if(!lasso)return;e.preventDefault();e.stopImmediatePropagation();const p=rollPos(e),x=Math.min(p.x,lasso.x),y=Math.min(p.y,lasso.y),w=Math.abs(p.x-lasso.x),h=Math.abs(p.y-lasso.y);Object.assign(lasso.el.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});selected=new Set(lasso.keep);for(const n of roll.notes){const nx=n.start*ROLL_CW,ny=(ROLL_HI-rollMidi(n))*ROLL_RH;if(nx<x+w&&nx+n.dur*ROLL_CW>x&&ny<y+h&&ny+ROLL_RH>y)selected.add(n)}update()},true);
function finish(e){if(!lasso)return;e.preventDefault();e.stopImmediatePropagation();const l=lasso;lasso=null;l.el.remove();try{grid.releasePointerCapture(l.id)}catch{}rollSel=[...selected][0]||null;update()}
grid.addEventListener('pointerup',finish,true);grid.addEventListener('pointercancel',finish,true);
grid.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select'))return;const key=e.key.toLowerCase();if((e.ctrlKey||e.metaKey)&&['a','c','v'].includes(key)){e.preventDefault();e.stopImmediatePropagation();if(key==='a')all();if(key==='c')copy();if(key==='v')paste()}else if(e.key==='Escape'){selected.clear();update()}else if((e.key==='Delete'||e.key==='Backspace')&&selected.size>1){e.preventDefault();e.stopImmediatePropagation();scopes.value='multi';E.apply('delete',0)}},true);
new MutationObserver(()=>{update()}).observe(grid,{childList:true});
window.JACK22_MULTI_NOTES={indices,replace,all,clear,copy,paste,get count(){return selected.size}};update();
})();
