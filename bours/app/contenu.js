/* Jack Bours : tout le contenu des cours.
   Pour ajouter une leçon : copier un bloc { id, titre, ... } dans le bon niveau.
   - texte : les paragraphes de la leçon
   - retenir : les points clés
   - cartes : les cartes mémoire { r: recto, v: verso }
   - quiz : { q: question, c: [choix], b: index de la bonne réponse (0 = la 1re), p: pourquoi }
   - mission (facultatif) : id d'une mission du simulateur liée à la leçon */
window.JB_NIVEAUX = [
{
  id: "n1", nom: "Débutant", emoji: "🌱", sousTitre: "Les bases de la Bourse",
  lecons: [
  {
    id: "bourse", titre: "C'est quoi la Bourse ?", emoji: "🏛️",
    texte: [
      "La Bourse est un marché, comme un marché de fruits et légumes, sauf qu'on y échange des morceaux d'entreprises (les actions) et des prêts (les obligations).",
      "Quand une entreprise veut grandir, elle peut vendre des actions au public pour récupérer de l'argent : c'est l'introduction en Bourse. C'est le marché primaire. Ensuite, ces actions s'échangent entre investisseurs, tous les jours : c'est le marché secondaire.",
      "En France, la Bourse s'appelle Euronext Paris. Aux États-Unis, les plus connues sont le NYSE et le Nasdaq. Les échanges se font par ordinateur, pendant les heures d'ouverture (à Paris, de 9 h à 17 h 30 en semaine)."
    ],
    retenir: ["La Bourse = un marché où l'on achète et vend des actions et des obligations.", "Marché primaire : l'entreprise vend ses actions. Marché secondaire : les investisseurs se les échangent.", "Paris : Euronext, ouvert de 9 h à 17 h 30."],
    cartes: [
      { r: "Bourse", v: "Marché organisé où l'on échange des titres financiers (actions, obligations…)." },
      { r: "Introduction en Bourse", v: "Moment où une entreprise vend pour la première fois ses actions au public (en anglais : IPO)." },
      { r: "Marché secondaire", v: "Marché où les investisseurs s'échangent entre eux des titres déjà émis." }
    ],
    quiz: [
      { q: "Que peut-on acheter en Bourse ?", c: ["Des actions et des obligations", "Uniquement des devises", "Des biens immobiliers en direct"], b: 0, p: "La Bourse sert surtout à échanger des actions (parts d'entreprises) et des obligations (prêts)." },
      { q: "Comment s'appelle la Bourse de Paris ?", c: ["Nasdaq", "Euronext Paris", "Wall Street"], b: 1, p: "La Bourse de Paris fait partie du groupe Euronext. Wall Street et le Nasdaq sont à New York." },
      { q: "Pourquoi une entreprise entre-t-elle en Bourse ?", c: ["Pour payer moins d'impôts", "Pour lever de l'argent et financer sa croissance", "Pour fermer plus vite"], b: 1, p: "En vendant des actions au public, l'entreprise récupère de l'argent pour investir et grandir." },
      { q: "Quand deux investisseurs s'échangent une action déjà existante, on est sur…", c: ["le marché primaire", "le marché secondaire", "le marché noir"], b: 1, p: "Le marché secondaire, c'est l'échange entre investisseurs. L'entreprise ne touche pas cet argent." }
    ]
  },
  {
    id: "action", titre: "L'action", emoji: "🧩", mission: "premier-achat",
    texte: [
      "Une action est une petite part d'une entreprise. Si une entreprise est découpée en 1 million d'actions et que vous en avez 1 000, vous possédez 0,1 % de l'entreprise : vous êtes actionnaire.",
      "Être actionnaire donne des droits : voter aux assemblées générales, et recevoir une part des bénéfices quand l'entreprise en distribue. Cette part s'appelle le dividende.",
      "Le prix d'une action bouge sans arrêt. Il dépend de l'offre et de la demande : si beaucoup de gens veulent acheter, le prix monte ; si beaucoup veulent vendre, il baisse. Ce que les gens pensent de l'avenir de l'entreprise compte énormément."
    ],
    retenir: ["Action = une part d'entreprise.", "L'actionnaire peut voter et toucher des dividendes.", "Le prix dépend de l'offre et de la demande."],
    cartes: [
      { r: "Action", v: "Titre de propriété représentant une part du capital d'une entreprise." },
      { r: "Actionnaire", v: "Personne qui possède des actions d'une entreprise." },
      { r: "Dividende", v: "Part des bénéfices que l'entreprise verse à ses actionnaires." }
    ],
    quiz: [
      { q: "Si vous avez 500 actions d'une entreprise qui en compte 100 000, vous possédez…", c: ["5 %", "0,5 %", "50 %"], b: 1, p: "500 ÷ 100 000 = 0,005, soit 0,5 % de l'entreprise." },
      { q: "Comment s'appelle la part des bénéfices versée aux actionnaires ?", c: ["Le coupon", "Le dividende", "Le salaire"], b: 1, p: "Le dividende. Le « coupon », c'est plutôt l'intérêt d'une obligation." },
      { q: "Beaucoup de gens veulent acheter une action et peu veulent la vendre. Que fait le prix ?", c: ["Il monte", "Il baisse", "Il ne bouge pas"], b: 0, p: "Quand la demande dépasse l'offre, les acheteurs acceptent de payer plus cher : le prix monte." },
      { q: "Une entreprise est-elle obligée de verser un dividende ?", c: ["Oui, chaque année", "Non, elle décide", "Seulement si l'action baisse"], b: 1, p: "Le dividende n'est jamais garanti. Certaines entreprises préfèrent réinvestir leurs bénéfices." }
    ]
  },
  {
    id: "acheter", titre: "Acheter et vendre", emoji: "🛒", mission: "premiere-vente",
    texte: [
      "Pour acheter des actions, il faut passer par un intermédiaire : une banque ou un courtier en ligne. On y ouvre un compte spécial : un compte-titres ordinaire (CTO) ou un PEA (Plan d'épargne en actions, réservé aux actions européennes).",
      "On passe ensuite un ordre : « acheter 10 actions de telle entreprise ». Le courtier prend des frais à chaque ordre, souvent un petit pourcentage avec un minimum. Les frais réduisent vos gains : les petits ordres très fréquents coûtent cher.",
      "Si vous revendez plus cher que vous n'avez acheté, vous faites une plus-value. Si vous revendez moins cher, c'est une moins-value. Tant que vous n'avez pas vendu, le gain ou la perte est « latent » : il n'existe que sur le papier."
    ],
    retenir: ["On passe par une banque ou un courtier, avec un CTO ou un PEA.", "Chaque ordre a des frais.", "Plus-value = gain à la revente ; latent = pas encore vendu."],
    cartes: [
      { r: "Courtier", v: "Intermédiaire qui passe vos ordres en Bourse (en anglais : broker)." },
      { r: "Plus-value", v: "Gain réalisé quand on revend plus cher qu'on a acheté." },
      { r: "Gain latent", v: "Gain qui existe sur le papier tant que la position n'est pas vendue." },
      { r: "PEA", v: "Plan d'épargne en actions : enveloppe française pour actions européennes, avec un avantage fiscal après 5 ans." }
    ],
    quiz: [
      { q: "Vous achetez à 20 € et revendez à 26 €. Vous faites…", c: ["une moins-value de 6 €", "une plus-value de 6 € par action (avant frais)", "aucun gain"], b: 1, p: "26 − 20 = 6 € de plus-value par action, à quoi il faut retirer les frais." },
      { q: "Votre action a monté mais vous ne l'avez pas vendue. Le gain est…", c: ["latent", "réalisé", "imposé"], b: 0, p: "Tant que vous n'avez pas vendu, c'est un gain latent : il peut encore disparaître." },
      { q: "Pourquoi faut-il faire attention aux frais ?", c: ["Ils sont toujours gratuits", "Ils réduisent les gains, surtout sur les petits ordres", "Ils augmentent le prix de l'action"], b: 1, p: "Avec 1 € de frais minimum, un ordre de 50 € coûte déjà 2 %. Ça s'accumule vite." },
      { q: "Le PEA permet d'acheter…", c: ["des actions européennes", "des actions du monde entier sans limite", "des cryptomonnaies"], b: 0, p: "Le PEA est réservé aux actions européennes (et à certains fonds qui respectent cette règle)." }
    ]
  },
  {
    id: "indices", titre: "Les indices", emoji: "📊", mission: "acheter-etf",
    texte: [
      "Un indice boursier est un « panier » d'actions qui donne la température du marché. Le CAC 40 regroupe 40 grandes entreprises françaises. Le S&P 500 suit 500 grandes entreprises américaines.",
      "Quand on dit « la Bourse a monté de 1 % aujourd'hui », on parle en général d'un indice. Dans le simulateur, l'indice s'appelle JUNGLE 10 : il suit les 10 entreprises fictives du marché.",
      "On ne peut pas acheter un indice directement, mais on peut acheter un ETF (aussi appelé tracker) qui le copie. C'est une façon simple d'acheter tout le panier d'un seul coup."
    ],
    retenir: ["Indice = panier d'actions qui mesure le marché.", "CAC 40 (France), S&P 500 (États-Unis).", "Un ETF permet d'acheter tout l'indice d'un coup."],
    cartes: [
      { r: "Indice boursier", v: "Panier d'actions dont la valeur résume l'évolution d'un marché." },
      { r: "CAC 40", v: "Indice des 40 plus grandes entreprises cotées à Paris." },
      { r: "ETF (tracker)", v: "Fonds coté en Bourse qui copie un indice." }
    ],
    quiz: [
      { q: "Combien d'entreprises dans le CAC 40 ?", c: ["400", "40", "4"], b: 1, p: "Comme son nom l'indique : 40 grandes entreprises françaises." },
      { q: "À quoi sert un indice ?", c: ["À donner la température d'un marché", "À fixer le prix des actions", "À payer les dividendes"], b: 0, p: "Un indice résume l'évolution d'un ensemble d'actions. Il ne fixe aucun prix." },
      { q: "Comment acheter facilement tout un indice ?", c: ["Avec un ETF", "Avec un livret A", "C'est impossible"], b: 0, p: "Un ETF (ou tracker) copie l'indice : en l'achetant, on a un peu de chaque entreprise." },
      { q: "Le S&P 500 concerne surtout…", c: ["la France", "les États-Unis", "le Japon"], b: 1, p: "Le S&P 500 suit 500 grandes entreprises américaines." }
    ]
  },
  {
    id: "risque", titre: "Le risque", emoji: "⚠️",
    texte: [
      "En Bourse, on peut perdre de l'argent, parfois beaucoup. Une action peut baisser de 30 %, 50 %, et même tomber à zéro si l'entreprise fait faillite. Rien n'est garanti.",
      "La volatilité mesure à quel point un prix bouge. Une action très volatile peut monter vite… et descendre aussi vite. En général, plus on espère gagner, plus on accepte de risque.",
      "Trois règles de bon sens : n'investir que l'argent dont on n'aura pas besoin avant longtemps ; garder une épargne de précaution à côté ; ne jamais emprunter pour jouer en Bourse. Plus on reste longtemps investi (l'horizon), plus les mauvaises années ont le temps d'être rattrapées, sans aucune garantie."
    ],
    retenir: ["On peut perdre tout ou partie de sa mise.", "Volatilité = ampleur des variations.", "Argent dont on n'a pas besoin, épargne de précaution, horizon long."],
    cartes: [
      { r: "Volatilité", v: "Mesure de l'ampleur des variations d'un prix. Forte volatilité = gros mouvements." },
      { r: "Horizon de placement", v: "Durée pendant laquelle on prévoit de laisser l'argent investi." },
      { r: "Épargne de précaution", v: "Argent disponible tout de suite pour les imprévus, à ne pas placer en Bourse." }
    ],
    quiz: [
      { q: "Une action peut-elle tomber à zéro ?", c: ["Non, jamais", "Oui, si l'entreprise fait faillite", "Seulement aux États-Unis"], b: 1, p: "En cas de faillite, les actionnaires passent en dernier et perdent souvent tout." },
      { q: "Une action très volatile…", c: ["bouge peu", "bouge beaucoup, dans les deux sens", "monte toujours"], b: 1, p: "La volatilité mesure l'ampleur des mouvements, à la hausse comme à la baisse." },
      { q: "Quel argent peut-on mettre en Bourse ?", c: ["L'argent du loyer du mois prochain", "Un crédit à la consommation", "De l'argent dont on n'aura pas besoin avant longtemps"], b: 2, p: "Si on a besoin de l'argent au mauvais moment, on risque de devoir vendre en perte." },
      { q: "Un horizon long sert surtout à…", c: ["garantir un gain", "laisser le temps de rattraper les mauvaises années", "éviter les frais"], b: 1, p: "Le temps aide souvent, mais ne garantit jamais rien." }
    ]
  }
  ]
},
{
  id: "n2", nom: "Initié", emoji: "🌿", sousTitre: "Lire un graphique",
  lecons: [
  {
    id: "bougies", titre: "Les bougies japonaises", emoji: "🕯️",
    texte: [
      "Une bougie résume les prix d'une période (un jour, une heure…). Elle donne 4 prix : l'ouverture (le premier prix), la clôture (le dernier), le plus haut et le plus bas.",
      "Le corps de la bougie va de l'ouverture à la clôture. Si la clôture est plus haute que l'ouverture, le prix a monté : la bougie est verte. Si elle est plus basse, la bougie est rouge.",
      "Les mèches (les traits fins au-dessus et en dessous) montrent jusqu'où le prix est allé. Une longue mèche du bas veut dire que le prix est descendu, puis que les acheteurs l'ont fait remonter."
    ],
    retenir: ["4 prix : ouverture, clôture, plus haut, plus bas.", "Verte = clôture au-dessus de l'ouverture. Rouge = en dessous.", "Les mèches montrent les extrêmes."],
    cartes: [
      { r: "Bougie verte", v: "Période où la clôture est au-dessus de l'ouverture : le prix a monté." },
      { r: "Mèche", v: "Trait fin d'une bougie qui montre le plus haut ou le plus bas atteint." },
      { r: "Clôture", v: "Dernier prix de la période. C'est le plus regardé." }
    ],
    quiz: [
      { q: "Une bougie rouge veut dire…", c: ["que la clôture est sous l'ouverture", "que le volume est faible", "que le marché est fermé"], b: 0, p: "Rouge : le prix a fini plus bas qu'il n'a commencé." },
      { q: "Combien de prix une bougie résume-t-elle ?", c: ["2", "4", "10"], b: 1, p: "Ouverture, clôture, plus haut, plus bas." },
      { q: "Que montre une longue mèche du bas ?", c: ["Que le prix n'a jamais baissé", "Que le prix est descendu puis a été racheté", "Une erreur du graphique"], b: 1, p: "Le prix est allé bas, mais les acheteurs l'ont fait remonter avant la clôture." },
      { q: "Le corps de la bougie va…", c: ["du plus bas au plus haut", "de l'ouverture à la clôture", "du lundi au vendredi"], b: 1, p: "Le corps relie l'ouverture et la clôture. Les mèches vont jusqu'aux extrêmes." }
    ]
  },
  {
    id: "tendances", titre: "Les tendances", emoji: "📈",
    texte: [
      "Une tendance haussière, c'est quand les sommets et les creux sont de plus en plus hauts. Une tendance baissière, c'est l'inverse : sommets et creux de plus en plus bas.",
      "Quand le prix fait du sur-place entre deux niveaux, on parle de marché latéral (ou de range).",
      "Un dicton dit « la tendance est ton amie ». Mais une tendance finit toujours par s'arrêter, et le passé ne prédit jamais l'avenir avec certitude."
    ],
    retenir: ["Haussière : sommets et creux montent.", "Baissière : sommets et creux descendent.", "Latérale : le prix tourne en rond."],
    cartes: [
      { r: "Tendance haussière", v: "Suite de sommets et de creux de plus en plus hauts." },
      { r: "Range (marché latéral)", v: "Période où le prix oscille entre deux niveaux sans direction claire." }
    ],
    quiz: [
      { q: "Des creux de plus en plus bas, c'est…", c: ["une tendance baissière", "une tendance haussière", "un range"], b: 0, p: "Sommets et creux qui descendent = tendance baissière." },
      { q: "Un prix qui oscille entre 48 € et 52 € depuis des semaines est en…", c: ["tendance haussière", "range", "krach"], b: 1, p: "Il tourne entre deux niveaux sans direction : c'est un range." },
      { q: "Une tendance haussière va-t-elle forcément continuer ?", c: ["Oui", "Non, aucune tendance n'est garantie", "Oui, si elle dure depuis un mois"], b: 1, p: "Le passé ne garantit pas l'avenir. Toute tendance finit par s'arrêter." }
    ]
  },
  {
    id: "supports", titre: "Supports et résistances", emoji: "🧱",
    texte: [
      "Un support est un niveau de prix où l'action a déjà rebondi plusieurs fois vers le haut : beaucoup d'acheteurs s'y réveillent.",
      "Une résistance est un niveau où le prix a déjà été repoussé vers le bas plusieurs fois : beaucoup de vendeurs y attendent.",
      "Quand le prix casse franchement une résistance, elle devient parfois un support (et inversement). Ce ne sont pas des murs magiques, juste des zones où beaucoup de gens réagissent."
    ],
    retenir: ["Support = plancher où le prix rebondit.", "Résistance = plafond où le prix bloque.", "Une résistance cassée peut devenir un support."],
    cartes: [
      { r: "Support", v: "Zone de prix où les acheteurs ont souvent fait rebondir le cours." },
      { r: "Résistance", v: "Zone de prix où les vendeurs ont souvent bloqué la hausse." }
    ],
    quiz: [
      { q: "Le prix rebondit trois fois sur 30 €. 30 €, c'est…", c: ["une résistance", "un support", "un dividende"], b: 1, p: "Un niveau où le prix rebondit vers le haut est un support." },
      { q: "Une résistance franchement cassée peut devenir…", c: ["un support", "un indice", "une obligation"], b: 0, p: "L'ancien plafond sert souvent de nouveau plancher." },
      { q: "Les supports et résistances sont-ils infaillibles ?", c: ["Oui", "Non, ce sont des zones de réaction", "Seulement le lundi"], b: 1, p: "Ce sont des zones où beaucoup de gens réagissent, pas des garanties." }
    ]
  },
  {
    id: "volume", titre: "Le volume", emoji: "🔊",
    texte: [
      "Le volume, c'est le nombre d'actions échangées pendant une période. Sur le graphique, ce sont les petites barres en bas.",
      "Un mouvement avec beaucoup de volume est plus convaincant : beaucoup de gens y participent. Une hausse avec très peu de volume est plus fragile.",
      "Les gros volumes apparaissent souvent lors d'annonces : résultats, rachat, scandale…"
    ],
    retenir: ["Volume = nombre d'actions échangées.", "Fort volume = mouvement plus solide.", "Les annonces font exploser les volumes."],
    cartes: [
      { r: "Volume", v: "Nombre de titres échangés sur une période." }
    ],
    quiz: [
      { q: "Le volume mesure…", c: ["le prix moyen", "le nombre d'actions échangées", "le bénéfice"], b: 1, p: "C'est la quantité de titres qui ont changé de mains." },
      { q: "Une forte hausse avec un volume énorme est…", c: ["plus convaincante", "sans importance", "forcément une erreur"], b: 0, p: "Beaucoup de participants confirment le mouvement." },
      { q: "Quand voit-on souvent des pics de volume ?", c: ["Lors d'annonces importantes", "Le week-end", "Jamais"], b: 0, p: "Résultats, rachats, mauvaises nouvelles : tout le monde réagit en même temps." }
    ]
  },
  {
    id: "moyennes", titre: "Les moyennes mobiles", emoji: "〰️", mission: "voir-mm",
    texte: [
      "Une moyenne mobile sur 20 jours (MM20) calcule chaque jour la moyenne des 20 dernières clôtures. Elle lisse les prix pour voir la direction générale.",
      "Une MM courte (20 jours) réagit vite. Une MM longue (50 ou 200 jours) est plus lente et montre la tendance de fond.",
      "Quand la MM20 passe au-dessus de la MM50, beaucoup y voient un signal haussier ; en dessous, un signal baissier. Ces signaux arrivent toujours en retard et se trompent souvent dans un marché sans tendance. Dans le simulateur, cochez MM20 et MM50 sur le graphique."
    ],
    retenir: ["MM = moyenne des N dernières clôtures.", "Courte = rapide, longue = tendance de fond.", "Les croisements sont des signaux en retard, pas des certitudes."],
    cartes: [
      { r: "Moyenne mobile (MM20)", v: "Moyenne des 20 dernières clôtures, recalculée chaque jour." },
      { r: "Croisement de moyennes", v: "Quand une MM courte passe au-dessus ou en dessous d'une MM longue." }
    ],
    quiz: [
      { q: "La MM20 est la moyenne…", c: ["des 20 dernières clôtures", "des 20 plus hauts", "de 20 entreprises"], b: 0, p: "On prend les 20 dernières clôtures et on fait la moyenne." },
      { q: "Quelle moyenne réagit le plus vite ?", c: ["MM200", "MM50", "MM20"], b: 2, p: "Moins il y a de jours, plus elle suit vite le prix." },
      { q: "Un défaut des moyennes mobiles ?", c: ["Elles arrivent en retard", "Elles prédisent l'avenir", "Elles sont illégales"], b: 0, p: "Elles sont calculées sur le passé : le signal vient toujours après le mouvement." }
    ]
  }
  ]
},
{
  id: "n3", nom: "Confirmé", emoji: "🌳", sousTitre: "Ordres et gestion du risque",
  lecons: [
  {
    id: "ordres", titre: "Les types d'ordres", emoji: "📝", mission: "ordre-limite",
    texte: [
      "Ordre au marché : vous achetez (ou vendez) tout de suite, au prix du moment. C'est rapide, mais vous ne contrôlez pas exactement le prix.",
      "Ordre à cours limité : vous fixez un prix maximum pour acheter (ou minimum pour vendre). L'ordre attend jusqu'à ce que le prix l'atteigne. Vous contrôlez le prix, mais il peut ne jamais être exécuté.",
      "Ordre stop : il se déclenche quand le prix touche un seuil. Il sert surtout à couper une perte (stop-loss). Attention : si le prix saute le seuil d'un coup (un « gap »), vous serez vendu plus bas que prévu."
    ],
    retenir: ["Au marché : tout de suite, prix non garanti.", "Limité : prix garanti, exécution non garantie.", "Stop : se déclenche à un seuil, pour couper une perte."],
    cartes: [
      { r: "Ordre au marché", v: "Exécuté immédiatement au meilleur prix disponible." },
      { r: "Ordre à cours limité", v: "Exécuté seulement à un prix égal ou meilleur que la limite choisie." },
      { r: "Gap", v: "Saut de prix entre deux séances, sans échanges entre les deux niveaux." }
    ],
    quiz: [
      { q: "Vous voulez acheter, mais pas au-dessus de 40 €. Quel ordre ?", c: ["Au marché", "À cours limité à 40 €", "Stop à 40 €"], b: 1, p: "L'ordre limité fixe un prix maximum à l'achat." },
      { q: "Le défaut d'un ordre limité ?", c: ["Il peut ne jamais être exécuté", "Il coûte toujours plus cher", "Il n'existe pas en France"], b: 0, p: "Si le prix n'atteint jamais votre limite, l'ordre reste en attente." },
      { q: "Pourquoi un stop peut-il être exécuté plus bas que prévu ?", c: ["À cause d'un gap", "À cause du dividende", "Ça n'arrive jamais"], b: 0, p: "Si le prix ouvre directement sous le seuil, la vente se fait au premier prix disponible." }
    ]
  },
  {
    id: "stoploss", titre: "Stop-loss et prise de profit", emoji: "🛑", mission: "stop-loss",
    texte: [
      "Un stop-loss est un ordre de vente automatique placé sous votre prix d'achat. Exemple : achat à 50 €, stop à 45 €. Si le prix tombe à 45 €, vous êtes vendu : la perte est limitée à environ 10 %.",
      "La prise de profit (take profit) fait l'inverse : un ordre de vente limité au-dessus du prix d'achat, pour encaisser le gain automatiquement.",
      "L'intérêt : décider à l'avance, à froid, au lieu de décider dans la panique. Un stop trop serré se déclenche pour rien ; trop large, il ne protège plus beaucoup."
    ],
    retenir: ["Stop-loss = vente auto pour limiter la perte.", "Prise de profit = vente auto pour encaisser le gain.", "On décide avant, pas dans l'émotion."],
    cartes: [
      { r: "Stop-loss", v: "Ordre de vente automatique qui limite la perte si le prix baisse jusqu'à un seuil." },
      { r: "Prise de profit", v: "Ordre de vente à un prix plus haut que l'achat, pour encaisser un gain." }
    ],
    quiz: [
      { q: "Achat à 80 €, stop-loss à 72 €. Perte maximale prévue par action ?", c: ["8 €", "72 €", "80 €"], b: 0, p: "80 − 72 = 8 € par action (hors frais et hors gap)." },
      { q: "Un stop-loss trop serré…", c: ["se déclenche souvent pour rien", "ne se déclenche jamais", "augmente les dividendes"], b: 0, p: "Les petites variations normales suffisent à le toucher." },
      { q: "Le principal intérêt d'un stop-loss ?", c: ["Décider à froid, avant la panique", "Garantir un gain", "Supprimer les frais"], b: 0, p: "On fixe sa limite de perte quand on est calme." }
    ]
  },
  {
    id: "taille", titre: "La taille de position", emoji: "⚖️",
    texte: [
      "La taille de position, c'est combien vous mettez sur une seule action. Beaucoup de traders suivent la règle du 1 % : ne pas risquer plus de 1 à 2 % de son capital sur une seule idée.",
      "Exemple : capital de 10 000 €, risque max 1 % = 100 €. Achat à 50 €, stop à 45 € : on risque 5 € par action. Taille = 100 ÷ 5 = 20 actions.",
      "Cette règle évite qu'une seule erreur coûte très cher. Dix pertes de suite à 1 % font perdre environ 10 %, pas tout le compte."
    ],
    retenir: ["Risquer 1 à 2 % du capital par position.", "Taille = risque accepté ÷ (prix d'achat − stop).", "Aucune position ne doit pouvoir tout faire perdre."],
    cartes: [
      { r: "Règle du 1 %", v: "Ne pas risquer plus de 1 % de son capital sur une seule position." },
      { r: "Calcul de la taille", v: "Nombre d'actions = risque accepté en € ÷ écart entre prix d'achat et stop." }
    ],
    quiz: [
      { q: "Capital 5 000 €, risque 1 %. Combien en € ?", c: ["5 €", "50 €", "500 €"], b: 1, p: "1 % de 5 000 € = 50 €." },
      { q: "Risque 100 €, achat 20 €, stop 18 €. Combien d'actions ?", c: ["50", "5", "100"], b: 0, p: "On risque 2 € par action : 100 ÷ 2 = 50 actions." },
      { q: "Pourquoi limiter le risque par position ?", c: ["Pour qu'une erreur ne ruine pas le compte", "Pour payer moins de frais", "C'est obligatoire par la loi"], b: 0, p: "Même une série de pertes reste supportable." }
    ]
  },
  {
    id: "diversif", titre: "La diversification", emoji: "🧺", mission: "diversifier",
    texte: [
      "« Ne pas mettre tous ses œufs dans le même panier. » Si vous n'avez qu'une action et qu'elle s'effondre, tout votre portefeuille s'effondre.",
      "Diversifier, c'est répartir entre plusieurs entreprises, plusieurs secteurs (tech, santé, énergie…) et parfois plusieurs pays. Quand un secteur souffre, un autre peut tenir.",
      "Attention : avoir 5 actions du même secteur, ce n'est pas vraiment diversifier. Et la diversification réduit le risque propre à une entreprise, pas le risque d'une crise générale où tout baisse ensemble."
    ],
    retenir: ["Répartir entre entreprises, secteurs et pays.", "5 actions du même secteur ≠ diversifié.", "On réduit le risque d'une entreprise, pas celui du marché entier."],
    cartes: [
      { r: "Diversification", v: "Répartir son argent sur plusieurs placements pour réduire le risque." },
      { r: "Secteur", v: "Famille d'activités : tech, santé, énergie, banque…" }
    ],
    quiz: [
      { q: "Lequel de ces portefeuilles est le plus diversifié ?", c: ["3 banques", "1 tech, 1 santé, 1 énergie", "1 seule action"], b: 1, p: "Trois secteurs différents réagissent moins pareil que trois banques." },
      { q: "La diversification protège-t-elle d'un krach général ?", c: ["Oui, totalement", "Non, pas du risque de marché", "Seulement le vendredi"], b: 1, p: "Quand tout le marché baisse, presque tout baisse ensemble." },
      { q: "Un ETF sur un grand indice est…", c: ["très concentré", "déjà diversifié", "interdit au PEA"], b: 1, p: "Il contient des dizaines ou des centaines d'entreprises." }
    ]
  },
  {
    id: "ratio", titre: "Le ratio risque / rendement", emoji: "🎯",
    texte: [
      "Avant d'acheter, on compare ce qu'on risque et ce qu'on espère gagner. Achat 50 €, stop 45 € (risque 5 €), objectif 60 € (gain 10 €) : le ratio est de 1 pour 2.",
      "Avec un ratio de 1 pour 2, même en ayant raison seulement une fois sur deux, on gagne plus qu'on ne perd (hors frais).",
      "Un bon ratio ne rend pas l'opération sûre : l'objectif peut ne jamais être atteint. C'est un outil pour trier les idées, pas une promesse."
    ],
    retenir: ["Ratio = gain espéré ÷ risque.", "1 pour 2 ou plus : on peut avoir tort souvent.", "Un outil de tri, pas une garantie."],
    cartes: [
      { r: "Ratio risque/rendement", v: "Comparaison entre la perte possible (jusqu'au stop) et le gain visé (jusqu'à l'objectif)." }
    ],
    quiz: [
      { q: "Achat 100 €, stop 95 €, objectif 115 €. Ratio ?", c: ["1 pour 3", "1 pour 1", "3 pour 1 contre vous"], b: 0, p: "Risque 5 €, gain visé 15 € : 15 ÷ 5 = 3, soit 1 pour 3." },
      { q: "Avec un ratio de 1 pour 2 et une réussite sur deux, on est…", c: ["gagnant (hors frais)", "perdant", "à zéro pile"], b: 0, p: "Une perte de 1, un gain de 2 : bilan +1." },
      { q: "Un bon ratio garantit-il un gain ?", c: ["Oui", "Non", "Oui si le volume est fort"], b: 1, p: "L'objectif peut ne jamais être atteint. Rien n'est garanti." }
    ]
  }
  ]
},
{
  id: "n4", nom: "Avancé", emoji: "💼", sousTitre: "Analyser une entreprise",
  lecons: [
  {
    id: "resultats", titre: "Chiffre d'affaires et bénéfice", emoji: "🧾",
    texte: [
      "Le chiffre d'affaires (CA), c'est tout l'argent des ventes. Le bénéfice (ou résultat net), c'est ce qui reste après avoir payé toutes les dépenses : salaires, matières, impôts, intérêts…",
      "Une entreprise peut avoir un énorme CA et perdre de l'argent. Ce qui compte pour l'actionnaire, c'est surtout la croissance du bénéfice dans le temps.",
      "Les entreprises cotées publient leurs résultats régulièrement (chaque trimestre ou semestre). Le jour des résultats, l'action peut bouger fort, surtout si les chiffres surprennent par rapport aux attentes."
    ],
    retenir: ["CA = ventes. Bénéfice = ce qui reste.", "Gros CA ne veut pas dire rentable.", "Les résultats surprenants font bouger le prix."],
    cartes: [
      { r: "Chiffre d'affaires", v: "Total des ventes d'une entreprise sur une période." },
      { r: "Bénéfice net", v: "Ce qui reste du chiffre d'affaires après toutes les dépenses et les impôts." }
    ],
    quiz: [
      { q: "Une entreprise vend pour 10 M€ et dépense 12 M€. Elle fait…", c: ["un bénéfice de 10 M€", "une perte de 2 M€", "un bénéfice de 2 M€"], b: 1, p: "10 − 12 = −2 M€ : c'est une perte." },
      { q: "Pourquoi l'action bouge fort le jour des résultats ?", c: ["Parce que les chiffres peuvent surprendre", "Parce que la Bourse est fermée", "Elle ne bouge jamais"], b: 0, p: "Le prix intègre déjà des attentes. Une surprise force tout le monde à réviser." },
      { q: "Ce qui compte le plus à long terme pour l'actionnaire ?", c: ["La couleur du logo", "La croissance des bénéfices", "Le nombre de salariés"], b: 1, p: "Sur la durée, le prix d'une action suit en général les bénéfices." }
    ]
  },
  {
    id: "per", titre: "Le PER", emoji: "🔍",
    texte: [
      "Le PER (Price Earning Ratio) = prix de l'action ÷ bénéfice par action. Un PER de 15 veut dire qu'on paye l'action 15 fois son bénéfice annuel.",
      "Un PER élevé (30, 50…) veut dire que le marché attend une forte croissance. Un PER bas peut signaler une action bon marché… ou une entreprise en difficulté.",
      "On compare toujours le PER à celui d'entreprises du même secteur : une entreprise tech a souvent un PER plus élevé qu'une banque. Dans le simulateur, le PER de chaque entreprise est affiché dans sa fiche."
    ],
    retenir: ["PER = prix ÷ bénéfice par action.", "PER élevé = grandes attentes.", "Comparer dans le même secteur."],
    cartes: [
      { r: "PER", v: "Prix de l'action divisé par le bénéfice par action. Mesure à quel point l'action est « chère »." },
      { r: "BPA", v: "Bénéfice par action : bénéfice net divisé par le nombre d'actions." }
    ],
    quiz: [
      { q: "Action à 60 €, bénéfice par action 4 €. PER ?", c: ["15", "240", "64"], b: 0, p: "60 ÷ 4 = 15." },
      { q: "Un PER très élevé signifie souvent…", c: ["que le marché attend beaucoup de croissance", "que l'entreprise est en faillite", "qu'il n'y a pas de dividende"], b: 0, p: "On paye cher aujourd'hui en espérant de gros bénéfices demain." },
      { q: "Avec quoi comparer un PER ?", c: ["Le PER d'entreprises du même secteur", "Le prix du pain", "La météo"], b: 0, p: "Chaque secteur a ses niveaux habituels." }
    ]
  },
  {
    id: "dividende", titre: "Dividende et rendement", emoji: "💶", mission: "toucher-dividende",
    texte: [
      "Le rendement du dividende = dividende annuel ÷ prix de l'action. Action à 50 € qui verse 2 € par an : rendement de 4 %.",
      "Un rendement très élevé n'est pas toujours une bonne nouvelle : il peut venir d'un prix qui s'est effondré, et le dividende risque d'être réduit.",
      "Le jour du détachement, le prix de l'action baisse à peu près du montant du dividende : l'argent sort de l'entreprise pour aller chez l'actionnaire. Dans le simulateur, les dividendes sont versés tous les trimestres."
    ],
    retenir: ["Rendement = dividende ÷ prix.", "Rendement trop haut = méfiance.", "Au détachement, le prix baisse d'environ le dividende."],
    cartes: [
      { r: "Rendement du dividende", v: "Dividende annuel divisé par le prix de l'action, en %." },
      { r: "Détachement du dividende", v: "Jour où le dividende est retiré du prix de l'action pour être versé aux actionnaires." }
    ],
    quiz: [
      { q: "Action à 40 €, dividende 2 €/an. Rendement ?", c: ["2 %", "5 %", "20 %"], b: 1, p: "2 ÷ 40 = 0,05 = 5 %." },
      { q: "Un rendement de 15 % doit…", c: ["rendre méfiant", "être acheté tout de suite", "être garanti"], b: 0, p: "Souvent, le prix a chuté et le dividende risque d'être coupé." },
      { q: "Que fait le prix le jour du détachement ?", c: ["Il baisse d'environ le dividende", "Il double", "Rien"], b: 0, p: "L'argent sort de l'entreprise : sa valeur baisse d'autant." }
    ]
  },
  {
    id: "etf", titre: "Les ETF en détail", emoji: "🧺",
    texte: [
      "Un ETF réplique un indice. Ses frais annuels (souvent entre 0,05 % et 0,5 %) sont en général bien plus bas que ceux d'un fonds géré activement.",
      "Sur de longues périodes, une grande partie des gérants actifs font moins bien que leur indice une fois les frais payés. C'est pour ça que beaucoup d'investisseurs préfèrent la gestion passive avec des ETF.",
      "Un ETF « monde » contient des milliers d'entreprises de nombreux pays. Il reste exposé aux baisses du marché : diversifié ne veut pas dire sans risque. Dans le simulateur, l'ETF JB10 copie l'indice JUNGLE 10."
    ],
    retenir: ["ETF = copie d'un indice, frais faibles.", "Beaucoup de gérants actifs font moins bien que l'indice sur la durée.", "Diversifié ne veut pas dire sans risque."],
    cartes: [
      { r: "Gestion passive", v: "Suivre un indice au lieu d'essayer de le battre, souvent via un ETF." },
      { r: "Frais courants d'un ETF", v: "Frais annuels prélevés par le fonds, souvent entre 0,05 % et 0,5 %." }
    ],
    quiz: [
      { q: "Un ETF cherche à…", c: ["battre l'indice", "copier l'indice", "éviter la Bourse"], b: 1, p: "Il réplique l'indice, avec des frais bas." },
      { q: "Un ETF monde est-il sans risque ?", c: ["Oui", "Non, il baisse quand le marché baisse", "Oui s'il est en euros"], b: 1, p: "Il est diversifié, mais exposé aux baisses du marché." },
      { q: "Avantage principal des ETF ?", c: ["Des frais bas et une diversification immédiate", "Un gain garanti", "Aucune fiscalité"], b: 0, p: "On achète tout un panier pour peu de frais." }
    ]
  },
  {
    id: "composes", titre: "Intérêts composés et long terme", emoji: "⏳",
    texte: [
      "Les intérêts composés, c'est quand les gains produisent eux-mêmes des gains. 1 000 € qui rapportent 7 % par an deviennent environ 1 967 € en 10 ans, et environ 7 612 € en 30 ans, si les gains sont réinvestis.",
      "Ces 7 % sont un exemple de calcul, pas une promesse : certaines années sont négatives. Mais le temps est l'allié principal de l'investisseur patient.",
      "Investir un peu chaque mois (l'investissement programmé) lisse le prix d'achat : on achète plus d'actions quand c'est bas et moins quand c'est haut."
    ],
    retenir: ["Les gains réinvestis produisent d'autres gains.", "Le temps compte plus que le moment parfait.", "Investir chaque mois lisse le prix d'achat."],
    cartes: [
      { r: "Intérêts composés", v: "Effet boule de neige : les gains réinvestis rapportent à leur tour." },
      { r: "Investissement programmé", v: "Investir une somme fixe à intervalles réguliers, quel que soit le prix (en anglais : DCA)." }
    ],
    quiz: [
      { q: "Les intérêts composés, c'est…", c: ["des gains qui rapportent d'autres gains", "des frais cachés", "une taxe"], b: 0, p: "C'est l'effet boule de neige des gains réinvestis." },
      { q: "Investir 100 € chaque mois permet…", c: ["de lisser le prix d'achat", "de garantir un gain", "d'éviter tout risque"], b: 0, p: "On achète à des prix variés : la moyenne est lissée." },
      { q: "Le rendement de 7 % par an est-il garanti ?", c: ["Oui", "Non, c'est un exemple", "Oui sur 30 ans"], b: 1, p: "Aucun rendement boursier n'est garanti." }
    ]
  }
  ]
},
{
  id: "n5", nom: "Expert", emoji: "🏆", sousTitre: "Psychologie, crises et fiscalité",
  lecons: [
  {
    id: "biais", titre: "Les pièges du cerveau", emoji: "🧠",
    texte: [
      "Le FOMO (la peur de rater le train) pousse à acheter après une grosse hausse… souvent juste avant la baisse.",
      "L'aversion à la perte : une perte fait environ deux fois plus mal qu'un gain de même taille fait plaisir. Résultat : on garde les actions perdantes trop longtemps en espérant « revenir à zéro », et on vend les gagnantes trop tôt.",
      "Le biais de confirmation : on ne lit que les avis qui vont dans notre sens. Un bon réflexe : chercher exprès les arguments contraires avant d'acheter."
    ],
    retenir: ["FOMO : acheter par peur de rater.", "Aversion à la perte : garder les perdantes, vendre les gagnantes trop tôt.", "Biais de confirmation : chercher les avis contraires."],
    cartes: [
      { r: "FOMO", v: "Fear Of Missing Out : peur de rater une hausse, qui pousse à acheter trop tard." },
      { r: "Aversion à la perte", v: "Tendance à ressentir une perte plus fort qu'un gain de même montant." },
      { r: "Biais de confirmation", v: "Tendance à ne retenir que les informations qui confirment ce qu'on pense déjà." }
    ],
    quiz: [
      { q: "Acheter une action parce qu'elle a pris 80 % en un mois et que tout le monde en parle, c'est souvent…", c: ["du FOMO", "de la diversification", "un stop-loss"], b: 0, p: "La peur de rater le train fait acheter tard et cher." },
      { q: "Garder une action en perte « jusqu'à ce qu'elle remonte », c'est…", c: ["l'aversion à la perte", "le PER", "une prise de profit"], b: 0, p: "On refuse d'accepter la perte, quitte à la laisser grossir." },
      { q: "Le meilleur réflexe contre le biais de confirmation ?", c: ["Chercher les arguments contraires", "Lire uniquement les avis positifs", "Acheter plus"], b: 0, p: "Se forcer à voir l'autre côté avant de décider." }
    ]
  },
  {
    id: "krachs", titre: "Bulles et krachs", emoji: "💥", mission: "survivre-krach",
    texte: [
      "Une bulle, c'est quand les prix montent bien plus que ce que valent réellement les entreprises, portés par l'enthousiasme. Exemples célèbres : la tulipe aux Pays-Bas (1637), les entreprises Internet (2000).",
      "Un krach, c'est une chute brutale. En 2008, la crise financière a fait perdre environ la moitié de leur valeur à de nombreux indices. En mars 2020, le Covid a fait chuter les marchés de plus de 30 % en quelques semaines.",
      "Les krachs font partie de l'histoire de la Bourse. Ceux qui ont le moins souffert avaient souvent un horizon long, de l'épargne de côté et pas d'emprunt. Dans le simulateur, des chocs de marché arrivent parfois : regardez comment réagit votre portefeuille."
    ],
    retenir: ["Bulle = prix bien au-dessus de la valeur réelle.", "Krach = chute brutale (2000, 2008, 2020).", "Horizon long, épargne de côté, pas d'emprunt."],
    cartes: [
      { r: "Bulle spéculative", v: "Hausse des prix bien au-delà de la valeur réelle, portée par l'enthousiasme." },
      { r: "Krach", v: "Chute brutale et rapide des marchés." }
    ],
    quiz: [
      { q: "La bulle Internet a éclaté vers…", c: ["1637", "2000", "2020"], b: 1, p: "La bulle des valeurs Internet a éclaté en 2000." },
      { q: "En 2008, de nombreux indices ont perdu environ…", c: ["5 %", "la moitié de leur valeur", "rien"], b: 1, p: "La crise financière a fait chuter beaucoup d'indices d'environ 50 %." },
      { q: "Qu'est-ce qui aide le plus à traverser un krach ?", c: ["Avoir emprunté pour investir", "Un horizon long et une épargne de côté", "Tout vendre au plus bas"], b: 1, p: "Sans besoin urgent d'argent, on n'est pas forcé de vendre au pire moment." }
    ]
  },
  {
    id: "obligations", titre: "Obligations et taux", emoji: "🏦",
    texte: [
      "Une obligation est un prêt fait à un État ou une entreprise. En échange, vous recevez des intérêts (le coupon) et votre argent est rendu à la fin (l'échéance), si l'emprunteur ne fait pas défaut.",
      "Quand les taux d'intérêt montent, les anciennes obligations, qui rapportent moins, perdent de la valeur. Et les actions baissent souvent aussi, car l'argent devient plus cher à emprunter et les placements sans risque deviennent plus attractifs.",
      "Les obligations sont en général moins risquées que les actions, mais rapportent en moyenne moins sur le long terme."
    ],
    retenir: ["Obligation = prêt avec intérêts (coupon).", "Taux qui montent = obligations existantes qui baissent.", "Moins risqué, mais rapporte moins en moyenne."],
    cartes: [
      { r: "Obligation", v: "Titre de dette : un prêt à un État ou une entreprise, qui verse des intérêts." },
      { r: "Coupon", v: "Intérêt versé régulièrement au détenteur d'une obligation." }
    ],
    quiz: [
      { q: "Acheter une obligation, c'est…", c: ["prêter de l'argent", "devenir propriétaire de l'entreprise", "parier sur une devise"], b: 0, p: "Vous êtes créancier, pas actionnaire." },
      { q: "Si les taux montent, les obligations existantes…", c: ["prennent de la valeur", "perdent de la valeur", "ne bougent pas"], b: 1, p: "Les nouvelles rapportent plus : les anciennes deviennent moins intéressantes." },
      { q: "En moyenne, sur le long terme, les obligations rapportent…", c: ["plus que les actions", "moins que les actions", "exactement pareil"], b: 1, p: "Moins de risque, en général moins de rendement." }
    ]
  },
  {
    id: "fiscalite", titre: "La fiscalité (France)", emoji: "🧮",
    texte: [
      "Sur un compte-titres ordinaire, les plus-values et les dividendes sont en général taxés au prélèvement forfaitaire unique (la « flat tax »), autour de 30 % (impôt + prélèvements sociaux). Le taux exact peut changer avec les lois de finances : vérifiez-le chaque année.",
      "Le PEA est plus avantageux : après 5 ans, les gains ne paient plus d'impôt sur le revenu, seulement les prélèvements sociaux. Il est plafonné (150 000 € de versements pour un PEA classique) et réservé aux actions européennes.",
      "Ces règles sont un résumé simplifié, pas un conseil fiscal : pour votre situation, renseignez-vous sur impots.gouv.fr ou auprès d'un professionnel."
    ],
    retenir: ["CTO : flat tax d'environ 30 % sur les gains (à vérifier chaque année).", "PEA : avantage fiscal après 5 ans.", "Résumé simplifié : vérifier sa propre situation."],
    cartes: [
      { r: "Flat tax (PFU)", v: "Prélèvement forfaitaire unique sur les revenus du capital, autour de 30 % (à vérifier chaque année)." },
      { r: "PEA après 5 ans", v: "Les gains ne paient plus d'impôt sur le revenu, seulement les prélèvements sociaux." }
    ],
    quiz: [
      { q: "Après combien d'années le PEA devient-il fiscalement avantageux ?", c: ["1 an", "5 ans", "20 ans"], b: 1, p: "Après 5 ans, les gains échappent à l'impôt sur le revenu." },
      { q: "La flat tax sur un CTO tourne autour de…", c: ["10 %", "30 %", "60 %"], b: 1, p: "Environ 30 %, impôt et prélèvements sociaux compris. Le taux peut évoluer." },
      { q: "Le PEA permet d'acheter…", c: ["des actions européennes", "des actions américaines en direct", "des cryptomonnaies"], b: 0, p: "Il est réservé aux actions européennes et aux fonds éligibles." }
    ]
  },
  {
    id: "methode", titre: "Construire sa méthode", emoji: "🗺️", mission: "battre-indice",
    texte: [
      "Avant chaque achat, écrivez pourquoi vous achetez, où est votre stop, où est votre objectif et combien vous risquez. C'est votre plan.",
      "Tenez un journal : chaque opération, la raison, le résultat, ce que vous avez appris. Au bout de quelques mois, vous verrez vos erreurs qui reviennent.",
      "Comparez-vous toujours à l'indice. Si, sur plusieurs années, vous faites moins bien qu'un simple ETF, la gestion passive est peut-être meilleure pour vous. Le simulateur affiche votre performance à côté de celle de l'indice JUNGLE 10."
    ],
    retenir: ["Un plan avant chaque achat : raison, stop, objectif, risque.", "Un journal pour repérer ses erreurs.", "Se comparer à l'indice."],
    cartes: [
      { r: "Plan de trading", v: "Règles écrites à l'avance : pourquoi on achète, stop, objectif, taille." },
      { r: "Benchmark", v: "Indice de référence auquel on compare sa performance." }
    ],
    quiz: [
      { q: "Que doit contenir votre plan avant un achat ?", c: ["Raison, stop, objectif, risque", "Juste le nom de l'action", "L'avis d'un ami"], b: 0, p: "Décider de tout à l'avance évite d'improviser sous le stress." },
      { q: "À quoi sert un journal de trading ?", c: ["À repérer ses erreurs récurrentes", "À payer moins d'impôts", "À rien"], b: 0, p: "Écrire permet de voir ce qui marche et ce qui ne marche pas." },
      { q: "À quoi comparer sa performance ?", c: ["À un indice de référence", "Au prix du café", "À rien"], b: 0, p: "Si l'indice fait mieux, un ETF aurait suffi." }
    ]
  }
  ]
},
{
  /* Parcours bonus, toujours ouvert : le groupe Jack World (NEW DUC et ses filiales), coté pour de faux. */
  id: "jw", nom: "Jack World", emoji: "🌍", sousTitre: "Le groupe NEW DUC en Bourse (pour de faux)", bonus: true,
  lecons: [
  {
    id: "jw-groupe", titre: "Une maison mère et ses filiales", emoji: "🏛️", mission: "maison-mere",
    texte: [
      "Dans le simulateur, le groupe Jack World a sa propre Bourse imaginaire. En vrai, aucune de ces entreprises n'est cotée : les prix sont inventés pour s'entraîner sur des noms qu'on connaît.",
      "À la tête du groupe, il y a NEW DUC : c'est la maison mère, ou « holding ». Elle possède les filiales : JACK22 Studio, J-DJ, Jack Radio, Jack Blabla, Jack Fusion, Jack Finance et Jack Bours.",
      "Acheter une action NEW DUC, c'est donc posséder un petit bout de toutes les filiales d'un coup. Son cours suit à peu près la moyenne de ses filiales. C'est un peu comme un ETF, mais limité à un seul groupe.",
      "Dans la vraie vie, une holding vaut souvent un peu moins que la somme de ses filiales : on appelle ça la « décote de holding ». Les investisseurs paient moins cher parce qu'ils ne choisissent pas eux-mêmes les filiales et qu'il y a des frais de structure."
    ],
    retenir: ["Holding = maison mère qui possède des filiales.", "Acheter la holding = un bout de tout le groupe.", "Une holding se paie souvent avec une décote."],
    cartes: [
      { r: "Holding (maison mère)", v: "Entreprise qui possède d'autres entreprises, ses filiales. Ex. : NEW DUC dans le simulateur." },
      { r: "Filiale", v: "Entreprise contrôlée par une maison mère. Ex. : J-DJ est une filiale de NEW DUC." },
      { r: "Décote de holding", v: "Écart entre la valeur des filiales et le prix de la holding, souvent moins chère que la somme de ses parties." }
    ],
    quiz: [
      { q: "Dans le simulateur, quelle entreprise est la maison mère du groupe Jack ?", c: ["NEW DUC", "Jack Radio", "J-DJ"], b: 0, p: "NEW DUC est la holding : elle possède toutes les autres." },
      { q: "Acheter une action de la holding, c'est…", c: ["posséder un bout de toutes ses filiales", "prêter de l'argent aux filiales", "acheter une seule filiale au choix"], b: 0, p: "La holding détient les filiales : vous en avez donc un petit morceau indirectement." },
      { q: "Qu'appelle-t-on la « décote de holding » ?", c: ["La holding vaut moins que la somme de ses filiales", "Une réduction sur les frais", "Une baisse du dividende"], b: 0, p: "Les investisseurs acceptent rarement de payer le plein prix pour une structure qu'ils ne contrôlent pas." },
      { q: "Les entreprises du groupe Jack sont-elles vraiment cotées en Bourse ?", c: ["Non, leurs cours sont inventés pour s'entraîner", "Oui, à Paris", "Oui, à New York"], b: 0, p: "Tout est fictif dans le simulateur : les prix comme l'argent." }
    ]
  },
  {
    id: "jw-croissance", titre: "Croissance ou rendement ?", emoji: "🚀", mission: "croissance-rendement",
    texte: [
      "Toutes les filiales n'ont pas le même profil. J-DJ et JACK22 Studio sont des entreprises de croissance : les ventes grimpent vite, elles ne versent pas de dividende et réinvestissent tout. Leur PER est élevé, car on paie aujourd'hui les bénéfices espérés demain.",
      "Jack Fusion est encore en version bêta : elle ne gagne pas d'argent pour l'instant. Pas de bénéfice, donc pas de PER du tout. Son prix repose uniquement sur l'espoir : c'est l'action la plus agitée du groupe.",
      "À l'inverse, Jack Radio et Jack Finance sont des entreprises plus mûres : elles gagnent de l'argent régulièrement, grandissent plus lentement et en reversent une partie en dividendes. Leur PER est plus bas et leur cours plus calme.",
      "Aucun profil n'est « meilleur ». Les actions de croissance peuvent beaucoup monter… ou beaucoup baisser si la croissance déçoit. Les actions de rendement rapportent un revenu régulier mais montent moins vite. Beaucoup d'investisseurs mélangent les deux."
    ],
    retenir: ["Croissance : PER élevé, peu ou pas de dividende, prix agité.", "Pas de bénéfice = pas de PER (Jack Fusion).", "Rendement : PER plus bas, dividende, prix plus calme."],
    cartes: [
      { r: "Action de croissance", v: "Entreprise dont les bénéfices grandissent vite. Souvent PER élevé et peu de dividende. Ex. : J-DJ." },
      { r: "Action de rendement", v: "Entreprise mûre qui verse un dividende régulier. Ex. : Jack Radio." },
      { r: "Pourquoi pas de PER ?", v: "Le PER divise le prix par le bénéfice. Sans bénéfice (Jack Fusion en bêta), il ne veut rien dire." }
    ],
    quiz: [
      { q: "Pourquoi Jack Fusion n'a-t-elle pas de PER dans le simulateur ?", c: ["Elle ne fait pas encore de bénéfice", "Elle est trop chère", "Elle verse trop de dividendes"], b: 0, p: "PER = prix ÷ bénéfice. Sans bénéfice, le calcul n'a pas de sens." },
      { q: "Une action de croissance a en général…", c: ["un PER élevé et peu de dividende", "un PER bas et un gros dividende", "aucun risque"], b: 0, p: "On paie cher les bénéfices futurs, et l'entreprise garde son argent pour grandir." },
      { q: "Laquelle est plutôt une action de rendement ?", c: ["Jack Radio", "J-DJ", "Jack Fusion"], b: 0, p: "Jack Radio gagne de l'argent régulièrement et verse un dividende." },
      { q: "Si la croissance d'une entreprise au PER élevé déçoit, son cours…", c: ["peut chuter fortement", "monte forcément", "ne bouge pas"], b: 0, p: "Le prix contenait beaucoup d'espoir : quand l'espoir baisse, le prix aussi." }
    ]
  },
  {
    id: "jw-ensemble", titre: "Quand tout le groupe bouge ensemble", emoji: "🔗", mission: "jack-et-jungle",
    texte: [
      "Les filiales d'un même groupe ont souvent des points communs : la même marque, les mêmes clients, la même direction. Dans le simulateur, une bonne ou une mauvaise nouvelle pour Jack World fait bouger toutes ses filiales un peu dans le même sens. On dit qu'elles sont corrélées.",
      "Avoir cinq actions du groupe Jack, ce n'est donc pas aussi diversifié qu'avoir cinq entreprises de secteurs et de groupes différents. Si le groupe traverse une mauvaise passe, tout le portefeuille plonge en même temps.",
      "Pour le voir, comparez l'indice JACK WORLD (la moyenne des filiales) à l'indice JUNGLE 10 dans le simulateur. Ils ne montent et ne baissent pas toujours en même temps : c'est justement ce qui rend le mélange intéressant.",
      "Bonne pratique : mélanger plusieurs groupes et plusieurs secteurs, et éviter qu'un seul groupe pèse trop lourd dans le portefeuille."
    ],
    retenir: ["Les filiales d'un groupe sont corrélées : elles bougent souvent ensemble.", "5 actions du même groupe ≠ vraie diversification.", "Mélanger groupes et secteurs."],
    cartes: [
      { r: "Corrélation", v: "Tendance de deux actions à monter ou baisser en même temps." },
      { r: "Indice JACK WORLD", v: "Dans le simulateur, la moyenne des 7 filiales du groupe NEW DUC." },
      { r: "Risque de concentration", v: "Danger d'avoir trop d'argent dans un seul groupe, secteur ou pays." }
    ],
    quiz: [
      { q: "Que veut dire « deux actions corrélées » ?", c: ["Elles bougent souvent dans le même sens", "Elles ont le même prix", "Elles versent le même dividende"], b: 0, p: "La corrélation mesure à quel point deux prix évoluent ensemble." },
      { q: "Un portefeuille 100 % groupe Jack est…", c: ["peu diversifié", "parfaitement diversifié", "sans risque"], b: 0, p: "Si le groupe va mal, toutes les lignes baissent ensemble." },
      { q: "Pour mieux diversifier, il vaut mieux…", c: ["mélanger plusieurs groupes et secteurs", "acheter toutes les filiales d'un seul groupe", "tout mettre sur l'action qui a le plus monté"], b: 0, p: "Des entreprises qui ne bougent pas pareil amortissent les chocs." }
    ]
  }
  ]
}
];

/* Les missions du simulateur. Le contrôle (test) est dans app.js. */
window.JB_MISSIONS = [
  { id: "premier-achat", titre: "Premier achat", texte: "Achetez votre première action dans le simulateur.", emoji: "🛒" },
  { id: "premiere-vente", titre: "Première vente", texte: "Revendez une action (en gain ou en perte).", emoji: "💸" },
  { id: "acheter-etf", titre: "Tout l'indice d'un coup", texte: "Achetez l'ETF JB10 qui copie l'indice JUNGLE 10.", emoji: "🧺" },
  { id: "voir-mm", titre: "Œil de lynx", texte: "Affichez la MM20 et la MM50 sur le graphique.", emoji: "〰️" },
  { id: "ordre-limite", titre: "Patience récompensée", texte: "Faites exécuter un ordre à cours limité.", emoji: "📝" },
  { id: "stop-loss", titre: "Ceinture de sécurité", texte: "Placez un stop-loss sur une de vos actions.", emoji: "🛑" },
  { id: "diversifier", titre: "Le panier garni", texte: "Ayez des actions de 3 secteurs différents en même temps.", emoji: "🧩" },
  { id: "toucher-dividende", titre: "Rentier en herbe", texte: "Touchez votre premier dividende (versé tous les 60 jours de bourse).", emoji: "💶" },
  { id: "plus-value", titre: "Premier gain", texte: "Vendez une action avec une plus-value.", emoji: "🟢" },
  { id: "survivre-krach", titre: "Tenir le choc", texte: "Traversez un krach en ayant des actions, et gardez au moins 90 % de votre capital de départ.", emoji: "💥" },
  { id: "battre-indice", titre: "Plus fort que l'indice", texte: "Après au moins 60 jours de bourse, faites mieux que l'indice JUNGLE 10.", emoji: "🏆" },
  { id: "action-jack", titre: "Dans la famille Jack", texte: "Achetez une action d'une entreprise du groupe Jack World.", emoji: "🌍" },
  { id: "maison-mere", titre: "Tout le groupe d'un coup", texte: "Achetez NEW DUC, la maison mère qui possède toutes les filiales.", emoji: "🏛️" },
  { id: "croissance-rendement", titre: "Fusée et tirelire", texte: "Ayez en même temps une action Jack de croissance (sans dividende) et une action Jack qui verse un dividende.", emoji: "🚀" },
  { id: "jack-et-jungle", titre: "Deux mondes", texte: "Ayez en même temps au moins 2 entreprises du groupe Jack et 2 entreprises du JUNGLE 10.", emoji: "🔗" }
];
