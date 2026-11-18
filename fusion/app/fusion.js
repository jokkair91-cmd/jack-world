'use strict';
// JACK FUSION v0.8 — interface « Atelier » d’après la maquette : Montage, Audio et Photo.
// Comme les autres modules, on enveloppe les fonctions existantes : le moteur (lecture, export,
// sauvegarde, liaison, vumètres) reste celui des versions précédentes.

const FPS = 30;
const ICON = name => `<svg class="ic" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const r2f = n => Math.round(n * 100) / 100;
const comma = (n, d = 1) => Number(n).toFixed(d).replace('.', ',');
function timecode(seconds) {
  const frames = Math.round(Math.max(0, seconds || 0) * FPS), sec = Math.floor(frames / FPS);
  return [Math.floor(sec / 3600), Math.floor(sec / 60) % 60, sec % 60, frames % FPS].map(n => String(n).padStart(2, '0')).join(':');
}
const isTitle = a => a?.kind === 'image' && !!a.generatedTitle;
const mediaType = a => isTitle(a) ? 'title' : a?.kind;
const kindIcon = a => ({video:'video', audio:'music', image:'image', title:'type'})[mediaType(a)] || 'image';

/* =====================================================================
   GAIN AU-DELÀ DE 100 % (normalisation) — clip.boost en dB, 0 à +12
   ===================================================================== */
const fusionExportGain = exportGain;
exportGain = (c, levels) => fusionExportGain(c, levels) * Math.pow(10, bounded(c.boost, 0, 12, 0) / 20);
function clipDb(c) { const base = c.volume > 0 ? 20 * Math.log10(c.volume) : -Infinity; return base + bounded(c.boost, 0, 12, 0); }
function volumeFromDb(db) {
  if (!Number.isFinite(db) || db <= -40) return {volume:0, boost:0};
  if (db <= 0) return {volume:Math.round(Math.pow(10, db / 20) * 100) / 100, boost:0};
  return {volume:1, boost:Math.round(Math.min(12, db) * 10) / 10};
}
function dbText(db) { return Number.isFinite(db) && db > -40 ? (db > 0 ? '+' : db < 0 ? '−' : '') + comma(Math.abs(db)) + ' dB' : '−∞ dB'; }
function createPreviewEngine() {
  previewEngine ??= new (window.AudioContext || window.webkitAudioContext)();
  if (!previewOutput) { previewOutput = previewEngine.createGain(); previewOutput.filters = connectEqualizer(previewEngine, previewOutput, previewEngine.destination); }
}

/* =====================================================================
   VUMÈTRES PAR PISTE AUDIO (tranches du mixeur)
   ===================================================================== */
const laneMeters = new Map();
let fusionSink = null, fusionSinkEngine = null;
function laneAnalyser(key) {
  if (!ensureMeters()) return null;
  if (fusionSinkEngine !== previewEngine) { fusionSinkEngine = previewEngine; fusionSink = previewEngine.createGain(); fusionSink.gain.value = 0; fusionSink.connect(previewEngine.destination); laneMeters.clear(); }
  let m = laneMeters.get(key);
  if (!m) { const an = previewEngine.createAnalyser(); an.fftSize = 2048; an.smoothingTimeConstant = 0; an.connect(fusionSink); m = {an, s:{db:-Infinity, hold:-Infinity, holdAt:0, clipAt:-1e9}}; laneMeters.set(key, m); }
  return m;
}
const fusionPreviewElement = previewElement;
previewElement = c => {
  if (c.kind !== 'image' && (c.boost || 0) > 0 && !previewEngine) { try { createPreviewEngine(); } catch {} }
  const el = fusionPreviewElement(c);
  const entry = previewClips.get(c.id);
  if (c.kind === 'audio' && entry?.gain) {
    const key = laneKey('audio', c.lane || 0);
    if (entry.laneKey !== key) {
      if (entry.laneAn) try { entry.gain.disconnect(entry.laneAn); } catch {}
      const m = laneAnalyser(key); if (m) { entry.gain.connect(m.an); entry.laneKey = key; entry.laneAn = m.an; }
    }
  }
  return el;
};
function ballistic(s, peak, now, dt) {
  const db = peakToDb(peak);
  s.db = Math.max(db, s.db - METER_FALL * dt);
  if (db >= s.hold) { s.hold = db; s.holdAt = now; } else if (now - s.holdAt > HOLD_MS) s.hold -= METER_FALL * dt;
  if (peak >= .999) s.clipAt = now;
}

/* =====================================================================
   TRANSPORT
   ===================================================================== */
function setPlayIcon() { const b = $('play'); b.innerHTML = ICON(playing ? 'pause' : 'play'); b.setAttribute('aria-label', playing ? 'Pause' : 'Lecture'); }
const fusionPause = pause;
pause = () => { fusionPause(); setPlayIcon(); };
const fusionPlay = $('play').onclick;
$('play').onclick = async () => { await fusionPlay(); setPlayIcon(); };
$('prev-frame').onclick = () => seek(Math.round(time * FPS - 1) / FPS);
$('next-frame').onclick = () => seek(Math.round(time * FPS + 1) / FPS);
$('go-end').onclick = () => seek(end());
$('fullscreen').onclick = () => { const stage = document.querySelector('.stage'); if (document.fullscreenElement) document.exitFullscreen?.(); else stage.requestFullscreen?.().catch(() => status('Plein écran refusé par le navigateur.')); };
let listenStop = null, tcLast = '';
function fusionFrame() {
  requestAnimationFrame(fusionFrame);
  if (listenStop !== null && (!playing || time >= listenStop)) { if (playing) pause(); listenStop = null; }
  const now = timecode(time), total = timecode(end());
  if (now + total !== tcLast) { tcLast = now + total; $('tc-now').textContent = now; $('tc-total').textContent = total; }
  if (space === 'audio') stripMeterFrame();
}
requestAnimationFrame(fusionFrame);

/* =====================================================================
   EN-TÊTE : menu du projet
   ===================================================================== */
$('menu-save').onclick = () => $('save').click();
const projectMenu = document.querySelector('.project-menu');
document.addEventListener('click', e => { if (projectMenu?.open && (!e.target.closest || !e.target.closest('.project-menu') || e.target.closest('.menu button'))) projectMenu.open = false; });

/* =====================================================================
   MÉDIATHÈQUE : vignettes, filtres comptés, collections
   ===================================================================== */
let libraryView = 'grid', activeCollection = null, draggedAsset = null;
const defaultCollections = () => [{id:'rushes', name:'Rushes', icon:'folder'}, {id:'selection', name:'Sélection', icon:'star'}, {id:'music', name:'Musique', icon:'music'}];
let collections = defaultCollections();
const inCollection = (a, id) => Array.isArray(a.collections) && a.collections.includes(id);
function toggleCollection(a, id) {
  const c = collections.find(x => x.id === id); if (!a || !c) return;
  a.collections = Array.isArray(a.collections) ? a.collections : [];
  if (a.collections.includes(id)) { a.collections = a.collections.filter(x => x !== id); status(`« ${a.name} » retiré de ${c.name}.`); }
  else { a.collections.push(id); status(`« ${a.name} » ajouté à ${c.name}.`); }
  showLibrary();
}
function waveSvg(peaks, n = 60) {
  if (!peaks?.length) return '';
  const pts = [];
  for (let i = 0; i < n; i++) { const p = peaks[Math.min(peaks.length - 1, Math.floor(i / n * peaks.length))]; const h = Math.max(.6, p * 17); pts.push(`M${i * 2 + 1} ${20 - h}V${20 + h}`); }
  return `<svg class="wave" viewBox="0 0 ${n * 2} 40" preserveAspectRatio="none" aria-hidden="true"><path d="${pts.join('')}"/></svg>`;
}
function mediaCounts() {
  const n = {all:assets.length, video:0, audio:0, image:0, title:0};
  for (const a of assets) n[mediaType(a)]++;
  return n;
}
showLibrary = () => {
  const counts = mediaCounts();
  for (const span of document.querySelectorAll('[data-count]')) span.textContent = counts[span.dataset.count] ?? 0;
  $('count').textContent = assets.length;
  const query = $('search').value.toLowerCase();
  const list = assets.filter(a => (mediaFilter === 'all' || mediaType(a) === mediaFilter) && (!activeCollection || inCollection(a, activeCollection)) && a.name.toLowerCase().includes(query));
  const lib = $('library');
  lib.classList.toggle('list', libraryView === 'list');
  lib.innerHTML = list.map(a => {
    const thumb = a.thumbnail || (a.kind === 'image' && a.url);
    const visual = thumb ? `<img src="${esc(thumb)}" alt="">` : a.peaks ? waveSvg(a.peaks) : `<span class="glyph">${ICON(kindIcon(a))}</span>`;
    const badge = a.kind === 'image' ? '' : `<span class="badge">${stamp(a.duration || 0)}</span>`;
    const fav = inCollection(a, 'selection');
    const uncollect = activeCollection && activeCollection !== 'selection' ? `<span class="fav on" data-uncollect role="button" tabindex="-1" title="Retirer de la collection" style="left:auto;right:4px;color:#fff">${ICON('x')}</span>` : '';
    const current = space === 'photo' && a.id === photo ? ' current' : '';
    return `<button class="media-card${a.el ? '' : ' missing'}${current}" data-id="${esc(a.id)}" draggable="true" title="${esc(a.name)}${a.el ? '' : ' — fichier à réimporter'}"><span class="thumb">${visual}${badge}</span><span class="name">${ICON(kindIcon(a))}<span>${esc(a.name)}</span></span><span class="fav${fav ? ' on' : ''}" data-fav role="button" tabindex="-1" title="${fav ? 'Retirer de Sélection' : 'Ajouter à Sélection'}">${ICON('star')}</span>${uncollect}</button>`;
  }).join('') || `<p class="hint" style="grid-column:1/-1;padding:6px">${assets.length ? 'Aucun média ne correspond.' : 'Importe des vidéos, photos et sons pour commencer.'}</p>`;
  renderCollections();
};
function renderCollections() {
  $('collection-list').innerHTML = collections.map(c => `<button class="collection${c.icon === 'star' ? ' star' : ''}${activeCollection === c.id ? ' active' : ''}" data-collection="${esc(c.id)}" title="Double-clic pour renommer">${ICON(c.icon || 'folder')}<span class="cname">${esc(c.name)}</span><span class="n">${assets.filter(a => inCollection(a, c.id)).length}</span><span class="del" data-del role="button" tabindex="-1" title="Supprimer la collection">${ICON('x')}</span></button>`).join('');
}
function useAsset(a) {
  if (!a.el) return status('Réimporte le fichier original pour le reconnecter au projet.');
  if (space === 'photo') {
    if (a.kind !== 'image' || isTitle(a)) return status('Choisis une photo dans la médiathèque.');
    photo = a.id; selectedLayer = null; restorePhoto(); sizePhoto(); draw(); showLibrary(); syncPhotoPanel(); return;
  }
  addClip(a);
}
$('library').addEventListener('click', e => {
  const card = e.target.closest?.('.media-card'); if (!card) return;
  const a = asset(card.dataset.id); if (!a) return;
  if (e.target.closest('[data-fav]')) return toggleCollection(a, 'selection');
  if (e.target.closest('[data-uncollect]')) return toggleCollection(a, activeCollection);
  useAsset(a);
});
$('library').addEventListener('dragstart', e => { const card = e.target.closest?.('.media-card'); if (!card) return; draggedAsset = card.dataset.id; e.dataTransfer.setData('text/plain', 'jack-fusion:' + draggedAsset); e.dataTransfer.effectAllowed = 'copy'; });
$('library').addEventListener('dragend', () => { draggedAsset = null; document.querySelectorAll('.drop').forEach(x => x.classList.remove('drop')); });
$('search').oninput = () => showLibrary();
for (const [id, view] of [['view-grid', 'grid'], ['view-list', 'list']]) $(id).onclick = () => { libraryView = view; $('view-grid').setAttribute('aria-pressed', String(view === 'grid')); $('view-list').setAttribute('aria-pressed', String(view === 'list')); showLibrary(); };
const collectionList = $('collection-list');
collectionList.addEventListener('click', e => {
  const row = e.target.closest?.('[data-collection]'); if (!row) return; const id = row.dataset.collection;
  if (e.target.closest('[data-del]')) {
    const c = collections.find(x => x.id === id);
    if (!confirm(`Supprimer la collection « ${c.name} » ? Les médias restent dans le projet.`)) return;
    collections = collections.filter(x => x.id !== id); for (const a of assets) if (Array.isArray(a.collections)) a.collections = a.collections.filter(x => x !== id);
    if (activeCollection === id) activeCollection = null; showLibrary(); return;
  }
  activeCollection = activeCollection === id ? null : id; showLibrary();
});
collectionList.addEventListener('dblclick', e => {
  const row = e.target.closest?.('[data-collection]'); if (!row) return; const c = collections.find(x => x.id === row.dataset.collection);
  const name = prompt('Nouveau nom de la collection', c.name); if (name && name.trim()) { c.name = name.trim().slice(0, 40); showLibrary(); }
});
collectionList.addEventListener('dragover', e => { const row = e.target.closest?.('[data-collection]'); if (!row || !draggedAsset) return; e.preventDefault(); row.classList.add('drop'); });
collectionList.addEventListener('dragleave', e => { const row = e.target.closest?.('[data-collection]'); if (row && !row.contains(e.relatedTarget)) row.classList.remove('drop'); });
collectionList.addEventListener('drop', e => {
  const row = e.target.closest?.('[data-collection]'); if (!row || !draggedAsset) return; e.preventDefault(); row.classList.remove('drop');
  const a = asset(draggedAsset); if (a && !inCollection(a, row.dataset.collection)) toggleCollection(a, row.dataset.collection);
});
$('add-collection').onclick = () => {
  const name = prompt('Nom de la nouvelle collection'); if (!name || !name.trim()) return;
  if (collections.length >= 30) return status('Limite de 30 collections.');
  collections.push({id:uid(), name:name.trim().slice(0, 40), icon:'folder'}); showLibrary(); status('Collection créée. Glisse des médias dessus pour les y ranger.');
};

/* =====================================================================
   PROPRIÉTÉS DU CLIP — réglages en direct (validés par le formulaire d’origine)
   ===================================================================== */
const LIVE_KEYS = new Set(['tx', 'ty', 'scale', 'angle', 'opacity', 'brightness', 'contrast', 'saturation', 'fit', 'fadeIn', 'fadeOut', 'volDb']);
let inspSignature = '', gesture = null;
function clipValues(c) {
  const o = cleanOptions(c), t = cleanTransform(c.transform);
  return {start:c.start, trim:c.trim, duration:c.duration, lane:o.lane, fadeIn:o.fadeIn, fadeOut:o.fadeOut, fit:o.fit, brightness:o.brightness, contrast:o.contrast, saturation:o.saturation,
    tx:t.x, ty:t.y, scale:t.scale, angle:t.angle, opacity:t.opacity, volDb:clipDb(c), normalized:c.normalized === true};
}
function rangeRow(k, label, min, max, step, unit) {
  return `<div class="prop"><label for="ip-${k}">${label}</label><input type="range" id="ip-${k}" data-k="${k}" min="${min}" max="${max}" step="${step}"><input class="val" type="number" data-k="${k}" min="${min}" max="${max}" step="${step}" aria-label="${label}${unit ? ' (' + unit + ')' : ''}"></div>`;
}
function numRow(k, label, step, min = 0) { return `<div class="prop check"><label for="ip-${k}">${label}</label><input type="number" id="ip-${k}" data-k="${k}" step="${step}" min="${min}"></div>`; }
function inspectorHTML(c) {
  const a = asset(c.asset), visual = c.kind !== 'audio', av = c.kind !== 'image';
  const maxFade = Math.max(.1, Math.min(30, Math.floor(c.duration * 20) / 20));
  let h = `<div class="clip-head">${ICON(kindIcon(a || {kind:c.kind}))}<span title="${esc(a?.name || 'Média')}">${esc(a?.name || 'Média')}</span></div>`;
  h += `<details class="sect" open><summary>${ICON('film')}Clip</summary><div class="sect-body">${numRow('start', 'Position (s)', .01)}${c.kind === 'image' ? '' : numRow('trim', 'Début fichier (s)', .01)}${numRow('duration', 'Durée (s)', .01, .1)}<div class="prop check"><label for="ip-lane">Piste</label><select id="ip-lane" data-k="lane">${[0, 1, 2].map(n => `<option value="${n}">${esc(laneLabel(c.kind, n))}</option>`).join('')}</select></div><p class="hint small" id="ip-bounds">${c.kind === 'image' ? 'La durée règle le temps d’affichage.' : 'Durée du fichier : ' + stamp(a?.duration || 0)}</p></div></details>`;
  if (visual) h += `<details class="sect" open><summary>${ICON('move')}Transformations</summary><div class="sect-body"><div class="prop pair"><label>Position</label><label class="mini">X <input type="number" data-k="tx" min="-100" max="100" step="1" aria-label="Position X en %"></label><label class="mini">Y <input type="number" data-k="ty" min="-100" max="100" step="1" aria-label="Position Y en %"></label></div>${rangeRow('scale', 'Échelle', 10, 400, 1, '%')}${rangeRow('angle', 'Rotation', -180, 180, 1, '°')}${rangeRow('opacity', 'Opacité', 0, 100, 1, '%')}</div></details>`;
  if (av) h += `<details class="sect" open><summary>${ICON('volume')}Audio</summary><div class="sect-body">${rangeRow('volDb', 'Volume', -40, 12, .5, 'dB')}<div class="prop check"><label for="ip-normalized">Normaliser</label><label class="inline"><input type="checkbox" id="ip-normalized" data-k="normalized"> crête à −1 dB</label></div></div></details>`;
  h += `<details class="sect" open><summary>${ICON('transition')}Fondus</summary><div class="sect-body">${rangeRow('fadeIn', 'Fondu entrée', 0, maxFade, .05, 's')}${rangeRow('fadeOut', 'Fondu sortie', 0, maxFade, .05, 's')}</div></details>`;
  if (visual) h += `<details class="sect"><summary>${ICON('sliders')}Couleur et cadrage</summary><div class="sect-body"><div class="prop check"><label for="ip-fit">Cadrage</label><select id="ip-fit" data-k="fit"><option value="contain">Image entière</option><option value="cover">Remplir le cadre</option></select></div>${rangeRow('brightness', 'Luminosité', 30, 180, 1, '%')}${rangeRow('contrast', 'Contraste', 30, 180, 1, '%')}${rangeRow('saturation', 'Saturation', 0, 200, 1, '%')}</div></details>`;
  h += `<div class="prop-actions"><button type="button" data-insp-act="split">${ICON('split')}Couper</button><button type="button" data-insp-act="remove">${ICON('trash')}Supprimer</button></div>`;
  return h;
}
function writeControls(c, skip) {
  const v = clipValues(c), box = $('inspector-v8');
  for (const el of box.querySelectorAll('[data-k]')) {
    if (el === skip) continue;
    const k = el.dataset.k, val = v[k];
    if (el.type === 'checkbox') el.checked = !!val;
    else if (k === 'volDb') el.value = Number.isFinite(val) ? Math.max(-40, Math.round(val * 10) / 10) : -40;
    else el.value = typeof val === 'number' ? Math.round(val * 100) / 100 : val;
  }
}
function syncInspector() {
  const c = clip(), box = $('inspector-v8');
  $('props-reset').disabled = !c || c.kind === 'audio';
  box.hidden = !c;
  if (!c) { inspSignature = ''; gesture = null; return; }
  const sig = c.id + c.kind + Math.round(c.duration * 20);
  if (sig !== inspSignature) { inspSignature = sig; box.innerHTML = inspectorHTML(c); }
  writeControls(c, gesture ? document.activeElement : null);
}
function liveApply(c, k, value) {
  if (k.startsWith('t') && ['tx', 'ty'].includes(k) || ['scale', 'angle', 'opacity'].includes(k)) {
    const t = cleanTransform(c.transform); t[{tx:'x', ty:'y'}[k] || k] = value; c.transform = cleanTransform(t);
  } else if (k === 'volDb') Object.assign(c, volumeFromDb(value));
  else c[k] = value;
}
function readDesired(c, overrides = {}) {
  const v = clipValues(c), box = $('inspector-v8');
  for (const el of box.querySelectorAll('[data-k]')) {
    const k = el.dataset.k;
    if (el.type === 'checkbox') v[k] = el.checked;
    else if (el.tagName === 'SELECT') v[k] = k === 'lane' ? Number(el.value) : el.value;
    else if (el.value !== '' && Number.isFinite(Number(el.value))) v[k] = Number(el.value);
  }
  return Object.assign(v, overrides);
}
function commitClip(overrides = {}) {
  const c = clip(); if (!c) return false;
  const before = gesture && gesture.id === c.id ? gesture.before : JSON.stringify(c);
  const desired = readDesired(c, overrides);
  gesture = null;
  const restored = JSON.parse(before);
  for (const key of Object.keys(c)) if (!(key in restored)) delete c[key];
  Object.assign(c, restored);
  const vol = volumeFromDb(desired.volDb);
  const fields = {start:desired.start, trim:c.kind === 'image' ? 0 : desired.trim, duration:desired.duration, volume:Math.round(vol.volume * 100), 'clip-lane':desired.lane, 'fade-in':desired.fadeIn, 'fade-out':desired.fadeOut,
    'transform-x':desired.tx, 'transform-y':desired.ty, 'transform-scale':desired.scale, 'transform-angle':desired.angle, 'transform-opacity':desired.opacity,
    'clip-fit':desired.fit, 'clip-brightness':desired.brightness, 'clip-contrast':desired.contrast, 'clip-saturation':desired.saturation};
  for (const [id, value] of Object.entries(fields)) $(id).value = value;
  const edits = editCount;
  $('props').onsubmit({preventDefault() {}});
  const ok = editCount !== edits;
  if (ok) { if (vol.boost > 0) c.boost = vol.boost; else delete c.boost; if (desired.normalized) c.normalized = true; else delete c.normalized; }
  render();
  return ok;
}
const insp = $('inspector-v8');
const startGesture = () => { const c = clip(); if (c && !gesture) gesture = {id:c.id, before:JSON.stringify(c)}; };
insp.addEventListener('pointerdown', startGesture);
insp.addEventListener('focusin', startGesture);
insp.addEventListener('input', e => {
  const el = e.target, k = el.dataset?.k; const c = clip(); if (!k || !c || el.type === 'checkbox') return;
  startGesture();
  for (const twin of insp.querySelectorAll(`[data-k="${k}"]`)) if (twin !== el) twin.value = el.value;
  if (LIVE_KEYS.has(k)) { const value = el.tagName === 'SELECT' ? el.value : Number(el.value); if (el.tagName === 'SELECT' || Number.isFinite(value)) { liveApply(c, k, value); draw(); } }
});
insp.addEventListener('change', e => {
  const el = e.target, k = el.dataset?.k; if (!k) return;
  if (k === 'normalized') return normalizeSelected(el.checked);
  if (k === 'volDb') { const box = insp.querySelector('[data-k="normalized"]'); if (box) box.checked = false; }
  if (el.type === 'number' && (el.value === '' || !Number.isFinite(Number(el.value)))) { render(); return; }
  commitClip();
});
insp.addEventListener('click', e => { const act = e.target.closest?.('[data-insp-act]')?.dataset.inspAct; if (act) $(act).click(); });
$('props-reset').onclick = () => { const c = clip(); if (!c) return; gesture = {id:c.id, before:JSON.stringify(c)}; if (commitClip({tx:0, ty:0, scale:100, angle:0, opacity:100, brightness:100, contrast:100, saturation:100, fit:'contain'})) status('Transformations et couleur réinitialisées.'); };
const peakCache = new Map();
async function clipPeak(c) {
  const a = asset(c.asset); if (!a?.url) throw Error('Réimporte le fichier original.');
  if ((a.size || 0) > 200 * 1024 * 1024) throw Error('Fichier trop volumineux pour l’analyse (200 Mo).');
  decoder ??= new (window.AudioContext || window.webkitAudioContext)();
  if (!peakCache.has(a.id)) peakCache.set(a.id, await decodeAssetAudio(a, decoder));
  const buffer = peakCache.get(a.id), from = Math.floor(c.trim * buffer.sampleRate), to = Math.min(buffer.length, Math.ceil((c.trim + c.duration) * buffer.sampleRate));
  let peak = 0;
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) { const d = buffer.getChannelData(ch); for (let i = from; i < to; i++) { const v = d[i] < 0 ? -d[i] : d[i]; if (v > peak) peak = v; } }
  return peak;
}
function normalizedGainDb(peak) { return peak > 1e-5 ? clamp(Math.round((-1 - 20 * Math.log10(peak)) * 10) / 10, -40, 12) : 0; }
async function normalizeSelected(on) {
  const c = clip(); if (!c || c.kind === 'image') return;
  if (typeof locked === 'function' && locked(c)) { render(); return; }
  if (!on) { gesture = {id:c.id, before:JSON.stringify(c)}; if (commitClip({volDb:0, normalized:false})) status('Normalisation retirée : volume remis à 0 dB.'); return; }
  pause(); status('Analyse du niveau du clip…');
  try {
    const id = c.id, peak = await clipPeak(c); const current = clip();
    if (!current || current.id !== id) return status('Sélection changée pendant l’analyse : relance Normaliser.');
    const db = normalizedGainDb(peak);
    gesture = {id, before:JSON.stringify(current)};
    if (commitClip({volDb:db, normalized:true})) status(`Normalisé : crête du clip à −1 dB (gain ${dbText(db)}).${db >= 12 ? ' Gain plafonné à +12 dB.' : ''}`);
  } catch (error) { status('Normalisation impossible : ' + error.message); render(); }
}

/* =====================================================================
   TABLE DE MONTAGE : règle en timecode, têtes de piste, transitions, outils
   ===================================================================== */
const fusionLaneLabel = laneLabel;
laneLabel = (kind, lane) => {
  const custom = laneData({kind, lane}).name; if (custom) return custom;
  if (kind === 'image') return lane ? 'Titres ' + (lane + 1) : 'Titres';
  if (kind === 'audio') return ['Voix', 'Musique', 'Ambiances'][lane] || 'Audio ' + (lane + 1);
  return 'Vidéo ' + (lane + 1);
};
function laneIcon(kind, lane) { if (kind === 'video') return 'film'; if (kind === 'image') return 'type'; return /voix|voice|dialog|narr/i.test(laneLabel(kind, lane)) ? 'mic' : 'music'; }
timelineRuler = zoom => {
  const step = [.5, 1, 2, 5, 10, 15, 30, 60, 120, 300, 600].find(s => s * zoom >= 92) || 1200;
  const minor = step / 5, span = Math.max(700, end() * zoom + 120) / zoom, marks = [];
  for (let i = 0, t = 0; t <= span && marks.length < 6000; i++, t = i * minor) {
    if (i % 5 === 0) marks.push(`<span style="left:${t * zoom}px">${timecode(t)}</span>`);
    else if (minor * zoom >= 7) marks.push(`<i style="left:${t * zoom}px"></i>`);
  }
  return '<div class="time-ruler" aria-hidden="true"><div>' + marks.join('') + '</div></div>';
};
let snapOn = true;
const fusionSnapped = snappedStart;
snappedStart = (c, requested, zoom, enabled = true) => fusionSnapped(c, requested, zoom, enabled && snapOn);
$('snap-toggle').onclick = () => { snapOn = !snapOn; $('snap-toggle').setAttribute('aria-pressed', String(snapOn)); status(snapOn ? 'Aimant activé.' : 'Aimant désactivé : les clips se placent librement.'); };
let tool = 'select';
function setTool(name) { tool = name; $('tool-select').setAttribute('aria-pressed', String(name === 'select')); $('tool-blade').setAttribute('aria-pressed', String(name === 'blade')); document.body.classList.toggle('blade', name === 'blade'); }
$('tool-select').onclick = () => setTool('select');
$('tool-blade').onclick = () => { setTool(tool === 'blade' ? 'select' : 'blade'); if (tool === 'blade') status('Lame : clique sur un clip pour le couper à cet endroit. Échap revient à la sélection.'); };
document.addEventListener('keydown', e => {
  if (e.target.closest?.('input,textarea,select,dialog')) return;
  if (e.key === 'Escape') { setTool('select'); hideTransitionMenu(); if (photoTool !== 'select' && space === 'photo') setPhotoTool('select'); }
  else if (!e.ctrlKey && !e.metaKey && e.key.toLowerCase() === 'b' && space !== 'photo') setTool(tool === 'blade' ? 'select' : 'blade');
});
const zoomInput = $('zoom');
function setZoom(z) { zoomInput.value = clamp(Math.round(z), Number(zoomInput.min), Number(zoomInput.max)); render(); }
$('zoom-in').onclick = () => setZoom(Number(zoomInput.value) * 1.3);
$('zoom-out').onclick = () => setZoom(Number(zoomInput.value) / 1.3);
$('zoom-fit').onclick = () => { const w = document.querySelector('.tracks-scroll').clientWidth - 160; setZoom(end() > 0 ? w / end() : 35); };
const tracksEl = $('tracks');
tracksEl.addEventListener('pointerdown', e => {
  const clipEl = e.target.closest?.('.clip');
  if (tool === 'blade' && clipEl && !e.target.dataset.edge && e.button === 0) {
    e.stopPropagation(); e.preventDefault();
    const lane = clipEl.parentElement, at = (e.clientX - lane.getBoundingClientRect().left) / Number(zoomInput.value);
    selected = clipEl.dataset.clip; time = Math.round(at * FPS) / FPS; render(); $('split').onclick();
    return;
  }
  const ruler = e.target.closest?.('.time-ruler');
  if (ruler && e.button === 0) {
    const inner = ruler.firstElementChild, move = ev => seek((ev.clientX - inner.getBoundingClientRect().left) / Number(zoomInput.value));
    move(e); ruler.setPointerCapture?.(e.pointerId);
    const up = () => { ruler.removeEventListener('pointermove', move); ruler.removeEventListener('pointerup', up); ruler.removeEventListener('pointercancel', up); };
    ruler.addEventListener('pointermove', move); ruler.addEventListener('pointerup', up); ruler.addEventListener('pointercancel', up);
  }
}, true);
tracksEl.addEventListener('click', e => {
  const btn = e.target.closest?.('[data-lane-act]');
  if (btn) {
    e.stopPropagation();
    const key = btn.closest('.track-name').dataset.key, act = btn.dataset.laneAct;
    laneSettings[key] ??= {}; laneSettings[key][act] = !laneSettings[key][act];
    pause(); render();
    status(act === 'locked' ? (laneSettings[key].locked ? 'Piste verrouillée.' : 'Piste déverrouillée.') : (laneSettings[key].hidden ? 'Piste masquée : elle n’apparaît plus et son son est coupé.' : 'Piste de nouveau active.'));
    return;
  }
  const tr = e.target.closest?.('.transition-btn'); if (tr) { e.stopPropagation(); showTransitionMenu(tr); }
}, true);
tracksEl.addEventListener('dblclick', e => {
  const nameEl = e.target.closest?.('[data-rename]'); if (!nameEl) return;
  const head = nameEl.closest('.track-name'), key = head.dataset.key, input = document.createElement('input');
  input.value = laneSettings[key]?.name || nameEl.textContent; input.maxLength = 40; input.setAttribute('aria-label', 'Nom de la piste');
  nameEl.replaceWith(input); input.focus(); input.select();
  let done = false;
  const finish = save => { if (done) return; done = true; if (save) { laneSettings[key] ??= {}; laneSettings[key].name = input.value.trim().slice(0, 40); } render(); };
  input.addEventListener('keydown', ev => { if (ev.key === 'Enter') finish(true); if (ev.key === 'Escape') finish(false); ev.stopPropagation(); });
  input.addEventListener('blur', () => finish(true));
});
// Glisser un média de la médiathèque directement sur une piste.
tracksEl.addEventListener('dragover', e => { const lane = e.target.closest?.('.track-lane'); const a = asset(draggedAsset); if (!lane || !a || lane.dataset.kind !== a.kind) return; e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
tracksEl.addEventListener('drop', e => {
  const lane = e.target.closest?.('.track-lane'), a = asset(draggedAsset); if (!lane || !a || lane.dataset.kind !== a.kind) return;
  e.preventDefault();
  if (!a.el) return status('Réimporte le fichier original pour l’utiliser.');
  const n = Number(lane.dataset.lane); if (laneData({kind:a.kind, lane:n}).locked) return status('Cette piste est verrouillée.');
  const zoom = Number(zoomInput.value);
  const c = {id:uid(), asset:a.id, kind:a.kind, lane:n, start:0, trim:0, duration:a.kind === 'image' ? 5 : a.duration, volume:1};
  const at = snappedStart(c, (e.clientX - lane.getBoundingClientRect().left) / zoom, zoom, !e.altKey);
  if (!canPlaceClip(c, at)) return status('Pas de place à cet endroit sur la piste : les clips d’une même piste ne se chevauchent pas.');
  pause(); checkpoint(); c.start = at; clips.push(c); selected = c.id; time = at; render(); status(`« ${a.name} » placé sur ${laneLabel(a.kind, n)} à ${timecode(at)}.`);
});
function junctions(list = clips) {
  const result = [];
  for (const kind of tracks) for (let lane = 0; lane < 3; lane++) {
    const row = list.filter(c => c.kind === kind && (c.lane || 0) === lane).sort((a, b) => a.start - b.start);
    for (let i = 1; i < row.length; i++) if (Math.abs(row[i - 1].start + row[i - 1].duration - row[i].start) < .03) result.push({a:row[i - 1], b:row[i]});
  }
  return result;
}
let menuPair = null;
const transitionMenu = $('transition-menu');
function showTransitionMenu(btn) {
  menuPair = {a:btn.dataset.a, b:btn.dataset.b};
  const r = btn.getBoundingClientRect(); transitionMenu.hidden = false;
  transitionMenu.style.left = Math.min(window.innerWidth - 260, r.left) + 'px'; transitionMenu.style.top = (r.bottom + 4) + 'px';
  transitionMenu.querySelector('button').focus();
}
function hideTransitionMenu() { transitionMenu.hidden = true; menuPair = null; }
document.addEventListener('pointerdown', e => { if (!transitionMenu.hidden && !e.target.closest?.('#transition-menu,.transition-btn')) hideTransitionMenu(); });
transitionMenu.addEventListener('click', e => {
  const kind = e.target.closest?.('[data-transition]')?.dataset.transition; if (!kind || !menuPair) return;
  const a = clips.find(c => c.id === menuPair.a), b = clips.find(c => c.id === menuPair.b); hideTransitionMenu();
  if (!a || !b) return;
  if (typeof locked === 'function' && (locked(a) || locked(b))) return;
  if (kind === 'cross') { selected = b.id; render(); $('crossfade').onclick(); return; }
  pause(); checkpoint();
  if (kind === 'black') { const d = Math.min(.5, a.duration / 2, b.duration / 2); a.fadeOut = Math.min(d, a.duration - (a.fadeIn || 0)); b.fadeIn = Math.min(d, b.duration - (b.fadeOut || 0)); status('Fondu au noir ajouté entre les deux clips.'); }
  else { a.fadeOut = 0; b.fadeIn = 0; status('Transition retirée.'); }
  render();
});
function decorateTimeline() {
  const zoom = Number(zoomInput.value);
  for (const track of tracksEl.querySelectorAll('.track')) {
    const lane = track.querySelector('.track-lane'); if (!lane) continue;
    const kind = lane.dataset.kind, n = Number(lane.dataset.lane), s = laneData({kind, lane:n}), head = track.querySelector('.track-name');
    head.dataset.key = laneKey(kind, n);
    head.innerHTML = `<span class="lane-ico">${ICON(laneIcon(kind, n))}</span><span class="lane-name" data-rename title="Double-clic pour renommer">${esc(laneLabel(kind, n))}</span><button class="lane-btn${s.hidden ? ' off' : ''}" data-lane-act="hidden" title="${s.hidden ? 'Réafficher la piste' : 'Masquer la piste (et couper son son)'}" aria-label="${s.hidden ? 'Réafficher' : 'Masquer'} ${esc(laneLabel(kind, n))}">${ICON(s.hidden ? 'eye-off' : 'eye')}</button><button class="lane-btn${s.locked ? ' off' : ''}" data-lane-act="locked" title="${s.locked ? 'Déverrouiller' : 'Verrouiller'} la piste" aria-label="${s.locked ? 'Déverrouiller' : 'Verrouiller'} ${esc(laneLabel(kind, n))}">${ICON(s.locked ? 'lock' : 'unlock')}</button>`;
    track.classList.toggle('lane-hidden', !!s.hidden); track.classList.toggle('lane-locked', !!s.locked);
  }
  for (const b of tracksEl.querySelectorAll('[data-clip]')) {
    const c = clips.find(x => x.id === b.dataset.clip), a = c && asset(c.asset); if (!c) continue;
    if (!b.querySelector('.kind-ico')) b.insertAdjacentHTML('afterbegin', `<span class="kind-ico">${ICON(c.kind === 'audio' ? laneIcon('audio', c.lane || 0) : kindIcon(a || {kind:c.kind}))}</span>`);
    b.classList.toggle('title', isTitle(a));
    if (c.kind !== 'audio' && a?.thumbnail && !isTitle(a)) { b.classList.add('filmstrip'); b.style.backgroundImage = `url("${a.thumbnail.replace(/"/g, '%22')}")`; }
  }
  for (const {a, b} of junctions()) {
    const laneEl = tracksEl.querySelector(`.track-lane[data-kind="${b.kind}"][data-lane="${b.lane || 0}"]`); if (!laneEl) continue;
    const on = (a.fadeOut || 0) > 0 && (b.fadeIn || 0) > 0;
    laneEl.insertAdjacentHTML('beforeend', `<button class="transition-btn${on ? ' on' : ''}" data-a="${esc(a.id)}" data-b="${esc(b.id)}" style="left:${b.start * zoom - 10}px" title="Transition entre « ${esc(asset(a.asset)?.name || 'clip')} » et « ${esc(asset(b.asset)?.name || 'clip')} »" aria-label="Choisir une transition">${ICON('transition')}</button>`);
  }
}

/* =====================================================================
   ESPACE AUDIO : tranches de mixeur, égaliseur graphique, sélection d’une zone
   ===================================================================== */
let stripSig = '', stripLast = 0;
function stripSpecs() {
  const list = [{id:'video', name:'Son vidéo', kind:'bus'}];
  const audioLanes = Math.max(laneCounts.audio, ...clips.filter(c => c.kind === 'audio').map(c => (c.lane || 0) + 1));
  for (let n = 0; n < audioLanes; n++) list.push({id:laneKey('audio', n), name:laneLabel('audio', n), kind:'lane'});
  list.push({id:'master', name:'Master', kind:'master'});
  return list;
}
function renderStrips() {
  const specs = stripSpecs(), sig = JSON.stringify(specs);
  if (sig !== stripSig) {
    stripSig = sig;
    $('mixer-strips').innerHTML = specs.map(s => {
      const bars = s.kind === 'master' ? '<span class="bar" data-meter="master:0"><i></i><b></b></span><span class="bar" data-meter="master:1"><i></i><b></b></span>' : `<span class="bar" data-meter="${s.kind === 'bus' ? 'video:0' : 'lane:' + s.id}"><i></i><b></b></span>`;
      return `<div class="strip${s.kind === 'master' ? ' master' : ''}" data-strip="${esc(s.id)}" data-kind="${s.kind}"><div class="sname" title="${esc(s.name)}">${esc(s.name)}</div><div class="body"><input type="range" min="0" max="100" step="1" data-fader aria-label="Niveau ${esc(s.name)}"><span class="vvu" aria-hidden="true">${bars}</span></div><div class="db" data-dbl></div><div class="sm">${s.kind === 'lane' ? '<button class="solo" data-solo aria-pressed="false" title="Solo : n’écouter que cette piste">S</button>' : ''}${s.kind !== 'master' ? '<button data-mute aria-pressed="false" title="Muet">M</button>' : ''}</div></div>`;
    }).join('');
  }
  syncStrips();
}
function stripLevel(strip) { const id = strip.dataset.strip; if (id === 'video') return mix.video * 100; if (id === 'master') return mix.master * 100; return laneSettings[id]?.volume ?? 100; }
function syncStrips() {
  for (const strip of document.querySelectorAll('#mixer-strips .strip')) {
    const id = strip.dataset.strip, level = stripLevel(strip), fader = strip.querySelector('[data-fader]');
    if (document.activeElement !== fader) fader.value = Math.round(level);
    strip.querySelector('[data-dbl]').textContent = dbText(level > 0 ? 20 * Math.log10(level / 100) : -Infinity);
    const mute = strip.querySelector('[data-mute]'), solo = strip.querySelector('[data-solo]');
    if (mute) mute.setAttribute('aria-pressed', String(id === 'video' ? mix.muteVideo : !!laneSettings[id]?.hidden));
    if (solo) solo.setAttribute('aria-pressed', String(!!laneSettings[id]?.solo));
  }
}
const stripsEl = $('mixer-strips');
stripsEl.addEventListener('input', e => {
  if (!e.target.matches?.('[data-fader]')) return;
  const id = e.target.closest('.strip').dataset.strip, v = Number(e.target.value);
  if (id === 'video') mix.video = v / 100; else if (id === 'master') mix.master = v / 100; else { laneSettings[id] ??= {}; laneSettings[id].volume = v; }
  syncMixer(); syncStrips();
});
stripsEl.addEventListener('click', e => {
  const b = e.target.closest?.('[data-mute],[data-solo]'); if (!b) return;
  const id = b.closest('.strip').dataset.strip;
  if (b.hasAttribute('data-mute')) { if (id === 'video') mix.muteVideo = !mix.muteVideo; else { laneSettings[id] ??= {}; laneSettings[id].hidden = !laneSettings[id].hidden; } }
  else { laneSettings[id] ??= {}; laneSettings[id].solo = !laneSettings[id].solo; }
  syncMixer(); render();
});
function stripMeterFrame() {
  const now = performance.now(), dt = Math.min(.1, stripLast ? (now - stripLast) / 1000 : 0); stripLast = now;
  const buffer = meterBuffer;
  for (const [key, m] of laneMeters) {
    let peak = 0;
    if (playing) { m.an.getFloatTimeDomainData(buffer); for (let i = 0; i < buffer.length; i++) { const v = Math.abs(buffer[i]); if (v > peak) peak = v; } }
    ballistic(m.s, peak, now, dt);
  }
  for (const bar of document.querySelectorAll('#mixer-strips [data-meter]')) {
    const ref = bar.dataset.meter, [bus, ch] = ref.split(':');
    const state = ref.startsWith('lane:') ? laneMeters.get(ref.slice(5))?.s : meterState[bus]?.[Number(ch) || 0];
    const db = state ? state.db : -Infinity, hold = state ? state.hold : -Infinity;
    bar.firstElementChild.style.clipPath = `inset(${(100 - dbToRatio(db) * 100).toFixed(1)}% 0 0 0)`;
    const h = dbToRatio(hold), mark = bar.lastElementChild; mark.style.bottom = `calc(${(h * 100).toFixed(1)}% - 2px)`; mark.style.opacity = h > 0 ? 1 : 0;
    bar.classList.toggle('clipping', !!state && now - state.clipAt < CLIP_MS);
  }
}
// Égaliseur graphique (mêmes filtres que la lecture et l’export : 200 Hz, 1 kHz, 4 kHz).
const EQ_BANDS = [{key:'eqLow', type:'lowshelf', f:200, label:'Graves'}, {key:'eqMid', type:'peaking', f:1000, label:'Médiums'}, {key:'eqHigh', type:'highshelf', f:4000, label:'Aigus'}];
const EQ_PRESETS = {flat:[0, 0, 0], voice:[-4, 2, 4], bass:[5, 0, -1], soft:[0, -1, -4], radio:[-9, 4, -7]};
const EQ = {W:520, H:190, L:36, R:12, T:12, B:24};
const eqX = f => EQ.L + Math.log10(f / 20) / 3 * (EQ.W - EQ.L - EQ.R);
const eqY = db => EQ.T + (12 - db) / 24 * (EQ.H - EQ.T - EQ.B);
const eqDb = y => clamp(Math.round((12 - (y - EQ.T) / (EQ.H - EQ.T - EQ.B) * 24) * 2) / 2, -12, 12);
let eqContext = null;
function eqResponse(points) {
  try {
    eqContext ??= new OfflineAudioContext(1, 128, 44100);
    const freqs = new Float32Array(points), mags = new Float32Array(points).fill(1), mag = new Float32Array(points), phase = new Float32Array(points);
    for (let i = 0; i < points; i++) freqs[i] = 20 * Math.pow(1000, i / (points - 1));
    for (const band of EQ_BANDS) { const f = eqContext.createBiquadFilter(); f.type = band.type; f.frequency.value = band.f; f.Q.value = .7; f.gain.value = mix[band.key] || 0; f.getFrequencyResponse(freqs, mag, phase); for (let i = 0; i < points; i++) mags[i] *= mag[i]; }
    return {freqs, db:Array.from(mags, m => 20 * Math.log10(Math.max(1e-6, m)))};
  } catch { return null; }
}
function drawEq() {
  const svg = $('eq-graph'); if (!svg) return;
  let h = '<g class="grid">';
  for (const db of [12, 6, 0, -6, -12]) h += `<line x1="${EQ.L}" x2="${EQ.W - EQ.R}" y1="${eqY(db)}" y2="${eqY(db)}"/><text x="2" y="${eqY(db) + 3}">${db > 0 ? '+' + db : db} dB</text>`;
  for (const [f, label] of [[50, '50'], [100, '100'], [250, '250'], [1000, '1k'], [3000, '3k'], [6000, '6k'], [12000, '12k']]) h += `<line y1="${EQ.T}" y2="${EQ.H - EQ.B}" x1="${eqX(f)}" x2="${eqX(f)}"/><text x="${eqX(f) - 8}" y="${EQ.H - 6}">${label}</text>`;
  h += '</g>';
  const r = eqResponse(140);
  if (r) {
    const pts = Array.from(r.freqs, (f, i) => `${eqX(f).toFixed(1)},${eqY(clamp(r.db[i], -13, 13)).toFixed(1)}`);
    h += `<path class="fillc" d="M${eqX(20)},${eqY(0)} L${pts.join(' L')} L${eqX(20000)},${eqY(0)} Z"/><path class="curve" d="M${pts.join(' L')}"/>`;
  }
  EQ_BANDS.forEach((band, i) => { const g = mix[band.key] || 0; h += `<circle class="handle" tabindex="0" role="slider" aria-label="${band.label}" aria-valuemin="-12" aria-valuemax="12" aria-valuenow="${g}" aria-valuetext="${dbText(g)}" data-band="${i}" cx="${eqX(band.f)}" cy="${eqY(g)}" r="8"/>`; });
  svg.innerHTML = h;
  $('eq-low-v').textContent = dbText(mix.eqLow || 0); $('eq-mid-v').textContent = dbText(mix.eqMid || 0); $('eq-high-v').textContent = dbText(mix.eqHigh || 0);
}
function setEq(key, value) { mix[key] = clamp(value, -12, 12); syncMixer(); $('eq-preset').value = Object.entries(EQ_PRESETS).find(([, v]) => v.every((g, i) => g === mix[EQ_BANDS[i].key]))?.[0] || ''; drawEq(); }
const eqSvg = $('eq-graph');
eqSvg.addEventListener('pointerdown', e => {
  const handle = e.target.closest?.('.handle'); if (!handle) return;
  e.preventDefault(); const band = EQ_BANDS[Number(handle.dataset.band)], pointer = e.pointerId; eqSvg.setPointerCapture?.(pointer);
  const move = ev => { const r = eqSvg.getBoundingClientRect(); setEq(band.key, eqDb((ev.clientY - r.top) * EQ.W / r.width)); };
  const up = () => { eqSvg.removeEventListener('pointermove', move); eqSvg.removeEventListener('pointerup', up); eqSvg.removeEventListener('pointercancel', up); eqSvg.querySelector(`[data-band="${EQ_BANDS.indexOf(band)}"]`)?.focus(); };
  eqSvg.addEventListener('pointermove', move); eqSvg.addEventListener('pointerup', up); eqSvg.addEventListener('pointercancel', up);
});
eqSvg.addEventListener('keydown', e => {
  const handle = e.target.closest?.('.handle'); if (!handle) return; const band = EQ_BANDS[Number(handle.dataset.band)];
  const step = {ArrowUp:.5, ArrowRight:.5, ArrowDown:-.5, ArrowLeft:-.5, PageUp:3, PageDown:-3}[e.key]; if (step === undefined && e.key !== 'Home') return;
  e.preventDefault(); setEq(band.key, e.key === 'Home' ? 0 : (mix[band.key] || 0) + step); eqSvg.querySelector(`[data-band="${handle.dataset.band}"]`)?.focus();
});
$('eq-preset').onchange = e => { const p = EQ_PRESETS[e.target.value]; if (!p) return; EQ_BANDS.forEach((b, i) => { mix[b.key] = p[i]; }); syncMixer(); drawEq(); status('Préréglage « ' + e.target.selectedOptions[0].textContent + ' » appliqué à l’égaliseur du projet.'); };
// Sélection d’une zone sur la forme d’onde (espace Audio).
let region = null;
const WAVE_PAD = 80;
function canvasPoint(e) {
  const r = canvas.getBoundingClientRect(), scale = Math.min(r.width / canvas.width, r.height / canvas.height);
  return {x:(e.clientX - r.left - (r.width - canvas.width * scale) / 2) / scale, y:(e.clientY - r.top - (r.height - canvas.height * scale) / 2) / scale, scale};
}
function waveTarget() { const c = clip(); return c && c.kind === 'audio' && asset(c.asset)?.duration ? {c, a:asset(c.asset)} : null; }
const waveTimeAt = (x, a) => clamp((x - WAVE_PAD) / (canvas.width - 2 * WAVE_PAD), 0, 1) * a.duration;
const waveXAt = (t, a) => WAVE_PAD + t / a.duration * (canvas.width - 2 * WAVE_PAD);
canvas.addEventListener('pointerdown', e => {
  if (space !== 'audio' || e.button !== 0) return;
  const target = waveTarget(); if (!target) return status('Sélectionne un clip audio dans la timeline pour choisir une zone de sa forme d’onde.');
  const {c, a} = target, lo = c.trim, hi = c.trim + c.duration;
  const anchor = clamp(waveTimeAt(canvasPoint(e).x, a), lo, hi);
  region = {clipId:c.id, from:anchor, to:anchor}; canvas.setPointerCapture?.(e.pointerId);
  const move = ev => { const t = clamp(waveTimeAt(canvasPoint(ev).x, a), lo, hi); region.from = Math.min(anchor, t); region.to = Math.max(anchor, t); showRegionBar(); };
  const up = () => { canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); if (region && region.to - region.from < .05) region = null; showRegionBar(); };
  canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
});
function showRegionBar() {
  const ok = space === 'audio' && region && region.clipId === selected && region.to - region.from >= .05;
  $('region-bar').hidden = !ok;
  if (ok) $('region-label').textContent = `Zone ${stamp(region.from)} → ${stamp(region.to)} · ${comma(region.to - region.from, 2)} s`;
}
function regionClip() { const c = clips.find(x => x.id === region?.clipId); if (!c) { region = null; showRegionBar(); } return c; }
$('region-clear').onclick = () => { region = null; showRegionBar(); };
$('region-listen').onclick = async () => {
  const c = regionClip(); if (!c) return; pause();
  time = c.start + (region.from - c.trim); listenStop = c.start + (region.to - c.trim);
  await $('play').onclick();
};
function keepRegion(c, from, to) {
  const before = {start:c.start, duration:c.duration, trim:c.trim};
  c.start = r2f(c.start + (from - c.trim)); c.duration = r2f(to - from); c.trim = r2f(from);
  c.fadeIn = Math.min(c.fadeIn || 0, c.duration / 2); c.fadeOut = Math.min(c.fadeOut || 0, c.duration / 2);
  return followLinked(c, before);
}
function cutRegion(c, from, to) {
  const t1 = c.start + (from - c.trim), restore = {...c};
  const right = {...c, id:uid(), start:r2f(t1), trim:r2f(to), duration:r2f(c.trim + c.duration - to), fadeIn:0};
  c.duration = r2f(from - c.trim); c.fadeOut = 0;
  const parts = [];
  if (c.duration >= .05) parts.push(c); else clips = clips.filter(x => x !== c);
  if (right.duration >= .05) { delete right.link; clips.push(right); parts.push(right); }
  for (const p of parts) { p.fadeIn = Math.min(p.fadeIn || 0, p.duration / 2); p.fadeOut = Math.min(p.fadeOut || 0, p.duration / 2); }
  return {parts, restore};
}
$('region-keep').onclick = () => {
  const c = regionClip(); if (!c || (typeof locked === 'function' && locked(c))) return;
  pause(); checkpoint();
  if (!keepRegion(c, region.from, region.to)) { clips = JSON.parse(history.pop()); $('undo').disabled = !history.length; render(); return status('Refusé : un clip lié ne peut pas suivre. Délie-le d’abord.'); }
  region = null; render(); status('Seule la zone sélectionnée est conservée. Annuler la rétablit.');
};
$('region-cut').onclick = () => {
  const c = regionClip(); if (!c || (typeof locked === 'function' && locked(c))) return;
  if (c.link && linkedTo(c).length) return status('Ce son est lié à une image : délie-le avant de supprimer une zone à l’intérieur.');
  pause(); checkpoint(); cutRegion(c, region.from, region.to);
  region = null; selected = null; render(); status('Zone supprimée : la suite du son est recollée juste après. Annuler la rétablit.');
};
// Têtes de piste élargies (150 px au lieu de 125) : on recale le curseur et la largeur de la table.
const TRACK_HEAD = 150;
const fusionDraw = draw;
draw = () => {
  fusionDraw();
  const cursor = tracksEl.querySelector('.cursor'); if (cursor) cursor.style.left = `${TRACK_HEAD + time * Number(zoomInput.value)}px`;
  if (space === 'audio' && region && region.clipId === selected) {
    const a = asset(clips.find(x => x.id === region.clipId)?.asset); if (!a?.duration) return;
    const x1 = waveXAt(region.from, a), x2 = waveXAt(region.to, a);
    ctx.save(); ctx.fillStyle = '#ff7a1a33'; ctx.fillRect(x1, 70, x2 - x1, canvas.height - 170);
    ctx.strokeStyle = '#ff9a45'; ctx.lineWidth = 4; ctx.strokeRect(x1, 70, x2 - x1, canvas.height - 170); ctx.restore();
  }
};

/* =====================================================================
   ESPACE PHOTO : outils, recadrage à poignées, calques, réglages avancés
   ===================================================================== */
const PHOTO_EXTRA = ['exposure', 'highlights', 'shadows', 'temperature', 'crop'];
const fusionCleanPhoto = cleanPhoto;
cleanPhoto = s => {
  const b = fusionCleanPhoto(s);
  b.exposure = bounded(s?.exposure, -2, 2, 0); b.highlights = bounded(s?.highlights, -100, 100, 0); b.shadows = bounded(s?.shadows, -100, 100, 0); b.temperature = bounded(s?.temperature, -100, 100, 0);
  const c = s?.crop;
  if (c && [c.x, c.y, c.w, c.h].every(Number.isFinite) && c.w >= .01 && c.h >= .01) {
    const x = clamp(c.x, 0, .99), y = clamp(c.y, 0, .99); b.crop = {x, y, w:clamp(c.w, .01, 1 - x), h:clamp(c.h, .01, 1 - y)};
  } else b.crop = null;
  return b;
};
const pickExtras = s => Object.fromEntries(PHOTO_EXTRA.map(k => [k, s[k]]));
let lastPhotoChange = 0, forceFullPhoto = false, photoTool = 'select', cropDraft = null, selectedLayer = null;
function photoChanged() { lastPhotoChange = performance.now(); }
function updatePhoto(patch) { const a = asset(photo); if (!a) return null; a.photoSettings = cleanPhoto({...cleanPhoto(a.photoSettings), ...patch}); photoChanged(); return a.photoSettings; }
const fusionStore = storePhoto;
storePhoto = () => { const a = asset(photo); if (!a) return; const keep = pickExtras(cleanPhoto(a.photoSettings)); fusionStore(); Object.assign(a.photoSettings, keep); photoChanged(); sizePhoto(); };
const fusionRestore = restorePhoto;
restorePhoto = () => { fusionRestore(); syncPhotoPanel(); };
function rotatedSize(a, s) { return s.rotation % 180 ? [a.height, a.width] : [a.width, a.height]; }
const fusionSizePhoto = sizePhoto;
sizePhoto = () => {
  const a = asset(photo); if (!a) return; const s = cleanPhoto(a.photoSettings), [rw, rh] = rotatedSize(a, s);
  if (photoTool === 'crop') { canvas.width = rw; canvas.height = rh; }
  else if (s.crop) { canvas.width = Math.max(1, Math.round(s.crop.w * rw)); canvas.height = Math.max(1, Math.round(s.crop.h * rh)); }
  else return fusionSizePhoto();
  $('resolution').textContent = `${canvas.width} × ${canvas.height}`;
};
function toneMap(d, s) {
  const ex = Math.pow(2, s.exposure), sh = s.shadows / 100 * .4, hl = s.highlights / 100 * .4, tp = s.temperature / 100 * .12;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i] / 255 * ex, g = d[i + 1] / 255 * ex, b = d[i + 2] / 255 * ex;
    const L = .2126 * r + .7152 * g + .0722 * b;
    const ws = L < .5 ? Math.pow(1 - L / .5, 2) : 0, wh = L > .5 ? Math.min(1, Math.pow((L - .5) / .5, 2)) : 0, delta = sh * ws + hl * wh;
    r += delta + tp; g += delta + tp * .15; b += delta - tp;
    d[i] = r <= 0 ? 0 : r >= 1 ? 255 : r * 255; d[i + 1] = g <= 0 ? 0 : g >= 1 ? 255 : g * 255; d[i + 2] = b <= 0 ? 0 : b >= 1 ? 255 : b * 255;
  }
  return d;
}
let photoCache = {key:'', canvas:null};
function processedBase(a, s, full) {
  const [rw, rh] = rotatedSize(a, s), scale = full ? 1 : Math.min(1, 1600 / Math.max(rw, rh));
  const key = [a.id, s.rotation, s.brightness, s.contrast, s.saturation, s.exposure, s.highlights, s.shadows, s.temperature, s.adjustmentsVisible, scale].join('|');
  if (photoCache.key === key) return photoCache.canvas;
  const out = document.createElement('canvas'); out.width = Math.max(1, Math.round(rw * scale)); out.height = Math.max(1, Math.round(rh * scale));
  const g = out.getContext('2d', {willReadFrequently:true});
  if (s.adjustmentsVisible) g.filter = `brightness(${s.brightness}%) contrast(${s.contrast}%) saturate(${s.saturation}%)`;
  g.translate(out.width / 2, out.height / 2); g.rotate(s.rotation * Math.PI / 180);
  g.drawImage(a.el, -a.width * scale / 2, -a.height * scale / 2, a.width * scale, a.height * scale);
  g.setTransform(1, 0, 0, 1, 0, 0); g.filter = 'none';
  if (s.adjustmentsVisible && (s.exposure || s.highlights || s.shadows || s.temperature)) { const img = g.getImageData(0, 0, out.width, out.height); toneMap(img.data, s); g.putImageData(img, 0, 0); }
  photoCache = {key, canvas:out};
  return out;
}
function sourceRect(s, rw, rh, W, H) {
  if (s.crop) return [s.crop.x * rw, s.crop.y * rh, s.crop.w * rw, s.crop.h * rh];
  const aspect = W / H; let sw, sh;
  if (rw / rh > aspect) { sh = rh; sw = rh * aspect; } else { sw = rw; sh = rw / aspect; }
  sw /= s.zoom / 100; sh /= s.zoom / 100;
  return [(rw - sw) / 2, (rh - sh) / 2, sw, sh];
}
paintPhoto = () => {
  const W = canvas.width, H = canvas.height; ctx.clearRect(0, 0, W, H);
  const a = asset(photo); if (!a?.el) return;
  const s = cleanPhoto(a.photoSettings), [rw, rh] = rotatedSize(a, s);
  const base = processedBase(a, s, forceFullPhoto || performance.now() - lastPhotoChange > 350), k = base.width / rw;
  if (photoTool === 'crop') { ctx.drawImage(base, 0, 0, W, H); drawCropOverlay(W, H); return; }
  const [sx, sy, sw, sh] = sourceRect(s, rw, rh, W, H);
  ctx.drawImage(base, sx * k, sy * k, sw * k, sh * k, 0, 0, W, H);
  s.layers.forEach((l, i) => {
    const source = asset(l.asset); if (l.hidden || !source?.el) return;
    const lw = W * l.scale / 100, lh = lw * source.height / source.width, x = (W - lw) / 2 + W * l.x / 100, y = (H - lh) / 2 + H * l.y / 100;
    ctx.save(); ctx.globalAlpha = l.opacity / 100; ctx.drawImage(source.el, x, y, lw, lh); ctx.restore();
    if (!forceFullPhoto && photoTool === 'select' && selectedLayer === i) { ctx.save(); ctx.strokeStyle = '#ff9a45'; ctx.lineWidth = Math.max(2, W / 500); ctx.setLineDash([W / 120, W / 160]); ctx.strokeRect(x, y, lw, lh); ctx.restore(); }
  });
  if (s.caption && s.captionVisible) { ctx.save(); ctx.font = `bold ${Math.round(W * .045)}px Segoe UI`; ctx.textAlign = 'center'; ctx.fillStyle = 'white'; ctx.strokeStyle = '#000b'; ctx.lineWidth = W * .003; ctx.strokeText(s.caption, W / 2, H * .88, W * .9); ctx.fillText(s.caption, W / 2, H * .88, W * .9); ctx.restore(); }
};
function cropAspect(a, s) {
  const v = $('crop-aspect').value; if (v === 'free') return null;
  const [rw, rh] = rotatedSize(a, s), pixel = v === 'original' ? rw / rh : Number(v);
  return pixel * rh / rw; // rapport largeur/hauteur en coordonnées normalisées
}
function fitAspect(r, ratio, anchor = 'center') {
  if (!ratio) return r;
  let w = r.w, h = w / ratio; if (h > 1) { h = 1; w = h * ratio; } if (w > 1) { w = 1; h = w / ratio; }
  let x = anchor === 'center' ? r.x + (r.w - w) / 2 : r.x, y = anchor === 'center' ? r.y + (r.h - h) / 2 : r.y;
  x = clamp(x, 0, 1 - w); y = clamp(y, 0, 1 - h);
  return {x, y, w, h};
}
function drawCropOverlay(W, H) {
  const r = cropDraft || {x:0, y:0, w:1, h:1}, x = r.x * W, y = r.y * H, w = r.w * W, h = r.h * H, lw = Math.max(2, W / 600), hs = Math.max(10, W / 90);
  ctx.save();
  ctx.fillStyle = '#000000a0'; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.rect(x, y, w, h); ctx.fill('evenodd');
  ctx.strokeStyle = '#ffffffa0'; ctx.lineWidth = lw / 2;
  for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x + w * i / 3, y); ctx.lineTo(x + w * i / 3, y + h); ctx.moveTo(x, y + h * i / 3); ctx.lineTo(x + w, y + h * i / 3); ctx.stroke(); }
  ctx.strokeStyle = '#fff'; ctx.lineWidth = lw; ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = '#fff';
  for (const [hx, hy] of [[0, 0], [.5, 0], [1, 0], [1, .5], [1, 1], [.5, 1], [0, 1], [0, .5]]) ctx.fillRect(x + w * hx - hs / 2, y + h * hy - hs / 2, hs, hs);
  ctx.restore();
}
function cropHit(p, W, H, scale) {
  const r = cropDraft, tol = 14 / scale, X = [r.x * W, (r.x + r.w / 2) * W, (r.x + r.w) * W], Y = [r.y * H, (r.y + r.h / 2) * H, (r.y + r.h) * H];
  const names = {'0,0':'nw', '1,0':'n', '2,0':'ne', '2,1':'e', '2,2':'se', '1,2':'s', '0,2':'sw', '0,1':'w'};
  for (const [key, name] of Object.entries(names)) { const [i, j] = key.split(',').map(Number); if (Math.abs(p.x - X[i]) < tol && Math.abs(p.y - Y[j]) < tol) return name; }
  if (p.x > X[0] && p.x < X[2] && p.y > Y[0] && p.y < Y[2]) return 'move';
  return 'new';
}
function dragCrop(start, mode, dx, dy, ratio, origin) {
  let {x, y, w, h} = start; const min = .02;
  if (mode === 'move') { x = clamp(x + dx, 0, 1 - w); y = clamp(y + dy, 0, 1 - h); return {x, y, w, h}; }
  if (mode === 'new') { const x2 = clamp(origin.x + dx, 0, 1), y2 = clamp(origin.y + dy, 0, 1); x = Math.min(origin.x, x2); y = Math.min(origin.y, y2); w = Math.max(min, Math.abs(x2 - origin.x)); h = Math.max(min, Math.abs(y2 - origin.y)); }
  else {
    if (mode.includes('w')) { const nx = clamp(x + dx, 0, x + w - min); w += x - nx; x = nx; }
    if (mode.includes('e')) w = clamp(w + dx, min, 1 - x);
    if (mode.includes('n')) { const ny = clamp(y + dy, 0, y + h - min); h += y - ny; y = ny; }
    if (mode.includes('s')) h = clamp(h + dy, min, 1 - y);
  }
  if (ratio) {
    if (mode === 'n' || mode === 's') { const nw = h * ratio; x = clamp(x + (w - nw) / 2, 0, 1 - Math.min(1, nw)); w = Math.min(nw, 1 - x); h = w / ratio; }
    else { const nh = w / ratio; if (mode.includes('n')) y = y + h - nh; h = nh; if (y < 0) { y = 0; h = Math.min(h, start.y + start.h); w = h * ratio; } if (y + h > 1) { h = 1 - y; w = h * ratio; } if (mode.includes('w')) x = start.x + start.w - w; }
  }
  return {x:clamp(x, 0, 1 - min), y:clamp(y, 0, 1 - min), w:clamp(w, min, 1), h:clamp(h, min, 1)};
}
function setPhotoTool(name) {
  const a = asset(photo);
  if (name !== 'select' && !a?.el) { status('Choisis d’abord une photo dans la médiathèque.'); name = 'select'; }
  photoTool = name;
  for (const b of document.querySelectorAll('[data-photo-tool]')) b.setAttribute('aria-pressed', String(b.dataset.photoTool === name));
  document.body.classList.toggle('tool-crop', name === 'crop'); document.body.classList.toggle('tool-dropper', name === 'dropper');
  $('crop-bar').hidden = name !== 'crop';
  if (name === 'crop') { const s = cleanPhoto(a.photoSettings); cropDraft = s.crop ? {...s.crop} : {x:0, y:0, w:1, h:1}; status('Recadrage : tire les poignées ou dessine un nouveau cadre, puis Valider.'); }
  if (a) { sizePhoto(); sizePreview(); }
  draw();
}
for (const b of document.querySelectorAll('[data-photo-tool]')) b.onclick = () => setPhotoTool(photoTool === b.dataset.photoTool && b.dataset.photoTool !== 'select' ? 'select' : b.dataset.photoTool);
$('crop-done').onclick = () => {
  const full = cropDraft && cropDraft.w > .995 && cropDraft.h > .995;
  updatePhoto({crop:full ? null : cropDraft}); if (!full) { $('photo-ratio').value = 'original'; $('photo-zoom').value = 100; }
  setPhotoTool('select'); status(full ? 'Image entière conservée.' : `Recadrage appliqué : ${canvas.width} × ${canvas.height} pixels.`);
};
$('crop-reset').onclick = () => { cropDraft = {x:0, y:0, w:1, h:1}; draw(); };
$('crop-aspect').onchange = () => { const a = asset(photo); if (!a || !cropDraft) return; cropDraft = fitAspect(cropDraft, cropAspect(a, cleanPhoto(a.photoSettings))); draw(); };
for (const b of document.querySelectorAll('[data-photo-action]')) b.onclick = () => {
  const act = b.dataset.photoAction, a = asset(photo);
  if (act === 'text') { $('caption').focus(); return; }
  if (act === 'settings') { $('photo-settings').scrollIntoView({block:'nearest'}); $('ph-exposure').focus(); return; }
  if (act === 'rotate') { if (!a) return status('Choisis d’abord une photo.'); const s = cleanPhoto(a.photoSettings); $('photo-rotation').value = (s.rotation + 90) % 360; storePhoto(); updatePhoto({crop:null}); sizePhoto(); sizePreview(); draw(); status('Photo tournée d’un quart de tour (le recadrage est remis à zéro).'); }
};
canvas.addEventListener('pointerdown', e => {
  if (space !== 'photo' || e.button !== 0) return;
  const a = asset(photo); if (!a?.el) return;
  const p = canvasPoint(e), W = canvas.width, H = canvas.height;
  if (photoTool === 'crop') {
    e.preventDefault(); const mode = cropHit(p, W, H, p.scale), start = {...cropDraft}, origin = {x:clamp(p.x / W, 0, 1), y:clamp(p.y / H, 0, 1)}, ratio = cropAspect(a, cleanPhoto(a.photoSettings));
    canvas.setPointerCapture?.(e.pointerId);
    const move = ev => { const q = canvasPoint(ev); cropDraft = dragCrop(start, mode, (q.x - p.x) / W, (q.y - p.y) / H, ratio, origin); draw(); };
    const up = () => { canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); };
    canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    return;
  }
  if (photoTool === 'dropper') {
    const s = cleanPhoto(a.photoSettings), [rw, rh] = rotatedSize(a, s), base = processedBase(a, s, false), k = base.width / rw;
    const [sx, sy, sw, sh] = sourceRect(s, rw, rh, W, H), bx = Math.round((sx + p.x / W * sw) * k), by = Math.round((sy + p.y / H * sh) * k);
    const d = base.getContext('2d', {willReadFrequently:true}).getImageData(clamp(bx - 2, 0, base.width - 5), clamp(by - 2, 0, base.height - 5), 5, 5).data;
    let r = 0, g = 0, b = 0; for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
    const avg = (r + g + b) / 3; if (avg < 8) return status('Point trop sombre : clique sur une zone grise ou blanche.');
    const next = clamp(Math.round(s.temperature + (b - r) / avg * 60), -100, 100);
    updatePhoto({temperature:next}); syncPhotoPanel(); setPhotoTool('select'); status(`Balance des blancs : température réglée à ${next}.`);
    return;
  }
  if (selectedLayer === null) return;
  const s = cleanPhoto(a.photoSettings), layer = s.layers[selectedLayer]; if (!layer) return;
  e.preventDefault(); canvas.setPointerCapture?.(e.pointerId); const origin = {x:layer.x, y:layer.y};
  const move = ev => { const q = canvasPoint(ev); const now = cleanPhoto(a.photoSettings); now.layers[selectedLayer].x = clamp(origin.x + (q.x - p.x) / W * 100, -100, 100); now.layers[selectedLayer].y = clamp(origin.y + (q.y - p.y) / H * 100, -100, 100); a.photoSettings = cleanPhoto(now); draw(); };
  const up = () => { canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); syncPhotoLayers(); };
  canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
});
const PHOTO_SLIDERS = {'ph-exposure':['exposure', v => (v > 0 ? '+' : '') + comma(v, 2)], 'ph-highlights':['highlights', v => (v > 0 ? '+' : '') + v], 'ph-shadows':['shadows', v => (v > 0 ? '+' : '') + v], 'ph-temperature':['temperature', v => (v > 0 ? '+' : '') + v]};
for (const [id, [key]] of Object.entries(PHOTO_SLIDERS)) $(id).addEventListener('input', e => { if (!asset(photo)) return status('Choisis d’abord une photo.'); updatePhoto({[key]:Number(e.target.value)}); syncPhotoOutputs(); draw(); });
for (const id of ['brightness', 'contrast', 'saturation']) $(id).addEventListener('input', () => { photoChanged(); syncPhotoOutputs(); });
function syncPhotoOutputs() {
  const a = asset(photo), s = cleanPhoto(a?.photoSettings);
  for (const [id, [key, fmt]] of Object.entries(PHOTO_SLIDERS)) { if (document.activeElement !== $(id)) $(id).value = s[key]; document.querySelector(`output[data-for="${id}"]`).textContent = fmt(s[key]); }
  for (const id of ['brightness', 'contrast', 'saturation']) document.querySelector(`output[data-for="${id}"]`).textContent = $(id).value;
}
function syncPhotoPanel() { syncPhotoOutputs(); renderLayerRows(); }
function renderLayerRows() {
  const a = asset(photo), box = $('layer-rows');
  if (!a) { box.innerHTML = '<p class="hint small" style="padding:4px 6px">Choisis une photo dans la médiathèque.</p>'; return; }
  const s = cleanPhoto(a.photoSettings), rows = [];
  if (s.caption) rows.push(`<div class="layer-row" data-row="caption"><button class="eye${s.captionVisible ? '' : ' off'}" data-eye="caption" aria-label="${s.captionVisible ? 'Masquer' : 'Afficher'} le texte">${ICON(s.captionVisible ? 'eye' : 'eye-off')}</button><span class="lglyph">${ICON('type')}</span><span class="lname">Texte « ${esc(s.caption)} »</span></div>`);
  for (let i = s.layers.length - 1; i >= 0; i--) { const l = s.layers[i], src = asset(l.asset); rows.push(`<div class="layer-row${selectedLayer === i ? ' sel' : ''}" data-row="layer" data-index="${i}" title="Clique puis glisse sur l’image avec l’outil Sélection"><button class="eye${l.hidden ? ' off' : ''}" data-eye="layer" aria-label="${l.hidden ? 'Afficher' : 'Masquer'} le calque">${ICON(l.hidden ? 'eye-off' : 'eye')}</button>${src?.url ? `<img class="lthumb" src="${esc(src.thumbnail || src.url)}" alt="">` : `<span class="lglyph">${ICON('image')}</span>`}<span class="lname">${esc(src?.name || 'Image manquante')}</span></div>`); }
  rows.push(`<div class="layer-row" data-row="adjust"><button class="eye${s.adjustmentsVisible ? '' : ' off'}" data-eye="adjust" aria-label="${s.adjustmentsVisible ? 'Masquer' : 'Afficher'} les réglages">${ICON(s.adjustmentsVisible ? 'eye' : 'eye-off')}</button><span class="lglyph">${ICON('sliders')}</span><span class="lname">Réglages</span></div>`);
  rows.push(`<div class="layer-row" data-row="base"><span class="lglyph" style="width:24px">${ICON('lock')}</span>${a.url ? `<img class="lthumb" src="${esc(a.url)}" alt="">` : ''}<span class="lname">Photo originale</span></div>`);
  box.innerHTML = rows.join('');
}
$('layer-rows').addEventListener('click', e => {
  const row = e.target.closest?.('.layer-row'); if (!row) return; const a = asset(photo); if (!a) return;
  const eye = e.target.closest('[data-eye]');
  if (eye) {
    const what = eye.dataset.eye;
    if (what === 'caption') { $('caption-visible').checked = !$('caption-visible').checked; storePhoto(); }
    else if (what === 'adjust') { $('adjustments-visible').checked = !$('adjustments-visible').checked; storePhoto(); }
    else { const s = cleanPhoto(a.photoSettings), i = Number(row.dataset.index); s.layers[i].hidden = !s.layers[i].hidden; a.photoSettings = cleanPhoto(s); syncPhotoLayers(); }
    renderLayerRows(); draw(); return;
  }
  if (row.dataset.row === 'layer') { const i = Number(row.dataset.index); selectedLayer = selectedLayer === i ? null : i; setPhotoTool('select'); renderLayerRows(); status(selectedLayer === null ? 'Calque désélectionné.' : 'Calque choisi : glisse sur l’image pour le déplacer.'); }
});
$('layer-add-quick').onclick = () => {
  if (!asset(photo)) return status('Choisis d’abord une photo.');
  if (!$('layer-source').value) return status('Importe une deuxième image pour la superposer.');
  $('layer-add').click(); const s = cleanPhoto(asset(photo).photoSettings); selectedLayer = s.layers.length - 1; renderLayerRows(); status('Calque ajouté : glisse sur l’image pour le placer.');
};
const fusionSyncLayers = syncPhotoLayers;
syncPhotoLayers = () => { fusionSyncLayers(); renderLayerRows(); };
$('caption').addEventListener('input', () => renderLayerRows());
const fusionPhotoReset = $('photo-reset').onclick;
$('photo-reset').onclick = () => { fusionPhotoReset(); photoChanged(); selectedLayer = null; sizePhoto(); sizePreview(); syncPhotoPanel(); draw(); };
const fusionExportPhoto = $('export-photo').onclick;
$('export-photo').onclick = () => {
  if (photoTool === 'crop') $('crop-done').click();
  forceFullPhoto = true;
  try { fusionExportPhoto(); } finally { forceFullPhoto = false; }
};

/* =====================================================================
   ESPACES, RENDU, SAUVEGARDE
   ===================================================================== */
for (const b of document.querySelectorAll('nav [data-space]')) {
  const old = b.onclick;
  b.onclick = () => {
    if (photoTool !== 'select') { photoTool = 'select'; document.body.classList.remove('tool-crop', 'tool-dropper'); $('crop-bar').hidden = true; }
    old(); region = null; showRegionBar(); setTool('select');
    if (space === 'audio') { stripSig = ''; renderStrips(); drawEq(); }
    if (space === 'photo') { setPhotoTool('select'); syncPhotoPanel(); }
    showLibrary();
  };
}
const fusionAfterRender = afterStudioRender;
afterStudioRender = () => {
  fusionAfterRender();
  tracksEl.style.width = (parseFloat(tracksEl.style.width) || 0) + TRACK_HEAD - 125 + 'px';
  decorateTimeline(); syncInspector();
  if (space === 'audio') renderStrips();
  if (region && region.clipId !== selected) { region = null; }
  showRegionBar();
};
const fusionSerialize = serializeProject;
serializeProject = () => {
  const d = fusionSerialize();
  d.collections = collections.map(({id, name, icon}) => ({id, name, icon}));
  d.assets = d.assets.map(x => { const a = asset(x.id); return a?.collections?.length ? {...x, collections:[...a.collections]} : x; });
  return d;
};
const fusionRestoreProject = restoreProject;
restoreProject = async (data, ask) => {
  const restored = await fusionRestoreProject(data, ask);
  if (!restored) return false;
  collections = Array.isArray(data.collections) ? data.collections.filter(c => c && typeof c.id === 'string' && typeof c.name === 'string').slice(0, 30).map(c => ({id:c.id.slice(0, 64), name:c.name.slice(0, 40), icon:['folder', 'star', 'music'].includes(c.icon) ? c.icon : 'folder'})) : defaultCollections();
  const known = new Set(collections.map(c => c.id));
  for (const saved of data.assets) { const a = asset(saved.id); if (a && Array.isArray(saved.collections)) a.collections = saved.collections.filter(id => known.has(id)); }
  for (const c of clips) { const b = Number(c.boost); if (Number.isFinite(b) && b > 0 && c.kind !== 'image') c.boost = Math.min(12, b); else delete c.boost; if (c.normalized !== true) delete c.normalized; }
  activeCollection = null; region = null; showLibrary(); render(); return true;
};
setPlayIcon(); showLibrary(); render();
