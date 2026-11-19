
/* =====================================================================
   LOT 2 — VOIX, PAROLES, PROMPTEUR, LATENCE
   - Trois pistes VOIX : une prise par piste, enregistrée en PCM brut MONO (AudioWorklet, aucune perte), puis traitée comme un clip audio ordinaire
     (sauvegarde locale, projet portable, export WAV, volume / Mute individuels). Aucun ScriptProcessor, aucun codage avec perte.
   - La prise démarre EXACTEMENT sur le premier temps du beat (horloge audio), pas à l'instant du clic : le décalage MediaRecorder disparaît.
   - Deux réglages distincts : COMPENSATION DE LATENCE (décalage casque + carte son, mesuré ou saisi, appliqué à chaque nouvelle prise)
     et ROGNAGE MANUEL (retire un début de prise en plus). Les deux valeurs appliquées sont inscrites dans la prise.
   - Durée maximale d'une prise = durée exportable en WAV (EXPORT_MAX_SECONDS) moins la fin des effets : une prise enregistrée est toujours exportable.
   ===================================================================== */
(() => {
'use strict';
const $v = id => document.getElementById(id);
const say = s => { const e = $v('cVoiceFeedback'); if (e) e.textContent = s; if (window.Jack22Feedback) window.Jack22Feedback.publish('voice', s); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const MAXLAT = 500;
const V = { lyrics: '', speed: 24, comp: 0, active: false, phase: 'idle', devices: {}, dev: null, calSession: 0 };
let epoch = 0, S = null, promptTimer = null, lastCal = null;
const DEV_KEY = 'jack22-latency-device-v1';                    // latence de CET ordinateur et de CE casque : ne voyage pas avec un projet
/* M3 : une compensation par micro (identifiant du périphérique ouvert), plus une valeur générale pour un micro jamais mesuré. Même clé de stockage : l'ancienne valeur devient la valeur générale. */
function loadDev() { try { const j = JSON.parse(localStorage.getItem(DEV_KEY)); if (j && Number.isInteger(j.ms) && j.ms >= 0 && j.ms <= MAXLAT) V.comp = j.ms; if (j && j.devices && typeof j.devices === 'object' && !Array.isArray(j.devices)) for (const [k, d] of Object.entries(j.devices).slice(0, 32)) if (d && Number.isInteger(d.ms) && d.ms >= 0 && d.ms <= MAXLAT && typeof d.label === 'string') V.devices[k] = { ms: d.ms, label: d.label.slice(0, 120), out: Number.isFinite(d.out) ? d.out : null, at: typeof d.at === 'string' ? d.at.slice(0, 10) : '' }; } catch (e) { /* stockage indisponible : valeur de la session seulement */ } }
function saveDev() { try { if (V.dev) V.devices[V.dev.id] = { out: null, ...(V.devices[V.dev.id] || {}), ms: V.comp, label: V.dev.label, at: new Date().toISOString().slice(0, 10) }; localStorage.setItem(DEV_KEY, JSON.stringify({ ms: V.comp, devices: V.devices })); } catch (e) {} }
const outMs = () => { try { return Math.round(((audio.baseLatency || 0) + (audio.outputLatency || 0)) * 1000); } catch (e) { return 0; } };

/* ---------- état sauvegardé : bloc « voice » du projet (format 1.8 / portable 2) ---------- */
const VoiceStore = {
  capture() {
    const takes = {};
    audioClips.forEach(c => { if (c.voice) takes[c.fileId] = { slot: c.voice.slot, level: c.voice.level, mute: c.voice.mute, latencyMs: c.voice.latencyMs, trimMs: c.voice.trimMs, processing: c.voice.processing || window.Jack22Lot3DSP.defaults() }; });
    return { version: 1, lyrics: V.lyrics, speed: V.speed, opts: { count: opt('cCount'), metro: opt('cMetro'), metroTake: opt('cMetroTake'), withBeat: opt('cWithBeat'), trimMs: numIn('cTrim', 0) }, takes };
  },
  parse(b) {                                                   // null = absent (ancienne sauvegarde) ; false = invalide ; sinon bloc propre
    if (b === undefined || b === null) return null;
    try {
      if (typeof b !== 'object' || Array.isArray(b) || b.version !== 1 || typeof b.lyrics !== 'string' || b.lyrics.length > 50000 || !Number.isInteger(b.speed) || b.speed < 5 || b.speed > 80 ||
          !b.takes || typeof b.takes !== 'object' || Array.isArray(b.takes)) return false;
      const keys = Object.keys(b.takes), slots = new Set(), takes = {};
      if (keys.length > 3) return false;
      for (const k of keys) {
        const t = b.takes[k];
        if (!/^[A-Za-z0-9_-]{8,64}$/.test(k) || !t || typeof t !== 'object' || !Number.isInteger(t.slot) || t.slot < 1 || t.slot > 3 || slots.has(t.slot) || !Number.isInteger(t.level) || t.level < 0 || t.level > 100 ||
            typeof t.mute !== 'boolean' || !Number.isInteger(t.latencyMs) || t.latencyMs < 0 || t.latencyMs > MAXLAT || !Number.isInteger(t.trimMs) || t.trimMs < 0 || t.trimMs > MAXLAT) return false;
        slots.add(t.slot); takes[k] = { slot: t.slot, level: t.level, mute: t.mute, latencyMs: t.latencyMs, trimMs: t.trimMs, processing: t.processing === undefined ? window.Jack22Lot3DSP.defaults() : window.Jack22Lot3DSP.validate(t.processing) };
      }
      let opts = null;                                         // options d'enregistrement : absentes = réglages actuels conservés ; présentes = validées entièrement
      if (b.opts !== undefined) { const o = b.opts; if (!o || typeof o !== 'object' || Array.isArray(o) || ['count', 'metro', 'metroTake', 'withBeat'].some(k => typeof o[k] !== 'boolean') || !Number.isInteger(o.trimMs) || o.trimMs < 0 || o.trimMs > MAXLAT) return false; opts = { count: o.count, metro: o.metro, metroTake: o.metroTake, withBeat: o.withBeat, trimMs: o.trimMs }; }
      return { version: 1, lyrics: b.lyrics, speed: b.speed, opts, takes };
    } catch (e) { return false; }
  },
  setText(v) {                                                 // paroles, vitesse du prompteur, options d'enregistrement (la latence du matériel n'en fait PAS partie)
    V.lyrics = v.lyrics; V.speed = v.speed;
    if (v.opts) { $v('cCount').checked = v.opts.count; $v('cMetro').checked = v.opts.metro; $v('cMetroTake').checked = v.opts.metroTake; $v('cWithBeat').checked = v.opts.withBeat; $v('cTrim').value = v.opts.trimMs; }
    syncUi();
  },
  assign(clips, takes) { clips.forEach(c => { const t = takes && takes[c.fileId]; c.voice = t ? { ...t } : null; }); },
  applyImported(v) { if (v) VoiceStore.setText(v); tlBuild(); renderVoices(); },        // import portable : les clips portent déjà leur bloc « voice »
  applyLoaded(v) {                                             // chargement local : v = null -> paroles et réglages actuels conservés
    if (v) VoiceStore.setText(v);
    VoiceStore.assign(audioClips, v ? v.takes : null);
    tlBuild(); renderVoices();
  }
};
window.VoiceStore = VoiceStore;
const voiceClip = s => audioClips.find(c => c.voice && c.voice.slot === s);

/* ---------- branchement sur la sauvegarde existante (rien n'est retiré) ---------- */
const P = ProjectPersistence;
const wrapper0 = P.wrapper, applied0 = P.applyLoaded, load0 = P.load, save0 = P.save, dirty0 = P.isDirty;
P.wrapper = function (a) { const w = wrapper0.call(this, a); w.version = '2.0-prototype'; w.voice = VoiceStore.capture(); return w; };
P.applyLoaded = function (c, r) {
  const v = c.s && c.s.voice !== undefined ? VoiceStore.parse(c.s.voice) : null;
  const out = applied0.call(this, c, r); VoiceStore.applyLoaded(v);
  if (v === null) { const st = $v('status').textContent; if (!st.includes('Ancienne sauvegarde')) setStatus(st + OLD_SAVE_NOTE); }   // sauvegarde sans bloc voix : paroles et réglages de voix actuels conservés, et on le dit
  if (P.markClean) P.markClean();                              // l'état chargé = l'état sauvegardé (voix et paroles comprises)
  return out;
};
P.load = function () {
  if (V.active) { say('Arrête la prise avant de charger.'); return; }
  try { const raw = localStorage.getItem(SONG_KEY); if (raw) { const s = JSON.parse(raw); if (s && s.voice !== undefined && VoiceStore.parse(s.voice) === false) { setStatus('Sauvegarde invalide : morceau inchangé'); return; } } } catch (e) { /* le chargeur d'origine affiche son message habituel */ }
  return load0.call(this);
};
P.save = function () { if (V.active) { say('Arrête la prise avant de sauvegarder.'); return; } return save0.call(this); };
P.isDirty = function () { return V.active || dirty0.call(this); };       // une prise en cours empêche aussi de fermer la page sans prévenir
const exp0 = ProjectTransfer.exportProject, imp0 = ProjectTransfer.importFile;
ProjectTransfer.exportProject = function () { if (V.active) { say('Arrête la prise avant d\'exporter le projet.'); return Promise.resolve(); } return exp0.call(this); };
ProjectTransfer.importFile = function (f) { if (V.active) { say('Arrête la prise avant d\'importer un projet.'); return Promise.resolve(); } return imp0.call(this, f); };

/* ---------- limites : une prise doit tenir dans l'export WAV (fin des effets comprise) ---------- */
const tailSec = () => { try { return exportTail(currentSettings().fx); } catch (e) { return EXPORT_TAIL_MAX; } };
const voiceMaxSeconds = () => Math.max(5, Math.floor(EXPORT_MAX_SECONDS - 2 * EXPORT_TAIL_MAX - 0.5));      // réserve = fin des effets AU MAXIMUM : une prise posée à la mesure 1 reste exportable quels que soient les effets réglés ensuite
const barSec = () => 16 * (60 / getBpm() / 4);
function exportEnd() { let end = 0; audioClips.forEach(c => { if (c.buffer) end = Math.max(end, clipStartStep(c)*stepSec()+(window.l3Duration?window.l3Duration(c):c.duration)); }); return end; }
function refreshFit() {                                        // avertit tout de suite si les effets, le tempo ou une position rendent l'export WAV impossible
  const e = $v('cFit'); if (!e) return; const tot = exportEnd() + tailSec(), t = tailSec(), over = audioClips.some(c => c.buffer) && tot > EXPORT_MAX_SECONDS;
  e.className = 'cFine' + (over ? ' cFitBad' : '');
  e.textContent = over ? '⚠ Durée exportable ' + tot.toFixed(0) + ' s : au-dessus de la limite de ' + EXPORT_MAX_SECONDS + ' s (fin des effets de ' + t.toFixed(1) + ' s comprise). L’export WAV sera refusé : raccourcis la réverbération ou le delay, déplace ou supprime un clip.' : 'Durée exportable : ' + tot.toFixed(0) + ' s sur ' + EXPORT_MAX_SECONDS + ' s (fin des effets de ' + t.toFixed(1) + ' s comprise).';
}
setInterval(refreshFit, 700);

/* ---------- cartes voix ---------- */
function renderVoices() {
  for (let i = 1; i <= 3; i++) {
    const c = voiceClip(i), row = $v('cVoice' + i); if (!row) continue;
    row.querySelector('.cVoiceInfo').textContent = c ? (c.missing ? 'Fichier manquant · ' : '') + fmtDur(c.duration) + ' · mesure ' + (c.startBar + 1) + ' · compensation ' + c.voice.latencyMs + ' ms · rognage ' + c.voice.trimMs + ' ms' : 'Aucune prise';
    const cv = row.querySelector('canvas'), x = cv.getContext('2d'); x.clearRect(0, 0, cv.width, cv.height); x.fillStyle = i === 1 ? '#ee485c' : i === 2 ? '#b8a1ff' : '#73d6cb';
    if (c && c.peaks) for (let k = 0; k < cv.width; k++) { const a = c.peaks[Math.floor(k / cv.width * c.peaks.length)] || 0; x.fillRect(k, 30 - a * 27, 1, Math.max(1, a * 54)); }
    row.querySelector('[data-action="level"]').value = c ? c.voice.level : 100;
    row.querySelector('[data-action="mute"]').setAttribute('aria-pressed', String(c ? c.voice.mute : false));
    row.querySelector('[data-action="bar"]').value = c ? c.startBar + 1 : 1;
    row.querySelectorAll('button,input').forEach(b => { b.disabled = V.active || persistBusy || (!c && b.dataset.action !== 'record'); });
  }
  $v('cRecordStop').disabled = !(V.active && V.phase !== 'finish' && V.phase !== 'cal');
  const n = audioClips.length;
  $v('cCapacity').textContent = n + ' / ' + AUDIO_MAX_FILES + ' emplacements audio (' + AUDIO_MAX_IMPORTS + ' imports + 3 voix) · prise maximale ' + fmtDur(voiceMaxSeconds()) + ' (réserve de ' + (2 * EXPORT_TAIL_MAX) + ' s pour les effets voix puis master) · ' + (AUDIO_MAX_TOTAL / 60) + ' min d’audio cumulées';
  refreshFit();
}
function uiLock(on) { syncMicUi();                                          // pendant une prise : on ne touche ni aux fichiers, ni à la sauvegarde ; le beat et l'arrêt restent utilisables
  ['save', 'load', 'clear', 'play', 'audioImport', 'expBtn', 'projExport', 'projImport'].forEach(id => { const e = $v(id); if (e) e.disabled = on; });
  if (!on) { try { setPersistBusy(persistBusy); } catch (e) {} }
  renderVoices();
}
const lockBusy = on => { persistBusy = on; setPersistBusy(on); renderVoices(); };

/* ---------- capture PCM brut (AudioWorklet) ---------- */
const WK = "class J22Cap extends AudioWorkletProcessor{constructor(){super();this.on=true;this.port.onmessage=e=>{this.on=!!e.data;};}process(inputs){const ch=inputs[0]&&inputs[0][0];if(this.on&&ch&&ch.length){this.port.postMessage({f:currentFrame,d:ch.slice(0)});}return true;}}registerProcessor('j22-cap',J22Cap);";
let wkReady = null;
function ensureWorklet() {
  if (wkReady) return wkReady;
  const tryUrl = u => audio.audioWorklet.addModule(u);
  wkReady = tryUrl(URL.createObjectURL(new Blob([WK], { type: 'application/javascript' }))).catch(() => tryUrl('data:application/javascript;base64,' + btoa(WK))).catch(e => { wkReady = null; throw e; });
  return wkReady;
}
/* M3 : le navigateur fixe un petit décalage d'entrée à chaque ouverture du micro (mesuré : jusqu'à 9 ms d'une ouverture à l'autre, stable tant que le micro reste ouvert).
   Le micro reste donc ouvert entre la mesure de latence et les prises (5 minutes sans usage au plus, ou « Fermer le micro ») : même ouverture = même calage. */
let live = null, liveSession = 0;
const MIC_IDLE_MS = 5 * 60 * 1000;
const capKey = () => JSON.stringify(window.JACK22_INPUT?.constraints() || {});
function syncMicUi() { const b = $v('cMicClose'); if (b) { b.hidden = !live; b.disabled = V.active; } }
function shutCapture(c) {
  if (!c) return; clearTimeout(c.idle); c.blocks = null;
  try { c.node.port.onmessage = null; } catch (e) {}
  try { c.src.disconnect(); } catch (e) {} try { c.node.disconnect(); } catch (e) {} try { c.sink.disconnect(); } catch (e) {}
  try { c.stream.getTracks().forEach(t => { t.onended = null; t.stop(); }); } catch (e) {}      // le micro est toujours libéré
  if (live === c) live = null; syncMicUi();
}
function deviceOf(stream) { const t = stream.getAudioTracks()[0]; let s = {}; try { s = (t && t.getSettings && t.getSettings()) || {}; } catch (e) {} const label = (t && t.label) || 'Micro'; return { id: String(s.deviceId || label).slice(0, 200), label: label.slice(0, 120) }; }
function micError(e) {
  const n = e && e.name;
  if (n === 'NotAllowedError' || n === 'SecurityError') return 'accès refusé. Autorise le micro pour ce fichier (icône du micro ou du cadenas dans la barre d’adresse d’Edge), puis recommence';
  if (n === 'NotFoundError' || n === 'OverconstrainedError') return 'aucun micro trouvé, ou le micro choisi est débranché. Branche-le, puis « Actualiser » la liste des micros';
  if (n === 'NotReadableError' || n === 'AbortError') return 'micro occupé par une autre application (Teams, Discord…) ou bloqué par Windows. Ferme-la, puis recommence';
  return e && e.message ? e.message : String(e);
}
async function openCapture(id) {
  initAudio(); await audio.resume();
  if (live && (live.key !== capKey() || live.stream.getAudioTracks().some(t => t.readyState !== 'live'))) shutCapture(live);
  if (live) { clearTimeout(live.idle); live.id = id; live.blocks = []; live.reused = true; try { live.node.port.postMessage(true); } catch (e) {} return live; }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: Object.assign({}, window.JACK22_INPUT?.constraints() || {}, { echoCancellation: false, noiseSuppression: false, autoGainControl: false, channelCount: 1 }), video: false });
  if (id !== epoch) { stream.getTracks().forEach(t => t.stop()); throw Object.assign(new Error('annulé'), { cancelled: true }); }
  try { await ensureWorklet(); } catch (e) { stream.getTracks().forEach(t => t.stop()); throw new Error('AudioWorklet indisponible dans ce navigateur : mets Edge ou Chrome à jour'); }
  const src = audio.createMediaStreamSource(stream), node = new AudioWorkletNode(audio, 'j22-cap', { numberOfInputs: 1, numberOfOutputs: 1, channelCount: 1, channelCountMode: 'explicit', outputChannelCount: [1] }), sink = audio.createGain();
  sink.gain.value = 0; src.connect(node); node.connect(sink); sink.connect(audio.destination);
  const cap = { id, stream, src, node, sink, blocks: [], session: ++liveSession, key: capKey(), dev: deviceOf(stream), reused: false };
  node.port.onmessage = e => { if (cap.blocks) cap.blocks.push(e.data); };
  stream.getAudioTracks().forEach(t => { t.onended = () => shutCapture(cap); });
  if (live) shutCapture(live);
  live = cap; syncMicUi(); return cap;
}
function closeCapture(cap) {                                   // fin d'usage : le micro reste ouvert un moment pour la prise suivante
  if (!cap) return; cap.blocks = null;
  if (cap !== live || cap.stream.getAudioTracks().some(t => t.readyState !== 'live')) { shutCapture(cap); return; }
  try { cap.node.port.postMessage(false); } catch (e) {}
  cap.stream.getAudioTracks().forEach(t => { t.onended = () => shutCapture(cap); });
  clearTimeout(cap.idle); cap.idle = setTimeout(() => shutCapture(cap), MIC_IDLE_MS); syncMicUi();
}
addEventListener('pagehide', () => shutCapture(live));
{ const b = document.createElement('button'); b.type = 'button'; b.id = 'cMicClose'; b.textContent = 'Fermer le micro'; b.hidden = true; b.title = 'Le micro reste ouvert 5 minutes après une prise ou une mesure, pour garder le même calage'; b.onclick = () => { if (V.active) return; shutCapture(live); say('Micro fermé. Il sera rouvert à la prochaine prise ou mesure ; refais la mesure de latence pour un calage exact.'); }; const cal = $v('cCalibrate'); if (cal) cal.after(b); }
/* M3 : le micro ouvert est-il celui de la compensation affichée ? Sinon, on charge sa mesure mémorisée (ou on le dit). */
function useDevice(cap) {
  const d = cap.dev; if (V.dev && V.dev.id === d.id) return '';
  V.dev = d; V.calSession = 0; const rec = V.devices[d.id];
  if (rec) { V.comp = rec.ms; $v('cLatComp').value = rec.ms; return 'Compensation de « ' + d.label + ' » : ' + rec.ms + ' ms (mesure mémorisée).'; }
  return 'Aucune mesure mémorisée pour « ' + d.label + ' » : compensation générale de ' + V.comp + ' ms. Mesure la latence avec ce micro pour un calage exact.';
}
function outNote(dev) { const rec = dev && V.devices[dev.id], now = outMs(); return rec && rec.out != null && rec.out > 0 && now > 0 && Math.abs(now - rec.out) > 15 ? 'La sortie audio annonce ' + now + ' ms de latence au lieu de ' + rec.out + ' ms lors de la mesure : casque ou haut-parleurs changés ? Refais la mesure de latence.' : ''; }
/* M3 : latence du chemin de lecture d'une voix (console, compresseur ou limiteur master…), mesurée hors ligne avec la chaîne de l'export.
   Une prise chantée sur ce qu'on entend est avancée d'autant : elle retombe sur le beat à l'écoute et dans le WAV. */
async function voicePathSec(slot, prev) {
  try {
    const data = exportData(), sr = EXPORT_SR, n = Math.round(sr * 0.3), ctx = new OfflineAudioContext(2, n, sr);
    const E = withSeed(EXPORT_SEED, () => createEngine(ctx, data.settings)), bus = E.createBus();
    const b = ctx.createBuffer(1, n, sr), at = Math.round(sr * 0.02); b.getChannelData(0)[at] = 0.05;
    const src = ctx.createBufferSource(), g = ctx.createGain(); src.buffer = b; src.connect(g);
    const clip = { id: prev ? prev.id : -1, name: 'VOIX ' + slot, voice: true, vgain: 1 };
    g.connect(window.J97AudioNode ? window.J97AudioNode(ctx, clip, bus) : bus); src.start(0);
    const y = await ctx.startRendering(), L = y.getChannelData(0), R = y.getChannelData(1); let pk = 0;
    for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]));
    if (pk) for (let i = 0; i < n; i++) if (Math.abs(L[i]) >= pk * 0.25 || Math.abs(R[i]) >= pk * 0.25) return Math.max(0, Math.min(0.1, (i - at) / sr));
  } catch (e) { /* mesure impossible : pas de correction de chaîne */ }
  return 0;
}
function calNote(s, session) {
  const parts = [];
  if (s.pathSec > 0.0005) parts.push('chaîne de lecture ' + (s.pathSec * 1000).toFixed(1) + ' ms compensée');
  parts.push(V.calSession && V.calSession === session ? 'calage exact (mesure faite avec ce micro ouvert)' : 'mesure de latence faite lors d’une autre ouverture du micro : écart possible de quelques ms, refais « Mesurer la latence » pour un calage exact');
  if (s.devNote) parts.push(s.devNote); if (s.outNote) parts.push(s.outNote);
  return parts.join(' · ');
}
function flatten(cap) {                                        // blocs {f, d} -> { base, data } sur l'horloge audio
  const b = cap.blocks; if (!b.length) return { base: 0, data: new Float32Array(0) };
  const base = b[0].f, last = b[b.length - 1], total = last.f + last.d.length - base, out = new Float32Array(total);
  for (const x of b) out.set(x.d, x.f - base);
  return { base, data: out };
}
function wavMono(f32, sr) {
  const n = f32.length, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf), w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) { const s = Math.max(-1, Math.min(1, f32[i])); v.setInt16(44 + i * 2, s < 0 ? s * 32768 : s * 32767, true); }
  return buf;
}
function clickAt(t, amp, freq, dur) {
  const o = audio.createOscillator(), g = audio.createGain(); o.frequency.value = freq || 1000; g.gain.setValueAtTime(amp, t); g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.06));
  o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + (dur || 0.06) + 0.02);
}
const opt = id => $v(id) && $v(id).checked;
const numIn = (id, d) => { const n = Number($v(id).value); return Number.isInteger(n) && n >= 0 && n <= MAXLAT ? n : d; };

/* ---------- une prise ---------- */
function finishSession() { closeCapture(S && S.cap); if (S) { clearTimeout(S.tCount); clearTimeout(S.tLaunch); clearTimeout(S.tMax); clearInterval(S.tClick); } document.removeEventListener('keydown', onKey, true); window.J98Capture?.finish();S = null; V.active = false; V.phase = 'idle'; uiLock(false); }
function onKey(e) { if (e.key === 'Escape' && V.active && V.phase !== 'finish' && V.phase !== 'cal') { e.preventDefault(); e.stopImmediatePropagation(); stopTake(); } }
async function beginTake(slot) {
  if (V.active || persistBusy) return;
  const prev = voiceClip(slot);
  let advanced=null;try{advanced=window.J98Capture?.takePlan(slot,prev)||null;}catch(e){say(e.message);return;}
  if (!prev && audioClips.length >= AUDIO_MAX_FILES) { say('Les ' + AUDIO_MAX_FILES + ' emplacements audio sont occupés. Supprime un clip avant d’enregistrer.'); return; }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof AudioWorkletNode === 'undefined') { say('Micro indisponible dans ce navigateur. Ouvre le fichier dans Edge ou Chrome et autorise le micro.'); return; }
  if (prev && !advanced && !confirm('Remplacer la prise VOIX ' + slot + ' ? Elle est conservée si la nouvelle prise échoue.')) return;
  const id = ++epoch; V.active = true; V.phase = 'request'; S = { id, slot, prev, cap: null, j98:advanced }; document.addEventListener('keydown', onKey, true); uiLock(true); say('Autorise le microphone…');
  try {
    const cap = await openCapture(id); if (id !== epoch || !S) { closeCapture(cap); return; } S.cap = cap;
    S.devNote = useDevice(cap); S.outNote = outNote(cap.dev); S.pathSec = await voicePathSec(slot, prev); if (id !== epoch || !S) return;
    cap.stream.getAudioTracks().forEach(t => { t.onended = () => { if (!S || S.id !== id) return; if (V.phase === 'rec') stopTake('Micro déconnecté : la prise est conservée jusqu’à ce point.'); else if (V.phase === 'count') { say('Micro déconnecté : enregistrement annulé.'); finishSession(); } }; });
    const beat = 60 / getBpm(), withBeat = opt('cWithBeat'), count = opt('cCount'), tc0 = audio.currentTime + 0.15;
    V.phase = 'count';
    const launch = () => {
      if (!S || S.id !== id) return;
      if (withBeat) { stop(); start(S.j98?(S.j98.start-1)*16:0); S.t0 = state === 'playing' && stepLog.length ? stepLog[0].time : audio.currentTime + 0.05; } else S.t0 = audio.currentTime + 0.05;       // M3 : heure du premier pas programmé (nextTime est déjà plus loin)       // le premier temps du beat (horloge audio) = le début de la prise
      S.maxSec = S.j98?S.j98.recordSec:voiceMaxSeconds(); V.phase = 'rec';window.J98Capture?.launch(S);renderVoices();
      say('● Enregistrement VOIX ' + slot + ' · casque conseillé · arrêt automatique à ' + fmtDur(S.maxSec));
      if (opt('cMetroTake')) { let k = 0; const sched = () => { while (S && S.t0 + k * beat < audio.currentTime + 0.6) { const t = S.t0 + k * beat; if (t >= audio.currentTime) clickAt(t + S.pathSec, 0.12, k % 4 === 0 ? 1500 : 1000, 0.04); k++; } }; sched(); S.tClick = setInterval(sched, 120); }
      S.tMax = setTimeout(() => stopTake('Durée maximale atteinte (' + fmtDur(S.maxSec) + ', limite de l’export WAV) : prise arrêtée.'), Math.max(100, (S.t0 + S.maxSec - audio.currentTime) * 1000));
    };
    if (count) {
      let remaining = 4; for (let k = 0; k < 4; k++) if (opt('cMetro')) clickAt(tc0 + k * beat + S.pathSec, 0.1, k === 0 ? 1500 : 1000, 0.05);
      const tick = () => { if (!S || S.id !== id) return; say('Départ dans ' + remaining + '…'); remaining--; if (remaining > 0) S.tCount = setTimeout(tick, beat * 1000); };
      tick(); S.tLaunch = setTimeout(launch, Math.max(0, (tc0 + 4 * beat - audio.currentTime) * 1000 - 70));
    } else launch();
  } catch (e) {
    if (e && e.cancelled) { finishSession(); return; }
    say('Micro : ' + micError(e) + '. Aucune prise remplacée.'); finishSession();
  }
}
function stopTake(reason) {                                    // arrêt manuel, automatique, ou micro déconnecté
  if (!V.active || !S) return;
  if (V.phase === 'request') { ++epoch; say('Enregistrement annulé.'); finishSession(); return; }
  if (V.phase === 'count') { ++epoch; stop(); say('Enregistrement annulé.'); finishSession(); return; }
  if (V.phase !== 'rec') return;
  V.phase = 'finish'; renderVoices(); lockBusy(true); try { stop(); } catch (e) {}
  finalizeTake(S, reason).finally(() => { lockBusy(false); finishSession(); });
}
async function finalizeTake(s, reason) {
  try {
    clearTimeout(s.tMax); clearInterval(s.tClick); await sleep(90);                       // laisse arriver les derniers blocs du micro
    const sr = audio.sampleRate, session = s.cap.session, { base, data } = flatten(s.cap); closeCapture(s.cap); s.cap = null;
    const comp = numIn('cLatComp', V.comp), trim = numIn('cTrim', 0), start = Math.round(s.t0 * sr) - base + Math.round((comp + trim) / 1000 * sr) + Math.round((s.pathSec || 0) * sr), maxF = Math.round((s.maxSec || voiceMaxSeconds()) * sr);
    s.note = calNote(s, session);
    if (start < 0) throw new Error('le micro a démarré trop tard');
    const end = Math.min(data.length, start + maxF), len = end - start;
    if (len / sr < 0.1) throw new Error('prise vide ou trop courte');
    const mono = data.subarray(start, end), wav = wavMono(mono, sr), file = new File([wav], 'VOIX ' + s.slot + ' · prise.wav', { type: 'audio/wav' });
    if (file.size > AUDIO_MAX_BYTES) throw new Error('prise trop grosse');
    if (audioClips.reduce((a, c) => a + (c === s.prev&&!s.j98 ? 0 : c.duration), 0) + len / sr > AUDIO_MAX_TOTAL) throw new Error('limite totale d’audio dépassée (' + (AUDIO_MAX_TOTAL / 60) + ' min)');
    const buffer = await timeoutP(audio.decodeAudioData(wav.slice(0)), AUDIO_DECODE_TIMEOUT, 'décodage de la prise trop long');
    if(s.j98&&window.J98Capture){await window.J98Capture.commit({session:s,buffer,file,comp,trim});say('Prises conservées. Ouvre Projet → Prises & assemblage… pour les sélectionner. · '+s.note);return;}
    const c = { id: s.prev ? s.prev.id : audioNextId++, name: 'VOIX ' + s.slot + ' · prise', duration: buffer.duration, buffer, startBar: 0, peaks: audioPeaks(buffer, 800), blob: file, type: 'wav', size: file.size, fileId: newFileId(), hash: null, stored: false, missing: false, why: null, voice: { slot: s.slot, level: s.prev?.voice?.level ?? 100, mute: s.prev?.voice?.mute ?? false, latencyMs: comp, trimMs: trim, processing: s.prev?.voice?.processing ? window.Jack22Lot3DSP.validate(s.prev.voice.processing) : window.Jack22Lot3DSP.defaults() } };
    if (s.prev) { audioKill(s.prev); audioClips.splice(audioClips.indexOf(s.prev), 1, c); } else audioClips.push(c);
    tlSelAudio = c.id; tlSel = null; tlBuild(); renderVoices();
    say((reason ? reason + ' ' : '') + 'VOIX ' + s.slot + ' enregistrée · ' + fmtDur(c.duration) + ' · compensation ' + comp + ' ms, rognage ' + trim + ' ms · ' + s.note + ' · sauvegarde ou exporte le projet pour la conserver.');
  } catch (e) { say('Prise refusée : ' + (e && e.message ? e.message : e) + '. Ancienne prise conservée.'); }
}

/* ---------- mesure de la latence : le studio joue des clics, le micro les réentend ---------- */
function detectLatency(x, sr, baseFrame, tks) {
  const win = Math.max(1, Math.round(0.005 * sr)), env = new Float32Array(x.length); let acc = 0;
  for (let i = 0; i < x.length; i++) { acc += Math.abs(x[i]); if (i >= win) acc -= Math.abs(x[i - win]); env[i] = acc / win; }
  const sorted = Float32Array.from(env).sort(), noise = sorted[Math.floor(sorted.length * 0.5)] || 0, lat = [];
  for (const tk of tks) {
    const e = Math.round(tk * sr) - baseFrame, a = Math.max(0, e - Math.round(0.02 * sr)), b = Math.min(x.length, e + Math.round(0.5 * sr));
    if (b - a < win * 4) continue;
    let pk = 0, pi = a; for (let i = a; i < b; i++) if (env[i] > pk) { pk = env[i]; pi = i; }
    if (pk < 0.004 || pk < noise * 8 + 0.002) continue;
    let o = a; const thr = pk * 0.35; for (let i = a; i <= pi; i++) if (env[i] >= thr) { o = i; break; }
    lat.push((o - e) / sr * 1000 - 1.5);
  }
  if (lat.length < 4) return { ok: false, n: lat.length };
  lat.sort((p, q) => p - q); const med = lat[Math.floor(lat.length / 2)], spread = lat[lat.length - 1] - lat[0];
  return { ok: spread <= 20, ms: Math.max(0, Math.round(med)), n: lat.length, spread: Math.round(spread) };
}
async function calibrate() {
  if (V.active || persistBusy) return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof AudioWorkletNode === 'undefined') { say('Micro indisponible dans ce navigateur.'); return; }
  const id = ++epoch; V.active = true; V.phase = 'cal'; S = { id, cap: null }; uiLock(true); say('Mesure de la latence : autorise le micro et place la sortie audio utilisée pour enregistrer près du micro, à volume modéré. Garde les mêmes périphériques (8 clics, environ 8 secondes)…');
  try {
    const cap = await openCapture(id); if (id !== epoch || !S) { closeCapture(cap); return; } S.cap = cap; const devNote = useDevice(cap);
    const t0 = audio.currentTime + 0.5, tks = []; for (let k = 0; k < 8; k++) { tks.push(t0 + k); clickAt(t0 + k, 0.7, 1500, 0.04); }
    await sleep(8800); const sr = audio.sampleRate, { base, data } = flatten(cap); closeCapture(cap); S.cap = null;
    const r = detectLatency(data, sr, base, tks); r.session = cap.session; r.dev = cap.dev; r.out = outMs(); lastCal = r;
    if (r.ok) { const d = r.ms - V.comp; $v('cLatResult').textContent = 'Latence mesurée : ' + r.ms + ' ms (' + r.n + ' clics, écart ' + r.spread + ' ms) · ' + (d === 0 ? 'identique à la compensation actuelle' : 'compensation actuelle ' + V.comp + ' ms, différence ' + (d > 0 ? '+' : '') + d + ' ms'); $v('cLatApply').hidden = false; $v('cLatApply').dataset.ms = r.ms; say('Latence mesurée avec « ' + r.dev.label + ' » : ' + r.ms + ' ms sur ' + r.n + ' clics (écart ' + r.spread + ' ms : ' + (r.spread <= 5 ? 'mesure fiable' : 'mesure dispersée, refais-la au calme') + '). Clique « Appliquer » pour l’utiliser comme compensation de ce micro.' + (devNote ? ' ' + devNote : '')); }
    else { $v('cLatResult').textContent = 'Mesure incertaine'; $v('cLatApply').hidden = true; say('Mesure incertaine (' + r.n + ' clics reconnus sur 8) : rapproche le micro des haut-parleurs, monte un peu le volume, évite le bruit ambiant, et recommence.'); }
  } catch (e) { if (!(e && e.cancelled)) say('Mesure impossible : ' + micError(e) + '.'); }
  finally { finishSession(); }
}

/* ---------- paroles, prompteur, estimation des syllabes ---------- */
function syllables(line) {                                     // ESTIMATION : [min, max] ; le « e » muet avant une consonne est compté dans le maximum
  const words = String(line).toLowerCase().replace(/[’]/g, "'").split(/[^a-zàâäéèêëîïôöùûüÿœæç']+/).filter(Boolean);
  let lo = 0, hi = 0;
  words.forEach((w, i) => {
    const parts = w.split("'").filter(Boolean), next = words[i + 1] || '';
    parts.forEach((p, k) => {
      if (k < parts.length - 1) return;                         // l', d', m', j', qu'… : collés au mot suivant, aucune syllabe propre
      const g = Math.max(1, (p.match(/[aeiouyàâäéèêëîïôöùûüÿœæ]+/g) || []).length);
      if (g > 1 && /(es|e|ent)$/.test(p)) { lo += g - 1; hi += g - 1 + (next && /^[^aeiouyàâäéèêëîïôöùûüÿœæh']/.test(next) ? 1 : 0); } else { lo += g; hi += g; }
    });
  });
  return [lo, hi];
}
function renderPrompt() {
  const box = $v('cPrompt'); box.replaceChildren();
  const lines = V.lyrics.split('\n');
  if (!V.lyrics.trim()) { box.textContent = 'Écris tes paroles, puis lance le prompteur.'; return; }
  lines.forEach(l => {
    const d = document.createElement('div'); d.className = 'cPLine';
    if (!l.trim()) { d.className += ' cPGap'; d.textContent = ' '; box.append(d); return; }
    const t = document.createElement('span'); t.textContent = l; d.append(t);
    if (!/^\s*\[.*\]\s*$/.test(l)) { const [lo, hi] = syllables(l), b = document.createElement('small'); b.className = 'cSyl'; b.textContent = ' ≈ ' + (lo === hi ? lo : lo + '–' + hi) + ' syll.'; b.title = 'Estimation : élisions et « e » muets approximatifs'; d.append(b); }
    box.append(d);
  });
}
function syncUi() { $v('cLyrics').value = V.lyrics; $v('cSpeed').value = V.speed; $v('cLatComp').value = V.comp; renderPrompt(); }
$v('cLyrics').oninput = () => { V.lyrics = $v('cLyrics').value; renderPrompt(); };
$v('cSpeed').oninput = () => { V.speed = Number($v('cSpeed').value); };
$v('cLatComp').oninput = () => { const n = Number($v('cLatComp').value); if (Number.isInteger(n) && n >= 0 && n <= MAXLAT) { V.comp = n; V.calSession = 0; saveDev(); } };
$v('cLatApply').onclick = () => { const ms = Number($v('cLatApply').dataset.ms); if (Number.isInteger(ms) && ms >= 0 && ms <= MAXLAT) { V.comp = ms; if (lastCal && lastCal.dev) { V.dev = lastCal.dev; V.calSession = lastCal.session; } saveDev(); if (V.dev && lastCal && lastCal.dev && lastCal.out > 0) { V.devices[V.dev.id].out = lastCal.out; saveDev(); } $v('cLatComp').value = ms; say('Compensation de latence réglée sur ' + ms + ' ms pour « ' + (V.dev ? V.dev.label : 'ce micro') + ' » : mémorisée sur cet ordinateur pour ce micro et appliquée à chaque nouvelle prise (pas enregistrée dans le projet).'); } };
$v('cCalibrate').onclick = calibrate;
$v('cPromptToggle').onclick = () => {
  const btn = $v('cPromptToggle'), p = $v('cPrompt');
  if (promptTimer) { cancelAnimationFrame(promptTimer); promptTimer = null; btn.textContent = 'Lancer le prompteur'; return; }
  let last = performance.now(); p.scrollTop = 0; btn.textContent = 'Arrêter le prompteur';
  const tick = t => { p.scrollTop += (t - last) / 1000 * V.speed; last = t; if (p.scrollTop + p.clientHeight >= p.scrollHeight) { promptTimer = null; btn.textContent = 'Lancer le prompteur'; return; } promptTimer = requestAnimationFrame(tick); };
  promptTimer = requestAnimationFrame(tick);
};
$v('cRecordStop').onclick = () => stopTake();

for (let i = 1; i <= 3; i++) {
  const row = $v('cVoice' + i);
  row.addEventListener('click', e => {
    const a = e.target.dataset.action, c = voiceClip(i);
    if (a === 'record') { beginTake(i); return; }
    if (!c || V.active || persistBusy) return;
    if (a === 'mute') { c.voice.mute = !c.voice.mute; audioApplyGain(); tlBuild(); renderVoices(); }
    if (a === 'remove' && confirm('Supprimer VOIX ' + i + ' ?')) { audioKill(c); audioClips.splice(audioClips.indexOf(c), 1); tlBuild(); renderVoices(); }
    if (a === 'download') { const url = URL.createObjectURL(c.blob), l = document.createElement('a'); l.href = url; l.download = 'JACK22-VOIX-' + i + '.wav'; document.body.append(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000); }
  });
  row.addEventListener('input', e => {
    const c = voiceClip(i); if (!c || V.active || persistBusy) return;
    if (e.target.dataset.action === 'level') { c.voice.level = Number(e.target.value); audioApplyGain(); }
    if (e.target.dataset.action === 'bar') {
      const n = Number(e.target.value);
      if (!(Number.isInteger(n) && n >= 1)) return;
      if (n > song.bars) { say('Cette mesure dépasse la longueur du morceau (' + song.bars + ' mesures) : allonge le morceau dans la timeline (MORCEAU), puis recommence.'); e.target.value = c.startBar + 1; return; }
      if ((n - 1) * barSec() + (window.l3Duration ? window.l3Duration(c) : c.duration) + tailSec() > EXPORT_MAX_SECONDS) { say('Cette position fait dépasser la durée exportable (' + EXPORT_MAX_SECONDS + ' s avec la fin des effets) : prise non déplacée.'); e.target.value = c.startBar + 1; return; }
      c.startBar = n - 1; audioKill(c); tlBuild(); renderVoices();
    }
  });
}
new MutationObserver(() => renderVoices()).observe($v('tlRows'), { childList: true });
$v('bpm').addEventListener('input', () => renderVoices());

/* ---------- lecture des archives du candidat C1 (format « jack22-c1 », version 1) : converties vers le format officiel ---------- */
window.C1Compat = {
  convert(mf) {
    const isO = o => o && typeof o === 'object' && !Array.isArray(o);
    if (mf.formatVersion !== 1 || !isO(mf.project) || !Array.isArray(mf.files)) portableFail('archive C1 non reconnue (version de format inattendue)');
    const p = mf.project; if (p.version !== '1.7' || !isO(p.audio) || !Array.isArray(p.audio.clips)) portableFail('archive C1 non reconnue (contenu inattendu)');
    const files = new Map(); mf.files.forEach(f => { if (isO(f) && typeof f.fileId === 'string' && typeof f.path === 'string') files.set(f.fileId, f.path); });
    const c1 = isO(p.c1) ? p.c1 : { lyrics: '', speed: 24, voices: {} }, vs = isO(c1.voices) ? c1.voices : {}, takes = {};
    const clips = p.audio.clips.map(c => {
      if (!isO(c)) portableFail('archive C1 : clip audio invalide');
      const m = /^VOIX ([1-3]) · /.exec(String(c.name)); if (m) { const v = isO(vs[c.fileId]) ? vs[c.fileId] : { level: 100, mute: false, trim: 0 }; takes[c.fileId] = { slot: Number(m[1]), level: v.level, mute: v.mute, latencyMs: 0, trimMs: v.trim }; }
      return { ...c, file: files.get(c.fileId) };
    });
    return { format: PROJECT_FORMAT, formatVersion: PROJECT_FORMAT_VERSION, c1source: true, project: { bpm: p.bpm, song: p.song, take: p.take, fx: p.fx, studio: p.studio, audio: { ...p.audio, clips }, voice: { version: 1, lyrics: typeof c1.lyrics === 'string' ? c1.lyrics : '', speed: Number.isInteger(c1.speed) ? c1.speed : 24, takes } } };
  }
};

window.Jack22Voice = { detectLatency, syllables, beginTake, stopTake, calibrate, voiceMaxSeconds, tailSec, exportEnd, wavMono, get state() { return { active: V.active, phase: V.phase, comp: V.comp, lyrics: V.lyrics, speed: V.speed }; }, get lastCal() { return lastCal; } };
loadDev(); window.JACK22_BUILD = 'LOT3-PROTOTYPE'; syncUi(); renderVoices();
})();

