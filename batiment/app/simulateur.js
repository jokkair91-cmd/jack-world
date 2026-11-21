/* =========================================================
   Jack CAD — simulateur d'apprentissage façon AutoCAD
   Ruban, ligne de commande avec autocomplétion, saisie dynamique,
   barre d'état (GRILLE, ORTHO, ACCROBJ, DYN), accrochages aux objets,
   calques, sélection et poignées, annulation.
   Commandes : LIGNE, POLYLIGNE, CERCLE, RECTANG, DECALER, DEPLACER,
   COPIER, ROTATION, MIROIR, ECHELLE, EFFACER, COTLIN, TEXTE,
   DISTANCE, LISTE, CALQUE, ZOOM, U, NOUVEAU
   Coordonnées : x,y   @dx,dy   @distance<angle   ou une distance seule
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Outils de calcul ---------- */
  const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
  const proche = (a, b, t = 0.05) => Math.abs(a.x - b.x) < t && Math.abs(a.y - b.y) < t;
  const segEgal = (l, p, q) => (proche(l.a, p) && proche(l.b, q)) || (proche(l.a, q) && proche(l.b, p));
  const n2 = (v) => (Math.round(v * 100) / 100).toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`(.+?)`/g, "<code>$1</code>");
  const RAD = Math.PI / 180;
  function segDist(p, a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy;
    let t = l2 ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2 : 0; t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
  }
  function interSeg(a, b, c, d) {
    const r = { x: b.x - a.x, y: b.y - a.y }, s = { x: d.x - c.x, y: d.y - c.y };
    const den = r.x * s.y - r.y * s.x; if (Math.abs(den) < 1e-9) return null;
    const t = ((c.x - a.x) * s.y - (c.y - a.y) * s.x) / den, u = ((c.x - a.x) * r.y - (c.y - a.y) * r.x) / den;
    return t >= -1e-9 && t <= 1 + 1e-9 && u >= -1e-9 && u <= 1 + 1e-9 ? { x: a.x + t * r.x, y: a.y + t * r.y } : null;
  }
  function interDroites(a, b, c, d) {
    const r = { x: b.x - a.x, y: b.y - a.y }, s = { x: d.x - c.x, y: d.y - c.y };
    const den = r.x * s.y - r.y * s.x; if (Math.abs(den) < 1e-9) return null;
    const t = ((c.x - a.x) * s.y - (c.y - a.y) * s.x) / den;
    return { x: a.x + t * r.x, y: a.y + t * r.y };
  }
  const aireSignee = (pts) => pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p.x * q.y - q.x * p.y; }, 0) / 2;
  function dansPolygone(p, pts) {
    let dedans = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const a = pts[i], b = pts[j];
      if ((a.y > p.y) !== (b.y > p.y) && p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x) dedans = !dedans;
    }
    return dedans;
  }
  const segmentsDe = (o) => o.type === "ligne" ? [[o.a, o.b]] : o.type === "pline" ? o.pts.slice(0, o.ferme ? undefined : -1).map((p, i) => [p, o.pts[(i + 1) % o.pts.length]]) : [];

  /* ---------- Missions guidées ---------- */
  const salleBas = (o) => o.find((x) => x.type === "ligne" && segEgal(x, { x: 0, y: 0 }, { x: 500, y: 0 }));
  const poteau = (o) => o.find((x) => x.type === "cercle" && proche(x.c, { x: 250, y: 150 }) && Math.abs(x.r - 20) < 0.01);
  const M2 = [{ s: "LIGNE", e: "Commande Ligne." }, { s: "0,0", e: "On part de l'origine." }, { s: "@500,0", e: "Le @ veut dire « depuis le dernier point » : 500 vers la droite." }, { s: "@0,300", e: "300 vers le haut." }, { s: "@-500,0", e: "500 vers la gauche (le signe moins)." }, { s: "C", e: "C = Clore : AutoCAD revient tout seul au point de départ." }];
  const MISSIONS = [
    { id: "m1", titre: "Ta première ligne", consigne: "Dessine une ligne de **0,0** à **500,0** avec `LIGNE` (ou `L`), puis Entrée pour finir.",
      etapes: [{ s: "LIGNE", e: "On lance la commande Ligne (tu peux aussi taper juste L)." }, { s: "0,0", e: "Premier point : l'origine du dessin." }, { s: "500,0", e: "Point suivant : 500 unités vers la droite." }, { s: "", e: "Entrée (ou Espace) à vide : la commande se termine." }],
      test: (o) => o.some((x) => x.type === "ligne" && segEgal(x, { x: 0, y: 0 }, { x: 500, y: 0 })) },
    { id: "m2", titre: "Une pièce de 500 × 300 en relatif", consigne: "Avec `LIGNE` : `0,0`, puis `@500,0`, `@0,300`, `@-500,0`, et `C` pour clore.",
      etapes: M2,
      test: (o) => [[0, 0, 500, 0], [500, 0, 500, 300], [500, 300, 0, 300], [0, 300, 0, 0]].every(([a, b, c, d]) => o.some((x) => x.type === "ligne" && segEgal(x, { x: a, y: b }, { x: c, y: d }))) },
    { id: "m3", titre: "Un poteau rond", consigne: "Avec `CERCLE` (ou `C`) : centre `250,150`, rayon `20`.",
      etapes: [{ s: "CERCLE", e: "Commande Cercle." }, { s: "250,150", e: "Le centre du cercle, au milieu de la pièce." }, { s: "20", e: "Le rayon : 20 (donc un poteau de 40 de diamètre)." }],
      test: (o) => !!poteau(o) },
    { id: "m4", titre: "Une dalle avec RECTANG", consigne: "Avec `RECTANG` (ou `REC`) : premier coin `1000,0`, autre coin `@400,300`.",
      etapes: [{ s: "RECTANG", e: "Commande Rectangle (raccourci REC)." }, { s: "1000,0", e: "Premier coin de la dalle." }, { s: "@400,300", e: "L'autre coin : 400 de large et 300 de haut depuis le premier." }],
      test: (o) => o.some((x) => x.type === "pline" && x.rect && x.pts.some((p) => proche(p, { x: 1000, y: 0 })) && x.pts.some((p) => proche(p, { x: 1400, y: 300 }))) },
    { id: "m5", titre: "Une rampe en polaire", consigne: "Avec `LIGNE` : départ `1400,0`, puis `@600<5` (600 de long, incliné à 5°).",
      etapes: [{ s: "LIGNE", e: "Commande Ligne." }, { s: "1400,0", e: "Départ de la rampe." }, { s: "@600<5", e: "Polaire : 600 de long, dans la direction 5° (le signe < veut dire « angle »)." }, { s: "", e: "Entrée à vide pour finir." }],
      test: (o) => o.some((x) => x.type === "ligne" && segEgal(x, { x: 1400, y: 0 }, { x: 1400 + 600 * Math.cos(5 * RAD), y: 600 * Math.sin(5 * RAD) })) },
    { id: "m6", titre: "Mesurer la diagonale", consigne: "Avec `DISTANCE` (ou `DI`) : de `0,0` à `500,300`. C'est la diagonale pour contrôler l'équerrage.",
      etapes: [{ s: "DISTANCE", e: "Commande Distance (raccourci DI)." }, { s: "0,0", e: "Premier coin de la pièce." }, { s: "500,300", e: "Coin opposé : AutoCAD affiche la longueur de la diagonale." }],
      test: (o, s) => !!s.diagonale },
    { id: "m7", titre: "Doubler un mur avec DECALER", consigne: "`DECALER` (ou `O`), distance `20`, clique sur le côté bas de la pièce, puis clique en dessous : le mur a maintenant 20 d'épaisseur.",
      prerequis: { test: salleBas, etapes: M2 },
      etapes: [{ s: "DECALER", e: "Commande Décaler (raccourci O, comme Offset)." }, { s: "20", e: "La distance de décalage : l'épaisseur du mur, 20." }, { clic: "objet", trouver: salleBas, e: "Clique sur le côté du BAS de la pièce pour le sélectionner." }, { clic: "point", p: { x: 250, y: -80 }, e: "Clique EN DESSOUS de cette ligne : c'est le côté où le mur se double." }, { s: "", e: "Entrée pour terminer la commande." }],
      test: (o) => o.some((x) => x.type === "ligne" && (segEgal(x, { x: 0, y: -20 }, { x: 500, y: -20 }) || segEgal(x, { x: 0, y: 20 }, { x: 500, y: 20 }))) },
    { id: "m8", titre: "Coter la pièce", consigne: "`COTLIN` (ou `DLI`) : `0,0`, `500,0`, puis la position de la cote `250,-80`.",
      prerequis: { test: salleBas, etapes: M2 },
      etapes: [{ s: "COTLIN", e: "Commande Cotation linéaire (raccourci DLI)." }, { s: "0,0", e: "Origine de la première ligne d'attache : un bout du mur." }, { s: "500,0", e: "Origine de la deuxième ligne d'attache : l'autre bout." }, { s: "250,-80", e: "Où poser la ligne de cote : 80 en dessous du mur. La cote se met sur le calque COTES." }],
      test: (o) => o.some((x) => x.type === "cote" && Math.abs(dist(x.a, x.b) - 500) < 0.01) },
    { id: "m9", titre: "Écrire le nom de la pièce", consigne: "`TEXTE` : point `180,230`, hauteur `25`, puis tape `SEJOUR` et Entrée.",
      etapes: [{ s: "TEXTE", e: "Commande Texte." }, { s: "180,230", e: "Point de départ du texte, dans la pièce." }, { s: "25", e: "Hauteur des lettres : 25 unités." }, { s: "SEJOUR", e: "Le texte lui-même, puis Entrée." }],
      test: (o) => o.some((x) => x.type === "texte" && x.t.trim()) },
    { id: "m10", titre: "Copier le poteau", consigne: "`COPIER` (ou `CO`) : clique le poteau, Entrée, point de base `250,150`, puis `@200,0`, et Entrée.",
      prerequis: { test: poteau, etapes: [{ s: "CERCLE", e: "On dessine d'abord le poteau." }, { s: "250,150", e: "Centre." }, { s: "20", e: "Rayon." }] },
      etapes: [{ s: "COPIER", e: "Commande Copier." }, { clic: "objet", trouver: poteau, e: "Clique sur le poteau rond pour le sélectionner." }, { s: "", e: "Entrée : la sélection est finie." }, { s: "250,150", e: "Point de base : le centre du poteau." }, { s: "@200,0", e: "Deuxième point : 200 plus loin à droite. La copie apparaît." }, { s: "", e: "Entrée pour arrêter de copier." }],
      test: (o) => o.filter((x) => x.type === "cercle" && Math.abs(x.r - 20) < 0.01 && Math.abs(x.c.y - 150) < 0.01).length >= 2 }
  ];

  /* ---------- Les commandes : noms, raccourcis, aide ---------- */
  const COMMANDES = [
    ["LIGNE", "ligne", ["L", "_LINE", "LINE"], "Dessine des segments"],
    ["POLYLIGNE", "pline", ["PL", "_PLINE", "PLINE"], "Dessine une polyligne (un seul objet)"],
    ["CERCLE", "cercle", ["C", "_CIRCLE", "CIRCLE"], "Dessine un cercle"],
    ["RECTANG", "rect", ["REC", "_RECTANG", "RECTANGLE"], "Dessine un rectangle"],
    ["DECALER", "decaler", ["O", "DC", "_OFFSET", "OFFSET"], "Copie parallèle à une distance"],
    ["DEPLACER", "deplacer", ["M", "DE", "_MOVE", "MOVE"], "Déplace des objets"],
    ["COPIER", "copier", ["CO", "CP", "_COPY", "COPY"], "Copie des objets"],
    ["ROTATION", "rotation", ["RO", "_ROTATE", "ROTATE"], "Fait tourner des objets"],
    ["MIROIR", "miroir", ["MI", "_MIRROR", "MIRROR"], "Symétrie par rapport à un axe"],
    ["ECHELLE", "echelle", ["SC", "EC", "_SCALE", "SCALE"], "Agrandit ou réduit"],
    ["EFFACER", "effacer", ["E", "_ERASE", "ERASE"], "Supprime des objets"],
    ["COTLIN", "cote", ["DLI", "COTALIGNEE", "DAL", "_DIMALIGNED", "_DIMLINEAR", "DIMLINEAR"], "Cotation (mesure affichée)"],
    ["TEXTE", "texte", ["TX", "T", "_TEXT", "TEXT", "_DTEXT"], "Écrit un texte"],
    ["DISTANCE", "distance", ["DI", "_DIST", "DIST"], "Mesure entre deux points"],
    ["LISTE", "liste", ["LI", "_LIST", "LIST"], "Infos sur les objets"],
    ["CALQUE", "calque", ["LA", "_LAYER", "LAYER"], "Change le calque courant"],
    ["ZOOM", "zoom", ["Z", "_ZOOM"], "Zoom (E = étendu)"],
    ["ANNULER", "annuler", ["U", "_U", "_UNDO", "UNDO"], "Annule la dernière action"],
    ["NOUVEAU", "nouveau", ["_NEW", "NEW"], "Efface tout le dessin"]
  ];
  const ALIAS = {};
  COMMANDES.forEach(([nom, id, al]) => { ALIAS[nom] = id; al.forEach((a) => { ALIAS[a] = id; }); });
  const AIDES = [
    [/^Commande/, "AutoCAD attend une <b>commande</b> : tape son nom ou son raccourci (ex. <code>L</code>) puis <kbd>Entrée</kbd> ou <kbd>Espace</kbd>, ou clique un bouton du ruban. Clique un objet pour le sélectionner."],
    [/Sélectionnez les objets/, "<b>Clique sur les objets</b> un par un (ils passent en pointillé). Tape <code>TOUT</code> pour tout prendre. <kbd>Entrée</kbd> quand c'est fini."],
    [/Sélectionnez l'objet à décaler/, "<b>Clique sur l'objet</b> à doubler. <kbd>Entrée</kbd> pour quitter."],
    [/Côté à décaler/, "<b>Clique du côté</b> où doit apparaître la copie parallèle."],
    [/^Point suivant/, "<code>@500,0</code> = 500 plus loin en X · <code>@600&lt;30</code> = 600 à 30° · ou <b>une distance seule</b> (ex. <code>300</code>) dans la direction de la souris · <kbd>Entrée</kbd> = finir · <code>C</code> = fermer · <code>U</code> = défaire le dernier segment."],
    [/^Rayon/, "Tape le <b>rayon</b>, ou <code>D</code> pour donner le diamètre."],
    [/Distance de décalage/, "Tape la <b>distance</b> (ex. <code>20</code> pour l'épaisseur d'un mur). <kbd>Entrée</kbd> garde la valeur proposée."],
    [/Angle de rotation/, "Tape l'<b>angle</b> en degrés (positif = sens inverse des aiguilles d'une montre), ou clique un point."],
    [/Facteur d'échelle/, "Tape le <b>facteur</b> : <code>2</code> = deux fois plus grand, <code>0.5</code> = moitié."],
    [/Effacer les objets sources/, "<code>O</code> pour effacer l'original, <code>N</code> ou <kbd>Entrée</kbd> pour le garder."],
    [/Hauteur/, "Hauteur des lettres en unités du dessin. <kbd>Entrée</kbd> garde la valeur proposée."],
    [/Entrez le texte/, "Tape ton texte (les espaces sont permis ici), puis <kbd>Entrée</kbd>."],
    [/Position de la ligne de cote/, "Clique ou tape où poser la cote, à côté de l'objet mesuré."],
    [/Nom du calque/, "Tape le <b>nom</b> d'un calque existant pour le rendre courant (ou un nouveau nom pour le créer)."],
    [/Zoom/, "Tape <code>E</code> pour « Étendu » : tout le dessin tient dans l'écran."],
    [/point|Point|coin|Centre|Origine/, "Donne un <b>point</b> : tape des coordonnées (<code>0,0</code>, <code>@200,0</code>) ou <b>clique</b> dans le dessin. Le carré vert = accrochage à un point précis de l'objet."]
  ];
  const CALQUES_DEPART = [
    { nom: "0", coul: "#f3f1ea" }, { nom: "MURS", coul: "#ffc420" }, { nom: "COTES", coul: "#4fb3ff" },
    { nom: "TEXTES", coul: "#3cc47c" }, { nom: "AXES", coul: "#ff5d52", tirets: true }, { nom: "MOBILIER", coul: "#c792ea" }
  ];

  function monter(racine, outils) {
    const bouton = (cmd, icone, nom, titre) => `<button type="button" data-cmd="${cmd}" title="${titre || nom}"><i>${icone}</i><span>${nom}</span></button>`;
    racine.innerHTML = `
      <div class="pile">
        <div class="acad">
          <div class="acad-titre"><b>A</b> Jack CAD — Dessin1.dwg <span>simulateur d'apprentissage</span></div>
          <div class="acad-ruban" role="toolbar" aria-label="Ruban">
            <div class="acad-groupe"><div class="acad-btns">${bouton("LIGNE", "╱", "Ligne", "Ligne (L)")}${bouton("POLYLIGNE", "⌇", "Polyligne", "Polyligne (PL)")}${bouton("CERCLE", "◯", "Cercle", "Cercle (C)")}${bouton("RECTANG", "▭", "Rectangle", "Rectangle (REC)")}</div><div class="acad-nom">Dessiner</div></div>
            <div class="acad-groupe"><div class="acad-btns">${bouton("DEPLACER", "✥", "Déplacer", "Déplacer (M)")}${bouton("COPIER", "⧉", "Copier", "Copier (CO)")}${bouton("ROTATION", "↻", "Rotation", "Rotation (RO)")}${bouton("MIROIR", "⇋", "Miroir", "Miroir (MI)")}${bouton("ECHELLE", "⤡", "Échelle", "Échelle (SC)")}${bouton("DECALER", "⫽", "Décaler", "Décaler (O)")}${bouton("EFFACER", "⌫", "Effacer", "Effacer (E)")}</div><div class="acad-nom">Modifier</div></div>
            <div class="acad-groupe"><div class="acad-btns">${bouton("COTLIN", "↔", "Cotation", "Cotation (DLI)")}${bouton("TEXTE", "A", "Texte", "Texte (TX)")}</div><div class="acad-nom">Annotation</div></div>
            <div class="acad-groupe"><div class="acad-btns acad-calques"><select id="calque" aria-label="Calque courant"></select></div><div class="acad-nom">Calques</div></div>
            <div class="acad-groupe"><div class="acad-btns">${bouton("DISTANCE", "📏", "Mesurer", "Distance (DI)")}${bouton("LISTE", "ⓘ", "Liste", "Liste (LI)")}</div><div class="acad-nom">Utilitaires</div></div>
            <div class="acad-groupe"><div class="acad-btns">${bouton("Z E", "⤢", "Tout voir", "Zoom étendu")}<button type="button" data-zoom="1.25" title="Zoom avant"><i>＋</i><span>Zoom</span></button><button type="button" data-zoom="0.8" title="Zoom arrière"><i>－</i><span>Zoom</span></button>${bouton("U", "↶", "Annuler", "Annuler (U ou Ctrl+Z)")}${bouton("NOUVEAU", "🗋", "Nouveau", "Tout effacer")}</div><div class="acad-nom">Vue</div></div>
          </div>
          <div class="guide" id="guide" hidden></div>
          <div class="acad-zone"><canvas id="cv" width="1000" height="560" aria-label="Zone de dessin"></canvas><div class="acad-dyn" id="dyn" hidden></div></div>
          <div class="aide-invite" id="aide" aria-live="polite"></div>
          <div class="console">
            <div class="hist" id="hist" aria-live="polite"></div>
            <div class="acad-suggest" id="sugg" hidden></div>
            <form class="saisie" id="fsaisie" autocomplete="off"><span id="invite">Commande :</span><input id="cmd" aria-label="Ligne de commande" spellcheck="false" autocapitalize="off"></form>
          </div>
          <div class="acad-etat">
            <span id="pos">0, 0</span>
            <span class="acad-modes">
              <button type="button" data-mode="grille" title="Grille (F7)">GRILLE</button>
              <button type="button" data-mode="ortho" title="Mode orthogonal : traits horizontaux ou verticaux (F8)">ORTHO</button>
              <button type="button" data-mode="accrobj" title="Accrochage aux objets (F3)">ACCROBJ</button>
              <button type="button" data-mode="dyn" title="Saisie dynamique près du curseur">DYN</button>
            </span>
          </div>
          <div class="acad-props" id="props"></div>
        </div>
        <div class="grille large" id="missions"></div>
      </div>
      <div class="carte" style="margin-top:14px">
        <h3>⌨️ Commandes et raccourcis</h3>
        <div class="table-wrap"><table><thead><tr><th>Commande</th><th>Raccourci</th><th>Anglais</th><th>Rôle</th></tr></thead><tbody>
          ${COMMANDES.map(([nom, , al, d]) => `<tr><td><code>${nom}</code></td><td><kbd>${esc(al.find((a) => !a.startsWith("_")) || "—")}</kbd></td><td><code>${esc(al.find((a) => a.startsWith("_")) || "")}</code></td><td class="petit">${esc(d)}</td></tr>`).join("")}
        </tbody></table></div>
        <p class="petit" style="margin-top:8px"><kbd>Entrée</kbd> ou <kbd>Espace</kbd> = valider ou répéter la dernière commande · <kbd>Échap</kbd> = annuler · <kbd>Ctrl</kbd>+<kbd>Z</kbd> = annuler · <kbd>F3</kbd> accrochages · <kbd>F7</kbd> grille · <kbd>F8</kbd> ORTHO · Molette = zoom · Clic droit maintenu = se déplacer.</p>
        <p class="petit muted" style="margin:0">Simulateur d'apprentissage : il reprend la logique et les commandes d'AutoCAD, pas tous ses outils. Pour le vrai logiciel, l'éditeur propose des versions d'essai et des licences éducation.</p>
      </div>`;

    const $ = (s) => racine.querySelector(s);
    const cv = $("#cv"), ctx = cv.getContext("2d");
    const hist = $("#hist"), invite = $("#invite"), cmd = $("#cmd"), posEl = $("#pos"), zoneMissions = $("#missions");
    const aideEl = $("#aide"), guideEl = $("#guide"), dynEl = $("#dyn"), suggEl = $("#sugg"), propsEl = $("#props"), selCalque = $("#calque");
    const dpr = () => window.devicePixelRatio || 1;

    let objets = [], nextId = 1, histo = [];
    let calques = (outils.lire("calques") || CALQUES_DEPART).map((c) => Object.assign({}, c));
    let calqueCourant = "0";
    const modes = Object.assign({ grille: true, ortho: false, accrobj: true, dyn: true }, outils.lire("modes") || {});
    const selection = new Set();
    const suivi = { diagonale: false };
    let vue = { x: -100, y: -100, s: 0.5 };
    let souris = null, sourisEcran = null, accroche = null;
    let etape = null, derniere = "";
    let faites = outils.lire("missions") || [];
    let guide = null;

    /* ---------- Dessin ---------- */
    const coulCalque = (n) => (calques.find((c) => c.nom === n) || calques[0]).coul;
    function taille() {
      const r = cv.getBoundingClientRect();
      const w = Math.max(300, Math.round(r.width * dpr())), h = Math.round(w * 0.56);
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    }
    const versEcran = (p) => ({ x: (p.x - vue.x) * vue.s, y: cv.height - (p.y - vue.y) * vue.s });
    const versMonde = (px, py) => ({ x: px / vue.s + vue.x, y: (cv.height - py) / vue.s + vue.y });

    function tracerObjet(o, style) {
      const k = dpr();
      ctx.save();
      ctx.strokeStyle = ctx.fillStyle = style && style.coul ? style.coul : coulCalque(o.calque);
      ctx.lineWidth = (style && style.epais ? 2.5 : 1.6) * k;
      const cal = calques.find((c) => c.nom === o.calque);
      if (style && style.tirets) ctx.setLineDash([7 * k, 5 * k]); else if (cal && cal.tirets) ctx.setLineDash([14 * k, 4 * k, 3 * k, 4 * k]);
      ctx.beginPath();
      if (o.type === "ligne") { const p = versEcran(o.a), q = versEcran(o.b); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      else if (o.type === "cercle") { const c = versEcran(o.c); ctx.arc(c.x, c.y, Math.max(0.5, o.r * vue.s), 0, Math.PI * 2); ctx.stroke(); }
      else if (o.type === "pline") { o.pts.forEach((p, i) => { const e = versEcran(p); i ? ctx.lineTo(e.x, e.y) : ctx.moveTo(e.x, e.y); }); if (o.ferme) ctx.closePath(); ctx.stroke(); }
      else if (o.type === "cote") tracerCote(o);
      else if (o.type === "texte") {
        const e = versEcran(o.p), px = Math.max(1, o.h * vue.s);
        ctx.translate(e.x, e.y); ctx.rotate(-(o.ang || 0) * RAD);
        ctx.font = `${px}px "Arial Narrow", Arial, sans-serif`; ctx.textBaseline = "alphabetic"; ctx.fillText(o.t, 0, 0);
      }
      ctx.restore();
    }
    function geoCote(o) {
      const L = dist(o.a, o.b) || 1, u = { x: (o.b.x - o.a.x) / L, y: (o.b.y - o.a.y) / L }, n = { x: -u.y, y: u.x };
      const a2 = { x: o.a.x + n.x * o.d, y: o.a.y + n.y * o.d }, b2 = { x: o.b.x + n.x * o.d, y: o.b.y + n.y * o.d };
      return { L, u, n, a2, b2 };
    }
    function tracerCote(o) {
      const k = dpr(), g = geoCote(o), sgn = Math.sign(o.d) || 1, ext = 12 / vue.s;
      const seg = (p, q) => { const e = versEcran(p), f = versEcran(q); ctx.moveTo(e.x, e.y); ctx.lineTo(f.x, f.y); };
      const gap = 4 / vue.s;
      seg({ x: o.a.x + g.n.x * gap * sgn, y: o.a.y + g.n.y * gap * sgn }, { x: g.a2.x + g.n.x * ext * sgn, y: g.a2.y + g.n.y * ext * sgn });
      seg({ x: o.b.x + g.n.x * gap * sgn, y: o.b.y + g.n.y * gap * sgn }, { x: g.b2.x + g.n.x * ext * sgn, y: g.b2.y + g.n.y * ext * sgn });
      seg(g.a2, g.b2);
      const t = 6 / vue.s, diag = { x: (g.u.x + g.n.x) * t, y: (g.u.y + g.n.y) * t };
      [g.a2, g.b2].forEach((p) => seg({ x: p.x - diag.x, y: p.y - diag.y }, { x: p.x + diag.x, y: p.y + diag.y }));
      ctx.stroke();
      let ang = Math.atan2(g.u.y, g.u.x) / RAD; if (ang > 90.01 || ang < -89.99) ang += 180;
      const m = versEcran({ x: (g.a2.x + g.b2.x) / 2 + g.n.x * (5 / vue.s) * sgn, y: (g.a2.y + g.b2.y) / 2 + g.n.y * (5 / vue.s) * sgn });
      ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(-ang * RAD);
      ctx.font = `${Math.max(10 * k, Math.min(20 * k, 18 * vue.s))}px Arial, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = sgn > 0 ? "bottom" : "top";
      ctx.fillText(n2(g.L), 0, 0); ctx.restore();
    }
    function poignees(o) {
      const k = dpr(), pts = o.type === "ligne" ? [o.a, o.b, { x: (o.a.x + o.b.x) / 2, y: (o.a.y + o.b.y) / 2 }] : o.type === "cercle" ? [o.c, { x: o.c.x + o.r, y: o.c.y }, { x: o.c.x, y: o.c.y + o.r }, { x: o.c.x - o.r, y: o.c.y }, { x: o.c.x, y: o.c.y - o.r }] : o.type === "pline" ? o.pts : o.type === "texte" ? [o.p] : [o.a, o.b];
      ctx.fillStyle = "#3d7fff"; pts.forEach((p) => { const e = versEcran(p); ctx.fillRect(e.x - 4 * k, e.y - 4 * k, 8 * k, 8 * k); });
    }
    function dessiner() {
      taille();
      const k = dpr();
      ctx.fillStyle = "#212830"; ctx.fillRect(0, 0, cv.width, cv.height);
      if (modes.grille) {
        const pas = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000].find((p) => p * vue.s >= 14 * k) || 10000;
        const a = versMonde(0, cv.height), b = versMonde(cv.width, 0);
        ctx.lineWidth = 1;
        for (let x = Math.floor(a.x / pas) * pas; x <= b.x; x += pas) { const e = versEcran({ x, y: 0 }).x; ctx.strokeStyle = Math.round(x / pas) % 5 === 0 ? "rgba(255,255,255,.09)" : "rgba(255,255,255,.035)"; ctx.beginPath(); ctx.moveTo(e, 0); ctx.lineTo(e, cv.height); ctx.stroke(); }
        for (let y = Math.floor(a.y / pas) * pas; y <= b.y; y += pas) { const e = versEcran({ x: 0, y }).y; ctx.strokeStyle = Math.round(y / pas) % 5 === 0 ? "rgba(255,255,255,.09)" : "rgba(255,255,255,.035)"; ctx.beginPath(); ctx.moveTo(0, e); ctx.lineTo(cv.width, e); ctx.stroke(); }
      }
      // axes de l'origine
      const o0 = versEcran({ x: 0, y: 0 });
      ctx.strokeStyle = "rgba(255,93,82,.35)"; ctx.beginPath(); ctx.moveTo(0, o0.y); ctx.lineTo(cv.width, o0.y); ctx.stroke();
      ctx.strokeStyle = "rgba(60,196,124,.35)"; ctx.beginPath(); ctx.moveTo(o0.x, 0); ctx.lineTo(o0.x, cv.height); ctx.stroke();
      objets.forEach((o) => tracerObjet(o, selection.has(o.id) ? { tirets: true, coul: "#9fc3ff" } : null));
      selection.forEach((id) => { const o = objets.find((x) => x.id === id); if (o) poignees(o); });
      apercu();
      // icône SCU (repère) en bas à gauche
      ctx.save(); ctx.translate(26 * k, cv.height - 26 * k); ctx.lineWidth = 2 * k;
      ctx.strokeStyle = "#ff5d52"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(40 * k, 0); ctx.stroke();
      ctx.strokeStyle = "#3cc47c"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -40 * k); ctx.stroke();
      ctx.fillStyle = "#cfd3d8"; ctx.font = `${11 * k}px Arial`; ctx.fillText("X", 44 * k, 4 * k); ctx.fillText("Y", -4 * k, -46 * k); ctx.restore();
      // curseur en croix + carré de sélection
      if (sourisEcran) {
        const p = sourisEcran, t = (etape && /selection|objet/.test(etape.attend)) ? 0 : Math.max(18 * k, cv.width * 0.04), c = 5 * k;
        ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1 * k; ctx.beginPath();
        if (t) { ctx.moveTo(p.x - t, p.y); ctx.lineTo(p.x - c, p.y); ctx.moveTo(p.x + c, p.y); ctx.lineTo(p.x + t, p.y); ctx.moveTo(p.x, p.y - t); ctx.lineTo(p.x, p.y - c); ctx.moveTo(p.x, p.y + c); ctx.lineTo(p.x, p.y + t); }
        ctx.rect(p.x - c, p.y - c, 2 * c, 2 * c); ctx.stroke();
        if (accroche) marqueur(accroche);
      }
    }
    function marqueur(a) {
      const k = dpr(), e = versEcran(a.p), r = 7 * k;
      ctx.save(); ctx.strokeStyle = "#7CFC00"; ctx.lineWidth = 2 * k; ctx.beginPath();
      if (a.type === "Extrémité") ctx.rect(e.x - r, e.y - r, 2 * r, 2 * r);
      else if (a.type === "Milieu") { ctx.moveTo(e.x, e.y - r); ctx.lineTo(e.x + r, e.y + r); ctx.lineTo(e.x - r, e.y + r); ctx.closePath(); }
      else if (a.type === "Centre") ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
      else if (a.type === "Intersection") { ctx.moveTo(e.x - r, e.y - r); ctx.lineTo(e.x + r, e.y + r); ctx.moveTo(e.x + r, e.y - r); ctx.lineTo(e.x - r, e.y + r); }
      else { ctx.moveTo(e.x, e.y - r); ctx.lineTo(e.x + r, e.y); ctx.lineTo(e.x, e.y + r); ctx.lineTo(e.x - r, e.y); ctx.closePath(); }
      ctx.stroke();
      ctx.font = `${12 * k}px Arial`; const w = ctx.measureText(a.type).width;
      ctx.fillStyle = "rgba(255,255,220,.95)"; ctx.fillRect(e.x + 12 * k, e.y + 10 * k, w + 10 * k, 18 * k);
      ctx.fillStyle = "#1b1b1b"; ctx.fillText(a.type, e.x + 17 * k, e.y + 23 * k);
      ctx.restore();
    }

    /* ---------- Aperçu « élastique » pendant une commande ---------- */
    function fantomes() {
      if (!etape || !souris) return [];
      const e = etape, sel = objets.filter((o) => e.sel && e.sel.includes(o.id));
      if ((e.cmd === "deplacer" || e.cmd === "copier") && e.base) { const d = { x: souris.x - e.base.x, y: souris.y - e.base.y }; return sel.map((o) => transformer(o, (p) => ({ x: p.x + d.x, y: p.y + d.y }))); }
      if (e.cmd === "rotation" && e.base) { const a = Math.atan2(souris.y - e.base.y, souris.x - e.base.x); return sel.map((o) => transformer(o, tourner(e.base, a), { dAng: a / RAD })); }
      if (e.cmd === "miroir" && e.p1 && !e.p2) return sel.map((o) => transformer(o, symetrie(e.p1, souris), { flip: true }));
      if (e.cmd === "echelle" && e.base) { const k = Math.max(0.01, dist(e.base, souris) / 100); return sel.map((o) => transformer(o, agrandir(e.base, k), { k })); }
      return [];
    }
    function apercu() {
      if (!etape || !souris) return;
      const e = etape, st = { tirets: true, coul: "rgba(79,179,255,.95)" };
      if (e.ref && (e.cmd === "ligne" || e.cmd === "pline" || e.cmd === "distance" || /deplacer|copier|rotation|echelle/.test(e.cmd) || (e.cmd === "miroir" && e.p1))) tracerObjet({ type: "ligne", a: e.ref, b: souris }, st);
      if (e.cmd === "pline" && e.pts.length > 1) tracerObjet({ type: "pline", pts: e.pts, ferme: false }, { coul: coulCalque(calqueCourant) });
      if (e.cmd === "rect" && e.ref) tracerObjet({ type: "pline", pts: coinsRect(e.ref, souris), ferme: true }, st);
      if (e.cmd === "cercle" && e.c) tracerObjet({ type: "cercle", c: e.c, r: dist(e.c, souris) }, st);
      if (e.cmd === "cote" && e.a && e.b) tracerObjet({ type: "cote", a: e.a, b: e.b, d: decalCote(e.a, e.b, souris), calque: "COTES" }, st);
      else if (e.cmd === "cote" && e.a) tracerObjet({ type: "ligne", a: e.a, b: souris }, st);
      fantomes().forEach((o) => tracerObjet(o, st));
    }

    /* ---------- Transformations ---------- */
    const tourner = (c, a) => (p) => ({ x: c.x + (p.x - c.x) * Math.cos(a) - (p.y - c.y) * Math.sin(a), y: c.y + (p.x - c.x) * Math.sin(a) + (p.y - c.y) * Math.cos(a) });
    const agrandir = (c, k) => (p) => ({ x: c.x + (p.x - c.x) * k, y: c.y + (p.y - c.y) * k });
    function symetrie(a, b) {
      const dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy || 1;
      return (p) => { const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2, h = { x: a.x + t * dx, y: a.y + t * dy }; return { x: 2 * h.x - p.x, y: 2 * h.y - p.y }; };
    }
    function transformer(o, f, opt = {}) {
      const c = JSON.parse(JSON.stringify(o)), k = opt.k || 1;
      if (o.type === "ligne" || o.type === "cote") { c.a = f(o.a); c.b = f(o.b); if (o.type === "cote") c.d = o.d * k * (opt.flip ? -1 : 1); }
      else if (o.type === "cercle") { c.c = f(o.c); c.r = o.r * k; }
      else if (o.type === "pline") c.pts = o.pts.map(f);
      else if (o.type === "texte") { c.p = f(o.p); c.h = o.h * k; c.ang = (o.ang || 0) + (opt.dAng || 0); }
      return c;
    }
    const coinsRect = (a, b) => [a, { x: b.x, y: a.y }, b, { x: a.x, y: b.y }];
    function decalCote(a, b, p) { const L = dist(a, b) || 1; return ((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x)) / L; }
    function decaler(o, d, cote) {
      if (o.type === "ligne") {
        const L = dist(o.a, o.b) || 1, n = { x: -(o.b.y - o.a.y) / L, y: (o.b.x - o.a.x) / L };
        const s = Math.sign((o.b.x - o.a.x) * (cote.y - o.a.y) - (o.b.y - o.a.y) * (cote.x - o.a.x)) || 1;
        return { type: "ligne", a: { x: o.a.x + n.x * d * s, y: o.a.y + n.y * d * s }, b: { x: o.b.x + n.x * d * s, y: o.b.y + n.y * d * s }, calque: o.calque };
      }
      if (o.type === "cercle") { const r = dist(cote, o.c) > o.r ? o.r + d : o.r - d; return r > 0 ? { type: "cercle", c: o.c, r, calque: o.calque } : null; }
      if (o.type === "pline") {
        let s;
        if (o.ferme) { const dedans = dansPolygone(cote, o.pts), ccw = aireSignee(o.pts) > 0; s = dedans === ccw ? 1 : -1; }
        else {
          let best = Infinity, iBest = 0;
          segmentsDe(o).forEach(([a, b], i) => { const dd = segDist(cote, a, b); if (dd < best) { best = dd; iBest = i; } });
          const [a, b] = segmentsDe(o)[iBest]; s = Math.sign((b.x - a.x) * (cote.y - a.y) - (b.y - a.y) * (cote.x - a.x)) || 1;
        }
        const segs = segmentsDe(o).map(([a, b]) => { const L = dist(a, b) || 1, n = { x: -(b.y - a.y) / L * d * s, y: (b.x - a.x) / L * d * s }; return [{ x: a.x + n.x, y: a.y + n.y }, { x: b.x + n.x, y: b.y + n.y }]; });
        const N = segs.length, pts = [];
        for (let i = 0; i < o.pts.length; i++) {
          const avant = o.ferme ? segs[(i - 1 + N) % N] : segs[i - 1], apres = o.ferme ? segs[i % N] : segs[i];
          if (avant && apres) pts.push(interDroites(avant[0], avant[1], apres[0], apres[1]) || apres[0]);
          else pts.push(avant ? avant[1] : apres[0]);
        }
        return { type: "pline", pts, ferme: o.ferme, calque: o.calque };
      }
      return null;
    }

    /* ---------- Sélection et accrochages ---------- */
    function distObjet(o, p) {
      if (o.type === "ligne") return segDist(p, o.a, o.b);
      if (o.type === "cercle") return Math.abs(dist(p, o.c) - o.r);
      if (o.type === "pline") return Math.min(...segmentsDe(o).map(([a, b]) => segDist(p, a, b)));
      if (o.type === "cote") { const g = geoCote(o); return Math.min(segDist(p, g.a2, g.b2), segDist(p, o.a, g.a2), segDist(p, o.b, g.b2)); }
      if (o.type === "texte") { const w = o.t.length * o.h * 0.55, a = (o.ang || 0) * RAD, l = { x: (p.x - o.p.x) * Math.cos(-a) - (p.y - o.p.y) * Math.sin(-a), y: (p.x - o.p.x) * Math.sin(-a) + (p.y - o.p.y) * Math.cos(-a) }; return l.x >= 0 && l.x <= w && l.y >= -o.h * 0.2 && l.y <= o.h ? 0 : Infinity; }
      return Infinity;
    }
    function objetSous(p) {
      const tol = 7 * dpr() / vue.s;
      let best = null, bd = tol;
      objets.forEach((o) => { const d = distObjet(o, p); if (d <= bd) { bd = d; best = o; } });
      return best;
    }
    function pointsAccroche() {
      const r = [], segs = [];
      objets.forEach((o) => {
        if (o.type === "cercle") { r.push({ p: o.c, type: "Centre" }); [0, 90, 180, 270].forEach((a) => r.push({ p: { x: o.c.x + o.r * Math.cos(a * RAD), y: o.c.y + o.r * Math.sin(a * RAD) }, type: "Quadrant" })); }
        else if (o.type === "texte") r.push({ p: o.p, type: "Insertion" });
        else if (o.type === "cote") { r.push({ p: o.a, type: "Extrémité" }, { p: o.b, type: "Extrémité" }); }
        else segmentsDe(o).forEach(([a, b]) => { r.push({ p: a, type: "Extrémité" }, { p: b, type: "Extrémité" }, { p: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, type: "Milieu" }); segs.push([a, b]); });
      });
      if (segs.length < 150) for (let i = 0; i < segs.length; i++) for (let j = i + 1; j < segs.length; j++) { const x = interSeg(segs[i][0], segs[i][1], segs[j][0], segs[j][1]); if (x) r.push({ p: x, type: "Intersection" }); }
      return r;
    }
    function pointSouris(ev) {
      const rr = cv.getBoundingClientRect(), k = cv.width / rr.width;
      const px = (ev.clientX - rr.left) * k, py = (ev.clientY - rr.top) * k;
      sourisEcran = { x: px, y: py };
      let p = versMonde(px, py);
      accroche = null;
      if (modes.accrobj && !(etape && /selection|objet/.test(etape.attend))) {
        let bd = 12 * dpr();
        const prio = { "Extrémité": 0, "Intersection": 0, "Centre": 0, "Milieu": 1, "Quadrant": 2, "Insertion": 1 };
        pointsAccroche().forEach((a) => { const e = versEcran(a.p), d = Math.hypot(e.x - px, e.y - py) + prio[a.type]; if (d < bd) { bd = d; accroche = a; } });
      }
      if (accroche) return { x: accroche.p.x, y: accroche.p.y };
      const g = vue.s >= 1 ? 1 : vue.s >= 0.2 ? 5 : 10;
      p = { x: Math.round(p.x / g) * g, y: Math.round(p.y / g) * g };
      if (modes.ortho && etape && etape.ref && etape.attend === "point") { if (Math.abs(p.x - etape.ref.x) >= Math.abs(p.y - etape.ref.y)) p.y = etape.ref.y; else p.x = etape.ref.x; }
      return p;
    }

    /* ---------- Historique ---------- */
    function memoriser() { histo.push(JSON.stringify({ objets, nextId })); if (histo.length > 60) histo.shift(); }
    function modif() { if (etape) { if (!etape.memo) { memoriser(); etape.memo = true; } } else memoriser(); }
    function ajouter(o) { o.id = nextId++; o.calque = o.calque || calqueCourant; objets.push(o); return o; }

    /* ---------- Console ---------- */
    function ecrire(t, cls) { const d = document.createElement("div"); if (cls) d.className = cls; d.textContent = t; hist.appendChild(d); hist.scrollTop = hist.scrollHeight; }
    function demander(t, attend, ref) {
      etape.invite = t; etape.attend = attend; if (ref !== undefined) etape.ref = ref;
      invite.textContent = t;
      const a = AIDES.find(([re]) => re.test(t));
      aideEl.innerHTML = `<b>AutoCAD te demande : « ${esc(t.replace(/\s*:$/, ""))} »</b><br>${a ? a[1] : ""}`;
      dessiner();
    }
    function attente() {
      invite.textContent = "Commande :";
      aideEl.innerHTML = `<b>AutoCAD te demande : « Commande »</b><br>${AIDES[0][1]}`;
    }
    function fin(msg) { if (msg) ecrire(msg, "ok"); etape = null; attente(); majProps(); dessiner(); verifier(); }
    function annulerCommande() { if (etape) { ecrire("*Annuler*", "err"); etape = null; attente(); dessiner(); } }

    /* ---------- Les commandes ---------- */
    const avecSelection = (e, suite) => {
      e.suite = suite;
      if (selection.size) { e.sel = [...selection]; ecrire(`${e.sel.length} objet(s) déjà sélectionné(s).`); suite(); }
      else { e.sel = []; demander("Sélectionnez les objets :", "selection", null); }
    };
    const C = {
      ligne: {
        debut: (e) => { e.pts = []; demander("Spécifiez le premier point :", "point", null); },
        recevoir(e, v) {
          if (v.type === "vide") return fin(e.pts.length > 1 ? `${e.pts.length - 1} segment(s).` : "");
          if (v.type === "option" && v.t === "C" && e.pts.length >= 3) { modif(); ajouter({ type: "ligne", a: e.pts[e.pts.length - 1], b: e.pts[0] }); return fin("Contour fermé."); }
          if (v.type === "option" && v.t === "U" && e.pts.length > 1) { objets.pop(); e.pts.pop(); return demander("Spécifiez le point suivant ou [annUler] :", "point", e.pts[e.pts.length - 1]); }
          if (v.type !== "point") return ecrire("Point non valide.", "err");
          if (e.pts.length) { modif(); ajouter({ type: "ligne", a: e.pts[e.pts.length - 1], b: v.p }); }
          e.pts.push(v.p);
          demander(e.pts.length >= 3 ? "Spécifiez le point suivant ou [Clore/annUler] :" : "Spécifiez le point suivant ou [annUler] :", "point", v.p);
          verifier();
        }
      },
      pline: {
        debut: (e) => { e.pts = []; demander("Spécifiez le point de départ :", "point", null); },
        recevoir(e, v) {
          const creer = (ferme) => { if (e.pts.length > 1) { modif(); ajouter({ type: "pline", pts: e.pts, ferme }); } fin(e.pts.length > 1 ? `Polyligne de ${e.pts.length} sommets${ferme ? ", fermée" : ""}.` : ""); };
          if (v.type === "vide") return creer(false);
          if (v.type === "option" && v.t === "C" && e.pts.length >= 3) return creer(true);
          if (v.type === "option" && v.t === "U" && e.pts.length > 1) { e.pts.pop(); return demander("Spécifiez le point suivant ou [Clore/annUler] :", "point", e.pts[e.pts.length - 1]); }
          if (v.type !== "point") return ecrire("Point non valide.", "err");
          e.pts.push(v.p);
          demander(e.pts.length >= 3 ? "Spécifiez le point suivant ou [Clore/annUler] :" : "Spécifiez le point suivant ou [annUler] :", "point", v.p);
        }
      },
      cercle: {
        debut: (e) => demander("Spécifiez le centre du cercle :", "point", null),
        recevoir(e, v) {
          if (!e.c) { if (v.type !== "point") return ecrire("Donne le centre (un point).", "err"); e.c = v.p; return demander("Spécifiez le rayon du cercle ou [Diamètre] :", "nombre", v.p); }
          if (v.type === "option" && v.t === "D") { e.diam = true; return demander("Spécifiez le diamètre du cercle :", "nombre", e.c); }
          let r = v.type === "nombre" ? v.n : v.type === "point" ? dist(e.c, v.p) : NaN;
          if (e.diam) r /= 2;
          if (!(r > 0)) return ecrire("Le rayon doit être un nombre positif.", "err");
          modif(); ajouter({ type: "cercle", c: e.c, r }); fin(`Cercle de rayon ${n2(r)}.`);
        }
      },
      rect: {
        debut: (e) => demander("Spécifiez le premier coin :", "point", null),
        recevoir(e, v) {
          if (v.type !== "point") return ecrire("Donne un point.", "err");
          if (!e.a) { e.a = v.p; return demander("Spécifiez l'autre coin (ex. @400,300) :", "point", v.p); }
          if (v.p.x === e.a.x || v.p.y === e.a.y) return ecrire("Le rectangle serait plat : donne un autre coin.", "err");
          modif(); ajouter({ type: "pline", pts: coinsRect(e.a, v.p), ferme: true, rect: true });
          fin(`Rectangle ${n2(Math.abs(v.p.x - e.a.x))} × ${n2(Math.abs(v.p.y - e.a.y))}.`);
        }
      },
      distance: {
        debut: (e) => demander("Spécifiez le premier point :", "point", null),
        recevoir(e, v) {
          if (v.type !== "point") return ecrire("Donne un point.", "err");
          if (!e.a) { e.a = v.p; return demander("Spécifiez le deuxième point :", "point", v.p); }
          const a = e.a, p = v.p, an = (Math.atan2(p.y - a.y, p.x - a.x) / RAD + 360) % 360;
          ecrire(`Distance = ${n2(dist(a, p))}, Angle = ${n2(an)}°, Delta X = ${n2(p.x - a.x)}, Delta Y = ${n2(p.y - a.y)}`, "ok");
          if ((proche(a, { x: 0, y: 0 }) && proche(p, { x: 500, y: 300 })) || (proche(p, { x: 0, y: 0 }) && proche(a, { x: 500, y: 300 }))) suivi.diagonale = true;
          fin();
        }
      },
      effacer: {
        debut: (e) => avecSelection(e, () => { modif(); objets = objets.filter((o) => !e.sel.includes(o.id)); selection.clear(); fin(`${e.sel.length} objet(s) effacé(s).`); }),
        recevoir: selectionner
      },
      deplacer: {
        debut: (e) => avecSelection(e, () => demander("Spécifiez le point de base :", "point", null)),
        recevoir(e, v) {
          if (e.attend === "selection") return selectionner(e, v);
          if (v.type !== "point") return ecrire("Donne un point.", "err");
          if (!e.base) { e.base = v.p; return demander("Spécifiez le deuxième point :", "point", v.p); }
          const d = { x: v.p.x - e.base.x, y: v.p.y - e.base.y };
          modif(); objets = objets.map((o) => e.sel.includes(o.id) ? Object.assign(transformer(o, (p) => ({ x: p.x + d.x, y: p.y + d.y })), { id: o.id }) : o);
          selection.clear(); fin(`${e.sel.length} objet(s) déplacé(s).`);
        }
      },
      copier: {
        debut: (e) => avecSelection(e, () => demander("Spécifiez le point de base :", "point", null)),
        recevoir(e, v) {
          if (e.attend === "selection") return selectionner(e, v);
          if (v.type === "vide" && e.base) { selection.clear(); return fin(`${e.n || 0} copie(s).`); }
          if (v.type !== "point") return ecrire("Donne un point.", "err");
          if (!e.base) { e.base = v.p; return demander("Spécifiez le deuxième point ou <Entrée pour finir> :", "point", v.p); }
          const d = { x: v.p.x - e.base.x, y: v.p.y - e.base.y };
          modif(); objets.filter((o) => e.sel.includes(o.id)).forEach((o) => ajouter(Object.assign(transformer(o, (p) => ({ x: p.x + d.x, y: p.y + d.y })), { calque: o.calque })));
          e.n = (e.n || 0) + 1; verifier(); dessiner();
        }
      },
      rotation: {
        debut: (e) => avecSelection(e, () => demander("Spécifiez le point de base :", "point", null)),
        recevoir(e, v) {
          if (e.attend === "selection") return selectionner(e, v);
          if (!e.base) { if (v.type !== "point") return ecrire("Donne un point.", "err"); e.base = v.p; return demander("Spécifiez l'angle de rotation :", "nombre", v.p); }
          const a = v.type === "nombre" ? v.n * RAD : v.type === "point" ? Math.atan2(v.p.y - e.base.y, v.p.x - e.base.x) : NaN;
          if (!isFinite(a)) return ecrire("Tape un angle en degrés.", "err");
          modif(); objets = objets.map((o) => e.sel.includes(o.id) ? Object.assign(transformer(o, tourner(e.base, a), { dAng: a / RAD }), { id: o.id }) : o);
          selection.clear(); fin(`Rotation de ${n2(a / RAD)}°.`);
        }
      },
      miroir: {
        debut: (e) => avecSelection(e, () => demander("Spécifiez le premier point de l'axe de symétrie :", "point", null)),
        recevoir(e, v) {
          if (e.attend === "selection") return selectionner(e, v);
          if (!e.p1) { if (v.type !== "point") return ecrire("Donne un point.", "err"); e.p1 = v.p; return demander("Spécifiez le second point de l'axe de symétrie :", "point", v.p); }
          if (!e.p2) { if (v.type !== "point") return ecrire("Donne un point.", "err"); e.p2 = v.p; return demander("Effacer les objets sources ? [Oui/Non] <Non> :", "option", null); }
          const effacer = v.type === "option" && /^O/.test(v.t);
          modif();
          const f = symetrie(e.p1, e.p2);
          objets.filter((o) => e.sel.includes(o.id)).forEach((o) => ajouter(Object.assign(transformer(o, f, { flip: true }), { calque: o.calque })));
          if (effacer) objets = objets.filter((o) => !e.sel.includes(o.id));
          selection.clear(); fin("Symétrie faite.");
        }
      },
      echelle: {
        debut: (e) => avecSelection(e, () => demander("Spécifiez le point de base :", "point", null)),
        recevoir(e, v) {
          if (e.attend === "selection") return selectionner(e, v);
          if (!e.base) { if (v.type !== "point") return ecrire("Donne un point.", "err"); e.base = v.p; return demander("Spécifiez le facteur d'échelle :", "nombre", null); }
          if (v.type !== "nombre" || !(v.n > 0)) return ecrire("Tape un facteur positif (ex. 2 ou 0.5).", "err");
          modif(); objets = objets.map((o) => e.sel.includes(o.id) ? Object.assign(transformer(o, agrandir(e.base, v.n), { k: v.n }), { id: o.id }) : o);
          selection.clear(); fin(`Échelle × ${n2(v.n)}.`);
        }
      },
      decaler: {
        debut: (e) => { e.d = outils.lire("decalage") || 20; demander(`Spécifiez la distance de décalage <${n2(e.d)}> :`, "nombre", null); },
        recevoir(e, v) {
          if (e.attend === "nombre") {
            if (v.type === "nombre" && v.n > 0) { e.d = v.n; outils.sauver("decalage", v.n); }
            else if (v.type !== "vide") return ecrire("Tape une distance positive.", "err");
            return demander("Sélectionnez l'objet à décaler ou <quitter> :", "objet", null);
          }
          if (e.attend === "objet") {
            if (v.type === "vide") return fin();
            if (v.type !== "objet") return ecrire("Clique sur un objet du dessin.", "err");
            if (!/ligne|cercle|pline/.test(v.o.type)) return ecrire("On ne peut décaler que des lignes, cercles et polylignes.", "err");
            e.o = v.o; selection.clear(); selection.add(v.o.id);
            return demander("Spécifiez un point sur le côté à décaler :", "point", null);
          }
          if (v.type !== "point") return ecrire("Clique du côté voulu.", "err");
          const n = decaler(e.o, e.d, v.p);
          if (n) { modif(); ajouter(n); } else ecrire("Impossible de décaler de ce côté.", "err");
          selection.clear(); verifier();
          demander("Sélectionnez l'objet à décaler ou <quitter> :", "objet", null);
        }
      },
      cote: {
        debut: (e) => demander("Spécifiez l'origine de la première ligne d'attache :", "point", null),
        recevoir(e, v) {
          if (v.type !== "point") return ecrire("Donne un point.", "err");
          if (!e.a) { e.a = v.p; return demander("Spécifiez l'origine de la deuxième ligne d'attache :", "point", v.p); }
          if (!e.b) { if (proche(v.p, e.a)) return ecrire("Les deux points sont confondus.", "err"); e.b = v.p; return demander("Spécifiez la position de la ligne de cote :", "point", null); }
          if (!calques.some((c) => c.nom === "COTES")) calques.push({ nom: "COTES", coul: "#4fb3ff" });
          modif(); ajouter({ type: "cote", a: e.a, b: e.b, d: decalCote(e.a, e.b, v.p) || 40, calque: "COTES" });
          fin(`Cote = ${n2(dist(e.a, e.b))} (calque COTES).`);
        }
      },
      texte: {
        debut: (e) => { e.h = outils.lire("hauteurTexte") || 25; demander("Spécifiez le point de départ du texte :", "point", null); },
        recevoir(e, v) {
          if (!e.p) { if (v.type !== "point") return ecrire("Donne un point.", "err"); e.p = v.p; return demander(`Spécifiez la hauteur <${n2(e.h)}> :`, "nombre", null); }
          if (e.attend === "nombre") {
            if (v.type === "nombre" && v.n > 0) { e.h = v.n; outils.sauver("hauteurTexte", v.n); }
            else if (v.type !== "vide") return ecrire("Tape une hauteur positive.", "err");
            return demander("Entrez le texte :", "texte", null);
          }
          if (!v.t) return fin();
          modif(); ajouter({ type: "texte", p: e.p, h: e.h, t: v.t, ang: 0, calque: calques.some((c) => c.nom === "TEXTES") ? "TEXTES" : calqueCourant });
          fin(`Texte « ${v.t} » écrit.`);
        }
      },
      liste: {
        debut: (e) => avecSelection(e, () => {
          objets.filter((o) => e.sel.includes(o.id)).forEach((o) => ecrire(infos(o)));
          fin();
        }),
        recevoir: selectionner
      },
      calque: {
        debut: () => { ecrire("Calques : " + calques.map((c) => c.nom + (c.nom === calqueCourant ? " (courant)" : "")).join(", ")); demander(`Nom du calque à rendre courant <${calqueCourant}> :`, "texte", null); },
        recevoir(e, v) {
          const nom = (v.t || "").trim().toUpperCase();
          if (nom) {
            if (!calques.some((c) => c.nom === nom)) { const couls = ["#ff9f43", "#48dbfb", "#ff6b81", "#1dd1a1", "#feca57"]; calques.push({ nom, coul: couls[calques.length % couls.length] }); ecrire(`Calque ${nom} créé.`, "ok"); }
            calqueCourant = nom; majCalques();
          }
          fin(`Calque courant : ${calqueCourant}.`);
        }
      },
      zoom: {
        debut: () => demander("Zoom [Étendu (E)] :", "option", null),
        recevoir(e, v) { if (v.type === "option" && /^E/.test(v.t)) zoomEtendu(); fin(); }
      },
      annuler: { debut: () => { if (histo.length) { const s = JSON.parse(histo.pop()); objets = s.objets; nextId = s.nextId; selection.clear(); etape = null; fin("Annulé."); } else { etape = null; fin(); ecrire("Rien à annuler.", "err"); } } },
      nouveau: { debut: () => { if (objets.length) memoriser(); objets = []; selection.clear(); suivi.diagonale = false; etape = null; zoomEtendu(); fin("Nouveau dessin."); } }
    };
    function selectionner(e, v) {
      if (v.type === "objet") {
        if (e.sel.includes(v.o.id)) { e.sel = e.sel.filter((x) => x !== v.o.id); selection.delete(v.o.id); }
        else { e.sel.push(v.o.id); selection.add(v.o.id); }
        ecrire(`${e.sel.length} objet(s) sélectionné(s).`); dessiner(); return;
      }
      if (v.type === "option" && v.t === "TOUT") { e.sel = objets.map((o) => o.id); e.sel.forEach((id) => selection.add(id)); ecrire(`${e.sel.length} objet(s) sélectionné(s).`); dessiner(); return; }
      if (v.type === "vide") { if (!e.sel.length) { ecrire("Aucun objet sélectionné.", "err"); return fin(); } return e.suite(); }
      ecrire("Clique sur les objets dans le dessin, puis Entrée.", "err");
    }
    function infos(o) {
      const cal = ` · calque ${o.calque}`;
      if (o.type === "ligne") return `LIGNE : longueur ${n2(dist(o.a, o.b))}, angle ${n2((Math.atan2(o.b.y - o.a.y, o.b.x - o.a.x) / RAD + 360) % 360)}°${cal}`;
      if (o.type === "cercle") return `CERCLE : rayon ${n2(o.r)}, diamètre ${n2(2 * o.r)}, circonférence ${n2(2 * Math.PI * o.r)}, aire ${n2(Math.PI * o.r * o.r)}${cal}`;
      if (o.type === "pline") { const L = segmentsDe(o).reduce((s, [a, b]) => s + dist(a, b), 0); return `POLYLIGNE : ${o.pts.length} sommets, longueur ${n2(L)}${o.ferme ? `, aire ${n2(Math.abs(aireSignee(o.pts)))}` : ""}${cal}`; }
      if (o.type === "cote") return `COTE : ${n2(dist(o.a, o.b))}${cal}`;
      return `TEXTE : « ${o.t} », hauteur ${n2(o.h)}${cal}`;
    }

    /* ---------- Lecture de ce qu'on tape ---------- */
    function lirePoint(t, ref) {
      const s = t.replace(/\s+/g, "").replace(/;/g, ",");
      let m;
      if ((m = s.match(/^@(-?\d+(?:\.\d+)?)<(-?\d+(?:\.\d+)?)$/))) { if (!ref) return { err: "Pas de point précédent pour une coordonnée relative." }; return { x: ref.x + +m[1] * Math.cos(+m[2] * RAD), y: ref.y + +m[1] * Math.sin(+m[2] * RAD) }; }
      if ((m = s.match(/^@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/))) { if (!ref) return { err: "Pas de point précédent pour une coordonnée relative." }; return { x: ref.x + +m[1], y: ref.y + +m[2] }; }
      if ((m = s.match(/^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/))) return { x: +m[1], y: +m[2] };
      if ((m = s.match(/^(\d+(?:\.\d+)?)$/)) && ref && souris && !proche(souris, ref)) { const a = Math.atan2(souris.y - ref.y, souris.x - ref.x); return { x: ref.x + +m[1] * Math.cos(a), y: ref.y + +m[1] * Math.sin(a) }; }
      return { err: "Point non valide. Exemples : 100,50   @200,0   @300<90   ou une distance avec la souris dans la direction voulue." };
    }
    const fp = (p) => `${n2(p.x)},${n2(p.y)}`;
    function lancer(id, brut) {
      derniere = brut;
      ecrire("Commande : " + brut.toUpperCase());
      etape = { cmd: id };
      C[id].debut(etape);
      majSugg();
    }
    function saisie(brut) {
      const t = brut.trim(), T = t.toUpperCase();
      if (!etape) {
        if (!t) { if (derniere) { const id = ALIAS[derniere.toUpperCase()]; if (id) lancer(id, derniere); } return; }
        if (/^(Z|ZOOM|_ZOOM)\s+E$/.test(T)) { ecrire("Commande : " + T); zoomEtendu(); derniere = "Z"; ecrire("Zoom étendu.", "ok"); dessiner(); return; }
        const id = ALIAS[T];
        if (!id) { ecrire(`Commande inconnue « ${t} ». Tape les premières lettres : la liste te propose les commandes.`, "err"); return; }
        return lancer(id, t);
      }
      const e = etape;
      ecrire(e.invite + " " + t);
      if (e.attend === "texte") return C[e.cmd].recevoir(e, { type: "texte", t });
      if (!t) return C[e.cmd].recevoir(e, { type: "vide" });
      if (e.attend === "option" || /^[A-Z]+$/.test(T)) return C[e.cmd].recevoir(e, { type: "option", t: T });
      if (/selection|objet/.test(e.attend)) return ecrire("Clique sur les objets dans le dessin.", "err");
      if (e.attend === "nombre" && /^-?\d+(\.\d+)?$/.test(t)) return C[e.cmd].recevoir(e, { type: "nombre", n: +t });
      const p = lirePoint(t, e.ref);
      if (p.err) return ecrire(p.err, "err");
      C[e.cmd].recevoir(e, { type: "point", p });
    }
    function cliquer(p) {
      if (etape && /selection|objet/.test(etape.attend)) {
        const o = objetSous(p);
        if (o) { avancerGuide({ objet: o }); C[etape.cmd].recevoir(etape, { type: "objet", o }); }
        else ecrire("Aucun objet ici : clique bien sur un trait.", "err");
        return;
      }
      if (etape && /point|nombre/.test(etape.attend)) { ecrire(etape.invite + " " + fp(p)); avancerGuide({ point: p }); C[etape.cmd].recevoir(etape, { type: "point", p }); return; }
      if (!etape) {
        const o = objetSous(p);
        if (o) { if (selection.has(o.id)) selection.delete(o.id); else selection.add(o.id); }
        else if (selection.size) selection.clear();
        else ecrire("Lance une commande (bouton du ruban ou tape L pour LIGNE), puis clique pour donner des points.");
        majProps(); dessiner();
      }
    }

    /* ---------- Autocomplétion ---------- */
    function majSugg() {
      const v = cmd.value.trim().toUpperCase();
      if (etape || !v) { suggEl.hidden = true; return; }
      const l = COMMANDES.filter(([nom, , al]) => nom.startsWith(v) || al.some((a) => a.startsWith(v))).slice(0, 7);
      if (!l.length) { suggEl.hidden = true; return; }
      suggEl.hidden = false;
      suggEl.innerHTML = l.map(([nom, , al, d]) => `<button type="button" data-s="${nom}"><b>${nom}</b> <span>${esc(al.filter((a) => !a.startsWith("_")).join(", "))} · ${esc(d)}</span></button>`).join("");
      suggEl.querySelectorAll("[data-s]").forEach((b) => { b.onmousedown = (ev) => { ev.preventDefault(); cmd.value = ""; suggEl.hidden = true; avancerGuide({ texte: b.dataset.s }); saisie(b.dataset.s); cmd.focus(); }; });
    }

    /* ---------- Propriétés, calques, modes ---------- */
    function majCalques() {
      selCalque.innerHTML = calques.map((c) => `<option value="${esc(c.nom)}" style="color:${c.coul}" ${c.nom === calqueCourant ? "selected" : ""}>■ ${esc(c.nom)}</option>`).join("");
      outils.sauver("calques", calques);
    }
    selCalque.onchange = () => {
      calqueCourant = selCalque.value;
      if (selection.size) { memoriser(); objets.forEach((o) => { if (selection.has(o.id)) o.calque = calqueCourant; }); ecrire(`${selection.size} objet(s) passé(s) sur le calque ${calqueCourant}.`, "ok"); }
      else ecrire(`Calque courant : ${calqueCourant}.`);
      majProps(); dessiner(); cmd.focus();
    };
    function majProps() {
      const sel = objets.filter((o) => selection.has(o.id));
      propsEl.innerHTML = sel.length ? `<b>Propriétés</b> · ${sel.length === 1 ? esc(infos(sel[0])) : `${sel.length} objets sélectionnés`} <span class="muted">— Échap pour désélectionner, ou choisis un calque pour les y mettre.</span>` : `<span class="muted">Calque courant : <b style="color:${coulCalque(calqueCourant)}">${esc(calqueCourant)}</b> · Clique un objet pour voir ses propriétés.</span>`;
    }
    function majModes() {
      racine.querySelectorAll("[data-mode]").forEach((b) => b.classList.toggle("actif", !!modes[b.dataset.mode]));
      outils.sauver("modes", modes);
    }
    function basculer(m) { modes[m] = !modes[m]; ecrire(`<${m.toUpperCase()} ${modes[m] ? "actif" : "inactif"}>`); majModes(); dessiner(); }
    racine.querySelectorAll("[data-mode]").forEach((b) => { b.onclick = () => { basculer(b.dataset.mode); cmd.focus(); }; });

    function zoomEtendu() {
      taille();
      const pts = [];
      objets.forEach((o) => {
        if (o.type === "cercle") pts.push({ x: o.c.x - o.r, y: o.c.y - o.r }, { x: o.c.x + o.r, y: o.c.y + o.r });
        else if (o.type === "pline") pts.push(...o.pts);
        else if (o.type === "texte") pts.push(o.p, { x: o.p.x + o.t.length * o.h * 0.55, y: o.p.y + o.h });
        else if (o.type === "cote") { const g = geoCote(o); pts.push(o.a, o.b, g.a2, g.b2); }
        else pts.push(o.a, o.b);
      });
      if (!pts.length) { vue = { x: -100, y: -100, s: cv.width / 2100 }; return; }
      const x0 = Math.min(...pts.map((p) => p.x)), x1 = Math.max(...pts.map((p) => p.x)), y0 = Math.min(...pts.map((p) => p.y)), y1 = Math.max(...pts.map((p) => p.y));
      const w = Math.max(x1 - x0, 10), h = Math.max(y1 - y0, 10), s = Math.min(cv.width / (w * 1.2), cv.height / (h * 1.2));
      vue = { s, x: x0 - (cv.width / s - w) / 2, y: y0 - (cv.height / s - h) / 2 };
    }

    /* ---------- Saisie dynamique près du curseur ---------- */
    function majDyn() {
      if (!modes.dyn || !sourisEcran || !souris) { dynEl.hidden = true; return; }
      const rr = cv.getBoundingClientRect(), k = cv.width / rr.width;
      let html;
      if (etape && etape.ref && etape.attend === "point") {
        const L = dist(etape.ref, souris), a = (Math.atan2(souris.y - etape.ref.y, souris.x - etape.ref.x) / RAD + 360) % 360;
        html = `<span>${esc(etape.invite.replace(/ ou \[.*$/, "").replace(/:$/, ""))}</span><b>${n2(L)}</b> &lt; <b>${n2(a)}°</b>`;
      } else if (etape) html = `<span>${esc(etape.invite.replace(/:$/, ""))}</span><b>${n2(souris.x)}</b> , <b>${n2(souris.y)}</b>`;
      else html = `<b>${n2(souris.x)}</b> , <b>${n2(souris.y)}</b>`;
      dynEl.innerHTML = html; dynEl.hidden = false;
      dynEl.style.left = (sourisEcran.x / k + 18) + "px"; dynEl.style.top = (sourisEcran.y / k + 18) + "px";
    }

    /* ---------- Mode guidé et démonstration ---------- */
    const normal = (s) => String(s).trim().toUpperCase().replace(/\s+/g, "");
    function etapesDe(m) { return m.prerequis && !m.prerequis.test(objets) ? [...m.prerequis.etapes, ...m.etapes] : m.etapes; }
    function afficherGuide() {
      if (!guide) { guideEl.hidden = true; return; }
      const et = guide.etapes;
      guideEl.hidden = false;
      if (guide.i >= et.length) {
        guideEl.innerHTML = `<b>✅ ${esc(guide.m.titre)} : terminé !</b> ${guide.demo ? "À toi maintenant : clique sur « Guide-moi » et refais-le toi-même." : "Bravo, tu l'as fait toi-même."} <button type="button" class="btn sec" id="gFermer" style="padding:4px 10px">Fermer</button>`;
        guideEl.querySelector("#gFermer").onclick = () => { guide = null; afficherGuide(); };
        return;
      }
      const s = et[guide.i];
      const quoi = s.clic === "objet" ? "<b>Clique sur l'objet</b> indiqué dans le dessin" : s.clic === "point" ? "<b>Clique dans le dessin</b> à l'endroit indiqué" : s.s ? `Tape <code class="gros">${esc(s.s)}</code> puis <kbd>Entrée</kbd>` : `Appuie sur <kbd>Entrée</kbd> sans rien écrire`;
      guideEl.innerHTML = `<div class="ligne espace"><b>🧭 ${esc(guide.m.titre)} · étape ${guide.i + 1}/${et.length}</b>
          <span class="ligne">${guide.demo || s.clic ? "" : `<button type="button" class="btn sec" id="gRemplir" style="padding:4px 10px">✍️ Écris-le pour moi</button>`}<button type="button" class="btn sec" id="gStop" style="padding:4px 10px">✕ Arrêter</button></span></div>
        <div style="margin-top:6px">${quoi}</div><div class="petit muted">${esc(s.e)}</div>`;
      guideEl.querySelector("#gStop").onclick = () => { guide = null; afficherGuide(); };
      const r = guideEl.querySelector("#gRemplir"); if (r) r.onclick = () => { cmd.value = s.s; cmd.focus(); };
    }
    function avancerGuide(x) {
      if (!guide || guide.demo || guide.i >= guide.etapes.length) return;
      const s = guide.etapes[guide.i];
      let ok = false;
      if (s.clic === "objet") ok = !!x.objet && (!s.trouver || s.trouver(objets) === x.objet);
      else if (s.clic === "point") ok = !!x.point;
      else if (x.texte != null) ok = normal(x.texte) === normal(s.s) || (ALIAS[normal(s.s)] && ALIAS[normal(s.s)] === ALIAS[normal(x.texte)]);
      if (ok) { guide.i++; afficherGuide(); }
      else if (x.texte != null || x.objet) outils.toast(s.clic === "objet" ? "Ce n'est pas le bon objet : regarde la consigne" : s.s ? `L'étape demande « ${s.s} »` : "Ici, appuie sur Entrée sans rien écrire");
    }
    function demarrerGuide(m, demo) {
      annulerCommande(); selection.clear();
      guide = { m, i: 0, demo, etapes: etapesDe(m) };
      afficherGuide();
      if (!demo) { cmd.focus(); return; }
      cmd.disabled = true;
      const jouer = (i) => {
        if (!guide || !guide.demo) { cmd.disabled = false; return; }
        if (i >= guide.etapes.length) { cmd.disabled = false; zoomEtendu(); dessiner(); return; }
        const s = guide.etapes[i];
        const suite = () => { if (objets.length) zoomEtendu(); dessiner(); if (guide) { guide.i++; afficherGuide(); } setTimeout(() => jouer(i + 1), 1300); };
        if (s.clic === "objet") { const o = s.trouver(objets); setTimeout(() => { if (o && etape) C[etape.cmd].recevoir(etape, { type: "objet", o }); suite(); }, 700); return; }
        if (s.clic === "point") { setTimeout(() => { souris = s.p; sourisEcran = versEcran(s.p); if (etape) { ecrire(etape.invite + " " + fp(s.p)); C[etape.cmd].recevoir(etape, { type: "point", p: s.p }); } suite(); }, 700); return; }
        let k = 0; cmd.value = "";
        const t = setInterval(() => {
          if (!guide || !guide.demo) { clearInterval(t); cmd.disabled = false; return; }
          if (k < s.s.length) { cmd.value += s.s[k++]; return; }
          clearInterval(t);
          setTimeout(() => { cmd.value = ""; saisie(s.s); suite(); }, 400);
        }, 130);
      };
      setTimeout(() => jouer(0), 300);
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
      MISSIONS.forEach((m) => { if (!faites.includes(m.id) && m.test(objets, suivi)) { faites.push(m.id); nouveau = true; outils.toast("Mission réussie : " + m.titre + " ✓"); } });
      if (nouveau) { outils.sauver("missions", faites); afficherMissions(); }
      if (suivi.diagonale && !suivi.dit) { suivi.dit = true; ecrire("👉 Diagonale d'une pièce de 500 × 300 : √(500² + 300²) ≈ 583,10. Si sur le chantier tes deux diagonales mesurent la même chose, la pièce est d'équerre.", "ok"); }
    }

    /* ---------- Événements ---------- */
    $("#fsaisie").onsubmit = (ev) => { ev.preventDefault(); const v = cmd.value; cmd.value = ""; suggEl.hidden = true; avancerGuide({ texte: v }); saisie(v); dessiner(); };
    cmd.addEventListener("input", () => {
      // Espace = Entrée (comme dans AutoCAD), sauf quand on écrit un texte
      if (/ $/.test(cmd.value) && !(etape && etape.attend === "texte")) { cmd.value = cmd.value.trimEnd(); $("#fsaisie").requestSubmit(); return; }
      majSugg();
    });
    cmd.addEventListener("keydown", (ev) => {
      if (ev.key === " " && !(etape && etape.attend === "texte")) { ev.preventDefault(); cmd.value = cmd.value.trimEnd(); $("#fsaisie").requestSubmit(); }
      if (ev.key === "Tab" && !suggEl.hidden) { ev.preventDefault(); const b = suggEl.querySelector("[data-s]"); if (b) cmd.value = b.dataset.s; majSugg(); }
    });
    racine.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") { annulerCommande(); selection.clear(); cmd.value = ""; suggEl.hidden = true; majProps(); dessiner(); }
      else if (ev.key === "F3") { ev.preventDefault(); basculer("accrobj"); }
      else if (ev.key === "F7") { ev.preventDefault(); basculer("grille"); }
      else if (ev.key === "F8") { ev.preventDefault(); basculer("ortho"); }
      else if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "z") { ev.preventDefault(); annulerCommande(); etape = { cmd: "annuler" }; C.annuler.debut(); }
      else if (ev.key === "Delete" && !etape && selection.size && document.activeElement !== cmd) { etape = { cmd: "effacer" }; C.effacer.debut(etape); }
    });
    racine.querySelectorAll(".acad-ruban [data-cmd]").forEach((b) => {
      b.onclick = () => {
        const c = b.dataset.cmd;
        if (etape) annulerCommande();
        avancerGuide({ texte: c }); saisie(c); dessiner(); cmd.focus();
      };
    });
    racine.querySelectorAll(".acad-ruban [data-zoom]").forEach((b) => {
      b.onclick = () => { const k = +b.dataset.zoom, cx = cv.width / 2, cy = cv.height / 2, av = versMonde(cx, cy); vue.s *= k; const ap = versMonde(cx, cy); vue.x += av.x - ap.x; vue.y += av.y - ap.y; dessiner(); };
    });
    let glisse = null;
    cv.addEventListener("contextmenu", (ev) => ev.preventDefault());
    cv.addEventListener("mousedown", (ev) => { if (ev.button === 1 || ev.button === 2) { ev.preventDefault(); glisse = { x: ev.clientX, y: ev.clientY }; } });
    const finGlisse = () => { glisse = null; };
    const bouge = (ev) => {
      if (!glisse || !document.body.contains(cv)) return;
      const rr = cv.getBoundingClientRect(), k = cv.width / rr.width;
      vue.x -= (ev.clientX - glisse.x) * k / vue.s; vue.y += (ev.clientY - glisse.y) * k / vue.s;
      glisse = { x: ev.clientX, y: ev.clientY }; dessiner();
    };
    window.addEventListener("mouseup", finGlisse); window.addEventListener("mousemove", bouge);
    cv.addEventListener("mousemove", (ev) => { souris = pointSouris(ev); posEl.textContent = `${n2(souris.x)}, ${n2(souris.y)}, 0`; dessiner(); majDyn(); });
    cv.addEventListener("mouseleave", () => { souris = null; sourisEcran = null; accroche = null; posEl.textContent = "—"; dynEl.hidden = true; dessiner(); });
    cv.addEventListener("click", (ev) => { const p = pointSouris(ev); cliquer(p); dessiner(); cmd.focus({ preventScroll: true }); });
    cv.addEventListener("wheel", (ev) => {
      ev.preventDefault();
      const rr = cv.getBoundingClientRect(), k = cv.width / rr.width, px = (ev.clientX - rr.left) * k, py = (ev.clientY - rr.top) * k;
      const av = versMonde(px, py); vue.s *= ev.deltaY < 0 ? 1.2 : 1 / 1.2; const ap = versMonde(px, py);
      vue.x += av.x - ap.x; vue.y += av.y - ap.y; dessiner();
    }, { passive: false });
    const redim = () => { if (!document.body.contains(cv)) { window.removeEventListener("resize", redim); window.removeEventListener("mouseup", finGlisse); window.removeEventListener("mousemove", bouge); return; } dessiner(); };
    window.addEventListener("resize", redim);

    ecrire("Bienvenue dans Jack CAD ! Tape L puis Entrée (ou clique « Ligne » dans le ruban). Lis toujours ce qu'on te demande à gauche de la saisie.");
    majCalques(); majModes(); majProps(); taille(); zoomEtendu(); afficherMissions(); attente(); dessiner();
    cmd.focus({ preventScroll: true });
  }

  window.Simulateur = { monter };
})();
