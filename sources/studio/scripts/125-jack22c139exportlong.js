
/* 6.9 (Mission M1, Claude) : export d'un morceau complet.
   - La limite d'export passe de 3 à 10 minutes (remplacement d'une ligne, voir m1-export-patches.txt) : WAV, pistes séparées,
     placement des clips et durée maximale d'une prise voix suivent la même limite.
   - Le délai de sécurité du rendu (2 minutes en 6.8) est porté à 10 minutes : un long morceau avec effets n'est plus annulé en route.
   - Avant un rendu de plus de 3 minutes, le studio annonce la mémoire nécessaire (le rendu se fait en mémoire). */
(() => {
 'use strict';
 EXPORT_TIMEOUT_MS = 600000;
 const mb = s => Math.round(s * EXPORT_SR * 2 * 4 / 1048576 + s * EXPORT_SR * 4 / 1048576);       // rendu en flottants + WAV 16 bits
 const baseExport = exportWav;
 exportWav = async function () {
  try { const p = exportPlan(exportData(), expOpts()); if (p.seconds > 180 && p.seconds <= EXPORT_MAX_SECONDS && !exporting) setExp('Rendu d’un morceau de ' + fmtDur(p.seconds) + ' : environ ' + mb(p.seconds) + ' Mo de mémoire pendant quelques secondes…'); } catch (e) {}
  return baseExport.apply(this, arguments);
 };
 const btn = document.getElementById('expBtn'); if (btn) btn.onclick = exportWav;
 window.JACK22_EXPORT139 = { version: '11.5-claude-6.9-export-long', max: EXPORT_MAX_SECONDS, memoryMb: mb };
})();
