(() => {
 'use strict';
 // Principe : on enregistre avec l'enregistreur vocal existant (décompte, métronome, compensation du retard, effets voix),
 // puis la prise devient un clip audio indépendant, posé sur la piste choisie à la mesure de la tête de lecture.
 // La voix utilisée est libérée aussitôt : on peut empiler autant de prises que de pistes (couplets, doublages, ad-libs).
 const $ = id => document.getElementById(id), A = () => window.JACK22_AUDIO_EDIT;
 const say = t => { try { audioMsg(t); } catch (e) { try { setStatus(t); } catch (x) {} } };
 let job = null, takeNo = 0;
 const ui = document.createElement('span'); ui.id = 'c146Tools';
 const rec = document.createElement('button'); rec.type = 'button'; rec.className = 'c146Rec'; rec.textContent = '● Enregistrer ici';
 rec.title = 'Enregistrer une prise micro sur la piste de destination, à partir de la mesure de la tête de lecture';
 rec.setAttribute('aria-pressed', 'false'); ui.append(rec);
 // Pendant une prise lancée d'ici : « plage d'enregistrement » à partir de la mesure de la tête de lecture (même mécanisme
 // que « Prises & assemblage » : le beat repart de cette mesure après le décompte, la prise y est posée).
 const wrapPlan = () => {
  const J = window.J98Capture, core = window.J98CaptureCore; if (!J || J.c146) return !!J;
  const plan0 = J.takePlan;
  J.takePlan = function (slot, prev) {
   if (!job || slot !== job.slot || !core?.plan) return plan0.apply(this, arguments);
   const bpm = getBpm(), maxBar = Math.floor(163 * bpm / 240) + 1, end = Math.min(song.bars + 1, job.bar + 8, maxBar);
   if (end <= job.bar) throw Error('La tête de lecture est trop loin : une prise doit finir avant ' + Math.round(163) + ' s de morceau.');
   return core.plan({ mode: 'range', start: job.bar, end, passes: 1 }, bpm, song.bars);
  };
  J.c146 = true; return true;
 };
 if (!wrapPlan()) { const t = setInterval(() => { if (wrapPlan()) clearInterval(t); }, 300); setTimeout(() => clearInterval(t), 30000); }
 const freeSlot = () => { for (const s of [1, 2, 3]) if (!audioClips.some(c => c.voice && c.voice.slot === s)) return s; return null; };
 const headBar = () => { try { return Math.max(1, Math.floor((window.JACK22_C128?.cursor || 0) / 16) + 1); } catch (e) { return 1; } };   // tête de lecture du studio (en pas)
 const card = s => $('cVoice' + s);
 async function finish(j) {
  // Prise terminée : clip de la voix → copie indépendante (son de la prise, avec ses réglages) sur la piste choisie.
  const c = audioClips.find(x => x.voice && x.voice.slot === j.slot && !j.before.has(x.id));
  if (!c) { say('Prise annulée : aucun son enregistré.'); return null; }
  const at = A().seconds(c), before = new Set(audioClips.map(x => x.id));
  try {
   await A().duplicate(c.id);
   const n = audioClips.find(x => !before.has(x.id)); if (!n) throw Error('copie impossible');
   takeNo++; n.name = 'Prise ' + takeNo + ' · ' + (j.trackName || 'AUDIO');
   A().place(n.id, at, j.lane || 'audio');
   // Voix libérée (la prise vit maintenant sur la piste) : bouton « Supprimer » normal de la voix, confirmation acceptée.
   const conf = window.confirm; window.confirm = () => true;
   try { card(j.slot)?.querySelector('[data-action="remove"]')?.click(); } finally { window.confirm = conf; }
   tlBuild(); A().select([n.id]);
   say('« ' + n.name + ' » posée à la mesure ' + j.bar + '. La voix ' + j.slot + ' est libre pour la prise suivante.');
   return n.id;
  } catch (e) { say('La prise est gardée sur la voix ' + j.slot + ' (copie sur la piste impossible : ' + e.message + ').'); return null; }
 }
 rec.onclick = async () => {
  if (job) { try { $('cRecordStop')?.click(); } catch (e) {} return; }
  try { if (state !== 'stopped' || persistBusy || window.Jack22Lot3?.pending || window.Jack22Voice?.state.active) { say('Arrête la lecture ou attends la fin de l’opération en cours.'); return; } } catch (e) {}
  const slot = freeSlot(); if (!slot) { say('Les 3 voix sont occupées : libère-en une dans « Voix & texte » pour enregistrer ici.'); return; }
  const lane = window.JACK22_TRACKS145?.target || 'audio', t = A().settings.tracks.find(x => x.id === lane), bar = headBar();
  const k = card(slot), barIn = k?.querySelector('[data-action="bar"]'), go = k?.querySelector('[data-action="record"]');
  if (!barIn || !go) { say('Enregistreur vocal introuvable.'); return; }
  barIn.value = String(bar); barIn.dispatchEvent(new Event('input', { bubbles: true })); barIn.dispatchEvent(new Event('change', { bubbles: true }));
  job = { slot, lane, trackName: t?.name, bar, before: new Set(audioClips.map(c => c.id)), started: false };
  rec.setAttribute('aria-pressed', 'true'); rec.textContent = '■ Arrêter la prise';
  say('Prise sur « ' + (t?.name || 'AUDIO') + ' », mesure ' + bar + ' : décompte puis enregistrement. Clique « ■ Arrêter la prise » pour finir.');
  go.click();
  const w = setInterval(async () => {
   const act = !!window.Jack22Voice?.state.active; if (act) job.started = true;
   if (job.started && !act) {
    clearInterval(w); const j = job; await new Promise(r => setTimeout(r, 400));
    try { while (window.Jack22Lot3?.pending) await new Promise(r => setTimeout(r, 150)); } catch (e) {}
    const id = await finish(j); job = null; rec.setAttribute('aria-pressed', 'false'); rec.textContent = '● Enregistrer ici';
    window.JACK22_REC146.last = id;
   }
  }, 150);
  setTimeout(() => { if (job && !job.started) { clearInterval(w); job = null; rec.setAttribute('aria-pressed', 'false'); rec.textContent = '● Enregistrer ici'; say('L’enregistrement n’a pas démarré (micro refusé ou indisponible ?).'); } }, 15000);
 };
 const placeUi = () => { const anchor = $('c145Tools') || $('audioImport'); if (!anchor) return false; if (!ui.isConnected) anchor.after(ui); return true; };
 const build0 = tlBuild; tlBuild = function () { const r = build0.apply(this, arguments); try { placeUi(); } catch (e) {} return r; };
 if (!placeUi()) { const t = setInterval(() => { if (placeUi()) clearInterval(t); }, 300); setTimeout(() => clearInterval(t), 30000); }
 window.JACK22_REC146 = { version: '11.5-claude-7.5-rec-montage', last: null, get busy() { return !!job; }, button: rec };
})();