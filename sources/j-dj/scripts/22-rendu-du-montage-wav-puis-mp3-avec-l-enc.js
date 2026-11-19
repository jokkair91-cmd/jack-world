/* ---------- Rendu du montage (WAV, puis MP3 avec l'encodeur fiabilisé) ----------
   Calcul hors ligne par tranches de 30 s (mémoire limitée même pour un long set), chacune précédée d'1 s
   de « pré-roulage » jetée ensuite, pour que le limiteur du Master soit dans le même état qu'en continu. */
function mtMasterCurve() {
  const cN = 8192, cv = new Float32Array(cN), knee = 0.8, ceil = 0.98;            // même écrêteur doux que la console
  for (let i = 0; i < cN; i++) { const x = i / (cN - 1) * 4 - 2, ax = Math.abs(x); cv[i] = Math.sign(x) * (ax <= knee ? ax : knee + (ceil - knee) * Math.tanh((ax - knee) / (ceil - knee))); }
  return cv;
}
function mtMasterOffline(c) {
  const g = c.createGain(); g.gain.value = mix.master * 1.2;
  const lim = c.createDynamicsCompressor();
  lim.threshold.value = -3; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.003; lim.release.value = 0.12;
  const sh = c.createWaveShaper(); sh.curve = mtMasterCurve();
  g.connect(lim); lim.connect(sh); sh.connect(c.destination);
  return g;
}
MT.render = async function (onProgress = () => {}, chunkSec = 30) {
  const missing = await this.prepare(), end = this.end();
  if (!(end > 0)) throw new Error('le montage est vide');
  const sr = MT_SR, total = Math.round(end * sr), CH = Math.round(chunkSec * sr), PRE = sr, clips = JSON.parse(this.snap()), parts = [];
  for (let s = 0; s < total; s += CH) {
    const n = Math.min(CH, total - s), pre = Math.min(PRE, s);
    const oc = new OfflineAudioContext(2, n + pre, sr);
    mtSchedule(oc, mtMasterOffline(oc), clips, this.bufs, (s - pre) / sr, 0);
    const ab = await oc.startRendering();
    const L = ab.getChannelData(0), R = ab.getChannelData(1), out = new Int16Array(n * 2);
    for (let i = 0; i < n; i++) {
      const l = clamp(L[pre + i], -1, 1), r = clamp(R[pre + i], -1, 1);
      out[2 * i] = l < 0 ? l * 0x8000 : l * 0x7fff; out[2 * i + 1] = r < 0 ? r * 0x8000 : r * 0x7fff;
    }
    parts.push(new Blob([out])); onProgress((s + n) / total);   // tranche confiée au navigateur : la mémoire JavaScript reste basse
    await new Promise(r => setTimeout(r, 0));
  }
  return { blob: new Blob([wavHeader(total, sr), ...parts], { type: 'audio/wav' }), frames: total, sr, missing: missing.map(k => k.name) };
};
MT.exportFile = async function (fmtOut) {
  const rst = t => { this.el('mtRst').textContent = t; };
  if (this.rendering) return;
  if (!this.clips.length) { rst('Le montage est vide : rien à exporter.'); return; }
  if (this.playing) this.stop();
  const miss = await this.prepare();
  if (miss.length && !(await askConfirm(`${miss.length} clip(s) ont un fichier absent (${[...new Set(miss.map(k => k.name))].join(', ')}) : ils seront silencieux dans le fichier. Exporter quand même ?`, 'Exporter'))) { rst('Export annulé : relie d’abord les fichiers absents dans la bibliothèque.'); return; }
  this.rendering = true; this.el('mtWav').disabled = this.el('mtMp3').disabled = true;
  const t0 = performance.now();
  try {
    const r = await this.render(p => rst(`Calcul du montage… ${Math.round(p * 100)} %`));
    let blob = r.blob, ext = 'wav';
    if (fmtOut === 'MP3') { blob = await makeMp3(r.blob, p => rst(`Encodage MP3… ${Math.round(p * 100)} %`)); ext = 'mp3'; }
    this.lastRender = { ...r, out: blob, fmt: fmtOut };
    const safe = ((PROJ.cur && PROJ.cur.name) || 'set').replace(/[^\p{L}\p{N} _-]+/gu, '').trim().replace(/\s+/g, '-') || 'set';
    const name = `montage-${safe}-${stampNow()}.${ext}`, res = await saveFile(blob, name);
    const secs = ((performance.now() - t0) / 1000).toFixed(1).replace('.', ',');
    if (res === 'ok') PROJ.addExport({ format: fmtOut + ' montage', name, dur: r.frames / r.sr, size: blob.size });
    rst(res === 'ok' ? `${fmtOut} du montage prêt : ${fmtPrecise(r.frames / r.sr)}, ${(blob.size / 1048576).toFixed(1).replace('.', ',')} Mo, calculé en ${secs} s.` + (r.missing.length ? ` ${r.missing.length} clip(s) silencieux (fichier absent).` : '')
      : res === 'declined' ? 'Téléchargement annulé.' : 'Téléchargement indisponible ici.');
  } catch (e) { rst('Rendu impossible : ' + (e && e.message || 'erreur') + '.'); }
  finally { this.rendering = false; this.el('mtWav').disabled = this.el('mtMp3').disabled = false; }
};
document.getElementById('mtWav').addEventListener('click', () => MT.exportFile('WAV'));
document.getElementById('mtMp3').addEventListener('click', () => MT.exportFile('MP3'));

STORE.load(); STORE.applyPrefs(); STORE.ready = true;
PROJ.boot();
requestAnimationFrame(frame);

// accès en lecture pour les tests automatisés (aucun effet sur l'utilisation normale)
window.__jdj = { MT, mtSchedule, mtEnv, mtMasterOffline, PROJ, PL, STORE, fileId, SMP, REC, get mixBlob2() { return mixBlob; }, onRecData: (c, n) => onRecData(c, n), makeMp3, get ctx() { return ctx; }, decks, mix, analyzeGrid, loadFileOnDeck, HP, get cueVol() { return cueVol; }, get cueDest() { return cueDest; }, get recording() { return recording; }, get mixBlob() { return mixBlob; } };
})();
