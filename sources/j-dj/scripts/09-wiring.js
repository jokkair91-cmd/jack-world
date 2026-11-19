/* ---------- Wiring ---------- */
decks.forEach((d, i) => {
  const other = decks[1 - i];
  d.tempoCtl = control(d.r('tempo'), v => d.setTempo(v));
  d.el.querySelectorAll('[data-fxamt]').forEach(el => { const k = el.dataset.fxamt; control(el, v => d.setFxAmt(k, v), d.id + '.fx.' + k); });
  d.r('play').addEventListener('click', () => { ensureCtx(); d.playing ? d.pause() : d.play(); });
  d.r('cue').addEventListener('click', () => d.cuePress());
  d.r('sync').addEventListener('click', () => d.sync(other));
  d.r('loop').addEventListener('click', () => d.toggleLoop());
  d.el.querySelectorAll('[data-lsize]').forEach(b => b.addEventListener('click', () => d.setLoopSize(+b.dataset.lsize)));
  d.r('lhalf').addEventListener('click', () => { if (d.loop) d.setLoopSize(d.loopBeats / 2); else { d.loopBeats = Math.max(0.5, d.loopBeats / 2); d.ui(); } });
  d.r('ldbl').addEventListener('click', () => { if (d.loop) d.setLoopSize(d.loopBeats * 2); else { d.loopBeats = Math.min(16, d.loopBeats * 2); d.ui(); } });
  d.el.querySelectorAll('[data-roll]').forEach(b => {
    const on = e => { if (e.type === 'pointerdown') { e.preventDefault(); capture(b, e); } ensureCtx(); d.rollStart(+b.dataset.roll); b.classList.add('flash'); };
    const off = () => { delete b.dataset.drag; b.classList.remove('flash'); d.rollEnd(); };
    b.addEventListener('pointerdown', on);
    b.addEventListener('pointerup', off); b.addEventListener('pointercancel', off); b.addEventListener('lostpointercapture', off);
    b.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); on(e); } });
    b.addEventListener('keyup', e => { if (e.key === 'Enter' || e.key === ' ') off(); });
    b.addEventListener('contextmenu', e => e.preventDefault());
  });
  d.r('scratch').addEventListener('click', () => { d.scratchMode = !d.scratchMode; d.ui(); });
  d.r('keylock').addEventListener('click', () => { ensureCtx(); d.setKeyLock(!d.keyLock); });
  const bin = d.r('bpmin');
  bin.addEventListener('change', () => d.setRefBpm(parseFloat(String(bin.value).replace(',', '.'))));
  bin.addEventListener('keydown', e => { if (e.key === 'Enter') bin.blur(); });
  bin.addEventListener('blur', () => d.ui());
  d.r('tap').addEventListener('click', () => {
    d.tap();
    const b = d.r('tap'); b.classList.add('flash'); setTimeout(() => b.classList.remove('flash'), 110);
  });
  d.r('downbeat').addEventListener('click', () => d.setDownbeat());
  d.fxBtns.forEach(b => b.addEventListener('click', () => { ensureCtx(); d.toggleFx(b.dataset.fx); }));
  d.pads.forEach((pad, k) => {
    let timer = 0, long = false;
    pad.addEventListener('pointerdown', () => { long = false; timer = setTimeout(() => { long = true; d.hotClear(k); }, 600); });
    const cancel = () => clearTimeout(timer);
    pad.addEventListener('pointerup', cancel); pad.addEventListener('pointerleave', cancel); pad.addEventListener('pointercancel', cancel);
    pad.addEventListener('contextmenu', e => e.preventDefault());
    pad.addEventListener('click', () => { if (long) { long = false; return; } d.hotPress(k); });
  });
  d.r('demo').addEventListener('click', async () => {
    if (!(await okToReplace(d, d.id === 'A' ? 'Démo trap' : 'Démo drill'))) return;
    ensureCtx(); const req = newLoadRequest(d);
    const buf = await renderDemo(d.id);
    if (req !== d.loadReq) return;                 // une demande plus récente a pris la main
    d.libKey = null;
    d.load(buf, d.id === 'A' ? 'Démo trap' : 'Démo drill', { bpm: d.id === 'A' ? 140 : 144, beat0: 0, gridSrc: 'demo', repeat: true, artist: 'Démo J-DJ · Rap' });
    d.cover = GENRE_ART.rap; d.genre = 'rap'; d.ui();
  });
  d.r('file').addEventListener('change', e => {
    const f = e.target.files[0]; e.target.value = '';
    if (f) PL.fromDeck(d, f);
  });

  const cv = d.r('wave');
  const seekFrom = e => { if (!d.buffer) return; const r = cv.getBoundingClientRect(); d.seek(clamp((e.clientX - r.left) / r.width, 0, 1) * d.duration); };
  cv.addEventListener('pointerdown', e => { if (!d.buffer) return; capture(cv, e); seekFrom(e); });
  cv.addEventListener('pointermove', e => { if (cv.dataset.drag === String(e.pointerId)) seekFrom(e); });
  const endDrag = () => { delete cv.dataset.drag; };
  cv.addEventListener('pointerup', endDrag); cv.addEventListener('pointercancel', endDrag);

  const jog = d.r('jog'); let last = null, timer = 0;
  const angle = e => { const r = jog.getBoundingClientRect(); return Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180 / Math.PI; };
  jog.addEventListener('pointerdown', e => {
    if (!d.buffer) return; e.preventDefault(); capture(jog, e); last = angle(e); jog.classList.add('grab');
    if (d.scratchMode) d.scratchStart();
  });
  jog.addEventListener('pointermove', e => {
    if (last === null) return;
    const a = angle(e); let da = a - last; if (da > 180) da -= 360; if (da < -180) da += 360; last = a;
    if (d.scratching) d.scratchMove(da);
    else if (d.playing) { d.setNudge(clamp(1 + da * 0.04, 0.5, 1.6)); clearTimeout(timer); timer = setTimeout(() => d.setNudge(1), 70); }
    else d.seek(d.offset + da / 360 * 1.8);
  });
  const release = () => {
    if (last === null) return;
    last = null; delete jog.dataset.drag; jog.classList.remove('grab'); clearTimeout(timer);
    if (d.scratching) d.scratchEnd(); else if (d.playing) d.setNudge(1);
  };
  jog.addEventListener('pointerup', release); jog.addEventListener('pointercancel', release);

  new ResizeObserver(() => d.renderWave()).observe(cv);

  // vue rapprochée : glisser pour se déplacer, + / − pour le zoom
  const zc = d.r('zoom'); let zx = 0, zpos = 0;
  d.setZoom(8);
  d.r('zin').addEventListener('click', () => d.setZoom(d.zoomSec / 2));
  d.r('zout').addEventListener('click', () => d.setZoom(d.zoomSec * 2));
  zc.addEventListener('pointerdown', e => { if (!d.buffer || d.scratching) return; e.preventDefault(); capture(zc, e); zx = e.clientX; zpos = d.position(); });
  zc.addEventListener('pointermove', e => {
    if (zc.dataset.drag !== String(e.pointerId) || !d.buffer) return;
    const spp = d.zoomSec / Math.max(1, zc.clientWidth);
    d.seek(zpos - (e.clientX - zx) * spp);
  });
  const zEnd = () => { delete zc.dataset.drag; };
  zc.addEventListener('pointerup', zEnd); zc.addEventListener('pointercancel', zEnd);
  d.ui();
});

document.querySelectorAll('.strip').forEach(strip => {
  const d = decks[strip.dataset.ch === 'A' ? 0 : 1];
  strip.querySelectorAll('[data-p]').forEach(el => { const p = el.dataset.p; control(el, v => d.set(p, v), d.id + '.' + p); });
});
control(document.querySelector('[data-p="master"]'), v => { mix.master = v; if (master) master.gain.setTargetAtTime(v * 1.2, ctx.currentTime, 0.02); }, 'master');
control(document.querySelector('[data-p="xf"]'), v => { mix.xf = v; applyXf(); }, 'xf');
control(document.querySelector('[data-p="cuevol"]'), v => HP.setVol(v), 'cuevol');
document.querySelectorAll('[data-cue]').forEach(b => b.addEventListener('click', () => HP.toggle(b.dataset.cue)));
document.getElementById('outScan').addEventListener('click', () => HP.scan(true));
document.getElementById('outCue').addEventListener('change', e => HP.setCue(e.target.value));
document.getElementById('outMaster').addEventListener('change', e => HP.setMaster(e.target.value));
document.querySelector('.outs').addEventListener('toggle', e => {
  if (e.target.open) HP.scan(false);
  if (!e.target.open && document.querySelector('.mtab.on[data-mtab="outs"]')) setMixTab('mix');
});
// onglets du mixeur : « Mixer » referme le réglage des sorties, « Sorties audio » l'ouvre
document.querySelectorAll('.mtab').forEach(t => t.addEventListener('click', () => setMixTab(t.dataset.mtab)));

