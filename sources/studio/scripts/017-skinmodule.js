
(() => {
  'use strict';
  // Presentation only: original controls dispatch their existing input handlers.
  const palette=['#bc91e5','#efae76','#74b7eb','#83cbb6','#e19ec9','#e1c26f'];
  const previous=new WeakMap();
  function nextColor(key,random=Math.random){
    const old=previous.get(key);let choices=palette.filter(color=>color!==old);
    const value=choices[Math.min(choices.length-1,Math.floor(Math.max(0,random())*choices.length))];
    previous.set(key,value);key.style.setProperty('--press-color',value);return value;
  }
  function updateKeys(records){
    records.forEach((record,index)=>{
      if(record.attributeName!=='class')return;
      const key=record.target;
      const next=records.slice(index+1).find(other=>other.target===key&&other.attributeName==='class');
      const before=String(record.oldValue||'').split(/\s+/).includes('down');
      const after=next?String(next.oldValue||'').split(/\s+/).includes('down'):key.classList.contains('down');
      if(!before&&after)nextColor(key);
    });
  }
  const piano=document.getElementById('piano');
  if(piano)new MutationObserver(updateKeys).observe(piano,{subtree:true,attributes:true,attributeFilter:['class'],attributeOldValue:true});
  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function dragValue(initial,delta,min,max,step){const v=initial+delta*(max-min)/160;return clamp(min+Math.round((v-min)/step)*step,min,max);}
  const inputs=[...document.querySelectorAll('.skinDial input[type=range],.dockRing input[type=range]')];
  function sync(){
    inputs.forEach(input=>{
      const min=Number(input.min)||0,max=(input.max===''?100:Number(input.max)),value=Number(input.value);
      input.parentElement.style.setProperty('--dial-angle',(-135+(value-min)/(max-min)*270)+'deg');
      input.setAttribute('aria-valuetext',value+' '+(input.parentElement.dataset?.unit??'%'));
    });
    const volume=document.getElementById('synthVol'),harm=document.getElementById('harmAmt');
    const vol=document.getElementById('skinVolText'),h=document.getElementById('skinHarmText');
    if(vol&&volume)vol.textContent=volume.value+' %';
    const preset=document.getElementById('preset');
    if(h&&harm)h.textContent=preset&&preset.value!=='sub808'?'inactives hors 808':harm.value+' %';
    const dot=document.getElementById('skinOrbitDot');
    if(dot&&volume){const a=Number(volume.value)/100*Math.PI*2;dot.setAttribute('cx',String(150+Math.cos(a)*87));dot.setAttribute('cy',String(150+Math.sin(a)*46));}
  }
  inputs.forEach(input=>{
    let drag=null;
    input.addEventListener('pointerdown',event=>{
      if(event.defaultPrevented||input.disabled||event.button!==0)return;
      event.preventDefault();input.focus();
      drag={id:event.pointerId,y:event.clientY,value:Number(input.value)};
      try{input.setPointerCapture(event.pointerId);}catch(_){}
    });
    input.addEventListener('pointermove',event=>{
      if(!drag||drag.id!==event.pointerId||input.disabled)return;
      input.value=String(dragValue(drag.value,(drag.y-event.clientY)*(event.shiftKey ? 0.1 : 1),Number(input.min)||0,(input.max===''?100:Number(input.max)),Number(input.step)||1));
      input.dispatchEvent(new Event('input',{bubbles:true}));
    });
    for(const name of ['pointerup','pointercancel','lostpointercapture'])input.addEventListener(name,event=>{
      if(!drag||event.pointerId!==drag.id)return;
      drag=null;if(name==='pointerup')input.dispatchEvent(new Event('change',{bubbles:true}));
    });
    input.addEventListener('input',sync);
  });
  document.addEventListener('input',event=>{if(['mixSynth','master','preset','harmAmt'].includes(event.target.id))sync();});
  document.addEventListener('change',sync);
  // Restoring a saved project updates native value properties; periodic sync reads only.
  let timer=setInterval(()=>{if(!document.hidden)sync();},500);
  window.addEventListener('pagehide',()=>{clearInterval(timer);timer=null;});
  window.addEventListener('pageshow',()=>{if(timer===null)timer=setInterval(()=>{if(!document.hidden)sync();},500);});
  sync();window.JACK22_SKIN={version:'8.9-ORBITE',nextColor,updateKeys,dragValue,sync};
})();

