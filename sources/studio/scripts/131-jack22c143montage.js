
/* 7.3 (Mission M4, Claude) : écran « Montage » dans Composition.
   Un 4e onglet « Montage » (à côté d'Arrangement, Batterie, Piano Roll) ouvre LA MÊME timeline que l'Arrangement, en grand :
   - toutes les pistes : batterie, 808, mélodie, et toutes les pistes audio (AUDIO, VOIX 1 à 3 et les pistes ajoutées), même vides ;
   - formes d'onde (celles des clips existants), zoom horizontal (boutons, + / −, Ctrl + molette) et hauteur des pistes (S, M, L) ;
   - règle en mesures avec les temps marqués, tête de lecture rouge, position affichée (mesure · temps · secondes) ;
   - sélection : clic, Ctrl/Maj + clic, ou rectangle tracé dans le vide d'une piste audio ; Ctrl+A, Échap ;
   - gestes M2/M3 déjà présents (glisser, bords, aimant, S, Ctrl+C/V/D, flèches, fondus croisés) + Suppr pour plusieurs clips.
   Rien n'est recréé : mêmes clips, même moteur, même historique (un geste = une étape d'Annuler). Thème inchangé, pas de fenêtre volante. */
(() => {
 'use strict';
 const $ = id => document.getElementById(id), E = () => window.JACK22_AUDIO_EDIT, G = () => window.JACK22_CLIPS141, H = () => window.Jack22Vision8, CUR = () => window.JACK22_C128;
 let on = false, focus = false, lastAbs = null, band = null;
 const HEIGHTS = { S: 40, M: 56, L: 92 }; let size = 'M';
 try { const s = localStorage.getItem('jack22-c143-size'); if (HEIGHTS[s]) size = s; } catch (e) {}
 const say = t => { try { audioMsg(t); } catch (e) { try { setStatus(t); } catch (x) {} } };
 const busy = () => state !== 'stopped' || persistBusy || exporting || rec.state !== 'idle' || window.Jack22Voice?.state?.active || window.Jack22Lot3?.pending;
 const ready = () => { if (busy()) throw Error('Arrête la lecture ou attends la fin de l’opération.'); };
 const sel = () => E()?.selection || [];
 const cursorSec = () => (CUR()?.cursor || 0) * stepSec();
 // ---------- Onglet « Montage » dans Composition ----------
 function tabButton() {
  const subs = document.querySelector('#j93Nav .j93Subs'); if (!subs) return;
  const W = window.JACK22_WORKSPACE; if (!W || W.group !== 'compose') return;
  let b = $('c143Tab'); if (!b || b.parentElement !== subs) { b = document.createElement('button'); b.type = 'button'; b.id = 'c143Tab'; b.textContent = 'Montage'; b.title = 'Écran Montage : toutes les pistes, formes d’onde, zoom, règle et sélection'; b.addEventListener('click', () => open()); subs.append(b); }
  b.setAttribute('aria-pressed', String(on));
  if (on) for (const x of subs.querySelectorAll('button')) if (x !== b) x.setAttribute('aria-pressed', 'false');
 }
 document.addEventListener('j105view', e => { const d = e.detail || {}; if (on && (d.group !== 'compose' || d.view !== 'arrange')) close(true); setTimeout(tabButton, 0); });
 document.addEventListener('click', e => { if (on && e.target.closest?.('#j93Nav button,#j93Nav summary') && !e.target.closest('#c143Tab') && !e.target.closest('.j93Menu')) close(true); }, true);
 function open() {
  const W = window.JACK22_WORKSPACE; if (!W) return say('Écran Montage indisponible.');
  on = true; W.choose('compose', 'arrange');
  document.body.classList.add('c143On'); applySize();
  if (playMode !== 'song') { try { setMode('song'); } catch (e) {} }
  tlBuild(); tabButton(); requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  say('Écran Montage : glisse les clips, tire leurs bords, trace un rectangle dans le vide pour sélectionner. S coupe, Suppr efface, +/− zoome.');
 }
 function close(silent) { if (!on) return; on = false; document.body.classList.remove('c143On'); $('timeline')?.style.removeProperty('--c143h'); tlBuild(); tabButton(); if (!silent) say('Écran Montage fermé.'); }
 function applySize() { $('timeline')?.style.setProperty('--c143h', HEIGHTS[size] + 'px'); for (const k of Object.keys(HEIGHTS)) $('c143Size' + k)?.setAttribute('aria-pressed', String(k === size)); }
 // ---------- Barre d'outils du Montage (dans la timeline, au-dessus des pistes) ----------
 function mkBtn(parent, text, fn, title, id) { const b = document.createElement('button'); b.type = 'button'; b.textContent = text; if (id) b.id = id; if (title) { b.title = title; b.setAttribute('aria-label', title); } b.addEventListener('click', async () => { try { const m = await fn(); if (m) say(m); } catch (e) { say(e.message); } }); parent.append(b); return b; }
 function grp(bar, label) { const g = document.createElement('span'); g.className = 'c143Grp'; if (label) { const b = document.createElement('b'); b.textContent = label; g.append(b); } bar.append(g); return g; }
 function buildBar() {
  if ($('c143Bar')) return; const tl = $('timeline'), wrap = $('tlWrap'); if (!tl || !wrap) return;
  const bar = document.createElement('div'); bar.id = 'c143Bar'; bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', 'Outils du montage');
  const pos = document.createElement('span'); pos.id = 'c143Pos'; pos.title = 'Position de la tête de lecture'; bar.append(pos);
  const z = grp(bar, 'ZOOM');
  mkBtn(z, '−', () => zoomBy(1 / 1.4), 'Dézoomer (touche −)', 'c143ZoomOut'); mkBtn(z, '+', () => zoomBy(1.4), 'Zoomer (touche +)', 'c143ZoomIn'); mkBtn(z, 'Tout voir', () => fitAll(), 'Voir tout le morceau', 'c143Fit');
  const h = grp(bar, 'PISTES'); for (const k of Object.keys(HEIGHTS)) mkBtn(h, k, () => { size = k; try { localStorage.setItem('jack22-c143-size', k); } catch (e) {} applySize(); return null; }, 'Hauteur des pistes : ' + { S: 'petite', M: 'moyenne', L: 'grande' }[k], 'c143Size' + k);
  const c = grp(bar, 'CLIP');
  mkBtn(c, 'Couper', () => splitSel(), 'Couper le clip à la tête de lecture (S)', 'c143Split');
  mkBtn(c, 'Copier', () => { const s = sel(); if (s.length !== 1) throw Error('Sélectionne un seul clip à copier.'); G().copyClip(s[0]); return 'Clip copié. Coller le pose à la tête de lecture.'; }, 'Copier le clip (Ctrl+C)', 'c143Copy');
  mkBtn(c, 'Coller', () => { G().pasteClip(cursorSec()); return 'Clip collé à la tête de lecture, sans nouveau fichier.'; }, 'Coller à la tête de lecture (Ctrl+V)', 'c143Paste');
  mkBtn(c, 'Dupliquer', () => { const s = sel(); if (s.length !== 1) throw Error('Sélectionne un seul clip à dupliquer.'); const cl = audioClips.find(x => x.id === s[0]); G().copyClip(s[0]); G().pasteClip(E().seconds(cl) + E().clipEdit(cl.id).len); return 'Clip dupliqué juste après, sans nouveau fichier.'; }, 'Dupliquer juste après (Ctrl+D)', 'c143Dup');
  mkBtn(c, 'Supprimer', () => removeSel(), 'Retirer les clips sélectionnés (Suppr)', 'c143Del');
  mkBtn(c, 'Fondus croisés', () => { const n = G().autoCrossfades(); return n + ' fondu(s) croisé(s) créé(s) aux chevauchements.'; }, 'Fondus croisés automatiques aux chevauchements', 'c143Xfade');
  const s = grp(bar, 'SÉLECTION');
  mkBtn(s, 'Tout', () => selectAll(), 'Sélectionner tous les clips audio (Ctrl+A)', 'c143All');
  mkBtn(s, 'Aucune', () => { E().select([]); return null; }, 'Ne rien sélectionner (Échap)', 'c143None');
  mkBtn(s, '⏮', () => { CUR()?.setCursor(0); return null; }, 'Tête de lecture au début (Début)', 'c143Home');
  mkBtn(s, '?', () => HELP, 'Raccourcis du montage', 'c143Help');
  tl.insertBefore(bar, wrap); applySize(); readout();
 }
 const HELP = 'Montage : glisser un clip = le déplacer (vers une autre piste aussi) ; glisser un bord = le couper ; rectangle dans le vide = sélection ; Ctrl/Maj + clic = ajouter. Clavier : S couper, Ctrl+C / Ctrl+V / Ctrl+D, Suppr, ←/→ (Maj : 1 mesure, Alt : 10 ms), Ctrl+A, Échap, +/− zoom, Début/Fin, G aimant, Ctrl+Z / Ctrl+Y.';
 // ---------- Position affichée ----------
 function fmt(abs) { const bar = Math.floor(abs / 16), beat = Math.floor((abs % 16) / 4), sec = abs * stepSec(), m = Math.floor(sec / 60), s = sec - m * 60; return 'Mesure <i>' + (bar + 1) + '</i> · temps ' + (beat + 1) + ' · ' + m + ':' + s.toFixed(3).padStart(6, '0').replace('.', ','); }
 function readout() { const p = $('c143Pos'); if (!p) return; const abs = state === 'playing' && lastAbs !== null ? lastAbs : (CUR()?.cursor || 0); p.innerHTML = fmt(abs); }
 const head0 = tlMoveHead; tlMoveHead = function (abs) { lastAbs = abs; const r = head0.apply(this, arguments); if (on) readout(); return r; };
 setInterval(() => { if (on && state !== 'playing') readout(); }, 250);
 // ---------- Zoom ----------
 function zoomTo(w, anchorClientX) {
  if (state !== 'stopped') throw Error('Arrête la lecture avant de changer le zoom.');
  const wrap = $('tlWrap'), lab = document.querySelector('#tlRows .tl-ruler .tl-num'), x0 = lab ? lab.getBoundingClientRect().left - wrap.getBoundingClientRect().left + wrap.scrollLeft : TL_LABEL_W;
  const ax = anchorClientX === undefined ? wrap.clientWidth / 2 : anchorClientX - wrap.getBoundingClientRect().left;
  const bars = (wrap.scrollLeft + ax - x0) / TL_BAR_W;
  TL_BAR_W = Math.max(4, Math.min(320, Math.round(w))); tlBuild();
  wrap.scrollLeft = Math.max(0, x0 + bars * TL_BAR_W - ax);
  const zl = $('j90ZoomValue'); if (zl) zl.textContent = Math.round(TL_BAR_W / 56 * 100) + ' %';
  return null;
 }
 const zoomBy = (f, x) => zoomTo(TL_BAR_W * f, x);
 function fitAll() { const wrap = $('tlWrap'), lab = document.querySelector('#tlRows .tl-label'), lw = lab ? lab.getBoundingClientRect().width : TL_LABEL_W, end = Math.max(4, Math.ceil(songEndStep() / 16) + 1); zoomTo((wrap.clientWidth - lw - 16) / Math.min(song.bars, end)); wrap.scrollLeft = 0; return null; }
 // ---------- Pistes audio vides visibles dans le Montage ----------
 const build0 = tlBuild;
 tlBuild = function () { const r = build0.apply(this, arguments); if (on) { try { lanes(); } catch (e) {} } readout(); return r; };
 function lanes() {
  const ed = E(); if (!ed) return; const rows = $('tlRows'), W = song.bars * TL_BAR_W, cfg = ed.settings;
  let last = [...rows.querySelectorAll('[data-j99-lane]')].pop()?.closest('.tl-row') || null;
  for (const t of cfg.tracks) {
   if (rows.querySelector('[data-j99-lane="' + t.id + '"]')) { last = rows.querySelector('[data-j99-lane="' + t.id + '"]').closest('.tl-row'); continue; }
   const row = mk('div', 'tl-row c143Lane' + (t.mute ? ' muted' : '')), lab = mk('div', 'tl-label j99LaneLabel'), lane = mk('div', 'tl-lane tl-audio');
   lane.dataset.j99Lane = t.id; lane.style.width = W + 'px'; lab.append(mk('b', '', t.name), mk('small', '', '0 clip')); lab.style.borderLeft = '3px solid ' + t.color; lab.title = 'Réglages de la piste audio'; lab.onclick = () => ed.open(null, t.id);
   row.append(lab, lane); if (last) last.after(row); else rows.append(row); last = row;
  }
 }
 // ---------- Sélection au rectangle et clic dans le vide = tête de lecture ----------
 document.addEventListener('pointerdown', e => { focus = !!e.target.closest?.('#timeline'); }, true);
 $('tlRows')?.addEventListener('pointerdown', e => {
  if (!on || e.button !== 0) return; const lane = e.target.closest?.('.tl-lane.tl-audio'); if (!lane || e.target !== lane) return;
  band = { x: e.clientX, y: e.clientY, add: e.ctrlKey || e.shiftKey || e.metaKey, base: e.ctrlKey || e.shiftKey || e.metaKey ? sel() : [], moved: false, lane };
  let el = $('c143Band'); if (!el) { el = document.createElement('div'); el.id = 'c143Band'; document.body.append(el); }
  e.preventDefault();
 });
 window.addEventListener('pointermove', e => {
  if (!band) return; const dx = e.clientX - band.x, dy = e.clientY - band.y; if (!band.moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return; band.moved = true;
  const el = $('c143Band'), l = Math.min(e.clientX, band.x), t = Math.min(e.clientY, band.y); Object.assign(el.style, { display: 'block', left: l + 'px', top: t + 'px', width: Math.abs(dx) + 'px', height: Math.abs(dy) + 'px' });
 });
 window.addEventListener('pointerup', e => {
  const b = band; if (!b) return; band = null; const el = $('c143Band'); if (el) el.style.display = 'none';
  if (!b.moved) { const r = b.lane.getBoundingClientRect(), sec = Math.max(0, (e.clientX - r.left) / TL_BAR_W * 16 * stepSec()), s2 = window.J140Snap ? window.J140Snap(sec, e.altKey) : sec; E().select([]); CUR()?.setCursor(s2 / stepSec()); return; }
  const L = Math.min(e.clientX, b.x), R = Math.max(e.clientX, b.x), T = Math.min(e.clientY, b.y), B = Math.max(e.clientY, b.y), ids = new Set(b.base);
  for (const n of document.querySelectorAll('#tlRows .tl-aud[data-audio]')) { const r = n.getBoundingClientRect(); if (r.right > L && r.left < R && r.bottom > T && r.top < B) ids.add(Number(n.dataset.audio)); }
  E().select([...ids]); say(ids.size ? ids.size + ' clip(s) sélectionné(s). Glisse l’un d’eux pour les déplacer ensemble ; Suppr pour les retirer.' : 'Aucun clip dans le rectangle.');
 });
 window.addEventListener('pointercancel', () => { band = null; const el = $('c143Band'); if (el) el.style.display = 'none'; });
 // Ctrl + molette : zoom autour de la souris.
 $('tlWrap')?.addEventListener('wheel', e => { if (!on || !(e.ctrlKey || e.metaKey)) return; e.preventDefault(); try { zoomBy(e.deltaY < 0 ? 1.25 : 1 / 1.25, e.clientX); } catch (err) { say(err.message); } }, { passive: false });
 // ---------- Gestes ----------
 function selectAll() { const ids = audioClips.filter(c => c.buffer || c.missing).map(c => c.id); E().select(ids); return ids.length + ' clip(s) sélectionné(s).'; }
 async function splitSel() { const s = sel(); if (s.length !== 1) throw Error('Sélectionne un seul clip, puis place la tête de lecture à l’intérieur.'); await E().splitAt(s[0], cursorSec()); return 'Clip coupé en deux à la tête de lecture, sans toucher au fichier.'; }
 function removeSel() {
  const ids = sel(); if (!ids.length) throw Error('Sélectionne d’abord un ou plusieurs clips.'); ready();
  H().remember(); let n = 0;
  for (const id of ids) { const c = audioClips.find(x => x.id === id); if (!c) continue; try { audioKill(c); } catch (e) {} audioClips.splice(audioClips.indexOf(c), 1); n++; }
  tlSelAudio = null; E().clearSelection(); tlBuild(); try { uiExp(); } catch (e) {} H().remember();
  return n + ' clip(s) retiré(s) de la timeline (Ctrl+Z pour annuler). Les fichiers sur ton ordinateur ne sont pas touchés.';
 }
 // ---------- Clavier (seulement dans le Montage, timeline active, hors champ de saisie) ----------
 document.addEventListener('keydown', e => {
  if (!on || !focus || e.target.closest?.('input,textarea,select,[contenteditable="true"],dialog')) return;
  const k = e.key, ctrl = e.ctrlKey || e.metaKey, run = f => { e.preventDefault(); e.stopImmediatePropagation(); Promise.resolve().then(f).then(m => { if (m) say(m); }).catch(err => say(err.message)); };
  if ((k === 'Delete' || k === 'Backspace') && !ctrl && sel().length) return run(removeSel);
  if (ctrl && !e.altKey && k.toLowerCase() === 'a') return run(selectAll);
  if (k === 'Escape' && sel().length) return run(() => { E().select([]); return null; });
  if (!ctrl && (k === '+' || k === '=')) return run(() => zoomBy(1.4));
  if (!ctrl && (k === '-' || k === '_')) return run(() => zoomBy(1 / 1.4));
  if (!ctrl && k === 'Home') return run(() => { CUR()?.setCursor(0); return null; });
  if (!ctrl && k === 'End') return run(() => { CUR()?.setCursor(Math.max(0, songEndStep())); return null; });
 }, true);
 // ---------- Démonstration pour les captures : #montage-demo ----------
 function demoWav(sec, f, beat) { const sr = 22050, len = Math.round(sec * sr), buf = new ArrayBuffer(44 + len * 2), v = new DataView(buf), w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0))); w(0, 'RIFF'); v.setUint32(4, 36 + len * 2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, len * 2, true); for (let i = 0; i < len; i++) { const t = i / sr, env = beat ? Math.exp(-((t * 2) % 1) * 9) : 0.35 + 0.65 * Math.abs(Math.sin(t * 2.1)) * (0.6 + 0.4 * Math.sin(t * 0.7)); v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, 0.5 * env * Math.sin(2 * Math.PI * f * t))) * 32767, true); } return new File([buf], 'demo.wav', { type: 'audio/wav' }); }
 async function demo() {
  try { initAudio(); } catch (e) {}
  const plan = [['Instru', 40, 70, true, 'audio', 0], ['Couplet 1', 14, 220, false, 'v1', 4], ['Refrain', 8, 260, false, 'v1', 20], ['Doublage refrain', 8, 330, false, 'v2', 20], ['Ad-lib', 2, 440, false, 'v3', 9], ['Ad-lib 2', 2, 470, false, 'v3', 26]];
  for (const [name, sec, f, beat, lane, at] of plan) { await audioImportFile(Object.assign(demoWav(sec, f, beat), {})); const c = audioClips[audioClips.length - 1]; c.name = name; E().place(c.id, at, lane); }
  open(); E().select([audioClips[2].id]); CUR()?.setCursor(Math.round(22 / stepSec())); fitAll();
 }
 if (/^#montage-demo$/.test(location.hash)) setTimeout(() => demo().catch(e => say('Démo : ' + e.message)), 1200);
 buildBar(); setTimeout(() => { buildBar(); tabButton(); }, 1500); tabButton();
 window.JACK22_MONTAGE143 = { version: '11.5-claude-7.3-montage', open, close: () => close(false), get on() { return on; }, zoomTo, zoomBy, fitAll, selectAll, removeSel, splitSel, setSize: k => { if (!HEIGHTS[k]) throw Error('Taille : S, M ou L.'); size = k; applySize(); }, get size() { return size; }, help: HELP };
})();
