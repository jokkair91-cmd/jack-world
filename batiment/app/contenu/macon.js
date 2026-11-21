/* Spécialité — Maçon */
window.SPECIALITES = window.SPECIALITES || [];
window.SPECIALITES.push({
  id: "macon", nom: "Maçon", emoji: "🧱",
  resume: "Le métier de base du bâtiment : mortiers, murs, enduits, petits ouvrages et rénovation.",
  role: "Le **maçon** construit le gros œuvre : il monte les murs en blocs, en briques ou en pierre, fait les dalles, les seuils, les appuis, les enduits et une foule de petits ouvrages. En rénovation, il ouvre des murs, reprend des fissures et traite l'humidité. C'est un métier de précision : un mur d'aplomb, de niveau et bien jointoyé, c'est la base de tout le reste.",
  missions: [
    "Préparer les mortiers et bétons au bon dosage",
    "Monter des murs en blocs, briques, béton cellulaire ou pierre",
    "Poser linteaux, appuis, seuils et réservations",
    "Réaliser des enduits intérieurs et extérieurs",
    "Faire des dalles, murets, escaliers et petits ouvrages",
    "Intervenir en rénovation : ouvertures, saignées, reprises"
  ],
  acces: "CAP maçon, puis BP maçon ou titre professionnel maçon ; évolution vers chef d'équipe gros œuvre, chef de chantier, ou création d'entreprise.",
  modules: [
    {
      id: "outils", emoji: "🧰", titre: "Le métier et les outils du maçon", duree: "15 min",
      intro: "La caisse à outils du maçon, et à quoi sert chaque outil.",
      sections: [
        { titre: "Les outils à main", liste: [
          "**Truelle** (langue de chat, ronde, carrée) : prendre et poser le mortier, couper un joint.",
          "**Taloche** et **platoir** : porter, étaler et lisser mortier et enduit.",
          "**Auge** et **seau** : contenir le mortier près du poste.",
          "**Niveau à bulle** (60 cm à 2 m) : niveau et aplomb.",
          "**Règle** en alu : dresser un enduit, contrôler la planéité d'un mur.",
          "**Cordeau** (ficelle tendue) et **fil à plomb** : alignement et verticalité.",
          "**Équerre** de maçon, **mètre**, **crayon** de maçon.",
          "**Massette**, **burin**, **ciseau**, **marteau de coffreur**.",
          "**Pige** : règle graduée qui marque la hauteur de chaque rang."] },
        { titre: "Les machines", liste: [
          "**Bétonnière** : mélanger mortier et béton.",
          "**Malaxeur** (mélangeur électrique) : colles, mortiers prêts à gâcher.",
          "**Disqueuse** (meuleuse) et **scie de sol** : couper blocs, briques, pierres. Lunettes, masque contre la poussière de silice, protection auditive.",
          "**Perforateur** : percer, faire des saignées (avec aspiration de la poussière).",
          "**Machine à projeter** pour les enduits monocouches."] },
        { titre: "Les bonnes habitudes", liste: [
          "Outils **nettoyés** chaque soir : le mortier durci les abîme.",
          "Poste de travail **rangé** et **approvisionné** avant de commencer.",
          "Gants contre le ciment (il brûle la peau), chaussures de sécurité, casque."] }
      ],
      retenir: [
        "Niveau, règle, cordeau, fil à plomb : les outils de la précision.",
        "Pige pour la hauteur des rangs.",
        "Disqueuse : lunettes, masque anti-poussière, bouchons d'oreilles.",
        "Outils nettoyés tous les soirs."
      ],
      terrain: "Vérifie ton niveau de temps en temps : pose-le, note la bulle, retourne-le bout pour bout. S'il ne donne pas la même chose, il est faux.",
      quiz: [
        { q: "Quel outil marque la hauteur de chaque rang de blocs ?", choix: ["La pige", "La taloche", "La truelle", "L'auge"], ok: 0, pourquoi: "La pige est une règle graduée aux hauteurs de rangs : on la pose contre le mur pour contrôler." },
        { q: "À quoi sert le cordeau ?", choix: ["Aligner les blocs d'un rang", "Mesurer l'humidité", "Lisser l'enduit", "Mélanger le mortier"], ok: 0, pourquoi: "Tendu d'un angle à l'autre, il donne l'alignement et le niveau du rang." },
        { q: "Pourquoi un masque pour couper un bloc à la disqueuse ?", choix: ["La poussière de silice abîme les poumons", "Pour le bruit", "Pour la chaleur", "Ce n'est pas utile"], ok: 0, pourquoi: "La silice cristalline des matériaux est très dangereuse à respirer." },
        { q: "Comment vérifier qu'un niveau à bulle est juste ?", choix: ["Le retourner bout pour bout : la bulle doit être au même endroit", "Le secouer", "Le laisser au soleil", "On ne peut pas"], ok: 0, pourquoi: "Un niveau juste donne la même lecture dans les deux sens." },
        { q: "Pourquoi porter des gants avec le ciment ?", choix: ["Le ciment frais peut brûler la peau", "Pour avoir chaud", "Pour aller plus vite", "Ce n'est pas nécessaire"], ok: 0, pourquoi: "Le ciment est très basique (alcalin) : il provoque des brûlures et des allergies." }
      ]
    },
    {
      id: "mortiers", emoji: "🪣", titre: "Mortiers et bétons", duree: "25 min",
      intro: "Ciment, chaux, sable, gravier et eau : doser, gâcher, utiliser à temps.",
      sections: [
        { titre: "Les ingrédients", liste: [
          "**Ciment** : le liant qui durcit avec l'eau. Il fait la résistance.",
          "**Chaux** : liant plus souple, qui laisse respirer les murs ; indispensable sur le bâti ancien.",
          "**Sable** (0/4) : le squelette du mortier ; propre, sans terre.",
          "**Gravier** : en plus du sable, pour faire du béton.",
          "**Eau** propre : juste ce qu'il faut. Trop d'eau = mortier faible et qui fissure."] },
        { titre: "Les dosages courants (ordres de grandeur)", liste: [
          "**Mortier de montage** de blocs : environ **1 volume de ciment pour 3 à 4 volumes de sable**.",
          "**Mortier bâtard** : ciment + chaux, plus souple, pour enduits et joints.",
          "**Béton courant** : la règle « **1 – 2 – 3** » en volumes : 1 ciment, 2 sable, 3 gravier, plus environ ½ d'eau. Cela donne un béton dosé autour de 350 kg de ciment par m³.",
          "Les **mortiers et bétons prêts à l'emploi** (sacs ou centrale) : suivre le dosage d'eau du fabricant.",
          "Le **dosage exact** vient du chantier (CCTP, fiche technique) : ces règles servent à comprendre, pas à remplacer les consignes."] },
        { titre: "Gâcher et utiliser", liste: [
          "À la bétonnière : un peu d'eau, le gravier, le ciment, le sable, puis le reste de l'eau petit à petit jusqu'à la bonne consistance.",
          "Un mortier s'utilise dans un temps limité (souvent 1 à 2 heures selon la chaleur). **On ne le « rebat » pas avec de l'eau** quand il commence à prendre : on le jette.",
          "Par grand froid ou forte chaleur, on adapte (protection, horaires, adjuvants prévus par le chantier).",
          "On mouille légèrement les supports très absorbants (anciens blocs, briques sèches) pour que le mortier ne sèche pas trop vite."] }
      ],
      retenir: [
        "Ciment = résistance ; chaux = souplesse et respiration.",
        "Montage : ~1 ciment pour 3 à 4 sable. Béton : 1 – 2 – 3.",
        "Trop d'eau affaiblit tout.",
        "Mortier qui prend : on le jette, on ne le rebat pas."
      ],
      terrain: "Fais tes mesures avec le **même seau** pour tous les ingrédients : c'est ça, un dosage « en volumes ». À la pelle, chaque gâchée est différente.",
      quiz: [
        { q: "Quel liant laisse « respirer » un mur ancien en pierre ?", choix: ["La chaux", "Le ciment pur", "La colle à carrelage", "Le plâtre extérieur"], ok: 0, pourquoi: "La chaux est perméable à la vapeur d'eau, contrairement au ciment." },
        { q: "Que veut dire la règle « 1 – 2 – 3 » pour un béton ?", choix: ["1 ciment, 2 sable, 3 gravier en volumes", "1 h, 2 h, 3 h de séchage", "1 sac pour 2 m² sur 3 cm", "1 litre d'eau pour 2 sacs et 3 seaux"], ok: 0, pourquoi: "C'est un dosage en volumes qui donne un béton courant, environ 350 kg de ciment par m³." },
        { q: "Le mortier commence à durcir dans l'auge. Que fais-tu ?", choix: ["Je le jette et j'en refais", "J'ajoute de l'eau et je remélange", "Je l'utilise quand même", "J'ajoute du sable"], ok: 0, pourquoi: "Rebattu à l'eau, il a perdu une partie de sa résistance et de son adhérence." },
        { q: "Que provoque trop d'eau dans un mortier ?", choix: ["Une baisse de résistance et des fissures", "Un mortier plus solide", "Un séchage plus lent et meilleur", "Rien"], ok: 0, pourquoi: "L'eau en trop s'évapore en laissant des vides : le mortier est poreux et faible." },
        { q: "Pourquoi utiliser le même seau pour doser ?", choix: ["Pour garder des proportions justes", "Pour aller plus vite", "Pour économiser le ciment", "Par habitude"], ok: 0, pourquoi: "Un dosage en volumes n'est juste que si on mesure tout avec la même unité." }
      ]
    },
    {
      id: "mur-blocs", emoji: "🧱", titre: "Monter un mur en blocs", duree: "30 min",
      intro: "Premier rang, angles, cordeau, joints, harpage, chaînages et linteaux.",
      illustrations: ["mur-angles"],
      sections: [
        { titre: "Préparer", liste: [
          "Support (fondation, dalle) **propre**, **de niveau** et à la bonne cote ; **arase étanche** si besoin.",
          "**Traçage** du mur au sol (cordeau à tracer, craie) depuis les axes ou les repères.",
          "**Pige** préparée, blocs approvisionnés **à portée de main**, mortier gâché."] },
        { titre: "Le premier rang", texte: [
          "C'est le rang le plus important : posé sur un lit de mortier, **parfaitement de niveau** et aligné sur le traçage. Toutes les erreurs du premier rang se retrouvent jusqu'en haut du mur."] },
        { titre: "La méthode des angles", liste: [
          "On monte d'abord **les angles** (et les extrémités) sur quelques rangs, en **escalier** : chaque bloc d'angle est contrôlé d'aplomb, de niveau et à la pige.",
          "On tend un **cordeau** entre les deux angles, au ras de l'arête du rang à poser.",
          "On **remplit** le rang en posant chaque bloc contre le cordeau, sans le toucher.",
          "**Joints croisés** : les blocs d'un rang chevauchent ceux du rang du dessous (souvent d'un demi-bloc).",
          "**Harpage** aux angles et aux murs qui se croisent : les blocs s'imbriquent un rang sur deux, ou on prévoit un chaînage."] },
        { titre: "Joints, chaînages, linteaux", liste: [
          "Joints de mortier d'environ **1 cm**, bien remplis ; pour les blocs rectifiés, **colle** en joint mince.",
          "**Chaînages verticaux** aux angles (blocs d'angle creux ou coffrage + aciers en attente) et **horizontaux** à chaque plancher.",
          "**Linteaux** au-dessus des ouvertures, avec un **appui** suffisant de chaque côté (souvent au moins 20 cm, selon le fabricant).",
          "**Raidisseurs** dans les grands murs, selon le plan."] }
      ],
      retenir: [
        "Premier rang de niveau : la base de tout.",
        "Les angles d'abord, puis le cordeau, puis le remplissage.",
        "Joints croisés, harpage, chaînages.",
        "Contrôle constant : aplomb, niveau, alignement, pige."
      ],
      terrain: "Ne touche jamais le cordeau avec un bloc : il se déplace et tout le rang part de travers. Pose le bloc à 1 ou 2 mm du fil.",
      quiz: [
        { q: "Par quoi commence-t-on à monter un mur ?", choix: ["Les angles, contrôlés d'aplomb et de niveau", "Le milieu du mur", "Le dernier rang", "N'importe où"], ok: 0, pourquoi: "Les angles servent de repères pour tendre le cordeau." },
        { q: "À quoi sert le cordeau tendu entre deux angles ?", choix: ["Guider l'alignement et le niveau du rang", "Mesurer la longueur du mur", "Porter les blocs", "Décorer"], ok: 0, pourquoi: "Chaque bloc se pose au ras du cordeau, sans le toucher." },
        { q: "Pourquoi croise-t-on les joints ?", choix: ["Pour que le mur ne se fende pas le long d'un joint", "Pour économiser du mortier", "Pour aller plus vite", "C'est seulement esthétique"], ok: 0, pourquoi: "Des joints alignés verticalement créent une ligne de faiblesse." },
        { q: "Quelle épaisseur pour un joint de mortier courant entre blocs ?", choix: ["Environ 1 cm", "5 cm", "Aucun joint", "3 mm toujours"], ok: 0, pourquoi: "Environ 1 cm pour un mortier traditionnel ; quelques mm seulement pour les blocs rectifiés collés." },
        { q: "Qu'est-ce que le harpage ?", choix: ["L'imbrication des blocs aux angles et croisements de murs", "Un outil de maçon", "Une couche d'enduit", "Le nettoyage des joints"], ok: 0, pourquoi: "Les blocs s'enchevêtrent un rang sur deux pour lier les murs entre eux." }
      ]
    },
    {
      id: "materiaux", emoji: "🪨", titre: "Briques, béton cellulaire et pierre", duree: "20 min",
      intro: "Chaque matériau a ses règles de pose.",
      sections: [
        { titre: "La brique de terre cuite", liste: [
          "**Brique rectifiée** (monomur, brique isolante) : posée à la **colle** en joint mince, joints verticaux souvent **à emboîtement** (sans mortier).",
          "**Rabotage** du premier rang ou réglage sur un lit de mortier parfaitement de niveau.",
          "Coupes à la **scie** ; accessoires du fabricant (briques d'angle, de linteau, de chaînage).",
          "**Brique pleine** de parement : joints réguliers, mortier adapté, pas de taches sur la face vue."] },
        { titre: "Le béton cellulaire", liste: [
          "Blocs **légers** et **isolants**, faciles à couper à la **scie égoïne** spéciale.",
          "Posés à la **colle** en joint mince, après réglage du premier rang au mortier.",
          "**Rabot** pour reprendre les petites différences ; fixations adaptées (chevilles spéciales)."] },
        { titre: "La pierre", liste: [
          "**Appareillage** : la façon d'assembler les pierres (assisés, moellons, pierres sèches).",
          "**Boutisses** : pierres posées en travers qui lient les deux faces du mur.",
          "Joints au **mortier de chaux** pour laisser respirer le mur.",
          "**Pierres sèches** (sans mortier) : un savoir-faire à part pour les murets et soutènements."] }
      ],
      retenir: [
        "Brique et béton cellulaire rectifiés : joint mince à la colle.",
        "Premier rang réglé au mortier, parfaitement de niveau.",
        "Accessoires du fabricant pour angles, linteaux, chaînages.",
        "Pierre : boutisses et mortier de chaux."
      ],
      terrain: "Avec les blocs collés, la moindre erreur de niveau du premier rang ne se rattrape plus avec le joint : passe le temps qu'il faut sur ce rang.",
      quiz: [
        { q: "Comment pose-t-on un béton cellulaire ou une brique rectifiée ?", choix: ["À la colle en joint mince", "Avec 3 cm de mortier", "À sec sans rien", "Au plâtre"], ok: 0, pourquoi: "Ces blocs ont des dimensions précises : on les colle en joint de quelques millimètres." },
        { q: "Qu'est-ce qu'une boutisse dans un mur de pierre ?", choix: ["Une pierre posée en travers qui lie les deux faces", "Une pierre décorative", "Un joint de ciment", "Un linteau en bois"], ok: 0, pourquoi: "Les boutisses traversent le mur et l'empêchent de se séparer en deux parois." },
        { q: "Quel mortier pour jointoyer un vieux mur en pierre ?", choix: ["Un mortier de chaux", "Un mortier de ciment pur", "De la colle", "Du plâtre"], ok: 0, pourquoi: "La chaux laisse le mur respirer et suit ses mouvements." },
        { q: "Avec quoi coupe-t-on facilement le béton cellulaire ?", choix: ["Une scie égoïne spéciale", "Un burin seulement", "Une pelle", "Un chalumeau"], ok: 0, pourquoi: "Le béton cellulaire est tendre : une scie manuelle adaptée suffit." },
        { q: "Pourquoi soigner encore plus le premier rang avec des blocs collés ?", choix: ["Le joint mince ne permet plus de rattraper les erreurs", "Parce que la colle est chère", "Pour la couleur", "Ce n'est pas plus important"], ok: 0, pourquoi: "Avec 2 ou 3 mm de colle, aucun réglage n'est possible sur les rangs suivants." }
      ]
    },
    {
      id: "enduits", emoji: "🖌️", titre: "Les enduits", duree: "25 min",
      intro: "Gobetis, corps d'enduit, finition ; monocouche ; conditions météo.",
      illustrations: ["enduit"],
      sections: [
        { titre: "À quoi sert un enduit", texte: [
          "L'enduit **protège le mur de la pluie**, le **dresse** (rend plan) et donne l'**aspect** de la façade. Il doit être adapté au support : un enduit trop dur sur un mur ancien le fait souffrir."] },
        { titre: "L'enduit traditionnel en trois couches", liste: [
          "**Gobetis** : couche d'accrochage, projetée, rugueuse.",
          "**Corps d'enduit** : dresse le mur et le rend imperméable ; tiré à la règle.",
          "**Finition** : donne la couleur et la texture (grattée, talochée, écrasée, lissée).",
          "Chaque couche est **moins dosée en liant** que la précédente, et on respecte un **temps de séchage** entre les couches.",
          "Épaisseur totale souvent autour de **15 à 20 mm**."] },
        { titre: "L'enduit monocouche", liste: [
          "Un seul produit industriel, souvent **projeté à la machine** en deux passes « frais dans frais ».",
          "Épaisseur minimale à respecter (souvent au moins **10 mm** une fois fini) : trop mince, il fissure et laisse passer l'eau.",
          "**Baguettes d'angle**, **joints de fractionnement** sur les grandes surfaces, **trame** aux points faibles (angles des ouvertures, jonctions de matériaux)."] },
        { titre: "Les conditions", liste: [
          "Ni par **gel**, ni par **forte chaleur** (en pratique entre environ 5 et 30 °C), ni sous la **pluie** ou par **vent fort**.",
          "Support **propre**, **sain**, humidifié s'il est très absorbant.",
          "Sur bâti ancien (pierre, pisé, brique ancienne) : **enduit à la chaux**."] }
      ],
      retenir: [
        "Gobetis, corps, finition : de plus en plus « doux ».",
        "Monocouche : épaisseur minimale, trame, joints de fractionnement.",
        "Pas de gel, de forte chaleur, de pluie ni de vent fort.",
        "Bâti ancien = chaux."
      ],
      terrain: "Commence toujours par la façade à l'ombre et suis le soleil : un enduit qui sèche en plein soleil d'été fissure (faïençage).",
      quiz: [
        { q: "Quel est le rôle du gobetis ?", choix: ["Faire accrocher les couches suivantes", "Donner la couleur", "Isoler du froid", "Remplacer le mur"], ok: 0, pourquoi: "Couche rugueuse et projetée, il crée l'accroche sur le support." },
        { q: "Dans un enduit en 3 couches, le dosage en liant…", choix: ["Diminue d'une couche à l'autre", "Augmente d'une couche à l'autre", "Est toujours le même", "N'a pas d'importance"], ok: 0, pourquoi: "Une couche extérieure moins dure que celle du dessous évite les décollements et fissures." },
        { q: "Pourquoi poser une trame aux angles des fenêtres ?", choix: ["Pour éviter les fissures à ces endroits fragiles", "Pour la décoration", "Pour isoler", "Pour aller plus vite"], ok: 0, pourquoi: "Les angles d'ouverture concentrent les tensions : la trame arme l'enduit." },
        { q: "Quand ne pas enduire ?", choix: ["Par gel, forte chaleur, pluie ou vent fort", "Le matin", "Par temps couvert et doux", "En automne"], ok: 0, pourquoi: "Ces conditions empêchent un séchage normal et abîment l'enduit." },
        { q: "Quel enduit sur un vieux mur en pierre ?", choix: ["Un enduit à la chaux", "Un enduit ciment très dur", "Une peinture plastique", "Rien"], ok: 0, pourquoi: "La chaux laisse le mur évacuer son humidité ; le ciment l'enferme." }
      ]
    },
    {
      id: "petits-ouvrages", emoji: "🏗️", titre: "Petits ouvrages : seuils, appuis, dalles, murets", duree: "25 min",
      intro: "Les ouvrages de tous les jours, et les détails qui font qu'ils durent.",
      sections: [
        { titre: "Appuis et seuils", liste: [
          "**Appui de fenêtre** : en pente vers l'extérieur, avec un **rejet d'eau** et une **goutte d'eau** (larmier) dessous pour que l'eau ne coule pas sur la façade.",
          "**Seuil de porte** : à la bonne hauteur par rapport au sol fini, avec une pente vers l'extérieur ; attention à l'**accessibilité** (ressaut limité) sur les logements concernés."] },
        { titre: "Dalle de terrasse ou d'abri", liste: [
          "Décaissement, **hérisson** compacté, éventuellement film et isolant.",
          "**Coffrage** de rive, **treillis soudé** calé.",
          "**Pente** d'environ 1 à 2 % vers l'extérieur pour évacuer l'eau.",
          "**Joints de fractionnement** sur les grandes surfaces, sciés ou coffrés.",
          "Cure du béton (protéger du soleil et du vent)."] },
        { titre: "Murets et clôtures", liste: [
          "**Fondation** hors gel, même pour un petit muret.",
          "**Chaînages** et **poteaux** raidisseurs pour les murs longs ou hauts.",
          "**Chaperon** (couronnement) en tête pour rejeter l'eau.",
          "**Joints de dilatation** sur les grandes longueurs.",
          "Vérifier les **règles d'urbanisme** (hauteur, aspect) et la **limite de propriété**."] },
        { titre: "Escaliers, regards, réservations", liste: [
          "**Escalier béton** : coffrage, ferraillage selon le plan, marches régulières (formule de Blondel).",
          "**Regards** et boîtes de branchement à la bonne cote et avec la pente des réseaux.",
          "**Réservations** et **scellements** : prévus au bon endroit avant de couler ou de monter."] }
      ],
      retenir: [
        "Appui : pente + rejet d'eau + goutte d'eau.",
        "Dalle : hérisson, treillis, pente 1 à 2 %, joints.",
        "Muret : fondation hors gel, chaperon, joints de dilatation.",
        "Les réservations se prévoient avant."
      ],
      terrain: "Avant de couler une dalle extérieure, verse un seau d'eau sur le coffrage réglé : si l'eau ne file pas vers l'extérieur, reprends la pente.",
      quiz: [
        { q: "À quoi sert la goutte d'eau (larmier) sous un appui ?", choix: ["Empêcher l'eau de couler sur la façade", "Décorer", "Fixer la fenêtre", "Ventiler le mur"], ok: 0, pourquoi: "La rainure casse le ruissellement : l'eau tombe au lieu de suivre le dessous de l'appui." },
        { q: "Quelle pente pour une dalle de terrasse ?", choix: ["Environ 1 à 2 % vers l'extérieur", "Aucune", "10 %", "Vers la maison"], ok: 0, pourquoi: "Une légère pente évacue l'eau loin du bâtiment." },
        { q: "Un petit muret de clôture a-t-il besoin d'une fondation hors gel ?", choix: ["Oui", "Non, il est petit", "Seulement en montagne", "Seulement s'il est en pierre"], ok: 0, pourquoi: "Le gel soulève et fissure tout ouvrage mal fondé, même petit." },
        { q: "À quoi sert un chaperon en tête de muret ?", choix: ["Rejeter l'eau de pluie", "Tenir le portail", "Isoler", "Accrocher l'enduit"], ok: 0, pourquoi: "Il protège le haut du mur où l'eau s'infiltrerait sinon." },
        { q: "Pourquoi des joints de fractionnement dans une grande dalle ?", choix: ["Pour que les fissures se fassent à ces endroits prévus", "Pour décorer", "Pour économiser du béton", "Pour aller plus vite"], ok: 0, pourquoi: "Le béton se rétracte : les joints guident les fissures en lignes droites et propres." }
      ]
    },
    {
      id: "renovation", emoji: "🔨", titre: "Rénovation : ouvertures, saignées, humidité", duree: "25 min",
      intro: "Ouvrir un mur porteur, faire des saignées, traiter fissures et humidité.",
      sections: [
        { titre: "Ouvrir dans un mur porteur", liste: [
          "C'est un **travail de structure** : **bureau d'études** (calcul de la poutre et des appuis), autorisations (urbanisme si façade, copropriété si immeuble).",
          "**Étaiement** du plancher de part et d'autre, et souvent **chevalements** (étais passant dans le mur) pour reprendre la charge du mur au-dessus.",
          "Pose du **linteau** ou de la **poutre** (béton armé, acier type IPN/HEB) sur des **appuis** solides (sommiers), calage et serrage au mortier sans retrait.",
          "**Ouverture** seulement après la prise du mortier de calage, puis **retrait progressif** des étais."] },
        { titre: "Saignées et percements", liste: [
          "Saignées pour les gaines et tuyaux : de préférence **verticales**, peu profondes, **jamais dans les chaînages** ni les linteaux.",
          "Les saignées horizontales longues affaiblissent les murs porteurs : à éviter ou à faire valider.",
          "Outils avec **aspiration** de la poussière, masque adapté.",
          "**Repérage des réseaux** avant de percer (détecteur, plans)."] },
        { titre: "Fissures et humidité", liste: [
          "Une **fissure** se diagnostique avant de se boucher : fine et stable (enduit) ou large, en escalier, qui bouge (structure, fondations). Une jauge ou un témoin permet de suivre son évolution.",
          "**Remontées capillaires** (humidité en bas des murs) : drainage, barrière étanche par injection, enduits respirants.",
          "**Infiltrations** : chercher la cause (gouttière, appui, toiture, joint) avant de traiter l'effet.",
          "**Condensation** : ventilation et isolation, pas un problème de maçonnerie."] }
      ],
      danger: "Ne jamais ouvrir un mur sans savoir s'il est porteur, et jamais sans étaiement. Un plancher qui descend ne prévient pas.",
      retenir: [
        "Mur porteur : bureau d'études, étais, poutre sur appuis, puis ouverture.",
        "Saignées verticales, jamais dans les chaînages.",
        "Une fissure se diagnostique avant de se boucher.",
        "Humidité : trouver la cause (capillarité, infiltration, condensation)."
      ],
      terrain: "Pose un **témoin** (petite bande de plâtre datée) sur une fissure suspecte : s'il casse dans les semaines suivantes, la fissure bouge encore.",
      quiz: [
        { q: "Avant d'ouvrir un mur porteur, il faut :", choix: ["Une étude de structure et un étaiement", "Juste une masse et du courage", "Prévenir le voisin seulement", "Rien si l'ouverture est petite"], ok: 0, pourquoi: "La charge du mur et des planchers doit être reprise par une poutre calculée, sur des appuis, avec des étais pendant les travaux." },
        { q: "Où ne doit-on jamais faire de saignée ?", choix: ["Dans un chaînage ou un linteau", "Dans une cloison en plaque de plâtre", "Dans un doublage", "Dans un enduit intérieur"], ok: 0, pourquoi: "Couper les aciers d'un chaînage ou d'un linteau affaiblit la structure." },
        { q: "Une fissure en escalier, large et qui s'agrandit, indique souvent :", choix: ["Un problème de structure ou de fondation", "Un simple défaut de peinture", "Rien d'important", "Un excès d'enduit"], ok: 0, pourquoi: "Ces fissures suivent les joints et traduisent un mouvement du bâtiment." },
        { q: "À quoi sert un témoin en plâtre sur une fissure ?", choix: ["Voir si la fissure bouge encore", "La boucher définitivement", "Décorer", "Isoler"], ok: 0, pourquoi: "S'il se casse, la fissure évolue : il faut un diagnostic avant de réparer." },
        { q: "De l'humidité en bas des murs d'une vieille maison vient souvent :", choix: ["Des remontées capillaires du sol", "Du toit uniquement", "Des prises électriques", "Du chauffage"], ok: 0, pourquoi: "L'eau du sol monte dans les murs sans coupure de capillarité." }
      ]
    }
  ]
});
