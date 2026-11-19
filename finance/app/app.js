// Jack Finance — logique de l'application (écrans, formulaires, navigation).
chargerEtat();

const $ = s => document.querySelector(s);
let moisSel = moisCourant();
let evo = { periode: 'mois', serie: 'depenses' };
let filtreOps = { q: '', compte: '', categorie: '', type: '', tout: false };
let analysePeriode = 12;
let compteOuvert = null;

const PAGES = [
  { id: 'tableau', nom: 'Tableau de bord', icone: 'accueil' },
  { id: 'comptes', nom: 'Comptes', icone: 'carte' },
  { id: 'operations', nom: 'Opérations', icone: 'fleches' },
  { id: 'budgets', nom: 'Budgets', icone: 'camembert' },
  { id: 'objectifs', nom: "Objectifs d'épargne", icone: 'cible' },
  { id: 'charges', nom: 'Charges fixes', icone: 'calendrier' },
  { id: 'analyses', nom: 'Analyses', icone: 'barres' },
];

/* ---------- Outils d'affichage ---------- */
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('visible');
  clearTimeout(toast.minuteur); toast.minuteur = setTimeout(() => t.classList.remove('visible'), 2600);
}
function enregistrer(msg) {
  etat.exemple = etat.exemple && true;
  if (!sauver()) toast("Attention : impossible d'enregistrer dans ce navigateur.");
  else if (msg) toast(msg);
  rendre();
}
// Montant qui « compte » jusqu'à sa valeur à l'ouverture de l'écran
function nb(v, rond = false) { return `<span data-compte="${v}"${rond ? ' data-rond="1"' : ''}>${euros(v, rond)}</span>`; }
function animerCompteurs() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('[data-compte]').forEach(el => {
    if (el.dataset.fait) return; el.dataset.fait = '1';
    const cible = Number(el.dataset.compte), rond = !!el.dataset.rond, duree = 1300, delai = Number(el.dataset.delai || 0);
    let debut = null;
    el.textContent = euros(0, rond);
    const pas = t => {
      if (debut === null) debut = t;
      const k = Math.min(1, (t - debut) / duree), e = 1 - Math.pow(1 - k, 3);
      el.textContent = euros(k < 1 ? cible * e : cible, rond);
      if (k < 1) requestAnimationFrame(pas);
    };
    setTimeout(() => requestAnimationFrame(pas), delai);
  });
}
/* Onglets : chaque écran peut être découpé en plusieurs vues */
const ongletsEtat = { tableau: 'synthese', comptes: 'tous', budgets: 'categories', analyses: 'ensemble' };
let animerProchain = false;
function onglets(page, liste) {
  return `<nav class="onglets" role="tablist">${liste.map(([id, nom, icone, n]) => `<button role="tab" aria-selected="${ongletsEtat[page] === id}" class="${ongletsEtat[page] === id ? 'actif' : ''}" data-action="onglet" data-page="${page}" data-v="${id}">${ic(icone)}${nom}${n ? `<span class="nb">${n}</span>` : ''}</button>`).join('')}</nav>`;
}
function tete(titre, droite = '') { return `<div class="carte-tete"><h2>${titre}</h2>${droite}</div>`; }
function progres(pct, classe = '') {
  const c = classe || (pct > 100 ? 'depasse' : pct >= 90 ? 'proche' : '');
  return `<div class="progres ${c}"><span style="width:${Math.min(100, Math.max(0, pct))}%"></span></div>`;
}
function badgeBanque(c) {
  const init = (c.banque || c.nom).split(/\s+/).map(m => m[0]).join('').slice(0, 3).toUpperCase();
  return `<span class="logo-banque" style="background:${echapper(c.couleur || '#555')}">${echapper(init)}</span>`;
}
function puceCategorie(cat) { return `<span class="etiquette-cat">${ic(cat.icone)}${echapper(cat.nom)}</span>`; }
function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }
function budgetTotal() { return arrondi(categoriesDepense().reduce((s, c) => s + (Number(c.budget) || 0), 0)); }
function moisEstCourant() { return moisSel === moisCourant(); }

/* ---------- Alertes (cloche) ---------- */
function alertes() {
  const m = moisSel, liste = [];
  const jour = moisEstCourant() ? Number(aujourdhui().slice(8)) : 99;
  etat.charges.forEach(c => {
    if (!chargeRegleeCeMois(c, m) && c.jour <= jour) liste.push({ type: 'alerte', texte: `${c.nom} (${euros(c.montant)}) n'est pas marqué comme réglé.` });
  });
  const dep = Object.fromEntries(depensesParCategorie(m).map(x => [x.cat.id, x.montant]));
  categoriesDepense().forEach(c => {
    if (!c.budget) return;
    const p = pct(dep[c.id] || 0, c.budget);
    if (p > 100) liste.push({ type: 'alerte', texte: `Budget « ${c.nom} » dépassé : ${euros(dep[c.id])} sur ${euros(c.budget)}.` });
    else if (p >= 90) liste.push({ type: 'alerte', texte: `Budget « ${c.nom} » presque atteint (${p} %).` });
  });
  etat.objectifs.forEach(o => { if (o.actuel >= o.cible) liste.push({ type: 'ok', texte: `Objectif « ${o.nom} » atteint, bravo !` }); });
  return liste;
}

/* ---------- Structure : menu et en-tête ---------- */
function rendreMenu(page) {
  const nbCharges = etat.charges.filter(c => !chargeRegleeCeMois(c, moisSel)).length;
  $('#menu').innerHTML = PAGES.map(p => `<a href="#/${p.id}" class="${p.id === page ? 'actif' : ''}">${ic(p.icone)}<span>${p.nom}</span>${p.id === 'charges' && nbCharges ? `<span class="compteur" title="Charges à régler ce mois">${nbCharges}</span>` : ''}</a>`).join('');
  $('#menu-bas').innerHTML = `<a href="#" data-action="presentation">${ic('etoile')}<span>Présentation</span></a><a href="#/parametres" class="${page === 'parametres' ? 'actif' : ''}">${ic('reglages')}<span>Paramètres</span></a>`;
}
function rendreEntete(titre, sousTitre) {
  $('#entete-titre').innerHTML = `<h1>${titre}</h1>${sousTitre ? `<p>${sousTitre}</p>` : ''}`;
  const nb = alertes().filter(a => a.type === 'alerte').length;
  const suivantPossible = moisSel < moisCourant();
  $('#selecteur-mois').innerHTML = `
    <div class="recherche-globale">${ic('recherche')}<input id="recherche" type="search" placeholder="Rechercher une opération" value="${echapper(filtreOps.q)}" aria-label="Rechercher une opération"></div>
    <button class="bouton-icone" data-action="mois" data-n="-1" aria-label="Mois précédent">${ic('chevron_g')}</button>
    <div class="mois-libelle">${ic('calendrier')}<span>${libelleMois(moisSel)}</span></div>
    <button class="bouton-icone" data-action="mois" data-n="1" aria-label="Mois suivant" ${suivantPossible ? '' : 'disabled style="opacity:.4;cursor:default"'}>${ic('chevron_d')}</button>
    <div class="cloche" style="position:relative">
      <button class="bouton-icone" data-action="notifs" aria-label="Alertes (${nb})">${ic('alerte')}${nb ? '<span class="point"></span>' : ''}</button>
    </div>
    <button class="btn principal" data-action="nouvelle-op">${ic('plus')}<span>Opération</span></button>`;
}

/* ---------- Tableau de bord ---------- */
function vueTableau() {
  const m = moisSel, prec = decalerMois(m, -1), fin = finDeMois(m);
  const pat = patrimoine(fin), patPrec = patrimoine(finDeMois(prec)), pat12 = patrimoine(finDeMois(decalerMois(m, -12)));
  const evol12 = pat12 ? ((pat - pat12) / Math.abs(pat12) * 100) : 0;
  // Mois en cours : on compare au mois précédent à la même date (sinon un mois entamé paraît toujours « en baisse »)
  const enCours = m === moisCourant(), jourRef = enCours ? Number(aujourdhui().slice(8, 10)) : 31;
  const t = totauxMois(m), tPrec = totauxMois(prec, jourRef);
  const refComp = enCours ? `vs le ${dateCourte(`${prec}-${pad(Math.min(jourRef, joursDansMois(prec)))}`)}` : 'vs mois précédent';
  const taux = pct(t.solde, t.revenus);
  const bt = budgetTotal(), pb = pct(t.depenses, bt);
  const prenom = etat.profil?.prenom;

  rendreEntete(`Bonjour${prenom ? ' ' + echapper(prenom) : ''},`, `Voici la synthèse de vos finances pour ${libelleMois(m).toLowerCase()}.`);

  const bandeau = etat.exemple ? `<div class="carte" style="display:flex;gap:12px;align-items:center;background:var(--beige-2)">${ic('info')}<div style="flex:1">Ce sont des <strong>données d'exemple</strong> pour vous montrer l'application. Quand vous êtes prêt, allez dans Paramètres → « Partir de zéro ».</div><a class="btn petit" href="#/parametres">Paramètres</a></div>` : '';

  // Tuiles
  const tuiles = `<div class="grille g-tuiles">
    <div class="carte tuile vedette">
      <div class="vedette-corps">
        <div class="etiquette">${ic('pieces')} Patrimoine net <span data-tip="Somme de tous vos comptes à la fin du mois (courants, épargne, placements).">${ic('info')}</span></div>
        <div class="valeur">${nb(pat)}</div>
        <div class="vedette-pied">
          <div style="display:grid;gap:6px"><span class="pastille-var">${ic(pat >= patPrec ? 'tendance' : 'chevron_b')} ${eurosSigne(arrondi(pat - patPrec))}</span><small style="white-space:nowrap">${evol12 >= 0 ? '+' : '−'} ${Math.abs(evol12).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} % sur 12 mois</small></div>
          ${grapheEtincelle(Array.from({ length: 12 }, (_, i) => patrimoine(finDeMois(decalerMois(m, i - 11)))))}
        </div>
      </div>
    </div>
    <div class="carte tuile txt-bleu"><span class="ic-tuile positif">${ic('telecharger')}</span><div><div class="etiquette">Revenus (mois)</div><div class="valeur">${nb(t.revenus)}</div><small class="discret">${comparaison(t.revenus, tPrec.revenus, true, refComp)}</small></div></div>
    <div class="carte tuile txt-bleu"><span class="ic-tuile negatif">${ic('importer')}</span><div><div class="etiquette">Dépenses (mois)</div><div class="valeur">${nb(t.depenses)}</div><small class="discret">${comparaison(t.depenses, tPrec.depenses, false, refComp)}</small></div></div>
    <div class="carte tuile txt-vert"><span class="ic-tuile">${ic('tirelire')}</span><div><div class="etiquette">Épargne du mois</div><div class="valeur ${t.solde < 0 ? 'negatif' : ''}">${nb(t.solde)}</div><small class="discret">${t.revenus ? `${taux} % des revenus` : '—'}</small></div></div>
  </div>`;

  // Budget mensuel (vedette)
  const budget = `<div class="carte budget-vedette">
    ${tete('Budget mensuel', `<a class="lien" href="#/budgets">${ic('crayon')} Modifier</a>`)}
    <div class="gros">${nb(t.depenses, true)} <small>/ ${euros(bt, true)}</small></div>
    <div class="ligne-pct">${progres(pb, 'clair')}<strong>${pb} %</strong></div>
    <div class="synthese-ligne"><span class="lib">Revenus</span><span class="mt">${euros(t.revenus)}</span></div>
    <div class="synthese-ligne"><span class="lib">Dépenses</span><span class="mt">${euros(t.depenses)}</span></div>
    <div class="reste"><span>Reste à dépenser</span><span>${nb(arrondi(bt - t.depenses))}</span></div>
  </div>`;

  // Comptes
  const comptes = `<div class="carte">${tete('Mes comptes', `<a class="lien" href="#/comptes">Voir tout ${ic('chevron_d')}</a>`)}
    ${etat.comptes.length ? `<ul class="liste cliquable liste-comptes">${etat.comptes.map(c => `<li data-action="ouvrir-compte" data-id="${c.id}">${badgeBanque(c)}<div class="lib"><strong>${echapper(c.nom)}</strong><small>${echapper(c.banque || TYPES_COMPTE[c.type])}</small></div><span class="mt">${euros(soldeCompte(c, fin))}</span></li>`).join('')}</ul>
    <div class="total"><span>Total</span><span>${euros(pat)}</span></div>` : `<div class="vide">Aucun compte pour l'instant.<br><br><button class="btn principal" data-action="nouveau-compte">${ic('plus')} Ajouter un compte</button></div>`}
  </div>`;

  // Charges à régler
  const totalCharges = arrondi(etat.charges.reduce((s, c) => s + c.montant, 0));
  const reglees = etat.charges.filter(c => chargeRegleeCeMois(c, m)).length;
  const charges = `<div class="carte">${tete('Charges fixes', `<span class="note">${reglees}/${etat.charges.length} réglées · <strong>${euros(totalCharges)}</strong></span>`)}
    ${etat.charges.length ? [...etat.charges].sort((a, b) => a.jour - b.jour).map(ligneCharge).join('') : `<div class="vide">Ajoutez votre loyer, vos abonnements… pour les suivre chaque mois.<br><br><a class="btn" href="#/charges">${ic('plus')} Ajouter une charge</a></div>`}
  </div>`;

  // Répartition
  const rep = depensesParCategorie(m);
  const pal = paletteCategories();
  let segs = rep.slice(0, 6);
  if (rep.length > 6) segs.push({ cat: { nom: 'Autres catégories', icone: 'points' }, montant: arrondi(rep.slice(6).reduce((s, x) => s + x.montant, 0)) });
  const totalDep = rep.reduce((s, x) => s + x.montant, 0);
  const repartition = `<div class="carte">${tete('Répartition des dépenses', `<span class="note">${euros(totalDep)}</span>`)}
    <div class="donut-bloc" style="grid-template-columns:170px 1fr">${grapheAnneau(segs.map((s, i) => ({ valeur: s.montant, couleur: pal[i], libelle: s.cat.nom })), euros(totalDep, true), 'Dépenses', 170)}
    <ul class="legende">${segs.map((s, i) => `<li><span class="pastille" style="background:${pal[i]}"></span><span class="lib">${echapper(s.cat.nom)}</span><span class="pct">${pct(s.montant, totalDep)} %</span></li>`).join('') || '<li class="discret">Aucune dépense ce mois.</li>'}</ul></div>
  </div>`;

  // Objectifs
  const objectifs = `<div class="carte">${tete("Mes objectifs d'épargne", `<a class="lien" href="#/objectifs">Voir tout ${ic('chevron_d')}</a>`)}
    ${etat.objectifs.length ? etat.objectifs.slice(0, 3).map(ligneObjectif).join('') : `<div class="vide">Fixez-vous un objectif : voyage, apport, voiture…<br><br><button class="btn principal" data-action="nouvel-objectif">${ic('plus')} Créer un objectif</button></div>`}
  </div>`;

  // Bilan du mois
  const dep = Object.fromEntries(rep.map(x => [x.cat.id, x.montant]));
  const depasses = categoriesDepense().filter(c => c.budget && (dep[c.id] || 0) > c.budget);
  const points = [
    [t.depenses <= bt, t.depenses <= bt ? 'Budget global respecté' : `Budget dépassé de ${euros(t.depenses - bt)}`],
    [t.solde >= 0, t.solde >= 0 ? `Mois positif : ${euros(t.solde)} épargnés` : `Dépenses supérieures aux revenus (${euros(t.solde)})`],
    [t.solde >= tPrec.solde, t.solde >= tPrec.solde ? 'Épargne en progression' : 'Épargne en baisse par rapport au mois dernier'],
    [!depasses.length, depasses.length ? `${depasses.length} catégorie${depasses.length > 1 ? 's' : ''} au-dessus du budget` : 'Aucune catégorie hors budget'],
    [reglees === etat.charges.length, reglees === etat.charges.length ? 'Toutes les charges sont réglées' : `${etat.charges.length - reglees} charge${etat.charges.length - reglees > 1 ? 's' : ''} encore à régler`],
  ];
  const bilan = `<div class="carte">${tete('Bilan du mois')}
    <ul class="bilan">${points.map(([ok, txt]) => `<li><span class="${ok ? 'ok' : 'ko'}">${ic(ok ? 'coche' : 'alerte')}</span>${txt}</li>`).join('')}</ul>
  </div>`;

  // Dernières opérations
  const recentes = opsTriees(opsDuMois(m)).slice(0, 6);
  const dernieres = `<div class="carte">${tete('Dernières opérations', `<a class="lien" href="#/operations">Voir le journal ${ic('chevron_d')}</a>`)}
    ${recentes.length ? `<ul class="liste cliquable">${recentes.map(ligneOperation).join('')}</ul>` : `<div class="vide">Aucune opération en ${libelleMois(m).toLowerCase()}.</div>`}
  </div>`;

  // Évolution
  const evolution = `<div class="carte">${tete('Évolution', `<div style="display:flex;gap:8px;flex-wrap:wrap">
      <div class="segments">${[['depenses', 'Dépenses'], ['epargne', 'Épargne'], ['revenus', 'Revenus']].map(([v, l]) => `<button data-action="evo-serie" data-v="${v}" class="${evo.serie === v ? 'actif' : ''}">${l}</button>`).join('')}</div>
      <div class="segments">${[['mois', 'Mois'], ['trimestre', 'Trimestre'], ['annee', 'Année']].map(([v, l]) => `<button data-action="evo-periode" data-v="${v}" class="${evo.periode === v ? 'actif' : ''}">${l}</button>`).join('')}</div></div>`)}
    ${grapheEvolution()}
  </div>`;

  const aRegler = etat.charges.length - reglees;
  const barre = onglets('tableau', [['synthese', 'Synthèse', 'accueil'], ['mois', 'Mon mois', 'calendrier', aRegler], ['tendances', 'Tendances', 'tendance']]);
  const o = ongletsEtat.tableau;
  if (o === 'mois') return `${barre}
    <div class="grille g-2">${repartition}${charges}</div>
    ${dernieres}`;
  if (o === 'tendances') {
    const points = [];
    for (let i = 11; i >= 0; i--) { const mm = decalerMois(m, -i), v = patrimoine(finDeMois(mm)); points.push({ libelle: moisCourt(mm), valeur: v, tip: `${libelleMois(mm)} : ${euros(v)}` }); }
    return `${barre}${evolution.replace(grapheEvolution(), grapheEvolution(1000))}
    <div class="grille g-2"><div class="carte">${tete('Patrimoine sur 12 mois', `<span class="note">${evol12 >= 0 ? '+' : '−'} ${Math.abs(evol12).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %</span>`)}${grapheCourbe(points, { largeur: 640, hauteur: 240 })}</div>${objectifs}</div>`;
  }
  return `${barre}${bandeau}${tuiles}
    <div class="grille g-3">${budget}${comptes}${bilan}</div>`;
}
function comparaison(v, avant, hausseBonne, ref = 'vs mois précédent') {
  if (!avant) return `${ref} : —`;
  const d = Math.round((v - avant) / avant * 100);
  if (d === 0) return `<span>= stable</span> ${ref}`;
  const bon = hausseBonne ? d > 0 : d < 0;
  return `<span class="${bon ? 'positif' : 'negatif'}">${d > 0 ? '+' : '−'}${Math.abs(d)} %</span> ${ref}`;
}
function valeurSerie(m) {
  const t = totauxMois(m);
  return evo.serie === 'depenses' ? t.depenses : evo.serie === 'revenus' ? t.revenus : t.solde;
}
function grapheEvolution(largeur = 520) {
  const m = moisSel;
  let donnees = [];
  if (evo.periode === 'mois') {
    for (let i = 5; i >= 0; i--) { const mm = decalerMois(m, -i); const v = valeurSerie(mm); donnees.push({ libelle: moisCourt(mm), valeurs: [v], tips: [`${libelleMois(mm)} : ${euros(v)}`] }); }
  } else if (evo.periode === 'trimestre') {
    for (let i = 3; i >= 0; i--) {
      const finT = decalerMois(m, -3 * i); let v = 0;
      for (let k = 0; k < 3; k++) v += valeurSerie(decalerMois(finT, -k));
      donnees.push({ libelle: `${moisCourt(decalerMois(finT, -2))}–${moisCourt(finT)}`, valeurs: [arrondi(v)], tips: [`3 mois jusqu'à ${libelleMois(finT).toLowerCase()} : ${euros(v)}`] });
    }
  } else {
    const an = Number(m.slice(0, 4));
    const premier = etat.operations.reduce((p, o) => o.date < p ? o.date : p, m + '-01').slice(0, 4);
    for (let a = Math.max(Number(premier), an - 3); a <= an; a++) {
      let v = 0; for (let k = 1; k <= 12; k++) { const mm = `${a}-${pad(k)}`; if (mm <= m) v += valeurSerie(mm); }
      donnees.push({ libelle: String(a), valeurs: [arrondi(v)], tips: [`${a}${a === an ? ' (en cours)' : ''} : ${euros(v)}`] });
    }
  }
  const der = donnees.length - 1;
  return grapheBarres(donnees, ['url(#g-barre-doux)'], { surligne: der, couleurSurligne: 'url(#g-barre)', bulle: euros(donnees[der]?.valeurs[0] || 0, true), hauteur: 220, largeur });
}

/* Lignes réutilisées */
function ligneOperation(o) {
  const cat = categorieParId(o.categorieId), cpt = compteParId(o.compteId);
  return `<li data-action="modifier-op" data-id="${o.id}"><span class="date">${dateCourte(o.date)}</span><span class="ic-ligne">${ic(cat.icone)}</span><div class="lib"><strong>${echapper(o.libelle)}</strong><small>${echapper(cat.nom)}${cpt ? ' · ' + echapper(cpt.nom) : ''}</small></div><span class="mt ${o.montant > 0 ? 'positif' : ''}">${eurosSigne(o.montant)}</span></li>`;
}
function ligneCharge(c) {
  const op = chargeRegleeCeMois(c, moisSel);
  return `<div class="charge ${op ? 'reglee' : ''}"><button class="case ${op ? 'cochee' : ''}" data-action="charge-basculer" data-id="${c.id}" aria-pressed="${!!op}" aria-label="${op ? 'Marquer comme non réglée' : 'Marquer comme réglée'} : ${echapper(c.nom)}">${op ? ic('coche') : ''}</button>
    <span class="ic-ligne" style="color:var(--texte-2)">${ic(c.icone)}</span>
    <div class="lib" style="flex:1"><strong style="font-weight:500;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${echapper(c.nom)}</strong><small class="${op ? 'discret' : ''}" style="display:block;font-size:12px;${op ? '' : 'color:var(--alerte)'}">Le ${c.jour} · ${op ? 'réglée' : 'à régler'}</small></div>
    <span class="mt">${euros(c.montant)}</span></div>`;
}
function ligneObjectif(o) {
  const p = pct(o.actuel, o.cible);
  return `<div class="objectif"><span class="ic-ligne">${ic(o.icone)}</span><span class="nom">${echapper(o.nom)}</span><span class="pct">${p} %</span>
    <div class="barre-ligne">${progres(p, p >= 100 ? '' : 'normal')}</div><span class="chiffres">${euros(o.actuel, true)} sur ${euros(o.cible, true)}</span></div>`;
}

/* ---------- Comptes ---------- */
function vueComptes(id) {
  rendreEntete('Mes comptes', 'Tous vos comptes et leur solde à la fin du mois choisi.');
  const fin = finDeMois(moisSel);
  const filtreType = ongletsEtat.comptes;
  const nbType = t => etat.comptes.filter(c => c.type === t).length;
  const barre = onglets('comptes', [['tous', 'Tous', 'carte', etat.comptes.length], ['courant', 'Courants', 'banque', nbType('courant')], ['epargne', 'Épargne', 'tirelire', nbType('epargne')], ['placement', 'Placements', 'tendance', nbType('placement')]]);
  const groupes = Object.entries(TYPES_COMPTE).filter(([type]) => filtreType === 'tous' || filtreType === type).map(([type, nom]) => {
    const cs = etat.comptes.filter(c => c.type === type);
    if (!cs.length) return '';
    const tot = cs.reduce((s, c) => s + soldeCompte(c, fin), 0);
    return `<div><div class="carte-tete" style="margin:6px 2px 10px"><h2>${{ courant: 'Comptes courants', epargne: 'Épargne', placement: 'Placements' }[type] || nom}</h2><span class="note">${euros(tot)}</span></div>
      <div class="grille g-3">${cs.map(c => `<div class="carte compte-carte ${c.id === id ? 'actif' : ''}" data-action="ouvrir-compte" data-id="${c.id}">
        <div class="haut">${badgeBanque(c)}<div class="lib" style="flex:1"><strong>${echapper(c.nom)}</strong><br><small class="discret">${echapper(c.banque || '')}</small></div>
        <div class="actions-ligne"><button class="bouton-icone" data-action="modifier-compte" data-id="${c.id}" aria-label="Modifier ${echapper(c.nom)}">${ic('crayon')}</button></div></div>
        <div class="solde">${nb(soldeCompte(c, fin))}</div>
        <small class="discret">${eurosSigne(arrondi(soldeCompte(c, fin) - soldeCompte(c, finDeMois(decalerMois(moisSel, -1)))))} ce mois-ci</small>
      </div>`).join('')}</div></div>`;
  }).join('');

  let detail = '';
  const c = id && compteParId(id);
  if (c) {
    const points = [];
    for (let i = 11; i >= 0; i--) { const mm = decalerMois(moisSel, -i); const v = soldeCompte(c, finDeMois(mm)); points.push({ libelle: moisCourt(mm), valeur: v, tip: `${libelleMois(mm)} : ${euros(v)}` }); }
    const ops = opsTriees(etat.operations.filter(o => o.compteId === c.id && moisDe(o.date) === moisSel));
    detail = `<div class="grille g-2">
      <div class="carte">${tete(`Solde · ${echapper(c.nom)}`, `<span class="note">12 derniers mois</span>`)}${grapheCourbe(points)}</div>
      <div class="carte">${tete(`Opérations de ${libelleMois(moisSel).toLowerCase()}`, `<button class="lien" data-action="nouvelle-op" data-compte="${c.id}">${ic('plus')} Ajouter</button>`)}
        ${ops.length ? `<ul class="liste cliquable">${ops.map(ligneOperation).join('')}</ul>` : '<div class="vide">Aucune opération ce mois-ci sur ce compte.</div>'}</div>
    </div>`;
  }
  return `${barre}<div class="barre-outils"><span class="discret">Total : <strong style="color:var(--texte)">${euros(patrimoine(fin))}</strong> sur ${etat.comptes.length} compte${etat.comptes.length > 1 ? 's' : ''}</span><span class="espace"></span><button class="btn principal" data-action="nouveau-compte">${ic('plus')} Ajouter un compte</button></div>
    ${groupes || '<div class="carte vide">Aucun compte dans cette catégorie.</div>'}${detail}`;
}

/* ---------- Opérations (journal) ---------- */
function opsFiltrees() {
  const q = filtreOps.q.trim().toLowerCase();
  return opsTriees(etat.operations.filter(o => {
    if (!filtreOps.tout && moisDe(o.date) !== moisSel) return false;
    if (filtreOps.compte && o.compteId !== filtreOps.compte) return false;
    if (filtreOps.categorie && o.categorieId !== filtreOps.categorie) return false;
    if (filtreOps.type === 'depense' && (o.montant >= 0 || estVirement(o))) return false;
    if (filtreOps.type === 'revenu' && (o.montant <= 0 || estVirement(o))) return false;
    if (filtreOps.type === 'virement' && !estVirement(o)) return false;
    if (q && !(`${o.libelle} ${categorieParId(o.categorieId).nom} ${compteParId(o.compteId)?.nom || ''}`.toLowerCase().includes(q))) return false;
    return true;
  }));
}
function vueOperations() {
  rendreEntete('Journal des opérations', filtreOps.tout ? 'Toutes les dates.' : `Opérations de ${libelleMois(moisSel).toLowerCase()}.`);
  const ops = opsFiltrees();
  const entrees = ops.filter(o => o.montant > 0 && !estVirement(o)).reduce((s, o) => s + o.montant, 0);
  const sorties = ops.filter(o => o.montant < 0 && !estVirement(o)).reduce((s, o) => s - o.montant, 0);
  const opt = (v, l, sel) => `<option value="${echapper(v)}" ${sel === v ? 'selected' : ''}>${echapper(l)}</option>`;
  return `<div class="carte">
    <div class="barre-outils" style="margin-bottom:14px">
      <input class="filtre" id="f-q" type="search" placeholder="Rechercher…" value="${echapper(filtreOps.q)}" aria-label="Rechercher">
      <select class="filtre" id="f-compte" aria-label="Compte">${opt('', 'Tous les comptes', filtreOps.compte)}${etat.comptes.map(c => opt(c.id, c.nom, filtreOps.compte)).join('')}</select>
      <select class="filtre" id="f-categorie" aria-label="Catégorie">${opt('', 'Toutes les catégories', filtreOps.categorie)}${etat.categories.map(c => opt(c.id, c.nom, filtreOps.categorie)).join('')}${opt('virement', 'Virement interne', filtreOps.categorie)}</select>
      <select class="filtre" id="f-type" aria-label="Type">${opt('', 'Tout', filtreOps.type)}${opt('depense', 'Dépenses', filtreOps.type)}${opt('revenu', 'Revenus', filtreOps.type)}${opt('virement', 'Virements', filtreOps.type)}</select>
      <label style="display:flex;gap:6px;align-items:center;font-size:14px"><input type="checkbox" id="f-tout" ${filtreOps.tout ? 'checked' : ''}> Toutes les dates</label>
      <span class="espace"></span>
      <button class="btn" data-action="importer-releve" title="Importer un relevé bancaire (.csv)">${ic('importer')} Relevé</button>
      <button class="btn" data-action="export-csv">${ic('telecharger')} CSV</button>
      <button class="btn principal" data-action="nouvelle-op">${ic('plus')} Nouvelle opération</button>
    </div>
    <div class="barre-outils" style="margin-bottom:6px;font-size:14px;color:var(--texte-2)">
      <span>${ops.length} opération${ops.length > 1 ? 's' : ''}</span>·<span>Entrées <strong class="positif">${euros(entrees)}</strong></span>·<span>Sorties <strong class="negatif">${euros(sorties)}</strong></span>
    </div>
    ${ops.length ? `<div class="tableau-wrap"><table class="tableau"><thead><tr><th>Date</th><th>Libellé</th><th>Catégorie</th><th>Compte</th><th class="num">Montant</th><th></th></tr></thead><tbody>
      ${ops.slice(0, 400).map(o => `<tr><td style="white-space:nowrap">${dateCourte(o.date)}${filtreOps.tout ? ' ' + o.date.slice(0, 4) : ''}</td><td>${echapper(o.libelle)}${o.chargeId ? ' <span class="discret" title="Charge fixe">' + ic('recurrent') + '</span>' : ''}</td><td>${puceCategorie(categorieParId(o.categorieId))}</td><td>${echapper(compteParId(o.compteId)?.nom || '—')}</td>
        <td class="num ${o.montant > 0 ? 'positif' : ''}">${eurosSigne(o.montant)}</td>
        <td><div class="actions-ligne"><button class="bouton-icone" data-action="modifier-op" data-id="${o.id}" aria-label="Modifier">${ic('crayon')}</button><button class="bouton-icone" data-action="supprimer-op" data-id="${o.id}" aria-label="Supprimer">${ic('poubelle')}</button></div></td></tr>`).join('')}
    </tbody></table></div>${ops.length > 400 ? '<p class="discret">Seules les 400 premières sont affichées : affinez la recherche.</p>' : ''}` : '<div class="vide">Aucune opération ne correspond.</div>'}
  </div>`;
}

/* ---------- Budgets ---------- */
function vueBudgets() {
  rendreEntete('Budgets', `Ce que vous avez prévu, et ce que vous avez dépensé en ${libelleMois(moisSel).toLowerCase()}.`);
  const t = totauxMois(moisSel), bt = budgetTotal(), pb = pct(t.depenses, bt);
  const dep = Object.fromEntries(depensesParCategorie(moisSel).map(x => [x.cat.id, x.montant]));
  const cats = categoriesDepense();
  const horsBudget = cats.filter(c => c.budget && (dep[c.id] || 0) > c.budget).length;
  const barre = onglets('budgets', [['categories', 'Par catégorie', 'camembert'], ['detail', 'Tableau détaillé', 'livre', horsBudget ? `${horsBudget} hors budget` : '']]);
  if (ongletsEtat.budgets === 'detail') return `${barre}<div class="carte">${tete('Détail', '<span class="note">Moyenne sur les 3 mois précédents</span>')}
    <div class="tableau-wrap"><table class="tableau"><thead><tr><th>Catégorie</th><th class="num">Budget</th><th class="num">Dépensé</th><th class="num">Reste</th><th class="num">Moy. 3 mois</th><th style="width:28%">Progression</th></tr></thead><tbody>
    ${cats.map(c => {
      const d = dep[c.id] || 0;
      let moy = 0; for (let k = 1; k <= 3; k++) moy += (depensesParCategorie(decalerMois(moisSel, -k)).find(x => x.cat.id === c.id)?.montant || 0);
      return `<tr><td>${puceCategorie(c)}</td><td class="num">${c.budget ? euros(c.budget) : '—'}</td><td class="num">${euros(d)}</td><td class="num ${c.budget && d > c.budget ? 'negatif' : ''}">${c.budget ? euros(c.budget - d) : '—'}</td><td class="num discret">${euros(moy / 3)}</td><td>${c.budget ? progres(pct(d, c.budget)) : ''}</td></tr>`;
    }).join('')}
    </tbody></table></div></div>`;
  return `${barre}<div class="grille g-1-2">
    <div class="carte budget-vedette">${tete('Budget mensuel')}
      <div class="gros">${nb(t.depenses, true)} <small>/ ${euros(bt, true)}</small></div>
      <div class="ligne-pct">${progres(pb, 'clair')}<strong>${pb} %</strong></div>
      <div class="synthese-ligne"><span class="lib">Revenus</span><span class="mt">${euros(t.revenus)}</span></div>
      <div class="synthese-ligne"><span class="lib">Dépenses</span><span class="mt">${euros(t.depenses)}</span></div>
      <div class="reste"><span>Reste à dépenser</span><span>${euros(arrondi(bt - t.depenses))}</span></div>
      <p style="font-size:13.5px;opacity:.8;margin:14px 0 0">Le budget mensuel est la somme des budgets de chaque catégorie. Cliquez sur une catégorie pour changer son budget.</p>
    </div>
    <div class="carte">${tete('Dépenses par catégorie', `<span class="note">${euros(t.depenses)} au total</span>`)}
      <div class="cats">${cats.map(c => {
        const d = dep[c.id] || 0, p = pct(d, c.budget);
        return `<button class="cat-tuile" data-action="modifier-categorie" data-id="${c.id}" title="Modifier le budget"><span class="ic-cat">${ic(c.icone)}</span><span class="nom">${echapper(c.nom)}</span>
          <span class="ligne"><span class="mt">${euros(d, true)}</span><span class="pct">${c.budget ? p + ' %' : 'sans budget'}</span></span>
          ${c.budget ? progres(p) : '<div class="progres"><span style="width:0"></span></div>'}<small class="discret">${c.budget ? (d > c.budget ? `<span class="negatif">${euros(d - c.budget, true)} de trop</span>` : `reste ${euros(c.budget - d, true)}`) : '&nbsp;'}</small></button>`;
      }).join('')}
      <button class="cat-tuile" data-action="nouvelle-categorie" style="place-content:center;justify-items:center;color:var(--texte-2)">${ic('plus')}<span>Nouvelle catégorie</span></button></div>
    </div>
  </div>`;
}

/* ---------- Objectifs ---------- */
function vueObjectifs() {
  rendreEntete("Objectifs d'épargne", 'Mettez de côté pour vos projets, à votre rythme.');
  const tot = etat.objectifs.reduce((s, o) => s + o.actuel, 0), cib = etat.objectifs.reduce((s, o) => s + o.cible, 0);
  return `<div class="barre-outils"><span class="discret">Déjà mis de côté : <strong style="color:var(--texte)">${euros(tot)}</strong> sur ${euros(cib)} (${pct(tot, cib)} %)</span><span class="espace"></span><button class="btn principal" data-action="nouvel-objectif">${ic('plus')} Nouvel objectif</button></div>
  ${etat.objectifs.length ? `<div class="grille g-3">${etat.objectifs.map(o => {
    const p = pct(o.actuel, o.cible), reste = Math.max(0, o.cible - o.actuel);
    let rythme = '';
    if (o.echeance && reste > 0) {
      const [a, m] = o.echeance.split('-').map(Number), [a0, m0] = moisCourant().split('-').map(Number);
      const nb = Math.max(1, (a - a0) * 12 + (m - m0));
      rythme = `<small class="discret">Pour ${libelleMois(o.echeance).toLowerCase()} : <strong style="color:var(--texte)">${euros(reste / nb)}</strong> par mois</small>`;
    }
    return `<div class="carte" style="display:grid;gap:10px">
      <div style="display:flex;gap:12px;align-items:center"><span class="logo-banque" style="background:var(--vert-clair);color:var(--vert)">${ic(o.icone)}</span><strong style="flex:1;font-size:16px">${echapper(o.nom)}</strong>
      <div class="actions-ligne"><button class="bouton-icone" data-action="modifier-objectif" data-id="${o.id}" aria-label="Modifier">${ic('crayon')}</button></div></div>
      <div style="font-family:var(--chiffres);font-weight:700;font-size:22px;letter-spacing:-.02em">${nb(o.actuel)} <span class="discret" style="font-size:14px;font-weight:500">/ ${euros(o.cible)}</span></div>
      <div style="display:flex;align-items:center;gap:10px">${progres(p, 'normal')}<strong>${p} %</strong></div>
      ${p >= 100 ? '<small class="positif">Objectif atteint, bravo !</small>' : `<small class="discret">Il reste ${euros(reste)}</small>`}${rythme}
      <div style="display:flex;gap:8px;margin-top:4px"><button class="btn petit principal" data-action="verser" data-id="${o.id}" data-sens="1">${ic('plus')} Verser</button><button class="btn petit" data-action="verser" data-id="${o.id}" data-sens="-1">Retirer</button></div>
    </div>`;
  }).join('')}</div>` : '<div class="carte vide">Aucun objectif. Créez-en un : voyage, apport immobilier, fonds d\'urgence…</div>'}`;
}

/* ---------- Charges fixes ---------- */
function vueCharges() {
  rendreEntete('Charges fixes', `Ce qui revient chaque mois. Cochez une charge quand elle est prélevée : l'opération est ajoutée toute seule.`);
  const total = etat.charges.reduce((s, c) => s + c.montant, 0);
  const reglees = etat.charges.filter(c => chargeRegleeCeMois(c, moisSel));
  const resteMontant = etat.charges.filter(c => !chargeRegleeCeMois(c, moisSel)).reduce((s, c) => s + c.montant, 0);
  return `<div class="grille g-tuiles" style="grid-template-columns:repeat(3,minmax(0,1fr))">
      <div class="carte tuile vedette"><span class="ic-tuile">${ic('calendrier')}</span><div><div class="etiquette">Total mensuel</div><div class="valeur">${euros(total)}</div></div></div>
      <div class="carte tuile"><span class="ic-tuile positif">${ic('coche')}</span><div><div class="etiquette">Réglées en ${libelleMois(moisSel).toLowerCase()}</div><div class="valeur">${reglees.length} / ${etat.charges.length}</div></div></div>
      <div class="carte tuile"><span class="ic-tuile">${ic('alerte')}</span><div><div class="etiquette">Reste à régler</div><div class="valeur">${euros(resteMontant)}</div></div></div>
    </div>
    <div class="carte">${tete('Mes charges', `<button class="btn principal" data-action="nouvelle-charge">${ic('plus')} Ajouter</button>`)}
      ${etat.charges.length ? [...etat.charges].sort((a, b) => a.jour - b.jour).map(c => ligneCharge(c).replace(/<\/div>$/, `<div class="actions-ligne"><button class="bouton-icone" data-action="modifier-charge" data-id="${c.id}" aria-label="Modifier ${echapper(c.nom)}">${ic('crayon')}</button></div></div>`)).join('') : '<div class="vide">Aucune charge fixe pour l\'instant.</div>'}
    </div>`;
}

/* ---------- Analyses ---------- */
function vueAnalyses() {
  rendreEntete('Analyses', `Vos tendances sur les ${analysePeriode} derniers mois.`);
  const n = analysePeriode, mois = [];
  for (let i = n - 1; i >= 0; i--) mois.push(decalerMois(moisSel, -i));
  const tots = mois.map(m => totauxMois(m));
  const sRev = tots.reduce((s, t) => s + t.revenus, 0), sDep = tots.reduce((s, t) => s + t.depenses, 0);
  const pal = paletteCategories();
  const patDebut = patrimoine(finDeMois(decalerMois(moisSel, -n))), patFin = patrimoine(finDeMois(moisSel));

  const revDep = grapheBarres(mois.map((m, i) => ({ libelle: moisCourt(m), valeurs: [tots[i].revenus, tots[i].depenses], tips: [`Revenus ${libelleMois(m).toLowerCase()} : ${euros(tots[i].revenus)}`, `Dépenses ${libelleMois(m).toLowerCase()} : ${euros(tots[i].depenses)}`] })), ['#16c486', '#2f6bff'], { hauteur: 230, largeur: 640 });
  const epargne = grapheBarres(mois.map((m, i) => ({ libelle: moisCourt(m), valeurs: [tots[i].solde], tips: [`Épargne ${libelleMois(m).toLowerCase()} : ${euros(tots[i].solde)}`] })), ['url(#g-barre-doux)'], { hauteur: 230, largeur: 640, surligne: n - 1, couleurSurligne: 'url(#g-barre)' });
  const courbe = grapheCourbe(mois.map(m => { const v = patrimoine(finDeMois(m)); return { libelle: moisCourt(m), valeur: v, tip: `${libelleMois(m)} : ${euros(v)}` }; }), { largeur: 640, hauteur: 230 });

  const parCat = {};
  mois.forEach(m => depensesParCategorie(m).forEach(x => { parCat[x.cat.id] = parCat[x.cat.id] || { cat: x.cat, montant: 0 }; parCat[x.cat.id].montant += x.montant; }));
  const cats = Object.values(parCat).sort((a, b) => b.montant - a.montant);
  const totCat = cats.reduce((s, x) => s + x.montant, 0);
  const segs = cats.slice(0, 7);
  const grosses = opsTriees(etat.operations.filter(o => mois.includes(moisDe(o.date)) && o.montant < 0 && !estVirement(o) && !o.chargeId)).sort((a, b) => a.montant - b.montant).slice(0, 6);
  const leg = l => `<span style="display:inline-flex;gap:14px;font-size:13.5px">${l.map(([c, t]) => `<span style="display:inline-flex;gap:6px;align-items:center"><span class="pastille" style="width:12px;height:12px;border-radius:3px;background:${c}"></span>${t}</span>`).join('')}</span>`;

  const barre = `<div class="barre-outils">${onglets('analyses', [['ensemble', "Vue d'ensemble", 'barres'], ['depenses', 'Dépenses', 'panier'], ['epargne', 'Épargne', 'tirelire']])}<span class="espace"></span><div class="segments">${[6, 12].map(v => `<button data-action="analyse-periode" data-v="${v}" class="${analysePeriode === v ? 'actif' : ''}">${v} mois</button>`).join('')}</div></div>`;
  const o = ongletsEtat.analyses;

  if (o === 'depenses') return `${barre}
    <div class="grille g-2">
      <div class="carte">${tete('Où part votre argent', `<span class="note">${euros(totCat)} en ${n} mois</span>`)}
        <div class="donut-bloc">${grapheAnneau(segs.map((s, i) => ({ valeur: s.montant, couleur: pal[i], libelle: s.cat.nom })), euros(totCat / n, true), 'par mois', 190)}
        <ul class="legende">${segs.map((s, i) => `<li><span class="pastille" style="background:${pal[i]}"></span><span class="lib">${echapper(s.cat.nom)}</span><span class="mt">${euros(s.montant / n, true)}/mois</span><span class="pct">${pct(s.montant, totCat)} %</span></li>`).join('')}</ul></div>
      </div>
      <div class="carte">${tete('Plus grosses dépenses', '<span class="note">hors charges fixes</span>')}
        ${grosses.length ? `<ul class="liste cliquable">${grosses.map(op => ligneOperation(op).replace('<span class="date">', '<span class="date" style="width:84px">').replace(dateCourte(op.date), dateCourte(op.date) + ' ' + op.date.slice(2, 4))).join('')}</ul>` : '<div class="vide">Rien à afficher.</div>'}
      </div>
    </div>
    <div class="carte">${tete('Dépenses mois par mois')}${grapheBarres(mois.map((m, i) => ({ libelle: moisCourt(m), valeurs: [tots[i].depenses], tips: [`${libelleMois(m)} : ${euros(tots[i].depenses)}`] })), ['url(#g-barre-doux)'], { hauteur: 220, largeur: 1000, surligne: n - 1, couleurSurligne: 'url(#g-barre)' })}</div>`;

  if (o === 'epargne') {
    const meilleurs = mois.map((m, i) => ({ m, v: tots[i].solde, r: tots[i].revenus })).sort((a, b) => b.v - a.v).slice(0, 3);
    return `${barre}
    <div class="grille g-tuiles" style="grid-template-columns:repeat(3,minmax(0,1fr))">
      <div class="carte tuile vedette"><span class="ic-tuile">${ic('tirelire')}</span><div><div class="etiquette">Épargné en ${n} mois</div><div class="valeur">${nb(arrondi(sRev - sDep))}</div></div></div>
      <div class="carte tuile"><span class="ic-tuile">${ic('pieces')}</span><div><div class="etiquette">En moyenne par mois</div><div class="valeur">${nb((sRev - sDep) / n)}</div></div></div>
      <div class="carte tuile"><span class="ic-tuile bleu">${ic('tendance')}</span><div><div class="etiquette">Taux d'épargne</div><div class="valeur">${pct(sRev - sDep, sRev)} %</div></div></div>
    </div>
    <div class="grille g-2-1">
      <div class="carte">${tete('Évolution de votre épargne', '<span class="note">Revenus − dépenses</span>')}${epargne}</div>
      <div class="carte">${tete('Vos meilleurs mois')}
        <ul class="liste">${meilleurs.map((x, i) => `<li><span class="ic-ligne" style="font-family:var(--chiffres);font-weight:700;color:var(--or-fonce)">${i + 1}</span><div class="lib"><strong>${libelleMois(x.m)}</strong><small>${pct(x.v, x.r)} % des revenus mis de côté</small></div><span class="mt positif">${euros(x.v)}</span></li>`).join('')}</ul>
      </div>
    </div>`;
  }

  return `${barre}
    <div class="grille g-tuiles">
      <div class="carte tuile vedette"><span class="ic-tuile">${ic('tendance')}</span><div><div class="etiquette">Évolution du patrimoine</div><div class="valeur">${eurosSigne(arrondi(patFin - patDebut))}</div><small style="opacity:.85">${patDebut ? `${patFin >= patDebut ? '+' : '−'} ${Math.abs(((patFin - patDebut) / Math.abs(patDebut)) * 100).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} % en ${n} mois` : ''}</small></div></div>
      <div class="carte tuile"><span class="ic-tuile">${ic('salaire')}</span><div><div class="etiquette">Revenus moyens / mois</div><div class="valeur">${nb(sRev / n)}</div></div></div>
      <div class="carte tuile"><span class="ic-tuile bleu">${ic('panier')}</span><div><div class="etiquette">Dépenses moyennes / mois</div><div class="valeur">${nb(sDep / n)}</div></div></div>
      <div class="carte tuile"><span class="ic-tuile">${ic('tirelire')}</span><div><div class="etiquette">Taux d'épargne</div><div class="valeur">${pct(sRev - sDep, sRev)} %</div></div></div>
    </div>
    <div class="grille g-2">
      <div class="carte">${tete('Revenus et dépenses', leg([['#16c486', 'Revenus'], ['#2f6bff', 'Dépenses']]))}${revDep}</div>
      <div class="carte">${tete('Évolution du patrimoine')}${courbe}</div>
    </div>`;
}

/* ---------- Paramètres ---------- */
function vueParametres() {
  rendreEntete('Paramètres', 'Votre profil, vos catégories et vos données.');
  const premiere = etat.operations.reduce((p, o) => (!p || o.date < p ? o.date : p), '');
  return `<div class="grille g-2">
    <div class="carte">${tete('Mon profil')}
      <form id="form-profil"><div class="champ"><label for="p-prenom">Prénom (pour « Bonjour … »)</label><input id="p-prenom" name="prenom" value="${echapper(etat.profil?.prenom || '')}" placeholder="Votre prénom" autocomplete="given-name"></div>
      <button class="btn principal" type="submit">Enregistrer</button></form>
    </div>
    <div class="carte">${tete('En bref')}
      <ul class="liste">
        <li><span class="ic-ligne">${ic('banque')}</span><div class="lib"><strong>Comptes suivis</strong></div><span class="mt">${etat.comptes.length}</span></li>
        <li><span class="ic-ligne">${ic('fleches')}</span><div class="lib"><strong>Opérations enregistrées</strong></div><span class="mt">${etat.operations.length.toLocaleString('fr-FR')}</span></li>
        <li><span class="ic-ligne">${ic('calendrier')}</span><div class="lib"><strong>Depuis le</strong></div><span class="mt">${premiere ? dateLongue(premiere) : '—'}</span></li>
      </ul>
    </div>
  </div>
  <div class="grille g-2">
    <div class="carte">${tete('Catégories', `<button class="btn petit" data-action="nouvelle-categorie">${ic('plus')} Ajouter</button>`)}
      <ul class="liste">${etat.categories.map(c => `<li><span class="ic-ligne">${ic(c.icone)}</span><div class="lib"><strong>${echapper(c.nom)}</strong><small>${c.type === 'revenu' ? 'Revenu' : 'Dépense' + (c.budget ? ' · budget ' + euros(c.budget) : '')}</small></div><div class="actions-ligne"><button class="bouton-icone" data-action="modifier-categorie" data-id="${c.id}" aria-label="Modifier ${echapper(c.nom)}">${ic('crayon')}</button></div></li>`).join('')}</ul>
    </div>
    <div class="carte">${tete('Mes données')}
      <p class="discret" style="margin-top:0">Tout est enregistré <strong>uniquement dans ce navigateur</strong>, sur cet ordinateur. Rien n'est envoyé sur Internet. Pensez à faire une sauvegarde de temps en temps.</p>
      <div style="display:grid;gap:10px">
        <button class="btn" data-action="sauvegarde">${ic('telecharger')} Télécharger une sauvegarde (.json)</button>
        <button class="btn" data-action="restaurer">${ic('importer')} Restaurer une sauvegarde</button>
        <button class="btn" data-action="importer-releve">${ic('importer')} Importer un relevé bancaire (.csv)</button>
        <button class="btn" data-action="export-csv-tout">${ic('telecharger')} Exporter toutes les opérations (.csv, pour Excel)</button>
        <hr style="border:0;border-top:1px solid var(--trait);width:100%">
        <button class="btn" data-action="partir-zero">${ic('plante')} Partir de zéro (garder les catégories)</button>
        <button class="btn" data-action="remettre-exemples">${ic('recurrent')} Remettre les données d'exemple</button>
      </div>
      <input type="file" id="fichier-import" accept=".json,application/json" hidden>
    </div>
  </div>`;
}

/* ---------- Formulaires (modale) ---------- */
function ouvrirModale(titre, html, surValider) {
  $('#modale-titre').textContent = titre;
  $('#modale-corps').innerHTML = `<form id="form-modale" novalidate>${html}</form>`;
  $('#modale').hidden = false;
  const f = $('#form-modale');
  f.addEventListener('submit', e => { e.preventDefault(); if (surValider(new FormData(f), f) !== false) fermerModale(); });
  setTimeout(() => f.querySelector('input:not([type=hidden]),select')?.focus(), 30);
}
function fermerModale() { $('#modale').hidden = true; $('#modale-corps').innerHTML = ''; }
function champ(lib, nom, val = '', type = 'text', extra = '') { return `<div class="champ"><label for="c-${nom}">${lib}</label><input id="c-${nom}" name="${nom}" type="${type}" value="${echapper(val)}" ${extra}></div>`; }
function selectHtml(lib, nom, options, val) { return `<div class="champ"><label for="c-${nom}">${lib}</label><select id="c-${nom}" name="${nom}">${options.map(([v, l]) => `<option value="${echapper(v)}" ${v === val ? 'selected' : ''}>${echapper(l)}</option>`).join('')}</select></div>`; }
function choixIcone(val) {
  return `<div class="champ"><label>Icône</label><input type="hidden" name="icone" value="${val}"><div class="choix-icones">${ICONES_CHOIX.map(n => `<button type="button" data-icone="${n}" class="${n === val ? 'actif' : ''}" aria-label="${n}">${ic(n)}</button>`).join('')}</div></div>`;
}
function piedModale(supprimer = '') { return `<div class="modale-pied">${supprimer ? `<button type="button" class="btn danger gauche" data-action="${supprimer}">${ic('poubelle')} Supprimer</button>` : ''}<button type="button" class="btn" data-action="fermer">Annuler</button><button class="btn principal" type="submit">Enregistrer</button></div>`; }
function lireMontant(v) { return Number(String(v).replace(/\s/g, '').replace(',', '.')); }
function erreur(f, nom, msg) { const el = f.querySelector(`[name="${nom}"]`); el?.focus(); toast(msg); return false; }

function formOperation(op = null, compteDefaut = null) {
  if (!etat.comptes.length) { toast("Ajoutez d'abord un compte."); location.hash = '#/comptes'; return; }
  let type = op ? (estVirement(op) ? 'virement' : op.montant > 0 ? 'revenu' : 'depense') : 'depense';
  let lie = op && op.lienId ? etat.operations.find(o => o.lienId === op.lienId && o.id !== op.id) : null;
  let source = op ? (type === 'virement' && op.montant > 0 && lie ? lie : op) : null;
  let dest = type === 'virement' ? (source === op ? lie : op) : null;
  const dateDefaut = moisEstCourant() ? aujourdhui() : finDeMois(moisSel);
  const compteOptions = etat.comptes.map(c => [c.id, c.nom]);
  const rendreChamps = () => {
    const cats = (type === 'revenu' ? categoriesRevenu() : categoriesDepense()).map(c => [c.id, c.nom]);
    return `<div class="champ"><div class="bascule" role="group" aria-label="Type">${[['depense', 'Dépense'], ['revenu', 'Revenu'], ['virement', 'Virement entre comptes']].map(([v, l]) => `<button type="button" data-type="${v}" class="${type === v ? 'actif' : ''}">${l}</button>`).join('')}</div></div>
      <div class="champs-2">${champ('Montant (€)', 'montant', op ? Math.abs(op.montant).toString().replace('.', ',') : '', 'text', 'inputmode="decimal" placeholder="0,00" required')}${champ('Date', 'date', op?.date || dateDefaut, 'date', 'required')}</div>
      ${champ('Libellé', 'libelle', op?.libelle || '', 'text', `placeholder="${type === 'virement' ? 'Virement vers le Livret A' : type === 'revenu' ? 'Salaire' : 'Courses, restaurant…'}"`)}
      ${type === 'virement'
        ? `<div class="champs-2">${selectHtml('Depuis le compte', 'source', compteOptions, source?.compteId || etat.comptes[0].id)}${selectHtml('Vers le compte', 'dest', compteOptions, dest?.compteId || (etat.comptes[1] || etat.comptes[0]).id)}</div>`
        : `<div class="champs-2">${selectHtml('Catégorie', 'categorie', cats, op?.categorieId || cats[0]?.[0])}${selectHtml('Compte', 'compte', compteOptions, op?.compteId || compteDefaut || etat.comptes[0].id)}</div>`}
      ${piedModale(op ? 'supprimer-op-modale' : '')}`;
  };
  ouvrirModale(op ? "Modifier l'opération" : 'Nouvelle opération', rendreChamps(), (fd, f) => {
    const montant = lireMontant(fd.get('montant'));
    if (!(montant > 0)) return erreur(f, 'montant', 'Indiquez un montant supérieur à 0.');
    const date = fd.get('date'); if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return erreur(f, 'date', 'Indiquez une date.');
    let libelle = String(fd.get('libelle') || '').trim();
    if (op) etat.operations = etat.operations.filter(o => o.id !== op.id && !(op.lienId && o.lienId === op.lienId));
    if (type === 'virement') {
      const s = fd.get('source'), d = fd.get('dest');
      if (s === d) return erreur(f, 'dest', 'Choisissez deux comptes différents.');
      const lien = nouvelId();
      etat.operations.push({ id: nouvelId(), date, libelle: libelle || `Virement vers ${compteParId(d).nom}`, montant: -montant, categorieId: 'virement', compteId: s, lienId: lien });
      etat.operations.push({ id: nouvelId(), date, libelle: libelle ? libelle : `Virement depuis ${compteParId(s).nom}`, montant, categorieId: 'virement', compteId: d, lienId: lien });
    } else {
      const categorieId = fd.get('categorie');
      etat.operations.push({ id: op?.id || nouvelId(), date, libelle: libelle || categorieParId(categorieId).nom, montant: type === 'revenu' ? montant : -montant, categorieId, compteId: fd.get('compte'), ...(op?.chargeId ? { chargeId: op.chargeId } : {}) });
    }
    moisSel = moisDe(date) <= moisCourant() ? moisDe(date) : moisSel;
    enregistrer(op ? 'Opération modifiée.' : 'Opération ajoutée.');
  });
  // bascule de type : on redessine les champs en gardant montant/date/libellé
  $('#form-modale').addEventListener('click', e => {
    const b = e.target.closest('[data-type]'); if (!b) return;
    const f = $('#form-modale'), garde = { montant: f.montant.value, date: f.date.value, libelle: f.libelle.value };
    type = b.dataset.type;
    f.innerHTML = rendreChamps();
    Object.entries(garde).forEach(([k, v]) => f[k].value = v);
  });
  formOperation.courante = op;
}

function formCompte(c = null) {
  const couleurs = ['#2456e6', '#0e9f6e', '#1a3fc4', '#0b7d5a', '#0f7f8c', '#0a2a6b', '#c99a45', '#475569'];
  ouvrirModale(c ? 'Modifier le compte' : 'Nouveau compte', `
    ${champ('Nom du compte', 'nom', c?.nom || '', 'text', 'placeholder="Compte courant, Livret A…" required')}
    <div class="champs-2">${champ('Banque', 'banque', c?.banque || '', 'text', 'placeholder="Ma banque"')}${selectHtml('Type', 'type', Object.entries(TYPES_COMPTE), c?.type || 'courant')}</div>
    ${champ(c ? 'Solde actuel (€)' : "Solde aujourd'hui (€)", 'solde', c ? String(soldeCompte(c)).replace('.', ',') : '', 'text', 'inputmode="decimal" placeholder="0,00"')}
    <div class="champ"><label>Couleur du badge</label><input type="hidden" name="couleur" value="${c?.couleur || couleurs[0]}"><div class="choix-icones">${couleurs.map(k => `<button type="button" data-couleur="${k}" class="${k === (c?.couleur || couleurs[0]) ? 'actif' : ''}" style="background:${k}" aria-label="Couleur ${k}"></button>`).join('')}</div></div>
    ${piedModale(c ? 'supprimer-compte' : '')}`, (fd, f) => {
    const nom = String(fd.get('nom')).trim(); if (!nom) return erreur(f, 'nom', 'Donnez un nom au compte.');
    const soldeVoulu = lireMontant(fd.get('solde') || 0); if (isNaN(soldeVoulu)) return erreur(f, 'solde', 'Solde invalide.');
    const cible = c || { id: nouvelId(), icone: 'banque', soldeInitial: 0 };
    Object.assign(cible, { nom, banque: String(fd.get('banque')).trim(), type: fd.get('type'), couleur: fd.get('couleur') });
    // on ajuste le solde de départ pour que le solde actuel corresponde
    cible.soldeInitial = arrondi((cible.soldeInitial || 0) + soldeVoulu - soldeCompte(cible));
    if (!c) etat.comptes.push(cible);
    enregistrer(c ? 'Compte modifié.' : 'Compte ajouté.');
  });
  formCompte.courant = c;
}

function formObjectif(o = null) {
  ouvrirModale(o ? "Modifier l'objectif" : 'Nouvel objectif', `
    ${champ('Nom du projet', 'nom', o?.nom || '', 'text', 'placeholder="Voyage, apport, voiture…" required')}
    <div class="champs-2">${champ('Montant visé (€)', 'cible', o ? String(o.cible).replace('.', ',') : '', 'text', 'inputmode="decimal" required')}${champ('Déjà mis de côté (€)', 'actuel', o ? String(o.actuel).replace('.', ',') : '0', 'text', 'inputmode="decimal"')}</div>
    ${champ('Échéance (facultatif)', 'echeance', o?.echeance || '', 'month')}
    ${choixIcone(o?.icone || 'cible')}
    ${piedModale(o ? 'supprimer-objectif' : '')}`, (fd, f) => {
    const nom = String(fd.get('nom')).trim(); if (!nom) return erreur(f, 'nom', 'Donnez un nom.');
    const cible = lireMontant(fd.get('cible')); if (!(cible > 0)) return erreur(f, 'cible', 'Indiquez le montant visé.');
    const actuel = lireMontant(fd.get('actuel') || 0); if (isNaN(actuel) || actuel < 0) return erreur(f, 'actuel', 'Montant invalide.');
    const obj = o || { id: nouvelId() };
    Object.assign(obj, { nom, cible, actuel, echeance: fd.get('echeance') || '', icone: fd.get('icone') });
    if (!o) etat.objectifs.push(obj);
    enregistrer(o ? 'Objectif modifié.' : 'Objectif créé.');
  });
  formObjectif.courant = o;
}

function formCharge(c = null) {
  if (!etat.comptes.length) { toast("Ajoutez d'abord un compte."); location.hash = '#/comptes'; return; }
  ouvrirModale(c ? 'Modifier la charge' : 'Nouvelle charge fixe', `
    ${champ('Nom', 'nom', c?.nom || '', 'text', 'placeholder="Loyer, électricité, Netflix…" required')}
    <div class="champs-2">${champ('Montant (€)', 'montant', c ? String(c.montant).replace('.', ',') : '', 'text', 'inputmode="decimal" required')}${champ('Jour du prélèvement', 'jour', c?.jour || 1, 'number', 'min="1" max="31"')}</div>
    <div class="champs-2">${selectHtml('Catégorie', 'categorie', categoriesDepense().map(x => [x.id, x.nom]), c?.categorieId || 'factures')}${selectHtml('Compte prélevé', 'compte', etat.comptes.map(x => [x.id, x.nom]), c?.compteId || etat.comptes[0].id)}</div>
    ${choixIcone(c?.icone || 'eclair')}
    ${piedModale(c ? 'supprimer-charge' : '')}`, (fd, f) => {
    const nom = String(fd.get('nom')).trim(); if (!nom) return erreur(f, 'nom', 'Donnez un nom.');
    const montant = lireMontant(fd.get('montant')); if (!(montant > 0)) return erreur(f, 'montant', 'Indiquez un montant.');
    const jour = Math.min(31, Math.max(1, parseInt(fd.get('jour')) || 1));
    const ch = c || { id: nouvelId() };
    Object.assign(ch, { nom, montant, jour, categorieId: fd.get('categorie'), compteId: fd.get('compte'), icone: fd.get('icone') });
    if (!c) etat.charges.push(ch);
    enregistrer(c ? 'Charge modifiée.' : 'Charge ajoutée.');
  });
  formCharge.courante = c;
}

function formCategorie(c = null) {
  ouvrirModale(c ? 'Modifier la catégorie' : 'Nouvelle catégorie', `
    ${champ('Nom', 'nom', c?.nom || '', 'text', 'required')}
    <div class="champs-2">${selectHtml('Type', 'type', [['depense', 'Dépense'], ['revenu', 'Revenu']], c?.type || 'depense')}${champ('Budget mensuel (€)', 'budget', c?.budget ? String(c.budget).replace('.', ',') : '', 'text', 'inputmode="decimal" placeholder="Aucun"')}</div>
    ${choixIcone(c?.icone || 'points')}
    ${piedModale(c ? 'supprimer-categorie' : '')}`, (fd, f) => {
    const nom = String(fd.get('nom')).trim(); if (!nom) return erreur(f, 'nom', 'Donnez un nom.');
    const budget = fd.get('budget') ? lireMontant(fd.get('budget')) : 0; if (isNaN(budget) || budget < 0) return erreur(f, 'budget', 'Budget invalide.');
    const cat = c || { id: nouvelId() };
    Object.assign(cat, { nom, type: fd.get('type'), budget: fd.get('type') === 'revenu' ? 0 : budget, icone: fd.get('icone') });
    if (!c) etat.categories.push(cat);
    enregistrer(c ? 'Catégorie modifiée.' : 'Catégorie ajoutée.');
  });
  formCategorie.courante = c;
}

function formVersement(o, sens) {
  ouvrirModale(sens > 0 ? `Verser sur « ${o.nom} »` : `Retirer de « ${o.nom} »`, `${champ('Montant (€)', 'montant', '', 'text', 'inputmode="decimal" placeholder="0,00" required')}${piedModale()}`, (fd, f) => {
    const m = lireMontant(fd.get('montant')); if (!(m > 0)) return erreur(f, 'montant', 'Indiquez un montant.');
    o.actuel = arrondi(Math.max(0, o.actuel + sens * m));
    enregistrer(sens > 0 ? `${euros(m)} mis de côté.` : `${euros(m)} retiré.`);
  });
}

/* ---------- Fichiers ---------- */
function telecharger(nom, contenu, type) {
  const url = URL.createObjectURL(new Blob([contenu], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: nom });
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exporterCsv(ops, nom) {
  const cel = v => `"${String(v).replace(/"/g, '""')}"`;
  const lignes = [['Date', 'Libellé', 'Catégorie', 'Compte', 'Montant'].map(cel).join(';')]
    .concat(opsTriees(ops).map(o => [o.date, o.libelle, categorieParId(o.categorieId).nom, compteParId(o.compteId)?.nom || '', String(o.montant).replace('.', ',')].map(cel).join(';')));
  telecharger(nom, '﻿' + lignes.join('\r\n'), 'text/csv;charset=utf-8');
}

/* ---------- Actions ---------- */
const ACTIONS = {
  'mois': b => { const n = moisSel; moisSel = decalerMois(moisSel, Number(b.dataset.n)); if (moisSel > moisCourant()) moisSel = n; animerProchain = true; rendre(); },
  'nouvelle-op': b => formOperation(null, b.dataset.compte),
  'modifier-op': b => formOperation(etat.operations.find(o => o.id === b.dataset.id)),
  'supprimer-op': b => {
    const op = etat.operations.find(o => o.id === b.dataset.id); if (!op || !confirm(`Supprimer « ${op.libelle} » (${eurosSigne(op.montant)}) ?`)) return;
    etat.operations = etat.operations.filter(o => o.id !== op.id && !(op.lienId && o.lienId === op.lienId)); enregistrer('Opération supprimée.');
  },
  'supprimer-op-modale': () => { const op = formOperation.courante; if (!op || !confirm(`Supprimer « ${op.libelle} » ?`)) return; etat.operations = etat.operations.filter(o => o.id !== op.id && !(op.lienId && o.lienId === op.lienId)); fermerModale(); enregistrer('Opération supprimée.'); },
  'nouveau-compte': () => formCompte(),
  'modifier-compte': (b, e) => { e.stopPropagation(); formCompte(compteParId(b.dataset.id)); },
  'ouvrir-compte': b => { location.hash = `#/comptes/${b.dataset.id}`; },
  'supprimer-compte': () => {
    const c = formCompte.courant; const n = etat.operations.filter(o => o.compteId === c.id).length;
    if (!confirm(`Supprimer le compte « ${c.nom} »${n ? ` et ses ${n} opérations` : ''} ? C'est définitif.`)) return;
    etat.comptes = etat.comptes.filter(x => x.id !== c.id); etat.operations = etat.operations.filter(o => o.compteId !== c.id);
    fermerModale(); location.hash = '#/comptes'; enregistrer('Compte supprimé.');
  },
  'nouvel-objectif': () => formObjectif(),
  'modifier-objectif': b => formObjectif(etat.objectifs.find(o => o.id === b.dataset.id)),
  'supprimer-objectif': () => { const o = formObjectif.courant; if (!confirm(`Supprimer l'objectif « ${o.nom} » ?`)) return; etat.objectifs = etat.objectifs.filter(x => x.id !== o.id); fermerModale(); enregistrer('Objectif supprimé.'); },
  'verser': b => formVersement(etat.objectifs.find(o => o.id === b.dataset.id), Number(b.dataset.sens)),
  'nouvelle-charge': () => formCharge(),
  'modifier-charge': b => formCharge(etat.charges.find(c => c.id === b.dataset.id)),
  'supprimer-charge': () => { const c = formCharge.courante; if (!confirm(`Supprimer la charge « ${c.nom} » ? (Les opérations déjà passées restent.)`)) return; etat.charges = etat.charges.filter(x => x.id !== c.id); fermerModale(); enregistrer('Charge supprimée.'); },
  'charge-basculer': b => {
    const c = etat.charges.find(x => x.id === b.dataset.id), op = chargeRegleeCeMois(c, moisSel);
    if (op) { etat.operations = etat.operations.filter(o => o.id !== op.id); enregistrer(`${c.nom} : marquée non réglée.`); }
    else {
      if (!compteParId(c.compteId)) { toast('Le compte de cette charge n\'existe plus : modifiez la charge.'); return; }
      etat.operations.push({ id: nouvelId(), date: `${moisSel}-${pad(Math.min(c.jour, joursDansMois(moisSel)))}`, libelle: c.nom, montant: -c.montant, categorieId: c.categorieId, compteId: c.compteId, chargeId: c.id });
      enregistrer(`${c.nom} réglée : ${euros(c.montant)} ajoutés aux opérations.`);
    }
  },
  'nouvelle-categorie': () => formCategorie(),
  'modifier-categorie': b => formCategorie(etat.categories.find(c => c.id === b.dataset.id)),
  'supprimer-categorie': () => {
    const c = formCategorie.courante; const n = etat.operations.filter(o => o.categorieId === c.id).length;
    if (!confirm(`Supprimer la catégorie « ${c.nom} » ?${n ? ` Ses ${n} opérations passeront dans « Autres ».` : ''}`)) return;
    const repli = etat.categories.find(x => x.id !== c.id && x.type === c.type && /autre/i.test(x.nom)) || etat.categories.find(x => x.id !== c.id && x.type === c.type);
    etat.operations.forEach(o => { if (o.categorieId === c.id) o.categorieId = repli?.id || 'autres'; });
    etat.charges.forEach(o => { if (o.categorieId === c.id) o.categorieId = repli?.id || 'autres'; });
    etat.categories = etat.categories.filter(x => x.id !== c.id); fermerModale(); enregistrer('Catégorie supprimée.');
  },
  'evo-serie': b => { evo.serie = b.dataset.v; rendre(); },
  'evo-periode': b => { evo.periode = b.dataset.v; rendre(); },
  'analyse-periode': b => { analysePeriode = Number(b.dataset.v); rendre(); },
  'export-csv': () => exporterCsv(opsFiltrees(), `jack-finance-operations-${filtreOps.tout ? 'toutes' : moisSel}.csv`),
  'export-csv-tout': () => exporterCsv(etat.operations, `jack-finance-operations-${aujourdhui()}.csv`),
  'sauvegarde': () => { telecharger(`jack-finance-sauvegarde-${aujourdhui()}.json`, JSON.stringify(etat, null, 2), 'application/json'); toast('Sauvegarde téléchargée.'); },
  'restaurer': () => $('#fichier-import').click(),
  'partir-zero': () => { if (!confirm('Effacer comptes, opérations, objectifs et charges pour partir de zéro ? (Faites une sauvegarde avant si besoin.)')) return; etat = etatVide(); moisSel = moisCourant(); enregistrer('Vous partez de zéro. Commencez par ajouter un compte !'); location.hash = '#/comptes'; },
  'remettre-exemples': () => { if (!confirm('Remplacer toutes vos données par les données d\'exemple ?')) return; const p = etat.profil; etat = creerDonneesExemple(); etat.profil = p; moisSel = moisCourant(); enregistrer('Données d\'exemple remises.'); },
  'notifs': b => {
    const ex = document.querySelector('.panneau-notifs'); if (ex) { ex.remove(); return; }
    const l = alertes();
    const p = document.createElement('div'); p.className = 'panneau-notifs';
    p.innerHTML = `<h3>Alertes</h3>${l.length ? l.map(a => `<div class="notif ${a.type}">${ic(a.type === 'ok' ? 'coche' : 'alerte')}<span>${a.texte}</span></div>`).join('') : '<div class="notif ok">' + ic('coche') + '<span>Tout va bien ce mois-ci.</span></div>'}`;
    b.parentElement.appendChild(p);
  },
  'fermer': () => fermerModale(),
  'onglet': b => { ongletsEtat[b.dataset.page] = b.dataset.v; animerProchain = true; rendre(); },
  'presentation': (b, e) => { e.preventDefault(); fermerMenu(); ouvrirPresentation(); },
};

document.addEventListener('click', e => {
  if (!e.target.closest('.cloche')) document.querySelector('.panneau-notifs')?.remove();
  const ico = e.target.closest('[data-icone]');
  if (ico) { const f = ico.closest('form'); f.icone.value = ico.dataset.icone; f.querySelectorAll('[data-icone]').forEach(x => x.classList.toggle('actif', x === ico)); return; }
  const coul = e.target.closest('[data-couleur]');
  if (coul) { const f = coul.closest('form'); f.couleur.value = coul.dataset.couleur; f.querySelectorAll('[data-couleur]').forEach(x => x.classList.toggle('actif', x === coul)); return; }
  const b = e.target.closest('[data-action]');
  if (b && ACTIONS[b.dataset.action] && !b.disabled) { ACTIONS[b.dataset.action](b, e); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modale').hidden) fermerModale(); });
$('#modale-fermer').innerHTML = ic('croix');
$('#modale-fermer').addEventListener('click', fermerModale);
$('#modale').addEventListener('mousedown', e => { if (e.target.id === 'modale') fermerModale(); });

// Filtres du journal et recherche globale
document.addEventListener('input', e => {
  const id = e.target.id;
  if (id === 'f-q') { filtreOps.q = e.target.value; rendreGarderFocus(id); }
});
document.addEventListener('change', e => {
  const id = e.target.id;
  if (id === 'f-compte') filtreOps.compte = e.target.value;
  else if (id === 'f-categorie') filtreOps.categorie = e.target.value;
  else if (id === 'f-type') filtreOps.type = e.target.value;
  else if (id === 'f-tout') filtreOps.tout = e.target.checked;
  else if (id === 'fichier-import') return importer(e.target);
  else return;
  rendre();
});
document.addEventListener('keydown', e => {
  if (e.target.id === 'recherche' && e.key === 'Enter') { filtreOps.q = e.target.value; filtreOps.tout = true; location.hash = '#/operations'; rendre(); }
});
document.addEventListener('submit', e => {
  if (e.target.id !== 'form-profil') return;
  e.preventDefault(); etat.profil.prenom = e.target.prenom.value.trim(); enregistrer('Profil enregistré.');
});
function rendreGarderFocus(id) {
  const el = document.getElementById(id), pos = el?.selectionStart;
  rendre();
  const n = document.getElementById(id); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (_) { } }
}
function importer(input) {
  const f = input.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result);
      if (!Array.isArray(d.comptes) || !Array.isArray(d.operations) || !Array.isArray(d.categories)) throw new Error();
      if (!confirm(`Restaurer cette sauvegarde (${d.comptes.length} comptes, ${d.operations.length} opérations) ? Vos données actuelles seront remplacées.`)) return;
      etat = Object.assign({ objectifs: [], charges: [], profil: { prenom: '' } }, d);
      moisSel = moisCourant(); enregistrer('Sauvegarde restaurée.');
    } catch (_) { toast("Ce fichier n'est pas une sauvegarde Jack Finance."); }
    input.value = '';
  };
  r.readAsText(f);
}

/* Menu mobile */
$('#bouton-menu').innerHTML = ic('menu');
$('#bouton-menu').addEventListener('click', () => { $('#barre').classList.add('ouverte'); $('#fond-menu').classList.add('visible'); });
$('#fond-menu').addEventListener('click', fermerMenu);
function fermerMenu() { $('#barre').classList.remove('ouverte'); $('#fond-menu').classList.remove('visible'); }

/* ---------- Navigation ---------- */
let derniereRoute = null, minuteurAnim;
function rendre() {
  const [page = 'tableau', param] = location.hash.replace(/^#\/?/, '').split('/');
  const vues = { tableau: vueTableau, comptes: () => vueComptes(param), operations: vueOperations, budgets: vueBudgets, objectifs: vueObjectifs, charges: vueCharges, analyses: vueAnalyses, parametres: vueParametres };
  const vue = vues[page] || vueTableau;
  rendreMenu(vues[page] ? page : 'tableau');
  const route = `${page}/${param || ''}`, el = $('#vue');
  // On anime à chaque changement d'écran, d'onglet ou de mois (pas quand on tape dans une recherche)
  const anim = animerProchain || route !== derniereRoute;
  animerProchain = false; derniereRoute = route;
  el.classList.remove('anim');
  document.querySelector('.info-bulle')?.setAttribute('hidden', '');
  el.innerHTML = vue();
  if (anim) {
    void el.offsetWidth; el.classList.add('anim');
    clearTimeout(minuteurAnim); minuteurAnim = setTimeout(() => el.classList.remove('anim'), 1800);
    animerCompteurs();
  } else el.querySelectorAll('[data-compte]').forEach(x => x.dataset.fait = '1');
  document.title = `Jack Finance — ${(PAGES.find(p => p.id === page) || { nom: page === 'parametres' ? 'Paramètres' : 'Tableau de bord' }).nom}`;
}
window.addEventListener('hashchange', () => { fermerMenu(); rendre(); window.scrollTo(0, 0); });

/* ---------- Présentation ---------- */
function ouvrirPresentation() {
  const pr = $('#presentation'), m = moisCourant();
  const pat = patrimoine(finDeMois(m)), t = totauxMois(m);
  const histo = Array.from({ length: 12 }, (_, i) => patrimoine(finDeMois(decalerMois(m, i - 11))));
  const epargne6 = Array.from({ length: 6 }, (_, i) => { const mm = decalerMois(m, i - 5); return { libelle: moisCourt(mm), valeurs: [Math.max(0, totauxMois(mm).solde)], tips: [`${libelleMois(mm)} : ${euros(totauxMois(mm).solde)}`] }; });
  const totObj = etat.objectifs.reduce((s, o) => s + o.actuel, 0), cibObj = etat.objectifs.reduce((s, o) => s + o.cible, 0);
  const nbP = (v, delai, rond = false) => `<span data-compte="${v}" data-delai="${delai}"${rond ? ' data-rond="1"' : ''}>${euros(v, rond)}</span>`;
  const atouts = [
    ['comptes', 'carte', 'Comptes', 'Courants, épargne, placements : tous vos soldes et leur courbe sur 12 mois.'],
    ['budgets', 'camembert', 'Budgets', 'Un budget par catégorie et le reste à dépenser, en direct.'],
    ['objectifs', 'cible', 'Objectifs', 'Voyage, apport, voiture : suivez chaque projet jusqu\'au bout.'],
    ['analyses', 'barres', 'Analyses', 'Revenus, dépenses, épargne : vos tendances, mois après mois.'],
  ];
  pr.innerHTML = `
    <div class="pr-orbes"><span></span><span></span><span></span></div>
    <svg class="pr-lignes" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="pr-or-ligne" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d6b066" stop-opacity="0"/><stop offset=".5" stop-color="#f2dca5"/><stop offset="1" stop-color="#d6b066" stop-opacity="0"/></linearGradient></defs>
      <path pathLength="1" d="M-60 720 C 320 520, 760 860, 1500 360"/>
      <path pathLength="1" d="M-60 800 C 420 640, 900 900, 1500 470"/>
      <path pathLength="1" d="M-60 180 C 380 300, 1000 40, 1500 220"/>
    </svg>
    <div class="pr-contenu">
      <div class="pr-haut"><div class="pr-mini">${logoSvg('pm')}<span>JACK FINANCE</span></div><button class="pr-passer" data-pr="entrer">Passer ${'›'}</button></div>
      <div class="pr-hero">
        <div class="pr-logo">${logoSvg('pl', true)}</div>
        <h1 class="pr-titre"><span style="animation-delay:.9s">Jack</span> <span class="or" style="animation-delay:1.05s">Finance</span></h1>
        <p class="pr-sous">Votre argent, en clair. Vos projets, en marche.<br>Comptes, budgets, objectifs et analyses — au même endroit, rien qu'à vous.</p>
        <div class="pr-boutons"><button class="btn-or" data-pr="entrer">Entrer dans Jack Finance ${ic('chevron_d')}</button><button class="btn-verre" data-pr="decouvrir">${ic('etoile')} Découvrir</button></div>
      </div>
      <div class="pr-cartes">
        <div class="pr-carte"><div class="eti">${ic('pieces')} Patrimoine net</div><div class="val">${nbP(pat, 1700)}</div>${grapheEtincelle(histo).replace('class="etincelle"', 'class="etincelle" style="width:100%;height:70px"')}</div>
        <div class="pr-carte"><div class="eti">${ic('tirelire')} Épargne de ${NOMS_MOIS[Number(m.slice(5)) - 1].toLowerCase()}</div><div class="val">${nbP(t.solde, 1850)}</div>${grapheBarres(epargne6, ['url(#g-barre)'], { hauteur: 110, largeur: 320 })}</div>
        <div class="pr-carte"><div class="eti">${ic('cible')} Objectifs d'épargne</div><div class="val">${pct(totObj, cibObj)} %</div>
          ${etat.objectifs.slice(0, 3).map(o => `<div class="ligne-obj"><span>${echapper(o.nom)}</span><span>${pct(o.actuel, o.cible)} %</span></div>${progres(pct(o.actuel, o.cible), 'normal')}`).join('') || '<p style="color:#9fb5b1">Créez votre premier objectif.</p>'}
        </div>
      </div>
      <h2 class="pr-section-titre pr-revele" id="pr-decouvrir">Chaque chose à sa place</h2>
      <p class="pr-section-sous pr-revele">Un onglet par sujet, pas tout entassé sur un seul écran. Cliquez pour y aller.</p>
      <div class="pr-atouts">${atouts.map(([id, icone, titre, texte], i) => `<button class="pr-atout pr-revele" style="transition-delay:${i * .1}s" data-pr-aller="${id}"><span class="rond">${ic(icone)}</span><h3>${titre}</h3><p>${texte}</p></button>`).join('')}</div>
      <div class="pr-pied pr-revele"><span style="display:inline-flex;gap:8px;align-items:center">${ic('bouclier')} Vos données restent sur cet ordinateur.</span>
        <label><input type="checkbox" id="pr-auto" ${etat.profil?.intro === false ? '' : 'checked'}> Afficher cette présentation au démarrage</label></div>
    </div>`;
  pr.hidden = false; pr.scrollTop = 0; document.body.style.overflow = 'hidden';
  animerCompteurs();
  const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vu'); obs.unobserve(e.target); } }), { root: pr, threshold: .15 });
  pr.querySelectorAll('.pr-revele').forEach(x => obs.observe(x));
  setTimeout(() => pr.querySelector('.btn-or')?.focus({ preventScroll: true }), 50);
}
function fermerPresentation(dest) {
  const pr = $('#presentation'); if (pr.hidden || pr.classList.contains('sortie')) return;
  pr.classList.add('sortie');
  if (dest) { location.hash = '#/' + dest; }
  animerProchain = true; rendre();
  setTimeout(() => { pr.hidden = true; pr.classList.remove('sortie'); pr.innerHTML = ''; document.body.style.overflow = ''; }, 680);
}
$('#presentation').addEventListener('click', e => {
  const b = e.target.closest('[data-pr], [data-pr-aller]'); if (!b) return;
  if (b.dataset.prAller) return fermerPresentation(b.dataset.prAller);
  if (b.dataset.pr === 'entrer') fermerPresentation();
  if (b.dataset.pr === 'decouvrir') $('#pr-decouvrir').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
$('#presentation').addEventListener('change', e => {
  if (e.target.id === 'pr-auto') { etat.profil.intro = e.target.checked; sauver(); }
});
document.addEventListener('keydown', e => { if (!$('#presentation').hidden && (e.key === 'Escape')) fermerPresentation(); });

$('#marque-logo').innerHTML = logoSvg('m');
rendre();
if (etat.profil?.intro !== false) ouvrirPresentation();
