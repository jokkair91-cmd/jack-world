// Thèmes BÂTIMENT de Jack Blabla, pour les 4 langues étrangères.
// Chargé après tous les fichiers contenu/<langue>.js : il AJOUTE 2 thèmes par langue, il ne remplace rien.
//  - niveau 1 (Moyen) : « Sur le chantier » — outils, matériaux, sécurité
//  - niveau 4 (Pro)   : « Diriger un chantier » — planning, réunions, réception
// Dialogues : le PREMIER choix est toujours la bonne réponse (ils sont mélangés à l'affichage).

(() => {
  const ajouter = (code, themes) => { if (CONTENU[code]) CONTENU[code].themes.push(...themes); };

  // ---------------- ANGLAIS ----------------
  ajouter("en", [
    { id: "chantier", niveau: 1, titre: "Sur le chantier", emoji: "🦺",
      mots: [["Le chantier", "The building site"], ["Le casque", "The hard hat"], ["Les chaussures de sécurité", "Safety boots"],
        ["Le gilet fluo", "The hi-vis vest"], ["Les gants", "Gloves"], ["L'échafaudage", "The scaffolding"], ["L'échelle", "The ladder"],
        ["La brique", "The brick"], ["Le ciment", "Cement"], ["Le béton", "Concrete"], ["Le marteau", "The hammer"], ["La perceuse", "The drill"],
        ["La grue", "The crane"], ["La brouette", "The wheelbarrow"], ["Le mur", "The wall"], ["Le toit", "The roof"], ["Attention !", "Watch out!"]],
      dialogue: [
        { who: "jack", txt: "Good morning! Are you the new worker?", fr: "Bonjour ! Tu es le nouvel ouvrier ?" },
        { who: "toi", choices: ["Yes, I start today.", "Yes, I starts today.", "Yes, I am start today."], fr: "Oui, je commence aujourd'hui." },
        { who: "jack", txt: "Where is your hard hat? You must wear it on site.", fr: "Où est ton casque ? Tu dois le porter sur le chantier." },
        { who: "toi", choices: ["Sorry, I'll put it on right now.", "Sorry, I put on it yesterday.", "Sorry, I am wear it."], fr: "Pardon, je le mets tout de suite." },
        { who: "jack", txt: "Good. Can you bring me some bricks with the wheelbarrow?", fr: "Bien. Tu peux m'apporter des briques avec la brouette ?" },
        { who: "toi", choices: ["Of course, how many do you need?", "Of course, how much bricks you need?", "Of course, where is the crane?"], fr: "Bien sûr, il t'en faut combien ?" },
      ] },
    { id: "chantier-pro", niveau: 4, titre: "Diriger un chantier", emoji: "🏗️",
      mots: [["Le chef de chantier", "The site supervisor (foreman)"], ["Le conducteur de travaux", "The construction manager"],
        ["Le maître d'ouvrage (le client)", "The client"], ["Le maître d'œuvre (l'architecte)", "The architect (lead designer)"],
        ["Le planning", "The schedule"], ["Le retard", "The delay"], ["Le délai, la date limite", "The deadline"], ["Le devis", "The quote"],
        ["La réunion de chantier", "The site meeting"], ["Le sous-traitant", "The subcontractor"], ["Les plans", "The drawings"],
        ["Couler le béton", "To pour concrete"], ["La réception des travaux", "The handover"], ["Les réserves", "The snag list"],
        ["Le budget est dépassé", "We are over budget"], ["La sécurité avant tout", "Safety first"], ["Livrer à temps", "To deliver on time"]],
      dialogue: [
        { who: "jack", txt: "The concrete delivery is late again. What should we do?", fr: "La livraison de béton est encore en retard. Qu'est-ce qu'on fait ?" },
        { who: "toi", choices: ["Let's reschedule the pour for tomorrow morning and inform the subcontractors.", "Let's to reschedule the pour tomorrow and we inform subcontractor.", "We must waited the concrete since yesterday."], fr: "Reportons le coulage à demain matin et prévenons les sous-traitants." },
        { who: "jack", txt: "Will that delay the handover?", fr: "Est-ce que ça va retarder la réception ?" },
        { who: "toi", choices: ["No, we can make up the time on the finishing works.", "No, we can made up the time on the finishing works.", "No, we will can catch the time."], fr: "Non, on peut rattraper le temps sur les finitions." },
        { who: "jack", txt: "Good. Please send me the updated schedule by Friday.", fr: "Bien. Envoie-moi le planning mis à jour d'ici vendredi." },
        { who: "toi", choices: ["I'll send it to you by Thursday evening.", "I send you it until Thursday.", "I will sended it Thursday."], fr: "Je te l'envoie d'ici jeudi soir." },
      ] },
  ]);

  // ---------------- ESPAGNOL ----------------
  ajouter("es", [
    { id: "chantier", niveau: 1, titre: "Sur le chantier", emoji: "🦺",
      mots: [["Le chantier", "La obra"], ["Le casque", "El casco"], ["Les chaussures de sécurité", "Las botas de seguridad"],
        ["Le gilet fluo", "El chaleco reflectante"], ["Les gants", "Los guantes"], ["L'échafaudage", "El andamio"], ["L'échelle", "La escalera de mano"],
        ["La brique", "El ladrillo"], ["Le ciment", "El cemento"], ["Le béton", "El hormigón"], ["Le marteau", "El martillo"], ["La perceuse", "El taladro"],
        ["La grue", "La grúa"], ["La brouette", "La carretilla"], ["Le mur", "La pared"], ["Le toit", "El tejado"], ["Attention !", "¡Cuidado!"]],
      dialogue: [
        { who: "jack", txt: "¡Buenos días! ¿Eres el nuevo obrero?", fr: "Bonjour ! Tu es le nouvel ouvrier ?" },
        { who: "toi", choices: ["Sí, empiezo hoy.", "Sí, empiezas hoy.", "Sí, empecé mañana."], fr: "Oui, je commence aujourd'hui." },
        { who: "jack", txt: "¿Dónde está tu casco? Es obligatorio en la obra.", fr: "Où est ton casque ? Il est obligatoire sur le chantier." },
        { who: "toi", choices: ["Perdón, me lo pongo ahora mismo.", "Perdón, me lo pusé ayer.", "Perdón, lo pongo me ahora."], fr: "Pardon, je le mets tout de suite." },
        { who: "jack", txt: "Bien. ¿Puedes traerme ladrillos con la carretilla?", fr: "Bien. Tu peux m'apporter des briques avec la brouette ?" },
        { who: "toi", choices: ["¡Claro! ¿Cuántos necesitas?", "¡Claro! ¿Cuántas necesitas?", "¡Claro! ¿Dónde está la grúa?"], fr: "Bien sûr ! Il t'en faut combien ?" },
      ] },
    { id: "chantier-pro", niveau: 4, titre: "Diriger un chantier", emoji: "🏗️",
      mots: [["Le chef de chantier", "El encargado de obra"], ["Le conducteur de travaux", "El jefe de obra"],
        ["Le maître d'ouvrage (le client)", "El promotor"], ["Le maître d'œuvre (l'architecte)", "La dirección facultativa"],
        ["Le planning", "La planificación"], ["Le retard", "El retraso"], ["Le délai", "El plazo"], ["Le devis", "El presupuesto"],
        ["La réunion de chantier", "La reunión de obra"], ["Le sous-traitant", "El subcontratista"], ["Les plans", "Los planos"],
        ["Couler le béton", "Hormigonar"], ["La réception des travaux", "La recepción de la obra"], ["Les réserves", "Los repasos pendientes"],
        ["Le budget est dépassé", "Nos hemos pasado del presupuesto"], ["La sécurité avant tout", "La seguridad ante todo"], ["Livrer à temps", "Entregar a tiempo"]],
      dialogue: [
        { who: "jack", txt: "El camión de hormigón vuelve a llegar tarde. ¿Qué hacemos?", fr: "Le camion de béton est encore en retard. Qu'est-ce qu'on fait ?" },
        { who: "toi", choices: ["Aplacemos el hormigonado a mañana por la mañana y avisemos a los subcontratistas.", "Aplazar el hormigonado mañana y avisamos a ellos ayer.", "Esperamos el hormigón desde mañana."], fr: "Reportons le coulage à demain matin et prévenons les sous-traitants." },
        { who: "jack", txt: "¿Eso retrasará la entrega?", fr: "Est-ce que ça va retarder la livraison ?" },
        { who: "toi", choices: ["No, podemos recuperar el tiempo en los acabados.", "No, podremos recuperado el tiempo en los acabados.", "No, recuperamos el tiempo ayer en los acabados."], fr: "Non, on peut rattraper le temps sur les finitions." },
        { who: "jack", txt: "Bien. Envíame la planificación actualizada antes del viernes.", fr: "Bien. Envoie-moi le planning mis à jour avant vendredi." },
        { who: "toi", choices: ["Te la envío el jueves por la tarde.", "Te lo envío la jueves por tarde.", "Te la envié el jueves que viene."], fr: "Je te l'envoie jeudi après-midi." },
      ] },
  ]);

  // ---------------- ALLEMAND ----------------
  ajouter("de", [
    { id: "chantier", niveau: 1, titre: "Sur le chantier", emoji: "🦺",
      mots: [["Le chantier", "Die Baustelle"], ["Le casque", "Der Schutzhelm"], ["Les chaussures de sécurité", "Die Sicherheitsschuhe"],
        ["Le gilet fluo", "Die Warnweste"], ["Les gants", "Die Handschuhe"], ["L'échafaudage", "Das Gerüst"], ["L'échelle", "Die Leiter"],
        ["La brique", "Der Ziegel"], ["Le ciment", "Der Zement"], ["Le béton", "Der Beton"], ["Le marteau", "Der Hammer"], ["La perceuse", "Die Bohrmaschine"],
        ["La grue", "Der Kran"], ["La brouette", "Die Schubkarre"], ["Le mur", "Die Wand"], ["Le toit", "Das Dach"], ["Attention !", "Vorsicht!"]],
      dialogue: [
        { who: "jack", txt: "Guten Morgen! Bist du der neue Arbeiter?", fr: "Bonjour ! Tu es le nouvel ouvrier ?" },
        { who: "toi", choices: ["Ja, ich fange heute an.", "Ja, ich anfange heute.", "Ja, ich fängt heute an."], fr: "Oui, je commence aujourd'hui." },
        { who: "jack", txt: "Wo ist dein Helm? Auf der Baustelle ist er Pflicht.", fr: "Où est ton casque ? Il est obligatoire sur le chantier." },
        { who: "toi", choices: ["Entschuldigung, ich setze ihn sofort auf.", "Entschuldigung, ich aufsetze ihn sofort.", "Entschuldigung, ich setze sie sofort auf."], fr: "Pardon, je le mets tout de suite." },
        { who: "jack", txt: "Gut. Kannst du mir mit der Schubkarre Ziegel bringen?", fr: "Bien. Tu peux m'apporter des briques avec la brouette ?" },
        { who: "toi", choices: ["Klar, wie viele brauchst du?", "Klar, wie viele brauchst du gestern?", "Klar, wo ist der Kran?"], fr: "Bien sûr, il t'en faut combien ?" },
      ] },
    { id: "chantier-pro", niveau: 4, titre: "Diriger un chantier", emoji: "🏗️",
      mots: [["Le chef de chantier", "Der Polier"], ["Le conducteur de travaux", "Der Bauleiter"],
        ["Le maître d'ouvrage (le client)", "Der Bauherr"], ["Le maître d'œuvre (l'architecte)", "Der Architekt (die Bauüberwachung)"],
        ["Le planning", "Der Bauzeitenplan"], ["Le retard", "Die Verzögerung"], ["Le délai", "Die Frist"], ["Le devis", "Das Angebot"],
        ["La réunion de chantier", "Die Baubesprechung"], ["Le sous-traitant", "Der Subunternehmer"], ["Les plans", "Die Pläne"],
        ["Couler le béton", "Betonieren"], ["La réception des travaux", "Die Bauabnahme"], ["Les réserves", "Die Mängelliste"],
        ["Le budget est dépassé", "Das Budget ist überschritten"], ["La sécurité avant tout", "Sicherheit geht vor"], ["Livrer à temps", "Termingerecht fertigstellen"]],
      dialogue: [
        { who: "jack", txt: "Der Betonmischer kommt schon wieder zu spät. Was machen wir?", fr: "La toupie à béton arrive encore en retard. Qu'est-ce qu'on fait ?" },
        { who: "toi", choices: ["Wir verschieben das Betonieren auf morgen früh und informieren die Subunternehmer.", "Wir verschieben das Betonieren auf morgen früh und die Subunternehmer informieren.", "Wir haben das Betonieren morgen verschoben gewesen."], fr: "On reporte le coulage à demain matin et on prévient les sous-traitants." },
        { who: "jack", txt: "Verzögert das die Abnahme?", fr: "Est-ce que ça retarde la réception ?" },
        { who: "toi", choices: ["Nein, wir können die Zeit beim Innenausbau aufholen.", "Nein, wir können die Zeit beim Innenausbau aufgeholt.", "Nein, wir aufholen die Zeit beim Innenausbau."], fr: "Non, on peut rattraper le temps sur le second œuvre." },
        { who: "jack", txt: "Gut. Schick mir bitte bis Freitag den aktualisierten Bauzeitenplan.", fr: "Bien. Envoie-moi le planning mis à jour d'ici vendredi, s'il te plaît." },
        { who: "toi", choices: ["Ich schicke ihn dir bis Donnerstagabend.", "Ich schicke es dir bis Donnerstagabend.", "Ich schickte ihn dir morgen."], fr: "Je te l'envoie d'ici jeudi soir." },
      ] },
  ]);

  // ---------------- ITALIEN ----------------
  ajouter("it", [
    { id: "chantier", niveau: 1, titre: "Sur le chantier", emoji: "🦺",
      mots: [["Le chantier", "Il cantiere"], ["Le casque", "Il casco"], ["Les chaussures de sécurité", "Le scarpe antinfortunistiche"],
        ["Le gilet fluo", "Il gilet ad alta visibilità"], ["Les gants", "I guanti"], ["L'échafaudage", "Il ponteggio"], ["L'échelle", "La scala"],
        ["La brique", "Il mattone"], ["Le ciment", "Il cemento"], ["Le béton", "Il calcestruzzo"], ["Le marteau", "Il martello"], ["La perceuse", "Il trapano"],
        ["La grue", "La gru"], ["La brouette", "La carriola"], ["Le mur", "Il muro"], ["Le toit", "Il tetto"], ["Attention !", "Attenzione!"]],
      dialogue: [
        { who: "jack", txt: "Buongiorno! Sei il nuovo operaio?", fr: "Bonjour ! Tu es le nouvel ouvrier ?" },
        { who: "toi", choices: ["Sì, comincio oggi.", "Sì, cominci oggi.", "Sì, ho cominciato domani."], fr: "Oui, je commence aujourd'hui." },
        { who: "jack", txt: "Dov'è il tuo casco? In cantiere è obbligatorio.", fr: "Où est ton casque ? Il est obligatoire sur le chantier." },
        { who: "toi", choices: ["Scusa, lo metto subito.", "Scusa, la metto subito.", "Scusa, metto lo subito."], fr: "Pardon, je le mets tout de suite." },
        { who: "jack", txt: "Bene. Puoi portarmi dei mattoni con la carriola?", fr: "Bien. Tu peux m'apporter des briques avec la brouette ?" },
        { who: "toi", choices: ["Certo, quanti te ne servono?", "Certo, quante te ne servono?", "Certo, dov'è la gru?"], fr: "Bien sûr, il t'en faut combien ?" },
      ] },
    { id: "chantier-pro", niveau: 4, titre: "Diriger un chantier", emoji: "🏗️",
      mots: [["Le chef de chantier", "Il capocantiere"], ["Le conducteur de travaux", "Il direttore di cantiere"],
        ["Le maître d'ouvrage (le client)", "Il committente"], ["Le maître d'œuvre (l'architecte)", "Il direttore dei lavori"],
        ["Le planning", "Il cronoprogramma"], ["Le retard", "Il ritardo"], ["Le délai", "La scadenza"], ["Le devis", "Il preventivo"],
        ["La réunion de chantier", "La riunione di cantiere"], ["Le sous-traitant", "Il subappaltatore"], ["Les plans", "Le tavole di progetto"],
        ["Couler le béton", "Fare il getto di calcestruzzo"], ["La réception des travaux", "Il collaudo"], ["Les défauts à reprendre (réserves)", "I difetti da sistemare"],
        ["Le budget est dépassé", "Abbiamo sforato il budget"], ["La sécurité avant tout", "Prima di tutto la sicurezza"], ["Livrer à temps", "Consegnare in tempo"]],
      dialogue: [
        { who: "jack", txt: "L'autobetoniera è di nuovo in ritardo. Che facciamo?", fr: "La toupie à béton est encore en retard. Qu'est-ce qu'on fait ?" },
        { who: "toi", choices: ["Rimandiamo il getto a domani mattina e avvisiamo i subappaltatori.", "Rimandiamo il getto a domani mattina e avvisare i subappaltatori.", "Abbiamo rimandato il getto domani prossimo."], fr: "Reportons le coulage à demain matin et prévenons les sous-traitants." },
        { who: "jack", txt: "Questo ritarderà la consegna?", fr: "Est-ce que ça va retarder la livraison ?" },
        { who: "toi", choices: ["No, possiamo recuperare il tempo sulle finiture.", "No, possiamo recuperato il tempo sulle finiture.", "No, recuperiamo il tempo ieri sulle finiture."], fr: "Non, on peut rattraper le temps sur les finitions." },
        { who: "jack", txt: "Bene. Mandami il cronoprogramma aggiornato entro venerdì.", fr: "Bien. Envoie-moi le planning mis à jour d'ici vendredi." },
        { who: "toi", choices: ["Te lo mando entro giovedì sera.", "Te la mando entro giovedì sera.", "Ti lo mando entro giovedì sera."], fr: "Je te l'envoie d'ici jeudi soir." },
      ] },
  ]);

  // ---------------- PORTUGAIS ----------------
  ajouter("pt", [
    { id: "chantier", niveau: 1, titre: "Sur le chantier", emoji: "🦺",
      mots: [["Le chantier", "A obra"], ["Le casque", "O capacete"], ["Les chaussures de sécurité", "As botas de segurança"],
        ["Le gilet fluo", "O colete refletor"], ["Les gants", "As luvas"], ["L'échafaudage", "O andaime"], ["L'échelle", "A escada"],
        ["La brique", "O tijolo"], ["Le ciment", "O cimento"], ["Le béton", "O betão"], ["Le marteau", "O martelo"], ["La perceuse", "O berbequim"],
        ["La grue", "A grua"], ["La brouette", "O carrinho de mão"], ["Le mur", "A parede"], ["Le toit", "O telhado"], ["Attention !", "Cuidado!"]],
      dialogue: [
        { who: "jack", txt: "Bom dia! És o novo trabalhador?", fr: "Bonjour ! Tu es le nouvel ouvrier ?" },
        { who: "toi", choices: ["Sim, começo hoje.", "Sim, começas hoje.", "Sim, comecei amanhã."], fr: "Oui, je commence aujourd'hui." },
        { who: "jack", txt: "Onde está o teu capacete? Na obra é obrigatório.", fr: "Où est ton casque ? Il est obligatoire sur le chantier." },
        { who: "toi", choices: ["Desculpa, ponho-o já.", "Desculpa, ponho-a já.", "Desculpa, o ponho já."], fr: "Pardon, je le mets tout de suite." },
        { who: "jack", txt: "Muito bem. Podes trazer-me tijolos com o carrinho de mão?", fr: "Très bien. Tu peux m'apporter des briques avec la brouette ?" },
        { who: "toi", choices: ["Claro, de quantos precisas?", "Claro, de quantas precisas?", "Claro, onde está a grua?"], fr: "Bien sûr, il t'en faut combien ?" },
      ] },
    { id: "chantier-pro", niveau: 4, titre: "Diriger un chantier", emoji: "🏗️",
      mots: [["Le chef de chantier", "O encarregado de obra"], ["Le conducteur de travaux", "O diretor de obra"],
        ["Le maître d'ouvrage (le client)", "O dono de obra"], ["Le maître d'œuvre (l'architecte)", "O projetista / a fiscalização"],
        ["Le planning", "O planeamento"], ["Le retard", "O atraso"], ["Le délai", "O prazo"], ["Le devis", "O orçamento"],
        ["La réunion de chantier", "A reunião de obra"], ["Le sous-traitant", "O subempreiteiro"], ["Les plans", "As plantas"],
        ["Couler le béton", "Fazer a betonagem"], ["La réception des travaux", "A receção da obra"], ["Les défauts à reprendre (réserves)", "As reservas / os defeitos a corrigir"],
        ["Le budget est dépassé", "O orçamento foi ultrapassado"], ["La sécurité avant tout", "A segurança acima de tudo"], ["Livrer à temps", "Entregar dentro do prazo"]],
      dialogue: [
        { who: "jack", txt: "A betoneira está outra vez atrasada. O que fazemos?", fr: "La toupie à béton est encore en retard. Qu'est-ce qu'on fait ?" },
        { who: "toi", choices: ["Adiamos a betonagem para amanhã de manhã e avisamos os subempreiteiros.", "Adiamos a betonagem para amanhã de manhã e avisar os subempreiteiros.", "Adiámos a betonagem para amanhã passado."], fr: "On reporte le coulage à demain matin et on prévient les sous-traitants." },
        { who: "jack", txt: "Isso vai atrasar a entrega?", fr: "Est-ce que ça va retarder la livraison ?" },
        { who: "toi", choices: ["Não, podemos recuperar o tempo nos acabamentos.", "Não, podemos recuperado o tempo nos acabamentos.", "Não, recuperamos o tempo ontem nos acabamentos."], fr: "Non, on peut rattraper le temps sur les finitions." },
        { who: "jack", txt: "Ótimo. Envia-me o planeamento atualizado até sexta-feira.", fr: "Parfait. Envoie-moi le planning mis à jour d'ici vendredi." },
        { who: "toi", choices: ["Envio-to até quinta à noite.", "Envio-te-o até quinta à noite.", "Te o envio até quinta à noite."], fr: "Je te l'envoie d'ici jeudi soir." },
      ] },
  ]);
})();
