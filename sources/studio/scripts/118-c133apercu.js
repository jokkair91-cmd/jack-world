(()=>{const q=new URLSearchParams(location.search);if(q.get('style')!=='origine')document.body.classList.add('c133');
 window.JACK22_STYLE133={on:()=>document.body.classList.contains('c133')};
 // Pour les captures : ouvrir une vue précise (?vue=arrange|beat|roll|voice|mix). Sans ce paramètre, rien ne change.
 const v=q.get('vue');if(v){const w=setInterval(()=>{const W=window.JACK22_WORKSPACE;if(!W||!document.getElementById('j93Nav'))return;clearInterval(w);setTimeout(()=>{W.choose(v==='voice'?'voice':v==='mix'?'mix':'compose',v==='voice'?'record':v==='mix'?'mixer':v);},400);},250);}})();