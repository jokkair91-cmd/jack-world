
(() => {
 'use strict';
 const $c=id=>document.getElementById(id);
 const el=(tag,props={},kids=[])=>{const e=document.createElement(tag);Object.assign(e,props);e.append(...kids);return e;};
 const NAMES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
 // Batterie (notes General MIDI) → lignes KICK, SNARE, HI-HAT, CLAP.
 const DRUM={35:0,36:0,38:1,40:1,37:1,42:2,44:2,46:2,51:2,53:2,39:3,54:3,56:3};
 const midiOf=v=>{
  if(typeof v==='number'&&Number.isFinite(v))return Math.round(v);
  const m=/^\s*([A-Ga-g])\s*([#b♯♭]?)\s*(-?\d)\s*$/.exec(String(v||''));if(!m)return NaN;
  let n=NAMES.indexOf(m[1].toUpperCase());if(m[2]==='#'||m[2]==='♯')n++;if(m[2]==='b'||m[2]==='♭')n--;return (Number(m[3])+1)*12+n;
 };
 // Lecture tolérante : bloc ```json, texte autour, tableau seul ou objet { notes: [...] }.
 function parse(text){
  let t=String(text||'').trim();if(!t)throw Error('Colle d’abord des notes dans la zone de texte.');
  const fence=/```(?:json)?\s*([\s\S]*?)```/i.exec(t);if(fence)t=fence[1].trim();
  let data;try{data=JSON.parse(t);}catch(e){const a=t.indexOf('['),b=t.lastIndexOf(']');if(a<0||b<a)throw Error('Format non reconnu : il faut une liste de notes en JSON, comme dans l’exemple.');try{data=JSON.parse(t.slice(a,b+1));}catch(x){throw Error('Le JSON contient une erreur (virgule ou guillemet manquant ?).');}}
  const list=Array.isArray(data)?data:Array.isArray(data?.notes)?data.notes:null;
  if(!list)throw Error('Il faut une liste de notes : [ { "midi": 60, "time": 0, "duration": 1 }, … ]');
  if(list.length>1000)throw Error('1000 notes au maximum.');
  return list.map((n,i)=>{
   const midi=midiOf(n?.midi??n?.note??n?.pitch),time=Number(n?.time??n?.start),dur=Number(n?.duration??n?.dur??0.25);
   let vel=n?.velocity;vel=vel==null?null:Number(vel);if(vel!=null&&vel>1)vel=vel/127;
   if(!Number.isFinite(midi)||!Number.isFinite(time)||time<0||!Number.isFinite(dur)||dur<=0)throw Error('Note '+(i+1)+' incomplète : il faut midi (ou « A4 »), time et duration.');
   return {midi,time,dur,vel};
  });
 }
 // Conversion en pas de double croche (time et duration en temps : 1 = une noire = 4 pas).
 function plan(list,ti){
  const warn=[];
  if(ti===0){
   const grid=Array.from({length:4},()=>Array(16).fill(false));let used=0,skipped=0,wrapped=0;
   for(const n of list){const row=DRUM[n.midi];if(row==null){skipped++;continue;}let s=Math.round(n.time*4);if(s>=16){s%=16;wrapped++;}if(!grid[row][s]){grid[row][s]=true;used++;}}
   if(skipped)warn.push(skipped+' note(s) sans équivalent dans la batterie (Kick 36, Snare 38, Hi-hat 42, Clap 39) ignorée(s)');
   if(wrapped)warn.push('pas au-delà de 16 ramenés dans la mesure');
   return {grid,count:used,warn,bars:1};
  }
  const options=[...($c('rollBars')?.options||[])].map(o=>Number(o.value)).filter(Boolean).sort((a,b)=>a-b);const maxBars=options.at(-1)||4;
  let end=0,moved=0,cut=0;const notes=[],seen=new Set();
  for(const n of list){
   let m=n.midi;if(m<24||m>95)moved++;while(m<24)m+=12;while(m>95)m-=12;
   const start=Math.max(0,Math.round(n.time*4)),dur=Math.max(1,Math.round(n.dur*4));
   if(start>=maxBars*16){cut++;continue;}
   const d=Math.min(dur,maxBars*16-start),key=start+':'+m;if(seen.has(key))continue;seen.add(key);
   const note={start,dur:d,preset:'',octave:Math.floor(m/12)-1,idx:m%12};if(n.vel!=null)note.velocity=Math.max(1,Math.min(100,Math.round(n.vel*100)));
   notes.push(note);end=Math.max(end,start+d);
  }
  const bars=options.find(b=>b*16>=end)||maxBars;
  if(moved)warn.push(moved+' note(s) ramenée(s) dans la tessiture du Piano Roll (C1 à B6)');
  if(cut)warn.push(cut+' note(s) au-delà de '+maxBars+' mesures ignorée(s)');
  return {notes,count:notes.length,warn,bars};
 }
 // ---------- Fenêtre ----------
 const dlg=el('dialog',{id:'c124Dlg',ariaLabel:'Coller des notes'});
 const area=el('textarea',{spellcheck:false,placeholder:'[\n  { "midi": 69, "time": 0, "duration": 0.5 },\n  { "midi": 72, "time": 0.5, "duration": 0.5 },\n  { "midi": 76, "time": 1, "duration": 1 }\n]'});
 area.setAttribute('aria-label','Notes à coller (JSON)');
 const trackSel=el('select',{ariaLabel:'Piste'}),soundSel=el('select',{ariaLabel:'Son'}),modeSel=el('select',{ariaLabel:'Où mettre les notes'},[el('option',{value:'new',textContent:'Nouveau pattern'}),el('option',{value:'add',textContent:'Ajouter au pattern actuel'})]);
 const preview=el('p',{className:'preview',role:'status',ariaLive:'polite'});
 const copyPrompt=el('button',{type:'button',textContent:'Copier la consigne pour l’IA'}),copyMine=el('button',{type:'button',textContent:'Copier mes notes'});
 const go=el('button',{type:'button',className:'main',textContent:'Coller dans JACK22'}),close=el('button',{type:'button',textContent:'Fermer'});
 dlg.append(el('header',{},[el('h2',{textContent:'Coller des notes'}),close]),
  el('div',{className:'body'},[
   el('ol',{},[el('li',{textContent:'Clique « Copier la consigne pour l’IA » et colle-la dans une discussion avec Claude ou ChatGPT, en ajoutant ce que tu veux (ex. « une mélodie afro en la mineur sur 2 mesures »).'}),el('li',{textContent:'Copie la réponse de l’IA (la liste de notes) et colle-la ci-dessous.'}),el('li',{textContent:'Choisis la piste et clique « Coller dans JACK22 ». Annuler (Ctrl+Z) retire tout.'})]),
   el('div',{className:'row'},[copyPrompt,copyMine]),
   area,
   el('div',{className:'row'},[el('label',{},['Piste',trackSel]),el('label',{},['Son',soundSel]),el('label',{},['Mettre dans',modeSel])]),
   preview,
   el('p',{textContent:'Format (le même que l’éditeur Signal) : midi = hauteur (60 = do central, ou « C4 »), time = début en temps (0 = premier temps, 1 = une noire plus tard), duration = durée en temps (0.25 = double croche), velocity = force de 0 à 1 (facultatif). Pour la batterie : 36 Kick, 38 Snare, 42 Hi-hat, 39 Clap, sur une mesure.'})]),
  el('footer',{},[go]));
 document.body.append(dlg);
 dlg.addEventListener('keydown',e=>{if(e.code==='Space'&&e.target===area)e.stopPropagation();});
 close.addEventListener('click',()=>dlg.close());
 function fillSelects(){
  trackSel.replaceChildren(...song.tracks.map((t,i)=>el('option',{value:String(i),textContent:t.label})));
  const cur=Number($c('rollTrack')?.value||2);trackSel.value=String(song.tracks[cur]?cur:2);
  const src=$c('rollSound')||$c('preset');soundSel.replaceChildren(...[...(src?.options||[])].map(o=>el('option',{value:o.value,textContent:o.textContent})));
  if(src)soundSel.value=src.value;
 }
 const say=t=>{try{setStatus(t);}catch(e){}};
 function check(){
  const ti=Number(trackSel.value);soundSel.disabled=ti===0;modeSel.disabled=false;
  if(!area.value.trim()){preview.className='preview';preview.textContent='';go.disabled=true;return null;}
  try{const p=plan(parse(area.value),ti);preview.className='preview ok';preview.textContent=(ti===0?p.count+' coup(s) de batterie':p.count+' note(s) sur '+p.bars+' mesure(s)')+' prêt(s) à coller'+(p.warn.length?' · '+p.warn.join(' · '):'')+'.';go.disabled=!p.count;return p;}
  catch(e){preview.className='preview err';preview.textContent=e.message;go.disabled=true;return null;}
 }
 area.addEventListener('input',check);trackSel.addEventListener('change',check);
 const busy=()=>persistBusy||exporting||(typeof rec!=='undefined'&&rec.state!=='idle')||window.Jack22Voice?.state.active;
 function apply(){
  const p=check();if(!p)return;if(busy())return say('Coller des notes : attends la fin de l’opération en cours.');
  const ti=Number(trackSel.value),tr=song.tracks[ti],H=window.Jack22Vision8,mode=modeSel.value;
  if(mode==='new'&&tr.patterns.length>=32)return say('La piste '+tr.label+' a déjà 32 patterns.');
  H?.remember();
  try{
   if(ti===0){
    if(mode==='new'){addPattern(0);const np=tr.patterns.at(-1);np.name=uniq(tr,'Collé');np.grid=p.grid;setActive(0,tr.patterns.length-1);}
    else{const cur=tr.patterns[tr.active];cur.grid=cur.grid.map((r,i)=>r.map((v,s)=>v||p.grid[i][s]));setActive(0,tr.active);}
   }else{
    const preset=soundSel.value,notes=p.notes.map(n=>({...n,preset}));
    if(mode==='new'){addPattern(ti);const np=tr.patterns.at(-1);np.name=uniq(tr,'Collé');np.bars=p.bars;np.steps=p.bars*16;np.notes=notes;setActive(ti,tr.patterns.length-1);}
    else{const cur=tr.patterns[tr.active];const keys=new Set(cur.notes.map(n=>n.start+':'+((n.octave+1)*12+n.idx)));const room=cur.steps;
     for(const n of notes)if(n.start<room&&!keys.has(n.start+':'+((n.octave+1)*12+n.idx))){cur.notes.push({...n,dur:Math.min(n.dur,room-n.start)});}
     setActive(ti,tr.active);}
   }
   try{buildPatternUI();}catch(e){}try{tlBuild();}catch(e){}try{uiExp();}catch(e){}
  }catch(e){H?.remember();return say('Coller des notes : '+e.message);}
  H?.remember();dlg.close();
  // Montrer le résultat : Batterie, ou Piano Roll sur la bonne piste.
  const W=window.JACK22_WORKSPACE;
  if(ti===0)W?.choose('compose','beat');
  else{const rt=$c('rollTrack');if(rt&&[...rt.options].some(o=>o.value===String(ti))&&rt.value!==String(ti)){rt.value=String(ti);rt.dispatchEvent(new Event('change',{bubbles:true}));}W?.choose('compose','roll');}
  say('Notes collées sur '+tr.label+' ('+p.count+(ti===0?' coups':' notes')+'). Ctrl+Z pour revenir.');
 }
 function uniq(tr,base){let n=1,name=base+' '+n;while(tr.patterns.some(x=>x.name===name))name=base+' '+(++n);return name;}
 go.addEventListener('click',apply);
 // Consigne pour l'IA (à coller dans une discussion) et notes du pattern actuel (pour demander une suite ou une basse).
 const PROMPT='Tu écris de la musique pour JACK22 STUDIO. Réponds UNIQUEMENT par une liste JSON de notes, sans texte autour, au format :\n[\n  { "midi": 69, "time": 0, "duration": 0.5, "velocity": 0.8 }\n]\n- midi : hauteur MIDI (60 = do central C4 ; mélodie entre 48 et 84 ; basse entre 28 et 52).\n- time : début en temps (0 = premier temps ; 1 = une noire plus tard ; 4 = mesure 2).\n- duration : durée en temps (0.25 = double croche, 0.5 = croche, 1 = noire).\n- velocity : force entre 0 et 1 (facultatif).\n- Pour la batterie : 36 = kick, 38 = snare, 42 = hi-hat, 39 = clap, sur une seule mesure (time de 0 à 3.75).\n- 4 mesures au maximum (time < 16), mesure en 4/4.\nCe que je veux : ';
 async function copy(text,ok){try{await navigator.clipboard.writeText(text);say(ok);}catch(e){area.value=text;area.select();say('Copie automatique impossible ici : le texte est sélectionné dans la zone, fais Ctrl+C.');check();}}
 copyPrompt.addEventListener('click',()=>copy(PROMPT,'Consigne copiée : colle-la dans ta discussion avec l’IA et termine la phrase « Ce que je veux : … ».'));
 copyMine.addEventListener('click',()=>{
  const ti=Number(trackSel.value),tr=song.tracks[ti],p=tr.patterns[tr.active];let out;
  if(ti===0){const rows=[36,38,42,39];out=[];p.grid.forEach((r,i)=>r.forEach((v,s)=>{if(v)out.push({midi:rows[i],time:s/4,duration:0.25});}));}
  else out=p.notes.map(n=>({midi:(n.octave+1)*12+n.idx,time:n.start/4,duration:n.dur/4,...(n.velocity!=null?{velocity:n.velocity/100}:{})})).sort((a,b)=>a.time-b.time||a.midi-b.midi);
  copy(JSON.stringify(out),'Notes de « '+p.name+' » ('+tr.label+') copiées : colle-les à l’IA pour demander une suite, une basse ou une variation.');
 });
 function open(){fillSelects();check();if(!dlg.open)dlg.showModal();area.focus();}
 // Bouton dans la barre Composition (à côté de Dupliquer) et dans le menu Outils.
 const btn=el('button',{type:'button',id:'c124Open',textContent:'Coller des notes…',title:'Coller des notes écrites par une IA ou à la main (format JSON de Signal)'});btn.addEventListener('click',open);
 const wait=setInterval(()=>{const bar=$c('j105EditorBar');const dup=bar&&[...bar.querySelectorAll('button')].find(b=>/^Dupliquer/.test(b.textContent.trim()));if(!dup)return;clearInterval(wait);dup.after(btn);},300);
 setTimeout(()=>clearInterval(wait),60000);
 window.JACK22_COLLER={version:'11.5-claude-coller',open,parse,plan,apply,PROMPT};
})();
