// Données de Jack Finance : stockage local, données d'exemple et calculs.
const CLE_STOCKAGE = 'jack-finance-v1';

/* ---------- Petits outils ---------- */
const fmtEuro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
const fmtEuroRond = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
function euros(n, rond = false) { return (rond ? fmtEuroRond : fmtEuro).format(Math.round((n || 0) * 100) / 100); }
function eurosSigne(n) { return (n > 0 ? '+ ' : n < 0 ? '− ' : '') + euros(Math.abs(n)); }
function arrondi(n) { return Math.round(n * 100) / 100; }
function nouvelId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function pad(n) { return String(n).padStart(2, '0'); }
function aujourdhui() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function moisDe(date) { return date.slice(0, 7); }
function moisCourant() { return moisDe(aujourdhui()); }
function decalerMois(m, n) {
  const [a, mo] = m.split('-').map(Number);
  const d = new Date(a, mo - 1 + n, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}
function joursDansMois(m) { const [a, mo] = m.split('-').map(Number); return new Date(a, mo, 0).getDate(); }
const NOMS_MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const MOIS_COURTS = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
function libelleMois(m) { const [a, mo] = m.split('-').map(Number); return `${NOMS_MOIS[mo - 1]} ${a}`; }
function moisCourt(m) { return MOIS_COURTS[Number(m.slice(5, 7)) - 1]; }
function dateCourte(date) { const [, mo, j] = date.split('-').map(Number); return `${j} ${MOIS_COURTS[mo - 1].toLowerCase()}`; }
function dateLongue(date) { const [a, mo, j] = date.split('-').map(Number); return `${j} ${NOMS_MOIS[mo - 1].toLowerCase()} ${a}`; }
function echapper(t) { return String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

const TYPES_COMPTE = { courant: 'Compte courant', epargne: 'Épargne', placement: 'Placement' };

/* ---------- Données d'exemple ---------- */
function creerDonneesExemple() {
  // Générateur pseudo-aléatoire fixe : les mêmes exemples à chaque fois
  let graine = 42;
  const alea = () => { graine = (graine * 16807) % 2147483647; return (graine - 1) / 2147483646; };
  const entre = (a, b) => arrondi(a + alea() * (b - a));

  const categories = [
    { id: 'logement', nom: 'Logement', icone: 'maison', type: 'depense', budget: 900 },
    { id: 'alimentation', nom: 'Alimentation', icone: 'panier', type: 'depense', budget: 450 },
    { id: 'restaurants', nom: 'Restaurants', icone: 'couverts', type: 'depense', budget: 150 },
    { id: 'transport', nom: 'Transport', icone: 'carburant', type: 'depense', budget: 200 },
    { id: 'factures', nom: 'Factures & abonnements', icone: 'eclair', type: 'depense', budget: 260 },
    { id: 'loisirs', nom: 'Loisirs', icone: 'manette', type: 'depense', budget: 120 },
    { id: 'shopping', nom: 'Shopping', icone: 'sac', type: 'depense', budget: 120 },
    { id: 'sante', nom: 'Santé', icone: 'coeur', type: 'depense', budget: 60 },
    { id: 'autres', nom: 'Autres', icone: 'points', type: 'depense', budget: 80 },
    { id: 'salaire', nom: 'Salaire', icone: 'salaire', type: 'revenu', budget: 0 },
    { id: 'autres-revenus', nom: 'Autres revenus', icone: 'cadeau', type: 'revenu', budget: 0 },
  ];
  const comptes = [
    { id: 'courant', nom: 'Compte courant', banque: 'Banque principale', type: 'courant', icone: 'banque', couleur: '#1d4f91', cible: 4320 },
    { id: 'joint', nom: 'Compte joint', banque: 'Banque principale', type: 'courant', icone: 'carte', couleur: '#1d4f91', cible: 6780 },
    { id: 'livret-a', nom: 'Livret A', banque: 'Banque principale', type: 'epargne', icone: 'pieces', couleur: '#1d6447', cible: 18000 },
    { id: 'ldds', nom: 'LDDS', banque: 'Banque principale', type: 'epargne', icone: 'pieces', couleur: '#1d6447', cible: 6100 },
    { id: 'pea', nom: 'PEA', banque: 'Courtier en ligne', type: 'placement', icone: 'tendance', couleur: '#7a4a12', cible: 8950 },
    { id: 'assurance-vie', nom: 'Assurance vie', banque: 'Assureur', type: 'placement', icone: 'bouclier', couleur: '#4a1c44', cible: 26400 },
  ];
  const charges = [
    { id: 'loyer', nom: 'Loyer', icone: 'maison', montant: 780, jour: 5, compteId: 'courant', categorieId: 'logement' },
    { id: 'electricite', nom: 'Électricité', icone: 'eclair', montant: 90, jour: 8, compteId: 'courant', categorieId: 'factures' },
    { id: 'internet', nom: 'Internet', icone: 'wifi', montant: 29.99, jour: 10, compteId: 'courant', categorieId: 'factures' },
    { id: 'assurance-hab', nom: 'Assurance habitation', icone: 'bouclier', montant: 25, jour: 12, compteId: 'courant', categorieId: 'logement' },
    { id: 'assurance-auto', nom: 'Assurance auto', icone: 'voiture', montant: 52, jour: 15, compteId: 'courant', categorieId: 'transport' },
    { id: 'mobile', nom: 'Téléphone mobile', icone: 'telephone', montant: 15, jour: 18, compteId: 'courant', categorieId: 'factures' },
    { id: 'abonnements', nom: 'Abonnements', icone: 'ecran', montant: 33.01, jour: 20, compteId: 'courant', categorieId: 'factures' },
  ];
  const objectifs = [
    { id: nouvelId(), nom: 'Voyage au Japon', icone: 'avion', actuel: 3200, cible: 5000 },
    { id: nouvelId(), nom: 'Apport immobilier', icone: 'maison', actuel: 20000, cible: 40000 },
    { id: nouvelId(), nom: 'Nouvelle voiture', icone: 'voiture', actuel: 4400, cible: 10000 },
  ];

  const ops = [];
  const auj = aujourdhui();
  const ajout = (date, libelle, montant, categorieId, compteId, extra = {}) => {
    if (date > auj) return;
    ops.push({ id: nouvelId(), date, libelle, montant: arrondi(montant), categorieId, compteId, ...extra });
  };
  const fin = moisCourant();
  for (let i = 11; i >= 0; i--) {
    const m = decalerMois(fin, -i);
    const nbJ = joursDansMois(m);
    const d = j => `${m}-${pad(Math.min(j, nbJ))}`;
    const hausse = i < 3 ? 1.04 : 1; // petite augmentation récente
    ajout(d(1), 'Salaire', 3450 * (i < 5 ? 1 : 0.97), 'salaire', 'courant');
    if (alea() < 0.25) ajout(d(14), 'Remboursement entre amis', entre(20, 80), 'autres-revenus', 'courant');
    charges.forEach(c => ajout(d(c.jour), c.nom, -c.montant, c.categorieId, c.compteId, { chargeId: c.id }));
    [3, 10, 17, 24].forEach(j => ajout(d(j + Math.floor(alea() * 2)), 'Courses (supermarché)', -entre(55, 105) * hausse, 'alimentation', alea() < .5 ? 'joint' : 'courant'));
    const nbResto = 2 + Math.floor(alea() * 3);
    for (let k = 0; k < nbResto; k++) ajout(d(2 + Math.floor(alea() * 26)), alea() < .5 ? 'Restaurant' : 'Café & boulangerie', -entre(12, 58), 'restaurants', 'courant');
    ajout(d(6), 'Carburant', -entre(52, 72), 'transport', 'courant');
    ajout(d(21), 'Carburant', -entre(52, 72), 'transport', 'courant');
    const nbAchats = 1 + Math.floor(alea() * 3);
    for (let k = 0; k < nbAchats; k++) ajout(d(3 + Math.floor(alea() * 25)), 'Achat en ligne', -entre(18, 75), 'shopping', 'courant');
    if (alea() < .8) ajout(d(13), alea() < .5 ? 'Cinéma' : 'Concert', -entre(14, 45), 'loisirs', 'courant');
    if (alea() < .4) ajout(d(19), 'Pharmacie', -entre(8, 35), 'sante', 'courant');
    if (alea() < .3) ajout(d(23), 'Cadeau', -entre(20, 60), 'autres', 'courant');
    const lien = nouvelId();
    ajout(d(28), 'Virement vers Livret A', -400, 'virement', 'courant', { lienId: lien });
    ajout(d(28), 'Virement depuis Compte courant', 400, 'virement', 'livret-a', { lienId: lien });
    // Variation de la valeur du PEA (plus-values / moins-values)
    ajout(d(30), 'Variation de valeur du PEA', entre(-90, 190), 'autres-revenus', 'pea', { valorisation: true });
  }

  // Soldes initiaux calculés pour retomber sur des soldes actuels réalistes
  comptes.forEach(c => {
    const somme = ops.filter(o => o.compteId === c.id).reduce((s, o) => s + o.montant, 0);
    c.soldeInitial = arrondi(c.cible - somme);
    delete c.cible;
  });

  return { version: 1, profil: { prenom: '', theme: 'vert' }, comptes, categories, operations: ops, objectifs, charges, exemple: true };
}

/* ---------- Chargement / sauvegarde ---------- */
let etat;
function chargerEtat() {
  try {
    const brut = localStorage.getItem(CLE_STOCKAGE);
    if (brut) { etat = JSON.parse(brut); return; }
  } catch (e) { /* stockage indisponible : on part sur les exemples */ }
  etat = creerDonneesExemple();
  sauver();
}
function sauver() {
  try { localStorage.setItem(CLE_STOCKAGE, JSON.stringify(etat)); return true; }
  catch (e) { return false; }
}
function etatVide() {
  const ex = creerDonneesExemple();
  return { version: 1, profil: { prenom: etat?.profil?.prenom || '', theme: etat?.profil?.theme || 'vert' }, comptes: [], categories: ex.categories, operations: [], objectifs: [], charges: [], exemple: false };
}

/* ---------- Accès ---------- */
const compteParId = id => etat.comptes.find(c => c.id === id);
const categorieParId = id => id === 'virement' ? { id: 'virement', nom: 'Virement interne', icone: 'fleches', type: 'virement' } : (etat.categories.find(c => c.id === id) || { id, nom: 'Sans catégorie', icone: 'points', type: 'depense' });
const categoriesDepense = () => etat.categories.filter(c => c.type === 'depense');
const categoriesRevenu = () => etat.categories.filter(c => c.type === 'revenu');

/* ---------- Calculs ---------- */
function opsTriees(liste = etat.operations) { return [...liste].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)); }
function opsDuMois(m) { return etat.operations.filter(o => moisDe(o.date) === m); }
const estVirement = o => o.categorieId === 'virement';

function soldeCompte(c, jusqua = null) {
  return arrondi((c.soldeInitial || 0) + etat.operations
    .filter(o => o.compteId === c.id && (!jusqua || o.date <= jusqua))
    .reduce((s, o) => s + o.montant, 0));
}
function finDeMois(m) { return `${m}-${pad(joursDansMois(m))}`; }
function patrimoine(jusqua = null, filtre = () => true) {
  return arrondi(etat.comptes.filter(filtre).reduce((s, c) => s + soldeCompte(c, jusqua), 0));
}
function totauxMois(m) {
  let revenus = 0, depenses = 0;
  opsDuMois(m).forEach(o => {
    if (estVirement(o) || o.valorisation) return; // ni les virements internes, ni la variation des placements
    if (o.montant > 0) revenus += o.montant; else depenses += -o.montant;
  });
  return { revenus: arrondi(revenus), depenses: arrondi(depenses), solde: arrondi(revenus - depenses) };
}
function depensesParCategorie(m) {
  const tot = {};
  opsDuMois(m).forEach(o => {
    if (estVirement(o) || o.valorisation || o.montant >= 0) return;
    tot[o.categorieId] = (tot[o.categorieId] || 0) - o.montant;
  });
  return Object.entries(tot).map(([id, montant]) => ({ cat: categorieParId(id), montant: arrondi(montant) })).sort((a, b) => b.montant - a.montant);
}
function chargeRegleeCeMois(charge, m) { return etat.operations.find(o => o.chargeId === charge.id && moisDe(o.date) === m); }
