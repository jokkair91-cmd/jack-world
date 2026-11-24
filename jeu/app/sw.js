// JACK JEU : garde le jeu en mémoire pour qu'il s'installe et s'ouvre aussi sans connexion.
// Réseau d'abord : en ligne, on reçoit toujours la dernière version ; hors ligne, on reprend la dernière copie gardée.
const CACHE = 'jackworld-jeu-2026-11-23';
const DEPART = ['index.html', 'manifest.webmanifest', 'favicon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(DEPART)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('jackworld-jeu-') && key !== CACHE).map(key => caches.delete(key))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  event.respondWith(fetch(req).then(response => {
    if (response.ok && response.type === 'basic') {
      const copie = response.clone();
      caches.open(CACHE).then(cache => cache.put(req, copie));
    }
    return response;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || (req.mode === 'navigate' ? caches.match(DEPART[0]) : undefined))));
});
