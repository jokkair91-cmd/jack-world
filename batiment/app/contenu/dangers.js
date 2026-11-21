/* Chasse aux dangers : scènes de chantier dessinées avec des dangers cachés.
   Chaque danger = une zone cliquable (x, y, r) dans un dessin de 800 × 500. */
(function () {
  "use strict";
  const P = (x, y, o) => window.ILLUS_PERSO ? window.ILLUS_PERSO(x, y, o) : "";
  const fond = (ciel, sol, ySol) => `<rect width="800" height="500" fill="${ciel}"/><rect y="${ySol}" width="800" height="${500 - ySol}" fill="${sol}"/>`;

  const scenes = [
    {
      id: "facade", emoji: "🏗️", titre: "Façade et échafaudage",
      intro: "Un échafaudage devant un immeuble, une grue qui lève une palette. 5 dangers à trouver.",
      dessin: () => `${fond("#2d3b4b", "#5b4a36", 430)}
        <rect x="470" y="110" width="310" height="320" fill="#8d939b"/>
        ${[150, 230, 310].map((y) => [510, 590, 670].map((x) => `<rect x="${x}" y="${y}" width="50" height="50" fill="#3c4a59"/>`).join("")).join("")}
        <g stroke="#cfd3d8" stroke-width="6"><line x1="290" y1="110" x2="290" y2="430"/><line x1="370" y1="110" x2="370" y2="430"/><line x1="450" y1="110" x2="450" y2="430"/></g>
        ${[330, 230, 130].map((y) => `<rect x="284" y="${y}" width="172" height="9" fill="#b5823c"/>`).join("")}
        <g stroke="#ffc420" stroke-width="5"><line x1="290" y1="295" x2="450" y2="295"/><line x1="290" y1="312" x2="450" y2="312"/><line x1="290" y1="195" x2="450" y2="195"/><line x1="290" y1="212" x2="450" y2="212"/></g>
        <rect x="290" y="320" width="160" height="10" fill="#ff7a1a"/>
        ${P(370, 330)}
        ${P(320, 130, { casque: false, bras: "haut" })}
        <g transform="translate(432,204)"><path d="M0,0 h22 l-3,24 h-16 z" fill="#4fb3ff"/><rect x="2" y="-4" width="18" height="5" fill="#2b3440"/></g>
        <g stroke="#cfd3d8" stroke-width="5"><line x1="215" y1="430" x2="268" y2="334"/><line x1="235" y1="430" x2="288" y2="334"/>${[0, 1, 2, 3, 4].map((i) => `<line x1="${222 + i * 10.6}" y1="${417 - i * 19.2}" x2="${242 + i * 10.6}" y2="${417 - i * 19.2}"/>`).join("")}</g>
        <line x1="110" y1="0" x2="110" y2="180" stroke="#9aa1a9" stroke-width="3"/>
        <rect x="70" y="180" width="80" height="12" fill="#b5823c"/>${[0, 1, 2].map((i) => `<rect x="${74 + i * 25}" y="150" width="22" height="30" fill="#a7adb4" stroke="#6f757c"/>`).join("")}
        ${P(115, 430)}
        <rect x="600" y="390" width="30" height="40" rx="4" fill="#e53935"/><rect x="608" y="380" width="14" height="12" fill="#2b3440"/>`,
      dangers: [
        { x: 410, y: 100, r: 48, titre: "Plancher sans garde-corps", explication: "Le dernier niveau n'a ni lisse haute, ni lisse intermédiaire, ni plinthe. Une chute de 3 m ou plus peut tuer.", regle: "Tout plancher de travail en hauteur doit avoir un garde-corps complet (lisse à 1 m, lisse intermédiaire, plinthe)." },
        { x: 320, y: 32, r: 38, titre: "Ouvrier sans casque", explication: "En hauteur, sous une grue et à côté d'objets qui peuvent tomber, la tête n'est pas protégée.", regle: "Casque obligatoire sur le chantier, jugulaire attachée en hauteur." },
        { x: 443, y: 215, r: 34, titre: "Seau au bord, pas de plinthe", explication: "Ce seau peut tomber du 2ᵉ niveau sur quelqu'un : la plinthe manque à ce niveau.", regle: "Plinthe sur chaque plancher et matériel rangé loin du bord." },
        { x: 252, y: 370, r: 44, titre: "Échelle mal installée", explication: "L'échelle s'arrête au niveau du plancher : elle ne dépasse pas d'1 m pour se tenir en montant, et elle n'est pas attachée.", regle: "Une échelle d'accès dépasse d'environ 1 m le niveau d'arrivée et est fixée. L'accès par l'intérieur de l'échafaudage est préférable." },
        { x: 112, y: 300, r: 50, titre: "Ouvrier sous une charge suspendue", explication: "La palette est levée juste au-dessus de lui. Si une élingue lâche ou si un bloc tombe, il est écrasé.", regle: "On ne stationne jamais sous une charge levée : on s'écarte de sa trajectoire." }
      ]
    },
    {
      id: "tranchee", emoji: "🚜", titre: "Tranchée et engins",
      intro: "Une tranchée pour un réseau, une pelle, un camion qui recule. 5 dangers à trouver.",
      dessin: () => `${fond("#2d3b4b", "#7a5a3a", 300)}
        <rect y="300" width="800" height="12" fill="#3a3c40"/>
        <rect x="230" y="300" width="220" height="160" fill="#2a1f15"/>
        <polygon points="452,300 470,250 500,240 530,262 540,300" fill="#8a6440"/>
        ${P(340, 455, { bras: "avant" })}
        <circle cx="245" cy="370" r="13" fill="#fdd835" stroke="#1b1b1b" stroke-width="2"/><rect x="230" y="362" width="8" height="16" fill="#fdd835"/>
        <g transform="translate(600,0)">
          <rect x="0" y="230" width="150" height="55" rx="10" fill="#ffc420" stroke="#1b1b1b" stroke-width="3"/><rect x="-10" y="282" width="170" height="20" rx="8" fill="#2b3440"/>
          <rect x="20" y="190" width="50" height="44" rx="6" fill="#4fb3ff" opacity=".85" stroke="#1b1b1b" stroke-width="2"/>
          <line x1="10" y1="240" x2="-70" y2="160" stroke="#e0a800" stroke-width="16" stroke-linecap="round"/><line x1="-70" y1="160" x2="-110" y2="240" stroke="#e0a800" stroke-width="12" stroke-linecap="round"/>
          <path d="M-125,240 h30 l-5,22 h-22 z" fill="#7d838b"/>
        </g>
        ${P(778, 300)}
        <g><rect x="10" y="215" width="140" height="70" rx="6" fill="#d35400"/><rect x="10" y="190" width="45" height="40" rx="5" fill="#a04000"/><circle cx="40" cy="290" r="14" fill="#1b1b1b"/><circle cx="120" cy="290" r="14" fill="#1b1b1b"/></g>
        ${P(185, 300, { bras: "avant" })}
        <path d="M150,230 q10,-8 20,0" stroke="#ffc420" stroke-width="3" fill="none"/>`,
      dangers: [
        { x: 340, y: 390, r: 55, titre: "Tranchée profonde non blindée", explication: "La tranchée dépasse largement 1,30 m et ses parois ne sont pas blindées : l'ouvrier peut être enseveli.", regle: "Au-delà de 1,30 m de profondeur : blindage (caissons, panneaux) ou talutage." },
        { x: 495, y: 272, r: 42, titre: "Déblais au bord de la tranchée", explication: "Le tas de terre charge la paroi et peut s'effondrer ou rouler dans la fouille.", regle: "Déblais posés à distance du bord, avec une bande libre." },
        { x: 245, y: 370, r: 34, titre: "Conduite de gaz à nu près du godet", explication: "Une conduite jaune (gaz) apparaît dans la paroi et le godet travaille à côté. Une fuite peut provoquer une explosion.", regle: "DT-DICT, repérage, terrassement manuel près des réseaux sensibles ; si un réseau imprévu apparaît, on arrête." },
        { x: 776, y: 248, r: 40, titre: "Piéton dans l'angle mort de la pelle", explication: "Il marche derrière l'engin, là où le conducteur ne le voit pas.", regle: "Pas de piéton dans la zone d'évolution sans contact visuel avec le conducteur." },
        { x: 175, y: 250, r: 42, titre: "Personne derrière un camion qui recule", explication: "Le camion recule vers lui sans guide visible : il risque d'être écrasé contre le talus.", regle: "Manœuvre de recul avec un guide visible ; personne ne se tient derrière un véhicule qui recule." }
      ]
    },
    {
      id: "interieur", emoji: "🔌", titre: "Second œuvre en intérieur",
      intro: "Un étage en travaux : découpe, électricité, stockage. 5 dangers à trouver.",
      dessin: () => `${fond("#3a4048", "#6f757c", 400)}
        <rect y="60" width="800" height="12" fill="#2c3137"/>
        <polygon points="110,440 250,440 230,410 130,410" fill="#111"/>
        ${P(330, 400, { bras: "avant" })}
        <rect x="355" y="320" width="34" height="12" rx="4" fill="#4fb3ff"/><circle cx="392" cy="326" r="10" fill="#cfd3d8"/>
        ${[0, 1, 2, 3, 4].map((i) => `<line x1="396" y1="330" x2="${420 + i * 8}" y2="${300 + i * 12}" stroke="#ffc420" stroke-width="2"/>`).join("")}
        <ellipse cx="560" cy="452" rx="80" ry="16" fill="#4fb3ff" opacity=".5"/>
        <path d="M420,470 C480,480 520,440 560,452 S640,470 700,420" stroke="#1b1b1b" stroke-width="5" fill="none"/>
        <rect x="548" y="444" width="26" height="16" rx="3" fill="#f3f1ea"/>
        <rect x="470" y="370" width="40" height="32" rx="4" fill="#2b3440"/>
        ${P(490, 370, { bras: "haut" })}
        <g transform="rotate(-8 700 400)">${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${660 + (i % 2) * 8}" y="${360 - i * 34}" width="90" height="32" fill="#b5823c" stroke="#7a5a3a" stroke-width="2"/>`).join("")}</g>
        <rect x="40" y="330" width="22" height="60" rx="8" fill="#e53935"/><rect x="45" y="318" width="12" height="14" fill="#2b3440"/>`,
      dangers: [
        { x: 180, y: 425, r: 50, titre: "Trémie non protégée", explication: "Un trou dans le plancher sans garde-corps ni couvercle fixé : on peut tomber à l'étage du dessous.", regle: "Une trémie est protégée par un garde-corps ou un platelage fixé et signalé." },
        { x: 360, y: 300, r: 45, titre: "Meulage sans lunettes ni carter", explication: "Les étincelles et éclats partent vers son visage : il ne porte pas de lunettes et la meuleuse n'a pas de carter.", regle: "Carter en place, lunettes ou visière, gants et protection auditive pour meuler." },
        { x: 560, y: 452, r: 42, titre: "Rallonge dans une flaque d'eau", explication: "La prise de la rallonge est posée dans l'eau : risque d'électrocution.", regle: "Câbles et connexions hors de l'eau, matériel en bon état, tableau de chantier avec différentiel 30 mA." },
        { x: 490, y: 300, r: 48, titre: "Travail debout sur un seau retourné", explication: "Il est monté sur un seau instable pour atteindre le plafond : la chute est presque certaine.", regle: "Pour travailler en hauteur : plate-forme individuelle roulante (PIRL) ou escabeau adapté, jamais un seau ou une chaise." },
        { x: 705, y: 290, r: 52, titre: "Pile de matériaux instable", explication: "Les colis sont empilés trop haut et penchent : ils peuvent s'effondrer sur quelqu'un.", regle: "Stockage stable, à hauteur raisonnable, sur un sol plan, les charges lourdes en bas." }
      ]
    }
  ];
  window.DANGERS = { scenes };
})();
