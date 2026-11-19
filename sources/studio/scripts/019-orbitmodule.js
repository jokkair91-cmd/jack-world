
(() => {
 'use strict';
 const $=id=>document.getElementById(id),all=(selector,root=document)=>[...root.querySelectorAll(selector)];
 // Small previews describe existing musical content; never change a note or add a block.
 function previewMarks(p,bars,max=2048){
  const out=[],total=Math.max(1,bars)*16,period=p.grid?16:Math.max(1,p.steps||p.bars*16||16);
  const pitches=p.grid?[]:(p.notes||[]).map(n=>(n.octave+1)*12+n.idx),lo=pitches.length?Math.min(...pitches):0,hi=pitches.length?Math.max(...pitches):12;
  for(let offset=0;offset<total&&out.length<max;offset+=period){
   if(p.grid){for(let r=0;r<p.grid.length;r++)for(let s=0;s<16&&out.length<max;s++)if(p.grid[r][s]&&offset+s<total)out.push({x:(offset+s)/total,y:(r+.5)/p.grid.length,w:Math.min(.6,total-offset-s)/total,h:.11});}
   else for(const n of p.notes||[]){if(out.length>=max)break;const start=offset+n.start;if(start<0||start>=total)continue;out.push({x:start/total,y:.15+.7*(hi-((n.octave+1)*12+n.idx))/Math.max(1,hi-lo),w:Math.max(0,Math.min(n.dur,total-start))/total,h:.065});}
  }
  return out;
 }
 function drawPreview(block){
  if(block.classList.contains('tl-aud')||block.classList.contains('orph')||typeof song==='undefined')return;
  const b=song.arrangement.find(b=>b.id===Number(block.dataset.id));if(!b)return;
  const ti=song.tracks.findIndex(t=>t.key===b.trackKey);if(ti<0)return;
  const p=song.tracks[ti].patterns.find(p=>p.id===b.patternId);if(!p)return;
  const w=Math.min(1600,Math.max(1,Math.round(block.clientWidth))),h=36;if(w<=1)return;
  let canvas=block.querySelector('.orbitNotePreview');if(!canvas){canvas=document.createElement('canvas');canvas.className='orbitNotePreview';canvas.setAttribute('aria-hidden','true');block.append(canvas);}
  canvas.width=w;canvas.height=h;const x=canvas.getContext('2d');if(!x)return;
  x.clearRect(0,0,w,h);x.fillStyle=getComputedStyle(block).color;
  for(const m of previewMarks(p,b.lengthBars)){x.fillRect(Math.round(m.x*w),Math.round(m.y*(h-8))+5,Math.max(1,m.w*w),Math.max(2,m.h*(h-8)));}
  block.classList.add('orbitHasPreview');
 }
 const tints=['#d5a34f','#a06bce','#54b99a','#519ec9','#69bdc9','#bd81a3'];
 function rowSource(row){{const hook=window.J22RowSource&&window.J22RowSource(row);if(hook)return hook;}const lane=row.querySelector('.tl-lane'),name=row.querySelector('b')?.textContent||'',match=name.match(/^VOIX\s+(\d)/);if(match)return $('cVoice'+match[1])?.querySelector('[data-action="mute"]');if(lane?.dataset.ti!==undefined)return document.querySelector('.mute[data-track-key="'+((typeof song!=='undefined'&&song.tracks[Number(lane.dataset.ti)])||{}).key+'"]');return $('audioMute');}
 function refreshRows(){
  all('#tlRows>.tl-row').forEach(row=>{
   const label=row.querySelector('.tl-label'),lane=row.querySelector('.tl-lane');if(!label||!lane)return;
   const title=label.querySelector('b')?.textContent||'',match=title.match(/^VOIX\s+(\d)/),ti=lane.dataset.ti,slot=match?Number(match[1]):0;
   const color=tints[slot?slot+2:ti!==undefined?Number(ti):3];row.style.setProperty('--lane-color',color);label.style.borderLeft='3px solid '+color;
   if(!label.querySelector('.orbitTrackIcon')){const icon=document.createElement('span');icon.className='orbitTrackIcon';icon.setAttribute('aria-hidden','true');icon.textContent=slot?'♩':ti==='0'?'◈':ti==='1'?'∿':ti==='2'?'▥':'≈';label.prepend(icon);}
   const proxy=label.querySelector('.dockRowMute'),source=rowSource(row);if(proxy){proxy.disabled=!source||source.disabled;proxy.setAttribute('aria-pressed',source?.getAttribute('aria-pressed')||'false');}
  });
 }
 let frame=null,paint=false;
 function schedule(previews=false){paint=paint||previews;if(frame!==null)return;frame=requestAnimationFrame(()=>{frame=null;refreshRows();if(paint){paint=false;all('#tlRows .tl-block').forEach(drawPreview);}});}
 new MutationObserver(()=>schedule(true)).observe($('tlRows'),{childList:true});
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(()=>schedule(true)).observe($('tlWrap'));
 all('[data-orbit-go]').forEach(button=>button.addEventListener('click',()=>window.JACK22_DOCK?.showPane(button.dataset.orbitGo,true)));
 // Menus close cleanly without swallowing the core Escape command for stopping a take.
 const popups=all('.dockPopup');
 popups.forEach(popup=>popup.addEventListener('toggle',()=>{if(popup.open)popups.forEach(other=>{if(other!==popup&&!other.contains(popup)&&!popup.contains(other))other.open=false;});}));
 document.addEventListener('pointerdown',event=>popups.forEach(popup=>{if(popup.open&&!popup.contains(event.target))popup.open=false;}));
 document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const popup=popups.find(p=>p.open);if(popup){popup.open=false;popup.querySelector('summary')?.focus();}});
 document.addEventListener('click',()=>schedule());
 document.addEventListener('change',()=>schedule(true));
 document.addEventListener('input',()=>schedule());
 all('.skinDial input[type=range],.dockRing input[type=range]').forEach(input=>{input.title='Glisser verticalement · Maj pour ajuster finement · flèches au clavier';});
 window.addEventListener('pageshow',()=>schedule(true));
 schedule(true);window.JACK22_ORBIT={version:'8.9-ORBITE',previewMarks,refreshRows,schedule};
})();

