/* Jack Bours : les graphiques (bougies japonaises et courbes), dessinés sur <canvas>. */
(function () {
  function couleurs() {
    const s = getComputedStyle(document.documentElement);
    const g = n => s.getPropertyValue(n).trim();
    return { fond: g("--carte"), grille: g("--grille"), texte: g("--doux"), fort: g("--texte"), vert: g("--vert"), rouge: g("--rouge"), jaune: g("--jaune"), bleu: g("--bleu"), violet: g("--violet") };
  }
  function preparer(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return { ctx, w, h };
  }
  const fmt = (x, d = 2) => x.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
  function moyenne(data, n) {
    const out = []; let s = 0;
    for (let i = 0; i < data.length; i++) { s += data[i].c; if (i >= n) s -= data[i - n].c; out.push(i >= n - 1 ? s / n : null); }
    return out;
  }
  function pas(ecart) { const brut = ecart / 5, p = Math.pow(10, Math.floor(Math.log10(brut))), r = brut / p; return (r < 1.5 ? 1 : r < 3 ? 2 : r < 7 ? 5 : 10) * p; }

  /* Graphique en bougies. maj(data, opts) avec opts : n, mm20, mm50, volume, lignes [{prix, couleur, texte}], libelleJour(i) */
  function creerBougies(canvas, bulle) {
    let D = [], O = {}, survol = null, geo = null;
    function dessiner() {
      const c = couleurs(), { ctx, w, h } = preparer(canvas);
      if (!D.length) return;
      const n = Math.min(O.n || 60, D.length), debut = D.length - n, vis = D.slice(debut);
      const droite = 62, haut = 10, volH = O.volume ? Math.round(h * 0.18) : 0, bas = 22;
      const ph = h - haut - bas - volH - (volH ? 6 : 0), pw = w - droite - 6;
      const mm20 = O.mm20 ? moyenne(D, 20).slice(debut) : null, mm50 = O.mm50 ? moyenne(D, 50).slice(debut) : null;
      let min = Infinity, max = -Infinity;
      vis.forEach((b, i) => { min = Math.min(min, b.l); max = Math.max(max, b.h); [mm20, mm50].forEach(mm => { if (mm && mm[i] != null) { min = Math.min(min, mm[i]); max = Math.max(max, mm[i]); } }); });
      (O.lignes || []).forEach(l => { if (l.prix > min * 0.85 && l.prix < max * 1.15) { min = Math.min(min, l.prix); max = Math.max(max, l.prix); } });
      const marge = (max - min) * 0.06 || 1; min -= marge; max += marge;
      const y = p => haut + (max - p) / (max - min) * ph;
      const larg = pw / n, x = i => 6 + i * larg + larg / 2;
      geo = { n, debut, larg, pw, haut, ph, y, min, max };
      // grille + axe des prix
      ctx.font = "11px Nunito, system-ui, sans-serif"; ctx.textBaseline = "middle";
      const st = pas(max - min);
      ctx.strokeStyle = c.grille; ctx.lineWidth = 1; ctx.fillStyle = c.texte;
      for (let p = Math.ceil(min / st) * st; p <= max; p += st) {
        const yy = Math.round(y(p)) + 0.5;
        ctx.beginPath(); ctx.moveTo(6, yy); ctx.lineTo(6 + pw, yy); ctx.stroke();
        ctx.fillText(fmt(p, st < 1 ? 2 : st < 10 ? 1 : 0), 6 + pw + 6, yy);
      }
      // repères de dates
      ctx.textBaseline = "alphabetic";
      const tous = Math.max(1, Math.round(n / 6));
      for (let i = 0; i < n; i += tous) {
        const xx = Math.round(x(i)) + 0.5;
        ctx.strokeStyle = c.grille; ctx.beginPath(); ctx.moveTo(xx, haut); ctx.lineTo(xx, haut + ph + (volH ? volH + 6 : 0)); ctx.stroke();
        if (O.libelleJour) { ctx.fillStyle = c.texte; ctx.textAlign = "center"; ctx.fillText(O.libelleJour(debut + i), xx, h - 6); }
      }
      ctx.textAlign = "left";
      // volume
      if (volH) {
        const vmax = Math.max(...vis.map(b => b.v)) || 1, vy = haut + ph + 6;
        vis.forEach((b, i) => {
          const hh = b.v / vmax * volH;
          ctx.fillStyle = (b.c >= b.o ? c.vert : c.rouge); ctx.globalAlpha = 0.35;
          ctx.fillRect(x(i) - Math.max(1, larg * 0.32), vy + volH - hh, Math.max(1, larg * 0.64), hh);
        });
        ctx.globalAlpha = 1;
      }
      // bougies
      const cw = Math.max(1, Math.min(14, larg * 0.62));
      vis.forEach((b, i) => {
        const col = b.c >= b.o ? c.vert : c.rouge, xx = Math.round(x(i)) + 0.5;
        ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(xx, y(b.h)); ctx.lineTo(xx, y(b.l)); ctx.stroke();
        const y1 = y(Math.max(b.o, b.c)), y2 = y(Math.min(b.o, b.c));
        ctx.fillRect(xx - cw / 2, y1, cw, Math.max(1, y2 - y1));
      });
      // moyennes mobiles
      [[mm20, c.jaune], [mm50, c.violet]].forEach(([mm, col]) => {
        if (!mm) return;
        ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.beginPath(); let go = false;
        mm.forEach((v, i) => { if (v == null) return; if (!go) { ctx.moveTo(x(i), y(v)); go = true; } else ctx.lineTo(x(i), y(v)); });
        ctx.stroke();
      });
      // lignes (prix de revient, ordres)
      (O.lignes || []).forEach(l => {
        if (l.prix < min || l.prix > max) return;
        const yy = Math.round(y(l.prix)) + 0.5;
        ctx.strokeStyle = l.couleur; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(6, yy); ctx.lineTo(6 + pw, yy); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = l.couleur; ctx.font = "bold 10px Nunito, system-ui, sans-serif"; ctx.textBaseline = "bottom";
        ctx.fillText(l.texte, 10, yy - 2); ctx.textBaseline = "middle";
      });
      // dernier prix
      const der = vis[vis.length - 1], yy = y(der.c);
      ctx.fillStyle = der.c >= der.o ? c.vert : c.rouge;
      ctx.fillRect(6 + pw + 2, yy - 9, droite - 4, 18);
      ctx.fillStyle = "#fff"; ctx.font = "bold 11px Nunito, system-ui, sans-serif"; ctx.textBaseline = "middle";
      ctx.fillText(fmt(der.c), 6 + pw + 6, yy);
      // survol
      if (survol != null && survol >= 0 && survol < n) {
        const xx = Math.round(x(survol)) + 0.5;
        ctx.strokeStyle = c.texte; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(xx, haut); ctx.lineTo(xx, haut + ph); ctx.stroke(); ctx.setLineDash([]);
        const b = vis[survol];
        if (bulle) {
          const varj = debut + survol > 0 ? (b.c / D[debut + survol - 1].c - 1) * 100 : 0;
          bulle.innerHTML = (O.libelleJour ? "<b>" + O.libelleJour(debut + survol, true) + "</b><br>" : "") +
            "Ouverture " + fmt(b.o) + "<br>Plus haut " + fmt(b.h) + "<br>Plus bas " + fmt(b.l) + "<br>Clôture <b>" + fmt(b.c) + "</b> (" + (varj >= 0 ? "+" : "") + fmt(varj) + " %)" +
            "<br>Volume " + b.v.toLocaleString("fr-FR") +
            (mm20 && mm20[survol] ? "<br><span style='color:var(--jaune)'>MM20 " + fmt(mm20[survol]) + "</span>" : "") +
            (mm50 && mm50[survol] ? "<br><span style='color:var(--violet)'>MM50 " + fmt(mm50[survol]) + "</span>" : "");
          bulle.hidden = false;
          const gauche = xx > w / 2;
          bulle.style.left = gauche ? "" : (xx + 12) + "px"; bulle.style.right = gauche ? (w - xx + 12) + "px" : "";
        }
      } else if (bulle) bulle.hidden = true;
    }
    function point(e) {
      if (!geo) return null;
      const r = canvas.getBoundingClientRect(), px = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      const i = Math.floor((px - 6) / geo.larg);
      return i >= 0 && i < geo.n ? i : null;
    }
    canvas.addEventListener("mousemove", e => { survol = point(e); dessiner(); });
    canvas.addEventListener("mouseleave", () => { survol = null; dessiner(); });
    canvas.addEventListener("touchstart", e => { survol = point(e); dessiner(); }, { passive: true });
    canvas.addEventListener("touchmove", e => { survol = point(e); dessiner(); }, { passive: true });
    return { maj(data, opts) { D = data; O = opts || {}; dessiner(); }, redessiner: dessiner };
  }

  /* Courbes simples. series : [{ nom, couleur, valeurs }] ; opts : suffixe (" %"), zero (ligne à 0) */
  function creerCourbes(canvas) {
    let S = [], O = {};
    function dessiner() {
      const c = couleurs(), { ctx, w, h } = preparer(canvas);
      const len = Math.max(0, ...S.map(s => s.valeurs.length));
      if (len < 2) { ctx.fillStyle = c.texte; ctx.font = "13px Nunito, system-ui, sans-serif"; ctx.fillText("La courbe apparaîtra après quelques jours de bourse.", 10, h / 2); return; }
      let min = Infinity, max = -Infinity;
      S.forEach(s => s.valeurs.forEach(v => { min = Math.min(min, v); max = Math.max(max, v); }));
      if (O.zero) { min = Math.min(min, 0); max = Math.max(max, 0); }
      const m = (max - min) * 0.1 || 1; min -= m; max += m;
      const droite = 54, haut = 8, bas = 8, pw = w - droite - 6, ph = h - haut - bas;
      const y = v => haut + (max - v) / (max - min) * ph, x = i => 6 + i / (len - 1) * pw;
      ctx.font = "11px Nunito, system-ui, sans-serif"; ctx.textBaseline = "middle";
      const st = pas(max - min);
      for (let p = Math.ceil(min / st) * st; p <= max; p += st) {
        const yy = Math.round(y(p)) + 0.5;
        ctx.strokeStyle = O.zero && Math.abs(p) < st / 2 ? c.texte : c.grille; ctx.beginPath(); ctx.moveTo(6, yy); ctx.lineTo(6 + pw, yy); ctx.stroke();
        ctx.fillStyle = c.texte; ctx.fillText(fmt(p, st < 1 ? 1 : 0) + (O.suffixe || ""), 6 + pw + 6, yy);
      }
      S.forEach(s => {
        ctx.strokeStyle = s.couleur; ctx.lineWidth = 2.2; ctx.beginPath();
        s.valeurs.forEach((v, i) => i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v)));
        ctx.stroke();
      });
    }
    return { maj(series, opts) { S = series; O = opts || {}; dessiner(); }, redessiner: dessiner };
  }

  /* Mini-courbe pour les listes */
  function mini(canvas, valeurs, couleur) {
    const { ctx, w, h } = preparer(canvas);
    if (valeurs.length < 2) return;
    const min = Math.min(...valeurs), max = Math.max(...valeurs), e = max - min || 1;
    ctx.strokeStyle = couleur; ctx.lineWidth = 1.5; ctx.beginPath();
    valeurs.forEach((v, i) => { const xx = i / (valeurs.length - 1) * (w - 2) + 1, yy = 2 + (max - v) / e * (h - 4); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); });
    ctx.stroke();
  }

  window.JB_GRAPH = { creerBougies, creerCourbes, mini, moyenne };
})();
