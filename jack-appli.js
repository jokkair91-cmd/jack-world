/* Jack World — rend une appli installable sur le téléphone et utilisable sans connexion.
   À ajouter dans la page de l'appli :
     <link rel="manifest" href="manifest.webmanifest">
     <script src="…/jack-appli.js" defer></script>
   Le fichier sw.js doit être dans le même dossier que la page.
   Ne fait rien en double-clic (file://) : le mode hors connexion ne marche que sur le site en ligne. */
(() => {
  'use strict';
  if (!window.isSecureContext || !('serviceWorker' in navigator) || location.protocol === 'file:') return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { scope: './', updateViaCache: 'none' }).catch(() => {});
  });
})();
