/* ---------- Demo beats (synthesised) ---------- */
async function renderDemo(id) {
  const sr = 44100, bpm = id === 'A' ? 140 : 144, step = 60 / bpm / 4, bars = 4;
  const oc = new OfflineAudioContext(2, Math.ceil(bars * 16 * step * sr), sr);
  const comp = oc.createDynamicsCompressor(); comp.threshold.value = -12; comp.ratio.value = 4; comp.connect(oc.destination);
  const bus = oc.createGain(); bus.gain.value = 0.85; bus.connect(comp);
  const noise = oc.createBuffer(1, sr, sr); const nd = noise.getChannelData(0); for (let i = 0; i < sr; i++) nd[i] = Math.random() * 2 - 1;
  const shaper = oc.createWaveShaper(); const curve = new Float32Array(1024);
  for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; curve[i] = Math.tanh(x * 2.6); }
  shaper.curve = curve; const g808 = oc.createGain(); g808.gain.value = 0.75; shaper.connect(g808).connect(bus);

  const env = (g, t, peak, dur) => { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0008, t + dur); };
  const kick = t => { const o = oc.createOscillator(), g = oc.createGain(); o.frequency.setValueAtTime(165, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.09); env(g, t, 1, 0.3); o.connect(g).connect(bus); o.start(t); o.stop(t + 0.32); };
  const snare = (t, v = 0.55) => {
    const s = oc.createBufferSource(); s.buffer = noise; const f = oc.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1900; f.Q.value = 0.8;
    const g = oc.createGain(); env(g, t, v, 0.2); s.connect(f).connect(g).connect(bus); s.start(t); s.stop(t + 0.22);
    const o = oc.createOscillator(), g2 = oc.createGain(); o.type = 'triangle'; o.frequency.value = 190; env(g2, t, v * 0.5, 0.09); o.connect(g2).connect(bus); o.start(t); o.stop(t + 0.1);
  };
  const hat = (t, v = 0.16) => {
    const s = oc.createBufferSource(); s.buffer = noise; const f = oc.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7500;
    const g = oc.createGain(); env(g, t, v, 0.035); s.connect(f).connect(g).connect(bus); s.start(t, Math.random() * 0.5); s.stop(t + 0.05);
  };
  const b808 = (t, f, dur, glide) => {
    const o = oc.createOscillator(), g = oc.createGain(); o.frequency.setValueAtTime(f, t);
    if (glide) { o.frequency.setValueAtTime(f, t + dur * 0.55); o.frequency.exponentialRampToValueAtTime(glide, t + dur * 0.75); }
    env(g, t, 0.9, dur); o.connect(g).connect(shaper); o.start(t); o.stop(t + dur + 0.02);
  };
  const lead = (t, f, dur, bell) => {
    const lp = oc.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = bell ? 5000 : 2600;
    const g = oc.createGain(); env(g, t, bell ? 0.07 : 0.06, dur); lp.connect(g).connect(bus);
    const o = oc.createOscillator(); o.type = bell ? 'sine' : 'triangle'; o.frequency.value = f; o.connect(lp); o.start(t); o.stop(t + dur + 0.02);
    if (bell) { const o2 = oc.createOscillator(), g2 = oc.createGain(); o2.frequency.value = f * 3.01; g2.gain.value = 0.35; o2.connect(g2).connect(lp); o2.start(t); o2.stop(t + dur * 0.5); }
  };

  for (let bar = 0; bar < bars; bar++) {
    const T = s => (bar * 16 + s) * step;
    if (id === 'A') {
      const kicks = bar % 2 === 0 ? [0, 10] : [0, 3, 11];
      const roots = [43.65, 43.65, 51.91, 38.89];
      kicks.forEach((s, i) => { kick(T(s)); b808(T(s), roots[bar], i === kicks.length - 1 ? 0.55 : 0.4, bar === 1 && i === kicks.length - 1 ? 58.27 : 0); });
      snare(T(8));
      for (let s = 0; s < 16; s++) {
        if (bar === 3 && s >= 12) { hat(T(s), 0.13); hat(T(s) + step / 2, 0.1); }
        else hat(T(s), s % 2 ? 0.08 : 0.15);
      }
      const arp = [349.2, 415.3, 523.3, 622.3, 523.3, 415.3, 349.2, 311.1];
      for (let k = 0; k < 8; k++) lead(T(k * 2), arp[k], step * 1.8, false);
    } else {
      const kicks = bar % 2 === 0 ? [0, 7] : [0, 11];
      const roots = [49.0, 49.0, 43.65, 38.89];
      kicks.forEach((s, i) => { kick(T(s)); b808(T(s), roots[bar], 0.6, i === 0 && bar % 2 === 0 ? 58.27 : 0); });
      snare(T(8)); if (bar % 2 === 1) snare(T(14), 0.3);
      [0, 3, 6, 8, 11, 14].forEach(s => hat(T(s), 0.15));
      if (bar === 1 || bar === 3) { hat(T(13), 0.1); hat(T(13) + step / 3, 0.09); hat(T(13) + 2 * step / 3, 0.09); }
      const mel = [[0, 587.3], [3, 466.2], [6, 440.0], [10, 392.0], [12, 466.2]];
      mel.forEach(([s, f]) => lead(T(s), bar === 3 && s === 12 ? 349.2 : f, step * 2.5, true));
    }
  }
  return oc.startRendering();
}

