/* Module AutoCAD : cours, commandes, raccourcis */
window.AUTOCAD = {
  id: "autocad", nom: "AutoCAD", emoji: "📐",
  role: "Lire, modifier, mesurer et imprimer les plans DWG du chantier. Les commandes sont données en **français** (AutoCAD en français) avec leur équivalent anglais : tape `_LINE` (avec le tiret bas) et ça marche dans toutes les langues. Les raccourcis entre parenthèses sont ceux de la version anglaise (la plus répandue) ; dans AutoCAD en français, certains raccourcis diffèrent, mais le nom français complet marche toujours.",
  modules: [
    {
      id: "interface", emoji: "🖥️", titre: "Découvrir l'interface", duree: "15 min",
      intro: "Le ruban, la ligne de commande, l'espace objet et les présentations.",
      sections: [
        { titre: "L'écran d'AutoCAD", liste: [
          "**Ruban** (en haut) : les onglets Début, Insérer, Annoter, Vue… avec les outils les plus utilisés.",
          "**Zone de dessin** : fond sombre en général, on y dessine en vraie grandeur.",
          "**Ligne de commande** (en bas) : c'est le cœur d'AutoCAD. Tout ce que tu tapes y apparaît, et AutoCAD y écrit ce qu'il attend de toi. **Lis-la toujours.**",
          "**Barre d'état** (tout en bas) : modes d'aide au dessin (grille, ortho, polaire, accrochage aux objets…).",
          "**Onglets Objet / Présentation** (en bas à gauche) : on dessine dans l'espace objet, on met en page dans les présentations."
        ] },
        { titre: "Les réflexes de base", liste: [
          "**Entrée** ou **Espace** : valider ; et sur une ligne de commande vide, **répéter la dernière commande**.",
          "**Échap** : annuler la commande en cours (appuie deux fois en cas de doute).",
          "**Molette** : zoomer/dézoomer ; **molette enfoncée** : se déplacer (panoramique) ; **double-clic molette** : zoom étendu (tout voir).",
          "**Ctrl+Z** : annuler ; **Ctrl+S** : enregistrer (souvent !)."
        ] },
        { titre: "On dessine en vraie grandeur", texte: [
          "Dans l'espace objet, un mur de 5 m se dessine avec sa vraie longueur. En bâtiment, l'unité est souvent le **centimètre** ou le **millimètre** (parfois le mètre) : vérifie avec la commande **UNITES** ou en mesurant une cote connue avant de travailler sur un plan reçu.",
          "L'échelle (1/50, 1/100) n'intervient qu'au moment de la **mise en page et de l'impression**."] }
      ],
      retenir: [
        "La ligne de commande te dit toujours ce qu'AutoCAD attend : lis-la.",
        "Entrée/Espace = valider ou répéter ; Échap = annuler.",
        "On dessine en vraie grandeur ; l'échelle se règle à l'impression.",
        "Vérifie l'unité d'un plan reçu en mesurant une cote connue."
      ],
      terrain: "Quand tu ouvres un plan de l'architecte, commence par mesurer une porte (environ 90 cm) avec DISTANCE : si tu lis 90, le dessin est en cm ; 900, en mm ; 0,9, en m.",
      quiz: [
        { q: "Où AutoCAD t'indique-t-il ce qu'il attend ?", choix: ["Dans la ligne de commande", "Dans le cartouche", "Dans le menu Fichier"], ok: 0, pourquoi: "La ligne de commande affiche chaque demande : point suivant, rayon, options…" },
        { q: "Sur une ligne de commande vide, la touche Entrée…", choix: ["Répète la dernière commande", "Ferme AutoCAD", "Imprime"], ok: 0, pourquoi: "Très pratique pour enchaîner plusieurs lignes ou copies." },
        { q: "Quelle touche annule la commande en cours ?", choix: ["Échap", "Entrée", "F1"], ok: 0, pourquoi: "Échap interrompt la commande ; Ctrl+Z annule ce qui a déjà été fait." },
        { q: "Un mur de 5 m se dessine dans l'espace objet…", choix: ["En vraie grandeur (500 si l'unité est le cm)", "Réduit à l'échelle 1/100 (5 cm)", "Au hasard"], ok: 0, pourquoi: "On dessine en vraie grandeur ; l'échelle s'applique dans la présentation." },
        { q: "Une porte mesure 900 avec DISTANCE. Le plan est probablement en…", choix: ["Millimètres", "Mètres", "Centimètres"], ok: 0, pourquoi: "Une porte fait environ 0,90 m = 900 mm." }
      ]
    },
    {
      id: "coordonnees", emoji: "🎯", titre: "Coordonnées et aides au dessin", duree: "20 min",
      intro: "Placer des points précis : absolus, relatifs, polaires, et l'accrochage aux objets.",
      sections: [
        { titre: "Les trois façons de donner un point", liste: [
          "**Absolues** `x,y` : par rapport à l'origine 0,0. Exemple : `100,50`.",
          "**Relatives** `@dx,dy` : par rapport au **dernier point**. Exemple : `@500,0` = 500 vers la droite ; `@0,-300` = 300 vers le bas.",
          "**Polaires** `@distance<angle` : une longueur et un angle (0° = vers la droite, 90° = vers le haut, sens inverse des aiguilles d'une montre). Exemple : `@400<90` = 400 vers le haut.",
          "Avec la **saisie dynamique** activée (F12), ce que tu tapes près du curseur est souvent relatif par défaut ; dans la ligne de commande classique, on met le `@`."
        ] },
        { titre: "Dessiner une pièce de 500 × 300", texte: [
          "LIGNE → premier point `0,0` → `@500,0` → `@0,300` → `@-500,0` → `C` (Clore) pour fermer le rectangle. Tu peux aussi activer **ORTHO** (F8), pointer la direction avec la souris et taper seulement la longueur : c'est la **saisie directe de distance**, la plus rapide sur un plan de bâtiment."] },
        { titre: "Les aides au dessin", liste: [
          "**F3 – Accrochage aux objets (OSNAP)** : le curseur s'accroche aux extrémités, milieux, intersections, centres… Indispensable pour être précis.",
          "**F8 – Ortho** : bloque les traits à l'horizontale et à la verticale.",
          "**F10 – Repérage polaire** : guide selon des angles réglables (45°, 30°…).",
          "**F11 – Repérage d'accrochage** : aligne sur des points d'autres objets.",
          "**F12 – Saisie dynamique** : saisie près du curseur."
        ] }
      ],
      retenir: [
        "`x,y` absolu ; `@dx,dy` relatif ; `@d<angle` polaire.",
        "0° vers la droite, 90° vers le haut.",
        "F3 accrochage, F8 ortho, F10 polaire, F12 saisie dynamique.",
        "Ortho + souris + longueur tapée = dessin rapide et précis."
      ],
      terrain: "Ne « vise » jamais un coin à l'œil : un plan qui semble juste mais où les lignes ne se touchent pas donne des surfaces fausses et des hachures qui ne marchent pas. Accrochage aux objets toujours actif.",
      quiz: [
        { q: "Depuis le point 0,0, `@200,0` place le point…", choix: ["200 vers la droite", "200 vers le haut", "Au point 200,200"], ok: 0, pourquoi: "@dx,dy : dx = 200 en X (droite), dy = 0." },
        { q: "`@300<90` signifie…", choix: ["300 vers le haut", "300 vers la droite", "90 dans la direction 300"], ok: 0, pourquoi: "Distance 300, angle 90° = vers le haut." },
        { q: "Quelle touche active l'accrochage aux objets ?", choix: ["F3", "F8", "F1"], ok: 0, pourquoi: "F3 = OSNAP (accrochage) ; F8 = ortho ; F1 = aide." },
        { q: "Pour fermer une suite de lignes sur le premier point, on tape…", choix: ["C (Clore)", "F (Fin)", "X"], ok: 0, pourquoi: "L'option Clore de la commande LIGNE ferme le contour." },
        { q: "Le mode ORTHO sert à…", choix: ["Dessiner uniquement à l'horizontale et à la verticale", "Corriger l'orthographe", "Imprimer en couleur"], ok: 0, pourquoi: "Avec Ortho, la souris donne la direction et tu tapes la longueur." }
      ]
    },
    {
      id: "dessin-modif", emoji: "✏️", titre: "Dessiner et modifier", duree: "25 min",
      intro: "Les 15 commandes qui font 90 % du travail.",
      sections: [
        { titre: "Dessiner", liste: [
          "**LIGNE (L)** : segments un par un.",
          "**POLYLIGN (PL)** : une ligne continue en un seul objet (idéal pour les contours de pièces, pour mesurer des surfaces).",
          "**RECTANG (REC)** : rectangle par deux coins opposés (`@500,300` pour le second).",
          "**CERCLE (C)** : centre + rayon (ou D pour diamètre). **ARC (A)**."
        ] },
        { titre: "Modifier", liste: [
          "**DECALER (O)** : copie parallèle à une distance : l'outil n°1 pour dessiner l'épaisseur d'un mur (décaler de 20 cm).",
          "**AJUSTER (TR)** et **PROLONGER (EX)** : couper ce qui dépasse, prolonger jusqu'à une limite.",
          "**RACCORD (F)** avec rayon 0 : fermer proprement un angle entre deux lignes.",
          "**DEPLACER (M)**, **COPIER (CO)**, **ROTATION (RO)**, **MIROIR (MI)**, **ECHELLE (SC)**, **ETIRER (S)**.",
          "**EFFACER (E)**, **DECOMPOS (X)** pour éclater un bloc ou une polyligne.",
          "**RESEAU (AR)** : répéter un objet en ligne/colonne (poteaux, places de parking)."
        ] },
        { titre: "Sélectionner", liste: [
          "Clic sur un objet pour le sélectionner.",
          "Fenêtre de **gauche à droite** (cadre bleu) : sélectionne ce qui est **entièrement** dedans.",
          "Fenêtre de **droite à gauche** (cadre vert, pointillé) : sélectionne tout ce qui est **touché**.",
          "Maj + clic : retirer un objet de la sélection."
        ] }
      ],
      retenir: [
        "Mur = une ligne + DECALER de l'épaisseur + AJUSTER/RACCORD.",
        "POLYLIGN pour les contours dont on veut la surface.",
        "Sélection gauche→droite = entièrement dedans ; droite→gauche = touché."
      ],
      terrain: "Pour reporter une modification de cloison sur le plan de l'architecte, travaille sur une copie du fichier et dans un calque à toi (par exemple « MODIF-CHANTIER ») : on voit tout de suite ce qui a changé.",
      quiz: [
        { q: "Quelle commande sert à dessiner l'épaisseur d'un mur à partir d'une ligne ?", choix: ["DECALER (O)", "CERCLE (C)", "ZOOM (Z)"], ok: 0, pourquoi: "DECALER crée une copie parallèle à la distance voulue." },
        { q: "Couper ce qui dépasse au-delà d'une autre ligne :", choix: ["AJUSTER (TR)", "PROLONGER (EX)", "COPIER (CO)"], ok: 0, pourquoi: "AJUSTER coupe ; PROLONGER allonge jusqu'à une limite." },
        { q: "Une sélection de droite à gauche prend…", choix: ["Tout ce qui est touché par le cadre", "Seulement ce qui est entièrement dedans", "Rien"], ok: 0, pourquoi: "C'est la sélection « capture » (cadre vert)." },
        { q: "Quel objet permet de mesurer facilement l'aire d'une pièce ?", choix: ["Une polyligne fermée", "Des lignes séparées", "Un texte"], ok: 0, pourquoi: "Une polyligne fermée a une aire directement lisible (propriétés, AIRE)." },
        { q: "RACCORD avec un rayon de 0 sert à…", choix: ["Fermer proprement l'angle entre deux lignes", "Arrondir fortement un angle", "Supprimer une ligne"], ok: 0, pourquoi: "Rayon 0 : les deux lignes sont coupées ou prolongées jusqu'à se rejoindre." }
      ]
    },
    {
      id: "calques", emoji: "🗂️", titre: "Calques, cotes et textes", duree: "20 min",
      intro: "Organiser le dessin et le rendre lisible.",
      sections: [
        { titre: "Les calques", texte: [
          "Un **calque** est comme une feuille transparente : murs, cotes, textes, mobilier, réseaux… chacun dans le sien, avec sa couleur, son type de ligne et son épaisseur. On peut les **geler**, les **éteindre** ou les **verrouiller** pour travailler tranquille."],
          liste: [
            "Commande **CALQUE (LA)** : gestionnaire des propriétés des calques.",
            "Règle d'or : les objets en couleur et épaisseur « **DuCalque** », jamais forcées à la main.",
            "**CORRESPROP (MA)** : copier les propriétés (calque, couleur…) d'un objet sur d'autres.",
            "Éteindre les calques inutiles avant d'imprimer un plan de chantier (mobilier, cotes intérieures…)."
          ] },
        { titre: "La cotation", liste: [
          "**COTLIN (DLI)** : cote horizontale ou verticale ; **COTALI (DAL)** : cote alignée sur un objet en biais.",
          "**COTCONTINUE (DCO)** : enchaîner des cotes à la suite (une chaîne de cotes d'ouvertures).",
          "Le **style de cote** (DIMSTYLE, raccourci D) règle la taille du texte, des flèches, les unités et l'arrondi.",
          "Une cote associative se met à jour si on modifie l'objet : ne jamais remplacer le texte d'une cote par un chiffre tapé à la main."
        ] },
        { titre: "Les textes et hachures", liste: [
          "**TEXTMULT (T)** : paragraphe ; **TEXTE (DT)** : ligne simple.",
          "Objets **annotatifs** : la taille du texte et des cotes s'adapte à l'échelle de la fenêtre (1/50, 1/100).",
          "**HACHURES (H)** : remplir une zone fermée (béton coupé, isolant, terre…)."
        ] }
      ],
      retenir: [
        "Un calque par type d'objet ; propriétés « DuCalque ».",
        "Ne jamais écraser le texte d'une cote à la main.",
        "Annotatif = textes et cotes qui s'adaptent à l'échelle."
      ],
      terrain: "Avant d'envoyer un plan modifié, gèle les calques de travail et vérifie les cotes que tu as ajoutées en les recalculant de tête. Une cote fausse envoyée au chantier, c'est un mur au mauvais endroit.",
      quiz: [
        { q: "Pourquoi utiliser des calques ?", choix: ["Pour organiser le dessin et contrôler l'affichage et l'impression", "Pour rendre le fichier plus lourd", "Ce n'est pas utile"], ok: 0, pourquoi: "Chaque famille d'objets dans son calque : on gère couleur, épaisseur et visibilité en un clic." },
        { q: "La bonne pratique pour la couleur des objets est…", choix: ["DuCalque", "Rouge forcé partout", "Au hasard"], ok: 0, pourquoi: "Les propriétés DuCalque permettent de tout changer depuis le gestionnaire de calques." },
        { q: "Une cote affiche 2 980 mais tu veux 3 000. Tu…", choix: ["Corriges le dessin, la cote se met à jour", "Tapes 3 000 à la place du texte de la cote", "Laisses comme ça"], ok: 0, pourquoi: "Écraser le texte d'une cote cache une erreur de dessin et trompe le chantier." },
        { q: "Quelle commande enchaîne des cotes les unes après les autres ?", choix: ["COTCONTINUE (DCO)", "CERCLE", "DECOMPOS"], ok: 0, pourquoi: "Cotation continue à partir d'une cote existante." },
        { q: "Les hachures servent à…", choix: ["Remplir une zone fermée avec un motif", "Couper une ligne", "Imprimer"], ok: 0, pourquoi: "Béton coupé, terre, isolant : chaque matériau a son motif." }
      ]
    },
    {
      id: "blocs", emoji: "🧩", titre: "Blocs et références externes (Xréf)", duree: "15 min",
      intro: "Réutiliser des éléments et travailler sur le plan des autres sans le casser.",
      sections: [
        { titre: "Les blocs", liste: [
          "Un **bloc** est un groupe d'objets enregistré sous un nom (porte, fenêtre, WC, symbole électrique, cartouche).",
          "**BLOC (B)** pour créer, **INSERER (I)** pour placer.",
          "Modifier la définition du bloc met à jour **toutes** ses copies (commande BEDIT / éditeur de blocs).",
          "Les blocs peuvent porter des **attributs** (texte variable : numéro de pièce, surface…)."
        ] },
        { titre: "Les références externes (Xréf)", texte: [
          "Une **Xréf** (commande **XREF**/**ATTACHER**) affiche un autre fichier DWG dans le tien, sans le copier : par exemple le plan de l'architecte en fond, sous ton plan d'installation de chantier ou de réservations.",
          "Quand l'architecte envoie un nouvel indice, tu remplaces le fichier lié et ton plan se met à jour. Tu ne modifies jamais le plan de l'architecte : tu travailles par-dessus."] }
      ],
      retenir: [
        "Bloc = élément réutilisable ; modifier la définition modifie toutes les copies.",
        "Xréf = plan d'un autre lié en fond, mis à jour avec ses indices."
      ],
      terrain: "Pour ton PIC (plan d'installation de chantier), attache le plan de masse de l'architecte en Xréf et dessine dans ton fichier la grue, les bungalows et les clôtures en blocs : tu le remets à jour en deux minutes à chaque phase.",
      quiz: [
        { q: "On modifie la définition d'un bloc « fenêtre ». Que se passe-t-il ?", choix: ["Toutes les fenêtres insérées sont mises à jour", "Seule la dernière change", "Rien"], ok: 0, pourquoi: "C'est tout l'intérêt des blocs." },
        { q: "Une Xréf, c'est…", choix: ["Un autre DWG lié et affiché dans ton dessin", "Une erreur de dessin", "Une cote"], ok: 0, pourquoi: "Le fichier reste séparé : on le met à jour en remplaçant le fichier source." },
        { q: "Pour placer un bloc existant :", choix: ["INSERER (I)", "BLOC (B)", "EFFACER (E)"], ok: 0, pourquoi: "BLOC crée la définition, INSERER place des occurrences." },
        { q: "Pourquoi ne pas dessiner directement dans le plan de l'architecte ?", choix: ["Pour garder son plan intact et pouvoir le mettre à jour", "Parce que c'est interdit par la loi", "Ça ne change rien"], ok: 0, pourquoi: "Travailler par-dessus en Xréf évite de perdre tes ajouts à chaque nouvel indice." },
        { q: "Un attribut de bloc sert à…", choix: ["Stocker un texte variable (n° de pièce, surface…)", "Changer la couleur du fond", "Imprimer en PDF"], ok: 0, pourquoi: "Les attributs rendent les blocs « intelligents » (cartouches, étiquettes)." }
      ]
    },
    {
      id: "impression", emoji: "🖨️", titre: "Présentations et impression à l'échelle", duree: "20 min",
      intro: "Sortir un PDF ou un tirage papier au 1/50 juste.",
      sections: [
        { titre: "Espace objet et présentation", liste: [
          "On dessine en vraie grandeur dans l'**espace objet** (onglet Objet).",
          "Une **présentation** (onglet Présentation) représente la feuille (A3, A1…) avec le cartouche.",
          "On y crée des **fenêtres** (viewports) qui montrent une partie du dessin à une **échelle** choisie (1/50, 1/100).",
          "Une fois l'échelle réglée, **verrouiller la fenêtre** pour ne pas la dérégler en zoomant."
        ] },
        { titre: "Imprimer", liste: [
          "Commande **TRACEUR** (Ctrl+P) depuis la présentation, à l'**échelle 1:1** (c'est la fenêtre qui porte l'échelle du dessin).",
          "Choisir l'imprimante ou « DWG to PDF », le format, la **table des styles de tracé** (épaisseurs, noir et blanc : souvent monochrome.ctb).",
          "Aperçu avant impression systématique.",
          "Vérifier sur le tirage avec une cote connue et un réglet d'architecte."
        ] },
        { titre: "Et sans AutoCAD ?", texte: [
          "Pour seulement **lire, mesurer et imprimer** un DWG, il existe des visionneuses gratuites de l'éditeur (comme DWG TrueView) ou des visionneuses en ligne. Elles suffisent souvent au chef de chantier sur le terrain."] }
      ],
      retenir: [
        "Dessin en vraie grandeur ; l'échelle se met dans la fenêtre de présentation.",
        "On imprime la présentation à 1:1.",
        "Fenêtre verrouillée, aperçu, contrôle d'une cote sur le tirage."
      ],
      terrain: "Avant d'envoyer un plan au chantier, imprime-le en PDF et mesure une cote connue avec l'outil de mesure du lecteur PDF : si 5 m tombent à 10 cm sur un A3 au 1/50, l'échelle est bonne.",
      quiz: [
        { q: "Où règle-t-on l'échelle 1/50 d'un plan à imprimer ?", choix: ["Dans la fenêtre de la présentation", "En redessinant tout 50 fois plus petit", "Dans l'imprimante"], ok: 0, pourquoi: "Le dessin reste en vraie grandeur ; la fenêtre l'affiche à l'échelle." },
        { q: "Une présentation s'imprime à l'échelle…", choix: ["1:1", "1:50", "1:100"], ok: 0, pourquoi: "La feuille est déjà à sa taille réelle ; l'échelle du dessin est portée par la fenêtre." },
        { q: "Pourquoi verrouiller une fenêtre ?", choix: ["Pour ne pas dérégler l'échelle en zoomant", "Pour l'imprimer en couleur", "Pour l'effacer"], ok: 0, pourquoi: "Un coup de molette dans une fenêtre déverrouillée change l'échelle." },
        { q: "Au 1/50, 5 m mesurent sur la feuille…", choix: ["10 cm", "5 cm", "50 cm"], ok: 0, pourquoi: "500 cm ÷ 50 = 10 cm." },
        { q: "Raccourci clavier de la commande d'impression :", choix: ["Ctrl+P", "Ctrl+Z", "F3"], ok: 0, pourquoi: "Ctrl+P lance TRACEUR (PLOT)." }
      ]
    },
    {
      id: "metres", emoji: "📏", titre: "Métrés et mesures avec AutoCAD", duree: "15 min",
      intro: "Sortir des quantités fiables d'un plan DWG.",
      sections: [
        { titre: "Mesurer", liste: [
          "**DISTANCE (DI)** : distance entre deux points (avec l'accrochage F3 !).",
          "**AIRE (AA)** : surface en cliquant les sommets, ou option **Objet** sur une polyligne fermée ; options Ajouter / Soustraire pour enlever une trémie.",
          "**MESUREGEOM (MEA)** : rayon, angle, aire, volume, distance rapide.",
          "**LISTE (LI)** et la palette **Propriétés** (Ctrl+1) : longueur d'une polyligne, aire, calque."
        ] },
        { titre: "Méthode pour un métré propre", liste: [
          "Créer un calque « METRE » et tracer des **polylignes fermées** sur les contours (pièces, dalles, murs).",
          "Vérifier l'unité du dessin (cm ou mm) et convertir : en mm, une aire s'affiche en mm² (diviser par 1 000 000 pour des m²).",
          "Noter les résultats dans un tableau (Excel) avec le nom de la zone.",
          "Toujours contrôler un résultat par un calcul de tête (longueur × largeur)."
        ] }
      ],
      retenir: [
        "DI pour les longueurs, AA pour les aires, Ctrl+1 pour les propriétés.",
        "Polylignes fermées dans un calque METRE.",
        "Attention aux unités : mm² ÷ 1 000 000 = m²."
      ],
      terrain: "Pour commander un béton de dalle, trace la polyligne du contour, lis l'aire, multiplie par l'épaisseur et ajoute une marge. Puis demande à quelqu'un de refaire le calcul sans regarder le tien.",
      quiz: [
        { q: "Quelle commande mesure une surface ?", choix: ["AIRE (AA)", "DISTANCE (DI)", "DECALER (O)"], ok: 0, pourquoi: "AIRE donne surface et périmètre." },
        { q: "Une aire affichée 12 500 000 dans un dessin en mm vaut…", choix: ["12,5 m²", "125 m²", "1 250 m²"], ok: 0, pourquoi: "12 500 000 mm² ÷ 1 000 000 = 12,5 m²." },
        { q: "Quel objet facilite le plus le métré des surfaces ?", choix: ["La polyligne fermée", "Le texte", "La cote"], ok: 0, pourquoi: "Son aire se lit directement dans les propriétés." },
        { q: "Ctrl+1 ouvre…", choix: ["La palette Propriétés", "L'impression", "L'aide"], ok: 0, pourquoi: "On y lit longueur, aire, calque, couleur de l'objet sélectionné." },
        { q: "Pour enlever une trémie d'une surface de dalle avec AIRE :", choix: ["Option Soustraire", "On ne peut pas", "On efface la dalle"], ok: 0, pourquoi: "AIRE propose les modes Ajouter et Soustraire." }
      ]
    }
  ],
  commandes: [
    { fr: "LIGNE", en: "LINE", raccourci: "L", cat: "Dessin", desc: "Dessiner des segments de droite." },
    { fr: "POLYLIGN", en: "PLINE", raccourci: "PL", cat: "Dessin", desc: "Dessiner une ligne continue en un seul objet (contours, surfaces)." },
    { fr: "RECTANG", en: "RECTANG", raccourci: "REC", cat: "Dessin", desc: "Dessiner un rectangle par deux coins opposés." },
    { fr: "CERCLE", en: "CIRCLE", raccourci: "C", cat: "Dessin", desc: "Dessiner un cercle (centre + rayon ou diamètre)." },
    { fr: "ARC", en: "ARC", raccourci: "A", cat: "Dessin", desc: "Dessiner un arc de cercle." },
    { fr: "HACHURES", en: "HATCH", raccourci: "H", cat: "Dessin", desc: "Remplir une zone fermée avec un motif (béton, terre, isolant)." },
    { fr: "TEXTMULT", en: "MTEXT", raccourci: "T", cat: "Annotation", desc: "Écrire un texte sur plusieurs lignes (paragraphe)." },
    { fr: "TEXTE", en: "TEXT", raccourci: "DT", cat: "Annotation", desc: "Écrire une ligne de texte simple." },
    { fr: "DEPLACER", en: "MOVE", raccourci: "M", cat: "Modification", desc: "Déplacer des objets d'un point à un autre." },
    { fr: "COPIER", en: "COPY", raccourci: "CO", cat: "Modification", desc: "Copier des objets." },
    { fr: "ROTATION", en: "ROTATE", raccourci: "RO", cat: "Modification", desc: "Faire tourner des objets autour d'un point." },
    { fr: "MIROIR", en: "MIRROR", raccourci: "MI", cat: "Modification", desc: "Créer une copie symétrique." },
    { fr: "DECALER", en: "OFFSET", raccourci: "O", cat: "Modification", desc: "Créer une copie parallèle à une distance donnée (épaisseur de mur)." },
    { fr: "AJUSTER", en: "TRIM", raccourci: "TR", cat: "Modification", desc: "Couper la partie d'un objet qui dépasse une limite." },
    { fr: "PROLONGER", en: "EXTEND", raccourci: "EX", cat: "Modification", desc: "Allonger un objet jusqu'à une limite." },
    { fr: "RACCORD", en: "FILLET", raccourci: "F", cat: "Modification", desc: "Raccorder deux lignes (rayon 0 = angle net)." },
    { fr: "CHANFREIN", en: "CHAMFER", raccourci: "CHA", cat: "Modification", desc: "Couper un angle en biais." },
    { fr: "EFFACER", en: "ERASE", raccourci: "E", cat: "Modification", desc: "Supprimer des objets." },
    { fr: "DECOMPOS", en: "EXPLODE", raccourci: "X", cat: "Modification", desc: "Éclater un bloc ou une polyligne en objets simples." },
    { fr: "RESEAU", en: "ARRAY", raccourci: "AR", cat: "Modification", desc: "Répéter des objets en lignes/colonnes ou en cercle." },
    { fr: "ECHELLE", en: "SCALE", raccourci: "SC", cat: "Modification", desc: "Agrandir ou réduire des objets." },
    { fr: "ETIRER", en: "STRETCH", raccourci: "S", cat: "Modification", desc: "Étirer une partie d'un dessin (sélection de droite à gauche)." },
    { fr: "JOINDRE", en: "JOIN", raccourci: "J", cat: "Modification", desc: "Réunir des segments en une seule polyligne." },
    { fr: "COUPURE", en: "BREAK", raccourci: "BR", cat: "Modification", desc: "Couper un objet entre deux points." },
    { fr: "CORRESPROP", en: "MATCHPROP", raccourci: "MA", cat: "Propriétés", desc: "Copier les propriétés d'un objet (calque, couleur…) sur d'autres." },
    { fr: "CALQUE", en: "LAYER", raccourci: "LA", cat: "Propriétés", desc: "Ouvrir le gestionnaire des propriétés des calques." },
    { fr: "PROPRIETES", en: "PROPERTIES", raccourci: "PR", cat: "Propriétés", desc: "Ouvrir la palette Propriétés (aussi Ctrl+1)." },
    { fr: "COTLIN", en: "DIMLINEAR", raccourci: "DLI", cat: "Annotation", desc: "Coter une longueur horizontale ou verticale." },
    { fr: "COTALI", en: "DIMALIGNED", raccourci: "DAL", cat: "Annotation", desc: "Coter une longueur alignée sur un objet en biais." },
    { fr: "COTCONTINUE", en: "DIMCONTINUE", raccourci: "DCO", cat: "Annotation", desc: "Enchaîner des cotes à la suite." },
    { fr: "COTRAYON", en: "DIMRADIUS", raccourci: "DRA", cat: "Annotation", desc: "Coter le rayon d'un cercle ou d'un arc." },
    { fr: "COTSTYLE", en: "DIMSTYLE", raccourci: "D", cat: "Annotation", desc: "Régler le style des cotes (texte, flèches, unités)." },
    { fr: "BLOC", en: "BLOCK", raccourci: "B", cat: "Blocs", desc: "Créer un bloc réutilisable." },
    { fr: "INSERER", en: "INSERT", raccourci: "I", cat: "Blocs", desc: "Insérer un bloc ou un dessin." },
    { fr: "XREF", en: "XREF", raccourci: "XR", cat: "Blocs", desc: "Gérer les références externes (plans liés)." },
    { fr: "ZOOM", en: "ZOOM", raccourci: "Z", cat: "Affichage", desc: "Zoomer ; Z puis E (Étendu) pour tout voir." },
    { fr: "PANORAMIQUE", en: "PAN", raccourci: "P", cat: "Affichage", desc: "Se déplacer dans le dessin (aussi molette enfoncée)." },
    { fr: "REGEN", en: "REGEN", raccourci: "RE", cat: "Affichage", desc: "Régénérer l'affichage (cercles « facettés »)." },
    { fr: "DISTANCE", en: "DIST", raccourci: "DI", cat: "Mesure", desc: "Mesurer la distance entre deux points." },
    { fr: "AIRE", en: "AREA", raccourci: "AA", cat: "Mesure", desc: "Mesurer une surface et un périmètre." },
    { fr: "MESUREGEOM", en: "MEASUREGEOM", raccourci: "MEA", cat: "Mesure", desc: "Mesures rapides : distance, rayon, angle, aire." },
    { fr: "LISTE", en: "LIST", raccourci: "LI", cat: "Mesure", desc: "Afficher les informations d'un objet (longueur, aire, calque)." },
    { fr: "UNITES", en: "UNITS", raccourci: "UN", cat: "Réglages", desc: "Régler les unités et la précision du dessin." },
    { fr: "OPTIONS", en: "OPTIONS", raccourci: "OP", cat: "Réglages", desc: "Ouvrir les options d'AutoCAD." },
    { fr: "PURGER", en: "PURGE", raccourci: "PU", cat: "Réglages", desc: "Supprimer calques, blocs et styles inutilisés (fichier plus léger)." },
    { fr: "TRACEUR", en: "PLOT", raccourci: "Ctrl+P", cat: "Impression", desc: "Imprimer ou créer un PDF." },
    { fr: "ANNULER", en: "UNDO", raccourci: "U", cat: "Édition", desc: "Annuler la dernière action (aussi Ctrl+Z)." },
    { fr: "Accrochage aux objets", en: "OSNAP", raccourci: "F3", cat: "Aides au dessin", desc: "Activer/désactiver l'accrochage aux extrémités, milieux, intersections…" },
    { fr: "Ortho", en: "ORTHOMODE", raccourci: "F8", cat: "Aides au dessin", desc: "Forcer les traits à l'horizontale et à la verticale." },
    { fr: "Repérage polaire", en: "POLAR", raccourci: "F10", cat: "Aides au dessin", desc: "Guider le curseur selon des angles réglés." },
    { fr: "Saisie dynamique", en: "DYNMODE", raccourci: "F12", cat: "Aides au dessin", desc: "Saisir les valeurs près du curseur." },
    { fr: "Grille", en: "GRIDMODE", raccourci: "F7", cat: "Aides au dessin", desc: "Afficher/masquer la grille." }
  ]
};
