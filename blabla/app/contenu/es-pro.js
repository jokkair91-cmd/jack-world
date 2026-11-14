// Contenu ESPAGNOL de Jack Blabla — niveaux 3 (Avancé, B2), 4 (Pro, B2–C1) et 5 (Expert, C1).
// Chargé après contenu/es.js : il AJOUTE des cours, il ne remplace rien.
// Exercices : le PREMIER choix est toujours la bonne réponse (ils sont mélangés à l'affichage).

(() => {
  const es = CONTENU.es;

  es.temps.push(
    { id: "perfecto", nom: "Pretérito perfecto (he hablado)", niveau: 3 },
    { id: "pluscuamperfecto", nom: "Pluscuamperfecto (había hablado)", niveau: 4 },
  );

  // Verbes réguliers (pas de changement d'orthographe) : le moteur les conjugue tout seul.
  es.verbes.push(
    { inf: "gestionar", fr: "gérer", niveau: 3 },
    { inf: "mejorar", fr: "améliorer", niveau: 3 },
    { inf: "presentar", fr: "présenter", niveau: 4 },
    { inf: "negociar", fr: "négocier", niveau: 4 },
    { inf: "desarrollar", fr: "développer", niveau: 5 },
    { inf: "lograr", fr: "réussir, obtenir", niveau: 5 },
  );

  es.irreguliers.lignes.push(
    // [infinitif, présent (yo), passé simple (él), participe, français, niveau]
    ["traer", "traigo", "trajo", "traído", "apporter", 3], ["conducir", "conduzco", "condujo", "conducido", "conduire", 3],
    ["caber", "quepo", "cupo", "cabido", "tenir (dans)", 3], ["caer", "caigo", "cayó", "caído", "tomber", 3],
    ["oír", "oigo", "oyó", "oído", "entendre", 3], ["volver", "vuelvo", "volvió", "vuelto", "revenir", 3],
    ["abrir", "abro", "abrió", "abierto", "ouvrir", 4], ["romper", "rompo", "rompió", "roto", "casser", 4],
    ["morir", "muero", "murió", "muerto", "mourir", 4], ["resolver", "resuelvo", "resolvió", "resuelto", "résoudre", 4],
    ["proponer", "propongo", "propuso", "propuesto", "proposer", 4], ["obtener", "obtengo", "obtuvo", "obtenido", "obtenir", 4],
    ["mantener", "mantengo", "mantuvo", "mantenido", "maintenir", 5], ["prever", "preveo", "previó", "previsto", "prévoir", 5],
    ["deducir", "deduzco", "dedujo", "deducido", "déduire", 5], ["satisfacer", "satisfago", "satisfizo", "satisfecho", "satisfaire", 5],
  );

  es.themes.push(
    // ---------- AVANCÉ (B2) ----------
    { id: "debat", niveau: 3, titre: "Débattre et argumenter", emoji: "🗣️",
      mots: [["À mon avis", "En mi opinión"], ["Je suis d'accord", "Estoy de acuerdo"], ["Je ne suis pas d'accord", "No estoy de acuerdo"], ["D'un côté… de l'autre", "Por un lado… por otro lado"],
        ["Il est vrai que", "Es verdad que"], ["Cependant", "Sin embargo"], ["Un argument", "Un argumento"], ["Une preuve", "Una prueba"],
        ["Convaincre", "Convencer"], ["Un point de vue", "Un punto de vista"], ["Je vois ce que tu veux dire", "Entiendo lo que quieres decir"], ["Ça dépend", "Depende"]],
      dialogue: [
        { who: "jack", txt: "¿Crees que las redes sociales son buenas para los jóvenes?", fr: "Penses-tu que les réseaux sociaux sont bons pour les jeunes ?" },
        { who: "toi", choices: ["Por un lado conectan a la gente, pero por otro lado crean adicción.", "Por un lado conecta la gente, por otro lado es adicción.", "Sí porque no."], fr: "D'un côté ils relient les gens, mais de l'autre ils rendent accro." },
        { who: "jack", txt: "Es un buen argumento. ¿Tienes pruebas?", fr: "C'est un bon argument. As-tu des preuves ?" },
        { who: "toi", choices: ["Varios estudios muestran que los adolescentes duermen menos.", "Varios estudios muestra que los adolescentes dormen menos.", "Tengo pruebas muchas."], fr: "Plusieurs études montrent que les ados dorment moins." },
      ] },
    { id: "medias", niveau: 3, titre: "Médias et technologie", emoji: "📱",
      mots: [["Les informations", "Las noticias"], ["Un article", "Un artículo"], ["Une source fiable", "Una fuente fiable"], ["Les fausses informations", "Las noticias falsas"],
        ["Télécharger", "Descargar"], ["Mettre à jour", "Actualizar"], ["Un mot de passe", "Una contraseña"], ["Les données", "Los datos"],
        ["L'intelligence artificielle", "La inteligencia artificial"], ["Un appareil", "Un dispositivo"], ["En ligne", "En línea"], ["Partager", "Compartir"]],
      dialogue: [
        { who: "jack", txt: "¿Dónde sueles informarte?", fr: "Où t'informes-tu d'habitude ?" },
        { who: "toi", choices: ["Sobre todo en periódicos digitales y en pódcasts.", "Sobre todo de los periódicos en línea ayer.", "Me informo por mi teléfono mañana."], fr: "Surtout dans les journaux numériques et les podcasts." },
        { who: "jack", txt: "¿Y cómo sabes si una fuente es fiable?", fr: "Et comment sais-tu si une source est fiable ?" },
        { who: "toi", choices: ["Compruebo si otros medios cuentan lo mismo.", "Compruebo si otros medios cuenta el mismo.", "Porque está en internet."], fr: "Je vérifie si d'autres médias disent la même chose." },
      ] },
    { id: "environnement", niveau: 3, titre: "Environnement et sciences", emoji: "🌍",
      mots: [["Le changement climatique", "El cambio climático"], ["Les énergies renouvelables", "Las energías renovables"], ["Réduire", "Reducir"], ["Recycler", "Reciclar"],
        ["Les déchets", "Los residuos"], ["Une espèce menacée", "Una especie en peligro"], ["Une découverte", "Un descubrimiento"], ["Une expérience (scientifique)", "Un experimento"],
        ["Un chercheur", "Un investigador"], ["Durable", "Sostenible"], ["L'empreinte carbone", "La huella de carbono"], ["Économiser l'énergie", "Ahorrar energía"]] },
    { id: "expressions-b2", niveau: 3, titre: "Expressions du quotidien", emoji: "💬",
      mots: [["Ça me plaît beaucoup", "Me encanta"], ["Ça m'est égal", "Me da igual"], ["Quelle chance !", "¡Qué suerte!"], ["Ça ne vaut pas la peine", "No vale la pena"],
        ["Être en train de", "Estar + gerundio"], ["Venir de (faire)", "Acabar de"], ["Se rendre compte", "Darse cuenta"], ["Avoir envie de", "Tener ganas de"],
        ["Faire attention", "Tener cuidado"], ["Réussir à", "Conseguir"], ["Il vaut mieux", "Más vale"], ["Au fait", "Por cierto"]],
      dialogue: [
        { who: "jack", txt: "¿Quieres ir al cine o al teatro?", fr: "Tu veux aller au cinéma ou au théâtre ?" },
        { who: "toi", choices: ["Me da igual, elige tú.", "Me da igual, eliges tú ayer.", "Me encanta igual."], fr: "Ça m'est égal, choisis, toi." },
        { who: "jack", txt: "Por cierto, ¿has terminado el informe?", fr: "Au fait, tu as fini le rapport ?" },
        { who: "toi", choices: ["Sí, acabo de terminarlo.", "Sí, acabo terminar lo.", "Sí, vengo de terminarlo."], fr: "Oui, je viens de le finir." },
      ] },

    // ---------- PRO (B2–C1) ----------
    { id: "emails", niveau: 4, titre: "Les e-mails professionnels", emoji: "✉️",
      mots: [["Madame, Monsieur,", "Estimado/a señor/a:"], ["Suite à notre conversation", "Tras nuestra conversación"], ["Veuillez trouver ci-joint", "Le adjunto"], ["Je vous écris au sujet de", "Le escribo en relación con"],
        ["N'hésitez pas à me contacter", "No dude en ponerse en contacto conmigo"], ["Dans l'attente de votre réponse", "Quedo a la espera de su respuesta"], ["Cordialement", "Un cordial saludo"], ["Pour rappel", "Le recuerdo que"],
        ["Je vous serais reconnaissant de", "Le agradecería que"], ["Désolé pour le retard", "Disculpe el retraso"], ["Mettre en copie", "Poner en copia"], ["Faire suivre", "Reenviar"]],
      dialogue: [
        { who: "jack", txt: "¿Cómo empiezas un correo formal a alguien que no conoces?", fr: "Comment commences-tu un mail formel à un inconnu ?" },
        { who: "toi", choices: ["Estimado señor: le escribo en relación con su oferta.", "Hola tío, te escribo por tu oferta.", "Estimado señor: te escribo de tu oferta."], fr: "Monsieur, je vous écris au sujet de votre offre." },
        { who: "jack", txt: "¿Y cómo lo terminas?", fr: "Et comment le termines-tu ?" },
        { who: "toi", choices: ["Quedo a la espera de su respuesta. Un cordial saludo.", "Espero tu respuesta. Besos.", "Quedo esperando tu respuesta, chao."], fr: "Dans l'attente de votre réponse. Cordialement." },
      ] },
    { id: "reunions", niveau: 4, titre: "Les réunions", emoji: "🧑‍💼",
      mots: [["L'ordre du jour", "El orden del día"], ["Le compte rendu", "El acta"], ["Commençons", "Empecemos"], ["Passons au point suivant", "Pasemos al siguiente punto"],
        ["Puis-je intervenir ?", "¿Puedo intervenir?"], ["Pour résumer", "En resumen"], ["Un délai (date limite)", "Un plazo"], ["Respecter les délais", "Cumplir los plazos"],
        ["Prendre une décision", "Tomar una decisión"], ["Faire le point", "Hacer balance"], ["Être d'accord sur", "Coincidir en"], ["Reporter la réunion", "Aplazar la reunión"]],
      dialogue: [
        { who: "jack", txt: "Buenos días a todos. ¿Empezamos?", fr: "Bonjour à tous. On commence ?" },
        { who: "toi", choices: ["Sí. El primer punto del orden del día es el presupuesto.", "Sí. El primero punto de orden del día es presupuesto.", "Sí, empezamos desde ayer."], fr: "Oui. Le premier point à l'ordre du jour est le budget." },
        { who: "jack", txt: "¿Podemos cumplir el plazo del viernes?", fr: "Pouvons-nous tenir le délai de vendredi ?" },
        { who: "toi", choices: ["Me temo que necesitaremos dos días más.", "Tengo miedo que necesitamos dos días más.", "No, estamos tarde dos días."], fr: "Je crains que nous ayons besoin de deux jours de plus." },
      ] },
    { id: "telephone", niveau: 4, titre: "Téléphone et visio", emoji: "📞",
      mots: [["Qui est à l'appareil ?", "¿De parte de quién?"], ["Ne quittez pas", "No cuelgue, por favor"], ["Je vous le passe", "Le paso con él"], ["Puis-je laisser un message ?", "¿Puedo dejar un mensaje?"],
        ["Je vous rappelle", "Le vuelvo a llamar"], ["Vous coupez", "Se corta"], ["Votre micro est coupé", "Tienes el micro silenciado"], ["Partager l'écran", "Compartir pantalla"],
        ["Pouvez-vous répéter ?", "¿Puede repetirlo?"], ["La connexion est mauvaise", "La conexión es mala"], ["Une visioconférence", "Una videollamada"], ["Raccrocher", "Colgar"]],
      dialogue: [
        { who: "jack", txt: "Buenos días, le atiende Jack. ¿En qué puedo ayudarle?", fr: "Bonjour, Jack à l'appareil. En quoi puis-je vous aider ?" },
        { who: "toi", choices: ["Buenos días, ¿podría hablar con la señora García?", "Buenos días, quiero hablar con señora García ya.", "Hola, dame la señora García."], fr: "Bonjour, pourrais-je parler à Mme García ?" },
        { who: "jack", txt: "Lo siento, está en una reunión. ¿Quiere dejar un mensaje?", fr: "Désolé, elle est en réunion. Voulez-vous laisser un message ?" },
        { who: "toi", choices: ["Sí, dígale que me llame, por favor.", "Sí, dice ella que me llama.", "Sí, ella llamarme por favor."], fr: "Oui, dites-lui de me rappeler, s'il vous plaît." },
      ] },
    { id: "presenter", niveau: 4, titre: "Présenter et négocier", emoji: "📊",
      mots: [["Je vais vous présenter", "Les voy a presentar"], ["Comme vous pouvez le voir", "Como pueden ver"], ["Une hausse", "Un aumento"], ["Une baisse", "Una bajada"],
        ["Le chiffre d'affaires", "La facturación"], ["La rentabilité", "La rentabilidad"], ["Faire une offre", "Hacer una oferta"], ["Un compromis", "Un acuerdo intermedio"],
        ["Nous pourrions envisager", "Podríamos plantearnos"], ["C'est notre dernier prix", "Es nuestra última oferta"], ["Conclure un accord", "Cerrar un trato"], ["Une remise", "Un descuento"]],
      dialogue: [
        { who: "jack", txt: "Su precio es demasiado alto para nosotros.", fr: "Votre prix est trop élevé pour nous." },
        { who: "toi", choices: ["Podríamos plantearnos un descuento si piden más unidades.", "Podríamos plantear nosotros un descuento si pedís más.", "Vale, entonces es gratis."], fr: "Nous pourrions envisager une remise si vous commandez plus d'unités." },
        { who: "jack", txt: "¿Un diez por ciento por quinientas unidades?", fr: "Dix pour cent pour cinq cents unités ?" },
        { who: "toi", choices: ["Me parece justo. Cerremos el trato.", "Me parece justo. Cerramos la negocia.", "Sí, cerramos el trato ayer."], fr: "Ça me paraît juste. Concluons l'accord." },
      ] },

    // ---------- EXPERT (C1) ----------
    { id: "faux-amis", niveau: 5, titre: "Les faux amis (pièges)", emoji: "⚠️",
      mots: [["Enceinte (≠ embarrassée)", "Embarazada"], ["Gênée, embarrassée", "Avergonzada"], ["Enrhumé (≠ constipé)", "Constipado"], ["Rester (≠ restar)", "Quedarse"],
        ["Soustraire (≠ rester)", "Restar"], ["Une salle de classe", "Un aula"], ["Un sujet (de discussion)", "Un tema"], ["En fait", "En realidad"],
        ["Finalement", "Al final"], ["Une lettre (≠ une carte)", "Una carta"], ["Le salaire", "El sueldo"], ["Un bureau (meuble)", "Un escritorio"]] },
    { id: "registres", niveau: 5, titre: "Nuances et registres", emoji: "🎚️",
      mots: [["Obtenir (soutenu)", "Obtener"], ["Commencer (soutenu)", "Iniciar"], ["Aider (soutenu)", "Prestar ayuda"], ["Demander (se renseigner)", "Informarse sobre"],
        ["Pour autant que je sache", "Que yo sepa"], ["Il semblerait que", "Al parecer"], ["Sans aucun doute", "Sin lugar a dudas"], ["Dans une certaine mesure", "En cierta medida"],
        ["Quoi qu'il en soit", "Sea como sea"], ["En revanche", "En cambio"], ["Néanmoins", "No obstante"], ["Par conséquent", "Por consiguiente"]],
      dialogue: [
        { who: "jack", txt: "¿Ha sido un éxito el proyecto?", fr: "Le projet a-t-il été un succès ?" },
        { who: "toi", choices: ["En cierta medida sí, aunque los costes han sido algo más altos de lo previsto.", "En cierta medida sí, aunque los costes han sido más altos que previsto.", "Sí totalmente, nunca problema."], fr: "Dans une certaine mesure oui, même si les coûts ont été un peu plus élevés que prévu." },
        { who: "jack", txt: "¿Recomendaría continuar?", fr: "Recommanderiez-vous de continuer ?" },
        { who: "toi", choices: ["No obstante, sería conveniente revisar antes el presupuesto.", "No obstante, sería conveniente de revisar el presupuesto antes.", "Recomiendo de continuar."], fr: "Néanmoins, il serait judicieux de revoir d'abord le budget." },
      ] },
    { id: "idiomes", niveau: 5, titre: "Expressions idiomatiques", emoji: "🎭",
      mots: [["Coûter les yeux de la tête", "Costar un ojo de la cara"], ["Ne pas avoir sa langue dans sa poche", "No tener pelos en la lengua"], ["Être dans la lune", "Estar en las nubes"], ["Tomber à pic", "Venir como anillo al dedo"],
        ["Faire d'une pierre deux coups", "Matar dos pájaros de un tiro"], ["Il pleut des cordes", "Llueve a cántaros"], ["C'est du gâteau", "Es pan comido"], ["Mettre les pieds dans le plat", "Meter la pata"],
        ["Ne pas y aller par quatre chemins", "No andarse con rodeos"], ["Être aux anges", "Estar en el séptimo cielo"], ["Prendre le taureau par les cornes", "Coger el toro por los cuernos"], ["Être crevé", "Estar hecho polvo"]] },
    { id: "management", niveau: 5, titre: "Leadership et management", emoji: "🧭",
      mots: [["Déléguer", "Delegar"], ["Motiver une équipe", "Motivar a un equipo"], ["Un retour (avis)", "Una valoración"], ["Fixer des objectifs", "Fijar objetivos"],
        ["Un indicateur clé", "Un indicador clave"], ["La prise de décision", "La toma de decisiones"], ["Responsabiliser", "Dar autonomía"], ["Gérer un conflit", "Gestionar un conflicto"],
        ["Un entretien annuel", "Una evaluación anual"], ["Une stratégie", "Una estrategia"], ["Prendre du recul", "Tomar distancia"], ["Un leader", "Un líder"]],
      dialogue: [
        { who: "jack", txt: "Un miembro de tu equipo no cumple los plazos. ¿Qué haces?", fr: "Un membre de ton équipe ne tient pas les délais. Que fais-tu ?" },
        { who: "toi", choices: ["Hablaría con él en privado para darle una valoración constructiva.", "Hablaría con él en privado para dar le valoración constructiva.", "Lo despido mañana."], fr: "Je lui parlerais en privé pour lui faire un retour constructif." },
        { who: "jack", txt: "¿Y después?", fr: "Et ensuite ?" },
        { who: "toi", choices: ["Fijaríamos objetivos claros y haríamos balance cada semana.", "Fijaremos objetivos claros y hacemos balance cada semana.", "Después nada."], fr: "Nous fixerions des objectifs clairs et ferions le point chaque semaine." },
      ] },
  );

  es.grammaire.push(
    // ---------- AVANCÉ (B2) ----------
    { id: "perfecto", niveau: 3, titre: "Le pretérito perfecto (he hablado)",
      explication: `Pour un passé <b>lié au présent</b> (aujourd'hui, cette semaine, déjà, jamais) : <b>haber</b> au présent + participe.<br>
        he · has · ha · hemos · habéis · han + <b>-ado</b> (-ar) / <b>-ido</b> (-er, -ir).<br>
        Participes irréguliers : hecho, dicho, visto, puesto, escrito, vuelto, abierto, roto.<br>
        ⚠️ <i>Hoy <b>he comido</b> paella</i> mais <i>Ayer <b>comí</b> paella</i> (passé terminé → indefinido).`,
      exemples: [["Hoy he trabajado mucho.", "Aujourd'hui j'ai beaucoup travaillé."], ["¿Has visto a Ana?", "As-tu vu Ana ?"], ["Nunca he estado en México.", "Je ne suis jamais allé au Mexique."]],
      exercices: [
        { q: "Esta semana ___ mucho.", choix: ["he trabajado", "trabajé ayer", "trabajo"], fr: "Cette semaine, j'ai beaucoup travaillé." },
        { q: "¿Ya ___ el informe?", choix: ["has escrito", "has escribido", "escribiste ayer"], fr: "Tu as déjà écrit le rapport ?" },
        { q: "Nunca ___ esa película.", choix: ["hemos visto", "hemos vido", "vemos"], fr: "Nous n'avons jamais vu ce film." },
        { q: "Ayer ___ al cine.", choix: ["fui", "he ido", "voy"], fr: "Hier, je suis allé au cinéma." },
        { q: "¿Quién ___ la ventana?", choix: ["ha abierto", "ha abrido", "abre ayer"], fr: "Qui a ouvert la fenêtre ?" },
      ] },
    { id: "subjonctif-avance", niveau: 3, titre: "Le subjonctif : désirs, conseils, émotions",
      explication: `Après un verbe de <b>volonté, conseil ou émotion</b> + <b>que</b> + un autre sujet → <b>subjonctif</b>.<br>
        <i>Quiero que <b>vengas</b>.</i> · <i>Te aconsejo que <b>estudies</b>.</i> · <i>Me alegra que <b>estés</b> aquí.</i><br>
        Aussi après <b>para que, antes de que, ojalá</b> et <b>cuando</b> + futur : <i>Cuando <b>llegues</b>, llámame.</i>`,
      exemples: [["Espero que tengas un buen día.", "J'espère que tu passes une bonne journée."], ["Ojalá llueva mañana.", "Pourvu qu'il pleuve demain."], ["Cuando termines, avísame.", "Quand tu auras fini, préviens-moi."]],
      exercices: [
        { q: "Quiero que tú ___ conmigo.", choix: ["vengas", "vienes", "venir"], fr: "Je veux que tu viennes avec moi." },
        { q: "Cuando ___ a casa, llámame.", choix: ["llegues", "llegas", "llegarás"], fr: "Quand tu arriveras à la maison, appelle-moi." },
        { q: "Ojalá ___ buen tiempo.", choix: ["haga", "hace", "hará"], fr: "Pourvu qu'il fasse beau." },
        { q: "Te aconsejo que ___ más.", choix: ["descanses", "descansas", "descansar"], fr: "Je te conseille de te reposer davantage." },
        { q: "Me alegra que ___ aquí.", choix: ["estés", "estás", "eres"], fr: "Je suis content que tu sois là." },
      ] },
    { id: "discours-rapporte", niveau: 3, titre: "Le discours rapporté",
      explication: `Pour rapporter des paroles au passé, on change souvent le temps :<br>
        présent → imparfait · indefinido/perfecto → plus-que-parfait · futur → conditionnel.<br>
        <i>« Estoy cansado » → Dijo que <b>estaba</b> cansado.</i> · <i>« Iré » → Dijo que <b>iría</b>.</i><br>
        Ordres : impératif → subjonctif imparfait : <i>Me dijo que <b>viniera</b>.</i>`,
      exemples: [["Dijo que estaba ocupada.", "Elle a dit qu'elle était occupée."], ["Me contó que había perdido el tren.", "Il m'a raconté qu'il avait raté le train."], ["Preguntó si yo vendría.", "Il a demandé si je viendrais."]],
      exercices: [
        { q: "« Tengo hambre » → Dijo que ___ hambre.", choix: ["tenía", "tiene", "tendrá"], fr: "Il a dit qu'il avait faim." },
        { q: "« Llegaré tarde » → Dijo que ___ tarde.", choix: ["llegaría", "llegará", "llega"], fr: "Il a dit qu'il arriverait en retard." },
        { q: "« He terminado » → Dijo que ___ terminado.", choix: ["había", "ha", "hay"], fr: "Il a dit qu'il avait fini." },
        { q: "Me preguntó ___ estaba listo.", choix: ["si", "que", "qué si"], fr: "Il m'a demandé si j'étais prêt." },
        { q: "« Ven » → Me dijo que ___.", choix: ["viniera", "vengo", "venga ayer"], fr: "Il m'a dit de venir." },
      ] },
    { id: "si-hipotesis", niveau: 3, titre: "Les hypothèses avec si",
      explication: `<b>Si + présent → futur</b> (réel) : <i>Si tienes tiempo, <b>iremos</b>.</i><br>
        <b>Si + subjonctif imparfait → conditionnel</b> (irréel présent) : <i>Si <b>tuviera</b> dinero, <b>viajaría</b>.</i><br>
        <b>Si + plus-que-parfait du subjonctif → conditionnel passé</b> (regret) : <i>Si <b>hubiera sabido</b>, <b>habría venido</b>.</i><br>
        ⚠️ Jamais de conditionnel après <b>si</b>.`,
      exemples: [["Si fuera tú, aceptaría.", "Si j'étais toi, j'accepterais."], ["Si hubiera estudiado, habría aprobado.", "Si j'avais étudié, j'aurais réussi."], ["Si llueve, nos quedamos en casa.", "S'il pleut, on reste à la maison."]],
      exercices: [
        { q: "Si ___ rico, compraría una casa.", choix: ["fuera", "sería", "soy"], fr: "Si j'étais riche, j'achèterais une maison." },
        { q: "Si hubieras venido, te ___ gustado.", choix: ["habría", "habías", "has"], fr: "Si tu étais venu, ça t'aurait plu." },
        { q: "Si llueve, ___ en casa.", choix: ["nos quedaremos", "nos quedaríamos", "nos quedáramos"], fr: "S'il pleut, nous resterons à la maison." },
        { q: "Si ___ más tiempo, aprendería chino.", choix: ["tuviera", "tendría", "tengo"], fr: "Si j'avais plus de temps, j'apprendrais le chinois." },
        { q: "Si lo ___ sabido, te lo habría dicho.", choix: ["hubiera", "habría", "había"], fr: "Si je l'avais su, je te l'aurais dit." },
      ] },

    // ---------- PRO (B2–C1) ----------
    { id: "usted", niveau: 4, titre: "Le vouvoiement : usted et ustedes",
      explication: `Au travail, avec un client ou un supérieur : <b>usted</b> (vous, une personne) et <b>ustedes</b> (vous, plusieurs).<br>
        Ils se conjuguent comme <b>él/ella</b> et <b>ellos</b> : <i>¿Cómo <b>está</b> usted?</i> · <i>¿Qué <b>desean</b> ustedes?</i><br>
        Possessif : <b>su</b> (votre) · pronom : <b>le / lo / la</b> : <i>¿<b>Le</b> puedo ayudar?</i>`,
      exemples: [["¿En qué puedo ayudarle?", "En quoi puis-je vous aider ?"], ["¿Tiene usted cita?", "Avez-vous rendez-vous ?"], ["Les agradezco su atención.", "Je vous remercie de votre attention."]],
      exercices: [
        { q: "¿Cómo ___ usted?", choix: ["está", "estás", "estáis"], fr: "Comment allez-vous ?" },
        { q: "¿Qué ___ ustedes tomar?", choix: ["desean", "deseáis", "deseas"], fr: "Que désirez-vous prendre ?" },
        { q: "Señor García, ¿es este ___ despacho?", choix: ["su", "tu", "vuestro"], fr: "Monsieur García, c'est votre bureau ?" },
        { q: "¿En qué puedo ___?", choix: ["ayudarle", "ayudarte", "ayudaros"], fr: "En quoi puis-je vous aider ?" },
        { q: "Les ___ su paciencia.", choix: ["agradezco", "agradeces", "agradecen"], fr: "Je vous remercie de votre patience." },
      ] },
    { id: "pluscuamperfecto", niveau: 4, titre: "Le plus-que-parfait (había hablado)",
      explication: `Pour une action <b>antérieure</b> à une autre action passée : <b>haber</b> à l'imparfait + participe.<br>
        había · habías · había · habíamos · habíais · habían + participe.<br>
        <i>Cuando llegué, la reunión ya <b>había empezado</b>.</i>`,
      exemples: [["Ya habíamos cenado cuando llamaste.", "Nous avions déjà dîné quand tu as appelé."], ["Nunca había visto algo así.", "Je n'avais jamais vu une chose pareille."], ["Me dijo que había enviado el correo.", "Il m'a dit qu'il avait envoyé le mail."]],
      exercices: [
        { q: "Cuando llegamos, el tren ya ___ salido.", choix: ["había", "ha", "hubo"], fr: "Quand nous sommes arrivés, le train était déjà parti." },
        { q: "Nunca ___ estado en Madrid antes de 2020.", choix: ["había", "he", "hubiera"], fr: "Je n'étais jamais allé à Madrid avant 2020." },
        { q: "Ella dijo que ya ___ el contrato.", choix: ["había firmado", "ha firmado", "firma"], fr: "Elle a dit qu'elle avait déjà signé le contrat." },
        { q: "Estaba cansado porque ___ toda la noche.", choix: ["había trabajado", "trabaja", "trabajaré"], fr: "Il était fatigué car il avait travaillé toute la nuit." },
        { q: "Ya ___ la puerta cuando entré.", choix: ["habían abierto", "habían abrido", "abren"], fr: "Ils avaient déjà ouvert la porte quand je suis entré." },
      ] },
    { id: "connecteurs-pro", niveau: 4, titre: "Les connecteurs de l'écrit pro",
      explication: `Pour structurer un mail ou un rapport :<br>
        Ajouter : <b>además, asimismo</b> · Opposer : <b>sin embargo, no obstante, en cambio</b><br>
        Conséquence : <b>por lo tanto, por consiguiente</b> · Cause : <b>debido a, ya que</b><br>
        Conclure : <b>en conclusión, en definitiva</b>. ⚠️ <b>aunque</b> + indicatif (fait réel) ou + subjonctif (hypothèse).`,
      exemples: [["Debido al retraso, aplazamos la entrega.", "En raison du retard, nous reportons la livraison."], ["Sin embargo, los resultados son buenos.", "Cependant, les résultats sont bons."], ["Por lo tanto, proponemos un nuevo plan.", "Par conséquent, nous proposons un nouveau plan."]],
      exercices: [
        { q: "Las ventas han bajado; ___, los beneficios han subido.", choix: ["sin embargo", "por lo tanto", "además"], fr: "Les ventes ont baissé ; cependant, les bénéfices ont augmenté." },
        { q: "___ la huelga, el vuelo se canceló.", choix: ["Debido a", "Aunque", "Además"], fr: "En raison de la grève, le vol a été annulé." },
        { q: "El cliente no ha pagado; ___, no enviamos el pedido.", choix: ["por lo tanto", "sin embargo", "en cambio"], fr: "Le client n'a pas payé ; par conséquent, nous n'envoyons pas la commande." },
        { q: "___ es caro, lo compraremos.", choix: ["Aunque", "Debido a", "Por lo tanto"], fr: "Bien que ce soit cher, nous l'achèterons." },
        { q: "___, el proyecto ha sido un éxito.", choix: ["En definitiva", "Debido a", "Ya que"], fr: "En définitive, le projet a été un succès." },
      ] },
    { id: "pronoms-pro", niveau: 4, titre: "Les pronoms et l'ordre des mots au travail",
      explication: `Avec deux pronoms, l'ordre est <b>indirect + direct</b> : <i>Te <b>lo</b> envío.</i><br>
        <b>le/les</b> devient <b>se</b> devant lo/la/los/las : <i>Se lo mando mañana</i> (je le lui envoie).<br>
        Avec infinitif, gérondif ou impératif affirmatif, les pronoms se <b>collent</b> au verbe : <i>Voy a enviár<b>selo</b></i>, <i>Envíe<b>melo</b></i>.`,
      exemples: [["Se lo explico ahora.", "Je vous l'explique maintenant."], ["¿Me lo puede enviar?", "Pouvez-vous me l'envoyer ?"], ["Envíenoslo antes del lunes.", "Envoyez-le-nous avant lundi."]],
      exercices: [
        { q: "El informe, ___ envío mañana. (à lui)", choix: ["se lo", "le lo", "lo le"], fr: "Le rapport, je le lui envoie demain." },
        { q: "¿___ puede repetir, por favor?", choix: ["Me lo", "Lo me", "Me le"], fr: "Pouvez-vous me le répéter, s'il vous plaît ?" },
        { q: "Voy a ___ ahora. (le dire à elle)", choix: ["decírselo", "decirle lo", "se lo decir"], fr: "Je vais le lui dire maintenant." },
        { q: "Los documentos, ___ antes del viernes.", choix: ["envíemelos", "me los envíe ya", "envíe me los"], fr: "Les documents, envoyez-les-moi avant vendredi." },
        { q: "La factura, ¿___ has dado al cliente?", choix: ["se la", "le la", "la le"], fr: "La facture, tu l'as donnée au client ?" },
      ] },

    // ---------- EXPERT (C1) ----------
    { id: "subjonctif-imparfait", niveau: 5, titre: "Le subjonctif imparfait",
      explication: `Formé sur la 3e personne du pluriel de l'indefinido : <i>hablaron → habl<b>ara</b></i>, <i>tuvieron → tuv<b>iera</b></i>, <i>fueron → f<b>uera</b></i>.<br>
        S'emploie quand le verbe principal est au <b>passé ou au conditionnel</b> : <i>Me pidió que <b>viniera</b>.</i> · <i>Me gustaría que <b>participaras</b>.</i><br>
        Aussi pour adoucir : <i><b>Quisiera</b> una cita.</i> (je voudrais)`,
      exemples: [["Me pidió que llegara temprano.", "Il m'a demandé d'arriver tôt."], ["Me gustaría que lo revisaras.", "J'aimerais que tu le relises."], ["Quisiera hablar con el director.", "Je voudrais parler au directeur."]],
      exercices: [
        { q: "Me pidió que ___ el informe.", choix: ["terminara", "termine", "terminaba"], fr: "Il m'a demandé de terminer le rapport." },
        { q: "Me gustaría que ___ a la reunión.", choix: ["vinieras", "vengas", "venías"], fr: "J'aimerais que tu viennes à la réunion." },
        { q: "Era necesario que todos ___ presentes.", choix: ["estuvieran", "estén", "estaban"], fr: "Il fallait que tous soient présents." },
        { q: "___ hablar con usted, por favor.", choix: ["Quisiera", "Quiera", "Quería ayer"], fr: "Je voudrais vous parler, s'il vous plaît." },
        { q: "Habla como si ___ el jefe.", choix: ["fuera", "es", "sea"], fr: "Il parle comme s'il était le chef." },
      ] },
    { id: "passif-se", niveau: 5, titre: "Le passif et le « se » impersonnel",
      explication: `<b>Passif</b> (écrit, presse) : <i>ser</i> + participe accordé → <i>El contrato <b>fue firmado</b> por el director.</i><br>
        Plus courant : le <b>se</b> passif → <i><b>Se firmó</b> el contrato</i>, <i><b>Se venden</b> pisos</i> (accord avec le sujet).<br>
        <b>Se</b> impersonnel : <i>Aquí <b>se trabaja</b> mucho</i> (on travaille beaucoup ici).`,
      exemples: [["El proyecto fue aprobado ayer.", "Le projet a été approuvé hier."], ["Se necesitan voluntarios.", "On recherche des volontaires."], ["Se habla español.", "On parle espagnol."]],
      exercices: [
        { q: "Las decisiones ___ tomadas por el comité.", choix: ["fueron", "fue", "eran ayer"], fr: "Les décisions ont été prises par le comité." },
        { q: "Aquí ___ productos ecológicos.", choix: ["se venden", "se vende", "venden se"], fr: "Ici, on vend des produits bio." },
        { q: "___ busca ingeniero con experiencia.", choix: ["Se", "Le", "Lo"], fr: "Recherche ingénieur expérimenté." },
        { q: "El edificio fue ___ en 1990.", choix: ["construido", "construida", "construyó"], fr: "Le bâtiment a été construit en 1990." },
        { q: "En esta empresa ___ trabaja en equipo.", choix: ["se", "si", "le"], fr: "Dans cette entreprise, on travaille en équipe." },
      ] },
    { id: "nuances-ser-estar", niveau: 5, titre: "Ser et estar : les nuances avancées",
      explication: `Certains adjectifs changent de sens :<br>
        <b>ser listo</b> (intelligent) / <b>estar listo</b> (prêt) · <b>ser aburrido</b> (ennuyeux) / <b>estar aburrido</b> (s'ennuyer)<br>
        <b>ser rico</b> (riche) / <b>estar rico</b> (délicieux) · <b>ser malo</b> (méchant) / <b>estar malo</b> (malade)<br>
        Événement → <b>ser</b> : <i>La reunión <b>es</b> en la sala 3.</i>`,
      exemples: [["El informe ya está listo.", "Le rapport est prêt."], ["Este plato está muy rico.", "Ce plat est délicieux."], ["La conferencia es en Madrid.", "La conférence a lieu à Madrid."]],
      exercices: [
        { q: "¿___ listo para la presentación? (prêt)", choix: ["Estás", "Eres", "Tienes"], fr: "Tu es prêt pour la présentation ?" },
        { q: "La reunión ___ en la sala 3.", choix: ["es", "está", "hay"], fr: "La réunion a lieu dans la salle 3." },
        { q: "Hoy no voy a trabajar, ___ malo.", choix: ["estoy", "soy", "tengo"], fr: "Je ne vais pas travailler aujourd'hui, je suis malade." },
        { q: "Tu hermano ___ muy listo: lo entiende todo.", choix: ["es", "está", "hay"], fr: "Ton frère est très intelligent : il comprend tout." },
        { q: "¡Esta tarta ___ riquísima!", choix: ["está", "es", "hay"], fr: "Ce gâteau est délicieux !" },
      ] },
    { id: "perifrasis", niveau: 5, titre: "Les périphrases verbales",
      explication: `Pour nuancer une action :<br>
        <b>llevar + durée + gérondif</b> : <i>Llevo dos años trabajando aquí</i> (je travaille ici depuis 2 ans)<br>
        <b>seguir + gérondif</b> (continuer) · <b>volver a + infinitif</b> (refaire) · <b>dejar de + infinitif</b> (arrêter)<br>
        <b>acabar de + infinitif</b> (venir de) · <b>estar a punto de</b> (être sur le point de)`,
      exemples: [["Llevo tres meses estudiando español.", "J'étudie l'espagnol depuis trois mois."], ["Volvió a llamar.", "Il a rappelé."], ["Estamos a punto de firmar.", "Nous sommes sur le point de signer."]],
      exercices: [
        { q: "___ cinco años trabajando en esta empresa.", choix: ["Llevo", "Hace", "Estoy"], fr: "Je travaille dans cette entreprise depuis cinq ans." },
        { q: "He dejado ___ fumar.", choix: ["de", "a", "que"], fr: "J'ai arrêté de fumer." },
        { q: "El cliente ha vuelto ___ llamar.", choix: ["a", "de", "en"], fr: "Le client a rappelé." },
        { q: "Estamos ___ cerrar el trato.", choix: ["a punto de", "por punto", "en punto de"], fr: "Nous sommes sur le point de conclure l'affaire." },
        { q: "A pesar de los problemas, ___ trabajando.", choix: ["seguimos", "dejamos", "acabamos"], fr: "Malgré les problèmes, nous continuons à travailler." },
      ] },
  );
})();
