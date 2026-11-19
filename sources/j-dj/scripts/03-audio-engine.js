/* ---------- Audio engine ---------- */
let ctx = null, master = null, masterAn = null, mBuf = null, recTap = null, irBuf = null;
let recording = false, pcm = [], recFrames = 0;
const mix = { xf: 0, master: 0.75 };

function makeIR() {
  const sr = ctx.sampleRate, len = Math.floor(sr * 2.4), b = ctx.createBuffer(2, len, sr);
  for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
  return b;
}

class Deck {
  constructor(id) {
    this.id = id;
    this.el = document.querySelector(`.deck[data-deck="${id}"]`);
    this.r = n => this.el.querySelector(`[data-r="${n}"]`);
    this.disc = this.el.querySelector('.disc');
    this.pads = [...this.el.querySelectorAll('[data-pad]')];
    this.fxBtns = [...this.el.querySelectorAll('[data-fx]')];
    this.buffer = null; this.name = ''; this.bpm = null; this.beat0 = null; this.gridSrc = null; this.repeat = false; this.msgTimer = 0;
    this.tempo = 0; this.nudge = 1; this.playing = false; this.offset = 0; this.startTime = 0;
    this.source = null; this.cue = 0; this.loop = null; this.loading = false;
    this.hot = [null, null, null, null];
    this.downbeat = null; this.taps = [];
    this.loopBeats = 4; this.roll = null; this.keyLock = false;
    this.fxOn = Object.fromEntries(FX_ORDER.map(k => [k, false])); this.fxAmt = Object.fromEntries(FX_ORDER.map(k => [k, 0.5]));
    this.scratchMode = false; this.scratching = false; this.scratchPos = 0; this.scratchTarget = 0; this.scratchV = 0; this.wasPlaying = false;
    this.p = { trim: 0, high: 0, mid: 0, low: 0, filter: 0, fader: 0.8 };
    this.n = null; this.meter = -60; this.offDim = null; this.offLit = null;
    this.vuEls = null; this.lastTime = ''; this.lastRemain = '';
  }
  get rate() { return (1 + this.tempo) * this.nudge; }
  get duration() { return this.buffer ? this.buffer.duration : 0; }

  build() {
    const c = ctx, n = {}, G = v => { const g = c.createGain(); g.gain.value = v; return g; };
    n.in = G(1);
    n.low = c.createBiquadFilter(); n.low.type = 'lowshelf'; n.low.frequency.value = 220;
    n.mid = c.createBiquadFilter(); n.mid.type = 'peaking'; n.mid.frequency.value = 1000; n.mid.Q.value = 0.8;
    n.high = c.createBiquadFilter(); n.high.type = 'highshelf'; n.high.frequency.value = 3800;
    n.hp = c.createBiquadFilter(); n.hp.type = 'highpass'; n.hp.frequency.value = 20; n.hp.Q.value = 0.7;
    n.lp = c.createBiquadFilter(); n.lp.type = 'lowpass'; n.lp.frequency.value = 20000; n.lp.Q.value = 0.7;
    n.fader = G(0.64); n.xf = G(1);
    n.an = c.createAnalyser(); n.an.fftSize = 1024;
    n.in.connect(n.low).connect(n.mid).connect(n.high).connect(n.hp).connect(n.lp);
    // n.pre = signal de la platine avant le fader de volume (sert aussi à la préécoute casque)
    n.pre = G(1); n.cue = G(0);
    n.pre.connect(n.fader);
    n.pre.connect(n.cue).connect(cueBus);
    n.fader.connect(n.xf).connect(master);
    n.fader.connect(n.an);
    // effets en série, dans l'ordre FX_ORDER ; chacun a son propre dosage (mélange direct / effet)
    n.fx = {};
    const unit = (name, build) => { const u = { in: G(1), out: G(1), dry: G(1), wet: G(0) }; u.in.connect(u.dry).connect(u.out); const fxOut = build(u.in); fxOut.connect(u.wet).connect(u.out); n.fx[name] = u; return u; };
    const fxBuild = {
      filtre: i => { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 6; f.frequency.value = 1300; n.afLfo = c.createOscillator(); n.afLfo.frequency.value = 0.5; const d = G(1100); n.afLfo.connect(d).connect(f.frequency); n.afLfo.start(); i.connect(f); return f; },
      gate: i => { const g = G(0.5); n.gtLfo = c.createOscillator(); n.gtLfo.type = 'square'; n.gtLfo.frequency.value = 4; const sm = c.createBiquadFilter(); sm.type = 'lowpass'; sm.frequency.value = 180; const d = G(0.5); n.gtLfo.connect(sm).connect(d).connect(g.gain); n.gtLfo.start(); i.connect(g); return g; },
      crush: i => { const w = c.createWaveShaper(), N = 4096, steps = 24, cv = new Float32Array(N); for (let k = 0; k < N; k++) { const x = k / (N - 1) * 2 - 1; cv[k] = Math.round(x * steps) / steps; } w.curve = cv; const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 7000; i.connect(w).connect(lp); return lp; },
      flanger: i => { const fd = c.createDelay(0.05); fd.delayTime.value = 0.004; const fb = G(0.6); n.lfo = c.createOscillator(); n.lfo.frequency.value = 0.22; const lg = G(0.0028); n.lfo.connect(lg).connect(fd.delayTime); n.lfo.start(); i.connect(fd); fd.connect(fb).connect(fd); return fd; },
      echo: i => { n.dl = c.createDelay(4); const fb = G(0.45), fbf = c.createBiquadFilter(); fbf.type = 'lowpass'; fbf.frequency.value = 3200; i.connect(n.dl); n.dl.connect(fbf).connect(fb).connect(n.dl); return n.dl; },
      reverb: i => { const cv = c.createConvolver(); cv.buffer = irBuf; i.connect(cv); return cv; }
    };
    let prev = n.lp;
    FX_ORDER.forEach(name => { const u = unit(name, fxBuild[name]); prev.connect(u.in); prev = u.out; });
    prev.connect(n.pre);
    // scratch engine
    n.sp = c.createScriptProcessor(1024, 1, 2);
    n.sp.onaudioprocess = e => this.scratchProcess(e);
    n.sp.connect(n.in);
    this.n = n; this.buf = new Float32Array(n.an.fftSize);
    Object.keys(this.p).forEach(k => this.apply(k));
    this.applyFx(); this.updateEcho();
  }
  set(k, v) { this.p[k] = v; this.apply(k); }
  apply(k) {
    if (!this.n) return;
    const n = this.n, t = ctx.currentTime, v = this.p[k];
    const db = x => x < 0 ? x * 40 : x * 6;
    if (k === 'trim') n.in.gain.setTargetAtTime(Math.pow(10, v * 12 / 20), t, 0.02);
    else if (k === 'high') n.high.gain.setTargetAtTime(db(v), t, 0.02);
    else if (k === 'mid') n.mid.gain.setTargetAtTime(db(v), t, 0.02);
    else if (k === 'low') n.low.gain.setTargetAtTime(db(v), t, 0.02);
    else if (k === 'fader') n.fader.gain.setTargetAtTime(v * v, t, 0.02);
    else if (k === 'filter') {
      let lp = 20000, hp = 20; const on = Math.abs(v) > 0.03;
      if (v < -0.03) lp = 20000 * Math.pow(120 / 20000, (-v - 0.03) / 0.97);
      else if (v > 0.03) hp = 20 * Math.pow(9000 / 20, (v - 0.03) / 0.97);
      n.lp.frequency.setTargetAtTime(lp, t, 0.03); n.hp.frequency.setTargetAtTime(hp, t, 0.03);
      n.lp.Q.setTargetAtTime(on ? 2.2 : 0.7, t, 0.05); n.hp.Q.setTargetAtTime(on ? 2.2 : 0.7, t, 0.05);
    }
  }
  /* effects */
  toggleFx(name) { this.fxOn[name] = !this.fxOn[name]; this.applyFx(); this.ui(); }
  applyFx() {
    if (!this.n) return;
    const t = ctx.currentTime;
    for (const name of FX_ORDER) {
      const u = this.n.fx[name], on = this.fxOn[name], a = this.fxAmt[name];
      // effets « d'insertion » (filtre, gate, bitcrusher) : remplacement progressif ; effets d'espace : ajout
      const dry = !on ? 1 : (FX_INSERT.includes(name) ? 1 - a : 1 - a * 0.35);
      u.wet.gain.setTargetAtTime(on ? a : 0, t, 0.02);
      u.dry.gain.setTargetAtTime(dry, t, 0.02);
    }
  }
  setFxAmt(name, v) { this.fxAmt[name] = v; this.applyFx(); }
  updateEcho() {
    if (!this.n) return;
    const bps = ((this.bpm || 120) * (1 + this.tempo)) / 60, beat = 1 / bps, t = ctx.currentTime;
    this.n.dl.delayTime.setTargetAtTime(clamp(beat * 0.75, 0.05, 3.9), t, 0.05);
    this.n.gtLfo.frequency.setTargetAtTime(bps * 2, t, 0.05);       // gate en croches
    this.n.afLfo.frequency.setTargetAtTime(bps / 4, t, 0.05);       // filtre auto : un balayage par mesure
  }

  /* scratch */
  scratchProcess(e) {
    const o0 = e.outputBuffer.getChannelData(0), o1 = e.outputBuffer.getChannelData(1);
    if (!this.scratching || !this.buffer) { o0.fill(0); o1.fill(0); return; }
    const b = this.buffer, c0 = b.getChannelData(0), c1 = b.numberOfChannels > 1 ? b.getChannelData(1) : c0;
    const bsr = b.sampleRate, sr = ctx.sampleRate, last = b.length - 2, dur = this.duration, tgt = this.scratchTarget;
    let p = this.scratchPos, v = this.scratchV;
    for (let i = 0; i < o0.length; i++) {
      const want = clamp((tgt - p) * 25, -6, 6);
      v += (want - v) * 0.02;
      p += v / sr;
      if (p < 0) { p = 0; v = 0; } else if (p > dur) { p = dur; v = 0; }
      let i0 = Math.floor(p * bsr); if (i0 > last) i0 = last;
      const f = p * bsr - i0;
      o0[i] = c0[i0] + (c0[i0 + 1] - c0[i0]) * f;
      o1[i] = c1[i0] + (c1[i0 + 1] - c1[i0]) * f;
    }
    this.scratchPos = p; this.scratchV = v;
  }
  scratchStart() {
    ensureCtx();
    if (this.scratching) return;
    if (this.roll) this.rollEnd();
    this.wasPlaying = this.playing;
    const p = this.position();
    this.stop();
    this.offset = p; this.scratchPos = p; this.scratchTarget = p; this.scratchV = 0;
    this.scratching = true;
    if (this.n.scr) {
      // moteur AudioWorklet : on transmet une fenêtre de ±20 s autour de la position
      const b = this.buffer, bsr = b.sampleRate, i0 = Math.max(0, Math.floor((p - 20) * bsr)), i1 = Math.min(b.length, Math.ceil((p + 20) * bsr));
      const c0 = b.getChannelData(0).slice(i0, i1), c1 = b.numberOfChannels > 1 ? b.getChannelData(1).slice(i0, i1) : c0;
      this.n.scr.port.postMessage({ type: 'start', c0, c1, w0: i0 / bsr, bsr, pos: p }, c1 === c0 ? [c0.buffer] : [c0.buffer, c1.buffer]);
    }
    if (this.keyLock) this.say('Key Lock suspendu pendant le scratch (la hauteur suit le geste).');
    this.ui();
  }
  scratchMove(da) {
    this.scratchTarget = clamp(this.scratchTarget + da / 360 * 1.8, 0, this.duration);
    if (this.n.scr) this.n.scr.port.postMessage({ type: 'target', t: this.scratchTarget });
  }
  scratchEnd() {
    if (!this.scratching) return Promise.resolve();
    const finish = () => {
      this.scratching = false;
      this.offset = clamp(this.scratchPos, 0, this.duration - 0.001);
      if (this.loop && (this.offset < this.loop.start || this.offset >= this.loop.end)) this.loop = null;
      if (this.wasPlaying) this.play(); else this.ui();
    };
    if (!this.n.scr) { finish(); return Promise.resolve(); }
    // on attend la position exacte renvoyée par le moteur (repli après 150 ms)
    return new Promise(res => {
      const port = this.n.scr.port; let done = false;
      const end = () => { if (done) return; done = true; port.removeEventListener('message', onMsg); finish(); res(); };
      const onMsg = e => { if (e.data.type === 'end') { this.scratchPos = e.data.pos; end(); } };
      port.addEventListener('message', onMsg);
      port.postMessage({ type: 'end' });
      setTimeout(end, 150);
    });
  }
  /* ----- Key Lock : correcteur de hauteur (AudioWorklet) après la source ----- */
  setKeyLock(on) {
    this.keyLock = !!on && !!(this.n && this.n.kl); this.wantKeyLock = this.keyLock;
    this.applyKeyLock(); this.ui(); STORE.schedule();
  }
  applyKeyLock() {
    if (!this.n || !this.n.kl) return;
    const r = this.keyLock ? 1 / (1 + this.tempo) : 1;
    this.n.kl.parameters.get('ratio').setValueAtTime(r, ctx.currentTime);
  }
  upgradeWorklet() {
    const n = this.n;
    n.scr = new AudioWorkletNode(ctx, 'jdj-scratch', { numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [2] });
    n.scr.port.onmessage = e => { if (e.data.type === 'pos' && this.scratching) this.scratchPos = e.data.pos; };
    n.scr.connect(n.in);
    n.sp.onaudioprocess = null; n.sp.disconnect();
    n.kl = new AudioWorkletNode(ctx, 'jdj-pitch', { numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [2] });
    n.kl.connect(n.in);
    if (this.wantKeyLock) this.keyLock = true;
    this.applyKeyLock(); this.ui();
  }

  position() {
    if (!this.buffer) return 0;
    if (this.scratching) return this.scratchPos;
    if (!this.playing) return this.offset;
    let p = this.offset + (ctx.currentTime - this.startTime) * this.rate;
    if (this.loop) { const { start, end } = this.loop; if (p >= end) p = start + ((p - start) % (end - start)); }
    else if (this.repeat) p = p % this.duration;
    return Math.min(p, this.duration);
  }
  play() {
    if (!this.buffer || this.playing || this.scratching) return;
    ensureCtx();
    const s = ctx.createBufferSource();
    s.buffer = this.buffer; s.playbackRate.value = this.rate;
    if (this.loop) { s.loop = true; s.loopStart = this.loop.start; s.loopEnd = this.loop.end; }
    else if (this.repeat) { s.loop = true; s.loopStart = 0; s.loopEnd = this.duration; }
    if (!s.loop && this.offset >= this.duration - 0.02) this.offset = 0;
    if (typeof MT !== 'undefined' && (MT.playing || MT.loading.size)) MT.stop();   // une platine qui démarre coupe la lecture du montage
    s.connect(this.n.kl || this.n.in);
    s.start(0, this.offset);
    this.startTime = ctx.currentTime; this.source = s; this.playing = true;
    s.onended = () => { if (this.source === s) { this.source = null; this.playing = false; this.offset = 0; this.ui(); } };
    if (this.libKey) PL.markPlayed(this.libKey);
    this.ui();
  }
  stop() {
    const s = this.source; this.source = null; this.playing = false;
    if (s) { s.onended = null; try { s.stop(); } catch (e) {} s.disconnect(); }
  }
  pause() { if (!this.playing) return; this.offset = this.position(); this.stop(); this.ui(); }
  seek(t) {
    if (!this.buffer || this.scratching) return;
    if (this.roll) { this.loop = this.roll.loop; this.roll = null; }
    const d = this.duration;
    t = this.repeat ? ((t % d) + d) % d : clamp(t, 0, d - 0.001);
    if (this.loop && (t < this.loop.start || t >= this.loop.end)) this.loop = null;
    const was = this.playing;
    if (was) this.stop();
    this.offset = t;
    if (was) this.play(); else this.ui();
  }
  rebase() {
    if (this.roll) { this.roll.offset = this.shadowPos(); this.roll.start = ctx.currentTime; }
    if (this.playing) { this.offset = this.position(); this.startTime = ctx.currentTime; }
  }
  applyRate() { if (this.source) this.source.playbackRate.setValueAtTime(this.rate, ctx.currentTime); }
  setTempo(v) { this.rebase(); this.tempo = v; this.applyRate(); this.applyKeyLock(); this.updateEcho(); this.ui(); }
  setNudge(f) { if (f === this.nudge) return; this.rebase(); this.nudge = f; this.applyRate(); }
  /* ----- boucles : tailles en temps, calées sur la grille quand elle est exploitable ----- */
  get beatLen() { return 60 / (this.bpm || 120); }
  makeLoopAt(pos, beats) {
    const len = Math.min(beats * this.beatLen, this.duration), unit = this.beatLen * Math.min(1, beats);
    const snap = t => this.gridOk ? this.anchor + Math.floor((t - this.anchor) / unit + 1e-6) * unit : t;
    let start = snap(pos);
    if (start + len > this.duration) {           // près de la fin : la boucle recule pour tenir dans le morceau
      start = this.duration - len;
      if (this.gridOk) { const s2 = snap(start); start = s2 + len <= this.duration + 1e-6 ? s2 : s2 - unit; }
    }
    start = Math.max(0, start);
    return { start, end: Math.min(this.duration, start + len), beats };
  }
  applyLoop(loop) {
    const pos = this.position();
    this.loop = loop;
    let p = pos;
    if (loop && p >= loop.end) p = loop.start + ((p - loop.start) % (loop.end - loop.start));
    if (this.playing) { this.stop(); this.offset = p; this.play(); } else { this.offset = p; this.ui(); }
  }
  toggleLoop() {
    if (!this.buffer || this.scratching || this.roll) return;
    if (this.loop) { this.applyLoop(null); return; }
    const l = this.makeLoopAt(this.position(), this.loopBeats);
    if (l.end - l.start < 0.02) return;
    this.applyLoop(l);
  }
  setLoopSize(beats) {
    if (!this.buffer || this.scratching || this.roll) return;
    this.loopBeats = clamp(beats, 0.5, 16); STORE.schedule();
    if (this.loop) {
      // redimensionne depuis le début de la boucle en cours
      let start = this.loop.start, len = Math.min(this.loopBeats * this.beatLen, this.duration);
      if (start + len > this.duration) start = Math.max(0, this.duration - len);
      this.applyLoop({ start, end: start + len, beats: this.loopBeats });
    } else this.applyLoop(this.makeLoopAt(this.position(), this.loopBeats));
  }
  /* ----- Loop Roll : à la fin, reprise là où le morceau serait arrivé sans le Roll ----- */
  shadowPos() {
    const r = this.roll; let p = r.offset + (ctx.currentTime - r.start) * this.rate;
    if (r.loop) { const { start, end } = r.loop; if (p >= end) p = start + ((p - start) % (end - start)); }
    else if (this.repeat) p = p % this.duration;
    return Math.min(p, this.duration);
  }
  rollStart(beats) {
    if (!this.buffer || !this.playing || this.scratching) return;
    if (this.roll) this.rollEnd();
    const pos = this.position();
    this.roll = { offset: pos, start: ctx.currentTime, loop: this.loop, beats };
    const l = this.makeLoopAt(pos, beats);
    this.loop = l; this.stop(); this.offset = clamp(pos, l.start, l.end - 0.001); this.play();
  }
  rollEnd() {
    if (!this.roll) return;
    const p = this.shadowPos(), prev = this.roll.loop;
    this.roll = null; this.loop = prev;
    if (this.playing && !prev && !this.repeat && p >= this.duration - 0.02) { this.stop(); this.offset = 0; this.ui(); return; } // le morceau serait fini
    if (this.playing) { this.stop(); this.offset = clamp(p, 0, this.duration - 0.001); this.play(); }
    else { this.offset = p; this.ui(); }
  }
  cuePress() {
    if (!this.buffer || this.scratching) return;
    if (this.playing) { this.stop(); this.offset = this.cue; }
    else {
      this.cue = this.offset; this.saveTrack();
      const b = this.r('cue'); b.classList.add('flash'); setTimeout(() => b.classList.remove('flash'), 160);
    }
    this.ui();
  }
  hotPress(i) {
    if (!this.buffer || this.scratching) return;
    if (this.hot[i] === null) { this.hot[i] = this.position(); this.saveTrack(); }
    else { this.seek(this.hot[i]); if (!this.playing) this.play(); }
    this.ui();
  }
  hotClear(i) { this.hot[i] = null; this.saveTrack(); this.ui(); }
  saveTrack() { if (this.trackId) STORE.saveTrack(this); }
  /* BPM de référence : change l'affichage, l'écho et le futur calage, jamais la vitesse de lecture */
  setRefBpm(v) {
    if (!this.buffer || !isFinite(v)) { this.ui(); return; }
    this.bpm = Math.round(clamp(v, 40, 250) * 10) / 10; this.bpmManual = true;
    this.updateEcho(); this.saveTrack(); this.ui();
  }
  tap() {
    if (!this.buffer) return;
    const now = performance.now();
    if (this.taps.length && now - this.taps[this.taps.length - 1] > 2000) this.taps = [];
    this.taps.push(now); if (this.taps.length > 8) this.taps.shift();
    if (this.taps.length >= 2) {
      const avg = (this.taps[this.taps.length - 1] - this.taps[0]) / (this.taps.length - 1);
      // on tape le tempo entendu : on retire l'effet du fader de tempo pour obtenir le BPM du morceau
      this.setRefBpm(60000 / avg / (1 + this.tempo));
    }
  }
  setDownbeat() {
    if (!this.buffer) return;
    this.downbeat = clamp(this.position(), 0, this.duration);
    this.saveTrack(); this.ui();
  }
  /* ----- grille : le repère manuel est prioritaire sur le battement détecté ----- */
  get anchor() { return this.downbeat !== null ? this.downbeat : this.beat0; }
  get barKnown() { return this.downbeat !== null || this.gridSrc === 'demo'; }
  get gridOk() { return !!(this.buffer && this.bpm && this.anchor !== null && (this.downbeat !== null || this.gridSrc === 'auto' || this.gridSrc === 'demo')); }
  gridText() {
    if (!this.buffer) return 'Grille : —';
    if (this.downbeat !== null) return 'Grille manuelle · premier temps ' + fmtPrecise(this.downbeat);
    if (this.gridSrc === 'demo') return 'Grille de la démo · premier temps 0:00,00';
    if (this.gridSrc === 'auto') return 'Grille automatique · temps détecté ' + fmtPrecise(this.beat0) + ' (pas forcément le 1er temps)';
    if (this.gridSrc === 'incertain') return 'Grille incertaine · SYNC cale seulement le tempo';
    return 'Grille : aucune';
  }
  beatsAt(pos) { return (pos - this.anchor) / (60 / this.bpm); }
  say(t) {
    const m = this.r('msg'); m.textContent = t;
    clearTimeout(this.msgTimer); this.msgTimer = setTimeout(() => { m.textContent = ''; }, 9000);
  }
  sync(other) {
    if (!this.buffer || !other.buffer) { this.say('Synchro : charge un son sur les deux platines'); return; }
    if (!this.bpm || !other.bpm) { this.say('Synchro : BPM inconnu, saisis-le ou utilise Tap tempo'); return; }
    const target = other.bpm * (1 + other.tempo);
    const pct = t => (t >= 0 ? '+' : '−') + Math.abs(t * 100).toFixed(1).replace('.', ',') + ' %';
    let m = 0, t = 0;
    for (const f of [1, 2, 0.5]) { const v = target * f / this.bpm - 1; if (Math.abs(v) <= 0.16 + 1e-9) { m = f; t = v; break; } }
    if (!m) { this.say(`Synchro : écart de ${pct(target / this.bpm - 1)}, hors de la plage ±16 %. Tempo non modifié.`); return; }
    this.tempoCtl.set(t);
    const tempoTxt = `tempo calé à ${pct(t)}` + (m !== 1 ? (m === 2 ? ' (double tempo)' : ' (demi-tempo)') : '');
    if (!(this.playing && other.playing)) { this.say(`Synchro : ${tempoTxt}. Les temps s'alignent quand les deux platines jouent.`); return; }
    if (!this.gridOk || !other.gridOk) { this.say(`Synchro : ${tempoTxt}. Grille ${!this.gridOk ? 'de cette platine' : 'de l’autre platine'} incertaine : temps non alignés.`); return; }
    const useBar = m === 1 && this.barKnown && other.barKnown, unit = useBar ? 4 : 1;
    const mod = (x, u) => ((x % u) + u) % u;
    const bX = this.beatsAt(this.position()), bY = other.beatsAt(other.position());
    let targets;
    if (m === 1) targets = [mod(bY, unit)];
    else if (m === 2) targets = [mod(bY * 2, 1)];
    else targets = [mod(bY / 2, 1), mod(bY / 2 + 0.5, 1)];
    let best = null;
    for (const tg of targets) { let dlt = tg - mod(bX, unit); if (dlt > unit / 2) dlt -= unit; if (dlt <= -unit / 2) dlt += unit; if (best === null || Math.abs(dlt) < Math.abs(best)) best = dlt; }
    this.seek(this.position() + best * 60 / this.bpm);
    this.say(`Synchro : ${tempoTxt}, ${useBar ? 'mesures alignées' : 'temps alignés'}.`);
  }
  load(buffer, name, info) {
    this.stop(); this.scratching = false;
    Object.assign(this, { buffer, name, bpm: info.bpm || null, beat0: info.beat0 !== undefined ? info.beat0 : null, gridSrc: info.gridSrc || null, repeat: !!info.repeat,
      trackId: info.id || null, bpmManual: false, artist: info.artist || '', cover: '', genre: '',
      offset: 0, cue: 0, loop: null, roll: null, loading: false, hot: [null, null, null, null], downbeat: null, taps: [] });
    this.r('msg').textContent = '';
    this.buildFinePeaks();
    this.updateEcho(); this.renderWave(); this.ui();
  }
  ui() {
    const has = !!this.buffer;
    ['cue', 'play', 'sync', 'loop', 'bpmin', 'tap', 'downbeat'].forEach(k => this.r(k).disabled = !has);
    const bin = this.r('bpmin');
    if (document.activeElement !== bin) bin.value = has && this.bpm ? this.bpm.toFixed(1) : '';
    this.r('dbval').textContent = this.gridText();
    const on = this.playing || (this.scratching && this.wasPlaying);
    const pb = this.r('play');
    pb.setAttribute('aria-pressed', on); pb.textContent = on ? 'Pause' : 'Lecture';
    const kb = this.r('keylock'), klOk = !!(this.n && this.n.kl);
    kb.disabled = !klOk; kb.setAttribute('aria-pressed', String(this.keyLock));
    kb.textContent = this.keyLock ? (this.scratching ? 'Tonalité gardée (suspendu : scratch)' : 'Tonalité gardée') : 'Garder la tonalité';
    if (this.n && !klOk && workletState === 'repli') kb.title = 'Key Lock indisponible : moteur AudioWorklet absent dans ce navigateur';
    const lp = this.loop && !this.roll;
    this.r('loop').setAttribute('aria-pressed', !!lp);
    this.r('loop').textContent = 'Boucle ' + beatLbl(lp && this.loop.beats ? this.loop.beats : this.loopBeats);
    this.el.querySelectorAll('[data-lsize]').forEach(b => { b.disabled = !has; b.setAttribute('aria-pressed', String(+b.dataset.lsize === this.loopBeats && !!lp)); });
    this.r('lhalf').disabled = !has || this.loopBeats <= 0.5; this.r('ldbl').disabled = !has || this.loopBeats >= 16;
    this.el.querySelectorAll('[data-roll]').forEach(b => { b.disabled = !has; });
    this.r('scratch').setAttribute('aria-pressed', this.scratchMode);
    this.el.classList.toggle('playing', on);
    this.el.classList.toggle('scratch', this.scratchMode);
    this.pads.forEach((p, i) => {
      p.disabled = !has; const set = this.hot[i] !== null;
      p.classList.toggle('set', set);
      p.setAttribute('aria-label', `Repère rapide ${i + 1}, ${set ? 'placé à ' + fmt(this.hot[i]) : 'vide'}`);
    });
    this.fxBtns.forEach(b => b.setAttribute('aria-pressed', String(!!this.fxOn[b.dataset.fx])));
    if (!this.loading) this.r('name').textContent = has ? this.name : 'Aucun son chargé';
    this.r('artist').textContent = has ? (this.artist || 'Artiste inconnu') : '';
    this.r('bpmTxt').textContent = this.bpm ? this.bpm.toFixed(1) + ' BPM' : '— BPM';
    this.r('durTxt').textContent = has ? fmt(this.duration) : '';
    const cov = this.r('cover'), cu = has && this.cover ? this.cover : '';
    if (cov.dataset.src !== cu) { cov.dataset.src = cu; cov.style.backgroundImage = cu ? `url("${cu}")` : ''; cov.classList.toggle('nocover', !cu); }
    if (!has) this.r('remainBig').textContent = '—:—';
    this.r('artist').textContent = has ? (this.artist || '') : '';
    this.r('bpmTxt').textContent = this.bpm ? (this.bpm * (1 + this.tempo)).toFixed(1) + ' BPM' : '— BPM';
    this.r('durTxt').textContent = has ? fmt(this.duration) : '';
    const cv = this.r('cover'), want = has && this.cover ? this.cover : '';
    if (cv.dataset.src !== want) { cv.dataset.src = want; cv.style.backgroundImage = want ? `url("${want}")` : ''; cv.classList.toggle('nocover', !want); }
    if (!has) this.r('remainBig').textContent = '—:—';
    const gb = this.r('gbadge'), gg = has ? (this.genre || '') : '';
    if (gb.dataset.g !== gg) { gb.dataset.g = gg; gb.title = gg ? genreLabel(gg) : ''; }
    const stEl = this.r('state');
    stEl.textContent = this.loading ? 'Chargement…' : !has ? 'Vide' : this.scratching ? 'Scratch' : this.playing ? 'En lecture' : 'En attente';
    stEl.classList.toggle('live', !!this.playing);
    const nfx = FX_ORDER.filter(k => this.fxOn[k]).length; this.r('fxsum').textContent = nfx ? `· ${nfx} actif${nfx > 1 ? 's' : ''}` : '';
    if (typeof PL !== 'undefined' && PL.items) PL.sync();
    this.r('bpm').textContent = this.bpm ? (this.bpm * (1 + this.tempo)).toFixed(1).replace('.', ',') : '—';
    const pct = this.tempo * 100;
    this.r('tval').textContent = (pct > 0.05 ? '+' : '') + pct.toFixed(1).replace('.', ',') + ' %';
  }

  /* waveform */
  renderWave() {
    const cv = this.r('wave'), dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(cv.clientWidth * dpr)), h = Math.max(1, Math.round(cv.clientHeight * dpr));
    cv.width = w; cv.height = h; this.dpr = dpr;
    const cs = getComputedStyle(this.el);
    this.col = cs.getPropertyValue('--c').trim();
    this.dim = cs.getPropertyValue('--ink-dim').trim();
    this.ink = cs.getPropertyValue('--ink').trim();
    this.red = cs.getPropertyValue('--red').trim();
    if (!this.buffer) { this.offDim = this.offLit = null; return; }
    const step = 2 * dpr, cols = Math.max(1, Math.floor(w / step));
    const chans = []; for (let c = 0; c < Math.min(2, this.buffer.numberOfChannels); c++) chans.push(this.buffer.getChannelData(c));
    const len = chans[0].length, per = len / cols, stride = Math.max(1, Math.floor(per / 200));
    const peaks = new Float32Array(cols); let top = 0.0001;
    for (let i = 0; i < cols; i++) {
      let m = 0; const a = Math.floor(i * per), b = Math.min(len, Math.floor((i + 1) * per));
      for (const ch of chans) for (let j = a; j < b; j += stride) { const v = Math.abs(ch[j]); if (v > m) m = v; }
      peaks[i] = m; if (m > top) top = m;
    }
    const make = (color, alpha) => {
      const o = document.createElement('canvas'); o.width = w; o.height = h;
      const g = o.getContext('2d'); g.fillStyle = color; g.globalAlpha = alpha;
      for (let i = 0; i < cols; i++) { const bh = Math.max(dpr, peaks[i] / top * h * 0.86); g.fillRect(i * step, (h - bh) / 2, step * 0.7, bh); }
      return o;
    };
    this.offDim = make(this.dim, 0.5); this.offLit = make(this.col, 1);
  }
  drawWave(pos) {
    const cv = this.r('wave'), g = cv.getContext('2d'), w = cv.width, h = cv.height, dpr = this.dpr || 1;
    g.clearRect(0, 0, w, h);
    if (!this.offDim) {
      g.fillStyle = this.dim || '#888'; g.font = `500 ${12 * dpr}px "Chakra Petch", sans-serif`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(this.loading ? 'Chargement…' : 'Charge un son ou lance la démo', w / 2, h / 2);
      return;
    }
    const d = this.duration, x = pos / d * w;
    g.drawImage(this.offDim, 0, 0);
    g.save(); g.beginPath(); g.rect(0, 0, x, h); g.clip(); g.drawImage(this.offLit, 0, 0); g.restore();
    if (this.loop) { g.fillStyle = this.col; g.globalAlpha = 0.22; g.fillRect(this.loop.start / d * w, 0, (this.loop.end - this.loop.start) / d * w, h); g.globalAlpha = 1; }
    this.hot.forEach((t, i) => { if (t === null) return; g.fillStyle = PADS[i]; g.fillRect(t / d * w - dpr, h - 8 * dpr, 3 * dpr, 8 * dpr); });
    if (this.downbeat !== null) {
      // repère du premier temps : trait cerné + triangle en bas
      const bx = this.downbeat / d * w;
      g.fillStyle = this.ink; g.fillRect(bx - 2 * dpr, 0, 4 * dpr, h);
      g.fillStyle = this.col; g.fillRect(bx - dpr, 0, 2 * dpr, h);
      g.fillStyle = this.ink; g.beginPath(); g.moveTo(bx - 6 * dpr, h); g.lineTo(bx + 6 * dpr, h); g.lineTo(bx, h - 9 * dpr); g.closePath(); g.fill();
    }
    const cx = this.cue / d * w; g.fillStyle = this.red;
    g.beginPath(); g.moveTo(cx - 5 * dpr, 0); g.lineTo(cx + 5 * dpr, 0); g.lineTo(cx, 7 * dpr); g.closePath(); g.fill();
    g.fillStyle = this.ink; g.fillRect(x - dpr, 0, 2 * dpr, h);
  }

  /* ----- vue rapprochée : crêtes fines (2,5 ms) calculées une fois au chargement ----- */
  buildFinePeaks() {
    if (!this.buffer) { this.fine = null; return; }
    const b = this.buffer, res = 400, per = b.sampleRate / res, n = Math.ceil(b.length / per);
    const c0 = b.getChannelData(0), c1 = b.numberOfChannels > 1 ? b.getChannelData(1) : c0;
    const pk = new Float32Array(n); let top = 1e-4;
    for (let i = 0; i < n; i++) {
      let m = 0; const a = Math.floor(i * per), e = Math.min(b.length, Math.floor((i + 1) * per));
      for (let j = a; j < e; j++) { const v = Math.abs(c0[j]) + Math.abs(c1[j]); if (v > m) m = v; }
      pk[i] = m; if (m > top) top = m;
    }
    this.fine = { pk, res, top };
  }
  setZoom(sec) {
    this.zoomSec = clamp(sec, 2, 32);
    this.r('zlbl').textContent = this.zoomSec + ' s';
    this.r('zin').disabled = this.zoomSec <= 2; this.r('zout').disabled = this.zoomSec >= 32;
    if (typeof STORE !== 'undefined' && STORE.ready) STORE.schedule();
  }
  drawZoom(pos) {
    const cv = this.r('zoom'), dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(cv.clientWidth * dpr)), h = Math.max(1, Math.round(cv.clientHeight * dpr));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    const g = cv.getContext('2d'); g.clearRect(0, 0, w, h);
    if (!this.fine || !this.buffer) { this.zoomView = null; return; }
    const spp = this.zoomSec / w, mid = w / 2, dur = this.duration, X = t => mid + (t - pos) / spp;
    const t0 = pos - mid * spp, t1 = pos + mid * spp;
    this.zoomView = { pos, spp, w, mid };
    if (this.loop) { g.fillStyle = this.col; g.globalAlpha = 0.18; g.fillRect(X(this.loop.start), 0, X(this.loop.end) - X(this.loop.start), h); g.globalAlpha = 1; }
    // grille : temps (fins) et mesures (épais) quand le premier temps est connu
    if (this.bpm && this.anchor !== null) {
      const beat = 60 / this.bpm, ok = this.gridOk, bar = this.barKnown;
      const k0 = Math.ceil((t0 - this.anchor) / beat), k1 = Math.floor((t1 - this.anchor) / beat);
      if (k1 - k0 < w / 3) for (let k = k0; k <= k1; k++) {
        const t = this.anchor + k * beat; if (t < 0 || t > dur) continue;
        const isBar = bar && ((k % 4) + 4) % 4 === 0;
        g.fillStyle = this.ink; g.globalAlpha = ok ? (isBar ? 0.55 : 0.22) : 0.12;
        g.fillRect(Math.round(X(t)) - (isBar ? dpr : dpr / 2), 0, isBar ? 2 * dpr : dpr, h);
      }
      g.globalAlpha = 1;
    }
    // forme d'onde : passé atténué, à venir en couleur
    const { pk, res, top } = this.fine;
    for (let x = 0; x < w; x++) {
      const ta = t0 + x * spp; if (ta < 0 || ta > dur) continue;
      const ia = Math.floor(ta * res), ib = Math.max(ia + 1, Math.floor((ta + spp) * res));
      let m = 0; for (let i = ia; i < ib && i < pk.length; i++) if (pk[i] > m) m = pk[i];
      const bh = Math.max(dpr, m / top * h * 0.9);
      g.fillStyle = x < mid ? this.dim : this.col; g.globalAlpha = x < mid ? 0.55 : 1;
      g.fillRect(x, (h - bh) / 2, 1, bh);
    }
    g.globalAlpha = 1;
    // hot cues : trait + numéro
    g.font = `700 ${10 * dpr}px "Chakra Petch", sans-serif`; g.textBaseline = 'top';
    this.hot.forEach((t, i) => {
      if (t === null) return; const x = X(t); if (x < -10 || x > w + 10) return;
      g.fillStyle = PADS[i]; g.fillRect(Math.round(x) - dpr, 0, 2 * dpr, h);
      g.fillRect(Math.round(x), 0, 11 * dpr, 12 * dpr); g.fillStyle = '#fff'; g.fillText(String(i + 1), Math.round(x) + 3 * dpr, dpr);
    });
    if (this.downbeat !== null) {
      const bx = X(this.downbeat);
      if (bx > -10 && bx < w + 10) {
        g.fillStyle = this.ink; g.fillRect(bx - 2 * dpr, 0, 4 * dpr, h);
        g.fillStyle = this.col; g.fillRect(bx - dpr, 0, 2 * dpr, h);
        g.fillStyle = this.ink; g.beginPath(); g.moveTo(bx - 6 * dpr, h); g.lineTo(bx + 6 * dpr, h); g.lineTo(bx, h - 9 * dpr); g.closePath(); g.fill();
      }
    }
    const cx = X(this.cue);
    if (cx > -10 && cx < w + 10) { g.fillStyle = this.red; g.beginPath(); g.moveTo(cx - 5 * dpr, 0); g.lineTo(cx + 5 * dpr, 0); g.lineTo(cx, 7 * dpr); g.closePath(); g.fill(); }
    // tête de lecture fixe au centre
    g.fillStyle = this.ink; g.fillRect(Math.round(mid) - dpr, 0, 2 * dpr, h);
  }
}

const decks = [new Deck('A'), new Deck('B')];

function applyXf() {
  if (!ctx) return;
  const t = (mix.xf + 1) / 2, now = ctx.currentTime;
  decks[0].n.xf.gain.setTargetAtTime(Math.cos(t * Math.PI / 2), now, 0.01);
  decks[1].n.xf.gain.setTargetAtTime(Math.sin(t * Math.PI / 2), now, 0.01);
}
function ensureCtx() {
  if (!ctx) {
    ctx = new AC({ latencyHint: 'interactive' });
    irBuf = makeIR();
    master = ctx.createGain(); master.gain.value = mix.master * 1.2;
    const lim = ctx.createDynamicsCompressor();
    lim.threshold.value = -3; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.003; lim.release.value = 0.12;
    masterAn = ctx.createAnalyser(); masterAn.fftSize = 1024; mBuf = new Float32Array(1024);
    // écrêteur doux après le limiteur : linéaire jusqu'à −2 dB, puis arrondi sous 0 dBFS (Master maîtrisé avec plusieurs effets)
    const clip = ctx.createWaveShaper(), cN = 8192, cv = new Float32Array(cN), knee = 0.8, ceil = 0.98;
    for (let i = 0; i < cN; i++) { const x = i / (cN - 1) * 4 - 2, ax = Math.abs(x); cv[i] = Math.sign(x) * (ax <= knee ? ax : knee + (ceil - knee) * Math.tanh((ax - knee) / (ceil - knee))); }
    clip.curve = cv;
    master.connect(lim); lim.connect(clip); clip.connect(ctx.destination); clip.connect(masterAn);
    // capture PCM 16 bits stéréo de la sortie master pour l'export WAV
    recTap = ctx.createScriptProcessor(4096, 2, 2);
    recTap.onaudioprocess = e => {
      const o = e.outputBuffer;
      for (let c = 0; c < o.numberOfChannels; c++) o.getChannelData(c).fill(0);
      if (!recording || recWk) return;
      const ib = e.inputBuffer, L = ib.getChannelData(0), R = ib.numberOfChannels > 1 ? ib.getChannelData(1) : L;
      const n = L.length, out = new Int16Array(n * 2);
      for (let i = 0; i < n; i++) {
        const l = clamp(L[i], -1, 1), r = clamp(R[i], -1, 1);
        out[2 * i] = l < 0 ? l * 0x8000 : l * 0x7fff;
        out[2 * i + 1] = r < 0 ? r * 0x8000 : r * 0x7fff;
      }
      onRecData(out, n);
    };
    clip.connect(recTap); recTap.connect(ctx.destination);
    masterOut = clip;
    loadWorklets();
    // bus casque : séparé du Master, donc jamais dans l'enregistrement WAV
    cueBus = ctx.createGain(); cueVol = ctx.createGain(); cueVol.gain.value = HP.vol;
    cueDest = ctx.createMediaStreamDestination(); cueBus.connect(cueVol).connect(cueDest);
    decks.forEach(d => d.build());
    applyXf();
    HP.applyMaster();
  }
  if (ctx.state !== 'running') ctx.resume();
  return ctx;
}

