(() => {
 'use strict';
 // 3. Couleurs du clavier : chaque note jouée (au clic, au clavier de l'ordinateur, en MIDI ou pendant la lecture) allume sa touche
 //    d'une couleur vive tirée au hasard ; une nouvelle couleur à chaque nouvelle note. Aucun effet sur le son.
 const piano = document.getElementById('piano'); if (!piano) return;
 const ON = /(^|\s)(down|c116Lit)(\s|$)/;
 let n = 0;
 const pick = k => { n++; const last = k && k.dataset.c149h !== undefined ? Number(k.dataset.c149h) : NaN; let h = 0, tries = 0; do { h = Math.floor(Math.random() * 360); tries++; } while (Number.isFinite(last) && Math.min(Math.abs(h - last), 360 - Math.abs(h - last)) < 60 && tries < 50); if (k) k.dataset.c149h = String(h); return 'hsl(' + h + ' 90% 60%)'; };
 const sync = k => {
  if (!k.classList || !k.classList.contains('key')) return;
  const lit = ON.test(k.className);
  if (lit) {
   if (!k.dataset.c149) k.dataset.c149 = pick(k);
   if (k.style.getPropertyValue('--c116C') !== k.dataset.c149) k.style.setProperty('--c116C', k.dataset.c149);
  } else if (k.dataset.c149) { delete k.dataset.c149; k.style.removeProperty('--c116C'); }
 };
 new MutationObserver(list => { for (const m of list) sync(m.target); }).observe(piano, { subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
 window.JACK22_CLAVIER149 = { version: '11.5-claude-7.8-clavier', get notes() { return n; } };
})();