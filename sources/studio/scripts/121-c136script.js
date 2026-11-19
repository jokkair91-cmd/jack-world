(() => {
 const fit = () => {
  const sy = document.getElementById('synth'), s = document.getElementById('recStatus'), tb = sy?.querySelector('.dockSynthToolbar'), pf = document.getElementById('j108Performance');
  // Espace sous la page quand la barre de lecture du bas est fixe et que la page défile.
  const bar = document.getElementById('c119Bar');
  if (bar && getComputedStyle(bar).position === 'fixed' && bar.offsetHeight) { document.body.style.setProperty('--c136pad', (bar.offsetHeight + 8) + 'px'); document.body.classList.add('c136Pad'); } else document.body.classList.remove('c136Pad');
  const off = () => { sy?.classList.remove('c136On', 'c136Chip', 'c136Tip'); if (s) s.removeAttribute('tabindex'); };
  if (!sy || !s || !tb || !pf || !sy.offsetWidth || !pf.contains(s)) { sy?.classList.remove('c136Tall', 'c136Fix'); if (sy) { delete sy.dataset.c136rows; delete sy.dataset.c136fw; } return off(); }
  s.dataset.c136full = s.textContent.trim(); s.title = s.dataset.c136full;
  // Chevauchement barre « Clavier » / zone REC (même case de grille) : la barre passe dans la première colonne.
  // Le réglage est gardé tant que la largeur du Clavier ne change pas (sinon on remesure sans lui).
  const sw = String(Math.round(sy.getBoundingClientRect().width));
  if (sy.classList.contains('c136Fix') && sy.dataset.c136fw !== sw) sy.classList.remove('c136Fix');
  if (!sy.classList.contains('c136Fix')) {
   const a = tb.getBoundingClientRect(), b = pf.getBoundingClientRect(), col1 = parseFloat(getComputedStyle(sy).gridTemplateColumns) || 0;
   const overlap = a.left < b.right - 2 && a.right > b.left + 2 && a.top < b.bottom - 2 && a.bottom > b.top + 2;
   if (overlap && getComputedStyle(tb).gridArea === getComputedStyle(pf).gridArea && col1 >= 200) { sy.classList.add('c136Fix'); sy.dataset.c136fw = sw; }
  }
  // Clavier sur plusieurs lignes : la zone REC/STOP/PLAY n'est pas sur la ligne de « Clavier » → disposition d'origine.
  // (La barre « Clavier / Preset / Octave » doit elle-même tenir sur une ligne, sinon le message couvrirait ses réglages.)
  const oneRow = tb.getBoundingClientRect().height < 42 && Math.abs(tb.getBoundingClientRect().top - pf.getBoundingClientRect().top) < 12;
  if (!oneRow) {
   // Clavier écrasé (moins de 40 px), ou ligne REC/STOP/PLAY collée au-dessus du clavier (pas de place pour le message) :
   // le Clavier prend la hauteur nécessaire. Réglage gardé tant que le Clavier reste sur plusieurs lignes (pas d'aller-retour).
   if (!sy.classList.contains('c136Tall')) {
    const p = document.getElementById('piano'), rc = pf.querySelector('.rec-controls') || pf;
    const pr = p?.getBoundingClientRect(), cr = rc.getBoundingClientRect();
    const squeezed = pr && pr.height < 40, tight = pr && cr.bottom <= pr.top + 2 && pr.top - cr.bottom < 24;
    if (squeezed || tight) { sy.dataset.c136rows = String(getComputedStyle(sy).gridTemplateRows.split(' ').filter(Boolean).length); sy.classList.add('c136Tall'); }
   }
   return off();
  }
  sy.classList.remove('c136Tall'); delete sy.dataset.c136rows;
  const r = sy.getBoundingClientRect(), t = tb.getBoundingClientRect(), first = [...tb.children].find(e => e !== s && e.getBoundingClientRect().width > 0);
  const left = t.left - r.left + 6, w = Math.round((first ? first.getBoundingClientRect().left : t.right) - r.left - 10 - left);
  sy.style.setProperty('--c136x', Math.round(left) + 'px'); sy.style.setProperty('--c136y', Math.round(t.top - r.top + (t.height - 28) / 2) + 'px'); sy.style.setProperty('--c136w', Math.max(0, w) + 'px');
  sy.classList.add('c136On'); const chip = w < 90; sy.classList.toggle('c136Chip', chip);
  if (chip) { s.tabIndex = 0; s.setAttribute('aria-label', s.dataset.c136full); } else { s.removeAttribute('tabindex'); s.removeAttribute('aria-label'); }
 };
 let q = 0; const later = () => { clearTimeout(q); q = setTimeout(fit, 60); };
 const start = () => {
  const sy = document.getElementById('synth'), s = document.getElementById('recStatus'); if (!sy || !s) return false;
  // Pastille : survol ou focus (Tab) affichent le message entier.
  const tip = on => sy.classList.toggle('c136Tip', on && sy.classList.contains('c136Chip'));
  s.addEventListener('mouseenter', () => tip(true)); s.addEventListener('mouseleave', () => tip(document.activeElement === s));
  s.addEventListener('focus', () => tip(true)); s.addEventListener('blur', () => tip(false));
  new ResizeObserver(later).observe(sy);
  new MutationObserver(fit).observe(s, { childList: true, characterData: true, subtree: true });
  new MutationObserver(later).observe(s, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('j105view', later);
  new MutationObserver(later).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  addEventListener('resize', later); fit(); return true;
 };
 if (!start()) { const t = setInterval(() => { if (start()) clearInterval(t); }, 300); setTimeout(() => clearInterval(t), 30000); }
 window.JACK22_MSG135 = window.JACK22_MSG136 = { version: '11.5-claude-6.6-message-prise', fit };
})();