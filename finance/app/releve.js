// Jack Finance — importer un relevé bancaire (.csv téléchargé depuis l'espace client de sa banque).
// Tout se passe dans le navigateur : le fichier n'est envoyé nulle part.
// Formats acceptés : séparateur « ; », « , » ou tabulation ; dates JJ/MM/AAAA, JJ-MM-AAAA, JJ/MM/AA ou AAAA-MM-JJ ;
// une colonne « Montant », ou deux colonnes « Débit » et « Crédit ». Les doublons déjà présents sont ignorés.
(() => {
  'use strict';

  // Mots-clés → catégorie (seulement si la catégorie existe chez l'utilisateur).
  const REGLES = [
    ['salaire', /salaire|paie\b|payroll|remuneration|rémunération/i],
    ['autres-revenus', /remboursement|caf\b|pole emploi|france travail|virement recu|virement reçu|vir inst recu/i],
    ['logement', /loyer|syndic|foncia|nexity|habitation|eau de|veolia/i],
    ['alimentation', /carrefour|leclerc|auchan|lidl|aldi|intermarch|monoprix|franprix|casino|super u|hyper u|netto|picard|biocoop|boulang|primeur|grand frais/i],
    ['restaurants', /restaurant|resto|mcdo|mc donald|burger|kfc|deliveroo|uber ?eats|just ?eat|pizza|sushi|kebab|cafe|café|brasserie/i],
    ['transport', /sncf|ratp|navigo|total ?energies|esso|\bbp\b|shell|carburant|essence|station|uber(?! ?eats)|bolt|blablacar|peage|péage|parking|tisseo|tcl/i],
    ['factures', /edf|engie|free\b|free mobile|orange|sfr|bouygues|sosh|red by|netflix|spotify|deezer|disney|canal|amazon prime|abonnement|assurance|mutuelle|impot|impôt|dgfip/i],
    ['sante', /pharmacie|docteur|medecin|médecin|dentiste|opticien|laboratoire|hopital|hôpital|clinique/i],
    ['shopping', /amazon|fnac|darty|zara|h&m|decathlon|ikea|action\b|kiabi|primark|cdiscount|leroy merlin|castorama|boulanger/i],
    ['loisirs', /cinema|cinéma|ugc|pathe|pathé|steam|playstation|xbox|nintendo|concert|ticketmaster|fnac spectacles|salle de sport|basic fit|fitness/i],
  ];

  function categorieAuto(libelle, montant) {
    const ids = new Set(etat.categories.map(c => c.id));
    const type = montant > 0 ? 'revenu' : 'depense';
    for (const [id, re] of REGLES) {
      if (!ids.has(id) || !re.test(libelle)) continue;
      const c = etat.categories.find(x => x.id === id);
      if (c && c.type === type) return id;
    }
    const repli = etat.categories.find(c => c.type === type && /autre/i.test(c.nom)) || etat.categories.find(c => c.type === type);
    return repli ? repli.id : null;
  }

  function separateur(ligne) {
    const n = s => (ligne.match(new RegExp('\\' + s, 'g')) || []).length;
    return [';', '\t', ','].map(s => [s, n(s)]).sort((a, b) => b[1] - a[1])[0][0];
  }
  function decouper(ligne, sep) {
    const cases = []; let cur = '', guill = false;
    for (let i = 0; i < ligne.length; i++) {
      const ch = ligne[i];
      if (ch === '"') { if (guill && ligne[i + 1] === '"') { cur += '"'; i++; } else guill = !guill; }
      else if (ch === sep && !guill) { cases.push(cur.trim()); cur = ''; }
      else cur += ch;
    }
    cases.push(cur.trim());
    return cases;
  }
  function lireDate(t) {
    t = String(t || '').trim();
    let m = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
    m = t.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);
    if (!m) return null;
    const a = m[3].length === 2 ? '20' + m[3] : m[3];
    const j = Number(m[1]), mo = Number(m[2]);
    if (mo < 1 || mo > 12 || j < 1 || j > 31) return null;
    return `${a}-${pad(mo)}-${pad(j)}`;
  }
  function lireNombre(t) {
    t = String(t || '').replace(/\s| |€|EUR/gi, '');
    if (!t) return null;
    if (/,\d{1,2}$/.test(t)) t = t.replace(/\./g, '').replace(',', '.');   // 1.234,56
    else t = t.replace(/,/g, '');                                          // 1,234.56
    const n = Number(t);
    return Number.isFinite(n) ? n : null;
  }
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  function analyser(texte) {
    const lignes = texte.replace(/^﻿/, '').split(/\r?\n/).filter(l => l.trim());
    if (lignes.length < 2) throw new Error('Le fichier est vide.');
    // Ligne d'en-tête : la première qui contient « date » et (« montant » ou « débit »/« crédit »).
    let iTete = lignes.findIndex(l => /date/i.test(norm(l)) && /(montant|debit|credit|amount)/.test(norm(l)));
    if (iTete < 0) throw new Error("Je ne trouve pas les colonnes « Date » et « Montant » (ou « Débit » / « Crédit »).");
    const sep = separateur(lignes[iTete]);
    const tete = decouper(lignes[iTete], sep).map(norm);
    const col = re => tete.findIndex(h => re.test(h));
    const cDate = col(/^date( d.?operation| op| comptable)?$|^date/);
    const cLib = col(/libelle|description|intitule|detail|label|nature/);
    const cMontant = col(/^montant|amount/);
    const cDebit = col(/debit/), cCredit = col(/credit/);
    if (cDate < 0 || (cMontant < 0 && cDebit < 0 && cCredit < 0)) throw new Error('Colonnes de date ou de montant introuvables.');
    const ops = [], refus = [];
    for (const l of lignes.slice(iTete + 1)) {
      const c = decouper(l, sep);
      const date = lireDate(c[cDate]);
      let montant = null;
      if (cMontant >= 0) montant = lireNombre(c[cMontant]);
      else {
        const d = lireNombre(c[cDebit]), cr = lireNombre(c[cCredit]);
        if (cr) montant = Math.abs(cr); else if (d) montant = -Math.abs(d);
      }
      if (!date || montant === null || montant === 0) { refus.push(l); continue; }
      const libelle = (cLib >= 0 ? c[cLib] : '').replace(/\s+/g, ' ').trim().slice(0, 120) || (montant > 0 ? 'Crédit' : 'Débit');
      ops.push({ date, libelle, montant: arrondi(montant) });
    }
    if (!ops.length) throw new Error('Aucune opération lisible dans ce fichier.');
    return { ops, refus: refus.length };
  }

  function proposer(res) {
    if (!etat.comptes.length) { toast("Ajoutez d'abord un compte."); location.hash = '#/comptes'; return; }
    const dates = res.ops.map(o => o.date).sort();
    const apercu = res.ops.slice(0, 6).map(o => `<li><span>${dateCourte(o.date)}</span> <span>${echapper(o.libelle)}</span> <strong class="${o.montant < 0 ? 'negatif' : 'positif'}">${eurosSigne(o.montant)}</strong></li>`).join('');
    const html = `<p class="discret" style="margin-top:0"><strong>${res.ops.length}</strong> opération(s) trouvée(s), du ${dateLongue(dates[0])} au ${dateLongue(dates[dates.length - 1])}${res.refus ? ` · ${res.refus} ligne(s) ignorée(s)` : ''}.</p>
      ${selectHtml('Ajouter ces opérations au compte', 'compte', etat.comptes.map(c => [c.id, c.nom]), etat.comptes[0].id)}
      <ul class="liste" style="font-size:.9rem;margin:6px 0 10px">${apercu}${res.ops.length > 6 ? `<li class="discret">… et ${res.ops.length - 6} autre(s)</li>` : ''}</ul>
      <p class="discret">Jack Finance range chaque opération dans une catégorie d'après son libellé (supermarché, essence, abonnement…). Vous pourrez corriger ensuite. Les opérations déjà présentes ne sont pas ajoutées deux fois.</p>
      <div class="modale-pied"><button type="button" class="btn" data-action="fermer">Annuler</button><button class="btn principal" type="submit">Importer</button></div>`;
    ouvrirModale('Importer un relevé bancaire', html, fd => {
      const compteId = fd.get('compte');
      const cle = o => `${o.compteId}|${o.date}|${arrondi(o.montant)}|${norm(o.libelle)}`;
      const deja = new Set(etat.operations.map(cle));
      let ajout = 0, doublons = 0;
      for (const o of res.ops) {
        const op = { id: nouvelId(), date: o.date, libelle: o.libelle, montant: o.montant, categorieId: categorieAuto(o.libelle, o.montant), compteId };
        if (!op.categorieId) continue;
        if (deja.has(cle(op))) { doublons++; continue; }
        deja.add(cle(op)); etat.operations.push(op); ajout++;
      }
      if (ajout && moisDe(dates[dates.length - 1]) <= moisCourant()) moisSel = moisDe(dates[dates.length - 1]);
      enregistrer(`${ajout} opération(s) importée(s)${doublons ? `, ${doublons} déjà présente(s)` : ''}.`);
    });
  }

  const champ = document.createElement('input');
  champ.type = 'file'; champ.accept = '.csv,text/csv,.txt'; champ.hidden = true; champ.id = 'fichier-releve';
  document.body.appendChild(champ);
  champ.addEventListener('change', () => {
    const f = champ.files[0]; if (!f) return;
    if (f.size > 5 * 1048576) { toast('Fichier trop gros pour un relevé (5 Mo maximum).'); champ.value = ''; return; }
    const lire = enc => new Promise((ok, ko) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = ko; r.readAsText(f, enc); });
    lire('utf-8').then(t => (t.includes('�') ? lire('windows-1252') : t)).then(t => {
      try { proposer(analyser(t)); } catch (e) { toast(e.message || "Ce fichier n'est pas un relevé lisible."); }
    }).catch(() => toast('Lecture du fichier impossible.')).finally(() => { champ.value = ''; });
  });
  ACTIONS['importer-releve'] = () => champ.click();
})();
