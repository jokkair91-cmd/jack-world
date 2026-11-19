/* Parcours 2 — Chef d'équipe */
window.METIERS = window.METIERS || [];
window.METIERS.push({
  id: "chef-equipe", nom: "Chef d'équipe", emoji: "👷", marche: 2,
  resume: "Mener 2 à 6 compagnons, lire un plan, implanter, tenir la qualité.",
  role: "Le **chef d'équipe** est un ouvrier expérimenté qui dirige une petite équipe sur un ouvrage ou une tâche (maçonnerie, gros œuvre, coffrage…). Il travaille avec ses gars, répartit les tâches, lit les plans, implante, contrôle la qualité et fait remonter l'information au chef de chantier.",
  missions: [
    "Répartir le travail de la journée entre les compagnons",
    "Lire les plans d'exécution et implanter les ouvrages",
    "Contrôler l'aplomb, le niveau, les cotes et l'aspect",
    "Faire respecter la sécurité et animer un quart d'heure sécurité",
    "Accueillir et former les nouveaux, les intérimaires et les apprentis",
    "Remonter au chef de chantier l'avancement, les besoins et les problèmes"
  ],
  acces: "après plusieurs années comme ouvrier qualifié (CAP, BP, titre professionnel) ; formation interne ou titre professionnel de chef d'équipe gros œuvre.",
  modules: [
    {
      id: "plans", emoji: "🗺️", titre: "Lire un plan de construction", duree: "25 min",
      intro: "Échelles, vues, cotes, symboles : comprendre ce que l'architecte et le bureau d'études ont dessiné.",
      sections: [
        { titre: "Les grandes familles de plans", liste: [
          "**Plan de masse / plan de situation** : le bâtiment sur la parcelle (échelle 1/200, 1/500…).",
          "**Plans d'architecte** : vues en plan de chaque niveau, coupes, façades.",
          "**Plans d'exécution (EXE)** du bureau d'études : coffrage (dimensions du béton), ferraillage (armatures), réservations.",
          "**Plans de détail** : un point précis à grande échelle (1/20, 1/10, 1/5)."
        ] },
        { titre: "Les vues", liste: [
          "**Vue en plan** : on coupe le bâtiment horizontalement (en général vers 1 m du sol) et on regarde d'en haut.",
          "**Coupe** : on coupe verticalement : on voit les hauteurs, les dalles, les fondations.",
          "**Façade (élévation)** : l'extérieur vu de face.",
          "Le **cartouche** (en bas à droite) donne le nom du projet, le plan, l'échelle, l'**indice** de mise à jour et la date. Toujours travailler sur le **dernier indice**."
        ] },
        { titre: "Échelles et cotes", texte: [
          "Une échelle 1/50 veut dire que 1 cm sur le plan = 50 cm en réalité. À 1/100, 1 cm = 1 m.",
          "On **ne mesure jamais au mètre sur un plan imprimé** (l'impression peut déformer) : on lit les **cotes** écrites. Si une cote manque, on la calcule à partir des autres, et si ça ne tombe pas juste, on demande.",
          "Les cotes de niveau (altimétrie) sont souvent données par rapport au **0,00** du projet (par exemple le niveau fini du rez-de-chaussée) ou en **NGF** (altitude officielle)."] },
        { titre: "Les symboles courants", liste: [
          "Murs coupés en hachures ou en couleur pleine, cloisons plus fines.",
          "Portes : arc de cercle montrant le sens d'ouverture. Fenêtres : trait fin dans l'épaisseur du mur.",
          "**Réservations** : trous ou trémies à laisser dans le béton (gaines, réseaux), souvent avec un repère et des dimensions L × H.",
          "Flèche Nord, repères de coupe (A-A, B-B) qui renvoient vers le plan de coupe."
        ] }
      ],
      retenir: [
        "Toujours vérifier l'indice du plan dans le cartouche.",
        "On lit les cotes, on ne mesure pas sur le papier.",
        "1/50 : 1 cm = 50 cm ; 1/100 : 1 cm = 1 m.",
        "Un doute sur une cote = une question au chef de chantier avant de couler, pas après."
      ],
      terrain: "Avant de commencer un ouvrage, surligne sur ton plan les cotes dont tu as besoin et les réservations. Une réservation oubliée dans un voile, c'est un carottage plus tard… et un coût pour l'entreprise.",
      quiz: [
        { q: "À l'échelle 1/50, 4 cm sur le plan font en réalité…", choix: ["2 m", "4 m", "50 cm"], ok: 0, pourquoi: "4 × 50 = 200 cm, soit 2 m." },
        { q: "Où trouver l'indice (version) d'un plan ?", choix: ["Dans le cartouche", "Au dos du plan", "Sur la flèche Nord"], ok: 0, pourquoi: "Le cartouche donne le titre, l'échelle, l'indice et la date : on travaille toujours sur le dernier indice." },
        { q: "Une cote manque sur le plan. Que faire ?", choix: ["La calculer avec les autres cotes et demander si ça ne tombe pas juste", "Mesurer au mètre sur le papier", "Deviner"], ok: 0, pourquoi: "Mesurer sur un tirage papier est imprécis ; on recoupe par le calcul et on fait valider." },
        { q: "Une coupe montre…", choix: ["Le bâtiment coupé verticalement (les hauteurs)", "Le bâtiment vu d'avion", "Seulement la toiture"], ok: 0, pourquoi: "La coupe montre les niveaux, épaisseurs de dalles, hauteurs sous plafond, fondations." },
        { q: "Qu'est-ce qu'une réservation ?", choix: ["Un trou ou une trémie à laisser dans l'ouvrage pour les réseaux", "Une commande de matériaux", "Un jour de congé"], ok: 0, pourquoi: "Les réservations prévues sur les plans évitent de percer ou carotter le béton après coup." }
      ]
    },
    {
      id: "implantation", emoji: "📍", titre: "Implantation et nivellement", duree: "25 min",
      intro: "Mettre l'ouvrage au bon endroit, d'équerre et à la bonne hauteur.",
      sections: [
        { titre: "Implanter", texte: [
          "Le géomètre pose en général les points principaux (angles du bâtiment, axes). L'équipe reporte ensuite les alignements avec des **chaises d'implantation** placées en retrait de la fouille, et des **cordeaux** tendus entre les chaises."],
          liste: [
            "On reporte les axes sur les chaises par des traits de scie ou des clous.",
            "On contrôle l'**équerrage** : méthode **3-4-5** (3 m sur un côté, 4 m sur l'autre, la diagonale doit faire 5 m) ou **diagonales égales** sur un rectangle.",
            "On recontrôle après les terrassements : une chaise bousculée par un engin décale tout."
          ] },
        { titre: "Niveler", liste: [
          "**Niveau laser rotatif** + cellule sur mire : le plus utilisé aujourd'hui.",
          "**Niveau optique (de chantier)** + mire : on lit une hauteur sur la mire.",
          "**Niveau à eau / tuyau** : simple et fiable pour reporter un niveau dans un bâtiment.",
          "On part d'un **repère de niveau** (point connu, souvent rattaché au 0,00 ou au NGF) et on reporte."
        ] },
        { titre: "Le trait de niveau", texte: [
          "Dans un bâtiment, on trace un **trait de niveau** sur les murs, souvent à **1 m au-dessus du sol fini** (parfois une autre valeur : elle doit être écrite à côté du trait). Tous les corps d'état s'en servent pour poser chapes, menuiseries, carrelage, plafonds.",
          "Exemple : le trait est à +1,00 m du sol fini. Si tu mesures 1,06 m entre le trait et la dalle brute, il y a 6 cm de chape et de revêtement à prévoir."] }
      ],
      retenir: [
        "Chaises d'implantation en retrait de la fouille, cordeaux pour les alignements.",
        "Équerrage : 3-4-5 ou diagonales égales.",
        "Toujours partir d'un repère de niveau connu.",
        "Trait de niveau : la valeur (souvent +1,00 m sol fini) est écrite à côté."
      ],
      terrain: "Fais vérifier ton implantation par une deuxième personne avant de couler les fondations. C'est le contrôle le moins cher du chantier : une erreur ici se paie sur tout le bâtiment.",
      quiz: [
        { q: "Avec la méthode 3-4-5, si un côté fait 3 m et l'autre 4 m, la diagonale doit faire…", choix: ["5 m", "7 m", "4,5 m"], ok: 0, pourquoi: "C'est le théorème de Pythagore : 3² + 4² = 9 + 16 = 25 = 5²." },
        { q: "Comment vérifier qu'un rectangle implanté est d'équerre ?", choix: ["Ses deux diagonales sont égales", "Ses côtés sont parallèles", "On regarde à l'œil"], ok: 0, pourquoi: "Un parallélogramme dont les diagonales sont égales est un rectangle." },
        { q: "Où place-t-on les chaises d'implantation ?", choix: ["En retrait de la future fouille", "Au fond de la fouille", "Sur le terrain voisin sans autorisation"], ok: 0, pourquoi: "En retrait, elles ne sont pas détruites par le terrassement et permettent de retendre les cordeaux." },
        { q: "Le trait de niveau est à +1,00 m du sol fini. Tu mesures 1,08 m jusqu'à la dalle brute. L'épaisseur à prévoir (chape + revêtement) est…", choix: ["8 cm", "1,08 m", "18 cm"], ok: 0, pourquoi: "1,08 − 1,00 = 0,08 m : la dalle brute est 8 cm sous le sol fini." },
        { q: "L'altitude NGF, c'est…", choix: ["L'altitude officielle de référence en France", "Un nom de marque de laser", "La hauteur sous plafond"], ok: 0, pourquoi: "NGF = Nivellement général de la France, le système d'altitudes officiel." }
      ]
    },
    {
      id: "gros-oeuvre", emoji: "🏗️", titre: "Fondations, maçonnerie et béton armé", duree: "30 min",
      intro: "Les étapes du gros œuvre et les points de contrôle du chef d'équipe.",
      sections: [
        { titre: "L'ordre du gros œuvre", liste: [
          "Terrassement et fouilles → **fondations** (semelles filantes, isolées, radier, pieux selon l'étude de sol).",
          "Soubassement, vide sanitaire ou dallage sur terre-plein.",
          "Élévation des murs (maçonnerie de blocs ou **voiles** béton banchés), poteaux, poutres.",
          "Planchers (prédalles, poutrelles-hourdis, dalle pleine), puis on monte niveau par niveau.",
          "Acrotères, chaînages, linteaux, escaliers."
        ] },
        { titre: "Maçonnerie de blocs", liste: [
          "Première rangée très soignée : de niveau et alignée, c'est elle qui conditionne tout le mur.",
          "Monter les **angles** en premier, puis tirer le cordeau d'un angle à l'autre.",
          "Joints réguliers, blocs **croisés** (décalés d'un demi-bloc), contrôle à la règle et au niveau.",
          "**Chaînages** horizontaux et verticaux en béton armé, et **linteaux** au-dessus des ouvertures, comme indiqué sur les plans."
        ] },
        { titre: "Coffrage, ferraillage, coulage", liste: [
          "Coffrage : propre, huilé, étanche, **d'aplomb** et bien étayé, aux bonnes cotes.",
          "Ferraillage conforme au plan : diamètres, espacements, recouvrements, **cales** pour garantir l'**enrobage** (l'épaisseur de béton qui protège l'acier de la rouille).",
          "Avant de couler : contrôle (cotes, aciers, réservations, propreté). Sur beaucoup de chantiers, ce contrôle est tracé (autocontrôle) et parfois vérifié par le bureau de contrôle.",
          "Coulage par couches, **vibration** pour chasser l'air sans faire ressortir la laitance, puis cure et décoffrage au délai prévu."
        ] }
      ],
      danger: "Les fouilles en tranchée profondes doivent être **blindées** ou talutées selon les règles (le Code du travail impose le blindage au-delà de 1,30 m de profondeur pour les tranchées étroites). Ne jamais descendre dans une fouille instable, et ne pas stocker les déblais au bord.",
      retenir: [
        "Première rangée et angles : la qualité du mur se joue là.",
        "Aciers conformes au plan, cales d'enrobage, recouvrements.",
        "Contrôle avant coulage : cotes, aciers, réservations, propreté.",
        "Fouilles profondes : blindage, déblais éloignés du bord."
      ],
      terrain: "Fais une photo de chaque ferraillage avant coulage avec un repère (axe, niveau). En cas de doute plus tard, c'est la seule preuve de ce qu'il y a dans le béton.",
      quiz: [
        { q: "Dans un mur de blocs, que monte-t-on en premier ?", choix: ["Les angles", "Le milieu du mur", "Le haut du mur"], ok: 0, pourquoi: "Les angles servent de guides : on tend le cordeau entre eux pour monter les rangs." },
        { q: "À quoi servent les cales d'armatures ?", choix: ["Garantir l'enrobage de béton autour des aciers", "Décorer", "Économiser du béton"], ok: 0, pourquoi: "Sans enrobage suffisant, l'acier rouille, gonfle et fait éclater le béton." },
        { q: "Pourquoi vibrer le béton ?", choix: ["Pour chasser l'air et bien remplir le coffrage", "Pour le faire sécher", "Pour le colorer"], ok: 0, pourquoi: "La vibration évite les nids de cailloux et les vides, sans excès pour ne pas ségréguer." },
        { q: "Au-delà de quelle profondeur une tranchée étroite doit-elle être blindée selon le Code du travail ?", choix: ["1,30 m", "3 m", "50 cm"], ok: 0, pourquoi: "Le Code du travail fixe le seuil à 1,30 m pour les tranchées dont la largeur est faible par rapport à la profondeur." },
        { q: "Que place-t-on au-dessus d'une ouverture dans un mur ?", choix: ["Un linteau", "Une plinthe", "Une semelle"], ok: 0, pourquoi: "Le linteau reprend les charges du mur au-dessus de la baie." }
      ]
    },
    {
      id: "animer", emoji: "🗣️", titre: "Diriger son équipe au quotidien", duree: "20 min",
      intro: "Passer de « celui qui fait » à « celui qui fait faire » tout en restant avec l'équipe.",
      sections: [
        { titre: "Le briefing du matin (5 minutes)", liste: [
          "**Quoi** : les tâches de la journée et l'objectif (« ce soir, le voile de l'axe B est coulé »).",
          "**Qui** : qui fait quoi, avec qui.",
          "**Avec quoi** : matériel, matériaux, engins disponibles.",
          "**Les risques du jour** et les protections à mettre en place (levage, hauteur, météo…).",
          "Se terminer par : « Des questions ? Il vous manque quelque chose ? »"
        ] },
        { titre: "Donner une consigne claire", liste: [
          "Une consigne = une action précise, mesurable, avec un délai.",
          "Montrer plutôt qu'expliquer longtemps, puis faire faire et vérifier.",
          "Faire reformuler : « Redis-moi ce que tu vas faire » évite beaucoup d'erreurs, surtout avec des personnes qui ne parlent pas bien français.",
          "Féliciter en public, recadrer en privé, toujours sur des faits."
        ] },
        { titre: "Gérer un désaccord", liste: [
          "Écouter jusqu'au bout, rester calme.",
          "Revenir aux faits (« le mur n'est pas d'aplomb de 2 cm ») et non à la personne.",
          "Chercher la solution ensemble, puis décider. Si ça dépasse ton rôle (salaire, sanction, conflit grave), tu remontes au chef de chantier."
        ] }
      ],
      retenir: [
        "Briefing : quoi, qui, avec quoi, risques, questions.",
        "Une consigne claire + faire reformuler.",
        "Féliciter en public, recadrer en privé, sur des faits."
      ],
      terrain: "Avant de partir le soir, prends deux minutes pour préparer le briefing du lendemain : matériaux commandés ? grue disponible ? météo ? Une équipe qui attend le matin, c'est une heure perdue × 5 personnes.",
      quiz: [
        { q: "Que doit contenir le briefing du matin ?", choix: ["Les tâches, qui fait quoi, le matériel, les risques", "Seulement l'heure de la pause", "Les résultats de foot"], ok: 0, pourquoi: "Un briefing court mais complet aligne l'équipe et prévient les risques du jour." },
        { q: "Pourquoi faire reformuler une consigne ?", choix: ["Pour vérifier qu'elle est bien comprise", "Pour gagner du temps en ne disant rien", "Pour piéger le compagnon"], ok: 0, pourquoi: "Une consigne mal comprise produit un travail à refaire ; la reformulation le détecte tout de suite." },
        { q: "Un compagnon fait une erreur. Tu…", choix: ["Lui en parles en privé, sur des faits, et cherches la solution", "Le recadres devant tout le monde", "Ne dis rien et refais derrière lui"], ok: 0, pourquoi: "Recadrer en privé préserve la relation ; parler des faits rend la correction acceptable." },
        { q: "Une bonne consigne est…", choix: ["Précise, mesurable, avec un délai", "Vague pour laisser libre", "Donnée en criant de loin"], ok: 0, pourquoi: "« Monter les 4 rangs du mur axe C avant midi » est une consigne utilisable." },
        { q: "Un conflit grave éclate (insultes, menace). Que fais-tu ?", choix: ["Je sépare, je calme et je remonte au chef de chantier", "Je laisse faire", "Je prends parti"], ok: 0, pourquoi: "Le chef d'équipe gère le quotidien ; les situations graves relèvent de la hiérarchie." }
      ]
    },
    {
      id: "quart-heure", emoji: "⏱️", titre: "Le quart d'heure sécurité et l'accueil", duree: "20 min",
      intro: "Faire vivre la sécurité dans l'équipe, et bien accueillir ceux qui arrivent.",
      sections: [
        { titre: "Le quart d'heure sécurité", texte: [
          "C'est une courte causerie (10 à 15 minutes), régulière (souvent chaque semaine), sur **un seul sujet** concret lié au chantier du moment : travail en hauteur, levage, tranchée, bruit, poussières de silice, chaleur, rangement…"],
          liste: [
            "Partir d'un fait réel : un presque-accident, une photo du chantier, une situation à venir.",
            "Faire parler l'équipe : « Qu'est-ce qui pourrait mal tourner ? Qu'est-ce qu'on fait ? »",
            "Conclure par 1 à 3 actions concrètes, avec qui et quand.",
            "Faire signer une feuille de présence et garder une trace."
          ] },
        { titre: "Accueillir un nouveau", liste: [
          "Le présenter à l'équipe, lui montrer le chantier : accès, vestiaires, sanitaires, trousse de secours, extincteurs, point de rassemblement.",
          "Vérifier ses EPI et ses habilitations ou autorisations.",
          "Expliquer les risques du chantier et les consignes (livret d'accueil s'il existe).",
          "Le mettre en **binôme** avec un compagnon expérimenté les premiers jours.",
          "Les intérimaires et salariés en contrat court affectés à des postes à risques doivent recevoir une **formation renforcée à la sécurité** : c'est une obligation de l'employeur."
        ] }
      ],
      retenir: [
        "Quart d'heure : un sujet, du concret, l'équipe parle, des actions, une trace.",
        "Accueil : visite, EPI, risques, binôme.",
        "Les nouveaux et les intérimaires sont les plus exposés les premiers jours."
      ],
      terrain: "Commence ton quart d'heure par une question plutôt qu'un discours : « Hier, qui a vu quelque chose de dangereux ? ». Les gars connaissent les risques mieux que n'importe quelle affiche.",
      quiz: [
        { q: "Combien de sujets aborder dans un quart d'heure sécurité ?", choix: ["Un seul, concret", "Tous les risques du chantier", "Aucun, juste signer la feuille"], ok: 0, pourquoi: "Un sujet bien traité est retenu ; dix sujets survolés sont oubliés." },
        { q: "Comment terminer un quart d'heure sécurité ?", choix: ["Par des actions concrètes avec qui et quand", "Par une sanction", "Sans conclusion"], ok: 0, pourquoi: "Sans action décidée, la causerie ne change rien sur le terrain." },
        { q: "Un intérimaire arrive sur un poste à risques. L'employeur doit…", choix: ["Lui donner une formation renforcée à la sécurité", "Le mettre au travail sans rien dire", "Lui faire signer une décharge"], ok: 0, pourquoi: "C'est une obligation du Code du travail pour les salariés temporaires et en CDD sur postes à risques." },
        { q: "Les premiers jours, le nouveau travaille…", choix: ["En binôme avec un compagnon expérimenté", "Seul pour voir s'il se débrouille", "Seulement au nettoyage"], ok: 0, pourquoi: "Le binôme transmet les bons gestes et les dangers du chantier." },
        { q: "Pourquoi garder une trace (feuille signée) ?", choix: ["Pour prouver que l'information a été donnée et suivre les actions", "Pour faire de la paperasse", "Ce n'est pas utile"], ok: 0, pourquoi: "La traçabilité montre l'action de prévention et permet de suivre les actions décidées." }
      ]
    },
    {
      id: "qualite", emoji: "✅", titre: "Qualité, autocontrôle et remontée d'infos", duree: "15 min",
      intro: "Faire bien du premier coup et le prouver.",
      sections: [
        { titre: "L'autocontrôle", texte: [
          "L'autocontrôle, c'est l'équipe qui vérifie son propre travail **pendant** et **à la fin** de chaque tâche, avec une fiche simple : ce qu'on contrôle, la tolérance, le résultat, la date, le nom."],
          liste: [
            "Cotes et implantation, aplomb et niveau (avec les tolérances du CCTP ou du DTU).",
            "Aspect (parement, joints), réservations, propreté.",
            "Photo à l'appui pour les ouvrages qui seront cachés (aciers, réseaux, étanchéité)."
          ] },
        { titre: "Les non-conformités", texte: [
          "Si un ouvrage n'est pas conforme, on ne le cache pas : on le signale tout de suite au chef de chantier. Plus on le découvre tôt, moins il coûte à reprendre. Une reprise après coulage ou après passage des corps d'état suivants peut coûter très cher."] },
        { titre: "Remonter l'information", liste: [
          "Avancement de la journée (fait / pas fait / pourquoi).",
          "Besoins pour demain et la semaine : matériaux, matériel, main-d'œuvre.",
          "Problèmes : plan incohérent, attente d'un autre corps d'état, météo, accident ou presque-accident.",
          "Heures de l'équipe (pointage) si c'est à toi de les noter."
        ] }
      ],
      retenir: [
        "On contrôle avant de cacher : photo des ouvrages enterrés ou noyés.",
        "Une non-conformité se signale tout de suite.",
        "Chaque soir : avancement, besoins, problèmes."
      ],
      terrain: "Garde un petit carnet ou une note sur ton téléphone : 3 lignes par jour (fait, demain, problèmes). Ton chef de chantier s'en sert pour son journal de chantier et tu deviens la personne sur qui on peut compter.",
      quiz: [
        { q: "Qu'est-ce que l'autocontrôle ?", choix: ["L'équipe vérifie elle-même son travail et le trace", "Un contrôle de police", "La conduite automatique d'un engin"], ok: 0, pourquoi: "C'est le premier niveau de contrôle qualité, fait par ceux qui réalisent." },
        { q: "Tu découvres qu'une réservation a été oubliée avant le coulage. Tu…", choix: ["Arrêtes et signales tout de suite au chef de chantier", "Couls quand même, on carottera", "Ne dis rien"], ok: 0, pourquoi: "Corriger avant coulage coûte quelques minutes ; après, il faut carotter, et parfois l'avis du bureau d'études." },
        { q: "Pourquoi photographier les aciers avant coulage ?", choix: ["Pour garder la preuve de ce qui est noyé dans le béton", "Pour les réseaux sociaux", "Pour rien"], ok: 0, pourquoi: "Une fois coulés, les aciers ne se voient plus : la photo est la seule trace." },
        { q: "Où trouve-t-on les tolérances d'exécution ?", choix: ["Dans le CCTP et les DTU (normes de mise en œuvre)", "Sur l'emballage des parpaings uniquement", "Nulle part"], ok: 0, pourquoi: "Le CCTP du marché et les DTU fixent les tolérances (planéité, aplomb…)." },
        { q: "Qu'est-ce que le chef d'équipe remonte chaque jour ?", choix: ["Avancement, besoins et problèmes", "Seulement les problèmes graves", "Rien, c'est le rôle du conducteur"], ok: 0, pourquoi: "Ces infos permettent au chef de chantier d'anticiper et de tenir son planning." }
      ]
    }
  ]
});
