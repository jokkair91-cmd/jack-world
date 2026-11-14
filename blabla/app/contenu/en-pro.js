// Contenu ANGLAIS de Jack Blabla — niveaux 3 (Avancé, B2), 4 (Pro, B2–C1) et 5 (Expert, C1).
// Chargé après contenu/en.js : il AJOUTE des cours, il ne remplace rien.
// Exercices : le PREMIER choix est toujours la bonne réponse (ils sont mélangés à l'affichage).

(() => {
  const en = CONTENU.en;

  en.temps.push(
    { id: "passe-continu", nom: "Past continuous (was + -ing)", niveau: 3 },
    { id: "pluperfect", nom: "Past perfect (had + participe)", niveau: 3 },
    { id: "perfect-continu", nom: "Present perfect continuous", niveau: 4 },
    { id: "futur-perfect", nom: "Future perfect (will have)", niveau: 5 },
    { id: "cond-passe", nom: "Conditionnel passé (would have)", niveau: 5 },
  );

  en.verbes.push(
    { inf: "manage", fr: "gérer, diriger", niveau: 3 },
    { inf: "improve", fr: "améliorer", niveau: 3 },
    { inf: "explain", fr: "expliquer", niveau: 3 },
    { inf: "choose", fr: "choisir", niveau: 3, preterit: "chose", participe: "chosen" },
    { inf: "deal", fr: "traiter, gérer", niveau: 3, preterit: "dealt", participe: "dealt" },
    { inf: "lead", fr: "mener, diriger", niveau: 4, preterit: "led", participe: "led" },
    { inf: "meet", fr: "rencontrer", niveau: 4, preterit: "met", participe: "met" },
    { inf: "send", fr: "envoyer", niveau: 4, preterit: "sent", participe: "sent" },
    { inf: "negotiate", fr: "négocier", niveau: 4 },
    { inf: "deliver", fr: "livrer, tenir (une promesse)", niveau: 4 },
    { inf: "achieve", fr: "atteindre, réussir", niveau: 5 },
    { inf: "undertake", fr: "entreprendre", niveau: 5, preterit: "undertook", participe: "undertaken" },
    { inf: "foresee", fr: "prévoir", niveau: 5, preterit: "foresaw", participe: "foreseen" },
  );

  en.irreguliers.lignes.push(
    // [base, prétérit, participe, français, niveau]
    ["arise", "arose", "arisen", "survenir", 3], ["bear", "bore", "borne", "supporter", 3], ["bite", "bit", "bitten", "mordre", 3],
    ["blow", "blew", "blown", "souffler", 3], ["catch", "caught", "caught", "attraper", 3], ["deal", "dealt", "dealt", "traiter", 3],
    ["draw", "drew", "drawn", "dessiner, tirer", 3], ["feed", "fed", "fed", "nourrir", 3], ["fight", "fought", "fought", "se battre", 3],
    ["forgive", "forgave", "forgiven", "pardonner", 3], ["freeze", "froze", "frozen", "geler", 3], ["grow", "grew", "grown", "grandir, pousser", 3],
    ["hang", "hung", "hung", "accrocher", 3], ["hide", "hid", "hidden", "cacher", 3], ["hit", "hit", "hit", "frapper", 3],
    ["hold", "held", "held", "tenir", 3], ["hurt", "hurt", "hurt", "blesser", 3], ["lead", "led", "led", "mener", 4],
    ["lend", "lent", "lent", "prêter", 4], ["let", "let", "let", "laisser", 4], ["mean", "meant", "meant", "signifier", 4],
    ["rise", "rose", "risen", "s'élever", 4], ["seek", "sought", "sought", "chercher", 4], ["set", "set", "set", "fixer, régler", 4],
    ["shake", "shook", "shaken", "secouer", 4], ["show", "showed", "shown", "montrer", 4], ["shut", "shut", "shut", "fermer", 4],
    ["spread", "spread", "spread", "répandre", 4], ["stand", "stood", "stood", "être debout", 4], ["steal", "stole", "stolen", "voler (dérober)", 4],
    ["strike", "struck", "struck", "frapper, faire grève", 5], ["swear", "swore", "sworn", "jurer", 5], ["tear", "tore", "torn", "déchirer", 5],
    ["throw", "threw", "thrown", "lancer", 5], ["wake", "woke", "woken", "réveiller", 5], ["withdraw", "withdrew", "withdrawn", "retirer", 5],
    ["overcome", "overcame", "overcome", "surmonter", 5], ["undertake", "undertook", "undertaken", "entreprendre", 5], ["foresee", "foresaw", "foreseen", "prévoir", 5],
  );

  en.themes.push(
    // ---------- AVANCÉ (B2) ----------
    { id: "debat", niveau: 3, titre: "Débattre et argumenter", emoji: "🗣️",
      mots: [["À mon avis", "In my opinion"], ["Je suis d'accord", "I agree"], ["Je ne suis pas d'accord", "I disagree"], ["D'un côté… de l'autre", "On the one hand… on the other hand"],
        ["Il est vrai que", "It's true that"], ["Cela dit", "That said"], ["Un argument", "An argument"], ["Une preuve", "Evidence"],
        ["Convaincre", "To convince"], ["Un point de vue", "A point of view"], ["Je vois ce que tu veux dire", "I see what you mean"], ["Ça dépend", "It depends"]],
      dialogue: [
        { who: "jack", txt: "Do you think social media is good for young people?", fr: "Penses-tu que les réseaux sociaux sont bons pour les jeunes ?" },
        { who: "toi", choices: ["On the one hand, it connects people; on the other hand, it can be addictive.", "On one hand it connect people, in other hand addictive.", "Yes because no."], fr: "D'un côté, ça relie les gens ; de l'autre, ça peut rendre accro." },
        { who: "jack", txt: "That's a fair point. What evidence do you have?", fr: "C'est juste. Quelles preuves as-tu ?" },
        { who: "toi", choices: ["Several studies show that teenagers sleep less.", "Several studies shows teenagers sleeps less.", "I have evidences many."], fr: "Plusieurs études montrent que les ados dorment moins." },
      ] },
    { id: "medias", niveau: 3, titre: "Médias et technologie", emoji: "📱",
      mots: [["Les informations (le journal)", "The news"], ["Un article", "An article"], ["Une source fiable", "A reliable source"], ["Les fausses informations", "Fake news"],
        ["Télécharger", "To download"], ["Mettre à jour", "To update"], ["Un mot de passe", "A password"], ["Les données", "Data"],
        ["L'intelligence artificielle", "Artificial intelligence"], ["Un appareil", "A device"], ["En ligne", "Online"], ["Partager", "To share"]],
      dialogue: [
        { who: "jack", txt: "Where do you usually get your news from?", fr: "Où t'informes-tu d'habitude ?" },
        { who: "toi", choices: ["Mostly from online newspapers and podcasts.", "Mostly of the newspapers online.", "I get news by my phone yesterday."], fr: "Surtout dans les journaux en ligne et les podcasts." },
        { who: "jack", txt: "How do you know if a source is reliable?", fr: "Comment sais-tu si une source est fiable ?" },
        { who: "toi", choices: ["I check whether other media report the same facts.", "I check if other medias reports same facts.", "Because it is on internet."], fr: "Je vérifie si d'autres médias rapportent les mêmes faits." },
      ] },
    { id: "environnement", niveau: 3, titre: "Environnement et sciences", emoji: "🌍",
      mots: [["Le changement climatique", "Climate change"], ["Les énergies renouvelables", "Renewable energy"], ["Réduire", "To reduce"], ["Recycler", "To recycle"],
        ["Les déchets", "Waste"], ["Une espèce menacée", "An endangered species"], ["Une découverte", "A discovery"], ["Une expérience (scientifique)", "An experiment"],
        ["Un chercheur", "A researcher"], ["Durable", "Sustainable"], ["L'empreinte carbone", "The carbon footprint"], ["Économiser l'énergie", "To save energy"]] },
    { id: "phrasal", niveau: 3, titre: "Les phrasal verbs essentiels", emoji: "🧩",
      mots: [["Se lever", "To get up"], ["Abandonner", "To give up"], ["S'occuper de", "To look after"], ["Découvrir (une info)", "To find out"],
        ["Continuer", "To carry on"], ["Reporter (à plus tard)", "To put off"], ["Refuser (une offre)", "To turn down"], ["Manquer de", "To run out of"],
        ["Avoir hâte de", "To look forward to"], ["S'entendre avec", "To get along with"], ["Trouver (une idée)", "To come up with"], ["Mettre en place", "To set up"]],
      dialogue: [
        { who: "jack", txt: "Are you going to the conference next week?", fr: "Tu vas à la conférence la semaine prochaine ?" },
        { who: "toi", choices: ["Yes, I'm really looking forward to it!", "Yes, I'm really looking forward to go!", "Yes, I look forward it."], fr: "Oui, j'ai vraiment hâte !" },
        { who: "jack", txt: "Great. Did you find out who the speakers are?", fr: "Super. Tu as découvert qui sont les intervenants ?" },
        { who: "toi", choices: ["Not yet, I'll find out tomorrow.", "Not yet, I'll find it up tomorrow.", "Not yet, I find out since tomorrow."], fr: "Pas encore, je me renseigne demain." },
      ] },

    // ---------- PRO (B2–C1) ----------
    { id: "emails", niveau: 4, titre: "Les e-mails professionnels", emoji: "✉️",
      mots: [["Madame, Monsieur,", "Dear Sir or Madam,"], ["Suite à notre conversation", "Following our conversation"], ["Veuillez trouver ci-joint", "Please find attached"], ["Je vous écris au sujet de", "I am writing regarding"],
        ["N'hésitez pas à me contacter", "Do not hesitate to contact me"], ["Dans l'attente de votre réponse", "I look forward to hearing from you"], ["Cordialement", "Kind regards"], ["Pour rappel", "As a reminder"],
        ["Je vous serais reconnaissant de", "I would be grateful if you could"], ["Désolé pour le retard de réponse", "Sorry for the late reply"], ["Mettre en copie", "To copy in (CC)"], ["Faire suivre (un mail)", "To forward"]],
      dialogue: [
        { who: "jack", txt: "How would you start a formal email to someone you don't know?", fr: "Comment commences-tu un mail formel à un inconnu ?" },
        { who: "toi", choices: ["Dear Sir or Madam, I am writing regarding your offer.", "Hey you, I write about your offer.", "Dear friend, I am writing for regard your offer."], fr: "Madame, Monsieur, je vous écris au sujet de votre offre." },
        { who: "jack", txt: "And how do you end it politely?", fr: "Et comment le termines-tu poliment ?" },
        { who: "toi", choices: ["I look forward to hearing from you. Kind regards,", "I look forward to hear from you. Kisses,", "Waiting your answer. Bye,"], fr: "Dans l'attente de votre réponse. Cordialement," },
      ] },
    { id: "reunions", niveau: 4, titre: "Les réunions", emoji: "🧑‍💼",
      mots: [["L'ordre du jour", "The agenda"], ["Le compte rendu", "The minutes"], ["Commençons", "Let's get started"], ["Passons au point suivant", "Let's move on to the next item"],
        ["Puis-je intervenir ?", "May I come in here?"], ["Pour résumer", "To sum up"], ["Un point d'action", "An action point"], ["Respecter les délais", "To meet the deadline"],
        ["Prendre une décision", "To make a decision"], ["Faire le point", "To catch up"], ["Être sur la même longueur d'onde", "To be on the same page"], ["Reporter la réunion", "To postpone the meeting"]],
      dialogue: [
        { who: "jack", txt: "Good morning everyone. Shall we get started?", fr: "Bonjour à tous. On commence ?" },
        { who: "toi", choices: ["Yes. The first item on the agenda is the budget.", "Yes. The first point of the order of the day is budget.", "Yes, we begin since now."], fr: "Oui. Le premier point à l'ordre du jour est le budget." },
        { who: "jack", txt: "Can we meet the deadline on Friday?", fr: "Pouvons-nous tenir le délai de vendredi ?" },
        { who: "toi", choices: ["I'm afraid we'll need two more days.", "I fear we need two days more.", "Sorry, we will be in late of two days."], fr: "Je crains qu'il nous faille deux jours de plus." },
      ] },
    { id: "telephone", niveau: 4, titre: "Téléphone et visio", emoji: "📞",
      mots: [["Qui est à l'appareil ?", "Who's calling, please?"], ["Ne quittez pas", "Hold on, please"], ["Je vous le passe", "I'll put you through"], ["Puis-je laisser un message ?", "Can I leave a message?"],
        ["Je vous rappelle", "I'll call you back"], ["Vous coupez", "You're breaking up"], ["Votre micro est coupé", "You're on mute"], ["Partager mon écran", "To share my screen"],
        ["Pouvez-vous répéter ?", "Could you say that again?"], ["La connexion est mauvaise", "The connection is bad"], ["Un appel en visio", "A video call"], ["Raccrocher", "To hang up"]],
      dialogue: [
        { who: "jack", txt: "Hello, Jack speaking. How can I help you?", fr: "Allô, Jack à l'appareil. Que puis-je pour vous ?" },
        { who: "toi", choices: ["Hello, could I speak to Ms Smith, please?", "Hello, I want speak with Ms Smith.", "Hello, give me Ms Smith."], fr: "Bonjour, pourrais-je parler à Mme Smith, s'il vous plaît ?" },
        { who: "jack", txt: "I'm sorry, she's in a meeting. Can I take a message?", fr: "Désolé, elle est en réunion. Je prends un message ?" },
        { who: "toi", choices: ["Yes, please ask her to call me back.", "Yes, please say her to call me back.", "Yes, she call me back please."], fr: "Oui, demandez-lui de me rappeler, s'il vous plaît." },
      ] },
    { id: "presenter", niveau: 4, titre: "Présenter et négocier", emoji: "📊",
      mots: [["Je vais vous présenter", "I'm going to walk you through"], ["Comme vous pouvez le voir", "As you can see"], ["Une hausse", "An increase"], ["Une baisse", "A decrease"],
        ["Le chiffre d'affaires", "Turnover / Revenue"], ["La rentabilité", "Profitability"], ["Faire une offre", "To make an offer"], ["Un compromis", "A compromise"],
        ["Nous pourrions envisager", "We could consider"], ["C'est notre dernier prix", "That's our final offer"], ["Conclure un accord", "To close a deal"], ["Gagnant-gagnant", "Win-win"]],
      dialogue: [
        { who: "jack", txt: "Your price is too high for us.", fr: "Votre prix est trop élevé pour nous." },
        { who: "toi", choices: ["We could consider a discount if you order more.", "We could considering a discount if you order more.", "OK, it's free then."], fr: "Nous pourrions envisager une remise si vous commandez plus." },
        { who: "jack", txt: "Ten percent off for five hundred units?", fr: "Dix pour cent de remise pour cinq cents unités ?" },
        { who: "toi", choices: ["That sounds like a win-win. Let's close the deal.", "It sounds win-win. Let's close the affair.", "Yes, we make a deal yesterday."], fr: "Ça me semble gagnant-gagnant. Concluons l'accord." },
      ] },

    // ---------- EXPERT (C1) ----------
    { id: "faux-amis", niveau: 5, titre: "Les faux amis (pièges)", emoji: "⚠️",
      mots: [["En fait", "Actually"], ["Finalement (à la fin)", "Eventually"], ["Actuellement", "Currently"], ["Une bibliothèque", "A library"],
        ["Une librairie", "A bookshop"], ["Raisonnable", "Sensible"], ["Sensible", "Sensitive"], ["Assister à (une réunion)", "To attend"],
        ["Aider (« assister »)", "To assist"], ["Éventuellement", "Possibly"], ["Prétendre (affirmer)", "To claim"], ["La monnaie (pièces rendues)", "Change"]] },
    { id: "registres", niveau: 5, titre: "Nuances et registres", emoji: "🎚️",
      mots: [["Obtenir (soutenu)", "To obtain"], ["Commencer (soutenu)", "To commence"], ["Aider (soutenu)", "To assist"], ["Demander (soutenu)", "To enquire"],
        ["Pour autant que je sache", "As far as I'm aware"], ["Il semblerait que", "It would appear that"], ["Sans doute", "Arguably"], ["Dans une certaine mesure", "To some extent"],
        ["En tout cas", "In any case"], ["Quoi qu'il en soit", "Be that as it may"], ["Plutôt (un peu)", "Somewhat"], ["Néanmoins", "Nevertheless"]],
      dialogue: [
        { who: "jack", txt: "Was the project a success?", fr: "Le projet a-t-il été un succès ?" },
        { who: "toi", choices: ["To some extent, yes, although costs were somewhat higher than expected.", "In some extent yes, although costs were somewhat more high than expected.", "Yes totally, no problem never."], fr: "Dans une certaine mesure, oui, même si les coûts ont été un peu plus élevés que prévu." },
        { who: "jack", txt: "Would you recommend continuing?", fr: "Recommanderiez-vous de continuer ?" },
        { who: "toi", choices: ["Arguably, it would be wiser to review the budget first.", "Arguably, it would be more wise to review first the budget.", "I recommend to continuing."], fr: "Sans doute serait-il plus sage de revoir d'abord le budget." },
      ] },
    { id: "idiomes-pro", niveau: 5, titre: "Expressions du monde pro", emoji: "🎯",
      mots: [["Sortir des sentiers battus", "To think outside the box"], ["Reprendre contact", "To touch base"], ["Les grandes lignes", "The big picture"], ["Être débordé", "To be snowed under"],
        ["Mettre les bouchées doubles", "To pull out all the stops"], ["Revenir à la case départ", "To go back to the drawing board"], ["Un gain rapide", "A quick win"], ["Approfondir", "To drill down"],
        ["Ça ne va pas de soi", "It's not a given"], ["En fin de compte", "At the end of the day"], ["Être sur la bonne voie", "To be on track"], ["Faire le nécessaire", "To go the extra mile"]] },
    { id: "management", niveau: 5, titre: "Leadership et management", emoji: "🧭",
      mots: [["Déléguer", "To delegate"], ["Motiver une équipe", "To motivate a team"], ["Un retour (avis)", "Feedback"], ["Fixer des objectifs", "To set goals"],
        ["Un indicateur clé", "A key performance indicator (KPI)"], ["Une prise de décision", "Decision-making"], ["Responsabiliser", "To empower"], ["Gérer un conflit", "To handle a conflict"],
        ["Un entretien annuel", "A performance review"], ["Une vision", "A vision"], ["Une stratégie", "A strategy"], ["Prendre du recul", "To step back"]],
      dialogue: [
        { who: "jack", txt: "One of your team members keeps missing deadlines. What do you do?", fr: "Un membre de ton équipe rate sans cesse les délais. Que fais-tu ?" },
        { who: "toi", choices: ["I'd talk to them privately and give constructive feedback.", "I'd talk them privately and give constructive feedbacks.", "I fire him tomorrow."], fr: "Je lui parlerais en privé et lui ferais un retour constructif." },
        { who: "jack", txt: "And then?", fr: "Et ensuite ?" },
        { who: "toi", choices: ["We'd set clear goals together and review progress every week.", "We'd set together clear goals and review progresses each week.", "Then nothing."], fr: "Nous fixerions ensemble des objectifs clairs et ferions le point chaque semaine." },
      ] },
  );

  en.grammaire.push(
    // ---------- AVANCÉ (B2) ----------
    { id: "past-continuous", niveau: 3, titre: "Le past continuous (was + -ing)",
      explication: `Pour une action <b>en cours</b> dans le passé : <b>was/were + verbe-ing</b>.<br>
        Souvent avec le prétérit pour une action qui l'<b>interrompt</b> : <i>I <b>was cooking</b> when the phone <b>rang</b>.</i><br>
        <b>while</b> + past continuous : <i>While she was working, he was sleeping.</i>`,
      exemples: [["I was reading when you called.", "Je lisais quand tu as appelé."], ["They were playing football at 5 pm.", "Ils jouaient au foot à 17 h."], ["What were you doing?", "Que faisais-tu ?"]],
      exercices: [
        { q: "I ___ TV when the lights went out.", choix: ["was watching", "watched", "were watching"], fr: "Je regardais la télé quand la lumière s'est éteinte." },
        { q: "They ___ dinner at 8 pm yesterday.", choix: ["were having", "was having", "had having"], fr: "Ils dînaient à 20 h hier." },
        { q: "While I was driving, it ___ to rain.", choix: ["started", "was start", "starting"], fr: "Pendant que je conduisais, il a commencé à pleuvoir." },
        { q: "What ___ you doing at midnight?", choix: ["were", "was", "did"], fr: "Que faisais-tu à minuit ?" },
        { q: "She ___ when I arrived.", choix: ["was sleeping", "slept", "is sleeping"], fr: "Elle dormait quand je suis arrivé." },
      ] },
    { id: "past-perfect", niveau: 3, titre: "Le past perfect (had + participe)",
      explication: `Pour une action <b>antérieure</b> à une autre action passée (comme le plus-que-parfait) : <b>had + participe passé</b>.<br>
        <i>When I arrived, the train <b>had</b> already <b>left</b>.</i> (le train était déjà parti)<br>
        Très utilisé avec <b>already, just, before, by the time</b>.`,
      exemples: [["She had finished before I came.", "Elle avait fini avant que je vienne."], ["I had never seen the sea.", "Je n'avais jamais vu la mer."], ["By the time we arrived, they had eaten.", "Quand nous sommes arrivés, ils avaient mangé."]],
      exercices: [
        { q: "When we got there, the film ___ already started.", choix: ["had", "has", "was"], fr: "Quand nous sommes arrivés, le film avait déjà commencé." },
        { q: "I ___ never flown before that trip.", choix: ["had", "have", "did"], fr: "Je n'avais jamais pris l'avion avant ce voyage." },
        { q: "She was tired because she ___ all night.", choix: ["had worked", "has worked", "works"], fr: "Elle était fatiguée car elle avait travaillé toute la nuit." },
        { q: "By the time he called, I ___ the report.", choix: ["had sent", "sent", "have sent"], fr: "Quand il a appelé, j'avais envoyé le rapport." },
        { q: "They ___ left when I arrived.", choix: ["had already", "have already", "already have"], fr: "Ils étaient déjà partis quand je suis arrivé." },
      ] },
    { id: "discours-indirect", niveau: 3, titre: "Le discours indirect (reported speech)",
      explication: `Pour rapporter des paroles, on recule souvent le temps d'un cran :<br>
        présent → prétérit · prétérit/present perfect → past perfect · will → would · can → could.<br>
        <i>"I am tired." → He said (that) he <b>was</b> tired.</i><br>
        <b>say</b> (sans complément) / <b>tell</b> + quelqu'un : <i>He <b>told me</b> he was tired.</i> Questions : <i>She asked <b>if</b> I was ready.</i> (pas d'inversion)`,
      exemples: [["She said she was busy.", "Elle a dit qu'elle était occupée."], ["He told me he would call.", "Il m'a dit qu'il appellerait."], ["They asked where I lived.", "Ils ont demandé où j'habitais."]],
      exercices: [
        { q: "\"I'm hungry.\" → He said he ___ hungry.", choix: ["was", "is", "has been"], fr: "Il a dit qu'il avait faim." },
        { q: "She ___ me she would be late.", choix: ["told", "said", "says to"], fr: "Elle m'a dit qu'elle serait en retard." },
        { q: "\"I will help you.\" → He said he ___ help me.", choix: ["would", "will", "can"], fr: "Il a dit qu'il m'aiderait." },
        { q: "They asked me where I ___.", choix: ["worked", "did work", "do I work"], fr: "Ils m'ont demandé où je travaillais." },
        { q: "She asked ___ I was ready.", choix: ["if", "that", "what"], fr: "Elle a demandé si j'étais prêt." },
      ] },
    { id: "conditionnels", niveau: 3, titre: "Les conditionnels 2 et 3",
      explication: `<b>2e conditionnel</b> (hypothèse sur le présent) : <i>If + prétérit, would + verbe</i> → <i>If I <b>had</b> time, I <b>would travel</b>.</i> (avec be : <i>If I <b>were</b> you…</i>)<br>
        <b>3e conditionnel</b> (regret sur le passé) : <i>If + past perfect, would have + participe</i> → <i>If I <b>had studied</b>, I <b>would have passed</b>.</i><br>
        ⚠️ Jamais de <b>would</b> juste après <b>if</b>.`,
      exemples: [["If I were you, I would accept.", "À ta place, j'accepterais."], ["If she had known, she would have come.", "Si elle avait su, elle serait venue."], ["What would you do if you won?", "Que ferais-tu si tu gagnais ?"]],
      exercices: [
        { q: "If I ___ rich, I would buy a house.", choix: ["were", "would be", "am"], fr: "Si j'étais riche, j'achèterais une maison." },
        { q: "If you had asked me, I ___ helped you.", choix: ["would have", "would", "had"], fr: "Si tu me l'avais demandé, je t'aurais aidé." },
        { q: "If it ___ yesterday, we would have stayed home.", choix: ["had rained", "rained", "would rain"], fr: "S'il avait plu hier, nous serions restés à la maison." },
        { q: "What would you do if you ___ the lottery?", choix: ["won", "would win", "had won"], fr: "Que ferais-tu si tu gagnais au loto ?" },
        { q: "If I ___ you, I'd call her.", choix: ["were", "am", "will be"], fr: "À ta place, je l'appellerais." },
      ] },

    // ---------- PRO (B2–C1) ----------
    { id: "perfect-continuous", niveau: 4, titre: "Le present perfect continuous",
      explication: `<b>have/has been + verbe-ing</b> : une action commencée dans le passé qui <b>dure encore</b> (ou vient de s'arrêter), avec l'idée de durée.<br>
        <i>I <b>have been working</b> here <b>for</b> three years.</i> (je travaille ici depuis 3 ans)<br>
        <b>for</b> + durée (for two hours) · <b>since</b> + point de départ (since 2020, since Monday).`,
      exemples: [["I've been waiting for an hour.", "J'attends depuis une heure."], ["She has been working here since 2021.", "Elle travaille ici depuis 2021."], ["How long have you been learning English?", "Depuis combien de temps apprends-tu l'anglais ?"]],
      exercices: [
        { q: "I ___ here for five years.", choix: ["have been working", "am working", "work"], fr: "Je travaille ici depuis cinq ans." },
        { q: "She has been studying ___ 9 am.", choix: ["since", "for", "from"], fr: "Elle étudie depuis 9 h." },
        { q: "How long ___ you been waiting?", choix: ["have", "are", "did"], fr: "Depuis combien de temps attends-tu ?" },
        { q: "We have been negotiating ___ three weeks.", choix: ["for", "since", "during"], fr: "Nous négocions depuis trois semaines." },
        { q: "He looks tired. He ___ all day.", choix: ["has been working", "is working since", "works"], fr: "Il a l'air fatigué. Il a travaillé toute la journée." },
      ] },
    { id: "gerondif-infinitif", niveau: 4, titre: "Gérondif ou infinitif ?",
      explication: `Après certains verbes : <b>-ing</b> → <i>enjoy, avoid, finish, suggest, mind, consider, look forward to</i>.<br>
        Après d'autres : <b>to + verbe</b> → <i>want, decide, hope, agree, plan, refuse, need, would like</i>.<br>
        Après une <b>préposition</b>, toujours -ing : <i>interested <b>in working</b></i>, <i>thank you <b>for calling</b></i>.`,
      exemples: [["I look forward to meeting you.", "J'ai hâte de vous rencontrer."], ["We decided to postpone the launch.", "Nous avons décidé de reporter le lancement."], ["Would you mind closing the door?", "Ça vous dérangerait de fermer la porte ?"]],
      exercices: [
        { q: "I look forward to ___ from you.", choix: ["hearing", "hear", "to hear"], fr: "Dans l'attente de votre réponse." },
        { q: "We have decided ___ the contract.", choix: ["to sign", "signing", "sign"], fr: "Nous avons décidé de signer le contrat." },
        { q: "Would you mind ___ the report again?", choix: ["sending", "to send", "send"], fr: "Ça vous dérangerait de renvoyer le rapport ?" },
        { q: "She is interested in ___ for us.", choix: ["working", "to work", "work"], fr: "Elle est intéressée par un poste chez nous." },
        { q: "They refused ___ the price.", choix: ["to lower", "lowering", "lower"], fr: "Ils ont refusé de baisser le prix." },
      ] },
    { id: "politesse", niveau: 4, titre: "Demandes polies et registre formel",
      explication: `Au travail, on adoucit les demandes :<br>
        <i>Can you…?</i> → <i><b>Could you</b>…?</i> → <i><b>Would you mind</b> + -ing…?</i> → <i><b>I would be grateful if you could</b>…</i><br>
        <i>I want</i> → <b>I would like</b>. <i>I think you're wrong</i> → <b>I'm not sure I agree</b>.<br>
        Pour annoncer une mauvaise nouvelle : <b>I'm afraid</b>… (<i>I'm afraid we can't accept</i>).`,
      exemples: [["Could you send me the file?", "Pourriez-vous m'envoyer le fichier ?"], ["I would be grateful if you could reply by Friday.", "Je vous serais reconnaissant de répondre d'ici vendredi."], ["I'm afraid the meeting has been cancelled.", "Je crains que la réunion soit annulée."]],
      exercices: [
        { q: "___ you send me the invoice, please?", choix: ["Could", "Must", "Do"], fr: "Pourriez-vous m'envoyer la facture ?" },
        { q: "I would be grateful if you ___ call me back.", choix: ["could", "can to", "will"], fr: "Je vous serais reconnaissant de me rappeler." },
        { q: "Would you mind ___ the meeting?", choix: ["postponing", "to postpone", "postpone"], fr: "Ça vous dérangerait de reporter la réunion ?" },
        { q: "___ we can't deliver before Monday.", choix: ["I'm afraid", "I fear that", "Sadly no"], fr: "Je crains que nous ne puissions livrer avant lundi." },
        { q: "I ___ to book a meeting room.", choix: ["would like", "want", "like"], fr: "Je voudrais réserver une salle de réunion." },
      ] },
    { id: "deduction", niveau: 4, titre: "Les modaux de déduction",
      explication: `Pour dire si c'est sûr ou probable :<br>
        <b>must</b> (sûrement) · <b>might / may / could</b> (peut-être) · <b>can't</b> (impossible).<br>
        Sur le passé : modal + <b>have + participe</b> → <i>He <b>must have forgotten</b></i> (il a dû oublier), <i>She <b>can't have left</b></i> (elle n'a pas pu partir).`,
      exemples: [["She must be in a meeting.", "Elle doit être en réunion."], ["It might rain later.", "Il pourrait pleuvoir plus tard."], ["They can't have received the email.", "Ils n'ont pas pu recevoir le mail."]],
      exercices: [
        { q: "He's not answering. He ___ be busy.", choix: ["must", "can't", "mustn't"], fr: "Il ne répond pas. Il doit être occupé." },
        { q: "That ___ be true — it's impossible!", choix: ["can't", "must", "might"], fr: "Ça ne peut pas être vrai, c'est impossible !" },
        { q: "The file isn't here. Someone ___ deleted it.", choix: ["must have", "must", "can't have"], fr: "Le fichier n'est pas là. Quelqu'un a dû le supprimer." },
        { q: "I'm not sure. It ___ be ready tomorrow.", choix: ["might", "must", "can't"], fr: "Je ne suis pas sûr. Ce sera peut-être prêt demain." },
        { q: "She ___ have seen us; she was in Paris.", choix: ["can't", "must", "should"], fr: "Elle n'a pas pu nous voir ; elle était à Paris." },
      ] },

    // ---------- EXPERT (C1) ----------
    { id: "inversion", niveau: 5, titre: "L'inversion pour insister",
      explication: `En anglais soutenu, après un adverbe négatif ou restrictif placé en tête, on <b>inverse</b> sujet et auxiliaire :<br>
        <i><b>Never have I</b> seen such results.</i> · <i><b>Not only did</b> they win, but they also…</i> · <i><b>Rarely do</b> we…</i> · <i><b>Hardly had</b> I arrived when…</i><br>
        Aussi dans les conditions : <i><b>Had I known</b>, I would have called.</i> (= If I had known)`,
      exemples: [["Never have I seen such a mess.", "Jamais je n'ai vu un tel désordre."], ["Not only did she finish early, but she also helped others.", "Non seulement elle a fini tôt, mais elle a aussi aidé les autres."], ["Had we known, we would have acted.", "Si nous avions su, nous aurions agi."]],
      exercices: [
        { q: "Never ___ such a good offer.", choix: ["have I seen", "I have seen", "I saw"], fr: "Jamais je n'ai vu une si bonne offre." },
        { q: "Not only ___ late, but he also forgot the file.", choix: ["was he", "he was", "he is"], fr: "Non seulement il était en retard, mais il a aussi oublié le dossier." },
        { q: "___ I known, I would have come.", choix: ["Had", "If", "Have"], fr: "Si j'avais su, je serais venu." },
        { q: "Rarely ___ such a talented team.", choix: ["do we meet", "we meet", "we do meet"], fr: "Il est rare que nous rencontrions une équipe aussi talentueuse." },
        { q: "Hardly ___ arrived when the meeting started.", choix: ["had I", "I had", "have I"], fr: "À peine étais-je arrivé que la réunion a commencé." },
      ] },
    { id: "wish", niveau: 5, titre: "Wish, if only et conditionnels mixtes",
      explication: `<b>wish / if only + prétérit</b> : regret sur le présent → <i>I wish I <b>spoke</b> Chinese.</i><br>
        <b>wish + past perfect</b> : regret sur le passé → <i>I wish I <b>had accepted</b>.</i><br>
        <b>wish + would</b> : agacement → <i>I wish he <b>would</b> stop talking.</i><br>
        <b>Conditionnel mixte</b> : passé → présent : <i>If I <b>had taken</b> the job, I <b>would be</b> in London now.</i>`,
      exemples: [["I wish I had more time.", "J'aimerais avoir plus de temps."], ["If only I had listened!", "Si seulement j'avais écouté !"], ["If she had studied law, she would be a lawyer now.", "Si elle avait étudié le droit, elle serait avocate aujourd'hui."]],
      exercices: [
        { q: "I wish I ___ more patient.", choix: ["were", "am", "will be"], fr: "J'aimerais être plus patient." },
        { q: "If only I ___ that email!", choix: ["hadn't sent", "didn't send", "don't send"], fr: "Si seulement je n'avais pas envoyé ce mail !" },
        { q: "I wish my neighbours ___ so much noise.", choix: ["wouldn't make", "don't make", "won't make"], fr: "J'aimerais que mes voisins arrêtent de faire autant de bruit." },
        { q: "If I had saved money, I ___ rich now.", choix: ["would be", "would have been", "will be"], fr: "Si j'avais économisé, je serais riche maintenant." },
        { q: "She wishes she ___ the offer last year.", choix: ["had accepted", "accepted", "would accept"], fr: "Elle regrette de ne pas avoir accepté l'offre l'an dernier." },
      ] },
    { id: "mise-en-relief", niveau: 5, titre: "Mettre en relief (cleft sentences)",
      explication: `Pour insister sur un élément :<br>
        <b>It is/was … that/who</b> → <i><b>It was</b> Sarah <b>who</b> found the solution.</i> (c'est Sarah qui…)<br>
        <b>What … is/was</b> → <i><b>What</b> we need <b>is</b> more time.</i> (ce dont nous avons besoin, c'est…)<br>
        <b>The reason why … is that</b> → <i>The reason why I called is that…</i>`,
      exemples: [["It was the price that convinced them.", "C'est le prix qui les a convaincus."], ["What I like about this job is the team.", "Ce que j'aime dans ce poste, c'est l'équipe."], ["All we need is a decision.", "Tout ce qu'il nous faut, c'est une décision."]],
      exercices: [
        { q: "___ we need is a clear plan.", choix: ["What", "That", "Which"], fr: "Ce dont nous avons besoin, c'est d'un plan clair." },
        { q: "It was Tom ___ signed the contract.", choix: ["who", "which", "what"], fr: "C'est Tom qui a signé le contrat." },
        { q: "It ___ in 2019 that we opened our first office.", choix: ["was", "is", "has been"], fr: "C'est en 2019 que nous avons ouvert notre premier bureau." },
        { q: "The reason ___ I'm calling is the delay.", choix: ["why", "because", "that why"], fr: "La raison pour laquelle j'appelle, c'est le retard." },
        { q: "What surprised me ___ his reaction.", choix: ["was", "were", "it was"], fr: "Ce qui m'a surpris, c'est sa réaction." },
      ] },
    { id: "futur-avance", niveau: 5, titre: "Future perfect et future continuous",
      explication: `<b>Future continuous</b> (will be + -ing) : action en cours à un moment du futur → <i>This time tomorrow, I <b>will be flying</b> to Tokyo.</i><br>
        <b>Future perfect</b> (will have + participe) : action terminée avant un moment du futur → <i>By Friday, we <b>will have finished</b> the project.</i><br>
        Marqueurs : <b>by</b> (d'ici), <b>by the time</b>, <b>this time next week</b>.`,
      exemples: [["By 2030, we will have opened ten stores.", "D'ici 2030, nous aurons ouvert dix magasins."], ["I'll be working late tonight.", "Je travaillerai tard ce soir."], ["Will you have read the report by Monday?", "Auras-tu lu le rapport d'ici lundi ?"]],
      exercices: [
        { q: "By next June, I ___ here for ten years.", choix: ["will have worked", "will work", "work"], fr: "En juin prochain, cela fera dix ans que je travaille ici." },
        { q: "This time tomorrow, we ___ on the beach.", choix: ["will be lying", "will have lain", "lie"], fr: "Demain à cette heure-ci, nous serons allongés sur la plage." },
        { q: "Don't call at 9: I ___ a meeting.", choix: ["will be having", "will have had", "have"], fr: "N'appelle pas à 9 h : je serai en réunion." },
        { q: "They will have finished ___ the end of the week.", choix: ["by", "until", "since"], fr: "Ils auront fini d'ici la fin de la semaine." },
        { q: "By the time you arrive, the film ___.", choix: ["will have started", "will start", "starts"], fr: "Quand tu arriveras, le film aura commencé." },
      ] },
  );
})();
