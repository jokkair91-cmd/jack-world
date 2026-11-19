// Jack Blabla — application d'apprentissage des langues pour francophones.
// Aucune dépendance : HTML + CSS + JS. Les progrès sont gardés dans le navigateur.

const app = document.getElementById("app");
const statsEl = document.getElementById("stats");
const toastEl = document.getElementById("toast");

// ================= Sauvegarde =================
const CLE = "jackblabla-v1";
const etatParDefaut = () => ({ langue: null, xp: 0, serie: 0, dernierJour: null, cartes: {}, fait: {}, debloque: {}, niveauChoisi: {}, parcours: {} });
let etat = charger();

function charger() {
  try {
    const brut = localStorage.getItem(CLE);
    return brut ? { ...etatParDefaut(), ...JSON.parse(brut) } : etatParDefaut();
  } catch { return etatParDefaut(); }
}
function sauver() {
  try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch { /* stockage indisponible : on continue sans */ }
  afficherStats();
}
function gagnerXp(n) {
  if (n <= 0) return;
  const jour = new Date().toISOString().slice(0, 10);
  if (etat.dernierJour !== jour) {
    const hier = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    etat.serie = etat.dernierJour === hier ? etat.serie + 1 : 1;
    etat.dernierJour = jour;
  }
  etat.xp += n;
  sauver();
  toast(`+${n} XP 🎉`);
}
function marquer(cle, champ, valeur) {
  etat.fait[cle] = { ...(etat.fait[cle] || {}), [champ]: valeur };
  sauver();
}
const fait = (cle) => etat.fait[cle] || {};
const niveauDebloque = () => etat.debloque[etat.langue] || 0;
const niveauChoisi = () => Math.min(etat.niveauChoisi[etat.langue] || 0, niveauDebloque());
const C = () => CONTENU[etat.langue];
const L = () => LANGUES[etat.langue];

function afficherStats() {
  const n = etat.langue ? `<span class="pastille">${NIVEAUX[niveauChoisi()].emoji} ${NIVEAUX[niveauChoisi()].nom}</span>` : "";
  statsEl.innerHTML = `<span title="Série de jours">🔥 ${etat.serie}</span><span title="Points d'expérience">⭐ ${etat.xp}</span>${n}`;
  // Drapeau de la langue en cours, à côté du logo
  const marque = document.getElementById("country-brand");
  if (marque) {
    const montrer = etat.langue && vue.nom !== "accueil";
    marque.hidden = !montrer;
    marque.innerHTML = montrer ? badgePays(etat.langue, "mini") : "";
    marque.setAttribute("aria-label", montrer ? L().nom : "");
    marque.title = montrer ? L().nom : "";
  }
}

// ================= Outils =================
function toast(texte) {
  toastEl.textContent = texte;
  toastEl.classList.add("visible");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => toastEl.classList.remove("visible"), 1600);
}
function melanger(liste) {
  const a = [...liste];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const hasard = (liste) => liste[Math.floor(Math.random() * liste.length)];
function echap(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function normaliser(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}
function ressemblance(a, b) {
  a = normaliser(a); b = normaliser(b);
  if (!a.length && !b.length) return 1;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return 1 - d[a.length][b.length] / Math.max(a.length, b.length);
}
// Réponse tapée : "ok" (parfait), "accents" (juste mais accents/ß oubliés), "ko"
function verifier(saisie, attendu) {
  const propre = (s) => s.trim().toLowerCase().replace(/[.!?¡¿,]/g, "").replace(/\s+/g, " ");
  const options = attendu.split("/").map(propre);
  const s = propre(saisie);
  if (options.includes(s)) return "ok";
  if (s && options.some((o) => normaliser(o) === normaliser(s))) return "accents";
  return "ko";
}
// Pronom + verbe à l'oral : en français, « je » s'élide devant une voyelle (j'aime, j'ai)
const avecPronom = (pro, forme) => {
  const p = pro.split("/")[0];
  return etat.langue === "fr" && p === "je" && /^[aeéèêiîoôuûhy]/i.test(forme) ? `j'${forme}` : `${p} ${forme}`;
};
const barre = (p) => `<div class="barre" aria-label="Progression ${Math.round(p)}%"><div style="width:${p}%"></div></div>`;

// ================= Voix =================
// Les voix viennent de l'ordinateur (Windows) ou du navigateur (Chrome/Edge en ligne).
// Elles arrivent parfois en retard : on les recharge quand le navigateur les annonce.
let VOIX = [];
function chargerVoix() { if ("speechSynthesis" in window) VOIX = speechSynthesis.getVoices(); }
if ("speechSynthesis" in window) {
  chargerVoix();
  speechSynthesis.addEventListener?.("voiceschanged", chargerVoix);
}
// Meilleure voix pour une langue : accent exact d'abord, puis les voix naturelles/Google.
function voixPour(langue) {
  if (!VOIX.length) chargerVoix();
  const code = LANGUES[langue].voix.toLowerCase();
  const prefixe = code.slice(0, 2);
  const candidates = VOIX.filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith(prefixe));
  const note = (v) => (v.lang.toLowerCase().replace("_", "-") === code ? 4 : 0)
    + (/natural|neural|online/i.test(v.name) ? 3 : 0) + (/google/i.test(v.name) ? 2 : 0);
  return candidates.sort((a, b) => note(b) - note(a))[0] || null;
}
let avertiSansVoix = {};
function parler(texte, langue = etat.langue) {
  if (!texte) return;
  if (!("speechSynthesis" in window)) { toast("🔇 Ce navigateur ne sait pas parler. Essaie Chrome ou Edge."); return; }
  const voix = voixPour(langue);
  if (!voix) {
    // Pas de voix pour cette langue : on prévient au lieu de rester muet
    if (!avertiSansVoix[langue]) { avertiSansVoix[langue] = true; aideSon(langue); }
    else toast(`🔇 Pas de voix ${LANGUES[langue].adj} installée — clique sur « Pas de son ? »`);
    return;
  }
  const u = new SpeechSynthesisUtterance(texte.replace(/…|___/g, " ").replace(/\(.*?\)/g, ""));
  u.voice = voix;
  u.lang = voix.lang;
  u.rate = 0.9;
  speechSynthesis.cancel();
  // Bug connu de Chrome : un speak() juste après cancel() peut rester muet → petit délai
  setTimeout(() => { speechSynthesis.resume(); speechSynthesis.speak(u); }, 60);
}

// ================= Explications (écrites et vocales) =================
// Jack explique en français ce qui ne va pas, puis redit la bonne réponse dans la langue étudiée.
// Réglable dans le hub : « 🗣️ Explications à voix haute ».
const explicVoix = () => etat.explicVoix !== false;
const texteSeul = (html) => String(html || "").replace(/<br\s*\/?>/gi, ". ").replace(/<[^>]+>/g, "").replace(/___/g, "…").replace(/\s+/g, " ").trim();
// Dit plusieurs morceaux à la suite, chacun avec la voix de sa langue : [[texte, langue], …]
function direSuite(parts) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  setTimeout(() => {
    speechSynthesis.resume();
    parts.forEach(([txt, lg]) => {
      const voix = voixPour(lg);
      const t = texteSeul(txt).replace(/…/g, " ");
      if (!voix || !t) return;
      const u = new SpeechSynthesisUtterance(t);
      u.voice = voix; u.lang = voix.lang; u.rate = lg === "fr" ? 1 : 0.9;
      speechSynthesis.speak(u);
    });
  }, 60);
}
// Correction après une erreur : bloc écrit + explication orale
function correction(bonne, pourquoi) {
  if (explicVoix()) direSuite([["La bonne réponse est :", "fr"], [bonne, etat.langue], [pourquoi, "fr"]]);
  else parler(bonne);
  return pourquoi ? `<div class="explic">💡 <b>Pourquoi ?</b> ${pourquoi}</div>` : "";
}
// La règle d'une leçon de grammaire, en une phrase (sert d'explication par défaut)
function regleDe(lecon) {
  if (lecon.astuce) return lecon.astuce;
  const plus = typeof COURS_PLUS !== "undefined" && (COURS_PLUS[etat.langue] || {})[lecon.id];
  if (plus && plus.retenir) return plus.retenir;
  return lecon.explication.split(/<br\s*\/?>/i)[0].replace(/<[^>]+>/g, "").trim();
}

// Fenêtre d'aide quand il n'y a pas de son
function aideSon(langue = etat.langue) {
  const l = LANGUES[langue];
  const voix = voixPour(langue);
  const dejaOuverte = document.getElementById("aide-son");
  if (dejaOuverte) dejaOuverte.remove();
  const d = document.createElement("div");
  d.id = "aide-son";
  d.className = "aide-son";
  d.setAttribute("role", "dialog");
  d.setAttribute("aria-label", "Aide pour le son");
  d.innerHTML = `
    <div class="card">
      <h2>🔊 Le son de Jack</h2>
      ${voix
        ? `<p>✅ Voix ${l.adj} trouvée : <b>${echap(voix.name)}</b>. Si tu n'entends rien, vérifie le volume de l'ordinateur et que l'onglet n'est pas en sourdine.</p>
           <button class="btn" id="aide-test">▶️ Tester : « ${echap(l.bonjour)} »</button>`
        : `<p>❌ <b>Aucune voix ${l.adj}</b> n'est disponible sur cet appareil : Jack ne peut pas prononcer les mots.</p>
           <p><b>Solution la plus simple :</b> ouvre Jack Blabla dans <b>Google Chrome</b> ou <b>Microsoft Edge</b>, qui ont des voix en ligne pour toutes les langues.</p>
           <p><b>Ou installe la voix sur Windows :</b><br>Paramètres → Heure et langue → Voix → <i>Ajouter des voix</i> → choisis « ${l.nom} ». Puis recharge la page.</p>`}
      <p class="muted">Voix disponibles ici : ${VOIX.length ? [...new Set(VOIX.map((v) => v.lang))].join(", ") : "aucune"}</p>
      <button class="btn secondaire" id="aide-fermer">Fermer</button>
    </div>`;
  document.body.appendChild(d);
  d.onclick = (e) => { if (e.target === d) d.remove(); };
  document.getElementById("aide-fermer").onclick = () => d.remove();
  const t = document.getElementById("aide-test");
  if (t) t.onclick = () => parler(l.bonjour, langue);
}
const Reconnaissance = window.SpeechRecognition || window.webkitSpeechRecognition;

// ================= Navigation =================
let vue = { nom: "accueil" };
function aller(v) {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  vue = v;
  rendre();
  window.scrollTo(0, 0);
}
document.getElementById("btn-home").onclick = () => aller(etat.langue ? { nom: "hub" } : { nom: "accueil" });

function rendre() {
  afficherStats();
  if (vue.nom === "accueil" || !etat.langue) return vueAccueil();
  const vues = { hub: vueHub, theme: vueTheme, grammaire: vueGrammaire, quizgram: vueQuizGrammaire, conjugaison: vueConjugaison, irreguliers: vueIrreguliers, test: vueTest, parcours: vueParcours, revision: vueRevision };
  (vues[vue.nom] || vueHub)();
}
const boutonRetour = (texte = "← Retour") => `<button class="retour" id="retour">${texte}</button>`;
function brancherRetour() { const b = document.getElementById("retour"); if (b) b.onclick = () => aller({ nom: "hub" }); }

// ================= Accueil : choix de la langue =================
function vueAccueil() {
  app.innerHTML = `
    <section class="accueil-jungle" aria-label="Bienvenue">
      <div class="accueil-texte">
        <h1>Salut, moi c'est <span>Jack</span>&nbsp;!</h1>
        <div class="bulle">Le perroquet qui t'apprend à blablater 🦜</div>
        <p class="accroche">Anglais, espagnol, allemand, italien, portugais : du premier « bonjour » jusqu'au niveau professionnel, en 6 niveaux et un parcours de 6 mois. Leçons, quiz, conjugaison, et des conversations avec moi !</p>
        <button class="btn" id="commencer">Choisir ma langue ↓</button>
      </div>
    </section>
    <h2 class="section" id="langues">Quelle langue veux-tu apprendre ?</h2>
    <div class="grid grid-3">
      ${Object.entries(LANGUES).map(([code, l]) => `
        <button class="tile tile-pays" data-langue="${code}" style="--pays:${l.couleur}">
          ${badgePays(code)}
          <span class="titre">${l.nom} <span class="nom-local">${l.nomLocal}</span></span>
          <span class="bulle-pays">${l.bonjour}</span>
          <span class="sous">${NIVEAUX[etat.debloque[code] || 0].emoji} Niveau ${NIVEAUX[etat.debloque[code] || 0].nom}</span>
        </button>`).join("")}
    </div>
    <p class="muted" style="margin-top:22px">🇫🇷 <b>Français</b> : pour maîtriser l'orthographe, la grammaire et la conjugaison, comme avec un Bescherelle. Bientôt : chinois…</p>`;
  document.getElementById("commencer").onclick = () =>
    document.getElementById("langues").scrollIntoView({ behavior: "smooth", block: "start" });
  app.querySelectorAll("[data-langue]").forEach((b) => b.onclick = () => {
    etat.langue = b.dataset.langue;
    sauver();
    parler(L().bonjour);
    aller({ nom: "hub" });
  });
}

// ================= Progression =================
function progressionTheme(theme) {
  const f = fait(`${etat.langue}:${theme.id}`);
  const max = theme.dialogue ? 100 : 75;
  let p = 0;
  if (f.lecon) p += 25;
  if (f.quiz) p += 25 * f.quiz;
  if (f.parler) p += 25;
  if (f.dialogue && theme.dialogue) p += 25;
  return Math.min(100, (p / max) * 100);
}
const scoreGrammaire = (g) => (fait(`${etat.langue}:g:${g.id}`).score || 0) * 100;
function progressionNiveau(n) {
  const items = [
    ...C().themes.filter((t) => t.niveau === n).map(progressionTheme),
    // Une leçon = 30 % pour la lecture du cours + 70 % pour le quiz
    ...C().grammaire.filter((g) => g.niveau === n).map((g) => (fait(`${etat.langue}:g:${g.id}`).lu ? 30 : 0) + scoreGrammaire(g) * 0.7),
  ];
  return items.length ? items.reduce((a, b) => a + b, 0) / items.length : 0;
}
function cartesDues(theme) {
  const now = Date.now();
  return theme.mots.filter((_, i) => {
    const c = etat.cartes[`${etat.langue}:${theme.id}:${i}`];
    return !c || c.prochain <= now;
  }).length;
}

// ================= Hub d'une langue =================
function vueHub() {
  const n = niveauChoisi();
  const max = niveauDebloque();
  const themes = C().themes.filter((t) => t.niveau === n);
  const lecons = C().grammaire.filter((g) => g.niveau === n);
  const nbVerbes = C().verbes.filter((v) => v.niveau <= n).length;
  const nbIrr = C().irreguliers.lignes.filter((r) => r[r.length - 1] <= n).length;
  const tempsDispo = C().temps.filter((t) => t.niveau <= n).map((t) => t.nom.split(" (")[0]).join(", ");
  const prog = progressionNiveau(n);
  const etape = ["cours", "quiz", "test"].includes(etat.etape) ? etat.etape : "cours";

  app.innerHTML = `
    <div class="rangee" style="justify-content:space-between">
      <button class="retour" id="changer">← Changer de langue</button>
      <span class="rangee">
        <button class="lien-son" id="explic-voix" aria-pressed="${explicVoix()}">${explicVoix() ? "🗣️ Explications à voix haute : oui" : "🤫 Explications à voix haute : non"}</button>
        <button class="lien-son" id="pas-de-son">${voixPour(etat.langue) ? "🔊 Tester le son" : "🔇 Pas de son ?"}</button>
      </span>
    </div>
    <div class="titre-jack">
      <span class="avatar-jack" aria-hidden="true"></span>
      <div>
        <h1 class="titre-pays">${badgePays(etat.langue, "petit")} ${L().nom}</h1>
        <div class="bulle" style="margin-top:6px">${hasard(["On continue ? Je suis prêt !", "Un petit quiz aujourd'hui ?", "Blabla time ! 🦜", "Chaque jour un peu, et ça rentre !"])}</div>
      </div>
    </div>

    <button class="tile parcours-carte" id="parcours" style="margin-top:16px">
      <span class="big">🗓️</span>
      <span style="flex:1"><span class="titre">Mon parcours 6 mois · ${parcoursEtat().debut ? `semaine ${parcoursEtat().semaine}/${PARCOURS_TOTAL}` : "pas encore commencé"}</span><br>
        <span class="sous">Ta séance du jour : révision, leçon, grammaire. ${cartesARevoir().length} carte${cartesARevoir().length > 1 ? "s" : ""} à revoir.</span></span>
      <span class="btn">Ma séance →</span>
    </button>

    <div class="niveaux" role="tablist">
      ${NIVEAUX.map((niv, i) => `
        <button class="niveau ${i === n ? "actif" : ""} ${i > max ? "verrou" : ""}" data-niveau="${i}" role="tab" aria-selected="${i === n}">
          <span class="niv-emoji">${i > max ? "🔒" : niv.emoji}</span>
          <span><b>${niv.nom}</b><br><small>${niv.code}</small></span>
        </button>`).join("")}
    </div>

    <div class="card intro-niveau">
      <div class="rangee" style="justify-content:space-between">
        <div><b>${NIVEAUX[n].emoji} Niveau ${NIVEAUX[n].nom}</b> — <span class="muted">${NIVEAUX[n].desc}</span></div>
        <b>${Math.round(prog)} %</b>
      </div>
      ${barre(prog)}
    </div>

    <nav class="etapes" aria-label="Étapes du niveau">
      ${[["cours", "①", "📖 Cours", "Lire et comprendre"], ["quiz", "②", "✅ Quiz", "S'entraîner"], ["test", "③", "🎓 Test", n < NIVEAUX.length - 1 ? `Passer en ${NIVEAUX[n + 1].nom}` : "Diplôme final"]]
        .map(([id, num, nom, sous]) => `
        <button class="etape ${etape === id ? "actif" : ""}" data-etape="${id}" aria-pressed="${etape === id}">
          <span class="etape-num">${num}</span><span><b>${nom}</b><br><small>${sous}</small></span>
        </button>`).join("")}
    </nav>
    <section id="etape">${{ cours: etapeCours, quiz: etapeQuiz, test: etapeTest }[etape](n, max, { themes, lecons, nbVerbes, nbIrr, tempsDispo, prog })}</section>`;

  document.getElementById("changer").onclick = () => aller({ nom: "accueil" });
  document.getElementById("parcours").onclick = () => aller({ nom: "parcours" });
  document.getElementById("explic-voix").onclick = () => { etat.explicVoix = !explicVoix(); sauver(); vueHub(); };
  document.getElementById("pas-de-son").onclick = () => aideSon();
  app.querySelectorAll("[data-niveau]").forEach((b) => b.onclick = () => {
    const i = +b.dataset.niveau;
    if (i > max) {
      toast(`🔒 Réussis le test du niveau ${NIVEAUX[i - 1].nom} pour débloquer ${NIVEAUX[i].nom}`);
      return;
    }
    etat.niveauChoisi[etat.langue] = i;
    sauver();
    vueHub();
  });
  app.querySelectorAll("[data-etape]").forEach((b) => b.onclick = () => { etat.etape = b.dataset.etape; sauver(); vueHub(); });
  const t = document.getElementById("test");
  if (t) t.onclick = () => aller({ nom: "test", niveau: n });
  app.querySelectorAll("[data-theme]").forEach((b) => b.onclick = () => aller({ nom: "theme", theme: b.dataset.theme, onglet: b.dataset.onglet || "lecon" }));
  app.querySelectorAll("[data-lecon]").forEach((b) => b.onclick = () => aller({ nom: "grammaire", id: b.dataset.lecon }));
  app.querySelectorAll("[data-quizgram]").forEach((b) => b.onclick = () => aller({ nom: "quizgram", id: b.dataset.quizgram }));
  app.querySelectorAll("[data-aller]").forEach((b) => b.onclick = () => {
    const [nom, drill] = b.dataset.aller.split(":");
    aller({ nom, drill: drill === "drill" });
  });
}

// ---------- Étape ① : les cours écrits du niveau ----------
function etapeCours(n, max, { themes, lecons, nbVerbes, nbIrr, tempsDispo }) {
  const lus = lecons.filter((g) => fait(`${etat.langue}:g:${g.id}`).lu).length;
  return `
    <div class="card conseil">📖 <b>Commence ici.</b> Chaque cours s'explique par écrit : la règle, <b>pourquoi</b> on dit comme ça, ce qu'il faut <b>faire</b> et <b>ne pas faire</b>, avec des exemples traduits. Le son est en option.</div>
    <h2 class="section">📐 Cours de grammaire <small class="muted">${lus}/${lecons.length} lus</small></h2>
    <div class="liste">
      ${lecons.map((g, i) => {
        const lu = fait(`${etat.langue}:g:${g.id}`).lu;
        return `
        <button class="ligne" data-lecon="${g.id}">
          <span class="num">${i + 1}</span>
          <span class="ligne-titre">${g.titre}<br><small class="muted">${echap(regleDe(g)).slice(0, 110)}${regleDe(g).length > 110 ? "…" : ""}</small></span>
          <span class="ligne-etat">${lu ? "📖 lu" : "Lire →"}</span>
        </button>`;
      }).join("")}
    </div>
    <h2 class="section">📚 Fiches de vocabulaire</h2>
    <div class="grid grid-2">
      ${themes.map((t) => `
        <button class="tile" data-theme="${t.id}" data-onglet="lecon">
          <span class="big">${t.emoji}</span>
          <span class="titre">${t.titre}</span>
          <span class="sous">${t.mots.length} mots et expressions à lire</span>
          ${fait(cleTheme(t)).lecon ? `<span class="pastille ok">📖 lue</span>` : ""}
        </button>`).join("")}
    </div>
    <h2 class="section">🔤 Fiches de conjugaison</h2>
    <div class="grid grid-2">
      <button class="tile" data-aller="conjugaison">
        <span class="big">🔤</span><span class="titre">Tableaux de conjugaison</span>
        <span class="sous">${nbVerbes} verbes · ${tempsDispo}</span>
      </button>
      <button class="tile" data-aller="irreguliers">
        <span class="big">⚡</span><span class="titre">Verbes irréguliers</span>
        <span class="sous">${nbIrr} verbes à connaître par cœur</span>
      </button>
    </div>`;
}

// ---------- Étape ② : les quiz du niveau (séparés des cours) ----------
function etapeQuiz(n, max, { themes, lecons }) {
  return `
    <div class="card conseil">✅ <b>Entraîne-toi</b> après avoir lu les cours. À chaque erreur, Jack t'explique pourquoi. Vise <b>80 %</b> partout avant le test.</div>
    <h2 class="section">📐 Quiz de grammaire</h2>
    <div class="liste">
      ${lecons.map((g, i) => {
        const s = scoreGrammaire(g);
        return `
        <button class="ligne" data-quizgram="${g.id}">
          <span class="num">${i + 1}</span>
          <span class="ligne-titre">${g.titre} <small class="muted">· ${g.exercices.length} questions</small></span>
          <span class="ligne-etat">${s >= 80 ? "✅" : s > 0 ? `${Math.round(s)} %` : "Jouer →"}</span>
        </button>`;
      }).join("")}
    </div>
    <h2 class="section">📚 Quiz de vocabulaire</h2>
    <div class="grid grid-2">
      ${themes.map((t) => {
        const dues = cartesDues(t);
        return `
        <button class="tile" data-theme="${t.id}" data-onglet="quiz">
          <span class="big">${t.emoji}</span>
          <span class="titre">${t.titre}</span>
          <span class="sous">Quiz, cartes (${dues} à revoir), parler${t.dialogue ? ", dialogue" : ""}</span>
          ${barre(progressionTheme(t))}
        </button>`;
      }).join("")}
    </div>
    <h2 class="section">🔤 Entraînements verbes</h2>
    <div class="grid grid-2">
      <button class="tile" data-aller="conjugaison:drill"><span class="big">✏️</span><span class="titre">Conjugaison</span><span class="sous">10 formes à écrire</span></button>
      <button class="tile" data-aller="irreguliers:drill"><span class="big">⚡</span><span class="titre">Irréguliers</span><span class="sous">10 formes à écrire</span></button>
    </div>`;
}

// ---------- Étape ③ : le test de passage ----------
function etapeTest(n, max, { themes, lecons, prog }) {
  const dernier = n === NIVEAUX.length - 1;
  const suivant = NIVEAUX[n + 1];
  const lus = lecons.filter((g) => fait(`${etat.langue}:g:${g.id}`).lu).length;
  const quizOk = lecons.filter((g) => scoreGrammaire(g) >= 80).length;
  const vocOk = themes.filter((t) => (fait(cleTheme(t)).quiz || 0) >= 0.8).length;
  const valide = dernier ? (etat.diplome || {})[etat.langue] : n < max;
  const coche = (ok) => (ok ? "✅" : "⬜");
  return `
    <div class="card test-carte">
      <h2 style="margin-top:0">🎓 ${dernier ? `Test final · Diplôme ${L().nom} ${NIVEAUX[n].nom}` : `Test de passage : ${NIVEAUX[n].nom} → ${suivant.emoji} ${suivant.nom}`}</h2>
      ${valide ? `<p class="feedback ok">✅ ${dernier ? "Diplôme obtenu ! Tu peux repasser le test pour t'entraîner." : `Niveau déjà validé : ${suivant.nom} est débloqué. Tu peux repasser le test pour t'entraîner.`}</p>` : ""}
      <p><b>12 questions</b> mélangées : vocabulaire, grammaire et conjugaison du niveau ${NIVEAUX[n].nom}. Il faut <b>${SEUIL_TEST_12}/12</b> pour réussir${dernier ? " et obtenir ton diplôme" : ` et débloquer le niveau <b>${suivant.nom}</b>`}.</p>
      <h3>Es-tu prêt ?</h3>
      <ul class="check">
        <li>${coche(lus === lecons.length)} Cours lus : <b>${lus}/${lecons.length}</b></li>
        <li>${coche(quizOk === lecons.length)} Quiz de grammaire à 80 % : <b>${quizOk}/${lecons.length}</b></li>
        <li>${coche(vocOk === themes.length)} Quiz de vocabulaire à 80 % : <b>${vocOk}/${themes.length}</b></li>
        <li>${coche(prog >= 80)} Progression du niveau : <b>${Math.round(prog)} %</b></li>
      </ul>
      <p class="muted">${prog >= 80 ? "Tu as tout ce qu'il faut. Bonne chance ! 🍀" : "Conseil : termine les cours et les quiz avant. Mais tu peux tenter le test quand tu veux."}</p>
      <button class="btn" id="test">🎓 Commencer le test</button>
    </div>`;
}

// ================= QCM générique =================
// questions : [{ consigne, question (html), choix: [...], bonne, audioQuestion?, audioReponse?, fr? }]
function lancerQcm(zone, questions, onFin) {
  let n = 0, score = 0;
  function poser() {
    if (n >= questions.length) return onFin(score, questions.length);
    const q = questions[n];
    zone.innerHTML = `
      ${barre((n / questions.length) * 100)}
      <p class="muted" style="margin-bottom:0">${q.consigne}</p>
      <div class="question rangee">${q.question}
        ${q.audioQuestion ? `<button class="hp" id="ecouter" aria-label="Écouter">🔊</button>` : ""}</div>
      <div class="choix">${q.choix.map((c, i) => `<button data-i="${i}">${echap(c)}</button>`).join("")}</div>
      <div id="suite"></div>`;
    if (q.audioQuestion) { parler(q.audioQuestion); document.getElementById("ecouter").onclick = () => parler(q.audioQuestion); }
    zone.querySelectorAll(".choix button").forEach((b) => b.onclick = () => {
      const ok = q.choix[b.dataset.i] === q.bonne;
      if (ok) score++;
      zone.querySelectorAll(".choix button").forEach((x) => {
        x.disabled = true;
        if (q.choix[x.dataset.i] === q.bonne) x.classList.add("bon");
      });
      if (!ok) b.classList.add("faux");
      let explic = "";
      if (ok) { if (q.audioReponse) parler(q.audioReponse); }
      else explic = correction(q.audioReponse || q.bonne, q.pourquoi);
      document.getElementById("suite").innerHTML = `
        <div class="feedback ${ok ? "ok" : "ko"}">${ok ? "Bravo ! 🎉" : `Presque ! La bonne réponse : <b>${echap(q.bonne)}</b>`}
          ${q.fr ? `<div class="trad-fb">En français : ${echap(q.fr)}</div>` : ""}${explic}</div>
        <div class="rangee" style="margin-top:14px"><button class="btn" id="continuer">Continuer</button></div>`;
      const c = document.getElementById("continuer");
      c.focus();
      c.onclick = () => { n++; poser(); };
    });
  }
  poser();
}

// ================= Exercice à taper (conjugaison, irréguliers) =================
// items : [{ consigne (html), attendu, audio? }]
function lancerSaisie(zone, items, onFin) {
  let n = 0, score = 0;
  const accents = L().accents;
  function poser() {
    if (n >= items.length) return onFin(score, items.length);
    const it = items[n];
    zone.innerHTML = `
      ${barre((n / items.length) * 100)}
      <div class="card" style="margin-top:16px">
        <div class="consigne">${it.consigne}</div>
        <form id="form" class="rangee" autocomplete="off">
          <input id="rep" class="saisie" type="text" autocapitalize="off" spellcheck="false" placeholder="Écris ta réponse…" aria-label="Ta réponse">
          <button class="btn" type="submit">Valider</button>
        </form>
        ${accents.length ? `<div class="accents">${accents.map((a) => `<button type="button" data-a="${a}">${a}</button>`).join("")}</div>` : ""}
        <div id="suite"></div>
      </div>`;
    const input = document.getElementById("rep");
    input.focus();
    zone.querySelectorAll("[data-a]").forEach((b) => b.onclick = () => {
      const p = input.selectionStart ?? input.value.length;
      input.value = input.value.slice(0, p) + b.dataset.a + input.value.slice(input.selectionEnd ?? p);
      input.focus();
      input.setSelectionRange(p + 1, p + 1);
    });
    let repondu = false;
    document.getElementById("form").onsubmit = (e) => {
      e.preventDefault();
      if (repondu) return;
      repondu = true;
      input.disabled = true;
      const r = verifier(input.value, it.attendu);
      if (r !== "ko") score++;
      let explic = "";
      if (r === "ok") { if (it.audio) parler(it.audio); }
      else explic = correction(it.audio || it.attendu, (r === "accents" ? "Attention aux accents : ils changent la prononciation et parfois le sens. " : `Tu as écrit « ${echap(input.value.trim() || "rien")} ». `) + (it.pourquoi || ""));
      document.getElementById("suite").innerHTML = `
        <div class="feedback ${r === "ko" ? "ko" : "ok"}">
          ${r === "ok" ? "Parfait ! 🎉" : r === "accents" ? `Bien ! Attention aux accents : <b>${echap(it.attendu)}</b>` : `La bonne réponse : <b>${echap(it.attendu)}</b>`}
          ${explic}
        </div>
        <div class="rangee" style="margin-top:14px"><button class="btn" id="continuer">Continuer</button></div>`;
      const c = document.getElementById("continuer");
      c.focus();
      c.onclick = () => { n++; poser(); };
    };
  }
  poser();
}

function ecranResultat(zone, { score, total, messages, boutons }) {
  const ratio = score / total;
  zone.innerHTML = `
    <div class="card resultat">
      <div class="big">${ratio >= .8 ? "🏆" : ratio >= .5 ? "👍" : "💪"}</div>
      <h2>${score} / ${total}</h2>
      <p>${ratio >= .8 ? messages[0] : ratio >= .5 ? messages[1] : messages[2]}</p>
      <div class="rangee" style="justify-content:center">
        ${boutons.map((b, i) => `<button class="btn ${b.secondaire ? "secondaire" : ""}" data-b="${i}">${b.texte}</button>`).join("")}
      </div>
    </div>`;
  zone.querySelectorAll("[data-b]").forEach((el) => el.onclick = boutons[el.dataset.b].action);
}
const MSG_DEFAUT = ["Excellent ! Jack est fier de toi.", "Pas mal du tout ! Encore un petit effort.", "Ce n'est que le début. Revois la leçon et réessaie !"];

// ================= Thème de vocabulaire =================
function vueTheme() {
  const t = C().themes.find((x) => x.id === vue.theme);
  const onglets = [["lecon", "📖 Fiche à lire"], ["quiz", "✅ Quiz"], ["cartes", "🃏 Cartes"], ["parler", "🎤 Parler"]];
  if (t.dialogue) onglets.push(["blabla", "💬 Blabla avec Jack"]);
  app.innerHTML = `
    ${boutonRetour(`← ${L().nom} · ${NIVEAUX[t.niveau].nom}`)}
    <h1>${t.emoji} ${t.titre}</h1>
    <nav class="onglets">
      ${onglets.map(([id, nom]) => `<button class="onglet ${vue.onglet === id ? "actif" : ""}" data-onglet="${id}">${nom}</button>`).join("")}
    </nav>
    <section id="zone"></section>`;
  brancherRetour();
  app.querySelectorAll("[data-onglet]").forEach((b) => b.onclick = () => aller({ ...vue, onglet: b.dataset.onglet }));
  const zone = document.getElementById("zone");
  ({ lecon: ongletLecon, quiz: ongletQuiz, cartes: ongletCartes, parler: ongletParler, blabla: ongletBlabla })[vue.onglet](zone, t);
}
const cleTheme = (t) => `${etat.langue}:${t.id}`;

function ongletLecon(zone, t) {
  zone.innerHTML = `
    <div class="card">
      <div class="rangee" style="justify-content:space-between; margin-bottom:6px">
        <p class="muted" style="margin:0">Écoute chaque mot 🔊 et répète-le à voix haute.</p>
        <span class="rangee"><button class="lien-son" id="toute-lecon">🔊 Écouter toute la leçon</button><button class="lien-son" id="pas-de-son">Pas de son ?</button></span>
      </div>
      ${t.mots.map(([fr, cible], i) => `
        <div class="mot">
          <div><div class="cible">${echap(cible)}</div><div class="fr">${echap(fr)}</div></div>
          <button class="hp" data-i="${i}" aria-label="Écouter ${echap(cible)}">🔊</button>
        </div>`).join("")}
    </div>
    <div class="rangee" style="margin-top:18px"><button class="btn" id="fini">J'ai appris ces mots → Quiz</button></div>`;
  zone.querySelectorAll(".hp").forEach((b) => b.onclick = () => parler(t.mots[b.dataset.i][1]));
  // Toute la leçon à l'oral : chaque mot dans la langue étudiée, puis sa traduction en français
  document.getElementById("toute-lecon").onclick = () => direSuite([
    [`Leçon : ${t.titre}. Répète après moi.`, "fr"],
    ...t.mots.flatMap(([fr, cible]) => [[cible, etat.langue], [fr, "fr"]]),
  ]);
  document.getElementById("pas-de-son").onclick = () => aideSon();
  document.getElementById("fini").onclick = () => {
    if (!fait(cleTheme(t)).lecon) { marquer(cleTheme(t), "lecon", true); gagnerXp(5); }
    aller({ ...vue, onglet: "quiz" });
  };
}

function questionsVocab(mots, nb) {
  return melanger(mots.map((_, i) => i)).slice(0, nb).map((i, k) => {
    const versCible = k % 2 === 0;
    const [fr, cible] = mots[i];
    const autres = melanger(mots.filter((_, j) => j !== i)).slice(0, 3);
    const bonne = versCible ? cible : fr;
    const fr_ = etat.langue === "fr";
    return {
      consigne: fr_ ? (versCible ? "Quelle est la bonne écriture ?" : "Dans quel cas écrit-on :") : versCible ? `Comment dit-on en ${L().nom.toLowerCase()} ?` : "Que veut dire ?",
      question: echap(versCible ? fr : cible),
      choix: melanger([bonne, ...autres.map(([f, c]) => (versCible ? c : f))]),
      bonne,
      audioQuestion: versCible ? null : cible,
      audioReponse: cible,
      pourquoi: etat.langue === "fr"
        ? `La bonne forme est « ${echap(cible)} » : ${echap(fr)}. Relis-la et écris-la une fois pour la retenir.`
        : `« ${echap(cible)} » veut dire « ${echap(fr)} ». Écoute-le et répète-le à voix haute pour le retenir.`,
    };
  });
}

function ongletQuiz(zone, t) {
  lancerQcm(zone, questionsVocab(t.mots, 8), (score, total) => {
    const ratio = score / total;
    if (ratio > (fait(cleTheme(t)).quiz || 0)) marquer(cleTheme(t), "quiz", ratio);
    gagnerXp(score * 2);
    ecranResultat(zone, { score, total, messages: MSG_DEFAUT, boutons: [
      { texte: "Rejouer", secondaire: true, action: () => ongletQuiz(zone, t) },
      { texte: "Cartes mémoire →", action: () => aller({ ...vue, onglet: "cartes" }) },
    ] });
  });
}

// --- Cartes mémoire : répétition espacée (boîtes de Leitner)
const INTERVALLES_JOURS = [0, 1, 3, 7, 14, 30];
function ongletCartes(zone, t) {
  const now = Date.now();
  const file = melanger(t.mots.map((_, i) => i).filter((i) => {
    const c = etat.cartes[`${etat.langue}:${t.id}:${i}`];
    return !c || c.prochain <= now;
  }));
  let k = 0, retournee = false, sues = 0, silence = false;

  function montrer() {
    if (k >= file.length) {
      if (file.length) gagnerXp(sues + 2);
      zone.innerHTML = `
        <div class="card resultat">
          <div class="big">🃏</div>
          <h2>${file.length ? "Révision terminée !" : "Rien à revoir pour l'instant"}</h2>
          <p class="muted">${file.length ? `Tu connaissais ${sues} carte${sues > 1 ? "s" : ""} sur ${file.length}.` : ""}
          Jack te remontrera chaque carte au bon moment : plus tu la connais, plus elle revient tard.</p>
          <button class="btn" id="suivant">S'entraîner à parler →</button>
        </div>`;
      document.getElementById("suivant").onclick = () => aller({ ...vue, onglet: "parler" });
      return;
    }
    const [fr, cible] = t.mots[file[k]];
    zone.innerHTML = `
      <p class="muted">Carte ${k + 1} / ${file.length} — touche la carte pour la retourner.</p>
      <div class="card flashcard" id="carte" role="button" tabindex="0">
        ${retournee ? `<span>${echap(fr)}</span><span class="indice">${echap(cible)}</span>` : `<span>${echap(cible)}</span><span class="indice">Tu sais ce que ça veut dire ?</span>`}
      </div>
      <div class="rangee" style="margin-top:16px; justify-content:center">
        <button class="hp" id="ecouter" aria-label="Écouter">🔊</button>
        ${retournee ? `<button class="btn rouge" id="non">À revoir</button><button class="btn vert" id="oui">Je savais !</button>` : `<button class="btn" id="retourner">Retourner</button>`}
      </div>`;
    const retourner = () => { retournee = true; montrer(); };
    document.getElementById("carte").onclick = retourner;
    document.getElementById("carte").onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") retourner(); };
    document.getElementById("ecouter").onclick = () => parler(cible);
    if (!retournee) { if (!silence) parler(cible); silence = false; document.getElementById("retourner").onclick = retourner; return; }
    const repondre = (savait) => {
      const cle = `${etat.langue}:${t.id}:${file[k]}`;
      const c = etat.cartes[cle] || { boite: 0 };
      const boite = savait ? Math.min(c.boite + 1, INTERVALLES_JOURS.length - 1) : 0;
      etat.cartes[cle] = { boite, prochain: Date.now() + INTERVALLES_JOURS[boite] * 864e5 };
      if (savait) sues++;
      // À revoir : Jack redit le mot et sa traduction pour l'ancrer
      if (!savait && explicVoix()) { direSuite([[cible, etat.langue], [`veut dire : ${fr}. Je te le remontre demain.`, "fr"]]); silence = true; }
      sauver();
      k++; retournee = false; montrer();
    };
    document.getElementById("oui").onclick = () => repondre(true);
    document.getElementById("non").onclick = () => repondre(false);
  }
  montrer();
}

// --- Parler : prononciation avec le micro
function ongletParler(zone, t) {
  const mots = melanger(t.mots).slice(0, 5);
  let k = 0, reussis = 0;
  if (!Reconnaissance) {
    zone.innerHTML = `
      <div class="card">
        <h2>🎤 Micro non disponible</h2>
        <p>Ton navigateur ne sait pas encore écouter ta voix. Ouvre Jack Blabla dans <b>Google Chrome</b> ou <b>Microsoft Edge</b> pour t'entraîner à parler.</p>
        <p class="muted">En attendant, écoute les mots dans la Leçon et répète-les à voix haute !</p>
      </div>`;
    return;
  }
  function montrer(retour) {
    if (k >= mots.length) {
      if (reussis >= 3) marquer(cleTheme(t), "parler", true);
      gagnerXp(reussis * 3);
      ecranResultat(zone, { score: reussis, total: mots.length,
        messages: ["Ton accent est top ! 🗣️", "Pas mal ! Continue à t'entraîner.", "La prononciation vient avec la pratique, continue !"],
        boutons: [
          { texte: "Recommencer", secondaire: true, action: () => ongletParler(zone, t) },
          t.dialogue ? { texte: "Blabla avec Jack →", action: () => aller({ ...vue, onglet: "blabla" }) } : { texte: "Retour aux thèmes", action: () => aller({ nom: "hub" }) },
        ] });
      return;
    }
    const [fr, cible] = mots[k];
    zone.innerHTML = `
      ${barre((k / mots.length) * 100)}
      <div class="card" style="text-align:center; margin-top:16px">
        <p class="muted" style="margin:0">Dis en ${L().nom.toLowerCase()} :</p>
        <div class="question" style="justify-content:center">${echap(cible)}</div>
        <p class="muted">${echap(fr)}</p>
        <div class="rangee" style="justify-content:center; gap:18px">
          <button class="hp" id="ecouter" aria-label="Écouter d'abord">🔊</button>
          <button class="micro" id="micro" aria-label="Parler">🎤</button>
          <button class="btn secondaire" id="passer">Passer</button>
        </div>
        <p class="muted" id="statut">Écoute, puis appuie sur le micro et parle.</p>
        ${retour || ""}
      </div>`;
    document.getElementById("ecouter").onclick = () => parler(cible);
    document.getElementById("passer").onclick = () => { k++; montrer(); };
    document.getElementById("micro").onclick = () => ecouter(cible);
  }
  function ecouter(cible) {
    const micro = document.getElementById("micro");
    const statut = document.getElementById("statut");
    const r = new Reconnaissance();
    r.lang = L().voix;
    r.maxAlternatives = 3;
    micro.classList.add("ecoute");
    statut.textContent = "Je t'écoute…";
    let entendu = false;
    r.onresult = (e) => {
      entendu = true;
      const alts = [...e.results[0]].map((a) => a.transcript);
      const meilleur = alts.reduce((m, a) => (ressemblance(a, cible) > ressemblance(m, cible) ? a : m), alts[0]);
      const score = ressemblance(meilleur, cible);
      if (score >= 0.75) { reussis++; k++; toast("Parfait ! 🎉"); setTimeout(montrer, 700); }
      else {
        // Correction vocale : Jack dit ce qu'il a entendu, puis redit le mot lentement
        const conseil = score >= 0.5 ? "Tu y es presque : articule bien chaque syllabe, surtout la fin du mot."
          : "Écoute bien le modèle, puis répète-le lentement, syllabe par syllabe.";
        if (explicVoix()) direSuite([[`J'ai entendu : ${meilleur}. ${conseil} Écoute :`, "fr"], [cible, etat.langue]]);
        montrer(`<div class="feedback ko">J'ai entendu : « ${echap(meilleur)} ». Réessaie ! (${Math.round(score * 100)} %)
          <div class="explic">💡 <b>Il fallait dire :</b> « ${echap(cible)} ». ${conseil}</div></div>`);
      }
    };
    r.onerror = (e) => {
      micro.classList.remove("ecoute");
      statut.textContent = e.error === "not-allowed" ? "Autorise le micro dans ton navigateur pour parler à Jack." : "Je n'ai rien entendu. Réessaie !";
    };
    r.onend = () => { micro.classList.remove("ecoute"); if (!entendu && statut.textContent === "Je t'écoute…") statut.textContent = "Je n'ai rien entendu. Réessaie !"; };
    r.start();
  }
  montrer();
}

// --- Blabla : petite conversation guidée avec Jack
function ongletBlabla(zone, t) {
  const script = t.dialogue;
  let k = 0, erreurs = 0;
  zone.innerHTML = `<div class="card"><div class="chat" id="chat"></div><div id="reponses"></div></div>`;
  const chat = document.getElementById("chat");
  const reponses = document.getElementById("reponses");
  function ajouter(qui, txt, fr) {
    const d = document.createElement("div");
    d.className = `msg ${qui}`;
    d.innerHTML = `<div class="qui">${qui === "jack" ? '<span class="avatar-jack mini" aria-hidden="true"></span> Jack' : "Toi"}</div><div>${echap(txt)}</div><div class="trad">${echap(fr)}</div>`;
    if (qui === "jack") { d.style.cursor = "pointer"; d.title = "Réécouter"; d.onclick = () => parler(txt); }
    chat.appendChild(d);
  }
  function avancer() {
    if (k >= script.length) {
      if (!fait(cleTheme(t)).dialogue) marquer(cleTheme(t), "dialogue", true);
      gagnerXp(Math.max(4, 10 - erreurs * 2));
      reponses.innerHTML = `
        <div class="feedback ok">Bravo, tu as tenu toute la conversation ! ${erreurs ? `(${erreurs} erreur${erreurs > 1 ? "s" : ""})` : "Sans faute ! 🌟"}</div>
        <div class="rangee" style="margin-top:14px">
          <button class="btn secondaire" id="rejouer">Rejouer</button>
          <button class="btn" id="themes">Retour</button>
        </div>`;
      document.getElementById("rejouer").onclick = () => ongletBlabla(zone, t);
      document.getElementById("themes").onclick = () => aller({ nom: "hub" });
      return;
    }
    const r = script[k];
    if (r.who === "jack") {
      ajouter("jack", r.txt, r.fr);
      parler(r.txt);
      k++;
      reponses.innerHTML = "";
      setTimeout(avancer, 900);
      return;
    }
    const bonne = r.choices[0];
    const choix = melanger(r.choices);
    reponses.innerHTML = `
      <p class="muted" style="margin:6px 0 10px">À toi ! Tu veux dire : <b>« ${echap(r.fr)} »</b></p>
      <div class="choix">${choix.map((c, i) => `<button data-i="${i}">${echap(c)}</button>`).join("")}</div>`;
    reponses.querySelectorAll("button").forEach((b) => b.onclick = () => {
      const c = choix[b.dataset.i];
      if (c === bonne) {
        ajouter("toi", c, r.fr);
        parler(c);
        k++;
        reponses.innerHTML = "";
        setTimeout(avancer, 1100);
      } else {
        erreurs++;
        b.classList.add("faux");
        b.disabled = true;
        // Explication : ce que tu veux dire, et pourquoi cette phrase ne convient pas
        const pourquoi = `« ${echap(c)} » ne convient pas : soit le sens n'est pas le bon, soit la phrase contient une faute. Tu veux dire : « ${echap(r.fr)} ». Cherche la phrase qui dit exactement ça, sans faute.`;
        let ex = reponses.querySelector(".explic");
        if (!ex) { ex = document.createElement("div"); ex.className = "explic"; reponses.appendChild(ex); }
        ex.innerHTML = `💡 ${pourquoi}`;
        if (explicVoix()) direSuite([["Pas tout à fait.", "fr"], [`Tu veux dire : ${r.fr}`, "fr"]]);
        else toast("Pas tout à fait… essaie une autre réponse");
      }
    });
  }
  avancer();
}

// ================= Grammaire =================
const surligner = (q) => echap(q).replace(/___/g, '<span class="trou">___</span>');
function phraseComplete(q, rep) {
  if (!q.includes("___")) return rep;
  return q.replace("___", rep.startsWith("—") ? "" : rep).replace(/\s+/g, " ").replace(/\(.*?\)/g, "");
}
function questionsGrammaire(lecon) {
  return melanger(lecon.exercices).map((ex) => ({
    consigne: "Choisis la bonne réponse :",
    question: surligner(ex.q),
    choix: melanger(ex.choix),
    bonne: ex.choix[0],
    fr: ex.fr,
    audioReponse: phraseComplete(ex.q, ex.choix[0]),
    pourquoi: ex.pourquoi || `La règle : ${regleDe(lecon)} (leçon « ${lecon.titre} »)`,
  }));
}

// Compléments écrits d'une leçon : « pourquoi » et pièges, dans la leçon elle-même ou dans contenu/cours.js
function complementsCours(g) {
  const plus = ((typeof COURS_PLUS !== "undefined" && COURS_PLUS[etat.langue]) || {})[g.id] || {};
  return { pourquoi: g.pourquoi || plus.pourquoi || "", pieges: [...(g.pieges || []), ...(plus.pieges || [])] };
}

// ---------- Le cours écrit d'une leçon de grammaire ----------
function vueGrammaire() {
  const g = C().grammaire.find((x) => x.id === vue.id);
  const lecons = C().grammaire.filter((x) => x.niveau === g.niveau);
  const idx = lecons.indexOf(g);
  const suivante = lecons[idx + 1];
  const { pourquoi, pieges } = complementsCours(g);
  const cle = `${etat.langue}:g:${g.id}`;

  // « À faire / à ne pas faire » : les pièges écrits à la main, puis chaque exercice corrigé
  const lignesExo = g.exercices.map((ex) => {
    const faux = ex.choix.slice(1).filter((c) => !c.startsWith("—"))[0];
    const avecTrou = ex.q.includes("___");
    return `
      <div class="faire">
        ${avecTrou ? "" : `<div class="faire-q">${echap(ex.q)}</div>`}
        <div class="oui">✅ ${echap(avecTrou ? phraseComplete(ex.q, ex.choix[0]) : ex.choix[0])}</div>
        ${faux ? `<div class="non">❌ <s>${echap(avecTrou ? phraseComplete(ex.q, faux) : faux)}</s></div>` : ""}
        ${ex.fr ? `<div class="faire-fr">${echap(ex.fr)}</div>` : ""}
        ${ex.pourquoi ? `<div class="faire-pq">💡 ${ex.pourquoi}</div>` : ""}
      </div>`;
  }).join("");

  app.innerHTML = `
    ${boutonRetour(`← ${L().nom} · ${NIVEAUX[g.niveau].nom}`)}
    <p class="muted" style="margin:0">📖 Cours écrit · ${NIVEAUX[g.niveau].emoji} ${NIVEAUX[g.niveau].nom} · leçon ${idx + 1}/${lecons.length}</p>
    <h1>${g.titre}</h1>
    <article class="cours">
      <div class="card objectif">🎯 <b>Dans ce cours :</b> ${echap(regleDe(g))}
        <div class="rangee" style="margin-top:10px"><button class="lien-son" id="expliquer">🔊 Écouter le cours (facultatif)</button></div>
      </div>

      <h2 class="section">📖 La règle</h2>
      <div class="card explication">${g.explication}</div>

      ${pourquoi ? `<h2 class="section">💡 Pourquoi ?</h2><div class="card explication">${pourquoi}</div>` : ""}

      <h2 class="section">📝 Exemples</h2>
      <div class="card">
        <table class="exemples">
          ${g.exemples.map(([cible, fr], i) => `
            <tr><td class="cible">${echap(cible)}</td><td class="fr">${echap(fr)}</td>
            <td><button class="hp petit" data-i="${i}" aria-label="Écouter">🔊</button></td></tr>`).join("")}
        </table>
      </div>

      ${pieges.length ? `
        <h2 class="section">⚠️ Les pièges des francophones</h2>
        <div class="card">
          ${pieges.map(([mauvais, bon, raison]) => `
            <div class="faire">
              <div class="non">❌ <s>${echap(mauvais)}</s></div>
              <div class="oui">✅ ${echap(bon)}</div>
              ${raison ? `<div class="faire-pq">💡 ${raison}</div>` : ""}
            </div>`).join("")}
        </div>` : ""}

      <h2 class="section">✅ À faire · ❌ À ne pas faire</h2>
      <div class="card">${lignesExo}</div>

      <div class="card retenir">📌 <b>À retenir :</b> ${echap(regleDe(g))}</div>

      <div class="rangee fin-cours">
        <button class="btn" id="lu">${fait(cle).lu ? "✅ Cours lu" : "✔ J'ai lu ce cours"} → Quiz</button>
        ${suivante ? `<button class="btn secondaire" id="suivant">Cours suivant →</button>` : ""}
      </div>
    </article>`;
  brancherRetour();
  app.querySelectorAll(".hp").forEach((b) => b.onclick = () => parler(g.exemples[b.dataset.i][0]));
  // Lecture à voix haute, en option : la règle en français, puis chaque exemple
  document.getElementById("expliquer").onclick = () => direSuite([
    [`${g.titre}.`, "fr"], [g.explication, "fr"], [pourquoi, "fr"], ["Écoute les exemples.", "fr"],
    ...g.exemples.flatMap(([cible, fr]) => [[cible, etat.langue], [fr, "fr"]]),
  ]);
  document.getElementById("lu").onclick = () => {
    if (!fait(cle).lu) { marquer(cle, "lu", true); gagnerXp(3); }
    aller({ nom: "quizgram", id: g.id });
  };
  const s = document.getElementById("suivant");
  if (s) s.onclick = () => { if (!fait(cle).lu) marquer(cle, "lu", true); aller({ nom: "grammaire", id: suivante.id }); };
}

// ---------- Le quiz d'une leçon (séparé du cours) ----------
function vueQuizGrammaire() {
  const g = C().grammaire.find((x) => x.id === vue.id);
  const lecons = C().grammaire.filter((x) => x.niveau === g.niveau);
  const suivante = lecons[lecons.indexOf(g) + 1];
  app.innerHTML = `
    ${boutonRetour(`← ${L().nom} · ${NIVEAUX[g.niveau].nom}`)}
    <p class="muted" style="margin:0">✅ Quiz · ${NIVEAUX[g.niveau].nom}</p>
    <h1>${g.titre}</h1>
    <div class="rangee" style="margin-bottom:10px"><button class="lien-son" id="relire">📖 Relire le cours</button></div>
    <section id="zone"></section>`;
  brancherRetour();
  document.getElementById("relire").onclick = () => aller({ nom: "grammaire", id: g.id });
  const zone = document.getElementById("zone");
  const lancer = () => lancerQcm(zone, questionsGrammaire(g), (score, total) => {
    const cle = `${etat.langue}:g:${g.id}`;
    if (score / total > (fait(cle).score || 0)) marquer(cle, "score", score / total);
    gagnerXp(score * 2);
    ecranResultat(zone, { score, total,
      messages: ["Règle maîtrisée ! 🏆", "Presque ! Relis le cours et retente.", "Relis bien le cours et les exemples, puis réessaie."],
      boutons: [
        { texte: "Relire le cours", secondaire: true, action: () => aller({ nom: "grammaire", id: g.id }) },
        { texte: "Recommencer", secondaire: true, action: lancer },
        suivante ? { texte: "Cours suivant →", action: () => aller({ nom: "grammaire", id: suivante.id }) } : { texte: "Aller au test →", action: () => { etat.etape = "test"; sauver(); aller({ nom: "hub" }); } },
      ] });
  });
  lancer();
}

// ================= Conjugaison =================
function vueConjugaison() {
  const n = niveauChoisi();
  const verbes = C().verbes.filter((v) => v.niveau <= n);
  const temps = C().temps.filter((t) => t.niveau <= n);
  const v = verbes.find((x) => x.inf === vue.verbe) || verbes[0];
  const t = temps.find((x) => x.id === vue.temps) || temps[0];
  const formes = conjuguer(etat.langue, v, t.id);
  const pronoms = C().pronoms, pronomsFr = C().pronomsFr;

  app.innerHTML = `
    ${boutonRetour(`← ${L().nom} · ${NIVEAUX[n].nom}`)}
    <h1>🔤 Conjugaison</h1>
    <div class="rangee" style="margin-bottom:14px">
      <button class="btn" id="drill">✏️ M'entraîner (10 questions)</button>
    </div>
    <p class="muted" style="margin-bottom:6px">Temps</p>
    <nav class="onglets">${temps.map((x) => `<button class="onglet ${x.id === t.id ? "actif" : ""}" data-temps="${x.id}">${x.nom}</button>`).join("")}</nav>
    <div class="card">
      <div class="rangee" style="justify-content:space-between">
        <h2 style="margin:0">${echap(v.inf)} <span class="muted" style="font-size:1rem">— ${echap(v.fr)}</span></h2>
        ${v.irregulier || v.preterit ? `<span class="pastille">⚡ irrégulier</span>` : `<span class="pastille ok">régulier</span>`}
      </div>
      <table class="conj">
        ${formes.map((f, i) => `
          <tr>
            <td class="pro">${echap(pronoms[i])} <small class="muted">(${pronomsFr[i]})</small></td>
            <td class="forme">${echap(f)}</td>
            <td><button class="hp petit" data-i="${i}" aria-label="Écouter">🔊</button></td>
          </tr>`).join("")}
      </table>
    </div>
    <p class="muted" style="margin:18px 0 6px">Verbes (⚡ = irrégulier)</p>
    <div class="puces">
      ${verbes.map((x) => `<button class="puce ${x === v ? "actif" : ""}" data-verbe="${echap(x.inf)}">${x.irregulier || x.preterit ? "⚡ " : ""}${echap(x.inf)}</button>`).join("")}
    </div>`;
  brancherRetour();
  const dire = (i) => parler(avecPronom(pronoms[i], formes[i]));
  app.querySelectorAll("[data-i]").forEach((b) => b.onclick = () => dire(+b.dataset.i));
  app.querySelectorAll("[data-temps]").forEach((b) => b.onclick = () => aller({ ...vue, temps: b.dataset.temps, verbe: v.inf }));
  app.querySelectorAll("[data-verbe]").forEach((b) => b.onclick = () => aller({ ...vue, verbe: b.dataset.verbe, temps: t.id }));
  document.getElementById("drill").onclick = () => drillConjugaison(verbes, temps);
  if (vue.drill) { vue.drill = false; drillConjugaison(verbes, temps); }
}

function drillConjugaison(verbes, temps) {
  app.innerHTML = `${boutonRetour("← Conjugaison")}<h1>✏️ Conjugue !</h1><section id="zone"></section>`;
  document.getElementById("retour").onclick = () => aller({ nom: "conjugaison" });
  const zone = document.getElementById("zone");
  const pronoms = C().pronoms, pronomsFr = C().pronomsFr;
  const items = Array.from({ length: 10 }, () => {
    const v = hasard(verbes), t = hasard(temps), p = Math.floor(Math.random() * 6);
    const attendu = conjuguer(etat.langue, v, t.id)[p];
    return {
      consigne: `<span class="muted">${t.nom}</span><div class="question" style="margin:8px 0">${echap(pronoms[p])} … <span class="trou">${echap(v.inf)}</span></div>
        <span class="muted">${pronomsFr[p]} + ${echap(v.fr)}</span>`,
      attendu,
      audio: avecPronom(pronoms[p], attendu),
      pourquoi: `${t.nom.split(" (")[0]} : « ${echap(v.inf)} » avec « ${echap(pronoms[p])} » donne « ${echap(attendu)} ». ${v.irregulier || v.preterit || v.formes ? "C'est un verbe irrégulier : regarde bien son tableau." : "C'est un verbe régulier : il suit le modèle du tableau."}`,
    };
  });
  const fin = (score, total) => {
    gagnerXp(score * 2);
    ecranResultat(zone, { score, total, messages: ["Tu conjugues comme un pro ! 🏆", "Bien ! Revois les verbes ⚡ irréguliers.", "Révise les tableaux de conjugaison puis réessaie."],
      boutons: [
        { texte: "Voir les tableaux", secondaire: true, action: () => aller({ nom: "conjugaison" }) },
        { texte: "Encore 10 !", action: () => drillConjugaison(verbes, temps) },
      ] });
  };
  lancerSaisie(zone, items, fin);
}

// ================= Verbes irréguliers =================
function vueIrreguliers() {
  const n = niveauChoisi();
  const { colonnes, lignes } = C().irreguliers;
  const rows = lignes.filter((r) => r[r.length - 1] <= n);
  const nbCol = colonnes.length;
  app.innerHTML = `
    ${boutonRetour(`← ${L().nom} · ${NIVEAUX[n].nom}`)}
    <h1>⚡ Verbes irréguliers</h1>
    <p class="muted">À apprendre par cœur ! Touche 🔊 pour écouter. ${n < NIVEAUX.length - 1 ? "D'autres verbes arrivent au niveau suivant." : ""}</p>
    <div class="rangee" style="margin-bottom:14px">
      <button class="btn" id="drill">✏️ M'entraîner (10 questions)</button>
      <input id="filtre" class="saisie petit" type="search" placeholder="🔎 Chercher un verbe…" aria-label="Chercher un verbe">
    </div>
    <div class="table-wrap card" style="padding:0">
      <table class="irr">
        <thead><tr>${colonnes.map((c) => `<th>${c}</th>`).join("")}<th>Français</th><th></th></tr></thead>
        <tbody>
          ${rows.map((r, i) => `
            <tr data-cherche="${echap(normaliser(r.slice(0, nbCol + 1).join(" ")))}">
              ${r.slice(0, nbCol).map((c, j) => `<td class="${j === 0 ? "forme" : ""}">${echap(c)}</td>`).join("")}
              <td class="muted">${echap(r[nbCol])}</td>
              <td><button class="hp petit" data-i="${i}" aria-label="Écouter">🔊</button></td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
  brancherRetour();
  app.querySelectorAll("[data-i]").forEach((b) => b.onclick = () => parler(rows[b.dataset.i].slice(0, nbCol).join(", ").replace(/\//g, ", ")));
  document.getElementById("filtre").oninput = (e) => {
    const q = normaliser(e.target.value);
    app.querySelectorAll("tbody tr").forEach((tr) => tr.style.display = tr.dataset.cherche.includes(q) ? "" : "none");
  };
  document.getElementById("drill").onclick = () => drillIrreguliers(rows);
  if (vue.drill) { vue.drill = false; drillIrreguliers(rows); }
}

function drillIrreguliers(rows) {
  const { colonnes } = C().irreguliers;
  const nbCol = colonnes.length;
  app.innerHTML = `${boutonRetour("← Verbes irréguliers")}<h1>⚡ Les irréguliers</h1><section id="zone"></section>`;
  document.getElementById("retour").onclick = () => aller({ nom: "irreguliers" });
  const zone = document.getElementById("zone");
  const items = melanger(rows).slice(0, 10).map((r) => {
    const col = 1 + Math.floor(Math.random() * (nbCol - 1));
    return {
      consigne: `<span class="muted">${colonnes[col]} de :</span>
        <div class="question" style="margin:8px 0">${echap(r[0])}</div><span class="muted">${echap(r[nbCol])}</span>`,
      attendu: r[col],
      audio: r[col].replace(/\//g, ", "),
      pourquoi: `${colonnes[col]} de « ${echap(r[0])} » (${echap(r[nbCol])}) : « ${echap(r[col])} ». Ce verbe est irrégulier : il ne suit pas la règle, il s'apprend par cœur. Astuce : récite les formes à voix haute, dans l'ordre du tableau.`,
    };
  });
  lancerSaisie(zone, items, (score, total) => {
    gagnerXp(score * 2);
    ecranResultat(zone, { score, total, messages: ["Impressionnant ! 🏆", "Bien joué, continue à réviser !", "Relis le tableau puis réessaie, ça va rentrer !"],
      boutons: [
        { texte: "Voir le tableau", secondaire: true, action: () => aller({ nom: "irreguliers" }) },
        { texte: "Encore 10 !", action: () => drillIrreguliers(rows) },
      ] });
  });
}

// ================= Test de passage de niveau =================
// Questions de conjugaison en QCM pour le test : la bonne forme parmi celles d'autres personnes
function questionsConjugaison(n, nb) {
  const verbes = C().verbes.filter((v) => v.niveau <= n);
  const temps = C().temps.filter((t) => t.niveau <= n);
  const qs = [];
  for (let essai = 0; essai < 40 && qs.length < nb; essai++) {
    const v = hasard(verbes), t = hasard(temps), p = Math.floor(Math.random() * 6);
    const formes = conjuguer(etat.langue, v, t.id);
    const bonne = formes[p];
    const autres = melanger([...new Set(formes.filter((f) => f !== bonne))]).slice(0, 2);
    if (autres.length < 2) continue;
    qs.push({
      consigne: `Conjugaison · ${t.nom}`,
      question: `${echap(C().pronoms[p])} … <span class="trou">${echap(v.inf)}</span> <small class="muted">(${echap(v.fr)})</small>`,
      choix: melanger([bonne, ...autres]),
      bonne,
      audioReponse: avecPronom(C().pronoms[p], bonne),
      pourquoi: `Avec « ${C().pronoms[p]} » (${C().pronomsFr[p]}), au ${t.nom.toLowerCase()}, ${v.inf} se conjugue « ${bonne} ». Revois le tableau dans Conjugaison.`,
    });
  }
  return qs;
}

function vueTest() {
  const n = vue.niveau;
  const suivant = NIVEAUX[n + 1];
  const dernier = !suivant;
  app.innerHTML = `
    ${boutonRetour()}
    <h1>🎓 ${dernier ? "Test final" : "Test de passage"}</h1>
    <p class="muted">Niveau ${NIVEAUX[n].nom}${dernier ? "" : ` → ${suivant.nom}`}. 12 questions : vocabulaire, grammaire, conjugaison. Il faut <b>${SEUIL_TEST_12}/12</b>.</p>
    <section id="zone"><div class="card">
      <p>Ce test vérifie que tu maîtrises le niveau <b>${NIVEAUX[n].nom}</b>. ${dernier ? "Si tu réussis, tu obtiens ton <b>diplôme Jack Blabla</b> 🏆." : `Si tu réussis, tu débloques le niveau <b>${suivant.emoji} ${suivant.nom}</b> : ${suivant.desc.toLowerCase()}`}</p>
      <p class="muted">Pendant le test, les explications s'affichent après chaque réponse : c'est aussi une révision.</p>
      <button class="btn" id="go">C'est parti !</button>
    </div></section>`;
  brancherRetour();
  const zone = document.getElementById("zone");
  document.getElementById("go").onclick = () => {
    const mots = C().themes.filter((t) => t.niveau === n).flatMap((t) => t.mots);
    const gram = melanger(C().grammaire.filter((g) => g.niveau === n).flatMap((g) => questionsGrammaire(g)));
    const conj = questionsConjugaison(n, 2);
    const nbGram = 12 - 4 - conj.length;
    const questions = melanger([...questionsVocab(mots, 4), ...gram.slice(0, nbGram), ...conj]);
    lancerQcm(zone, questions, (score, total) => {
      const reussi = score >= Math.ceil((SEUIL_TEST_12 / 12) * total);
      if (reussi && dernier) {
        etat.diplome = { ...(etat.diplome || {}), [etat.langue]: true };
        sauver();
        gagnerXp(100);
      } else if (reussi && niveauDebloque() <= n) {
        etat.debloque[etat.langue] = n + 1;
        etat.niveauChoisi[etat.langue] = n + 1;
        etat.etape = "cours";
        sauver();
        gagnerXp(50);
      } else gagnerXp(score);
      zone.innerHTML = `
        <div class="card resultat">
          <div class="big">${reussi ? (dernier ? "🏆" : "🎉") : "💪"}</div>
          <h2>${score} / ${total}</h2>
          <p>${reussi
            ? (dernier ? `Félicitations ! Tu obtiens ton <b>diplôme Jack Blabla ${/^[aeiouy]/i.test(L().nom) ? "d'" : "de "}${L().nom.toLowerCase()}</b>, niveau ${NIVEAUX[n].nom} !` : `Bravo ! Tu passes au niveau <b>${suivant.emoji} ${suivant.nom}</b> !`)
            : `Il faut ${SEUIL_TEST_12}/12. Relis les cours où tu t'es trompé, refais les quiz, et retente ta chance : tu y es presque !`}</p>
          <div class="rangee" style="justify-content:center">
            ${reussi ? "" : `<button class="btn secondaire" id="re">Retenter</button>`}
            <button class="btn" id="hub">${reussi ? (dernier ? "Retour" : `Découvrir le niveau ${suivant.nom} →`) : "Réviser les cours"}</button>
          </div>
        </div>`;
      document.getElementById("hub").onclick = () => { if (!reussi) { etat.etape = "cours"; sauver(); } aller({ nom: "hub" }); };
      const re = document.getElementById("re");
      if (re) re.onclick = () => vueTest();
    });
  };
}

// ================= Parcours 6 mois =================
// Un parcours de 26 semaines par langue : chaque niveau a ses semaines (PARCOURS_SEMAINES dans data.js).
// La séance du jour s'ajuste à ce que tu as déjà fait : révision, prochaine leçon, grammaire, conjugaison, test.
function parcoursEtat() {
  const p = (etat.parcours || {})[etat.langue];
  if (!p || !p.debut) return { debut: null, semaine: 0, vise: 0 };
  const jours = Math.floor((Date.now() - new Date(p.debut).getTime()) / 864e5);
  const semaine = Math.min(PARCOURS_TOTAL, Math.floor(jours / 7) + 1);
  let vise = 0;
  PARCOURS_SEMAINES.forEach((s, i) => { if (semaine >= s) vise = i; });
  return { debut: p.debut, semaine, vise, jours };
}
// Cartes déjà vues dont la date de révision est arrivée, sur tous les niveaux débloqués
function cartesARevoir() {
  const now = Date.now(), max = niveauDebloque(), liste = [];
  C().themes.filter((t) => t.niveau <= max).forEach((t) => t.mots.forEach((_, i) => {
    const c = etat.cartes[`${etat.langue}:${t.id}:${i}`];
    if (c && c.prochain <= now) liste.push({ t, i });
  }));
  return liste;
}

function vueParcours() {
  if (!etat.parcours) etat.parcours = {};
  const p = parcoursEtat();
  const max = niveauDebloque();
  const n = max;
  app.innerHTML = `${boutonRetour(`← ${L().nom}`)}<h1>🗓️ Mon parcours 6 mois</h1><section id="zone"></section>`;
  brancherRetour();
  const zone = document.getElementById("zone");
  if (!p.debut) {
    zone.innerHTML = `
      <div class="card">
        <p><b>Du premier mot au niveau professionnel en ${L().nom.toLowerCase()}.</b> Le parcours dure <b>26 semaines</b>, avec une séance de <b>30 à 45 minutes par jour</b>.</p>
        ${frise(0, max)}
        <p class="muted">Chaque jour, Jack te prépare ta séance selon tes résultats : révision des mots, nouvelle leçon, grammaire, conjugaison, et le test de passage quand tu es prêt. Si tu as de l'avance ou du retard, il te le dit et adapte la séance.</p>
        <p class="muted">Honnêtement : en 6 mois, avec une séance par jour, on vise un bon niveau B2 et l'aisance au travail. Le niveau Expert (C1) se consolide ensuite avec la pratique.</p>
        <button class="btn" id="go">Commencer mon parcours aujourd'hui</button>
      </div>`;
    document.getElementById("go").onclick = () => {
      etat.parcours[etat.langue] = { debut: new Date().toISOString().slice(0, 10) };
      sauver(); vueParcours();
    };
    return;
  }
  // Ajustement : comparer le niveau atteint au niveau prévu pour cette semaine
  const ecart = max - p.vise;
  const conseil = ecart > 0 ? `🚀 Tu as de l'avance : tu es au niveau <b>${NIVEAUX[max].nom}</b> alors que le parcours prévoit <b>${NIVEAUX[p.vise].nom}</b>. Garde ce rythme !`
    : ecart < 0 ? `⏰ Tu as un peu de retard : le parcours prévoit le niveau <b>${NIVEAUX[p.vise].nom}</b>. Aujourd'hui, fais la séance en entier, et une deuxième leçon si tu peux.`
    : `✅ Tu es dans les temps : niveau <b>${NIVEAUX[max].nom}</b>, comme prévu.`;
  const dues = cartesARevoir().length;
  const themeSuivant = C().themes.find((t) => t.niveau === n && progressionTheme(t) < 100);
  const gramSuivante = C().grammaire.find((g) => g.niveau === n && scoreGrammaire(g) < 80);
  const prog = progressionNiveau(n);
  const taches = [
    { ic: "🃏", titre: dues ? `Réviser ${dues} carte${dues > 1 ? "s" : ""}` : "Révision : rien à revoir aujourd'hui", sous: "Les mots reviennent au bon moment pour ne pas les oublier.", ok: !dues, action: () => aller({ nom: "revision" }) },
    themeSuivant
      ? { ic: themeSuivant.emoji, titre: `Vocabulaire : ${themeSuivant.titre}`, sous: `Leçon, quiz, cartes, parler${themeSuivant.dialogue ? ", dialogue avec Jack" : ""} · ${Math.round(progressionTheme(themeSuivant))} % fait`, action: () => aller({ nom: "theme", theme: themeSuivant.id, onglet: fait(cleTheme(themeSuivant)).lecon ? "quiz" : "lecon" }) }
      : { ic: "📚", titre: "Vocabulaire du niveau terminé", sous: "Bravo ! Refais un quiz si tu veux t'entraîner.", ok: true, action: () => aller({ nom: "hub" }) },
    gramSuivante
      ? { ic: "📐", titre: `Grammaire : ${gramSuivante.titre}`, sous: "Lis l'explication, écoute les exemples, fais les exercices.", action: () => aller({ nom: "grammaire", id: gramSuivante.id }) }
      : { ic: "📐", titre: "Grammaire du niveau maîtrisée", sous: "Toutes les leçons sont à 80 % ou plus.", ok: true, action: () => aller({ nom: "hub" }) },
    { ic: "🔤", titre: "10 questions de conjugaison", sous: "Les temps de ton niveau, à taper.", action: () => { etat.niveauChoisi[etat.langue] = n; sauver(); aller({ nom: "conjugaison" }); } },
  ];
  if (n < NIVEAUX.length - 1 && prog >= 80) taches.push({ ic: "🎓", titre: `Test de passage → ${NIVEAUX[n + 1].nom}`, sous: `Tu as fait ${Math.round(prog)} % du niveau : tu es prêt !`, action: () => aller({ nom: "test", niveau: n }) });
  zone.innerHTML = `
    <div class="card">
      <div class="rangee" style="justify-content:space-between"><b>Semaine ${p.semaine} / ${PARCOURS_TOTAL}</b><span class="muted">commencé le ${new Date(p.debut).toLocaleDateString("fr-FR")}</span></div>
      ${barre((p.semaine / PARCOURS_TOTAL) * 100)}
      ${frise(p.vise, max)}
      <p style="margin-bottom:0">${conseil}</p>
    </div>
    <h2 class="section">Ta séance du jour <span class="muted" style="font-size:1rem">· 30 à 45 min</span></h2>
    <div class="taches">
      ${taches.map((t, i) => `<button class="tache ${t.ok ? "ok" : ""}" data-t="${i}"><span class="num">${t.ok ? "✅" : t.ic}</span><span class="ligne-titre">${echap(t.titre)}<small>${t.sous}</small></span><span class="ligne-etat">→</span></button>`).join("")}
    </div>
    <p class="muted" style="margin-top:18px">Niveau ${NIVEAUX[n].emoji} ${NIVEAUX[n].nom} : ${Math.round(prog)} % fait. Le test de passage apparaît dans la séance à partir de 80 %.</p>
    <button class="retour" id="reinit" style="margin-top:8px">Recommencer le parcours à zéro</button>`;
  zone.querySelectorAll("[data-t]").forEach((b) => b.onclick = taches[b.dataset.t].action);
  document.getElementById("reinit").onclick = () => {
    if (confirm("Recommencer le parcours à la semaine 1 ? Tes niveaux et tes cartes sont gardés.")) { delete etat.parcours[etat.langue]; sauver(); vueParcours(); }
  };
}
// Frise des 6 niveaux : semaines prévues, niveau visé, niveaux déjà atteints
function frise(vise, max) {
  return `<div class="frise">${NIVEAUX.map((niv, i) => {
    const fin = (PARCOURS_SEMAINES[i + 1] || PARCOURS_TOTAL + 1) - 1;
    return `<div class="${i < max ? "fait" : ""} ${i === vise ? "ici" : ""}">${niv.emoji} ${niv.nom}<br><small class="muted">sem. ${PARCOURS_SEMAINES[i]}–${fin}</small></div>`;
  }).join("")}</div>`;
}

// Révision générale : toutes les cartes à revoir, tous thèmes confondus
function vueRevision() {
  const file = melanger(cartesARevoir());
  app.innerHTML = `${boutonRetour("← Mon parcours")}<h1>🃏 Révision du jour</h1><section id="zone"></section>`;
  document.getElementById("retour").onclick = () => aller({ nom: "parcours" });
  const zone = document.getElementById("zone");
  let k = 0, retournee = false, sues = 0, silence = false;
  function montrer() {
    if (k >= file.length) {
      if (file.length) gagnerXp(sues + 2);
      zone.innerHTML = `
        <div class="card resultat">
          <div class="big">🃏</div>
          <h2>${file.length ? "Révision terminée !" : "Rien à revoir aujourd'hui"}</h2>
          <p class="muted">${file.length ? `Tu connaissais ${sues} carte${sues > 1 ? "s" : ""} sur ${file.length}.` : "Les mots que tu apprends reviendront ici au bon moment."}</p>
          <button class="btn" id="suivant">Retour à ma séance →</button>
        </div>`;
      document.getElementById("suivant").onclick = () => aller({ nom: "parcours" });
      return;
    }
    const { t, i } = file[k];
    const [fr, cible] = t.mots[i];
    zone.innerHTML = `
      <p class="muted">Carte ${k + 1} / ${file.length} · ${t.emoji} ${echap(t.titre)}</p>
      <div class="card flashcard" id="carte" role="button" tabindex="0">
        ${retournee ? `<span>${echap(fr)}</span><span class="indice">${echap(cible)}</span>` : `<span>${echap(cible)}</span><span class="indice">Tu sais ce que ça veut dire ?</span>`}
      </div>
      <div class="rangee" style="margin-top:16px; justify-content:center">
        <button class="hp" id="ecouter" aria-label="Écouter">🔊</button>
        ${retournee ? `<button class="btn rouge" id="non">À revoir</button><button class="btn vert" id="oui">Je savais !</button>` : `<button class="btn" id="retourner">Retourner</button>`}
      </div>`;
    const retourner = () => { retournee = true; montrer(); };
    document.getElementById("carte").onclick = retourner;
    document.getElementById("carte").onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") retourner(); };
    document.getElementById("ecouter").onclick = () => parler(cible);
    if (!retournee) { if (!silence) parler(cible); silence = false; document.getElementById("retourner").onclick = retourner; return; }
    const repondre = (savait) => {
      const cle = `${etat.langue}:${t.id}:${i}`;
      const c = etat.cartes[cle] || { boite: 0 };
      const boite = savait ? Math.min(c.boite + 1, INTERVALLES_JOURS.length - 1) : 0;
      etat.cartes[cle] = { boite, prochain: Date.now() + INTERVALLES_JOURS[boite] * 864e5 };
      if (savait) sues++;
      else if (explicVoix()) { direSuite([[cible, etat.langue], [`veut dire : ${fr}. Je te le remontre demain.`, "fr"]]); silence = true; }
      sauver();
      k++; retournee = false; montrer();
    };
    document.getElementById("oui").onclick = () => repondre(true);
    document.getElementById("non").onclick = () => repondre(false);
  }
  montrer();
}

// ================= Démarrage =================
aller(etat.langue ? { nom: "hub" } : { nom: "accueil" });
