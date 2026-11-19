/* Bibliothèque de prix indicatifs (France métropolitaine, HT, fourniture et pose sauf mention)
   ORDRES DE GRANDEUR seulement : ils varient fortement selon la région, l'accès, les quantités,
   la gamme des produits et l'année. Chaque utilisateur peut remplacer la valeur par « son prix ». */
window.PRIX = {
  maj: "fin 2026",
  categories: [
    { id: "terr", nom: "Terrassement et VRD", emoji: "🚜", items: [
      { id: "decapage", nom: "Décapage de terre végétale (≈ 20 cm)", unite: "m²", min: 2, max: 6 },
      { id: "fouille-rigole", nom: "Fouille en rigole à la pelle mécanique", unite: "m³", min: 25, max: 60 },
      { id: "evac-terres", nom: "Chargement et évacuation de terres (hors taxe de décharge spéciale)", unite: "m³", min: 20, max: 50 },
      { id: "remblai", nom: "Remblai compacté en grave", unite: "m³", min: 35, max: 70 },
      { id: "tranchee-reseau", nom: "Tranchée pour réseau, pose de fourreau et remblai", unite: "ml", min: 30, max: 80 }
    ] },
    { id: "go", nom: "Gros œuvre", emoji: "🏗️", items: [
      { id: "beton-proprete", nom: "Béton de propreté (5 cm)", unite: "m²", min: 10, max: 20 },
      { id: "semelle", nom: "Semelle filante en béton armé (50 × 25 cm env.)", unite: "ml", min: 80, max: 180 },
      { id: "dallage", nom: "Dallage béton armé 12 cm sur terre-plein", unite: "m²", min: 50, max: 100 },
      { id: "parpaing", nom: "Mur en blocs béton 20 cm, maçonné", unite: "m²", min: 50, max: 90 },
      { id: "voile", nom: "Voile béton armé banché 20 cm", unite: "m²", min: 120, max: 220 },
      { id: "plancher-hourdis", nom: "Plancher poutrelles-hourdis avec dalle de compression", unite: "m²", min: 60, max: 110 },
      { id: "chainage", nom: "Chaînage ou linteau béton armé", unite: "ml", min: 40, max: 90 },
      { id: "chape", nom: "Chape ciment 5 cm", unite: "m²", min: 20, max: 40 }
    ] },
    { id: "facade", nom: "Façade, charpente, couverture", emoji: "🏠", items: [
      { id: "enduit", nom: "Enduit monocouche de façade", unite: "m²", min: 30, max: 60 },
      { id: "ite", nom: "Isolation thermique par l'extérieur (ITE) sous enduit", unite: "m²", min: 120, max: 220 },
      { id: "charpente-fermettes", nom: "Charpente industrielle (fermettes)", unite: "m²", min: 40, max: 80 },
      { id: "tuiles", nom: "Couverture en tuiles terre cuite", unite: "m²", min: 60, max: 120 },
      { id: "gouttiere", nom: "Gouttière zinc posée", unite: "ml", min: 40, max: 90 }
    ] },
    { id: "second", nom: "Plâtrerie, isolation, menuiserie", emoji: "🧱", items: [
      { id: "cloison", nom: "Cloison en plaques de plâtre (type 72/48)", unite: "m²", min: 30, max: 55 },
      { id: "doublage", nom: "Doublage isolant collé (complexe plaque + isolant)", unite: "m²", min: 30, max: 55 },
      { id: "faux-plafond", nom: "Plafond en plaques de plâtre sur ossature", unite: "m²", min: 35, max: 60 },
      { id: "combles", nom: "Isolation de combles perdus par soufflage", unite: "m²", min: 20, max: 40 },
      { id: "porte-int", nom: "Bloc-porte intérieur posé", unite: "u", min: 200, max: 600 },
      { id: "fenetre", nom: "Fenêtre PVC double vitrage (taille courante) posée", unite: "u", min: 400, max: 1000 }
    ] },
    { id: "finitions", nom: "Revêtements et finitions", emoji: "🎨", items: [
      { id: "ragreage", nom: "Ragréage de sol", unite: "m²", min: 15, max: 30 },
      { id: "carrelage", nom: "Carrelage de sol, fourniture milieu de gamme et pose", unite: "m²", min: 50, max: 110 },
      { id: "faience", nom: "Faïence murale posée", unite: "m²", min: 50, max: 100 },
      { id: "stratifie", nom: "Parquet stratifié posé avec sous-couche", unite: "m²", min: 25, max: 50 },
      { id: "peinture", nom: "Peinture murs (préparation + 2 couches)", unite: "m²", min: 20, max: 40 },
      { id: "plinthe", nom: "Plinthe posée", unite: "ml", min: 10, max: 25 }
    ] },
    { id: "lots-tech", nom: "Électricité et plomberie", emoji: "🔌", items: [
      { id: "prise", nom: "Point électrique (prise ou point lumineux) en neuf", unite: "u", min: 60, max: 150 },
      { id: "tableau", nom: "Tableau électrique équipé", unite: "u", min: 800, max: 1800 },
      { id: "wc", nom: "WC posé et raccordé", unite: "u", min: 300, max: 800 },
      { id: "lavabo", nom: "Lavabo ou vasque posé avec robinetterie", unite: "u", min: 300, max: 900 },
      { id: "chauffe-eau", nom: "Chauffe-eau électrique 200 L posé", unite: "u", min: 800, max: 1600 }
    ] },
    { id: "demol", nom: "Démolition et chantier", emoji: "🧰", items: [
      { id: "demol-cloison", nom: "Démolition de cloison légère, évacuation comprise", unite: "m²", min: 15, max: 35 },
      { id: "depose-carrelage", nom: "Dépose de carrelage au sol", unite: "m²", min: 15, max: 35 },
      { id: "benne", nom: "Benne à gravats 8–10 m³ (location + traitement)", unite: "u", min: 250, max: 650 },
      { id: "minipelle", nom: "Mini-pelle avec conducteur", unite: "jour", min: 400, max: 750 },
      { id: "echafaudage", nom: "Échafaudage de façade (montage, location 1 mois, démontage)", unite: "m²", min: 10, max: 25 },
      { id: "main-oeuvre", nom: "Heure de main-d'œuvre facturée (ouvrier qualifié)", unite: "h", min: 35, max: 60 }
    ] }
  ],
  tva: [
    { taux: 20, label: "20 % — taux normal (construction neuve, locaux professionnels…)" },
    { taux: 10, label: "10 % — travaux de rénovation dans un logement de plus de 2 ans (sous conditions)" },
    { taux: 5.5, label: "5,5 % — travaux de rénovation énergétique éligibles dans un logement de plus de 2 ans" }
  ]
};
