/* =====================================================================
   MISSION 9b — TIMELINE et mode SONG
   - song.arrangement = blocs { id, trackKey, patternId, startBar, lengthBars } : ils RÉFÉRENCENT un pattern (id stable), ils ne le copient pas.
   - Un bloc répète son pattern sur toute sa longueur (en mode SONG, le pattern repart à zéro au début du bloc).
   - RÈGLE des notes qui dépassent la fin d'un bloc : elles sont relâchées à la frontière (le relâchement normal du son suit). Les percussions sont des sons courts : rien à couper.
   - Pas de chevauchement sur une piste ; un bloc reste sur sa piste. Modifier la timeline PENDANT la lecture est sûr : les blocs sont relus à chaque pas.
   - Fin du morceau : la lecture s'arrête 1,5 s après la fin du dernier bloc. Sauvegarde et export WAV de la timeline : Mission 9c.
   ===================================================================== */
let TL_BAR_W = 56; const TL_LABEL_W = 208, SONG_TAIL = 1.5;
song.bars = 64;
const mk = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; return e; };
const tlBlock = () => song.arrangement.find(b => b.id === tlSel) || null;
const songEndStep = () => Math.max(song.arrangement.reduce((m, b) => Math.max(m, (b.startBar + b.lengthBars) * 16), 0), audioEndStep());
const songEndNow = abs => !window.J98Capture?.looping() && playMode === 'song' && rec.state === 'idle' && (song.arrangement.length > 0 || audioClips.some(c => c.buffer)) && abs >= songEndStep();
const tlMsg = t => { $('tlStatus').textContent = t; window.Jack22Feedback?.publish('timeline', t); };
const lum = c => { const n = parseInt(c.slice(1), 16); return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255); };
function canPlace(key, start, len, ignoreId) {
  if (!Number.isInteger(start) || !Number.isInteger(len) || start < 0 || len < 1 || start + len > song.bars) return false;
  return !song.arrangement.some(b => b.trackKey === key && b.id !== ignoreId && start < b.startBar + b.lengthBars && b.startBar < start + len);
}
function freeAfter(key, start) {             // mesures libres à partir de start (jusqu'au bloc suivant ou la fin du morceau)
  let lim = song.bars; song.arrangement.forEach(b => { if (b.trackKey === key && b.startBar >= start && b.startBar < lim) lim = b.startBar; }); return lim - start;
}
function tlBad(id, msg) { tlMsg(msg); const el = document.querySelector('.tl-block[data-id="' + id + '"]'); if (el) { el.classList.add('bad'); setTimeout(() => el.classList.remove('bad'), 600); } }
function tlSelUi() {
  if (audioSelUi()) return;
  const b = tlBlock(), p = b ? patternById(trackIdx(b.trackKey), b.patternId) : null;
  ['tlLeft', 'tlRight', 'tlShort', 'tlLong', 'tlDup', 'tlDel'].forEach(id => { $(id).disabled = !b; });
  $('tlSelInfo').textContent = b ? 'Bloc : ' + (p ? p.name : '(supprimé)') + ' · ' + song.tracks[trackIdx(b.trackKey)].label + ' · mesures ' + (b.startBar + 1) + ' à ' + (b.startBar + b.lengthBars) : 'Aucun bloc sélectionné';
}
const trackIdx = key => song.tracks.findIndex(t => t.key === key);
function tlBuild() {
  const rows = $('tlRows'), inner = $('tlInner'), W = song.bars * TL_BAR_W; rows.innerHTML = '';
  inner.style.setProperty('--bw', TL_BAR_W + 'px'); inner.style.width = (TL_LABEL_W + W) + 'px';
  const ruler = mk('div', 'tl-ruler'); ruler.append(mk('div', 'tl-label'));
  for (let i = 0; i < song.bars; i++) { const n = mk('div', 'tl-num', String(i + 1)); n.style.width = TL_BAR_W + 'px'; ruler.append(n); }
  rows.append(ruler);
  song.tracks.forEach((tr, ti) => {
    const row = mk('div', 'tl-row' + (tr.mute ? ' muted' : '')), lab = mk('div', 'tl-label'), lane = mk('div', 'tl-lane');
    lab.append(mk('b', '', tr.label), mk('small', '', 'Actif : ' + activePat(ti).name));
    lane.style.width = W + 'px'; lane.dataset.ti = ti;
    lane.onclick = e => { if (e.target === lane) tlAdd(ti, Math.floor(e.offsetX / TL_BAR_W), lane); };
    song.arrangement.filter(x => x.trackKey === tr.key).forEach(x => {
      const p = patternById(ti, x.patternId), el = mk('div', 'tl-block' + (p ? '' : ' orph') + (x.id === tlSel ? ' sel' : ''), p ? p.name : '(supprimé)');
      el.dataset.id = x.id; el.style.left = (x.startBar * TL_BAR_W) + 'px'; el.style.width = (x.lengthBars * TL_BAR_W - 2) + 'px';
      if (p) { el.style.background = p.color; el.style.color = lum(p.color) > 140 ? '#101014' : '#f5f5f5'; }
      el.title = (p ? p.name : 'pattern supprimé') + ' · mesures ' + (x.startBar + 1) + ' à ' + (x.startBar + x.lengthBars);
      el.onclick = e => e.stopPropagation();
      el.onpointerdown = e => tlDown(e, x, el); el.onpointermove = tlMove; el.onpointerup = el.onpointercancel = tlUp;
      lane.append(el);
    });
    row.append(lab, lane); rows.append(row);
  });
  tlAudioRow(rows, W);
  tlSelUi(); uiExp();                                  // l'export (mode SONG) suit la timeline
}
function tlAdd(ti, bar, lane) {
  const tr = song.tracks[ti], p = activePat(ti), want = Number($('tlLen').value) || 4;
  if (bar < 0 || bar >= song.bars) return;
  if (blockAt(ti, bar)) { tlMsg('Mesure ' + (bar + 1) + ' déjà occupée : choisis une mesure vide.'); lane.classList.remove('tl-flash'); void lane.offsetWidth; lane.classList.add('tl-flash'); return; }
  const len = Math.min(want, freeAfter(tr.key, bar));
  const b = { id: song.nextId++, trackKey: tr.key, patternId: p.id, startBar: bar, lengthBars: len };
  song.arrangement.push(b); tlSel = b.id; tlSelAudio = null; tlBuild();
  tlMsg('« ' + p.name + ' » placé sur ' + tr.label + ' : mesure ' + (bar + 1) + (len < want ? ' (raccourci à ' + len + ' mesure' + (len > 1 ? 's' : '') + ' : place disponible)' : '') + '.');
}
function tlEdit(ds, dl) {
  if (tlSelAudio !== null) return audioEdit(ds, dl);
  const b = tlBlock(); if (!b) return; const s2 = b.startBar + ds, l2 = b.lengthBars + dl;
  if (l2 < 1 || s2 < 0 || s2 + l2 > song.bars) { tlBad(b.id, 'Limite atteinte : un bloc reste entre la mesure 1 et la mesure ' + song.bars + ', avec au moins 1 mesure.'); return; }
  if (!canPlace(b.trackKey, s2, l2, b.id)) { tlBad(b.id, 'Impossible : un autre bloc de cette piste occupe déjà cette place.'); return; }
  b.startBar = s2; b.lengthBars = l2; tlBuild(); tlMsg('Bloc : mesures ' + (s2 + 1) + ' à ' + (s2 + l2) + ' (' + l2 + ' mesure' + (l2 > 1 ? 's' : '') + ').');
}
function tlDup() {
  const b = tlBlock(); if (!b) return;
  for (let s2 = b.startBar + b.lengthBars; s2 + b.lengthBars <= song.bars; s2++) if (canPlace(b.trackKey, s2, b.lengthBars)) {
    const c = { id: song.nextId++, trackKey: b.trackKey, patternId: b.patternId, startBar: s2, lengthBars: b.lengthBars };
    song.arrangement.push(c); tlSel = c.id; tlBuild(); tlMsg('Bloc dupliqué : mesures ' + (s2 + 1) + ' à ' + (s2 + c.lengthBars) + '.'); return;
  }
  tlBad(b.id, 'Pas de place libre après ce bloc pour une copie.');
}
function tlDel() { if (tlSelAudio !== null) return audioDel(); const b = tlBlock(); if (!b) return; song.arrangement = song.arrangement.filter(x => x !== b); tlSel = null; tlBuild(); tlMsg('Bloc supprimé (le pattern est conservé).'); }
function tlDown(e, b, el) {
  e.stopPropagation(); tlSel = b.id; tlSelAudio = null;
  document.querySelectorAll('.tl-block.sel').forEach(q => q.classList.remove('sel')); el.classList.add('sel'); tlSelUi();
  $('tlWrap').focus({ preventScroll: true });
  if (e.pointerType !== 'mouse' || e.button !== 0) return;              // au doigt : les boutons (plus fiables)
  tlDrag = { b, el, x0: e.clientX, s0: b.startBar, s: b.startBar, ok: true };
  try { el.setPointerCapture(e.pointerId); } catch (x) {}
  e.preventDefault();
}
function tlMove(e) {
  const d = tlDrag; if (!d) return;
  d.s = Math.max(0, Math.min(song.bars - d.b.lengthBars, d.s0 + Math.round((e.clientX - d.x0) / TL_BAR_W)));
  d.ok = canPlace(d.b.trackKey, d.s, d.b.lengthBars, d.b.id); d.el.style.left = (d.s * TL_BAR_W) + 'px'; d.el.classList.toggle('bad', !d.ok);
}
function tlUp() {
  const d = tlDrag; if (!d) return; tlDrag = null;
  if (d.s !== d.s0) { if (d.ok) { d.b.startBar = d.s; tlMsg('Bloc déplacé : mesures ' + (d.s + 1) + ' à ' + (d.s + d.b.lengthBars) + '.'); } else tlMsg('Déplacement refusé : un autre bloc occupe cette place. Le bloc est revenu à sa place.'); }
  tlBuild();
}
function tlMoveHead(abs) {
  const h = $('tlHead');
  if (playMode !== 'song' || abs === null || abs < 0 || state !== 'playing') { h.style.display = 'none'; return; }
  const x = TL_LABEL_W + abs / 16 * TL_BAR_W, w = $('tlWrap'); h.style.display = 'block'; h.style.left = x + 'px';
  if (x < w.scrollLeft + TL_LABEL_W || x > w.scrollLeft + w.clientWidth - 40) w.scrollLeft = Math.max(0, x - TL_LABEL_W - 40);   // la lecture reste visible
}
function tlHideHead() { $('tlHead').style.display = 'none'; }
function setMode(m) {
  if (m === playMode) return;
  if (state !== 'stopped') stop();                                       // changer de mode arrête la lecture : jamais de note bloquée
  playMode = m;
  $('modePattern').setAttribute('aria-pressed', String(m === 'pattern')); $('modeSong').setAttribute('aria-pressed', String(m === 'song'));
  setStatus(m === 'song' ? 'Mode SONG : la lecture suit la timeline' : 'Mode PATTERN : lecture des patterns actifs'); uiExp();
}
$('modePattern').onclick = () => setMode('pattern'); $('modeSong').onclick = () => setMode('song');
$('tlLeft').onclick = () => tlEdit(-1, 0); $('tlRight').onclick = () => tlEdit(1, 0); $('tlShort').onclick = () => tlEdit(0, -1); $('tlLong').onclick = () => tlEdit(0, 1);
$('tlDup').onclick = tlDup; $('tlDel').onclick = tlDel;
$('tlBars').onchange = () => {
  const n = Number($('tlBars').value);
  if (song.arrangement.some(b => b.startBar + b.lengthBars > n)) { $('tlBars').value = String(song.bars); tlMsg('Impossible de raccourcir : des blocs dépassent la mesure ' + n + '.'); return; }
  song.bars = n; tlBuild(); tlMsg('Morceau : ' + n + ' mesures.');
};
$('tlWrap').addEventListener('keydown', e => {
  if (!tlBlock() && tlSelAudio === null) return;
  if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); tlDel(); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); tlEdit(-1, 0); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); tlEdit(1, 0); }
});
function rollKeySet(rl) { const k = new Set(); rl.notes.forEach(n => k.add(rollDupKey(n.start, rollMidi(n), n.preset))); return k; }
/* Une note de la prise enregistrée est un doublon si le Piano Roll joue, au même pas, la même hauteur avec le même son */
function takeNoteIsDup(keys, rl, n, abs) { return Number.isInteger(n.start) && keys.has(rollDupKey(((abs % rl.steps) + rl.steps) % rl.steps, rollMidi(n), n.preset)); }

let engine = null;                      // le moteur du jeu en direct (créé au premier son)

/* Réglages actuels de la page, au format attendu par createEngine
   (le futur export WAV s'en servira aussi : même mixeur en direct et à l'export) */
function currentSettings() {
  return {
    master: $('master').value, synthVol: $('synthVol').value, harm: $('harmAmt').value,
    tracks: ['mixKick', 'mixSnare', 'mixHat', 'mixClap'].map(id => $(id).value),
    muteTracks: ['muteKick', 'muteSnare', 'muteHat', 'muteClap'].map(id => $(id).getAttribute('aria-pressed') === 'true'),
    muteSynth: $('muteSynth').getAttribute('aria-pressed') === 'true',
    fx: currentFx()
  };
}
function initAudio() {
  if (!audio) {
    audio = new (window.AudioContext || window.webkitAudioContext)();
    engine = createEngine(audio,
      currentSettings(),
      {   // la page surligne / libère les touches quand le moteur coupe ou termine une voix
        heldLost: v => { held.delete(v.source); press(v.idx, -1); recNoteOff(v.source); },
        voiceEnded: v => {
          if (held.get(v.source) === v) { held.delete(v.source); press(v.idx, -1); }
          const i = melodyVoices.indexOf(v); if (i >= 0) melodyVoices.splice(i, 1);
        }
      },
      alive);
    // raccourcis gardés pour le reste de la page
    noiseBuffer = engine.noiseBuffer; masterGain = engine.masterGain;
    synthBus = engine.synthBus; harmBus = engine.harmBus; harmWave = engine.harmWave;
  }
  if (audio.state === 'suspended') audio.resume().catch(() => {});
}

$('master').addEventListener('input', () => {
  const v = Number($('master').value);
  $('masterVal').textContent = v + '%';
  $('mixMaster').value = v; $('mixMasterVal').textContent = v + '%';   // copie dans le mixeur
  if (engine) engine.setMaster(v);
});

/* ---------- Les sons : fabriqués par le moteur (identiques à la V1), branchés sur "bus" ---------- */
function hit(r, t) { engine.hit(r, t, bus); }

/* "bus de lecture" : tous les sons d'une lecture y passent.
   Pause/Stop le coupent d'un coup, y compris les sons déjà programmés. */
function killBus() {
  audioKill();                      // Mission 10 : les fichiers audio importés s'arrêtent avec le reste
  if (!bus) return;
  const old = bus; bus = null;
  const t = audio.currentTime;
  old.gain.cancelScheduledValues(t);
  old.gain.setValueAtTime(old.gain.value, t);
  old.gain.linearRampToValueAtTime(0, t + 0.015);   // fondu très court : pas de "clic"
  setTimeout(() => { try { old.disconnect(); } catch (e) {} if (engine) engine.disposeBus(old); }, 80);
}

/* ---------- Tempo ---------- */
function getBpm() {
  const n = Number($('bpm').value) || BPM_DEFAULT;
  return Math.max(BPM_MIN, Math.min(BPM_MAX, n));
}
$('bpm').addEventListener('change', () => { $('bpm').value = getBpm(); });

/* ---------- Lecture : programmation des sons ---------- */
function schedule() {
  if (state !== 'playing') return;
  const now = audio.currentTime;
  if (nextTime < now - 0.05) nextTime = now + 0.05;   // si la page a pris du retard, on recale (pas de rafale)
  const stepLength = 60 / getBpm() / 4;
  while (nextTime < now + LOOKAHEAD) {
    if (songEndNow(absStep)) { if (songStopAt === null) songStopAt = nextTime + SONG_TAIL; break; }   // fin du morceau : on ne programme plus rien
    const current = step, abs = absStep;
    const dp = song.tracks[0].mute ? null : patFor(0, abs);
    if (dp) names.forEach((_, r) => { if (dp.grid[r][current]) hit(r, nextTime + (window.L8Swing ? window.L8Swing(current, stepLength) : 0)); });
    stepLog.push({ abs, time: nextTime, len: stepLength });
    recSchedule(abs, nextTime, stepLength);             // enregistreur : compte à rebours + mélodie enregistrée
    rollSchedule(abs, nextTime, stepLength);            // Piano Roll : notes programmées
    audioSchedule(abs, nextTime);                        // Mission 10 : fichiers audio importés (démarrent au pas de leur mesure)
    queue.push({ step: current, abs, time: nextTime });
    nextTime += stepLength;
    step = (step + 1) % STEPS; absStep++;
  }
  if (songStopAt !== null && now >= songStopAt) { stop(); setStatus('Fin du morceau'); return; }   // les dernières notes ont fini de sonner
  while (queue.length && queue[0].time < now - 1) queue.shift();   // nettoyage
  if (stepLog.length > 600) stepLog.splice(0, stepLog.length - 600);
  recTick(now);                                         // enregistreur : fin de prise
}

/* Surlignage : suit l'horloge audio (pas de setTimeout qui traînent) */
function paintLoop() {
  if (state !== 'playing') { raf = null; return; }
  const now = audio.currentTime;
  let last = -1, lastAbs = null;
  while (queue.length && queue[0].time <= now) { const q = queue.shift(); last = q.step; lastAbs = q.abs; }
  if (last >= 0 && last !== shownStep) highlight(last);
  if (lastAbs !== null) moveHead(lastAbs);
  rollMoveHead(stepLog.length ? absAtLog(stepLog, now - latency()) : null); tlMoveHead(stepLog.length ? absAtLog(stepLog, now - latency()) : null);   // Piano Roll : curseur de lecture (suit l'horloge audio, donc le BPM)
  uiRecStatus();
  raf = requestAnimationFrame(paintLoop);
}

function stopTimers() {
  clearInterval(timer); timer = null;
  if (raf !== null) cancelAnimationFrame(raf);
  raf = null;
}

/* ---------- Play / Pause / Stop ---------- */
function start(fromAbs) {                  // fromAbs : position de départ en pas (0 = début ; négatif = compte à rebours)
  if (persistBusy) return;                  // pendant une sauvegarde / un chargement des fichiers audio : Play attend
  initAudio();
  stopTimers(); killBus();                  // sécurité : jamais deux lectures en même temps
  bus = engine.createBus();
  queue = []; stepLog = []; songStopAt = null;
  absStep = fromAbs || 0;
  step = ((absStep % STEPS) + STEPS) % STEPS;
  nextTime = audio.currentTime + 0.05; if(window.L8PrepareLive)window.L8PrepareLive(engine,nextTime,absStep); audioResume(absStep, nextTime);   // reprise au milieu d'un fichier audio (après Pause)
  state = 'playing';
  $('play').textContent = 'Ⅱ Pause';
  setStatus('Lecture');
  schedule();
  timer = setInterval(schedule, 25);        // la seule minuterie du programme
  raf = requestAnimationFrame(paintLoop);
}

function pause() {
  const now = audio.currentTime;
  const next = queue.find(q => q.time > now);        // premier pas pas encore joué
  resumeStep = next ? next.step : step;
  resumeAbs = next ? next.abs : absStep;
  recFinish(true); killMelody();            // la pause termine la prise en cours et coupe la mélodie
  state = 'paused';
  stopTimers(); killBus();
  queue = [];
  $('play').textContent = '▶ Play';
  setStatus('Pause');
}

function stop() {
  if (audio) { recFinish(true); killMelody(); stopTimers(); killBus(); }
  state = 'stopped';
  step = 0; resumeStep = 0; absStep = 0; resumeAbs = 0; queue = [];
  highlight(-1);
  rollHideHead(); tlHideHead(); songStopAt = null;
  $('play').textContent = '▶ Play';
  setStatus('Arrêté');
}

$('play').onclick = () => {
  if (state === 'playing') pause();
  else if (playMode === 'song' && !song.arrangement.length && !audioClips.some(c => c.buffer)) setStatus('Timeline vide : place un bloc, ou repasse en mode PATTERN');
  else start(state === 'paused' ? resumeAbs : 0);
};
$('stop').onclick = stop;

/* ---------- Sauvegarde / chargement (sécurisés) ---------- */
function parseSave(raw) {                    // renvoie {pattern, bpm} ou null si le contenu est invalide
  try {
    const s = JSON.parse(raw);
    if (!s || !Array.isArray(s.pattern) || s.pattern.length !== names.length) return null;
    if (!s.pattern.every(row => Array.isArray(row) && row.length === STEPS)) return null;
    const n = Number(s.bpm);
    const bpm = (isFinite(n) && n > 0) ? Math.max(BPM_MIN, Math.min(BPM_MAX, n)) : BPM_DEFAULT;
    const hasTake = s.take !== undefined && s.take !== null;
    const hasFx = s.fx !== undefined && s.fx !== null;
    return { pattern: s.pattern.map(row => row.map(v => v === true || v === 1)), bpm, hasTake, take: hasTake ? validateTake(s.take) : null, hasFx, fx: hasFx ? parseFxSave(s.fx) : null,
      hasRoll: s.roll !== undefined && s.roll !== null, roll: (s.roll !== undefined && s.roll !== null) ? parseRollSave(s.roll) : null };
  } catch (e) { return null; }
}

const SONG_KEY = 'jack22-vision8-project-v1';          // Mission 9a : nouvelle clé. La sauvegarde V1.3 (SAVE_KEY) reste intacte et se charge encore.
function currentSongSave() {
  return { version: 2, bars: song.bars,                       // 9c : longueur du morceau + arrangement + identifiants stables des patterns (champs ajoutés : les anciennes versions les ignorent)
    arrangement: song.arrangement.map(b => ({ id: b.id, trackKey: b.trackKey, patternId: b.patternId, startBar: b.startBar, lengthBars: b.lengthBars })),
    tracks: song.tracks.map(tr => ({ key: tr.key, label:tr.label, active: tr.active, mute: tr.mute,
      patterns: tr.patterns.map(p => tr.key === 'drums' ? { id: p.id, name: p.name, color: p.color, grid: p.grid.map(r => r.slice()) }
        : { id: p.id, name: p.name, color: p.color, bars: p.bars, notes: p.notes.map(n => ({ start: n.start, dur: n.dur, preset: n.preset, octave: n.octave, idx: n.idx, ...(n.velocity!==undefined?{velocity:n.velocity}:{}), ...(n.glide!==undefined?{glide:n.glide}:{}), ...(n.off?{off:n.off}:{}) })) }) })) };
}
const SONG_BARS = [64, 96, 128], TRACK_KEYS = ['drums', 'bass', 'melody'], ARR_MAX = 384;
function parseSongSave(sg) {                  // tout ou rien : renvoie { tracks, hasIds, bars, arr } ou null (rien n'est modifié tant que ce n'est pas validé en entier)
  try {
    if (!sg || sg.version !== 2 || !Array.isArray(sg.tracks) || (sg.tracks.length < 3 || sg.tracks.length > 32)) return null;
    const out = [], seen = new Set(); let withId = 0, total = 0;
    for (let ti = 0; ti < sg.tracks.length; ti++) {
      const t = sg.tracks[ti];
      if (!t || (ti<3?t.key!==TRACK_KEYS[ti]:!/^inst_[a-z0-9_]{1,40}$/.test(t.key)) || sg.tracks.slice(0,ti).some(x=>x.key===t.key) || !Array.isArray(t.patterns) || t.patterns.length < 1 || t.patterns.length > MAX_PATTERNS || !Number.isInteger(t.active) || t.active < 0 || t.active >= t.patterns.length) return null;
      const pats = [];
      for (const p of t.patterns) {
        if (!p || typeof p.name !== 'string' || !p.name.trim() || p.name.length > 24 || typeof p.color !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(p.color)) return null;
        let id = null; total++;
        if (p.id !== undefined) { if (!Number.isInteger(p.id) || p.id < 1 || seen.has(p.id)) return null; seen.add(p.id); id = p.id; withId++; }
        if (ti === 0) {
          if (!Array.isArray(p.grid) || p.grid.length !== names.length || !p.grid.every(r => Array.isArray(r) && r.length === STEPS)) return null;
          pats.push({ id, name: p.name, color: p.color, grid: p.grid.map(r => r.map(v => v === true || v === 1)) });
        } else { const r = parseRollSave({ bars: p.bars, notes: p.notes }); if (!r) return null; pats.push({ id, name: p.name, color: p.color, bars: r.bars, notes: r.notes }); }
      }
      if(t.label!==undefined&&(typeof t.label!=='string'||!t.label.trim()||t.label.length>40))return null;
      out.push({ key:t.key,label:t.label||(['BATTERIE','808 / BASS','MÉLODIE'][ti]||'Instrument'), mute: !!t.mute, active: t.active, pats });
    }
    if (withId !== 0 && withId !== total) return null;                              // identifiants : tous ou aucun
    const hasIds = withId > 0; let bars = null; const arr = [];
    if (sg.bars !== undefined) { if (!SONG_BARS.includes(sg.bars)) return null; bars = sg.bars; }
    if (sg.arrangement !== undefined) {
      if (!Array.isArray(sg.arrangement) || sg.arrangement.length > ARR_MAX) return null;
      if (sg.arrangement.length && (!hasIds || bars === null)) return null;         // un arrangement n'a de sens qu'avec les identifiants des patterns et la longueur du morceau
      const bid = new Set();
      for (const b of sg.arrangement) {
        if (!b || typeof b !== 'object' || !Number.isInteger(b.id) || b.id < 1 || bid.has(b.id)) return null; bid.add(b.id);
        if (!sg.tracks.some(t=>t.key===b.trackKey) || !Number.isInteger(b.patternId) || b.patternId < 1) return null;   // un pattern absent est permis : le bloc reste « supprimé » (gris), comme avant la sauvegarde
        if (!Number.isInteger(b.startBar) || !Number.isInteger(b.lengthBars) || b.startBar < 0 || b.lengthBars < 1 || b.startBar + b.lengthBars > bars) return null;
        arr.push({ id: b.id, trackKey: b.trackKey, patternId: b.patternId, startBar: b.startBar, lengthBars: b.lengthBars });
      }
      for (const a of arr) for (const c of arr) if (a !== c && a.trackKey === c.trackKey && a.startBar < c.startBar + c.lengthBars && c.startBar < a.startBar + a.lengthBars) return null;   // pas de chevauchement
    }
    return { tracks: out, hasIds, bars, arr };
  } catch (e) { return null; }
}
function songApply(parsed) {
  song.tracks=parsed.tracks.map((t,i)=>({key:t.key||TRACK_KEYS[i],label:t.label||["BATTERIE","808 / BASS","MÉLODIE"][i],mute:t.mute,active:t.active,patterns:[]}));
  if(rollTrack>=song.tracks.length)rollTrack=2;
  if(window.JACK22_PRODUCTION)window.JACK22_PRODUCTION.syncTrackOptions();
  parsed.tracks.forEach((t, ti) => {
    const tr = song.tracks[ti]; tr.mute = t.mute; tr.active = t.active;
    tr.patterns = t.pats.map(p => { const o = ti === 0 ? newDrumPat(p.name, p.color, p.grid) : newRollPat(p.name, p.color, p.bars, p.notes); if (p.id) o.id = p.id; return o; });
  });
  if (parsed.hasIds) { song.arrangement = parsed.arr; if (parsed.bars) song.bars = parsed.bars; } else song.arrangement = [];   // ancienne sauvegarde (sans identifiants) : pas de timeline à restaurer
  $('tlBars').value = String(song.bars);
  let mx = 0; song.tracks.forEach(t => t.patterns.forEach(p => { mx = Math.max(mx, p.id); })); song.arrangement.forEach(b => { mx = Math.max(mx, b.id); }); song.nextId = mx + 1;   // jamais de doublon d'identifiant
  tlSel = null;
  pattern = activePat(0).grid; render(); rollLoad(activePat(rollTrack)); buildPatternUI(); uiExp();
}
