
(()=>{
 const library=document.getElementById('j93Library');
 const samples=document.getElementById('j111Samples');
 if(library&&samples){
  const title=library.querySelector('h2');
  const heading=document.createElement('div');
  heading.id='j111SampleHeading';
  title.before(heading);
  title.textContent='Samples et instruments';
  const close=document.createElement('button');
  close.type='button';
  close.textContent='−';
  close.setAttribute('aria-label','Replier les Samples');
  close.onclick=()=>samples.click();
  heading.append(title,close);
 }
 const tabs=document.getElementById('j109VoiceTabs');
 const stage=document.getElementById('dockStage');
 const voice=document.getElementById('cVoices');
 const stop=[...document.querySelectorAll('#dockHeader button')].find(b=>b.textContent.includes('Arrêter la prise'));
 if(!tabs||!stage||!voice||!stop)return;
 const row=document.createElement('div');
 row.id='j113VoiceTransport';
 const record=document.createElement('button'), finish=document.createElement('button');
 record.type=finish.type='button';
 record.className='j113Rec';
 record.textContent='● REC';
 finish.textContent='■ STOP';
 row.append(record,finish);
 tabs.after(row);
 const active=()=>voice.querySelector('.cVoice:not([hidden]) [data-action=record]');
 record.onclick=()=>active()?.click();
 finish.onclick=()=>stop.click();
 function sync(){
  const hidden=!stage.classList.contains('j109Voice');
  if(row.hidden!==hidden)row.hidden=hidden;
  const disabled=!active()||active().disabled;
  if(record.disabled!==disabled)record.disabled=disabled;
  if(finish.disabled!==stop.disabled)finish.disabled=stop.disabled;
 }
 voice.addEventListener('click',()=>queueMicrotask(sync));
 document.addEventListener('j105view',()=>queueMicrotask(sync));
 const observer=new MutationObserver(sync);
 observer.observe(stop,{attributes:true,attributeFilter:['disabled']});
 observer.observe(voice,{subtree:true,attributes:true,attributeFilter:['disabled']});
 sync();
})();
