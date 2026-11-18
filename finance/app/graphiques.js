// Graphiques SVG faits main (anneau, barres, courbe). Les couleurs suivent le thème choisi.
function varCss(nom) { return getComputedStyle(document.documentElement).getPropertyValue(nom).trim(); }
function hexVersRgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
function melange(a, b, t) {
  const A = hexVersRgb(a), B = hexVersRgb(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
}
// Palette de catégories : nuances de la couleur du thème + l'accent
function paletteCategories() {
  const nuit = varCss('--vert-nuit'), base = varCss('--vert'), acc = varCss('--or');
  return [nuit, base, melange(base, '#ffffff', .38), acc, melange(base, '#ffffff', .62), melange(acc, '#ffffff', .45), melange(nuit, '#888888', .45), melange(base, '#ffffff', .8), melange(acc, '#000000', .25), '#c9c3b6'];
}

function graduations(max, n = 4) {
  if (max <= 0) return { pas: 1, haut: 1 };
  const brut = max / n, p = Math.pow(10, Math.floor(Math.log10(brut)));
  const pas = [1, 2, 2.5, 5, 10].map(k => k * p).find(k => k >= brut);
  return { pas, haut: pas * Math.ceil(max / pas) };
}
function etiquetteAxe(v) { return Math.abs(v) >= 1000 ? (v / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' k€' : v.toLocaleString('fr-FR') + ' €'; }

/* Anneau (donut) */
function grapheAnneau(segments, haut, bas, taille = 190) {
  const total = segments.reduce((s, x) => s + x.valeur, 0);
  const r = taille / 2 - 14, c = taille / 2, ep = 30;
  if (!total) return `<svg class="graphe" viewBox="0 0 ${taille} ${taille}" style="max-width:${taille}px"><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${varCss('--beige')}" stroke-width="${ep}"/><text x="${c}" y="${c + 4}" text-anchor="middle">Aucune dépense</text></svg>`;
  let angle = -Math.PI / 2, arcs = '';
  const ecart = segments.length > 1 ? 0.012 : 0;
  segments.forEach(s => {
    if (s.valeur <= 0) return;
    const part = s.valeur / total * Math.PI * 2;
    const a1 = angle + ecart, a2 = angle + part - ecart;
    const grand = a2 - a1 > Math.PI ? 1 : 0;
    const p = a => `${(c + r * Math.cos(a)).toFixed(2)} ${(c + r * Math.sin(a)).toFixed(2)}`;
    const d = part >= Math.PI * 2 - 0.001 ? `M ${c} ${c - r} A ${r} ${r} 0 1 1 ${c - 0.01} ${c - r}` : `M ${p(a1)} A ${r} ${r} 0 ${grand} 1 ${p(a2)}`;
    arcs += `<path d="${d}" fill="none" stroke="${s.couleur}" stroke-width="${ep}" class="barre-g" data-tip="${echapper(s.libelle)} : ${euros(s.valeur)} (${Math.round(s.valeur / total * 100)} %)"/>`;
    angle += part;
  });
  return `<svg class="graphe" viewBox="0 0 ${taille} ${taille}" style="max-width:${taille}px" role="img" aria-label="${echapper(bas)} : ${echapper(haut)}">${arcs}
    <text x="${c}" y="${c - 2}" text-anchor="middle" style="font-family:var(--serif);font-size:17px;fill:var(--texte)">${echapper(haut)}</text>
    <text x="${c}" y="${c + 18}" text-anchor="middle" style="font-size:12px">${echapper(bas)}</text></svg>`;
}

/* Barres (simples ou groupées). donnees: [{libelle, valeurs:[..], tips:[..]}], couleurs: [...] */
function grapheBarres(donnees, couleurs, { hauteur = 200, largeur = 520, surligne = -1, couleurSurligne = null, bulle = null } = {}) {
  const g = 46, d = 8, h0 = 14, b = 24;
  const max = Math.max(0, ...donnees.flatMap(x => x.valeurs));
  const min = Math.min(0, ...donnees.flatMap(x => x.valeurs));
  const { pas, haut } = graduations(Math.max(max, -min));
  const bas = min < 0 ? -graduations(-min).haut : 0;
  const H = hauteur - h0 - b, W = largeur - g - d;
  const y = v => h0 + H - (v - bas) / (haut - bas) * H;
  let svg = '';
  for (let v = bas; v <= haut + 0.001; v += pas) {
    svg += `<line class="grille-ligne" x1="${g}" x2="${largeur - d}" y1="${y(v)}" y2="${y(v)}"/><text x="${g - 6}" y="${y(v) + 4}" text-anchor="end">${etiquetteAxe(v)}</text>`;
  }
  const n = donnees.length, k = donnees[0]?.valeurs.length || 1;
  const pasX = W / n, larg = Math.min(46, pasX * 0.62) / k;
  donnees.forEach((x, i) => {
    const cx = g + pasX * i + pasX / 2;
    x.valeurs.forEach((v, j) => {
      const xx = cx - (larg * k) / 2 + j * larg + 1;
      const y1 = y(Math.max(v, 0)), y2 = y(Math.min(v, 0));
      let coul = couleurs[j];
      if (i === surligne && k === 1 && couleurSurligne) coul = couleurSurligne;
      svg += `<rect class="barre-g" x="${xx.toFixed(1)}" y="${y1.toFixed(1)}" width="${(larg - 2).toFixed(1)}" height="${Math.max(1, y2 - y1).toFixed(1)}" rx="3" fill="${coul}" data-tip="${echapper(x.tips?.[j] || '')}"/>`;
    });
    svg += `<text x="${cx}" y="${hauteur - 6}" text-anchor="middle">${echapper(x.libelle)}</text>`;
    if (bulle && i === surligne) {
      const v = Math.max(...x.valeurs), yy = y(v) - 30;
      svg += `<g><rect x="${cx - 38}" y="${yy}" width="76" height="22" rx="6" fill="var(--carte)" stroke="${couleurs[0]}"/><text x="${cx}" y="${yy + 15}" text-anchor="middle" style="font-weight:600;fill:var(--texte)">${echapper(bulle)}</text></g>`;
    }
  });
  if (min < 0) svg += `<line x1="${g}" x2="${largeur - d}" y1="${y(0)}" y2="${y(0)}" stroke="var(--texte-3)"/>`;
  return `<svg class="graphe" viewBox="0 0 ${largeur} ${hauteur + (bulle ? 0 : 0)}" preserveAspectRatio="xMidYMid meet" style="overflow:visible">${svg}</svg>`;
}

/* Courbe avec aire */
function grapheCourbe(points, { hauteur = 220, largeur = 620 } = {}) {
  const g = 54, d = 12, h0 = 14, b = 24;
  const vals = points.map(p => p.valeur);
  let mn = Math.min(...vals), mx = Math.max(...vals);
  const marge = (mx - mn) * 0.15 || mx * 0.1 || 1;
  mn = Math.max(0, mn - marge); mx = mx + marge;
  const { pas } = graduations(mx - mn);
  mn = Math.floor(mn / pas) * pas; mx = Math.ceil(mx / pas) * pas;
  const H = hauteur - h0 - b, W = largeur - g - d;
  const x = i => g + (points.length === 1 ? W / 2 : W * i / (points.length - 1));
  const y = v => h0 + H - (v - mn) / (mx - mn) * H;
  const base = varCss('--vert');
  let svg = `<defs><linearGradient id="aire" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${base}" stop-opacity=".22"/><stop offset="1" stop-color="${base}" stop-opacity="0"/></linearGradient></defs>`;
  for (let v = mn; v <= mx + 0.001; v += pas) svg += `<line class="grille-ligne" x1="${g}" x2="${largeur - d}" y1="${y(v)}" y2="${y(v)}"/><text x="${g - 6}" y="${y(v) + 4}" text-anchor="end">${etiquetteAxe(v)}</text>`;
  const chemin = points.map((p, i) => `${i ? 'L' : 'M'} ${x(i).toFixed(1)} ${y(p.valeur).toFixed(1)}`).join(' ');
  svg += `<path d="${chemin} L ${x(points.length - 1)} ${h0 + H} L ${x(0)} ${h0 + H} Z" fill="url(#aire)"/>`;
  svg += `<path d="${chemin}" fill="none" stroke="${base}" stroke-width="2.5" stroke-linejoin="round"/>`;
  points.forEach((p, i) => {
    svg += `<circle cx="${x(i)}" cy="${y(p.valeur)}" r="${i === points.length - 1 ? 5 : 3.5}" fill="${i === points.length - 1 ? varCss('--vert-nuit') : 'var(--carte)'}" stroke="${base}" stroke-width="2" class="barre-g" data-tip="${echapper(p.tip || '')}"/>`;
    svg += `<text x="${x(i)}" y="${hauteur - 6}" text-anchor="middle">${echapper(p.libelle)}</text>`;
  });
  return `<svg class="graphe" viewBox="0 0 ${largeur} ${hauteur}">${svg}</svg>`;
}

/* Info-bulles au survol de tout élément [data-tip] */
(function () {
  let bulle;
  document.addEventListener('mouseover', e => {
    const el = e.target.closest?.('[data-tip]');
    if (!el || !el.dataset.tip) { if (bulle) bulle.hidden = true; return; }
    if (!bulle) { bulle = document.createElement('div'); bulle.className = 'info-bulle'; document.body.appendChild(bulle); }
    bulle.textContent = el.dataset.tip; bulle.hidden = false;
  });
  document.addEventListener('mousemove', e => {
    if (bulle && !bulle.hidden) { bulle.style.left = Math.min(e.clientX + 14, innerWidth - bulle.offsetWidth - 8) + 'px'; bulle.style.top = (e.clientY + 14) + 'px'; }
  });
})();
