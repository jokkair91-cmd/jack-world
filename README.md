# Jack World

J-DJ, JACK22 Studio, Jack Radio, Jack Blabla, Jack Fusion, Jack Finance, Jack Bours et NEW DUC réunis sur un seul site.

| Dossier | Appli | Version source |
|---|---|---|
| `studio/` | Site vitrine JACK22 Studio | `NEW DUC - travail/JACK22-VITRINE-SILLAGE` |
| `studio/studio/` | JACK22 Studio (l'appli) | 7.9 Mute MIDI (`JACK22 Claude/dist-7.9`) |
| `j-dj/` | Site vitrine J-DJ | `NEW DUC - travail/J-DJ-VITRINE` |
| `j-dj/console.html` | J-DJ Club Graphite (l'appli) | M6 (`J-DJ/J-DJ-CLUB-GRAPHITE-M6.html`), aussi copiée dans `j-dj/downloads/` |
| `radio/index.html` | Site vitrine Jack Radio | créé le 18 nov. 2026 (identité de la radio) |
| `radio/studio.html` | Jack Radio (l'appli) | `Jack Radio/jack-radio/dist` (13 nov. 2026) |
| `blabla/` | Site vitrine Jack Blabla | créé le 14 nov. 2026 (couleurs et polices de l'appli) |
| `blabla/app/` | Jack Blabla (l'appli) | copie de `Jack Blabla/` du 14 nov. 2026, + icônes et bouton « Changer de site » |
| `fusion/index.html` | Site vitrine Jack Fusion | créé le 18 nov. 2026 (logo et couleurs de l'appli) |
| `fusion/app/` | Jack Fusion (l'appli) | v0.8 « Atelier » bêta (`Documents/Codex/…/JACK-FUSION`, 18 nov. 2026), sans les .exe ni les tests, + icônes et bouton « Changer de site » |
| `finance/index.html` | Site vitrine Jack Finance | créé le 18 nov. 2026 (vert nuit, or et monogramme JF de l'appli) |
| `finance/app/` | Jack Finance (l'appli) | copie de `Bureau/Jack Finance` du 18 nov. 2026 (sans serveur.ps1), + icônes et bouton « Changer de site » |
| `bours/index.html` | Site vitrine Jack Bours | page de présentation d'origine de `Bureau/Jack Bours`, adaptée (liens vers `app/`, police multicolore, « Changer de site », pub) |
| `bours/app/` | Jack Bours (l'appli) | copie de `Bureau/Jack Bours` du 18 nov. 2026 (`app.html` devenu `index.html`, sans serveur.ps1), + icônes et bouton « Changer de site ». Outil d'apprentissage, argent fictif, pas un conseil en investissement |
| `newduc/` | Site NEW DUC | V6 (`NEW DUC - travail/NEWDUKE-V6`) |

## Mettre à jour une appli

Remplacer le fichier de l'appli par la nouvelle version, sous le même nom (`studio/studio/index.html`, `j-dj/console.html` et `j-dj/downloads/J-DJ-CLUB-GRAPHITE.html`), puis envoyer la modification sur GitHub.

## Logos et icônes

Chaque projet a sa propre icône (onglet du navigateur et écran d'accueil du téléphone) : `favicon.svg`, `favicon-32.png` et `apple-touch-icon.png`, à la racine, dans `j-dj/`, `studio/` et `radio/`, et des PNG dans `newduc/`.

- Jack World : planète-vinyle (`jack-world-logo.svg`).
- J-DJ : deux platines, cyan et orange.
- JACK22 Studio : le J22.
- Jack Radio : la cassette (`radio/radio-logo.svg`, aussi en haut de la page), plus `radio-192.png` et `radio-512.png` pour l'appli installable.
- NEW DUC : le logo ND rouge avec Sillage en noir et blanc, sur fond noir (`favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png`, sans version SVG). Le logo source est `newduc/assets/nd/nd-sillage-noir-blanc.png` (1536 px) ; sa version web `nd-sillage.png` (768 px) remplace l'ancien logo ND sur le site NEW DUC, dans Jack Radio (`radio/nd-sillage.png`) et dans l'encart « Découvrir NEW DUC » des sites J-DJ et Studio.

## Mise en ligne

Site statique, sans serveur : GitHub Pages, branche `main`, dossier racine.
