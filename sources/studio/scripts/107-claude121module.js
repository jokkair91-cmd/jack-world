
(() => {
 'use strict';
 const $c=id=>document.getElementById(id);
 const el=(tag,props={},kids=[])=>{const e=document.createElement(tag);Object.assign(e,props);e.append(...kids);return e;};
 const say=t=>{try{setStatus(t);}catch(e){}};
 // ---------- Sauvegarder le projet / Exporter le morceau (WAV) ----------
 function exportWav(){
  const b=$c('expBtn');if(!b)return;
  if(b.disabled)return say('Export déjà en cours…');
  b.click();say('Export du morceau en WAV : le fichier arrive dans tes Téléchargements. Il s’écoute et se partage partout ; le projet, lui, reste dans le studio.');
 }
 const save=$c('save'),proj=$c('projExport');
 if(save)save.title='Sauvegarder le projet dans ce navigateur, pour le rouvrir et continuer plus tard (Ctrl+S). Ce n’est pas un fichier audio.';
 if(proj){proj.textContent='Copie (.zip)';proj.title='Fichier du projet à garder ou à ouvrir sur un autre ordinateur. Pour écouter ou partager le morceau : Exporter le morceau (WAV).';}
 if(save){const x=el('button',{type:'button',id:'c121Export',textContent:'Exporter le morceau (WAV)',title:'Crée un fichier WAV à écouter ou partager (Téléchargements)'});x.addEventListener('click',exportWav);save.after(x);}
 // Barre du bas (bloc 119) : mêmes mots.
 const fixBar=()=>{const bar=$c('c119Bar');if(!bar||bar.querySelector('#c121BarWav'))return;
  const s=[...bar.querySelectorAll('button')].find(b=>/^Sauvegarder/.test(b.textContent));if(!s)return;s.title='Sauvegarder le projet pour le rouvrir et continuer (Ctrl+S)';
  const w=el('button',{type:'button',id:'c121BarWav',className:'c119Toggle',textContent:'Exporter WAV',title:'Exporter le morceau en fichier WAV à écouter ou partager'});w.addEventListener('click',exportWav);s.before(w);};
 // ---------- Studio : premiers pas en 3 étapes ----------
 const OFF='jack22.premiersPas.masque';
 const W=()=>window.JACK22_WORKSPACE;
 const guide=el('div',{id:'c121Guide',role:'region',ariaLabel:'Premiers pas'});
 const mkStep=(n,label,btnText,fn)=>{const b=el('button',{type:'button',textContent:btnText});b.addEventListener('click',fn);const s=el('span',{className:'c121Step'},[el('b',{textContent:String(n)}),el('span',{textContent:label}),b]);return s;};
 const s1=mkStep(1,'Créer un beat','Ouvrir la batterie',()=>W()?.choose('compose','beat'));
 const s2=mkStep(2,'Enregistrer une voix','Ouvrir les prises',()=>W()?.choose('voice','record'));
 const saveB=el('button',{type:'button',textContent:'Sauvegarder le projet',title:'Pour rouvrir et continuer plus tard'});saveB.addEventListener('click',()=>$c('save')?.click());
 const wavB=el('button',{type:'button',textContent:'Exporter le morceau (WAV)',title:'Pour écouter ou partager'});wavB.addEventListener('click',exportWav);
 const s3=el('span',{className:'c121Step'},[el('b',{textContent:'3'}),el('span',{textContent:'Garder ton travail'}),saveB,wavB]);
 const close=el('button',{type:'button',className:'close',textContent:'×',title:'Masquer les premiers pas (Projet ▾ → Premiers pas pour les revoir)',ariaLabel:'Masquer les premiers pas'});
 close.addEventListener('click',()=>{document.body.classList.add('c121GuideOff');try{localStorage.setItem(OFF,'1');}catch(e){}window.JACK22_ECRAN?.fit?.();});
 guide.append(el('strong',{textContent:'Premiers pas :'}),s1,el('span',{className:'arrow',textContent:'→'}),s2,el('span',{className:'arrow',textContent:'→'}),s3,close);
 try{if(localStorage.getItem(OFF)==='1')document.body.classList.add('c121GuideOff');}catch(e){}
 // Entrée « Premiers pas » dans le menu Projet pour les revoir.
 const menu=document.querySelector('.dockProject .dockPopupBody');
 if(menu){const m=el('button',{type:'button',textContent:'Premiers pas (beat → voix → sauvegarde)'});m.addEventListener('click',()=>{document.body.classList.remove('c121GuideOff');try{localStorage.removeItem(OFF);}catch(e){}menu.closest('details').open=false;W()?.choose('compose','arrange');});menu.prepend(m);}
 // État de chaque étape : fait (vert), prochaine (rouge).
 function sync(){
  let beat=false,voice=false,saved=false;
  try{beat=song.tracks[0].patterns.some(p=>p.grid.some(r=>r.some(Boolean)));}catch(e){}
  try{voice=audioClips.some(c=>c.voice&&c.buffer);}catch(e){}
  saved=(beat||voice)&&!/●/.test($c('save')?.textContent||'');
  const st=[beat,voice,saved];let next=st.indexOf(false);
  [s1,s2,s3].forEach((s,i)=>{s.className='c121Step'+(st[i]?' done':'')+(i===next?' next':'');s.querySelector('b').textContent=st[i]?'✓':String(i+1);});
 }
 const wait=setInterval(()=>{const nav=$c('j93Nav');if(!nav)return;clearInterval(wait);nav.after(guide);sync();window.JACK22_ECRAN?.fit?.();},250);
 setTimeout(()=>clearInterval(wait),60000);
 setInterval(()=>{if(!document.hidden){fixBar();if(guide.offsetWidth)sync();}},500);
 window.JACK22_PARCOURS={version:'11.5-claude-parcours',exportWav,sync};
})();
