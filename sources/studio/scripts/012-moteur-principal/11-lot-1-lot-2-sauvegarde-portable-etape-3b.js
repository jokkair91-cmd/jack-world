/* =====================================================================
   LOT 1 + LOT 2 — SAUVEGARDE PORTABLE (étape 3B ; format 2 : voix et paroles) : un fichier ZIP « sans compression », versionné
   JACK22-projet-AAAAMMJJ-HHMM.jack22.zip  =  manifest.json  +  audio/01-nom.wav, audio/02-nom.mp3 …  (octets d'origine)
   - manifest.json : { format: 'jack22-project', formatVersion: 1, project: { bpm, song, take, fx, studio, audio } } : les mêmes blocs que la sauvegarde locale.
   - Règle d'évolution : une formatVersion plus récente que celle du studio est refusée avec un message ; des champs inconnus sont ignorés.
   - Importer : TOUT est vérifié AVANT de toucher au projet ouvert (structure ZIP, noms, tailles, CRC-32, projet, SHA-256 et décodage de chaque fichier audio, limites).
     Un seul défaut = refus complet. Après validation et confirmation, l'application est protégée de bout en bout : à la moindre erreur le projet précédent est remis.
   - La sauvegarde locale (Sauvegarder / Charger, IndexedDB) n'est jamais modifiée par l'import.
   ===================================================================== */
/* ---------- Garde-fou : travail non sauvegardé ----------
   Le studio compare l'état actuel du projet à l'état de la dernière sauvegarde (Sauvegarder) ou du dernier chargement (Charger). S'il diffère, fermer ou recharger l'onglet
   affiche la boîte d'Edge « quitter la page ? ». Aucune boîte de dialogue ajoutée ailleurs ; Play, Stop et les exports ne changent pas cet état. Un projet IMPORTÉ est « non sauvegardé » tant qu'on n'a pas cliqué Sauvegarder. */
ProjectPersistence.signature = () => JSON.stringify({ w: ProjectPersistence.wrapper(null), a: audioClips.map(c => [c.id, c.name, c.startBar, c.size, !!c.missing]), l: audioLevel, m: audioMute });
ProjectPersistence.markClean = () => { ProjectPersistence._clean = ProjectPersistence.signature(); };
ProjectPersistence.unprotected = () => audioClips.filter(c => !c.stored && !c.missing).length;                              // sons présents seulement en mémoire (pas dans le stockage audio du navigateur)
ProjectPersistence.isDirty = () => (ProjectPersistence._clean !== undefined && ProjectPersistence.signature() !== ProjectPersistence._clean) || ProjectPersistence.unprotected() > 0;
ProjectPersistence.refreshRamWarn = () => {                                                                                 // encart visible tant qu'après « Sauvegarder sans audio » des sons ne sont que dans la page
  const P = ProjectPersistence, n = P.unprotected(), e = $('ramWarn'); if (!e) return; if (n === 0) P._ramOnly = false;
  e.hidden = !(P._ramOnly && n > 0);
  if (!e.hidden) e.querySelector('span').textContent = n + ' fichier' + (n > 1 ? 's' : '') + ' audio ' + (n > 1 ? 'ne sont' : "n'est") + ' que dans la mémoire de cette page : ' + (n > 1 ? 'ils ne sont' : "il n'est") + ' PAS dans la sauvegarde locale. Clique « Exporter projet » pour les garder (ou Sauvegarder quand le stockage audio est disponible). Edge demandera confirmation avant de fermer la page.';
};
setInterval(ProjectPersistence.refreshRamWarn, 700);
(() => {
  const P = ProjectPersistence, save0 = P.save, commit0 = P.commit, applied0 = P.applyLoaded;
  P.save = function () { if (!persistBusy) P._sigAtSave = P.signature(); return save0.call(this); };                         // l'état saisi au clic : une modification faite pendant l'écriture reste « non sauvegardée »
  P.commit = function (w) { commit0.call(this, w); if (P._sigAtSave) P._clean = P._sigAtSave; };                              // « sauvegardé » seulement quand l'écriture du projet a réussi
  P.applyLoaded = function (c, r) { const out = applied0.call(this, c, r); P.markClean(); return out; };
})();
window.addEventListener('beforeunload', e => { try { if (ProjectPersistence.isDirty()) { e.preventDefault(); e.returnValue = ''; } } catch (x) {} });
window.addEventListener('load', () => ProjectPersistence.markClean());

const PROJECT_FORMAT = 'jack22-project', PROJECT_FORMAT_VERSION = 4, ZIP_MAX_ENTRIES = AUDIO_MAX_FILES + 1, MANIFEST_MAX = 5 * 1048576;
const ZIP_MAX_TOTAL = AUDIO_MAX_FILES * AUDIO_MAX_BYTES + MANIFEST_MAX + 1048576, ZIP_CHUNK = 4 * 1048576;
const CRC_TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); t[n] = c >>> 0; } return t; })();
const tick = () => new Promise(r => setTimeout(r, 0));                 // laisse respirer l'écran entre deux gros calculs
function portableFail(msg) { throw Object.assign(new Error(msg), { portable: true }); }
async function crcOfBlob(blob) {
  let c = 0xFFFFFFFF;
  for (let o = 0; o < blob.size; o += ZIP_CHUNK) { const b = new Uint8Array(await blob.slice(o, o + ZIP_CHUNK).arrayBuffer()); for (let i = 0; i < b.length; i++) c = CRC_TABLE[(c ^ b[i]) & 255] ^ (c >>> 8); await tick(); }
  return (c ^ 0xFFFFFFFF) >>> 0;
}
const Zip = {
  async build(entries, progress) {                                     // [{name, blob}] -> Blob ; méthode « store »
    const enc = new TextEncoder(), parts = [], cd = [], d0 = new Date(), time = (d0.getHours() << 11) | (d0.getMinutes() << 5) | (d0.getSeconds() >> 1), date = ((d0.getFullYear() - 1980) << 9) | ((d0.getMonth() + 1) << 5) | d0.getDate();
    let offset = 0;
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i], nameB = enc.encode(e.name), crc = await crcOfBlob(e.blob), size = e.blob.size;
      const h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true); h.setUint16(10, time, true); h.setUint16(12, date, true);
      h.setUint32(14, crc, true); h.setUint32(18, size, true); h.setUint32(22, size, true); h.setUint16(26, nameB.length, true); h.setUint16(28, 0, true);
      parts.push(h.buffer, nameB, e.blob); cd.push({ nameB, crc, size, offset }); offset += 30 + nameB.length + size;
      if (progress) progress(i + 1, entries.length);
      await tick();
    }
    let cdSize = 0;
    for (const c of cd) {
      const d = new DataView(new ArrayBuffer(46));
      d.setUint32(0, 0x02014b50, true); d.setUint16(4, 20, true); d.setUint16(6, 20, true); d.setUint16(8, 0x0800, true); d.setUint16(10, 0, true); d.setUint16(12, time, true); d.setUint16(14, date, true);
      d.setUint32(16, c.crc, true); d.setUint32(20, c.size, true); d.setUint32(24, c.size, true); d.setUint16(28, c.nameB.length, true);
      d.setUint16(30, 0, true); d.setUint16(32, 0, true); d.setUint16(34, 0, true); d.setUint16(36, 0, true); d.setUint32(38, 0, true); d.setUint32(42, c.offset, true);
      parts.push(d.buffer, c.nameB); cdSize += 46 + c.nameB.length;
    }
    const eo = new DataView(new ArrayBuffer(22));
    eo.setUint32(0, 0x06054b50, true); eo.setUint16(4, 0, true); eo.setUint16(6, 0, true); eo.setUint16(8, cd.length, true); eo.setUint16(10, cd.length, true); eo.setUint32(12, cdSize, true); eo.setUint32(16, offset, true); eo.setUint16(20, 0, true);
    parts.push(eo.buffer);
    return new Blob(parts, { type: 'application/zip' });
  },
  async read(file) {                                                   // vérifie toute la structure et les CRC ; renvoie [{name, size, crc, start}] ou lève une erreur claire
    const size = file.size;
    if (size < 22) portableFail('ce fichier est trop petit pour être un projet JACK22');
    if (size > ZIP_MAX_TOTAL) portableFail('ce fichier est trop gros pour être un projet JACK22 (' + (size / 1048576).toFixed(0) + ' Mo)');
    const tail = new DataView(await file.slice(Math.max(0, size - 65557), size).arrayBuffer());
    let p = -1; for (let i = tail.byteLength - 22; i >= 0; i--) if (tail.getUint32(i, true) === 0x06054b50) { p = i; break; }
    if (p < 0) portableFail("ce fichier n'est pas une archive ZIP complète : ce n'est pas un projet JACK22 (ou il est tronqué)");
    const n = tail.getUint16(p + 10, true), cdSize = tail.getUint32(p + 12, true), cdOff = tail.getUint32(p + 16, true), cLen = tail.getUint16(p + 20, true);
    if (n === 0xFFFF || cdSize === 0xFFFFFFFF || cdOff === 0xFFFFFFFF) portableFail('format ZIP64 non pris en charge');
    if (p + 22 + cLen !== tail.byteLength) portableFail("l'archive contient des données en trop à la fin");
    if (n < 1 || n > ZIP_MAX_ENTRIES) portableFail("le nombre de fichiers dans l'archive est incorrect");
    if (cdOff + cdSize !== size - tail.byteLength + p) portableFail("l'index de l'archive est incohérent");
    const cd = new DataView(await file.slice(cdOff, cdOff + cdSize).arrayBuffer()), dec = new TextDecoder('utf-8', { fatal: true });
    const entries = [], names = new Set(); let q = 0, total = 0;
    for (let i = 0; i < n; i++) {
      if (q + 46 > cd.byteLength || cd.getUint32(q, true) !== 0x02014b50) portableFail("l'index de l'archive est abîmé");
      const flags = cd.getUint16(q + 8, true), method = cd.getUint16(q + 10, true), crc = cd.getUint32(q + 16, true), cs = cd.getUint32(q + 20, true), us = cd.getUint32(q + 24, true);
      const nl = cd.getUint16(q + 28, true), el = cd.getUint16(q + 30, true), cl = cd.getUint16(q + 32, true), off = cd.getUint32(q + 42, true);
      if (q + 46 + nl + el + cl > cd.byteLength) portableFail("l'index de l'archive est abîmé");
      let name; try { name = dec.decode(new Uint8Array(cd.buffer, q + 46, nl)); } catch (e) { portableFail("un nom de fichier de l'archive est illisible"); }
      q += 46 + nl + el + cl;
      if (flags & 1) portableFail('archive chiffrée : non prise en charge');
      if (method !== 0) portableFail("archive compressée : non prise en charge (un projet JACK22 est stocké sans compression)");
      if (cs !== us) portableFail('tailles incohérentes dans l\'archive');
      if (name !== 'manifest.json' && !/^audio\/[A-Za-z0-9._-]{1,90}$/.test(name)) portableFail(/\.\.|[\\/:]/.test(name.replace(/^audio\//, '')) || name.startsWith('/') ? 'nom de fichier dangereux dans l\'archive : « ' + name.slice(0, 40) + ' »' : 'fichier inattendu dans l\'archive : « ' + name.slice(0, 40) + ' »');
      if (names.has(name)) portableFail('fichier en double dans l\'archive : « ' + name + ' »'); names.add(name);
      if (name === 'manifest.json' ? us > MANIFEST_MAX : us > AUDIO_MAX_BYTES) portableFail('« ' + name + ' » dépasse la taille autorisée');
      total += us; if (total > ZIP_MAX_TOTAL) portableFail("l'archive dépasse la taille autorisée");
      if (off + 30 > cdOff) portableFail("l'index de l'archive est incohérent");
      const lh = new DataView(await file.slice(off, off + 30).arrayBuffer());
      if (lh.getUint32(0, true) !== 0x04034b50) portableFail("un fichier de l'archive est abîmé (en-tête introuvable)");
      const lnl = lh.getUint16(26, true), lel = lh.getUint16(28, true), start = off + 30 + lnl + lel;
      if (start + us > cdOff) portableFail('un fichier de l\'archive dépasse la zone de données');
      let lname; try { lname = dec.decode(new Uint8Array(await file.slice(off + 30, off + 30 + lnl).arrayBuffer())); } catch (e) { lname = null; }
      if (lname !== name) portableFail("l'archive est incohérente (nom de fichier différent dans l'index)");
      entries.push({ name, size: us, crc, start, off });
    }
    if (q !== cd.byteLength) portableFail("l'index de l'archive contient des données en trop");
    const byOff = entries.slice().sort((a, b) => a.off - b.off);
    for (let i = 1; i < byOff.length; i++) if (byOff[i].off < byOff[i - 1].start + byOff[i - 1].size) portableFail("l'archive est incohérente (fichiers qui se chevauchent)");
    for (let i = 0; i < entries.length; i++) {                         // contrôle d'intégrité (CRC-32) de chaque fichier
      const e = entries[i]; setStatus("Importation : contrôle de l'archive (" + (i + 1) + ' / ' + entries.length + ')…');
      if (await crcOfBlob(file.slice(e.start, e.start + e.size)) !== e.crc) portableFail('le fichier « ' + e.name + ' » est altéré (contrôle CRC-32 échoué)');
    }
    return entries;
  }
};

const ProjectTransfer = {
  safeName(n) { return String(n).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60) || 'audio'; },
  fileName() { const d = new Date(), z = v => String(v).padStart(2, '0'); return 'JACK22-projet-' + d.getFullYear() + z(d.getMonth() + 1) + z(d.getDate()) + '-' + z(d.getHours()) + z(d.getMinutes()) + '.jack22.zip'; },
  async exportProject() {
    if (persistBusy) return;
    const T = ProjectTransfer, missing = audioClips.filter(c => c.missing);
    if (missing.length && !confirm('ATTENTION : l\'archive sera INCOMPLÈTE.\nCes fichiers audio sont manquants et ne seront PAS dans le fichier exporté :\n' + missing.map(c => '• « ' + c.name + ' »').join('\n') + '\n\nCes sons devront être réimportés. Exporter quand même ?')) { setStatus('Export annulé : aucun fichier créé.'); return; }
    persistBusy = true; setPersistBusy(true);
    try {
      setStatus('Export du projet : préparation…');
      const w = ProjectPersistence.wrapper(null), real = audioClips.filter(c => !c.missing && c.blob), lv = audioLevel, mu = audioMute;
      for (const c of real) if (!c.hash) c.hash = await sha256Hex(c.blob);
      const files = real.map((c, i) => ({ c, path: 'audio/' + String(i + 1).padStart(2, '0') + '-' + T.safeName(c.name) + '.' + c.type }));
      const au = { level: lv, mute: mu, clips: files.map(f => ({ clipId: f.c.id, fileId: f.c.fileId, name: f.c.name, type: f.c.type, size: f.c.size, hash: f.c.hash, duration: f.c.duration, startBar: f.c.startBar, file: f.path })) };
      const manifest = { format: PROJECT_FORMAT, formatVersion: PROJECT_FORMAT_VERSION, app: 'JACK22 STUDIO', createdAt: new Date().toISOString(), omitted: missing.map(c => ({ name: c.name, startBar: c.startBar })), project: { bpm: w.bpm, song: w.song, take: w.take, fx: w.fx, studio: w.studio, voice: w.voice, audio: au } };
      const entries = [{ name: 'manifest.json', blob: new Blob([JSON.stringify(manifest)], { type: 'application/json' }) }, ...files.map(f => ({ name: f.path, blob: f.c.blob }))];
      if (entries.length > ZIP_MAX_ENTRIES) throw new Error('le projet contient ' + (entries.length - 1) + ' fichiers audio, le maximum est ' + (ZIP_MAX_ENTRIES - 1) + ' : aucun fichier créé');
      const blob = await Zip.build(entries, (i, n) => setStatus('Export du projet : ' + i + ' / ' + n + ' fichiers…'));
      setStatus('Export du projet : relecture de l\'archive…');
      try { await Zip.read(blob); } catch (x) { throw new Error('l\'archive créée ne se relit pas (' + (x && x.message ? x.message : x) + ') : aucun fichier créé'); }
      const name = T.fileName(), url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
      setStatus('Projet exporté : ' + name + ' (' + (blob.size / 1048576).toFixed(1) + ' Mo)' + (missing.length ? ' — INCOMPLET : ' + missing.length + ' fichier' + (missing.length > 1 ? 's' : '') + ' audio manquant' + (missing.length > 1 ? 's' : '') : '') + '. Garde ce fichier en lieu sûr : il contient le morceau, les réglages et les fichiers audio.');
    } catch (e) { setStatus('Export impossible : ' + friendlyErr(e) + ' Rien n\'a été modifié.'); }
    finally { persistBusy = false; setPersistBusy(false); }
  },
  snapshot() {                                                         // photo du projet ouvert, pour tout remettre en cas de problème
    return { sg: parseSongSave(currentSongSave()), bpm: $('bpm').value, take, fx: parseFxSave(currentFxSave()), st: StudioSettings.parse(StudioSettings.capture()), clips: audioClips.slice(), level: audioLevel, mute: audioMute, nextId: audioNextId, voice: VoiceStore.capture() };
  },
  rollback(p) {                                                        // remet le projet d'avant ; renvoie la liste des étapes qui n'ont pas pu l'être
    const errs = [], run = (label, fn) => { try { fn(); } catch (e) { errs.push(label); } };
    run('audio', () => { audioKill(); audioClips.splice(0, audioClips.length, ...p.clips.map(c=>({...c,voice:c.voice?JSON.parse(JSON.stringify(c.voice)):null}))); audioLevel = p.level; audioMute = p.mute; audioNextId = p.nextId; syncAudioUi(); tlSelAudio = null; });
    run('morceau', () => { $('bpm').value = p.bpm; songApply(p.sg); });
    run('prise', () => { recFinish(false); killMelody(); take = p.take ? JSON.parse(JSON.stringify(p.take)) : null; drawTake(); uiRec(); });
    run('effets', () => { if (p.fx) applyFxSave(p.fx); });
    run('réglages', () => { if (p.st) StudioSettings.apply(p.st); });
    run('voix', () => { VoiceStore.setText(p.voice); });
    run('affichage', () => { tlBuild(); uiExp(); });
    return errs;
  },
  apply(d) {
    audioKill(); $('bpm').value = String(d.bpm);
    songApply(d.sg);
    audioClips.splice(0, audioClips.length, ...d.clips); audioLevel = d.au.level; audioMute = d.au.mute; syncAudioUi();
    audioNextId = Math.max(audioNextId, 1, ...audioClips.map(x => x.id + 1)); tlSelAudio = null; tlBuild();
    recFinish(false); killMelody(); take = d.take; drawTake(); uiRec();
    applyFxSave(d.fx); StudioSettings.apply(d.st);
    VoiceStore.applyImported(d.vo);
  },
  async importFile(file) {
    if (persistBusy) return;
    const T = ProjectTransfer; persistBusy = true; setPersistBusy(true);
    let prev = null, touched = false;
    try {
      if (state !== 'stopped') stop(); audioKill();
      prev = T.snapshot(); initAudio();
      setStatus('Importation : lecture du fichier…');
      const entries = await Zip.read(file), byName = new Map(entries.map(e => [e.name, e])), me = byName.get('manifest.json');
      if (!me) portableFail("manifest.json absent : ce n'est pas un projet JACK22");
      let mf; try { mf = JSON.parse(await file.slice(me.start, me.start + me.size).text()); } catch (e) { portableFail('manifest.json illisible'); }
      const isO = o => o && typeof o === 'object' && !Array.isArray(o);
      if (isO(mf) && mf.format === 'jack22-c1') mf = C1Compat.convert(mf);                        // archive du candidat C1 : convertie vers le format officiel
      if (!isO(mf) || mf.format !== PROJECT_FORMAT) portableFail("ce fichier n'est pas un projet JACK22");
      if (!Number.isInteger(mf.formatVersion) || mf.formatVersion < 1) portableFail('version du format invalide');
      if (mf.formatVersion > PROJECT_FORMAT_VERSION) portableFail('ce projet a été créé par une version plus récente de JACK22 STUDIO (format ' + mf.formatVersion + ') : mets le studio à jour pour l\'ouvrir');
      const pj = mf.project; if (!isO(pj)) portableFail('le contenu du projet est absent');
      const sg = parseSongSave(pj.song); if (!sg) portableFail('le morceau est invalide (patterns, notes ou timeline)');
      const bpm = Number(pj.bpm); if (typeof pj.bpm !== 'number' || !(bpm >= BPM_MIN && bpm <= BPM_MAX)) portableFail('le tempo est invalide');
      const au = ProjectPersistence.parseAudio(pj.audio, sg.bars || song.bars); if (!au) portableFail('la section audio est invalide');
      const st = StudioSettings.parse(pj.studio); if (!st) portableFail('les réglages du studio sont invalides ou absents');
      const vo = pj.voice === undefined ? null : VoiceStore.parse(pj.voice); if (pj.voice !== undefined && !vo) portableFail('les réglages des voix ou les paroles sont invalides');
      const tk = pj.take == null ? null : validateTake(pj.take); if (pj.take != null && !tk) portableFail('la prise de l\'enregistreur est invalide');
      const fx = pj.fx == null ? null : parseFxSave(pj.fx); if (!fx) portableFail('les effets sont invalides ou absents');
      const clips = [], used = new Set(); let total = 0;
      for (let i = 0; i < au.clips.length; i++) {
        const c = au.clips[i], path = pj.audio.clips[i] && pj.audio.clips[i].file, e = typeof path === 'string' ? byName.get(path) : null;
        if (!e || used.has(path)) portableFail('le fichier audio « ' + c.name + ' » est introuvable dans l\'archive');
        used.add(path);
        if (e.size !== c.size) portableFail('le fichier audio « ' + c.name + ' » n\'a pas la taille annoncée');
        setStatus('Importation : vérification des fichiers audio (' + (i + 1) + ' / ' + au.clips.length + ')…');
        const ab = await file.slice(e.start, e.start + e.size).arrayBuffer();
        if (await sha256Hex(ab) !== c.hash) portableFail('le fichier audio « ' + c.name + ' » est altéré (empreinte SHA-256 différente)');
        const blob = new Blob([ab], { type: c.type === 'mp3' ? 'audio/mpeg' : 'audio/wav' });
        let buf; try { buf = await timeoutP(audio.decodeAudioData(ab), AUDIO_DECODE_TIMEOUT, 'décodage trop long'); } catch (x) { portableFail('le fichier audio « ' + c.name + ' » est illisible'); }
        if (!(buf.duration > 0) || buf.duration > AUDIO_MAX_SECONDS) portableFail('le fichier audio « ' + c.name + ' » dépasse la durée autorisée');
        total += buf.duration; if (total > AUDIO_MAX_TOTAL) portableFail('le projet dépasse ' + (AUDIO_MAX_TOTAL / 60) + ' minutes d\'audio au total');
        clips.push({ id: c.clipId, name: c.name, duration: buf.duration, buffer: buf, startBar: c.startBar, peaks: audioPeaks(buf, 800), blob, type: c.type, size: c.size, fileId: newFileId(), hash: c.hash, stored: false, missing: false, why: null, voice: vo && vo.takes[c.fileId] ? { ...vo.takes[c.fileId] } : null });
        await tick();
      }
      if (entries.some(e => e.name !== 'manifest.json' && !used.has(e.name))) portableFail("l'archive contient un fichier audio que le projet ne référence pas");
      const nPat = sg.tracks.reduce((a, t) => a + t.pats.length, 0);
      if (!confirm('Ce projet va REMPLACER le projet ouvert.\nContenu : ' + nPat + ' pattern' + (nPat > 1 ? 's' : '') + ', ' + sg.arr.length + ' bloc' + (sg.arr.length > 1 ? 's' : '') + ' de timeline, ' + clips.length + ' fichier' + (clips.length > 1 ? 's' : '') + ' audio.\nContinuer ?')) { setStatus('Importation annulée : le projet ouvert n\'a pas été modifié.'); return; }
      touched = true; setStatus('Importation : application du projet…');
      try { T.apply({ sg, bpm, take: tk, fx, st, au, clips, vo }); }
      catch (e) {
        const bad = T.rollback(prev);                                   // la protection couvre toute l'importation : on remet le projet précédent
        setStatus('Importation échouée (' + (e && e.message ? e.message : e) + ') : ' + (bad.length ? 'le projet précédent n\'a pas pu être entièrement remis (' + bad.join(', ') + '). Utilise Charger pour retrouver ta dernière sauvegarde.' : 'le projet précédent a été remis tel quel.'));
        return;
      }
      setStatus('Projet importé : ' + nPat + ' pattern' + (nPat > 1 ? 's' : '') + ', ' + clips.length + ' fichier' + (clips.length > 1 ? 's' : '') + ' audio, mixeur et réglages. Il n\'est pas encore dans la sauvegarde de ce navigateur : clique Sauvegarder pour le garder.' + (mf.c1source ? ' Archive C1 convertie : exporte-la de nouveau pour obtenir un fichier au format officiel.' : ''));
    } catch (e) {
      if (touched && prev) { const bad = T.rollback(prev); setStatus('Importation échouée : ' + (e && e.message ? e.message : e) + ' — ' + (bad.length ? 'le projet précédent n\'a pas pu être entièrement remis (' + bad.join(', ') + '). Utilise Charger.' : 'le projet précédent a été remis tel quel.')); }
      else { const m = e && e.portable ? e.message : friendlyErr(e); setStatus('Importation refusée : ' + m + (m.endsWith('.') ? '' : '.') + ' Le projet ouvert n\'a pas été modifié.'); }
    } finally { persistBusy = false; setPersistBusy(false); }
  }
};
$('projExport').onclick = () => ProjectTransfer.exportProject();
$('projImport').onclick = () => { initAudio(); $('projFile').click(); };
$('projFile').onchange = async () => { const f = $('projFile').files[0]; $('projFile').value = ''; if (f) await ProjectTransfer.importFile(f); };

function loadLegacy() {
  let raw;
  try { raw = localStorage.getItem(SAVE_KEY); }
  catch (e) { setStatus('Chargement impossible (stockage du navigateur bloqué)'); return; }
  if (raw === null) { setStatus('Aucune sauvegarde trouvée'); return; }
  const saved = parseSave(raw);
  if (!saved) { setStatus('Sauvegarde invalide : rythme inchangé'); return; }
  saved.pattern.forEach((row, i) => row.forEach((v, j) => pattern[i][j] = v));
  $('bpm').value = saved.bpm;
  render();
  if (saved.take) { recFinish(false); killMelody(); take = saved.take; drawTake(); uiRec(); }   // la prise sauvegardée remplace la prise actuelle
  if (saved.fx) applyFxSave(saved.fx);                                 // le BPM est déjà remis : le delay retrouve son temps. Une ancienne sauvegarde (sans effets) laisse les effets comme ils sont.
  if (saved.roll) rollApply(saved.roll);                               // le Piano Roll sauvegardé remplace l'actuel (Annuler le rend)
  const parts = ['Rythme']; if (saved.take) parts.push('prise'); if (saved.roll && saved.roll.notes.length) parts.push('Piano Roll'); if (saved.fx) parts.push('effets');
  setStatus((parts.length === 1 ? 'Rythme chargé' : parts.slice(0, -1).join(', ') + ' et ' + parts[parts.length - 1] + ' chargés')
    + (saved.hasTake && !saved.take ? ' (prise ignorée : données invalides)' : '') + (saved.hasFx && !saved.fx ? ' (effets ignorés : données invalides)' : '') + (saved.hasRoll && !saved.roll ? ' (Piano Roll ignoré : données invalides)' : '') + OLD_SAVE_NOTE);
}

$('load').onclick = () => ProjectPersistence.load();

$('clear').onclick = () => {
  pattern.forEach(row => row.fill(false));
  render();
  setStatus('Rythme effacé');
};

