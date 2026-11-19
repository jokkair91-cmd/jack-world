/* ---------- Prise d'enregistrement écrite par blocs dans le navigateur (IndexedDB) ----------
   La mémoire ne garde qu'environ 1 s de son à la fois. Si l'espace manque, la prise s'arrête et ce qui est
   déjà écrit reste téléchargeable. Une prise interrompue (fermeture, plantage) peut être récupérée.
   Si IndexedDB est indisponible (navigation privée…), repli en mémoire comme avant, limité à REC_MEM_MAX_MIN. */
const REC_HARD_MAX_MIN = 240, REC_MEM_MAX_MIN = 60;
const REC = {
  db: null, take: 0, seq: 0, sr: 48000, frames: 0, pending: [], pendingFrames: 0, mem: null, writing: Promise.resolve(), error: null, maxFrames: 0, note: '',
  open() {
    return this.db || (this.db = new Promise((res, rej) => {
      try {
        const r = indexedDB.open('jdj-rec', 1);
        r.onupgradeneeded = () => { r.result.createObjectStore('blocks'); r.result.createObjectStore('takes'); };
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
      } catch (e) { rej(e); }
    }));
  },
  tx(stores, mode, fn) { return this.open().then(db => new Promise((res, rej) => { const t = db.transaction(stores, mode); let v; t.oncomplete = () => res(v); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); v = fn(t); })); },
  clearAll() { return this.tx(['blocks', 'takes'], 'readwrite', t => { t.objectStore('blocks').clear(); t.objectStore('takes').clear(); }); },
  async start(sr) {
    this.take = Date.now(); this.seq = 0; this.sr = sr; this.frames = 0; this.pending = []; this.pendingFrames = 0; this.error = null; this.mem = null; this.writing = Promise.resolve();
    let freeMin = null;
    try {
      await this.clearAll();
      await this.tx(['takes'], 'readwrite', t => t.objectStore('takes').put({ id: this.take, sr, done: false, started: this.take }, this.take));
      try { const e = await navigator.storage.estimate(); freeMin = (e.quota - e.usage) / (sr * 4 * 60); } catch (e) {}
      const lim = Math.min(REC_HARD_MAX_MIN, freeMin ? Math.floor(freeMin * 0.85) : REC_HARD_MAX_MIN);
      this.maxFrames = Math.max(1, lim) * 60 * sr;
      this.note = `prise écrite au fur et à mesure (place pour environ ${Math.max(1, lim)} min)`;
    } catch (e) {
      this.mem = []; this.maxFrames = REC_MEM_MAX_MIN * 60 * sr;
      this.note = `stockage indisponible : prise gardée en mémoire, limitée à ${REC_MEM_MAX_MIN} min`;
    }
    return this.note;
  },
  add(chunk, frames) {
    this.frames += frames;
    if (this.mem) { this.mem.push(chunk); return; }
    this.pending.push(chunk); this.pendingFrames += frames;
    if (this.pendingFrames >= this.sr) this.flush();
  },
  flush() {
    if (this.mem || !this.pending.length) return;
    const blob = new Blob(this.pending), seq = this.seq++, take = this.take, frames = this.frames;
    this.pending = []; this.pendingFrames = 0;
    this.writing = this.writing.then(() => this.tx(['blocks', 'takes'], 'readwrite', t => {
      t.objectStore('blocks').put(blob, [take, seq]);
      t.objectStore('takes').put({ id: take, sr: this.sr, done: false, started: take, frames }, take);
    })).catch(err => { if (!this.error) { this.error = err; onRecStorageError(err); } });
  },
  async blobsOf(take) {
    return this.tx(['blocks'], 'readonly', t => { const r = t.objectStore('blocks').getAll(IDBKeyRange.bound([take, 0], [take, Infinity])); return r; }).then(r => r.result || []);
  },
  async readTake(take, sr) {
    const blobs = await this.blobsOf(take);
    const frames = Math.floor(blobs.reduce((n, b) => n + b.size, 0) / 4);
    return { blob: new Blob([wavHeader(frames, sr), ...blobs], { type: 'audio/wav' }), frames };
  },
  async finish() {
    if (this.mem) { const blob = this.frames ? encodeWAV(this.mem, this.frames, this.sr) : null; this.mem = null; return { blob, frames: this.frames }; }
    this.flush(); await this.writing;
    const r = await this.readTake(this.take, this.sr);
    try { await this.tx(['takes'], 'readwrite', t => t.objectStore('takes').put({ id: this.take, sr: this.sr, done: true, started: this.take, frames: r.frames }, this.take)); } catch (e) {}
    return r.frames ? r : { blob: null, frames: 0 };
  },
  async interrupted() {
    try {
      const takes = await this.tx(['takes'], 'readonly', t => t.objectStore('takes').getAll()).then(r => r.result || []);
      return takes.find(t => !t.done && (t.frames || 0) > 0) || null;
    } catch (e) { return null; }
  }
};
function onRecStorageError(err) {
  const full = err && (err.name === 'QuotaExceededError' || /quota/i.test(String(err.message)));
  stopRec(full ? 'Espace de stockage plein : enregistrement arrêté, la partie déjà enregistrée est conservée.'
               : 'Écriture de la prise impossible : enregistrement arrêté, la partie déjà enregistrée est conservée.');
}
let recBusy = false;
async function stopRec(note) {
  if (!recording || recBusy) return;
  recBusy = true; recording = false;
  recLabel.textContent = 'Finalisation…'; recBtn.disabled = true;
  if (recWk) await new Promise(res => {         // vide le tampon du moteur AudioWorklet
    const t = setTimeout(res, 400);
    recWk.port.onmessage = e => { if (e.data.type === 'data') { REC.add(e.data.pcm, e.data.frames); recFrames += e.data.frames; } else if (e.data.type === 'done') { clearTimeout(t); res(); } };
    recWk.port.postMessage({ type: 'off' });
  });
  let r = { blob: null, frames: 0 };
  try { r = await REC.finish(); } catch (e) { note = (note ? note + ' ' : '') + 'Lecture de la prise impossible.'; }
  const secs = r.frames / (REC.sr || ctx.sampleRate);
  mixBlob = r.blob;
  recBtn.setAttribute('aria-pressed', 'false'); recLabel.textContent = 'Nouvel enregistrement'; recBtn.disabled = false;
  recTime.hidden = true; recBusy = false;
  if (mixBlob) { dlBtn.hidden = false; mp3Btn.hidden = false; say((note ? note + ' ' : '') + 'Mix WAV prêt : ' + fmt(secs)); }
  else say((note ? note + ' ' : '') + 'Rien n’a été enregistré');
}
function onRecData(chunk, frames) {
  if (!recording) return;
  REC.add(chunk, frames); recFrames += frames;
  if (recFrames >= REC.maxFrames) stopRec(`Limite de ${Math.round(REC.maxFrames / REC.sr / 60)} min atteinte.`);
}
recBtn.addEventListener('click', async () => {
  ensureCtx();
  if (recBusy) return;
  if (recording) { stopRec(); return; }
  if (!recTap && !recWk) { say('L’enregistrement ne marche pas sur ce navigateur'); return; }
  if (mp3Busy) { say('Attends la fin de l’encodage MP3 avant une nouvelle prise.'); return; }
  recBusy = true; recFrames = 0; mixBlob = null; mp3Blob = null; mp3For = null; dlBtn.hidden = true; mp3Btn.hidden = true; recRecover.hidden = true;
  const note = await REC.start(ctx.sampleRate);
  recBusy = false; recording = true;
  if (recWk) { recWk.port.onmessage = e => { if (e.data.type === 'data') onRecData(e.data.pcm, e.data.frames); }; recWk.port.postMessage({ type: 'on' }); }
  recBtn.setAttribute('aria-pressed', 'true'); recLabel.textContent = 'Arrêter'; recTime.textContent = '0:00'; recTime.hidden = false;
  say('● Enregistrement : ' + note + '.');
});
// prise interrompue (fermeture ou plantage pendant un enregistrement) : proposée à la réouverture
const recRecover = document.getElementById('recRecover');
REC.interrupted().then(t => {
  if (!t) return;
  recRecover.hidden = false;
  recRecover.textContent = `Récupérer la prise interrompue (${fmt(t.frames / t.sr)})`;
  recRecover.onclick = async () => {
    recRecover.disabled = true; say('Récupération de la prise…');
    try {
      const r = await REC.readTake(t.id, t.sr);
      await REC.tx(['takes'], 'readwrite', s => s.objectStore('takes').put({ ...t, done: true, frames: r.frames }, t.id));
      mixBlob = r.blob; mp3Blob = null; mp3For = null; dlBtn.hidden = false; mp3Btn.hidden = false; recRecover.hidden = true;
      say(`Prise récupérée : ${fmt(r.frames / t.sr)}. Télécharge-la en WAV ou en MP3.`);
    } catch (e) { say('Récupération impossible.'); recRecover.disabled = false; }
  };
});
