(() => {
 'use strict';
 const $ = id => document.getElementById(id);
 const A = () => window.JACK22_AUDIO_EDIT;

 /* ---------- 1. Chaque voix sait de quelle piste et de quelle source elle vient ----------
    Piano Roll (« roll ») : notes programmées d'une piste ; prise synthé (« take ») ; clavier (« live »). Un Mute de piste ne coupe
    que les voix « roll » de cette piste : les autres pistes continuent, le transport ne bouge pas, les notes suivantes repartent
    à leur place à la réactivation (le programmateur, lui, n'est jamais arrêté). */
 let src = null;
 const tagV = (v, opts, s) => { if (v && typeof v === 'object') { v.j22src = s; v.j22key = opts && opts.trackKey; } };
 const wrapEngine = E => {
  if (!E || E.__c150) return E; E.__c150 = true;
  const sn = E.scheduleNote, sv = E.startVoice, rv = E.releaseVoice, kv = E.killVoice;
  if (typeof sv === 'function') E.startVoice = function (source, presetKey, oct, idx, t, opts) {
   const v = sv.apply(this, arguments);
   try { if (v && typeof v === 'object') { tagV(v, opts, src || 'live'); if (typeof source === 'string' && source.startsWith('midi97-')) midiLight(v, oct, idx, true); } } catch (e) {}
   return v;
  };
  if (typeof sn === 'function') E.scheduleNote = function (presetKey, oct, idx, t0, t1, opts) { const v = sn.apply(this, arguments); try { tagV(v, opts, src || 'other'); } catch (e) {} return v; };
  if (typeof rv === 'function') E.releaseVoice = function (v) { try { if (v && v.j22midi != null) midiLight(v, 0, 0, false); } catch (e) {} return rv.apply(this, arguments); };
  if (typeof kv === 'function') E.killVoice = function (v) { try { if (v && v.j22midi != null) midiLight(v, 0, 0, false); } catch (e) {} return kv.apply(this, arguments); };
  return E;
 };
 const ce0 = createEngine; createEngine = function () { return wrapEngine(ce0.apply(this, arguments)); };
 try { if (typeof engine !== 'undefined' && engine) wrapEngine(engine); } catch (e) {}
 const rs0 = rollSchedule; rollSchedule = function () { const p = src; src = 'roll'; try { return rs0.apply(this, arguments); } finally { src = p; } };
 const rc0 = recSchedule; recSchedule = function () { const p = src; src = 'take'; try { return rc0.apply(this, arguments); } finally { src = p; } };
 const killWhere = pred => {
  let n = 0;
  try { if (typeof engine === 'undefined' || !engine) return 0; for (let i = melodyVoices.length - 1; i >= 0; i--) { const v = melodyVoices[i]; if (v && pred(v)) { try { engine.killVoice(v); } catch (e) {} melodyVoices.splice(i, 1); n++; } } } catch (e) {}
  return n;
 };
 window.J22KillTrack = key => killWhere(v => v.j22src === 'roll' && v.j22key === key);

 /* ---------- 2. Prise synthé : son propre Mute (lecture et WAV), enregistré avec le projet ---------- */
 let takeMute = false, takeSig = null, sigRef = null, sigVal = null;
 const curTake = () => { try { return take; } catch (e) { return null; } };
 const sigOf = t => { if (!t) return null; if (t === sigRef) return sigVal; sigRef = t; sigVal = (t.steps || 0) + '|' + (t.notes || []).map(n => [n.start, n.dur, n.octave, n.idx].join(',')).join(';'); return sigVal; };
 // Le Mute suit LA prise coupée : une nouvelle prise enregistrée repart non coupée.
 window.J22TakeMuted = () => { const t = curTake(); return !!t && takeMute && sigOf(t) === takeSig; };
 const setTakeMute = on => { const t = curTake(); if (!t) return false; takeMute = !!on; takeSig = sigOf(t); if (on) killWhere(v => v.j22src === 'take'); sync(); return true; };
 const cap0 = VoiceStore.capture, par0 = VoiceStore.parse, set0 = VoiceStore.setText;
 VoiceStore.capture = function () { const v = cap0.apply(this, arguments); try { if (v && window.J22TakeMuted()) v.mute150 = { version: 1, take: true, sig: takeSig }; } catch (e) {} return v; };
 VoiceStore.parse = function (b) {
  const r = par0.apply(this, arguments); if (!r) return r;
  if (b && b.mute150 !== undefined) { const m = b.mute150; if (!m || m.version !== 1 || typeof m.take !== 'boolean' || (m.sig != null && (typeof m.sig !== 'string' || m.sig.length > 500000))) return false; return { ...r, mute150: { version: 1, take: m.take, sig: m.sig == null ? null : m.sig } }; }
  return r;
 };
 VoiceStore.setText = function (v) { const r = set0.apply(this, arguments); const m = v && v.mute150; takeMute = !!(m && m.take); takeSig = (m && m.sig) || null; try { sync(); } catch (e) {} return r; };

 /* ---------- 3. Pistes audio : chaque ligne coupe SES clips ----------
    AUDIO → les WAV de la ligne AUDIO (plus les voix) ; « Piste audio n » → ses clips ; VOIX n → sa prise voix (inchangé).
    L'ancienne coupure globale « AUDIO » d'un projet déjà enregistré reste respectée jusqu'au premier clic. */
 let laneCache = null, laneT = 0;
 const laneTracks = () => { const now = performance.now(); if (!laneCache || now - laneT > 150) { try { laneCache = (A() && A().settings && A().settings.tracks) || []; } catch (e) { laneCache = []; } laneT = now; } return laneCache; };
 const legacyOn = () => { try { return !!audioMute; } catch (e) { return false; } };
 window.J22LaneMuted = c => {
  try { const id = A() && A().lane(c.id); if (!id) return false; const ts = laneTracks(), t = ts.find(x => x.id === id); if (!t) return false; const solo = ts.some(x => x.solo); return !!(t.mute || (solo && !t.solo)); } catch (e) { return false; }
 };
 const toggleLane = id => {
  const t = laneTracks().find(x => x.id === id); if (!t) return false;
  if (id === 'audio' && legacyOn()) { audioMute = false; try { syncAudioUi(); } catch (e) {} try { tlBuild(); } catch (e) {} }
  else A().setTrack(id, { mute: !t.mute });
  laneCache = null; try { audioApplyGain(); } catch (e) {} sync(); return true;
 };
 const host = document.createElement('div'); host.id = 'c150Sources'; host.hidden = true; document.body.append(host);
 const srcFor = key => {
  let b = host.querySelector('[data-c150-src="' + key + '"]');
  if (!b) { b = document.createElement('button'); b.type = 'button'; b.dataset.c150Src = key; b.setAttribute('aria-pressed', 'false'); b.addEventListener('click', () => { if (key === 'take') setTakeMute(!window.J22TakeMuted()); else toggleLane(key.slice(5)); }); host.append(b); }
  return b;
 };
 window.J22RowSource = row => {
  if (!row || !row.classList) return null;
  if (row.classList.contains('c150TakeRow')) return srcFor('take');
  const lane = row.querySelector('.tl-lane'), id = lane && lane.dataset && lane.dataset.j99Lane;
  if (id === 'audio' || (id && /^aud_/.test(id))) return srcFor('lane:' + id);
  return null;
 };
 // Le petit « M » de la barre AUDIO (ancien bouton global) fait désormais la même chose que le M de la ligne AUDIO.
 $('audioMute')?.addEventListener('click', e => { e.stopImmediatePropagation(); e.preventDefault(); toggleLane('audio'); }, true);

 /* ---------- 4. Un seul état par piste instrument : arrangement, panneau Patterns et mixeur de la Production ----------
    Exception : le canal « Mélodie » du mixeur porte aussi la prise synthé ; son M d'arrangement ne coupe donc que le Piano Roll
    (la case « Muet » du mixeur, elle, coupe tout le canal, prise comprise). */
 const linked = key => key !== 'melody';
 window.J22ChannelMuted = key => { if (!linked(key)) return false; try { const c = window.JACK22_PRODUCTION && window.JACK22_PRODUCTION.config.mix[key]; return !!(c && c.mute); } catch (e) { return false; } };
 window.J22SyncChannel = (key, on) => { if (!linked(key)) return; try { window.JACK22_PRODUCTION.setChannelMute && window.JACK22_PRODUCTION.setChannelMute(key, on); } catch (e) {} };
 window.J22ShowTrackMute = tr => !!(tr && tr.mute && linked(tr.key));
 window.J22SetTrackMute = (key, on) => {
  if (!linked(key)) return;
  try { const ti = song.tracks.findIndex(t => t.key === key); if (ti < 0) return; const tr = song.tracks[ti]; if (!!tr.mute === !!on) { sync(); return; } tr.mute = !!on; if (on && ti > 0) window.J22KillTrack(key); buildPatternUI(); uiExp(); sync(); } catch (e) {}
 };

 /* ---------- 5. Boutons M : état toujours à jour et périmètre écrit en clair ---------- */
 const rowInfo = row => {
  const lane = row.querySelector('.tl-lane'), title = row.querySelector('.tl-label b')?.textContent || '', voice = title.match(/^VOIX\s+(\d)/);
  return { lane, title, voice: voice ? Number(voice[1]) : 0, ti: lane && lane.dataset.ti !== undefined ? Number(lane.dataset.ti) : null, j99: lane && lane.dataset.j99Lane };
 };
 const rowSourceOf = row => {
  const hook = window.J22RowSource(row); if (hook) return hook;
  const r = rowInfo(row);
  if (r.voice) return $('cVoice' + r.voice)?.querySelector('[data-action="mute"]') || null;
  if (r.ti !== null) return document.querySelector('.mute[data-track-key="' + ((song.tracks[r.ti] || {}).key) + '"]');
  return null;
 };
 const scopeText = row => {
  if (row.classList.contains('c150TakeRow')) return 'Prise synthé (jouée au clavier puis enregistrée) : lecture et WAV';
  const r = rowInfo(row);
  if (r.voice) return 'Voix ' + r.voice + ' : sa prise voix';
  if (r.ti === 0) return 'Batterie : lecture et WAV';
  if (r.ti === 1) return '808 / Basse : notes du Piano Roll de cette piste (la prise synthé a son propre M)';
  if (r.ti === 2) return 'Mélodie : notes du Piano Roll (la prise synthé a son propre M ; « Muet » du mixeur coupe tout le canal Mélodie)';
  if (r.ti !== null) return 'Instrument « ' + ((song.tracks[r.ti] || {}).label || '') + ' » : notes du Piano Roll';
  if (r.j99 === 'audio') return 'Ligne AUDIO : WAV importés posés sur cette ligne (les voix ont leur propre M)';
  if (r.j99) return 'Piste audio « ' + r.title + ' » : ses clips';
  return '';
 };
 function sync() {
  try {
   srcFor('take').setAttribute('aria-pressed', String(window.J22TakeMuted()));
   for (const t of laneTracks()) if (t.id === 'audio' || /^aud_/.test(t.id)) srcFor('lane:' + t.id).setAttribute('aria-pressed', String(!!t.mute || (t.id === 'audio' && legacyOn())));
   // Les libellés d'accessibilité d'origine (« Mute BATTERIE », « Couper la piste AUDIO »…) ne changent pas ; le périmètre est dans l'info-bulle.
   const am = $('audioMute'); if (am) { const on = srcFor('lane:audio').getAttribute('aria-pressed') === 'true'; am.setAttribute('aria-pressed', String(on)); am.setAttribute('aria-label', (on ? 'Réactiver' : 'Couper') + ' la piste AUDIO'); am.title = 'M · WAV importés de la ligne AUDIO (les voix ont leur propre M)'; }
   for (const row of document.querySelectorAll('#tlRows>.tl-row')) {
    const proxy = row.querySelector('.tl-label .dockRowMute'); if (!proxy) continue;
    const s = rowSourceOf(row);
    if (s) { proxy.disabled = !!s.disabled; proxy.setAttribute('aria-pressed', s.getAttribute('aria-pressed') || 'false'); }
    const scope = scopeText(row); if (scope) proxy.title = 'M · ' + scope;
   }
  } catch (e) {}
 }
 window.J22MuteSync = sync;
 // Ligne « PRISE SYNTHÉ » : seulement quand une prise existe, juste sous les pistes instruments.
 function takeRow() {
  const rows = $('tlRows'); if (!rows) return;
  let row = rows.querySelector(':scope>.c150TakeRow'); const t = curTake(), show = !!(t && t.notes && t.notes.length);
  if (!show) { if (row) row.remove(); return; }
  if (!row) {
   row = document.createElement('div'); row.className = 'tl-row c150TakeRow';
   const lab = document.createElement('div'); lab.className = 'tl-label'; const b = document.createElement('b'); b.textContent = 'PRISE SYNTHÉ';
   const m = document.createElement('button'); m.type = 'button'; m.className = 'dockRowMute c150TakeMute'; m.textContent = 'M'; m.setAttribute('aria-label', 'Mute PRISE SYNTHÉ');
   m.addEventListener('click', e => { e.stopPropagation(); setTakeMute(!window.J22TakeMuted()); });
   const lane = document.createElement('div'); lane.className = 'tl-lane c150TakeLane';
   lab.append(b, m); row.append(lab, lane);
  }
  const inst = [...rows.querySelectorAll(':scope>.tl-row')].filter(r => r !== row && r.querySelector('.tl-lane') && r.querySelector('.tl-lane').dataset.ti !== undefined).pop();
  if (inst) { if (inst.nextElementSibling !== row) inst.after(row); } else if (!row.parentElement) rows.prepend(row);
  const w = rows.querySelector('.tl-lane:not(.c150TakeLane)')?.style.width; if (w) row.querySelector('.tl-lane').style.width = w;
 }
 const b0 = tlBuild; tlBuild = function () { const r = b0.apply(this, arguments); try { takeRow(); sync(); } catch (e) {} return r; };
 document.addEventListener('click', () => setTimeout(sync, 0), true);
 // Les boutons M des lignes sont recréés par d'autres modules juste après chaque dessin : on repasse derrière eux.
 { const tlr = $('tlRows'); if (tlr) new MutationObserver(() => setTimeout(sync, 0)).observe(tlr, { childList: true }); }
 setInterval(() => { if (!document.hidden) { try { takeRow(); sync(); } catch (e) {} } }, 700);

 /* ---------- 6. Touches du clavier allumées aussi par un clavier MIDI (couleur au hasard, bloc c149) ---------- */
 function midiLight(v, oct, idx, on) {
  const P = window.JACK22_PIANO; if (!P || !P.light) return;
  if (on) { v.j22midi = (oct + 1) * 12 + idx; v.j22lit = true; P.light(v.j22midi, true); }
  else if (v.j22lit) { v.j22lit = false; P.light(v.j22midi, false); }
 }

 /* ---------- 7. Grand Piano Roll : libellé du bouton du bas mis à jour tout de suite ---------- */
 const bigLabel = () => { const b = $('c119Big'); if (!b) return; const on = document.body.classList.contains('c118Big'); const want = on ? '⤡ Afficher le clavier' : '⤢ Grand Piano Roll'; if (b.textContent !== want) b.textContent = want; b.setAttribute('aria-pressed', String(on)); };
 new MutationObserver(bigLabel).observe(document.body, { attributes: true, attributeFilter: ['class'] });

 /* ---------- 8. Réglages du synthé : les harmoniques du 808 (curseur, valeur du projet, défaut 50 %) ---------- */
 (function synthSettings() {
  const tb = document.querySelector('#synth .dockSynthToolbar'), harm = $('harmAmt'); if (!tb || !harm) return;
  const det = document.createElement('details'); det.className = 'c150Synth'; det.id = 'c150SynthOpts';
  det.innerHTML = '<summary>Synthé ▾</summary><div class="c150SynthBody"><label class="c150Row" for="c150Harm"><span>Harmoniques 808</span><input id="c150Harm" type="range" min="0" max="100" step="1" aria-label="Harmoniques du 808"><output id="c150HarmVal" for="c150Harm"></output></label><button type="button" id="c150HarmDef">Valeur par défaut (50 %)</button><p class="c150Hint">Pour le son 808 : les harmoniques aident à entendre la basse sur de petits haut-parleurs (ordinateur, téléphone). Le grave lui-même ne change pas. 0 % = 808 pur. La valeur est enregistrée avec le projet.</p></div>';
  tb.append(det);
  const sl = $('c150Harm'), out = $('c150HarmVal');
  const show = () => { if (document.activeElement !== sl) sl.value = harm.value; out.value = harm.value + ' %'; };
  const send = v => { harm.value = String(v); harm.dispatchEvent(new Event('input', { bubbles: true })); harm.dispatchEvent(new Event('change', { bubbles: true })); show(); };
  sl.addEventListener('input', () => send(sl.value));
  $('c150HarmDef').addEventListener('click', () => send(50));
  harm.addEventListener('input', show); harm.addEventListener('change', show);
  const body = det.querySelector('.c150SynthBody'), sum = det.querySelector('summary');
  const place = () => { if (!det.open) return; const r = sum.getBoundingClientRect(), w = 290, left = Math.max(8, Math.min(r.left, innerWidth - w - 8)); body.style.left = left + 'px'; const h = body.offsetHeight || 150; if (r.top - h - 6 >= 8) { body.style.top = (r.top - h - 6) + 'px'; } else { body.style.top = Math.min(innerHeight - h - 8, r.bottom + 6) + 'px'; } };
  det.addEventListener('toggle', () => { show(); place(); requestAnimationFrame(place); });
  addEventListener('resize', place); addEventListener('scroll', place, true);
  document.addEventListener('pointerdown', e => { if (det.open && !det.contains(e.target)) det.open = false; }, true);
  show();
  setInterval(() => { if (!document.hidden && det.open) { show(); place(); } }, 500);
 })();

 /* ---------- 9. Export MIDI : jamais deux notes de même hauteur qui se chevauchent ----------
    Règle : une nouvelle note sur une touche déjà tenue termine la précédente au même instant (aucune coupure de la nouvelle
    note par le « Note Off » de l'ancienne) ; deux notes qui commencent ensemble → on garde la plus longue.
    Sans chevauchement, le fichier est identique octet pour octet à celui de la 7.8. */
 function noOverlap(input) {
  const off = n => { try { return (window.J22Off ? window.J22Off(n) : 0) || 0; } catch (e) { return 0; } };
  const list = [...input].map((n, i) => ({ n: { ...n }, i, s: n.start + off(n) })), byP = new Map(), drop = new Set();
  for (const x of list) { const p = (x.n.octave + 1) * 12 + x.n.idx; if (!byP.has(p)) byP.set(p, []); byP.get(p).push(x); }
  for (const arr of byP.values()) {
   arr.sort((a, b) => a.s - b.s || b.n.dur - a.n.dur || a.i - b.i);
   let cur = null;
   for (const x of arr) {
    if (cur && x.s < cur.s + cur.n.dur - 1e-9) { if (x.s <= cur.s + 1e-9) { drop.add(x.i); continue; } cur.n.dur = x.s - cur.s; }
    cur = x;
   }
  }
  return list.filter(x => !drop.has(x.i)).map(x => x.n);
 }
 const MX = window.J97Music;
 if (MX && typeof MX.midi === 'function' && !MX.__c150) { MX.__c150 = true; const m0 = MX.midi; MX.midi = function (input, bpm) { return m0.call(this, noOverlap(input || []), bpm); }; }

 setTimeout(() => { try { takeRow(); sync(); } catch (e) {} }, 800);
 window.JACK22_MUTE150 = { version: '11.5-claude-7.9-mute-midi', setTakeMute, toggleLane, sync, scopeText, noOverlap, killWhere, get takeMuted() { return window.J22TakeMuted(); } };
})();