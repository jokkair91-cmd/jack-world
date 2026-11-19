
(function(root){'use strict';
const pitch=n=>(n.octave+1)*12+n.idx,clone=x=>JSON.parse(JSON.stringify(x));
const scales={chromatic:[0,1,2,3,4,5,6,7,8,9,10,11],major:[0,2,4,5,7,9,11],minor:[0,2,3,5,7,8,10],pentatonic:[0,3,5,7,10]};
function notes(input,steps,ids,action,v){
 const next=clone(input),set=new Set(ids);if(!ids.length)throw Error('Sélectionne des notes.');if(ids.some(i=>!Number.isInteger(i)||!next[i]))throw Error('Sélection invalide.');
 if(action==='velocity'){if(!Number.isInteger(v)||v<1||v>127)throw Error('Vélocité : 1 à 127.');for(const i of set)next[i].velocity=v;}
 else if(action==='glide'){if(!Number.isFinite(v)||v<0||v>1)throw Error('Glissé invalide.');for(const i of set)next[i].glide=v;}
 else if(action==='scale'){if(!scales[v.scale]||!Number.isInteger(v.root)||v.root<0||v.root>11)throw Error('Gamme invalide.');for(const i of set){const n=next[i],m=pitch(n);let best=null;for(let p=24;p<=95;p++)if(scales[v.scale].includes((p-v.root+120)%12)&&(best===null||Math.abs(p-m)<Math.abs(best-m)))best=p;n.octave=Math.floor(best/12)-1;n.idx=best%12;}}
 else if(action==='chord'){const intervals={major:[0,4,7],minor:[0,3,7],seventh:[0,4,7,10]}[v];if(!intervals)throw Error('Accord invalide.');for(const i of set)for(const offset of intervals.slice(1)){const n=clone(input[i]),p=pitch(n)+offset;n.octave=Math.floor(p/12)-1;n.idx=p%12;next.push(n);}}
 else if(action==='arpeggio'){if(![1,2,4].includes(v))throw Error('Pas invalide.');const starts=[...new Set(ids.map(i=>next[i].start))];for(const start of starts){const group=ids.filter(i=>next[i].start===start).sort((a,b)=>pitch(next[a])-pitch(next[b]));group.forEach((i,k)=>{next[i].start+=k*v;next[i].dur=Math.min(next[i].dur,v);});}}
 else throw Error('Commande inconnue.');
 const seen=new Set();if(next.length>1000)throw Error('Limite de 1 000 notes.');for(const n of next){const p=pitch(n),key=[n.start,p,n.preset].join(':');if(p<24||p>95||n.start<0||n.start+n.dur>steps||seen.has(key))throw Error('Opération refusée : limite ou doublon.');seen.add(key);}
 return{ok:true,notes:next,changed:JSON.stringify(next)!==JSON.stringify(input)};
}
function edit(channels,sr,start,end,fadeIn,fadeOut,gain,reverse=false){
 if(!channels.length||!Number.isFinite(sr)||sr<=0||[start,end,fadeIn,fadeOut,gain].some(x=>!Number.isFinite(x))||start<0||end<=start||fadeIn<0||fadeOut<0||gain<0||gain>4)throw Error('Découpe invalide.');
 const from=Math.round(start*sr),to=Math.round(end*sr);if(to>channels[0].length||to<=from)throw Error('Découpe hors du fichier.');
 return channels.map(c=>{const out=new Float32Array(to-from);for(let i=0;i<out.length;i++){const env=Math.min(1,fadeIn?i/(fadeIn*sr):1,fadeOut?(out.length-1-i)/(fadeOut*sr):1);out[i]=c[reverse?to-1-i:from+i]*gain*Math.max(0,env);}return out;});
}
function stats(channels){let peak=0,sum=0,n=0,clipped=0;for(const c of channels)for(const x of c){peak=Math.max(peak,Math.abs(x));sum+=x*x;n++;if(Math.abs(x)>=1)clipped++;}return{peak,rms:n?Math.sqrt(sum/n):0,clipped};}
function midi(input,bpm=120){
 if(!Number.isFinite(bpm)||bpm<40||bpm>240)throw Error('Tempo invalide.');const events=[];for(const n of input){const o=root.J22Off?root.J22Off(n):0;events.push({t:Math.round((n.start+o)*120),on:true,p:pitch(n),v:n.velocity??100});events.push({t:Math.round((n.start+o+n.dur)*120),on:false,p:pitch(n),v:0});}events.sort((a,b)=>a.t-b.t||Number(a.on)-Number(b.on)||a.p-b.p);
 const vlq=n=>{let a=[n&127];while(n>>=7)a.unshift((n&127)|128);return a;};const tempo=Math.round(6e7/bpm),track=[0,255,81,3,(tempo>>16)&255,(tempo>>8)&255,tempo&255];let t=0;for(const e of events){track.push(...vlq(e.t-t),e.on?144:128,e.p,e.v);t=e.t;}track.push(0,255,47,0);const len=track.length;return new Uint8Array([77,84,104,100,0,0,0,6,0,0,0,1,1,224,77,84,114,107,(len>>>24)&255,(len>>>16)&255,(len>>>8)&255,len&255,...track]);
}
root.J97Music={notes,edit,stats,midi,scales};if(typeof module!=='undefined')module.exports=root.J97Music;
})(typeof window!=='undefined'?window:globalThis);

