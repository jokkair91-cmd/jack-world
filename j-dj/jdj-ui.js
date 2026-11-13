'use strict';
// Mini-interfaces J-DJ : démonstrations visuelles (aucun son joué).
(()=>{
  const sync=document.querySelector('[data-ui="sync"]');
  if(sync){const btn=sync.querySelector('.jdj-btn'),b=sync.querySelector('[data-bpm="b"]');
    btn.addEventListener('click',()=>{const on=btn.getAttribute('aria-pressed')!=='true';btn.setAttribute('aria-pressed',String(on));sync.classList.toggle('synced',on);b.textContent=on?'126.0':'131.5'});}
  const pl=document.querySelector('[data-ui="scratch"] .jdj-platter.big');
  if(pl){let angle=0,drag=false,last=0,auto=null;
    const center=()=>{const r=pl.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]};
    const at=e=>{const[cx,cy]=center();return Math.atan2(e.clientY-cy,e.clientX-cx)*180/Math.PI};
    const set=a=>{angle=a;pl.style.transform='rotate('+angle+'deg)';pl.setAttribute('aria-valuenow',String(Math.round(((angle%360)+540)%360-180)))};
    const spin=()=>{cancelAnimationFrame(auto);if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const step=()=>{if(!drag)set(angle+3);auto=requestAnimationFrame(step)};auto=requestAnimationFrame(step)};
    pl.addEventListener('pointerdown',e=>{drag=true;last=at(e);pl.setPointerCapture(e.pointerId)});
    pl.addEventListener('pointermove',e=>{if(!drag)return;const a=at(e);let d=a-last;if(d>180)d-=360;if(d<-180)d+=360;last=a;set(angle+d)});
    const up=()=>{drag=false};pl.addEventListener('pointerup',up);pl.addEventListener('pointercancel',up);
    pl.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();set(angle+(e.key==='ArrowRight'?15:-15))}});
    spin();}
  const mix=document.querySelector('[data-ui="mixer"]');
  if(mix){const xf=mix.querySelector('input'),va=mix.querySelector('.jdj-vu.a'),vb=mix.querySelector('.jdj-vu.b');
    const upd=()=>{const v=+xf.value;va.style.setProperty('--lvl',Math.min(100,(100-v)*1.4)+'%');vb.style.setProperty('--lvl',Math.min(100,v*1.4)+'%')};
    xf.addEventListener('input',upd);upd();
    mix.querySelectorAll('.jdj-pads button:not(.jdj-rec)').forEach(p=>p.addEventListener('click',()=>{p.classList.add('hit');setTimeout(()=>p.classList.remove('hit'),220)}));
    const rec=mix.querySelector('.jdj-rec');rec.addEventListener('click',()=>rec.setAttribute('aria-pressed',String(rec.getAttribute('aria-pressed')!=='true')));}
})();
