/* Jack Bours : le marché fictif.
   10 entreprises inventées + l'indice JUNGLE 10 + l'ETF JB10 qui le copie.
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
  ];
  const ETF = { sym: "JB10", nom: "ETF JB10", secteur: "ETF", etf: true, desc: "ETF qui copie l'indice JUNGLE 10 : en l'achetant, vous avez un peu des 10 entreprises d'un coup. Il est « capitalisant » : les dividendes sont réinvestis dans le fonds au lieu d'être versés." };
  const JOURS_HISTO = 160;      // historique créé au départ
  const PERIODE_DIVIDENDE = 60; // un dividende tous les 60 jours de bourse

  const NEWS_PLUS = ["{nom} publie des résultats meilleurs que prévu", "{nom} signe un très gros contrat", "{nom} annonce un nouveau produit très attendu", "{nom} relève ses objectifs pour l'année", "{nom} annonce le rachat d'un concurrent, le marché applaudit"];
  const NEWS_MOINS = ["{nom} déçoit avec ses résultats", "{nom} rappelle des produits défectueux", "Enquête des autorités sur {nom}", "{nom} perd un client important", "{nom} abaisse ses prévisions pour l'année"];
  const CHOCS = ["Panique sur les marchés : une grande banque étrangère est en difficulté", "Krach : une crise sanitaire mondiale fait chuter toutes les Bourses", "Les taux d'intérêt s'envolent : les investisseurs vendent tout"];

  function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  const r2 = x => Math.round(x * 100) / 100;

  function creer() {
    const m = { jour: -1, pret: false, actifs: {}, indice: [], news: [], choc: null, dernierChoc: -999, dernierKrachFini: null };
    ACTIFS.forEach(a => { m.actifs[a.sym] = { bougies: [], ref: a.prix, prixDepart: a.prix }; });
    for (let i = 0; i < JOURS_HISTO; i++) avancer(m);
    m.pret = true;
    m.news = m.news.slice(-6);
    return m;
  }

  /* Fait passer un jour. Renvoie la liste des événements du jour. */
  function avancer(m, forcerChoc) {
    m.jour++;
    const j = m.jour, evts = [];
    // Choc de marché (krach) : rare, ou déclenché à la main
    if (!m.choc && (forcerChoc || (m.pret && j - m.dernierChoc > 100 && Math.random() < 0.005))) {
      m.choc = { reste: 4 + Math.floor(Math.random() * 3), force: 0.025 + Math.random() * 0.02, debut: j };
      m.dernierChoc = j;
      const txt = CHOCS[Math.floor(Math.random() * CHOCS.length)];
      evts.push({ type: "choc", texte: "💥 " + txt });
    }
    let marche = 0.0003 + gauss() * 0.009;
    if (m.choc) {
      marche = -m.choc.force + gauss() * 0.018;
      m.choc.reste--;
      if (m.choc.reste <= 0) { evts.push({ type: "finchoc", texte: "😮‍💨 Le calme revient peu à peu sur les marchés." }); m.dernierKrachFini = j; m.choc = null; }
    }
    const secteurs = {};
    ACTIFS.forEach(a => { if (!(a.secteur in secteurs)) secteurs[a.secteur] = gauss() * 0.006; });
    // Actualité d'entreprise
    let news = null;
    if (Math.random() < 0.035) {
      const a = ACTIFS[Math.floor(Math.random() * ACTIFS.length)];
      const plus = Math.random() < 0.55;
      const ampleur = (0.04 + Math.random() * 0.09) * (plus ? 1 : -1);
      const liste = plus ? NEWS_PLUS : NEWS_MOINS;
      news = { sym: a.sym, ampleur };
      evts.push({ type: "news", sym: a.sym, texte: (plus ? "🟢 " : "🔴 ") + liste[Math.floor(Math.random() * liste.length)].replace("{nom}", a.nom) });
    }
    ACTIFS.forEach(a => {
      const s = m.actifs[a.sym];
      const prev = s.bougies.length ? s.bougies[s.bougies.length - 1].c : a.prix;
      let base = prev;
      // Détachement du dividende
      if (a.div > 0 && j > 0 && j % PERIODE_DIVIDENDE === 0) {
        const d = r2(prev * a.div * PERIODE_DIVIDENDE / 252);
        if (d > 0) { base = prev - d; s.ref *= base / prev; evts.push({ type: "dividende", sym: a.sym, montant: d, texte: "💶 " + a.nom + " verse un dividende de " + d.toFixed(2).replace(".", ",") + " € par action." }); }
      }
      const sd = a.vol / Math.sqrt(252) * (m.choc ? 1.8 : 1);
      let gap = gauss() * sd * 0.25;
      let volMult = 1;
      if (news && news.sym === a.sym) { gap += news.ampleur; volMult = 3 + Math.random() * 2; }
      if (m.choc && a.sym === "LNS") gap += 0.01; // la santé résiste un peu mieux
      const o = base * Math.exp(gap);
      const ret = a.tend / 252 + a.beta * marche + secteurs[a.secteur] + gauss() * sd * 0.75;
      const c = o * Math.exp(ret);
      const h = Math.max(o, c) * (1 + Math.abs(gauss()) * sd * 0.45);
      const l = Math.min(o, c) * (1 - Math.abs(gauss()) * sd * 0.45);
      const v = Math.round(100000 * (1 + Math.abs(ret + gap) / sd * 0.8) * Math.exp(gauss() * 0.3) * volMult * (m.choc ? 2 : 1));
      s.bougies.push({ o: r2(o), h: r2(h), l: r2(Math.max(0.01, l)), c: r2(c), v });
    });
    // Indice JUNGLE 10 (équipondéré, dividendes réinvestis) et ETF
    let so = 0, sh = 0, sl = 0, sc = 0, sv = 0;
    ACTIFS.forEach(a => { const s = m.actifs[a.sym], b = s.bougies[s.bougies.length - 1]; so += b.o / s.ref; sh += b.h / s.ref; sl += b.l / s.ref; sc += b.c / s.ref; sv += b.v; });
    const n = ACTIFS.length;
    m.indice.push({ o: r2(so / n * 1000), h: r2(sh / n * 1000), l: r2(sl / n * 1000), c: r2(sc / n * 1000), v: Math.round(sv / 10) });
    evts.forEach(e => { e.jour = j; if (e.texte) m.news.push({ jour: j, texte: e.texte, type: e.type }); });
    if (m.news.length > 80) m.news = m.news.slice(-80);
    return evts;
  }

  function bougies(m, sym) {
    if (sym === "JB10") return m.indice.map(b => ({ o: r2(b.o / 10), h: r2(b.h / 10), l: r2(b.l / 10), c: r2(b.c / 10), v: b.v }));
    if (sym === "INDICE") return m.indice;
    return m.actifs[sym].bougies;
  }
  function prix(m, sym) {
    if (sym === "JB10") return r2(m.indice[m.indice.length - 1].c / 10);
    const b = m.actifs[sym].bougies; return b[b.length - 1].c;
  }
  function variation(m, sym) {
    const b = sym === "JB10" ? m.indice : m.actifs[sym].bougies;
    if (b.length < 2) return 0;
    return (b[b.length - 1].c / b[b.length - 2].c - 1) * 100;
  }
  function info(sym) { return sym === "JB10" ? ETF : ACTIFS.find(a => a.sym === sym); }
  function per(m, sym) {
    const a = info(sym); if (!a || a.etf) return null;
    // le bénéfice grandit avec la tendance de l'entreprise
    const bpa = a.prix / a.per * Math.pow(1 + a.tend, m.jour / 252);
    return prix(m, sym) / bpa;
  }
  function rendement(sym) { const a = info(sym); return a && !a.etf ? a.div * 100 : 0; }

  /* Date fictive (jours ouvrés) à partir du 1er décembre 2025 */
  function date(jour) {
    const d = new Date(2025, 11, 1);
    let n = jour;
    while (n > 0) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) n--; }
    return d;
  }

  window.JB_MARCHE = { ACTIFS, ETF, JOURS_HISTO, PERIODE_DIVIDENDE, creer, avancer, bougies, prix, variation, info, per, rendement, date, tous: () => ACTIFS.concat([ETF]) };
})();
