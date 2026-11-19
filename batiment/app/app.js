/* =========================================================
   Jack Bâtiment — logique de l'application
   Routage par hash, progression en localStorage, voix fr-FR.
   ========================================================= */
(function () {
  "use strict";

  const app = document.getElementById("app");
  const METIERS = (window.METIERS || []).slice().sort((a, b) => a.marche - b.marche);
  const AUTOCAD = window.AUTOCAD || { id: "autocad", modules: [], commandes: [] };
  const OUTILS = window.OUTILS || { checklists: [], glossaire: [] };
  const SEUIL_MODULE = 80;   // % pour valider un module
  const SEUIL_EXAMEN = 75;   // % pour l'attestation
  const NB_EXAMEN = 15;

  /* ---------- Progression (localStorage protégé) ---------- */
  const CLE = "jack-batiment-v1";
  let etat = { quiz: {}, examen: {}, lu: {}, nom: "", listes: {}, voix: true };
  try {
    const brut = localStorage.getItem(CLE);
    if (brut) etat = Object.assign(etat, JSON.parse(brut));
  } catch (e) { /* stockage indisponible : on garde l'état en mémoire */ }
  function sauver() { try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) { } }

  /* ---------- Petits utilitaires ---------- */
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`(.+?)`/g, "<code>$1</code>");
  const melange = (t) => { const a = t.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const nombre = (v) => { const n = parseFloat(String(v).replace(",", ".")); return isFinite(n) ? n : 0; };
  const arrondi = (n, d = 2) => Number(n).toLocaleString("fr-FR", { maximumFractionDigits: d });
  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("vu");
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("vu"), 2600);
  }
  const COURS_DEVIS = window.COURS_DEVIS || { id: "devis", modules: [] };
  AUTOCAD.retour = "#/autocad";
  COURS_DEVIS.retour = "#/prix/cours";
  function parcours(id) { return id === "autocad" ? AUTOCAD : id === "devis" ? COURS_DEVIS : METIERS.find((m) => m.id === id); }
  const accueilDe = (p) => p.retour || `#/metier/${p.id}`;
  function scoreModule(pid, mid) { return etat.quiz[pid + "/" + mid]; }
  function avancement(p) {
    const ok = p.modules.filter((m) => (scoreModule(p.id, m.id) || 0) >= SEUIL_MODULE).length;
    return { ok, total: p.modules.length, pct: p.modules.length ? Math.round(ok / p.modules.length * 100) : 0 };
  }

  /* ---------- Voix de David ---------- */
  const voixDispo = "speechSynthesis" in window;
  let voixFr = null;
  function choisirVoix() {
    if (!voixDispo) return;
    const v = speechSynthesis.getVoices();
    voixFr = v.find((x) => /fr[-_]FR/i.test(x.lang) && /google|natural|online/i.test(x.name)) || v.find((x) => /^fr/i.test(x.lang)) || null;
  }
  if (voixDispo) { choisirVoix(); speechSynthesis.onvoiceschanged = choisirVoix; }
  function parler(texte, fin) {
    if (!voixDispo) { toast("La voix n'est pas disponible dans ce navigateur."); return; }
    speechSynthesis.cancel();
    // découpage en phrases : évite les coupures de Chrome sur les longs textes
    const morceaux = String(texte).replace(/\*\*/g, "").match(/[^.!?;:]+[.!?;:]*/g) || [texte];
    morceaux.forEach((m, i) => {
      const u = new SpeechSynthesisUtterance(m.trim());
      u.lang = "fr-FR"; u.rate = 1; if (voixFr) u.voice = voixFr;
      if (i === morceaux.length - 1 && fin) u.onend = fin;
      speechSynthesis.speak(u);
    });
  }
  function silence() { if (voixDispo) speechSynthesis.cancel(); }

  /* ---------- Routage ---------- */
  function route() {
    silence();
    const h = (location.hash || "#/").slice(2).split("/").filter(Boolean);
    document.querySelectorAll(".nav-haut a").forEach((a) => {
      const cible = a.getAttribute("href").slice(2);
      const section = h[0] === "metier" ? (h[1] === "autocad" ? "autocad" : h[1] === "devis" ? "prix" : "") : (h[0] || "");
      a.classList.toggle("actif", cible === section);
    });
    try {
      if (h.length === 0) return vueAccueil();
      if (h[0] === "metier") {
        const p = parcours(h[1]);
        if (!p) return vueIntrouvable();
        if (h[2] === "module") {
          const m = p.modules.find((x) => x.id === h[3]);
          if (!m) return vueIntrouvable();
          return h[4] === "quiz" ? vueQuiz(p, m) : vueModule(p, m);
        }
        if (h[2] === "examen") return vueExamen(p);
        if (h[2] === "attestation") return vueAttestation(p);
        return p.id === "autocad" ? vueAutocad("cours") : p.id === "devis" ? vuePrix("cours") : vueMetier(p);
      }
      if (h[0] === "autocad") return vueAutocad(h[1] || "cours");
      if (h[0] === "outils") {
        if (h[1] === "calc") return vueCalcul(h[2]);
        if (h[1] === "liste") return vueListe(h[2]);
        return vueOutils();
      }
      if (h[0] === "glossaire") return vueGlossaire();
      if (h[0] === "prix") return vuePrix(["cours", "bibliotheque", "devis", "calcul"].includes(h[1]) ? h[1] : "cours");
      vueIntrouvable();
    } finally {
      window.scrollTo(0, 0);
    }
  }
  window.addEventListener("hashchange", route);

  function vueIntrouvable() {
    app.innerHTML = `<div class="carte"><h2>Page introuvable</h2><p>Cette page n'existe pas (ou plus).</p><a class="btn" href="#/">Retour à l'accueil</a></div>`;
  }

  /* ---------- Accueil ---------- */
  function vueAccueil() {
    const metiers = METIERS.slice().reverse().map((p) => {
      const a = avancement(p);
      const ex = etat.examen[p.id];
      const badge = ex >= SEUIL_EXAMEN ? `<span class="etat ok">🎓 Attestation</span>` : `<span class="etat">${a.ok}/${a.total} modules</span>`;
      return `<a class="metier" href="#/metier/${p.id}">
        <span class="emoji" aria-hidden="true">${p.emoji}</span>
        <span><span class="marche">Marche ${p.marche}</span> <b style="font-size:1.15rem">${esc(p.nom)}</b><br>
          <span class="muted petit">${esc(p.resume)}</span>
          <span class="barre"><i style="width:${a.pct}%"></i></span></span>
        ${badge}</a>`;
    }).join("");
    const ac = avancement(AUTOCAD);
    app.innerHTML = `
      <section class="hero">
        <span class="avatar-jack" aria-hidden="true"></span>
        <div>
          <h1>Formation bâtiment avec David</h1>
          <div class="bulle">Salut, moi c'est <b>David</b>, le castor bâtisseur 🦫 ! Ici on grimpe l'échelle du chantier, une marche après l'autre : <b>manœuvre</b>, <b>chef d'équipe</b>, <b>chef de chantier</b>, puis <b>conducteur de travaux</b>. Chaque module = un cours, des conseils de terrain et un quiz. À la fin : l'examen et ton attestation.</div>
        </div>
      </section>
      <h2>🪜 Les parcours métiers</h2>
      <p class="muted petit">Du haut (le plus de responsabilités) vers le bas (le point de départ). Tu peux commencer où tu veux.</p>
      <div class="echelle">${metiers}</div>
      <h2 style="margin-top:26px">🧰 Et aussi</h2>
      <div class="grille">
        <a class="carte tuile" href="#/autocad"><span class="emoji">📐</span><h3>AutoCAD</h3><p class="muted petit">${ac.ok}/${ac.total} cours validés · commandes, raccourcis, simulateur de dessin.</p></a>
        <a class="carte tuile" href="#/prix"><span class="emoji">💶</span><h3>Prix et devis</h3><p class="muted petit">Apprendre à faire un devis, prix indicatifs des ouvrages, devis estimatif, calcul d'un prix de vente.</p></a>
        <a class="carte tuile" href="#/outils"><span class="emoji">🧮</span><h3>Boîte à outils</h3><p class="muted petit">Calculs de béton, surfaces, pentes, escaliers, durées + check-lists imprimables.</p></a>
        <a class="carte tuile" href="#/glossaire"><span class="emoji">📖</span><h3>Glossaire BTP</h3><p class="muted petit">Le vocabulaire du chantier et des marchés, expliqué simplement.</p></a>
      </div>
      <p class="muted petit" style="margin-top:20px">⚠️ Cette formation aide à apprendre ; elle ne remplace ni les formations obligatoires (CACES, AIPR, habilitation électrique, SST, amiante…), ni les consignes de ton entreprise, du coordonnateur SPS ou du fabricant. En cas de doute, demande et vérifie les textes à jour (Code du travail, INRS, OPPBTP).</p>
      <div class="ligne no-print" style="margin-top:10px">
        <label class="ligne petit"><input type="checkbox" id="opt-voix" ${etat.voix ? "checked" : ""}> David lit les explications à voix haute après une erreur</label>
      </div>`;
    document.getElementById("opt-voix").onchange = (e) => { etat.voix = e.target.checked; sauver(); };
  }

  /* ---------- Page d'un métier ---------- */
  function listeModules(p) {
    return p.modules.map((m, i) => {
      const s = scoreModule(p.id, m.id);
      const etiquette = s == null ? `<span class="etat">À faire</span>` : s >= SEUIL_MODULE ? `<span class="etat ok">✓ ${s} %</span>` : `<span class="etat">${s} % · à revoir</span>`;
      return `<a class="carte module" href="#/metier/${p.id}/module/${m.id}">
        <span class="num" aria-hidden="true">${m.emoji || i + 1}</span>
        <span><b>${i + 1}. ${esc(m.titre)}</b><br><span class="muted petit">${esc(m.intro || "")}</span></span>
        ${etiquette}</a>`;
    }).join("");
  }
  function blocExamen(p) {
    const a = avancement(p);
    const ex = etat.examen[p.id];
    return `<div class="carte" style="margin-top:16px">
      <h3>🎯 Examen final — ${esc(p.nom)}</h3>
      <p class="muted petit">${NB_EXAMEN} questions tirées au hasard dans tous les modules. Il faut ${SEUIL_EXAMEN} % pour obtenir l'attestation.
      ${a.ok < a.total ? `Conseil : valide d'abord les modules (${a.ok}/${a.total} faits).` : "Tous les modules sont validés : tu es prêt !"}</p>
      ${ex != null ? `<p>Meilleur score : <b>${ex} %</b></p>` : ""}
      <div class="ligne">
        <a class="btn" href="#/metier/${p.id}/examen">Passer l'examen</a>
        ${ex >= SEUIL_EXAMEN ? `<a class="btn sec" href="#/metier/${p.id}/attestation">🎓 Mon attestation</a>` : ""}
      </div></div>`;
  }
  function vueMetier(p) {
    const a = avancement(p);
    app.innerHTML = `
      <a class="retour" href="#/">← Tous les parcours</a>
      <section class="hero">
        <span style="font-size:3.4rem" aria-hidden="true">${p.emoji}</span>
        <div><span class="marche" style="font:800 .8rem 'Baloo 2';color:#1b1b1b;background:var(--jaune);border-radius:6px;padding:1px 7px">Marche ${p.marche}</span>
          <h1>${esc(p.nom)}</h1>
          <p>${fmt(p.role)}</p>
          <div class="barre"><i style="width:${a.pct}%"></i></div>
          <p class="muted petit" style="margin-top:4px">${a.ok}/${a.total} modules validés</p>
        </div>
      </section>
      <div class="carte"><h3>📋 Ses missions</h3><ul>${p.missions.map((x) => `<li>${fmt(x)}</li>`).join("")}</ul>
        ${p.acces ? `<p class="muted petit"><b>Pour y arriver :</b> ${fmt(p.acces)}</p>` : ""}</div>
      <h2 style="margin-top:20px">📚 Modules</h2>
      <div class="pile">${listeModules(p)}</div>
      ${blocExamen(p)}`;
  }

  /* ---------- Leçon ---------- */
  function texteLecon(m) {
    const t = [m.titre + "."];
    m.sections.forEach((s) => { t.push(s.titre + "."); (s.texte || []).forEach((x) => t.push(x)); (s.liste || []).forEach((x) => t.push(x + ".")); });
    if (m.retenir) t.push("À retenir. " + m.retenir.join(". "));
    if (m.terrain) t.push("Sur le terrain. " + m.terrain);
    return t.join(" ");
  }
  function vueModule(p, m) {
    const i = p.modules.indexOf(m);
    const suivant = p.modules[i + 1];
    const base = accueilDe(p);
    const sections = m.sections.map((s) => `
      <h2>${esc(s.titre)}</h2>
      ${(s.texte || []).map((x) => `<p>${fmt(x)}</p>`).join("")}
      ${s.liste ? `<ul>${s.liste.map((x) => `<li>${fmt(x)}</li>`).join("")}</ul>` : ""}`).join("");
    app.innerHTML = `
      <a class="retour" href="${base}">← ${esc(p.nom)}</a>
      <article class="carte lecon">
        <div class="ligne espace"><h1 style="margin:0">${m.emoji || ""} ${esc(m.titre)}</h1>
          <button class="btn sec no-print" id="lire">🔊 David lit la leçon</button></div>
        <p class="muted">${esc(m.intro || "")}${m.duree ? ` · ⏱️ ${esc(m.duree)}` : ""}</p>
        ${sections}
        ${m.danger ? `<div class="encadre danger"><h3>⛔ Danger</h3><p>${fmt(m.danger)}</p></div>` : ""}
        ${m.retenir ? `<div class="encadre retenir" style="margin-top:14px"><h3>📌 À retenir</h3><ul>${m.retenir.map((x) => `<li>${fmt(x)}</li>`).join("")}</ul></div>` : ""}
        ${m.terrain ? `<div class="encadre terrain" style="margin-top:14px"><h3>🦺 Sur le terrain</h3><p>${fmt(m.terrain)}</p></div>` : ""}
        <div class="ligne no-print" style="margin-top:18px">
          <a class="btn" href="#/metier/${p.id}/module/${m.id}/quiz">✍️ Faire le quiz (${m.quiz.length} questions)</a>
          ${suivant ? `<a class="btn sec" href="#/metier/${p.id}/module/${suivant.id}">Module suivant →</a>` : ""}
        </div>
      </article>`;
    etat.lu[p.id + "/" + m.id] = true; sauver();
    const b = document.getElementById("lire");
    let enCours = false;
    b.onclick = () => {
      if (enCours) { silence(); enCours = false; b.textContent = "🔊 David lit la leçon"; return; }
      enCours = true; b.textContent = "⏹️ Arrêter";
      parler(texteLecon(m), () => { enCours = false; b.textContent = "🔊 David lit la leçon"; });
    };
  }

  /* ---------- Moteur de quiz (module et examen) ---------- */
  function lancerQuiz({ questions, titre, retour, fin }) {
    const qs = questions.map((q) => {
      const ordre = melange(q.choix.map((c, idx) => idx));
      return { q: q.q, choix: ordre.map((idx) => q.choix[idx]), ok: ordre.indexOf(q.ok), pourquoi: q.pourquoi, source: q.source };
    });
    let n = 0, bons = 0;
    const erreurs = [];
    function afficher() {
      const q = qs[n];
      app.innerHTML = `
        <a class="retour" href="${retour}">← Quitter</a>
        <div class="carte">
          <div class="ligne espace"><b>${esc(titre)}</b><span class="muted petit">Question ${n + 1}/${qs.length} · ✓ ${bons}</span></div>
          <div class="barre"><i style="width:${Math.round(n / qs.length * 100)}%"></i></div>
          <h2 style="margin-top:14px">${fmt(q.q)}</h2>
          ${q.source ? `<p class="muted petit">${esc(q.source)}</p>` : ""}
          <div class="choix">${q.choix.map((c, i) => `<button data-i="${i}">${fmt(c)}</button>`).join("")}</div>
          <div id="retourq"></div>
        </div>`;
      app.querySelectorAll(".choix button").forEach((btn) => {
        btn.onclick = () => repondre(+btn.dataset.i);
      });
    }
    function repondre(i) {
      const q = qs[n];
      const boutons = app.querySelectorAll(".choix button");
      boutons.forEach((b) => { b.disabled = true; });
      boutons[q.ok].classList.add("bon");
      const zone = document.getElementById("retourq");
      if (i === q.ok) {
        bons++;
        zone.innerHTML = `<div class="encadre terrain explication"><b>✅ Bonne réponse !</b>${q.pourquoi ? ` <span class="muted">${fmt(q.pourquoi)}</span>` : ""}</div>`;
      } else {
        boutons[i].classList.add("faux");
        erreurs.push(q);
        zone.innerHTML = `<div class="encadre danger explication"><b>❌ Pas tout à fait.</b> La bonne réponse : <b>${fmt(q.choix[q.ok])}</b>.<br>${fmt(q.pourquoi || "")}</div>`;
        if (etat.voix && q.pourquoi) parler("La bonne réponse est : " + q.choix[q.ok] + ". " + q.pourquoi);
      }
      zone.insertAdjacentHTML("beforeend", `<div class="ligne" style="margin-top:12px"><button class="btn" id="suite">${n + 1 < qs.length ? "Question suivante →" : "Voir mon score"}</button></div>`);
      const s = document.getElementById("suite");
      s.focus();
      s.onclick = () => { silence(); n++; if (n < qs.length) afficher(); else fin(Math.round(bons / qs.length * 100), erreurs); };
    }
    afficher();
  }
  function recapErreurs(erreurs) {
    if (!erreurs.length) return "";
    return `<div class="carte" style="margin-top:14px"><h3>🔁 À revoir</h3><ul>${erreurs.map((q) => `<li><b>${fmt(q.q)}</b><br>→ ${fmt(q.choix[q.ok])}${q.pourquoi ? `<br><span class="muted petit">${fmt(q.pourquoi)}</span>` : ""}</li>`).join("")}</ul></div>`;
  }

  function vueQuiz(p, m) {
    const cle = p.id + "/" + m.id;
    lancerQuiz({
      questions: m.quiz, titre: m.titre, retour: `#/metier/${p.id}/module/${m.id}`,
      fin: (pct, erreurs) => {
        const avant = etat.quiz[cle];
        etat.quiz[cle] = Math.max(avant || 0, pct); sauver();
        const i = p.modules.indexOf(m), suivant = p.modules[i + 1];
        const reussi = pct >= SEUIL_MODULE;
        app.innerHTML = `
          <div class="carte" style="text-align:center">
            <span class="avatar-jack" aria-hidden="true"></span>
            <div class="score">${pct} %</div>
            <p>${reussi ? "Bravo, module validé ! 💪" : `Il faut ${SEUIL_MODULE} % pour valider. Relis la leçon et retente, tu vas l'avoir.`}</p>
            <div class="ligne" style="justify-content:center">
              <a class="btn sec" href="#/metier/${p.id}/module/${m.id}">Relire la leçon</a>
              <button class="btn sec" id="rejouer">Refaire le quiz</button>
              ${reussi && suivant ? `<a class="btn" href="#/metier/${p.id}/module/${suivant.id}">Module suivant →</a>` : ""}
              ${reussi && !suivant ? `<a class="btn" href="${accueilDe(p)}">Retour au parcours</a>` : ""}
            </div>
          </div>${recapErreurs(erreurs)}`;
        document.getElementById("rejouer").onclick = () => vueQuiz(p, m);
        if (reussi) toast("Module validé ✓");
      }
    });
  }

  function vueExamen(p) {
    const toutes = [];
    p.modules.forEach((m) => m.quiz.forEach((q) => toutes.push(Object.assign({ source: "Module : " + m.titre }, q))));
    const tirage = melange(toutes).slice(0, Math.min(NB_EXAMEN, toutes.length));
    const retour = accueilDe(p);
    lancerQuiz({
      questions: tirage, titre: "Examen final — " + p.nom, retour,
      fin: (pct, erreurs) => {
        etat.examen[p.id] = Math.max(etat.examen[p.id] || 0, pct); sauver();
        const reussi = pct >= SEUIL_EXAMEN;
        app.innerHTML = `
          <div class="carte" style="text-align:center">
            <span class="avatar-jack" aria-hidden="true"></span>
            <div class="score">${pct} %</div>
            <p>${reussi ? "Examen réussi ! Ton attestation est prête. 🎓" : `Il faut ${SEUIL_EXAMEN} %. Revois les modules ci-dessous et retente l'examen.`}</p>
            <div class="ligne" style="justify-content:center">
              ${reussi ? `<a class="btn" href="#/metier/${p.id}/attestation">🎓 Voir mon attestation</a>` : ""}
              <button class="btn sec" id="rejouer">Repasser l'examen</button>
              <a class="btn sec" href="${retour}">Retour au parcours</a>
            </div>
          </div>${recapErreurs(erreurs)}`;
        document.getElementById("rejouer").onclick = () => vueExamen(p);
      }
    });
  }

  function vueAttestation(p) {
    const ex = etat.examen[p.id];
    const retour = accueilDe(p);
    if (!(ex >= SEUIL_EXAMEN)) {
      app.innerHTML = `<a class="retour" href="${retour}">← ${esc(p.nom)}</a><div class="carte"><h2>Pas encore d'attestation</h2><p>Réussis l'examen final (${SEUIL_EXAMEN} %) pour l'obtenir.</p><a class="btn" href="#/metier/${p.id}/examen">Passer l'examen</a></div>`;
      return;
    }
    const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    app.innerHTML = `
      <a class="retour" href="${retour}">← ${esc(p.nom)}</a>
      <div class="carte no-print" style="margin-bottom:14px">
        <label class="petit muted" for="nom">Ton nom et prénom (pour l'attestation)</label>
        <div class="ligne" style="margin-top:6px"><input class="champ" id="nom" style="flex:1;min-width:200px" value="${esc(etat.nom)}" placeholder="Prénom Nom">
        <button class="btn" id="imprimer">🖨️ Imprimer</button></div>
      </div>
      <div class="attestation">
        <p style="letter-spacing:.2em;text-transform:uppercase;font-weight:800">Jack Bâtiment</p>
        <h1>Attestation de suivi de formation</h1>
        <p>David le castor certifie que</p>
        <p class="nom" id="nom-aff">${esc(etat.nom) || "&nbsp;"}</p>
        <p style="margin-top:14px">a suivi le parcours <b>${esc(p.nom)}</b> (${p.modules.length} modules)<br>et réussi l'examen final avec <b>${ex} %</b>.</p>
        <p>Le ${date}</p>
        <p style="font-size:.8rem;margin-top:20px">Attestation d'auto-formation. Elle ne vaut pas titre professionnel ni certification réglementaire (CACES, AIPR, habilitation…).</p>
      </div>`;
    const champ = document.getElementById("nom");
    champ.oninput = () => { etat.nom = champ.value; sauver(); document.getElementById("nom-aff").textContent = champ.value || " "; };
    document.getElementById("imprimer").onclick = () => window.print();
  }

  /* ---------- AutoCAD ---------- */
  function vueAutocad(onglet) {
    const tabs = [["cours", "📚 Cours"], ["commandes", "⌨️ Commandes"], ["entrainement", "🎯 Raccourcis"], ["simulateur", "🖥️ Simulateur"]];
    const entete = `
      <section class="hero">
        <span style="font-size:3.2rem" aria-hidden="true">📐</span>
        <div><h1>AutoCAD pour le chantier</h1><p>${fmt(AUTOCAD.role || "")}</p></div>
      </section>
      <nav class="onglets">${tabs.map(([id, t]) => `<a href="#/autocad/${id}" class="${onglet === id ? "actif" : ""}">${t}</a>`).join("")}</nav>`;
    if (onglet === "module") return; // géré par #/metier/autocad/module/...
    if (onglet === "commandes") {
      app.innerHTML = entete + `
        <div class="carte">
          <input class="champ" id="cherche" placeholder="Chercher une commande : ligne, décaler, calque, cote…" autocomplete="off">
          <p class="muted petit" style="margin-top:8px">Astuce : la commande anglaise précédée d'un tiret bas (<code>_LINE</code>) marche dans toutes les langues d'AutoCAD. Tape-la puis <kbd>Entrée</kbd>. Les raccourcis sont ceux de la version anglaise ; dans AutoCAD français certains changent, le nom français complet marche toujours.</p>
          <div class="table-wrap"><table><thead><tr><th>Commande (FR)</th><th>Anglais</th><th>Raccourci (version anglaise)</th><th>À quoi ça sert</th></tr></thead><tbody id="corps"></tbody></table></div>
        </div>`;
      const corps = document.getElementById("corps");
      const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      const remplir = (f) => {
        const n = norm(f || "");
        const l = AUTOCAD.commandes.filter((c) => !n || norm([c.fr, c.en, c.raccourci, c.desc, c.cat].join(" ")).includes(n));
        corps.innerHTML = l.map((c) => `<tr><td><b>${esc(c.fr)}</b><br><span class="muted petit">${esc(c.cat)}</span></td><td><code>_${esc(c.en)}</code></td><td>${c.raccourci ? `<kbd>${esc(c.raccourci)}</kbd>` : "—"}</td><td>${fmt(c.desc)}</td></tr>`).join("") || `<tr><td colspan="4" class="muted">Aucune commande trouvée.</td></tr>`;
      };
      remplir("");
      document.getElementById("cherche").oninput = (e) => remplir(e.target.value);
      return;
    }
    if (onglet === "entrainement") {
      app.innerHTML = entete + `<div class="carte" id="entr"></div>`;
      return entrainementRaccourcis(document.getElementById("entr"));
    }
    if (onglet === "simulateur") {
      app.innerHTML = entete + `<div id="simu"></div>`;
      if (window.Simulateur) window.Simulateur.monter(document.getElementById("simu"), { toast, sauver: (k, v) => { etat.simu = etat.simu || {}; etat.simu[k] = v; sauver(); }, lire: (k) => (etat.simu || {})[k] });
      return;
    }
    const a = avancement(AUTOCAD);
    app.innerHTML = entete + `
      <p class="muted petit">${a.ok}/${a.total} cours validés. Chaque cours se termine par un quiz.</p>
      <div class="pile">${listeModules(AUTOCAD)}</div>
      ${blocExamen(AUTOCAD)}`;
  }

  function entrainementRaccourcis(zone) {
    const pool = AUTOCAD.commandes.filter((c) => c.raccourci && /^[A-Z]+$/i.test(c.raccourci));
    let tour = 0, bons = 0, serie = melange(pool).slice(0, 12), courant;
    function question() {
      if (tour >= serie.length) {
        zone.innerHTML = `<div style="text-align:center"><div class="score">${bons}/${serie.length}</div><p>${bons >= 10 ? "Tes doigts connaissent AutoCAD ! ⌨️" : "Entraîne-toi encore : les raccourcis font gagner un temps fou."}</p><button class="btn" id="again">Nouvelle série</button></div>`;
        document.getElementById("again").onclick = () => { tour = 0; bons = 0; serie = melange(pool).slice(0, 12); question(); };
        return;
      }
      courant = serie[tour];
      zone.innerHTML = `
        <div class="ligne espace"><b>Tape le raccourci clavier</b><span class="muted petit">${tour + 1}/${serie.length} · ✓ ${bons}</span></div>
        <h2 style="margin-top:12px">${fmt(courant.desc)}</h2>
        <p class="muted">Commande : <b>${esc(courant.fr)}</b></p>
        <form id="f" class="ligne" autocomplete="off"><input class="champ" id="rep" style="flex:1;min-width:140px;text-transform:uppercase" placeholder="Raccourci…" aria-label="Raccourci" autocapitalize="characters"><button class="btn">Valider</button></form>
        <div id="fb" style="margin-top:10px"></div>`;
      const rep = document.getElementById("rep");
      rep.focus();
      document.getElementById("f").onsubmit = (e) => {
        e.preventDefault();
        const v = rep.value.trim().toUpperCase().replace(/^_/, "");
        const accepte = [courant.raccourci, courant.en, courant.fr].map((x) => String(x).toUpperCase());
        const ok = accepte.includes(v);
        if (ok) bons++;
        document.getElementById("fb").innerHTML = ok
          ? `<div class="encadre terrain">✅ Oui ! <kbd>${esc(courant.raccourci)}</kbd> puis Entrée (ou la commande complète <code>${esc(courant.fr)}</code>).</div>`
          : `<div class="encadre danger">❌ C'était <kbd>${esc(courant.raccourci)}</kbd> — commande <code>${esc(courant.fr)}</code> / <code>_${esc(courant.en)}</code>.</div>`;
        rep.disabled = true;
        tour++;
        setTimeout(question, ok ? 900 : 2200);
      };
    }
    question();
  }

  /* ---------- Boîte à outils ---------- */
  const CALCULS = {
    beton: {
      titre: "Volume de béton et dosage", emoji: "🧱",
      champs: [["l", "Longueur (m)", 5], ["L", "Largeur (m)", 4], ["e", "Épaisseur (cm)", 12], ["pertes", "Marge de pertes (%)", 5],
        ["dosage", "Dosage ciment (kg/m³)", 350, [250, 300, 350, 400]], ["sac", "Sac de ciment (kg)", 35, [25, 35]]],
      calc: (v) => {
        const vol = v.l * v.L * (v.e / 100) * (1 + v.pertes / 100);
        const ciment = vol * v.dosage;
        return `Volume à commander : <b>${arrondi(vol)} m³</b><br>
          Ciment : <b>${arrondi(ciment, 0)} kg</b> soit <b>${Math.ceil(ciment / v.sac)} sacs</b> de ${v.sac} kg<br>
          Ordre de grandeur pour un béton courant fait sur place, par m³ : env. 400 L de sable 0/4, 800 L de gravier, 175 L d'eau.<br>
          <span class="muted petit">À vérifier : la formulation du CCTP, de l'étude béton ou de la centrale. Au-delà de quelques m³, on commande du béton prêt à l'emploi (BPE).</span>`;
      }
    },
    surfaces: {
      titre: "Surfaces : sol, murs, carrelage, peinture", emoji: "📏",
      champs: [["l", "Longueur pièce (m)", 4.2], ["L", "Largeur pièce (m)", 3.5], ["h", "Hauteur sous plafond (m)", 2.5], ["ouv", "Ouvertures à déduire (m²)", 3.5],
        ["perteC", "Pertes carrelage (%)", 10], ["couches", "Couches de peinture", 2], ["rend", "Rendement peinture (m²/L)", 10]],
      calc: (v) => {
        const sol = v.l * v.L, murs = Math.max(0, 2 * (v.l + v.L) * v.h - v.ouv);
        const carrelage = sol * (1 + v.perteC / 100);
        const peinture = v.rend > 0 ? (murs + sol) * v.couches / v.rend : 0;
        return `Sol : <b>${arrondi(sol)} m²</b> · Périmètre : <b>${arrondi(2 * (v.l + v.L))} m</b> (plinthes)<br>
          Murs (ouvertures déduites) : <b>${arrondi(murs)} m²</b><br>
          Carrelage au sol à commander : <b>${arrondi(carrelage)} m²</b><br>
          Peinture murs + plafond : <b>${arrondi(peinture, 1)} L</b> pour ${v.couches} couche(s)<br>
          <span class="muted petit">Le rendement réel est sur la fiche technique du pot ; la pose en diagonale ou les grands formats demandent plus de pertes.</span>`;
      }
    },
    pente: {
      titre: "Pente en % et en degrés", emoji: "📐",
      champs: [["d", "Dénivelé (cm)", 10], ["lg", "Longueur horizontale (m)", 4]],
      calc: (v) => {
        if (!v.lg) return "Indique une longueur.";
        const pct = (v.d / 100) / v.lg * 100;
        const deg = Math.atan(pct / 100) * 180 / Math.PI;
        return `Pente : <b>${arrondi(pct)} %</b> soit <b>${arrondi(deg)}°</b><br>
          Soit <b>${arrondi(pct * 10, 1)} mm par mètre</b> (ou ${arrondi(pct, 2)} cm/m).<br>
          <span class="muted petit">Rappel : pente (%) = dénivelé ÷ longueur × 100. Pour une rampe accessible, un évacuation ou une toiture, vérifie la valeur exigée par la réglementation, le DTU ou le fabricant.</span>`;
      }
    },
    escalier: {
      titre: "Escalier : formule de Blondel", emoji: "🪜",
      champs: [["H", "Hauteur à monter, sol fini à sol fini (cm)", 270], ["g", "Giron souhaité (cm)", 25], ["hmax", "Hauteur de marche visée (cm)", 17.5]],
      calc: (v) => {
        if (!v.H || !v.hmax) return "Indique les hauteurs.";
        const n = Math.max(1, Math.round(v.H / v.hmax));
        const h = v.H / n, b = 2 * h + v.g;
        const ok = b >= 60 && b <= 64;
        return `Nombre de hauteurs de marche : <b>${n}</b> · Hauteur d'une marche : <b>${arrondi(h, 1)} cm</b><br>
          Blondel 2H + G = <b>${arrondi(b, 1)} cm</b> ${ok ? "✅ confortable (60 à 64 cm)" : "⚠️ hors de la zone confortable 60–64 cm : ajuste le giron ou le nombre de marches"}<br>
          Reculement (longueur au sol) ≈ <b>${arrondi((n - 1) * v.g / 100, 2)} m</b> pour ${n - 1} girons<br>
          <span class="muted petit">Pense à l'échappée (hauteur libre au-dessus des marches) et aux règles propres au bâtiment (ERP, accessibilité, logement collectif).</span>`;
      }
    },
    duree: {
      titre: "Durée d'une tâche et effectif", emoji: "⏱️",
      champs: [["q", "Quantité à réaliser (m², m³, ml, u…)", 120], ["r", "Rendement par personne et par jour", 15], ["e", "Effectif (personnes)", 2], ["j", "Délai visé (jours) — facultatif", 0]],
      calc: (v) => {
        if (!v.r || !v.e) return "Indique un rendement et un effectif.";
        const jours = v.q / (v.r * v.e);
        let txt = `Durée : <b>${arrondi(jours, 1)} jours</b> (${arrondi(jours * 7, 0)} h de travail par personne sur une base de 7 h/jour)<br>
          Charge totale : <b>${arrondi(v.q / v.r, 1)} jours-personne</b>`;
        if (v.j > 0) txt += `<br>Pour tenir <b>${v.j} jours</b>, il faut <b>${Math.ceil(v.q / (v.r * v.j))} personne(s)</b>.`;
        return txt + `<br><span class="muted petit">Durée = quantité ÷ (rendement × effectif). Les rendements viennent de l'historique de l'entreprise : note-les sur chaque chantier.</span>`;
      }
    },
    equerre: {
      titre: "Équerrage : diagonale et 3-4-5", emoji: "📐",
      champs: [["a", "Côté A (m)", 8], ["b", "Côté B (m)", 6]],
      calc: (v) => {
        const d = Math.sqrt(v.a * v.a + v.b * v.b);
        return `Diagonale théorique : <b>${arrondi(d, 3)} m</b><br>
          Si les deux diagonales d'un rectangle sont égales (à cette valeur), les angles sont droits.<br>
          Méthode 3-4-5 : 3 m sur un côté, 4 m sur l'autre ⇒ 5 m entre les deux points (ou 0,60 / 0,80 / 1,00 m ; 6 / 8 / 10 m).`;
      }
    }
  };

  function vueOutils() {
    app.innerHTML = `
      <section class="hero"><span style="font-size:3.2rem" aria-hidden="true">🧰</span>
        <div><h1>Boîte à outils du chantier</h1><p>Les calculs de tous les jours et les check-lists à imprimer.</p></div></section>
      <h2>🧮 Calculateurs</h2>
      <div class="grille">${Object.entries(CALCULS).map(([id, c]) => `<a class="carte tuile" href="#/outils/calc/${id}"><span class="emoji">${c.emoji}</span><h3>${esc(c.titre)}</h3></a>`).join("")}</div>
      <h2 style="margin-top:22px">✅ Check-lists imprimables</h2>
      <div class="grille">${OUTILS.checklists.map((l) => `<a class="carte tuile" href="#/outils/liste/${l.id}"><span class="emoji">${l.emoji}</span><h3>${esc(l.titre)}</h3><p class="muted petit">${esc(l.intro)}</p></a>`).join("")}</div>`;
  }

  function vueCalcul(id) {
    const c = CALCULS[id];
    if (!c) return vueIntrouvable();
    app.innerHTML = `
      <a class="retour" href="#/outils">← Boîte à outils</a>
      <div class="carte">
        <h1>${c.emoji} ${esc(c.titre)}</h1>
        <form class="form" id="f">${c.champs.map(([k, lab, def, opts]) => opts
          ? `<label>${esc(lab)}<select name="${k}">${opts.map((o) => `<option ${o === def ? "selected" : ""}>${o}</option>`).join("")}</select></label>`
          : `<label>${esc(lab)}<input name="${k}" inputmode="decimal" value="${def}"></label>`).join("")}</form>
        <div class="resultat" id="res" aria-live="polite"></div>
      </div>`;
    const f = document.getElementById("f");
    const maj = () => {
      const v = {};
      c.champs.forEach(([k]) => { v[k] = nombre(f.elements[k].value); });
      document.getElementById("res").innerHTML = c.calc(v);
    };
    f.oninput = maj; f.onsubmit = (e) => e.preventDefault();
    maj();
  }

  function vueListe(id) {
    const l = OUTILS.checklists.find((x) => x.id === id);
    if (!l) return vueIntrouvable();
    const sauvee = etat.listes[id] || { coche: [], notes: "" };
    let nItem = 0;
    const blocs = l.groupes.map((g) => `
      <h3 style="margin-top:14px">${esc(g.titre)}</h3>
      <ul class="checklist">${g.items.map((it) => { const i = nItem++; return `<li><label><input type="checkbox" data-i="${i}" ${sauvee.coche.includes(i) ? "checked" : ""}> <span>${fmt(it)}</span></label></li>`; }).join("")}</ul>`).join("");
    app.innerHTML = `
      <a class="retour" href="#/outils">← Boîte à outils</a>
      <div class="carte">
        <div class="ligne espace"><h1 style="margin:0">${l.emoji} ${esc(l.titre)}</h1>
          <div class="ligne no-print"><button class="btn sec" id="vider">Tout décocher</button><button class="btn" id="imp">🖨️ Imprimer</button></div></div>
        <p class="muted">${esc(l.intro)}</p>
        <p class="petit">Chantier : ______________________ &nbsp; Date : ____ / ____ / ________ &nbsp; Par : ______________________</p>
        ${blocs}
        <h3 style="margin-top:14px">📝 Notes / observations</h3>
        <textarea class="zone-notes" id="notes" placeholder="Remarques, actions à mener, qui fait quoi et pour quand…">${esc(sauvee.notes)}</textarea>
        ${l.conseil ? `<div class="encadre terrain" style="margin-top:12px"><p style="margin:0">${fmt(l.conseil)}</p></div>` : ""}
      </div>`;
    const enreg = () => {
      etat.listes[id] = { coche: [...app.querySelectorAll(".checklist input:checked")].map((x) => +x.dataset.i), notes: document.getElementById("notes").value };
      sauver();
    };
    app.querySelectorAll(".checklist input").forEach((x) => { x.onchange = enreg; });
    document.getElementById("notes").oninput = enreg;
    document.getElementById("imp").onclick = () => window.print();
    document.getElementById("vider").onclick = () => { app.querySelectorAll(".checklist input").forEach((x) => { x.checked = false; }); enreg(); toast("Check-list remise à zéro"); };
  }

  /* ---------- Prix : bibliothèque, devis, calcul d'un prix ---------- */
  const PRIX = window.PRIX || { categories: [], tva: [] };
  const tousItems = () => PRIX.categories.flatMap((c) => c.items.map((i) => Object.assign({ cat: c.nom }, i)));
  const itemPar = (id) => tousItems().find((i) => i.id === id);
  const prixDe = (it) => {
    const p = (etat.prix && etat.prix.perso || {})[it.id];
    return p != null && p !== "" ? nombre(p) : Math.round((it.min + it.max) / 2);
  };
  const euros = (n) => Number(n).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
  function prixEtat() {
    etat.prix = etat.prix || {};
    etat.prix.perso = etat.prix.perso || {};
    etat.prix.devis = etat.prix.devis || { objet: "", lignes: [], tva: 20, aleas: 0 };
    return etat.prix;
  }

  function vuePrix(onglet) {
    prixEtat();
    const tabs = [["cours", "🎓 Apprendre à faire un devis"], ["bibliotheque", "📚 Bibliothèque de prix"], ["devis", "🧾 Faire un devis"], ["calcul", "🧮 Calculer un prix"]];
    const nb = etat.prix.devis.lignes.length;
    const entete = `
      <section class="hero"><span style="font-size:3.2rem" aria-hidden="true">💶</span>
        <div><h1>Prix du bâtiment</h1>
        <p>Des prix indicatifs d'ouvrages courants, un outil pour monter un devis et la méthode pour calculer un prix de vente à partir du déboursé sec.</p></div></section>
      <nav class="onglets">${tabs.map(([id, t]) => `<a href="#/prix/${id}" class="${onglet === id ? "actif" : ""}">${t}${id === "devis" && nb ? ` (${nb})` : ""}</a>`).join("")}</nav>
      <div class="encadre danger petit" style="margin-bottom:14px">⚠️ <b>Ordres de grandeur seulement</b> (France métropolitaine, HT, fourniture et pose, ${esc(PRIX.maj || "")}). Les prix réels varient beaucoup selon la région, l'accès, les quantités, la gamme et la conjoncture. Remplace-les par <b>tes propres prix</b> (colonne « Mon prix ») : ils sont gardés dans ce navigateur. Pour un chiffrage professionnel, base-toi sur les prix de ton entreprise et les devis fournisseurs.</div>`;

    if (onglet === "cours") {
      const a = avancement(COURS_DEVIS);
      app.innerHTML = entete + `
        <p class="muted petit">${a.ok}/${a.total} cours validés. Chaque cours se termine par un quiz, puis un examen final et une attestation.</p>
        <div class="pile">${listeModules(COURS_DEVIS)}</div>
        ${blocExamen(COURS_DEVIS)}`;
      return;
    }
    if (onglet === "devis") return vueDevis(entete);
    if (onglet === "calcul") return vueCalculPrix(entete);

    app.innerHTML = entete + `
      <input class="champ" id="cherche" placeholder="Chercher un ouvrage : dalle, cloison, carrelage, benne…" autocomplete="off">
      <div id="liste" class="pile" style="margin-top:14px"></div>`;
    const liste = document.getElementById("liste");
    const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const remplir = (f) => {
      const n = norm(f || "");
      liste.innerHTML = PRIX.categories.map((c) => {
        const items = c.items.filter((i) => !n || norm(i.nom + " " + c.nom).includes(n));
        if (!items.length) return "";
        return `<div class="carte"><h3>${c.emoji} ${esc(c.nom)}</h3><div class="table-wrap"><table>
          <thead><tr><th>Ouvrage</th><th>Unité</th><th>Fourchette HT</th><th>Mon prix HT</th><th></th></tr></thead><tbody>
          ${items.map((i) => `<tr>
            <td>${esc(i.nom)}</td><td>${esc(i.unite)}</td>
            <td style="white-space:nowrap">${euros(i.min)} – ${euros(i.max)}</td>
            <td><input class="champ" style="width:96px;padding:6px 8px" inputmode="decimal" data-prix="${i.id}" value="${etat.prix.perso[i.id] != null ? esc(etat.prix.perso[i.id]) : ""}" placeholder="${Math.round((i.min + i.max) / 2)}" aria-label="Mon prix pour ${esc(i.nom)}"></td>
            <td><button class="btn sec" style="padding:6px 10px" data-ajout="${i.id}" title="Ajouter au devis">+ Devis</button></td></tr>`).join("")}
          </tbody></table></div></div>`;
      }).join("") || `<p class="muted">Aucun ouvrage trouvé.</p>`;
      liste.querySelectorAll("[data-prix]").forEach((inp) => {
        inp.oninput = () => { const v = inp.value.trim(); if (v === "") delete etat.prix.perso[inp.dataset.prix]; else etat.prix.perso[inp.dataset.prix] = v.replace(",", "."); sauver(); };
      });
      liste.querySelectorAll("[data-ajout]").forEach((b) => {
        b.onclick = () => {
          const l = etat.prix.devis.lignes.find((x) => x.id === b.dataset.ajout);
          if (l) l.q = nombre(l.q) + 1; else etat.prix.devis.lignes.push({ id: b.dataset.ajout, q: 1 });
          sauver(); toast("Ajouté au devis ✓");
          const t = document.querySelector('.onglets a[href="#/prix/devis"]');
          if (t) t.textContent = `🧾 Faire un devis (${etat.prix.devis.lignes.length})`;
        };
      });
    };
    remplir("");
    document.getElementById("cherche").oninput = (e) => remplir(e.target.value);
  }

  function vueDevis(entete) {
    const d = etat.prix.devis;
    const options = PRIX.categories.map((c) => `<optgroup label="${esc(c.nom)}">${c.items.map((i) => `<option value="${i.id}">${esc(i.nom)} (${esc(i.unite)})</option>`).join("")}</optgroup>`).join("");
    app.innerHTML = entete + `
      <div class="carte">
        <div class="ligne espace no-print"><h2 style="margin:0">🧾 Devis estimatif</h2>
          <div class="ligne"><button class="btn sec" id="vider">Vider</button><button class="btn" id="imp">🖨️ Imprimer</button></div></div>
        <label class="petit muted" for="objet" style="display:block;margin-top:10px">Objet des travaux</label>
        <input class="champ" id="objet" value="${esc(d.objet)}" placeholder="Ex. : rénovation salle de bain, extension 20 m²…">
        <div class="table-wrap" style="margin-top:12px"><table>
          <thead><tr><th>Désignation</th><th>Unité</th><th>Quantité</th><th>PU HT</th><th>Total HT</th><th class="no-print"></th></tr></thead>
          <tbody id="lignes"></tbody></table></div>
        <div class="ligne no-print" style="margin-top:12px">
          <select class="champ" id="choix" style="flex:1;min-width:200px">${options}</select>
          <button class="btn sec" id="ajout">+ Ajouter la ligne</button>
        </div>
        <div class="form" style="margin-top:14px">
          <label>Aléas / imprévus (%)<input id="aleas" inputmode="decimal" value="${esc(d.aleas)}"></label>
          <label>TVA<select id="tva">${PRIX.tva.map((t) => `<option value="${t.taux}" ${nombre(d.tva) === t.taux ? "selected" : ""}>${esc(t.label)}</option>`).join("")}</select></label>
        </div>
        <div class="resultat" id="totaux" aria-live="polite"></div>
        <p class="muted petit" style="margin-top:10px">Estimation indicative, pas un devis engageant. Le taux de TVA réduit dépend de conditions (âge et usage du logement, nature des travaux, attestation du client) : vérifie-les avant de l'appliquer.</p>
      </div>`;
    const corps = document.getElementById("lignes");
    function totaux() {
      const ht = d.lignes.reduce((s, l) => { const it = itemPar(l.id); return s + (it ? nombre(l.q) * prixDe(it) : 0); }, 0);
      const al = ht * nombre(d.aleas) / 100;
      const base = ht + al, tva = base * nombre(d.tva) / 100;
      document.getElementById("totaux").innerHTML = `Total travaux HT : <b>${euros(ht)}</b><br>
        ${al ? `Aléas (${arrondi(nombre(d.aleas), 1)} %) : <b>${euros(al)}</b><br>Total HT avec aléas : <b>${euros(base)}</b><br>` : ""}
        TVA ${arrondi(nombre(d.tva), 1)} % : <b>${euros(tva)}</b><br>
        <span style="font-size:1.2rem">Total TTC : <b>${euros(base + tva)}</b></span>`;
    }
    function lignes() {
      corps.innerHTML = d.lignes.map((l, k) => {
        const it = itemPar(l.id); if (!it) return "";
        return `<tr><td>${esc(it.nom)}</td><td>${esc(it.unite)}</td>
          <td><input class="champ" style="width:84px;padding:6px 8px" inputmode="decimal" data-q="${k}" value="${esc(l.q)}" aria-label="Quantité"></td>
          <td style="white-space:nowrap">${euros(prixDe(it))}</td>
          <td style="white-space:nowrap" data-tot="${k}">${euros(nombre(l.q) * prixDe(it))}</td>
          <td class="no-print"><button class="btn sec" style="padding:4px 9px" data-suppr="${k}" aria-label="Supprimer la ligne">✕</button></td></tr>`;
      }).join("") || `<tr><td colspan="6" class="muted">Aucune ligne. Ajoute des ouvrages ci-dessous ou depuis la bibliothèque.</td></tr>`;
      corps.querySelectorAll("[data-q]").forEach((inp) => {
        inp.oninput = () => {
          const k = +inp.dataset.q; d.lignes[k].q = inp.value.replace(",", "."); sauver();
          const it = itemPar(d.lignes[k].id);
          corps.querySelector(`[data-tot="${k}"]`).textContent = euros(nombre(d.lignes[k].q) * prixDe(it));
          totaux();
        };
      });
      corps.querySelectorAll("[data-suppr]").forEach((b) => { b.onclick = () => { d.lignes.splice(+b.dataset.suppr, 1); sauver(); lignes(); }; });
      totaux();
    }
    document.getElementById("ajout").onclick = () => { const id = document.getElementById("choix").value; if (!d.lignes.some((l) => l.id === id)) d.lignes.push({ id, q: 1 }); sauver(); lignes(); };
    document.getElementById("objet").oninput = (e) => { d.objet = e.target.value; sauver(); };
    document.getElementById("aleas").oninput = (e) => { d.aleas = e.target.value.replace(",", "."); sauver(); totaux(); };
    document.getElementById("tva").onchange = (e) => { d.tva = e.target.value; sauver(); totaux(); };
    document.getElementById("imp").onclick = () => window.print();
    document.getElementById("vider").onclick = () => { d.lignes = []; d.objet = ""; document.getElementById("objet").value = ""; sauver(); lignes(); toast("Devis vidé"); };
    lignes();
  }

  function vueCalculPrix(entete) {
    app.innerHTML = entete + `
      <div class="grille large" style="align-items:start">
        <div class="carte lecon">
          <h2>Comment se construit un prix</h2>
          <p><b>Déboursé sec (DS)</b> = main-d'œuvre + matériaux + matériel + sous-traitance, pour l'ouvrage.</p>
          <p>On y ajoute les <b>frais de chantier</b> (installation, encadrement, grue, nettoyage…), puis un <b>coefficient</b> qui couvre les frais généraux de l'entreprise, les aléas et la marge.</p>
          <p><b>Prix de vente HT</b> = (DS + frais de chantier) × coefficient. Le <b>prix unitaire</b> = prix de vente ÷ quantité.</p>
          <div class="encadre terrain"><p style="margin:0">Le coefficient dépend de chaque entreprise (sa taille, ses frais, sa stratégie). Il se calcule à partir de ses comptes : demande-le au service études ou au comptable plutôt que de le deviner.</p></div>
        </div>
        <div class="carte">
          <h2>🧮 Calculer un prix unitaire</h2>
          <form class="form" id="f">
            <label>Ouvrage<input name="nom" value="Mur en blocs 20 cm"></label>
            <label>Quantité<input name="q" inputmode="decimal" value="50"></label>
            <label>Unité<input name="u" value="m²"></label>
            <label>Heures de main-d'œuvre<input name="h" inputmode="decimal" value="40"></label>
            <label>Coût horaire chargé (€/h)<input name="th" inputmode="decimal" value="35"></label>
            <label>Matériaux (€)<input name="mat" inputmode="decimal" value="1100"></label>
            <label>Matériel (€)<input name="mtl" inputmode="decimal" value="150"></label>
            <label>Sous-traitance (€)<input name="st" inputmode="decimal" value="0"></label>
            <label>Frais de chantier (% du DS)<input name="fc" inputmode="decimal" value="8"></label>
            <label>Coefficient (FG + aléas + marge)<input name="k" inputmode="decimal" value="1.25"></label>
          </form>
          <div class="resultat" id="res" aria-live="polite"></div>
        </div>
      </div>`;
    const f = document.getElementById("f");
    const maj = () => {
      const v = (k) => nombre(f.elements[k].value);
      const mo = v("h") * v("th");
      const ds = mo + v("mat") + v("mtl") + v("st");
      const fc = ds * v("fc") / 100;
      const pv = (ds + fc) * v("k");
      const q = v("q");
      document.getElementById("res").innerHTML = `Main-d'œuvre : <b>${euros(mo)}</b><br>
        Déboursé sec : <b>${euros(ds)}</b>${q ? ` (soit ${euros(ds / q)} / ${esc(f.elements.u.value)})` : ""}<br>
        Frais de chantier : <b>${euros(fc)}</b><br>
        Prix de vente HT : <b>${euros(pv)}</b><br>
        ${q ? `<span style="font-size:1.2rem">Prix unitaire HT : <b>${euros(pv / q)} / ${esc(f.elements.u.value)}</b></span><br>` : ""}
        <span class="muted petit">Marge brute avant frais généraux : ${euros(pv - ds - fc)} · Rendement : ${q && v("h") ? arrondi(q / v("h"), 2) + " " + esc(f.elements.u.value) + " par heure" : "—"}</span>`;
    };
    f.oninput = maj; f.onsubmit = (e) => e.preventDefault();
    maj();
  }

  /* ---------- Glossaire ---------- */
  function vueGlossaire() {
    const mots = OUTILS.glossaire.slice().sort((a, b) => a.mot.localeCompare(b.mot, "fr"));
    app.innerHTML = `
      <section class="hero"><span style="font-size:3.2rem" aria-hidden="true">📖</span>
        <div><h1>Glossaire BTP</h1><p>${mots.length} mots du chantier et des marchés, expliqués simplement.</p></div></section>
      <input class="champ" id="cherche" placeholder="Chercher un mot : DICT, OPR, banche, déboursé…" autocomplete="off">
      <div class="pile" id="liste" style="margin-top:14px"></div>`;
    const liste = document.getElementById("liste");
    const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const remplir = (f) => {
      const n = norm(f || "");
      const l = mots.filter((m) => !n || norm(m.mot + " " + m.def).includes(n));
      liste.innerHTML = l.map((m) => `<div class="carte"><b style="color:var(--jaune)">${esc(m.mot)}</b><br>${fmt(m.def)}</div>`).join("") || `<p class="muted">Aucun mot trouvé.</p>`;
    };
    remplir("");
    document.getElementById("cherche").oninput = (e) => remplir(e.target.value);
  }

  route();
})();
