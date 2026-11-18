'use strict';
// v0.7 — Vumètres de lecture et liaison vidéo/son.
// Même principe que les autres modules : on enveloppe les fonctions existantes sans les réécrire.

/* ================= VUMÈTRES ================= */
// Mesure crête (peak) sur la lecture : Son vidéo et Piste audio après le niveau de chaque clip,
// Master gauche/droite après l’égaliseur, c’est-à-dire ce qui sort réellement des haut-parleurs.
const METER_FLOOR = -60, METER_FALL = 26, HOLD_MS = 1200, CLIP_MS = 2000;
let meterNodes = {}, meterEngine = null;
const meterBuffer = new Float32Array(2048);
const meterState = {video:[{}], audio:[{}], master:[{}, {}]};
for (const list of Object.values(meterState)) for (const s of list) Object.assign(s, {db:-Infinity, hold:-Infinity, holdAt:0, clipAt:-1e9});

function peakToDb(peak) { return peak > 1e-5 ? 20 * Math.log10(peak) : -Infinity; }
function dbToRatio(db) { return Number.isFinite(db) ? Math.max(0, Math.min(1, (db - METER_FLOOR) / -METER_FLOOR)) : 0; }
function dbLabel(db) { return db > METER_FLOOR ? (db >= -0.05 ? '0 dB' : '−' + Math.abs(db).toFixed(db > -10 ? 1 : 0) + ' dB') : '— dB'; }

function ensureMeters() {
  if (typeof previewEngine === 'undefined' || !previewEngine || !previewOutput?.filters) return false;
  if (meterEngine === previewEngine) return true;
  const E = previewEngine; meterEngine = E;
  // Les analyseurs doivent être « tirés » par la sortie : on les relie à un gain nul.
  const sink = E.createGain(); sink.gain.value = 0; sink.connect(E.destination);
  const analyser = () => { const a = E.createAnalyser(); a.fftSize = 2048; a.smoothingTimeConstant = 0; a.connect(sink); return a; };
  const stereo = E.createGain(); stereo.channelCount = 2; stereo.channelCountMode = 'explicit'; stereo.channelInterpretation = 'speakers';
  const split = E.createChannelSplitter(2), left = analyser(), right = analyser();
  stereo.connect(split); split.connect(left, 0); split.connect(right, 1);
  previewOutput.filters[previewOutput.filters.length - 1].connect(stereo);
  meterNodes = {video:[analyser()], audio:[analyser()], master:[left, right]};
  for (const entry of previewClips.values()) meterTap(entry);
  return true;
}
function meterTap(entry) {
  if (!entry?.gain || entry.metered || !meterNodes.video) return;
  entry.gain.connect(entry.el.tagName === 'VIDEO' ? meterNodes.video[0] : meterNodes.audio[0]);
  entry.metered = true;
}
const meterPreviousElement = previewElement;
previewElement = c => {
  const el = meterPreviousElement(c);
  if (c.kind !== 'image' && ensureMeters()) meterTap(previewClips.get(c.id));
  return el;
};

const meterViews = [...document.querySelectorAll('.vu[data-bus]')].map(el => ({el, bus:el.dataset.bus, ch:Number(el.dataset.ch || 0), fill:el.querySelector('i'), hold:el.querySelector('b')}));
const meterLabels = [...document.querySelectorAll('.vu-db[data-bus]')];
let meterLast = 0, meterIdle = false;
function meterFrame(now) {
  requestAnimationFrame(meterFrame);
  const dt = Math.min(.1, meterLast ? (now - meterLast) / 1000 : 0); meterLast = now;
  let quiet = true;
  for (const [bus, list] of Object.entries(meterState)) list.forEach((s, i) => {
    let peak = 0; const node = meterNodes[bus]?.[i];
    if (node && playing) { node.getFloatTimeDomainData(meterBuffer); for (let j = 0; j < meterBuffer.length; j++) { const v = Math.abs(meterBuffer[j]); if (v > peak) peak = v; } }
    const db = peakToDb(peak);
    s.db = Math.max(db, s.db - METER_FALL * dt);
    if (db >= s.hold) { s.hold = db; s.holdAt = now; } else if (now - s.holdAt > HOLD_MS) s.hold -= METER_FALL * dt;
    if (peak >= .999) s.clipAt = now;
    if (s.db > METER_FLOOR || s.hold > METER_FLOOR || now - s.clipAt < CLIP_MS) quiet = false;
  });
  if (quiet && meterIdle) return;
  meterIdle = quiet;
  for (const v of meterViews) {
    const s = meterState[v.bus]?.[v.ch]; if (!s) continue;
    v.fill.style.clipPath = `inset(0 ${(100 - dbToRatio(s.db) * 100).toFixed(1)}% 0 0)`;
    const h = dbToRatio(s.hold); v.hold.style.left = `calc(${(h * 100).toFixed(1)}% - 2px)`; v.hold.style.opacity = h > 0 ? 1 : 0;
    v.el.classList.toggle('clipping', now - s.clipAt < CLIP_MS);
  }
  for (const label of meterLabels) {
    const list = meterState[label.dataset.bus]; if (!list) continue;
    const hold = Math.max(...list.map(s => s.hold)), clipped = list.some(s => now - s.clipAt < CLIP_MS);
    label.textContent = clipped ? 'Saturation !' : dbLabel(hold);
    label.classList.toggle('clipping', clipped);
  }
}
requestAnimationFrame(meterFrame);

/* ================= LIAISON VIDÉO / SON ================= */
// Des clips qui partagent le même identifiant `link` se déplacent, se coupent et se retirent ensemble.
// « Détacher le son » crée un clip audio qui lit la bande-son de la vidéo, lié à elle.
const round2 = n => Math.round(n * 100) / 100;
const linkedTo = c => c?.link ? clips.filter(x => x !== c && x.link === c.link) : [];
const isLinkLocked = c => typeof laneData === 'function' && !!laneData(c).locked;
let editCount = 0;
const linkCheckpoint = checkpoint;
checkpoint = () => { linkCheckpoint(); editCount++; };

function tidyLinks() {
  const count = new Map();
  for (const c of clips) if (c.link) count.set(c.link, (count.get(c.link) || 0) + 1);
  for (const c of clips) if (c.link && count.get(c.link) < 2) delete c.link;
}

// Fait suivre les clips liés après une modification de `c` (avant : position, durée, début dans le fichier).
function followLinked(c, before) {
  const partners = linkedTo(c); if (!partners.length) return true;
  const shift = c.start - before.start, trimShift = c.trim - before.trim;
  const resized = Math.abs(c.duration - before.duration) > .001 || Math.abs(trimShift) > .001;
  if (Math.abs(shift) < .001 && !resized) return true;
  const group = new Set([c, ...partners]), plans = [];
  for (const p of partners) {
    const aligned = Math.abs(p.start - before.start) < .011 && Math.abs(p.duration - before.duration) < .011;
    const n = {...p};
    if (resized) {
      if (!aligned) continue; // un son décalé n’est pas recoupé à l’aveugle
      n.start = c.start; n.duration = c.duration; if (p.kind !== 'image') n.trim = round2(p.trim + trimShift);
    } else n.start = round2(p.start + shift);
    n.fadeIn = Math.min(n.fadeIn || 0, n.duration / 2); n.fadeOut = Math.min(n.fadeOut || 0, n.duration / 2);
    const a = asset(p.asset);
    const fits = !isLinkLocked(p) && n.start >= 0 && n.trim >= 0 && (p.kind === 'image' || n.trim + n.duration <= (a?.duration || 0) + .015)
      && !clips.some(x => !group.has(x) && sameLane(x, n) && n.start < x.start + x.duration - .001 && n.start + n.duration > x.start + .001);
    if (!fits) return false;
    plans.push([p, n]);
  }
  for (const [p, n] of plans) Object.assign(p, n);
  return true;
}
function afterLinkedEdit(c, before, edits) {
  if (!clips.includes(c) || editCount === edits) return;
  if (followLinked(c, before)) { render(); return; }
  // Refus : on revient à l’état d’avant le geste, clip lié compris.
  clips = JSON.parse(history.pop()); selected = c.id; $('undo').disabled = !history.length;
  render(); status('Modification refusée : un clip lié ne peut pas suivre (chevauchement, piste verrouillée ou fin du fichier). Délie-les pour les modifier séparément.');
}

// Glisser / redimensionner dans la timeline.
const linkBind = bindClipDrag;
bindClipDrag = button => {
  linkBind(button);
  const inner = button.onpointerdown;
  button.onpointerdown = e => {
    const c = clips.find(x => x.id === button.dataset.clip);
    if (!c?.link) return inner(e);
    const before = {start:c.start, duration:c.duration, trim:c.trim}, edits = editCount;
    inner(e);
    const done = () => { window.removeEventListener('pointerup', done); window.removeEventListener('pointercancel', done); setTimeout(() => afterLinkedEdit(c, before, edits), 0); };
    window.addEventListener('pointerup', done); window.addEventListener('pointercancel', done);
  };
};
// Champs « Propriétés du clip ».
const linkSubmit = $('props').onsubmit;
$('props').onsubmit = e => {
  const c = clip(); const before = c && {start:c.start, duration:c.duration, trim:c.trim}, edits = editCount;
  linkSubmit(e);
  if (c?.link) afterLinkedEdit(c, before, edits);
};
// Couper au curseur : les clips liés sous le curseur sont coupés au même endroit.
const linkSplit = $('split').onclick;
$('split').onclick = e => {
  const c = clip(), partners = linkedTo(c), before = clips.length;
  linkSplit(e);
  if (!partners.length || clips.length === before) return;
  const rightHalf = clips[clips.length - 1], nextLink = uid(); rightHalf.link = nextLink; let cut = 0;
  for (const p of partners) {
    const offset = time - p.start;
    if (isLinkLocked(p) || offset < .1 || offset > p.duration - .1) continue;
    const q = {...p, id:uid(), start:time, trim:p.kind === 'image' ? 0 : p.trim + offset, duration:p.duration - offset, link:nextLink};
    p.duration = offset;
    for (const x of [p, q]) if (x.fadeIn || x.fadeOut) { x.fadeIn = Math.min(x.fadeIn || 0, x.duration / 2); x.fadeOut = Math.min(x.fadeOut || 0, x.duration / 2); }
    clips.push(q); cut++;
  }
  render(); if (cut) status('Clip coupé au curseur, avec ' + cut + ' clip(s) lié(s).');
};
// Supprimer / Retirer et refermer : les clips liés partent aussi (sauf piste verrouillée).
for (const id of ['remove', 'ripple-remove']) {
  const original = $(id).onclick;
  $(id).onclick = e => {
    const c = clip(), partners = linkedTo(c).filter(p => !isLinkLocked(p));
    original(e);
    if (!c || clips.includes(c) || !partners.length) return;
    for (const p of partners) {
      clips = clips.filter(x => x !== p);
      if (id === 'ripple-remove') for (const x of clips) if (sameLane(p, x) && x.start >= p.start + p.duration - .001) x.start = Math.max(p.start, x.start - p.duration);
    }
    time = Math.min(time, end()); render();
    status(`Clip retiré avec ${partners.length} clip(s) lié(s). Annuler les remet.`);
  };
}

// Lier / délier.
function overlapWith(c, x) { return Math.max(0, Math.min(c.start + c.duration, x.start + x.duration) - Math.max(c.start, x.start)); }
function linkCandidate(c) {
  const wanted = c.kind === 'audio' ? k => k !== 'audio' : k => k === 'audio';
  return clips.filter(x => x !== c && wanted(x.kind) && overlapWith(c, x) > 0).sort((a, b) => overlapWith(c, b) - overlapWith(c, a))[0] || null;
}
function toggleLink() {
  const c = clip(); if (!c) return status('Sélectionne un clip dans la timeline.');
  if (isLinkLocked(c)) return status('Cette piste est verrouillée.');
  if (c.link && linkedTo(c).length) {
    pause(); checkpoint(); const id = c.link; for (const x of clips) if (x.link === id) delete x.link;
    render(); return status('Clips déliés : ils se déplacent maintenant séparément.');
  }
  const p = linkCandidate(c);
  if (!p) return status(c.kind === 'audio' ? 'Place ce son au même moment qu’une vidéo ou une image, puis clique sur Lier.' : 'Place un son au même moment que ce clip (sur une piste audio), puis clique sur Lier.');
  if (isLinkLocked(p)) return status('Le clip à lier est sur une piste verrouillée.');
  pause(); checkpoint(); const id = p.link || uid(); c.link = id; p.link = id; render();
  status(`Lié à « ${asset(p.asset)?.name || 'Média'} » : déplacement, découpe et suppression se font ensemble.`);
}

// Détacher / rattacher le son d’une vidéo.
function soundPair(c) {
  if (!c) return null; const group = [c, ...linkedTo(c)];
  const video = group.find(x => x.kind === 'video'); if (!video) return null;
  const audio = group.find(x => x.kind === 'audio' && asset(x.asset)?.sourceAsset === video.asset);
  return audio ? {video, audio} : null;
}
function freeAudioLane(span) {
  for (let lane = 0; lane < 3; lane++) {
    const probe = {id:'probe', kind:'audio', lane, duration:span.duration};
    if (!isLinkLocked(probe) && canPlaceClip(probe, span.start)) return lane;
  }
  return -1;
}
async function soundPeaks(source) {
  if ((source.size || 0) > 100 * 1024 * 1024) return {note:'Forme d’onde non calculée : fichier supérieur à 100 Mo.'};
  const Engine = window.AudioContext || window.webkitAudioContext; if (!Engine) return {note:'Forme d’onde indisponible.'};
  decoder ??= new Engine();
  const data = await decodeAssetAudio(source, decoder); // échoue si la vidéo n’a pas de son lisible
  const peaks = new Array(800).fill(0);
  for (let ch = 0; ch < data.numberOfChannels; ch++) {
    const samples = data.getChannelData(ch), step = Math.max(1, Math.ceil(samples.length / 800));
    for (let i = 0; i < 800; i++) { const stop = Math.min(samples.length, (i + 1) * step); for (let j = i * step; j < stop; j++) peaks[i] = Math.max(peaks[i], Math.abs(samples[j])); }
  }
  return {peaks};
}
function connectSound(a) {
  const source = asset(a.sourceAsset);
  if (a.el || !source?.el || !source.url) return;
  const el = document.createElement('audio'); el.preload = 'metadata'; el.src = source.url;
  a.el = el; a.url = source.url;
  if (!a.peaks && !a.waveNote) soundPeaks(source).then(r => { a.peaks = r.peaks; a.waveNote = r.note; render(); }).catch(() => { a.waveNote = 'Forme d’onde indisponible pour ce son.'; });
}
let detaching = false;
async function detachSound() {
  const v = clip();
  if (!v || v.kind !== 'video') return status('Sélectionne un clip vidéo pour détacher son son.');
  if (isLinkLocked(v)) return status('Cette piste est verrouillée.');
  if (soundPair(v)) return status('Le son de ce clip est déjà détaché.');
  const source = asset(v.asset); if (!source?.el) return status('Réimporte le fichier original de cette vidéo.');
  if (freeAudioLane(v) < 0) return status('Aucune piste audio libre à cet endroit (trois pistes maximum). Libère la place sous la vidéo.');
  if (detaching) return; detaching = true; pause();
  let sound = assets.find(a => a.sourceAsset === source.id), fresh = false;
  try {
    if (!sound) {
      status('Lecture du son de la vidéo…');
      let result;
      try { result = await soundPeaks(source); } catch { return status('Aucun son lisible dans cette vidéo : rien à détacher.'); }
      sound = {id:uid(), name:'Son · ' + source.name, kind:'audio', duration:source.duration, size:source.size, modified:source.modified, sourceAsset:source.id, peaks:result.peaks, waveNote:result.note};
      fresh = true;
    }
    // L’état a pu changer pendant l’analyse : on revérifie avant d’écrire.
    const lane = freeAudioLane(v);
    if (!clips.includes(v) || lane < 0 || soundPair(v)) return status('Le montage a changé pendant l’analyse : relance Détacher le son.');
    checkpoint();
    if (fresh) assets.push(sound);
    connectSound(sound);
    const link = v.link || uid(); v.link = link;
    const c = {id:uid(), asset:sound.id, kind:'audio', lane, start:v.start, trim:v.trim, duration:v.duration, volume:v.volume,
      fadeIn:v.fadeIn || 0, fadeOut:v.fadeOut || 0, fit:'contain', brightness:100, contrast:100, saturation:100, link};
    if (typeof cleanTransform === 'function') c.transform = cleanTransform();
    v.volume = 0; clips.push(c); laneCounts.audio = Math.max(laneCounts.audio, lane + 1);
    showLibrary(); render();
    status(`Son détaché sur ${typeof laneLabel === 'function' ? laneLabel('audio', lane) : 'la piste audio ' + (lane + 1)} et lié à la vidéo. Le son de la vidéo est coupé pour ne pas l’entendre en double.`);
  } finally { detaching = false; }
}
function reattachSound() {
  const pair = soundPair(clip()); if (!pair) return;
  const {video, audio} = pair;
  if (isLinkLocked(video) || isLinkLocked(audio)) return status('Une des deux pistes est verrouillée.');
  if (Math.abs(video.start - audio.start) > .011 || Math.abs(video.duration - audio.duration) > .011 || Math.abs(video.trim - audio.trim) > .011)
    return status('Le son n’est plus aligné sur l’image : remets-le au même endroit, ou garde-le séparé avec Délier.');
  pause(); checkpoint();
  video.volume = audio.volume; clips = clips.filter(x => x !== audio);
  if (!linkedTo(video).length) delete video.link;
  selected = video.id; render(); status('Son rattaché à la vidéo.');
}

$('link-toggle').onclick = toggleLink;
$('detach-audio').onclick = () => soundPair(clip()) ? reattachSound() : detachSound();

// Affichage dans la timeline et état des boutons.
const linkAfterRender = afterStudioRender;
afterStudioRender = () => {
  linkAfterRender(); tidyLinks();
  const c = clip(), group = c?.link || null;
  for (const b of document.querySelectorAll('[data-clip]')) {
    const x = clips.find(y => y.id === b.dataset.clip); if (!x) continue;
    b.classList.toggle('linked', !!x.link);
    b.classList.toggle('link-partner', !!group && x.link === group && x !== c);
    if (x.link && !b.querySelector('.link-badge')) b.insertAdjacentHTML('afterbegin', '<i class="link-badge" title="Lié">🔗</i>');
    if (x.link) b.title = (asset(x.asset)?.name || 'Média') + ' · lié';
  }
  const pair = soundPair(c);
  const label = (id, icon, text) => { const b = $(id); b.title = text; if (b.dataset.label === text) return; b.dataset.label = text; b.innerHTML = `<svg class="ic" aria-hidden="true"><use href="#i-${icon}"/></svg><span class="sr-only">${text}</span>`; };
  $('link-toggle').disabled = !c;
  label('link-toggle', c?.link ? 'unlink' : 'link', c?.link ? 'Délier les clips' : 'Lier au son (ou à l’image) placé au même moment');
  $('detach-audio').disabled = !c || (c.kind !== 'video' && !pair);
  label('detach-audio', 'volume', pair ? 'Rattacher le son à la vidéo' : 'Détacher le son de la vidéo');
};

// Sauvegarde, récupération et réimport : le son détaché pointe vers le fichier vidéo d’origine.
const linkSerialize = serializeProject;
serializeProject = () => {
  const d = linkSerialize();
  d.assets = d.assets.map(x => { const a = asset(x.id); return a?.sourceAsset ? {...x, sourceAsset:a.sourceAsset} : x; });
  return d;
};
function reconnectSounds() { for (const a of assets) if (a.sourceAsset) connectSound(a); }
const linkRestore = restoreProject;
restoreProject = async (data, ask) => {
  const restored = await linkRestore(data, ask);
  if (!restored) return false;
  for (const saved of data.assets) {
    const a = asset(saved.id); const source = asset(saved.sourceAsset);
    if (a && a.kind === 'audio' && source?.kind === 'video') a.sourceAsset = source.id;
  }
  for (const c of clips) if (typeof c.link !== 'string' || !c.link || c.link.length > 64) delete c.link;
  reconnectSounds(); showLibrary(); render(); return true;
};
const linkFiles = $('files').onchange;
$('files').onchange = async e => { await linkFiles(e); reconnectSounds(); showLibrary(); render(); };

render();
