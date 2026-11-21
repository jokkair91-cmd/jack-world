/* =========================================================
   Jack Bâtiment — nouvelles rubriques
   Chasse aux dangers · Mode équipe · Lexique multilingue · Devis pro
   Branché par app.js : window.JackExtras(ctx) renvoie les vues.
   ========================================================= */
(function () {
  "use strict";

  window.JackExtras = function (ctx) {
    const { app, etat, sauver, esc, fmt, toast, parler, silence, nombre, arrondi, euros } = ctx;

    /* ================= Chasse aux dangers ================= */
    const DANGERS = window.DANGERS || { scenes: [] };
    function vueDangers(id) {
      etat.dangers = etat.dangers || {};
      const scene = DANGERS.scenes.find((s) => s.id === id);
      if (!scene) {
        app.innerHTML = `
          <section class="hero"><span style="font-size:3.2rem" aria-hidden="true">🔎</span>
            <div><h1>Chasse aux dangers</h1><p>Observe chaque scène de chantier et clique sur tout ce qui est dangereux. David t'explique chaque danger et la règle à connaître.</p></div></section>
          <div class="grille large">${DANGERS.scenes.map((s) => {
            const r = etat.dangers[s.id];
            return `<a class="carte tuile" href="#/dangers/${s.id}"><span class="emoji">${s.emoji}</span><h3>${esc(s.titre)}</h3>
              <p class="muted petit">${esc(s.intro)}</p>
              ${r ? `<span class="etat ${r.trouves === r.total ? "ok" : ""}">Meilleur : ${r.trouves}/${r.total}${r.trouves === r.total ? ` · ${r.erreurs} clic(s) à côté` : ""}</span>` : `<span class="etat">À faire</span>`}</a>`;
          }).join("")}</div>`;
        return;
      }
      const trouves = new Set();
      let erreurs = 0, revele = false;
      app.innerHTML = `
        <a class="retour" href="#/dangers">← Toutes les scènes</a>
        <div class="carte">
          <div class="ligne espace"><h1 style="margin:0">${scene.emoji} ${esc(scene.titre)}</h1>
            <span class="etat" id="compteur">0/${scene.dangers.length} trouvés</span></div>
          <p class="muted">${esc(scene.intro)} Clique directement sur le dessin.</p>
          <div class="scene-wrap"><svg id="scene" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Scène de chantier : ${esc(scene.titre)}">${scene.dessin()}<g id="marques"></g></svg></div>
          <div class="ligne no-print" style="margin-top:10px">
            <button class="btn sec" id="indice">💡 Un indice</button>
            <button class="btn sec" id="reveler">🦫 Je donne ma langue au castor</button>
            <a class="btn sec" href="#/dangers/${scene.id}" id="rejouer">↺ Recommencer</a>
          </div>
          <div id="explic" class="pile" style="margin-top:12px" aria-live="polite"></div>
        </div>`;
      const svg = document.getElementById("scene"), marques = document.getElementById("marques"), explic = document.getElementById("explic");
      function marquer(d, i, auto) {
        marques.insertAdjacentHTML("beforeend", `<g><circle cx="${d.x}" cy="${d.y}" r="${d.r}" fill="none" stroke="${auto ? "#ff7a1a" : "#3cc47c"}" stroke-width="5"/><circle cx="${d.x + d.r * 0.7}" cy="${d.y - d.r * 0.7}" r="15" fill="${auto ? "#ff7a1a" : "#3cc47c"}"/><text x="${d.x + d.r * 0.7}" y="${d.y - d.r * 0.7 + 6}" text-anchor="middle" font-weight="900" font-size="17" fill="#1b1b1b">${i + 1}</text></g>`);
        explic.insertAdjacentHTML("afterbegin", `<div class="encadre ${auto ? "danger" : "terrain"}"><b>${i + 1}. ${esc(d.titre)}</b><br>${esc(d.explication)}<br><span class="petit">📌 <b>La règle :</b> ${esc(d.regle)}</span></div>`);
      }
      function maj() {
        document.getElementById("compteur").textContent = `${trouves.size}/${scene.dangers.length} trouvés`;
        if (trouves.size === scene.dangers.length) {
          if (!revele) {
            const avant = etat.dangers[scene.id];
            if (!avant || avant.trouves < scene.dangers.length || erreurs < avant.erreurs) etat.dangers[scene.id] = { trouves: scene.dangers.length, total: scene.dangers.length, erreurs };
            sauver();
            toast(erreurs === 0 ? "Sans faute, œil de lynx ! 🦫" : `Tous trouvés ✓ (${erreurs} clic(s) à côté)`);
          }
          explic.insertAdjacentHTML("afterbegin", `<div class="encadre retenir"><b>${revele ? "Voilà tous les dangers de la scène." : "Bravo, tu as tout trouvé ! 💪"}</b> Sur un vrai chantier, quand tu vois un de ces dangers : tu t'arrêtes, tu protèges si tu peux, et tu préviens ton chef.</div>`);
        }
      }
      svg.addEventListener("click", (ev) => {
        if (trouves.size === scene.dangers.length) return;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        const p = pt.matrixTransform(svg.getScreenCTM().inverse());
        const i = scene.dangers.findIndex((d, k) => !trouves.has(k) && Math.hypot(d.x - p.x, d.y - p.y) <= d.r);
        if (i >= 0) {
          trouves.add(i); marquer(scene.dangers[i], i, false);
          if (etat.voix) parler(scene.dangers[i].titre + ". " + scene.dangers[i].explication);
          maj();
        } else if (scene.dangers.some((d, k) => trouves.has(k) && Math.hypot(d.x - p.x, d.y - p.y) <= d.r)) {
          toast("Celui-là, tu l'as déjà trouvé 😉");
        } else {
          erreurs++;
          const x = document.createElementNS("http://www.w3.org/2000/svg", "text");
          x.setAttribute("x", p.x); x.setAttribute("y", p.y + 8); x.setAttribute("text-anchor", "middle"); x.setAttribute("font-size", "26"); x.setAttribute("fill", "#ff5d52"); x.textContent = "✕";
          marques.appendChild(x); setTimeout(() => x.remove(), 900);
        }
      });
      document.getElementById("indice").onclick = () => {
        const k = scene.dangers.findIndex((d, j) => !trouves.has(j));
        if (k < 0) return;
        const d = scene.dangers[k];
        const zone = d.x < 270 ? "à gauche" : d.x > 530 ? "à droite" : "au centre";
        const haut = d.y < 170 ? "en haut" : d.y > 340 ? "en bas" : "au milieu";
        toast(`Regarde ${zone}, ${haut} de l'image 👀`);
      };
      document.getElementById("reveler").onclick = () => {
        revele = true;
        scene.dangers.forEach((d, k) => { if (!trouves.has(k)) { trouves.add(k); marquer(d, k, true); } });
        maj();
      };
    }

    /* ================= Mode équipe ================= */
    const PARCOURS_SUIVIS = () => [...ctx.METIERS, ...ctx.SPECIALITES, ctx.AUTOCAD, ctx.COURS_DEVIS];
    function monBilan() {
      return {
        v: 1, app: "jack-batiment", nom: (etat.nom || "").trim(), date: new Date().toISOString(),
        parcours: PARCOURS_SUIVIS().map((p) => { const a = ctx.avancement(p); return { id: p.id, nom: p.nom, ok: a.ok, total: a.total, examen: etat.examen[p.id] == null ? null : etat.examen[p.id] }; }),
        dangers: Object.fromEntries((DANGERS.scenes || []).map((s) => [s.id, etat.dangers && etat.dangers[s.id] ? etat.dangers[s.id].trouves : 0])),
        nbDangers: (DANGERS.scenes || []).reduce((n, s) => n + s.dangers.length, 0)
      };
    }
    const enCode = (o) => "JB1:" + btoa(unescape(encodeURIComponent(JSON.stringify(o))));
    function deCode(t) {
      const s = String(t || "").trim();
      try {
        const json = s.startsWith("JB1:") ? decodeURIComponent(escape(atob(s.slice(4)))) : s;
        const o = JSON.parse(json);
        if (o && o.app === "jack-batiment" && Array.isArray(o.parcours)) return o;
      } catch (e) { /* format inconnu */ }
      return null;
    }
    function telecharger(nom, texte, type) {
      const url = URL.createObjectURL(new Blob([texte], { type: type || "application/json" }));
      const a = document.createElement("a"); a.href = url; a.download = nom; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }

    function vueEquipe(onglet) {
      etat.equipe = etat.equipe || { membres: {} };
      const tabs = [["moi", "🙋 Mon bilan"], ["chef", "👷 Je suis chef d'équipe"]];
      const entete = `
        <section class="hero"><span style="font-size:3.2rem" aria-hidden="true">🤝</span>
          <div><h1>Mode équipe</h1><p>Chaque compagnon envoie son bilan à son chef. Le chef voit en un coup d'œil qui a validé quoi. Rien ne part sur Internet : le bilan est un petit fichier ou un code à envoyer par message.</p></div></section>
        <nav class="onglets">${tabs.map(([id, t]) => `<a href="#/equipe/${id}" class="${onglet === id ? "actif" : ""}">${t}</a>`).join("")}</nav>`;
      if (onglet !== "chef") {
        const b = monBilan();
        app.innerHTML = entete + `
          <div class="carte">
            <label class="petit muted" for="nom">Ton prénom et ton nom</label>
            <input class="champ" id="nom" value="${esc(etat.nom)}" placeholder="Prénom Nom" style="margin:6px 0 12px">
            <div class="table-wrap"><table><thead><tr><th>Parcours</th><th>Modules validés</th><th>Examen</th></tr></thead><tbody>
              ${b.parcours.map((p) => `<tr><td>${esc(p.nom)}</td><td>${p.ok}/${p.total}</td><td>${p.examen == null ? "—" : p.examen + " %" + (p.examen >= 75 ? " 🎓" : "")}</td></tr>`).join("")}
              <tr><td>Chasse aux dangers</td><td>${Object.values(b.dangers).reduce((a, n) => a + n, 0)}/${b.nbDangers} dangers trouvés</td><td>—</td></tr>
            </tbody></table></div>
            <div class="ligne" style="margin-top:12px">
              <button class="btn" id="dl">⬇️ Télécharger mon bilan</button>
              <button class="btn sec" id="copier">📋 Copier mon code</button>
            </div>
            <p class="muted petit" style="margin-top:8px">Envoie le fichier ou le code à ton chef (SMS, WhatsApp, e-mail). Il l'ajoute dans l'onglet « Je suis chef d'équipe ».</p>
          </div>`;
        const champ = document.getElementById("nom");
        champ.oninput = () => { etat.nom = champ.value; sauver(); };
        const verifNom = () => { if (!etat.nom.trim()) { toast("Écris d'abord ton prénom et ton nom"); champ.focus(); return false; } return true; };
        document.getElementById("dl").onclick = () => { if (!verifNom()) return; telecharger(`bilan-${etat.nom.trim().replace(/\s+/g, "-")}.jackbat`, JSON.stringify(monBilan(), null, 1)); toast("Bilan téléchargé ✓"); };
        document.getElementById("copier").onclick = async () => {
          if (!verifNom()) return;
          const code = enCode(monBilan());
          try { await navigator.clipboard.writeText(code); toast("Code copié ✓ Colle-le dans un message à ton chef"); }
          catch (e) { prompt("Copie ce code et envoie-le à ton chef :", code); }
        };
        return;
      }
      const membres = etat.equipe.membres;
      const ids = PARCOURS_SUIVIS().map((p) => ({ id: p.id, nom: p.nom }));
      app.innerHTML = entete + `
        <div class="carte no-print">
          <h3>Ajouter des bilans</h3>
          <div class="ligne"><input type="file" id="fichiers" accept=".jackbat,.json,application/json" multiple class="champ" style="flex:1;min-width:220px"></div>
          <div class="ligne" style="margin-top:8px"><input class="champ" id="code" placeholder="…ou colle ici un code reçu (JB1:…)" style="flex:1;min-width:220px"><button class="btn sec" id="ajouterCode">Ajouter</button></div>
        </div>
        <div class="carte" style="margin-top:14px">
          <div class="ligne espace"><h3 style="margin:0">Mon équipe (${Object.keys(membres).length})</h3><button class="btn sec no-print" id="imp">🖨️ Imprimer</button></div>
          ${Object.keys(membres).length ? `<div class="table-wrap"><table class="tableau-equipe"><thead><tr><th>Nom</th>${ids.map((p) => `<th>${esc(p.nom)}</th>`).join("")}<th>Dangers</th><th>Mis à jour</th><th class="no-print"></th></tr></thead><tbody>
            ${Object.values(membres).sort((a, b) => a.nom.localeCompare(b.nom, "fr")).map((m) => `<tr><td><b>${esc(m.nom)}</b></td>
              ${ids.map((p) => { const x = (m.parcours || []).find((q) => q.id === p.id); if (!x) return "<td>—</td>"; const fini = x.examen >= 75; return `<td class="${fini ? "cell-ok" : x.ok ? "cell-encours" : ""}">${x.ok}/${x.total}${x.examen != null ? `<br><span class="petit">${fini ? "🎓 " : ""}${x.examen} %</span>` : ""}</td>`; }).join("")}
              <td>${Object.values(m.dangers || {}).reduce((a, n) => a + n, 0)}/${m.nbDangers || "?"}</td>
              <td class="petit">${new Date(m.date).toLocaleDateString("fr-FR")}</td>
              <td class="no-print"><button class="btn sec" style="padding:4px 9px" data-suppr="${esc(m.nom)}" aria-label="Retirer ${esc(m.nom)}">✕</button></td></tr>`).join("")}
          </tbody></table></div><p class="muted petit">🎓 = examen réussi (75 % ou plus). Vert : parcours terminé. Jaune : en cours.</p>`
            : `<p class="muted">Aucun bilan pour l'instant. Demande à chaque compagnon d'ouvrir « Mon bilan » et de t'envoyer son fichier ou son code.</p>`}
        </div>`;
      const ajouter = (o) => {
        if (!o) { toast("Ce fichier ou ce code n'est pas un bilan Jack Bâtiment"); return false; }
        if (!o.nom) { toast("Ce bilan n'a pas de nom"); return false; }
        const avant = membres[o.nom];
        if (!avant || new Date(o.date) >= new Date(avant.date)) membres[o.nom] = o;
        return true;
      };
      document.getElementById("fichiers").onchange = async (e) => {
        let n = 0;
        for (const f of e.target.files) { if (ajouter(deCode(await f.text()))) n++; }
        sauver(); toast(`${n} bilan(s) ajouté(s)`); vueEquipe("chef");
      };
      document.getElementById("ajouterCode").onclick = () => { if (ajouter(deCode(document.getElementById("code").value))) { sauver(); toast("Bilan ajouté ✓"); vueEquipe("chef"); } };
      app.querySelectorAll("[data-suppr]").forEach((b) => { b.onclick = () => { if (confirm(`Retirer ${b.dataset.suppr} de l'équipe ?`)) { delete membres[b.dataset.suppr]; sauver(); vueEquipe("chef"); } }; });
      document.getElementById("imp").onclick = () => window.print();
    }

    /* ================= Lexique multilingue ================= */
    const LEX = window.LEXIQUE || { langues: [], categories: [] };
    function direDans(texte, voix) {
      if (!("speechSynthesis" in window)) { toast("La voix n'est pas disponible dans ce navigateur."); return; }
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(texte);
      u.lang = voix;
      const v = speechSynthesis.getVoices().find((x) => x.lang.replace("_", "-").toLowerCase().startsWith(voix.slice(0, 2).toLowerCase()));
      if (v) u.voice = v; else toast("Pas de voix installée pour cette langue sur cet appareil : la prononciation peut être approximative.");
      speechSynthesis.speak(u);
    }
    function vueLexique() {
      etat.lexLangue = etat.lexLangue || "pt";
      const L = LEX.langues.find((l) => l.id === etat.lexLangue) || LEX.langues[0];
      app.innerHTML = `
        <section class="hero"><span style="font-size:3.2rem" aria-hidden="true">🌍</span>
          <div><h1>Le chantier en plusieurs langues</h1><p>Les mots et les phrases qui servent tous les jours avec une équipe multilingue : sécurité, consignes, outils, matériaux. Clique sur 🔊 pour entendre.</p></div></section>
        <div class="onglets">${LEX.langues.map((l) => `<button class="onglet-btn ${l.id === L.id ? "actif" : ""}" data-l="${l.id}">${l.drapeau} ${esc(l.nom)}</button>`).join("")}</div>
        <input class="champ" id="cherche" placeholder="Chercher un mot : casque, béton, attention…" autocomplete="off">
        <div id="liste" class="pile" style="margin-top:14px"></div>
        <div class="encadre terrain petit" style="margin-top:14px">Pour apprendre vraiment une langue (niveaux, conjugaison, dialogues), va sur <b>Jack Blabla</b> : il a un vocabulaire du bâtiment. Ces traductions sont celles de tous les jours ; fais-les relire par un collègue natif avant de les afficher sur un chantier.</div>`;
      app.querySelectorAll("[data-l]").forEach((b) => { b.onclick = () => { etat.lexLangue = b.dataset.l; sauver(); vueLexique(); }; });
      const liste = document.getElementById("liste");
      const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      const remplir = (f) => {
        const n = norm(f || "");
        liste.innerHTML = LEX.categories.map((c) => {
          const mots = c.mots.filter((m) => !n || norm(m.fr + " " + (m[L.id] || "")).includes(n));
          if (!mots.length) return "";
          return `<div class="carte"><h3>${c.emoji} ${esc(c.nom)}</h3><div class="table-wrap"><table><tbody>
            ${mots.map((m, i) => `<tr><td style="width:45%">${esc(m.fr)}</td><td style="width:45%" ${L.rtl ? 'dir="rtl" lang="ar"' : `lang="${L.id}"`}><b style="color:var(--jaune)">${esc(m[L.id] || "")}</b></td>
              <td style="text-align:right;white-space:nowrap"><button class="btn sec" style="padding:4px 9px" data-dire="${c.id}:${c.mots.indexOf(m)}" aria-label="Écouter">🔊</button></td></tr>`).join("")}
          </tbody></table></div></div>`;
        }).join("") || `<p class="muted">Aucun mot trouvé.</p>`;
        liste.querySelectorAll("[data-dire]").forEach((b) => {
          b.onclick = () => { const [cid, k] = b.dataset.dire.split(":"); const m = LEX.categories.find((c) => c.id === cid).mots[+k]; direDans(m[L.id], L.voix); };
        });
      };
      remplir("");
      document.getElementById("cherche").oninput = (e) => remplir(e.target.value);
    }

    /* ================= Devis professionnel ================= */
    function entreprise() {
      etat.entreprise = etat.entreprise || { nom: "", forme: "", adresse: "", ville: "", tel: "", email: "", siret: "", rcs: "", tvaIntra: "", assureur: "", police: "", zone: "France métropolitaine", logo: "", franchise: false };
      return etat.entreprise;
    }
    function devisPro() {
      const d = ctx.prixEtat().devis;
      d.client = d.client || { nom: "", adresse: "", chantier: "" };
      if (d.validite == null) d.validite = 30;
      if (d.acompte == null) d.acompte = 30;
      if (d.gratuit == null) d.gratuit = true;
      if (!d.date) d.date = new Date().toISOString().slice(0, 10);
      etat.prix.compteur = etat.prix.compteur || 1;
      if (!d.numero) d.numero = `DEV-${new Date().getFullYear()}-${String(etat.prix.compteur).padStart(3, "0")}`;
      return d;
    }
    const ligneInfos = (l) => {
      if (l.libre) return { nom: l.nom || "", unite: l.unite || "u", pu: nombre(l.pu) };
      const it = ctx.itemPar(l.id);
      if (!it) return null;
      return { nom: it.nom, unite: it.unite, pu: l.pu != null && l.pu !== "" ? nombre(l.pu) : ctx.prixDe(it) };
    };
    function calculs(d, E) {
      const ht = d.lignes.reduce((s, l) => { const i = ligneInfos(l); return s + (i ? nombre(l.q) * i.pu : 0); }, 0);
      const al = ht * nombre(d.aleas) / 100;
      const base = ht + al;
      const taux = E.franchise ? 0 : nombre(d.tva);
      const tva = base * taux / 100;
      return { ht, al, base, taux, tva, ttc: base + tva, acompte: (base + tva) * nombre(d.acompte) / 100 };
    }
    function manques(d, E) {
      const m = [];
      if (!E.nom) m.push("le nom de l'entreprise");
      if (!E.adresse) m.push("l'adresse de l'entreprise");
      if (!E.siret) m.push("le SIRET");
      if (!E.assureur || !E.police) m.push("l'assurance professionnelle (décennale : assureur et n° de contrat)");
      if (!d.client.nom) m.push("le nom du client");
      if (!d.client.adresse) m.push("l'adresse du client");
      if (!d.lignes.length) m.push("au moins une ligne de travaux");
      if (!d.debut && !d.duree) m.push("la date de début ou la durée des travaux");
      return m;
    }
    function docHTML(d, E) {
      const c = calculs(d, E);
      const dateFr = (s) => s ? new Date(s + "T12:00:00").toLocaleDateString("fr-FR") : "";
      const fin = d.date ? new Date(new Date(d.date + "T12:00:00").getTime() + nombre(d.validite) * 864e5).toLocaleDateString("fr-FR") : "";
      const lignes = d.lignes.map((l, k) => { const i = ligneInfos(l); if (!i) return ""; return `<tr><td>${k + 1}</td><td>${esc(i.nom)}</td><td class="num">${arrondi(nombre(l.q), 2)}</td><td>${esc(i.unite)}</td><td class="num">${euros(i.pu)}</td><td class="num">${euros(nombre(l.q) * i.pu)}</td></tr>`; }).join("");
      return `
        <div class="doc-devis">
          <div class="doc-entete">
            <div class="doc-ent">
              ${E.logo ? `<img src="${E.logo}" alt="Logo" class="doc-logo">` : ""}
              <b class="doc-nom">${esc(E.nom) || "Nom de l'entreprise"}</b>${E.forme ? ` <span>${esc(E.forme)}</span>` : ""}<br>
              ${esc(E.adresse)}${E.ville ? `<br>${esc(E.ville)}` : ""}<br>
              ${E.tel ? `Tél. ${esc(E.tel)}` : ""}${E.tel && E.email ? " · " : ""}${esc(E.email)}<br>
              ${E.siret ? `SIRET ${esc(E.siret)}` : ""}${E.rcs ? ` · ${esc(E.rcs)}` : ""}${E.tvaIntra && !E.franchise ? `<br>TVA intracom. ${esc(E.tvaIntra)}` : ""}
            </div>
            <div class="doc-cli">
              <div class="doc-titre">DEVIS</div>
              <b>N° ${esc(d.numero)}</b><br>Date : ${dateFr(d.date)}<br>Valable jusqu'au : ${fin}
              <div class="doc-client"><b>Client</b><br>${esc(d.client.nom) || "Nom du client"}<br>${esc(d.client.adresse).replace(/\n/g, "<br>")}</div>
            </div>
          </div>
          ${d.client.chantier ? `<p><b>Adresse du chantier :</b> ${esc(d.client.chantier)}</p>` : ""}
          <p><b>Objet :</b> ${esc(d.objet) || "—"}</p>
          ${d.debut || d.duree ? `<p><b>Début prévu des travaux :</b> ${dateFr(d.debut) || "à convenir"}${d.duree ? ` · <b>Durée estimée :</b> ${esc(d.duree)}` : ""}</p>` : ""}
          <table class="doc-table"><thead><tr><th>#</th><th>Désignation</th><th class="num">Qté</th><th>Unité</th><th class="num">PU HT</th><th class="num">Total HT</th></tr></thead><tbody>${lignes || `<tr><td colspan="6">—</td></tr>`}</tbody></table>
          <table class="doc-totaux"><tbody>
            <tr><td>Total HT</td><td class="num">${euros(c.ht)}</td></tr>
            ${c.al ? `<tr><td>Aléas (${arrondi(nombre(d.aleas), 1)} %)</td><td class="num">${euros(c.al)}</td></tr><tr><td>Total HT avec aléas</td><td class="num">${euros(c.base)}</td></tr>` : ""}
            ${nombre(d.deplacement) ? `<tr><td>dont frais de déplacement</td><td class="num">${euros(nombre(d.deplacement))}</td></tr>` : ""}
            <tr><td>${E.franchise ? "TVA" : `TVA ${arrondi(c.taux, 1)} %`}</td><td class="num">${E.franchise ? "0,00 €" : euros(c.tva)}</td></tr>
            <tr class="doc-ttc"><td>Total TTC</td><td class="num">${euros(c.ttc)}</td></tr>
            ${nombre(d.acompte) ? `<tr><td>Acompte à la commande (${arrondi(nombre(d.acompte), 0)} %)</td><td class="num">${euros(c.acompte)}</td></tr>` : ""}
          </tbody></table>
          <div class="doc-mentions">
            ${E.franchise ? "<p>TVA non applicable, article 293 B du CGI.</p>" : ""}
            ${!E.franchise && c.taux > 0 && c.taux < 20 ? "<p>Taux de TVA réduit appliqué sous réserve de la remise par le client de l'attestation prévue (logement achevé depuis plus de deux ans, nature des travaux).</p>" : ""}
            ${d.paiement ? `<p><b>Conditions de paiement :</b> ${esc(d.paiement)}</p>` : ""}
            <p>Devis ${d.gratuit ? "gratuit" : `payant : ${euros(nombre(d.prixDevis))} TTC, déductible en cas de commande`}. Prix fermes pendant la durée de validité.</p>
            ${E.assureur ? `<p><b>Assurance professionnelle (garantie décennale) :</b> ${esc(E.assureur)}, contrat n° ${esc(E.police)}, couverture : ${esc(E.zone)}.</p>` : ""}
          </div>
          <div class="doc-signature">
            <div>Pour l'entreprise<br><br><br></div>
            <div>Le client : date, signature et mention manuscrite<br>« Devis reçu avant l'exécution des travaux, bon pour accord »<br><br><br></div>
          </div>
        </div>`;
    }
    function vueDevisPro(entete) {
      const d = devisPro(), E = entreprise();
      const PRIX = ctx.PRIX;
      const options = PRIX.categories.map((c) => `<optgroup label="${esc(c.nom)}">${c.items.map((i) => `<option value="${i.id}">${esc(i.nom)} (${esc(i.unite)})</option>`).join("")}</optgroup>`).join("");
      const champ = (id, label, val, attrs = "") => `<label>${label}<input data-f="${id}" value="${esc(val == null ? "" : val)}" ${attrs}></label>`;
      app.innerHTML = entete + `
        <div class="no-print">
          <details class="carte" ${E.nom ? "" : "open"}><summary><b>🏢 Mon entreprise</b> <span class="muted petit">(remplie une fois, gardée pour tous les devis)</span></summary>
            <div class="form" style="margin-top:12px">
              ${champ("E.nom", "Nom / raison sociale", E.nom)}${champ("E.forme", "Forme (SARL, EI, micro…)", E.forme)}
              ${champ("E.adresse", "Adresse", E.adresse)}${champ("E.ville", "Code postal et ville", E.ville)}
              ${champ("E.tel", "Téléphone", E.tel, 'inputmode="tel"')}${champ("E.email", "E-mail", E.email, 'inputmode="email"')}
              ${champ("E.siret", "SIRET (14 chiffres)", E.siret, 'inputmode="numeric"')}${champ("E.rcs", "RCS ou RM (ville)", E.rcs)}
              ${champ("E.tvaIntra", "N° TVA intracommunautaire", E.tvaIntra)}
              ${champ("E.assureur", "Assureur décennale", E.assureur)}${champ("E.police", "N° de contrat", E.police)}${champ("E.zone", "Zone couverte", E.zone)}
            </div>
            <div class="ligne" style="margin-top:10px">
              <label class="btn sec" style="cursor:pointer">🖼️ Ajouter mon logo<input type="file" id="logo" accept="image/*" hidden></label>
              ${E.logo ? `<img src="${E.logo}" alt="Logo actuel" style="height:40px;border-radius:6px;background:#fff;padding:2px"> <button class="btn sec" id="sansLogo">Retirer le logo</button>` : ""}
              <label class="ligne petit"><input type="checkbox" data-f="E.franchise" ${E.franchise ? "checked" : ""}> Micro-entreprise en franchise de TVA</label>
            </div>
          </details>
          <div class="carte" style="margin-top:14px">
            <div class="ligne espace"><h2 style="margin:0">🧾 Devis ${esc(d.numero)}</h2>
              <div class="ligne"><button class="btn sec" id="nouveau">＋ Nouveau devis</button><button class="btn" id="pdf">📄 Enregistrer en PDF</button></div></div>
            <div class="form" style="margin-top:12px">
              ${champ("d.client.nom", "Client : nom", d.client.nom)}${champ("d.client.adresse", "Client : adresse", d.client.adresse)}${champ("d.client.chantier", "Adresse du chantier (si différente)", d.client.chantier)}
              ${champ("d.objet", "Objet des travaux", d.objet)}${champ("d.date", "Date du devis", d.date, 'type="date"')}${champ("d.validite", "Validité (jours)", d.validite, 'inputmode="numeric"')}
              ${champ("d.debut", "Début des travaux", d.debut, 'type="date"')}${champ("d.duree", "Durée estimée", d.duree, 'placeholder="ex. 3 semaines"')}
              ${champ("d.aleas", "Aléas (%)", d.aleas, 'inputmode="decimal"')}
              <label>TVA<select data-f="d.tva">${PRIX.tva.map((t) => `<option value="${t.taux}" ${nombre(d.tva) === t.taux ? "selected" : ""}>${esc(t.label)}</option>`).join("")}</select></label>
              ${champ("d.acompte", "Acompte (%)", d.acompte, 'inputmode="decimal"')}${champ("d.deplacement", "Dont frais de déplacement (€)", d.deplacement, 'inputmode="decimal"')}
              ${champ("d.paiement", "Conditions de paiement", d.paiement, 'placeholder="ex. solde à réception de facture, virement"')}
            </div>
            <label class="ligne petit" style="margin-top:8px"><input type="checkbox" data-f="d.gratuit" ${d.gratuit ? "checked" : ""}> Devis gratuit</label>
            <h3 style="margin-top:16px">Lignes de travaux</h3>
            <div class="table-wrap"><table><thead><tr><th>Désignation</th><th>Unité</th><th>Qté</th><th>PU HT</th><th>Total HT</th><th></th></tr></thead><tbody id="lignes"></tbody></table></div>
            <div class="ligne" style="margin-top:10px">
              <select class="champ" id="choix" style="flex:1;min-width:200px">${options}</select>
              <button class="btn sec" id="ajout">+ Depuis la bibliothèque</button>
              <button class="btn sec" id="libre">+ Ligne libre</button>
            </div>
            <div id="alerte" style="margin-top:12px"></div>
          </div>
          <h2 style="margin-top:20px">👀 Aperçu du devis</h2>
          <p class="muted petit">C'est ce qui sera imprimé. Pour un PDF : bouton « Enregistrer en PDF », puis choisis l'imprimante « Enregistrer au format PDF » (ou « Microsoft Print to PDF »).</p>
        </div>
        <div id="apercu"></div>`;
      const apercu = document.getElementById("apercu"), corps = document.getElementById("lignes");
      const rendu = () => {
        apercu.innerHTML = docHTML(d, E);
        const m = manques(d, E);
        document.getElementById("alerte").innerHTML = m.length
          ? `<div class="encadre danger petit">⚠️ Il manque des mentions obligatoires : ${m.map(esc).join(", ")}.</div>`
          : `<div class="encadre terrain petit">✅ Les mentions principales sont présentes. Relis le devis avant de l'envoyer.</div>`;
      };
      const lignes = () => {
        corps.innerHTML = d.lignes.map((l, k) => {
          const i = ligneInfos(l); if (!i) return "";
          const nomCell = l.libre ? `<input class="champ" data-l="${k}:nom" value="${esc(l.nom || "")}" placeholder="Désignation" style="min-width:180px;padding:6px 8px">` : esc(i.nom);
          const uniteCell = l.libre ? `<input class="champ" data-l="${k}:unite" value="${esc(l.unite || "u")}" style="width:64px;padding:6px 8px">` : esc(i.unite);
          return `<tr><td>${nomCell}</td><td>${uniteCell}</td>
            <td><input class="champ" data-l="${k}:q" value="${esc(l.q)}" inputmode="decimal" style="width:80px;padding:6px 8px" aria-label="Quantité"></td>
            <td><input class="champ" data-l="${k}:pu" value="${esc(l.libre ? (l.pu || "") : (l.pu != null ? l.pu : ""))}" placeholder="${l.libre ? "" : ctx.prixDe(ctx.itemPar(l.id))}" inputmode="decimal" style="width:90px;padding:6px 8px" aria-label="Prix unitaire"></td>
            <td data-tot="${k}" style="white-space:nowrap">${euros(nombre(l.q) * i.pu)}</td>
            <td><button class="btn sec" style="padding:4px 9px" data-suppr="${k}" aria-label="Supprimer la ligne">✕</button></td></tr>`;
        }).join("") || `<tr><td colspan="6" class="muted">Aucune ligne. Ajoute des ouvrages ci-dessous.</td></tr>`;
        corps.querySelectorAll("[data-l]").forEach((inp) => {
          inp.oninput = () => {
            const [k, champ] = inp.dataset.l.split(":");
            const l = d.lignes[+k];
            l[champ] = champ === "nom" || champ === "unite" ? inp.value : inp.value.replace(",", ".");
            if (champ === "pu" && !l.libre && inp.value.trim() === "") delete l.pu;
            sauver();
            const i = ligneInfos(l); corps.querySelector(`[data-tot="${k}"]`).textContent = euros(nombre(l.q) * i.pu);
            rendu();
          };
        });
        corps.querySelectorAll("[data-suppr]").forEach((b) => { b.onclick = () => { d.lignes.splice(+b.dataset.suppr, 1); sauver(); lignes(); }; });
        rendu();
      };
      app.querySelectorAll("[data-f]").forEach((inp) => {
        const evenement = inp.type === "checkbox" || inp.tagName === "SELECT" ? "onchange" : "oninput";
        inp[evenement] = () => {
          const chemin = inp.dataset.f.split(".");
          const cible = chemin[0] === "E" ? E : d;
          let o = cible; for (let i = 1; i < chemin.length - 1; i++) o = o[chemin[i]];
          o[chemin[chemin.length - 1]] = inp.type === "checkbox" ? inp.checked : inp.value;
          sauver(); rendu();
        };
      });
      document.getElementById("ajout").onclick = () => { const id = document.getElementById("choix").value; const l = d.lignes.find((x) => x.id === id && !x.libre); if (l) l.q = nombre(l.q) + 1; else d.lignes.push({ id, q: 1 }); sauver(); lignes(); };
      document.getElementById("libre").onclick = () => { d.lignes.push({ libre: true, nom: "", unite: "u", q: 1, pu: "" }); sauver(); lignes(); const ins = corps.querySelectorAll('[data-l$=":nom"]'); if (ins.length) ins[ins.length - 1].focus(); };
      document.getElementById("pdf").onclick = () => {
        const m = manques(d, E);
        if (m.length && !confirm("Il manque : " + m.join(", ") + ".\n\nImprimer quand même ?")) return;
        document.body.classList.add("impression-devis");
        window.print();
        setTimeout(() => document.body.classList.remove("impression-devis"), 500);
      };
      document.getElementById("nouveau").onclick = () => {
        if (d.lignes.length && !confirm("Commencer un nouveau devis ? Le devis actuel sera remplacé (pense à l'enregistrer en PDF avant).")) return;
        etat.prix.compteur = (etat.prix.compteur || 1) + 1;
        etat.prix.devis = { objet: "", lignes: [], tva: d.tva, aleas: 0, acompte: d.acompte, validite: d.validite, gratuit: d.gratuit, paiement: d.paiement };
        sauver(); vueDevisPro(entete);
      };
      document.getElementById("logo").onchange = (e) => {
        const f = e.target.files[0]; if (!f) return;
        const img = new Image();
        img.onload = () => {
          const k = Math.min(1, 360 / img.width, 160 / img.height);
          const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          E.logo = c.toDataURL("image/png"); URL.revokeObjectURL(img.src); sauver(); vueDevisPro(entete); toast("Logo ajouté ✓");
        };
        img.onerror = () => toast("Image illisible");
        img.src = URL.createObjectURL(f);
      };
      const sl = document.getElementById("sansLogo"); if (sl) sl.onclick = () => { E.logo = ""; sauver(); vueDevisPro(entete); };
      lignes();
    }

    return { vueDangers, vueEquipe, vueLexique, vueDevisPro };
  };
})();
