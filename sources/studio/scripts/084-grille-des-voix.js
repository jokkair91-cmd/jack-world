
(()=>{
  const W=window.JACK22_WORKSPACE, stage=document.getElementById('dockStage');
  const voices=document.getElementById('cVoices');
  const voiceGrid=voices.querySelector('.cVoiceGrid');
  const cards=[...voiceGrid.querySelectorAll('.cVoice')];
  const mic=document.createElement('section');
  mic.id='j109Mic';
  mic.className='panel';
  mic.innerHTML='<h2>Micro &amp; réglages</h2>';
  const tabs=document.createElement('div');
  tabs.id='j109VoiceTabs';
  tabs.setAttribute('aria-label','Choisir une piste voix');
  voiceGrid.before(tabs);
  const buttons=['Lead','Doublage','Ad-libs'].map((label,index)=>{
    const button=document.createElement('button');
    button.type='button';
    button.textContent=label;
    button.onclick=()=>select(index);
    tabs.append(button);
    return button;
  });
  let selected=0;
  function select(index){
    selected=index;
    cards.forEach((card,i)=>{
      card.hidden=i!==index;
      buttons[i].setAttribute('aria-pressed',String(i===index));
    });
  }
  const fields=[document.getElementById('j106InputStatus')?.parentElement,document.getElementById('cCount').closest('.cRow')].filter(Boolean).map(el=>{
    const home=document.createComment('Emplacement des réglages voix');
    el.before(home);
    return {el,home};
  });
  function update(){
    const recording=W.on&&W.group==='voice'&&W.view==='record';
    stage.classList.toggle('j109Voice',recording);
    tabs.hidden=!recording;
    if(recording){
      mic.dataset.j93Visible='true';
      if(!mic.isConnected)stage.append(mic);
      for(const {el} of fields)if(el.parentElement!==mic)mic.append(el);
      select(selected);
    }else{
      for(const {el,home} of fields)if(el.parentElement===mic)home.after(el);
      mic.remove();
      cards.forEach(card=>{card.hidden=false;});
    }
  }
  document.addEventListener('j105view',update);
  new MutationObserver(update).observe(document.body,{attributes:true,attributeFilter:['class']});
  update();
  W.enter();
})();
