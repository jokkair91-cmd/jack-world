/* ---------- Sampler : 8 pads, sons fabriqués par J-DJ + tes propres sons (mémorisés dans le navigateur) ---------- */
const TAG_VOICE_WAV = '{{JW-MORCEAU:donnees/14-sampler-8-pads-sons-fabriques-par-j-dj-t-01-wav.txt}}';   // « Jack Studio! », voix féminine (Windows, Zira), WAV 22 kHz mono
var SMP = {
  slots: SMP_DEF.map(p => ({ name: p.name || '', builtin: !!p.builtin, kind: p.kind || '', buf: null })),
  bus: null, vol: 0.8, live: new Map(), cache: {},
  el(id) { return document.getElementById(id); },
  st(t) { const e = this.el('smpSt'); if (e) e.textContent = t; },
  ensure() { ensureCtx(); if (!this.bus) { this.bus = ctx.createGain(); this.bus.gain.value = this.vol; this.bus.connect(master); } },
  setVol(v) { this.vol = v; if (this.bus) this.bus.gain.setTargetAtTime(v, ctx.currentTime, 0.02); },
  // sons intégrés : fabriqués une fois (OfflineAudioContext), puis gardés
  builtin(kind) { return this.cache[kind] || (this.cache[kind] = makeSmpSound(kind).catch(e => { delete this.cache[kind]; throw e; })); },
  async bufOf(i) { const s = this.slots[i]; if (s.buf) return s.buf; if (s.builtin) return (s.buf = await this.builtin(s.kind)); return null; },
  async play(i) {
    const s = this.slots[i]; if (!s.builtin && !s.buf) { this.st(`Pad ${i + 1} vide : clique sur « Charger » pour y mettre un son.`); return; }
    this.ensure(); const buf = await this.bufOf(i); if (!buf) return;
    const src = ctx.createBufferSource(); src.buffer = buf; src.connect(this.bus); src.start();
    if (!this.live.has(i)) this.live.set(i, new Set()); this.live.get(i).add(src);
    src.onended = () => { const set = this.live.get(i); if (set) { set.delete(src); if (!set.size) this.live.delete(i); } this.ui(); };
    this.ui();
  },
  stop(i) { const set = this.live.get(i); if (!set) return; set.forEach(s => { s.onended = null; try { s.stop(); } catch (e) {} }); this.live.delete(i); this.ui(); },
  stopAll() { [...this.live.keys()].forEach(i => this.stop(i)); this.st('Sampler arrêté.'); },
  async load(i, f) {
    try {
      const ab = await f.arrayBuffer();
      const buf = await new OfflineAudioContext(2, 1, 44100).decodeAudioData(ab.slice(0));
      if (buf.duration > 30) { this.st(`« ${f.name} » dure plus de 30 s : choisis un son plus court pour un pad.`); return; }
      this.stop(i);
      this.slots[i] = { name: f.name.replace(/\.[^.]+$/, '').slice(0, 24), builtin: false, kind: '', buf };
      smpDB.put(i, { name: this.slots[i].name, type: f.type || 'audio/wav', data: ab });
      this.ui(); this.st(`Pad ${i + 1} : « ${this.slots[i].name} » prêt (${buf.duration.toFixed(1).replace('.', ',')} s). Il sera là à la prochaine ouverture.`);
    } catch (e) { this.st(`« ${f.name} » est illisible : essaie un WAV ou un MP3.`); }
  },
  clear(i) { this.stop(i); this.slots[i] = { name: '', builtin: false, kind: '', buf: null }; smpDB.del(i); this.ui(); this.st(`Pad ${i + 1} vidé.`); },
  async restore() {
    for (let i = 0; i < this.slots.length; i++) {
      if (this.slots[i].builtin) continue;
      const rec = await smpDB.get(i); if (!rec) continue;
      try { const buf = await new OfflineAudioContext(2, 1, 44100).decodeAudioData(rec.data.slice(0)); this.slots[i] = { name: rec.name, builtin: false, kind: '', buf }; } catch (e) {}
    }
    this.ui();
  },
  ui() {
    document.querySelectorAll('[data-smp]').forEach(b => {
      const i = +b.dataset.smp, s = this.slots[i], empty = !s.builtin && !s.buf;
      b.classList.toggle('empty', empty); b.classList.toggle('live', this.live.has(i));
      b.setAttribute('aria-label', `Pad ${i + 1} : ${empty ? 'vide' : s.name}`);
      const l = document.querySelector(`[data-smpl="${i}"]`); if (l) l.textContent = empty ? 'Vide' : s.name;
      const d = document.querySelector(`[data-smpdel="${i}"]`); if (d) d.disabled = empty;
    });
  }
};
// stockage des sons personnels (IndexedDB, dans le navigateur, hors ligne)
const smpDB = {
  db: null,
  open() { return this.db || (this.db = new Promise((res, rej) => { try { const r = indexedDB.open('jdj-sampler', 1); r.onupgradeneeded = () => r.result.createObjectStore('pads'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } })); },
  async put(k, v) { try { const db = await this.open(); db.transaction('pads', 'readwrite').objectStore('pads').put(v, k); } catch (e) {} },
  async del(k) { try { const db = await this.open(); db.transaction('pads', 'readwrite').objectStore('pads').delete(k); } catch (e) {} },
  async get(k) { try { const db = await this.open(); return await new Promise(res => { const r = db.transaction('pads').objectStore('pads').get(k); r.onsuccess = () => res(r.result || null); r.onerror = () => res(null); }); } catch (e) { return null; } }
};
// fabrication des sons intégrés
async function makeSmpSound(kind) {
  const sr = 44100, dur = { horn: 2.2, siren: 3.2, riser: 4.2, impact: 3.2, tag: 3.2 }[kind];
  const oc = new OfflineAudioContext(2, Math.ceil(dur * sr), sr);
  const out = oc.createGain(); out.connect(oc.destination);
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const noiseBuf = s => { const b = oc.createBuffer(1, Math.ceil(s * sr), sr), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = rnd() * 2 - 1; return b; };
  const shaper = k => { const w = oc.createWaveShaper(), c = new Float32Array(2048); for (let i = 0; i < 2048; i++) { const x = i / 1023.5 - 1; c[i] = Math.tanh(x * k); } w.curve = c; return w; };
  if (kind === 'horn') {                                   // corne : trois coups, le dernier tenu
    const dist = shaper(4), hp = oc.createBiquadFilter(), lp = oc.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 280; lp.type = 'lowpass'; lp.frequency.value = 3600;
    dist.connect(hp).connect(lp).connect(out);
    [[0, 0.17], [0.24, 0.17], [0.48, 1.25]].forEach(([t, d]) => {
      const g = oc.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.28, t + 0.02); g.gain.setValueAtTime(0.28, t + d - 0.05); g.gain.linearRampToValueAtTime(0, t + d); g.connect(dist);
      [466, 470, 698, 932].forEach((f, k) => { const o = oc.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f * 0.94, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.06); o.connect(g); o.start(t); o.stop(t + d + 0.02); });
    });
  } else if (kind === 'siren') {                           // sirène dub
    const o = oc.createOscillator(); o.type = 'square'; o.frequency.value = 760;
    const lfo = oc.createOscillator(); lfo.type = 'triangle'; lfo.frequency.setValueAtTime(2.2, 0); lfo.frequency.linearRampToValueAtTime(6, dur);
    const lg = oc.createGain(); lg.gain.value = 360; lfo.connect(lg).connect(o.frequency);
    const lp = oc.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600; const g = oc.createGain();
    g.gain.setValueAtTime(0, 0); g.gain.linearRampToValueAtTime(0.22, 0.05); g.gain.setValueAtTime(0.22, dur - 0.4); g.gain.linearRampToValueAtTime(0, dur);
    const dl = oc.createDelay(1); dl.delayTime.value = 0.21; const fb = oc.createGain(); fb.gain.value = 0.35;
    o.connect(lp).connect(g).connect(out); g.connect(dl).connect(fb).connect(dl); dl.connect(out);
    o.start(0); lfo.start(0); o.stop(dur); lfo.stop(dur);
  } else if (kind === 'riser') {                           // montée : bruit filtré qui monte + note qui grimpe
    const n = oc.createBufferSource(); n.buffer = noiseBuf(dur); const bp = oc.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 3;
    bp.frequency.setValueAtTime(250, 0); bp.frequency.exponentialRampToValueAtTime(9000, dur - 0.15);
    const g = oc.createGain(); g.gain.setValueAtTime(0.02, 0); g.gain.exponentialRampToValueAtTime(0.7, dur - 0.2); g.gain.linearRampToValueAtTime(0, dur);
    n.connect(bp).connect(g).connect(out); n.start(0);
    const o = oc.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(110, 0); o.frequency.exponentialRampToValueAtTime(880, dur - 0.15);
    const og = oc.createGain(); og.gain.setValueAtTime(0.001, 0); og.gain.exponentialRampToValueAtTime(0.12, dur - 0.2); og.gain.linearRampToValueAtTime(0, dur);
    const lp = oc.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3000; o.connect(lp).connect(og).connect(out); o.start(0); o.stop(dur);
  } else if (kind === 'impact') {                          // impact : grosse caisse grave + souffle + réverbération
    const rv = oc.createConvolver(), ir = oc.createBuffer(2, sr * 2.6, sr);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] = (rnd() * 2 - 1) * Math.pow(1 - i / d.length, 3); }
    rv.buffer = ir; const rg = oc.createGain(); rg.gain.value = 0.25; rv.connect(rg).connect(out);
    const o = oc.createOscillator(); o.frequency.setValueAtTime(95, 0); o.frequency.exponentialRampToValueAtTime(30, 0.7);
    const g = oc.createGain(); g.gain.setValueAtTime(1, 0); g.gain.exponentialRampToValueAtTime(0.001, 2.4); o.connect(shaper(1.6)).connect(g); g.connect(out); g.connect(rv); o.start(0); o.stop(2.5);
    const n = oc.createBufferSource(); n.buffer = noiseBuf(0.6); const lp = oc.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400;
    const ng = oc.createGain(); ng.gain.setValueAtTime(0.6, 0); ng.gain.exponentialRampToValueAtTime(0.001, 0.5); n.connect(lp).connect(ng); ng.connect(out); ng.connect(rv); n.start(0);
  } else if (kind === 'tag') {                             // tag vocal « Jack Studio! » avec écho de DJ
    const bin = atob(TAG_VOICE_WAV.split(',')[1]), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    const voice = await oc.decodeAudioData(u8.buffer);
    // on retire le silence au début et à la fin
    const d0 = voice.getChannelData(0); let a = 0, b = d0.length - 1; while (a < b && Math.abs(d0[a]) < 0.01) a++; while (b > a && Math.abs(d0[b]) < 0.01) b--;
    const v = oc.createBufferSource(); v.buffer = voice;
    const hp = oc.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 130;
    const pres = oc.createBiquadFilter(); pres.type = 'peaking'; pres.frequency.value = 3200; pres.gain.value = 4;
    const dry = oc.createGain(); dry.gain.value = 1;
    const dl = oc.createDelay(1), fb = oc.createGain(), wet = oc.createGain(), dlp = oc.createBiquadFilter();
    dl.delayTime.value = 0.32; fb.gain.value = 0.38; wet.gain.value = 0.42; dlp.type = 'lowpass'; dlp.frequency.value = 2800;
    const pl = oc.createStereoPanner(), pr = oc.createStereoPanner(); pl.pan.value = -0.55; pr.pan.value = 0.55; const dl2 = oc.createDelay(1); dl2.delayTime.value = 0.16;
    v.connect(hp).connect(pres).connect(dry).connect(out);
    pres.connect(dl); dl.connect(dlp).connect(fb).connect(dl); dlp.connect(wet); wet.connect(pl).connect(out); wet.connect(dl2).connect(pr).connect(out);
    v.start(0.02, a / voice.sampleRate, (b - a) / voice.sampleRate + 0.05);
  }
  const buf = await oc.startRendering();
  // normalisation à −1 dBFS
  let pk = 0; for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < d.length; i++) pk = Math.max(pk, Math.abs(d[i])); }
  if (pk > 0) { const k = 0.89 / pk; for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] *= k; } }
  return buf;
}
// commandes du sampler
(function wireSampler() {
  document.querySelectorAll('[data-smp]').forEach(b => {
    const i = +b.dataset.smp; let timer = 0, long = false;
    b.addEventListener('pointerdown', () => { long = false; timer = setTimeout(() => { long = true; SMP.stop(i); }, 500); });
    const cancel = () => clearTimeout(timer);
    b.addEventListener('pointerup', cancel); b.addEventListener('pointerleave', cancel); b.addEventListener('pointercancel', cancel);
    b.addEventListener('contextmenu', e => e.preventDefault());
    b.addEventListener('click', () => { if (long) { long = false; return; } SMP.play(i); });
  });
  document.querySelectorAll('[data-smpfile]').forEach(inp => inp.addEventListener('change', e => { const f = e.target.files[0]; e.target.value = ''; if (f) SMP.load(+inp.dataset.smpfile, f); }));
  document.querySelectorAll('[data-smpdel]').forEach(b => b.addEventListener('click', () => SMP.clear(+b.dataset.smpdel)));
  document.getElementById('smpStop').addEventListener('click', () => SMP.stopAll());
  control(document.querySelector('[data-p="smpvol"]'), v => SMP.setVol(v), 'smpvol');
  SMP.ui(); SMP.restore();
  // préparation des sons intégrés en arrière-plan, après les démos
  setTimeout(async () => { for (const s of SMP_DEF) if (s.builtin) { try { await SMP.builtin(s.kind); } catch (e) {} } }, 6000);
})();
// onglets du mixeur : Mixer / Sampler / Sorties
function setMixTab(tab) {
  const mix = document.querySelector('.mixer');
  mix.classList.toggle('tab-smp', tab === 'smp');
  document.querySelector('.outs').open = tab === 'outs';
  document.querySelectorAll('.mtab').forEach(t => { const on = t.dataset.mtab === tab; t.classList.toggle('on', on); t.setAttribute('aria-selected', String(on)); });
}

