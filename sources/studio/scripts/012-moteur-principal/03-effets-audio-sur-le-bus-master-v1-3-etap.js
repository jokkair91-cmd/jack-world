/* =====================================================================
   EFFETS AUDIO sur le bus Master (V1.3, étape 6) — API Web Audio natives
   Chaîne : [batterie + synthé] -> égaliseur -> compresseur -> delay -> reverb -> volume master -> limiteur.
   Chaque effet a un chemin "sec" (gain 1) et un chemin "traité" (gain 0) : éteint, le son passe tel quel (identique à avant) ;
   on/off et réglages se font par fondus (setTargetAtTime) : pas de clic.
   ===================================================================== */
const FX_DEFAULTS = {
  eq:     { low: 0, mid: 0, high: 0 },                                    // dB
  reverb: { on: false, mix: 25, decay: 1.5 },                             // mix en %, decay en secondes
  delay:  { on: false, time: 0.25, fb: 35, mix: 30 },                     // time en secondes (la page le déduit du BPM), fb et mix en %
  comp:   { on: false, thr: -18, ratio: 3, attack: 10, release: 250, makeup: 0 }   // dB, rapport, ms, ms, gain de sortie en dB (0 = aucun)
};
function fxMerge(f) {                                                     // réglages complets, bornés, à partir de réglages partiels
  const g = f || {}, d = FX_DEFAULTS;
  const num = (v, def, lo, hi) => { const n = (v === undefined || v === null || v === '') ? NaN : Number(v); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : def; };
  const eq = g.eq || {}, rv = g.reverb || {}, dl = g.delay || {}, cp = g.comp || {};
  return {
    eq:     { low: num(eq.low, 0, -12, 12), mid: num(eq.mid, 0, -12, 12), high: num(eq.high, 0, -12, 12) },
    reverb: { on: !!rv.on, mix: num(rv.mix, d.reverb.mix, 0, 100), decay: num(rv.decay, d.reverb.decay, 0.3, 6) },
    delay:  { on: !!dl.on, time: num(dl.time, d.delay.time, 0.02, 3.9), fb: num(dl.fb, d.delay.fb, 0, 80), mix: num(dl.mix, d.delay.mix, 0, 100) },
    comp:   { on: !!cp.on, thr: num(cp.thr, d.comp.thr, -60, 0), ratio: num(cp.ratio, d.comp.ratio, 1, 20), attack: num(cp.attack, d.comp.attack, 1, 200), release: num(cp.release, d.comp.release, 20, 1000), makeup: num(cp.makeup, 0, 0, 18) }
  };
}
/* Réponse de la reverb : bruit stéréo qui décroît de 60 dB en `seconds` secondes, et qui s'assombrit avec le temps */
function makeReverbIR(ctx, seconds) {
  let seed = (0x22abcdef ^ Math.round(seconds * 1000) ^ ctx.sampleRate) >>> 0;
  const irRandom = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; };
  const tau = seconds * 1.2;                                                  // calibré par mesure : la queue mesurée (RT60) tombe à 80-85 % du réglage sans ce facteur
  const sr = ctx.sampleRate, len = Math.max(1, Math.floor(tau * sr)), pre = Math.floor(0.01 * sr), buf = ctx.createBuffer(2, len, sr);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c), kEnv = Math.exp(-6.9078 / (tau * sr)), kDark = Math.exp(-3 / (tau * sr));   // décroissances calculées par multiplication (pas d'exp() à chaque échantillon : 3 à 4 fois plus rapide)
    let lp = 0, env = 1, dark = 1;
    for (let i = pre; i < len; i++) {
      lp += (0.15 + 0.8 * dark) * ((irRandom() * 2 - 1) - lp);
      d[i] = lp * env; env *= kEnv; dark *= kDark;
    }
    let en = 0; for (let i = 0; i < len; i++) en += d[i] * d[i];
    const sc = en > 0 ? 1 / Math.sqrt(en) : 1; for (let i = 0; i < len; i++) d[i] *= sc;      // énergie 1 : un bruit ressort avec le même volume (mélange à puissance constante)
  }
  return buf;
}
/* Le DynamicsCompressorNode du navigateur ajoute un gain automatique (qui monte le volume des passages faibles).
   Cette fonction recopie la formule du navigateur (Chromium/Edge) pour le connaître et le compenser exactement. */
function compMakeup(thrDb, ratio, kneeDb) {
  const d2l = d => Math.pow(10, d / 20), l2d = x => 20 * Math.log10(x);
  const lt = d2l(thrDb), kDb = thrDb + kneeDb, kt = d2l(kDb);
  const kc = (x, k) => x < lt ? x : lt + (1 - Math.exp(-k * (x - lt))) / k;
  const slope = (x, k) => { if (x < lt) return 1; const x2 = x * 1.001; return (l2d(kc(x2, k)) - l2d(kc(x, k))) / (l2d(x2) - l2d(x)); };
  let mn = 0.1, mx = 10000, k = 5;
  for (let i = 0; i < 15; i++) { if (slope(kt, k) < 1 / ratio) mx = k; else mn = k; k = Math.sqrt(mn * mx); }
  const ypk = l2d(kc(kt, k));
  const sat = x => x < kt ? kc(x, k) : d2l(ypk + (1 / ratio) * (l2d(x) - kDb));
  return Math.pow(1 / sat(1.0), 0.6);
}

/* Construit la chaîne d'effets entre `input` et `output`. init = réglages de départ (voir fxMerge). */
function buildFxChain(ctx, input, output, init) {
  let st = fxMerge(init);
  const G = v => { const g = ctx.createGain(); g.gain.value = v; return g; };
  const put = (p, v, instant, tc) => { if (instant) p.value = v; else p.setTargetAtTime(v, ctx.currentTime, tc || 0.02); };

  /* --- égaliseur 3 bandes : graves (shelf 100 Hz), médiums (cloche 1 kHz), aigus (shelf 8 kHz) --- */
  const eqOut = G(1), eqDry = G(1), eqWet = G(0), lo = ctx.createBiquadFilter(), mid = ctx.createBiquadFilter(), hi = ctx.createBiquadFilter();
  lo.type = 'lowshelf'; lo.frequency.value = 100; mid.type = 'peaking'; mid.frequency.value = 1000; mid.Q.value = 0.9; hi.type = 'highshelf'; hi.frequency.value = 8000;
  input.connect(eqDry); eqDry.connect(eqOut); input.connect(lo); lo.connect(mid); mid.connect(hi); hi.connect(eqWet); eqWet.connect(eqOut);
  const applyEq = instant => {
    const e = st.eq, active = e.low !== 0 || e.mid !== 0 || e.high !== 0;     // tout à zéro : chemin direct (son strictement identique)
    put(lo.gain, e.low, instant); put(mid.gain, e.mid, instant); put(hi.gain, e.high, instant);
    put(eqDry.gain, active ? 0 : 1, instant); put(eqWet.gain, active ? 1 : 0, instant);
  };

  /* --- compresseur (gain automatique du navigateur compensé) --- */
  const cmpOut = G(1), cmpDry = G(1), cmpWet = G(0), cmp = ctx.createDynamicsCompressor(), cmpMk = G(1);
  cmp.knee.value = 6;
  eqOut.connect(cmpDry); cmpDry.connect(cmpOut); eqOut.connect(cmp); cmp.connect(cmpMk); cmpMk.connect(cmpWet); cmpWet.connect(cmpOut);
  const applyComp = instant => {
    const c = st.comp;
    put(cmp.threshold, c.thr, instant); put(cmp.ratio, c.ratio, instant); put(cmp.attack, c.attack / 1000, instant); put(cmp.release, c.release / 1000, instant);
    put(cmpMk.gain, Math.pow(10, c.makeup / 20) / compMakeup(c.thr, c.ratio, 6), instant);   // compensation du gain automatique du navigateur, puis le gain de sortie choisi (0 dB par défaut)
    put(cmpDry.gain, c.on ? 0 : 1, instant); put(cmpWet.gain, c.on ? 1 : 0, instant);
  };

  /* --- delay synchronisé : écho (temps en secondes), feedback filtré (80 Hz – 5 kHz), mix --- */
  const dlyOut = G(1), dlyDry = G(1), dlySend = G(0), dly = ctx.createDelay(4), dlyHp = ctx.createBiquadFilter(), dlyLp = ctx.createBiquadFilter(), dlyFb = G(0), dlyWet = G(0);
  dlyHp.type = 'highpass'; dlyHp.frequency.value = 80; dlyLp.type = 'lowpass'; dlyLp.frequency.value = 5000;
  cmpOut.connect(dlyDry); dlyDry.connect(dlyOut); cmpOut.connect(dlySend); dlySend.connect(dly); dly.connect(dlyWet); dlyWet.connect(dlyOut);
  dly.connect(dlyHp); dlyHp.connect(dlyLp); dlyLp.connect(dlyFb); dlyFb.connect(dly);
  const applyDelay = instant => {
    const d = st.delay, fb = d.fb / 100;
    put(dly.delayTime, d.time, instant, 0.05);                                   // changement de tempo : glissement doux, pas de clic
    put(dlyWet.gain, d.mix / 100, instant); put(dlySend.gain, d.on ? 1 : 0, instant);
    put(dlyFb.gain, d.on ? fb : Math.min(fb, 0.3), instant);                     // éteint : plus rien n'entre, les échos finissent vite
  };

  /* --- reverb : mélange sec/traité à puissance constante (jamais plus fort), queue naturelle --- */
  const revOut = G(1), revDry = G(1), revSend = G(0), revWet = G(0);
  dlyOut.connect(revDry); revDry.connect(revOut); dlyOut.connect(revSend); revWet.connect(revOut); revOut.connect(output);
  let conv = null;                                                               // { c, g, decay } : construite à la première activation
  const dropConv = o => { try { revSend.disconnect(o.c); o.c.disconnect(); o.g.disconnect(); } catch (e) {} };
  const attachConv = (decay, instant) => {
    const c = ctx.createConvolver(), g = G(instant ? 1 : 0);
    c.normalize = false;                                                        // la réponse est déjà normalisée par makeReverbIR
    c.buffer = makeReverbIR(ctx, decay);
    revSend.connect(c); c.connect(g); g.connect(revWet);
    if (conv && instant) dropConv(conv);
    else if (conv) {                                                             // nouvelle durée : fondu enchaîné de l'ancienne vers la nouvelle (pas de clic)
      const old = conv, t = ctx.currentTime, tm = ctx.createConstantSource(), z = G(0);
      old.g.gain.setTargetAtTime(0, t, 0.03); g.gain.setTargetAtTime(1, t, 0.03);
      tm.connect(z); z.connect(output); tm.start(); tm.stop(t + 0.5);          // minuterie "audio" : libère l'ancienne reverb 0,5 s plus tard
      tm.onended = () => { dropConv(old); try { z.disconnect(); } catch (e) {} };
    }
    conv = { c, g, decay };
  };
  const applyReverb = instant => {
    const r = st.reverb;
    if (r.on && (!conv || Math.abs(conv.decay - r.decay) > 0.01)) attachConv(r.decay, instant || !conv);
    const m = r.on ? Math.min(1, Math.max(0, r.mix / 100)) : 0;
    put(revWet.gain, Math.sin(m * Math.PI / 2), instant); put(revDry.gain, Math.cos(m * Math.PI / 2), instant); put(revSend.gain, r.on ? 1 : 0, instant);
  };

  applyEq(true); applyComp(true); applyDelay(true); applyReverb(true);
  const part = (key, v) => { st = fxMerge(Object.assign({}, st, { [key]: Object.assign({}, st[key], v) })); };
  return {
    state: () => JSON.parse(JSON.stringify(st)),
    nodes: { eqDry, eqWet, lo, mid, hi, cmp, cmpMk, cmpDry, cmpWet, dly, dlyWet, dlySend, dlyFb, revWet, revDry, revSend, get conv() { return conv; } },
    setFx: f => { st = fxMerge(f); applyEq(false); applyComp(false); applyDelay(false); applyReverb(false); },
    setEq: v => { part('eq', v); applyEq(false); }, setComp: v => { part('comp', v); applyComp(false); },
    setDelay: v => { part('delay', v); applyDelay(false); }, setReverb: v => { part('reverb', v); applyReverb(false); }
  };
}

/* ctx      : AudioContext (direct) ou OfflineAudioContext (rendu hors-ligne)
   settings : { master, synthVol, harm, tracks:[kick,snare,hat,clap], muteTracks:[4 booléens], muteSynth, fx } en % (comme les curseurs de la page) ; fx : voir fxMerge
   hooks    : { heldLost(voix), voiceEnded(voix) } facultatifs : la page s'en sert pour surligner les touches
   aliveList: tableau où le moteur range ses voix (facultatif : sinon il en crée un) */
function createEngine(ctx, settings, hooks, aliveList) {
  const S = settings || {};
  const E = { ctx, hooks: hooks || {}, alive: aliveList || [] };

  /* Bruit blanc (partagé par les percussions) */
  E.noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = E.noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  /* Chaîne de sortie : sons -> volume master -> (limiteur doux) -> sortie */
  E.masterGain = ctx.createGain();
  E.masterGain.gain.value = volumeToGain(orDefault(S.master, 70));
  if (SOFT_LIMITER) {
    const pre = ctx.createGain(); pre.gain.value = 1 / LIMIT_RANGE;   // compensé par la courbe (gain total = 1)
    const shaper = ctx.createWaveShaper();
    shaper.curve = makeSoftLimitCurve();
    shaper.oversample = 'none';   // 'none' : le plafond est respecté exactement
    E.masterGain.connect(pre); pre.connect(shaper); shaper.connect(ctx.destination);
  } else {
    E.masterGain.connect(ctx.destination);
  }

  /* Effets audio sur le bus Master : tout le son arrive dans mixBus, passe par les effets, puis va au volume master */
  E.mixBus = ctx.createGain();
  const fxApi = buildFxChain(ctx, E.mixBus, E.masterGain, S.fx);
  E.setFx = fxApi.setFx; E.setEq = fxApi.setEq; E.setReverb = fxApi.setReverb; E.setDelay = fxApi.setDelay; E.setComp = fxApi.setComp;
  E.fxState = fxApi.state; E.fxNodes = fxApi.nodes;

  /* Bus du synthé (volume synthé) -> volume master */
  E.synthLevel = orDefault(S.synthVol, 80); E.synthMute = !!S.muteSynth;
  E.synthBus = ctx.createGain();
  E.synthBus.gain.value = E.synthMute ? 0 : volumeToGain(E.synthLevel);
  E.synthBus.connect(E.mixBus);

  /* Branche "harmoniques" du 808 (volume = curseur). Séparée du grave : le grave n'est jamais déformé. */
  E.harmBus = ctx.createGain();
  E.harmBus.gain.value = orDefault(S.harm, 50) / 100;
  E.harmBus.connect(E.synthBus);
  E.harmWave = makeHarmWave(ctx);

  /* Réglages : changement progressif (pas de clic) */
  E.setMaster = v => E.masterGain.gain.setTargetAtTime(volumeToGain(v), ctx.currentTime, 0.015);
  E.setHarm = v => E.harmBus.gain.setTargetAtTime(v / 100, ctx.currentTime, 0.02);

  /* ---------- Mixeur : un volume (et un Mute) par piste de batterie, un Mute pour le synthé ----------
     Chaque bus de batterie a ses propres "nœuds de piste". Les réglages s'appliquent progressivement
     (setTargetAtTime : pas de clic) à tous les bus en cours. Réglages par défaut : 100 % = son d'origine. */
  E.trackLevel = [0, 1, 2, 3].map(r => orDefault(S.tracks && S.tracks[r], 100));       // en %
  E.trackMute = [0, 1, 2, 3].map(r => !!(S.muteTracks && S.muteTracks[r]));
  const trackTarget = r => E.trackMute[r] ? 0 : volumeToGain(E.trackLevel[r]);
  const busTracks = new Map();                                                          // bus -> [Kick, Snare, Hi-hat, Clap]
  E.trackNode = (dest, r) => {                                                          // le nœud de volume de la piste r sur ce bus
    let arr = busTracks.get(dest); if (!arr) { arr = []; busTracks.set(dest, arr); }
    if (!arr[r]) { const g = ctx.createGain(); g.gain.value = trackTarget(r); g.connect(dest); arr[r] = g; }
    return arr[r];
  };
  const applyTrack = r => busTracks.forEach(arr => { if (arr[r]) arr[r].gain.setTargetAtTime(trackTarget(r), ctx.currentTime, 0.015); });
  E.setTrackLevel = (r, v) => { E.trackLevel[r] = v; applyTrack(r); };
  E.setTrackMute = (r, on) => { E.trackMute[r] = !!on; applyTrack(r); };
  E.setSynthVol = v => { E.synthLevel = v; E.synthBus.gain.setTargetAtTime(E.synthMute ? 0 : volumeToGain(v), ctx.currentTime, 0.015); };
  E.setSynthMute = on => { E.synthMute = !!on; E.synthBus.gain.setTargetAtTime(E.synthMute ? 0 : volumeToGain(E.synthLevel), ctx.currentTime, 0.015); };

  /* Un "bus" de batterie : tous les sons d'une lecture y passent (la page peut le couper d'un coup) */
  E.createBus = () => { const b = ctx.createGain(); b.connect(E.mixBus); busTracks.set(b, []); return b; };
  E.disposeBus = b => {                                                                 // libère les nœuds de piste d'un bus terminé
    const arr = busTracks.get(b); if (arr) arr.forEach(n => { try { n.disconnect(); } catch (e) {} });
    busTracks.delete(b);
  };
  E.busCount = () => busTracks.size;

  /* ---------- Percussions (identiques à la V1) ---------- */
  const env = (g, t, peak, dur) => {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  };
  const tone = (dest, t, f0, f1, dur, peak) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, peak, dur);
    o.connect(g).connect(dest);
    o.start(t); o.stop(t + dur + 0.02);
  };
  const noise = (dest, t, dur, peak, highpass) => {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = E.noiseBuffer;
    f.type = 'highpass'; f.frequency.value = highpass;
    env(g, t, peak, dur);
    s.connect(f).connect(g).connect(dest);
    s.start(t); s.stop(t + dur + 0.02);
  };
  /* r = 0 Kick, 1 Snare, 2 Hi-hat, 3 Clap ; t = heure (secondes) ; bus = bus de batterie (facultatif) */
  E.hit = (r, t, bus) => {
    const dest = E.trackNode(bus || (E.defaultBus = E.defaultBus || E.createBus()), r);   // chaque piste passe par SON volume
    if (window.J22DrumSample && window.J22DrumSample(E, r, t, dest)) return;              // M6 : ligne de batterie jouée par un pad échantillonné
    if (r === 0) tone(dest, t, 155, 42, .24, .85);
    if (r === 1) { noise(dest, t, .17, .32, 1100); tone(dest, t, 190, 110, .12, .18); }
    if (r === 2) noise(dest, t, .055, .16, 7000);
    if (r === 3) { noise(dest, t, .12, .25, 1500); noise(dest, t + .018, .09, .12, 1500); }
  };

  /* ---------- Voix du synthé ---------- */
  /* Démarre une note à l'heure t. steal:false = pas de plafond de voix (rendu hors-ligne). */
  E.startVoice = (source, presetKey, octave, idx, t, opts) => {
    if (!opts || opts.steal !== false) while (E.alive.length >= MAX_VOICES) E.stealVoice();
    if(presetKey==='sample97'&&window.J97SampleVoice)return window.J97SampleVoice(E,source,octave,idx,t,opts);
    const p = {...PRESETS[presetKey]};p.level *= (opts?.velocity??100)/100;
    const freq = noteFreq((octave + 1) * 12 + idx);
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
    o1.type = p.osc1; o2.type = p.osc2;
    o2.detune.value = p.detune;
    [o1, o2].forEach(o => {
      if (p.glide) {                                 // 808 : la hauteur retombe vite sur la note (les DEUX oscillateurs glissent ensemble : même phase, donc grave constant d'une note à l'autre)
        o.frequency.setValueAtTime(freq * p.glide.ratio, t);
        o.frequency.exponentialRampToValueAtTime(freq, t + p.glide.time);
      } else o.frequency.value = freq;
    });
    const m1 = ctx.createGain(), m2 = ctx.createGain();
    m1.gain.value = p.mix[0]; m2.gain.value = p.mix[1];
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = p.cutoff; f.Q.value = p.q;
    const g = ctx.createGain();
    applyEnv(g.gain, t, p);
    o1.connect(m1); o2.connect(m2); m1.connect(f); m2.connect(f); f.connect(g);
    g.connect(E.productionNode?E.productionNode(opts?.trackKey||"melody"):E.synthBus);
    const v = { o1, o2, m1, m2, f, g, idx, p, source, state: 'held', t0: t, oscs: [o1, o2], envs: [g], nodes: [o1, o2, m1, m2, f, g] };
    if (p.harm) {                                    // 808 : branche d'harmoniques (même hauteur, même enveloppe, volume = curseur)
      const oh = ctx.createOscillator(); oh.setPeriodicWave(E.harmWave);
      if (p.glide) {
        oh.frequency.setValueAtTime(freq * p.glide.ratio, t);
        oh.frequency.exponentialRampToValueAtTime(freq, t + p.glide.time);
      } else oh.frequency.value = freq;
      const gh = ctx.createGain();
      applyEnv(gh.gain, t, p);
      oh.connect(gh); if(E.productionNode&&opts?.trackKey){const hg=ctx.createGain();hg.gain.value=orDefault(S.harm,50)/100;gh.connect(hg);hg.connect(E.productionNode(opts.trackKey));v.nodes.push(hg);}else gh.connect(E.harmBus);
      v.oh = oh; v.gh = gh; v.oscs.push(oh); v.envs.push(gh); v.nodes.push(oh, gh);
    }
    o1.onended = () => E.disposeVoice(v);
    if(opts?.glide>0&&E.lastPitch?.[opts.trackKey]!==undefined){const from=noteFreq(E.lastPitch[opts.trackKey]);for(const o of v.oscs){o.frequency.cancelScheduledValues(t);o.frequency.setValueAtTime(from,t);o.frequency.exponentialRampToValueAtTime(freq,t+Math.min(opts.glide,.5));}}
    if(opts?.trackKey){E.lastPitch=E.lastPitch||{};E.lastPitch[opts.trackKey]=(octave+1)*12+idx;}
    v.oscs.forEach(o => o.start(t));
    E.alive.push(v);
    return v;
  };

  /* Relâchement progressif : le volume descend en douceur jusqu'à presque 0, puis on arrête les oscillateurs.
     t absent (ou déjà passé) : "maintenant" (jeu en direct : on part de la valeur actuelle du volume).
     t dans le futur : relâchement PROGRAMMÉ (le niveau de départ est calculé, pas lu). */
  E.releaseVoice = (v, tArg) => {
    if(v.sample97)return window.J97ReleaseSample(v,tArg);
    if (v.state !== 'held') return;
    v.state = 'releasing';
    const now = ctx.currentTime, r = v.p.release;
    const scheduled = tArg !== undefined && tArg > now + 1e-6;
    const t = scheduled ? tArg : now;
    if (scheduled) {
      const level = envAt(v.p, v.t0, t);
      const inAttack = t > v.t0 && t < v.t0 + v.p.attack;   // relâché pendant la montée : on la poursuit jusqu'à t (cancelScheduledValues l'effacerait : note muette puis saut)
      v.envs.forEach(e => {
        e.gain.cancelScheduledValues(t);
        if (inAttack) e.gain.linearRampToValueAtTime(level, t);
        e.gain.setValueAtTime(level, t);
        e.gain.exponentialRampToValueAtTime(0.0001, t + r);
        e.gain.setValueAtTime(0, t + r);
      });
    } else {
      v.envs.forEach(e => {
        holdParam(e.gain, t, v.t0);
        e.gain.exponentialRampToValueAtTime(0.0001, t + r);
        e.gain.setValueAtTime(0, t + r);
      });
    }
    v.oscs.forEach(o => { try { o.stop(t + r + 0.02); } catch (e) {} });
  };

  /* Coupure rapide mais sans clic (25 ms) : pour voler une voix ou "Couper les notes" */
  E.killVoice = v => {
    const i = E.alive.indexOf(v); if (i >= 0) E.alive.splice(i, 1);
    if (v.state === 'dying') return;
    if (v.state === 'held' && E.hooks.heldLost) E.hooks.heldLost(v);
    v.state = 'dying';
    const t = ctx.currentTime;
    v.envs.forEach(e => {
      holdParam(e.gain, t, v.t0);
      e.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
      e.gain.setValueAtTime(0, t + 0.025);
    });
    v.oscs.forEach(o => { try { o.stop(t + 0.04); } catch (e) {} });
  };
  E.stealVoice = () => {   // on coupe d'abord la plus ancienne voix qui s'éteint déjà, sinon la plus ancienne tenue
    E.killVoice(E.alive.find(x => x.state === 'releasing') || E.alive[0]);
  };
  E.killAll = () => { E.alive.slice().forEach(v => E.killVoice(v)); };
  E.disposeVoice = v => {
    v.nodes.forEach(n => { try { n.disconnect(); } catch (e) {} });
    const i = E.alive.indexOf(v); if (i >= 0) E.alive.splice(i, 1);
    if (E.hooks.voiceEnded) E.hooks.voiceEnded(v);
  };

  /* Note programmée à l'avance, avec son début ET sa fin (pour rejouer / exporter une mélodie) */
  E.scheduleNote = (presetKey, octave, idx, tStart, tEnd,meta) => {
    const v = E.startVoice(null, presetKey, octave, idx, tStart, { steal: false,...meta });
    E.releaseVoice(v, tEnd);
    return v;
  };
  if(window.J97InstallEngine)window.J97InstallEngine(E,S);
  return E;
}

