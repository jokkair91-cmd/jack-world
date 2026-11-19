/* =====================================================================
   MISSION 10 — ÉTAPE 1 : IMPORT AUDIO (WAV / MP3)
   - Les fichiers importés vivent dans audioClips (hors song.arrangement) : ils ne touchent ni aux patterns ni à la sauvegarde.
   - Chaque fichier démarre au PAS de sa mesure de départ (même horloge que la batterie, la basse et la mélodie) ; il passe par le bus de lecture,
     donc par les effets et le volume master, et Pause / Stop le coupent comme le reste.
   - L'audio garde sa vitesse : il n'est pas étiré quand le BPM change (sa longueur en mesures change).
   - Pas encore : sauvegarde des fichiers, export WAV, découpage, enregistrement du micro.
   ===================================================================== */
const AUDIO_MAX_IMPORTS = 24, AUDIO_MAX_FILES = AUDIO_MAX_IMPORTS + 3, AUDIO_MAX_BYTES = 50 * 1024 * 1024, AUDIO_MAX_SECONDS = 600, AUDIO_MAX_TOTAL = 900;   // 10 min par fichier, 15 min en tout (les fichiers sont gardés décodés en mémoire)
const audioClips = [], audioPlaying = [];
const audioImportCount = () => audioClips.filter(c => !c.voice).length;                    // les prises voix ont leurs 3 emplacements : seuls les imports comptent ici
const clipGainV = c => c && c.voice ? (c.voice.mute ? 0 : volumeToGain(c.voice.level)) : 1;   // volume et Mute individuels d'une prise voix
let tlSelAudio = null, audioNextId = 1, audioLevel = 80, audioMute = false, persistBusy = false, pendingAttach = null;
const audioMsg = t => { $('audioMsg').textContent = t; window.Jack22Feedback?.publish('audio', t); };
const stepSec = () => 60 / getBpm() / 4;
const clipStartStep = c => window.JACK22_AUDIO_EDIT?window.JACK22_AUDIO_EDIT.startStep(c):c.startBar*16;
const clipBars = c => (window.l3Duration ? window.l3Duration(c) : c.duration) / (stepSec() * 16);                 // longueur du fichier en mesures, au tempo actuel
const audioEndStep = () => audioClips.filter(c => c.buffer).reduce((m, c) => Math.max(m, Math.ceil(clipStartStep(c) + (window.l3Duration ? window.l3Duration(c) : c.duration) / stepSec())), 0);
const audioGain = c => (audioMute || (c && window.J22LaneMuted && window.J22LaneMuted(c))) ? 0 : volumeToGain(audioLevel);
function audioPeaks(buf, n) {
  const out = new Float32Array(n), chs = []; for (let c = 0; c < buf.numberOfChannels; c++) chs.push(buf.getChannelData(c));
  const seg = Math.max(1, Math.floor(buf.length / n)), stride = Math.max(1, Math.floor(seg / 64));
  for (let i = 0; i < n; i++) { let m = 0; for (let k = i * seg; k < Math.min(buf.length, (i + 1) * seg); k += stride) for (const d of chs) { const v = Math.abs(d[k]); if (v > m) m = v; } out[i] = m; }
  return out;
}
let audioImportChain = Promise.resolve();
function audioImportFile(file, attachId) {                  // les importations passent l'une après l'autre : jamais plus de 4 clips, jamais deux fois le même identifiant
  const p = audioImportChain.then(() => audioImportOne(file, attachId));
  audioImportChain = p.catch(() => {});
  return p;
}
const newFileId = () => String((window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12)).replace(/[^A-Za-z0-9_-]/g, '');
async function audioImportOne(file, attachId) {
  const nm = file.name || 'audio', target = attachId != null ? audioClips.find(c => c.id === attachId && c.missing) : null;
  if (!/\.(wav|mp3)$/i.test(nm) && !/^audio\/(wav|x-wav|wave|mpeg|mp3)$/i.test(file.type || '')) { audioMsg('Format non pris en charge : choisis un fichier WAV ou MP3.'); return; }
  if (!target && audioImportCount() >= AUDIO_MAX_IMPORTS) { audioMsg('Maximum ' + AUDIO_MAX_IMPORTS + ' fichiers audio importés (les 3 prises voix ont leurs emplacements) : supprime-en un d\'abord (sélectionne-le sur la ligne AUDIO puis « Supprimer le bloc »).'); return; }
  if (!file.size) { audioMsg('Fichier vide : « ' + nm + ' » ne contient rien.'); return; }
  if (file.size > AUDIO_MAX_BYTES) { audioMsg('Fichier trop gros (' + (file.size / 1048576).toFixed(1) + ' Mo) : maximum ' + (AUDIO_MAX_BYTES / 1048576) + ' Mo.'); return; }
  audioMsg('Lecture de « ' + nm + ' »…');
  const kind = (/\.mp3$/i.test(nm) || /^audio\/(mpeg|mp3)$/i.test(file.type || '')) ? 'mp3' : 'wav';
  let buf, blob;
  try { initAudio(); const ab = await file.arrayBuffer(); blob = new Blob([ab], { type: kind === 'mp3' ? 'audio/mpeg' : 'audio/wav' }); buf = await audio.decodeAudioData(ab); }   // le Blob garde les octets d'origine (pour la sauvegarde) ; le décodage ne sert qu'à jouer
  catch (e) { audioMsg('Impossible de lire « ' + nm + ' » : fichier abîmé ou format non pris en charge. Rien n\'a été ajouté.'); return; }
  if (!(buf.duration > 0)) { audioMsg('« ' + nm + ' » est vide. Rien n\'a été ajouté.'); return; }
  if (buf.duration > AUDIO_MAX_SECONDS) { audioMsg('Fichier trop long (' + fmtDur(buf.duration) + ') : maximum ' + (AUDIO_MAX_SECONDS / 60) + ' minutes. Rien n\'a été ajouté.'); return; }
  if (!target && audioImportCount() >= AUDIO_MAX_IMPORTS) { audioMsg('Maximum ' + AUDIO_MAX_IMPORTS + ' fichiers audio importés (les 3 prises voix ont leurs emplacements) : supprime-en un d\'abord. Rien n\'a été ajouté.'); return; }   // 2e contrôle, après le décodage
  if (audioClips.reduce((m, c) => m + (c === target ? 0 : c.duration), 0) + buf.duration > AUDIO_MAX_TOTAL) { audioMsg('Trop d\'audio en mémoire : ' + (AUDIO_MAX_TOTAL / 60) + ' minutes au total au maximum. Supprime un fichier d\'abord. Rien n\'a été ajouté.'); return; }
  const fields = { name: nm.replace(/\.(wav|mp3)$/i, ''), duration: buf.duration, buffer: buf, peaks: audioPeaks(buf, 800), blob, type: kind, size: blob.size, fileId: newFileId(), hash: null, stored: false, missing: false, why: null };
  if (target) {                                              // relier un fichier à un clip « manquant » : même identifiant, même mesure
    Object.assign(target, fields); tlSelAudio = target.id; tlSel = null; tlBuild();
    audioMsg('« ' + target.name + ' » relié au clip manquant (mesure ' + (target.startBar + 1) + '). Sauvegarder l\'enregistre avec le projet.'); return;
  }
  const start = audioClips.length ? Math.min(song.bars - 1, Math.ceil(Math.max(...audioClips.map(c => c.startBar + clipBars(c))))) : 0;   // à la suite des autres fichiers
  const c = Object.assign({ id: audioNextId++, startBar: start }, fields);
  audioClips.push(c); tlSelAudio = c.id; tlSel = null; tlBuild();
  audioMsg('« ' + c.name + ' » importé (' + fmtDur(c.duration) + ') : mesure ' + (start + 1) + ' de la ligne AUDIO. Play le joue avec le projet ; ◀ Mesure et Mesure ▶ le déplacent. Sauvegarder l\'enregistre avec le projet.');
}
function audioStartClip(c, when, offset) {
  if (!audio || !bus || !c.buffer || offset >= (window.l3Duration ? window.l3Duration(c) : c.duration)) return;
  const src = audio.createBufferSource(), g = audio.createGain(), r = { src, g, c };
  src.buffer = window.l3ReadBuffer ? window.l3ReadBuffer(c) : c.buffer; g.gain.value = audioGain(c) * clipGainV(c); const ed = window.J22ClipEdit ? window.J22ClipEdit(c) : null, env = audio.createGain(); src.connect(env); env.connect(g); r.env = env; if(c.voice){r.meter=audio.createAnalyser();r.meter.fftSize=1024;g.connect(r.meter);r.meter.connect(window.J97AudioNode?window.J97AudioNode(audio,c,bus):bus);}else g.connect(window.J97AudioNode?window.J97AudioNode(audio,c,bus):bus);
  audioPlaying.push(r);
  src.onended = () => { const i = audioPlaying.indexOf(r); if (i >= 0) audioPlaying.splice(i, 1); try { g.disconnect(); if(r.meter)r.meter.disconnect(); } catch (e) {} };
  if (ed) { window.J22Env(env.gain, when, offset, ed); src.start(when, ed.trimIn + Math.max(0, offset), Math.max(0.001, ed.len - Math.max(0, offset))); } else src.start(when, Math.max(0, offset));const boundary=window.J98Capture?.boundary(when);if(boundary!==null&&boundary!==undefined)src.stop(boundary);
}
function audioSchedule(abs, t) { if (abs >= 0) audioClips.forEach(c => { const st=clipStartStep(c);if(Math.floor(st)===abs)audioStartClip(c,t+(st-abs)*stepSec(),0); }); }
function audioResume(fromAbs, t) {                                    // départ ou reprise au milieu d'un fichier
  if (fromAbs <= 0) return; const sl = stepSec();
  audioClips.forEach(c => { const off = (fromAbs - clipStartStep(c)) * sl; if (off > 0 && off < (window.l3Duration ? window.l3Duration(c) : c.duration)) audioStartClip(c, t, off); });
}
function audioKill(only) {
  const list = only ? audioPlaying.filter(a => a.c === only) : audioPlaying.slice(), now = audio ? audio.currentTime : 0;
  list.forEach(a => {
    const i = audioPlaying.indexOf(a); if (i >= 0) audioPlaying.splice(i, 1); a.src.onended = null;
    try { a.g.gain.cancelScheduledValues(now); a.g.gain.setValueAtTime(a.g.gain.value, now); a.g.gain.linearRampToValueAtTime(0, now + 0.015); a.src.stop(now + 0.03); } catch (e) {}
    setTimeout(() => { try { a.g.disconnect(); if(a.meter)a.meter.disconnect(); } catch (e) {} }, 100);
  });
}
function audioApplyGain() { if (audio) audioPlaying.forEach(a => a.g.gain.setTargetAtTime(audioGain(a.c) * clipGainV(a.c), audio.currentTime, 0.015)); }
function audioSelUi() {                                               // renvoie true si un fichier audio est sélectionné (la barre de la timeline s'adapte)
  const c = tlSelAudio !== null ? audioClips.find(x => x.id === tlSelAudio) : null;
  if (!c) { tlSelAudio = null; return false; }
  ['tlLeft', 'tlRight', 'tlDel'].forEach(id => { $(id).disabled = false; }); ['tlShort', 'tlLong', 'tlDup'].forEach(id => { $(id).disabled = true; });
  $('tlSelInfo').textContent = c.missing ? 'Audio : ' + c.name + ' · FICHIER MANQUANT (' + (c.why || 'introuvable') + ') · « Importer audio » pour le relier, ou Supprimer le bloc'
    : 'Audio : ' + c.name + ' · mesure ' + (c.startBar + 1) + ' · ' + fmtDur(c.duration);
  return true;
}
function audioEdit(ds, dl) {
  const c = audioClips.find(x => x.id === tlSelAudio); if (!c || dl) return;
  const s2 = c.startBar + ds;
  if (s2 < 0 || s2 > song.bars - 1) { audioMsg('Limite atteinte : le fichier démarre entre la mesure 1 et la mesure ' + song.bars + '.'); return; }
  c.startBar = s2; tlBuild(); audioMsg('« ' + c.name + ' » démarre à la mesure ' + (s2 + 1) + '.');
}
function audioDel() {
  const c = audioClips.find(x => x.id === tlSelAudio); if (!c) return;
  audioKill(c); audioClips.splice(audioClips.indexOf(c), 1); tlSelAudio = null; tlBuild(); audioMsg('« ' + c.name + ' » retiré de la timeline (le fichier sur ton ordinateur n\'est pas touché).');
}
function tlAudioRow(rows, W) {                      // ligne AUDIO (imports) + une ligne VOIX par prise enregistrée
  const lanes = [{ label: 'AUDIO', clips: audioClips.filter(c => !c.voice), always: true }];
  for (let k = 1; k <= 3; k++) lanes.push({ label: 'VOIX ' + k, clips: audioClips.filter(c => c.voice && c.voice.slot === k), always: false, voice: true });
  lanes.forEach(L => {
    if (!L.always && !L.clips.length) return;
    const row = mk('div', 'tl-row' + (audioMute || (L.voice && L.clips.every(c => c.voice.mute)) ? ' muted' : '')), lab = mk('div', 'tl-label'), lane = mk('div', 'tl-lane tl-audio');
    lab.append(mk('b', '', L.label), mk('small', '', L.voice ? (L.clips[0].voice.mute ? 'Mute' : 'prise') : (L.clips.length ? L.clips.length + ' fichier' + (L.clips.length > 1 ? 's' : '') : 'Importer audio')));
    lane.style.width = W + 'px';
    L.clips.forEach(c => {
      const el = mk('div', 'tl-block tl-aud' + (L.voice ? ' tl-voice' : '') + (c.missing ? ' orph' : '') + (c.id === tlSelAudio ? ' sel' : ''));
      if (c.missing) el.append(mk('span', '', '\u26a0 ' + c.name + ' \u2014 fichier manquant'));
      else {
        const cv = document.createElement('canvas'), x = cv.getContext('2d');
        cv.width = 800; cv.height = 40; x.fillStyle = L.voice ? '#e89fa9' : '#9fb4e8'; for (let i = 0; i < 800; i++) { const h = Math.max(1, c.peaks[i] * 36); x.fillRect(i, 20 - h / 2, 1, h); }
        el.append(cv, mk('span', '', c.name + ' \u00b7 ' + fmtDur(c.duration)));
      }
      el.dataset.audio = c.id; el.style.left = (c.startBar * TL_BAR_W) + 'px'; el.style.width = Math.max(24, clipBars(c) * TL_BAR_W - 2) + 'px';
      el.title = c.missing ? c.name + ' : fichier manquant (' + (c.why || 'introuvable') + ')' : c.name + ' \u00b7 mesure ' + (c.startBar + 1) + ' \u00b7 ' + fmtDur(c.duration) + (L.voice ? '' : ' (non \u00e9tir\u00e9 si le tempo change)');
      el.onclick = e => e.stopPropagation();
      el.onpointerdown = e => { e.stopPropagation(); tlSelAudio = c.id; tlSel = null; tlBuild(); $('tlWrap').focus({ preventScroll: true }); };
      lane.append(el);
    });
    row.append(lab, lane); rows.append(row);
  });
}
$('audioImport').onclick = () => { initAudio(); const sel = audioClips.find(c => c.id === tlSelAudio); pendingAttach = sel && sel.missing ? sel.id : null; $('audioFile').click(); };     // initAudio dans le geste de l'utilisateur ; un clip manquant sélectionné sera « relié »
$('audioFile').onchange = async () => { const f = $('audioFile').files[0], at = pendingAttach; pendingAttach = null; $('audioFile').value = ''; if (f) { try { await audioImportFile(f, at); } catch (e) { audioMsg('Importation impossible : ' + (e && e.message ? e.message : e)); } } };
$('audioLevel').addEventListener('input', () => { audioLevel = Number($('audioLevel').value); $('audioLevelVal').textContent = audioLevel + '%'; audioApplyGain(); });
$('audioMute').onclick = () => { audioMute = !audioMute; $('audioMute').setAttribute('aria-pressed', String(audioMute)); $('audioMute').setAttribute('aria-label', (audioMute ? 'Réactiver' : 'Couper') + ' la piste AUDIO'); audioApplyGain(); tlBuild(); };
$('bpm').addEventListener('input', () => { if (audioClips.length) tlBuild(); }); $('bpm').addEventListener('change', () => { if (audioClips.length) tlBuild(); });   // la longueur (en mesures) suit le tempo
const songExpText = (plan, mo) => 'WAV 16 bits · stéréo · 44,1 kHz · SONG : ' + plan.bars + ' mesure' + (plan.bars > 1 ? 's' : '') + ' (de la mesure 1 à la fin du dernier bloc audible ou du dernier fichier audio)' + (plan.withAudio ? ' + audio importé' : '') + (plan.withMel ? ' + prise enregistrée' : '') + ' + fin de ' + plan.tail.toFixed(1).replace('.', ',') + ' s · durée ≈ ' + fmtDur(plan.seconds) + ' · ≈ ' + mo + ' Mo';

