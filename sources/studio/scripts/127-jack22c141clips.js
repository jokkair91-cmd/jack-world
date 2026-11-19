
/* 7.1 (Mission M2, Claude) : clips audio non destructifs.
   - Gain par clip (−24 à +12 dB) : appliqué à l'écoute, au WAV et aux pistes séparées par la même fonction (enveloppe du clip).
   - Copier / Coller / Dupliquer un clip SANS créer de nouveau fichier : la copie relit le même son décodé que l'original,
     avec sa coupe, ses fondus et son gain (comme la coupe « S » de la Mission 4). Ctrl+C, Ctrl+V (à la tête de lecture), Ctrl+D (juste après).
   - Fondus croisés automatiques : là où deux clips d'une même piste se chevauchent, fondu de sortie du premier et fondu d'entrée
     du second sur toute la zone commune (réglages de montage ordinaires, modifiables et annulables).
   - Les prises voix gardent leur chemin : leur copie passe par « Dupliquer après le clip » (rendu), parce que leurs traitements (J-Tune…) leur sont propres.
   Chaque geste = une étape d'Annuler. Rien n'est écrit dans les fichiers sources. */
(() => {
 'use strict';
 const A = () => window.JACK22_AUDIO_EDIT, H = () => window.Jack22Vision8;
 const MIN_DB = -24, MAX_DB = 12;
 let gains = {};                                                        // { idClip: dB }
 const lin = db => Math.pow(10, db / 20);
 const validGains = g => g && typeof g === 'object' && !Array.isArray(g) && Object.keys(g).length <= 512 && Object.entries(g).every(([k, v]) => /^\d+$/.test(k) && Number.isFinite(v) && v >= MIN_DB && v <= MAX_DB);
 const gainOf = id => gains[id] || 0;
 // ---------- Son : le gain passe par l'enveloppe du clip (écoute ET export) ----------
 const baseEdit = window.J22ClipEdit, baseEnv = window.J22Env;
 window.J22ClipEdit = c => { const e = baseEdit(c); if (e && c && gainOf(c.id)) e.gain141 = lin(gainOf(c.id)); return e; };
 window.J22Env = (p, when, offset, ed) => {
  const g = ed && ed.gain141; if (!g || g === 1) return baseEnv(p, when, offset, ed);
  const q = { setValueAtTime: (v, t) => p.setValueAtTime(v * g, t), linearRampToValueAtTime: (v, t) => p.linearRampToValueAtTime(v * g, t) };
  return baseEnv(q, when, offset, ed);
 };
 // ---------- Sauvegarde : un champ de plus dans le carnet voix (comme les pistes audio), ignoré par les versions précédentes ----------
 const cap = VoiceStore.capture, parse = VoiceStore.parse, setText = VoiceStore.setText;
 VoiceStore.capture = function () { const v = cap.apply(this, arguments); if (Object.keys(gains).length) v.gain141 = { ...gains }; return v; };
 VoiceStore.parse = function (v) { const r = parse.apply(this, arguments); if (!r) return r; if (v && v.gain141 !== undefined) { if (!validGains(v.gain141)) return false; return { ...r, gain141: { ...v.gain141 } }; } return r; };
 VoiceStore.setText = function (v) { const r = setText.apply(this, arguments); gains = v && validGains(v.gain141) ? { ...v.gain141 } : {}; return r; };
 for (const key of ['applyLoaded', 'applyImported']) { const old = VoiceStore[key]; if (typeof old === 'function') VoiceStore[key] = function (v) { if (!v) gains = {}; return old.apply(this, arguments); }; }
 // Empreinte de l'historique : le gain compte comme un changement (sinon Annuler l'ignorerait).
 const baseWrap = ProjectPersistence.wrapper;
 ProjectPersistence.wrapper = function () { const w = baseWrap.apply(this, arguments); if (Object.keys(gains).length) w.gain141 = { ...gains }; return w; };
 // ---------- Un geste = une étape : on écrit le carnet voix d'un coup ----------
 function ready() { if (state !== 'stopped' || persistBusy || exporting || rec.state !== 'idle' || window.Jack22Voice?.state?.active || window.Jack22Lot3?.pending) throw Error('Arrête la lecture ou attends la fin de l’opération.'); }
 function commit(mutate) {
  ready(); H().remember();
  const before = { clips: audioClips.slice(), next: audioNextId, gains: { ...gains } }, v = VoiceStore.capture();
  try { mutate(v); VoiceStore.setText(v); tlBuild(); uiExp(); }
  catch (e) { audioClips.splice(0, audioClips.length, ...before.clips); audioNextId = before.next; gains = before.gains; tlBuild(); throw e; }
  H().remember();
 }
 function setGain(id, db) {
  const c = audioClips.find(x => x.id === id); if (!c) throw Error('Clip introuvable.');
  db = Math.round(Number(db) * 10) / 10; if (!Number.isFinite(db) || db < MIN_DB || db > MAX_DB) throw Error('Gain du clip : de ' + MIN_DB + ' à +' + MAX_DB + ' dB.');
  commit(v => { if (db) gains[id] = db; else delete gains[id]; v.gain141 = { ...gains }; if (!Object.keys(gains).length) delete v.gain141; });
 }
 // ---------- Copier / coller ----------
 let clip = null;
 function copyClip(id) {
  const c = audioClips.find(x => x.id === id); if (!c || !c.buffer) throw Error('Sélectionne un clip audio.');
  if (c.voice) throw Error('Prise voix : utilise « Dupliquer après le clip » dans Pistes audio & montage précis (la copie garde ses traitements).');
  clip = { id, edit: A().editOf(id), lane: A().lane(id), gain: gainOf(id) }; return clip;
 }
 function pasteClip(atSec, lane) {
  if (!clip) throw Error('Rien à coller : copie d’abord un clip (Ctrl+C).');
  const c = audioClips.find(x => x.id === clip.id); if (!c || !c.buffer) throw Error('Le clip copié n’existe plus.');
  if (audioClips.length + 1 > AUDIO_MAX_FILES || audioImportCount() + 1 > AUDIO_MAX_IMPORTS) throw Error('Plus d’emplacement de clip libre (maximum ' + AUDIO_MAX_IMPORTS + ').');
  if (audioClips.reduce((n, x) => n + x.duration, 0) + c.duration > AUDIO_MAX_TOTAL) throw Error('Durée audio totale dépassée (' + AUDIO_MAX_TOTAL / 60 + ' min).');
  const s = Math.max(0, atSec), step = Math.round(s / stepSec() * 1e6) / 1e6, bar = Math.floor(step / 16), fine = Math.round((step - bar * 16) * 1e6) / 1e6, L = lane || clip.lane;
  const len = A().clipEdit(clip.id).len; if (s + len + exportTail(currentSettings().fx) > EXPORT_MAX_SECONDS) throw Error('La copie dépasserait la durée exportable (' + EXPORT_MAX_SECONDS / 60 + ' min).');
  let id = null;
  commit(v => {
   const b = { ...c, id: audioNextId++, fileId: newFileId(), name: (c.name.replace(/ · copie( \d+)?$/, '') + ' · copie').slice(0, 120), startBar: bar, hash: null, stored: false, voice: null };
   audioClips.push(b); id = b.id;
   const e = { lane: L, fine }; for (const k of ['trimIn', 'trimOut', 'fadeIn', 'fadeOut']) if (clip.edit[k] > 1e-9) e[k] = clip.edit[k];
   v.audio99.clips[b.id] = e; if (!v.audio99.tracks.some(t => t.id === L)) e.lane = 'audio';
   if (clip.gain) gains[b.id] = clip.gain; v.gain141 = Object.keys(gains).length ? { ...gains } : undefined; if (!v.gain141) delete v.gain141;
  });
  A().select([id]); return id;
 }
 // ---------- Fondus croisés automatiques ----------
 function autoCrossfades() {
  const ov = A().overlaps ? A().overlaps() : []; if (!ov.length) throw Error('Aucun chevauchement entre deux clips d’une même piste.');
  let n = 0;
  commit(v => {
   for (const o of ov) {
    const a = v.audio99.clips[o.a] || (v.audio99.clips[o.a] = { lane: A().lane(o.a), fine: 0 }), b = v.audio99.clips[o.b] || (v.audio99.clips[o.b] = { lane: A().lane(o.b), fine: 0 });
    const sec = +o.sec.toFixed(6), la = A().clipEdit(o.a).len, lb = A().clipEdit(o.b).len;
    if (sec > la - (a.fadeIn || 0) + 1e-9 || sec > lb - (b.fadeOut || 0) + 1e-9) continue;     // l'un est entièrement dans l'autre : pas de fondu automatique
    a.fadeOut = sec; b.fadeIn = sec; n++;
   }
   if (!n) throw Error('Ces chevauchements recouvrent un clip entier : règle les fondus à la main.');
   v.audio99.overlap = 'mix';
  });
  return n;
 }
 // ---------- Clavier dans la timeline ----------
 let focus = false;
 document.addEventListener('pointerdown', e => { focus = !!e.target.closest?.('#timeline'); }, true);
 document.addEventListener('keydown', e => {
  if (!focus || !(e.ctrlKey || e.metaKey) || e.altKey || e.target.closest?.('input,textarea,select,[contenteditable="true"],dialog')) return;
  const k = e.key.toLowerCase(), sel = A()?.selection || [];
  try {
   if (k === 'c' && sel.length === 1) { e.preventDefault(); e.stopImmediatePropagation(); copyClip(sel[0]); audioMsg('Clip copié. Ctrl+V : coller à la tête de lecture.'); }
   else if (k === 'v' && clip) { e.preventDefault(); e.stopImmediatePropagation(); pasteClip((window.JACK22_C128?.cursor || 0) * stepSec()); audioMsg('Clip collé à la tête de lecture, sans nouveau fichier.'); }
   else if (k === 'd' && sel.length === 1) { e.preventDefault(); e.stopImmediatePropagation(); const c = audioClips.find(x => x.id === sel[0]); copyClip(sel[0]); pasteClip(A().seconds(c) + A().clipEdit(c.id).len); audioMsg('Clip dupliqué juste après, sans nouveau fichier.'); }
  } catch (err) { e.preventDefault(); audioMsg(err.message); }
 }, true);
 // ---------- Fenêtre « Pistes audio & montage précis » : section ajoutée sous « Montage non destructif » ----------
 const baseSection = window.C128Section;
 window.C128Section = (body, c, say, rerender) => {
  if (baseSection) baseSection(body, c, say, rerender);
  const box = document.createElement('div'); box.id = 'c141Box'; const h = document.createElement('h3'); h.textContent = 'Gain, copie et fondus croisés'; box.append(h); body.append(box);
  const row = () => { const r = document.createElement('div'); r.className = 'j99Row'; box.append(r); return r; };
  const btn = (t, f, r) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.onclick = () => { try { const m = f(); rerender(); say(m); } catch (e) { say(e.message); } }; r.append(b); return b; };
  if (c) {
   const r = row(), l = document.createElement('label'); l.append(document.createTextNode('Gain du clip (dB) ')); const i = document.createElement('input'); i.type = 'number'; i.id = 'c141Gain'; i.min = MIN_DB; i.max = MAX_DB; i.step = .5; i.value = String(gainOf(c.id)); l.append(i); r.append(l);
   btn('Appliquer le gain', () => { setGain(c.id, i.value); return 'Gain du clip : ' + gainOf(c.id) + ' dB (écoute et WAV). Le fichier reste intact.'; }, r);
   const r2 = row();
   btn('Copier le clip', () => { copyClip(c.id); return 'Clip copié. « Coller » le pose à la tête de lecture.'; }, r2);
   btn('Coller à la tête de lecture', () => { pasteClip((window.JACK22_C128?.cursor || 0) * stepSec()); return 'Clip collé, sans nouveau fichier.'; }, r2);
   btn('Dupliquer juste après', () => { copyClip(c.id); pasteClip(A().seconds(c) + A().clipEdit(c.id).len); return 'Clip dupliqué juste après, sans nouveau fichier.'; }, r2);
  }
  const r3 = row(); btn('Créer les fondus croisés aux chevauchements', () => { const n = autoCrossfades(); return n + ' fondu(s) croisé(s) créé(s) sur toute la zone commune. Modifiables clip par clip.'; }, r3);
  const p = document.createElement('p'); p.textContent = 'Timeline : Ctrl+C copie le clip sélectionné, Ctrl+V le colle à la tête de lecture, Ctrl+D le duplique juste après. La copie relit le même son que l’original : aucun nouveau fichier, mais elle compte dans les ' + AUDIO_MAX_IMPORTS + ' emplacements de clips.'; box.append(p);
 };
 window.JACK22_CLIPS141 = { version: '11.5-claude-7.1-clips', setGain, gainOf, copyClip, pasteClip, autoCrossfades, get gains() { return { ...gains }; } };
})();
