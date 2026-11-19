// Contenu ITALIEN de Jack Blabla — niveaux 0 (Amateur), 1 (Moyen), 2 (Autonome).
// Les niveaux 3 à 5 (Avancé, Pro, Expert) sont dans contenu/it-pro.js.
// Exercices : le PREMIER choix est toujours la bonne réponse (ils sont mélangés à l'affichage).
// Chaque leçon a son cours écrit complet : explication, astuce (à retenir), pourquoi, pièges, et un « pourquoi » par exercice.

CONTENU.it = {
  pronoms: ["io", "tu", "lui/lei", "noi", "voi", "loro"],
  pronomsFr: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],

  temps: [
    { id: "presente", nom: "Présent (presente)", niveau: 0 },
    { id: "passato", nom: "Passé composé (passato prossimo)", niveau: 1 },
    { id: "futuro", nom: "Futur (futuro semplice)", niveau: 1 },
    { id: "imperfetto", nom: "Imparfait (imperfetto)", niveau: 2 },
    { id: "condizionale", nom: "Conditionnel (condizionale)", niveau: 2 },
  ],

  // Les temps absents de « formes » sont calculés (voir MOTEURS.it dans conjugaison.js).
  verbes: [
    { inf: "essere", fr: "être", niveau: 0, irregulier: true, aux: "essere", participe: "stato", radicalFutur: "sar", formes: {
      presente: ["sono", "sei", "è", "siamo", "siete", "sono"],
      imperfetto: ["ero", "eri", "era", "eravamo", "eravate", "erano"],
      congiuntivo: ["sia", "sia", "sia", "siamo", "siate", "siano"],
      "congiuntivo-imperfetto": ["fossi", "fossi", "fosse", "fossimo", "foste", "fossero"] } },
    { inf: "avere", fr: "avoir", niveau: 0, irregulier: true, radicalFutur: "avr", formes: {
      presente: ["ho", "hai", "ha", "abbiamo", "avete", "hanno"],
      congiuntivo: ["abbia", "abbia", "abbia", "abbiamo", "abbiate", "abbiano"] } },
    { inf: "andare", fr: "aller", niveau: 0, irregulier: true, aux: "essere", radicalFutur: "andr", formes: {
      presente: ["vado", "vai", "va", "andiamo", "andate", "vanno"],
      congiuntivo: ["vada", "vada", "vada", "andiamo", "andiate", "vadano"] } },
    { inf: "fare", fr: "faire", niveau: 0, irregulier: true, base: "facere", participe: "fatto", radicalFutur: "far", formes: {
      presente: ["faccio", "fai", "fa", "facciamo", "fate", "fanno"],
      congiuntivo: ["faccia", "faccia", "faccia", "facciamo", "facciate", "facciano"] } },
    { inf: "stare", fr: "être, rester (ça va)", niveau: 0, irregulier: true, aux: "essere", radicalFutur: "star", formes: {
      presente: ["sto", "stai", "sta", "stiamo", "state", "stanno"],
      congiuntivo: ["stia", "stia", "stia", "stiamo", "stiate", "stiano"],
      "congiuntivo-imperfetto": ["stessi", "stessi", "stesse", "stessimo", "steste", "stessero"] } },
    { inf: "parlare", fr: "parler", niveau: 0 },
    { inf: "abitare", fr: "habiter", niveau: 0 },
    { inf: "mangiare", fr: "manger", niveau: 0 },
    { inf: "lavorare", fr: "travailler", niveau: 0 },
    { inf: "dormire", fr: "dormir", niveau: 0 },
    { inf: "capire", fr: "comprendre", niveau: 0, isc: true },
    { inf: "volere", fr: "vouloir", niveau: 1, irregulier: true, radicalFutur: "vorr", formes: {
      presente: ["voglio", "vuoi", "vuole", "vogliamo", "volete", "vogliono"],
      congiuntivo: ["voglia", "voglia", "voglia", "vogliamo", "vogliate", "vogliano"] } },
    { inf: "potere", fr: "pouvoir", niveau: 1, irregulier: true, radicalFutur: "potr", formes: {
      presente: ["posso", "puoi", "può", "possiamo", "potete", "possono"],
      congiuntivo: ["possa", "possa", "possa", "possiamo", "possiate", "possano"] } },
    { inf: "dovere", fr: "devoir", niveau: 1, irregulier: true, radicalFutur: "dovr", formes: {
      presente: ["devo", "devi", "deve", "dobbiamo", "dovete", "devono"],
      congiuntivo: ["debba", "debba", "debba", "dobbiamo", "dobbiate", "debbano"] } },
    { inf: "venire", fr: "venir", niveau: 1, irregulier: true, aux: "essere", participe: "venuto", radicalFutur: "verr", formes: {
      presente: ["vengo", "vieni", "viene", "veniamo", "venite", "vengono"],
      congiuntivo: ["venga", "venga", "venga", "veniamo", "veniate", "vengano"] } },
    { inf: "dire", fr: "dire", niveau: 1, irregulier: true, base: "dicere", participe: "detto", radicalFutur: "dir", formes: {
      presente: ["dico", "dici", "dice", "diciamo", "dite", "dicono"] } },
    { inf: "sapere", fr: "savoir", niveau: 1, irregulier: true, radicalFutur: "sapr", formes: {
      presente: ["so", "sai", "sa", "sappiamo", "sapete", "sanno"],
      congiuntivo: ["sappia", "sappia", "sappia", "sappiamo", "sappiate", "sappiano"] } },
    { inf: "vedere", fr: "voir", niveau: 1, irregulier: true, participe: "visto", radicalFutur: "vedr" },
    { inf: "prendere", fr: "prendre", niveau: 1, irregulier: true, participe: "preso" },
    { inf: "scrivere", fr: "écrire", niveau: 1, irregulier: true, participe: "scritto" },
    { inf: "arrivare", fr: "arriver", niveau: 1, aux: "essere" },
    { inf: "partire", fr: "partir", niveau: 1, aux: "essere" },
    { inf: "cercare", fr: "chercher", niveau: 1 },
    { inf: "uscire", fr: "sortir", niveau: 2, irregulier: true, aux: "essere", formes: {
      presente: ["esco", "esci", "esce", "usciamo", "uscite", "escono"],
      congiuntivo: ["esca", "esca", "esca", "usciamo", "usciate", "escano"] } },
    { inf: "bere", fr: "boire", niveau: 2, irregulier: true, base: "bevere", radicalFutur: "berr" },
    { inf: "dare", fr: "donner", niveau: 2, irregulier: true, radicalFutur: "dar", formes: {
      presente: ["do", "dai", "dà", "diamo", "date", "danno"],
      congiuntivo: ["dia", "dia", "dia", "diamo", "diate", "diano"],
      "congiuntivo-imperfetto": ["dessi", "dessi", "desse", "dessimo", "deste", "dessero"] } },
    { inf: "rimanere", fr: "rester", niveau: 2, irregulier: true, aux: "essere", participe: "rimasto", radicalFutur: "rimarr", formes: {
      presente: ["rimango", "rimani", "rimane", "rimaniamo", "rimanete", "rimangono"],
      congiuntivo: ["rimanga", "rimanga", "rimanga", "rimaniamo", "rimaniate", "rimangano"] } },
    { inf: "leggere", fr: "lire", niveau: 2, irregulier: true, participe: "letto" },
    { inf: "mettere", fr: "mettre", niveau: 2, irregulier: true, participe: "messo" },
    { inf: "vivere", fr: "vivre", niveau: 2, irregulier: true, participe: "vissuto", radicalFutur: "vivr" },
    { inf: "finire", fr: "finir", niveau: 2, isc: true },
    { inf: "pagare", fr: "payer", niveau: 2 },
  ],

  irreguliers: {
    colonnes: ["Infinitif", "Présent (io)", "Participe passé", "Futur (io)"],
    lignes: [
      // [infinitif, présent io, participe, futur io, français, niveau]
      ["essere", "sono", "stato", "sarò", "être", 0], ["avere", "ho", "avuto", "avrò", "avoir", 0],
      ["andare", "vado", "andato", "andrò", "aller", 0], ["fare", "faccio", "fatto", "farò", "faire", 0],
      ["stare", "sto", "stato", "starò", "être, rester", 0], ["dare", "do", "dato", "darò", "donner", 0],
      ["dire", "dico", "detto", "dirò", "dire", 0], ["venire", "vengo", "venuto", "verrò", "venir", 0],
      ["volere", "voglio", "voluto", "vorrò", "vouloir", 1], ["potere", "posso", "potuto", "potrò", "pouvoir", 1],
      ["dovere", "devo", "dovuto", "dovrò", "devoir", 1], ["sapere", "so", "saputo", "saprò", "savoir", 1],
      ["uscire", "esco", "uscito", "uscirò", "sortir", 1], ["bere", "bevo", "bevuto", "berrò", "boire", 1],
      ["vedere", "vedo", "visto", "vedrò", "voir", 1], ["prendere", "prendo", "preso", "prenderò", "prendre", 1],
      ["mettere", "metto", "messo", "metterò", "mettre", 2], ["leggere", "leggo", "letto", "leggerò", "lire", 2],
      ["scrivere", "scrivo", "scritto", "scriverò", "écrire", 2], ["aprire", "apro", "aperto", "aprirò", "ouvrir", 2],
      ["chiudere", "chiudo", "chiuso", "chiuderò", "fermer", 2], ["rimanere", "rimango", "rimasto", "rimarrò", "rester", 2],
      ["vivere", "vivo", "vissuto", "vivrò", "vivre", 2], ["conoscere", "conosco", "conosciuto", "conoscerò", "connaître", 3],
      ["scegliere", "scelgo", "scelto", "sceglierò", "choisir", 3], ["decidere", "decido", "deciso", "deciderò", "décider", 3],
      ["rispondere", "rispondo", "risposto", "risponderò", "répondre", 3], ["perdere", "perdo", "perso", "perderò", "perdre", 4],
      ["spendere", "spendo", "speso", "spenderò", "dépenser", 4], ["piacere", "piaccio", "piaciuto", "piacerò", "plaire", 4],
      ["nascere", "nasco", "nato", "nascerò", "naître", 5], ["morire", "muoio", "morto", "morirò", "mourir", 5],
      ["tradurre", "traduco", "tradotto", "tradurrò", "traduire", 5],
    ],
  },

  themes: [
    // ---------- AMATEUR ----------
    { id: "salut", niveau: 0, titre: "Dire bonjour", emoji: "👋",
      mots: [["Salut", "Ciao"], ["Bonjour", "Buongiorno"], ["Bonsoir", "Buonasera"], ["Au revoir", "Arrivederci"], ["Merci", "Grazie"],
        ["S'il vous plaît", "Per favore"], ["De rien", "Prego"], ["Oui", "Sì"], ["Non", "No"], ["Comment ça va ?", "Come stai?"], ["Ça va bien", "Sto bene"]],
      dialogue: [
        { who: "jack", txt: "Ciao! Come stai?", fr: "Salut ! Comment ça va ?" },
        { who: "toi", choices: ["Sto bene, grazie!", "Arrivederci!", "Dov'è la stazione?"], fr: "Ça va bien, merci !" },
        { who: "jack", txt: "Benissimo! A presto!", fr: "Très bien ! À bientôt !" },
        { who: "toi", choices: ["Ciao, a presto!", "Un caffè, per favore", "Sì"], fr: "Salut, à bientôt !" },
      ] },
    { id: "moi", niveau: 0, titre: "Se présenter", emoji: "🙋",
      mots: [["Je m'appelle…", "Mi chiamo…"], ["J'ai … ans", "Ho … anni"], ["Je suis français", "Sono francese"], ["J'habite à Paris", "Abito a Parigi"],
        ["Enchanté", "Piacere"], ["Et toi ?", "E tu?"], ["Je parle un peu italien", "Parlo un po' di italiano"]],
      dialogue: [
        { who: "jack", txt: "Ciao! Mi chiamo Jack. Come ti chiami?", fr: "Salut ! Je m'appelle Jack. Comment tu t'appelles ?" },
        { who: "toi", choices: ["Mi chiamo Léa.", "Sono vent'anni.", "Il conto."], fr: "Je m'appelle Léa." },
        { who: "jack", txt: "Piacere! Dove abiti?", fr: "Enchanté ! Où habites-tu ?" },
        { who: "toi", choices: ["Abito a Parigi.", "Grazie.", "Sempre dritto."], fr: "J'habite à Paris." },
      ] },
    { id: "chiffres", niveau: 0, titre: "Les chiffres", emoji: "🔢",
      mots: [["un", "uno"], ["deux", "due"], ["trois", "tre"], ["quatre", "quattro"], ["cinq", "cinque"], ["six", "sei"],
        ["sept", "sette"], ["huit", "otto"], ["neuf", "nove"], ["dix", "dieci"], ["vingt", "venti"], ["cent", "cento"]],
      dialogue: [
        { who: "jack", txt: "Quanti anni hai?", fr: "Quel âge as-tu ?" },
        { who: "toi", choices: ["Ho vent'anni.", "Sono vent'anni.", "Ciao."], fr: "J'ai vingt ans." },
        { who: "jack", txt: "Uno, due, tre… e poi?", fr: "Un, deux, trois… et après ?" },
        { who: "toi", choices: ["Quattro!", "Sette!", "Dieci!"], fr: "Quatre !" },
      ] },
    { id: "famille", niveau: 0, titre: "La famille", emoji: "👨‍👩‍👧",
      mots: [["La mère", "La madre"], ["Le père", "Il padre"], ["Le frère", "Il fratello"], ["La sœur", "La sorella"], ["Le fils", "Il figlio"],
        ["La fille", "La figlia"], ["La grand-mère", "La nonna"], ["Le grand-père", "Il nonno"], ["Le mari", "Il marito"],
        ["La femme (épouse)", "La moglie"], ["L'enfant", "Il bambino"], ["L'ami", "L'amico"]],
      dialogue: [
        { who: "jack", txt: "Hai fratelli o sorelle?", fr: "As-tu des frères ou des sœurs ?" },
        { who: "toi", choices: ["Sì, ho una sorella.", "Sì, sono una sorella.", "No, sono stanco."], fr: "Oui, j'ai une sœur." },
        { who: "jack", txt: "Come si chiama?", fr: "Comment s'appelle-t-elle ?" },
        { who: "toi", choices: ["Si chiama Emma.", "Mi chiamo Emma.", "La chiama Emma."], fr: "Elle s'appelle Emma." },
      ] },
    { id: "cafe", niveau: 0, titre: "Au café", emoji: "☕",
      mots: [["Un café, s'il vous plaît", "Un caffè, per favore"], ["Un verre d'eau", "Un bicchiere d'acqua"], ["Un thé", "Un tè"], ["Un croissant", "Un cornetto"],
        ["L'addition", "Il conto"], ["Combien ça coûte ?", "Quanto costa?"], ["Je voudrais…", "Vorrei…"], ["C'est délicieux", "È buonissimo"]],
      dialogue: [
        { who: "jack", txt: "Buongiorno! Cosa prende?", fr: "Bonjour ! Que prenez-vous ?" },
        { who: "toi", choices: ["Un caffè e un cornetto, per favore.", "Mi sono perso.", "A sinistra."], fr: "Un café et un croissant, s'il vous plaît." },
        { who: "jack", txt: "Ecco a lei!", fr: "Voilà !" },
        { who: "toi", choices: ["Grazie! Quanto costa?", "Mi chiamo Jack.", "No."], fr: "Merci ! Combien ça coûte ?" },
        { who: "jack", txt: "Tre euro, grazie.", fr: "Trois euros, merci." },
      ] },
    { id: "voyage", niveau: 0, titre: "En voyage", emoji: "✈️",
      mots: [["Où est la gare ?", "Dov'è la stazione?"], ["L'aéroport", "L'aeroporto"], ["L'hôtel", "L'albergo"], ["À gauche", "A sinistra"],
        ["À droite", "A destra"], ["Tout droit", "Sempre dritto"], ["Je suis perdu", "Mi sono perso"], ["Aidez-moi", "Mi aiuti"]],
      dialogue: [
        { who: "jack", txt: "Buongiorno, posso aiutarla?", fr: "Bonjour, je peux vous aider ?" },
        { who: "toi", choices: ["Sì! Dov'è la stazione?", "Un tè, per favore.", "Sono francese."], fr: "Oui ! Où est la gare ?" },
        { who: "jack", txt: "Sempre dritto e poi a sinistra.", fr: "Tout droit puis à gauche." },
        { who: "toi", choices: ["Grazie mille!", "Quanti anni hai?", "Ciao."], fr: "Merci beaucoup !" },
      ] },

    // ---------- MOYEN ----------
    { id: "meteo", niveau: 1, titre: "Le temps et la météo", emoji: "🌦️",
      mots: [["Quelle heure est-il ?", "Che ore sono?"], ["Il fait beau", "Fa bel tempo"], ["Il pleut", "Piove"], ["Il fait froid", "Fa freddo"],
        ["Il fait chaud", "Fa caldo"], ["Aujourd'hui", "Oggi"], ["Demain", "Domani"], ["Hier", "Ieri"], ["La semaine", "La settimana"],
        ["Lundi", "Lunedì"], ["Le week-end", "Il fine settimana"]],
      dialogue: [
        { who: "jack", txt: "Che tempo ha fatto ieri?", fr: "Quel temps a-t-il fait hier ?" },
        { who: "toi", choices: ["Ha fatto freddo e ha piovuto.", "Fa freddo domani.", "Sono freddo, grazie."], fr: "Il a fait froid et il a plu." },
        { who: "jack", txt: "E cosa farai questo fine settimana?", fr: "Et que feras-tu ce week-end ?" },
        { who: "toi", choices: ["Andrò a trovare i miei genitori.", "Ho andato dai miei genitori.", "Andare i miei genitori."], fr: "J'irai voir mes parents." },
      ] },
    { id: "ville", niveau: 1, titre: "En ville et shopping", emoji: "🛍️",
      mots: [["La boutique", "Il negozio"], ["Le marché", "Il mercato"], ["La banque", "La banca"], ["La pharmacie", "La farmacia"],
        ["Je cherche…", "Cerco…"], ["C'est trop cher", "È troppo caro"], ["Je peux payer par carte ?", "Posso pagare con la carta?"],
        ["La taille", "La taglia"], ["Je le prends", "Lo prendo"], ["Ouvert", "Aperto"], ["Fermé", "Chiuso"]],
      dialogue: [
        { who: "jack", txt: "Buongiorno! Posso aiutarla?", fr: "Bonjour ! Je peux vous aider ?" },
        { who: "toi", choices: ["Sì, cerco una giacca.", "Sì, cerco a una giacca ieri.", "Sì, sono una giacca."], fr: "Oui, je cherche une veste." },
        { who: "jack", txt: "Questa costa cinquanta euro.", fr: "Celle-ci coûte cinquante euros." },
        { who: "toi", choices: ["Perfetto, la prendo. Posso pagare con la carta?", "È troppo molto caro.", "Lo ho preso domani."], fr: "Parfait, je la prends. Je peux payer par carte ?" },
      ] },
    { id: "travail", niveau: 1, titre: "Au travail", emoji: "💼",
      mots: [["Le travail", "Il lavoro"], ["Le bureau", "L'ufficio"], ["Le collègue", "Il collega"], ["Le patron", "Il capo"],
        ["La réunion", "La riunione"], ["Le salaire", "Lo stipendio"], ["Je travaille dans…", "Lavoro in…"], ["Envoyer un e-mail", "Mandare un'e-mail"],
        ["Être en retard", "Essere in ritardo"], ["Une pause", "Una pausa"]] },
    { id: "sante", niveau: 1, titre: "Santé et corps", emoji: "🩺",
      mots: [["La tête", "La testa"], ["Le ventre", "La pancia"], ["Le dos", "La schiena"], ["La main", "La mano"], ["Le pied", "Il piede"],
        ["J'ai mal à la tête", "Ho mal di testa"], ["Le médecin", "Il medico"], ["Le médicament", "La medicina"],
        ["Je suis malade", "Sono malato"], ["Je suis fatigué", "Sono stanco"]],
      dialogue: [
        { who: "jack", txt: "Che cos'hai?", fr: "Qu'est-ce que tu as ?" },
        { who: "toi", choices: ["Ho mal di testa e sono stanco.", "Sono mal di testa.", "Ho stanco."], fr: "J'ai mal à la tête et je suis fatigué." },
        { who: "jack", txt: "Dovresti andare dal medico.", fr: "Tu devrais aller chez le médecin." },
        { who: "toi", choices: ["Hai ragione, lo chiamo.", "Sei ragione, lo chiamo.", "Hai ragione, chiamo lo."], fr: "Tu as raison, je l'appelle." },
      ] },
    { id: "loisirs", niveau: 1, titre: "Loisirs", emoji: "🎸",
      mots: [["Le sport", "Lo sport"], ["La musique", "La musica"], ["Le film", "Il film"], ["Lire", "Leggere"], ["Nager", "Nuotare"],
        ["Voyager", "Viaggiare"], ["Cuisiner", "Cucinare"], ["J'aime…", "Mi piace…"], ["Je préfère…", "Preferisco…"],
        ["Qu'est-ce que tu fais le week-end ?", "Cosa fai nel fine settimana?"]] },

    // ---------- AUTONOME ----------
    { id: "opinions", niveau: 2, titre: "Opinions et émotions", emoji: "💭",
      mots: [["À mon avis", "Secondo me"], ["Je suis d'accord", "Sono d'accordo"], ["Je ne suis pas d'accord", "Non sono d'accordo"],
        ["Ça dépend", "Dipende"], ["Heureux", "Felice"], ["Triste", "Triste"], ["Inquiet", "Preoccupato"], ["Déçu", "Deluso"],
        ["Fier", "Orgoglioso"], ["J'en ai marre", "Sono stufo"]],
      dialogue: [
        { who: "jack", txt: "Secondo te, i social fanno bene ai ragazzi?", fr: "D'après toi, les réseaux sociaux font du bien aux jeunes ?" },
        { who: "toi", choices: ["Dipende. Secondo me possono essere utili, però…", "Sono d'accordo di no.", "Secondo me è dipende."], fr: "Ça dépend. À mon avis ils peuvent être utiles, mais…" },
        { who: "jack", txt: "Quindi sei un po' preoccupato?", fr: "Donc tu es un peu inquiet ?" },
        { who: "toi", choices: ["Sì, perché ci passano troppo tempo.", "Sì, perché ne passano troppo tempo.", "Sì, perché passano ci troppo tempo."], fr: "Oui, parce qu'ils y passent trop de temps." },
      ] },
    { id: "connecteurs", niveau: 2, titre: "Les connecteurs", emoji: "🔗",
      mots: [["Cependant", "Tuttavia"], ["Donc", "Quindi"], ["En revanche", "Invece"], ["Grâce à", "Grazie a"], ["À cause de", "A causa di"],
        ["Bien que", "Benché"], ["Afin de", "Al fine di"], ["Enfin", "Infine"], ["De plus", "Inoltre"], ["Par exemple", "Per esempio"]] },
    { id: "societe", niveau: 2, titre: "Société et actualité", emoji: "📰",
      mots: [["L'environnement", "L'ambiente"], ["Le gouvernement", "Il governo"], ["Les élections", "Le elezioni"], ["Le chômage", "La disoccupazione"],
        ["Le réchauffement climatique", "Il riscaldamento globale"], ["La santé publique", "La sanità pubblica"], ["Les réseaux sociaux", "I social network"],
        ["L'égalité", "L'uguaglianza"], ["La pollution", "L'inquinamento"], ["La recherche", "La ricerca"]] },
    { id: "pro", niveau: 2, titre: "Vie professionnelle", emoji: "📈",
      mots: [["Un entretien d'embauche", "Un colloquio di lavoro"], ["Le CV", "Il curriculum"], ["Les compétences", "Le competenze"], ["Postuler", "Candidarsi"],
        ["Embaucher", "Assumere"], ["Démissionner", "Dimettersi"], ["Une augmentation", "Un aumento di stipendio"], ["Un contrat", "Un contratto"],
        ["Un délai", "Una scadenza"], ["Négocier", "Negoziare"]],
      dialogue: [
        { who: "jack", txt: "Perché si è candidato per questo posto?", fr: "Pourquoi avez-vous postulé à ce poste ?" },
        { who: "toi", choices: ["Perché le mie competenze corrispondono a ciò che cercate.", "Perché ho candidato ieri.", "Perché voglio più i soldi."], fr: "Parce que mes compétences correspondent à ce que vous cherchez." },
        { who: "jack", txt: "Che cosa ha fatto negli ultimi due anni?", fr: "Qu'avez-vous fait ces deux dernières années ?" },
        { who: "toi", choices: ["Ho lavorato come responsabile di progetto.", "Sono lavorato come responsabile.", "Lavoro responsabile da due anni fa."], fr: "J'ai travaillé comme chef de projet." },
      ] },
    { id: "expressions", niveau: 2, titre: "Expressions idiomatiques", emoji: "🎭",
      mots: [["Il pleut des cordes", "Piove a catinelle"], ["Ce n'est pas ma tasse de thé", "Non è il mio genere"],
        ["Coûter les yeux de la tête", "Costare un occhio della testa"], ["Briser la glace", "Rompere il ghiaccio"], ["Être dans la lune", "Avere la testa tra le nuvole"],
        ["Faire d'une pierre deux coups", "Prendere due piccioni con una fava"], ["C'est du gâteau", "È una passeggiata"],
        ["Je l'ai sur le bout de la langue", "Ce l'ho sulla punta della lingua"], ["Croiser les doigts", "Incrociare le dita"]] },
  ],

  grammaire: [
    // ---------- AMATEUR ----------
    { id: "articoli", niveau: 0, titre: "Les articles : il, lo, la, l', i, gli, le",
      astuce: "il devant une consonne, lo devant s + consonne / z / gn / ps, l' devant une voyelle ; au pluriel i, gli, le.",
      explication: `L'italien a <b>plus d'articles</b> que le français, et le choix dépend de la <b>première lettre</b> du mot.<br>
        <b>Masculin</b> : <b>il</b> (il libro) · <b>lo</b> devant s + consonne, z, gn, ps, y (lo studente, lo zaino) · <b>l'</b> devant une voyelle (l'amico).<br>
        Pluriel : il → <b>i</b> (i libri) · lo et l' → <b>gli</b> (gli studenti, gli amici).<br>
        <b>Féminin</b> : <b>la</b> (la casa) · <b>l'</b> devant voyelle (l'amica) · pluriel <b>le</b> (le case, le amiche).<br>
        Article indéfini : <b>un</b> / <b>uno</b> (mêmes règles que lo) / <b>una</b> / <b>un'</b> devant voyelle féminine.`,
      pourquoi: "L'italien cherche à rendre la prononciation fluide : « il studente » serait difficile à dire, d'où <b>lo</b> studente. C'est l'oreille qui a créé la règle : regarde toujours la première lettre du mot qui suit.",
      pieges: [["il studente", "lo studente", "s + consonne → lo."], ["i amici", "gli amici", "Devant une voyelle, le masculin pluriel est gli."], ["una amica", "un'amica", "Devant une voyelle, una s'élide : un'."]],
      exemples: [["il libro, i libri", "le livre, les livres"], ["lo studente, gli studenti", "l'étudiant, les étudiants"], ["l'amica, le amiche", "l'amie, les amies"]],
      exercices: [
        { q: "___ libro", choix: ["il", "lo", "la"], fr: "le livre", pourquoi: "libro commence par une consonne simple → il." },
        { q: "___ studente", choix: ["lo", "il", "gli"], fr: "l'étudiant", pourquoi: "s + consonne (st-) → lo." },
        { q: "___ amica", choix: ["l'", "la", "lo"], fr: "l'amie", pourquoi: "Devant une voyelle, la devient l'." },
        { q: "___ zii", choix: ["gli", "i", "le"], fr: "les oncles", pourquoi: "Au singulier on dit lo zio (z) → au pluriel gli." },
        { q: "___ case", choix: ["le", "i", "gli"], fr: "les maisons", pourquoi: "Féminin pluriel → le." },
      ] },
    { id: "essere-avere", niveau: 0, titre: "Essere et avere (être et avoir)",
      astuce: "essere : sono, sei, è, siamo, siete, sono · avere : ho, hai, ha, abbiamo, avete, hanno (le h ne se prononce pas).",
      explication: `<b>essere</b> (être) : io <b>sono</b>, tu <b>sei</b>, lui/lei <b>è</b>, noi <b>siamo</b>, voi <b>siete</b>, loro <b>sono</b>.<br>
        <b>avere</b> (avoir) : io <b>ho</b>, tu <b>hai</b>, lui/lei <b>ha</b>, noi <b>abbiamo</b>, voi <b>avete</b>, loro <b>hanno</b>.<br>
        Bonne nouvelle : comme en français, on dit <i>ho vent'anni</i> (j'ai 20 ans), <i>ho fame</i> (j'ai faim), <i>ho freddo</i> (j'ai froid).<br>
        ⚠️ <b>è</b> (il est) prend un accent ; <b>e</b> sans accent veut dire « et ».`,
      pourquoi: "Ce sont les deux verbes les plus utilisés, et ils servent aussi d'auxiliaires pour le passé (ho mangiato, sono andato). Le h de ho, hai, ha, hanno ne se prononce jamais : il sert juste à les distinguer de o (ou), ai (aux), a (à), anno (année).",
      pieges: [["Sono 20 anni.", "Ho 20 anni.", "L'âge se dit avec avere, comme en français."], ["Lui e stanco.", "Lui è stanco.", "è (est) prend un accent, e = et."]],
      exemples: [["Sono francese.", "Je suis français."], ["Ho una sorella.", "J'ai une sœur."], ["Abbiamo fame.", "Nous avons faim."]],
      exercices: [
        { q: "Io ___ francese.", choix: ["sono", "ho", "è"], fr: "Je suis français.", pourquoi: "La nationalité se dit avec essere : io sono." },
        { q: "Noi ___ una casa al mare.", choix: ["abbiamo", "siamo", "hanno"], fr: "Nous avons une maison à la mer.", pourquoi: "Posséder → avere ; avec noi : abbiamo." },
        { q: "Lei ___ medico.", choix: ["è", "ha", "sei"], fr: "Elle est médecin.", pourquoi: "Le métier → essere ; lei → è (avec accent)." },
        { q: "Tu ___ fame?", choix: ["hai", "sei", "ha"], fr: "Tu as faim ?", pourquoi: "Avoir faim = avere fame, comme en français ; tu → hai." },
        { q: "Loro ___ stanchi.", choix: ["sono", "hanno", "siamo"], fr: "Ils sont fatigués.", pourquoi: "Un état → essere ; loro → sono." },
      ] },
    { id: "presente", niveau: 0, titre: "Le présent des verbes réguliers",
      astuce: "-are : o, i, a, iamo, ate, ano · -ere : o, i, e, iamo, ete, ono · -ire : o, i, e, iamo, ite, ono. Le pronom sujet est souvent omis.",
      explication: `Trois groupes : <b>-are</b> (parlare), <b>-ere</b> (prendere), <b>-ire</b> (dormire).<br>
        parlare : parl<b>o</b>, parl<b>i</b>, parl<b>a</b>, parl<b>iamo</b>, parl<b>ate</b>, parl<b>ano</b><br>
        prendere : prend<b>o</b>, prend<b>i</b>, prend<b>e</b>, prend<b>iamo</b>, prend<b>ete</b>, prend<b>ono</b><br>
        dormire : dorm<b>o</b>, dorm<b>i</b>, dorm<b>e</b>, dorm<b>iamo</b>, dorm<b>ite</b>, dorm<b>ono</b><br>
        Beaucoup de verbes en -ire ajoutent <b>-isc-</b> : capire → cap<b>isco</b>, cap<b>isci</b>, cap<b>isce</b>, capiamo, capite, cap<b>iscono</b>.<br>
        Comme en espagnol, on dit simplement <i>parlo</i> (je parle) : le pronom ne sert qu'à insister.`,
      pourquoi: "La terminaison dit déjà qui fait l'action : -o = io, -iamo = noi… Le pronom devient inutile, et le répéter fait « traduit du français ». Retiens le -iamo de noi : il est le même pour les trois groupes.",
      pieges: [["Io parlo, io mangio, io lavoro…", "Parlo, mangio, lavoro…", "Le pronom sujet est inutile en temps normal."], ["Tu mangii.", "Tu mangi.", "Dans mangiare, le i ne se double pas."], ["Capo l'italiano.", "Capisco l'italiano.", "capire prend -isc- : capisco."]],
      exemples: [["Parlo italiano.", "Je parle italien."], ["Dove abiti?", "Où habites-tu ?"], ["Non capisco.", "Je ne comprends pas."]],
      exercices: [
        { q: "Io ___ italiano.", choix: ["parlo", "parla", "parli"], fr: "Je parle italien.", pourquoi: "io → terminaison -o : parlo." },
        { q: "Noi ___ a Roma.", choix: ["abitiamo", "abitamo", "abitano"], fr: "Nous habitons à Rome.", pourquoi: "noi → -iamo pour tous les groupes." },
        { q: "Tu ___ la pasta?", choix: ["mangi", "mangii", "mangia"], fr: "Tu manges des pâtes ?", pourquoi: "tu → -i ; dans mangiare le i ne se double pas : mangi." },
        { q: "Loro ___ alle otto.", choix: ["partono", "partano", "partiamo"], fr: "Ils partent à huit heures.", pourquoi: "Verbe en -ire, loro → -ono : partono." },
        { q: "Lei ___ bene il francese.", choix: ["capisce", "cape", "capiscono"], fr: "Elle comprend bien le français.", pourquoi: "capire prend -isc- : lei capisce." },
      ] },
    { id: "plurale", niveau: 0, titre: "Le pluriel des noms",
      astuce: "-o → -i, -a → -e, -e → -i. Les mots accentués et les mots étrangers ne changent pas.",
      explication: `En italien on ne met pas de -s : c'est la <b>voyelle finale</b> qui change.<br>
        <b>-o → -i</b> : il libro → i libri · <b>-a → -e</b> : la casa → le case · <b>-e → -i</b> : il fiore → i fiori, la chiave → le chiavi.<br>
        <b>Invariables</b> : les mots qui finissent par une voyelle accentuée (la città → le città, il caffè → i caffè) et les mots étrangers (il film → i film, lo sport → gli sport).<br>
        Quelques irréguliers : l'uomo → gli uomini, la mano → le mani, l'uovo → le uova.`,
      pourquoi: "L'italien vient du latin, qui marquait le pluriel par la voyelle finale. C'est pour ça qu'on entend « spaghetti » (pluriel de spaghetto) ou « paparazzi » !",
      pieges: [["due libros", "due libri", "Jamais de -s : -o devient -i."], ["le cittè", "le città", "Les mots accentués ne changent pas."], ["i films", "i film", "Les mots étrangers restent invariables."]],
      exemples: [["due libri", "deux livres"], ["tre case", "trois maisons"], ["le città italiane", "les villes italiennes"]],
      exercices: [
        { q: "un libro, due ___", choix: ["libri", "libre", "libros"], fr: "un livre, deux livres", pourquoi: "-o → -i." },
        { q: "una casa, due ___", choix: ["case", "casi", "cases"], fr: "une maison, deux maisons", pourquoi: "-a → -e." },
        { q: "un fiore, tre ___", choix: ["fiori", "fiore", "fiores"], fr: "une fleur, trois fleurs", pourquoi: "-e → -i, au masculin comme au féminin." },
        { q: "una città, due ___", choix: ["città", "cittè", "cittàs"], fr: "une ville, deux villes", pourquoi: "Mot accentué sur la dernière voyelle → invariable." },
        { q: "un film, due ___", choix: ["film", "filmi", "films"], fr: "un film, deux films", pourquoi: "Mot étranger → invariable." },
      ] },
    { id: "c-e", niveau: 0, titre: "C'è et ci sono (il y a)",
      astuce: "c'è + singulier, ci sono + pluriel = il y a.",
      explication: `<b>c'è</b> (= ci è) + singulier : <i>C'è un bar.</i> (Il y a un bar.)<br>
        <b>ci sono</b> + pluriel : <i>Ci sono due farmacie.</i> (Il y a deux pharmacies.)<br>
        Négation : <i>Non c'è latte.</i> · Question : <i>C'è una banca qui?</i> (seule l'intonation change).`,
      pourquoi: "Mot à mot, c'è veut dire « là est ». Comme en anglais (there is / there are), on accorde avec ce qui suit. On n'utilise jamais avere pour dire « il y a ».",
      pieges: [["Ha un gatto nel giardino.", "C'è un gatto nel giardino.", "« Il y a » ne se dit jamais avec avere."], ["C'è due bar.", "Ci sono due bar.", "Pluriel → ci sono."]],
      exemples: [["C'è un problema.", "Il y a un problème."], ["Ci sono molti turisti.", "Il y a beaucoup de touristes."], ["Non c'è tempo.", "Il n'y a pas le temps."]],
      exercices: [
        { q: "___ un bar qui vicino.", choix: ["C'è", "Ci sono", "È"], fr: "Il y a un bar près d'ici.", pourquoi: "Un bar (singulier) → c'è." },
        { q: "___ due farmacie in centro.", choix: ["Ci sono", "C'è", "Sono"], fr: "Il y a deux pharmacies dans le centre.", pourquoi: "Deux pharmacies (pluriel) → ci sono." },
        { q: "Non ___ latte.", choix: ["c'è", "ci sono", "è"], fr: "Il n'y a pas de lait.", pourquoi: "Le lait est singulier → c'è." },
        { q: "___ una banca qui?", choix: ["C'è", "Ci sono", "Ha"], fr: "Y a-t-il une banque ici ?", pourquoi: "Question = même forme que l'affirmation : c'è." },
      ] },
    { id: "piacere", niveau: 0, titre: "Piacere (aimer)",
      astuce: "mi piace + singulier ou verbe ; mi piacciono + pluriel. Ce qu'on aime est le sujet.",
      explication: `Mot à mot <i>mi piace</i> = « ça me plaît ». Le verbe s'accorde avec <b>ce qu'on aime</b> :<br>
        <b>mi piace</b> + singulier ou infinitif : <i>Mi piace la pizza. Mi piace ballare.</i><br>
        <b>mi piacciono</b> + pluriel : <i>Mi piacciono i gatti.</i><br>
        Pronoms : mi, ti, <b>gli</b> (à lui), <b>le</b> (à elle), ci, vi, gli (à eux).`,
      pourquoi: "C'est la même logique que gustar en espagnol ou « plaire » en français : la chose aimée commande le verbe. Pense « la pizza me plaît » et tout devient naturel.",
      pieges: [["Io piaccio la pizza.", "Mi piace la pizza.", "Toujours mi / ti / gli… + piace."], ["Mi piace i gatti.", "Mi piacciono i gatti.", "Pluriel → piacciono."], ["A Giulia gli piace.", "A Giulia piace. / Le piace.", "À elle → le (gli = à lui)."]],
      exemples: [["Mi piace il gelato.", "J'aime la glace."], ["Ti piacciono i film italiani?", "Tu aimes les films italiens ?"], ["Le piace leggere.", "Elle aime lire."]],
      exercices: [
        { q: "Mi ___ la pizza.", choix: ["piace", "piacciono", "piaccio"], fr: "J'aime la pizza.", pourquoi: "La pizza (singulier) → piace." },
        { q: "Mi ___ i gatti.", choix: ["piacciono", "piace", "piaci"], fr: "J'aime les chats.", pourquoi: "Les chats (pluriel) → piacciono." },
        { q: "Ti ___ ballare?", choix: ["piace", "piacciono", "piaci"], fr: "Tu aimes danser ?", pourquoi: "Avec un verbe → piace (singulier)." },
        { q: "A Marco ___ piace il calcio.", choix: ["gli", "le", "lo"], fr: "Marco aime le foot.", pourquoi: "À lui → gli." },
        { q: "A Giulia ___ piace leggere.", choix: ["le", "gli", "la"], fr: "Giulia aime lire.", pourquoi: "À elle → le." },
      ] },

    // ---------- MOYEN ----------
    { id: "passato-prossimo", niveau: 1, titre: "Le passé composé (passato prossimo)",
      astuce: "avere ou essere + participe passé. Avec essere, le participe s'accorde : è andata, sono andati.",
      explication: `Comme en français : <b>auxiliaire + participe</b>. Participes réguliers : -are → <b>-ato</b>, -ere → <b>-uto</b>, -ire → <b>-ito</b>.<br>
        <b>avere</b> pour la plupart des verbes : <i>Ho mangiato.</i><br>
        <b>essere</b> pour les déplacements, les changements d'état, les verbes pronominaux et essere lui-même : <i>Sono andato, è nata, mi sono svegliato, sono stato.</i><br>
        Avec essere, le participe <b>s'accorde</b> : <i>Maria è andata, i ragazzi sono partiti.</i><br>
        Participes irréguliers fréquents : fatto, detto, scritto, letto, visto, preso, messo, stato.`,
      pourquoi: "Le passé composé italien fonctionne presque comme le nôtre, mais attention : <b>essere</b> a son propre passé composé avec essere (sono stato = j'ai été), et beaucoup de verbes de changement (cambiare, cominciare…) peuvent prendre essere.",
      pieges: [["Ho andato al cinema.", "Sono andato al cinema.", "Déplacement → essere, comme en français."], ["Lei è andato.", "Lei è andata.", "Avec essere, le participe s'accorde."], ["Ho stato a Roma.", "Sono stato a Roma.", "essere se conjugue avec essere : sono stato (j'ai été)."]],
      exemples: [["Ho mangiato una pizza.", "J'ai mangé une pizza."], ["Siamo arrivati ieri.", "Nous sommes arrivés hier."], ["Sono stata a Firenze.", "J'ai été (je suis allée) à Florence."]],
      exercices: [
        { q: "Ieri ___ mangiato la pizza.", choix: ["ho", "sono", "è"], fr: "Hier j'ai mangé une pizza.", pourquoi: "mangiare est un verbe d'action avec COD → avere." },
        { q: "Maria è ___ a Roma.", choix: ["andata", "andato", "andati"], fr: "Maria est allée à Rome.", pourquoi: "Avec essere, accord au féminin : andata." },
        { q: "Noi ___ arrivati tardi.", choix: ["siamo", "abbiamo", "sono"], fr: "Nous sommes arrivés tard.", pourquoi: "Déplacement → essere ; noi → siamo." },
        { q: "Hai ___ la lettera?", choix: ["scritto", "scrivuto", "scrivato"], fr: "As-tu écrit la lettre ?", pourquoi: "scrivere a un participe irrégulier : scritto." },
        { q: "Sono ___ a Napoli l'anno scorso.", choix: ["stato", "avuto", "essuto"], fr: "J'ai été à Naples l'an dernier.", pourquoi: "Participe de essere = stato, avec l'auxiliaire essere." },
      ] },
    { id: "preposizioni", niveau: 1, titre: "Les prépositions contractées (al, del, nel…)",
      astuce: "di, a, da, in, su + article se collent : del, al, dal, nel, sul (dello, alla, nell', sugli…).",
      explication: `Comme « à + le = au » en français, l'italien colle les prépositions <b>di, a, da, in, su</b> à l'article :<br>
        di + il = <b>del</b> · a + il = <b>al</b> · da + il = <b>dal</b> · in + il = <b>nel</b> · su + il = <b>sul</b><br>
        Avec la → della, alla, dalla, nella, sulla · avec l' → dell', all', dall', nell', sull' · avec i → dei, ai, dai, nei, sui.<br>
        <b>da</b> sert aussi à dire « chez » : <i>vado dal medico</i> (je vais chez le médecin).`,
      pourquoi: "C'est le même phénomène qu'en français (au, du, des), mais il touche cinq prépositions. Les maîtriser rend tes phrases immédiatement plus naturelles.",
      pieges: [["Vado a il cinema.", "Vado al cinema.", "a + il = al."], ["Le chiavi sono in la borsa.", "Le chiavi sono nella borsa.", "in + la = nella."], ["Vado chez il medico.", "Vado dal medico.", "« Chez quelqu'un » = da."]],
      exemples: [["Vado al mare.", "Je vais à la mer."], ["Il libro è sul tavolo.", "Le livre est sur la table."], ["La casa dei nonni.", "La maison des grands-parents."]],
      exercices: [
        { q: "Stasera vado ___ cinema.", choix: ["al", "a il", "nel"], fr: "Ce soir je vais au cinéma.", pourquoi: "a + il = al." },
        { q: "Il libro è ___ tavolo.", choix: ["sul", "su il", "nel"], fr: "Le livre est sur la table.", pourquoi: "su + il = sul." },
        { q: "Le chiavi sono ___ borsa.", choix: ["nella", "in la", "alla"], fr: "Les clés sont dans le sac.", pourquoi: "in + la = nella." },
        { q: "Torno ___ ufficio alle tre.", choix: ["dall'", "da l'", "dal"], fr: "Je reviens du bureau à trois heures.", pourquoi: "da + l' (devant voyelle) = dall'." },
        { q: "La casa ___ nonni.", choix: ["dei", "di i", "degli"], fr: "La maison des grands-parents.", pourquoi: "di + i = dei." },
      ] },
    { id: "futuro", niveau: 1, titre: "Le futur (futuro semplice)",
      astuce: "-are et -ere → -erò, -ire → -irò : ò, ai, à, emo, ete, anno. Radicaux irréguliers : sar-, avr-, andr-, far-, vorr-, potr-, verr-…",
      explication: `Terminaisons : <b>-ò, -ai, -à, -emo, -ete, -anno</b>.<br>
        -are : parl<b>erò</b> (le a devient e !) · -ere : prend<b>erò</b> · -ire : dorm<b>irò</b><br>
        Irréguliers : essere → <b>sarò</b>, avere → <b>avrò</b>, andare → <b>andrò</b>, fare → <b>farò</b>, volere → <b>vorrò</b>, potere → <b>potrò</b>, venire → <b>verrò</b>, vedere → <b>vedrò</b>.<br>
        À l'oral, on utilise souvent le <b>présent</b> pour un futur proche : <i>Domani vado a Roma.</i>`,
      pourquoi: "Le futur italien ressemble au nôtre (infinitif + terminaison), mais les verbes en -are changent leur a en e : parlerò et non « parlarò ». Attention à ne pas le confondre avec le conditionnel (parleremo / parleremmo).",
      pieges: [["Parlarò.", "Parlerò.", "Verbes en -are : a → e au futur."], ["Anderò.", "Andrò.", "andare est irrégulier : andrò."], ["Partiremmo domani (futur).", "Partiremo domani.", "Futur : -emo (un m). -emmo (deux m) = conditionnel."]],
      exemples: [["Domani pioverà.", "Demain il pleuvra."], ["Andrò in Italia quest'estate.", "J'irai en Italie cet été."], ["Saremo in ritardo.", "Nous serons en retard."]],
      exercices: [
        { q: "La settimana prossima ___ a Milano.", choix: ["andrò", "anderò", "andarò"], fr: "La semaine prochaine j'irai à Milan.", pourquoi: "andare a un futur irrégulier : andrò." },
        { q: "L'anno prossimo ___ l'inglese.", choix: ["studierò", "studiarò", "studierei"], fr: "L'année prochaine j'étudierai l'anglais.", pourquoi: "-are → -erò ; studierei est le conditionnel." },
        { q: "Noi ___ alle otto.", choix: ["partiremo", "partiramo", "partiremmo"], fr: "Nous partirons à huit heures.", pourquoi: "Futur noi = -emo (un seul m)." },
        { q: "Tu ___ un regalo?", choix: ["comprerai", "comprarai", "compreresti"], fr: "Tu achèteras un cadeau ?", pourquoi: "comprare → comprerai (a → e)." },
        { q: "Lei ___ trent'anni a maggio.", choix: ["avrà", "averà", "avra"], fr: "Elle aura trente ans en mai.", pourquoi: "avere → avr- ; 3e personne avec accent : avrà." },
      ] },
    { id: "possessivi", niveau: 1, titre: "Les possessifs (il mio, la mia…)",
      astuce: "article + possessif (la mia macchina), sauf avec un membre de la famille au singulier (mia madre). loro garde toujours l'article.",
      explication: `il <b>mio</b>, la <b>mia</b>, i <b>miei</b>, le <b>mie</b> · tuo, tua, tuoi, tue · suo, sua, suoi, sue · nostro… · vostro… · il <b>loro</b> (invariable).<br>
        En italien on met <b>l'article</b> devant le possessif : <i>la mia macchina</i> (ma voiture).<br>
        <b>Exception</b> : famille au singulier, sans adjectif → pas d'article : <i>mia madre, tuo fratello</i>. Mais : <i>i miei fratelli, la mia sorellina, la loro madre</i>.<br>
        ⚠️ suo / sua s'accordent avec l'<b>objet</b>, comme en français : <i>Marco e sua sorella</i>.`,
      pourquoi: "L'article devant le possessif surprend les Français, mais il est obligatoire. L'exception de la famille vient de l'usage : on parle si souvent de « mia madre » que l'article a disparu.",
      pieges: [["Mia macchina è rossa.", "La mia macchina è rossa.", "Article obligatoire devant le possessif."], ["La mia madre", "Mia madre", "Famille au singulier → pas d'article."], ["Loro madre", "La loro madre", "loro garde toujours l'article."]],
      exemples: [["Questo è il mio telefono.", "C'est mon téléphone."], ["Mia sorella abita a Torino.", "Ma sœur habite à Turin."], ["I miei amici sono simpatici.", "Mes amis sont sympas."]],
      exercices: [
        { q: "Questa è ___ macchina.", choix: ["la mia", "mia", "il mio"], fr: "C'est ma voiture.", pourquoi: "Un objet → article + possessif : la mia." },
        { q: "___ madre è italiana.", choix: ["Mia", "La mia", "Il mio"], fr: "Ma mère est italienne.", pourquoi: "Famille au singulier → pas d'article." },
        { q: "Dove sono ___ chiavi?", choix: ["le mie", "i miei", "mie"], fr: "Où sont mes clés ?", pourquoi: "chiavi est féminin pluriel → le mie." },
        { q: "___ fratelli abitano a Roma.", choix: ["I miei", "Miei", "Le mie"], fr: "Mes frères habitent à Rome.", pourquoi: "Famille au pluriel → l'article revient." },
        { q: "Ecco ___ padre (leur père).", choix: ["il loro", "loro", "suo"], fr: "Voici leur père.", pourquoi: "loro garde toujours l'article, même avec la famille." },
      ] },
    { id: "riflessivi", niveau: 1, titre: "Les verbes pronominaux (mi chiamo, mi alzo)",
      astuce: "mi, ti, si, ci, vi, si + verbe. Au passé composé : essere + accord (mi sono alzata).",
      explication: `Comme « se lever » en français : <b>mi</b> alzo, <b>ti</b> alzi, <b>si</b> alza, <b>ci</b> alziamo, <b>vi</b> alzate, <b>si</b> alzano.<br>
        Verbes courants : chiamarsi (s'appeler), alzarsi, svegliarsi, lavarsi, vestirsi, divertirsi (s'amuser), sentirsi (se sentir).<br>
        Au passé composé : toujours <b>essere</b>, et le participe s'accorde : <i>Lei si è svegliata presto.</i>`,
      pourquoi: "C'est exactement le fonctionnement du français. La seule surprise : certains verbes sont pronominaux en italien mais pas en français (divertirsi = s'amuser… ça va, mais ricordarsi = se souvenir, et dimenticarsi = oublier).",
      pieges: [["Io chiamo Léa.", "Mi chiamo Léa.", "s'appeler = chiamarsi."], ["Mi ho alzato.", "Mi sono alzato.", "Verbe pronominal → essere au passé."]],
      exemples: [["Come ti chiami?", "Comment tu t'appelles ?"], ["Mi alzo alle sette.", "Je me lève à sept heures."], ["Ci siamo divertiti!", "On s'est bien amusés !"]],
      exercices: [
        { q: "Come ___ chiami?", choix: ["ti", "si", "mi"], fr: "Comment tu t'appelles ?", pourquoi: "tu → ti." },
        { q: "Io ___ alzo alle sette.", choix: ["mi", "si", "ti"], fr: "Je me lève à sept heures.", pourquoi: "io → mi." },
        { q: "Noi ___ divertiamo molto.", choix: ["ci", "vi", "si"], fr: "Nous nous amusons beaucoup.", pourquoi: "noi → ci." },
        { q: "Lei si è ___ presto.", choix: ["svegliata", "svegliato", "svegliati"], fr: "Elle s'est réveillée tôt.", pourquoi: "Pronominal → essere + accord au féminin." },
        { q: "Loro ___ lavano le mani.", choix: ["si", "ci", "vi"], fr: "Ils se lavent les mains.", pourquoi: "loro → si." },
      ] },

    // ---------- AUTONOME ----------
    { id: "imperfetto", niveau: 2, titre: "Imparfait ou passé composé ?",
      astuce: "imperfetto (-avo, -evo, -ivo) pour décrire, les habitudes et le décor ; passato prossimo pour l'action ponctuelle.",
      explication: `<b>Imperfetto</b> : parl<b>avo</b>, prend<b>evo</b>, dorm<b>ivo</b> (vo, vi, va, vamo, vate, vano). essere → <b>ero, eri, era, eravamo, eravate, erano</b>.<br>
        On l'emploie pour : la <b>description</b> (Era una bella giornata), l'<b>habitude</b> passée (Da bambino andavo al mare), l'action <b>en cours</b> (Mentre cucinavo…).<br>
        Le <b>passato prossimo</b> raconte l'événement : <i>Mentre cucinavo, è suonato il telefono.</i>`,
      pourquoi: "C'est exactement la logique imparfait / passé composé du français : si tu sais choisir en français, tu sais choisir en italien. Pose-toi la question : décor ou événement ?",
      pieges: [["Da bambino sono andato al mare ogni estate.", "Da bambino andavo al mare ogni estate.", "Habitude passée → imperfetto."], ["Ieri vedevo Marco al bar.", "Ieri ho visto Marco al bar.", "Événement daté → passato prossimo."]],
      exemples: [["Quando ero piccolo, abitavo a Lione.", "Quand j'étais petit, j'habitais à Lyon."], ["Pioveva quando sono uscito.", "Il pleuvait quand je suis sorti."]],
      exercices: [
        { q: "Da bambino ___ al mare ogni estate.", choix: ["andavo", "sono andato", "andrò"], fr: "Enfant, j'allais à la mer chaque été.", pourquoi: "Habitude passée (ogni estate) → imperfetto." },
        { q: "Ieri ___ Marco al bar.", choix: ["ho visto", "vedevo", "vedrò"], fr: "Hier j'ai vu Marco au bar.", pourquoi: "Action ponctuelle datée → passato prossimo." },
        { q: "Mentre ___, è suonato il telefono.", choix: ["cucinavo", "ho cucinato", "cucinerò"], fr: "Pendant que je cuisinais, le téléphone a sonné.", pourquoi: "Action en cours (le décor) → imperfetto." },
        { q: "___ le otto quando è arrivato.", choix: ["Erano", "Sono state", "Saranno"], fr: "Il était huit heures quand il est arrivé.", pourquoi: "L'heure dans un récit = description → imperfetto." },
        { q: "Quando ero piccola, ___ i capelli lunghi.", choix: ["avevo", "ho avuto", "avrò"], fr: "Quand j'étais petite, j'avais les cheveux longs.", pourquoi: "Description d'un état passé → imperfetto." },
      ] },
    { id: "condizionale", niveau: 2, titre: "Le conditionnel (condizionale)",
      astuce: "Même radical que le futur + ei, esti, ebbe, emmo, este, ebbero. vorrei = je voudrais.",
      explication: `Radical du futur + <b>-ei, -esti, -ebbe, -emmo, -este, -ebbero</b> : parler<b>ei</b>, sar<b>ei</b>, avr<b>ei</b>, vorr<b>ei</b>, potr<b>ei</b>.<br>
        <b>Politesse</b> : <i>Vorrei un caffè. Potresti aiutarmi?</i><br>
        <b>Souhait</b> : <i>Mi piacerebbe visitare Venezia.</i><br>
        <b>Conseil</b> : <i>Dovresti riposarti.</i>`,
      pourquoi: "Le conditionnel adoucit tout : « voglio » (je veux) est direct, « vorrei » (je voudrais) est poli. En Italie comme en France, c'est la formule à utiliser au café ou au magasin.",
      pieges: [["Voglio un caffè.", "Vorrei un caffè.", "Pour commander poliment → vorrei."], ["Verremo volentieri (conditionnel).", "Verremmo volentieri.", "Conditionnel noi = -emmo (deux m)."]],
      exemples: [["Vorrei una pizza margherita.", "Je voudrais une pizza margherita."], ["Mi piacerebbe vivere a Roma.", "J'aimerais vivre à Rome."], ["Al tuo posto, accetterei.", "À ta place, j'accepterais."]],
      exercices: [
        { q: "___ un caffè, per favore.", choix: ["Vorrei", "Vorrò", "Volevo"], fr: "Je voudrais un café, s'il vous plaît.", pourquoi: "Demande polie → conditionnel vorrei." },
        { q: "Mi ___ visitare Venezia.", choix: ["piacerebbe", "piacerà", "piaceva"], fr: "J'aimerais visiter Venise.", pourquoi: "Souhait → conditionnel." },
        { q: "___ aiutarmi, per favore?", choix: ["Potresti", "Potrai", "Potessi"], fr: "Pourrais-tu m'aider, s'il te plaît ?", pourquoi: "Demande polie → potresti." },
        { q: "Al tuo posto io non lo ___.", choix: ["farei", "farò", "facerei"], fr: "À ta place, je ne le ferais pas.", pourquoi: "fare → radical far- : farei." },
        { q: "Noi ___ volentieri.", choix: ["verremmo", "veniremmo", "verremo"], fr: "Nous viendrions volontiers.", pourquoi: "venire → verr- ; conditionnel noi = -emmo." },
      ] },
    { id: "pronomi-diretti", niveau: 2, titre: "Les pronoms lo, la, li, le",
      astuce: "lo, la, li, le avant le verbe conjugué ou collés à l'infinitif. Au passé composé, le participe s'accorde avec lo / la / li / le.",
      explication: `Ils remplacent un complément direct : <b>lo</b> (masc.), <b>la</b> (fém.), <b>li</b> (masc. pl.), <b>le</b> (fém. pl.). Aussi mi, ti, ci, vi.<br>
        Place : <b>avant</b> le verbe conjugué (<i>Lo prendo</i>) ou <b>collé</b> à l'infinitif (<i>Voglio prenderlo</i>).<br>
        Au passato prossimo, lo / la deviennent <b>l'</b> et le participe <b>s'accorde</b> : <i>La pizza? L'ho mangiata. I libri? Li ho letti.</i>`,
      pourquoi: "L'accord avec le pronom ressemble au français (« la pizza, je l'ai mangée »), mais en italien il s'entend, donc il ne faut pas l'oublier.",
      pieges: [["Ho visto la.", "L'ho vista.", "Le pronom va avant l'auxiliaire et le participe s'accorde."], ["Voglio lo comprare.", "Voglio comprarlo. / Lo voglio comprare.", "Collé à l'infinitif, ou avant le verbe conjugué."]],
      exemples: [["Il caffè? Lo prendo amaro.", "Le café ? Je le prends sans sucre."], ["Le chiavi? Le ho perse.", "Les clés ? Je les ai perdues."], ["Devo chiamarla.", "Je dois l'appeler."]],
      exercices: [
        { q: "Il libro? ___ leggo stasera.", choix: ["Lo", "La", "Li"], fr: "Le livre ? Je le lis ce soir.", pourquoi: "libro est masculin singulier → lo." },
        { q: "Le chiavi? Non ___ trovo.", choix: ["le", "li", "la"], fr: "Les clés ? Je ne les trouve pas.", pourquoi: "chiavi est féminin pluriel → le." },
        { q: "Maria? ___ conosco bene.", choix: ["La", "Lo", "Le"], fr: "Maria ? Je la connais bien.", pourquoi: "Maria = féminin singulier → la." },
        { q: "Il vestito? Voglio comprar___.", choix: ["lo", "la", "gli"], fr: "La robe ? Je veux l'acheter.", pourquoi: "vestito est masculin → lo, collé à l'infinitif." },
        { q: "La pizza? L'ho ___.", choix: ["mangiata", "mangiato", "mangiate"], fr: "La pizza ? Je l'ai mangée.", pourquoi: "Le participe s'accorde avec la (pizza) → mangiata." },
      ] },
    { id: "comparativi", niveau: 2, titre: "Comparatifs et superlatifs",
      astuce: "più / meno … di (devant un nom ou pronom), … che (entre deux verbes ou adjectifs) ; così … come. meglio = mieux, migliore = meilleur.",
      explication: `<b>più</b> (plus) / <b>meno</b> (moins) + <b>di</b> devant un nom ou un pronom : <i>Marco è più alto di Luca.</i><br>
        + <b>che</b> quand on compare deux verbes, deux adjectifs ou deux quantités : <i>È più facile parlare che scrivere.</i><br>
        Égalité : <b>così … come</b> ou <b>tanto … quanto</b>.<br>
        Superlatif : <i>la città <b>più</b> bella d'Italia</i> · absolu : bell<b>issimo</b> (très beau).<br>
        Irréguliers : buono → <b>migliore</b>, bene → <b>meglio</b>, cattivo → peggiore, male → peggio.`,
      pourquoi: "Le français dit « que » partout. L'italien choisit di ou che selon ce qu'on compare : c'est la seule vraie difficulté, et elle est très fréquente.",
      pieges: [["più alto che Luca", "più alto di Luca", "Devant un nom → di."], ["Canta più bene di me.", "Canta meglio di me.", "bene → meglio."]],
      exemples: [["Roma è più grande di Firenze.", "Rome est plus grande que Florence."], ["Questo vino è buonissimo!", "Ce vin est excellent !"], ["Parla meglio di me.", "Il parle mieux que moi."]],
      exercices: [
        { q: "Marco è più alto ___ Luca.", choix: ["di", "che", "come"], fr: "Marco est plus grand que Luca.", pourquoi: "Devant un nom propre → di." },
        { q: "È più facile parlare ___ scrivere.", choix: ["che", "di", "come"], fr: "C'est plus facile de parler que d'écrire.", pourquoi: "On compare deux verbes → che." },
        { q: "Canta ___ di me.", choix: ["meglio", "migliore", "più bene"], fr: "Il chante mieux que moi.", pourquoi: "Avec un verbe, « mieux » = meglio." },
        { q: "Anna è così alta ___ sua sorella.", choix: ["come", "che", "di"], fr: "Anna est aussi grande que sa sœur.", pourquoi: "così … come." },
        { q: "Roma è la città ___ bella d'Italia.", choix: ["più", "la più", "molto"], fr: "Rome est la plus belle ville d'Italie.", pourquoi: "Superlatif : la città più bella (un seul article)." },
      ] },
    { id: "ne-ci", niveau: 2, titre: "Ne et ci (en et y)",
      astuce: "ne = en (quantité, « de ça ») ; ci = y (lieu, « à ça »).",
      explication: `<b>ne</b> remplace une quantité ou un complément avec <i>di</i> : <i>Quante mele vuoi? Ne voglio tre.</i> · <i>Parli del film? Sì, ne parlo.</i><br>
        <b>ci</b> remplace un lieu ou un complément avec <i>a</i> : <i>Vai a Roma? Sì, ci vado.</i> · <i>Pensi al lavoro? Ci penso sempre.</i>`,
      pourquoi: "Ce sont nos « en » et « y », et ils s'utilisent presque pareil. L'erreur classique est de les oublier : en italien, on ne dit pas « voglio tre » tout seul, on dit « ne voglio tre ».",
      pieges: [["Quante mele? Voglio tre.", "Ne voglio tre.", "Avec une quantité, ne est obligatoire."], ["Vai a Roma? Sì, vado.", "Sì, ci vado.", "Le lieu se reprend avec ci."]],
      exemples: [["Ne ho due.", "J'en ai deux."], ["Ci andiamo domani.", "Nous y allons demain."], ["Non ne ho idea.", "Je n'en ai aucune idée."]],
      exercices: [
        { q: "Quante mele vuoi? ___ voglio tre.", choix: ["Ne", "Ci", "Le"], fr: "Combien de pommes veux-tu ? J'en veux trois.", pourquoi: "Quantité → ne." },
        { q: "Vai a Roma? Sì, ___ vado domani.", choix: ["ci", "ne", "la"], fr: "Tu vas à Rome ? Oui, j'y vais demain.", pourquoi: "Lieu → ci." },
        { q: "Parli del film? Sì, ___ parlo.", choix: ["ne", "ci", "lo"], fr: "Tu parles du film ? Oui, j'en parle.", pourquoi: "parlare di → ne." },
        { q: "Pensi al lavoro? Sì, ___ penso sempre.", choix: ["ci", "ne", "lo"], fr: "Tu penses au travail ? Oui, j'y pense toujours.", pourquoi: "pensare a → ci." },
      ] },
  ],
};
