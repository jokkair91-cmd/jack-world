/* =====================================================================
   MISSION 10 — ÉTAPE 3 : SAUVEGARDE ET RESTAURATION PERSISTANTES DE L'AUDIO
   Trois composants, séparés même dans un seul fichier :
   - AudioStorage       : IndexedDB (base « jack22-audio-v1 »). Fichiers audio D'ORIGINE (Blob), jamais décodés, jamais dans localStorage.
   - ProjectPersistence : sauvegarde / chargement du projet. Format 1.6 : champs AJOUTÉS (audio : volume, Mute, références des clips) ; les anciens projets se chargent comme avant.
   - AudioRestore       : relecture des fichiers, contrôle d'empreinte (SHA-256), décodage, reconstruction des clips.
   Sauvegarde cohérente : 1) les fichiers audio nouveaux sont écrits en UNE transaction IndexedDB et confirmés ; 2) SEULEMENT ENSUITE le JSON du projet est écrit (c'est le point de validation) ;
   « Projet sauvegardé » n'est affiché qu'après les deux. En cas d'échec, la sauvegarde précédente n'est pas touchée.
   Nettoyage prudent : un fichier n'est supprimé que s'il n'est plus utilisé ni par la sauvegarde en cours ni par la précédente (deux générations) ; jamais le fichier d'origine du PC.
   Un fichier introuvable ou altéré ne bloque rien : le clip reste, en gris « manquant », avec sa référence ; on peut le relier à un fichier (sélectionner le clip puis « Importer audio »).
   ===================================================================== */
const STORE_NOTE = ' — ⚠ sauvegarde dans le navigateur : perdue si tu effaces ses données';
const AUDIO_DB = 'jack22-vision8-audio-v1', AUDIO_IDB_TIMEOUT = 8000, AUDIO_DECODE_TIMEOUT = 60000, AUDIO_USED_FLAG = 'jack22-vision8-audio-used';
const TRACK_ALL = ['save', 'load', 'play', 'audioImport', 'expBtn', 'projExport', 'projImport'];
function timeoutP(promise, ms, msg) {
  let t; const to = new Promise((_, rej) => { t = setTimeout(() => rej(Object.assign(new Error(msg), { name: 'TimeoutError' })), ms); });
  return Promise.race([promise, to]).finally(() => clearTimeout(t));
}
function setPersistBusy(on) { TRACK_ALL.forEach(id => { $(id).disabled = on; }); if (!on) uiExp(); }
async function sha256Hex(data) {
  const ab = data instanceof ArrayBuffer ? data : await data.arrayBuffer();
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', ab))].map(x => x.toString(16).padStart(2, '0')).join('');
}
function friendlyErr(e) {
  const n = e && e.name, m = e && e.message ? e.message : String(e);
  if (n === 'QuotaExceededError') return 'espace de stockage insuffisant' + (e.need ? ' (il faut ' + (e.need / 1048576).toFixed(1) + ' Mo, il reste ' + Math.max(0, e.free / 1048576).toFixed(0) + ' Mo)' : '') + '.';
  if (n === 'NotSupportedError' || n === 'SecurityError' || n === 'InvalidStateError' || n === 'BlockedError' || n === 'TimeoutError') return 'stockage du navigateur indisponible ou bloqué (' + m + ').';
  return m + '.';
}
function syncAudioUi() {
  $('audioLevel').value = String(audioLevel); $('audioLevelVal').textContent = audioLevel + '%';
  $('audioMute').setAttribute('aria-pressed', String(audioMute)); $('audioMute').setAttribute('aria-label', (audioMute ? 'Réactiver' : 'Couper') + ' la piste AUDIO');
}

const AudioStorage = {
  _db: null,
  open() {
    if (AudioStorage._db) return Promise.resolve(AudioStorage._db);
    return timeoutP(new Promise((res, rej) => {
      if (!window.indexedDB) return rej(Object.assign(new Error('IndexedDB indisponible'), { name: 'NotSupportedError' }));
      let r; try { r = indexedDB.open(AUDIO_DB, 1); } catch (e) { return rej(e); }
      r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains('files')) d.createObjectStore('files', { keyPath: 'fileId' }); if (!d.objectStoreNames.contains('meta')) d.createObjectStore('meta'); };
      r.onsuccess = () => { const d = r.result; d.onversionchange = () => { d.close(); AudioStorage._db = null; }; d.onclose = () => { AudioStorage._db = null; }; AudioStorage._db = d; res(d); };
      r.onerror = () => rej(r.error || new Error('ouverture impossible'));
      r.onblocked = () => rej(Object.assign(new Error('base bloquée par une autre fenêtre du studio'), { name: 'BlockedError' }));
    }), AUDIO_IDB_TIMEOUT, 'le stockage ne répond pas');
  },
  async available() { try { await AudioStorage.open(); return true; } catch (e) { return false; } },
  async tx(mode, stores, fn) {
    const db = await AudioStorage.open();
    return new Promise((res, rej) => {
      let out; const t = db.transaction(stores, mode);
      t.oncomplete = () => res(out && typeof out === 'object' && 'readyState' in out ? out.result : out);
      t.onerror = () => rej(t.error); t.onabort = () => rej(t.error || new Error('écriture annulée'));
      try { out = fn(t); } catch (e) { try { t.abort(); } catch (x) {} rej(e); }
    });
  },
  async has(fileId) { return (await AudioStorage.tx('readonly', 'files', t => t.objectStore('files').getKey(fileId))) !== undefined; },
  get(fileId) { return AudioStorage.tx('readonly', 'files', t => t.objectStore('files').get(fileId)); },
  putMany(records) { return AudioStorage.tx('readwrite', 'files', t => { const st = t.objectStore('files'); records.forEach(r => st.put(r)); }); },   // une seule transaction : tout ou rien
  keys() { return AudioStorage.tx('readonly', 'files', t => t.objectStore('files').getAllKeys()); },
  deleteMany(ids) { return AudioStorage.tx('readwrite', 'files', t => { const st = t.objectStore('files'); ids.forEach(k => st.delete(k)); }); },
  async getMeta() { return (await AudioStorage.tx('readonly', 'meta', t => t.objectStore('meta').get('gc'))) || { current: [] }; },
  setMeta(m) { return AudioStorage.tx('readwrite', 'meta', t => t.objectStore('meta').put(m, 'gc')); },
  async estimate() { try { const e = await navigator.storage.estimate(); return { free: e.quota - e.usage, quota: e.quota, usage: e.usage }; } catch (x) { return null; } }
};

const AudioRestore = {
  async restore(entries) {                                   // renvoie { clips, problems } ; ne jette jamais pour un fichier seul : il devient un clip « manquant »
    initAudio();
    const clips = [], problems = [], idbOk = await AudioStorage.available();
    for (const e of entries) {
      const base = { id: e.clipId, name: e.name, duration: e.duration, startBar: e.startBar, type: e.type, size: e.size, fileId: e.fileId, hash: e.hash };
      let why = null, buf = null, blob = null;
      if (!idbOk) why = 'stockage audio indisponible';
      else {
        let rec = null;
        try { rec = await AudioStorage.get(e.fileId); } catch (x) { why = 'lecture du stockage impossible'; }
        if (!why && !rec) why = 'introuvable dans le stockage du navigateur';
        if (!why) {
          blob = rec.blob instanceof Blob ? rec.blob : new Blob([rec.blob]);
          if (blob.size !== e.size) why = 'fichier incomplet';
          else {
            try {
              const ab = await blob.arrayBuffer();
              if (await sha256Hex(ab) !== e.hash) why = 'fichier altéré';
              else buf = await timeoutP(audio.decodeAudioData(ab), AUDIO_DECODE_TIMEOUT, 'décodage trop long');   // ab n'est pas recopié : le décodage le consomme
            } catch (x) { why = 'fichier illisible'; }
          }
        }
      }
      if (buf) clips.push(Object.assign(base, { duration: buf.duration, buffer: buf, peaks: audioPeaks(buf, 800), blob, stored: true, missing: false, why: null }));
      else { problems.push({ name: e.name, why }); clips.push(Object.assign(base, { buffer: null, peaks: new Float32Array(800), blob: null, stored: false, missing: true, why })); }
    }
    return { clips, problems };
  }
};

