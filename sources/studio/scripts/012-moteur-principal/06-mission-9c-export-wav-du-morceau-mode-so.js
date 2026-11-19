/* =====================================================================
   MISSION 9c — export WAV du MORCEAU (mode SONG)
   Même moteur (createEngine), même rendu hors-ligne, mêmes règles que l'écoute en direct :
   - on photographie la timeline : seuls les blocs audibles comptent (piste en Mute ou pattern supprimé = silence, comme à l'écoute) ;
   - batterie : la grille du bloc, mesure par mesure ; basse et mélodie : le pattern du bloc, répété sur toute la longueur du bloc, notes coupées à la fin du bloc ;
   - la prise enregistrée (si « Inclure la mélodie » est cochée) boucle sur tout le morceau, sans doubler les notes déjà jouées par un bloc ;
   - durée = de la mesure 1 à la fin du dernier bloc audible, une seule fois, + la fin habituelle (1,5 s, plus longue avec réverb / delay).
   ===================================================================== */
function songExportData() {
  const blocks = [];
  song.arrangement.forEach(b => {
    const ti = trackIdx(b.trackKey), tr = song.tracks[ti], p = patternById(ti, b.patternId);
    if (tr.mute || !p) return;
    blocks.push({ ti, startBar: b.startBar, lengthBars: b.lengthBars, grid: ti === 0 ? p.grid.map(r => r.slice()) : null,
      roll: ti > 0 ? { steps: p.steps, bars: p.bars, notes: JSON.parse(JSON.stringify(p.notes)) } : null });
  });
  return { blocks, endBar: blocks.reduce((m, b) => Math.max(m, b.startBar + b.lengthBars), 0) };
}
function scheduleSongBar(E, bus, data, plan, bar) {
  const sl = data.stepLen, base = bar * 16;
  data.song.blocks.forEach(b => {
    if (b.ti === 0) { if (bar >= b.startBar && bar < b.startBar + b.lengthBars) scheduleDrumsBar(E, bus, b.grid, bar, sl); return; }
    if (bar !== b.startBar) return;                                              // basse / mélodie : tout le bloc d'un coup
    const end = (b.startBar + b.lengthBars) * 16;
    for (let k = 0; b.startBar * 16 + k * b.roll.steps < end; k++) b.roll.notes.forEach(n => {
      const st = b.startBar * 16 + k * b.roll.steps + n.start + (window.J22Off ? window.J22Off(n) : 0); if (st >= end) return;
      E.scheduleNote(n.preset, n.octave, n.idx, st * sl, Math.min(st + n.dur, end) * sl, {...n,trackKey:data.trackKeys?.[b.ti]});                 // coupée à la frontière du bloc
    });
  });
  if (plan.withMel && bar % data.take.bars === 0) {
    const skip = plan.withRoll ? ((n, abs) => data.song.blocks.some(b => {
      if (b.ti === 0) return false; const bb = Math.floor(abs / 16); if (bb < b.startBar || bb >= b.startBar + b.lengthBars) return false;
      if (!b.keys) b.keys = rollKeySet(b.roll); return takeNoteIsDup(b.keys, b.roll, n, abs - b.startBar * 16); })) : null;
    scheduleTake(E, data.take, base * sl, sl, 1, skip, base);
  }
}


