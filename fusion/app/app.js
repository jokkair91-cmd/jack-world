'use strict';
const $=id=>document.getElementById(id), canvas=$('screen'), ctx=canvas.getContext('2d');
const tracks=['video','image','audio'];
let assets=[], clips=[], selected=null, history=[], time=0, playing=false, space='video', photo=null, last=0, projectName='Mon premier projet';
let mediaFilter='all', mix={video:1,audio:1,master:1,muteVideo:false,muteAudio:false};
let decoder=null;
const defaultPhoto=()=>({brightness:100,contrast:100,saturation:100,caption:'',captionVisible:true,adjustmentsVisible:true});
const uid=()=>crypto.randomUUID(), esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=id=>assets.find(a=>a.id===id), clip=()=>clips.find(c=>c.id===selected), end=()=>Math.max(0,...clips.map(c=>c.start+c.duration));
const stamp=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${(s%60).toFixed(1).padStart(4,'0')}`;
function status(s){$('status').textContent=s;}
function checkpoint(){history.push(JSON.stringify(clips));if(history.length>40)history.shift();$('undo').disabled=false;}
function projectFilename(){return projectName.replace(/[<>:"/\\|?*\u0000-\u001f]/g,'-').replace(/[. ]+$/g,'').slice(0,80)||'JACK-FUSION';}
function sameLane(a,b){return a.kind===b.kind&&(a.lane||0)===(b.lane||0);}
function canPlaceClip(c,start){return Number.isFinite(start)&&start>=0&&!clips.some(x=>x.id!==c.id&&sameLane(x,c)&&start<x.start+x.duration-.001&&start+c.duration>x.start+.001);}
function snappedStart(c,requested,zoom,enabled=true){
  const start=Math.max(0,requested);if(!enabled)return Math.round(start*100)/100;
  const anchors=[0,time,...clips.filter(x=>x.id!==c.id).flatMap(x=>[x.start,x.start+x.duration])];
  let best=start,distance=8/zoom;
  for(const anchor of anchors)for(const candidate of [anchor,anchor-c.duration]){
    const delta=Math.abs(candidate-start);
    if(candidate>=0&&delta<distance&&canPlaceClip(c,candidate)){best=candidate;distance=delta;}
  }
  return Math.round(best*100)/100;
}
function moveClip(c,start){
  if(!canPlaceClip(c,start)){status('Déplacement refusé : les clips d’une même piste ne peuvent pas se chevaucher.');return false;}
  if(Math.abs(c.start-start)<.001)return false;
  pause();checkpoint();c.start=start;selected=c.id;status(`Clip déplacé à ${stamp(start)}. Annuler permet de revenir en arrière.`);return true;
}
function bindClipDrag(button){
  button.onpointerdown=e=>{
    if(e.button!==0)return;
    const c=clips.find(x=>x.id===button.dataset.clip);if(!c)return;
    const origin=e.clientX,start=c.start,zoom=Number($('zoom').value),scroll=button.closest('.tracks-scroll');
    const scrollStart=scroll.scrollLeft;let target=start,moved=false,finished=false;
    pause();button.setPointerCapture(e.pointerId);
    function update(event){
      if(event.pointerId!==e.pointerId)return;
      const delta=event.clientX-origin+scroll.scrollLeft-scrollStart;
      if(Math.abs(delta)<4&&!moved)return;
      moved=true;event.preventDefault();
      target=snappedStart(c,start+delta/zoom,zoom,!event.altKey);
      button.style.left=target*zoom+'px';button.classList.add('dragging');
      button.classList.toggle('invalid-drop',!canPlaceClip(c,target));
      status(`Position : ${stamp(target)}${canPlaceClip(c,target)?' · Relâche pour déplacer.':' · Chevauchement : déplacement refusé.'}`);
    }
    function finish(cancel=false){
      if(finished)return;finished=true;
      button.removeEventListener('pointermove',update);button.removeEventListener('pointerup',up);button.removeEventListener('pointercancel',cancelled);button.removeEventListener('lostpointercapture',cancelled);document.removeEventListener('keydown',key);
      if(button.hasPointerCapture(e.pointerId))button.releasePointerCapture(e.pointerId);
      if(!moved)return;
      // Suppress the click synthesized after a drag, including on the lane beneath it.
      const swallow=event=>{event.preventDefault();event.stopImmediatePropagation();document.removeEventListener('click',swallow,true);};
      document.addEventListener('click',swallow,true);setTimeout(()=>document.removeEventListener('click',swallow,true),250);
      if(cancel)status('Déplacement annulé.');else moveClip(c,target);
      render();
    }
    function up(event){if(event.pointerId===e.pointerId){update(event);finish();}}
    function cancelled(){finish(true);}
    function key(event){if(event.key==='Escape'){event.preventDefault();finish(true);}}
    button.addEventListener('pointermove',update);button.addEventListener('pointerup',up);button.addEventListener('pointercancel',cancelled);button.addEventListener('lostpointercapture',cancelled);document.addEventListener('keydown',key);
  };
}
function pause(){playing=false;$('play').textContent='▶ Lecture';assets.forEach(a=>{if(a.el?.pause)a.el.pause();});}
function seek(t){pause();time=Math.max(0,Math.min(t,end()));draw();}
function fit(el){if(typeof el.readyState==='number'&&el.readyState<2)return;const w=el.videoWidth||el.naturalWidth,h=el.videoHeight||el.naturalHeight;if(!w||!h)return;const r=Math.min(canvas.width/w,canvas.height/h);ctx.drawImage(el,(canvas.width-w*r)/2,(canvas.height-h*r)/2,w*r,h*r);}
function draw(){
  ctx.fillStyle='#090a0d';ctx.fillRect(0,0,canvas.width,canvas.height);
  if(space==='photo'){
    const a=asset(photo);if(a?.el){ctx.filter=$('adjustments-visible').checked?`brightness(${$('brightness').value}%) contrast(${$('contrast').value}%) saturate(${$('saturation').value}%)`:'none';fit(a.el);ctx.filter='none';const text=$('caption').value.trim();if(text&&$('caption-visible').checked){ctx.font=`bold ${Math.round(canvas.width*.045)}px Segoe UI`;ctx.textAlign='center';ctx.lineWidth=canvas.width*.003;ctx.strokeStyle='#000b';ctx.fillStyle='white';ctx.strokeText(text,canvas.width/2,canvas.height*.88,canvas.width*.9);ctx.fillText(text,canvas.width/2,canvas.height*.88,canvas.width*.9);}}
  }else{
    for(const a of assets){if(a.el?.pause){const c=clips.find(c=>c.asset===a.id&&time>=c.start&&time<c.start+c.duration);if(!c){a.el.pause();continue;}const target=c.trim+time-c.start;if(Math.abs(a.el.currentTime-target)>(playing?.25:.025))a.el.currentTime=target;a.el.volume=c.volume*mix.master*(c.kind==='video'?(mix.muteVideo?0:mix.video):(mix.muteAudio?0:mix.audio));if(playing&&a.el.paused)a.el.play().catch(()=>{pause();status('Lecture refusée ou format non pris en charge. Réessaie avec un autre média.');});}}
    for(const kind of ['video','image'])for(const c of clips.filter(c=>c.kind===kind&&time>=c.start&&time<c.start+c.duration)){const a=asset(c.asset);if(a?.el)fit(a.el);}
  }
  if(space==='audio')drawWave();
  $('welcome').hidden=space==='photo'?!!asset(photo)?.el:clips.length>0;
  $('clock').textContent=`${stamp(time)} / ${stamp(end())}`;$('seek').max=Math.max(.1,end());$('seek').value=time;
  const cursor=document.querySelector('.cursor');if(cursor)cursor.style.left=`${125+time*Number($('zoom').value)}px`;
}
function frame(now){if(playing){time+=(now-last)/1000;if(time>=end()){time=end();pause();}}last=now;draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);
function showLibrary(){
  $('count').textContent=assets.length;$('library').innerHTML=assets.filter(a=>(mediaFilter==='all'||a.kind===mediaFilter)&&a.name.toLowerCase().includes($('search').value.toLowerCase())).map(a=>`<button class="media" data-id="${esc(a.id)}">${(a.thumbnail||(a.kind==='image'&&a.url))?`<img class="media-thumb" src="${esc(a.thumbnail||a.url)}" alt="">`:`<span class="media-icon ${a.kind}">${{video:'▶',audio:'♫',image:'▧'}[a.kind]}</span>`}<div><strong>${esc(a.name)}</strong><small>${a.el?(a.kind==='image'?'Photo · '+a.width+' × '+a.height:stamp(a.duration)):'Fichier à réimporter'}</small></div></button>`).join('');
  $('library').querySelectorAll('button').forEach(b=>b.onclick=()=>{const a=asset(b.dataset.id);if(!a.el)return status('Réimporte le fichier original pour le reconnecter au projet.');if(space==='photo'){if(a.kind!=='image')return status('Choisis une photo dans la médiathèque.');photo=a.id;restorePhoto();canvas.width=a.width;canvas.height=a.height;$('resolution').textContent=`${a.width} × ${a.height}`;draw();return;}addClip(a);});
}
function render(){
  const zoom=Number($('zoom').value),width=Math.max(700,end()*zoom+120);$('tracks').style.width=(width+125)+'px';
  $('tracks').innerHTML=(typeof timelineMarkup==='function'?timelineMarkup(zoom):tracks.map(kind=>`<div class="track"><div class="track-name">${{video:'▶ Vidéo',image:'▧ Images',audio:'♫ Audio'}[kind]}</div><div class="track-lane" data-kind="${kind}">${clips.filter(c=>c.kind===kind).map(c=>`<button class="clip ${kind}" data-clip="${esc(c.id)}" style="left:${c.start*zoom}px;width:${Math.max(4,c.duration*zoom)}px">${esc(asset(c.asset)?.name||'Média')}</button>`).join('')}</div></div>`).join(''))+'<div class="cursor"></div>';
  document.querySelectorAll('[data-clip]').forEach(b=>{b.onclick=e=>{e.stopPropagation();selected=b.dataset.clip;render();};bindClipDrag(b);});
  document.querySelectorAll('.track-lane').forEach(l=>l.onclick=e=>seek((e.clientX-l.getBoundingClientRect().left)/zoom));
  const c=clip();$('props').hidden=!c;$('nothing').hidden=!!c;$('remove').disabled=!c;$('split').disabled=!c;
  if(c){const a=asset(c.asset);$('clip-name').textContent=a?.name||'Média';for(const k of ['start','trim','duration'])$(k).value=c[k].toFixed(2);$('volume').value=Math.round(c.volume*100);$('trim').disabled=c.kind==='image';$('volume').disabled=c.kind==='image';$('bounds').textContent=c.kind==='image'?'La durée règle le temps d’affichage de la photo.':`Durée du fichier : ${stamp(a?.duration||0)}`;}
  $('undo').disabled=!history.length;if(typeof afterStudioRender==='function')afterStudioRender();draw();
}
function addClip(a){pause();checkpoint();const start=Math.max(0,...clips.filter(c=>c.kind===a.kind).map(c=>c.start+c.duration));const c={id:uid(),asset:a.id,kind:a.kind,start,trim:0,duration:a.kind==='image'?5:a.duration,volume:1};clips.push(c);selected=c.id;time=start;render();status('Média ajouté sur la piste '+{video:'vidéo',image:'images',audio:'audio'}[a.kind]+'.');}
function loadMedia(file){return new Promise((resolve,reject)=>{
  const kind=file.type.startsWith('image/')?'image':file.type.startsWith('video/')?'video':file.type.startsWith('audio/')?'audio':null;if(!kind)return reject(new Error('Type de fichier non pris en charge.'));
  const url=URL.createObjectURL(file),el=kind==='image'?new Image():document.createElement(kind);if(kind!=='image'){el.preload='auto';el.playsInline=true;}
  const timer=setTimeout(()=>fail(),20000);const fail=()=>{clearTimeout(timer);URL.revokeObjectURL(url);reject(new Error('Média illisible ou chargement trop long.'));};el.onerror=fail;
  const finish=duration=>{clearTimeout(timer);resolve({kind,el,url,duration:kind==='image'?5:duration,width:el.naturalWidth||el.videoWidth||0,height:el.naturalHeight||el.videoHeight||0});};
  el[kind==='image'?'onload':'onloadedmetadata']=()=>{
    if(kind==='image')return finish(5);
    if(Number.isFinite(el.duration)&&el.duration>0)return finish(el.duration);
    if(el.duration===Infinity){el.addEventListener('seeked',()=>{const duration=Number.isFinite(el.duration)?el.duration:el.currentTime;if(!Number.isFinite(duration)||duration<=0||duration>=1e9)return fail();el.currentTime=0;finish(duration);},{once:true});el.currentTime=1e10;return;}
    fail();
  };el.src=url;
});}
$('files').onchange=async e=>{pause();for(const file of e.target.files){status('Import de '+file.name+'…');try{const media=await loadMedia(file);if(media.kind==='audio')await decodeWave(file,media);const match=assets.find(a=>!a.el&&a.name===file.name&&a.size===file.size&&a.modified===file.lastModified);if(match)Object.assign(match,media);else assets.push({id:uid(),name:file.name,size:file.size,modified:file.lastModified,...media});if(typeof prepareThumbnail==='function')await prepareThumbnail(match||assets[assets.length-1]);showLibrary();render();status(file.name+' importé. Clique dessus pour l’utiliser.');}catch(err){status(file.name+' : '+err.message);}}e.target.value='';};
for(const id of ['import','import-more'])$(id).onclick=()=>$('files').click();
$('play').onclick=()=>{if(space==='photo')return status('L’espace Photo affiche une image fixe.');if(playing){pause();return;}if(!clips.length)return status('Ajoute d’abord un média sur une piste.');if(clips.some(c=>!asset(c.asset)?.el))return status('Des médias manquent : réimporte les originaux avant de lire le projet.');if(time>=end())time=0;playing=true;last=performance.now();$('play').textContent='❚❚ Pause';};
$('begin').onclick=()=>seek(0);$('seek').oninput=e=>seek(Number(e.target.value));$('zoom').oninput=render;
$('props').onsubmit=e=>{e.preventDefault();const c=clip();if(!c)return;const next={...c,...(typeof clipOptionsFromForm==='function'?clipOptionsFromForm():{}),start:Number($('start').value),trim:c.kind==='image'?0:Number($('trim').value),duration:Number($('duration').value),volume:Number($('volume').value)/100};if(typeof validateClipOptions==='function'&&!validateClipOptions(next))return status('Fondus invalides : leur somme ne doit pas dépasser la durée du clip.');if(![next.start,next.trim,next.duration,next.volume].every(Number.isFinite)||next.start<0||next.trim<0||next.duration<.1||next.volume<0||next.volume>1)return status('Valeurs invalides.');if(c.kind!=='image'&&next.trim+next.duration>asset(c.asset).duration+.015)return status('La sélection dépasse la fin du fichier.');if(clips.some(x=>x.id!==c.id&&sameLane(x,next)&&next.start<x.start+x.duration-.001&&next.start+next.duration>x.start+.001))return status('Ce clip chevaucherait un autre clip de la même piste. Choisis une autre position.');pause();checkpoint();Object.assign(c,next);render();status('Clip ajusté.');};
$('split').onclick=()=>{const c=clip();if(!c)return;const offset=time-c.start;if(offset<.1||offset>c.duration-.1)return status('Place le curseur à l’intérieur du clip sélectionné.');pause();checkpoint();clips.push({...c,id:uid(),start:time,trim:c.kind==='image'?0:c.trim+offset,duration:c.duration-offset});c.duration=offset;for(const x of [c,clips[clips.length-1]]){if(x.fadeIn||x.fadeOut){x.fadeIn=Math.min(x.fadeIn||0,x.duration/2);x.fadeOut=Math.min(x.fadeOut||0,x.duration/2);}}render();status('Clip coupé au curseur.');};
$('remove').onclick=()=>{if(!clip())return;pause();checkpoint();clips=clips.filter(c=>c.id!==selected);selected=null;time=Math.min(time,end());render();status('Clip retiré. Le fichier original est conservé.');};
$('undo').onclick=()=>{if(!history.length)return;pause();clips=JSON.parse(history.pop());selected=null;time=Math.min(time,end());render();status('Dernière modification annulée.');};
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
$('save').onclick=()=>{const data={format:'jack-fusion',version:1,name:projectName,assets:assets.map(({id,name,kind,duration,size,modified,width,height,photoSettings})=>({id,name,kind,duration,size,modified,width,height,photoSettings})),clips,mix,photo};download(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),projectFilename()+'.jackfusion');status('Projet sauvegardé. Garde les médias originaux : il faudra les réimporter à la réouverture.');};
$('open').onclick=()=>$('project-file').click();
$('project-name').onchange=()=>{projectName=$('project-name').value.trim().slice(0,80)||'Mon premier projet';$('project-name').value=projectName;status('Nom du projet mis à jour. Sauvegarde pour le conserver.');};
$('project-name').oninput=()=>{projectName=$('project-name').value.trim().slice(0,80)||'Mon premier projet';};
$('project-file').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const d=JSON.parse(await f.text());if(d.format!=='jack-fusion'||d.version!==1||!Array.isArray(d.assets)||!Array.isArray(d.clips)||d.assets.length>1000||d.clips.length>10000)throw Error('Format de projet invalide.');const ids=new Set();for(const a of d.assets){if(typeof a.id!=='string'||ids.has(a.id)||typeof a.name!=='string'||!tracks.includes(a.kind)||!Number.isFinite(a.duration)||a.duration<=0)throw Error('Média invalide.');ids.add(a.id);}const clipIds=new Set();for(const c of d.clips){const a=d.assets.find(a=>a.id===c.asset);if(typeof c.id!=='string'||clipIds.has(c.id)||!a||c.kind!==a.kind||![c.start,c.trim,c.duration,c.volume].every(Number.isFinite)||c.start<0||c.trim<0||c.duration<.1||c.volume<0||c.volume>1||(c.kind!=='image'&&c.trim+c.duration>a.duration+.015))throw Error('Clip invalide.');clipIds.add(c.id);}for(const k of tracks){const list=d.clips.filter(c=>c.kind===k).sort((a,b)=>a.start-b.start);if(list.some((c,i)=>i&&c.start<list[i-1].start+list[i-1].duration-.001))throw Error('Pistes avec chevauchements non prises en charge.');}if(clips.length&&!confirm('Remplacer le projet actuel ? Sauvegarde-le avant si nécessaire.'))return;pause();assets.forEach(a=>{if(a.url)URL.revokeObjectURL(a.url);});assets=d.assets.map(a=>({id:a.id,name:a.name,kind:a.kind,duration:a.duration,size:a.size,modified:a.modified,width:a.width,height:a.height,photoSettings:cleanPhoto(a.photoSettings)}));mix=cleanMix(d.mix);syncMixer();clips=d.clips.map(c=>({id:c.id,asset:c.asset,kind:c.kind,start:c.start,trim:c.trim,duration:c.duration,volume:c.volume}));projectName=typeof d.name==='string'?d.name:'Projet importé';$('project-name').value=projectName;history=[];selected=null;photo=assets.some(a=>a.id===d.photo&&a.kind==='image')?d.photo:null;restorePhoto();time=0;showLibrary();render();status('Projet ouvert. Réimporte les mêmes fichiers originaux pour reconnecter les médias aux pistes.');}catch(err){status('Ouverture impossible : '+err.message);}e.target.value='';};
document.querySelectorAll('nav [data-space]').forEach(b=>b.onclick=()=>{pause();space=b.dataset.space;document.body.dataset.space=space;$('audio-mixer').hidden=space!=='audio';document.querySelectorAll('nav [data-space]').forEach(x=>x.classList.toggle('active',x===b));$('photo-tools').hidden=space!=='photo';$('viewer-title').textContent={video:'MONITEUR DE MONTAGE',audio:'ÉCOUTE ET MONTAGE AUDIO',photo:'ATELIER PHOTO'}[space];if(space==='photo'){restorePhoto();const a=asset(photo);canvas.width=a?.width||1920;canvas.height=a?.height||1080;status('Choisis une photo dans la médiathèque.');}else{canvas.width=1920;canvas.height=1080;status(space==='audio'?'La piste audio se combine aux images et vidéos. Sélectionne un clip pour régler son volume.':'Espace de montage.');}$('resolution').textContent=`${canvas.width} × ${canvas.height}`;draw();});
for(const id of ['brightness','contrast','saturation','caption','caption-visible','adjustments-visible'])$(id).oninput=()=>{storePhoto();draw();};
$('export-photo').onclick=()=>{if(!asset(photo)?.el)return status('Sélectionne une photo avant de l’exporter.');draw();canvas.toBlob(blob=>{if(blob){download(blob,'JACK-FUSION-photo.png');status('Photo exportée en PNG.');}else status('Export impossible : image trop grande ou non prise en charge.');},'image/png');};
document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','BUTTON'].includes(e.target.tagName))return;if(e.code==='Space'){e.preventDefault();$('play').click();}});
render();

function cleanPhoto(s){const base=defaultPhoto();if(!s||typeof s!=='object')return base;for(const key of ['brightness','contrast','saturation']){const value=Number(s[key]);if(Number.isFinite(value))base[key]=Math.max(key==='saturation'?0:30,Math.min(key==='saturation'?200:180,value));}base.caption=typeof s.caption==='string'?s.caption.slice(0,500):'';base.captionVisible=s.captionVisible!==false;base.adjustmentsVisible=s.adjustmentsVisible!==false;return base;}
function restorePhoto(){const s=cleanPhoto(asset(photo)?.photoSettings);for(const key of ['brightness','contrast','saturation','caption'])$(key).value=s[key];$('caption-visible').checked=s.captionVisible;$('adjustments-visible').checked=s.adjustmentsVisible;}
function storePhoto(){const a=asset(photo);if(!a)return;a.photoSettings=cleanPhoto({brightness:Number($('brightness').value),contrast:Number($('contrast').value),saturation:Number($('saturation').value),caption:$('caption').value,captionVisible:$('caption-visible').checked,adjustmentsVisible:$('adjustments-visible').checked});}
$('photo-reset').onclick=()=>{const a=asset(photo);if(!a)return status('Choisis une photo.');a.photoSettings=defaultPhoto();restorePhoto();draw();status('Réglages photo réinitialisés.');};
$('search').oninput=showLibrary;
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{mediaFilter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));showLibrary();});
function cleanMix(s){const result={video:1,audio:1,master:1,muteVideo:false,muteAudio:false};if(!s||typeof s!=='object')return result;for(const key of ['video','audio','master'])if(Number.isFinite(s[key]))result[key]=Math.max(0,Math.min(1,s[key]));result.muteVideo=s.muteVideo===true;result.muteAudio=s.muteAudio===true;return result;}
function syncMixer(){for(const key of ['video','audio','master']){$('mix-'+key).value=Math.round(mix[key]*100);$('mix-'+key+'-value').textContent=Math.round(mix[key]*100)+' %';}for(const key of ['video','audio']){const muted=mix[key==='video'?'muteVideo':'muteAudio'];$('mute-'+key).textContent=muted?'Réactiver':'Couper';$('mute-'+key).setAttribute('aria-pressed',String(muted));}}
for(const key of ['video','audio','master'])$('mix-'+key).oninput=e=>{mix[key]=Number(e.target.value)/100;syncMixer();};
for(const key of ['video','audio'])$('mute-'+key).onclick=()=>{const prop=key==='video'?'muteVideo':'muteAudio';mix[prop]=!mix[prop];syncMixer();};
async function decodeWave(file,media){
  if(file.size>100*1024*1024){media.waveNote='Forme d’onde non calculée : fichier supérieur à 100 Mo.';return;}
  try{const AudioEngine=window.AudioContext||window.webkitAudioContext;if(!AudioEngine)return;decoder??=new AudioEngine();const data=await decoder.decodeAudioData(await file.arrayBuffer());const peaks=new Array(800).fill(0);for(let channel=0;channel<data.numberOfChannels;channel++){const samples=data.getChannelData(channel),step=Math.max(1,Math.ceil(samples.length/800));for(let i=0;i<800;i++){const stop=Math.min(samples.length,(i+1)*step);for(let j=i*step;j<stop;j++)peaks[i]=Math.max(peaks[i],Math.abs(samples[j]));}}media.peaks=peaks;}catch{media.waveNote='Forme d’onde indisponible pour ce format ; la lecture reste possible.';}
}
function drawWave(){
  const selectedClip=clip();const a=selectedClip?.kind==='audio'?asset(selectedClip.asset):assets.find(a=>a.kind==='audio'&&a.el);
  ctx.fillStyle='#10191f';ctx.fillRect(0,0,canvas.width,canvas.height);const w=canvas.width,h=canvas.height,pad=80,mid=h/2;
  ctx.strokeStyle='#25343e';ctx.lineWidth=2;for(let i=0;i<9;i++){const x=pad+(w-2*pad)*i/8;ctx.beginPath();ctx.moveTo(x,70);ctx.lineTo(x,h-100);ctx.stroke();}
  ctx.textAlign='left';ctx.fillStyle='#c5d5df';ctx.font='24px Segoe UI';ctx.fillText(a?a.name:'Aucun média audio sélectionné',pad,48,w-2*pad);
  if(a?.peaks){ctx.strokeStyle='#24b5c8';ctx.lineWidth=2;const gain=mix.audio*mix.master*(mix.muteAudio?0:1);for(let i=0;i<a.peaks.length;i++){const x=pad+i/(a.peaks.length-1)*(w-2*pad),amp=Math.max(1,a.peaks[i]*h*.32*gain);ctx.beginPath();ctx.moveTo(x,mid-amp);ctx.lineTo(x,mid+amp);ctx.stroke();}const current=clips.find(c=>c.asset===a.id&&time>=c.start&&time<c.start+c.duration);const sourceTime=current?current.trim+time-current.start:0;ctx.strokeStyle='#ff8128';ctx.lineWidth=4;const x=pad+sourceTime/a.duration*(w-2*pad);ctx.beginPath();ctx.moveTo(x,70);ctx.lineTo(x,h-100);ctx.stroke();ctx.fillStyle='#91a8b8';ctx.fillText('0:00',pad,h-55);ctx.textAlign='right';ctx.fillText(stamp(a.duration),w-pad,h-55);$('wave-status').textContent='Forme d’onde du fichier complet. La découpe se règle dans la timeline.';}else{ctx.textAlign='center';ctx.fillStyle='#8499a7';ctx.fillText(a?.waveNote||'Importe un fichier audio pour visualiser sa forme d’onde.',w/2,mid,w-2*pad);$('wave-status').textContent=a?.waveNote||'Importe un fichier audio pour afficher sa forme d’onde.';}
}

