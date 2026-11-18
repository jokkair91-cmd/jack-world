/* Jack World — bandeau de pub commun, copie du bandeau de Jack Radio (radio/polish.css, « project-showcase »).
   Chaque site montre les autres sites, un à la fois, qui défilent tout seuls ; un clic ouvre le site.
   Jack World lui-même n'a pas de pub. Seul NEW DUC renvoie vers Jack World (dans son menu et son pied de page).
   Pour l'ajouter à une page : <script data-jack-pub src="…/jack-pub.js" defer></script>
   Pour choisir où il apparaît : <div data-jack-pub-ici></div> ; sinon il se place juste sous le premier <header>. */
(() => {
  'use strict';
  const script = document.currentScript || document.querySelector('script[data-jack-pub]');
  const base = new URL('.', script.src);
  const relative = decodeURIComponent(location.pathname.slice(base.pathname.length));
  const actuel = relative.startsWith('newduc/') ? 'nd' : relative.startsWith('studio/') ? 'studio'
    : relative.startsWith('j-dj/') ? 'dj' : relative.startsWith('radio/') ? 'radio'
    : relative.startsWith('blabla/') ? 'blabla' : relative.startsWith('fusion/') ? 'fusion' : relative.startsWith('finance/') ? 'finance' : 'home';
  if (actuel === 'home') return; // Jack World, le big boss : pas de pub

  // [id, nom, phrase, site, logo] — chaque pub mène au SITE ; c'est le site qui ouvre l'appli.
  // Pour ajouter un projet (Jack Bourse, Jack Finance…) : une ligne ici + son dossier dans « actuel », et le bandeau suit tout seul.
  const sites = [
    ['nd', 'NEW DUC', 'Des idées aux nouveaux possibles.', 'newduc/index.html', 'newduc/assets/nd/nd-sillage.png'],
    ['studio', 'JACK22 STUDIO', 'Crée ton univers sonore.', 'studio/index.html', 'newduc/assets/nd/j22-logo-jack.png'],
    ['dj', 'J-DJ', 'Tes platines. Ton mix.', 'j-dj/index.html', 'newduc/assets/nd/jdj-bot.png'],
    ['radio', 'JACK RADIO', 'La fréquence du bloc.', 'radio/index.html', 'radio/radio-192.png'],
    ['blabla', 'JACK BLABLA', 'Apprends une langue avec Jack.', 'blabla/index.html', 'blabla/icon-192.png'],
    ['fusion', 'JACK FUSION', 'Monte. Mixe. Fusionne.', 'fusion/index.html', 'fusion/apple-touch-icon.png'],
    ['finance', 'JACK FINANCE', 'Ton argent, enfin clair.', 'finance/index.html', 'finance/favicon.svg'],
  ].filter(([id]) => id !== actuel);

  const n = sites.length;
  // Même rythme que Jack Radio : chaque projet reste ~4,6 s, puis glisse vers le suivant.
  const etapes = sites.map((_, i) => {
    const debut = (i / n) * 100, fin = debut + (100 / n) * 0.78;
    return `${debut.toFixed(2)}%,${fin.toFixed(2)}%{transform:translateX(-${i * 100}%)}`;
  }).join('') + '100%{transform:translateX(0)}';

  const style = document.createElement('style');
  style.textContent = `
.jw-pub{position:relative;overflow:hidden;height:52px;background:linear-gradient(90deg,#080a09,color-mix(in srgb,var(--c1,#a4ff00) 9%,#0b0d0a) 50%,#080a09);border-bottom:1px solid color-mix(in srgb,var(--c1,#a4ff00) 12%,transparent);font-family:Inter,"Segoe UI",Arial,sans-serif;z-index:1}
.jw-pub-reel{display:flex;animation:jw-pub-tour ${n * 4.5}s ease-in-out infinite}
.jw-pub-slide{flex:0 0 100%;min-width:0;display:flex;align-items:center;justify-content:center;gap:14px;height:52px;padding:6px 70px 6px 20px}
.jw-pub-site{display:flex;align-items:center;gap:12px;min-width:0;color:inherit;text-decoration:none}
.jw-pub-slide img{width:32px;height:32px;object-fit:contain;filter:drop-shadow(0 0 5px color-mix(in srgb,var(--c1,#a4ff00) 20%,transparent));margin:0;display:block}
.jw-pub-site>span{display:flex;align-items:center;gap:14px;min-width:0}
.jw-pub-slide b{font:900 16px/1 "Barlow Condensed","Arial Narrow",Arial,sans-serif;letter-spacing:.6px;color:#d8ddce;white-space:nowrap}
.jw-pub-slide i{font-style:normal;font-size:11px;color:#a8b59a}
.jw-pub-site:hover b,.jw-pub-site:focus-visible b{color:var(--c1,#a4ff00)}
.jw-pub-site:focus-visible{outline:2px solid var(--c1,#a4ff00);outline-offset:2px}
.jw-pub:hover .jw-pub-reel,.jw-pub:focus-within .jw-pub-reel,.jw-pub.paused .jw-pub-reel{animation-play-state:paused}
.jw-pub-pause{position:absolute;bottom:14px;right:16px;padding:3px 7px;font:10px Inter,Arial,sans-serif;border:1px solid #52613c55;border-radius:20px;background:transparent;color:#abb99a;cursor:pointer}
@keyframes jw-pub-tour{${etapes}}
@media(max-width:600px){.jw-pub-slide{padding:6px 64px 6px 10px;gap:8px}.jw-pub-site{gap:8px}.jw-pub-site>span{gap:2px 7px;flex-wrap:wrap}.jw-pub-slide b{font-size:14px}.jw-pub-slide i{font-size:10px}.jw-pub-slide img{width:28px;height:28px}}
@media(max-width:400px){.jw-pub-slide i{display:none}}
@media(prefers-reduced-motion:reduce){.jw-pub-reel{animation:none;overflow-x:auto;scroll-snap-type:x mandatory}.jw-pub-slide{scroll-snap-align:start}.jw-pub-pause{display:none}}`;
  document.head.append(style);

  const bandeau = document.createElement('section');
  bandeau.className = 'jw-pub';
  bandeau.setAttribute('aria-label', 'Nos autres sites');
  const reel = document.createElement('div');
  reel.className = 'jw-pub-reel';
  sites.forEach(([, nom, phrase, url, logo]) => {
    const slide = document.createElement('div');
    slide.className = 'jw-pub-slide';
    // Le site : logo, nom, phrase
    const a = document.createElement('a');
    a.className = 'jw-pub-site';
    a.href = new URL(url, base).href;
    const img = document.createElement('img');
    img.src = new URL(logo, base).href; img.alt = ''; img.width = 32; img.height = 32;
    const texte = document.createElement('span');
    const b = document.createElement('b'); b.textContent = nom;
    const i = document.createElement('i'); i.textContent = phrase;
    texte.append(b, i);
    a.append(img, texte);
    slide.append(a);
    reel.append(slide);
  });
  const pause = document.createElement('button');
  pause.type = 'button';
  pause.className = 'jw-pub-pause';
  pause.textContent = 'Pause';
  pause.setAttribute('aria-label', 'Mettre le défilement en pause');
  pause.addEventListener('click', () => {
    const p = bandeau.classList.toggle('paused');
    pause.textContent = p ? 'Reprendre le défilement' : 'Pause';
    pause.setAttribute('aria-label', p ? 'Reprendre le défilement' : 'Mettre le défilement en pause');
  });
  bandeau.append(reel, pause);

  const ici = document.querySelector('[data-jack-pub-ici]');
  if (ici) ici.replaceWith(bandeau);
  else {
    const header = document.querySelector('header');
    if (header) header.after(bandeau); else document.body.prepend(bandeau);
  }
})();
