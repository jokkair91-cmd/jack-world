/* Cours : apprendre à faire un devis de travaux */
window.COURS_DEVIS = {
  id: "devis", nom: "Faire un devis", emoji: "🧾",
  modules: [
    {
      id: "etapes", emoji: "🗺️", titre: "Les étapes d'un devis", duree: "15 min",
      intro: "De la demande du client à la signature.",
      sections: [
        { titre: "Le chemin complet", liste: [
          "**1. Écouter la demande** : qu'est-ce que le client veut vraiment, pour quand, avec quel budget ?",
          "**2. Visiter le chantier** : mesurer, photographier, repérer l'accès, l'état des supports, les réseaux, les contraintes (étage, stationnement, voisins, amiante possible dans l'ancien…).",
          "**3. Faire le métré** (les quantités) poste par poste.",
          "**4. Chiffrer** chaque poste : main-d'œuvre, matériaux, matériel, sous-traitance, puis le prix de vente.",
          "**5. Rédiger** le devis avec les mentions obligatoires et une description claire.",
          "**6. Envoyer, expliquer, relancer** — et négocier sans brader.",
          "**7. Signature** : le devis signé « bon pour accord » devient le contrat."
        ] },
        { titre: "Pourquoi c'est important", texte: [
          "Un devis trop bas fait perdre de l'argent pendant tout le chantier ; un devis flou provoque des litiges. Un bon devis est **juste** (le bon prix), **clair** (le client comprend ce qu'il achète) et **complet** (rien d'oublié).",
          "Le devis signé engage l'entreprise sur le prix et le contenu : tout ce qui n'y est pas écrit sera difficile à faire payer."] }
      ],
      retenir: [
        "Demande → visite → métré → chiffrage → rédaction → envoi/relance → signature.",
        "Toujours visiter avant de chiffrer (sauf très petit travail bien défini).",
        "Ce qui n'est pas écrit dans le devis n'est pas vendu."
      ],
      terrain: "Pendant la visite, prends des photos de chaque pièce et de l'accès (escalier, porte, stationnement). Au bureau, c'est ce qui t'évite d'oublier un échafaudage ou un monte-matériaux.",
      quiz: [
        { q: "Quelle étape vient juste avant le chiffrage ?", choix: ["Le métré (les quantités)", "La signature", "La facture"], ok: 0, pourquoi: "On chiffre des quantités : il faut d'abord les mesurer et les calculer." },
        { q: "Pourquoi visiter le chantier avant de chiffrer ?", choix: ["Pour voir l'accès, les supports et les contraintes qui changent le prix", "Ce n'est pas utile", "Pour faire signer tout de suite"], ok: 0, pourquoi: "Un 4e étage sans ascenseur ou un mur en mauvais état changent beaucoup le prix." },
        { q: "Un devis signé « bon pour accord »…", choix: ["Engage les deux parties comme un contrat", "N'a aucune valeur", "Engage seulement le client"], ok: 0, pourquoi: "Accepté par le client, le devis vaut contrat sur le prix et le contenu." },
        { q: "Les trois qualités d'un bon devis :", choix: ["Juste, clair, complet", "Long, technique, cher", "Rapide, oral, approximatif"], ok: 0, pourquoi: "Le bon prix, compréhensible, sans oubli." },
        { q: "Un travail oublié dans le devis…", choix: ["Sera difficile à faire payer", "Est payé automatiquement", "N'a pas d'importance"], ok: 0, pourquoi: "Le client a accepté un contenu précis ; le reste demande un nouveau devis ou un avenant." }
      ]
    },
    {
      id: "metre", emoji: "📏", titre: "Le métré : calculer les quantités", duree: "20 min",
      intro: "Mesurer juste et compter dans la bonne unité.",
      sections: [
        { titre: "Les unités du bâtiment", liste: [
          "**m²** : surfaces (murs, sols, cloisons, peinture, carrelage, toiture).",
          "**m³** : volumes (béton, terrassement, remblai).",
          "**ml** (mètre linéaire) : longueurs (plinthes, gouttières, semelles, tranchées).",
          "**u** (unité) : éléments comptés (portes, fenêtres, prises, WC).",
          "**forfait (ft / ens.)** : un ensemble difficile à décomposer (installation de chantier, nettoyage final)."
        ] },
        { titre: "Méthode", liste: [
          "Travailler **pièce par pièce** ou **ouvrage par ouvrage**, dans un tableau : désignation, calcul détaillé, quantité.",
          "Écrire le calcul (ex. « 2 × (4,20 + 3,50) × 2,50 − 1,80 ») : on peut le vérifier et le retrouver.",
          "Déduire les ouvertures quand c'est la règle de l'entreprise ou du marché (les conventions de métré varient : note celle que tu appliques).",
          "Ajouter une **marge de pertes** sur les matériaux (coupes, casse) — pas sur la quantité vendue au client, sauf si c'est la convention.",
          "Contrôler par un ordre de grandeur : une chambre de 12 m² n'a pas 80 m² de murs."
        ] },
        { titre: "Exemple : peindre une chambre", texte: [
          "Chambre 4,20 × 3,50 m, hauteur 2,50 m, une porte (0,90 × 2,04) et une fenêtre (1,20 × 1,35).",
          "Murs : 2 × (4,20 + 3,50) × 2,50 = 38,50 m². Ouvertures : 1,84 + 1,62 = 3,46 m². Murs à peindre ≈ **35,04 m²**. Plafond : 4,20 × 3,50 = **14,70 m²**."] }
      ],
      retenir: [
        "m² surfaces, m³ volumes, ml longueurs, u éléments, ft forfait.",
        "Écrire le détail du calcul pour pouvoir le vérifier.",
        "Pertes sur l'achat de matériaux ; contrôle par ordre de grandeur."
      ],
      terrain: "Utilise le calculateur « Surfaces » de la Boîte à outils pour vérifier tes métrés de pièces, et AutoCAD (commande AIRE) quand tu as un plan DWG.",
      quiz: [
        { q: "Dans quelle unité compte-t-on des plinthes ?", choix: ["ml (mètre linéaire)", "m³", "u"], ok: 0, pourquoi: "Une plinthe se mesure en longueur." },
        { q: "Dans quelle unité compte-t-on du béton de fondation ?", choix: ["m³", "m²", "ml"], ok: 0, pourquoi: "Le béton se commande et se chiffre en volume." },
        { q: "Pièce de 5 × 4 m, hauteur 2,50 m, sans ouverture : surface des murs ?", choix: ["45 m²", "20 m²", "50 m²"], ok: 0, pourquoi: "Périmètre 2 × (5 + 4) = 18 m ; 18 × 2,50 = 45 m²." },
        { q: "Pourquoi écrire le détail du calcul dans le métré ?", choix: ["Pour pouvoir le vérifier et le retrouver", "Pour faire plus long", "C'est interdit"], ok: 0, pourquoi: "Un calcul écrit se contrôle ; un chiffre seul ne se discute pas… jusqu'à l'erreur." },
        { q: "Les pertes de carrelage (coupes, casse) se prévoient…", choix: ["Sur la quantité de matériaux à acheter", "En oubliant de les compter", "En doublant le prix de pose"], ok: 0, pourquoi: "On achète plus que la surface pour couvrir coupes et casse (souvent 5 à 15 % selon la pose)." }
      ]
    },
    {
      id: "chiffrer", emoji: "🧮", titre: "Chiffrer : du déboursé sec au prix", duree: "25 min",
      intro: "Transformer des quantités en prix de vente sans perdre d'argent.",
      sections: [
        { titre: "Le déboursé sec d'un poste", liste: [
          "**Main-d'œuvre** = quantité ÷ rendement × coût horaire chargé. Ex. : 35 m² de peinture à 4 m²/h = 8,75 h ; × 35 €/h = 306 €.",
          "**Matériaux** = quantités achetées (pertes comprises) × prix d'achat fournisseur.",
          "**Matériel** : location, consommables, petit outillage.",
          "**Sous-traitance** : le prix du sous-traitant pour sa partie."
        ] },
        { titre: "Du déboursé sec au prix de vente", texte: [
          "Prix de vente HT = (déboursé sec + frais de chantier) × **coefficient**. Le coefficient couvre les frais généraux (bureau, véhicules, assurances, comptable…), les aléas et la marge.",
          "Le coefficient se calcule à partir des comptes de l'entreprise : on ne l'invente pas. Un coefficient trop faible = on travaille pour rien."] },
        { titre: "Les oublis classiques", liste: [
          "Installation, protection des sols et des meubles, nettoyage de fin de chantier.",
          "Évacuation des déchets (benne, déchetterie) et tri.",
          "Accès difficile : étages, échafaudage, monte-matériaux, stationnement payant.",
          "Temps de trajet et d'approvisionnement, préparation des supports (rebouchage, ponçage, ragréage).",
          "Démarches : arrêté de voirie, DICT si on creuse."
        ] }
      ],
      retenir: [
        "MO = quantité ÷ rendement × coût horaire chargé.",
        "Prix de vente HT = (DS + frais de chantier) × coefficient.",
        "Penser aux oublis : protection, déchets, accès, préparation, nettoyage."
      ],
      terrain: "Note tes rendements réels à la fin de chaque chantier (m² de carrelage par jour, etc.). C'est ce qui rend tes devis justes : un rendement inventé est la première cause de chantiers déficitaires.",
      quiz: [
        { q: "40 m² de carrelage, rendement 1 m²/h, coût horaire chargé 38 € : coût de main-d'œuvre ?", choix: ["1 520 €", "380 €", "40 €"], ok: 0, pourquoi: "40 ÷ 1 = 40 h ; 40 × 38 = 1 520 €." },
        { q: "Le coefficient appliqué au déboursé sec couvre…", choix: ["Frais généraux, aléas et marge", "Uniquement la TVA", "Les matériaux"], ok: 0, pourquoi: "La TVA s'ajoute à la fin ; le coefficient couvre les frais de structure et la marge." },
        { q: "Lequel est un oubli classique dans un devis ?", choix: ["L'évacuation des déchets", "La quantité principale", "Le nom du client"], ok: 0, pourquoi: "Benne, déchetterie, tri : ça coûte et c'est souvent oublié." },
        { q: "DS = 2 000 €, frais de chantier 100 €, coefficient 1,30 : prix de vente HT ?", choix: ["2 730 €", "2 600 €", "2 100 €"], ok: 0, pourquoi: "(2 000 + 100) × 1,30 = 2 730 €." },
        { q: "D'où doivent venir les rendements utilisés ?", choix: ["De l'expérience réelle de l'entreprise", "D'une estimation au hasard", "Du client"], ok: 0, pourquoi: "Les rendements mesurés sur les chantiers passés sont la base d'un chiffrage fiable." }
      ]
    },
    {
      id: "mentions", emoji: "📝", titre: "Rédiger : mentions obligatoires et description", duree: "20 min",
      intro: "Un devis qui protège l'entreprise et que le client comprend.",
      sections: [
        { titre: "Les informations à faire figurer", texte: [
          "Pour un devis de travaux à un particulier, la réglementation impose de nombreuses informations. Les principales :"],
          liste: [
            "Date du devis et **durée de validité** de l'offre.",
            "Entreprise : nom ou raison sociale, adresse, forme juridique, **numéro SIREN/SIRET**, immatriculation (RCS ou répertoire des métiers), numéro de TVA intracommunautaire si assujettie.",
            "Client : nom et adresse ; **adresse du chantier**.",
            "Pour chaque prestation : **désignation précise**, quantité, unité, **prix unitaire HT**, total HT.",
            "Total HT, **taux et montant de TVA**, total TTC ; frais de déplacement le cas échéant.",
            "Délai d'exécution ou date de début, conditions de paiement (acompte, échéances).",
            "**Assurance professionnelle** : pour les travaux soumis à l'assurance décennale, le nom de l'assureur et la couverture géographique.",
            "Si le devis est payant, le client doit en être informé **avant** de l'établir.",
            "Pour les clients consommateurs : les coordonnées du **médiateur de la consommation** ; et si le contrat est signé hors établissement (chez le client), l'information sur le **droit de rétractation**."
          ] },
        { titre: "Bien décrire", liste: [
          "Une ligne = un ouvrage identifiable : « Fourniture et pose de carrelage grès cérame 60 × 60, collé, joints gris, y compris plinthes assorties ».",
          "Préciser ce qui est **compris** et **non compris** (ex. « ragréage non compris », « évacuation des gravats comprise »).",
          "Indiquer les marques/gammes ou « équivalent » pour éviter les malentendus.",
          "Regrouper par lots ou par pièces pour que le client s'y retrouve."
        ] }
      ],
      danger: "Les règles exactes (mentions, médiation, rétractation, assurance) évoluent : vérifie-les sur les sites officiels (service-public.fr pour les entreprises, DGCCRF) ou auprès de ta fédération professionnelle avant d'établir tes modèles de devis.",
      retenir: [
        "Date, validité, identité complète de l'entreprise et du client, adresse du chantier.",
        "Désignation précise, quantités, PU HT, totaux, TVA, TTC.",
        "Assurance décennale (assureur + zone) pour les travaux concernés.",
        "Toujours écrire ce qui est compris et non compris."
      ],
      terrain: "Fais un modèle de devis une fois pour toutes (en-tête, mentions, conditions) et fais-le relire par ta fédération ou ton comptable. Ensuite tu ne remplis plus que les lignes.",
      quiz: [
        { q: "Laquelle de ces informations doit figurer sur un devis ?", choix: ["La durée de validité de l'offre", "Le salaire des ouvriers", "La marge de l'entreprise"], ok: 0, pourquoi: "La validité dit jusqu'à quand le prix est garanti ; la marge n'a pas à apparaître." },
        { q: "Pour des travaux soumis à la décennale, le devis mentionne…", choix: ["L'assureur et la couverture géographique", "Rien sur l'assurance", "Le numéro de sécurité sociale du gérant"], ok: 0, pourquoi: "L'information sur l'assurance professionnelle obligatoire doit apparaître sur devis et factures." },
        { q: "Une bonne désignation de ligne est…", choix: ["Précise : produit, dimensions, mise en œuvre, ce qui est compris", "« Travaux divers »", "Un seul mot"], ok: 0, pourquoi: "« Travaux divers » ne protège ni le client ni l'entreprise." },
        { q: "Un devis payant…", choix: ["Doit être annoncé au client avant d'être établi", "Peut être facturé sans prévenir", "Est interdit"], ok: 0, pourquoi: "Le client doit savoir à l'avance que le devis sera facturé." },
        { q: "Pourquoi écrire « ragréage non compris » ?", choix: ["Pour éviter un litige sur ce qui est inclus", "Pour faire peur au client", "Ça ne sert à rien"], ok: 0, pourquoi: "Les « non compris » évitent que le client pense avoir acheté une prestation que tu n'as pas chiffrée." }
      ]
    },
    {
      id: "tva-paiement", emoji: "💶", titre: "TVA, acompte et conditions de paiement", duree: "15 min",
      intro: "Appliquer le bon taux et se faire payer sans risque.",
      sections: [
        { titre: "Les taux de TVA dans le bâtiment (France)", liste: [
          "**20 %** : taux normal (construction neuve, locaux professionnels, logement de moins de 2 ans…).",
          "**10 %** : travaux d'amélioration, de transformation, d'aménagement et d'entretien dans un logement achevé depuis plus de 2 ans, sous conditions.",
          "**5,5 %** : travaux de rénovation énergétique éligibles dans un logement de plus de 2 ans, sous conditions.",
          "Pour les taux réduits, le client doit attester que les conditions sont remplies, selon la procédure en vigueur. Si le taux est appliqué à tort, l'entreprise peut avoir à payer la différence : vérifie toujours les conditions à jour sur les sites officiels."
        ] },
        { titre: "Acompte et paiement", liste: [
          "L'**acompte** à la commande n'a pas de montant fixé par la loi : il est négocié et écrit dans le devis (souvent une part du total, plus élevée quand il y a de gros achats de matériaux).",
          "Prévoir un **échéancier** pour les chantiers longs : acompte, situations intermédiaires, solde à la réception.",
          "Indiquer le délai de paiement et les moyens de paiement acceptés.",
          "Avec un client professionnel : délais de paiement encadrés, pénalités de retard et indemnité forfaitaire de recouvrement à mentionner."
        ] }
      ],
      retenir: [
        "TVA : 20 % normal ; 10 % rénovation logement > 2 ans ; 5,5 % rénovation énergétique éligible.",
        "Taux réduit = conditions à vérifier et attestation du client.",
        "Acompte et échéancier écrits dans le devis."
      ],
      terrain: "Pour un chantier avec beaucoup de matériaux sur commande (cuisine, menuiseries), demande un acompte qui couvre au moins tes achats : si le client se désiste, tu n'es pas bloqué avec du stock sur mesure.",
      quiz: [
        { q: "Taux de TVA normal en France ?", choix: ["20 %", "10 %", "5,5 %"], ok: 0, pourquoi: "20 % est le taux normal ; 10 % et 5,5 % sont des taux réduits sous conditions." },
        { q: "Rénovation d'une salle de bain dans une maison de 15 ans, taux habituel ?", choix: ["10 % (si les conditions sont remplies)", "20 % obligatoirement", "0 %"], ok: 0, pourquoi: "Travaux d'amélioration dans un logement de plus de 2 ans : taux intermédiaire de 10 %, sous conditions." },
        { q: "Le montant de l'acompte est…", choix: ["Libre, négocié et écrit dans le devis", "Fixé par la loi à 50 %", "Interdit"], ok: 0, pourquoi: "Il n'y a pas de pourcentage légal : c'est une condition commerciale à écrire." },
        { q: "Qui risque de payer la TVA manquante si un taux réduit est appliqué à tort ?", choix: ["L'entreprise (et parfois le client selon les cas)", "Personne", "Le fournisseur"], ok: 0, pourquoi: "D'où l'importance de vérifier les conditions et de garder l'attestation du client." },
        { q: "Sur un long chantier, on prévoit plutôt…", choix: ["Un échéancier : acompte, situations, solde", "Tout payé à la fin", "Tout payé avant de commencer"], ok: 0, pourquoi: "L'échéancier équilibre la trésorerie de l'entreprise et la sécurité du client." }
      ]
    },
    {
      id: "envoyer", emoji: "📬", titre: "Présenter, relancer, négocier, modifier", duree: "15 min",
      intro: "Un devis ne se vend pas tout seul.",
      sections: [
        { titre: "Présenter et relancer", liste: [
          "Envoyer vite après la visite : le client compare souvent plusieurs entreprises.",
          "Expliquer le devis (de vive voix si possible) : ce qui est compris, les choix techniques, le planning.",
          "Relancer poliment après quelques jours, puis avant la fin de validité.",
          "Garder un suivi : devis envoyés, relancés, signés, perdus (et pourquoi)."
        ] },
        { titre: "Négocier sans brader", liste: [
          "Ne baisse pas le prix sans baisser le contenu : propose une **variante** (autre gamme de produit, travaux en moins, client qui fait une partie).",
          "Connais ton **prix plancher** (déboursé sec + frais) : en dessous, tu perds de l'argent.",
          "Mets en avant la valeur : assurance, garanties, délais tenus, références."
        ] },
        { titre: "Pendant le chantier : les modifications", texte: [
          "Le client demande quelque chose en plus ? On fait un **devis complémentaire** (ou un avenant) signé **avant** de réaliser. Même petit. Le cumul des « petits plus » non écrits peut faire perdre la marge d'un chantier."] }
      ],
      retenir: [
        "Envoyer vite, expliquer, relancer, suivre.",
        "Baisser le prix = baisser le contenu (variante).",
        "Travaux en plus : devis complémentaire signé avant."
      ],
      terrain: "Quand tu perds un devis, demande gentiment au client pourquoi (prix, délai, confiance ?). Ces réponses t'apprennent plus que n'importe quel cours.",
      quiz: [
        { q: "Le client trouve le devis trop cher. La meilleure réponse ?", choix: ["Proposer une variante avec un contenu adapté", "Baisser de 20 % sans rien changer", "Refuser de discuter"], ok: 0, pourquoi: "Baisser le prix sans changer le contenu réduit directement ta marge." },
        { q: "Le prix plancher, c'est…", choix: ["Le prix en dessous duquel l'entreprise perd de l'argent", "Le prix du carrelage de sol", "Le prix le plus haut possible"], ok: 0, pourquoi: "Il correspond au coût de revient : déboursé sec et frais." },
        { q: "Le client demande d'ajouter une prise pendant le chantier. Tu…", choix: ["Fais un devis complémentaire signé avant", "L'ajoutes sans rien dire", "Refuses toujours"], ok: 0, pourquoi: "Même un petit supplément doit être accepté par écrit." },
        { q: "Pourquoi envoyer le devis rapidement après la visite ?", choix: ["Le client compare plusieurs entreprises", "Pour éviter de le relire", "Ça n'a pas d'importance"], ok: 0, pourquoi: "La réactivité fait partie de l'image de sérieux de l'entreprise." },
        { q: "Un suivi des devis (envoyés, signés, perdus) sert à…", choix: ["Relancer à temps et comprendre pourquoi on gagne ou perd", "Rien", "Remplacer la comptabilité"], ok: 0, pourquoi: "Il améliore le taux de signature et les prix des prochains devis." }
      ]
    }
  ]
};
