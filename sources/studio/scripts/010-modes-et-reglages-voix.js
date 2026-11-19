
/* JACK22 Lot 3: deterministic monophonic pitch correction, raw takes remain unchanged. */
(function(root){
'use strict';
const MODES={chromatic:[0,1,2,3,4,5,6,7,8,9,10,11],major:[0,2,4,5,7,9,11],minor:[0,2,3,5,7,8,10]};
const defaults=()=>({version:1,bypass:false,pan:0,drive:{on:false,amount:0},edit:{start:0,end:0,fadeIn:0,fadeOut:0},eq:{on:false,low:0,mid:0,high:0},comp:{on:false,thr:-18,ratio:3,attack:10,release:250,makeup:0},reverb:{on:false,mix:15,decay:1.2},delay:{on:false,time:.25,fb:25,mix:15},tune:{on:false,root:0,scale:'chromatic',amount:100,smooth:80}});
function validate(s){
 if(s&&typeof s==='object'){s=JSON.parse(JSON.stringify(s));if(s.pan===undefined)s.pan=0;if(s.drive===undefined)s.drive={on:false,amount:0};if(s.edit===undefined)s.edit={start:0,end:0,fadeIn:0,fadeOut:0};}
 if(!s||typeof s!=='object'||Array.isArray(s)||s.version!==1||typeof s.bypass!=='boolean')throw Error('Traitements voix invalides');
 const bounds=(o,defs)=>{if(!o||typeof o!=='object'||Array.isArray(o))throw Error('Bloc de traitement manquant');for(const[k,[lo,hi]]of Object.entries(defs))if(typeof o[k]!=='number'||!Number.isFinite(o[k])||o[k]<lo||o[k]>hi)throw Error('Paramètre voix invalide : '+k);};
 if(typeof s.pan!=='number'||!Number.isFinite(s.pan)||s.pan< -1||s.pan>1)throw Error('Panoramique invalide');bounds(s.drive,{amount:[0,100]});if(typeof s.drive.on!=='boolean')throw Error('Drive invalide');bounds(s.edit,{start:[0,600],end:[0,600],fadeIn:[0,5],fadeOut:[0,5]});
 bounds(s.eq,{low:[-12,12],mid:[-12,12],high:[-12,12]});bounds(s.comp,{thr:[-40,0],ratio:[1,20],attack:[1,100],release:[50,1000],makeup:[0,12]});bounds(s.reverb,{mix:[0,100],decay:[.3,2.5]});bounds(s.delay,{time:[.05,.5],fb:[0,35],mix:[0,80]});bounds(s.tune,{root:[0,11],amount:[0,100],smooth:[0,500]});
 if(!Number.isInteger(s.tune.root)||!Object.hasOwn(MODES,s.tune.scale)||typeof s.tune.on!=='boolean')throw Error('Gamme J-Tune invalide');for(const o of[s.eq,s.comp,s.reverb,s.delay])if(typeof o.on!=='boolean')throw Error('Activation effet invalide');
 return JSON.parse(JSON.stringify(s));
}
const active=s=>!s.bypass&&(s.pan!==0||s.drive.on&&s.drive.amount>0||Object.values(s.edit).some(x=>x>0)||s.tune.on&&s.tune.amount>0||s.comp.on||s.reverb.on&&s.reverb.mix>0||s.delay.on&&s.delay.mix>0||s.eq.on&&[s.eq.low,s.eq.mid,s.eq.high].some(v=>v!==0));
function tail(s){if(s.bypass)return 0;let d=0,r=0;if(s.reverb.on&&s.reverb.mix)d=s.reverb.decay*1.2+.1;if(s.delay.on&&s.delay.mix){const fb=Math.max(.01,s.delay.fb/100);r=s.delay.time*(1+Math.ceil(Math.log(.001)/Math.log(fb)))+.1;}return Math.min(8,d+r);}
function targetHz(f,root,scale){const m=69+12*Math.log2(f/440);let best=Math.round(m),distance=Infinity;for(let n=Math.floor(m)-12;n<=Math.ceil(m)+12;n++){if(!MODES[scale].includes(((n-root)%12+12)%12))continue;const d=Math.abs(n-m);if(d<distance){distance=d;best=n;}}return 440*Math.pow(2,(best-69)/12);}
function detect(x,rate){
 let energy=0,mean=0;for(let i=0;i<x.length;i++){energy+=x[i]*x[i];mean+=x[i];}if(energy/x.length<.000016)return null;mean/=x.length;
 const lo=Math.max(2,Math.floor(rate/500)-1),hi=Math.min(Math.ceil(rate/65)+1,Math.floor(x.length/2)-1),corr=[];let max=0;
 for(let lag=lo;lag<=hi;lag++){let ab=0,aa=0,bb=0;for(let i=0;i<x.length-hi;i++){const a=x[i]-mean,b=x[i+lag]-mean;ab+=a*b;aa+=a*a;bb+=b*b;}const v=aa*bb>0?ab/Math.sqrt(aa*bb):0;corr[lag]=v;max=Math.max(max,v);}
 if(max<.82)return null;
 let best=0;for(let lag=lo+1;lag<hi;lag++)if(corr[lag]>=max*.96&&corr[lag]>corr[lag-1]&&corr[lag]>=corr[lag+1]){best=lag;break;}
 if(!best)return null;const a=corr[best-1],b=corr[best],c=corr[best+1],den=a-2*b+c;const delta=den?Math.max(-.5,Math.min(.5,.5*(a-c)/den)):0;const hz=rate/(best+delta);if(hz<64.9||hz>500.1)return null;return {hz:Math.max(65,Math.min(500,hz)),confidence:b};
}
async function tune(input,sr,settings,pause=()=>Promise.resolve(),cancel=()=>false,progress=()=>{}){
 if(!settings.on||settings.amount===0)return {samples:input.slice(),voicedFrames:0,shiftedFrames:0};
 const stride=Math.max(1,Math.round(sr/8000)),rate=sr/stride,frame=768,hop=256*stride;
 const analysis=[];let smoothed=null,voiced=0,shifted=0;
 for(let start=0;start<input.length;start+=hop){if(cancel())throw Error('Traitement annulé');const frameData=new Float32Array(frame);for(let k=0;k<frame;k++){const pos=Math.min(input.length-1,Math.max(0,start+(k-frame/2)*stride));frameData[k]=input[pos];}const p=detect(frameData,rate);
  if(p){const goal=targetHz(p.hz,settings.root,settings.scale),want=Math.pow(goal/p.hz,settings.amount/100);const a=settings.smooth===0?1:1-Math.exp(-hop/sr/(settings.smooth/1000));smoothed=smoothed===null?want:smoothed+(want-smoothed)*a;analysis.push({f:p.hz,ratio:smoothed});voiced++;if(Math.abs(Math.log2(smoothed)*1200)>3)shifted++;}else{analysis.push(null);smoothed=null;}
  if(analysis.length%8===0){progress(.6*Math.min(1,(start+hop)/input.length));await pause();}
 }
 if(!shifted){progress(1);return {samples:input.slice(),voicedFrames:voiced,shiftedFrames:0};}
 const out=new Float32Array(input.length),weight=new Float32Array(input.length);let center=0,grains=0;
 while(center<input.length){if(cancel())throw Error('Traitement annulé');const a=analysis[Math.min(analysis.length-1,Math.floor(center/hop))];if(!a){center+=Math.max(1,hop/2);continue;}const period=sr/a.f,half=Math.max(4,Math.round(period));const begin=Math.max(0,Math.round(center-period/2)),end=Math.min(input.length-1,Math.round(center+period/2));let mark=begin,max=-Infinity;for(let k=begin;k<=end;k++)if(input[k]>max){max=input[k];mark=k;}
  for(let k=-half;k<=half;k++){const src=mark+k,dst=Math.round(center)+k;if(src<0||src>=input.length||dst<0||dst>=input.length)continue;const w=.5+.5*Math.cos(Math.PI*k/half);out[dst]+=input[src]*w;weight[dst]+=w;}
  center+=Math.max(2,period/a.ratio);if(++grains%512===0){progress(.6+.35*Math.min(1,center/input.length));await pause();}
 }
 for(let i=0;i<out.length;i++){const w=weight[i],mix=Math.min(1,w*4);out[i]=w>1e-6?input[i]*(1-mix)+(out[i]/w)*mix:input[i];if(!Number.isFinite(out[i]))throw Error('J-Tune : échantillon non fini');if(i%65536===65535){if(cancel())throw Error('Traitement annulé');await pause();}}
 progress(1);
 return {samples:out,voicedFrames:voiced,shiftedFrames:shifted};
}
function editBuffer(raw,edit,createBuffer){
 if(edit.start+edit.end>=raw.duration-.05)throw Error('Découpe trop courte : conserve au moins 50 ms.');
 if(!Object.values(edit).some(x=>x>0))return raw;
 const from=Math.round(edit.start*raw.sampleRate),length=raw.length-from-Math.round(edit.end*raw.sampleRate),out=createBuffer(raw.numberOfChannels,length,raw.sampleRate);
 for(let ch=0;ch<raw.numberOfChannels;ch++){const x=raw.getChannelData(ch).subarray(from,from+length),y=out.getChannelData(ch);for(let i=0;i<length;i++){const fade=Math.min(1,edit.fadeIn?i/(edit.fadeIn*raw.sampleRate):1,edit.fadeOut?(length-1-i)/(edit.fadeOut*raw.sampleRate):1);y[i]=x[i]*Math.max(0,fade);}}return out;
}
async function editBufferAsync(raw,edit,createBuffer,pause=()=>Promise.resolve(),cancel=()=>false){
 if(cancel())throw Error('Traitement annulé');
 if(edit.start+edit.end>=raw.duration-.05)throw Error('Découpe trop courte : conserve au moins 50 ms.');
 if(!Object.values(edit).some(x=>x>0))return raw;
 const from=Math.round(edit.start*raw.sampleRate),length=raw.length-from-Math.round(edit.end*raw.sampleRate),out=createBuffer(raw.numberOfChannels,length,raw.sampleRate);
 for(let ch=0;ch<raw.numberOfChannels;ch++){
  const x=raw.getChannelData(ch).subarray(from,from+length),y=out.getChannelData(ch);
  for(let start=0;start<length;start+=65536){
   if(cancel())throw Error('Traitement annulé');const end=Math.min(length,start+65536);
   for(let i=start;i<end;i++){const fade=Math.min(1,edit.fadeIn?i/(edit.fadeIn*raw.sampleRate):1,edit.fadeOut?(length-1-i)/(edit.fadeOut*raw.sampleRate):1);y[i]=x[i]*Math.max(0,fade);}
   await pause();
  }
 }
 return out;
}
function driveCurve(amount,n=4096){const out=new Float32Array(n),gain=1+amount*.15;for(let i=0;i<n;i++)out[i]=Math.tanh((i/(n-1)*2-1)*gain)/Math.tanh(gain);return out;}
root.Jack22Lot3DSP={defaults,validate,active,tail,targetHz,detect,tune,editBuffer,editBufferAsync,driveCurve};
})(typeof window!=='undefined'?window:globalThis);

