/* =====================================================================
   MISSION 9a — le morceau = 3 pistes indépendantes (Batterie, 808 / Bass, Mélodie).
   Chaque piste a une liste de patterns (32 maximum) et un pattern ACTIF : c'est lui qui joue et qui s'édite.
   - Batterie : un pattern = une grille 4 sons x 16 pas.   - Basse / Mélodie : un pattern = un Piano Roll (1, 2 ou 4 mesures).
   - patFor(piste, pas) est le SEUL endroit qui choisit quel pattern joue : la Mission 9b (timeline) le remplacera par l'arrangement.
   - song.arrangement est réservé à la 9b (vide pour l'instant).
   ===================================================================== */
const MAX_PATTERNS = 32;
const PALETTE = ['#e3313d', '#22d3ee', '#a78bfa', '#34d399', '#fbbf24', '#f97316', '#ec4899', '#60a5fa'];
const song = { version: 2, nextId: 1, arrangement: [], tracks: [
  { key: 'drums', label: 'BATTERIE', mute: false, active: 0, patterns: [] },
  { key: 'bass', label: '808 / BASS', mute: false, active: 0, patterns: [] },
  { key: 'melody', label: 'MÉLODIE', mute: false, active: 0, patterns: [] } ] };
const newDrumPat = (name, color, grid) => ({ id: song.nextId++, name, color, grid: grid || names.map(() => Array(STEPS).fill(false)) });
const newRollPat = (name, color, bars, notes) => { const p = { id: song.nextId++, name, color, bars: bars || 2, notes: notes || [], keys: null }; p.steps = p.bars * 16; return p; };
const activePat = ti => song.tracks[ti].patterns[song.tracks[ti].active];
let playMode = 'pattern', tlSel = null, tlDrag = null, songStopAt = null;
function patternById(ti, id) { return song.tracks[ti].patterns.find(p => p.id === id) || null; }
function blockAt(ti, bar) { const k = song.tracks[ti].key; return song.arrangement.find(b => b.trackKey === k && bar >= b.startBar && bar < b.startBar + b.lengthBars) || null; }
/* Quel pattern joue sur la piste ti au pas absolu abs ? {p, off (pas de début), end (pas de fin du bloc)} ou null = silence.
   PATTERN : le pattern actif, sans fin. SONG : le pattern du bloc de la timeline (silence hors des blocs ou si le pattern a été supprimé). */
function segFor(ti, abs) {
  if (playMode === 'pattern') return { p: activePat(ti), off: 0, end: Infinity };
  if (abs < 0) return null;
  const b = blockAt(ti, Math.floor(abs / 16)); if (!b) return null;
  const p = patternById(ti, b.patternId); if (!p) return null;
  return { p, off: b.startBar * 16, end: (b.startBar + b.lengthBars) * 16 };
}
const patFor = (ti, abs) => { const g = segFor(ti, abs); return g ? g.p : null; };
const patKeys = p => p.keys || (p.keys = rollKeySet(p));
const rollsHaveNotes = () => song.tracks.map((_,i)=>i).slice(1).some(ti => activePat(ti).notes.length && !song.tracks[ti].mute);
song.tracks[0].patterns.push(newDrumPat('Pattern 1', PALETTE[0], pattern));      // le rythme de départ = Pattern 1 de la batterie
song.tracks[1].patterns.push(newRollPat('Pattern 1', PALETTE[2], 2, []));
song.tracks[2].patterns.push(newRollPat('Pattern 1', PALETTE[1], 2, []));
let rollTrack = 2;                                                               // piste affichée dans le Piano Roll : 1 = basse, 2 = mélodie
const trackSound = { 1: 'sub808', 2: 'lead' };                                   // son proposé pour les nouvelles notes de chaque piste

function rollLoad(p) {                                                           // affiche le pattern p dans le Piano Roll
  roll.bars = p.bars; roll.steps = p.steps; roll.notes = p.notes;
  rollSel = null; rollDrag = null; rollUndoStack.length = 0; $('rollBars').value = String(roll.bars); rollChanged();
}
function setActive(ti, i) {
  song.tracks[ti].active = i;
  if (ti === 0) { pattern = activePat(0).grid; render(); }
  else if (ti === rollTrack) rollLoad(activePat(ti));
  buildPatternUI(); uiExp();
}
function uniqueName(tr) { let n = tr.patterns.length + 1; while (tr.patterns.some(p => p.name === 'Pattern ' + n)) n++; return 'Pattern ' + n; }
function addPattern(ti, src) {                                                   // src : pattern à dupliquer (sinon pattern vide)
  const tr = song.tracks[ti]; if (tr.patterns.length >= MAX_PATTERNS) return;
  const color = src ? src.color : PALETTE[tr.patterns.length % PALETTE.length];
  const name = src ? (src.name + ' copie').slice(0, 24) : uniqueName(tr);
  tr.patterns.push(ti === 0 ? newDrumPat(name, color, src ? src.grid.map(r => r.slice()) : null)
    : newRollPat(name, color, src ? src.bars : 2, src ? src.notes.map(n => Object.assign({}, n)) : []));
  setActive(ti, tr.patterns.length - 1);
}
function deletePattern(ti) {
  const tr = song.tracks[ti]; if (tr.patterns.length <= 1) return;
  const pp = activePat(ti), refs = song.arrangement.filter(b => b.trackKey === tr.key && b.patternId === pp.id).length;
  if (!confirm('Supprimer le pattern « ' + pp.name + ' » ?' + (refs ? '\n' + refs + ' bloc(s) de la timeline l\'utilisent : ils resteront en gris (pattern supprimé) et seront silencieux.' : ''))) return;
  tr.patterns.splice(tr.active, 1); tr.active = Math.min(tr.active, tr.patterns.length - 1);
  setActive(ti, tr.active);
}
function buildPatternUI() {
  const box = $('patList'); box.innerHTML = '';
  const btn = (label, fn) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.onclick = fn; return b; };
  song.tracks.forEach((tr, ti) => {
    const cur = activePat(ti), wrap = document.createElement('div'); wrap.className = 'ptrack';
    const head = document.createElement('div'); head.className = 'ptrack-head';
    const h = document.createElement('h3'); h.textContent = tr.label;
    const mute = btn('Mute', () => { const was = tr.mute || !!(window.J22ChannelMuted && window.J22ChannelMuted(tr.key)); tr.mute = !was; if (window.J22SyncChannel) window.J22SyncChannel(tr.key, tr.mute); if (tr.mute && ti > 0) { if (window.J22KillTrack) window.J22KillTrack(tr.key); else killMelody(); } buildPatternUI(); uiExp(); if (window.J22MuteSync) window.J22MuteSync(); });
    const shownMute = tr.mute || !!(window.J22ChannelMuted && window.J22ChannelMuted(tr.key)); mute.className = 'mute'; mute.dataset.trackKey = tr.key; mute.title = 'Mute · ' + tr.label; mute.setAttribute('aria-pressed', String(shownMute)); mute.setAttribute('aria-label', (shownMute ? 'Réactiver la piste ' : 'Couper la piste ') + tr.label);
    const cnt = document.createElement('span'); cnt.className = 'pcount'; cnt.textContent = tr.patterns.length + ' / ' + MAX_PATTERNS + ' patterns';
    head.append(h, mute, cnt);
    const chips = document.createElement('div'); chips.className = 'pchips';
    tr.patterns.forEach((p, i) => {
      const b = btn('', () => setActive(ti, i)); b.className = 'pchip'; b.setAttribute('aria-pressed', String(i === tr.active));
      const dot = document.createElement('i'); dot.style.background = p.color; b.append(dot, document.createTextNode(p.name)); chips.append(b);
    });
    const ctl = document.createElement('div'); ctl.className = 'pctl';
    const add = btn('+ Nouveau', () => addPattern(ti)), dup = btn('Dupliquer', () => addPattern(ti, cur)), del = btn('Supprimer', () => deletePattern(ti));
    add.disabled = dup.disabled = tr.patterns.length >= MAX_PATTERNS; del.disabled = tr.patterns.length <= 1;
    const name = document.createElement('input'); name.type = 'text'; name.maxLength = 24; name.value = cur.name; name.setAttribute('aria-label', 'Nom du pattern ' + tr.label);
    name.oninput = () => { if (!name.value.trim()) return; cur.name = name.value.slice(0, 24); chips.children[tr.active].lastChild.textContent = cur.name; if (ti === rollTrack) rollMsgPat(); tlBuild(); };
    name.onblur = () => { name.value = cur.name; };
    const col = document.createElement('input'); col.type = 'color'; col.value = cur.color; col.setAttribute('aria-label', 'Couleur du pattern ' + tr.label);
    col.oninput = () => { cur.color = col.value; chips.children[tr.active].firstChild.style.background = cur.color; tlBuild(); };
    ctl.append(add, dup, name, col, del);
    wrap.append(head, chips, ctl); box.append(wrap);
  });
  tlBuild();
}
function rollMsgPat() { $('rollPat').textContent = '· ' + activePat(rollTrack).name; }
$('rollTrack').onchange = () => {
  rollTrack = Number($('rollTrack').value); rollLoad(activePat(rollTrack));
  $('rollSound').value = trackSound[rollTrack]||'lead';
  $('rollWrap').scrollTop = (ROLL_HI - (rollTrack === 1 ? 40 : 60)) * ROLL_RH - 170;
};
$('rollSound').addEventListener('change', () => { trackSound[rollTrack] = $('rollSound').value; });

