// Contenu ITALIEN de Jack Blabla — niveaux 3 (Avancé, B2), 4 (Pro, B2–C1) et 5 (Expert, C1).
// Chargé après contenu/it.js : il AJOUTE des cours, il ne remplace rien.
// Exercices : le PREMIER choix est toujours la bonne réponse (ils sont mélangés à l'affichage).

(() => {
  const it = CONTENU.it;

  it.temps.push(
    { id: "congiuntivo", nom: "Subjonctif présent (congiuntivo)", niveau: 3 },
    { id: "trapassato", nom: "Plus-que-parfait (trapassato prossimo)", niveau: 3 },
    { id: "congiuntivo-imperfetto", nom: "Subjonctif imparfait", niveau: 4 },
    { id: "condizionale-passato", nom: "Conditionnel passé", niveau: 5 },
  );

  it.verbes.push(
    { inf: "conoscere", fr: "connaître", niveau: 3, irregulier: true, participe: "conosciuto" },
    { inf: "scegliere", fr: "choisir", niveau: 3, irregulier: true, participe: "scelto", formes: {
      presente: ["scelgo", "scegli", "sceglie", "scegliamo", "scegliete", "scelgono"],
      congiuntivo: ["scelga", "scelga", "scelga", "scegliamo", "scegliate", "scelgano"] } },
    { inf: "studiare", fr: "étudier", niveau: 3 },
    { inf: "cominciare", fr: "commencer", niveau: 3 },
    { inf: "piacere", fr: "plaire", niveau: 3, irregulier: true, aux: "essere", participe: "piaciuto", formes: {
      presente: ["piaccio", "piaci", "piace", "piacciamo", "piacete", "piacciono"],
      congiuntivo: ["piaccia", "piaccia", "piaccia", "piacciamo", "piacciate", "piacciano"] } },
    { inf: "decidere", fr: "décider", niveau: 4, irregulier: true, participe: "deciso" },
    { inf: "rispondere", fr: "répondre", niveau: 4, irregulier: true, participe: "risposto" },
    { inf: "preferire", fr: "préférer", niveau: 4, isc: true },
    { inf: "tornare", fr: "rentrer, revenir", niveau: 4, aux: "essere" },
    { inf: "nascere", fr: "naître", niveau: 5, irregulier: true, aux: "essere", participe: "nato" },
    { inf: "morire", fr: "mourir", niveau: 5, irregulier: true, aux: "essere", participe: "morto", formes: {
      presente: ["muoio", "muori", "muore", "moriamo", "morite", "muoiono"],
      congiuntivo: ["muoia", "muoia", "muoia", "moriamo", "moriate", "muoiano"] } },
    { inf: "tradurre", fr: "traduire", niveau: 5, irregulier: true, base: "traducere", participe: "tradotto", radicalFutur: "tradurr" },
  );

  it.themes.push(
    // ---------- AVANCÉ ----------
    { id: "debat", niveau: 3, titre: "Débattre et argumenter", emoji: "🗣️",
      mots: [["D'un côté… de l'autre…", "Da un lato… dall'altro…"], ["En ce qui concerne…", "Per quanto riguarda…"], ["Il faut reconnaître que…", "Bisogna ammettere che…"],
        ["Le fait est que…", "Il punto è che…"], ["Il me semble que…", "Mi sembra che…"], ["Au contraire", "Al contrario"], ["En conclusion", "In conclusione"],
        ["Ce n'est pas vrai que…", "Non è vero che…"], ["Je suis convaincu que…", "Sono convinto che…"], ["Bref", "Insomma"]],
      dialogue: [
        { who: "jack", txt: "Secondo te, il telelavoro è una buona idea?", fr: "D'après toi, le télétravail est une bonne idée ?" },
        { who: "toi", choices: ["Da un lato fa risparmiare tempo, dall'altro isola le persone.", "Da un lato è buona, dall'altro lato è buona anche.", "Sono convinto che è sempre perfetto."], fr: "D'un côté il fait gagner du temps, de l'autre il isole les gens." },
        { who: "jack", txt: "Quindi non sei del tutto convinto?", fr: "Donc tu n'es pas complètement convaincu ?" },
        { who: "toi", choices: ["Insomma, penso che sia utile, ma con equilibrio.", "Insomma, penso che è utile.", "Insomma, pensando utile."], fr: "Bref, je pense que c'est utile, mais avec équilibre." },
      ] },
    { id: "medias", niveau: 3, titre: "Médias et technologie", emoji: "📱",
      mots: [["Le journal", "Il giornale"], ["L'information (une nouvelle)", "La notizia"], ["Le journal télévisé", "Il telegiornale"], ["Internet (le réseau)", "La rete"],
        ["Télécharger", "Scaricare"], ["Le téléphone portable", "Il cellulare"], ["Une application", "Un'app"], ["Le mot de passe", "La password"],
        ["L'intelligence artificielle", "L'intelligenza artificiale"], ["L'écran", "Lo schermo"]] },
    { id: "environnement", niveau: 3, titre: "Environnement et sciences", emoji: "🌍",
      mots: [["Le changement climatique", "Il cambiamento climatico"], ["Les énergies renouvelables", "Le energie rinnovabili"], ["Recycler", "Riciclare"],
        ["Les déchets", "I rifiuti"], ["Le développement durable", "Lo sviluppo sostenibile"], ["La sécheresse", "La siccità"], ["La biodiversité", "La biodiversità"],
        ["Économiser l'énergie", "Risparmiare energia"], ["L'expérience (scientifique)", "L'esperimento"], ["Le scientifique", "Lo scienziato"]] },
    { id: "pronominali", niveau: 3, titre: "Les verbes pronominaux idiomatiques", emoji: "🧩",
      mots: [["Y arriver", "Farcela"], ["S'en aller", "Andarsene"], ["Mettre du temps (à faire)", "Metterci"], ["Se débrouiller", "Cavarsela"],
        ["Le prendre mal", "Prendersela"], ["Arrêter ça", "Smetterla"], ["En vouloir à quelqu'un", "Avercela con qualcuno"], ["S'en ficher (familier)", "Fregarsene"]] },

    // ---------- PRO ----------
    { id: "emails", niveau: 4, titre: "Les e-mails professionnels", emoji: "✉️",
      mots: [["Cher Monsieur Rossi", "Gentile Signor Rossi"], ["Je vous écris pour…", "Le scrivo per…"], ["En pièce jointe", "In allegato"],
        ["Comme convenu", "Come d'accordo"], ["Je vous remercie par avance", "La ringrazio in anticipo"], ["Dans l'attente de votre retour", "Resto in attesa di un Suo riscontro"],
        ["Cordialement", "Cordiali saluti"], ["À bientôt", "A presto"]] },
    { id: "reunions", niveau: 4, titre: "Les réunions", emoji: "🧑‍💼",
      mots: [["L'ordre du jour", "L'ordine del giorno"], ["Le compte rendu", "Il verbale"], ["Prendre la parole", "Prendere la parola"], ["Faire le point", "Fare il punto"],
        ["Reporter (une date)", "Rinviare"], ["Proposer", "Proporre"], ["Nous sommes d'accord sur…", "Siamo d'accordo su…"], ["Passons au point suivant", "Passiamo al punto successivo"],
        ["Le budget", "Il budget"]],
      dialogue: [
        { who: "jack", txt: "Buongiorno a tutti. Facciamo il punto sul progetto?", fr: "Bonjour à tous. On fait le point sur le projet ?" },
        { who: "toi", choices: ["Volentieri. Abbiamo finito la prima fase in anticipo.", "Volentieri. Abbiamo finita la prima fase.", "Volentieri. Finiamo la prima fase ieri."], fr: "Volontiers. Nous avons terminé la première phase en avance." },
        { who: "jack", txt: "Ottimo. Passiamo al punto successivo: il budget.", fr: "Parfait. Passons au point suivant : le budget." },
        { who: "toi", choices: ["Propongo di rinviare questa decisione alla prossima riunione.", "Propongo che rinviamo alla riunione prossima ieri.", "Proposo di rinviare."], fr: "Je propose de reporter cette décision à la prochaine réunion." },
      ] },
    { id: "telephone", niveau: 4, titre: "Téléphone et visio", emoji: "📞",
      mots: [["Allô ?", "Pronto?"], ["Qui est à l'appareil ?", "Chi parla?"], ["Ne quittez pas", "Resti in linea"], ["Je vous passe mon collègue", "Le passo il mio collega"],
        ["Pouvez-vous répéter ?", "Può ripetere?"], ["Ça coupe (la ligne est mauvaise)", "La linea è disturbata"], ["Rappeler", "Richiamare"], ["Laisser un message", "Lasciare un messaggio"],
        ["L'appel vidéo", "La videochiamata"], ["Couper son micro", "Disattivare il microfono"]],
      dialogue: [
        { who: "jack", txt: "Pronto? Studio Bianchi, buongiorno.", fr: "Allô ? Cabinet Bianchi, bonjour." },
        { who: "toi", choices: ["Buongiorno, vorrei parlare con la dottoressa Bianchi.", "Ciao, voglio Bianchi.", "Buongiorno, vorrei parlare a dottoressa Bianchi ieri."], fr: "Bonjour, je voudrais parler à Mme Bianchi." },
        { who: "jack", txt: "Mi dispiace, è in riunione. Vuole lasciare un messaggio?", fr: "Désolé, elle est en réunion. Voulez-vous laisser un message ?" },
        { who: "toi", choices: ["Sì, grazie. Può dirle di richiamarmi?", "Sì, grazie. Può dirgli di richiamarmi?", "Sì, grazie. Può dire lei richiamarmi?"], fr: "Oui, merci. Pouvez-vous lui dire de me rappeler ?" },
      ] },
    { id: "presenter", niveau: 4, titre: "Présenter et négocier", emoji: "📊",
      mots: [["La présentation", "La presentazione"], ["Les données", "I dati"], ["Le chiffre d'affaires", "Il fatturato"], ["La proposition", "La proposta"],
        ["Le devis", "Il preventivo"], ["Faire une remise", "Fare uno sconto"], ["Trouver un accord", "Trovare un accordo"], ["Le client", "Il cliente"],
        ["Le fournisseur", "Il fornitore"], ["Signer le contrat", "Firmare il contratto"]] },

    // ---------- EXPERT ----------
    { id: "faux-amis", niveau: 5, titre: "Les faux amis (pièges)", emoji: "⚠️",
      mots: [["La chambre (pas « caméra »)", "La camera"], ["Regarder (pas « garder »)", "Guardare"], ["La ferme (pas « fermeture »)", "La fattoria"],
        ["La poche (pas « tasse »)", "La tasca"], ["Le beurre (pas « bourre »)", "Il burro"], ["La pièce d'une maison", "La stanza"],
        ["Le bureau (meuble)", "La scrivania"], ["Attendre", "Aspettare"], ["Les toilettes", "Il gabinetto"], ["Délicieux, exquis", "Squisito"]] },
    { id: "registres", niveau: 5, titre: "Nuances et registres", emoji: "🎚️",
      mots: [["Salut (familier)", "Ciao"], ["Excuse-moi (familier)", "Scusa"], ["Excusez-moi (formel)", "Mi scusi"], ["Pardon, je peux passer ?", "Permesso"],
        ["Je vous en prie (formel)", "Si figuri"], ["Ça ne fait rien", "Non fa niente"], ["Volontiers", "Volentieri"], ["Bien sûr", "Certo"],
        ["Tant pis", "Pazienza"], ["Allez ! Vas-y !", "Dai!"]] },
    { id: "idiomes-pro", niveau: 5, titre: "Expressions du monde pro", emoji: "🎯",
      mots: [["Faire le bilan", "Tirare le somme"], ["Être débordé", "Essere sommerso di lavoro"], ["Mettre les points sur les i", "Mettere i puntini sulle i"],
        ["Avoir le vent en poupe", "Avere il vento in poppa"], ["Respecter les délais", "Rispettare le scadenze"], ["Sortir des sentiers battus", "Uscire dagli schemi"],
        ["Le jeu en vaut la chandelle", "Il gioco vale la candela"], ["En un clin d'œil", "In un batter d'occhio"]] },
    { id: "management", niveau: 5, titre: "Leadership et management", emoji: "🧭",
      mots: [["Déléguer", "Delegare"], ["Motiver l'équipe", "Motivare la squadra"], ["Fixer des objectifs", "Fissare degli obiettivi"], ["Un retour (feedback)", "Un riscontro"],
        ["Prendre une décision", "Prendere una decisione"], ["La responsabilité", "La responsabilità"], ["L'entretien annuel", "Il colloquio annuale"],
        ["Gérer un conflit", "Gestire un conflitto"], ["Le leadership", "La leadership"], ["La confiance", "La fiducia"]] },
  );

  it.grammaire.push(
    // ---------- AVANCÉ ----------
    { id: "congiuntivo", niveau: 3, titre: "Le subjonctif présent (congiuntivo)",
      astuce: "Après penso che, credo che, voglio che, spero che, è importante che, benché : congiuntivo (sia, abbia, faccia, parli, prenda…).",
      explication: `Formation : -are → <b>-i</b> (parli), -ere / -ire → <b>-a</b> (prenda, dorma) ; noi <b>-iamo</b>, voi <b>-iate</b>, loro -ino / -ano.<br>
        Irréguliers clés : essere → <b>sia</b>, avere → <b>abbia</b>, fare → <b>faccia</b>, andare → <b>vada</b>, venire → <b>venga</b>, potere → <b>possa</b>.<br>
        On l'emploie après les verbes d'<b>opinion</b> (penso che, credo che, mi sembra che), de <b>volonté</b> (voglio che), d'<b>espoir</b> (spero che), et après <b>benché, sebbene, affinché, prima che</b>.`,
      pourquoi: "C'est LA grande différence avec le français : « je pense que c'est vrai » se dit avec l'indicatif en français, mais avec le subjonctif en italien (penso che <b>sia</b> vero). Dès que tu donnes ton opinion, pense subjonctif.",
      pieges: [["Penso che è vero.", "Penso che sia vero.", "Opinion (penso, credo, mi sembra) → congiuntivo."], ["Credo che ha ragione.", "Credo che abbia ragione.", "Même règle avec credere."], ["Benché è tardi…", "Benché sia tardi…", "benché, sebbene → congiuntivo."]],
      exemples: [["Penso che Marco abbia ragione.", "Je pense que Marco a raison."], ["Voglio che tu venga.", "Je veux que tu viennes."], ["Spero che faccia bel tempo.", "J'espère qu'il fera beau."]],
      exercices: [
        { q: "Penso che Marco ___ ragione.", choix: ["abbia", "ha", "avrà"], fr: "Je pense que Marco a raison.", pourquoi: "Après penso che → congiuntivo : abbia." },
        { q: "Voglio che tu ___ con me.", choix: ["venga", "vieni", "verrai"], fr: "Je veux que tu viennes avec moi.", pourquoi: "Volonté (voglio che) → congiuntivo : venga." },
        { q: "È importante che loro ___.", choix: ["studino", "studiano", "studieranno"], fr: "Il est important qu'ils étudient.", pourquoi: "è importante che → congiuntivo ; -are → -ino." },
        { q: "Benché ___ stanco, esco.", choix: ["sia", "sono", "sarò"], fr: "Bien que je sois fatigué, je sors.", pourquoi: "benché → congiuntivo : sia." },
        { q: "Spero che domani ___ bel tempo.", choix: ["faccia", "fa", "fare"], fr: "J'espère qu'il fera beau demain.", pourquoi: "spero che → congiuntivo : faccia." },
      ] },
    { id: "trapassato", niveau: 3, titre: "Le plus-que-parfait (trapassato prossimo)",
      astuce: "imparfait de avere / essere + participe : avevo mangiato, ero partito.",
      explication: `<b>avevo, avevi, aveva…</b> ou <b>ero, eri, era…</b> + participe passé.<br>
        Il exprime une action <b>antérieure</b> à une autre action passée : <i>Quando sono arrivato, il film era già cominciato.</i><br>
        Même choix d'auxiliaire et mêmes accords qu'au passato prossimo.`,
      pourquoi: "C'est notre plus-que-parfait (« j'avais déjà mangé »). Il permet de remettre les événements dans l'ordre quand on raconte.",
      pieges: [["Quando sono arrivato, il film è già cominciato.", "…, il film era già cominciato.", "Antériorité dans le passé → trapassato."], ["Avevo andato.", "Ero andato.", "Même auxiliaire qu'au passé composé : essere pour andare."]],
      exemples: [["Avevo già mangiato.", "J'avais déjà mangé."], ["Lei era già partita.", "Elle était déjà partie."], ["Non avevo mai visto il mare.", "Je n'avais jamais vu la mer."]],
      exercices: [
        { q: "Quando sono arrivato, il film ___ già cominciato.", choix: ["era", "aveva", "è"], fr: "Quand je suis arrivé, le film avait déjà commencé.", pourquoi: "Antériorité → trapassato ; cominciare (intransitif) → essere : era." },
        { q: "Non ___ mai visto il mare prima.", choix: ["avevo", "ero", "ho"], fr: "Je n'avais jamais vu la mer avant.", pourquoi: "vedere → avere ; antériorité → avevo." },
        { q: "Lei ___ già partita.", choix: ["era", "aveva", "ha"], fr: "Elle était déjà partie.", pourquoi: "partire → essere ; au trapassato : era partita." },
        { q: "Avevamo ___ tutto prima di cena.", choix: ["finito", "finiti", "finire"], fr: "Nous avions tout fini avant le dîner.", pourquoi: "Avec avere, le participe ne s'accorde pas avec le sujet : finito." },
      ] },
    { id: "pronomi-combinati", niveau: 3, titre: "Les pronoms combinés (glielo, me lo)",
      astuce: "COI + COD : me lo, te la, ce li, ve le ; gli / le + lo = glielo (en un seul mot).",
      explication: `Quand on a deux pronoms, le COI vient d'abord et son <b>i devient e</b> : mi → <b>me</b>, ti → <b>te</b>, ci → <b>ce</b>, vi → <b>ve</b> : <i>Te lo do.</i><br>
        <b>gli</b> (à lui) et <b>le</b> (à elle) deviennent tous les deux <b>glie-</b> et se collent : <b>glielo, gliela, glieli, gliele</b>.<br>
        Avec un infinitif, tout se colle à la fin : <i>Voglio darglielo.</i>`,
      pourquoi: "Le français dit « je le lui donne » (COD puis COI). L'italien fait l'inverse : COI puis COD (« glielo do »). Et glielo sert pour « à lui » comme pour « à elle ».",
      pieges: [["Lo gli do.", "Glielo do.", "COI d'abord, et gli + lo s'écrivent en un seul mot."], ["Mi lo dai?", "Me lo dai?", "Devant un autre pronom, mi devient me."]],
      exemples: [["Te lo spiego dopo.", "Je te l'explique après."], ["Gliel'ho detto ieri.", "Je le lui ai dit hier."], ["Me ne dai un po'?", "Tu m'en donnes un peu ?"]],
      exercices: [
        { q: "Il libro? Te ___ do domani.", choix: ["lo", "la", "gli"], fr: "Le livre ? Je te le donne demain.", pourquoi: "libro (masc.) → lo ; te lo." },
        { q: "La lettera? ___ mando a Marco.", choix: ["Gliela", "Gli la", "Le la"], fr: "La lettre ? Je l'envoie à Marco.", pourquoi: "gli + la = gliela, en un seul mot." },
        { q: "Le foto? Me ___ ha mostrate.", choix: ["le", "li", "la"], fr: "Les photos ? Il me les a montrées.", pourquoi: "foto est féminin pluriel → le : me le." },
        { q: "Il regalo? Voglio dar___ (a lei).", choix: ["glielo", "lelo", "gli lo"], fr: "Le cadeau ? Je veux le lui donner.", pourquoi: "le (à elle) + lo = glielo, collé à l'infinitif." },
      ] },
    { id: "si-impersonale", niveau: 3, titre: "Le « si » impersonnel (on)",
      astuce: "si + verbe à la 3e personne = on. Avec un nom pluriel, le verbe se met au pluriel : si vendono case.",
      explication: `<b>si</b> + verbe à la 3e personne du singulier = « on » : <i>In Italia si mangia bene.</i><br>
        Si le verbe a un complément <b>pluriel</b>, il s'accorde : <i>Si vendono case</i> (des maisons sont à vendre).<br>
        Pour demander : <i>Come si dice « merci » in italiano?</i>`,
      pourquoi: "Le français utilise « on » ; l'italien utilise si. On le voit partout : sur les panneaux (Si affitta = à louer), dans les recettes et les règlements.",
      pieges: [["Uno mangia bene in Italia.", "In Italia si mangia bene.", "« On » général → si."], ["Si vende case.", "Si vendono case.", "Complément pluriel → verbe pluriel."]],
      exemples: [["Qui si parla italiano.", "Ici on parle italien."], ["Si affittano camere.", "Chambres à louer."], ["Non si sa mai.", "On ne sait jamais."]],
      exercices: [
        { q: "In Italia ___ mangia bene.", choix: ["si", "ci", "se"], fr: "En Italie on mange bien.", pourquoi: "« On » → si." },
        { q: "Qui si ___ case.", choix: ["vendono", "vende", "vendiamo"], fr: "Ici on vend des maisons.", pourquoi: "case est pluriel → vendono." },
        { q: "Come ___ dice « merci » in italiano?", choix: ["si", "ci", "se"], fr: "Comment dit-on « merci » en italien ?", pourquoi: "Question impersonnelle → si dice." },
        { q: "Non si ___ fumare qui.", choix: ["può", "possono", "puoi"], fr: "On ne peut pas fumer ici.", pourquoi: "Avec un infinitif, le verbe reste au singulier : si può." },
      ] },

    // ---------- PRO ----------
    { id: "lei-formale", niveau: 4, titre: "Le vouvoiement : Lei",
      astuce: "Lei (vous de politesse) + verbe à la 3e personne du singulier, même pour un homme. COD : La, COI : Le.",
      explication: `Pour vouvoyer une personne, l'italien utilise <b>Lei</b> (« elle ») avec le verbe à la <b>3e personne du singulier</b> : <i>Lei è italiano, signor Rossi?</i><br>
        Pronoms : <b>La</b> (vous, COD) · <b>Le</b> (à vous) · <b>Suo</b> (votre). La majuscule est une marque de respect à l'écrit.<br>
        Formules : <i>Mi scusi · Può ripetere? · La ringrazio · ArrivederLa.</i><br>
        Pour vouvoyer plusieurs personnes : <b>voi</b>.`,
      pourquoi: "Lei vient de « Votre Seigneurie » (Vostra Signoria), un mot féminin : on s'adresse à la « seigneurie » de la personne. D'où le féminin, même pour un homme : « La ringrazio, dottore ».",
      pieges: [["Signor Rossi, vuoi un caffè?", "Signor Rossi, vuole un caffè?", "Vouvoiement → 3e personne."], ["Lo ringrazio, dottore.", "La ringrazio, dottore.", "Avec Lei, le pronom reste La, même pour un homme."]],
      exemples: [["Come si chiama?", "Comment vous appelez-vous ?"], ["Posso aiutarLa?", "Puis-je vous aider ?"], ["Le mando i documenti.", "Je vous envoie les documents."]],
      exercices: [
        { q: "Signor Rossi, ___ un caffè?", choix: ["vuole", "vuoi", "volete"], fr: "Monsieur Rossi, voulez-vous un café ?", pourquoi: "Lei → 3e personne du singulier : vuole." },
        { q: "Signora, come ___ chiama?", choix: ["si", "ti", "vi"], fr: "Madame, comment vous appelez-vous ?", pourquoi: "Lei → pronom de 3e personne : si chiama." },
        { q: "Signora, mi ___, dov'è la stazione?", choix: ["scusi", "scusa", "scusate"], fr: "Madame, excusez-moi, où est la gare ?", pourquoi: "Vouvoiement → mi scusi (scusa = tutoiement)." },
        { q: "___ ringrazio, dottore.", choix: ["La", "Ti", "Lo"], fr: "Je vous remercie, docteur.", pourquoi: "COD de politesse = La, même pour un homme." },
      ] },
    { id: "congiuntivo-imperfetto", niveau: 4, titre: "Le subjonctif imparfait et les hypothèses",
      astuce: "Se + congiuntivo imperfetto (fossi, avessi, parlassi), condizionale (sarei, farei). Jamais de conditionnel après se.",
      explication: `Formation : -are → parl<b>assi</b>, -ere → prend<b>essi</b>, -ire → dorm<b>issi</b> (ssi, ssi, sse, ssimo, ste, ssero).<br>
        Irréguliers : essere → <b>fossi</b>, stare → stessi, dare → dessi, fare → facessi, dire → dicessi, bere → bevessi.<br>
        <b>Hypothèse irréelle</b> : <i>Se fossi ricco, comprerei una casa.</i><br>
        Après un verbe principal au passé ou au conditionnel : <i>Volevo che tu venissi.</i> · Souhait : <i>Magari fosse vero!</i>`,
      pourquoi: "En français on dit « si j'avais » (imparfait de l'indicatif). L'italien met le subjonctif imparfait : « se avessi ». La bonne nouvelle : comme en français, après se on ne met JAMAIS de conditionnel.",
      pieges: [["Se avrei tempo, verrei.", "Se avessi tempo, verrei.", "Après se : congiuntivo imperfetto, jamais le conditionnel."], ["Se ero ricco…", "Se fossi ricco…", "Pas d'imparfait de l'indicatif comme en français."]],
      exemples: [["Se avessi tempo, viaggerei di più.", "Si j'avais le temps, je voyagerais plus."], ["Magari fosse vero!", "Si seulement c'était vrai !"], ["Volevo che venissi.", "Je voulais que tu viennes."]],
      exercices: [
        { q: "Se ___ ricco, comprerei una casa.", choix: ["fossi", "sarei", "ero"], fr: "Si j'étais riche, j'achèterais une maison.", pourquoi: "Après se (irréel) → congiuntivo imperfetto : fossi." },
        { q: "Se avessi tempo, ___ in Italia.", choix: ["andrei", "andassi", "andrò"], fr: "Si j'avais le temps, j'irais en Italie.", pourquoi: "La conséquence → conditionnel : andrei." },
        { q: "Volevo che tu ___.", choix: ["venissi", "venga", "verrai"], fr: "Je voulais que tu viennes.", pourquoi: "Verbe principal au passé → congiuntivo imperfetto." },
        { q: "Magari ___ vero!", choix: ["fosse", "sia", "sarebbe"], fr: "Si seulement c'était vrai !", pourquoi: "Souhait irréel avec magari → congiuntivo imperfetto." },
        { q: "Se ___ di più, passeresti l'esame.", choix: ["studiassi", "studieresti", "studi"], fr: "Si tu étudiais plus, tu réussirais l'examen.", pourquoi: "Après se → studiassi." },
      ] },
    { id: "connettivi", niveau: 4, titre: "Les connecteurs de l'écrit professionnel",
      astuce: "tuttavia (cependant), pertanto (par conséquent), inoltre (de plus), in merito a (au sujet de), affinché + subjonctif (afin que).",
      explication: `Pour un e-mail ou un rapport :<br>
        <b>Opposition</b> : tuttavia, comunque, invece · <b>Conséquence</b> : pertanto, quindi, di conseguenza · <b>Ajout</b> : inoltre, peraltro<br>
        <b>Sujet</b> : in merito a, per quanto riguarda · <b>But</b> : affinché + congiuntivo, al fine di + infinitif · <b>Cause</b> : dal momento che, poiché.`,
      pourquoi: "Un écrit pro italien est souvent plus formel qu'en français. Ces connecteurs donnent tout de suite un ton professionnel et clair.",
      pieges: [["Ti scrivo affinché tu sai la verità.", "Ti scrivo affinché tu sappia la verità.", "affinché → congiuntivo."], ["Però tuttavia", "Tuttavia", "Ne pas cumuler deux connecteurs de même sens."]],
      exemples: [["In merito alla Sua richiesta, Le confermo la data.", "Au sujet de votre demande, je vous confirme la date."], ["Il prezzo è alto; tuttavia, la qualità è ottima.", "Le prix est élevé ; cependant, la qualité est excellente."]],
      exercices: [
        { q: "È tardi; ___, continuiamo domani.", choix: ["pertanto", "benché", "affinché"], fr: "Il est tard ; par conséquent, continuons demain.", pourquoi: "Conséquence → pertanto." },
        { q: "Ti scrivo ___ tu sappia la verità.", choix: ["affinché", "quindi", "inoltre"], fr: "Je t'écris afin que tu saches la vérité.", pourquoi: "But + subjonctif → affinché." },
        { q: "___ alla riunione, Le confermo la data.", choix: ["In merito", "Malgrado", "Inoltre"], fr: "Au sujet de la réunion, je vous confirme la date.", pourquoi: "« Au sujet de » → in merito a." },
        { q: "Il prezzo è alto; ___, la qualità è ottima.", choix: ["tuttavia", "quindi", "pertanto"], fr: "Le prix est élevé ; cependant, la qualité est excellente.", pourquoi: "Opposition → tuttavia." },
      ] },
    { id: "periodo-ipotetico", niveau: 4, titre: "Les trois types d'hypothèses",
      astuce: "Réel : se + présent → présent / futur. Possible : se + subjonctif imparfait → conditionnel. Irréel passé : se + subjonctif plus-que-parfait → conditionnel passé.",
      explication: `<b>1. Réel</b> : <i>Se piove, resto a casa.</i> (S'il pleut, je reste.)<br>
        <b>2. Possible / irréel présent</b> : <i>Se piovesse, resterei a casa.</i> (S'il pleuvait, je resterais.)<br>
        <b>3. Irréel du passé</b> : <i>Se avessi saputo, sarei venuto.</i> (Si j'avais su, je serais venu.) → se + <b>avessi / fossi + participe</b>, puis <b>avrei / sarei + participe</b>.`,
      pourquoi: "La structure est la même qu'en français ; seul le temps après se change (subjonctif au lieu de l'indicatif). Retiens « se avessi saputo » comme une formule.",
      pieges: [["Se avrei saputo, sarei venuto.", "Se avessi saputo, sarei venuto.", "Jamais de conditionnel après se."], ["Se piove, resterei a casa.", "Se piove, resto a casa.", "Hypothèse réelle → présent des deux côtés."]],
      exemples: [["Se vinco, festeggiamo.", "Si je gagne, on fait la fête."], ["Se potessi, partirei.", "Si je pouvais, je partirais."], ["Se l'avessi saputo, te l'avrei detto.", "Si je l'avais su, je te l'aurais dit."]],
      exercices: [
        { q: "Se piove, ___ a casa.", choix: ["resto", "resterei", "restassi"], fr: "S'il pleut, je reste à la maison.", pourquoi: "Hypothèse réelle (se + présent) → présent." },
        { q: "Se avessi saputo, ___ venuto.", choix: ["sarei", "ero", "fossi"], fr: "Si j'avais su, je serais venu.", pourquoi: "Irréel du passé → conditionnel passé : sarei venuto." },
        { q: "Se ___ saputo, te l'avrei detto.", choix: ["avessi", "avrei", "ho"], fr: "Si j'avais su, je te l'aurais dit.", pourquoi: "Après se → congiuntivo trapassato : avessi saputo." },
        { q: "Se vinco la lotteria, ___ un viaggio.", choix: ["farò", "farei", "facessi"], fr: "Si je gagne au loto, je ferai un voyage.", pourquoi: "se + présent → futur possible." },
      ] },

    // ---------- EXPERT ----------
    { id: "condizionale-passato", niveau: 5, titre: "Le conditionnel passé et le futur dans le passé",
      astuce: "avrei / sarei + participe. Pour le « futur dans le passé », l'italien utilise le conditionnel PASSÉ : ha detto che sarebbe venuto.",
      explication: `<b>Formation</b> : conditionnel de avere / essere + participe : <i>avrei fatto, sarei andato</i>.<br>
        <b>Regret</b> : <i>Avrei dovuto studiare.</i> (J'aurais dû étudier.)<br>
        <b>Futur dans le passé</b> : <i>Ha detto che <b>sarebbe venuto</b>.</i> = « Il a dit qu'il viendrait ».<br>
        ⚠️ Le français utilise ici le conditionnel présent (viendrait), l'italien le conditionnel <b>passé</b>.`,
      pourquoi: "C'est le piège n°1 des francophones de bon niveau : traduire « il a dit qu'il viendrait » par « ha detto che verrebbe » est une faute très repérable. L'italien considère que l'action future est vue depuis le passé, donc il « recule » au conditionnel passé.",
      pieges: [["Ha detto che verrebbe.", "Ha detto che sarebbe venuto.", "Futur dans le passé → conditionnel passé."], ["Pensavo che arriverebbe più tardi.", "Pensavo che sarebbe arrivato più tardi.", "Même règle après pensavo che, sapevo che…"]],
      exemples: [["Avrei voluto aiutarti.", "J'aurais voulu t'aider."], ["Mi ha promesso che avrebbe chiamato.", "Il m'a promis qu'il appellerait."], ["Sarei venuto volentieri.", "Je serais venu volontiers."]],
      exercices: [
        { q: "Ha detto che ___ il giorno dopo.", choix: ["sarebbe venuto", "verrebbe", "verrà"], fr: "Il a dit qu'il viendrait le lendemain.", pourquoi: "Futur dans le passé → conditionnel passé (différent du français)." },
        { q: "Al tuo posto, ___ accettato.", choix: ["avrei", "avessi", "avrò"], fr: "À ta place, j'aurais accepté.", pourquoi: "Conditionnel passé : avrei + participe." },
        { q: "Sarei ___ volentieri.", choix: ["venuto", "venire", "venissi"], fr: "Je serais venu volontiers.", pourquoi: "sarei + participe passé." },
        { q: "Pensavo che ___ più tardi.", choix: ["sarebbe arrivato", "arriverebbe", "arriva"], fr: "Je pensais qu'il arriverait plus tard.", pourquoi: "Futur vu du passé → conditionnel passé." },
      ] },
    { id: "passato-remoto", niveau: 5, titre: "Le passé simple (passato remoto)",
      astuce: "Temps du récit historique et littéraire : fu (il fut), ebbe (il eut), nacque, disse, fece, vide.",
      explication: `Le <b>passato remoto</b> raconte des faits lointains et terminés : histoire, littérature, contes. Dans le Sud de l'Italie, on l'utilise aussi à l'oral.<br>
        Réguliers : parl<b>ai</b>, parl<b>asti</b>, parl<b>ò</b>, parl<b>ammo</b>, parl<b>aste</b>, parl<b>arono</b>.<br>
        Irréguliers à reconnaître : essere → <b>fu</b>, avere → <b>ebbe</b>, fare → <b>fece</b>, dire → <b>disse</b>, vedere → <b>vide</b>, nascere → <b>nacque</b>, venire → <b>venne</b>.`,
      pourquoi: "Tu n'as pas besoin de beaucoup le produire, mais tu dois le reconnaître pour lire un livre, un article d'histoire ou une biographie. Comme notre passé simple !",
      pieges: [["Ieri andai al cinema (en Italie du Nord, à l'oral).", "Ieri sono andato al cinema.", "Pour un fait récent à l'oral : passato prossimo."], ["Dante nasceva nel 1265.", "Dante nacque nel 1265.", "Fait historique ponctuel → passato remoto."]],
      exemples: [["Garibaldi sbarcò in Sicilia nel 1860.", "Garibaldi débarqua en Sicile en 1860."], ["C'era una volta un re che ebbe tre figli.", "Il était une fois un roi qui eut trois fils."], ["Fu un grande successo.", "Ce fut un grand succès."]],
      exercices: [
        { q: "Dante ___ a Firenze nel 1265.", choix: ["nacque", "nasceva", "nasce"], fr: "Dante naquit à Florence en 1265.", pourquoi: "Fait historique ponctuel → passato remoto." },
        { q: "Garibaldi ___ in Sicilia nel 1860.", choix: ["sbarcò", "sbarcava", "sbarcherà"], fr: "Garibaldi débarqua en Sicile en 1860.", pourquoi: "-are → -ò à la 3e personne du passato remoto." },
        { q: "« Fu » vient du verbe…", choix: ["essere", "fare", "fumare"], fr: "« Fu » = il fut", pourquoi: "fu est le passato remoto de essere." },
        { q: "« Disse » vient du verbe…", choix: ["dire", "disporre", "dovere"], fr: "« Disse » = il dit", pourquoi: "dire → disse au passato remoto." },
        { q: "« Ebbe » vient du verbe…", choix: ["avere", "essere", "bere"], fr: "« Ebbe » = il eut", pourquoi: "avere → ebbe au passato remoto." },
      ] },
    { id: "passivo", niveau: 5, titre: "La voix passive (essere, venire, andare)",
      astuce: "essere ou venire + participe (accordé) ; da pour l'auteur. andare + participe = obligation (va fatto = il faut le faire).",
      explication: `<b>essere + participe</b> : <i>Il libro è stato scritto da Calvino.</i><br>
        <b>venire + participe</b> (seulement aux temps simples) insiste sur l'action : <i>La lettera verrà spedita domani.</i><br>
        <b>andare + participe</b> = obligation : <i>Questo lavoro va fatto subito.</i> (doit être fait).<br>
        Le participe s'accorde toujours avec le sujet. L'auteur s'introduit avec <b>da</b>.`,
      pourquoi: "Le français n'a qu'un passif (être + participe). L'italien en a trois, avec des nuances : venire pour l'action, andare pour l'obligation. Les maîtriser donne un style très naturel à l'écrit.",
      pieges: [["Il libro è stato scritto per Calvino.", "Il libro è stato scritto da Calvino.", "L'auteur → da."], ["La lettera è venuta spedita ieri.", "La lettera è stata spedita ieri.", "venire ne s'utilise pas aux temps composés."]],
      exemples: [["La Gioconda fu dipinta da Leonardo.", "La Joconde fut peinte par Léonard."], ["Il pacco verrà consegnato domani.", "Le colis sera livré demain."], ["Le regole vanno rispettate.", "Les règles doivent être respectées."]],
      exercices: [
        { q: "Il libro ___ scritto da Calvino.", choix: ["è stato", "ha", "ha stato"], fr: "Le livre a été écrit par Calvino.", pourquoi: "Passif au passé composé : è stato + participe." },
        { q: "La lettera ___ spedita domani.", choix: ["verrà", "avrà", "ha"], fr: "La lettre sera envoyée demain.", pourquoi: "Passif avec venire au futur : verrà spedita." },
        { q: "Questo lavoro va ___ subito.", choix: ["fatto", "fare", "facendo"], fr: "Ce travail doit être fait tout de suite.", pourquoi: "andare + participe = obligation." },
        { q: "La riunione è ___ rinviata.", choix: ["stata", "venuta", "andata"], fr: "La réunion a été reportée.", pourquoi: "Aux temps composés, seul essere marche : è stata rinviata." },
      ] },
    { id: "discorso-indiretto", niveau: 5, titre: "Le discours indirect et la concordance des temps",
      astuce: "Avec un verbe au passé : présent → imparfait, passé composé → plus-que-parfait, futur → conditionnel passé.",
      explication: `Pour rapporter des paroles avec <i>ha detto che…</i> :<br>
        présent → <b>imperfetto</b> : « Sono stanco » → <i>Ha detto che era stanco.</i><br>
        passato prossimo → <b>trapassato</b> : « Ho finito » → <i>Ha detto che aveva finito.</i><br>
        futur → <b>condizionale passato</b> : « Verrò » → <i>Ha detto che sarebbe venuto.</i><br>
        Question : <i>Mi ha chiesto se venivo da Parigi.</i>`,
      pourquoi: "C'est presque la même concordance qu'en français, avec une exception de taille : le futur devient conditionnel PASSÉ (sarebbe venuto), et non conditionnel présent comme chez nous.",
      pieges: [["Ha detto che verrà.", "Ha detto che sarebbe venuto.", "Futur rapporté au passé → conditionnel passé."], ["Ha detto che è stanco (hier).", "Ha detto che era stanco.", "Présent rapporté au passé → imparfait."]],
      exemples: [["Marco ha detto che era stanco.", "Marco a dit qu'il était fatigué."], ["Mi ha detto che aveva già mangiato.", "Il m'a dit qu'il avait déjà mangé."], ["Ha promesso che sarebbe tornata.", "Elle a promis qu'elle reviendrait."]],
      exercices: [
        { q: "« Sono stanco. » → Marco ha detto che ___ stanco.", choix: ["era", "è stato", "sarà"], fr: "Marco a dit qu'il était fatigué.", pourquoi: "Présent → imperfetto." },
        { q: "« Ho finito. » → Ha detto che ___ finito.", choix: ["aveva", "ha", "avrebbe"], fr: "Il a dit qu'il avait fini.", pourquoi: "Passato prossimo → trapassato." },
        { q: "« Verrò. » → Ha detto che ___.", choix: ["sarebbe venuto", "verrà", "veniva"], fr: "Il a dit qu'il viendrait.", pourquoi: "Futur → conditionnel passé." },
        { q: "Mi ha chiesto se ___ da Parigi.", choix: ["venivo", "vengo", "verrò"], fr: "Il m'a demandé si je venais de Paris.", pourquoi: "Question rapportée au passé : présent → imperfetto." },
      ] },
  );
})();
