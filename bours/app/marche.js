/* Jack Bours : le marché fictif.
   - 10 entreprises inventées + l'indice JUNGLE 10 + l'ETF JB10 qui le copie ;
   - le groupe Jack World : NEW DUC (la maison mère) et ses 7 filiales, + l'indice JACK WORLD.
     Ces entreprises ne sont pas cotées en vrai : leurs cours sont inventés, comme le reste.
   Chaque « jour de bourse » produit une bougie (ouverture, plus haut, plus bas, clôture, volume). */
(function () {
  const ACTIFS = [
    { sym: "ARA", nom: "Ara Tech", secteur: "Technologie", prix: 84, vol: 0.42, tend: 0.14, beta: 1.3, per: 34, div: 0.004, desc: "Logiciels et intelligence artificielle. Grosse croissance attendue, prix très volatil." },
    { sym: "BNF", nom: "Banana Foods", secteur: "Consommation", prix: 47, vol: 0.16, tend: 0.05, beta: 0.6, per: 18, div: 0.03, desc: "Alimentation et boissons. On mange même en temps de crise : action plutôt calme." },
    { sym: "CLT", nom: "Colibri Télécom", secteur: "Télécoms", prix: 14.5, vol: 0.2, tend: 0.02, beta: 0.7, per: 12, div: 0.055, desc: "Opérateur mobile et Internet. Croissance lente, gros dividende." },
    { sym: "CRB", nom: "Croco Banque", secteur: "Banque", prix: 38, vol: 0.28, tend: 0.05, beta: 1.2, per: 8, div: 0.06, desc: "Banque de détail et d'affaires. Sensible aux taux d'intérêt et aux crises." },
    { sym: "JNE", nom: "Jungle Énergie", secteur: "Énergie", prix: 52, vol: 0.3, tend: 0.04, beta: 0.9, per: 10, div: 0.05, desc: "Pétrole, gaz et solaire. Suit beaucoup les prix de l'énergie." },
    { sym: "LNS", nom: "Liane Santé", secteur: "Santé", prix: 96, vol: 0.18, tend: 0.07, beta: 0.6, per: 22, div: 0.025, desc: "Médicaments et vaccins. Défensive : elle baisse souvent moins que les autres dans les crises." },
    { sym: "MGI", nom: "Mangrove Immo", secteur: "Immobilier", prix: 27, vol: 0.22, tend: 0.03, beta: 0.8, per: 15, div: 0.045, desc: "Bureaux et centres commerciaux. Elle encaisse des loyers et en reverse une bonne partie." },
    { sym: "ORL", nom: "Orchidée Luxe", secteur: "Luxe", prix: 310, vol: 0.26, tend: 0.09, beta: 1.1, per: 26, div: 0.018, desc: "Maroquinerie et parfums haut de gamme. Action chère à l'unité, mais le prix d'une action ne dit pas si elle est chère : regardez le PER." },
    { sym: "PTA", nom: "Panthère Auto", secteur: "Automobile", prix: 61, vol: 0.34, tend: 0.05, beta: 1.25, per: 9, div: 0.035, desc: "Voitures électriques et thermiques. Cyclique : elle suit la santé de l'économie." },
    { sym: "TCN", nom: "Toucan Air", secteur: "Transport", prix: 11.2, vol: 0.38, tend: 0.03, beta: 1.4, per: 11, div: 0, desc: "Compagnie aérienne. Très sensible aux crises et au prix du kérosène. Pas de dividende." }
  ].map(a => Object.assign(a, { groupe: "jungle" }));

  /* Le groupe Jack World. per: 0 = pas encore de bénéfice (pas de PER). */
  const JACK = [
    { sym: "NDC", nom: "NEW DUC", secteur: "Holding", holding: true, img: "ndc", prix: 120, vol: 0.24, tend: 0.09, beta: 1, per: 21, div: 0.022, profil: "Maison mère", desc: "La maison mère (holding) du groupe : elle possède JACK22 Studio, J-DJ, Jack Radio, Jack Blabla, Jack Fusion, Jack Finance et Jack Bours. Son cours suit à peu près la moyenne de ses filiales : en l'achetant, on a un bout de tout le groupe." },
    { sym: "J22", nom: "JACK22 Studio", secteur: "Musique", img: "j22", prix: 58, vol: 0.36, tend: 0.13, beta: 1.2, per: 32, div: 0, profil: "Croissance", desc: "Studio de musique dans le navigateur : beats, voix, mixage. Forte croissance, aucun dividende : tout est réinvesti pour grandir." },
    { sym: "JDJ", nom: "J-DJ", secteur: "Musique", img: "jdj", prix: 23, vol: 0.45, tend: 0.15, beta: 1.35, per: 41, div: 0, profil: "Croissance", desc: "Deux platines dans le navigateur pour mixer et scratcher. Jeune pousse qui grandit très vite : PER élevé et prix très agité." },
    { sym: "JRD", nom: "Jack Radio", secteur: "Médias", img: "jrd", prix: 16, vol: 0.22, tend: 0.04, beta: 0.8, per: 13, div: 0.045, profil: "Rendement", desc: "La radio du groupe : 47 programmes en direct. Entreprise mûre, qui gagne de l'argent régulièrement avec la publicité et verse un bon dividende." },
    { sym: "JBB", nom: "Jack Blabla", secteur: "Éducation", img: "jbb", prix: 34, vol: 0.24, tend: 0.1, beta: 0.8, per: 25, div: 0.012, profil: "Croissance", desc: "Apprendre les langues avec Jack le perroquet. Croissance solide et un petit dividende." },
    { sym: "JFU", nom: "Jack Fusion", secteur: "Vidéo", img: "jfu", prix: 19, vol: 0.5, tend: 0.12, beta: 1.45, per: 0, div: 0, profil: "Start-up", desc: "Montage vidéo, son et photo dans un seul atelier, encore en version bêta. Elle ne gagne pas d'argent pour l'instant : pas de bénéfice, donc pas de PER. Le prix repose sur l'espoir." },
    { sym: "JFI", nom: "Jack Finance", secteur: "Finance", img: "jfi", prix: 44, vol: 0.2, tend: 0.07, beta: 0.7, per: 17, div: 0.03, profil: "Rendement", desc: "Comptes, budget et épargne au même endroit. Activité régulière et prévisible, dividende correct, cours plutôt calme." },
    { sym: "JBS", nom: "Jack Bours", secteur: "Éducation", img: "jbs", prix: 27, vol: 0.3, tend: 0.1, beta: 1.1, per: 22, div: 0.01, profil: "Croissance", desc: "L'appli que vous êtes en train d'utiliser ! Elle apprend la Bourse avec de l'argent fictif. Croissance correcte, petit dividende." }
  ].map(a => Object.assign(a, { groupe: "jack" }));
  const FILIALES = JACK.filter(a => !a.holding), HOLDING = JACK.find(a => a.holding);
  const TOUS = ACTIFS.concat(JACK);

  const ETF = { sym: "JB10", nom: "ETF JB10", secteur: "ETF", etf: true, groupe: "jungle", desc: "ETF qui copie l'indice JUNGLE 10 : en l'achetant, vous avez un peu des 10 entreprises d'un coup. Il est « capitalisant » : les dividendes sont réinvestis dans le fonds au lieu d'être versés." };
  const INDICES = {
    INDICE: { sym: "INDICE", nom: "Indice JUNGLE 10", court: "JUNGLE 10", secteur: "Indice", indice: true, groupe: "jungle", desc: "L'indice qui résume le marché de la jungle : la moyenne des 10 entreprises (dividendes réinvestis). On ne peut pas l'acheter directement : pour ça, il y a l'ETF JB10." },
    IJW: { sym: "IJW", nom: "Indice JACK WORLD", court: "JACK WORLD", secteur: "Indice", indice: true, groupe: "jack", desc: "La moyenne des 7 filiales du groupe NEW DUC (dividendes réinvestis). On ne peut pas l'acheter : pour avoir tout le groupe d'un coup, il y a la maison mère, NEW DUC." }
  };
  const JOURS_HISTO = 160;      // historique créé au départ
  const PERIODE_DIVIDENDE = 60; // un dividende tous les 60 jours de bourse

  const NEWS_PLUS = ["{nom} publie des résultats meilleurs que prévu", "{nom} signe un très gros contrat", "{nom} annonce un nouveau produit très attendu", "{nom} relève ses objectifs pour l'année", "{nom} annonce le rachat d'un concurrent, le marché applaudit"];
  const NEWS_MOINS = ["{nom} déçoit avec ses résultats", "{nom} rappelle des produits défectueux", "Enquête des autorités sur {nom}", "{nom} perd un client important", "{nom} abaisse ses prévisions pour l'année"];
  const NEWS_PLUS_JACK = ["{nom} sort une nouvelle version, les utilisateurs adorent", "{nom} dépasse un million d'utilisateurs", "{nom} signe un partenariat avec une grande marque", "{nom} publie des résultats meilleurs que prévu", "{nom} cartonne sur les réseaux sociaux"];
  const NEWS_MOINS_JACK = ["{nom} : une mise à jour ratée fâche les utilisateurs", "{nom} déçoit avec ses résultats", "{nom} perd un partenaire important", "Panne de plusieurs heures chez {nom}", "{nom} repousse le lancement de sa nouvelle version"];
  const NEWS_GROUPE = [
    ["Jack World bat son record de visiteurs : tout le groupe en profite", 1], ["NEW DUC annonce une nouvelle filiale, les investisseurs applaudissent le groupe", 1],
    ["Panne géante sur tous les sites Jack World : le groupe recule", -1], ["NEW DUC change de directeur surprise : tout le groupe tangue", -1]
  ];
  const CHOCS = ["Panique sur les marchés : une grande banque étrangère est en difficulté", "Krach : une crise sanitaire mondiale fait chuter toutes les Bourses", "Les taux d'intérêt s'envolent : les investisseurs vendent tout"];

  function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  const r2 = x => Math.round(x * 100) / 100;
  const tirer = t => t[Math.floor(Math.random() * t.length)];

  function creer() {
    const m = { jour: -1, pret: false, actifs: {}, indice: [], indiceJack: [], news: [], choc: null, dernierChoc: -999, dernierKrachFini: null };
    TOUS.forEach(a => { m.actifs[a.sym] = { bougies: [], ref: a.prix, prixDepart: a.prix }; });
    for (let i = 0; i < JOURS_HISTO; i++) avancer(m);
    m.pret = true;
    m.news = m.news.slice(-6);
    return m;
  }

  /* Ajoute à une ancienne sauvegarde les entreprises qui n'existaient pas encore (le groupe Jack), avec un historique complet. */
  function completer(m) {
    const manquants = TOUS.filter(a => !m.actifs[a.sym]);
    if (!manquants.length && m.indiceJack) return false;
    manquants.forEach(a => { m.actifs[a.sym] = { bougies: [], ref: a.prix, prixDepart: a.prix }; });
    const refaireIndice = !m.indiceJack || manquants.some(a => a.groupe === "jack");
    if (refaireIndice) m.indiceJack = [];
    for (let j = 0; j <= m.jour; j++) {
      const ctx = contexte(m, false);
      ctx.news = null; ctx.groupe = 0;
      pasJour(m, j, manquants, ctx, []);
      if (refaireIndice) m.indiceJack.push(pointIndice(m, FILIALES));
    }
    return true;
  }

  function contexte(m, choc) {
    const secteurs = {};
    TOUS.forEach(a => { if (!(a.secteur in secteurs)) secteurs[a.secteur] = gauss() * 0.006; });
    let marche = 0.0003 + gauss() * 0.009;
    if (choc) marche = -choc.force + gauss() * 0.018;
    return { marche, secteurs, fJack: gauss() * 0.007, choc, news: null, groupe: 0 };
  }

  /* Calcule la bougie du jour j pour chaque actif de la liste (les filiales avant la holding). */
  function pasJour(m, j, liste, ctx, evts) {
    let sg = 0, sr = 0, nf = 0;
    const ordre = liste.filter(a => !a.holding).concat(liste.filter(a => a.holding));
    ordre.forEach(a => {
      const s = m.actifs[a.sym];
      const prev = s.bougies.length ? s.bougies[s.bougies.length - 1].c : a.prix;
      let base = prev;
      // Détachement du dividende
      if (a.div > 0 && j > 0 && j % PERIODE_DIVIDENDE === 0) {
        const d = r2(prev * a.div * PERIODE_DIVIDENDE / 252);
        if (d > 0) { base = prev - d; s.ref *= base / prev; evts.push({ type: "dividende", sym: a.sym, montant: d, texte: "💶 " + a.nom + " verse un dividende de " + d.toFixed(2).replace(".", ",") + " € par action." }); }
      }
      const sd = a.vol / Math.sqrt(252) * (ctx.choc ? 1.8 : 1);
      let gap, ret, volMult = 1;
      if (a.holding && nf) {
        // La maison mère suit la moyenne de ses filiales, avec un peu de bruit
        gap = sg / nf * 0.9 + gauss() * sd * 0.1;
        ret = sr / nf * 0.9 + a.tend / 252 * 0.1 + gauss() * sd * 0.3;
      } else {
        gap = gauss() * sd * 0.25;
        if (a.groupe === "jack" && ctx.groupe) gap += ctx.groupe;
        if (ctx.news && ctx.news.sym === a.sym) { gap += ctx.news.ampleur; volMult = 3 + Math.random() * 2; }
        if (ctx.choc && a.sym === "LNS") gap += 0.01; // la santé résiste un peu mieux
        ret = a.tend / 252 + a.beta * ctx.marche + ctx.secteurs[a.secteur] + (a.groupe === "jack" ? ctx.fJack : 0) + gauss() * sd * 0.75;
      }
      if (a.groupe === "jack" && ctx.groupe) volMult = Math.max(volMult, 2.5);
      if (a.groupe === "jack" && !a.holding) { sg += gap; sr += ret; nf++; }
      const o = base * Math.exp(gap);
      const c = o * Math.exp(ret);
      const h = Math.max(o, c) * (1 + Math.abs(gauss()) * sd * 0.45);
      const l = Math.min(o, c) * (1 - Math.abs(gauss()) * sd * 0.45);
      const v = Math.round(100000 * (1 + Math.abs(ret + gap) / sd * 0.8) * Math.exp(gauss() * 0.3) * volMult * (ctx.choc ? 2 : 1));
      s.bougies.push({ o: r2(o), h: r2(h), l: r2(Math.max(0.01, l)), c: r2(c), v });
    });
  }

  /* Indice équipondéré, dividendes réinvestis, base 1000 */
  function pointIndice(m, liste) {
    let so = 0, sh = 0, sl = 0, sc = 0, sv = 0;
    liste.forEach(a => { const s = m.actifs[a.sym], b = s.bougies[s.bougies.length - 1]; so += b.o / s.ref; sh += b.h / s.ref; sl += b.l / s.ref; sc += b.c / s.ref; sv += b.v; });
    const n = liste.length;
    return { o: r2(so / n * 1000), h: r2(sh / n * 1000), l: r2(sl / n * 1000), c: r2(sc / n * 1000), v: Math.round(sv / 10) };
  }

  /* Fait passer un jour. Renvoie la liste des événements du jour. */
  function avancer(m, forcerChoc) {
    completer(m);
    m.jour++;
    const j = m.jour, evts = [];
    // Choc de marché (krach) : rare, ou déclenché à la main
    if (!m.choc && (forcerChoc || (m.pret && j - m.dernierChoc > 100 && Math.random() < 0.005))) {
      m.choc = { reste: 4 + Math.floor(Math.random() * 3), force: 0.025 + Math.random() * 0.02, debut: j };
      m.dernierChoc = j;
      evts.push({ type: "choc", texte: "💥 " + tirer(CHOCS) });
    }
    const ctx = contexte(m, m.choc);
    if (m.choc) {
      m.choc.reste--;
      if (m.choc.reste <= 0) { evts.push({ type: "finchoc", texte: "😮‍💨 Le calme revient peu à peu sur les marchés." }); m.dernierKrachFini = j; m.choc = null; }
    }
    // Actualité d'une entreprise
    if (Math.random() < 0.045) {
      const a = tirer(TOUS.filter(x => !x.holding));
      const plus = Math.random() < 0.55;
      const ampleur = (0.04 + Math.random() * 0.09) * (plus ? 1 : -1);
      const liste = a.groupe === "jack" ? (plus ? NEWS_PLUS_JACK : NEWS_MOINS_JACK) : (plus ? NEWS_PLUS : NEWS_MOINS);
      ctx.news = { sym: a.sym, ampleur };
      evts.push({ type: "news", sym: a.sym, texte: (plus ? "🟢 " : "🔴 ") + tirer(liste).replace("{nom}", a.nom) });
    }
    // Actualité qui touche tout le groupe Jack World (montre que les filiales sont corrélées)
    if (Math.random() < 0.008) {
      const [txt, s] = tirer(NEWS_GROUPE);
      ctx.groupe = s * (0.02 + Math.random() * 0.03);
      evts.push({ type: "news", sym: "NDC", groupe: true, texte: (s > 0 ? "🟢 " : "🔴 ") + txt });
    }
    pasJour(m, j, TOUS, ctx, evts);
    m.indice.push(pointIndice(m, ACTIFS));
    m.indiceJack.push(pointIndice(m, FILIALES));
    evts.forEach(e => { e.jour = j; if (e.texte) m.news.push({ jour: j, texte: e.texte, type: e.type, sym: e.sym, groupe: e.groupe }); });
    if (m.news.length > 80) m.news = m.news.slice(-80);
    return evts;
  }

  function bougies(m, sym) {
    if (sym === "JB10") return m.indice.map(b => ({ o: r2(b.o / 10), h: r2(b.h / 10), l: r2(b.l / 10), c: r2(b.c / 10), v: b.v }));
    if (sym === "INDICE") return m.indice;
    if (sym === "IJW") return m.indiceJack;
    return m.actifs[sym].bougies;
  }
  function prix(m, sym) {
    if (sym === "JB10") return r2(m.indice[m.indice.length - 1].c / 10);
    const b = bougies(m, sym); return b[b.length - 1].c;
  }
  function variation(m, sym, jours = 1) {
    const b = sym === "JB10" ? m.indice : bougies(m, sym);
    if (b.length < 2) return 0;
    return (b[b.length - 1].c / b[Math.max(0, b.length - 1 - jours)].c - 1) * 100;
  }
  function info(sym) { return sym === "JB10" ? ETF : INDICES[sym] || TOUS.find(a => a.sym === sym); }
  const estIndice = sym => !!INDICES[sym];
  function per(m, sym) {
    const a = info(sym); if (!a || a.etf || a.indice || !a.per) return null;
    // le bénéfice grandit avec la tendance de l'entreprise
    const bpa = a.prix / a.per * Math.pow(1 + a.tend, m.jour / 252);
    return prix(m, sym) / bpa;
  }
  function rendement(sym) { const a = info(sym); return a && !a.etf && !a.indice ? a.div * 100 : 0; }

  /* Date fictive (jours ouvrés) à partir du 1er décembre 2025 */
  function date(jour) {
    const d = new Date(2025, 11, 1);
    let n = jour;
    while (n > 0) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) n--; }
    return d;
  }

  window.JB_MARCHE = { ACTIFS, JACK, FILIALES, HOLDING, ETF, INDICES, JOURS_HISTO, PERIODE_DIVIDENDE, creer, completer, avancer, bougies, prix, variation, info, estIndice, per, rendement, date, tous: () => ACTIFS.concat([ETF], JACK) };
})();
