
/* M5 (Claude) : décalage fin des notes du Piano Roll. Une note garde son pas (start, entier) et peut porter un décalage « off »
   (fraction de pas, de −0,49 à +0,49). Écoute, export WAV et export MIDI utilisent tous cette fonction : même résultat partout.
   Une note ne commence jamais avant le début de son pattern. */
window.J22Off = n => { const o = n && Number.isFinite(n.off) ? Math.max(-0.49, Math.min(0.49, n.off)) : 0; return Math.max(o, -(n.start || 0)); };
