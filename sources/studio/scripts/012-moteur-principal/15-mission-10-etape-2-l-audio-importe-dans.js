/* =====================================================================
   MISSION 10 — ÉTAPE 2 : l'audio importé dans l'export WAV
   - Chaque fichier est rejoué dans le rendu hors-ligne à sa mesure (début = mesure × 16 pas × durée d'un pas), à sa vitesse et sa hauteur d'origine :
     le navigateur rééchantillonne si la fréquence du fichier n'est pas 44,1 kHz, sans changer la durée ni la note.
   - Même chemin que l'écoute : fichier -> volume AUDIO -> bus -> effets -> volume master -> limiteur doux. Les fichiers qui se chevauchent s'additionnent.
   - Piste AUDIO en Mute (ou volume 0) : aucun fichier dans le WAV. Sans fichier importé : l'export est identique à celui de la Mission 9c.
   - Durée : PATTERN = `loops` répétitions des patterns, le WAV est prolongé jusqu'à la fin du dernier fichier ; SONG = jusqu'à la fin du dernier bloc ou du dernier fichier ; + la fin habituelle.
   ===================================================================== */
function audioExportData() {
  const ok = audioClips.filter(c => c.buffer);                           // les clips « manquants » n'ont pas de son : ils sont ignorés
  if (!ok.length || audioMute || audioLevel <= 0) return null;
  return { level: audioLevel, clips: ok.map(c => ({ name: c.name, buffer: c.buffer, startBar: clipStartStep(c)/16, duration: c.duration, id:c.id, voice:!!c.voice, vgain: clipGainV(c) })) };
}
const audioEndSec = data => data.audio ? data.audio.clips.reduce((m, c) => Math.max(m, c.startBar * 16 * data.stepLen + c.duration), 0) : 0;
function scheduleAudioClips(ctx, bus, data) {
  const gain = volumeToGain(data.audio.level);
  data.audio.clips.forEach(c => {
    try {
      const src = ctx.createBufferSource(), g = ctx.createGain();
      const orig = audioClips.find(x => x.id === c.id), ed = orig && window.J22ClipEdit ? window.J22ClipEdit(orig) : null, env = ctx.createGain(), when = c.startBar * 16 * data.stepLen;
      src.buffer = c.buffer; g.gain.value = gain * (c.vgain === undefined ? 1 : c.vgain); src.connect(env); env.connect(g); g.connect(window.J97AudioNode?window.J97AudioNode(ctx,c,bus):bus);
      if (ed) { window.J22Env(env.gain, when, 0, ed); src.start(when, ed.trimIn, ed.len); } else src.start(when);
    } catch (e) { throw new Error('clip audio « ' + c.name + ' » : ' + (e && e.message ? e.message : e)); }   // l'export s'arrête avec un message clair, le studio n'est pas touché
  });
}
let EXPORT_TIMEOUT_MS = 120000;             // si le rendu ne répond plus au bout de 2 minutes, il est annulé et le studio est libéré
function withTimeout(promise, ms) {
  let t; const timeout = new Promise((_, rej) => { t = setTimeout(() => rej(new Error('le rendu a dépassé ' + Math.round(ms / 1000) + ' s : annulé, le studio reste utilisable')), ms); });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
}

/* Rend le morceau. data = exportData(), opts = { loops, includeMelody }. Renvoie { wav (ArrayBuffer), plan, peak }. */
async function renderSong(data, opts) {
  if(window.l3Ready && !window.l3Ready())throw new Error("Traitements voix non prêts : attends le rendu.");
  const plan = exportPlan(data, opts);
  const ctx = new OfflineAudioContext(2, plan.frames, EXPORT_SR);
  const E = withSeed(EXPORT_SEED, () => createEngine(ctx, data.settings));
  if(window.L8PrepareOffline)window.L8PrepareOffline(E,data);
  const bus = E.createBus();
  const dupSets = plan.withRoll ? data.rolls.map(r => [rollKeySet(r), r]) : [];
  const pause = () => new Promise(r => setTimeout(r, 0));          // on laisse respirer la page entre deux morceaux
  await pause();
  for (let bar = 0; bar < plan.bars; bar++) {
    if (data.song) { scheduleSongBar(E, bus, data, plan, bar); await pause(); continue; }
    scheduleDrumsBar(E, bus, data.pattern, bar, data.stepLen);
    const base = bar * 16;
    if (plan.withMel && bar % data.take.bars === 0) {                        // prise enregistrée (sans les notes déjà jouées à l'identique par le Piano Roll)
      const skip = plan.withRoll ? ((n, abs) => dupSets.some(([k, r]) => takeNoteIsDup(k, r, n, abs))) : null;
      scheduleTake(E, data.take, base * data.stepLen, data.stepLen, 1, skip, base);
    }
    if (plan.withRoll) data.rolls.forEach(r => { if (bar % r.bars === 0) scheduleTake(E, r, base * data.stepLen, data.stepLen, 1, null, base); });   // Piano Roll
    await pause();                                                 // une pause après chaque mesure
  }
  if (data.audio) scheduleAudioClips(ctx, bus, data);                 // Mission 10, étape 2 : les fichiers audio importés, à leur mesure
  const buf = await ctx.startRendering();
  const L = buf.getChannelData(0), Rr = buf.numberOfChannels > 1 ? buf.getChannelData(1) : buf.getChannelData(0);
  applyFadeOut([L, Rr], EXPORT_SR, EXPORT_FADE);
  const enc = await encodeWavAsync(L, Rr, EXPORT_SR, pause);
  return { wav: enc.wav, plan, peak: enc.peak };
}

/* ---------- page : bouton, informations, téléchargement ---------- */
let exporting = false;
const fmtDur = s => { const t = Math.round(s); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };
const expOpts = () => ({ loops: Number($('expLoops').value) || 4, includeMelody: !!take && $('expMel').checked, includeRoll: playMode === 'song' || (rollsHaveNotes() && $('expRoll').checked) });
function setExp(text) { $('expStatus').textContent = text; window.Jack22Feedback?.publish('wav', text); }
function uiExp() {
  $('expMel').disabled = !take || exporting; $('expRoll').disabled = !rollsHaveNotes() || exporting || playMode === 'song'; $('expLoops').disabled = exporting || playMode === 'song'; $('expBtn').disabled = exporting || persistBusy;
  const data = exportData(), plan = exportPlan(data, expOpts()), mo = ((44 + plan.frames * 4) / 1048576).toFixed(1);
  let txt = data.song ? songExpText(plan, mo) : 'WAV 16 bits · stéréo · 44,1 kHz · ' + plan.bars + ' mesure' + (plan.bars > 1 ? 's' : '') + (plan.withMel && plan.withRoll ? ' avec la mélodie et le Piano Roll' : plan.withRoll ? ' avec le Piano Roll' : plan.withMel ? ' avec la mélodie' : ' de batterie') + ' + fin de ' + plan.tail.toFixed(1).replace('.', ',') + ' s · durée ≈ ' + fmtDur(plan.seconds) + ' · ≈ ' + mo + ' Mo';
  if (plan.withAudio && !data.song) txt += ' + audio importé (' + data.audio.clips.length + ' fichier' + (data.audio.clips.length > 1 ? 's' : '') + ')' + (plan.audioExtends ? ', WAV prolongé jusqu\'à la fin de l\'audio' : '');
  if (plan.seconds > EXPORT_MAX_SECONDS) txt += ' — TROP LONG (maximum ' + (EXPORT_MAX_SECONDS / 60) + ' minutes) : ' + ((data.song ? 'raccourcis l\'arrangement' : 'baisse les répétitions') + (data.audio ? ' ou raccourcis / retire un fichier audio.' : '.'));
  else if ((plan.withMel && maxOverlap(data.take) > MAX_VOICES) || (plan.withRoll && (data.song ? data.song.blocks.some(b => b.roll && maxOverlap(b.roll) > MAX_VOICES) : data.rolls.some(r => maxOverlap(r) > MAX_VOICES)))) txt += ' — attention : plus de ' + MAX_VOICES + ' notes en même temps ; l\'export les garde toutes, la lecture en direct peut en couper.';
  $('expInfo').textContent = txt;
}
function wavName(bpm) {
  const d = new Date(), p2 = n => String(n).padStart(2, '0');
  return 'jack22-studio-' + Math.round(bpm) + 'bpm-' + d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate()) + '-' + p2(d.getHours()) + p2(d.getMinutes()) + p2(d.getSeconds()) + '.wav';
}
function downloadWav(wav, name) {
  const url = URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.style.display = 'none';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);                 // libère la mémoire
}
async function exportWav() {
  if (exporting) return;
  let data, opts, plan;
  try { data = exportData(); opts = expOpts(); plan = exportPlan(data, opts); } catch (e) { setExp('Export impossible : ' + (e && e.message ? e.message : e)); return; }       // photo des réglages au moment du clic
  if (!hasAnySound(data, plan)) { setExp(data.song ? 'Rien à exporter : la timeline est vide ou sans son (pas de bloc, pistes en Mute ou patterns vides). Place des blocs, ou repasse en mode PATTERN.' : 'Rien à exporter : le rythme est vide et il n\'y a pas de mélodie.'); return; }
  if (plan.seconds > EXPORT_MAX_SECONDS) { setExp('Export trop long (' + fmtDur(plan.seconds) + ', maximum ' + (EXPORT_MAX_SECONDS / 60) + ' minutes) : ' + ((data.song ? 'raccourcis l\'arrangement' : 'baisse les répétitions') + (data.audio ? ' ou raccourcis / retire un fichier audio.' : '.'))); return; }
  if (typeof OfflineAudioContext === 'undefined') { setExp('Export impossible : ce navigateur ne sait pas faire le rendu audio hors-ligne.'); return; }
  exporting = true; uiExp(); setExp('Rendu en cours…');
  const t0 = performance.now();
  try {
    const r = await withTimeout(renderSong(data, opts), EXPORT_TIMEOUT_MS), name = data.song ? wavName(data.bpm).replace('jack22-studio-', 'jack22-song-') : wavName(data.bpm);
    downloadWav(r.wav, name);
    setExp('Terminé : ' + name + ' · ' + fmtDur(r.plan.seconds) + ' · ' + (r.wav.byteLength / 1048576).toFixed(1) + ' Mo · rendu en ' + ((performance.now() - t0) / 1000).toFixed(1) + ' s. Le fichier est téléchargé.' + (r.plan.withAudio ? ' Audio importé inclus (' + data.audio.clips.length + ' fichier' + (data.audio.clips.length > 1 ? 's' : '') + ').' : (audioClips.length ? ' (Audio importé non inclus : piste AUDIO en Mute ou volume à 0.)' : '')));
  } catch (e) {
    setExp('Export impossible : ' + (e && e.message ? e.message : e));
  } finally { exporting = false; try { uiExp(); } catch (e) {} }
}
$('expBtn').onclick = exportWav;
$('expLoops').onchange = uiExp; $('expMel').onchange = uiExp; $('expRoll').onchange = uiExp;
$('bpm').addEventListener('input', uiExp); $('bpm').addEventListener('change', uiExp);

