// Réglages généraux de Jack Blabla. Le contenu de chaque langue est dans contenu/<code>.js

// Drapeaux dessinés en SVG (les emojis drapeaux ne s'affichent pas sous Windows).
const svgDrapeau = (contenu) => `<svg class="drapeau" viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${contenu}</svg>`;

// Badge rond d'un pays : drapeau en médaillon + petit personnage typique
function badgePays(code, taille = "") {
  const l = LANGUES[code];
  return `<span class="badge-pays ${taille}" style="--pays:${l.couleur}" aria-hidden="true">
    <span class="badge-drapeau">${l.drapeau}</span>
    <span class="badge-perso" title="${l.persoNom}">${l.perso}</span>
  </span>`;
}

const LANGUES = {
  en: {
    nom: "Anglais", voix: "en-GB", bonjour: "Hello!", accents: [],
    nomLocal: "English", adj: "anglaise", perso: "💂", persoNom: "Garde royal de Londres", couleur: "#2b5cc4",
    drapeau: svgDrapeau(`<rect width="60" height="40" fill="#012169"/><path d="M0,0 60,40M60,0 0,40" stroke="#fff" stroke-width="8"/><path d="M0,0 60,40M60,0 0,40" stroke="#C8102E" stroke-width="3"/><path d="M30,0V40M0,20H60" stroke="#fff" stroke-width="12"/><path d="M30,0V40M0,20H60" stroke="#C8102E" stroke-width="7"/>`),
  },
  es: {
    nom: "Espagnol", voix: "es-ES", bonjour: "¡Hola!", accents: ["á", "é", "í", "ó", "ú", "ñ", "ü"],
    nomLocal: "Español", adj: "espagnole", perso: "💃", persoNom: "Danseuse de flamenco", couleur: "#e8a400",
    drapeau: svgDrapeau(`<rect width="60" height="40" fill="#AA151B"/><rect y="10" width="60" height="20" fill="#F1BF00"/>`),
  },
  de: {
    nom: "Allemand", voix: "de-DE", bonjour: "Hallo!", accents: ["ä", "ö", "ü", "ß"],
    nomLocal: "Deutsch", adj: "allemande", perso: "🥨", persoNom: "Bretzel de Bavière", couleur: "#d40000",
    drapeau: svgDrapeau(`<rect width="60" height="40" fill="#000"/><rect y="13.33" width="60" height="13.34" fill="#DD0000"/><rect y="26.67" width="60" height="13.33" fill="#FFCE00"/>`),
  },
  it: {
    nom: "Italien", voix: "it-IT", bonjour: "Ciao!", accents: ["à", "è", "é", "ì", "ò", "ù"],
    nomLocal: "Italiano", adj: "italienne", perso: "🍕", persoNom: "Pizza napolitaine", couleur: "#009246",
    drapeau: svgDrapeau(`<rect width="20" height="40" fill="#009246"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#CE2B37"/>`),
  },
  // Portugais du Portugal (les différences du Brésil sont signalées dans les leçons)
  pt: {
    nom: "Portugais", voix: "pt-PT", bonjour: "Olá!", accents: ["á", "à", "â", "ã", "é", "ê", "í", "ó", "ô", "õ", "ú", "ç"],
    nomLocal: "Português", adj: "portugaise", perso: "🐓", persoNom: "Coq de Barcelos", couleur: "#046A38",
    drapeau: svgDrapeau(`<rect width="60" height="40" fill="#DA291C"/><rect width="24" height="40" fill="#046A38"/><circle cx="24" cy="20" r="7.5" fill="#FFE100"/><circle cx="24" cy="20" r="4.6" fill="#DA291C"/><rect x="21.6" y="16.6" width="4.8" height="6.4" rx="1.2" fill="#fff"/>`),
  },
  // Pour les francophones : maîtriser l'orthographe, la grammaire et la conjugaison (façon Bescherelle)
  fr: {
    nom: "Français", voix: "fr-FR", bonjour: "Bonjour !", accents: ["é", "è", "ê", "à", "â", "ù", "û", "ç", "ô", "î", "ï", "ë", "œ"],
    nomLocal: "Orthographe, grammaire, conjugaison", adj: "française", perso: "🥖", persoNom: "Baguette de Paris", couleur: "#1f4fbf",
    drapeau: svgDrapeau(`<rect width="20" height="40" fill="#002395"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#ED2939"/>`),
  },
};

// Les six paliers, du débutant au professionnel. On débloque le suivant en réussissant le test de passage.
const NIVEAUX = [
  { nom: "Amateur", code: "A1–A2", emoji: "🌱", desc: "Les bases : se présenter, compter, commander, le présent." },
  { nom: "Moyen", code: "A2–B1", emoji: "🌿", desc: "Raconter au passé, parler du futur, la vie de tous les jours." },
  { nom: "Autonome", code: "B1", emoji: "🌳", desc: "Donner son avis, nuancer, le conditionnel, les expressions." },
  { nom: "Avancé", code: "B2", emoji: "🦜", desc: "Argumenter, raconter avec précision, comprendre les médias." },
  { nom: "Pro", code: "B2–C1", emoji: "💼", desc: "Mails, réunions, téléphone, présenter et négocier au travail." },
  { nom: "Expert", code: "C1", emoji: "🏆", desc: "Nuances, registres, tournures avancées : parler comme un natif." },
];

// Parcours conseillé sur 6 mois (26 semaines) : semaine de début de chaque niveau.
const PARCOURS_SEMAINES = [1, 5, 9, 14, 19, 24];
const PARCOURS_TOTAL = 26;

const SEUIL_TEST = 7; // ancien test (10 questions)
const SEUIL_TEST_12 = 9; // test de passage : 9 bonnes réponses sur 12 pour passer au niveau suivant

// Rempli par contenu/en.js, contenu/es.js, contenu/de.js
const CONTENU = {};
