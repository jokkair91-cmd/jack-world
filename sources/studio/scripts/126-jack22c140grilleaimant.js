
/* 7.0 (Mission M3, Claude) : grille et aimant des clips audio.
   - Bouton « Aimant » (allumé en rouge) dans la barre de l'arrangement, et choix de la grille : mesure, temps, 1/8, 1/16.
   - Alt pendant le glisser inverse l'aimant (aimant éteint + Alt = calé sur la grille).
   - Aimant éteint : position libre, à l'échantillon près.
   - Raccourci : touche G (hors champ de saisie) = aimant oui/non.
   - Le choix est gardé dans le projet (réglages du studio) et dans l'historique de la page ; une ancienne sauvegarde ouvre avec l'aimant au 1/16, comme avant. */
(() => {
 'use strict';
 const GRID = { bar: 16, beat: 4, '8': 2, '16': 1 }, NAMES = { bar: 'mesure', beat: 'temps', '8': '1/8', '16': '1/16' };
 let snap = { on: true, grid: '16' };
 const valid = s => s && typeof s === 'object' && typeof s.on === 'boolean' && Object.prototype.hasOwnProperty.call(GRID, s.grid);
 window.J140Snap = (s, alt) => {
  const on = alt ? !snap.on : snap.on;
  if (!on) return s;
  const q = GRID[snap.grid] * stepSec(); return Math.round(s / q) * q;
 };
 let box, btn, sel;
 function sync() { if (!btn) return; btn.setAttribute('aria-pressed', String(snap.on)); btn.textContent = snap.on ? 'Aimant ●' : 'Aimant ○'; sel.value = snap.grid; sel.disabled = !snap.on; btn.title = snap.on ? 'Aimant allumé : les clips se calent sur la grille (' + NAMES[snap.grid] + '). Alt pendant le glisser : libre. Touche G : éteindre.' : 'Aimant éteint : placement libre. Alt pendant le glisser : calé sur la grille. Touche G : allumer.'; }
 function set(next, why) { snap = { ...snap, ...next }; sync(); try { setStatus('Aimant ' + (snap.on ? 'allumé, grille : ' + NAMES[snap.grid] : 'éteint : placement libre') + (why ? ' (' + why + ')' : '') + '.'); } catch (e) {} try { ProjectPersistence.isDirty && window.Jack22Vision8?.remember?.(); } catch (e) {} }
 function build() {
  const after = document.getElementById('audioImport'); if (!after || document.getElementById('j140Snap')) return;
  box = document.createElement('span'); box.id = 'j140Snap';
  btn = document.createElement('button'); btn.type = 'button'; btn.id = 'j140SnapOn'; btn.onclick = () => set({ on: !snap.on });
  sel = document.createElement('select'); sel.id = 'j140Grid'; sel.setAttribute('aria-label', 'Grille de l’aimant'); sel.title = 'Grille de l’aimant';
  for (const k of ['bar', 'beat', '8', '16']) { const o = document.createElement('option'); o.value = k; o.textContent = NAMES[k]; sel.append(o); }
  sel.onchange = () => set({ grid: sel.value });
  box.append(btn, sel); after.after(box); sync();
 }
 document.addEventListener('keydown', e => { if ((e.key === 'g' || e.key === 'G') && !e.ctrlKey && !e.metaKey && !e.altKey && !e.target.closest?.('input,textarea,select,[contenteditable="true"],dialog')) { if (!document.getElementById('timeline')?.offsetParent) return; e.preventDefault(); set({ on: !snap.on }, 'touche G'); } });
 // Sauvegarde : un champ de plus dans les réglages du studio (ignoré sans danger par les versions précédentes).
 const cap = StudioSettings.capture, parse = StudioSettings.parse, apply = StudioSettings.apply;
 StudioSettings.capture = function () { const o = cap.apply(this, arguments); o.snap140 = { ...snap }; return o; };
 StudioSettings.parse = function (b) { const o = parse.apply(this, arguments); if (o && b && b.snap140 !== undefined) { if (!valid(b.snap140)) return false; o.snap140 = { on: b.snap140.on, grid: b.snap140.grid }; } return o; };
 StudioSettings.apply = function (st) { const r = apply.apply(this, arguments); snap = st && valid(st.snap140) ? { ...st.snap140 } : { on: true, grid: '16' }; sync(); return r; };
 build(); setTimeout(build, 1500);
 window.JACK22_SNAP140 = { version: '11.5-claude-7.0-grille-aimant', get state() { return { ...snap }; }, set: s => { if (!valid({ ...snap, ...s })) throw Error('Réglage d’aimant invalide.'); set(s); } };
})();
