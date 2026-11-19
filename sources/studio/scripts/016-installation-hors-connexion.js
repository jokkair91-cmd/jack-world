
(() => {
  'use strict';
  const status = document.getElementById('pwaStatus');
  const button = document.getElementById('pwaInstall');
  let promptEvent = null, cached = false, waiting = false;
  const installed = () => window.matchMedia('(display-mode: standalone)').matches;
  function show() {
    const connection = navigator.onLine ? 'Connexion détectée.' : 'Navigateur hors connexion.';
    status.textContent = (installed() ? 'Application ouverte. ' : '') + connection + ' ' +
      (cached ? 'Fichiers du studio disponibles hors connexion dans ce navigateur ; leur conservation dépend de son stockage.' : 'Disponibilité hors connexion non confirmée.') +
      (waiting ? ' Mise à jour prête : exportez votre projet puis fermez toutes les fenêtres du studio pour l’activer à la prochaine ouverture.' : '');
  }
  function cacheReady(worker) {
    return new Promise(resolve => {
      if (!worker || typeof MessageChannel === 'undefined') return resolve(false);
      const channel = new MessageChannel();
      const finish = value => { clearTimeout(timer); channel.port1.close(); resolve(value); };
      const timer = setTimeout(() => finish(false), 3500);
      channel.port1.onmessage = e => finish(e.data?.type === 'JACK22_CACHE_READY' && e.data.ready === true);
      try { worker.postMessage({type: 'JACK22_CACHE_STATUS'}, [channel.port2]); }
      catch (_) { finish(false); }
    });
  }
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); promptEvent = event; button.hidden = false;
  });
  button.addEventListener('click', async () => {
    if (!promptEvent) return;
    const event = promptEvent; promptEvent = null; button.hidden = true;
    try { await event.prompt(); await event.userChoice; }
    catch (_) { status.textContent = 'Installation indisponible. Le studio reste accessible dans Edge.'; }
  });
  window.addEventListener('appinstalled', () => { promptEvent = null; button.hidden = true; show(); });
  window.addEventListener('online', show); window.addEventListener('offline', show);
  if (location.protocol === 'file:') {
    status.textContent = 'Version locale ouverte. Pour installer l’application Web, il faudra ouvrir sa future adresse HTTPS. Aucun site n’est encore publié.';
    return;
  }
  if (!window.isSecureContext || !('serviceWorker' in navigator)) {
    status.textContent = 'Installation et mode hors connexion indisponibles ici : utiliser Edge sur HTTPS ou localhost pour les essais.';
    return;
  }
  show();
  navigator.serviceWorker.register('./sw.js', {scope: './', updateViaCache: 'none'}).then(reg => {
    waiting = !!reg.waiting; show();
    reg.addEventListener('updatefound', () => {
      const worker = reg.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && reg.waiting) { waiting = true; show(); }
        if (worker.state === 'redundant' && !reg.active) status.textContent = 'Préparation hors connexion échouée. Le studio reste ouvert ; réessayez avec une connexion.';
      });
    });
    return navigator.serviceWorker.ready;
  }).then(async reg => { cached = await cacheReady(reg.active); waiting = !!reg.waiting; show(); })
    .catch(() => { status.textContent = 'Mode hors connexion non préparé. Le studio reste accessible en ligne ; vérifiez la connexion et l’hébergement.'; });
})();

