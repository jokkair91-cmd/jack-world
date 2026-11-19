/* ---------- Démos intégrées par style (synthétisées, aucun fichier à importer) ---------- */
const STYLE_DEMOS = [
  { style: 'rap', name: 'Béton de nuit', bpm: 90, bars: 8 },
  { style: 'rnb', name: 'Satin minuit', bpm: 72, bars: 8 },
  { style: 'punk', name: 'Épingle rouge', bpm: 176, bars: 16 },
  { style: 'electro', name: 'Faisceau bleu', bpm: 126, bars: 8 }
];
const demoCache = {};
// une seule préparation par démo, partagée entre le calcul en arrière-plan et le chargement
const renderStyleDemo = style => demoCache[style] || (demoCache[style] = buildStyleDemo(style).catch(e => { delete demoCache[style]; throw e; }));
async function buildStyleDemo(style) {
  const spec = STYLE_DEMOS.find(x => x.style === style);
  // on calcule un seul cycle (4 ou 8 mesures), puis on le répète : bien plus rapide
  const cycle = style === 'punk' ? 8 : 4;
  const sr = 44100, beat = 60 / spec.bpm, step = beat / 4, len = cycle * 16 * step;
  const oc = new OfflineAudioContext(2, Math.ceil(len * sr), sr);
  const comp = oc.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.connect(oc.destination);
  const bus = oc.createGain(); bus.gain.value = 0.8; bus.connect(comp);
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const noise = oc.createBuffer(1, sr, sr); const nd = noise.getChannelData(0); for (let i = 0; i < sr; i++) nd[i] = rnd() * 2 - 1;
  const env = (g, t, peak, dur, att = 0.004) => { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + att); g.gain.exponentialRampToValueAtTime(0.0008, t + dur); };
  const pan = (node, p) => { if (!p) return node; const s = oc.createStereoPanner(); s.pan.value = p; node.connect(s); return s; };
  const kick = (t, v = 1, f0 = 150, f1 = 46, d = 0.32) => { const o = oc.createOscillator(), g = oc.createGain(); o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + 0.09); env(g, t, v, d); o.connect(g).connect(bus); o.start(t); o.stop(t + d + 0.02); };
  const snare = (t, v = 0.5, freq = 1900, d = 0.2, tone = 190) => {
    const s = oc.createBufferSource(); s.buffer = noise; const f = oc.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.7;
    const g = oc.createGain(); env(g, t, v, d); s.connect(f).connect(g).connect(bus); s.start(t, rnd() * 0.5); s.stop(t + d + 0.02);
    if (tone) { const o = oc.createOscillator(), g2 = oc.createGain(); o.type = 'triangle'; o.frequency.value = tone; env(g2, t, v * 0.45, 0.08); o.connect(g2).connect(bus); o.start(t); o.stop(t + 0.1); }
  };
  const hat = (t, v = 0.14, d = 0.035, p = 0.25) => { const s = oc.createBufferSource(); s.buffer = noise; const f = oc.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7500; const g = oc.createGain(); env(g, t, v, d); pan(s.connect(f).connect(g), p).connect(bus); s.start(t, rnd() * 0.5); s.stop(t + d + 0.02); };
  const tone = (t, f, d, { type = 'sine', v = 0.08, lp = 3000, att = 0.01, p = 0, dest = bus, detune = 0 } = {}) => {
    const o = oc.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = detune;
    const fl = oc.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp; const g = oc.createGain(); env(g, t, v, d, att);
    pan(o.connect(fl).connect(g), p).connect(dest); o.start(t); o.stop(t + d + 0.05);
  };
  const N = m => 440 * Math.pow(2, (m - 69) / 12);
  const T = (bar, s) => (bar * 16 + s) * step;
  // saturation de guitare (punk)
  const dist = oc.createWaveShaper(), dc = new Float32Array(2048); for (let i = 0; i < 2048; i++) { const x = i / 1023.5 - 1; dc[i] = Math.tanh(x * 9) * 0.8; }
  dist.curve = dc; dist.oversample = '2x'; const dg = oc.createGain(); dg.gain.value = 0.32; const dlp = oc.createBiquadFilter(); dlp.type = 'lowpass'; dlp.frequency.value = 3800;
  dist.connect(dlp).connect(dg).connect(bus);
  for (let bar = 0; bar < cycle; bar++) {
    if (style === 'rap') {                       // boom bap, swing léger
      const sw = s => T(bar, s) + (s % 2 ? step * 0.18 : 0);
      [0, 7, 10].forEach(s => kick(sw(s), s ? 0.75 : 1)); if (bar % 2) kick(sw(13), 0.6);
      [4, 12].forEach(s => snare(sw(s), 0.6, 1700, 0.24));
      for (let s = 0; s < 16; s += 2) hat(sw(s), s % 4 ? 0.07 : 0.12, 0.04, 0.3);
      const prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]][bar % 4];      // la m – fa – do – sol
      prog.forEach((m, i) => tone(T(bar, 0), N(m), beat * 3.6, { type: 'triangle', v: 0.05, lp: 1800, att: 0.01, p: -0.2 + i * 0.2 }));
      tone(T(bar, 0), N(prog[0] - 24), beat * 1.6, { v: 0.32, lp: 400 }); tone(T(bar, 10), N(prog[0] - 24), beat * 1.2, { v: 0.26, lp: 400 });
    } else if (style === 'rnb') {                // groove lent, accords type Rhodes
      kick(T(bar, 0), 0.85, 120, 42, 0.4); kick(T(bar, 9), 0.6, 120, 42, 0.35); if (bar % 2) kick(T(bar, 11), 0.5, 120, 42, 0.3);
      [4, 12].forEach(s => snare(T(bar, s), 0.32, 2600, 0.12, 0));
      for (let s = 0; s < 16; s++) hat(T(bar, s), [0.09, 0.03, 0.06, 0.03][s % 4], 0.03, (s % 2 ? 0.35 : -0.15));
      const ch = [[65, 69, 72, 76], [64, 67, 71, 74], [62, 65, 69, 72], [60, 64, 67, 71]][bar % 4]; // Fa7M – Mim7 – Rém7 – Do7M
      ch.forEach((m, i) => { tone(T(bar, 0), N(m), beat * 3.8, { v: 0.045, lp: 2200, att: 0.02, p: -0.3 + i * 0.2 }); tone(T(bar, 0), N(m) * 2, beat * 1.2, { v: 0.012, lp: 4000, p: 0.3 - i * 0.2 }); });
      tone(T(bar, 0), N(ch[0] - 24), beat * 2.5, { v: 0.3, lp: 300 }); tone(T(bar, 10), N(ch[0] - 22), beat * 1.4, { v: 0.22, lp: 300 });
      if (bar % 2 === 1) [72, 74, 76, 79].forEach((m, i) => tone(T(bar, 8 + i * 2), N(m), step * 1.8, { v: 0.035, lp: 3500, p: 0.25 }));
    } else if (style === 'punk') {               // d-beat rapide, guitare saturée en accords de puissance
      for (let s = 0; s < 16; s += 2) { if (s % 4 === 0) kick(T(bar, s), 0.9, 160, 55, 0.18); else snare(T(bar, s), 0.55, 1900, 0.15); hat(T(bar, s), 0.1, 0.05, 0.2); }
      if (bar % 4 === 0) { const s = oc.createBufferSource(); s.buffer = noise; const f = oc.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 4000; const g = oc.createGain(); env(g, T(bar, 0), 0.25, 1.2); s.connect(f).connect(g).connect(bus); s.start(T(bar, 0)); s.stop(T(bar, 0) + 1.3); }
      const root = [40, 43, 45, 48][Math.floor(bar / 2) % 4];                              // mi – sol – la – do
      for (let s = 0; s < 16; s += 2) [root, root + 7].forEach((m, i) => tone(T(bar, s), N(m), step * 1.7, { type: 'sawtooth', v: 0.08, lp: 2400, att: 0.003, p: 0, dest: dist, detune: i * 7 }));
      tone(T(bar, 0), N(root - 12), beat * 3.9, { type: 'square', v: 0.1, lp: 600 });
    } else {                                      // électro 4 temps
      for (let b = 0; b < 4; b++) { kick(T(bar, b * 4), 1, 140, 48, 0.28); hat(T(bar, b * 4 + 2), 0.13, 0.12, 0.3); }
      [4, 12].forEach(s => snare(T(bar, s), 0.45, 1500, 0.18, 0));
      for (let s = 0; s < 16; s++) hat(T(bar, s), 0.035, 0.02, -0.3);
      const root = [45, 45, 41, 43][bar % 4];
      for (let s = 0; s < 16; s++) if (s % 4 !== 0) tone(T(bar, s), N(root - 12 + (s % 8 === 6 ? 12 : 0)), step * 0.9, { type: 'sawtooth', v: 0.11, lp: 700 + 500 * Math.sin((bar * 16 + s) / 10), att: 0.003 });
      const arp = [0, 3, 7, 10, 12, 10, 7, 3];
      for (let s = 0; s < 16; s += 2) tone(T(bar, s), N(root + 24 + arp[(s / 2 + bar) % 8]), step * 1.6, { type: 'square', v: 0.035, lp: 3200, p: (s % 4 ? 0.35 : -0.35) });
    }
  }
  const one = await oc.startRendering(), reps = Math.round(spec.bars / cycle);
  const full = new AudioBuffer({ length: one.length * reps, numberOfChannels: 2, sampleRate: sr });
  for (let c = 0; c < 2; c++) { const src = one.getChannelData(c), dst = full.getChannelData(c); for (let r = 0; r < reps; r++) dst.set(src, r * one.length); }
  return full;
}

