(() => {
 'use strict';
 // Couleurs proposées aux nouvelles pistes (lisibles sur le fond graphite).
 const PALETTE = ['#4a90d9', '#e2b83c', '#9b6bd6', '#4caf6a', '#e2414c', '#3cc3c9', '#e07b39', '#d65fa6'];
 const $ = id => document.getElementById(id), A = () => window.JACK22_AUDIO_EDIT;
 let target = null;                       // piste audio choisie pour les imports (null = piste AUDIO)
 const tracks = () => (A()?.settings?.tracks || []);
 const say = t => { try { audioMsg(t); } catch (e) { try { setStatus(t); } catch (x) {} } };

 const ui = document.createElement('span'); ui.id = 'c145Tools';
 const add = document.createElement('button'); add.type = 'button'; add.textContent = '＋ Piste audio'; add.title = 'Ajouter une piste audio (32 au maximum)';
 const dest = document.createElement('select'); dest.setAttribute('aria-label', 'Piste de destination des fichiers importés'); dest.title = 'Les fichiers importés arrivent sur cette piste';
 ui.append(add, dest);

 const fill = () => {
  const list = tracks(), keep = target && list.some(t => t.id === target) ? target : null; target = keep;
  dest.replaceChildren(...list.map(t => { const o = document.createElement('option'); o.value = t.id; o.textContent = '→ ' + t.name; return o; }));
  dest.value = target || (list[0]?.id ?? '');
  add.disabled = list.length >= 32; add.title = list.length >= 32 ? 'Maximum 32 pistes audio atteint' : 'Ajouter une piste audio (' + list.length + ' sur 32)';
  document.querySelectorAll('#timeline .tl-row.c145Target').forEach(r => r.classList.remove('c145Target'));
  if (target) document.querySelector('#timeline [data-j99-lane="' + CSS.escape(target) + '"]')?.closest('.tl-row')?.classList.add('c145Target');
 };
 const placeUi = () => {
  const imp = $('audioImport'); if (!imp || !A()) return false;
  if (!ui.isConnected) imp.after(ui);
  fill(); return true;
 };

 // Couleur réglée par la fenêtre normale de la piste (« Réglages de la piste audio » → Appliquer), puis refermée.
 const setColor = (id, color) => {
  try {
   A().open(null, id); const d = $('j99Dialog'); if (!d) return false;
   const inp = d.querySelector('input[type="color"]'), ok = [...d.querySelectorAll('button')].find(b => b.textContent.trim() === 'Appliquer la piste');
   if (!inp || !ok) { d.close?.(); return false; }
   inp.value = color; inp.dispatchEvent(new Event('input', { bubbles: true })); ok.click(); d.close?.(); return true;
  } catch (e) { return false; }
 };
 add.onclick = () => {
  try {
   const n = tracks().length, name = 'Piste audio ' + (n - 3);           // les 4 premières : AUDIO, VOIX 1 à 3
   A().addTrack(name);
   const t = tracks().at(-1); target = t?.id || null;
   // Couleur différente pour chaque nouvelle piste (réglage normal de la piste, enregistré avec le projet).
   if (t) setColor(t.id, PALETTE[(n - 4 + PALETTE.length) % PALETTE.length]);
   tlBuild(); fill(); say('« ' + name + ' » créée (' + tracks().length + ' pistes audio sur 32). Les fichiers importés arriveront dessus.');
  } catch (e) { say(e.message); }
 };
 dest.onchange = () => { target = dest.value === 'audio' ? null : dest.value; fill(); };

 // Import : le fichier arrive sur la piste choisie (déplacement normal, annulable, sans toucher au fichier).
 const imp0 = audioImportFile;
 audioImportFile = async function (file, attach) {
  const before = new Set(audioClips.map(c => c.id)), r = await imp0.apply(this, arguments);
  if (!attach && target) {
   const c = audioClips.find(x => !before.has(x.id));
   if (c) try { A().place(c.id, A().seconds(c), target); tlBuild(); say('« ' + c.name + ' » importé sur ' + (tracks().find(t => t.id === target)?.name || 'la piste') + '.'); } catch (e) { say('Import fait sur AUDIO (déplacement impossible : ' + e.message + ').'); }
  }
  return r;
 };

 // Arrangement reconstruit : outils remis en place et piste cible surlignée.
 const build0 = tlBuild; tlBuild = function () { const r = build0.apply(this, arguments); try { placeUi(); } catch (e) {} return r; };
 if (!placeUi()) { const t = setInterval(() => { if (placeUi()) clearInterval(t); }, 300); setTimeout(() => clearInterval(t), 30000); }
 window.JACK22_TRACKS139 = window.JACK22_TRACKS145 = { version: '11.5-claude-7.4-pistes-audio', get target() { return target; }, set target(v) { target = v; fill(); }, tracks };
})();