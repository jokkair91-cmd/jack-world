/* =====================================================================
   ENREGISTREUR DE NOTES (V1.3, étape 4)
   - REC : le beat repart du début avec un compte à rebours (positions négatives), puis tout ce qui est
     joué sur le synthé est noté (hauteur, son, début, durée) pendant la longueur choisie.
   - À la fin, la prise remplace l'ancienne (seulement si au moins une note a été jouée) et tourne en boucle avec le beat.
   - La relecture passe par le moteur (notes programmées) : même son que le jeu en direct, réglé par le mixeur.
   ===================================================================== */
const rec = { state: 'idle', bars: 2, steps: 32, countSteps: 16, quantize: true, open: new Map(), raw: [], endTime: null };   // state : 'idle' | 'armed'
let take = null;                  // la prise enregistrée (ou null)
const melodyVoices = [];          // voix de la mélodie qui jouent, pour pouvoir les couper à l'arrêt
const LAT_MAX = 0.12;

/* Retard entre l'horloge audio et ce que l'on entend (indiqué par le navigateur, 0 s'il ne le dit pas) */
function latency() {
  if (!audio) return 0;
  const L = (audio.baseLatency || 0) + (audio.outputLatency || 0);
  return Math.min(Math.max(L, 0), LAT_MAX);
}
const absNow = () => absAtLog(stepLog, audio.currentTime - latency());

function recNoteOn(source, idx) {
  if (rec.state === 'idle' || !stepLog.length) return;
  const pos = absNow();
  if (pos === null || pos < -0.5 || pos >= rec.steps) return;          // hors de la prise : pas enregistré
  rec.open.set(source, { start: Math.max(0, pos), preset: presetKey, octave, idx });
}
function recNoteOff(source) {
  const o = rec.open.get(source); if (!o) return;
  rec.open.delete(source);
  const pos = absNow();
  rec.raw.push({ start: o.start, end: Math.min(pos === null ? rec.steps : pos, rec.steps), preset: o.preset, octave: o.octave, idx: o.idx });
}

function clickAt(t, accent) {                                           // "tic" du compte à rebours (pas dans la prise, pas dans l'export)
  if (!audio || !bus) return;
  const o = audio.createOscillator(), g = audio.createGain();
  o.frequency.value = accent ? 1500 : 1000;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25, t + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  o.connect(g).connect(bus); o.start(t); o.stop(t + 0.06);
}

/* Appelée par le programmateur pour CHAQUE pas (abs = position absolue, t = heure, len = durée d'un pas) */
function recSchedule(abs, t, len) {
  if (rec.state !== 'idle') {
    if (abs < 0) { if (abs % 4 === 0) clickAt(t, abs === -rec.countSteps); return; }
    if (abs < rec.steps) return;                                        // pendant la prise : on n'entend pas l'ancienne mélodie
    if (rec.endTime === null) { rec.endTime = t; takeProvisional(); }   // le 1er pas après la prise : on prépare déjà la lecture
  }
  if (take && $('recWith').checked && !(window.J22TakeMuted && window.J22TakeMuted())) {
    const skip = $('rollWith').checked ? (n => song.tracks.map((_,i)=>i).slice(1).some(ti => { const sg = segFor(ti, abs); return !!sg && !song.tracks[ti].mute && sg.p.notes.length > 0 && takeNoteIsDup(patKeys(sg.p), sg.p, n, abs - sg.off); })) : null;      // pas de doublon avec le Piano Roll
    melodyVoices.push(...scheduleTakeAtStep(engine, take, ((abs % take.steps) + take.steps) % take.steps, t, len, skip));
  }
}
/* Appelée à chaque tour du programmateur : la prise se termine quand l'horloge audio atteint sa fin */
function recTick(now) { if (rec.state !== 'idle' && rec.endTime !== null && now >= rec.endTime) recFinish(true); }

function takeProvisional() {                                            // prise "du moment" (notes déjà terminées + notes encore tenues)
  const raw = rec.raw.slice();
  rec.open.forEach(o => raw.push({ start: o.start, end: rec.steps, preset: o.preset, octave: o.octave, idx: o.idx }));
  const notes = quantizeNotes(raw, rec.steps, rec.quantize);
  if (notes.length) { take = makeTake(notes, rec.bars, getBpm()); drawTake(); uiRec(); }
}
function recFinish(commit) {
  if (rec.state === 'idle') return;
  const p = absNow(), endPos = Math.min(p === null ? rec.steps : p, rec.steps);
  rec.open.forEach(o => rec.raw.push({ start: o.start, end: Math.max(endPos, o.start), preset: o.preset, octave: o.octave, idx: o.idx }));
  const notes = quantizeNotes(rec.raw, rec.steps, rec.quantize);
  if (commit && notes.length) take = makeTake(notes, rec.bars, getBpm());
  rec.state = 'idle'; rec.open.clear(); rec.raw = []; rec.endTime = null;
  drawTake(); uiRec();
}
function killMelody() {
  if (!engine) { melodyVoices.length = 0; return; }
  melodyVoices.slice().forEach(v => engine.killVoice(v));
  melodyVoices.length = 0;
}

function startRecording() {
  initAudio();
  if (rec.state !== 'idle') return;
  stop();                                                              // repart de zéro (arrête le beat s'il tournait)
  rec.bars = Number($('recBars').value) || 2; rec.steps = rec.bars * 16;
  rec.quantize = $('recQuant').checked; rec.countSteps = $('recCount').checked ? 16 : 0;
  rec.raw = []; rec.open.clear(); rec.endTime = null; rec.state = 'armed';
  uiRec();
  start(-rec.countSteps);
}
function deleteTake() { recFinish(false); killMelody(); take = null; drawTake(); uiRec(); }

/* Données prêtes pour l'export WAV (étape 5) : tout ce qu'il faut pour rejouer le morceau hors-ligne */
function exportData() {
  return { bpm: getBpm(), stepLen: 60 / getBpm() / 4, pattern: song.tracks[0].mute ? names.map(() => Array(STEPS).fill(false)) : activePat(0).grid.map(r => r.slice()), take: take && !(window.J22TakeMuted && window.J22TakeMuted()) ? JSON.parse(JSON.stringify(take)) : null,
    rolls: song.tracks.map((_,i)=>i).slice(1).map(ti => { const p = activePat(ti); return { version: 1, trackKey:song.tracks[ti].key, bars: p.bars, steps: p.steps, bpm: null, notes: JSON.parse(JSON.stringify(p.notes)) }; }).filter((r, i) => r.notes.length && !song.tracks[i + 1].mute),
    trackKeys:song.tracks.map(t=>t.key), settings: currentSettings(), song: playMode === 'song' ? songExportData() : null, audio: audioExportData() };
}

/* ---------- affichage ---------- */
function drawTake() {
  const lane = $('recLane'), head = $('recHead');
  [...lane.querySelectorAll('.rec-note')].forEach(n => n.remove());
  const steps = take ? take.steps : rec.steps;
  lane.style.setProperty('--beats', steps / 4); lane.style.setProperty('--bars', steps / 16);
  if (!take) return;
  const midis = take.notes.map(n => (n.octave + 1) * 12 + n.idx), lo = Math.min(...midis), hi = Math.max(...midis);
  const rowH = Math.min(12, 80 / (hi - lo + 1));
  take.notes.forEach((n, i) => {
    const top = 8 + (hi - midis[i]) * rowH;
    const parts = [[n.start, Math.min(n.dur, take.steps - n.start)]];
    if (n.start + n.dur > take.steps) parts.push([0, n.start + n.dur - take.steps]);        // note qui traverse la fin de la boucle
    parts.forEach(([s, d]) => {
      const el = document.createElement('div'); el.className = 'rec-note';
      el.style.left = (s / take.steps * 100) + '%'; el.style.width = Math.max(0.6, d / take.steps * 100) + '%'; el.style.top = top + 'px';
      lane.insertBefore(el, head);
    });
  });
}
function moveHead(abs) {
  const head = $('recHead');
  let pos = null;
  if (rec.state !== 'idle') { if (abs >= 0 && abs < rec.steps) pos = abs / rec.steps; }
  else if (take) pos = (((abs % take.steps) + take.steps) % take.steps) / take.steps;
  head.style.display = pos === null ? 'none' : 'block'; if (pos !== null) head.style.left = (pos * 100) + '%';
}
function uiRec() {
  const armed = rec.state !== 'idle';
  $('recRec').classList.toggle('on', armed); $('recRec').setAttribute('aria-pressed', String(armed));
  $('recDel').disabled = !take && !armed;
  ['recBars', 'recCount', 'recQuant'].forEach(id => { $(id).disabled = armed; });
  if (!armed && !(state === 'playing' && take)) $('recHead').style.display = 'none';
  uiRecStatus(true);
  uiExp();                                  // l'export suit la prise (durée, case mélodie)
}
let lastRecText = '';
function uiRecStatus(force) {
  let txt;
  if (rec.state !== 'idle' && audio && stepLog.length) {
    const a = absNow();
    if (a === null || a < 0) txt = 'Compte à rebours… ' + Math.max(1, Math.ceil(-(a === null ? rec.countSteps : a) / 4));
    else txt = 'Enregistrement… mesure ' + Math.min(rec.bars, Math.floor(a / 16) + 1) + ' sur ' + rec.bars;
  } else if (rec.state !== 'idle') txt = 'Prépare-toi…';
  else if (take) txt = 'Prise : ' + take.notes.length + ' note' + (take.notes.length > 1 ? 's' : '') + ' · ' + take.bars + ' mesure' + (take.bars > 1 ? 's' : '') + '. REC pour en refaire une, ou Supprimer.';
  else txt = 'Prêt. Appuie sur REC, puis joue sur le synthé.';
  if (force || txt !== lastRecText) { $('recStatus').textContent = txt; lastRecText = txt; window.Jack22Feedback?.publish('notes', txt); }
}

$('recRec').onclick = startRecording;
$('recStop').onclick = stop;                                            // stop() termine la prise en cours
$('recPlay').onclick = () => { stop(); start(0); };                     // lecture depuis le début : beat + mélodie
$('recDel').onclick = deleteTake;
drawTake(); uiRec();

