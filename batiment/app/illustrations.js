/* =========================================================
   Jack Bâtiment — illustrations animées (SVG dessiné à la main)
   Vues en perspective « façon 3D » qui s'animent toutes seules.
   window.ILLUS[id] = { titre, legende, svg }
   window.ILLUS_MODULES["parcours/module"] = [ids] : illustrations
   ajoutées aux modules existants sans toucher à leur contenu.
   ========================================================= */
(function () {
  "use strict";
  const W = 640, H = 360;
  const cadre = (inner) => `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" class="illus-svg">
    <defs>
      <linearGradient id="gCiel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d3b4b"/><stop offset="1" stop-color="#1e2731"/></linearGradient>
      <linearGradient id="gBeton" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a7adb4"/><stop offset="1" stop-color="#7d838b"/></linearGradient>
      <linearGradient id="gTerre" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a5a3a"/><stop offset="1" stop-color="#4e3a26"/></linearGradient>
      <linearGradient id="gAcier" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8763a"/><stop offset="1" stop-color="#8a4a1e"/></linearGradient>
      <marker id="fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ffc420"/></marker>
    </defs>
    <rect width="${W}" height="${H}" rx="14" fill="url(#gCiel)"/>${inner}</svg>`;
  const txt = (x, y, t, o = {}) => `<text x="${x}" y="${y}" fill="${o.c || "#f3f1ea"}" font-family="Nunito, sans-serif" font-size="${o.s || 14}" font-weight="${o.w || 700}" text-anchor="${o.a || "start"}">${t}</text>`;
  const fleche = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffc420" stroke-width="2" marker-end="url(#fl)"/>`;
  const cote = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffc420" stroke-width="2" marker-start="url(#fl)" marker-end="url(#fl)"/>`;
  // apparition retardée (SMIL) : l'élément est invisible puis apparaît à t secondes, en boucle sur « cycle »
  const apparait = (t, cycle = 9) => `<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${(t / cycle).toFixed(3)};${((t + 0.4) / cycle).toFixed(3)};0.94;1" dur="${cycle}s" repeatCount="indefinite"/>`;
  // personnage simple, pieds en (x,y)
  function perso(x, y, o = {}) {
    const t = o.tenue || "#3d5a80", e = o.echelle || 1;
    const bras = o.bras === "haut" ? `<line x1="-12" y1="-80" x2="-22" y2="-118"/><line x1="12" y1="-80" x2="22" y2="-118"/>`
      : o.bras === "avant" ? `<line x1="-12" y1="-80" x2="20" y2="-66"/><line x1="12" y1="-80" x2="34" y2="-70"/>`
        : `<line x1="-12" y1="-80" x2="-20" y2="-48"/><line x1="12" y1="-80" x2="20" y2="-48"/>`;
    return `<g transform="translate(${x},${y}) scale(${e})">
      <g stroke="#2b3440" stroke-width="9" stroke-linecap="round"><line x1="-7" y1="-44" x2="-10" y2="0"/><line x1="7" y1="-44" x2="10" y2="0"/></g>
      <rect x="-14" y="-86" width="28" height="44" rx="8" fill="${t}"/>
      ${o.gilet !== false ? `<rect x="-14" y="-86" width="28" height="40" rx="8" fill="#ff7a1a"/><rect x="-14" y="-70" width="28" height="4" fill="#f3f1ea"/><rect x="-14" y="-58" width="28" height="4" fill="#f3f1ea"/>` : ""}
      <g stroke="${o.gilet !== false ? "#ff7a1a" : t}" stroke-width="7" stroke-linecap="round">${bras}</g>
      <circle cx="0" cy="-97" r="12" fill="${o.peau || "#c68642"}"/>
      ${o.casque !== false ? `<path d="M-14,-99 a14,14 0 0 1 28,0 z" fill="#ffc420"/><rect x="-16" y="-101" width="32" height="4" rx="2" fill="#e0a800"/>` : `<path d="M-12,-101 a12,9 0 0 1 24,0 z" fill="#2a1d12"/>`}
    </g>`;
  }

  const I = {};

  /* ---------- Ferraillage : une cage de poutre qui se monte ---------- */
  (function () {
    // projection isométrique simple : x vers la droite-bas, y vers la droite-haut, z vers le haut
    const P = (x, y, z) => [150 + (x - y) * 0.65, 190 + (x + y) * 0.375 - z * 0.75];
    const pt = (p) => p.join(",");
    const L = 340, b = 70, h = 110;
    let s = "";
    // barres filantes (4 coins), dessinées une à une
    const coins = [[0, 0], [b, 0], [0, h], [b, h]];
    coins.forEach(([y, z], i) => {
      const a = P(0, y, z), c = P(L, y, z);
      s += `<line x1="${a[0]}" y1="${a[1]}" x2="${c[0]}" y2="${c[1]}" stroke="url(#gAcier)" stroke-width="7" stroke-linecap="round" opacity="0">${apparait(0.3 + i * 0.6)}</line>`;
    });
    // cadres (étriers) tous les 40
    for (let k = 0, x = 15; x < L; x += 40, k++) {
      const q = [P(x, 0, 0), P(x, b, 0), P(x, b, h), P(x, 0, h)];
      s += `<polygon points="${q.map(pt).join(" ")}" fill="none" stroke="#e08a45" stroke-width="4" stroke-linejoin="round" opacity="0">${apparait(2.8 + k * 0.25)}</polygon>`;
    }
    // cales d'enrobage
    [40, 170, 300].forEach((x, i) => {
      const c = P(x, b / 2, -12);
      s += `<g opacity="0">${apparait(5.6 + i * 0.3)}<rect x="${c[0] - 9}" y="${c[1] - 6}" width="18" height="14" rx="3" fill="#9aa1a9"/></g>`;
    });
    s += `<g opacity="0">${apparait(1.2)}${fleche(460, 150, 345, 238)}${txt(430, 142, "Barres filantes (HA)")}</g>`;
    s += `<g opacity="0">${apparait(3.4)}${fleche(110, 80, 168, 128)}${txt(40, 72, "Cadres / étriers")}</g>`;
    s += `<g opacity="0">${apparait(6.2)}${fleche(460, 330, 336, 322)}${txt(462, 336, "Cales d'enrobage")}</g>`;
    s += txt(20, 34, "Une cage d'armatures de poutre", { s: 18, w: 800, c: "#ffc420" });
    I["ferraillage-cage"] = { titre: "Monter une cage d'armatures", legende: "Les barres filantes portent l'effort ; les cadres les tiennent et reprennent le cisaillement ; les cales garantissent l'enrobage.", svg: cadre(s) };
  })();

  /* ---------- Enrobage : coupe d'un voile ---------- */
  I.enrobage = {
    titre: "L'enrobage, c'est la peau de béton qui protège l'acier",
    legende: "Sans assez d'enrobage, l'eau et l'air atteignent l'acier : il rouille, gonfle et fait éclater le béton.",
    svg: cadre(`
      ${txt(20, 34, "Coupe d'un voile en béton armé", { s: 18, w: 800, c: "#ffc420" })}
      <rect x="200" y="60" width="240" height="270" fill="url(#gBeton)" stroke="#5c6168" stroke-width="2"/>
      ${[100, 160, 220, 280].map((y) => `<circle cx="245" cy="${y}" r="8" fill="url(#gAcier)"/><circle cx="395" cy="${y}" r="8" fill="url(#gAcier)"/>`).join("")}
      <line x1="245" y1="70" x2="245" y2="320" stroke="#c8763a" stroke-width="5"/><line x1="395" y1="70" x2="395" y2="320" stroke="#c8763a" stroke-width="5"/>
      <rect x="200" y="300" width="37" height="14" rx="3" fill="#6f757c" stroke="#f3f1ea" stroke-width="1"/>
      ${cote(200, 345, 237, 345)}${txt(150, 352, "c", { s: 18, w: 800, c: "#ffc420" })}
      ${txt(460, 120, "Enrobage « c » : du nu", { s: 14 })}${txt(460, 140, "du béton à l'acier.", { s: 14 })}
      ${txt(460, 175, "Souvent 3 cm à l'intérieur,", { s: 13, w: 600, c: "#a9aeb5" })}${txt(460, 193, "4 à 5 cm dehors ou", { s: 13, w: 600, c: "#a9aeb5" })}${txt(460, 211, "contre la terre.", { s: 13, w: 600, c: "#a9aeb5" })}${txt(460, 229, "Valeur exacte : le plan.", { s: 13, w: 600, c: "#a9aeb5" })}
      ${fleche(140, 300, 196, 306)}${txt(40, 296, "Cale", { s: 14 })}
      <circle cx="245" cy="160" r="20" fill="none" stroke="#ff5d52" stroke-width="3" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite"/></circle>`)
  };

  /* ---------- Recouvrement de deux barres ---------- */
  I.recouvrement = {
    titre: "Le recouvrement : deux barres qui se passent l'effort",
    legende: "Les barres se chevauchent sur une longueur donnée par le bureau d'études (souvent de l'ordre de 40 à 50 fois le diamètre) et sont ligaturées.",
    svg: cadre(`
      ${txt(20, 34, "Recouvrement de barres", { s: 18, w: 800, c: "#ffc420" })}
      <rect x="40" y="150" width="330" height="12" rx="6" fill="url(#gAcier)"/>
      <rect x="600" y="172" width="330" height="12" rx="6" fill="url(#gAcier)"><animate attributeName="x" values="600;600;250;250" keyTimes="0;.15;.5;1" dur="6s" repeatCount="indefinite"/></rect>
      <g opacity="0"><animate attributeName="opacity" values="0;0;1;1" keyTimes="0;.55;.6;1" dur="6s" repeatCount="indefinite"/>
        ${[270, 310, 350].map((x) => `<rect x="${x - 3}" y="144" width="6" height="46" rx="3" fill="#cfd3d8"/>`).join("")}
        ${cote(250, 225, 370, 225)}${txt(250, 252, "L recouvrement ≈ 40 à 50 Ø", { s: 15 })}
        ${txt(250, 272, "(HA12 → environ 50 à 60 cm)", { s: 13, w: 600, c: "#a9aeb5" })}
        ${fleche(210, 110, 268, 144)}${txt(120, 104, "Ligatures (fil recuit)", { s: 14 })}
      </g>`)
  };

  /* ---------- Banche : un panneau qui vient se fermer ---------- */
  (function () {
    const panneau = (dx, couleur) => `
      <g transform="translate(${dx},0)">
        <polygon points="0,90 160,40 160,270 0,320" fill="${couleur}" stroke="#2d3238" stroke-width="2"/>
        ${[0, 1, 2, 3, 4].map((i) => `<line x1="${i * 32}" y1="${90 - i * 10}" x2="${i * 32}" y2="${320 - i * 10}" stroke="#2d3238" stroke-width="2" opacity=".6"/>`).join("")}
        <polygon points="-30,98 130,48 160,40 0,90" fill="#b5823c"/>
        <line x1="-30" y1="64" x2="130" y2="14" stroke="#ffc420" stroke-width="4"/><line x1="-30" y1="98" x2="-30" y2="64" stroke="#ffc420" stroke-width="4"/><line x1="130" y1="48" x2="130" y2="14" stroke="#ffc420" stroke-width="4"/>
      </g>`;
    I.banche = {
      titre: "Banches : deux panneaux face à face, serrés par des tiges",
      legende: "On règle la première banche (aplomb, béquilles), on pose les aciers, puis on approche la deuxième et on serre les tiges. La passerelle et ses garde-corps sont en haut.",
      svg: cadre(`
        ${txt(20, 34, "Mise en place d'un voile banché", { s: 18, w: 800, c: "#ffc420" })}
        <polygon points="0,330 640,330 640,360 0,360" fill="#4b4f55"/>
        ${panneau(150, "#5d7b96")}
        <line x1="150" y1="200" x2="80" y2="328" stroke="#9aa1a9" stroke-width="6"/><line x1="150" y1="260" x2="100" y2="328" stroke="#9aa1a9" stroke-width="6"/>
        <g>${panneau(0, "#6f8fab")}<animateTransform attributeName="transform" type="translate" values="420,-30;420,-30;250,0;250,0" keyTimes="0;.15;.55;1" dur="7s" repeatCount="indefinite"/></g>
        <line x1="300" y1="120" x2="300" y2="0" stroke="#cfd3d8" stroke-width="2"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.55;1" dur="7s" repeatCount="indefinite"/></line>
        <g opacity="0"><animate attributeName="opacity" values="0;0;1;1" keyTimes="0;.6;.65;1" dur="7s" repeatCount="indefinite"/>
          ${[150, 210, 270].map((y) => `<line x1="150" y1="${y + 20}" x2="400" y2="${y - 20}" stroke="#ffc420" stroke-width="4" stroke-dasharray="6 4"/>`).join("")}
          ${txt(440, 200, "Tiges de serrage", { s: 14 })}${txt(440, 218, "(dans des fourreaux)", { s: 12, w: 600, c: "#a9aeb5" })}
        </g>
        ${fleche(70, 120, 128, 80)}${txt(20, 140, "Passerelle + garde-corps", { s: 13 })}
        ${fleche(40, 250, 92, 300)}${txt(10, 240, "Béquilles", { s: 13 })}`)
    };
  })();

  /* ---------- Coulage et vibration ---------- */
  I.coulage = {
    titre: "Couler par couches et vibrer",
    legende: "Le béton est mis en place par couches d'environ 50 cm. L'aiguille vibrante est enfoncée verticalement, puis remontée lentement pour chasser l'air.",
    svg: cadre(`
      ${txt(20, 34, "Coulage d'un voile", { s: 18, w: 800, c: "#ffc420" })}
      <rect x="230" y="70" width="18" height="270" fill="#5d7b96"/><rect x="392" y="70" width="18" height="270" fill="#5d7b96"/>
      <rect x="248" y="340" width="144" height="0" fill="url(#gBeton)">
        <animate attributeName="y" values="340;340;270;270;200;200;130" keyTimes="0;.05;.25;.4;.6;.75;1" dur="10s" repeatCount="indefinite"/>
        <animate attributeName="height" values="0;0;70;70;140;140;210" keyTimes="0;.05;.25;.4;.6;.75;1" dur="10s" repeatCount="indefinite"/>
      </rect>
      ${[270, 200].map((y) => `<line x1="248" y1="${y}" x2="392" y2="${y}" stroke="#5c6168" stroke-dasharray="4 4"/>`).join("")}
      <g><animateTransform attributeName="transform" type="translate" values="0,-40;0,40;0,-40" dur="2s" repeatCount="indefinite"/>
        <line x1="320" y1="40" x2="320" y2="230" stroke="#2b3440" stroke-width="6"/><rect x="314" y="230" width="12" height="40" rx="5" fill="#cfd3d8"/>
      </g>
      ${txt(430, 280, "Couches d'environ 50 cm", { s: 14 })}${txt(430, 160, "Aiguille vibrante :", { s: 14 })}${txt(430, 178, "verticale, tous les 30-50 cm", { s: 13, w: 600, c: "#a9aeb5" })}
      ${txt(40, 120, "Hauteur de chute", { s: 14 })}${txt(40, 138, "limitée (sinon goulotte)", { s: 13, w: 600, c: "#a9aeb5" })}
      <path d="M150,60 L250,60" stroke="#7d838b" stroke-width="14"/><circle cx="240" cy="78" r="6" fill="#a7adb4"><animate attributeName="cy" values="70;150" dur="1s" repeatCount="indefinite"/></circle>`)
  };

  /* ---------- Tranchée blindée ---------- */
  I.tranchee = {
    titre: "Tranchée : au-delà de 1,30 m, on blinde",
    legende: "Une paroi de terre peut s'effondrer sans prévenir. Blindage (caissons, panneaux) ou talus, déblais tenus à distance du bord, accès par une échelle.",
    svg: cadre(`
      ${txt(20, 34, "Tranchée blindée", { s: 18, w: 800, c: "#ffc420" })}
      <rect x="0" y="150" width="640" height="210" fill="url(#gTerre)"/>
      <rect x="230" y="150" width="180" height="200" fill="#2a1f15"/>
      <polygon points="430,150 470,110 540,110 580,150" fill="#8a6440"/>
      ${cote(410, 168, 470, 168)}${txt(415, 192, "≥ 40 cm", { s: 13 })}
      <g><animateTransform attributeName="transform" type="translate" values="0,-210;0,-210;0,0;0,0" keyTimes="0;.15;.5;1" dur="7s" repeatCount="indefinite"/>
        <rect x="232" y="150" width="14" height="200" fill="#6f8fab"/><rect x="394" y="150" width="14" height="200" fill="#6f8fab"/>
        ${[200, 290].map((y) => `<rect x="246" y="${y}" width="148" height="10" rx="4" fill="#cfd3d8"/>`).join("")}
      </g>
      ${perso(320, 350, { echelle: 0.85 })}
      <g stroke="#cfd3d8" stroke-width="4"><line x1="270" y1="350" x2="280" y2="120"/><line x1="292" y1="350" x2="302" y2="120"/>${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="${271 + i * 1.7}" y1="${330 - i * 38}" x2="${293 + i * 1.7}" y2="${330 - i * 38}"/>`).join("")}</g>
      ${cote(200, 150, 200, 350)}${txt(110, 255, "> 1,30 m", { s: 15 })}
      ${txt(470, 100, "Déblais à distance", { s: 13 })}`)
  };

  /* ---------- Couches de chaussée ---------- */
  (function () {
    const couches = [["Plate-forme (sol support)", "#6b4d31", 300, 0], ["Couche de forme", "#8c7a5b", 270, 1.2], ["Fondation (grave)", "#9b9384", 240, 2.4], ["Couche de base", "#7c7c7c", 210, 3.6], ["Roulement (enrobé)", "#2c2c2e", 186, 4.8]];
    let s = txt(20, 34, "Les couches d'une chaussée", { s: 18, w: 800, c: "#ffc420" });
    couches.forEach(([nom, c, y, t], i) => {
      const hauteur = i === 0 ? 60 : i === 4 ? 24 : 30;
      s += `<g opacity="0">${apparait(t, 10)}<polygon points="60,${y + hauteur} 430,${y + hauteur} 470,${y + hauteur - 30} 100,${y + hauteur - 30}" fill="${c}" opacity=".85"/><rect x="60" y="${y}" width="370" height="${hauteur}" fill="${c}"/>${txt(450, y + hauteur / 2 + 5, nom, { s: 14 })}</g>`;
    });
    s += `<g opacity="0">${apparait(5.6, 10)}<g><animateTransform attributeName="transform" type="translate" values="0,0;250,0;0,0" dur="5s" repeatCount="indefinite"/>
      <rect x="60" y="138" width="90" height="34" rx="8" fill="#ffc420"/><circle cx="72" cy="172" r="16" fill="#cfd3d8"/><circle cx="140" cy="172" r="16" fill="#cfd3d8"/><rect x="92" y="112" width="30" height="28" rx="4" fill="#2b3440"/></g>
      ${txt(60, 104, "Compacteur : couche par couche", { s: 13 })}</g>`;
    I.chaussee = { titre: "Construire une route, couche par couche", legende: "Chaque couche est réglée puis compactée avant la suivante. L'enrobé chaud est posé au finisseur, puis cylindré.", svg: cadre(s) };
  })();

  /* ---------- Couleurs des réseaux ---------- */
  (function () {
    const reseaux = [["Électricité", "#e53935"], ["Gaz", "#fdd835"], ["Eau potable", "#1e88e5"], ["Assainissement", "#8d6e63"], ["Télécom", "#43a047"], ["Chauffage", "#8e24aa"]];
    let s = txt(20, 34, "Grillages avertisseurs : une couleur par réseau", { s: 18, w: 800, c: "#ffc420" });
    s += `<rect x="0" y="80" width="640" height="280" fill="url(#gTerre)"/>`;
    reseaux.forEach(([nom, c], i) => {
      const x = 50 + i * 98;
      s += `<g opacity="0">${apparait(0.4 + i * 0.7, 9)}<rect x="${x - 30}" y="190" width="60" height="8" fill="${c}" opacity=".85"/><path d="M${x - 30},194 h60" stroke="#000" stroke-dasharray="4 4" opacity=".3"/>
        <circle cx="${x}" cy="270" r="22" fill="${c}" stroke="#1b1b1b" stroke-width="2"/>${txt(x, 330, nom, { s: 12, a: "middle" })}</g>`;
    });
    s += txt(20, 70, "Le grillage est posé environ 20 à 30 cm au-dessus du tuyau : quand tu le vois, tu arrêtes la pelle.", { s: 13, w: 600 });
    I.reseaux = { titre: "Reconnaître un réseau enterré", legende: "Rouge électricité, jaune gaz, bleu eau potable, marron assainissement, vert télécom, violet chauffage.", svg: cadre(s) };
  })();

  /* ---------- Angles morts d'une pelle ---------- */
  I["angles-morts"] = {
    titre: "Les angles morts d'un engin",
    legende: "Dans les zones rouges, le conducteur ne te voit pas. Reste dans son champ de vision et attends son signe avant d'approcher.",
    svg: cadre(`
      ${txt(20, 34, "Vue de dessus : pelle hydraulique", { s: 18, w: 800, c: "#ffc420" })}
      <path d="M320,190 L640,60 L640,360 L470,360 Z" fill="#ff5d52" opacity=".35"><animate attributeName="opacity" values=".15;.45;.15" dur="2s" repeatCount="indefinite"/></path>
      <path d="M320,190 L0,330 L0,360 L230,360 Z" fill="#ff5d52" opacity=".35"><animate attributeName="opacity" values=".15;.45;.15" dur="2s" begin=".5s" repeatCount="indefinite"/></path>
      <rect x="250" y="140" width="160" height="110" rx="12" fill="#ffc420" stroke="#1b1b1b" stroke-width="3"/>
      <rect x="235" y="125" width="190" height="20" rx="6" fill="#2b3440"/><rect x="235" y="245" width="190" height="20" rx="6" fill="#2b3440"/>
      <rect x="270" y="160" width="50" height="45" rx="6" fill="#4fb3ff" opacity=".8"/>
      <g><animateTransform attributeName="transform" type="rotate" values="-20 320 190;20 320 190;-20 320 190" dur="6s" repeatCount="indefinite"/>
        <rect x="60" y="180" width="200" height="22" rx="8" fill="#e0a800"/><rect x="40" y="168" width="40" height="46" rx="6" fill="#7d838b"/></g>
      ${txt(470, 330, "Angle mort", { s: 15, c: "#ffb3ad" })}${txt(20, 300, "Angle mort", { s: 15, c: "#ffb3ad" })}
      ${txt(150, 90, "Champ de vision : devant et du côté de la cabine", { s: 13 })}`)
  };

  /* ---------- Signalisation d'un chantier sur la route ---------- */
  (function () {
    let s = txt(20, 34, "Chantier sur la chaussée : alternat", { s: 18, w: 800, c: "#ffc420" });
    s += `<rect x="0" y="130" width="640" height="150" fill="#3a3c40"/><line x1="0" y1="205" x2="640" y2="205" stroke="#f3f1ea" stroke-width="4" stroke-dasharray="30 20"/>
      <rect x="300" y="210" width="160" height="66" fill="#7a5a3a"/>${txt(380, 250, "Zone de travaux", { s: 13, a: "middle" })}`;
    [[110, 0.5], [170, 1], [230, 1.5], [280, 2], [480, 2.5], [530, 3]].forEach(([x, t]) => {
      const y = x < 300 ? 270 - (x - 110) * 0.35 : 212;
      s += `<g opacity="0">${apparait(t, 9)}<polygon points="${x},${y - 30} ${x - 10},${y} ${x + 10},${y}" fill="#ff7a1a"/><rect x="${x - 7}" y="${y - 20}" width="14" height="4" fill="#f3f1ea"/></g>`;
    });
    s += `<g opacity="0">${apparait(3.6, 9)}<polygon points="60,60 90,110 30,110" fill="#f3f1ea" stroke="#e53935" stroke-width="6"/>${perso(60, 128, { echelle: 0.18, casque: false, gilet: false })}${txt(100, 92, "AK5 « travaux »", { s: 13 })}</g>`;
    s += `<g opacity="0">${apparait(4.4, 9)}<rect x="560" y="70" width="18" height="50" rx="4" fill="#1b1b1b"/><circle cx="569" cy="82" r="5" fill="#e53935"><animate attributeName="fill" values="#e53935;#e53935;#43a047;#43a047" keyTimes="0;.5;.5;1" dur="4s" repeatCount="indefinite"/></circle><line x1="569" y1="120" x2="569" y2="135" stroke="#1b1b1b" stroke-width="4"/>${txt(470, 64, "Feux d'alternat", { s: 13 })}</g>`;
    s += txt(20, 320, "Cônes (K5) en biseau, panneau de danger en amont, feux ou piquets (K10) pour l'alternat.", { s: 13, w: 600 });
    I.signalisation = { titre: "Signaler un chantier sur la voie publique", legende: "On prévient l'usager loin avant, on rétrécit progressivement la voie (biseau de cônes), puis on gère l'alternat.", svg: cadre(s) };
  })();

  /* ---------- Échafaudage conforme ---------- */
  I.echafaudage = {
    titre: "Un plancher d'échafaudage bien protégé",
    legende: "Garde-corps (lisse haute et lisse intermédiaire), plinthe contre la chute d'objets, accès par l'intérieur, ancrages à la façade.",
    svg: cadre(`
      ${txt(20, 34, "Échafaudage : les protections", { s: 18, w: 800, c: "#ffc420" })}
      <rect x="400" y="60" width="240" height="300" fill="url(#gBeton)"/>
      ${[[120, 280], [120, 170]].map(([x, y]) => `<rect x="${x}" y="${y}" width="260" height="10" fill="#b5823c"/>`).join("")}
      <g stroke="#cfd3d8" stroke-width="6"><line x1="125" y1="80" x2="125" y2="360"/><line x1="375" y1="80" x2="375" y2="360"/></g>
      <g stroke="#ffc420" stroke-width="5"><line x1="125" y1="130" x2="375" y2="130"/><line x1="125" y1="150" x2="375" y2="150"/><line x1="125" y1="240" x2="375" y2="240"/><line x1="125" y1="260" x2="375" y2="260"/></g>
      <rect x="125" y="158" width="250" height="12" fill="#ff7a1a"/><rect x="125" y="268" width="250" height="12" fill="#ff7a1a"/>
      <line x1="375" y1="150" x2="400" y2="150" stroke="#9aa1a9" stroke-width="5"/>
      ${perso(250, 170, { echelle: 0.8 })}
      <g opacity="0">${apparait(0.5, 8)}${fleche(70, 110, 120, 128)}${txt(10, 102, "Lisse haute (1 m)", { s: 13 })}</g>
      <g opacity="0">${apparait(1.3, 8)}${fleche(70, 160, 120, 150)}${txt(10, 178, "Lisse intermédiaire", { s: 13 })}</g>
      <g opacity="0">${apparait(2.1, 8)}${fleche(70, 300, 120, 278)}${txt(10, 318, "Plinthe", { s: 13 })}</g>
      <g opacity="0">${apparait(2.9, 8)}${fleche(470, 110, 392, 148)}${txt(450, 100, "Ancrage", { s: 13, c: "#1b1b1b" })}</g>`)
  };

  /* ---------- AutoCAD : l'écran ---------- */
  I["autocad-ecran"] = {
    titre: "L'écran d'AutoCAD, zone par zone",
    legende: "Le ruban en haut (les outils), la grande zone de dessin, la ligne de commande en bas (ce qu'AutoCAD te demande) et la barre d'état (aides au dessin).",
    svg: cadre(`
      <rect x="20" y="20" width="600" height="320" rx="8" fill="#1b2027" stroke="#3a4048"/>
      <rect x="20" y="20" width="600" height="22" rx="8" fill="#c0392b"/>${txt(32, 36, "A", { s: 14, w: 900 })}
      <rect x="20" y="42" width="600" height="46" fill="#2c3137"/>
      ${["Ligne", "Polylig.", "Cercle", "Rect.", "Déplacer", "Copier", "Décaler", "Ajuster"].map((t, i) => `<rect x="${30 + i * 72}" y="50" width="64" height="30" rx="4" fill="#3a4048"/>${txt(62 + i * 72, 70, t, { s: 11, a: "middle", w: 600 })}`).join("")}
      <rect x="20" y="88" width="600" height="190" fill="#212830"/>
      <g stroke="#ffc420" stroke-width="2" fill="none"><rect x="200" y="130" width="200" height="110"/><circle cx="300" cy="185" r="16"/></g>
      <g transform="translate(40,260)"><line x1="0" y1="0" x2="30" y2="0" stroke="#ff5d52" stroke-width="2"/><line x1="0" y1="0" x2="0" y2="-30" stroke="#3cc47c" stroke-width="2"/>${txt(32, 4, "X", { s: 11 })}${txt(-4, -34, "Y", { s: 11 })}</g>
      <rect x="20" y="278" width="600" height="38" fill="#0f1114"/>${txt(30, 302, "Commande : LIGNE   Premier point :", { s: 13, c: "#ffc420" })}
      <rect x="20" y="316" width="600" height="24" fill="#2c3137"/>${["GRILLE", "ACCROB", "ORTHO", "POLAIRE", "ACCROBJ"].map((t, i) => `<rect x="${330 + i * 56}" y="320" width="52" height="16" rx="3" fill="${i === 4 ? "#4fb3ff" : "#3a4048"}"/>${txt(356 + i * 56, 332, t, { s: 9, a: "middle" })}`).join("")}
      <g class="zone-pulse"><rect x="22" y="44" width="596" height="42" fill="none" stroke="#ffc420" stroke-width="3" rx="4" opacity="0">${apparait(0.3, 10)}</rect>
      <rect x="22" y="90" width="596" height="186" fill="none" stroke="#4fb3ff" stroke-width="3" rx="4" opacity="0">${apparait(2.6, 10)}</rect>
      <rect x="22" y="280" width="596" height="34" fill="none" stroke="#3cc47c" stroke-width="3" rx="4" opacity="0">${apparait(4.9, 10)}</rect>
      <rect x="326" y="318" width="290" height="20" fill="none" stroke="#ff7a1a" stroke-width="3" rx="4" opacity="0">${apparait(7.2, 10)}</rect></g>
      <g opacity="0">${apparait(0.3, 10)}${txt(450, 120, "1. Ruban : les outils", { s: 13, c: "#ffc420" })}</g>
      <g opacity="0">${apparait(2.6, 10)}${txt(430, 160, "2. Zone de dessin", { s: 13, c: "#4fb3ff" })}</g>
      <g opacity="0">${apparait(4.9, 10)}${txt(430, 200, "3. Ligne de commande :", { s: 13, c: "#3cc47c" })}${txt(430, 218, "LIS-LA TOUJOURS", { s: 13, c: "#3cc47c" })}</g>
      <g opacity="0">${apparait(7.2, 10)}${txt(430, 250, "4. Barre d'état (F3, F8…)", { s: 13, c: "#ff7a1a" })}</g>`)
  };

  /* ---------- AutoCAD : les trois façons de donner un point ---------- */
  I["autocad-coord"] = {
    titre: "Absolu, relatif, polaire",
    legende: "0,0 et 500,0 : coordonnées absolues (depuis l'origine). @500,0 : on avance de 500 en X depuis le dernier point. @600<5 : on avance de 600 dans la direction 5°.",
    svg: cadre(`
      ${txt(20, 34, "Les 3 façons de donner un point", { s: 18, w: 800, c: "#ffc420" })}
      <g transform="translate(60,300)">
        <line x1="0" y1="0" x2="520" y2="0" stroke="#ff5d52" stroke-width="1.5" opacity=".6"/><line x1="0" y1="0" x2="0" y2="-240" stroke="#3cc47c" stroke-width="1.5" opacity=".6"/>
        <circle cx="0" cy="0" r="5" fill="#f3f1ea"/>${txt(6, 18, "0,0", { s: 13 })}
        <line x1="0" y1="0" x2="250" y2="0" stroke="#ffc420" stroke-width="4" stroke-dasharray="250" stroke-dashoffset="250"><animate attributeName="stroke-dashoffset" values="250;250;0;0" keyTimes="0;.05;.25;1" dur="9s" repeatCount="indefinite"/></line>
        <g opacity="0">${apparait(2.2, 9)}${txt(80, -12, "250,0 (absolu)", { s: 13, c: "#ffc420" })}</g>
        <line x1="250" y1="0" x2="250" y2="-150" stroke="#4fb3ff" stroke-width="4" stroke-dasharray="150" stroke-dashoffset="150"><animate attributeName="stroke-dashoffset" values="150;150;0;0" keyTimes="0;.33;.5;1" dur="9s" repeatCount="indefinite"/></line>
        <g opacity="0">${apparait(4.5, 9)}${txt(258, -70, "@0,150 (relatif)", { s: 13, c: "#4fb3ff" })}</g>
        <line x1="250" y1="-150" x2="${250 + 200 * Math.cos(Math.PI / 6)}" y2="${-150 - 200 * Math.sin(Math.PI / 6)}" stroke="#3cc47c" stroke-width="4" stroke-dasharray="200" stroke-dashoffset="200"><animate attributeName="stroke-dashoffset" values="200;200;0;0" keyTimes="0;.6;.78;1" dur="9s" repeatCount="indefinite"/></line>
        <path d="M310,-150 A60,60 0 0 0 302,-180" fill="none" stroke="#3cc47c" stroke-width="2"/>
        <g opacity="0">${apparait(7, 9)}${txt(330, -200, "@200<30 (polaire)", { s: 13, c: "#3cc47c" })}${txt(318, -160, "30°", { s: 12, c: "#3cc47c" })}</g>
      </g>`)
  };

  /* ---------- Chaises d'implantation (vue de dessus) ---------- */
  (function () {
    const x0 = 190, y0 = 90, w = 260, h = 170; // la maison
    const chaise = (x, y, sx, sy) => `<g transform="translate(${x},${y}) scale(${sx},${sy})"><rect x="0" y="-4" width="60" height="8" fill="#b5823c"/><rect x="-4" y="0" width="8" height="60" fill="#b5823c"/><circle cx="56" cy="0" r="4" fill="#5c3b1e"/><circle cx="0" cy="56" r="4" fill="#5c3b1e"/><circle cx="0" cy="0" r="4" fill="#5c3b1e"/></g>`;
    let s = txt(20, 34, "Implanter avec des chaises (vue de dessus)", { s: 18, w: 800, c: "#ffc420" });
    s += `<rect x="0" y="50" width="640" height="310" fill="#4e6b3a" opacity=".55"/>`;
    s += `<g opacity="0">${apparait(0.3, 11)}${chaise(x0 - 50, y0 - 50, 1, 1)}${chaise(x0 + w + 50, y0 - 50, -1, 1)}${chaise(x0 - 50, y0 + h + 50, 1, -1)}${chaise(x0 + w + 50, y0 + h + 50, -1, -1)}${txt(40, 70, "Chaises (en retrait des fouilles)", { s: 13 })}</g>`;
    const cordeau = (x1, y1, x2, y2, t) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f3f1ea" stroke-width="2" stroke-dasharray="${Math.hypot(x2 - x1, y2 - y1)}" stroke-dashoffset="${Math.hypot(x2 - x1, y2 - y1)}"><animate attributeName="stroke-dashoffset" values="${Math.hypot(x2 - x1, y2 - y1)};${Math.hypot(x2 - x1, y2 - y1)};0;0" keyTimes="0;${(t / 11).toFixed(2)};${((t + 0.8) / 11).toFixed(2)};1" dur="11s" repeatCount="indefinite"/></line>`;
    s += cordeau(x0 - 50, y0, x0 + w + 50, y0, 1.5) + cordeau(x0 - 50, y0 + h, x0 + w + 50, y0 + h, 2.2) + cordeau(x0, y0 - 50, x0, y0 + h + 50, 2.9) + cordeau(x0 + w, y0 - 50, x0 + w, y0 + h + 50, 3.6);
    s += `<g opacity="0">${apparait(4.6, 11)}<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#ffc420" opacity=".18" stroke="#ffc420" stroke-width="3"/>${txt(x0 + w / 2, y0 + h / 2 + 5, "Nu des murs = croisement des cordeaux", { s: 13, a: "middle" })}</g>`;
    s += `<g opacity="0">${apparait(6.4, 11)}<line x1="${x0}" y1="${y0}" x2="${x0 + w}" y2="${y0 + h}" stroke="#4fb3ff" stroke-width="3"/><line x1="${x0 + w}" y1="${y0}" x2="${x0}" y2="${y0 + h}" stroke="#4fb3ff" stroke-width="3"/>${txt(410, 330, "Diagonales égales = d'équerre", { s: 14, c: "#9fd3ff" })}</g>`;
    s += `<g opacity="0">${apparait(8, 11)}${[[x0, y0], [x0 + w, y0], [x0, y0 + h], [x0 + w, y0 + h]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#3cc47c"/>`).join("")}${txt(20, 340, "Fil à plomb sous chaque croisement → piquet au sol", { s: 13 })}</g>`;
    I.chaises = { titre: "Les chaises d'implantation", legende: "Les chaises sont posées en retrait, à niveau. On y tend des cordeaux : leurs croisements donnent les angles de la maison. On contrôle les diagonales, puis on reporte les points au sol avec un fil à plomb.", svg: cadre(s) };
  })();

  /* ---------- Une maison qui se construit étape par étape ---------- */
  (function () {
    const C = 16;
    const etapes = [
      [0.3, "1. Terrassement", `<rect x="160" y="268" width="330" height="30" fill="#3a2a1b"/>`],
      [1.6, "2. Fondations", `<rect x="168" y="282" width="314" height="18" fill="url(#gBeton)"/>`],
      [2.9, "3. Soubassement", `<rect x="168" y="250" width="314" height="32" fill="#9aa1a9" stroke="#5c6168"/>`],
      [4.2, "4. Murs", `<rect x="180" y="150" width="290" height="100" fill="#cfd3d8" stroke="#8d939b"/>${[0, 1, 2, 3, 4].map((i) => `<line x1="180" y1="${170 + i * 20}" x2="470" y2="${170 + i * 20}" stroke="#a7adb4"/>`).join("")}`],
      [5.5, "5. Plancher", `<rect x="176" y="146" width="298" height="8" fill="#7d838b"/>`],
      [6.8, "6. Toiture : hors d'eau", `<polygon points="160,150 325,60 490,150" fill="#b0452f" stroke="#7a2e1f" stroke-width="3"/>${[0, 1, 2, 3].map((i) => `<line x1="${180 + i * 10}" y1="${139 - i * 5.5}" x2="${470 - i * 10}" y2="${139 - i * 5.5}" stroke="#8f3826" opacity=".7"/>`).join("")}`],
      [8.1, "7. Fenêtres : hors d'air", `<rect x="215" y="175" width="45" height="45" fill="#4fb3ff" stroke="#f3f1ea" stroke-width="3"/><rect x="390" y="175" width="45" height="45" fill="#4fb3ff" stroke="#f3f1ea" stroke-width="3"/><rect x="300" y="185" width="50" height="65" fill="#7a4b2a" stroke="#f3f1ea" stroke-width="3"/>`],
      [9.4, "8. Finitions", `<rect x="180" y="150" width="290" height="100" fill="#efe3c8" opacity=".55"/>`]
    ];
    let s = txt(20, 34, "Les grandes étapes d'une maison", { s: 18, w: 800, c: "#ffc420" });
    s += `<rect x="0" y="300" width="640" height="60" fill="url(#gTerre)"/>`;
    etapes.forEach(([t, nom, forme], i) => {
      s += `<g opacity="0">${apparait(t, C)}${forme}</g>`;
      s += `<g opacity="0">${apparait(t, C)}${txt(500, 70 + i * 32, nom, { s: 13, c: i === etapes.length - 1 ? "#3cc47c" : "#f3f1ea" })}</g>`;
    });
    s += `<g opacity="0">${apparait(10.8, C)}${txt(325, 340, "🔑 Réception des travaux", { s: 16, a: "middle", c: "#ffc420" })}</g>`;
    I["maison-etapes"] = { titre: "Construire une maison, dans l'ordre", legende: "Terrassement, fondations, soubassement et dalle, murs, plancher, charpente et couverture (hors d'eau), menuiseries (hors d'air), puis réseaux, isolation, finitions et réception.", svg: cadre(s) };
  })();

  /* ---------- Coupe de fondation ---------- */
  I.fondations = {
    titre: "Coupe d'une fondation de maison",
    legende: "La semelle repose sous la profondeur hors gel, sur un béton de propreté. Le mur de soubassement monte jusqu'au dallage, posé sur un hérisson et un film polyane.",
    svg: cadre(`
      ${txt(20, 34, "Fondation, soubassement et dallage", { s: 18, w: 800, c: "#ffc420" })}
      <rect x="0" y="130" width="640" height="230" fill="url(#gTerre)"/>
      <line x1="0" y1="250" x2="640" y2="250" stroke="#4fb3ff" stroke-width="2" stroke-dasharray="8 6"/>${txt(470, 244, "Profondeur hors gel", { s: 12, c: "#9fd3ff" })}
      <g opacity="0">${apparait(0.4, 10)}<rect x="90" y="300" width="200" height="8" fill="#7d838b"/>${txt(300, 312, "Béton de propreté", { s: 12 })}</g>
      <g opacity="0">${apparait(1.5, 10)}<rect x="100" y="262" width="180" height="38" fill="url(#gBeton)"/>${[130, 170, 210, 250].map((x) => `<circle cx="${x}" cy="290" r="5" fill="url(#gAcier)"/>`).join("")}${txt(300, 284, "Semelle filante armée", { s: 12 })}</g>
      <g opacity="0">${apparait(2.8, 10)}<rect x="160" y="140" width="60" height="122" fill="#a7adb4" stroke="#6f757c"/>${[0, 1, 2, 3, 4].map((i) => `<line x1="160" y1="${160 + i * 22}" x2="220" y2="${160 + i * 22}" stroke="#6f757c"/>`).join("")}${txt(40, 200, "Mur de soubassement", { s: 12 })}</g>
      <g opacity="0">${apparait(4.1, 10)}<rect x="220" y="118" width="400" height="22" fill="#8c7a5b"/>${txt(470, 112, "Hérisson (cailloux)", { s: 12 })}</g>
      <g opacity="0">${apparait(5.2, 10)}<rect x="220" y="114" width="400" height="4" fill="#4fb3ff"/>${txt(470, 98, "Polyane + isolant", { s: 12, c: "#9fd3ff" })}</g>
      <g opacity="0">${apparait(6.3, 10)}<rect x="160" y="96" width="460" height="18" fill="url(#gBeton)"/>${txt(470, 82, "Dallage béton armé", { s: 12 })}</g>
      <g opacity="0">${apparait(7.4, 10)}<rect x="160" y="40" width="60" height="56" fill="#cfd3d8" stroke="#8d939b"/>${txt(40, 70, "Mur (élévation)", { s: 12 })}</g>`)
  };

  /* ---------- Puits busé ---------- */
  I.puits = {
    titre: "Un puits busé",
    legende: "On creuse à l'intérieur de la buse, qui descend par son propre poids (le havage), puis on en ajoute une autre par-dessus. On s'arrête dans la nappe ; une margelle et un couvercle protègent l'ouverture.",
    svg: cadre(`
      ${txt(20, 34, "Coupe d'un puits busé", { s: 18, w: 800, c: "#ffc420" })}
      <rect x="0" y="90" width="640" height="270" fill="url(#gTerre)"/>
      <rect x="0" y="270" width="640" height="90" fill="#1e88e5" opacity=".35"/>${txt(450, 300, "Nappe d'eau", { s: 14, c: "#9fd3ff" })}
      <rect x="260" y="90" width="120" height="250" fill="#2a1f15"/>
      <g><animateTransform attributeName="transform" type="translate" values="0,-60;0,0;0,0" keyTimes="0;.5;1" dur="6s" repeatCount="indefinite"/>
        ${[0, 1, 2, 3].map((i) => `<rect x="252" y="${110 + i * 60}" width="14" height="56" fill="url(#gBeton)"/><rect x="374" y="${110 + i * 60}" width="14" height="56" fill="url(#gBeton)"/>`).join("")}
      </g>
      <rect x="240" y="74" width="160" height="16" fill="#9aa1a9"/><rect x="236" y="62" width="168" height="10" rx="4" fill="#6f757c"/>
      ${txt(410, 72, "Margelle + couvercle", { s: 13 })}
      <rect x="296" y="300" width="48" height="26" rx="6" fill="#3cc47c"/>${txt(300, 352, "Pompe", { s: 12 })}
      <line x1="320" y1="300" x2="320" y2="60" stroke="#f3f1ea" stroke-width="3"/>
      ${txt(30, 150, "Buses béton", { s: 13 })}${fleche(110, 150, 248, 160)}
      ${txt(30, 236, "Treuil + harnais,", { s: 12 })}${txt(30, 252, "détecteur de gaz,", { s: 12 })}${txt(30, 268, "jamais seul", { s: 12, c: "#ffb3ad" })}`)
  };

  /* ---------- Forage ---------- */
  I.forage = {
    titre: "Un forage d'eau",
    legende: "Un tube plein descend jusqu'à la nappe, puis une crépine (tube fendu) laisse entrer l'eau. Autour : du gravier filtrant, et en tête une cimentation qui empêche les eaux de surface de polluer la nappe.",
    svg: cadre(`
      ${txt(20, 34, "Coupe d'un forage", { s: 18, w: 800, c: "#ffc420" })}
      <rect x="0" y="80" width="640" height="280" fill="url(#gTerre)"/>
      <rect x="0" y="230" width="640" height="130" fill="#1e88e5" opacity=".35"/>${txt(470, 260, "Nappe", { s: 14, c: "#9fd3ff" })}
      <rect x="290" y="80" width="60" height="270" fill="#9b9384"/>
      <rect x="290" y="80" width="60" height="40" fill="#7d838b"/>${txt(360, 104, "Cimentation de tête", { s: 12 })}
      <rect x="306" y="70" width="28" height="160" fill="#e8e8e8"/>
      <rect x="306" y="230" width="28" height="110" fill="#e8e8e8"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<line x1="309" y1="${238 + i * 11}" x2="331" y2="${238 + i * 11}" stroke="#555" stroke-width="2"/>`).join("")}
      <rect x="310" y="290" width="20" height="40" rx="5" fill="#3cc47c"/>
      ${[0, 1, 2].map((i) => `<circle cx="${270 - i * 14}" cy="${300 - i * 18}" r="4" fill="#9fd3ff"><animate attributeName="cx" values="${270 - i * 14};312" dur="2s" begin="${i * 0.6}s" repeatCount="indefinite"/></circle>`).join("")}
      ${txt(40, 170, "Tube plein (PVC)", { s: 13 })}${fleche(150, 166, 300, 166)}
      ${txt(40, 300, "Crépine + gravier", { s: 13 })}${txt(40, 318, "filtrant", { s: 13 })}
      ${txt(360, 320, "Pompe immergée", { s: 13 })}`)
  };

  /* ---------- Assainissement non collectif ---------- */
  I.anc = {
    titre: "Assainissement individuel",
    legende: "Les eaux usées de la maison vont dans une fosse toutes eaux (pré-traitement), puis dans un dispositif de traitement : tranchées d'épandage, filtre à sable ou micro-station. Le SPANC contrôle l'installation.",
    svg: cadre(`
      ${txt(20, 34, "Maison non raccordée au tout-à-l'égout", { s: 18, w: 800, c: "#ffc420" })}
      <rect x="0" y="200" width="640" height="160" fill="url(#gTerre)"/>
      <polygon points="30,200 30,120 80,90 130,120 130,200" fill="#cfd3d8" stroke="#8d939b" stroke-width="2"/>
      <line x1="130" y1="215" x2="210" y2="225" stroke="#8d6e63" stroke-width="8"/>
      <rect x="210" y="210" width="120" height="70" rx="12" fill="#7d838b" stroke="#5c6168" stroke-width="3"/>${txt(270, 250, "Fosse", { s: 13, a: "middle" })}${txt(270, 266, "toutes eaux", { s: 13, a: "middle" })}
      <line x1="330" y1="230" x2="380" y2="235" stroke="#8d6e63" stroke-width="8"/>
      ${[0, 1, 2, 3].map((i) => `<line x1="380" y1="${232 + i * 14}" x2="610" y2="${232 + i * 14}" stroke="#a1887f" stroke-width="6" stroke-dasharray="10 5"/>`).join("")}
      ${txt(420, 300, "Épandage (tuyaux dans du gravier)", { s: 13 })}
      <circle cx="160" cy="218" r="5" fill="#6d4c41"><animate attributeName="cx" values="135;600" dur="5s" repeatCount="indefinite"/><animate attributeName="cy" values="216;226;240;240" keyTimes="0;.15;.45;1" dur="5s" repeatCount="indefinite"/></circle>
      ${cote(130, 340, 380, 340)}${txt(200, 332, "≥ 5 m de la maison", { s: 12 })}
      ${txt(390, 120, "Puits ou captage d'eau :", { s: 13 })}${txt(390, 138, "au moins 35 m de l'épandage", { s: 13, c: "#ffb3ad" })}`)
  };

  /* ---------- Maçon : monter les angles, puis tirer au cordeau ---------- */
  (function () {
    const C = 12, bloc = (x, y, c) => `<rect x="${x}" y="${y}" width="48" height="22" rx="2" fill="${c || "#a7adb4"}" stroke="#6f757c" stroke-width="2"/>`;
    let s = txt(20, 34, "Monter un mur : les angles d'abord", { s: 18, w: 800, c: "#ffc420" });
    s += `<rect x="0" y="318" width="640" height="42" fill="url(#gBeton)"/>`;
    // angles montés en « escalier » (harpage)
    const angle = (x0, dir) => { let r = ""; for (let rang = 0; rang < 5; rang++) for (let k = 0; k < 4 - rang; k++) r += bloc(x0 + dir * (k * 50 + (rang % 2) * 25), 294 - rang * 24, "#c0c5cb"); return r; };
    s += `<g opacity="0">${apparait(0.4, C)}${angle(40, 1)}</g><g opacity="0">${apparait(1.4, C)}${angle(552, -1)}</g>`;
    s += `<g opacity="0">${apparait(1.4, C)}${txt(40, 120, "1. Les angles, d'aplomb et de niveau", { s: 13 })}</g>`;
    s += `<g opacity="0">${apparait(3, C)}<line x1="40" y1="294" x2="600" y2="294" stroke="#ff7a1a" stroke-width="2"/>${txt(200, 150, "2. Cordeau tendu d'angle à angle", { s: 13, c: "#ffb37a" })}</g>`;
    for (let k = 0; k < 3; k++) s += `<g opacity="0">${apparait(4.2 + k * 0.6, C)}${bloc(244 + k * 52, 294)}</g>`;
    s += `<g opacity="0">${apparait(7.2, C)}${txt(200, 180, "3. On remplit le rang en suivant le cordeau", { s: 13 })}${txt(200, 198, "joints de 1 cm environ, joints croisés au rang suivant", { s: 12, w: 600, c: "#a9aeb5" })}</g>`;
    I["mur-angles"] = { titre: "Le maçon monte les angles, puis tire au cordeau", legende: "On monte d'abord les deux angles en escalier, parfaitement d'aplomb et de niveau. Le cordeau tendu entre eux sert de guide pour remplir chaque rang.", svg: cadre(s) };
  })();

  /* ---------- Les couches d'un enduit ---------- */
  I.enduit = {
    titre: "Un enduit traditionnel en trois couches",
    legende: "Le gobetis accroche, le corps d'enduit dresse et imperméabilise, la finition donne l'aspect. Chaque couche est un peu moins dosée en ciment que la précédente.",
    svg: cadre(`
      ${txt(20, 34, "Coupe d'un enduit de façade", { s: 18, w: 800, c: "#ffc420" })}
      <rect x="60" y="60" width="160" height="280" fill="#a7adb4"/>${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="60" y1="${100 + i * 44}" x2="220" y2="${100 + i * 44}" stroke="#6f757c" stroke-width="2"/>`).join("")}
      ${txt(80, 360 - 8, "Mur (support)", { s: 12, c: "#1b1b1b" })}
      <g opacity="0">${apparait(0.6, 9)}<path d="M220,60 ${Array.from({ length: 28 }, (_, i) => `L${226 + (i % 2) * 6},${60 + i * 10}`).join(" ")} L220,340 Z" fill="#8d939b"/>${txt(330, 110, "1. Gobetis : accroche (projeté)", { s: 13 })}${fleche(325, 106, 232, 120)}</g>
      <g opacity="0">${apparait(2.4, 9)}<rect x="232" y="60" width="40" height="280" fill="#cfc6b4"/>${txt(330, 190, "2. Corps d'enduit : dresse, protège de l'eau", { s: 13 })}${fleche(325, 186, 262, 200)}</g>
      <g opacity="0">${apparait(4.2, 9)}<rect x="272" y="60" width="12" height="280" fill="#efe3c8"/>${txt(330, 270, "3. Finition : grattée, talochée, lissée…", { s: 13 })}${fleche(325, 266, 284, 280)}</g>
      <g opacity="0">${apparait(5.8, 9)}${txt(330, 320, "Ni au gel, ni en plein soleil, ni sous la pluie", { s: 13, c: "#ffb3ad" })}</g>`)
  };

  window.ILLUS = I;
  window.ILLUS_PERSO = perso;
  // Illustrations ajoutées aux modules déjà existants
  window.ILLUS_MODULES = {
    "manoeuvre/hauteur": ["echafaudage"],
    "chef-equipe/gros-oeuvre": ["ferraillage-cage", "banche"],
    "chef-equipe/implantation": ["chaises"],
    "chef-chantier/reseaux": ["reseaux"],
    "autocad/interface": ["autocad-ecran"],
    "autocad/coordonnees": ["autocad-coord"]
  };
})();
