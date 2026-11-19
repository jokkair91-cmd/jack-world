/* ---------- Moteur AudioWorklet (scratch, Key Lock, enregistrement) chargé depuis le fichier lui-même ---------- */
const REC_MAX_MIN = 90;
let recWk = null, masterOut = null, workletState = 'chargement';
const WORKLET_SRC = `
class Scratch extends AudioWorkletProcessor {
  constructor() { super(); this.c0 = null; this.c1 = null; this.on = false; this.p = 0; this.v = 0; this.tgt = 0; this.cnt = 0;
    this.port.onmessage = e => { const m = e.data;
      if (m.type === 'start') { this.c0 = m.c0; this.c1 = m.c1; this.w0 = m.w0; this.bsr = m.bsr; this.w1 = m.w0 + (m.c0.length - 2) / m.bsr; this.p = m.pos; this.tgt = m.pos; this.v = 0; this.on = true; }
      else if (m.type === 'target') this.tgt = m.t;
      else if (m.type === 'end') { this.on = false; this.c0 = this.c1 = null; this.port.postMessage({ type: 'end', pos: this.p }); } }; }
  process(inputs, outputs) {
    const o = outputs[0], o0 = o[0], o1 = o[1] || o[0];
    if (!this.on || !this.c0) { o0.fill(0); if (o1 !== o0) o1.fill(0); return true; }
    const c0 = this.c0, c1 = this.c1, bsr = this.bsr, lo = this.w0, hi = this.w1, tgt = Math.min(hi, Math.max(lo, this.tgt));
    let p = this.p, v = this.v;
    for (let i = 0; i < o0.length; i++) {
      let want = (tgt - p) * 25; if (want > 6) want = 6; else if (want < -6) want = -6;
      v += (want - v) * 0.02; p += v / sampleRate;
      if (p < lo) { p = lo; v = 0; } else if (p > hi) { p = hi; v = 0; }
      const x = (p - lo) * bsr, i0 = Math.floor(x), f = x - i0;
      o0[i] = c0[i0] + (c0[i0 + 1] - c0[i0]) * f; o1[i] = c1[i0] + (c1[i0 + 1] - c1[i0]) * f;
    }
    this.p = p; this.v = v; if (++this.cnt % 4 === 0) this.port.postMessage({ type: 'pos', pos: p });
    return true;
  }
}
registerProcessor('jdj-scratch', Scratch);
class Rec extends AudioWorkletProcessor {
  constructor() { super(); this.on = false; this.size = 16384; this.n = 0; this.buf = null;
    this.port.onmessage = e => {
      if (e.data.type === 'on') { this.on = true; this.n = 0; this.buf = new Int16Array(this.size * 2); }
      else if (e.data.type === 'off') { if (this.on && this.n) this.port.postMessage({ type: 'data', pcm: this.buf.slice(0, this.n * 2), frames: this.n }); this.on = false; this.port.postMessage({ type: 'done' }); } }; }
  process(inputs, outputs) {
    const inp = inputs[0]; if (outputs[0] && outputs[0][0]) outputs[0][0].fill(0);
    if (!this.on || !inp || !inp.length) return true;
    const L = inp[0], R = inp[1] || inp[0];
    for (let i = 0; i < L.length; i++) {
      let l = L[i], r = R[i]; l = l > 1 ? 1 : l < -1 ? -1 : l; r = r > 1 ? 1 : r < -1 ? -1 : r;
      this.buf[this.n * 2] = l < 0 ? l * 32768 : l * 32767; this.buf[this.n * 2 + 1] = r < 0 ? r * 32768 : r * 32767;
      if (++this.n === this.size) { this.port.postMessage({ type: 'data', pcm: this.buf, frames: this.n }, [this.buf.buffer]); this.buf = new Int16Array(this.size * 2); this.n = 0; }
    }
    return true;
  }
}
registerProcessor('jdj-rec', Rec);
class Pitch extends AudioWorkletProcessor {
  static get parameterDescriptors() { return [{ name: 'ratio', defaultValue: 1, minValue: 0.5, maxValue: 2, automationRate: 'k-rate' }]; }
  constructor() { super(); this.N = 16384; this.bL = new Float32Array(this.N); this.bR = new Float32Array(this.N); this.w = 0; this.ph = 0; this.W = Math.round(sampleRate * 0.04); }
  process(inputs, outputs, params) {
    const inp = inputs[0], out = outputs[0], oL = out[0], oR = out[1] || out[0];
    const L = inp && inp[0], R = inp && (inp[1] || inp[0]);
    if (!L) { oL.fill(0); if (oR !== oL) oR.fill(0); return true; }
    const ratio = params.ratio[0], N = this.N, W = this.W, bL = this.bL, bR = this.bR;
    if (Math.abs(ratio - 1) < 1e-4) {        // tonalité non corrigée : passage direct, sans latence
      for (let i = 0; i < L.length; i++) { bL[this.w] = L[i]; bR[this.w] = R[i]; this.w = (this.w + 1) % N; }
      oL.set(L); if (oR !== oL) oR.set(R); return true;
    }
    const step = (1 - ratio) / W;
    for (let i = 0; i < L.length; i++) {
      bL[this.w] = L[i]; bR[this.w] = R[i];
      this.ph += step; this.ph -= Math.floor(this.ph);
      let sL = 0, sR = 0;
      for (let k = 0; k < 2; k++) {
        let ph = this.ph + k * 0.5; if (ph >= 1) ph -= 1;
        let rp = this.w - (ph * W + 2); if (rp < 0) rp += N;
        const i0 = Math.floor(rp), f = rp - i0, i1 = (i0 + 1) % N, s = Math.sin(Math.PI * ph), g = s * s;
        sL += g * (bL[i0] + (bL[i1] - bL[i0]) * f); sR += g * (bR[i0] + (bR[i1] - bR[i0]) * f);
      }
      oL[i] = sL; oR[i] = sR; this.w = (this.w + 1) % N;
    }
    return true;
  }
}
registerProcessor('jdj-pitch', Pitch);
`;
function loadWorklets() {
  const setEngine = () => { const el = document.getElementById('engine'); if (el) el.textContent = workletState === 'ok'
    ? 'Moteur audio : AudioWorklet (scratch, Key Lock et enregistrement hors du fil principal).'
    : workletState === 'repli' ? 'Moteur audio : mode de repli ScriptProcessor (scratch et enregistrement). Key Lock indisponible dans ce navigateur.' : 'Moteur audio : chargement…'; };
  if (window.__jdjNoWorklet || !ctx.audioWorklet || typeof AudioWorkletNode === 'undefined') { workletState = 'repli'; setEngine(); decks.forEach(d => d.ui()); return; }
  const url = URL.createObjectURL(new Blob([WORKLET_SRC], { type: 'text/javascript' }));
  ctx.audioWorklet.addModule(url).then(() => {
    decks.forEach(d => { if (!d.scratching) d.upgradeWorklet(); });
    recWk = new AudioWorkletNode(ctx, 'jdj-rec', { numberOfInputs: 1, numberOfOutputs: 1, channelCount: 2, channelCountMode: 'explicit' });
    const mute = ctx.createGain(); mute.gain.value = 0; masterOut.connect(recWk); recWk.connect(mute).connect(ctx.destination);
    if (recording) { recWk.port.onmessage = e => { if (e.data.type === 'data') onRecData(e.data.pcm, e.data.frames); }; recWk.port.postMessage({ type: 'on' }); }
    workletState = 'ok'; setEngine();
  }).catch(() => { workletState = 'repli'; setEngine(); decks.forEach(d => d.ui()); })
    .finally(() => URL.revokeObjectURL(url));
}

