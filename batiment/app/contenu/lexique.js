/* Lexique du chantier en plusieurs langues.
   Traductions courantes, à faire relire par un locuteur natif avant usage professionnel. */
window.LEXIQUE = {
  langues: [
    { id: "en", nom: "Anglais", drapeau: "🇬🇧", voix: "en-GB" },
    { id: "es", nom: "Espagnol", drapeau: "🇪🇸", voix: "es-ES" },
    { id: "pt", nom: "Portugais", drapeau: "🇵🇹", voix: "pt-PT" },
    { id: "ro", nom: "Roumain", drapeau: "🇷🇴", voix: "ro-RO" },
    { id: "pl", nom: "Polonais", drapeau: "🇵🇱", voix: "pl-PL" },
    { id: "ar", nom: "Arabe", drapeau: "🌍", voix: "ar-SA", rtl: true }
  ],
  categories: [
    { id: "secu", nom: "Sécurité et urgences", emoji: "⛑️", mots: [
      { fr: "Attention !", en: "Watch out!", es: "¡Cuidado!", pt: "Cuidado!", ro: "Atenție!", pl: "Uwaga!", ar: "انتبه!" },
      { fr: "Stop ! Arrête !", en: "Stop!", es: "¡Para!", pt: "Pára!", ro: "Stop! Oprește-te!", pl: "Stój!", ar: "توقف!" },
      { fr: "Danger", en: "Danger", es: "Peligro", pt: "Perigo", ro: "Pericol", pl: "Niebezpieczeństwo", ar: "خطر" },
      { fr: "Mets ton casque", en: "Put your hard hat on", es: "Ponte el casco", pt: "Põe o capacete", ro: "Pune-ți casca", pl: "Załóż kask", ar: "البس الخوذة" },
      { fr: "Mets tes gants", en: "Put your gloves on", es: "Ponte los guantes", pt: "Põe as luvas", ro: "Pune-ți mănușile", pl: "Załóż rękawice", ar: "البس القفازات" },
      { fr: "Mets tes lunettes de protection", en: "Put your safety glasses on", es: "Ponte las gafas de protección", pt: "Põe os óculos de proteção", ro: "Pune-ți ochelarii de protecție", pl: "Załóż okulary ochronne", ar: "البس النظارات الواقية" },
      { fr: "Ne passe pas sous la charge", en: "Don't walk under the load", es: "No pases debajo de la carga", pt: "Não passes debaixo da carga", ro: "Nu trece pe sub sarcină", pl: "Nie przechodź pod ładunkiem", ar: "لا تمرّ تحت الحمولة" },
      { fr: "Éloigne-toi de l'engin", en: "Keep away from the machine", es: "Aléjate de la máquina", pt: "Afasta-te da máquina", ro: "Stai departe de utilaj", pl: "Odsuń się od maszyny", ar: "ابتعد عن الآلة" },
      { fr: "Attache ton harnais", en: "Clip on your harness", es: "Engancha el arnés", pt: "Prende o arnês", ro: "Prinde-ți hamul", pl: "Przypnij uprząż", ar: "اربط حزام الأمان" },
      { fr: "Il y a un blessé", en: "Someone is injured", es: "Hay un herido", pt: "Há um ferido", ro: "Este un rănit", pl: "Jest ranny", ar: "يوجد مصاب" },
      { fr: "Appelle les secours (112)", en: "Call the emergency services (112)", es: "Llama a emergencias (112)", pt: "Liga para o 112", ro: "Sună la 112", pl: "Zadzwoń pod 112", ar: "اتصل بالإسعاف (112)" },
      { fr: "Où est la trousse de secours ?", en: "Where is the first aid kit?", es: "¿Dónde está el botiquín?", pt: "Onde está a caixa de primeiros socorros?", ro: "Unde este trusa de prim ajutor?", pl: "Gdzie jest apteczka?", ar: "أين حقيبة الإسعافات الأولية؟" }
    ] },
    { id: "orga", nom: "Organisation du travail", emoji: "🗣️", mots: [
      { fr: "Bonjour, je suis le chef d'équipe", en: "Hello, I'm the team leader", es: "Hola, soy el jefe de equipo", pt: "Bom dia, sou o chefe de equipa", ro: "Bună ziua, eu sunt șeful de echipă", pl: "Dzień dobry, jestem brygadzistą", ar: "مرحبًا، أنا رئيس الفريق" },
      { fr: "On commence à 7 h 30", en: "We start at 7:30", es: "Empezamos a las 7:30", pt: "Começamos às 7h30", ro: "Începem la 7:30", pl: "Zaczynamy o 7:30", ar: "نبدأ الساعة السابعة والنصف" },
      { fr: "C'est la pause", en: "It's break time", es: "Es la hora del descanso", pt: "É a pausa", ro: "Este pauză", pl: "Jest przerwa", ar: "وقت الاستراحة" },
      { fr: "On a fini pour aujourd'hui", en: "We're done for today", es: "Hemos terminado por hoy", pt: "Acabámos por hoje", ro: "Am terminat pe azi", pl: "Kończymy na dziś", ar: "انتهينا لهذا اليوم" },
      { fr: "Apporte-moi ça", en: "Bring me that", es: "Tráeme eso", pt: "Traz-me isso", ro: "Adu-mi asta", pl: "Przynieś mi to", ar: "أحضر لي هذا" },
      { fr: "Combien ?", en: "How many?", es: "¿Cuántos?", pt: "Quantos?", ro: "Câte?", pl: "Ile?", ar: "كم؟" },
      { fr: "Je n'ai pas compris, répète s'il te plaît", en: "I didn't understand, please say it again", es: "No he entendido, repite por favor", pt: "Não percebi, repete por favor", ro: "N-am înțeles, repetă te rog", pl: "Nie zrozumiałem, powtórz proszę", ar: "لم أفهم، أعد من فضلك" },
      { fr: "Montre-moi", en: "Show me", es: "Enséñame", pt: "Mostra-me", ro: "Arată-mi", pl: "Pokaż mi", ar: "أرني" },
      { fr: "C'est bon, c'est fini", en: "That's good, it's finished", es: "Está bien, está terminado", pt: "Está bom, está acabado", ro: "E bine, e gata", pl: "Dobrze, gotowe", ar: "حسنًا، انتهى" },
      { fr: "À gauche / à droite", en: "To the left / to the right", es: "A la izquierda / a la derecha", pt: "À esquerda / à direita", ro: "La stânga / la dreapta", pl: "W lewo / w prawo", ar: "إلى اليسار / إلى اليمين" },
      { fr: "Plus haut / plus bas", en: "Higher / lower", es: "Más arriba / más abajo", pt: "Mais acima / mais abaixo", ro: "Mai sus / mai jos", pl: "Wyżej / niżej", ar: "أعلى / أسفل" }
    ] },
    { id: "epi", nom: "Équipements et outils", emoji: "🧰", mots: [
      { fr: "Casque", en: "Hard hat", es: "Casco", pt: "Capacete", ro: "Cască", pl: "Kask", ar: "خوذة" },
      { fr: "Gants", en: "Gloves", es: "Guantes", pt: "Luvas", ro: "Mănuși", pl: "Rękawice", ar: "قفازات" },
      { fr: "Chaussures de sécurité", en: "Safety boots", es: "Calzado de seguridad", pt: "Botas de segurança", ro: "Bocanci de protecție", pl: "Buty ochronne", ar: "أحذية السلامة" },
      { fr: "Gilet haute visibilité", en: "Hi-vis vest", es: "Chaleco reflectante", pt: "Colete refletor", ro: "Vestă reflectorizantă", pl: "Kamizelka odblaskowa", ar: "سترة عاكسة" },
      { fr: "Harnais", en: "Harness", es: "Arnés", pt: "Arnês", ro: "Ham de siguranță", pl: "Szelki bezpieczeństwa", ar: "حزام أمان" },
      { fr: "Échafaudage", en: "Scaffolding", es: "Andamio", pt: "Andaime", ro: "Schelă", pl: "Rusztowanie", ar: "سقالة" },
      { fr: "Échelle", en: "Ladder", es: "Escalera de mano", pt: "Escada de mão", ro: "Scară", pl: "Drabina", ar: "سلّم" },
      { fr: "Brouette", en: "Wheelbarrow", es: "Carretilla", pt: "Carrinho de mão", ro: "Roabă", pl: "Taczka", ar: "عربة يدوية" },
      { fr: "Pelle", en: "Shovel", es: "Pala", pt: "Pá", ro: "Lopată", pl: "Łopata", ar: "مجرفة" },
      { fr: "Marteau", en: "Hammer", es: "Martillo", pt: "Martelo", ro: "Ciocan", pl: "Młotek", ar: "مطرقة" },
      { fr: "Niveau à bulle", en: "Spirit level", es: "Nivel de burbuja", pt: "Nível de bolha", ro: "Nivelă", pl: "Poziomica", ar: "ميزان الماء" },
      { fr: "Mètre ruban", en: "Tape measure", es: "Cinta métrica", pt: "Fita métrica", ro: "Ruletă", pl: "Miarka zwijana", ar: "شريط قياس" },
      { fr: "Perceuse", en: "Drill", es: "Taladro", pt: "Berbequim", ro: "Bormașină", pl: "Wiertarka", ar: "مثقاب" },
      { fr: "Meuleuse", en: "Angle grinder", es: "Amoladora", pt: "Rebarbadora", ro: "Polizor unghiular", pl: "Szlifierka kątowa", ar: "جلّاخة" },
      { fr: "Grue", en: "Crane", es: "Grúa", pt: "Grua", ro: "Macara", pl: "Dźwig", ar: "رافعة" },
      { fr: "Pelleteuse", en: "Excavator", es: "Excavadora", pt: "Escavadora", ro: "Excavator", pl: "Koparka", ar: "حفّارة" },
      { fr: "Bétonnière", en: "Concrete mixer", es: "Hormigonera", pt: "Betoneira", ro: "Betonieră", pl: "Betoniarka", ar: "خلاطة خرسانة" }
    ] },
    { id: "mat", nom: "Matériaux et gros œuvre", emoji: "🧱", mots: [
      { fr: "Béton", en: "Concrete", es: "Hormigón", pt: "Betão", ro: "Beton", pl: "Beton", ar: "خرسانة" },
      { fr: "Ciment", en: "Cement", es: "Cemento", pt: "Cimento", ro: "Ciment", pl: "Cement", ar: "إسمنت" },
      { fr: "Sable", en: "Sand", es: "Arena", pt: "Areia", ro: "Nisip", pl: "Piasek", ar: "رمل" },
      { fr: "Gravier", en: "Gravel", es: "Grava", pt: "Brita", ro: "Pietriș", pl: "Żwir", ar: "حصى" },
      { fr: "Mortier", en: "Mortar", es: "Mortero", pt: "Argamassa", ro: "Mortar", pl: "Zaprawa", ar: "ملاط" },
      { fr: "Parpaing", en: "Concrete block", es: "Bloque de hormigón", pt: "Bloco de cimento", ro: "Bolțar", pl: "Pustak betonowy", ar: "بلوك إسمنتي" },
      { fr: "Brique", en: "Brick", es: "Ladrillo", pt: "Tijolo", ro: "Cărămidă", pl: "Cegła", ar: "طوب" },
      { fr: "Ferraillage, armatures", en: "Rebar, reinforcement", es: "Ferralla, armaduras", pt: "Armaduras, ferro", ro: "Armătură", pl: "Zbrojenie", ar: "حديد التسليح" },
      { fr: "Coffrage", en: "Formwork", es: "Encofrado", pt: "Cofragem", ro: "Cofraj", pl: "Szalunek", ar: "قالب الصبّ" },
      { fr: "Banche", en: "Wall formwork panel", es: "Panel de encofrado", pt: "Painel de cofragem", ro: "Panou de cofraj", pl: "Płyta szalunkowa", ar: "لوح قالب الجدران" },
      { fr: "Plaque de plâtre", en: "Plasterboard", es: "Placa de yeso", pt: "Placa de gesso cartonado", ro: "Placă de gips-carton", pl: "Płyta gipsowo-kartonowa", ar: "لوح جبس" },
      { fr: "Tranchée", en: "Trench", es: "Zanja", pt: "Vala", ro: "Șanț", pl: "Wykop", ar: "خندق" }
    ] },
    { id: "actions", nom: "Les gestes du chantier", emoji: "💪", mots: [
      { fr: "Couler le béton", en: "Pour the concrete", es: "Verter el hormigón", pt: "Betonar", ro: "A turna betonul", pl: "Wylać beton", ar: "صبّ الخرسانة" },
      { fr: "Creuser", en: "Dig", es: "Cavar", pt: "Escavar", ro: "A săpa", pl: "Kopać", ar: "يحفر" },
      { fr: "Porter", en: "Carry", es: "Cargar", pt: "Carregar", ro: "A căra", pl: "Nosić", ar: "يحمل" },
      { fr: "Couper", en: "Cut", es: "Cortar", pt: "Cortar", ro: "A tăia", pl: "Ciąć", ar: "يقطع" },
      { fr: "Mesurer", en: "Measure", es: "Medir", pt: "Medir", ro: "A măsura", pl: "Mierzyć", ar: "يقيس" },
      { fr: "Monter l'échafaudage", en: "Put up the scaffolding", es: "Montar el andamio", pt: "Montar o andaime", ro: "A monta schela", pl: "Postawić rusztowanie", ar: "تركيب السقالة" },
      { fr: "Nettoyer le chantier", en: "Clean up the site", es: "Limpiar la obra", pt: "Limpar a obra", ro: "A curăța șantierul", pl: "Posprzątać budowę", ar: "تنظيف الورشة" }
    ] }
  ]
};
