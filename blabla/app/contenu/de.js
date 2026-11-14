// Contenu ALLEMAND de Jack Blabla.
// niveau : 0 = Amateur, 1 = Moyen, 2 = Autonome
// Exercices : le PREMIER choix est toujours la bonne réponse (ils sont mélangés à l'affichage).

CONTENU.de = {
  pronoms: ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"],
  pronomsFr: ["je", "tu", "il/elle", "nous", "vous", "ils/elles/Vous"],

  temps: [
    { id: "praesens", nom: "Présent (Präsens)", niveau: 0 },
    { id: "perfekt", nom: "Passé composé (Perfekt)", niveau: 1 },
    { id: "futur", nom: "Futur (Futur I)", niveau: 1 },
    { id: "praeteritum", nom: "Prétérit (Präteritum)", niveau: 2 },
  ],

  // du / er : formes irrégulières du présent (changement de voyelle)
  // prat : forme du prétérit à la 1re personne (si le verbe est fort ou mixte)
  // participe : participe passé · aux : "sein" si le Perfekt se fait avec sein
  verbes: [
    { inf: "sein", fr: "être", niveau: 0, irregulier: true, prat: "war", participe: "gewesen", aux: "sein",
      formes: { praesens: ["bin", "bist", "ist", "sind", "seid", "sind"] } },
    { inf: "haben", fr: "avoir", niveau: 0, irregulier: true, prat: "hatte", participe: "gehabt",
      formes: { praesens: ["habe", "hast", "hat", "haben", "habt", "haben"] } },
    { inf: "machen", fr: "faire", niveau: 0, participe: "gemacht" },
    { inf: "wohnen", fr: "habiter", niveau: 0, participe: "gewohnt" },
    { inf: "spielen", fr: "jouer", niveau: 0, participe: "gespielt" },
    { inf: "lernen", fr: "apprendre", niveau: 0, participe: "gelernt" },
    { inf: "arbeiten", fr: "travailler", niveau: 0, participe: "gearbeitet" },
    { inf: "heißen", fr: "s'appeler", niveau: 0, irregulier: true, prat: "hieß", participe: "geheißen" },
    { inf: "gehen", fr: "aller (à pied)", niveau: 0, irregulier: true, prat: "ging", participe: "gegangen", aux: "sein" },
    { inf: "kommen", fr: "venir", niveau: 0, irregulier: true, prat: "kam", participe: "gekommen", aux: "sein" },
    { inf: "fahren", fr: "aller (en véhicule)", niveau: 0, irregulier: true, du: "fährst", er: "fährt", prat: "fuhr", participe: "gefahren", aux: "sein" },
    { inf: "essen", fr: "manger", niveau: 0, irregulier: true, du: "isst", er: "isst", prat: "aß", participe: "gegessen" },
    { inf: "können", fr: "pouvoir", niveau: 1, irregulier: true, prat: "konnte", participe: "gekonnt",
      formes: { praesens: ["kann", "kannst", "kann", "können", "könnt", "können"] } },
    { inf: "müssen", fr: "devoir", niveau: 1, irregulier: true, prat: "musste", participe: "gemusst",
      formes: { praesens: ["muss", "musst", "muss", "müssen", "müsst", "müssen"] } },
    { inf: "wollen", fr: "vouloir", niveau: 1, irregulier: true, prat: "wollte", participe: "gewollt",
      formes: { praesens: ["will", "willst", "will", "wollen", "wollt", "wollen"] } },
    { inf: "sehen", fr: "voir", niveau: 1, irregulier: true, du: "siehst", er: "sieht", prat: "sah", participe: "gesehen" },
    { inf: "sprechen", fr: "parler", niveau: 1, irregulier: true, du: "sprichst", er: "spricht", prat: "sprach", participe: "gesprochen" },
    { inf: "nehmen", fr: "prendre", niveau: 1, irregulier: true, du: "nimmst", er: "nimmt", prat: "nahm", participe: "genommen" },
    { inf: "trinken", fr: "boire", niveau: 1, irregulier: true, prat: "trank", participe: "getrunken" },
    { inf: "schlafen", fr: "dormir", niveau: 1, irregulier: true, du: "schläfst", er: "schläft", prat: "schlief", participe: "geschlafen" },
    { inf: "lesen", fr: "lire", niveau: 1, irregulier: true, du: "liest", er: "liest", prat: "las", participe: "gelesen" },
    { inf: "kaufen", fr: "acheter", niveau: 1, participe: "gekauft" },
    { inf: "werden", fr: "devenir", niveau: 2, irregulier: true, prat: "wurde", participe: "geworden", aux: "sein",
      formes: { praesens: ["werde", "wirst", "wird", "werden", "werdet", "werden"] } },
    { inf: "wissen", fr: "savoir", niveau: 2, irregulier: true, prat: "wusste", participe: "gewusst",
      formes: { praesens: ["weiß", "weißt", "weiß", "wissen", "wisst", "wissen"] } },
    { inf: "geben", fr: "donner", niveau: 2, irregulier: true, du: "gibst", er: "gibt", prat: "gab", participe: "gegeben" },
    { inf: "schreiben", fr: "écrire", niveau: 2, irregulier: true, prat: "schrieb", participe: "geschrieben" },
    { inf: "finden", fr: "trouver", niveau: 2, irregulier: true, prat: "fand", participe: "gefunden" },
    { inf: "bleiben", fr: "rester", niveau: 2, irregulier: true, prat: "blieb", participe: "geblieben", aux: "sein" },
    { inf: "denken", fr: "penser", niveau: 2, irregulier: true, prat: "dachte", participe: "gedacht" },
    { inf: "studieren", fr: "étudier", niveau: 2, participe: "studiert" },
  ],

  irreguliers: {
    colonnes: ["Infinitif", "Présent (er)", "Prétérit", "Passé composé"],
    lignes: [
      // [infinitif, présent er, prétérit, Perfekt, français, niveau]
      ["sein", "ist", "war", "ist gewesen", "être", 0], ["haben", "hat", "hatte", "hat gehabt", "avoir", 0],
      ["gehen", "geht", "ging", "ist gegangen", "aller", 0], ["kommen", "kommt", "kam", "ist gekommen", "venir", 0],
      ["fahren", "fährt", "fuhr", "ist gefahren", "aller (véhicule)", 0], ["essen", "isst", "aß", "hat gegessen", "manger", 0],
      ["trinken", "trinkt", "trank", "hat getrunken", "boire", 0], ["sehen", "sieht", "sah", "hat gesehen", "voir", 0],
      ["sprechen", "spricht", "sprach", "hat gesprochen", "parler", 0], ["schlafen", "schläft", "schlief", "hat geschlafen", "dormir", 0],
      ["werden", "wird", "wurde", "ist geworden", "devenir", 1], ["nehmen", "nimmt", "nahm", "hat genommen", "prendre", 1],
      ["geben", "gibt", "gab", "hat gegeben", "donner", 1], ["lesen", "liest", "las", "hat gelesen", "lire", 1],
      ["schreiben", "schreibt", "schrieb", "hat geschrieben", "écrire", 1], ["finden", "findet", "fand", "hat gefunden", "trouver", 1],
      ["bleiben", "bleibt", "blieb", "ist geblieben", "rester", 1], ["laufen", "läuft", "lief", "ist gelaufen", "courir, marcher", 1],
      ["helfen", "hilft", "half", "hat geholfen", "aider", 1], ["wissen", "weiß", "wusste", "hat gewusst", "savoir", 1],
      ["denken", "denkt", "dachte", "hat gedacht", "penser", 1], ["bringen", "bringt", "brachte", "hat gebracht", "apporter", 1],
      ["vergessen", "vergisst", "vergaß", "hat vergessen", "oublier", 2], ["verstehen", "versteht", "verstand", "hat verstanden", "comprendre", 2],
      ["kennen", "kennt", "kannte", "hat gekannt", "connaître", 2], ["beginnen", "beginnt", "begann", "hat begonnen", "commencer", 2],
      ["treffen", "trifft", "traf", "hat getroffen", "rencontrer", 2], ["tragen", "trägt", "trug", "hat getragen", "porter", 2],
      ["fallen", "fällt", "fiel", "ist gefallen", "tomber", 2], ["sitzen", "sitzt", "saß", "hat gesessen", "être assis", 2],
      ["stehen", "steht", "stand", "hat gestanden", "être debout", 2], ["sterben", "stirbt", "starb", "ist gestorben", "mourir", 2],
      ["gewinnen", "gewinnt", "gewann", "hat gewonnen", "gagner", 2], ["liegen", "liegt", "lag", "hat gelegen", "être couché", 2],
    ],
  },

  themes: [
    // ---------- AMATEUR ----------
    { id: "salut", niveau: 0, titre: "Dire bonjour", emoji: "👋",
      mots: [["Bonjour", "Guten Tag"], ["Salut", "Hallo"], ["Au revoir", "Auf Wiedersehen"], ["Salut (pour partir)", "Tschüss"], ["Merci", "Danke"],
        ["S'il vous plaît", "Bitte"], ["Oui", "Ja"], ["Non", "Nein"], ["Comment ça va ?", "Wie geht's?"], ["Ça va bien", "Mir geht's gut"]],
      dialogue: [
        { who: "jack", txt: "Hallo! Wie geht's?", fr: "Salut ! Comment ça va ?" },
        { who: "toi", choices: ["Mir geht's gut, danke!", "Auf Wiedersehen!", "Wo ist der Bahnhof?"], fr: "Ça va bien, merci !" },
        { who: "jack", txt: "Super! Tschüss!", fr: "Super ! Salut !" },
        { who: "toi", choices: ["Tschüss!", "Einen Kaffee, bitte", "Ja"], fr: "Salut ! (au revoir)" },
      ] },
    { id: "moi", niveau: 0, titre: "Se présenter", emoji: "🙋",
      mots: [["Je m'appelle…", "Ich heiße…"], ["J'ai … ans", "Ich bin … Jahre alt"], ["Je suis français", "Ich bin Franzose"],
        ["J'habite à Paris", "Ich wohne in Paris"], ["Enchanté", "Freut mich"], ["Et toi ?", "Und du?"], ["Je parle un peu allemand", "Ich spreche ein bisschen Deutsch"]],
      dialogue: [
        { who: "jack", txt: "Hallo! Ich heiße Jack. Wie heißt du?", fr: "Salut ! Je m'appelle Jack. Comment tu t'appelles ?" },
        { who: "toi", choices: ["Ich heiße Léa.", "Ich habe mich verlaufen.", "Die Rechnung"], fr: "Je m'appelle Léa." },
        { who: "jack", txt: "Freut mich! Wo wohnst du?", fr: "Enchanté ! Où habites-tu ?" },
        { who: "toi", choices: ["Ich wohne in Paris.", "Danke", "Geradeaus"], fr: "J'habite à Paris." },
      ] },
    { id: "chiffres", niveau: 0, titre: "Les chiffres", emoji: "🔢",
      mots: [["un", "eins"], ["deux", "zwei"], ["trois", "drei"], ["quatre", "vier"], ["cinq", "fünf"], ["six", "sechs"],
        ["sept", "sieben"], ["huit", "acht"], ["neuf", "neun"], ["dix", "zehn"], ["vingt", "zwanzig"], ["cent", "hundert"]],
      dialogue: [
        { who: "jack", txt: "Wie alt bist du?", fr: "Quel âge as-tu ?" },
        { who: "toi", choices: ["Ich bin zwanzig Jahre alt.", "Hallo", "Wasser"], fr: "J'ai vingt ans." },
        { who: "jack", txt: "Eins, zwei, drei… und dann?", fr: "Un, deux, trois… et après ?" },
        { who: "toi", choices: ["Vier!", "Sieben!", "Zehn!"], fr: "Quatre !" },
      ] },
    { id: "famille", niveau: 0, titre: "La famille", emoji: "👨‍👩‍👧",
      mots: [["La mère", "Die Mutter"], ["Le père", "Der Vater"], ["Le frère", "Der Bruder"], ["La sœur", "Die Schwester"], ["Le fils", "Der Sohn"],
        ["La fille", "Die Tochter"], ["La grand-mère", "Die Großmutter"], ["Le grand-père", "Der Großvater"], ["Le mari", "Der Ehemann"],
        ["La femme (épouse)", "Die Ehefrau"], ["L'enfant", "Das Kind"], ["L'ami", "Der Freund"]],
      dialogue: [
        { who: "jack", txt: "Hast du Geschwister?", fr: "As-tu des frères et sœurs ?" },
        { who: "toi", choices: ["Ja, ich habe eine Schwester.", "Ja, ich bin eine Schwester.", "Nein, ich bin müde."], fr: "Oui, j'ai une sœur." },
        { who: "jack", txt: "Wie heißt sie?", fr: "Comment s'appelle-t-elle ?" },
        { who: "toi", choices: ["Sie heißt Emma.", "Ich heiße Emma.", "Er heißt Emma."], fr: "Elle s'appelle Emma." },
      ] },
    { id: "cafe", niveau: 0, titre: "Au café", emoji: "☕",
      mots: [["Un café, s'il vous plaît", "Einen Kaffee, bitte"], ["De l'eau", "Wasser"], ["Un thé", "Einen Tee"], ["L'addition", "Die Rechnung"],
        ["Combien ça coûte ?", "Was kostet das?"], ["Je voudrais…", "Ich möchte…"], ["C'est délicieux", "Das ist lecker"]],
      dialogue: [
        { who: "jack", txt: "Guten Tag! Was möchten Sie?", fr: "Bonjour ! Que désirez-vous ?" },
        { who: "toi", choices: ["Einen Kaffee, bitte.", "Ich habe mich verlaufen.", "Links."], fr: "Un café, s'il vous plaît." },
        { who: "jack", txt: "Bitte schön!", fr: "Voilà !" },
        { who: "toi", choices: ["Danke! Was kostet das?", "Ich heiße Jack.", "Nein"], fr: "Merci ! Combien ça coûte ?" },
        { who: "jack", txt: "Drei Euro, bitte.", fr: "Trois euros, s'il vous plaît." },
      ] },
    { id: "voyage", niveau: 0, titre: "En voyage", emoji: "✈️",
      mots: [["Où est la gare ?", "Wo ist der Bahnhof?"], ["L'aéroport", "Der Flughafen"], ["L'hôtel", "Das Hotel"], ["À gauche", "Links"],
        ["À droite", "Rechts"], ["Tout droit", "Geradeaus"], ["Je suis perdu", "Ich habe mich verlaufen"], ["Aidez-moi", "Helfen Sie mir"]],
      dialogue: [
        { who: "jack", txt: "Hallo, kann ich helfen?", fr: "Bonjour, je peux aider ?" },
        { who: "toi", choices: ["Ja! Wo ist der Bahnhof?", "Einen Tee, bitte.", "Ich bin Franzose."], fr: "Oui ! Où est la gare ?" },
        { who: "jack", txt: "Geradeaus und dann links.", fr: "Tout droit puis à gauche." },
        { who: "toi", choices: ["Vielen Dank!", "Wie alt bist du?", "Hallo"], fr: "Merci beaucoup !" },
      ] },

    // ---------- MOYEN ----------
    { id: "meteo", niveau: 1, titre: "Le temps et la météo", emoji: "🌦️",
      mots: [["Quelle heure est-il ?", "Wie spät ist es?"], ["Il fait beau", "Das Wetter ist schön"], ["Il pleut", "Es regnet"], ["Il fait froid", "Es ist kalt"],
        ["Il fait chaud", "Es ist heiß"], ["Aujourd'hui", "Heute"], ["Demain", "Morgen"], ["Hier", "Gestern"], ["La semaine", "Die Woche"],
        ["Lundi", "Montag"], ["Le week-end", "Das Wochenende"]],
      dialogue: [
        { who: "jack", txt: "Wie war das Wetter gestern?", fr: "Quel temps a-t-il fait hier ?" },
        { who: "toi", choices: ["Es war kalt und es hat geregnet.", "Es ist kalt morgen gewesen.", "Ich bin kalt, danke."], fr: "Il faisait froid et il a plu." },
        { who: "jack", txt: "Und was machst du am Wochenende?", fr: "Et que fais-tu ce week-end ?" },
        { who: "toi", choices: ["Ich besuche meine Eltern.", "Ich meine Eltern besuche.", "Ich habe besuchen meine Eltern."], fr: "Je rends visite à mes parents." },
      ] },
    { id: "ville", niveau: 1, titre: "En ville et shopping", emoji: "🛍️",
      mots: [["La boutique", "Das Geschäft"], ["Le marché", "Der Markt"], ["La banque", "Die Bank"], ["La pharmacie", "Die Apotheke"],
        ["Je cherche…", "Ich suche…"], ["C'est trop cher", "Das ist zu teuer"], ["Je peux payer par carte ?", "Kann ich mit Karte zahlen?"],
        ["La taille", "Die Größe"], ["Je le prends", "Ich nehme es"], ["Ouvert", "Geöffnet"], ["Fermé", "Geschlossen"]],
      dialogue: [
        { who: "jack", txt: "Guten Tag! Kann ich Ihnen helfen?", fr: "Bonjour ! Je peux vous aider ?" },
        { who: "toi", choices: ["Ja, ich suche eine Jacke.", "Ja, ich eine Jacke suche.", "Ja, ich suche einen Jacke."], fr: "Oui, je cherche une veste." },
        { who: "jack", txt: "Diese kostet fünfzig Euro.", fr: "Celle-ci coûte cinquante euros." },
        { who: "toi", choices: ["Gut, ich nehme sie. Kann ich mit Karte zahlen?", "Das ist zu viel teuer.", "Ich habe sie morgen genommen."], fr: "Bien, je la prends. Je peux payer par carte ?" },
      ] },
    { id: "travail", niveau: 1, titre: "Au travail", emoji: "💼",
      mots: [["Le travail", "Die Arbeit"], ["Le bureau", "Das Büro"], ["Le collègue", "Der Kollege"], ["Le patron", "Der Chef"],
        ["La réunion", "Die Besprechung"], ["Le salaire", "Das Gehalt"], ["Je travaille chez…", "Ich arbeite bei…"], ["Envoyer un e-mail", "Eine E-Mail schicken"],
        ["Être en retard", "Zu spät kommen"], ["Une pause", "Eine Pause"]] },
    { id: "sante", niveau: 1, titre: "Santé et corps", emoji: "🩺",
      mots: [["La tête", "Der Kopf"], ["Le ventre", "Der Bauch"], ["Le dos", "Der Rücken"], ["La main", "Die Hand"], ["Le pied", "Der Fuß"],
        ["J'ai mal à la tête", "Ich habe Kopfschmerzen"], ["Le médecin", "Der Arzt"], ["Le médicament", "Das Medikament"],
        ["Je suis malade", "Ich bin krank"], ["Je suis fatigué", "Ich bin müde"]],
      dialogue: [
        { who: "jack", txt: "Was ist los?", fr: "Qu'est-ce qui ne va pas ?" },
        { who: "toi", choices: ["Ich habe Kopfschmerzen und bin müde.", "Ich bin Kopfschmerzen.", "Mein Kopf hat müde."], fr: "J'ai mal à la tête et je suis fatigué." },
        { who: "jack", txt: "Du solltest zum Arzt gehen.", fr: "Tu devrais aller chez le médecin." },
        { who: "toi", choices: ["Du hast recht, ich rufe ihn an.", "Du hast recht, ich anrufe ihn.", "Du bist recht, ich rufe an ihn."], fr: "Tu as raison, je l'appelle." },
      ] },
    { id: "loisirs", niveau: 1, titre: "Loisirs", emoji: "🎸",
      mots: [["Le sport", "Der Sport"], ["La musique", "Die Musik"], ["Le film", "Der Film"], ["Lire", "Lesen"], ["Nager", "Schwimmen"],
        ["Voyager", "Reisen"], ["Cuisiner", "Kochen"], ["J'aime…", "Ich mag…"], ["Je préfère…", "Ich bevorzuge…"],
        ["Qu'est-ce que tu fais le week-end ?", "Was machst du am Wochenende?"]] },

    // ---------- AUTONOME ----------
    { id: "opinions", niveau: 2, titre: "Opinions et émotions", emoji: "💭",
      mots: [["À mon avis", "Meiner Meinung nach"], ["Je suis d'accord", "Ich stimme zu"], ["Je ne suis pas d'accord", "Ich stimme nicht zu"],
        ["Ça dépend", "Das kommt darauf an"], ["Heureux", "Glücklich"], ["Triste", "Traurig"], ["Inquiet", "Besorgt"], ["Déçu", "Enttäuscht"],
        ["Fier", "Stolz"], ["J'en ai marre", "Ich habe die Nase voll"]],
      dialogue: [
        { who: "jack", txt: "Findest du, dass soziale Netzwerke gut für Jugendliche sind?", fr: "Trouves-tu que les réseaux sociaux sont bons pour les jeunes ?" },
        { who: "toi", choices: ["Das kommt darauf an. Meiner Meinung nach können sie nützlich sein, aber…", "Meiner Meinung nach sie können nützlich sein.", "Ich bin einverstehen."], fr: "Ça dépend. À mon avis, ils peuvent être utiles, mais…" },
        { who: "jack", txt: "Also bist du ein bisschen besorgt?", fr: "Donc tu es un peu inquiet ?" },
        { who: "toi", choices: ["Ja, weil sie zu viel Zeit damit verbringen.", "Ja, weil sie verbringen zu viel Zeit.", "Ja, weil verbringen sie zu viel Zeit."], fr: "Oui, parce qu'ils y passent trop de temps." },
      ] },
    { id: "connecteurs", niveau: 2, titre: "Les connecteurs", emoji: "🔗",
      mots: [["Cependant", "Jedoch"], ["Donc", "Deshalb"], ["En revanche", "Dagegen"], ["Grâce à", "Dank"], ["À cause de", "Wegen"],
        ["Bien que", "Obwohl"], ["Afin de", "Um … zu"], ["Enfin", "Schließlich"], ["De plus", "Außerdem"], ["Par exemple", "Zum Beispiel"]] },
    { id: "societe", niveau: 2, titre: "Société et actualité", emoji: "📰",
      mots: [["L'environnement", "Die Umwelt"], ["Le gouvernement", "Die Regierung"], ["L'élection", "Die Wahl"], ["Le chômage", "Die Arbeitslosigkeit"],
        ["Le réchauffement climatique", "Die Erderwärmung"], ["La santé publique", "Die öffentliche Gesundheit"], ["Les réseaux sociaux", "Die sozialen Netzwerke"],
        ["L'égalité", "Die Gleichberechtigung"], ["La pollution", "Die Umweltverschmutzung"], ["La recherche", "Die Forschung"]] },
    { id: "pro", niveau: 2, titre: "Vie professionnelle", emoji: "📈",
      mots: [["Un entretien d'embauche", "Ein Vorstellungsgespräch"], ["Le CV", "Der Lebenslauf"], ["Les compétences", "Die Fähigkeiten"],
        ["Postuler", "Sich bewerben"], ["Embaucher", "Einstellen"], ["Démissionner", "Kündigen"], ["Une augmentation", "Eine Gehaltserhöhung"],
        ["Un contrat", "Ein Vertrag"], ["Un délai", "Eine Frist"], ["Négocier", "Verhandeln"]],
      dialogue: [
        { who: "jack", txt: "Warum haben Sie sich für diese Stelle beworben?", fr: "Pourquoi avez-vous postulé à ce poste ?" },
        { who: "toi", choices: ["Weil meine Fähigkeiten gut zu der Stelle passen.", "Weil meine Fähigkeiten passen gut zu der Stelle.", "Weil ich habe beworben."], fr: "Parce que mes compétences correspondent bien au poste." },
        { who: "jack", txt: "Was haben Sie in den letzten zwei Jahren gemacht?", fr: "Qu'avez-vous fait ces deux dernières années ?" },
        { who: "toi", choices: ["Ich habe als Projektleiter gearbeitet.", "Ich bin als Projektleiter gearbeitet.", "Ich habe als Projektleiter arbeiten."], fr: "J'ai travaillé comme chef de projet." },
      ] },
    { id: "expressions", niveau: 2, titre: "Expressions idiomatiques", emoji: "🎭",
      mots: [["Il pleut des cordes", "Es regnet in Strömen"], ["Ce n'est pas ma tasse de thé", "Das ist nicht mein Ding"],
        ["Coûter les yeux de la tête", "Ein Vermögen kosten"], ["Briser la glace", "Das Eis brechen"], ["Être dans la lune", "Mit den Gedanken woanders sein"],
        ["Faire d'une pierre deux coups", "Zwei Fliegen mit einer Klappe schlagen"], ["C'est du gâteau", "Das ist ein Kinderspiel"],
        ["Je l'ai sur le bout de la langue", "Es liegt mir auf der Zunge"], ["Croiser les doigts", "Die Daumen drücken"]] },
  ],

  grammaire: [
    // ---------- AMATEUR ----------
    { id: "genres", niveau: 0, titre: "Les trois genres : der, die, das",
      explication: `L'allemand a <b>trois genres</b> : <b>der</b> (masculin), <b>die</b> (féminin), <b>das</b> (neutre). Au pluriel : toujours <b>die</b>.<br>
        Apprends chaque nom AVEC son article ! Quelques indices : -ung, -heit, -keit → <b>die</b> · -chen, -lein → <b>das</b>.<br>
        ⚠️ Tous les noms prennent une <b>majuscule</b> : <i>der Tisch, die Zeitung</i>.`,
      exemples: [["der Mann", "l'homme"], ["die Zeitung", "le journal"], ["das Mädchen", "la jeune fille (neutre !)"]],
      exercices: [
        { q: "___ Zeitung", choix: ["die", "der", "das"], fr: "le journal" },
        { q: "___ Mädchen", choix: ["das", "die", "der"], fr: "la jeune fille" },
        { q: "___ Mann", choix: ["der", "die", "das"], fr: "l'homme" },
        { q: "___ Freiheit", choix: ["die", "der", "das"], fr: "la liberté" },
        { q: "___ Tisch", choix: ["der", "die", "das"], fr: "la table" },
      ] },
    { id: "present", niveau: 0, titre: "Le présent",
      explication: `On enlève -en de l'infinitif et on ajoute : ich <b>-e</b>, du <b>-st</b>, er <b>-t</b>, wir <b>-en</b>, ihr <b>-t</b>, sie <b>-en</b>.<br>
        <b>Sie</b> avec majuscule = vous de politesse (se conjugue comme « ils »).<br>
        Certains verbes changent de voyelle avec du et er : sprechen → du <b>sprichst</b>, fahren → er <b>fährt</b>.`,
      exemples: [["Ich wohne in Berlin.", "J'habite à Berlin."], ["Du sprichst gut Deutsch.", "Tu parles bien allemand."], ["Trinken Sie Kaffee?", "Buvez-vous du café ?"]],
      exercices: [
        { q: "Ich ___ in Berlin.", choix: ["wohne", "wohnst", "wohnt"], fr: "J'habite à Berlin." },
        { q: "Du ___ gut Deutsch.", choix: ["sprichst", "sprechst", "spricht"], fr: "Tu parles bien allemand." },
        { q: "Wir ___ Fußball.", choix: ["spielen", "spielt", "spiele"], fr: "Nous jouons au foot." },
        { q: "Er ___ Tom.", choix: ["heißt", "heißen", "heiße"], fr: "Il s'appelle Tom." },
        { q: "___ Sie Kaffee?", choix: ["Trinken", "Trinkt", "Trinkst"], fr: "Buvez-vous du café ?" },
      ] },
    { id: "verbe-2", niveau: 0, titre: "Le verbe en 2e position",
      explication: `Règle d'or : dans une phrase normale, le verbe conjugué est <b>toujours en 2e position</b>.<br>
        Si on commence par autre chose que le sujet, le sujet passe <b>après</b> le verbe : <i>Heute <b>gehe</b> ich ins Kino.</i><br>
        Question oui/non : verbe en 1er → <i>Hast du Hunger?</i>`,
      exemples: [["Ich gehe heute ins Kino.", "Je vais au cinéma aujourd'hui."], ["Heute gehe ich ins Kino.", "Aujourd'hui je vais au cinéma."], ["Wo wohnst du?", "Où habites-tu ?"]],
      exercices: [
        { q: "Heute ___.", choix: ["gehe ich ins Kino", "ich gehe ins Kino", "ich ins Kino gehe"], fr: "Aujourd'hui je vais au cinéma." },
        { q: "Am Montag ___.", choix: ["arbeitet er nicht", "er arbeitet nicht", "er nicht arbeitet"], fr: "Le lundi il ne travaille pas." },
        { q: "Wo ___?", choix: ["wohnst du", "du wohnst", "wohnen du"], fr: "Où habites-tu ?" },
        { q: "___ du Hunger?", choix: ["Hast", "Du hast", "Haben"], fr: "As-tu faim ?" },
      ] },
    { id: "negation", niveau: 0, titre: "La négation : nicht ou kein ?",
      explication: `<b>kein / keine</b> → devant un <b>nom</b> (qui aurait « ein » ou pas d'article) : <i>Ich habe kein Auto. Ich trinke keine Milch.</i><br>
        <b>nicht</b> → pour tout le reste (verbe, adjectif, nom avec der/die/das) : <i>Das ist nicht gut. Er kommt nicht.</i>`,
      exemples: [["Ich habe keine Zeit.", "Je n'ai pas le temps."], ["Das ist nicht teuer.", "Ce n'est pas cher."], ["Er kommt heute nicht.", "Il ne vient pas aujourd'hui."]],
      exercices: [
        { q: "Ich habe ___ Auto.", choix: ["kein", "nicht", "keine"], fr: "Je n'ai pas de voiture." },
        { q: "Das ist ___ gut.", choix: ["nicht", "kein", "keine"], fr: "Ce n'est pas bien." },
        { q: "Ich trinke ___ Milch.", choix: ["keine", "nicht", "kein"], fr: "Je ne bois pas de lait." },
        { q: "Er kommt heute ___.", choix: ["nicht", "kein", "keinen"], fr: "Il ne vient pas aujourd'hui." },
        { q: "Wir haben ___ Zeit.", choix: ["keine", "kein", "nicht"], fr: "Nous n'avons pas le temps." },
      ] },
    { id: "accusatif", niveau: 0, titre: "L'accusatif (le complément direct)",
      explication: `Le complément d'objet direct se met à l'<b>accusatif</b>. Bonne nouvelle : <b>seul le masculin change</b> !<br>
        der → <b>den</b> · ein → <b>einen</b> · kein → <b>keinen</b> · mein → <b>meinen</b><br>
        Aussi après <b>für, ohne, durch, gegen, um</b>.`,
      exemples: [["Ich sehe den Mann.", "Je vois l'homme."], ["Ich habe einen Bruder.", "J'ai un frère."], ["für meinen Vater", "pour mon père"]],
      exercices: [
        { q: "Ich sehe ___ Mann.", choix: ["den", "der", "dem"], fr: "Je vois l'homme." },
        { q: "Ich habe ___ Bruder.", choix: ["einen", "ein", "eine"], fr: "J'ai un frère." },
        { q: "Er trinkt ___ Kaffee.", choix: ["einen", "ein", "eine"], fr: "Il boit un café." },
        { q: "Das Geschenk ist für ___ Vater.", choix: ["meinen", "mein", "meinem"], fr: "Le cadeau est pour mon père." },
        { q: "Ich esse ___ Apfel.", choix: ["einen", "ein", "eine"], fr: "Je mange une pomme." },
      ] },
    { id: "possessifs", niveau: 0, titre: "Les possessifs",
      explication: `mein (mon) · dein (ton) · <b>sein</b> (son, à lui) · <b>ihr</b> (son, à elle) · unser (notre) · euer (votre) · ihr/Ihr (leur/votre).<br>
        Devant un nom féminin ou pluriel on ajoute <b>-e</b> : <i>meine Mutter</i>. Comme en anglais, sein/ihr dépend du <b>propriétaire</b>.`,
      exemples: [["meine Mutter", "ma mère"], ["Peter und seine Schwester", "Peter et sa sœur"], ["Anna und ihr Bruder", "Anna et son frère"]],
      exercices: [
        { q: "Das ist ___ Mutter (à moi).", choix: ["meine", "mein", "meinen"], fr: "C'est ma mère." },
        { q: "Wo ist ___ Vater (à toi)?", choix: ["dein", "deine", "deinen"], fr: "Où est ton père ?" },
        { q: "Peter liebt ___ Schwester.", choix: ["seine", "ihre", "sein"], fr: "Peter aime sa sœur." },
        { q: "Anna ruft ___ Bruder an.", choix: ["ihren", "seinen", "ihr"], fr: "Anna appelle son frère." },
        { q: "Das ist ___ Haus (à nous).", choix: ["unser", "unsere", "unseren"], fr: "C'est notre maison." },
      ] },

    // ---------- MOYEN ----------
    { id: "datif", niveau: 1, titre: "Le datif",
      explication: `Le datif = complément indirect (à qui ?) et après <b>mit, bei, nach, von, zu, aus, seit</b>.<br>
        der → <b>dem</b> · die → <b>der</b> · das → <b>dem</b> · die (pl.) → <b>den</b> (+ n au nom).<br>
        ein → <b>einem</b>, eine → <b>einer</b>.`,
      exemples: [["Ich fahre mit dem Bus.", "Je prends le bus."], ["Ich gebe der Frau das Buch.", "Je donne le livre à la femme."], ["bei meinen Eltern", "chez mes parents"]],
      exercices: [
        { q: "Ich fahre mit ___ Bus.", choix: ["dem", "den", "der"], fr: "Je prends le bus." },
        { q: "Ich gebe ___ Frau das Buch.", choix: ["der", "die", "dem"], fr: "Je donne le livre à la femme." },
        { q: "Er wohnt bei ___ Eltern.", choix: ["seinen", "seine", "seiner"], fr: "Il habite chez ses parents." },
        { q: "Nach ___ Arbeit gehe ich nach Hause.", choix: ["der", "die", "dem"], fr: "Après le travail je rentre à la maison." },
        { q: "Ich helfe ___ Kind.", choix: ["dem", "das", "den"], fr: "J'aide l'enfant." },
      ] },
    { id: "separables", niveau: 1, titre: "Les verbes à particule séparable",
      explication: `Des verbes comme <b>auf</b>stehen, <b>an</b>rufen, <b>ein</b>kaufen, <b>fern</b>sehen se coupent en deux : la particule part <b>à la fin</b> de la phrase.<br>
        <i>aufstehen → Ich <b>stehe</b> um 7 Uhr <b>auf</b>.</i> Au participe : auf<b>ge</b>standen.`,
      exemples: [["Ich stehe um 7 Uhr auf.", "Je me lève à 7 h."], ["Er ruft seine Mutter an.", "Il appelle sa mère."], ["Wir kaufen heute ein.", "Nous faisons les courses aujourd'hui."]],
      exercices: [
        { q: "Choisis la bonne phrase (aufstehen) :", choix: ["Ich stehe um 7 Uhr auf.", "Ich aufstehe um 7 Uhr.", "Ich stehe auf um 7 Uhr."], fr: "Je me lève à 7 h." },
        { q: "Choisis la bonne phrase (anrufen) :", choix: ["Er ruft seine Mutter an.", "Er anruft seine Mutter.", "Er ruft an seine Mutter."], fr: "Il appelle sa mère." },
        { q: "Choisis la bonne phrase (einkaufen) :", choix: ["Wir kaufen heute ein.", "Wir einkaufen heute.", "Wir kaufen ein heute."], fr: "Nous faisons les courses aujourd'hui." },
        { q: "Choisis la bonne phrase (fernsehen) :", choix: ["Sie sieht jeden Abend fern.", "Sie fernsieht jeden Abend.", "Sie sieht fern jeden Abend."], fr: "Elle regarde la télé tous les soirs." },
      ] },
    { id: "modaux", niveau: 1, titre: "Les verbes de modalité",
      explication: `<b>können</b> (pouvoir) · <b>müssen</b> (devoir) · <b>wollen</b> (vouloir) · <b>dürfen</b> (avoir le droit) · <b>sollen</b> (devoir, on me demande) · <b>möchten</b> (voudrais).<br>
        Le modal est en 2e position, <b>l'infinitif part à la fin</b> : <i>Ich <b>kann</b> gut <b>schwimmen</b>.</i>`,
      exemples: [["Ich kann gut schwimmen.", "Je sais bien nager."], ["Hier darf man nicht rauchen.", "Ici on n'a pas le droit de fumer."], ["Ich möchte einen Kaffee.", "Je voudrais un café."]],
      exercices: [
        { q: "Ich ___ gut schwimmen.", choix: ["kann", "könne", "können"], fr: "Je sais bien nager." },
        { q: "Hier ___ man nicht rauchen.", choix: ["darf", "muss", "will"], fr: "Ici on n'a pas le droit de fumer." },
        { q: "Der Arzt sagt, du ___ mehr schlafen.", choix: ["sollst", "darfst", "willst"], fr: "Le médecin dit que tu dois dormir plus." },
        { q: "Ich ___ einen Kaffee, bitte.", choix: ["möchte", "möchten", "mögt"], fr: "Je voudrais un café, s'il vous plaît." },
        { q: "Wir ___ morgen arbeiten.", choix: ["müssen", "muss", "müsst"], fr: "Nous devons travailler demain." },
      ] },
    { id: "perfekt", niveau: 1, titre: "Le passé composé (Perfekt)",
      explication: `<b>haben</b> ou <b>sein</b> + participe passé <b>à la fin</b>.<br>
        <b>sein</b> pour les déplacements et changements d'état : gehen, fahren, kommen, bleiben, werden, sein.<br>
        Participe : verbes réguliers <b>ge-…-t</b> (gemacht), irréguliers <b>ge-…-en</b> (gegessen) → onglet Irréguliers.`,
      exemples: [["Ich habe Pizza gegessen.", "J'ai mangé une pizza."], ["Wir sind nach Berlin gefahren.", "Nous sommes allés à Berlin."], ["Hast du gut geschlafen?", "As-tu bien dormi ?"]],
      exercices: [
        { q: "Ich ___ Pizza gegessen.", choix: ["habe", "bin", "hat"], fr: "J'ai mangé une pizza." },
        { q: "Wir ___ nach Berlin gefahren.", choix: ["sind", "haben", "seid"], fr: "Nous sommes allés à Berlin." },
        { q: "Hast du das Buch ___?", choix: ["gelesen", "gelest", "lesen"], fr: "As-tu lu le livre ?" },
        { q: "Sie ist gestern ___.", choix: ["gekommen", "gekommt", "kommen"], fr: "Elle est venue hier." },
        { q: "Er hat viel ___.", choix: ["gearbeitet", "gearbeitt", "arbeitete"], fr: "Il a beaucoup travaillé." },
      ] },
    { id: "subordonnees", niveau: 1, titre: "Weil, dass, wenn : le verbe à la fin",
      explication: `Dans une subordonnée (après <b>weil</b> parce que, <b>dass</b> que, <b>wenn</b> si/quand, <b>ob</b> si), le verbe conjugué part <b>tout à la fin</b>.<br>
        Si la phrase commence par la subordonnée, la principale commence par le verbe : <i>Wenn es regnet, <b>bleibe</b> ich zu Hause.</i>`,
      exemples: [["…, weil ich krank bin.", "…, parce que je suis malade."], ["Ich glaube, dass er kommt.", "Je crois qu'il vient."], ["Wenn es regnet, bleibe ich zu Hause.", "S'il pleut, je reste à la maison."]],
      exercices: [
        { q: "Choisis la bonne phrase :", choix: ["Ich bleibe zu Hause, weil ich krank bin.", "Ich bleibe zu Hause, weil ich bin krank.", "Ich bleibe zu Hause, weil bin ich krank."], fr: "Je reste à la maison parce que je suis malade." },
        { q: "Choisis la bonne phrase :", choix: ["Ich glaube, dass er morgen kommt.", "Ich glaube, dass er kommt morgen.", "Ich glaube, dass kommt er morgen."], fr: "Je crois qu'il vient demain." },
        { q: "Choisis la bonne phrase :", choix: ["Weißt du, ob sie Zeit hat?", "Weißt du, ob sie hat Zeit?", "Weißt du, ob hat sie Zeit?"], fr: "Sais-tu si elle a le temps ?" },
        { q: "Choisis la bonne phrase :", choix: ["Wenn es regnet, bleibe ich zu Hause.", "Wenn es regnet, ich bleibe zu Hause.", "Wenn regnet es, bleibe ich zu Hause."], fr: "S'il pleut, je reste à la maison." },
      ] },

    // ---------- AUTONOME ----------
    { id: "praeteritum", niveau: 2, titre: "Le prétérit (Präteritum)",
      explication: `Le temps du <b>récit écrit</b> (livres, journaux). À l'oral on l'utilise surtout pour <b>sein, haben</b> et les modaux : <i>ich war, ich hatte, ich konnte</i>.<br>
        Verbes réguliers : <b>-te</b> (machte). Irréguliers : la voyelle change (fahren → fuhr, gehen → ging).`,
      exemples: [["Gestern war ich krank.", "Hier j'étais malade."], ["Als Kind hatte ich einen Hund.", "Enfant, j'avais un chien."], ["Er konnte nicht kommen.", "Il ne pouvait pas venir."]],
      exercices: [
        { q: "Gestern ___ ich krank.", choix: ["war", "bin", "wäre"], fr: "Hier j'étais malade." },
        { q: "Als Kind ___ ich einen Hund.", choix: ["hatte", "habe", "hätte"], fr: "Enfant, j'avais un chien." },
        { q: "Er ___ nicht kommen.", choix: ["konnte", "kann", "könnte"], fr: "Il ne pouvait pas venir." },
        { q: "Sie ___ ein Buch.", choix: ["las", "liest", "lest"], fr: "Elle lisait un livre." },
        { q: "Wir ___ nach Italien.", choix: ["fuhren", "fahren", "fuhrten"], fr: "Nous sommes allés en Italie." },
      ] },
    { id: "konjunktiv2", niveau: 2, titre: "Le conditionnel (Konjunktiv II)",
      explication: `<b>würde + infinitif</b> = conditionnel : <i>Ich würde reisen.</i><br>
        Formes courtes à connaître : <b>wäre</b> (serais), <b>hätte</b> (aurais), <b>könnte</b> (pourrais).<br>
        Hypothèse : <i>Wenn ich reich <b>wäre</b>, <b>würde</b> ich reisen.</i> · Politesse : <i>Könnten Sie…? Ich hätte gern…</i>`,
      exemples: [["Wenn ich Zeit hätte, würde ich kommen.", "Si j'avais le temps, je viendrais."], ["Könnten Sie mir helfen?", "Pourriez-vous m'aider ?"], ["Ich hätte gern einen Tee.", "Je voudrais un thé."]],
      exercices: [
        { q: "Wenn ich Zeit ___, würde ich kommen.", choix: ["hätte", "habe", "hatte"], fr: "Si j'avais le temps, je viendrais." },
        { q: "Wenn ich reich wäre, ___ ich reisen.", choix: ["würde", "werde", "wurde"], fr: "Si j'étais riche, je voyagerais." },
        { q: "___ Sie mir bitte helfen?", choix: ["Könnten", "Konnten", "Kannst"], fr: "Pourriez-vous m'aider, s'il vous plaît ?" },
        { q: "Ich ___ gern einen Tee.", choix: ["hätte", "hatte", "habe"], fr: "Je voudrais un thé." },
        { q: "An deiner Stelle ___ ich das nicht machen.", choix: ["würde", "wurde", "werde"], fr: "À ta place, je ne ferais pas ça." },
      ] },
    { id: "adjectifs", niveau: 2, titre: "La déclinaison de l'adjectif",
      explication: `Devant un nom, l'adjectif prend une terminaison.<br>
        Après <b>der/die/das</b> : <b>-e</b> au nominatif singulier, <b>-en</b> presque partout ailleurs → <i>der alte Mann, mit dem neuen Auto</i>.<br>
        Après <b>ein</b> : l'adjectif « montre » le genre → <i>ein großer Mann, eine große Frau, ein großes Haus</i>. Accusatif masculin : <i>einen großen Hund</i>.`,
      exemples: [["der alte Mann", "le vieil homme"], ["ein schönes Haus", "une belle maison"], ["Ich sehe einen großen Hund.", "Je vois un grand chien."]],
      exercices: [
        { q: "der ___ Mann", choix: ["alte", "alter", "alten"], fr: "le vieil homme" },
        { q: "ein ___ Haus", choix: ["schönes", "schöne", "schönen"], fr: "une belle maison" },
        { q: "Ich sehe einen ___ Hund.", choix: ["großen", "großer", "große"], fr: "Je vois un grand chien." },
        { q: "eine ___ Frau", choix: ["nette", "netter", "nettes"], fr: "une femme sympa" },
        { q: "mit dem ___ Auto", choix: ["neuen", "neue", "neues"], fr: "avec la nouvelle voiture" },
      ] },
    { id: "passif", niveau: 2, titre: "La voix passive",
      explication: `<b>werden + participe passé</b> (à la fin). L'auteur s'introduit avec <b>von</b> + datif.<br>
        Présent : <i>Das Haus <b>wird</b> gebaut.</i> · Passé : <i>Das Auto <b>wurde</b> repariert.</i>`,
      exemples: [["Hier wird Deutsch gesprochen.", "Ici on parle allemand."], ["Das Buch wurde von Goethe geschrieben.", "Le livre a été écrit par Goethe."]],
      exercices: [
        { q: "Das Haus ___ gerade gebaut.", choix: ["wird", "hat", "werdet"], fr: "La maison est en train d'être construite." },
        { q: "Das Auto wurde gestern ___.", choix: ["repariert", "reparierte", "reparieren"], fr: "La voiture a été réparée hier." },
        { q: "In Österreich ___ Deutsch gesprochen.", choix: ["wird", "werden", "ist"], fr: "En Autriche on parle allemand." },
        { q: "Das Buch wurde ___ Goethe geschrieben.", choix: ["von", "durch", "mit"], fr: "Le livre a été écrit par Goethe." },
        { q: "Die Briefe ___ jeden Tag gebracht.", choix: ["werden", "wird", "worden"], fr: "Les lettres sont apportées tous les jours." },
      ] },
    { id: "relatifs", niveau: 2, titre: "Les pronoms relatifs",
      explication: `Ils ressemblent aux articles : <b>der, die, das</b>, pluriel <b>die</b>. Accusatif masculin : <b>den</b>. Datif : <b>dem, der, dem, denen</b>.<br>
        Le cas dépend du rôle dans la relative, et le verbe va <b>à la fin</b> : <i>Der Mann, der dort <b>steht</b>…</i>`,
      exemples: [["Der Mann, der dort steht, ist mein Vater.", "L'homme qui est là-bas est mon père."], ["Die Frau, die ich liebe…", "La femme que j'aime…"], ["Der Freund, dem ich helfe…", "L'ami que j'aide…"]],
      exercices: [
        { q: "Der Mann, ___ dort steht, ist mein Vater.", choix: ["der", "den", "dem"], fr: "L'homme qui est là-bas est mon père." },
        { q: "Die Frau, ___ ich liebe, heißt Anna.", choix: ["die", "der", "den"], fr: "La femme que j'aime s'appelle Anna." },
        { q: "Das Buch, ___ ich lese, ist spannend.", choix: ["das", "dass", "der"], fr: "Le livre que je lis est passionnant." },
        { q: "Der Freund, ___ ich helfe, ist krank.", choix: ["dem", "den", "der"], fr: "L'ami que j'aide est malade." },
        { q: "Die Kinder, ___ hier spielen, sind laut.", choix: ["die", "der", "denen"], fr: "Les enfants qui jouent ici sont bruyants." },
      ] },
  ],
};
