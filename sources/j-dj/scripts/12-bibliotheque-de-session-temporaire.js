/* ---------- Bibliothèque de session (temporaire) ---------- */
// Les fichiers restent disponibles tant que J-DJ est ouvert ; la liste n'est pas enregistrée et se vide à la fermeture.
// Les Hot Cues et réglages par morceau sont gardés à part (STORE) et reviennent quand on resélectionne le même fichier.
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
/* Étiquettes ID3v2 (2.2, 2.3, 2.4) d'un MP3 : titre, artiste et pochette intégrée */
function readID3(ab) {
  const out = {};
  try {
    let u = new Uint8Array(ab);
    if (u.length < 10 || u[0] !== 0x49 || u[1] !== 0x44 || u[2] !== 0x33) return out;
    const ver = u[3], flags = u[5];
    const ss = (a, i) => ((a[i] & 0x7f) << 21) | ((a[i + 1] & 0x7f) << 14) | ((a[i + 2] & 0x7f) << 7) | (a[i + 3] & 0x7f);
    const be = (a, i) => ((a[i] << 24) | (a[i + 1] << 16) | (a[i + 2] << 8) | a[i + 3]) >>> 0;
    let end = Math.min(u.length, 10 + ss(u, 6));
    if (flags & 0x80 && ver < 4) {                         // désynchronisation sur tout le tag
      const t = []; for (let i = 10; i < end; i++) { t.push(u[i]); if (u[i] === 0xff && u[i + 1] === 0) i++; }
      const n = new Uint8Array(10 + t.length); n.set(u.subarray(0, 10)); n.set(t, 10); u = n; end = n.length;
    }
    let p = 10;
    if (flags & 0x40) p += ver === 4 ? ss(u, 10) : be(u, 10) + 4; // en-tête étendu
    const str = (i, n) => String.fromCharCode(...u.subarray(i, i + n));
    const dec = (enc, b) => {
      const label = enc === 1 ? 'utf-16' : enc === 2 ? 'utf-16be' : enc === 3 ? 'utf-8' : 'iso-8859-1';
      return new TextDecoder(label).decode(b).split('\u0000')[0].trim();
    };
    const textEnd = (b, i, enc) => { if (enc === 1 || enc === 2) { while (i + 1 < b.length && (b[i] || b[i + 1])) i += 2; return i + 2; } while (i < b.length && b[i]) i++; return i + 1; };
    const hdr = ver === 2 ? 6 : 10;
    while (p + hdr <= end) {
      const id = str(p, ver === 2 ? 3 : 4);
      if (!/^[A-Z0-9]{3,4}$/.test(id)) break;
      const size = ver === 2 ? (u[p + 3] << 16) | (u[p + 4] << 8) | u[p + 5] : ver === 4 ? ss(u, p + 4) : be(u, p + 4);
      if (size <= 0 || p + hdr + size > end) break;
      const b = u.subarray(p + hdr, p + hdr + size);
      if (id === 'TIT2' || id === 'TT2') out.title = dec(b[0], b.subarray(1));
      else if (id === 'TPE1' || id === 'TP1') out.artist = dec(b[0], b.subarray(1));
      else if (id === 'TCON' || id === 'TCO') out.genre = dec(b[0], b.subarray(1));
      else if ((id === 'APIC' || id === 'PIC') && !out.cover) {
        const enc = b[0]; let i = 1, mime;
        if (ver === 2) { const fmt = str(p + hdr + 1, 3).toUpperCase(); mime = fmt === 'PNG' ? 'image/png' : 'image/jpeg'; i = 4; }
        else { let j = i; while (j < b.length && b[j]) j++; mime = String.fromCharCode(...b.subarray(i, j)).toLowerCase() || 'image/jpeg'; i = j + 1; if (!mime.includes('/')) mime = 'image/' + (mime === 'png' ? 'png' : 'jpeg'); }
        i += 1;                                            // type d'image
        i = textEnd(b, i, enc);                            // description
        if (i < b.length) out.cover = new Blob([b.slice(i)], { type: mime });
      }
      p += hdr + size;
    }
  } catch (e) { /* étiquette illisible : on garde le nom du fichier */ }
  return out;
}
// icônes de la colonne de la bibliothèque (genres : même symbole que sur les pochettes)
const TAB_ICO = tab => {
  if (tab.startsWith('g:') && tab.length > 2) return `<span class="tico gbadge" data-g="${tab.slice(2)}" aria-hidden="true"></span>`;
  const p = { all: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>', recent: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    decks: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.2"/>', demos: '<path d="M8 5.5v13l10-6.5z"/>', 'g:': '<circle cx="12" cy="12" r="8" stroke-dasharray="3 3"/>' }[tab] || '';
  return `<svg class="tico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
};
const escHtml = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function askConfirm(text, okLabel) {
  const dlg = document.getElementById('confirmDlg');
  if (!dlg || typeof dlg.showModal !== 'function') return Promise.resolve(window.confirm(text));
  document.getElementById('confirmTxt').textContent = text;
  dlg.querySelector('[data-v="1"]').textContent = okLabel || 'Remplacer';
  return new Promise(res => {
    const done = v => { dlg.removeEventListener('close', onClose); dlg.querySelectorAll('[data-v]').forEach(b => b.onclick = null); if (dlg.open) dlg.close(); res(v); };
    const onClose = () => done(false);
    dlg.querySelectorAll('[data-v]').forEach(b => { b.onclick = () => done(b.dataset.v === '1'); });
    dlg.addEventListener('close', onClose);
    dlg.showModal();
    dlg.querySelector('[data-v="0"]').focus();
  });
}
// Demande confirmation avant de remplacer le titre d'une platine qui joue
async function okToReplace(d, newName) {
  if (!(d.playing || d.scratching) || !d.buffer) return true;
  return askConfirm(`La platine ${d.id} joue « ${d.name} ». La remplacer par « ${newName} » ? La lecture de ${d.id} s’arrêtera ; l’autre platine continue.`);
}
var PL = {
  items: [], q: '', tab: 'all', seq: 0, sig: '', sel: null,
  el(id) { return document.getElementById(id); },
  st(t) { this.el('plSt').textContent = t; },
  init() {
    try { localStorage.removeItem('jdj.playlist.v1'); } catch (e) {}     // ancienne playlist persistante : abandonnée
    const onPick = e => { const fs = [...e.target.files]; e.target.value = ''; if (fs.length) { this.open(); this.add(fs); } };
    this.el('plAdd').addEventListener('change', onPick);
    this.el('plAddTop').addEventListener('change', onPick);
    this.el('plSearch').addEventListener('input', e => { this.q = norm(e.target.value.trim()); this.render(); });
    document.querySelectorAll('.tabs [data-tab]').forEach(b => b.addEventListener('click', () => { this.tab = b.dataset.tab; this.render(); }));
    this.el('plList').addEventListener('change', e => {
      const s = e.target.closest('select[data-genre]'); if (!s) return;
      const it = this.items.find(x => x.key === s.dataset.genre); if (!it) return;
      this.setGenre(it, s.value);
    });
    this.el('plList').addEventListener('click', e => {
      if (e.target.closest('select')) return;               // choix du genre : pas de sélection de ligne
      const li = e.target.closest('li[data-key]'); if (!li) return;
      const it = this.items.find(x => x.key === li.dataset.key); if (!it) return;
      const b = e.target.closest('button');
      if (!b) { this.sel = it.key; this.render(); return; }   // clic sur la ligne : sélection
      if (b.dataset.act === 'del') { this.remove(it); return; }
      if (b.dataset.act === 'up' || b.dataset.act === 'down') { this.move(it, b.dataset.act === 'up' ? -1 : 1); return; }
      this.sel = it.key; this.loadTo(it, b.dataset.act);
    });
    this.el('plList').addEventListener('keydown', e => {
      const li = e.target.closest('li[data-key]'); if (!li || e.target !== li) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.sel = li.dataset.key; this.render(); this.el('plList').querySelector(`li[data-key="${li.dataset.key}"]`).focus(); }
    });
    const loadSel = id => { const it = this.items.find(x => x.key === this.sel); if (it) this.loadTo(it, id); };
    this.el('selA').addEventListener('click', () => loadSel('A'));
    this.el('selB').addEventListener('click', () => loadSel('B'));
    this.el('libFab').addEventListener('click', () => this.open(true));
    this.el('libClose').addEventListener('click', () => this.close());
    this.el('plList').addEventListener('change', e => {
      const inp = e.target.closest('input[data-relink]'); if (!inp) return;
      const it = this.items.find(x => x.key === inp.dataset.relink), f = inp.files[0]; inp.value = '';
      if (it && f) this.relink(it, f);
    });
    // 4 démos intégrées, une par style, jouables sans importer de son (le projet ouvert peut remplacer cette liste)
    this.items = this.demoItems();
    // préparation des démos en arrière-plan, l'une après l'autre, peu après l'ouverture
    setTimeout(async () => { for (const s of STYLE_DEMOS) { try { await renderStyleDemo(s.style); } catch (e) {} } }, 1200);
    this.render();
    this.st('4 démos prêtes à jouer (Rap, R&B, Punk, Électro). Ajoute tes MP3 ou WAV, puis charge-les sur A ou B.');
  },
  open(focus) { this.el('lib').classList.add('open'); document.body.classList.add('lib-open'); if (focus) this.el('plSearch').focus({ preventScroll: true }); },
  close() { this.el('lib').classList.remove('open'); document.body.classList.remove('lib-open'); },
  find(id) { return id ? this.items.find(x => x.id === id) : null; },
  demoItem(s, t = {}) { return { key: 'demo-' + s.style, name: s.name, artist: 'Démo J-DJ · ' + genreLabel(s.style), cover: '', genre: s.style, demo: s.style,
    bpm: s.bpm, dur: s.bars * 4 * 60 / s.bpm, file: null, id: null, status: 'ok', played: t.played || 0, added: 0 }; },
  demoItems() { return STYLE_DEMOS.map(s => this.demoItem(s)); },
  move(it, dir) {
    const i = this.items.indexOf(it), j = i + dir; if (i < 0 || j < 0 || j >= this.items.length) return;
    [this.items[i], this.items[j]] = [this.items[j], this.items[i]]; this.render(); PROJ.schedule();
  },
  // fichier absent du projet : on le relie à un fichier choisi sur l'ordinateur
  async relink(it, f) {
    try {
      const ab = await f.arrayBuffer(), id = fileId(ab);
      if (it.id && id !== it.id) {
        const ok = await askConfirm(`« ${f.name} » n’est pas exactement le fichier d’origine de « ${it.name} » (contenu différent). Le relier quand même ? Les repères sont gardés mais pourraient être décalés.`, 'Relier');
        if (!ok) { this.st('Reliaison annulée.'); return; }
        if (STORE.data.tracks[it.id]) { STORE.data.tracks[id] = { ...STORE.data.tracks[it.id] }; STORE.write(); }
      }
      const buf = await new OfflineAudioContext(2, 1, 44100).decodeAudioData(ab.slice(0));
      const tag = readID3(ab), oldId = it.id;
      // le montage suit le morceau relié : ses clips pointent vers le nouveau fichier (et ne dépassent pas sa durée)
      if (oldId && oldId !== id && typeof MT !== 'undefined') {
        let n = 0;
        MT.clips.forEach(k => { if (k.ref === oldId) { k.ref = id; k.out = Math.min(k.out, buf.duration); if (k.out - k.in < 0.05) k.in = Math.max(0, k.out - 0.05); n++; } });
        MT.undo = MT.undo.map(s => s.split(oldId).join(id)); MT.redo = MT.redo.map(s => s.split(oldId).join(id));   // annuler garde aussi le bon fichier
        MT.bufs.delete(oldId); MT.peaks.delete(oldId);
        if (n) { MT.draw(); MT.ui(); }
      }
      Object.assign(it, { id, file: f, fileName: f.name, size: f.size, dur: buf.duration, status: 'ok', stored: false });
      if (!it.cover && tag.cover) it.cover = URL.createObjectURL(tag.cover);
      this.render(); PROJ.schedule(); if (MT.isOpen) { MT.fillMedia(); MT.prepare(); }
      this.st(`« ${it.name} » relié à « ${f.name} ».`);
    } catch (e) { this.st(`« ${f.name} » est illisible : rien n’a été relié.`); }
  },
  // enregistre un fichier dans la bibliothèque (ou retrouve celui qui a le même contenu)
  async register(f, ab) {
    ab = ab || await f.arrayBuffer();
    const id = fileId(ab);
    let it = this.find(id);
    if (it) {                                                  // même contenu : on (re)lie le fichier, les repères suivent
      const relinked = it.status === 'missing';
      it.file = f; it.fileName = f.name; it.size = f.size; it.status = 'ok'; it.stored = it.stored && !relinked;
      if (!it.cover) { const tag = readID3(ab); if (tag.cover) it.cover = URL.createObjectURL(tag.cover); }
      return { it, isNew: false, relinked };
    }
    const tag = readID3(ab), base = f.name.replace(/\.[^.]+$/, '');
    const savedGenre = (STORE.data.tracks[id] || {}).genre;
    it = { key: 'k' + (this.seq++), name: tag.title || base, artist: tag.artist || '', cover: tag.cover ? URL.createObjectURL(tag.cover) : '', fileName: f.name,
      genre: savedGenre || genreOf(tag.genre),
      size: f.size, id, bpm: null, dur: null, file: f, status: 'ok', played: 0, added: Date.now() };
    this.items.push(it); return { it, isNew: true };
  },
  async add(files) {
    ensureCtx();
    let added = 0, again = 0, bad = 0, relinkedN = 0;
    for (const f of files) {
      this.st(`Analyse de « ${f.name} »…`);
      try {
        const ab = await f.arrayBuffer();
        const { it, isNew, relinked } = await this.register(f, ab);
        if (isNew) { it.status = 'loading'; this.render(); }
        if (!it.dur) { const buf = await ctx.decodeAudioData(ab); it.dur = buf.duration; it.bpm = analyzeGrid(buf).bpm; }
        it.status = 'ok'; isNew ? added++ : relinked ? relinkedN++ : again++;
      } catch (e) {
        const it = { key: 'k' + (this.seq++), name: f.name.replace(/\.[^.]+$/, ''), size: f.size, id: null, file: null, status: 'bad', played: 0, added: Date.now() };
        this.items = this.items.filter(x => !(x.status === 'loading' && x.file === f));
        this.items.push(it); bad++;
      }
      this.render();
    }
    const parts = []; if (added) parts.push(`${added} morceau(x) ajouté(s)`); if (relinkedN) parts.push(`${relinkedN} relié(s) avec leurs repères`); if (again) parts.push(`${again} déjà présent(s)`); if (bad) parts.push(`${bad} fichier(s) illisible(s)`);
    this.st(parts.join(', ') + '.');
    PROJ.schedule(); if (MT.isOpen) { MT.fillMedia(); MT.prepare(); }
  },
  // fichier choisi avec le bouton d'une platine : ajouté à la bibliothèque puis chargé
  async fromDeck(d, f) {
    const { it } = await this.register(f);
    this.render();
    return this.loadTo(it, d.id);
  },
  async loadTo(it, deckId) {
    const d = decks[deckId === 'A' ? 0 : 1];
    if (it.demo) {                                   // démo intégrée : synthétisée à la demande, sans fichier
      if (d.libKey === it.key && d.buffer && !d.loading) { this.st(`« ${it.name} » est déjà sur la platine ${deckId}.`); return false; }
      if (!(await okToReplace(d, it.name))) { this.st(`Remplacement annulé : la platine ${deckId} continue « ${d.name} ».`); return false; }
      const other = decks[deckId === 'A' ? 1 : 0], otherPlaying = other.playing;
      ensureCtx(); const req = newLoadRequest(d);
      const buf = await renderStyleDemo(it.demo);
      if (req !== d.loadReq) return false;         // une demande plus récente a pris la main
      d.load(buf, it.name, { bpm: it.bpm, beat0: 0, gridSrc: 'demo', repeat: true, artist: it.artist });
      d.libKey = it.key; d.cover = GENRE_ART[it.demo]; d.genre = it.demo; d.ui(); this.render(); PROJ.schedule();
      this.st(`Démo « ${it.name} » chargée sur ${deckId}. Appuie sur Lecture quand tu es prêt.` + (otherPlaying ? ` La platine ${other.id} continue.` : ''));
      return true;
    }
    if (it.status === 'missing') { this.st(`« ${it.name} » est à relier : clique sur « Relier » ou ajoute le même fichier avec « + Ajouter des morceaux ».`); return false; }
    if (it.status === 'bad' || !it.file) { this.st(`« ${it.name} » est illisible.`); return false; }
    if (d.libKey === it.key && d.buffer && !d.loading) { this.st(`« ${it.name} » est déjà sur la platine ${deckId}.`); return false; }
    if (!(await okToReplace(d, it.name))) { this.st(`Remplacement annulé : la platine ${deckId} continue « ${d.name} ».`); return false; }
    const other = decks[deckId === 'A' ? 1 : 0], otherPlaying = other.playing;
    it.status = 'loading'; this.render();
    const ok = await loadFileOnDeck(d, it.file);
    if (ok === 'superseded') { it.status = 'ok'; this.render(); return false; }   // remplacé par une demande plus récente
    if (ok) { d.libKey = it.key; d.name = it.name; d.artist = it.artist; d.cover = artOf(it); d.genre = it.genre || ''; it.status = 'ok'; if (!it.dur) it.dur = d.duration; if (!it.bpm) it.bpm = d.bpm; d.ui(); }
    else { it.status = 'bad'; }                     // la platine garde son morceau précédent
    this.render(); if (ok) PROJ.schedule();
    this.st(ok ? `« ${it.name} » chargé sur ${deckId}. Appuie sur Lecture quand tu es prêt.` + (otherPlaying ? ` La platine ${other.id} continue.` : '') : `« ${it.name} » est illisible : la platine ${deckId} garde ${d.buffer ? '« ' + d.name + ' »' : 'son état'}.`);
    return ok;
  },
  remove(it) {
    if (it.id && MT.clips.some(k => k.ref === it.id)) { this.st(`« ${it.name} » est utilisé dans le montage : retire d’abord ses clips (écran Montage).`); return; }
    decks.forEach(d => { if (d.libKey === it.key) d.libKey = null; });
    this.items = this.items.filter(x => x !== it); this.render(); PROJ.needGc = true; PROJ.schedule();
    this.st(`« ${it.name} » retiré du projet (la platine qui le joue n’est pas touchée).`);
  },
  setGenre(it, g) {
    it.genre = GENRES.some(x => x[0] === g) ? g : '';
    STORE.setGenre(it.id, it.name, it.genre);
    decks.forEach(d => { if (d.libKey === it.key) { d.cover = artOf(it); d.genre = it.genre; d.ui(); } });   // la platine suit, sauf pochette du MP3
    this.render(); PROJ.schedule();
    this.st(it.genre ? `« ${it.name} » classé en ${genreLabel(it.genre)}.` : `« ${it.name} » n’a plus de genre.`);
  },
  markPlayed(key) { const it = this.items.find(x => x.key === key); if (it) { it.played = Date.now(); this.render(); PROJ.schedule(); } },
  // re-dessine seulement si l'état des platines a changé (appelé par Deck.ui)
  sync() {
    const s = decks.map(d => `${d.libKey}|${d.playing}|${!!d.buffer}`).join('/');
    if (s !== this.sig) { this.sig = s; this.render(); }
  },
  render() {
    const ul = this.el('plList'); if (!ul) return;
    const recent = this.items.filter(x => x.played).sort((a, b) => b.played - a.played);
    const onDecks = this.items.filter(x => decks.some(d => d.libKey === x.key && d.buffer));
    const counts = { all: this.items.length, recent: recent.length, decks: onDecks.length, demos: this.items.filter(x => x.demo).length, 'g:': this.items.filter(x => !x.genre).length };
    const labels = { all: 'Tous les morceaux', recent: 'Récemment joués', decks: 'Sur les platines', demos: 'Démos intégrées', 'g:': 'Sans genre' };
    GENRES.forEach(([g, l]) => { counts['g:' + g] = this.items.filter(x => x.genre === g).length; labels['g:' + g] = l; });
    document.querySelectorAll('.tabs [data-tab]').forEach(b => {
      b.setAttribute('aria-selected', String(b.dataset.tab === this.tab));
      b.innerHTML = `${TAB_ICO(b.dataset.tab)}<span class="tl">${labels[b.dataset.tab]}</span><span class="cnt">(${counts[b.dataset.tab]})</span>`;
    });
    this.el('libCount').textContent = this.items.length ? String(this.items.length) : '';
    this.el('libFab').textContent = `Bibliothèque · ${this.items.length}`;
    if (this.sel && !this.items.some(x => x.key === this.sel)) this.sel = null;
    const selIt = this.items.find(x => x.key === this.sel);
    ['A', 'B'].forEach(id => {
      const b = this.el('sel' + id), here = selIt && decks.some(d => d.id === id && d.libKey === selIt.key && d.buffer);
      b.disabled = !selIt || selIt.status !== 'ok' || here;
      b.title = !selIt ? 'Sélectionne d’abord un morceau dans la liste' : here ? `Déjà sur ${id}` : `Charger « ${selIt.name} » sur la platine ${id}`;
    });
    const base = this.tab === 'recent' ? recent : this.tab === 'decks' ? onDecks : this.tab === 'demos' ? this.items.filter(x => x.demo) : this.tab.startsWith('g:') ? this.items.filter(x => (x.genre || '') === this.tab.slice(2)) : this.items;
    const list = base.filter(x => !this.q || norm(x.name + ' ' + (x.artist || '') + ' ' + (x.fileName || '') + ' ' + genreLabel(x.genre)).includes(this.q));
    const gsel = x => `<select class="gsel" data-genre="${x.key}" aria-label="Genre de ${escHtml(x.name)}"><option value="">—</option>${GENRES.map(([g, l]) => `<option value="${g}"${x.genre === g ? ' selected' : ''}>${escHtml(l)}</option>`).join('')}</select>`;
    const dt = t => { const d = new Date(t), p = v => String(v).padStart(2, '0'); return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`; };
    ul.innerHTML = list.map(x => {
      const n = this.items.indexOf(x) + 1;
      const on = decks.filter(d => d.libKey === x.key && d.buffer);
      const tags = on.map(d => `<span class="tag tag-${d.id}${d.playing ? ' live' : ''}">${d.id} · ${d.playing ? 'en lecture' : 'chargé'}</span>`).join('');
      const info = x.status === 'bad' ? '<span class="bad-txt">illisible</span>' : x.status === 'loading' ? 'chargement…'
        : x.status === 'missing' ? `<span class="miss-txt">Fichier absent</span> <label class="btn small relink">Relier…<input type="file" accept="audio/*,.mp3,.wav" data-relink="${x.key}"></label>` : escHtml(x.artist || '—');
      const btn = id => { const here = on.some(d => d.id === id); const dis = x.status !== 'ok' || here;
        return `<button class="btn small ld ld-${id}" data-act="${id}" ${dis ? 'disabled' : ''} aria-label="${here ? 'Déjà sur ' + id : 'Charger ' + escHtml(x.name) + ' sur ' + id}">${here ? 'Sur ' + id : '→ ' + id}</button>`; };
      const art = artOf(x);
      const badge = `<span class="gbadge" data-g="${x.genre || ''}"${x.genre ? ` title="${escHtml(genreLabel(x.genre))}"` : ''}></span>`;
      const cover = art ? `<span class="cover${x.cover ? '' : ' genre-art'}" style="background-image:url('${art}')" title="${x.cover ? 'Pochette du MP3' : 'Illustration ' + escHtml(genreLabel(x.genre))}">${badge}</span>` : `<span class="cover nocover">${badge}</span>`;
      return `<li class="pl-row ${x.status}${on.length ? ' loaded' : ''}${x.key === this.sel ? ' sel' : ''}" data-key="${x.key}" tabindex="0" aria-selected="${x.key === this.sel}">
        <span class="c-n">${n}</span>${cover}
        <span class="c-t"><span class="pl-name" title="${escHtml(x.name)}">${escHtml(x.name)}</span>${tags ? `<span class="pl-tags">${tags}</span>` : ''}</span>
        <span class="c-i">${info}</span>
        <span class="c-g">${x.status === 'bad' ? '' : x.demo ? `<span class="gfix">${escHtml(genreLabel(x.genre))}</span>` : gsel(x)}</span>
        <span class="c-b">${x.bpm ? x.bpm.toFixed(1) : '—'}</span>
        <span class="c-d">${x.dur ? fmt(x.dur) : '—'}</span>
        <span class="c-a">${x.demo ? 'Démo intégrée' : dt(x.added)}${x.played ? `<small>joué ${(() => { const m = Math.round((Date.now() - x.played) / 60000); return m < 1 ? 'à l’instant' : m < 60 ? `il y a ${m} min` : `il y a ${Math.round(m / 60)} h`; })()}</small>` : ''}</span>
        <span class="pl-acts"><span class="mv"><button class="btn small mvb" data-act="up" aria-label="Monter ${escHtml(x.name)}" ${n === 1 ? 'disabled' : ''}>▲</button><button class="btn small mvb" data-act="down" aria-label="Descendre ${escHtml(x.name)}" ${n === this.items.length ? 'disabled' : ''}>▼</button></span>${btn('A')}${btn('B')}${x.demo ? '<span class="del-sp"></span>' : `<button class="btn small del" data-act="del" aria-label="Retirer ${escHtml(x.name)} de la bibliothèque">×</button>`}</span></li>`;
    }).join('') || `<li class="pl-empty">${this.items.length ? (this.tab === 'recent' && !recent.length ? 'Aucun morceau joué pour l’instant.' : this.tab === 'decks' && !onDecks.length ? 'Aucun morceau de la bibliothèque sur les platines.' : 'Aucun titre ne correspond.') : 'Bibliothèque vide : clique sur « + Ajouter des morceaux ».'}</li>`;
  }
};

PL.init();

