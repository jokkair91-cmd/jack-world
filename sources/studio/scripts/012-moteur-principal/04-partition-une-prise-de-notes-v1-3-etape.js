/* =====================================================================
   PARTITION — une "prise" de notes (V1.3, étape 4). Fonctions pures : elles ne lisent pas la page.
   Les positions sont en PAS de 1/16 (16 pas = 1 mesure), pas en secondes : la prise suit le BPM.
   Une prise = { version, bars, steps, bpm, notes:[{ start, dur, preset, octave, idx }] }.
   Le futur export WAV rejouera la même prise avec scheduleTake().
   ===================================================================== */
const TAKE_MAX_NOTES = 2000;
const round4 = v => Math.round(v * 10000) / 10000;

/* raw : [{start, end, preset, octave, idx}] en pas (fractionnaires). Renvoie les notes finales, triées. */
function quantizeNotes(raw, steps, quantize) {
  const out = [];
  raw.forEach(n => {
    let s = Math.max(0, n.start), e = Math.max(s, n.end);
    if (quantize) {
      s = Math.round(s); e = Math.round(e);
      if (e <= s) e = s + 1;                                 // une note a toujours au moins 1 pas
      if (s >= steps) { s -= steps; e -= steps; }            // arrondie pile sur la fin : elle passe au début de la boucle
    } else {
      if (e - s < 0.05) e = s + 0.05;
      if (s >= steps) return;
    }
    out.push({ start: round4(s), dur: round4(e - s), preset: n.preset, octave: n.octave, idx: n.idx });
  });
  out.sort((a, b) => a.start - b.start || (a.octave * 24 + a.idx) - (b.octave * 24 + b.idx));
  return out;
}

function makeTake(notes, bars, bpm) {
  return { version: 1, bars, steps: bars * 16, bpm: bpm === undefined ? null : bpm, notes };
}

/* Vérifie une prise venue de l'extérieur (sauvegarde) : renvoie une copie propre, ou null si quoi que ce soit cloche. */
function validateTake(t) {
  if (!t || typeof t !== 'object' || ![1, 2, 4].includes(t.bars) || t.steps !== t.bars * 16) return null;
  if (!Array.isArray(t.notes) || t.notes.length > TAKE_MAX_NOTES) return null;
  const notes = [];
  for (const n of t.notes) {
    if (!n || typeof n !== 'object') return null;
    const ok = Number.isFinite(n.start) && n.start >= 0 && n.start < t.steps && Number.isFinite(n.dur) && n.dur > 0 && n.dur <= t.steps * 2 &&
      typeof n.preset === 'string' && Object.prototype.hasOwnProperty.call(PRESETS, n.preset) &&
      Number.isInteger(n.octave) && n.octave >= 1 && n.octave <= 7 && Number.isInteger(n.idx) && n.idx >= 0 && n.idx <= 23;
    if (!ok) return null;
    notes.push({ start: round4(n.start), dur: round4(n.dur), preset: n.preset, octave: n.octave, idx: n.idx });
  }
  const bpm = Number(t.bpm);
  return { version: 1, bars: t.bars, steps: t.steps, bpm: Number.isFinite(bpm) ? bpm : null, notes };
}

/* Position (en pas, fractionnaire) d'un instant t, d'après l'historique des pas programmés {abs, time, len}.
   Au-delà du dernier pas connu (ou avant le premier), on prolonge avec la durée d'un pas. */
function absAtLog(log, t) {
  if (!log.length) return null;
  let e = log[0];
  for (let i = log.length - 1; i >= 0; i--) { if (log[i].time <= t) { e = log[i]; break; } }
  return e.abs + (t - e.time) / e.len;
}

/* Programme, dans le moteur E, les notes de la prise qui COMMENCENT sur le pas loopPos (utilisé en direct, pas après pas).
   t = heure de ce pas, stepLen = durée d'un pas. Renvoie les voix créées. */
function scheduleTakeAtStep(E, take, loopPos, t, stepLen, skip) {      // skip(note) facultatif : renvoie true pour ne pas jouer cette note (doublon)
  const voices = [];
  take.notes.forEach(n => {
    if (Math.floor(n.start) !== loopPos) return;
    if (skip && skip(n)) return;
    const ts = t + (n.start - loopPos) * stepLen;
    voices.push(E.scheduleNote(n.preset, n.octave, n.idx, ts, ts + n.dur * stepLen, {...n,trackKey:take.trackKey}));
  });
  return voices;
}

/* Programme TOUTE la prise, répétée `loops` fois, à partir de l'heure t0 (utilisé pour l'export WAV et les tests). */
function scheduleTake(E, take, t0, stepLen, loops, skip, baseStep) {   // skip(note, pasAbsolu) facultatif ; baseStep = pas absolu de t0
  const voices = [];
  for (let k = 0; k < loops; k++) take.notes.forEach(n => {
    if (skip && skip(n, (baseStep || 0) + k * take.steps + n.start)) return;
    const ts = t0 + (k * take.steps + n.start + (window.J22Off ? window.J22Off(n) : 0)) * stepLen;
    voices.push(E.scheduleNote(n.preset, n.octave, n.idx, ts, ts + n.dur * stepLen, {...n,trackKey:take.trackKey}));
  });
  return voices;
}

/* ---------- Piano Roll (V1.3, étape 8) : une "mélodie programmée" qui a exactement la forme d'une prise ----------
   Notes en pas de 1/16 (entiers), hauteurs de C1 (24) à B6 (95) ; octave 1..6, idx 0..11. Le moteur sait déjà la jouer (scheduleTake*). */
const ROLL_LO = 24, ROLL_HI = 95, ROLL_ROWS = ROLL_HI - ROLL_LO + 1, ROLL_CW = 36, ROLL_RH = 22, ROLL_MAX_NOTES = 1000;
const roll = { version: 1, bars: 2, steps: 32, bpm: null, notes: [] };
let rollDupSet = new Set();                                     // clés des notes du Piano Roll (pour ne pas jouer deux fois la même note)
const rollMidi = n => (n.octave + 1) * 12 + n.idx;
const rollDupKey = (start, midi, preset) => start + '|' + midi + '|' + preset;

