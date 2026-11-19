/* ---------- Export MP3 (lamejs, LGPL) : encodage dans un Worker, repli sur le fil principal ---------- */
const mp3Btn = document.getElementById('mp3Btn');
let mp3Blob = null, mp3For = null, mp3Busy = false;
// L'export lit le WAV source par blocs d'environ 10 s : la mémoire reste faible même pour un long mix,
// et la source reste toujours relisible. Si le Worker échoue (avant ou après avoir reçu des données),
// le repli recommence depuis le début en relisant le WAV, au lieu de réutiliser des données déjà transférées.
const MP3_KBPS = 192, MP3_BLOCK = 1152 * 400;
const MP3_GLUE = `
function Mp3Stream(sr, kbps) { this.enc = new lamejs.Mp3Encoder(2, sr, kbps); this.L = new Int16Array(1152); this.R = new Int16Array(1152); }
Mp3Stream.prototype.push = function (pcm, frames) {
  const out = [];
  for (let i = 0; i < frames; i += 1152) {
    const n = Math.min(1152, frames - i);
    for (let j = 0; j < n; j++) { this.L[j] = pcm[2 * (i + j)]; this.R[j] = pcm[2 * (i + j) + 1]; }
    const b = this.enc.encodeBuffer(this.L.subarray(0, n), this.R.subarray(0, n)); if (b.length) out.push(b);
  }
  return out;
};
Mp3Stream.prototype.end = function () { const f = this.enc.flush(); return f.length ? [f] : []; };`;
function mp3Source() { return document.getElementById('lamejs-src').textContent + MP3_GLUE; }
async function readPcmBlock(blob, start, frames) { return new Int16Array(await blob.slice(44 + start * 4, 44 + (start + frames) * 4).arrayBuffer()); }
async function encodeMp3Main(blob, frames, sr, onProgress) {
  const api = new Function(mp3Source() + '; return { Mp3Stream };')();
  const st = new api.Mp3Stream(sr, MP3_KBPS), out = [];
  for (let f = 0; f < frames; f += MP3_BLOCK) {
    const n = Math.min(MP3_BLOCK, frames - f), pcm = await readPcmBlock(blob, f, n);
    for (const b of st.push(pcm, n)) out.push(b);
    onProgress((f + n) / frames);
    await new Promise(r => setTimeout(r, 0));            // laisse respirer l'interface
  }
  for (const b of st.end()) out.push(b);
  return out;
}
function encodeMp3Worker(blob, frames, sr, onProgress) {
  return new Promise((resolve, reject) => {
    let w, url;
    try {
      url = URL.createObjectURL(new Blob([mp3Source() + `
let st = null;
self.onmessage = e => { const d = e.data; try {
  if (d.type === 'init') st = new Mp3Stream(d.sr, d.kbps);
  else if (d.type === 'block') { const out = st.push(d.pcm, d.frames); self.postMessage({ type: 'data', out }, out.map(b => b.buffer)); }
  else if (d.type === 'end') { const out = st.end(); self.postMessage({ type: 'done', out }, out.map(b => b.buffer)); }
} catch (err) { self.postMessage({ type: 'err', msg: String(err && err.message || err) }); } };`], { type: 'text/javascript' }));
      w = new Worker(url);
    } catch (e) { if (url) URL.revokeObjectURL(url); reject(e); return; }
    const out = []; let f = 0, settled = false;
    const fail = err => { if (settled) return; settled = true; try { w.terminate(); } catch (e) {} URL.revokeObjectURL(url); reject(err); };
    const next = async () => {
      if (settled) return;
      if (f >= frames) { w.postMessage({ type: 'end' }); return; }
      const n = Math.min(MP3_BLOCK, frames - f); let pcm;
      try { pcm = await readPcmBlock(blob, f, n); } catch (e) { fail(e); return; }
      if (settled) return;
      f += n; w.postMessage({ type: 'block', pcm, frames: n }, [pcm.buffer]);
    };
    w.onmessage = e => {
      const d = e.data;
      if (d.type === 'data') { for (const b of d.out) out.push(b); onProgress(f / frames); next(); }
      else if (d.type === 'done') { for (const b of d.out) out.push(b); settled = true; w.terminate(); URL.revokeObjectURL(url); resolve(out); }
      else fail(new Error(d.msg || 'erreur du Worker MP3'));
    };
    w.onerror = ev => { if (ev && ev.preventDefault) ev.preventDefault(); fail(new Error('Worker MP3 en échec')); };
    w.postMessage({ type: 'init', sr, kbps: MP3_KBPS });
    next();
  });
}
async function makeMp3(blob, onProgress = p => { mp3Btn.textContent = `Encodage MP3… ${Math.round(p * 100)} %`; }) {
  const head = new DataView(await blob.slice(0, 44).arrayBuffer()), sr = head.getUint32(24, true);
  const frames = Math.min(Math.floor(head.getUint32(40, true) / 4), Math.floor((blob.size - 44) / 4));
  if (![32000, 44100, 48000].includes(sr)) throw new Error(`taux ${sr} Hz non pris en charge par l’encodeur MP3`);
  let chunks;
  try { chunks = await encodeMp3Worker(blob, frames, sr, onProgress); }
  catch (e) { onProgress(0); chunks = await encodeMp3Main(blob, frames, sr, onProgress); }   // repli : relecture complète du WAV
  return new Blob(chunks, { type: 'audio/mpeg' });
}
mp3Btn.addEventListener('click', async () => {
  if (!mixBlob || mp3Busy) return;
  if (mp3For !== mixBlob) {
    mp3Busy = true; mp3Btn.disabled = true; say('Encodage MP3 en cours (192 kbit/s)…');
    try { mp3Blob = await makeMp3(mixBlob); mp3For = mixBlob; }
    catch (e) { mp3Busy = false; mp3Btn.disabled = false; mp3Btn.textContent = 'Télécharger en MP3'; say('MP3 impossible : ' + (e && e.message || 'erreur') + '. Le WAV reste disponible.'); return; }
    mp3Busy = false; mp3Btn.disabled = false; mp3Btn.textContent = 'Télécharger en MP3';
  }
  const name = `mix-j-dj-${stampNow()}.mp3`, r = await saveFile(mp3Blob, name);
  if (r === 'ok') PROJ.addExport({ format: 'MP3', name, dur: (mixBlob.size - 44) / 4 / (REC.sr || 48000), size: mp3Blob.size });
  say(r === 'ok' ? `MP3 téléchargé (${(mp3Blob.size / 1048576).toFixed(1).replace('.', ',')} Mo)` : r === 'declined' ? '' : 'Téléchargement indisponible ici');
});

dlBtn.addEventListener('click', async () => {
  if (!mixBlob) return;
  const name = `mix-j-dj-${stampNow()}.${mixExt}`, r = await saveFile(mixBlob, name);
  if (r === 'ok') PROJ.addExport({ format: 'WAV', name, dur: (mixBlob.size - 44) / 4 / (REC.sr || 48000), size: mixBlob.size });
  say(r === 'ok' ? 'Mix téléchargé' : r === 'declined' ? '' : r === 'later' ? 'Réessaie dans un instant' : 'Téléchargement indisponible ici');
});

