// Contenu ANGLAIS de Jack Blabla.
// niveau : 0 = Amateur, 1 = Moyen, 2 = Autonome
// Exercices : le PREMIER choix est toujours la bonne réponse (ils sont mélangés à l'affichage).

CONTENU.en = {
  pronoms: ["I", "you", "he/she", "we", "you", "they"],
  pronomsFr: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],

  temps: [
    { id: "present", nom: "Présent simple", niveau: 0 },
    { id: "continu", nom: "Présent continu", niveau: 0 },
    { id: "preterit", nom: "Prétérit", niveau: 1 },
    { id: "futur", nom: "Futur (will)", niveau: 1 },
    { id: "perfect", nom: "Present perfect", niveau: 2 },
    { id: "conditionnel", nom: "Conditionnel (would)", niveau: 2 },
  ],

  // preterit / participe / ing : seulement quand ce n'est pas la forme régulière
  verbes: [
    { inf: "be", fr: "être", niveau: 0, preterit: "was", participe: "been", ing: "being",
      formes: { present: ["am", "are", "is", "are", "are", "are"], preterit: ["was", "were", "was", "were", "were", "were"] } },
    { inf: "have", fr: "avoir", niveau: 0, preterit: "had", participe: "had",
      formes: { present: ["have", "have", "has", "have", "have", "have"] } },
    { inf: "do", fr: "faire", niveau: 0, preterit: "did", participe: "done" },
    { inf: "go", fr: "aller", niveau: 0, preterit: "went", participe: "gone" },
    { inf: "eat", fr: "manger", niveau: 0, preterit: "ate", participe: "eaten" },
    { inf: "like", fr: "aimer", niveau: 0 },
    { inf: "work", fr: "travailler", niveau: 0 },
    { inf: "play", fr: "jouer", niveau: 0 },
    { inf: "live", fr: "habiter, vivre", niveau: 0 },
    { inf: "want", fr: "vouloir", niveau: 0 },
    { inf: "come", fr: "venir", niveau: 1, preterit: "came", participe: "come" },
    { inf: "see", fr: "voir", niveau: 1, preterit: "saw", participe: "seen" },
    { inf: "make", fr: "fabriquer, faire", niveau: 1, preterit: "made", participe: "made" },
    { inf: "take", fr: "prendre", niveau: 1, preterit: "took", participe: "taken" },
    { inf: "speak", fr: "parler", niveau: 1, preterit: "spoke", participe: "spoken" },
    { inf: "write", fr: "écrire", niveau: 1, preterit: "wrote", participe: "written" },
    { inf: "buy", fr: "acheter", niveau: 1, preterit: "bought", participe: "bought" },
    { inf: "study", fr: "étudier", niveau: 1 },
    { inf: "stop", fr: "arrêter", niveau: 1, preterit: "stopped", ing: "stopping" },
    { inf: "watch", fr: "regarder", niveau: 1 },
    { inf: "think", fr: "penser", niveau: 2, preterit: "thought", participe: "thought" },
    { inf: "know", fr: "savoir, connaître", niveau: 2, preterit: "knew", participe: "known" },
    { inf: "get", fr: "obtenir, devenir", niveau: 2, preterit: "got", participe: "got", ing: "getting" },
    { inf: "begin", fr: "commencer", niveau: 2, preterit: "began", participe: "begun", ing: "beginning" },
    { inf: "run", fr: "courir", niveau: 2, preterit: "ran", participe: "run", ing: "running" },
    { inf: "swim", fr: "nager", niveau: 2, preterit: "swam", participe: "swum", ing: "swimming" },
    { inf: "choose", fr: "choisir", niveau: 2, preterit: "chose", participe: "chosen" },
    { inf: "understand", fr: "comprendre", niveau: 2, preterit: "understood", participe: "understood" },
  ],

  irreguliers: {
    colonnes: ["Base verbale", "Prétérit", "Participe passé"],
    lignes: [
      // [base, prétérit, participe, français, niveau]
      ["be", "was/were", "been", "être", 0], ["have", "had", "had", "avoir", 0], ["do", "did", "done", "faire", 0],
      ["go", "went", "gone", "aller", 0], ["come", "came", "come", "venir", 0], ["see", "saw", "seen", "voir", 0],
      ["eat", "ate", "eaten", "manger", 0], ["drink", "drank", "drunk", "boire", 0], ["make", "made", "made", "fabriquer", 0],
      ["take", "took", "taken", "prendre", 0], ["get", "got", "got/gotten", "obtenir", 0], ["say", "said", "said", "dire", 0],
      ["give", "gave", "given", "donner", 0], ["know", "knew", "known", "savoir, connaître", 0], ["think", "thought", "thought", "penser", 0],
      ["buy", "bought", "bought", "acheter", 1], ["find", "found", "found", "trouver", 1], ["leave", "left", "left", "partir, quitter", 1],
      ["meet", "met", "met", "rencontrer", 1], ["pay", "paid", "paid", "payer", 1], ["put", "put", "put", "mettre", 1],
      ["read", "read", "read", "lire", 1], ["run", "ran", "run", "courir", 1], ["sleep", "slept", "slept", "dormir", 1],
      ["speak", "spoke", "spoken", "parler", 1], ["tell", "told", "told", "raconter", 1], ["write", "wrote", "written", "écrire", 1],
      ["begin", "began", "begun", "commencer", 1], ["feel", "felt", "felt", "ressentir", 1], ["sit", "sat", "sat", "s'asseoir", 1],
      ["break", "broke", "broken", "casser", 2], ["bring", "brought", "brought", "apporter", 2], ["build", "built", "built", "construire", 2],
      ["choose", "chose", "chosen", "choisir", 2], ["cut", "cut", "cut", "couper", 2], ["drive", "drove", "driven", "conduire", 2],
      ["fall", "fell", "fallen", "tomber", 2], ["fly", "flew", "flown", "voler (avion)", 2], ["forget", "forgot", "forgotten", "oublier", 2],
      ["hear", "heard", "heard", "entendre", 2], ["keep", "kept", "kept", "garder", 2], ["lose", "lost", "lost", "perdre", 2],
      ["sell", "sold", "sold", "vendre", 2], ["send", "sent", "sent", "envoyer", 2], ["sing", "sang", "sung", "chanter", 2],
      ["spend", "spent", "spent", "dépenser", 2], ["swim", "swam", "swum", "nager", 2], ["teach", "taught", "taught", "enseigner", 2],
      ["understand", "understood", "understood", "comprendre", 2], ["wear", "wore", "worn", "porter (vêtement)", 2], ["win", "won", "won", "gagner", 2],
    ],
  },

  themes: [
    // ---------- AMATEUR ----------
    { id: "salut", niveau: 0, titre: "Dire bonjour", emoji: "👋",
      mots: [["Bonjour", "Hello"], ["Salut", "Hi"], ["Au revoir", "Goodbye"], ["Merci", "Thank you"], ["S'il vous plaît", "Please"],
        ["Oui", "Yes"], ["Non", "No"], ["Comment ça va ?", "How are you?"], ["Ça va bien", "I'm fine"]],
      dialogue: [
        { who: "jack", txt: "Hello! How are you?", fr: "Bonjour ! Comment ça va ?" },
        { who: "toi", choices: ["I'm fine, thank you!", "Goodbye!", "Where is the station?"], fr: "Ça va bien, merci !" },
        { who: "jack", txt: "Great! Goodbye!", fr: "Super ! Au revoir !" },
        { who: "toi", choices: ["Goodbye!", "A coffee, please", "Yes"], fr: "Au revoir !" },
      ] },
    { id: "moi", niveau: 0, titre: "Se présenter", emoji: "🙋",
      mots: [["Je m'appelle…", "My name is…"], ["J'ai … ans", "I am … years old"], ["Je suis français", "I am French"],
        ["J'habite à Paris", "I live in Paris"], ["Enchanté", "Nice to meet you"], ["Et toi ?", "And you?"], ["Je parle un peu anglais", "I speak a little English"]],
      dialogue: [
        { who: "jack", txt: "Hi! My name is Jack. What's your name?", fr: "Salut ! Je m'appelle Jack. Comment tu t'appelles ?" },
        { who: "toi", choices: ["My name is Léa.", "I am lost.", "The bill"], fr: "Je m'appelle Léa." },
        { who: "jack", txt: "Nice to meet you! Where do you live?", fr: "Enchanté ! Où habites-tu ?" },
        { who: "toi", choices: ["I live in Paris.", "Thank you", "Straight ahead"], fr: "J'habite à Paris." },
      ] },
    { id: "chiffres", niveau: 0, titre: "Les chiffres", emoji: "🔢",
      mots: [["un", "one"], ["deux", "two"], ["trois", "three"], ["quatre", "four"], ["cinq", "five"], ["six", "six"],
        ["sept", "seven"], ["huit", "eight"], ["neuf", "nine"], ["dix", "ten"], ["vingt", "twenty"], ["cent", "one hundred"]],
      dialogue: [
        { who: "jack", txt: "How old are you?", fr: "Quel âge as-tu ?" },
        { who: "toi", choices: ["I am twenty years old.", "Hello", "Water"], fr: "J'ai vingt ans." },
        { who: "jack", txt: "One, two, three… what comes next?", fr: "Un, deux, trois… et après ?" },
        { who: "toi", choices: ["Four!", "Seven!", "Ten!"], fr: "Quatre !" },
      ] },
    { id: "famille", niveau: 0, titre: "La famille", emoji: "👨‍👩‍👧",
      mots: [["La mère", "The mother"], ["Le père", "The father"], ["Le frère", "The brother"], ["La sœur", "The sister"],
        ["Le fils", "The son"], ["La fille", "The daughter"], ["La grand-mère", "The grandmother"], ["Le grand-père", "The grandfather"],
        ["Le mari", "The husband"], ["La femme (épouse)", "The wife"], ["L'enfant", "The child"], ["L'ami", "The friend"]],
      dialogue: [
        { who: "jack", txt: "Do you have brothers or sisters?", fr: "As-tu des frères ou des sœurs ?" },
        { who: "toi", choices: ["Yes, I have one sister.", "No, I am tired.", "Yes, a coffee."], fr: "Oui, j'ai une sœur." },
        { who: "jack", txt: "What's her name?", fr: "Comment s'appelle-t-elle ?" },
        { who: "toi", choices: ["Her name is Emma.", "His name is Emma.", "My name is Emma."], fr: "Elle s'appelle Emma." },
      ] },
    { id: "cafe", niveau: 0, titre: "Au café", emoji: "☕",
      mots: [["Un café, s'il vous plaît", "A coffee, please"], ["De l'eau", "Water"], ["Un thé", "A tea"], ["L'addition", "The bill"],
        ["Combien ça coûte ?", "How much is it?"], ["Je voudrais…", "I would like…"], ["C'est délicieux", "It's delicious"]],
      dialogue: [
        { who: "jack", txt: "Hello! What would you like?", fr: "Bonjour ! Que désirez-vous ?" },
        { who: "toi", choices: ["A coffee, please.", "I am lost.", "On the left."], fr: "Un café, s'il vous plaît." },
        { who: "jack", txt: "Here you are!", fr: "Voilà !" },
        { who: "toi", choices: ["Thank you! How much is it?", "My name is Jack.", "No"], fr: "Merci ! Combien ça coûte ?" },
        { who: "jack", txt: "Three euros, please.", fr: "Trois euros, s'il vous plaît." },
      ] },
    { id: "voyage", niveau: 0, titre: "En voyage", emoji: "✈️",
      mots: [["Où est la gare ?", "Where is the station?"], ["L'aéroport", "The airport"], ["L'hôtel", "The hotel"], ["À gauche", "On the left"],
        ["À droite", "On the right"], ["Tout droit", "Straight ahead"], ["Je suis perdu", "I am lost"], ["Aidez-moi", "Help me"]],
      dialogue: [
        { who: "jack", txt: "Hello, can I help you?", fr: "Bonjour, je peux vous aider ?" },
        { who: "toi", choices: ["Yes! Where is the station?", "A tea, please.", "I am French."], fr: "Oui ! Où est la gare ?" },
        { who: "jack", txt: "Go straight ahead, then on the left.", fr: "Allez tout droit, puis à gauche." },
        { who: "toi", choices: ["Thank you very much!", "How old are you?", "Hi"], fr: "Merci beaucoup !" },
      ] },

    // ---------- MOYEN ----------
    { id: "meteo", niveau: 1, titre: "Le temps et la météo", emoji: "🌦️",
      mots: [["Quelle heure est-il ?", "What time is it?"], ["Il fait beau", "The weather is nice"], ["Il pleut", "It's raining"],
        ["Il fait froid", "It's cold"], ["Il fait chaud", "It's hot"], ["Aujourd'hui", "Today"], ["Demain", "Tomorrow"], ["Hier", "Yesterday"],
        ["La semaine", "The week"], ["Lundi", "Monday"], ["Le week-end", "The weekend"]],
      dialogue: [
        { who: "jack", txt: "What was the weather like yesterday?", fr: "Quel temps faisait-il hier ?" },
        { who: "toi", choices: ["It was cold and it rained.", "It is cold tomorrow.", "I am cold, thank you."], fr: "Il faisait froid et il a plu." },
        { who: "jack", txt: "And what will you do this weekend?", fr: "Et que feras-tu ce week-end ?" },
        { who: "toi", choices: ["I'm going to visit my parents.", "I visited my parents.", "I visit my parents yesterday."], fr: "Je vais rendre visite à mes parents." },
      ] },
    { id: "ville", niveau: 1, titre: "En ville et shopping", emoji: "🛍️",
      mots: [["La boutique", "The shop"], ["Le marché", "The market"], ["La banque", "The bank"], ["La pharmacie", "The chemist's (pharmacy)"],
        ["Je cherche…", "I'm looking for…"], ["C'est trop cher", "It's too expensive"], ["Je peux payer par carte ?", "Can I pay by card?"],
        ["La taille", "The size"], ["Je le prends", "I'll take it"], ["Ouvert", "Open"], ["Fermé", "Closed"]],
      dialogue: [
        { who: "jack", txt: "Good morning! Can I help you?", fr: "Bonjour ! Je peux vous aider ?" },
        { who: "toi", choices: ["Yes, I'm looking for a jacket.", "Yes, I looking a jacket.", "Yes, I look for jacket yesterday."], fr: "Oui, je cherche une veste." },
        { who: "jack", txt: "This one is fifty pounds.", fr: "Celle-ci coûte cinquante livres." },
        { who: "toi", choices: ["Great, I'll take it. Can I pay by card?", "It's too much expensive.", "I take it yesterday."], fr: "Super, je la prends. Je peux payer par carte ?" },
      ] },
    { id: "travail", niveau: 1, titre: "Au travail", emoji: "💼",
      mots: [["Le travail", "The job"], ["Le bureau", "The office"], ["Le collègue", "The colleague"], ["Le patron", "The boss"],
        ["La réunion", "The meeting"], ["Le salaire", "The salary"], ["Je travaille dans…", "I work in…"], ["Envoyer un e-mail", "To send an email"],
        ["Être en retard", "To be late"], ["Une pause", "A break"]] },
    { id: "sante", niveau: 1, titre: "Santé et corps", emoji: "🩺",
      mots: [["La tête", "The head"], ["Le ventre", "The stomach"], ["Le dos", "The back"], ["La main", "The hand"], ["Le pied", "The foot"],
        ["J'ai mal à la tête", "I have a headache"], ["Le médecin", "The doctor"], ["Le médicament", "The medicine"],
        ["Je suis malade", "I am ill"], ["Je suis fatigué", "I am tired"]],
      dialogue: [
        { who: "jack", txt: "What's the matter?", fr: "Qu'est-ce qui ne va pas ?" },
        { who: "toi", choices: ["I have a headache and I'm tired.", "I have a head pain of me.", "I am headache."], fr: "J'ai mal à la tête et je suis fatigué." },
        { who: "jack", txt: "You should see a doctor.", fr: "Tu devrais voir un médecin." },
        { who: "toi", choices: ["You're right, I will call him.", "You're right, I calling him.", "Yes, I should to call."], fr: "Tu as raison, je vais l'appeler." },
      ] },
    { id: "loisirs", niveau: 1, titre: "Loisirs", emoji: "🎸",
      mots: [["Le sport", "Sport"], ["La musique", "Music"], ["Le film", "The film"], ["Lire", "To read"], ["Nager", "To swim"],
        ["Voyager", "To travel"], ["Cuisiner", "To cook"], ["J'aime…", "I like…"], ["Je préfère…", "I prefer…"],
        ["Qu'est-ce que tu fais le week-end ?", "What do you do at the weekend?"]] },

    // ---------- AUTONOME ----------
    { id: "opinions", niveau: 2, titre: "Opinions et émotions", emoji: "💭",
      mots: [["À mon avis", "In my opinion"], ["Je suis d'accord", "I agree"], ["Je ne suis pas d'accord", "I disagree"], ["Ça dépend", "It depends"],
        ["Heureux", "Happy"], ["Triste", "Sad"], ["Inquiet", "Worried"], ["Déçu", "Disappointed"], ["Fier", "Proud"], ["J'en ai marre", "I'm fed up"]],
      dialogue: [
        { who: "jack", txt: "Do you think social media is good for teenagers?", fr: "Penses-tu que les réseaux sociaux sont bons pour les ados ?" },
        { who: "toi", choices: ["It depends. In my opinion, it can be useful, but…", "I am agree with it.", "Yes, I think so that."], fr: "Ça dépend. À mon avis, ça peut être utile, mais…" },
        { who: "jack", txt: "I see. So you're a bit worried?", fr: "Je vois. Donc tu es un peu inquiet ?" },
        { who: "toi", choices: ["Yes, I'm worried about how much time they spend on it.", "Yes, I'm worried of the time they spend.", "Yes, I worry it much."], fr: "Oui, je m'inquiète du temps qu'ils y passent." },
      ] },
    { id: "connecteurs", niveau: 2, titre: "Les connecteurs", emoji: "🔗",
      mots: [["Cependant", "However"], ["Donc", "Therefore"], ["En revanche", "On the other hand"], ["Grâce à", "Thanks to"],
        ["À cause de", "Because of"], ["Bien que", "Although"], ["Afin de", "In order to"], ["Enfin", "Finally"], ["De plus", "Moreover"], ["Par exemple", "For example"]] },
    { id: "societe", niveau: 2, titre: "Société et actualité", emoji: "📰",
      mots: [["L'environnement", "The environment"], ["Le gouvernement", "The government"], ["L'élection", "The election"], ["Le chômage", "Unemployment"],
        ["Le réchauffement climatique", "Global warming"], ["La santé publique", "Public health"], ["Les réseaux sociaux", "Social media"],
        ["L'égalité", "Equality"], ["La pollution", "Pollution"], ["La recherche", "Research"]] },
    { id: "pro", niveau: 2, titre: "Vie professionnelle", emoji: "📈",
      mots: [["Un entretien d'embauche", "A job interview"], ["Le CV", "The CV"], ["Les compétences", "Skills"], ["Postuler", "To apply"],
        ["Embaucher", "To hire"], ["Démissionner", "To resign"], ["Une augmentation", "A pay rise"], ["Un contrat", "A contract"],
        ["Un délai", "A deadline"], ["Négocier", "To negotiate"]],
      dialogue: [
        { who: "jack", txt: "Why did you apply for this job?", fr: "Pourquoi avez-vous postulé à ce poste ?" },
        { who: "toi", choices: ["Because my skills match what you're looking for.", "Because I am applying since yesterday.", "Because I want money more."], fr: "Parce que mes compétences correspondent à ce que vous cherchez." },
        { who: "jack", txt: "What have you been doing for the last two years?", fr: "Qu'avez-vous fait ces deux dernières années ?" },
        { who: "toi", choices: ["I've been working as a project manager.", "I work as a project manager since two years.", "I worked as project manager since 2 years."], fr: "J'ai travaillé comme chef de projet." },
      ] },
    { id: "expressions", niveau: 2, titre: "Expressions idiomatiques", emoji: "🎭",
      mots: [["Il pleut des cordes", "It's raining cats and dogs"], ["Ce n'est pas ma tasse de thé", "It's not my cup of tea"],
        ["Coûter les yeux de la tête", "To cost an arm and a leg"], ["Briser la glace", "To break the ice"],
        ["Être dans la lune", "To have your head in the clouds"], ["Faire d'une pierre deux coups", "To kill two birds with one stone"],
        ["C'est du gâteau", "It's a piece of cake"], ["Je l'ai sur le bout de la langue", "It's on the tip of my tongue"], ["Croiser les doigts", "To keep your fingers crossed"]] },
  ],

  grammaire: [
    // ---------- AMATEUR ----------
    { id: "to-be", niveau: 0, titre: "Le verbe to be (être)",
      explication: `<b>to be</b> = être. C'est le verbe le plus important !<br>
        I <b>am</b> · you <b>are</b> · he/she/it <b>is</b> · we <b>are</b> · you <b>are</b> · they <b>are</b><br>
        À l'oral on contracte : I'm, you're, he's, it's, we're, they're.<br>
        <b>Négation</b> : I'm not, he isn't, they aren't. <b>Question</b> : on inverse → <i>Are you French?</i>`,
      exemples: [["I am French.", "Je suis français."], ["She isn't tired.", "Elle n'est pas fatiguée."], ["Are you ready?", "Es-tu prêt ?"]],
      exercices: [
        { q: "I ___ French.", choix: ["am", "is", "are"], fr: "Je suis français." },
        { q: "They ___ my friends.", choix: ["are", "is", "am"], fr: "Ce sont mes amis." },
        { q: "She ___ not tired.", choix: ["is", "are", "am"], fr: "Elle n'est pas fatiguée." },
        { q: "___ you happy?", choix: ["Are", "Is", "Am"], fr: "Es-tu heureux ?" },
        { q: "It ___ cold today.", choix: ["is", "are", "am"], fr: "Il fait froid aujourd'hui." },
      ] },
    { id: "articles", niveau: 0, titre: "Les articles a, an, the",
      explication: `<b>a</b> = un/une devant un son consonne : <i>a book, a house</i>.<br>
        <b>an</b> = un/une devant un son voyelle : <i>an apple, an hour</i> (le h ne se prononce pas).<br>
        <b>the</b> = le, la, les.<br>
        ⚠️ Pour parler en général, pas d'article : <i>I like music</i> (j'aime <u>la</u> musique). Et pour un métier on met a : <i>She is <b>a</b> teacher</i>.`,
      exemples: [["an orange", "une orange"], ["a university", "une université (son « you »)"], ["The sun is hot.", "Le soleil est chaud."]],
      exercices: [
        { q: "I have ___ apple.", choix: ["an", "a", "the"], fr: "J'ai une pomme." },
        { q: "She is ___ teacher.", choix: ["a", "an", "— (rien)"], fr: "Elle est professeur." },
        { q: "___ sun is hot.", choix: ["The", "A", "An"], fr: "Le soleil est chaud." },
        { q: "He waited for ___ hour.", choix: ["an", "a", "the"], fr: "Il a attendu une heure." },
        { q: "I like ___ music.", choix: ["— (rien)", "the", "a"], fr: "J'aime la musique." },
      ] },
    { id: "pluriel", niveau: 0, titre: "Le pluriel des noms",
      explication: `En général on ajoute <b>-s</b> : <i>a cat → cats</i>.<br>
        Après -s, -sh, -ch, -x : <b>-es</b> (<i>boxes, buses</i>). Consonne + y → <b>-ies</b> (<i>baby → babies</i>).<br>
        <b>Irréguliers</b> à apprendre : man → <b>men</b>, woman → <b>women</b>, child → <b>children</b>, person → <b>people</b>, foot → <b>feet</b>, tooth → <b>teeth</b>, mouse → <b>mice</b>.`,
      exemples: [["two children", "deux enfants"], ["three women", "trois femmes"], ["many people", "beaucoup de gens"]],
      exercices: [
        { q: "one box, two ___", choix: ["boxes", "boxs", "boxies"], fr: "une boîte, deux boîtes" },
        { q: "one baby, two ___", choix: ["babies", "babys", "babyes"], fr: "un bébé, deux bébés" },
        { q: "one child, three ___", choix: ["children", "childs", "childrens"], fr: "un enfant, trois enfants" },
        { q: "one man, two ___", choix: ["men", "mans", "mens"], fr: "un homme, deux hommes" },
        { q: "one foot, two ___", choix: ["feet", "foots", "feets"], fr: "un pied, deux pieds" },
      ] },
    { id: "present-simple", niveau: 0, titre: "Le présent simple",
      explication: `Pour les habitudes et les vérités générales.<br>
        On garde la base du verbe, sauf avec <b>he / she / it</b> où on ajoute <b>-s</b> : <i>she works</i>.<br>
        <b>Négation</b> : don't / <b>doesn't</b> + base → <i>He doesn't eat meat</i> (pas de -s après doesn't !).<br>
        <b>Question</b> : Do / <b>Does</b> + sujet + base → <i>Does she play tennis?</i>`,
      exemples: [["She lives in London.", "Elle habite à Londres."], ["I don't like coffee.", "Je n'aime pas le café."], ["Does he play football?", "Est-ce qu'il joue au foot ?"]],
      exercices: [
        { q: "She ___ in London.", choix: ["lives", "live", "living"], fr: "Elle habite à Londres." },
        { q: "I ___ like coffee.", choix: ["don't", "doesn't", "not"], fr: "Je n'aime pas le café." },
        { q: "___ he play football?", choix: ["Does", "Do", "Is"], fr: "Est-ce qu'il joue au foot ?" },
        { q: "We ___ to school every day.", choix: ["go", "goes", "going"], fr: "Nous allons à l'école tous les jours." },
        { q: "He doesn't ___ meat.", choix: ["eat", "eats", "eating"], fr: "Il ne mange pas de viande." },
      ] },
    { id: "possessifs", niveau: 0, titre: "Les possessifs (my, your, his, her…)",
      explication: `my (mon/ma/mes) · your (ton/ta/tes) · <b>his</b> (son/sa/ses, à lui) · <b>her</b> (son/sa/ses, à elle) · its · our · your · their.<br>
        ⚠️ En anglais, on choisit selon <b>le propriétaire</b>, pas selon l'objet : <i>Paul loves <b>his</b> sister</i> / <i>Marie loves <b>her</b> brother</i>.`,
      exemples: [["Paul and his mother", "Paul et sa mère"], ["Marie and her father", "Marie et son père"], ["our house", "notre maison"]],
      exercices: [
        { q: "Paul loves ___ sister.", choix: ["his", "her", "its"], fr: "Paul aime sa sœur." },
        { q: "Marie calls ___ brother.", choix: ["her", "his", "their"], fr: "Marie appelle son frère." },
        { q: "We love ___ house.", choix: ["our", "us", "we"], fr: "Nous aimons notre maison." },
        { q: "They visit ___ grandparents.", choix: ["their", "there", "they're"], fr: "Ils rendent visite à leurs grands-parents." },
        { q: "I lost ___ keys.", choix: ["my", "me", "mine"], fr: "J'ai perdu mes clés." },
      ] },
    { id: "there-is", niveau: 0, titre: "There is / There are (il y a)",
      explication: `<b>There is</b> + singulier, <b>There are</b> + pluriel = il y a.<br>
        Question : <i>Is there…? / Are there…?</i> Négation : <i>There isn't any… / There aren't any…</i>`,
      exemples: [["There is a cat in the garden.", "Il y a un chat dans le jardin."], ["There are two banks.", "Il y a deux banques."], ["Is there a pharmacy near here?", "Y a-t-il une pharmacie près d'ici ?"]],
      exercices: [
        { q: "___ a cat in the garden.", choix: ["There is", "There are", "It is"], fr: "Il y a un chat dans le jardin." },
        { q: "___ two banks in the town.", choix: ["There are", "There is", "They are"], fr: "Il y a deux banques en ville." },
        { q: "___ a pharmacy near here?", choix: ["Is there", "Are there", "There is"], fr: "Y a-t-il une pharmacie près d'ici ?" },
        { q: "There ___ any milk.", choix: ["isn't", "aren't", "not"], fr: "Il n'y a pas de lait." },
      ] },

    // ---------- MOYEN ----------
    { id: "simple-continu", niveau: 1, titre: "Présent simple ou présent continu ?",
      explication: `<b>Présent simple</b> : habitudes (<i>usually, every day</i>).<br>
        <b>Présent continu</b> (am/is/are + verbe-<b>ing</b>) : action <b>en ce moment</b> (<i>now, at the moment, look!</i>).<br>
        ⚠️ Les verbes d'état (like, love, know, want, understand) ne se mettent pas au continu : <i>I know</i>, jamais <i>I'm knowing</i>.`,
      exemples: [["I usually take the bus.", "Je prends d'habitude le bus."], ["Look! It's raining.", "Regarde ! Il pleut."], ["I understand.", "Je comprends."]],
      exercices: [
        { q: "Look! It ___.", choix: ["is raining", "rains", "rain"], fr: "Regarde ! Il pleut." },
        { q: "I usually ___ the bus.", choix: ["take", "am taking", "takes"], fr: "Je prends d'habitude le bus." },
        { q: "She ___ TV right now.", choix: ["is watching", "watches", "watch"], fr: "Elle regarde la télé en ce moment." },
        { q: "I ___ the answer.", choix: ["know", "am knowing", "knows"], fr: "Je connais la réponse." },
        { q: "Every morning he ___ coffee.", choix: ["drinks", "is drinking", "drink"], fr: "Chaque matin il boit du café." },
      ] },
    { id: "preterit", niveau: 1, titre: "Le prétérit (passé)",
      explication: `Pour une action <b>terminée</b> à un moment précis du passé (<i>yesterday, last week, two years ago</i>).<br>
        Verbes réguliers : <b>-ed</b> (<i>worked, played</i>). Irréguliers : à apprendre (go → <b>went</b>, see → <b>saw</b>…) → voir l'onglet Irréguliers.<br>
        <b>Négation</b> : didn't + base. <b>Question</b> : Did + sujet + base. Et pour be : was / were.`,
      exemples: [["I went to London last year.", "Je suis allé à Londres l'an dernier."], ["She didn't call me.", "Elle ne m'a pas appelé."], ["Did you see the film?", "As-tu vu le film ?"]],
      exercices: [
        { q: "Yesterday I ___ to the cinema.", choix: ["went", "go", "goed"], fr: "Hier je suis allé au cinéma." },
        { q: "She ___ her homework last night.", choix: ["did", "does", "done"], fr: "Elle a fait ses devoirs hier soir." },
        { q: "We didn't ___ the film.", choix: ["like", "liked", "likes"], fr: "Nous n'avons pas aimé le film." },
        { q: "___ you see him?", choix: ["Did", "Do", "Were"], fr: "L'as-tu vu ?" },
        { q: "They ___ in Spain two years ago.", choix: ["were", "was", "are"], fr: "Ils étaient en Espagne il y a deux ans." },
      ] },
    { id: "comparatifs", niveau: 1, titre: "Comparatifs et superlatifs",
      explication: `Adjectif court : <b>-er than</b> / <b>the -est</b> → <i>taller than, the tallest</i>.<br>
        Adjectif long : <b>more … than</b> / <b>the most …</b> → <i>more interesting, the most beautiful</i>.<br>
        Irréguliers : good → <b>better</b> → <b>the best</b> · bad → <b>worse</b> → <b>the worst</b> · far → further → the furthest.`,
      exemples: [["She is taller than me.", "Elle est plus grande que moi."], ["the most expensive car", "la voiture la plus chère"], ["It's better.", "C'est mieux."]],
      exercices: [
        { q: "My brother is ___ than me.", choix: ["taller", "more tall", "tallest"], fr: "Mon frère est plus grand que moi." },
        { q: "This book is ___ than that one.", choix: ["more interesting", "interestinger", "most interesting"], fr: "Ce livre est plus intéressant que celui-là." },
        { q: "She is the ___ student in the class.", choix: ["best", "better", "goodest"], fr: "C'est la meilleure élève de la classe." },
        { q: "Today is ___ than yesterday.", choix: ["worse", "badder", "more bad"], fr: "Aujourd'hui c'est pire qu'hier." },
        { q: "It's the ___ city in the world.", choix: ["biggest", "bigger", "most big"], fr: "C'est la plus grande ville du monde." },
      ] },
    { id: "some-any", niveau: 1, titre: "Some et any",
      explication: `<b>some</b> = du, de la, des, quelques → phrases affirmatives et propositions polies (<i>Would you like some tea?</i>).<br>
        <b>any</b> → phrases négatives et questions (<i>I don't have any money. Do you have any questions?</i>).`,
      exemples: [["I have some friends in London.", "J'ai des amis à Londres."], ["There isn't any bread.", "Il n'y a pas de pain."], ["Would you like some coffee?", "Voulez-vous du café ?"]],
      exercices: [
        { q: "I have ___ friends in London.", choix: ["some", "any", "a"], fr: "J'ai des amis à Londres." },
        { q: "There isn't ___ bread.", choix: ["any", "some", "a"], fr: "Il n'y a pas de pain." },
        { q: "Do you have ___ questions?", choix: ["any", "some", "a"], fr: "Avez-vous des questions ?" },
        { q: "Would you like ___ coffee?", choix: ["some", "any", "an"], fr: "Voulez-vous du café ?" },
        { q: "We don't need ___ help.", choix: ["any", "some", "an"], fr: "Nous n'avons pas besoin d'aide." },
      ] },
    { id: "futur", niveau: 1, titre: "Le futur : will et going to",
      explication: `<b>will</b> + base : décision prise sur le moment, promesse, prédiction → <i>I'll help you.</i><br>
        <b>be going to</b> + base : projet déjà décidé, ou on voit que ça va arriver → <i>Look at the clouds, it's going to rain.</i>`,
      exemples: [["I'll call you tomorrow.", "Je t'appellerai demain."], ["We're going to visit Canada.", "Nous allons visiter le Canada."], ["It will be fine.", "Ça ira."]],
      exercices: [
        { q: "Look at the clouds! It ___ rain.", choix: ["is going to", "will to", "goes"], fr: "Regarde les nuages ! Il va pleuvoir." },
        { q: "I'm tired. I think I ___ go to bed.", choix: ["will", "am going", "going to"], fr: "Je suis fatigué. Je crois que je vais aller me coucher." },
        { q: "Next year we ___ visit Canada. We bought the tickets.", choix: ["are going to", "will to", "go to"], fr: "L'an prochain nous allons visiter le Canada. On a acheté les billets." },
        { q: "Don't worry, I ___ help you.", choix: ["will", "am going", "going"], fr: "Ne t'inquiète pas, je vais t'aider." },
      ] },
    { id: "modaux", niveau: 1, titre: "Les modaux : can, must, should",
      explication: `<b>can</b> = pouvoir / savoir faire · <b>must</b> = devoir (obligation) · <b>mustn't</b> = interdiction · <b>should</b> = devrais (conseil) · <b>have to</b> = être obligé de.<br>
        ⚠️ Après un modal : base verbale <b>sans to</b>, et <b>pas de -s</b> : <i>She can swim</i>.`,
      exemples: [["I can swim.", "Je sais nager."], ["You mustn't smoke here.", "Tu ne dois pas fumer ici."], ["You should rest.", "Tu devrais te reposer."]],
      exercices: [
        { q: "I ___ swim very well.", choix: ["can", "must to", "cans"], fr: "Je sais très bien nager." },
        { q: "You ___ smoke here. It's forbidden.", choix: ["mustn't", "can", "should"], fr: "Tu ne dois pas fumer ici. C'est interdit." },
        { q: "You look tired. You ___ rest.", choix: ["should", "can't", "mustn't"], fr: "Tu as l'air fatigué. Tu devrais te reposer." },
        { q: "She ___ speak three languages.", choix: ["can", "cans", "can to"], fr: "Elle parle trois langues." },
        { q: "We ___ wear a uniform at school.", choix: ["have to", "has to", "must to"], fr: "Nous devons porter un uniforme à l'école." },
      ] },

    // ---------- AUTONOME ----------
    { id: "present-perfect", niveau: 2, titre: "Le present perfect",
      explication: `<b>have / has + participe passé</b>. Il relie le passé au présent.<br>
        • Expérience : <i>I have never been to Japan.</i><br>
        • Durée qui continue : <b>for</b> + durée (<i>for ten years</i>), <b>since</b> + point de départ (<i>since 2020</i>). ⚠️ En français on dit « depuis » + présent, en anglais present perfect !<br>
        • Avec <b>already, yet, just</b>.`,
      exemples: [["I have lived here for five years.", "J'habite ici depuis cinq ans."], ["She has just left.", "Elle vient de partir."], ["Have you finished yet?", "As-tu déjà fini ?"]],
      exercices: [
        { q: "I have never ___ to Japan.", choix: ["been", "went", "go"], fr: "Je ne suis jamais allé au Japon." },
        { q: "She ___ here since 2020.", choix: ["has lived", "lives", "is living"], fr: "Elle habite ici depuis 2020." },
        { q: "We have known each other ___ ten years.", choix: ["for", "since", "during"], fr: "Nous nous connaissons depuis dix ans." },
        { q: "He has worked here ___ January.", choix: ["since", "for", "from"], fr: "Il travaille ici depuis janvier." },
        { q: "Have you finished ___?", choix: ["yet", "already", "since"], fr: "As-tu déjà fini ?" },
      ] },
    { id: "preterit-perfect", niveau: 2, titre: "Prétérit ou present perfect ?",
      explication: `<b>Prétérit</b> : moment passé <b>précis et terminé</b> (yesterday, in 2019, last week).<br>
        <b>Present perfect</b> : pas de date, ou conséquence sur le présent (<i>I've lost my keys</i> → je ne peux pas rentrer).<br>
        <i>I lost my keys yesterday</i> / <i>I've lost my keys!</i>`,
      exemples: [["I saw him yesterday.", "Je l'ai vu hier."], ["I've seen this film.", "J'ai (déjà) vu ce film."], ["She went to Paris in 2019.", "Elle est allée à Paris en 2019."]],
      exercices: [
        { q: "I ___ him yesterday.", choix: ["saw", "have seen", "has seen"], fr: "Je l'ai vu hier." },
        { q: "Have you ever ___ sushi?", choix: ["eaten", "ate", "eat"], fr: "As-tu déjà mangé des sushis ?" },
        { q: "She ___ to Paris in 2019.", choix: ["went", "has gone", "has been"], fr: "Elle est allée à Paris en 2019." },
        { q: "I ___ my keys! I can't open the door.", choix: ["have lost", "lose", "losed"], fr: "J'ai perdu mes clés ! Je ne peux pas ouvrir la porte." },
        { q: "They ___ married for ten years and they are still happy.", choix: ["have been", "were", "are being"], fr: "Ils sont mariés depuis dix ans et sont toujours heureux." },
      ] },
    { id: "conditionnel", niveau: 2, titre: "Le conditionnel et les hypothèses",
      explication: `<b>would + base</b> = conditionnel : <i>I would travel</i> (je voyagerais).<br>
        Hypothèse : <b>If + prétérit, would + base</b> → <i>If I had money, I would travel.</i><br>
        Avec be on dit <b>were</b> à toutes les personnes : <i>If I were you…</i> (si j'étais toi).<br>
        Politesse : <i>I would like</i> = je voudrais.`,
      exemples: [["If I were rich, I would travel.", "Si j'étais riche, je voyagerais."], ["I'd like a coffee.", "Je voudrais un café."], ["What would you do?", "Que ferais-tu ?"]],
      exercices: [
        { q: "If I ___ rich, I would travel.", choix: ["were", "am", "would be"], fr: "Si j'étais riche, je voyagerais." },
        { q: "If she had time, she ___ help you.", choix: ["would", "will", "would to"], fr: "Si elle avait le temps, elle t'aiderait." },
        { q: "I ___ like a coffee, please.", choix: ["would", "will", "am"], fr: "Je voudrais un café, s'il vous plaît." },
        { q: "What would you do if you ___ the lottery?", choix: ["won", "win", "would win"], fr: "Que ferais-tu si tu gagnais au loto ?" },
      ] },
    { id: "passif", niveau: 2, titre: "La voix passive",
      explication: `<b>be + participe passé</b>. On met en avant ce qui subit l'action. L'auteur est introduit par <b>by</b>.<br>
        Présent : <i>English is spoken here.</i> · Passé : <i>The house was built in 1900.</i>`,
      exemples: [["English is spoken here.", "On parle anglais ici."], ["The car was stolen.", "La voiture a été volée."], ["It was written by Orwell.", "Ça a été écrit par Orwell."]],
      exercices: [
        { q: "This house ___ in 1900.", choix: ["was built", "built", "was build"], fr: "Cette maison a été construite en 1900." },
        { q: "English ___ all over the world.", choix: ["is spoken", "speaks", "is speak"], fr: "L'anglais est parlé dans le monde entier." },
        { q: "The letters ___ every morning.", choix: ["are delivered", "deliver", "is delivered"], fr: "Les lettres sont livrées chaque matin." },
        { q: "The film was directed ___ Spielberg.", choix: ["by", "from", "of"], fr: "Le film a été réalisé par Spielberg." },
        { q: "My car ___ yesterday!", choix: ["was stolen", "stole", "is stealing"], fr: "Ma voiture a été volée hier !" },
      ] },
    { id: "relatifs", niveau: 2, titre: "Les pronoms relatifs",
      explication: `<b>who</b> → personnes · <b>which</b> → choses · <b>that</b> → les deux · <b>whose</b> → dont (possession) · <b>where</b> → où (lieu).`,
      exemples: [["The man who lives here", "L'homme qui habite ici"], ["The book that I read", "Le livre que j'ai lu"], ["The girl whose father is a pilot", "La fille dont le père est pilote"]],
      exercices: [
        { q: "The man ___ lives next door is a doctor.", choix: ["who", "which", "where"], fr: "L'homme qui habite à côté est médecin." },
        { q: "The book ___ I read was great.", choix: ["which", "who", "whose"], fr: "Le livre que j'ai lu était génial." },
        { q: "That's the town ___ I was born.", choix: ["where", "which", "who"], fr: "C'est la ville où je suis né." },
        { q: "The girl ___ father is a pilot is my friend.", choix: ["whose", "who", "which"], fr: "La fille dont le père est pilote est mon amie." },
      ] },
  ],
};
