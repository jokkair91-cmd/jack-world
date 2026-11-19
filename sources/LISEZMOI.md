# Les applis découpées (sources)

JACK22 Studio et J-DJ étaient chacun **un seul énorme fichier**. Le Studio faisait 1,6 Mo et environ 9 900 lignes, J-DJ 750 Ko. Ils sont maintenant rangés ici en **petits morceaux par rôle**, faciles à lire et à modifier.

Le site garde **une seule page par appli**, recollée par `assembler.ps1`. Les applis marchent donc exactement comme avant : on peut toujours les télécharger et les ouvrir d'un double-clic, et le mode hors connexion fonctionne.

## Comment on travaille

1. On modifie **un morceau** dans `sources/<appli>/…`, jamais la page produite.
2. On recolle depuis le dossier `Jack World en ligne` :

       powershell -ExecutionPolicy Bypass -File sources\assembler.ps1

   ou pour une seule appli : `… sources\assembler.ps1 studio`, ou `… j-dj`.
3. On teste la page produite, puis on envoie sur GitHub.

Le jour du découpage (19 nov. 2026), la page recollée était **identique à l'octet près** à l'ancienne. Les anciennes pages entières sont dans `Jack World - sauvegardes/avant-decoupage-…`.

## Ce qu'il y a dans chaque dossier

| Fichier | Rôle |
|---|---|
| `page.html` | la page (boutons, panneaux, textes), avec des repères `{{JW-MORCEAU:…}}` à la place du code |
| `styles/*.css` | l'apparence, un fichier par bloc de style |
| `scripts/*.js` | le programme, un fichier par module |
| `donnees/*.txt` | les grosses images intégrées (texte base64) : on n'y touche pas à la main |
| `cible.txt` | la page à produire (`studio/studio/index.html` ou `j-dj/console.html`) |

Un morceau peut lui-même contenir des repères. Par exemple, `scripts/012-moteur-principal-du-studio.js` est la liste de ses 18 sous-morceaux, rangés dans `scripts/012-moteur-principal/`.

Les numéros donnent **l'ordre dans la page**. Cet ordre compte : un module peut corriger le précédent. Pour ajouter un module, on le crée avec un numéro et on ajoute son repère au bon endroit de `page.html`.

## JACK22 Studio (`sources/studio`)

Le Studio s'est construit version après version : chaque version a ajouté son style et son module. Les noms viennent de là (`j97…`, `claude116…`, `c150…`).

- **Le cœur** : `scripts/012-moteur-principal/`
  - batterie et synthé : `01`, `12`
  - moteur audio : `02`
  - effets du master : `03`, `13`
  - prises de notes et enregistreur : `04`, `16`
  - morceau à 3 pistes et timeline : `05`, `08`
  - export WAV : `06`, `14`
  - import audio : `07`, `15`
  - sauvegardes : `09`, `10`, `11`
  - Piano Roll : `17`
- **La voix** :
  - `010-modes-et-reglages-voix.js` : réglages de la correction de hauteur
  - `013-…voix-paroles-prompteur-latence.js` : voix, paroles et prompteur
  - `014-prises-voix-et-clips.js` : prises et clips
- **La production** : `044`/`046` (j97), `047`/`049` capture, `050`/`052` montage audio, `053`/`055` racks d'effets, `056`/`058` automation.
- **Les écrans dessinés d'après les maquettes** : `096`→`105` et `109` (Composition, Voix & texte, Piano Roll).
- **Les dernières versions** : 6.x à 7.9, `113`→`143` (montage, sampler, export MP3, pistes audio, Mute et MIDI).
- **Hors connexion et installation** : `016-installation-hors-connexion.js`.
- **Logo du site** : `styles/009-jwlogosite.css`.

## J-DJ (`sources/j-dj`)

Un seul programme coupé en 23 sections, dans l'ordre :

- outils et réglages : `00`
- dessin de la console : `01`
- boutons et curseurs : `02`
- moteur audio : `03`, `04`
- préécoute casque : `05`
- démos : `06`, `07`
- tempo : `08`
- branchements : `09`
- sauvegardes : `10`, `11`
- bibliothèque : `12`
- projet de set : `13`
- sampler : `14`
- clavier : `15`
- MIDI : `16`
- enregistrement : `17`, `18`
- MP3 : `19`
- vu-mètres : `20`
- montage : `21`, `22`

Apparence : `styles/console.css`. Encodeur MP3 : `scripts/lamejs-encodeur-mp3.txt` (lamejs, LGPL, à ne pas modifier).

Les sections de J-DJ partagent les mêmes variables : elles ne fonctionnent qu'**ensemble, recollées dans l'ordre**. Ne pas les charger comme des fichiers séparés.
