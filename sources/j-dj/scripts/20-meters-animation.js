/* ---------- Meters + animation ---------- */
const N = 14;
document.querySelectorAll('.vu').forEach(vu => {
  for (let i = 0; i < N; i++) { const led = document.createElement('i'); led.dataset.z = i >= N - 2 ? 'r' : i >= N - 5 ? 'y' : 'g'; vu.appendChild(led); }
});
decks[0].vuEls = [...document.querySelectorAll('[data-vu="A"] i')];
decks[1].vuEls = [...document.querySelectorAll('[data-vu="B"] i')];
const vuM = [...document.querySelectorAll('[data-vu="M"] i')];
let mMeter = -60;
const peakDb = (an, buf) => { an.getFloatTimeDomainData(buf); let m = 0; for (let i = 0; i < buf.length; i++) { const v = Math.abs(buf[i]); if (v > m) m = v; } return 20 * Math.log10(m + 1e-6); };
const showVU = (leds, db) => { const lit = Math.round(clamp((db + 48) / 48, 0, 1) * N); for (let i = 0; i < N; i++) leds[i].classList.toggle('on', i < lit); };

matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => decks.forEach(d => d.renderWave()));

function frame() {
  for (const d of decks) {
    const pos = d.position();
    d.drawWave(pos);
    d.drawZoom(pos);
    d.disc.setAttribute('transform', `rotate(${((pos * 200) % 360).toFixed(2)} 100 100)`);
    const t = fmt(pos), rm = '-' + fmt((d.duration - pos) / (1 + d.tempo));
    if (t !== d.lastTime) { d.r('time').textContent = t; d.lastTime = t; }
    if (rm !== d.lastRemain) { d.r('remain').textContent = rm; d.r('remainBig').textContent = d.buffer ? rm : '—:—'; d.lastRemain = rm; }
    if (ctx) { d.meter = Math.max(peakDb(d.n.an, d.buf), d.meter - 1.2); showVU(d.vuEls, d.meter); }
  }
  if (ctx) { mMeter = Math.max(peakDb(masterAn, mBuf), mMeter - 1.2); showVU(vuM, mMeter); }
  if (recording) recTime.textContent = fmt(recFrames / ctx.sampleRate);
  requestAnimationFrame(frame);
}
