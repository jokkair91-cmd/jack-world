// JACK JEU (3D) : garde le jeu en mémoire pour qu'il s'installe et s'ouvre aussi sans connexion.
// Réseau d'abord : en ligne, on reçoit toujours la dernière version ; hors ligne, on reprend la dernière copie gardée.
// On garde aussi le moteur 3D (Three.js sur cdn.jsdelivr.net).
const CACHE = 'jackworld-jeu3d-2026-11-24';
const DEPART = ['index.html', 'manifest.webmanifest', 'favicon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(DEPART)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // efface aussi les copies de l'ancienne version 2D de ce dossier
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => (key.startsWith('jackworld-jeu3d-') || key.startsWith('jackworld-jeu-')) && key !== CACHE).map(key => caches.delete(key))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  const moteur = url.origin === 'https://cdn.jsdelivr.net' && url.pathname.startsWith('/npm/three@');
  if (req.method !== 'GET' || (url.origin !== location.origin && !moteur)) return;
  event.respondWith(fetch(req).then(response => {
    if (response.ok && (response.type === 'basic' || response.type === 'cors')) {
      const copie = response.clone();
      caches.open(CACHE).then(cache => cache.put(req, copie));
    }
    return response;
  }).catch(() => caches.match(req, { ignoreSearch: !moteur }).then(r => r || (req.mode === 'navigate' ? caches.match(DEPART[0]) : undefined))));
});
