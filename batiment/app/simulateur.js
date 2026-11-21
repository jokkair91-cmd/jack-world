/* =========================================================
   Mini-simulateur de ligne de commande façon AutoCAD
   LIGNE, CERCLE, RECTANG, DISTANCE, EFFACER, U, ZOOM E, NOUVEAU
   Coordonnées : x,y   @dx,dy   @distance<angle
   ========================================================= */
(function () {
  "use strict";

  const MISSIONS = [
    { id: "m1", titre: "Ta première ligne", consigne: "Dessine une ligne de **0,0** à **500,0**. Tape `LIGNE` (ou `L`), puis `0,0`, puis `500,0`, puis Entrée (vide) pour finir.",
      etapes: [["LIGNE", "On lance la commande Ligne (tu peux aussi taper juste L)."], ["0,0", "Premier point : l'origine du dessin."], ["500,0", "Point suivant : 500 unités vers la droite."], ["", "Entrée à vide : la commande se termine."]],
      test: (o) => o.some((x) => x.type === "ligne" && segEgal(x, { x: 0, y: 0 }, { x: 500, y: 0 })) },
    { id: "m2", titre: "Une pièce de 500 × 300 en relatif", consigne: "Avec `LIGNE` : premier point `0,0`, puis `@500,0`, `@0,300`, `@-500,0`, et `C` pour clore.",
      etapes: [["LIGNE", "Commande Ligne."], ["0,0", "On part de l'origine."], ["@500,0", "Le @ veut dire « depuis le dernier point » : 500 vers la droite."], ["@0,300", "300 vers le haut."], ["@-500,0", "500 vers la gauche (le signe moins)."], ["C", "C = Clore : AutoCAD revient tout seul au point de départ."]],
      test: (o) => rectEnLignes(o, 0, 0, 500, 300) },
    { id: "m3", titre: "Un poteau rond", consigne: "Avec `CERCLE` (ou `C`) : centre `250,150`, rayon `20`.",
      etapes: [["CERCLE", "Commande Cercle."], ["250,150", "Le centre du cercle, au milieu de la pièce."], ["20", "Le rayon : 20 (donc un poteau de 40 de diamètre)."]],
      test: (o) => o.some((x) => x.type === "cercle" && proche(x.c, { x: 250, y: 150 }) && Math.abs(x.r - 20) < 0.01) },
    { id: "m4", titre: "Une dalle avec RECTANG", consigne: "Avec `RECTANG` (ou `REC`) : premier coin `1000,0`, autre coin `@400,300`.",
      etapes: [["RECTANG", "Commande Rectangle (raccourci REC)."], ["1000,0", "Premier coin de la dalle."], ["@400,300", "L'autre coin : 400 de large et 300 de haut depuis le premier."]],
      test: (o) => o.some((x) => x.type === "rect" && Math.abs(Math.min(x.a.x, x.b.x) - 1000) < 0.01 && Math.abs(Math.min(x.a.y, x.b.y)) < 0.01 && Math.abs(Math.abs(x.b.x - x.a.x) - 400) < 0.01 && Math.abs(Math.abs(x.b.y - x.a.y) - 300) < 0.01) },
    { id: "m5", titre: "Une rampe en polaire", consigne: "Avec `LIGNE` : départ `1400,0`, puis `@600<5` (600 de long, incliné à 5°).",
      etapes: [["LIGNE", "Commande Ligne."], ["1400,0", "Départ de la rampe."], ["@600<5", "Polaire : 600 de long, dans la direction 5° (le signe < veut dire « angle »)."], ["", "Entrée à vide pour finir."]],
      test: (o) => o.some((x) => x.type === "ligne" && (segEgal(x, { x: 1400, y: 0 }, { x: 1400 + 600 * Math.cos(5 * Math.PI / 180), y: 600 * Math.sin(5 * Math.PI / 180) }))) },
    { id: "m6", titre: "Mesurer la diagonale", consigne: "Avec `DISTANCE` (ou `DI`) : mesure de `0,0` à `500,300`. Note le résultat : c'est la diagonale pour contrôler l'équerrage.",
      etapes: [["DISTANCE", "Commande Distance (raccourci DI)."], ["0,0", "Premier coin de la pièce."], ["500,300", "Coin opposé : AutoCAD affiche la longueur de la diagonale."]],
      test: (o, s) => !!s.diagonale }
  ];
  // Ce que veut dire chaque question d'AutoCAD, en clair
  const AIDES = [
    [/^Commande/, "AutoCAD attend une <b>commande</b> : tape son nom (ex. <code>LIGNE</code>) puis <kbd>Entrée</kbd>, ou clique sur un bouton ci-dessus."],
    [/^Premier point|^Premier coin/, "Donne un <b>point</b> : tape des coordonnées comme <code>0,0</code> puis <kbd>Entrée</kbd>, ou clique dans le dessin."],
    [/^Point suivant/, "Point suivant : <code>@500,0</code> = 500 plus loin en X depuis le dernier point · <code>@600&lt;30</code> = 600 dans la direction 30° · <kbd>Entrée</kbd> à vide = terminer · <code>C</code> = fermer le contour · <code>U</code> = défaire le dernier segment."],
    [/^Centre/, "Donne le <b>centre</b> du cercle : tape <code>x,y</code> ou clique."],
    [/^Rayon/, "Tape le <b>rayon</b> (un nombre) puis <kbd>Entrée</kbd>. Tape <code>D</code> si tu préfères donner le diamètre."],
    [/^Diamètre/, "Tape le <b>diamètre</b> puis <kbd>Entrée</kbd>."],
    [/^Autre coin/, "Le coin opposé du rectangle, souvent en relatif : <code>@400,300</code> = 400 de large, 300 de haut."],
    [/^Deuxième point/, "Le deuxième point de la mesure : AutoCAD affichera la distance et l'angle."],
    [/^Zoom/, "Tape <code>E</code> pour « Étendu » : tout le dessin tient dans l'écran."]
  ];

  function proche(a, b, t = 0.05) { return Math.abs(a.x - b.x) < t && Math.abs(a.y - b.y) < t; }
  function segEgal(l, p, q) { return (proche(l.a, p) && proche(l.b, q)) || (proche(l.a, q) && proche(l.b, p)); }
  function rectEnLignes(o, x0, y0, x1, y1) {
    const c = [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }];
    const lignes = o.filter((x) => x.type === "ligne");
    return [0, 1, 2, 3].every((i) => lignes.some((l) => segEgal(l, c[i], c[(i + 1) % 4])));
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`(.+?)`/g, "<code>$1</code>");
  const n2 = (v) => (Math.round(v * 100) / 100).toLocaleString("fr-FR", { maximumFractionDigits: 2 });

  function monter(racine, outils) {
    racine.innerHTML = `
      <div class="pile">
        <div class="simu">
          <div class="ruban" role="toolbar" aria-label="Outils de dessin">
            <button type="button" data-cmd="LIGNE" title="Ligne (L)">╱<span>Ligne</span></button>
            <button type="button" data-cmd="CERCLE" title="Cercle (C)">◯<span>Cercle</span></button>
            <button type="button" data-cmd="RECTANG" title="Rectangle (REC)">▭<span>Rectangle</span></button>
            <button type="button" data-cmd="DISTANCE" title="Distance (DI)">↔<span>Mesurer</span></button>
            <button type="button" data-cmd="U" title="Annuler (U)">↶<span>Annuler</span></button>
            <button type="button" data-cmd="Z E" title="Zoom étendu">⤢<span>Tout voir</span></button>
            <button type="button" data-zoom="1.25" title="Zoom avant">＋<span>Zoom</span></button>
            <button type="button" data-zoom="0.8" title="Zoom arrière">－<span>Zoom</span></button>
            <button type="button" data-cmd="ESC" title="Échap : annuler la commande en cours">⎋<span>Échap</span></button>
            <button type="button" data-cmd="NOUVEAU" title="Tout effacer">🗑<span>Nouveau</span></button>
          </div>
          <div class="guide" id="guide" hidden></div>
          <canvas id="cv" width="1000" height="625" aria-label="Zone de dessin du simulateur"></canvas>
          <div class="aide-invite" id="aide" aria-live="polite"></div>
          <div class="console">
            <div class="hist" id="hist" aria-live="polite"></div>
            <form class="saisie" id="fsaisie" autocomplete="off"><span id="invite">Commande :</span><input id="cmd" aria-label="Ligne de commande" spellcheck="false" autocapitalize="off"></form>
          </div>
          <p class="muted petit" style="margin:0">Curseur : <span id="pos">—</span> · Clic dans le dessin = donner un point (accroché aux extrémités proches) · Molette ou boutons ＋/－ = zoom · Clic droit maintenu = se déplacer · Décimales avec un point : <code>12.5</code></p>
        </div>
        <div class="grille large" id="missions"></div>
      </div>
      <div class="carte" style="margin-top:14px">
        <h3>⌨️ Commandes du simulateur</h3>
        <p class="petit"><code>LIGNE</code>/<code>L</code> · <code>CERCLE</code>/<code>C</code> · <code>RECTANG</code>/<code>REC</code> · <code>DISTANCE</code>/<code>DI</code> · <code>EFFACER</code>/<code>E</code> (dernier objet) · <code>U</code> (annuler) · <code>ZOOM</code>/<code>Z</code> puis <code>E</code> · <code>NOUVEAU</code> (tout effacer). Entrée vide = valider / répéter la dernière commande, Échap = annuler. Les noms anglais avec tiret bas marchent aussi : <code>_LINE</code>, <code>_CIRCLE</code>…</p>
        <p class="petit muted" style="margin:0">C'est un simulateur d'apprentissage : il reprend la logique de la ligne de commande d'AutoCAD, pas toutes ses fonctions.</p>
      </div>`;

    const cv = racine.querySelector("#cv"), ctx = cv.getContext("2d");
    const hist = racine.querySelector("#hist"), invite = racine.querySelector("#invite"), cmd = racine.querySelector("#cmd");
    const posEl = racine.querySelector("#pos"), zoneMissions = racine.querySelector("#missions");
    let objets = [];
    const suivi = { diagonale: false };
    let vue = { x: -100, y: -100, s: 0.5 };   // origine monde en bas à gauche, échelle px/unité
    let souris = null;
    let etape = null;   // état de la commande en cours
    let derniere = "";
    let faites = outils.lire("missions") || [];

    /* ---------- Affichage ---------- */
    function taille() {
      const r = cv.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(300, Math.round(r.width * dpr)), h = Math.round(w * 10 / 16);
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    }
    const versEcran = (p) => ({ x: (p.x - vue.x) * vue.s, y: cv.height - (p.y - vue.y) * vue.s });
    const versMonde = (px, py) => ({ x: px / vue.s + vue.x, y: (cv.height - py) / vue.s + vue.y });

    function dessiner() {
      taille();
      ctx.fillStyle = "#212830"; ctx.fillRect(0, 0, cv.width, cv.height);
      // grille adaptative
      const pas = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000].find((p) => p * vue.s >= 28) || 10000;
      const a = versMonde(0, cv.height), b = versMonde(cv.width, 0);
      ctx.lineWidth = 1;
      for (let x = Math.floor(a.x / pas) * pas; x <= b.x; x += pas) {
        const e = versEcran({ x, y: 0 }).x;
        ctx.strokeStyle = x === 0 ? "rgba(255,93,82,.55)" : "rgba(255,255,255,.06)";
        ctx.beginPath(); ctx.moveTo(e, 0); ctx.lineTo(e, cv.height); ctx.stroke();
      }
      for (let y = Math.floor(a.y / pas) * pas; y <= b.y; y += pas) {
        const e = versEcran({ x: 0, y }).y;
        ctx.strokeStyle = y === 0 ? "rgba(60,196,124,.55)" : "rgba(255,255,255,.06)";
        ctx.beginPath(); ctx.moveTo(0, e); ctx.lineTo(cv.width, e); ctx.stroke();
      }
      ctx.fillStyle = "rgba(169,174,181,.8)"; ctx.font = `${12 * (window.devicePixelRatio || 1)}px Consolas, monospace`;
      ctx.fillText(`grille : ${pas}`, 8, cv.height - 8);
      // objets
      ctx.lineWidth = 2 * (window.devicePixelRatio || 1);
      ctx.strokeStyle = "#ffc420";
      objets.forEach((o) => tracer(o));
      // aperçu élastique
      if (etape && etape.dernier && souris) {
        ctx.strokeStyle = "rgba(79,179,255,.9)"; ctx.setLineDash([6, 5]);
        if (etape.cmd === "rect") tracer({ type: "rect", a: etape.dernier, b: souris });
        else if (etape.cmd === "cercle") tracer({ type: "cercle", c: etape.dernier, r: dist(etape.dernier, souris) });
        else { const p = versEcran(etape.dernier), q = versEcran(souris); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        ctx.setLineDash([]);
      }
      // curseur
      if (souris) {
        const p = versEcran(souris);
        ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(p.x - 12, p.y); ctx.lineTo(p.x + 12, p.y); ctx.moveTo(p.x, p.y - 12); ctx.lineTo(p.x, p.y + 12); ctx.stroke();
        if (souris.accroche) { ctx.strokeStyle = "#3cc47c"; ctx.lineWidth = 2; ctx.strokeRect(p.x - 7, p.y - 7, 14, 14); }
      }
    }
    function tracer(o) {
      ctx.beginPath();
      if (o.type === "ligne") { const p = versEcran(o.a), q = versEcran(o.b); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); }
      else if (o.type === "cercle") { const c = versEcran(o.c); ctx.arc(c.x, c.y, Math.max(0.5, o.r * vue.s), 0, Math.PI * 2); }
      else if (o.type === "rect") { const p = versEcran(o.a), q = versEcran(o.b); ctx.rect(Math.min(p.x, q.x), Math.min(p.y, q.y), Math.abs(q.x - p.x), Math.abs(q.y - p.y)); }
      ctx.stroke();
    }
    function zoomEtendu() {
      const pts = [];
      objets.forEach((o) => {
        if (o.type === "cercle") pts.push({ x: o.c.x - o.r, y: o.c.y - o.r }, { x: o.c.x + o.r, y: o.c.y + o.r });
        else pts.push(o.a, o.b);
      });
      if (!pts.length) { vue = { x: -100, y: -100, s: cv.width / 2100 }; return; }
      let x0 = Math.min(...pts.map((p) => p.x)), x1 = Math.max(...pts.map((p) => p.x));
      let y0 = Math.min(...pts.map((p) => p.y)), y1 = Math.max(...pts.map((p) => p.y));
      const w = Math.max(x1 - x0, 10), h = Math.max(y1 - y0, 10);
      const s = Math.min(cv.width / (w * 1.15), cv.height / (h * 1.15));
      vue = { s, x: x0 - (cv.width / s - w) / 2, y: y0 - (cv.height / s - h) / 2 };
    }

    /* ---------- Console ---------- */
    function ecrire(t, cls) {
      const d = document.createElement("div");
      if (cls) d.className = cls;
      d.textContent = t; hist.appendChild(d); hist.scrollTop = hist.scrollHeight;
    }
    const aideEl = racine.querySelector("#aide"), guideEl = racine.querySelector("#guide");
    function demander(t) {
      invite.textContent = t;
      const a = AIDES.find(([re]) => re.test(t));
      aideEl.innerHTML = `<b>AutoCAD te demande : « ${esc(t.replace(/\s*:$/, ""))} »</b><br>${a ? a[1] : ""}`;
    }

    /* ---------- Mode guidé et démonstration ---------- */
    let guide = null;   // { m, i, demo }
    const normal = (s) => String(s).trim().toUpperCase().replace(/\s+/g, "");
    const memeCommande = (a, b) => { const na = ALIAS[normal(a)], nb = ALIAS[normal(b)]; return na && na === nb; };
    function afficherGuide() {
      if (!guide) { guideEl.hidden = true; return; }
      const m = guide.m, et = m.etapes;
      if (guide.i >= et.length) {
        guideEl.hidden = false;
        guideEl.innerHTML = `<b>✅ ${esc(m.titre)} : terminé !</b> ${guide.demo ? "À toi maintenant : clique sur « Guide-moi » et refais-le toi-même." : "Bravo, tu l'as fait toi-même."} <button type="button" class="btn sec" id="gFermer" style="padding:4px 10px">Fermer</button>`;
        guideEl.querySelector("#gFermer").onclick = () => { guide = null; afficherGuide(); };
        return;
      }
      const [saisie, explication] = et[guide.i];
      guideEl.hidden = false;
      guideEl.innerHTML = `<div class="ligne espace"><b>🧭 ${esc(m.titre)} · étape ${guide.i + 1}/${et.length}</b>
          <span class="ligne">${guide.demo ? "" : `<button type="button" class="btn sec" id="gRemplir" style="padding:4px 10px">✍️ Écris-le pour moi</button>`}<button type="button" class="btn sec" id="gStop" style="padding:4px 10px">✕ Arrêter</button></span></div>
        <div style="margin-top:6px">${saisie ? `Tape <code class="gros">${esc(saisie)}</code> puis appuie sur <kbd>Entrée</kbd>` : `Appuie sur <kbd>Entrée</kbd> sans rien écrire`}</div>
        <div class="petit muted">${esc(explication)}</div>`;
      guideEl.querySelector("#gStop").onclick = () => { guide = null; afficherGuide(); };
      const r = guideEl.querySelector("#gRemplir");
      if (r) r.onclick = () => { cmd.value = saisie; cmd.focus(); };
    }
    function avancerGuide(saisie) {
      if (!guide || guide.demo || guide.i >= guide.m.etapes.length) return;
      const attendu = guide.m.etapes[guide.i][0];
      const ok = normal(saisie) === normal(attendu) || (guide.i === 0 && memeCommande(saisie, attendu));
      if (ok) { guide.i++; afficherGuide(); }
      else outils.toast(attendu ? `Pas tout à fait : l'étape demande « ${attendu} »` : "Ici, appuie sur Entrée sans rien écrire");
    }
    function demarrerGuide(m, demo) {
      if (etape) { ecrire("*Annulé*", "err"); fin(); }
      guide = { m, i: 0, demo };
      afficherGuide();
      if (!demo) { cmd.focus(); return; }
      cmd.disabled = true;
      const tape = (texte, suite) => {
        let k = 0;
        cmd.value = "";
        const t = setInterval(() => {
          if (!guide || !guide.demo) { clearInterval(t); cmd.disabled = false; return; }
          if (k < texte.length) { cmd.value += texte[k++]; return; }
          clearInterval(t);
          setTimeout(() => { cmd.value = ""; traiter(texte); if (objets.length) { zoomEtendu(); dessiner(); } guide.i++; afficherGuide(); suite(); }, 450);
        }, 140);
      };
      const pas = (i) => {
        if (!guide || !guide.demo) { cmd.disabled = false; return; }
        if (i >= m.etapes.length) { cmd.disabled = false; zoomEtendu(); dessiner(); return; }
        setTimeout(() => tape(m.etapes[i][0], () => pas(i + 1)), i === 0 ? 300 : 1300);
      };
      pas(0);
    }
    function fin() { etape = null; demander("Commande :"); dessiner(); verifier(); }

    const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
    function lirePoint(txt, ref) {
      const t = txt.replace(/\s+/g, "");
      let m;
      if ((m = t.match(/^@(-?\d+(?:\.\d+)?)<(-?\d+(?:\.\d+)?)$/))) {
        if (!ref) return { err: "Pas de point précédent pour une coordonnée relative." };
        const d = +m[1], an = +m[2] * Math.PI / 180;
        return { x: ref.x + d * Math.cos(an), y: ref.y + d * Math.sin(an) };
      }
      if ((m = t.match(/^@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/))) {
        if (!ref) return { err: "Pas de point précédent pour une coordonnée relative." };
        return { x: ref.x + +m[1], y: ref.y + +m[2] };
      }
      if ((m = t.match(/^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/))) return { x: +m[1], y: +m[2] };
      return { err: "Point non valide. Exemples : 100,50   @200,0   @300<90" };
    }
    const fp = (p) => `${n2(p.x)},${n2(p.y)}`;

    const ALIAS = {
      L: "ligne", LIGNE: "ligne", _LINE: "ligne", LINE: "ligne",
      C: "cercle", CERCLE: "cercle", _CIRCLE: "cercle", CIRCLE: "cercle",
      REC: "rect", RECTANG: "rect", _RECTANG: "rect", RECTANGLE: "rect",
      DI: "distance", DISTANCE: "distance", _DIST: "distance", DIST: "distance",
      E: "effacer", EFFACER: "effacer", _ERASE: "effacer", ERASE: "effacer",
      U: "annuler", ANNULER: "annuler", _U: "annuler", _UNDO: "annuler", UNDO: "annuler",
      Z: "zoom", ZOOM: "zoom", _ZOOM: "zoom",
      NOUVEAU: "nouveau", _NEW: "nouveau", NEW: "nouveau"
    };

    function lancer(nom, brut) {
      derniere = brut;
      ecrire("Commande : " + brut.toUpperCase());
      switch (nom) {
        case "ligne": etape = { cmd: "ligne", pts: [], segs: [] }; demander("Premier point :"); break;
        case "cercle": etape = { cmd: "cercle" }; demander("Centre du cercle :"); break;
        case "rect": etape = { cmd: "rect" }; demander("Premier coin :"); break;
        case "distance": etape = { cmd: "distance" }; demander("Premier point :"); break;
        case "zoom": etape = { cmd: "zoom" }; demander("Zoom [Étendu (E)] :"); break;
        case "effacer":
          if (objets.length) { objets.pop(); ecrire("1 objet effacé (le dernier dessiné).", "ok"); } else ecrire("Rien à effacer.", "err");
          fin(); break;
        case "annuler":
          if (objets.length) { objets.pop(); ecrire("Annulé : dernier objet.", "ok"); } else ecrire("Rien à annuler.", "err");
          fin(); break;
        case "nouveau": objets = []; suivi.diagonale = false; ecrire("Nouveau dessin.", "ok"); zoomEtendu(); fin(); break;
      }
      dessiner();
    }

    function traiter(brut) {
      const t = brut.trim();
      const T = t.toUpperCase();
      if (!etape) {
        if (!t) { if (derniere) { const n = ALIAS[derniere.toUpperCase()]; if (n) lancer(n, derniere); } return; }
        const z = T.match(/^(Z|ZOOM|_ZOOM)\s+E$/);
        if (z) { ecrire("Commande : " + T); zoomEtendu(); derniere = "Z"; ecrire("Zoom étendu.", "ok"); dessiner(); return; }
        const nom = ALIAS[T];
        if (!nom) { ecrire(`Commande inconnue « ${t} ». Essaie LIGNE, CERCLE, RECTANG, DISTANCE, EFFACER, U, ZOOM.`, "err"); return; }
        lancer(nom, t);
        return;
      }
      ecrire(invite.textContent + " " + t);
      const e = etape;
      if (e.cmd === "zoom") {
        if (T === "E" || T === "ETENDU" || T === "ÉTENDU" || T === "_E") { zoomEtendu(); ecrire("Zoom étendu.", "ok"); }
        else if (t) ecrire("Option non gérée ici : tape E pour Étendu.", "err");
        return fin();
      }
      if (e.cmd === "ligne") {
        if (!t) { if (e.segs.length) ecrire(`${e.segs.length} segment(s) dessiné(s).`, "ok"); return fin(); }
        if (T === "C" && e.pts.length >= 3) {
          const s = { type: "ligne", a: e.pts[e.pts.length - 1], b: e.pts[0] };
          objets.push(s); e.segs.push(s); ecrire("Contour fermé.", "ok"); return fin();
        }
        if (T === "U" && e.segs.length) {
          const s = e.segs.pop(); objets.splice(objets.indexOf(s), 1); e.pts.pop(); e.dernier = e.pts[e.pts.length - 1];
          demander("Point suivant [annUler/Clore] :"); dessiner(); return;
        }
        const p = lirePoint(t, e.dernier);
        if (p.err) { ecrire(p.err, "err"); return; }
        if (e.dernier) { const s = { type: "ligne", a: e.dernier, b: p }; objets.push(s); e.segs.push(s); }
        e.pts.push(p); e.dernier = p;
        demander(e.pts.length >= 3 ? "Point suivant [annUler/Clore] :" : "Point suivant [annUler] :");
        dessiner(); verifier(); return;
      }
      if (e.cmd === "cercle") {
        if (!e.dernier) {
          const p = lirePoint(t, null); if (p.err) { ecrire(p.err, "err"); return; }
          e.dernier = p; demander("Rayon du cercle [Diamètre (D)] :"); dessiner(); return;
        }
        if (T === "D") { e.diam = true; demander("Diamètre du cercle :"); return; }
        let r = parseFloat(t);
        if (!isFinite(r)) { const p = lirePoint(t, e.dernier); if (p.err) { ecrire("Tape un nombre (rayon) ou un point.", "err"); return; } r = dist(e.dernier, p); }
        if (e.diam) r = r / 2;
        if (r <= 0) { ecrire("Le rayon doit être positif.", "err"); return; }
        objets.push({ type: "cercle", c: e.dernier, r }); ecrire(`Cercle de rayon ${n2(r)}.`, "ok"); return fin();
      }
      if (e.cmd === "rect") {
        const p = lirePoint(t, e.dernier); if (p.err) { ecrire(p.err, "err"); return; }
        if (!e.dernier) { e.dernier = p; demander("Autre coin (ex. @400,300) :"); dessiner(); return; }
        if (p.x === e.dernier.x || p.y === e.dernier.y) { ecrire("Le rectangle serait plat : donne un autre coin.", "err"); return; }
        objets.push({ type: "rect", a: e.dernier, b: p }); ecrire(`Rectangle ${n2(Math.abs(p.x - e.dernier.x))} × ${n2(Math.abs(p.y - e.dernier.y))}.`, "ok"); return fin();
      }
      if (e.cmd === "distance") {
        const p = lirePoint(t, e.dernier); if (p.err) { ecrire(p.err, "err"); return; }
        if (!e.dernier) { e.dernier = p; demander("Deuxième point :"); dessiner(); return; }
        const a = e.dernier, d = dist(a, p), an = Math.atan2(p.y - a.y, p.x - a.x) * 180 / Math.PI;
        ecrire(`Distance = ${n2(d)}, Angle = ${n2((an + 360) % 360)}°, Delta X = ${n2(p.x - a.x)}, Delta Y = ${n2(p.y - a.y)}`, "ok");
        if ((proche(a, { x: 0, y: 0 }) && proche(p, { x: 500, y: 300 })) || (proche(p, { x: 0, y: 0 }) && proche(a, { x: 500, y: 300 }))) suivi.diagonale = true;
        return fin();
      }
    }

    /* ---------- Missions ---------- */
    function afficherMissions() {
      zoneMissions.innerHTML = `<h3 style="margin:0;grid-column:1/-1">🎯 Missions (${faites.length}/${MISSIONS.length})</h3>` + MISSIONS.map((m, i) => {
        const ok = faites.includes(m.id);
        return `<div class="carte mission ${ok ? "reussie" : ""}"><b>${ok ? "✅" : i + 1 + "."} ${esc(m.titre)}</b><p class="petit" style="margin:.3em 0 0">${fmt(m.consigne)}</p>
          <div class="ligne" style="margin-top:8px"><button type="button" class="btn sec" style="padding:6px 10px" data-demo="${i}">▶ Montre-moi</button><button type="button" class="btn" style="padding:6px 10px" data-guide="${i}">🧭 Guide-moi</button></div></div>`;
      }).join("") + `<button class="btn sec" id="raz-missions" type="button">Recommencer les missions</button>`;
      zoneMissions.querySelector("#raz-missions").onclick = () => { faites = []; outils.sauver("missions", faites); afficherMissions(); };
      zoneMissions.querySelectorAll("[data-demo]").forEach((b) => { b.onclick = () => { demarrerGuide(MISSIONS[+b.dataset.demo], true); racine.scrollIntoView({ behavior: "smooth" }); }; });
      zoneMissions.querySelectorAll("[data-guide]").forEach((b) => { b.onclick = () => { demarrerGuide(MISSIONS[+b.dataset.guide], false); racine.scrollIntoView({ behavior: "smooth" }); }; });
    }
    function verifier() {
      let nouveau = false;
      MISSIONS.forEach((m) => {
        if (!faites.includes(m.id) && m.test(objets, suivi)) { faites.push(m.id); nouveau = true; outils.toast("Mission réussie : " + m.titre + " ✓"); }
      });
      if (nouveau) { outils.sauver("missions", faites); afficherMissions(); }
      if (suivi.diagonale && !suivi.dit) { suivi.dit = true; ecrire("👉 Diagonale d'une pièce de 500 × 300 : √(500² + 300²) ≈ 583,10. Si sur le chantier tes deux diagonales mesurent la même chose, la pièce est d'équerre.", "ok"); }
    }

    /* ---------- Événements ---------- */
    racine.querySelector("#fsaisie").onsubmit = (ev) => { ev.preventDefault(); const v = cmd.value; cmd.value = ""; traiter(v); avancerGuide(v); };
    racine.querySelectorAll(".ruban [data-cmd]").forEach((b) => {
      b.onclick = () => {
        const c = b.dataset.cmd;
        if (c === "ESC") { if (etape) { ecrire("*Annulé*", "err"); fin(); } cmd.focus(); return; }
        if (etape) { ecrire("*Annulé*", "err"); fin(); }
        traiter(c); avancerGuide(c); cmd.focus();
      };
    });
    racine.querySelectorAll(".ruban [data-zoom]").forEach((b) => {
      b.onclick = () => {
        const k = +b.dataset.zoom, cx = cv.width / 2, cy = cv.height / 2;
        const avant = versMonde(cx, cy); vue.s *= k; const apres = versMonde(cx, cy);
        vue.x += avant.x - apres.x; vue.y += avant.y - apres.y; dessiner();
      };
    });
    // Se déplacer dans le dessin : clic droit ou molette maintenus
    let glisse = null;
    cv.addEventListener("contextmenu", (ev) => ev.preventDefault());
    cv.addEventListener("mousedown", (ev) => { if (ev.button === 1 || ev.button === 2) { ev.preventDefault(); glisse = { x: ev.clientX, y: ev.clientY }; } });
    window.addEventListener("mouseup", () => { glisse = null; });
    window.addEventListener("mousemove", (ev) => {
      if (!glisse || !document.body.contains(cv)) return;
      const r = cv.getBoundingClientRect(), k = cv.width / r.width;
      vue.x -= (ev.clientX - glisse.x) * k / vue.s; vue.y += (ev.clientY - glisse.y) * k / vue.s;
      glisse = { x: ev.clientX, y: ev.clientY }; dessiner();
    });
    cmd.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") { if (etape) { ecrire("*Annulé*", "err"); fin(); } cmd.value = ""; }
    });
    function pointSouris(ev) {
      const r = cv.getBoundingClientRect();
      const k = cv.width / r.width;
      const px = (ev.clientX - r.left) * k, py = (ev.clientY - r.top) * k;
      let p = versMonde(px, py);
      // accrochage aux extrémités et centres proches (12 px)
      const cand = [];
      objets.forEach((o) => { if (o.type === "cercle") cand.push(o.c); else { cand.push(o.a, o.b); if (o.type === "rect") cand.push({ x: o.a.x, y: o.b.y }, { x: o.b.x, y: o.a.y }); } });
      let best = null, bd = 12 * k;
      cand.forEach((c) => { const e = versEcran(c), d = Math.hypot(e.x - px, e.y - py); if (d < bd) { bd = d; best = c; } });
      if (best) return { x: best.x, y: best.y, accroche: true };
      const g = vue.s >= 1 ? 1 : 10;   // arrondi au 1 ou au 10 selon le zoom
      return { x: Math.round(p.x / g) * g, y: Math.round(p.y / g) * g };
    }
    cv.addEventListener("mousemove", (ev) => { souris = pointSouris(ev); posEl.textContent = fp(souris); dessiner(); });
    cv.addEventListener("mouseleave", () => { souris = null; posEl.textContent = "—"; dessiner(); });
    cv.addEventListener("click", (ev) => {
      const p = pointSouris(ev);
      if (etape && etape.cmd !== "zoom") { traiter(fp(p)); if (guide && !guide.demo) outils.toast("Tu as cliqué un point : pour suivre le guide, tape plutôt les coordonnées demandées."); }
      else ecrire("Lance d'abord une commande (ex. LIGNE ou le bouton ╱ Ligne), puis clique pour donner des points.");
      cmd.focus();
    });
    cv.addEventListener("wheel", (ev) => {
      ev.preventDefault();
      const r = cv.getBoundingClientRect(), k = cv.width / r.width;
      const px = (ev.clientX - r.left) * k, py = (ev.clientY - r.top) * k;
      const avant = versMonde(px, py);
      vue.s *= ev.deltaY < 0 ? 1.2 : 1 / 1.2;
      const apres = versMonde(px, py);
      vue.x += avant.x - apres.x; vue.y += avant.y - apres.y;
      dessiner();
    }, { passive: false });
    window.addEventListener("resize", dessiner);

    ecrire("Bienvenue dans le simulateur ! Tape LIGNE puis Entrée pour commencer. Lis toujours ce qu'on te demande à gauche de la saisie.");
    taille(); zoomEtendu(); afficherMissions(); demander("Commande :"); dessiner();
    cmd.focus({ preventScroll: true });
  }

  window.Simulateur = { monter };
})();
