
(()=>{
  const wrap=$('rollWrap'), head=$('rollHead'), grid=$('rollGrid');
  const ruler=document.createElement('div'), marker=document.createElement('b');
  ruler.className='j22-seek';
  ruler.setAttribute('aria-label','Position de lecture du Piano Roll');
  marker.textContent='▼';
  wrap.before(ruler);
  let position=0, pattern, pointer=null, local=false;
  const controls=document.createElement('div');
  const play=document.createElement('button'), reset=document.createElement('button');
  play.textContent='Lecture du pattern';
  reset.textContent='Retour au début';
  controls.append(play,reset);
  ruler.before(controls);
  function blocked(){
    return playMode!=='pattern'||persistBusy||exporting||rec.state!=='idle'||!!window.Jack22Voice?.state?.active||!!window.Jack22Lot3?.pending;
  }
  function draw(){
    const current=activePat(rollTrack);
    if(current!==pattern){pattern=current;position=0;}
    position=Math.min(position,roll.steps-1);
    const offset=grid.getBoundingClientRect().left-ruler.getBoundingClientRect().left;
    const running=state==='playing'&&pointer===null;
    const x=running&&head.style.display!=='none'?parseFloat(head.style.left):position*ROLL_CW;
    const labels=[];
    for(let bar=0;bar<roll.bars;bar++){
      const label=document.createElement('span');
      label.style.left=(offset+bar*16*ROLL_CW+4)+'px';
      label.textContent=bar+1;
      labels.push(label);
    }
    marker.style.left=(offset+x)+'px';
    ruler.replaceChildren(...labels,marker);
    if(!running){head.style.display='block';head.style.left=x+'px';}
    play.disabled=blocked()||(!local&&state!=='stopped');
    reset.disabled=play.disabled;
    play.textContent=local&&state==='playing'?'Pause':'Lecture du pattern';
  }
  function seek(e){
    position=Math.max(0,Math.min(roll.steps-1,Math.floor((e.clientX-grid.getBoundingClientRect().left)/ROLL_CW)));
    draw();
  }
  ruler.onpointerdown=e=>{
    if(e.button!==0||pointer!==null||blocked()||(!local&&state!=='stopped'))return;
    pointer=e.pointerId;
    ruler.setPointerCapture(pointer);
    seek(e);
  };
  ruler.onpointermove=e=>{if(pointer===e.pointerId)seek(e);};
  ruler.onpointerup=e=>{
    if(pointer!==e.pointerId)return;
    seek(e);
    pointer=null;
    if(!blocked()&&local&&state==='playing'){pause();start(position);}
  };
  ruler.onlostpointercapture=()=>{pointer=null;};
  play.onclick=()=>{
    if(blocked())return;
    if(local&&state==='playing'){pause();position=resumeAbs%roll.steps;}
    else{local=true;start(position);}
    draw();
  };
  reset.onclick=()=>{
    position=0;
    if(local&&state==='playing'){pause();start(0);}
    draw();
  };
  function refresh(){
    if(state==='stopped'||playMode!=='pattern')local=false;
    if(ruler.getClientRects().length)draw();
    requestAnimationFrame(refresh);
  }
  refresh();
})();
