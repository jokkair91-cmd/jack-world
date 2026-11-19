
(()=>{'use strict';const $=id=>document.getElementById(id),W=window.JACK22_WORKSPACE,stage=$('dockStage'),nav=$('j93Nav');if(!W||!stage||!nav)return;
const sub=nav.querySelector('.j93Subs'),bar=document.createElement('div');bar.id='j105EditorBar';bar.setAttribute('aria-label','Éditeur et patterns');
const controls=document.createElement('div');controls.className='j105PatternControls';
const track=document.createElement('select');track.id='j105Track';track.setAttribute('aria-label','Piste du pattern');
const pat=document.createElement('select');pat.id='j105Pattern';pat.setAttribute('aria-label','Pattern à modifier');
const mk=(txt,label,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=txt;b.title=label;b.setAttribute('aria-label',label);b.onclick=fn;return b;};
let current=2,group='compose',view='roll';
const add=mk('＋ Nouveau','Nouveau pattern',()=>addPattern(current)),dup=mk('Dupliquer','Dupliquer le pattern',()=>addPattern(current,activePat(current)));
const more=document.createElement('details'),sum=document.createElement('summary');sum.textContent='•••';sum.setAttribute('aria-label','Options du pattern');more.append(sum);
const menu=document.createElement('div');menu.id='j105PatternMenu';const name=document.createElement('input');name.type='text';name.maxLength=24;name.setAttribute('aria-label','Nom du pattern');const color=document.createElement('input');color.type='color';color.setAttribute('aria-label','Couleur du pattern');
const label=(txt,input)=>{const l=document.createElement('label');l.append(document.createTextNode(txt),input);return l;};
const del=mk('Supprimer le pattern','Supprimer le pattern',()=>{deletePattern(current);more.open=false;});del.className='j105Remove';menu.append(label('Nom',name),label('Couleur',color),del);more.append(menu);
controls.append(track,pat,add,dup,more);bar.append(controls);stage.append(bar);
function sync(){if(typeof song==='undefined')return;current=view==='beat'?0:Math.max(1,Math.min(rollTrack,song.tracks.length-1));const tr=song.tracks[current];if(!tr)return;track.replaceChildren(...song.tracks.map((t,i)=>{const o=new Option(t.label,String(i));o.selected=i===current;return o}));pat.replaceChildren(...tr.patterns.map((p,i)=>{const o=new Option(p.name,String(i));o.selected=i===tr.active;return o}));const a=activePat(current);name.value=a.name;color.value=a.color;add.disabled=dup.disabled=tr.patterns.length>=32;del.disabled=tr.patterns.length<=1;}
track.onchange=()=>{const ti=Number(track.value);more.open=false;if(ti===0)W.choose('compose','beat');else{$('rollTrack').value=String(ti);$('rollTrack').dispatchEvent(new Event('change',{bubbles:true}));W.choose('compose','roll');}sync();};
pat.onchange=()=>{setActive(current,Number(pat.value));sync();};
name.oninput=()=>{const value=name.value.trim();if(!value)return;activePat(current).name=value.slice(0,24);buildPatternUI();};
color.oninput=()=>{activePat(current).color=color.value;buildPatternUI();};
const oldBuild=buildPatternUI;buildPatternUI=function(...args){const r=oldBuild.apply(this,args);if(!name.matches(':focus'))sync();else{const a=activePat(current);const o=pat.options[pat.selectedIndex];if(o)o.textContent=a.name;}return r;};
function state(g,v){group=g;view=v;stage.classList.toggle('j105Compose',g==='compose');if(g==='compose'){bar.prepend(sub);sync();}else{nav.append(sub);more.open=false;}requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));}
document.addEventListener('j105view',e=>state(e.detail.group,e.detail.view));
const oldChoose=W.choose;W.choose=function(g,v){if(g==='compose'&&v==='patterns'){oldChoose(g,'roll');more.open=true;}else oldChoose(g,v);};
const oldExit=W.exit;W.exit=function(...a){more.open=false;nav.append(sub);return oldExit.apply(W,a);};
const split=document.createElement('div');split.id='j105Split';split.tabIndex=0;split.setAttribute('role','separator');split.setAttribute('aria-orientation','horizontal');split.setAttribute('aria-label','Répartir la hauteur arrangement et éditeur');split.setAttribute('aria-valuemin','25');split.setAttribute('aria-valuemax','75');stage.append(split);let ratio=.5,drag=null;
function setRatio(r){ratio=Math.max(.25,Math.min(.75,r));stage.style.setProperty('--j105-a',String(ratio*2)+'fr');stage.style.setProperty('--j105-b',String((1-ratio)*2)+'fr');split.setAttribute('aria-valuenow',String(Math.round(ratio*100)));}
setRatio(ratio);split.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();const a=$('timeline').getBoundingClientRect(),b=$(view==='beat'?'dockBeat':view==='rec'?'recorder':'roll').getBoundingClientRect();drag={y:e.clientY,ratio,total:a.height+b.height};try{split.setPointerCapture(e.pointerId)}catch{}};const moveSplit=e=>{if(drag)setRatio(drag.ratio+(e.clientY-drag.y)/drag.total)};const endSplit=()=>{drag=null;};window.addEventListener('pointermove',moveSplit);window.addEventListener('pointerup',endSplit);window.addEventListener('pointercancel',endSplit);split.onkeydown=e=>{if(['ArrowUp','ArrowDown','Home'].includes(e.key)){e.preventDefault();setRatio(e.key==='Home'?.5:ratio+(e.key==='ArrowDown'?.05:-.05));}};
document.addEventListener('pointerdown',e=>{if(!more.contains(e.target))more.open=false;});
const groupButtons=nav.querySelectorAll('.j93Groups button');['Composition','Voix & texte','Console'].forEach((t,i)=>{if(groupButtons[i])groupButtons[i].textContent=t;});
window.JACK22_BUILD='JACK22-10.5-CARTE-BLANCHE-CANDIDATE';window.JACK22_DESIGN={version:'10.5',setRatio,get ratio(){return ratio},sync};
})();
