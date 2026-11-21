/* Spécialité — Construire une maison, étape par étape (tous les corps d'état) */
window.SPECIALITES = window.SPECIALITES || [];
window.SPECIALITES.push({
  id: "maison", nom: "Construire une maison, étape par étape", emoji: "🏠",
  resume: "Toutes les étapes, du terrain nu à la remise des clés, et tous les corps de métier.",
  role: "Construire une maison, c'est une **suite d'étapes dans un ordre précis**, où chaque **corps d'état** (terrassier, maçon, charpentier, couvreur, menuisier, plombier, électricien, plaquiste, carreleur, peintre…) intervient à son tour. Ce parcours te donne la vue d'ensemble : ce qui se fait, dans quel ordre, par qui, et ce qu'on contrôle à chaque étape. Il ne remplace pas les plans, les études et les règles de l'art (DTU) propres à chaque chantier.",
  missions: [
    "Connaître l'ordre des étapes d'une construction et les corps d'état",
    "Implanter une maison avec des chaises et contrôler l'équerrage",
    "Comprendre fondations, soubassement, murs, planchers, charpente et couverture",
    "Savoir ce que veulent dire « hors d'eau » et « hors d'air »",
    "Connaître les réseaux, l'isolation, les finitions, la réception et les garanties"
  ],
  acces: "Utile à tous : compagnon qui veut comprendre la suite du chantier, futur chef d'équipe ou chef de chantier, auto-constructeur qui suit ses travaux.",
  modules: [
    {
      id: "avant", emoji: "📋", titre: "Avant le chantier : terrain, études, permis", duree: "25 min",
      intro: "Rien ne se construit sans un terrain étudié, des plans, des autorisations et des assurances.",
      illustrations: ["maison-etapes"],
      sections: [
        { titre: "Le terrain", liste: [
          "**Bornage** : un géomètre fixe les limites exactes du terrain.",
          "**Certificat d'urbanisme** et **PLU** (plan local d'urbanisme) : ce qu'on a le droit de construire (hauteur, distance aux limites, aspect, emprise).",
          "**Viabilisation** : arrivée de l'eau, de l'électricité, du téléphone et de l'assainissement (tout-à-l'égout ou assainissement individuel).",
          "**Accès** pour les camions, la toupie et la grue ou le camion-grue."] },
        { titre: "Les études", liste: [
          "**Étude de sol** (géotechnique) : nature du terrain, eau, argiles qui gonflent. Dans les zones à risque d'argile, elle est obligatoire. C'est elle qui décide du type de fondations.",
          "**Plans d'architecte** ou de constructeur : plans de masse, plans des niveaux, coupes, façades. Un architecte est obligatoire au-delà de 150 m² de surface de plancher pour un particulier.",
          "**Étude thermique** (RE2020 pour le neuf) : isolation, chauffage, ventilation, étanchéité à l'air.",
          "**Plans d'exécution** et **étude béton armé** : fondations, ferraillages, planchers."] },
        { titre: "Les autorisations et assurances", liste: [
          "**Permis de construire** déposé en mairie, puis **affichage** sur le terrain (panneau) et délai de recours des tiers.",
          "**Déclaration d'ouverture de chantier** (DOC) au démarrage.",
          "**Assurance dommages-ouvrage** pour le maître d'ouvrage, **assurance décennale** pour chaque entreprise.",
          "**Contrat** : constructeur de maison individuelle (CCMI), architecte + entreprises, ou auto-construction."] },
        { titre: "L'ordre des étapes, en un coup d'œil", liste: [
          "1. Terrassement et implantation", "2. Fondations", "3. Soubassement, vide sanitaire ou dallage", "4. Murs (élévation)", "5. Planchers et escaliers",
          "6. Charpente et couverture → **hors d'eau**", "7. Menuiseries extérieures → **hors d'air**", "8. Réseaux : plomberie, électricité, ventilation, chauffage",
          "9. Isolation et plâtrerie", "10. Chapes et finitions (carrelage, parquet, peinture)", "11. Extérieurs : enduit, raccordements, abords", "12. Réception et garanties"] }
      ],
      retenir: [
        "Bornage, PLU, viabilisation, accès : le terrain d'abord.",
        "L'étude de sol décide des fondations.",
        "Permis affiché, DOC, dommages-ouvrage et décennales avant de commencer.",
        "Hors d'eau = toit fini ; hors d'air = fenêtres et portes posées."
      ],
      terrain: "Le premier jour, vérifie que le **panneau de permis** est affiché, que tu as **les plans au dernier indice**, et repère les **réseaux** existants (DICT).",
      quiz: [
        { q: "Qui décide du type de fondations à réaliser ?", choix: ["L'étude de sol et le bureau d'études", "Le maçon, selon son habitude", "Le client", "Le fournisseur de béton"], ok: 0, pourquoi: "La nature du sol (portance, argiles, eau) fixe le type et la profondeur des fondations." },
        { q: "Que veut dire « hors d'eau » ?", choix: ["La toiture est finie : la pluie n'entre plus par le haut", "Le terrain est drainé", "La plomberie est posée", "La maison est loin d'une rivière"], ok: 0, pourquoi: "Hors d'eau = charpente et couverture terminées." },
        { q: "Et « hors d'air » ?", choix: ["Les fenêtres et portes extérieures sont posées", "La ventilation fonctionne", "L'isolation est terminée", "Le chauffage est en route"], ok: 0, pourquoi: "Hors d'air = la maison est fermée par ses menuiseries extérieures." },
        { q: "Quelle assurance protège le client en cas de gros défaut après la fin des travaux ?", choix: ["La dommages-ouvrage (et les décennales des entreprises)", "L'assurance auto", "La mutuelle", "Aucune"], ok: 0, pourquoi: "La dommages-ouvrage préfinance les réparations ; les décennales des entreprises couvrent 10 ans." },
        { q: "À quoi sert le bornage ?", choix: ["Fixer les limites exactes du terrain", "Mesurer la hauteur de la maison", "Trouver l'eau", "Choisir la couleur de l'enduit"], ok: 0, pourquoi: "Le géomètre pose des bornes aux limites : on implante la maison par rapport à elles." }
      ]
    },
    {
      id: "implantation", emoji: "📐", titre: "Terrassement et implantation avec les chaises", duree: "25 min",
      intro: "Décaper, poser les chaises, tendre les cordeaux, vérifier l'équerre et le niveau.",
      illustrations: ["chaises"],
      sections: [
        { titre: "Préparer le terrain", liste: [
          "**Décapage** de la terre végétale (stockée à part pour les espaces verts).",
          "**Plate-forme** réglée à la bonne cote, accès et zone de stockage préparés.",
          "**Niveau de référence** : un repère fixe (borne, point sur un mur voisin) qui sert à toutes les hauteurs. On parle souvent du « 0,00 » = niveau fini du rez-de-chaussée."] },
        { titre: "Les chaises d'implantation", texte: [
          "Les **chaises** sont des planches horizontales clouées sur des piquets, placées **en retrait** des futurs angles (1 à 2 m) pour ne pas être arrachées par les fouilles. Elles sont **toutes réglées au même niveau**.",
          "Sur les chaises, on marque avec un clou ou un trait de scie la position des **nus des murs** (et parfois de l'axe des fondations). On tend des **cordeaux** de chaise à chaise : leurs **croisements** donnent les angles exacts de la maison."] },
        { titre: "Contrôler l'implantation", liste: [
          "**Équerrage** : les deux diagonales du rectangle doivent être égales. Ou méthode 3-4-5 (3 m d'un côté, 4 m de l'autre, 5 m entre les deux).",
          "**Distances aux limites** du terrain conformes au permis.",
          "**Report au sol** : un fil à plomb sous chaque croisement de cordeaux, un piquet au sol, puis traçage des fouilles (bombe, plâtre).",
          "Pour une implantation importante, un **géomètre** implante et fournit un plan d'implantation.",
          "On **garde les chaises** jusqu'à ce que les murs de soubassement soient montés : elles servent à recontrôler."] }
      ],
      retenir: [
        "Chaises en retrait, toutes au même niveau.",
        "Cordeaux tendus ; croisements = angles de la maison.",
        "Diagonales égales = d'équerre.",
        "On garde les chaises jusqu'au soubassement."
      ],
      terrain: "Ne t'appuie jamais sur une chaise et ne marche pas sur les cordeaux : un clou qui bouge, c'est un mur décalé de plusieurs centimètres.",
      quiz: [
        { q: "Pourquoi place-t-on les chaises en retrait des angles ?", choix: ["Pour ne pas les arracher en creusant les fouilles", "Pour économiser du bois", "Pour que le client les voie", "Parce que c'est plus joli"], ok: 0, pourquoi: "Les fouilles détruiraient des repères placés aux angles mêmes." },
        { q: "Que donnent les croisements des cordeaux ?", choix: ["Les angles de la maison (nus des murs)", "La hauteur des murs", "L'emplacement des fenêtres", "La pente du terrain"], ok: 0, pourquoi: "Chaque croisement de deux cordeaux matérialise un angle." },
        { q: "Comment vérifie-t-on qu'un rectangle est d'équerre ?", choix: ["Ses deux diagonales sont égales", "Ses côtés sont de la même couleur", "Il est de niveau", "Avec un niveau à bulle seul"], ok: 0, pourquoi: "Dans un rectangle parfait, les diagonales ont la même longueur." },
        { q: "Les chaises doivent être :", choix: ["Toutes au même niveau", "Chacune à une hauteur différente", "Posées par terre", "Fixées aux arbres"], ok: 0, pourquoi: "Un niveau commun permet de reporter les hauteurs et de tendre des cordeaux horizontaux." },
        { q: "Quand peut-on retirer les chaises ?", choix: ["Quand le soubassement est monté et contrôlé", "Dès le matin des fouilles", "Avant le décapage", "Jamais"], ok: 0, pourquoi: "Elles servent à recontrôler la position jusqu'à ce que les murs du bas soient faits." }
      ]
    },
    {
      id: "fondations", emoji: "🧱", titre: "Les fondations", duree: "25 min",
      intro: "Fouilles, béton de propreté, semelles armées, profondeur hors gel.",
      illustrations: ["fondations"],
      sections: [
        { titre: "À quoi servent les fondations", texte: [
          "Elles transmettent le poids de la maison au sol, sans tassement ni mouvement. Leur forme et leur profondeur viennent de l'**étude de sol** et du **bureau d'études**."] },
        { titre: "Les types de fondations", liste: [
          "**Semelles filantes** : sous les murs, les plus courantes en maison.",
          "**Semelles isolées** : sous les poteaux.",
          "**Radier** : une grande dalle sous toute la maison, sur sol faible.",
          "**Fondations profondes** (pieux, puits) : quand le bon sol est loin."] },
        { titre: "Les étapes", liste: [
          "**Fouilles en rigole** à la pelle, à la bonne largeur et profondeur.",
          "Fond descendu **sous la profondeur hors gel** (souvent 50 à 90 cm selon la région et l'altitude) et sur le bon sol.",
          "**Béton de propreté** (quelques cm) : fond propre et plat pour poser les aciers.",
          "**Ferraillage** des semelles (semelles armées, cales), **attentes** des chaînages verticaux aux angles.",
          "**Fourreaux** et réservations pour les réseaux qui traversent.",
          "**Coulage** et vibration, de préférence le jour même de l'ouverture des fouilles si la pluie menace (une fouille pleine d'eau ou éboulée se reprend).",
          "**Mise à la terre** : souvent une boucle (câble de cuivre nu) posée en fond de fouille, pour l'électricité."] }
      ],
      retenir: [
        "Semelles filantes sous les murs, isolées sous les poteaux.",
        "Hors gel et sur le bon sol.",
        "Béton de propreté, aciers calés, attentes, fourreaux.",
        "Boucle de terre en fond de fouille."
      ],
      terrain: "Avant de couler, fais **valider le fond de fouille** : si le sol est mou, plein d'eau ou différent de l'étude, on s'arrête et on prévient.",
      quiz: [
        { q: "Pourquoi descendre les fondations sous la profondeur hors gel ?", choix: ["Le gel fait gonfler le sol et soulèverait la maison", "Pour trouver de l'eau", "Pour économiser du béton", "C'est seulement esthétique"], ok: 0, pourquoi: "L'eau du sol qui gèle gonfle et provoque des mouvements : la semelle doit être plus bas." },
        { q: "Quel type de fondation trouve-t-on sous les murs d'une maison ?", choix: ["La semelle filante", "La semelle isolée", "Le pieu seul", "La chape"], ok: 0, pourquoi: "La semelle filante suit les murs sur toute leur longueur." },
        { q: "À quoi sert le béton de propreté ?", choix: ["Faire un fond propre et plat pour poser les aciers", "Remplacer la semelle", "Décorer la fouille", "Isoler du froid"], ok: 0, pourquoi: "Il évite que les aciers touchent la terre et facilite le réglage." },
        { q: "Le fond de fouille est mou et différent de l'étude. Que fais-tu ?", choix: ["J'arrête et je préviens avant de couler", "Je coule plus de béton", "Je mets du sable", "Je continue"], ok: 0, pourquoi: "Le bureau d'études doit adapter la fondation au sol réel." },
        { q: "Qu'appelle-t-on un radier ?", choix: ["Une dalle de fondation sous toute la maison", "Un mur de clôture", "Un poteau", "Un tuyau d'évacuation"], ok: 0, pourquoi: "Le radier répartit le poids sur toute la surface, utile sur sol faible." }
      ]
    },
    {
      id: "soubassement", emoji: "🪨", titre: "Soubassement, vide sanitaire ou dallage", duree: "25 min",
      intro: "Le niveau bas de la maison : réseaux sous dalle, hérisson, polyane, drainage.",
      illustrations: ["fondations"],
      sections: [
        { titre: "Deux grandes solutions", liste: [
          "**Dallage sur terre-plein** : une dalle posée sur le sol préparé. Économique, mais les réseaux sont noyés dessous.",
          "**Vide sanitaire** : un espace (souvent 20 à 80 cm) entre le sol et le plancher bas, ventilé. Les réseaux restent accessibles et la maison est protégée de l'humidité et des sols qui bougent."] },
        { titre: "Le soubassement", liste: [
          "**Murs de soubassement** en blocs (souvent blocs pleins ou à bancher) montés sur les semelles jusqu'au plancher bas.",
          "**Arase étanche** (coupure de capillarité) pour que l'humidité du sol ne monte pas dans les murs.",
          "**Drainage** périphérique si le terrain est humide ou en pente : drain, gravier, géotextile, regard.",
          "**Protection** des murs enterrés (enduit, membrane, nappe à excroissances)."] },
        { titre: "Le dallage sur terre-plein", liste: [
          "**Réseaux sous dalle** posés et testés avant : évacuations (EU/EV), arrivée d'eau, fourreaux électriques.",
          "**Hérisson** : 15 à 20 cm de cailloux compactés, contre les remontées d'eau.",
          "**Film polyane** et **isolant** sous dalle selon l'étude thermique.",
          "**Treillis soudé** calé, puis **dallage** coulé et réglé à la règle, joints prévus."] }
      ],
      retenir: [
        "Dallage sur terre-plein ou vide sanitaire.",
        "Arase étanche contre les remontées d'humidité.",
        "Réseaux sous dalle posés et testés avant de couler.",
        "Hérisson, polyane, isolant, treillis, dallage."
      ],
      terrain: "Prends en photo chaque réseau sous dalle avec un mètre posé à côté avant de couler : dans 10 ans, quelqu'un sera content de savoir où il passe.",
      quiz: [
        { q: "Avantage principal du vide sanitaire ?", choix: ["Les réseaux restent accessibles et la maison est protégée de l'humidité", "Il est moins cher qu'un dallage", "Il remplace les fondations", "Il chauffe la maison"], ok: 0, pourquoi: "L'espace ventilé isole le plancher du sol et permet d'accéder aux tuyaux." },
        { q: "Qu'est-ce que le hérisson ?", choix: ["Une couche de cailloux compactés sous le dallage", "Un outil de maçon", "Un type de tuile", "Une brosse pour les banches"], ok: 0, pourquoi: "Le hérisson coupe les remontées d'eau par capillarité et sert d'assise." },
        { q: "Que faut-il faire avant de couler un dallage ?", choix: ["Poser et tester les réseaux qui passent dessous", "Poser le carrelage", "Peindre les murs", "Rien de particulier"], ok: 0, pourquoi: "Après le coulage, les réseaux sous dalle sont inaccessibles." },
        { q: "À quoi sert l'arase étanche ?", choix: ["Empêcher l'humidité du sol de monter dans les murs", "Décorer le soubassement", "Fixer la charpente", "Évacuer l'eau de pluie"], ok: 0, pourquoi: "C'est une coupure de capillarité entre les fondations et les murs." },
        { q: "Quand pose-t-on un drainage périphérique ?", choix: ["Quand le terrain est humide ou en pente", "Jamais", "Seulement sur le toit", "Après les peintures"], ok: 0, pourquoi: "Le drain évacue l'eau qui s'accumule contre les murs enterrés." }
      ]
    },
    {
      id: "murs", emoji: "🧱", titre: "Les murs : l'élévation", duree: "25 min",
      intro: "Blocs, briques, chaînages, linteaux, aplomb et niveau.",
      sections: [
        { titre: "Les matériaux", liste: [
          "**Blocs béton** (parpaings) : les plus courants, solides, économiques.",
          "**Brique de terre cuite** (monomur ou brique + isolant) : bonne inertie, isolation selon le modèle.",
          "**Béton cellulaire** : léger, isolant, facile à couper.",
          "**Ossature bois** : murs préfabriqués, chantier rapide et sec.",
          "**Voiles béton banchés** : en collectif ou pour les murs très chargés."] },
        { titre: "Monter un mur", liste: [
          "Premier rang **réglé au niveau** sur un lit de mortier (c'est lui qui donne la qualité de tout le mur).",
          "**Joints croisés** (on décale les blocs d'un rang à l'autre).",
          "Contrôle permanent : **aplomb** (niveau ou fil à plomb), **alignement** (cordeau), **hauteur des rangs** (règle graduée, « pige »).",
          "**Réservations** pour portes et fenêtres, avec les **linteaux** (au-dessus) et les **appuis** (en dessous).",
          "**Mortier ou colle** selon le bloc : joints minces collés pour les blocs rectifiés."] },
        { titre: "Les chaînages", texte: [
          "Les **chaînages** sont des ceintures de béton armé qui tiennent les murs ensemble : **verticaux** dans les angles et les jonctions de murs, **horizontaux** à chaque niveau de plancher et en haut des murs. Ils sont indispensables, et renforcés en zone sismique."] }
      ],
      retenir: [
        "Premier rang parfaitement de niveau.",
        "Joints croisés, aplomb, alignement, hauteur des rangs.",
        "Linteaux au-dessus des ouvertures.",
        "Chaînages verticaux et horizontaux : la ceinture de la maison."
      ],
      terrain: "Contrôle l'aplomb **tous les 2 ou 3 rangs** : un mur qui penche ne se rattrape pas en haut.",
      quiz: [
        { q: "Pourquoi le premier rang de blocs est-il si important ?", choix: ["Il donne le niveau de tout le mur", "Il est plus joli", "Il est en couleur", "On peut le rater, on rattrape après"], ok: 0, pourquoi: "Un premier rang faux se répercute sur tous les rangs suivants." },
        { q: "Que sont les chaînages ?", choix: ["Des ceintures de béton armé qui tiennent les murs", "Des chaînes pour lever les blocs", "Des joints de carrelage", "Des câbles électriques"], ok: 0, pourquoi: "Verticaux aux angles, horizontaux aux planchers : ils lient la structure." },
        { q: "Que pose-t-on au-dessus d'une ouverture de fenêtre ?", choix: ["Un linteau", "Un appui", "Une semelle", "Un hérisson"], ok: 0, pourquoi: "Le linteau reprend la charge du mur au-dessus de l'ouverture." },
        { q: "Pourquoi croise-t-on les joints ?", choix: ["Pour que le mur travaille d'un seul bloc et ne se fende pas", "Pour aller plus vite", "Pour utiliser moins de mortier", "Pour la décoration"], ok: 0, pourquoi: "Des joints alignés créeraient une ligne de faiblesse." },
        { q: "Quel outil contrôle qu'un mur est vertical ?", choix: ["Le niveau ou le fil à plomb", "La truelle", "La brouette", "Le mètre seul"], ok: 0, pourquoi: "L'aplomb se vérifie au niveau à bulle vertical ou au fil à plomb." }
      ]
    },
    {
      id: "planchers", emoji: "🪜", titre: "Planchers et escaliers", duree: "20 min",
      intro: "Poutrelles-hourdis, étaiement, dalle de compression, trémies.",
      sections: [
        { titre: "Le plancher poutrelles-hourdis", liste: [
          "**Poutrelles** préfabriquées posées d'un mur à l'autre, selon le **plan de pose** du fabricant.",
          "**Étaiement** sous les poutrelles (étais réglés), obligatoire pendant le coulage et le durcissement.",
          "**Hourdis** (entrevous) posés entre les poutrelles : béton, polystyrène ou bois.",
          "**Treillis** et **chaînages**, réservations et **trémies** (escalier, conduits).",
          "**Dalle de compression** coulée par-dessus (souvent 4 à 5 cm), qui fait travailler l'ensemble."] },
        { titre: "Autres planchers", liste: [
          "**Dalle pleine** en béton armé, coffrée et étayée.",
          "**Prédalles** : plaques préfabriquées qui servent de coffrage, avec béton coulé dessus.",
          "**Plancher bois** sur solives (souvent à l'étage ou en rénovation)."] },
        { titre: "Sécurité", texte: [
          "Une trémie est un trou dans le plancher : elle est **protégée** (garde-corps ou couvercle fixé) dès sa création. On ne marche **jamais sur les hourdis** (ils cassent) : on se déplace sur des planches posées sur les poutrelles."] }
      ],
      retenir: [
        "Poutrelles, étais, hourdis, treillis, dalle de compression.",
        "Respecter le plan de pose du fabricant.",
        "Étais en place jusqu'à la résistance prévue.",
        "Trémie protégée, jamais marcher sur un hourdis."
      ],
      terrain: "Avant de couler, fais le tour **en dessous** : chaque étai est-il bien vertical, calé et serré ?",
      quiz: [
        { q: "Que pose-t-on entre les poutrelles ?", choix: ["Des hourdis (entrevous)", "Des tuiles", "Des parpaings de 20", "Du placo"], ok: 0, pourquoi: "Les hourdis remplissent l'espace et servent de coffrage perdu." },
        { q: "Peut-on marcher sur les hourdis ?", choix: ["Non, ils peuvent casser : on marche sur des planches", "Oui, ils sont prévus pour", "Oui, s'ils sont en béton", "Oui, avec des chaussures légères"], ok: 0, pourquoi: "Les hourdis ne sont pas faits pour porter une personne avant le coulage." },
        { q: "À quoi sert la dalle de compression ?", choix: ["Faire travailler ensemble poutrelles et hourdis", "Isoler du bruit uniquement", "Remplacer les étais", "Décorer le plafond"], ok: 0, pourquoi: "Cette couche de béton armé lie le tout et répartit les charges." },
        { q: "Qu'est-ce qu'une trémie ?", choix: ["Une ouverture dans un plancher", "Un type d'étai", "Un outil de coffreur", "Une poutrelle"], ok: 0, pourquoi: "Escalier, conduit… la trémie doit être protégée contre les chutes." },
        { q: "Qui fixe l'espacement et la position des poutrelles ?", choix: ["Le plan de pose du fabricant", "Le maçon à l'œil", "Le client", "Le peintre"], ok: 0, pourquoi: "Le plan de pose est calculé pour les portées et les charges." }
      ]
    },
    {
      id: "toiture", emoji: "🏚️", titre: "Charpente et couverture : le hors d'eau", duree: "25 min",
      intro: "Fermettes ou charpente traditionnelle, écran, liteaux, tuiles, gouttières.",
      sections: [
        { titre: "La charpente", liste: [
          "**Fermettes** industrielles : petites fermes légères tous les 60 cm environ, contreventées. Rapides et économiques, mais combles peu aménageables.",
          "**Charpente traditionnelle** : fermes, pannes, chevrons. Permet des combles aménagés.",
          "**Contreventement** (écharpes, liens) : indispensable pour que la charpente ne se couche pas.",
          "Fixation sur les **chaînages** hauts (sabots, ancrages)."] },
        { titre: "La couverture", liste: [
          "**Écran sous-toiture** (souvent HPV, perméable à la vapeur) : deuxième barrière contre l'eau et la neige poudreuse.",
          "**Contre-liteaux** et **liteaux** : l'espacement des liteaux dépend de la tuile (le « pureau »).",
          "**Tuiles** (terre cuite, béton) ou **ardoises**, posées selon la **pente minimale** du fabricant et la région.",
          "**Faîtage**, **rives**, **noues**, **solins** : les points délicats où l'eau cherche à passer.",
          "**Zinguerie** : gouttières, descentes d'eau pluviale, raccordées au réseau."] },
        { titre: "Sécurité en toiture", texte: [
          "Le travail en toiture est l'un des plus dangereux du bâtiment. Protections collectives d'abord : **échafaudage de pied avec garde-corps**, **filets**, **garde-corps de rive**. Harnais seulement quand le collectif est impossible, sur un point d'ancrage solide. On ne marche pas sur les plaques fragiles (translucides, fibrociment)."] }
      ],
      retenir: [
        "Fermettes ou traditionnelle, toujours contreventée.",
        "Écran sous-toiture, contre-liteaux, liteaux, tuiles.",
        "Faîtage, rives, noues, solins : points sensibles.",
        "Toiture = protections collectives avant tout."
      ],
      terrain: "Après la pose, fais un **tour de la couverture par temps de pluie** (depuis l'intérieur, dans les combles) : une tache sur l'écran = une fuite à reprendre tout de suite.",
      quiz: [
        { q: "Quand la maison est-elle « hors d'eau » ?", choix: ["Quand la couverture est terminée", "Quand les fondations sont coulées", "Quand l'enduit est fait", "Quand la plomberie est posée"], ok: 0, pourquoi: "La toiture finie protège l'intérieur de la pluie." },
        { q: "À quoi sert l'écran sous-toiture ?", choix: ["Deuxième barrière contre l'eau et la neige", "Isoler du bruit uniquement", "Remplacer les tuiles", "Tenir les gouttières"], ok: 0, pourquoi: "Il recueille ce qui passe sous les tuiles et le renvoie vers la gouttière." },
        { q: "Pourquoi contrevente-t-on une charpente ?", choix: ["Pour qu'elle ne se couche pas sous le vent", "Pour la décorer", "Pour l'isoler", "Pour y fixer les luminaires"], ok: 0, pourquoi: "Les écharpes et liens rigidifient l'ensemble dans les deux sens." },
        { q: "Quelle protection privilégier pour travailler en toiture ?", choix: ["Une protection collective (garde-corps, échafaudage, filet)", "Uniquement un harnais", "Des chaussures antidérapantes seules", "Aucune si on fait attention"], ok: 0, pourquoi: "Le collectif protège tout le monde en permanence ; le harnais vient en complément." },
        { q: "Où l'eau cherche-t-elle le plus à passer ?", choix: ["Aux points singuliers : faîtage, noues, rives, solins", "Au milieu des tuiles", "Sur les murs intérieurs", "Dans les fondations"], ok: 0, pourquoi: "Les jonctions et changements de pente sont les zones à soigner." }
      ]
    },
    {
      id: "menuiseries", emoji: "🪟", titre: "Menuiseries extérieures : le hors d'air", duree: "15 min",
      intro: "Fenêtres, portes, volets : poser, régler, rendre étanche.",
      sections: [
        { titre: "Les menuiseries", liste: [
          "**Fenêtres et portes-fenêtres** : PVC, aluminium, bois ou mixte ; double ou triple vitrage.",
          "**Porte d'entrée**, **porte de garage**, **volets** (roulants, battants).",
          "Pose **en applique** (contre l'isolant, côté intérieur), **en tunnel** (dans l'épaisseur du mur) ou **en feuillure** : elle dépend de l'isolation et du mur."] },
        { titre: "Bien poser", liste: [
          "**Calage**, **aplomb**, **niveau** et **équerre** de chaque dormant.",
          "**Fixation** adaptée au mur (pattes, vis, chevilles).",
          "**Étanchéité** à l'eau et à l'air : mousse imprégnée, joint, membrane, appui avec rejet d'eau.",
          "Vérification du **fonctionnement** : ouverture, fermeture, réglages.",
          "**Protection** jusqu'à la fin des travaux (films, cornières)."] },
        { titre: "Pourquoi c'est important", texte: [
          "Le « hors d'air » permet aux autres corps d'état de travailler à l'abri. Et une menuiserie mal calfeutrée, c'est une fuite d'air permanente : la maison chauffe le jardin, et le **test d'étanchéité à l'air** de fin de chantier (obligatoire en neuf) risque d'échouer."] }
      ],
      retenir: [
        "Hors d'air = menuiseries extérieures posées.",
        "Calage, aplomb, niveau, équerre, fixation.",
        "Étanchéité à l'eau et à l'air soignée.",
        "Protéger les menuiseries jusqu'à la fin."
      ],
      terrain: "Avant de poser, vérifie que la menuiserie livrée correspond au plan (dimensions, sens d'ouverture, vitrage) : un sens d'ouverture inversé se voit trop tard.",
      quiz: [
        { q: "Que permet le « hors d'air » ?", choix: ["Aux autres corps d'état de travailler à l'abri", "De supprimer le chauffage", "De ne pas isoler", "De ne pas faire de réception"], ok: 0, pourquoi: "La maison fermée protège les travaux intérieurs du vent et de la pluie." },
        { q: "Qu'est-ce qu'on contrôle à la pose d'une fenêtre ?", choix: ["Aplomb, niveau, équerre et fonctionnement", "Seulement la couleur", "Le poids", "La marque"], ok: 0, pourquoi: "Une menuiserie hors d'aplomb ferme mal et fuit." },
        { q: "Une menuiserie mal calfeutrée provoque :", choix: ["Des fuites d'air et un échec possible du test d'étanchéité", "Rien de grave", "Une meilleure ventilation utile", "Des économies de chauffage"], ok: 0, pourquoi: "L'air qui passe autour des dormants fait perdre de la chaleur." },
        { q: "La pose « en applique » se fait :", choix: ["Contre le mur, côté intérieur, souvent avec l'isolant", "Sur le toit", "Dans le sol", "À l'extérieur sur l'enduit"], ok: 0, pourquoi: "En applique, le dormant est fixé contre le nu intérieur du mur, en continuité avec le doublage isolant." },
        { q: "Avant de poser, on vérifie :", choix: ["Que la menuiserie correspond au plan (dimensions, sens, vitrage)", "Seulement le prix", "La météo de la semaine suivante", "Rien"], ok: 0, pourquoi: "Une erreur de commande se corrige avant la pose, pas après." }
      ]
    },
    {
      id: "reseaux-maison", emoji: "🔌", titre: "Les réseaux : plomberie, électricité, ventilation, chauffage", duree: "30 min",
      intro: "Ce qui rend la maison vivante, et l'ordre dans lequel on l'installe.",
      sections: [
        { titre: "L'ordre d'intervention", texte: [
          "Les réseaux se posent en deux temps : la **première passe** (avant les cloisons et les doublages : gaines, tuyaux, boîtiers) puis la **finition** (après les plâtres et les peintures : appareillage, sanitaires, radiateurs)."] },
        { titre: "Plomberie", liste: [
          "**Alimentation** en eau froide et chaude (multicouche, PER, cuivre), avec compteur et robinet d'arrêt général, **nourrice** de distribution.",
          "**Évacuations** : eaux usées (EU) et eaux vannes (EV) en PVC, avec une **pente** (souvent 1 à 3 cm par mètre) et des **ventilations** de chute.",
          "**Essais** d'étanchéité sous pression avant de fermer les cloisons.",
          "Production d'eau chaude : chauffe-eau électrique, thermodynamique, solaire…"] },
        { titre: "Électricité", liste: [
          "Installation selon la norme **NF C 15-100** : nombre de prises et de circuits par pièce, protections.",
          "**Tableau électrique** avec **interrupteurs différentiels 30 mA** et disjoncteurs par circuit.",
          "**Liaison à la terre** (la boucle des fondations) et **liaisons équipotentielles** (salle de bain).",
          "**Consuel** : l'attestation de conformité, obligatoire pour la mise en service en construction neuve."] },
        { titre: "Ventilation et chauffage", liste: [
          "**VMC** (simple ou double flux) : elle extrait l'air humide des pièces d'eau, obligatoire pour la qualité de l'air.",
          "**Chauffage** : pompe à chaleur, chaudière, plancher chauffant, poêle… choisi avec l'étude thermique.",
          "Les **gaines** de VMC et les **conduits** passent dans les combles ou les faux plafonds, à prévoir avant l'isolation."] }
      ],
      danger: "On ne travaille **jamais sous tension** : on coupe, on vérifie l'absence de tension (VAT) et on condamne. L'électricité se fait par des personnes **habilitées**.",
      retenir: [
        "Première passe avant les cloisons, finition après les peintures.",
        "Évacuations en pente, essais avant de fermer.",
        "NF C 15-100, différentiels 30 mA, terre, Consuel.",
        "VMC obligatoire, chauffage choisi avec l'étude thermique."
      ],
      terrain: "Avant que le plaquiste ferme une cloison, photographie les réseaux dedans avec un mètre : c'est le plan de récolement du pauvre, et il sauve des perçages.",
      quiz: [
        { q: "Quand pose-t-on les gaines et tuyaux dans les murs et cloisons ?", choix: ["En première passe, avant de fermer les cloisons", "Après les peintures", "Après la réception", "Pendant les fondations"], ok: 0, pourquoi: "Une fois les cloisons fermées, il faudrait tout ouvrir." },
        { q: "Pourquoi les évacuations ont-elles une pente ?", choix: ["Pour que l'eau s'écoule toute seule", "Pour la décoration", "Pour économiser du PVC", "Ce n'est pas nécessaire"], ok: 0, pourquoi: "Les évacuations fonctionnent par gravité : sans pente, elles bouchent." },
        { q: "Quelle norme régit l'électricité d'un logement ?", choix: ["NF C 15-100", "DTU 13.1", "RE2020", "ISO 9001"], ok: 0, pourquoi: "La NF C 15-100 fixe les règles des installations électriques basse tension." },
        { q: "Qu'est-ce que le Consuel ?", choix: ["L'attestation de conformité électrique pour la mise en service", "Un type de câble", "Une marque de tableau", "Un plan de VMC"], ok: 0, pourquoi: "Sans attestation Consuel, le fournisseur ne met pas l'installation neuve en service." },
        { q: "À quoi sert la VMC ?", choix: ["Renouveler l'air et extraire l'humidité", "Chauffer l'eau", "Éclairer", "Évacuer les eaux usées"], ok: 0, pourquoi: "Elle assure la qualité de l'air et évite la condensation et les moisissures." }
      ]
    },
    {
      id: "isolation", emoji: "🧊", titre: "Isolation et plâtrerie", duree: "25 min",
      intro: "Isoler les murs et les combles, monter les cloisons, rendre la maison étanche à l'air.",
      sections: [
        { titre: "Isoler", liste: [
          "**Murs** : isolation par l'intérieur (doublage collé ou sur ossature métallique) ou par l'extérieur (ITE, sous enduit ou bardage).",
          "**Combles** : laine soufflée ou en rouleaux sur le plancher des combles perdus, ou entre et sous chevrons en combles aménagés. C'est là que la maison perd le plus de chaleur.",
          "**Sol** : isolant sous dalle ou sous chape.",
          "**Ponts thermiques** à traiter : jonctions murs-planchers, tableaux de fenêtres, coffres de volets."] },
        { titre: "Étanchéité à l'air", texte: [
          "Une **membrane pare-vapeur** (ou freine-vapeur) côté chaud, des **adhésifs** aux jonctions, des **boîtiers électriques étanches** : l'air ne doit pas traverser l'enveloppe. En construction neuve, un **test d'infiltrométrie** (porte soufflante) vérifie le résultat en fin de chantier."] },
        { titre: "Plâtrerie (le plaquiste)", liste: [
          "**Rails** au sol et au plafond, **montants** tous les 60 cm (ou 40 cm selon la plaque et la hauteur).",
          "**Plaques de plâtre** vissées : standard, hydrofuge (pièces humides, souvent verte), feu, phonique.",
          "**Bandes et enduit** sur les joints, ponçage, prêt à peindre.",
          "**Faux plafonds** sur fourrures et suspentes, avec isolant si besoin."] }
      ],
      retenir: [
        "Les combles d'abord : c'est la plus grosse perte de chaleur.",
        "Traiter les ponts thermiques.",
        "Pare-vapeur côté chaud, jonctions scotchées : étanchéité à l'air.",
        "Plaque hydrofuge en pièce humide, bandes et enduit sur les joints."
      ],
      terrain: "Un trou dans le pare-vapeur pour passer un câble = un adhésif ou un passe-câble étanche **tout de suite**. Sinon le test d'étanchéité à l'air échouera.",
      quiz: [
        { q: "Par où une maison mal isolée perd-elle le plus de chaleur ?", choix: ["Par la toiture et les combles", "Par la boîte aux lettres", "Par les fondations uniquement", "Par les prises électriques"], ok: 0, pourquoi: "L'air chaud monte : les combles sont la priorité." },
        { q: "Où place-t-on le pare-vapeur ?", choix: ["Côté chaud (intérieur) de l'isolant", "Côté extérieur sous l'enduit", "Dans la dalle", "Sur le toit"], ok: 0, pourquoi: "Il empêche la vapeur de l'intérieur d'aller condenser dans l'isolant." },
        { q: "Quelle plaque de plâtre dans une salle de bain ?", choix: ["Une plaque hydrofuge", "Une plaque standard", "Une plaque de bois", "Aucune plaque"], ok: 0, pourquoi: "La plaque hydrofuge résiste mieux à l'humidité." },
        { q: "Qu'est-ce qu'un pont thermique ?", choix: ["Un endroit où la chaleur s'échappe plus facilement", "Un pont chauffé", "Un type de radiateur", "Une poutre en acier décorative"], ok: 0, pourquoi: "Jonctions mur-plancher, tableaux de fenêtres… l'isolation y est interrompue." },
        { q: "Que vérifie le test d'infiltrométrie ?", choix: ["L'étanchéité à l'air de la maison", "La qualité de l'eau", "La solidité des fondations", "La puissance électrique"], ok: 0, pourquoi: "Une porte soufflante mesure les fuites d'air de l'enveloppe." }
      ]
    },
    {
      id: "finitions", emoji: "🎨", titre: "Chapes et finitions", duree: "25 min",
      intro: "Chape, carrelage, parquet, faïence, peinture, menuiseries intérieures.",
      sections: [
        { titre: "Les sols", liste: [
          "**Chape** (ciment ou fluide anhydrite) : met le sol de niveau et enrobe le plancher chauffant. Elle doit **sécher** avant les revêtements (temps de séchage du fabricant, contrôle d'humidité).",
          "**Carrelage** : colle adaptée, double encollage pour les grands formats, joints réguliers, pente vers l'évacuation dans les douches.",
          "**Parquet** et sols souples : sur support sec, plan et propre, avec sous-couche."] },
        { titre: "Pièces d'eau", liste: [
          "**Système d'étanchéité sous carrelage** (SPEC ou SEL) dans les douches et zones exposées.",
          "**Faïence** murale, plinthes, joints silicone aux angles et autour des appareils.",
          "Pose des **sanitaires** (finition plomberie) après les revêtements."] },
        { titre: "Peinture et menuiseries intérieures", liste: [
          "Préparation : **rebouchage**, **ponçage**, dépoussiérage, **impression** (sous-couche).",
          "Deux couches de **finition** (mate, satinée selon la pièce).",
          "**Portes intérieures**, placards, escalier, plinthes.",
          "Finitions électriques et de chauffage (appareillage, radiateurs), puis **nettoyage de fin de chantier**."] }
      ],
      retenir: [
        "Chape sèche avant les revêtements.",
        "Étanchéité sous carrelage dans les douches.",
        "Peinture : préparer, imprimer, deux couches.",
        "Les sanitaires et l'appareillage viennent à la fin."
      ],
      terrain: "Protège ce qui est fini (sols, menuiseries) avec des cartons ou des films : la dernière semaine d'un chantier abîme souvent ce que la première a fait.",
      quiz: [
        { q: "Peut-on poser un parquet sur une chape encore humide ?", choix: ["Non, il faut attendre le séchage et le contrôler", "Oui, sans problème", "Oui, avec plus de colle", "Oui si on chauffe fort"], ok: 0, pourquoi: "L'humidité fait gonfler et décoller le revêtement." },
        { q: "Que pose-t-on sous le carrelage d'une douche ?", choix: ["Un système d'étanchéité", "Du papier peint", "Du sable sec", "Rien"], ok: 0, pourquoi: "Le carrelage et ses joints ne sont pas étanches à eux seuls." },
        { q: "Avant de peindre un mur neuf, on fait :", choix: ["Rebouchage, ponçage, dépoussiérage et impression", "Directement la couche de finition", "Un lavage à grande eau", "Un enduit de façade"], ok: 0, pourquoi: "La préparation et la sous-couche font la qualité de la peinture." },
        { q: "Quand pose-t-on les sanitaires (WC, lavabos) ?", choix: ["Après les revêtements de sol et de mur", "Avant la chape", "Pendant les fondations", "Avant les cloisons"], ok: 0, pourquoi: "C'est la finition de la plomberie, une fois carrelage et faïence posés." },
        { q: "Pourquoi une pente dans le sol d'une douche à l'italienne ?", choix: ["Pour que l'eau aille vers l'évacuation", "Pour la décoration", "Pour éviter de glisser", "Ce n'est pas utile"], ok: 0, pourquoi: "Sans pente, l'eau stagne et déborde." }
      ]
    },
    {
      id: "exterieurs", emoji: "🌳", titre: "Extérieurs : enduit, raccordements, abords", duree: "20 min",
      intro: "Finir l'enveloppe et raccorder la maison aux réseaux.",
      sections: [
        { titre: "La façade", liste: [
          "**Enduit** monocouche ou traditionnel (gobetis, corps d'enduit, finition), appliqué hors gel et hors forte chaleur.",
          "Ou **bardage** (bois, composite) sur ossature, ou **ITE** sous enduit.",
          "**Appuis**, **seuils** et **couvertines** pour rejeter l'eau loin des murs."] },
        { titre: "Les raccordements", liste: [
          "**Eau potable** : branchement et compteur par le service des eaux.",
          "**Électricité** : raccordement par le gestionnaire du réseau, après le Consuel.",
          "**Télécom** et fibre : fourreaux jusqu'à la limite de propriété.",
          "**Eaux usées** : tout-à-l'égout ou assainissement individuel ; **eaux pluviales** : réseau, puits perdu ou récupération selon la commune."] },
        { titre: "Les abords", liste: [
          "**Remblai** autour de la maison avec pente pour éloigner l'eau des murs.",
          "**Terrasse**, allées, accès garage, clôture et portail selon le permis.",
          "**Évacuation** des déchets de chantier et remise en état du terrain."] }
      ],
      retenir: [
        "Enduit hors gel et hors forte chaleur.",
        "Appuis et couvertines rejettent l'eau.",
        "Raccordements : eau, électricité (après Consuel), télécom, assainissement.",
        "Pente des abords vers l'extérieur."
      ],
      terrain: "Demande les raccordements **tôt** : les délais des gestionnaires de réseaux sont souvent de plusieurs semaines.",
      quiz: [
        { q: "Quand éviter de faire un enduit de façade ?", choix: ["Par gel ou forte chaleur", "Le matin", "Un mardi", "Quand il y a des nuages"], ok: 0, pourquoi: "Le gel et le séchage trop rapide abîment l'enduit." },
        { q: "Que faut-il avant le raccordement électrique d'une maison neuve ?", choix: ["L'attestation Consuel", "La peinture des murs", "Le permis de démolir", "Rien"], ok: 0, pourquoi: "Le gestionnaire du réseau demande l'attestation de conformité." },
        { q: "Comment doit être le terrain autour de la maison ?", choix: ["En pente pour éloigner l'eau des murs", "En cuvette contre les murs", "Parfaitement plat", "Plus haut que le seuil"], ok: 0, pourquoi: "L'eau ne doit pas stagner au pied des murs." },
        { q: "À quoi sert une couvertine ?", choix: ["Protéger le haut d'un mur de l'eau", "Couvrir une piscine", "Tenir une gouttière", "Fermer un regard"], ok: 0, pourquoi: "Elle coiffe le mur et rejette l'eau de pluie." },
        { q: "Pourquoi demander les raccordements tôt ?", choix: ["Les délais sont souvent longs", "C'est moins cher le lundi", "C'est obligatoire avant les fondations", "Ce n'est pas utile"], ok: 0, pourquoi: "Les gestionnaires de réseaux ont des délais de plusieurs semaines." }
      ]
    },
    {
      id: "reception", emoji: "🔑", titre: "Réception et garanties", duree: "20 min",
      intro: "La réception, les réserves, et les garanties d'un an, deux ans et dix ans.",
      sections: [
        { titre: "La réception", liste: [
          "C'est l'acte par lequel le maître d'ouvrage **accepte** l'ouvrage, avec ou sans **réserves**, en présence des entreprises (ou du constructeur).",
          "On visite pièce par pièce, on teste tout (portes, fenêtres, robinets, prises, chauffage, VMC) et on note chaque défaut dans le **procès-verbal**.",
          "Elle marque le **point de départ des garanties**.",
          "Le **DOE** (dossier des ouvrages exécutés) est remis : plans à jour, notices, fiches techniques, attestations (Consuel, test d'étanchéité à l'air, attestation RE2020)."] },
        { titre: "Les garanties", liste: [
          "**Garantie de parfait achèvement (1 an)** : l'entreprise répare tous les désordres signalés à la réception ou pendant l'année.",
          "**Garantie biennale ou de bon fonctionnement (2 ans)** : les équipements qu'on peut démonter sans abîmer (volets, robinetterie, chaudière…).",
          "**Garantie décennale (10 ans)** : les dommages qui touchent la **solidité** de l'ouvrage ou le rendent **impropre à son usage** (fissures structurelles, infiltrations graves…)."] },
        { titre: "Bien finir un chantier", texte: [
          "Un chantier bien terminé, c'est des **réserves levées vite**, un **dossier complet** et un client qui recommande l'entreprise. Les dernières semaines comptent autant que les premières."] }
      ],
      retenir: [
        "Réception = acceptation, avec ou sans réserves, dans un procès-verbal.",
        "Elle lance les garanties.",
        "1 an parfait achèvement, 2 ans bon fonctionnement, 10 ans décennale.",
        "DOE remis au client."
      ],
      terrain: "Fais ta propre **pré-réception** quelques jours avant avec ton équipe : moins de réserves le jour J, c'est un client content.",
      quiz: [
        { q: "Que se passe-t-il à la réception ?", choix: ["Le client accepte l'ouvrage, avec ou sans réserves", "On coule les fondations", "On dépose le permis", "On commande les tuiles"], ok: 0, pourquoi: "C'est l'acte d'acceptation consigné dans un procès-verbal." },
        { q: "Combien de temps dure la garantie de parfait achèvement ?", choix: ["1 an", "2 ans", "10 ans", "6 mois"], ok: 0, pourquoi: "Elle couvre tous les désordres signalés pendant l'année qui suit la réception." },
        { q: "La garantie décennale couvre :", choix: ["Les dommages touchant la solidité ou rendant l'ouvrage inutilisable", "Une ampoule grillée", "La couleur de la peinture", "Les meubles"], ok: 0, pourquoi: "Elle protège 10 ans contre les désordres graves." },
        { q: "Un volet roulant tombe en panne au bout de 18 mois. Quelle garantie ?", choix: ["La garantie biennale (bon fonctionnement)", "La décennale", "Aucune", "La garantie de parfait achèvement seulement"], ok: 0, pourquoi: "Les équipements démontables sont couverts 2 ans par la garantie de bon fonctionnement." },
        { q: "Qu'est-ce que le DOE ?", choix: ["Le dossier des ouvrages exécutés remis au client", "Un outil de mesure", "Une déclaration d'ouverture", "Un type de béton"], ok: 0, pourquoi: "Il rassemble plans à jour, notices et attestations de l'ouvrage." }
      ]
    }
  ]
});
