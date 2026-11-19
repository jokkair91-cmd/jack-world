
/* 6.7 (Mission 0a, Claude) : une note ne commence jamais avant la case 1 du pattern.
   Défaut de la 6.6 : glisser, « Déplacer » ou « Coller » une note décalée vers la gauche (décalage fin de la Mission 5)
   sur la case 1 gardait son décalage négatif. La sauvegarde s'écrivait, mais « Charger » refusait TOUT le projet.
   Ce bloc :
   1. ramène le décalage à 0 dès qu'une note arrive sur la case 1 (souris, Déplacer, Coller, et tout autre geste) ;
   2. sauvegarde toujours des notes valides ;
   3. au chargement, répare une note dans ce cas au lieu de rejeter le projet entier (les sauvegardes déjà touchées se rouvrent).
   Rien d'autre ne change : une note qui ne commence pas avant la case 1 garde son décalage, son écoute et son WAV. */
(() => {
 'use strict';
 // Une note « avant la case 1 » : début entier >= 0, décalage fin négatif plus grand que le début.
 const before = n => n && typeof n === 'object' && Number.isInteger(n.start) && n.start >= 0 && Number.isFinite(n.off) && n.start + n.off < 0;
 function fix(n) {                                   // ramène la note sur la case où elle est dessinée et entendue (comme J22Off)
  const o = Math.round(-n.start * 1e4) / 1e4;
  if (Math.abs(o) < 1e-4) delete n.off; else n.off = o;
 }
 function fixList(notes) { let k = 0; if (Array.isArray(notes)) for (const n of notes) if (before(n)) { fix(n); k++; } return k; }
 function fixAll() {                                  // toutes les pistes, tous les patterns (le pattern affiché en fait partie)
  let k = fixList(roll.notes);
  for (const t of song.tracks) for (const p of t.patterns || []) if (p && Array.isArray(p.notes)) k += fixList(p.notes);
  return k;
 }
 // 1. Gestes : tous passent par rollChanged (souris : rollEnd ; Déplacer, Coller, outils : JACK22_NOTE_EDITOR.commit).
 const baseChanged = rollChanged;
 rollChanged = function () { fixAll(); return baseChanged.apply(this, arguments); };
 // Pendant le glisser, la note est dessinée là où elle sonnera (sans attendre le relâchement).
 $('rollGrid').addEventListener('pointermove', () => { const d = rollDrag; if (d && d.mode !== 'resize' && before(d.n)) { fix(d.n); rollPlace(d.el, d.n); } });
 // 2. Sauvegarde : jamais de note invalide écrite (sauvegarde locale, projet portable, export).
 const baseSong = currentSongSave, baseRoll = currentRollSave;
 currentSongSave = function () { fixAll(); return baseSong.apply(this, arguments); };
 currentRollSave = function () { fixAll(); return baseRoll.apply(this, arguments); };
 // 3. Chargement : la note est réparée sur une copie, puis la vérification d'origine (tout ou rien) s'applique au reste.
 let repaired = 0, pending = null;
 const baseParse = parseRollSave;
 parseRollSave = function (r) {
  if (r && typeof r === 'object' && !Array.isArray(r) && Array.isArray(r.notes) && r.notes.some(before)) {
   const notes = r.notes.map(n => before(n) ? Object.assign({}, n) : n), k = fixList(notes);
   const out = baseParse.call(this, Object.assign({}, r, { notes }));
   if (out) { repaired += k; if (pending === null) pending = setTimeout(report, 0); }
   return out;
  }
  return baseParse.apply(this, arguments);
 };
 function report() {                                  // message ajouté au statut seulement si le chargement a réussi
  pending = null; const k = repaired; repaired = 0; if (!k) return;
  const s = $('status'), txt = (s && s.textContent) || '';
  const msg = k + ' note' + (k > 1 ? 's' : '') + ' ramenée' + (k > 1 ? 's' : '') + ' sur la case 1 (elle' + (k > 1 ? 's' : '') + ' commençai' + (k > 1 ? 'ent' : 't') + ' avant le début du pattern)';
  if (!/invalide|impossible/i.test(txt)) setStatus(txt ? txt + ' · ' + msg : msg);
 }
 window.JACK22_NOTES137 = { version: '11.5-claude-6.7-notes-debut', before, fixAll, get repaired() { return repaired; } };
})();
