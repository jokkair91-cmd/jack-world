/* =====================================================================
   SYNTHÉ JX-22 (V1.2)
   - Une "voix" = 2 oscillateurs -> filtre -> enveloppe -> bus du synthé.
   - Le synthé est INDÉPENDANT du beat : Play / Pause / Stop ne le touchent pas.
   - Chaque note relâchée s'éteint en douceur (pas de clic).
   - Polyphonie limitée à MAX_VOICES : au-delà, la plus ancienne voix est coupée.
   ===================================================================== */
const START_LEAD = 0.015;             // les notes démarrent un tout petit peu dans le futur (en secondes) pour que la montée douce ne soit jamais "déjà passée"
const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const WHITE_IDX = [0,2,4,5,7,9,11,12,14,16,17,19,21,23];        // 14 touches blanches = 2 octaves
const BLACK_AFTER = {0:1, 1:3, 3:6, 4:8, 5:10, 7:13, 8:15, 10:18, 11:20, 12:22}; // place de la blanche -> numéro du dièse
/* Touches de l'ordinateur : on lit la POSITION physique (e.code), donc ça marche en AZERTY comme en QWERTY */
const KEYMAP = {KeyA:0,KeyW:1,KeyS:2,KeyE:3,KeyD:4,KeyF:5,KeyT:6,KeyG:7,KeyY:8,KeyH:9,KeyU:10,KeyJ:11,KeyK:12,KeyO:13,KeyL:14,KeyP:15,Semicolon:16};
const KEY_FALLBACK = {KeyA:'A',KeyW:'W',KeyS:'S',KeyE:'E',KeyD:'D',KeyF:'F',KeyT:'T',KeyG:'G',KeyY:'Y',KeyH:'H',KeyU:'U',KeyJ:'J',KeyK:'K',KeyO:'O',KeyL:'L',KeyP:'P',Semicolon:';'};

let presetKey = 'lead', octave = 4;

const alive = [];            // toutes les voix qui sonnent (tenues + en train de s'éteindre)
const held = new Map();      // source (touche, doigt...) -> voix tenue
const pressCount = new Map();// numéro de touche -> nombre de sources qui l'appuient
const keyEls = [];

function noteOn(source, idx) {
  if (held.has(source)) noteOff(source);          // sécurité : une source = une note
  initAudio();
  const v = engine.startVoice(source, presetKey, octave, idx, audio.currentTime + START_LEAD);
  held.set(source, v); press(idx, 1);
  recNoteOn(source, idx);                          // enregistreur
  return v;
}

function noteOff(source) {
  const v = held.get(source);
  if (!v) return;
  held.delete(source); press(v.idx, -1);
  recNoteOff(source);                              // enregistreur
  engine.releaseVoice(v);
}
function releaseAllHeld() { ptrNote.clear(); [...held.keys()].forEach(noteOff); }   // relâche tout (fenêtre perdue, etc.)
function panic() {                                                                  // bouton "Couper les notes"
  ptrNote.clear(); [...held.keys()].forEach(noteOff);
  if (engine) engine.killAll();
}

function press(idx, d) {   // surligne la touche tant qu'au moins une source l'appuie
  const n = (pressCount.get(idx) || 0) + d;
  if (n <= 0) { pressCount.delete(idx); keyEls[idx].classList.remove('down'); }
  else { pressCount.set(idx, n); keyEls[idx].classList.add('down'); }
}

/* ---------- Clavier de piano (dessin) ---------- */
const piano = $('piano');
function makeKey(idx, type) {
  const k = document.createElement('div');
  k.className = 'key ' + type; k.dataset.i = idx; k.setAttribute('role', 'button');
  k.innerHTML = '<span class="kn"></span><span class="kk"></span>';
  keyEls[idx] = k; return k;
}
(function buildPiano() {
  const W = 100 / WHITE_IDX.length, BW = W * 0.6;     // largeurs en % : le piano s'adapte à l'écran
  WHITE_IDX.forEach((idx, pos) => {
    const k = makeKey(idx, 'white'); k.style.left = (pos * W) + '%'; k.style.width = W + '%'; piano.append(k);
  });
  Object.entries(BLACK_AFTER).forEach(([pos, idx]) => {
    const k = makeKey(idx, 'black'); k.style.left = ((+pos + 1) * W - BW / 2) + '%'; k.style.width = BW + '%'; piano.append(k);
  });
})();
function refreshNoteLabels() {
  keyEls.forEach((k, idx) => {
    const midi = (octave + 1) * 12 + idx, name = NOTE_NAMES[midi % 12] + (Math.floor(midi / 12) - 1);
    k.setAttribute('aria-label', name);
    k.querySelector('.kn').textContent = (idx % 12 === 0) ? name : '';
  });
}
function setKeyLabels(layoutMap) {   // écrit la vraie lettre du clavier (AZERTY ou QWERTY) sur chaque touche
  Object.entries(KEYMAP).forEach(([code, idx]) => {
    const letter = (layoutMap && layoutMap.get && layoutMap.get(code)) || KEY_FALLBACK[code];
    keyEls[idx].querySelector('.kk').textContent = String(letter).toUpperCase();
  });
}
setKeyLabels(null);
try { if (navigator.keyboard && navigator.keyboard.getLayoutMap) navigator.keyboard.getLayoutMap().then(setKeyLabels).catch(() => {}); } catch (e) {}

/* ---------- Octave, son, volume ---------- */
function setOctave(o) {
  octave = Math.max(1, Math.min(7, o));
  $('octVal').textContent = octave;
  refreshNoteLabels();
}
$('octDown').onclick = () => setOctave(octave - 1);
$('octUp').onclick = () => setOctave(octave + 1);
$('preset').addEventListener('change', () => {
  presetKey = $('preset').value;
  setOctave(PRESETS[presetKey].octave);            // chaque son démarre dans son octave naturelle (808 = grave)
  const is808 = !!PRESETS[presetKey].harm;         // le curseur d'harmoniques n'apparaît que pour le 808
  $('harmCtl').classList.toggle('on', is808);
  $('harmHint').classList.toggle('on', is808);
});
$('harmAmt').addEventListener('input', () => {
  const v = Number($('harmAmt').value);
  $('harmVal').textContent = v + '%';
  if (engine) engine.setHarm(v);   // changement progressif : pas de clic
});
$('synthVol').addEventListener('input', () => {
  const v = Number($('synthVol').value);
  $('synthVolVal').textContent = v + '%';
  $('mixSynth').value = v; $('mixSynthVal').textContent = v + '%';   // copie dans le mixeur
  if (engine) engine.setSynthVol(v);
});

/* ---------- Mixeur (V1.3, étape 3) ---------- */
const TRACK_NAMES = ['Kick', 'Snare', 'Hi-hat', 'Clap'];
[['mixKick', 'muteKick'], ['mixSnare', 'muteSnare'], ['mixHat', 'muteHat'], ['mixClap', 'muteClap']].forEach(([sid, mid], r) => {
  $(sid).addEventListener('input', () => {
    const v = Number($(sid).value);
    $(sid + 'Val').textContent = v + '%';
    if (engine) engine.setTrackLevel(r, v);
  });
  $(mid).addEventListener('click', () => {
    const on = $(mid).getAttribute('aria-pressed') !== 'true';
    $(mid).setAttribute('aria-pressed', String(on));
    $(mid).setAttribute('aria-label', (on ? 'Réactiver le ' : 'Couper le ') + TRACK_NAMES[r]);
    if (engine) engine.setTrackMute(r, on);
  });
});
$('muteSynth').addEventListener('click', () => {
  const on = $('muteSynth').getAttribute('aria-pressed') !== 'true';
  $('muteSynth').setAttribute('aria-pressed', String(on));
  $('muteSynth').setAttribute('aria-label', on ? 'Réactiver le synthé' : 'Couper le synthé');
  if (engine) engine.setSynthMute(on);
});
/* Synthé et Master : les curseurs du mixeur pilotent les curseurs d'origine (qui font le travail) */
$('mixSynth').addEventListener('input', () => { $('synthVol').value = $('mixSynth').value; $('synthVol').dispatchEvent(new Event('input')); });
$('mixMaster').addEventListener('input', () => { $('master').value = $('mixMaster').value; $('master').dispatchEvent(new Event('input')); });
$('panic').onclick = panic;
refreshNoteLabels();

/* ---------- Souris et tactile (pointer events : plusieurs doigts possibles, glissando) ---------- */
const ptrNote = new Map();   // identifiant du doigt/souris -> numéro de touche
function keyAtPoint(x, y) {
  const el = document.elementFromPoint(x, y), k = el && el.closest && el.closest('.key');
  return (k && piano.contains(k)) ? +k.dataset.i : null;
}
piano.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  const k = e.target.closest('.key'); if (!k) return;
  e.preventDefault();
  try { piano.setPointerCapture(e.pointerId); } catch (err) {}
  const idx = +k.dataset.i;
  ptrNote.set(e.pointerId, idx);
  noteOn('p' + e.pointerId, idx);
});
piano.addEventListener('pointermove', e => {       // on glisse le doigt/la souris sur une autre touche
  if (!ptrNote.has(e.pointerId)) return;
  const idx = keyAtPoint(e.clientX, e.clientY);
  if (idx === null || idx === ptrNote.get(e.pointerId)) return;
  noteOff('p' + e.pointerId);
  ptrNote.set(e.pointerId, idx);
  noteOn('p' + e.pointerId, idx);
});
const endPointer = e => {
  if (!ptrNote.has(e.pointerId)) return;
  ptrNote.delete(e.pointerId);
  noteOff('p' + e.pointerId);
};
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => piano.addEventListener(ev, endPointer));
piano.addEventListener('contextmenu', e => e.preventDefault());   // pas de menu pendant un appui long

/* ---------- Clavier de l'ordinateur ---------- */
document.addEventListener('keydown', e => {
  if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return;
  const ae = document.activeElement;
  if (ae && /^(INPUT|SELECT|TEXTAREA)$/.test(ae.tagName)) return;   // on tape dans un champ : pas de notes
  if (e.code === 'ArrowUp')   { e.preventDefault(); setOctave(octave + 1); return; }
  if (e.code === 'ArrowDown') { e.preventDefault(); setOctave(octave - 1); return; }
  const idx = KEYMAP[e.code];
  if (idx === undefined) return;
  e.preventDefault();
  noteOn('k:' + e.code, idx);
});
document.addEventListener('keyup', e => noteOff('k:' + e.code));

/* ---------- Anti "notes bloquées" ---------- */
window.addEventListener('blur', releaseAllHeld);
document.addEventListener('visibilitychange', () => { if (document.hidden) releaseAllHeld(); });
/* Après avoir réglé un curseur ou une liste, on rend le clavier à la page (sinon les lettres restent "dans" le curseur) */
document.querySelectorAll('input[type=range]').forEach(el => el.addEventListener('pointerup', () => el.blur()));
document.querySelectorAll('select').forEach(el => el.addEventListener('change', () => el.blur()));
$('bpm').addEventListener('keydown', e => { if (e.key === 'Enter') $('bpm').blur(); });


