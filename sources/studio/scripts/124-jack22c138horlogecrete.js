
/* 6.8 (Mission 0b, Claude) : le son ne « déraille » plus quand la page prend du retard, et la saturation se voit.
   Défaut de la 6.6/6.7 : l'audio importé et les voix suivent l'horloge de la carte son, la batterie et les synthés sont
   programmés par la page (toutes les 25 ms, 120 ms à l'avance). Si la page était bloquée plus longtemps, le studio
   recalait la batterie sur « maintenant » : elle restait en retard sur les voix jusqu'à l'arrêt (237 ms mesurés).
   Ce bloc :
   1. après un retard, RATTRAPE la grille : les pas manqués sont sautés (leurs notes ne sont pas jouées en rafale),
      la batterie reprend exactement sur la grille de l'audio, et un fichier audio qui devait démarrer pendant le retard
      démarre au bon endroit de son contenu ;
   2. le dit dans la barre d'état (durée du retard, nombre de fois depuis Play) ;
   3. affiche la crête du Master à côté de VOLUME et passe au rouge « SATURE » quand le son est écrasé par le limiteur doux.
   L'export WAV ne passe pas par ce programmateur : il ne change pas. */
(() => {
 'use strict';
 const C = { stalls: 0, lateMs: 0, skipped: 0, lastPeak: 0, hot: 0 };
 // ---------- 1. Horloge ----------
 // Un fichier audio programmé dans le passé démarre « maintenant », à l'endroit de son contenu où il devrait être.
 const baseStartClip = audioStartClip;
 audioStartClip = function (c, when, offset) {
  if (audio && Number.isFinite(when)) {
   const now = audio.currentTime + 0.01;
   if (when < now) { offset = Math.max(0, offset || 0) + (now - when); when = now; }
  }
  return baseStartClip.call(this, c, when, offset);
 };
 const baseSchedule = schedule;
 schedule = function () {
  if (state === 'playing' && audio) {
   const now = audio.currentTime;
   if (nextTime < now - 0.05) {                                       // même seuil que l'original : 50 ms de retard
    const len = 60 / getBpm() / 4, late = now - nextTime; let n = 0;
    while (nextTime < now + 0.01 && n < 100000) {                     // pas manqués : on avance sur la grille sans rien jouer
     if (songEndNow(absStep)) break;
     stepLog.push({ abs: absStep, time: nextTime, len });
     audioSchedule(absStep, nextTime);                                // un fichier qui commençait pendant le retard démarre quand même, calé
     nextTime += len; step = (step + 1) % STEPS; absStep++; n++;
    }
    C.stalls++; C.skipped += n; C.lateMs = Math.round(late * 1000);
    try { setStatus('Lecture : la page a pris ' + C.lateMs + ' ms de retard ; batterie et synthés recalés sur la grille de l’audio (' + C.stalls + ' fois depuis Play).'); } catch (e) {}
   }
  }
  return baseSchedule.apply(this, arguments);
 };
 const baseStart = start;
 start = function () { C.stalls = 0; C.skipped = 0; C.lateMs = 0; return baseStart.apply(this, arguments); };
 // ---------- 3. Crête du Master ----------
 const taps = new WeakMap(); let badge = null, hold = 0, holdUntil = 0, buf = null;
 function ensureBadge() {
  if (badge && badge.isConnected) return badge;
  const after = document.getElementById('masterVal'); if (!after) return null;
  badge = document.createElement('span'); badge.id = 'j138Peak'; badge.setAttribute('role', 'status'); badge.setAttribute('aria-live', 'polite');
  badge.title = 'Crête du Master (avant le limiteur doux). Rouge « SATURE » : le son est écrasé. Baisse le VOLUME, ou les pistes les plus fortes.';
  badge.textContent = 'crête —'; after.after(badge); return badge;
 }
 function tap() {
  if (!engine || !engine.masterGain || !audio) return null;
  let a = taps.get(engine);
  if (!a) { a = audio.createAnalyser(); a.fftSize = 2048; engine.masterGain.connect(a); taps.set(engine, a); }
  return a;
 }
 function frame() {                                  // 20 fois par seconde (minuterie simple : marche aussi fenêtre réduite)
  const b = ensureBadge(), a = state === 'playing' ? tap() : null;
  if (b && a && state === 'playing') {
   if (!buf || buf.length !== a.fftSize) buf = new Float32Array(a.fftSize);
   a.getFloatTimeDomainData(buf); let p = 0; for (let i = 0; i < buf.length; i++) { const v = Math.abs(buf[i]); if (v > p) p = v; }
   const t = performance.now(); if (p >= hold || t > holdUntil) { hold = p; holdUntil = t + 1500; }
   C.lastPeak = hold; if (p > 0.8) C.hot++;
   const db = hold > 0 ? 20 * Math.log10(hold) : -Infinity, hot = hold > 0.8;      // 0,8 : seuil du limiteur doux
   b.textContent = hot ? 'SATURE ' + (db >= 0 ? '+' : '') + db.toFixed(1) + ' dB' : 'crête ' + (Number.isFinite(db) ? db.toFixed(1) : '—') + ' dB';
   b.classList.toggle('hot', hot); b.classList.toggle('warm', !hot && hold > 0.6);
  } else if (b && state !== 'playing' && hold) { b.classList.remove('hot', 'warm'); hold = 0; }
 }
 setInterval(frame, 50);
 ensureBadge();
 window.JACK22_CLOCK138 = { version: '11.5-claude-6.8-horloge-crete', state: C };
})();
