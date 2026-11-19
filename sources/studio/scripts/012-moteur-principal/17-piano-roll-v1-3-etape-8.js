/* =====================================================================
   PIANO ROLL (V1.3, étape 8)
   - Grille de 16 pas par mesure (1, 2 ou 4 mesures), hauteurs C1..B6 avec leurs noms, défilement vertical et horizontal.
   - Souris : clic = ajouter ; glisser une note = déplacer (temps + hauteur) ; glisser son bord droit = longueur ;
     clic droit (ou Suppr) = supprimer ; Ctrl+Z / bouton = annuler. Tout s'aligne sur les pas de 1/16 et les demi-tons.
   - Lecture : le programmateur de pas du beat appelle rollSchedule() ; mêmes voix, même mixeur, mêmes effets, même export que la prise.
   ===================================================================== */
let rollSel = null, rollDrag = null;
const rollUndoStack = [];
const rollName = n => { const m = rollMidi(n); return NOTE_NAMES[m % 12] + (Math.floor(m / 12) - 1); };
const rollSnap = () => JSON.stringify({ bars: roll.bars, notes: roll.notes });
function rollMsg(t) { $('rollStatus').textContent = t; window.Jack22Feedback?.publish('roll', t); }
function rollPush(snap) { rollUndoStack.push(snap); if (rollUndoStack.length > 100) rollUndoStack.shift(); }
function rollSetPitch(n, m) { n.octave = Math.floor(m / 12) - 1; n.idx = m % 12; }

function rollBuildGrid() {
  const col = $('rollKeyCol'), grid = $('rollGrid'), lines = grid.querySelector('.roll-lines');
  for (let m = ROLL_HI; m >= ROLL_LO; m--) {
    const pc = m % 12, blk = [1, 3, 6, 8, 10].includes(pc), c = pc === 0;
    const k = document.createElement('div'); k.className = 'roll-key' + (blk ? ' blk' : '') + (c ? ' c' : ''); k.textContent = NOTE_NAMES[pc] + (Math.floor(m / 12) - 1); col.appendChild(k);
    const r = document.createElement('div'); r.className = 'roll-row' + (blk ? ' blk' : '') + (c ? ' c' : ''); grid.insertBefore(r, lines);
  }
}
function rollPlace(el, n) {
  el.style.left = ((n.start + (n.off || 0)) * ROLL_CW) + 'px'; el.style.top = ((ROLL_HI - rollMidi(n)) * ROLL_RH) + 'px'; el.style.width = (n.dur * ROLL_CW - 1) + 'px';
  el.title = rollName(n) + ' · ' + n.dur + ' pas' + (n.off ? ' · décalée de ' + (n.off * stepSec() * 1000).toFixed(1) + ' ms' : '') + (n.velocity !== undefined ? ' · vélocité ' + n.velocity : '');
}
function rollDraw() {
  const grid = $('rollGrid'); grid.style.width = (roll.steps * ROLL_CW) + 'px';
  [...grid.querySelectorAll('.rn')].forEach(e => e.remove());
  roll.notes.forEach((n, i) => {
    const el = document.createElement('div'); el.className = 'rn p-' + n.preset + (n === rollSel ? ' sel' : ''); el.dataset.i = i; rollPlace(el, n);
    const z = document.createElement('div'); z.className = 'rz'; el.appendChild(z); grid.appendChild(el);
  });
}
function rollChanged() {                                   // après chaque modification terminée
  roll.notes.sort((a, b) => a.start - b.start || rollMidi(a) - rollMidi(b));
  { const cp = activePat(rollTrack); cp.bars = roll.bars; cp.steps = roll.steps; cp.notes = roll.notes; cp.keys = null; rollMsgPat(); }   // le pattern affiché reçoit toujours les modifications
  rollDupSet = rollKeySet(roll);
  rollDraw();
  rollMsg(roll.notes.length ? 'Piano Roll : ' + roll.notes.length + ' note' + (roll.notes.length > 1 ? 's' : '') + ' · ' + roll.bars + ' mesure' + (roll.bars > 1 ? 's' : '') + '.' : 'Piano Roll vide : clique dans la grille pour ajouter une note.');
  $('rollUndo').disabled = !rollUndoStack.length; $('rollClear').disabled = !roll.notes.length;
  uiExp();                                                 // l'export suit (durée, case "Inclure le Piano Roll")
}
/* Écoute d'une note quand on la pose ou la déplace : note programmée courte (même moteur, même mixeur) ; n'entre jamais dans l'enregistreur */
function rollPreview(n) {
  try { initAudio(); const t = audio.currentTime + START_LEAD; engine.scheduleNote(n.preset, n.octave, n.idx, t, t + 0.25); } catch (e) {}
}
function rollDelete(n) { rollPush(rollSnap()); roll.notes = roll.notes.filter(o => o !== n); if (rollSel === n) rollSel = null; rollChanged(); }
function rollUndoDo() { if (!rollUndoStack.length) return; const o = JSON.parse(rollUndoStack.pop()); roll.bars = o.bars; roll.steps = o.bars * 16; roll.notes = o.notes; rollSel = null; $('rollBars').value = String(roll.bars); rollChanged(); }
function rollApply(r) {                                    // remplace le Piano Roll (chargement) ; r vient de parseRollSave
  rollPush(rollSnap()); roll.bars = r.bars; roll.steps = r.bars * 16; roll.notes = r.notes.map(n => Object.assign({}, n)); rollSel = null; rollDrag = null; $('rollBars').value = String(roll.bars); rollChanged();
}
function currentRollSave() {
  return { version: 1, bars: roll.bars, notes: roll.notes.map(n => ({ start: n.start, dur: n.dur, preset: n.preset, octave: n.octave, idx: n.idx, ...(n.velocity!==undefined?{velocity:n.velocity}:{}), ...(n.glide!==undefined?{glide:n.glide}:{}), ...(n.off?{off:n.off}:{}) })) };
}
/* Vérifie un bloc "roll" lu dans une sauvegarde : tout ou rien. Renvoie { bars, notes } propres (doublons exacts retirés) ou null. */
function parseRollSave(r) {
  if (r === null || typeof r !== 'object' || Array.isArray(r) || ![1, 2, 4].includes(r.bars) || !Array.isArray(r.notes) || r.notes.length > ROLL_MAX_NOTES) return null;
  const steps = r.bars * 16, notes = [], seen = new Set();
  for (const n of r.notes) {
    if (n === null || typeof n !== 'object' || Array.isArray(n)) return null;
    const ok = Number.isInteger(n.start) && n.start >= 0 && n.start < steps && Number.isInteger(n.dur) && n.dur >= 1 && n.start + n.dur <= steps &&
      typeof n.preset === 'string' && Object.prototype.hasOwnProperty.call(PRESETS, n.preset) &&
      Number.isInteger(n.octave) && n.octave >= 1 && n.octave <= 6 && Number.isInteger(n.idx) && n.idx >= 0 && n.idx <= 11;
    if (!ok) return null;
    const k = rollDupKey(n.start, (n.octave + 1) * 12 + n.idx, n.preset);
    if (seen.has(k)) continue; seen.add(k);
    if(n.velocity!==undefined&&(!Number.isInteger(n.velocity)||n.velocity<1||n.velocity>127))return null;
    if(n.off!==undefined&&(!Number.isFinite(n.off)||Math.abs(n.off)>=0.5||n.start+n.off<0))return null;
    if(n.glide!==undefined&&(!Number.isFinite(n.glide)||n.glide<0||n.glide>1))return null;
    notes.push({ start: n.start, dur: n.dur, preset: n.preset, octave: n.octave, idx: n.idx,...(n.velocity!==undefined?{velocity:n.velocity}:{}),...(n.glide!==undefined?{glide:n.glide}:{}),...(n.off?{off:n.off}:{}) });
  }
  return { bars: r.bars, notes };
}

/* ---------- lecture ---------- */
function rollSchedule(abs, t, len) {                       // appelée par le programmateur pour CHAQUE pas (comme recSchedule)
  if (abs < 0 || !engine || !$('rollWith').checked) return;
  song.tracks.map((_,i)=>i).slice(1).forEach(ti => {                                   // basse et mélodie : chacune joue son pattern actif, à sa propre longueur
    const sg = segFor(ti, abs); if (!sg || song.tracks[ti].mute || !sg.p.notes.length) return;
    const lp = (((abs - sg.off) % sg.p.steps) + sg.p.steps) % sg.p.steps, left = sg.end - abs;   // left : pas restants avant la fin du bloc (Infinity en mode PATTERN)
    sg.p.notes.forEach(n => { const e = n.start + (window.J22Off ? window.J22Off(n) : 0); if (Math.floor(e) !== lp) return; const ts = t + (e - lp) * len; melodyVoices.push(engine.scheduleNote(n.preset, n.octave, n.idx, ts, ts + Math.min(n.dur, left - (e - lp)) * len,{...n,trackKey:song.tracks[ti].key})); });   // note coupée à la frontière du bloc ; M5 : décalage fin (même calcul que l'export)
  });   // même liste que la prise : Pause / Stop / Couper les notes les coupent
}
function rollMoveHead(abs) {
  const head = $('rollHead');
  if (abs === null || abs < 0 || state !== 'playing') { head.style.display = 'none'; return; }
  const x = (((abs % roll.steps) + roll.steps) % roll.steps) * ROLL_CW, w = $('rollWrap');
  head.style.display = 'block'; head.style.left = x + 'px';
  if (!rollDrag && (x < w.scrollLeft || x > w.scrollLeft + w.clientWidth - 46 - 30)) w.scrollLeft = Math.max(0, x - 20);   // la lecture reste visible
}
function rollHideHead() { $('rollHead').style.display = 'none'; }

/* ---------- souris et clavier ---------- */
const rollPos = e => { const r = $('rollGrid').getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
$('rollGrid').addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  const grid = $('rollGrid'); grid.focus({ preventScroll: true });
  const { x, y } = rollPos(e), el = e.target.closest('.rn'), snap = rollSnap();
  if (el) {                                                // sur une note : la sélectionner et préparer déplacement / longueur
    const n = roll.notes[Number(el.dataset.i)]; if (!n) return;
    if (rollSel !== n) { rollSel = n; grid.querySelectorAll('.rn.sel').forEach(q => q.classList.remove('sel')); el.classList.add('sel'); }
    rollDrag = { mode: e.target.classList.contains('rz') ? 'resize' : 'move', n, el, snap, x0: x, y0: y, start: n.start, dur: n.dur, midi: rollMidi(n) };
  } else {                                                 // sur le vide : ajouter une note (qu'on peut allonger en glissant tout de suite)
    const step = Math.max(0, Math.min(roll.steps - 1, Math.floor(x / ROLL_CW))), row = Math.max(0, Math.min(ROLL_ROWS - 1, Math.floor(y / ROLL_RH))), m = ROLL_HI - row;
    const n = { start: step, dur: Math.max(1, Math.min(Number($('rollLen').value) || 2, roll.steps - step)), preset: $('rollSound').value, octave: Math.floor(m / 12) - 1, idx: m % 12 };
    roll.notes.push(n); rollSel = n; rollDraw();
    rollDrag = { mode: 'resize', n, el: grid.querySelector('.rn[data-i="' + (roll.notes.length - 1) + '"]'), snap, x0: x, y0: y, start: n.start, dur: n.dur, midi: m };
    rollPreview(n);
  }
  try { grid.setPointerCapture(e.pointerId); } catch (err) {}          // (le glisser continue même si le navigateur refuse la capture)
  e.preventDefault();
});
$('rollGrid').addEventListener('pointermove', e => {
  if (!rollDrag) return;
  const d = rollDrag, n = d.n, { x, y } = rollPos(e);
  if (d.mode === 'resize') n.dur = Math.max(1, Math.min(roll.steps - n.start, d.dur + Math.round((x - d.x0) / ROLL_CW)));
  else {
    n.start = Math.max(0, Math.min(roll.steps - n.dur, d.start + Math.round((x - d.x0) / ROLL_CW)));
    const m = Math.max(ROLL_LO, Math.min(ROLL_HI, d.midi - Math.round((y - d.y0) / ROLL_RH)));
    if (m !== rollMidi(n)) { rollSetPitch(n, m); rollPreview(n); }
  }
  rollPlace(d.el, n);
});
function rollEnd() {
  if (!rollDrag) return;
  const d = rollDrag; rollDrag = null;
  const k = rollDupKey(d.n.start, rollMidi(d.n), d.n.preset);                              // deux notes identiques au même endroit : la note posée remplace l'autre
  roll.notes = roll.notes.filter(o => o === d.n || rollDupKey(o.start, rollMidi(o), o.preset) !== k);
  if (d.snap !== rollSnap()) rollPush(d.snap);
  rollChanged();
}
$('rollGrid').addEventListener('pointerup', rollEnd);
$('rollGrid').addEventListener('pointercancel', rollEnd);
$('rollGrid').addEventListener('contextmenu', e => {
  e.preventDefault();                                      // pas de menu du navigateur : clic droit sur une note = la supprimer
  const el = e.target.closest('.rn'); if (el && roll.notes[Number(el.dataset.i)]) rollDelete(roll.notes[Number(el.dataset.i)]);
});
$('rollGrid').addEventListener('keydown', e => {
  if ((e.key === 'Delete' || e.key === 'Backspace') && rollSel) { e.preventDefault(); rollDelete(rollSel); }
  else if (e.key === 'Escape' && rollSel) { rollSel = null; rollDraw(); }
  else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); rollUndoDo(); }
});
$('rollUndo').onclick = rollUndoDo;
$('rollClear').onclick = () => { if (!roll.notes.length) return; rollPush(rollSnap()); roll.notes = []; rollSel = null; rollChanged(); rollMsg('Piano Roll effacé (Annuler pour le rétablir).'); };
$('rollBars').onchange = () => {
  const b = Number($('rollBars').value), steps = b * 16;
  if (roll.notes.some(n => n.start + n.dur > steps)) {     // jamais de perte de notes : on refuse
    $('rollBars').value = String(roll.bars); rollMsg('Impossible de passer à ' + b + ' mesure' + (b > 1 ? 's' : '') + ' : des notes dépassent. Supprime-les ou raccourcis-les d\'abord.'); return;
  }
  rollPush(rollSnap()); roll.bars = b; roll.steps = steps; rollChanged();
};
$('rollSound').innerHTML = $('preset').innerHTML;          // les mêmes cinq sons que le synthé
rollBuildGrid(); rollDupSet = rollKeySet(roll); $('rollSound').value = trackSound[rollTrack]||'lead'; rollLoad(activePat(rollTrack)); buildPatternUI();
$('rollWrap').scrollTop = (ROLL_HI - 60) * ROLL_RH - 170;  // au départ : autour du Do central (C4)

render();
