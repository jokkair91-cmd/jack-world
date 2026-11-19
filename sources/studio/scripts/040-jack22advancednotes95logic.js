
(function(root){'use strict';const T=root.JACK22_NOTE_TOOLS;if(!T)return;const previous=T.transform,fail=error=>({ok:false,error}),clone=n=>({...n});
function ids(notes,indices){if(!Array.isArray(indices)||!indices.length)return null;const s=[...new Set(indices)];return s.every(i=>Number.isInteger(i)&&i>=0&&i<notes.length)?s:null}
function copy(notes,steps,indices){const valid=T.validate(notes,steps);if(!valid.ok)return valid;const ix=ids(notes,indices);if(!ix)return fail('Sélectionne des notes à copier.');const first=Math.min(...ix.map(i=>notes[i].start));return{ok:true,notes:ix.map(i=>({...notes[i],start:notes[i].start-first}))}}
function paste(notes,steps,clip,start){const v=T.validate(notes,steps);if(!v.ok)return v;if(!Array.isArray(clip)||!clip.length||clip.length>1000||!Number.isInteger(start)||start<0)return fail('Copie ou position invalide.');const clipCheck=T.validate(clip,steps);if(!clipCheck.ok)return clipCheck;const added=clip.map(n=>({...n,start:n.start+start})),next=notes.map(clone).concat(added),result=T.validate(next,steps);if(!result.ok)return result;return{ok:true,changed:true,notes:next,selected:notes.length,selectionIndices:added.map((_,i)=>notes.length+i)}}
T.copy=copy;T.paste=paste;
T.transform=function(notes,steps,indices,action,value){
 if(!['length','move','delete'].includes(action))return previous(notes,steps,indices,action,value);
 const valid=T.validate(notes,steps);if(!valid.ok)return valid;const ix=ids(notes,indices);if(!ix)return fail('Sélectionne une ou plusieurs notes.');let next=notes.map(clone),selected=ix;
 if(action==='length'){if(![1,2,4,8,16].includes(value))return fail('Longueur invalide.');for(const i of ix)next[i].dur=value}
 if(action==='move'){if(![-16,-4,-1,1,4,16].includes(value))return fail('Déplacement invalide.');for(const i of ix)next[i].start+=value}
 if(action==='delete'){const set=new Set(ix);next=next.filter((_,i)=>!set.has(i));selected=[]}
 const v=T.validate(next,steps);if(!v.ok)return v;return{ok:true,changed:JSON.stringify(next)!==JSON.stringify(notes),notes:next,selected:selected[0]??null,selectionIndices:selected}
};
if(typeof module!=='undefined'&&module.exports)module.exports=T;
})(typeof window!=='undefined'?window:globalThis);

