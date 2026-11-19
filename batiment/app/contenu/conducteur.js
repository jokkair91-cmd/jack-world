/* Parcours 4 — Conducteur de travaux (conducteur de chantier) */
window.METIERS = window.METIERS || [];
window.METIERS.push({
  id: "conducteur", nom: "Conducteur de travaux", emoji: "🏢", marche: 4,
  resume: "Piloter un ou plusieurs chantiers : marché, budget, planning, client, réception.",
  role: "Le **conducteur de travaux** (on dit aussi **conducteur de chantier**) représente l'entreprise auprès du client et pilote un ou plusieurs chantiers du démarrage à la réception : préparation, budget, planning, achats, sous-traitance, facturation, réunions, gestion des modifications et réception. Il encadre les chefs de chantier.",
  missions: [
    "Étudier le marché (pièces écrites, plans) et préparer le chantier",
    "Établir et suivre le budget (déboursé sec, marge) et les achats",
    "Construire le planning et suivre l'avancement",
    "Représenter l'entreprise aux réunions de chantier",
    "Gérer les modifications, devis de travaux supplémentaires et avenants",
    "Établir les situations de travaux (facturation) et le décompte final",
    "Organiser les OPR, la réception, la levée des réserves et le DOE"
  ],
  acces: "souvent avec un BTS, un DUT/BUT génie civil, une licence professionnelle ou un diplôme d'ingénieur, ou par promotion interne d'un chef de chantier expérimenté.",
  modules: [
    {
      id: "marche", emoji: "📑", titre: "Le marché de travaux et ses pièces", duree: "25 min",
      intro: "Savoir ce que l'entreprise a vendu, à qui, et dans quelles conditions.",
      sections: [
        { titre: "Les acteurs", liste: [
          "**Maître d'ouvrage (MOA)** : le client, qui paie et pour qui on construit.",
          "**Maître d'œuvre (MOE)** : l'architecte et/ou le bureau d'études qui conçoit et dirige l'exécution pour le compte du MOA (visa des plans, suivi, réception).",
          "**Entreprises** : titulaires des lots (gros œuvre, charpente, plomberie…), et leurs sous-traitants.",
          "**Bureau de contrôle**, **coordonnateur SPS**, parfois un **OPC** (ordonnancement, pilotage, coordination)."
        ] },
        { titre: "Les pièces du marché", liste: [
          "**Acte d'engagement** : l'offre signée (montant, délai).",
          "**CCAP** (cahier des clauses administratives particulières) : délais, pénalités, modalités de paiement, retenue de garantie, révision des prix…",
          "**CCTP** (cahier des clauses techniques particulières) : ce qu'il faut construire et comment (matériaux, performances, normes, DTU).",
          "**DPGF** (décomposition du prix global et forfaitaire) ou **BPU / DQE** (bordereau de prix unitaires / détail quantitatif estimatif) selon le type de marché.",
          "**Plans** et documents graphiques, planning contractuel.",
          "En marché public, les **CCAG** (cahiers des clauses administratives générales) s'appliquent souvent par référence ; en privé, la norme **NF P 03-001** est fréquemment utilisée."
        ] },
        { titre: "Forfait ou prix unitaires", texte: [
          "Au **forfait** (prix global), l'entreprise s'engage sur un prix pour un ouvrage décrit : les erreurs de quantités sont en principe à sa charge, sauf modifications demandées par le client.",
          "Aux **prix unitaires**, on paie les quantités réellement exécutées multipliées par les prix du bordereau."] }
      ],
      retenir: [
        "MOA = client ; MOE = concepteur qui dirige l'exécution pour le client.",
        "CCAP = règles administratives ; CCTP = règles techniques.",
        "Forfait : prix global ; prix unitaires : quantités réelles × prix.",
        "On lit le CCAP avant de démarrer : pénalités, délais, paiements."
      ],
      terrain: "Fais une fiche d'une page « ce qu'il faut savoir du marché » pour ton chef de chantier : délais, pénalités, horaires, contraintes de voisinage, exigences particulières du CCTP. Il ne lira jamais les 200 pages, mais il lira ta fiche.",
      quiz: [
        { q: "Qui est le maître d'ouvrage ?", choix: ["Le client pour qui l'ouvrage est construit", "L'architecte", "Le chef de chantier"], ok: 0, pourquoi: "Le MOA commande et finance l'ouvrage." },
        { q: "Les pénalités de retard se trouvent en général dans…", choix: ["Le CCAP", "Le CCTP", "Le plan de masse"], ok: 0, pourquoi: "Le CCAP regroupe les clauses administratives : délais, pénalités, paiements." },
        { q: "Le CCTP décrit…", choix: ["Les exigences techniques des ouvrages", "Le montant du marché", "Les horaires des réunions"], ok: 0, pourquoi: "Cahier des clauses techniques particulières : matériaux, mises en œuvre, performances." },
        { q: "Dans un marché à prix unitaires, on paie…", choix: ["Les quantités réellement exécutées × les prix unitaires", "Un prix global fixé d'avance quoi qu'il arrive", "Uniquement les heures"], ok: 0, pourquoi: "Le BPU donne les prix, les quantités réelles sont métrées." },
        { q: "Le maître d'œuvre…", choix: ["Conçoit et dirige l'exécution pour le compte du client", "Paie les entreprises avec son argent", "Fabrique le béton"], ok: 0, pourquoi: "Il est le « chef d'orchestre » technique du MOA." }
      ]
    },
    {
      id: "budget", emoji: "💶", titre: "Budget : déboursé sec, frais et marge", duree: "30 min",
      intro: "Comprendre comment se construit un prix et comment on le suit.",
      sections: [
        { titre: "Du déboursé sec au prix de vente", liste: [
          "**Déboursé sec (DS)** : ce que coûte directement l'ouvrage : main-d'œuvre (heures × coût horaire chargé), matériaux, matériel, sous-traitance.",
          "**Frais de chantier** : installation, cantonnement, grue, encadrement, nettoyage, gardiennage… (souvent calculés à part).",
          "**Frais généraux** de l'entreprise : siège, bureau d'études, assurances, comptabilité…",
          "**Bénéfice et aléas** : la marge.",
          "Prix de vente (PV) HT = déboursé sec × **coefficient de vente** (ou K), qui couvre frais, aléas et marge."
        ] },
        { titre: "Exemple", texte: [
          "Un mur : 40 h de main-d'œuvre à 35 €/h chargés = 1 400 € ; matériaux 900 € ; matériel 100 €. Déboursé sec = **2 400 €**.",
          "Avec un coefficient de vente de 1,35 : prix de vente HT = 2 400 × 1,35 = **3 240 €**. Si sur le chantier les heures passent à 55 h, la main-d'œuvre coûte 1 925 € : le DS monte à 2 925 € et la marge fond."] },
        { titre: "Le budget d'exécution et son suivi", liste: [
          "Au démarrage, le conducteur transforme l'étude de prix en **budget d'exécution** (objectif d'heures, d'achats, de sous-traitance par poste).",
          "Chaque mois : **dépenses réelles + reste à dépenser** estimé = coût prévisionnel à fin de chantier, comparé aux recettes prévues (marché + avenants).",
          "Les écarts s'analysent par poste : rendement, prix d'achat, quantités, travaux non payés…",
          "Achats : mise en concurrence des fournisseurs et sous-traitants, contrats écrits."
        ] }
      ],
      retenir: [
        "DS = main-d'œuvre + matériaux + matériel + sous-traitance.",
        "PV HT = DS × coefficient de vente.",
        "Coût à fin = dépensé + reste à dépenser ; on le compare aux recettes chaque mois.",
        "Les heures sont le premier poste à surveiller."
      ],
      terrain: "Fais chaque mois un point « fin d'affaire » de 30 minutes avec ton chef de chantier : heures consommées vs prévues, gros achats à venir, travaux en plus non encore chiffrés. Les mauvaises surprises arrivent quand on regarde les chiffres une fois par trimestre.",
      quiz: [
        { q: "Que comprend le déboursé sec ?", choix: ["Main-d'œuvre, matériaux, matériel, sous-traitance directs", "Seulement la marge", "Les frais du siège"], ok: 0, pourquoi: "Le DS est le coût direct de l'ouvrage, avant frais généraux et marge." },
        { q: "DS = 10 000 €, coefficient de vente 1,30. Prix de vente HT ?", choix: ["13 000 €", "10 300 €", "7 700 €"], ok: 0, pourquoi: "10 000 × 1,30 = 13 000 € HT." },
        { q: "Coût prévisionnel à fin de chantier = …", choix: ["Dépenses réelles + reste à dépenser", "Montant du marché", "Dépenses du mois"], ok: 0, pourquoi: "C'est la meilleure estimation de ce que coûtera le chantier une fois terminé." },
        { q: "Les heures prévues étaient 400, on en est à 380 avec 70 % d'avancement. C'est…", choix: ["Inquiétant : on va probablement dépasser", "Parfait", "Impossible à dire"], ok: 0, pourquoi: "À 70 % on devrait être autour de 280 h ; au rythme actuel on finira vers 540 h." },
        { q: "Où se trouvent les frais du siège (comptabilité, BE) ?", choix: ["Dans les frais généraux couverts par le coefficient", "Dans le déboursé sec", "Nulle part"], ok: 0, pourquoi: "Ils ne sont pas propres à un ouvrage : on les couvre par le coefficient de vente." }
      ]
    },
    {
      id: "situations", emoji: "🧾", titre: "Situations, modifications et avenants", duree: "25 min",
      intro: "Se faire payer ce qui est fait… et ce qui est en plus.",
      sections: [
        { titre: "Les situations de travaux", liste: [
          "Chaque mois (souvent), l'entreprise établit une **situation** : l'avancement cumulé par poste du DPGF, valorisé en euros.",
          "Le maître d'œuvre la vérifie, la valide, et le maître d'ouvrage paie dans le délai prévu par le marché.",
          "La **retenue de garantie** (souvent 5 % au maximum) peut être prélevée sur chaque paiement ; elle peut être remplacée par une caution bancaire. Elle est libérée après le délai de garantie de parfait achèvement, sauf réserves non levées."
        ] },
        { titre: "Les modifications", liste: [
          "Le client ou le MOE demande un changement : on fait un **devis de travaux supplémentaires** (ou modificatifs) **avant** de les réaliser.",
          "On obtient un accord **écrit** : **ordre de service (OS)**, devis signé, ou **avenant** au marché.",
          "Si la modification change les délais, on le dit et on l'écrit en même temps que le prix.",
          "Sans écrit, les travaux supplémentaires risquent de ne jamais être payés, surtout dans un marché à forfait."
        ] },
        { titre: "La fin financière", texte: [
          "À la fin, l'entreprise remet son **projet de décompte final** ; le MOE et le MOA l'arrêtent : en marché public on parle de **DGD** (décompte général et définitif). Une fois accepté, il est très difficile de réclamer quoi que ce soit en plus : tout doit avoir été chiffré et réclamé avant."] }
      ],
      retenir: [
        "Situation = avancement cumulé valorisé, en général mensuel.",
        "Retenue de garantie (souvent 5 % max), remplaçable par une caution.",
        "Travaux en plus : devis + accord écrit (OS, avenant) AVANT de faire.",
        "Le décompte final clôt les comptes : tout réclamer avant."
      ],
      terrain: "Tiens un tableau des modifications : date de la demande, demandeur, devis envoyé, accord reçu (oui/non), montant, impact délai. Envoie-le au MOE à chaque réunion. C'est souvent ce tableau qui fait la marge du chantier.",
      quiz: [
        { q: "Une situation de travaux, c'est…", choix: ["La facturation de l'avancement cumulé", "Un plan de situation", "Un arrêt de chantier"], ok: 0, pourquoi: "On valorise ce qui est fait, poste par poste, généralement chaque mois." },
        { q: "Le client demande un travail en plus. Que fais-tu d'abord ?", choix: ["Un devis et un accord écrit avant de réaliser", "Je le fais, on verra après", "Je refuse toujours"], ok: 0, pourquoi: "L'accord écrit (OS, devis signé, avenant) garantit le paiement." },
        { q: "La retenue de garantie est souvent limitée à…", choix: ["5 %", "50 %", "0,5 %"], ok: 0, pourquoi: "La loi plafonne la retenue de garantie à 5 % du montant des travaux, et elle peut être remplacée par une caution." },
        { q: "Un avenant, c'est…", choix: ["Une modification écrite du marché signée par les parties", "Un ouvrier intérimaire", "Une pièce de charpente"], ok: 0, pourquoi: "L'avenant modifie le contrat (prix, délais, contenu)." },
        { q: "Après l'acceptation du décompte final, réclamer un supplément est…", choix: ["Très difficile, voire impossible", "Facile", "Automatique"], ok: 0, pourquoi: "Le décompte définitif fige les comptes : il faut tout réclamer avant." }
      ]
    },
    {
      id: "reunions", emoji: "🤝", titre: "Réunions de chantier et relation client", duree: "20 min",
      intro: "Représenter l'entreprise, défendre ses intérêts et garder une bonne relation.",
      sections: [
        { titre: "La réunion de chantier hebdomadaire", liste: [
          "Animée en général par le **maître d'œuvre**, avec les entreprises, parfois le MOA, le CSPS, le bureau de contrôle.",
          "Ordre du jour type : sécurité, avancement par lot vs planning, points techniques, plans à valider (visas), modifications, organisation des semaines à venir.",
          "Le MOE rédige et diffuse un **compte rendu** (CR) qui a valeur de trace contractuelle."
        ] },
        { titre: "Bien préparer et bien suivre", liste: [
          "Arriver avec : l'avancement réel, les points bloquants, les plans ou choix attendus, le tableau des modifications.",
          "Demander les décisions avec une **date limite** : « il nous faut le choix du carrelage avant le 15 pour tenir le planning ».",
          "**Relire le compte rendu** dès réception et contester par écrit ce qui est faux ou incomplet, rapidement. Un CR non contesté vaut acceptation de fait."
        ] },
        { titre: "La relation avec le client et les voisins", liste: [
          "Être clair, joignable, et annoncer les problèmes tôt (avec une solution si possible).",
          "Ne jamais promettre ce qu'on ne peut pas tenir.",
          "Voisins : informer avant les phases bruyantes ou gênantes, garder un chantier propre, traiter vite les réclamations."
        ] }
      ],
      retenir: [
        "Le CR de réunion fait foi : on le relit et on conteste par écrit.",
        "Demander des décisions avec une date limite.",
        "Annoncer les problèmes tôt, avec une solution."
      ],
      terrain: "Apporte en réunion une liste « en attente de » : qui doit quoi à qui et pour quand. Quand le retard arrive, c'est la preuve que l'information t'a manqué, et non que l'entreprise a traîné.",
      quiz: [
        { q: "Qui rédige en général le compte rendu de réunion de chantier ?", choix: ["Le maître d'œuvre", "Le manœuvre", "Le fournisseur"], ok: 0, pourquoi: "Le MOE anime et diffuse le CR à tous les intervenants." },
        { q: "Le compte rendu contient une erreur sur ton lot. Tu…", choix: ["La contestes par écrit rapidement", "Ne dis rien", "Attends la réception"], ok: 0, pourquoi: "Un CR non contesté est considéré comme accepté." },
        { q: "Comment demander un choix au client ?", choix: ["Avec une date limite liée au planning", "Sans date, il verra", "Uniquement à l'oral"], ok: 0, pourquoi: "La date limite écrite justifie un éventuel décalage si le choix arrive en retard." },
        { q: "Un problème technique va retarder le chantier. Quand l'annoncer ?", choix: ["Le plus tôt possible, avec des solutions", "Le plus tard possible", "Jamais"], ok: 0, pourquoi: "Plus c'est tôt, plus on a d'options pour rattraper." },
        { q: "Une phase de démolition bruyante approche. Pour les voisins…", choix: ["On les informe à l'avance", "On ne dit rien", "On travaille la nuit pour gêner moins"], ok: 0, pourquoi: "L'information préalable évite la plupart des conflits de voisinage." }
      ]
    },
    {
      id: "reception", emoji: "🔑", titre: "OPR, réception, garanties et DOE", duree: "25 min",
      intro: "Bien finir un chantier, c'est se protéger pour les 10 ans qui suivent.",
      sections: [
        { titre: "Les OPR", texte: [
          "Les **opérations préalables à la réception (OPR)** : le maître d'œuvre visite l'ouvrage avec chaque entreprise et liste les défauts et finitions manquantes. On les prépare en faisant soi-même une visite avant (autocontrôle de fin)."] },
        { titre: "La réception", liste: [
          "C'est l'acte par lequel le **maître d'ouvrage accepte l'ouvrage**, avec ou sans **réserves**, par un **procès-verbal (PV)**.",
          "Elle transfère la garde de l'ouvrage au client et fait démarrer les garanties.",
          "Les réserves doivent être levées dans le délai fixé ; on trace chaque levée."
        ] },
        { titre: "Les garanties légales", liste: [
          "**Garantie de parfait achèvement : 1 an** : l'entreprise répare tous les désordres signalés (réserves, et ceux notifiés pendant l'année).",
          "**Garantie biennale (de bon fonctionnement) : 2 ans** : les équipements dissociables (qui s'enlèvent sans abîmer l'ouvrage).",
          "**Garantie décennale : 10 ans** : les dommages qui compromettent la solidité de l'ouvrage ou le rendent impropre à sa destination. Elle est couverte par l'**assurance décennale** obligatoire de l'entreprise.",
          "Côté client, l'assurance **dommages-ouvrage** permet d'être indemnisé rapidement sans attendre qu'on désigne le responsable."
        ] },
        { titre: "Les documents de fin", liste: [
          "**DOE** (dossier des ouvrages exécutés) : plans conformes à ce qui a été construit, fiches techniques, notices, PV d'essais.",
          "**DIUO** complété (avec le CSPS).",
          "Décompte final, mainlevée de la retenue de garantie après le délai de parfait achèvement."
        ] }
      ],
      retenir: [
        "OPR → réception avec ou sans réserves (PV) → levée des réserves.",
        "Garanties : parfait achèvement 1 an, biennale 2 ans, décennale 10 ans.",
        "DOE = plans et documents de ce qui a vraiment été construit."
      ],
      terrain: "Commence le DOE dès le début du chantier : chaque fiche technique validée, chaque PV d'essai va dans un dossier partagé. À la fin, il ne reste qu'à assembler, au lieu de courir après les fournisseurs pendant six mois.",
      quiz: [
        { q: "Qui prononce la réception de l'ouvrage ?", choix: ["Le maître d'ouvrage", "Le chef de chantier", "Le fournisseur de béton"], ok: 0, pourquoi: "La réception est l'acte du maître d'ouvrage, en général avec l'assistance du maître d'œuvre." },
        { q: "Durée de la garantie de parfait achèvement ?", choix: ["1 an", "2 ans", "10 ans"], ok: 0, pourquoi: "1 an à compter de la réception." },
        { q: "Une fissure qui compromet la solidité, découverte 6 ans après la réception, relève de…", choix: ["La garantie décennale", "La garantie de parfait achèvement", "Aucune garantie"], ok: 0, pourquoi: "Les désordres touchant la solidité relèvent de la décennale, pendant 10 ans." },
        { q: "Un robinet mitigeur défaillant 18 mois après réception relève en général de…", choix: ["La garantie biennale (bon fonctionnement)", "La décennale", "Aucune garantie"], ok: 0, pourquoi: "C'est un équipement dissociable : garantie de bon fonctionnement de 2 ans." },
        { q: "Le DOE contient…", choix: ["Les plans et documents de l'ouvrage réellement exécuté", "Les devis non signés", "Le planning prévisionnel"], ok: 0, pourquoi: "Dossier des ouvrages exécutés : la mémoire technique de l'ouvrage pour le client." }
      ]
    },
    {
      id: "pilotage", emoji: "🧭", titre: "Préparation, pilotage et aléas", duree: "20 min",
      intro: "La période de préparation et l'art de gérer l'imprévu.",
      sections: [
        { titre: "La période de préparation", liste: [
          "Analyse du marché, des plans, des risques (techniques, délais, financiers).",
          "Budget d'exécution, planning détaillé, méthodes (grue, banches, étaiement, phasage).",
          "Consultation et choix des sous-traitants et fournisseurs.",
          "Plans d'exécution et **visas** du maître d'œuvre, avis du bureau de contrôle.",
          "Démarches : DICT, PPSPS, voirie, installation de chantier."
        ] },
        { titre: "Piloter plusieurs chantiers", liste: [
          "Un rituel par semaine et par chantier : visite, point avec le chef de chantier, réunion client.",
          "Un tableau de bord simple : avancement vs planning, heures vs budget, modifications en attente, sécurité (accidents, presque-accidents), qualité (réserves).",
          "Déléguer au chef de chantier ce qui est terrain, garder le contractuel et le financier."
        ] },
        { titre: "Gérer un aléa", liste: [
          "**Constater** et tracer (photos, journal, courrier).",
          "**Informer** vite le MOE/MOA par écrit, avec les conséquences (coût, délai).",
          "**Proposer** une ou des solutions chiffrées.",
          "**Faire valider** par écrit avant d'engager des dépenses (sauf urgence de sécurité).",
          "Exemples : sol différent de l'étude, réseau non répertorié, défaillance d'un sous-traitant, intempéries exceptionnelles, choix client en retard."
        ] }
      ],
      retenir: [
        "Une bonne préparation fait la moitié du chantier.",
        "Tableau de bord : délais, heures, modifications, sécurité, qualité.",
        "Aléa : constater, informer par écrit, proposer, faire valider."
      ],
      terrain: "Le lundi matin, appelle chacun de tes chefs de chantier avec les mêmes trois questions : « Qu'est-ce qui t'empêche d'avancer ? De quoi as-tu besoin de moi ? Y a-t-il eu un incident sécurité ? ». Ton rôle est d'enlever les obstacles.",
      quiz: [
        { q: "Pendant la préparation, qui vise les plans d'exécution ?", choix: ["Le maître d'œuvre", "Le manœuvre", "Le loueur de matériel"], ok: 0, pourquoi: "Le MOE vise les plans d'exécution ; le bureau de contrôle donne son avis sur les points de sa mission." },
        { q: "Le sol découvert est différent de l'étude géotechnique. Première étape ?", choix: ["Constater, tracer et informer par écrit le MOE/MOA", "Continuer comme prévu", "Arrêter le chantier sans prévenir"], ok: 0, pourquoi: "C'est un aléa à traiter contractuellement et techniquement (avis du bureau d'études)." },
        { q: "Ce qu'un conducteur de travaux garde en priorité pour lui :", choix: ["Le contractuel et le financier", "Le ferraillage des poteaux", "Le nettoyage de la bétonnière"], ok: 0, pourquoi: "Le terrain est délégué au chef de chantier ; le conducteur pilote contrat, budget et client." },
        { q: "Avant d'engager une dépense pour un aléa (hors urgence sécurité)…", choix: ["On fait valider par écrit", "On dépense, on facturera après", "On demande au voisin"], ok: 0, pourquoi: "Sans accord préalable, la dépense risque de rester à la charge de l'entreprise." },
        { q: "Un bon tableau de bord de chantier suit…", choix: ["Délais, heures, modifications, sécurité, qualité", "Seulement la météo", "Uniquement le chiffre d'affaires"], ok: 0, pourquoi: "Ces indicateurs donnent une vision complète de la santé du chantier." }
      ]
    }
  ]
});
