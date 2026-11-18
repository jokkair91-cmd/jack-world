'use strict';
let laneSettings={};
const laneKey=(kind,lane)=>kind+':'+lane;
const laneData=c=>laneSettings[laneKey(c.kind,c.lane||0)]||{};
function laneLabel(kind,lane){
 const defaults={video:'Vidéo',image:'Images / titres',audio:'Audio'};
 return laneData({kind,lane}).name||defaults[kind]+' '+(lane+1);
}
function laneEnabled(c){
 const state=laneData(c);
 return !state.hidden&&(!Object.values(laneSettings).some(l=>l.solo&&!l.hidden)||state.solo);
}
function laneGain(c){return laneEnabled(c)?(laneData(c).volume??100)/100:0;}
const trackDialog=$('tracks-dialog');
function showTracks(){
 $('tracks-settings').innerHTML=tracks.flatMap(kind=>Array.from({length:laneCounts[kind]},(_,lane)=>{
   const key=laneKey(kind,lane),s=laneData({kind,lane});
   return `<fieldset data-lane-key="${key}"><legend>${esc(laneLabel(kind,lane))}</legend><label>Nom <input data-setting="name" maxlength="40" value="${esc(s.name||'')}" placeholder="${esc(laneLabel(kind,lane))}"></label><label><input type="checkbox" data-setting="locked" ${s.locked?'checked':''}> Verrouiller</label><label><input type="checkbox" data-setting="hidden" ${s.hidden?'checked':''}> Masquer / couper</label><label><input type="checkbox" data-setting="solo" ${s.solo?'checked':''}> Solo</label>${kind!=='image'?`<label>Volume (%) <input type="range" min="0" max="100" value="${s.volume??100}" data-setting="volume"></label>`:''}</fieldset>`;
 })).join('');
}
$('track-tools').onclick=()=>{pause();showTracks();trackDialog.showModal();};
$('tracks-close').onclick=()=>trackDialog.close();
$('tracks-settings').onchange=e=>{
 const field=e.target,setting=field.dataset.setting;
 if(!setting)return;
 const key=field.closest('fieldset').dataset.laneKey;
 laneSettings[key]??={};
 laneSettings[key][setting]=field.type==='checkbox'?field.checked:field.type==='range'?Number(field.value):field.value.trim();
 render();
};
function locked(c){
 if(!c||!laneData(c).locked)return false;
 status('Cette piste est verrouillée.');
 return true;
}
for(const id of ['split','remove']){
 const original=$(id).onclick;
 $(id).onclick=e=>{if(!locked(clip()))original(e);};
}
const oldBind=bindClipDrag;
bindClipDrag=button=>{
 oldBind(button);
 const original=button.onpointerdown;
 button.onpointerdown=e=>{if(!locked(clips.find(c=>c.id===button.dataset.clip)))original(e);};
};
$('ripple-remove').onclick=()=>{
 const c=clip();
 if(!c||locked(c))return;
 pause();checkpoint();
 clips=clips.filter(x=>x!==c);
 for(const x of clips)if(sameLane(c,x)&&x.start>=c.start+c.duration-.001)x.start=Math.max(c.start,x.start-c.duration);
 selected=null;time=Math.min(time,end());render();
 status('Clip retiré et espace refermé sur sa piste.');
};
const transformFields={x:[-100,100,0],y:[-100,100,0],scale:[10,400,100],angle:[-360,360,0],opacity:[0,100,100]};
function cleanTransform(value){
 return Object.fromEntries(Object.entries(transformFields).map(([key,[min,max,fallback]])=>[key,bounded(value?.[key],min,max,fallback)]));
}
const previousOptions=clipOptionsFromForm;
clipOptionsFromForm=()=>({...previousOptions(),transform:cleanTransform(Object.fromEntries(Object.keys(transformFields).map(key=>[key,$('transform-'+key).value])))});
const previousSubmit=$('props').onsubmit;
$('props').onsubmit=e=>{
 const c=clip();
 if(locked(c)||c&&locked({...c,lane:Number($('clip-lane').value)})){e.preventDefault();return;}
 previousSubmit(e);
};
const previousRender=afterStudioRender;
afterStudioRender=()=>{
 previousRender();
 const c=clip();
 $('ripple-remove').disabled=!c||laneData(c).locked;
 $('edit-title').disabled=!c||!asset(c.asset)?.generatedTitle||laneData(c).locked;
 if(c)for(const [key,value] of Object.entries(cleanTransform(c.transform)))$('transform-'+key).value=value;
};
canvas.addEventListener('pointerdown',event=>{
 const c=clip();
 if(event.button!==0||space!=='video'||!c||c.kind==='audio'||locked(c)||!laneEnabled(c)||time<c.start||time>=c.start+c.duration)return;
 pause();
 const bounds=canvas.getBoundingClientRect(),original=cleanTransform(c.transform);
 const displayScale=Math.min(bounds.width/canvas.width,bounds.height/canvas.height);
 const width=canvas.width*displayScale,height=canvas.height*displayScale;
 let next=original;
 canvas.setPointerCapture(event.pointerId);
 function move(e){next=cleanTransform({...original,x:original.x+(e.clientX-event.clientX)/width*100,y:original.y+(e.clientY-event.clientY)/height*100});c.transform=next;draw();}
 function finish(e){
   canvas.removeEventListener('pointermove',move);
   canvas.removeEventListener('pointerup',finish);
   canvas.removeEventListener('lostpointercapture',finish);
   c.transform=original;
   if(e.type==='pointerup'&&(next.x!==original.x||next.y!==original.y)){checkpoint();c.transform=next;}
   render();
 }
 canvas.addEventListener('pointermove',move);
 canvas.addEventListener('pointerup',finish);
 canvas.addEventListener('lostpointercapture',finish);
});
let editingTitle=null;
const createTitle=$('title-create').onclick;
$('add-title').addEventListener('click',()=>{editingTitle=null;});
$('edit-title').onclick=()=>{
 const c=clip(),a=c&&asset(c.asset);
 if(!a?.generatedTitle||locked(c))return;
 editingTitle=c.id;
 for(const key of ['text','color','position'])$('title-'+key).value=a.generatedTitle[key];
 $('title-dialog').showModal();
};
$('title-create').onclick=()=>{
 if(!editingTitle)return createTitle();
 const c=clips.find(x=>x.id===editingTitle),a=c&&asset(c.asset),text=$('title-text').value.trim();
 if(!a||!text||locked(c))return;
 const next={...a,id:uid(),name:'Titre · '+text.slice(0,30),generatedTitle:{text,color:$('title-color').value,position:$('title-position').value}};
 titleImage(next);checkpoint();assets.push(next);c.asset=next.id;
 editingTitle=null;$('title-dialog').close();showLibrary();render();status('Titre modifié.');
};
const oldSerialize=serializeProject;
serializeProject=()=>({...oldSerialize(),laneSettings});
const oldRestore=restoreProject;
restoreProject=async(data,ask)=>{
 const restored=await oldRestore(data,ask);
 if(!restored)return false;
 laneSettings={};
 for(const kind of tracks)for(let lane=0;lane<3;lane++){
   const key=laneKey(kind,lane),s=data.laneSettings?.[key];
   if(s&&lane<laneCounts[kind])laneSettings[key]={name:typeof s.name==='string'?s.name.slice(0,40):'',locked:s.locked===true,hidden:s.hidden===true,solo:s.solo===true,volume:bounded(s.volume,0,100,100)};
 }
 for(const c of clips)c.transform=cleanTransform(c.transform);
 render();return true;
};
render();

$('crossfade').onclick=()=>{
 const incoming=clip();
 if(!incoming||locked(incoming))return;
 const preceding=clips.filter(c=>sameLane(c,incoming)&&c!==incoming&&c.start+c.duration<=incoming.start+.001).sort((a,b)=>b.start-a.start)[0];
 if(!preceding||Math.abs(preceding.start+preceding.duration-incoming.start)>.025)return status('Place le clip juste après le précédent sur la même piste.');
 if(locked(preceding))return;
 const duration=Math.min(.5,incoming.duration/2,preceding.duration/2);
 const start=preceding.start+preceding.duration-duration;
 let target=null;
 for(let lane=(incoming.lane||0)+1;lane<3;lane++){
   const candidate={...incoming,lane,start};
   if(!laneData(candidate).locked&&canPlaceClip(candidate,start)){target=candidate;break;}
 }
 if(!target)return status('Il faut une piste libre au-dessus de la piste actuelle.');
 pause();checkpoint();
 incoming.lane=target.lane;incoming.start=start;incoming.fadeIn=duration;
 incoming.fadeOut=Math.min(incoming.fadeOut||0,incoming.duration-duration);
 if(preceding.kind!=='image'){
   preceding.fadeOut=duration;
   preceding.fadeIn=Math.min(preceding.fadeIn||0,preceding.duration-duration);
 }
 laneCounts[incoming.kind]=Math.max(laneCounts[incoming.kind],target.lane+1);
 time=start;render();status('Fondu ajouté à la jonction des deux clips.');
};
document.getElementById("preview-import").onclick=()=>document.getElementById("files").click();
