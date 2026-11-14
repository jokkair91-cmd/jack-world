// Contenu ESPAGNOL de Jack Blabla.
// niveau : 0 = Amateur, 1 = Moyen, 2 = Autonome
// Exercices : le PREMIER choix est toujours la bonne réponse (ils sont mélangés à l'affichage).

CONTENU.es = {
  pronoms: ["yo", "tú", "él/ella", "nosotros", "vosotros", "ellos/ellas"],
  pronomsFr: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],

  temps: [
    { id: "presente", nom: "Présent (presente)", niveau: 0 },
    { id: "indefinido", nom: "Passé simple (indefinido)", niveau: 1 },
    { id: "futuro", nom: "Futur (futuro)", niveau: 1 },
    { id: "imperfecto", nom: "Imparfait (imperfecto)", niveau: 2 },
    { id: "condicional", nom: "Conditionnel (condicional)", niveau: 2 },
  ],

  // Les temps absents de "formes" sont calculés automatiquement (verbes réguliers).
  // radicalFutur : radical irrégulier du futur et du conditionnel.
  verbes: [
    { inf: "ser", fr: "être (identité)", niveau: 0, irregulier: true, formes: {
      presente: ["soy", "eres", "es", "somos", "sois", "son"],
      indefinido: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"],
      imperfecto: ["era", "eras", "era", "éramos", "erais", "eran"] } },
    { inf: "estar", fr: "être (état, lieu)", niveau: 0, irregulier: true, formes: {
      presente: ["estoy", "estás", "está", "estamos", "estáis", "están"],
      indefinido: ["estuve", "estuviste", "estuvo", "estuvimos", "estuvisteis", "estuvieron"] } },
    { inf: "tener", fr: "avoir", niveau: 0, irregulier: true, radicalFutur: "tendr", formes: {
      presente: ["tengo", "tienes", "tiene", "tenemos", "tenéis", "tienen"],
      indefinido: ["tuve", "tuviste", "tuvo", "tuvimos", "tuvisteis", "tuvieron"] } },
    { inf: "ir", fr: "aller", niveau: 0, irregulier: true, formes: {
      presente: ["voy", "vas", "va", "vamos", "vais", "van"],
      indefinido: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"],
      imperfecto: ["iba", "ibas", "iba", "íbamos", "ibais", "iban"] } },
    { inf: "hacer", fr: "faire", niveau: 0, irregulier: true, radicalFutur: "har", formes: {
      presente: ["hago", "haces", "hace", "hacemos", "hacéis", "hacen"],
      indefinido: ["hice", "hiciste", "hizo", "hicimos", "hicisteis", "hicieron"] } },
    { inf: "querer", fr: "vouloir, aimer", niveau: 0, irregulier: true, radicalFutur: "querr", formes: {
      presente: ["quiero", "quieres", "quiere", "queremos", "queréis", "quieren"],
      indefinido: ["quise", "quisiste", "quiso", "quisimos", "quisisteis", "quisieron"] } },
    { inf: "hablar", fr: "parler", niveau: 0 },
    { inf: "comer", fr: "manger", niveau: 0 },
    { inf: "vivir", fr: "vivre, habiter", niveau: 0 },
    { inf: "trabajar", fr: "travailler", niveau: 0 },
    { inf: "poder", fr: "pouvoir", niveau: 1, irregulier: true, radicalFutur: "podr", formes: {
      presente: ["puedo", "puedes", "puede", "podemos", "podéis", "pueden"],
      indefinido: ["pude", "pudiste", "pudo", "pudimos", "pudisteis", "pudieron"] } },
    { inf: "decir", fr: "dire", niveau: 1, irregulier: true, radicalFutur: "dir", formes: {
      presente: ["digo", "dices", "dice", "decimos", "decís", "dicen"],
      indefinido: ["dije", "dijiste", "dijo", "dijimos", "dijisteis", "dijeron"] } },
    { inf: "venir", fr: "venir", niveau: 1, irregulier: true, radicalFutur: "vendr", formes: {
      presente: ["vengo", "vienes", "viene", "venimos", "venís", "vienen"],
      indefinido: ["vine", "viniste", "vino", "vinimos", "vinisteis", "vinieron"] } },
    { inf: "saber", fr: "savoir", niveau: 1, irregulier: true, radicalFutur: "sabr", formes: {
      presente: ["sé", "sabes", "sabe", "sabemos", "sabéis", "saben"],
      indefinido: ["supe", "supiste", "supo", "supimos", "supisteis", "supieron"] } },
    { inf: "dar", fr: "donner", niveau: 1, irregulier: true, formes: {
      presente: ["doy", "das", "da", "damos", "dais", "dan"],
      indefinido: ["di", "diste", "dio", "dimos", "disteis", "dieron"] } },
    { inf: "ver", fr: "voir", niveau: 1, irregulier: true, formes: {
      presente: ["veo", "ves", "ve", "vemos", "veis", "ven"],
      indefinido: ["vi", "viste", "vio", "vimos", "visteis", "vieron"],
      imperfecto: ["veía", "veías", "veía", "veíamos", "veíais", "veían"] } },
    { inf: "poner", fr: "mettre", niveau: 1, irregulier: true, radicalFutur: "pondr", formes: {
      presente: ["pongo", "pones", "pone", "ponemos", "ponéis", "ponen"],
      indefinido: ["puse", "pusiste", "puso", "pusimos", "pusisteis", "pusieron"] } },
    { inf: "aprender", fr: "apprendre", niveau: 1 },
    { inf: "escribir", fr: "écrire", niveau: 1 },
    { inf: "estudiar", fr: "étudier", niveau: 1 },
    { inf: "dormir", fr: "dormir", niveau: 2, irregulier: true, formes: {
      presente: ["duermo", "duermes", "duerme", "dormimos", "dormís", "duermen"],
      indefinido: ["dormí", "dormiste", "durmió", "dormimos", "dormisteis", "durmieron"] } },
    { inf: "pedir", fr: "demander, commander", niveau: 2, irregulier: true, formes: {
      presente: ["pido", "pides", "pide", "pedimos", "pedís", "piden"],
      indefinido: ["pedí", "pediste", "pidió", "pedimos", "pedisteis", "pidieron"] } },
    { inf: "salir", fr: "sortir", niveau: 2, irregulier: true, radicalFutur: "saldr", formes: {
      presente: ["salgo", "sales", "sale", "salimos", "salís", "salen"] } },
    { inf: "conocer", fr: "connaître", niveau: 2, irregulier: true, formes: {
      presente: ["conozco", "conoces", "conoce", "conocemos", "conocéis", "conocen"] } },
    { inf: "viajar", fr: "voyager", niveau: 2 },
    { inf: "beber", fr: "boire", niveau: 2 },
  ],

  irreguliers: {
    colonnes: ["Infinitif", "Présent (yo)", "Passé simple (él)", "Participe passé"],
    lignes: [
      // [infinitif, présent yo, indefinido él, participe, français, niveau]
      ["ser", "soy", "fue", "sido", "être", 0], ["estar", "estoy", "estuvo", "estado", "être (état)", 0],
      ["tener", "tengo", "tuvo", "tenido", "avoir", 0], ["ir", "voy", "fue", "ido", "aller", 0],
      ["hacer", "hago", "hizo", "hecho", "faire", 0], ["querer", "quiero", "quiso", "querido", "vouloir", 0],
      ["poder", "puedo", "pudo", "podido", "pouvoir", 0], ["decir", "digo", "dijo", "dicho", "dire", 0],
      ["venir", "vengo", "vino", "venido", "venir", 0], ["ver", "veo", "vio", "visto", "voir", 0],
      ["saber", "sé", "supo", "sabido", "savoir", 1], ["dar", "doy", "dio", "dado", "donner", 1],
      ["poner", "pongo", "puso", "puesto", "mettre", 1], ["salir", "salgo", "salió", "salido", "sortir", 1],
      ["dormir", "duermo", "durmió", "dormido", "dormir", 1], ["pedir", "pido", "pidió", "pedido", "demander", 1],
      ["escribir", "escribo", "escribió", "escrito", "écrire", 1], ["volver", "vuelvo", "volvió", "vuelto", "revenir", 1],
      ["empezar", "empiezo", "empezó", "empezado", "commencer", 1], ["jugar", "juego", "jugó", "jugado", "jouer", 1],
      ["conocer", "conozco", "conoció", "conocido", "connaître", 2], ["traer", "traigo", "trajo", "traído", "apporter", 2],
      ["abrir", "abro", "abrió", "abierto", "ouvrir", 2], ["morir", "muero", "murió", "muerto", "mourir", 2],
      ["romper", "rompo", "rompió", "roto", "casser", 2], ["caer", "caigo", "cayó", "caído", "tomber", 2],
      ["oír", "oigo", "oyó", "oído", "entendre", 2], ["conducir", "conduzco", "condujo", "conducido", "conduire", 2],
      ["pensar", "pienso", "pensó", "pensado", "penser", 2], ["sentir", "siento", "sintió", "sentido", "ressentir", 2],
    ],
  },

  themes: [
    // ---------- AMATEUR ----------
    { id: "salut", niveau: 0, titre: "Dire bonjour", emoji: "👋",
      mots: [["Bonjour", "Hola"], ["Bonjour (le matin)", "Buenos días"], ["Au revoir", "Adiós"], ["Merci", "Gracias"], ["S'il vous plaît", "Por favor"],
        ["Oui", "Sí"], ["Non", "No"], ["Comment ça va ?", "¿Qué tal?"], ["Ça va bien", "Estoy bien"]],
      dialogue: [
        { who: "jack", txt: "¡Hola! ¿Qué tal?", fr: "Bonjour ! Comment ça va ?" },
        { who: "toi", choices: ["¡Estoy bien, gracias!", "¡Adiós!", "¿Dónde está la estación?"], fr: "Ça va bien, merci !" },
        { who: "jack", txt: "¡Genial! ¡Adiós!", fr: "Super ! Au revoir !" },
        { who: "toi", choices: ["¡Adiós!", "Un café, por favor", "Sí"], fr: "Au revoir !" },
      ] },
    { id: "moi", niveau: 0, titre: "Se présenter", emoji: "🙋",
      mots: [["Je m'appelle…", "Me llamo…"], ["J'ai … ans", "Tengo … años"], ["Je suis français", "Soy francés"], ["J'habite à Paris", "Vivo en París"],
        ["Enchanté", "Encantado"], ["Et toi ?", "¿Y tú?"], ["Je parle un peu espagnol", "Hablo un poco de español"]],
      dialogue: [
        { who: "jack", txt: "¡Hola! Me llamo Jack. ¿Cómo te llamas?", fr: "Salut ! Je m'appelle Jack. Comment tu t'appelles ?" },
        { who: "toi", choices: ["Me llamo Léa.", "Estoy perdido.", "La cuenta"], fr: "Je m'appelle Léa." },
        { who: "jack", txt: "¡Encantado! ¿Dónde vives?", fr: "Enchanté ! Où habites-tu ?" },
        { who: "toi", choices: ["Vivo en París.", "Gracias", "Todo recto"], fr: "J'habite à Paris." },
      ] },
    { id: "chiffres", niveau: 0, titre: "Les chiffres", emoji: "🔢",
      mots: [["un", "uno"], ["deux", "dos"], ["trois", "tres"], ["quatre", "cuatro"], ["cinq", "cinco"], ["six", "seis"],
        ["sept", "siete"], ["huit", "ocho"], ["neuf", "nueve"], ["dix", "diez"], ["vingt", "veinte"], ["cent", "cien"]],
      dialogue: [
        { who: "jack", txt: "¿Cuántos años tienes?", fr: "Quel âge as-tu ?" },
        { who: "toi", choices: ["Tengo veinte años.", "Hola", "Agua"], fr: "J'ai vingt ans." },
        { who: "jack", txt: "Uno, dos, tres… ¿y después?", fr: "Un, deux, trois… et après ?" },
        { who: "toi", choices: ["¡Cuatro!", "¡Siete!", "¡Diez!"], fr: "Quatre !" },
      ] },
    { id: "famille", niveau: 0, titre: "La famille", emoji: "👨‍👩‍👧",
      mots: [["La mère", "La madre"], ["Le père", "El padre"], ["Le frère", "El hermano"], ["La sœur", "La hermana"], ["Le fils", "El hijo"],
        ["La fille", "La hija"], ["La grand-mère", "La abuela"], ["Le grand-père", "El abuelo"], ["Le mari", "El marido"],
        ["La femme (épouse)", "La esposa"], ["L'enfant", "El niño"], ["L'ami", "El amigo"]],
      dialogue: [
        { who: "jack", txt: "¿Tienes hermanos?", fr: "As-tu des frères et sœurs ?" },
        { who: "toi", choices: ["Sí, tengo una hermana.", "Sí, soy una hermana.", "No, estoy cansado."], fr: "Oui, j'ai une sœur." },
        { who: "jack", txt: "¿Cómo se llama?", fr: "Comment s'appelle-t-elle ?" },
        { who: "toi", choices: ["Se llama Emma.", "Me llamo Emma.", "Es llama Emma."], fr: "Elle s'appelle Emma." },
      ] },
    { id: "cafe", niveau: 0, titre: "Au café", emoji: "☕",
      mots: [["Un café, s'il vous plaît", "Un café, por favor"], ["De l'eau", "Agua"], ["Un thé", "Un té"], ["L'addition", "La cuenta"],
        ["Combien ça coûte ?", "¿Cuánto cuesta?"], ["Je voudrais…", "Quisiera…"], ["C'est délicieux", "Está delicioso"]],
      dialogue: [
        { who: "jack", txt: "¡Hola! ¿Qué quieres tomar?", fr: "Bonjour ! Que désirez-vous ?" },
        { who: "toi", choices: ["Un café, por favor.", "Estoy perdido.", "A la izquierda."], fr: "Un café, s'il vous plaît." },
        { who: "jack", txt: "¡Aquí tienes!", fr: "Voilà !" },
        { who: "toi", choices: ["¡Gracias! ¿Cuánto cuesta?", "Me llamo Jack.", "No"], fr: "Merci ! Combien ça coûte ?" },
        { who: "jack", txt: "Tres euros, por favor.", fr: "Trois euros, s'il vous plaît." },
      ] },
    { id: "voyage", niveau: 0, titre: "En voyage", emoji: "✈️",
      mots: [["Où est la gare ?", "¿Dónde está la estación?"], ["L'aéroport", "El aeropuerto"], ["L'hôtel", "El hotel"], ["À gauche", "A la izquierda"],
        ["À droite", "A la derecha"], ["Tout droit", "Todo recto"], ["Je suis perdu", "Estoy perdido"], ["Aidez-moi", "Ayúdeme"]],
      dialogue: [
        { who: "jack", txt: "Hola, ¿puedo ayudarte?", fr: "Bonjour, je peux t'aider ?" },
        { who: "toi", choices: ["¡Sí! ¿Dónde está la estación?", "Un té, por favor.", "Soy francés."], fr: "Oui ! Où est la gare ?" },
        { who: "jack", txt: "Todo recto y luego a la izquierda.", fr: "Tout droit puis à gauche." },
        { who: "toi", choices: ["¡Muchas gracias!", "¿Cuántos años tienes?", "Hola"], fr: "Merci beaucoup !" },
      ] },

    // ---------- MOYEN ----------
    { id: "meteo", niveau: 1, titre: "Le temps et la météo", emoji: "🌦️",
      mots: [["Quelle heure est-il ?", "¿Qué hora es?"], ["Il fait beau", "Hace buen tiempo"], ["Il pleut", "Llueve"], ["Il fait froid", "Hace frío"],
        ["Il fait chaud", "Hace calor"], ["Aujourd'hui", "Hoy"], ["Demain", "Mañana"], ["Hier", "Ayer"], ["La semaine", "La semana"],
        ["Lundi", "El lunes"], ["Le week-end", "El fin de semana"]],
      dialogue: [
        { who: "jack", txt: "¿Qué tiempo hizo ayer?", fr: "Quel temps a-t-il fait hier ?" },
        { who: "toi", choices: ["Hizo frío y llovió.", "Hace frío mañana.", "Estoy frío, gracias."], fr: "Il a fait froid et il a plu." },
        { who: "jack", txt: "¿Y qué vas a hacer este fin de semana?", fr: "Et que vas-tu faire ce week-end ?" },
        { who: "toi", choices: ["Voy a visitar a mis padres.", "Visité a mis padres.", "Voy visitar mis padres."], fr: "Je vais rendre visite à mes parents." },
      ] },
    { id: "ville", niveau: 1, titre: "En ville et shopping", emoji: "🛍️",
      mots: [["La boutique", "La tienda"], ["Le marché", "El mercado"], ["La banque", "El banco"], ["La pharmacie", "La farmacia"],
        ["Je cherche…", "Busco…"], ["C'est trop cher", "Es demasiado caro"], ["Je peux payer par carte ?", "¿Puedo pagar con tarjeta?"],
        ["La taille", "La talla"], ["Je le prends", "Me lo llevo"], ["Ouvert", "Abierto"], ["Fermé", "Cerrado"]],
      dialogue: [
        { who: "jack", txt: "¡Buenos días! ¿Le puedo ayudar?", fr: "Bonjour ! Je peux vous aider ?" },
        { who: "toi", choices: ["Sí, busco una chaqueta.", "Sí, busco a una chaqueta ayer.", "Sí, estoy una chaqueta."], fr: "Oui, je cherche une veste." },
        { who: "jack", txt: "Esta cuesta cincuenta euros.", fr: "Celle-ci coûte cinquante euros." },
        { who: "toi", choices: ["Perfecto, me la llevo. ¿Puedo pagar con tarjeta?", "Es demasiado mucho caro.", "Me lo llevé mañana."], fr: "Parfait, je la prends. Je peux payer par carte ?" },
      ] },
    { id: "travail", niveau: 1, titre: "Au travail", emoji: "💼",
      mots: [["Le travail", "El trabajo"], ["Le bureau", "La oficina"], ["Le collègue", "El compañero"], ["Le patron", "El jefe"],
        ["La réunion", "La reunión"], ["Le salaire", "El sueldo"], ["Je travaille dans…", "Trabajo en…"], ["Envoyer un e-mail", "Enviar un correo"],
        ["Être en retard", "Llegar tarde"], ["Une pause", "Un descanso"]] },
    { id: "sante", niveau: 1, titre: "Santé et corps", emoji: "🩺",
      mots: [["La tête", "La cabeza"], ["Le ventre", "El estómago"], ["Le dos", "La espalda"], ["La main", "La mano"], ["Le pied", "El pie"],
        ["J'ai mal à la tête", "Me duele la cabeza"], ["Le médecin", "El médico"], ["Le médicament", "El medicamento"],
        ["Je suis malade", "Estoy enfermo"], ["Je suis fatigué", "Estoy cansado"]],
      dialogue: [
        { who: "jack", txt: "¿Qué te pasa?", fr: "Qu'est-ce qui t'arrive ?" },
        { who: "toi", choices: ["Me duele la cabeza y estoy cansado.", "Me duelo la cabeza.", "Soy cansado y cabeza."], fr: "J'ai mal à la tête et je suis fatigué." },
        { who: "jack", txt: "Deberías ir al médico.", fr: "Tu devrais aller chez le médecin." },
        { who: "toi", choices: ["Tienes razón, lo llamaré.", "Tienes razón, le llamo ayer.", "Tengo razón, lo llamé mañana."], fr: "Tu as raison, je l'appellerai." },
      ] },
    { id: "loisirs", niveau: 1, titre: "Loisirs", emoji: "🎸",
      mots: [["Le sport", "El deporte"], ["La musique", "La música"], ["Le film", "La película"], ["Lire", "Leer"], ["Nager", "Nadar"],
        ["Voyager", "Viajar"], ["Cuisiner", "Cocinar"], ["J'aime…", "Me gusta…"], ["Je préfère…", "Prefiero…"],
        ["Qu'est-ce que tu fais le week-end ?", "¿Qué haces el fin de semana?"]] },

    // ---------- AUTONOME ----------
    { id: "opinions", niveau: 2, titre: "Opinions et émotions", emoji: "💭",
      mots: [["À mon avis", "En mi opinión"], ["Je suis d'accord", "Estoy de acuerdo"], ["Je ne suis pas d'accord", "No estoy de acuerdo"],
        ["Ça dépend", "Depende"], ["Heureux", "Feliz"], ["Triste", "Triste"], ["Inquiet", "Preocupado"], ["Déçu", "Decepcionado"],
        ["Fier", "Orgulloso"], ["J'en ai marre", "Estoy harto"]],
      dialogue: [
        { who: "jack", txt: "¿Crees que las redes sociales son buenas para los jóvenes?", fr: "Crois-tu que les réseaux sociaux sont bons pour les jeunes ?" },
        { who: "toi", choices: ["Depende. En mi opinión, pueden ser útiles, pero…", "Soy de acuerdo.", "Sí, creo que sí son buenos pero que."], fr: "Ça dépend. À mon avis, ils peuvent être utiles, mais…" },
        { who: "jack", txt: "Entonces, ¿estás un poco preocupado?", fr: "Donc, tu es un peu inquiet ?" },
        { who: "toi", choices: ["Sí, me preocupa que pasen tanto tiempo en ellas.", "Sí, me preocupa que pasan tanto tiempo.", "Sí, soy preocupado del tiempo."], fr: "Oui, ça m'inquiète qu'ils y passent autant de temps." },
      ] },
    { id: "connecteurs", niveau: 2, titre: "Les connecteurs", emoji: "🔗",
      mots: [["Cependant", "Sin embargo"], ["Donc", "Por lo tanto"], ["En revanche", "En cambio"], ["Grâce à", "Gracias a"],
        ["À cause de", "A causa de"], ["Bien que", "Aunque"], ["Afin de", "Con el fin de"], ["Enfin", "Finalmente"], ["De plus", "Además"], ["Par exemple", "Por ejemplo"]] },
    { id: "societe", niveau: 2, titre: "Société et actualité", emoji: "📰",
      mots: [["L'environnement", "El medio ambiente"], ["Le gouvernement", "El gobierno"], ["Les élections", "Las elecciones"], ["Le chômage", "El paro"],
        ["Le réchauffement climatique", "El calentamiento global"], ["La santé publique", "La salud pública"], ["Les réseaux sociaux", "Las redes sociales"],
        ["L'égalité", "La igualdad"], ["La pollution", "La contaminación"], ["La recherche", "La investigación"]] },
    { id: "pro", niveau: 2, titre: "Vie professionnelle", emoji: "📈",
      mots: [["Un entretien d'embauche", "Una entrevista de trabajo"], ["Le CV", "El currículum"], ["Les compétences", "Las competencias"],
        ["Postuler", "Solicitar un puesto"], ["Embaucher", "Contratar"], ["Démissionner", "Dimitir"], ["Une augmentation", "Un aumento de sueldo"],
        ["Un contrat", "Un contrato"], ["Un délai", "Un plazo"], ["Négocier", "Negociar"]],
      dialogue: [
        { who: "jack", txt: "¿Por qué ha solicitado este puesto?", fr: "Pourquoi avez-vous postulé à ce poste ?" },
        { who: "toi", choices: ["Porque mis competencias corresponden a lo que buscan.", "Porque soy solicitando ayer.", "Porque quiero más el dinero que."], fr: "Parce que mes compétences correspondent à ce que vous cherchez." },
        { who: "jack", txt: "¿Qué ha hecho estos dos últimos años?", fr: "Qu'avez-vous fait ces deux dernières années ?" },
        { who: "toi", choices: ["He trabajado como jefe de proyecto.", "He trabajo como jefe de proyecto.", "Trabajaba jefe proyecto desde dos años."], fr: "J'ai travaillé comme chef de projet." },
      ] },
    { id: "expressions", niveau: 2, titre: "Expressions idiomatiques", emoji: "🎭",
      mots: [["Il pleut des cordes", "Llueve a cántaros"], ["Ce n'est pas ma tasse de thé", "No es lo mío"],
        ["Coûter les yeux de la tête", "Costar un ojo de la cara"], ["Briser la glace", "Romper el hielo"], ["Être dans la lune", "Estar en las nubes"],
        ["Faire d'une pierre deux coups", "Matar dos pájaros de un tiro"], ["C'est du gâteau", "Es pan comido"],
        ["Je l'ai sur le bout de la langue", "Lo tengo en la punta de la lengua"], ["Croiser les doigts", "Cruzar los dedos"]] },
  ],

  grammaire: [
    // ---------- AMATEUR ----------
    { id: "ser-estar", niveau: 0, titre: "Ser ou estar ? (être)",
      explication: `L'espagnol a <b>deux verbes « être »</b> :<br>
        <b>ser</b> → ce qu'on EST : identité, nationalité, métier, caractère, l'heure → <i>Soy francés. Es médica.</i><br>
        <b>estar</b> → OÙ on est et COMMENT on va (état passager) → <i>Estoy cansado. Madrid está en España.</i>`,
      exemples: [["Soy profesor.", "Je suis professeur."], ["Estoy en casa.", "Je suis à la maison."], ["Hoy estoy contento.", "Aujourd'hui je suis content."]],
      exercices: [
        { q: "Yo ___ francés.", choix: ["soy", "estoy", "es"], fr: "Je suis français." },
        { q: "Madrid ___ en España.", choix: ["está", "es", "son"], fr: "Madrid est en Espagne." },
        { q: "Hoy ___ cansado.", choix: ["estoy", "soy", "es"], fr: "Aujourd'hui je suis fatigué." },
        { q: "Mi hermana ___ médica.", choix: ["es", "está", "son"], fr: "Ma sœur est médecin." },
        { q: "¿Dónde ___ el baño?", choix: ["está", "es", "hay"], fr: "Où sont les toilettes ?" },
      ] },
    { id: "articles-genre", niveau: 0, titre: "Articles et genre",
      explication: `<b>el / la / los / las</b> = le, la, les. <b>un / una / unos / unas</b> = un, une, des.<br>
        Mots en <b>-o</b> → masculin, en <b>-a</b> → féminin. Exceptions : <i>el día, el problema, la mano</i>.<br>
        ⚠️ Pièges pour les Français : <i><b>la</b> leche</i> (le lait), <i><b>el</b> coche</i>, <i><b>la</b> sal</i> (le sel).`,
      exemples: [["la casa", "la maison"], ["el problema", "le problème"], ["unos amigos", "des amis"]],
      exercices: [
        { q: "___ casa", choix: ["la", "el", "los"], fr: "la maison" },
        { q: "___ libro", choix: ["el", "la", "las"], fr: "le livre" },
        { q: "___ problema", choix: ["el", "la", "los"], fr: "le problème" },
        { q: "___ mano", choix: ["la", "el", "las"], fr: "la main" },
        { q: "Tengo ___ perro.", choix: ["un", "una", "unos"], fr: "J'ai un chien." },
      ] },
    { id: "pluriel", niveau: 0, titre: "Le pluriel",
      explication: `Mot en voyelle → <b>+s</b> (<i>libro → libros</i>). Mot en consonne → <b>+es</b> (<i>ciudad → ciudades</i>).<br>
        <b>-z</b> devient <b>-ces</b> : <i>lápiz → lápices</i>. L'adjectif s'accorde : <i>las casas blancas</i>.`,
      exemples: [["dos libros", "deux livres"], ["tres ciudades", "trois villes"], ["los coches rojos", "les voitures rouges"]],
      exercices: [
        { q: "un libro, dos ___", choix: ["libros", "libroes", "libro"], fr: "un livre, deux livres" },
        { q: "una ciudad, dos ___", choix: ["ciudades", "ciudads", "ciudadas"], fr: "une ville, deux villes" },
        { q: "un lápiz, dos ___", choix: ["lápices", "lápizes", "lápizs"], fr: "un crayon, deux crayons" },
        { q: "las casas ___", choix: ["blancas", "blancos", "blanca"], fr: "les maisons blanches" },
      ] },
    { id: "present", niveau: 0, titre: "Le présent des verbes réguliers",
      explication: `Trois groupes : <b>-ar</b> (hablar), <b>-er</b> (comer), <b>-ir</b> (vivir).<br>
        -ar : o, as, a, amos, áis, an · -er : o, es, e, emos, éis, en · -ir : o, es, e, imos, ís, en<br>
        On n'utilise presque jamais le pronom : <i>hablo</i> = je parle. → Va voir l'onglet Conjugaison !`,
      exemples: [["Hablo español.", "Je parle espagnol."], ["Comemos a las dos.", "Nous mangeons à deux heures."], ["¿Dónde vives?", "Où habites-tu ?"]],
      exercices: [
        { q: "Yo ___ español.", choix: ["hablo", "habla", "hablas"], fr: "Je parle espagnol." },
        { q: "Nosotros ___ en Madrid.", choix: ["vivimos", "vivemos", "viven"], fr: "Nous habitons à Madrid." },
        { q: "¿Tú ___ carne?", choix: ["comes", "comas", "come"], fr: "Tu manges de la viande ?" },
        { q: "Ellos ___ en un banco.", choix: ["trabajan", "trabajamos", "trabajas"], fr: "Ils travaillent dans une banque." },
        { q: "Vosotros ___ mucho.", choix: ["aprendéis", "aprendís", "aprenden"], fr: "Vous apprenez beaucoup." },
      ] },
    { id: "hay", niveau: 0, titre: "Hay (il y a)",
      explication: `<b>hay</b> = il y a, invariable (singulier et pluriel).<br>
        ⚠️ Pour situer une chose précise (avec el/la), on utilise <b>estar</b> : <i>Hay un banco aquí</i> / <i>El banco está aquí</i>.`,
      exemples: [["Hay un bar en la plaza.", "Il y a un bar sur la place."], ["No hay leche.", "Il n'y a pas de lait."], ["El museo está a la derecha.", "Le musée est à droite."]],
      exercices: [
        { q: "___ un bar en la plaza.", choix: ["Hay", "Está", "Es"], fr: "Il y a un bar sur la place." },
        { q: "¿___ farmacias cerca?", choix: ["Hay", "Están", "Son"], fr: "Y a-t-il des pharmacies près d'ici ?" },
        { q: "El museo ___ a la derecha.", choix: ["está", "hay", "es"], fr: "Le musée est à droite." },
        { q: "No ___ leche.", choix: ["hay", "está", "es"], fr: "Il n'y a pas de lait." },
      ] },
    { id: "gustar", niveau: 0, titre: "Gustar (aimer)",
      explication: `Mot à mot « <i>me gusta</i> » = « ça me plaît ». Le verbe s'accorde avec <b>ce qu'on aime</b> :<br>
        <b>me gusta</b> + singulier ou infinitif · <b>me gustan</b> + pluriel.<br>
        Pronoms : me, te, le, nos, os, les → <i>A ella le gusta bailar.</i>`,
      exemples: [["Me gusta el chocolate.", "J'aime le chocolat."], ["Me gustan los perros.", "J'aime les chiens."], ["¿Te gusta bailar?", "Tu aimes danser ?"]],
      exercices: [
        { q: "Me ___ el chocolate.", choix: ["gusta", "gustan", "gusto"], fr: "J'aime le chocolat." },
        { q: "Me ___ los perros.", choix: ["gustan", "gusta", "gustas"], fr: "J'aime les chiens." },
        { q: "¿Te ___ bailar?", choix: ["gusta", "gustan", "gustas"], fr: "Tu aimes danser ?" },
        { q: "A ella ___ gusta el cine.", choix: ["le", "la", "se"], fr: "Elle aime le cinéma." },
        { q: "A nosotros ___ gustan los viajes.", choix: ["nos", "os", "les"], fr: "Nous aimons les voyages." },
      ] },

    // ---------- MOYEN ----------
    { id: "diphtongue", niveau: 1, titre: "Les verbes qui changent (e → ie, o → ue)",
      explication: `Au présent, certains verbes changent de voyelle <b>sauf avec nosotros et vosotros</b> (on dit « verbes botte ») :<br>
        <b>e → ie</b> : querer → quiero, pensar → pienso, empezar → empiezo<br>
        <b>o → ue</b> : poder → puedo, dormir → duermo, volver → vuelvo<br>
        <b>e → i</b> : pedir → pido`,
      exemples: [["Quiero un café.", "Je veux un café."], ["¿Puedes venir?", "Peux-tu venir ?"], ["Podemos ir.", "Nous pouvons y aller."]],
      exercices: [
        { q: "Yo ___ un café.", choix: ["quiero", "quero", "queremos"], fr: "Je veux un café." },
        { q: "Ella no ___ venir.", choix: ["puede", "pode", "podemos"], fr: "Elle ne peut pas venir." },
        { q: "Nosotros ___ a las ocho.", choix: ["empezamos", "empiezamos", "empiezan"], fr: "Nous commençons à huit heures." },
        { q: "¿Tú ___ bien?", choix: ["duermes", "dormes", "duerme"], fr: "Tu dors bien ?" },
        { q: "Ellos ___ la cuenta.", choix: ["piden", "peden", "pedimos"], fr: "Ils demandent l'addition." },
      ] },
    { id: "indefinido", niveau: 1, titre: "Le passé simple (pretérito indefinido)",
      explication: `Pour une action <b>terminée</b> à un moment précis : <i>ayer, el año pasado, en 2010</i>. C'est le passé de tous les jours !<br>
        -ar : é, aste, ó, amos, asteis, aron · -er/-ir : í, iste, ió, imos, isteis, ieron<br>
        Beaucoup d'irréguliers : <i>fui</i> (ser ET ir), <i>tuve, hice, dije, pude</i>… → onglets Conjugaison et Irréguliers.`,
      exemples: [["Ayer hablé con mi madre.", "Hier j'ai parlé avec ma mère."], ["Fuimos a México.", "Nous sommes allés au Mexique."], ["¿Qué hiciste?", "Qu'as-tu fait ?"]],
      exercices: [
        { q: "Ayer ___ con mi madre.", choix: ["hablé", "hablo", "hablaba"], fr: "Hier j'ai parlé avec ma mère." },
        { q: "El año pasado ___ a México.", choix: ["fuimos", "vamos", "íbamos"], fr: "L'an dernier nous sommes allés au Mexique." },
        { q: "¿Qué ___ tú el sábado?", choix: ["hiciste", "haciste", "hizo"], fr: "Qu'as-tu fait samedi ?" },
        { q: "Ella ___ una carta.", choix: ["escribió", "escribí", "escribe"], fr: "Elle a écrit une lettre." },
        { q: "Ellos ___ mucho.", choix: ["comieron", "comiron", "comían"], fr: "Ils ont beaucoup mangé." },
      ] },
    { id: "futur", niveau: 1, titre: "Le futur",
      explication: `<b>Futur proche</b> : <b>ir a + infinitif</b> → <i>Voy a comer</i> (je vais manger). Très courant à l'oral !<br>
        <b>Futur simple</b> : infinitif + é, ás, á, emos, éis, án → <i>hablaré, comeré</i>.<br>
        Radicaux irréguliers : tendr-, har-, podr-, dir-, vendr-, sabr-, pondr-, saldr-, querr-.`,
      exemples: [["Voy a ir a la playa.", "Je vais aller à la plage."], ["Mañana lloverá.", "Demain il pleuvra."], ["Tendré tiempo.", "J'aurai le temps."]],
      exercices: [
        { q: "Mañana ___ a la playa.", choix: ["voy a ir", "voy ir", "iré a"], fr: "Demain je vais aller à la plage." },
        { q: "El año que viene ___ en Francia.", choix: ["viviré", "viviró", "vivo a"], fr: "L'année prochaine je vivrai en France." },
        { q: "¿Qué ___ hacer este fin de semana?", choix: ["vas a", "vas", "irás a"], fr: "Que vas-tu faire ce week-end ?" },
        { q: "Ella ___ mucho dinero.", choix: ["tendrá", "tenerá", "teniará"], fr: "Elle aura beaucoup d'argent." },
        { q: "Nosotros lo ___ mañana.", choix: ["haremos", "haceremos", "hacemos a"], fr: "Nous le ferons demain." },
      ] },
    { id: "cod", niveau: 1, titre: "Les pronoms lo, la, los, las",
      explication: `Ils remplacent un complément direct : <b>lo</b> (masc.), <b>la</b> (fém.), <b>los</b>, <b>las</b>.<br>
        Place : <b>avant</b> le verbe conjugué (<i>Lo tengo</i>) ou <b>collé</b> à l'infinitif (<i>Quiero comprarlo</i>).`,
      exemples: [["¿El libro? Lo tengo.", "Le livre ? Je l'ai."], ["¿Las llaves? No las encuentro.", "Les clés ? Je ne les trouve pas."], ["Voy a comprarlo.", "Je vais l'acheter."]],
      exercices: [
        { q: "¿El libro? ___ tengo.", choix: ["Lo", "La", "Le"], fr: "Le livre ? Je l'ai." },
        { q: "¿Las llaves? No ___ encuentro.", choix: ["las", "los", "la"], fr: "Les clés ? Je ne les trouve pas." },
        { q: "¿El coche? Quiero comprar___.", choix: ["lo", "la", "le"], fr: "La voiture ? Je veux l'acheter." },
        { q: "¿Ves a María? Sí, ___ veo.", choix: ["la", "lo", "le"], fr: "Tu vois María ? Oui, je la vois." },
      ] },
    { id: "comparatifs", niveau: 1, titre: "Les comparatifs",
      explication: `<b>más … que</b> (plus … que) · <b>menos … que</b> (moins … que) · <b>tan … como</b> (aussi … que).<br>
        Irréguliers : <b>mejor</b> (meilleur), <b>peor</b> (pire), <b>mayor</b> (plus âgé), <b>menor</b> (plus jeune).`,
      exemples: [["Pedro es más alto que Juan.", "Pedro est plus grand que Juan."], ["Es tan simpática como Lucía.", "Elle est aussi sympa que Lucía."], ["Este es mejor.", "Celui-ci est meilleur."]],
      exercices: [
        { q: "Pedro es ___ alto que Juan.", choix: ["más", "tan", "mucho"], fr: "Pedro est plus grand que Juan." },
        { q: "Ana es tan simpática ___ Lucía.", choix: ["como", "que", "de"], fr: "Ana est aussi sympa que Lucía." },
        { q: "Este restaurante es ___ que el otro.", choix: ["mejor", "más bueno", "bueno"], fr: "Ce restaurant est meilleur que l'autre." },
        { q: "Mi hermano tiene 30 años, yo 25: es ___ que yo.", choix: ["mayor", "menor", "más viejo de"], fr: "Mon frère a 30 ans, moi 25 : il est plus âgé que moi." },
      ] },

    // ---------- AUTONOME ----------
    { id: "imparfait", niveau: 2, titre: "Imparfait ou passé simple ?",
      explication: `<b>Imperfecto</b> (-aba / -ía) : description, décor, habitude passée → <i>Cuando era niño, jugaba al fútbol.</i><br>
        <b>Indefinido</b> : action ponctuelle, terminée → <i>Ayer vi a Juan.</i><br>
        Ensemble : <i>Mientras cocinaba (décor), sonó el teléfono (action).</i>`,
      exemples: [["Cuando era pequeño, vivía en Lyon.", "Quand j'étais petit, j'habitais à Lyon."], ["Eran las ocho cuando llegó.", "Il était huit heures quand il est arrivé."]],
      exercices: [
        { q: "Cuando era niño, ___ al fútbol todos los días.", choix: ["jugaba", "jugué", "juego"], fr: "Quand j'étais enfant, je jouais au foot tous les jours." },
        { q: "Ayer ___ a mi amigo en la calle.", choix: ["vi", "veía", "veo"], fr: "Hier j'ai vu mon ami dans la rue." },
        { q: "___ las ocho cuando llegó.", choix: ["Eran", "Fueron", "Son"], fr: "Il était huit heures quand il est arrivé." },
        { q: "Mientras yo ___, sonó el teléfono.", choix: ["cocinaba", "cociné", "cocino"], fr: "Pendant que je cuisinais, le téléphone a sonné." },
        { q: "De pequeños, siempre ___ a la playa.", choix: ["íbamos", "fuimos", "vamos"], fr: "Petits, nous allions toujours à la plage." },
      ] },
    { id: "subjonctif", niveau: 2, titre: "Le subjonctif présent",
      explication: `On « inverse » la voyelle : -ar → <b>e</b> (hable), -er/-ir → <b>a</b> (coma, viva). Les irréguliers partent du « yo » : tengo → <b>tenga</b>, hago → <b>haga</b>.<br>
        S'emploie après : <b>querer que, esperar que, ojalá, para que, es importante que</b>, et après <b>cuando</b> + futur.`,
      exemples: [["Quiero que vengas.", "Je veux que tu viennes."], ["Ojalá haga sol.", "Pourvu qu'il fasse beau."], ["Cuando llegues, llámame.", "Quand tu arriveras, appelle-moi."]],
      exercices: [
        { q: "Quiero que tú ___ conmigo.", choix: ["vengas", "vienes", "venir"], fr: "Je veux que tu viennes avec moi." },
        { q: "Ojalá ___ buen tiempo mañana.", choix: ["haga", "hace", "hará"], fr: "Pourvu qu'il fasse beau demain." },
        { q: "Es importante que (vosotros) ___ mucho.", choix: ["estudiéis", "estudiáis", "estudiar"], fr: "Il est important que vous étudiiez beaucoup." },
        { q: "Te lo explico para que lo ___.", choix: ["entiendas", "entiendes", "entender"], fr: "Je te l'explique pour que tu le comprennes." },
        { q: "Cuando ___ a casa, llámame.", choix: ["llegues", "llegas", "llegarás"], fr: "Quand tu arriveras à la maison, appelle-moi." },
      ] },
    { id: "conditionnel", niveau: 2, titre: "Le conditionnel",
      explication: `Infinitif + <b>ía, ías, ía, íamos, íais, ían</b> → <i>hablaría</i>. Mêmes radicaux irréguliers que le futur (tendría, haría, podría…).<br>
        Politesse : <i>Me gustaría…, ¿Podrías…?</i> · Hypothèse : <i>Si tuviera dinero, viajaría.</i>`,
      exemples: [["Me gustaría ir a Japón.", "J'aimerais aller au Japon."], ["¿Podrías ayudarme?", "Pourrais-tu m'aider ?"], ["Yo no lo haría.", "Moi, je ne le ferais pas."]],
      exercices: [
        { q: "Me ___ ir a Japón.", choix: ["gustaría", "gustaré", "gusto"], fr: "J'aimerais aller au Japon." },
        { q: "¿___ ayudarme, por favor?", choix: ["Podrías", "Pudiste", "Podrás"], fr: "Pourrais-tu m'aider, s'il te plaît ?" },
        { q: "Si tuviera dinero, ___ una casa.", choix: ["compraría", "compraré", "compro"], fr: "Si j'avais de l'argent, j'achèterais une maison." },
        { q: "Yo en tu lugar no lo ___.", choix: ["haría", "hacería", "hago"], fr: "À ta place, je ne le ferais pas." },
      ] },
    { id: "por-para", niveau: 2, titre: "Por ou para ?",
      explication: `<b>para</b> → but, destination, destinataire, échéance : <i>para ti, para Madrid, para aprender, para el lunes</i>.<br>
        <b>por</b> → cause, moyen, passage, échange, durée : <i>gracias por, por teléfono, por el parque, por diez euros</i>.`,
      exemples: [["Este regalo es para ti.", "Ce cadeau est pour toi."], ["Gracias por todo.", "Merci pour tout."], ["Estudio para ser médico.", "J'étudie pour être médecin."]],
      exercices: [
        { q: "Este regalo es ___ ti.", choix: ["para", "por", "a"], fr: "Ce cadeau est pour toi." },
        { q: "Gracias ___ tu ayuda.", choix: ["por", "para", "de"], fr: "Merci pour ton aide." },
        { q: "Estudio ___ ser médico.", choix: ["para", "por", "a"], fr: "J'étudie pour être médecin." },
        { q: "Lo compré ___ diez euros.", choix: ["por", "para", "a"], fr: "Je l'ai acheté pour dix euros." },
        { q: "Mañana salgo ___ Madrid.", choix: ["para", "por", "en"], fr: "Demain je pars pour Madrid." },
      ] },
    { id: "doubles-pronoms", niveau: 2, titre: "Les doubles pronoms (se lo)",
      explication: `Ordre : <b>COI + COD</b> → <i>me lo, te la, nos los</i>.<br>
        ⚠️ <b>le / les</b> deviennent <b>se</b> devant lo, la, los, las : <i>Le doy el libro → <b>Se lo</b> doy.</i><br>
        Avec l'infinitif, tout se colle à la fin : <i>dárselo</i>.`,
      exemples: [["Te lo doy mañana.", "Je te le donne demain."], ["Se lo envío a Juan.", "Je l'envoie à Juan."], ["Voy a dárselo.", "Je vais le lui donner."]],
      exercices: [
        { q: "¿El libro? Te ___ doy mañana.", choix: ["lo", "la", "le"], fr: "Le livre ? Je te le donne demain." },
        { q: "¿La carta? ___ la envío a Juan.", choix: ["Se", "Le", "Lo"], fr: "La lettre ? Je l'envoie à Juan." },
        { q: "¿Las fotos? Mi madre ___ enseñó (a mí).", choix: ["me las", "las me", "me les"], fr: "Les photos ? Ma mère me les a montrées." },
        { q: "¿El regalo? Voy a dár___ (a ella).", choix: ["selo", "lelo", "sela"], fr: "Le cadeau ? Je vais le lui donner." },
      ] },
  ],
};
