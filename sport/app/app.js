// JACK SPORT : l'appli (écrans, séances guidées, alimentation, suivi).
import { Viewer } from './mannequin.js';
import { EXERCICES, EX, ZONES, PROGRAMMES, OBJECTIFS, ECHAUFFEMENT, progression, toursSemaine, NUTRITION, ACTIVITE, ALIMENTS_PROTEINES } from './data.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const LIEU = { maison: 'Maison', salle: 'Salle' };

// ---------- mémoire (dans le navigateur seulement) ----------
const KEY = 'jacksport.v1';
const defaults = () => ({ look: 'garcon', objectif: 'minceur', lieu: 'maison', historique: [], poids: [], progres: {}, semaine: {}, nutri: { age: 25, poids: 70, taille: 175, act: 1.375 }, voix: true });
let S = (() => {
  try { const d = JSON.parse(localStorage.getItem(KEY) || '{}'); const base = defaults(); return { ...base, ...d, nutri: { ...base.nutri, ...(d.nutri || {}) } }; }
  catch { return defaults(); }
})();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* navigation privée */ } };

// ---------- navigation ----------
const VIEWS = ['accueil', 'exercices', 'programmes', 'programme', 'nutrition', 'suivi'];
function go(name, push = true) {
  if (!VIEWS.includes(name)) name = 'accueil';
  for (const v of VIEWS) $('#v-' + v).hidden = v !== name;
  const tab = name === 'programme' ? 'programmes' : name;
  $$('[data-go]').forEach(b => b.tagName === 'BUTTON' && (b.dataset.go === tab ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current')));
  if (name === 'suivi') renderSuivi();
  if (name === 'accueil') renderHomeStats();
  if (push && location.hash !== '#' + name) history.pushState(null, '', '#' + name);
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-go]');
  if (b) { e.preventDefault(); go(b.dataset.go); }
});
window.addEventListener('popstate', () => go(location.hash.slice(1).split('/')[0], false));

// ---------- fille / garçon ----------
function setLook(look) {
  S.look = look;
  save();
  $$('[data-look]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.look === look)));
  [heroV, detailV, playerV].forEach(v => v && v.setLook(look));
  thumbCache.clear();
  refreshThumbs();
  renderNutri();
}
document.addEventListener('click', e => { const b = e.target.closest('[data-look]'); if (b) setLook(b.dataset.look); });

// ---------- vignettes 3D ----------
let thumbV = null;
const thumbCache = new Map();
const queue = [];
let busy = false;
function thumbPhase(ex) { const n = ex.anim.frames.length; return ex.anim.thumb ?? (n > 1 ? 1 / n : 0); }
function wantThumb(id, img) {
  const k = S.look + ':' + id;
  if (thumbCache.has(k)) { img.src = thumbCache.get(k); img.classList.add('on'); return; }
  queue.push({ id, img });
  pump();
}
function pump() {
  if (busy || !queue.length) return;
  busy = true;
  const next = () => {
    const job = queue.shift();
    if (!job) { busy = false; return; }
    try {
      if (!thumbV) { const c = document.createElement('canvas'); thumbV = new Viewer(c, { thumb: true, width: 260, height: 260, look: S.look, yaw: 34, pitch: 10 }); }
      if (thumbV.look !== S.look) thumbV.setLook(S.look);
      const k = S.look + ':' + job.id;
      if (!thumbCache.has(k)) thumbCache.set(k, thumbV.snapshot(EX[job.id], thumbPhase(EX[job.id])));
      $$(`img[data-thumb="${job.id}"]`).forEach(i => { i.src = thumbCache.get(k); i.classList.add('on'); });
    } catch (err) { console.warn('vignette', job.id, err); }
    setTimeout(next, 16);
  };
  next();
}
function refreshThumbs() { $$('img[data-thumb]').forEach(i => { i.classList.remove('on'); wantThumb(i.dataset.thumb, i); }); }
const thumbImg = id => `<img data-thumb="${id}" alt="" loading="lazy">`;
function hydrateThumbs(root) { $$('img[data-thumb]', root).forEach(i => wantThumb(i.dataset.thumb, i)); }

// ---------- petits morceaux ----------
const level = n => `<span class="lv" aria-label="Niveau ${n} sur 3">${[1, 2, 3].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`;
const zoneTags = zs => `<span class="tags">${zs.map(z => `<span class="tag" style="--c:${ZONES[z].c}">${ZONES[z].nom}</span>`).join('')}</span>`;
function dose(b) { return b.sec ? `${b.sec} s` : `${b.reps} rép.`; }

// ---------- ACCUEIL ----------
let heroV = null;
function renderHome() {
  $('#objs').innerHTML = Object.entries(OBJECTIFS).map(([id, o]) => `
    <button class="obj" data-obj="${id}" style="--c:${o.c}" aria-pressed="${S.objectif === id}">
      <span class="ic" aria-hidden="true">${o.icone}</span><span><b>${o.nom}</b><small>${o.texte}</small></span>
    </button>`).join('');
  $$('#lieux button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lieu === S.lieu)));
  let reco = PROGRAMMES.filter(p => p.objectif === S.objectif && p.lieu === S.lieu);
  const autres = PROGRAMMES.filter(p => p.objectif === S.objectif && !reco.includes(p));
  if (!reco.length) reco = PROGRAMMES.filter(p => p.lieu === S.lieu).slice(0, 2);
  $('#reco').innerHTML = [...reco, ...autres].slice(0, 3).map(progCard).join('');
}
$('#objs').addEventListener('click', e => { const b = e.target.closest('[data-obj]'); if (!b) return; S.objectif = b.dataset.obj; save(); renderHome(); heroCycle(true); });
$('#lieux').addEventListener('click', e => { const b = e.target.closest('[data-lieu]'); if (!b) return; S.lieu = b.dataset.lieu; save(); renderHome(); heroCycle(true); });

let heroI = 0, heroTimer = 0;
function heroCycle(reset) {
  if (!heroV) return;
  const list = EXERCICES.filter(e => e.lieu.includes(S.lieu) && (S.objectif !== 'masse' || e.type === 'reps'));
  if (reset) heroI = 0;
  const ex = list[heroI % list.length];
  heroI++;
  heroV.setExercise(ex);
  $('#hero-name').textContent = ex.nom;
  clearTimeout(heroTimer);
  heroTimer = setTimeout(() => heroCycle(false), 7000);
}

function renderHomeStats() {
  const st = statsData();
  $('#home-stats').innerHTML = [
    ['Séances faites', st.n, 'var(--lime)'], ['Minutes de sport', st.min, 'var(--cyan)'], ['Calories brûlées', st.kcal, 'var(--amber)'], ['Jours d\'affilée', st.serie, 'var(--pink)'],
  ].map(([t, v, c]) => `<div class="stat" style="--c:${c}"><small>${t}</small><b>${v}</b></div>`).join('');
}

// ---------- EXERCICES ----------
const F = { lieu: 'tout', zone: null, q: '' };
function renderFilters() {
  $$('#f-lieu button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.f === F.lieu)));
  $('#f-zones').innerHTML = Object.entries(ZONES).map(([id, z]) => `<button class="chip" data-z="${id}" style="--c:${z.c}" aria-pressed="${F.zone === id}">${z.nom}</button>`).join('');
}
function renderExercices() {
  const q = F.q.trim().toLowerCase();
  const list = EXERCICES.filter(e => (F.lieu === 'tout' || e.lieu.includes(F.lieu)) && (!F.zone || e.zones.includes(F.zone)) && (!q || e.nom.toLowerCase().includes(q)));
  $('#ex-grid').innerHTML = list.length ? list.map(e => `
    <button class="ex" data-ex="${e.id}">
      <span class="th">${thumbImg(e.id)}${level(e.niveau)}</span>
      <span class="in"><b>${esc(e.nom)}</b>${zoneTags(e.zones)}<small class="muted">${e.lieu.map(l => LIEU[l]).join(' · ')}</small></span>
    </button>`).join('') : '<p class="empty">Aucun exercice ne correspond. Essaie un autre filtre.</p>';
  hydrateThumbs($('#ex-grid'));
}
$('#f-lieu').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; F.lieu = b.dataset.f; renderFilters(); renderExercices(); });
$('#f-zones').addEventListener('click', e => { const b = e.target.closest('[data-z]'); if (!b) return; F.zone = F.zone === b.dataset.z ? null : b.dataset.z; renderFilters(); renderExercices(); });
$('#f-q').addEventListener('input', e => { F.q = e.target.value; renderExercices(); });
document.addEventListener('click', e => { const b = e.target.closest('[data-ex]'); if (b) openExercise(b.dataset.ex); });

// ---------- FICHE EXERCICE ----------
let detailV = null;
const dlg = $('#ex-dialog');
function openExercise(id) {
  const e = EX[id];
  if (!e) return;
  $('#ex-txt').innerHTML = `
    <p class="eyebrow">${e.lieu.map(l => LIEU[l]).join(' · ')} · ${esc(e.materiel)}</p>
    <h2 id="ex-title">${esc(e.nom)}</h2>
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">${zoneTags(e.zones)} ${level(e.niveau)}</div>
    <h3>Comment faire</h3><ol>${e.etapes.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <h3>Les bons réflexes</h3><ul class="ok">${e.conseils.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
    <h3>À éviter</h3><ul class="ko">${e.erreurs.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
    <h3>À ton niveau</h3>
    <div class="vari"><div><b style="color:var(--lime)">Plus facile</b>${esc(e.facile)}</div><div><b style="color:var(--blue)">Plus dur</b>${esc(e.dur)}</div></div>`;
  if (!dlg.open) dlg.showModal();
  if (!detailV) detailV = new Viewer($('#ex-canvas'), { look: S.look });
  detailV.speed = +$('#ex-speed').value;
  detailV.setView('trois');
  detailV.setExercise(e);
  detailV.resize();
  detailV.start();
  $('.sheet-txt').scrollTop = 0;
}
$('#ex-close').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
$('.views').addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (b && detailV) detailV.setView(b.dataset.view); });
$('#ex-speed').addEventListener('input', e => { if (detailV) detailV.speed = +e.target.value; });

// ---------- PROGRAMMES ----------
let pFiltre = 'tout';
function progDone(p) { const d = S.progres[p.id] || {}; return Object.keys(d).length; }
function progCard(p) {
  const o = OBJECTIFS[p.objectif];
  const total = p.semaines * p.seances.length;
  const pct = Math.round(progDone(p) / total * 100);
  return `<button class="prog" data-prog="${p.id}" style="--c:${o.c}">
    <span class="big-ic" aria-hidden="true">${o.icone}</span>
    <span class="pill c">${o.nom}</span>
    <h3>${esc(p.nom)}</h3>
    <p>${esc(p.texte)}</p>
    <span class="meta"><span class="pill">${p.lieu === 'maison' ? '🏠 Maison' : '🏋️ Salle'}</span><span class="pill">${p.semaines} semaines</span><span class="pill">${p.parSemaine} séances / sem.</span>${level(p.niveau)}</span>
    <span class="bar" aria-label="Avancement ${pct} %"><i style="width:${pct}%"></i></span>
  </button>`;
}
function renderProgrammes() {
  $('#p-filtre').innerHTML = [['tout', 'Tous']].concat(Object.entries(OBJECTIFS).map(([k, o]) => [k, o.nom])).map(([k, n]) => `<button data-pf="${k}" aria-pressed="${pFiltre === k}">${n}</button>`).join('');
  $('#prog-grid').innerHTML = PROGRAMMES.filter(p => pFiltre === 'tout' || p.objectif === pFiltre).map(progCard).join('');
}
$('#p-filtre').addEventListener('click', e => { const b = e.target.closest('[data-pf]'); if (!b) return; pFiltre = b.dataset.pf; renderProgrammes(); });
document.addEventListener('click', e => { const b = e.target.closest('[data-prog]'); if (b) openProgram(b.dataset.prog); });

let curProg = null;
function openProgram(id, push = true) {
  const p = PROGRAMMES.find(x => x.id === id);
  if (!p) return;
  curProg = p;
  renderProgram();
  go('programme', false);
  if (push) history.pushState(null, '', '#programme/' + id);
}
function renderProgram() {
  const p = curProg, o = OBJECTIFS[p.objectif];
  const w = S.semaine[p.id] || 1;
  const done = S.progres[p.id] || {};
  $('#v-programme').innerHTML = `
    <button class="back" data-go="programmes">← Tous les programmes</button>
    <div class="prog-head" style="--c:${o.c}">
      <div><span class="pill c">${o.icone} ${o.nom}</span> <span class="pill">${p.lieu === 'maison' ? '🏠 Maison' : '🏋️ Salle'}</span>
        <h1 style="margin-top:8px">${esc(p.nom)}</h1><p>${esc(p.texte)}</p></div>
      <div><p class="mini" style="margin:0 0 8px">Semaine</p><div class="weeks" id="weeks">${Array.from({ length: p.semaines }, (_, i) => `<button data-w="${i + 1}" aria-pressed="${w === i + 1}">S${i + 1}</button>`).join('')}</div></div>
    </div>
    <div class="seances">${p.seances.map((s, i) => {
      const fait = done[`${w}-${i}`];
      const tours = toursSemaine(s, w);
      const blocs = s.blocs.map(b => progression(b, w, s));
      const minutes = Math.round(estimeMinutes(s, blocs, tours));
      return `<article class="card seance ${fait ? 'done' : ''}">
        <div class="seance-top"><div><p class="fmt">Séance ${i + 1} · ${s.format === 'circuit' ? `Circuit × ${tours} tours` : 'Séries'} · ~${minutes} min</p><h3>${esc(s.nom)}</h3></div>${fait ? '<span class="check">✓ Faite</span>' : ''}</div>
        <ul class="blocs">${blocs.map(b => `<li>${thumbImg(b.ex)}<button data-ex="${b.ex}">${esc(EX[b.ex].nom)}</button><span class="dose">${s.format === 'series' ? `${b.series} × ` : ''}${dose(b)}</span></li>`).join('')}</ul>
        <button class="btn" data-start="${i}">▶ Lancer la séance</button>
      </article>`;
    }).join('')}</div>
    <p class="note">Chaque séance commence par 2 minutes d'échauffement. Laisse au moins un jour de repos entre deux séances qui travaillent les mêmes muscles. Arrête-toi si tu as mal (une douleur, pas juste la fatigue).</p>`;
  hydrateThumbs($('#v-programme'));
}
function estimeMinutes(s, blocs, tours) {
  const t = b => b.sec || (b.reps * 3);
  let sec = 150;
  if (s.format === 'circuit') sec += tours * (blocs.reduce((a, b) => a + t(b) + s.repos, 0) + s.reposTour);
  else sec += blocs.reduce((a, b) => a + b.series * (t(b) + (b.repos ?? s.repos)), 0);
  return sec / 60;
}
$('#v-programme').addEventListener('click', e => {
  const w = e.target.closest('[data-w]');
  if (w) { S.semaine[curProg.id] = +w.dataset.w; save(); renderProgram(); return; }
  const st = e.target.closest('[data-start]');
  if (st) startSession(curProg, +st.dataset.start, S.semaine[curProg.id] || 1);
});

// ---------- LECTEUR DE SÉANCE ----------
let playerV = null;
const P = { steps: [], i: 0, left: 0, timer: 0, paused: false, start: 0, kcal: 0, stepStart: 0 };

function buildSteps(prog, sIdx, week) {
  const s = prog.seances[sIdx];
  const steps = [];
  ECHAUFFEMENT.forEach((b, i) => {
    steps.push({ kind: 'work', ...b, label: `Échauffement ${i + 1}/${ECHAUFFEMENT.length}` });
    steps.push({ kind: 'rest', sec: i === ECHAUFFEMENT.length - 1 ? 20 : 8 });
  });
  const blocs = s.blocs.map(b => progression(b, week, s));
  if (s.format === 'circuit') {
    const tours = toursSemaine(s, week);
    for (let t = 1; t <= tours; t++) {
      blocs.forEach((b, j) => {
        steps.push({ kind: 'work', ...b, label: `Tour ${t}/${tours} · exercice ${j + 1}/${blocs.length}` });
        const last = j === blocs.length - 1;
        if (!(last && t === tours)) steps.push({ kind: 'rest', sec: last ? s.reposTour : s.repos });
      });
    }
  } else {
    blocs.forEach((b, j) => {
      for (let k = 1; k <= b.series; k++) {
        steps.push({ kind: 'work', ...b, label: `Exercice ${j + 1}/${blocs.length} · série ${k}/${b.series}` });
        if (!(j === blocs.length - 1 && k === b.series)) steps.push({ kind: 'rest', sec: b.repos ?? s.repos });
      }
    });
  }
  // chaque repos sait quel exercice vient ensuite
  steps.forEach((st, i) => { if (st.kind === 'rest') st.next = steps.slice(i + 1).find(x => x.kind === 'work'); });
  return steps;
}

function startSession(prog, sIdx, week) {
  Object.assign(P, { prog, sIdx, week, steps: buildSteps(prog, sIdx, week), i: 0, paused: false, start: Date.now(), kcal: 0, active: 0 });
  $('#player').hidden = false;
  $('#pl-end').hidden = true;
  document.body.style.overflow = 'hidden';
  if (!playerV) {
    playerV = new Viewer($('#pl-canvas'), { look: S.look });
    playerV.onCycle = n => updateCount(n);
  }
  playerV.setLook(S.look);
  playerV.resize();
  $('#pl-voice').setAttribute('aria-pressed', String(S.voix));
  unlockAudio();
  say(`C'est parti pour ${prog.seances[sIdx].nom}. On commence par l'échauffement.`);
  showStep();
}

function poids() { return (S.poids.length ? S.poids[S.poids.length - 1].kg : S.nutri.poids) || 70; }

function showStep() {
  clearInterval(P.timer);
  const st = P.steps[P.i];
  if (!st) return finish();
  P.stepStart = Date.now();
  $('#pl-bar').style.width = `${Math.round(P.i / P.steps.length * 100)}%`;
  const isRest = st.kind === 'rest';
  const ex = EX[isRest ? st.next.ex : st.ex];
  playerV.setPaused(false);
  playerV.speed = isRest ? 0.6 : 1;
  playerV.setExercise(ex);
  playerV.start();
  $('#pl-phase').textContent = isRest ? 'REPOS' : 'À TOI';
  $('#pl-phase').classList.toggle('rest', isRest);
  $('#pl-label').textContent = isRest ? 'Prochain exercice' : st.label;
  $('#pl-name').textContent = ex.nom;
  $('#pl-tips').innerHTML = (isRest ? ex.etapes.slice(0, 2) : ex.conseils).map(t => `<li>${esc(t)}</li>`).join('');
  $('#pl-count').textContent = '';
  const nextWork = P.steps.slice(P.i + 1).find(x => x.kind === 'work');
  $('#pl-after').textContent = isRest ? '' : nextWork ? `Ensuite : ${EX[nextWork.ex].nom}` : 'Dernier effort !';
  const dz = $('#pl-dose');
  dz.classList.toggle('rest', isRest);
  if (isRest) {
    P.left = st.sec;
    $('#pl-next').textContent = 'Passer le repos ⏭';
    $('#pl-skip').hidden = true;
    say(`Repos. Ensuite : ${ex.nom}.`);
    tick();
  } else if (st.sec) {
    P.left = st.sec;
    $('#pl-next').textContent = 'Fini ✓';
    $('#pl-skip').hidden = false;
    say(`${ex.nom}, ${st.sec} secondes.`);
    tick();
  } else {
    dz.innerHTML = `${st.reps}<small>répétitions</small>`;
    $('#pl-next').textContent = 'Fait ✓';
    $('#pl-skip').hidden = false;
    say(`${ex.nom}, ${st.reps} répétitions${ex.reps2 ? ', en alternant' : ''}.`);
    P.left = 0;
  }
  if (P.left) P.timer = setInterval(() => { if (!P.paused) { P.left--; tick(); } }, 1000);
}

function tick() {
  const st = P.steps[P.i];
  $('#pl-dose').innerHTML = `${P.left}<small>${st.kind === 'rest' ? 's de repos' : 'secondes'}</small>`;
  if (P.left <= 3 && P.left > 0) beep(660, 0.09);
  if (P.left <= 0) { beep(990, 0.25); nextStep(); }
}

function updateCount(n) {
  const st = P.steps[P.i];
  if (!st || st.kind !== 'work' || !st.reps) return;
  const ex = EX[st.ex];
  const per = ex.reps2 ? 2 : 1;
  const c = Math.min(st.reps, n * per);
  $('#pl-count').textContent = c >= st.reps ? `Jack a fini ses ${st.reps} : à toi d'appuyer sur « Fait » quand tu as fini.` : `Rythme de Jack : ${c} / ${st.reps}`;
}

function account() {
  const st = P.steps[P.i];
  if (!st) return;
  const sec = (Date.now() - P.stepStart) / 1000;
  const met = st.kind === 'rest' ? 1.8 : EX[st.ex].met;
  P.kcal += met * 3.5 * poids() / 200 * (sec / 60);
  if (st.kind === 'work') P.active += sec;
}

function nextStep() { account(); clearInterval(P.timer); P.i++; P.paused = false; $('#pl-pause').textContent = '⏸ Pause'; showStep(); }

function finish() {
  clearInterval(P.timer);
  $('#pl-bar').style.width = '100%';
  const min = Math.max(1, Math.round((Date.now() - P.start) / 60000));
  const kcal = Math.round(P.kcal);
  const s = P.prog.seances[P.sIdx];
  S.historique.push({ date: new Date().toISOString(), prog: P.prog.id, nom: P.prog.nom, seance: s.nom, semaine: P.week, min, kcal });
  S.progres[P.prog.id] = { ...(S.progres[P.prog.id] || {}), [`${P.week}-${P.sIdx}`]: true };
  save();
  say('Bravo ! Séance terminée.');
  playerV.setPaused(true);
  $('#pl-end').innerHTML = `<div class="card">
    <p class="eyebrow">SÉANCE TERMINÉE</p><h2>Bravo, champion${S.look === 'fille' ? 'ne' : ''} !</h2>
    <p class="muted">${esc(s.nom)} · ${esc(P.prog.nom)} · semaine ${P.week}</p>
    <div class="big-n"><div><b>${min}</b>minutes</div><div><b>${kcal}</b>kcal environ</div></div>
    <p><span class="letsgo">LET'S GO</span></p>
    <button class="btn big" id="pl-close">Terminer</button></div>`;
  $('#pl-end').hidden = false;
  $('#pl-close').focus();
}

function closePlayer() {
  clearInterval(P.timer);
  if (window.speechSynthesis) speechSynthesis.cancel();
  $('#player').hidden = true;
  document.body.style.overflow = '';
  if (curProg) renderProgram();
  renderHomeStats();
}

$('#pl-next').addEventListener('click', nextStep);
$('#pl-skip').addEventListener('click', nextStep);
$('#pl-pause').addEventListener('click', () => {
  P.paused = !P.paused;
  playerV.setPaused(P.paused);
  $('#pl-pause').textContent = P.paused ? '▶ Reprendre' : '⏸ Pause';
});
$('#pl-quit').addEventListener('click', () => { if (!$('#pl-end').hidden || confirm('Arrêter la séance ? Elle ne sera pas comptée.')) closePlayer(); });
$('#pl-voice').addEventListener('click', () => { S.voix = !S.voix; save(); $('#pl-voice').setAttribute('aria-pressed', String(S.voix)); $('#pl-voice').textContent = S.voix ? '🔊 Voix' : '🔇 Voix'; if (!S.voix && window.speechSynthesis) speechSynthesis.cancel(); });
$('#player').addEventListener('click', e => { if (e.target.id === 'pl-close') closePlayer(); });
document.addEventListener('keydown', e => {
  if ($('#player').hidden || e.target.closest('input,select,textarea')) return;
  if (e.key === ' ') { e.preventDefault(); $('#pl-pause').click(); }
  if (e.key === 'Enter' && $('#pl-end').hidden && document.activeElement?.tagName !== 'BUTTON') { e.preventDefault(); nextStep(); }
  if (e.key === 'Escape') { e.preventDefault(); $('#pl-quit').click(); }
});

// voix et bips
let voice = null;
function pickVoice() { if (!window.speechSynthesis) return; voice = speechSynthesis.getVoices().find(v => /^fr/i.test(v.lang)) || null; }
if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function say(text) {
  if (!S.voix || !window.speechSynthesis) return;
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'fr-FR'; if (voice) u.voice = voice; u.rate = 1.05; speechSynthesis.speak(u); } catch { /* pas de voix */ }
}
let ac = null;
function unlockAudio() { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); } catch { ac = null; } }
function beep(f, d) {
  if (!ac) return;
  const o = ac.createOscillator(), g = ac.createGain();
  o.frequency.value = f; o.type = 'sine';
  g.gain.setValueAtTime(0.0001, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.25, ac.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d);
  o.connect(g).connect(ac.destination);
  o.start(); o.stop(ac.currentTime + d + 0.02);
}

// ---------- ALIMENTATION ----------
let nTab = null;
function calc(n, sexe, obj) {
  const bmr = 10 * n.poids + 6.25 * n.taille - 5 * n.age + (sexe === 'fille' ? -161 : 5);
  const tdee = bmr * n.act;
  let k = tdee;
  const notes = [];
  const jeune = n.age < 18;
  if (obj === 'minceur') {
    if (jeune) { notes.push('Moins de 18 ans : pas de régime. Ton corps grandit encore : mange à ta faim, équilibré, et bouge. Si ton poids t\'inquiète, parles-en à un médecin.'); }
    else {
      k = tdee * 0.82;
      const plancher = sexe === 'fille' ? 1300 : 1600;
      if (k < plancher) { k = plancher; notes.push('On ne descend pas plus bas : manger moins que ça est mauvais pour la santé et fait perdre du muscle.'); }
    }
  } else if (obj === 'masse') k = tdee * 1.12;
  else if (obj === 'tonus' && !jeune) k = tdee * 0.95;
  k = Math.round(k / 10) * 10;
  const prot = Math.round(n.poids * (obj === 'masse' || obj === 'minceur' ? 1.8 : 1.5));
  const lip = Math.round(k * 0.28 / 9);
  const glu = Math.max(0, Math.round((k - prot * 4 - lip * 9) / 4));
  const eau = (n.poids * 0.035 + 0.5).toFixed(1).replace('.', ',');
  return { tdee: Math.round(tdee / 10) * 10, k, prot, lip, glu, eau, notes };
}
function renderNutri() {
  const n = S.nutri;
  $$('#n-sexe [data-look]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.look === S.look)));
  const r = calc(n, S.look, nTab || S.objectif);
  const tot = r.prot * 4 + r.lip * 9 + r.glu * 4 || 1;
  const o = OBJECTIFS[nTab || S.objectif];
  $('#n-result').innerHTML = `
    <h2>Ce dont tu as besoin chaque jour</h2>
    <div class="kcal">
      <div class="kbox"><small>Pour garder ton poids</small><b>${r.tdee}</b> kcal</div>
      <div class="kbox main"><small>Objectif ${o.nom.toLowerCase()}</small><b>${r.k}</b> kcal</div>
      <div class="kbox"><small>Eau</small><b>${r.eau}</b> litres</div>
    </div>
    <div class="macro" aria-hidden="true"><i style="width:${r.prot * 4 / tot * 100}%;background:var(--lime)"></i><i style="width:${r.glu * 4 / tot * 100}%;background:var(--blue)"></i><i style="width:${r.lip * 9 / tot * 100}%;background:var(--amber)"></i></div>
    <div class="mleg"><span style="--c:var(--lime)">Protéines <b>${r.prot} g</b></span><span style="--c:var(--blue)">Glucides <b>${r.glu} g</b></span><span style="--c:var(--amber)">Lipides <b>${r.lip} g</b></span></div>
    ${r.notes.map(t => `<p class="warn">${esc(t)}</p>`).join('')}
    <p class="muted" style="font-size:14px">C'est une estimation (formule de Mifflin-St Jeor). Suis ton poids 2 à 3 semaines et ajuste de 100 à 200 kcal si besoin.</p>`;
  const t = nTab || S.objectif;
  $('#n-tabs').innerHTML = Object.entries(OBJECTIFS).map(([k, ob]) => `<button role="tab" data-nt="${k}" aria-selected="${t === k}">${ob.icone} ${ob.nom}</button>`).join('');
  const N = NUTRITION[t];
  $('#n-conseils').innerHTML = `<div class="cons" style="--c:${OBJECTIFS[t].c}">
    <div class="card"><h2>${esc(N.titre)}</h2><ul>${N.regles.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
    <div class="card"><h2>Idées de repas</h2><div class="meals">${Object.entries(N.repas).map(([m, l]) => `<div class="meal"><b>${m}</b>${l.map(x => `<p>${esc(x)}</p>`).join('')}</div>`).join('')}</div></div>
  </div>`;
}
function initNutri() {
  $('#n-act').innerHTML = ACTIVITE.map(a => `<option value="${a.v}">${a.nom}</option>`).join('');
  $('#n-obj').innerHTML = Object.entries(OBJECTIFS).map(([k, o]) => `<option value="${k}">${o.nom}</option>`).join('');
  const n = S.nutri;
  $('#n-age').value = n.age; $('#n-poids').value = n.poids; $('#n-taille').value = n.taille; $('#n-act').value = String(n.act); $('#n-obj').value = S.objectif;
  $('#calc').addEventListener('input', () => {
    const num = (id, min, max, d) => { const v = parseFloat($(id).value); return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : d; };
    S.nutri = { age: num('#n-age', 14, 90, 25), poids: num('#n-poids', 35, 200, 70), taille: num('#n-taille', 130, 220, 175), act: +$('#n-act').value };
    nTab = $('#n-obj').value;
    save();
    renderNutri();
  });
  $('#calc').addEventListener('submit', e => e.preventDefault());
  $('#n-tabs').addEventListener('click', e => { const b = e.target.closest('[data-nt]'); if (!b) return; nTab = b.dataset.nt; $('#n-obj').value = nTab; renderNutri(); });
  $('#prot').innerHTML = ALIMENTS_PROTEINES.map(([a, g]) => `<div><span>${esc(a)}</span><b>${g} g</b></div>`).join('');
}

// ---------- SUIVI ----------
const dayKey = d => { const x = new Date(d); return `${x.getFullYear()}-${x.getMonth() + 1}-${x.getDate()}`; };
function statsData() {
  const h = S.historique;
  const jours = new Set(h.map(x => dayKey(x.date)));
  let serie = 0;
  const d = new Date();
  if (!jours.has(dayKey(d))) d.setDate(d.getDate() - 1);
  while (jours.has(dayKey(d))) { serie++; d.setDate(d.getDate() - 1); }
  return { n: h.length, min: h.reduce((a, x) => a + x.min, 0), kcal: h.reduce((a, x) => a + x.kcal, 0), serie, jours };
}
function renderSuivi() {
  const st = statsData();
  $('#stats').innerHTML = [
    ['Séances', st.n, 'var(--lime)'], ['Minutes', st.min, 'var(--blue)'], ['Calories', st.kcal, 'var(--amber)'], ['Jours d\'affilée', st.serie, 'var(--pink)'],
  ].map(([t, v, c]) => `<div class="stat" style="--c:${c}"><small>${t}</small><b>${v}</b></div>`).join('');
  const J = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  $('#days').innerHTML = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - 13 + i);
    const on = st.jours.has(dayKey(d));
    return `<div class="day ${on ? 'on' : ''} ${i === 13 ? 'today' : ''}" title="${d.toLocaleDateString('fr-FR')}">${J[d.getDay()]}${d.getDate()}</div>`;
  }).join('');
  $('#histo').innerHTML = S.historique.length ? S.historique.slice().reverse().slice(0, 40).map(x => `<li><span><b>${esc(x.seance)}</b><br><small>${esc(x.nom)} · ${new Date(x.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</small></span><span>${x.min} min<br><small>${x.kcal} kcal</small></span></li>`).join('') : '<li><span class="muted">Pas encore de séance. Lance-toi depuis un programme !</span></li>';
  renderChart();
}
function renderChart() {
  const pts = S.poids.slice(-20);
  if (pts.length < 2) { $('#poids-chart').innerHTML = `<p class="muted">${pts.length ? `Dernier poids : ${pts[0].kg} kg. ` : ''}Note ton poids une fois par semaine, à la même heure, pour voir ta courbe.</p>`; return; }
  const W = 520, H = 200, pad = 30;
  const ks = pts.map(p => p.kg);
  const lo = Math.min(...ks) - 1, hi = Math.max(...ks) + 1;
  const x = i => pad + i * (W - pad * 2) / (pts.length - 1);
  const y = v => H - pad - (v - lo) / (hi - lo) * (H - pad * 2);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.kg).toFixed(1)}`).join(' ');
  $('#poids-chart').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Courbe de poids, de ${ks[0]} à ${ks[ks.length - 1]} kilos">
    <defs><linearGradient id="pg" x1="0" x2="1"><stop offset="0" stop-color="#7cff00"/><stop offset="1" stop-color="#00c8ff"/></linearGradient></defs>
    <line x1="${pad}" x2="${W - pad}" y1="${H - pad}" y2="${H - pad}" stroke="#1d3350"/>
    <text x="${pad}" y="16" fill="#9aa8bb" font-size="12">${hi.toFixed(1)} kg</text><text x="${pad}" y="${H - 8}" fill="#9aa8bb" font-size="12">${lo.toFixed(1)} kg</text>
    <path d="${d}" fill="none" stroke="url(#pg)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    ${pts.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.kg)}" r="4" fill="#040912" stroke="#7cff00" stroke-width="2"><title>${new Date(p.date).toLocaleDateString('fr-FR')} : ${p.kg} kg</title></circle>`).join('')}
    <text x="${x(pts.length - 1)}" y="${y(ks[ks.length - 1]) - 10}" fill="#fff" font-size="13" font-weight="700" text-anchor="end">${ks[ks.length - 1]} kg</text>
  </svg>`;
}
$('#poids-form').addEventListener('submit', e => {
  e.preventDefault();
  const kg = parseFloat($('#poids-in').value);
  if (!(kg >= 30 && kg <= 250)) return;
  S.poids.push({ date: new Date().toISOString(), kg: Math.round(kg * 10) / 10 });
  S.nutri.poids = kg;
  save();
  $('#poids-in').value = '';
  renderChart();
});

// ---------- démarrage ----------
function boot() {
  $$('[data-look]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.look === S.look)));
  renderHome();
  renderFilters();
  renderExercices();
  renderProgrammes();
  initNutri();
  renderNutri();
  try {
    heroV = new Viewer($('#hero-canvas'), { look: S.look, spin: true });
    heroCycle(true);
    heroV.start();
  } catch (err) {
    console.error(err);
    $('.hero-3d').insertAdjacentHTML('beforeend', '<p class="warn" style="position:absolute;inset:auto 16px 60px">La 3D ne marche pas sur ce navigateur. Essaie avec Edge ou Chrome à jour.</p>');
  }
  const h = location.hash.slice(1);
  if (h.startsWith('programme/')) openProgram(h.split('/')[1], false);
  else go(h || 'accueil', false);
  window.addEventListener('jacksport-wake', () => [heroV, detailV, playerV].forEach(v => v && v.start()));
}
boot();
