// Contenu PORTUGAIS de Jack Blabla — niveaux 0 (Amateur), 1 (Moyen), 2 (Autonome).
// Portugais du Portugal ; les différences du Brésil sont signalées dans les cours.
// Les niveaux 3 à 5 (Avancé, Pro, Expert) sont dans contenu/pt-pro.js.
// Exercices : le PREMIER choix est toujours la bonne réponse (ils sont mélangés à l'affichage).

CONTENU.pt = {
  pronoms: ["eu", "tu", "ele/ela", "nós", "vocês", "eles/elas"],
  pronomsFr: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],

  temps: [
    { id: "presente", nom: "Présent (presente)", niveau: 0 },
    { id: "preterito", nom: "Passé (pretérito perfeito)", niveau: 1 },
    { id: "futuro", nom: "Futur (futuro)", niveau: 1 },
    { id: "imperfeito", nom: "Imparfait (imperfeito)", niveau: 2 },
    { id: "condicional", nom: "Conditionnel (condicional)", niveau: 2 },
  ],

  // Les temps absents de « formes » sont calculés (voir MOTEURS.pt dans conjugaison.js).
  verbes: [
    { inf: "ser", fr: "être (identité, nature)", niveau: 0, irregulier: true, participe: "sido", formes: {
      presente: ["sou", "és", "é", "somos", "são", "são"],
      preterito: ["fui", "foste", "foi", "fomos", "foram", "foram"],
      imperfeito: ["era", "eras", "era", "éramos", "eram", "eram"],
      conjuntivo: ["seja", "sejas", "seja", "sejamos", "sejam", "sejam"] } },
    { inf: "estar", fr: "être (état, lieu)", niveau: 0, irregulier: true, formes: {
      presente: ["estou", "estás", "está", "estamos", "estão", "estão"],
      preterito: ["estive", "estiveste", "esteve", "estivemos", "estiveram", "estiveram"],
      conjuntivo: ["esteja", "estejas", "esteja", "estejamos", "estejam", "estejam"] } },
    { inf: "ter", fr: "avoir", niveau: 0, irregulier: true, formes: {
      presente: ["tenho", "tens", "tem", "temos", "têm", "têm"],
      preterito: ["tive", "tiveste", "teve", "tivemos", "tiveram", "tiveram"],
      imperfeito: ["tinha", "tinhas", "tinha", "tínhamos", "tinham", "tinham"] } },
    { inf: "ir", fr: "aller", niveau: 0, irregulier: true, formes: {
      presente: ["vou", "vais", "vai", "vamos", "vão", "vão"],
      preterito: ["fui", "foste", "foi", "fomos", "foram", "foram"],
      conjuntivo: ["vá", "vás", "vá", "vamos", "vão", "vão"] } },
    { inf: "fazer", fr: "faire", niveau: 0, irregulier: true, participe: "feito", radicalFutur: "far", formes: {
      presente: ["faço", "fazes", "faz", "fazemos", "fazem", "fazem"],
      preterito: ["fiz", "fizeste", "fez", "fizemos", "fizeram", "fizeram"] } },
    { inf: "falar", fr: "parler", niveau: 0 },
    { inf: "morar", fr: "habiter", niveau: 0 },
    { inf: "trabalhar", fr: "travailler", niveau: 0 },
    { inf: "gostar", fr: "aimer (gostar de)", niveau: 0 },
    { inf: "comer", fr: "manger", niveau: 0 },
    { inf: "viver", fr: "vivre", niveau: 0 },
    { inf: "abrir", fr: "ouvrir", niveau: 0, participe: "aberto" },
    { inf: "querer", fr: "vouloir", niveau: 1, irregulier: true, formes: {
      presente: ["quero", "queres", "quer", "queremos", "querem", "querem"],
      preterito: ["quis", "quiseste", "quis", "quisemos", "quiseram", "quiseram"],
      conjuntivo: ["queira", "queiras", "queira", "queiramos", "queiram", "queiram"] } },
    { inf: "poder", fr: "pouvoir", niveau: 1, irregulier: true, formes: {
      presente: ["posso", "podes", "pode", "podemos", "podem", "podem"],
      preterito: ["pude", "pudeste", "pôde", "pudemos", "puderam", "puderam"] } },
    { inf: "dizer", fr: "dire", niveau: 1, irregulier: true, participe: "dito", radicalFutur: "dir", formes: {
      presente: ["digo", "dizes", "diz", "dizemos", "dizem", "dizem"],
      preterito: ["disse", "disseste", "disse", "dissemos", "disseram", "disseram"] } },
    { inf: "ver", fr: "voir", niveau: 1, irregulier: true, participe: "visto", formes: {
      presente: ["vejo", "vês", "vê", "vemos", "veem", "veem"],
      preterito: ["vi", "viste", "viu", "vimos", "viram", "viram"] } },
    { inf: "vir", fr: "venir", niveau: 1, irregulier: true, participe: "vindo", formes: {
      presente: ["venho", "vens", "vem", "vimos", "vêm", "vêm"],
      preterito: ["vim", "vieste", "veio", "viemos", "vieram", "vieram"],
      imperfeito: ["vinha", "vinhas", "vinha", "vínhamos", "vinham", "vinham"] } },
    { inf: "dar", fr: "donner", niveau: 1, irregulier: true, formes: {
      presente: ["dou", "dás", "dá", "damos", "dão", "dão"],
      preterito: ["dei", "deste", "deu", "demos", "deram", "deram"],
      conjuntivo: ["dê", "dês", "dê", "demos", "deem", "deem"] } },
    { inf: "saber", fr: "savoir", niveau: 1, irregulier: true, formes: {
      presente: ["sei", "sabes", "sabe", "sabemos", "sabem", "sabem"],
      preterito: ["soube", "soubeste", "soube", "soubemos", "souberam", "souberam"],
      conjuntivo: ["saiba", "saibas", "saiba", "saibamos", "saibam", "saibam"] } },
    { inf: "sair", fr: "sortir", niveau: 1, irregulier: true, participe: "saído", formes: {
      presente: ["saio", "sais", "sai", "saímos", "saem", "saem"],
      preterito: ["saí", "saíste", "saiu", "saímos", "saíram", "saíram"],
      imperfeito: ["saía", "saías", "saía", "saíamos", "saíam", "saíam"] } },
    { inf: "chegar", fr: "arriver", niveau: 1 },
    { inf: "ficar", fr: "rester, se trouver", niveau: 1 },
    { inf: "beber", fr: "boire", niveau: 1 },
    { inf: "escrever", fr: "écrire", niveau: 1, participe: "escrito" },
    { inf: "pôr", fr: "mettre", niveau: 2, irregulier: true, participe: "posto", formes: {
      presente: ["ponho", "pões", "põe", "pomos", "põem", "põem"],
      preterito: ["pus", "puseste", "pôs", "pusemos", "puseram", "puseram"],
      imperfeito: ["punha", "punhas", "punha", "púnhamos", "punham", "punham"],
      futuro: ["porei", "porás", "porá", "poremos", "porão", "porão"],
      condicional: ["poria", "porias", "poria", "poríamos", "poriam", "poriam"],
      conjuntivo: ["ponha", "ponhas", "ponha", "ponhamos", "ponham", "ponham"] } },
    { inf: "trazer", fr: "apporter", niveau: 2, irregulier: true, radicalFutur: "trar", formes: {
      presente: ["trago", "trazes", "traz", "trazemos", "trazem", "trazem"],
      preterito: ["trouxe", "trouxeste", "trouxe", "trouxemos", "trouxeram", "trouxeram"] } },
    { inf: "ler", fr: "lire", niveau: 2, irregulier: true, formes: {
      presente: ["leio", "lês", "lê", "lemos", "leem", "leem"],
      preterito: ["li", "leste", "leu", "lemos", "leram", "leram"] } },
    { inf: "dormir", fr: "dormir", niveau: 2, irregulier: true, formes: {
      presente: ["durmo", "dormes", "dorme", "dormimos", "dormem", "dormem"] } },
    { inf: "pedir", fr: "demander, commander", niveau: 2, irregulier: true, formes: {
      presente: ["peço", "pedes", "pede", "pedimos", "pedem", "pedem"] } },
    { inf: "ouvir", fr: "entendre, écouter", niveau: 2, irregulier: true, formes: {
      presente: ["ouço", "ouves", "ouve", "ouvimos", "ouvem", "ouvem"] } },
  ],

  irreguliers: {
    colonnes: ["Infinitif", "Présent (eu)", "Passé (eu)", "Participe passé"],
    lignes: [
      // [infinitif, présent eu, passé eu, participe, français, niveau]
      ["ser", "sou", "fui", "sido", "être (nature)", 0], ["estar", "estou", "estive", "estado", "être (état)", 0],
      ["ter", "tenho", "tive", "tido", "avoir", 0], ["ir", "vou", "fui", "ido", "aller", 0],
      ["fazer", "faço", "fiz", "feito", "faire", 0], ["abrir", "abro", "abri", "aberto", "ouvrir", 0],
      ["querer", "quero", "quis", "querido", "vouloir", 1], ["poder", "posso", "pude", "podido", "pouvoir", 1],
      ["dizer", "digo", "disse", "dito", "dire", 1], ["ver", "vejo", "vi", "visto", "voir", 1],
      ["vir", "venho", "vim", "vindo", "venir", 1], ["dar", "dou", "dei", "dado", "donner", 1],
      ["saber", "sei", "soube", "sabido", "savoir", 1], ["sair", "saio", "saí", "saído", "sortir", 1],
      ["escrever", "escrevo", "escrevi", "escrito", "écrire", 1], ["pôr", "ponho", "pus", "posto", "mettre", 2],
      ["trazer", "trago", "trouxe", "trazido", "apporter", 2], ["ler", "leio", "li", "lido", "lire", 2],
      ["dormir", "durmo", "dormi", "dormido", "dormir", 2], ["pedir", "peço", "pedi", "pedido", "demander", 2],
      ["ouvir", "ouço", "ouvi", "ouvido", "entendre", 2], ["haver", "hei", "houve", "havido", "y avoir", 4],
      ["perder", "perco", "perdi", "perdido", "perdre", 4], ["cobrir", "cubro", "cobri", "coberto", "couvrir", 5],
    ],
  },

  themes: [
    // ---------- AMATEUR ----------
    { id: "salut", niveau: 0, titre: "Dire bonjour", emoji: "👋",
      mots: [["Salut", "Olá"], ["Bonjour", "Bom dia"], ["Bon après-midi", "Boa tarde"], ["Bonsoir / Bonne nuit", "Boa noite"], ["Au revoir", "Adeus"],
        ["À bientôt", "Até logo"], ["Merci (un homme)", "Obrigado"], ["Merci (une femme)", "Obrigada"], ["S'il vous plaît", "Por favor"], ["De rien", "De nada"],
        ["Oui", "Sim"], ["Non", "Não"], ["Comment ça va ?", "Como estás?"], ["Ça va bien", "Estou bem"]],
      dialogue: [
        { who: "jack", txt: "Olá! Como estás?", fr: "Salut ! Comment ça va ?" },
        { who: "toi", choices: ["Estou bem, obrigado!", "Adeus!", "Onde fica a estação?"], fr: "Ça va bien, merci !" },
        { who: "jack", txt: "Ótimo! Até logo!", fr: "Super ! À bientôt !" },
        { who: "toi", choices: ["Até logo!", "Um café, por favor.", "Sim."], fr: "À bientôt !" },
      ] },
    { id: "moi", niveau: 0, titre: "Se présenter", emoji: "🙋",
      mots: [["Je m'appelle…", "Chamo-me…"], ["J'ai … ans", "Tenho … anos"], ["Je suis français", "Sou francês"], ["Je suis française", "Sou francesa"],
        ["J'habite à Paris", "Moro em Paris"], ["Enchanté(e)", "Muito prazer"], ["Et toi ?", "E tu?"], ["Je parle un peu portugais", "Falo um pouco de português"]],
      dialogue: [
        { who: "jack", txt: "Olá! Chamo-me Jack. Como te chamas?", fr: "Salut ! Je m'appelle Jack. Comment tu t'appelles ?" },
        { who: "toi", choices: ["Chamo-me Léa.", "Sou vinte anos.", "A conta, por favor."], fr: "Je m'appelle Léa." },
        { who: "jack", txt: "Muito prazer! Onde moras?", fr: "Enchanté ! Où habites-tu ?" },
        { who: "toi", choices: ["Moro em Paris.", "Obrigado.", "Sempre em frente."], fr: "J'habite à Paris." },
      ] },
    { id: "chiffres", niveau: 0, titre: "Les chiffres", emoji: "🔢",
      mots: [["un / une", "um / uma"], ["deux", "dois / duas"], ["trois", "três"], ["quatre", "quatro"], ["cinq", "cinco"], ["six", "seis"],
        ["sept", "sete"], ["huit", "oito"], ["neuf", "nove"], ["dix", "dez"], ["vingt", "vinte"], ["cent", "cem"]],
      dialogue: [
        { who: "jack", txt: "Quantos anos tens?", fr: "Quel âge as-tu ?" },
        { who: "toi", choices: ["Tenho vinte anos.", "Sou vinte anos.", "Estou vinte anos."], fr: "J'ai vingt ans." },
        { who: "jack", txt: "E qual é o teu número de telemóvel?", fr: "Et quel est ton numéro de portable ?" },
        { who: "toi", choices: ["É seis, cinco, quatro…", "Tenho seis, cinco, quatro…", "Às cinco."], fr: "C'est six, cinq, quatre…" },
      ] },
    { id: "famille", niveau: 0, titre: "La famille", emoji: "👨‍👩‍👧",
      mots: [["la mère", "a mãe"], ["le père", "o pai"], ["les parents", "os pais"], ["le frère", "o irmão"], ["la sœur", "a irmã"], ["le fils", "o filho"],
        ["la fille (enfant)", "a filha"], ["le grand-père", "o avô"], ["la grand-mère", "a avó"], ["le mari", "o marido"], ["la femme (épouse)", "a mulher"]],
      dialogue: [
        { who: "jack", txt: "Tens irmãos?", fr: "Tu as des frères et sœurs ?" },
        { who: "toi", choices: ["Sim, tenho uma irmã.", "Sim, sou uma irmã.", "Sim, tenho um irmã."], fr: "Oui, j'ai une sœur." },
        { who: "jack", txt: "E os teus pais, onde moram?", fr: "Et tes parents, où habitent-ils ?" },
        { who: "toi", choices: ["Os meus pais moram em Lyon.", "Os meus pais mora em Lyon.", "Os meus país moram em Lyon."], fr: "Mes parents habitent à Lyon." },
      ] },
    { id: "cafe", niveau: 0, titre: "Au café", emoji: "☕",
      mots: [["un café serré", "uma bica / um café"], ["un café au lait (dans un verre)", "um galão"], ["un thé", "um chá"], ["de l'eau", "água"], ["une bière", "uma cerveja"],
        ["un pastel de nata", "um pastel de nata"], ["Je voudrais…", "Queria…"], ["L'addition, s'il vous plaît", "A conta, por favor"], ["Combien ça coûte ?", "Quanto custa?"]],
      dialogue: [
        { who: "jack", txt: "Bom dia! O que deseja?", fr: "Bonjour ! Que désirez-vous ?" },
        { who: "toi", choices: ["Queria uma bica e um pastel de nata, por favor.", "Sou uma bica, por favor.", "Tenho uma bica ontem."], fr: "Je voudrais un café et un pastel de nata, s'il vous plaît." },
        { who: "jack", txt: "Mais alguma coisa?", fr: "Autre chose ?" },
        { who: "toi", choices: ["Não, obrigado. Quanto custa?", "Não, obrigado. Quantos anos tens?", "Sim, adeus."], fr: "Non, merci. Combien ça coûte ?" },
      ] },
    { id: "voyage", niveau: 0, titre: "En voyage", emoji: "✈️",
      mots: [["la gare", "a estação"], ["l'aéroport", "o aeroporto"], ["le billet", "o bilhete"], ["l'hôtel", "o hotel"], ["la plage", "a praia"],
        ["Où est… ?", "Onde fica…?"], ["à droite", "à direita"], ["à gauche", "à esquerda"], ["tout droit", "sempre em frente"], ["près / loin", "perto / longe"]],
      dialogue: [
        { who: "toi", choices: ["Desculpe, onde fica a estação?", "Desculpe, onde é estação ontem?", "Desculpe, tenho a estação?"], fr: "Excusez-moi, où est la gare ?" },
        { who: "jack", txt: "É sempre em frente e depois à direita.", fr: "C'est tout droit puis à droite." },
        { who: "toi", choices: ["Fica longe?", "Estás longe?", "Sou longe?"], fr: "C'est loin ?" },
        { who: "jack", txt: "Não, fica a cinco minutos a pé.", fr: "Non, c'est à cinq minutes à pied." },
      ] },
    // ---------- MOYEN ----------
    { id: "meteo", niveau: 1, titre: "Le temps et la météo", emoji: "🌦️",
      mots: [["Il fait beau", "Está bom tempo"], ["Il fait chaud", "Está calor"], ["Il fait froid", "Está frio"], ["Il pleut", "Está a chover"], ["le soleil", "o sol"],
        ["la pluie", "a chuva"], ["le vent", "o vento"], ["l'été", "o verão"], ["l'hiver", "o inverno"], ["Demain il va pleuvoir", "Amanhã vai chover"]],
      dialogue: [
        { who: "jack", txt: "Como está o tempo hoje em Lisboa?", fr: "Quel temps fait-il aujourd'hui à Lisbonne ?" },
        { who: "toi", choices: ["Está sol e está calor.", "É sol e é calor.", "Tem sol e tem calor ontem."], fr: "Il y a du soleil et il fait chaud." },
        { who: "jack", txt: "E amanhã?", fr: "Et demain ?" },
        { who: "toi", choices: ["Amanhã vai chover.", "Amanhã choveu.", "Amanhã está a chover ontem."], fr: "Demain il va pleuvoir." },
      ] },
    { id: "ville", niveau: 1, titre: "En ville et shopping", emoji: "🛍️",
      mots: [["le magasin", "a loja"], ["le supermarché", "o supermercado"], ["la pharmacie", "a farmácia"], ["la banque", "o banco"], ["les vêtements", "a roupa"],
        ["la taille", "o tamanho"], ["cher / bon marché", "caro / barato"], ["les soldes", "os saldos"], ["Je peux essayer ?", "Posso experimentar?"], ["Je paie par carte", "Pago com cartão"]],
      dialogue: [
        { who: "jack", txt: "Posso ajudar?", fr: "Je peux vous aider ?" },
        { who: "toi", choices: ["Sim, procuro um casaco.", "Sim, procurei um casaco amanhã.", "Sim, sou um casaco."], fr: "Oui, je cherche une veste." },
        { who: "jack", txt: "Que tamanho veste?", fr: "Quelle taille faites-vous ?" },
        { who: "toi", choices: ["O M. Posso experimentar?", "O M. Posso experimentado?", "O M. Tenho experimentar?"], fr: "Du M. Je peux essayer ?" },
      ] },
    { id: "travail", niveau: 1, titre: "Au travail", emoji: "💼",
      mots: [["le travail", "o trabalho"], ["l'entreprise", "a empresa"], ["le collègue", "o colega"], ["le chef", "o chefe"], ["la réunion", "a reunião"],
        ["le bureau", "o escritório"], ["le salaire", "o salário"], ["les vacances", "as férias"], ["Je travaille à temps plein", "Trabalho a tempo inteiro"]],
      dialogue: [
        { who: "jack", txt: "Em que trabalhas?", fr: "Qu'est-ce que tu fais comme travail ?" },
        { who: "toi", choices: ["Sou enfermeira num hospital.", "Estou enfermeira num hospital.", "Tenho enfermeira num hospital."], fr: "Je suis infirmière dans un hôpital." },
        { who: "jack", txt: "Gostas do teu trabalho?", fr: "Tu aimes ton travail ?" },
        { who: "toi", choices: ["Gosto muito, mas é cansativo.", "Gosto o trabalho, mas é cansativo.", "Gosto muito, mas sou cansativo."], fr: "Je l'aime beaucoup, mais c'est fatigant." },
      ] },
    { id: "sante", niveau: 1, titre: "Santé et corps", emoji: "🩺",
      mots: [["la tête", "a cabeça"], ["le ventre", "a barriga"], ["le dos", "as costas"], ["la gorge", "a garganta"], ["le médecin", "o médico"],
        ["J'ai mal à la tête", "Dói-me a cabeça"], ["J'ai de la fièvre", "Tenho febre"], ["le médicament", "o medicamento"], ["l'ordonnance", "a receita"], ["Je suis malade", "Estou doente"]],
      dialogue: [
        { who: "jack", txt: "O que se passa?", fr: "Qu'est-ce qui se passe ?" },
        { who: "toi", choices: ["Dói-me a garganta e tenho febre.", "Dói-me a garganta e sou febre.", "Doem-me a garganta e estou febre."], fr: "J'ai mal à la gorge et j'ai de la fièvre." },
        { who: "jack", txt: "Desde quando?", fr: "Depuis quand ?" },
        { who: "toi", choices: ["Desde ontem à noite.", "Desde amanhã à noite.", "Desde à noite ontem foi."], fr: "Depuis hier soir." },
      ] },
    // ---------- AUTONOME ----------
    { id: "opinions", niveau: 2, titre: "Opinions et émotions", emoji: "💭",
      mots: [["Je pense que…", "Acho que…"], ["À mon avis…", "Na minha opinião…"], ["Je suis d'accord", "Concordo"], ["Je ne suis pas d'accord", "Não concordo"],
        ["Ça dépend", "Depende"], ["Je suis content(e)", "Estou contente"], ["Je suis triste", "Estou triste"], ["J'en ai marre", "Estou farto / farta"], ["Ça m'est égal", "Tanto faz"]],
      dialogue: [
        { who: "jack", txt: "O que achas do novo filme?", fr: "Qu'est-ce que tu penses du nouveau film ?" },
        { who: "toi", choices: ["Acho que é muito bom, mas um pouco longo.", "Acho que é muito bom, mas um pouco comprido ontem.", "Penso o filme muito bom."], fr: "Je pense qu'il est très bon, mais un peu long." },
        { who: "jack", txt: "Eu não concordo. Achei aborrecido.", fr: "Je ne suis pas d'accord. Je l'ai trouvé ennuyeux." },
        { who: "toi", choices: ["Depende dos gostos!", "Depende os gostos!", "Dependo dos gostos!"], fr: "Ça dépend des goûts !" },
      ] },
    { id: "connecteurs", niveau: 2, titre: "Les connecteurs", emoji: "🔗",
      mots: [["mais", "mas"], ["donc", "portanto"], ["parce que", "porque"], ["cependant", "no entanto"], ["d'abord", "primeiro"], ["ensuite", "depois"],
        ["enfin", "finalmente"], ["même si", "mesmo que"], ["par exemple", "por exemplo"], ["en plus", "além disso"]],
      dialogue: [
        { who: "jack", txt: "Porque estudas português?", fr: "Pourquoi tu étudies le portugais ?" },
        { who: "toi", choices: ["Porque a minha família é de Braga.", "Por que a minha família é de Braga ontem.", "Portanto a minha família é de Braga."], fr: "Parce que ma famille est de Braga." },
        { who: "jack", txt: "E é difícil?", fr: "Et c'est difficile ?" },
        { who: "toi", choices: ["Um pouco, mas gosto muito.", "Um pouco, porque gosto muito mas.", "Um pouco, portanto não gosto mas."], fr: "Un peu, mais j'aime beaucoup." },
      ] },
    { id: "pro", niveau: 2, titre: "Vie professionnelle", emoji: "📈",
      mots: [["le CV", "o currículo"], ["l'entretien d'embauche", "a entrevista de emprego"], ["l'expérience", "a experiência"], ["le contrat", "o contrato"],
        ["le poste", "o cargo"], ["les compétences", "as competências"], ["le délai", "o prazo"], ["envoyer un mail", "enviar um email"], ["Ci-joint…", "Em anexo…"]],
      dialogue: [
        { who: "jack", txt: "Porque quer trabalhar connosco?", fr: "Pourquoi voulez-vous travailler avec nous ?" },
        { who: "toi", choices: ["Porque gosto muito dos vossos projetos.", "Porque gostei muito os vossos projetos amanhã.", "Porque sou os vossos projetos."], fr: "Parce que j'aime beaucoup vos projets." },
        { who: "jack", txt: "Tem experiência nesta área?", fr: "Avez-vous de l'expérience dans ce domaine ?" },
        { who: "toi", choices: ["Sim, trabalhei três anos numa empresa parecida.", "Sim, trabalho três anos numa empresa parecida ontem.", "Sim, tenho trabalhar três anos."], fr: "Oui, j'ai travaillé trois ans dans une entreprise similaire." },
      ] },
    { id: "expressions", niveau: 2, titre: "Expressions idiomatiques", emoji: "🎭",
      mots: [["Ça coûte les yeux de la tête", "Custa os olhos da cara"], ["Être dans la lune", "Estar nas nuvens"], ["Tomber du ciel", "Cair do céu"],
        ["C'est du gâteau", "É canja"], ["Pleuvoir des cordes", "Chover a potes"], ["Mettre les pieds dans le plat", "Meter o pé na argola"], ["Petit à petit", "Pouco a pouco"]],
      dialogue: [
        { who: "jack", txt: "Viste o preço do novo telemóvel?", fr: "Tu as vu le prix du nouveau portable ?" },
        { who: "toi", choices: ["Vi! Custa os olhos da cara.", "Vi! Custa as mãos da cara.", "Vejo ontem! Custa os olhos."], fr: "Oui ! Il coûte les yeux de la tête." },
        { who: "jack", txt: "E o exame de português? Foi difícil?", fr: "Et l'examen de portugais ? C'était difficile ?" },
        { who: "toi", choices: ["Não, foi canja!", "Não, foi um bolo!", "Não, é canja amanhã!"], fr: "Non, c'était du gâteau !" },
      ] },
  ],

  grammaire: [
    // ---------- AMATEUR ----------
    { id: "artigos", niveau: 0, titre: "Les articles : o, a, os, as, um, uma",
      astuce: "o / os pour le masculin, a / as pour le féminin ; um / uma pour « un / une ».",
      explication: `Le portugais a des articles très simples : <b>o</b> (le), <b>a</b> (la), <b>os</b> (les, masculin), <b>as</b> (les, féminin).<br>
        Article indéfini : <b>um</b> (un), <b>uma</b> (une), <b>uns</b>, <b>umas</b> (des).<br>
        Les mots en <b>-o</b> sont souvent masculins (o livro), ceux en <b>-a</b> souvent féminins (a casa). Mais attention : <i>o dia</i> (le jour), <i>o mapa</i>, <i>o problema</i> sont masculins.<br>
        On met l'article devant les possessifs et souvent devant les prénoms : <i>o meu carro</i>, <i>a Ana</i>.`,
      pourquoi: "L'article est encore plus présent qu'en français : on dit « a minha casa » (la ma maison) et « o João chegou » (le Jean est arrivé). C'est normal en portugais du Portugal.",
      pieges: [["a dia", "o dia", "Dia se termine par -a mais il est masculin."], ["meu carro", "o meu carro", "Au Portugal, on met l'article devant le possessif."], ["os casas", "as casas", "Casa est féminin : as casas."]],
      exemples: [["o livro, os livros", "le livre, les livres"], ["a casa, as casas", "la maison, les maisons"], ["um amigo, uma amiga", "un ami, une amie"]],
      exercices: [
        { q: "___ livro", choix: ["o", "a", "os"], fr: "le livre", pourquoi: "livro est masculin singulier → o." },
        { q: "___ casas", choix: ["as", "os", "a"], fr: "les maisons", pourquoi: "casa est féminin ; au pluriel → as." },
        { q: "___ dia", choix: ["o", "a", "um a"], fr: "le jour", pourquoi: "dia est masculin, malgré son -a final." },
        { q: "Tenho ___ irmã.", choix: ["uma", "um", "a uma"], fr: "J'ai une sœur.", pourquoi: "irmã est féminin → uma." },
        { q: "___ meu carro é azul.", choix: ["O", "A", "Um"], fr: "Ma voiture est bleue.", pourquoi: "Au Portugal, on met l'article devant le possessif : o meu carro." },
      ] },
    { id: "ser-estar", niveau: 0, titre: "Ser ou estar (être)",
      astuce: "ser = ce qui définit (identité, nationalité, métier, origine) ; estar = l'état du moment et le lieu.",
      explication: `Le portugais a <b>deux verbes « être »</b>.<br>
        <b>ser</b> : identité, nationalité, métier, origine, caractère, l'heure. <i>Sou francês. Ela é médica. São três horas.</i><br>
        <b>estar</b> : état passager (fatigué, malade, content), lieu d'une personne ou d'un objet, météo. <i>Estou cansado. O Pedro está em casa. Está frio.</i><br>
        ser : sou, és, é, somos, são, são · estar : estou, estás, está, estamos, estão, estão.`,
      pourquoi: "Le portugais sépare ce qui est durable (ser) de ce qui change (estar). Demande-toi : « est-ce que ça le définit, ou est-ce que c'est comme ça maintenant ? »",
      pieges: [["Sou cansado.", "Estou cansado.", "La fatigue est un état passager → estar."], ["Estou francês.", "Sou francês.", "La nationalité définit → ser."], ["A Ana é em casa.", "A Ana está em casa.", "Où se trouve une personne → estar."]],
      exemples: [["Sou estudante.", "Je suis étudiant."], ["Estou doente.", "Je suis malade."], ["Lisboa é bonita.", "Lisbonne est belle."]],
      exercices: [
        { q: "Eu ___ francesa.", choix: ["sou", "estou", "é"], fr: "Je suis française.", pourquoi: "La nationalité → ser : eu sou." },
        { q: "Hoje ___ muito cansado.", choix: ["estou", "sou", "está"], fr: "Aujourd'hui je suis très fatigué.", pourquoi: "État du moment → estar : eu estou." },
        { q: "O Pedro ___ em casa.", choix: ["está", "é", "estou"], fr: "Pedro est à la maison.", pourquoi: "Le lieu d'une personne → estar ; ele → está." },
        { q: "Ela ___ médica.", choix: ["é", "está", "sou"], fr: "Elle est médecin.", pourquoi: "Le métier → ser ; ela → é." },
        { q: "Nós ___ contentes!", choix: ["estamos", "somos", "são"], fr: "Nous sommes contents !", pourquoi: "Une émotion du moment → estar ; nós → estamos." },
      ] },
    { id: "presente", niveau: 0, titre: "Le présent des verbes réguliers",
      astuce: "-ar : o, as, a, amos, am · -er : o, es, e, emos, em · -ir : o, es, e, imos, em.",
      explication: `On enlève <b>-ar / -er / -ir</b> et on ajoute la terminaison :<br>
        <b>falar</b> : falo, falas, fala, falamos, falam (vocês), falam (eles).<br>
        <b>comer</b> : como, comes, come, comemos, comem, comem.<br>
        <b>abrir</b> : abro, abres, abre, abrimos, abrem, abrem.<br>
        <b>vocês</b> (vous, pluriel) se conjugue comme <b>eles</b>. Le pronom sujet est souvent omis : <i>Falo português.</i>`,
      pourquoi: "La terminaison suffit à dire qui parle, c'est pour ça qu'on enlève souvent eu, tu, nós. Pour « vous », on utilise vocês avec la forme de « ils » : c'est plus simple qu'en français.",
      pieges: [["Eu falar português.", "Eu falo português.", "On conjugue toujours le verbe."], ["Vocês falais.", "Vocês falam.", "Vocês se conjugue comme eles."], ["Nós comimos.", "Nós comemos.", "Comer est en -er : nós comemos (comimos serait -ir)."]],
      exemples: [["Moro em Lisboa.", "J'habite à Lisbonne."], ["Comemos às oito.", "Nous mangeons à huit heures."], ["Eles abrem a loja às nove.", "Ils ouvrent le magasin à neuf heures."]],
      exercices: [
        { q: "Eu ___ (falar) português.", choix: ["falo", "fala", "falar"], fr: "Je parle portugais.", pourquoi: "eu + -ar → -o : falo." },
        { q: "Tu ___ (morar) em Paris?", choix: ["moras", "mora", "moro"], fr: "Tu habites à Paris ?", pourquoi: "tu + -ar → -as : moras." },
        { q: "Nós ___ (comer) muito peixe.", choix: ["comemos", "comimos", "comamos"], fr: "Nous mangeons beaucoup de poisson.", pourquoi: "nós + -er → -emos." },
        { q: "Vocês ___ (abrir) a porta?", choix: ["abrem", "abris", "abrimos"], fr: "Vous ouvrez la porte ?", pourquoi: "vocês se conjugue comme eles : abrem." },
        { q: "Ela ___ (trabalhar) num banco.", choix: ["trabalha", "trabalho", "trabalhas"], fr: "Elle travaille dans une banque.", pourquoi: "ela + -ar → -a : trabalha." },
      ] },
    { id: "plural", niveau: 0, titre: "Le pluriel des noms",
      astuce: "En général +s ; -ão → -ões (le plus souvent) ; -l → -is ; -r / -z → +es ; -m → -ns.",
      explication: `Règle de base : on ajoute <b>-s</b> : <i>o carro → os carros</i>.<br>
        Mots en <b>-r, -z, -s</b> (accentué) : <b>+es</b> : <i>a flor → as flores</i>, <i>a luz → as luzes</i>.<br>
        Mots en <b>-m</b> : <b>-ns</b> : <i>o homem → os homens</i>.<br>
        Mots en <b>-l</b> : <b>-is</b> : <i>o hotel → os hotéis</i>, <i>o animal → os animais</i>.<br>
        Mots en <b>-ão</b> : le plus souvent <b>-ões</b> (<i>a estação → as estações</i>), parfois -ães (<i>o pão → os pães</i>) ou -ãos (<i>a mão → as mãos</i>).`,
      pourquoi: "Les pluriels viennent du latin et ont gardé des formes différentes. Pour -ão, -ões est le cas le plus fréquent : retiens les exceptions courantes (pães, mãos, irmãos).",
      pieges: [["os hotels", "os hotéis", "-l devient -is."], ["os homems", "os homens", "-m devient -ns."], ["as flors", "as flores", "Après -r, on ajoute -es."]],
      exemples: [["um animal, dois animais", "un animal, deux animaux"], ["uma estação, duas estações", "une gare, deux gares"], ["o pão, os pães", "le pain, les pains"]],
      exercices: [
        { q: "um hotel → dois ___", choix: ["hotéis", "hotels", "hoteis"], fr: "un hôtel → deux hôtels", pourquoi: "-el → -éis (avec accent) : hotéis." },
        { q: "uma flor → muitas ___", choix: ["flores", "flors", "floris"], fr: "une fleur → beaucoup de fleurs", pourquoi: "-r → +es : flores." },
        { q: "um homem → três ___", choix: ["homens", "homems", "homeis"], fr: "un homme → trois hommes", pourquoi: "-m → -ns : homens." },
        { q: "uma estação → duas ___", choix: ["estações", "estaçãos", "estaçãoes"], fr: "une gare → deux gares", pourquoi: "-ão → le plus souvent -ões." },
      ] },
    { id: "gostar-de", niveau: 0, titre: "Gostar de (aimer)",
      astuce: "gostar est toujours suivi de de : gosto de café, gosto do Porto, gosto de dançar.",
      explication: `Pour dire « aimer » on utilise <b>gostar de</b> : <i>Gosto de música.</i><br>
        <b>de + o = do</b>, <b>de + a = da</b> : <i>Gosto do mar. Gostas da praia?</i><br>
        Avec un verbe : <i>Gosto de cozinhar.</i> (J'aime cuisiner.)<br>
        Pour répondre « oui », on répète le verbe : <i>Gostas de futebol? — Gosto!</i>`,
      pourquoi: "Le portugais dit littéralement « je goûte de… ». Oublier le de est l'erreur la plus fréquente des francophones. Et pour répondre oui, les Portugais préfèrent répéter le verbe plutôt que dire « sim ».",
      pieges: [["Gosto o café.", "Gosto do café.", "gostar + de + o = do."], ["Gosto cozinhar.", "Gosto de cozinhar.", "Devant un verbe aussi : gostar de."]],
      exemples: [["Gosto de chocolate.", "J'aime le chocolat."], ["Gostamos muito da cidade.", "Nous aimons beaucoup la ville."], ["Não gosto de acordar cedo.", "Je n'aime pas me lever tôt."]],
      exercices: [
        { q: "Gosto ___ mar.", choix: ["do", "de o", "o"], fr: "J'aime la mer.", pourquoi: "de + o = do." },
        { q: "Ela gosta ___ praia.", choix: ["da", "do", "a"], fr: "Elle aime la plage.", pourquoi: "praia est féminin : de + a = da." },
        { q: "Gostas ___ dançar?", choix: ["de", "do", "—"], fr: "Tu aimes danser ?", pourquoi: "Devant un verbe : gostar de." },
        { q: "Gostas de fado? — Sim, ___!", choix: ["gosto", "gostas", "gosta"], fr: "Tu aimes le fado ? — Oui, j'aime !", pourquoi: "On répond en répétant le verbe à la 1re personne : gosto." },
      ] },
    // ---------- MOYEN ----------
    { id: "preterito", niveau: 1, titre: "Le passé (pretérito perfeito)",
      astuce: "-ar : ei, aste, ou, ámos, aram · -er : i, este, eu, emos, eram · -ir : i, iste, iu, imos, iram.",
      explication: `Le <b>pretérito perfeito</b> raconte une action <b>terminée</b> : c'est notre passé composé ET notre passé simple.<br>
        <b>falar</b> : falei, falaste, falou, falámos, falaram · <b>comer</b> : comi, comeste, comeu, comemos, comeram · <b>partir</b> : parti, partiste, partiu, partimos, partiram.<br>
        Orthographe : <i>ficar → fiquei, chegar → cheguei, começar → comecei</i>.<br>
        Irréguliers fréquents : ser/ir → fui, foste, foi ; ter → tive ; fazer → fiz ; estar → estive.<br>
        🇧🇷 Au Brésil, on écrit <i>falamos</i> (sans accent) au passé.`,
      pourquoi: "Contrairement au français, le portugais n'a pas besoin d'auxiliaire pour raconter : « Ontem comi peixe » = Hier j'ai mangé du poisson. La forme « tenho comido » existe mais veut dire « ces derniers temps, j'ai mangé (souvent) ».",
      pieges: [["Ontem tenho comido peixe.", "Ontem comi peixe.", "Une action terminée → pretérito perfeito simple."], ["Eu chegei.", "Eu cheguei.", "chegar → cheguei : on ajoute u pour garder le son [g]."], ["Ela foi cansada.", "Ela estava cansada.", "Un état qui dure dans le passé → imparfait (niveau suivant)."]],
      exemples: [["Ontem trabalhei até tarde.", "Hier j'ai travaillé tard."], ["Fomos ao Porto no sábado.", "Nous sommes allés à Porto samedi."], ["O que fizeste?", "Qu'est-ce que tu as fait ?"]],
      exercices: [
        { q: "Ontem eu ___ (falar) com a Ana.", choix: ["falei", "falo", "falava"], fr: "Hier j'ai parlé avec Ana.", pourquoi: "Action terminée, eu + -ar → -ei." },
        { q: "Ela ___ (comer) um pastel de nata.", choix: ["comeu", "comia", "come"], fr: "Elle a mangé un pastel de nata.", pourquoi: "ela + -er au passé → -eu." },
        { q: "Eu ___ (chegar) às nove.", choix: ["cheguei", "chegei", "chegou"], fr: "Je suis arrivé à neuf heures.", pourquoi: "chegar → cheguei (gu devant e)." },
        { q: "No sábado nós ___ (ir) à praia.", choix: ["fomos", "vamos", "íamos"], fr: "Samedi nous sommes allés à la plage.", pourquoi: "ir au passé : fui, foste, foi, fomos." },
        { q: "O que ___ (fazer) tu ontem?", choix: ["fizeste", "fazeste", "fazes"], fr: "Qu'est-ce que tu as fait hier ?", pourquoi: "fazer est irrégulier : fiz, fizeste, fez." },
      ] },
    { id: "contracoes", niveau: 1, titre: "Les contractions : do, no, ao, pelo",
      astuce: "de + o = do · em + o = no · a + o = ao · a + a = à · por + o = pelo.",
      explication: `Les petites prépositions se collent à l'article :<br>
        <b>de</b> + o/a/os/as = <b>do, da, dos, das</b> (de, du) : <i>a casa do João</i>.<br>
        <b>em</b> + o/a = <b>no, na, nos, nas</b> (dans, à, en) : <i>Moro no Porto. Estou na praia.</i><br>
        <b>a</b> + o/a = <b>ao, à, aos, às</b> (à) : <i>Vou ao cinema. Vou à praia.</i><br>
        <b>por</b> + o/a = <b>pelo, pela</b> (par) : <i>Passo pela ponte.</i><br>
        Aussi avec um : <b>num, numa</b> (em + um) : <i>Trabalho numa escola.</i>`,
      pourquoi: "Comme notre « du » (de + le) et « au » (à + le), mais le portugais le fait avec beaucoup plus de prépositions. « Em » est très fréquent : il remplace notre « à » pour le lieu où l'on est.",
      pieges: [["Moro em o Porto.", "Moro no Porto.", "em + o = no."], ["Vou a a praia.", "Vou à praia.", "a + a = à (avec accent grave)."], ["Trabalho em uma escola.", "Trabalho numa escola.", "Au Portugal, em + uma = numa."]],
      exemples: [["Vou ao supermercado.", "Je vais au supermarché."], ["Estamos na esplanada.", "Nous sommes en terrasse."], ["O livro da professora.", "Le livre de la professeure."]],
      exercices: [
        { q: "Moro ___ Porto.", choix: ["no", "em o", "ao"], fr: "J'habite à Porto.", pourquoi: "Lieu où l'on est : em + o = no." },
        { q: "Vou ___ praia.", choix: ["à", "na", "a a"], fr: "Je vais à la plage.", pourquoi: "Direction : a + a = à." },
        { q: "Esta é a casa ___ Pedro.", choix: ["do", "de o", "no"], fr: "C'est la maison de Pedro.", pourquoi: "de + o = do." },
        { q: "Ela trabalha ___ hospital.", choix: ["num", "em um", "ao"], fr: "Elle travaille dans un hôpital.", pourquoi: "em + um = num." },
      ] },
    { id: "futuro", niveau: 1, titre: "Le futur : ir + infinitif et futuro",
      astuce: "À l'oral : ir + infinitif (vou comer). À l'écrit : infinitif + ei, ás, á, emos, ão (comerei).",
      explication: `Au quotidien, on parle du futur avec <b>ir + infinitif</b> : <i>Vou trabalhar amanhã. Vamos viajar em agosto.</i><br>
        Le <b>futuro</b> simple existe aussi, surtout à l'écrit et dans les textes formels : on ajoute <b>-ei, -ás, -á, -emos, -ão</b> à l'infinitif : <i>falarei, comerás, partirá</i>.<br>
        Irréguliers : fazer → <b>farei</b>, dizer → <b>direi</b>, trazer → <b>trarei</b>.`,
      pourquoi: "C'est comme notre futur proche « je vais manger », mais en portugais on l'utilise presque toujours, même pour un futur lointain. Le futuro simple sonne plus soutenu.",
      pieges: [["Vou a comer.", "Vou comer.", "Pas de préposition entre ir et l'infinitif."], ["Fazerei.", "Farei.", "fazer a un futur irrégulier : far-."]],
      exemples: [["Amanhã vou ao médico.", "Demain je vais chez le médecin."], ["Vamos jantar fora.", "Nous allons dîner dehors."], ["A reunião começará às dez.", "La réunion commencera à dix heures."]],
      exercices: [
        { q: "Amanhã eu ___ trabalhar.", choix: ["vou", "vai", "irei a"], fr: "Demain je vais travailler.", pourquoi: "ir + infinitif ; eu → vou." },
        { q: "Nós ___ viajar em agosto.", choix: ["vamos", "vão", "vamos a"], fr: "Nous allons voyager en août.", pourquoi: "nós → vamos + infinitif, sans préposition." },
        { q: "Eu ___ (fazer) o trabalho amanhã.", choix: ["farei", "fazerei", "fiz"], fr: "Je ferai le travail demain.", pourquoi: "fazer → futur irrégulier : farei." },
        { q: "O comboio ___ (partir) às oito.", choix: ["partirá", "partiu", "parte rá"], fr: "Le train partira à huit heures.", pourquoi: "Infinitif + á : partirá." },
      ] },
    { id: "estar-a", niveau: 1, titre: "Estar a + infinitif (être en train de)",
      astuce: "Au Portugal : estar a + infinitif (estou a comer). Au Brésil : estar + -ndo (estou comendo).",
      explication: `Pour une action <b>en cours</b>, on utilise <b>estar a + infinitif</b> : <i>Estou a trabalhar. O que estás a fazer?</i><br>
        C'est très fréquent, beaucoup plus que « être en train de » en français : <i>Está a chover.</i> (Il pleut, en ce moment.)<br>
        🇧🇷 Au Brésil, on dit <i>estou trabalhando</i> (gérondif). Les deux sont corrects, chacun dans son pays.`,
      pourquoi: "Le portugais distingue nettement « je travaille (en général) » = trabalho, et « je travaille (là, maintenant) » = estou a trabalhar.",
      pieges: [["Estou trabalhar.", "Estou a trabalhar.", "Au Portugal, il faut le a."], ["Sou a comer.", "Estou a comer.", "C'est estar, jamais ser."]],
      exemples: [["Estou a ler um livro.", "Je suis en train de lire un livre."], ["Eles estão a jogar à bola.", "Ils jouent au ballon (en ce moment)."], ["Está a chover muito.", "Il pleut beaucoup."]],
      exercices: [
        { q: "O que estás ___ fazer?", choix: ["a", "de", "—"], fr: "Qu'est-ce que tu es en train de faire ?", pourquoi: "estar a + infinitif." },
        { q: "Neste momento ___ a cozinhar.", choix: ["estou", "sou", "tenho"], fr: "En ce moment je suis en train de cuisiner.", pourquoi: "Action en cours → estar : estou." },
        { q: "Olha, ___ a chover!", choix: ["está", "é", "estão"], fr: "Regarde, il pleut !", pourquoi: "La météo du moment : está a chover." },
        { q: "Eles estão a ___ futebol.", choix: ["ver", "vêem", "visto"], fr: "Ils sont en train de regarder le football.", pourquoi: "Après estar a, le verbe reste à l'infinitif." },
      ] },
    // ---------- AUTONOME ----------
    { id: "imperfeito", niveau: 2, titre: "Imparfait ou passé (imperfeito / pretérito)",
      astuce: "imperfeito = décor, habitude, état (falava, comia) ; pretérito = action terminée, ponctuelle (falei, comi).",
      explication: `<b>imperfeito</b> : -ar → ava, avas, ava, ávamos, avam · -er/-ir → ia, ias, ia, íamos, iam.<br>
        On l'utilise pour les <b>habitudes</b> (<i>Quando era criança, ia à praia todos os dias</i>), les <b>descriptions</b> et les <b>états</b> (<i>Estava frio, eu estava cansado</i>).<br>
        Le <b>pretérito perfeito</b> raconte les <b>événements</b> : <i>De repente, o telefone tocou.</i><br>
        Les deux s'utilisent ensemble, comme en français : <i>Eu dormia quando ele chegou.</i><br>
        Irréguliers : ser → era · ter → tinha · vir → vinha · pôr → punha.`,
      pourquoi: "C'est la même logique qu'en français entre imparfait et passé composé : l'imparfait plante le décor, le passé fait avancer l'histoire. Bonne nouvelle : tu as déjà le réflexe.",
      pieges: [["Quando fui pequeno, ia à praia.", "Quando era pequeno, ia à praia.", "Un état qui dure → imperfeito : era."], ["Ontem jantava às oito e depois saí.", "Ontem jantei às oito e depois saí.", "Deux actions qui se suivent → pretérito."]],
      exemples: [["Antigamente morávamos em Faro.", "Avant, nous habitions à Faro."], ["Eu lia quando a luz se apagou.", "Je lisais quand la lumière s'est éteinte."], ["Era uma vez…", "Il était une fois…"]],
      exercices: [
        { q: "Quando eu ___ (ser) criança, vivia no Algarve.", choix: ["era", "fui", "sou"], fr: "Quand j'étais enfant, je vivais en Algarve.", pourquoi: "État qui dure dans le passé → imperfeito : era." },
        { q: "Todos os verões nós ___ (ir) à praia.", choix: ["íamos", "fomos", "vamos"], fr: "Tous les étés nous allions à la plage.", pourquoi: "Une habitude → imperfeito : íamos." },
        { q: "Eu dormia quando o telefone ___ (tocar).", choix: ["tocou", "tocava", "toca"], fr: "Je dormais quand le téléphone a sonné.", pourquoi: "L'événement qui interrompt → pretérito : tocou." },
        { q: "Ontem ___ (estar) muito calor.", choix: ["estava", "esteve a", "está"], fr: "Hier il faisait très chaud.", pourquoi: "Une description, la météo → imperfeito : estava." },
      ] },
    { id: "condicional", niveau: 2, titre: "Le conditionnel (condicional)",
      astuce: "infinitif + ia, ias, ia, íamos, iam (falaria, comeria) ; irréguliers : faria, diria, traria.",
      explication: `Le <b>condicional</b> exprime un souhait, une hypothèse ou une demande polie : <i>Gostaria de um café. Eu viajaria mais.</i><br>
        Formation : <b>infinitif + -ia, -ias, -ia, -íamos, -iam</b> : falaria, comerias, partiria.<br>
        Irréguliers (mêmes radicaux qu'au futur) : fazer → <b>faria</b>, dizer → <b>diria</b>, trazer → <b>traria</b>.<br>
        À l'oral, beaucoup de Portugais utilisent l'imparfait à la place : <i>Queria um café</i> (je voudrais un café).`,
      pourquoi: "Il fonctionne comme le conditionnel français (je parlerais). Pour commander poliment, « queria » est le plus naturel au Portugal.",
      pieges: [["Fazeria isso.", "Faria isso.", "fazer → far- au conditionnel."], ["Eu gostaria um café.", "Eu gostaria de um café.", "gostar garde toujours son de."]],
      exemples: [["Gostaria de reservar uma mesa.", "J'aimerais réserver une table."], ["No teu lugar, eu falaria com ele.", "À ta place, je lui parlerais."], ["Poderia ajudar-me?", "Pourriez-vous m'aider ?"]],
      exercices: [
        { q: "Eu ___ (gostar) de viajar mais.", choix: ["gostaria", "gostava de", "gostarei"], fr: "J'aimerais voyager plus.", pourquoi: "Un souhait → condicional : gostaria." },
        { q: "No teu lugar, eu ___ (fazer) o mesmo.", choix: ["faria", "fazeria", "fiz"], fr: "À ta place, je ferais pareil.", pourquoi: "fazer → faria." },
        { q: "___ (poder) fechar a janela, por favor?", choix: ["Poderia", "Poderá", "Pôde"], fr: "Pourriez-vous fermer la fenêtre, s'il vous plaît ?", pourquoi: "Demande polie → condicional : poderia." },
        { q: "Nós ___ (comprar) uma casa, mas é caro.", choix: ["compraríamos", "comprávamos de", "compramos"], fr: "Nous achèterions une maison, mais c'est cher.", pourquoi: "Une hypothèse → condicional : compraríamos." },
      ] },
    { id: "pronomes", niveau: 2, titre: "Les pronoms o, a, lhe et leur place",
      astuce: "Au Portugal, le pronom se met APRÈS le verbe avec un tiret (vejo-o) ; AVANT après não, que, já, também… (não o vejo).",
      explication: `<b>o, a, os, as</b> = le, la, les (complément direct) : <i>Conheço-o.</i> (Je le connais.)<br>
        <b>lhe, lhes</b> = lui, leur (complément indirect) : <i>Dou-lhe o livro.</i><br>
        <b>Place</b> : dans une phrase affirmative simple, le pronom se met <b>après</b> le verbe : <i>Vejo-a amanhã.</i><br>
        Il passe <b>avant</b> le verbe après <i>não, nunca, que, já, também, quem, onde…</i> : <i>Não a vejo. Acho que a conheço.</i><br>
        🇧🇷 Au Brésil, on met presque toujours le pronom avant : <i>Eu te vejo.</i>`,
      pourquoi: "C'est la grande différence avec le français et même avec le Brésil. Retiens la règle simple : phrase normale → après le verbe ; s'il y a un mot « aimant » (não, que, já…), il attire le pronom devant.",
      pieges: [["Eu o vejo.", "Eu vejo-o.", "Au Portugal, phrase affirmative → pronom après le verbe."], ["Não vejo-o.", "Não o vejo.", "Après não, le pronom passe devant."], ["Dou-o o livro.", "Dou-lhe o livro.", "« À lui » = lhe."]],
      exemples: [["Conheço-a muito bem.", "Je la connais très bien."], ["Não o encontro.", "Je ne le trouve pas."], ["Telefono-lhe amanhã.", "Je l'appelle demain."]],
      exercices: [
        { q: "O livro? Comprei-___ ontem.", choix: ["o", "lhe", "a"], fr: "Le livre ? Je l'ai acheté hier.", pourquoi: "livro est masculin, complément direct → o, après le verbe." },
        { q: "A Maria? Não ___ conheço.", choix: ["a", "lhe", "o"], fr: "Maria ? Je ne la connais pas.", pourquoi: "Après não, le pronom passe devant : não a conheço." },
        { q: "Dou-___ o presente amanhã.", choix: ["lhe", "o", "a"], fr: "Je lui donne le cadeau demain.", pourquoi: "Donner à quelqu'un → lhe." },
        { q: "Acho que ___ vi no café.", choix: ["o", "-o", "lhe"], fr: "Je crois que je l'ai vu au café.", pourquoi: "Après que, le pronom passe devant le verbe." },
      ] },
  ],
};
