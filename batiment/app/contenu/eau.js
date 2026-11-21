/* Spécialité — L'eau : puits, forage, assainissement, eau de pluie */
window.SPECIALITES = window.SPECIALITES || [];
window.SPECIALITES.push({
  id: "eau", nom: "L'eau : puits, forage, assainissement", emoji: "💧",
  resume: "Creuser un puits, faire un forage, assainir une maison, récupérer l'eau de pluie.",
  role: "L'eau arrive dans une maison par le **réseau public**, un **puits**, un **forage** ou la **récupération d'eau de pluie**, et elle repart par le **tout-à-l'égout** ou un **assainissement individuel**. Ces travaux touchent à la santé (eau potable, pollution) et à la sécurité (creuser profond) : ils sont encadrés par des règles et des déclarations.",
  missions: [
    "Connaître les sources d'eau d'une maison et les déclarations à faire",
    "Comprendre comment se creuse un puits busé, en sécurité",
    "Comprendre les étapes d'un forage d'eau",
    "Connaître l'assainissement individuel et la récupération d'eau de pluie"
  ],
  acces: "Puits et forages sont réalisés par des entreprises spécialisées (puisatiers, foreurs) ; l'assainissement individuel par des terrassiers et canalisateurs. Ce parcours donne la culture générale pour comprendre et suivre ces travaux.",
  modules: [
    {
      id: "sources", emoji: "🚰", titre: "D'où vient l'eau d'une maison ?", duree: "15 min",
      intro: "Réseau public, puits, forage, eau de pluie : avantages, limites et règles.",
      sections: [
        { titre: "Les sources", liste: [
          "**Réseau public** : eau potable contrôlée, la solution normale quand elle existe.",
          "**Puits** : un trou large (souvent creusé à la main ou à la pelle et busé) qui atteint une nappe peu profonde.",
          "**Forage** : un trou étroit fait par une machine (foreuse), qui peut descendre beaucoup plus profond.",
          "**Eau de pluie** : récupérée sur la toiture et stockée dans une cuve."] },
        { titre: "Les règles à connaître", liste: [
          "Tout puits ou forage à usage domestique doit être **déclaré en mairie** (au moins un mois avant les travaux, puis à la fin).",
          "Un forage de **plus de 10 m** de profondeur doit aussi être déclaré aux services de l'État (Code minier).",
          "L'eau d'un puits ou d'un forage n'est **pas potable par défaut** : pour la boire, il faut des **analyses** et souvent une autorisation.",
          "Il est **interdit de relier** un puits, un forage ou une cuve d'eau de pluie au réseau d'eau potable : risque de pollution du réseau public. Les réseaux restent **séparés**."] }
      ],
      retenir: [
        "Puits et forage : déclaration en mairie.",
        "Forage de plus de 10 m : déclaration aussi à l'État.",
        "Eau non potable sans analyses.",
        "Jamais de connexion avec le réseau d'eau potable."
      ],
      terrain: "Sur une maison qui a un puits ou une cuve, repère les robinets « eau non potable » : ils doivent être signalés par une plaque.",
      quiz: [
        { q: "Un particulier veut creuser un puits. Que doit-il faire ?", choix: ["Le déclarer en mairie", "Rien, c'est chez lui", "Demander au voisin", "Prévenir la poste"], ok: 0, pourquoi: "Les ouvrages de prélèvement d'eau à usage domestique doivent être déclarés en mairie." },
        { q: "L'eau d'un forage est-elle potable automatiquement ?", choix: ["Non, il faut des analyses", "Oui, toujours", "Oui si elle est froide", "Oui si elle est claire"], ok: 0, pourquoi: "Une eau claire peut contenir des bactéries ou des nitrates : seule l'analyse le dit." },
        { q: "Peut-on brancher une cuve d'eau de pluie sur le réseau d'eau potable ?", choix: ["Non, les réseaux doivent rester séparés", "Oui, pour économiser", "Oui avec un robinet", "Oui l'été seulement"], ok: 0, pourquoi: "Un retour d'eau non potable polluerait le réseau public." },
        { q: "Quelle différence principale entre puits et forage ?", choix: ["Le puits est large et peu profond, le forage étroit et plus profond", "Aucune", "Le forage est toujours à la main", "Le puits se fait à la foreuse"], ok: 0, pourquoi: "Le forage est réalisé à la machine et peut aller chercher des nappes profondes." },
        { q: "Au-delà de quelle profondeur un forage est-il aussi déclaré à l'État ?", choix: ["10 m", "1 m", "100 m", "Jamais"], ok: 0, pourquoi: "Le Code minier impose une déclaration pour les forages de plus de 10 m." }
      ]
    },
    {
      id: "puits", emoji: "🕳️", titre: "Creuser un puits busé", duree: "20 min",
      intro: "Buses, havage, nappe, margelle… et les dangers mortels du fond de puits.",
      illustrations: ["puits"],
      sections: [
        { titre: "Le principe", liste: [
          "On creuse à l'intérieur d'une **buse** en béton (souvent 1 m de diamètre) posée au sol : en enlevant la terre dessous, la buse **descend par son poids**. C'est le **havage**.",
          "On ajoute une buse par-dessus, et ainsi de suite, jusqu'à atteindre la **nappe** et descendre dedans de manière à garder de l'eau même en été.",
          "Au fond : un **lit de gravier** filtrant. En haut : une **margelle** qui dépasse du sol et un **couvercle** solide et verrouillable."] },
        { titre: "Protéger l'eau", liste: [
          "Le puits doit être **loin des sources de pollution** : assainissement (au moins 35 m d'un épandage), fumier, cuve de fioul, route.",
          "Le **haut du puits** est étanche (joint entre buses, cimentation autour) pour que l'eau de surface n'y coule pas.",
          "La **pompe** (immergée ou de surface) et ses câbles sont prévus pour l'eau."] },
        { titre: "La sécurité au fond", texte: [
          "Le fond d'un puits peut manquer d'oxygène ou contenir des gaz (gaz carbonique, gaz du sol). **On n'y descend jamais seul**, toujours avec un **détecteur de gaz**, une **ventilation**, un **harnais relié à un treuil** et une personne en surface qui peut remonter le descendeur. **Jamais de moteur thermique** (pompe, groupe) dans ou près du puits : ses fumées tuent en quelques minutes. Le couvercle est **toujours fermé** : un puits ouvert est un piège pour les enfants."] }
      ],
      danger: "Plusieurs personnes meurent chaque année en descendant secourir quelqu'un au fond d'un puits ou d'une fosse : le gaz les tue aussi. Si quelqu'un tombe inconscient au fond, **on ne descend pas** : on appelle le 112 et on ventile.",
      retenir: [
        "Havage : on creuse sous la buse, elle descend.",
        "Margelle et couvercle verrouillé.",
        "Loin des pollutions, haut du puits étanche.",
        "Jamais seul, détecteur de gaz, harnais et treuil, pas de moteur thermique."
      ],
      terrain: "Avant de descendre, fais le test du détecteur en surface puis descends-le au fond **avant toi**.",
      quiz: [
        { q: "Qu'est-ce que le havage ?", choix: ["Creuser sous la buse pour qu'elle descende par son poids", "Hisser l'eau au seau", "Peindre la margelle", "Nettoyer le puits"], ok: 0, pourquoi: "On retire la terre sous la buse, qui s'enfonce, puis on en ajoute une autre." },
        { q: "Un collègue est inconscient au fond d'un puits. Que fais-tu ?", choix: ["J'appelle le 112 et je ne descends pas sans protection", "Je descends tout de suite le chercher", "J'attends qu'il se réveille", "Je lance de l'eau"], ok: 0, pourquoi: "Le gaz qui l'a fait tomber te ferait tomber aussi : on alerte et on ventile." },
        { q: "Pourquoi jamais de pompe thermique dans un puits ?", choix: ["Ses gaz d'échappement (monoxyde de carbone) tuent", "Elle est trop bruyante", "Elle consomme trop", "Elle abîme les buses"], ok: 0, pourquoi: "Le monoxyde de carbone s'accumule dans l'espace fermé." },
        { q: "À quelle distance minimale d'un épandage d'assainissement placer un puits d'eau ?", choix: ["Au moins 35 m", "1 m", "5 m", "Aucune distance"], ok: 0, pourquoi: "La distance protège l'eau du puits de la pollution des eaux usées." },
        { q: "Pourquoi un couvercle toujours fermé ?", choix: ["Éviter les chutes (enfants, animaux) et la pollution", "Garder l'eau chaude", "Empêcher l'évaporation", "Pour la décoration"], ok: 0, pourquoi: "Un puits ouvert est un piège mortel et une porte d'entrée pour la pollution." }
      ]
    },
    {
      id: "forage", emoji: "⚙️", titre: "Le forage d'eau", duree: "20 min",
      intro: "Foreuse, tubage, crépine, massif filtrant, cimentation, pompe et analyses.",
      illustrations: ["forage"],
      sections: [
        { titre: "Les étapes d'un forage", liste: [
          "**Étude** : où est la nappe ? (cartes géologiques, forages voisins, données publiques). Déclarations faites.",
          "**Forage** à la foreuse (rotary, marteau fond de trou selon le terrain), avec un diamètre plus grand que le tube final.",
          "**Tubage** : tube plein (souvent PVC) sur la partie haute, **crépine** (tube fendu) au niveau de la nappe.",
          "**Massif filtrant** : gravier calibré autour de la crépine, qui laisse passer l'eau et retient le sable.",
          "**Cimentation de tête** : un bouchon étanche autour du tube en haut, pour que l'eau de surface ne descende pas polluer la nappe.",
          "**Développement** et **essai de pompage** : on pompe pour nettoyer et mesurer le débit.",
          "**Pompe immergée**, **tête de forage** fermée et surélevée, **compteur**, et **analyse** de l'eau."] },
        { titre: "Les bonnes pratiques", liste: [
          "Ne pas mettre en relation deux nappes différentes (risque de pollution d'une nappe par l'autre).",
          "Un forage abandonné doit être **rebouché** dans les règles, pas laissé ouvert.",
          "Les boues et l'eau de forage sont gérées pour ne pas polluer le terrain ni le voisinage."] }
      ],
      retenir: [
        "Tube plein en haut, crépine dans la nappe.",
        "Massif filtrant autour de la crépine.",
        "Cimentation de tête contre la pollution de surface.",
        "Essai de pompage et analyse avant usage."
      ],
      terrain: "Sur un chantier de forage, la zone autour de la foreuse est balisée : tiges qui tournent, câbles, levage. On n'approche qu'avec l'accord du foreur.",
      quiz: [
        { q: "À quoi sert la crépine ?", choix: ["Laisser entrer l'eau de la nappe dans le tube", "Fermer le forage", "Chauffer l'eau", "Mesurer la profondeur"], ok: 0, pourquoi: "C'est un tube fendu placé au niveau de la nappe." },
        { q: "Pourquoi une cimentation en tête de forage ?", choix: ["Empêcher l'eau de surface de polluer la nappe", "Faire joli", "Tenir la pompe", "Accélérer le débit"], ok: 0, pourquoi: "Sans bouchon étanche, l'eau de ruissellement descend le long du tube." },
        { q: "Le massif filtrant est fait de :", choix: ["Gravier calibré autour de la crépine", "Béton armé", "Sable fin uniquement", "Terre végétale"], ok: 0, pourquoi: "Il laisse passer l'eau et retient les particules fines." },
        { q: "Que fait-on d'un forage qu'on n'utilise plus ?", choix: ["On le rebouche dans les règles", "On le laisse ouvert", "On y jette les déchets", "On le recouvre d'une planche"], ok: 0, pourquoi: "Un forage abandonné ouvert est un chemin direct pour la pollution de la nappe." },
        { q: "Avant de boire l'eau d'un forage, il faut :", choix: ["Une analyse de l'eau", "La goûter", "La faire bouillir une fois", "Rien"], ok: 0, pourquoi: "Seule une analyse dit si l'eau est potable." }
      ]
    },
    {
      id: "assainissement", emoji: "🚽", titre: "Assainissement individuel et eau de pluie", duree: "20 min",
      intro: "Fosse toutes eaux, épandage, micro-station, SPANC ; cuve de récupération.",
      illustrations: ["anc"],
      sections: [
        { titre: "Quand la maison n'est pas raccordée", texte: [
          "Sans tout-à-l'égout, la maison doit avoir un **assainissement non collectif** (ANC). Le **SPANC** (service public de l'assainissement non collectif) contrôle le **projet** avant les travaux, puis la **bonne exécution** avant que la tranchée soit rebouchée."] },
        { titre: "Les éléments", liste: [
          "**Prétraitement** : une **fosse toutes eaux** qui reçoit toutes les eaux usées (WC, cuisine, salle de bain) ; ventilée par une ventilation haute.",
          "**Traitement** : **tranchées d'épandage** dans le sol si le terrain le permet, sinon **filtre à sable**, **filtre compact** ou **micro-station** agréée.",
          "Le choix dépend d'une **étude de sol** (perméabilité, nappe, pente, surface disponible).",
          "Distances : traitement en général à au moins **5 m de la maison**, **3 m des limites** et des arbres, et **35 m** d'un puits ou captage d'eau."] },
        { titre: "Récupérer l'eau de pluie", liste: [
          "**Cuve** enterrée ou hors sol, alimentée par les **gouttières**, avec un **filtre** à l'entrée et un **trop-plein**.",
          "Usages : **arrosage**, **WC**, lavage des sols, et sous conditions le lave-linge.",
          "**Réseau séparé** du réseau d'eau potable, tuyaux et robinets repérés « **eau non potable** »."] }
      ],
      retenir: [
        "Fosse toutes eaux + traitement (épandage, filtre, micro-station).",
        "SPANC : contrôle du projet puis des travaux.",
        "Distances : maison, limites, arbres, puits (35 m).",
        "Eau de pluie : réseau séparé et signalé."
      ],
      terrain: "Ne rebouche jamais une installation d'assainissement avant le passage du SPANC : sinon il faudra tout ré-ouvrir.",
      quiz: [
        { q: "Qui contrôle un assainissement individuel ?", choix: ["Le SPANC", "Le Consuel", "Le géomètre", "Le couvreur"], ok: 0, pourquoi: "Le service public de l'assainissement non collectif contrôle conception et exécution." },
        { q: "Où vont toutes les eaux usées en premier ?", choix: ["Dans la fosse toutes eaux", "Directement dans le jardin", "Dans la gouttière", "Dans le puits"], ok: 0, pourquoi: "La fosse fait le prétraitement avant l'épandage ou le filtre." },
        { q: "Qu'est-ce qui décide du type de traitement ?", choix: ["Une étude de sol", "La couleur de la maison", "Le prix seul", "Le voisin"], ok: 0, pourquoi: "La perméabilité du sol, la nappe et la surface disponible déterminent la filière." },
        { q: "Quand reboucher la tranchée d'un épandage ?", choix: ["Après le contrôle du SPANC", "Avant le contrôle", "Le jour même sans contrôle", "Jamais"], ok: 0, pourquoi: "Le SPANC doit voir l'installation ouverte pour vérifier l'exécution." },
        { q: "Quel usage est possible avec l'eau de pluie ?", choix: ["Arrosage et WC", "Boire sans traitement", "Remplir le biberon", "Cuisiner"], ok: 0, pourquoi: "L'eau de pluie est non potable : usages extérieurs et chasse d'eau." }
      ]
    }
  ]
});
