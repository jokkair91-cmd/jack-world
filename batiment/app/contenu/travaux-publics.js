/* Spécialité — Travaux publics (TP) */
window.SPECIALITES = window.SPECIALITES || [];
window.SPECIALITES.push({
  id: "tp", nom: "Travaux publics", emoji: "🚜",
  resume: "Routes, réseaux, terrassements et engins : le chantier à ciel ouvert.",
  role: "Les **travaux publics** construisent ce qui sert à tous : routes, réseaux d'eau et d'assainissement, réseaux électriques et télécom, ponts, voies ferrées, aménagements urbains. Le client est souvent une **collectivité** (commune, département, État). On y travaille dehors, avec des engins, souvent au milieu de la circulation et au-dessus de réseaux enterrés.",
  missions: [
    "Terrasser, régler et compacter des plates-formes et des tranchées",
    "Poser des canalisations et des réseaux enterrés",
    "Construire des chaussées, trottoirs, bordures et caniveaux",
    "Travailler en sécurité près des engins et de la circulation",
    "Signaler et baliser un chantier sur la voie publique"
  ],
  acces: "CAP constructeur de routes, CAP constructeur de réseaux de canalisations, CAP conducteur d'engins ; titres professionnels (canalisateur, constructeur de routes) ; CACES R482 pour conduire les engins. Évolution vers chef d'équipe, chef de chantier TP.",
  modules: [
    {
      id: "monde-tp", emoji: "🌍", titre: "Le monde des travaux publics", duree: "15 min",
      intro: "Les grands domaines, les métiers et ce qui change par rapport au bâtiment.",
      sections: [
        { titre: "Les grands domaines", liste: [
          "**Terrassement** : décaper, creuser, remblayer, régler et compacter.",
          "**Routes et VRD** (voirie et réseaux divers) : chaussées, parkings, trottoirs, bordures.",
          "**Canalisations** : eau potable, assainissement (eaux usées, eaux pluviales), gaz.",
          "**Réseaux secs** : électricité, éclairage public, télécom et fibre.",
          "**Ouvrages d'art** : ponts, murs de soutènement, tunnels.",
          "**Voies ferrées**, **travaux maritimes et fluviaux**, **génie écologique**."] },
        { titre: "Les métiers", liste: [
          "**Canalisateur** : pose les réseaux d'eau et d'assainissement.",
          "**Constructeur de routes** : met en œuvre les couches de chaussée, les bordures, les enrobés.",
          "**Conducteur d'engins** : pelle, chargeuse, niveleuse, compacteur, tombereau.",
          "**Régleur** : donne les niveaux et guide le réglage des plates-formes.",
          "**Chef d'équipe, chef de chantier, conducteur de travaux TP**."] },
        { titre: "Ce qui change par rapport au bâtiment", liste: [
          "Le chantier **bouge** (une tranchée avance de dizaines de mètres par jour).",
          "On travaille **près de la circulation** et des riverains.",
          "Les **réseaux enterrés** sont partout : DT-DICT obligatoires avant de creuser.",
          "Les **engins** sont au cœur du travail : la coactivité piétons/engins est le premier risque.",
          "Les clients sont souvent **publics** : marchés publics, appels d'offres, règles de commande publique."] }
      ],
      retenir: [
        "TP = routes, réseaux, terrassements, ouvrages d'art.",
        "Clients souvent publics (collectivités).",
        "Risques majeurs : engins, circulation, réseaux enterrés, effondrement de tranchée."
      ],
      terrain: "Le premier jour sur un chantier TP, demande où passent les réseaux (plans des DICT, marquages au sol) et quelle est la zone d'évolution des engins.",
      quiz: [
        { q: "Que veut dire VRD ?", choix: ["Voirie et réseaux divers", "Véhicules de route départementale", "Vérification des risques dangereux", "Voie rapide double"], ok: 0, pourquoi: "VRD = voirie et réseaux divers : routes, trottoirs, eau, assainissement, électricité, télécom." },
        { q: "Qui est souvent le client (maître d'ouvrage) en travaux publics ?", choix: ["Une collectivité ou l'État", "Le conducteur d'engins", "Le fournisseur d'enrobé", "Le coordonnateur SPS"], ok: 0, pourquoi: "Routes et réseaux sont souvent commandés par des communes, départements, régions ou l'État." },
        { q: "Quel métier pose les réseaux d'eau et d'assainissement ?", choix: ["Canalisateur", "Coffreur-bancheur", "Plaquiste", "Couvreur"], ok: 0, pourquoi: "Le canalisateur pose les canalisations enterrées." },
        { q: "Avant de creuser près de réseaux, que faut-il ?", choix: ["Des DT-DICT et le repérage des réseaux", "Seulement un permis de construire", "Rien si on creuse à la main", "L'accord du voisin"], ok: 0, pourquoi: "Les déclarations DT-DICT permettent de connaître les réseaux et leurs consignes avant les travaux." },
        { q: "Quel est l'un des premiers risques en TP ?", choix: ["La coactivité entre piétons et engins", "Le bruit des bureaux", "Le froid des chambres froides", "Le travail sur écran"], ok: 0, pourquoi: "Les collisions entre engins et piétons font partie des accidents les plus graves en TP." }
      ]
    },
    {
      id: "engins", emoji: "🚧", titre: "Les engins et la sécurité autour", duree: "20 min",
      intro: "Les principaux engins, le CACES, les angles morts et les gestes de guidage.",
      illustrations: ["angles-morts"],
      sections: [
        { titre: "Les engins du chantier", liste: [
          "**Pelle hydraulique** (et mini-pelle) : creuser, charger, poser des tuyaux.",
          "**Chargeuse** : charger les camions, déplacer des matériaux.",
          "**Bouteur** (bulldozer) : pousser la terre, décaper.",
          "**Niveleuse** : régler finement une plate-forme.",
          "**Compacteur** (cylindre, rouleau, plaque vibrante) : serrer les sols et les enrobés.",
          "**Tombereau** (dumper) et **camion benne** : transporter les matériaux.",
          "**Finisseur** : étaler l'enrobé chaud."] },
        { titre: "Pour conduire", texte: [
          "Il faut une **autorisation de conduite** délivrée par l'employeur, appuyée sur le **CACES R482** (engins de chantier) dans la bonne catégorie, une aptitude médicale et la connaissance du chantier. Avant chaque prise de poste : tour de l'engin, niveaux, éclairage, avertisseur de recul, ceinture."] },
        { titre: "Piéton près d'un engin", liste: [
          "Les **angles morts** sont grands, surtout à l'arrière et du côté opposé à la cabine : si tu ne vois pas les yeux du conducteur, il ne te voit pas.",
          "On **n'entre pas dans la zone d'évolution** (rayon de la flèche + marge) sans accord visuel du conducteur.",
          "Jamais **entre un engin et un obstacle** (mur, camion, talus).",
          "Gilet ou vêtement **haute visibilité** en permanence.",
          "Pour guider : un seul **guide**, visible, avec les **gestes de commandement** convenus."] }
      ],
      danger: "Ne passe jamais derrière un engin qui recule, même s'il bipe. Le bip ne remplace pas le contact visuel.",
      retenir: [
        "CACES R482 + autorisation de conduite de l'employeur.",
        "Angles morts : derrière et côté opposé à la cabine.",
        "Pas de contact visuel = pas d'approche.",
        "Jamais coincé entre un engin et un obstacle."
      ],
      terrain: "Quand tu dois t'approcher d'une pelle, place-toi face à la cabine, fais un signe et attends que le conducteur pose le godet au sol et te fasse signe.",
      quiz: [
        { q: "Quel engin sert à régler finement une plate-forme ?", choix: ["La niveleuse", "Le tombereau", "La bétonnière", "La grue à tour"], ok: 0, pourquoi: "La niveleuse, avec sa lame centrale, règle la plate-forme au bon niveau." },
        { q: "Pour conduire une pelle sur chantier, il faut notamment :", choix: ["Une autorisation de conduite de l'employeur (avec CACES R482)", "Seulement le permis B", "L'accord d'un collègue", "Rien sur un terrain privé"], ok: 0, pourquoi: "L'employeur délivre l'autorisation de conduite, en général sur la base du CACES R482 de la bonne catégorie." },
        { q: "Où sont les angles morts les plus dangereux ?", choix: ["À l'arrière et du côté opposé à la cabine", "Juste devant la cabine", "Sur le toit", "Il n'y en a pas avec les rétroviseurs"], ok: 0, pourquoi: "Le conducteur voit mal derrière lui et du côté opposé à sa cabine." },
        { q: "Un engin recule en bipant. Tu dois passer derrière. Que fais-tu ?", choix: ["J'attends le contact visuel et le signe du conducteur", "Je passe vite, il bipe donc il sait", "Je passe en courant", "Je tape sur la carrosserie"], ok: 0, pourquoi: "Le bip prévient, mais seul le contact visuel garantit que le conducteur t'a vu." },
        { q: "Pour guider une manœuvre :", choix: ["Un seul guide visible, avec des gestes convenus", "Tout le monde fait des signes", "On crie de loin", "On guide depuis l'arrière, caché"], ok: 0, pourquoi: "Un seul guide, bien visible, évite les ordres contradictoires." }
      ]
    },
    {
      id: "terrassement", emoji: "⛏️", titre: "Terrassement et tranchées", duree: "25 min",
      intro: "Déblai, remblai, foisonnement, compactage… et le blindage des tranchées.",
      illustrations: ["tranchee"],
      sections: [
        { titre: "Les mots du terrassement", liste: [
          "**Décapage** : on enlève la terre végétale (stockée à part pour la réutiliser).",
          "**Déblai** : terre qu'on enlève. **Remblai** : matériau qu'on apporte pour combler ou monter.",
          "**Foisonnement** : la terre extraite prend plus de place qu'en place (souvent 10 à 40 % de plus selon le sol). On en tient compte pour commander les camions.",
          "**Plate-forme** : surface réglée et compactée sur laquelle on construit."] },
        { titre: "Compacter", liste: [
          "On remblaie par **couches minces** (souvent 20 à 30 cm) et on compacte chaque couche.",
          "Le matériau doit avoir la **bonne humidité** : trop sec ou trop mouillé, il se compacte mal.",
          "Le compactage est contrôlé (essais à la plaque, pénétromètre) selon le cahier des charges."] },
        { titre: "Les tranchées", texte: [
          "Une paroi de tranchée peut s'effondrer sans prévenir : 1 m³ de terre pèse environ **1,5 à 2 tonnes**. Au-delà de **1,30 m de profondeur**, les parois doivent être **blindées** (caissons, panneaux) ou **talutées** selon la nature du sol.",
          "Les déblais sont déposés **à distance du bord** (une bande libre d'au moins 40 cm est la règle courante), l'accès se fait par une **échelle** qui dépasse du bord, et on ne reste jamais seul au fond."] }
      ],
      danger: "On ne descend **jamais** dans une tranchée profonde non blindée, même « pour une minute ». L'ensevelissement est mortel en quelques minutes.",
      retenir: [
        "Foisonnement : la terre extraite prend plus de volume.",
        "Remblai par couches minces, compactées une à une.",
        "Tranchée de plus de 1,30 m : blindage ou talus.",
        "Déblais à distance du bord, échelle d'accès."
      ],
      terrain: "Regarde les parois avant de descendre : fissures en tête, terre qui coule, eau qui suinte = on sort et on prévient le chef.",
      quiz: [
        { q: "À partir de quelle profondeur une tranchée doit-elle être blindée ou talutée ?", choix: ["Au-delà de 1,30 m", "Au-delà de 3 m", "Au-delà de 50 cm", "Jamais si le sol est sec"], ok: 0, pourquoi: "La règle impose des parois blindées ou talutées pour les tranchées de plus de 1,30 m de profondeur." },
        { q: "Qu'est-ce que le foisonnement ?", choix: ["L'augmentation de volume de la terre extraite", "La pousse de l'herbe", "Le tassement d'un remblai", "Le gonflement du béton"], ok: 0, pourquoi: "Une fois creusée, la terre est moins serrée et occupe plus de volume." },
        { q: "Comment remblaie-t-on correctement ?", choix: ["Par couches minces compactées une à une", "En une seule fois, puis on compacte", "Sans compacter, ça se tasse tout seul", "En arrosant abondamment"], ok: 0, pourquoi: "Un compacteur n'agit que sur une épaisseur limitée : on travaille par couches." },
        { q: "Où déposer les déblais d'une tranchée ?", choix: ["À distance du bord", "Au ras du bord", "Dans la tranchée", "Sur la chaussée en circulation"], ok: 0, pourquoi: "Un tas au bord charge la paroi et peut provoquer un éboulement ou tomber sur les ouvriers." },
        { q: "Tu vois des fissures en haut de la paroi d'une tranchée. Que fais-tu ?", choix: ["Je sors et je préviens le chef", "Je continue en faisant vite", "Je tasse avec la pelle", "Rien, c'est normal"], ok: 0, pourquoi: "Des fissures en tête sont un signe d'éboulement imminent." }
      ]
    },
    {
      id: "canalisations", emoji: "🚰", titre: "Réseaux et canalisations", duree: "25 min",
      intro: "Couleurs des réseaux, lit de pose, pente, grillage avertisseur et essais.",
      illustrations: ["reseaux"],
      sections: [
        { titre: "Reconnaître les réseaux", liste: [
          "Les grillages avertisseurs et les marquages ont une **couleur par réseau** : **rouge** électricité, **jaune** gaz, **bleu** eau potable, **marron** assainissement, **vert** télécom, **violet** chauffage ou froid.",
          "Avant de creuser : **DT-DICT**, plans des exploitants, marquage au sol et, près d'un réseau sensible, **terrassement manuel** ou techniques douces.",
          "Un réseau touché ou découvert sans être prévu : **on arrête**, on protège la zone et on prévient (procédure « arrêt de chantier »)."] },
        { titre: "Poser une canalisation", liste: [
          "Fond de fouille réglé, débarrassé des pierres.",
          "**Lit de pose** en sable ou gravillons (souvent une dizaine de cm).",
          "Pose du tuyau à la **pente** du projet (assainissement gravitaire : l'eau doit couler), contrôlée au laser ou à la mire.",
          "**Enrobage** du tuyau avec un matériau fin et compacté prudemment sur les côtés.",
          "**Grillage avertisseur** environ 20 à 30 cm au-dessus du tuyau, puis remblai par couches."] },
        { titre: "Avant de reboucher et réceptionner", liste: [
          "**Essais d'étanchéité** (à l'eau ou à l'air) sur l'assainissement, **épreuve de pression** sur l'eau potable.",
          "**Inspection télévisée** (caméra) des collecteurs d'assainissement.",
          "**Récolement** : relevé précis de ce qui a été posé (position, profondeur), remis au client et à l'exploitant."] }
      ],
      retenir: [
        "Rouge élec, jaune gaz, bleu eau, marron assainissement, vert télécom.",
        "Lit de pose, pente, enrobage, grillage, remblai par couches.",
        "Réseau imprévu ou touché : arrêt, protection, alerte.",
        "Essais et récolement avant réception."
      ],
      terrain: "Odeur de gaz sur une fouille : on arrête les moteurs, on éloigne tout le monde, pas de flamme ni de téléphone près de la fuite, et on appelle les secours et l'exploitant.",
      quiz: [
        { q: "Un grillage jaune dans la fouille indique :", choix: ["Du gaz", "De l'eau potable", "Des télécoms", "De l'électricité"], ok: 0, pourquoi: "Jaune = gaz (et hydrocarbures)." },
        { q: "Un grillage rouge dans la fouille indique :", choix: ["De l'électricité", "De l'assainissement", "Du chauffage", "De l'eau potable"], ok: 0, pourquoi: "Rouge = électricité." },
        { q: "À quoi sert le lit de pose ?", choix: ["Caler le tuyau sur un fond régulier", "Décorer la tranchée", "Remplacer le grillage", "Faire évaporer l'eau"], ok: 0, pourquoi: "Le lit de pose évite les points durs qui casseraient le tuyau et permet de régler la pente." },
        { q: "Ta pelle accroche un câble non prévu. Que fais-tu ?", choix: ["J'arrête, je protège la zone et je préviens", "Je le recouvre et je continue", "Je le coupe proprement", "Je le tire pour voir où il va"], ok: 0, pourquoi: "C'est la procédure d'arrêt : on ne touche plus à rien, on balise et on alerte." },
        { q: "Qu'est-ce que le récolement ?", choix: ["Le relevé précis de ce qui a été posé", "Le collage des tuyaux", "La pause de midi", "Le nettoyage du chantier"], ok: 0, pourquoi: "Le plan de récolement indique où se trouvent exactement les réseaux posés." }
      ]
    },
    {
      id: "chaussees", emoji: "🛣️", titre: "Routes et chaussées", duree: "25 min",
      intro: "Les couches d'une route, l'enrobé chaud, le compactage, bordures et caniveaux.",
      illustrations: ["chaussee"],
      sections: [
        { titre: "Une chaussée, c'est un mille-feuille", liste: [
          "**Plate-forme** (sol support), parfois améliorée par une **couche de forme**.",
          "**Couche de fondation** et **couche de base** : souvent en grave (non traitée ou traitée), elles répartissent les charges.",
          "**Couche de roulement** : l'enrobé bitumineux qu'on voit, imperméable et adhérent.",
          "Entre les couches d'enrobé, une **couche d'accrochage** (émulsion) les colle entre elles."] },
        { titre: "Poser l'enrobé", liste: [
          "L'enrobé arrive **chaud** (environ 150 °C et plus) en camion bâché.",
          "Le **finisseur** l'étale à l'épaisseur voulue, puis les **compacteurs** (cylindres tandem, à pneus) le serrent avant qu'il refroidisse.",
          "Les **joints** (raccords avec l'existant, entre deux bandes) sont soignés : découpe nette, accrochage.",
          "EPI : chaussures adaptées à la chaleur, vêtements longs, gants ; attention aux fumées et à la chaleur en été."] },
        { titre: "Bordures, caniveaux, eau", texte: [
          "Les **bordures** tiennent la chaussée et guident l'eau ; les **caniveaux** et **avaloirs** l'évacuent. Une route qui garde l'eau se dégrade vite : les **pentes** (dévers, pente en long) sont aussi importantes que l'épaisseur."] }
      ],
      retenir: [
        "Plate-forme → forme → fondation → base → roulement.",
        "Enrobé chaud au finisseur, compacté avant de refroidir.",
        "Couche d'accrochage entre les enrobés.",
        "L'eau est l'ennemie de la route : pentes et évacuations."
      ],
      terrain: "Ne marche pas sur l'enrobé frais devant le compacteur : tu laisses des traces et tu te brûles. Reste sur le côté, hors de la trajectoire des engins.",
      quiz: [
        { q: "Quelle est la couche que l'on voit sur une route ?", choix: ["La couche de roulement", "La couche de forme", "La plate-forme", "La couche de fondation"], ok: 0, pourquoi: "La couche de roulement, en enrobé, est en surface." },
        { q: "Quel engin étale l'enrobé chaud ?", choix: ["Le finisseur", "La niveleuse", "La chargeuse", "La bétonnière"], ok: 0, pourquoi: "Le finisseur répartit et pré-compacte l'enrobé à l'épaisseur voulue." },
        { q: "Pourquoi compacter l'enrobé rapidement ?", choix: ["Parce qu'il se compacte mal une fois refroidi", "Pour finir avant la pause", "Pour qu'il sèche", "Ce n'est pas nécessaire"], ok: 0, pourquoi: "En refroidissant, le bitume durcit et l'enrobé ne se serre plus correctement." },
        { q: "À quoi sert la couche d'accrochage ?", choix: ["Coller les couches d'enrobé entre elles", "Peindre les lignes", "Drainer l'eau", "Remplacer le compactage"], ok: 0, pourquoi: "L'émulsion d'accrochage fait travailler les couches ensemble." },
        { q: "Quel est le grand ennemi d'une chaussée ?", choix: ["L'eau", "Le soleil d'hiver", "Les piétons", "Le marquage"], ok: 0, pourquoi: "L'eau qui s'infiltre affaiblit les couches et le sol support : d'où l'importance des pentes et évacuations." }
      ]
    },
    {
      id: "signalisation", emoji: "🚦", titre: "Signalisation de chantier sur la voie publique", duree: "20 min",
      intro: "Prévenir, rétrécir, protéger : baliser un chantier au milieu de la circulation.",
      illustrations: ["signalisation"],
      sections: [
        { titre: "Avant de s'installer", liste: [
          "Un **arrêté de circulation** (mairie, département…) fixe ce qu'on a le droit de faire : alternat, route barrée, vitesse limitée, horaires.",
          "On prépare le **schéma de signalisation** adapté (route, ville, autoroute, jour, nuit)."] },
        { titre: "Les panneaux et le balisage", liste: [
          "**AK5** (triangle « travaux ») placé **en amont**, assez loin pour que l'usager ralentisse.",
          "Limitation de vitesse et panneaux de **rétrécissement** si besoin.",
          "**Biseau de cônes (K5)** ou de balises pour rétrécir la voie progressivement.",
          "**Barrières (K2)** autour des fouilles ouvertes.",
          "**Alternat** géré par des **feux** temporaires ou par des **piquets K10** tenus par des agents formés.",
          "La nuit : balisage **lumineux**, feux clignotants."] },
        { titre: "Se protéger soi-même", liste: [
          "Vêtement **haute visibilité** (classe adaptée à la vitesse de la route).",
          "On pose la signalisation **dans le sens de la circulation** (de l'amont vers le chantier) et on la retire dans l'ordre inverse.",
          "On ne **tourne jamais le dos** à la circulation et on ne déborde pas de la zone protégée.",
          "La signalisation **n'est retirée** qu'une fois le chantier fini et la chaussée rendue propre."] }
      ],
      retenir: [
        "Arrêté de circulation d'abord.",
        "AK5 en amont, biseau de cônes, barrières, alternat.",
        "Poser dans le sens de la circulation, retirer à l'envers.",
        "Haute visibilité, jamais dos à la circulation."
      ],
      terrain: "Fais le trajet en voiture une fois la signalisation posée : si toi tu es surpris, l'usager le sera aussi. Corrige avant de commencer les travaux.",
      quiz: [
        { q: "Quel panneau annonce des travaux ?", choix: ["AK5 (triangle travaux)", "Stop", "Sens interdit", "Panneau de ville"], ok: 0, pourquoi: "L'AK5 est le panneau de danger « travaux », placé en amont." },
        { q: "Qu'est-ce qui autorise un alternat ou une route barrée ?", choix: ["Un arrêté de circulation", "Le chef de chantier seul", "Un panneau acheté", "L'accord d'un riverain"], ok: 0, pourquoi: "C'est l'autorité qui gère la voie (mairie, département…) qui prend l'arrêté." },
        { q: "Comment rétrécit-on une voie en douceur ?", choix: ["Avec un biseau de cônes", "Avec un seul cône au milieu", "En garant un camion", "En traçant à la craie"], ok: 0, pourquoi: "Le biseau guide progressivement les véhicules vers la voie restante." },
        { q: "Dans quel ordre pose-t-on la signalisation ?", choix: ["Dans le sens de la circulation, de l'amont vers le chantier", "Du chantier vers l'amont", "Dans n'importe quel ordre", "La nuit uniquement"], ok: 0, pourquoi: "On se protège progressivement en avançant avec la circulation ; on retire dans l'ordre inverse." },
        { q: "Avec quoi gère-t-on un alternat manuel ?", choix: ["Des piquets K10 tenus par des agents formés", "Des gestes improvisés", "Un klaxon", "Des cônes seuls"], ok: 0, pourquoi: "Les piquets mobiles K10 (vert/rouge) permettent de régler l'alternat." }
      ]
    }
  ]
});
