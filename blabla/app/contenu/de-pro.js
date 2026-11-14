// Contenu ALLEMAND de Jack Blabla — niveaux 3 (Avancé, B2), 4 (Pro, B2–C1) et 5 (Expert, C1).
// Chargé après contenu/de.js : il AJOUTE des cours, il ne remplace rien.
// Exercices : le PREMIER choix est toujours la bonne réponse (ils sont mélangés à l'affichage).

(() => {
  const de = CONTENU.de;

  de.temps.push(
    { id: "plusquamperfekt", nom: "Plusquamperfekt (hatte gemacht)", niveau: 3 },
    { id: "konjunktiv", nom: "Konjunktiv II (würde / wäre / hätte)", niveau: 4 },
  );

  // Konjunktiv II : ces verbes ont leur propre forme (on ne dit pas « würde sein » mais « wäre »)
  const K2 = {
    sein: ["wäre", "wärst", "wäre", "wären", "wärt", "wären"],
    haben: ["hätte", "hättest", "hätte", "hätten", "hättet", "hätten"],
    können: ["könnte", "könntest", "könnte", "könnten", "könntet", "könnten"],
    müssen: ["müsste", "müsstest", "müsste", "müssten", "müsstet", "müssten"],
    wollen: ["wollte", "wolltest", "wollte", "wollten", "wolltet", "wollten"],
    werden: ["würde", "würdest", "würde", "würden", "würdet", "würden"],
    wissen: ["wüsste", "wüsstest", "wüsste", "wüssten", "wüsstet", "wüssten"],
  };
  de.verbes.forEach((v) => { if (K2[v.inf]) v.formes = { ...(v.formes || {}), konjunktiv: K2[v.inf] }; });

  // Verbes réguliers : le moteur les conjugue tout seul.
  de.verbes.push(
    { inf: "planen", fr: "planifier", niveau: 3, participe: "geplant" },
    { inf: "organisieren", fr: "organiser", niveau: 3, participe: "organisiert" },
    { inf: "präsentieren", fr: "présenter", niveau: 4, participe: "präsentiert" },
    { inf: "verhandeln", fr: "négocier", niveau: 4, participe: "verhandelt", formes: { praesens: ["verhandle", "verhandelst", "verhandelt", "verhandeln", "verhandelt", "verhandeln"] } },
    { inf: "erreichen", fr: "atteindre", niveau: 5, participe: "erreicht" },
    { inf: "überzeugen", fr: "convaincre", niveau: 5, participe: "überzeugt" },
  );

  de.irreguliers.lignes.push(
    // [infinitif, présent (er), prétérit, passé composé, français, niveau]
    ["bitten", "bittet", "bat", "hat gebeten", "demander, prier", 3], ["bringen", "bringt", "brachte", "hat gebracht", "apporter", 3],
    ["entscheiden", "entscheidet", "entschied", "hat entschieden", "décider", 3], ["helfen", "hilft", "half", "hat geholfen", "aider", 3],
    ["laufen", "läuft", "lief", "ist gelaufen", "courir, marcher", 3], ["liegen", "liegt", "lag", "hat gelegen", "être couché", 3],
    ["beginnen", "beginnt", "begann", "hat begonnen", "commencer", 4], ["bieten", "bietet", "bot", "hat geboten", "offrir", 4],
    ["empfehlen", "empfiehlt", "empfahl", "hat empfohlen", "recommander", 4], ["gewinnen", "gewinnt", "gewann", "hat gewonnen", "gagner", 4],
    ["steigen", "steigt", "stieg", "ist gestiegen", "monter, augmenter", 4], ["verlieren", "verliert", "verlor", "hat verloren", "perdre", 4],
    ["vergleichen", "vergleicht", "verglich", "hat verglichen", "comparer", 5], ["beschließen", "beschließt", "beschloss", "hat beschlossen", "décider (officiellement)", 5],
    ["unterschreiben", "unterschreibt", "unterschrieb", "hat unterschrieben", "signer", 5], ["zwingen", "zwingt", "zwang", "hat gezwungen", "forcer", 5],
  );

  de.themes.push(
    // ---------- AVANCÉ (B2) ----------
    { id: "debat", niveau: 3, titre: "Débattre et argumenter", emoji: "🗣️",
      mots: [["À mon avis", "Meiner Meinung nach"], ["Je suis d'accord", "Ich bin einverstanden"], ["Je ne suis pas d'accord", "Ich bin anderer Meinung"], ["D'un côté… de l'autre", "Einerseits… andererseits"],
        ["Il est vrai que", "Es stimmt, dass"], ["Cependant", "Allerdings"], ["Un argument", "Ein Argument"], ["Une preuve", "Ein Beweis"],
        ["Convaincre", "Überzeugen"], ["Un point de vue", "Ein Standpunkt"], ["Je vois ce que tu veux dire", "Ich verstehe, was du meinst"], ["Ça dépend", "Das kommt darauf an"]],
      dialogue: [
        { who: "jack", txt: "Sind soziale Medien gut für junge Leute?", fr: "Les réseaux sociaux sont-ils bons pour les jeunes ?" },
        { who: "toi", choices: ["Einerseits verbinden sie Menschen, andererseits machen sie süchtig.", "Einerseits sie verbinden Menschen, andererseits sie machen süchtig.", "Ja, weil nein."], fr: "D'un côté ils relient les gens, de l'autre ils rendent accro." },
        { who: "jack", txt: "Gutes Argument. Hast du Beweise?", fr: "Bon argument. As-tu des preuves ?" },
        { who: "toi", choices: ["Mehrere Studien zeigen, dass Jugendliche weniger schlafen.", "Mehrere Studien zeigen, dass Jugendliche schlafen weniger.", "Ich habe viele Beweis."], fr: "Plusieurs études montrent que les ados dorment moins." },
      ] },
    { id: "medias", niveau: 3, titre: "Médias et technologie", emoji: "📱",
      mots: [["Les informations", "Die Nachrichten"], ["Un article", "Ein Artikel"], ["Une source fiable", "Eine zuverlässige Quelle"], ["Les fausses informations", "Falschmeldungen"],
        ["Télécharger", "Herunterladen"], ["Mettre à jour", "Aktualisieren"], ["Un mot de passe", "Ein Passwort"], ["Les données", "Die Daten"],
        ["L'intelligence artificielle", "Die künstliche Intelligenz"], ["Un appareil", "Ein Gerät"], ["En ligne", "Online"], ["Partager", "Teilen"]],
      dialogue: [
        { who: "jack", txt: "Wo informierst du dich normalerweise?", fr: "Où t'informes-tu d'habitude ?" },
        { who: "toi", choices: ["Meistens in Online-Zeitungen und Podcasts.", "Meistens in Online-Zeitungen gestern.", "Ich informiere mich mit mein Handy."], fr: "Surtout dans les journaux en ligne et les podcasts." },
        { who: "jack", txt: "Und woher weißt du, ob eine Quelle zuverlässig ist?", fr: "Et comment sais-tu si une source est fiable ?" },
        { who: "toi", choices: ["Ich prüfe, ob andere Medien dasselbe berichten.", "Ich prüfe, ob andere Medien berichten dasselbe.", "Weil es im Internet ist."], fr: "Je vérifie si d'autres médias disent la même chose." },
      ] },
    { id: "environnement", niveau: 3, titre: "Environnement et sciences", emoji: "🌍",
      mots: [["Le changement climatique", "Der Klimawandel"], ["Les énergies renouvelables", "Erneuerbare Energien"], ["Réduire", "Reduzieren"], ["Recycler", "Recyceln"],
        ["Les déchets", "Der Müll"], ["Une espèce menacée", "Eine bedrohte Art"], ["Une découverte", "Eine Entdeckung"], ["Une expérience (scientifique)", "Ein Experiment"],
        ["Un chercheur", "Ein Forscher"], ["Durable", "Nachhaltig"], ["L'empreinte carbone", "Der CO₂-Fußabdruck"], ["Économiser l'énergie", "Energie sparen"]] },
    { id: "verbes-prep", niveau: 3, titre: "Verbes avec préposition", emoji: "🧩",
      mots: [["Attendre (quelque chose)", "Warten auf"], ["Se réjouir de (à venir)", "Sich freuen auf"], ["Se réjouir de (présent)", "Sich freuen über"], ["S'intéresser à", "Sich interessieren für"],
        ["Penser à", "Denken an"], ["Parler de", "Sprechen über"], ["Participer à", "Teilnehmen an"], ["Dépendre de", "Abhängen von"],
        ["S'occuper de", "Sich kümmern um"], ["Demander (quelque chose)", "Bitten um"], ["Se plaindre de", "Sich beschweren über"], ["S'habituer à", "Sich gewöhnen an"]],
      dialogue: [
        { who: "jack", txt: "Freust du dich auf den Urlaub?", fr: "Tu te réjouis des vacances ?" },
        { who: "toi", choices: ["Ja, ich freue mich sehr darauf!", "Ja, ich freue mich sehr davon!", "Ja, ich freue sehr auf."], fr: "Oui, je m'en réjouis beaucoup !" },
        { who: "jack", txt: "Und wofür interessierst du dich dort?", fr: "Et à quoi t'intéresses-tu là-bas ?" },
        { who: "toi", choices: ["Ich interessiere mich für Geschichte.", "Ich interessiere mich an Geschichte.", "Ich interessiere für die Geschichte mich."], fr: "Je m'intéresse à l'histoire." },
      ] },

    // ---------- PRO (B2–C1) ----------
    { id: "emails", niveau: 4, titre: "Les e-mails professionnels", emoji: "✉️",
      mots: [["Madame, Monsieur,", "Sehr geehrte Damen und Herren,"], ["Suite à notre conversation", "Bezugnehmend auf unser Gespräch"], ["Veuillez trouver ci-joint", "Im Anhang finden Sie"], ["Je vous écris au sujet de", "Ich schreibe Ihnen bezüglich"],
        ["N'hésitez pas à me contacter", "Bei Fragen stehe ich Ihnen gern zur Verfügung"], ["Dans l'attente de votre réponse", "Ich freue mich auf Ihre Antwort"], ["Cordialement", "Mit freundlichen Grüßen"], ["Pour rappel", "Zur Erinnerung"],
        ["Je vous serais reconnaissant de", "Ich wäre Ihnen dankbar, wenn"], ["Désolé pour le retard", "Entschuldigen Sie die späte Antwort"], ["Mettre en copie", "In Kopie setzen"], ["Faire suivre", "Weiterleiten"]],
      dialogue: [
        { who: "jack", txt: "Wie beginnst du eine formelle E-Mail an Unbekannte?", fr: "Comment commences-tu un mail formel à des inconnus ?" },
        { who: "toi", choices: ["Sehr geehrte Damen und Herren, ich schreibe Ihnen bezüglich Ihres Angebots.", "Hallo Leute, ich schreibe euch wegen Angebot.", "Sehr geehrte Damen und Herren, ich schreibe dir über dein Angebot."], fr: "Madame, Monsieur, je vous écris au sujet de votre offre." },
        { who: "jack", txt: "Und wie beendest du sie?", fr: "Et comment la termines-tu ?" },
        { who: "toi", choices: ["Ich freue mich auf Ihre Antwort. Mit freundlichen Grüßen", "Ich freue mich über deine Antwort. Tschüss", "Warte auf Antwort. Küsse"], fr: "Dans l'attente de votre réponse. Cordialement" },
      ] },
    { id: "reunions", niveau: 4, titre: "Les réunions", emoji: "🧑‍💼",
      mots: [["L'ordre du jour", "Die Tagesordnung"], ["Le compte rendu", "Das Protokoll"], ["Commençons", "Fangen wir an"], ["Passons au point suivant", "Kommen wir zum nächsten Punkt"],
        ["Puis-je ajouter quelque chose ?", "Darf ich kurz etwas ergänzen?"], ["Pour résumer", "Zusammenfassend"], ["Une date limite", "Eine Frist"], ["Respecter le délai", "Die Frist einhalten"],
        ["Prendre une décision", "Eine Entscheidung treffen"], ["Faire le point", "Eine Bilanz ziehen"], ["Être d'accord", "Sich einig sein"], ["Reporter la réunion", "Die Besprechung verschieben"]],
      dialogue: [
        { who: "jack", txt: "Guten Morgen zusammen. Wollen wir anfangen?", fr: "Bonjour à tous. On commence ?" },
        { who: "toi", choices: ["Ja. Der erste Punkt auf der Tagesordnung ist das Budget.", "Ja. Erste Punkt auf die Tagesordnung ist Budget.", "Ja, wir fangen gestern an."], fr: "Oui. Le premier point à l'ordre du jour est le budget." },
        { who: "jack", txt: "Können wir die Frist am Freitag einhalten?", fr: "Pouvons-nous tenir le délai de vendredi ?" },
        { who: "toi", choices: ["Ich fürchte, wir brauchen noch zwei Tage.", "Ich fürchte, wir zwei Tage noch brauchen.", "Nein, wir sind spät zwei Tage."], fr: "Je crains qu'il nous faille encore deux jours." },
      ] },
    { id: "telephone", niveau: 4, titre: "Téléphone et visio", emoji: "📞",
      mots: [["Qui est à l'appareil ?", "Wer spricht da, bitte?"], ["Ne quittez pas", "Bleiben Sie bitte dran"], ["Je vous le passe", "Ich verbinde Sie"], ["Puis-je laisser un message ?", "Kann ich eine Nachricht hinterlassen?"],
        ["Je vous rappelle", "Ich rufe Sie zurück"], ["Vous coupez", "Die Verbindung bricht ab"], ["Votre micro est coupé", "Sie sind stummgeschaltet"], ["Partager l'écran", "Den Bildschirm teilen"],
        ["Pouvez-vous répéter ?", "Könnten Sie das wiederholen?"], ["La connexion est mauvaise", "Die Verbindung ist schlecht"], ["Une visioconférence", "Eine Videokonferenz"], ["Raccrocher", "Auflegen"]],
      dialogue: [
        { who: "jack", txt: "Firma Müller, Jack am Apparat. Was kann ich für Sie tun?", fr: "Société Müller, Jack à l'appareil. Que puis-je pour vous ?" },
        { who: "toi", choices: ["Guten Tag, könnte ich bitte Frau Schmidt sprechen?", "Guten Tag, ich will Frau Schmidt sprechen jetzt.", "Hallo, gib mir Frau Schmidt."], fr: "Bonjour, pourrais-je parler à Mme Schmidt ?" },
        { who: "jack", txt: "Sie ist leider in einer Besprechung. Möchten Sie eine Nachricht hinterlassen?", fr: "Elle est malheureusement en réunion. Voulez-vous laisser un message ?" },
        { who: "toi", choices: ["Ja, sie soll mich bitte zurückrufen.", "Ja, sie soll mich zurückrufen gestern.", "Ja, sie mich zurückruft bitte."], fr: "Oui, qu'elle me rappelle, s'il vous plaît." },
      ] },
    { id: "presenter", niveau: 4, titre: "Présenter et négocier", emoji: "📊",
      mots: [["Je vais vous présenter", "Ich möchte Ihnen vorstellen"], ["Comme vous pouvez le voir", "Wie Sie sehen können"], ["Une hausse", "Ein Anstieg"], ["Une baisse", "Ein Rückgang"],
        ["Le chiffre d'affaires", "Der Umsatz"], ["La rentabilité", "Die Rentabilität"], ["Faire une offre", "Ein Angebot machen"], ["Un compromis", "Ein Kompromiss"],
        ["Nous pourrions envisager", "Wir könnten uns vorstellen"], ["C'est notre dernier prix", "Das ist unser letztes Angebot"], ["Conclure un accord", "Einen Vertrag abschließen"], ["Une remise", "Ein Rabatt"]],
      dialogue: [
        { who: "jack", txt: "Ihr Preis ist uns zu hoch.", fr: "Votre prix est trop élevé pour nous." },
        { who: "toi", choices: ["Wir könnten Ihnen einen Rabatt geben, wenn Sie mehr bestellen.", "Wir könnten Ihnen geben einen Rabatt, wenn Sie bestellen mehr.", "Okay, dann ist es gratis."], fr: "Nous pourrions vous accorder une remise si vous commandez plus." },
        { who: "jack", txt: "Zehn Prozent für fünfhundert Stück?", fr: "Dix pour cent pour cinq cents pièces ?" },
        { who: "toi", choices: ["Einverstanden. Dann schließen wir den Vertrag ab.", "Einverstanden. Dann wir schließen ab den Vertrag.", "Ja, wir schlossen gestern."], fr: "D'accord. Alors concluons le contrat." },
      ] },

    // ---------- EXPERT (C1) ----------
    { id: "faux-amis", niveau: 5, titre: "Les faux amis (pièges)", emoji: "⚠️",
      mots: [["Recevoir (≠ devenir)", "Bekommen"], ["Devenir", "Werden"], ["Un téléphone portable", "Das Handy"], ["Une note (école)", "Eine Note"],
        ["Un billet (≠ une note)", "Ein Schein"], ["Le chef (patron)", "Der Chef"], ["Sensible (émotif)", "Empfindlich"], ["Raisonnable", "Vernünftig"],
        ["En ce moment (≠ eventuell = peut-être)", "Zurzeit"], ["Finalement", "Schließlich"], ["La gare", "Der Bahnhof"], ["Le rendez-vous (médecin)", "Der Termin"]] },
    { id: "registres", niveau: 5, titre: "Nuances et registres", emoji: "🎚️",
      mots: [["Obtenir (soutenu)", "Erhalten"], ["Commencer (soutenu)", "Beginnen"], ["Aider (soutenu)", "Unterstützen"], ["Se renseigner", "Sich erkundigen"],
        ["Pour autant que je sache", "Soweit ich weiß"], ["Il semblerait que", "Es scheint, dass"], ["Sans aucun doute", "Zweifellos"], ["Dans une certaine mesure", "In gewissem Maße"],
        ["Quoi qu'il en soit", "Wie dem auch sei"], ["En revanche", "Hingegen"], ["Néanmoins", "Dennoch"], ["Par conséquent", "Folglich"]],
      dialogue: [
        { who: "jack", txt: "War das Projekt ein Erfolg?", fr: "Le projet a-t-il été un succès ?" },
        { who: "toi", choices: ["In gewissem Maße ja, obwohl die Kosten etwas höher waren als geplant.", "In gewissem Maße ja, obwohl die Kosten waren etwas höher als geplant.", "Ja total, nie Problem."], fr: "Dans une certaine mesure oui, même si les coûts ont été un peu plus élevés que prévu." },
        { who: "jack", txt: "Würden Sie empfehlen weiterzumachen?", fr: "Recommanderiez-vous de continuer ?" },
        { who: "toi", choices: ["Dennoch wäre es sinnvoll, zuerst das Budget zu prüfen.", "Dennoch es wäre sinnvoll, zuerst das Budget prüfen.", "Ich empfehle weitermachen zu."], fr: "Néanmoins, il serait judicieux de vérifier d'abord le budget." },
      ] },
    { id: "nomen-verb", niveau: 5, titre: "Expressions nom + verbe", emoji: "🧱",
      mots: [["Prendre une décision", "Eine Entscheidung treffen"], ["Prendre en considération", "In Betracht ziehen"], ["Poser une question", "Eine Frage stellen"], ["Faire une demande", "Einen Antrag stellen"],
        ["Mettre en œuvre", "In die Tat umsetzen"], ["Entrer en vigueur", "In Kraft treten"], ["Faire des progrès", "Fortschritte machen"], ["Tenir compte de", "Rücksicht nehmen auf"],
        ["Être remis en question", "In Frage gestellt werden"], ["Prendre position", "Stellung nehmen"], ["Exercer une influence", "Einfluss nehmen"], ["Mener à bien", "Zum Abschluss bringen"]] },
    { id: "management", niveau: 5, titre: "Leadership et management", emoji: "🧭",
      mots: [["Déléguer", "Delegieren"], ["Motiver une équipe", "Ein Team motivieren"], ["Un retour (avis)", "Das Feedback"], ["Fixer des objectifs", "Ziele setzen"],
        ["Un indicateur clé", "Eine Kennzahl"], ["La prise de décision", "Die Entscheidungsfindung"], ["Responsabiliser", "Verantwortung übertragen"], ["Gérer un conflit", "Einen Konflikt lösen"],
        ["Un entretien annuel", "Ein Mitarbeitergespräch"], ["Une stratégie", "Eine Strategie"], ["Prendre du recul", "Abstand gewinnen"], ["Un cadre dirigeant", "Eine Führungskraft"]],
      dialogue: [
        { who: "jack", txt: "Ein Mitarbeiter hält ständig Fristen nicht ein. Was tun Sie?", fr: "Un collaborateur ne tient jamais les délais. Que faites-vous ?" },
        { who: "toi", choices: ["Ich würde unter vier Augen mit ihm sprechen und ihm konstruktives Feedback geben.", "Ich würde mit ihm sprechen unter vier Augen und geben ihm Feedback.", "Ich kündige ihn morgen."], fr: "Je lui parlerais en tête-à-tête et lui ferais un retour constructif." },
        { who: "jack", txt: "Und danach?", fr: "Et ensuite ?" },
        { who: "toi", choices: ["Wir würden gemeinsam klare Ziele setzen und jede Woche Bilanz ziehen.", "Wir würden setzen klare Ziele gemeinsam und Bilanz ziehen jede Woche.", "Danach nichts."], fr: "Nous fixerions ensemble des objectifs clairs et ferions le point chaque semaine." },
      ] },
  );

  de.grammaire.push(
    // ---------- AVANCÉ (B2) ----------
    { id: "plusquamperfekt", niveau: 3, titre: "Le Plusquamperfekt (plus-que-parfait)",
      explication: `Pour une action <b>antérieure</b> à une autre action passée : <b>hatte</b> ou <b>war</b> + participe (même choix d'auxiliaire qu'au Perfekt).<br>
        <i>Als ich ankam, <b>war</b> der Zug schon <b>abgefahren</b>.</i> · <i>Nachdem er <b>gegessen hatte</b>, ging er.</i><br>
        <b>nachdem</b> (après que) est presque toujours suivi du Plusquamperfekt.`,
      exemples: [["Ich hatte das schon gesehen.", "Je l'avais déjà vu."], ["Sie war schon gegangen.", "Elle était déjà partie."], ["Nachdem wir gegessen hatten, gingen wir spazieren.", "Après avoir mangé, nous sommes allés nous promener."]],
      exercices: [
        { q: "Als wir ankamen, ___ der Film schon begonnen.", choix: ["hatte", "war", "hat"], fr: "Quand nous sommes arrivés, le film avait déjà commencé." },
        { q: "Sie ___ schon nach Hause gegangen.", choix: ["war", "hatte", "ist"], fr: "Elle était déjà rentrée à la maison." },
        { q: "Nachdem er die E-Mail ___ hatte, rief er an.", choix: ["geschrieben", "schreiben", "schrieb"], fr: "Après avoir écrit le mail, il a appelé." },
        { q: "Ich ___ ihn vorher nie gesehen.", choix: ["hatte", "war", "habe gestern"], fr: "Je ne l'avais jamais vu avant." },
        { q: "Wir ___ zu spät gekommen.", choix: ["waren", "hatten", "haben gestern"], fr: "Nous étions arrivés trop tard." },
      ] },
    { id: "wechselpraepositionen", niveau: 3, titre: "Prépositions mixtes : accusatif ou datif ?",
      explication: `<b>in, an, auf, über, unter, vor, hinter, neben, zwischen</b> :<br>
        • <b>Wohin ?</b> (mouvement, changement de lieu) → <b>accusatif</b> : <i>Ich lege das Buch <b>auf den</b> Tisch.</i><br>
        • <b>Wo ?</b> (position, sans déplacement) → <b>datif</b> : <i>Das Buch liegt <b>auf dem</b> Tisch.</i><br>
        Verbes de mouvement : legen, stellen, hängen, gehen · de position : liegen, stehen, hängen, sein.`,
      exemples: [["Ich gehe in die Stadt.", "Je vais en ville."], ["Ich bin in der Stadt.", "Je suis en ville."], ["Er hängt das Bild an die Wand.", "Il accroche le tableau au mur."]],
      exercices: [
        { q: "Ich lege das Handy auf ___ Tisch.", choix: ["den", "dem", "der"], fr: "Je pose le portable sur la table." },
        { q: "Das Handy liegt auf ___ Tisch.", choix: ["dem", "den", "die"], fr: "Le portable est sur la table." },
        { q: "Wir gehen in ___ Büro.", choix: ["das", "dem", "der"], fr: "Nous allons au bureau." },
        { q: "Wir arbeiten in ___ Büro.", choix: ["dem", "das", "den"], fr: "Nous travaillons au bureau." },
        { q: "Sie stellt die Flasche in ___ Kühlschrank.", choix: ["den", "dem", "der"], fr: "Elle met la bouteille dans le frigo." },
      ] },
    { id: "konnektoren", niveau: 3, titre: "Les connecteurs et la place du verbe",
      explication: `Trois familles :<br>
        • <b>und, aber, oder, denn, sondern</b> → ne changent rien : <i>Ich bleibe, <b>denn</b> ich <b>bin</b> müde.</i><br>
        • <b>weil, dass, obwohl, wenn, als, ob</b> → verbe <b>à la fin</b> : <i>…, <b>obwohl</b> ich müde <b>bin</b>.</i><br>
        • <b>deshalb, trotzdem, dann, außerdem</b> → verbe <b>juste après</b> : <i><b>Deshalb bleibe</b> ich.</i>`,
      exemples: [["Ich komme nicht, weil ich krank bin.", "Je ne viens pas parce que je suis malade."], ["Es regnet, trotzdem gehen wir raus.", "Il pleut, nous sortons quand même."], ["Er arbeitet viel, obwohl er müde ist.", "Il travaille beaucoup, bien qu'il soit fatigué."]],
      exercices: [
        { q: "Ich lerne Deutsch, weil ich in Berlin ___.", choix: ["arbeiten möchte", "möchte arbeiten", "arbeite möchte"], fr: "J'apprends l'allemand parce que je veux travailler à Berlin." },
        { q: "Es ist spät. Deshalb ___ ich nach Hause.", choix: ["gehe", "ich gehe", "gehen"], fr: "Il est tard. C'est pourquoi je rentre." },
        { q: "Er kommt, ___ er keine Zeit hat.", choix: ["obwohl", "trotzdem", "deshalb"], fr: "Il vient, bien qu'il n'ait pas le temps." },
        { q: "Ich bleibe zu Hause, ___ ich bin krank.", choix: ["denn", "weil", "deshalb"], fr: "Je reste à la maison, car je suis malade." },
        { q: "Ich weiß nicht, ___ er heute kommt.", choix: ["ob", "wenn", "dass ob"], fr: "Je ne sais pas s'il vient aujourd'hui." },
      ] },
    { id: "zu-infinitiv", niveau: 3, titre: "L'infinitif avec zu et um … zu",
      explication: `Après beaucoup de verbes et d'expressions, l'infinitif se construit avec <b>zu</b> à la fin : <i>Ich habe vor, nach Berlin <b>zu fahren</b>.</i><br>
        Verbes à particule : zu se glisse au milieu → <i>an<b>zu</b>rufen</i>, <i>ein<b>zu</b>kaufen</i>.<br>
        <b>um … zu</b> = pour (but) : <i>Ich lerne Deutsch, <b>um</b> in Wien <b>zu arbeiten</b>.</i> ⚠️ Pas de zu après les modaux (können, müssen…).`,
      exemples: [["Es ist wichtig, pünktlich zu sein.", "Il est important d'être ponctuel."], ["Vergiss nicht, mich anzurufen!", "N'oublie pas de m'appeler !"], ["Er spart, um ein Auto zu kaufen.", "Il économise pour acheter une voiture."]],
      exercices: [
        { q: "Ich habe keine Lust, heute ___.", choix: ["zu arbeiten", "arbeiten", "zu arbeite"], fr: "Je n'ai pas envie de travailler aujourd'hui." },
        { q: "Vergiss nicht, den Kunden ___!", choix: ["anzurufen", "zu anrufen", "anrufen zu"], fr: "N'oublie pas d'appeler le client !" },
        { q: "Ich lerne, ___ die Prüfung zu bestehen.", choix: ["um", "für", "damit zu"], fr: "J'étudie pour réussir l'examen." },
        { q: "Ich kann heute nicht ___.", choix: ["kommen", "zu kommen", "kommen zu"], fr: "Je ne peux pas venir aujourd'hui." },
        { q: "Es ist schwer, eine Wohnung ___.", choix: ["zu finden", "finden", "gefunden"], fr: "C'est difficile de trouver un appartement." },
      ] },

    // ---------- PRO (B2–C1) ----------
    { id: "hoeflichkeit", niveau: 4, titre: "La politesse : Sie et Konjunktiv II",
      explication: `Au travail on vouvoie : <b>Sie</b> (+ verbe au pluriel) et <b>Ihr/Ihre</b> (votre).<br>
        Pour une demande polie, le <b>Konjunktiv II</b> : <b>Könnten Sie</b>…? · <b>Würden Sie</b>…? · <b>Ich hätte gern</b>… · <b>Wäre es möglich</b>, dass…?<br>
        <i>Ich will</i> → <b>Ich möchte</b> / <b>Ich hätte gern</b>.`,
      exemples: [["Könnten Sie mir die Datei schicken?", "Pourriez-vous m'envoyer le fichier ?"], ["Ich hätte gern einen Termin.", "Je voudrais un rendez-vous."], ["Wäre es möglich, das Treffen zu verschieben?", "Serait-il possible de reporter la réunion ?"]],
      exercices: [
        { q: "___ Sie mir bitte helfen?", choix: ["Könnten", "Können du", "Konntest"], fr: "Pourriez-vous m'aider, s'il vous plaît ?" },
        { q: "Ich ___ gern einen Kaffee.", choix: ["hätte", "habe gestern", "hatte"], fr: "Je voudrais un café." },
        { q: "___ es möglich, morgen zu kommen?", choix: ["Wäre", "Würde", "War"], fr: "Serait-il possible de venir demain ?" },
        { q: "Herr Weber, ist das ___ Büro?", choix: ["Ihr", "dein", "sein"], fr: "Monsieur Weber, c'est votre bureau ?" },
        { q: "___ Sie das bitte wiederholen?", choix: ["Würden", "Wären", "Hätten"], fr: "Pourriez-vous répéter, s'il vous plaît ?" },
      ] },
    { id: "genitiv", niveau: 4, titre: "Le génitif et ses prépositions",
      explication: `Le <b>génitif</b> marque l'appartenance à l'écrit : <i>das Büro <b>des</b> Chefs</i>, <i>die Ziele <b>der</b> Firma</i>.<br>
        Masculin/neutre : <b>des</b> + nom en <b>-(e)s</b> · féminin/pluriel : <b>der</b>.<br>
        Prépositions du génitif (langue pro) : <b>wegen</b> (à cause de), <b>trotz</b> (malgré), <b>während</b> (pendant), <b>innerhalb</b> (dans un délai de), <b>aufgrund</b> (en raison de).`,
      exemples: [["Wegen des Streiks fällt der Flug aus.", "À cause de la grève, le vol est annulé."], ["Trotz der Kosten machen wir weiter.", "Malgré les coûts, nous continuons."], ["Innerhalb einer Woche", "Dans un délai d'une semaine"]],
      exercices: [
        { q: "Das ist das Auto ___ Direktors.", choix: ["des", "dem", "der"], fr: "C'est la voiture du directeur." },
        { q: "___ des schlechten Wetters bleiben wir hier.", choix: ["Wegen", "Mit", "Für"], fr: "À cause du mauvais temps, nous restons ici." },
        { q: "Trotz ___ Problems haben wir es geschafft.", choix: ["des", "dem", "das"], fr: "Malgré le problème, nous avons réussi." },
        { q: "Bitte antworten Sie innerhalb ___ Woche.", choix: ["einer", "einem", "eine"], fr: "Merci de répondre dans un délai d'une semaine." },
        { q: "Während ___ Sitzung war das Handy aus.", choix: ["der", "die", "dem"], fr: "Pendant la séance, le portable était éteint." },
      ] },
    { id: "passif-modal", niveau: 4, titre: "Le passif avec un verbe modal",
      explication: `Pour dire ce qui <b>doit / peut être fait</b> : modal + participe + <b>werden</b> (à la fin).<br>
        <i>Der Bericht <b>muss</b> bis Freitag <b>geschrieben werden</b>.</i> (le rapport doit être écrit d'ici vendredi)<br>
        Au passé : <i>Das Problem <b>konnte</b> schnell <b>gelöst werden</b>.</i>`,
      exemples: [["Die Rechnung muss heute bezahlt werden.", "La facture doit être payée aujourd'hui."], ["Das kann nicht geändert werden.", "Cela ne peut pas être modifié."], ["Der Vertrag sollte geprüft werden.", "Le contrat devrait être vérifié."]],
      exercices: [
        { q: "Die E-Mail muss heute ___ werden.", choix: ["geschickt", "schicken", "geschickt sein"], fr: "Le mail doit être envoyé aujourd'hui." },
        { q: "Das Problem kann schnell gelöst ___.", choix: ["werden", "sein", "wird"], fr: "Le problème peut être résolu rapidement." },
        { q: "Die Frist ___ eingehalten werden.", choix: ["muss", "wird müssen", "muss sein"], fr: "Le délai doit être respecté." },
        { q: "Der Termin konnte nicht ___ werden.", choix: ["verschoben", "verschieben", "verschob"], fr: "Le rendez-vous n'a pas pu être reporté." },
        { q: "Das Formular ___ ausgefüllt werden.", choix: ["sollte", "sollen", "würde sollen"], fr: "Le formulaire devrait être rempli." },
      ] },
    { id: "da-wo", niveau: 4, titre: "Les mots da- et wo- (darauf, worauf…)",
      explication: `Avec un verbe à préposition, pour une <b>chose</b> on remplace « préposition + pronom » par <b>da(r)- + préposition</b> : <i>Ich warte <b>darauf</b>.</i> (j'attends ça)<br>
        Question sur une chose : <b>wo(r)- + préposition</b> : <i><b>Worauf</b> wartest du ?</i><br>
        Pour une <b>personne</b> : préposition + pronom : <i>Ich warte <b>auf ihn</b>.</i> · <i><b>Auf wen</b> wartest du ?</i>`,
      exemples: [["Ich freue mich darauf.", "Je m'en réjouis."], ["Woran denkst du?", "À quoi penses-tu ?"], ["Ich denke an dich.", "Je pense à toi."]],
      exercices: [
        { q: "___ wartest du? — Auf den Bus.", choix: ["Worauf", "Auf was wo", "Darauf"], fr: "Qu'attends-tu ? — Le bus." },
        { q: "Das Meeting ist morgen. Ich freue mich ___.", choix: ["darauf", "auf es", "worauf"], fr: "La réunion est demain. Je m'en réjouis." },
        { q: "___ denkst du? — An meine Familie.", choix: ["Woran", "Daran", "An was wo"], fr: "À quoi penses-tu ? — À ma famille." },
        { q: "Kennst du Paul? Ich warte auf ___.", choix: ["ihn", "darauf", "worauf"], fr: "Tu connais Paul ? Je l'attends." },
        { q: "Wir sprechen morgen ___. (de ça)", choix: ["darüber", "über es", "worüber"], fr: "Nous en parlerons demain." },
      ] },

    // ---------- EXPERT (C1) ----------
    { id: "konjunktiv1", niveau: 5, titre: "Le Konjunktiv I (discours rapporté)",
      explication: `Dans la presse et à l'écrit pro, on rapporte les paroles avec le <b>Konjunktiv I</b> : radical + <b>-e</b>.<br>
        <i>Er sagt, er <b>habe</b> keine Zeit.</i> · <i>Sie sagt, sie <b>sei</b> krank.</i> (sein → sei)<br>
        Passé : <b>habe/sei + participe</b> → <i>Er sagt, er <b>habe</b> das Projekt <b>beendet</b>.</i><br>
        Si la forme est identique à l'indicatif, on prend le Konjunktiv II : <i>sie <b>hätten</b></i>.`,
      exemples: [["Der Chef sagt, er sei zufrieden.", "Le chef dit qu'il est satisfait."], ["Sie erklärte, sie habe keine Zeit.", "Elle a expliqué qu'elle n'avait pas le temps."], ["Er behauptet, er habe alles versucht.", "Il affirme avoir tout essayé."]],
      exercices: [
        { q: "Er sagt, er ___ krank.", choix: ["sei", "ist gestern", "wäre gewesen"], fr: "Il dit qu'il est malade." },
        { q: "Sie meint, sie ___ keine Zeit.", choix: ["habe", "hat gehabt", "haben"], fr: "Elle pense qu'elle n'a pas le temps." },
        { q: "Der Minister erklärte, das Gesetz ___ bald in Kraft.", choix: ["trete", "tritt gestern", "treten"], fr: "Le ministre a expliqué que la loi entrerait bientôt en vigueur." },
        { q: "Er sagt, er ___ den Bericht schon geschrieben.", choix: ["habe", "sei", "werde"], fr: "Il dit avoir déjà écrit le rapport." },
        { q: "Sie sagt, sie ___ gestern in Berlin gewesen.", choix: ["sei", "habe", "wäre gehabt"], fr: "Elle dit qu'elle était à Berlin hier." },
      ] },
    { id: "partizipien", niveau: 5, titre: "Les participes utilisés comme adjectifs",
      explication: `Langue écrite soutenue : le participe devient adjectif devant le nom.<br>
        <b>Participe I</b> (+d, action en cours) : <i>die <b>steigenden</b> Preise</i> (les prix qui augmentent).<br>
        <b>Participe II</b> (action faite) : <i>der <b>unterschriebene</b> Vertrag</i> (le contrat signé).<br>
        Groupe étendu : <i>die <b>im Jahr 2020 gegründete</b> Firma</i> (l'entreprise fondée en 2020).`,
      exemples: [["Die steigenden Kosten sind ein Problem.", "Les coûts en hausse sont un problème."], ["Der geplante Termin wurde verschoben.", "Le rendez-vous prévu a été reporté."], ["Die von uns entwickelte Software", "Le logiciel développé par nous"]],
      exercices: [
        { q: "Die ___ Preise beunruhigen die Kunden. (qui augmentent)", choix: ["steigenden", "gestiegen", "steigen"], fr: "Les prix qui augmentent inquiètent les clients." },
        { q: "Bitte senden Sie den ___ Vertrag zurück. (signé)", choix: ["unterschriebenen", "unterschreibenden", "unterschrieb"], fr: "Merci de renvoyer le contrat signé." },
        { q: "Die 2015 ___ Firma hat 200 Mitarbeiter. (fondée)", choix: ["gegründete", "gründende", "gegründet"], fr: "L'entreprise fondée en 2015 compte 200 salariés." },
        { q: "Ein ___ Kind schläft nicht. (qui pleure)", choix: ["weinendes", "geweintes", "weinen"], fr: "Un enfant qui pleure ne dort pas." },
        { q: "Das ___ Problem ist endlich gelöst. (discuté longtemps)", choix: ["lange diskutierte", "lange diskutierende", "diskutiert lange"], fr: "Le problème longtemps discuté est enfin résolu." },
      ] },
    { id: "doubles-connecteurs", niveau: 5, titre: "Les connecteurs doubles",
      explication: `Pour structurer une argumentation :<br>
        <b>sowohl … als auch</b> (aussi bien… que) · <b>weder … noch</b> (ni… ni) · <b>entweder … oder</b> (soit… soit)<br>
        <b>nicht nur … sondern auch</b> (non seulement… mais aussi) · <b>je … desto</b> (plus… plus) :<br>
        <i><b>Je</b> mehr man übt, <b>desto</b> besser spricht man.</i> (verbe à la fin après je, inversion après desto)`,
      exemples: [["Sowohl die Kunden als auch die Mitarbeiter sind zufrieden.", "Les clients comme les salariés sont satisfaits."], ["Je früher wir anfangen, desto besser.", "Plus tôt nous commençons, mieux c'est."], ["Er spricht weder Englisch noch Spanisch.", "Il ne parle ni anglais ni espagnol."]],
      exercices: [
        { q: "Je mehr man liest, ___ mehr lernt man.", choix: ["desto", "als", "sondern"], fr: "Plus on lit, plus on apprend." },
        { q: "Ich habe ___ Zeit noch Geld.", choix: ["weder", "entweder", "sowohl"], fr: "Je n'ai ni le temps ni l'argent." },
        { q: "Wir liefern nicht nur schnell, ___ auch günstig.", choix: ["sondern", "aber", "oder"], fr: "Nous livrons non seulement vite, mais aussi pour pas cher." },
        { q: "Sowohl Paris ___ Berlin sind schöne Städte.", choix: ["als auch", "noch", "oder"], fr: "Paris comme Berlin sont de belles villes." },
        { q: "___ du kommst heute, oder wir verschieben es.", choix: ["Entweder", "Weder", "Je"], fr: "Soit tu viens aujourd'hui, soit nous reportons." },
      ] },
    { id: "nominalisierung", niveau: 5, titre: "La nominalisation (style écrit)",
      explication: `L'allemand écrit et administratif aime transformer les verbes en <b>noms</b> :<br>
        <i>Wenn man den Vertrag unterschreibt…</i> → <b>Bei der Unterzeichnung</b> des Vertrags…<br>
        <i>Nachdem das Projekt beendet wurde…</i> → <b>Nach Beendigung</b> des Projekts…<br>
        Suffixes fréquents : <b>-ung</b> (die Lösung), infinitif nominalisé (<b>das</b> Lernen). Ces noms sont <b>féminins</b> en -ung.`,
      exemples: [["Nach der Prüfung des Angebots", "Après examen de l'offre"], ["Die Lösung des Problems dauert.", "La résolution du problème prend du temps."], ["Beim Lernen hilft Musik.", "La musique aide à apprendre."]],
      exercices: [
        { q: "entscheiden → die ___", choix: ["Entscheidung", "Entscheidheit", "Entscheiden-ung"], fr: "décider → la décision" },
        { q: "___ Lösung des Problems ist wichtig.", choix: ["Die", "Der", "Das"], fr: "La résolution du problème est importante." },
        { q: "Nach ___ Unterzeichnung des Vertrags beginnen wir.", choix: ["der", "dem", "die"], fr: "Après la signature du contrat, nous commençons." },
        { q: "Beim ___ höre ich Musik.", choix: ["Arbeiten", "Arbeit-ung", "arbeiten"], fr: "En travaillant, j'écoute de la musique." },
        { q: "verbessern → die ___", choix: ["Verbesserung", "Verbessung", "Verbesserheit"], fr: "améliorer → l'amélioration" },
      ] },
  );
})();
