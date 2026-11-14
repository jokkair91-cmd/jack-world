// Moteur de conjugaison de Jack Blabla.
// conjuguer(langue, verbe, temps) → tableau de 6 formes (sans le pronom).
// Les formes écrites à la main dans verbe.formes[temps] passent toujours en premier.

const MOTEURS = {
  // ---------------- ANGLAIS ----------------
  en(v, t) {
    const b = v.inf;
    const s3 = /(s|sh|ch|x|z|o)$/.test(b) ? b + "es" : /[^aeiou]y$/.test(b) ? b.slice(0, -1) + "ies" : b + "s";
    const ing = v.ing || (/ie$/.test(b) ? b.slice(0, -2) + "ying" : /[^e]e$/.test(b) ? b.slice(0, -1) + "ing" : b + "ing");
    const passe = v.preterit || (/e$/.test(b) ? b + "d" : /[^aeiou]y$/.test(b) ? b.slice(0, -1) + "ied" : b + "ed");
    const pp = v.participe || passe;
    const avec = (aux) => aux.map((a) => a + " ");
    switch (t) {
      case "present": return [b, b, s3, b, b, b];
      case "continu": return avec(["am", "are", "is", "are", "are", "are"]).map((a) => a + ing);
      case "preterit": return Array(6).fill(passe);
      case "futur": return Array(6).fill("will " + b);
      case "perfect": return avec(["have", "have", "has", "have", "have", "have"]).map((a) => a + pp);
      case "conditionnel": return Array(6).fill("would " + b);
      // Temps avancés (niveaux Avancé, Pro, Expert)
      case "passe-continu": return avec(["was", "were", "was", "were", "were", "were"]).map((a) => a + ing);
      case "pluperfect": return Array(6).fill("had " + pp);
      case "perfect-continu": return avec(["have", "have", "has", "have", "have", "have"]).map((a) => a + "been " + ing);
      case "futur-perfect": return Array(6).fill("will have " + pp);
      case "cond-passe": return Array(6).fill("would have " + pp);
    }
  },

  // ---------------- ESPAGNOL ----------------
  es(v, t) {
    const groupe = v.inf.slice(-2); // ar, er, ir
    const rad = v.inf.slice(0, -2);
    const T = {
      presente: { ar: ["o", "as", "a", "amos", "áis", "an"], er: ["o", "es", "e", "emos", "éis", "en"], ir: ["o", "es", "e", "imos", "ís", "en"] },
      indefinido: { ar: ["é", "aste", "ó", "amos", "asteis", "aron"], er: ["í", "iste", "ió", "imos", "isteis", "ieron"], ir: ["í", "iste", "ió", "imos", "isteis", "ieron"] },
      imperfecto: { ar: ["aba", "abas", "aba", "ábamos", "abais", "aban"], er: ["ía", "ías", "ía", "íamos", "íais", "ían"], ir: ["ía", "ías", "ía", "íamos", "íais", "ían"] },
    };
    if (T[t]) return T[t][groupe].map((fin) => rad + fin);
    const base = v.radicalFutur || v.inf;
    if (t === "futuro") return ["é", "ás", "á", "emos", "éis", "án"].map((fin) => base + fin);
    if (t === "condicional") return ["ía", "ías", "ía", "íamos", "íais", "ían"].map((fin) => base + fin);
    // Temps composés (niveaux Avancé et Pro) : auxiliaire haber + participe
    const PARTICIPES = { hacer: "hecho", decir: "dicho", ver: "visto", poner: "puesto", escribir: "escrito", volver: "vuelto", abrir: "abierto", romper: "roto", morir: "muerto", resolver: "resuelto", descubrir: "descubierto" };
    const pp = v.participe || PARTICIPES[v.inf] || rad + (groupe === "ar" ? "ado" : "ido");
    if (t === "perfecto") return ["he", "has", "ha", "hemos", "habéis", "han"].map((a) => a + " " + pp);
    if (t === "pluscuamperfecto") return ["había", "habías", "había", "habíamos", "habíais", "habían"].map((a) => a + " " + pp);
  },

  // ---------------- ALLEMAND ----------------
  de(v, t) {
    const rad = v.inf.replace(/e?n$/, "");
    const dentale = /[td]$/.test(rad);       // arbeit-, find- → arbeitest, findet
    const sifflante = /(s|ß|z|x)$/.test(rad); // heiß- → du heißt
    const praesens = () => {
      const du = v.du || rad + (dentale ? "est" : sifflante ? "t" : "st");
      const er = v.er || rad + (dentale ? "et" : "t");
      return [rad + "e", du, er, v.inf, rad + (dentale ? "et" : "t"), v.inf];
    };
    const praeteritum = () => {
      const p = v.prat || rad + (dentale ? "ete" : "te");
      if (p.endsWith("e")) return [p, p + "st", p, p + "n", p + "t", p + "n"]; // machte, hatte, wurde
      const finD = /[td]$/.test(p), finS = /(s|ß|z)$/.test(p);           // fand, las, aß
      return [p, p + (finD || finS ? "est" : "st"), p, p + "en", p + (finD ? "et" : "t"), p + "en"];
    };
    const participe = v.participe || "ge" + rad + (dentale ? "et" : "t");
    const AUX = {
      haben: ["habe", "hast", "hat", "haben", "habt", "haben"],
      sein: ["bin", "bist", "ist", "sind", "seid", "sind"],
      werden: ["werde", "wirst", "wird", "werden", "werdet", "werden"],
    };
    switch (t) {
      case "praesens": return praesens();
      case "praeteritum": return praeteritum();
      case "perfekt": return AUX[v.aux || "haben"].map((a) => a + " " + participe);
      case "futur": return AUX.werden.map((a) => a + " " + v.inf);
      // Temps avancés (niveaux Avancé et Pro)
      case "plusquamperfekt": return (v.aux === "sein" ? ["war", "warst", "war", "waren", "wart", "waren"] : ["hatte", "hattest", "hatte", "hatten", "hattet", "hatten"]).map((a) => a + " " + participe);
      case "konjunktiv": return ["würde", "würdest", "würde", "würden", "würdet", "würden"].map((a) => a + " " + v.inf);
    }
  },
};

// ---------------- FRANÇAIS (façon Bescherelle) ----------------
// 1er groupe (-er) et 2e groupe (-ir, nous -issons) : calculés.
// 3e groupe : formes du présent, du subjonctif et du passé simple écrites dans contenu/fr.js,
// radical du futur (radFutur) et de l'imparfait (radImparfait) si besoin.
MOTEURS.fr = function (v, t) {
  const inf = v.inf, rad = inf.slice(0, -2);
  const g = v.groupe || (inf.endsWith("er") ? 1 : 2);
  // manger → mangeons, commencer → commençons (devant a et o)
  const devantAO = (b) => (/g$/.test(b) ? b + "e" : /c$/.test(b) ? b.slice(0, -1) + "ç" : b);
  const present = () => {
    if (v.formes && v.formes.present) return v.formes.present;
    if (g === 1) return [rad + "e", rad + "es", rad + "e", devantAO(rad) + "ons", rad + "ez", rad + "ent"];
    return [rad + "is", rad + "is", rad + "it", rad + "issons", rad + "issez", rad + "issent"];
  };
  const radImp = v.radImparfait || present()[3].replace(/ons$/, "");
  const imparfait = () => ["ais", "ais", "ait", "ions", "iez", "aient"].map((f) =>
    (f[0] === "i" ? radImp.replace(/ge$/, "g").replace(/ç$/, "c") : radImp) + f);
  const radF = v.radFutur || (g === 1 || g === 2 ? inf : inf.replace(/e$/, ""));
  const pp = v.participe || (g === 1 ? rad + "é" : rad + "i");
  const etre = v.aux === "etre";
  const AUX = {
    present: etre ? ["suis", "es", "est", "sommes", "êtes", "sont"] : ["ai", "as", "a", "avons", "avez", "ont"],
    imparfait: etre ? ["étais", "étais", "était", "étions", "étiez", "étaient"] : ["avais", "avais", "avait", "avions", "aviez", "avaient"],
    futur: etre ? ["serai", "seras", "sera", "serons", "serez", "seront"] : ["aurai", "auras", "aura", "aurons", "aurez", "auront"],
    conditionnel: etre ? ["serais", "serais", "serait", "serions", "seriez", "seraient"] : ["aurais", "aurais", "aurait", "aurions", "auriez", "auraient"],
  };
  // Avec être, le participe s'accorde avec le sujet : allé(e), allé(e)s
  const compose = (aux) => aux.map((a, i) => a + " " + (etre ? pp + (i < 3 ? "(e)" : "(e)s") : pp));
  switch (t) {
    case "present": return present();
    case "imparfait": return imparfait();
    case "futur": return ["ai", "as", "a", "ons", "ez", "ont"].map((f) => radF + f);
    case "conditionnel": return ["ais", "ais", "ait", "ions", "iez", "aient"].map((f) => radF + f);
    case "subjonctif":
      if (g === 1) return ["e", "es", "e", "ions", "iez", "ent"].map((f) => rad + f);
      return ["e", "es", "e", "ions", "iez", "ent"].map((f) => rad + "iss" + f);
    case "passe-simple":
      if (g === 1) return ["ai", "as", "a", "âmes", "âtes", "èrent"].map((f) => (f[0] === "è" ? rad : devantAO(rad)) + f);
      return ["is", "is", "it", "îmes", "îtes", "irent"].map((f) => rad + f);
    case "passe-compose": return compose(AUX.present);
    case "plus-que-parfait": return compose(AUX.imparfait);
    case "futur-anterieur": return compose(AUX.futur);
    case "cond-passe": return compose(AUX.conditionnel);
  }
};

function conjuguer(langue, verbe, temps) {
  if (verbe.formes && verbe.formes[temps]) return verbe.formes[temps];
  return MOTEURS[langue](verbe, temps);
}
