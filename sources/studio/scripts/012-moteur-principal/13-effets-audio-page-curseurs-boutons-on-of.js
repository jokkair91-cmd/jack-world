/* =====================================================================
   EFFETS AUDIO (page) : curseurs, boutons ON/OFF, étiquettes ; le moteur fait le travail
   ===================================================================== */
const DELAY_NOTES = { '0.25': '1/16', '0.5': '1/8', '0.75': '1/8 pointée', '1': '1/4', '1.5': '1/4 pointée' };   // durée en temps (noires)
const fxOn = id => $(id).getAttribute('aria-pressed') === 'true';
function currentFx() {                                                 // réglages actuels, au format du moteur (aussi utilisés par l'export)
  return {
    eq: { low: Number($('fxLow').value), mid: Number($('fxMid').value), high: Number($('fxHigh').value) },
    reverb: { on: fxOn('fxRevOn'), mix: Number($('fxRevMix').value), decay: Number($('fxRevDecay').value) / 10 },
    delay: { on: fxOn('fxDlyOn'), time: Number($('fxDlyNote').value) * 60 / getBpm(), fb: Number($('fxDlyFb').value), mix: Number($('fxDlyMix').value) },
    comp: { on: fxOn('fxCmpOn'), thr: Number($('fxCmpThr').value), ratio: Number($('fxCmpRatio').value), attack: Number($('fxCmpAtk').value), release: Number($('fxCmpRel').value), makeup: Number($('fxCmpMk').value) }
  };
}
function fxLabels() {
  const sg = v => (v > 0 ? '+' : '') + v + ' dB', set = (id, t) => { $(id + 'Val').textContent = t; };
  set('fxLow', sg(Number($('fxLow').value))); set('fxMid', sg(Number($('fxMid').value))); set('fxHigh', sg(Number($('fxHigh').value)));
  set('fxRevMix', $('fxRevMix').value + '%'); set('fxRevDecay', (Number($('fxRevDecay').value) / 10).toFixed(1).replace('.', ',') + ' s');
  $('fxDlyTimeVal').textContent = DELAY_NOTES[$('fxDlyNote').value] + ' = ' + Math.round(Number($('fxDlyNote').value) * 60000 / getBpm()) + ' ms';
  set('fxDlyFb', $('fxDlyFb').value + '%'); set('fxDlyMix', $('fxDlyMix').value + '%');
  set('fxCmpThr', $('fxCmpThr').value + ' dB'); set('fxCmpRatio', $('fxCmpRatio').value + ':1'); set('fxCmpAtk', $('fxCmpAtk').value + ' ms'); set('fxCmpRel', $('fxCmpRel').value + ' ms'); set('fxCmpMk', sg(Number($('fxCmpMk').value)));
}
/* ---------- sauvegarde des effets (V1.3, étape 7) : bloc "fx" ajouté à la sauvegarde ; le reste du format n'a pas changé ---------- */
function currentFxSave() {
  return {
    version: 1,
    eq: { low: Number($('fxLow').value), mid: Number($('fxMid').value), high: Number($('fxHigh').value) },
    reverb: { on: fxOn('fxRevOn'), mix: Number($('fxRevMix').value), decay: Number($('fxRevDecay').value) / 10 },
    delay: { on: fxOn('fxDlyOn'), note: Number($('fxDlyNote').value), fb: Number($('fxDlyFb').value), mix: Number($('fxDlyMix').value) },     // la note (1/8...), pas des ms : le temps suit le BPM
    comp: { on: fxOn('fxCmpOn'), thr: Number($('fxCmpThr').value), ratio: Number($('fxCmpRatio').value), attack: Number($('fxCmpAtk').value), release: Number($('fxCmpRel').value), makeup: Number($('fxCmpMk').value) }
  };
}
/* Vérifie un bloc "fx" lu dans une sauvegarde : tout ou rien (un seul champ faux et le bloc entier est ignoré). Renvoie les réglages propres ou null. */
function parseFxSave(f) {
  const isObj = o => o !== null && typeof o === 'object' && !Array.isArray(o);
  if (!isObj(f) || !isObj(f.eq) || !isObj(f.reverb) || !isObj(f.delay) || !isObj(f.comp)) return null;
  const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  let bad = false;
  const num = (o, k, lo, hi) => { const v = own(o, k) ? o[k] : NaN; if (typeof v !== 'number' || !isFinite(v) || v < lo || v > hi) { bad = true; return 0; } return v; };
  const bool = (o, k) => { if (!own(o, k) || typeof o[k] !== 'boolean') { bad = true; return false; } return o[k]; };
  const out = {
    eq: { low: num(f.eq, 'low', -12, 12), mid: num(f.eq, 'mid', -12, 12), high: num(f.eq, 'high', -12, 12) },
    reverb: { on: bool(f.reverb, 'on'), mix: num(f.reverb, 'mix', 0, 100), decay: num(f.reverb, 'decay', 0.3, 4) },
    delay: { on: bool(f.delay, 'on'), note: num(f.delay, 'note', 0.25, 1.5), fb: num(f.delay, 'fb', 0, 80), mix: num(f.delay, 'mix', 0, 100) },
    comp: { on: bool(f.comp, 'on'), thr: num(f.comp, 'thr', -40, 0), ratio: num(f.comp, 'ratio', 1, 20), attack: num(f.comp, 'attack', 1, 100), release: num(f.comp, 'release', 50, 1000), makeup: num(f.comp, 'makeup', 0, 18) }
  };
  if (bad || !Object.prototype.hasOwnProperty.call(DELAY_NOTES, String(out.delay.note))) return null;
  return out;
}
function applyFxSave(fx) {                                             // remet les curseurs et boutons, puis le moteur suit (fxChanged)
  const set = (id, v) => { $(id).value = String(v); };
  set('fxLow', fx.eq.low); set('fxMid', fx.eq.mid); set('fxHigh', fx.eq.high);
  set('fxRevMix', fx.reverb.mix); set('fxRevDecay', Math.round(fx.reverb.decay * 10));
  set('fxDlyNote', fx.delay.note); set('fxDlyFb', fx.delay.fb); set('fxDlyMix', fx.delay.mix);
  set('fxCmpThr', fx.comp.thr); set('fxCmpRatio', fx.comp.ratio); set('fxCmpAtk', fx.comp.attack); set('fxCmpRel', fx.comp.release); set('fxCmpMk', fx.comp.makeup);
  [['fxRevOn', fx.reverb.on], ['fxDlyOn', fx.delay.on], ['fxCmpOn', fx.comp.on]].forEach(([id, on]) => { $(id).setAttribute('aria-pressed', String(on)); $(id).textContent = on ? 'ON' : 'OFF'; });
  fxChanged(); fxDecayLater();                                         // les réglages s'appliquent tout de suite, la durée de la reverb une fois calmé
}

let fxTimer = null;
function fxDecayLater() {                                              // la durée de la reverb se recalcule (calcul lourd) : une seule fois, quand les réglages se sont calmés
  clearTimeout(fxTimer); fxTimer = setTimeout(() => { if (engine) engine.setFx(currentFx()); }, 150);
}
function fxChanged(ev) {
  fxLabels();
  if (typeof uiExp === 'function') uiExp();                            // la fin de l'export dépend des effets
  if (!engine) return;
  if (ev && ev.target && ev.target.id === 'fxRevDecay') { fxDecayLater(); return; }
  const f = currentFx(); f.reverb.decay = engine.fxState().reverb.decay;   // tout le reste s'applique tout de suite ; la durée de la reverb attend fxDecayLater
  engine.setFx(f);
}
document.querySelectorAll('#fx input, #fx select').forEach(el => { el.addEventListener('input', fxChanged); el.addEventListener('change', fxChanged); });
['fxRevOn', 'fxDlyOn', 'fxCmpOn'].forEach(id => $(id).addEventListener('click', () => {
  const on = !fxOn(id); $(id).setAttribute('aria-pressed', String(on)); $(id).textContent = on ? 'ON' : 'OFF'; fxChanged();
}));
$('bpm').addEventListener('input', fxChanged); $('bpm').addEventListener('change', fxChanged);      // le delay suit le tempo
fxLabels();

