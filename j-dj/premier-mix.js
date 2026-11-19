/* J-DJ — guide « Mon premier mix » : 7 étapes pour enchaîner deux morceaux, en montant
   le bon bouton de la console à chaque étape. Ne touche pas au son : il montre, c'est toi qui cliques.
   Ajouté dans la version en ligne de J-DJ (console.html). */
(() => {
  'use strict';
  const decks = () => document.querySelectorAll('.panel.deck');
  const bouton = (racine, texte) => [...(racine || document).querySelectorAll('button')]
    .find(b => (b.getAttribute('aria-label') || b.textContent || '').trim().startsWith(texte));
  const aria = texte => document.querySelector(`[aria-label="${texte}"]`);

  const ETAPES = [
    { titre: 'Enregistre ton mix', texte: 'Avant de commencer, appuie sur « Enregistrer le mix » si tu veux garder ce que tu vas faire. Tu pourras l’exporter à la fin.', cible: () => document.getElementById('recBtn') },
    { titre: 'Un morceau sur la platine A', texte: 'Sur la platine de gauche (A), appuie sur « Démo trap ». Tu peux aussi charger un morceau de la liste du bas avec « Charger … sur A ».', cible: () => bouton(decks()[0], 'Démo') },
    { titre: 'Un morceau sur la platine B', texte: 'Sur la platine de droite (B), appuie sur « Démo drill », ou charge un autre morceau sur B.', cible: () => bouton(decks()[1], 'Démo') },
    { titre: 'Lance la platine A', texte: 'Appuie sur « Lecture » de la platine A. Mets le crossfader (la barre horizontale du milieu) tout à gauche : on n’entend que A.', cible: () => bouton(decks()[0], 'Lecture') },
    { titre: 'Cale B sur le tempo de A', texte: 'Sur la platine B, appuie sur « Synchroniser » : B prend la même vitesse (BPM) que A. C’est le secret d’une transition propre.', cible: () => bouton(decks()[1], 'Synchroniser') },
    { titre: 'Lance B au bon moment', texte: 'Appuie sur « Lecture » de la platine B au début d’une phrase musicale (compte 1-2-3-4, puis lance sur le « 1 »). Avec un casque, la préécoute B te permet d’écouter avant.', cible: () => bouton(decks()[1], 'Lecture') },
    { titre: 'Fais glisser le crossfader', texte: 'Glisse doucement le crossfader de A vers B, sur 8 à 16 temps. Quand tu es tout à droite, arrête la platine A. Bravo, c’est ta première transition !', cible: () => aria('Crossfader') },
  ];

  const css = document.createElement('style');
  css.textContent = `
  .jdj-guide-btn{position:fixed;right:16px;bottom:16px;z-index:2147482000;font:700 14px/1 system-ui,sans-serif;color:#0b0d12;background:linear-gradient(90deg,#3dd6ff,#ff8a1c);border:0;border-radius:999px;padding:12px 16px;box-shadow:0 6px 20px #0008;cursor:pointer}
  .jdj-guide{position:fixed;right:16px;bottom:16px;z-index:2147482000;width:min(340px,calc(100vw - 32px));background:#12151cf5;color:#f2f4f8;border:1px solid #3dd6ff66;border-radius:16px;padding:16px;box-shadow:0 10px 40px #000a;font:14px/1.5 system-ui,sans-serif}
  .jdj-guide small{color:#3dd6ff;font-weight:800;letter-spacing:.08em}
  .jdj-guide h2{font-size:17px;margin:4px 0 6px}
  .jdj-guide p{margin:0 0 12px;color:#cfd5df}
  .jdj-guide .rang{display:flex;gap:8px;justify-content:space-between;align-items:center}
  .jdj-guide button{font:inherit;font-weight:700;border-radius:10px;padding:8px 12px;cursor:pointer;border:1px solid #ffffff33;background:#ffffff12;color:#fff}
  .jdj-guide button.suite{background:#ff8a1c;border-color:#ff8a1c;color:#111}
  .jdj-guide .fermer{position:absolute;right:8px;top:6px;border:0;background:none;font-size:20px;padding:4px 8px}
  .jdj-guide-cible{outline:3px solid #ff8a1c!important;outline-offset:3px;border-radius:8px;animation:jdjGuide 1.2s ease-in-out infinite}
  @keyframes jdjGuide{50%{outline-color:#3dd6ff}}
  @media (prefers-reduced-motion:reduce){.jdj-guide-cible{animation:none}}
  .jdj-guide-btn:focus-visible,.jdj-guide button:focus-visible{outline:3px solid #fff;outline-offset:2px}`;
  document.head.append(css);

  const ouvrir = document.createElement('button');
  ouvrir.type = 'button'; ouvrir.className = 'jdj-guide-btn'; ouvrir.textContent = '🎓 Mon premier mix';
  const panneau = document.createElement('section');
  panneau.className = 'jdj-guide'; panneau.hidden = true; panneau.setAttribute('aria-label', 'Guide : mon premier mix');
  panneau.innerHTML = '<button type="button" class="fermer" aria-label="Fermer le guide">×</button><small></small><h2></h2><p></p><div class="rang"><button type="button" class="prec">← Retour</button><button type="button" class="suite">Suivant →</button></div>';
  document.body.append(ouvrir, panneau);

  let i = 0, cible = null;
  const marquer = el => {
    if (cible) cible.classList.remove('jdj-guide-cible');
    cible = el || null;
    if (cible) { cible.classList.add('jdj-guide-cible'); cible.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  };
  const montrer = () => {
    const e = ETAPES[i];
    panneau.querySelector('small').textContent = `ÉTAPE ${i + 1} / ${ETAPES.length}`;
    panneau.querySelector('h2').textContent = e.titre;
    panneau.querySelector('p').textContent = e.texte;
    panneau.querySelector('.prec').disabled = i === 0;
    panneau.querySelector('.suite').textContent = i === ETAPES.length - 1 ? 'Terminer ✓' : 'Suivant →';
    try { marquer(e.cible()); } catch (_) { marquer(null); }
  };
  const fermer = () => { panneau.hidden = true; ouvrir.hidden = false; marquer(null); ouvrir.focus(); };
  ouvrir.addEventListener('click', () => { i = 0; panneau.hidden = false; ouvrir.hidden = true; montrer(); panneau.querySelector('.suite').focus(); });
  panneau.querySelector('.fermer').addEventListener('click', fermer);
  panneau.querySelector('.prec').addEventListener('click', () => { if (i > 0) { i--; montrer(); } });
  panneau.querySelector('.suite').addEventListener('click', () => { if (i < ETAPES.length - 1) { i++; montrer(); } else fermer(); });
  panneau.addEventListener('keydown', e => { if (e.key === 'Escape') fermer(); });
})();
