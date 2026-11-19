/* ---------- Montage : timeline à deux pistes (A/B), clips non destructifs, fondus, annulation ----------
   Un clip = un média du projet (fichier ou démo), sa place dans le set (at), son début et sa fin dans la source (in, out),
   son gain et ses fondus. Une transition = le recouvrement de deux clips sur les pistes A et B, avec leurs courbes de volume.
   La lecture passe par le Master (donc « Enregistrer le mix » capture le montage) ; le calcul des clips est le même
   pour la lecture et pour le rendu hors ligne (mtSchedule). */
const MT_SR = 44100, MT_RUL = 28, MT_TH = 96;
const MT_CURVES = { eq: 'Puissance égale', lin: 'Linéaire', exp: 'Douce (lente au début)' };
const mtCurve = (kind, x) => { x = clamp(x, 0, 1); return kind === 'lin' ? x : kind === 'exp' ? x * x : Math.sin(x * Math.PI / 2); };
const mtLen = k => k.out - k.in;
// volume d'un clip à l'instant u (secondes depuis le début du clip)
// Un fondu peut avoir commencé avant le début du clip (fis < 0) ou finir après sa fin (foe > 0) : c'est le cas
// des deux morceaux d'un clip scindé au milieu d'un fondu, qui gardent ainsi exactement la même courbe.
function mtEnv(k, u) {
  const len = mtLen(k); let g = k.gain;
  if (k.fi > 0 && u < k.fi) { const s = k.fis || 0; g *= mtCurve(k.fic, (u - s) / (k.fi - s)); }
  if (k.fo > 0 && u > len - k.fo) { const e = k.foe || 0; g *= mtCurve(k.foc, (len + e - u) / (k.fo + e)); }
  return g;
}
// fondus réglés à la main : ils restent dans le clip et ne se chevauchent pas
function mtFitFades(k) {
  const len = mtLen(k);
  k.fis = 0; k.foe = 0; k.fi = clamp(k.fi || 0, 0, len); k.fo = clamp(k.fo || 0, 0, len);
  if (k.fi + k.fo > len) { const r = len / (k.fi + k.fo); k.fi *= r; k.fo *= r; }
}
// programme les clips à partir de la position « from » du set, qui sonne à l'instant t0 du contexte
function mtSchedule(c, dest, clips, bufs, from, t0) {
  const srcs = [];
  for (const k of clips) {
    const buf = bufs.get(k.ref); if (!buf) continue;
    const len = Math.min(mtLen(k), buf.duration - k.in), end = k.at + len; if (len <= 0 || end <= from + 1e-6) continue;
    const s0 = Math.max(k.at, from), u0 = s0 - k.at, when = t0 + (s0 - from);
    const src = c.createBufferSource(); src.buffer = buf;
    const g = c.createGain(); src.connect(g); g.connect(dest);
    const fiEnd = Math.min(k.fi, len), foStart = Math.max(len - k.fo, fiEnd);
    const seg = (a, b) => {                       // courbe échantillonnée (200 points/s), identique en direct et au rendu
      if (b - a < 1e-4) return;
      const n = Math.max(2, Math.ceil((b - a) * 200)), cv = new Float32Array(n);
      for (let i = 0; i < n; i++) cv[i] = mtEnv(k, a + (b - a) * i / (n - 1));
      g.gain.setValueCurveAtTime(cv, t0 + (k.at + a - from), b - a);
    };
    const inFi = u0 < fiEnd - 1e-4, inFo = k.fo > 0 && u0 >= foStart;
    if (!inFi && !inFo) g.gain.setValueAtTime(mtEnv(k, u0), when);
    if (inFi) seg(u0, fiEnd);
    if (k.fo > 0) seg(Math.max(u0, foStart), len);
    src.start(when, k.in + u0, end - s0);
    srcs.push(src);
  }
  return srcs;
}
function mtPeaks(b) {
  const per = b.sampleRate / 100, n = Math.ceil(b.length / per), out = new Float32Array(n);
  const c0 = b.getChannelData(0), c1 = b.numberOfChannels > 1 ? b.getChannelData(1) : c0;
  for (let i = 0; i < n; i++) { let m = 0; const e = Math.min(b.length, Math.floor((i + 1) * per)); for (let j = Math.floor(i * per); j < e; j += 3) { const v = Math.max(Math.abs(c0[j]), Math.abs(c1[j])); if (v > m) m = v; } out[i] = m; }
  return out;
}
var MT = {
  clips: [], sel: null, ph: 0, pps: 40, sx: 0, grid: { on: true, bpm: 120 }, undo: [], redo: [], seq: 1,
  bufs: new Map(), peaks: new Map(), loading: new Map(),
  playing: false, preview: false, t0: 0, from: 0, stopAt: 0, srcs: [], bus: null, endTimer: 0, isOpen: false, drag: null,
  el(id) { return document.getElementById(id); },
  st(t) { this.el('mtSt').textContent = t; },
  end() { return this.clips.reduce((m, k) => Math.max(m, k.at + mtLen(k)), 0); },
  selClip() { return this.clips.find(k => k.id === this.sel) || null; },
  data() { return { clips: this.clips.map(k => ({ ...k })), grid: { ...this.grid }, pps: this.pps }; },
  load(m) {
    this.stop();
    this.clips = m && Array.isArray(m.clips) ? m.clips.map(k => ({ ...k })) : [];
    this.grid = m && m.grid ? { ...m.grid } : { on: true, bpm: 120 }; this.pps = m && m.pps ? m.pps : 40;
    this.sel = null; this.ph = 0; this.sx = 0; this.undo = []; this.redo = [];
    this.seq = this.clips.reduce((n, k) => Math.max(n, k.id + 1), 1);
    this.gen = (this.gen || 0) + 1; this.prune();     // nouveau montage : l'ancien cache est libéré
    if (this.isOpen) { this.fillMedia(); this.prepare(); }
  },
  nameOf(ref) {
    if (ref.startsWith('demo:')) { const s = STYLE_DEMOS.find(x => 'demo:' + x.style === ref); return s ? s.name : 'Démo'; }
    const it = PL.items.find(x => x.id === ref); return it ? it.name : '';
  },
  // ---------- médias : décodés une fois (44,1 kHz), formes d'onde calculées ----------
  async fetchBuf(ref) {
    if (ref.startsWith('demo:')) return renderStyleDemo(ref.slice(5));
    const it = PL.items.find(x => x.id === ref && x.file && x.status === 'ok');
    let blob = it ? it.file : null;
    if (!blob) { try { const m = await PROJ.get('media', ref); if (m && m.blob) blob = m.blob; } catch (e) {} }
    if (!blob) return null;
    return new OfflineAudioContext(2, 1, MT_SR).decodeAudioData(await blob.arrayBuffer());
  },
  // un seul chargement par source à la fois (déduplication) ; le résultat n'entre dans le cache que si le montage
  // n'a pas changé entre-temps, ou s'il utilise toujours cette source
  bufFor(ref) {
    if (this.bufs.has(ref)) return Promise.resolve(this.bufs.get(ref));
    if (!this.loading.has(ref)) {
      const gen = this.gen || 0;
      const p = this.fetchBuf(ref).catch(() => null).then(b => {
        if (this.loading.get(ref) === p) this.loading.delete(ref);
        if (b && ((this.gen || 0) === gen || this.clips.some(k => k.ref === ref))) { this.bufs.set(ref, b); this.peaks.set(ref, mtPeaks(b)); }
        return b;
      });
      this.loading.set(ref, p);
    }
    return this.loading.get(ref);
  },
  // libère les sons (tampon et forme d'onde) qui ne servent plus au montage en cours
  prune() {
    const used = new Set(this.clips.map(k => k.ref));
    for (const ref of [...this.bufs.keys()]) if (!used.has(ref)) this.bufs.delete(ref);
    for (const ref of [...this.peaks.keys()]) if (!used.has(ref)) this.peaks.delete(ref);
  },
  async prepare() {
    const refs = [...new Set(this.clips.map(k => k.ref))].filter(r => !this.bufs.has(r));
    if (refs.length) { this.draw(); await Promise.all(refs.map(r => this.bufFor(r))); }
    this.draw(); this.ui();
    return this.clips.filter(k => !this.bufs.has(k.ref));
  },
  fillMedia() {
    const s = this.el('mtMedia'), keep = s.value;
    const opts = PL.items.filter(x => x.status !== 'bad' && (x.demo || x.id)).sort((a, b) => !!a.demo - !!b.demo).map(x => {
      const ref = x.demo ? 'demo:' + x.demo : x.id;
      return `<option value="${ref}">${escHtml(x.name)}${x.demo ? ' (démo)' : x.status === 'missing' ? ' (absent)' : ''}</option>`;
    });
    s.innerHTML = opts.join('') || '<option value="">Aucun morceau dans le projet</option>';
    if (keep && [...s.options].some(o => o.value === keep)) s.value = keep;
  },
  // ---------- historique (annuler / rétablir) ----------
  snap() { return JSON.stringify(this.clips); },
  normalize() {
    for (const k of this.clips) {
      k.gain = clamp(k.gain, 0, 4); k.fi = Math.max(0, k.fi || 0); k.fo = Math.max(0, k.fo || 0);
      k.fis = Math.min(0, k.fis || 0); k.foe = Math.max(0, k.foe || 0);
      // pas de recalage automatique ici : les morceaux d'une scission gardent leur fondu prolongé ;
      // les fondus sont recalés seulement quand on les règle ou qu'on raccourcit le clip (mtFitFades)
    }
  },
  badOverlap() {
    for (const a of this.clips) for (const b of this.clips)
      if (a.id < b.id && a.track === b.track && Math.min(a.at + mtLen(a), b.at + mtLen(b)) - Math.max(a.at, b.at) > 0.005) return true;
    return false;
  },
  commit(before, label) {
    if (before === this.snap()) { this.draw(); this.ui(); return; }
    this.undo.push(before); if (this.undo.length > 200) this.undo.shift(); this.redo = [];
    this.changed(label);
  },
  changed(label) {
    this.prune();                                    // un clip retiré libère son son ; « Annuler » le recharge au besoin
    if (this.isOpen && this.clips.some(k => !this.bufs.has(k.ref) && !this.loading.has(k.ref))) this.prepare();
    if (this.playing) this.play(this.pos(), this.preview ? this.stopAt : null, true);
    this.draw(); this.ui(); PROJ.schedule(); if (label) this.st(label);
  },
  edit(label, fn) {
    const before = this.snap(); fn(); this.normalize();
    if (this.badOverlap()) { this.clips = JSON.parse(before); this.st('Impossible : deux clips se chevaucheraient sur la même piste. Pour une transition, place-les sur A et sur B.'); this.draw(); this.ui(); return false; }
    this.commit(before, label); return true;
  },
  doUndo() { if (!this.undo.length) return; this.redo.push(this.snap()); this.clips = JSON.parse(this.undo.pop()); this.changed('Annulé.'); },
  doRedo() { if (!this.redo.length) return; this.undo.push(this.snap()); this.clips = JSON.parse(this.redo.pop()); this.changed('Rétabli.'); },
  // ---------- lecture (par le Master) ----------
  pos() { return this.playing && ctx ? Math.max(this.from, this.from + (ctx.currentTime - this.t0)) : this.ph; },
  async play(from = this.ph, until = null, keepPreview = false) {
    ensureCtx(); this.stop(false, keepPreview);
    const tok = this.playTok;                     // une demande de lecture annulée (Stop, Pause, fermeture, autre lecture) ne démarre jamais
    const missing = await this.prepare();
    if (tok !== this.playTok) return;
    if (!this.clips.length) { this.st('Le montage est vide : ajoute des morceaux sur les pistes A et B.'); return; }
    const live = decks.filter(d => d.playing || d.scratching);  // une seule source à la fois : les platines se taisent pendant le montage
    if (live.length) { live.forEach(d => d.pause()); this.st(`Platine${live.length > 1 ? 's' : ''} ${live.map(d => d.id).join(' et ')} mise${live.length > 1 ? 's' : ''} en pause pour écouter le montage.`); }
    this.bus = ctx.createGain(); this.bus.connect(master);
    this.from = Math.max(0, from); this.t0 = ctx.currentTime + 0.06;
    this.srcs = mtSchedule(ctx, this.bus, this.clips, this.bufs, this.from, this.t0);
    this.stopAt = until !== null ? until : this.end();
    this.playing = true; this.preview = keepPreview || until !== null;
    clearTimeout(this.endTimer); this.endTimer = setTimeout(() => this.checkEnd(), (this.stopAt - this.from) * 1000 + 150);
    if (missing.length && !keepPreview) this.st(`${missing.length} clip(s) sans fichier : ils restent silencieux. Relie les fichiers absents dans la bibliothèque.`);
    this.ui(); this.tick(tok);
  },
  checkEnd() { if (this.playing && this.pos() >= this.stopAt - 0.03) { this.stop(); this.ph = Math.min(this.ph, this.stopAt); this.draw(); this.ui(); } else if (this.playing) this.endTimer = setTimeout(() => this.checkEnd(), 100); },
  stop(keepPos, keepPreview) {
    this.playTok = (this.playTok || 0) + 1;
    if (this.playing) this.ph = Math.max(0, this.pos());
    clearTimeout(this.endTimer);
    this.srcs.forEach(s => { try { s.stop(); } catch (e) {} }); this.srcs = [];
    if (this.bus) { try { this.bus.disconnect(); } catch (e) {} this.bus = null; }
    this.playing = false; if (!keepPreview) this.preview = false;
    if (this.isOpen) { this.draw(); this.ui(); }
  },
  toggle() { if (this.playing) this.stop(); else { this.startPos = this.ph >= this.end() - 0.05 ? 0 : this.ph; this.play(this.startPos); } },
  // Stop : arrête tout et revient là où la lecture avait commencé (deuxième appui : au début du set)
  hardStop() {
    const back = this.playing ? (this.startPos || 0) : 0;
    this.stop(); this.ph = back; if (!back) this.sx = 0; this.draw(); this.ui();
    this.st(back ? `Arrêté : retour à ${fmtPrecise(back)}.` : 'Arrêté : retour au début du set.');
  },
  home() { const was = this.playing; this.stop(); this.ph = 0; this.sx = 0; if (was) { this.startPos = 0; this.play(0); } this.draw(); this.ui(); },
  tick(tok) {
    if (!this.playing || tok !== this.playTok) return;
    const p = this.pos();
    if (p >= this.stopAt) { this.checkEnd(); return; }
    const W = this.el('mtCv').clientWidth;
    if (this.isOpen && ((p - this.sx) * this.pps > W * 0.85 || p < this.sx)) this.sx = Math.max(0, p - W * 0.15 / this.pps);
    this.draw(); this.ui(true);
    requestAnimationFrame(() => this.tick(tok));
  },
  // ---------- édition ----------
  async addClip(track) {
    const ref = this.el('mtMedia').value; if (!ref) { this.st('Ajoute d’abord des morceaux au projet (bibliothèque).'); return; }
    this.st('Préparation du morceau…');
    const buf = await this.bufFor(ref);
    if (!buf) { this.st('Ce morceau est absent : relie-le dans la bibliothèque avant de l’ajouter au montage.'); return; }
    const dur = buf.duration, onT = this.clips.filter(k => k.track === track);
    const free = !onT.some(k => Math.min(k.at + mtLen(k), this.ph + dur) - Math.max(k.at, this.ph) > 0.005);
    const at = free ? this.ph : onT.reduce((m, k) => Math.max(m, k.at + mtLen(k)), 0);
    const it = PL.items.find(x => x.id === ref);
    if (!this.clips.length && it && it.bpm) this.grid.bpm = Math.round(it.bpm * 10) / 10;
    const k = { id: this.seq++, track, ref, name: this.nameOf(ref), at, in: 0, out: dur, gain: 1, fi: 0, fo: 0, fic: 'eq', foc: 'eq' };
    if (this.edit(`« ${k.name} » ajouté sur la piste ${track ? 'B' : 'A'} à ${fmtPrecise(at)}.`, () => { this.clips.push(k); this.sel = k.id; })) this.reveal(k);
  },
  async build() {
    let list = PL.items.filter(x => !x.demo && x.id && x.status !== 'bad').map(x => x.id);
    if (!list.length) list = PL.items.filter(x => x.demo).map(x => 'demo:' + x.demo);
    if (!list.length) { this.st('Le projet ne contient aucun morceau.'); return; }
    if (this.clips.length && !(await askConfirm('Remplacer le montage actuel par toute la liste du projet, dans son ordre ? (« Annuler » le remettra.)', 'Remplacer'))) return;
    this.st('Préparation des morceaux…');
    const bufs = await Promise.all(list.map(r => this.bufFor(r)));
    const D = clamp(+this.el('mtXdur').value || 0, 0, 60), c = this.el('mtXcurve').value || 'eq';
    let skipped = 0;
    this.edit('', () => {
      this.clips = [];
      list.forEach((ref, i) => {
        const b = bufs[i]; if (!b) { skipped++; return; }
        const prev = this.clips[this.clips.length - 1], dur = b.duration;
        const d = prev ? Math.min(D, dur / 2, mtLen(prev) / 2) : 0;
        if (prev) { prev.fo = d; prev.foc = c; }
        this.clips.push({ id: this.seq++, track: this.clips.length % 2, ref, name: this.nameOf(ref), at: prev ? prev.at + mtLen(prev) - d : 0, in: 0, out: dur, gain: 1, fi: d, fic: c, fo: 0, foc: c });
      });
      this.sel = null; this.ph = 0;
      const first = PL.items.find(x => x.id === list[0]); if (first && first.bpm) this.grid.bpm = Math.round(first.bpm * 10) / 10;
    });
    this.fit();
    this.st(`${this.clips.length} morceau(x) montés en alternance A/B, transitions de ${String(D).replace('.', ',')} s (${MT_CURVES[c]}).` + (skipped ? ` ${skipped} fichier(s) absent(s) ignoré(s).` : ''));
  },
  split() {
    const t = this.pos(), inside = k => t > k.at + 0.05 && t < k.at + mtLen(k) - 0.05;
    const s = this.selClip(); let k = s && inside(s) ? s : this.clips.find(x => inside(x) && (!s || x.track === s.track)) || this.clips.find(inside);
    if (!k) { this.st('Place la tête de lecture dans un clip pour le scinder.'); return; }
    const id = k.id;
    this.edit(`Clip scindé à ${fmtPrecise(t)}.`, () => {
      // les deux morceaux gardent exactement la même courbe de volume, même si la coupe tombe dans un fondu
      const k = this.clips.find(x => x.id === id), u = t - k.at, L = mtLen(k);
      const fis = k.fis || 0, foe = k.foe || 0, foStart = L - k.fo;
      const n = { ...k, id: this.seq++, at: t, in: k.in + u };
      if (k.fi > u) { n.fis = fis - u; n.fi = k.fi - u; } else { n.fis = 0; n.fi = 0; }   // fondu d'entrée qui continue après la coupe
      n.fo = k.fo; n.foe = foe;                                                           // le fondu de sortie reste au même endroit
      if (k.fo > 0 && foStart < u) { k.foe = L + foe - u; k.fo = u - foStart; } else { k.fo = 0; k.foe = 0; }
      k.out = k.in + u; this.clips.push(n); this.sel = n.id;
    });
  },
  del() {
    const k = this.selClip(); if (!k) { this.st('Sélectionne d’abord un clip.'); return; }
    this.edit(`« ${k.name} » retiré du montage (le fichier n’est pas touché).`, () => { this.clips = this.clips.filter(x => x.id !== k.id); this.sel = null; });
  },
  // après un déplacement de coupe : une transition dont les fondus couvraient exactement le recouvrement le suit
  followFades(old) {
    const ov = (a, b) => Math.min(a.at + mtLen(a), b.at + mtLen(b)) - Math.max(a.at, b.at);
    for (const a of old) for (const b of old) {
      if (a.track === b.track || a.at > b.at || (a.at === b.at && a.id > b.id)) continue;
      const o0 = ov(a, b); if (o0 <= 0.01 || Math.abs(a.fo - o0) > 0.02 || Math.abs(b.fi - o0) > 0.02) continue;
      const na = this.clips.find(x => x.id === a.id), nb = this.clips.find(x => x.id === b.id); if (!na || !nb || na.track === nb.track) continue;
      const o1 = Math.max(0, ov(na, nb)); na.fo = o1; nb.fi = o1; na.foe = 0; nb.fis = 0; mtFitFades(na); mtFitFades(nb);
    }
    this.normalize();
  },
  transitions() {
    const out = [];
    for (const a of this.clips) for (const b of this.clips) {
      if (a.track !== 0 || b.track !== 1) continue;
      const s = Math.max(a.at, b.at), e = Math.min(a.at + mtLen(a), b.at + mtLen(b));
      if (e - s > 0.01) out.push({ a, b, s, e, from: a.at <= b.at ? a : b, to: a.at <= b.at ? b : a });
    }
    return out.sort((x, y) => x.s - y.s);
  },
  makeTransition() {
    const k = this.selClip(); if (!k) { this.st('Sélectionne le clip qui doit entrer en fondu.'); return; }
    const prev = this.clips.filter(x => x !== k && x.at <= k.at).sort((a, b) => b.at - a.at)[0];
    if (!prev) { this.st('Il faut un clip qui commence avant celui-ci.'); return; }
    const c = this.el('mtXcurve').value || 'eq';
    const D = clamp(+this.el('mtXdur').value || 0, 0, Math.max(0, Math.min(mtLen(prev), mtLen(k)) - 0.05));
    const ids = [k.id, prev.id];
    this.edit(`Transition de ${D.toFixed(1).replace('.', ',')} s (${MT_CURVES[c]}) : « ${prev.name} » → « ${k.name} ».`, () => {
      const [k2, p2] = ids.map(id => this.clips.find(x => x.id === id));
      const newAt = Math.max(p2.at + 0.05, p2.at + mtLen(p2) - D), delta = newAt - k2.at, oldAt = k2.at;
      this.clips.forEach(x => { if (x !== k2 && x !== p2 && x.at > oldAt) x.at += delta; });   // la suite du set suit
      k2.at = newAt; if (k2.track === p2.track) k2.track = 1 - p2.track;
      p2.fo = D; p2.foc = c; k2.fi = D; k2.fic = c; p2.foe = 0; k2.fis = 0; mtFitFades(p2); mtFitFades(k2);
    });
  },
  previewTx() {
    const tx = this.transitions();
    if (!tx.length) { this.st('Aucune transition : fais se chevaucher un clip de A et un clip de B.'); return; }
    const k = this.selClip(), p = this.pos();
    let x = k ? tx.find(t => t.a.id === k.id || t.b.id === k.id) : null;
    if (!x) x = tx.reduce((best, t) => Math.abs((t.s + t.e) / 2 - p) < Math.abs((best.s + best.e) / 2 - p) ? t : best);
    const from = Math.max(0, x.s - 3), until = Math.min(this.end(), x.e + 3);
    this.ph = from; this.startPos = from; this.reveal({ at: from, in: 0, out: until - from });
    this.play(from, until);
    this.st(`Préécoute de la transition « ${x.from.name} » → « ${x.to.name} » (${fmtPrecise(x.s)} à ${fmtPrecise(x.e)}, avec 3 s avant et après).`);
  },
  setSel(field, v) {
    const k = this.selClip(); if (!k) return;
    const id = k.id, lbl = { gain: 'Volume', fi: 'Fondu d’entrée', fo: 'Fondu de sortie', fic: 'Courbe d’entrée', foc: 'Courbe de sortie' }[field];
    this.edit(`${lbl} de « ${k.name} » modifié.`, () => {
      const c = this.clips.find(x => x.id === id); c[field] = v;
      if (field === 'fi' || field === 'fo') { if (field === 'fi') c.fis = 0; else c.foe = 0; mtFitFades(c); }   // fondu réglé à la main : il repart du bord du clip
    });
  },
  // ---------- affichage ----------
  X(t) { return (t - this.sx) * this.pps; },
  zoom(f, cx) {
    const W = this.el('mtCv').clientWidth; cx = cx === undefined ? W / 2 : cx;
    const t = this.sx + cx / this.pps; this.pps = clamp(this.pps * f, 2, 400); this.sx = Math.max(0, t - cx / this.pps);
    this.draw(); PROJ.schedule();
  },
  fit() { const W = this.el('mtCv').clientWidth || 800; this.pps = clamp((W - 20) / Math.max(10, this.end() + 2), 2, 400); this.sx = 0; this.draw(); },
  reveal(k) {
    const W = this.el('mtCv').clientWidth || 800, a = k.at, b = k.at + mtLen(k);
    if (this.X(a) < 0 || this.X(b) > W) this.sx = Math.max(0, a - 1);
    this.draw();
  },
  snapT(t, skipId, alt) {
    if (alt) return t;
    let best = t, bd = 10 / this.pps;
    const cand = [0, this.ph];
    this.clips.forEach(k => { if (k.id !== skipId) cand.push(k.at, k.at + mtLen(k)); });
    if (this.grid.on) { const b = 60 / this.grid.bpm; cand.push(Math.round(t / b) * b); }
    for (const c of cand) if (Math.abs(c - t) < bd) { bd = Math.abs(c - t); best = c; }
    return best;
  },
  draw() {
    if (!this.isOpen) return;
    const cv = this.el('mtCv'), dpr = window.devicePixelRatio || 1, W = Math.max(1, cv.clientWidth), H = MT_RUL + 2 * MT_TH;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = '#0d1014'; g.fillRect(0, 0, W, H);
    const colors = ['#17d4f2', '#ff8a1c'], t0 = this.sx, t1 = this.sx + W / this.pps;
    for (let i = 0; i < 2; i++) { g.fillStyle = i ? '#15110d' : '#0d1518'; g.fillRect(0, MT_RUL + i * MT_TH, W, MT_TH - 2); }
    // grille (temps et mesures)
    if (this.grid.on) {
      const beat = 60 / this.grid.bpm, every = beat * this.pps < 7 ? 4 : 1;
      for (let n = Math.ceil(t0 / (beat * every)); n * beat * every <= t1; n++) {
        const bar = (n * every) % 4 === 0; if (every === 4 && !bar) continue;
        const x = Math.round(this.X(n * beat * every)) + 0.5;
        g.strokeStyle = bar ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.04)'; g.beginPath(); g.moveTo(x, MT_RUL); g.lineTo(x, H); g.stroke();
      }
    }
    // règle
    g.fillStyle = '#11151a'; g.fillRect(0, 0, W, MT_RUL);
    const steps = [0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300, 600], step = steps.find(s => s * this.pps >= 70) || 600;
    g.font = '600 11px "Chakra Petch", "Segoe UI", sans-serif'; g.textBaseline = 'middle';
    for (let t = Math.ceil(t0 / step) * step; t <= t1; t += step) {
      const x = Math.round(this.X(t)) + 0.5; g.strokeStyle = '#3a434f'; g.beginPath(); g.moveTo(x, MT_RUL - 9); g.lineTo(x, MT_RUL); g.stroke();
      g.fillStyle = '#8a94a1'; g.fillText(step < 1 ? fmtPrecise(t) : fmt(t), x + 3, 10);
    }
    g.fillStyle = 'rgba(255,255,255,.55)'; g.font = '700 13px "Chakra Petch", "Segoe UI", sans-serif';
    // transitions (zone de recouvrement)
    for (const x of this.transitions()) {
      const a = this.X(x.s), b = this.X(x.e); if (b < 0 || a > W) continue;
      g.fillStyle = 'rgba(255,42,58,.10)'; g.fillRect(a, MT_RUL, b - a, 2 * MT_TH);
      g.strokeStyle = 'rgba(255,42,58,.7)'; g.setLineDash([4, 4]); g.strokeRect(a + 0.5, MT_RUL + 0.5, b - a - 1, 2 * MT_TH - 3); g.setLineDash([]);
      g.fillStyle = '#ff6b76'; g.font = '700 10px "Chakra Petch", "Segoe UI", sans-serif';
      if (b - a > 40) g.fillText(`⨯ ${(x.e - x.s).toFixed(1).replace('.', ',')} s`, a + 4, MT_RUL + MT_TH - 1);
    }
    // clips
    for (const k of this.clips) {
      const len = mtLen(k), x0 = this.X(k.at), x1 = this.X(k.at + len); if (x1 < 0 || x0 > W) continue;
      const y = MT_RUL + k.track * MT_TH + 4, h = MT_TH - 12, col = colors[k.track], sel = k.id === this.sel;
      const buf = this.bufs.get(k.ref), pk = this.peaks.get(k.ref), loading = this.loading.has(k.ref);
      g.save(); g.beginPath(); g.rect(x0, y, x1 - x0, h); g.clip();
      g.fillStyle = buf ? (k.track ? 'rgba(255,138,28,.14)' : 'rgba(23,212,242,.12)') : 'rgba(255,42,58,.12)'; g.fillRect(x0, y, x1 - x0, h);
      if (pk) {
        g.fillStyle = col; const mid = y + h / 2 + 6, amp = h / 2 - 10, gmax = Math.max(1, k.gain);
        for (let px = Math.max(0, Math.floor(x0)); px < Math.min(W, x1); px += 2) {
          const u = (px - x0) / this.pps, i = Math.floor((k.in + u) * 100); const a = (pk[i] || 0) * mtEnv(k, u) / gmax * amp;
          g.fillRect(px, mid - a, 1.5, Math.max(1, 2 * a));
        }
        // courbe de volume
        g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 1.2; g.beginPath();
        for (let px = Math.max(0, Math.floor(x0)); px <= Math.min(W, x1); px += 2) { const u = (px - x0) / this.pps, yy = y + h - 2 - mtEnv(k, u) / Math.max(1, k.gain) * (h - 18); px === Math.max(0, Math.floor(x0)) ? g.moveTo(px, yy) : g.lineTo(px, yy); }
        g.stroke(); g.lineWidth = 1;
      } else {
        g.strokeStyle = 'rgba(255,42,58,.35)'; for (let s = Math.floor(x0) - h; s < x1; s += 10) { g.beginPath(); g.moveTo(s, y + h); g.lineTo(s + h, y); g.stroke(); }
      }
      g.fillStyle = '#e8ecf1'; g.font = '700 11px "Chakra Petch", "Segoe UI", sans-serif';
      const dB = k.gain > 0 ? 20 * Math.log10(k.gain) : -99;
      g.fillText((buf ? '' : loading ? 'Chargement… ' : 'Fichier absent · ') + k.name + (Math.abs(dB) > 0.05 ? `  ${dB > 0 ? '+' : ''}${dB.toFixed(1).replace('.', ',')} dB` : ''), Math.max(x0 + 6, 24), y + 9);
      g.restore();
      g.strokeStyle = sel ? '#ffffff' : col; g.lineWidth = sel ? 2 : 1; g.strokeRect(x0 + 0.5, y + 0.5, x1 - x0 - 1, h - 1); g.lineWidth = 1;
      // poignées de fondu
      if (x1 - x0 > 20) [[k.at + k.fi, 'fi'], [k.at + len - k.fo, 'fo']].forEach(([t]) => { const x = this.X(t); g.fillStyle = sel ? '#ffffff' : col; g.fillRect(x - 4, y + 1, 8, 8); });
    }
    // tête de lecture
    const px = this.X(this.pos());
    if (px >= -2 && px <= W + 2) { g.strokeStyle = '#ff2a3a'; g.lineWidth = 2; g.beginPath(); g.moveTo(px, 0); g.lineTo(px, H); g.stroke(); g.lineWidth = 1; g.fillStyle = '#ff2a3a'; g.beginPath(); g.moveTo(px - 6, 0); g.lineTo(px + 6, 0); g.lineTo(px, 9); g.fill(); }
    // libellés de piste
    g.font = '800 12px "Chakra Petch", "Segoe UI", sans-serif';
    ['A', 'B'].forEach((l, i) => { g.fillStyle = colors[i]; g.fillRect(0, MT_RUL + i * MT_TH, 18, 18); g.fillStyle = '#061014'; g.fillText(l, 5, MT_RUL + i * MT_TH + 10); });
    const sc = this.el('mtScroll'), span = W / this.pps, mx = Math.max(0, this.end() + 5 - span);
    sc.max = String(mx.toFixed(2)); sc.value = String(Math.min(this.sx, mx));
  },
  ui(light) {
    if (!this.isOpen) return;
    const p = this.pos();
    this.el('mtTime').textContent = `${fmtPrecise(p)} / ${fmtPrecise(this.end())}`;
    const pb = this.el('mtPlay'); pb.setAttribute('aria-pressed', String(this.playing)); pb.textContent = this.playing ? '❚❚ Pause' : '▶ Lecture';
    const rb = this.el('mtRec'); rb.setAttribute('aria-pressed', String(recording)); rb.textContent = recording ? `■ Arrêter l’enregistrement (${fmt(recFrames / (ctx ? ctx.sampleRate : 48000))})` : '● Enregistrer le master';
    if (light) return;
    const k = this.selClip();
    this.el('mtUndo').disabled = !this.undo.length; this.el('mtRedo').disabled = !this.redo.length;
    this.el('mtDel').disabled = !k; this.el('mtSplit').disabled = !this.clips.length;
    this.el('mtX').disabled = !k; this.el('mtPrev').disabled = !this.transitions().length;
    this.el('mtProj').textContent = PROJ.cur ? `Projet « ${PROJ.cur.name} » · ${this.clips.length} clip(s) · ${this.transitions().length} transition(s)` : '';
    ['mtGain', 'mtFi', 'mtFic', 'mtFo', 'mtFoc'].forEach(id => { this.el(id).disabled = !k; });
    if (k) {
      const len = mtLen(k), dB = k.gain > 0 ? 20 * Math.log10(k.gain) : -24;
      this.el('mtName').textContent = `${k.name} · piste ${k.track ? 'B' : 'A'}` + (this.bufs.has(k.ref) || this.loading.has(k.ref) ? '' : ' · fichier absent');
      this.el('mtPos').textContent = `${fmtPrecise(k.at)} → ${fmtPrecise(k.at + len)} (${fmtPrecise(len)})`;
      this.el('mtSrc').textContent = `${fmtPrecise(k.in)} → ${fmtPrecise(k.out)}`;
      const set = (id, v) => { const e = this.el(id); if (document.activeElement !== e) e.value = v; };
      set('mtGain', dB.toFixed(1)); this.el('mtGainV').textContent = `${dB > 0 ? '+' : ''}${dB.toFixed(1).replace('.', ',')} dB`;
      set('mtFi', +k.fi.toFixed(2)); set('mtFo', +k.fo.toFixed(2)); set('mtFic', k.fic); set('mtFoc', k.foc);
      this.el('mtFi').max = this.el('mtFo').max = String(len.toFixed(2));
    } else { ['mtName', 'mtPos', 'mtSrc'].forEach(id => { this.el(id).textContent = '—'; }); this.el('mtGainV').textContent = '—'; }
    const tx = this.transitions();
    this.el('mtXinfo').textContent = tx.length ? tx.map((x, i) => `${i + 1}. « ${x.from.name} » → « ${x.to.name} » : ${(x.e - x.s).toFixed(1).replace('.', ',')} s à ${fmt(x.s)} (${MT_CURVES[x.to.fic] || ''})`).join(' · ')
      : 'Sélectionne un clip puis « Fondre avec le clip précédent » : il passe sur l’autre piste et recouvre la fin du précédent.';
    const g = this.el('mtGrid'), b = this.el('mtBpm'); g.checked = this.grid.on; if (document.activeElement !== b) b.value = this.grid.bpm;
  },
  // ---------- souris / doigt ----------
  hit(x, y) {
    const t = this.sx + x / this.pps;
    if (y < MT_RUL) return { kind: 'ruler', t };
    const tr = y < MT_RUL + MT_TH ? 0 : y < MT_RUL + 2 * MT_TH ? 1 : -1;
    const list = this.clips.filter(k => k.track === tr).sort((a, b) => (a.id === this.sel) - (b.id === this.sel)).reverse();
    for (const k of list) {
      const len = mtLen(k), x0 = this.X(k.at), x1 = this.X(k.at + len), top = MT_RUL + tr * MT_TH + 4;
      if (x1 - x0 > 20 && y < top + 14) {
        if (Math.abs(x - this.X(k.at + k.fi)) <= 7) return { kind: 'fi', k, t };
        if (Math.abs(x - this.X(k.at + len - k.fo)) <= 7) return { kind: 'fo', k, t };
      }
      if (x >= x0 - 2 && x <= x1 + 2) {
        if (x1 - x0 > 24 && x - x0 < 8) return { kind: 'l', k, t };
        if (x1 - x0 > 24 && x1 - x < 8) return { kind: 'r', k, t };
        return { kind: 'move', k, t };
      }
    }
    return { kind: 'empty', t, tr };
  },
  initPointer() {
    const cv = this.el('mtCv');
    const xy = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.addEventListener('pointermove', e => {
      const [x, y] = xy(e);
      if (!this.drag) { const h = this.hit(x, y); cv.style.cursor = h.kind === 'l' || h.kind === 'r' ? 'ew-resize' : h.kind === 'fi' || h.kind === 'fo' ? 'col-resize' : h.kind === 'move' ? 'grab' : 'text'; return; }
      const d = this.drag, dt = (x - d.x) / this.pps, t = this.sx + x / this.pps;
      if (d.kind === 'seek') { this.ph = Math.max(0, t); this.draw(); this.ui(true); return; }
      const k = this.clips.find(c => c.id === d.id), o = d.orig; if (!k) return;
      if (Math.abs(x - d.x) > 2 || Math.abs(y - d.y) > 2) d.moved = true;
      if (d.kind === 'move') {
        const len = mtLen(o); let at = Math.max(0, o.at + dt);
        const sa = this.snapT(at, k.id, e.altKey), se = this.snapT(at + len, k.id, e.altKey) - len;
        at = Math.abs(sa - at) <= Math.abs(se - at) ? (sa !== at ? sa : se) : se; k.at = Math.max(0, at);
        if (y >= MT_RUL && y < MT_RUL + 2 * MT_TH) k.track = y < MT_RUL + MT_TH ? 0 : 1;
      } else if (d.kind === 'l') {
        let at = this.snapT(o.at + dt, k.id, e.altKey);
        let inn = clamp(o.in + (at - o.at), Math.max(0, o.in - o.at), o.out - 0.05); k.in = inn; k.at = o.at + (inn - o.in);
      } else if (d.kind === 'r') {
        const max = (this.bufs.get(k.ref) || {}).duration || o.out;
        const end = this.snapT(o.at + mtLen(o) + dt, k.id, e.altKey); k.out = clamp(o.in + (end - o.at), o.in + 0.05, max);
      } else if (d.kind === 'fi') { k.fis = 0; k.fi = clamp(t - k.at, 0, Math.max(0, mtLen(k) - Math.min(k.fo, mtLen(k)))); }
      else if (d.kind === 'fo') { k.foe = 0; k.fo = clamp(k.at + mtLen(k) - t, 0, Math.max(0, mtLen(k) - Math.min(k.fi, mtLen(k)))); }
      this.draw(); this.ui();
    });
    cv.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      const [x, y] = xy(e), h = this.hit(x, y);
      cv.setPointerCapture(e.pointerId);
      if (h.kind === 'ruler' || h.kind === 'empty') {
        if (h.kind === 'empty') this.sel = null;
        this.wasPlaying = this.playing; if (this.playing) this.stop();
        this.ph = Math.max(0, h.t); this.drag = { kind: 'seek' }; this.draw(); this.ui(); return;
      }
      this.sel = h.k.id;
      this.drag = { kind: h.kind, id: h.k.id, x, y, orig: { ...h.k }, before: this.snap(), moved: false };
      this.draw(); this.ui();
    });
    const up = () => {
      const d = this.drag; if (!d) return; this.drag = null;
      if (d.kind === 'seek') { if (this.wasPlaying) { this.startPos = this.ph; this.play(this.ph); } this.draw(); this.ui(); return; }
      if (!d.moved) { this.clips = JSON.parse(d.before); this.draw(); this.ui(); return; }
      this.normalize();
      if (d.kind === 'l' || d.kind === 'r') { const kk = this.clips.find(x => x.id === d.id); if (kk && !kk.fis && !kk.foe && kk.fi + kk.fo > mtLen(kk)) mtFitFades(kk); }   // clip raccourci : fondus recalés
      if (this.badOverlap()) { this.clips = JSON.parse(d.before); this.st('Deux clips ne peuvent pas se chevaucher sur la même piste : pour une transition, mets-les sur A et sur B.'); this.draw(); this.ui(); return; }
      if (d.kind !== 'fi' && d.kind !== 'fo') this.followFades(JSON.parse(d.before));
      const k = this.selClip();
      const lbl = { move: 'Clip déplacé', l: 'Début du clip raccourci', r: 'Fin du clip raccourcie', fi: 'Fondu d’entrée réglé', fo: 'Fondu de sortie réglé' }[d.kind];
      this.commit(d.before, k ? `${lbl} : « ${k.name} » ${fmtPrecise(k.at)} → ${fmtPrecise(k.at + mtLen(k))}.` : lbl);
    };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    cv.addEventListener('wheel', e => {
      e.preventDefault();
      if (e.ctrlKey) { const [x] = xy(e); this.zoom(e.deltaY < 0 ? 1.2 : 1 / 1.2, x); return; }
      this.sx = Math.max(0, this.sx + (e.deltaX || e.deltaY) / this.pps); this.draw();
    }, { passive: false });
  },
  open() {
    this.isOpen = true; this.el('mt').hidden = false; document.body.classList.add('mt-open');
    this.fillMedia(); this.draw(); this.prepare(); if (!this.clips.length) this.st('Ajoute des morceaux sur A et B, ou « Monter toute la liste » pour enchaîner tout le projet.');
    this.el('mtPlay').focus({ preventScroll: true });
  },
  close() { this.stop(); this.isOpen = false; this.el('mt').hidden = true; document.body.classList.remove('mt-open'); this.el('mtBtn').focus({ preventScroll: true }); },
  init() {
    const $ = id => this.el(id), on = (id, ev, fn) => $(id).addEventListener(ev, fn);
    const curves = Object.entries(MT_CURVES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
    ['mtFic', 'mtFoc', 'mtXcurve'].forEach(id => { $(id).innerHTML = curves; });
    on('mtBtn', 'click', () => this.open()); on('mtClose', 'click', () => this.close());
    on('mtPlay', 'click', () => this.toggle()); on('mtHome', 'click', () => this.home()); on('mtStop', 'click', () => this.hardStop());
    on('mtZi', 'click', () => this.zoom(1.5)); on('mtZo', 'click', () => this.zoom(1 / 1.5)); on('mtFit', 'click', () => this.fit());
    on('mtGrid', 'change', e => { this.grid.on = e.target.checked; this.draw(); PROJ.schedule(); });
    on('mtBpm', 'change', e => { const v = +e.target.value; if (v >= 40 && v <= 250) { this.grid.bpm = v; this.draw(); PROJ.schedule(); } else this.ui(); });
    on('mtAddA', 'click', () => this.addClip(0)); on('mtAddB', 'click', () => this.addClip(1)); on('mtBuild', 'click', () => this.build());
    on('mtSplit', 'click', () => this.split()); on('mtDel', 'click', () => this.del());
    on('mtUndo', 'click', () => this.doUndo()); on('mtRedo', 'click', () => this.doRedo());
    on('mtX', 'click', () => this.makeTransition()); on('mtPrev', 'click', () => this.previewTx());
    on('mtRec', 'click', () => { recBtn.click(); setTimeout(() => this.ui(true), 300); });
    on('mtScroll', 'input', e => { this.sx = +e.target.value; this.draw(); });
    on('mtGain', 'input', e => { this.el('mtGainV').textContent = `${+e.target.value > 0 ? '+' : ''}${(+e.target.value).toFixed(1).replace('.', ',')} dB`; });
    on('mtGain', 'change', e => this.setSel('gain', +e.target.value <= -24 ? 0 : Math.pow(10, +e.target.value / 20)));
    on('mtFi', 'change', e => this.setSel('fi', Math.max(0, +e.target.value || 0)));
    on('mtFo', 'change', e => this.setSel('fo', Math.max(0, +e.target.value || 0)));
    on('mtFic', 'change', e => this.setSel('fic', e.target.value)); on('mtFoc', 'change', e => this.setSel('foc', e.target.value));
    this.initPointer();
    window.addEventListener('resize', () => this.draw());
    setInterval(() => { if (this.isOpen && recording) this.ui(true); }, 500);
    // raccourcis du montage : ils passent avant ceux de la console tant que l'écran Montage est ouvert
    window.addEventListener('keydown', e => {
      if (!this.isOpen || document.querySelector('dialog[open]')) return;
      const t = e.target; if (t && t.closest && t.closest('input, select, textarea')) return;
      const k = e.key, mod = e.ctrlKey || e.metaKey; let used = true;
      if (mod && (k === 'z' || k === 'Z') && !e.shiftKey) this.doUndo();
      else if (mod && (k === 'y' || k === 'Y' || ((k === 'z' || k === 'Z') && e.shiftKey))) this.doRedo();
      else if (mod || e.altKey) used = false;
      else if (e.code === 'Space') this.toggle();
      else if (e.code === 'KeyS') this.split();
      else if (k === 'Delete' || k === 'Backspace') this.del();
      else if (k === 'Home') this.home();
      else if (k === 'Escape') this.close();
      else used = false;
      e.stopImmediatePropagation(); if (used) e.preventDefault();
    }, true);
  }
};
MT.init();

