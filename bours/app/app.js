/* Jack Bours : la logique de l'application (écrans, quiz, cartes, simulateur). */
(function () {
  const N = window.JB_NIVEAUX, MISSIONS = window.JB_MISSIONS, M = window.JB_MARCHE, G = window.JB_GRAPH;
  const CLE_P = "jackbours-progression-v1", CLE_S = "jackbours-simulateur-v1";
  const CAPITAL = 10000, FRAIS_TAUX = 0.001, FRAIS_MIN = 1, SPREAD = 0.0005, REUSSITE = 70;
  const INTERVALLES = [0, 0, 1, 3, 7, 15, 30]; // jours avant de revoir une carte, selon sa boîte (1 à 6)

  /* ---------- stockage ---------- */
  function lire(cle) { try { return JSON.parse(localStorage.getItem(cle)); } catch (e) { return null; } }
  function ecrire(cle, v) { try { localStorage.setItem(cle, JSON.stringify(v)); } catch (e) { } }
  function nouvelleProgression() { return { prenom: "", quiz: {}, tests: {}, lues: {}, cartes: {}, missions: {}, reglages: { voix: true, theme: "sombre", libre: false } }; }
  function nouveauSimulateur() {
    const m = M.creer();
    return { m, cash: CAPITAL, positions: {}, ordres: [], histo: [], debut: m.jour, valeurs: [{ jour: m.jour, total: CAPITAL, indice: m.indice[m.indice.length - 1].c }], dividendes: 0, frais: 0, nextId: 1, selection: "ARA", vue: { n: 60, mm20: false, mm50: false, volume: true }, krach: null };
  }
  let P = Object.assign(nouvelleProgression(), lire(CLE_P) || {});
  P.reglages = Object.assign(nouvelleProgression().reglages, P.reglages || {});
  let S = lire(CLE_S);
  if (!S || !S.m || !S.m.indice) S = nouveauSimulateur();
  const sauverP = () => ecrire(CLE_P, P), sauverS = () => ecrire(CLE_S, S);

  /* ---------- outils ---------- */
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const nb = (x, d = 2) => Number(x).toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
  const eur = (x, d = 2) => nb(x, d) + " €";
  const pct = (x, d = 2) => (x > 0 ? "+" : "") + nb(x, d) + " %";
  const signe = x => x > 0.0001 ? "hausse" : x < -0.0001 ? "baisse" : "";
  const r2 = x => Math.round(x * 100) / 100;
  function melanger(t) { t = t.slice(); for (let i = t.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [t[i], t[j]] = [t[j], t[i]]; } return t; }
  const datesCache = [];
  function dateJour(j, longue) {
    if (!datesCache[j]) datesCache[j] = M.date(j);
    const d = datesCache[j];
    return longue ? d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long", year: "numeric" }) : d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  }
  function toast(html, type) {
    const t = document.createElement("div"); t.className = "toast " + (type || ""); t.innerHTML = html;
    $("#toasts").appendChild(t); setTimeout(() => t.classList.add("part"), 3800); setTimeout(() => t.remove(), 4300);
  }
  function jack(html, classe) { return `<div class="jack ${classe || ""}"><img src="images/icone.svg" alt="" class="jack-avatar"><div class="jack-bulle"><b>Jack</b><div>${html}</div></div></div>`; }

  /* ---------- voix ---------- */
  let voixFr = null;
  function chargerVoix() {
    if (!("speechSynthesis" in window)) return;
    const v = speechSynthesis.getVoices();
    voixFr = v.find(x => /^fr[-_]FR/i.test(x.lang) && /Google|Microsoft|Denise|Henri|Natural/i.test(x.name)) || v.find(x => /^fr/i.test(x.lang)) || null;
  }
  if ("speechSynthesis" in window) { chargerVoix(); speechSynthesis.onvoiceschanged = chargerVoix; }
  function parler(txt, force) {
    if (!("speechSynthesis" in window) || (!force && !P.reglages.voix)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt.replace(/<[^>]+>/g, "")); u.lang = "fr-FR"; if (voixFr) u.voice = voixFr; u.rate = 1;
    speechSynthesis.speak(u);
  }
  const taire = () => { if ("speechSynthesis" in window) speechSynthesis.cancel(); };

  /* ---------- thème ---------- */
  function appliquerTheme() {
    const t = P.reglages.theme;
    const clair = t === "clair" || (t === "auto" && window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches);
    document.documentElement.dataset.theme = clair ? "light" : "dark";
  }
  appliquerTheme();
  if (window.matchMedia) matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => { appliquerTheme(); route(); });

  /* ---------- progression ---------- */
  const niveauIndex = id => N.findIndex(n => n.id === id);
  const trouverLecon = (nid, lid) => { const n = N.find(x => x.id === nid); return n ? { n, l: n.lecons.find(x => x.id === lid) } : {}; };
  const leconReussie = l => (P.quiz[l.id] || 0) >= REUSSITE;
  function niveauDebloque(i) { return P.reglages.libre || i === 0 || (P.tests[N[i - 1].id] || 0) >= REUSSITE; }
  function avancementNiveau(n) { return Math.round(n.lecons.filter(leconReussie).length / n.lecons.length * 100); }
  function prochaineLecon() {
    for (let i = 0; i < N.length; i++) {
      if (!niveauDebloque(i)) return null;
      const l = N[i].lecons.find(x => !leconReussie(x));
      if (l) return { n: N[i], l };
      if ((P.tests[N[i].id] || 0) < REUSSITE) return { n: N[i], test: true };
    }
    return null;
  }

  /* ---------- cartes mémoire ---------- */
  function toutesLesCartes() {
    const t = [];
    N.forEach(n => n.lecons.forEach(l => l.cartes.forEach((c, i) => t.push({ cle: l.id + "|" + i, r: c.r, v: c.v, lecon: l, niveau: n }))));
    return t;
  }
  function cartesActives() { return toutesLesCartes().filter(c => P.lues[c.lecon.id]); }
  function cartesDues() { const now = Date.now(); return cartesActives().filter(c => !P.cartes[c.cle] || P.cartes[c.cle].prochaine <= now); }

  /* ---------- missions ---------- */
  function reussirMission(id) {
    if (P.missions[id]) return;
    const m = MISSIONS.find(x => x.id === id); if (!m) return;
    P.missions[id] = Date.now(); sauverP();
    toast(`🏅 <b>Mission réussie :</b> ${esc(m.titre)}`, "or");
    parler("Bravo ! Mission réussie : " + m.titre);
  }
  function verifierMissions() {
    const secteurs = new Set(Object.keys(S.positions).filter(s => s !== "JB10").map(s => M.info(s).secteur));
    if (secteurs.size >= 3) reussirMission("diversifier");
    if (S.m.jour - S.debut >= 60) {
      const v = S.valeurs[S.valeurs.length - 1], v0 = S.valeurs[0];
      if (v.total / CAPITAL > v.indice / v0.indice) reussirMission("battre-indice");
    }
  }

  /* ---------- navigation ---------- */
  const NAV = [["accueil", "🏠", "Accueil"], ["apprendre", "📚", "Apprendre"], ["cartes", "🃏", "Réviser"], ["simulateur", "📈", "Simulateur"], ["glossaire", "🔎", "Glossaire"], ["reglages", "⚙️", "Réglages"]];
  function majNav(v) {
    const actif = ["lecon", "quiz", "test"].includes(v) ? "apprendre" : v;
    $$(".nav a").forEach(a => a.classList.toggle("on", a.dataset.v === actif));
  }
  function route() {
    arreterAuto(); taire();
    const h = location.hash.replace(/^#\/?/, "").split("/").map(decodeURIComponent);
    const v = h[0] || "accueil";
    majNav(v);
    const vue = $("#vue");
    vue.className = "vue vue-" + v;
    ({ accueil: vueAccueil, apprendre: vueApprendre, lecon: () => vueLecon(h[1], h[2]), quiz: () => vueQuiz("lecon", h[1], h[2]), test: () => vueQuiz("test", h[1]), cartes: vueCartes, glossaire: vueGlossaire, simulateur: vueSimulateur, reglages: vueReglages }[v] || vueAccueil)(vue);
    window.scrollTo(0, 0);
  }

  /* ================= ACCUEIL ================= */
  function totalPortefeuille() { return S.cash + Object.entries(S.positions).reduce((s, [sym, p]) => s + p.qte * M.prix(S.m, sym), 0); }
  function perfIndice() { const v0 = S.valeurs[0].indice, now = S.m.indice[S.m.indice.length - 1].c; return (now / v0 - 1) * 100; }

  function vueAccueil(vue) {
    const suite = prochaineLecon(), dues = cartesDues().length, total = totalPortefeuille(), perf = (total / CAPITAL - 1) * 100, pi = perfIndice();
    const astuces = []; N.forEach(n => n.lecons.forEach(l => { if (P.lues[l.id]) l.retenir.forEach(r => astuces.push(r)); }));
    const astuce = astuces.length ? astuces[Math.floor(Math.random() * astuces.length)] : "Ici, tout est fictif : l'argent, les entreprises et les prix. Tu peux te tromper autant que tu veux, c'est fait pour apprendre !";
    const nbM = Object.keys(P.missions).length;
    vue.innerHTML = `
      <section class="bienvenue">
        ${jack(`${P.prenom ? "Salut " + esc(P.prenom) + " !" : "Salut !"} ${suite ? "On continue ?" : "Tu as tout terminé, bravo !"}<br><span class="doux">💡 ${esc(astuce)}</span>`)}
      </section>
      <div class="grille-accueil">
        <section class="carte">
          <h2>📚 Ma progression</h2>
          <div class="niveaux-mini">${N.map((n, i) => `
            <a class="niveau-mini ${niveauDebloque(i) ? "" : "verrou"}" href="#/apprendre">
              <span class="em">${niveauDebloque(i) ? n.emoji : "🔒"}</span>
              <span class="nom">${esc(n.nom)}<small>${esc(n.sousTitre)}</small></span>
              <span class="barre"><span style="width:${avancementNiveau(n)}%"></span></span>
              <span class="val">${(P.tests[n.id] || 0) >= REUSSITE ? "✅" : avancementNiveau(n) + " %"}</span>
            </a>`).join("")}</div>
          ${suite ? `<a class="btn principal large" href="${suite.test ? "#/test/" + suite.n.id : "#/lecon/" + suite.n.id + "/" + suite.l.id}">▶ ${suite.test ? "Passer le test du niveau " + esc(suite.n.nom) : "Continuer : " + esc(suite.l.titre)}</a>` : ""}
        </section>
        <section class="carte">
          <h2>📈 Mon portefeuille fictif</h2>
          <div class="gros-chiffre">${eur(total)}</div>
          <div class="ligne-perf"><span class="${signe(perf)}">${pct(perf)}</span> pour moi · <span class="${signe(pi)}">${pct(pi)}</span> pour l'indice JUNGLE 10</div>
          <p class="doux">Départ : ${eur(CAPITAL, 0)} fictifs · ${Object.keys(S.positions).length} ligne(s) · ${dateJour(S.m.jour, true)}</p>
          <a class="btn principal large" href="#/simulateur">Ouvrir le simulateur</a>
        </section>
        <section class="carte">
          <h2>🃏 Cartes mémoire</h2>
          <div class="gros-chiffre">${dues}</div>
          <p class="doux">${cartesActives().length ? "carte(s) à réviser aujourd'hui sur " + cartesActives().length + " apprises." : "Les cartes apparaissent quand tu ouvres une leçon."}</p>
          <a class="btn ${dues ? "principal" : ""} large" href="#/cartes">${dues ? "Réviser maintenant" : "Voir les cartes"}</a>
        </section>
      </div>
      <section class="carte">
        <h2>🏅 Missions <span class="doux">${nbM} / ${MISSIONS.length}</span></h2>
        <div class="missions">${MISSIONS.map(m => `<div class="mission ${P.missions[m.id] ? "faite" : ""}"><span class="em">${P.missions[m.id] ? "✅" : m.emoji}</span><div><b>${esc(m.titre)}</b><small>${esc(m.texte)}</small></div></div>`).join("")}</div>
      </section>
      <p class="avertissement">Tout est fictif : argent, entreprises et prix. Jack Bours sert à apprendre, ce n'est pas un conseil en investissement.</p>`;
  }

  /* ================= APPRENDRE ================= */
  function vueApprendre(vue) {
    vue.innerHTML = `<h1>📚 Apprendre</h1>
      <p class="doux">5 niveaux. Pour débloquer le suivant, réussis le test de passage (7/10). Chaque leçon a son quiz : 70 % pour la valider.</p>
      ${N.map((n, i) => {
        const ok = niveauDebloque(i), t = P.tests[n.id];
        return `<section class="niveau carte ${ok ? "" : "verrou"}">
          <div class="niveau-tete"><span class="em">${ok ? n.emoji : "🔒"}</span><div><h2>Niveau ${i + 1} · ${esc(n.nom)}</h2><p class="doux">${esc(n.sousTitre)}</p></div>
            <div class="niveau-test">${ok ? `<a class="btn ${avancementNiveau(n) === 100 && !(t >= REUSSITE) ? "principal" : ""}" href="#/test/${n.id}">🎓 Test de passage${t != null ? " · " + Math.round(t / 10) + "/10" : ""}</a>` : `<span class="doux">Réussis le test du niveau ${i} pour débloquer</span>`}</div></div>
          <div class="lecons">${n.lecons.map(l => {
            const s = P.quiz[l.id];
            return `<a class="lecon-tuile ${ok ? "" : "inactif"}" ${ok ? `href="#/lecon/${n.id}/${l.id}"` : ""}>
              <span class="em">${l.emoji}</span><b>${esc(l.titre)}</b>
              <small>${s != null ? (s >= REUSSITE ? "✅ " : "🔁 ") + "Quiz : " + s + " %" : P.lues[l.id] ? "Lue · quiz à faire" : "Nouvelle"}</small></a>`;
          }).join("")}</div></section>`;
      }).join("")}`;
  }

  function illustration(l) {
    if (l.id !== "bougies") return "";
    return `<figure class="illus"><svg viewBox="0 0 420 220" role="img" aria-label="Anatomie d'une bougie verte et d'une bougie rouge">
      <g font-size="12" fill="var(--texte)" font-family="Nunito, sans-serif">
        <line x1="110" y1="20" x2="110" y2="200" stroke="var(--vert)" stroke-width="3"/><rect x="90" y="60" width="40" height="100" rx="3" fill="var(--vert)"/>
        <text x="140" y="24">Plus haut</text><text x="140" y="64">Clôture</text><text x="140" y="160">Ouverture</text><text x="140" y="203">Plus bas</text>
        <text x="20" y="114" fill="var(--doux)">Corps</text><text x="62" y="40" fill="var(--doux)">Mèche</text>
        <line x1="320" y1="20" x2="320" y2="200" stroke="var(--rouge)" stroke-width="3"/><rect x="300" y="60" width="40" height="100" rx="3" fill="var(--rouge)"/>
        <text x="350" y="24">Plus haut</text><text x="350" y="64">Ouverture</text><text x="350" y="160">Clôture</text><text x="350" y="203">Plus bas</text>
      </g></svg><figcaption>Verte : le prix a monté (clôture au-dessus de l'ouverture). Rouge : il a baissé.</figcaption></figure>`;
  }

  function vueLecon(nid, lid, vue = $("#vue")) {
    const { n, l } = trouverLecon(nid, lid);
    if (!l || !niveauDebloque(niveauIndex(nid))) { location.hash = "#/apprendre"; return; }
    if (!P.lues[l.id]) { P.lues[l.id] = Date.now(); sauverP(); }
    const idx = n.lecons.indexOf(l), prec = n.lecons[idx - 1], suiv = n.lecons[idx + 1];
    const mission = l.mission && MISSIONS.find(m => m.id === l.mission);
    vue.innerHTML = `
      <nav class="fil"><a href="#/apprendre">Apprendre</a> › ${n.emoji} ${esc(n.nom)} › ${esc(l.titre)}</nav>
      <article class="lecon carte">
        <h1><span class="em">${l.emoji}</span> ${esc(l.titre)}</h1>
        <div class="actions-voix"><button class="btn" id="ecouter">🔊 Jack m'explique</button><button class="btn discret" id="stop">⏹ Stop</button></div>
        ${l.texte.map(p => `<p>${esc(p)}</p>`).join("")}
        ${illustration(l)}
        <div class="retenir"><h3>📌 À retenir</h3><ul>${l.retenir.map(r => `<li>${esc(r)}</li>`).join("")}</ul></div>
        <h3>🃏 Cartes mémoire <small class="doux">(clique pour retourner)</small></h3>
        <div class="flips">${l.cartes.map(c => `<button class="flip"><span class="recto">${esc(c.r)}</span><span class="verso">${esc(c.v)}</span></button>`).join("")}</div>
        ${mission ? `<a class="mission-lien" href="#/simulateur">${mission.emoji} <b>À essayer dans le simulateur :</b> ${esc(mission.texte)} ${P.missions[mission.id] ? "✅" : "→"}</a>` : ""}
        <div class="bas-lecon">
          <a class="btn principal large" href="#/quiz/${n.id}/${l.id}">✏️ Faire le quiz (${l.quiz.length} questions)${P.quiz[l.id] != null ? " · meilleur : " + P.quiz[l.id] + " %" : ""}</a>
          <div class="prec-suiv">${prec ? `<a class="btn discret" href="#/lecon/${n.id}/${prec.id}">← ${esc(prec.titre)}</a>` : "<span></span>"}${suiv ? `<a class="btn discret" href="#/lecon/${n.id}/${suiv.id}">${esc(suiv.titre)} →</a>` : `<a class="btn discret" href="#/test/${n.id}">🎓 Test du niveau →</a>`}</div>
        </div>
      </article>`;
    $("#ecouter").onclick = () => parler(l.titre + ". " + l.texte.join(" ") + " À retenir : " + l.retenir.join(" "), true);
    $("#stop").onclick = taire;
    $$(".flip").forEach(b => b.onclick = () => b.classList.toggle("retournee"));
  }

  /* ================= QUIZ ET TESTS ================= */
  function preparer(q, l) { const ordre = melanger(q.c.map((_, i) => i)); return { q: q.q, c: ordre.map(i => q.c[i]), b: ordre.indexOf(q.b), p: q.p, l }; }
  function vueQuiz(mode, nid, lid, vue = $("#vue")) {
    let titre, questions, retour, cleScore;
    const ni = niveauIndex(nid), n = N[ni];
    if (!n || !niveauDebloque(ni)) { location.hash = "#/apprendre"; return; }
    if (mode === "lecon") {
      const l = n.lecons.find(x => x.id === lid); if (!l) { location.hash = "#/apprendre"; return; }
      titre = "Quiz · " + l.titre; questions = melanger(l.quiz).map(q => preparer(q, l)); retour = `#/lecon/${n.id}/${l.id}`; cleScore = l.id;
    } else {
      titre = "Test de passage · " + n.emoji + " " + n.nom;
      const tout = []; n.lecons.forEach(l => l.quiz.forEach(q => tout.push(preparer(q, l))));
      questions = melanger(tout).slice(0, 10); retour = "#/apprendre"; cleScore = n.id;
    }
    let i = 0, bons = 0;
    function afficher() {
      const q = questions[i];
      vue.innerHTML = `<nav class="fil"><a href="${retour}">← Retour</a></nav>
        <section class="quiz carte">
          <div class="quiz-tete"><h1>${esc(titre)}</h1><span class="doux">Question ${i + 1} / ${questions.length} · ${bons} bonne(s)</span></div>
          <div class="barre quiz-barre"><span style="width:${i / questions.length * 100}%"></span></div>
          ${mode === "test" ? `<p class="doux petit">Leçon : ${esc(q.l.titre)}</p>` : ""}
          <h2 class="question">${esc(q.q)}</h2>
          <div class="choix">${q.c.map((c, k) => `<button class="choix-btn" data-k="${k}">${esc(c)}</button>`).join("")}</div>
          <div id="explication"></div>
        </section>`;
      $$(".choix-btn").forEach(b => b.onclick = () => repondre(+b.dataset.k));
    }
    function repondre(k) {
      const q = questions[i], ok = k === q.b;
      if (ok) bons++;
      $$(".choix-btn").forEach(b => { b.disabled = true; const kk = +b.dataset.k; if (kk === q.b) b.classList.add("bon"); else if (kk === k) b.classList.add("faux"); });
      $("#explication").innerHTML = jack(`${ok ? "✅ Bonne réponse !" : "❌ Pas tout à fait. La bonne réponse : <b>" + esc(q.c[q.b]) + "</b>."}<br>${esc(q.p)}`, ok ? "ok" : "ko") +
        `<button class="btn principal large" id="suivant">${i + 1 < questions.length ? "Question suivante →" : "Voir mon score"}</button>`;
      if (!ok) parler("La bonne réponse : " + q.c[q.b] + ". " + q.p);
      $("#suivant").onclick = () => { taire(); i++; i < questions.length ? afficher() : fin(); };
      $("#suivant").focus();
    }
    function fin() {
      const score = Math.round(bons / questions.length * 100), reussi = score >= REUSSITE;
      const cible = mode === "lecon" ? P.quiz : P.tests, avant = cible[cleScore];
      if (avant == null || score > avant) cible[cleScore] = score;
      sauverP();
      const debloque = mode === "test" && reussi && N[ni + 1] && !(avant >= REUSSITE);
      let suite = "";
      if (mode === "lecon") {
        const l = n.lecons.find(x => x.id === lid), idx = n.lecons.indexOf(l), suiv = n.lecons[idx + 1];
        suite = reussi ? (suiv ? `<a class="btn principal large" href="#/lecon/${n.id}/${suiv.id}">Leçon suivante : ${esc(suiv.titre)} →</a>` : `<a class="btn principal large" href="#/test/${n.id}">🎓 Passer le test du niveau</a>`) : `<a class="btn principal large" href="${retour}">Relire la leçon</a>`;
      } else {
        suite = reussi ? (N[ni + 1] ? `<a class="btn principal large" href="#/apprendre">Découvrir le niveau ${esc(N[ni + 1].nom)} ${N[ni + 1].emoji}</a>` : `<a class="btn principal large" href="#/simulateur">Tout est validé ! Direction le simulateur</a>`) : `<a class="btn principal large" href="#/apprendre">Revoir les leçons</a>`;
      }
      const msg = reussi ? (debloque ? `🎉 Niveau ${esc(N[ni + 1].nom)} débloqué !` : "Bravo, c'est validé !") : `Il faut ${REUSSITE} % pour valider. Relis la leçon et réessaie, tu vas y arriver.`;
      vue.innerHTML = `<section class="quiz carte fin-quiz">
        <div class="score ${reussi ? "hausse" : "baisse"}">${bons} / ${questions.length}</div>
        ${jack(msg, reussi ? "ok" : "ko")}
        <div class="bas-lecon">${suite}<button class="btn" id="refaire">🔁 Recommencer</button></div></section>`;
      parler(reussi ? (debloque ? "Bravo ! Niveau " + N[ni + 1].nom + " débloqué !" : "Bravo, c'est validé !") : "Il faut 70 pour cent pour valider. Tu vas y arriver.");
      $("#refaire").onclick = () => vueQuiz(mode, nid, lid, vue);
    }
    afficher();
  }

  /* ================= CARTES MÉMOIRE ================= */
  function vueCartes(vue, toutes) {
    const actives = cartesActives(), file = melanger(toutes ? actives : cartesDues());
    if (!actives.length) { vue.innerHTML = `<h1>🃏 Réviser</h1>${jack("Ouvre une première leçon : ses cartes mémoire arriveront ici automatiquement.")}<a class="btn principal" href="#/apprendre">Aller aux leçons</a>`; return; }
    if (!file.length) {
      const prochaine = Math.min(...actives.map(c => P.cartes[c.cle] ? P.cartes[c.cle].prochaine : Date.now()));
      vue.innerHTML = `<h1>🃏 Réviser</h1>${jack(`Rien à réviser pour l'instant, tout est frais dans ta tête ! Prochaine révision : <b>${new Date(prochaine).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</b>.`)}
        ${boites(actives)}<button class="btn" id="toutes">Réviser quand même toutes les cartes (${actives.length})</button>`;
      $("#toutes").onclick = () => vueCartes(vue, true);
      return;
    }
    let i = 0, sues = 0;
    function afficher() {
      if (i >= file.length) { vue.innerHTML = `<h1>🃏 Réviser</h1>${jack(`Séance terminée : ${sues} / ${file.length} sues du premier coup. À demain !`, "ok")}${boites(actives)}<a class="btn principal" href="#/accueil">Retour à l'accueil</a>`; return; }
      const c = file[i];
      vue.innerHTML = `<h1>🃏 Réviser <span class="doux">${i + 1} / ${file.length}</span></h1>
        <div class="grande-carte" id="gc"><div class="gc-niveau">${c.niveau.emoji} ${esc(c.lecon.titre)}</div><div class="gc-recto">${esc(c.r)}</div><div class="gc-verso" hidden>${esc(c.v)}</div></div>
        <div class="boutons-carte" id="bc"><button class="btn principal large" id="retourner">Retourner la carte</button></div>
        <p class="doux petit centre">Les cartes sues reviennent de plus en plus tard (1, 3, 7, 15, 30 jours). Les autres reviennent vite.</p>`;
      $("#retourner").onclick = () => {
        $(".gc-verso").hidden = false; $("#gc").classList.add("retournee");
        $("#bc").innerHTML = `<button class="btn ko large" id="non">🔁 À revoir</button><button class="btn ok large" id="oui">✅ Je savais</button>`;
        $("#oui").onclick = () => noter(c, true); $("#non").onclick = () => noter(c, false);
      };
    }
    function noter(c, su) {
      const e = P.cartes[c.cle] || { boite: 1 };
      e.boite = su ? Math.min(6, e.boite + 1) : 1;
      e.prochaine = Date.now() + INTERVALLES[e.boite] * 86400000 - 3600000;
      P.cartes[c.cle] = e; sauverP();
      if (su) sues++;
      i++; afficher();
    }
    afficher();
  }
  function boites(actives) {
    const b = [0, 0, 0, 0, 0, 0];
    actives.forEach(c => b[((P.cartes[c.cle] || {}).boite || 1) - 1]++);
    return `<div class="boites">${b.map((n, i) => `<div class="boite"><b>${n}</b><small>Boîte ${i + 1}</small></div>`).join("")}</div>`;
  }

  /* ================= GLOSSAIRE ================= */
  function vueGlossaire(vue) {
    const tout = toutesLesCartes().sort((a, b) => a.r.localeCompare(b.r, "fr"));
    vue.innerHTML = `<h1>🔎 Glossaire</h1><input class="recherche" id="rech" type="search" placeholder="Chercher un mot : PER, dividende, bougie…" autocomplete="off"><div class="glossaire" id="gl"></div>`;
    const remplir = q => {
      const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
      const f = tout.filter(c => !q || norm(c.r + " " + c.v).includes(norm(q)));
      $("#gl").innerHTML = f.length ? f.map(c => `<div class="terme"><b>${esc(c.r)}</b><p>${esc(c.v)}</p><a href="#/lecon/${c.niveau.id}/${c.lecon.id}" class="doux petit">${c.niveau.emoji} ${esc(c.lecon.titre)}</a></div>`).join("") : `<p class="doux">Aucun mot trouvé.</p>`;
    };
    remplir(""); $("#rech").oninput = e => remplir(e.target.value);
  }

  /* ================= SIMULATEUR ================= */
  let auto = null, graph = null, courbe = null, sens = "achat";
  function arreterAuto() { if (auto) { clearInterval(auto); auto = null; } }
  const prixActuel = sym => sym === "INDICE" ? S.m.indice[S.m.indice.length - 1].c : M.prix(S.m, sym);
  const frais = montant => Math.max(FRAIS_MIN, montant * FRAIS_TAUX);

  function acheter(sym, qte, px, type) {
    const montant = qte * px, f = frais(montant);
    if (montant + f > S.cash + 1e-9) return false;
    S.cash -= montant + f; S.frais += f;
    const p = S.positions[sym] || { qte: 0, pru: 0 };
    p.pru = (p.pru * p.qte + montant + f) / (p.qte + qte); p.qte += qte; S.positions[sym] = p;
    S.histo.unshift({ jour: S.m.jour, sym, op: "achat", type, qte, prix: px, frais: f });
    reussirMission("premier-achat");
    if (sym === "JB10") reussirMission("acheter-etf");
    if (type === "limite") reussirMission("ordre-limite");
    return true;
  }
  function vendre(sym, qte, px, type) {
    const p = S.positions[sym]; qte = Math.min(qte, p ? p.qte : 0);
    if (!qte) return false;
    const montant = qte * px, f = frais(montant), res = montant - f - p.pru * qte;
    S.cash += montant - f; S.frais += f; p.qte -= qte;
    if (p.qte <= 0) { delete S.positions[sym]; S.ordres = S.ordres.filter(o => !(o.sym === sym && o.sens === "vente")); }
    S.histo.unshift({ jour: S.m.jour, sym, op: "vente", type, qte, prix: px, frais: f, res });
    reussirMission("premiere-vente");
    if (res > 0) reussirMission("plus-value");
    if (type === "limite") reussirMission("ordre-limite");
    return true;
  }
  function executerOrdres() {
    const garder = [];
    S.ordres.forEach(o => {
      const b = M.bougies(S.m, o.sym).slice(-1)[0], nom = M.info(o.sym).nom;
      let px = null;
      if (o.sens === "achat" && o.type === "limite") px = b.o <= o.prix ? b.o : b.l <= o.prix ? o.prix : null;
      if (o.sens === "vente" && o.type === "limite") px = b.o >= o.prix ? b.o : b.h >= o.prix ? o.prix : null;
      if (o.sens === "vente" && o.type === "stop") px = b.o <= o.prix ? b.o : b.l <= o.prix ? o.prix : null;
      if (px == null) { garder.push(o); return; }
      const ok = o.sens === "achat" ? acheter(o.sym, o.qte, px, o.type) : vendre(o.sym, o.qte, px, o.type);
      if (ok) toast(`${o.type === "stop" ? "🛑 Stop-loss déclenché" : "📝 Ordre limité exécuté"} : ${o.sens === "achat" ? "achat" : "vente"} de ${o.qte} ${esc(nom)} à ${eur(px)}${o.type === "stop" && px < o.prix ? " (le prix a ouvert sous votre seuil : c'est un gap)" : ""}`, o.type === "stop" ? "rouge" : "vert");
      else toast(`Ordre annulé sur ${esc(nom)} : ${o.sens === "achat" ? "pas assez d'espèces" : "plus d'actions à vendre"}.`);
    });
    // les ordres de vente d'une position vendue entre-temps ont déjà été retirés par vendre()
    S.ordres = garder.filter(o => o.sens === "achat" || S.positions[o.sym]);
  }
  function jourSuivant(nbJours, krach) {
    for (let k = 0; k < nbJours; k++) {
      const evts = M.avancer(S.m, krach && k === 0);
      evts.forEach(e => {
        if (e.type === "dividende" && S.positions[e.sym]) {
          const montant = r2(S.positions[e.sym].qte * e.montant);
          S.cash += montant; S.dividendes += montant;
          S.histo.unshift({ jour: S.m.jour, sym: e.sym, op: "dividende", qte: S.positions[e.sym].qte, prix: e.montant, frais: 0, res: montant });
          toast(`💶 Dividende reçu : ${eur(montant)} de ${esc(M.info(e.sym).nom)}`, "vert");
          reussirMission("toucher-dividende");
        }
        if (e.type === "choc") { toast(esc(e.texte), "rouge"); if (Object.keys(S.positions).length) S.krach = { debut: S.m.jour }; }
        if (e.type === "finchoc" && S.krach) {
          if (totalPortefeuille() >= CAPITAL * 0.9) reussirMission("survivre-krach");
          S.krach = null;
        }
        if (e.type === "news" && S.positions[e.sym]) toast(esc(e.texte));
      });
      executerOrdres();
      S.valeurs.push({ jour: S.m.jour, total: totalPortefeuille(), indice: S.m.indice[S.m.indice.length - 1].c });
    }
    verifierMissions(); sauverS(); majSim();
  }

  function vueSimulateur(vue) {
    vue.innerHTML = `
      <div class="sim-barre carte">
        <div><div class="doux petit">Jour de bourse</div><b id="sb-date"></b></div>
        <div class="sim-temps">
          <button class="btn principal" id="b1">▶ Jour suivant</button>
          <button class="btn" id="b5">⏩ +5 jours</button>
          <button class="btn" id="bauto">⏯ Lecture auto</button>
        </div>
        <div class="sim-total"><div class="doux petit">Valeur totale</div><b id="sb-total"></b> <span id="sb-perf"></span></div>
      </div>
      <div class="sim-grille">
        <aside class="carte sim-liste"><h3>Le marché <small class="doux">(fictif)</small></h3><div id="liste"></div></aside>
        <section class="carte sim-centre">
          <div id="entete"></div>
          <div class="outils-graph">
            <div class="segm" id="periodes">${[[30, "1 mois"], [60, "3 mois"], [120, "6 mois"], [9999, "Tout"]].map(([v, t]) => `<button data-n="${v}">${t}</button>`).join("")}</div>
            <label class="coche"><input type="checkbox" id="c-mm20"> <span class="pastille jaune"></span>MM20</label>
            <label class="coche"><input type="checkbox" id="c-mm50"> <span class="pastille violet"></span>MM50</label>
            <label class="coche"><input type="checkbox" id="c-vol"> Volume</label>
          </div>
          <div class="graph-zone"><canvas id="graph"></canvas><div class="bulle-graph" id="bulle" hidden></div></div>
          <div id="fiche"></div>
        </section>
        <aside class="carte sim-ticket" id="ticket"></aside>
      </div>
      <div class="sim-bas">
        <section class="carte"><h3>💼 Mon portefeuille</h3><div id="port"></div></section>
        <section class="carte"><h3>📊 Moi contre l'indice</h3><div class="courbe-zone"><canvas id="courbe"></canvas></div><div class="legende"><span><i style="background:var(--jaune)"></i>Mon portefeuille</span><span><i style="background:var(--bleu)"></i>Indice JUNGLE 10</span></div></section>
        <section class="carte"><h3>📝 Ordres en attente</h3><div id="ordres"></div></section>
        <section class="carte"><h3>📰 Actualités</h3><div id="news"></div></section>
        <section class="carte large-2"><h3>🧾 Historique</h3><div id="histo"></div></section>
        <section class="carte"><h3>🧪 Entraînement</h3>
          <p class="doux">Pour voir comment un portefeuille réagit à une crise, tu peux provoquer un krach (il dure quelques jours).</p>
          <button class="btn ko" id="bkrach">💥 Provoquer un krach</button>
          <p class="doux petit">Frais : 0,1 % par ordre (minimum 1 €). Écart achat/vente : 0,05 %. Dividendes tous les ${M.PERIODE_DIVIDENDE} jours de bourse.</p>
          <button class="btn discret" id="breset">↺ Recommencer avec ${eur(CAPITAL, 0)}</button>
        </section>
      </div>
      <p class="avertissement">Marché 100 % fictif : les entreprises et les prix sont inventés, l'argent aussi. Pour apprendre, pas pour conseiller.</p>`;
    graph = G.creerBougies($("#graph"), $("#bulle"));
    courbe = G.creerCourbes($("#courbe"));
    $("#b1").onclick = () => jourSuivant(1);
    $("#b5").onclick = () => jourSuivant(5);
    $("#bauto").onclick = () => {
      if (auto) { arreterAuto(); $("#bauto").textContent = "⏯ Lecture auto"; $("#bauto").classList.remove("principal"); }
      else { auto = setInterval(() => jourSuivant(1), 900); $("#bauto").textContent = "⏸ Pause"; $("#bauto").classList.add("principal"); }
    };
    $("#bkrach").onclick = () => { if (S.m.choc) { toast("Un krach est déjà en cours !"); return; } jourSuivant(1, true); };
    $("#breset").onclick = () => {
      if (!confirm("Recommencer le simulateur avec 10 000 € fictifs ? Le portefeuille, les ordres et l'historique seront effacés (pas tes missions ni tes leçons).")) return;
      arreterAuto(); S = nouveauSimulateur(); sauverS(); vueSimulateur(vue);
    };
    $$("#periodes button").forEach(b => b.onclick = () => { S.vue.n = +b.dataset.n; sauverS(); majGraph(); });
    $("#c-mm20").checked = S.vue.mm20; $("#c-mm50").checked = S.vue.mm50; $("#c-vol").checked = S.vue.volume;
    const coche = () => { S.vue.mm20 = $("#c-mm20").checked; S.vue.mm50 = $("#c-mm50").checked; S.vue.volume = $("#c-vol").checked; sauverS(); if (S.vue.mm20 && S.vue.mm50) reussirMission("voir-mm"); majGraph(); };
    ["#c-mm20", "#c-mm50", "#c-vol"].forEach(s => $(s).onchange = coche);
    $("#liste").onclick = e => { const r = e.target.closest("[data-sym]"); if (r) choisir(r.dataset.sym); };
    $("#port").onclick = e => { const r = e.target.closest("[data-sym]"); if (r) { choisir(r.dataset.sym); $(".sim-centre").scrollIntoView({ behavior: "smooth" }); } };
    $("#ordres").onclick = e => {
      const b = e.target.closest("[data-annuler]"); if (!b) return;
      S.ordres = S.ordres.filter(o => o.id !== +b.dataset.annuler); sauverS(); majSim();
    };
    construireTicket();
    majSim();
  }
  function choisir(sym) { S.selection = sym; sauverS(); construireTicket(); majSim(); }

  function majSim() {
    if (!$("#liste")) return;
    const total = totalPortefeuille(), perf = (total / CAPITAL - 1) * 100;
    $("#sb-date").textContent = dateJour(S.m.jour, true);
    $("#sb-total").textContent = eur(total);
    $("#sb-perf").innerHTML = `<span class="${signe(perf)}">${pct(perf)}</span>`;
    if (S.m.choc) $("#sb-date").innerHTML += ` <span class="tag rouge">💥 Krach en cours</span>`;
    // liste des actifs
    const lignes = [["INDICE", "JUNGLE 10", "Indice"]].concat(M.tous().map(a => [a.sym, a.nom, a.secteur]));
    $("#liste").innerHTML = lignes.map(([sym, nom, sect]) => {
      const b = sym === "INDICE" ? S.m.indice : M.bougies(S.m, sym), der = b[b.length - 1], v = (der.c / b[b.length - 2].c - 1) * 100;
      const pos = S.positions[sym];
      return `<button class="actif ${S.selection === sym ? "on" : ""} ${sym === "INDICE" ? "indice" : ""}" data-sym="${sym}">
        <span class="a-nom"><b>${sym === "INDICE" ? "📊" : sym}</b> ${esc(nom)}<small>${esc(sect)}${pos ? " · 💼 " + pos.qte : ""}</small></span>
        <canvas class="spark" data-spark="${sym}"></canvas>
        <span class="a-prix">${nb(der.c)}<small class="${signe(v)}">${pct(v)}</small></span></button>`;
    }).join("");
    $$("canvas[data-spark]").forEach(cv => {
      const sym = cv.dataset.spark, b = sym === "INDICE" ? S.m.indice : M.bougies(S.m, sym), vals = b.slice(-30).map(x => x.c);
      G.mini(cv, vals, vals[vals.length - 1] >= vals[0] ? getComputedStyle(document.documentElement).getPropertyValue("--vert") : getComputedStyle(document.documentElement).getPropertyValue("--rouge"));
    });
    majEntete(); majGraph(); majTicket(); majPortefeuille(); majOrdres(); majNews(); majHisto(); majCourbe();
  }
  function majEntete() {
    const sym = S.selection, idx = sym === "INDICE";
    const info = idx ? { nom: "Indice JUNGLE 10", secteur: "Indice", desc: "L'indice qui résume tout le marché fictif : la moyenne des 10 entreprises (dividendes réinvestis). On ne peut pas l'acheter directement : pour ça, il y a l'ETF JB10." } : M.info(sym);
    const b = idx ? S.m.indice : M.bougies(S.m, sym), der = b[b.length - 1], v = (der.c / b[b.length - 2].c - 1) * 100;
    $("#entete").innerHTML = `<div class="entete-actif"><div><h2>${esc(info.nom)} <small class="doux">${idx ? "" : sym}</small></h2><span class="tag">${esc(info.secteur)}</span></div>
      <div class="entete-prix"><b>${idx ? nb(der.c) + " pts" : eur(der.c)}</b><span class="${signe(v)}">${pct(v)} aujourd'hui</span></div></div>`;
    const per = idx ? null : M.per(S.m, sym), rdt = idx ? 0 : M.rendement(sym), pos = S.positions[sym];
    const b20 = b.slice(-20), haut20 = Math.max(...b20.map(x => x.h)), bas20 = Math.min(...b20.map(x => x.l));
    const v20 = (der.c / b[Math.max(0, b.length - 21)].c - 1) * 100;
    $("#fiche").innerHTML = `<p>${esc(info.desc)}</p>
      <div class="stats">
        <div><small>Sur 1 mois</small><b class="${signe(v20)}">${pct(v20)}</b></div>
        <div><small>Plus haut 1 mois</small><b>${nb(haut20)}</b></div>
        <div><small>Plus bas 1 mois</small><b>${nb(bas20)}</b></div>
        ${per ? `<div title="Prix ÷ bénéfice par action"><small>PER</small><b>${nb(per, 1)}</b></div>` : ""}
        ${!idx && !info.etf ? `<div title="Dividende annuel ÷ prix"><small>Rendement dividende</small><b>${rdt ? nb(rdt, 1) + " %" : "aucun"}</b></div>` : ""}
        ${pos ? `<div><small>Ma position</small><b>${pos.qte} × PRU ${nb(pos.pru)}</b></div>` : ""}
      </div>`;
  }
  function majGraph() {
    if (!graph) return;
    const sym = S.selection, data = sym === "INDICE" ? S.m.indice : M.bougies(S.m, sym);
    const lignes = [];
    const pos = S.positions[sym];
    if (pos) lignes.push({ prix: pos.pru, couleur: getComputedStyle(document.documentElement).getPropertyValue("--jaune"), texte: "Mon prix de revient " + nb(pos.pru) });
    S.ordres.filter(o => o.sym === sym).forEach(o => lignes.push({ prix: o.prix, couleur: getComputedStyle(document.documentElement).getPropertyValue(o.type === "stop" ? "--rouge" : o.sens === "achat" ? "--vert" : "--bleu"), texte: (o.type === "stop" ? "Stop-loss " : o.sens === "achat" ? "Achat limité " : "Vente limitée ") + nb(o.prix) }));
    graph.maj(data, { n: S.vue.n, mm20: S.vue.mm20, mm50: S.vue.mm50, volume: S.vue.volume, lignes, libelleJour: (i, l) => dateJour(i, l) });
    $$("#periodes button").forEach(b => b.classList.toggle("on", +b.dataset.n === S.vue.n));
  }

  function construireTicket() {
    const t = $("#ticket"); if (!t) return;
    const sym = S.selection;
    if (sym === "INDICE") {
      t.innerHTML = `<h3>🛒 Passer un ordre</h3>${jack("On ne peut pas acheter un indice directement. Pour avoir tout le JUNGLE 10 d'un coup, achète l'<b>ETF JB10</b> : il le copie.")}<button class="btn principal large" id="vers-etf">Voir l'ETF JB10</button>`;
      $("#vers-etf").onclick = () => choisir("JB10");
      return;
    }
    if (!S.positions[sym] && sens === "vente") sens = "achat";
    t.innerHTML = `<h3>🛒 Passer un ordre <small class="doux">${sym}</small></h3>
      <div class="onglets-sens"><button data-s="achat" class="${sens === "achat" ? "on achat" : ""}">Acheter</button><button data-s="vente" class="${sens === "vente" ? "on vente" : ""}" ${S.positions[sym] ? "" : `disabled title="Vous n’avez pas cette action"`}>Vendre</button></div>
      <label class="champ">Type d'ordre
        <select id="t-type"><option value="marche">Au marché (tout de suite)</option><option value="limite">À cours limité</option>${sens === "vente" ? `<option value="stop">Stop-loss</option>` : ""}</select></label>
      <label class="champ" id="t-prix-l" hidden><span id="t-prix-txt">Prix limite</span><input type="number" id="t-prix" step="0.01" min="0.01" inputmode="decimal"></label>
      <label class="champ">Quantité<span class="qte-ligne"><input type="number" id="t-qte" min="1" step="1" value="${sens === "vente" ? S.positions[sym].qte : 10}" inputmode="numeric"><button class="btn discret" id="t-max" type="button">Max</button></span></label>
      <div class="estim" id="t-estim"></div>
      <button class="btn large ${sens}" id="t-go">${sens === "achat" ? "Acheter" : "Vendre"}</button>
      <p class="aide" id="t-aide"></p>
      <details class="calc"><summary>🧮 Combien en acheter ? (règle du 1 %)</summary>
        <label class="champ">Risque accepté (% du portefeuille)<input type="number" id="k-risque" value="1" min="0.1" max="10" step="0.1"></label>
        <label class="champ">Mon stop-loss serait à (€)<input type="number" id="k-stop" step="0.01" min="0.01"></label>
        <div id="k-res" class="doux"></div></details>
      <div class="cash">Espèces disponibles : <b id="t-cash"></b></div>`;
    $$(".onglets-sens button").forEach(b => b.onclick = () => { if (b.disabled) return; sens = b.dataset.s; construireTicket(); majTicket(); });
    $("#t-type").onchange = majTicket; $("#t-qte").oninput = majTicket; $("#t-prix").oninput = majTicket;
    $("#t-max").onclick = () => {
      const px = prixTicket();
      if (sens === "vente") $("#t-qte").value = S.positions[sym].qte;
      else { let q = Math.floor(S.cash / (px * (1 + FRAIS_TAUX))); while (q > 0 && q * px + frais(q * px) > S.cash) q--; $("#t-qte").value = Math.max(0, q); }
      majTicket();
    };
    const calc = () => {
      const px = M.prix(S.m, sym), risque = totalPortefeuille() * (+$("#k-risque").value || 1) / 100, stop = +$("#k-stop").value;
      if (!stop || stop >= px) { $("#k-res").innerHTML = `Mets un stop sous le cours actuel (${nb(px)} €). Exemple : ${nb(px * 0.93)} € (−7 %).`; return; }
      const q = Math.floor(risque / (px - stop));
      $("#k-res").innerHTML = `Tu risques ${eur(risque)} au maximum. Écart jusqu'au stop : ${eur(px - stop)} par action.<br>👉 <b>${q} action(s)</b> (${eur(q * px)}). <button class="btn discret" id="k-use" type="button">Utiliser</button>`;
      const u = $("#k-use"); if (u) u.onclick = () => { $("#t-qte").value = q; majTicket(); };
    };
    $("#k-risque").oninput = calc; $("#k-stop").oninput = calc; calc();
    $("#t-go").onclick = passerOrdre;
    majTicket();
  }
  function prixTicket() {
    const type = $("#t-type").value, px = M.prix(S.m, S.selection);
    if (type === "marche") return r2(px * (sens === "achat" ? 1 + SPREAD : 1 - SPREAD));
    return +$("#t-prix").value || px;
  }
  function majTicket() {
    if (!$("#t-type") || S.selection === "INDICE") return;
    const type = $("#t-type").value, sym = S.selection, cours = M.prix(S.m, sym);
    const pl = $("#t-prix-l"); pl.hidden = type === "marche";
    $("#t-prix-txt").textContent = type === "stop" ? "Seuil de déclenchement (€)" : sens === "achat" ? "Prix maximum (€)" : "Prix minimum (€)";
    if (type !== "marche" && !$("#t-prix").value) $("#t-prix").value = (type === "stop" ? cours * 0.93 : sens === "achat" ? cours * 0.97 : cours * 1.05).toFixed(2);
    const qte = Math.max(0, Math.floor(+$("#t-qte").value || 0)), px = prixTicket(), montant = qte * px, f = qte ? frais(montant) : 0;
    $("#t-estim").innerHTML = `<div><span>Cours actuel</span><b>${eur(cours)}</b></div><div><span>${type === "marche" ? "Prix estimé" : "Prix visé"}</span><b>${eur(px)}</b></div><div><span>Montant</span><b>${eur(montant)}</b></div><div><span>Frais</span><b>${eur(f)}</b></div><div class="total"><span>${sens === "achat" ? "Total à payer" : "Vous recevrez"}</span><b>${eur(sens === "achat" ? montant + f : montant - f)}</b></div>`;
    $("#t-aide").textContent = {
      marche: "Exécuté tout de suite au cours actuel, avec un petit écart de prix (0,05 %).",
      limite: sens === "achat" ? "L'ordre attend que le prix descende jusqu'à votre prix maximum. Il peut ne jamais être exécuté." : "L'ordre attend que le prix monte jusqu'à votre prix minimum : c'est une prise de profit.",
      stop: "Si le prix touche le seuil, vos actions sont vendues pour limiter la perte. En cas de gap, la vente se fait plus bas."
    }[type];
    $("#t-cash").textContent = eur(S.cash);
  }
  function passerOrdre() {
    const sym = S.selection, type = $("#t-type").value, qte = Math.floor(+$("#t-qte").value || 0), cours = M.prix(S.m, sym), nom = M.info(sym).nom;
    if (qte < 1) { toast("Indique une quantité d'au moins 1."); return; }
    const pos = S.positions[sym];
    if (sens === "vente" && (!pos || qte > pos.qte)) { toast(`Tu n'as que ${pos ? pos.qte : 0} action(s) ${esc(nom)}.`); return; }
    if (type === "marche") {
      const px = prixTicket();
      const ok = sens === "achat" ? acheter(sym, qte, px, "marche") : vendre(sym, qte, px, "marche");
      if (!ok) { toast("Pas assez d'espèces pour cet achat (frais compris). Essaie le bouton Max."); return; }
      toast(`${sens === "achat" ? "✅ Achat" : "✅ Vente"} de ${qte} ${esc(nom)} à ${eur(px)}`, "vert");
    } else {
      const lim = r2(+$("#t-prix").value);
      if (!(lim > 0)) { toast("Indique un prix."); return; }
      if (type === "stop") {
        if (lim >= cours) { toast("Le seuil d'un stop-loss doit être sous le cours actuel."); return; }
        S.ordres.push({ id: S.nextId++, sym, sens: "vente", type: "stop", prix: lim, qte, jour: S.m.jour });
        reussirMission("stop-loss");
        toast(`🛑 Stop-loss placé à ${eur(lim)} sur ${esc(nom)}.`);
      } else if (sens === "achat") {
        if (lim >= cours) {
          const px = r2(cours * (1 + SPREAD));
          if (!acheter(sym, qte, px, "limite")) { toast("Pas assez d'espèces."); return; }
          toast(`Ton prix maximum est au-dessus du cours : achat exécuté tout de suite à ${eur(px)}.`, "vert");
        } else {
          if (qte * lim + frais(qte * lim) > S.cash) { toast("Pas assez d'espèces pour cet ordre."); return; }
          S.ordres.push({ id: S.nextId++, sym, sens: "achat", type: "limite", prix: lim, qte, jour: S.m.jour });
          toast(`📝 Ordre d'achat limité à ${eur(lim)} enregistré. Il attend que le prix descende.`);
        }
      } else {
        if (lim <= cours) {
          const px = r2(cours * (1 - SPREAD)); vendre(sym, qte, px, "limite");
          toast(`Ton prix minimum est sous le cours : vente exécutée tout de suite à ${eur(px)}.`, "vert");
        } else {
          S.ordres.push({ id: S.nextId++, sym, sens: "vente", type: "limite", prix: lim, qte, jour: S.m.jour });
          toast(`📝 Ordre de vente limité à ${eur(lim)} enregistré (prise de profit).`);
        }
      }
    }
    S.valeurs[S.valeurs.length - 1].total = totalPortefeuille();
    verifierMissions(); sauverS(); construireTicket(); majSim();
  }

  function majPortefeuille() {
    const total = totalPortefeuille(), investi = total - S.cash, perf = (total / CAPITAL - 1) * 100, pi = perfIndice();
    const pos = Object.entries(S.positions);
    $("#port").innerHTML = `<div class="resume">
        <div><small>Valeur totale</small><b>${eur(total)}</b></div><div><small>Espèces</small><b>${eur(S.cash)}</b></div>
        <div><small>Investi</small><b>${eur(investi)}</b></div><div><small>Performance</small><b class="${signe(perf)}">${pct(perf)}</b></div>
        <div><small>Indice depuis le départ</small><b class="${signe(pi)}">${pct(pi)}</b></div><div><small>Dividendes · frais</small><b>${eur(S.dividendes)} · ${eur(S.frais)}</b></div></div>
      ${pos.length ? `<div class="table-defil"><table><thead><tr><th>Actif</th><th>Qté</th><th>PRU</th><th>Cours</th><th>Valeur</th><th>+/− latent</th><th>Poids</th></tr></thead><tbody>
        ${pos.map(([sym, p]) => { const c = M.prix(S.m, sym), val = p.qte * c, lat = val - p.qte * p.pru, latp = (c / p.pru - 1) * 100;
          return `<tr data-sym="${sym}" class="clic"><td><b>${sym}</b> <small class="doux">${esc(M.info(sym).nom)}</small></td><td>${p.qte}</td><td>${nb(p.pru)}</td><td>${nb(c)}</td><td>${eur(val)}</td><td class="${signe(lat)}">${eur(lat)}<br><small>${pct(latp)}</small></td><td>${nb(val / total * 100, 0)} %</td></tr>`; }).join("")}
      </tbody></table></div>` : `<p class="doux">Aucune action pour l'instant. Choisis une entreprise dans la liste et achète !</p>`}`;
  }
  function majOrdres() {
    $("#ordres").innerHTML = S.ordres.length ? `<div class="table-defil"><table><thead><tr><th>Actif</th><th>Ordre</th><th>Qté</th><th>Prix</th><th></th></tr></thead><tbody>
      ${S.ordres.map(o => `<tr><td><b>${o.sym}</b></td><td>${o.type === "stop" ? "🛑 Stop-loss" : o.sens === "achat" ? "Achat limité" : "Vente limitée"}</td><td>${o.qte}</td><td>${nb(o.prix)}</td><td><button class="btn discret petit" data-annuler="${o.id}">Annuler</button></td></tr>`).join("")}
      </tbody></table></div>` : `<p class="doux">Aucun ordre en attente. Les ordres limités et les stop-loss apparaissent ici.</p>`;
  }
  function majNews() {
    const n = S.m.news.slice(-12).reverse();
    $("#news").innerHTML = n.length ? `<ul class="news">${n.map(x => `<li class="${x.type}"><small class="doux">${dateJour(x.jour)}</small> ${esc(x.texte)}</li>`).join("")}</ul>` : `<p class="doux">Pas d'actualité.</p>`;
  }
  function majHisto() {
    const h = S.histo.slice(0, 40);
    $("#histo").innerHTML = h.length ? `<div class="table-defil"><table><thead><tr><th>Date</th><th>Opération</th><th>Actif</th><th>Qté</th><th>Prix</th><th>Frais</th><th>Résultat</th></tr></thead><tbody>
      ${h.map(x => `<tr><td>${dateJour(x.jour)}</td><td>${x.op === "achat" ? "🟢 Achat" : x.op === "vente" ? "🔴 Vente" : "💶 Dividende"}${x.type && x.type !== "marche" ? ` <small class="doux">(${x.type === "stop" ? "stop-loss" : "limité"})</small>` : ""}</td><td>${x.sym}</td><td>${x.qte}</td><td>${nb(x.prix)}</td><td>${x.frais ? nb(x.frais) : "–"}</td><td class="${x.res != null ? signe(x.res) : ""}">${x.res != null ? eur(x.res) : "–"}</td></tr>`).join("")}
      </tbody></table></div>` : `<p class="doux">Aucune opération pour l'instant.</p>`;
  }
  function majCourbe() {
    if (!courbe) return;
    const v0 = S.valeurs[0];
    const cs = getComputedStyle(document.documentElement);
    courbe.maj([
      { nom: "Indice", couleur: cs.getPropertyValue("--bleu"), valeurs: S.valeurs.map(v => (v.indice / v0.indice - 1) * 100) },
      { nom: "Moi", couleur: cs.getPropertyValue("--jaune"), valeurs: S.valeurs.map(v => (v.total / CAPITAL - 1) * 100) }
    ], { suffixe: " %", zero: true });
  }
  let redim = null;
  window.addEventListener("resize", () => { clearTimeout(redim); redim = setTimeout(() => { if (graph && $("#graph")) { graph.redessiner(); courbe.redessiner(); } }, 150); });

  /* ================= RÉGLAGES ================= */
  function vueReglages(vue) {
    vue.innerHTML = `<h1>⚙️ Réglages</h1>
      <section class="carte reglages">
        <label class="champ">Mon prénom<input id="r-prenom" value="${esc(P.prenom)}" placeholder="Pour que Jack te salue" autocomplete="given-name"></label>
        <label class="champ">Thème<select id="r-theme"><option value="sombre">Sombre</option><option value="clair">Clair</option><option value="auto">Comme l'ordinateur</option></select></label>
        <label class="coche grande"><input type="checkbox" id="r-voix"> Jack lit les explications à voix haute après une erreur</label>
        <button class="btn" id="r-test">🔊 Tester la voix</button>
        <label class="coche grande"><input type="checkbox" id="r-libre"> Mode libre : tous les niveaux ouverts sans test</label>
      </section>
      <section class="carte reglages">
        <h2>💾 Sauvegarde</h2>
        <p class="doux">Tout est enregistré dans ce navigateur. Pour changer d'ordinateur, exporte puis importe le fichier.</p>
        <div class="boutons"><button class="btn" id="r-export">⬇ Exporter ma sauvegarde</button><label class="btn">⬆ Importer<input type="file" id="r-import" accept=".json,application/json" hidden></label></div>
      </section>
      <section class="carte reglages">
        <h2>🧹 Repartir de zéro</h2>
        <div class="boutons"><button class="btn ko" id="r-sim">Effacer le simulateur</button><button class="btn ko" id="r-prog">Effacer ma progression (leçons, cartes, missions)</button></div>
      </section>
      <section class="carte reglages"><h2>ℹ️ À propos</h2><p class="doux">Jack Bours apprend les bases de la Bourse avec un marché inventé et de l'argent fictif. Les règles fiscales sont simplifiées et peuvent changer. Rien ici n'est un conseil en investissement.</p>
        <p><a href="../index.html">Voir la page de présentation</a></p></section>`;
    $("#r-theme").value = P.reglages.theme; $("#r-voix").checked = P.reglages.voix; $("#r-libre").checked = P.reglages.libre;
    $("#r-prenom").oninput = e => { P.prenom = e.target.value.trim().slice(0, 30); sauverP(); };
    $("#r-theme").onchange = e => { P.reglages.theme = e.target.value; sauverP(); appliquerTheme(); };
    $("#r-voix").onchange = e => { P.reglages.voix = e.target.checked; sauverP(); };
    $("#r-libre").onchange = e => { P.reglages.libre = e.target.checked; sauverP(); };
    $("#r-test").onclick = () => parler("Salut " + (P.prenom || "") + " ! Moi c'est Jack. On apprend la Bourse ensemble, sans risquer un centime.", true);
    $("#r-export").onclick = () => {
      const blob = new Blob([JSON.stringify({ app: "jackbours", version: 1, progression: P, simulateur: S })], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "jackbours-sauvegarde-" + new Date().toISOString().slice(0, 10) + ".json"; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    };
    $("#r-import").onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const d = JSON.parse(r.result);
          if (d.app !== "jackbours" || !d.progression || !d.simulateur || !d.simulateur.m) throw new Error();
          P = Object.assign(nouvelleProgression(), d.progression); S = d.simulateur; sauverP(); sauverS(); appliquerTheme();
          toast("✅ Sauvegarde importée.", "vert"); route();
        } catch (err) { toast("Ce fichier n'est pas une sauvegarde Jack Bours."); }
      };
      r.readAsText(f);
    };
    $("#r-sim").onclick = () => { if (confirm("Effacer le simulateur et repartir avec 10 000 € fictifs ?")) { S = nouveauSimulateur(); sauverS(); toast("Simulateur remis à zéro."); } };
    $("#r-prog").onclick = () => { if (confirm("Effacer toute ta progression (quiz, tests, cartes, missions) ? C'est définitif.")) { const reg = P.reglages, pre = P.prenom; P = nouvelleProgression(); P.reglages = reg; P.prenom = pre; sauverP(); toast("Progression effacée."); } };
  }

  /* ---------- démarrage ---------- */
  $("#nav").innerHTML = NAV.map(([v, e, t]) => `<a href="#/${v}" data-v="${v}"><span class="em">${e}</span><span>${t}</span></a>`).join("");
  window.addEventListener("hashchange", route);
  route();
})();
