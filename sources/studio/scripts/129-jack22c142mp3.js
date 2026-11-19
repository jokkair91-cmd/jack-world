
/* 7.2 (Mission M7, Claude) : export MP3 hors ligne.
   - Bouton « Exporter en MP3 » à côté de l'export WAV, débit au choix (128, 192 ou 320 kbit/s, stéréo 44,1 kHz).
   - Le MP3 est fabriqué à partir du MÊME rendu que le WAV (renderSong) : même mixage, mêmes effets, même durée (limite 10 min).
   - Encodeur : lamejs 1.2.1 (LGPL 3.0), copie conforme du bloc « lamejs-src » de J-DJ M4, chargé seulement au moment de l'export.
     Rien n'est partagé avec J-DJ : JACK22 a sa propre copie, testée ici.
   - L'encodage se fait par morceaux (la page respire) ; le studio reste bloqué pour les autres opérations pendant ce temps, comme pour le WAV. */
(() => {
 'use strict';
 const KBPS = [128, 192, 320];
 let api = null;
 function lame() {
  if (api) return api;
  const src = document.getElementById('lamejs-src'); if (!src) throw Error('encodeur MP3 absent de ce fichier');
  api = new Function(src.textContent + '; return lamejs;')(); return api;
 }
 // Encode un WAV 16 bits stéréo (sortie de renderSong) en MP3. Renvoie un Blob audio/mpeg.
 async function wavToMp3(wav, kbps, progress) {
  const v = new DataView(wav), sr = v.getUint32(24, true), ch = v.getUint16(22, true);
  if (ch !== 2 || v.getUint16(34, true) !== 16) throw Error('WAV inattendu');
  const pcm = new Int16Array(wav, 44, (wav.byteLength - 44) >> 1), frames = pcm.length >> 1;
  const enc = new (lame().Mp3Encoder)(2, sr, kbps), L = new Int16Array(1152), R = new Int16Array(1152), out = [];
  for (let i = 0, k = 0; i < frames; i += 1152, k++) {
   const n = Math.min(1152, frames - i);
   for (let j = 0; j < n; j++) { L[j] = pcm[2 * (i + j)]; R[j] = pcm[2 * (i + j) + 1]; }
   const b = enc.encodeBuffer(L.subarray(0, n), R.subarray(0, n)); if (b.length) out.push(b);
   if (k % 200 === 199) { if (progress) progress(i / frames); await new Promise(r => setTimeout(r, 0)); }
  }
  const f = enc.flush(); if (f.length) out.push(f);
  return new Blob(out, { type: 'audio/mpeg' });
 }
 async function exportMp3(kbps) {
  if (exporting) return null;
  kbps = KBPS.includes(Number(kbps)) ? Number(kbps) : 192;
  let data, opts, plan;
  try { data = exportData(); opts = expOpts(); plan = exportPlan(data, opts); } catch (e) { setExp('Export MP3 impossible : ' + (e && e.message ? e.message : e)); return null; }
  if (!hasAnySound(data, plan)) { setExp('Rien à exporter en MP3 : le morceau est vide.'); return null; }
  if (plan.seconds > EXPORT_MAX_SECONDS) { setExp('Export MP3 trop long (' + fmtDur(plan.seconds) + ', maximum ' + EXPORT_MAX_SECONDS / 60 + ' minutes).'); return null; }
  exporting = true; uiExp(); const t0 = performance.now();
  try {
   setExp('MP3 : rendu du morceau…');
   const r = await withTimeout(renderSong(data, opts), EXPORT_TIMEOUT_MS);
   setExp('MP3 : encodage ' + kbps + ' kbit/s…');
   const mp3 = await wavToMp3(r.wav, kbps, p => setExp('MP3 : encodage ' + kbps + ' kbit/s… ' + Math.round(p * 100) + ' %'));
   const name = (data.song ? wavName(data.bpm).replace('jack22-studio-', 'jack22-song-') : wavName(data.bpm)).replace(/\.wav$/, '-' + kbps + 'k.mp3');
   const url = URL.createObjectURL(mp3), a = document.createElement('a'); a.href = url; a.download = name; a.style.display = 'none'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
   setExp('Terminé : ' + name + ' · ' + fmtDur(r.plan.seconds) + ' · ' + (mp3.size / 1048576).toFixed(1) + ' Mo · ' + kbps + ' kbit/s · ' + ((performance.now() - t0) / 1000).toFixed(1) + ' s. Le fichier est téléchargé.');
   return { blob: mp3, name, seconds: r.plan.seconds };
  } catch (e) { setExp('Export MP3 impossible : ' + (e && e.message ? e.message : e)); return null; }
  finally { exporting = false; try { uiExp(); } catch (e) {} }
 }
 function build() {
  const after = document.getElementById('expBtn'); if (!after || document.getElementById('j142Mp3')) return;
  const box = document.createElement('span'); box.id = 'j142Mp3';
  const b = document.createElement('button'); b.type = 'button'; b.id = 'j142Mp3Btn'; b.textContent = 'Exporter en MP3';
  const s = document.createElement('select'); s.id = 'j142Kbps'; s.setAttribute('aria-label', 'Débit du MP3');
  for (const k of KBPS) { const o = document.createElement('option'); o.value = String(k); o.textContent = k + ' kbit/s'; s.append(o); } s.value = '192';
  b.onclick = () => exportMp3(s.value);
  box.append(b, s); after.after(box);
 }
 const baseUi = uiExp; uiExp = function () { const r = baseUi.apply(this, arguments); const b = document.getElementById('j142Mp3Btn'); if (b) b.disabled = exporting || persistBusy; return r; };
 build(); setTimeout(build, 1500);
 window.JACK22_MP3142 = { version: '11.5-claude-7.2-mp3', exportMp3, wavToMp3, kbps: KBPS };
})();
