/* Spécialité — Coffrage, banches et ferraillage (béton armé) */
window.SPECIALITES = window.SPECIALITES || [];
window.SPECIALITES.push({
  id: "beton-arme", nom: "Coffrage, banches et ferraillage", emoji: "🔩",
  resume: "Le cœur du gros œuvre : lire un plan d'armatures, ferrailler, banches, couler et décoffrer.",
  role: "Le **coffreur-bancheur** et le **ferrailleur** fabriquent la structure en béton armé : voiles, poteaux, poutres, dalles. Le béton résiste à la compression, l'acier à la traction : ensemble, ils tiennent le bâtiment. Ce parcours t'apprend les gestes et les contrôles qui font un béton armé solide et durable.",
  missions: [
    "Lire un plan de ferraillage et sa nomenclature (repères, diamètres, espacements)",
    "Façonner, poser et ligaturer les armatures en respectant l'enrobage",
    "Régler, huiler, poser et serrer les banches et les coffrages",
    "Couler et vibrer le béton, puis assurer la cure",
    "Décoffrer, nettoyer le matériel et contrôler le résultat"
  ],
  acces: "CAP constructeur en béton armé du bâtiment, CAP maçon, ou titre professionnel coffreur-bancheur / ferrailleur. Évolution vers chef d'équipe gros œuvre.",
  modules: [
    {
      id: "plan-ferraillage", emoji: "📄", titre: "Lire un plan de ferraillage", duree: "25 min",
      intro: "HA12, e=20, repère 4, nomenclature : on décode tout.",
      illustrations: ["ferraillage-cage"],
      sections: [
        { titre: "Pourquoi de l'acier dans le béton ?", texte: [
          "Le béton résiste très bien quand on l'écrase (**compression**) mais casse facilement quand on le tire (**traction**). On place donc des barres d'acier là où le béton est tiré : en bas d'une poutre ou d'une dalle qui porte, en haut au-dessus des appuis.",
          "C'est le **bureau d'études** qui calcule où mettre les aciers et combien. Sur le chantier, on ne change rien sans son accord : un acier en moins ou mal placé peut faire fissurer, voire céder l'ouvrage."] },
        { titre: "Les aciers et leurs noms", liste: [
          "**HA** = acier à Haute Adhérence (barres avec des nervures qui accrochent le béton). Nuance courante : B500.",
          "Diamètres courants en mm : **6, 8, 10, 12, 14, 16, 20, 25, 32**.",
          "**4 HA12** = 4 barres HA de 12 mm de diamètre.",
          "**HA8 e=20** = barres HA8 espacées de 20 cm (« e » = espacement).",
          "**Filantes** (ou longitudinales) : les barres qui suivent la longueur de l'élément.",
          "**Cadres, étriers, épingles** : les armatures transversales qui entourent ou relient les filantes.",
          "**Treillis soudé** (ex. ST 25 C) : panneau de barres soudées en quadrillage, pour dalles et dallages."] },
        { titre: "Le plan et la nomenclature", texte: [
          "Chaque forme d'acier porte un **repère** (un numéro dans un cercle). La **nomenclature** (tableau) donne pour chaque repère : le nombre, le diamètre, la forme avec ses cotes, la longueur développée et le poids.",
          "Le poids d'une barre se calcule vite : **poids (kg/m) ≈ d² ÷ 162** avec d en mm. HA10 ≈ 0,62 kg/m ; HA12 ≈ 0,89 kg/m ; HA16 ≈ 1,58 kg/m. Utile pour vérifier une livraison ou commander."] }
      ],
      retenir: [
        "Béton = compression, acier = traction.",
        "4 HA12 = 4 barres de 12 mm ; e=20 = un acier tous les 20 cm.",
        "On suit le plan du bureau d'études, on ne modifie rien sans accord écrit.",
        "Poids d'une barre ≈ d² ÷ 162 kg par mètre."
      ],
      terrain: "Avant de ferrailler, vérifie que tu as **le dernier indice du plan** (la lettre A, B, C… dans le cartouche). Ferrailler avec un plan périmé, c'est démolir après.",
      quiz: [
        { q: "Que signifie « 4 HA12 » sur un plan ?", choix: ["4 barres haute adhérence de 12 mm", "Une barre de 4 m en 12 mm", "Un acier tous les 12 cm sur 4 m", "4 cadres de 12 cm"], ok: 0, pourquoi: "Le premier nombre est la quantité, HA le type d'acier, le dernier le diamètre en mm." },
        { q: "« HA10 e=15 » veut dire :", choix: ["Des HA10 espacées de 15 cm", "15 barres de HA10", "Un enrobage de 15 mm", "Une longueur de 15 m"], ok: 0, pourquoi: "« e » indique l'espacement entre les barres, en cm." },
        { q: "Pourquoi met-on de l'acier dans le béton ?", choix: ["Parce que le béton résiste mal à la traction", "Pour que le béton sèche plus vite", "Pour l'isolation", "Pour économiser du béton"], ok: 0, pourquoi: "Le béton résiste bien à la compression mais mal à la traction : l'acier reprend les efforts de traction." },
        { q: "Où trouve-t-on le nombre, la forme et la longueur de chaque acier ?", choix: ["Dans la nomenclature", "Sur le bon de livraison du béton", "Dans le PPSPS", "Sur la fiche de la grue"], ok: 0, pourquoi: "La nomenclature associe chaque repère à son nombre, son diamètre, sa forme et sa longueur." },
        { q: "Combien pèse environ 1 m de HA16 (d² ÷ 162) ?", choix: ["Environ 1,6 kg", "Environ 16 kg", "Environ 0,16 kg", "Environ 6 kg"], ok: 0, pourquoi: "16 × 16 = 256 ; 256 ÷ 162 ≈ 1,58 kg par mètre." }
      ]
    },
    {
      id: "poser-armatures", emoji: "🔗", titre: "Façonner et poser les armatures", duree: "30 min",
      intro: "Couper, cintrer, ligaturer, caler : le bon geste au bon endroit.",
      illustrations: ["enrobage", "recouvrement"],
      sections: [
        { titre: "Façonner", liste: [
          "On **coupe** à la cisaille ou à la coupeuse, jamais au chalumeau sur un acier qui travaille.",
          "On **cintre** (plie) à froid, autour d'un mandrin du diamètre prévu. On ne redresse pas une barre pliée pour la réutiliser : elle est fragilisée.",
          "Les aciers façonnés en usine arrivent étiquetés par repère : garde les étiquettes jusqu'à la pose."] },
        { titre: "L'enrobage : la règle d'or", texte: [
          "L'**enrobage**, c'est l'épaisseur de béton entre l'acier et la surface. Il protège l'acier de la rouille et du feu. Il est indiqué sur le plan : souvent autour de 3 cm à l'intérieur, 4 à 5 cm dehors ou contre la terre.",
          "On le garantit avec des **cales** (plastique ou béton) sous et sur les côtés des cages, et des **chaises** (distanciers) pour tenir la nappe du haut d'une dalle. Un acier posé directement sur le coffrage ou la terre, c'est un acier qui rouillera."] },
        { titre: "Recouvrements et ligatures", liste: [
          "Quand une barre n'est pas assez longue, on la fait **chevaucher** la suivante : c'est le **recouvrement**. Sa longueur est donnée par le plan (souvent de l'ordre de 40 à 50 fois le diamètre).",
          "On **ligature** au fil recuit (tourne-fil ou lieuse) aux croisements, pour que rien ne bouge au coulage.",
          "On décale les recouvrements entre barres voisines quand le plan le demande.",
          "Les **attentes** (aciers qui dépassent pour la suite) sont protégées par des **embouts de protection** : une chute sur une attente nue peut tuer."] },
        { titre: "Stocker et manutentionner", liste: [
          "Aciers stockés **sur des bastaings**, hors de la boue, triés par repère.",
          "Gants obligatoires : bavures et extrémités coupent.",
          "Les bottes lourdes se lèvent à la grue avec des élingues adaptées, jamais en passant sous la charge."] }
      ],
      danger: "Les **attentes sans embout** sont l'une des causes d'empalement sur les chantiers. Pose les embouts dès que les aciers sortent, et ne les retire qu'au moment de continuer.",
      retenir: [
        "Couper et plier à froid ; ne jamais redresser une barre pliée.",
        "L'enrobage se garantit avec des cales et des chaises, pas « à l'œil ».",
        "Recouvrement : longueur donnée par le plan, barres ligaturées.",
        "Attentes = embouts de protection, toujours."
      ],
      terrain: "Avant le coulage, passe la main sous la cage : si tu touches un acier contre le coffrage ou au sol, il manque une cale. 5 minutes de contrôle évitent des années de fissures.",
      quiz: [
        { q: "À quoi sert l'enrobage ?", choix: ["Protéger l'acier de la rouille et du feu", "Rendre le béton plus lisse", "Accélérer le séchage", "Économiser de l'acier"], ok: 0, pourquoi: "L'épaisseur de béton autour de l'acier le protège de l'eau, de l'air (rouille) et de la chaleur en cas d'incendie." },
        { q: "Comment garantit-on l'enrobage ?", choix: ["Avec des cales et des distanciers", "En vibrant plus longtemps", "En mouillant le coffrage", "En posant les aciers sur la terre"], ok: 0, pourquoi: "Cales et chaises tiennent l'acier à la bonne distance des faces." },
        { q: "Une barre a été pliée au mauvais endroit. Que fais-tu ?", choix: ["Je la mets de côté et j'en façonne une neuve", "Je la redresse au chalumeau", "Je la redresse au marteau", "Je la pose quand même"], ok: 0, pourquoi: "Redresser une barre la fragilise ; le chauffage modifie l'acier. On en façonne une neuve." },
        { q: "Qui fixe la longueur d'un recouvrement ?", choix: ["Le bureau d'études, sur le plan", "Le chauffeur de la toupie", "Le ferrailleur, à l'œil", "Le client"], ok: 0, pourquoi: "La longueur de recouvrement dépend du calcul : elle figure sur le plan." },
        { q: "Des aciers en attente dépassent d'un voile. Que faut-il ?", choix: ["Des embouts de protection", "Rien, c'est provisoire", "Les plier vers le sol", "Les peindre en rouge"], ok: 0, pourquoi: "Les embouts évitent l'empalement en cas de chute. Plier les attentes les abîme." }
      ]
    },
    {
      id: "banches", emoji: "🧱", titre: "Banches et coffrages", duree: "30 min",
      intro: "Régler, huiler, poser, serrer… et ne jamais laisser une banche sans béquilles.",
      illustrations: ["banche"],
      sections: [
        { titre: "Les types de coffrage", liste: [
          "**Coffrage traditionnel** : planches, contreplaqué, bois. Souple pour les formes particulières, mais lent.",
          "**Banches** : grands panneaux métalliques pour les voiles (murs). Rapides et précis.",
          "**Coffrages de poteaux**, **tables** et **prédalles** pour les poteaux et les planchers.",
          "**Réservations** : boîtes, mannequins de portes et fenêtres, fourreaux pour les réseaux, fixés dans le coffrage avant de couler."] },
        { titre: "Anatomie d'une banche", liste: [
          "La **peau** (tôle) qui donne la face du mur.",
          "La **passerelle** de travail en haut, avec ses **garde-corps** et son accès (échelle intégrée).",
          "Les **béquilles** (ou stabilisateurs, étais tire-pousse) qui la tiennent verticale et servent à régler l'aplomb.",
          "Les **tiges de serrage** qui relient les deux faces à travers le mur, dans des fourreaux (ou cônes) pour être récupérées.",
          "Les **anneaux de levage** pour la grue."] },
        { titre: "La mise en place, étape par étape", liste: [
          "1. Traçage au sol (trait du voile, about, réservations) et contrôle des attentes.",
          "2. **Huilage** de la peau (huile de décoffrage, sans excès).",
          "3. Pose de la **première face** à la grue, réglage de l'aplomb avec les béquilles.",
          "4. Pose des **aciers**, des réservations et des **abouts** (fermeture en bout de voile).",
          "5. Approche de la **deuxième face**, mise en place des tiges, **serrage**.",
          "6. Contrôle : aplomb, alignement, épaisseur, étanchéité en pied (calfeutrage), garde-corps en place."] },
        { titre: "La rotation des banches", texte: [
          "Sur un bâtiment, on n'a pas assez de banches pour tous les voiles : on les **fait tourner**. La **rotation**, c'est le cycle que suit un jeu de banches d'un voile à l'autre, en général **un cycle par jour** : le matin on décoffre le voile coulé la veille, on nettoie et on huile, on repositionne sur le voile suivant, on ferraille et on ferme, et l'après-midi on coule.",
          "Le **plan de rotation** (préparé par le chef de chantier ou le bureau des méthodes) découpe chaque étage en **plots** (une journée de travail) et indique quelle banche va où, dans quel ordre. Il tient compte du nombre de banches, de la grue (un seul levage à la fois), de l'équipe et du temps de durcissement du béton."],
          liste: [
            "**Matin** : décoffrage du voile de la veille (banche élinguée avant de libérer les tiges).",
            "**Fin de matinée** : nettoyage, huilage, déplacement à la grue vers le plot du jour.",
            "**Début d'après-midi** : réglage, aciers et réservations contrôlés, fermeture et serrage.",
            "**Fin de journée** : coulage et vibration, protection du béton.",
            "Une rotation qui « tient » demande que **les aciers et les réservations soient prêts à l'avance** : sinon la grue et l'équipe attendent."] },
        { titre: "Sécurité des banches", texte: [
          "Une banche pèse plusieurs centaines de kilos à plusieurs tonnes et prend le vent comme une voile. **Posée seule, elle doit toujours être stabilisée** (béquilles ouvertes ou râtelier). On ne monte jamais sur une banche suspendue à la grue, et on ne passe pas dessous.",
          "Par vent fort, la grue s'arrête et les banches restent stabilisées. Le décoffrage se fait avec la banche **élinguée** avant de desserrer complètement les tiges."] }
      ],
      danger: "Une banche non stabilisée peut basculer d'un coup de vent et écraser quelqu'un. Béquilles ouvertes ou râtelier, **à chaque fois**, même « pour deux minutes ».",
      retenir: [
        "Huiler, poser la première face, régler l'aplomb, ferrailler, fermer, serrer.",
        "Passerelle avec garde-corps, accès par l'échelle de la banche.",
        "Jamais de banche debout sans stabilisation.",
        "Décoffrage : banche accrochée à la grue avant de libérer les tiges."
      ],
      terrain: "Contrôle l'aplomb à **deux endroits** sur chaque banche, avant ET après serrage : le serrage fait souvent bouger le réglage.",
      quiz: [
        { q: "Que fait-on juste avant de poser une banche ?", choix: ["On huile la peau", "On la mouille au jet", "On la peint", "On retire les garde-corps"], ok: 0, pourquoi: "L'huile de décoffrage évite que le béton colle à la tôle." },
        { q: "À quoi servent les béquilles d'une banche ?", choix: ["La stabiliser et régler l'aplomb", "Accéder à la passerelle", "Serrer les deux faces", "Fixer les aciers"], ok: 0, pourquoi: "Les béquilles (stabilisateurs) tiennent la banche debout et permettent de la mettre d'aplomb." },
        { q: "Une banche doit rester posée seule quelques minutes. Que fais-tu ?", choix: ["Je la stabilise (béquilles ou râtelier)", "Je la laisse, ce n'est pas long", "Je la tiens à la main", "Je la pose contre un mur frais"], ok: 0, pourquoi: "Une banche non stabilisée peut basculer avec le vent : on la stabilise à chaque fois." },
        { q: "Qu'est-ce qui relie les deux faces de banche à travers le mur ?", choix: ["Les tiges de serrage", "Les béquilles", "Les cales d'enrobage", "Les élingues"], ok: 0, pourquoi: "Les tiges traversent le voile (dans des fourreaux) et serrent les deux faces." },
        { q: "Au décoffrage, dans quel ordre ?", choix: ["Accrocher la banche à la grue, puis libérer les tiges", "Libérer les tiges, puis appeler la grue", "Pousser la banche à la main", "Retirer les béquilles d'abord"], ok: 0, pourquoi: "La banche doit être tenue par la grue avant d'être libérée, sinon elle peut tomber." },
        { q: "Qu'est-ce que la rotation des banches ?", choix: ["Le cycle d'un jeu de banches d'un voile à l'autre, souvent un par jour", "Le fait de tourner la banche sur elle-même", "Le nettoyage des banches le vendredi", "La vérification annuelle des banches"], ok: 0, pourquoi: "On décoffre, nettoie, huile, repositionne, ferme et coule : un plot par jour selon le plan de rotation." }
      ]
    },
    {
      id: "couler", emoji: "🚛", titre: "Couler et vibrer le béton", duree: "25 min",
      intro: "Recevoir la toupie, couler par couches, vibrer, puis protéger le béton.",
      illustrations: ["coulage"],
      sections: [
        { titre: "Avant de couler", liste: [
          "**Réception du ferraillage** faite et signée (autocontrôle ou contrôle du chef).",
          "Coffrage propre (pas de déchets, de fil, de sciure au fond), réservations en place.",
          "Matériel prêt : benne ou pompe, aiguille vibrante qui marche, éclairage si besoin.",
          "**Bon de livraison** contrôlé à l'arrivée de la toupie : classe de résistance (ex. C25/30), consistance (ex. S3), heure de chargement."] },
        { titre: "Pendant le coulage", liste: [
          "On **n'ajoute jamais d'eau** dans la toupie pour « fluidifier » : le béton perd sa résistance.",
          "On coule par **couches d'environ 50 cm**, réparties sur toute la longueur.",
          "On limite la **hauteur de chute** (souvent autour de 1,5 m) : au-delà, on utilise une goulotte ou un tube, sinon les cailloux se séparent (ségrégation).",
          "On **vibre** chaque couche : aiguille enfoncée verticalement, tous les 30 à 50 cm, en pénétrant un peu la couche du dessous, puis remontée lentement. On arrête quand la surface devient brillante et que les bulles ne sortent plus.",
          "On évite de vibrer contre les aciers et le coffrage, et on ne vibre pas trop longtemps au même endroit."] },
        { titre: "Après : la cure", texte: [
          "Le béton durcit par une réaction chimique qui a besoin d'eau. Soleil, vent et gel le font sécher trop vite ou l'abîment. On le **protège** quelques jours : arrosage, produit de cure, bâche ou isolant par temps froid.",
          "Pour les ouvrages importants, des **éprouvettes** sont prélevées pour vérifier la résistance en laboratoire."] }
      ],
      retenir: [
        "Contrôler le bon de livraison ; jamais d'eau ajoutée.",
        "Couches d'environ 50 cm, chute limitée.",
        "Vibrer verticalement, régulièrement, sans excès.",
        "Protéger le béton frais : c'est la cure."
      ],
      terrain: "Note sur le bon de livraison l'heure d'arrivée et la fin de déchargement. Si la toupie attend trop longtemps, préviens ton chef avant de couler.",
      quiz: [
        { q: "Le béton paraît trop ferme. Peut-on ajouter de l'eau dans la toupie ?", choix: ["Non, il perdrait de sa résistance", "Oui, un seau ou deux", "Oui, si le chauffeur est d'accord", "Oui, par temps chaud"], ok: 0, pourquoi: "L'eau ajoutée augmente le rapport eau/ciment : le béton devient moins résistant et plus poreux." },
        { q: "Comment utilise-t-on l'aiguille vibrante ?", choix: ["Verticalement, tous les 30 à 50 cm, remontée lentement", "À plat, en la traînant", "Contre les aciers pour les faire vibrer", "Une seule fois au milieu"], ok: 0, pourquoi: "On la plonge verticalement à intervalles réguliers et on la retire doucement pour laisser l'air sortir." },
        { q: "Pourquoi limite-t-on la hauteur de chute du béton ?", choix: ["Pour éviter que les cailloux se séparent", "Pour aller plus vite", "Pour économiser du ciment", "Pour protéger la grue"], ok: 0, pourquoi: "Une grande chute provoque la ségrégation : les gros granulats se séparent du mortier." },
        { q: "Qu'est-ce que la cure du béton ?", choix: ["Le protéger pour qu'il ne sèche pas trop vite", "Le décoffrer le plus tôt possible", "Le peindre", "Le chauffer au chalumeau"], ok: 0, pourquoi: "La cure garde l'humidité et protège du soleil, du vent et du gel pendant le durcissement." },
        { q: "Sur le bon de livraison, que vérifie-t-on ?", choix: ["La classe de résistance, la consistance et l'heure de chargement", "Seulement le prix", "Le nom du chauffeur", "La couleur de la toupie"], ok: 0, pourquoi: "On vérifie que le béton livré est bien celui commandé et qu'il n'est pas trop ancien." }
      ]
    },
    {
      id: "decoffrer", emoji: "🔍", titre: "Décoffrer et contrôler", duree: "20 min",
      intro: "Le bon moment pour décoffrer, les défauts à repérer et l'entretien du matériel.",
      sections: [
        { titre: "Quand décoffrer ?", liste: [
          "Un **voile** se décoffre souvent le lendemain, quand le béton est assez dur pour tenir seul.",
          "Une **dalle ou une poutre** reste **étayée** beaucoup plus longtemps : elle doit porter son poids. Les délais sont fixés par l'entreprise ou le bureau d'études.",
          "Par temps froid, le béton durcit moins vite : on attend davantage."] },
        { titre: "Les défauts à repérer", liste: [
          "**Nid de cailloux** : zone où le mortier manque (vibration insuffisante, fuite en pied).",
          "**Bullage** : petites bulles en surface (huilage ou vibration).",
          "**Balèvre** : décalage entre deux panneaux.",
          "**Acier apparent** : enrobage non respecté, à signaler tout de suite.",
          "**Fissures** : à signaler et à faire examiner, ne pas les masquer."] },
        { titre: "Entretien et autocontrôle", liste: [
          "Les banches sont **nettoyées** (laitance grattée) et rangées stabilisées.",
          "On remplit la **fiche d'autocontrôle** : ferraillage vérifié, aplomb, dimensions, réservations, défauts constatés.",
          "Les réparations (ragréage) se font avec les produits prévus, après accord."] }
      ],
      retenir: [
        "Voile : souvent le lendemain ; dalle : étais maintenus selon les consignes.",
        "Nid de cailloux, bullage, balèvre, acier apparent, fissure : on signale.",
        "Banches nettoyées et rangées stabilisées.",
        "L'autocontrôle écrit protège l'équipe."
      ],
      terrain: "Prends une **photo datée** de chaque ferraillage avant coulage et de chaque voile après décoffrage : c'est la meilleure preuve en cas de litige.",
      quiz: [
        { q: "Une zone du voile montre des cailloux sans mortier. C'est :", choix: ["Un nid de cailloux", "Une balèvre", "Du bullage", "Une réservation"], ok: 0, pourquoi: "Le nid de cailloux vient d'un manque de vibration ou d'une fuite de laitance en pied de coffrage." },
        { q: "Une dalle peut-elle être désétayée en même temps que les voiles ?", choix: ["Non, elle reste étayée selon les consignes", "Oui, le lendemain", "Oui, dès qu'elle est sèche au toucher", "Oui, si personne ne marche dessus"], ok: 0, pourquoi: "Une dalle doit porter son poids : les étais restent jusqu'à ce que le béton ait la résistance prévue." },
        { q: "Tu vois un acier apparent après décoffrage. Que fais-tu ?", choix: ["Je le signale tout de suite", "Je le recouvre d'enduit discrètement", "Je le coupe", "Rien"], ok: 0, pourquoi: "Un acier apparent rouillera : il faut le signaler pour qu'une réparation adaptée soit décidée." },
        { q: "Après décoffrage, les banches sont :", choix: ["Nettoyées et rangées stabilisées", "Laissées couchées dans la boue", "Repeintes", "Posées debout sans béquilles"], ok: 0, pourquoi: "On gratte la laitance pour garder une belle peau et on stocke stabilisé." },
        { q: "À quoi sert la fiche d'autocontrôle ?", choix: ["Garder la trace des contrôles faits", "Commander le béton", "Calculer la paie", "Remplacer le plan"], ok: 0, pourquoi: "Elle prouve ce qui a été vérifié et quand : utile pour la qualité et en cas de litige." }
      ]
    }
  ]
});
