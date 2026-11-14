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
    }
  },
};

function conjuguer(langue, verbe, temps) {
  if (verbe.formes && verbe.formes[temps]) return verbe.formes[temps];
  return MOTEURS[langue](verbe, temps);
}
