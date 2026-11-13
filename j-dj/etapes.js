'use strict';
// Barre des étapes : l'étape en cours s'allume, les étapes passées restent cochées.
(()=>{
  const rail=document.querySelector('.step-rail');if(!rail)return;
  const links=[...rail.querySelectorAll('a')];
  const sections=links.map(a=>document.querySelector(a.getAttribute('href')));
  const update=()=>{
    const mid=innerHeight*.4;let cur=-1;
    sections.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<mid)cur=i});
    const last=sections[sections.length-1];
    const inside=cur>=0&&last&&last.getBoundingClientRect().bottom>mid;
    rail.classList.toggle('visible',inside);
    links.forEach((a,i)=>{a.classList.toggle('active',inside&&i===cur);a.classList.toggle('done',i<cur)});
  };
  addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();
})();
