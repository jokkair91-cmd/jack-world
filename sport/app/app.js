// JACK SPORT : l'appli (écrans, séances guidées, alimentation, suivi).
import { Viewer } from './mannequin.js';
import { EXERCICES, EX, ZONES, PROGRAMMES, OBJECTIFS, ECHAUFFEMENT, progression, toursSemaine, NUTRITION, ACTIVITE, ALIMENTS_PROTEINES } from './data.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const LIEU = { maison: 'Maison', salle: 'Salle' };

// ---------- mémoire (dans le navigateur seulement) ----------
const KEY = 'jacksport.v1';
const defaults = () => ({ look: 'garcon', objectif: 'minceur', lieu: 'maison', historique: [], poids: [], progres: {}, semaine: {}, nutri: { age: 25, poids: 70, taille: 175, act: 1.375 }, voix: true, musique: true });
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
  pickVoice();
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

// ---------- LE COACH QUI PARLE : voix du navigateur + sous-titres à l'écran ----------
// Les phrases passent les unes après les autres (pas de coupure), avec une limite de temps :
// un chiffre du compte qui arrive trop tard est sauté, une explication trop longue n'est pas commencée.
const pick = a => a[Math.floor(Math.random() * a.length)];
const minus = s => (s ? s[0].toLowerCase() + s.slice(1) : '');
const est = t => 500 + String(t).length * 78; // durée parlée estimée (ms), un peu large pour ne jamais couper le décompte
let voice = null;
const VOIX_H = /henri|remy|rémy|paul|thomas|claude|jacques|daniel|antoine|mathieu|nicolas|guillaume|yves|jean|gérard|gerard|fabrice|alain|homme|male/i;
const VOIX_F = /denise|vivienne|eloise|éloise|julie|hortense|amelie|amélie|aurelie|aurélie|marie|audrey|celine|céline|charlotte|brigitte|josephine|coralie|femme|female/i;
function pickVoice() {
  if (!window.speechSynthesis) return;
  const want = S.look === 'fille' ? VOIX_F : VOIX_H;
  const score = v => (/^fr[-_]fr/i.test(v.lang) ? 3 : 1) + (/natural|online|neural|premium|enhanced|amélioré/i.test(v.name) ? 4 : 0) + (/google/i.test(v.name) ? 2 : 0) + (want.test(v.name) ? 3 : 0);
  voice = speechSynthesis.getVoices().filter(v => /^fr/i.test(v.lang)).sort((a, b) => score(b) - score(a))[0] || null;
}
if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

const Coach = (() => {
  let q = [], cur = null, timer = 0, fadeT = 0, gen = 0, lastCancel = 0;
  let T = { box: null, viewer: null, onEmpty: null };
  function show(it) {
    const b = T.box;
    if (!b) return;
    clearTimeout(fadeT);
    b.hidden = false;
    b.querySelector('p').textContent = it.text;
    b.dataset.kind = it.kind || '';
    b.classList.remove('fade', 'pop');
    void b.offsetWidth;
    b.classList.add('pop', 'talk');
  }
  function quiet() {
    if (T.viewer) T.viewer.talking = false;
    Music.duck(false);
    const b = T.box;
    if (!b) return;
    b.classList.remove('talk');
    clearTimeout(fadeT);
    fadeT = setTimeout(() => b.classList.add('fade'), 4000);
  }
  function done(it, g) {
    if (cur !== it || g !== gen) return;
    clearTimeout(timer);
    cur = null;
    quiet();
    next();
    if (!cur && !q.length && T.onEmpty) T.onEmpty();
  }
  function next() {
    if (cur) return;
    const wait = lastCancel + 140 - Date.now(); // laisser la voix se taire avant de reparler
    if (wait > 0) { clearTimeout(timer); timer = setTimeout(next, wait); return; }
    let it;
    while ((it = q.shift())) {
      const now = Date.now();
      if (it.ttl && now > it.ttl) continue;
      if (it.by && now + est(it.say || it.text) > it.by) continue;
      break;
    }
    if (!it) return;
    cur = it;
    const g = gen;
    show(it);
    if (it.onstart) it.onstart();
    if (T.viewer) T.viewer.talking = true;
    if (S.voix && window.speechSynthesis) {
      try {
        const u = new SpeechSynthesisUtterance(it.say || it.text);
        u.lang = voice ? voice.lang : 'fr-FR';
        if (voice) u.voice = voice;
        // ton de coach : plus rapide et plus énergique, les chiffres et les « allez » claquent
        const punchy = it.kind === 'count' || /!\s*$/.test(it.say || it.text);
        u.rate = it.kind === 'count' ? 1.18 : punchy ? 1.12 : 1.06;
        u.pitch = punchy ? 1.12 : 1.02;
        u.volume = 1;
        Music.duck(true);
        u.onend = u.onerror = () => done(it, g);
        it.u = u; // garder une référence, sinon Chrome peut perdre la fin de la phrase
        speechSynthesis.speak(u);
        timer = setTimeout(() => done(it, g), est(it.say || it.text) * 1.8 + 2500); // filet de sécurité
        return;
      } catch { /* pas de voix : les sous-titres suffisent */ }
    }
    timer = setTimeout(() => done(it, g), est(it.text));
  }
  return {
    attach(box, viewer, onEmpty = null) {
      if (T.box && T.box !== box) { this.stop(); T.box.hidden = true; }
      T = { box, viewer, onEmpty };
    },
    get box() { return T.box; },
    get busy() { return !!cur || q.length > 0; },
    say(text, o = {}) {
      if (!text) return;
      if (o.urgent) this.stop();
      const it = { text: String(text), say: o.say, kind: o.kind, onstart: o.onstart, ttl: o.ttl ? Date.now() + o.ttl : 0, by: o.by || 0 };
      if (o.front) q.unshift(it); else q.push(it);
      next();
    },
    stop() {
      gen++;
      q = [];
      clearTimeout(timer);
      const was = cur;
      cur = null;
      if (window.speechSynthesis && (speechSynthesis.speaking || speechSynthesis.pending)) {
        try { speechSynthesis.cancel(); } catch { /* rien */ }
        lastCancel = Date.now();
      }
      if (was) quiet();
    },
    hush() { this.stop(); if (T.box) T.box.hidden = true; },
  };
})();

// bips du décompte
let ac = null;
function unlockAudio() { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); } catch { ac = null; } }
function beep(f, d) {
  if (!ac) return;
  const o = ac.createOscillator(), g = ac.createGain();
  o.frequency.value = f; o.type = 'sine';
  g.gain.setValueAtTime(0.0001, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.18, ac.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d);
  o.connect(g).connect(ac.destination);
  o.start(); o.stop(ac.currentTime + d + 0.02);
}

// ---------- MUSIQUE DE SPORT : un morceau électro original, joué en direct par le navigateur ----------
// 126 BPM, grosse caisse, clap, charleston, basse et accords (la mineur : Am F C G).
// Elle baisse quand le coach parle et s'adoucit pendant les repos.
const Music = (() => {
  const BPM = 126, STEP = 60 / BPM / 4;
  const CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]; // notes MIDI
  const BASS = [45, 41, 36, 43];
  const hz = n => 440 * Math.pow(2, (n - 69) / 12);
  let out = null, filt = null, noise = null, timer = 0, step = 0, nextT = 0, on = false, ducked = false, soft = false;
  function setup() {
    if (out || !ac) return !!out;
    out = ac.createGain(); out.gain.value = 0;
    filt = ac.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 18000;
    out.connect(filt).connect(ac.destination);
    noise = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return true;
  }
  function env(g, t, peak, dec) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + dec); }
  function kick(t) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    env(g, t, 0.95, 0.34); o.connect(g).connect(out); o.start(t); o.stop(t + 0.36);
  }
  function hiss(t, type, f, peak, dec) {
    const s = ac.createBufferSource(), b = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noise; b.type = type; b.frequency.value = f;
    env(g, t, peak, dec); s.connect(b).connect(g).connect(out); s.start(t); s.stop(t + dec + 0.02);
  }
  function tone(t, n, type, peak, dec, cut) {
    const o = ac.createOscillator(), b = ac.createBiquadFilter(), g = ac.createGain();
    o.type = type; o.frequency.value = hz(n); b.type = 'lowpass'; b.frequency.value = cut;
    env(g, t, peak, dec); o.connect(b).connect(g).connect(out); o.start(t); o.stop(t + dec + 0.02);
  }
  function play(t, s) {
    const bar = Math.floor(s / 16) % 4, i = s % 16, ch = CHORDS[bar];
    if (i % 4 === 0) kick(t);
    if (i === 4 || i === 12) hiss(t, 'bandpass', 1700, 0.35, 0.16);
    if (i % 2 === 0) hiss(t, 'highpass', 8000, i % 4 === 2 ? 0.16 : 0.07, i % 4 === 2 ? 0.09 : 0.03);
    if (i % 4 === 2 || i === 15) tone(t, BASS[bar] + (i === 15 ? 12 : 0), 'sawtooth', 0.28, STEP * 1.8, 420);
    if (i === 0 || i === 6 || i === 10) ch.forEach(n => tone(t, n + 12, 'sawtooth', 0.06, STEP * 2.6, 2200));
    if (Math.floor(s / 64) % 2 === 1 && i % 2 === 1) tone(t, ch[(i >> 1) % 3] + 24, 'square', 0.035, STEP * 0.9, 3000); // arpège un tour sur deux
  }
  function sched() {
    while (nextT < ac.currentTime + 0.15) { play(nextT, step++); nextT += STEP; }
  }
  function level() {
    if (!out) return;
    const v = !on ? 0 : ducked ? 0.1 : soft ? 0.2 : 0.32;
    out.gain.cancelScheduledValues(ac.currentTime);
    out.gain.setTargetAtTime(v, ac.currentTime, ducked ? 0.08 : 0.35);
    filt.frequency.setTargetAtTime(soft ? 900 : 18000, ac.currentTime, 0.4);
  }
  return {
    start() {
      if (!S.musique || !setup()) return;
      if (!on) { on = true; step = 0; nextT = ac.currentTime + 0.08; clearInterval(timer); timer = setInterval(sched, 25); }
      level();
    },
    stop() { on = false; level(); clearInterval(timer); timer = 0; },
    duck(d) { ducked = d; level(); },
    rest(r) { soft = r; level(); },
  };
})();

// ---------- FICHE EXERCICE ----------
let detailV = null;
let sheetEx = null;
const dlg = $('#ex-dialog');
function openExercise(id) {
  const e = EX[id];
  if (!e) return;
  sheetEx = e;
  sheetCoachStop();
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
  // le coach explique tout de suite comment faire (si la voix est activée)
  if (S.voix) setTimeout(() => { if (dlg.open && sheetEx === e && !(Coach.box === $('#ex-say') && Coach.busy)) $('#ex-coach').click(); }, 450);
}
$('#ex-close').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
$('.views').addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (b && detailV) detailV.setView(b.dataset.view); });
$('#ex-speed').addEventListener('input', e => { if (detailV) detailV.speed = +e.target.value; });

// « Le coach t'explique » : il montre le mouvement et lit chaque étape (l'étape lue s'allume)
function sheetCoachReset() {
  $$('#ex-txt li.now').forEach(l => l.classList.remove('now'));
  setTimeout(() => { if (!(Coach.box === $('#ex-say') && Coach.busy)) $('#ex-say').hidden = true; }, 4500);
  const b = $('#ex-coach');
  b.textContent = '🔊 Le coach t\'explique';
  b.setAttribute('aria-pressed', 'false');
}
function sheetCoachStop() {
  if (Coach.box === $('#ex-say')) Coach.hush();
  sheetCoachReset();
}
$('#ex-coach').addEventListener('click', () => {
  const e = sheetEx;
  if (!e || !detailV) return;
  if (Coach.box === $('#ex-say') && Coach.busy) return sheetCoachStop();
  Coach.attach($('#ex-say'), detailV, sheetCoachReset);
  const b = $('#ex-coach');
  b.textContent = '⏹ Arrêter';
  b.setAttribute('aria-pressed', 'true');
  const lis = $$('#ex-txt ol li');
  const mark = i => () => {
    lis.forEach((l, j) => l.classList.toggle('now', j === i));
    if (lis[i]) lis[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };
  Coach.say(`${e.nom}. Regarde-moi bien, je te montre.`, { urgent: true });
  e.etapes.forEach((t, i) => Coach.say(`${i + 1}. ${t}`, { say: t, onstart: mark(i) }));
  Coach.say(`Les bons réflexes : ${e.conseils.join(' ')}`, { onstart: mark(-1) });
  Coach.say(`À éviter : ${e.erreurs.map(minus).join(' Et ')}`);
  Coach.say('À toi de jouer !');
});
dlg.addEventListener('close', sheetCoachStop);

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

// ---------- LECTEUR DE SÉANCE : le coach fait chaque exercice avec toi et te guide à la voix ----------
let playerV = null;
const P = { steps: [], i: 0, left: 0, timer: 0, paused: false, start: 0, kcal: 0, stepStart: 0, cues: {}, explained: new Set() };
const BRAVO = ['Bien joué !', 'Super travail !', 'Excellent !', 'Bravo !', 'Très bien !', 'Parfait !'];
const COURAGE = ['Continue comme ça !', 'Tu gères !', 'Lâche rien !', 'Garde le rythme !', 'Allez, allez !', 'Tu fais ça très bien !'];
const PARTI = ["C'est parti !", 'Go !', 'Allez, on y va !'];
// la fête de fin : bras en l'air et petits sauts de joie
const FETE = { id: 'fete', nom: 'Bravo', zones: [], anim: { dur: 0.9, hold: 0.06, frames: [{ shA: 140, el: -28, hip: -16, knee: 28, head: -6 }, { shA: 166, el: -6, lift: 0.15, head: -12 }] } };
const doseText = (w, ex) => (w.sec ? `${w.sec} secondes` : `${w.reps} répétitions${ex.reps2 ? ', en alternant les côtés' : ''}`);
function cue(at, text, o = {}) { (P.cues[at] ||= []).push({ ...o, text }); }
function countdown() { for (const n of [3, 2, 1]) cue(n, String(n), { urgent: true, kind: 'count' }); }
function buildSteps(prog, sIdx, week) {
  const s = prog.seances[sIdx];
  const steps = [{ kind: 'rest', sec: 18, intro: true }]; // le coach se présente et explique le premier exercice
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
  Object.assign(P, { prog, sIdx, week, steps: buildSteps(prog, sIdx, week), i: 0, paused: false, start: Date.now(), kcal: 0, active: 0, skipped: false, explained: new Set() });
  $('#player').hidden = false;
  $('#player').classList.remove('done');
  $('#pl-end').hidden = true;
  $('#pl-pause').textContent = '⏸ Pause';
  document.body.style.overflow = 'hidden';
  if (!playerV) {
    playerV = new Viewer($('#pl-canvas'), { look: S.look });
    playerV.onBeat = n => onBeat(n);
  }
  playerV.setLook(S.look);
  playerV.setView('trois');
  playerV.resize();
  setVoiceBtn();
  pickVoice();
  unlockAudio();
  setMusicBtn();
  Music.start();
  Coach.attach($('#pl-coach'), playerV);
  showStep();
}

function poids() { return (S.poids.length ? S.poids[S.poids.length - 1].kg : S.nutri.poids) || 70; }

function showStep() {
  clearInterval(P.timer);
  const st = P.steps[P.i];
  if (!st) return finish();
  P.stepStart = Date.now();
  P.cues = {};
  $('#pl-bar').style.width = `${Math.round(P.i / P.steps.length * 100)}%`;
  const isRest = st.kind === 'rest';
  const ex = EX[isRest ? st.next.ex : st.ex];
  const prev = P.steps[P.i - 1];
  playerV.setPaused(false);
  playerV.speed = isRest ? 0.6 : 1; // pendant le repos, le coach montre le prochain exercice au ralenti
  Music.rest(isRest);
  playerV.setExercise(ex);
  playerV.start();
  $('#pl-phase').textContent = st.intro ? 'PRÊT ?' : isRest ? 'REPOS' : 'À TOI';
  $('#pl-phase').classList.toggle('rest', isRest);
  $('#pl-label').textContent = st.intro ? 'Premier exercice' : isRest ? 'Prochain exercice' : st.label;
  $('#pl-name').textContent = ex.nom;
  $('#pl-tips').innerHTML = (isRest ? ex.etapes.slice(0, 2) : ex.conseils).map(t => `<li>${esc(t)}</li>`).join('');
  $('#pl-count').textContent = isRest ? 'Regarde le coach : il te montre le mouvement.' : '';
  const nextWork = P.steps.slice(P.i + 1).find(x => x.kind === 'work');
  $('#pl-after').textContent = isRest ? `Au programme : ${doseText(st.next, ex)}` : nextWork ? `Ensuite : ${EX[nextWork.ex].nom}` : 'Dernier effort !';
  $('#pl-next').classList.remove('pulse');
  const dz = $('#pl-dose');
  dz.classList.toggle('rest', isRest);
  if (isRest) {
    P.left = st.sec;
    $('#pl-next').textContent = st.intro ? 'Je suis prêt ⏭' : 'Passer le repos ⏭';
    $('#pl-skip').hidden = true;
    scriptRest(st, ex, prev);
    tick(true);
  } else if (st.sec) {
    P.left = st.sec;
    $('#pl-next').textContent = 'Fini ✓';
    $('#pl-skip').hidden = false;
    scriptTimed(st, ex);
    tick(true);
  } else {
    P.left = 0;
    dz.innerHTML = `0<small>/ ${st.reps} répétitions</small>`;
    $('#pl-next').textContent = 'Fait ✓';
    $('#pl-skip').hidden = false;
    $('#pl-count').textContent = 'Suis le rythme du coach : il compte avec toi.';
    Coach.say(`${pick(['Go !', 'Allez !', "C'est parti !"])} ${st.reps} répétitions.`, { urgent: true });
  }
  if (!isRest) bigCount('GO !');
  if (P.left) P.timer = setInterval(() => { if (!P.paused) { P.left--; tick(); } }, 1000);
}

/** Repos : bravo, annonce du prochain exercice, puis explication du mouvement pendant que le coach le montre. */
function scriptRest(st, ex, prev) {
  const w = st.next;
  const by = Date.now() + (st.sec - 3.6) * 1000; // tout doit être dit avant le décompte
  const works = P.steps.filter(x => x.kind === 'work');
  if (st.intro) {
    Coach.say('Salut ! Je suis ton coach : je fais chaque exercice avec toi.', { urgent: true });
    Coach.say(`On commence par l'échauffement : ${minus(ex.nom)}, ${doseText(w, ex)}.`, { by });
  } else {
    const tour = /Tour (\d+)\/(\d+) · exercice 1\//.exec(w.label || '');
    const serie = /série (\d+)\/(\d+)/.exec(w.label || '');
    let t = prev && prev.kind === 'work' ? (P.skipped ? 'OK, on passe.' : pick(BRAVO)) : '';
    if (st.sec >= 15) t += ' Repos, respire.';
    if (tour && +tour[1] > 1) t += ` Tour ${tour[1]} sur ${tour[2]}${tour[1] === tour[2] ? ', le dernier !' : '.'}`;
    t += ` Ensuite : ${minus(ex.nom)}${serie && +serie[2] > 1 ? `, série ${serie[1]} sur ${serie[2]}` : ''}, ${doseText(w, ex)}.`;
    Coach.say(t.trim(), { urgent: true });
    if (w === works[works.length - 1]) Coach.say("C'est le dernier exercice, donne tout !", { by });
  }
  P.skipped = false;
  if (P.explained.has(ex.id)) {
    // déjà expliqué dans cette séance : juste un rappel
    if (ex.conseils[0]) Coach.say(`Rappel : ${minus(ex.conseils[0])}`, { by });
    if (ex.erreurs && ex.erreurs[0]) Coach.say(`Évite ça : ${minus(ex.erreurs[0])}`, { by });
  } else {
    ex.etapes.slice(0, 3).forEach((l, i) => Coach.say(l, { by, onstart: i ? null : () => P.explained.add(ex.id) }));
    if (ex.conseils[0]) Coach.say(ex.conseils[0], { by });
  }
  if (st.sec >= 20) cue(10, 'Prépare-toi, on reprend dans 10 secondes.', { front: true, ttl: 2500 });
  countdown();
}

/** Effort chronométré : consignes de placement, mi-parcours, encouragements, 10 dernières secondes, 3-2-1. */
function scriptTimed(st, ex) {
  const n = st.sec;
  Coach.say(`${pick(PARTI)} ${n} secondes.`, { urgent: true });
  const plan = [
    [n - 4, ex.conseils[0]],
    n >= 20 && [10, 'Plus que 10 secondes, tiens bon !'],
    n >= 24 && [Math.round(n / 2), `La moitié ! ${pick(COURAGE)}`],
    n >= 40 && [Math.round(n * 0.75), ex.erreurs && ex.erreurs[0] && `Attention : ${minus(ex.erreurs[0])}`],
    n >= 30 && [Math.round(n / 2) - 5, ex.conseils[1]],
    n >= 50 && [Math.round(n / 4) + 7, pick(COURAGE)],
  ].filter(x => x && x[1]).sort((a, b) => b[0] - a[0]);
  let last = Infinity;
  for (const [at, text] of plan) {
    if (at <= 4 || at >= n || last - at < 5) continue;
    cue(at, text);
    last = at;
  }
  countdown();
}

/** Répétitions : le coach compte à voix haute à chaque mouvement qu'il termine. */
function onBeat(n) {
  const st = P.steps[P.i];
  if (!st || st.kind !== 'work' || !st.reps || n > st.reps || !$('#pl-end').hidden) return;
  $('#pl-dose').innerHTML = `${n}<small>/ ${st.reps} répétitions</small>`;
  let t = String(n);
  if (n === st.reps) t = `${n} ! Bravo !`;
  else if (n === st.reps - 1) t = `${n}, dernière !`;
  else if (n === st.reps - 2 && st.reps >= 6) t = `${n}, encore deux !`;
  else if (n === Math.round(st.reps / 2) && st.reps >= 8) t = `${n}, la moitié !`;
  Coach.say(t, { ttl: 2000, kind: 'count' });
  if (n === st.reps) {
    $('#pl-count').textContent = 'Le coach a fini. Termine tes répétitions, puis appuie sur « Fait ».';
    $('#pl-next').classList.add('pulse');
    Coach.say('Termine à ton rythme, puis appuie sur Fait.', { ttl: 4000 });
  } else {
    $('#pl-count').textContent = `Le coach compte avec toi : ${n} / ${st.reps}`;
  }
}

function tick(first) {
  const st = P.steps[P.i];
  $('#pl-dose').innerHTML = `${P.left}<small>${st.kind === 'rest' ? 's de repos' : P.left > 1 ? 'secondes' : 'seconde'}</small>`;
  if (first) return;
  for (const c of P.cues[P.left] || []) Coach.say(c.text, { ...c, by: c.urgent ? 0 : Date.now() + (P.left - 3.5) * 1000 });
  if (P.left <= 3 && P.left > 0) { beep(660, 0.08); bigCount(P.left); }
  if (P.left <= 0) { beep(990, 0.22); nextStep(); }
}

let goT = 0;
function bigCount(v) {
  const g = $('#pl-go');
  g.textContent = v;
  g.classList.remove('show');
  void g.offsetWidth;
  g.classList.add('show');
  clearTimeout(goT);
  goT = setTimeout(() => g.classList.remove('show'), 950);
}

function confetti() {
  const box = document.createElement('div');
  box.className = 'confetti';
  box.setAttribute('aria-hidden', 'true');
  const C = ['#7cff00', '#00c8ff', '#fbbf24', '#f472b6', '#a78bfa', '#ffffff'];
  for (let i = 0; i < 48; i++) {
    const c = document.createElement('i');
    c.style.cssText = `left:${Math.random() * 100}%;background:${C[i % C.length]};--dx:${Math.round((Math.random() - 0.5) * 180)}px;--r:${Math.round((Math.random() - 0.5) * 900)}deg;animation-duration:${(2.2 + Math.random() * 1.8).toFixed(2)}s;animation-delay:${(Math.random() * 0.7).toFixed(2)}s`;
    box.appendChild(c);
  }
  $('.pl-3d').appendChild(box);
  setTimeout(() => box.remove(), 5200);
}

function account() {
  const st = P.steps[P.i];
  if (!st) return;
  const sec = (Date.now() - P.stepStart) / 1000;
  const met = st.kind === 'rest' ? 1.8 : EX[st.ex].met;
  P.kcal += met * 3.5 * poids() / 200 * (sec / 60);
  if (st.kind === 'work') P.active += sec;
}

function nextStep(skip) { account(); clearInterval(P.timer); P.skipped = !!skip; P.i++; P.paused = false; $('#pl-pause').textContent = '⏸ Pause'; showStep(); }

function finish() {
  clearInterval(P.timer);
  $('#pl-bar').style.width = '100%';
  const min = Math.max(1, Math.round((Date.now() - P.start) / 60000));
  const kcal = Math.round(P.kcal);
  const s = P.prog.seances[P.sIdx];
  S.historique.push({ date: new Date().toISOString(), prog: P.prog.id, nom: P.prog.nom, seance: s.nom, semaine: P.week, min, kcal });
  S.progres[P.prog.id] = { ...(S.progres[P.prog.id] || {}), [`${P.week}-${P.sIdx}`]: true };
  save();
  // le coach fait la fête avec toi
  playerV.setPaused(false);
  playerV.speed = 1;
  playerV.setExercise(FETE);
  playerV.setView('face');
  $('#pl-phase').textContent = 'BRAVO !';
  $('#pl-phase').classList.remove('rest');
  $('#player').classList.add('done');
  $('#pl-go').classList.remove('show');
  confetti();
  Coach.say(`Et voilà, séance terminée ! ${min} minute${min > 1 ? 's' : ''} d'effort${kcal >= 5 ? `, environ ${kcal} calories` : ''}.`, { urgent: true });
  Coach.say(`${pick(['Je suis fier de toi.', 'Tu as tout donné, respect.', 'Quelle séance !'])} À la prochaine !`);
  $('#pl-end').innerHTML = `<div class="card">
    <p class="eyebrow">SÉANCE TERMINÉE</p><h2>Bravo, champion${S.look === 'fille' ? 'ne' : ''} !</h2>
    <p class="muted">${esc(s.nom)} · ${esc(P.prog.nom)} · semaine ${P.week}</p>
    <div class="big-n"><div><b>${min}</b>minute${min > 1 ? 's' : ''}</div><div><b>${kcal}</b>kcal environ</div></div>
    <p><span class="letsgo">LET'S GO</span></p>
    <button class="btn big" id="pl-close">Terminer</button></div>`;
  $('#pl-end').hidden = false;
  $('#pl-close').focus();
}

function closePlayer() {
  clearInterval(P.timer);
  Coach.hush();
  Music.stop();
  $('#pl-go').classList.remove('show');
  $('#player').hidden = true;
  document.body.style.overflow = '';
  if (curProg) renderProgram();
  renderHomeStats();
}

$('#pl-next').addEventListener('click', () => nextStep());
$('#pl-skip').addEventListener('click', () => nextStep(true));
$('#pl-pause').addEventListener('click', () => {
  if (!$('#pl-end').hidden) return;
  P.paused = !P.paused;
  playerV.setPaused(P.paused);
  $('#pl-pause').textContent = P.paused ? '▶ Reprendre' : '⏸ Pause';
  Coach.say(P.paused ? 'Pause. Je t\'attends : reprends quand tu veux.' : "C'est reparti !", { urgent: true });
});
$('#pl-quit').addEventListener('click', () => { if (!$('#pl-end').hidden || confirm('Arrêter la séance ? Elle ne sera pas comptée.')) closePlayer(); });
function setMusicBtn() { const b = $('#pl-music'); b.setAttribute('aria-pressed', String(S.musique)); b.textContent = S.musique ? '🎵 Musique' : '🔇 Musique'; }
$('#pl-music').addEventListener('click', () => {
  S.musique = !S.musique;
  save();
  setMusicBtn();
  if (S.musique) { unlockAudio(); Music.start(); } else Music.stop();
});
function setVoiceBtn() { const b = $('#pl-voice'); b.setAttribute('aria-pressed', String(S.voix)); b.textContent = S.voix ? '🔊 Voix' : '🔇 Voix'; }
$('#pl-voice').addEventListener('click', () => {
  S.voix = !S.voix;
  save();
  setVoiceBtn();
  if (!S.voix) { try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch { /* rien */ } }
  else Coach.say('Voix activée.', { urgent: true });
});
$('#player').addEventListener('click', e => { if (e.target.id === 'pl-close') closePlayer(); });
document.addEventListener('keydown', e => {
  if ($('#player').hidden || e.target.closest('input,select,textarea')) return;
  if (e.key === ' ') { e.preventDefault(); $('#pl-pause').click(); }
  if (e.key === 'Enter' && $('#pl-end').hidden && document.activeElement?.tagName !== 'BUTTON') { e.preventDefault(); nextStep(); }
  if (e.key === 'Escape') { e.preventDefault(); $('#pl-quit').click(); }
});

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
