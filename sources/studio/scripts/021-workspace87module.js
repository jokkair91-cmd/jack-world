
(() => {
 'use strict';
 const $=id=>document.getElementById(id),all=(s,r=document)=>[...r.querySelectorAll(s)];
 const stage=$('dockStage'),nav=$('dockNav');document.body.classList.add('compact88');
 const bar=document.createElement('nav');bar.id='workspace88';bar.setAttribute('aria-label','Vue du studio');
 function studioView(id){stage.classList.toggle('compact88StudioFocus',id!=='all');all(':scope > section',stage).forEach(p=>p.classList.toggle('compact88Selected',p.id===id));all('[data-c88-studio]',bar).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.c88Studio===id)));}
 for(const [id,label]of [['all','Vue complète'],['timeline','Arrangement'],['mixer','Mixeur'],['synth','Orbite'],['fx','Effets']]){const b=document.createElement('button');b.type='button';b.dataset.c88Studio=id;b.textContent=label;b.setAttribute('aria-pressed',String(id==='all'));b.addEventListener('click',()=>studioView(id));bar.append(b);}nav.after(bar);
 function syncStudioBar(){bar.hidden=$('dockStage').hidden;}
 new MutationObserver(syncStudioBar).observe($('dockStage'),{attributes:true,attributeFilter:['hidden']});syncStudioBar();
 function choose(pane,key){
  const buttons=all('[data-c88-view]',pane),button=buttons.find(b=>b.dataset.c88View===key);if(!button)return;
  pane.dataset.c88View=key;pane.classList.remove('compact88HasFocus');all('.compact88Focused',pane).forEach(p=>p.classList.remove('compact88Focused'));all('[data-c88-action="focus"]',pane).forEach(b=>b.setAttribute('aria-pressed','false'));
  const ids=(button.dataset.c88Targets||'').split(' ').filter(Boolean),grid=pane.querySelector('.compact88Grid');
  all(':scope > *',grid).forEach(el=>el.hidden=el.id==='v8Status'?false:ids.length>0&&!ids.includes(el.id)&&!(pane.id==='dockMore'&&key==='version'&&!el.id));
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  grid.classList.toggle('compact88Single',ids.length===1);
 }
 all('.dockPane').forEach(pane=>{all('[data-c88-view]',pane).forEach(b=>b.addEventListener('click',()=>choose(pane,b.dataset.c88View)));choose(pane,'all');});
 all('[data-c88-action]').forEach(button=>button.addEventListener('click',()=>{
  const panel=button.closest('.compact88Panel'),pane=button.closest('.dockPane');if(!panel||!pane)return;
  if(button.dataset.c88Action==='fold'){const folded=panel.classList.toggle('compact88Folded');button.textContent=folded?'＋':'−';button.setAttribute('aria-expanded',String(!folded));}
  else{const selected=panel.classList.toggle('compact88Focused');pane.classList.toggle('compact88HasFocus',selected);all('.compact88Focused',pane).forEach(p=>{if(p!==panel)p.classList.remove('compact88Focused');});panel.classList.remove('compact88Folded');const fold=panel.querySelector('[data-c88-action="fold"]');if(fold){fold.textContent='−';fold.setAttribute('aria-expanded','true');}button.setAttribute('aria-pressed',String(selected));}
 }));
 function fx(index){all('[data-c88-fx-card]').forEach(p=>p.hidden=Number(p.dataset.c88FxCard)!==index);all('[data-c88-fx]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.c88Fx)===index)));}
 all('[data-c88-fx]').forEach(b=>b.addEventListener('click',()=>fx(Number(b.dataset.c88Fx))));
 let textSize=16;all('[data-c88-text]').forEach(b=>b.addEventListener('click',()=>{textSize=Math.max(12,Math.min(28,textSize+Number(b.dataset.c88Text)));$('cLyrics').style.fontSize=textSize+'px';$('cPrompt').style.fontSize=(textSize+5)+'px';}));
 // Navigation links to an individual tool reveal that tool even after a sub-view was selected.
 document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#"]');if(!link)return;const target=$(link.getAttribute('href').slice(1)),pane=target?.closest('.dockPane');if(pane)choose(pane,'all');});
 window.JACK22_COMPACT={version:'8.8',choose,studioView,fx};
})();

