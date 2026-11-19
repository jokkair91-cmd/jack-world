
(()=>{
 const nav=document.getElementById('j93Nav'), stage=document.getElementById('dockStage');
 const button=document.createElement('button');
 button.id='j111Samples';
 button.type='button';
 button.textContent='Samples';
 nav.append(button);
 const toggle=[...nav.querySelectorAll('details button')].find(el=>el.textContent==='Samples et instruments');
 button.onclick=()=>toggle?.click();
 function update(){
  const W=window.JACK22_WORKSPACE;
  const patterns=W.on&&W.group==='compose'&&['beat','roll'].includes(W.view);
  button.hidden=!patterns;
  button.setAttribute('aria-expanded',String(document.getElementById('j93Library')?.dataset.j93Visible==='true'));
  stage.classList.toggle('j111Patterns',patterns);
 }
 document.addEventListener('j105view',update);
 update();
})();
