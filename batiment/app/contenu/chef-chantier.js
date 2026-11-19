/* Parcours 3 — Chef de chantier */
window.METIERS = window.METIERS || [];
window.METIERS.push({
  id: "chef-chantier", nom: "Chef de chantier", emoji: "🦺", marche: 3,
  resume: "Organiser tout le chantier : équipes, planning, sécurité, réseaux, sous-traitants.",
  role: "Le **chef de chantier** organise et dirige la réalisation sur le terrain d'un chantier (ou d'une grosse partie). Il encadre les chefs d'équipe et les compagnons, prépare le travail, commande, coordonne les sous-traitants, fait respecter la sécurité, la qualité et le planning, et rend compte au conducteur de travaux.",
  missions: [
    "Préparer et installer le chantier (accès, cantonnement, stockage, levage)",
    "Planifier le travail à la semaine et répartir les équipes",
    "Commander matériaux, matériel et locations, et réceptionner les livraisons",
    "Faire appliquer le PPSPS et les consignes du coordonnateur SPS",
    "Coordonner les sous-traitants et les autres corps d'état",
    "Tenir le journal de chantier, suivre les heures et l'avancement",
    "Contrôler la qualité et lever les réserves"
  ],
  acces: "après une expérience de chef d'équipe, ou avec un BTS (Bâtiment, Travaux publics) / titre professionnel de chef de chantier, plus quelques années de terrain.",
  modules: [
    {
      id: "installation", emoji: "🚧", titre: "Préparer et installer le chantier", duree: "25 min",
      intro: "Un chantier bien installé, c'est la moitié du travail.",
      sections: [
        { titre: "Le plan d'installation de chantier (PIC)", texte: [
          "Le **PIC** est un plan qui montre où sont : les accès et les clôtures, le cantonnement (bureau, vestiaires, réfectoire, sanitaires), les zones de stockage, la grue et sa zone de survol, les circulations piétons et engins, les bennes à déchets, les branchements provisoires (eau, électricité), l'aire de lavage des toupies."],
          liste: [
            "Séparer autant que possible les piétons et les engins.",
            "Penser au **levage** : position et rayon de la grue, zones interdites de survol (voies publiques, écoles, voisins…) selon les autorisations obtenues.",
            "Prévoir les livraisons : où se garent les camions, où on décharge.",
            "Afficher les informations obligatoires et utiles : panneau de chantier, consignes, numéros d'urgence, plan d'évacuation."
          ] },
        { titre: "Le cantonnement", texte: [
          "Le Code du travail impose des installations d'hygiène pour les travailleurs du chantier : vestiaires, lavabos, toilettes, local pour prendre les repas, eau potable. Leur dimension dépend de l'effectif ; le PGC du coordonnateur SPS précise souvent ce qui est prévu en commun pour tous les corps d'état."] },
        { titre: "Les démarches avant de démarrer", liste: [
          "**DICT** envoyée et réponses des exploitants de réseaux reçues (voir le module réseaux).",
          "Arrêtés de voirie si on occupe le domaine public (emprise, échafaudage sur trottoir, livraison).",
          "Constat d'huissier ou référé préventif sur les avoisinants si le conducteur l'a décidé.",
          "Branchements provisoires demandés à temps (souvent plusieurs semaines de délai)."
        ] }
      ],
      retenir: [
        "Le PIC place tout : accès, cantonnement, stockage, levage, déchets, circulations.",
        "Séparer piétons et engins, maîtriser les zones survolées par la grue.",
        "Les autorisations (DICT, voirie, branchements) se lancent tôt."
      ],
      terrain: "Va voir le terrain avant de dessiner ton PIC : pente, voisins, arbres, lignes électriques aériennes, accès camion réel (largeur de rue, virages). Ce qui est faisable sur le papier ne l'est pas toujours avec un semi-remorque.",
      quiz: [
        { q: "Que signifie PIC ?", choix: ["Plan d'installation de chantier", "Programme d'intervention collective", "Plan d'implantation des cotes"], ok: 0, pourquoi: "Le PIC montre l'organisation physique du chantier." },
        { q: "Quel est l'un des grands principes d'un PIC ?", choix: ["Séparer les circulations piétons et engins", "Mettre la base vie au milieu des engins", "Stocker les matériaux sur la voie publique sans autorisation"], ok: 0, pourquoi: "Les heurts piétons/engins sont une cause importante d'accidents graves." },
        { q: "Les installations d'hygiène (vestiaires, sanitaires, réfectoire)…", choix: ["Sont imposées par le Code du travail", "Sont facultatives", "Ne concernent que le bureau"], ok: 0, pourquoi: "L'employeur doit mettre à disposition des installations d'hygiène adaptées à l'effectif." },
        { q: "Pour occuper un trottoir avec un échafaudage, il faut…", choix: ["Une autorisation (arrêté) de la commune ou du gestionnaire de voirie", "Rien", "L'accord des voisins seulement"], ok: 0, pourquoi: "L'occupation du domaine public nécessite une autorisation du gestionnaire." },
        { q: "Les branchements provisoires (eau, électricité)…", choix: ["Se demandent tôt car les délais peuvent être longs", "S'obtiennent le jour même", "Ne sont jamais nécessaires"], ok: 0, pourquoi: "Les concessionnaires ont souvent des délais de plusieurs semaines." }
      ]
    },
    {
      id: "planning", emoji: "📅", titre: "Planning, Gantt et rendements", duree: "30 min",
      intro: "Savoir lire un planning, le découper à la semaine et calculer une durée.",
      sections: [
        { titre: "Le planning général et le diagramme de Gantt", texte: [
          "Le **planning général** (souvent fait par le conducteur de travaux ou l'OPC) découpe le chantier en tâches avec des durées et des liens. Il est presque toujours présenté en **diagramme de Gantt** : une ligne par tâche, une barre horizontale sur l'échelle du temps."],
          liste: [
            "**Liens** : la plupart des tâches sont « fin-début » (on coule la dalle quand le ferraillage est fini).",
            "**Chemin critique** : la suite des tâches qui n'ont aucune marge ; un jour de retard sur elles = un jour de retard à la fin.",
            "**Marge** : le temps dont une tâche peut glisser sans retarder la fin.",
            "**Jalons** : dates clés (hors d'eau, hors d'air, réception)."
          ] },
        { titre: "Le planning à 3 semaines (planning glissant)", texte: [
          "Le chef de chantier détaille les **3 semaines à venir** jour par jour : qui (équipe, sous-traitant), quoi, où, avec quels moyens (grue, toupie, nacelle). On le met à jour chaque semaine. C'est l'outil qui permet d'anticiper commandes et livraisons."] },
        { titre: "Calculer une durée", texte: [
          "**Durée (jours) = quantité ÷ (rendement × effectif)**.",
          "Exemple : 180 m² de mur en blocs, rendement de 12 m² par maçon et par jour, 3 maçons : 180 ÷ (12 × 3) = **5 jours**.",
          "Les rendements viennent de l'expérience de l'entreprise (et de ses chantiers précédents). Note ceux de ton chantier : ils serviront aux prochains devis."] }
      ],
      retenir: [
        "Gantt = une barre par tâche ; chemin critique = tâches sans marge.",
        "Planning à 3 semaines détaillé, mis à jour chaque semaine.",
        "Durée = quantité ÷ (rendement × effectif)."
      ],
      terrain: "Affiche le planning à 3 semaines dans le bureau de chantier et passe-le en revue chaque lundi avec tes chefs d'équipe et les sous-traitants. Ce qui est écrit et vu de tous est tenu ; ce qui est dans ta tête ne l'est pas.",
      quiz: [
        { q: "240 m² de carrelage, rendement 15 m²/jour par carreleur, 2 carreleurs : durée ?", choix: ["8 jours", "16 jours", "4 jours"], ok: 0, pourquoi: "240 ÷ (15 × 2) = 240 ÷ 30 = 8 jours." },
        { q: "Qu'est-ce que le chemin critique ?", choix: ["La suite des tâches sans marge qui fixe la date de fin", "Le chemin d'accès au chantier", "Le parcours de la grue"], ok: 0, pourquoi: "Tout retard sur une tâche critique décale la fin du chantier." },
        { q: "Dans un diagramme de Gantt, une tâche est représentée par…", choix: ["Une barre horizontale sur l'échelle du temps", "Un camembert", "Un point sur une carte"], ok: 0, pourquoi: "Le Gantt aligne les tâches en lignes et leur durée en barres." },
        { q: "Le planning à 3 semaines sert surtout à…", choix: ["Anticiper équipes, commandes et livraisons", "Remplacer le planning général", "Calculer les salaires"], ok: 0, pourquoi: "C'est l'outil opérationnel du chef de chantier, détaillé au jour." },
        { q: "Une tâche a 5 jours de marge et prend 2 jours de retard. Que se passe-t-il pour la date de fin ?", choix: ["Rien, elle reste dans sa marge", "Elle recule de 2 jours", "Elle recule de 5 jours"], ok: 0, pourquoi: "Tant que le retard reste inférieur à la marge, la fin n'est pas impactée (mais la marge diminue)." }
      ]
    },
    {
      id: "sps", emoji: "🛡️", titre: "PPSPS, PGC et coordination sécurité", duree: "25 min",
      intro: "Les documents de sécurité d'une opération et le rôle de chacun.",
      sections: [
        { titre: "Les acteurs", liste: [
          "**Maître d'ouvrage** : le client qui fait construire ; il désigne un **coordonnateur SPS** quand plusieurs entreprises interviennent.",
          "**Coordonnateur SPS (CSPS)** : il organise la prévention des risques liés à la **coactivité** (plusieurs entreprises en même temps).",
          "**Chaque entreprise** reste responsable de la sécurité de ses propres salariés."
        ] },
        { titre: "Les documents", liste: [
          "**PGC** (plan général de coordination) : rédigé par le coordonnateur SPS, il fixe les règles communes du chantier (accès, installations communes, levage, protections collectives partagées…).",
          "**PPSPS** (plan particulier de sécurité et de protection de la santé) : rédigé par **chaque entreprise** intervenante pour les opérations soumises, avant son intervention ; il décrit ses travaux, ses risques et ses mesures. Le chef de chantier le connaît et le fait appliquer.",
          "**Registre-journal de la coordination** : tenu par le CSPS (visites, observations).",
          "**DIUO** (dossier d'intervention ultérieure sur l'ouvrage) : remis au maître d'ouvrage pour la maintenance future en sécurité.",
          "**Plan de prévention** : pour les travaux dans un établissement en activité (entreprise utilisatrice)."
        ] },
        { titre: "Les risques à traiter en priorité", liste: [
          "Chutes de hauteur, chutes d'objets, effondrements (fouilles, étaiement).",
          "Engins et circulation, levage.",
          "Réseaux enterrés et aériens, électricité.",
          "Poussières (silice cristalline), bruit, vibrations, produits chimiques.",
          "**Amiante** : un **repérage avant travaux** est exigé sur les bâtiments concernés ; les interventions sur matériaux amiantés exigent formation spécifique et procédures."
        ] }
      ],
      retenir: [
        "PGC = règles communes (par le CSPS) ; PPSPS = plan de chaque entreprise.",
        "Le CSPS gère la coactivité, chaque employeur reste responsable de ses salariés.",
        "Amiante : repérage avant travaux, jamais d'intervention improvisée."
      ],
      terrain: "Accompagne le coordonnateur SPS pendant ses visites et lis ses observations dans le registre-journal : réponds-y par écrit avec les actions faites. C'est ta meilleure protection en cas de contrôle ou d'accident.",
      quiz: [
        { q: "Qui rédige le PPSPS ?", choix: ["Chaque entreprise intervenante", "Le coordonnateur SPS", "L'architecte"], ok: 0, pourquoi: "Le PPSPS est propre à chaque entreprise ; le PGC est celui du coordonnateur." },
        { q: "Le PGC est rédigé par…", choix: ["Le coordonnateur SPS", "Le chef d'équipe", "Le fournisseur de béton"], ok: 0, pourquoi: "Le plan général de coordination fixe les règles communes à tous les intervenants." },
        { q: "Le coordonnateur SPS s'occupe principalement…", choix: ["Des risques liés à la coactivité des entreprises", "De la paie des ouvriers", "Du choix des carrelages"], ok: 0, pourquoi: "Il coordonne la prévention entre entreprises ; il ne remplace pas leurs obligations d'employeur." },
        { q: "Le DIUO sert à…", choix: ["Préparer les futures interventions de maintenance en sécurité", "Commander du béton", "Déclarer les travaux aux réseaux"], ok: 0, pourquoi: "Dossier d'intervention ultérieure sur l'ouvrage, remis au maître d'ouvrage." },
        { q: "Avant de démolir un bâtiment ancien, il faut notamment…", choix: ["Disposer du repérage amiante avant travaux", "Commencer directement", "Prévenir seulement les voisins"], ok: 0, pourquoi: "Le repérage amiante avant travaux est obligatoire pour les opérations concernées." }
      ]
    },
    {
      id: "reseaux", emoji: "⚡", titre: "Réseaux : DT-DICT et AIPR", duree: "20 min",
      intro: "Ne jamais creuser sans savoir ce qu'il y a dessous.",
      sections: [
        { titre: "Le principe", texte: [
          "Gaz, électricité, eau, télécom, chauffage urbain : les réseaux enterrés ou aériens peuvent provoquer explosion, électrocution ou coupures graves. La réglementation « anti-endommagement » impose des déclarations avant les travaux."],
          liste: [
            "**DT** (déclaration de projet de travaux) : faite par le **maître d'ouvrage** lors de la conception.",
            "**DICT** (déclaration d'intention de commencement de travaux) : faite par **l'entreprise** qui exécute, avant de démarrer.",
            "On consulte le **guichet unique** (en ligne) pour savoir quels exploitants de réseaux sont concernés par la zone.",
            "On attend les **réponses des exploitants** (plans, recommandations) avant de commencer, dans le respect des délais prévus par la réglementation."
          ] },
        { titre: "L'AIPR", texte: [
          "L'**AIPR** (autorisation d'intervention à proximité des réseaux) est délivrée par l'employeur après un examen. Elle est exigée pour les personnes qui conçoivent, encadrent ou exécutent des travaux à proximité des réseaux (conducteurs d'engins notamment)."] },
        { titre: "Sur le chantier", liste: [
          "Marquage-piquetage au sol des réseaux avant les terrassements.",
          "Terrassement **manuel ou aspiratif** à proximité des réseaux sensibles, selon les recommandations.",
          "Réseau endommagé ou découverte d'un réseau inconnu : **arrêt**, mise en sécurité, éloignement des personnes, appel de l'exploitant (et des secours si gaz ou électricité), puis compte rendu.",
          "Garder la DICT et les réponses sur le chantier."
        ] }
      ],
      danger: "Fuite de gaz après un accrochage : arrêter les engins et toute source d'étincelle, éloigner tout le monde, appeler les pompiers (18 ou 112) et l'exploitant. Ne jamais tenter de colmater soi-même.",
      retenir: [
        "DT = maître d'ouvrage ; DICT = entreprise qui exécute.",
        "Pas de terrassement sans les réponses des exploitants et le marquage.",
        "AIPR pour ceux qui conçoivent, encadrent ou exécutent à proximité.",
        "Accrochage : arrêt, sécurité, alerte, compte rendu."
      ],
      terrain: "Fais un point avec le conducteur d'engin avant chaque terrassement : où sont les réseaux marqués, à quelle profondeur supposée, où il faut passer à la main. Deux minutes de discussion, et le chantier ne finit pas aux informations.",
      quiz: [
        { q: "Qui fait la DICT ?", choix: ["L'entreprise qui exécute les travaux", "Le maître d'ouvrage", "La mairie"], ok: 0, pourquoi: "La DT est faite par le maître d'ouvrage, la DICT par l'exécutant." },
        { q: "Que signifie AIPR ?", choix: ["Autorisation d'intervention à proximité des réseaux", "Attestation d'implantation des plans de repérage", "Assurance immeuble pour risques"], ok: 0, pourquoi: "C'est une autorisation délivrée par l'employeur après examen." },
        { q: "Ta pelle accroche une conduite de gaz. Premier réflexe ?", choix: ["Arrêter les engins, éloigner tout le monde, alerter", "Boucher le trou avec de la terre", "Continuer à creuser à côté"], ok: 0, pourquoi: "Le risque d'explosion impose arrêt, éloignement des personnes et alerte des secours et de l'exploitant." },
        { q: "Où trouve-t-on la liste des exploitants concernés par une zone ?", choix: ["Sur le guichet unique en ligne", "Dans l'annuaire papier", "On demande au voisin"], ok: 0, pourquoi: "Le guichet unique recense les exploitants de réseaux par zone." },
        { q: "Près d'un réseau sensible, comment terrasser ?", choix: ["Manuellement ou par aspiration, selon les recommandations", "Au godet à pleine vitesse", "À l'explosif"], ok: 0, pourquoi: "Les techniques douces sont prescrites dans la zone d'incertitude du réseau." }
      ]
    },
    {
      id: "appro", emoji: "🚚", titre: "Commandes, livraisons et sous-traitants", duree: "20 min",
      intro: "Avoir le bon matériau, au bon endroit, au bon moment, et coordonner tout le monde.",
      sections: [
        { titre: "Commander", liste: [
          "Partir du **quantitatif** (métré) et du planning : quantité, référence exacte, date et heure de livraison, lieu de déchargement, moyen de déchargement (grue, chariot, à la main).",
          "Béton prêt à l'emploi : classe et consistance demandées par le CCTP, volume, cadence, pompe ou benne, accès de la toupie.",
          "Location de matériel : réserver tôt, préciser la durée, et **rendre à temps** (une nacelle oubliée coûte cher)."
        ] },
        { titre: "Réceptionner", liste: [
          "Comparer le **bon de livraison** à la commande : quantité, référence, état.",
          "Noter les réserves **sur le bon** (palette cassée, quantité manquante) avant de signer.",
          "Classer les bons : ils servent au suivi des coûts et aux litiges."
        ] },
        { titre: "Coordonner sous-traitants et corps d'état", liste: [
          "Les sous-traitants doivent être **déclarés et agréés** par le maître d'ouvrage (c'est le rôle de l'entreprise principale) ; le chef de chantier vérifie que les personnes présentes sont bien celles prévues.",
          "Vérifier les documents d'accès : identité des salariés, carte professionnelle BTP, habilitations.",
          "Réunion de coordination hebdomadaire : enchaînement des tâches, zones de travail, levage partagé.",
          "Valider les supports avant le corps d'état suivant (« réception de support ») pour éviter les litiges."
        ] }
      ],
      retenir: [
        "Commande = quoi, combien, quand, où, comment on décharge.",
        "Réserves écrites sur le bon de livraison avant de signer.",
        "Sous-traitants déclarés, personnel identifié, coordination chaque semaine."
      ],
      terrain: "Tiens un tableau simple des locations en cours (matériel, loueur, date de début, date de fin prévue). Le vendredi, fais-en le tour : tout ce qui ne sert plus repart.",
      quiz: [
        { q: "Une palette arrive cassée. Que fais-tu ?", choix: ["J'écris la réserve sur le bon de livraison avant de signer", "Je signe et je verrai plus tard", "Je refuse de parler au chauffeur"], ok: 0, pourquoi: "Sans réserve écrite au moment de la livraison, le litige est très difficile à gagner." },
        { q: "Pour commander du béton prêt à l'emploi, il faut préciser…", choix: ["La classe, la consistance, le volume, la cadence et l'accès", "Seulement la couleur", "Seulement l'heure"], ok: 0, pourquoi: "La centrale fabrique selon une formulation précise et organise ses toupies." },
        { q: "Qui fait accepter un sous-traitant par le maître d'ouvrage ?", choix: ["L'entreprise principale qui sous-traite", "Le sous-traitant lui-même", "Personne"], ok: 0, pourquoi: "La loi sur la sous-traitance impose la présentation et l'agrément du sous-traitant par le maître d'ouvrage." },
        { q: "Pourquoi « réceptionner un support » avant le corps d'état suivant ?", choix: ["Pour constater qu'il est conforme et éviter les litiges", "Pour faire une fête", "C'est inutile"], ok: 0, pourquoi: "Le corps d'état suivant accepte (ou non) un support conforme, ce qui clarifie les responsabilités." },
        { q: "Le matériel loué ne sert plus. Que fais-tu ?", choix: ["Je le rends tout de suite", "Je le garde au cas où", "J'attends la fin du chantier"], ok: 0, pourquoi: "Chaque jour de location inutile s'ajoute au coût du chantier." }
      ]
    },
    {
      id: "journal", emoji: "📓", titre: "Journal de chantier, heures et reporting", duree: "15 min",
      intro: "Ce qui n'est pas écrit n'existe pas.",
      sections: [
        { titre: "Le journal de chantier", liste: [
          "Date, météo (pluie, gel, vent : utile pour justifier des intempéries).",
          "Effectifs présents : ton entreprise, sous-traitants, intérimaires.",
          "Travaux réalisés, livraisons, matériel présent.",
          "Visites (maître d'œuvre, CSPS, bureau de contrôle), décisions prises.",
          "Événements : accident, incident, réseau touché, retard d'un autre corps d'état, ordre reçu oralement."
        ] },
        { titre: "Les heures et l'avancement", texte: [
          "Le pointage des heures par tâche permet au conducteur de travaux de comparer le **réalisé** au **prévu** : c'est comme ça qu'on sait si le chantier gagne ou perd de l'argent. On remonte aussi l'avancement (en %, ou en quantités faites) pour établir les **situations de travaux** mensuelles."] },
        { titre: "Les intempéries", texte: [
          "Quand le travail est arrêté à cause de la météo (gel, neige, pluie, vent fort, canicule selon les cas), l'arrêt doit être décidé et tracé selon la procédure de l'entreprise : le journal de chantier en est la preuve."] }
      ],
      retenir: [
        "Journal chaque jour : météo, effectifs, travaux, visites, événements.",
        "Heures par tâche = suivi des coûts.",
        "Un ordre oral se confirme par écrit."
      ],
      terrain: "Quand le maître d'œuvre te demande oralement une modification, réponds « d'accord, je vous envoie un mail pour confirmer ». Sans trace écrite, ces travaux en plus ne seront jamais payés.",
      quiz: [
        { q: "Pourquoi noter la météo dans le journal ?", choix: ["Pour justifier les arrêts pour intempéries et les retards", "Par habitude", "Pour la conversation"], ok: 0, pourquoi: "La météo explique des arrêts, des retards ou des précautions (cure, gel)." },
        { q: "Le maître d'œuvre demande oralement un changement. Tu…", choix: ["Le confirmes par écrit", "L'exécutes sans trace", "Refuses de lui parler"], ok: 0, pourquoi: "Seul l'écrit permet de justifier un coût ou un délai supplémentaire." },
        { q: "À quoi sert le pointage des heures par tâche ?", choix: ["Comparer le réalisé au prévu et suivre la rentabilité", "Surveiller les pauses", "Rien"], ok: 0, pourquoi: "C'est la base du suivi de chantier pour le conducteur de travaux." },
        { q: "Une situation de travaux, c'est…", choix: ["La facturation de l'avancement, souvent mensuelle", "Un accident", "La position de la grue"], ok: 0, pourquoi: "L'entreprise facture au fur et à mesure l'avancement réalisé." },
        { q: "Un réseau a été légèrement touché sans dégât apparent. Doit-on le noter ?", choix: ["Oui, et prévenir l'exploitant", "Non, puisqu'il n'y a pas de dégât", "Seulement si quelqu'un a vu"], ok: 0, pourquoi: "Un dommage peut être caché (gaine abîmée) ; la déclaration protège tout le monde." }
      ]
    }
  ]
});
