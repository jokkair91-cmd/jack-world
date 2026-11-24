// JACK SPORT : garde l'appli en mémoire pour qu'elle s'ouvre aussi sans connexion.
// Réseau d'abord : en ligne on reçoit la dernière version ; hors ligne, la dernière copie gardée.
// On garde aussi le moteur 3D (Three.js sur cdn.jsdelivr.net).
const CACHE = 'jackworld-sport-app-2026-11-23';
const DEPART = ['index.html', 'style.css', 'app.js', 'data.js', 'mannequin.js', 'jack-sport.svg', 'manifest.webmanifest'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(DEPART)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('jackworld-sport-app-') && key !== CACHE).map(key => caches.delete(key))
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
