
/* User-facing feedback: preserves original messages and their original locations. */
(() => {
 const history=[];
 const labels={project:'Projet',audio:'Audio',timeline:'Arrangement',notes:'Prise de notes',roll:'Piano Roll',wav:'Export WAV',voice:'Voix / projet portable'};
 function publish(channel,text){
  if(typeof text!=='string'||!text.trim())return;
  const routine=(channel==='project'&&['Lecture','Pause','Arrêté'].includes(text))||(channel==='notes'&&text.startsWith('Prêt.'));
  const kind=/impossible|refus|invalide|erreur|introuvable|non restaur|sans les fichiers|attention|manquant|échou/i.test(text)?'warning':'info';
  const inline=channel==='voice'?document.getElementById('cVoiceFeedback'):null;
  if(inline){inline.textContent=text;inline.dataset.kind=kind;}
  if(routine)return;
  const latest=document.getElementById('feedbackLatest');
  if(latest){latest.textContent=(labels[channel]||channel)+' — '+text;latest.dataset.kind=kind;}
  const last=history[history.length-1];
  if(last&&last.channel===channel&&last.text===text)return;
  history.push({channel,text});if(history.length>30)history.shift();
  const log=document.getElementById('feedbackLog');
  if(log){log.replaceChildren();for(const entry of history.slice().reverse()){
   const item=document.createElement('li');item.textContent=(labels[entry.channel]||entry.channel)+' — '+entry.text;log.append(item);
  }}
 }
 window.Jack22Feedback={publish,entries:()=>history.map(x=>({...x}))};
})();
