/* ---------- Sauvegarde locale : préférences de la console + réglages par morceau ---------- */
// Un morceau est identifié par sa taille et deux empreintes de son contenu : un autre fichier portant
// le même nom n'hérite donc pas des repères d'un autre morceau.
function fileId(ab) {
  const u8 = new Uint8Array(ab), n4 = u8.length >> 2, u32 = new Uint32Array(ab, 0, n4);
  let h1 = 0x811c9dc5, h2 = 5381;
  for (let i = 0; i < n4; i++) { const x = u32[i]; h1 = Math.imul(h1 ^ x, 16777619); h2 = (Math.imul(h2, 33) + x) | 0; }
  for (let i = n4 * 4; i < u8.length; i++) { h1 = Math.imul(h1 ^ u8[i], 16777619); h2 = (Math.imul(h2, 33) + u8[i]) | 0; }
  return u8.length.toString(36) + '-' + (h1 >>> 0).toString(36) + '-' + (h2 >>> 0).toString(36);
}
var STORE = {
  KEY: 'jdj.sauvegarde.v1', ready: false, data: { app: 'J-DJ', version: 1, prefs: {}, tracks: {} }, ok: true, timer: 0,
  st(t) { const el = document.getElementById('saveSt'); if (el) el.textContent = t; },
  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) { const v = this.validate(JSON.parse(raw)); if (v) this.data = v; }
      localStorage.setItem(this.KEY + '.test', '1'); localStorage.removeItem(this.KEY + '.test');
    } catch (e) { this.ok = false; }
    this.st(this.ok ? `Sauvegarde automatique sur cet ordinateur · ${Object.keys(this.data.tracks).length} morceau(x) mémorisé(s).`
                    : 'Sauvegarde automatique indisponible dans ce navigateur (mode privé ?). Utilise « Exporter la sauvegarde ».');
  },
  write() { if (typeof PROJ !== 'undefined') PROJ.schedule(); if (!this.ok) return; try { localStorage.setItem(this.KEY, JSON.stringify(this.data)); } catch (e) { this.st('Sauvegarde impossible : espace de stockage plein ou bloqué. Exporte la sauvegarde.'); } },
  schedule() { if (!this.ready) return; clearTimeout(this.timer); this.timer = setTimeout(() => { this.collectPrefs(); this.write(); }, 400); },
  collectPrefs() {
    const p = { controls: {}, decks: {}, outputs: { master: HP.masterId, cue: HP.deviceId }, midi: (typeof MIDI !== 'undefined') ? MIDI.map : {} };
    for (const k in CTRL) p.controls[k] = +CTRL[k].value.toFixed(4);
    decks.forEach(d => { p.decks[d.id] = { keyLock: d.keyLock, zoom: d.zoomSec, loopBeats: d.loopBeats }; });
    if (typeof FX_PREFS === 'function') p.fx = FX_PREFS();
    this.data.prefs = p;
  },
  applyPrefs() {
    const p = this.data.prefs || {};
    for (const k in (p.controls || {})) if (CTRL[k]) CTRL[k].set(p.controls[k]);
    decks.forEach(d => { const q = (p.decks || {})[d.id]; if (!q) return; if (q.zoom) d.setZoom(q.zoom); if (q.loopBeats) d.loopBeats = q.loopBeats; d.wantKeyLock = !!q.keyLock; d.ui(); });
    if (p.outputs) { HP.masterId = p.outputs.master || ''; HP.deviceId = ''; HP.wantCue = p.outputs.cue || ''; }
    if (p.midi && typeof MIDI !== 'undefined') MIDI.map = p.midi;
  },
  saveTrack(d) {
    if (!d.trackId) return;
    const prev = this.data.tracks[d.trackId] || {};
    this.data.tracks[d.trackId] = { name: d.name, bpm: d.bpmManual ? d.bpm : null, downbeat: d.downbeat, hot: d.hot.slice(), cue: d.cue, genre: prev.genre || '', saved: Date.now() };
    this.write();
  },
  // genre choisi dans la bibliothèque : mémorisé avec les autres réglages du morceau
  setGenre(id, name, g) {
    if (!id) return;
    const t = this.data.tracks[id] || { name, bpm: null, downbeat: null, hot: [null, null, null, null], cue: 0 };
    t.genre = g; t.saved = Date.now(); this.data.tracks[id] = t; this.write();
  },
  restoreTrack(d) {
    const t = d.trackId && this.data.tracks[d.trackId]; if (!t) return '';
    const parts = [];
    if (t.bpm) { d.bpm = t.bpm; d.bpmManual = true; parts.push('BPM ' + String(t.bpm).replace('.', ',')); }
    if (t.downbeat !== null && t.downbeat < d.duration) { d.downbeat = t.downbeat; parts.push('premier temps'); }
    const n = t.hot.filter((h, i) => { if (h !== null && h < d.duration) { d.hot[i] = h; return true; } return false; }).length;
    if (n) parts.push(n + (n > 1 ? ' repères rapides' : ' repère rapide'));
    if (t.cue && t.cue < d.duration) d.cue = t.cue;
    d.updateEcho(); d.ui();
    return parts.length ? 'Réglages du morceau restaurés : ' + parts.join(', ') + '.' : '';
  },
  // contrôle strict d'une sauvegarde : renvoie une copie propre, ou null si invalide
  validate(o) {
    if (!o || typeof o !== 'object' || o.app !== 'J-DJ' || o.version !== 1 || typeof o.tracks !== 'object' || o.tracks === null || Array.isArray(o.tracks)) return null;
    const num = (x, lo, hi) => typeof x === 'number' && isFinite(x) && x >= lo && x <= hi;
    const tracks = {};
    for (const [id, t] of Object.entries(o.tracks)) {
      if (!/^[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/.test(id) || !t || typeof t !== 'object') return null;
      if (t.bpm !== null && !num(t.bpm, 40, 250)) return null;
      if (t.downbeat !== null && !num(t.downbeat, 0, 1e6)) return null;
      if (!Array.isArray(t.hot) || t.hot.length !== 4 || !t.hot.every(h => h === null || num(h, 0, 1e6))) return null;
      tracks[id] = { name: String(t.name || '').slice(0, 200), bpm: t.bpm, downbeat: t.downbeat, hot: t.hot.slice(), cue: num(t.cue, 0, 1e6) ? t.cue : 0, genre: ['rap', 'rnb', 'punk', 'electro'].includes(t.genre) ? t.genre : '', saved: num(t.saved, 0, 1e15) ? t.saved : 0 };
    }
    const prefs = (o.prefs && typeof o.prefs === 'object' && !Array.isArray(o.prefs)) ? o.prefs : {};
    const controls = {};
    if (prefs.controls && typeof prefs.controls === 'object') for (const [k, v] of Object.entries(prefs.controls)) if (/^[A-Za-z0-9.]+$/.test(k) && num(v, -10, 10)) controls[k] = v;
    const dk = {};
    if (prefs.decks && typeof prefs.decks === 'object') for (const id of ['A', 'B']) { const q = prefs.decks[id]; if (q && typeof q === 'object') dk[id] = { keyLock: !!q.keyLock, zoom: num(q.zoom, 2, 32) ? q.zoom : 8, loopBeats: num(q.loopBeats, 0.5, 16) ? q.loopBeats : 4 }; }
    const outputs = prefs.outputs && typeof prefs.outputs === 'object' ? { master: String(prefs.outputs.master || '').slice(0, 200), cue: String(prefs.outputs.cue || '').slice(0, 200) } : {};
    const midi = {};
    if (prefs.midi && typeof prefs.midi === 'object') for (const [k, v] of Object.entries(prefs.midi)) if (/^[0-9a-f]{1,2}:\d{1,3}:\d{1,3}$/.test(k) && typeof v === 'string' && v.length < 40) midi[k] = v;
    const fx = prefs.fx && typeof prefs.fx === 'object' ? prefs.fx : undefined;
    return { app: 'J-DJ', version: 1, prefs: { controls, decks: dk, outputs, midi, fx }, tracks };
  },
  async exportFile() {
    this.collectPrefs();
    const blob = new Blob([JSON.stringify({ ...this.data, exported: new Date().toISOString() }, null, 1)], { type: 'application/json' });
    const r = await saveFile(blob, `j-dj-sauvegarde-${stampNow()}.json`);
    this.st(r === 'ok' ? `Sauvegarde exportée (${Object.keys(this.data.tracks).length} morceau(x)).` : r === 'declined' ? '' : 'Export indisponible ici.');
  },
  async importFile(f) {
    let v = null;
    try { v = this.validate(JSON.parse(await f.text())); } catch (e) { v = null; }
    if (!v) { this.st('Fichier de sauvegarde invalide : rien n’a été modifié.'); return false; }
    Object.assign(this.data.tracks, v.tracks);           // fusion : les morceaux importés remplacent ceux de même empreinte
    this.data.prefs = v.prefs; this.write(); this.applyPrefs();
    decks.forEach(d => { if (d.trackId && v.tracks[d.trackId]) { const m = this.restoreTrack(d); if (m) d.say(m); } });
    this.st(`Sauvegarde importée : ${Object.keys(v.tracks).length} morceau(x), préférences appliquées.`);
    return true;
  }
};
/* Illustrations de genre (JPEG 320 px intégrés pour l'usage hors ligne) : utilisées quand le MP3 n'a pas sa propre pochette */
const GENRE_ART = {
  rap: '{{JW-MORCEAU:donnees/11-sauvegarde-locale-preferences-de-la-cons-01-jpeg.txt}}',
  rnb: '{{JW-MORCEAU:donnees/11-sauvegarde-locale-preferences-de-la-cons-02-jpeg.txt}}',
  punk: '{{JW-MORCEAU:donnees/11-sauvegarde-locale-preferences-de-la-cons-03-jpeg.txt}}',
  electro: '{{JW-MORCEAU:donnees/11-sauvegarde-locale-preferences-de-la-cons-04-jpeg.txt}}'
};
const GENRES = [['rap', 'Rap'], ['rnb', 'R&B'], ['punk', 'Punk'], ['electro', 'Électro']];
const genreLabel = g => (GENRES.find(x => x[0] === g) || [, ''])[1];
// genre ID3 (texte libre ou numéro ID3v1 entre parenthèses) → l'un des 4 styles, sinon aucun
function genreOf(raw) {
  if (!raw) return '';
  const num = { 7: 'rap', 15: 'rap', 42: 'rnb', 14: 'rnb', 43: 'punk', 17: 'punk', 26: 'electro', 52: 'electro', 18: 'electro', 31: 'electro', 35: 'electro', 127: 'electro' };
  const m = String(raw).match(/^\((\d+)\)/); if (m && num[+m[1]]) return num[+m[1]];
  const s = norm(String(raw));
  if (/hip.?hop|rap|trap|drill|grime/.test(s)) return 'rap';
  if (/r.?&.?b|rnb|r and b|soul|neo.?soul/.test(s)) return 'rnb';
  if (/punk|hardcore|grunge|rock/.test(s)) return 'punk';
  if (/electro|electronic|techno|house|edm|trance|dance|dubstep|drum.?n|jungle|synth/.test(s)) return 'electro';
  return '';
}
// pochette affichée : celle du MP3 en priorité, sinon l'illustration du genre, sinon le disque
const artOf = it => (it && (it.cover || GENRE_ART[it.genre])) || '';
