/* =====================================================================
   MOTEUR AUDIO — réutilisable (V1.3, étape 2)
   Tout ce qui FABRIQUE le son est ici : chaîne de sortie, percussions, voix du synthé.
   - createEngine(ctx, ...) marche avec un AudioContext (jeu en direct) comme avec un
     OfflineAudioContext (rendu hors-ligne, pour l'export WAV plus tard) : même code, donc même son.
   - Le moteur ne lit jamais la page (pas de document, pas de curseurs) : on lui donne les réglages.
   - Toutes ses fonctions acceptent une heure précise (en secondes) : on peut programmer des notes
     à l'avance, avec leur début ET leur fin (relâchement programmé).
   ===================================================================== */
const SOFT_LIMITER = true;                  // mettre false pour retirer la protection anti-saturation
const LIMIT_RANGE = 2;                      // le limiteur "voit" un signal jusqu'à ±2 avant d'être plafonné (voir createEngine)
const MAX_VOICES = 10;                      // polyphonie (jeu en direct)
/* 808 : niveau des harmoniques 2 à 6 par rapport au grave, quand le curseur "Harmoniques 808" est à 100 %.
   Ce sont de vrais sinus ajoutés (synthèse additive) : aucune distorsion, donc aucune saturation. */
const HARM_LEVELS = [0.67, 0.67, 0.52, 0.37, 0.22];
const PRESETS = {
  lead:   { osc1:'sawtooth', osc2:'square',   mix:[0.5,0.5],   detune:12, cutoff:3200, q:8,   attack:0.006, decay:0.20, sustain:0.75, release:0.25, level:0.3,  octave:4 },
  bass:   { osc1:'sine',     osc2:'sawtooth', mix:[0.6,0.4],   detune:4,  cutoff:700,  q:4,   attack:0.005, decay:0.15, sustain:0.85, release:0.18, level:0.28,  octave:2 },
  pad:    { osc1:'sawtooth', osc2:'triangle', mix:[0.5,0.5],   detune:18, cutoff:1800, q:3,   attack:0.35,  decay:0.50, sustain:0.90, release:1.10, level:0.31,   octave:3 },
  pluck:  { osc1:'triangle', osc2:'sine',     mix:[0.6,0.4],   detune:6,  cutoff:4200, q:12,  attack:0.004, decay:0.30, sustain:0.08, release:0.30, level:0.46, octave:4 },
  /* 808 Sub : sinus profond propre + petit "coup" de hauteur au départ + branche d'harmoniques réglable (curseur) pour rester audible sur petits haut-parleurs */
  sub808: { osc1:'sine',     osc2:'sine',     mix:[0.45,0.55], detune:0,  cutoff:900,  q:0.7, attack:0.003, decay:1.40, sustain:0.55, release:0.40, level:0.46,   octave:2, glide:{ratio:1.9, time:0.045}, harm:true }
};
function volumeToGain(v) {            // 0–100 % -> gain (courbe douce : 50 % ≈ -12 dB)
  const x = Math.max(0, Math.min(100, Number(v) || 0)) / 100;
  return x * x;
}
/* Courbe "limiteur doux" : ne change rien sous 0.8, puis arrondit vers un plafond de 0.95
   (le signal ne dépasse donc jamais 0.95, donc jamais de saturation numérique).
   Un WaveShaper ne lit que les valeurs entre -1 et +1. Pour qu'il puisse traiter un signal
   allant jusqu'à ±LIMIT_RANGE, on divise le signal par LIMIT_RANGE AVANT (gain "pre" dans
   initAudio) et la courbe multiplie par LIMIT_RANGE (ligne "x = ..." ci-dessous).
   Les deux se compensent : le gain total est exactement 1 (0 dB) sous le seuil de 0.8. */
function makeSoftLimitCurve() {
  const n = 2049, a = 0.8, ceiling = 0.95, curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1) * 2 - 1) * LIMIT_RANGE;   // valeur réelle du signal que cette case représente
    const ax = Math.abs(x);
    const y = ax <= a ? ax : a + (ceiling - a) * Math.tanh((ax - a) / (ceiling - a));
    curve[i] = x < 0 ? -y : y;
  }
  return curve;
}
function makeHarmWave(ctx) {          // forme d'onde = harmoniques 2 à 6 seulement (le rang 1 = le grave reste à 0)
  const real = new Float32Array(HARM_LEVELS.length + 2), imag = new Float32Array(HARM_LEVELS.length + 2);
  HARM_LEVELS.forEach((a, i) => { imag[i + 2] = a; });
  return ctx.createPeriodicWave(real, imag, { disableNormalization: true });   // niveaux exacts, sans renormalisation
}
const noteFreq = midi => 440 * Math.pow(2, (midi - 69) / 12);
const orDefault = (v, d) => (v === undefined || v === null || v === '') ? d : Number(v);

/* Fige un réglage à sa valeur actuelle pour repartir de là sans saut.
   (On lit la valeur, on efface les automatisations prévues, puis on repose la valeur.
   Testé : avec cancelAndHoldAtTime + rampe, Chrome coupait le son d'un coup, donc un clic.) */
function holdParam(param, t, t0) {
  const cur = (t0 !== undefined && t < t0) ? 0 : param.value;   // note pas encore démarrée (appui plus court que START_LEAD) : le volume vaut 0, pas la valeur par défaut (1)
  param.cancelScheduledValues(t);
  param.setValueAtTime(cur, t);
}

/* Enveloppe d'une voix : montée douce, puis descente vers le niveau tenu */
function applyEnv(param, t, p) {
  const aEnd = t + p.attack;                       // montée douce (jamais instantanée : pas de clic)
  param.setValueAtTime(0, t);
  param.linearRampToValueAtTime(p.level, aEnd);
  param.setTargetAtTime(p.level * p.sustain, aEnd, p.decay / 3);   // descente vers le niveau tenu
}

/* Niveau de cette enveloppe à l'instant t, par le calcul (pour programmer un relâchement à l'avance,
   sans avoir à lire la valeur "en direct"). Mêmes formules que applyEnv. */
function envAt(p, t0, t) {
  if (t <= t0) return 0;
  const aEnd = t0 + p.attack;
  if (t < aEnd) return p.level * (t - t0) / p.attack;
  const hold = p.level * p.sustain;
  return hold + (p.level - hold) * Math.exp(-(t - aEnd) / (p.decay / 3));
}

