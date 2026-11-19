/* =====================================================================
   MISSION 11 — SAUVEGARDE COMPLÈTE DES RÉGLAGES (format du projet 1.7 : bloc « studio » AJOUTÉ)
   Contenu : mixeur (volume master, volume du synthé, harmoniques 808, 4 curseurs de batterie, 4 Mute de batterie, Mute du synthé) ;
   options de lecture (« Jouer avec le beat » du Piano Roll, « Mélodie avec le beat ») ; réglages de travail (son et octave du JX-22, piste du Piano Roll,
   son retenu pour chaque piste, longueur des nouvelles notes, options d'enregistrement, longueur des nouveaux blocs) ; options de l'export WAV ; mode PATTERN / SONG.
   - Validation « tout ou rien » : un seul champ hors limites et la sauvegarde entière est refusée (rien n'est modifié).
   - Ancienne sauvegarde (sans ce bloc) : les réglages ACTUELS sont conservés tels quels et le studio le dit.
   - À la restauration, rien ne démarre : ni la lecture, ni l'enregistrement.
   - Les réglages sont remis par les gestionnaires habituels des commandes (le moteur suit) ; en cas d'erreur, les valeurs précédentes sont remises.
   ===================================================================== */
const OLD_SAVE_NOTE = ' — Ancienne sauvegarde : certains réglages ne sont pas inclus et ont été conservés tels quels.';
const StudioSettings = {
  RANGE_IDS: { master: 'master', synth: 'synthVol', harm: 'harmAmt', kick: 'mixKick', snare: 'mixSnare', hat: 'mixHat', clap: 'mixClap' },
  MUTE_IDS: { muteKick: 'muteKick', muteSnare: 'muteSnare', muteHat: 'muteHat', muteClap: 'muteClap', muteSynth: 'muteSynth' },
  opts(id) { return [...$(id).options].map(o => o.value); },
  capture() {
    const R = StudioSettings, mixer = {};
    Object.entries(R.RANGE_IDS).forEach(([k, id]) => { mixer[k] = Number($(id).value); });
    Object.entries(R.MUTE_IDS).forEach(([k, id]) => { mixer[k] = $(id).getAttribute('aria-pressed') === 'true'; });
    return { version: 1, mixer, play: { rollWith: $('rollWith').checked, recWith: $('recWith').checked },
      work: { preset: $('preset').value, octave, rollTrack, trackSound: { 1: trackSound[1], 2: trackSound[2] }, rollLen: $('rollLen').value, recBars: $('recBars').value, recCount: $('recCount').checked, recQuant: $('recQuant').checked, tlLen: $('tlLen').value },
      export: { loops: $('expLoops').value, mel: $('expMel').checked, roll: $('expRoll').checked }, mode: playMode };
  },
  parse(b) {                                                  // null = ancienne sauvegarde (bloc absent) ; false = invalide ; sinon réglages propres
    if (b === undefined || b === null) return null;
    try {
      const R = StudioSettings, isO = o => o && typeof o === 'object' && !Array.isArray(o);
      if (!isO(b) || b.version !== 1 || !isO(b.mixer) || !isO(b.play) || !isO(b.work) || !isO(b.export)) return false;
      const out = { version: 1, mixer: {}, play: {}, work: {}, export: {} };
      for (const [k, id] of Object.entries(R.RANGE_IDS)) { const v = b.mixer[k]; if (typeof v !== 'number' || !Number.isInteger(v) || v < Number($(id).min) || v > Number($(id).max)) return false; out.mixer[k] = v; }
      for (const k of Object.keys(R.MUTE_IDS)) { if (typeof b.mixer[k] !== 'boolean') return false; out.mixer[k] = b.mixer[k]; }
      for (const k of ['rollWith', 'recWith']) { if (typeof b.play[k] !== 'boolean') return false; out.play[k] = b.play[k]; }
      const w = b.work, presets = R.opts('preset');
      if (!presets.includes(w.preset) || !Number.isInteger(w.octave) || w.octave < 1 || w.octave > 7 || !(Number.isInteger(w.rollTrack)&&w.rollTrack>=1&&w.rollTrack<32) || !isO(w.trackSound) || !presets.includes(w.trackSound[1]) || !presets.includes(w.trackSound[2])) return false;
      for (const k of ['rollLen', 'recBars', 'tlLen']) { if (typeof w[k] !== 'string' || !R.opts(k).includes(w[k])) return false; }
      if (typeof w.recCount !== 'boolean' || typeof w.recQuant !== 'boolean') return false;
      out.work = { preset: w.preset, octave: w.octave, rollTrack: w.rollTrack, trackSound: { 1: w.trackSound[1], 2: w.trackSound[2] }, rollLen: w.rollLen, recBars: w.recBars, recCount: w.recCount, recQuant: w.recQuant, tlLen: w.tlLen };
      const e = b.export;
      if (typeof e.loops !== 'string' || !R.opts('expLoops').includes(e.loops) || typeof e.mel !== 'boolean' || typeof e.roll !== 'boolean') return false;
      out.export = { loops: e.loops, mel: e.mel, roll: e.roll };
      if (b.mode !== 'pattern' && b.mode !== 'song') return false;
      out.mode = b.mode;
      return out;
    } catch (e) { return false; }
  },
  apply(st) {                                                 // ne démarre ni la lecture ni l'enregistrement
    const R = StudioSettings, w = st.work;
    const fire = (id, v, ev) => { const e = $(id); e.value = String(v); e.dispatchEvent(new Event(ev, { bubbles: true })); };
    const chk = (id, v) => { const e = $(id); if (e.checked !== v) { e.checked = v; e.dispatchEvent(new Event('change', { bubbles: true })); } };
    const press = (id, on) => { if (($(id).getAttribute('aria-pressed') === 'true') !== on) $(id).click(); };
    fire('preset', w.preset, 'change'); setOctave(w.octave);                     // le son d'abord (il remet l'octave naturelle), puis l'octave sauvegardée
    ['master', 'synth', 'harm', 'kick', 'snare', 'hat', 'clap'].forEach(k => fire(R.RANGE_IDS[k], st.mixer[k], 'input'));   // master et synthé : leurs copies du mixeur suivent
    Object.entries(R.MUTE_IDS).forEach(([k, id]) => press(id, st.mixer[k]));
    chk('rollWith', st.play.rollWith); chk('recWith', st.play.recWith);
    trackSound[1] = w.trackSound[1]; trackSound[2] = w.trackSound[2];
    fire('rollTrack',Math.min(w.rollTrack,song.tracks.length-1), 'change');                                     // affiche le pattern de cette piste dans le Piano Roll, avec son son retenu
    fire('rollLen', w.rollLen, 'change'); fire('recBars', w.recBars, 'change'); chk('recCount', w.recCount); chk('recQuant', w.recQuant); fire('tlLen', w.tlLen, 'change');
    fire('expLoops', st.export.loops, 'change'); chk('expMel', st.export.mel); chk('expRoll', st.export.roll);
    setMode(st.mode); uiExp();
  }
};

const ProjectPersistence = {
  commit(wrapper) { localStorage.setItem(SONG_KEY, JSON.stringify(wrapper)); },        // LE point de validation : tant que cette ligne n'a pas réussi, la sauvegarde précédente reste en place
  wrapper(au) { return { version: '1.7', bpm: getBpm(), song: currentSongSave(), take: take || null, fx: currentFxSave(), audio: au, studio: StudioSettings.capture() }; },
  summary(nAudio) {
    const n = song.tracks.reduce((a, t) => a + t.patterns.length, 0);
    return 'Projet sauvegardé : ' + n + ' pattern' + (n > 1 ? 's' : '') + (song.arrangement.length ? ', ' + song.arrangement.length + ' bloc' + (song.arrangement.length > 1 ? 's' : '') + ' de timeline' : '') + (nAudio ? ', ' + nAudio + ' fichier' + (nAudio > 1 ? 's' : '') + ' audio' : '') + ', effets, mixeur, réglages' + (take ? ' et prise' : '') + STORE_NOTE;
  },
  parseAudio(a, bars) {                                       // null = ancien projet (pas d'audio) ; false = invalide ; sinon { level, mute, clips }
    if (a === undefined || a === null) return null;
    try {
      if (typeof a !== 'object' || Array.isArray(a) || !Array.isArray(a.clips) || a.clips.length > AUDIO_MAX_FILES) return false;
      if (typeof a.level !== 'number' || !isFinite(a.level) || a.level < 0 || a.level > 100 || typeof a.mute !== 'boolean') return false;
      const ids = new Set(), fids = new Set(), clips = []; let total = 0;
      for (const c of a.clips) {
        if (!c || typeof c !== 'object') return false;
        if (!Number.isInteger(c.clipId) || c.clipId < 1 || ids.has(c.clipId)) return false; ids.add(c.clipId);
        if (typeof c.fileId !== 'string' || !/^[A-Za-z0-9_-]{8,64}$/.test(c.fileId) || fids.has(c.fileId)) return false; fids.add(c.fileId);
        if (typeof c.name !== 'string' || !c.name.trim() || c.name.length > 120) return false;
        if (c.type !== 'wav' && c.type !== 'mp3') return false;
        if (!Number.isInteger(c.size) || c.size < 1 || c.size > AUDIO_MAX_BYTES) return false;
        if (typeof c.hash !== 'string' || !/^[0-9a-f]{64}$/.test(c.hash)) return false;
        if (typeof c.duration !== 'number' || !(c.duration > 0) || c.duration > AUDIO_MAX_SECONDS) return false;
        if (!Number.isInteger(c.startBar) || c.startBar < 0 || c.startBar > bars - 1) return false;
        total += c.duration; clips.push({ clipId: c.clipId, fileId: c.fileId, name: c.name, type: c.type, size: c.size, hash: c.hash, duration: c.duration, startBar: c.startBar });
      }
      if (total > AUDIO_MAX_TOTAL + 1) return false;
      return { level: Math.round(a.level), mute: a.mute, clips };
    } catch (e) { return false; }
  },
  async gc(ids) {                                              // nettoyage prudent, sans bloquer ni signaler d'erreur
    try {
      if (localStorage.getItem(AUDIO_USED_FLAG) !== '1') return;
      const live = new Set();                                   // fichiers référencés par la sauvegarde réellement en place (relue, pas supposée)
      try { const j = JSON.parse(localStorage.getItem(SONG_KEY)); ((j && j.audio && j.audio.clips) || []).forEach(c => { if (c && typeof c.fileId === 'string') live.add(c.fileId); }); } catch (e) { return; }
      if (ids.some(id => !live.has(id))) return;                // la sauvegarde en place n'est pas celle qu'on vient d'écrire (autre fenêtre, autre copie du studio) : on ne supprime rien
      const meta = await AudioStorage.getMeta(), keep = new Set([...ids, ...live, ...(meta.current || [])]);
      const del = (await AudioStorage.keys()).filter(k => !keep.has(k));
      await AudioStorage.setMeta({ current: ids.slice() });
      if (del.length) await AudioStorage.deleteMany(del);
    } catch (e) {}
  },
  save() {
    if (persistBusy) return;
    const P = ProjectPersistence, w = P.wrapper(null), lv = audioLevel, mu = audioMute;
    const snap = audioClips.map(c => ({ c, clipId: c.id, fileId: c.fileId, name: c.name, type: c.type, size: c.size, hash: c.hash, duration: c.duration, startBar: c.startBar }));
    if (!snap.length) {                                         // sans audio : écriture immédiate, comme avant
      try { w.audio = { level: lv, mute: mu, clips: [] }; P.commit(w); setStatus(P.summary(0)); P.gc([]); }
      catch (e) { setStatus('Sauvegarde impossible : ' + friendlyErr(e) + ' La dernière sauvegarde valide est conservée.'); }
      return;
    }
    persistBusy = true; setPersistBusy(true); setStatus('Sauvegarde en cours…');
    P.saveWithAudio(w, snap, lv, mu)
      .catch(e => setStatus('Sauvegarde impossible : ' + friendlyErr(e) + ' La dernière sauvegarde valide est conservée.'))
      .finally(() => { persistBusy = false; setPersistBusy(false); });
  },
  async saveWithAudio(w, snap, lv, mu) {
    const P = ProjectPersistence, real = snap.filter(x => !x.c.missing);       // les clips « manquants » gardent leur référence telle quelle
    if (real.length && !(await AudioStorage.available())) {
      if (!confirm('Le stockage audio du navigateur est indisponible (navigation privée ou réglage du PC). Sauvegarder le morceau SANS les fichiers audio ? Les références audio de la sauvegarde précédente seraient perdues.\nOK = sauvegarder sans audio · Annuler = ne rien changer.')) { setStatus('Sauvegarde annulée : rien n\'a été modifié.'); return; }
      w.audio = { level: lv, mute: mu, clips: [] }; P._ramOnly = true; P.commit(w); setStatus('Projet sauvegardé SANS les fichiers audio (stockage indisponible) : les sons ne sont PAS protégés, ils restent seulement dans cette page. Clique « Exporter projet » pour les garder ; Edge demandera confirmation avant de fermer la page.'); P.refreshRamWarn && P.refreshRamWarn(); return;
    }
    for (const x of real) if (!x.hash) { x.hash = x.c.hash = await sha256Hex(x.c.blob); }
    const toWrite = [];
    for (const x of real) if (!x.c.stored || !(await AudioStorage.has(x.fileId))) toWrite.push({ fileId: x.fileId, name: x.name, type: x.type, size: x.size, hash: x.hash, blob: x.c.blob, savedAt: Date.now() });
    if (toWrite.length) {
      const need = toWrite.reduce((a, r) => a + r.size, 0), est = await AudioStorage.estimate();
      if (est && est.free < need * 1.1 + 5 * 1048576) throw Object.assign(new Error('espace de stockage insuffisant'), { name: 'QuotaExceededError', need, free: est.free });
      await AudioStorage.putMany(toWrite);                                      // 1) les fichiers, confirmés (transaction terminée)
      try { localStorage.setItem(AUDIO_USED_FLAG, '1'); } catch (e) {}
    }
    w.audio = { level: lv, mute: mu, clips: snap.map(x => ({ clipId: x.clipId, fileId: x.fileId, name: x.name, type: x.type, size: x.size, hash: x.hash, duration: x.duration, startBar: x.startBar })) };
    P.commit(w);                                                                // 2) seulement ensuite : le projet
    real.forEach(x => { x.c.stored = true; });
    setStatus(P.summary(snap.length) + (snap.some(x => x.c.missing) ? ' (un clip audio manquant est gardé comme référence)' : ''));
    try { if (toWrite.length && navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
    let pers = null; try { if (navigator.storage && navigator.storage.persisted) pers = await navigator.storage.persisted(); } catch (e) {}
    audioMsg('Audio sauvegardé dans le stockage du navigateur. Attention : ce stockage peut être effacé par toi (effacement des données de navigation), par le navigateur ou en navigation privée' + (pers === false ? ' ; le navigateur n\'en garantit pas la conservation' : '') + '. Garde tes fichiers audio d\'origine.');
    P.gc(snap.map(x => x.fileId));                                              // 3) nettoyage prudent (non bloquant)
  },
  load() {
    if (persistBusy) return;
    const P = ProjectPersistence;
    let raw; try { raw = localStorage.getItem(SONG_KEY); } catch (e) { setStatus('Chargement impossible (stockage du navigateur bloqué)'); return; }
    if (raw === null) { loadLegacy(); return; }                                  // pas de sauvegarde récente : on lit l'ancienne sauvegarde V1.3
    let s, sg = null, au = null, st = null;                                      // validation COMPLÈTE avant toute modification
    try { s = JSON.parse(raw); sg = parseSongSave(s && s.song); au = sg ? P.parseAudio(s.audio, sg.bars || song.bars) : null; st = sg ? StudioSettings.parse(s.studio) : null; } catch (e) { sg = null; }
    if (!sg || au === false || st === false) { setStatus('Sauvegarde invalide : morceau inchangé'); return; }
    const hasTake = s.take !== undefined && s.take !== null, tk = hasTake ? validateTake(s.take) : null;
    const hasFx = s.fx !== undefined && s.fx !== null, fx = hasFx ? parseFxSave(s.fx) : null;
    const dropTl = song.arrangement.length > 0 && !sg.arr.length, dropAu = audioClips.length > 0 && !(au && au.clips.length);
    if (dropTl || dropAu) {
      const msg = dropTl && dropAu ? 'Cette sauvegarde ne contient ni timeline ni fichiers audio : la timeline et les fichiers audio actuels seront retirés. Continuer ?'
        : dropTl ? 'Cette sauvegarde ne contient pas de timeline : la timeline actuelle sera vidée. Continuer ?'
        : 'Cette sauvegarde ne contient pas de fichiers audio : les fichiers audio actuels seront retirés. Continuer ?';
      if (!confirm(msg)) return;
    }
    if (state !== 'stopped') stop(); audioKill();                                // jamais d'ancien clip qui continue de jouer
    const ctxo = { s, sg, au, tk, fx, hasTake, hasFx, st };
    if (au && au.clips.length) {
      persistBusy = true; setPersistBusy(true); setStatus('Chargement des fichiers audio…');
      AudioRestore.restore(au.clips).then(r => P.applyLoaded(ctxo, r))
        .catch(e => setStatus('Chargement impossible : ' + friendlyErr(e) + ' Rien n\'a été modifié.'))
        .finally(() => { persistBusy = false; setPersistBusy(false); });          // Play n'est réactivé qu'ici, quand tout est prêt
    } else { try { P.applyLoaded(ctxo, null); } catch (e) { setStatus('Sauvegarde invalide : morceau inchangé'); } }
  },
  applyLoaded(c, restored) {
    const n = Number(c.s.bpm);
    $('bpm').value = (isFinite(n) && n > 0) ? Math.max(BPM_MIN, Math.min(BPM_MAX, n)) : BPM_DEFAULT;
    if (state !== 'stopped') stop();
    songApply(c.sg);
    audioKill(); audioClips.splice(0, audioClips.length, ...(restored ? restored.clips : []));
    if (c.au) { audioLevel = c.au.level; audioMute = c.au.mute; syncAudioUi(); }
    audioNextId = Math.max(audioNextId, 1, ...audioClips.map(x => x.id + 1));
    tlSelAudio = null; tlBuild();
    if (c.tk) { recFinish(false); killMelody(); take = c.tk; drawTake(); uiRec(); }
    if (c.fx) applyFxSave(c.fx);
    let studioWarn = '';
    if (c.st) { const prevSt = StudioSettings.capture(); try { StudioSettings.apply(c.st); } catch (e) { try { StudioSettings.apply(prevSt); } catch (x) {} studioWarn = ' (réglages du mixeur et de travail non appliqués : valeurs précédentes conservées)'; } }   // si une erreur survient : on remet les valeurs d'avant
    const probs = restored ? restored.problems : [], parts = [];
    if (c.sg.arr.length) parts.push('timeline : ' + c.sg.arr.length + ' bloc' + (c.sg.arr.length > 1 ? 's' : ''));
    if (audioClips.length) parts.push(audioClips.length + ' fichier' + (audioClips.length > 1 ? 's' : '') + ' audio');
    setStatus('Projet restauré' + (parts.length ? ' (' + parts.join(', ') + ')' : '') + (c.tk ? ', prise' : '') + (c.fx ? ' et effets' : '') + (c.hasTake && !c.tk ? ' (prise ignorée : données invalides)' : '') + (c.hasFx && !c.fx ? ' (effets ignorés : données invalides)' : '') + (probs.length ? ' — ATTENTION : ' + probs.length + ' fichier' + (probs.length > 1 ? 's' : '') + ' audio manquant' + (probs.length > 1 ? 's' : '') + ' (clips gris)' : ''));
    setStatus($('status').textContent + studioWarn + (c.st ? '' : OLD_SAVE_NOTE));
    if (probs.length) audioMsg('Fichier(s) audio non restauré(s) : ' + probs.map(p => '« ' + p.name + ' » (' + p.why + ')').join(', ') + '. Le reste du projet est intact. Sélectionne un clip gris puis « Importer audio » pour le relier à un fichier, ou supprime-le.');
  }
};
$('save').onclick = () => ProjectPersistence.save();

