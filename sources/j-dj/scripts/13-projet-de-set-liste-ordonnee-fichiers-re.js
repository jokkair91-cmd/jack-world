/* ---------- Projet de set : liste ordonnée, fichiers, repères, platines, réglages et exports ----------
   Enregistré automatiquement dans le navigateur (IndexedDB « jdj-projets »), rouvert au démarrage.
   Les fichiers audio peuvent être gardés dans le projet (recommandé) ; sinon ils sont « à relier » à la réouverture.
   Transfert vers un autre profil ou ordinateur : fichier .jdjset (avec ou sans les sons). */
const PROJ_FMT = 'jdj-projet', PROJ_LAST = 'jdj.projet.dernier', SET_MAGIC = 'JDJSET01';
var PROJ = {
  db: null, cur: null, persisted: false, note: '', timer: 0, saving: Promise.resolve(), applying: false, booted: false, needGc: false, savedAt: 0, warn: '',
  el(id) { return document.getElementById(id); },
  open() {
    return this.db || (this.db = new Promise((res, rej) => {
      try {
        const r = indexedDB.open('jdj-projets', 1);
        r.onupgradeneeded = () => { r.result.createObjectStore('projects'); r.result.createObjectStore('media'); };
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
      } catch (e) { rej(e); }
    }));
  },
  tx(stores, mode, fn) { return this.open().then(db => new Promise((res, rej) => { const t = db.transaction(stores, mode); let v; t.oncomplete = () => res(v && 'result' in v ? v.result : v); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); v = fn(t); })); },
  get(store, key) { return this.tx([store], 'readonly', t => t.objectStore(store).get(key)); },
  all(store) { return this.tx([store], 'readonly', t => t.objectStore(store).getAll()).then(r => r || []); },
  keys(store) { return this.tx([store], 'readonly', t => t.objectStore(store).getAllKeys()).then(r => r || []); },
  newMeta(name) { const now = Date.now(); return { format: PROJ_FMT, v: 1, id: 'p' + now.toString(36) + Math.floor(Math.random() * 1e6).toString(36), name: name || 'Mon set', created: now, updated: now, keepMedia: true, exports: [] }; },
  // instantané complet du projet en cours
  snapshot() {
    STORE.collectPrefs();
    const tracks = PL.items.filter(x => x.status !== 'bad' && (x.demo || x.id)).map(x => x.demo ? { demo: x.demo, played: x.played || 0 }
      : { id: x.id, name: x.name, artist: x.artist || '', genre: x.genre || '', fileName: x.fileName || '', size: x.size || 0, dur: x.dur || null, bpm: x.bpm || null, added: x.added || 0, played: x.played || 0 });
    const settings = {};
    tracks.forEach(t => { if (t.id && STORE.data.tracks[t.id]) settings[t.id] = STORE.data.tracks[t.id]; });
    const dks = {};
    decks.forEach(d => {
      const it = d.buffer && PL.items.find(x => x.key === d.libKey); if (!it || it.status === 'bad' || (!it.demo && it.id !== d.trackId)) return;
      const lp = d.roll ? d.roll.loop : d.loop;
      dks[d.id] = { ref: it.demo ? 'demo:' + it.demo : it.id, pos: +d.position().toFixed(3), tempo: d.tempo, keyLock: !!(d.keyLock || d.wantKeyLock), loop: lp ? { start: lp.start, end: lp.end, beats: lp.beats || null } : null };
    });
    return { ...this.cur, tracks, decks: dks, montage: MT.data(), store: { app: 'J-DJ', version: 1, prefs: STORE.data.prefs, tracks: settings } };
  },
  schedule() {
    if (!this.booted || this.applying || !this.cur) return;
    clearTimeout(this.timer); this.timer = setTimeout(() => this.save(), 700);
  },
  save(force) {
    if (!this.cur) return Promise.resolve();
    clearTimeout(this.timer);
    return (this.saving = this.saving.then(() => this._save(force)).catch(() => {}));
  },
  async _save(force) {
    // projet vierge jamais enregistré (seulement les démos) : rien à garder
    if (!force && !this.persisted && !PL.items.some(x => !x.demo) && !decks.some(d => d.buffer)) return;
    const p = this.snapshot(); p.updated = Date.now(); this.cur.updated = p.updated;
    try { await this.tx(['projects'], 'readwrite', t => { t.objectStore('projects').put(p, p.id); }); this.persisted = true; }
    catch (e) { this.warn = 'Enregistrement du projet impossible (stockage plein ou bloqué) : exporte-le en .jdjset.'; this.ui(); return; }
    try { localStorage.setItem(PROJ_LAST, p.id); } catch (e) {}
    this.warn = '';
    if (this.cur.keepMedia) {
      const have = new Set(await this.keys('media').catch(() => []));
      for (const it of PL.items) {
        if (it.demo || !it.file || !it.id || it.status !== 'ok') continue;
        if (have.has(it.id)) { it.stored = true; continue; }
        try { await this.tx(['media'], 'readwrite', t => { t.objectStore('media').put({ name: it.fileName || it.file.name, type: it.file.type || '', blob: it.file }, it.id); }); it.stored = true; have.add(it.id); }
        catch (e) { this.warn = 'Place insuffisante dans le navigateur : certains fichiers audio ne sont pas gardés et seront à relier à la réouverture. Exporte le projet avec les sons pour les garder.'; break; }
      }
    }
    if (this.needGc) { this.needGc = false; await this.gc(); }
    this.savedAt = Date.now(); this.ui();
    try { const u = JSON.parse(localStorage.getItem(PROJ_LAST + '.urgence') || 'null'); if (u && u.id === p.id && u.at <= p.updated) localStorage.removeItem(PROJ_LAST + '.urgence'); } catch (e) {}
  },
  // supprime les fichiers audio gardés qui ne servent plus à aucun projet
  async gc() {
    try {
      const used = new Set(), ps = await this.all('projects');
      ps.forEach(p => { if (p.keepMedia) { p.tracks.forEach(t => t.id && used.add(t.id)); ((p.montage && p.montage.clips) || []).forEach(k => k.ref && used.add(k.ref)); } });
      const ks = await this.keys('media');
      const drop = ks.filter(k => !used.has(k));
      if (drop.length) await this.tx(['media'], 'readwrite', t => { drop.forEach(k => t.objectStore('media').delete(k)); });
    } catch (e) {}
  },
  unloadDecks() {
    decks.forEach(d => {
      d.stop(); d.loadReq = (d.loadReq || 0) + 1;
      Object.assign(d, { buffer: null, name: '', trackId: null, libKey: null, bpm: null, beat0: null, gridSrc: null, repeat: false, offset: 0, cue: 0, loop: null, roll: null, loading: false,
        hot: [null, null, null, null], downbeat: null, artist: '', cover: '', genre: '', scratching: false });
      d.tempoCtl.set(0); d.buildFinePeaks(); d.renderWave(); d.ui();
    });
  },
  // ouvre un projet : réglages, liste ordonnée, fichiers gardés, puis platines
  async apply(p) {
    this.applying = true;
    try {
      this.unloadDecks();
      Object.assign(STORE.data.tracks, p.store.tracks);
      STORE.data.prefs = p.store.prefs; STORE.applyPrefs(); STORE.write();
      PL.items.forEach(x => { if (x.cover && x.cover.startsWith('blob:')) URL.revokeObjectURL(x.cover); });
      this.persisted = true;
      this.cur = { format: PROJ_FMT, v: 1, id: p.id, name: p.name, created: p.created, updated: p.updated, keepMedia: p.keepMedia, exports: p.exports || [] };
      const items = []; let missing = 0;
      for (const t of p.tracks) {
        if (t.demo) { const s = STYLE_DEMOS.find(x => x.style === t.demo); if (s) items.push(PL.demoItem(s, t)); continue; }
        const it = { key: 'k' + (PL.seq++), name: t.name || t.fileName || 'Sans titre', artist: t.artist, cover: '', fileName: t.fileName, genre: t.genre || (STORE.data.tracks[t.id] || {}).genre || '',
          size: t.size, id: t.id, bpm: t.bpm, dur: t.dur, file: null, status: 'missing', played: t.played, added: t.added, stored: false };
        let m = null; try { m = await this.get('media', t.id); } catch (e) {}
        if (m && m.blob) {
          it.file = m.blob instanceof File ? m.blob : new File([m.blob], m.name || t.fileName || 'son', { type: m.type || '' });
          it.status = 'ok'; it.stored = true;
          try { const tag = readID3(await it.file.slice(0, 2 * 1048576).arrayBuffer()); if (tag.cover) it.cover = URL.createObjectURL(tag.cover); } catch (e) {}
        } else missing++;
        items.push(it);
      }
      PL.items = items; PL.sel = null; PL.render();
      let quick = null; try { quick = JSON.parse(localStorage.getItem(PROJ_LAST + '.platines') || 'null'); } catch (e) {}
      if (!quick || quick.id !== p.id || !(quick.at > p.updated) || !quick.pos || typeof quick.pos !== 'object') quick = null;
      for (const id of ['A', 'B']) {
        const q = p.decks[id]; if (!q) continue;
        if (quick && typeof quick.pos[id] === 'number' && isFinite(quick.pos[id]) && quick.pos[id] >= 0) q.pos = quick.pos[id];   // position notée à la fermeture
        const it = q.ref.startsWith('demo:') ? items.find(x => x.demo === q.ref.slice(5)) : items.find(x => x.id === q.ref);
        if (!it || it.status !== 'ok') continue;
        const d = decks[id === 'A' ? 0 : 1];
        if ((await PL.loadTo(it, id)) !== true) continue;
        d.tempoCtl.set(q.tempo || 0);
        d.wantKeyLock = q.keyLock; if (d.n && d.n.kl) d.setKeyLock(q.keyLock);
        if (q.loop && q.loop.end <= d.duration + 1e-3 && q.loop.end - q.loop.start > 0.02) d.loop = { start: q.loop.start, end: q.loop.end, beats: q.loop.beats || d.loopBeats };
        d.offset = clamp(q.pos || 0, 0, Math.max(0, d.duration - 0.001));
        if (d.loop && (d.offset < d.loop.start || d.offset >= d.loop.end)) d.offset = d.loop.start;
        d.ui();
      }
      MT.load(p.montage || null);
      const n = items.filter(x => !x.demo).length;
      PL.st(`Projet « ${p.name} » ouvert : ${n} morceau(x)` + (missing ? `, dont ${missing} à relier (bouton « Relier… » ou « + Ajouter des morceaux » avec le même fichier).` : ', repères et platines retrouvés.'));
      return missing;
    } finally { this.applying = false; this.ui(); }
  },
  async boot() {
    this.cur = this.newMeta('Mon set');
    let last = null; try { last = localStorage.getItem(PROJ_LAST); } catch (e) {}
    try {
      let p = last && this.validate(await this.get('projects', last));
      if (p) {
        let u = null; try { u = JSON.parse(localStorage.getItem(PROJ_LAST + '.urgence') || 'null'); } catch (e) {}
        const pu = u && u.id === p.id && u.at > p.updated ? this.validate(u.p) : null;
        if (pu) { pu.id = p.id; p = pu; this.recovered = true; }      // dernières modifications d'avant la fermeture
        await this.apply(p);
      }
    } catch (e) { this.warn = 'Projets indisponibles dans ce navigateur (mode privé ?) : utilise « Exporter le projet » pour garder ton set.'; }
    this.booted = true; this.ui();
    if (this.recovered) this.save();                // la copie de secours devient l'enregistrement normal
    this.el('projBtn').addEventListener('click', () => { this.note = ''; this.ui(); this.list(); this.el('projDlg').showModal(); });
    this.el('projClose').addEventListener('click', () => this.el('projDlg').close());
    this.el('projNameIn').addEventListener('change', e => this.rename(e.target.value));
    this.el('projKeep').addEventListener('change', e => this.setKeep(e.target.checked));
    this.el('projNew').addEventListener('click', () => this.newProject());
    this.el('projExport').addEventListener('click', () => this.exportFile(true));
    this.el('projExportLight').addEventListener('click', () => this.exportFile(false));
    this.el('projImport').addEventListener('change', e => { const f = e.target.files[0]; e.target.value = ''; if (f) this.importFile(f); });
    this.el('projList').addEventListener('click', e => {
      const b = e.target.closest('button[data-pid]'); if (!b) return;
      if (b.dataset.do === 'open') this.openId(b.dataset.pid); else this.remove(b.dataset.pid);
    });
    // fermeture ou mise en arrière-plan : position des platines enregistrée
    // (l'écriture IndexedDB peut ne pas finir pendant la fermeture : les positions sont aussi notées tout de suite)
    const quick = () => {
      if (!this.cur || !this.persisted) return;
      const pos = {}; decks.forEach(d => { if (d.buffer) pos[d.id] = +d.position().toFixed(3); });
      try { localStorage.setItem(PROJ_LAST + '.platines', JSON.stringify({ id: this.cur.id, at: Date.now(), pos })); } catch (e) {}
      // copie de secours immédiate du projet (liste, repères, montage…) : rien de modifié n'est perdu si la fermeture
      // coupe l'enregistrement normal ; elle est effacée dès que l'enregistrement normal a réussi
      try { const now = Date.now(), p = this.snapshot(); p.updated = now; localStorage.setItem(PROJ_LAST + '.urgence', JSON.stringify({ id: this.cur.id, at: now, p })); } catch (e) {}
    };
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') { quick(); this.save(); } });
    window.addEventListener('pagehide', () => { quick(); this.save(); });
    setInterval(() => { if (decks.some(d => d.playing)) this.schedule(); }, 15000);
  },
  async confirmStop(what) {
    const live = decks.filter(d => d.playing || d.scratching);
    if (!live.length) return true;
    return askConfirm(`${what} arrête la lecture de ${live.map(d => 'la platine ' + d.id).join(' et ')}. Continuer ? Le projet en cours est enregistré avant.`, 'Continuer');
  },
  async newProject() {
    if (!(await this.confirmStop('Créer un nouveau projet'))) return;
    await this.save();
    this.applying = true;
    this.unloadDecks();
    PL.items.forEach(x => { if (x.cover && x.cover.startsWith('blob:')) URL.revokeObjectURL(x.cover); });
    this.cur = this.newMeta('Set du ' + new Date().toLocaleDateString('fr-FR'));
    PL.items = PL.demoItems(); PL.sel = null; PL.render(); MT.load(null);
    this.applying = false; this.persisted = false;
    await this.save(true); this.list();
    PL.st(`Nouveau projet « ${this.cur.name} » : ajoute tes morceaux.`);
  },
  async openId(id) {
    if (this.cur && id === this.cur.id) return;
    if (!(await this.confirmStop('Ouvrir un autre projet'))) return;
    await this.save();
    const p = this.validate(await this.get('projects', id).catch(() => null));
    if (!p) { this.status('Projet illisible : rien n’a été changé.'); return; }
    await this.apply(p); await this.save(); this.list();
  },
  async remove(id) {
    const p = await this.get('projects', id).catch(() => null); if (!p) return;
    const cur = this.cur && id === this.cur.id;
    if (!(await askConfirm(`Supprimer le projet « ${p.name} » de cet ordinateur ? Tes fichiers audio d’origine ne sont pas touchés.` + (cur ? ' Un nouveau projet vide sera ouvert.' : ''), 'Supprimer'))) return;
    await this.tx(['projects'], 'readwrite', t => { t.objectStore('projects').delete(id); });
    if (cur) { this.cur = null; await this.newProject(); }
    await this.gc(); this.list();
  },
  rename(name) {
    name = String(name || '').trim().slice(0, 80) || 'Mon set';
    this.cur.name = name; this.ui(); this.save().then(() => this.list());
  },
  setKeep(on) {
    this.cur.keepMedia = !!on;
    if (!on) { PL.items.forEach(x => { x.stored = false; }); this.needGc = true; }
    this.save().then(() => this.list());
  },
  addExport(info) {
    if (!this.cur) return;
    this.cur.exports = [{ ...info, at: Date.now() }, ...(this.cur.exports || [])].slice(0, 50);
    this.save();
  },
  // ---------- transfert : fichier .jdjset = « JDJSET01 » + longueur (4 octets) + description JSON + sons ----------
  async exportFile(withMedia) {
    await this.save();
    const p = this.snapshot(), parts = [], media = [];
    let off = 0;
    if (withMedia) for (const it of PL.items) {
      if (it.demo || !it.file || !it.id || it.status !== 'ok' || media.some(m => m.id === it.id)) continue;
      media.push({ id: it.id, name: it.fileName || it.file.name, type: it.file.type || '', offset: off, size: it.file.size });
      parts.push(it.file); off += it.file.size;
    }
    // sons utilisés par le montage mais absents de la liste : repris depuis le stockage du navigateur
    if (withMedia) for (const ref of new Set(MT.clips.map(k => k.ref))) {
      if (ref.startsWith('demo:') || media.some(m => m.id === ref)) continue;
      let m = null; try { m = await this.get('media', ref); } catch (e) {}
      if (!m || !m.blob) continue;
      media.push({ id: ref, name: m.name || 'son', type: m.type || '', offset: off, size: m.blob.size });
      parts.push(m.blob); off += m.blob.size;
    }
    // sons introuvables (bibliothèque et stockage local) : jamais omis en silence, l'utilisateur décide
    const absent = [];
    if (withMedia) {
      const seen = new Set(media.map(m => m.id));
      PL.items.forEach(it => { if (!it.demo && it.id && it.status !== 'bad' && !seen.has(it.id)) { seen.add(it.id); absent.push(it.name || it.fileName || it.id); } });
      MT.clips.forEach(k => { if (!k.ref.startsWith('demo:') && !seen.has(k.ref)) { seen.add(k.ref); absent.push((k.name || k.ref) + ' (montage)'); } });
      if (absent.length) {
        const list = absent.slice(0, 8).map(n => `« ${n} »`).join(', ') + (absent.length > 8 ? ` et ${absent.length - 8} autre(s)` : '');
        const go = await askConfirm(`Export incomplet : ${absent.length} son(s) introuvable(s) ne seront pas dans le fichier : ${list}. Sur l’autre ordinateur, il faudra les relier. Exporter quand même ?`, 'Exporter quand même');
        if (!go) { this.status(`Export annulé : ${absent.length} son(s) introuvable(s). Relie-les dans la bibliothèque, puis exporte à nouveau.`); return 'cancelled'; }
      }
    }
    const json = new TextEncoder().encode(JSON.stringify({ ...p, exported: new Date().toISOString(), media }));
    const head = new Uint8Array(12); head.set(new TextEncoder().encode(SET_MAGIC)); new DataView(head.buffer).setUint32(8, json.length, true);
    const blob = new Blob([head, json, ...parts], { type: 'application/octet-stream' });
    const safe = p.name.replace(/[^\p{L}\p{N} _-]+/gu, '').trim().replace(/\s+/g, '-') || 'set';
    const r = await saveFile(blob, `${safe}-${stampNow()}${withMedia ? '' : '-sans-sons'}.jdjset`);
    const miss = absent.length;
    this.status(r === 'ok' ? `Projet exporté : ${p.tracks.filter(t => t.id).length} morceau(x)` + (withMedia ? `, ${media.length} son(s), ${(blob.size / 1048576).toFixed(1).replace('.', ',')} Mo` : ', sans les sons (à relier sur l’autre ordinateur)') + (withMedia && miss ? ` ; export incomplet, ${miss} son(s) introuvable(s) non inclus.` : '.')
      : r === 'declined' ? '' : 'Export indisponible ici.');
    return r;
  },
  async importFile(f) {
    try {
      const head = new Uint8Array(await f.slice(0, 12).arrayBuffer());
      let o, media = [], base = 0;
      if (new TextDecoder().decode(head.subarray(0, 8)) === SET_MAGIC) {
        const len = new DataView(head.buffer).getUint32(8, true);
        if (len > 50 * 1048576 || 12 + len > f.size) throw new Error('taille');
        o = JSON.parse(await f.slice(12, 12 + len).text()); base = 12 + len;
        media = Array.isArray(o.media) ? o.media : [];
      } else o = JSON.parse(await f.text());
      let p, note = '';
      if (o && o.format === PROJ_FMT) p = this.validate(o);
      else { p = this.migrate(o); note = ' (ancienne sauvegarde convertie en projet)'; }
      if (!p) { this.status('Fichier invalide : rien n’a été importé.'); return false; }
      if (!(await this.confirmStop('Ouvrir le projet importé'))) return false;
      await this.save();
      const ids = new Set([...p.tracks.map(t => t.id), ...((p.montage && p.montage.clips) || []).map(k => k.ref)].filter(Boolean)); let kept = 0;
      for (const m of media) {
        if (!m || !ids.has(m.id) || !(m.size > 0) || !(m.offset >= 0) || base + m.offset + m.size > f.size) continue;
        const blob = f.slice(base + m.offset, base + m.offset + m.size, String(m.type || ''));
        if (fileId(await blob.arrayBuffer()) !== m.id) continue;            // contenu altéré : ce son sera à relier
        const file = new File([blob], String(m.name || 'son').slice(0, 200), { type: String(m.type || '') });
        try { await this.tx(['media'], 'readwrite', t => { t.objectStore('media').put({ name: file.name, type: file.type, blob: file }, m.id); }); kept++; }
        catch (e) { this.warn = 'Place insuffisante : certains sons importés sont à relier.'; break; }
      }
      const others = await this.all('projects').catch(() => []);
      p.id = this.newMeta().id; p.created = Date.now();
      if (others.some(x => x.name === p.name)) p.name = (p.name + ' (importé)').slice(0, 80);
      p.keepMedia = true;
      const missing = await this.apply(p); await this.save(); this.list();
      this.status(`Projet « ${p.name} » importé${note} : ${p.tracks.filter(t => t.id).length} morceau(x), ${kept} son(s) inclus` + (missing ? `, ${missing} à relier.` : '.'));
      return true;
    } catch (e) { this.status('Fichier illisible ou incomplet : rien n’a été importé.'); return false; }
  },
  // ancienne sauvegarde JSON (repères par morceau) → projet : les morceaux mémorisés sont à relier
  migrate(o) {
    const st = STORE.validate(o); if (!st) return null;
    const tracks = Object.entries(st.tracks).sort((a, b) => (a[1].saved || 0) - (b[1].saved || 0))
      .map(([id, t]) => ({ id, name: t.name || 'Sans titre', artist: '', genre: t.genre, fileName: '', size: parseInt(id.split('-')[0], 36) || 0, dur: null, bpm: t.bpm, added: t.saved || 0, played: 0 }));
    const p = this.newMeta('Sauvegarde importée du ' + new Date().toLocaleDateString('fr-FR'));
    return { ...p, tracks: [...STYLE_DEMOS.map(s => ({ demo: s.style, played: 0 })), ...tracks], decks: {}, store: st };
  },
  // contrôle strict d'un projet : renvoie une copie propre, ou null
  validate(o) {
    if (!o || typeof o !== 'object' || o.format !== PROJ_FMT || o.v !== 1 || !Array.isArray(o.tracks) || o.tracks.length > 5000) return null;
    const st = STORE.validate(o.store); if (!st) return null;
    const num = (x, lo, hi) => typeof x === 'number' && isFinite(x) && x >= lo && x <= hi;
    const str = (x, n = 200) => typeof x === 'string' ? x.slice(0, n) : '';
    const ID = /^[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/, tracks = [], seen = new Set();
    for (const t of o.tracks) {
      if (!t || typeof t !== 'object') return null;
      if (t.demo !== undefined) { if (!STYLE_DEMOS.some(s => s.style === t.demo)) return null; if (seen.has('demo:' + t.demo)) continue; seen.add('demo:' + t.demo); tracks.push({ demo: t.demo, played: num(t.played, 0, 1e15) ? t.played : 0 }); continue; }
      if (!ID.test(t.id)) return null; if (seen.has(t.id)) continue; seen.add(t.id);
      tracks.push({ id: t.id, name: str(t.name), artist: str(t.artist), genre: GENRES.some(g => g[0] === t.genre) ? t.genre : '', fileName: str(t.fileName, 260),
        size: num(t.size, 0, 1e13) ? t.size : 0, dur: num(t.dur, 0, 1e6) ? t.dur : null, bpm: num(t.bpm, 40, 250) ? t.bpm : null,
        added: num(t.added, 0, 1e15) ? t.added : 0, played: num(t.played, 0, 1e15) ? t.played : 0 });
    }
    const dks = {};
    for (const id of ['A', 'B']) {
      const q = o.decks && typeof o.decks === 'object' ? o.decks[id] : null; if (!q || typeof q !== 'object' || typeof q.ref !== 'string' || !seen.has(q.ref)) continue;
      const lp = q.loop && typeof q.loop === 'object' && num(q.loop.start, 0, 1e6) && num(q.loop.end, 0, 1e6) && q.loop.end > q.loop.start ? { start: q.loop.start, end: q.loop.end, beats: num(q.loop.beats, 0.03, 64) ? q.loop.beats : null } : null;
      dks[id] = { ref: q.ref, pos: num(q.pos, 0, 1e6) ? q.pos : 0, tempo: num(q.tempo, -1, 1) ? q.tempo : 0, keyLock: !!q.keyLock, loop: lp };
    }
    const exports = (Array.isArray(o.exports) ? o.exports : []).slice(0, 50).filter(x => x && typeof x === 'object')
      .map(x => ({ format: ['WAV', 'MP3', 'WAV montage', 'MP3 montage'].includes(x.format) ? x.format : 'WAV', name: str(x.name), dur: num(x.dur, 0, 1e6) ? x.dur : 0, size: num(x.size, 0, 1e13) ? x.size : 0, at: num(x.at, 0, 1e15) ? x.at : 0 }));
    return { format: PROJ_FMT, v: 1, id: typeof o.id === 'string' && /^p[a-z0-9]{4,30}$/.test(o.id) ? o.id : this.newMeta().id, name: str(o.name, 80).trim() || 'Mon set',
      created: num(o.created, 0, 1e15) ? o.created : Date.now(), updated: num(o.updated, 0, 1e15) ? o.updated : Date.now(), keepMedia: o.keepMedia !== false, exports, tracks, decks: dks, montage: this.validMontage(o.montage, num, str, ID), store: st };
  },
  // montage : clips valides seulement (sinon montage vide, le reste du projet est gardé)
  validMontage(m, num, str, ID) {
    if (!m || typeof m !== 'object' || !Array.isArray(m.clips)) return null;
    const C = Object.keys(MT_CURVES), clips = [], ids = new Set();
    for (const k of m.clips.slice(0, 2000)) {
      if (!k || typeof k !== 'object' || typeof k.ref !== 'string') return null;
      const demo = STYLE_DEMOS.some(s => 'demo:' + s.style === k.ref);
      if (!demo && !ID.test(k.ref)) return null;
      if (![0, 1].includes(k.track) || !num(k.at, 0, 1e6) || !num(k.in, 0, 1e6) || !num(k.out, 0, 1e6) || k.out - k.in < 0.01) return null;
      let id = num(k.id, 1, 1e9) ? Math.floor(k.id) : 1; while (ids.has(id)) id++; ids.add(id);
      clips.push({ id, track: k.track, ref: k.ref, name: str(k.name), at: k.at, in: k.in, out: k.out, gain: num(k.gain, 0, 4) ? k.gain : 1,
        fi: num(k.fi, 0, 1e6) ? k.fi : 0, fo: num(k.fo, 0, 1e6) ? k.fo : 0, fis: num(k.fis, -1e6, 0) ? k.fis : 0, foe: num(k.foe, 0, 1e6) ? k.foe : 0, fic: C.includes(k.fic) ? k.fic : 'eq', foc: C.includes(k.foc) ? k.foc : 'eq' });
    }
    return { clips, grid: { on: !(m.grid && m.grid.on === false), bpm: m.grid && num(m.grid.bpm, 40, 250) ? m.grid.bpm : 120 }, pps: num(m.pps, 1, 1000) ? m.pps : 40 };
  },
  status(t) { if (!t) return; this.note = t; PL.st(t); this.ui(); },
  ui() {
    if (!this.cur) return;
    this.el('projName').textContent = this.cur.name;
    const inp = this.el('projNameIn'); if (document.activeElement !== inp) inp.value = this.cur.name;
    this.el('projKeep').checked = this.cur.keepMedia;
    const files = PL.items.filter(x => !x.demo), miss = files.filter(x => x.status === 'missing').length;
    const t = this.savedAt ? new Date(this.savedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';
    const txt = this.warn || this.note || ((t ? `Enregistré automatiquement à ${t}` : 'Enregistrement automatique dès le premier changement') + ` · ${files.length} morceau(x)` + (miss ? ` · ${miss} à relier` : '') + (this.cur.keepMedia ? ' · sons gardés dans le navigateur' : ' · sons non gardés (à relier à la réouverture)'));
    this.el('projSt').textContent = txt;
    this.el('projBtn').title = `Projet « ${this.cur.name} » — ${txt}`;
    const fmtD = ts => new Date(ts).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    this.el('projExp').innerHTML = (this.cur.exports || []).map(x => `<li>${x.format} · ${escHtml(x.name)} · ${fmt(x.dur || 0)}${x.size ? ' · ' + (x.size / 1048576).toFixed(1).replace('.', ',') + ' Mo' : ''} · ${fmtD(x.at)}</li>`).join('') || '<li>Aucun export pour l’instant (Enregistrer le mix, puis Télécharger).</li>';
  },
  async list() {
    const ul = this.el('projList');
    let ps = []; try { ps = await this.all('projects'); } catch (e) {}
    ps.sort((a, b) => b.updated - a.updated);
    const fmtD = ts => new Date(ts).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    ul.innerHTML = ps.map(p => { const cur = this.cur && p.id === this.cur.id, n = p.tracks.filter(t => t.id).length;
      return `<li class="${cur ? 'cur' : ''}"><span>${escHtml(p.name)}${cur ? ' <b>(ouvert)</b>' : ''}<small>${n} morceau(x) · modifié le ${fmtD(p.updated)}</small></span>
        <button class="btn small" data-do="open" data-pid="${p.id}" ${cur ? 'disabled' : ''}>Ouvrir</button><button class="btn small del" data-do="del" data-pid="${p.id}" aria-label="Supprimer le projet ${escHtml(p.name)}">✕</button></li>`; }).join('')
      || '<li><span>Aucun projet enregistré pour l’instant.</span></li>';
  }
};
// mini-vignette (illustration Rap + symbole) sur les boutons « Démo trap » / « Démo drill »
decks.forEach(d => d.r('demo').insertAdjacentHTML('afterbegin', `<span class="mini" aria-hidden="true" style="background-image:url('${GENRE_ART.rap}')"><span class="gbadge" data-g="rap"></span></span>`));

