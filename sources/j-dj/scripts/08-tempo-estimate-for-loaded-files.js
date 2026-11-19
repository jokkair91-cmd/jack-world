/* ---------- Tempo estimate for loaded files ---------- */
/* Analyse de grille : BPM + position d'un battement de référence + niveau de confiance.
   Un battement détecté n'est pas forcément le premier temps d'une mesure. */
function analyzeGrid(buf) {
  const sr = buf.sampleRate, hop = Math.round(sr / 200), FPS = sr / hop; // cadence réelle (évite un biais de BPM)
  const c0 = buf.getChannelData(0), c1 = buf.numberOfChannels > 1 ? buf.getChannelData(1) : c0;
  const frames = Math.min(Math.floor(c0.length / hop), FPS * 120);
  if (frames < FPS * 4) return { bpm: null, beat0: null, gridSrc: 'incertain', conf: 0 };
  const env = new Float32Array(frames), on = new Float32Array(frames);
  for (let i = 0; i < frames; i++) { let s = 0; for (let j = i * hop, e = j + hop; j < e; j += 2) { const x = c0[j] + c1[j]; s += x * x; } env[i] = Math.log(1 + 1000 * Math.sqrt(s / (hop / 2))); }
  for (let i = 1; i < frames; i++) on[i] = Math.max(0, env[i] - env[i - 1]);
  // 1) tempo grossier par autocorrélation (70–180 BPM)
  const Lmin = Math.floor(60 * FPS / 180), Lmax = Math.ceil(60 * FPS / 70), r = new Float32Array(Lmax + 2);
  for (let L = Lmin - 1; L <= Lmax + 1; L++) { let s = 0; for (let i = 0; i + L < frames; i++) s += on[i] * on[i + L]; r[L] = s; }
  const peaks = [];
  for (let L = Lmin; L <= Lmax; L++) if (r[L] > 0 && r[L] >= r[L - 1] && r[L] >= r[L + 1]) {
    const a = r[L - 1], b = r[L], c = r[L + 1], den = a - 2 * b + c;
    peaks.push({ v: b, bpm: 60 * FPS / (L + (den ? 0.5 * (a - c) / den : 0)) });
  }
  if (!peaks.length) return { bpm: null, beat0: null, gridSrc: 'incertain', conf: 0 };
  peaks.sort((p, q) => q.v - p.v);
  // candidats : meilleurs pics + rapports 3/2 et 2/3, ramenés dans la plage 88–176 BPM
  // (une même pulsation lue au double ou à la moitié donne le même candidat)
  const cands = [];
  for (const p of peaks.slice(0, 4)) for (const f of [1, 1.5, 2 / 3]) {
    let b = p.bpm * f; while (b < 88) b *= 2; while (b >= 176) b /= 2;
    if (!cands.some(x => Math.abs(x - b) < 1.5)) cands.push(b);
  }
  // 2) affinage BPM + phase : peigne de battements sur toute la zone analysée
  const comb = (bpm, ph) => { const P = 60 * FPS / bpm; let s = 0; for (let x = ph; x < frames - 1; x += P) { const i = Math.floor(x), f = x - i; s += on[i] * (1 - f) + on[i + 1] * f; } return s; };
  const search = (lo, hi, step, phStep) => {
    let bs = { s: -1, bpm: lo, ph: 0 };
    for (let bpm = lo; bpm <= hi + 1e-9; bpm += step) { const P = 60 * FPS / bpm; for (let ph = 0; ph < P; ph += phStep) { const s = comb(bpm, ph); if (s > bs.s) bs = { s, bpm, ph }; } }
    return bs;
  };
  const confOf = bs => { const P = 60 * FPS / bs.bpm; let m = 0, n = 0; for (let ph = 0; ph < P; ph += 1) { m += comb(bs.bpm, ph); n++; } m /= n; return m > 0 ? bs.s / m : 0; };
  let best = null;
  for (const c of cands) {
    const bs = search(c - 2.5, c + 2.5, 0.05, 2); bs.conf = confOf(bs);
    if (!best || bs.conf > best.conf) best = bs;
  }
  const fine = search(best.bpm - 0.1, best.bpm + 0.1, 0.01, 0.25); fine.conf = confOf(fine);
  if (fine.s >= best.s) best = fine;
  const P = 60 * FPS / best.bpm, conf = best.conf;
  // premier battement réellement présent sur la grille (on saute les intros sans rythme)
  const strength = [];
  for (let x = best.ph; x < frames - 2; x += P) {
    const i = Math.round(x); let m = 0; for (let j = Math.max(0, i - 2); j <= Math.min(frames - 1, i + 2); j++) m = Math.max(m, on[j]);
    strength.push(m);
  }
  const med = strength.slice().sort((p, q) => p - q)[Math.floor(strength.length / 2)] || 0;
  const k0 = Math.max(0, strength.findIndex(m => m >= 0.5 * med));
  const first = best.ph + k0 * P;
  const beat0 = (first * hop) / sr;
  let meanOn = 0; for (let i = 0; i < frames; i++) meanOn += on[i]; meanOn /= frames;
  const pulse = meanOn > 0 ? med / meanOn : 0; // netteté des battements par rapport au reste du signal
  const ok = conf >= 3 && pulse >= 4;
  return { bpm: Math.round(best.bpm * 100) / 100, beat0, gridSrc: ok ? 'auto' : 'incertain', conf: Math.round(conf * 100) / 100, pulse: Math.round(pulse * 10) / 10 };
}

/* Chargement d'un fichier audio sur une platine (n'affecte pas l'autre platine) */
// - chaque demande reçoit un numéro : seule la plus récente peut remplacer le morceau (deux chargements
//   qui se terminent dans le désordre ne peuvent plus imposer l'ancien) ;
// - le nouveau morceau est entièrement préparé avant de remplacer l'ancien : si le fichier est illisible,
//   la platine garde son titre, ses repères et sa lecture en cours.
function newLoadRequest(d) { d.loadReq = (d.loadReq || 0) + 1; d.loading = true; d.ui(); return d.loadReq; }
function endLoadRequest(d, req) { if (req === d.loadReq) { d.loading = false; d.ui(); } }
async function loadFileOnDeck(d, f) {
  ensureCtx();
  const req = newLoadRequest(d);
  try {
    const ab = await f.arrayBuffer();
    const id = fileId(ab);                     // avant le décodage, qui libère le tampon
    const buf = await ctx.decodeAudioData(ab);
    if (req !== d.loadReq) return 'superseded';
    const g = analyzeGrid(buf);
    if (req !== d.loadReq) return 'superseded';
    d.load(buf, f.name.replace(/\.[^.]+$/, ''), { ...g, id });
    d.gridConf = g.conf;
    const m = STORE.restoreTrack(d); if (m) d.say(m);
    return true;
  } catch (err) {
    if (req !== d.loadReq) return 'superseded';
    endLoadRequest(d, req);
    if (d.buffer) d.say(`« ${f.name} » est illisible (essaie un MP3 ou un WAV). La platine garde « ${d.name} ».`);
    else { d.r('name').textContent = 'Fichier illisible : essaie un MP3 ou un WAV'; d.say(`« ${f.name} » est illisible.`); }
    return false;
  }
}

