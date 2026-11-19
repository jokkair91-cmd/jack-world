/* =====================================================================
   JACK22 STUDIO — J-Drums V1.1 + synthé JX-22 (V1.2) + 808 amélioré (V1.3, étape 1) + moteur audio réutilisable (V1.3, étape 2) + mixeur (V1.3, étape 3) + enregistreur de notes (V1.3, étape 4) + export WAV (V1.3, étape 5) + effets audio (V1.3, étape 6) + sauvegarde des effets et gain de sortie du compresseur (V1.3, étape 7) + Piano Roll (V1.3, étape 8)
   Ce qui change par rapport à la V1 (voir aussi les commentaires "V1.1") :
   1. Play / Pause / Stop séparés : Pause reprend là où on s'est arrêté.
   2. Une seule minuterie de lecture à la fois (même si on clique très vite).
   3. Volume master + protection douce contre la saturation.
   4. Sauvegarde / chargement sécurisés (erreurs gérées, BPM validé).
   ===================================================================== */

/* ---------- Réglages (faciles à modifier) ---------- */
const names = ['KICK', 'SNARE', 'HI-HAT', 'CLAP'];
const STEPS = 16;                    // nombre de pas
const SAVE_KEY = 'jack22-pattern-v1';// même clé que la V1 : les anciennes sauvegardes restent lisibles
const BPM_MIN = 40, BPM_MAX = 240, BPM_DEFAULT = 120;
const LOOKAHEAD = 0.12;              // secondes de sons programmées à l'avance
/* (les réglages du moteur audio — SOFT_LIMITER, LIMIT_RANGE, MAX_VOICES — sont dans le bloc MOTEUR AUDIO plus bas) */

/* ---------- État du programme ---------- */
let pattern = names.map(() => Array(STEPS).fill(false));   // Mission 9a : grille du pattern de batterie ACTIF
[0, 4, 8, 12].forEach(i => pattern[0][i] = true);
[4, 12].forEach(i => pattern[1][i] = true);
[0, 2, 4, 6, 8, 10, 12, 14].forEach(i => pattern[2][i] = true);

let audio = null, noiseBuffer = null, masterGain = null, bus = null;
let synthBus = null, harmBus = null, harmWave = null;   // bus du synthé + branche "harmoniques" du 808 (V1.3)
let state = 'stopped';               // 'stopped' | 'playing' | 'paused'
let step = 0;                        // prochain pas à programmer
let nextTime = 0;                    // moment (en secondes audio) du prochain pas
let resumeStep = 0;                  // pas où reprendre après une pause
let timer = null, raf = null;        // minuterie de programmation / animation
let queue = [];                      // pas programmés : {step, abs, time}
let absStep = 0, resumeAbs = 0;      // position absolue en pas : négative pendant le compte à rebours
let stepLog = [];                    // historique des pas programmés {abs, time, len} : sert à retrouver la position d'un instant
let cols = [], shownStep = -1;       // cases par colonne + pas actuellement surligné

const $ = id => document.getElementById(id);
const tracks = $('tracks');
const setStatus = text => { $('status').textContent = text; window.Jack22Feedback?.publish('project', text); };

/* ---------- Affichage de la grille ---------- */
function render() {
  tracks.innerHTML = '';
  cols = Array.from({ length: STEPS }, () => []);
  names.forEach((name, r) => {
    const row = document.createElement('div');
    row.className = 'track';
    const label = document.createElement('div');
    label.className = 'track-label';
    label.textContent = name;
    row.append(label);
    for (let c = 0; c < STEPS; c++) {
      const b = document.createElement('button');
      b.className = 'step' + (c % 4 === 0 ? ' beat' : '') + (pattern[r][c] ? ' active' : '');
      b.setAttribute('aria-label', `${name} pas ${c + 1}`);
      b.setAttribute('aria-pressed', String(pattern[r][c]));
      b.onclick = () => {
        pattern[r][c] = !pattern[r][c];
        b.classList.toggle('active', pattern[r][c]);
        b.setAttribute('aria-pressed', String(pattern[r][c]));
      };
      cols[c].push(b);
      row.append(b);
    }
    tracks.append(row);
  });
  if (shownStep >= 0) highlight(shownStep);   // garde le surlignage après un rechargement de la grille
}

/* Surligne une colonne (c = -1 : plus rien) */
function highlight(c) {
  cols.forEach(col => col.forEach(b => b.classList.remove('playing')));
  shownStep = c;
  if (c >= 0 && cols[c]) cols[c].forEach(b => b.classList.add('playing'));
}

/* ---------- Audio : voir le MOTEUR AUDIO ci-dessous (createEngine) ---------- */
