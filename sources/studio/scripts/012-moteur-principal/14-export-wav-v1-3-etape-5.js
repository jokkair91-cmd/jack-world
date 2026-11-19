/* =====================================================================
   EXPORT WAV (V1.3, étape 5)
   Le morceau est rejoué HORS-LIGNE (OfflineAudioContext, 44,1 kHz) avec le même moteur que le studio :
   mêmes sons, mêmes volumes (mixeur, Mute, synthé, harmoniques), même BPM. Le rendu est découpé en petits
   morceaux pour ne pas gêner la lecture, et son aléa est fixé : deux exports identiques donnent le même fichier.
   Fichier : WAV PCM 16 bits, stéréo, 44 100 Hz.
   ===================================================================== */
const EXPORT_SR = 44100;            // fréquence d'échantillonnage du fichier
const EXPORT_TAIL = 1.5;            // secondes de fin ajoutées pour que les dernières notes meurent naturellement
const EXPORT_TAIL_MAX = 8;          // fin maximale (reverb longue, delay avec beaucoup de feedback)
const EXPORT_FADE = 0.03;           // fondu final de 30 ms (sécurité : jamais de coupure sèche)
const EXPORT_MAX_SECONDS = 600;     // durée maximale d'un export (mémoire) — M1 (Claude) : 10 minutes au lieu de 3
const EXPORT_SEED = 20261030;       // aléa fixe du bruit des percussions

/* Longueur de la fin : 1,5 s, plus longue si la reverb ou le delay sont activés (pour que leur queue ne soit pas coupée) */
function exportTail(fx) {
  const f = fxMerge(fx); let tail = EXPORT_TAIL;
  if (f.reverb.on && f.reverb.mix > 0) tail = Math.max(tail, f.reverb.decay + 0.3);
  if (f.delay.on && f.delay.mix > 0) { const fb = Math.min(0.8, Math.max(0.05, f.delay.fb / 100)); tail = Math.max(tail, f.delay.time * (1 + Math.ceil(Math.log(0.001) / Math.log(fb))) + 0.2); }
  return Math.min(EXPORT_TAIL_MAX, tail);
}
/* Plan de l'export : combien de mesures, de pas, de secondes, d'échantillons */
function exportPlan(data, opts) {
  if (data.song) {                                              // Mission 9c : mode SONG = toute la timeline, une seule fois (pas de répétitions)
    const withMel = !!(data.take && opts.includeMelody), withRoll = data.song.blocks.some(b => b.ti > 0);
    const withAudio = !!data.audio, audioEnd = audioEndSec(data), blocksSec = data.song.endBar * 16 * data.stepLen;
    const steps = Math.max(data.song.endBar * 16, withAudio ? Math.ceil(audioEnd / data.stepLen - 1e-9) : 0), bars = Math.ceil(steps / 16);   // sans audio : exactement comme en 9c
    const tail = exportTail(data.settings && data.settings.fx), bodySec = Math.max(blocksSec, audioEnd), seconds = bodySec + tail;
    return { song: true, withMel, withRoll, withAudio, loopBars: bars, bars, steps, bodySec, tail, seconds, frames: Math.ceil(seconds * EXPORT_SR) };
  }
  const withMel = !!(data.take && opts.includeMelody), withRoll = !!(data.rolls.length && opts.includeRoll);
  const loopBars = Math.max(1, withMel ? data.take.bars : 1, ...(withRoll ? data.rolls.map(r => r.bars) : [1]));       // les couches bouclent chacune à leur longueur dans ce nombre de mesures
  const bars = opts.loops * loopBars, steps = bars * 16;
  const withAudio = !!data.audio, audioEnd = audioEndSec(data);                 // Mission 10, étape 2 : les patterns font `loops` répétitions ; le fichier est prolongé jusqu'à la fin de l'audio
  const patSilent = !(data.pattern.some(r => r.some(Boolean)) || (withMel && data.take.notes.length > 0) || withRoll);   // patterns vides : le WAV s'arrête à la fin de l'audio (pas de silence inutile)
  const tail = exportTail(data.settings && data.settings.fx), bodySec = withAudio && patSilent ? audioEnd : Math.max(steps * data.stepLen, audioEnd), seconds = bodySec + tail;
  return { withMel, withRoll, withAudio, audioExtends: withAudio && bodySec > steps * data.stepLen + 1e-9, loopBars, bars, steps, bodySec, tail, seconds, frames: Math.ceil(seconds * EXPORT_SR) };
}
function hasAnySound(data, plan) { if (plan.withAudio) return true; if (data.song) return data.song.blocks.some(b => b.grid ? b.grid.some(r => r.some(Boolean)) : b.roll.notes.length > 0) || (plan.withMel && data.take.notes.length > 0 && data.song.endBar > 0); return data.pattern.some(r => r.some(Boolean)) || (plan.withMel && data.take.notes.length > 0) || (plan.withRoll && data.rolls.length > 0); }
/* Plus grand nombre de notes de la prise sonnant en même temps (notes à cheval sur la fin de boucle comprises) */
function maxOverlap(tk) {
  let m = 0;
  tk.notes.forEach(a => {
    let c = 0;
    tk.notes.forEach(b => { if ((((a.start - b.start) % tk.steps) + tk.steps) % tk.steps < b.dur) c++; });
    if (c > m) m = c;
  });
  return m;
}
/* Aléa reproductible le temps de fn() (le bruit des percussions est tiré à la création du moteur) */
function withSeed(seed, fn) {
  const orig = Math.random; let a = seed | 0;
  Math.random = function () { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  try { return fn(); } finally { Math.random = orig; }
}
function scheduleDrumsBar(E, bus, pattern, bar, stepLen) {         // les percussions d'une mesure
  for (let s = 0; s < 16; s++) for (let r = 0; r < 4; r++) if (pattern[r][s]) E.hit(r, (bar * 16 + s) * stepLen, bus);
}
function applyFadeOut(channels, sampleRate, seconds) {              // fondu linéaire jusqu'à zéro sur les derniers échantillons
  channels.forEach(ch => { const m = Math.min(ch.length, Math.round(seconds * sampleRate)); for (let j = 0; j < m; j++) ch[ch.length - m + j] *= (m - 1 - j) / Math.max(1, m - 1); });
}
const toInt16 = x => { x = x > 1 ? 1 : x < -1 ? -1 : x; return Math.round(x < 0 ? x * 32768 : x * 32767); };
function encodeWav(left, right, sampleRate) {                       // WAV PCM 16 bits stéréo
  const n = left.length, bytes = 44 + n * 4, buf = new ArrayBuffer(bytes), v = new DataView(buf);
  const w = (o, str) => { for (let i = 0; i < str.length; i++) v.setUint8(o + i, str.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, bytes - 8, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); v.setUint16(22, 2, true); v.setUint32(24, sampleRate, true); v.setUint32(28, sampleRate * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true);
  w(36, 'data'); v.setUint32(40, n * 4, true);
  let o = 44;
  for (let i = 0; i < n; i++) { v.setInt16(o, toInt16(left[i]), true); v.setInt16(o + 2, toInt16(right[i]), true); o += 4; }
  return buf;
}

/* Même chose en plusieurs morceaux (la page respire entre deux) : renvoie { wav, peak } */
async function encodeWavAsync(left, right, sampleRate, pause) {
  const n = left.length, buf = new ArrayBuffer(44 + n * 4), head = encodeWav(left.subarray(0, 0), right.subarray(0, 0), sampleRate), v = new DataView(buf);
  new Uint8Array(buf).set(new Uint8Array(head).subarray(0, 44));
  v.setUint32(4, 44 + n * 4 - 8, true); v.setUint32(40, n * 4, true);
  let o = 44, peak = 0;
  for (let i = 0; i < n; i += 65536) {
    const e = Math.min(n, i + 65536);
    for (let k = i; k < e; k++) {
      const a = left[k], b = right[k], aa = a < 0 ? -a : a, bb = b < 0 ? -b : b;
      if (aa > peak) peak = aa; if (bb > peak) peak = bb;
      v.setInt16(o, toInt16(a), true); v.setInt16(o + 2, toInt16(b), true); o += 4;
    }
    if (e < n) await pause();
  }
  return { wav: buf, peak };
}


