// Contenu FRANÇAIS de Jack Blabla — pour les francophones qui veulent maîtriser
// l'orthographe, la grammaire et la conjugaison (façon Bescherelle), du niveau Amateur à Expert.
// Vocabulaire : [indice, forme correcte]. Exercices : le PREMIER choix est le bon ; « pourquoi » = l'explication donnée après une erreur.

CONTENU.fr = {
  pronoms: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
  pronomsFr: ["1re pers. sing.", "2e pers. sing.", "3e pers. sing.", "1re pers. plur.", "2e pers. plur.", "3e pers. plur."],

  temps: [
    { id: "present", nom: "Présent", niveau: 0 },
    { id: "passe-compose", nom: "Passé composé", niveau: 0 },
    { id: "imparfait", nom: "Imparfait", niveau: 1 },
    { id: "futur", nom: "Futur simple", niveau: 1 },
    { id: "plus-que-parfait", nom: "Plus-que-parfait", niveau: 2 },
    { id: "conditionnel", nom: "Conditionnel présent", niveau: 2 },
    { id: "subjonctif", nom: "Subjonctif présent", niveau: 3 },
    { id: "futur-anterieur", nom: "Futur antérieur", niveau: 3 },
    { id: "passe-simple", nom: "Passé simple", niveau: 4 },
    { id: "cond-passe", nom: "Conditionnel passé", niveau: 4 },
  ],

  verbes: [
    // 3e groupe et auxiliaires : formes écrites à la main
    { inf: "être", fr: "auxiliaire", niveau: 0, groupe: 3, irregulier: true, participe: "été", radImparfait: "ét", radFutur: "ser",
      formes: { present: ["suis", "es", "est", "sommes", "êtes", "sont"], subjonctif: ["sois", "sois", "soit", "soyons", "soyez", "soient"], "passe-simple": ["fus", "fus", "fut", "fûmes", "fûtes", "furent"] } },
    { inf: "avoir", fr: "auxiliaire", niveau: 0, groupe: 3, irregulier: true, participe: "eu", radFutur: "aur",
      formes: { present: ["ai", "as", "a", "avons", "avez", "ont"], subjonctif: ["aie", "aies", "ait", "ayons", "ayez", "aient"], "passe-simple": ["eus", "eus", "eut", "eûmes", "eûtes", "eurent"] } },
    { inf: "aller", fr: "3e groupe (irrégulier)", niveau: 0, groupe: 3, irregulier: true, participe: "allé", aux: "etre", radFutur: "ir",
      formes: { present: ["vais", "vas", "va", "allons", "allez", "vont"], subjonctif: ["aille", "ailles", "aille", "allions", "alliez", "aillent"], "passe-simple": ["allai", "allas", "alla", "allâmes", "allâtes", "allèrent"] } },
    { inf: "faire", fr: "3e groupe", niveau: 0, groupe: 3, irregulier: true, participe: "fait", radFutur: "fer",
      formes: { present: ["fais", "fais", "fait", "faisons", "faites", "font"], subjonctif: ["fasse", "fasses", "fasse", "fassions", "fassiez", "fassent"], "passe-simple": ["fis", "fis", "fit", "fîmes", "fîtes", "firent"] } },
    { inf: "parler", fr: "1er groupe (modèle)", niveau: 0 },
    { inf: "aimer", fr: "1er groupe", niveau: 0 },
    { inf: "manger", fr: "1er groupe en -ger (mangeons)", niveau: 0 },
    { inf: "finir", fr: "2e groupe (modèle)", niveau: 0 },
    { inf: "pouvoir", fr: "3e groupe", niveau: 1, groupe: 3, irregulier: true, participe: "pu", radFutur: "pourr",
      formes: { present: ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"], subjonctif: ["puisse", "puisses", "puisse", "puissions", "puissiez", "puissent"], "passe-simple": ["pus", "pus", "put", "pûmes", "pûtes", "purent"] } },
    { inf: "vouloir", fr: "3e groupe", niveau: 1, groupe: 3, irregulier: true, participe: "voulu", radFutur: "voudr",
      formes: { present: ["veux", "veux", "veut", "voulons", "voulez", "veulent"], subjonctif: ["veuille", "veuilles", "veuille", "voulions", "vouliez", "veuillent"], "passe-simple": ["voulus", "voulus", "voulut", "voulûmes", "voulûtes", "voulurent"] } },
    { inf: "venir", fr: "3e groupe", niveau: 1, groupe: 3, irregulier: true, participe: "venu", aux: "etre", radFutur: "viendr",
      formes: { present: ["viens", "viens", "vient", "venons", "venez", "viennent"], subjonctif: ["vienne", "viennes", "vienne", "venions", "veniez", "viennent"], "passe-simple": ["vins", "vins", "vint", "vînmes", "vîntes", "vinrent"] } },
    { inf: "prendre", fr: "3e groupe", niveau: 1, groupe: 3, irregulier: true, participe: "pris", radFutur: "prendr",
      formes: { present: ["prends", "prends", "prend", "prenons", "prenez", "prennent"], subjonctif: ["prenne", "prennes", "prenne", "prenions", "preniez", "prennent"], "passe-simple": ["pris", "pris", "prit", "prîmes", "prîtes", "prirent"] } },
    { inf: "commencer", fr: "1er groupe en -cer (commençons)", niveau: 1 },
    { inf: "choisir", fr: "2e groupe", niveau: 1 },
    { inf: "savoir", fr: "3e groupe", niveau: 2, groupe: 3, irregulier: true, participe: "su", radFutur: "saur",
      formes: { present: ["sais", "sais", "sait", "savons", "savez", "savent"], subjonctif: ["sache", "saches", "sache", "sachions", "sachiez", "sachent"], "passe-simple": ["sus", "sus", "sut", "sûmes", "sûtes", "surent"] } },
    { inf: "dire", fr: "3e groupe (vous dites)", niveau: 2, groupe: 3, irregulier: true, participe: "dit", radFutur: "dir",
      formes: { present: ["dis", "dis", "dit", "disons", "dites", "disent"], subjonctif: ["dise", "dises", "dise", "disions", "disiez", "disent"], "passe-simple": ["dis", "dis", "dit", "dîmes", "dîtes", "dirent"] } },
    { inf: "voir", fr: "3e groupe", niveau: 2, groupe: 3, irregulier: true, participe: "vu", radFutur: "verr",
      formes: { present: ["vois", "vois", "voit", "voyons", "voyez", "voient"], subjonctif: ["voie", "voies", "voie", "voyions", "voyiez", "voient"], "passe-simple": ["vis", "vis", "vit", "vîmes", "vîtes", "virent"] } },
    { inf: "réussir", fr: "2e groupe", niveau: 2 },
    { inf: "devoir", fr: "3e groupe (dû)", niveau: 3, groupe: 3, irregulier: true, participe: "dû", radFutur: "devr",
      formes: { present: ["dois", "dois", "doit", "devons", "devez", "doivent"], subjonctif: ["doive", "doives", "doive", "devions", "deviez", "doivent"], "passe-simple": ["dus", "dus", "dut", "dûmes", "dûtes", "durent"] } },
    { inf: "mettre", fr: "3e groupe", niveau: 3, groupe: 3, irregulier: true, participe: "mis", radFutur: "mettr",
      formes: { present: ["mets", "mets", "met", "mettons", "mettez", "mettent"], subjonctif: ["mette", "mettes", "mette", "mettions", "mettiez", "mettent"], "passe-simple": ["mis", "mis", "mit", "mîmes", "mîtes", "mirent"] } },
    { inf: "travailler", fr: "1er groupe", niveau: 3 },
    { inf: "partir", fr: "3e groupe (pas -issons)", niveau: 4, groupe: 3, irregulier: true, participe: "parti", aux: "etre", radFutur: "partir",
      formes: { present: ["pars", "pars", "part", "partons", "partez", "partent"], subjonctif: ["parte", "partes", "parte", "partions", "partiez", "partent"], "passe-simple": ["partis", "partis", "partit", "partîmes", "partîtes", "partirent"] } },
    { inf: "envoyer", fr: "1er groupe (futur : enverrai)", niveau: 4, radFutur: "enverr",
      formes: { present: ["envoie", "envoies", "envoie", "envoyons", "envoyez", "envoient"], subjonctif: ["envoie", "envoies", "envoie", "envoyions", "envoyiez", "envoient"] } },
    { inf: "grandir", fr: "2e groupe", niveau: 5 },
  ],

  irreguliers: {
    colonnes: ["Infinitif", "Présent (je)", "Passé simple (il)", "Participe passé"],
    lignes: [
      // [infinitif, présent je, passé simple il, participe, remarque, niveau]
      ["être", "suis", "fut", "été", "auxiliaire", 0], ["avoir", "ai", "eut", "eu", "auxiliaire", 0], ["aller", "vais", "alla", "allé", "aux. être", 0],
      ["faire", "fais", "fit", "fait", "vous faites", 0], ["dire", "dis", "dit", "dit", "vous dites", 0], ["prendre", "prends", "prit", "pris", "ils prennent", 1],
      ["pouvoir", "peux", "put", "pu", "je peux (puis-je ?)", 1], ["vouloir", "veux", "voulut", "voulu", "", 1], ["venir", "viens", "vint", "venu", "aux. être", 1],
      ["savoir", "sais", "sut", "su", "", 2], ["voir", "vois", "vit", "vu", "", 2], ["devoir", "dois", "dut", "dû", "dû, mais due, dus", 2],
      ["mettre", "mets", "mit", "mis", "", 2], ["écrire", "écris", "écrivit", "écrit", "", 2], ["lire", "lis", "lut", "lu", "", 2],
      ["croire", "crois", "crut", "cru", "", 3], ["boire", "bois", "but", "bu", "", 3], ["connaître", "connais", "connut", "connu", "il connaît / connait", 3],
      ["naître", "nais", "naquit", "né", "aux. être", 3], ["vivre", "vis", "vécut", "vécu", "", 3], ["courir", "cours", "courut", "couru", "futur : courrai", 3],
      ["mourir", "meurs", "mourut", "mort", "aux. être", 4], ["acquérir", "acquiers", "acquit", "acquis", "", 4], ["résoudre", "résous", "résolut", "résolu", "", 4],
      ["peindre", "peins", "peignit", "peint", "", 4], ["craindre", "crains", "craignit", "craint", "", 4], ["joindre", "joins", "joignit", "joint", "ci-joint", 4],
      ["conclure", "conclus", "conclut", "conclu", "(pas « conclut »)", 5], ["inclure", "inclus", "inclut", "inclus", "participe : inclus", 5], ["vaincre", "vaincs", "vainquit", "vaincu", "", 5],
      ["s'asseoir", "m'assieds / m'assois", "s'assit", "assis", "", 5], ["haïr", "hais", "haït", "haï", "tréma", 5], ["coudre", "couds", "cousit", "cousu", "", 5],
    ],
  },

  themes: [
    // ---------- AMATEUR ----------
    { id: "homophones-1", niveau: 0, titre: "Homophones : a / à, et / est", emoji: "🔀",
      mots: [["Verbe avoir (on peut dire « avait »)", "Il a faim."], ["Préposition (on ne peut pas dire « avait »)", "Il va à Paris."],
        ["Verbe avoir : elle … un chat", "Elle a un chat."], ["Préposition : un verre … eau", "Un verre à eau."],
        ["Conjonction (on peut dire « et puis »)", "Paul et Léa."], ["Verbe être (on peut dire « était »)", "Le ciel est bleu."],
        ["Verbe être : il … content", "Il est content."], ["Conjonction : du pain … du fromage", "Du pain et du fromage."]],
      dialogue: [
        { who: "jack", txt: "Écris : Léa (avoir) un vélo rouge.", fr: "Choisis la phrase bien écrite." },
        { who: "toi", choices: ["Léa a un vélo rouge.", "Léa à un vélo rouge.", "Léa as un vélo rouge."], fr: "Léa a un vélo rouge. (« avait » marche → a sans accent)" },
        { who: "jack", txt: "Et maintenant : il (être) grand et fort.", fr: "Choisis la phrase bien écrite." },
        { who: "toi", choices: ["Il est grand et fort.", "Il et grand est fort.", "Il est grand est fort."], fr: "Il est grand et fort." },
      ] },
    { id: "homophones-2", niveau: 0, titre: "Homophones : on / ont, son / sont", emoji: "🔀",
      mots: [["Pronom (on peut dire « il »)", "On part demain."], ["Verbe avoir (on peut dire « avaient »)", "Ils ont froid."],
        ["Pronom : … mange à midi", "On mange à midi."], ["Verbe avoir : ils … gagné", "Ils ont gagné."],
        ["Possessif (on peut dire « mon »)", "Son frère est là."], ["Verbe être (on peut dire « étaient »)", "Ils sont prêts."],
        ["Possessif : … sac est lourd", "Son sac est lourd."], ["Verbe être : elles … parties", "Elles sont parties."]] },
    { id: "accents", niveau: 0, titre: "Les accents et la cédille", emoji: "✒️",
      mots: [["Accent aigu : son « é » fermé", "L'été"], ["Accent grave : son « è » ouvert", "Le père"], ["Accent circonflexe (souvent un ancien « s »)", "La forêt"],
        ["Accent grave pour distinguer : là (lieu)", "Il est là."], ["Accent grave : où (lieu)", "Où vas-tu ?"], ["Cédille : « c » qui se prononce « s » devant a, o, u", "Un garçon"],
        ["Cédille : nous commençons", "Nous commençons."], ["Tréma : on prononce les deux voyelles", "Noël"], ["Accent circonflexe : la tête", "La tête"]] },
    { id: "pluriels", niveau: 0, titre: "Pluriels particuliers", emoji: "🔢",
      mots: [["Un bijou → des …", "Des bijoux"], ["Un cheval → des …", "Des chevaux"], ["Un journal → des …", "Des journaux"],
        ["Un travail → des …", "Des travaux"], ["Un œil → des …", "Des yeux"], ["Un genou → des …", "Des genoux"],
        ["Un festival → des …", "Des festivals"], ["Un bal → des …", "Des bals"], ["Un pneu → des …", "Des pneus"], ["Un jeu → des …", "Des jeux"]] },
    { id: "mots-courants", niveau: 0, titre: "Mots courants souvent mal écrits", emoji: "📝",
      mots: [["Ce jour-ci", "Aujourd'hui"], ["En grande quantité", "Beaucoup"], ["Parfois", "Quelquefois"], ["Pour la raison que", "Parce que"],
        ["En dépit de", "Malgré"], ["Tout le temps", "Toujours"], ["En premier", "D'abord"], ["Un rendez-vous (avec trait d'union)", "Un rendez-vous"],
        ["Formule de politesse", "S'il vous plaît"], ["Les uns avec les autres", "Ensemble"], ["Pendant une longue période", "Longtemps"], ["Peut-être (incertitude)", "Peut-être"]] },

    // ---------- MOYEN ----------
    { id: "homophones-3", niveau: 1, titre: "Homophones : ce / se, ces / ses, ou / où", emoji: "🔀",
      mots: [["Démonstratif (on peut dire « cela »)", "Ce livre est à moi."], ["Pronom devant un verbe pronominal", "Il se lave."],
        ["Démonstratif pluriel (on peut dire « ceux-là »)", "Ces enfants jouent."], ["Possessif pluriel (« les siens »)", "Il range ses affaires."],
        ["« ou bien » (choix)", "Thé ou café ?"], ["Lieu ou temps (accent)", "La ville où j'habite."],
        ["C'est = cela est", "C'est facile."], ["S'est = verbe pronominal au passé", "Il s'est trompé."]],
      dialogue: [
        { who: "jack", txt: "Complète : Il (se/ce) demande (ou/où) il a mis (ces/ses) clés.", fr: "Choisis la phrase bien écrite." },
        { who: "toi", choices: ["Il se demande où il a mis ses clés.", "Il ce demande ou il a mis ces clés.", "Il se demande ou il a mis ces clés."], fr: "se (verbe se demander) · où (lieu) · ses (les siennes)" },
      ] },
    { id: "homophones-4", niveau: 1, titre: "Homophones : la / là / l'a, peu / peut / peux", emoji: "🔀",
      mots: [["Article (on peut dire « une »)", "La porte est ouverte."], ["Lieu (on peut dire « ici »)", "Pose-le là."], ["Pronom + avoir (on peut dire « l'avait »)", "Il l'a vu."],
        ["Petite quantité (contraire de beaucoup)", "Il mange peu."], ["Verbe pouvoir, il/elle", "Il peut venir."], ["Verbe pouvoir, je/tu", "Je peux t'aider."],
        ["Quand : moment (« lorsque »)", "Quand pars-tu ?"], ["Quant à : « en ce qui concerne »", "Quant à moi, je reste."]] },
    { id: "feminins", niveau: 1, titre: "Masculin et féminin", emoji: "⚧️",
      mots: [["Un acteur → une …", "Une actrice"], ["Un chanteur → une …", "Une chanteuse"], ["Un directeur → une …", "Une directrice"],
        ["Nouveau → nouvelle (devant un nom masculin à voyelle : « nouvel »)", "Un nouvel ami"], ["Vieux → vieille", "Une vieille maison"], ["Beau → belle", "Une belle journée"],
        ["Un homme sportif → une femme …", "Une femme sportive"], ["Un ami discret → une amie …", "Une amie discrète"], ["Un client loyal → une cliente …", "Une cliente loyale"]] },
    { id: "invariables", niveau: 1, titre: "Mots invariables utiles", emoji: "🔗",
      mots: [["Pourtant", "Cependant"], ["Malgré cela", "Néanmoins"], ["Par la suite", "Ensuite"], ["Avant tout", "Surtout"],
        ["Dès maintenant", "Désormais"], ["À présent", "Maintenant"], ["Souvent, pas toujours", "Parfois"], ["Brusquement", "Soudain"], ["Au fur et à mesure", "Progressivement"], ["Ainsi", "De cette façon"]] },

    // ---------- AUTONOME ----------
    { id: "homophones-5", niveau: 2, titre: "Homophones : leur / leurs, quel / qu'elle", emoji: "🔀",
      mots: [["Pronom devant un verbe (= « à eux ») : jamais de s", "Je leur parle."], ["Possessif + nom pluriel", "Ils aiment leurs enfants."], ["Possessif + nom singulier", "Ils aiment leur maison."],
        ["Déterminant interrogatif", "Quelle heure est-il ?"], ["Que + elle (on peut dire « qu'il »)", "Je crois qu'elle viendra."], ["Exclamation", "Quelle chance !"],
        ["Quelque(s) = un peu de", "Quelques amis"], ["Quel que soit (en deux mots, accordé)", "Quelle que soit la réponse"]] },
    { id: "registres", niveau: 2, titre: "Registres : familier, courant, soutenu", emoji: "🎚️",
      mots: [["Soutenu pour « bosser »", "Travailler"], ["Soutenu pour « une bagnole »", "Une voiture"], ["Soutenu pour « piger »", "Comprendre"],
        ["Soutenu pour « flipper »", "Avoir peur"], ["Soutenu pour « un truc »", "Une chose"], ["Soutenu pour « se planter »", "Se tromper"],
        ["Soutenu pour « c'est nul »", "C'est médiocre"], ["Soutenu pour « filer » (donner)", "Donner"], ["Soutenu pour « causer » (parler)", "S'entretenir"], ["Soutenu pour « bouffer »", "Manger"]] },
    { id: "tout", niveau: 2, titre: "Tout, tous, toute, toutes", emoji: "🧮",
      mots: [["Devant un nom masc. singulier", "Tout le monde"], ["Devant un nom masc. pluriel", "Tous les jours"], ["Devant un nom fém. singulier", "Toute la journée"],
        ["Devant un nom fém. pluriel", "Toutes les semaines"], ["Adverbe (= très) devant un adjectif masculin : invariable", "Ils sont tout contents."],
        ["Adverbe devant un adjectif féminin commençant par une consonne : accordé", "Elle est toute petite."], ["Adverbe devant adjectif féminin à voyelle : invariable", "Elle est tout heureuse."], ["Pronom pluriel (on prononce le s)", "Ils sont tous là."]] },

    // ---------- AVANCÉ ----------
    { id: "paronymes", niveau: 3, titre: "Paronymes (mots presque identiques)", emoji: "👯",
      mots: [["Effectif = réel ; affectif = des sentiments", "Une mesure effective"], ["Conjoncture = situation ; conjecture = supposition", "La conjoncture économique"],
        ["Éminent = remarquable ; imminent = tout proche", "Un départ imminent"], ["Effraction = entrée forcée ; infraction = violation de la loi", "Un vol avec effraction"],
        ["Collision = choc ; collusion = entente secrète", "Une collision entre deux voitures"], ["Prodigue = qui dépense trop ; prodige = génie", "Un enfant prodige"],
        ["Recouvrer = retrouver ; recouvrir = couvrir à nouveau", "Recouvrer la santé"], ["Acception = sens d'un mot ; acceptation = accord", "Dans toutes les acceptions du mot"],
        ["Évoquer = rappeler ; invoquer = appeler à l'aide", "Invoquer un argument"], ["Agoniser = être mourant ; agonir = insulter", "Agonir quelqu'un d'injures"]] },
    { id: "pleonasmes", niveau: 3, titre: "Pléonasmes à éviter", emoji: "🚫",
      mots: [["« Monter en haut »", "Monter"], ["« Descendre en bas »", "Descendre"], ["« Prévoir à l'avance »", "Prévoir"], ["« Au jour d'aujourd'hui »", "Aujourd'hui"],
        ["« Se réunir ensemble »", "Se réunir"], ["« Un faux prétexte »", "Un prétexte"], ["« Collaborer ensemble »", "Collaborer"], ["« Reculer en arrière »", "Reculer"],
        ["« Un bref résumé »", "Un résumé"], ["« Comme par exemple »", "Par exemple"]] },
    { id: "anglicismes", niveau: 3, titre: "Anglicismes : les mots français", emoji: "🇫🇷",
      mots: [["« Deadline »", "Une date limite"], ["« Meeting »", "Une réunion"], ["« Feedback »", "Un retour"], ["« Checker »", "Vérifier"],
        ["« Un mail »", "Un courriel"], ["« Booster »", "Stimuler"], ["« Un process »", "Un processus"], ["« Faire du networking »", "Réseauter"],
        ["« Être overbooké »", "Être débordé"], ["« Un brainstorming »", "Un remue-méninges"], ["« Supporter » une équipe", "Soutenir une équipe"]] },

    // ---------- PRO ----------
    { id: "ecrits-pro", niveau: 4, titre: "Formules des écrits professionnels", emoji: "✉️",
      mots: [["Ouvrir un courrier formel", "Madame, Monsieur,"], ["Annoncer une pièce jointe", "Veuillez trouver ci-joint le contrat."], ["Faire référence à un échange", "À la suite de notre entretien,"],
        ["Relancer poliment", "Je me permets de revenir vers vous concernant…"], ["Demander une réponse", "Dans l'attente de votre retour,"], ["Remercier", "Je vous remercie de votre réactivité."],
        ["Formule de fin (lettre)", "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."], ["Formule de fin (courriel)", "Bien cordialement,"],
        ["Proposer son aide", "Je reste à votre disposition pour tout complément d'information."], ["S'excuser d'un retard", "Je vous prie de bien vouloir excuser ce retard."]],
      dialogue: [
        { who: "jack", txt: "Tu envoies un devis à un client. Quelle phrase écris-tu ?", fr: "Choisis la formule correcte et professionnelle." },
        { who: "toi", choices: ["Veuillez trouver ci-joint notre devis.", "Veuillez trouver ci-jointe notre devis.", "Je vous envois le devis en PJ."], fr: "« ci-joint » en tête de phrase est invariable ; « j'envoie » s'écrit avec -e." },
        { who: "jack", txt: "Et pour conclure ton courriel ?", fr: "Choisis la formule correcte." },
        { who: "toi", choices: ["Je reste à votre disposition. Bien cordialement,", "Je reste à votre dispo. Bisous,", "Je reste a votre disposition. Cordialement."], fr: "« à » préposition, registre professionnel." },
      ] },
    { id: "erreurs-bureau", niveau: 4, titre: "Erreurs fréquentes au bureau", emoji: "⚠️",
      mots: [["« Suite à » (déconseillé)", "À la suite de"], ["« Pallier à un problème »", "Pallier un problème"], ["« Se rappeler de quelque chose »", "Se rappeler quelque chose"],
        ["« Malgré que »", "Bien que"], ["« Je vous envois »", "Je vous envoie"], ["« Comme convenu » (correct)", "Comme convenu"],
        ["« Je m'en rappelle »", "Je m'en souviens"], ["« Après qu'il soit parti »", "Après qu'il est parti"], ["« Au niveau de » (abus)", "En ce qui concerne"], ["« Solutionner »", "Résoudre"]] },
    { id: "vocabulaire-pro", niveau: 4, titre: "Vocabulaire de l'entreprise", emoji: "💼",
      mots: [["Le sujet d'un courriel", "L'objet"], ["Le document attaché", "La pièce jointe"], ["La personne qui reçoit", "Le destinataire"], ["Le relevé des décisions d'une réunion", "Le compte rendu"],
        ["La date à ne pas dépasser", "L'échéance"], ["Le budget prévu", "Le budget prévisionnel"], ["Le chiffre d'affaires", "Le CA"], ["La personne qui achète", "Le client"],
        ["Le document de prix envoyé avant une vente", "Le devis"], ["Le document de paiement", "La facture"], ["Un accord signé", "Un contrat"], ["L'ordre des sujets d'une réunion", "L'ordre du jour"]] },

    // ---------- EXPERT ----------
    { id: "soutenu", niveau: 5, titre: "Expressions soutenues", emoji: "🎩",
      mots: [["En tenant compte de, selon le critère de", "À l'aune de"], ["D'ailleurs, au reste", "Au demeurant"], ["Malgré (juridique)", "Nonobstant"], ["À plus forte raison", "A fortiori"],
        ["Dans les faits", "De facto"], ["Condition indispensable", "Une condition sine qua non"], ["Par conséquent", "Partant"], ["En revanche", "A contrario"],
        ["Au préalable", "Préalablement"], ["Mettre en évidence", "Mettre en exergue"], ["Avoir lieu", "Se tenir"], ["Corriger, rectifier", "Amender"]] },
    { id: "accords-difficiles", niveau: 5, titre: "Accords difficiles", emoji: "🧩",
      mots: [["Demi avant le nom : invariable, avec trait d'union", "Une demi-heure"], ["Demi après le nom : accordé en genre", "Deux heures et demie"], ["Nu avant le nom : invariable", "Marcher nu-pieds"],
        ["Ci-joint en tête de phrase : invariable", "Ci-joint les documents."], ["Ci-joint après le nom : accordé", "Les pièces ci-jointes"], ["Possible après « le plus » : invariable", "Le plus de dossiers possible"],
        ["Même après un pronom : avec trait d'union et accordé", "Eux-mêmes"], ["Couleur venant d'un nom : invariable", "Des yeux marron"], ["Adjectif de couleur composé : invariable", "Des robes bleu clair"], ["Vingt et cent multipliés et non suivis d'un nombre", "Quatre-vingts euros"]] },
    { id: "orthographe-piege", niveau: 5, titre: "Orthographe : les grands pièges", emoji: "🪤",
      mots: [["Le salaire (pas « rénumération »)", "La rémunération"], ["Lieu des avions (« aéro »)", "Un aéroport"], ["Choix difficile (deux m)", "Un dilemme"], ["Obtenir (un seul r)", "Acquérir"],
        ["Lien (un x, deux n)", "Une connexion"], ["Supposition (th, y)", "Une hypothèse"], ["Se montrer (deux p, accent)", "Apparaître"], ["Étrange (un z)", "Bizarre"],
        ["Ce qui se passe (deux orthographes admises)", "Un événement"], ["Crise cardiaque", "Un infarctus"], ["Ensemble des règles d'écriture", "L'orthographe"], ["Excès (pas « exessif »)", "Excessif"]] },
  ],

  grammaire: [
    // ---------- AMATEUR ----------
    { id: "classes-mots", niveau: 0, titre: "Les classes de mots", astuce: "Le nom désigne, le verbe se conjugue, l'adjectif décrit le nom, l'adverbe modifie le verbe et ne s'accorde pas.",
      explication: `<b>Nom</b> : désigne une personne, une chose, une idée (<i>le chat, la liberté</i>).<br>
        <b>Verbe</b> : action ou état, il se <b>conjugue</b> (<i>courir, être</i>).<br>
        <b>Adjectif</b> : décrit le nom et <b>s'accorde</b> avec lui (<i>une robe bleue</i>).<br>
        <b>Adverbe</b> : modifie un verbe ou un adjectif, il est <b>invariable</b> (<i>vite, très, souvent</i>).<br>
        <b>Déterminant</b> : devant le nom (<i>le, une, mon, ces</i>).`,
      exemples: [["Le petit chat dort paisiblement.", "déterminant + adjectif + nom + verbe + adverbe"], ["Elle chante très bien.", "très et bien sont des adverbes"]],
      exercices: [
        { q: "Dans « Il court vite », vite est un…", choix: ["adverbe", "adjectif", "verbe"], fr: "", pourquoi: "« vite » modifie le verbe « court » et ne s'accorde jamais : c'est un adverbe." },
        { q: "Dans « une maison ancienne », ancienne est un…", choix: ["adjectif", "nom", "adverbe"], fr: "", pourquoi: "« ancienne » décrit le nom « maison » et s'accorde au féminin : c'est un adjectif." },
        { q: "Dans « La liberté est précieuse », liberté est un…", choix: ["nom", "verbe", "adjectif"], fr: "", pourquoi: "« liberté » désigne une idée et est précédé du déterminant « la » : c'est un nom." },
        { q: "Dans « Ils travaillent », travaillent est un…", choix: ["verbe", "nom", "adverbe"], fr: "", pourquoi: "« travaillent » est conjugué (3e personne du pluriel) : c'est un verbe." },
        { q: "Dans « mes amis », mes est un…", choix: ["déterminant", "pronom", "adjectif"], fr: "", pourquoi: "« mes » est placé devant le nom « amis » : c'est un déterminant possessif." },
      ] },
    { id: "accord-sujet-verbe", niveau: 0, titre: "L'accord du verbe avec le sujet", astuce: "Le verbe s'accorde avec son sujet : pose la question « qui est-ce qui ? » devant le verbe.",
      explication: `Le verbe s'accorde en <b>personne</b> et en <b>nombre</b> avec son sujet.<br>
        Pour trouver le sujet : <b>« Qui est-ce qui … ? »</b> → <i>Les enfants (qui est-ce qui joue ?) <b>jouent</b>.</i><br>
        ⚠️ Le sujet peut être loin ou après le verbe : <i>Les fleurs que tu m'as offertes <b>sont</b> belles.</i> · <i>Où <b>vont</b> tes parents ?</i><br>
        Deux sujets au singulier = verbe au <b>pluriel</b> : <i>Paul et Léa <b>partent</b>.</i>`,
      exemples: [["Les élèves de la classe écoutent.", "sujet : les élèves (pluriel)"], ["Mon frère et moi partons demain.", "« moi » + un autre = nous"]],
      exercices: [
        { q: "Les enfants du voisin ___ dans le jardin.", choix: ["jouent", "joue", "jouet"], fr: "", pourquoi: "Le sujet est « les enfants » (pluriel), pas « voisin » : le verbe prend -ent." },
        { q: "Paul et Léa ___ au cinéma.", choix: ["vont", "va", "vas"], fr: "", pourquoi: "Deux sujets au singulier = un sujet pluriel : ils vont." },
        { q: "Où ___ tes parents ?", choix: ["habitent", "habite", "habites"], fr: "", pourquoi: "Le sujet « tes parents » est après le verbe, mais il est pluriel : habitent." },
        { q: "Ma sœur et moi ___ prêts.", choix: ["sommes", "sont", "est"], fr: "", pourquoi: "« Ma sœur et moi » = nous : nous sommes." },
        { q: "Les livres que tu m'as prêtés ___ passionnants.", choix: ["sont", "est", "es"], fr: "", pourquoi: "Qui est-ce qui est passionnant ? « Les livres » : pluriel, donc « sont »." },
      ] },
    { id: "accord-adjectif", niveau: 0, titre: "L'accord de l'adjectif", astuce: "L'adjectif prend le genre et le nombre du nom qu'il décrit ; avec un masculin et un féminin, il se met au masculin pluriel.",
      explication: `L'adjectif s'accorde en <b>genre</b> (masculin/féminin) et en <b>nombre</b> (singulier/pluriel) avec le nom.<br>
        Féminin : souvent <b>+e</b> (<i>grand → grande</i>), parfois plus (<i>heureux → heureuse, actif → active, bon → bonne</i>).<br>
        Pluriel : souvent <b>+s</b>, <b>-al → -aux</b> (<i>des résultats généraux</i>).<br>
        Un nom masculin + un nom féminin → adjectif au <b>masculin pluriel</b> : <i>un pull et une veste <b>noirs</b></i>.`,
      exemples: [["Des fleurs blanches", "fleur : féminin pluriel"], ["Un frère et une sœur gentils", "masculin + féminin → masculin pluriel"]],
      exercices: [
        { q: "Des chemises ___", choix: ["blanches", "blanc", "blancs"], fr: "", pourquoi: "« chemises » est féminin pluriel : blanc → blanche → blanches." },
        { q: "Une fille ___", choix: ["heureuse", "heureux", "heureuxe"], fr: "", pourquoi: "Les adjectifs en -eux font leur féminin en -euse : heureuse." },
        { q: "Des problèmes ___", choix: ["généraux", "générals", "générales"], fr: "", pourquoi: "Les adjectifs en -al font souvent leur pluriel en -aux : généraux." },
        { q: "Un pantalon et une veste ___", choix: ["noirs", "noires", "noir"], fr: "", pourquoi: "Masculin + féminin : l'adjectif se met au masculin pluriel." },
        { q: "Une idée ___", choix: ["originale", "original", "originales"], fr: "", pourquoi: "« idée » est féminin singulier : original + e = originale." },
      ] },
    { id: "present-1er", niveau: 0, titre: "Le présent des verbes", astuce: "1er groupe : -e, -es, -e, -ons, -ez, -ent. 2e groupe : -is, -is, -it, -issons, -issez, -issent.",
      explication: `<b>1er groupe</b> (-er, sauf aller) : je parl<b>e</b>, tu parl<b>es</b>, il parl<b>e</b>, nous parl<b>ons</b>, vous parl<b>ez</b>, ils parl<b>ent</b>.<br>
        <b>2e groupe</b> (-ir, nous -issons) : je fin<b>is</b>, tu fin<b>is</b>, il fin<b>it</b>, nous fin<b>issons</b>, vous fin<b>issez</b>, ils fin<b>issent</b>.<br>
        ⚠️ <i>nous mang<b>e</b>ons, nous commen<b>ç</b>ons</i> (pour garder le son). <i>Tu</i> se termine presque toujours par <b>-s</b>.`,
      exemples: [["Tu chantes bien.", "tu → -es"], ["Nous mangeons à midi.", "-ger → -geons"], ["Ils finissent tard.", "2e groupe → -issent"]],
      exercices: [
        { q: "Tu ___ (chanter) faux.", choix: ["chantes", "chante", "chantent"], fr: "", pourquoi: "Avec « tu », le verbe du 1er groupe se termine par -es." },
        { q: "Nous ___ (manger) ensemble.", choix: ["mangeons", "mangons", "mangeont"], fr: "", pourquoi: "Pour garder le son « je », on ajoute un e : mangeons." },
        { q: "Ils ___ (finir) leur travail.", choix: ["finissent", "finent", "finisent"], fr: "", pourquoi: "2e groupe à la 3e personne du pluriel : -issent." },
        { q: "Nous ___ (commencer) demain.", choix: ["commençons", "commencons", "commenssons"], fr: "", pourquoi: "Devant o, le c prend une cédille pour rester « s » : commençons." },
        { q: "Il ___ (choisir) un livre.", choix: ["choisit", "choisi", "choisie"], fr: "", pourquoi: "2e groupe, il/elle : -it. « choisi » sans t est le participe passé." },
      ] },
    { id: "ponctuation", niveau: 0, titre: "Majuscules et ponctuation", astuce: "Une phrase commence par une majuscule et finit par un point ; en français, on met une espace avant : ; ? !",
      explication: `Une phrase commence par une <b>majuscule</b> et se termine par un <b>point</b> (. ? ! …).<br>
        Majuscule aussi aux <b>noms propres</b> (<i>Paris, Léa</i>) mais pas aux jours, mois et langues (<i>lundi, janvier, le français</i>).<br>
        En français, on met une <b>espace avant</b> <b>: ; ? !</b> et dans les guillemets « … ».<br>
        Virgule : pour séparer les éléments d'une énumération (<i>du pain, du lait et des œufs</i>).`,
      exemples: [["Lundi, je vais à Lyon.", "lundi sans majuscule, Lyon avec"], ["Tu viens ?", "espace avant le point d'interrogation"]],
      exercices: [
        { q: "Laquelle est correcte ?", choix: ["Je parle français.", "Je parle Français.", "je parle français."], fr: "", pourquoi: "Les langues n'ont pas de majuscule ; la phrase, si : « Je parle français. »" },
        { q: "Laquelle est correcte ?", choix: ["Rendez-vous lundi 3 mars.", "Rendez-vous Lundi 3 Mars.", "Rendez-vous lundi 3 Mars."], fr: "", pourquoi: "Jours et mois s'écrivent sans majuscule en français." },
        { q: "Laquelle est correcte ?", choix: ["Où vas-tu ?", "Où vas-tu?", "Ou vas-tu ?"], fr: "", pourquoi: "Espace avant le point d'interrogation, et « où » de lieu prend un accent." },
        { q: "Laquelle est correcte ?", choix: ["J'ai acheté du pain, du lait et des œufs.", "J'ai acheté du pain du lait, et des œufs.", "J'ai acheté, du pain du lait et des œufs."], fr: "", pourquoi: "Dans une énumération, on sépare par des virgules, et « et » remplace la dernière virgule." },
        { q: "Laquelle est correcte ?", choix: ["Il habite à Marseille.", "Il habite à marseille.", "il habite à Marseille."], fr: "", pourquoi: "Majuscule au début de la phrase et au nom de ville." },
      ] },

    // ---------- MOYEN ----------
    { id: "passe-compose", niveau: 1, titre: "Le passé composé et l'accord avec être", astuce: "Avec être, le participe passé s'accorde avec le sujet ; avec avoir, il ne s'accorde pas avec le sujet.",
      explication: `<b>Passé composé</b> = avoir ou être au présent + <b>participe passé</b>.<br>
        Avec <b>être</b> (verbes de mouvement : aller, venir, partir, arriver, naître, mourir… et verbes pronominaux), le participe <b>s'accorde avec le sujet</b> : <i>Elles sont parti<b>es</b>.</i><br>
        Avec <b>avoir</b>, il <b>ne s'accorde pas</b> avec le sujet : <i>Elles ont mangé.</i>`,
      exemples: [["Elle est arrivée hier.", "être → accord féminin"], ["Ils ont fini leurs devoirs.", "avoir → pas d'accord avec ils"]],
      exercices: [
        { q: "Ma sœur est ___ (partir) tôt.", choix: ["partie", "parti", "partis"], fr: "", pourquoi: "Avec être, le participe s'accorde avec le sujet « ma sœur » (féminin) : partie." },
        { q: "Les filles ont ___ (chanter).", choix: ["chanté", "chantées", "chantés"], fr: "", pourquoi: "Avec avoir, pas d'accord avec le sujet : chanté." },
        { q: "Nous sommes ___ (venir) à pied. (des garçons)", choix: ["venus", "venu", "venues"], fr: "", pourquoi: "Être + sujet masculin pluriel : venus." },
        { q: "Elle s'est ___ (lever) à 7 h.", choix: ["levée", "levé", "levés"], fr: "", pourquoi: "Verbe pronominal (se lever) : accord avec le sujet « elle » : levée." },
        { q: "Ils ___ (aller) à Rome.", choix: ["sont allés", "ont allé", "sont allé"], fr: "", pourquoi: "« aller » se conjugue avec être, et accord au masculin pluriel : sont allés." },
      ] },
    { id: "e-er", niveau: 1, titre: "-é ou -er ? (participe ou infinitif)", astuce: "Remplace par « vendre / vendu » : si « vendre » marche, écris -er ; si « vendu » marche, écris -é.",
      explication: `Pour un verbe du 1er groupe qui se termine par le son « é » :<br>
        Remplace-le par un verbe du 3e groupe comme <b>vendre / vendu</b>.<br>
        • « vendre » marche → <b>infinitif -er</b> : <i>Il faut mang<b>er</b> (il faut vendre).</i><br>
        • « vendu » marche → <b>participe -é</b> : <i>J'ai mang<b>é</b> (j'ai vendu).</i><br>
        Après une préposition (à, de, pour, sans…) et après un autre verbe conjugué → <b>-er</b>.`,
      exemples: [["Je vais manger.", "je vais vendre → -er"], ["Il a terminé.", "il a vendu → -é"]],
      exercices: [
        { q: "Il faut ___ (travailler) plus.", choix: ["travailler", "travaillé", "travaillez"], fr: "", pourquoi: "« Il faut vendre » marche : c'est l'infinitif, donc -er." },
        { q: "J'ai ___ (terminer) mon rapport.", choix: ["terminé", "terminer", "terminez"], fr: "", pourquoi: "« J'ai vendu » marche : c'est le participe passé, donc -é." },
        { q: "Je viens de ___ (arriver).", choix: ["arriver", "arrivé", "arrivée"], fr: "", pourquoi: "Après la préposition « de » : infinitif -er (« je viens de vendre »)." },
        { q: "Les dossiers sont ___ (classer).", choix: ["classés", "classer", "classé"], fr: "", pourquoi: "« Ils sont vendus » marche : participe passé, accordé avec « les dossiers » : classés." },
        { q: "Elle va ___ (appeler) le client.", choix: ["appeler", "appelé", "appelée"], fr: "", pourquoi: "« Elle va vendre » marche : infinitif -er." },
      ] },
    { id: "imparfait-pc", niveau: 1, titre: "Imparfait ou passé composé ?", astuce: "L'imparfait décrit le décor ou une habitude ; le passé composé raconte une action ponctuelle et terminée.",
      explication: `<b>Imparfait</b> : description, habitude, action en cours dans le passé (le <b>décor</b>) → <i>Il <b>faisait</b> beau, je <b>lisais</b>.</i><br>
        <b>Passé composé</b> : action ponctuelle, terminée (l'<b>événement</b>) → <i>…quand le téléphone <b>a sonné</b>.</i><br>
        Terminaisons de l'imparfait : <b>-ais, -ais, -ait, -ions, -iez, -aient</b>.`,
      exemples: [["Quand j'étais petit, je jouais au foot.", "habitude → imparfait"], ["Hier, j'ai rencontré Paul.", "action unique → passé composé"]],
      exercices: [
        { q: "Quand j'étais enfant, je ___ souvent à la mer.", choix: ["allais", "suis allé", "irai"], fr: "", pourquoi: "« souvent » indique une habitude dans le passé : imparfait." },
        { q: "Je dormais quand le téléphone ___.", choix: ["a sonné", "sonnait", "sonne"], fr: "", pourquoi: "Le téléphone qui sonne est une action ponctuelle qui interrompt : passé composé." },
        { q: "Il ___ beau ce jour-là.", choix: ["faisait", "a fait", "fera"], fr: "", pourquoi: "C'est une description (le décor) : imparfait." },
        { q: "Hier, nous ___ un nouveau client.", choix: ["avons rencontré", "rencontrions", "rencontrons"], fr: "", pourquoi: "Action unique, datée et terminée : passé composé." },
        { q: "Vous ___ (finir) toujours en retard.", choix: ["finissiez", "finissez hier", "avez fini toujours"], fr: "", pourquoi: "« toujours » = habitude passée : imparfait, 2e groupe → finissiez." },
      ] },
    { id: "futur", niveau: 1, titre: "Le futur simple", astuce: "Futur = infinitif (ou radical irrégulier) + -ai, -as, -a, -ons, -ez, -ont.",
      explication: `Futur = <b>infinitif + -ai, -as, -a, -ons, -ez, -ont</b> : <i>je parler<b>ai</b>, nous finir<b>ons</b></i>.<br>
        Verbes en -re : on enlève le e → <i>je prendr<b>ai</b></i>.<br>
        Radicaux irréguliers à connaître : <b>ser</b>- (être), <b>aur</b>- (avoir), <b>ir</b>- (aller), <b>fer</b>- (faire), <b>pourr</b>-, <b>voudr</b>-, <b>viendr</b>-, <b>verr</b>-, <b>enverr</b>-.`,
      exemples: [["Demain, je serai à Lyon.", "être → ser-"], ["Nous irons au cinéma.", "aller → ir-"]],
      exercices: [
        { q: "Demain, nous ___ (être) en réunion.", choix: ["serons", "étrons", "serrons"], fr: "", pourquoi: "Le futur de « être » a un radical irrégulier : ser- → nous serons." },
        { q: "Je ___ (envoyer) le dossier lundi.", choix: ["enverrai", "envoierai", "envoyerai"], fr: "", pourquoi: "« envoyer » a un futur irrégulier : j'enverrai." },
        { q: "Tu ___ (pouvoir) venir ?", choix: ["pourras", "pouvras", "pourra"], fr: "", pourquoi: "« pouvoir » au futur : radical pourr- (deux r), tu → -as." },
        { q: "Ils ___ (prendre) le train.", choix: ["prendront", "prenderont", "prenront"], fr: "", pourquoi: "Verbe en -re : on enlève le e de l'infinitif, puis -ont : prendront." },
        { q: "Elle ___ (finir) bientôt.", choix: ["finira", "finiras", "finirai"], fr: "", pourquoi: "Infinitif « finir » + -a (il/elle) : finira." },
      ] },

    // ---------- AUTONOME ----------
    { id: "pp-avoir", niveau: 2, titre: "L'accord du participe avec avoir", astuce: "Avec avoir, le participe s'accorde avec le COD seulement si celui-ci est placé avant le verbe.",
      explication: `Avec <b>avoir</b>, le participe passé s'accorde avec le <b>complément d'objet direct (COD)</b> s'il est placé <b>avant</b> le verbe.<br>
        Pose la question <b>« quoi ? »</b> ou <b>« qui ? »</b> après le verbe.<br>
        <i>J'ai écrit <b>une lettre</b></i> (COD après → pas d'accord).<br>
        <i>La lettre <b>que</b> j'ai écrit<b>e</b></i> · <i>Je <b>l'</b>ai écrit<b>e</b></i> (COD avant → accord).`,
      exemples: [["Les fleurs que tu as achetées sont belles.", "que = les fleurs, placé avant"], ["Ces photos, je les ai prises hier.", "les = les photos, avant le verbe"]],
      exercices: [
        { q: "Les décisions que nous avons ___ sont bonnes.", choix: ["prises", "pris", "prise"], fr: "", pourquoi: "COD « que » (= les décisions, féminin pluriel) placé avant avoir : prises." },
        { q: "Elle a ___ deux lettres.", choix: ["écrit", "écrites", "écrite"], fr: "", pourquoi: "Le COD « deux lettres » est après le verbe : pas d'accord." },
        { q: "Ces clés, je les ai ___.", choix: ["trouvées", "trouvé", "trouvés"], fr: "", pourquoi: "« les » (= ces clés, féminin pluriel) est avant le verbe : trouvées." },
        { q: "Quelle robe as-tu ___ ?", choix: ["choisie", "choisi", "choisis"], fr: "", pourquoi: "Le COD « quelle robe » est avant le verbe : accord au féminin singulier." },
        { q: "Ils ont ___ toute la nuit.", choix: ["dormi", "dormis", "dormie"], fr: "", pourquoi: "Pas de COD (on ne dort pas « quelque chose ») : pas d'accord." },
      ] },
    { id: "futur-conditionnel", niveau: 2, titre: "Futur (-rai) ou conditionnel (-rais) ?", astuce: "Remplace par « nous » : « nous ferons » → futur -rai ; « nous ferions » → conditionnel -rais.",
      explication: `À la 1re personne, futur et conditionnel se prononcent presque pareil :<br>
        <b>Futur</b> : je fer<b>ai</b> (certitude, avenir) · <b>Conditionnel</b> : je fer<b>ais</b> (souhait, politesse, hypothèse).<br>
        Astuce : passe à <b>nous</b> → <i>nous ferons</i> (futur) ou <i>nous ferions</i> (conditionnel).<br>
        Après <b>si</b> + imparfait → conditionnel : <i>Si j'avais le temps, je viendr<b>ais</b>.</i>`,
      exemples: [["Je voudrais un café.", "politesse → conditionnel"], ["Demain, je partirai tôt.", "certitude → futur"]],
      exercices: [
        { q: "Si j'étais riche, je ___ le monde.", choix: ["voyagerais", "voyagerai", "voyagerait"], fr: "", pourquoi: "Après « si + imparfait », on met le conditionnel : je voyagerais (nous voyagerions)." },
        { q: "Demain, je ___ le rapport.", choix: ["terminerai", "terminerais", "terminerait"], fr: "", pourquoi: "Certitude dans l'avenir : futur → nous terminerons → je terminerai." },
        { q: "Je ___ vous poser une question.", choix: ["voudrais", "voudrai", "voudrait"], fr: "", pourquoi: "Demande polie : conditionnel → nous voudrions → je voudrais." },
        { q: "Quand j'aurai fini, je t'___.", choix: ["appellerai", "appellerais", "appelerai"], fr: "", pourquoi: "Action future certaine : futur. « appeler » double le l : appellerai." },
        { q: "J'___ aimé venir, mais j'étais malade.", choix: ["aurais", "aurai", "aurait"], fr: "", pourquoi: "Regret (hypothèse non réalisée) : conditionnel passé → j'aurais aimé." },
      ] },
    { id: "plus-que-parfait", niveau: 2, titre: "Le plus-que-parfait", astuce: "Plus-que-parfait = avoir ou être à l'imparfait + participe : une action avant une autre action passée.",
      explication: `Pour une action <b>antérieure</b> à une autre action passée : avoir/être à l'<b>imparfait</b> + participe passé.<br>
        <i>Quand je suis arrivé, le film <b>avait commencé</b>.</i> · <i>Elle <b>était</b> déjà <b>partie</b>.</i><br>
        Mêmes règles d'accord qu'au passé composé.`,
      exemples: [["Il avait oublié ses clés.", "action antérieure"], ["Nous étions déjà partis.", "être → accord"]],
      exercices: [
        { q: "Quand je suis arrivé, ils ___ déjà mangé.", choix: ["avaient", "ont", "auront"], fr: "", pourquoi: "Action antérieure à « je suis arrivé » : plus-que-parfait (avaient mangé)." },
        { q: "Elle ___ partie avant nous.", choix: ["était", "avait", "est"], fr: "", pourquoi: "« partir » se conjugue avec être : elle était partie." },
        { q: "Il pensait que tu ___ oublié.", choix: ["avais", "as", "auras"], fr: "", pourquoi: "Dans le passé, l'action antérieure (oublier) se met au plus-que-parfait." },
        { q: "Nous ___ jamais vu la mer avant.", choix: ["n'avions", "n'avons", "n'aurions"], fr: "", pourquoi: "Avant un moment passé : plus-que-parfait, avec « ne … jamais »." },
        { q: "Les lettres qu'il avait ___ sont perdues.", choix: ["écrites", "écrit", "écrits"], fr: "", pourquoi: "COD « que » (= les lettres) avant avoir : accord au féminin pluriel." },
      ] },

    // ---------- AVANCÉ ----------
    { id: "subjonctif", niveau: 3, titre: "Le subjonctif présent", astuce: "Après il faut que, bien que, pour que, avant que, vouloir que : subjonctif.",
      explication: `Le subjonctif exprime le <b>souhait, l'obligation, le doute, l'émotion</b>.<br>
        Après : <b>il faut que, je veux que, bien que, pour que, avant que, à condition que, je doute que</b>…<br>
        Formation : radical de <i>ils</i> au présent + <b>-e, -es, -e, -ions, -iez, -ent</b> (<i>ils finissent → que je finisse</i>).<br>
        Irréguliers : <i>que je sois, que j'aie, que j'aille, que je fasse, que je puisse, que je sache, que je veuille</i>.<br>
        ⚠️ <b>après que</b> + indicatif : <i>après qu'il <b>est</b> parti</i>.`,
      exemples: [["Il faut que tu viennes.", "il faut que + subjonctif"], ["Bien qu'il soit tard, je reste.", "bien que + subjonctif"]],
      exercices: [
        { q: "Il faut que tu ___ (faire) attention.", choix: ["fasses", "fais", "feras"], fr: "", pourquoi: "« il faut que » est suivi du subjonctif : que tu fasses." },
        { q: "Bien qu'il ___ (être) malade, il travaille.", choix: ["soit", "est", "sera"], fr: "", pourquoi: "« bien que » exige le subjonctif : qu'il soit." },
        { q: "Je veux que vous ___ (finir) ce soir.", choix: ["finissiez", "finissez", "finirez"], fr: "", pourquoi: "Volonté (« je veux que ») → subjonctif : que vous finissiez." },
        { q: "Après qu'il ___ parti, nous avons fermé.", choix: ["est", "soit", "fût"], fr: "", pourquoi: "« après que » est suivi de l'indicatif (le fait est réel) : est parti." },
        { q: "Pour que tu ___ (pouvoir) venir, je t'attends.", choix: ["puisses", "peux", "pourras"], fr: "", pourquoi: "« pour que » (but) → subjonctif : que tu puisses." },
      ] },
    { id: "concordance", niveau: 3, titre: "La concordance des temps", astuce: "Si le verbe principal est au passé, le présent devient imparfait et le futur devient conditionnel.",
      explication: `Quand la phrase principale est au <b>passé</b>, les temps de la subordonnée changent :<br>
        présent → <b>imparfait</b> · passé composé → <b>plus-que-parfait</b> · futur → <b>conditionnel</b>.<br>
        <i>Il dit qu'il <b>viendra</b>.</i> → <i>Il a dit qu'il <b>viendrait</b>.</i><br>
        <i>Elle pense qu'il <b>a menti</b>.</i> → <i>Elle pensait qu'il <b>avait menti</b>.</i>`,
      exemples: [["Il m'a dit qu'il était fatigué.", "présent → imparfait"], ["Je savais qu'elle réussirait.", "futur → conditionnel"]],
      exercices: [
        { q: "Il a dit qu'il ___ demain.", choix: ["viendrait", "viendra", "vient"], fr: "", pourquoi: "Principale au passé (« a dit ») : le futur devient conditionnel → viendrait." },
        { q: "Je pensais que tu ___ malade.", choix: ["étais", "es", "seras"], fr: "", pourquoi: "Principale au passé : le présent devient imparfait → étais." },
        { q: "Elle croyait qu'il ___ déjà parti.", choix: ["était", "est", "sera"], fr: "", pourquoi: "Action antérieure dans le passé : plus-que-parfait → était parti." },
        { q: "Ils savaient que nous ___.", choix: ["gagnerions", "gagnerons", "gagnons"], fr: "", pourquoi: "Futur dans le passé → conditionnel : gagnerions." },
        { q: "Il dit qu'il ___ fatigué.", choix: ["est", "était hier", "serait été"], fr: "", pourquoi: "Principale au présent (« il dit ») : pas de changement → est." },
      ] },
    { id: "participe-adjectif", niveau: 3, titre: "Participe présent ou adjectif verbal ?", astuce: "Participe présent = action, invariable, en -ant ; adjectif verbal = qualité, accordé, parfois en -ent ou -cant/-gant.",
      explication: `<b>Participe présent</b> (action, souvent suivi d'un complément) : <b>invariable</b>, toujours en <b>-ant</b> → <i>des enfants <b>fatiguant</b> leurs parents</i>.<br>
        <b>Adjectif verbal</b> (qualité) : <b>s'accorde</b>, et parfois change d'orthographe →<br>
        fatigant, négligent, différent, convaincant, communicant, précédent, excellent, provocant.<br>
        <i>Un travail <b>fatigant</b></i> mais <i>en <b>fatiguant</b> tout le monde</i>.`,
      exemples: [["Une journée fatigante", "adjectif verbal : qualité, accordé"], ["Négligeant ses devoirs, il a échoué.", "participe : action, invariable"]],
      exercices: [
        { q: "C'est un argument très ___.", choix: ["convaincant", "convainquant", "convainquants"], fr: "", pourquoi: "Qualité de l'argument → adjectif verbal, qui s'écrit -cant : convaincant." },
        { q: "___ ses collègues, il a pris la parole.", choix: ["Provoquant", "Provocant", "Provocants"], fr: "", pourquoi: "Action (avec un complément « ses collègues ») → participe présent invariable : provoquant." },
        { q: "Ce sont des personnes ___.", choix: ["négligentes", "négligeantes", "négligeant"], fr: "", pourquoi: "Qualité → adjectif verbal « négligent », accordé au féminin pluriel." },
        { q: "Un métier ___.", choix: ["fatigant", "fatiguant", "fatiguants"], fr: "", pourquoi: "Qualité → adjectif verbal sans u : fatigant." },
        { q: "Les jours ___ la réunion, il a révisé.", choix: ["précédant", "précédents", "précédent"], fr: "", pourquoi: "Action avec complément (« la réunion ») → participe présent : précédant." },
      ] },
    { id: "couleurs", niveau: 3, titre: "L'accord des adjectifs de couleur", astuce: "Couleur simple : accordée ; couleur venant d'un nom (marron, orange) ou composée (bleu clair) : invariable.",
      explication: `Adjectif de couleur <b>simple</b> : il s'accorde → <i>des chemises <b>vertes</b></i>.<br>
        Couleur venant d'un <b>nom</b> (marron, orange, cerise, ébène…) : <b>invariable</b> → <i>des yeux <b>marron</b></i>.<br>
        Exceptions accordées : <b>rose, mauve, fauve, pourpre, écarlate</b>.<br>
        Couleur <b>composée</b> : <b>invariable</b> → <i>des robes <b>bleu clair</b></i>, <i>des yeux <b>vert foncé</b></i>.`,
      exemples: [["Des chaussures noires", "simple → accord"], ["Des pulls orange", "nom de fruit → invariable"]],
      exercices: [
        { q: "Des yeux ___", choix: ["marron", "marrons", "marronnes"], fr: "", pourquoi: "« marron » vient d'un nom (le fruit) : invariable." },
        { q: "Des robes ___ (bleu foncé)", choix: ["bleu foncé", "bleues foncées", "bleus foncés"], fr: "", pourquoi: "Couleur composée de deux mots : invariable." },
        { q: "Des joues ___", choix: ["roses", "rose", "rosé"], fr: "", pourquoi: "« rose » est une exception : bien qu'issu d'un nom, il s'accorde." },
        { q: "Des voitures ___", choix: ["blanches", "blanc", "blanche"], fr: "", pourquoi: "Couleur simple : accord au féminin pluriel." },
        { q: "Des t-shirts ___", choix: ["orange", "oranges", "orangés"], fr: "", pourquoi: "« orange » vient du nom du fruit : invariable." },
      ] },

    // ---------- PRO ----------
    { id: "passe-simple", niveau: 4, titre: "Le passé simple (le reconnaître et l'écrire)", astuce: "1er groupe : -ai, -as, -a, -âmes, -âtes, -èrent ; il parla (sans t). 2e et 3e groupes : souvent -is, -it.",
      explication: `Temps du <b>récit écrit</b> (romans, articles, discours).<br>
        <b>1er groupe</b> : -ai, -as, -<b>a</b>, -âmes, -âtes, -èrent → <i>il parl<b>a</b></i> (pas de t !).<br>
        <b>2e groupe</b> et beaucoup du 3e : -is, -is, -it, -îmes, -îtes, -irent → <i>il fin<b>it</b>, il pr<b>it</b></i>.<br>
        Autres : <i>il fut, il eut, il put, il sut, il vint, il fit, il dut</i>.<br>
        ⚠️ Ne pas confondre <i>je parlai</i> (passé simple) et <i>je parlais</i> (imparfait).`,
      exemples: [["Il entra et s'assit.", "entrer → entra ; s'asseoir → s'assit"], ["Ils furent surpris.", "être → furent"]],
      exercices: [
        { q: "Soudain, il ___ (crier).", choix: ["cria", "criat", "crie"], fr: "", pourquoi: "1er groupe au passé simple, il/elle : -a, sans t → cria." },
        { q: "Ils ___ (finir) leur travail.", choix: ["finirent", "finissèrent", "finirents"], fr: "", pourquoi: "2e groupe, ils : -irent → finirent." },
        { q: "Elle ___ (prendre) son manteau.", choix: ["prit", "prenda", "prenait hier"], fr: "", pourquoi: "« prendre » au passé simple : il/elle prit." },
        { q: "Nous ___ (être) ravis.", choix: ["fûmes", "fumes", "étâmes"], fr: "", pourquoi: "« être » : nous fûmes (accent circonflexe aux 1re et 2e personnes du pluriel)." },
        { q: "Hier, je ___ (parler) à mon chef. (passé simple)", choix: ["parlai", "parlais", "parlas"], fr: "", pourquoi: "Passé simple, je : -ai (je parlai). « parlais » est l'imparfait." },
      ] },
    { id: "pronominaux", niveau: 4, titre: "L'accord des verbes pronominaux", astuce: "Pronominal : accord avec le sujet, sauf si le pronom se est COI (se parler, se téléphoner) ou si le COD est après le verbe.",
      explication: `En général, le participe d'un verbe pronominal s'accorde avec le <b>sujet</b> : <i>Elles se sont <b>levées</b>.</i><br>
        Mais <b>pas d'accord</b> quand <b>se</b> est un complément indirect (se parler, se téléphoner, se succéder, se plaire, se sourire…) : <i>Elles se sont <b>parlé</b>.</i> (parler <i>à</i> quelqu'un)<br>
        Et <b>pas d'accord</b> si un COD suit le verbe : <i>Elle s'est lavé <b>les mains</b>.</i> — mais <i>les mains qu'elle s'est lavé<b>es</b></i>.`,
      exemples: [["Ils se sont téléphoné.", "téléphoner à → pas d'accord"], ["Elle s'est coupé le doigt.", "COD après → pas d'accord"]],
      exercices: [
        { q: "Elles se sont ___ (rencontrer) à Paris.", choix: ["rencontrées", "rencontré", "rencontrés"], fr: "", pourquoi: "On rencontre quelqu'un (se = COD) : accord avec le sujet « elles »." },
        { q: "Ils se sont ___ (parler) longtemps.", choix: ["parlé", "parlés", "parlée"], fr: "", pourquoi: "On parle à quelqu'un : se est complément indirect → pas d'accord." },
        { q: "Elle s'est ___ (laver) les mains.", choix: ["lavé", "lavée", "lavés"], fr: "", pourquoi: "Le COD « les mains » est après le verbe : pas d'accord." },
        { q: "Les années se sont ___ (succéder).", choix: ["succédé", "succédées", "succédés"], fr: "", pourquoi: "On succède à quelque chose : se est indirect → participe invariable." },
        { q: "Nous nous sommes ___ (lever) tôt. (Léa et Emma)", choix: ["levées", "levé", "levés"], fr: "", pourquoi: "Se lever : accord avec le sujet, ici féminin pluriel." },
      ] },
    { id: "typographie", niveau: 4, titre: "Typographie et ponctuation pro", astuce: "En français : espace avant : ; ? ! et entre guillemets « » ; pas d'espace avant la virgule et le point.",
      explication: `Règles françaises :<br>
        <b>Espace avant</b> les signes doubles <b>: ; ? !</b> et à l'intérieur des guillemets <b>« … »</b>.<br>
        <b>Pas d'espace avant</b> la virgule et le point.<br>
        Nombres : <b>1 000 €</b> (espace pour les milliers, le symbole après) · heures : <b>14 h 30</b> · pourcentages : <b>20 %</b>.<br>
        Abréviations : <b>M.</b> (Monsieur), <b>Mme</b>, <b>Mlle</b>, <b>n°</b>, <b>etc.</b> (jamais « etc… »).`,
      exemples: [["Le prix est de 1 500 €.", "espace des milliers, € après"], ["Rendez-vous à 9 h 30 avec M. Dupont.", "M. = Monsieur"]],
      exercices: [
        { q: "Laquelle est correcte ?", choix: ["Le budget est de 2 000 €.", "Le budget est de €2,000.", "Le budget est de 2.000€."], fr: "", pourquoi: "En français : espace pour les milliers et symbole € après le nombre, séparé par une espace." },
        { q: "Laquelle est correcte ?", choix: ["Bonjour M. Martin,", "Bonjour Mr Martin,", "Bonjour Mr. Martin,"], fr: "", pourquoi: "L'abréviation française de Monsieur est « M. » (Mr est anglais)." },
        { q: "Laquelle est correcte ?", choix: ["Réunion à 14 h 30.", "Réunion à 14h30.", "Réunion à 2 pm 30."], fr: "", pourquoi: "En typographie soignée : espace avant et après h (14 h 30)." },
        { q: "Laquelle est correcte ?", choix: ["Du papier, des stylos, etc.", "Du papier, des stylos, etc…", "Du papier, des stylos etc …"], fr: "", pourquoi: "« etc. » se termine par un seul point, jamais suivi de points de suspension." },
        { q: "Laquelle est correcte ?", choix: ["Il a dit : « Je viens. »", "Il a dit: «Je viens.»", "Il a dit : \"Je viens\"."], fr: "", pourquoi: "Espace avant les deux-points et à l'intérieur des guillemets français « »." },
      ] },
    { id: "discours-indirect", niveau: 4, titre: "Le discours indirect", astuce: "Au discours indirect : pas de guillemets, on change les pronoms et, si on est au passé, les temps.",
      explication: `Discours direct : <i>Il dit : « Je suis prêt. »</i> → indirect : <i>Il dit <b>qu'il est</b> prêt.</i><br>
        On change les <b>pronoms</b> (je → il), les <b>repères</b> (demain → le lendemain, ici → là) et, au passé, les <b>temps</b> (concordance).<br>
        Question : <i>« Viens-tu ? »</i> → <i>Il demande <b>si</b> tu viens.</i> · <i>« Où vas-tu ? »</i> → <i>Il demande <b>où</b> tu vas.</i> (pas d'inversion)<br>
        Ordre : <i>« Viens ! »</i> → <i>Il me dit <b>de venir</b>.</i>`,
      exemples: [["Elle a dit qu'elle viendrait le lendemain.", "demain → le lendemain"], ["Il m'a demandé si j'étais libre.", "question oui/non → si"]],
      exercices: [
        { q: "« Je viendrai demain. » → Il a dit qu'il viendrait ___.", choix: ["le lendemain", "demain", "hier"], fr: "", pourquoi: "Au passé, « demain » devient « le lendemain »." },
        { q: "« Es-tu prêt ? » → Elle m'a demandé ___ j'étais prêt.", choix: ["si", "que", "est-ce que"], fr: "", pourquoi: "Question fermée (oui/non) au discours indirect : on introduit par « si »." },
        { q: "« Ferme la porte ! » → Il m'a dit ___ la porte.", choix: ["de fermer", "que fermer", "ferme"], fr: "", pourquoi: "Un ordre devient « dire de + infinitif »." },
        { q: "« Où travailles-tu ? » → Il m'a demandé où ___.", choix: ["je travaillais", "travaillais-je", "est-ce que je travaille"], fr: "", pourquoi: "Pas d'inversion au discours indirect, et concordance au passé : je travaillais." },
        { q: "« J'ai fini. » → Elle a dit qu'elle ___ fini.", choix: ["avait", "a", "aura"], fr: "", pourquoi: "Passé composé dans une phrase au passé → plus-que-parfait : avait fini." },
      ] },

    // ---------- EXPERT ----------
    { id: "pp-infinitif", niveau: 5, titre: "Participe passé suivi d'un infinitif", astuce: "« fait » + infinitif est toujours invariable ; « laissé » aussi (réforme 1990) ; sinon, accord si le COD fait l'action.",
      explication: `Participe avec <b>avoir</b> suivi d'un <b>infinitif</b> :<br>
        • Accord si le COD placé avant <b>fait l'action</b> de l'infinitif : <i>Les musiciens que j'ai <b>entendus</b> jouer</i> (ce sont eux qui jouent).<br>
        • Pas d'accord si le COD <b>subit</b> l'action : <i>Les airs que j'ai <b>entendu</b> jouer</i> (les airs sont joués).<br>
        • <b>fait</b> + infinitif : toujours <b>invariable</b> → <i>Elle s'est <b>fait</b> couper les cheveux.</i> · <b>laissé</b> : invariable (rectifications de 1990).`,
      exemples: [["La maison qu'il a fait construire", "fait + infinitif → invariable"], ["Les enfants que j'ai vus courir", "les enfants courent → accord"]],
      exercices: [
        { q: "Les robes qu'elle s'est ___ faire.", choix: ["fait", "faites", "faite"], fr: "", pourquoi: "« fait » suivi d'un infinitif est toujours invariable." },
        { q: "Les chanteuses que j'ai ___ chanter étaient excellentes.", choix: ["entendues", "entendu", "entendus"], fr: "", pourquoi: "Ce sont les chanteuses qui chantent (elles font l'action) : accord avec le COD « que »." },
        { q: "Les chansons que j'ai ___ chanter étaient belles.", choix: ["entendu", "entendues", "entendus"], fr: "", pourquoi: "Les chansons ne chantent pas, elles sont chantées : pas d'accord." },
        { q: "Elle s'est ___ convaincre.", choix: ["laissé", "laissée", "laissés"], fr: "", pourquoi: "Depuis les rectifications de 1990, « laissé » suivi d'un infinitif est invariable." },
        { q: "La voiture qu'il a ___ réparer", choix: ["fait", "faite", "faits"], fr: "", pourquoi: "« fait » + infinitif : toujours invariable." },
      ] },
    { id: "nombres-collectifs", niveau: 5, titre: "Accords délicats : nombres et collectifs", astuce: "Vingt et cent prennent un s s'ils sont multipliés et non suivis d'un autre nombre ; mille est invariable.",
      explication: `<b>vingt</b> et <b>cent</b> prennent un <b>s</b> s'ils sont multipliés et <b>terminent</b> le nombre : <i>quatre-vingt<b>s</b>, deux cent<b>s</b></i> mais <i>quatre-vingt-deux, deux cent trois</i>. <b>mille</b> est <b>invariable</b>.<br>
        Rectifications de 1990 : traits d'union entre tous les éléments (<i>deux-cent-trois</i>), admis.<br>
        <b>La plupart</b> + nom pluriel → verbe au <b>pluriel</b> : <i>La plupart des gens <b>pensent</b>…</i><br>
        <b>Un groupe de</b>, <b>une foule de</b> : accord selon le sens (le groupe ou ses membres).`,
      exemples: [["Trois cents euros", "cent multiplié, en fin de nombre"], ["La plupart des salariés sont satisfaits.", "la plupart → pluriel"]],
      exercices: [
        { q: "Le billet coûte quatre-___ euros.", choix: ["vingts", "vingt", "vingtes"], fr: "", pourquoi: "« vingt » est multiplié (4 × 20) et termine le nombre : quatre-vingts." },
        { q: "Il y a deux ___ dix personnes.", choix: ["cent", "cents", "centes"], fr: "", pourquoi: "« cent » est suivi d'un autre nombre (dix) : pas de s." },
        { q: "Trois ___ euros", choix: ["mille", "milles", "mils"], fr: "", pourquoi: "« mille » est toujours invariable." },
        { q: "La plupart des clients ___ satisfaits.", choix: ["sont", "est", "soit"], fr: "", pourquoi: "Avec « la plupart des + nom pluriel », le verbe se met au pluriel." },
        { q: "Mille deux ___ ans", choix: ["cents", "cent", "cent-s"], fr: "", pourquoi: "« cent » est multiplié (2 × 100) et termine le nombre : deux cents." },
      ] },
    { id: "ne-expletif", niveau: 5, titre: "Le ne explétif et la négation soignée", astuce: "Après avant que, à moins que, craindre que, plus… que, on peut mettre un « ne » qui n'est pas une négation.",
      explication: `Le <b>ne explétif</b> n'a <b>pas de sens négatif</b> ; il marque un registre soutenu :<br>
        <i>Je crains qu'il <b>ne</b> pleuve</i> (= j'ai peur qu'il pleuve) · <i>Avant qu'il <b>ne</b> parte</i> · <i>À moins qu'il <b>ne</b> refuse</i> · <i>Il est plus fort que je <b>ne</b> pensais</i>.<br>
        ⚠️ À l'écrit, la négation complète a deux éléments : <i>Je <b>ne</b> sais <b>pas</b></i> (on n'oublie pas le ne).<br>
        <b>On n'</b> : <i>On <b>n'</b>a rien vu</i> (on entend la liaison, mais il faut écrire n').`,
      exemples: [["Partez avant qu'il ne soit trop tard.", "ne explétif, soutenu"], ["On n'a pas fini.", "on n' + verbe à voyelle"]],
      exercices: [
        { q: "Laquelle est correcte ?", choix: ["On n'a pas le temps.", "On a pas le temps.", "On n'as pas le temps."], fr: "", pourquoi: "La négation demande « ne … pas » : devant une voyelle, on écrit « on n'a »." },
        { q: "Je crains qu'il ___ soit trop tard. (soutenu)", choix: ["ne", "n'est", "non"], fr: "", pourquoi: "Après « craindre que », le registre soutenu ajoute un « ne » explétif, sans sens négatif." },
        { q: "Il est plus compétent qu'on ___ le pense.", choix: ["ne", "n'", "pas"], fr: "", pourquoi: "Après un comparatif d'inégalité, le ne explétif est possible : qu'on ne le pense." },
        { q: "Laquelle est correcte à l'écrit ?", choix: ["Je ne sais pas.", "Je sais pas.", "J'sais pas."], fr: "", pourquoi: "À l'écrit, la négation garde ses deux parties : ne … pas." },
        { q: "Partons avant qu'il ___ pleuve.", choix: ["ne", "n'y", "non"], fr: "", pourquoi: "Après « avant que », on peut ajouter un ne explétif (registre soutenu)." },
      ] },
    { id: "style-pro", niveau: 5, titre: "Écrire clairement : style professionnel", astuce: "Une idée par phrase, des verbes précis, pas de pléonasme ni d'anglicisme inutile, des connecteurs logiques.",
      explication: `Un bon écrit professionnel est <b>clair, précis et concis</b> :<br>
        • <b>Une idée par phrase</b> (20 à 25 mots maximum).<br>
        • <b>Verbes précis</b> plutôt que « faire, mettre, avoir » : <i>réaliser une étude, rédiger un rapport</i>.<br>
        • <b>Connecteurs logiques</b> : en effet, cependant, par conséquent, en outre, ainsi.<br>
        • Éviter pléonasmes, anglicismes et tournures fautives (« au niveau de », « suite à »).`,
      exemples: [["Par conséquent, nous reportons la réunion.", "connecteur de conséquence"], ["Nous avons rédigé un rapport détaillé.", "verbe précis"]],
      exercices: [
        { q: "Laquelle est la plus professionnelle ?", choix: ["Nous avons analysé les résultats.", "On a fait l'analyse des résultats au niveau des chiffres.", "On a checké les résultats."], fr: "", pourquoi: "Verbe précis (analyser), sans « au niveau de » ni anglicisme (checker)." },
        { q: "Les ventes ont baissé ; ___, nous ajustons le budget.", choix: ["par conséquent", "cependant", "en outre"], fr: "", pourquoi: "On exprime une conséquence : « par conséquent »." },
        { q: "Laquelle est correcte ?", choix: ["À la suite de votre demande, voici le devis.", "Suite à votre demande, voici le devis.", "Suite de votre demande, voici le devis."], fr: "", pourquoi: "« À la suite de » est la forme recommandée ; « suite à » est critiqué dans un écrit soigné." },
        { q: "Le projet est rentable ; ___, il est risqué.", choix: ["cependant", "par conséquent", "ainsi"], fr: "", pourquoi: "On oppose deux idées : « cependant »." },
        { q: "Laquelle évite le pléonasme ?", choix: ["Nous nous réunirons lundi.", "Nous nous réunirons ensemble lundi.", "Nous nous réunirons tous ensemble lundi."], fr: "", pourquoi: "« Se réunir » contient déjà l'idée d'« ensemble » : c'est un pléonasme." },
      ] },
  ],
};
