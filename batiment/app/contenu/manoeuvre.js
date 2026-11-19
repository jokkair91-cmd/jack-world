/* Parcours 1 — Manœuvre (ouvrier du bâtiment) */
window.METIERS = window.METIERS || [];
window.METIERS.push({
  id: "manoeuvre", nom: "Manœuvre", emoji: "🧱", marche: 1,
  resume: "Le point de départ : sécurité, outils, matériaux, gestes de base.",
  role: "Le **manœuvre** (ou ouvrier d'exécution) aide les compagnons et l'équipe : il approvisionne le poste, prépare les matériaux, nettoie, manutentionne et réalise des tâches simples. C'est le métier où l'on apprend le chantier « par les pieds » : la sécurité, l'ordre, les outils et les matériaux.",
  missions: [
    "Approvisionner les postes de travail (parpaings, mortier, bois, ferraillage…)",
    "Préparer le mortier et le béton à la bétonnière selon le dosage donné",
    "Charger, décharger, stocker les matériaux sans les abîmer",
    "Aider au coffrage, au décoffrage et au nettoyage des banches",
    "Tenir le chantier propre et trier les déchets",
    "Respecter les consignes de sécurité et signaler tout danger"
  ],
  acces: "accessible sans diplôme ; un CAP (maçon, constructeur en béton armé…) fait évoluer vers ouvrier qualifié puis chef d'équipe.",
  modules: [
    {
      id: "securite", emoji: "🦺", titre: "Sécurité de base et EPI", duree: "20 min",
      intro: "Ce qu'on porte, ce qu'on regarde et ce qu'on fait quand ça tourne mal.",
      sections: [
        { titre: "Les équipements de protection individuelle (EPI)", texte: [
          "Les EPI sont fournis gratuitement par l'employeur. Les porter est une obligation, pas une option : ils protègent de ce qui reste comme risque quand les protections collectives ne suffisent pas."],
          liste: [
            "**Casque** : obligatoire dès qu'il y a un risque de chute d'objets ou de choc à la tête (c'est-à-dire presque partout sur un chantier). Jugulaire attachée quand on travaille en hauteur.",
            "**Chaussures de sécurité** : coque contre l'écrasement, semelle anti-perforation (clous, ferraille).",
            "**Gants** adaptés : manutention, ciment (le ciment frais brûle la peau), produits chimiques, coupure.",
            "**Gilet ou vêtement haute visibilité** près des engins et de la circulation.",
            "**Lunettes** : meulage, perçage au plafond, décapage, projection de laitance.",
            "**Protections auditives** : bouchons ou casque antibruit près des engins, du marteau-piqueur, de la scie.",
            "**Masque** contre les poussières (découpe, ponçage, silice) : celui qui est indiqué sur la notice de poste."
          ] },
        { titre: "Protection collective d'abord", texte: [
          "La règle de prévention est simple : on supprime le danger si on peut, sinon on protège **tout le monde** (garde-corps, filets, balisage, aspiration des poussières), et seulement ensuite chacun avec ses EPI.",
          "Un garde-corps enlevé « juste pour passer » doit être remis immédiatement. Si tu ne peux pas le remettre, tu préviens ton chef et tu balises."] },
        { titre: "Quand il y a un accident", liste: [
          "**Protéger** : éviter le sur-accident (couper la machine, baliser, ne pas te mettre en danger).",
          "**Examiner** la victime : parle-t-elle ? respire-t-elle ? saigne-t-elle ?",
          "**Alerter** ou faire alerter : **15** (SAMU), **18** (pompiers), **112** (numéro d'urgence européen). Donner l'adresse exacte du chantier et l'accès.",
          "**Secourir** selon ce que tu sais faire, en attendant le sauveteur secouriste du travail (SST) ou les secours.",
          "Prévenir ton chef : tout accident, même léger, doit être signalé."
        ] }
      ],
      danger: "Si tu te trouves face à un danger grave et imminent pour ta vie ou ta santé, tu as un **droit d'alerte et de retrait** : tu préviens immédiatement ton responsable et tu te mets à l'abri, sans créer de danger pour les autres.",
      retenir: [
        "Casque + chaussures de sécurité en permanence sur le chantier, les autres EPI selon la tâche.",
        "Protection collective avant protection individuelle.",
        "Accident : Protéger, Examiner, Alerter (15, 18, 112), Secourir.",
        "On signale tout : un presque-accident d'aujourd'hui est l'accident de demain."
      ],
      terrain: "Le matin, avant d'attaquer, fais le tour de ton poste : garde-corps en place ? trémies fermées ? passage dégagé ? câbles électriques en bon état ? Une minute de regard évite des semaines d'arrêt.",
      quiz: [
        { q: "Qui fournit les EPI ?", choix: ["L'employeur, gratuitement", "Le salarié, à ses frais", "Le maître d'ouvrage"], ok: 0, pourquoi: "Les EPI sont fournis et entretenus par l'employeur, sans frais pour le salarié." },
        { q: "Quel est l'ordre de la prévention ?", choix: ["Supprimer le danger, protection collective, puis EPI", "EPI d'abord, puis le reste", "Seulement les EPI"], ok: 0, pourquoi: "On supprime le danger si possible, sinon on protège collectivement ; les EPI viennent en complément." },
        { q: "Pourquoi porter des gants avec le ciment frais ?", choix: ["Il peut brûler la peau (il est très basique)", "Pour ne pas salir les mains", "Ce n'est pas utile"], ok: 0, pourquoi: "Le ciment humide est très alcalin : il provoque des brûlures et des allergies (eczéma du ciment)." },
        { q: "Quel numéro d'urgence européen fonctionne partout ?", choix: ["Le 112", "Le 17", "Le 3919"], ok: 0, pourquoi: "Le 112 est le numéro d'urgence européen ; en France on peut aussi appeler le 15 (SAMU) ou le 18 (pompiers)." },
        { q: "Un collègue enlève un garde-corps pour passer une palette. Que fais-tu ?", choix: ["Je m'assure qu'il est remis tout de suite, sinon je balise et je préviens le chef", "Rien, c'est son problème", "Je le laisse enlevé pour la prochaine palette"], ok: 0, pourquoi: "Un vide non protégé est l'une des premières causes d'accidents graves dans le BTP." }
      ]
    },
    {
      id: "hauteur", emoji: "🪜", titre: "Travail en hauteur : échelles, escabeaux, échafaudages", duree: "20 min",
      intro: "Les chutes de hauteur restent l'une des premières causes d'accidents graves et mortels dans le BTP.",
      sections: [
        { titre: "Les bonnes protections", texte: [
          "On travaille en priorité depuis un plan de travail protégé : **échafaudage**, **plateforme individuelle roulante (PIR)**, **nacelle** (PEMP) ou plancher avec **garde-corps**.",
          "Un garde-corps comprend une **lisse haute** (main courante), une **lisse intermédiaire** et une **plinthe** (pour que les outils ne tombent pas)."] },
        { titre: "L'échelle n'est pas un poste de travail", texte: [
          "L'échelle sert d'abord à **accéder**. On ne l'utilise comme poste de travail que si on ne peut pas faire autrement, pour des travaux courts et légers."],
          liste: [
            "Échelle en bon état, posée sur un sol stable, calée, et qui dépasse d'environ 1 m le niveau d'arrivée.",
            "Toujours trois points d'appui (deux mains + un pied, ou deux pieds + une main).",
            "Pas de charge lourde portée en montant.",
            "Escabeau : on ne monte pas sur les dernières marches s'il n'y a pas de garde-corps sur la plateforme."
          ] },
        { titre: "Échafaudages", liste: [
          "Un échafaudage est **monté, modifié et démonté par des personnes formées**, selon la notice du fabricant.",
          "Il est **vérifié avant sa mise en service** puis régulièrement (état de conservation). Une fiche ou un panneau indique qu'il est réceptionné.",
          "Tu ne modifies jamais un échafaudage toi-même (enlever une diagonale, un plancher, un garde-corps…).",
          "Échafaudage roulant : roues **bloquées** avant de monter, **personne dessus** pendant qu'on le déplace."
        ] }
      ],
      danger: "Trémie (trou dans un plancher) non protégée = danger mortel. On la ferme par un garde-corps ou un platelage solide et fixé, jamais par une simple planche posée ou une bâche.",
      retenir: [
        "Protection collective (échafaudage, garde-corps, PIR, nacelle) avant l'échelle.",
        "Garde-corps = lisse haute + lisse intermédiaire + plinthe.",
        "Échafaudage : monté par des personnes formées, vérifié, jamais modifié par toi.",
        "Roulant : roues bloquées, personne dessus pendant le déplacement."
      ],
      terrain: "Si l'échafaudage n'a pas de panneau de réception ou s'il manque un plancher, ne monte pas : préviens ton chef d'équipe. Monter « vite fait » sur une échelle mal calée, c'est le scénario classique de la chute.",
      quiz: [
        { q: "Une échelle peut-elle servir de poste de travail ?", choix: ["Seulement si on ne peut pas faire autrement, pour des travaux courts et légers", "Oui, toujours", "Non, jamais, même pour y monter"], ok: 0, pourquoi: "L'échelle sert à accéder ; comme poste de travail, c'est l'exception." },
        { q: "Un garde-corps complet comprend…", choix: ["Lisse haute, lisse intermédiaire et plinthe", "Une simple rubalise", "Une lisse haute seulement"], ok: 0, pourquoi: "La plinthe empêche la chute d'objets, la lisse intermédiaire empêche de passer dessous." },
        { q: "Qui peut monter ou modifier un échafaudage ?", choix: ["Des personnes formées, selon la notice", "N'importe quel ouvrier", "Le client"], ok: 0, pourquoi: "Le montage, la modification et le démontage sont réservés à du personnel formé." },
        { q: "Avant de monter sur un échafaudage roulant…", choix: ["Je bloque les roues", "Je le pousse pour vérifier qu'il roule", "Je demande à un collègue de le tenir"], ok: 0, pourquoi: "Roues freinées obligatoirement, et personne dessus pendant un déplacement." },
        { q: "Comment protéger une trémie ?", choix: ["Garde-corps ou platelage solide et fixé", "Une bâche par-dessus", "Un panneau « attention »"], ok: 0, pourquoi: "Une bâche ou un panneau n'empêche pas de tomber : il faut une protection résistante et fixée." }
      ]
    },
    {
      id: "manutention", emoji: "📦", titre: "Manutention, gestes et postures", duree: "15 min",
      intro: "Le dos est ton premier outil : il ne se remplace pas.",
      sections: [
        { titre: "Avant de porter", liste: [
          "**Peut-on éviter de porter ?** Transpalette, diable, brouette, chariot, grue, mini-pelle, monte-matériaux : la mécanisation passe en premier.",
          "Estimer le poids (il est souvent écrit sur le sac ou la palette) et l'encombrement.",
          "Dégager le chemin : pas d'obstacle, sol non glissant, porte ouverte.",
          "Lourd ou encombrant ? On porte à deux, en se coordonnant (« on lève à trois… »)."
        ] },
        { titre: "Le bon geste", liste: [
          "Pieds écartés, un pied légèrement en avant, proche de la charge.",
          "Plier les jambes, **dos droit**, ce sont les cuisses qui travaillent.",
          "Charge **près du corps**, prise ferme avec les gants.",
          "Ne pas tourner le buste avec la charge : on tourne avec les pieds.",
          "Poser en pliant les jambes, jamais en se penchant en avant jambes tendues."
        ] },
        { titre: "Ce que dit la règle", texte: [
          "Le Code du travail impose à l'employeur d'organiser le travail pour **éviter le port manuel de charges lourdes** et, sinon, de fournir les moyens et la formation. Les seuils légaux existent, mais l'INRS recommande de rester bien en dessous : sur un chantier, dès que c'est lourd, on cherche un moyen mécanique."] }
      ],
      retenir: [
        "Mécaniser d'abord, porter ensuite.",
        "Dos droit, jambes fléchies, charge près du corps, on tourne avec les pieds.",
        "Lourd ou encombrant : à deux, avec un signal commun."
      ],
      terrain: "Fais approvisionner les palettes au plus près du poste avec l'engin (et pas au fond du terrain). Dix mètres de moins à pied, multipliés par 200 parpaings, c'est ton dos qui dit merci.",
      quiz: [
        { q: "Quelle est la première question avant de porter ?", choix: ["Peut-on le faire avec un moyen mécanique ?", "Qui est le plus fort ?", "Combien de temps ça va prendre ?"], ok: 0, pourquoi: "La prévention commence par supprimer ou réduire le port manuel." },
        { q: "Pour soulever une charge au sol…", choix: ["Je plie les jambes, dos droit, charge près du corps", "Je me penche jambes tendues", "Je tire d'un coup sec"], ok: 0, pourquoi: "Ce sont les cuisses qui doivent travailler, pas les lombaires." },
        { q: "Pour changer de direction avec une charge…", choix: ["Je tourne avec les pieds", "Je tourne le buste", "Je lance la charge"], ok: 0, pourquoi: "La torsion du buste sous charge est très dangereuse pour les disques vertébraux." },
        { q: "Une poutre longue et encombrante :", choix: ["On la porte à deux en se coordonnant", "Je la traîne seul", "Je la porte sur l'épaule en courant"], ok: 0, pourquoi: "À deux, avec un signal commun pour lever et poser ensemble." },
        { q: "Que recommande l'INRS sur le poids porté ?", choix: ["Rester bien en dessous des seuils légaux et mécaniser", "Porter le maximum autorisé", "Il n'y a aucune recommandation"], ok: 0, pourquoi: "Les seuils légaux ne sont pas un objectif : l'INRS recommande des charges nettement plus faibles." }
      ]
    },
    {
      id: "outils", emoji: "🔨", titre: "Outils, machines et électricité", duree: "20 min",
      intro: "Connaître ses outils, les vérifier, et savoir ce qu'on n'a pas le droit de conduire.",
      sections: [
        { titre: "Outils à main du manœuvre", liste: [
          "**Truelle, auge, seau, taloche, platoir** : mortier et enduits.",
          "**Niveau à bulle, règle de maçon, mètre, cordeau** : contrôler l'aplomb, le niveau, l'alignement.",
          "**Masse, massette, burin, pince, marteau de coffreur, pied-de-biche** : coffrage et démolition légère.",
          "**Pelle, pioche, brouette, râteau** : terrassement léger et approvisionnement."
        ] },
        { titre: "Machines électroportatives", liste: [
          "Vérifier avant usage : câble et prise intacts, carter de protection en place, disque adapté et pas fendu.",
          "**Disqueuse** : lunettes + protections auditives + gants, carter toujours en place, ne jamais forcer ni bloquer le disque.",
          "**Perforateur, scie circulaire, scie sur table** : pièce bien tenue, mains loin de la lame.",
          "Débrancher avant de changer un disque, un foret ou une lame."
        ] },
        { titre: "Électricité de chantier", texte: [
          "Le chantier est alimenté par un **coffret de chantier** avec protections différentielles. Rallonges en bon état, déroulées complètement, pas dans l'eau, pas écrasées par les engins.",
          "Pour intervenir à proximité d'installations électriques, il faut une **habilitation électrique** adaptée (par exemple B0 pour les non-électriciens qui travaillent à proximité). Sans habilitation, on ne touche pas aux armoires ni aux câbles dénudés."] },
        { titre: "Engins : conduite autorisée seulement", texte: [
          "Mini-pelle, chargeuse, chariot télescopique, nacelle, grue : il faut une **autorisation de conduite** délivrée par l'employeur, généralement appuyée par un **CACES** (R482 pour les engins de chantier, R486 pour les nacelles, R489 pour les chariots, R487 pour les grues à tour…).",
          "Près d'un engin : se faire voir du conducteur, ne jamais passer dans son rayon d'action ni sous une charge levée."] }
      ],
      danger: "Ne jamais passer ou stationner sous une charge suspendue (grue, palonnier, élingues). Si la charge tombe, il n'y a pas de deuxième chance.",
      retenir: [
        "On vérifie l'outil avant de s'en servir ; un outil abîmé est mis de côté et signalé.",
        "Disqueuse : carter en place, lunettes, bouchons, gants.",
        "Pas d'habilitation électrique : on ne touche pas aux armoires.",
        "Pas d'autorisation de conduite : on ne monte pas sur l'engin, même pour « juste le déplacer »."
      ],
      terrain: "Range les outils à la fin de la journée dans le container ou la caisse : un outil qui traîne est un outil volé, cassé ou sur lequel quelqu'un va se tordre la cheville.",
      quiz: [
        { q: "Avant de changer le disque d'une disqueuse…", choix: ["Je la débranche (ou j'enlève la batterie)", "Je l'arrête avec la gâchette", "Je la pose disque en l'air"], ok: 0, pourquoi: "Un démarrage accidentel pendant le changement de disque provoque de graves coupures." },
        { q: "Pour conduire une mini-pelle sur le chantier, il faut…", choix: ["Une autorisation de conduite de l'employeur (en général avec un CACES)", "Juste savoir conduire une voiture", "L'accord oral d'un collègue"], ok: 0, pourquoi: "La conduite d'engins est soumise à autorisation de l'employeur, après formation et visite médicale." },
        { q: "Le CACES pour les engins de chantier relève de la recommandation…", choix: ["R482", "R489", "R486"], ok: 0, pourquoi: "R482 : engins de chantier ; R489 : chariots ; R486 : nacelles (PEMP)." },
        { q: "Une rallonge électrique abîmée…", choix: ["Je la mets de côté et je la signale", "Je fais un tour de chatterton", "Je continue avec"], ok: 0, pourquoi: "Un câble endommagé expose à l'électrocution ; il doit être retiré et réparé ou remplacé." },
        { q: "Peut-on passer sous une charge levée par la grue ?", choix: ["Non, jamais", "Oui si on va vite", "Oui avec un casque"], ok: 0, pourquoi: "Le casque ne protège pas d'une charge de plusieurs centaines de kilos." }
      ]
    },
    {
      id: "materiaux", emoji: "🪨", titre: "Matériaux, mortier et béton", duree: "25 min",
      intro: "Savoir ce qu'on manipule et préparer un mortier ou un béton propre.",
      sections: [
        { titre: "Les matériaux de base", liste: [
          "**Ciment** : liant (en sacs ou en vrac). Il craint l'humidité : stockage au sec, sur palette, bâché.",
          "**Sable** : granulat fin (0/4 par exemple). **Gravier / gravillons** : granulats plus gros pour le béton.",
          "**Chaux** : liant pour enduits et maçonneries anciennes.",
          "**Parpaings (blocs béton), briques, blocs de béton cellulaire** : éléments de maçonnerie.",
          "**Acier** : barres HA (haute adhérence), treillis soudés, armatures façonnées.",
          "**Bois** : planches, bastaings, contreplaqué de coffrage, étais."
        ] },
        { titre: "Mortier ou béton ?", texte: [
          "**Mortier** = ciment (ou chaux) + sable + eau. Sert à poser les blocs, faire les joints, les enduits, les chapes.",
          "**Béton** = ciment + sable + gravier + eau. Il résiste en compression ; avec des aciers, on obtient du **béton armé** (dalles, poteaux, poutres, voiles).",
          "Les dosages et les proportions sont fixés par le chef d'équipe, le CCTP ou la fiche technique. On ne « rallonge » jamais un mélange avec de l'eau pour qu'il soit plus facile à mettre en œuvre : trop d'eau = béton moins résistant."] },
        { titre: "À la bétonnière", liste: [
          "Mettre un peu d'eau, puis les granulats et le ciment dans l'ordre et les proportions demandés, puis compléter l'eau petit à petit.",
          "Mesurer avec le même seau ou la même pelle (« à la pelle » c'est approximatif ; au seau, c'est plus régulier).",
          "Mélanger jusqu'à une couleur et une consistance homogènes.",
          "Ne jamais mettre la main ou la pelle dans la cuve en rotation. Nettoyer la bétonnière en fin de poste."
        ] },
        { titre: "Après le coulage", texte: [
          "Le béton a besoin d'eau pour durcir : par temps chaud, sec ou venteux, on le protège de la dessiccation (arrosage, film, produit de cure) : c'est la **cure**. Par temps de gel, on suit les consignes (protection, adjuvants, report du coulage)."] }
      ],
      retenir: [
        "Mortier = liant + sable + eau ; béton = liant + sable + gravier + eau.",
        "Ciment stocké au sec, sur palette.",
        "On respecte le dosage : trop d'eau affaiblit le béton.",
        "Le béton frais se protège (cure) contre le soleil, le vent et le gel."
      ],
      terrain: "Note sur un bout de contreplaqué près de la bétonnière la recette donnée par ton chef (nombre de seaux de sable, de gravier, de ciment). Tout le monde fait pareil, le béton est régulier.",
      quiz: [
        { q: "Quelle est la différence entre mortier et béton ?", choix: ["Le béton contient du gravier en plus", "Le mortier contient de l'acier", "Il n'y en a aucune"], ok: 0, pourquoi: "Mortier : liant + sable + eau. Béton : on ajoute des gravillons (gros granulats)." },
        { q: "Le béton est trop ferme pour être coulé facilement. Que faire ?", choix: ["Demander au chef ; ne pas rajouter d'eau de soi-même", "Rajouter un seau d'eau", "Rajouter du sable"], ok: 0, pourquoi: "L'eau en trop réduit la résistance et augmente le retrait ; la consistance se règle par la formulation ou un adjuvant prévu." },
        { q: "Comment stocker les sacs de ciment ?", choix: ["Au sec, sur palette, bâchés", "Directement sur la terre", "Sous la pluie, ce n'est pas grave"], ok: 0, pourquoi: "Le ciment prend avec l'humidité : un sac mouillé est perdu." },
        { q: "Qu'est-ce que la cure du béton ?", choix: ["Le protéger pour qu'il ne sèche pas trop vite", "Le vibrer", "Le peindre"], ok: 0, pourquoi: "Le béton durcit par réaction avec l'eau : s'il sèche trop vite, il fissure et perd de la résistance." },
        { q: "Avec quoi arme-t-on le béton ?", choix: ["Des aciers (barres HA, treillis soudés)", "Du bois", "Du plâtre"], ok: 0, pourquoi: "Le béton résiste bien à la compression ; l'acier reprend la traction : c'est le béton armé." }
      ]
    },
    {
      id: "chantier-propre", emoji: "♻️", titre: "Organisation, propreté et déchets", duree: "15 min",
      intro: "Un chantier rangé est un chantier plus sûr et plus rapide.",
      sections: [
        { titre: "Ordre et circulation", liste: [
          "Les **circulations** (piétons, engins) restent dégagées et balisées.",
          "Les matériaux sont stockés à l'endroit prévu, stables (palettes pas empilées n'importe comment), loin des bords de fouille et des trémies.",
          "Les chutes, clous et ferrailles qui dépassent sont ramassés ou protégés (embouts sur les attentes d'acier)."
        ] },
        { titre: "Tri des déchets", texte: [
          "Les déchets de chantier sont triés dans les bennes prévues : inertes (gravats, béton, terres), bois, métaux, plâtre, déchets non dangereux en mélange, et **déchets dangereux** à part (pots de produits, solvants, huiles, amiante géré par une entreprise spécialisée).",
          "Un bon tri coûte moins cher à l'entreprise et c'est une obligation réglementaire."] },
        { titre: "La journée type", liste: [
          "Arrivée : consignes du chef, EPI, tour du poste.",
          "Pendant : approvisionner avant que le compagnon ne manque de rien, anticiper la suite.",
          "Fin de journée : ranger, nettoyer les outils et la bétonnière, fermer le chantier, signaler ce qui manque ou ce qui est cassé."
        ] }
      ],
      retenir: [
        "Circulations dégagées, stockage stable et loin des vides.",
        "Trier les déchets : inertes, bois, métaux, plâtre, DIB, dangereux à part.",
        "Le bon manœuvre anticipe : le compagnon ne doit jamais attendre."
      ],
      terrain: "Demande chaque matin à ton chef d'équipe « qu'est-ce qu'on fait aujourd'hui et de quoi vous allez avoir besoin ? ». C'est la question qui fait passer de manœuvre à futur chef d'équipe.",
      quiz: [
        { q: "Où stocker les palettes de parpaings ?", choix: ["À l'endroit prévu, stables et loin des bords de fouille", "Au bord de la fouille pour aller plus vite", "Dans la circulation des engins"], ok: 0, pourquoi: "Une charge près d'un bord peut provoquer un éboulement ou tomber dans le vide." },
        { q: "Un pot de solvant vide va…", choix: ["Dans les déchets dangereux", "Dans la benne à gravats", "Dans la benne bois"], ok: 0, pourquoi: "Les emballages souillés par des produits dangereux suivent la filière des déchets dangereux." },
        { q: "Pourquoi trier les déchets ?", choix: ["C'est obligatoire et ça coûte moins cher", "Pour faire joli", "Ça ne sert à rien"], ok: 0, pourquoi: "Le tri à la source est une obligation et réduit le coût d'évacuation." },
        { q: "Des attentes d'acier dépassent du sol. Que faire ?", choix: ["Les protéger avec des embouts (champignons)", "Rien", "Les tordre au marteau"], ok: 0, pourquoi: "Les embouts évitent les blessures graves en cas de chute sur les aciers." },
        { q: "Le meilleur réflexe du manœuvre ?", choix: ["Anticiper les besoins du compagnon", "Attendre qu'on l'appelle", "Faire une pause dès que possible"], ok: 0, pourquoi: "Anticiper l'approvisionnement fait gagner du temps à toute l'équipe." }
      ]
    }
  ]
});
