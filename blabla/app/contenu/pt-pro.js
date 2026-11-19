// Contenu PORTUGAIS de Jack Blabla — niveaux 3 (Avancé, B2), 4 (Pro, B2–C1) et 5 (Expert, C1).
// Chargé après contenu/pt.js : il AJOUTE des cours, il ne remplace rien.
// Exercices : le PREMIER choix est toujours la bonne réponse (ils sont mélangés à l'affichage).

(() => {
  const pt = CONTENU.pt;

  pt.temps.push(
    { id: "conjuntivo", nom: "Subjonctif présent (presente do conjuntivo)", niveau: 3 },
    { id: "mais-que-perfeito", nom: "Plus-que-parfait (tinha + participe)", niveau: 3 },
    { id: "conjuntivo-imperfeito", nom: "Subjonctif imparfait (imperfeito do conjuntivo)", niveau: 4 },
    { id: "condicional-composto", nom: "Conditionnel passé (teria + participe)", niveau: 5 },
  );

  pt.verbes.push(
    { inf: "conhecer", fr: "connaître", niveau: 3 },
    { inf: "começar", fr: "commencer", niveau: 3 },
    { inf: "preferir", fr: "préférer", niveau: 3, irregulier: true, formes: {
      presente: ["prefiro", "preferes", "prefere", "preferimos", "preferem", "preferem"] } },
    { inf: "decidir", fr: "décider", niveau: 4 },
    { inf: "perder", fr: "perdre", niveau: 4, irregulier: true, formes: {
      presente: ["perco", "perdes", "perde", "perdemos", "perdem", "perdem"] } },
    { inf: "haver", fr: "y avoir, avoir (auxiliaire)", niveau: 4, irregulier: true, formes: {
      presente: ["hei", "hás", "há", "havemos", "hão", "hão"],
      preterito: ["houve", "houveste", "houve", "houvemos", "houveram", "houveram"],
      conjuntivo: ["haja", "hajas", "haja", "hajamos", "hajam", "hajam"] } },
    { inf: "nascer", fr: "naître", niveau: 5 },
    { inf: "morrer", fr: "mourir", niveau: 5 },
    { inf: "traduzir", fr: "traduire", niveau: 5, irregulier: true, formes: {
      presente: ["traduzo", "traduzes", "traduz", "traduzimos", "traduzem", "traduzem"] } },
  );

  pt.themes.push(
    // ---------- AVANCÉ ----------
    { id: "debat", niveau: 3, titre: "Débattre et argumenter", emoji: "🗣️",
      mots: [["D'un côté… de l'autre…", "Por um lado… por outro…"], ["En ce qui concerne…", "No que diz respeito a…"], ["Il faut reconnaître que…", "É preciso reconhecer que…"],
        ["Le problème, c'est que…", "O problema é que…"], ["Il me semble que…", "Parece-me que…"], ["Au contraire", "Pelo contrário"], ["En conclusion", "Em conclusão"],
        ["C'est vrai, mais…", "É verdade, mas…"], ["Je doute que…", "Duvido que…"]],
      dialogue: [
        { who: "jack", txt: "Achas que o teletrabalho é bom para as empresas?", fr: "Tu penses que le télétravail est bon pour les entreprises ?" },
        { who: "toi", choices: ["Por um lado poupa tempo, por outro isola as pessoas.", "Por um lado poupa tempo, por outro lado isolou as pessoas amanhã.", "De um lado poupa tempo, do outro isola-se as pessoas."], fr: "D'un côté ça fait gagner du temps, de l'autre ça isole les gens." },
        { who: "jack", txt: "Duvido que os chefes concordem.", fr: "Je doute que les chefs soient d'accord." },
        { who: "toi", choices: ["É verdade, mas os resultados são bons.", "É verdade, mas os resultados sejam bons.", "É verdade, porque os resultados mas são bons."], fr: "C'est vrai, mais les résultats sont bons." },
      ] },
    { id: "medias", niveau: 3, titre: "Médias et actualité", emoji: "📰",
      mots: [["les informations (journal télévisé)", "o telejornal"], ["le journal", "o jornal"], ["l'article", "o artigo"], ["le titre", "a manchete"],
        ["le journaliste", "o jornalista"], ["l'enquête", "a investigação"], ["les élections", "as eleições"], ["le gouvernement", "o governo"],
        ["la grève", "a greve"], ["selon les experts", "segundo os especialistas"]],
      dialogue: [
        { who: "jack", txt: "Viste a notícia sobre a greve dos comboios?", fr: "Tu as vu l'info sur la grève des trains ?" },
        { who: "toi", choices: ["Vi. Segundo o jornal, vai durar três dias.", "Vi. Segundo o jornal, durou três dias amanhã.", "Vejo. Segundo jornal, vai durar três dia."], fr: "Oui. D'après le journal, elle va durer trois jours." },
        { who: "jack", txt: "Espero que o governo encontre uma solução.", fr: "J'espère que le gouvernement trouvera une solution." },
        { who: "toi", choices: ["Eu também, é preciso que haja acordo.", "Eu também, é preciso que há acordo.", "Eu também, é preciso que houve acordo."], fr: "Moi aussi, il faut qu'il y ait un accord." },
      ] },
    // ---------- PRO ----------
    { id: "reuniao", niveau: 4, titre: "Réunions et mails professionnels", emoji: "💼",
      mots: [["l'ordre du jour", "a ordem de trabalhos"], ["le compte rendu", "a ata"], ["l'échéance", "o prazo"], ["le devis", "o orçamento"],
        ["Je vous remercie de votre réponse", "Agradeço a sua resposta"], ["Je reste à votre disposition", "Fico ao seu dispor"], ["Cordialement", "Com os melhores cumprimentos"],
        ["Madame, Monsieur,", "Exmos. Senhores,"], ["Pourriez-vous me confirmer… ?", "Poderia confirmar-me…?"], ["En pièce jointe", "Em anexo"]],
      dialogue: [
        { who: "jack", txt: "Podemos começar a reunião? Qual é o primeiro ponto da ordem de trabalhos?", fr: "On peut commencer la réunion ? Quel est le premier point de l'ordre du jour ?" },
        { who: "toi", choices: ["O orçamento para o próximo trimestre.", "O orçamento para o trimestre passado próximo.", "Os orçamento para o próximo trimestres."], fr: "Le budget du prochain trimestre." },
        { who: "jack", txt: "Se tivéssemos mais tempo, poderíamos rever os números.", fr: "Si nous avions plus de temps, nous pourrions revoir les chiffres." },
        { who: "toi", choices: ["Proponho enviar-lhe a ata até sexta-feira.", "Proponho enviar-lhe a ata até sexta-feira passada.", "Proponho que envio-lhe a ata."], fr: "Je propose de vous envoyer le compte rendu d'ici vendredi." },
      ] },
    { id: "telefone", niveau: 4, titre: "Au téléphone et à l'accueil", emoji: "📞",
      mots: [["Allô ?", "Estou? / Sim?"], ["De la part de qui ?", "Da parte de quem?"], ["Ne quittez pas", "Um momento, por favor"], ["Je vous le passe", "Vou passar-lhe a chamada"],
        ["Il est en réunion", "Está em reunião"], ["Voulez-vous laisser un message ?", "Quer deixar recado?"], ["Je rappellerai plus tard", "Volto a ligar mais tarde"],
        ["Le numéro de poste", "A extensão"], ["Pourriez-vous répéter ?", "Pode repetir, por favor?"]],
      dialogue: [
        { who: "jack", txt: "Bom dia, empresa Atlântico, em que posso ajudar?", fr: "Bonjour, entreprise Atlântico, que puis-je pour vous ?" },
        { who: "toi", choices: ["Bom dia, queria falar com a Dra. Silva, por favor.", "Bom dia, queria falei com a Dra. Silva.", "Bom dia, quero falar a Dra. Silva ontem."], fr: "Bonjour, je voudrais parler à Mme Silva, s'il vous plaît." },
        { who: "jack", txt: "Lamento, está em reunião. Quer deixar recado?", fr: "Je suis désolé, elle est en réunion. Voulez-vous laisser un message ?" },
        { who: "toi", choices: ["Não, obrigado, volto a ligar mais tarde.", "Não, obrigado, voltei a ligar mais tarde.", "Não, obrigado, volto ligar mais tarde."], fr: "Non, merci, je rappellerai plus tard." },
      ] },
    // ---------- EXPERT ----------
    { id: "nuances", niveau: 5, titre: "Nuances et registres", emoji: "🎚️",
      mots: [["toi (familier)", "tu"], ["vous (courant, Portugal)", "você / o senhor, a senhora"], ["Monsieur le Docteur (formel)", "Senhor Doutor"],
        ["à vrai dire", "a bem dizer"], ["tout compte fait", "afinal de contas"], ["quoi qu'il en soit", "seja como for"], ["il va sans dire que", "escusado será dizer que"],
        ["dans la mesure où", "na medida em que"], ["sous réserve de", "sob reserva de"]],
      dialogue: [
        { who: "jack", txt: "Senhor Doutor, a reunião foi adiada. Seja como for, enviarei os documentos hoje.", fr: "Monsieur, la réunion a été reportée. Quoi qu'il en soit, j'enverrai les documents aujourd'hui." },
        { who: "toi", choices: ["Muito obrigado. Escusado será dizer que conto consigo.", "Muito obrigado. Escusado será dizer que conto contigo, Senhor Doutor.", "Obrigado. Escusado dizer conto você."], fr: "Merci beaucoup. Il va sans dire que je compte sur vous." },
        { who: "jack", txt: "Afinal de contas, o projeto avança bem.", fr: "Tout compte fait, le projet avance bien." },
        { who: "toi", choices: ["Na medida em que todos colaborem, chegaremos ao fim a tempo.", "Na medida que todos colaboram, chegamos ao fim a tempo ontem.", "Na medida em que todos colaboraram amanhã."], fr: "Dans la mesure où tout le monde collabore, nous finirons à temps." },
      ] },
    { id: "expressions-pro", niveau: 5, titre: "Expressions avancées", emoji: "🎭",
      mots: [["Prendre le taureau par les cornes", "Pegar o touro pelos cornos"], ["Ne pas mâcher ses mots", "Não ter papas na língua"], ["Couper la poire en deux", "Dividir a meias"],
        ["Faire la grasse matinée", "Dormir até tarde"], ["Avoir un poil dans la main", "Ser um mandrião"], ["Pour de bon", "De vez"],
        ["Tourner autour du pot", "Andar com rodeios"], ["Les doigts dans le nez", "Com uma perna às costas"], ["À bon entendeur…", "Para bom entendedor, meia palavra basta"]],
      dialogue: [
        { who: "jack", txt: "O cliente reclamou outra vez. O que fazemos?", fr: "Le client s'est encore plaint. Qu'est-ce qu'on fait ?" },
        { who: "toi", choices: ["Temos de pegar o touro pelos cornos e falar com ele hoje.", "Temos que pegar a vaca pelos cornos amanhã ontem.", "Temos de pegar o touro pelas mãos."], fr: "Il faut prendre le taureau par les cornes et lui parler aujourd'hui." },
        { who: "jack", txt: "Ele não tem papas na língua…", fr: "Il ne mâche pas ses mots…" },
        { who: "toi", choices: ["Para bom entendedor, meia palavra basta.", "Para bom entendedor, meia palavra bastou amanhã.", "Para bom entender, meio palavra basta."], fr: "À bon entendeur, salut." },
      ] },
  );

  pt.grammaire.push(
    // ---------- AVANCÉ ----------
    { id: "conjuntivo", niveau: 3, titre: "Le subjonctif présent (presente do conjuntivo)",
      astuce: "Radical du « eu » au présent + terminaison opposée : -ar → e (fale) ; -er/-ir → a (coma, abra).",
      explication: `On prend le <b>présent à eu</b>, on enlève le <b>-o</b>, puis : -ar → <b>e, es, e, emos, em</b> ; -er/-ir → <b>a, as, a, amos, am</b>.<br>
        <i>falar → falo → fale</i> · <i>fazer → faço → faça</i> · <i>ter → tenho → tenha</i> · <i>dizer → digo → diga</i>.<br>
        Irréguliers : ser → <b>seja</b> · estar → <b>esteja</b> · ir → <b>vá</b> · dar → <b>dê</b> · saber → <b>saiba</b> · querer → <b>queira</b> · haver → <b>haja</b>.<br>
        On l'emploie après les souhaits, les doutes, les ordres et les émotions : <i>Espero que, quero que, duvido que, é importante que, talvez</i>.`,
      pourquoi: "C'est la même idée que le subjonctif français (« je veux que tu viennes »), et il s'emploie dans presque les mêmes cas. Particularité : talvez (peut-être) est suivi du subjonctif : talvez chova.",
      pieges: [["Espero que vens.", "Espero que venhas.", "Après espero que → subjonctif."], ["Talvez ele está em casa.", "Talvez ele esteja em casa.", "talvez + subjonctif."], ["É importante que fazes isso.", "É importante que faças isso.", "Une expression de nécessité → subjonctif."]],
      exemples: [["Quero que venhas à festa.", "Je veux que tu viennes à la fête."], ["Duvido que seja verdade.", "Je doute que ce soit vrai."], ["Talvez chova amanhã.", "Il pleuvra peut-être demain."]],
      exercices: [
        { q: "Espero que tu ___ (estar) bem.", choix: ["estejas", "estás", "estarás"], fr: "J'espère que tu vas bien.", pourquoi: "espero que + subjonctif : estejas." },
        { q: "Quero que vocês ___ (fazer) o trabalho hoje.", choix: ["façam", "fazem", "fizeram"], fr: "Je veux que vous fassiez le travail aujourd'hui.", pourquoi: "fazer → faço → faça → (vocês) façam." },
        { q: "Talvez ela ___ (ter) razão.", choix: ["tenha", "tem", "teve"], fr: "Elle a peut-être raison.", pourquoi: "talvez + subjonctif : tenha." },
        { q: "É preciso que nós ___ (falar) com o chefe.", choix: ["falemos", "falamos", "falarmos"], fr: "Il faut que nous parlions au chef.", pourquoi: "-ar au subjonctif → -emos : falemos." },
        { q: "Duvido que ele ___ (ser) o responsável.", choix: ["seja", "é", "foi"], fr: "Je doute qu'il soit le responsable.", pourquoi: "duvidar que + subjonctif ; ser → seja." },
      ] },
    { id: "mais-que-perfeito", niveau: 3, titre: "Le plus-que-parfait (tinha + participe)",
      astuce: "tinha, tinhas, tinha, tínhamos, tinham + participe (falado, comido, feito, dito, visto…).",
      explication: `Pour une action <b>antérieure</b> à une autre action passée : <b>imparfait de ter + participe passé</b>.<br>
        <i>Quando cheguei, o filme já tinha começado.</i> (Quand je suis arrivé, le film avait déjà commencé.)<br>
        Participes réguliers : -ar → <b>-ado</b>, -er/-ir → <b>-ido</b>. Irréguliers : fazer → <b>feito</b>, dizer → <b>dito</b>, ver → <b>visto</b>, escrever → <b>escrito</b>, abrir → <b>aberto</b>, pôr → <b>posto</b>, vir → <b>vindo</b>.<br>
        Le participe ne s'accorde jamais avec ter.`,
      pourquoi: "C'est exactement notre plus-que-parfait, mais avec un seul auxiliaire : ter (même pour ir ou chegar). Fini le choix entre être et avoir !",
      pieges: [["Quando cheguei, ele já era saído.", "Quando cheguei, ele já tinha saído.", "Toujours ter, jamais ser."], ["Ela tinha fazido o bolo.", "Ela tinha feito o bolo.", "fazer → feito."], ["Tínhamos chegados.", "Tínhamos chegado.", "Avec ter, le participe ne s'accorde pas."]],
      exemples: [["Eu já tinha jantado.", "J'avais déjà dîné."], ["Ela disse que tinha visto o filme.", "Elle a dit qu'elle avait vu le film."], ["Nunca tínhamos estado no Porto.", "Nous n'étions jamais allés à Porto."]],
      exercices: [
        { q: "Quando cheguei, o comboio já ___ partido.", choix: ["tinha", "era", "teve"], fr: "Quand je suis arrivé, le train était déjà parti.", pourquoi: "Plus-que-parfait : tinha + participe, toujours avec ter." },
        { q: "Ela tinha ___ (fazer) um bolo.", choix: ["feito", "fazido", "fez"], fr: "Elle avait fait un gâteau.", pourquoi: "Participe irrégulier de fazer : feito." },
        { q: "Nós já ___ visto esse filme.", choix: ["tínhamos", "tinhamos", "tivemos"], fr: "Nous avions déjà vu ce film.", pourquoi: "nós → tínhamos (avec accent)." },
        { q: "Ele disse que tinha ___ (escrever) a carta.", choix: ["escrito", "escrevido", "escreveu"], fr: "Il a dit qu'il avait écrit la lettre.", pourquoi: "escrever → escrito." },
      ] },
    // ---------- PRO ----------
    { id: "hipoteses", niveau: 4, titre: "Hypothèses : se + subjonctif imparfait + conditionnel",
      astuce: "Se + subjonctif imparfait (falasse, tivesse, fosse) → conditionnel (faria, poderia).",
      explication: `Pour une hypothèse peu probable : <b>Se + imperfeito do conjuntivo</b>, puis <b>condicional</b>.<br>
        <i>Se eu tivesse tempo, viajaria mais.</i> (Si j'avais le temps, je voyagerais plus.)<br>
        Formation : passé à « eles » (falaram, tiveram, fizeram, foram) − <b>ram</b> + <b>sse, sses, sse, ssemos, ssem</b> : <i>falasse, tivesse, fizesse, fosse</i>.<br>
        Nós prend un accent : <i>falássemos, tivéssemos, fôssemos</i>.<br>
        Il s'emploie aussi après un souhait au passé : <i>Queria que viesses.</i>`,
      pourquoi: "Là où le français met l'imparfait après si (si j'avais), le portugais met le subjonctif imparfait (se eu tivesse). C'est le même temps qu'en espagnol (si tuviera).",
      pieges: [["Se eu tinha dinheiro, comprava.", "Se eu tivesse dinheiro, compraria.", "Hypothèse → se + subjonctif imparfait."], ["Se fosse rico, comprarei uma casa.", "Se fosse rico, compraria uma casa.", "Dans la principale → conditionnel."]],
      exemples: [["Se pudesse, ficava mais um dia.", "Si je pouvais, je resterais un jour de plus."], ["Se fôssemos ao Porto, visitaríamos as caves.", "Si nous allions à Porto, nous visiterions les caves."], ["Se ele soubesse, ficaria furioso.", "S'il savait, il serait furieux."]],
      exercices: [
        { q: "Se eu ___ (ter) tempo, viajaria mais.", choix: ["tivesse", "tinha", "tenho"], fr: "Si j'avais le temps, je voyagerais plus.", pourquoi: "Se + subjonctif imparfait : tiveram → tivesse." },
        { q: "Se nós ___ (ir) ao Porto, visitaríamos as caves.", choix: ["fôssemos", "fossemos", "íamos"], fr: "Si nous allions à Porto, nous visiterions les caves.", pourquoi: "ir → foram → fosse ; nós → fôssemos (accent)." },
        { q: "Se ela soubesse, ___ (ficar) furiosa.", choix: ["ficaria", "ficará", "ficou"], fr: "Si elle savait, elle serait furieuse.", pourquoi: "La conséquence → conditionnel : ficaria." },
        { q: "Queria que tu ___ (vir) à reunião.", choix: ["viesses", "vens", "vieste"], fr: "Je voudrais que tu viennes à la réunion.", pourquoi: "Souhait au passé + subjonctif imparfait : vieram → viesse → viesses." },
      ] },
    { id: "tratamento", niveau: 4, titre: "Tu, você, o senhor : s'adresser à quelqu'un",
      astuce: "tu = familier ; o senhor / a senhora (ou le titre) = poli ; você avec prudence au Portugal. Ces formes polies se conjuguent comme ele/ela.",
      explication: `Au Portugal, <b>tu</b> s'emploie avec la famille, les amis, les enfants.<br>
        Pour vouvoyer, on utilise <b>o senhor / a senhora</b> ou le <b>titre</b> (<i>o senhor doutor, a senhora engenheira</i>), avec le verbe à la 3e personne : <i>O senhor deseja mais alguma coisa?</i><br>
        <b>você</b> existe mais peut sembler sec au Portugal : on l'évite souvent en omettant le pronom (<i>Deseja um café?</i>).<br>
        🇧🇷 Au Brésil, <b>você</b> est la forme normale, même entre amis.<br>
        Au pluriel : <b>vocês</b> pour tout le monde (avec le verbe en -am).`,
      pourquoi: "Le portugais du Portugal est très attentif aux titres : dans le travail, on dit volontiers « o senhor doutor » à un diplômé. Le plus sûr : conjuguer à la 3e personne et ne pas mettre de pronom.",
      pieges: [["O senhor queres um café?", "O senhor quer um café?", "Formes polies → 3e personne : quer."], ["Vós sois muito simpáticos.", "Vocês são muito simpáticos.", "vós est très rare aujourd'hui ; on dit vocês."]],
      exemples: [["A senhora precisa de ajuda?", "Madame, vous avez besoin d'aide ?"], ["Deseja mais alguma coisa?", "Désirez-vous autre chose ?"], ["Vocês já conhecem o Porto?", "Vous connaissez déjà Porto ?"]],
      exercices: [
        { q: "O senhor ___ (querer) um café?", choix: ["quer", "queres", "querem"], fr: "Monsieur, voulez-vous un café ?", pourquoi: "o senhor → 3e personne du singulier : quer." },
        { q: "A senhora ___ (precisar) de ajuda?", choix: ["precisa", "precisas", "precisam"], fr: "Madame, avez-vous besoin d'aide ?", pourquoi: "a senhora → 3e personne : precisa." },
        { q: "Vocês ___ (ser) muito simpáticos.", choix: ["são", "sois", "é"], fr: "Vous êtes très sympathiques.", pourquoi: "vocês → comme eles : são." },
        { q: "Ao teu melhor amigo, dizes:", choix: ["Tu vens à festa?", "O senhor vem à festa?", "Vós vindes à festa?"], fr: "À ton meilleur ami, tu dis : Tu viens à la fête ?", pourquoi: "Avec un ami → tu." },
      ] },
    // ---------- EXPERT ----------
    { id: "infinitivo-pessoal", niveau: 5, titre: "L'infinitif personnel (infinitivo pessoal)",
      astuce: "Infinitif + -, -es, -, -mos, -em, -em : falar, falares, falar, falarmos, falarem.",
      explication: `Le portugais a une particularité unique : un <b>infinitif qui se conjugue</b>.<br>
        <i>falar</i> : (eu) falar, (tu) falar<b>es</b>, (ele) falar, (nós) falar<b>mos</b>, (vocês/eles) falar<b>em</b>.<br>
        On l'utilise quand l'infinitif a <b>son propre sujet</b>, surtout après une préposition : <i>É melhor saíres agora.</i> (Il vaut mieux que tu partes maintenant.) · <i>Antes de eles chegarem, arrumamos a casa.</i> · <i>Obrigado por terem vindo.</i>`,
      pourquoi: "Là où le français utilise « que + subjonctif » (avant qu'ils arrivent), le portugais garde l'infinitif et lui colle une terminaison. C'est plus court et très naturel.",
      pieges: [["Antes de eles chegar, saímos.", "Antes de eles chegarem, saímos.", "Le sujet est eles → infinitif personnel : chegarem."], ["Obrigado por ter vindo (à un groupe).", "Obrigado por terem vindo.", "À plusieurs personnes → terem."]],
      exemples: [["É importante estudarmos todos os dias.", "Il est important que nous étudiions tous les jours."], ["Fiquei contente por vires.", "J'ai été content que tu viennes."], ["Até eles perceberem, explico outra vez.", "Jusqu'à ce qu'ils comprennent, j'explique encore."]],
      exercices: [
        { q: "É melhor (tu) ___ (sair) agora.", choix: ["saíres", "sair", "saias"], fr: "Il vaut mieux que tu partes maintenant.", pourquoi: "Sujet tu → infinitif personnel : saíres." },
        { q: "Antes de eles ___ (chegar), arrumamos a casa.", choix: ["chegarem", "chegar", "chegam"], fr: "Avant qu'ils arrivent, nous rangeons la maison.", pourquoi: "Sujet eles → chegarem." },
        { q: "Obrigado por (vocês) ___ (vir).", choix: ["terem vindo", "ter vindo", "vieram"], fr: "Merci d'être venus.", pourquoi: "À plusieurs personnes → terem vindo." },
        { q: "É importante (nós) ___ (estudar) todos os dias.", choix: ["estudarmos", "estudar", "estudemos"], fr: "Il est important que nous étudiions tous les jours.", pourquoi: "Sujet nós → estudarmos." },
      ] },
    { id: "futuro-conjuntivo", niveau: 5, titre: "Le futur du subjonctif (quando puder, se quiseres)",
      astuce: "Après quando, se, logo que, enquanto, quem… pour le futur : passé à « eles » − ram + r, res, r, rmos, rem (quando puder, se quiseres).",
      explication: `Le portugais a un <b>futur du subjonctif</b>, pour une condition ou un moment <b>futur</b>.<br>
        Formation : passé à eles (puderam, quiseram, fizeram, foram) − <b>ram</b> + <b>r, res, r, rmos, rem</b> : <i>puder, quiseres, fizer, formos</i>.<br>
        Pour les verbes réguliers, il ressemble à l'infinitif : <i>Quando chegares, liga-me.</i><br>
        Emplois : <i>Quando puder, telefono-te.</i> (Quand je pourrai…) · <i>Se quiseres, vamos ao cinema.</i> (Si tu veux…) · <i>Quem chegar primeiro, abre a porta.</i>`,
      pourquoi: "Le français dit « quand je pourrai » (futur) et « si tu veux » (présent) ; le portugais utilise un temps spécial pour les deux. Repère : après quando ou se qui parlent du futur, pense au futur du subjonctif.",
      pieges: [["Quando posso, telefono-te.", "Quando puder, telefono-te.", "Moment futur après quando → futur du subjonctif."], ["Se queres, vamos ao cinema.", "Se quiseres, vamos ao cinema.", "Condition future après se → quiseres."], ["Quando fazer o relatório, envio-o.", "Quando fizer o relatório, envio-o.", "fazer → fizeram → fizer."]],
      exemples: [["Quando tiver tempo, vou visitar-te.", "Quand j'aurai le temps, j'irai te voir."], ["Se fores a Lisboa, prova os pastéis.", "Si tu vas à Lisbonne, goûte les pastéis."], ["Logo que souber, digo-te.", "Dès que je saurai, je te le dirai."]],
      exercices: [
        { q: "Quando eu ___ (poder), telefono-te.", choix: ["puder", "posso", "poder"], fr: "Quand je pourrai, je t'appellerai.", pourquoi: "poder → puderam → puder." },
        { q: "Se tu ___ (querer), vamos ao cinema.", choix: ["quiseres", "queres", "quereres"], fr: "Si tu veux, on va au cinéma.", pourquoi: "querer → quiseram → quiser → (tu) quiseres." },
        { q: "Se vocês ___ (ir) a Lisboa, provem os pastéis.", choix: ["forem", "vão", "irem"], fr: "Si vous allez à Lisbonne, goûtez les pastéis.", pourquoi: "ir → foram → for → (vocês) forem." },
        { q: "Logo que ela ___ (saber), diz-nos.", choix: ["souber", "sabe", "saber"], fr: "Dès qu'elle saura, elle nous le dira.", pourquoi: "saber → souberam → souber." },
      ] },
  );
})();
