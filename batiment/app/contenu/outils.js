/* Boîte à outils : check-lists imprimables et glossaire */
window.OUTILS = {
  checklists: [
    {
      id: "journal", emoji: "📓", titre: "Journal de chantier (jour)",
      intro: "À remplir chaque soir : c'est la mémoire et la preuve du chantier.",
      groupes: [
        { titre: "Conditions", items: ["Météo notée (pluie, vent, gel, chaleur) et températures si besoin", "Arrêt pour intempéries ? Heure de début et de fin notées", "Effectif de l'entreprise noté (nom ou nombre)", "Sous-traitants et intérimaires présents notés"] },
        { titre: "Travaux", items: ["Travaux réalisés dans la journée (où, quoi, quantités)", "Livraisons reçues, bons de livraison vérifiés et classés", "Matériel présent, arrivé ou rendu (locations)", "Photos des ouvrages cachés (aciers, réseaux, étanchéité)"] },
        { titre: "Événements", items: ["Visites (MOE, CSPS, bureau de contrôle, client) et observations", "Ordres oraux reçus — à confirmer par écrit", "Accident, presque-accident ou incident réseau", "Problèmes, attentes d'un autre corps d'état, retards"] },
        { titre: "Demain", items: ["Travaux prévus et équipes", "Commandes et livraisons à confirmer", "Moyens de levage / engins réservés"] }
      ],
      conseil: "Écris des faits, pas des opinions : « la plomberie n'a pas posé les réservations axe C, coulage décalé au 12 » plutôt que « le plombier traîne »."
    },
    {
      id: "reunion", emoji: "🤝", titre: "Préparer une réunion de chantier",
      intro: "Arriver préparé, repartir avec des décisions.",
      groupes: [
        { titre: "Avant", items: ["Dernier compte rendu relu, points en attente listés", "Avancement réel de mes lots vs planning", "Points bloquants et décisions attendues (avec date limite)", "Plans ou fiches techniques à faire viser", "Tableau des modifications / devis en attente à jour", "Points sécurité à remonter"] },
        { titre: "Pendant", items: ["Noter les décisions et qui fait quoi pour quand", "Demander les dates limites des choix client", "Signaler par écrit les retards causés par d'autres"] },
        { titre: "Après", items: ["Compte rendu reçu et relu dans les jours qui suivent", "Erreurs ou oublis contestés par écrit", "Actions transmises au chef de chantier et aux équipes"] }
      ],
      conseil: "Un compte rendu non contesté est considéré comme accepté : relis-le vite."
    },
    {
      id: "accueil", emoji: "👋", titre: "Accueil d'un nouvel arrivant",
      intro: "Nouveau salarié, intérimaire, apprenti : les premières heures comptent double.",
      groupes: [
        { titre: "Administratif", items: ["Identité et contrat vérifiés (carte professionnelle BTP si concerné)", "Autorisations / habilitations / CACES vérifiés si nécessaire", "Formation renforcée à la sécurité prévue s'il est intérimaire ou en CDD sur poste à risques"] },
        { titre: "Visite du chantier", items: ["Accès, circulations piétons et engins", "Vestiaires, sanitaires, réfectoire, eau potable", "Trousse de secours, SST présents, extincteurs", "Point de rassemblement et consignes d'évacuation", "Zones interdites et zones de levage"] },
        { titre: "Sécurité du poste", items: ["EPI fournis, ajustés et portés", "Risques du poste expliqués et compris (faire reformuler)", "Consignes du PPSPS / livret d'accueil remis", "Binôme avec un compagnon expérimenté désigné"] },
        { titre: "Fin de première journée", items: ["Point avec le nouveau : questions, difficultés", "Remarques du binôme"] }
      ],
      conseil: "Fais-le reformuler en ses mots : « Montre-moi où tu vas si l'alarme sonne. »"
    },
    {
      id: "quart-heure", emoji: "⏱️", titre: "Quart d'heure sécurité",
      intro: "Une causerie courte, un seul sujet, des actions concrètes.",
      groupes: [
        { titre: "Préparer", items: ["Sujet choisi lié au chantier du moment", "Fait réel ou photo pour démarrer", "Lieu calme, à côté de la zone concernée si possible"] },
        { titre: "Animer (10 à 15 min)", items: ["Poser une question ouverte : « Qu'est-ce qui peut mal tourner ? »", "Faire parler chacun, y compris les nouveaux", "Rappeler la bonne pratique ou la règle", "Décider 1 à 3 actions concrètes (qui, quoi, quand)"] },
        { titre: "Tracer", items: ["Feuille de présence signée", "Actions notées et suivies au prochain quart d'heure"] }
      ],
      conseil: "Idées de sujets : trémies et garde-corps, élingage, poussières de silice, chaleur et hydratation, circulation des engins, rangement, échelles, bruit, réseaux enterrés."
    },
    {
      id: "avant-coulage", emoji: "🧱", titre: "Contrôle avant coulage",
      intro: "Le dernier moment où on peut encore corriger sans carotter.",
      groupes: [
        { titre: "Coffrage", items: ["Implantation et cotes conformes au plan (dernier indice)", "Aplomb / niveau vérifiés", "Coffrage propre, huilé, étanche, étaiement en place", "Niveau d'arase marqué"] },
        { titre: "Armatures", items: ["Diamètres et espacements conformes au plan de ferraillage", "Recouvrements et ancrages respectés", "Cales d'enrobage en place", "Attentes pour la suite en place"] },
        { titre: "Réservations et inserts", items: ["Réservations en place et bien fixées", "Fourreaux, boîtiers, platines, douilles en place", "Corps d'état concernés passés et d'accord"] },
        { titre: "Organisation", items: ["Béton commandé (classe, consistance, volume, heure)", "Accès toupie / pompe dégagé", "Vibreur, matériel de cure prévus", "Photos prises", "Météo vérifiée (pluie, gel, forte chaleur)"] }
      ],
      conseil: "Fais signer cette fiche par la personne qui a contrôlé : c'est ton autocontrôle tracé."
    },
    {
      id: "reception", emoji: "🔑", titre: "Préparer les OPR et la réception",
      intro: "Bien finir pour bien être payé et tranquille 10 ans.",
      groupes: [
        { titre: "Avant les OPR", items: ["Autocontrôle de fin fait local par local", "Nettoyage fin de chantier", "Essais réalisés et PV disponibles (étanchéité, réseaux…)", "Notices et fiches techniques rassemblées"] },
        { titre: "OPR et réception", items: ["Liste des réserves relevée avec le MOE", "PV de réception signé (avec ou sans réserves)", "Délai de levée des réserves noté"] },
        { titre: "Après", items: ["Réserves levées une par une et tracées", "DOE remis (plans conformes à l'exécution, fiches, notices)", "Éléments du DIUO transmis", "Décompte final préparé, retenue de garantie suivie"] }
      ],
      conseil: "Rappel des garanties : parfait achèvement 1 an, biennale 2 ans (équipements dissociables), décennale 10 ans (solidité, impropriété à la destination)."
    }
  ],
  glossaire: [
    { mot: "Acrotère", def: "Petit muret en bordure d'une toiture-terrasse, qui sert notamment à relever l'étanchéité." },
    { mot: "AIPR", def: "Autorisation d'intervention à proximité des réseaux. Délivrée par l'employeur après examen, pour concevoir, encadrer ou exécuter des travaux près des réseaux." },
    { mot: "Aplomb", def: "Verticalité d'un ouvrage. On contrôle l'aplomb au niveau, au fil à plomb ou au laser." },
    { mot: "Arase", def: "Niveau supérieur d'un mur ou d'un ouvrage, rendu parfaitement horizontal." },
    { mot: "Avenant", def: "Modification écrite d'un marché (prix, délai, contenu), signée par les parties." },
    { mot: "Banche", def: "Grand panneau de coffrage métallique pour couler des voiles (murs) en béton." },
    { mot: "Bastaing", def: "Pièce de bois de section rectangulaire courante (environ 6 × 15 ou 6 × 17 cm), utilisée en coffrage et étaiement." },
    { mot: "BPE", def: "Béton prêt à l'emploi, fabriqué en centrale et livré en camion toupie." },
    { mot: "BPU / DQE", def: "Bordereau des prix unitaires / détail quantitatif estimatif : pièces des marchés à prix unitaires." },
    { mot: "CACES", def: "Certificat d'aptitude à la conduite en sécurité d'engins (R482 engins de chantier, R486 nacelles, R489 chariots, R487 grues à tour…). Appuie l'autorisation de conduite de l'employeur." },
    { mot: "Calepinage", def: "Plan de pose qui définit la disposition des éléments (carreaux, blocs, panneaux) pour limiter les coupes." },
    { mot: "CCAP", def: "Cahier des clauses administratives particulières : délais, pénalités, paiements, garanties du marché." },
    { mot: "CCTP", def: "Cahier des clauses techniques particulières : description technique des ouvrages à réaliser." },
    { mot: "Chaînage", def: "Ceinture en béton armé, horizontale ou verticale, qui rend solidaires les murs d'une maçonnerie." },
    { mot: "Chaise d'implantation", def: "Petit portique en bois planté en retrait de la fouille, sur lequel on reporte les axes pour tendre les cordeaux." },
    { mot: "Chemin critique", def: "Suite des tâches d'un planning sans aucune marge : tout retard sur elles retarde la fin." },
    { mot: "Coactivité", def: "Présence simultanée de plusieurs entreprises sur un chantier, source de risques que coordonne le CSPS." },
    { mot: "Coefficient de vente", def: "Coefficient appliqué au déboursé sec pour obtenir le prix de vente (couvre frais, aléas et marge)." },
    { mot: "CSPS", def: "Coordonnateur sécurité et protection de la santé, désigné par le maître d'ouvrage quand plusieurs entreprises interviennent." },
    { mot: "Cure du béton", def: "Protection du béton frais contre la dessiccation (soleil, vent) et le gel, pour qu'il durcisse correctement." },
    { mot: "Déboursé sec", def: "Coût direct d'un ouvrage : main-d'œuvre, matériaux, matériel, sous-traitance." },
    { mot: "DGD", def: "Décompte général et définitif : arrêté final des comptes d'un marché public." },
    { mot: "DICT", def: "Déclaration d'intention de commencement de travaux, faite par l'entreprise exécutante auprès des exploitants de réseaux." },
    { mot: "DIUO", def: "Dossier d'intervention ultérieure sur l'ouvrage : informations pour la maintenance future en sécurité." },
    { mot: "DOE", def: "Dossier des ouvrages exécutés : plans et documents de ce qui a réellement été construit." },
    { mot: "Dommages-ouvrage", def: "Assurance souscrite par le maître d'ouvrage pour être indemnisé rapidement des désordres de nature décennale." },
    { mot: "DPGF", def: "Décomposition du prix global et forfaitaire : détail du prix d'un marché au forfait." },
    { mot: "DT", def: "Déclaration de projet de travaux, faite par le maître d'ouvrage auprès des exploitants de réseaux." },
    { mot: "DTU", def: "Document technique unifié : règles de l'art de mise en œuvre pour chaque type d'ouvrage (normes NF DTU)." },
    { mot: "Échappée", def: "Hauteur libre au-dessus d'un escalier, mesurée à l'aplomb du nez de marche." },
    { mot: "Enrobage", def: "Épaisseur de béton entre l'armature et la surface : elle protège l'acier de la corrosion et du feu." },
    { mot: "EPI", def: "Équipement de protection individuelle : casque, chaussures de sécurité, gants, lunettes, protections auditives, harnais…" },
    { mot: "Étai", def: "Poteau provisoire réglable qui soutient un coffrage ou un plancher pendant le durcissement." },
    { mot: "Garantie biennale", def: "Garantie de bon fonctionnement de 2 ans sur les équipements dissociables de l'ouvrage." },
    { mot: "Garantie décennale", def: "Responsabilité de 10 ans des constructeurs pour les dommages compromettant la solidité ou rendant l'ouvrage impropre à sa destination." },
    { mot: "Garantie de parfait achèvement", def: "Garantie d'un an après réception : l'entreprise répare tous les désordres signalés." },
    { mot: "Giron", def: "Profondeur d'une marche d'escalier, mesurée de nez à nez." },
    { mot: "Hors d'eau / hors d'air", def: "Étapes clés : bâtiment couvert (toiture étanche) puis fermé (menuiseries extérieures posées)." },
    { mot: "Laitance", def: "Pellicule fine de ciment et d'eau qui remonte en surface du béton." },
    { mot: "Linteau", def: "Élément (souvent en béton armé) placé au-dessus d'une ouverture pour reprendre les charges." },
    { mot: "Maître d'œuvre (MOE)", def: "Architecte ou bureau d'études qui conçoit et dirige l'exécution pour le compte du maître d'ouvrage." },
    { mot: "Maître d'ouvrage (MOA)", def: "Client pour qui l'ouvrage est construit et qui le paie." },
    { mot: "NGF", def: "Nivellement général de la France : système officiel des altitudes." },
    { mot: "OPC", def: "Ordonnancement, pilotage et coordination : mission de planification et de coordination des entreprises." },
    { mot: "OPR", def: "Opérations préalables à la réception : visite pour relever les défauts avant de réceptionner." },
    { mot: "Ordre de service (OS)", def: "Document écrit par lequel le maître d'ouvrage ou le maître d'œuvre donne une instruction (démarrage, modification…)." },
    { mot: "PEMP", def: "Plateforme élévatrice mobile de personnes (nacelle)." },
    { mot: "PGC", def: "Plan général de coordination en matière de sécurité, rédigé par le CSPS." },
    { mot: "PIC", def: "Plan d'installation de chantier : accès, cantonnement, stockage, levage, circulations." },
    { mot: "PPSPS", def: "Plan particulier de sécurité et de protection de la santé, rédigé par chaque entreprise intervenante." },
    { mot: "Prédalle", def: "Plaque de béton préfabriquée servant de fond de coffrage à une dalle coulée par-dessus." },
    { mot: "Radier", def: "Fondation en forme de dalle continue sous tout le bâtiment." },
    { mot: "Ragréage", def: "Mortier fluide qui rend un sol plan et lisse avant la pose d'un revêtement." },
    { mot: "Réception", def: "Acte par lequel le maître d'ouvrage accepte l'ouvrage, avec ou sans réserves. Elle fait courir les garanties." },
    { mot: "Réservation", def: "Trou, trémie ou fourreau prévu dans un ouvrage pour laisser passer des réseaux." },
    { mot: "Retenue de garantie", def: "Somme retenue sur les paiements (souvent 5 % maximum), libérée après l'année de parfait achèvement ; remplaçable par une caution." },
    { mot: "Semelle", def: "Fondation sous un mur (semelle filante) ou sous un poteau (semelle isolée)." },
    { mot: "Situation de travaux", def: "Facture d'avancement, souvent mensuelle, établie selon le pourcentage réalisé de chaque poste." },
    { mot: "SST", def: "Sauveteur secouriste du travail : salarié formé aux premiers secours sur le lieu de travail." },
    { mot: "Trait de niveau", def: "Trait tracé sur les murs à une hauteur de référence (souvent 1 m au-dessus du sol fini) pour tous les corps d'état." },
    { mot: "Trémie", def: "Ouverture dans un plancher (escalier, gaine, ascenseur). Non protégée, c'est un risque de chute grave." },
    { mot: "Vide sanitaire", def: "Espace ventilé entre le sol et le premier plancher, qui isole de l'humidité et permet le passage des réseaux." },
    { mot: "Voile", def: "Mur en béton armé coulé en place, en général dans des banches." }
  ]
};
